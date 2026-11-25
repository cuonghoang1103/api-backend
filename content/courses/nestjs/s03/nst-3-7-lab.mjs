/**
 * 3.7 — Lab: Nhật ký kiểm toán (khoá nestjs, soạn 24/11/2026).
 * Mã lời giải: scratchpad/nst/lab/c3/app/src/lab37 (6 test Vitest 4.1.12 chạy trên máy nhà — xanh) + lab37.sh (main.js trong container
 * nst-run-*, 3 curl, stdout server). Bài tập thêm: lab37z (ghi cả lần bị từ chối ở guard; thử trước ở filter ⇒ hanhDong "undefined.undefined"
 * vì ArgumentsHost của filter không có handler — test bắt được, đã đổi sang guard) — 6/6 xanh.
 * Sự cố thật: Equifax 2017 — chứng chỉ của thiết bị giám sát hết hạn 19 tháng ⇒ không thấy dữ liệu bị rút (House Oversight 12/2018).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — Một mã xuyên mọi tầng', sub: 'Đưa request id xuống tận service/repository bằng AsyncLocalStorage.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Tư duy test; Chương 8 của khoá này dạy test Nest kỹ hơn.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🛡️', 'OWASP Top 10 2021 — A09 Security Logging and Monitoring Failures', 'Không ghi, không giám sát thì không phát hiện được tấn công.', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'),
  nguon('📰', 'House Oversight Committee — báo cáo Equifax (12/2018)', 'Chứng chỉ giám sát hết hạn 19 tháng: không thấy dữ liệu bị rút ra.', 'https://oversight.house.gov/report/committee-releases-report-revealing-new-information-on-equifax-data-breach/'),
].join('\n');
const MA_RID = "import { Injectable, NestMiddleware } from '@nestjs/common';\nimport type { NextFunction, Request, Response } from 'express';\nimport { randomUUID } from 'node:crypto';\n\n/** YC1 — mọi request có id (nhận từ phía trước nếu hợp lệ), trả lại ở header x-request-id. */\n@Injectable()\nexport class RequestIdMiddleware implements NestMiddleware {\n  use(req: Request, res: Response, next: NextFunction) {\n    const goi = req.header('x-request-id');\n    const id = goi && /^[\\w-]{1,64}$/.test(goi) ? goi : randomUUID();\n    (req as any).id = id;\n    res.setHeader('x-request-id', id);\n    next();\n  }\n}";
const MA_SINK = "import { Injectable } from '@nestjs/common';\n\nexport interface DongKiemToan {\n  reqId: string; nguoiDung: string | null; hanhDong: string; ketQua: number; ms: number;\n}\n/** Nơi ghi nhật ký kiểm toán. Thật: bảng audit_log hoặc dịch vụ log; ở lab: mảng + một dòng JSON ra stdout. */\n@Injectable()\nexport class AuditSink {\n  readonly dong: DongKiemToan[] = [];\n  ghi(d: DongKiemToan) { this.dong.push(d); if (process.env.IN_LOG) console.log(JSON.stringify(d)); }\n}";
const MA_GUARD = "import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { timingSafeEqual } from 'node:crypto';\n\nexport const Public = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const Roles = Reflector.createDecorator<string[]>();\nconst KHOA: Record<string, { ten: string; vaiTro: string[] }> = {\n  'k-sv-0001': { ten: 'an', vaiTro: ['sv'] },\n  'k-gv-0002': { ten: 'binh', vaiTro: ['gv'] },\n};\nconst bang = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));\n\n/** YC3 — mặc định CHẶN: route nào không @Public đều cần khoá; @Roles ở method ghi đè class. */\n@Injectable()\nexport class AuthGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext) {\n    const dich = [ctx.getHandler(), ctx.getClass()];\n    if (this.reflector.getAllAndOverride(Public, dich)) return true;\n    const req = ctx.switchToHttp().getRequest();\n    const ai = Object.entries(KHOA).find(([k]) => bang(k, req.header('x-api-key') ?? ''))?.[1];\n    if (!ai) throw new UnauthorizedException('Thiếu hoặc sai x-api-key');\n    req.user = ai;\n    const can = this.reflector.getAllAndOverride(Roles, dich);\n    return !can || can.some((v) => ai.vaiTro.includes(v));\n  }\n}";
const MA_ICP = "import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';\nimport { tap } from 'rxjs';\nimport { AuditSink } from './audit.js';\n\n/** YC2 — ghi một dòng cho MỖI lần gọi handler (thành công hay lỗi), biết đúng hành động \"Class.method\". */\n@Injectable()\nexport class AuditInterceptor implements NestInterceptor {\n  constructor(private readonly sink: AuditSink) {}\n  intercept(ctx: ExecutionContext, next: CallHandler) {\n    const req = ctx.switchToHttp().getRequest();\n    const t0 = performance.now();\n    const dong = (ketQua: number) => this.sink.ghi({\n      reqId: req.id, nguoiDung: req.user?.ten ?? null, hanhDong: `${ctx.getClass().name}.${ctx.getHandler().name}`,\n      ketQua, ms: Math.round(performance.now() - t0),\n    });\n    return next.handle().pipe(tap({\n      next: () => dong(ctx.switchToHttp().getResponse().statusCode),\n      error: (e) => dong(e instanceof HttpException ? e.getStatus() : 500),\n    }));\n  }\n}";
const MA_FILTER = "import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';\nimport { HttpAdapterHost } from '@nestjs/core';\n\n/** YC4 — mọi lỗi cùng một dạng problem+json, có requestId để tra log; 5xx không lộ chi tiết. */\n@Catch()\nexport class ProblemFilter implements ExceptionFilter {\n  private log = new Logger('Loi');\n  constructor(private readonly host: HttpAdapterHost) {}\n  catch(err: unknown, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const req = ctx.getRequest();\n    const res = ctx.getResponse();\n    const http = err instanceof HttpException;\n    const status = http ? err.getStatus() : (err as any)?.status ?? 500;\n    const body = http ? err.getResponse() : undefined;\n    const detail = status >= 500 ? 'Lỗi phía máy chủ — đã ghi log.'\n      : typeof body === 'string' ? body : (body as any)?.message ?? (err as any)?.message;\n    if (status >= 500) this.log.error(`[${req.id}] ${(err as Error)?.stack ?? err}`);\n    this.host.httpAdapter.setHeader(res, 'content-type', 'application/problem+json');\n    this.host.httpAdapter.reply(res, {\n      type: `https://lab-booking.example/errors/${(http && err.errorCode) || status}`,\n      title: http ? err.name : 'Internal Server Error', status, detail, instance: req.originalUrl, requestId: req.id,\n    }, status);\n  }\n}";
const MA_CTL = "import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';\nimport { Public, Roles } from './roles.guard.js';\n\n@Controller('rooms')\n@Roles(['sv', 'gv'])\nexport class RoomsController {\n  @Get() @Public() list() { return [{ id: 1, ten: 'Lab 401' }]; }\n  @Get(':id') one(@Param('id', ParseIntPipe) id: number) {\n    if (id !== 1) throw new NotFoundException(`Không có phòng ${id}`, { errorCode: 'ROOM_NOT_FOUND' });\n    return { id, ten: 'Lab 401' };\n  }\n  @Get(':id/nhat-ky') @Roles(['gv']) nhatKy(@Param('id', ParseIntPipe) id: number) { return { id, nhatKy: [] }; }\n  @Get(':id/hong') hong() { throw new Error('connect ECONNREFUSED 10.0.3.15:5432'); }\n}";
const MA_MOD = "import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';\nimport { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';\nimport { AuditSink } from './audit.js';\nimport { AuditInterceptor } from './audit.interceptor.js';\nimport { ProblemFilter } from './problem.filter.js';\nimport { RequestIdMiddleware } from './request-id.middleware.js';\nimport { AuthGuard } from './roles.guard.js';\nimport { RoomsController } from './rooms.controller.js';\n\n@Module({\n  controllers: [RoomsController],\n  providers: [\n    AuditSink,\n    { provide: APP_GUARD, useClass: AuthGuard },            // qua DI: tiêm được Reflector, test thay được\n    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },\n    { provide: APP_FILTER, useClass: ProblemFilter },\n  ],\n})\nexport class AppModule implements NestModule {\n  configure(c: MiddlewareConsumer) { c.apply(RequestIdMiddleware).forRoutes('{*path}'); }\n}";
const MA_SPEC = "import 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\nimport { AppModule } from './app.module.js';\nimport { AuditSink } from './audit.js';\n\ndescribe('Lab 3.7 — nhật ký kiểm toán', () => {\n  let app: INestApplication; let sink: AuditSink;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = m.createNestApplication({ logger: false });\n    await app.init();\n    sink = app.get(AuditSink);\n  });\n  afterAll(() => app.close());\n  beforeEach(() => { sink.dong.length = 0; });\n\n  it('thành công: ghi đủ trường, id trả về khớp id trong log', async () => {\n    const r = await request(app.getHttpServer()).get('/rooms/1').set('x-api-key', 'k-sv-0001').expect(200);\n    expect(sink.dong).toEqual([{ reqId: r.headers['x-request-id'], nguoiDung: 'an', hanhDong: 'RoomsController.one', ketQua: 200, ms: expect.any(Number) }]);\n  });\n  it('nhận id từ phía trước nếu hợp lệ, thay nếu bẩn', async () => {\n    const a = await request(app.getHttpServer()).get('/rooms').set('x-request-id', 'gw-123');\n    const b = await request(app.getHttpServer()).get('/rooms').set('x-request-id', '<script>');\n    expect(a.headers['x-request-id']).toBe('gw-123');\n    expect(b.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);\n  });\n  it('lỗi 404 do service: interceptor vẫn ghi, filter trả problem+json có requestId', async () => {\n    const r = await request(app.getHttpServer()).get('/rooms/9').set('x-api-key', 'k-sv-0001').expect(404);\n    expect(r.headers['content-type']).toMatch(/application\\/problem\\+json/);\n    expect(r.body).toMatchObject({ status: 404, type: 'https://lab-booking.example/errors/ROOM_NOT_FOUND', requestId: r.headers['x-request-id'] });\n    expect(sink.dong[0]).toMatchObject({ hanhDong: 'RoomsController.one', ketQua: 404 });\n  });\n  it('THỨ TỰ: guard chặn (401/403) ⇒ interceptor CHƯA chạy ⇒ không có dòng kiểm toán', async () => {\n    await request(app.getHttpServer()).get('/rooms/1').expect(401);\n    await request(app.getHttpServer()).get('/rooms/1/nhat-ky').set('x-api-key', 'k-sv-0001').expect(403);\n    expect(sink.dong).toEqual([]);\n  });\n  it('THỨ TỰ: pipe chạy SAU interceptor ⇒ id sai (400) vẫn có dòng kiểm toán', async () => {\n    await request(app.getHttpServer()).get('/rooms/abc').set('x-api-key', 'k-sv-0001').expect(400);\n    expect(sink.dong).toMatchObject([{ ketQua: 400, nguoiDung: 'an' }]);\n  });\n  it('500: không lộ IP/cổng DB ra client', async () => {\n    const r = await request(app.getHttpServer()).get('/rooms/1/hong').set('x-api-key', 'k-gv-0002').expect(500);\n    expect(JSON.stringify(r.body)).not.toMatch(/10\\.0\\.3\\.15|ECONNREFUSED|stack/);\n    expect(sink.dong[0]).toMatchObject({ ketQua: 500, nguoiDung: 'binh' });\n  });\n});";
const OUT_TEST = " RUN  v4.1.12 ~/nst-lab\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > thành công: ghi đủ trường, id trả về khớp id trong log 24ms\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > nhận id từ phía trước nếu hợp lệ, thay nếu bẩn 7ms\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > lỗi 404 do service: interceptor vẫn ghi, filter trả problem+json có requestId 4ms\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > THỨ TỰ: guard chặn (401/403) ⇒ interceptor CHƯA chạy ⇒ không có dòng kiểm toán 6ms\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > THỨ TỰ: pipe chạy SAU interceptor ⇒ id sai (400) vẫn có dòng kiểm toán 2ms\n ✓ src/lab37/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > 500: không lộ IP/cổng DB ra client 3ms\n Test Files  1 passed (1)\n      Tests  6 passed (6)\n   Start at …\n   Duration  663ms (transform 79ms, setup 0ms, import 363ms, tests 113ms, environment 0ms)";
const OUT_CURL = "$ curl localhost:3000/rooms/1 -H 'x-api-key: k-sv-0001' -H 'x-request-id: gw-7f3a'\n{\"id\":1,\"ten\":\"Lab 401\"}\nx-request-id: gw-7f3a\n$ curl localhost:3000/rooms/1/nhat-ky -H 'x-api-key: k-sv-0001'\n{\"type\":\"https://lab-booking.example/errors/403\",\"title\":\"ForbiddenException\",\"status\":403,\"detail\":\"Forbidden resource\",\"instance\":\"/rooms/1/nhat-ky\",\"requestId\":\"3ae968ab-7bbd-404d-bba2-6b6cf0cac582\"}\nx-request-id: 3ae968ab-7bbd-404d-bba2-6b6cf0cac582\n$ curl localhost:3000/rooms/1/hong -H 'x-api-key: k-gv-0002'\n{\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\":\"Lỗi phía máy chủ — đã ghi log.\",\"instance\":\"/rooms/1/hong\",\"requestId\":\"03b09156-be05-47bb-a3c4-535d9849cf29\"}\nx-request-id: 03b09156-be05-47bb-a3c4-535d9849cf29\n## stdout của server (nhật ký kiểm toán + log lỗi)\n{\"reqId\":\"gw-7f3a\",\"nguoiDung\":\"an\",\"hanhDong\":\"RoomsController.one\",\"ketQua\":200,\"ms\":0}\n{\"reqId\":\"03b09156-be05-47bb-a3c4-535d9849cf29\",\"nguoiDung\":\"binh\",\"hanhDong\":\"RoomsController.hong\",\"ketQua\":500,\"ms\":0}\n[Nest] ERROR [Loi] [03b09156-be05-47bb-a3c4-535d9849cf29] Error: connect ECONNREFUSED 10.0.3.15:5432";
const DIFF_BT = "--- lab37/roles.guard.ts\n+++ lab37z/roles.guard.ts\n@@ -1,4 +1,5 @@\n-import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';\n+import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';\n+import { AuditSink } from './audit.js';\n import { Reflector } from '@nestjs/core';\n import { timingSafeEqual } from 'node:crypto';\n \n@@ -13,15 +14,19 @@\n /** YC3 — mặc định CHẶN: route nào không @Public đều cần khoá; @Roles ở method ghi đè class. */\n @Injectable()\n export class AuthGuard implements CanActivate {\n-  constructor(private readonly reflector: Reflector) {}\n+  constructor(private readonly reflector: Reflector, private readonly sink: AuditSink) {}\n   canActivate(ctx: ExecutionContext) {\n     const dich = [ctx.getHandler(), ctx.getClass()];\n     if (this.reflector.getAllAndOverride(Public, dich)) return true;\n     const req = ctx.switchToHttp().getRequest();\n     const ai = Object.entries(KHOA).find(([k]) => bang(k, req.header('x-api-key') ?? ''))?.[1];\n-    if (!ai) throw new UnauthorizedException('Thiếu hoặc sai x-api-key');\n+    // BÀI TẬP: lần bị TỪ CHỐI cũng là sự kiện kiểm toán — ghi ở guard, nơi duy nhất vừa biết handler vừa biết lý do\n+    const tuChoi = (ketQua: number, nguoiDung: string | null) => this.sink.ghi({\n+      reqId: req.id, nguoiDung, hanhDong: `${ctx.getClass().name}.${ctx.getHandler().name}`, ketQua, ms: 0 });\n+    if (!ai) { tuChoi(401, null); throw new UnauthorizedException('Thiếu hoặc sai x-api-key'); }\n     req.user = ai;\n     const can = this.reflector.getAllAndOverride(Roles, dich);\n-    return !can || can.some((v) => ai.vaiTro.includes(v));\n+    if (can && !can.some((v) => ai.vaiTro.includes(v))) { tuChoi(403, ai.ten); throw new ForbiddenException(); }\n+    return true;\n   }\n }";
const DIFF_BT_SPEC = "--- lab37/audit.spec.ts\n+++ lab37z/audit.spec.ts\n@@ -32,10 +32,13 @@\n     expect(r.body).toMatchObject({ status: 404, type: 'https://lab-booking.example/errors/ROOM_NOT_FOUND', requestId: r.headers['x-request-id'] });\n     expect(sink.dong[0]).toMatchObject({ hanhDong: 'RoomsController.one', ketQua: 404 });\n   });\n-  it('THỨ TỰ: guard chặn (401/403) ⇒ interceptor CHƯA chạy ⇒ không có dòng kiểm toán', async () => {\n+  it('BÀI TẬP: lần bị từ chối (401/403) cũng được ghi, đúng hành động', async () => {\n     await request(app.getHttpServer()).get('/rooms/1').expect(401);\n     await request(app.getHttpServer()).get('/rooms/1/nhat-ky').set('x-api-key', 'k-sv-0001').expect(403);\n-    expect(sink.dong).toEqual([]);\n+    expect(sink.dong).toMatchObject([\n+      { nguoiDung: null, hanhDong: 'RoomsController.one', ketQua: 401 },\n+      { nguoiDung: 'an', hanhDong: 'RoomsController.nhatKy', ketQua: 403 },\n+    ]);\n   });\n   it('THỨ TỰ: pipe chạy SAU interceptor ⇒ id sai (400) vẫn có dòng kiểm toán', async () => {\n     await request(app.getHttpServer()).get('/rooms/abc').set('x-api-key', 'k-sv-0001').expect(400);";
const OUT_BT = " RUN  v4.1.12 ~/nst-lab\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > thành công: ghi đủ trường, id trả về khớp id trong log 24ms\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > nhận id từ phía trước nếu hợp lệ, thay nếu bẩn 7ms\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > lỗi 404 do service: interceptor vẫn ghi, filter trả problem+json có requestId 4ms\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > BÀI TẬP: lần bị từ chối (401/403) cũng được ghi, đúng hành động 5ms\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > THỨ TỰ: pipe chạy SAU interceptor ⇒ id sai (400) vẫn có dòng kiểm toán 3ms\n ✓ src/lab37z/audit.spec.ts > Lab 3.7 — nhật ký kiểm toán > 500: không lộ IP/cổng DB ra client 3ms\n Test Files  1 passed (1)\n      Tests  6 passed (6)\n   Start at …\n   Duration  626ms (transform 65ms, setup 0ms, import 338ms, tests 110ms, environment 0ms)";

export default {
  title: '3.7 — Lab: An audit trail — request id, timing, role check, unified errors|||3.7 — Lab: Nhật ký kiểm toán — request id, đo thời gian, kiểm vai trò, lỗi thống nhất',
  slug: 'nst-3-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab 90 phút: bốn yêu cầu, mỗi yêu cầu phải đặt đúng một lớp — request id (middleware), dòng kiểm toán Class.method (interceptor), mặc định chặn + vai trò (guard), lỗi problem+json có requestId (filter). Đạt khi 6 test Vitest xanh, trong đó hai test chứng minh thứ tự: guard chặn ⇒ chưa có dòng kiểm toán; pipe lỗi ⇒ vẫn có. Bài tập thêm: ghi cả lần bị từ chối — thử ở filter thất bại (filter không biết handler), làm ở guard thì được. Sự cố thật: Equifax mù giám sát 19 tháng. 5 câu phỏng vấn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab</span>
<h2>3.7 — Lab: every action leaves a trace</h2>
<p class="lead">A university wants an audit trail for the lab-booking API: who did what, when, with what result, and a way to connect a user's complaint to the exact log line. You will build it with the five layers of this chapter — and the main skill being tested is putting each requirement in the right layer.</p>

<h3>The brief (90 min)</h3>
<table>
<thead><tr><th>#</th><th>Requirement</th><th>Pass when</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>Every request has an id; accept a valid upstream <code>x-request-id</code>, otherwise generate a UUID; return it in the header.</td><td><code>gw-123</code> is kept, <code>&lt;script&gt;</code> is replaced.</td></tr>
<tr><td>YC2</td><td>One audit line per handler call: <code>reqId</code>, user, action as <code>Class.method</code>, result status, duration.</td><td>The line's <code>reqId</code> equals the response header; 404 and 400 calls are logged too.</td></tr>
<tr><td>YC3</td><td>Deny by default: every route needs an API key unless marked <code>@Public()</code>; <code>@Roles</code> on a method overrides the class.</td><td>401 without key, 403 for a student on the teacher-only route, <code>GET /rooms</code> open.</td></tr>
<tr><td>YC4</td><td>Every error is problem+json with <code>requestId</code>; 5xx reveals nothing about infrastructure.</td><td>The 500 body contains no IP, no <code>ECONNREFUSED</code>, no stack.</td></tr>
</tbody>
</table>
<p>Starting point: <code>RoomsController</code> below (four routes, one of which crashes on purpose) and the API keys <code>k-sv-0001</code> (student <code>an</code>) and <code>k-gv-0002</code> (teacher <code>binh</code>). Before writing code, write one line per requirement: "YC1 ⇒ layer …, because …". Then compare with the solution.</p>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>

<details><summary>Show solution — layer choices</summary>
<table>
<thead><tr><th>Req.</th><th>Layer</th><th>Why not another</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>Middleware</td><td>Must exist even for 404s and rejected requests, and before anything logs.</td></tr>
<tr><td>YC2</td><td>Interceptor</td><td>Needs <code>Class.method</code> (middleware cannot know it) and the result or error.</td></tr>
<tr><td>YC3</td><td>Global guard (<code>APP_GUARD</code>)</td><td>Needs route metadata; global so new controllers are closed by default.</td></tr>
<tr><td>YC4</td><td>Global filter (<code>APP_FILTER</code>, <code>@Catch()</code>)</td><td>The only layer that sees every error, including those from guards and pipes.</td></tr>
</tbody>
</table>
</details>

<details><summary>Show solution — code</summary>
<pre><code class="language-ts">${esc(MA_RID)}</code></pre>
<pre><code class="language-ts">${esc(MA_SINK)}</code></pre>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<pre><code class="language-ts">${esc(MA_ICP)}</code></pre>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
</details>

<h3>Prove it — tests that pin the order</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Two of these tests are about <em>order</em>, not features. "Guard rejects ⇒ no audit line" holds because the guard runs before the interceptor; "bad id (400) ⇒ audit line exists" holds because pipes run inside the interceptor. If someone later moves the audit into middleware or registers the guard differently, these tests say so immediately.</p>

<h3>Run it like production</h3>
<div class="out">${esc(OUT_CURL)}</div>
<p>The user complaining about the 500 can quote <code>requestId</code> from the response; you grep the same id and find both the audit line and the real error with the database address — which never left the server.</p>
<p>Now look at what is <strong>missing</strong> from the server output: the 403. The student who tried to read the teacher-only log left no trace in the audit trail.</p>

<h3>🕵️ Real incident — Equifax could not see itself being robbed</h3>
<p>Lesson 3.2 described how attackers got into Equifax in 2017. The US House report adds a second failure: a digital certificate on the device that inspected outgoing traffic had been expired for <strong>19 months</strong>, so Equifax had "no visibility on the exfiltration of data during the time of the cyberattack". Over 300 certificates had expired, 79 of them for monitoring business-critical domains. OWASP lists this class of problem as A09 — Security Logging and Monitoring Failures. Attempts that are refused are often the first sign of an attack; an audit trail that only records successes is blind exactly when it matters.</p>

<h3>🧪 Extra exercise (30 min)</h3>
<p>Record denied attempts (401/403) in the audit trail too, with the correct <code>Class.method</code>. Change the "no audit line" test into one that expects two lines.</p>
<details><summary>Show answer</summary>
<p>First attempt (natural idea): write the line in the filter, since 401/403 arrive there. The test failed: <code>"hanhDong": "undefined.undefined"</code>. The <code>ArgumentsHost</code> a filter receives does not carry the handler, so the filter cannot tell which action was attempted. The place that knows both the handler <em>and</em> the reason for refusing is the guard:</p>
<pre><code class="language-diff">${esc(DIFF_BT)}</code></pre>
<pre><code class="language-diff">${esc(DIFF_BT_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
</details>

<h3>🎤 What interviewers ask about Chapter 3</h3>
<ol>
<li><strong>"Middleware, guard, interceptor, pipe, filter — what goes where?"</strong> — Middleware: every HTTP request, no handler knowledge (request id, helmet, CORS). Guard: may it enter (auth, roles). Interceptor: wrap the handler (timing, envelope, cache, timeout). Pipe: transform/validate arguments. Filter: turn errors into responses. Then give the order and one consequence (guard rejects ⇒ interceptor never runs).</li>
<li><strong>"Why <code>APP_GUARD</code> instead of <code>app.useGlobalGuards()</code>?"</strong> — DI (the guard can inject <code>Reflector</code>, config, services) and testability (testing modules include it, <code>overrideProvider</code> can replace it). <code>new X()</code> in <code>main.ts</code> lives outside the container.</li>
<li><strong>"How do you make routes private by default?"</strong> — Global guard + <code>@Public()</code> via <code>Reflector.createDecorator</code>, checked with <code>getAllAndOverride([handler, class])</code>; mention that every guard in the chain must honour <code>@Public</code>, and a test that calls new routes anonymously.</li>
<li><strong>"What should a 500 response contain?"</strong> — A stable shape (problem+json), a request id, a generic sentence. Never <code>err.message</code> or stack of unknown errors — they leak hosts, users, paths (CWE-209). Details go to the log under the same id.</li>
<li><strong>"Your timeout interceptor returns 408 — is the work cancelled?"</strong> — No: RxJS <code>timeout</code> stops waiting; the handler's promise keeps running and its side effects happen. Real cancellation needs an <code>AbortSignal</code> passed to the I/O, and idempotent operations so a client retry is safe.</li>
</ol>

<h3>💼 On the job</h3>
<p>Audit trails are a contractual requirement in banking, insurance and healthcare projects — common clients of Vietnamese outsourcing companies. The requirement document will say things like "log every access to customer data, including failed ones, retain for 5 years". The engineering work is exactly this lab, plus shipping the lines to a store the application cannot modify. Being able to explain why the 403 is logged in the guard and not the filter is the kind of answer that gets noticed in an OJT review.</p>

<h3>📌 Summary</h3>
<ul>
<li>Map each requirement to a layer by asking: does it need the handler? the result? must it run for 404s?</li>
<li>Global guard + interceptor + filter via <code>APP_*</code>; middleware via <code>configure()</code>.</li>
<li>Write tests that pin the order of layers, not only features.</li>
<li>Log denials too — and log them where the handler is known (the guard).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab</span>
<h2>3.7 — Lab: mọi hành động đều để lại dấu vết</h2>
<p class="lead">Một trường đại học muốn có nhật ký kiểm toán cho API đặt phòng lab: ai làm gì, lúc nào, kết quả ra sao, và có cách nối lời phàn nàn của người dùng tới đúng dòng log. Bạn sẽ dựng nó bằng năm lớp của chương này — và kỹ năng chính được kiểm là đặt mỗi yêu cầu vào đúng lớp.</p>

<h3>Đề bài (90 phút)</h3>
<table>
<thead><tr><th>#</th><th>Yêu cầu</th><th>Đạt khi</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>Mọi request có id; nhận <code>x-request-id</code> hợp lệ từ phía trước, không thì sinh UUID; trả lại ở header.</td><td><code>gw-123</code> được giữ, <code>&lt;script&gt;</code> bị thay.</td></tr>
<tr><td>YC2</td><td>Mỗi lần gọi handler một dòng kiểm toán: <code>reqId</code>, người dùng, hành động dạng <code>Class.method</code>, mã kết quả, thời gian.</td><td><code>reqId</code> trong dòng log trùng header phản hồi; lần gọi 404 và 400 cũng được ghi.</td></tr>
<tr><td>YC3</td><td>Mặc định chặn: mọi route cần khoá API trừ khi gắn <code>@Public()</code>; <code>@Roles</code> ở method ghi đè class.</td><td>401 khi không khoá, 403 cho sinh viên ở route chỉ dành cho giảng viên, <code>GET /rooms</code> mở.</td></tr>
<tr><td>YC4</td><td>Mọi lỗi là problem+json có <code>requestId</code>; lỗi 5xx không lộ gì về hạ tầng.</td><td>Body lỗi 500 không có IP, không có <code>ECONNREFUSED</code>, không có stack.</td></tr>
</tbody>
</table>
<p>Điểm xuất phát: <code>RoomsController</code> dưới đây (bốn route, một route cố ý sập) và các khoá API <code>k-sv-0001</code> (sinh viên <code>an</code>), <code>k-gv-0002</code> (giảng viên <code>binh</code>). Trước khi viết mã, viết mỗi yêu cầu một dòng: "YC1 ⇒ lớp …, vì …". Rồi so với lời giải.</p>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>

<details><summary>Xem lời giải — chọn lớp</summary>
<table>
<thead><tr><th>YC</th><th>Lớp</th><th>Vì sao không phải lớp khác</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>Middleware</td><td>Phải có cả với 404 và request bị chặn, và có trước khi bất cứ thứ gì ghi log.</td></tr>
<tr><td>YC2</td><td>Interceptor</td><td>Cần <code>Class.method</code> (middleware không biết) và cần kết quả hoặc lỗi.</td></tr>
<tr><td>YC3</td><td>Guard toàn cục (<code>APP_GUARD</code>)</td><td>Cần metadata của route; toàn cục để controller mới mặc định bị đóng.</td></tr>
<tr><td>YC4</td><td>Filter toàn cục (<code>APP_FILTER</code>, <code>@Catch()</code>)</td><td>Lớp duy nhất thấy mọi lỗi, kể cả lỗi từ guard và pipe.</td></tr>
</tbody>
</table>
</details>

<details><summary>Xem lời giải — mã</summary>
<pre><code class="language-ts">${esc(MA_RID)}</code></pre>
<pre><code class="language-ts">${esc(MA_SINK)}</code></pre>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<pre><code class="language-ts">${esc(MA_ICP)}</code></pre>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
</details>

<h3>Chứng minh — test ghim thứ tự</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Hai trong số các test này nói về <em>thứ tự</em>, không phải tính năng. "Guard chặn ⇒ không có dòng kiểm toán" đúng vì guard chạy trước interceptor; "id sai (400) ⇒ vẫn có dòng kiểm toán" đúng vì pipe chạy bên trong interceptor. Nếu về sau ai đó chuyển việc kiểm toán sang middleware hay đăng ký guard theo cách khác, các test này báo ngay.</p>

<h3>Chạy như production</h3>
<div class="out">${esc(OUT_CURL)}</div>
<p>Người dùng phàn nàn về lỗi 500 đọc được <code>requestId</code> trong phản hồi; bạn tìm đúng mã đó và thấy cả dòng kiểm toán lẫn lỗi thật kèm địa chỉ cơ sở dữ liệu — thứ chưa từng rời khỏi server.</p>
<p>Giờ nhìn thứ <strong>thiếu</strong> trong output của server: lần 403. Sinh viên thử đọc nhật ký dành cho giảng viên không để lại dấu vết nào trong nhật ký kiểm toán.</p>

<h3>🕵️ Sự cố thật — Equifax không thấy mình bị rút ruột</h3>
<p>Bài 3.2 đã kể kẻ tấn công vào Equifax năm 2017 bằng cách nào. Báo cáo của Hạ viện Mỹ còn chỉ ra lỗi thứ hai: chứng chỉ số trên thiết bị soi lưu lượng đi ra đã hết hạn <strong>19 tháng</strong>, nên Equifax "không nhìn thấy việc dữ liệu bị rút ra trong suốt thời gian bị tấn công". Hơn 300 chứng chỉ đã hết hạn, 79 cái trong đó dùng để giám sát các tên miền trọng yếu. OWASP xếp loại vấn đề này là A09 — Lỗi ghi log và giám sát bảo mật. Những lần bị từ chối thường là dấu hiệu đầu tiên của một cuộc tấn công; nhật ký chỉ ghi lần thành công thì bị mù đúng lúc cần nhìn nhất.</p>

<h3>🧪 Bài tập thêm (30 phút)</h3>
<p>Ghi cả những lần bị từ chối (401/403) vào nhật ký kiểm toán, với đúng <code>Class.method</code>. Đổi test "không có dòng kiểm toán" thành test chờ hai dòng.</p>
<details><summary>Xem đáp án</summary>
<p>Thử lần đầu (ý tưởng tự nhiên): ghi ở filter, vì 401/403 đều đi tới đó. Test đỏ: <code>"hanhDong": "undefined.undefined"</code>. <code>ArgumentsHost</code> mà filter nhận không mang theo handler, nên filter không biết hành động nào vừa bị thử. Nơi biết cả handler <em>lẫn</em> lý do từ chối là guard:</p>
<pre><code class="language-diff">${esc(DIFF_BT)}</code></pre>
<pre><code class="language-diff">${esc(DIFF_BT_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi gì về chương 3</h3>
<ol>
<li><strong>"Middleware, guard, interceptor, pipe, filter — cái gì đặt ở đâu?"</strong> — Middleware: mọi request HTTP, không biết handler (request id, helmet, CORS). Guard: có được vào không (xác thực, vai trò). Interceptor: bọc handler (đo thời gian, lớp bọc, cache, timeout). Pipe: biến đổi/kiểm tham số. Filter: biến lỗi thành phản hồi. Rồi nêu thứ tự và một hệ quả (guard chặn ⇒ interceptor không chạy).</li>
<li><strong>"Sao dùng <code>APP_GUARD</code> mà không dùng <code>app.useGlobalGuards()</code>?"</strong> — DI (guard tiêm được <code>Reflector</code>, cấu hình, service) và test được (module test có nó, <code>overrideProvider</code> thay được). <code>new X()</code> trong <code>main.ts</code> nằm ngoài container.</li>
<li><strong>"Làm sao để route mặc định là riêng tư?"</strong> — Guard toàn cục + <code>@Public()</code> tạo bằng <code>Reflector.createDecorator</code>, kiểm bằng <code>getAllAndOverride([handler, class])</code>; nói thêm: mọi guard trong chuỗi phải tôn trọng <code>@Public</code>, và có test gọi route mới khi chưa đăng nhập.</li>
<li><strong>"Phản hồi 500 nên chứa gì?"</strong> — Một dạng ổn định (problem+json), request id, một câu chung chung. Không bao giờ <code>err.message</code> hay stack của lỗi lạ — chúng lộ máy chủ, user, đường dẫn (CWE-209). Chi tiết vào log, cùng mã đó.</li>
<li><strong>"Interceptor timeout trả 408 — việc có bị huỷ không?"</strong> — Không: <code>timeout</code> của RxJS dừng việc chờ; promise của handler vẫn chạy và tác dụng phụ vẫn xảy ra. Huỷ thật cần truyền <code>AbortSignal</code> xuống thao tác I/O, và thao tác lặp lại an toàn (idempotent) để client gửi lại không gây hại.</li>
</ol>

<h3>💼 Đi làm thật</h3>
<p>Nhật ký kiểm toán là yêu cầu ghi trong hợp đồng ở dự án ngân hàng, bảo hiểm, y tế — nhóm khách hàng quen của các công ty outsourcing Việt Nam. Tài liệu yêu cầu sẽ viết kiểu "ghi mọi lần truy cập dữ liệu khách hàng, kể cả lần thất bại, lưu 5 năm". Phần kỹ thuật chính là lab này, cộng việc đẩy các dòng log sang một kho mà ứng dụng không sửa được. Giải thích được vì sao lần 403 được ghi ở guard chứ không ở filter là kiểu câu trả lời được để ý khi đánh giá OJT.</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gán mỗi yêu cầu vào một lớp bằng ba câu hỏi: cần handler không? cần kết quả không? phải chạy cả với 404 không?</li>
<li>Guard, interceptor, filter toàn cục qua <code>APP_*</code>; middleware qua <code>configure()</code>.</li>
<li>Viết test ghim thứ tự các lớp, không chỉ test tính năng.</li>
<li>Ghi cả lần bị từ chối — và ghi ở nơi biết handler (guard).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
