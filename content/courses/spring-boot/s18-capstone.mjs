/**
 * spring-boot/s18-capstone.mjs — Chương 18: Dự án cuối khoá LabFlow (soạn 24/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Modulith 2.1.3 / springdoc 3.1.1 / Testcontainers 2.0.5 trên Temurin 21.0.12.1,
 * PostgreSQL 16.16 (postgres:16), Docker Compose; frontend Vite 7.3.8 + React 19.3.1 + openapi-typescript 7.13.0 trên Node 22.
 * Mã: scratchpad/sb/lab/c18/{labflow (dự án mẫu), web (React), thi (đề 18.5: giai, bay, cham.sh), t (kịch bản demo)}.
 * Output: ~/.rtq-sb/c18/o (lọc ⇒ o/web bằng lab/c18/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s18/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 18.1 =====
const MA181_CAY = out("src/main/java/vn/labflow/\n├── LabflowApplication.java          @SpringBootApplication + bean Clock\n├── shared/        (OPEN)            LoiNghiepVu, XuLyLoi (ProblemDetail), ApiDocs\n├── identity/      C1                NguoiDung              ← API công khai\n│   └── internal/                    Account, AccountRepository, AuthController, BaoMat\n├── catalog/       C2                LabCatalog, LabInfo    ← API công khai\n│   └── internal/                    Lab, LabRepository, LabCatalogImpl, LabController\n├── booking/       C3                BookingCreated, BookingDecided  ← sự kiện công khai\n│   └── internal/                    Booking, BookingRepository, BookingService, BookingController, QuyTacDat\n└── notification/  C4                (không công khai gì)\n    └── internal/                    ThongBao (nghe sự kiện), ThongBaoController\nsrc/main/resources/db/migration/\n├── identity/      V2026.11.01.1000__identity_accounts.sql\n├── catalog/       V2026.11.01.1100__catalog_labs.sql\n├── booking/       V2026.11.02.0900__booking_init.sql\n└── notification/  V2026.11.03.0900__notification_init.sql\nweb/ (React + Vite)  C5            api-types.ts sinh từ /v3/api-docs");
const MA181_PKG = java("/** Hạ tầng dùng chung (lỗi nghiệp vụ, ProblemDetail). OPEN: module nào cũng được dùng mọi kiểu trong gói này. */\n@org.springframework.modulith.ApplicationModule(type = org.springframework.modulith.ApplicationModule.Type.OPEN)\npackage vn.labflow.shared;");
const MA181_CATALOG_API = java("/** API CÔNG KHAI của module catalog. booking gọi interface này, không bao giờ chạm LabRepository. */\npublic interface LabCatalog {\n    Optional<LabInfo> timTheoMa(String code);\n    /** Một lần gọi cho cả danh sách (tránh N+1 xuyên module). */\n    Map<Long, LabInfo> theoIds(Collection<Long> ids);\n}");
const MA181_LABINFO = java("/** Thứ module khác được biết về một phòng lab (không phải entity). */\npublic record LabInfo(long id, String code, String name, int capacity, String status, boolean requiresApproval) {\n    public boolean datDuoc() { return status.equals(\"ACTIVE\"); }\n}");
const MA181_EVENT = java("/** Sự kiện CÔNG KHAI: một lượt đặt vừa được ghi (status PENDING hoặc CONFIRMED). Module khác nghe, booking không biết ai nghe. */\npublic record BookingCreated(long bookingId, long ownerId, String labCode, LocalDateTime startAt, LocalDateTime endAt, String status) { }");
const MA181_KT = java("/** Chạy trong CI ở MỌI pull request: ai import lớp nội bộ của module khác, hay tạo vòng phụ thuộc, là build đỏ. */\nclass KienTrucTest {\n    static final ApplicationModules MODULES = ApplicationModules.of(LabflowApplication.class);\n\n    @Test\n    void ranhGioiModuleDuocGiu() {\n        MODULES.forEach(System.out::println);\n        MODULES.verify();\n    }\n\n    @Test\n    void sinhSoDoModule() {\n        new Documenter(MODULES).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml().writeModuleCanvases();\n    }\n}");
const OUT181_MODULES = out("# Shared (open)\n> Logical name: shared\n> Base package: vn.labflow.shared\n  o ….ApiDocs\n  o ….XuLyLoi\n# Catalog\n> Logical name: catalog\n> Base package: vn.labflow.catalog\n  o ….internal.LabCatalogImpl\n  o ….internal.LabController\n  o ….internal.LabRepository\n# Identity\n> Logical name: identity\n> Base package: vn.labflow.identity\n  o javax.crypto.SecretKey\n  o org.springframework.boot.ApplicationRunner\n  o org.springframework.security.crypto.password.PasswordEncoder\n  o org.springframework.security.oauth2.jwt.JwtDecoder\n  o org.springframework.security.oauth2.jwt.JwtEncoder\n  o org.springframework.security.web.SecurityFilterChain\n  o org.springframework.web.cors.CorsConfigurationSource\n  o ….internal.AccountRepository\n  o ….internal.AuthController\n  o ….internal.BaoMat\n# Booking\n> Logical name: booking\n> Base package: vn.labflow.booking\n  o ….internal.BookingController\n  o ….internal.BookingRepository\n  o ….internal.BookingService\n# Notification\n> Logical name: notification\n> Base package: vn.labflow.notification\n  o ….internal.ThongBao\n  o ….internal.ThongBaoController");
const OUT181_VP1 = out("$ mvn test -Dtest=KienTrucTest\n[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0, Time elapsed: 2.450 s <<< FAILURE! -- in vn.labflow.KienTrucTest\norg.springframework.modulith.core.Violations: \n- Module 'booking' depends on non-exposed type vn.labflow.catalog.internal.LabRepository within module 'catalog'!\nBookingService declares constructor BookingService(BookingRepository, LabCatalog, JdbcClient, ApplicationEventPublisher, Clock, LabRepository) in (BookingService.java:0)\nField <vn.labflow.booking.internal.BookingService.labRepo> has type <vn.labflow.catalog.internal.LabRepository> in (BookingService.java:0)\n[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0");
const OUT181_VP2 = out("$ mvn test -Dtest=KienTrucTest\norg.springframework.modulith.core.Violations: \n- Cycle detected: Slice booking -> \n                Slice catalog -> \n                Slice booking\n  1. Dependencies of Slice booking\n    - Constructor <vn.labflow.booking.internal.BookingService.<init>(vn.labflow.booking.internal.BookingRepository, vn.labflow.catalog.LabCatalog, org.springframework.jdbc.core.simple.JdbcClient, org.springframework.context.ApplicationEvent\n    - Field <vn.labflow.booking.internal.BookingService.catalog> has type <vn.labflow.catalog.LabCatalog> in (BookingService.java:0)\n    - Method <vn.labflow.booking.internal.BookingService.view(vn.labflow.booking.internal.Booking, java.util.Map)> has generic parameter type <java.util.Map<java.lang.Long, vn.labflow.catalog.LabInfo>> with type argument depending on <vn.la\n    - Method <vn.labflow.booking.internal.BookingService.dat(vn.labflow.identity.NguoiDung, vn.labflow.booking.internal.BookingService$YeuCauDat, java.lang.String)> calls method <vn.labflow.catalog.LabCatalog.theoIds(java.util.Collection)> \n  2. Dependencies of Slice catalog\n    - Constructor <vn.labflow.catalog.internal.LabController.<init>(vn.labflow.catalog.internal.LabRepository, vn.labflow.booking.LichBan)> has parameter of type <vn.labflow.booking.LichBan> in (LabController.java:0)");
const OUT181_PUML = out("Rel(Booking, Shared, \"depends on\")\nRel(Booking, Identity, \"depends on\")\nRel(Booking, Catalog, \"uses\")\nRel(Notification, Booking, \"listens to\")\nRel(Notification, Identity, \"depends on\")\nRel(Catalog, Shared, \"depends on\")\nRel(Identity, Shared, \"depends on\")");
const MA181_MIG_ID = sql("-- module identity (C1): tài khoản + vai trò. Module khác chỉ giữ account_id, không join bảng này.\ncreate table accounts (\n  id            bigint generated by default as identity primary key,\n  email         varchar(255) not null unique,\n  full_name     varchar(100) not null,\n  password_hash varchar(255) not null,\n  role          varchar(20)  not null default 'STUDENT' check (role in ('STUDENT', 'MANAGER', 'ADMIN')),\n  created_at    timestamptz  not null default now()\n);");
const MA181_MIG_CAT = sql("-- module catalog (C2): phòng lab. BR-06: phòng > 30 chỗ thì lượt đặt cần duyệt.\ncreate table labs (\n  id                bigint generated by default as identity primary key,\n  code              varchar(20)  not null unique,\n  name              varchar(100) not null,\n  building          varchar(20)  not null,\n  capacity          int          not null check (capacity between 1 and 200),\n  status            varchar(20)  not null default 'ACTIVE' check (status in ('ACTIVE', 'MAINTENANCE', 'RETIRED')),\n  requires_approval boolean generated always as (capacity > 30) stored\n);");
const MA181_MIG_BK = sql("-- module booking (C3): trái tim hệ thống. Chống đặt trùng bằng EXCLUSION CONSTRAINT — CSDL từ chối, không phải câu if.\ncreate extension if not exists btree_gist;\ncreate table bookings (\n  id               bigint generated by default as identity primary key,\n  lab_id           bigint       not null,            -- id của module catalog, KHÔNG khoá ngoại chéo module\n  owner_id         bigint       not null,            -- id của module identity\n  start_at         timestamp    not null,\n  end_at           timestamp    not null,\n  status           varchar(20)  not null check (status in ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED')),\n  purpose          varchar(200) not null,\n  reject_reason    varchar(200),\n  idempotency_key  varchar(64)  not null,\n  version          int          not null default 0,\n  created_at       timestamptz  not null default now(),\n  constraint bookings_khung_hop_le check (end_at > start_at),\n  constraint bookings_idem_uq unique (owner_id, idempotency_key),\n  -- BR-04: khoảng nửa mở [start, end); chỉ lượt còn hiệu lực mới giữ chỗ\n  constraint bookings_khong_trung exclude using gist (\n    lab_id with =, tsrange(start_at, end_at, '[)') with &&\n  ) where (status in ('PENDING', 'CONFIRMED'))\n);\ncreate index bookings_owner on bookings (owner_id, start_at);");
const MA181_PROPS = props("# Flyway: MỖI MODULE MỘT THƯ MỤC, một bảng lịch sử chung. Version = dấu thời gian ⇒ hai người không đụng số.\nspring.flyway.locations=classpath:db/migration/identity,classpath:db/migration/catalog,classpath:db/migration/booking,classpath:db/migration/notification");
const OUT181_FLY = out("### A. Đánh số kiểu 1, 2, 3…: hai nhánh cùng tạo V5\n./booking/V3__booking_init.sql\n./booking/V5__booking_note.sql\n./catalog/V2__catalog_labs.sql\n./identity/V1__identity_accounts.sql\n./identity/V5__identity_phone.sql\n./notification/V4__notification_init.sql\nCaused by: FlywayException: Found more than one migration with version 5\n\n### B. Dấu thời gian: không đụng số — nhưng nhánh về MUỘN mang dấu thời gian CŨ\nINFO Successfully applied 5 migrations to schema \"public\", now at version v2026.11.03.0900\nINFO Started LabflowApplication in 8.776 seconds\n-- C2 viết migration hôm 02/11 15:00, review lâu, merge hôm nay (sau khi production đã chạy bản 03/11):\nDetected resolved migration not applied to database: 2026.11.02.1500.\nCaused by: FlywayValidateException: Validate failed: Migrations have failed validation\n-- bật out-of-order (chỉ khi đã hiểu): Flyway chạy bản cũ còn thiếu\nINFO Migrating schema \"public\" to version \"2026.11.02.1500 - catalog lab floor\" [out of order]\nINFO Successfully applied 1 migration to schema \"public\", now at version v2026.11.02.1500\nINFO Started LabflowApplication in 8.168 seconds\n r |     version     |    description    | success \n---+-----------------+-------------------+---------\n 1 | 2026.11.01.1000 | identity accounts | t\n 2 | 2026.11.01.1100 | catalog labs      | t\n 3 | 2026.11.02.0900 | booking init      | t\n 4 | 2026.11.03.0900 | notification init | t\n 5 |                 | dev labs          | t\n 6 | 2026.11.02.1500 | catalog lab floor | t\n(6 rows)");

const L181_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.1 · Capstone</span>
<h2>Specification and domain design</h2>
<p class="lead">This chapter builds one complete API the way a team of five would: LabFlow, a lab-room booking system. It is the same problem as Project 1 of the Node.js course and the backend of the LabFlow AI graduation project (React + Spring Boot + PostgreSQL). Before a single controller exists, this lesson fixes four things that are expensive to change later: what the system must do, where the module borders are, how the database schema is owned, and how five people work without stepping on each other. Every boundary rule below is checked by a test that ran on this machine.</p>

<h3>Everyday picture first</h3>
<p>A food court has five stalls under one roof. They share the building, the electricity and the cashier system, but each stall has its own kitchen, its own fridge and its own staff. A customer orders through the counter, never by walking into a kitchen. If the noodle stall wants rice from the rice stall, it asks at the counter; it does not open the other fridge. That is a <strong>modular monolith</strong>: one application, one deployment, one database server — and inside it, modules that talk only through their counters.</p>

<h3>1. The specification, like a real ticket</h3>
<p>Write the spec as user stories plus <em>numbered business rules</em>. Every unhappy test case later points at one rule number. These are the rules of the LabFlow AI project page, cut to what a capstone can build in a few weeks:</p>
<ul>
  <li><strong>US-1</strong> As a student I register with my school email and log in. <em>BR-01</em>: email must end with <code>@fpt.edu.vn</code>.</li>
  <li><strong>US-2</strong> As anyone I browse labs (search, filter by building, sort, paginate).</li>
  <li><strong>US-3</strong> As a student I book a lab for a time range. <em>BR-04</em>: half-open range <code>[start, end)</code>, on a 30-minute grid, 07:00–21:00, at most 4 hours, in the future, at most 14 days ahead. <em>BR-05</em>: at most 6 booked hours per week. <em>BR-11</em>: only labs in status ACTIVE.</li>
  <li><strong>US-4</strong> Two people can never hold the same lab at the same time — even if they click at the same millisecond. Clicking twice because the network is slow must not create two bookings.</li>
  <li><strong>US-5</strong> <em>BR-06</em>: labs with more than 30 seats need a manager's approval (PENDING → CONFIRMED or REJECTED, rejecting needs a reason).</li>
  <li><strong>US-6</strong> <em>BR-07</em>: the owner can cancel until 2 hours before the start. Nobody else can see or cancel someone's booking.</li>
  <li><strong>US-7</strong> The owner is notified when a booking is created, approved or rejected — and a slow email must not slow down the booking.</li>
</ul>
<p>Non-functional requirements belong in the spec too: errors in one format (RFC 9457 + a stable <code>code</code>), an OpenAPI contract, tests on a real PostgreSQL, one-command start with Docker Compose, CI on every pull request. Lessons 18.2–18.4 build each of them.</p>

<h3>2. Modules: split by business capability, not by layer</h3>
<p>A layered layout (<code>controllers/</code>, <code>services/</code>, <code>repositories/</code>) scatters "cancel a booking" across three folders and gives five people no clear ownership. Split by capability instead — the same package-by-feature layout as the LabFlow AI project page:</p>
${MA181_CAY}
<p>The convention is Spring Modulith's: every direct sub-package of <code>vn.labflow</code> is a module. Types in the module's top package are its <strong>public API</strong>; everything under <code>internal</code> is private to the module. Booking needs to know whether a lab exists and needs approval, so catalog publishes exactly that — an interface and a record, not the entity:</p>
${MA181_CATALOG_API}
${MA181_LABINFO}
<p>Notification must react when a booking is created, but booking must not know notification exists. So booking publishes an event as a public record; whoever cares listens (lesson 18.2 shows the listener):</p>
${MA181_EVENT}
<p><code>shared</code> holds the common error type and is declared OPEN, so every module may use all of it:</p>
${MA181_PKG}

<h3>3. Rules that keep a monolith splittable</h3>
<ol>
  <li><strong>Call other modules only through their public API</strong> (interface, record, event). Never import <code>…internal…</code> of another module.</li>
  <li><strong>No dependency cycles</strong> between modules. Draw the arrows: catalog never calls booking.</li>
  <li><strong>No joins and no foreign keys across modules.</strong> <code>bookings.lab_id</code> is a plain <code>bigint</code>; booking asks catalog for lab data through <code>LabCatalog.theoIds(...)</code> — one call per page, not one per row.</li>
  <li><strong>No transaction that spans modules.</strong> Booking commits its own row; notification does its work after the commit, in its own transaction.</li>
  <li><strong>Each module owns its schema</strong> in its own Flyway folder (section 5).</li>
</ol>
<p>A rule that is only written in a document will be broken in week 3 by someone in a hurry. So it is a test that runs in CI on every pull request:</p>
${MA181_KT}
<p>On the correct code, Spring Modulith prints the modules it found and the test is green:</p>
${OUT181_MODULES}
<p><strong>Breaking rule 1, for real.</strong> A teammate in a hurry injects catalog's repository straight into <code>BookingService</code> (and makes it <code>public</code> so it compiles). The build turns red, naming the file and the type:</p>
${OUT181_VP1}
<p><strong>Breaking rule 2, for real.</strong> Someone wants "a lab can only be retired if it has no future bookings", so <code>LabController</code> asks booking — while booking already asks catalog:</p>
${OUT181_VP2}
<p>The fix is a direction decision, not a workaround: booking listens to a <code>LabRetired</code> event, or the check moves into booking ("retire" becomes a booking-side command). Writing this down as an ADR (architecture decision record) is exactly what a project defence asks for.</p>
<p>The same test also writes diagrams (C4 PlantUML) of the real dependencies into <code>target/spring-modulith-docs</code> — put them in the design report instead of drawing by hand:</p>
${OUT181_PUML}

<h3>4. The schema, module by module</h3>
${MA181_MIG_ID}
${MA181_MIG_CAT}
${MA181_MIG_BK}
<p>Three decisions here are the ones a review board asks about:</p>
<ul>
  <li><strong>The exclusion constraint</strong> <code>bookings_khong_trung</code>: PostgreSQL itself refuses two active rows of the same lab whose ranges overlap (<code>&amp;&amp;</code> on <code>tsrange(start, end, '[)')</code>). Not an <code>if</code> in Java — lesson 18.3 fires 50 simultaneous requests at it. <code>btree_gist</code> is needed to mix <code>=</code> on a number with <code>&amp;&amp;</code> on a range. MySQL has no equivalent (that is why LabFlow AI asks the lecturer to approve PostgreSQL in week 1).</li>
  <li><strong><code>unique (owner_id, idempotency_key)</code></strong>: the double-click rule (US-4) is also enforced by the database.</li>
  <li><strong>A generated column</strong> <code>requires_approval</code>: BR-06 lives in one place.</li>
</ul>

<h3>5. Flyway per module: two traps measured</h3>
<p>One history table, one folder per module, listed in the configuration:</p>
${MA181_PROPS}
<p>Why timestamps instead of V1, V2, V3? Because five people branch at the same time. Both traps below were run on copies of this project against a clean PostgreSQL:</p>
${OUT181_FLY}
<ul>
  <li><strong>Trap A</strong> — with sequential numbers, C1 and C3 both create "the next one", V5, on their branches. After merging, the application refuses to start. Timestamps (<code>V2026.11.24.1430__…</code>) make a collision practically impossible.</li>
  <li><strong>Trap B</strong> — timestamps do not fix ordering. C2 wrote a migration on 02/11 at 15:00, the review took a week, and production had already applied 03/11. Flyway refuses an older migration that was never applied ("Detected resolved migration not applied to database"). <code>spring.flyway.out-of-order=true</code> applies it, marked <code>[out of order]</code>, and the history shows rank 6 with an older version. Only enable it if older migrations never depend on newer ones — which is exactly what module-owned folders give you. The other remedy is a team rule: rebase, then rename the file to the merge time.</li>
</ul>

<h3>6. Five people, five modules</h3>
<table>
  <thead><tr><th>Member</th><th>Owns</th><th>Public API they promise</th><th>Typical screens (SWP391)</th></tr></thead>
  <tbody>
    <tr><td>C1</td><td>identity + security</td><td><code>NguoiDung</code> from the JWT</td><td>register, login, profile, user admin</td></tr>
    <tr><td>C2</td><td>catalog</td><td><code>LabCatalog</code>, <code>LabInfo</code></td><td>lab list/detail, lab admin</td></tr>
    <tr><td>C3</td><td>booking</td><td>events <code>BookingCreated</code>, <code>BookingDecided</code></td><td>create/cancel booking, approval queue, schedule</td></tr>
    <tr><td>C4</td><td>notification (+ reports later)</td><td>— (only listens)</td><td>notifications, dashboard</td></tr>
    <tr><td>C5</td><td>web (React) + CI/Docker</td><td>generated TypeScript client</td><td>layout, routing, shared table/form</td></tr>
  </tbody>
</table>
<p>Splitting by module (vertical) rather than by layer is also what the SWP391 grading needs: each member owns whole screens end to end. Working agreements that keep the five from colliding:</p>
<ul>
  <li><strong>Contract first.</strong> Agree request/response JSON and error codes for a story before coding; C5 starts the screen from the agreed contract while C3 builds the endpoint. In 18.4 the contract is generated from the running code and diffed on every change.</li>
  <li><strong>Ownership in the repository.</strong> A <code>CODEOWNERS</code> file (GitHub) makes the module owner a required reviewer, e.g. <code>/src/main/java/vn/labflow/booking/ @c3</code> and <code>/src/main/resources/db/migration/booking/ @c3</code> (example — use real usernames).</li>
  <li><strong>Small pull requests, merged daily</strong>, each with its tests; CI runs <code>KienTrucTest</code> + Testcontainers (18.3).</li>
  <li><strong>Changing another module's API</strong> is a conversation and a PR reviewed by its owner, never a quiet edit.</li>
</ul>
<div class="callout warn"><p><strong>For your own graduation project:</strong> this chapter is a reference to compare against, not code to copy. Write your project yourself, then use these lessons to check your design decisions and the traps you might have missed.</p></div>

<h3>🕵️ Hacker corner — T-Mobile API, 2022–2023</h3>
<p>On 19 January 2023 T-Mobile US disclosed that an attacker had abused one of its APIs since around 25 November 2022 to pull data of about 37 million customer accounts (name, address, email, phone, date of birth). The API returned more than the caller should see, and nobody noticed the abnormal volume for about six weeks. The lesson for a spec: authorisation and data exposure are <em>requirements</em>, written per story — "nobody else can see or cancel someone's booking" (US-6), "the schedule shows busy slots without owner names" — and later each gets a test (18.3) and a rate limit/monitoring item (chapters 10 and 15).</p>

<h3>Compared with Node.js</h3>
<p>The same design works in Express or NestJS: one folder per module, an <code>index.ts</code> per module that exports only the public API, and a lint rule (<code>eslint-plugin-boundaries</code> or dependency-cruiser) instead of Spring Modulith; migrations per module with Prisma or node-pg-migrate. NestJS modules make the borders visible through <code>exports</code>, but nothing stops an import of an internal file — you still need the boundary check in CI.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Monolith or microservices for a new team of five?"</strong> — A modular monolith: one deployment, one database server, but enforced module borders, events between modules, no cross-module joins or transactions. It can be split later along those borders; microservices from day one add network failures, distributed transactions and DevOps work a small team cannot afford.</li>
  <li><strong>"How do you enforce module boundaries?"</strong> — A test in CI (Spring Modulith <code>verify()</code> or ArchUnit) that fails on access to internal packages and on cycles; plus CODEOWNERS for review.</li>
  <li><strong>"How do you prevent double booking?"</strong> — Let the database refuse: an exclusion constraint on (lab, time range) for active rows, plus an idempotency key per user. Check-then-insert in Java races.</li>
  <li><strong>"How do several developers manage migrations?"</strong> — Versioned scripts in Git, never edited after release; timestamp versions to avoid collisions; folder per module; out-of-order only when migrations are independent; validate in CI against a clean database.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write two more user stories for LabFlow with rule numbers: "a student joins a waitlist when a slot is taken" and "a manager blocks a lab for maintenance". For each, name the module that owns it and the public API or event it needs from other modules.</li>
  <li>Decide where "a lab can only be retired if it has no future bookings" lives without creating a cycle. Write a five-line ADR (context, options, decision, consequences).</li>
  <li>Sketch the Flyway migration for the waitlist table: which folder, which file name, and which constraint makes "one person, one place in the queue per slot" a database rule?</li>
</ol>
<p><strong>Done when:</strong> every story has a rule number and an owner, the ADR removes the cycle, and the migration has a constraint, not an <code>if</code>.</p></div>
${giai('Show one possible answer', `<p>1. Waitlist belongs to booking (it is about slots), listens to <code>BookingCancelled</code> to promote the next person, and publishes <code>WaitlistPromoted</code> for notification. Maintenance block belongs to catalog (lab status); booking reads it through <code>LabCatalog</code> (status MAINTENANCE ⇒ 422 LAB_UNAVAILABLE).</p><p>2. ADR: <em>Context</em> catalog→booking would create a cycle. <em>Options</em> (a) catalog calls booking, (b) booking owns "retire" and calls catalog, (c) catalog publishes <code>LabRetirementRequested</code>, booking answers with an event. <em>Decision</em> (b): the rule is about bookings. <em>Consequences</em> the retire endpoint lives in booking; catalog only exposes a status change.</p><p>3. Folder <code>db/migration/booking</code>, file <code>V2026.11.24.1500__booking_waitlist.sql</code>, <code>unique (lab_id, start_at, end_at, account_id)</code> plus a position column; the promotion order is <code>order by created_at, id</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Modular monolith</strong> — one deployable application split into modules with enforced borders.</li>
  <li><strong>Public API of a module</strong> — the types other modules may use (here: the module's top package); everything else is internal.</li>
  <li><strong>Domain event</strong> — a record saying something happened ("booking created"), published by the owner, consumed by anyone.</li>
  <li><strong>Exclusion constraint</strong> — a PostgreSQL constraint that forbids two rows whose values conflict under given operators (here: same lab and overlapping range).</li>
  <li><strong>ADR</strong> — architecture decision record: a short note of a decision and why.</li>
  <li><strong>Out-of-order migration</strong> — applying a migration whose version is lower than the latest applied one.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Spec = user stories + numbered business rules + non-functional requirements; every unhappy test points to a rule.</li>
  <li>Split by business capability: identity, catalog, booking, notification, plus an OPEN shared module.</li>
  <li>Modules talk through public interfaces, records and events; no internal imports, no cycles, no cross-module joins or transactions.</li>
  <li><code>ApplicationModules.verify()</code> in CI turned both violations red: an internal repository import and a booking↔catalog cycle.</li>
  <li>Flyway: a folder per module, timestamp versions. Sequential V5 twice ⇒ "Found more than one migration with version 5"; a late older migration ⇒ refused until out-of-order.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-modulith/reference/', '🧩', 'Spring Modulith — reference', 'Modules, verification, events, documentation.')}
${tl('https://martinfowler.com/bliki/MonolithFirst.html', '📐', 'Martin Fowler — MonolithFirst', 'Why most successful microservice systems started as a monolith.')}
${tl('https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations', '🪶', 'Flyway — versioned migrations', 'Naming, ordering, out-of-order.')}
${tl('https://www.postgresql.org/docs/16/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION', '🐘', 'PostgreSQL 16 — exclusion constraints', 'EXCLUDE USING gist.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>KienTrucTest</code> in <code>lab/c18/labflow</code> and two copies with the violations (<code>~/.rtq-sb/c18/vp1</code>, <code>vp2</code>); <code>t/181-flyway.sh</code> on copies of <code>target/</code> against PostgreSQL 16.16; Spring Boot 4.1.2, Spring Modulith 2.1.3, Flyway 12.4.0 (24/11/2026).</li>
  <li>T-Mobile: Form 8-K filed with the US SEC on 19/01/2023.</li>
</ul>
</div>
`;

const L181_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.1 · Dự án cuối khoá</span>
<h2>Đặc tả và thiết kế domain</h2>
<p class="lead">Chương này dựng trọn một API theo đúng cách một nhóm năm người làm: LabFlow, hệ thống đặt lịch phòng lab. Đây là cùng bài toán với Dự án 1 của khoá Node.js và là phần backend của đồ án LabFlow AI (React + Spring Boot + PostgreSQL). Trước khi có controller nào, bài này chốt bốn thứ mà đổi về sau rất đắt: hệ thống phải làm gì, ranh giới module nằm ở đâu, ai sở hữu phần nào của schema, và năm người làm việc thế nào để không giẫm chân nhau. Mọi luật ranh giới dưới đây đều được một test kiểm, và test đó đã chạy thật trên máy này.</p>

<h3>Đời thường trước đã</h3>
<p>Một khu ẩm thực có năm quầy dưới cùng một mái nhà. Họ dùng chung toà nhà, điện và hệ thống thu ngân, nhưng mỗi quầy có bếp riêng, tủ lạnh riêng, nhân viên riêng. Khách gọi món qua quầy, không ai bước thẳng vào bếp. Quầy mì cần cơm của quầy cơm thì hỏi qua quầy, không tự mở tủ lạnh nhà bên. Đó là <strong>modular monolith</strong> (khối nguyên khối chia module): một ứng dụng, một lần triển khai, một máy chủ CSDL — và bên trong là các module chỉ nói chuyện với nhau qua "quầy" của mình.</p>

<h3>1. Đặc tả, viết như một phiếu việc thật</h3>
<p>Viết đặc tả bằng user story kèm <em>business rule có đánh số</em>. Về sau, mỗi ca test "không vui" đều chỉ vào một số luật. Đây là các luật trên trang dự án LabFlow AI, cắt gọn còn phần một dự án cuối khoá làm được trong vài tuần:</p>
<ul>
  <li><strong>US-1</strong> Là sinh viên, tôi đăng ký bằng email trường rồi đăng nhập. <em>BR-01</em>: email phải có đuôi <code>@fpt.edu.vn</code>.</li>
  <li><strong>US-2</strong> Ai cũng xem được danh sách phòng (tìm, lọc theo toà, sắp xếp, phân trang).</li>
  <li><strong>US-3</strong> Là sinh viên, tôi đặt một phòng cho một khoảng giờ. <em>BR-04</em>: khoảng nửa mở <code>[start, end)</code>, tròn 30 phút, trong 07:00–21:00, tối đa 4 giờ, ở tương lai, đặt trước tối đa 14 ngày. <em>BR-05</em>: tối đa 6 giờ mỗi tuần. <em>BR-11</em>: chỉ phòng đang ACTIVE.</li>
  <li><strong>US-4</strong> Hai người không bao giờ cùng giữ một phòng trong cùng một khoảng giờ — kể cả khi bấm cùng một mili giây. Mạng chậm, bấm hai lần cũng không được thành hai lượt.</li>
  <li><strong>US-5</strong> <em>BR-06</em>: phòng trên 30 chỗ cần quản lý duyệt (PENDING → CONFIRMED hoặc REJECTED, từ chối phải có lý do).</li>
  <li><strong>US-6</strong> <em>BR-07</em>: chủ lượt được huỷ tới trước giờ bắt đầu 2 tiếng. Không ai khác xem hay huỷ được lượt của người khác.</li>
  <li><strong>US-7</strong> Chủ lượt nhận thông báo khi lượt được tạo, được duyệt hay bị từ chối — và gửi email chậm không được làm chậm việc đặt.</li>
</ul>
<p>Yêu cầu phi chức năng cũng nằm trong đặc tả: lỗi một khuôn (RFC 9457 + <code>code</code> ổn định), hợp đồng OpenAPI, test trên PostgreSQL thật, chạy cả hệ thống bằng một lệnh Docker Compose, CI ở mọi pull request. Bài 18.2–18.4 dựng từng thứ một.</p>

<h3>2. Module: chia theo năng lực nghiệp vụ, không chia theo tầng</h3>
<p>Chia theo tầng (<code>controllers/</code>, <code>services/</code>, <code>repositories/</code>) làm việc "huỷ một lượt đặt" rải ra ba thư mục, và năm người không ai rõ mình sở hữu gì. Hãy chia theo năng lực — đúng cách chia package-by-feature trên trang dự án LabFlow AI:</p>
${MA181_CAY}
<p>Quy ước là của Spring Modulith: mỗi package con trực tiếp của <code>vn.labflow</code> là một module. Kiểu nằm ở package gốc của module là <strong>API công khai</strong>; mọi thứ dưới <code>internal</code> là riêng của module. Booking cần biết phòng có tồn tại và có cần duyệt không, nên catalog công khai đúng chừng đó — một interface và một record, không phải entity:</p>
${MA181_CATALOG_API}
${MA181_LABINFO}
<p>Notification phải phản ứng khi có lượt đặt mới, nhưng booking không được biết notification tồn tại. Vì vậy booking phát một sự kiện dưới dạng record công khai; ai quan tâm thì nghe (bài 18.2 có phần nghe):</p>
${MA181_EVENT}
<p><code>shared</code> chứa kiểu lỗi dùng chung và được khai báo OPEN, nên module nào cũng dùng được mọi thứ trong đó:</p>
${MA181_PKG}

<h3>3. Những luật giữ cho khối nguyên khối còn tách được</h3>
<ol>
  <li><strong>Chỉ gọi module khác qua API công khai</strong> (interface, record, sự kiện). Không bao giờ import <code>…internal…</code> của module khác.</li>
  <li><strong>Không có vòng phụ thuộc</strong> giữa các module. Vẽ mũi tên ra: catalog không bao giờ gọi booking.</li>
  <li><strong>Không join, không khoá ngoại chéo module.</strong> <code>bookings.lab_id</code> chỉ là <code>bigint</code>; booking hỏi catalog qua <code>LabCatalog.theoIds(...)</code> — một lần gọi cho cả trang, không phải một lần mỗi dòng.</li>
  <li><strong>Không giao dịch nào trùm nhiều module.</strong> Booking commit dòng của mình; notification làm việc của nó sau commit, trong giao dịch riêng.</li>
  <li><strong>Mỗi module sở hữu schema của mình</strong> trong một thư mục Flyway riêng (mục 5).</li>
</ol>
<p>Luật chỉ nằm trên giấy sẽ bị phá vào tuần thứ ba bởi một người đang vội. Nên nó là một test chạy trong CI ở mọi pull request:</p>
${MA181_KT}
<p>Trên mã đúng, Spring Modulith in ra các module nó tìm thấy và test xanh:</p>
${OUT181_MODULES}
<p><strong>Phá luật 1, chạy thật.</strong> Một bạn đang vội tiêm thẳng repository của catalog vào <code>BookingService</code> (và đổi nó thành <code>public</code> cho biên dịch được). Build đỏ ngay, chỉ đúng tệp và đúng kiểu:</p>
${OUT181_VP1}
<p><strong>Phá luật 2, chạy thật.</strong> Có người muốn "chỉ cho ngừng dùng một phòng khi không còn lượt đặt sắp tới", nên <code>LabController</code> hỏi booking — trong khi booking vốn đã hỏi catalog:</p>
${OUT181_VP2}
<p>Cách sửa là quyết định chiều phụ thuộc, không phải lách: hoặc booking nghe một sự kiện <code>LabRetired</code>, hoặc phép kiểm chuyển hẳn về booking ("ngừng dùng phòng" thành một lệnh phía booking). Ghi lại thành một ADR (biên bản quyết định kiến trúc) — đúng thứ hội đồng bảo vệ hay hỏi.</p>
<p>Cùng test đó còn ghi sơ đồ (C4 PlantUML) của phụ thuộc THẬT vào <code>target/spring-modulith-docs</code> — đưa thẳng vào báo cáo thiết kế thay vì vẽ tay:</p>
${OUT181_PUML}

<h3>4. Schema, theo từng module</h3>
${MA181_MIG_ID}
${MA181_MIG_CAT}
${MA181_MIG_BK}
<p>Ba quyết định ở đây là thứ hội đồng hay hỏi:</p>
<ul>
  <li><strong>Exclusion constraint</strong> <code>bookings_khong_trung</code>: chính PostgreSQL từ chối hai dòng còn hiệu lực cùng phòng có khoảng giờ chồng nhau (<code>&amp;&amp;</code> trên <code>tsrange(start, end, '[)')</code>). Không phải một câu <code>if</code> trong Java — bài 18.3 bắn 50 request cùng lúc vào nó. Cần <code>btree_gist</code> để trộn phép <code>=</code> trên số với <code>&amp;&amp;</code> trên khoảng. MySQL không có thứ tương đương (vì vậy đồ án LabFlow AI xin giảng viên duyệt PostgreSQL ngay tuần 1).</li>
  <li><strong><code>unique (owner_id, idempotency_key)</code></strong>: luật bấm hai lần (US-4) cũng do CSDL giữ.</li>
  <li><strong>Cột sinh</strong> <code>requires_approval</code>: BR-06 chỉ nằm ở một chỗ.</li>
</ul>

<h3>5. Flyway theo module: đo thật hai cái bẫy</h3>
<p>Một bảng lịch sử, mỗi module một thư mục, liệt kê trong cấu hình:</p>
${MA181_PROPS}
<p>Sao lại dùng dấu thời gian thay cho V1, V2, V3? Vì năm người tách nhánh cùng lúc. Cả hai bẫy dưới đây chạy trên bản sao của dự án này, với PostgreSQL sạch:</p>
${OUT181_FLY}
<ul>
  <li><strong>Bẫy A</strong> — đánh số tuần tự, C1 và C3 cùng tạo "cái tiếp theo" là V5 trên nhánh của mình. Gộp nhánh xong, ứng dụng không chịu khởi động. Dấu thời gian (<code>V2026.11.24.1430__…</code>) làm chuyện trùng số gần như không thể xảy ra.</li>
  <li><strong>Bẫy B</strong> — dấu thời gian không giải quyết thứ tự. C2 viết migration lúc 15:00 ngày 02/11, review mất một tuần, trong khi production đã chạy bản 03/11. Flyway từ chối một migration cũ hơn mà chưa từng chạy ("Detected resolved migration not applied to database"). Bật <code>spring.flyway.out-of-order=true</code> thì nó chạy, gắn nhãn <code>[out of order]</code>, và lịch sử có dòng hạng 6 mang version cũ hơn. Chỉ bật khi migration cũ không bao giờ phụ thuộc migration mới — đúng thứ mà "mỗi module một thư mục" mang lại. Cách khác là luật nhóm: rebase rồi đổi tên tệp theo giờ gộp.</li>
</ul>

<h3>6. Năm người, năm module</h3>
<table>
  <thead><tr><th>Thành viên</th><th>Sở hữu</th><th>API công khai cam kết</th><th>Màn hình tiêu biểu (SWP391)</th></tr></thead>
  <tbody>
    <tr><td>C1</td><td>identity + bảo mật</td><td><code>NguoiDung</code> đọc từ JWT</td><td>đăng ký, đăng nhập, hồ sơ, quản lý người dùng</td></tr>
    <tr><td>C2</td><td>catalog</td><td><code>LabCatalog</code>, <code>LabInfo</code></td><td>danh sách/chi tiết phòng, quản lý phòng</td></tr>
    <tr><td>C3</td><td>booking</td><td>sự kiện <code>BookingCreated</code>, <code>BookingDecided</code></td><td>đặt/huỷ lượt, hàng chờ duyệt, lịch phòng</td></tr>
    <tr><td>C4</td><td>notification (+ báo cáo về sau)</td><td>— (chỉ nghe)</td><td>thông báo, dashboard</td></tr>
    <tr><td>C5</td><td>web (React) + CI/Docker</td><td>client TypeScript sinh tự động</td><td>khung trang, định tuyến, bảng/form dùng chung</td></tr>
  </tbody>
</table>
<p>Chia theo module (theo chiều dọc) chứ không theo tầng cũng là thứ cách chấm SWP391 cần: mỗi thành viên sở hữu trọn màn hình của mình từ đầu tới cuối. Những thoả thuận giữ cho năm người không đụng nhau:</p>
<ul>
  <li><strong>Hợp đồng trước.</strong> Chốt JSON yêu cầu/trả về và mã lỗi của một story trước khi viết mã; C5 làm màn hình theo hợp đồng đã chốt trong lúc C3 viết endpoint. Ở 18.4, hợp đồng được sinh từ chính mã đang chạy và so lại sau mỗi thay đổi.</li>
  <li><strong>Quyền sở hữu nằm trong repo.</strong> Tệp <code>CODEOWNERS</code> (GitHub) bắt chủ module phải duyệt, ví dụ <code>/src/main/java/vn/labflow/booking/ @c3</code> và <code>/src/main/resources/db/migration/booking/ @c3</code> (ví dụ — thay bằng tên tài khoản thật).</li>
  <li><strong>Pull request nhỏ, gộp mỗi ngày</strong>, kèm test; CI chạy <code>KienTrucTest</code> + Testcontainers (18.3).</li>
  <li><strong>Đổi API của module người khác</strong> là một cuộc trao đổi và một PR do chính chủ duyệt, không bao giờ là một lần sửa lặng lẽ.</li>
</ul>
<div class="callout warn"><p><strong>Với đồ án của chính bạn:</strong> chương này là bản để đối chiếu, không phải mã để chép. Hãy tự viết dự án của mình, rồi dùng các bài này để soát quyết định thiết kế và những cái bẫy có thể đã bỏ sót.</p></div>

<h3>🕵️ Góc hacker — API của T-Mobile, 2022–2023</h3>
<p>Ngày 19/01/2023, T-Mobile Mỹ công bố kẻ tấn công đã lạm dụng một API của họ từ khoảng 25/11/2022 để rút dữ liệu của khoảng 37 triệu tài khoản (tên, địa chỉ, email, số điện thoại, ngày sinh). API trả về nhiều hơn mức người gọi được thấy, và suốt khoảng sáu tuần không ai để ý lưu lượng bất thường. Bài học cho đặc tả: phân quyền và mức lộ dữ liệu là <em>yêu cầu</em>, viết theo từng story — "không ai khác xem hay huỷ được lượt của người khác" (US-6), "lịch phòng chỉ hiện giờ bận, không hiện tên người đặt" — rồi mỗi dòng có một test (18.3) và một mục giới hạn tần suất/giám sát (chương 10 và 15).</p>

<h3>So với Node.js</h3>
<p>Thiết kế này dùng y được cho Express hay NestJS: mỗi module một thư mục, mỗi module một <code>index.ts</code> chỉ export API công khai, và một luật lint (<code>eslint-plugin-boundaries</code> hoặc dependency-cruiser) thay cho Spring Modulith; migration theo module bằng Prisma hoặc node-pg-migrate. Module của NestJS làm ranh giới hiện rõ qua <code>exports</code>, nhưng không có gì cấm import thẳng một tệp nội bộ — vẫn cần bước kiểm ranh giới trong CI.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Nhóm mới năm người: monolith hay microservices?"</strong> — Modular monolith: một lần triển khai, một máy chủ CSDL, nhưng ranh giới module được ép bằng test, giữa các module dùng sự kiện, không join hay giao dịch chéo module. Về sau tách được theo đúng các ranh giới đó; còn microservices từ ngày đầu kéo theo lỗi mạng, giao dịch phân tán và việc DevOps mà nhóm nhỏ không kham nổi.</li>
  <li><strong>"Làm sao giữ ranh giới module?"</strong> — Một test trong CI (Spring Modulith <code>verify()</code> hoặc ArchUnit) đỏ khi có truy cập package nội bộ hoặc vòng phụ thuộc; thêm CODEOWNERS để review.</li>
  <li><strong>"Chống đặt trùng thế nào?"</strong> — Để CSDL từ chối: exclusion constraint trên (phòng, khoảng giờ) cho các dòng còn hiệu lực, cộng khoá idempotency theo người dùng. Kiểm rồi mới ghi trong Java thì bị đua.</li>
  <li><strong>"Nhiều người cùng viết migration thì quản lý ra sao?"</strong> — Script có version trong Git, không sửa sau khi đã phát hành; version bằng dấu thời gian để khỏi trùng; mỗi module một thư mục; chỉ bật out-of-order khi migration độc lập; CI kiểm trên CSDL sạch.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết thêm hai user story cho LabFlow kèm số luật: "sinh viên vào hàng chờ khi khung giờ đã có người" và "quản lý khoá phòng để bảo trì". Với mỗi story, chỉ ra module sở hữu và API công khai hay sự kiện nó cần từ module khác.</li>
  <li>Quyết định luật "chỉ ngừng dùng phòng khi không còn lượt sắp tới" nằm ở đâu mà không tạo vòng. Viết một ADR năm dòng (bối cảnh, phương án, quyết định, hệ quả).</li>
  <li>Phác migration cho bảng hàng chờ: thư mục nào, tên tệp nào, và ràng buộc nào biến "mỗi người một chỗ trong hàng của một khung giờ" thành luật của CSDL?</li>
</ol>
<p><strong>Đạt khi:</strong> mọi story có số luật và chủ sở hữu, ADR gỡ được vòng, và migration dùng ràng buộc chứ không dùng <code>if</code>.</p></div>
${giai('Xem một đáp án khả dĩ', `<p>1. Hàng chờ thuộc booking (nó nói về khung giờ), nghe <code>BookingCancelled</code> để đôn người kế tiếp, và phát <code>WaitlistPromoted</code> cho notification. Khoá phòng bảo trì thuộc catalog (trạng thái phòng); booking đọc qua <code>LabCatalog</code> (MAINTENANCE ⇒ 422 LAB_UNAVAILABLE).</p><p>2. ADR: <em>Bối cảnh</em> catalog→booking sẽ tạo vòng. <em>Phương án</em> (a) catalog gọi booking, (b) booking sở hữu việc "ngừng dùng" và gọi catalog, (c) catalog phát <code>LabRetirementRequested</code>, booking trả lời bằng sự kiện. <em>Quyết định</em> (b): luật này nói về lượt đặt. <em>Hệ quả</em> endpoint ngừng dùng nằm ở booking; catalog chỉ công khai việc đổi trạng thái.</p><p>3. Thư mục <code>db/migration/booking</code>, tệp <code>V2026.11.24.1500__booking_waitlist.sql</code>, <code>unique (lab_id, start_at, end_at, account_id)</code> cộng cột thứ tự; thứ tự đôn là <code>order by created_at, id</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Modular monolith</strong> — một ứng dụng triển khai một khối, chia thành các module có ranh giới được ép.</li>
  <li><strong>API công khai của module</strong> — các kiểu module khác được dùng (ở đây: package gốc của module); phần còn lại là nội bộ.</li>
  <li><strong>Domain event (sự kiện nghiệp vụ)</strong> — record báo một việc đã xảy ra ("đã tạo lượt đặt"), chủ sở hữu phát, ai cần thì nghe.</li>
  <li><strong>Exclusion constraint</strong> — ràng buộc PostgreSQL cấm hai dòng có giá trị xung đột theo các phép so cho trước (ở đây: cùng phòng và khoảng giờ chồng nhau).</li>
  <li><strong>ADR</strong> — biên bản quyết định kiến trúc: ghi ngắn một quyết định và lý do.</li>
  <li><strong>Migration out-of-order</strong> — chạy một migration có version thấp hơn version mới nhất đã chạy.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đặc tả = user story + business rule đánh số + yêu cầu phi chức năng; mọi test không vui chỉ vào một luật.</li>
  <li>Chia theo năng lực nghiệp vụ: identity, catalog, booking, notification, cộng module shared OPEN.</li>
  <li>Module nói chuyện qua interface, record và sự kiện công khai; không import nội bộ, không vòng, không join hay giao dịch chéo module.</li>
  <li><code>ApplicationModules.verify()</code> trong CI làm đỏ cả hai vi phạm: import repository nội bộ và vòng booking↔catalog.</li>
  <li>Flyway: mỗi module một thư mục, version là dấu thời gian. Hai V5 ⇒ "Found more than one migration with version 5"; migration cũ về muộn ⇒ bị từ chối cho tới khi bật out-of-order.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-modulith/reference/', '🧩', 'Spring Modulith — tài liệu chính', 'Module, kiểm ranh giới, sự kiện, sinh tài liệu.')}
${tl('https://martinfowler.com/bliki/MonolithFirst.html', '📐', 'Martin Fowler — MonolithFirst', 'Vì sao đa số hệ microservices thành công đều bắt đầu từ monolith.')}
${tl('https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations', '🪶', 'Flyway — versioned migrations', 'Đặt tên, thứ tự, out-of-order.')}
${tl('https://www.postgresql.org/docs/16/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION', '🐘', 'PostgreSQL 16 — exclusion constraint', 'EXCLUDE USING gist.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>KienTrucTest</code> trong <code>lab/c18/labflow</code> và hai bản sao có vi phạm (<code>~/.rtq-sb/c18/vp1</code>, <code>vp2</code>); <code>t/181-flyway.sh</code> trên bản sao <code>target/</code> với PostgreSQL 16.16; Spring Boot 4.1.2, Spring Modulith 2.1.3, Flyway 12.4.0 (24/11/2026).</li>
  <li>T-Mobile: Form 8-K nộp Uỷ ban Chứng khoán Mỹ (SEC) ngày 19/01/2023.</li>
</ul>
</div>
`;

// ===== Bài 18.2 =====
const MA182_ENTITY = java("/** Entity + máy trạng thái: PENDING → CONFIRMED | REJECTED; PENDING/CONFIRMED → CANCELLED. Chuyển sai ⇒ 409. */\n@Entity\n@Table(name = \"bookings\")\nclass Booking {\n    enum Status { PENDING, CONFIRMED, REJECTED, CANCELLED }\n\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;\n    @Column(name = \"lab_id\", nullable = false) private long labId;          // tham chiếu bằng id, không @ManyToOne sang module khác\n    @Column(name = \"owner_id\", nullable = false) private long ownerId;\n    @Column(name = \"start_at\", nullable = false) private LocalDateTime startAt;\n    @Column(name = \"end_at\", nullable = false) private LocalDateTime endAt;\n    @Enumerated(EnumType.STRING) @Column(nullable = false) private Status status;\n    @Column(nullable = false) private String purpose;\n    @Column(name = \"reject_reason\") private String rejectReason;\n    @Column(name = \"idempotency_key\", nullable = false) private String idempotencyKey;\n    @Version private int version;\n\n    protected Booking() { }\n    Booking(long labId, long ownerId, LocalDateTime startAt, LocalDateTime endAt, String purpose, String key, boolean canDuyet) {\n        this.labId = labId; this.ownerId = ownerId; this.startAt = startAt; this.endAt = endAt; this.purpose = purpose;\n        this.idempotencyKey = key; this.status = canDuyet ? Status.PENDING : Status.CONFIRMED;\n    }\n\n    void duyet() { chiKhi(Status.PENDING, \"duyệt\"); status = Status.CONFIRMED; }\n    void tuChoi(String lyDo) { chiKhi(Status.PENDING, \"từ chối\"); status = Status.REJECTED; rejectReason = lyDo; }\n    void huy() {\n        if (status != Status.PENDING && status != Status.CONFIRMED)\n            throw LoiNghiepVu.xungDot(\"BAD_TRANSITION\", \"không thể huỷ lượt đang ở trạng thái \" + status);\n        status = Status.CANCELLED;\n    }\n    private void chiKhi(Status s, String viec) {\n        if (status != s) throw LoiNghiepVu.xungDot(\"BAD_TRANSITION\", \"chỉ \" + viec + \" được lượt PENDING, lượt này đang \" + status);\n    }\n    // … getter");
const MA182_QUYTAC = java("/** BR-04 + BR-05 (phần khung giờ) — Java thuần, nhận \"bây giờ\" qua tham số ⇒ test đơn vị không cần Spring. Trả mã lỗi hoặc rỗng. */\nfinal class QuyTacDat {\n    static final LocalTime MO = LocalTime.of(7, 0), DONG = LocalTime.of(21, 0);\n    private QuyTacDat() { }\n\n    static Optional<String> loi(LocalDateTime start, LocalDateTime end, LocalDateTime now) {\n        if (!end.isAfter(start)) return Optional.of(\"BAD_RANGE\");\n        if (start.getMinute() % 30 != 0 || end.getMinute() % 30 != 0 || start.getSecond() != 0 || end.getSecond() != 0)\n            return Optional.of(\"NOT_30_MIN_GRID\");\n        if (!start.toLocalDate().equals(end.toLocalDate()) || start.toLocalTime().isBefore(MO) || end.toLocalTime().isAfter(DONG))\n            return Optional.of(\"OUTSIDE_OPENING_HOURS\");\n        if (Duration.between(start, end).toMinutes() > 240) return Optional.of(\"TOO_LONG\");\n        if (!start.isAfter(now)) return Optional.of(\"IN_THE_PAST\");\n        if (start.isAfter(now.plusDays(14))) return Optional.of(\"TOO_FAR_AHEAD\");\n        return Optional.empty();\n    }\n}");
const MA182_DAT = java("@Transactional\nKetQua dat(NguoiDung u, YeuCauDat r, String idemKey) {\n    // Xếp hàng các request CỦA CÙNG MỘT NGƯỜI (khoá tư vấn theo owner): hạn mức tuần + Idempotency-Key không bị đua.\n    // Hai NGƯỜI KHÁC NHAU không chờ nhau — trùng giờ do exclusion constraint chặn.\n    db.sql(\"select pg_advisory_xact_lock(?)\").param(u.id()).query().listOfRows();\n    var cu = bookings.findByOwnerIdAndIdempotencyKey(u.id(), idemKey);\n    if (cu.isPresent()) return new KetQua(view(cu.get(), catalog.theoIds(List.of(cu.get().getLabId()))), true);\n\n    LabInfo lab = catalog.timTheoMa(r.labCode()).orElseThrow(() -> LoiNghiepVu.khongThay(\"phòng \" + r.labCode()));\n    if (!lab.datDuoc()) throw LoiNghiepVu.quyTac(\"LAB_UNAVAILABLE\", \"phòng \" + lab.code() + \" đang \" + lab.status());\n    LocalDateTime now = LocalDateTime.now(clock);\n    QuyTacDat.loi(r.startAt(), r.endAt(), now).ifPresent(code -> { throw LoiNghiepVu.quyTac(code, \"khung giờ không hợp lệ: \" + code); });\n    if (!u.laQuanLy()) {\n        LocalDate thu2 = r.startAt().toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));\n        long da = bookings.phutTrongTuan(u.id(), thu2.atStartOfDay(), thu2.plusWeeks(1).atStartOfDay());\n        long them = Duration.between(r.startAt(), r.endAt()).toMinutes();\n        if (da + them > HAN_MUC_PHUT_TUAN)\n            throw LoiNghiepVu.quyTac(\"QUOTA_EXCEEDED\", \"vượt hạn mức 6 giờ/tuần (đã giữ \" + da + \" phút)\");\n    }\n    Booking b = bookings.saveAndFlush(new Booking(lab.id(), u.id(), r.startAt(), r.endAt(), r.purpose(), idemKey, lab.requiresApproval()));\n    events.publishEvent(new BookingCreated(b.getId(), u.id(), lab.code(), b.getStartAt(), b.getEndAt(), b.getStatus().name()));\n    return new KetQua(view(b, Map.of(lab.id(), lab)), false);\n}");
const MA182_XEM = java("/** Không phải chủ (và không phải quản lý) ⇒ 404 như thể không tồn tại: không lộ id nào có thật (IDOR). */\n@Transactional(readOnly = true)\nBookingView xem(NguoiDung u, long id) {\n    Booking b = cuaToiHoacQuanLy(u, id);\n    return view(b, catalog.theoIds(List.of(b.getLabId())));\n}\n\n@Transactional(readOnly = true)\nPage<BookingView> cuaToi(NguoiDung u, Pageable p) {\n    Page<Booking> trang = bookings.findByOwnerId(u.id(), p);\n    Map<Long, LabInfo> labs = catalog.theoIds(trang.map(Booking::getLabId).toSet());   // 1 truy vấn cho cả trang\n    return trang.map(b -> view(b, labs));\n}");
const MA182_QD = java("/** BR-07: chỉ chủ lượt được huỷ, và phải trước giờ bắt đầu ít nhất 2 giờ. */\n@Transactional\nBookingView huy(NguoiDung u, long id) {\n    Booking b = bookings.findByIdAndOwnerId(id, u.id()).orElseThrow(() -> LoiNghiepVu.khongThay(\"lượt đặt \" + id));\n    if (LocalDateTime.now(clock).plusHours(2).isAfter(b.getStartAt()))\n        throw LoiNghiepVu.quyTac(\"TOO_LATE_TO_CANCEL\", \"chỉ huỷ được trước giờ bắt đầu ít nhất 2 giờ\");\n    b.huy();\n    bookings.flush();\n    return view(b, catalog.theoIds(List.of(b.getLabId())));\n}\n\n@Transactional\nBookingView quyetDinh(long id, int version, boolean dongY, String lyDo) {\n    Booking b = bookings.findById(id).orElseThrow(() -> LoiNghiepVu.khongThay(\"lượt đặt \" + id));\n    if (b.getVersion() != version)\n        throw LoiNghiepVu.xungDot(\"STALE\", \"bạn đang xem phiên bản \" + version + \", lượt đặt đã ở phiên bản \" + b.getVersion());\n    if (dongY) b.duyet(); else b.tuChoi(lyDo);\n    bookings.flush();\n    LabInfo lab = catalog.theoIds(List.of(b.getLabId())).get(b.getLabId());\n    events.publishEvent(new BookingDecided(b.getId(), b.getOwnerId(), lab.code(), b.getStatus().name(), lyDo));\n    return view(b, Map.of(lab.id(), lab));\n}");
const MA182_CTRL = java("/** Idempotency-Key bắt buộc: mạng chậm, người dùng bấm hai lần ⇒ lần hai trả lại đúng lượt của lần một (200), không tạo lượt mới. */\n@PostMapping\nResponseEntity<BookingView> dat(@AuthenticationPrincipal Jwt jwt, @RequestHeader(\"Idempotency-Key\") @Size(min = 8, max = 64, message = \"dài 8–64 ký tự\") String key,\n                                @Valid @RequestBody DatRequest r) {\n    var kq = service.dat(NguoiDung.tu(jwt), new BookingService.YeuCauDat(r.labCode(), r.startAt(), r.endAt(), r.purpose()), key);\n    if (kq.lapLai()) return ResponseEntity.ok().header(\"Idempotent-Replayed\", \"true\").body(kq.view());\n    return ResponseEntity.created(URI.create(\"/api/v1/bookings/\" + kq.view().id())).body(kq.view());\n}");
const MA182_DUYET = java("@PostMapping(\"/{id}/approve\")\n@PreAuthorize(\"hasRole('MANAGER')\")\nBookingView duyet(@PathVariable long id, @Valid @RequestBody DuyetRequest r) { return service.quyetDinh(id, r.version(), true, null); }\n\n@PostMapping(\"/{id}/reject\")\n@PreAuthorize(\"hasRole('MANAGER')\")\nBookingView tuChoi(@PathVariable long id, @Valid @RequestBody TuChoiRequest r) { return service.quyetDinh(id, r.version(), false, r.reason()); }");
const MA182_NGUOIDUNG = java("/** API CÔNG KHAI của module identity: người đang gọi, đọc từ JWT đã được Spring Security kiểm chữ ký. */\npublic record NguoiDung(long id, String email, String role) {\n    public static NguoiDung tu(Jwt jwt) {\n        List<String> roles = jwt.getClaimAsStringList(\"roles\");\n        return new NguoiDung(((Number) jwt.getClaim(\"uid\")).longValue(), jwt.getSubject(), roles.getFirst());\n    }\n    public boolean laQuanLy() { return role.equals(\"MANAGER\") || role.equals(\"ADMIN\"); }\n}");
const MA182_CHAIN = java("@Bean\nSecurityFilterChain chain(HttpSecurity http) throws Exception {\n    http.cors(Customizer.withDefaults())\n        .csrf(c -> c.disable())                         // chỉ Bearer token trong header, không cookie phiên\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(a -> a\n            .requestMatchers(\"/api/v1/auth/**\", \"/error\").permitAll()\n            .requestMatchers(HttpMethod.GET, \"/api/v1/labs\", \"/api/v1/labs/*\").permitAll()\n            .requestMatchers(\"/v3/api-docs/**\", \"/swagger-ui/**\", \"/swagger-ui.html\").permitAll()\n            .requestMatchers(\"/actuator/health/**\").permitAll()\n            .anyRequest().authenticated())\n        .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(vaiTro())));\n    return http.build();\n}");
const MA182_DANGKY = java("/** BR-01: email trường. Không có trường role ⇒ gửi \"role\":\"MANAGER\" cũng vô ích (mass assignment). */\nrecord DangKy(@NotBlank @Email @Pattern(regexp = \".+@fpt\\\\.edu\\\\.vn$\", message = \"phải là email @fpt.edu.vn\") String email,\n              @NotBlank @Size(max = 100) String fullName,\n              @NotBlank @Size(min = 10, max = 72, message = \"mật khẩu dài 10–72 ký tự\") String password) { }");
const MA182_LOI = java("/**\n * SQLState 23P01 (exclusion_violation) ⇒ 409 SLOT_TAKEN. Dựa vào MÃ LỖI chuẩn của PostgreSQL, không dựa vào câu chữ.\n * (Hibernate 7 không trích tên ràng buộc EXCLUDE: getConstraintName() trả null.) Ràng buộc khác ⇒ 409 chung.\n */\n@ExceptionHandler(DataIntegrityViolationException.class)\nProblemDetail rangBuoc(DataIntegrityViolationException e) {\n    for (Throwable t = e; t != null; t = t.getCause())\n        if (t instanceof SQLException q && \"23P01\".equals(q.getSQLState()))\n            return pd(HttpStatus.CONFLICT, \"SLOT_TAKEN\", \"khung giờ này vừa có người đặt, hãy chọn giờ khác\");\n    return pd(HttpStatus.CONFLICT, \"CONFLICT\", \"dữ liệu xung đột với bản ghi đã có\");\n}");
const MA182_NGHE = java("/**\n * Nghe sự kiện của booking SAU KHI giao dịch đặt đã commit, trong giao dịch MỚI, trên luồng khác (@ApplicationModuleListener).\n * Gửi email lỗi/chậm không làm hỏng hay làm chậm lượt đặt. Spring Modulith ghi sự kiện vào event_publication trước ⇒ ứng dụng chết giữa chừng thì gửi lại được.\n */\n@Component\nclass ThongBao {\n    private static final Logger log = LoggerFactory.getLogger(ThongBao.class);\n    private final JdbcClient db;\n    ThongBao(JdbcClient db) { this.db = db; }\n    @ApplicationModuleListener\n    void khiDat(BookingCreated e) { … ghi(e.ownerId(), e.bookingId(), \"CREATED_\" + e.status(), msg); }\n\n    /** Consumer idempotent: cùng (booking, loại) chỉ một dòng dù sự kiện được giao lại. */\n    private void ghi(long accountId, long bookingId, String kind, String msg) {\n        int n = db.sql(\"insert into notifications (…) values (?, ?, ?, ?) on conflict do nothing\")…update();\n        if (n == 1) log.info(\"[email giả] tới tài khoản {}: {}\", accountId, msg);\n    }\n}");
const OUT182_1 = out("$ curl -s -w '\\n%{http_code}\\n' -H \"$J\" -d \"{\\\"email\\\":\\\"an.nguyen@fpt.edu.vn\\\",\\\"fullName\\\":\\\"Nguyễn An\\\",\\\"password\\\":\\\"$MAT_KHAU_SV\\\"}\" $API/api/v1/auth/register\n{\"id\":2,\"email\":\"an.nguyen@fpt.edu.vn\",\"fullName\":\"Nguyễn An\",\"role\":\"STUDENT\"}\n201\n\n$ curl -s -H \"$J\" -d '{\"email\":\"an@gmail.com\",\"fullName\":\"An\",\"password\":\"x\",\"role\":\"MANAGER\"}' $API/api/v1/auth/register | jq -c .\n{\"detail\":\"dữ liệu gửi lên chưa hợp lệ\",\"instance\":\"/api/v1/auth/register\",\"status\":400,\"title\":\"Bad Request\",\"type\":\"https://labflow.vn/errors/validation\",\"code\":\"VALIDATION\",\"fields\":{\"email\":\"phải là email @fpt.edu.vn\",\"password\":\"mật khẩu dài 10–72 ký tự\"}}");
const OUT182_2 = out("$ AN=$(curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"an.nguyen@fpt.edu.vn\\\",\\\"password\\\":\\\"$MAT_KHAU_SV\\\"}\" $API/api/v1/auth/login | jq -r .accessToken)\n\n$ echo \"$AN\" | cut -d. -f2 | base64 -d 2>/dev/null | jq -c .\n{\"iss\":\"labflow\",\"sub\":\"an.nguyen@fpt.edu.vn\",\"uid\":2,\"exp\":1795570200,\"iat\":1795568400,\"roles\":[\"STUDENT\"]}\n\n$ curl -s -H \"$J\" -d '{\"email\":\"an.nguyen@fpt.edu.vn\",\"password\":\"sai-mat-khau-roi\"}' $API/api/v1/auth/login | jq -c '{status,code,detail}'\n{\"status\":401,\"code\":\"BAD_CREDENTIALS\",\"detail\":\"sai email hoặc mật khẩu\"}");
const OUT182_3 = out("$ curl -s \"$API/api/v1/labs?size=2&sort=capacity,desc\" | jq -c .\n{\"items\":[{\"id\":3,\"code\":\"AI-03\",\"name\":\"Lab AI\",\"capacity\":40,\"status\":\"ACTIVE\",\"requiresApproval\":true},{\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}],\"page\":0,\"size\":2,\"totalItems\":4,\"totalPages\":2}\n\n$ curl -s \"$API/api/v1/labs?sort=password\" | jq -c '{status,code,detail}'\n{\"status\":422,\"code\":\"BAD_SORT\",\"detail\":\"chỉ sắp xếp theo [name, capacity, code]\"}");
const OUT182_45 = out("$ curl -s -i -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: an-iot-2611-0900' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00\",\"endAt\":\"2026-11-26T11:00\",\"purpose\":\"Lab 3 IoT\"}' $API/api/v1/bookings | grep -E '^HTTP|^Location|^\\{'\nHTTP/1.1 201 \r\nLocation: /api/v1/bookings/1\r\n{\"id\":1,\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00:00\",\"endAt\":\"2026-11-26T11:00:00\",\"status\":\"CONFIRMED\",\"purpose\":\"Lab 3 IoT\",\"rejectReason\":null,\"version\":0}\n\n$ curl -s -i -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: an-iot-2611-0900' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00\",\"endAt\":\"2026-11-26T11:00\",\"purpose\":\"Lab 3 IoT\"}' $API/api/v1/bookings | grep -E '^HTTP|^Idempotent|^\\{'\nHTTP/1.1 200 \r\nIdempotent-Replayed: true\r\n{\"id\":1,\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00:00\",\"endAt\":\"2026-11-26T11:00:00\",\"status\":\"CONFIRMED\",\"purpose\":\"Lab 3 IoT\",\"rejectReason\":null,\"version\":0}");
const OUT182_6 = out("$ curl -s -H \"Authorization: Bearer $AN\" -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T13:00\",\"endAt\":\"2026-11-26T14:00\",\"purpose\":\"x\"}' $API/api/v1/bookings | jq -c '{status,code,detail}'\n{\"status\":400,\"code\":\"BAD_REQUEST\",\"detail\":\"Required header 'Idempotency-Key' is not present.\"}\n\n$ curl -s -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: abc' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T13:00\",\"endAt\":\"2026-11-26T14:00\",\"purpose\":\"x\"}' $API/api/v1/bookings | jq -c '{status,code,fields}'\n{\"status\":400,\"code\":\"VALIDATION\",\"fields\":{\"Idempotency-Key\":\"dài 8–64 ký tự\"}}\n\n$ curl -s -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: an-thieu-truong' -H \"$J\" -d '{\"labCode\":\"IOT-01\"}' $API/api/v1/bookings | jq -c '{status,code,fields}'\n{\"status\":400,\"code\":\"VALIDATION\",\"fields\":{\"endAt\":\"must not be null\",\"purpose\":\"must not be blank\",\"startAt\":\"must not be null\"}}");
const OUT182_78 = out("$ curl -s -H \"Authorization: Bearer $BINH\" -H 'Idempotency-Key: binh-iot-2611-1000' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T10:00\",\"endAt\":\"2026-11-26T12:00\",\"purpose\":\"ôn thi\"}' $API/api/v1/bookings | jq -c .\n{\"detail\":\"khung giờ này vừa có người đặt, hãy chọn giờ khác\",\"instance\":\"/api/v1/bookings\",\"status\":409,\"title\":\"Conflict\",\"type\":\"https://labflow.vn/errors/slot-taken\",\"code\":\"SLOT_TAKEN\"}\n\n$ curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer $BINH\" -H 'Idempotency-Key: binh-iot-2611-1100' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T11:00\",\"endAt\":\"2026-11-26T12:00\",\"purpose\":\"ôn thi\"}' $API/api/v1/bookings\n201\n\n$ curl -s -H \"Authorization: Bearer $BINH\" -H 'Idempotency-Key: binh-iot-2711-0715' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-27T07:15\",\"endAt\":\"2026-11-27T08:00\",\"purpose\":\"x\"}' $API/api/v1/bookings | jq -c '{status,code}'\n{\"status\":422,\"code\":\"NOT_30_MIN_GRID\"}\n\n$ curl -s -H \"Authorization: Bearer $BINH\" -H 'Idempotency-Key: binh-iot-1012-0900' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-12-10T09:00\",\"endAt\":\"2026-12-10T10:00\",\"purpose\":\"x\"}' $API/api/v1/bookings | jq -c '{status,code}'\n{\"status\":422,\"code\":\"TOO_FAR_AHEAD\"}");
const OUT182_9 = out("$ ID=$(curl -s -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: an-ai-2711-1300' -H \"$J\" -d '{\"labCode\":\"AI-03\",\"startAt\":\"2026-11-27T13:00\",\"endAt\":\"2026-11-27T15:00\",\"purpose\":\"Đồ án nhóm 3\"}' $API/api/v1/bookings | jq -r .id); echo \"ID=$ID\"\nID=4\n\n$ curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer $AN\" -H \"$J\" -d '{\"version\":0}' $API/api/v1/bookings/$ID/approve\n403\n\n$ curl -s -H \"Authorization: Bearer $BINH\" $API/api/v1/bookings/$ID | jq -c '{status,code,detail}'\n{\"status\":404,\"code\":\"NOT_FOUND\",\"detail\":\"không tìm thấy lượt đặt 4\"}\n\n$ curl -s -H \"Authorization: Bearer $BINH\" $API/api/v1/bookings/999 | jq -c '{status,code,detail}'\n{\"status\":404,\"code\":\"NOT_FOUND\",\"detail\":\"không tìm thấy lượt đặt 999\"}");
const OUT182_10 = out("$ curl -s -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"version\":0}' $API/api/v1/bookings/$ID/reject | jq -c '{status,code,fields}'\n{\"status\":400,\"code\":\"VALIDATION\",\"fields\":{\"reason\":\"từ chối phải có lý do\"}}\n\n$ curl -s -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"version\":0}' $API/api/v1/bookings/$ID/approve | jq -c '{id,status,version}'\n{\"id\":4,\"status\":\"CONFIRMED\",\"version\":1}\n\n$ curl -s -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"version\":0,\"reason\":\"trùng lịch thi\"}' $API/api/v1/bookings/$ID/reject | jq -c '{status,code,detail}'\n{\"status\":409,\"code\":\"STALE\",\"detail\":\"bạn đang xem phiên bản 0, lượt đặt đã ở phiên bản 1\"}\n\n$ curl -s -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"version\":1,\"reason\":\"trùng lịch thi\"}' $API/api/v1/bookings/$ID/reject | jq -c '{status,code,detail}'\n{\"status\":409,\"code\":\"BAD_TRANSITION\",\"detail\":\"chỉ từ chối được lượt PENDING, lượt này đang CONFIRMED\"}");
const OUT182_11 = out("$ G=$(curl -s -H \"Authorization: Bearer $AN\" -H 'Idempotency-Key: an-iot-2511-0930' -H \"$J\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-25T09:30\",\"endAt\":\"2026-11-25T10:30\",\"purpose\":\"gấp\"}' $API/api/v1/bookings | jq -r .id); echo \"G=$G\"\nG=5\n\n$ curl -s -X POST -H \"Authorization: Bearer $AN\" $API/api/v1/bookings/$G/cancel | jq -c '{status,code,detail}'\n{\"status\":422,\"code\":\"TOO_LATE_TO_CANCEL\",\"detail\":\"chỉ huỷ được trước giờ bắt đầu ít nhất 2 giờ\"}\n\n$ curl -s -X POST -H \"Authorization: Bearer $BINH\" $API/api/v1/bookings/1/cancel | jq -c '{status,code}'\n{\"status\":404,\"code\":\"NOT_FOUND\"}\n\n$ curl -s -X POST -H \"Authorization: Bearer $AN\" $API/api/v1/bookings/1/cancel | jq -c '{id,status,version}'\n{\"id\":1,\"status\":\"CANCELLED\",\"version\":1}");
const OUT182_12 = out("$ curl -s -H \"Authorization: Bearer $AN\" $API/api/v1/notifications/mine | jq -r '.[] | \"\\(.kind)\\t\\(.message)\"'\nCREATED_CONFIRMED\tĐã giữ phòng IOT-01 2026-11-26T09:00 → 11:00\nCREATED_PENDING\tLượt đặt #4 phòng AI-03 đang chờ duyệt\nCONFIRMED\tLượt đặt #4 phòng AI-03 đã được duyệt\nCREATED_CONFIRMED\tĐã giữ phòng IOT-01 2026-11-25T09:30 → 10:30\n\n$ curl -s -H \"Authorization: Bearer $BINH\" \"$API/api/v1/bookings/schedule?lab=IOT-01&date=2026-11-26\" | jq -c '.[]'\n{\"startAt\":\"2026-11-26T11:00:00\",\"endAt\":\"2026-11-26T12:00:00\",\"status\":\"CONFIRMED\"}");

const L182_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2 · Capstone</span>
<h2>Building the API: rules, roles, one error format</h2>
<p class="lead">The design of 18.1 becomes running code. This lesson walks through the booking module — the heart of LabFlow — and the pieces around it: the state machine, the time rules, the double-click guard, the database refusing overlaps, the manager's approval with a version check, ownership that hides other people's bookings, one error format for every failure, and a notification module that reacts after the commit. Every response below came from the application running on this machine with PostgreSQL 16.16 and a fixed clock (25/11/2026 08:00) so the results repeat.</p>

<h3>Everyday picture first</h3>
<p>A badminton court at a sports centre. The receptionist checks your student card (authentication), checks the rules (one-hour slots, at most two slots a week), and writes your name in the book. If two people reach the counter at the same second, the book itself has one line per slot — only one name fits. If you ask again because you were not sure it worked, she shows you the line you already have instead of writing a second one. A slot in the big hall needs the manager's signature. And when it is done, she texts you — but you do not wait at the counter for the text to arrive.</p>

<h3>1. Who is calling: identity's public API</h3>
<p>Spring Security verifies the JWT signature, expiry and issuer before any controller runs (chapter 9). Other modules never touch accounts; they read the caller from the verified token through a record that identity publishes:</p>
${MA182_NGUOIDUNG}
${MA182_CHAIN}
<p>Registration accepts only the fields the server wants. There is no <code>role</code> in the record, so sending one changes nothing (mass assignment, lesson 10.1):</p>
${MA182_DANGKY}
${OUT182_1}
${OUT182_2}
<p>The token's middle part is only base64: anyone can read <code>uid</code> and <code>roles</code>. That is fine — what matters is that nobody can <em>change</em> them without the secret. Never put anything private in a JWT.</p>

<h3>2. One list format for every collection</h3>
<p>Every list in the API returns <code>{items, page, size, totalItems, totalPages}</code>, so the frontend writes one table component. Sorting is an allow-list: a column name from the URL never reaches SQL as text (lesson 10.3).</p>
${OUT182_3}

<h3>3. The booking: rules in plain Java, state in the entity</h3>
<p>The time rules (BR-04) are a pure function: no Spring, no database, "now" passed in. That makes them testable in milliseconds (18.3) and readable by a lecturer:</p>
${MA182_QUYTAC}
<p>The entity carries a small state machine. Wrong transitions are a 409, never a silent overwrite:</p>
${MA182_ENTITY}

<h3>4. The service: four guards, in a deliberate order</h3>
${MA182_DAT}
<ul>
  <li><strong>Advisory lock per user</strong> — <code>pg_advisory_xact_lock(ownerId)</code> queues requests <em>of the same person</em>, so "6 hours per week" and the idempotency check cannot be raced by one user firing two tabs. Two different users never wait for each other.</li>
  <li><strong>Idempotency-Key</strong> — the same key from the same user returns the existing booking.</li>
  <li><strong>Rules</strong> — lab status (through <code>LabCatalog</code>), time grid, weekly quota (managers exempt).</li>
  <li><strong>The insert</strong> — <code>saveAndFlush</code> sends the INSERT now, inside the transaction, so a 23P01 from the exclusion constraint surfaces here and becomes a 409. Only then is the event published.</li>
</ul>
<p>The controller makes the key mandatory and reports a replay honestly:</p>
${MA182_CTRL}
${OUT182_45}
${OUT182_6}
<p>Notice the three different 400s all have the same shape and a <code>code</code>; the field errors arrive per field so the form can show them next to the right input.</p>

<h3>5. The database says no — and the API says it politely</h3>
${OUT182_78}
<p>Bình's 10:00–12:00 overlaps An's 09:00–11:00, so PostgreSQL rejects the row with SQLState 23P01 and the handler turns it into <code>409 SLOT_TAKEN</code>. 11:00–12:00 starts exactly when An's ends: with half-open ranges <code>[)</code> that is not an overlap, so it is accepted. The handler relies on the standard SQLState, not on message text:</p>
${MA182_LOI}
<div class="callout warn"><p><strong>Measured trap:</strong> the first version read <code>ConstraintViolationException.getConstraintName()</code> and compared it with <code>bookings_khong_trung</code>. Hibernate 7.4 does not extract the name of an EXCLUDE constraint (it returns <code>null</code>), so the API answered <code>409 CONFLICT</code> with a generic message. The 409 status was right, the code was wrong — and the frontend shows its "slot taken" message only for <code>SLOT_TAKEN</code>. Test the error codes, not only the status.</p></div>

<h3>6. Roles and ownership</h3>
${OUT182_9}
<p>A student calling <code>approve</code> gets 403: they are logged in but lack the role (<code>@PreAuthorize("hasRole('MANAGER')")</code>). Bình asking for An's booking gets 404, exactly like a booking that does not exist (999): the query itself is "by id <em>and</em> owner", so there is no way to learn which ids exist (IDOR, lesson 10.2).</p>
${MA182_XEM}
<p><code>cuaToi</code> also shows the cross-module rule from 18.1 in practice: the page of bookings asks catalog for all its labs in <strong>one</strong> call (<code>theoIds</code>), instead of one call per row.</p>

<h3>7. The manager decides, with a version</h3>
${MA182_DUYET}
${MA182_QD}
${OUT182_10}
<p>The request carries the version the manager was looking at. If someone else changed the booking in between, the answer is <code>409 STALE</code> — the manager reloads instead of overwriting a decision they never saw (optimistic locking, lesson 7.5). Rejecting a booking that is already CONFIRMED hits the state machine: <code>409 BAD_TRANSITION</code>.</p>
${OUT182_11}

<h3>8. Notification: after the commit, on another thread</h3>
${MA182_NGHE}
<p><code>@ApplicationModuleListener</code> is three annotations in one: <code>@TransactionalEventListener</code> (run only <em>after</em> booking commits — a rolled-back booking never sends an email), <code>@Async</code> (the HTTP response does not wait), and <code>@Transactional(REQUIRES_NEW)</code> (its own transaction). Spring Modulith also stores each event in <code>event_publication</code> before the listener runs and marks it completed afterwards, so events not completed when the application crashed can be resubmitted after a restart. The listener inserts with <code>on conflict do nothing</code>, so a redelivered event does not create a second notification (idempotent consumer, chapter 14).</p>
${OUT182_12}
<p>The schedule endpoint returns busy slots only — no names, no ids (US-6 in 18.1).</p>

<h3>🕵️ Hacker corner — Starbucks gift cards, 2015</h3>
<p>In May 2015 Egor Homakov published how he got free money from Starbucks: transferring a balance between two gift cards by sending the same transfer request many times in parallel. The server checked "is there enough balance?", then moved the money — and several parallel requests all passed the check before any of them wrote, so the total balance grew although nobody added money. The same pattern ("check, then write") would let two students book one lab, or one student exceed the weekly quota from two browser tabs. <strong>What you do:</strong> make the invariant a database rule (exclusion or unique constraint), serialise per user where a rule spans rows (advisory or row lock), and make retries idempotent with a key. Then attack it yourself with parallel requests — 18.3 does it with 50.</p>

<h3>Compared with Node.js</h3>
<p>In Express the same API is a router per module, <code>zod</code> or <code>express-validator</code> for 400s, <code>pg</code>/Prisma for the insert and an error middleware mapping <code>err.code === '23P01'</code> to 409 — the database rule is identical. Two differences an interviewer likes: Spring wraps every service call in a transaction declaratively (<code>@Transactional</code>), while in Node you pass a client/transaction object around; and the after-commit event with a persisted registry comes built in with Spring Modulith, while in Node you usually build an outbox table yourself (chapter 14).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you make POST idempotent?"</strong> — The client sends an Idempotency-Key per user intent; the server stores it with the result under a unique constraint and returns the stored result on a repeat. Serialise concurrent repeats (lock per user) or catch the unique violation.</li>
  <li><strong>"401 vs 403 vs 404 for someone else's resource?"</strong> — 401: no valid identity. 403: identity known, role missing. For a resource owned by someone else, return 404 so ids cannot be enumerated.</li>
  <li><strong>"How do you return errors?"</strong> — One format (RFC 9457 ProblemDetail) for all errors, with a stable machine code and per-field messages; never stack traces or SQL.</li>
  <li><strong>"Why publish events after commit?"</strong> — Otherwise a rolled-back transaction could still send an email or update another module; after-commit + persisted publications give at-least-once delivery, so consumers must be idempotent.</li>
  <li><strong>"Where do business rules live?"</strong> — Invariants that must hold under concurrency in the database; the rest in plain domain code (entity methods, pure functions) that can be unit-tested; controllers only translate HTTP.</li>
</ol>

<h3>🧪 Practice (60 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add <code>GET /api/v1/bookings/pending</code> for managers: pending bookings of the next 7 days, sorted by start, in the common page format. Students get 403.</li>
  <li>Send the same Idempotency-Key twice but with a <em>different</em> body (other lab). What does the current code return? Is that what you want? Propose a fix.</li>
  <li>Make the "no-show" rule: a CONFIRMED booking not cancelled and not checked in 15 minutes after start becomes NO_SHOW. Which module publishes which event, and what must the migration change?</li>
</ol>
<p><strong>Done when:</strong> (1) works for a manager and is 403 for a student; (2) you can explain the current answer from the code; (3) you changed the CHECK constraint, not just the enum.</p></div>
${giai('Show the answers', `<p>1. Repository: <code>findByStatusAndStartAtBetween(Status.PENDING, now, now.plusDays(7), pageable)</code>; controller with <code>@PreAuthorize("hasRole('MANAGER')")</code> returning <code>Trang.tu(...)</code>; reuse <code>theoIds</code> for lab codes.</p><p>2. It returns the <em>first</em> booking (200, Idempotent-Replayed) and silently ignores the new body. Stripe-style APIs reject this with 422: store a hash of the request body next to the key and compare it on replay.</p><p>3. Booking owns it: a scheduled job (chapter 14) finds CONFIRMED rows with <code>start_at + 15 min &lt; now</code> and no check-in, sets NO_SHOW and publishes <code>BookingNoShow</code>; notification listens. The migration must alter the CHECK on <code>status</code> to allow 'NO_SHOW', and decide whether the exclusion constraint's <code>where</code> keeps NO_SHOW rows (no: the slot is free again).</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Idempotency key</strong> — a client-generated id for one intent; repeating the request with it has no extra effect.</li>
  <li><strong>Advisory lock</strong> — a PostgreSQL lock on a number you choose (here the user id), released at the end of the transaction.</li>
  <li><strong>SQLState 23P01</strong> — PostgreSQL's code for exclusion_violation.</li>
  <li><strong>ProblemDetail</strong> — Spring's type for RFC 9457 error bodies (type, title, status, detail, instance + extra properties).</li>
  <li><strong>@ApplicationModuleListener</strong> — Spring Modulith listener: after commit, async, in a new transaction.</li>
  <li><strong>Event publication registry</strong> — the <code>event_publication</code> table where Modulith tracks each event until its listener completes.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Other modules read the caller from the verified JWT through identity's <code>NguoiDung</code>; registration ignores a sent <code>role</code>.</li>
  <li>Booking checks in order: lock per user → idempotency → lab status, time grid, weekly quota → INSERT; the database refuses overlaps (23P01 ⇒ 409 SLOT_TAKEN).</li>
  <li>Same key twice ⇒ 200 + Idempotent-Replayed, same id; 11:00 after a booking ending 11:00 is accepted.</li>
  <li>Student approve ⇒ 403; someone else's booking ⇒ 404 like a missing one; stale version ⇒ 409 STALE; wrong transition ⇒ 409 BAD_TRANSITION.</li>
  <li>Notifications are written after commit, asynchronously, once per event.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-modulith/reference/events.html', '🧩', 'Spring Modulith — working with application events', 'ApplicationModuleListener, publication registry, resubmission.')}
${tl('https://www.rfc-editor.org/rfc/rfc9457', '📄', 'RFC 9457 — Problem Details for HTTP APIs', 'The error format used by every response here.')}
${tl('https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/', '🔁', 'IETF draft — The Idempotency-Key HTTP header', 'Semantics, expiry, conflicting bodies.')}
${tl('https://www.postgresql.org/docs/16/explicit-locking.html#ADVISORY-LOCKS', '🐘', 'PostgreSQL — advisory locks', 'pg_advisory_xact_lock and friends.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>t/182.cmds</code> run by <code>t/chay.sh</code> against <code>lab/c18/labflow</code> (Spring Boot 4.1.2, Hibernate 7.4.13, Spring Modulith 2.1.3, PostgreSQL 16.16, <code>LABFLOW_NOW=2026-11-25T08:00</code>), 24/11/2026. The demo port was mapped to <code>localhost:8080</code> in the text.</li>
  <li>Starbucks: Egor Homakov, "Hacking Starbucks for unlimited coffee", sakurity.com, May 2015.</li>
</ul>
</div>
`;

const L182_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.2 · Dự án cuối khoá</span>
<h2>Xây API: quy tắc, vai trò, một khuôn lỗi</h2>
<p class="lead">Thiết kế ở 18.1 trở thành mã chạy được. Bài này đi qua module booking — trái tim của LabFlow — và những gì xung quanh nó: máy trạng thái, luật khung giờ, chốt chặn bấm hai lần, CSDL từ chối giờ chồng, quản lý duyệt có kiểm phiên bản, quyền sở hữu che lượt của người khác, một khuôn lỗi cho mọi lỗi, và module thông báo phản ứng sau commit. Mọi response dưới đây đều lấy từ ứng dụng chạy thật trên máy này với PostgreSQL 16.16 và một đồng hồ cố định (08:00 ngày 25/11/2026) để kết quả lặp lại được.</p>

<h3>Đời thường trước đã</h3>
<p>Sân cầu lông ở nhà thi đấu. Lễ tân xem thẻ sinh viên của bạn (xác thực), xem luật (mỗi lượt một giờ, tối đa hai lượt một tuần), rồi ghi tên bạn vào sổ. Hai người tới quầy cùng một giây thì cuốn sổ mỗi khung giờ chỉ có một dòng — chỉ một tên vừa. Bạn hỏi lại vì không chắc đã đặt được chưa, cô ấy chỉ cho bạn dòng bạn đã có chứ không ghi thêm dòng nữa. Sân ở hội trường lớn cần chữ ký quản lý. Xong việc, cô nhắn tin cho bạn — nhưng bạn không đứng ở quầy chờ tin nhắn tới.</p>

<h3>1. Ai đang gọi: API công khai của identity</h3>
<p>Spring Security kiểm chữ ký, hạn dùng và nơi phát của JWT trước khi bất kỳ controller nào chạy (chương 9). Module khác không bao giờ chạm vào bảng tài khoản; chúng đọc người gọi từ token đã kiểm, qua một record mà identity công khai:</p>
${MA182_NGUOIDUNG}
${MA182_CHAIN}
<p>Đăng ký chỉ nhận đúng những trường server muốn. Record không có <code>role</code>, nên gửi kèm cũng không đổi được gì (mass assignment, bài 10.1):</p>
${MA182_DANGKY}
${OUT182_1}
${OUT182_2}
<p>Phần giữa token chỉ là base64: ai cũng đọc được <code>uid</code> và <code>roles</code>. Không sao — điều quan trọng là không ai <em>sửa</em> được chúng khi không có khoá bí mật. Đừng bao giờ để thứ riêng tư trong JWT.</p>

<h3>2. Một khuôn danh sách cho mọi tập hợp</h3>
<p>Mọi danh sách của API đều trả <code>{items, page, size, totalItems, totalPages}</code>, nên frontend chỉ viết một component bảng. Sắp xếp theo allow-list: tên cột lấy từ URL không bao giờ đi vào SQL dưới dạng chữ (bài 10.3).</p>
${OUT182_3}

<h3>3. Lượt đặt: luật ở Java thuần, trạng thái ở entity</h3>
<p>Luật khung giờ (BR-04) là một hàm thuần: không Spring, không CSDL, "bây giờ" được truyền vào. Nhờ vậy test nó mất vài mili giây (18.3) và giảng viên đọc cũng hiểu:</p>
${MA182_QUYTAC}
<p>Entity mang một máy trạng thái nhỏ. Chuyển sai là 409, không bao giờ ghi đè lặng lẽ:</p>
${MA182_ENTITY}

<h3>4. Service: bốn chốt chặn, theo thứ tự có chủ ý</h3>
${MA182_DAT}
<ul>
  <li><strong>Khoá tư vấn theo người</strong> — <code>pg_advisory_xact_lock(ownerId)</code> xếp hàng các request <em>của cùng một người</em>, nên "6 giờ mỗi tuần" và phép kiểm idempotency không bị một người mở hai tab đua qua mặt. Hai người khác nhau không bao giờ chờ nhau.</li>
  <li><strong>Idempotency-Key</strong> — cùng khoá, cùng người thì trả lại lượt đã có.</li>
  <li><strong>Luật</strong> — trạng thái phòng (qua <code>LabCatalog</code>), lưới giờ, hạn mức tuần (quản lý được miễn).</li>
  <li><strong>Lệnh ghi</strong> — <code>saveAndFlush</code> gửi INSERT ngay, trong giao dịch, nên lỗi 23P01 của exclusion constraint nổi lên ở đây và thành 409. Chỉ sau đó mới phát sự kiện.</li>
</ul>
<p>Controller bắt buộc có khoá và báo thật khi là lần lặp lại:</p>
${MA182_CTRL}
${OUT182_45}
${OUT182_6}
<p>Để ý ba lỗi 400 khác nhau đều cùng một hình dạng và có <code>code</code>; lỗi trường đi theo từng trường để form hiện ngay cạnh ô nhập tương ứng.</p>

<h3>5. CSDL nói không — và API nói lại cho lịch sự</h3>
${OUT182_78}
<p>Lượt 10:00–12:00 của Bình chồng lên 09:00–11:00 của An, nên PostgreSQL từ chối dòng đó với SQLState 23P01 và bộ xử lý biến nó thành <code>409 SLOT_TAKEN</code>. Lượt 11:00–12:00 bắt đầu đúng lúc lượt của An kết thúc: với khoảng nửa mở <code>[)</code> thì không tính là chồng, nên được nhận. Bộ xử lý dựa vào SQLState chuẩn, không dựa vào câu chữ:</p>
${MA182_LOI}
<div class="callout warn"><p><strong>Bẫy đã đo:</strong> bản đầu đọc <code>ConstraintViolationException.getConstraintName()</code> rồi so với <code>bookings_khong_trung</code>. Hibernate 7.4 không trích tên của ràng buộc EXCLUDE (trả <code>null</code>), nên API trả <code>409 CONFLICT</code> với câu chung chung. Mã trạng thái 409 thì đúng, nhưng <code>code</code> sai — mà frontend chỉ hiện câu "khung giờ đã có người" khi gặp <code>SLOT_TAKEN</code>. Hãy test cả mã lỗi, không chỉ mã trạng thái.</p></div>

<h3>6. Vai trò và quyền sở hữu</h3>
${OUT182_9}
<p>Sinh viên gọi <code>approve</code> nhận 403: đã đăng nhập nhưng thiếu vai trò (<code>@PreAuthorize("hasRole('MANAGER')")</code>). Bình hỏi lượt của An nhận 404, y như một lượt không tồn tại (999): chính câu truy vấn là "theo id <em>và</em> chủ", nên không có cách nào dò ra id nào có thật (IDOR, bài 10.2).</p>
${MA182_XEM}
<p><code>cuaToi</code> cũng cho thấy luật chéo module ở 18.1 khi chạy thật: một trang lượt đặt hỏi catalog về mọi phòng của nó trong <strong>một</strong> lần gọi (<code>theoIds</code>), thay vì mỗi dòng một lần.</p>

<h3>7. Quản lý quyết định, kèm phiên bản</h3>
${MA182_DUYET}
${MA182_QD}
${OUT182_10}
<p>Request mang theo phiên bản mà quản lý đang nhìn. Nếu ai đó đã đổi lượt đặt ở giữa, câu trả lời là <code>409 STALE</code> — quản lý tải lại thay vì đè lên một quyết định họ chưa từng thấy (khoá lạc quan, bài 7.5). Từ chối một lượt đã CONFIRMED thì đụng máy trạng thái: <code>409 BAD_TRANSITION</code>.</p>
${OUT182_11}

<h3>8. Thông báo: sau commit, trên luồng khác</h3>
${MA182_NGHE}
<p><code>@ApplicationModuleListener</code> là ba annotation gộp một: <code>@TransactionalEventListener</code> (chỉ chạy <em>sau khi</em> booking commit — lượt bị rollback không bao giờ gửi email), <code>@Async</code> (response HTTP không phải chờ), và <code>@Transactional(REQUIRES_NEW)</code> (giao dịch riêng). Spring Modulith còn lưu mỗi sự kiện vào <code>event_publication</code> trước khi listener chạy và đánh dấu hoàn tất sau đó, nên sự kiện chưa xong lúc ứng dụng sập có thể được gửi lại sau khi khởi động lại. Listener ghi bằng <code>on conflict do nothing</code>, nên sự kiện bị giao lại không tạo thông báo thứ hai (consumer idempotent, chương 14).</p>
${OUT182_12}
<p>Endpoint lịch phòng chỉ trả khung giờ bận — không tên, không id (US-6 ở 18.1).</p>

<h3>🕵️ Góc hacker — thẻ quà tặng Starbucks, 2015</h3>
<p>Tháng 5/2015, Egor Homakov công bố cách anh lấy tiền miễn phí từ Starbucks: chuyển số dư giữa hai thẻ quà tặng bằng cách gửi cùng một request chuyển tiền nhiều lần song song. Server kiểm "còn đủ số dư không?" rồi mới chuyển — và nhiều request song song đều qua được phép kiểm trước khi request nào kịp ghi, nên tổng số dư tăng lên dù không ai nạp thêm tiền. Đúng mẫu "kiểm rồi mới ghi" đó sẽ cho hai sinh viên cùng đặt một phòng, hay một sinh viên vượt hạn mức tuần từ hai tab trình duyệt. <strong>Cách phòng:</strong> biến bất biến thành luật của CSDL (exclusion hoặc unique constraint), xếp hàng theo người khi luật trải trên nhiều dòng (khoá tư vấn hoặc khoá dòng), và làm cho việc thử lại idempotent bằng khoá. Rồi tự tấn công bằng request song song — 18.3 bắn 50 cái.</p>

<h3>So với Node.js</h3>
<p>Với Express, cùng API này là mỗi module một router, <code>zod</code> hoặc <code>express-validator</code> cho lỗi 400, <code>pg</code>/Prisma cho lệnh ghi, và một middleware lỗi đổi <code>err.code === '23P01'</code> thành 409 — luật trong CSDL giữ y nguyên. Hai khác biệt phỏng vấn viên thích hỏi: Spring bọc mỗi lời gọi service trong giao dịch bằng khai báo (<code>@Transactional</code>), còn ở Node bạn tự truyền client/transaction đi khắp nơi; và sự kiện sau commit kèm sổ lưu bền có sẵn trong Spring Modulith, còn ở Node thường phải tự dựng bảng outbox (chương 14).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Làm POST idempotent thế nào?"</strong> — Client gửi Idempotency-Key cho mỗi ý định của người dùng; server lưu khoá cùng kết quả dưới một unique constraint và trả lại kết quả đã lưu khi lặp lại. Xếp hàng các lần lặp đồng thời (khoá theo người) hoặc bắt lỗi trùng khoá.</li>
  <li><strong>"Tài nguyên của người khác: 401, 403 hay 404?"</strong> — 401: chưa có danh tính hợp lệ. 403: biết là ai nhưng thiếu vai trò. Tài nguyên của người khác thì trả 404 để không dò được id.</li>
  <li><strong>"Trả lỗi ra sao?"</strong> — Một khuôn (RFC 9457 ProblemDetail) cho mọi lỗi, có mã máy đọc ổn định và thông báo theo từng trường; không bao giờ lộ stack trace hay SQL.</li>
  <li><strong>"Vì sao phát sự kiện sau commit?"</strong> — Nếu không, giao dịch bị rollback vẫn có thể gửi email hay sửa module khác; sau commit + lưu bền cho giao ít nhất một lần, nên consumer phải idempotent.</li>
  <li><strong>"Business rule nằm ở đâu?"</strong> — Bất biến phải đúng khi đồng thời thì nằm trong CSDL; phần còn lại là mã domain thuần (phương thức entity, hàm thuần) test đơn vị được; controller chỉ dịch HTTP.</li>
</ol>

<h3>🧪 Thực hành (60 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>GET /api/v1/bookings/pending</code> cho quản lý: các lượt PENDING trong 7 ngày tới, sắp theo giờ bắt đầu, đúng khuôn trang chung. Sinh viên nhận 403.</li>
  <li>Gửi cùng một Idempotency-Key hai lần nhưng body <em>khác</em> (phòng khác). Mã hiện tại trả gì? Có phải điều bạn muốn không? Đề xuất cách sửa.</li>
  <li>Làm luật "không đến" (no-show): lượt CONFIRMED không huỷ, không check-in sau giờ bắt đầu 15 phút thì thành NO_SHOW. Module nào phát sự kiện gì, và migration phải đổi gì?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) chạy cho quản lý và 403 với sinh viên; (2) bạn giải thích được câu trả lời hiện tại từ mã; (3) bạn đổi ràng buộc CHECK, không chỉ đổi enum.</p></div>
${giai('Xem đáp án', `<p>1. Repository: <code>findByStatusAndStartAtBetween(Status.PENDING, now, now.plusDays(7), pageable)</code>; controller có <code>@PreAuthorize("hasRole('MANAGER')")</code>, trả <code>Trang.tu(...)</code>; dùng lại <code>theoIds</code> để lấy mã phòng.</p><p>2. Nó trả lượt <em>đầu tiên</em> (200, Idempotent-Replayed) và lặng lẽ bỏ qua body mới. Các API kiểu Stripe từ chối trường hợp này bằng 422: lưu một mã băm của body cạnh khoá rồi so khi lặp lại.</p><p>3. Booking sở hữu: một tác vụ hẹn giờ (chương 14) tìm dòng CONFIRMED có <code>start_at + 15 phút &lt; now</code> mà chưa check-in, đặt NO_SHOW và phát <code>BookingNoShow</code>; notification nghe. Migration phải sửa CHECK trên <code>status</code> để nhận 'NO_SHOW', và quyết định <code>where</code> của exclusion constraint có giữ dòng NO_SHOW không (không: khung giờ lại trống).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Idempotency key</strong> — mã do client sinh cho một ý định; lặp lại request với mã đó không gây thêm tác dụng.</li>
  <li><strong>Advisory lock (khoá tư vấn)</strong> — khoá PostgreSQL trên một con số do bạn chọn (ở đây là id người dùng), nhả khi giao dịch kết thúc.</li>
  <li><strong>SQLState 23P01</strong> — mã của PostgreSQL cho exclusion_violation.</li>
  <li><strong>ProblemDetail</strong> — kiểu của Spring cho thân lỗi RFC 9457 (type, title, status, detail, instance + thuộc tính thêm).</li>
  <li><strong>@ApplicationModuleListener</strong> — listener của Spring Modulith: sau commit, bất đồng bộ, trong giao dịch mới.</li>
  <li><strong>Event publication registry</strong> — bảng <code>event_publication</code>, nơi Modulith theo dõi từng sự kiện tới khi listener xong.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Module khác đọc người gọi từ JWT đã kiểm qua <code>NguoiDung</code> của identity; đăng ký bỏ qua <code>role</code> gửi kèm.</li>
  <li>Booking kiểm theo thứ tự: khoá theo người → idempotency → trạng thái phòng, lưới giờ, hạn mức tuần → INSERT; CSDL từ chối giờ chồng (23P01 ⇒ 409 SLOT_TAKEN).</li>
  <li>Cùng khoá hai lần ⇒ 200 + Idempotent-Replayed, cùng id; lượt 11:00 nối sau lượt kết thúc 11:00 được nhận.</li>
  <li>Sinh viên duyệt ⇒ 403; lượt của người khác ⇒ 404 như lượt không có; phiên bản cũ ⇒ 409 STALE; chuyển trạng thái sai ⇒ 409 BAD_TRANSITION.</li>
  <li>Thông báo được ghi sau commit, bất đồng bộ, mỗi sự kiện một lần.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-modulith/reference/events.html', '🧩', 'Spring Modulith — làm việc với application event', 'ApplicationModuleListener, sổ sự kiện, gửi lại.')}
${tl('https://www.rfc-editor.org/rfc/rfc9457', '📄', 'RFC 9457 — Problem Details for HTTP APIs', 'Khuôn lỗi dùng cho mọi response ở đây.')}
${tl('https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/', '🔁', 'Bản nháp IETF — header Idempotency-Key', 'Ngữ nghĩa, hết hạn, body xung đột.')}
${tl('https://www.postgresql.org/docs/16/explicit-locking.html#ADVISORY-LOCKS', '🐘', 'PostgreSQL — advisory lock', 'pg_advisory_xact_lock và các hàm cùng họ.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>t/182.cmds</code> chạy bằng <code>t/chay.sh</code> trên <code>lab/c18/labflow</code> (Spring Boot 4.1.2, Hibernate 7.4.13, Spring Modulith 2.1.3, PostgreSQL 16.16, <code>LABFLOW_NOW=2026-11-25T08:00</code>), 24/11/2026. Cổng demo được ghi thành <code>localhost:8080</code> trong bài.</li>
  <li>Starbucks: Egor Homakov, "Hacking Starbucks for unlimited coffee", sakurity.com, tháng 5/2015.</li>
</ul>
</div>
`;

// ===== Bài 18.3 =====
const MA183_QT = java("class QuyTacDatTest {\n    static final LocalDateTime NOW = LocalDateTime.parse(\"2026-11-25T08:00\");\n\n    @ParameterizedTest(name = \"{0} → {1} ⇒ {2}\")\n    @CsvSource(nullValues = \"OK\", value = {\n        \"2026-11-26T09:00, 2026-11-26T11:00, OK\",\n        \"2026-11-26T09:00, 2026-11-26T09:00, BAD_RANGE\",\n        \"2026-11-26T09:15, 2026-11-26T10:00, NOT_30_MIN_GRID\",\n        \"2026-11-26T06:30, 2026-11-26T08:00, OUTSIDE_OPENING_HOURS\",\n        \"2026-11-26T20:00, 2026-11-26T21:30, OUTSIDE_OPENING_HOURS\",\n        \"2026-11-26T20:00, 2026-11-26T21:00, OK\",\n        \"2026-11-26T08:00, 2026-11-26T12:30, TOO_LONG\",\n        \"2026-11-25T08:00, 2026-11-25T09:00, IN_THE_PAST\",\n        \"2026-12-09T08:00, 2026-12-09T09:00, OK\",\n        \"2026-12-09T08:30, 2026-12-09T09:00, TOO_FAR_AHEAD\",\n    })\n    void khungGio(LocalDateTime start, LocalDateTime end, String loi) {\n        assertThat(QuyTacDat.loi(start, end, NOW).orElse(null)).isEqualTo(loi);\n    }\n}");
const MA183_TC = java("/** MỘT PostgreSQL 16 thật cho cả bộ test (static ⇒ dùng chung giữa các lớp, xem 11.4). Dùng: @ImportTestcontainers(TcChung.class). */\npublic interface TcChung {\n    @ServiceConnection\n    PostgreSQLContainer PG = new PostgreSQLContainer(\"postgres:16\")\n        // máy CI/máy nhóm có hạn RAM: giới hạn container như mọi container khác (2 GB, 2 CPU)\n        .withCreateContainerCmdModifier(c -> c.withName(\"sb-c18-tc-pg-\" + ProcessHandle.current().pid())\n            .getHostConfig().withMemory(2L << 30).withMemorySwap(2L << 30).withNanoCPUs(2_000_000_000L));\n}");
const MA183_DUA = java("@Test\nvoid namMuoiNguoiCungDatMotKhungGio() throws Exception {\n    for (int n : new int[] {2, 10, 50}) {\n        String gio = switch (n) { case 2 -> \"09:00\"; case 10 -> \"13:00\"; default -> \"16:00\"; };\n        String than = \"\"\"\n            {\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-27T%s\",\"endAt\":\"2026-11-27T%s\",\"purpose\":\"đua %d người\"}\"\"\"\n            .formatted(gio, gio.replace(\":00\", \":30\"), n);\n        CountDownLatch xuatPhat = new CountDownLatch(1);\n        Map<Integer, Integer> dem = new ConcurrentSkipListMap<>();\n        try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < n; i++) {\n                String tk = tokens.get(i); String key = \"dua-%02d-%02d\".formatted(n, i);\n                ex.submit(() -> { xuatPhat.await(); dem.merge(post(\"/api/v1/bookings\", tk, key, than).statusCode(), 1, Integer::sum); return null; });\n            }\n            long t0 = System.nanoTime(); xuatPhat.countDown(); ex.shutdown(); ex.awaitTermination(60, TimeUnit.SECONDS);\n            System.out.printf(\"%2d request cùng lúc ⇒ %s trong %d ms%n\", n, new TreeMap<>(dem), (System.nanoTime() - t0) / 1_000_000);\n        }\n        assertThat(dem).containsEntry(201, 1).containsEntry(409, n - 1);\n    }\n    System.out.println(db.sql(\"select start_at::time || '–' || end_at::time as khung, count(*) from bookings group by 1 order by 1\").query().listOfRows());\n}");
const MA183_GOI = java("/** Gọi API thật qua cổng ngẫu nhiên bằng java.net.http (không mock gì). Mật khẩu sinh lúc chạy, không ghi trong mã. */\nabstract class GoiApi {\n    static final HttpClient HTTP = HttpClient.newHttpClient();\n    static final String MAT_KHAU = \"tc-\" + UUID.randomUUID();\n    @LocalServerPort int port;\n\n    /** Bí mật ký JWT của lần chạy test: sinh ngẫu nhiên, không nằm trong Git. */\n    @DynamicPropertySource\n    static void biMat(DynamicPropertyRegistry r) { r.add(\"labflow.jwt.secret\", () -> UUID.randomUUID() + \"-\" + UUID.randomUUID()); }\n    // … gui/post/get bằng java.net.http, dangKyVaDangNhap, taoSinhVien");
const MA183_LUONG = java("var tuDuyet = post(\"/api/v1/bookings/\" + id + \"/approve\", an, null, \"{\\\"version\\\":0}\");\nSystem.out.println(\"2 an tự duyệt:             \" + tuDuyet.statusCode());\nassertThat(tuDuyet.statusCode()).isEqualTo(403);\n\nvar binhXem = get(\"/api/v1/bookings/\" + id, binh);\nSystem.out.println(\"3 bình xem lượt của an:    \" + binhXem.statusCode() + \" \" + binhXem.body());\nassertThat(binhXem.statusCode()).isEqualTo(404);\n\nvar duyet = post(\"/api/v1/bookings/\" + id + \"/approve\", ql, null, \"{\\\"version\\\":0}\");\nSystem.out.println(\"4 quản lý duyệt v0:        \" + duyet.statusCode() + \" \" + duyet.body());\nassertThat(duyet.body()).contains(\"\\\"status\\\":\\\"CONFIRMED\\\"\");");
const MA183_AWAIT = java("await().atMost(Duration.ofSeconds(10)).untilAsserted(() ->\n    assertThat(get(\"/api/v1/notifications/mine\", an).body()).contains(\"đã được duyệt\"));");
const OUT183_VERIFY = out("$ mvn -B verify\nTests run: 10, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.295 s -- in vn.labflow.booking.internal.QuyTacDatTest\nRyuk started - will monitor and terminate Testcontainers containers on JVM exit\nContainer postgres:16 started in PT10.306381153S\n 2 request cùng lúc ⇒ {201=1, 409=1} trong 142 ms\n10 request cùng lúc ⇒ {201=1, 409=9} trong 72 ms\n50 request cùng lúc ⇒ {201=1, 409=49} trong 292 ms\nTests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 35.41 s -- in vn.labflow.DatTrungTest\nTests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.630 s -- in vn.labflow.KienTrucTest\nTests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.578 s -- in vn.labflow.LuongChinhTest\nBUILD SUCCESS\nTotal time:  01:16 min");
const OUT183_IDEM = out("lần 1: 201 {\"id\":1,\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-30T10:00:00\",\"endAt\":\"2026-11-30T11:00:00\",\"status\":\"CONFIRMED\",\"purpose\":\"bấm hai lần\",\"rejectReason\":null,\"version\":0}\nlần 2: 200 Idempotent-Replayed=true {\"id\":1,\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-30T10:00:00\",\"endAt\":\"2026-11-30T11:00:00\",\"status\":\"CONFIRMED\",\"purpose\":\"bấm hai lần\",\"rejectReason\":null,\"version\":0}");
const OUT183_LUONG = out("lượt 1 (2 giờ, 2026-11-26): 201\nlượt 2 (2 giờ, 2026-11-27): 201\nlượt 3 (2 giờ, 2026-11-28): 201\nlượt 4 (2 giờ, 2026-11-29): 422 {\"detail\":\"vượt hạn mức 6 giờ/tuần (đã giữ 360 phút)\",\"instance\":\"/api/v1/bookings\",\"status\":422,\"title\":\"Unprocessable Content\",\"type\":\"https://labflow.vn/errors/quota-exceeded\",\"code\":\"QUOTA_EXCEEDED\"}\n1 an đặt AI-03 (40 chỗ):   201 {\"id\":5,\"labCode\":\"AI-03\",\"startAt\":\"2026-11-26T09:00:00\",\"endAt\":\"2026-11-26T11:00:00\",\"status\":\"PENDING\",\"purpose\":\"Đồ án nhóm 3\",\"rejectReason\":null,\"version\":0}\n2 an tự duyệt:             403\n3 bình xem lượt của an:    404 {\"detail\":\"không tìm thấy lượt đặt 5\",\"instance\":\"/api/v1/bookings/5\",\"status\":404,\"title\":\"Not Found\",\"type\":\"https://labflow.vn/errors/not-found\",\"code\":\"NOT_FOUND\"}\n4 quản lý duyệt v0:        200 {\"id\":5,\"labCode\":\"AI-03\",\"startAt\":\"2026-11-26T09:00:00\",\"endAt\":\"2026-11-26T11:00:00\",\"status\":\"CONFIRMED\",\"purpose\":\"Đồ án nhóm 3\",\"rejectReason\":null,\"version\":1}\n5 duyệt lại bằng bản cũ:   409 {\"detail\":\"bạn đang xem phiên bản 0, lượt đặt đã ở phiên bản 1\",\"instance\":\"/api/v1/bookings/5/approve\",\"status\":409,\"title\":\"Conflict\",\"type\":\"https://labflow.vn/errors/stale\",\"code\":\"STALE\"}\n6 thông báo của an:        [{\"bookingId\":5,\"kind\":\"CREATED_PENDING\",\"message\":\"Lượt đặt #5 phòng AI-03 đang chờ duyệt\",\"createdAt\":\"2026-11-24T09:07:44.479949Z\"},{\"bookingId\":5,\"kind\":\"CONFIRMED\",\"message\":\"Lượt đặt #5 phòng AI-03 đã được duyệt\",\"createdAt\":\"2026-11-24T09:07:44.603174Z\"}]\n7 event_publication:       [{listener_id=vn.labflow.notification.internal.ThongBao.khiDat(vn.labflow.booking.BookingCreated), xong=true}, {listener_id=vn.labflow.notification.internal.ThongBao.khiDat(vn.labflow.booking.BookingCreated), xong=true}, {listener_id=vn.labflow.notification.internal.ThongBao.khiDat(vn.labflow.booking.BookingCreated), xong=true}, {listener_id=vn.labflow.notification.inter");
const MA183_DOCKER = bash("# syntax=docker/dockerfile:1\n# ---- tầng 1: build bằng JDK + Maven (không đi vào image cuối) ----\nFROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /src\nENV MAVEN_OPTS=\"-Xmx1g\"\nCOPY pom.xml .\nRUN --mount=type=cache,target=/root/.m2 mvn -B -q dependency:go-offline\nCOPY src ./src\nRUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests package \\\n && java -Djarmode=tools -jar target/labflow-api-1.0.0.jar extract --layers --launcher --destination /out\n\n# ---- tầng 2: chỉ JRE + các lớp của ứng dụng, chạy bằng user thường ----\nFROM eclipse-temurin:21-jre\nRUN useradd --system --uid 10001 labflow\nWORKDIR /app\n# thư viện ít đổi đứng trước, mã của bạn đứng sau ⇒ sửa một dòng Java chỉ build lại lớp cuối\nCOPY --from=build /out/dependencies/ ./\nCOPY --from=build /out/spring-boot-loader/ ./\nCOPY --from=build /out/snapshot-dependencies/ ./\nCOPY --from=build /out/application/ ./\nUSER labflow\nEXPOSE 8080\nENV JAVA_TOOL_OPTIONS=\"-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError\"\nENTRYPOINT [\"java\", \"org.springframework.boot.loader.launch.JarLauncher\"]");
const OUT183_IMAGE = out("$ docker image ls sb-c18-labflow\nREPOSITORY       TAG       SIZE\nsb-c18-labflow   1.0.0     616MB\n\n$ docker history sb-c18-labflow:1.0.0 --format \"{{.Size}}\t{{.CreatedBy}}\" | head -9\n0B\tENTRYPOINT [\"java\" \"org.springframework.boot.loader.launch.JarLauncher\"]\n0B\tENV JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError\n0B\tEXPOSE 8080/tcp\n0B\tUSER labflow\n279kB\tCOPY /out/application/ ./ # buildkit\n0B\tCOPY /out/snapshot-dependencies/ ./ # buildkit\n618kB\tCOPY /out/spring-boot-loader/ ./ # buildkit\n71.9MB\tCOPY /out/dependencies/ ./ # buildkit\n0B\tWORKDIR /app");
const MA183_COMPOSE = yml("# docker compose up -d --wait  ⇒ PostgreSQL + API, API chỉ nhận request khi CSDL đã sẵn sàng và Flyway chạy xong\nname: sb-c18\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: labflow\n      POSTGRES_USER: labflow\n      POSTGRES_PASSWORD: ${LABFLOW_DB_PASSWORD:?thiếu LABFLOW_DB_PASSWORD trong .env}\n    volumes:\n      - db-data:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U labflow -d labflow\"]\n      interval: 2s\n      timeout: 3s\n      retries: 30\n    mem_limit: 2g\n    cpus: 2\n  api:\n    build: .\n    image: sb-c18-labflow:1.0.0\n    depends_on:\n      db:\n        condition: service_healthy\n    environment:\n      LABFLOW_DB_URL: jdbc:postgresql://db:5432/labflow\n      LABFLOW_DB_PASSWORD: ${LABFLOW_DB_PASSWORD}\n      LABFLOW_JWT_SECRET: ${LABFLOW_JWT_SECRET:?thiếu LABFLOW_JWT_SECRET trong .env}\n      LABFLOW_MANAGER_PASSWORD: ${LABFLOW_MANAGER_PASSWORD:-}\n      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}\n    ports:\n      - \"127.0.0.1:41881:8080\"\n    healthcheck:\n      # image eclipse-temurin:21-jre có curl; /bin/sh là dash (không có /dev/tcp) ⇒ gọi curl thẳng, không qua shell\n      test: [\"CMD\", \"curl\", \"-fsS\", \"-o\", \"/dev/null\", \"http://127.0.0.1:8080/actuator/health/readiness\"]\n      interval: 3s\n      timeout: 3s\n      retries: 40\n      start_period: 10s\n    mem_limit: 1g\n    cpus: 2\nvolumes:\n  db-data:");
const MA183_ENV = bash("# chép thành .env rồi điền; .env nằm trong .gitignore, KHÔNG commit\nLABFLOW_DB_PASSWORD=\nLABFLOW_JWT_SECRET=\nLABFLOW_MANAGER_PASSWORD=");
const OUT183_HEALTH = out("$ docker inspect sb-c18-api-1 --format \"{{json .State.Health}}\" | jq -c \"{Status, FailingStreak, last: .Log[-1].Output}\"\n{\"Status\":\"unhealthy\",\"FailingStreak\":45,\"last\":\"/bin/sh: 1: cannot create /dev/tcp/127.0.0.1/8080: Directory nonexistent\\n\"}");
const OUT183_UP = out("$ time docker compose up -d --wait\n Container sb-c18-api-1 Waiting \n Container sb-c18-db-1 Healthy \n Container sb-c18-api-1 Healthy \nreal\t0m18.570s\n\n$ docker compose ps\nNAME           SERVICE   STATUS                    PORTS\nsb-c18-api-1   api       Up 13 seconds (healthy)   127.0.0.1:41881->8080/tcp\nsb-c18-db-1    db        Up 3 minutes (healthy)    5432/tcp\n\n$ docker compose restart api && docker compose up -d --wait  (đo lại khi image đã có)\nreal\t0m10.754s");
const OUT183_SAU = out("$ curl -s localhost:41881/actuator/health | jq -c .\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"UP\"}\n\n$ docker compose exec api id\nuid=10001(labflow) gid=999(labflow) groups=999(labflow)\n\n$ docker compose logs api | grep -E \"Successfully applied|Started\"\napi-1  | Successfully applied 5 migrations to schema \"public\", now at version v2026.11.03.0900 (execution time 00:00.181s)\napi-1  | Started LabflowApplication in 8.887 seconds (process running for 9.225)\n\n$ docker stats --no-stream\nNAME           MEM USAGE / LIMIT   CPU %\nsb-c18-api-1   382.1MiB / 1GiB     0.10%\nsb-c18-db-1    77.59MiB / 2GiB     0.00%");
const MA183_CI = yml("name: ci\non:\n  pull_request:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    timeout-minutes: 20\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with:\n          distribution: temurin\n          java-version: \"21\"\n          cache: maven\n      # test thật: Testcontainers dùng Docker có sẵn trên runner ubuntu-latest\n      # gồm KienTrucTest (ranh giới module) ⇒ ai import lớp nội bộ của module khác là PR đỏ\n      - run: mvn -B verify\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-reports\n          path: target/surefire-reports\n  image:\n    needs: build\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@v6\n        with:\n          push: true\n          tags: ghcr.io/${{ github.repository }}/api:${{ github.sha }}");

const L183_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3 · Capstone</span>
<h2>Tests, Docker and CI</h2>
<p class="lead">A capstone is judged on whether it runs on someone else's machine and whether you can prove it works. This lesson gives LabFlow three layers of proof: a test suite that includes the number a review board asks for ("50 people book the same slot at once — how many succeed?"), a Docker image and a Compose file that start the whole system with one command, and a CI pipeline that runs all of it on every pull request. Each layer had a real failure on the way, kept here because you will meet the same ones.</p>

<h3>Everyday picture first</h3>
<p>A restaurant opening a second branch does not send the chef with a list of tips. It sends a recipe card with exact quantities (the Dockerfile), a checklist the manager runs before opening each morning (the healthcheck), and a food inspector who tastes every new dish before it goes on the menu (CI). The test suite is the tasting itself — including the busy Friday night when fifty orders arrive at once.</p>

<h3>1. The test suite: four levels, sixteen tests</h3>
<p><strong>Rules in milliseconds.</strong> The pure-Java time rules of 18.2 are tested at their edges — exactly 14 days ahead is allowed, 30 minutes later is not:</p>
${MA183_QT}
<p><strong>One real PostgreSQL for the whole run</strong> (lesson 11.4), limited like every other container on a shared CI runner:</p>
${MA183_TC}
<p><strong>Calls over real HTTP.</strong> The full-stack tests start the application on a random port and call it with <code>java.net.http</code> — real filters, real JWT, real JSON. Passwords and the JWT secret are generated at run time; nothing secret is written in the test code:</p>
${MA183_GOI}
<p><strong>The number for the review board.</strong> 2, then 10, then 50 students, each with their own token and key, released at the same instant by a latch, on virtual threads:</p>
${MA183_DUA}
<p><strong>The main flow as a story</strong>, including the asynchronous notification (Awaitility waits for it instead of <code>Thread.sleep</code>):</p>
${MA183_LUONG}
${MA183_AWAIT}
<p>The whole suite, as CI runs it:</p>
${OUT183_VERIFY}
<p>Exactly one <code>201</code> at every size; the database ends with one row per slot. The other tests printed:</p>
${OUT183_IDEM}
${OUT183_LUONG}
<div class="callout warn"><p><strong>Two failures on the way, both real:</strong> (1) the first race run returned <code>{400=2}</code> — the test keys like <code>dua-2-0</code> were 7 characters and the API requires 8–64. A concurrency test that never reaches the database proves nothing; always print the status map, not only assert it. (2) The first full run failed to start any context: <code>Could not resolve placeholder 'LABFLOW_JWT_SECRET'</code>. Production secrets come only from the environment, so the test must supply its own (<code>@DynamicPropertySource</code> with a random value).</p></div>

<h3>2. The Docker image: two stages, layers, not root</h3>
${MA183_DOCKER}
<ul>
  <li><strong>Stage 1</strong> has the JDK and Maven; <strong>stage 2</strong> has only a JRE and the application. Build tools never ship.</li>
  <li><strong>Layered jar</strong>: <code>-Djarmode=tools … extract --layers</code> splits the jar into dependencies (change rarely) and application classes (change every commit). Docker caches each <code>COPY</code> separately.</li>
  <li><strong><code>--mount=type=cache</code></strong> keeps the Maven repository between builds; <code>MAVEN_OPTS=-Xmx1g</code> stops Maven from taking a quarter of the build machine's memory.</li>
  <li><strong><code>USER labflow</code></strong> (uid 10001): a bug in the application does not run as root inside the container.</li>
  <li><strong><code>MaxRAMPercentage=75</code></strong>: the JVM sizes its heap from the container's memory limit, not the host's (lesson 2.6).</li>
</ul>
${OUT183_IMAGE}
<p>The application layer is 279 kB; the dependencies are 71.9 MB. After you change one line of Java, only the 279 kB layer is new — pushing and pulling the image moves kilobytes, not the whole thing. Most of the 616 MB is the JRE base image, shared by every Java service on the machine.</p>

<h3>3. Compose: the whole system with one command</h3>
${MA183_COMPOSE}
${MA183_ENV}
<p>Three details matter: <code>${'$'}{LABFLOW_JWT_SECRET:?…}</code> refuses to start when a secret is missing (instead of starting with an empty one); <code>depends_on … service_healthy</code> starts the API only when PostgreSQL answers <code>pg_isready</code>; and the API's own healthcheck asks Actuator's <strong>readiness</strong> group, which becomes UP only after Flyway and the context have finished.</p>
<p><strong>The healthcheck that never passed.</strong> The first version used the shell trick <code>exec 3&lt;&gt;/dev/tcp/127.0.0.1/8080</code>, which works in bash. <code>docker compose up --wait</code> waited 2 minutes 27 seconds and reported the container unhealthy, although the API answered on the host. Docker kept the reason:</p>
${OUT183_HEALTH}
<p><code>CMD-SHELL</code> runs <code>/bin/sh</code>, which in the Ubuntu-based JRE image is <code>dash</code> — no <code>/dev/tcp</code>. The image does contain <code>curl</code>, so the fix calls it directly with the exec form (<code>["CMD", "curl", …]</code>), no shell involved:</p>
${OUT183_UP}
${OUT183_SAU}
<p>The API runs as uid 10001, uses 382 MiB of its 1 GiB limit at rest, and Flyway applied the four module migrations plus the dev seed on an empty volume. The demo maps the API to host port 41881; on your machine use 8080.</p>

<h3>4. CI: every pull request, the same commands</h3>
${MA183_CI}
<ul>
  <li><strong><code>mvn -B verify</code></strong> is the whole quality gate: unit tests, <code>KienTrucTest</code> (module borders), Testcontainers tests (GitHub's <code>ubuntu-latest</code> runners have Docker). Exactly the command that ran above.</li>
  <li><strong><code>cache: maven</code></strong> saves minutes per run; <strong>test reports</strong> are uploaded even when the build fails, so a red PR shows <em>which</em> test.</li>
  <li><strong>The image job</strong> runs only on <code>main</code>, after the tests, with the narrowest token permissions (<code>contents: read</code>, <code>packages: write</code>) and the commit SHA as the tag — you always know which code is running.</li>
  <li>Protect <code>main</code>: require the <code>build</code> check and one review (the module owner from CODEOWNERS) before merge.</li>
</ul>
<p>This workflow file is a template: GitHub runs it, not this machine. Its build job runs the same <code>mvn -B verify</code> whose output is shown in section 1.</p>

<h3>🕵️ Hacker corner — Codecov, 2021</h3>
<p>From 31 January 2021, attackers modified Codecov's Bash Uploader script, which thousands of CI pipelines downloaded and ran on every build. The modified script sent the CI environment variables — tokens, keys, database credentials — to a server of the attackers. It was discovered on 1 April and disclosed on 15 April 2021; companies spent weeks rotating every secret their pipelines had ever seen. <strong>What you do:</strong> a test job needs no production secrets (this suite generates its own); give each job the narrowest token (<code>permissions:</code>); pin third-party actions to a full commit SHA rather than a tag in serious projects; never pipe a downloaded script into a shell in CI.</p>

<h3>Compared with Node.js</h3>
<p>A Node image is smaller (no JRE; <code>node:22-alpine</code> ≈ 240 MB here) and starts in under a second, while this Spring Boot API needed about 9 seconds to start in the container. The structure is the same: multi-stage build (<code>npm ci</code> then copy <code>dist</code> and production <code>node_modules</code>), non-root user, healthcheck, <code>docker compose up --wait</code>, and a CI job running lint, tests with Testcontainers for Node, and the build. The JVM's startup cost is why Spring offers CDS/AOT and GraalVM native images (chapter 16).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you test concurrency?"</strong> — Against the real database: N clients released together (latch), count the status codes, then check the rows. Run it for several N in CI.</li>
  <li><strong>"Walk me through your Dockerfile."</strong> — Multi-stage, dependency cache, layered jar, JRE-only runtime, non-root user, memory-aware JVM flags, healthcheck through readiness.</li>
  <li><strong>"Liveness vs readiness?"</strong> — Liveness: is the process healthy or should it be restarted. Readiness: can it take traffic now (migrations done, dependencies reachable). Compose/Kubernetes route traffic only to ready instances.</li>
  <li><strong>"What does your CI do and why is it fast enough?"</strong> — One command (<code>mvn verify</code>) with a Maven cache and one shared PostgreSQL container; the image is built only on main, tagged with the commit.</li>
  <li><strong>"Where do secrets live?"</strong> — In the environment (.env outside Git locally, CI/host secret stores in production), never in the image or the repository; startup fails if one is missing.</li>
</ol>

<h3>🧪 Practice (60 minutes)</h3>
<div class="callout ok"><ol>
  <li>Change one line of Java (a log message), rebuild the image, and compare <code>docker history</code> before and after. Which layers changed?</li>
  <li>Start the stack, stop the database container (<code>docker compose stop db</code>), and watch <code>/actuator/health</code> and <code>docker compose ps</code> for 30 seconds. What happens to readiness, and why does the container not restart?</li>
  <li>Add a test that books 20 different 30-minute slots of the same lab in parallel (no overlap). Predict the status map before running.</li>
</ol>
<p><strong>Done when:</strong> you can name the changed layer, explain the health states you saw, and your prediction for task 3 matches.</p></div>
${giai('Show the answers', `<p>1. Only the <code>COPY /out/application/</code> layer (and the layers after it, which are metadata) changes; the 71.9 MB dependencies layer is reused from cache.</p><p>2. Measured with the database container stopped for 5 seconds: <code>/actuator/health</code> → <code>DOWN</code>, HTTP 503; <code>/actuator/health/readiness</code> → <code>UP</code>, HTTP 200. By default the readiness group contains only the application's own readiness state, not the database, so the healthcheck in compose.yaml stays green and the container stays "healthy". 8 seconds after the database came back, health was UP again without any restart (Hikari reconnects). Whether readiness should include the database (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>) is a design choice: with one shared database, every instance would turn unready at the same moment, so many teams leave it out and alert on <code>/actuator/health</code> instead. Compose never restarts a container just because it is unhealthy.</p><p>3. <code>{201=20}</code>: different slots never overlap, and different users never wait for each other's advisory lock. If you used one user for all 20, the weekly quota (6 h = 12 slots of 30 min) gives <code>{201=12, 422=8}</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Multi-stage build</strong> — a Dockerfile with several FROM stages; only the last one becomes the image.</li>
  <li><strong>Layered jar</strong> — a Spring Boot jar split into dependency and application layers for better Docker caching.</li>
  <li><strong>Healthcheck</strong> — a command Docker runs periodically to mark a container healthy or unhealthy.</li>
  <li><strong>Readiness probe</strong> — "ready to receive traffic"; Actuator's <code>/actuator/health/readiness</code>.</li>
  <li><strong>CountDownLatch</strong> — a gate that releases all waiting threads at once; used to start concurrent requests together.</li>
  <li><strong>Supply-chain attack</strong> — compromising a tool or dependency that many projects run, to reach them all.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li><code>mvn -B verify</code>: 16 tests in 1 min 16 s — unit rules, module borders, a real PostgreSQL, full HTTP flows.</li>
  <li>2/10/50 simultaneous bookings of one slot ⇒ exactly one 201 each time; the same key twice ⇒ 201 then 200 with the same body.</li>
  <li>Image: two stages, JRE only, non-root; application layer 279 kB vs dependencies 71.9 MB.</li>
  <li><code>docker compose up -d --wait</code> starts PostgreSQL then the API, waits for readiness: 18.6 s; a bash-only healthcheck under dash never passed.</li>
  <li>CI runs the same verify on every PR, uploads reports, builds the image only on main with minimal permissions.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html', '🐳', 'Spring Boot — Dockerfiles', 'Layered jars, extracting, CDS.')}
${tl('https://docs.docker.com/reference/compose-file/services/#healthcheck', '🩺', 'Compose file reference — healthcheck', 'CMD vs CMD-SHELL, start_period.')}
${tl('https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions', '🔐', 'GitHub — security hardening for Actions', 'Permissions, pinning, secrets.')}
${tl('https://about.codecov.io/security-update/', '🕵️', 'Codecov — security update (April 2021)', 'The Bash Uploader incident, first-hand.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>mvn -B verify</code> on <code>lab/c18/labflow</code> (Testcontainers 2.0.5, Ryuk 0.14.0, PostgreSQL 16.16), <code>t/183-docker.sh</code> (Docker Compose, image <code>sb-c18-labflow:1.0.0</code>), 24/11/2026. The CI file is a template (not run on GitHub from this machine).</li>
  <li>Codecov: security update of 15/04/2021 and its post-incident updates.</li>
</ul>
</div>
`;

const L183_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3 · Dự án cuối khoá</span>
<h2>Test, Docker và CI</h2>
<p class="lead">Một dự án cuối khoá được chấm ở chỗ nó có chạy trên máy người khác không, và bạn có chứng minh được nó đúng không. Bài này cho LabFlow ba lớp bằng chứng: bộ test có cả con số hội đồng hay hỏi ("50 người cùng đặt một khung giờ một lúc — mấy người được?"), một image Docker và tệp Compose dựng cả hệ thống bằng một lệnh, và một pipeline CI chạy tất cả ở mọi pull request. Lớp nào trên đường làm cũng có một lỗi thật, được giữ lại đây vì bạn sẽ gặp đúng những lỗi đó.</p>

<h3>Đời thường trước đã</h3>
<p>Nhà hàng mở chi nhánh thứ hai không gửi đầu bếp đi kèm một danh sách mẹo. Họ gửi phiếu công thức có định lượng chính xác (Dockerfile), một bảng kiểm mà quản lý chạy mỗi sáng trước khi mở cửa (healthcheck), và một người kiểm định nếm mọi món mới trước khi lên thực đơn (CI). Bộ test chính là việc nếm — kể cả tối thứ Sáu đông khách khi năm mươi đơn tới cùng lúc.</p>

<h3>1. Bộ test: bốn tầng, mười sáu test</h3>
<p><strong>Luật trong vài mili giây.</strong> Luật khung giờ Java thuần ở 18.2 được test ngay tại các biên — đặt trước đúng 14 ngày thì được, trễ 30 phút thì không:</p>
${MA183_QT}
<p><strong>Một PostgreSQL thật cho cả lần chạy</strong> (bài 11.4), có giới hạn như mọi container khác trên máy CI dùng chung:</p>
${MA183_TC}
<p><strong>Gọi qua HTTP thật.</strong> Test toàn hệ thống khởi động ứng dụng ở cổng ngẫu nhiên rồi gọi bằng <code>java.net.http</code> — filter thật, JWT thật, JSON thật. Mật khẩu và khoá ký JWT sinh lúc chạy; không có bí mật nào ghi trong mã test:</p>
${MA183_GOI}
<p><strong>Con số cho hội đồng.</strong> 2, rồi 10, rồi 50 sinh viên, mỗi người token và khoá riêng, được một chốt (latch) thả ra cùng một khoảnh khắc, trên virtual thread:</p>
${MA183_DUA}
<p><strong>Luồng chính kể như một câu chuyện</strong>, gồm cả thông báo bất đồng bộ (Awaitility chờ nó thay cho <code>Thread.sleep</code>):</p>
${MA183_LUONG}
${MA183_AWAIT}
<p>Cả bộ test, đúng như CI chạy:</p>
${OUT183_VERIFY}
<p>Ở mọi cỡ đều đúng một <code>201</code>; CSDL kết thúc với mỗi khung giờ một dòng. Các test còn lại in ra:</p>
${OUT183_IDEM}
${OUT183_LUONG}
<div class="callout warn"><p><strong>Hai lần hỏng trên đường, đều là thật:</strong> (1) lần chạy đua đầu tiên trả <code>{400=2}</code> — khoá test kiểu <code>dua-2-0</code> chỉ dài 7 ký tự trong khi API đòi 8–64. Một test đồng thời không chạm tới CSDL thì chẳng chứng minh được gì; luôn in bảng đếm mã trạng thái, đừng chỉ assert. (2) Lần chạy đủ đầu tiên không dựng được context nào: <code>Could not resolve placeholder 'LABFLOW_JWT_SECRET'</code>. Bí mật production chỉ đến từ biến môi trường, nên test phải tự cấp (<code>@DynamicPropertySource</code> với giá trị ngẫu nhiên).</p></div>

<h3>2. Image Docker: hai tầng, chia lớp, không chạy bằng root</h3>
${MA183_DOCKER}
<ul>
  <li><strong>Tầng 1</strong> có JDK và Maven; <strong>tầng 2</strong> chỉ có JRE và ứng dụng. Công cụ build không bao giờ đi theo image.</li>
  <li><strong>Layered jar</strong>: <code>-Djarmode=tools … extract --layers</code> tách jar thành thư viện (ít đổi) và lớp của ứng dụng (đổi mỗi commit). Docker cache riêng từng lệnh <code>COPY</code>.</li>
  <li><strong><code>--mount=type=cache</code></strong> giữ kho Maven giữa các lần build; <code>MAVEN_OPTS=-Xmx1g</code> chặn Maven chiếm một phần tư RAM của máy build.</li>
  <li><strong><code>USER labflow</code></strong> (uid 10001): lỗi trong ứng dụng không chạy với quyền root trong container.</li>
  <li><strong><code>MaxRAMPercentage=75</code></strong>: JVM tính heap theo giới hạn bộ nhớ của container, không theo RAM của máy (bài 2.6).</li>
</ul>
${OUT183_IMAGE}
<p>Lớp ứng dụng nặng 279 kB; lớp thư viện 71,9 MB. Sửa một dòng Java xong, chỉ lớp 279 kB là mới — đẩy và kéo image chỉ chuyển vài trăm kB, không phải cả khối. Phần lớn 616 MB là image JRE nền, dùng chung cho mọi dịch vụ Java trên máy.</p>

<h3>3. Compose: cả hệ thống bằng một lệnh</h3>
${MA183_COMPOSE}
${MA183_ENV}
<p>Ba chi tiết quan trọng: <code>${'$'}{LABFLOW_JWT_SECRET:?…}</code> từ chối khởi động khi thiếu bí mật (thay vì chạy với giá trị rỗng); <code>depends_on … service_healthy</code> chỉ khởi động API khi PostgreSQL trả lời <code>pg_isready</code>; và healthcheck của API hỏi nhóm <strong>readiness</strong> của Actuator, nhóm này chỉ UP sau khi Flyway và context đã xong.</p>
<p><strong>Healthcheck không bao giờ qua.</strong> Bản đầu dùng mẹo shell <code>exec 3&lt;&gt;/dev/tcp/127.0.0.1/8080</code>, chạy được trong bash. <code>docker compose up --wait</code> chờ 2 phút 27 giây rồi báo container unhealthy, dù API vẫn trả lời từ máy. Docker giữ lại lý do:</p>
${OUT183_HEALTH}
<p><code>CMD-SHELL</code> chạy <code>/bin/sh</code>, mà trong image JRE nền Ubuntu thì đó là <code>dash</code> — không có <code>/dev/tcp</code>. Image lại có sẵn <code>curl</code>, nên cách sửa là gọi thẳng nó bằng dạng exec (<code>["CMD", "curl", …]</code>), không qua shell nào:</p>
${OUT183_UP}
${OUT183_SAU}
<p>API chạy bằng uid 10001, lúc rảnh dùng 382 MiB trên giới hạn 1 GiB, và Flyway chạy bốn migration của bốn module cộng dữ liệu mẫu dev trên một volume trống. Bản demo ánh xạ API ra cổng 41881 của máy; ở máy bạn hãy dùng 8080.</p>

<h3>4. CI: mọi pull request, cùng những lệnh đó</h3>
${MA183_CI}
<ul>
  <li><strong><code>mvn -B verify</code></strong> là toàn bộ cổng chất lượng: unit test, <code>KienTrucTest</code> (ranh giới module), test Testcontainers (máy chạy <code>ubuntu-latest</code> của GitHub có Docker). Đúng lệnh đã chạy ở trên.</li>
  <li><strong><code>cache: maven</code></strong> tiết kiệm vài phút mỗi lần; <strong>báo cáo test</strong> được tải lên cả khi build hỏng, nên PR đỏ cho thấy <em>test nào</em> hỏng.</li>
  <li><strong>Job image</strong> chỉ chạy trên <code>main</code>, sau test, với quyền token hẹp nhất (<code>contents: read</code>, <code>packages: write</code>) và lấy SHA của commit làm tag — luôn biết mã nào đang chạy.</li>
  <li>Bảo vệ <code>main</code>: bắt buộc check <code>build</code> xanh và một lượt duyệt (chủ module theo CODEOWNERS) trước khi gộp.</li>
</ul>
<p>Tệp workflow này là mẫu: GitHub chạy nó, không phải máy này. Job build của nó chạy đúng lệnh <code>mvn -B verify</code> có output ở mục 1.</p>

<h3>🕵️ Góc hacker — Codecov, 2021</h3>
<p>Từ 31/01/2021, kẻ tấn công sửa script Bash Uploader của Codecov — thứ mà hàng nghìn pipeline CI tải về và chạy ở mỗi lần build. Script bị sửa gửi các biến môi trường của CI — token, khoá, thông tin đăng nhập CSDL — về máy chủ của kẻ tấn công. Vụ việc bị phát hiện ngày 01/04 và công bố ngày 15/04/2021; các công ty mất hàng tuần để đổi mọi bí mật mà pipeline của họ từng thấy. <strong>Cách phòng:</strong> job test không cần bí mật production (bộ test này tự sinh bí mật); cấp cho mỗi job token hẹp nhất (<code>permissions:</code>); ở dự án nghiêm túc, ghim action bên thứ ba bằng SHA đầy đủ thay vì tag; không bao giờ tải script rồi đổ thẳng vào shell trong CI.</p>

<h3>So với Node.js</h3>
<p>Image Node nhỏ hơn (không có JRE; <code>node:22-alpine</code> ở máy này ≈ 240 MB) và khởi động dưới một giây, còn API Spring Boot này cần khoảng 9 giây để lên trong container. Cấu trúc thì giống nhau: build nhiều tầng (<code>npm ci</code> rồi chép <code>dist</code> và <code>node_modules</code> production), user không phải root, healthcheck, <code>docker compose up --wait</code>, và một job CI chạy lint, test với Testcontainers cho Node, rồi build. Cái giá khởi động của JVM là lý do Spring có CDS/AOT và GraalVM native image (chương 16).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Bạn test đồng thời thế nào?"</strong> — Trên CSDL thật: N client được thả cùng lúc (latch), đếm mã trạng thái, rồi kiểm các dòng trong bảng. Chạy với vài giá trị N trong CI.</li>
  <li><strong>"Giải thích Dockerfile của bạn."</strong> — Nhiều tầng, cache thư viện, layered jar, chỉ JRE lúc chạy, user không phải root, cờ JVM biết giới hạn bộ nhớ, healthcheck qua readiness.</li>
  <li><strong>"Liveness khác readiness ra sao?"</strong> — Liveness: tiến trình còn khoẻ không, hay phải khởi động lại. Readiness: lúc này nhận traffic được chưa (migration xong, phụ thuộc với tới được). Compose/Kubernetes chỉ chuyển traffic tới instance đã sẵn sàng.</li>
  <li><strong>"CI của bạn làm gì, và vì sao đủ nhanh?"</strong> — Một lệnh (<code>mvn verify</code>) có cache Maven và một container PostgreSQL dùng chung; image chỉ build trên main, gắn tag theo commit.</li>
  <li><strong>"Bí mật để ở đâu?"</strong> — Trong biến môi trường (.env ngoài Git khi làm ở máy, kho bí mật của CI/máy chủ ở production), không bao giờ trong image hay repo; thiếu là không khởi động.</li>
</ol>

<h3>🧪 Thực hành (60 phút)</h3>
<div class="callout ok"><ol>
  <li>Sửa một dòng Java (một câu log), build lại image, so <code>docker history</code> trước và sau. Lớp nào đổi?</li>
  <li>Dựng cả hệ thống, dừng container CSDL (<code>docker compose stop db</code>), theo dõi <code>/actuator/health</code> và <code>docker compose ps</code> trong 30 giây. Readiness ra sao, và vì sao container không tự khởi động lại?</li>
  <li>Thêm một test đặt song song 20 khung 30 phút khác nhau của cùng một phòng (không chồng nhau). Đoán bảng đếm mã trước khi chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được lớp đã đổi, giải thích được các trạng thái health đã thấy, và dự đoán ở câu 3 khớp.</p></div>
${giai('Xem đáp án', `<p>1. Chỉ lớp <code>COPY /out/application/</code> (và các lớp sau nó, vốn chỉ là siêu dữ liệu) đổi; lớp thư viện 71,9 MB được dùng lại từ cache.</p><p>2. Đo thật khi dừng container CSDL 5 giây: <code>/actuator/health</code> → <code>DOWN</code>, HTTP 503; <code>/actuator/health/readiness</code> → <code>UP</code>, HTTP 200. Mặc định nhóm readiness chỉ chứa trạng thái sẵn sàng của chính ứng dụng, không chứa CSDL, nên healthcheck trong compose.yaml vẫn xanh và container vẫn "healthy". CSDL chạy lại 8 giây sau thì health về UP mà không cần khởi động lại gì (Hikari tự nối lại). Có nên đưa CSDL vào readiness (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>) hay không là một quyết định thiết kế: dùng chung một CSDL thì mọi instance sẽ cùng lúc thành chưa sẵn sàng, nên nhiều nhóm để nó ngoài readiness và đặt cảnh báo trên <code>/actuator/health</code>. Compose không bao giờ khởi động lại container chỉ vì nó unhealthy.</p><p>3. <code>{201=20}</code>: các khung khác nhau không bao giờ chồng, và người khác nhau không chờ khoá tư vấn của nhau. Nếu dùng một người cho cả 20, hạn mức tuần (6 giờ = 12 khung 30 phút) cho <code>{201=12, 422=8}</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Multi-stage build</strong> — Dockerfile có nhiều tầng FROM; chỉ tầng cuối thành image.</li>
  <li><strong>Layered jar</strong> — jar Spring Boot tách thành lớp thư viện và lớp ứng dụng để Docker cache tốt hơn.</li>
  <li><strong>Healthcheck</strong> — lệnh Docker chạy định kỳ để đánh dấu container khoẻ hay không.</li>
  <li><strong>Readiness probe</strong> — "sẵn sàng nhận traffic"; <code>/actuator/health/readiness</code> của Actuator.</li>
  <li><strong>CountDownLatch</strong> — cái chốt thả mọi luồng đang chờ cùng một lúc; dùng để bắt đầu các request đồng thời.</li>
  <li><strong>Tấn công chuỗi cung ứng</strong> — chiếm một công cụ hay thư viện mà rất nhiều dự án chạy, để với tới tất cả chúng.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>mvn -B verify</code>: 16 test trong 1 phút 16 giây — luật đơn vị, ranh giới module, PostgreSQL thật, luồng HTTP đầy đủ.</li>
  <li>2/10/50 lượt đặt cùng lúc vào một khung giờ ⇒ lần nào cũng đúng một 201; cùng khoá hai lần ⇒ 201 rồi 200 với cùng thân.</li>
  <li>Image: hai tầng, chỉ JRE, không root; lớp ứng dụng 279 kB so với thư viện 71,9 MB.</li>
  <li><code>docker compose up -d --wait</code> dựng PostgreSQL rồi API, chờ readiness: 18,6 giây; healthcheck chỉ chạy được trong bash thì dưới dash không bao giờ qua.</li>
  <li>CI chạy đúng lệnh verify ở mọi PR, tải báo cáo lên, chỉ build image trên main với quyền tối thiểu.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html', '🐳', 'Spring Boot — Dockerfiles', 'Layered jar, tách lớp, CDS.')}
${tl('https://docs.docker.com/reference/compose-file/services/#healthcheck', '🩺', 'Tham chiếu tệp Compose — healthcheck', 'CMD với CMD-SHELL, start_period.')}
${tl('https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions', '🔐', 'GitHub — gia cố bảo mật cho Actions', 'Quyền, ghim phiên bản, bí mật.')}
${tl('https://about.codecov.io/security-update/', '🕵️', 'Codecov — security update (04/2021)', 'Vụ Bash Uploader, từ chính hãng.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>mvn -B verify</code> trên <code>lab/c18/labflow</code> (Testcontainers 2.0.5, Ryuk 0.14.0, PostgreSQL 16.16), <code>t/183-docker.sh</code> (Docker Compose, image <code>sb-c18-labflow:1.0.0</code>), 24/11/2026. Tệp CI là mẫu (không chạy trên GitHub từ máy này).</li>
  <li>Codecov: thông báo bảo mật ngày 15/04/2021 và các bản cập nhật sau sự cố.</li>
</ul>
</div>
`;

// ===== Bài 18.4 =====
const OUT184_DOCS = out("$ curl -s $API/v3/api-docs | jq -r '.info.title + \" \" + .openapi'\nLabFlow API 3.1.0\n\n$ curl -s $API/v3/api-docs | jq -r '.paths | to_entries[] | .key + \"  \" + (.value | keys | join(\",\"))'\n/api/v1/labs  get,post\n/api/v1/bookings  post\n/api/v1/bookings/{id}/reject  post\n/api/v1/bookings/{id}/cancel  post\n/api/v1/bookings/{id}/approve  post\n/api/v1/auth/register  post\n/api/v1/auth/login  post\n/api/v1/labs/{code}/status  patch\n/api/v1/notifications/mine  get\n/api/v1/bookings/{id}  get\n/api/v1/bookings/schedule  get\n/api/v1/bookings/mine  get\n\n$ curl -s $API/v3/api-docs | jq -c '.components.schemas.DatRequest'\n{\"type\":\"object\",\"properties\":{\"labCode\":{\"type\":\"string\",\"minLength\":1},\"startAt\":{\"type\":\"string\",\"format\":\"date-time\"},\"endAt\":{\"type\":\"string\",\"format\":\"date-time\"},\"purpose\":{\"type\":\"string\",\"maxLength\":200,\"minLength\":0}},\"required\":[\"endAt\",\"labCode\",\"purpose\",\"startAt\"]}\n\n$ curl -s $API/v3/api-docs | jq -c '.paths[\"/api/v1/bookings\"].post.parameters'\n[{\"name\":\"Idempotency-Key\",\"in\":\"header\",\"required\":true,\"schema\":{\"type\":\"string\",\"maxLength\":64,\"minLength\":8}}]");
const MA184_APIDOCS = java("/** Tên + cách xác thực trên hợp đồng OpenAPI: Swagger UI có nút Authorize, client TypeScript sinh ra biết gửi Bearer. */\n@Configuration\n@OpenAPIDefinition(info = @Info(title = \"LabFlow API\", version = \"v1\", description = \"Đặt lịch phòng lab — capstone khoá Spring Boot\"),\n                   security = @SecurityRequirement(name = \"bearer\"))\n@SecurityScheme(name = \"bearer\", type = SecuritySchemeType.HTTP, scheme = \"bearer\", bearerFormat = \"JWT\")\nclass ApiDocs { }");
const OUT184_SAU = out("$ curl -s $API/v3/api-docs | jq -c '{title: .info.title, security, schemes: .components.securitySchemes}'\n{\"title\":\"LabFlow API\",\"security\":[{\"bearer\":[]}],\"schemes\":{\"bearer\":{\"type\":\"http\",\"scheme\":\"bearer\",\"bearerFormat\":\"JWT\"}}}");
const MA184_PKG = js("  \"scripts\": {\n    \"gen:api\": \"openapi-typescript openapi.json -o src/api-types.ts\",\n    \"dev\": \"vite\",\n    \"build\": \"tsc -b && vite build\",\n    \"smoke\": \"tsx smoke.ts\"\n  },");
const MA184_TYPES = js("DatRequest: {\n    labCode: string;\n    /** Format: date-time */\n    startAt: string;\n    /** Format: date-time */\n    endAt: string;\n    purpose: string;\n};");
const MA184_API = js("// Một chỗ duy nhất gọi API LabFlow. Kiểu lấy từ api-types.ts (sinh từ /v3/api-docs) ⇒ backend đổi hợp đồng là tsc báo đỏ.\nimport createClient, { type Middleware } from \"openapi-fetch\";\nimport type { components, paths } from \"./api-types\";\n\nexport type Lab = components[\"schemas\"][\"LabInfo\"];\nexport type Booking = components[\"schemas\"][\"BookingView\"];\nexport type DatPhong = components[\"schemas\"][\"DatRequest\"];\n/** Khuôn lỗi RFC 9457 + code/fields mà backend trả cho MỌI lỗi. */\nexport type Loi = { status: number; code: string; detail: string; fields?: Record<string, string> };\n\nexport function taoApi(baseUrl: string, layToken: () => string | null, khiHetPhien: () => void) {\n  const api = createClient<paths>({ baseUrl });\n  const ganToken: Middleware = {\n    onRequest({ request }) {\n      const t = layToken();\n      if (t) request.headers.set(\"Authorization\", `Bearer ${t}`);\n      return request;\n    },\n    onResponse({ request, response }) {\n      // 401 ở API khác /auth ⇒ token hết hạn/sai ⇒ về màn đăng nhập. 403 KHÔNG đăng xuất: đăng nhập rồi nhưng không đủ quyền.\n      if (response.status === 401 && !new URL(request.url).pathname.startsWith(\"/api/v1/auth\")) khiHetPhien();\n      return response;\n    },\n  };\n  api.use(ganToken);\n  return api;\n}\nexport type Api = ReturnType<typeof taoApi>;\n\n/** Câu hiện cho người dùng, chọn theo MÃ lỗi ổn định — không phân tích câu chữ tiếng Việt của server. */\nexport function loiChoNguoiDung(e: Loi): string {\n  switch (e.code) {\n    case \"SLOT_TAKEN\": return \"Khung giờ này vừa có người đặt. Hãy chọn giờ khác.\";\n    case \"QUOTA_EXCEEDED\": return \"Bạn đã dùng hết 6 giờ đặt phòng của tuần này.\";\n    case \"NOT_30_MIN_GRID\": return \"Giờ bắt đầu và kết thúc phải tròn 30 phút (9:00, 9:30…).\";\n    case \"VALIDATION\": return Object.entries(e.fields ?? {}).map(([k, v]) => `${k}: ${v}`).join(\" · \");\n    default: return e.detail;\n  }\n}\n\n/**\n * Đặt phòng. `khoa` (Idempotency-Key) sinh MỘT lần cho mỗi lần người dùng bấm \"Đặt\" và dùng lại khi tự thử lại\n * (mạng rớt, timeout) ⇒ server trả lại đúng lượt cũ thay vì tạo lượt thứ hai.\n */\nexport async function datPhong(api: Api, body: DatPhong, khoa: string): Promise<{ ok: true; booking: Booking; lapLai: boolean } | { ok: false; loi: Loi }> {\n  const { data, error, response } = await api.POST(\"/api/v1/bookings\", { params: { header: { \"Idempotency-Key\": khoa } }, body });\n  if (data) return { ok: true, booking: data, lapLai: response.headers.get(\"Idempotent-Replayed\") === \"true\" };\n  return { ok: false, loi: error as unknown as Loi };\n}");
const MA184_APP = js("const [khoa, setKhoa] = useState(() => crypto.randomUUID());     // một khoá cho MỘT ý định đặt\n\nasync function taiLai() {\n  const [l, m] = await Promise.all([api.GET(\"/api/v1/labs\", { params: { query: { size: 50 } } }), api.GET(\"/api/v1/bookings/mine\")]);\n  setLabs(l.data?.items ?? []); setMine(m.data?.items ?? []);\n}\nuseEffect(() => { void taiLai(); }, []);\n\nasync function dat(e: React.FormEvent) {\n  e.preventDefault();\n  setDangGui(true);                                                   // khoá nút: chặn bấm đúp ở phía giao diện\n  const kq = await datPhong(api, { labCode: lab, startAt: `${ngay}T${tu}`, endAt: `${ngay}T${den}`, purpose: \"đặt từ web\" }, khoa);\n  setDangGui(false);\n  if (kq.ok) {\n    setThongBao(kq.booking.status === \"PENDING\" ? \"Đã gửi, chờ quản lý duyệt.\" : \"Đã giữ phòng.\");\n    setKhoa(crypto.randomUUID());                                    // ý định mới ⇒ khoá mới\n    void taiLai();\n  } else setThongBao(loiChoNguoiDung(kq.loi));\n}");
const OUT184_BUILD = out("$ npm run build\ntransforming...\n✓ 30 modules transformed.\nrendering chunks...\ncomputing gzip size...\ndist/index.html                  0.22 kB │ gzip:  0.19 kB\ndist/assets/index-D9rH4h1k.js  232.54 kB │ gzip: 73.33 kB\n✓ built in 2.02s");
const OUT184_SMOKE = out("$ API=http://localhost:8080 npx tsx smoke.ts\nđăng nhập an.nguyen@fpt.edu.vn: có token\nphòng: AI-03* HW-04 IOT-01 NET-02\nbấm lần 1: #1 CONFIRMED lapLai=false\nbấm lần 2: #1 CONFIRMED lapLai=true\nđăng nhập binh.tran@fpt.edu.vn: có token\nbình đặt chồng giờ: 409 SLOT_TAKEN ⇒ \"Khung giờ này vừa có người đặt. Hãy chọn giờ khác.\"\ngiờ lẻ: 422 NOT_30_MIN_GRID ⇒ \"Giờ bắt đầu và kết thúc phải tròn 30 phút (9:00, 9:30…).\"\nsinh viên gọi approve: 403 (token vẫn giữ: true )\n  ↳ 401 ⇒ xoá token, về màn đăng nhập\ntoken bị sửa: 401 token còn: null");
const MA184_CORS = java("@Bean\nCorsConfigurationSource corsConfigurationSource(@Value(\"${labflow.cors.origins}\") List<String> origins) {\n    CorsConfiguration c = new CorsConfiguration();\n    c.setAllowedOrigins(origins);                    // liệt kê đúng origin của frontend, không \"*\"\n    c.setAllowedMethods(List.of(\"GET\", \"POST\", \"PATCH\", \"DELETE\"));\n    c.setAllowedHeaders(List.of(\"Authorization\", \"Content-Type\", \"Idempotency-Key\"));\n    c.setMaxAge(3600L);\n    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();\n    s.registerCorsConfiguration(\"/api/**\", c);\n    return s;\n}");
const OUT184_CORS = out("$ curl -s -i -X OPTIONS -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: authorization,content-type,idempotency-key' $API/api/v1/bookings | grep -iE '^HTTP|^Access-Control'\nHTTP/1.1 200 \r\nAccess-Control-Allow-Origin: http://localhost:5173\r\nAccess-Control-Allow-Methods: GET,POST,PATCH,DELETE\r\nAccess-Control-Allow-Headers: authorization, content-type, idempotency-key\r\nAccess-Control-Max-Age: 3600\r\n\n$ curl -s -i -X OPTIONS -H 'Origin: https://evil.example' -H 'Access-Control-Request-Method: POST' $API/api/v1/bookings | grep -iE '^HTTP|^Access-Control|Invalid'\nHTTP/1.1 403 \r\nInvalid CORS request");

const L184_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4 · Capstone</span>
<h2>Frontend, final checklist and the Node.js comparison</h2>
<p class="lead">An API is finished when a real frontend can use it without guessing. This lesson connects a React page (Vite + TypeScript) to LabFlow through the OpenAPI contract the backend generates, runs the same client code against the live API, and then closes the course: a checklist of what you should now be able to do, an honest comparison with Node.js, and the interview questions that span the whole course.</p>

<h3>Everyday picture first</h3>
<p>A restaurant menu is a contract between the kitchen and the waiters: names, prices, what comes with what. If the kitchen changes a dish and nobody reprints the menu, the waiter promises something the kitchen no longer makes. Generating the menu from the kitchen's own recipe book — every night — removes that whole class of mistakes. That is what generating the frontend's types from the backend's OpenAPI does.</p>

<h3>1. The contract, generated from the running code</h3>
<p>springdoc reads the controllers, records and validation annotations and serves an OpenAPI 3.1 document. A small configuration adds the title and tells clients that requests carry a Bearer JWT:</p>
${MA184_APIDOCS}
${OUT184_DOCS}
${OUT184_SAU}
<p>Note what came for free: <code>required</code> from <code>@NotBlank</code>/<code>@NotNull</code>, <code>maxLength: 200</code> from <code>@Size</code>, the mandatory <code>Idempotency-Key</code> header with its length limits. Swagger UI is at <code>/swagger-ui.html</code>. In production, either protect these endpoints or turn them off (<code>springdoc.api-docs.enabled=false</code>) — springdoc itself warns about this at startup.</p>

<h3>2. TypeScript types from the contract</h3>
${MA184_PKG}
<p><code>npm run gen:api</code> (openapi-typescript 7.13.0) turned the 8.7 kB document into <code>src/api-types.ts</code>:</p>
${MA184_TYPES}
<p>Now a renamed field in a Java record becomes a red <code>tsc</code> error in the frontend build, not a blank cell in production. Make it a CI step: regenerate, then fail if <code>git diff</code> is not empty.</p>

<h3>3. One place that calls the API</h3>
${MA184_API}
<ul>
  <li><strong>401 vs 403 in the UI</strong>: 401 (token missing, expired or forged) ⇒ forget the token and show the login screen. 403 ⇒ stay logged in and show "not allowed". Mixing them logs users out when they click a manager button.</li>
  <li><strong>Messages by <code>code</code></strong>, never by parsing the server's sentence: the server may reword its Vietnamese; the code is the contract.</li>
  <li><strong>The Idempotency-Key belongs to the user's intent</strong>: one key per click of "Book", reused if the same request is retried, a new one for the next booking.</li>
</ul>
${MA184_APP}
<p>Two guards against the double click: the button is disabled while the request is in flight (UI), and the same key makes the server return the same booking if a second request still gets through (server). The token is kept in memory, not in <code>localStorage</code>: any script running in the page — including an injected one — can read <code>localStorage</code> (see the hacker corner). The trade-off is a new login after a page reload; chapter 9's refresh token in an HttpOnly cookie removes it.</p>

<h3>4. Proof: build, CORS and the same client against the live API</h3>
${OUT184_BUILD}
<p>The browser at <code>http://localhost:5173</code> calls the API at port 8080 — a different origin, so the browser first sends a CORS preflight. Only the listed origin, methods and headers pass:</p>
${MA184_CORS}
${OUT184_CORS}
<p>Finally <code>smoke.ts</code> imports the <em>same</em> <code>src/api.ts</code> the page uses and runs the main paths against the running API (Node 22 has <code>fetch</code> and <code>crypto.randomUUID</code>):</p>
${OUT184_SMOKE}
<p>Every branch of the client was exercised for real: replay returns <code>lapLai=true</code> with the same id, 409 and 422 become the user's sentences, 403 keeps the token, and a forged token (two characters changed) gets 401 and clears it.</p>
<div class="callout warn"><p><strong>Measured gap:</strong> the generated type of <code>error</code> is <code>undefined</code> for every operation — <code>tsc</code> refused <code>error as {detail?: string}</code>. The contract does not describe error responses, so the client cannot type them. Add <code>@ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))</code> on the operations (or a global customizer) and regenerate.</p></div>

<h3>5. Checklist: what you can now do</h3>
<table>
  <thead><tr><th>Area</th><th>You can…</th><th>Where</th></tr></thead>
  <tbody>
    <tr><td>Java</td><td>model data with records/sealed types, choose collections, reason about threads, virtual threads, GC</td><td>Ch. 1–2</td></tr>
    <tr><td>Spring core</td><td>explain beans, DI, lifecycle, proxies, auto-configuration</td><td>Ch. 3</td></tr>
    <tr><td>REST</td><td>design resources, status codes, validation, one error format</td><td>Ch. 4–5, 18.2</td></tr>
    <tr><td>Data</td><td>JPA without N+1, transactions, isolation, optimistic locking, Flyway per module</td><td>Ch. 6–8, 18.1</td></tr>
    <tr><td>Security</td><td>JWT, roles, ownership checks, and attack your own API</td><td>Ch. 9–10, 18.2</td></tr>
    <tr><td>Proof</td><td>unit, slice, Testcontainers and concurrency tests; module boundary tests</td><td>Ch. 11, 18.3</td></tr>
    <tr><td>Delivery</td><td>Docker image, Compose, CI pipeline</td><td>18.3</td></tr>
    <tr><td>Integration</td><td>OpenAPI contract, generated client, CORS</td><td>18.4</td></tr>
  </tbody>
</table>

<h3>6. Spring Boot or Node.js?</h3>
<table>
  <thead><tr><th></th><th>Spring Boot (this course)</th><th>Node.js (Express/NestJS)</th></tr></thead>
  <tbody>
    <tr><td>Start-up / image (measured here)</td><td>~9 s in a container; image 616 MB (JRE base)</td><td>&lt; 1 s; node:22-alpine 238 MB</td></tr>
    <tr><td>CPU-heavy work</td><td>real threads, JIT — strong</td><td>one event loop; needs worker threads</td></tr>
    <tr><td>Transactions, security, data</td><td>declarative and complete out of the box</td><td>assembled from libraries, more choices</td></tr>
    <tr><td>Type sharing with a TS frontend</td><td>via OpenAPI generation (18.4)</td><td>can share TypeScript types directly</td></tr>
    <tr><td>Typical employers in Vietnam</td><td>banks, telcos, large enterprise, outsourcing for Japan/EU</td><td>start-ups, product companies, realtime apps</td></tr>
  </tbody>
</table>
<p>Choose by the team and the problem, not by benchmarks: both handled LabFlow's rules the same way, because the important guarantees (no double booking, idempotency, ownership) live in PostgreSQL and in the API design.</p>

<h3>🕵️ Hacker corner — British Airways, 2018</h3>
<p>Between 22 June and 5 September 2018, attackers changed a JavaScript file on British Airways' website so that payment pages sent what customers typed to a look-alike domain. The UK ICO counted personal data of about 429,000 customers and staff, including card details, and fined BA £20 million in October 2020. A script running in your page sees everything: form fields, the DOM, and <code>localStorage</code>. <strong>What you do:</strong> keep tokens out of <code>localStorage</code> (memory + HttpOnly refresh cookie), set a Content-Security-Policy that allows only your own scripts, add Subresource Integrity to third-party scripts, and never render server text as HTML (<code>dangerouslySetInnerHTML</code>).</p>

<h3>🎤 What the interviewer will ask — whole course</h3>
<ol>
  <li><strong>"What happens when a request hits a Spring Boot app?"</strong> — Tomcat thread → filter chain (security) → DispatcherServlet → handler mapping → argument resolution/validation → controller → service proxy (transaction) → repository → JSON conversion → exception handler if needed.</li>
  <li><strong>"Why is <code>@Transactional</code> on a private method or a self-call ignored?"</strong> — It works through a proxy; calls that do not go through the proxy are not intercepted.</li>
  <li><strong>"What is N+1 and how do you fix it?"</strong> — One query for the list plus one per row for a lazy relation; fix with fetch join/entity graph/batch fetching, or a DTO query — and, across modules, a batch call like <code>theoIds</code>.</li>
  <li><strong>"Optimistic vs pessimistic locking?"</strong> — Version column and retry on conflict (low contention, user edits) vs <code>SELECT … FOR UPDATE</code>/advisory lock (high contention, short critical sections).</li>
  <li><strong>"How do you stop double booking?"</strong> — A database constraint (exclusion/unique) plus idempotency keys; prove it with a concurrent test on the real database.</li>
  <li><strong>"Session vs JWT?"</strong> — Sessions are easy to revoke and need shared storage; JWTs are self-contained and hard to revoke — keep them short and pair with refresh tokens.</li>
  <li><strong>"How do you test a Spring Boot service?"</strong> — Pure unit tests for rules, Mockito for orchestration, slices for web/JPA, Testcontainers for queries/migrations/concurrency, a few end-to-end flows.</li>
  <li><strong>"Monolith or microservices?"</strong> — Modular monolith first with enforced boundaries and events; split when a module needs independent scaling or deployment.</li>
  <li><strong>"How does your API stay compatible with the frontend?"</strong> — Generated OpenAPI contract, generated client types, contract diff in CI, additive changes or versioned endpoints.</li>
  <li><strong>"Spring Boot or Node.js for this project?"</strong> — Explain with the table above: team skills, CPU vs I/O, ecosystem needs; the correctness guarantees should not depend on the framework.</li>
</ol>

<h3>🧪 Practice (90 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add the error responses to the contract (409 and 422 as <code>ProblemDetail</code> on <code>POST /api/v1/bookings</code>), regenerate the types and remove the <code>as unknown as</code> casts.</li>
  <li>Add a "My bookings" table with a Cancel button. Show the right sentence for <code>TOO_LATE_TO_CANCEL</code>, and refresh the list after a successful cancel.</li>
  <li>Add a CI step that runs <code>npm run gen:api</code> against the backend's generated document and fails if <code>src/api-types.ts</code> changed.</li>
</ol>
<p><strong>Done when:</strong> <code>npm run build</code> passes without casts on errors, cancel works for your own booking and shows the message for a late one, and a renamed Java field turns the CI step red.</p></div>
${giai('Show hints', `<p>1. On the controller method: <code>@ApiResponse(responseCode = "409", description = "slot taken", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))</code>, same for 422; or an <code>OpenApiCustomizer</code> bean that adds them to every operation.</p><p>2. <code>api.POST("/api/v1/bookings/{id}/cancel", { params: { path: { id } } })</code>; on error, <code>loiChoNguoiDung</code> gets a new case <code>TOO_LATE_TO_CANCEL</code>.</p><p>3. In the backend job: start the app (or a <code>@SpringBootTest</code> that writes <code>/v3/api-docs</code> to a file), then in the web folder <code>npm run gen:api &amp;&amp; git diff --exit-code src/api-types.ts</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>OpenAPI</strong> — a machine-readable description of an HTTP API (paths, parameters, schemas, security).</li>
  <li><strong>springdoc</strong> — library that generates OpenAPI from Spring MVC code at runtime.</li>
  <li><strong>openapi-typescript / openapi-fetch</strong> — generate TypeScript types from OpenAPI / a typed fetch client that uses them.</li>
  <li><strong>CORS preflight</strong> — the browser's OPTIONS request asking whether a cross-origin request is allowed.</li>
  <li><strong>Magecart</strong> — attacks that inject card-skimming JavaScript into web pages.</li>
  <li><strong>Contract drift</strong> — backend and frontend disagree on the API shape without anyone noticing.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>springdoc serves the contract from the running code (12 paths, schemas with validation, Bearer scheme).</li>
  <li>openapi-typescript turns it into types; a renamed field becomes a frontend compile error.</li>
  <li>One client module: token in memory, 401 ⇒ login, 403 ⇒ stay, messages by code, one Idempotency-Key per intent.</li>
  <li>Vite build passed; CORS allowed 5173 and refused evil.example (403); the same client against the live API: replay, 409, 422, 403, forged token ⇒ 401.</li>
  <li>Correctness lives in the database and the API design — the same in Spring Boot and Node.js.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://springdoc.org/', '📘', 'springdoc-openapi', 'Annotations, customizers, Swagger UI.')}
${tl('https://openapi-ts.dev/', '🔷', 'openapi-typescript and openapi-fetch', 'Generated types and a typed fetch client.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — CORS', 'Preflight, credentials, headers.')}
${tl('https://ico.org.uk/action-weve-taken/enforcement/british-airways/', '🕵️', 'ICO — British Airways penalty notice', 'The 2018 skimming attack in detail.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>t/184.cmds</code> against <code>lab/c18/labflow</code>; <code>lab/c18/web</code> built and run in <code>node:22-alpine</code> (Vite 7.3.8, React 19.3.1, TypeScript 5.9.3, openapi-typescript 7.13.0, openapi-fetch 0.13.8, tsx 4.23.15), 24/11/2026.</li>
  <li>British Airways: ICO penalty notice, 16/10/2020.</li>
</ul>
</div>
`;

const L184_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.4 · Dự án cuối khoá</span>
<h2>Gắn frontend, checklist cuối khoá và so sánh với Node.js</h2>
<p class="lead">Một API chỉ coi là xong khi một frontend thật dùng được nó mà không phải đoán. Bài này nối một trang React (Vite + TypeScript) vào LabFlow qua hợp đồng OpenAPI mà backend tự sinh, chạy chính mã client đó với API đang chạy, rồi khép lại khoá học: một checklist những gì bạn giờ đã làm được, một phép so sánh thẳng thắn với Node.js, và các câu hỏi phỏng vấn trải khắp khoá.</p>

<h3>Đời thường trước đã</h3>
<p>Thực đơn nhà hàng là hợp đồng giữa bếp và người phục vụ: tên món, giá, món nào đi kèm gì. Bếp đổi món mà không ai in lại thực đơn thì người phục vụ sẽ hứa thứ bếp không còn làm. In thực đơn từ chính sổ công thức của bếp — mỗi tối — xoá sạch cả loại lỗi đó. Đó chính là việc sinh kiểu dữ liệu cho frontend từ OpenAPI của backend.</p>

<h3>1. Hợp đồng, sinh từ chính mã đang chạy</h3>
<p>springdoc đọc controller, record và annotation validation rồi phục vụ một tài liệu OpenAPI 3.1. Một cấu hình nhỏ thêm tên và báo cho client biết request mang JWT kiểu Bearer:</p>
${MA184_APIDOCS}
${OUT184_DOCS}
${OUT184_SAU}
<p>Để ý những thứ có sẵn không tốn công: <code>required</code> lấy từ <code>@NotBlank</code>/<code>@NotNull</code>, <code>maxLength: 200</code> từ <code>@Size</code>, header <code>Idempotency-Key</code> bắt buộc cùng giới hạn độ dài. Swagger UI ở <code>/swagger-ui.html</code>. Ở production, hoặc bảo vệ các endpoint này, hoặc tắt hẳn (<code>springdoc.api-docs.enabled=false</code>) — chính springdoc cũng cảnh báo lúc khởi động.</p>

<h3>2. Kiểu TypeScript từ hợp đồng</h3>
${MA184_PKG}
<p><code>npm run gen:api</code> (openapi-typescript 7.13.0) biến tài liệu 8,7 kB thành <code>src/api-types.ts</code>:</p>
${MA184_TYPES}
<p>Giờ một trường bị đổi tên trong record Java sẽ thành lỗi <code>tsc</code> đỏ lúc build frontend, chứ không thành một ô trống trên production. Biến nó thành một bước CI: sinh lại, rồi báo hỏng nếu <code>git diff</code> không rỗng.</p>

<h3>3. Một chỗ duy nhất gọi API</h3>
${MA184_API}
<ul>
  <li><strong>401 khác 403 trên giao diện</strong>: 401 (thiếu token, hết hạn hay bị giả) ⇒ quên token, hiện màn đăng nhập. 403 ⇒ vẫn giữ đăng nhập, báo "không được phép". Lẫn hai thứ này thì người dùng bị đăng xuất chỉ vì bấm nhầm nút của quản lý.</li>
  <li><strong>Thông báo chọn theo <code>code</code></strong>, không bao giờ phân tích câu chữ của server: server có thể viết lại câu tiếng Việt; <code>code</code> mới là hợp đồng.</li>
  <li><strong>Idempotency-Key thuộc về ý định của người dùng</strong>: mỗi lần bấm "Đặt" một khoá, dùng lại nếu chính request đó được thử lại, khoá mới cho lượt đặt tiếp theo.</li>
</ul>
${MA184_APP}
<p>Hai lớp chặn bấm đúp: nút bị khoá trong lúc request đang bay (giao diện), và cùng khoá thì server trả lại đúng lượt cũ nếu request thứ hai vẫn lọt qua (server). Token giữ trong bộ nhớ, không để trong <code>localStorage</code>: mọi script chạy trong trang — kể cả script bị cài lén — đều đọc được <code>localStorage</code> (xem góc hacker). Cái giá là phải đăng nhập lại khi tải lại trang; refresh token trong cookie HttpOnly ở chương 9 gỡ được điều đó.</p>

<h3>4. Bằng chứng: build, CORS và cùng client với API thật</h3>
${OUT184_BUILD}
<p>Trình duyệt ở <code>http://localhost:5173</code> gọi API ở cổng 8080 — khác origin, nên trình duyệt gửi preflight CORS trước. Chỉ origin, phương thức và header đã liệt kê mới qua:</p>
${MA184_CORS}
${OUT184_CORS}
<p>Cuối cùng <code>smoke.ts</code> import <em>chính</em> <code>src/api.ts</code> mà trang web dùng rồi chạy các đường chính với API đang chạy (Node 22 có sẵn <code>fetch</code> và <code>crypto.randomUUID</code>):</p>
${OUT184_SMOKE}
<p>Mọi nhánh của client đều được chạy thật: lặp lại trả <code>lapLai=true</code> cùng id, 409 và 422 thành câu cho người dùng, 403 vẫn giữ token, còn token bị giả (đổi hai ký tự) nhận 401 và bị xoá.</p>
<div class="callout warn"><p><strong>Lỗ hổng đã đo:</strong> kiểu sinh ra của <code>error</code> là <code>undefined</code> ở mọi thao tác — <code>tsc</code> từ chối <code>error as {detail?: string}</code>. Hợp đồng không mô tả response lỗi nên client không gán kiểu được. Thêm <code>@ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))</code> vào các thao tác (hoặc một customizer chung) rồi sinh lại.</p></div>

<h3>5. Checklist: những gì bạn giờ đã làm được</h3>
<table>
  <thead><tr><th>Mảng</th><th>Bạn có thể…</th><th>Ở đâu</th></tr></thead>
  <tbody>
    <tr><td>Java</td><td>mô hình hoá dữ liệu bằng record/sealed, chọn collection, suy luận về luồng, virtual thread, GC</td><td>Ch. 1–2</td></tr>
    <tr><td>Lõi Spring</td><td>giải thích bean, DI, vòng đời, proxy, auto-configuration</td><td>Ch. 3</td></tr>
    <tr><td>REST</td><td>thiết kế tài nguyên, mã trạng thái, validation, một khuôn lỗi</td><td>Ch. 4–5, 18.2</td></tr>
    <tr><td>Dữ liệu</td><td>JPA không N+1, giao dịch, isolation, khoá lạc quan, Flyway theo module</td><td>Ch. 6–8, 18.1</td></tr>
    <tr><td>Bảo mật</td><td>JWT, vai trò, kiểm quyền sở hữu, và tự tấn công API của mình</td><td>Ch. 9–10, 18.2</td></tr>
    <tr><td>Chứng minh</td><td>test đơn vị, lát cắt, Testcontainers và đồng thời; test ranh giới module</td><td>Ch. 11, 18.3</td></tr>
    <tr><td>Đóng gói</td><td>image Docker, Compose, pipeline CI</td><td>18.3</td></tr>
    <tr><td>Tích hợp</td><td>hợp đồng OpenAPI, client sinh tự động, CORS</td><td>18.4</td></tr>
  </tbody>
</table>

<h3>6. Spring Boot hay Node.js?</h3>
<table>
  <thead><tr><th></th><th>Spring Boot (khoá này)</th><th>Node.js (Express/NestJS)</th></tr></thead>
  <tbody>
    <tr><td>Khởi động / image (đo ở đây)</td><td>~9 giây trong container; image 616 MB (nền JRE)</td><td>&lt; 1 giây; node:22-alpine 238 MB</td></tr>
    <tr><td>Việc nặng CPU</td><td>luồng thật, JIT — mạnh</td><td>một event loop; cần worker thread</td></tr>
    <tr><td>Giao dịch, bảo mật, dữ liệu</td><td>khai báo, đầy đủ sẵn</td><td>ghép từ nhiều thư viện, nhiều lựa chọn hơn</td></tr>
    <tr><td>Dùng chung kiểu với frontend TS</td><td>qua sinh từ OpenAPI (18.4)</td><td>dùng chung kiểu TypeScript trực tiếp được</td></tr>
    <tr><td>Nơi tuyển thường gặp ở Việt Nam</td><td>ngân hàng, viễn thông, doanh nghiệp lớn, outsource Nhật/châu Âu</td><td>startup, công ty sản phẩm, ứng dụng thời gian thực</td></tr>
  </tbody>
</table>
<p>Chọn theo đội và theo bài toán, đừng chọn theo benchmark: cả hai xử lý luật của LabFlow như nhau, vì những bảo đảm quan trọng (không đặt trùng, idempotency, quyền sở hữu) nằm trong PostgreSQL và trong thiết kế API.</p>

<h3>🕵️ Góc hacker — British Airways, 2018</h3>
<p>Từ 22/06 tới 05/09/2018, kẻ tấn công sửa một tệp JavaScript trên website British Airways để trang thanh toán gửi những gì khách gõ tới một tên miền giả. Cơ quan bảo vệ dữ liệu Anh (ICO) đếm được dữ liệu cá nhân của khoảng 429 000 khách hàng và nhân viên, có cả thông tin thẻ, và phạt BA 20 triệu bảng vào tháng 10/2020. Script chạy trong trang của bạn thấy mọi thứ: các ô form, DOM, và <code>localStorage</code>. <strong>Cách phòng:</strong> không để token trong <code>localStorage</code> (bộ nhớ + cookie refresh HttpOnly), đặt Content-Security-Policy chỉ cho script của chính bạn, gắn Subresource Integrity cho script bên thứ ba, và không bao giờ hiển thị chữ từ server dưới dạng HTML (<code>dangerouslySetInnerHTML</code>).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi — cả khoá</h3>
<ol>
  <li><strong>"Một request đi vào ứng dụng Spring Boot thì chuyện gì xảy ra?"</strong> — Luồng Tomcat → chuỗi filter (bảo mật) → DispatcherServlet → handler mapping → giải tham số/validation → controller → proxy của service (giao dịch) → repository → chuyển JSON → bộ xử lý lỗi nếu cần.</li>
  <li><strong>"Vì sao <code>@Transactional</code> trên phương thức private hay khi tự gọi chính mình bị bỏ qua?"</strong> — Nó hoạt động qua proxy; lời gọi không đi qua proxy thì không bị chặn.</li>
  <li><strong>"N+1 là gì, sửa thế nào?"</strong> — Một truy vấn cho danh sách cộng một truy vấn mỗi dòng cho quan hệ lazy; sửa bằng fetch join/entity graph/batch fetching hoặc truy vấn DTO — và khi chéo module thì gọi theo lô như <code>theoIds</code>.</li>
  <li><strong>"Khoá lạc quan khác khoá bi quan?"</strong> — Cột version và thử lại khi xung đột (ít tranh chấp, người dùng sửa) so với <code>SELECT … FOR UPDATE</code>/khoá tư vấn (tranh chấp cao, đoạn găng ngắn).</li>
  <li><strong>"Chống đặt trùng ra sao?"</strong> — Ràng buộc trong CSDL (exclusion/unique) cộng khoá idempotency; chứng minh bằng test đồng thời trên CSDL thật.</li>
  <li><strong>"Session hay JWT?"</strong> — Session dễ thu hồi, cần kho lưu chung; JWT tự chứa, khó thu hồi — để hạn ngắn và đi kèm refresh token.</li>
  <li><strong>"Test một service Spring Boot thế nào?"</strong> — Unit test thuần cho luật, Mockito cho phần điều phối, lát cắt cho web/JPA, Testcontainers cho truy vấn/migration/đồng thời, vài luồng đầu–cuối.</li>
  <li><strong>"Monolith hay microservices?"</strong> — Modular monolith trước, ranh giới được ép bằng test và sự kiện; tách khi một module cần mở rộng hay triển khai độc lập.</li>
  <li><strong>"API của bạn giữ tương thích với frontend thế nào?"</strong> — Hợp đồng OpenAPI sinh tự động, kiểu client sinh tự động, so hợp đồng trong CI, chỉ thay đổi kiểu bổ sung hoặc đánh version endpoint.</li>
  <li><strong>"Dự án này nên dùng Spring Boot hay Node.js?"</strong> — Giải thích bằng bảng ở trên: kỹ năng của đội, CPU hay I/O, hệ sinh thái cần gì; còn các bảo đảm đúng đắn không được phụ thuộc vào framework.</li>
</ol>

<h3>🧪 Thực hành (90 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm response lỗi vào hợp đồng (409 và 422 dạng <code>ProblemDetail</code> cho <code>POST /api/v1/bookings</code>), sinh lại kiểu và bỏ các ép kiểu <code>as unknown as</code>.</li>
  <li>Thêm bảng "Lượt của tôi" có nút Huỷ. Hiện đúng câu cho <code>TOO_LATE_TO_CANCEL</code>, và tải lại danh sách sau khi huỷ thành công.</li>
  <li>Thêm một bước CI chạy <code>npm run gen:api</code> trên tài liệu do backend sinh ra, và báo hỏng nếu <code>src/api-types.ts</code> bị đổi.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npm run build</code> qua mà không còn ép kiểu ở phần lỗi, huỷ được lượt của mình và hiện câu báo khi huỷ muộn, và đổi tên một trường Java làm bước CI đỏ.</p></div>
${giai('Xem gợi ý', `<p>1. Trên phương thức controller: <code>@ApiResponse(responseCode = "409", description = "slot taken", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))</code>, tương tự cho 422; hoặc một bean <code>OpenApiCustomizer</code> thêm chúng vào mọi thao tác.</p><p>2. <code>api.POST("/api/v1/bookings/{id}/cancel", { params: { path: { id } } })</code>; khi lỗi, <code>loiChoNguoiDung</code> có thêm nhánh <code>TOO_LATE_TO_CANCEL</code>.</p><p>3. Trong job backend: khởi động ứng dụng (hoặc một <code>@SpringBootTest</code> ghi <code>/v3/api-docs</code> ra tệp), rồi trong thư mục web chạy <code>npm run gen:api &amp;&amp; git diff --exit-code src/api-types.ts</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>OpenAPI</strong> — bản mô tả API HTTP mà máy đọc được (đường dẫn, tham số, schema, bảo mật).</li>
  <li><strong>springdoc</strong> — thư viện sinh OpenAPI từ mã Spring MVC lúc chạy.</li>
  <li><strong>openapi-typescript / openapi-fetch</strong> — sinh kiểu TypeScript từ OpenAPI / client fetch có kiểu dùng chính các kiểu đó.</li>
  <li><strong>CORS preflight</strong> — request OPTIONS trình duyệt gửi trước để hỏi request khác origin có được phép không.</li>
  <li><strong>Magecart</strong> — kiểu tấn công cài JavaScript đánh cắp thẻ vào trang web.</li>
  <li><strong>Lệch hợp đồng (contract drift)</strong> — backend và frontend hiểu khác nhau về hình dạng API mà không ai hay.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>springdoc phục vụ hợp đồng từ chính mã đang chạy (12 đường dẫn, schema mang luật validation, kiểu bảo mật Bearer).</li>
  <li>openapi-typescript biến nó thành kiểu; đổi tên trường thành lỗi biên dịch ở frontend.</li>
  <li>Một module client: token trong bộ nhớ, 401 ⇒ đăng nhập lại, 403 ⇒ giữ nguyên, thông báo theo code, mỗi ý định một Idempotency-Key.</li>
  <li>Vite build qua; CORS cho 5173 và chặn evil.example (403); cùng client với API thật: lặp lại, 409, 422, 403, token giả ⇒ 401.</li>
  <li>Sự đúng đắn nằm ở CSDL và thiết kế API — như nhau với Spring Boot và Node.js.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://springdoc.org/', '📘', 'springdoc-openapi', 'Annotation, customizer, Swagger UI.')}
${tl('https://openapi-ts.dev/', '🔷', 'openapi-typescript và openapi-fetch', 'Kiểu sinh tự động và client fetch có kiểu.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — CORS', 'Preflight, credentials, header.')}
${tl('https://ico.org.uk/action-weve-taken/enforcement/british-airways/', '🕵️', 'ICO — quyết định phạt British Airways', 'Chi tiết vụ đánh cắp thẻ năm 2018.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>t/184.cmds</code> trên <code>lab/c18/labflow</code>; <code>lab/c18/web</code> build và chạy trong <code>node:22-alpine</code> (Vite 7.3.8, React 19.3.1, TypeScript 5.9.3, openapi-typescript 7.13.0, openapi-fetch 0.13.8, tsx 4.23.15), 24/11/2026.</li>
  <li>British Airways: thông báo phạt của ICO, 16/10/2020.</li>
</ul>
</div>
`;

// ===== Bài 18.5 =====
const OUT185_STARTER = out("$ bash cham.sh <thư mục dự án>      # bản khởi đầu: dự án sau bài 18.4\nMục 1: TRƯỢT — mvn verify: 16 test, 0 hỏng, 0 lỗi; test gọi /api/v1/loans: 0 tệp\nMục 2: TRƯỢT — ứng dụng lên; bảng equipment + loans: 0/2; lịch sử Flyway 4 dòng\nMục 3: TRƯỢT — quản lý 404 · sinh viên 404 · phòng không có 404 (cần 201 · 403 · 404)\nMục 4: TRƯỢT — HTTP 404 · dueAt - · đang mượn: -\nMục 5: TRƯỢT — nhận: 404 NOT_FOUND (cần 422 EQUIPMENT_UNAVAILABLE)\nMục 6: TRƯỢT — mã trả về: 20 404 · phiếu đang mở của OSC-02 trong CSDL: ?\nMục 7: TRƯỢT — thiết bị thứ 2: 404 · thứ 3: 404 NOT_FOUND (cần 201 · 422 LOAN_LIMIT)\nMục 8: TRƯỢT — người khác 404 · chủ 404 · lần hai 404 · OSC-01 ? (cần 404 · 200 · 409 · AVAILABLE)\nMục 9: TRƯỢT — quá hạn: - · sinh viên gọi: 404 (cần KIT-01,OSC-02 · 403)\nMục 10: TRƯỢT — thông báo LOAN_CREATED của an: 0 (cần 2: OSC-01, KIT-01)\nĐiểm: 0/10");
const OUT185_GIAI = out("$ bash cham.sh <thư mục dự án>      # lời giải\nMục 1: ĐẠT   — mvn verify: 17 test, 0 hỏng, 0 lỗi; test gọi /api/v1/loans: 1 tệp\nMục 2: ĐẠT   — ứng dụng lên; bảng equipment + loans: 2/2; lịch sử Flyway 6 dòng\nMục 3: ĐẠT   — quản lý 201 · sinh viên 403 · phòng không có 404 (cần 201 · 403 · 404)\nMục 4: ĐẠT   — HTTP 201 · dueAt 2026-12-04T08:00:00 · đang mượn: OSC-01\nMục 5: ĐẠT   — nhận: 422 EQUIPMENT_UNAVAILABLE (cần 422 EQUIPMENT_UNAVAILABLE)\nMục 6: ĐẠT   — mã trả về: 1 201, 3 409, 16 422 · phiếu đang mở của OSC-02 trong CSDL: 1\nMục 7: ĐẠT   — thiết bị thứ 2: 201 · thứ 3: 422 LOAN_LIMIT (cần 201 · 422 LOAN_LIMIT)\nMục 8: ĐẠT   — người khác 404 · chủ 200 · lần hai 409 · OSC-01 AVAILABLE (cần 404 · 200 · 409 · AVAILABLE)\nMục 9: ĐẠT   — quá hạn: KIT-01,OSC-02 · sinh viên gọi: 403 (cần KIT-01,OSC-02 · 403)\nMục 10: ĐẠT   — thông báo LOAN_CREATED của an: 2 (cần 2: OSC-01, KIT-01)\nĐiểm: 10/10");
const OUT185_BAY = out("$ bash cham.sh <thư mục dự án>      # lời giải nhưng KHÔNG có unique index (kiểm rồi mới ghi)\nMục 1: TRƯỢT — mvn verify: 17 test, 1 hỏng, 0 lỗi; test gọi /api/v1/loans: 1 tệp\nMục 2: ĐẠT   — ứng dụng lên; bảng equipment + loans: 2/2; lịch sử Flyway 6 dòng\nMục 3: ĐẠT   — quản lý 201 · sinh viên 403 · phòng không có 404 (cần 201 · 403 · 404)\nMục 4: ĐẠT   — HTTP 201 · dueAt 2026-12-04T08:00:00 · đang mượn: OSC-01\nMục 5: ĐẠT   — nhận: 422 EQUIPMENT_UNAVAILABLE (cần 422 EQUIPMENT_UNAVAILABLE)\nMục 6: TRƯỢT — mã trả về: 6 201, 14 422 · phiếu đang mở của OSC-02 trong CSDL: 6\nMục 7: ĐẠT   — thiết bị thứ 2: 201 · thứ 3: 422 LOAN_LIMIT (cần 201 · 422 LOAN_LIMIT)\nMục 8: ĐẠT   — người khác 404 · chủ 200 · lần hai 409 · OSC-01 AVAILABLE (cần 404 · 200 · 409 · AVAILABLE)\nMục 9: TRƯỢT — quá hạn: KIT-01,OSC-02,OSC-02,OSC-02,OSC-02,OSC-02,OSC-02 · sinh viên gọi: 403 (cần KIT-01,OSC-02 · 403)\nMục 10: ĐẠT   — thông báo LOAN_CREATED của an: 2 (cần 2: OSC-01, KIT-01)\nĐiểm: 7/10");
const MA185_CHAM = bash("# ---- Mục 6: 20 người cùng mượn OSC-02 cùng lúc ⇒ đúng 1 phiếu\ntb \"$QL\" OSC-02 'Máy hiện sóng 2' IOT-01 >/dev/null\nfor i in $(seq -w 1 20); do login dua$i.thi@fpt.edu.vn \"$MK\"; done > \"$W/tk.txt\"\nxargs -P 20 -I{} curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer {}\" -H \"$J\" -d '{\"equipmentCode\":\"OSC-02\"}' $API/api/v1/loans < \"$W/tk.txt\" | sort | uniq -c | tr -s ' ' > \"$W/dua.txt\"\nn201=$(awk '$2==201{print $1}' \"$W/dua.txt\"); mo=$(psql \"select count(*) from loans l join equipment e on e.id=l.equipment_id where e.code='OSC-02' and l.returned_at is null\")\n[ \"${n201:-0}\" = 1 ] && [ \"$mo\" = 1 ] && ok=1 || ok=0; muc 6 $ok \"mã trả về: $(paste -sd, \"$W/dua.txt\" | sed 's/^ //; s/, /, /g') · phiếu đang mở của OSC-02 trong CSDL: ${mo:-?}\"");
const MA185_MIG = sql("-- module loan: thiết bị + phiếu mượn. BR-11: chỉ AVAILABLE mới mượn được. BR-12: hạn trả mặc định 3 ngày.\ncreate table equipment (\n  id       bigint generated by default as identity primary key,\n  code     varchar(20)  not null unique,\n  name     varchar(100) not null,\n  lab_id   bigint       not null,                       -- id của catalog, không khoá ngoại chéo module\n  status   varchar(20)  not null default 'AVAILABLE' check (status in ('AVAILABLE', 'ON_LOAN', 'MAINTENANCE', 'RETIRED'))\n);\ncreate table loans (\n  id            bigint generated by default as identity primary key,\n  equipment_id  bigint      not null references equipment,\n  borrower_id   bigint      not null,\n  borrowed_at   timestamp   not null,\n  due_at        timestamp   not null,\n  returned_at   timestamp,\n  version       int         not null default 0\n);\n-- MỘT phiếu đang mở cho mỗi thiết bị — CSDL chặn, kể cả khi 20 request đến cùng lúc\ncreate unique index loans_mot_phieu_mo on loans (equipment_id) where returned_at is null;\ncreate index loans_borrower_mo on loans (borrower_id) where returned_at is null;");
const MA185_MIG2 = sql("-- module notification tự đổi schema của mình (thư mục của mình) để nhận thông báo cho phiếu mượn\nalter table notifications alter column booking_id drop not null;\nalter table notifications add column loan_id bigint;\nalter table notifications add constraint notifications_loan_mot_lan unique (loan_id, kind);\nalter table notifications add constraint notifications_co_nguon check (booking_id is not null or loan_id is not null);");
const MA185_MUON = java("@Transactional\nPhieu muon(NguoiDung u, String code, Integer days) {\n    int d = days == null ? NGAY_MAC_DINH : days;\n    if (d < 1 || d > NGAY_TOI_DA) throw LoiNghiepVu.quyTac(\"BAD_DAYS\", \"mượn 1–\" + NGAY_TOI_DA + \" ngày\");\n    db.sql(\"select pg_advisory_xact_lock(?)\").param(u.id()).query().listOfRows();      // hạn mức theo người: xếp hàng request của cùng người\n    Equipment e = eq.findByCode(code).orElseThrow(() -> LoiNghiepVu.khongThay(\"thiết bị \" + code));\n    if (!e.getStatus().equals(\"AVAILABLE\"))\n        throw LoiNghiepVu.quyTac(\"EQUIPMENT_UNAVAILABLE\", \"thiết bị \" + code + \" đang \" + e.getStatus());\n    if (loans.countByBorrowerIdAndReturnedAtIsNull(u.id()) >= TOI_DA_DANG_MUON)\n        throw LoiNghiepVu.quyTac(\"LOAN_LIMIT\", \"mỗi người mượn tối đa \" + TOI_DA_DANG_MUON + \" thiết bị cùng lúc\");\n    Loan l = loans.saveAndFlush(new Loan(e.getId(), u.id(), LocalDateTime.now(clock), d));   // 20 người cùng lúc ⇒ unique index chặn 19\n    e.setStatus(\"ON_LOAN\");\n    events.publishEvent(new LoanCreated(l.getId(), u.id(), e.getCode(), l.getDueAt()));\n    return phieu(l, e);\n}");
const MA185_NGHE = java("@ApplicationModuleListener\nvoid khiMuon(LoanCreated e) {\n    int n = db.sql(\"insert into notifications (account_id, loan_id, kind, message) values (?, ?, 'LOAN_CREATED', ?) on conflict do nothing\")\n        .params(e.borrowerId(), e.loanId(), \"Đã mượn \" + e.equipmentCode() + \", hạn trả \" + e.dueAt()).update();\n    if (n == 1) log.info(\"[email giả] tới tài khoản {}: đã mượn {}, hạn trả {}\", e.borrowerId(), e.equipmentCode(), e.dueAt());\n}");
const MA185_DONG = java("record Dong(Long bookingId, Long loanId, String kind, String message, OffsetDateTime createdAt) { }");

const L185_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.5 · Timed practical exam</span>
<h2>Timed practical exam: the equipment-loan module (3 hours)</h2>
<p class="lead">A practical exam in the style of a university PE: a running project, a written specification, three hours, and a grader that calls your API on a clean database. You add a new module to LabFlow — equipment loans (rules BR-11 and BR-12 of the LabFlow AI project) — without breaking the module borders, with its own migration folder, an event for notifications, and a database rule that survives twenty simultaneous requests. The grader below ran for real on three versions: the untouched starter, the solution, and a solution with one realistic mistake.</p>

<h3>Rules of the exam</h3>
<ul>
  <li>Time: <strong>3 hours</strong>. Allowed: the official documentation (Spring, PostgreSQL, Flyway) and this course. Not allowed: copying a finished solution.</li>
  <li>Start from your LabFlow project at the end of lesson 18.4 (or the reference project of this chapter). Keep all existing tests green.</li>
  <li>Hand in the project folder. The grader copies it — your working tree is never modified — runs <code>mvn verify</code> (Docker needed for Testcontainers), then starts the application on an <strong>empty</strong> PostgreSQL without the dev profile and calls the API.</li>
</ul>

<h3>The specification</h3>
<p>Lab staff lend equipment (oscilloscopes, IoT kits) to students. Today it is a paper notebook; nobody knows who has the oscilloscope that went missing in October.</p>
<ol>
  <li><strong>New module <code>loan</code></strong> (<code>vn.labflow.loan</code>), public API in its top package, everything else in <code>loan.internal</code>. <code>KienTrucTest</code> must stay green.</li>
  <li><strong>Migrations</strong> in <code>db/migration/loan</code>: tables <code>equipment</code> (code unique, name, lab, status AVAILABLE/ON_LOAN/MAINTENANCE/RETIRED) and <code>loans</code> (equipment, borrower, borrowed at, due at, returned at). The equipment's lab is checked through <code>LabCatalog</code> — no foreign key to catalog.</li>
  <li><code>POST /api/v1/equipment</code> (MANAGER) <code>{code, name, labCode}</code> ⇒ 201; student ⇒ 403; unknown lab ⇒ 404. <code>GET /api/v1/equipment?status=</code> for logged-in users.</li>
  <li><code>POST /api/v1/loans</code> <code>{equipmentCode, days?}</code>: the logged-in user borrows. <em>BR-12</em>: due = now + <code>days</code> (default 3, 1–7). <em>BR-11</em>: only AVAILABLE ⇒ otherwise <code>422 EQUIPMENT_UNAVAILABLE</code>. At most 2 open loans per person ⇒ <code>422 LOAN_LIMIT</code>. The equipment becomes ON_LOAN.</li>
  <li><strong>At most one open loan per equipment, even under concurrency</strong> — a database rule, not an <code>if</code>.</li>
  <li><code>POST /api/v1/loans/{id}/return</code>: borrower (or MANAGER) ⇒ 200 and the equipment is AVAILABLE again; anyone else ⇒ 404; returning twice ⇒ 409.</li>
  <li><code>GET /api/v1/loans/overdue</code> (MANAGER): open loans whose due time has passed, by the application clock.</li>
  <li>Borrowing publishes an event; the <strong>notification</strong> module stores a <code>LOAN_CREATED</code> notification for the borrower, visible in <code>GET /api/v1/notifications/mine</code>.</li>
  <li>At least one test of your own that calls <code>/api/v1/loans</code>.</li>
</ol>

<h3>Rubric (10 points, the grader prints each line)</h3>
<table>
  <thead><tr><th>#</th><th>Checked by the grader</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><code>mvn verify</code> green (including <code>KienTrucTest</code>) and a test of yours calls <code>/api/v1/loans</code></td></tr>
    <tr><td>2</td><td>Starts on an empty database; Flyway creates <code>equipment</code> and <code>loans</code></td></tr>
    <tr><td>3</td><td>Add equipment: manager 201 · student 403 · unknown lab 404</td></tr>
    <tr><td>4</td><td>Borrow: 201, <code>dueAt</code> = now + 3 days, equipment listed as ON_LOAN</td></tr>
    <tr><td>5</td><td>Borrow equipment already on loan ⇒ 422 EQUIPMENT_UNAVAILABLE</td></tr>
    <tr><td>6</td><td>20 students borrow the same equipment at the same time ⇒ exactly one 201 and one open loan in the database</td></tr>
    <tr><td>7</td><td>Third item for one person ⇒ 422 LOAN_LIMIT</td></tr>
    <tr><td>8</td><td>Return: other person 404 · borrower 200 · again 409 · equipment AVAILABLE</td></tr>
    <tr><td>9</td><td>Application restarted 5 days later: manager sees exactly the overdue loans; student 403</td></tr>
    <tr><td>10</td><td>Two loans by the same person ⇒ two LOAN_CREATED notifications</td></tr>
  </tbody>
</table>
<p>How item 6 is measured — 20 tokens, 20 parallel <code>curl</code>, then a count in the database:</p>
${MA185_CHAM}

<h3>What the three versions scored</h3>
<p><strong>The starter</strong> — green build, but none of the endpoints exist, and item 1 fails because no test touches loans:</p>
${OUT185_STARTER}
<p><strong>The solution</strong>, 2 minutes 29 seconds of grading:</p>
${OUT185_GIAI}
<p>Look at item 6: one 201, and the 19 losers split into 409 (they reached the INSERT and hit the unique index) and 422 (they arrived after the winner had committed and saw ON_LOAN). Both are correct answers; the number that matters is "one open loan".</p>
<p><strong>The realistic mistake</strong> — the same solution without the partial unique index, so the only guard is "check the status, then insert":</p>
${OUT185_BAY}
<p>Six students now "have" the same oscilloscope. The status check passed for all six because none of them had committed yet. Notice what else broke: item 9 lists OSC-02 six times, and item 1 failed because the solution's own concurrency test caught it first — which is exactly why that test is required.</p>

<h3>The trap that cost the solution a point on the first run</h3>
<p>The first graded run of the solution scored 9/10: item 10 found 0 notifications. The listener worked (the log showed the fake email), but <code>GET /api/v1/notifications/mine</code> answered 500. The notification migration had made <code>booking_id</code> nullable for loan notifications — and the existing controller mapped it into a primitive <code>long</code>. When you change a column, search for every place that reads it. That run also showed that an unexpected exception bypassed the ProblemDetail format, so the reference project now has a catch-all handler (log everything on the server, answer <code>500 INTERNAL</code> with one sentence) and an explicit 403 handler so <code>@PreAuthorize</code> denials are not swallowed by it.</p>

${giai('Show the solution (after your own attempt)', `<p><strong>Migration of module loan</strong> — the partial unique index is item 6:</p>${MA185_MIG}<p><strong>Notification changes its own schema</strong> in its own folder:</p>${MA185_MIG2}<p><strong>Borrowing</strong> — the advisory lock makes the per-person limit safe; the unique index makes the per-equipment rule safe:</p>${MA185_MUON}<p><strong>Listener</strong> in notification, and the reader that had to change:</p>${MA185_NGHE}${MA185_DONG}<p>Also: add <code>classpath:db/migration/loan</code> to <code>spring.flyway.locations</code> in <strong>both</strong> <code>application.properties</code> and <code>application-dev.properties</code> (the dev profile overrides the list); <code>@PreAuthorize("hasRole('MANAGER')")</code> on add-equipment and overdue; return looks up "by id and borrower" for students so others get 404.</p>`)}

<h3>🕵️ Hacker corner — Flexcoin, 2014</h3>
<p>On 3 March 2014 Flexcoin, a small Canadian "bitcoin bank", announced it was closing: an attacker had taken 896 bitcoins. According to Flexcoin's statement, the attacker created accounts and sent thousands of simultaneous transfer requests between them; the code checked the balance and then updated it, so many transfers passed the check before any balance changed — the same "check, then write" race as the exam's trap version, with real money. <strong>What you do:</strong> put the invariant where concurrency cannot break it (unique/exclusion constraint, atomic <code>UPDATE … WHERE balance &gt;= amount</code>, or a row lock), then attack it with parallel requests before anyone else does.</p>

<h3>🎤 What the examiner will ask after the exam</h3>
<ol>
  <li><strong>"Why a partial unique index and not a check in Java?"</strong> — Two transactions cannot see each other's uncommitted rows; only the database sees all of them at commit. The index allows many returned loans per equipment but one open loan.</li>
  <li><strong>"Why both an advisory lock and a unique index?"</strong> — Different invariants: the lock serialises one person's requests (the 2-loan limit spans rows); the index protects one equipment across all people.</li>
  <li><strong>"How do you test 'overdue' without waiting three days?"</strong> — Inject a <code>Clock</code>; tests and the grader set it (here <code>LABFLOW_NOW</code>) instead of reading the system time.</li>
  <li><strong>"Why does notification own the migration that changes notifications?"</strong> — Module ownership: each module changes only its own schema, in its own folder, reviewed by its owner.</li>
</ol>

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Partial unique index</strong> — a unique index over the rows that match a condition (<code>where returned_at is null</code>).</li>
  <li><strong>Rubric</strong> — the scoring grid: each item, how it is checked, how many points.</li>
  <li><strong>Race condition</strong> — the result depends on the timing of concurrent operations.</li>
  <li><strong>Catch-all handler</strong> — an exception handler for unexpected errors: full log on the server, generic answer to the client.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>The exam adds a full module: own package, own migrations, public event, rules, ownership, a database invariant, and a test.</li>
  <li>Starter 0/10; solution 10/10 in about 2.5 minutes of grading; without the unique index 7/10 — six loans for one oscilloscope.</li>
  <li>Changing a column means checking every reader: a nullable <code>booking_id</code> broke an existing endpoint with a 500.</li>
  <li>Time is a dependency: an injected clock makes "overdue" testable.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.postgresql.org/docs/16/indexes-partial.html', '🐘', 'PostgreSQL 16 — partial indexes', 'Unique only for the rows that matter.')}
${tl('https://docs.spring.io/spring-modulith/reference/verification.html', '🧩', 'Spring Modulith — verifying module structure', 'What verify() checks.')}
${tl('https://www.postgresql.org/docs/16/transaction-iso.html', '🔒', 'PostgreSQL 16 — transaction isolation', 'Why "check, then insert" races under Read Committed.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>lab/c18/thi/cham.sh</code> on three copies built by <code>thi/lam.sh starter|giai|bay</code> (Spring Boot 4.1.2, PostgreSQL 16.16, Testcontainers 2.0.5), 24/11/2026.</li>
  <li>Flexcoin: statement on flexcoin.com, 03/03/2014, and the follow-up explaining the transfer race.</li>
</ul>
</div>
`;

const L185_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.5 · Thi thực hành có giờ</span>
<h2>Bài thi thực hành có giờ: module mượn thiết bị (3 giờ)</h2>
<p class="lead">Một bài thi thực hành kiểu PE ở trường: một dự án đang chạy, một bản đặc tả, ba giờ, và một bộ chấm gọi API của bạn trên CSDL sạch. Bạn thêm vào LabFlow một module mới — mượn thiết bị (luật BR-11 và BR-12 của dự án LabFlow AI) — mà không phá ranh giới module, có thư mục migration riêng, có sự kiện cho thông báo, và có một luật trong CSDL chịu được hai mươi request cùng lúc. Bộ chấm dưới đây đã chạy thật trên ba phiên bản: bản khởi đầu chưa đụng gì, lời giải, và một lời giải mắc một lỗi rất đời thường.</p>

<h3>Quy định</h3>
<ul>
  <li>Thời gian: <strong>3 giờ</strong>. Được dùng: tài liệu chính thức (Spring, PostgreSQL, Flyway) và khoá học này. Không được: chép một lời giải làm sẵn.</li>
  <li>Bắt đầu từ dự án LabFlow của bạn ở cuối bài 18.4 (hoặc dự án mẫu của chương này). Mọi test đang có phải giữ xanh.</li>
  <li>Nộp thư mục dự án. Bộ chấm chép nó ra chỗ khác — thư mục của bạn không bao giờ bị sửa — chạy <code>mvn verify</code> (cần Docker cho Testcontainers), rồi khởi động ứng dụng trên một PostgreSQL <strong>trống</strong>, không bật profile dev, và gọi API.</li>
</ul>

<h3>Đặc tả</h3>
<p>Nhân viên lab cho sinh viên mượn thiết bị (máy hiện sóng, bộ kit IoT). Hiện giờ là một cuốn sổ giấy; không ai biết chiếc máy hiện sóng mất hồi tháng Mười đang nằm ở tay ai.</p>
<ol>
  <li><strong>Module mới <code>loan</code></strong> (<code>vn.labflow.loan</code>), API công khai ở package gốc, còn lại trong <code>loan.internal</code>. <code>KienTrucTest</code> phải giữ xanh.</li>
  <li><strong>Migration</strong> trong <code>db/migration/loan</code>: bảng <code>equipment</code> (mã duy nhất, tên, phòng, trạng thái AVAILABLE/ON_LOAN/MAINTENANCE/RETIRED) và <code>loans</code> (thiết bị, người mượn, lúc mượn, hạn trả, lúc trả). Phòng của thiết bị được kiểm qua <code>LabCatalog</code> — không có khoá ngoại sang catalog.</li>
  <li><code>POST /api/v1/equipment</code> (MANAGER) <code>{code, name, labCode}</code> ⇒ 201; sinh viên ⇒ 403; phòng không có ⇒ 404. <code>GET /api/v1/equipment?status=</code> cho người đã đăng nhập.</li>
  <li><code>POST /api/v1/loans</code> <code>{equipmentCode, days?}</code>: người đang đăng nhập mượn. <em>BR-12</em>: hạn trả = bây giờ + <code>days</code> (mặc định 3, từ 1 tới 7). <em>BR-11</em>: chỉ thiết bị AVAILABLE ⇒ ngược lại <code>422 EQUIPMENT_UNAVAILABLE</code>. Mỗi người tối đa 2 phiếu đang mở ⇒ <code>422 LOAN_LIMIT</code>. Thiết bị chuyển thành ON_LOAN.</li>
  <li><strong>Mỗi thiết bị tối đa một phiếu đang mở, kể cả khi đồng thời</strong> — luật của CSDL, không phải một câu <code>if</code>.</li>
  <li><code>POST /api/v1/loans/{id}/return</code>: người mượn (hoặc MANAGER) ⇒ 200 và thiết bị về AVAILABLE; người khác ⇒ 404; trả lần hai ⇒ 409.</li>
  <li><code>GET /api/v1/loans/overdue</code> (MANAGER): các phiếu đang mở đã quá hạn, tính theo đồng hồ của ứng dụng.</li>
  <li>Mượn xong thì phát một sự kiện; module <strong>notification</strong> lưu một thông báo <code>LOAN_CREATED</code> cho người mượn, xem được ở <code>GET /api/v1/notifications/mine</code>.</li>
  <li>Ít nhất một test do bạn viết có gọi <code>/api/v1/loans</code>.</li>
</ol>

<h3>Rubric (10 điểm, bộ chấm in từng dòng)</h3>
<table>
  <thead><tr><th>#</th><th>Bộ chấm kiểm</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><code>mvn verify</code> xanh (gồm <code>KienTrucTest</code>) và có test của bạn gọi <code>/api/v1/loans</code></td></tr>
    <tr><td>2</td><td>Khởi động trên CSDL trống; Flyway tạo được <code>equipment</code> và <code>loans</code></td></tr>
    <tr><td>3</td><td>Thêm thiết bị: quản lý 201 · sinh viên 403 · phòng không có 404</td></tr>
    <tr><td>4</td><td>Mượn: 201, <code>dueAt</code> = bây giờ + 3 ngày, thiết bị nằm trong danh sách ON_LOAN</td></tr>
    <tr><td>5</td><td>Mượn thiết bị đang được mượn ⇒ 422 EQUIPMENT_UNAVAILABLE</td></tr>
    <tr><td>6</td><td>20 sinh viên cùng mượn một thiết bị cùng lúc ⇒ đúng một 201 và đúng một phiếu đang mở trong CSDL</td></tr>
    <tr><td>7</td><td>Món thứ ba của một người ⇒ 422 LOAN_LIMIT</td></tr>
    <tr><td>8</td><td>Trả: người khác 404 · người mượn 200 · lần hai 409 · thiết bị AVAILABLE</td></tr>
    <tr><td>9</td><td>Khởi động lại ứng dụng ở 5 ngày sau: quản lý thấy đúng các phiếu quá hạn; sinh viên 403</td></tr>
    <tr><td>10</td><td>Một người mượn hai lần ⇒ hai thông báo LOAN_CREATED</td></tr>
  </tbody>
</table>
<p>Mục 6 được đo thế nào — 20 token, 20 lệnh <code>curl</code> song song, rồi đếm trong CSDL:</p>
${MA185_CHAM}

<h3>Ba phiên bản được bao nhiêu điểm</h3>
<p><strong>Bản khởi đầu</strong> — build xanh, nhưng chưa có endpoint nào, và mục 1 trượt vì không test nào chạm tới phiếu mượn:</p>
${OUT185_STARTER}
<p><strong>Lời giải</strong>, chấm mất 2 phút 29 giây:</p>
${OUT185_GIAI}
<p>Nhìn mục 6: một 201, và 19 người thua chia thành 409 (đã tới lệnh INSERT và đụng unique index) và 422 (tới sau khi người thắng đã commit nên thấy ON_LOAN). Cả hai đều là câu trả lời đúng; con số quan trọng là "một phiếu đang mở".</p>
<p><strong>Lỗi rất đời thường</strong> — vẫn lời giải đó nhưng thiếu unique index một phần, nên chốt chặn duy nhất là "kiểm trạng thái rồi mới ghi":</p>
${OUT185_BAY}
<p>Giờ sáu sinh viên cùng "đang giữ" một chiếc máy hiện sóng. Phép kiểm trạng thái đều qua với cả sáu vì chưa ai kịp commit. Để ý những gì khác cũng hỏng theo: mục 9 liệt kê OSC-02 sáu lần, và mục 1 trượt vì chính test đồng thời của lời giải đã bắt được lỗi trước — đó đúng là lý do test ấy là bắt buộc.</p>

<h3>Cái bẫy làm lời giải mất một điểm ở lần chấm đầu</h3>
<p>Lần chấm đầu tiên, lời giải được 9/10: mục 10 thấy 0 thông báo. Listener vẫn chạy (log có dòng email giả), nhưng <code>GET /api/v1/notifications/mine</code> trả 500. Migration của notification đã cho <code>booking_id</code> được NULL để chứa thông báo phiếu mượn — còn controller sẵn có lại ánh xạ cột đó vào kiểu nguyên thuỷ <code>long</code>. Đổi một cột thì phải tìm mọi chỗ đọc nó. Lần chạy đó cũng cho thấy một exception không lường trước đã lọt khỏi khuôn ProblemDetail, nên dự án mẫu giờ có thêm bộ bắt lỗi chung (ghi log đầy đủ ở server, trả <code>500 INTERNAL</code> một câu) và một bộ xử lý 403 riêng để lời từ chối của <code>@PreAuthorize</code> không bị nó nuốt.</p>

${giai('Xem lời giải (sau khi đã tự làm)', `<p><strong>Migration của module loan</strong> — unique index một phần chính là mục 6:</p>${MA185_MIG}<p><strong>Notification tự đổi schema của mình</strong> trong thư mục của mình:</p>${MA185_MIG2}<p><strong>Mượn</strong> — khoá tư vấn giữ an toàn cho hạn mức theo người; unique index giữ an toàn cho luật theo thiết bị:</p>${MA185_MUON}<p><strong>Listener</strong> ở notification, và chỗ đọc buộc phải sửa:</p>${MA185_NGHE}${MA185_DONG}<p>Thêm nữa: thêm <code>classpath:db/migration/loan</code> vào <code>spring.flyway.locations</code> ở <strong>cả</strong> <code>application.properties</code> lẫn <code>application-dev.properties</code> (profile dev ghi đè danh sách); <code>@PreAuthorize("hasRole('MANAGER')")</code> cho thêm thiết bị và xem quá hạn; trả phiếu thì với sinh viên tìm "theo id và người mượn" để người khác nhận 404.</p>`)}

<h3>🕵️ Góc hacker — Flexcoin, 2014</h3>
<p>Ngày 03/03/2014, Flexcoin — một "ngân hàng bitcoin" nhỏ ở Canada — thông báo đóng cửa: kẻ tấn công đã lấy đi 896 bitcoin. Theo thông báo của Flexcoin, kẻ tấn công tạo nhiều tài khoản rồi gửi hàng nghìn request chuyển tiền đồng thời giữa chúng; mã kiểm số dư rồi mới cập nhật, nên nhiều lệnh chuyển qua được phép kiểm trước khi số dư kịp đổi — đúng kiểu đua "kiểm rồi mới ghi" của phiên bản bẫy trong đề thi, nhưng với tiền thật. <strong>Cách phòng:</strong> đặt bất biến ở chỗ đồng thời không phá được (unique/exclusion constraint, <code>UPDATE … WHERE balance &gt;= amount</code> nguyên tử, hoặc khoá dòng), rồi tự tấn công bằng request song song trước khi người khác làm.</p>

<h3>🎤 Giám khảo sẽ hỏi sau giờ thi</h3>
<ol>
  <li><strong>"Sao dùng unique index một phần mà không kiểm trong Java?"</strong> — Hai giao dịch không thấy dòng chưa commit của nhau; chỉ CSDL thấy tất cả lúc commit. Index cho phép mỗi thiết bị nhiều phiếu đã trả nhưng chỉ một phiếu đang mở.</li>
  <li><strong>"Sao cần cả khoá tư vấn lẫn unique index?"</strong> — Hai bất biến khác nhau: khoá xếp hàng request của một người (giới hạn 2 phiếu trải trên nhiều dòng); index bảo vệ một thiết bị trước mọi người.</li>
  <li><strong>"Test 'quá hạn' thế nào mà không phải chờ ba ngày?"</strong> — Tiêm một <code>Clock</code>; test và bộ chấm đặt nó (ở đây là <code>LABFLOW_NOW</code>) thay vì đọc giờ hệ thống.</li>
  <li><strong>"Vì sao migration đổi bảng notifications lại do notification sở hữu?"</strong> — Quyền sở hữu module: mỗi module chỉ đổi schema của mình, trong thư mục của mình, do chủ của nó duyệt.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Unique index một phần (partial)</strong> — unique index chỉ trên các dòng thoả một điều kiện (<code>where returned_at is null</code>).</li>
  <li><strong>Rubric</strong> — bảng chấm: từng mục, cách kiểm, bao nhiêu điểm.</li>
  <li><strong>Race condition (điều kiện đua)</strong> — kết quả phụ thuộc vào thời điểm của các thao tác đồng thời.</li>
  <li><strong>Bộ bắt lỗi chung</strong> — exception handler cho lỗi không lường trước: log đầy đủ ở server, trả lời chung cho client.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đề thi thêm trọn một module: package riêng, migration riêng, sự kiện công khai, luật, quyền sở hữu, một bất biến trong CSDL, và một test.</li>
  <li>Bản khởi đầu 0/10; lời giải 10/10 trong khoảng 2,5 phút chấm; thiếu unique index thì 7/10 — sáu phiếu cho một máy hiện sóng.</li>
  <li>Đổi một cột là phải soát mọi chỗ đọc: <code>booking_id</code> được NULL đã làm một endpoint cũ trả 500.</li>
  <li>Thời gian là một phụ thuộc: tiêm đồng hồ thì "quá hạn" mới test được.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.postgresql.org/docs/16/indexes-partial.html', '🐘', 'PostgreSQL 16 — partial index', 'Chỉ duy nhất trên những dòng cần.')}
${tl('https://docs.spring.io/spring-modulith/reference/verification.html', '🧩', 'Spring Modulith — kiểm cấu trúc module', 'verify() kiểm những gì.')}
${tl('https://www.postgresql.org/docs/16/transaction-iso.html', '🔒', 'PostgreSQL 16 — mức cô lập giao dịch', 'Vì sao "kiểm rồi mới ghi" bị đua ở Read Committed.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: <code>lab/c18/thi/cham.sh</code> trên ba bản dựng bằng <code>thi/lam.sh starter|giai|bay</code> (Spring Boot 4.1.2, PostgreSQL 16.16, Testcontainers 2.0.5), 24/11/2026.</li>
  <li>Flexcoin: thông báo trên flexcoin.com ngày 03/03/2014 và bản giải thích tiếp theo về lỗi đua khi chuyển tiền.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ18 = [
  Q('In the LabFlow modular monolith, BookingService needs to know whether a lab needs approval. What may it use?|||Trong modular monolith LabFlow, BookingService cần biết một phòng có cần duyệt không. Nó được dùng gì?', [
    'The LabCatalog interface and the LabInfo record in vn.labflow.catalog|||Interface LabCatalog và record LabInfo trong vn.labflow.catalog',
    'LabRepository in vn.labflow.catalog.internal, made public|||LabRepository trong vn.labflow.catalog.internal, đổi thành public',
    'A JPA @ManyToOne from Booking to the Lab entity|||Một @ManyToOne JPA từ Booking sang entity Lab',
    'A SQL join between bookings and labs|||Một câu SQL join bookings với labs',
  ], 0),
  Q('LabController starts calling a public interface of booking, while booking already calls catalog. What does KienTrucTest report?|||LabController bắt đầu gọi một interface công khai của booking, trong khi booking vốn đã gọi catalog. KienTrucTest báo gì?', [
    'Nothing: both types are public API|||Không gì: cả hai đều là API công khai',
    'Cycle detected: Slice booking -> Slice catalog -> Slice booking|||Cycle detected: Slice booking -> Slice catalog -> Slice booking',
    'A compile error|||Lỗi biên dịch',
    'Only a warning in the log|||Chỉ một cảnh báo trong log',
  ], 1),
  Q('Two branches each add V5__….sql in different module folders, then both are merged. What happens at startup?|||Hai nhánh mỗi nhánh thêm V5__….sql ở hai thư mục module khác nhau, rồi cùng được gộp. Lúc khởi động thì sao?', [
    'Flyway runs both, in alphabetical order|||Flyway chạy cả hai theo thứ tự chữ cái',
    'Flyway runs the first one found and skips the other|||Flyway chạy cái tìm thấy trước và bỏ cái kia',
    'FlywayException: Found more than one migration with version 5 — the application does not start|||FlywayException: Found more than one migration with version 5 — ứng dụng không khởi động',
    'Hibernate creates the missing tables|||Hibernate tự tạo các bảng còn thiếu',
  ], 2),
  Q('Production is at v2026.11.03.0900 and a migration V2026.11.02.1500 is merged late. Without extra settings Flyway…|||Production đang ở v2026.11.03.0900 và migration V2026.11.02.1500 được gộp muộn. Không cấu hình thêm thì Flyway…', [
    'applies it silently|||chạy nó lặng lẽ',
    'refuses: "Detected resolved migration not applied to database"; with out-of-order=true it applies it marked [out of order]|||từ chối: "Detected resolved migration not applied to database"; bật out-of-order=true thì chạy và gắn nhãn [out of order]',
    'deletes the newer migration from history|||xoá migration mới hơn khỏi lịch sử',
    'renames the file automatically|||tự đổi tên tệp',
  ], 1),
  Q('50 students POST the same lab and time at the same instant. What guarantees exactly one 201?|||50 sinh viên cùng POST cùng phòng, cùng giờ, cùng một khoảnh khắc. Điều gì bảo đảm đúng một 201?', [
    'The if (existsOverlap) check in BookingService|||Câu if (existsOverlap) trong BookingService',
    '@Transactional on the controller|||@Transactional trên controller',
    'The exclusion constraint on (lab_id, tsrange) for PENDING/CONFIRMED rows; 23P01 becomes 409|||Exclusion constraint trên (lab_id, tsrange) cho các dòng PENDING/CONFIRMED; 23P01 thành 409',
    'The Idempotency-Key header|||Header Idempotency-Key',
  ], 2),
  Q("An's booking is 09:00–11:00. Bình books 11:00–12:00 in the same lab. Result?|||Lượt của An là 09:00–11:00. Bình đặt 11:00–12:00 cùng phòng. Kết quả?", [
    '201: with half-open ranges [) touching is not overlapping|||201: với khoảng nửa mở [) chạm nhau không phải chồng nhau',
    '409 SLOT_TAKEN|||409 SLOT_TAKEN',
    '422 NOT_30_MIN_GRID|||422 NOT_30_MIN_GRID',
    '400 VALIDATION|||400 VALIDATION',
  ], 0),
  Q('The same user sends the same Idempotency-Key twice with the same body. What does LabFlow return the second time?|||Cùng một người gửi cùng Idempotency-Key hai lần với cùng thân. Lần hai LabFlow trả gì?', [
    '409 because the key is unique|||409 vì khoá là duy nhất',
    '201 with a new id|||201 với id mới',
    '200 with header Idempotent-Replayed: true and the same booking|||200 kèm header Idempotent-Replayed: true và đúng lượt cũ',
    '400 VALIDATION|||400 VALIDATION',
  ], 2),
  Q('The first error handler compared getConstraintName() with "bookings_khong_trung". What was measured?|||Bộ xử lý lỗi đầu tiên so getConstraintName() với "bookings_khong_trung". Đo được gì?', [
    'It worked: 409 SLOT_TAKEN|||Chạy đúng: 409 SLOT_TAKEN',
    'Hibernate 7.4 returned null for the EXCLUDE constraint, so the API answered 409 CONFLICT; the fix checks SQLState 23P01|||Hibernate 7.4 trả null cho ràng buộc EXCLUDE nên API trả 409 CONFLICT; cách sửa là kiểm SQLState 23P01',
    'The API answered 500|||API trả 500',
    'PostgreSQL did not raise any error|||PostgreSQL không báo lỗi gì',
  ], 1),
  Q('The compose healthcheck used exec 3<>/dev/tcp/127.0.0.1/8080 with CMD-SHELL. Why was the container never healthy?|||Healthcheck trong compose dùng exec 3<>/dev/tcp/127.0.0.1/8080 với CMD-SHELL. Vì sao container không bao giờ healthy?', [
    'The API was not listening on 8080|||API không nghe ở cổng 8080',
    '/bin/sh in the JRE image is dash, which has no /dev/tcp; the fix runs curl with the exec form|||/bin/sh trong image JRE là dash, không có /dev/tcp; cách sửa là gọi curl bằng dạng exec',
    'The container ran as a non-root user|||Container chạy bằng user không phải root',
    'Readiness was DOWN because Flyway failed|||Readiness DOWN vì Flyway lỗi',
  ], 1),
  Q('In the exam, a solution without the partial unique index on loans(equipment_id) where returned_at is null was graded. What happened with 20 simultaneous borrows?|||Trong đề thi, một lời giải thiếu unique index một phần trên loans(equipment_id) where returned_at is null được chấm. 20 người cùng mượn thì sao?', [
    'Still exactly one loan, because the status check prevents it|||Vẫn đúng một phiếu, vì phép kiểm trạng thái đã chặn',
    'All 20 got 409|||Cả 20 nhận 409',
    'Six loans were created for the same equipment; the score dropped to 7/10|||Sáu phiếu được tạo cho cùng một thiết bị; điểm còn 7/10',
    'The application crashed|||Ứng dụng sập',
  ], 2),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `18.${n} — ${en}|||18.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 18 — Capstone: the LabFlow booking API|||Chương 18 — Dự án cuối khoá: API đặt lịch phòng lab LabFlow',
  description: 'Dự án cuối khoá LabFlow như một nhóm năm người làm thật: đặc tả có business rule đánh số, modular monolith (identity, catalog, booking, notification) giữ ranh giới bằng Spring Modulith, Flyway mỗi module một thư mục; exclusion constraint chặn đặt trùng (50 người cùng đặt ⇒ đúng 1), Idempotency-Key, duyệt có phiên bản, sự kiện sau commit; Testcontainers, Docker Compose, CI; OpenAPI + React; bài thi thực hành 3 giờ có bộ chấm.',
  lessons: [
    L(1, 'sb-18-1-thiet-ke-capstone', 'Specification and domain design', 'Đặc tả và thiết kế domain',
      'User story + business rule đánh số; chia module theo nghiệp vụ (identity, catalog, booking, notification, shared OPEN); API công khai và sự kiện; Spring Modulith verify() đỏ thật khi import lớp nội bộ và khi có vòng booking↔catalog; schema theo module với exclusion constraint; Flyway mỗi module một thư mục: hai V5 ⇒ không khởi động, migration về muộn ⇒ out-of-order; chia việc 5 người, CODEOWNERS; T-Mobile 2023.',
      L181_EN + L181_VI),
    L(2, 'sb-18-2-xay-api', 'Building the API: rules, roles, one error format', 'Xây API: quy tắc, vai trò, một khuôn lỗi',
      'Module booking chạy thật: luật khung giờ Java thuần, máy trạng thái, khoá tư vấn theo người, Idempotency-Key (200 + Idempotent-Replayed), 23P01 ⇒ 409 SLOT_TAKEN (Hibernate 7.4 không trích tên ràng buộc EXCLUDE), 403 vai trò và 404 sở hữu, duyệt có phiên bản ⇒ 409 STALE, ProblemDetail có code + fields, thông báo sau commit bằng @ApplicationModuleListener; Starbucks 2015.',
      L182_EN + L182_VI),
    L(3, 'sb-18-3-test-va-docker', 'Tests, Docker and CI', 'Test, Docker và CI',
      '16 test trong 1 phút 16 giây: luật biên, ranh giới module, PostgreSQL thật, 2/10/50 người cùng đặt ⇒ đúng một 201; image hai tầng, layered jar (lớp ứng dụng 279 kB, thư viện 71,9 MB), user không phải root; compose up --wait 18,6 giây; healthcheck /dev/tcp hỏng dưới dash; readiness không chứa CSDL; CI GitHub Actions quyền tối thiểu; Codecov 2021.',
      L183_EN + L183_VI),
    L(4, 'sb-18-4-tong-ket', 'Frontend, final checklist and the Node.js comparison', 'Gắn frontend, checklist cuối khoá và so sánh Node.js',
      'Hợp đồng OpenAPI do springdoc sinh (12 đường dẫn, Bearer), kiểu TypeScript bằng openapi-typescript, client openapi-fetch: token trong bộ nhớ, 401 ⇒ đăng nhập lại, 403 giữ nguyên, thông báo theo code, khoá idempotency theo ý định; Vite build, CORS 5173 vs evil.example, cùng client chạy với API thật; checklist năng lực, so sánh Spring Boot và Node.js, 10 câu phỏng vấn cả khoá; British Airways 2018.',
      L184_EN + L184_VI),
    L(5, 'sb-18-5-thi-thuc-hanh', 'Timed practical exam', 'Bài thi thực hành có giờ',
      'Đề PE 3 giờ: thêm module mượn thiết bị (BR-11, BR-12) với migration riêng, sự kiện cho notification, unique index một phần chống mượn trùng; bộ chấm 10 mục gọi API trên CSDL sạch: bản khởi đầu 0/10, lời giải 10/10, thiếu unique index 7/10 (sáu phiếu cho một máy); bẫy cột thành NULL làm endpoint cũ trả 500; lời giải ẩn; Flexcoin 2014.',
      L185_EN + L185_VI),
    {
      title: '18.6 — Chapter 18 quiz|||18.6 — Kiểm tra chương 18',
      slug: 'sb-18-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong dự án cuối khoá: API công khai của module, vòng phụ thuộc, hai V5 và migration về muộn, exclusion constraint với 50 người cùng đặt, khoảng nửa mở, Idempotency-Key, tên ràng buộc EXCLUDE bị Hibernate bỏ, healthcheck dưới dash, và sáu phiếu mượn khi thiếu unique index.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a red boundary test, two V5 files, 50 bookings and one winner, a replayed key, a healthcheck that never passed, and six students holding the same oscilloscope. Pass mark 7/10.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một test ranh giới đỏ, hai tệp V5, 50 lượt đặt và một người thắng, một khoá được trả lại, một healthcheck không bao giờ qua, và sáu sinh viên cùng giữ một máy hiện sóng. Đạt từ 7/10.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ18 },
    },
  ],
};
