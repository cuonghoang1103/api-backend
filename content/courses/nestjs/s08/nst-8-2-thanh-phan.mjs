/**
 * 8.2 — Test riêng guard, pipe, interceptor và filter (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Nest 12.6.0, @nestjs/testing 12.0, Vitest 4.1.12): scratchpad/nst/lab/c8/moc8/src/thu/b82 —
 * thanh-phan.spec (PermGuard 5 ca, ValidationPipe + CreateBookingDto 6 ca, TimeoutInterceptor + đồng hồ giả — performance.now cũng bị giả,
 * ProblemFilter 404/500), override.e2e.spec (APP_GUARD useClass: overrideGuard & overrideProvider đều 401; useExisting: overrideProvider 200,
 * overrideGuard vẫn 401 — đã đọc testing-module.builder.js: overrideGuard chỉ thay "injectable" khai bằng @UseGuards), bt.spec (JwtAuthGuard 6 ca).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-3-6-thu-tu', title: 'NestJS 3.6 — Thứ tự trong dây chuyền', sub: 'Guard, interceptor, pipe, filter chạy theo thứ tự nào — biết rồi mới test riêng từng khâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-2-2-thoi-gian', title: 'Testing 2.2 — Test thời gian', sub: 'Đồng hồ giả của Vitest: advanceTimersByTime, Date, và cái giá khi quên useRealTimers.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Testing 5.2 — Test xác thực API', sub: 'Token thật, token giả, token hết hạn — cùng bộ ca ở mức HTTP.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Testing: overriding globally registered enhancers', 'Guard/pipe toàn cục khai bằng APP_GUARD nên dùng useExisting để test thay được.', 'https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers'),
  nguon('📘', 'NestJS docs — Execution context', 'ExecutionContext, ArgumentsHost, switchToHttp — những thứ test phải làm giả.', 'https://docs.nestjs.com/fundamentals/execution-context'),
  nguon('📘', 'Vitest — Fake timers (vi.useFakeTimers)', 'advanceTimersByTimeAsync; mặc định giả cả Date và performance.', 'https://vitest.dev/api/vi.html#vi-usefaketimers'),
].join('\n');
const MA_GUARD = "// —— 1. Guard: một ExecutionContext giả + Reflector THẬT đọc metadata của handler thật\nclass Thu {\n  @Public() mo() {}\n  @AnyUser() aiCungDuoc() {}\n  @CanPerm('room:write') taoPhong() {}\n  quenKhai() {}\n}\nconst ctx = (handler: keyof Thu, role?: string) => createMock<ExecutionContext>({\n  getHandler: () => Thu.prototype[handler], getClass: () => Thu,\n  switchToHttp: () => ({ getRequest: () => ({ user: role && { id: 1, role } }) }),\n});\ndescribe('PermGuard', () => {\n  const guard = new PermGuard(new Reflector());\n  it.each([\n    ['mo', undefined, 'cho qua'], ['aiCungDuoc', 'STUDENT', 'cho qua'], ['taoPhong', 'ADMIN', 'cho qua'],\n    ['taoPhong', 'STUDENT', 'Cần quyền room:write'], ['quenKhai', 'ADMIN', 'Route chưa khai quyền'],\n  ] as const)('%s + %s ⇒ %s', (h, role, mong) => {\n    let kq: string; try { guard.canActivate(ctx(h, role)); kq = 'cho qua'; } catch (e) { kq = (e as Error).message; }\n    expect(kq).toBe(mong);\n  });\n});";
const MA_PIPE = "// —— 2. Pipe: gọi ValidationPipe.transform như Nest gọi, với metatype là DTO thật\ndescribe('ValidationPipe + CreateBookingDto', () => {\n  const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: true });\n  const hop = { roomId: 1, start: '2027-01-05T07:30:00+07:00', end: '2027-01-05T09:30:00+07:00', attendees: 5 };\n  const thu = (body: object) => pipe.transform(body, { type: 'body', metatype: CreateBookingDto }).then(\n    (v) => `OK ${v.constructor.name}`, (e: BadRequestException) => (e.getResponse() as { message: string[] }).message.join(' | '));\n  it.each([\n    ['hợp lệ', {}],\n    ['ngày 30/02', { start: '2027-02-30T07:30:00+07:00' }],\n    ['thiếu múi giờ', { start: '2027-01-05T07:30:00' }],\n    ['07:15 lệch bước 30 phút', { start: '2027-01-05T07:15:00+07:00' }],\n    ['roomId chuỗi \"1\"', { roomId: '1' }],\n    ['thêm studentId', { studentId: 'SE170002' }],\n  ])('%s', async (ten, sua) => { console.log(`${ten.padEnd(24)} → ${await thu({ ...hop, ...sua })}`); });\n});";
const MA_INT = "// —— 3. Interceptor: CallHandler giả trả Observable; đồng hồ giả cho timeout\n@Injectable() class TimeoutInterceptor implements NestInterceptor {\n  constructor(private readonly ms = 5000) {}\n  intercept(_: ExecutionContext, next: CallHandler) {\n    return next.handle().pipe(timeout(this.ms), catchError((e) => throwError(() => (e instanceof TimeoutError ? new RequestTimeoutException() : e))));\n  }\n}\ndescribe('TimeoutInterceptor', () => {\n  afterEach(() => { vi.useRealTimers(); });\n  const cham = (ms: number): CallHandler => ({ handle: () => of('xong').pipe(delay(ms)) });\n  it('handler 4,9 s ⇒ trả kết quả', async () => {\n    vi.useFakeTimers();\n    const p = lastValueFrom(new TimeoutInterceptor().intercept(createMock<ExecutionContext>(), cham(4900)));\n    await vi.advanceTimersByTimeAsync(4900);\n    expect(await p).toBe('xong');\n  });\n  it('handler 6 s ⇒ 408, test chạy trong vài ms', async () => {\n    vi.useFakeTimers(); const t0 = performance.now(), h0 = process.hrtime.bigint();\n    const p = lastValueFrom(new TimeoutInterceptor().intercept(createMock<ExecutionContext>(), cham(6000)));\n    const kq = expect(p).rejects.toBeInstanceOf(RequestTimeoutException);\n    await vi.advanceTimersByTimeAsync(5000); await kq;\n    console.log(`performance.now() đo được ${(performance.now() - t0).toFixed(1)} ms — process.hrtime đo được ${(Number(process.hrtime.bigint() - h0) / 1e6).toFixed(1)} ms`);\n  });\n});";
const MA_FIL = "// —— 4. Filter: ArgumentsHost giả + HttpAdapterHost giả; ghi lại reply\ndescribe('ProblemFilter', () => {\n  const chay = (err: unknown) => {\n    const reply = vi.fn(), setHeader = vi.fn();\n    const f = new ProblemFilter({ httpAdapter: { reply, setHeader } } as never);\n    const req = { id: 'req-1', originalUrl: '/bookings/9' };\n    f.catch(err, createMock<ArgumentsHost>({ switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({}) }) }));\n    return { body: reply.mock.calls[0][1], status: reply.mock.calls[0][2], ct: setHeader.mock.calls[0][2] };\n  };\n  it('HttpException có errorCode ⇒ type mang mã lỗi', () => {\n    const r = chay(new HttpException('không có lịch 9', 404, { errorCode: 'BOOKING_NOT_FOUND' } as never));\n    console.log(r.status, r.ct, JSON.stringify(r.body));\n  });\n  it('lỗi lạ (lộ tên bảng) ⇒ 500, detail không lộ gì', () => {\n    const log = vi.spyOn(console, 'error').mockImplementation(() => {});\n    const r = chay(new Error('relation \"bookings\" does not exist'));\n    console.log(r.status, JSON.stringify(r.body)); log.mockRestore();\n    expect(JSON.stringify(r.body)).not.toContain('bookings\"');\n  });\n});";
const MA_MOCK = "// tao-mock.ts — 8 dòng thay cho @golevelup/ts-vitest: đối tượng giả, gọi hàm nào chưa khai thì báo rõ tên\nexport function createMock<T extends object>(khai: Partial<Record<keyof T, unknown>> = {}): T {\n  return new Proxy(khai as T, {\n    get(t, k) {\n      if (k in t) return (t as any)[k];\n      if (k === 'then' || typeof k === 'symbol') return undefined;   // để await/console.log không vấp\n      return () => { throw new Error(`mock chưa khai: ${String(k)}()`); };\n    },\n  });\n}";
const OUT_TP = " RUN  v4.1.12 /home/sv/app\nhợp lệ                   → OK CreateBookingDto\nngày 30/02               → start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút\nthiếu múi giờ            → start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút\n07:15 lệch bước 30 phút  → start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút\nroomId chuỗi \"1\"         → roomId must be an integer number\nthêm studentId           → property studentId should not exist\nperformance.now() đo được 5000.0 ms — process.hrtime đo được 5000.0 ms\n404 application/problem+json {\"type\":\"https://lab-booking.example/errors/BOOKING_NOT_FOUND\",\"title\":\"HttpException\",\"status\":404,\"detail\":\"không có lịch 9\",\"instance\":\"/bookings/9\",\"requestId\":\"req-1\"}\n[Nest] ERROR [Loi] [req-1] Error: relation \"bookings\" does not exist\n    at /home/sv/app/src/thu/b82/thanh-phan.spec.ts:89:20\n    … (9 dòng stack của Vitest)\n500 {\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\":\"Lỗi phía máy chủ — đã ghi log.\",\"instance\":\"/bookings/9\",\"requestId\":\"req-1\"}\n ✓ src/thu/b82/thanh-phan.spec.ts > PermGuard > mo + undefined ⇒ cho qua 3ms\n ✓ src/thu/b82/thanh-phan.spec.ts > PermGuard > aiCungDuoc + STUDENT ⇒ cho qua 0ms\n ✓ src/thu/b82/thanh-phan.spec.ts > PermGuard > taoPhong + ADMIN ⇒ cho qua 0ms\n ✓ src/thu/b82/thanh-phan.spec.ts > PermGuard > taoPhong + STUDENT ⇒ Cần quyền room:write 1ms\n ✓ src/thu/b82/thanh-phan.spec.ts > PermGuard > quenKhai + ADMIN ⇒ Route chưa khai quyền 0ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > hợp lệ 5ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > ngày 30/02 2ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > thiếu múi giờ 1ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > 07:15 lệch bước 30 phút 1ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > roomId chuỗi \"1\" 1ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ValidationPipe + CreateBookingDto > thêm studentId 1ms\n ✓ src/thu/b82/thanh-phan.spec.ts > TimeoutInterceptor > handler 4,9 s ⇒ trả kết quả 6ms\n ✓ src/thu/b82/thanh-phan.spec.ts > TimeoutInterceptor > handler 6 s ⇒ 408, test chạy trong vài ms 4ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ProblemFilter > HttpException có errorCode ⇒ type mang mã lỗi 2ms\n ✓ src/thu/b82/thanh-phan.spec.ts > ProblemFilter > lỗi lạ (lộ tên bảng) ⇒ 500, detail không lộ gì 5ms\n Test Files  1 passed (1)\n      Tests  15 passed (15)\n   Duration  664ms (transform 74ms, setup 0ms, import 411ms, tests 35ms, environment 0ms)";
const MA_OVR = "// b82/override.e2e.spec.ts — muốn bỏ qua đăng nhập trong test: overrideGuard có ăn với APP_GUARD useClass không?\nimport 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { ExecutionContext } from '@nestjs/common';\nimport { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';\nconst { AppModule } = await import('../../app.module.js');\n\nconst gia = { canActivate: (c: ExecutionContext) => { c.switchToHttp().getRequest().user = { id: 4, role: 'STUDENT', studentCode: 'SE170001' }; return true; } };\n\nit('overrideGuard(JwtAuthGuard) với APP_GUARD useClass', async () => {\n  const m = await Test.createTestingModule({ imports: [AppModule] }).overrideGuard(JwtAuthGuard).useValue(gia).compile();\n  const app = m.createNestApplication({ logger: false }); await app.init();\n  const r = await request(app.getHttpServer()).get('/bookings/mine');\n  console.log('overrideGuard     →', r.status, r.body.detail ?? JSON.stringify(r.body));\n  await app.close();\n});\nit('overrideProvider(JwtAuthGuard) với APP_GUARD useClass', async () => {\n  const m = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(JwtAuthGuard).useValue(gia).compile();\n  const app = m.createNestApplication({ logger: false }); await app.init();\n  const r = await request(app.getHttpServer()).get('/bookings/mine');\n  console.log('overrideProvider  →', r.status, r.body.detail ?? JSON.stringify(r.body));\n  await app.close();\n});";
const OUT_OVR = " RUN  v4.1.12 /home/sv/app\noverrideGuard     → 401 Thiếu Bearer token\noverrideProvider  → 401 Thiếu Bearer token\n ✓ src/thu/b82/override.e2e.spec.ts > overrideGuard(JwtAuthGuard) với APP_GUARD useClass 126ms\n ✓ src/thu/b82/override.e2e.spec.ts > overrideProvider(JwtAuthGuard) với APP_GUARD useClass 31ms\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n   Start at  07:55:07\n   Duration  2.32s (transform 206ms, setup 303ms, import 455ms, tests 316ms, environment 0ms)";
const MA_APPMOD = "    { provide: APP_GUARD, useClass: ThrottlerGuard },   // thứ tự = thứ tự chạy: đếm trước (kể cả request không token)\n    // mốc 8: useExisting + khai lớp riêng ⇒ test thay được bằng overrideGuard/overrideProvider (useClass thì không)\n    { provide: APP_GUARD, useExisting: JwtAuthGuard },  // ai đang gọi\n    { provide: APP_GUARD, useExisting: PermGuard },     // được làm gì\n    JwtAuthGuard, PermGuard,";
const OUT_OVR2 = " RUN  v4.1.12 /home/sv/app\noverrideGuard     → 401 Thiếu Bearer token\noverrideProvider  → 200 []\nuseExisting + overrideGuard → 401 {\"type\":\"https://lab-booking.example/errors/401\",\"title\":\"UnauthorizedException\",\"status\":401,\"detail\":\"Thiếu Bearer token\",\"instance\":\"/bookings/mine\",\"requestId\":\"c36caa45-d5d6-4947-961a-d9cebeec381b\"}\n ✓ src/thu/b82/override.e2e.spec.ts > overrideGuard(JwtAuthGuard) với APP_GUARD useClass 117ms\n ✓ src/thu/b82/override.e2e.spec.ts > overrideProvider(JwtAuthGuard) với APP_GUARD useClass 42ms\n ✓ src/thu/b82/override.e2e.spec.ts > sau khi sửa AppModule: useExisting — overrideGuard ăn 33ms\n Test Files  1 passed (1)\n      Tests  3 passed (3)\n   Start at  07:55:18\n   Duration  2.36s (transform 314ms, setup 350ms, import 480ms, tests 332ms, environment 0ms)";
const MA_BT = "// b82/bt.spec.ts — bài tập 8.2: JwtAuthGuard với JwtService THẬT (ký/kiểm thật) và DB giả\nimport { ExecutionContext } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { JwtService } from '@nestjs/jwt';\nimport { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';\nimport type { PrismaService } from '../../prisma/prisma.service.js';\nimport { createMock } from './tao-mock.js';\n\nconst jwt = new JwtService({ secret: 'khoa-test-dai-hon-32-ky-tu-cho-8-2', signOptions: { expiresIn: '15m' } });\nconst db = { user: { findUnique: vi.fn() } };\nconst guard = new JwtAuthGuard(jwt, new Reflector(), db as unknown as PrismaService);\nclass C { route() {} }\nconst goi = async (authorization?: string) => {\n  const req: { headers: object; user?: unknown } = { headers: authorization ? { authorization } : {} };\n  const ctx = createMock<ExecutionContext>({ getHandler: () => C.prototype.route, getClass: () => C, switchToHttp: () => ({ getRequest: () => req }) });\n  try { await guard.canActivate(ctx); return `cho qua, req.user = ${JSON.stringify(req.user)}`; } catch (e) { return `${(e as Error).constructor.name}: ${(e as Error).message}`; }\n};\nbeforeEach(() => db.user.findUnique.mockResolvedValue({ id: 4, role: 'STUDENT', studentCode: 'SE170001', tokenVersion: 1 }));\nvi.spyOn(console, 'warn').mockImplementation(() => {});\n\nit.each([\n  ['không header', undefined],\n  ['\"Bearer\" thiếu token', 'Bearer '],\n  ['token ký khoá khác', `Bearer ${new JwtService({ secret: 'khoa-khac-hoan-toan-dai-hon-32-ky-tu' }).sign({ sub: '4', ver: 1 })}`],\n  ['token hết hạn', `Bearer ${jwt.sign({ sub: '4', ver: 1 }, { expiresIn: -1 })}`],\n  ['ver cũ (0 ≠ 1)', `Bearer ${jwt.sign({ sub: '4', ver: 0 })}`],\n  ['token đúng', `Bearer ${jwt.sign({ sub: '4', ver: 1 })}`],\n])('%s', async (ten, h) => { console.log(`${ten.padEnd(22)} → ${await goi(h)}`); });";
const OUT_BT = " RUN  v4.1.12 /home/sv/app\nkhông header           → UnauthorizedException: Thiếu Bearer token\n\"Bearer\" thiếu token   → UnauthorizedException: Thiếu Bearer token\n[Nest] WARN [JwtAuthGuard] token bị từ chối: invalid signature\ntoken ký khoá khác     → UnauthorizedException: Token không hợp lệ hoặc đã hết hạn\n[Nest] WARN [JwtAuthGuard] token bị từ chối: jwt expired\ntoken hết hạn          → UnauthorizedException: Token không hợp lệ hoặc đã hết hạn\nver cũ (0 ≠ 1)         → UnauthorizedException: Phiên đã bị thu hồi\ntoken đúng             → cho qua, req.user = {\"id\":4,\"role\":\"STUDENT\",\"studentCode\":\"SE170001\"}\n ✓ src/thu/b82/bt.spec.ts > không header 3ms\n ✓ src/thu/b82/bt.spec.ts > \"Bearer\" thiếu token 0ms\n ✓ src/thu/b82/bt.spec.ts > token ký khoá khác 2ms\n ✓ src/thu/b82/bt.spec.ts > token hết hạn 1ms\n ✓ src/thu/b82/bt.spec.ts > ver cũ (0 ≠ 1) 0ms\n ✓ src/thu/b82/bt.spec.ts > token đúng 0ms\n Test Files  1 passed (1)\n      Tests  6 passed (6)\n   Start at  07:56:24\n   Duration  563ms (transform 87ms, setup 0ms, import 378ms, tests 8ms, environment 0ms)";

export default {
  title: '8.2 — Testing guards, pipes, interceptors and filters on their own|||8.2 — Test riêng guard, pipe, interceptor và filter',
  slug: 'nst-8-2-thanh-phan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi khâu của dây chuyền Nest test riêng được mà không dựng ứng dụng: PermGuard với ExecutionContext giả và Reflector thật, ValidationPipe gọi thẳng trên DTO thật, interceptor với CallHandler giả và đồng hồ giả, filter với ArgumentsHost giả. Kèm một bẫy đo thật: guard toàn cục khai bằng APP_GUARD useClass thì cả overrideGuard lẫn overrideProvider đều không thay được (401); đổi sang useExisting thì overrideProvider ăn, overrideGuard vẫn không.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>8.2 — One stage of the pipeline at a time</h2>
<p class="lead">Guards, pipes, interceptors and filters are ordinary classes with one method each: <code>canActivate</code>, <code>transform</code>, <code>intercept</code>, <code>catch</code>. Nest calls them with a context object; a test can call them with a fake one. That is far faster than booting the app for each case, and when a table of 20 cases fails, you know exactly which stage is wrong. At the end of the lesson: how to replace a <em>global</em> guard in an e2e test — the documented way, and the way that silently does nothing.</p>

<h3>Everyday analogy: testing one station of an assembly line</h3>
<p>A car factory does not build a whole car to check whether the paint robot works. It puts a bare door in front of the robot and measures the paint. The "bare door" for a guard is an <code>ExecutionContext</code> that returns just the handler, the class and a request.</p>

<h3>0. A tiny helper instead of a library</h3>
<p>Nest contexts have many methods (<code>switchToRpc</code>, <code>getArgs</code>…). Writing them all is noise; <code>@golevelup/ts-vitest</code> provides <code>createMock</code> for that. Eight lines do the same and tell you exactly which method you forgot to fake:</p>
<pre><code class="language-ts">${esc(MA_MOCK)}</code></pre>

<h3>1. Guard: fake context, real Reflector, real metadata</h3>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<p>The trick is the small class <code>Thu</code>: its methods carry the <strong>real decorators</strong> (<code>@Public</code>, <code>@CanPerm</code>…), so the real <code>Reflector</code> reads real metadata. Faking the Reflector instead would test nothing but your fake. The last row — a handler with no decorator at all — is the "closed by default" rule from lesson 7.3, and lab 8.5 will show that no existing test covered it.</p>

<h3>2. Pipe: call transform exactly as Nest does</h3>
<pre><code class="language-ts">${esc(MA_PIPE)}</code></pre>
<p><code>metatype: CreateBookingDto</code> is what Nest passes from the parameter type — so the DTO's real decorators run, including the custom <code>KhungGio</code> validator from lesson 3.3. One <code>it.each</code> row per edge case reads like a specification.</p>

<h3>3. Interceptor: a fake CallHandler and a fake clock</h3>
<pre><code class="language-ts">${esc(MA_INT)}</code></pre>
<p>A <code>CallHandler</code> is just <code>{ handle: () =&gt; Observable }</code>, so <code>of('xong').pipe(delay(6000))</code> plays a slow handler. <code>lastValueFrom</code> turns the Observable into a promise. With <code>vi.useFakeTimers()</code> the 5-second timeout fires in a few milliseconds.</p>

<h3>4. Filter: a fake host that records the reply</h3>
<pre><code class="language-ts">${esc(MA_FIL)}</code></pre>

<h3>Running the four</h3>
<div class="out">${esc(OUT_TP)}</div>
<ul>
<li>15 tests in 35 ms of test time. The same cases through HTTP would boot the app and touch the database.</li>
<li>The pipe rows show both the custom message and class-validator's own (<code>roomId must be an integer number</code>, <code>property studentId should not exist</code>).</li>
<li><strong>A trap in the timer test</strong>: <code>performance.now()</code> and <code>process.hrtime</code> both "measured" 5000 ms — Vitest's fake timers fake them too. The real duration is the reporter's <code>4ms</code>. Never measure performance inside a test that uses fake timers.</li>
<li>The filter writes the 500 with a stack trace to the log (with the request id) and sends the client a generic sentence — the test asserts the body does not contain the table name. Lesson 3.2 explained why.</li>
</ul>

<h3>5. Replacing a global guard in an e2e test — a trap measured for real</h3>
<p>For e2e tests of booking logic you may want to skip JWT: "pretend the caller is An". The obvious attempt on the mốc 7 <code>AppModule</code>, which registers guards with <code>{ provide: APP_GUARD, useClass: JwtAuthGuard }</code>:</p>
<pre><code class="language-ts">${esc(MA_OVR)}</code></pre>
<div class="out">${esc(OUT_OVR)}</div>
<p>Both tests are "green" (they only log), and both requests still hit the real guard: 401. Why: with <code>useClass</code> under the <code>APP_GUARD</code> token, <code>JwtAuthGuard</code> is not a provider of its own, so there is nothing named <code>JwtAuthGuard</code> to override. The fix recommended by the Nest docs — <code>useExisting</code> plus listing the class as a provider (now in the mốc 8 <code>AppModule</code>):</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<div class="out">${esc(OUT_OVR2)}</div>
<p>Now <code>overrideProvider</code> works (200, empty list) — but <code>overrideGuard</code> still does not. Reading <code>@nestjs/testing/testing-module.builder.js</code> explains it: <code>overrideGuard</code> replaces only <em>injectables</em> attached with <code>@UseGuards(...)</code>; a guard registered as a provider is replaced with <code>overrideProvider</code>. Two lessons: for global enhancers use <code>useExisting</code> + <code>overrideProvider</code>; and a test that only logs proves nothing — the real version asserts <code>.expect(200)</code>.</p>

<h3>🧪 Exercise (15 min) — JwtAuthGuard, six tokens</h3>
<p>Unit-test <code>JwtAuthGuard</code> of the project with a <strong>real</strong> <code>JwtService</code> (so signatures and expiry are checked for real) and a fake user table. Cases: no header; "Bearer " with nothing; token signed with another key; expired token; token whose <code>ver</code> no longer matches the user's <code>tokenVersion</code>; a good token (check <code>req.user</code>).</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Do not fake <code>JwtService</code> here: "verify throws ⇒ 401" with a fake proves only that your fake throws. Signing real tokens costs microseconds.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you unit-test a guard?</strong> Instantiate it, pass an <code>ExecutionContext</code> fake returning the handler, the class and the request; keep the real <code>Reflector</code> and put real decorators on a small test class.</li>
<li><strong>How do you test a pipe with a DTO?</strong> <code>pipe.transform(value, { type: 'body', metatype: Dto })</code> and inspect the result or the <code>BadRequestException</code>.</li>
<li><strong>How do you replace a global guard in tests?</strong> Register it with <code>{ provide: APP_GUARD, useExisting: X }</code> and list <code>X</code> as a provider; then <code>overrideProvider(X)</code>. <code>overrideGuard</code> is for <code>@UseGuards</code>.</li>
<li><strong>Why unit tests for these when e2e tests exist?</strong> Speed and precision: 20 edge cases of a pipe in milliseconds, and a red test that names the stage. Keep a few e2e tests for the wiring.</li>
</ol>

<h3>💼 On the job</h3>
<p>A teammate's PR adds <code>.overrideGuard(AuthGuard).useValue({ canActivate: () =&gt; true })</code> and the e2e tests "pass" — because they only checked the response shape. In review, ask for one assertion on the status code of a protected route, and for the global guard to be registered with <code>useExisting</code>. That review comment is worth more than the feature it reviews: a test helper that silently does nothing makes every future test lie.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ExecutionContext / ArgumentsHost</span><span class="v">The object Nest passes to guards/interceptors / filters; fake it with only the methods used.</span></div>
  <div class="kv"><span class="k">CallHandler</span><span class="v">{ handle(): Observable } — the rest of the pipeline seen from an interceptor.</span></div>
  <div class="kv"><span class="k">metatype</span><span class="v">The parameter type Nest passes to a pipe (the DTO class).</span></div>
  <div class="kv"><span class="k">APP_GUARD + useExisting</span><span class="v">Global guard that is also a normal provider — replaceable with overrideProvider.</span></div>
  <div class="kv"><span class="k">overrideGuard</span><span class="v">Replaces guards attached with @UseGuards, not provider-registered ones.</span></div>
  <div class="kv"><span class="k">Fake timers</span><span class="v">vi.useFakeTimers(): setTimeout, Date and performance follow a manual clock.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Each pipeline stage is a class with one method; call it with a minimal fake context.</li>
<li>Keep real metadata and real collaborators where they are cheap (Reflector, JwtService, DTO decorators).</li>
<li>Fake timers make timeouts instant — and fake <code>performance.now()</code> too.</li>
<li>Global guards: <code>useExisting</code> + <code>overrideProvider</code>. With <code>useClass</code>, neither override method has any effect (measured: 401 both times).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>8.2 — Mỗi lần một khâu của dây chuyền</h2>
<p class="lead">Guard, pipe, interceptor, filter là những lớp bình thường, mỗi lớp một hàm: <code>canActivate</code>, <code>transform</code>, <code>intercept</code>, <code>catch</code>. Nest gọi chúng với một đối tượng ngữ cảnh; test gọi chúng với ngữ cảnh giả. Nhanh hơn nhiều so với khởi động ứng dụng cho từng ca, và khi một bảng 20 ca đỏ, bạn biết ngay khâu nào sai. Cuối bài: cách thay một guard <em>toàn cục</em> trong test e2e — cách tài liệu khuyên, và cách lặng lẽ không làm gì cả.</p>

<h3>Liên hệ đời thường: thử một trạm của dây chuyền lắp ráp</h3>
<p>Nhà máy ô tô không lắp nguyên chiếc xe chỉ để xem robot sơn có chạy không. Họ đặt một cánh cửa trần trước robot rồi đo lớp sơn. "Cánh cửa trần" của guard là một <code>ExecutionContext</code> chỉ trả handler, lớp và request.</p>

<h3>0. Một hàm phụ nhỏ thay cho thư viện</h3>
<p>Ngữ cảnh của Nest có nhiều hàm (<code>switchToRpc</code>, <code>getArgs</code>…). Viết hết thì rối; <code>@golevelup/ts-vitest</code> có <code>createMock</code> để lo việc đó. Tám dòng làm được y vậy và còn báo đúng tên hàm bạn quên làm giả:</p>
<pre><code class="language-ts">${esc(MA_MOCK)}</code></pre>

<h3>1. Guard: ngữ cảnh giả, Reflector thật, metadata thật</h3>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<p>Mẹo nằm ở lớp nhỏ <code>Thu</code>: các hàm của nó mang <strong>decorator thật</strong> (<code>@Public</code>, <code>@CanPerm</code>…), nên <code>Reflector</code> thật đọc metadata thật. Làm giả Reflector thì chỉ test được đồ giả của bạn. Dòng cuối — handler không có decorator nào — là luật "mặc định đóng" của bài 7.3, và lab 8.5 sẽ cho thấy chưa test nào có sẵn phủ nó.</p>

<h3>2. Pipe: gọi transform đúng như Nest gọi</h3>
<pre><code class="language-ts">${esc(MA_PIPE)}</code></pre>
<p><code>metatype: CreateBookingDto</code> là thứ Nest truyền vào từ kiểu của tham số — nên decorator thật của DTO chạy, kể cả validator tự viết <code>KhungGio</code> của bài 3.3. Mỗi ca biên một dòng <code>it.each</code>, đọc như một bản đặc tả.</p>

<h3>3. Interceptor: CallHandler giả và đồng hồ giả</h3>
<pre><code class="language-ts">${esc(MA_INT)}</code></pre>
<p><code>CallHandler</code> chỉ là <code>{ handle: () =&gt; Observable }</code>, nên <code>of('xong').pipe(delay(6000))</code> đóng vai một handler chậm. <code>lastValueFrom</code> biến Observable thành promise. Với <code>vi.useFakeTimers()</code>, timeout 5 giây nổ sau vài mili giây.</p>

<h3>4. Filter: host giả ghi lại câu trả lời</h3>
<pre><code class="language-ts">${esc(MA_FIL)}</code></pre>

<h3>Chạy cả bốn</h3>
<div class="out">${esc(OUT_TP)}</div>
<ul>
<li>15 test trong 35 ms thời gian test. Cùng các ca đó qua HTTP thì phải khởi động ứng dụng và chạm DB.</li>
<li>Các dòng của pipe cho thấy cả câu báo tự viết lẫn câu của class-validator (<code>roomId must be an integer number</code>, <code>property studentId should not exist</code>).</li>
<li><strong>Một bẫy trong test hẹn giờ</strong>: <code>performance.now()</code> và <code>process.hrtime</code> đều "đo được" 5000 ms — đồng hồ giả của Vitest giả luôn cả hai. Thời gian thật là <code>4ms</code> của reporter. Đừng bao giờ đo hiệu năng trong test đang bật đồng hồ giả.</li>
<li>Filter ghi lỗi 500 kèm stack vào log (có request id) và gửi client một câu chung chung — test khẳng định body không chứa tên bảng. Bài 3.2 đã giải thích vì sao.</li>
</ul>

<h3>5. Thay guard toàn cục trong test e2e — một bẫy đo thật</h3>
<p>Với test e2e cho logic đặt lịch, bạn có thể muốn bỏ qua JWT: "coi như người gọi là An". Cách làm hiển nhiên trên <code>AppModule</code> của mốc 7, nơi guard khai bằng <code>{ provide: APP_GUARD, useClass: JwtAuthGuard }</code>:</p>
<pre><code class="language-ts">${esc(MA_OVR)}</code></pre>
<div class="out">${esc(OUT_OVR)}</div>
<p>Cả hai test đều "xanh" (chúng chỉ in ra), và cả hai request vẫn đi qua guard thật: 401. Lý do: với <code>useClass</code> dưới token <code>APP_GUARD</code>, <code>JwtAuthGuard</code> không phải một provider riêng, nên chẳng có gì tên <code>JwtAuthGuard</code> để thay. Cách sửa tài liệu Nest khuyên — <code>useExisting</code> và khai lớp đó thành provider (đã đưa vào <code>AppModule</code> mốc 8):</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<div class="out">${esc(OUT_OVR2)}</div>
<p>Giờ <code>overrideProvider</code> ăn (200, danh sách rỗng) — nhưng <code>overrideGuard</code> vẫn không. Đọc <code>@nestjs/testing/testing-module.builder.js</code> sẽ hiểu: <code>overrideGuard</code> chỉ thay các <em>injectable</em> gắn bằng <code>@UseGuards(...)</code>; guard khai thành provider thì thay bằng <code>overrideProvider</code>. Hai bài học: enhancer toàn cục thì dùng <code>useExisting</code> + <code>overrideProvider</code>; và test chỉ in ra thì không chứng minh gì — bản thật phải có <code>.expect(200)</code>.</p>

<h3>🧪 Thực hành (15 phút) — JwtAuthGuard, sáu token</h3>
<p>Test đơn vị <code>JwtAuthGuard</code> của dự án với <code>JwtService</code> <strong>thật</strong> (để chữ ký và hạn dùng được kiểm thật) và bảng người dùng giả. Các ca: không header; "Bearer " trống; token ký bằng khoá khác; token hết hạn; token có <code>ver</code> không còn khớp <code>tokenVersion</code>; token đúng (kiểm <code>req.user</code>).</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Đừng làm giả <code>JwtService</code> ở đây: "verify ném lỗi ⇒ 401" với đồ giả chỉ chứng minh đồ giả của bạn biết ném lỗi. Ký token thật chỉ tốn vài micro giây.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test đơn vị một guard thế nào?</strong> Tạo guard, truyền <code>ExecutionContext</code> giả trả handler, lớp và request; giữ <code>Reflector</code> thật và gắn decorator thật lên một lớp test nhỏ.</li>
<li><strong>Test một pipe với DTO thế nào?</strong> <code>pipe.transform(value, { type: 'body', metatype: Dto })</code> rồi xem kết quả hoặc <code>BadRequestException</code>.</li>
<li><strong>Thay guard toàn cục trong test thế nào?</strong> Khai bằng <code>{ provide: APP_GUARD, useExisting: X }</code> và khai <code>X</code> thành provider; rồi <code>overrideProvider(X)</code>. <code>overrideGuard</code> dành cho <code>@UseGuards</code>.</li>
<li><strong>Đã có e2e sao còn test riêng các khâu?</strong> Tốc độ và độ chính xác: 20 ca biên của pipe trong vài mili giây, và test đỏ chỉ thẳng khâu hỏng. Giữ một ít e2e cho phần dây nối.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>PR của đồng nghiệp thêm <code>.overrideGuard(AuthGuard).useValue({ canActivate: () =&gt; true })</code> và test e2e "qua hết" — vì chúng chỉ kiểm hình dạng phản hồi. Khi review, hãy đề nghị thêm một khẳng định mã trạng thái cho route có bảo vệ, và đổi guard toàn cục sang <code>useExisting</code>. Lời review đó giá trị hơn cả tính năng được review: một hàm phụ test lặng lẽ không làm gì sẽ khiến mọi test sau này nói dối.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ExecutionContext / ArgumentsHost</span><span class="v">Đối tượng Nest truyền cho guard/interceptor / filter; làm giả đúng các hàm được dùng.</span></div>
  <div class="kv"><span class="k">CallHandler</span><span class="v">{ handle(): Observable } — phần còn lại của dây chuyền nhìn từ interceptor.</span></div>
  <div class="kv"><span class="k">metatype</span><span class="v">Kiểu của tham số mà Nest truyền cho pipe (lớp DTO).</span></div>
  <div class="kv"><span class="k">APP_GUARD + useExisting</span><span class="v">Guard toàn cục đồng thời là provider thường — thay được bằng overrideProvider.</span></div>
  <div class="kv"><span class="k">overrideGuard</span><span class="v">Thay guard gắn bằng @UseGuards, không thay guard khai thành provider.</span></div>
  <div class="kv"><span class="k">Đồng hồ giả</span><span class="v">vi.useFakeTimers(): setTimeout, Date và performance chạy theo đồng hồ tay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi khâu dây chuyền là một lớp một hàm; gọi nó với ngữ cảnh giả tối thiểu.</li>
<li>Giữ metadata thật và cộng sự thật khi chúng rẻ (Reflector, JwtService, decorator của DTO).</li>
<li>Đồng hồ giả làm timeout nổ tức thì — và giả luôn <code>performance.now()</code>.</li>
<li>Guard toàn cục: <code>useExisting</code> + <code>overrideProvider</code>. Với <code>useClass</code>, cả hai cách override đều vô tác dụng (đo thật: 401 cả hai lần).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
