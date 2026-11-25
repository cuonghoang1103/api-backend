/**
 * 3.8 — Mốc dự án 3 (khoá nestjs, soạn 24/11/2026).
 * Ví dụ làm sẵn: scratchpad/nst/lab/c3/moc3 (chép từ c2/moc2, thêm src/common: request-id, problem.filter [như lab 3.7], api-key.guard, timing.interceptor;
 * RoomsController dùng ParseIntPipe + @Public; BookingsService có errorCode). Output THẬT: moc3.sh trong container nst-run-* cho cả moc2 (TRƯỚC) và moc3 (SAU);
 * API_KEYS rỗng ⇒ exit 1; Vitest trên máy nhà: lần đầu 2 test cũ ĐỎ (spec cũ import AppModule ⇒ kéo guard toàn cục) ⇒ sửa spec chỉ import module cần ⇒ 6/6 xanh.
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Dự án xuyên suốt', sub: 'Đề tài, 11 mốc và thang điểm 100 — mốc 3 nằm ở đâu trong lộ trình.', cta: 'Mở bài →' }),
].join('\n');

const README = `## Dây chuyền request (mốc 3)
| Lớp         | Thứ gì                 | Gắn ở              |
|-------------|------------------------|--------------------|
| middleware  | RequestIdMiddleware    | AppModule.configure('{*path}') |
| guard       | ApiKeyGuard (tạm, ch7 thay JWT) | APP_GUARD — mặc định chặn, mở bằng @Public() |
| interceptor | TimingInterceptor (log JSON)    | APP_INTERCEPTOR |
| filter      | ProblemFilter (RFC 9457)        | APP_FILTER |

Mã lỗi: ROOM_NOT_FOUND (404) · BOOKING_CONFLICT (409) · BOOKING_IN_PAST (400)
Biến môi trường: API_KEYS=khoa1,khoa2 (trống ⇒ ứng dụng từ chối khởi động)
Route công khai: GET /rooms, GET /rooms/:id`;
const MA_KEY = "import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { timingSafeEqual } from 'node:crypto';\n\nexport const Public = Reflector.createDecorator<boolean>({ transform: () => true });\n\n/** Guard TẠM của mốc 3: một khoá chung cho ứng dụng quản trị. Chương 7 thay bằng JWT + vai trò. */\n@Injectable()\nexport class ApiKeyGuard implements CanActivate {\n  private readonly khoa = (process.env.API_KEYS ?? '').split(',').filter(Boolean);\n  constructor(private readonly reflector: Reflector) {\n    if (this.khoa.length === 0) throw new Error('API_KEYS trống — từ chối khởi động thay vì mở toang API');\n  }\n  canActivate(ctx: ExecutionContext) {\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const gui = Buffer.from(ctx.switchToHttp().getRequest().header('x-api-key') ?? '');\n    if (this.khoa.some((k) => k.length === gui.length && timingSafeEqual(Buffer.from(k), gui))) return true;\n    throw new UnauthorizedException('Thiếu hoặc sai x-api-key');\n  }\n}";
const MA_TIME = "import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';\nimport { tap } from 'rxjs';\n\n/** Một dòng log JSON cho mỗi lần gọi handler: id, hành động, mã, thời gian. */\n@Injectable()\nexport class TimingInterceptor implements NestInterceptor {\n  private log = new Logger('HTTP');\n  intercept(ctx: ExecutionContext, next: CallHandler) {\n    const req = ctx.switchToHttp().getRequest();\n    const t0 = performance.now();\n    const ghi = (status: number) => this.log.log(JSON.stringify({\n      id: req.id, action: `${ctx.getClass().name}.${ctx.getHandler().name}`, status, ms: +(performance.now() - t0).toFixed(1),\n    }));\n    return next.handle().pipe(tap({\n      next: () => ghi(ctx.switchToHttp().getResponse().statusCode),\n      error: (e) => ghi(e instanceof HttpException ? e.getStatus() : 500),\n    }));\n  }\n}";
const MA_APP = "import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';\nimport { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';\nimport { ClockModule } from './common/clock.module.js';\nimport { ApiKeyGuard } from './common/api-key.guard.js';\nimport { ProblemFilter } from './common/problem.filter.js';\nimport { RequestIdMiddleware } from './common/request-id.middleware.js';\nimport { TimingInterceptor } from './common/timing.interceptor.js';\nimport { RoomsModule } from './rooms/rooms.module.js';\nimport { BookingsModule } from './bookings/bookings.module.js';\n\n@Module({\n  imports: [ClockModule, RoomsModule, BookingsModule],\n  providers: [\n    { provide: APP_GUARD, useClass: ApiKeyGuard },\n    { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },\n    { provide: APP_FILTER, useClass: ProblemFilter },\n  ],\n})\nexport class AppModule implements NestModule {\n  configure(c: MiddlewareConsumer) { c.apply(RequestIdMiddleware).forRoutes('{*path}'); }\n}";
const DIFF_CTL = "--- src/rooms/rooms.controller.ts\n+++ src/rooms/rooms.controller.ts\n@@ -1,4 +1,5 @@\n-import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Query } from '@nestjs/common';\n+import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';\n+import { Public } from '../common/api-key.guard.js';\n import { RoomsService } from './rooms.service.js';\n import { CreateRoomDto } from './dto/create-room.dto.js';\n import { UpdateRoomDto } from './dto/update-room.dto.js';\n@@ -13,27 +14,29 @@\n   }\n \n   @Get()\n+  @Public()                       // danh sách phòng: ai cũng xem được\n   findAll(@Query('building') building?: string) {\n     return this.roomsService.findAll(building);\n   }\n \n   @Get(':id')\n-  findOne(@Param('id') id: string) {\n-    const room = this.roomsService.findOne(+id);\n-    if (!room) throw new NotFoundException(`Room ${id} not found`);\n+  @Public()\n+  findOne(@Param('id', ParseIntPipe) id: number) {\n+    const room = this.roomsService.findOne(id);\n+    if (!room) throw new NotFoundException(`Room ${id} not found`, { errorCode: 'ROOM_NOT_FOUND' });\n     return room;\n   }\n \n   @Patch(':id')\n-  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {\n-    const room = this.roomsService.update(+id, dto);\n-    if (!room) throw new NotFoundException(`Room ${id} not found`);\n+  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {\n+    const room = this.roomsService.update(id, dto);\n+    if (!room) throw new NotFoundException(`Room ${id} not found`, { errorCode: 'ROOM_NOT_FOUND' });\n     return room;\n   }\n \n   @Delete(':id')\n   @HttpCode(204)\n-  remove(@Param('id') id: string) {\n-    if (!this.roomsService.remove(+id)) throw new NotFoundException(`Room ${id} not found`);\n+  remove(@Param('id', ParseIntPipe) id: number) {\n+    if (!this.roomsService.remove(id)) throw new NotFoundException(`Room ${id} not found`, { errorCode: 'ROOM_NOT_FOUND' });\n   }\n }";
const DIFF_SPEC = "--- src/bookings/bookings.service.spec.ts\n+++ src/bookings/bookings.service.spec.ts\n@@ -1,12 +1,12 @@\n import { Test } from '@nestjs/testing';\n-import { AppModule } from '../app.module.js';\n-import { Clock } from '../common/clock.module.js';\n+import { Clock, ClockModule } from '../common/clock.module.js';\n+import { BookingsModule } from './bookings.module.js';\n import { BookingsService } from './bookings.service.js';\n \n describe('BookingsService (đồng hồ cố định)', () => {\n   let svc: BookingsService;\n   beforeEach(async () => {\n-    const m = await Test.createTestingModule({ imports: [AppModule] })\n+    const m = await Test.createTestingModule({ imports: [ClockModule, BookingsModule] })   // chỉ thứ service cần — không kéo guard/filter toàn cục vào\n       .overrideProvider(Clock).useValue({ now: () => new Date('2026-12-01T08:00:00+07:00') })\n       .compile();\n     svc = m.get(BookingsService);";
const MA_E2E = "import 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\nimport { Clock } from './clock.module.js';\n\nprocess.env.API_KEYS = 'test-key';\nconst { AppModule } = await import('../app.module.js');       // đọc API_KEYS SAU khi đặt\n\ndescribe('Mốc 3 — dây chuyền request của lab-booking', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] })\n      .overrideProvider(Clock).useValue({ now: () => new Date('2026-12-01T00:00:00Z') }).compile();\n    app = m.createNestApplication({ logger: false });\n    await app.init();\n  });\n  afterAll(() => app.close());\n  const http = () => request(app.getHttpServer());\n  const B = { roomId: 1, studentId: 'SE170001', start: '2027-01-05T07:30:00+07:00', end: '2027-01-05T09:30:00+07:00', attendees: 20 };\n\n  it('xem phòng không cần khoá (@Public)', () => http().get('/rooms').expect(200));\n  it('id không phải số ⇒ 400 problem+json, không còn 404 \"Room abc\"', async () => {\n    const r = await http().get('/rooms/abc').expect(400);\n    expect(r.headers['content-type']).toMatch(/problem\\+json/);\n    expect(r.body.requestId).toBe(r.headers['x-request-id']);\n  });\n  it('đặt lịch thiếu khoá ⇒ 401', () => http().post('/bookings').send(B).expect(401));\n  it('đặt trùng ⇒ 409 với mã BOOKING_CONFLICT', async () => {\n    await http().post('/bookings').set('x-api-key', 'test-key').send(B).expect(201);\n    const r = await http().post('/bookings').set('x-api-key', 'test-key').send(B).expect(409);\n    expect(r.body.type).toMatch(/BOOKING_CONFLICT$/);\n  });\n});";
const OUT_TRUOC = "$ export API_KEY=admin-7c1e\n$ curl localhost:3000/rooms/abc\n{\"message\":\"Room abc not found\",\"error\":\"Not Found\",\"statusCode\":404}\n$ curl localhost:3000/rooms/9\n{\"message\":\"Room 9 not found\",\"error\":\"Not Found\",\"statusCode\":404}\n$ curl -XPOST localhost:3000/bookings -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"id\":1,\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}\n$ curl -XPOST localhost:3000/bookings -H \"x-api-key: $API_KEY\" -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"message\":\"trùng lịch #1\",\"error\":\"Conflict\",\"statusCode\":409}\n$ curl -XPOST localhost:3000/bookings -H \"x-api-key: $API_KEY\" -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"message\":\"trùng lịch #1\",\"error\":\"Conflict\",\"statusCode\":409}\n## log server";
const OUT_SAU = "$ export API_KEY=admin-7c1e\n$ curl localhost:3000/rooms/abc\n{\"type\":\"https://lab-booking.example/errors/400\",\"title\":\"BadRequestException\",\"status\":400,\"detail\":\"Validation failed (numeric string is expected)\",\"instance\":\"/rooms/abc\",\"requestId\":\"18424f85-8d2f-48b4-8f4d-5777200c1c5c\"}\n$ curl localhost:3000/rooms/9\n{\"type\":\"https://lab-booking.example/errors/ROOM_NOT_FOUND\",\"title\":\"NotFoundException\",\"status\":404,\"detail\":\"Room 9 not found\",\"instance\":\"/rooms/9\",\"requestId\":\"c2bab267-82ce-4b95-819e-dcd68cfefd33\"}\n$ curl -XPOST localhost:3000/bookings -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"type\":\"https://lab-booking.example/errors/401\",\"title\":\"UnauthorizedException\",\"status\":401,\"detail\":\"Thiếu hoặc sai x-api-key\",\"instance\":\"/bookings\",\"requestId\":\"bea7b1e6-a00a-4243-8b33-1444eb7179ae\"}\n$ curl -XPOST localhost:3000/bookings -H \"x-api-key: $API_KEY\" -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"id\":1,\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}\n$ curl -XPOST localhost:3000/bookings -H \"x-api-key: $API_KEY\" -H 'content-type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"type\":\"https://lab-booking.example/errors/BOOKING_CONFLICT\",\"title\":\"ConflictException\",\"status\":409,\"detail\":\"trùng lịch #1\",\"instance\":\"/bookings\",\"requestId\":\"4148fcde-5c1d-4d21-9252-6b92aa65eab5\"}\n## log server\n[Nest] LOG [HTTP] {\"id\":\"18424f85-8d2f-48b4-8f4d-5777200c1c5c\",\"action\":\"RoomsController.findOne\",\"status\":400,\"ms\":0.6}\n[Nest] LOG [HTTP] {\"id\":\"c2bab267-82ce-4b95-819e-dcd68cfefd33\",\"action\":\"RoomsController.findOne\",\"status\":404,\"ms\":0.3}\n[Nest] LOG [HTTP] {\"id\":\"add2784e-8745-4fc6-a7e3-34264024d725\",\"action\":\"BookingsController.create\",\"status\":201,\"ms\":0.2}\n[Nest] LOG [HTTP] {\"id\":\"4148fcde-5c1d-4d21-9252-6b92aa65eab5\",\"action\":\"BookingsController.create\",\"status\":409,\"ms\":0.2}";
const OUT_RONG = "[Nest] ERROR [ExceptionHandler] Error: API_KEYS trống — từ chối khởi động thay vì mở toang API\nexit 1";
const OUT_VO = " × src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > 8:00 \"bây giờ\" ⇒ 7:30 là quá khứ 13ms\n × src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu) 3ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > xem phòng không cần khoá (@Public) 27ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > id không phải số ⇒ 400 problem+json, không còn 404 \"Room abc\" 7ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt lịch thiếu khoá ⇒ 401 9ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt trùng ⇒ 409 với mã BOOKING_CONFLICT 7ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\nError: API_KEYS trống — từ chối khởi động thay vì mở toang API\n      Tests  2 failed | 4 passed (6)";
const OUT_TEST = " ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > 8:00 \"bây giờ\" ⇒ 7:30 là quá khứ 67ms\n ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu) 3ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > xem phòng không cần khoá (@Public) 24ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > id không phải số ⇒ 400 problem+json, không còn 404 \"Room abc\" 6ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt lịch thiếu khoá ⇒ 401 9ms\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt trùng ⇒ 409 với mã BOOKING_CONFLICT 6ms\n      Tests  6 passed (6)";

export default {
  title: '3.8 — Project milestone 3: errors, logging and a first guard in your project|||3.8 — Mốc dự án 3: lỗi, log và guard đầu tiên trong dự án',
  slug: 'nst-3-8-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Áp dây chuyền của chương vào đề tài của bạn: filter problem+json với mã lỗi ổn định, interceptor log JSON có request id, guard API key tạm (mặc định chặn, từ chối khởi động khi thiếu khoá), ParseIntPipe thay +id. Ví dụ làm sẵn trên dự án đặt phòng lab, chạy thật trước/sau: "/rooms/abc" từ 404 sai thành 400 đúng, đặt lịch không khoá từ 201 thành 401. Bẫy thật: thêm guard toàn cục làm đỏ test cũ vì test import cả AppModule.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Project</span>
<h2>3.8 — Milestone 3: a pipeline you can operate</h2>
<p class="lead">After milestone 2 your project has modules with clear boundaries. Now give it the operational basics: errors in one documented format, one log line per call with an id, routes closed by default, and parameters converted properly. The worked example applies it to the lab-booking project; do the same in your own topic.</p>

<h3>Steps</h3>
<ol>
<li>Copy <code>RequestIdMiddleware</code> and <code>ProblemFilter</code> from lab 3.7 into <code>src/common/</code>. Register the filter with <code>APP_FILTER</code>, the middleware for <code>'{*path}'</code>.</li>
<li>Give every domain error you throw a stable <code>errorCode</code> (Nest 12) and list them in the README.</li>
<li>Add a <code>TimingInterceptor</code> that logs one JSON line per handler call (<code>id</code>, <code>action</code>, <code>status</code>, <code>ms</code>).</li>
<li>Add a temporary <code>ApiKeyGuard</code> via <code>APP_GUARD</code>: every route closed, read routes opened with <code>@Public()</code>. Keys from an environment variable; if it is empty, <strong>refuse to start</strong>. Chapter 7 replaces it with JWT.</li>
<li>Replace every <code>+id</code> / <code>Number(id)</code> in controllers with <code>ParseIntPipe</code> (or <code>ParseUUIDPipe</code>).</li>
<li>Add an e2e test for the pipeline and run all old tests. Commit: <code>feat: dây chuyền request — lỗi, log, guard (mốc 3)</code>.</li>
</ol>

<h3>Worked example: lab-booking</h3>
<pre><code class="language-ts">${esc(MA_KEY)}</code></pre>
<pre><code class="language-ts">${esc(MA_TIME)}</code></pre>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-diff">${esc(DIFF_CTL)}</code></pre>

<h4>Before (milestone 2)</h4>
<div class="out">${esc(OUT_TRUOC)}</div>
<p>Three problems the chapter promised to fix: <code>/rooms/abc</code> answers "Room abc not found" (404) — <code>+'abc'</code> is <code>NaN</code>, so it is a client error disguised as missing data; anyone can create bookings without credentials; and the server log is empty, so none of this would be visible.</p>

<h4>After (milestone 3)</h4>
<div class="out">${esc(OUT_SAU)}</div>
<p>400 with the pipe's message, a 404 with <code>type …/ROOM_NOT_FOUND</code>, 401 without a key, 201 with a key, 409 <code>BOOKING_CONFLICT</code> on the duplicate — all with <code>requestId</code> — and one JSON log line per call. Note the 401 has no log line: the guard rejected it before the interceptor ran (lesson 3.6). If your topic needs denials logged, use the lab 3.7 extra exercise.</p>
<div class="out">${esc(OUT_RONG)}</div>
<p>Started without <code>API_KEYS</code>: the guard's constructor throws during bootstrap, exit 1. A guard that silently allows everything when misconfigured is worse than no guard — it looks protected.</p>

<h4>The trap: old tests turned red</h4>
<div class="out">${esc(OUT_VO)}</div>
<p>The milestone 2 unit test for <code>BookingsService</code> built the <em>whole</em> <code>AppModule</code> to get one service. Adding a global guard to <code>AppModule</code> made unrelated tests fail. The fix is in the test, not the guard: import only what the service needs.</p>
<pre><code class="language-diff">${esc(DIFF_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>The e2e test sets <code>API_KEYS</code> <em>before</em> importing <code>AppModule</code> (dynamic <code>await import</code>), because the guard reads the variable when its class is constructed.</p>

<h3>README section</h3>
<pre><code>${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Self-check before committing:</strong> every error response of your API has the same shape and a <code>requestId</code>; a 500 shows no internal detail; a new controller with no decorators answers 401; the app refuses to start without keys; no <code>+id</code> left (<code>grep -rn "(+" src/</code>); all tests green, including old ones.</p>
</div>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Dự án</span>
<h2>3.8 — Mốc 3: một dây chuyền vận hành được</h2>
<p class="lead">Sau mốc 2, dự án của bạn có các module với ranh giới rõ ràng. Giờ cho nó những thứ cơ bản để vận hành: lỗi theo một dạng có tài liệu, mỗi lời gọi một dòng log có mã, route mặc định bị đóng, và tham số được chuyển kiểu đàng hoàng. Ví dụ làm sẵn áp lên dự án đặt phòng lab; bạn làm tương tự cho đề tài của mình.</p>

<h3>Các bước</h3>
<ol>
<li>Chép <code>RequestIdMiddleware</code> và <code>ProblemFilter</code> từ lab 3.7 vào <code>src/common/</code>. Đăng ký filter bằng <code>APP_FILTER</code>, middleware cho <code>'{*path}'</code>.</li>
<li>Mỗi lỗi nghiệp vụ bạn ném ra có một <code>errorCode</code> ổn định (Nest 12), và liệt kê chúng trong README.</li>
<li>Thêm <code>TimingInterceptor</code> ghi mỗi lần gọi handler một dòng JSON (<code>id</code>, <code>action</code>, <code>status</code>, <code>ms</code>).</li>
<li>Thêm <code>ApiKeyGuard</code> tạm qua <code>APP_GUARD</code>: mọi route bị đóng, route đọc mở bằng <code>@Public()</code>. Khoá lấy từ biến môi trường; nếu trống thì <strong>từ chối khởi động</strong>. Chương 7 thay bằng JWT.</li>
<li>Thay mọi <code>+id</code> / <code>Number(id)</code> trong controller bằng <code>ParseIntPipe</code> (hoặc <code>ParseUUIDPipe</code>).</li>
<li>Thêm một test e2e cho dây chuyền và chạy lại mọi test cũ. Commit: <code>feat: dây chuyền request — lỗi, log, guard (mốc 3)</code>.</li>
</ol>

<h3>Ví dụ làm sẵn: lab-booking</h3>
<pre><code class="language-ts">${esc(MA_KEY)}</code></pre>
<pre><code class="language-ts">${esc(MA_TIME)}</code></pre>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-diff">${esc(DIFF_CTL)}</code></pre>

<h4>Trước (mốc 2)</h4>
<div class="out">${esc(OUT_TRUOC)}</div>
<p>Ba vấn đề chương này hứa sửa: <code>/rooms/abc</code> trả "Room abc not found" (404) — <code>+'abc'</code> là <code>NaN</code>, nên đây là lỗi của client giả dạng dữ liệu không tồn tại; ai cũng tạo được lịch đặt mà không cần thông tin xác thực; và log server trống trơn, nên chẳng ai nhìn thấy những chuyện này.</p>

<h4>Sau (mốc 3)</h4>
<div class="out">${esc(OUT_SAU)}</div>
<p>400 kèm thông báo của pipe, 404 với <code>type …/ROOM_NOT_FOUND</code>, 401 khi không có khoá, 201 khi có khoá, 409 <code>BOOKING_CONFLICT</code> khi đặt trùng — tất cả đều có <code>requestId</code> — và mỗi lời gọi một dòng log JSON. Để ý lần 401 không có dòng log: guard đã chặn trước khi interceptor chạy (bài 3.6). Nếu đề tài của bạn cần ghi cả lần bị từ chối, dùng bài tập thêm của lab 3.7.</p>
<div class="out">${esc(OUT_RONG)}</div>
<p>Khởi động mà không có <code>API_KEYS</code>: constructor của guard ném lỗi ngay lúc dựng ứng dụng, exit 1. Một guard âm thầm cho qua tất cả khi cấu hình sai còn tệ hơn không có guard — vì trông như đã được bảo vệ.</p>

<h4>Bẫy: test cũ chuyển đỏ</h4>
<div class="out">${esc(OUT_VO)}</div>
<p>Test đơn vị ở mốc 2 cho <code>BookingsService</code> dựng <em>cả</em> <code>AppModule</code> chỉ để lấy một service. Thêm guard toàn cục vào <code>AppModule</code> là các test chẳng liên quan cũng hỏng. Sửa ở test, không sửa guard: chỉ import thứ service cần.</p>
<pre><code class="language-diff">${esc(DIFF_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Test e2e đặt <code>API_KEYS</code> <em>trước</em> khi import <code>AppModule</code> (<code>await import</code> động), vì guard đọc biến này lúc class của nó được dựng.</p>

<h3>Mục README</h3>
<pre><code>${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Tự kiểm trước khi commit:</strong> mọi phản hồi lỗi của API có cùng một dạng và có <code>requestId</code>; lỗi 500 không lộ chi tiết bên trong; một controller mới không gắn decorator nào trả 401; ứng dụng từ chối khởi động khi thiếu khoá; không còn <code>+id</code> nào (<code>grep -rn "(+" src/</code>); mọi test xanh, kể cả test cũ.</p>
</div>
${THE}
</div>
`,
};
