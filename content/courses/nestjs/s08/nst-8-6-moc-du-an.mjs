/**
 * 8.6 — Mốc dự án 8: test bắt được lỗi thật của dự án (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Nest 12.6.0, Prisma 7.10.1, Vitest 4.1.12 + @vitest/coverage-v8, PostgreSQL 16.16): scratchpad/nst/lab/c8/moc8 =
 * lab-booking mốc 8. Test theo đặc tả (dac-ta.e2e.spec) đỏ 2/6 trên mã mốc 7: note 300 ký tự ⇒ 500 (DTO 300, cột VARCHAR(200)); huỷ lúc 08:00 lịch
 * 07:30 ⇒ 200 (đề 0.2: chỉ trước giờ bắt đầu). Sửa: migration ghi_chu_300 + policy started; 6/6 xanh. Vitest projects unit (16 test, không DB,
 * 0,7 s) / db; tổng 51 test 5,2 s; độ phủ 93,01% dòng, ngưỡng 90 ⇒ mã 0, ngưỡng 95 ⇒ mã 1; dot-bien 8/8. Thăm dò: lịch 6 tháng ⇒ 201 (hỏi BA).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Đề dự án và thang điểm', sub: 'Đề lab-booking — nguồn của mọi test theo đặc tả trong mốc này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-1-4-ham-thuan', title: 'Testing 1.4 — Phân vùng, giá trị biên, bảng quyết định', sub: 'Kỹ thuật chọn ca 200/300/301 — bài này áp vào API thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-9-3-bat-buoc', title: 'Testing 9.3 — Test bắt buộc trên CI', sub: 'Biến test:unit/test:db thành cổng chặn merge — làm tiếp ở Chương 11.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-7-moc-du-an', title: 'NestJS 7.7 — Mốc dự án 7', sub: 'Điểm xuất phát của mốc này: tài khoản, vai trò, CASL.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Vitest — Test projects', 'Nhiều project trong một cấu hình: unit và db chạy riêng hoặc cùng nhau.', 'https://vitest.dev/guide/projects'),
  nguon('📘', 'Vitest — Coverage thresholds', 'coverage.thresholds: dưới ngưỡng thì lần chạy thoát mã 1.', 'https://vitest.dev/config/#coverage-thresholds'),
  nguon('📘', 'PostgreSQL 16 — Character types', 'VARCHAR(n) từ chối chuỗi dài hơn n: "value too long for type character varying".', 'https://www.postgresql.org/docs/16/datatype-character.html'),
].join('\n');
const OUT_DO = " ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 0 ký tự ⇒ 201 65ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 200 ký tự ⇒ 201 11ms\n × src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 300 ký tự ⇒ 201 18ms\n   → expected { n: 300, status: 500 } to deeply equal { n: 300, status: 201 }\n ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 301 ký tự ⇒ 400 13ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > trước giờ bắt đầu ⇒ huỷ được 30ms\n × src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > đã bắt đầu (07:30, bây giờ 08:00) ⇒ không huỷ được 16ms\n   → expected { status: 200, detail: undefined } to deeply equal { status: 403, …(1) }\n      Tests  2 failed | 4 passed (6)";
const MA_DACTA = "// dac-ta.e2e.spec.ts — mốc 8: mỗi test là MỘT câu trong đề (bài 0.2) hoặc một giới hạn đã công bố (DTO, OpenAPI)\nimport request from 'supertest';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { taoApp } from '../test/tao-app.js';\nimport { bearer } from '../test/auth.js';\n\nlet bayGio = new Date('2026-12-01T00:00:00Z');\nlet app: NestExpressApplication;\nbeforeAll(async () => { app = await taoApp({ now: () => bayGio }); });   // đồng hồ đọc biến bayGio ⇒ test tua giờ được\nafterAll(() => app.close());\nconst http = () => request(app.getHttpServer());\nconst dat = (ngay: string, them: object = {}) => http().post('/bookings').set(bearer(app, 'an'))\n  .send({ roomId: 1, start: `2027-02-${ngay}T07:30:00+07:00`, end: `2027-02-${ngay}T09:30:00+07:00`, attendees: 5, ...them });\n\ndescribe('ghi chú: DTO công bố tối đa 300 ký tự', () => {\n  it.each([[0, 201], [200, 201], [300, 201], [301, 400]])('note %i ký tự ⇒ %i', async (n, ma) => {\n    const r = await dat(String(10 + (n % 17)).padStart(2, '0'), { note: 'x'.repeat(n) });\n    expect({ n, status: r.status }).toEqual({ n, status: ma });\n  });\n});\n\ndescribe('đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\"', () => {\n  it('trước giờ bắt đầu ⇒ huỷ được', async () => {\n    const id = (await dat('03').expect(201)).body.id;\n    await http().delete(`/bookings/${id}`).set(bearer(app, 'an')).expect(200);\n  });\n  it('đã bắt đầu (07:30, bây giờ 08:00) ⇒ không huỷ được', async () => {\n    const id = (await dat('04').expect(201)).body.id;\n    bayGio = new Date('2027-02-04T08:00:00+07:00');\n    const r = await http().delete(`/bookings/${id}`).set(bearer(app, 'an'));\n    bayGio = new Date('2026-12-01T00:00:00Z');\n    expect({ status: r.status, detail: r.body.detail }).toEqual({ status: 403, detail: 'Lịch đã bắt đầu' });\n  });\n});";
const MA_POL = "// booking.policy.ts — luật theo TỪNG lịch (CASL, bài 7.4). Hàm thuần: test không cần HTTP/DB\nimport { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';\nimport type { CurrentUserT } from './decorators.js';\n\nexport type BookingSubject = { userId: number | null; roomId: number; status: string; managerId: number | null; started: boolean };\nexport type Act = 'read' | 'cancel' | 'approve' | 'reject';\nexport type BookingAbility = MongoAbility<[Act | 'manage', 'Booking' | (BookingSubject & { __caslSubjectType__?: 'Booking' })]>;\n\nexport function bookingAbility(u: CurrentUserT): BookingAbility {\n  const { can, cannot, build } = new AbilityBuilder<BookingAbility>(createMongoAbility);\n  if (u.role === 'ADMIN') can('manage', 'Booking');\n  can('read', 'Booking', { userId: u.id });\n  can('cancel', 'Booking', { userId: u.id, status: { $in: ['PENDING', 'APPROVED'] } });\n  if (u.role === 'LECTURER') {\n    can('read', 'Booking', { managerId: u.id });\n    can(['approve', 'reject'], 'Booking', { managerId: u.id, status: 'PENDING' });\n  }\n  cannot(['cancel', 'approve', 'reject'], 'Booking', { status: { $in: ['CANCELLED', 'REJECTED'] } }).because('Lịch đã kết thúc');\n  // mốc 8 — đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" (admin vẫn huỷ được, ví dụ phòng hỏng giữa buổi)\n  if (u.role !== 'ADMIN') cannot('cancel', 'Booking', { started: true }).because('Lịch đã bắt đầu');\n  return build();\n}";
const MA_KIEM = "  private async kiem(u: CurrentUserT, id: number, act: Act) {\n    const b = await this.db.booking.findUnique({ where: { id }, include: { room: { select: { managerId: true } } } });\n    if (!b) throw new NotFoundException(`không có lịch ${id}`, { errorCode: 'BOOKING_NOT_FOUND' });\n    const a = bookingAbility(u), sub = subject('Booking', { userId: b.userId, roomId: b.roomId, status: b.status, managerId: b.room.managerId, started: b.start <= this.clock.now() });\n    if (!a.can('read', sub)) throw new NotFoundException(`không có lịch ${id}`, { errorCode: 'BOOKING_NOT_FOUND' });\n    if (act !== 'read' && !a.can(act, sub)) throw new ForbiddenException(a.relevantRuleFor(act, sub)?.reason ?? `không được ${act} lịch này`, { errorCode: 'FORBIDDEN' });\n    return b;\n  }";
const OUT_MIG = "$ npx prisma migrate dev --name ghi_chu_300\n◇ injected env (0) from .env\nLoaded Prisma config from prisma.config.ts.\nPrisma schema loaded from prisma/schema.prisma.\nDatasource \"db\": PostgreSQL database \"moc8\", schema \"public\" at \"127.0.0.1:41601\"\nApplying migration `20261124011541_ghi_chu_300`\nThe following migration(s) have been created and applied from new schema changes:\nprisma/migrations/\n  └─ 20261124011541_ghi_chu_300/\n    └─ migration.sql\nYour database is now in sync with your schema.";
const MA_SQL = "-- AlterTable\nALTER TABLE \"bookings\" ALTER COLUMN \"note\" SET DATA TYPE VARCHAR(300);";
const OUT_XANH = " ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 0 ký tự ⇒ 201 74ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 200 ký tự ⇒ 201 14ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 300 ký tự ⇒ 201 10ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > ghi chú: DTO công bố tối đa 300 ký tự > note 301 ký tự ⇒ 400 9ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > trước giờ bắt đầu ⇒ huỷ được 35ms\n ✓ src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > đã bắt đầu (07:30, bây giờ 08:00) ⇒ không huỷ được 20ms\n      Tests  6 passed (6)";
const MA_VC = "import { defineConfig } from 'vitest/config';\n\n// mốc 8: hai project — `unit` không cần gì ngoài Node (chạy mỗi lần lưu tệp), `db` cần PostgreSQL (CI, trước khi push)\nconst env = { LOG_LEVEL: 'silent', JWT_SECRET: 'khoa-chi-dung-cho-test-dai-hon-32-ky-tu', DB_POOL: '10' };\nexport default defineConfig({\n  resolve: { tsconfigPaths: true },\n  test: {\n    globals: true,\n    root: './',\n    projects: [\n      { extends: true, test: { name: 'unit', include: ['src/**/*.spec.ts'], exclude: ['src/**/*.e2e.spec.ts', 'src/**/*.db.spec.ts', 'src/thu/**', '**/node_modules/**'], env } },\n      {\n        extends: true,\n        test: {\n          name: 'db', include: ['src/**/*.e2e.spec.ts', 'src/**/*.db.spec.ts'], exclude: ['src/thu/**', '**/node_modules/**'], env,\n          globalSetup: ['src/test/global-setup.ts'],   // migrate DB mẫu + nhân bản <db>_w1…N\n          setupFiles: ['src/test/db-reset.ts'],         // DATABASE_URL theo worker + dữ liệu mẫu\n        },\n      },\n    ],\n    coverage: {\n      include: ['src/**/*.ts'], exclude: ['src/generated/**', 'src/test/**', 'src/thu/**', '**/*.spec.ts', 'src/main.ts', 'src/seed.ts'],\n      thresholds: { lines: 90, branches: 75 },     // sàn chống tụt, KHÔNG phải mục tiêu (bài 8.6)\n    },\n  },\n});";
const OUT_UNIT = "$ unset DATABASE_URL_TEST; npm run test:unit\n RUN  v4.1.12 /home/sv/app\n Test Files  3 passed (3)\n      Tests  16 passed (16)\n   Start at  08:16:59\n   Duration  711ms (transform 173ms, setup 0ms, import 818ms, tests 101ms, environment 0ms)\n\n$ DATABASE_URL_TEST=postgresql://nst:nst@127.0.0.1:41601/moc8_test npm test\n RUN  v4.1.12 /home/sv/app\n Test Files  11 passed (11)\n      Tests  51 passed (51)\n   Start at  08:17:00\n   Duration  5.22s (transform 2.10s, setup 6.83s, import 9.60s, tests 9.33s, environment 2ms)";
const OUT_COV = "$ npm run test:cov\n      Tests  51 passed (51)\nFile               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s\nAll files          |   90.59 |    76.72 |   90.78 |   93.01 |\n  ...ing.policy.ts |   91.66 |    66.66 |     100 |     100 | 11,20\n  perm.guard.ts    |     100 |       90 |     100 |     100 | 7\n  ...gs.service.ts |   89.74 |    79.16 |     100 |   96.29 | 28\n  rooms.service.ts |      76 |       50 |    87.5 |      75 | 9,23,29,36\n[mã thoát 0]\n\n$ npx vitest run --coverage --coverage.thresholds.lines=95\n      Tests  51 passed (51)\nERROR: Coverage for lines (93.01%) does not meet global threshold (95%)\n[mã thoát 1]";
const OUT_DB = "$ npm run test:dot-bien\nmã gốc: Tests  51 passed (51)\nM1 BẮT ✔  cho đặt lịch bắt đầu ĐÚNG lúc này          Tests  1 failed | 50 passed (51)\nM2 BẮT ✔  đủ 30/30 chỗ cũng bị từ chối               Tests  1 failed | 50 passed (51)\nM3 BẮT ✔  lịch bị từ chối vẫn hiện là \"bận\"          Tests  1 failed | 50 passed (51)\nM4 BẮT ✔  mất khoá lạc quan (hai người cùng duyệt)   Tests  1 failed | 50 passed (51)\nM5 BẮT ✔  route quên khai quyền thì MỞ               Tests  1 failed | 50 passed (51)\nM6 BẮT ✔  duyệt lại lịch đã duyệt/đã từ chối         Tests  1 failed | 50 passed (51)\nM7 BẮT ✔  lỗi 500 lộ thông điệp gốc                  Tests  1 failed | 50 passed (51)\nM8 BẮT ✔  đăng nhập phân biệt hoa/thường email       Tests  1 failed | 50 passed (51)\n— bắt 8/8 đột biến";
const MA_SCRIPTS = "{\n  \"test\": \"vitest run\",\n  \"test:watch\": \"vitest --project unit\",\n  \"test:cov\": \"vitest run --coverage\",\n  \"test:debug\": \"vitest --inspect-brk --no-file-parallelism\",\n  \"test:unit\": \"vitest run --project unit\",\n  \"test:db\": \"vitest run --project db\",\n  \"test:dot-bien\": \"python3 ../lab85/dot-bien.py\"\n}";

export default {
  title: '8.6 — Project milestone 8: tests that catch real bugs in the project|||8.6 — Mốc dự án 8: test bắt được lỗi thật của dự án',
  slug: 'nst-8-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc 8 của lab-booking: viết test từ ĐỀ và từ hợp đồng đã công bố, không từ mã — và chúng tìm ra hai lỗi thật đang nằm trong dự án từ các mốc trước: ghi chú 201–300 ký tự trả 500 (DTO cho 300, cột DB chỉ 200), và sinh viên huỷ được lịch đã bắt đầu (đề nói chỉ trước giờ bắt đầu). Sửa bằng migration và một luật CASL; tách bộ test thành project unit (không DB, 0,7 s) và db; đặt ngưỡng độ phủ làm sàn; 51 test, 8/8 đột biến.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Project milestone 8</span>
<h2>8.6 — Milestone 8: let the brief write the tests</h2>
<p class="lead">Up to mốc 7 every test was written by the person who wrote the code, right after writing it — so the tests check what the code does. This milestone writes tests from two other sources: the <strong>brief</strong> (lesson 0.2) and the <strong>published contract</strong> (DTO limits, which OpenAPI shows to the frontend). Both found real bugs that had been in the project for several milestones. Then the suite is organised so it can grow: unit and DB projects, a coverage floor, the mutation check from lab 8.5.</p>

<h3>What changes</h3>
<table>
<tr><th>Area</th><th>Mốc 7</th><th>Mốc 8</th></tr>
<tr><td>App setup in tests</td><td><code>createNestApplication()</code> without main.ts settings</td><td><code>taoApp()</code> + <code>cauHinhApp()</code> shared with main.ts (8.3)</td></tr>
<tr><td>Global guards</td><td><code>APP_GUARD useClass</code></td><td><code>useExisting</code> — replaceable in tests (8.2)</td></tr>
<tr><td>Test database</td><td>one DB, files run serially, 8.71 s</td><td>one DB per worker (TEMPLATE), parallel (8.3)</td></tr>
<tr><td>Suites</td><td>one</td><td><code>unit</code> (no DB) and <code>db</code> projects</td></tr>
<tr><td>Tests</td><td>31</td><td>51 (+14 from lab 8.5, +6 from the brief)</td></tr>
<tr><td>Bugs</td><td>2 unknown</td><td>2 found and fixed</td></tr>
</table>

<h3>1. Tests from the brief and the contract</h3>
<p>Two sentences to test. From the DTO (<code>@Length(0, 300)</code> on <code>note</code>, shown in <code>/docs</code>): "a note of up to 300 characters is accepted". From the brief: "the person who booked may <strong>cancel before the start time</strong>". Boundary values for the first (0, 200, 300, 301), both sides of the start for the second:</p>
<pre><code class="language-ts">${esc(MA_DACTA)}</code></pre>
<p>Run against the mốc 7 code:</p>
<div class="out">${esc(OUT_DO)}</div>

<h3>2. Bug 1 — the contract says 300, the column says 200</h3>
<p>The DTO has allowed 300 characters since mốc 4; in mốc 6 the Prisma schema got <code>@db.VarChar(200)</code>. PostgreSQL rejects 201+ characters, the filter turns it into a generic 500. Nobody noticed because every test used short notes. Which side is right? The DTO is a <em>published</em> contract — the frontend's maxLength already says 300 — so the database follows it:</p>
<div class="out">${esc(OUT_MIG)}</div>
<pre><code class="language-sql">${esc(MA_SQL)}</code></pre>
<p>Widening a VARCHAR is safe for existing rows. The opposite decision (shrink the DTO to 200) would be a breaking change for clients and would need a version note.</p>

<h3>3. Bug 2 — cancelling a booking that has already started</h3>
<p>The CASL policy of mốc 7 allowed the owner to cancel any <code>PENDING</code> or <code>APPROVED</code> booking, at any time. The brief says "before the start". The rule depends on the clock, so the service computes <code>started</code> with the injected <code>Clock</code> and the policy stays a pure function:</p>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<pre><code class="language-ts">${esc(MA_KIEM)}</code></pre>
<p>Admins keep the right to cancel (a room breaks down mid-session); that is a decision, written in the comment, not an accident. After both fixes:</p>
<div class="out">${esc(OUT_XANH)}</div>

<h3>A question, not a fix</h3>
<p>While probing the brief, a booking from 1 February to 1 August 2027 — six months of one room — was accepted (real run: 201 PENDING). The brief does not say how long a booking may be. Do not invent a rule in code; ask: "maximum duration?". On a real project this goes to the BA or the customer, and the answer becomes a test. Write the question in the README under "Open questions".</p>

<h3>4. Organising the suite: unit and db projects</h3>
<pre><code class="language-ts">${esc(MA_VC)}</code></pre>
<pre><code class="language-json">${esc(MA_SCRIPTS)}</code></pre>
<div class="out">${esc(OUT_UNIT)}</div>
<ul>
<li><code>npm run test:unit</code> runs with no database at all (the variable is unset) in 0.7 s — fast enough to run on every save (<code>test:watch</code>).</li>
<li>The DB-backed service test was renamed <code>bookings.service.db.spec.ts</code>: the file name now tells which project it belongs to.</li>
<li>All 51 tests, in parallel with one database per worker: 5.2 s.</li>
</ul>

<h3>5. Coverage as a floor, not a target</h3>
<div class="out">${esc(OUT_COV)}</div>
<p>The threshold (lines 90, branches 75) is set just under today's numbers: it stops a PR that adds untested code, and nobody is pushed to write tests for <code>rooms.service.ts</code> getters just to climb. Lab 8.5 showed why the number itself is not the goal. The mutation check stays in the toolbox:</p>
<div class="out">${esc(OUT_DB)}</div>

<h3>Self-assessment (10 points toward the project rubric)</h3>
<table>
<tr><th>Criterion</th><th>Points</th></tr>
<tr><td>At least 4 tests written from the brief/contract, with names quoting the sentence</td><td>2</td></tr>
<tr><td>At least one real bug found by those tests, fixed, with the red output kept in the PR</td><td>2</td></tr>
<tr><td>e2e app built with the same setup function as main.ts; global guards replaceable</td><td>2</td></tr>
<tr><td>Unit project runs without a database; DB tests parallel and isolated</td><td>2</td></tr>
<tr><td>Coverage floor + a mutation check (script or Stryker) with ≥ 6/8 caught</td><td>2</td></tr>
</table>
<p>For your own project topic: pick the two sentences of your brief that would hurt most if broken, write their boundary tests first, and report what you found — "no bug" is a valid result if the tests were red at least once.</p>

<h3>README section</h3>
<pre><code class="language-md">## Tests
- npm run test:unit   — rules, guards, policies; no database (≈ 0.7 s)
- npm run test:db     — e2e + DB tests; needs DATABASE_URL_TEST (a test DB, never dev)
- npm run test:cov    — fails under 90% lines / 75% branches
- npm run test:dot-bien — 8 planted bugs must all be caught

## Open questions
- Maximum booking duration? (6 months is accepted today)</code></pre>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Mốc dự án 8</span>
<h2>8.6 — Mốc 8: để đề bài viết test</h2>
<p class="lead">Tới mốc 7, mọi test đều do chính người viết mã viết, ngay sau khi viết mã — nên test kiểm đúng điều mã đang làm. Mốc này viết test từ hai nguồn khác: <strong>đề bài</strong> (bài 0.2) và <strong>hợp đồng đã công bố</strong> (giới hạn trong DTO, thứ OpenAPI đưa cho frontend). Cả hai đều tìm ra lỗi thật đã nằm trong dự án qua mấy mốc. Sau đó bộ test được sắp xếp để còn lớn tiếp được: project unit và db, sàn độ phủ, phép kiểm đột biến của lab 8.5.</p>

<h3>Những gì thay đổi</h3>
<table>
<tr><th>Phần</th><th>Mốc 7</th><th>Mốc 8</th></tr>
<tr><td>Dựng ứng dụng trong test</td><td><code>createNestApplication()</code> thiếu cấu hình của main.ts</td><td><code>taoApp()</code> + <code>cauHinhApp()</code> dùng chung với main.ts (8.3)</td></tr>
<tr><td>Guard toàn cục</td><td><code>APP_GUARD useClass</code></td><td><code>useExisting</code> — test thay được (8.2)</td></tr>
<tr><td>DB test</td><td>một DB, các tệp chạy lần lượt, 8,71 s</td><td>mỗi worker một DB (TEMPLATE), chạy song song (8.3)</td></tr>
<tr><td>Bộ test</td><td>một</td><td>hai project <code>unit</code> (không DB) và <code>db</code></td></tr>
<tr><td>Số test</td><td>31</td><td>51 (+14 từ lab 8.5, +6 từ đề bài)</td></tr>
<tr><td>Lỗi</td><td>2 chưa ai biết</td><td>2 đã tìm ra và sửa</td></tr>
</table>

<h3>1. Test từ đề bài và hợp đồng</h3>
<p>Hai câu cần test. Từ DTO (<code>@Length(0, 300)</code> ở <code>note</code>, hiện trong <code>/docs</code>): "ghi chú tối đa 300 ký tự được nhận". Từ đề: "người đặt được <strong>huỷ trước giờ bắt đầu</strong>". Giá trị biên cho câu đầu (0, 200, 300, 301), hai phía của giờ bắt đầu cho câu sau:</p>
<pre><code class="language-ts">${esc(MA_DACTA)}</code></pre>
<p>Chạy trên mã của mốc 7:</p>
<div class="out">${esc(OUT_DO)}</div>

<h3>2. Lỗi 1 — hợp đồng nói 300, cột nói 200</h3>
<p>DTO cho phép 300 ký tự từ mốc 4; tới mốc 6 schema Prisma có <code>@db.VarChar(200)</code>. PostgreSQL từ chối từ ký tự thứ 201, filter biến nó thành một lỗi 500 chung chung. Không ai thấy vì mọi test đều dùng ghi chú ngắn. Bên nào đúng? DTO là hợp đồng <em>đã công bố</em> — maxLength phía frontend đã ghi 300 — nên DB đi theo nó:</p>
<div class="out">${esc(OUT_MIG)}</div>
<pre><code class="language-sql">${esc(MA_SQL)}</code></pre>
<p>Nới VARCHAR an toàn với dữ liệu cũ. Quyết định ngược lại (thu DTO về 200) là thay đổi phá vỡ phía client và cần ghi chú phiên bản.</p>

<h3>3. Lỗi 2 — huỷ một lịch đã bắt đầu</h3>
<p>Policy CASL của mốc 7 cho chủ lịch huỷ mọi lịch <code>PENDING</code> hay <code>APPROVED</code>, lúc nào cũng được. Đề nói "trước giờ bắt đầu". Luật này phụ thuộc đồng hồ, nên service tính <code>started</code> bằng <code>Clock</code> được tiêm và policy vẫn là hàm thuần:</p>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<pre><code class="language-ts">${esc(MA_KIEM)}</code></pre>
<p>Admin vẫn giữ quyền huỷ (phòng hỏng giữa buổi); đó là một quyết định, ghi trong chú thích, không phải tình cờ. Sau hai lần sửa:</p>
<div class="out">${esc(OUT_XANH)}</div>

<h3>Một câu hỏi, không phải một bản sửa</h3>
<p>Trong lúc dò đề, một lịch từ 01/02 tới 01/08/2027 — giữ một phòng sáu tháng — vẫn được nhận (chạy thật: 201 PENDING). Đề không nói một lịch dài tối đa bao lâu. Đừng tự bịa luật trong mã; hãy hỏi: "thời lượng tối đa?". Ở dự án thật, câu này gửi cho BA hoặc khách hàng, và câu trả lời trở thành một test. Ghi câu hỏi vào README ở mục "Câu hỏi mở".</p>

<h3>4. Sắp xếp bộ test: project unit và db</h3>
<pre><code class="language-ts">${esc(MA_VC)}</code></pre>
<pre><code class="language-json">${esc(MA_SCRIPTS)}</code></pre>
<div class="out">${esc(OUT_UNIT)}</div>
<ul>
<li><code>npm run test:unit</code> chạy không cần DB nào (biến đã bị bỏ) trong 0,7 s — đủ nhanh để chạy mỗi lần lưu tệp (<code>test:watch</code>).</li>
<li>Test service dùng DB được đổi tên thành <code>bookings.service.db.spec.ts</code>: tên tệp giờ nói luôn nó thuộc project nào.</li>
<li>Cả 51 test, chạy song song, mỗi worker một DB: 5,2 s.</li>
</ul>

<h3>5. Độ phủ là sàn, không phải đích</h3>
<div class="out">${esc(OUT_COV)}</div>
<p>Ngưỡng (dòng 90, nhánh 75) đặt ngay dưới con số hôm nay: nó chặn PR thêm mã chưa test, và không ai bị ép viết test cho mấy hàm lặt vặt của <code>rooms.service.ts</code> chỉ để leo số. Lab 8.5 đã cho thấy vì sao con số tự nó không phải mục tiêu. Phép kiểm đột biến vẫn giữ trong hộp đồ nghề:</p>
<div class="out">${esc(OUT_DB)}</div>

<h3>Tự chấm (10 điểm trong thang điểm dự án)</h3>
<table>
<tr><th>Tiêu chí</th><th>Điểm</th></tr>
<tr><td>Ít nhất 4 test viết từ đề/hợp đồng, tên test trích đúng câu</td><td>2</td></tr>
<tr><td>Ít nhất một lỗi thật do các test đó tìm ra, đã sửa, giữ output đỏ trong PR</td><td>2</td></tr>
<tr><td>Ứng dụng e2e dựng bằng cùng hàm setup với main.ts; guard toàn cục thay được</td><td>2</td></tr>
<tr><td>Project unit chạy không cần DB; test DB chạy song song và cô lập</td><td>2</td></tr>
<tr><td>Sàn độ phủ + một phép kiểm đột biến (script hoặc Stryker) bắt ≥ 6/8</td><td>2</td></tr>
</table>
<p>Với đề tài của riêng bạn: chọn hai câu trong đề mà hỏng thì đau nhất, viết test biên cho chúng trước, rồi báo cáo điều tìm thấy — "không có lỗi" cũng là kết quả hợp lệ nếu các test đã đỏ ít nhất một lần.</p>

<h3>Mục README</h3>
<pre><code class="language-md">## Test
- npm run test:unit   — luật, guard, policy; không cần DB (≈ 0,7 s)
- npm run test:db     — e2e + test DB; cần DATABASE_URL_TEST (DB test, không bao giờ là DB dev)
- npm run test:cov    — đỏ nếu dưới 90% dòng / 75% nhánh
- npm run test:dot-bien — 8 lỗi cài sẵn phải bị bắt hết

## Câu hỏi mở
- Một lịch dài tối đa bao lâu? (hiện nhận cả 6 tháng)</code></pre>
${THE}
${NGUON}
</div>
`,
};
