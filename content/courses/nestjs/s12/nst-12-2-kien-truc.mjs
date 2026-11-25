/**
 * 12.2 — Kiến trúc: sơ đồ module lấy từ DI container, mô hình dữ liệu, hợp đồng OpenAPI trong repo, ADR (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/swagger 12.1.2, Prisma 7.10.1): lab/c12/moc12 — scripts/so-do-module.mjs,
 * scripts/xuat-openapi.mjs, docs/adr/*.md; output lab/c12/o/122-*.txt. Ghép: gen.mjs rồi ghep.sh 122 nst-12-2-kien-truc.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-2-3-module', title: 'NestJS 2.3 — Module: tường và cửa', sub: '@Global, exports, vòng import — nền của sơ đồ ở mục 1.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-4-4-openapi', title: 'NestJS 4.4 — OpenAPI từ mã', sub: 'Plugin CLI và vì sao không có nó thì schema rỗng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-4-1-thay-doi', title: 'API Design 4.1 — Thay đổi phá vỡ và không phá vỡ', sub: 'Đọc một diff hợp đồng thì phân loại thế nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-7-2-sinh-code', title: 'API Design — Sinh client có kiểu từ một tệp OpenAPI', sub: 'Phía frontend dùng openapi.json của bạn ra sao.', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('📘', 'NestJS Docs — OpenAPI CLI plugin', 'dtoFileNameSuffix mặc định chỉ có .dto.ts và .entity.ts.', 'https://docs.nestjs.com/openapi/cli-plugin'),
  nguon('📘', 'adr.github.io — Architectural Decision Records', 'Mẫu và lý do ghi lại quyết định kiến trúc.', 'https://adr.github.io/'),
].join('\n');
const MA_SO_DO = "// scripts/so-do-module.mjs — in sơ đồ module THẬT của ứng dụng (đọc từ DI container, không vẽ tay) ra Mermaid.\n// preview: true ⇒ Nest dựng đồ thị module/provider nhưng KHÔNG khởi tạo provider (không nối DB, Redis). Chạy sau `nest build`.\nimport { NestFactory, ModulesContainer } from '@nestjs/core';\nfor (const [k, v] of Object.entries({ NODE_ENV: 'development', JWT_SECRET: 'chi-de-ve-so-do-khong-phai-bi-mat', DATABASE_URL: 'postgresql://x:x@127.0.0.1:1/x', REDIS_URL: 'redis://127.0.0.1:1' })) process.env[k] ||= v;   // ||= chứ không ??=: biến đặt rỗng (NODE_ENV=) cũng phải được thay   // như xuat-openapi.mjs\nconst { AppModule } = await import('../dist/app.module.js');\n\nconst app = await NestFactory.create(AppModule, { preview: true, logger: ['error'], abortOnError: false });\nconst mods = [...app.get(ModulesContainer).values()];\n// module của thư viện (@nestjs/*, nestjs-pino…) bỏ qua; module của dự án giữ lại\nconst THU_VIEN = /^(InternalCoreModule|ConfigModule|ConfigHostModule|LoggerModule|LoggerCoreModule|EventEmitterModule|BullModule|BullRegistrar|BullSharedModule|JwtModule|ThrottlerModule|TerminusModule|DiscoveryModule|ConditionalModule)$/;\nconst cuaMinh = (m) => !THU_VIEN.test(m.name);\n// Nest tự \"nhét\" mọi module @Global vào imports của TỪNG module (kể cả của nhau) ⇒ bỏ cạnh tới module global, ghi riêng một dòng\nconst dong = ['graph LR'];\nfor (const m of mods.filter(cuaMinh)) {\n  const ten = m.name, nhap = [...m.imports].filter((x) => x && cuaMinh(x) && !x.isGlobal).map((x) => x.name);\n  const pv = [...m.providers.keys()].filter((k) => typeof k === 'function' && ![ten].includes(k.name) && !['ModuleRef', 'ApplicationConfig'].includes(k.name));\n  const xuat = [...m.exports].map((k) => (typeof k === 'function' ? k.name : String(k)));\n  console.error(`${ten.padEnd(22)} provider ${String(pv.length).padStart(2)} · xuất [${xuat.filter((x) => !x.startsWith('Symbol')).join(', ')}]${m.isGlobal ? ' · @Global' : ''}`);\n  for (const n of nhap) dong.push(`  ${ten} --> ${n}`);\n}\nconst toanCuc = mods.filter((m) => cuaMinh(m) && m.isGlobal).map((m) => m.name);\ndong.push(`  %% toàn cục (mọi module dùng được, không vẽ cạnh): ${toanCuc.join(', ')}`);\nconsole.log(dong.join('\\n'));\nawait app.close();";
const OUT_SO_DO_THO = "  AppModule --> AppConfigModule\n  AppModule --> PrismaModule\n  AppModule --> ClockModule\n  AppModule --> AuthModule\n  AppModule --> RoomsModule\n  AppModule --> BookingsModule\n  AppModule --> RealtimeModule\n  AppModule --> HealthModule\n  AppModule --> NotificationsModule\n  AppModule --> ConfigLoadedModule\n  AppConfigModule --> ConfigLoadedModule\n  AppConfigModule --> PrismaModule\n  AppConfigModule --> ClockModule\n  AppConfigModule --> AuthModule\n  … (55 cạnh)";
const OUT_SO_DO = "AppModule              provider  2 · xuất []\nAppConfigModule        provider  0 · xuất []\nConfigLoadedModule     provider  0 · xuất [] · @Global\nPrismaModule           provider  1 · xuất [PrismaService] · @Global\nClockModule            provider  1 · xuất [Clock] · @Global\nAuthModule             provider  1 · xuất [JwtModule] · @Global\nRoomsModule            provider  1 · xuất [RoomsService]\nBookingsModule         provider  1 · xuất []\nThrottlerStorageModule provider  1 · xuất [RedisThrottlerStorage]\nRealtimeModule         provider  3 · xuất []\nHealthModule           provider  1 · xuất [TatEm]\nNotificationsModule    provider  2 · xuất []\nWorkerModule           provider  5 · xuất []\ngraph LR\n  AppModule --> AppConfigModule\n  AppModule --> RoomsModule\n  AppModule --> BookingsModule\n  AppModule --> RealtimeModule\n  AppModule --> HealthModule\n  AppModule --> NotificationsModule\n  BookingsModule --> RoomsModule\n  %% toàn cục (mọi module dùng được, không vẽ cạnh): ConfigLoadedModule, PrismaModule, ClockModule, AuthModule";
const MA_ROOM = "model Room {\n  id       Int       @id @default(autoincrement())\n  code     String    @unique @db.VarChar(6)\n  building String    @db.VarChar(10)\n  capacity  Int\n  managerId Int?      @map(\"manager_id\")          // giảng viên duyệt lịch của phòng này\n  openMin   Int       @default(420) @map(\"open_min\")    // mốc 12: giờ mở cửa, phút kể từ 00:00 giờ Việt Nam (420 = 07:00)\n  closeMin  Int       @default(1260) @map(\"close_min\")  // 1260 = 21:00; CHECK 0 ≤ open < close ≤ 1440 ở migration viết tay\n  manager   User?     @relation(\"RoomManager\", fields: [managerId], references: [id], onDelete: SetNull)\n  bookings  Booking[]\n\n  @@map(\"rooms\")\n}";
const MA_MIG = "-- AlterTable\nALTER TABLE \"rooms\" ADD COLUMN     \"close_min\" INTEGER NOT NULL DEFAULT 1260,\nADD COLUMN     \"open_min\" INTEGER NOT NULL DEFAULT 420;\n\n-- Viết tay (mốc 12): Prisma Schema không diễn tả được CHECK. Giờ mở cửa hợp lệ, bước 30 phút như khung đặt lịch.\nALTER TABLE \"rooms\" ADD CONSTRAINT \"rooms_gio_mo_cua\" CHECK (\n  open_min >= 0 AND close_min <= 1440 AND open_min < close_min AND open_min % 30 = 0 AND close_min % 30 = 0\n);";
const OUT_PATHS = "POST           /auth/register\nPOST           /auth/login\nPOST           /auth/refresh\nPOST           /auth/logout\nGET            /auth/me\nPOST,GET       /rooms\nGET,PATCH,DELETE /rooms/{id}\nPUT            /rooms/{id}/hours\nPOST           /bookings\nGET            /bookings/mine\nGET            /bookings/room/{roomId}\nGET,DELETE     /bookings/{id}\nPATCH          /bookings/{id}/approve\nPATCH          /bookings/{id}/reject\nGET            /health/live\nGET            /health/ready";
const OUT_RONG = "BookingResponse {\"type\":\"object\",\"properties\":{}}\nRoomResponse {\"type\":\"object\",\"properties\":{}}";
const MA_NESTCLI = "{\n  \"$schema\": \"https://json.schemastore.org/nest-cli\",\n  \"collection\": \"@nestjs/schematics\",\n  \"sourceRoot\": \"src\",\n  \"compilerOptions\": {\n    \"deleteOutDir\": true,\n    \"plugins\": [{ \"name\": \"@nestjs/swagger\", \"options\": { \"introspectComments\": true, \"classValidatorShim\": true, \"dtoFileNameSuffix\": [\".dto.ts\", \".entity.ts\", \".response.ts\"] } }]\n  }\n}";
const MA_RESP = "// room.response.ts — mốc 12: hợp đồng phản hồi của phòng (trước mốc 12 OpenAPI ghi \"object\" trống — client không biết có trường nào)\nexport class RoomResponse {\n  id: number;\n  /** Mã phòng, ví dụ AL-201 */\n  code: string;\n  building: string;\n  capacity: number;\n  /** Giảng viên duyệt lịch của phòng; null = chỉ admin duyệt */\n  managerId: number | null;\n  /** Giờ mở cửa (giờ Việt Nam), ví dụ 07:00 */\n  open: string;\n  /** Giờ đóng cửa (giờ Việt Nam), ví dụ 21:00; 24:00 = nửa đêm */\n  close: string;\n}\nexport class RoomHoursResponse extends RoomResponse {\n  /** Id các lịch sắp tới (chờ duyệt / đã duyệt) nằm ngoài giờ mới — KHÔNG bị huỷ tự động, admin báo người đặt */\n  ngoaiGioMoi: number[];\n}";
const OUT_DAY = "BookingResponse    required: id,roomId,userId,start,end,attendees,status \nRoomResponse       required: id,code,building,capacity,managerId,open,close \nRoomHoursResponse  required: id,code,building,capacity,managerId,open,close,ngoaiGioMoi \n{\"type\":\"number\",\"nullable\":true,\"description\":\"Giảng viên duyệt lịch của phòng; null = chỉ admin duyệt\"} {\"type\":\"string\"}";
const MA_XUAT = "// scripts/xuat-openapi.mjs — ghi openapi.json từ CHÍNH mã đã build (preview: không nối DB/Redis). CI chạy rồi `git diff --exit-code openapi.json`:\n// ai đổi API mà không cập nhật hợp đồng (và không ai duyệt thay đổi đó) ⇒ CI đỏ.\nimport { writeFileSync } from 'node:fs';\nimport { NestFactory } from '@nestjs/core';\n\n// ConfigModule kiểm biến môi trường NGAY LÚC NẠP AppModule (mốc 5) ⇒ đặt giá trị giả TRƯỚC khi import — sinh hợp đồng không cần bí mật thật,\n// và preview không nối tới đâu cả. (Dùng import động: import tĩnh bị kéo lên chạy trước mọi dòng lệnh.)\nfor (const [k, v] of Object.entries({ NODE_ENV: 'development', JWT_SECRET: 'chi-de-sinh-openapi-khong-phai-bi-mat', DATABASE_URL: 'postgresql://x:x@127.0.0.1:1/x', REDIS_URL: 'redis://127.0.0.1:1' })) process.env[k] ||= v;   // ||= chứ không ??=: biến đặt rỗng (NODE_ENV=) cũng phải được thay\nconst { AppModule } = await import('../dist/app.module.js');\nconst { taoTaiLieu } = await import('../dist/openapi.js');\n\nconst app = await NestFactory.create(AppModule, { preview: true, logger: ['error'] });\nconst doc = taoTaiLieu(app);\nwriteFileSync(new URL('../openapi.json', import.meta.url), JSON.stringify(doc, null, 2) + '\\n');\nconsole.log(`openapi.json: ${Object.keys(doc.paths).length} đường dẫn, ${Object.keys(doc.components?.schemas ?? {}).length} schema`);\nawait app.close();";
const OUT_LECH = "diff --git a/openapi.json b/openapi.json\nindex 644d425..7464da1 100644\n--- a/openapi.json\n+++ b/openapi.json\n@@ -1007,6 +1007,10 @@\n           },\n           \"status\": {\n             \"type\": \"string\"\n+          },\n+          \"note\": {\n+            \"type\": \"string\",\n+            \"nullable\": true\n           }\n         },\n         \"required\": [\n@@ -1016,7 +1020,8 @@\n           \"start\",\n           \"end\",\n           \"attendees\",\n-          \"status\"\n+          \"status\",\n+          \"note\"\n         ]\n       },\n       \"TerminusHealthIndicatorResult\": {";
const MA_CI_HD = "      - run: npm run typecheck\n      - run: npm run test:unit\n      # mốc 12: hợp đồng API nằm trong repo (openapi.json). Đổi API mà không cập nhật + duyệt hợp đồng ⇒ đỏ ở đây\n      - run: npm run build && npm run openapi\n      - run: git diff --exit-code -- openapi.json";
const ADR2 = "# ADR-002: A pending request holds the slot; at most 3 pending per user\n\n- Status: accepted (milestone 12) · Context: the brief only requires that *approved* bookings never overlap. Alternatives: (a) many pending requests per slot, the lecturer picks one; (b) the first request holds the slot until it is approved, rejected or expires.\n- Decision: (b) — the EXCLUDE constraint covers `PENDING` too. First come, first served is easy to explain to students and keeps approval a one-click action.\n- Consequences: one student could block a room for a week with many requests ⇒ limit of 3 pending requests per user (admins exempt). \"Count then insert\" is a race, so the count and the insert run in one transaction behind `pg_advisory_xact_lock(1, userId)`. Measured: 10 concurrent requests from one user ⇒ 8 accepted without the lock, exactly 3 with it.";
const ADR4 = "# ADR-004: Opening hours use a fixed UTC+7 offset\n\n- Status: accepted (milestone 12) · Context: rooms open e.g. 07:00–21:00 local time; timestamps are stored as `timestamptz` (UTC).\n- Decision: convert with a fixed +07:00 offset (`LECH_VN_PHUT`) in TypeScript and `AT TIME ZONE INTERVAL '+07:00'` in SQL. Vietnam has had no daylight saving time since 1975, and `node:alpine` images ship without full time-zone data.\n- Consequences: simple and testable without a tz database. Trap found by a test: `AT TIME ZONE '+07'` (a string) follows POSIX sign rules and means UTC−7. If the system ever serves a region with DST, switch to IANA zones (`Asia/Ho_Chi_Minh`) end to end.";
const DS_ADR = "001-db-prevents-double-booking.md\n002-pending-holds-the-slot.md\n003-one-image-two-roles.md\n004-fixed-utc-plus-7.md\n005-narrowing-hours-does-not-cancel.md\n006-rate-limit-when-redis-is-down.md";

const MODS = [
  ['BookingsModule', 'booking rules: hours, pending limit, ownership, status changes', 'luật đặt lịch: giờ mở cửa, hạn mức, sở hữu, đổi trạng thái', 'imports RoomsModule; emits events', 'import RoomsModule; phát sự kiện'],
  ['RoomsModule', 'rooms and opening hours', 'phòng và giờ mở cửa', 'exports RoomsService; emits RoomHoursChanged', 'xuất RoomsService; phát RoomHoursChanged'],
  ['NotificationsModule', 'turns events into BullMQ jobs; WorkerModule runs them', 'biến sự kiện thành job BullMQ; WorkerModule chạy job', 'listens to events — never imports Bookings', 'nghe sự kiện — không import Bookings'],
  ['RealtimeModule', 'Socket.IO gateway, Redis adapter', 'gateway Socket.IO, Redis adapter', 'listens to events', 'nghe sự kiện'],
  ['AuthModule (global)', 'JWT, guards, CASL policy, throttler storage', 'JWT, guard, chính sách CASL, kho throttler', 'APP_GUARD in AppModule', 'APP_GUARD ở AppModule'],
  ['PrismaModule, ClockModule (global)', 'infrastructure every module needs', 'hạ tầng module nào cũng cần', 'injected', 'được tiêm'],
  ['HealthModule', 'liveness / readiness', 'liveness / readiness', 'exports TatEm (shutdown)', 'xuất TatEm (tắt êm)'],
];
const bangMod = (vi) => `<table>
<thead><tr><th>Module</th><th>${vi ? 'Trách nhiệm' : 'Responsibility'}</th><th>${vi ? 'Nói chuyện với bên ngoài bằng' : 'Talks to others via'}</th></tr></thead>
<tbody>
${MODS.map(([m, en, vi_, cen, cvi]) => `<tr><td><code>${m}</code></td><td>${vi ? vi_ : en}</td><td>${vi ? cvi : cen}</td></tr>`).join('\n')}
</tbody>
</table>`;

export default {
  title: '12.2 — Architecture: modules, data model and API contract first|||12.2 — Kiến trúc: module, mô hình dữ liệu và hợp đồng API trước',
  slug: 'nst-12-2-kien-truc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba sản phẩm kiến trúc của dự án cuối, đều sinh từ chính mã: sơ đồ module đọc từ DI container (55 cạnh thô vì @Global, lọc còn 7), mô hình dữ liệu có CHECK viết tay, và openapi.json nằm trong repo — lộ ra schema phản hồi rỗng từ mốc 4 vì plugin chỉ đọc .dto.ts. CI so hợp đồng mỗi lần đẩy: thêm một trường là đỏ. Kèm 6 ADR ghi quyết định.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 2</span>
<h2>12.2 — Architecture you can regenerate, not a diagram that rots</h2>
<p class="lead">A panel asks three architecture questions: how is the code split, what does the data look like, and what exactly does the API promise? Hand-drawn answers go stale the day after the defence. Here every answer is produced from the running code: a module map read from Nest's own container, the Prisma schema plus hand-written constraints, and an <code>openapi.json</code> committed to the repository and checked by CI.</p>

<h3>Everyday analogy: house plans and the contract with the builder</h3>
<p>The module map is the floor plan — which room connects to which. The data model is the foundation; changing it later is expensive. The API contract is the signed agreement with the people who will live there (the frontend): you may repaint inside, but moving a door needs their signature. ADRs are the site diary: why the wall is here and not there.</p>

<h3>1. The module map, read from the DI container</h3>
<p><code>NestFactory.create(AppModule, { preview: true })</code> builds the whole module and provider graph without instantiating providers — no database or Redis connection. The script walks <code>ModulesContainer</code> and prints Mermaid:</p>
<pre><code class="language-js">${esc(MA_SO_DO)}</code></pre>
<p>The first version drew every import edge and produced this:</p>
<pre><code class="language-text">${esc(OUT_SO_DO_THO)}</code></pre>
<p>Fifty-five edges, and global modules "import" each other. That is not a bug in the app: when Nest finishes scanning it binds every <code>@Global()</code> module into the imports of <em>every</em> module, so the container no longer distinguishes "declared" from "global". Filtering edges to global modules (listed once in a comment) leaves the real architecture:</p>
<pre><code class="language-text">${esc(OUT_SO_DO)}</code></pre>
${bangMod(false)}
<p>The edge that matters is the one that is <strong>missing</strong>: nothing imports <code>BookingsModule</code>. Notifications and real time react to events (9.3), so booking rules can change without touching email or sockets. <code>ThrottlerStorageModule</code> and <code>WorkerModule</code> appear in the list but not as edges because they are imported by library modules (<code>ThrottlerModule.forRootAsync</code>, <code>ConditionalModule</code>) that the script hides.</p>

<h3>2. Data model</h3>
<pre><code class="language-ts">${esc(MA_ROOM)}</code></pre>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<p>Opening hours are minutes since midnight (Vietnam time) — easy to compare, easy to constrain with <code>CHECK</code>. The API shows <code>"07:00"</code> instead: a small mapper <code>raPhong()</code> turns the row into the response. The contract follows the user, not the column; the e2e test even asserts that <code>openMin</code> never leaks.</p>

<h3>3. The API contract lives in the repository</h3>
<p>Nest is code-first: decorators and the CLI plugin generate OpenAPI. "Contract first" in a code-first project means: the generated contract is a reviewed file, and every change to it is visible in the pull request <em>before</em> anyone builds on it. Generating it for the first time:</p>
<pre><code class="language-text">${esc(OUT_PATHS)}</code></pre>
<p>Sixteen paths — and two silent holes:</p>
<pre><code class="language-text">${esc(OUT_RONG)}</code></pre>
<p><code>BookingResponse</code> has been an empty object since milestone 4. The plugin only reads files whose names end in <code>.dto.ts</code> or <code>.entity.ts</code>; <code>booking.response.ts</code> was never introspected, and <code>/docs</code> looked fine because it showed the route. Rooms had no response class at all. The fix is configuration plus one class:</p>
<pre><code class="language-json">${esc(MA_NESTCLI)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESP)}</code></pre>
<pre><code class="language-text">${esc(OUT_DAY)}</code></pre>
<p>The export script sets placeholder environment values <em>before</em> importing the app (the config schema validates at import time), so CI can produce the contract without secrets:</p>
<pre><code class="language-js">${esc(MA_XUAT)}</code></pre>
<pre><code class="language-yaml">${esc(MA_CI_HD)}</code></pre>
<p>Proof that the gate works — a teammate "just" exposes <code>note</code> in bookings:</p>
<pre><code class="language-text">${esc(OUT_LECH)}</code></pre>
<p>Exit code 1 ⇒ CI red. Adding a required response field is a contract change the frontend must know about (and exposing a free-text note is a privacy decision). The fix is not to silence the check but to commit the new <code>openapi.json</code> so reviewers see the diff. <em>Honest note:</em> the lab folder is not a git repository, so the local CI runner replaces this step with <code>git diff --no-index</code> against the file as it was at checkout — same comparison, different plumbing.</p>

<h3>4. Architecture Decision Records</h3>
<pre><code class="language-text">${esc(DS_ADR)}</code></pre>
<p>One short file per decision: context, decision, consequences — and a measured number when there is one. Two of them:</p>
<pre><code class="language-markdown">${esc(ADR2)}</code></pre>
<pre><code class="language-markdown">${esc(ADR4)}</code></pre>
<p>When the panel asks "why does a pending request block the slot?", you open ADR-002 instead of improvising.</p>

<h3>🧪 Exercise (40 min)</h3>
<ol>
<li>Run the module-map script on your project. Which module is imported by the most others? Is that a shared kernel or a sign that rules leaked out of their module?</li>
<li>Add <code>openapi.json</code> and the two CI steps. Rename one response field and confirm CI goes red.</li>
<li>Write two ADRs for your project: the rule that is enforced by the database, and one decision you rejected.</li>
</ol>
<details><summary>Show hints</summary>
<ul>
<li>If one feature module is imported by four others, look for code that should be an event (9.3) or a smaller exported service.</li>
<li>If the contract shows <code>"type":"object","properties":{}</code>, check the file suffix before adding decorators by hand.</li>
<li>A rejected option is worth an ADR when someone will propose it again — write the measurement that killed it.</li>
</ul>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How did you decide module boundaries?"</strong> — By rules and change: everything that enforces booking rules is in one module; other features react to its events and never import it.</li>
<li><strong>"Code-first or contract-first?"</strong> — Code-first generation, contract-first review: the generated file is committed and CI fails on unreviewed changes.</li>
<li><strong>"When is @Global acceptable?"</strong> — For infrastructure every module needs (database client, clock); never for feature services, because it hides dependencies — as the 55-edge graph shows.</li>
<li><strong>"What is an ADR, and show me one."</strong> — Have ADR-002 ready, including the 8-versus-3 measurement.</li>
</ol>

<h3>💼 On the job</h3>
<p>Offshore projects often have the frontend team in another company or country. They generate a typed client from your <code>openapi.json</code> every morning. An unannounced field rename breaks their build at 9 a.m. their time, and the ticket comes back to you as "API broken". A committed contract plus a red CI check turns that into a pull-request comment the day before. Many teams also add a "breaking change" label and a changelog line for each contract diff.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Preview mode</span><span class="v"><code>{ preview: true }</code>: Nest builds the dependency graph without instantiating providers.</span></div>
  <div class="kv"><span class="k">API contract</span><span class="v">The exact paths, inputs and outputs clients may rely on — here <code>openapi.json</code>.</span></div>
  <div class="kv"><span class="k">Contract drift</span><span class="v">Code and published contract no longer match.</span></div>
  <div class="kv"><span class="k">ADR</span><span class="v">Architecture Decision Record: context, decision, consequences of one choice.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Module map from the container: 55 raw edges because of @Global, 7 real ones; nothing imports BookingsModule.</li>
<li>Store what is easy to constrain (minutes + CHECK), return what users read ("07:00").</li>
<li>Generating the contract exposed empty response schemas since milestone 4 — plugin suffixes.</li>
<li>CI regenerates and diffs openapi.json; one exposed field ⇒ exit 1.</li>
<li>Six ADRs, each with its measured reason.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 2</span>
<h2>12.2 — Kiến trúc sinh lại được, không phải hình vẽ để mục</h2>
<p class="lead">Hội đồng hỏi ba câu về kiến trúc: mã chia thế nào, dữ liệu trông ra sao, và API hứa chính xác điều gì? Câu trả lời vẽ tay lỗi thời ngay hôm sau buổi bảo vệ. Ở đây câu nào cũng sinh ra từ mã đang chạy: sơ đồ module đọc từ chính container của Nest, lược đồ Prisma cộng ràng buộc viết tay, và một tệp <code>openapi.json</code> nằm trong repo, được CI kiểm.</p>

<h3>Liên hệ đời thường: bản vẽ nhà và hợp đồng với thợ xây</h3>
<p>Sơ đồ module là mặt bằng — phòng nào thông với phòng nào. Mô hình dữ liệu là móng; sửa về sau rất tốn. Hợp đồng API là bản thoả thuận đã ký với người sẽ ở (đội frontend): bạn được sơn lại bên trong, nhưng dời một cửa ra vào thì cần họ ký. ADR là nhật ký công trình: vì sao bức tường ở chỗ này mà không ở chỗ kia.</p>

<h3>1. Sơ đồ module, đọc từ DI container</h3>
<p><code>NestFactory.create(AppModule, { preview: true })</code> dựng toàn bộ đồ thị module và provider nhưng không khởi tạo provider — không nối cơ sở dữ liệu, không nối Redis. Script đi qua <code>ModulesContainer</code> và in ra Mermaid:</p>
<pre><code class="language-js">${esc(MA_SO_DO)}</code></pre>
<p>Bản đầu vẽ mọi cạnh import và ra thế này:</p>
<pre><code class="language-text">${esc(OUT_SO_DO_THO)}</code></pre>
<p>Năm mươi lăm cạnh, và các module toàn cục "import" lẫn nhau. Đây không phải lỗi của ứng dụng: quét xong, Nest gắn mọi module <code>@Global()</code> vào imports của <em>từng</em> module, nên container không còn phân biệt "khai báo" với "toàn cục". Lọc bỏ cạnh tới module toàn cục (liệt kê một lần trong dòng chú thích) thì còn lại kiến trúc thật:</p>
<pre><code class="language-text">${esc(OUT_SO_DO)}</code></pre>
${bangMod(true)}
<p>Cạnh đáng giá nhất là cạnh <strong>không có</strong>: không ai import <code>BookingsModule</code>. Thông báo và thời gian thực phản ứng với sự kiện (bài 9.3), nên luật đặt lịch đổi được mà không đụng email hay socket. <code>ThrottlerStorageModule</code> và <code>WorkerModule</code> có trong danh sách nhưng không thành cạnh vì chúng được import bởi module thư viện (<code>ThrottlerModule.forRootAsync</code>, <code>ConditionalModule</code>) mà script ẩn đi.</p>

<h3>2. Mô hình dữ liệu</h3>
<pre><code class="language-ts">${esc(MA_ROOM)}</code></pre>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<p>Giờ mở cửa lưu bằng số phút kể từ nửa đêm (giờ Việt Nam) — dễ so sánh, dễ ràng buộc bằng <code>CHECK</code>. API thì hiện <code>"07:00"</code>: một hàm nhỏ <code>raPhong()</code> đổi bản ghi thành phản hồi. Hợp đồng đi theo người dùng, không theo cột; test e2e còn khẳng định <code>openMin</code> không bao giờ lọt ra ngoài.</p>

<h3>3. Hợp đồng API nằm trong repo</h3>
<p>Nest đi theo lối code-first: decorator và plugin CLI sinh ra OpenAPI. "Hợp đồng trước" trong một dự án code-first nghĩa là: hợp đồng sinh ra là một tệp được review, và mọi thay đổi trên nó hiện trong pull request <em>trước</em> khi có ai xây tiếp lên. Sinh lần đầu:</p>
<pre><code class="language-text">${esc(OUT_PATHS)}</code></pre>
<p>Mười sáu đường dẫn — và hai lỗ hổng im lặng:</p>
<pre><code class="language-text">${esc(OUT_RONG)}</code></pre>
<p><code>BookingResponse</code> là object rỗng từ mốc 4. Plugin chỉ đọc tệp có tên kết thúc bằng <code>.dto.ts</code> hoặc <code>.entity.ts</code>; <code>booking.response.ts</code> chưa từng được đọc, và trang <code>/docs</code> trông vẫn ổn vì nó hiện route. Phòng thì chưa có lớp phản hồi nào. Cách sửa là cấu hình cộng một lớp:</p>
<pre><code class="language-json">${esc(MA_NESTCLI)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESP)}</code></pre>
<pre><code class="language-text">${esc(OUT_DAY)}</code></pre>
<p>Script xuất đặt giá trị môi trường giả <em>trước khi</em> import ứng dụng (schema cấu hình kiểm ngay lúc import), nên CI sinh được hợp đồng mà không cần bí mật nào:</p>
<pre><code class="language-js">${esc(MA_XUAT)}</code></pre>
<pre><code class="language-yaml">${esc(MA_CI_HD)}</code></pre>
<p>Bằng chứng cổng kiểm hoạt động — một bạn cùng nhóm "chỉ" mở thêm trường <code>note</code> trong lịch đặt:</p>
<pre><code class="language-text">${esc(OUT_LECH)}</code></pre>
<p>Mã thoát 1 ⇒ CI đỏ. Thêm một trường bắt buộc vào phản hồi là thay đổi hợp đồng mà frontend phải biết (và lộ một ghi chú tự do là quyết định về quyền riêng tư). Cách xử lý không phải tắt bước kiểm, mà là commit <code>openapi.json</code> mới để người review nhìn thấy diff. <em>Nói thật:</em> thư mục lab không phải kho git, nên bộ chạy CI cục bộ thay bước này bằng <code>git diff --no-index</code> so với tệp lúc checkout — cùng phép so, khác đường ống.</p>

<h3>4. Ghi lại quyết định kiến trúc (ADR)</h3>
<pre><code class="language-text">${esc(DS_ADR)}</code></pre>
<p>Mỗi quyết định một tệp ngắn: bối cảnh, quyết định, hệ quả — và con số đo được nếu có. Hai trong số đó:</p>
<pre><code class="language-markdown">${esc(ADR2)}</code></pre>
<pre><code class="language-markdown">${esc(ADR4)}</code></pre>
<p>Khi hội đồng hỏi "sao lịch chờ duyệt lại chặn khung giờ?", bạn mở ADR-002 thay vì ứng biến.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<ol>
<li>Chạy script sơ đồ module trên dự án của bạn. Module nào bị nhiều module khác import nhất? Đó là phần lõi dùng chung, hay dấu hiệu luật đã rò ra khỏi module của nó?</li>
<li>Thêm <code>openapi.json</code> và hai bước CI. Đổi tên một trường phản hồi và xác nhận CI đỏ.</li>
<li>Viết hai ADR cho dự án của bạn: luật do cơ sở dữ liệu giữ, và một phương án bạn đã loại.</li>
</ol>
<details><summary>Xem gợi ý</summary>
<ul>
<li>Nếu một module tính năng bị bốn module khác import, tìm đoạn mã đáng lẽ là một sự kiện (bài 9.3) hoặc một service nhỏ hơn được export.</li>
<li>Nếu hợp đồng ghi <code>"type":"object","properties":{}</code>, kiểm đuôi tên tệp trước khi tự tay thêm decorator.</li>
<li>Phương án bị loại đáng một ADR khi chắc chắn sẽ có người đề xuất lại — ghi phép đo đã loại nó.</li>
</ul>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn chia ranh giới module dựa vào đâu?"</strong> — Theo luật và theo thay đổi: mọi thứ giữ luật đặt lịch nằm trong một module; tính năng khác phản ứng với sự kiện của nó và không bao giờ import nó.</li>
<li><strong>"Code-first hay contract-first?"</strong> — Sinh theo code-first, review theo contract-first: tệp sinh ra được commit và CI đỏ khi có thay đổi chưa được review.</li>
<li><strong>"Khi nào dùng @Global được?"</strong> — Cho hạ tầng module nào cũng cần (client cơ sở dữ liệu, đồng hồ); không bao giờ cho service tính năng, vì nó giấu phụ thuộc — như đồ thị 55 cạnh cho thấy.</li>
<li><strong>"ADR là gì, cho tôi xem một cái."</strong> — Mở sẵn ADR-002, kèm phép đo 8 so với 3.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Dự án offshore thường có đội frontend ở công ty khác hoặc nước khác. Sáng nào họ cũng sinh client có kiểu từ <code>openapi.json</code> của bạn. Một lần đổi tên trường không báo trước làm build của họ vỡ lúc 9 giờ sáng giờ bên đó, và ticket quay về bạn với tiêu đề "API hỏng". Hợp đồng được commit cộng một bước CI đỏ biến chuyện đó thành một bình luận trong pull request từ hôm trước. Nhiều nhóm còn gắn nhãn "breaking change" và ghi một dòng changelog cho mỗi diff hợp đồng.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chế độ preview</span><span class="v"><code>{ preview: true }</code>: Nest dựng đồ thị phụ thuộc mà không khởi tạo provider.</span></div>
  <div class="kv"><span class="k">Hợp đồng API</span><span class="v">Đường dẫn, đầu vào, đầu ra chính xác mà client được phép dựa vào — ở đây là <code>openapi.json</code>.</span></div>
  <div class="kv"><span class="k">Lệch hợp đồng</span><span class="v">Mã và hợp đồng đã công bố không còn khớp nhau.</span></div>
  <div class="kv"><span class="k">ADR</span><span class="v">Bản ghi quyết định kiến trúc: bối cảnh, quyết định, hệ quả của một lựa chọn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sơ đồ module từ container: 55 cạnh thô vì @Global, 7 cạnh thật; không ai import BookingsModule.</li>
<li>Lưu thứ dễ ràng buộc (số phút + CHECK), trả thứ người dùng đọc ("07:00").</li>
<li>Sinh hợp đồng làm lộ schema phản hồi rỗng từ mốc 4 — do đuôi tên tệp của plugin.</li>
<li>CI sinh lại và so openapi.json; lộ thêm một trường ⇒ mã thoát 1.</li>
<li>Sáu ADR, mỗi cái kèm lý do đo được.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
