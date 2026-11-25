/**
 * 11.6 — Mốc dự án 11: dự án của bạn trong Docker và CI (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/terminus 12.2.0, @nestjs/throttler 6.8.0, ioredis 5.11.1, Prisma 7.10.1,
 * PostgreSQL 16.16 nst-pg, Redis 7.4 nst-redis, Vitest 4.1.12): scratchpad/nst/lab/c11/moc11 (sao từ c10/moc10, 47 test xanh trước khi sửa)
 * ⇒ ../o11db.sh; lab/c11/o/moc11-*.txt. Cuối: 52/52 xanh; CI cục bộ ba job xanh (bài 11.3). Ghép: gen.mjs rồi ghep.sh 116 nst-11-6-moc-du-an.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-10-6-moc-du-an', title: 'NestJS 10.6 — Mốc dự án 10', sub: 'Điểm xuất phát: 47 test, gateway realtime, hai bản API qua Redis adapter.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-11-5-lab', title: 'NestJS 11.5 — Lab: stack compose', sub: 'Nơi phát hiện throttler nhân đôi, nginx giữ IP cũ, keep-alive giữ tắt.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Đề dự án lab-booking', sub: 'Yêu cầu "chạy được bằng một lệnh, CI xanh" của rubric.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'GitHub Docs — Adding a workflow status badge', 'Badge CI trong README.', 'https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/monitoring-workflows/adding-a-workflow-status-badge'),
].join('\n');
const MA_THR = "// redis-throttler.storage.ts — mốc 11: bộ đếm throttler dùng CHUNG giữa mọi bản API (mặc định đếm trong RAM từng tiến trình:\n// 2 bản ⇒ mỗi IP được 2 × limit). Cửa sổ cố định: INCR + PEXPIRE NX; vượt ⇒ khoá chặn riêng sống blockDuration ms.\n// (@nest-lab/throttler-storage-redis 1.2.0 chưa nhận Nest 12 — bài 7.7 — nên tự viết; ~25 dòng)\nimport { Injectable, Module, OnApplicationShutdown } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport type { ThrottlerStorage } from '@nestjs/throttler';\nimport { Redis } from 'ioredis';\nimport type { Env } from '../config/env.schema.js';\n\n@Injectable()\nexport class RedisThrottlerStorage implements ThrottlerStorage, OnApplicationShutdown {\n  readonly redis: Redis;\n  constructor(c: ConfigService<Env, true>) { this.redis = new Redis(c.get('REDIS_URL', { infer: true }), { maxRetriesPerRequest: 2 }); }\n\n  async increment(key: string, ttl: number, limit: number, blockDuration: number, name: string) {\n    const k = `thr:${name}:${key}`, kChan = `${k}:chan`;\n    const kq = await this.redis.multi().incr(k).pexpire(k, ttl, 'NX').pttl(k).pttl(kChan).exec();\n    const [hits, , conLai, conChan] = kq!.map(([loi, v]) => { if (loi) throw loi; return Number(v); });\n    let chanMs = conChan;\n    if (chanMs <= 0 && hits > limit) { await this.redis.set(kChan, '1', 'PX', blockDuration); chanMs = blockDuration; }\n    return { totalHits: hits, timeToExpire: Math.ceil(conLai / 1000), isBlocked: chanMs > 0, timeToBlockExpire: chanMs > 0 ? Math.ceil(chanMs / 1000) : 0 };\n  }\n  // instance này đăng ký dưới HAI token (lớp này + ThrottlerStorage của throttler) ⇒ Nest gọi hook HAI lần, song song.\n  // quit() hai lần ⇒ lần sau lỗi \"Connection is closed\" ⇒ nhớ promise, gọi bao nhiêu lần cũng chỉ quit một lần.\n  private dong?: Promise<unknown>;\n  onApplicationShutdown() { return (this.dong ??= this.redis.quit()); }\n}\n\n@Module({ providers: [RedisThrottlerStorage], exports: [RedisThrottlerStorage] })\nexport class ThrottlerStorageModule {}";
const MA_APPM = "import { throttlers } from './auth/login-throttle.js';\nimport { RedisThrottlerStorage, ThrottlerStorageModule } from './auth/redis-throttler.storage.js';\n  // …\nimport { HealthModule } from './health/health.module.js';\n  // …\n    // mốc 11: bộ đếm chung trong Redis — nhiều bản API vẫn là MỘT giới hạn\n    ThrottlerModule.forRootAsync({\n      imports: [ThrottlerStorageModule], inject: [ConfigService, RedisThrottlerStorage],\n      useFactory: (c: ConfigService<Env, true>, storage: RedisThrottlerStorage) => ({ throttlers: throttlers(c.get('RATE_LIMIT_PER_MIN', { infer: true })), storage }),\n    }),\n  // …\n    HealthModule,                        // mốc 11: /health/live + /health/ready (terminus)";
const MA_ENV = "  // mốc 11: sau SIGTERM còn phục vụ bao lâu (≥ chu kỳ kiểm sức khoẻ của LB); 0 ở dev/test\n  RATE_LIMIT_PER_MIN: z.coerce.number().int().min(1).default(100),     // mốc 11: giới hạn chung mọi bản API (Redis)\n  SHUTDOWN_GRACE_MS: z.coerce.number().int().min(0).max(30_000).default(0),";
const MA_SETUP = "// setup-app.ts — MỌI cấu hình mức ứng dụng ở một chỗ; main.ts và test e2e cùng gọi (mốc 8)\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { ConfigService } from '@nestjs/config';\nimport type { Env } from './config/env.schema.js';\nimport { TatEm } from './health/tat-em.js';\n\nexport function cauHinhApp(app: NestExpressApplication) {\n  const c: ConfigService<Env, true> = app.get(ConfigService);\n  app.useBodyParser('json', { limit: c.get('BODY_LIMIT', { infer: true }) });\n  app.set('trust proxy', c.get('TRUST_PROXY', { infer: true }));        // 0 = không tin X-Forwarded-For; 1 = sau một nginx\n  app.enableShutdownHooks();\n  app.use(app.get(TatEm).middleware);                                    // mốc 11: đang tắt ⇒ Connection: close\n  return app;\n}";
const MA_RESET = "  // mốc 11: bộ đếm throttler giờ nằm trong Redis ⇒ xoá trước mỗi tệp, không thì tệp trước \"tiêu\" hạn mức của tệp sau\n  const r = new Redis(process.env.REDIS_URL!);\n  const ks = await r.keys('thr:*');\n  if (ks.length) await r.del(...ks);\n  await r.quit();";
const MA_TEST = "// moc11.e2e.spec.ts — mốc 11: health check cho Docker/LB. Chạy với project db (cần PostgreSQL + Redis thật)\nimport request from 'supertest';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { taoApp } from '../test/tao-app.js';\n\ndescribe('Mốc 11 — /health/live và /health/ready', () => {\n  let app: NestExpressApplication;\n  beforeAll(async () => { app = await taoApp(); });\n  afterAll(() => app.close());\n  const http = () => request(app.getHttpServer());\n\n  it('live: 200, không hỏi DB hay Redis', async () => {\n    expect((await http().get('/health/live').expect(200)).body).toEqual({ status: 'ok', info: {}, error: {}, details: {} });\n  });\n  it('ready: DB + Redis up, phản hồi chỉ có trạng thái và thời gian (không lộ dữ liệu nội bộ)', async () => {\n    const b = (await http().get('/health/ready').expect(200)).body;\n    expect(b.status).toBe('ok');\n    for (const k of ['db', 'redis']) expect(Object.keys(b.details[k]).sort()).toEqual(['responseTime', 'status']);\n  });\n  it('không cần token và không bị throttler chặn (LB hỏi liên tục)', async () => {\n    for (let i = 0; i < 120; i++) await http().get('/health/live').expect(200);\n  });\n});\n\ndescribe('Mốc 11 — throttler đếm chung giữa nhiều bản API (Redis)', () => {\n  it('hai bản API cùng Redis: tổng cộng đúng 100 request/phút/IP, request thứ 101 ⇒ 429 dù rơi vào bản nào', async () => {\n    const [a, b] = [await taoApp(), await taoApp()];\n    try {\n      const ma: number[] = [];\n      for (let i = 0; i < 101; i++) ma.push((await request((i % 2 ? b : a).getHttpServer()).get('/rooms')).status);\n      expect(ma.slice(0, 100).every((m) => m === 200)).toBe(true);\n      expect(ma[100]).toBe(429);\n    } finally { await Promise.all([a.close(), b.close()]); }\n  });\n});\n\ndescribe('Mốc 11 — tắt êm', () => {\n  it('sau khi bắt đầu tắt: request vẫn được phục vụ nhưng mang Connection: close', async () => {\n    const app = await taoApp();\n    const srv = app.getHttpServer();\n    expect((await request(srv).get('/health/live').set('Connection', 'keep-alive').expect(200)).headers.connection).not.toBe('close');   // /health không bị throttler đếm\n    await app.get((await import('./tat-em.js')).TatEm).onModuleDestroy();     // đúng việc app.close() làm đầu tiên\n    expect((await request(srv).get('/health/live').set('Connection', 'keep-alive').expect(200)).headers.connection).toBe('close');\n    await app.close();\n  });\n});";
const OUT_LAN1 = " FAIL  |unit| src/config/env.schema.spec.ts > EnvSchema của lab-booking (mốc 5 → 10) > dev: mặc định đủ\nAssertionError: expected { NODE_ENV: 'development', …(15) } to deeply equal { NODE_ENV: 'development', …(14) }\n+   \"SHUTDOWN_GRACE_MS\": 0,\n Test Files  1 failed | 10 passed (11)\n      Tests  1 failed | 49 passed (50)";
const OUT_XANH = " ✓ |unit| src/config/env.schema.spec.ts (5 tests) 100ms\n ✓ |db| src/bookings/bookings.service.db.spec.ts (3 tests) 931ms\n ✓ |db| src/bookings/dac-ta.e2e.spec.ts (6 tests) 2164ms\n ✓ |db| src/common/moc5.e2e.spec.ts (2 tests) 1112ms\n ✓ |db| src/common/pipeline.e2e.spec.ts (4 tests) 1294ms\n ✓ |db| src/common/moc4.e2e.spec.ts (5 tests) 1341ms\n ✓ |db| src/notifications/moc9.e2e.spec.ts (4 tests) 2142ms\n ✓ |db| src/common/moc6.e2e.spec.ts (3 tests) 1634ms\n ✓ |db| src/health/moc11.e2e.spec.ts (5 tests) 2841ms\n ✓ |db| src/common/moc7.e2e.spec.ts (10 tests) 2064ms\n ✓ |db| src/realtime/moc10.e2e.spec.ts (5 tests) 3182ms\n Test Files  11 passed (11)\n      Tests  52 passed (52)";
const OUT_PHA = "# bỏ @SkipThrottle() ở HealthController\n     × không cần token và không bị throttler chặn (LB hỏi liên tục) 143ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nError: expected 200 \"OK\", got 429 \"Too Many Requests\"\n      Tests  1 failed | 2 passed (3)\n# bỏ storage (quay về đếm trong RAM)\n     × hai bản API cùng Redis: tổng cộng đúng 100 request/phút/IP, request thứ 101 ⇒ 429 dù rơi vào bản nào 267ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected 200 to be 429 // Object.is equality\n      Tests  1 failed | 3 passed (4)\n# bỏ app.use(TatEm.middleware)\n     × sau khi bắt đầu tắt: request vẫn được phục vụ nhưng mang Connection: close 40ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected 'keep-alive' to be 'close' // Object.is equality\n      Tests  1 failed | 4 passed (5)";

const BADGE = '![ci](https://github.com/<tài-khoản>/lab-booking/actions/workflows/ci.yml/badge.svg?branch=main)\n\n## Chạy\n```bash\necho "JWT_SECRET=$(openssl rand -base64 33)" > .env\ndocker compose up -d --build --wait\ncurl -s http://127.0.0.1:42150/rooms\n```';

export default {
  title: '11.6 — Project milestone 11: your project in Docker with CI|||11.6 — Mốc dự án 11: dự án của bạn trong Docker và CI',
  slug: 'nst-11-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đưa lab-booking (và đề tài của bạn) lên chuẩn chạy thật: Dockerfile bốn tầng, compose với migrate chạy một lần và hai bản API, /health/live + /health/ready, Connection: close lúc tắt, workflow CI ba job, badge trong README. Thêm kho throttler Redis để nhiều bản vẫn là một giới hạn — và gặp một hook tắt bị Nest gọi hai lần. Lần chạy đầu một test cũ đỏ đúng lý do; cuối 52/52 xanh; ba lần thử phá đều bị test bắt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Milestone</span>
<h2>11.6 — Milestone 11: lab-booking runs with one command, and CI proves it on every push</h2>
<p class="lead">The brief (0.2) requires that a reviewer can start the project with one command and see CI green. This milestone takes the project from 10.6 (47 tests) and adds what 11.1–11.5 measured. Your own project follows the same steps; only the service names change.</p>

<h3>Pass criteria</h3>
<ol>
<li><code>Dockerfile</code> with four stages, runtime as <code>node</code>, exec-form <code>CMD</code>; <code>.dockerignore</code> excludes <code>node_modules</code>, <code>src/generated</code>, <code>.env*</code>.</li>
<li><code>compose.yaml</code>: DB and Redis healthy → <code>migrate</code> completed → two API replicas + worker → load balancer; <code>/health/</code> blocked from outside.</li>
<li><code>/health/live</code> (no dependencies) and <code>/health/ready</code> (DB + Redis, 1 s timeouts), public and not throttled.</li>
<li>Shutdown: grace from config, <code>Connection: close</code> from the first hook, pools closed in <code>onApplicationShutdown</code>.</li>
<li>One rate limit for all replicas (Redis storage), with a test.</li>
<li><code>.github/workflows/ci.yml</code> with <code>kiem</code>, <code>e2e</code>, <code>anh</code>; badge and run instructions in the README.</li>
</ol>

<h3>Step 1 — configuration</h3>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>
<p>Two new variables, both with defaults that keep dev and tests unchanged.</p>

<h3>Step 2 — one rate limit across replicas</h3>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>
<p>A fixed window per key: <code>INCR</code> + <code>PEXPIRE … NX</code> in one <code>MULTI</code>, and a separate block key when the limit is exceeded. The hook keeps its first promise because 11.5 showed Nest calls it twice — the instance is registered under its own class and under <code>ThrottlerStorage</code>. Tests now share Redis counters between files, so <code>db-reset.ts</code> clears them:</p>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>

<h3>Step 3 — health and shutdown wiring</h3>
<p><code>HealthModule</code> and <code>TatEm</code> are the files from 11.2 and 11.5. <code>setup-app.ts</code> — shared by <code>main.ts</code> and the tests (8.x) — installs the middleware:</p>
<pre><code class="language-ts">${esc(MA_SETUP)}</code></pre>

<h3>Step 4 — tests, and the first run</h3>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<pre><code class="language-text">${esc(OUT_LAN1)}</code></pre>
<p>Red for the right reason: the env-schema test pins every default, and the schema gained <code>SHUTDOWN_GRACE_MS</code>. That is the test doing its job — a new variable must be a conscious change. Two more surprises while writing the milestone test: the <code>Connection: close</code> check passed even without the middleware until the request sent <code>Connection: keep-alive</code> explicitly (supertest's default connection closes anyway), and a test that used <code>/rooms</code> got 429 because the previous test in the same file had used up the now-shared limit — so it uses <code>/health/live</code>, which is not counted.</p>

<h3>Step 5 — green, and proof that the tests bite</h3>
<pre><code class="language-text">${esc(OUT_XANH)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA)}</code></pre>
<p>Each protection was removed once and the matching test failed with the expected message. Then the three CI jobs ran green (11.3) and the stack passed the restart experiments (11.5).</p>

<h3>Step 6 — README</h3>
<pre><code class="language-markdown">${esc(BADGE)}</code></pre>

<h3>Your project</h3>
<p>Apply the same six criteria. Typical differences: TypeORM instead of Prisma (no generate step, but migrations still a separate one-shot service), no Redis (then the in-memory throttler is fine only with one replica — write that down), a frontend (another service behind the same load balancer). Keep the restart experiment from 11.5: it is the strongest evidence in a project defence.</p>

<h3>Self-assessment (10 points for this milestone)</h3>
<ul>
<li>2 — image builds from a clean clone, runs as non-root, pull size written in the README.</li>
<li>2 — <code>docker compose up -d --build --wait</code> green from <code>down -v</code>.</li>
<li>2 — liveness/readiness correct, details not public.</li>
<li>2 — CI three jobs, required on <code>main</code>, one deliberately red run per job.</li>
<li>2 — restart under load with numbers, explained.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
<li>New in milestone 11: Docker four stages, Compose with migrate + two replicas + LB, terminus health, graceful shutdown with <code>Connection: close</code>, Redis throttler storage, CI three jobs.</li>
<li>First run: one old test red for the right reason (new env default). Final: 52/52; three deliberate breaks each caught.</li>
<li>Found while doing it: a shutdown hook called twice for one instance registered under two tokens — make hooks idempotent.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Mốc dự án</span>
<h2>11.6 — Mốc 11: lab-booking chạy bằng một lệnh, và CI chứng minh điều đó sau mỗi lần đẩy mã</h2>
<p class="lead">Đề (0.2) yêu cầu người chấm khởi động được dự án bằng một lệnh và thấy CI xanh. Mốc này lấy dự án từ 10.6 (47 test) và thêm những gì 11.1–11.5 đã đo. Đề tài của bạn đi đúng các bước này; chỉ khác tên dịch vụ.</p>

<h3>Tiêu chí đạt</h3>
<ol>
<li><code>Dockerfile</code> bốn tầng, runtime chạy bằng <code>node</code>, <code>CMD</code> dạng exec; <code>.dockerignore</code> loại <code>node_modules</code>, <code>src/generated</code>, <code>.env*</code>.</li>
<li><code>compose.yaml</code>: DB và Redis healthy → <code>migrate</code> hoàn tất → hai bản API + worker → bộ cân bằng tải; <code>/health/</code> bị chặn từ ngoài.</li>
<li><code>/health/live</code> (không phụ thuộc) và <code>/health/ready</code> (DB + Redis, hạn 1 giây), công khai và không bị throttle.</li>
<li>Tắt: grace lấy từ cấu hình, <code>Connection: close</code> từ hook đầu tiên, đóng pool ở <code>onApplicationShutdown</code>.</li>
<li>Một giới hạn tần suất cho mọi bản (kho Redis), có test.</li>
<li><code>.github/workflows/ci.yml</code> với <code>kiem</code>, <code>e2e</code>, <code>anh</code>; badge và hướng dẫn chạy trong README.</li>
</ol>

<h3>Bước 1 — cấu hình</h3>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>
<p>Hai biến mới, cả hai có mặc định giữ nguyên dev và test.</p>

<h3>Bước 2 — một giới hạn cho mọi bản</h3>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>
<p>Cửa sổ cố định theo khoá: <code>INCR</code> + <code>PEXPIRE … NX</code> trong một <code>MULTI</code>, cộng một khoá chặn riêng khi vượt giới hạn. Hook giữ lại promise đầu tiên vì 11.5 cho thấy Nest gọi nó hai lần — instance được đăng ký dưới chính lớp của nó và dưới <code>ThrottlerStorage</code>. Giờ các tệp test dùng chung bộ đếm Redis, nên <code>db-reset.ts</code> xoá chúng:</p>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>

<h3>Bước 3 — nối health và quá trình tắt</h3>
<p><code>HealthModule</code> và <code>TatEm</code> là các tệp của 11.2 và 11.5. <code>setup-app.ts</code> — dùng chung cho <code>main.ts</code> và test (8.x) — gắn middleware:</p>
<pre><code class="language-ts">${esc(MA_SETUP)}</code></pre>

<h3>Bước 4 — test, và lần chạy đầu</h3>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<pre><code class="language-text">${esc(OUT_LAN1)}</code></pre>
<p>Đỏ đúng lý do: test schema môi trường ghim mọi giá trị mặc định, mà schema vừa thêm <code>SHUTDOWN_GRACE_MS</code>. Đó là test đang làm đúng việc — thêm biến phải là một thay đổi có chủ ý. Thêm hai bất ngờ lúc viết test của mốc: kiểm <code>Connection: close</code> vẫn qua dù thiếu middleware, cho tới khi request gửi rõ <code>Connection: keep-alive</code> (kết nối mặc định của supertest vốn tự đóng); và một test dùng <code>/rooms</code> nhận 429 vì test trước trong cùng tệp đã tiêu hết giới hạn giờ đã dùng chung — nên nó dùng <code>/health/live</code>, route không bị đếm.</p>

<h3>Bước 5 — xanh, và bằng chứng test có răng</h3>
<pre><code class="language-text">${esc(OUT_XANH)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA)}</code></pre>
<p>Mỗi lớp bảo vệ bị gỡ một lần và đúng test tương ứng đỏ với thông báo như dự kiến. Sau đó ba job CI chạy xanh (11.3) và stack qua được các thí nghiệm khởi động lại (11.5).</p>

<h3>Bước 6 — README</h3>
<pre><code class="language-markdown">${esc(BADGE)}</code></pre>

<h3>Đề tài của bạn</h3>
<p>Áp đúng sáu tiêu chí. Khác biệt hay gặp: TypeORM thay Prisma (không có bước generate, nhưng migration vẫn là một dịch vụ chạy một lần riêng), không có Redis (khi đó throttler trong RAM chỉ ổn với một bản — ghi rõ ra), có frontend (thêm một dịch vụ sau cùng bộ cân bằng tải). Giữ thí nghiệm khởi động lại của 11.5: đó là bằng chứng mạnh nhất khi bảo vệ dự án.</p>

<h3>Tự chấm (10 điểm cho mốc này)</h3>
<ul>
<li>2 — ảnh dựng được từ bản clone sạch, chạy không root, cỡ khi kéo về ghi trong README.</li>
<li>2 — <code>docker compose up -d --build --wait</code> xanh từ trạng thái <code>down -v</code>.</li>
<li>2 — liveness/readiness đúng, chi tiết không công khai.</li>
<li>2 — CI ba job, bắt buộc trên <code>main</code>, mỗi job có một lượt cố tình đỏ.</li>
<li>2 — khởi động lại dưới tải có số liệu, có giải thích.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mới ở mốc 11: Docker bốn tầng, Compose có migrate + hai bản + bộ cân bằng tải, health bằng terminus, tắt êm với <code>Connection: close</code>, kho throttler Redis, CI ba job.</li>
<li>Lần chạy đầu: một test cũ đỏ đúng lý do (mặc định môi trường mới). Cuối: 52/52; ba lần cố tình phá đều bị bắt.</li>
<li>Phát hiện khi làm: hook tắt bị gọi hai lần cho một instance đăng ký dưới hai token — viết hook gọi lại cũng không sao.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
