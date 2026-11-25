/**
 * 8.3 — Test e2e: supertest, cùng cấu hình toàn cục như main.ts, PostgreSQL thật (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, Vitest 4.1.12, supertest 7, PostgreSQL 16.16 container nst-pg 127.0.0.1:41601):
 * scratchpad/nst/lab/c8/moc8 — thu/b83/main-khac (test trần 400 / máy chủ thật node dist/main.js cổng 41811 413 / taoApp 413),
 * quen-close (5 app không close ⇒ 1→5 kết nối; có close ⇒ 0), --fileParallelism trên một DB (5/7 tệp đỏ, users_email_key),
 * mỗi worker một DB (TEMPLATE) 7/7 xanh 4,62 s (trước: 8,71 s lần lượt), lab/c8/app/src/b83/fastify (inject không cần ready(); quên init ⇒ 404),
 * bt.e2e (10 request ⇒ 1×201 + 9×409).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-5-1-supertest', title: 'Testing 5.1 — Supertest', sub: 'Request không cần mở cổng, mã trạng thái là hợp đồng — nền của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-4-3-testcontainers', title: 'Testing 4.3 — Testcontainers', sub: 'Để chính lần chạy test bật PostgreSQL — thay cho container dựng tay ở bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-4-4-co-lap', title: 'Testing 4.4 — Cô lập: transaction, truncate, dữ liệu mẫu', sub: 'Ba cách dọn DB giữa các test và giá của từng cách.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-8-3-flaky', title: 'Testing 8.3 — Test chập chờn', sub: 'Vì sao test lúc xanh lúc đỏ — chia sẻ trạng thái là thủ phạm số một.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Testing: end-to-end testing', 'createNestApplication, app.init(), supertest, và inject() cho Fastify.', 'https://docs.nestjs.com/fundamentals/testing#end-to-end-testing'),
  nguon('📘', 'Vitest — Parallelism / VITEST_POOL_ID', 'Tệp test chạy song song theo worker; VITEST_POOL_ID cho biết số của worker.', 'https://vitest.dev/guide/parallelism'),
  nguon('📘', 'PostgreSQL 16 — Template databases', 'CREATE DATABASE … TEMPLATE: chép nguyên một DB đã migrate, nhanh hơn chạy lại migration.', 'https://www.postgresql.org/docs/16/manage-ag-templatedbs.html'),
].join('\n');
const MA_TRAN = "// b83/main-khac.e2e.spec.ts — ứng dụng trong test KHÔNG chạy main.ts: thứ gì cấu hình ở main.ts thì test không có\nimport 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nconst { AppModule } = await import('../../app.module.js');\n\nconst to = { email: 'an@fpt.edu.vn', password: 'x'.repeat(50_000) };   // ~50 KB; BODY_LIMIT = 16kb\nit('createNestApplication trần', async () => {\n  const m = await Test.createTestingModule({ imports: [AppModule] }).compile();\n  const app = m.createNestApplication<NestExpressApplication>({ logger: false }); await app.init();\n  const r = await request(app.getHttpServer()).post('/auth/login').send(to);\n  console.log('test (không main.ts) → POST /auth/login 50 KB:', r.status, r.body.errors ?? r.body.detail);\n  console.log('trust proxy =', app.getHttpAdapter().getInstance().get('trust proxy'));\n  await app.close();\n});";
const OUT_TRAN = " RUN  v4.1.12 /home/sv/app\ntest (không main.ts) → POST /auth/login 50 KB: 400 [ 'password must be shorter than or equal to 128 characters' ]\ntrust proxy = false\n ✓ src/thu/b83/main-khac.e2e.spec.ts > createNestApplication trần 134ms";
const OUT_THAT = "$ curl -s -XPOST localhost:41811/auth/login -H 'content-type: application/json' --data @to.json | jq -c '{status, detail}'\n{\"status\":413,\"detail\":\"request entity too large\"}";
const MA_SETUP = "// setup-app.ts — MỌI cấu hình mức ứng dụng ở một chỗ; main.ts và test e2e cùng gọi (mốc 8)\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { ConfigService } from '@nestjs/config';\nimport type { Env } from './config/env.schema.js';\n\nexport function cauHinhApp(app: NestExpressApplication) {\n  const c: ConfigService<Env, true> = app.get(ConfigService);\n  app.useBodyParser('json', { limit: c.get('BODY_LIMIT', { infer: true }) });\n  app.set('trust proxy', c.get('TRUST_PROXY', { infer: true }));        // 0 = không tin X-Forwarded-For; 1 = sau một nginx\n  app.enableShutdownHooks();\n  return app;\n}";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { ConfigService } from '@nestjs/config';\nimport { Logger } from 'nestjs-pino';\nimport { AppModule } from './app.module.js';\nimport type { Env } from './config/env.schema.js';\nimport { cauHinhApp } from './setup-app.js';\n\nasync function bootstrap() {\n  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });\n  app.useLogger(app.get(Logger));\n  const c: ConfigService<Env, true> = app.get(ConfigService);\n  cauHinhApp(app);                                  // body limit, trust proxy, shutdown hooks — test e2e gọi đúng hàm này\n  if (c.get('SWAGGER', { infer: true })) {\n    const doc = SwaggerModule.createDocument(app, new DocumentBuilder()\n      .setTitle('lab-booking API').setVersion('0.8.0')\n      .addBearerAuth().build());\n    SwaggerModule.setup('docs', app, doc);\n  }\n  await app.listen(c.get('PORT', { infer: true }));\n}\nawait bootstrap();";
const MA_TAOAPP = "// tao-app.ts — dựng ứng dụng cho test e2e GIỐNG production: cùng AppModule, cùng cauHinhApp(); chỉ thay đồng hồ (và thứ gì truyền vào)\nimport { Test, type TestingModuleBuilder } from '@nestjs/testing';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { Clock } from '../common/clock.module.js';\nimport { cauHinhApp } from '../setup-app.js';\n\nexport async function taoApp(dongHo: { now(): Date } = { now: () => new Date('2026-12-01T00:00:00Z') }, sua: (b: TestingModuleBuilder) => TestingModuleBuilder = (b) => b) {\n  const { AppModule } = await import('../app.module.js');\n  const m = await sua(Test.createTestingModule({ imports: [AppModule] }).overrideProvider(Clock).useValue(dongHo)).compile();\n  const app = cauHinhApp(m.createNestApplication<NestExpressApplication>({ logger: false }));\n  await app.init();\n  return app;\n}";
const OUT_SUA = " RUN  v4.1.12 /home/sv/app\ntest (không main.ts) → POST /auth/login 50 KB: 400 [ 'password must be shorter than or equal to 128 characters' ]\ntrust proxy = false\ntest (taoApp)        → POST /auth/login 50 KB: 413 request entity too large\n ✓ src/thu/b83/main-khac.e2e.spec.ts > createNestApplication trần 123ms\n ✓ src/thu/b83/main-khac.e2e.spec.ts > sau khi sửa: taoApp() gọi cauHinhApp() như main.ts 37ms";
const MA_QUEN = "// b83/quen-close.e2e.spec.ts — mỗi describe một app (như nhiều nhóm hay làm) + quên app.close(): kết nối PostgreSQL dồn lại\nimport pg from 'pg';\nimport request from 'supertest';\nimport { taoApp } from '../../test/tao-app.js';\nconst dem = async () => {\n  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();\n  const { rows } = await c.query(`SELECT count(*)::int - 1 AS n FROM pg_stat_activity WHERE datname = current_database()`);\n  await c.end(); return rows[0].n;\n};\nit('5 app, không close', async () => {\n  const ds: number[] = [];\n  for (let i = 0; i < 5; i++) { const app = await taoApp(); await request(app.getHttpServer()).get('/rooms').expect(200); ds.push(await dem()); }\n  console.log('quên close — kết nối sau mỗi app:', ds.join(' → '));\n});\nit('5 app, có close', async () => {\n  const truoc = await dem(), ds: number[] = [];\n  for (let i = 0; i < 5; i++) { const app = await taoApp(); await request(app.getHttpServer()).get('/rooms').expect(200); await app.close(); ds.push(await dem() - truoc); }\n  console.log('có close     — kết nối thêm sau mỗi app:', ds.join(' → '));\n});";
const OUT_QUEN = " RUN  v4.1.12 /home/sv/app\nquên close — kết nối sau mỗi app: 1 → 2 → 3 → 4 → 5\n ✓ src/thu/b83/quen-close.e2e.spec.ts > 5 app, không close 759ms\ncó close     — kết nối thêm sau mỗi app: 0 → 0 → 0 → 0 → 0\n ✓ src/thu/b83/quen-close.e2e.spec.ts > 5 app, có close 234ms";
const OUT_LOI = "$ npx vitest run --fileParallelism\n ❯ src/common/moc4.e2e.spec.ts (5 tests | 5 skipped) 323ms\n ❯ src/common/moc7.e2e.spec.ts (10 tests | 10 skipped) 327ms\n ❯ src/common/moc5.e2e.spec.ts (2 tests | 2 skipped) 338ms\n ❯ src/common/moc6.e2e.spec.ts (3 tests | 3 skipped) 342ms\n ❯ src/bookings/bookings.service.spec.ts (3 tests | 3 skipped) 326ms\n FAIL  src/common/moc4.e2e.spec.ts [ src/common/moc4.e2e.spec.ts ]\n FAIL  src/common/moc5.e2e.spec.ts [ src/common/moc5.e2e.spec.ts ]\n FAIL  src/common/moc6.e2e.spec.ts [ src/common/moc6.e2e.spec.ts ]\n FAIL  src/common/moc7.e2e.spec.ts [ src/common/moc7.e2e.spec.ts ]\n FAIL  src/bookings/bookings.service.spec.ts [ src/bookings/bookings.service.spec.ts ]\nUnique constraint failed on the constraint: `users_email_key`\n ❯ src/test/db-reset.ts:11:41\n Test Files  5 failed | 2 passed (7)\n      Tests  8 passed | 23 skipped (31)\n   Duration  3.81s (transform 1.13s, setup 4.73s, import 4.43s, tests 2.49s, environment 1ms)";
const MA_GS = "// global-setup.ts — chạy MỘT lần trước mọi tệp test (mốc 8: mỗi worker một DB ⇒ chạy song song được)\n// 1) đưa DB mẫu lên migration mới nhất; 2) nhân bản thành <db>_w1 … <db>_wN bằng CREATE DATABASE … TEMPLATE (nhanh, không chạy lại migration)\nimport { execSync } from 'node:child_process';\nimport { availableParallelism } from 'node:os';\nimport pg from 'pg';\n\nexport default async function setup() {\n  const url = process.env.DATABASE_URL_TEST;\n  if (!url) throw new Error('Thiếu DATABASE_URL_TEST — ví dụ postgresql://nst:nst@127.0.0.1:41601/moc8_test (KHÔNG trỏ DB dev)');\n  execSync('npx prisma migrate deploy', { stdio: 'pipe', env: { ...process.env, DATABASE_URL: url } });\n  const u = new URL(url), mau = u.pathname.slice(1);\n  const c = new pg.Client({ connectionString: Object.assign(new URL(url), { pathname: '/postgres' }).toString() });\n  await c.connect();\n  for (let i = 1; i <= availableParallelism(); i++) {\n    await c.query(`DROP DATABASE IF EXISTS \"${mau}_w${i}\" WITH (FORCE)`);\n    await c.query(`CREATE DATABASE \"${mau}_w${i}\" TEMPLATE \"${mau}\"`);\n  }\n  await c.end();\n}";
const MA_RESET = "// db-reset.ts — trước MỖI tệp test: bảng trống + 5 tài khoản + 2 phòng mẫu (phòng 1 do gv quản lý)\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport * as argon2 from 'argon2';\nimport { PrismaClient } from '../generated/prisma/client.js';\nimport { MAT_KHAU, NGUOI } from './auth.js';\n\n// mốc 8: worker số N dùng DB <db>_wN (global-setup.ts tạo sẵn) — đặt TRƯỚC khi tệp test nạp AppModule\nconst u = new URL(process.env.DATABASE_URL_TEST!);\nu.pathname += `_w${process.env.VITEST_POOL_ID}`;\nprocess.env.DATABASE_URL = u.toString();\n";
const OUT_WORKER = " RUN  v4.1.12 /home/sv/app\n ✓ src/config/env.schema.spec.ts (4 tests) 287ms\n ✓ src/common/pipeline.e2e.spec.ts (4 tests) 625ms\n ✓ src/common/moc5.e2e.spec.ts (2 tests) 659ms\n ✓ src/bookings/bookings.service.spec.ts (3 tests) 678ms\n ✓ src/common/moc4.e2e.spec.ts (5 tests) 703ms\n ✓ src/common/moc6.e2e.spec.ts (3 tests) 970ms\n ✓ src/common/moc7.e2e.spec.ts (10 tests) 1380ms\n Test Files  7 passed (7)\n      Tests  31 passed (31)\n   Duration  4.62s (transform 2.55s, setup 4.71s, import 5.15s, tests 5.30s, environment 1ms)";
const MA_FASTIFY = "// b83/fastify.spec.ts — ứng dụng Fastify: inject() không cần cổng; quên ready() thì sao?\nimport 'reflect-metadata';\nimport { Controller, Get, Module } from '@nestjs/common';\nimport { Test } from '@nestjs/testing';\nimport { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';\n\n@Controller() class C { @Get('ping') ping() { return { ok: true }; } }\n@Module({ controllers: [C] }) class M {}\nconst tao = async () => {\n  const m = await Test.createTestingModule({ imports: [M] }).compile();\n  return m.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), { logger: false });\n};\nit('init() + ready() rồi inject', async () => {\n  const app = await tao(); await app.init(); await app.getHttpAdapter().getInstance().ready();\n  const r = await app.inject({ method: 'GET', url: '/ping' });\n  console.log('có ready():', r.statusCode, r.body); await app.close();\n});\nit('init() rồi inject, không ready()', async () => {\n  const app = await tao(); await app.init();\n  const r = await app.inject({ method: 'GET', url: '/ping' });\n  console.log('không ready():', r.statusCode, r.body); await app.close();\n});\nit('quên init()', async () => {\n  const app = await tao();\n  const r = await app.inject({ method: 'GET', url: '/ping' });\n  console.log('quên init():', r.statusCode, r.body); await app.close();\n});";
const OUT_FASTIFY = " RUN  v4.1.12 /home/sv/app\ncó ready(): 200 {\"ok\":true}\n ✓ src/b83/fastify.spec.ts > init() + ready() rồi inject 218ms\nkhông ready(): 200 {\"ok\":true}\nquên init(): 404 {\"message\":\"Route GET:/ping not found\",\"error\":\"Not Found\",\"statusCode\":404}\n ✓ src/b83/fastify.spec.ts > init() rồi inject, không ready() 10ms\n ✓ src/b83/fastify.spec.ts > quên init() 5ms\n Test Files  1 passed (1)";
const MA_BT = "// b83/bt.e2e.spec.ts — bài tập 8.3: 10 sinh viên bấm \"Đặt\" cùng lúc qua HTTP, rồi danh sách bận của phòng\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\nimport { taoApp } from '../../test/tao-app.js';\nimport { bearer } from '../../test/auth.js';\n\ndescribe('đặt đồng thời qua HTTP', () => {\n  let app: INestApplication;\n  beforeAll(async () => { app = await taoApp(); });\n  afterAll(() => app.close());\n  const khung = { roomId: 1, start: '2027-01-12T07:30:00+07:00', end: '2027-01-12T09:30:00+07:00', attendees: 4 };\n  it('10 request cùng khung ⇒ 1×201 + 9×409 BOOKING_CONFLICT; danh sách bận có đúng 1 lịch', async () => {\n    const ai = ['an', 'binh'] as const;\n    const kq = await Promise.all(Array.from({ length: 10 }, (_, i) => request(app.getHttpServer()).post('/bookings').set(bearer(app, ai[i % 2])).send(khung)));\n    const nhan = (r: request.Response) => `${r.status} ${r.status === 201 ? r.body.status : r.body.type.split('/').pop()}`;\n    const dem: Record<string, number> = {};\n    for (const r of kq) dem[nhan(r)] = (dem[nhan(r)] ?? 0) + 1;\n    console.log(dem);\n    expect(dem).toEqual({ '201 PENDING': 1, '409 BOOKING_CONFLICT': 9 });\n    const ban = await request(app.getHttpServer()).get('/bookings/room/1').set(bearer(app, 'gv')).expect(200);\n    expect(ban.body).toHaveLength(1);\n  });\n});";
const OUT_BT = " RUN  v4.1.12 /home/sv/app\n{ '201 PENDING': 1, '409 BOOKING_CONFLICT': 9 }\n ✓ src/thu/b83/bt.e2e.spec.ts > đặt đồng thời qua HTTP > 10 request cùng khung ⇒ 1×201 + 9×409 BOOKING_CONFLICT; danh sách bận có đúng 1 lịch 157ms\n Test Files  1 passed (1)\n      Tests  1 passed (1)";

export default {
  title: '8.3 — E2E tests: supertest, the same global setup as main.ts, a real PostgreSQL|||8.3 — Test e2e: supertest, cùng cấu hình toàn cục như main.ts, PostgreSQL thật',
  slug: 'nst-8-3-e2e',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ứng dụng trong test e2e KHÔNG chạy main.ts: cùng một body 50 KB, test trả 400 còn máy chủ thật trả 413 — sửa bằng một hàm cauHinhApp() dùng chung. Đo thật: quên app.close() thì kết nối PostgreSQL dồn 1→5; chạy song song nhiều tệp trên một DB thì 5/7 tệp đỏ — mỗi worker một DB nhân bản từ TEMPLATE thì xanh hết và nhanh gấp đôi (8,7 s → 4,6 s). Kèm Fastify inject() và bài tập 10 request đặt cùng khung giờ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>8.3 — E2E tests that test the app you actually ship</h2>
<p class="lead">An e2e test in Nest builds the whole <code>AppModule</code>, sends real HTTP requests with supertest and lets every guard, pipe and filter run. It is the only test that catches wiring mistakes. But "the whole app" in a test is <em>not</em> the app <code>main.ts</code> starts — and that gap, plus a shared database, are where most e2e suites start to lie or flake. Supertest itself is taught in the Testing course; here we cover the Nest-specific part, measured on the project.</p>

<h3>Everyday analogy: a dress rehearsal</h3>
<p>A dress rehearsal is useful only if it uses the real stage, the real costumes and the real lighting plan. Rehearse in jeans and the costume that tears on stage will tear for the first time in front of the audience. <code>main.ts</code> is the lighting plan: forget it in the rehearsal and the test passes a show that production does not run.</p>

<h3>1. What main.ts does that the test does not</h3>
<p>The mốc 7 <code>main.ts</code> sets a 16 KB body limit (<code>BODY_LIMIT</code>, mốc 5), <code>trust proxy</code> and shutdown hooks. A typical e2e test builds the app from <code>AppModule</code> only:</p>
<pre><code class="language-ts">${esc(MA_TRAN)}</code></pre>
<div class="out">${esc(OUT_TRAN)}</div>
<p>The same request against the real server, started with <code>node dist/main.js</code>:</p>
<div class="out">${esc(OUT_THAT)}</div>
<p>The test says 400 (validation ran on a 50 KB body, parsed with Express's default 100 KB limit), production says 413 (the body never reaches Nest). A test "body over 16 KB ⇒ 413" would be red in the test run while production is right — and someone would "fix" it by deleting the test. <code>trust proxy</code> is <code>false</code> in the test, so any rate-limit-per-IP test behind nginx tests a different configuration too. Why <code>ValidationPipe</code> was not affected: since mốc 4 it is registered with <code>APP_PIPE</code> inside the module, not with <code>app.useGlobalPipes()</code> in <code>main.ts</code> — exactly for this reason.</p>

<h3>2. The fix: one function, called by main.ts and by the tests</h3>
<pre><code class="language-ts">${esc(MA_SETUP)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MA_TAOAPP)}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>Rule: anything that changes HTTP behaviour goes either into the module (<code>APP_PIPE</code>, <code>APP_GUARD</code>, <code>APP_FILTER</code>, <code>APP_INTERCEPTOR</code>) or into <code>cauHinhApp()</code>. <code>main.ts</code> keeps only what tests must not do: listen on a port, Swagger, the production logger.</p>

<h3>3. Forgetting app.close()</h3>
<pre><code class="language-ts">${esc(MA_QUEN)}</code></pre>
<div class="out">${esc(OUT_QUEN)}</div>
<p>Vitest kills its worker processes at the end, so a missing <code>close()</code> rarely shows as a hang (Jest does hang — lesson 8.4). It shows as a slow leak: each forgotten app keeps its Prisma pool. Here each pool held one connection; the bookings test with 20 parallel requests opens up to <code>DB_POOL=10</code>. Ten such files without <code>close()</code> in one worker reach PostgreSQL's default <code>max_connections = 100</code> and the next test fails with "too many clients" — far from the file that caused it. Always <code>afterAll(() =&gt; app.close())</code>.</p>

<h3>4. Parallel files on one database: real flakiness</h3>
<p>Mốc 6 set <code>fileParallelism: false</code> because all files share one test database. What happens if someone removes it to make the suite faster:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>Five of seven files fail before running a single test: two files <code>TRUNCATE</code> and insert the same five users at the same time, and the second insert hits <code>users_email_key</code>. Which files fail changes from run to run. The fix is not "run serially forever" — give each Vitest worker its own database. <code>VITEST_POOL_ID</code> is the worker number; PostgreSQL copies a migrated database in milliseconds with <code>TEMPLATE</code>:</p>
<pre><code class="language-ts">${esc(MA_GS)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>
<div class="out">${esc(OUT_WORKER)}</div>
<p>7/7 green in parallel, 4.62 s instead of 8.71 s serially (measured on the same 31 tests). Two details matter: <code>DATABASE_URL</code> is set in a setup file, which runs <em>before</em> the test file imports <code>AppModule</code> (the config module reads it at import); and the global setup now fails with a clear message when <code>DATABASE_URL_TEST</code> is missing — the old one ran <code>prisma migrate deploy</code> with <code>stdio: 'ignore'</code> and died with an unreadable <code>Command failed</code>, which happened to us while preparing this lesson.</p>

<h3>5. Fastify: inject() instead of supertest</h3>
<pre><code class="language-ts">${esc(MA_FASTIFY)}</code></pre>
<div class="out">${esc(OUT_FASTIFY)}</div>
<p>Older guides say you must call <code>getInstance().ready()</code> before <code>inject()</code>. Measured on Nest 12 + Fastify 5: not needed — <code>inject()</code> waits for Fastify itself. What breaks is forgetting <code>app.init()</code>: routes are not registered yet and every request is a confident 404.</p>

<h3>🧪 Exercise (20 min) — ten students click "Book" at once</h3>
<p>Write an e2e test: 10 concurrent <code>POST /bookings</code> for the same room and slot, alternating between An and Bình. Expected: exactly one 201 <code>PENDING</code>, nine 409 <code>BOOKING_CONFLICT</code>, and the room's busy list then contains one booking. Use <code>taoApp()</code>.</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>The unit test of lesson 8.1 can only say "if the database reports 23P01 we answer 409". This test proves the database does report it, through every layer, under real concurrency.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>What is the difference between your e2e app and production?</strong> Whatever <code>main.ts</code> does. Move global configuration into the module or a shared setup function so both paths are identical.</li>
<li><strong>How do you isolate e2e tests that use a database?</strong> A dedicated test database, reset per file (or per test), and one database per parallel worker — or a transaction rolled back per test.</li>
<li><strong>Why does my test run hang (or leak connections)?</strong> An app or client not closed: <code>afterAll(() =&gt; app.close())</code>; it runs <code>onModuleDestroy</code> and closes the pool.</li>
<li><strong>How do you e2e-test a Fastify-based Nest app?</strong> <code>app.inject()</code> after <code>app.init()</code>; no port is opened.</li>
</ol>

<h3>💼 On the job</h3>
<p>In many teams the CI e2e job is "red sometimes, re-run and it's green". Nobody trusts it, so nobody reads it. When that happens, look first for shared state: one database for parallel jobs, data left by an earlier test, a real clock. Fixing isolation (section 4) often turns a 20-minute "flaky" job into a reliable 5-minute one — a visible win in your first month on a project.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">createNestApplication</span><span class="v">Builds an HTTP app from a testing module — without running main.ts.</span></div>
  <div class="kv"><span class="k">cauHinhApp() / setup function</span><span class="v">The one place for app-level settings, called by main.ts and tests.</span></div>
  <div class="kv"><span class="k">globalSetup / setupFiles</span><span class="v">Once per run (migrate, create DBs) / before each test file (env, seed data).</span></div>
  <div class="kv"><span class="k">VITEST_POOL_ID</span><span class="v">Number of the worker running the current file — key for one DB per worker.</span></div>
  <div class="kv"><span class="k">TEMPLATE database</span><span class="v">CREATE DATABASE x TEMPLATE y copies a migrated DB quickly.</span></div>
  <div class="kv"><span class="k">inject()</span><span class="v">Fastify's in-process request — the Fastify counterpart of supertest.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The e2e app is not the production app unless main.ts and the tests share one setup function.</li>
<li>Measured: 50 KB body ⇒ 400 in the test, 413 in production; fixed with <code>cauHinhApp()</code>.</li>
<li>Always close the app; leaked pools fail other tests later.</li>
<li>Parallel files need separate databases: 5/7 files red on one DB, 7/7 green and 2× faster with one DB per worker.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>8.3 — Test e2e phải test đúng ứng dụng bạn giao</h2>
<p class="lead">Test e2e trong Nest dựng nguyên <code>AppModule</code>, gửi request HTTP thật bằng supertest và để mọi guard, pipe, filter chạy. Đó là loại test duy nhất bắt được lỗi dây nối. Nhưng "nguyên ứng dụng" trong test <em>không phải</em> ứng dụng mà <code>main.ts</code> khởi động — và khoảng hở đó, cộng với một DB dùng chung, là chỗ phần lớn bộ e2e bắt đầu nói dối hoặc chập chờn. Bản thân supertest đã dạy ở khoá Testing; bài này dạy phần riêng của Nest, đo trên chính dự án.</p>

<h3>Liên hệ đời thường: buổi tổng duyệt</h3>
<p>Tổng duyệt chỉ có ích khi dùng sân khấu thật, trang phục thật và kịch bản ánh sáng thật. Tổng duyệt bằng quần jean thì bộ váy rách trên sân khấu sẽ rách lần đầu trước mặt khán giả. <code>main.ts</code> là kịch bản ánh sáng: quên nó trong buổi tổng duyệt thì test cho qua một buổi diễn mà production không hề diễn.</p>

<h3>1. Những gì main.ts làm mà test không làm</h3>
<p><code>main.ts</code> của mốc 7 đặt giới hạn body 16 KB (<code>BODY_LIMIT</code>, mốc 5), <code>trust proxy</code> và shutdown hook. Một test e2e thường gặp chỉ dựng ứng dụng từ <code>AppModule</code>:</p>
<pre><code class="language-ts">${esc(MA_TRAN)}</code></pre>
<div class="out">${esc(OUT_TRAN)}</div>
<p>Cùng request đó gửi vào máy chủ thật, khởi động bằng <code>node dist/main.js</code>:</p>
<div class="out">${esc(OUT_THAT)}</div>
<p>Test nói 400 (validation chạy trên body 50 KB, được đọc với giới hạn mặc định 100 KB của Express), production nói 413 (body không bao giờ tới được Nest). Một test "body quá 16 KB ⇒ 413" sẽ đỏ trong lần chạy test dù production đúng — và sẽ có người "sửa" bằng cách xoá test. <code>trust proxy</code> trong test là <code>false</code>, nên mọi test giới hạn theo IP sau nginx cũng đang test một cấu hình khác. Vì sao <code>ValidationPipe</code> không bị ảnh hưởng: từ mốc 4 nó được khai bằng <code>APP_PIPE</code> trong module, không phải <code>app.useGlobalPipes()</code> trong <code>main.ts</code> — đúng vì lý do này.</p>

<h3>2. Cách sửa: một hàm, main.ts và test cùng gọi</h3>
<pre><code class="language-ts">${esc(MA_SETUP)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MA_TAOAPP)}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>Luật: thứ gì đổi hành vi HTTP thì hoặc nằm trong module (<code>APP_PIPE</code>, <code>APP_GUARD</code>, <code>APP_FILTER</code>, <code>APP_INTERCEPTOR</code>), hoặc nằm trong <code>cauHinhApp()</code>. <code>main.ts</code> chỉ giữ những gì test không được làm: nghe cổng, Swagger, logger production.</p>

<h3>3. Quên app.close()</h3>
<pre><code class="language-ts">${esc(MA_QUEN)}</code></pre>
<div class="out">${esc(OUT_QUEN)}</div>
<p>Vitest giết các tiến trình worker khi xong, nên thiếu <code>close()</code> hiếm khi lộ ra thành treo (Jest thì treo thật — bài 8.4). Nó lộ ra thành rò rỉ chậm: mỗi app bị quên giữ nguyên pool Prisma của nó. Ở đây mỗi pool giữ một kết nối; test đặt lịch có 20 request song song mở tới <code>DB_POOL=10</code>. Mười tệp như vậy không <code>close()</code> trong một worker là chạm <code>max_connections = 100</code> mặc định của PostgreSQL, và test kế tiếp đỏ với "too many clients" — cách xa tệp gây ra nó. Luôn <code>afterAll(() =&gt; app.close())</code>.</p>

<h3>4. Nhiều tệp song song trên một DB: chập chờn thật</h3>
<p>Mốc 6 đặt <code>fileParallelism: false</code> vì mọi tệp dùng chung một DB test. Điều gì xảy ra nếu ai đó bỏ dòng đó cho bộ test chạy nhanh hơn:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>Năm trên bảy tệp hỏng trước khi chạy được test nào: hai tệp cùng lúc <code>TRUNCATE</code> rồi chèn cùng năm người dùng, lượt chèn thứ hai vấp <code>users_email_key</code>. Tệp nào hỏng thay đổi theo từng lần chạy. Cách sửa không phải "chạy lần lượt mãi mãi" — hãy cho mỗi worker của Vitest một DB riêng. <code>VITEST_POOL_ID</code> là số của worker; PostgreSQL chép một DB đã migrate trong vài mili giây bằng <code>TEMPLATE</code>:</p>
<pre><code class="language-ts">${esc(MA_GS)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>
<div class="out">${esc(OUT_WORKER)}</div>
<p>7/7 xanh khi chạy song song, 4,62 s thay vì 8,71 s chạy lần lượt (đo trên cùng 31 test). Hai chi tiết quan trọng: <code>DATABASE_URL</code> được đặt trong setup file, chạy <em>trước</em> khi tệp test import <code>AppModule</code> (module cấu hình đọc nó lúc import); và global setup giờ báo lỗi rõ khi thiếu <code>DATABASE_URL_TEST</code> — bản cũ chạy <code>prisma migrate deploy</code> với <code>stdio: 'ignore'</code> nên chết với một câu <code>Command failed</code> không đọc được, và chuyện đó đã xảy ra thật lúc soạn bài này.</p>

<h3>5. Fastify: inject() thay cho supertest</h3>
<pre><code class="language-ts">${esc(MA_FASTIFY)}</code></pre>
<div class="out">${esc(OUT_FASTIFY)}</div>
<p>Các hướng dẫn cũ bảo phải gọi <code>getInstance().ready()</code> trước <code>inject()</code>. Đo trên Nest 12 + Fastify 5: không cần — <code>inject()</code> tự chờ Fastify sẵn sàng. Thứ làm hỏng là quên <code>app.init()</code>: route chưa được đăng ký và mọi request đều 404 rất tự tin.</p>

<h3>🧪 Thực hành (20 phút) — mười sinh viên cùng bấm "Đặt"</h3>
<p>Viết test e2e: 10 <code>POST /bookings</code> đồng thời cho cùng phòng và khung giờ, xen kẽ An và Bình. Mong đợi: đúng một 201 <code>PENDING</code>, chín 409 <code>BOOKING_CONFLICT</code>, và danh sách bận của phòng sau đó có một lịch. Dùng <code>taoApp()</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Test đơn vị của bài 8.1 chỉ nói được "nếu DB báo 23P01 thì ta trả 409". Test này chứng minh DB có báo thật, qua mọi lớp, khi đồng thời thật.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Ứng dụng trong test e2e của bạn khác production ở đâu?</strong> Ở mọi thứ <code>main.ts</code> làm. Dời cấu hình toàn cục vào module hoặc một hàm setup dùng chung để hai đường đi giống hệt nhau.</li>
<li><strong>Cô lập test e2e có DB thế nào?</strong> DB test riêng, dọn theo tệp (hoặc theo test), và mỗi worker song song một DB — hoặc mỗi test một transaction rồi rollback.</li>
<li><strong>Vì sao lần chạy test treo (hoặc rò kết nối)?</strong> Có app hoặc client chưa đóng: <code>afterAll(() =&gt; app.close())</code>; nó chạy <code>onModuleDestroy</code> và đóng pool.</li>
<li><strong>Test e2e ứng dụng Nest chạy Fastify thế nào?</strong> <code>app.inject()</code> sau <code>app.init()</code>; không mở cổng nào.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở nhiều nhóm, job e2e trên CI là kiểu "thỉnh thoảng đỏ, chạy lại là xanh". Không ai tin nó nên không ai đọc nó. Khi gặp cảnh đó, hãy tìm trạng thái dùng chung trước: một DB cho nhiều job song song, dữ liệu test trước để lại, đồng hồ thật. Sửa phần cô lập (mục 4) thường biến một job "chập chờn" 20 phút thành job 5 phút đáng tin — một thành tích nhìn thấy được ngay tháng đầu ở dự án.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">createNestApplication</span><span class="v">Dựng ứng dụng HTTP từ testing module — không chạy main.ts.</span></div>
  <div class="kv"><span class="k">cauHinhApp() / hàm setup</span><span class="v">Chỗ duy nhất cho cấu hình mức ứng dụng, main.ts và test cùng gọi.</span></div>
  <div class="kv"><span class="k">globalSetup / setupFiles</span><span class="v">Một lần mỗi lượt chạy (migrate, tạo DB) / trước mỗi tệp test (biến môi trường, dữ liệu mẫu).</span></div>
  <div class="kv"><span class="k">VITEST_POOL_ID</span><span class="v">Số của worker đang chạy tệp — chìa khoá cho mỗi worker một DB.</span></div>
  <div class="kv"><span class="k">DB mẫu (TEMPLATE)</span><span class="v">CREATE DATABASE x TEMPLATE y chép nhanh một DB đã migrate.</span></div>
  <div class="kv"><span class="k">inject()</span><span class="v">Request chạy trong tiến trình của Fastify — bản Fastify của supertest.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ứng dụng e2e không phải ứng dụng production nếu main.ts và test không dùng chung một hàm setup.</li>
<li>Đo thật: body 50 KB ⇒ 400 trong test, 413 ở production; sửa bằng <code>cauHinhApp()</code>.</li>
<li>Luôn đóng app; pool bị rò sẽ làm test khác đỏ về sau.</li>
<li>Tệp song song cần DB riêng: 5/7 tệp đỏ trên một DB, 7/7 xanh và nhanh gấp đôi khi mỗi worker một DB.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
