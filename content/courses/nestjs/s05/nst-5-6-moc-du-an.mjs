/**
 * 5.6 — Mốc dự án 5: cấu hình, log và cấu trúc dự án (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c5/moc5 (lab-booking, nối tiếp c4/moc4): Vitest 4.1.12 trên máy nhà 16/16 xanh (11 test cũ +
 * 3 test schema + 2 test request id); moc5/xem.sh trong container nst-run-* — một bản nest build, development (pino-pretty, /docs 200,
 * giữ x-request-id sv-an-0001), production với khoá mốc 4 "admin-7c1e" ⇒ thoát mã 1 "khoá production cần ≥ 24 ký tự", production
 * đúng ⇒ log JSON, /docs 404. Bỏ RequestIdMiddleware + TimingInterceptor (pino-http thay), ApiKeyGuard đọc ConfigService.
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Dự án xuyên suốt', sub: 'Đề tài, 11 mốc và thang điểm 100 — mốc 5 nằm ở đâu trong lộ trình.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-4-6-moc-du-an', title: 'NestJS 4.6 — Mốc dự án 4', sub: 'Điểm xuất phát của mốc này: DTO, kiểm dữ liệu và OpenAPI.', cta: 'Mở bài →' }),
].join('\n');
const MA_SCHEMA = "// env.schema.ts — mọi biến môi trường của lab-booking: kiểu, luật, mặc định. Thêm biến mới ⇒ thêm vào đây + .env.example\nimport { z } from 'zod';\n\nconst coDung = z.enum(['true', 'false']).transform((v) => v === 'true');\nconst danhSach = (phanTu: z.ZodType<string, string>) => z.string().transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)).pipe(z.array(phanTu));\n\nexport const EnvSchema = z.object({\n  NODE_ENV: z.enum(['development', 'test', 'production']),\n  PORT: z.coerce.number().int().min(1).max(65535).default(3000),\n  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'silent']).default('info'),\n  API_KEYS: danhSach(z.string().min(8)).pipe(z.array(z.string()).min(1, 'cần ít nhất một khoá')),\n  SWAGGER: coDung.default(false),\n  BODY_LIMIT: z.string().regex(/^\\d+(kb|mb)$/).default('16kb'),\n}).superRefine((e, ctx) => {\n  if (e.NODE_ENV !== 'production') return;\n  if (e.SWAGGER) ctx.addIssue({ code: 'custom', path: ['SWAGGER'], message: 'không bật /docs ở production' });\n  if (e.LOG_LEVEL === 'debug') ctx.addIssue({ code: 'custom', path: ['LOG_LEVEL'], message: 'không dùng debug ở production' });\n  e.API_KEYS.forEach((k, i) => { if (k.length < 24) ctx.addIssue({ code: 'custom', path: ['API_KEYS', i], message: 'khoá production cần ≥ 24 ký tự' }); });\n});\nexport type Env = z.infer<typeof EnvSchema>;";
const MA_CFG = "// app-config.module.ts — production chỉ tin biến của tiến trình (do Docker/CI cấp); dev/test đọc thêm .env.<môi trường>\nimport { Module } from '@nestjs/common';\nimport { ConfigModule } from '@nestjs/config';\nimport { EnvSchema } from './env.schema.js';\n\nconst moiTruong = process.env.NODE_ENV ?? 'development';\n@Module({\n  imports: [ConfigModule.forRoot({\n    isGlobal: true, cache: true, skipProcessEnv: true, validationSchema: EnvSchema,\n    ignoreEnvFile: moiTruong === 'production',\n    envFilePath: [`.env.${moiTruong}.local`, `.env.${moiTruong}`],\n  })],\n})\nexport class AppConfigModule {}";
const MA_LOGCFG = "// logger.config.ts — một dòng JSON mỗi request (pino-http), request id nhận từ phía trước nếu hợp lệ, che header bí mật\nimport { randomUUID } from 'node:crypto';\nimport { ConfigService } from '@nestjs/config';\nimport type { Params } from 'nestjs-pino';\nimport type { Env } from './env.schema.js';\n\nexport const loggerConfig = (c: ConfigService<Env, true>): Params => ({\n  pinoHttp: {\n    level: c.get('LOG_LEVEL', { infer: true }),\n    genReqId: (req, res) => {\n      const h = req.headers['x-request-id'];\n      const id = typeof h === 'string' && /^[\\w-]{8,64}$/.test(h) ? h : randomUUID();\n      res.setHeader('x-request-id', id);\n      return id;\n    },\n    redact: { paths: ['req.headers[\"x-api-key\"]', 'req.headers.authorization', 'req.headers.cookie'], censor: '[che]' },\n    serializers: {\n      req: (r) => ({ id: r.id, method: r.method, url: r.url }),\n      res: (r) => ({ statusCode: r.statusCode }),\n    },\n    customProps: () => ({ service: 'lab-booking' }),\n    transport: c.get('NODE_ENV', { infer: true }) === 'development'\n      ? { target: 'pino-pretty', options: { singleLine: true, ignore: 'pid,hostname' } } : undefined,\n    timestamp: process.env.LOG_TIME_CO_DINH ? () => ',\"time\":\"<thời điểm>\"' : undefined,   // chỉ để output bài cố định\n    base: undefined,\n  },\n});";
const MA_APPMOD = "@Module({\n  imports: [\n    AppConfigModule,\n    LoggerModule.forRootAsync({ inject: [ConfigService], useFactory: loggerConfig }),   // thay RequestIdMiddleware + TimingInterceptor\n    ClockModule, RoomsModule, BookingsModule,\n  ],";
const MA_GUARD = "export class ApiKeyGuard implements CanActivate {\n  private readonly khoa: string[];\n  constructor(private readonly reflector: Reflector, c: ConfigService<Env, true>) {\n    this.khoa = c.get('API_KEYS', { infer: true });   // schema đã bảo đảm ≥ 1 khoá — không còn tự kiểm ở đây\n  }";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { ConfigService } from '@nestjs/config';\nimport { Logger } from 'nestjs-pino';\nimport { AppModule } from './app.module.js';\nimport type { Env } from './config/env.schema.js';\n\nasync function bootstrap() {\n  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });\n  app.useLogger(app.get(Logger));\n  const c: ConfigService<Env, true> = app.get(ConfigService);\n  app.useBodyParser('json', { limit: c.get('BODY_LIMIT', { infer: true }) });\n  if (c.get('SWAGGER', { infer: true })) {\n    const doc = SwaggerModule.createDocument(app, new DocumentBuilder()\n      .setTitle('lab-booking API').setVersion('0.5.0')\n      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key').build());\n    SwaggerModule.setup('docs', app, doc);\n  }\n  app.enableShutdownHooks();\n  await app.listen(c.get('PORT', { infer: true }));\n}\nawait bootstrap();";
const ENV_EX = "# Sao thành .env.<môi trường> khi chạy máy mình. Production KHÔNG dùng tệp: biến do Docker/CI cấp.\nNODE_ENV=\nPORT=3000\nLOG_LEVEL=info\nAPI_KEYS=\nSWAGGER=false\nBODY_LIMIT=16kb";
const MA_SPEC = "import { EnvSchema } from './env.schema.js';\n\nconst loi = (env: object) => {\n  const r = EnvSchema.safeParse(env);\n  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);\n};\n\ndescribe('Mốc 5 — EnvSchema của lab-booking', () => {\n  it('dev: khoá ngắn được, mặc định đủ', () => {\n    expect(EnvSchema.parse({ NODE_ENV: 'development', API_KEYS: 'admin-7c1e' }))\n      .toEqual({ NODE_ENV: 'development', PORT: 3000, LOG_LEVEL: 'info', API_KEYS: ['admin-7c1e'], SWAGGER: false, BODY_LIMIT: '16kb' });\n  });\n  it('API_KEYS rỗng ⇒ từ chối (thay cho câu kiểm trong ApiKeyGuard của mốc 3)', () => {\n    expect(loi({ NODE_ENV: 'development', API_KEYS: ' , ' })).toEqual(['API_KEYS: cần ít nhất một khoá']);\n  });\n  it('production: khoá mốc 4 quá ngắn, cấm /docs', () => {\n    expect(loi({ NODE_ENV: 'production', API_KEYS: 'admin-7c1e', SWAGGER: 'true' }))\n      .toEqual(['SWAGGER: không bật /docs ở production', 'API_KEYS.0: khoá production cần ≥ 24 ký tự']);\n  });\n});";
const MA_E2E = "import 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\n\nprocess.env.API_KEYS = 'test-key';\nconst { AppModule } = await import('../app.module.js');\n\ndescribe('Mốc 5 — request id do pino-http cấp', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    app = (await Test.createTestingModule({ imports: [AppModule] }).compile()).createNestApplication({ logger: false });\n    await app.init();\n  });\n  afterAll(() => app.close());\n  it('giữ id hợp lệ client gửi, trả lại ở header và trong lỗi', async () => {\n    const r = await request(app.getHttpServer()).get('/rooms/abc').set('x-request-id', 'fe-7f3a91c2').expect(400);\n    expect(r.headers['x-request-id']).toBe('fe-7f3a91c2');\n    expect(r.body.requestId).toBe('fe-7f3a91c2');\n  });\n  it('id bẩn ⇒ thay bằng UUID', async () => {\n    const r = await request(app.getHttpServer()).get('/rooms').set('x-request-id', '<script>').expect(200);\n    expect(r.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);\n  });\n});";
const OUT_TEST = "$ npx vitest run\n Test Files  5 passed (5)\n      Tests  16 passed (16)";
const OUT_XEM = "$ NODE_ENV=development node dist/main.js\n  POST /bookings (x-request-id: sv-an-0001) → 201\n  GET /rooms/abc → {\"status\":400,\"requestId\":\"4cc5b188-2fc1-46dd-b986-1ef84fd9e7e1\"}   GET /docs → 200\n  │ [<thời điểm>] INFO: Nest application successfully started {\"context\":\"NestApplication\"}\n  │ [<thời điểm>] INFO: request completed {\"req\":{\"id\":\"sv-an-0001\",\"method\":\"POST\",\"url\":\"/bookings\"},\"service\":\"lab-booking\",\"res\":{\"statusCode\":201},\"responseTime\":13}\n  │ [<thời điểm>] INFO: request completed {\"req\":{\"id\":\"4cc5b188-2fc1-46dd-b986-1ef84fd9e7e1\",\"method\":\"GET\",\"url\":\"/rooms/abc\"},\"service\":\"lab-booking\",\"res\":{\"statusCode\":400},\"responseTime\":2}\n\n$ NODE_ENV=production API_KEYS=admin-7c1e node dist/main.js\n  (tiến trình thoát, mã 1)\n  │ [Nest] ERROR [ExceptionHandler] Error: Config validation error: API_KEYS.0: khoá production cần ≥ 24 ký tự\n\n$ NODE_ENV=production API_KEYS=lb-prod-3f9a1c7e5b2d8f40a6c4 node dist/main.js\n  POST /bookings (x-request-id: sv-an-0001) → 201\n  GET /rooms/abc → {\"status\":400,\"requestId\":\"0b1394f8-e8e2-43d7-940e-7eec4b1f3cea\"}   GET /docs → 404\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"NestApplication\",\"msg\":\"Nest application successfully started\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"sv-an-0001\",\"method\":\"POST\",\"url\":\"/bookings\"},\"service\":\"lab-booking\",\"res\":{\"statusCode\":201},\"responseTime\":10,\"msg\":\"request completed\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"0b1394f8-e8e2-43d7-940e-7eec4b1f3cea\",\"method\":\"GET\",\"url\":\"/rooms/abc\"},\"service\":\"lab-booking\",\"res\":{\"statusCode\":400},\"responseTime\":1,\"msg\":\"request completed\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"864c0cd0-0f86-4891-b3b0-bf9dd043be0b\",\"method\":\"GET\",\"url\":\"/docs\"},\"service\":\"lab-booking\",\"res\":{\"statusCode\":404},\"responseTime\":1,\"msg\":\"request completed\"}";
const OUT_DIFF = "$ diff -rq moc4/src moc5/src\nFiles moc4/src/app.module.ts and moc5/src/app.module.ts differ\nFiles moc4/src/common/api-key.guard.ts and moc5/src/common/api-key.guard.ts differ\nOnly in moc5/src/common: moc5.e2e.spec.ts\nOnly in moc4/src/common: request-id.middleware.ts\nOnly in moc4/src/common: timing.interceptor.ts\nOnly in moc5/src: config\nFiles moc4/src/main.ts and moc5/src/main.ts differ";

export default {
  title: '5.6 — Project milestone 5: config, logs and structure of your project|||5.6 — Mốc dự án 5: cấu hình, log và cấu trúc dự án',
  slug: 'nst-5-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Áp Chương 5 vào đề tài của bạn (mẫu: lab-booking). Một schema cho mọi biến môi trường, production chỉ đọc biến của tiến trình, khoá API production ≥ 24 ký tự; nestjs-pino thay RequestIdMiddleware và TimingInterceptor; ApiKeyGuard đọc ConfigService; .env.example; thư mục config/. Chạy thật: 16/16 test xanh; cùng một bản build chạy development, bị chặn ở production với khoá mốc 4, rồi chạy production với log JSON. Có bảng tự chấm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Project milestone 5</span>
<h2>5.6 — Milestone 5: your project becomes deployable</h2>
<p class="lead">After Milestone 4 your API validates input and documents itself, but its configuration is scattered: <code>process.env.API_KEYS</code> inside a guard, <code>NODE_ENV</code> checks in <code>main.ts</code>, a hand-written request id middleware and a timing interceptor printing JSON by hand. This milestone moves all of that behind one schema and one logger, so Chapter 11 can put the same build into Docker unchanged. The reference solution is the course project <strong>lab-booking</strong>; do the same for your own topic.</p>

<h3>What changes</h3>
<div class="out">${esc(OUT_DIFF)}</div>
<ol>
<li><strong><code>src/config/</code></strong>: <code>env.schema.ts</code>, <code>app-config.module.ts</code>, <code>logger.config.ts</code> + a schema test.</li>
<li><strong>Removed</strong> <code>RequestIdMiddleware</code> and <code>TimingInterceptor</code>: pino-http now assigns the request id (same validation rule as before) and writes one line per request.</li>
<li><strong><code>ApiKeyGuard</code></strong> reads keys from <code>ConfigService</code>; the "empty list" check moved into the schema.</li>
<li><strong><code>main.ts</code></strong>: <code>bufferLogs</code>, body limit, Swagger and port from configuration.</li>
<li><strong><code>.env.example</code></strong> committed, <code>.env*</code> ignored.</li>
</ol>

<h3>The schema</h3>
<pre><code class="language-ts">${esc(MA_SCHEMA)}</code></pre>
<p>A list type for <code>API_KEYS</code> prepares zero-downtime rotation (Lesson 5.2): deploy <code>old,new</code>, move clients, remove <code>old</code>. The production rule "≥ 24 characters" rejects the 10-character key used since Milestone 3 — on purpose: development keys must never be good enough for production.</p>
<pre><code class="language-ts">${esc(MA_CFG)}</code></pre>

<h3>Logger and modules</h3>
<pre><code class="language-ts">${esc(MA_LOGCFG)}</code></pre>
<p>Unlike the lab, the serializers keep only <code>id</code>, <code>method</code>, <code>url</code> and the status code: headers are not logged at all, which is a stronger guarantee than redacting them (the redact list stays as a second layer for anyone who later widens the serializer).</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-bash">${esc(ENV_EX)}</code></pre>

<h3>Tests</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>All 11 earlier tests stay green: the problem+json filter still finds <code>req.id</code>, because pino-http sets it in the same place the old middleware did. <code>vitest.config.ts</code> sets <code>LOG_LEVEL: 'silent'</code> for tests; Vitest itself sets <code>NODE_ENV=test</code>.</p>

<h3>One build, three runs</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>Development keeps the frontend's id <code>sv-an-0001</code> and generates one for the call without an id; production with the Milestone 4 key refuses to start with one clear message; production with a real key logs JSON and hides <code>/docs</code>. The <code>requestId</code> in the 400 body equals the <code>req.id</code> in the log line — the link support needs.</p>

<h3>Self-assessment (10 points toward the project rubric)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Every variable declared in one schema; app exits non-zero listing all problems</td><td>3</td></tr>
<tr><td>No <code>process.env</code> outside <code>config/</code> (check: <code>grep -rn "process.env" src | grep -v -e config/ -e spec.ts</code> is empty)</td><td>2</td></tr>
<tr><td>JSON logs outside development, request id in logs and responses, no secrets in logs</td><td>2</td></tr>
<tr><td><code>.env.example</code> committed, real env files ignored, README explains how to run each environment</td><td>1</td></tr>
<tr><td>Schema tests (including a production rule) green; earlier tests still green</td><td>2</td></tr>
</tbody>
</table>
<p>Commit message suggestion: <code>feat(config): validated env schema, pino logging, request id (milestone 5)</code>.</p>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Mốc dự án 5</span>
<h2>5.6 — Mốc 5: dự án của bạn sẵn sàng để triển khai</h2>
<p class="lead">Sau Mốc 4, API của bạn đã kiểm dữ liệu vào và tự sinh tài liệu, nhưng cấu hình còn nằm rải rác: <code>process.env.API_KEYS</code> trong guard, các phép kiểm <code>NODE_ENV</code> trong <code>main.ts</code>, một middleware request id viết tay và một interceptor đo giờ tự in JSON. Mốc này đưa tất cả về sau một schema và một logger, để Chương 11 đặt đúng bản build này vào Docker mà không phải sửa. Lời giải mẫu là dự án của khoá <strong>lab-booking</strong>; hãy làm tương tự cho đề tài của bạn.</p>

<h3>Những gì thay đổi</h3>
<div class="out">${esc(OUT_DIFF)}</div>
<ol>
<li><strong><code>src/config/</code></strong>: <code>env.schema.ts</code>, <code>app-config.module.ts</code>, <code>logger.config.ts</code> + một test schema.</li>
<li><strong>Bỏ</strong> <code>RequestIdMiddleware</code> và <code>TimingInterceptor</code>: pino-http giờ cấp request id (cùng luật kiểm như trước) và ghi mỗi request một dòng.</li>
<li><strong><code>ApiKeyGuard</code></strong> đọc khoá từ <code>ConfigService</code>; phép kiểm "danh sách rỗng" chuyển vào schema.</li>
<li><strong><code>main.ts</code></strong>: <code>bufferLogs</code>, giới hạn thân request, Swagger và cổng lấy từ cấu hình.</li>
<li><strong><code>.env.example</code></strong> được commit, <code>.env*</code> bị ignore.</li>
</ol>

<h3>Schema</h3>
<pre><code class="language-ts">${esc(MA_SCHEMA)}</code></pre>
<p>Kiểu danh sách cho <code>API_KEYS</code> chuẩn bị sẵn việc xoay khoá không dừng dịch vụ (Bài 5.2): triển khai <code>cũ,mới</code>, chuyển client, bỏ <code>cũ</code>. Luật production "≥ 24 ký tự" từ chối khoá 10 ký tự dùng từ Mốc 3 — có chủ ý: khoá môi trường phát triển không bao giờ được đủ tốt cho production.</p>
<pre><code class="language-ts">${esc(MA_CFG)}</code></pre>

<h3>Logger và các module</h3>
<pre><code class="language-ts">${esc(MA_LOGCFG)}</code></pre>
<p>Khác với lab, serializer ở đây chỉ giữ <code>id</code>, <code>method</code>, <code>url</code> và mã trạng thái: header hoàn toàn không được ghi, đó là bảo đảm mạnh hơn việc che chúng (danh sách redact vẫn giữ làm lớp thứ hai cho ai sau này nới serializer ra).</p>
<pre><code class="language-ts">${esc(MA_APPMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-bash">${esc(ENV_EX)}</code></pre>

<h3>Test</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Cả 11 test cũ vẫn xanh: filter problem+json vẫn tìm thấy <code>req.id</code>, vì pino-http đặt nó đúng chỗ middleware cũ từng đặt. <code>vitest.config.ts</code> đặt <code>LOG_LEVEL: 'silent'</code> cho test; còn <code>NODE_ENV=test</code> do chính Vitest đặt.</p>

<h3>Một bản build, ba lần chạy</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>Development giữ id <code>sv-an-0001</code> của frontend và tự sinh id cho lần gọi không có id; production với khoá Mốc 4 từ chối khởi động với một thông báo rõ ràng; production với khoá thật ghi log JSON và ẩn <code>/docs</code>. <code>requestId</code> trong thân lỗi 400 trùng với <code>req.id</code> trong dòng log — đúng sợi dây đội hỗ trợ cần.</p>

<h3>Tự chấm (10 điểm trong thang điểm dự án)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Mọi biến khai trong một schema; ứng dụng thoát mã khác 0 và liệt kê mọi lỗi</td><td>3</td></tr>
<tr><td>Không có <code>process.env</code> ngoài <code>config/</code> (kiểm: <code>grep -rn "process.env" src | grep -v -e config/ -e spec.ts</code> rỗng)</td><td>2</td></tr>
<tr><td>Log JSON ngoài development, request id có trong log và phản hồi, log không chứa bí mật</td><td>2</td></tr>
<tr><td><code>.env.example</code> được commit, tệp env thật bị ignore, README nói cách chạy từng môi trường</td><td>1</td></tr>
<tr><td>Test schema (có một luật production) xanh; test cũ vẫn xanh</td><td>2</td></tr>
</tbody>
</table>
<p>Gợi ý thông điệp commit: <code>feat(config): validated env schema, pino logging, request id (milestone 5)</code>.</p>
${THE}
</div>
`,
};
