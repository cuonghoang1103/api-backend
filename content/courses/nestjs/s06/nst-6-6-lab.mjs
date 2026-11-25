/**
 * 6.6 — Lab: Lưu đặt phòng chịu được request đồng thời (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Prisma 7.10.1, Nest 12.6.0, Vitest 4.1.12, supertest, PostgreSQL 16.16 DB lab66 sau prisma migrate deploy):
 * lab66/bookings.e2e.spec.ts 5 test. Lần đầu: filter @Catch() "throw e" cho lỗi không phải của nó ⇒ 409 STALE_VERSION ra text/html
 * của Express kèm stack (ConflictException … at BookingsService.doiTrangThai (/home/sv/app/src/lab66/bookings.ts:27:28)) ⇒ sửa bằng
 * BaseExceptionFilter + super.catch ⇒ 5/5 xanh. Thử phá: DROP CONSTRAINT Booking_khong_trung ⇒ test 50 request đỏ "got 50".
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-6-5-chong-dat-trung', title: 'NestJS 6.5 — Không đặt trùng', sub: 'Vì sao lab này dựa vào exclusion constraint thay vì kiểm trước.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-6-thu-tu', title: 'NestJS 3.6 — Thứ tự của dây chuyền', sub: 'Filter nào chạy, và vì sao chỉ một filter xử lý một lỗi.', cta: 'Mở bài →' }),
].join('\n');
const MA_FILTER = "// booking-conflict.filter.ts — mọi kiểu \"đụng nhau\" từ DB thành 409; thứ khác giao lại cho bộ lọc gốc của Nest\nimport { ArgumentsHost, Catch } from '@nestjs/common';\nimport { BaseExceptionFilter } from '@nestjs/core';\nimport type { Response } from 'express';\n\nconst goc = (e: any): string | undefined => e?.meta?.driverAdapterError?.cause?.originalCode ?? e?.cause?.originalCode;\nexport const laDungLich = (e: any) => goc(e) === '23P01';                                   // exclusion constraint\nexport const laXungDotGhi = (e: any) => e?.code === 'P2034' || e?.cause?.kind === 'TransactionWriteConflict' || e?.message === 'TransactionWriteConflict';\n\n@Catch()\nexport class BookingConflictFilter extends BaseExceptionFilter {\n  catch(e: any, host: ArgumentsHost) {\n    if (!laDungLich(e) && !laXungDotGhi(e)) return super.catch(e, host);   // ⚠ KHÔNG \"throw e\": ném lại trong filter là rơi khỏi Nest\n    host.switchToHttp().getResponse<Response>().status(409).type('application/problem+json')\n      .json({ status: 409, code: 'BOOKING_CONFLICT', title: 'Khung giờ đã có người đặt' });\n  }\n}";
const MA_SAI = "@Catch()\nexport class BookingConflictFilter implements ExceptionFilter {\n  catch(e: any, host: ArgumentsHost) {\n    if (!laDungLich(e) && !laXungDotGhi(e)) throw e;                    // không phải việc của filter này ⇒ để filter sau xử lý\n    host.switchToHttp().getResponse<Response>().status(409).type('application/problem+json')\n      .json({ status: 409, code: 'BOOKING_CONFLICT', title: 'Khung giờ đã có người đặt' });\n  }\n}";
const MA_BK = "// bookings.ts — lab 6.6: controller + service + module (đặt, duyệt có version)\nimport { Body, ConflictException, Controller, Injectable, Module, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';\nimport { Type } from 'class-transformer';\nimport { IsIn, IsInt, IsISO8601, IsString, Min } from 'class-validator';\nimport { PrismaService } from '../prisma/prisma.service.js';\n\nexport class CreateBookingDto {\n  @IsInt() roomId: number;\n  @IsString() studentId: string;\n  @IsISO8601({ strict: true }) start: string;\n  @IsISO8601({ strict: true }) end: string;\n}\nexport class DoiTrangThaiDto {\n  @IsIn(['APPROVED', 'REJECTED']) status: 'APPROVED' | 'REJECTED';\n  @Type(() => Number) @IsInt() @Min(1) version: number;\n}\n\n@Injectable()\nexport class BookingsService {\n  constructor(private readonly db: PrismaService) {}\n  create(b: CreateBookingDto) {                                    // không kiểm trước: ràng buộc EXCLUDE là người gác cổng duy nhất\n    return this.db.booking.create({ data: { roomId: b.roomId, studentId: b.studentId, start: new Date(b.start), end: new Date(b.end) },\n      select: { id: true, roomId: true, start: true, end: true, status: true, version: true } });\n  }\n  async doiTrangThai(id: number, d: DoiTrangThaiDto) {\n    const { count } = await this.db.booking.updateMany({ where: { id, version: d.version, status: 'PENDING' }, data: { status: d.status, version: { increment: 1 } } });\n    if (count === 0) throw new ConflictException({ status: 409, code: 'STALE_VERSION', title: 'Booking đã đổi — tải lại' });\n    return this.db.booking.findUniqueOrThrow({ where: { id }, select: { id: true, status: true, version: true } });\n  }\n}\n@Controller('bookings')\nexport class BookingsController {\n  constructor(private readonly s: BookingsService) {}\n  @Post() create(@Body() b: CreateBookingDto) { return this.s.create(b); }\n  @Patch(':id/status') doi(@Param('id', ParseIntPipe) id: number, @Body() d: DoiTrangThaiDto) { return this.s.doiTrangThai(id, d); }\n}\n@Module({ controllers: [BookingsController], providers: [BookingsService] })\nexport class BookingsModule {}";
const MA_SPEC = "// bookings.e2e.spec.ts — PostgreSQL THẬT (DATABASE_URL trỏ DB test lab66, đã prisma migrate deploy)\nimport { INestApplication, ValidationPipe } from '@nestjs/common';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { PrismaModule } from '../prisma/prisma.module.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport { BookingConflictFilter } from './booking-conflict.filter.js';\nimport { BookingsModule } from './bookings.js';\n\nlet app: INestApplication, db: PrismaService;\nconst don = (sv: string, start = '2027-01-05T07:30:00+07:00', end = '2027-01-05T09:30:00+07:00') => ({ roomId: 1, studentId: sv, start, end });\n\nbeforeAll(async () => {\n  const m = await Test.createTestingModule({ imports: [PrismaModule, BookingsModule] }).compile();\n  app = m.createNestApplication({ logger: false });\n  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));\n  // một filter bắt-tất-cả, tự lo 409 lịch trùng, phần còn lại giao BaseExceptionFilter (cần HttpAdapterHost)\n  app.useGlobalFilters(new BookingConflictFilter(app.getHttpAdapter()));\n  await app.init();\n  db = app.get(PrismaService);\n});\nbeforeEach(async () => {\n  await db.$executeRaw`TRUNCATE \"AuditLog\", \"Booking\", \"Room\" RESTART IDENTITY CASCADE`;\n  await db.room.create({ data: { code: 'AL-301', capacity: 30 } });\n});\nafterAll(() => app.close());\n\nit('50 request đồng thời cùng khung giờ ⇒ đúng 1 × 201, 49 × 409', async () => {\n  const srv = app.getHttpServer();\n  const ma = await Promise.all(Array.from({ length: 50 }, (_, i) => request(srv).post('/bookings').send(don(`SE1700${i}`)).then((r) => r.status)));\n  expect(ma.filter((m) => m === 201)).toHaveLength(1);\n  expect(ma.filter((m) => m === 409)).toHaveLength(49);\n  expect(await db.booking.count()).toBe(1);\n});\nit('chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201', async () => {\n  await request(app.getHttpServer()).post('/bookings').send(don('SE1')).expect(201);\n  await request(app.getHttpServer()).post('/bookings').send(don('SE2', '2027-01-05T09:30:00+07:00', '2027-01-05T11:00:00+07:00')).expect(201);\n});\nit('booking bị từ chối nhả khung giờ', async () => {\n  const r = await request(app.getHttpServer()).post('/bookings').send(don('SE1')).expect(201);\n  await request(app.getHttpServer()).patch(`/bookings/${r.body.id}/status`).send({ status: 'REJECTED', version: 1 }).expect(200);\n  await request(app.getHttpServer()).post('/bookings').send(don('SE2')).expect(201);\n});\nit('hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION', async () => {\n  const r = await request(app.getHttpServer()).post('/bookings').send(don('SE1')).expect(201);\n  await request(app.getHttpServer()).patch(`/bookings/${r.body.id}/status`).send({ status: 'APPROVED', version: 1 }).expect(200);\n  const b = await request(app.getHttpServer()).patch(`/bookings/${r.body.id}/status`).send({ status: 'REJECTED', version: 1 }).expect(409);\n  expect(b.body.code).toBe('STALE_VERSION');\n});\nit('end trước start ⇒ CHECK của DB chặn, không lọt thành 201', async () => {\n  const r = await request(app.getHttpServer()).post('/bookings').send(don('SE1', '2027-01-05T09:30:00+07:00', '2027-01-05T07:30:00+07:00'));\n  expect(r.status).not.toBe(201);\n});";
const OUT_TEST = "$ DATABASE_URL=…/lab66 npx prisma migrate deploy\n2 migrations found in prisma/migrations\nApplying migration `20261123233726_init`\nApplying migration `20261123234723_khong_dat_trung`\nThe following migration(s) have been applied:\nmigrations/\n  └─ 20261123233726_init/\n    └─ migration.sql\n  └─ 20261123234723_khong_dat_trung/\n$ DATABASE_URL=…/lab66 npx vitest run src/lab66\n RUN  v4.1.12 /home/sv/app\n ✓ src/lab66/bookings.e2e.spec.ts > 50 request đồng thời cùng khung giờ ⇒ đúng 1 × 201, 49 × 409 243ms\n ✓ src/lab66/bookings.e2e.spec.ts > chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201 25ms\n ✓ src/lab66/bookings.e2e.spec.ts > booking bị từ chối nhả khung giờ 35ms\n × src/lab66/bookings.e2e.spec.ts > hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION 28ms\n   → expected undefined to be 'STALE_VERSION' // Object.is equality\n ✓ src/lab66/bookings.e2e.spec.ts > end trước start ⇒ CHECK của DB chặn, không lọt thành 201 18ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/lab66/bookings.e2e.spec.ts > hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION\nAssertionError: expected undefined to be 'STALE_VERSION' // Object.is equality\n- Expected:\n\"STALE_VERSION\"\n+ Received:\nundefined\n ❯ src/lab66/bookings.e2e.spec.ts:48:23\n     46|   await request(app.getHttpServer()).patch(`/bookings/${r.body.id}/sta…\n     47|   const b = await request(app.getHttpServer()).patch(`/bookings/${r.bo…\n     48|   expect(b.body.code).toBe('STALE_VERSION');\n       |                       ^\n     49| });\n     50| it('end trước start ⇒ CHECK của DB chặn, không lọt thành 201', async (…\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n Test Files  1 failed (1)\n      Tests  1 failed | 4 passed (5)";
const OUT_TEST2 = "$ DATABASE_URL=…/lab66 npx vitest run src/lab66\n RUN  v4.1.12 /home/sv/app\n ✓ src/lab66/bookings.e2e.spec.ts > 50 request đồng thời cùng khung giờ ⇒ đúng 1 × 201, 49 × 409 259ms\n ✓ src/lab66/bookings.e2e.spec.ts > chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201 27ms\n ✓ src/lab66/bookings.e2e.spec.ts > booking bị từ chối nhả khung giờ 37ms\n ✓ src/lab66/bookings.e2e.spec.ts > hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION 30ms\n ✓ src/lab66/bookings.e2e.spec.ts > end trước start ⇒ CHECK của DB chặn, không lọt thành 201 24ms\n Test Files  1 passed (1)\n      Tests  5 passed (5)";
const OUT_HTML = "BODY text/html; charset=utf-8 <!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"utf-8\"> <title>Error</title> </head> <body> <pre>ConflictException: Conflict Exception<br> &nbsp; &nbsp;at BookingsService.doiTrangThai (/home/sv/app/src/lab66/bookings.ts:27:28)<br> &nbsp; &nbsp;at process.pr";
const OUT_PHA = "$ psql -c 'ALTER TABLE \"Booking\" DROP CONSTRAINT \"Booking_khong_trung\"'   # thử phá\n$ npx vitest run src/lab66\n × src/lab66/bookings.e2e.spec.ts > 50 request đồng thời cùng khung giờ ⇒ đúng 1 × 201, 49 × 409 200ms\n   → expected [ 201, 201, 201, 201, 201, 201, …(44) ] to have a length of 1 but got 50\n ✓ src/lab66/bookings.e2e.spec.ts > chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201 28ms\n ✓ src/lab66/bookings.e2e.spec.ts > booking bị từ chối nhả khung giờ 44ms\n ✓ src/lab66/bookings.e2e.spec.ts > hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION 32ms\n ✓ src/lab66/bookings.e2e.spec.ts > end trước start ⇒ CHECK của DB chặn, không lọt thành 201 27ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 4 passed (5)";
const OUT_PHA2 = "$ (ràng buộc đổi '[)' thành '[]') npx vitest run src/lab66\n ✓ src/lab66/bookings.e2e.spec.ts > 50 request đồng thời cùng khung giờ ⇒ đúng 1 × 201, 49 × 409\n × src/lab66/bookings.e2e.spec.ts > chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201\n   → expected 201 \"Created\", got 409 \"Conflict\"\n ✓ src/lab66/bookings.e2e.spec.ts > booking bị từ chối nhả khung giờ\n ✓ src/lab66/bookings.e2e.spec.ts > hai người duyệt cùng version ⇒ người sau nhận 409 STALE_VERSION\n ✓ src/lab66/bookings.e2e.spec.ts > end trước start ⇒ CHECK của DB chặn, không lọt thành 201\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 4 passed (5)";

export default {
  title: '6.6 — Lab: Room booking storage that survives concurrent requests|||6.6 — Lab: Lưu đặt phòng chịu được request đồng thời',
  slug: 'nst-6-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab của Chương 6: API đặt phòng trên Prisma + PostgreSQL thật, đạt khi 50 request đồng thời cùng khung giờ cho đúng 1 × 201 và 49 × 409, đặt nối tiếp được, booking bị từ chối nhả khung giờ, hai người duyệt cùng version thì người sau nhận 409. Bộ test e2e 5 ca chạy trên DB test riêng. Có một lỗi thật gặp khi làm: filter bắt-tất-cả ném lại lỗi ⇒ Express trả trang HTML lộ stack trace.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>6.6 — Lab: bookings that hold under a rush</h2>
<p class="lead">Everything of the chapter in one small service: a PrismaService (6.1), errors mapped to HTTP (6.4), the exclusion constraint and the version column (6.5), and an end-to-end test suite that runs against a real PostgreSQL — the only kind of test that can catch a race.</p>

<h3>Requirements</h3>
<ol>
<li><code>POST /bookings</code> with <code>roomId, studentId, start, end</code> (ISO 8601). Validated by DTO.</li>
<li><code>PATCH /bookings/:id/status</code> with <code>status</code> (APPROVED/REJECTED) and the <code>version</code> the admin saw.</li>
<li>No "is it free?" query before inserting: the database constraint is the single source of truth.</li>
<li>All overlap errors from the database — whatever shape they come in — become <code>409 BOOKING_CONFLICT</code> as <code>application/problem+json</code>. All other errors keep Nest's normal handling.</li>
<li>Tests run against a separate database (<code>lab66</code>) migrated with <code>prisma migrate deploy</code>.</li>
</ol>

<h3>Pass criteria</h3>
<ul>
<li>50 concurrent requests for one slot ⇒ exactly 1 × 201 and 49 × 409, and exactly 1 row in the table.</li>
<li>7:30–9:30 then 9:30–11:00 ⇒ both 201.</li>
<li>A rejected booking frees its slot.</li>
<li>Two status changes with the same version ⇒ the second gets <code>409 STALE_VERSION</code>.</li>
<li><code>end</code> before <code>start</code> never becomes 201.</li>
</ul>

<h3>Hints</h3>
<ul>
<li>Migrations: reuse the two from Lesson 6.5 (init + <code>khong_dat_trung</code>); <code>DATABASE_URL=…/lab66 npx prisma migrate deploy</code>.</li>
<li>The original PostgreSQL code sits at <code>meta.driverAdapterError.cause.originalCode</code> (<code>23P01</code>); write conflicts may arrive without any <code>code</code>.</li>
<li>Use supertest against <code>app.getHttpServer()</code> and <code>Promise.all</code> for the 50 requests.</li>
</ul>

<details><summary>Show solution — service, controller, module</summary>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
</details>

<details><summary>Show solution — the filter (and the bug I hit first)</summary>
<p>My first version of the filter looked reasonable: catch everything, handle the overlap, rethrow the rest so other handlers deal with it.</p>
<pre><code class="language-ts">${esc(MA_SAI)}</code></pre>
<p>One test failed: the 409 status was right but <code>body.code</code> was <code>undefined</code>. Printing the response showed why:</p>
<div class="out">${esc(OUT_HTML)}</div>
<p>An exception thrown <em>inside</em> a filter is not passed to another Nest filter — it falls out of Nest into Express's default error handler, which renders an HTML page with the stack trace (in any environment where <code>NODE_ENV</code> is not <code>production</code>). File paths and line numbers to anyone who sends two PATCH requests. The fix is to extend <code>BaseExceptionFilter</code> and hand back with <code>super.catch()</code>:</p>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
</details>

<details><summary>Show solution — tests and the run</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST2)}</div>
</details>

<h3>Break it (10 min)</h3>
<p>Prove the test protects what you think it protects: drop the constraint and run again.</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>All 50 requests became bookings — the test failed loudly, at the right line, for the right reason. A test that stays green when you remove the thing it is supposed to guard is decoration. (Put the constraint back afterwards, or <code>migrate reset</code> the test database.)</p>
<p>Second break: make the range closed — <code>'[]'</code> instead of <code>'[)'</code> — and 9:30 now belongs to both bookings:</p>
<div class="out">${esc(OUT_PHA2)}</div>
<p>And one gap the suite leaves open on purpose: <code>end</code> before <code>start</code> is stopped by the database <code>CHECK</code>, but the client sees <code>500 {"statusCode":500,"message":"Internal server error"}</code> (measured). Add a DTO rule or map SQLSTATE <code>23514</code> to 400, then tighten the test to <code>expect(400)</code>.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you test a race condition?</strong> Many truly concurrent requests against a real database (warm connections, <code>Promise.all</code>), assert exact counts of results and rows; then remove the protection and check the test fails.</li>
<li><strong>Why an e2e test and not a unit test with a mocked repository?</strong> The guarantee lives in PostgreSQL; a mock can only confirm your assumptions about it.</li>
<li><strong>What happens if a Nest exception filter throws?</strong> The error escapes Nest's filter chain to the platform's default handler; extend <code>BaseExceptionFilter</code> and call <code>super.catch</code> instead.</li>
</ol>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>6.6 — Lab: đặt phòng đứng vững giữa giờ cao điểm</h2>
<p class="lead">Mọi thứ của chương gói trong một service nhỏ: PrismaService (6.1), lỗi đổi thành mã HTTP (6.4), exclusion constraint và cột version (6.5), cùng một bộ test e2e chạy trên PostgreSQL thật — loại test duy nhất bắt được race.</p>

<h3>Yêu cầu</h3>
<ol>
<li><code>POST /bookings</code> với <code>roomId, studentId, start, end</code> (ISO 8601). Kiểm bằng DTO.</li>
<li><code>PATCH /bookings/:id/status</code> với <code>status</code> (APPROVED/REJECTED) và <code>version</code> mà admin đã thấy.</li>
<li>Không truy vấn "còn trống không?" trước khi chèn: ràng buộc trong DB là nguồn sự thật duy nhất.</li>
<li>Mọi lỗi giao lịch từ DB — dù tới dưới hình dạng nào — đều thành <code>409 BOOKING_CONFLICT</code> dạng <code>application/problem+json</code>. Lỗi khác giữ cách xử lý bình thường của Nest.</li>
<li>Test chạy trên DB riêng (<code>lab66</code>), đưa lên migration mới nhất bằng <code>prisma migrate deploy</code>.</li>
</ol>

<h3>Tiêu chí đạt</h3>
<ul>
<li>50 request đồng thời cho một khung giờ ⇒ đúng 1 × 201 và 49 × 409, và đúng 1 dòng trong bảng.</li>
<li>7:30–9:30 rồi 9:30–11:00 ⇒ cả hai 201.</li>
<li>Booking bị từ chối nhả khung giờ của nó.</li>
<li>Hai lần đổi trạng thái cùng version ⇒ lần sau nhận <code>409 STALE_VERSION</code>.</li>
<li><code>end</code> trước <code>start</code> không bao giờ thành 201.</li>
</ul>

<h3>Gợi ý</h3>
<ul>
<li>Migration: dùng lại hai cái ở Bài 6.5 (init + <code>khong_dat_trung</code>); <code>DATABASE_URL=…/lab66 npx prisma migrate deploy</code>.</li>
<li>Mã gốc của PostgreSQL nằm ở <code>meta.driverAdapterError.cause.originalCode</code> (<code>23P01</code>); xung đột ghi có thể tới mà không có <code>code</code> nào.</li>
<li>Dùng supertest với <code>app.getHttpServer()</code> và <code>Promise.all</code> cho 50 request.</li>
</ul>

<details><summary>Xem lời giải — service, controller, module</summary>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
</details>

<details><summary>Xem lời giải — filter (và cái lỗi tôi gặp đầu tiên)</summary>
<p>Bản filter đầu tiên của tôi trông hợp lý: bắt mọi thứ, xử lý lỗi giao lịch, ném lại phần còn lại cho nơi khác lo.</p>
<pre><code class="language-ts">${esc(MA_SAI)}</code></pre>
<p>Một test đỏ: mã 409 đúng nhưng <code>body.code</code> là <code>undefined</code>. In phản hồi ra mới thấy vì sao:</p>
<div class="out">${esc(OUT_HTML)}</div>
<p>Exception ném <em>bên trong</em> một filter không được chuyển cho filter Nest khác — nó rơi khỏi Nest xuống bộ xử lý lỗi mặc định của Express, thứ vẽ ra trang HTML kèm stack trace (ở mọi môi trường mà <code>NODE_ENV</code> không phải <code>production</code>). Đường dẫn tệp và số dòng cho bất kỳ ai gửi hai request PATCH. Cách sửa là kế thừa <code>BaseExceptionFilter</code> và trả lại bằng <code>super.catch()</code>:</p>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
</details>

<details><summary>Xem lời giải — test và lần chạy</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST2)}</div>
</details>

<h3>Thử phá (10 phút)</h3>
<p>Chứng minh test bảo vệ đúng thứ bạn nghĩ: bỏ ràng buộc rồi chạy lại.</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>Cả 50 request đều thành booking — test đỏ to, đúng dòng, đúng lý do. Một test vẫn xanh khi bạn gỡ bỏ chính thứ nó phải canh thì chỉ là đồ trang trí. (Xong thì thêm lại ràng buộc, hoặc <code>migrate reset</code> DB test.)</p>
<p>Lần phá thứ hai: cho khoảng đóng — <code>'[]'</code> thay vì <code>'[)'</code> — thế là 9:30 thuộc về cả hai booking:</p>
<div class="out">${esc(OUT_PHA2)}</div>
<p>Và một lỗ hổng bộ test cố ý để ngỏ: <code>end</code> trước <code>start</code> bị <code>CHECK</code> của DB chặn, nhưng client thấy <code>500 {"statusCode":500,"message":"Internal server error"}</code> (đã đo). Thêm luật trong DTO hoặc ánh xạ SQLSTATE <code>23514</code> sang 400, rồi siết test thành <code>expect(400)</code>.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test một race condition thế nào?</strong> Nhiều request thật sự đồng thời vào DB thật (kết nối đã làm nóng, <code>Promise.all</code>), khẳng định đúng số kết quả và số dòng; rồi gỡ lớp bảo vệ và kiểm test đỏ.</li>
<li><strong>Sao là test e2e mà không phải test đơn vị với repository giả?</strong> Bảo đảm nằm trong PostgreSQL; đồ giả chỉ xác nhận được giả định của bạn về nó.</li>
<li><strong>Exception filter của Nest ném lỗi thì sao?</strong> Lỗi thoát khỏi chuỗi filter của Nest xuống bộ xử lý mặc định của nền tảng; hãy kế thừa <code>BaseExceptionFilter</code> và gọi <code>super.catch</code>.</li>
</ol>
${THE}
</div>
`,
};
