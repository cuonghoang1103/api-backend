/**
 * 11.2 — Health check với @nestjs/terminus, tắt êm và sẵn sàng nhận request (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/terminus 12.2.0, pg 8.23.1, ioredis 5.11.1; nst-pg 41601, nst-redis 41901):
 * scratchpad/nst/lab/c11/app/src/b112 (b112.sh song|ready|tat, k112.mjs, chay-112-tat.sh) ⇒ lab/c11/o/112-*.txt; moc11/src/health.
 * Đã đọc mã terminus 12.2 (HealthCheckExecutor.beforeApplicationShutdown, getStatus SHUTTING_DOWN) và nest-application-context.js (thứ tự close()).
 * Ghép: gen.mjs rồi ghep.sh 112 nst-11-2-health.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-6-health-check-canh-bao', title: 'Node.js 15.6 — Health check, cảnh báo, và 3 giờ sáng', sub: 'Liveness/readiness nói chung, không gắn framework.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-9-3-thu-tu-khoi-dong', title: 'Docker 9.3 — depends_on, healthcheck, thứ tự khởi động', sub: 'Nơi /health/ready của bài này được dùng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-4-scope-lifecycle', title: 'NestJS 2.4 — Scope và lifecycle hook', sub: 'onModuleDestroy, beforeApplicationShutdown, onApplicationShutdown — bài này đo chúng lúc tắt thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-1-bullmq', title: 'NestJS 9.1 — BullMQ', sub: 'Vì sao PrismaService đóng ở onApplicationShutdown từ mốc 9.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Health checks (Terminus)', 'HealthCheckService, HealthIndicatorService, gracefulShutdownTimeoutMs.', 'https://docs.nestjs.com/recipes/terminus'),
  nguon('📘', 'NestJS docs — Lifecycle events', 'Thứ tự hook khi khởi động và khi app.close().', 'https://docs.nestjs.com/fundamentals/lifecycle-events'),
].join('\n');
const MA_B_HC = "// health.controller.ts — liveness: tiến trình còn sống không (KHÔNG hỏi DB). readiness: có nhận request được không (DB + Redis)\nimport { Controller, Get } from '@nestjs/common';\nimport { HealthCheck, HealthCheckService, HealthIndicatorService } from '@nestjs/terminus';\nimport { Redis } from 'ioredis';\nimport { Db } from './db.js';\n\nconst HAN = process.env.TIMEOUT === '0' ? undefined : 1000;      // TIMEOUT=0 ⇒ thử bỏ withTimeout\n\n@Controller('health')\nexport class HealthController {\n  private readonly redis = new Redis(process.env.REDIS_URL!, { lazyConnect: false });\n  constructor(private readonly health: HealthCheckService, private readonly hi: HealthIndicatorService, private readonly db: Db) {}\n\n  @Get('live') @HealthCheck()\n  live() { return this.health.check([]); }\n\n  @Get('ready') @HealthCheck()\n  ready() {\n    const db = this.hi.check('db').attempt(async () => { await this.db.pool.query('SELECT 1'); })   // KHÔNG trả kết quả: terminus sẽ nhét nó vào phản hồi;\n    const redis = this.hi.check('redis').attempt(async () => { await this.redis.ping(); });\n    return this.health.check(HAN ? [db.withTimeout(HAN), redis.withTimeout(HAN)] : [db, redis]);\n  }\n}";
const MA_B_DB = "// db.ts — một pg.Pool cho cả ứng dụng. DONG=destroy|shutdown chọn hook đóng pool (đo xem đóng sớm thì chuyện gì xảy ra)\nimport { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';\nimport pg from 'pg';\n\n@Injectable()\nexport class Db implements OnModuleDestroy, OnApplicationShutdown {\n  private readonly log = new Logger('Db');\n  readonly pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });\n  async onModuleDestroy() { if (process.env.DONG === 'destroy') { await this.pool.end(); this.log.log('pool đã đóng (onModuleDestroy)'); } }\n  async onApplicationShutdown(sig?: string) {\n    if (process.env.DONG !== 'destroy') { await this.pool.end(); this.log.log(`pool đã đóng (onApplicationShutdown ${sig})`); }\n  }\n}";
const MA_HC = "// health.controller.ts — mốc 11. /health/live: tiến trình còn chạy (KHÔNG hỏi DB/Redis — DB chết mà restart API thì chỉ thêm bão restart)\n// /health/ready: nhận request được không (DB + Redis, mỗi cái tối đa 1 s). Đang tắt ⇒ terminus tự trả 503 \"shutting_down\".\nimport { Controller, Get, OnApplicationShutdown } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { SkipThrottle } from '@nestjs/throttler';\nimport { HealthCheck, HealthCheckService, HealthIndicatorService, PrismaHealthIndicator } from '@nestjs/terminus';\nimport { Redis } from 'ioredis';\nimport { Public } from '../auth/decorators.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport type { Env } from '../config/env.schema.js';\n\n@Public() @SkipThrottle()\n@Controller('health')\nexport class HealthController implements OnApplicationShutdown {\n  private readonly redis: Redis;\n  constructor(\n    private readonly health: HealthCheckService, private readonly hi: HealthIndicatorService,\n    private readonly prismaHi: PrismaHealthIndicator, private readonly db: PrismaService, c: ConfigService<Env, true>,\n  ) {\n    // client riêng, không hàng đợi offline: Redis chết thì ping hỏng ngay thay vì xếp hàng chờ\n    this.redis = new Redis(c.get('REDIS_URL', { infer: true }), { enableOfflineQueue: false, maxRetriesPerRequest: 1, lazyConnect: true });\n  }\n\n  @Get('live') @HealthCheck()\n  live() { return this.health.check([]); }\n\n  @Get('ready') @HealthCheck()\n  ready() {\n    return this.health.check([\n      this.prismaHi.pingCheck('db', this.db).withTimeout(1000),\n      this.hi.check('redis').attempt(async () => {\n        if (this.redis.status === 'wait') await this.redis.connect();\n        await this.redis.ping();             // không trả kết quả: terminus sẽ nhét giá trị trả về vào phản hồi\n      }).withTimeout(1000),\n    ]);\n  }\n\n  async onApplicationShutdown() { this.redis.disconnect(); }\n}";
const MA_HM = "// health.module.ts — mốc 11: terminus. SHUTDOWN_GRACE_MS > 0 ⇒ sau SIGTERM vẫn phục vụ thêm chừng ấy ms, ready trả 503 để LB rút bản này ra\nimport { Module } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { TerminusModule } from '@nestjs/terminus';\nimport type { Env } from '../config/env.schema.js';\nimport { HealthController } from './health.controller.js';\nimport { TatEm } from './tat-em.js';\n\n@Module({\n  imports: [TerminusModule.forRootAsync({\n    inject: [ConfigService],\n    useFactory: (c: ConfigService<Env, true>) => ({ gracefulShutdownTimeoutMs: c.get('SHUTDOWN_GRACE_MS', { infer: true }), logger: true }),\n  })],\n  controllers: [HealthController],\n  providers: [TatEm],\n  exports: [TatEm],\n})\nexport class HealthModule {}";
const OUT_LO = "GET /health/ready → 200 {\"status\":\"ok\",\"info\":{\"db\":{\"command\":\"SELECT\",\"rowCount\":1,\"oid\":null,\"rows\":[{\"?column?\":1}],\"fields\":[{\"name\":\"?column?\",\"tableID\":0,\"columnID\":0,\"dataTypeID\":23,\"dat  (20 ms)";
const OUT_SONG = "GET /health/live  → 200 {\"status\":\"ok\",\"info\":{},\"error\":{},\"details\":{}}  (66 ms)\nGET /health/ready → 200 {\"status\":\"ok\",\"info\":{\"db\":{\"responseTime\":15,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}},\"error\":{},\"details\":{\"db\":{\"responseTime\":15,\"status\":\"up\"},\"redi  (19  …";
const OUT_TREO = "GET /health/ready → 503 {\"status\":\"error\",\"info\":{\"db\":{\"responseTime\":13,\"status\":\"up\"}},\"error\":{\"redis\":{\"message\":\"timeout of 1000ms exceeded\",\"responseTime\":1000,\"status\":\"down\"}},\"details\"  (107 …";
const OUT_TREO0 = "GET /health/ready → LỖI TimeoutError  (5004 ms)";
const MA_TAT = "// tat-em.ts — mốc 11: từ lúc nhận SIGTERM, mọi phản hồi mang \"Connection: close\" ⇒ nginx/LB bỏ kết nối keep-alive tới bản này.\n// Không có nó: kết nối keep-alive luôn bận dưới tải ⇒ server.close() chờ mãi ⇒ Docker hết stop_grace_period thì SIGKILL.\n// onModuleDestroy là hook ĐẦU TIÊN của app.close() — chạy trước thời gian chờ SHUTDOWN_GRACE_MS của terminus (beforeApplicationShutdown).\nimport { Injectable, OnModuleDestroy } from '@nestjs/common';\nimport type { NextFunction, Request, Response } from 'express';\n\n@Injectable()\nexport class TatEm implements OnModuleDestroy {\n  dangTat = false;\n  onModuleDestroy() { this.dangTat = true; }\n  middleware = (_req: Request, res: Response, next: NextFunction) => {\n    if (this.dangTat) res.setHeader('Connection', 'close');\n    next();\n  };\n}";
const OUT_PG = "GET /health/live  → 200 {\"status\":\"ok\",\"info\":{},\"error\":{},\"details\":{}}  (80 ms)\nGET /health/ready → 503 {\"status\":\"error\",\"info\":{\"redis\":{\"responseTime\":1,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"connect ECONNREFUSED 127.0.0.1:41601\",\"responseTime\":4,\"status\":\"down\"}},\"de  (10 ms)";
const OUT_TAT_A = "t= 354 ms  >>> gửi SIGTERM cho server\nt= 363 ms  /cham (bắt đầu t=0)  → LỖI UND_ERR_SOCKET  (363 ms)\nt= 602 ms  ready (gửi t=600) → LỖI ECONNREFUSED  (2 ms)\nt= 602 ms  /phong (gửi t=600) → LỖI ECONNREFUSED  (1 ms)\nt=1202 ms  ready (gửi t=1200) → LỖI ECONNREFUSED  (2 ms)\nt=1202 ms  /phong (gửi t=1200) → LỖI ECONNREFUSED  (1 ms)\nt=1802 ms  ready (gửi t=1800) → LỖI ECONNREFUSED  (2 ms)\nt=1802 ms  /phong (gửi t=1800) → LỖI ECONNREFUSED  (1 ms)\nt=2403 ms  ready (gửi t=2400) → LỖI ECONNREFUSED  (3 ms)\nt=2404 ms  /phong (gửi t=2400) → LỖI ECONNREFUSED  (3 ms)\nt=3202 ms  ready (gửi t=3200) → LỖI ECONNREFUSED  (1 ms)\nt=3202 ms  /phong (gửi t=3200) → LỖI ECONNREFUSED  (1 ms)\nt=4201 ms  ready (gửi t=4200) → LỖI ECONNREFUSED  (1 ms)\nt=4201 ms  /phong (gửi t=4200) → LỖI ECONNREFUSED  (0 ms)\n—— server thoát, mã 143\n—— log server";
const OUT_TAT_B = "t= 371 ms  >>> gửi SIGTERM cho server\nt= 603 ms  ready (gửi t=600) → LỖI ECONNREFUSED  (3 ms)\nt= 604 ms  /phong (gửi t=600) → LỖI ECONNREFUSED  (3 ms)\nt=1202 ms  ready (gửi t=1200) → LỖI ECONNREFUSED  (2 ms)\nt=1203 ms  /phong (gửi t=1200) → LỖI ECONNREFUSED  (2 ms)\nt=1802 ms  ready (gửi t=1800) → LỖI ECONNREFUSED  (2 ms)\nt=1802 ms  /phong (gửi t=1800) → LỖI ECONNREFUSED  (1 ms)\nt=2402 ms  ready (gửi t=2400) → LỖI ECONNREFUSED  (2 ms)\nt=2403 ms  /phong (gửi t=2400) → LỖI ECONNREFUSED  (2 ms)\nt=2613 ms  /cham (bắt đầu t=0)  → 200 {\"xong\":true,\"luc\":\"2026-11-24T03:23:29.262Z\"}  (2613 ms)\nt=3202 ms  /phong (gửi t=3200) → LỖI ECONNREFUSED  (1 ms)\nt=3208 ms  ready (gửi t=3200) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":3,\"status\":\"up\"},\"redis\":{\"responseTime\":2,\"status\":\"up\"}}, …\nt=4201 ms  /phong (gửi t=4200) → LỖI ECONNREFUSED  (0 ms)\nt=4203 ms  ready (gửi t=4200) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":1,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}}, …\n—— server thoát, mã 143\n—— log server\n[Nest] LOG [Db] pool đã đóng (onApplicationShutdown SIGTERM)";
const OUT_TAT_C = "t= 354 ms  >>> gửi SIGTERM cho server\nt= 619 ms  ready (gửi t=600) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":7,\"status\":\"up\"},\"redis\":{\"responseTime\":2,\"status\":\"up\"}},\" …\nt= 620 ms  /phong (gửi t=600) → 200 {\"ok\":1}  (20 ms)\nt=1204 ms  ready (gửi t=1200) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":1,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}}, …\nt=1205 ms  /phong (gửi t=1200) → 200 {\"ok\":1}  (4 ms)\nt=1804 ms  ready (gửi t=1800) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":1,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}}, …\nt=1804 ms  /phong (gửi t=1800) → 200 {\"ok\":1}  (3 ms)\nt=2403 ms  ready (gửi t=2400) → LỖI ECONNREFUSED  (2 ms)\nt=2403 ms  /phong (gửi t=2400) → LỖI ECONNREFUSED  (2 ms)\nt=2576 ms  /cham (bắt đầu t=0)  → 200 {\"xong\":true,\"luc\":\"2026-11-24T03:24:09.226Z\"}  (2575 ms)\nt=3202 ms  /phong (gửi t=3200) → LỖI ECONNREFUSED  (1 ms)\nt=3203 ms  ready (gửi t=3200) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":1,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}}, …\nt=4203 ms  /phong (gửi t=4200) → LỖI ECONNREFUSED  (1 ms)\nt=4206 ms  ready (gửi t=4200) → 503 {\"status\":\"shutting_down\",\"info\":{\"db\":{\"responseTime\":1,\"status\":\"up\"},\"redis\":{\"responseTime\":1,\"status\":\"up\"}}, …\n—— server thoát, mã 143\n—— log server\n[Nest] LOG Received termination signal SIGTERM\n[Nest] LOG Awaiting 1500ms before shutdown\n[Nest] LOG Timeout reached, shutting down now\n[Nest] LOG [Db] pool đã đóng (onApplicationShutdown SIGTERM)";
const OUT_TAT_D = "t= 354 ms  >>> gửi SIGTERM cho server\nt= 615 ms  ready (gửi t=600) → 503 {\"status\":\"error\",\"info\":{\"redis\":{\"responseTime\":2,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"Cannot use a pool aft …\nt= 617 ms  /phong (gửi t=600) → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}  (16 ms)\nt=1203 ms  /phong (gửi t=1200) → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}  (2 ms)\nt=1204 ms  ready (gửi t=1200) → 503 {\"status\":\"error\",\"info\":{\"redis\":{\"responseTime\":2,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"Cannot use a pool af …\nt=1804 ms  /phong (gửi t=1800) → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}  (3 ms)\nt=1804 ms  ready (gửi t=1800) → 503 {\"status\":\"error\",\"info\":{\"redis\":{\"responseTime\":2,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"Cannot use a pool af …\nt=2403 ms  /phong (gửi t=2400) → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}  (3 ms)\nt=2404 ms  ready (gửi t=2400) → 503 {\"status\":\"error\",\"info\":{\"redis\":{\"responseTime\":2,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"Cannot use a pool af …\nt=2578 ms  /cham (bắt đầu t=0)  → 200 {\"xong\":true,\"luc\":\"2026-11-24T03:24:49.226Z\"}  (2577 ms)\nt=3202 ms  /phong (gửi t=3200) → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}  (2 ms)\nt=3204 ms  ready (gửi t=3200) → 503 {\"status\":\"shutting_down\",\"info\":{\"redis\":{\"responseTime\":1,\"status\":\"up\"}},\"error\":{\"db\":{\"message\":\"Cannot use a …\nt=4202 ms  ready (gửi t=4200) → LỖI ECONNREFUSED  (1 ms)\nt=4202 ms  /phong (gửi t=4200) → LỖI ECONNREFUSED  (1 ms)\n—— server thoát, mã 143\n—— log server\n[Nest] LOG [Db] pool đã đóng (onModuleDestroy)\n[Nest] LOG Received termination signal SIGTERM\n[Nest] LOG Awaiting 1500ms before shutdown\n[Nest] LOG Timeout reached, shutting down now";

const BANG_EN = `<table>
<tr><th>Config</th><th>Slow request in flight</th><th>New requests during shutdown</th><th>Verdict</th></tr>
<tr><td>A — no <code>enableShutdownHooks()</code></td><td>cut: <code>UND_ERR_SOCKET</code> at 363 ms</td><td>refused</td><td>loses work</td></tr>
<tr><td>B — hooks, grace 0</td><td>completes (200 at 2.6 s)</td><td>refused immediately</td><td>OK only if the LB already stopped sending</td></tr>
<tr><td>C — hooks, <code>gracefulShutdownTimeoutMs: 1500</code></td><td>completes</td><td>served for 1.5 s, <code>/health/ready</code> = 503 <code>shutting_down</code></td><td>what an LB with readiness probes needs</td></tr>
<tr><td>D — like C, but pool closed in <code>onModuleDestroy</code></td><td>completes</td><td>500 "Cannot use a pool after calling end" for 1.5 s</td><td>worse than B</td></tr>
</table>`;
const BANG_VI = `<table>
<tr><th>Cấu hình</th><th>Request chậm đang chạy</th><th>Request mới trong lúc tắt</th><th>Kết luận</th></tr>
<tr><td>A — không <code>enableShutdownHooks()</code></td><td>bị cắt: <code>UND_ERR_SOCKET</code> ở 363 ms</td><td>bị từ chối</td><td>mất việc đang làm</td></tr>
<tr><td>B — có hook, grace 0</td><td>xong (200 ở 2,6 s)</td><td>bị từ chối ngay</td><td>chỉ ổn nếu LB đã thôi gửi</td></tr>
<tr><td>C — có hook, <code>gracefulShutdownTimeoutMs: 1500</code></td><td>xong</td><td>vẫn phục vụ 1,5 s, <code>/health/ready</code> = 503 <code>shutting_down</code></td><td>đúng thứ LB có readiness cần</td></tr>
<tr><td>D — như C, nhưng đóng pool ở <code>onModuleDestroy</code></td><td>xong</td><td>500 "Cannot use a pool after calling end" suốt 1,5 s</td><td>tệ hơn B</td></tr>
</table>`;
const THU_TU = `<ol>
<li><code>prepareClose()</code> — the HTTP adapter marks itself as shutting down</li>
<li><code>onModuleDestroy()</code> of every provider</li>
<li><code>beforeApplicationShutdown(signal)</code> — terminus sleeps <code>gracefulShutdownTimeoutMs</code> here</li>
<li><code>dispose()</code> — WebSocket server, microservices, then <code>server.close()</code></li>
<li><code>onApplicationShutdown(signal)</code> — the right place to close the DB pool and Redis</li>
</ol>`;
const THU_TU_VI = `<ol>
<li><code>prepareClose()</code> — adapter HTTP tự đánh dấu đang tắt</li>
<li><code>onModuleDestroy()</code> của mọi provider</li>
<li><code>beforeApplicationShutdown(signal)</code> — terminus ngủ <code>gracefulShutdownTimeoutMs</code> ở đây</li>
<li><code>dispose()</code> — server WebSocket, microservice, rồi <code>server.close()</code></li>
<li><code>onApplicationShutdown(signal)</code> — chỗ đúng để đóng pool DB và Redis</li>
</ol>`;

export default {
  title: '11.2 — Health checks with @nestjs/terminus, graceful shutdown and readiness|||11.2 — Health check với @nestjs/terminus, tắt êm và sẵn sàng nhận request',
  slug: 'nst-11-2-health',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Liveness không hỏi DB, readiness hỏi DB + Redis có hạn 1 giây — đo thật bằng terminus 12.2: attempt() trả giá trị thì nguyên object pg bị nhét vào phản hồi; bỏ withTimeout thì Redis treo làm readiness treo theo. Rồi đo bốn cấu hình tắt với một request chậm đang chạy: không hook ⇒ bị cắt; grace 1,5 s ⇒ vẫn phục vụ và ready trả 503; đóng pool ở onModuleDestroy ⇒ 500 suốt thời gian chờ. Cuối cùng đưa vào lab-booking.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>11.2 — Two questions a container platform asks your API, and what Nest does between SIGTERM and exit</h2>
<p class="lead">Docker, Compose, Kubernetes and load balancers keep asking two different questions: <em>is the process alive?</em> (restart it if not) and <em>may I send it traffic?</em> (take it out of rotation if not). Mixing them up causes restart storms; answering them badly during shutdown drops requests. The theory is in Node.js 15.6; this lesson builds both endpoints with <code>@nestjs/terminus</code> 12.2 and measures shutdown on a real Nest app.</p>

<h3>Everyday analogy: a shop's door sign</h3>
<p>"Is the shopkeeper breathing?" and "is the shop open?" are different questions. If the supplier is late, the shop flips its sign to <em>closed</em> — nobody calls an ambulance. At closing time the sign flips first, customers already inside finish paying, then the lights go off. Liveness is the ambulance question, readiness is the sign, graceful shutdown is closing time.</p>

<h3>1. Liveness and readiness with terminus</h3>
<pre><code class="language-ts">${esc(MA_B_HC)}</code></pre>
<pre><code class="language-text">${esc(OUT_SONG)}</code></pre>
<p><strong>Liveness never touches the database.</strong> If PostgreSQL goes down and liveness checked it, every API replica would be restarted in a loop — restarts cannot fix the database and the restarts themselves add load. Readiness is where dependencies belong.</p>
<p><strong>Trap 1 — whatever <code>attempt()</code> returns ends up in the response.</strong> The first version was <code>attempt(() =&gt; this.db.pool.query('SELECT 1'))</code>:</p>
<pre><code class="language-text">${esc(OUT_LO)}</code></pre>
<p>The whole <code>pg</code> result object (fields, parsers, type tables) went into a public endpoint, and terminus logged a deprecation warning saying the next major will ignore it. Return nothing from <code>attempt</code>, or choose fields with <code>.withSuccessData()</code>.</p>
<p><strong>Trap 2 — a hanging dependency makes readiness hang.</strong> Redis paused with <code>docker pause</code>:</p>
<pre><code class="language-text">${esc(OUT_TREO)}</code></pre>
<p>With <code>.withTimeout(1000)</code>: 503 after 1074 ms. Without it (TIMEOUT=0):</p>
<pre><code class="language-text">${esc(OUT_TREO0)}</code></pre>
<p>A probe that never answers is worse than a 503: the orchestrator's own timeout decides, and probes pile up. PostgreSQL stopped:</p>
<pre><code class="language-text">${esc(OUT_PG)}</code></pre>
<p>Note the internal address in the message. Health details are for the internal network; lesson 11.5 makes nginx return 404 for <code>/health/</code> from outside.</p>

<h3>2. What happens between SIGTERM and exit</h3>
<p>Read from <code>nest-application-context.js</code> in Nest 12.6, <code>app.close()</code> runs:</p>
${THU_TU}
<p>The experiment (<code>b112</code>): a request to <code>/cham?ms=2500</code> starts at t = 0 and holds a DB connection; SIGTERM at t ≈ 350 ms; new <code>/health/ready</code> and <code>/phong</code> requests every 600 ms.</p>
<pre><code class="language-ts">${esc(MA_B_DB)}</code></pre>
<p><strong>A — no shutdown hooks:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_A)}</code></pre>
<p><strong>C — hooks + <code>gracefulShutdownTimeoutMs: 1500</code>:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_C)}</code></pre>
<p><strong>D — same, but the pool is closed in <code>onModuleDestroy</code>:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_D)}</code></pre>
${BANG_EN}
<p>Two lessons. Terminus' grace period runs in <code>beforeApplicationShutdown</code>, <em>after</em> every <code>onModuleDestroy</code> — anything you close there is already gone while the app keeps serving. And the grace period only helps if something in front of the app reads <code>/health/ready</code> and stops sending traffic; lesson 11.5 measures that with two load balancers. The exit code outside a container was 143 in every case: after the hooks Nest re-raises the signal (<code>useProcessExit: true</code> in <code>enableShutdownHooks</code> exits 0 instead).</p>

<h3>3. Into lab-booking</h3>
<pre><code class="language-ts">${esc(MA_HC)}</code></pre>
<pre><code class="language-ts">${esc(MA_HM)}</code></pre>
<p>Details that came from tests, not from reading docs: <code>@Public()</code> because the global JWT guard (7.x) would answer 401 to the load balancer; <code>@SkipThrottle()</code> because a probe twice per second exhausts 100 requests per minute (the milestone test fails with 429 without it); a separate Redis client with <code>enableOfflineQueue: false</code> so a dead Redis fails fast; <code>autoLogging.ignore</code> for <code>/health</code> so probes do not flood the logs; <code>SHUTDOWN_GRACE_MS</code> in the env schema, 0 for dev and tests.</p>

<h3>🧪 Exercise (15 min)</h3>
<ol>
<li>Your readiness checks DB, Redis and an external SMS provider. The SMS provider is down for an hour. What happens to your API, and what should you change?</li>
<li>Kubernetes sends SIGTERM and removes the pod from Service endpoints <em>at the same time</em>, and endpoint removal takes a few seconds to reach every node. Which config from the table do you want, and how large should the grace be?</li>
<li>Why is <code>PrismaService.$disconnect()</code> in <code>onApplicationShutdown</code> and not <code>onModuleDestroy</code>?</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>Every replica reports not-ready, the LB has no backend, and the whole API is down for an hour because of a feature most requests do not use. Readiness should check only what <em>every</em> request needs (DB, maybe Redis). Degrade the SMS feature (queue and retry — BullMQ, 9.1) or report it as <code>degraded</code>, which terminus 12 keeps at HTTP 200.</li>
<li>Config C with a grace longer than the propagation delay plus the probe interval — commonly 5–10 s — and <code>terminationGracePeriodSeconds</code> (or Compose <code>stop_grace_period</code>) longer than grace + your slowest request, otherwise SIGKILL arrives first.</li>
<li>Config D measured it: <code>onModuleDestroy</code> runs before the grace period and before the HTTP server closes, so requests still being served get "pool after calling end" 500s. <code>onApplicationShutdown</code> runs after the server is closed.</li>
</ol>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Liveness vs readiness?</strong> Liveness: is the process healthy enough to keep (restart otherwise), no dependencies. Readiness: can it serve now (DB/Redis), used to route traffic.</li>
<li><strong>What does <code>enableShutdownHooks()</code> do?</strong> Listens for SIGTERM/SIGINT, runs <code>app.close()</code> with the lifecycle hooks in order, then re-raises the signal. Without it Node dies immediately and in-flight requests are cut.</li>
<li><strong>Why can't a health check call itself "healthy" when the DB is slow?</strong> Every indicator needs a timeout; otherwise the check hangs with the dependency.</li>
<li><strong>Where do you close connections?</strong> <code>onApplicationShutdown</code>, after the HTTP server stopped; queue workers drain in <code>onModuleDestroy</code> (BullMQ, 9.1).</li>
</ol>

<h3>💼 On the job</h3>
<p>A common ticket on outsourcing projects: "random 502s during every deployment". Before touching the load balancer, ask three questions you can now answer with measurements: is <code>enableShutdownHooks()</code> called, is CMD exec form (11.1), and does anything close a pool in <code>onModuleDestroy</code>? Then reproduce with a slow endpoint and a timeline like the one above — a reproduced bug with a timeline is the fastest way to get a fix approved.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Liveness</span><span class="v">"Keep or restart?" — no dependencies.</span></div>
  <div class="kv"><span class="k">Readiness</span><span class="v">"Send traffic or not?" — checks what every request needs, each with a timeout.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">Stop taking new work, finish work in flight, then release resources.</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">Time the app keeps serving after SIGTERM while reporting not-ready.</span></div>
  <div class="kv"><span class="k">Restart storm</span><span class="v">Replicas restarted in a loop because liveness depended on something restarts cannot fix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Liveness = no dependencies; readiness = DB + Redis, each <code>.withTimeout(1000)</code>; return nothing from <code>attempt()</code>.</li>
<li>Measured: no hooks ⇒ request in flight cut; grace 1.5 s ⇒ served + ready 503 <code>shutting_down</code>; pool closed in <code>onModuleDestroy</code> ⇒ 500s during grace.</li>
<li>Order: <code>onModuleDestroy</code> → <code>beforeApplicationShutdown</code> (grace) → HTTP close → <code>onApplicationShutdown</code> (close pools here).</li>
<li>In lab-booking: <code>@Public() @SkipThrottle()</code>, quiet logs, <code>SHUTDOWN_GRACE_MS</code> from config.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>11.2 — Hai câu hỏi nền tảng container đặt cho API của bạn, và Nest làm gì giữa SIGTERM với lúc thoát</h2>
<p class="lead">Docker, Compose, Kubernetes và bộ cân bằng tải hỏi liên tục hai câu khác nhau: <em>tiến trình còn sống không?</em> (không thì khởi động lại) và <em>gửi request vào được không?</em> (không thì rút khỏi vòng). Nhập nhằng hai câu này sinh ra bão khởi động lại; trả lời sai lúc tắt thì rớt request. Lý thuyết có ở Node.js 15.6; bài này dựng cả hai endpoint bằng <code>@nestjs/terminus</code> 12.2 và đo quá trình tắt trên một ứng dụng Nest thật.</p>

<h3>Liên hệ đời thường: tấm biển ở cửa tiệm</h3>
<p>"Chủ tiệm còn thở không?" và "tiệm có mở cửa không?" là hai câu khác nhau. Nhà cung cấp giao hàng trễ thì tiệm lật biển sang <em>đóng cửa</em> — không ai gọi cấp cứu. Đến giờ đóng cửa, biển lật trước, khách đã vào thì trả tiền xong, rồi mới tắt đèn. Liveness là câu hỏi cấp cứu, readiness là tấm biển, tắt êm là giờ đóng cửa.</p>

<h3>1. Liveness và readiness với terminus</h3>
<pre><code class="language-ts">${esc(MA_B_HC)}</code></pre>
<pre><code class="language-text">${esc(OUT_SONG)}</code></pre>
<p><strong>Liveness không bao giờ chạm cơ sở dữ liệu.</strong> PostgreSQL sập mà liveness có kiểm DB thì mọi bản API bị khởi động lại liên tục — khởi động lại không chữa được DB, còn chính việc khởi động lại tạo thêm tải. Phụ thuộc thuộc về readiness.</p>
<p><strong>Bẫy 1 — <code>attempt()</code> trả gì thì phản hồi chứa nấy.</strong> Bản đầu viết <code>attempt(() =&gt; this.db.pool.query('SELECT 1'))</code>:</p>
<pre><code class="language-text">${esc(OUT_LO)}</code></pre>
<p>Nguyên object kết quả của <code>pg</code> (fields, parser, bảng kiểu) lọt ra một endpoint công khai, và terminus ghi cảnh báo deprecated rằng bản lớn sau sẽ bỏ qua nó. Đừng trả gì từ <code>attempt</code>, hoặc chọn trường bằng <code>.withSuccessData()</code>.</p>
<p><strong>Bẫy 2 — phụ thuộc treo thì readiness treo theo.</strong> Redis bị <code>docker pause</code>:</p>
<pre><code class="language-text">${esc(OUT_TREO)}</code></pre>
<p>Có <code>.withTimeout(1000)</code>: 503 sau 1074 ms. Không có (TIMEOUT=0):</p>
<pre><code class="language-text">${esc(OUT_TREO0)}</code></pre>
<p>Một lần kiểm không bao giờ trả lời còn tệ hơn 503: hạn chờ của bên điều phối quyết định thay, và các lần kiểm dồn đống. PostgreSQL dừng:</p>
<pre><code class="language-text">${esc(OUT_PG)}</code></pre>
<p>Để ý địa chỉ nội bộ trong thông báo. Chi tiết sức khoẻ chỉ dành cho mạng nội bộ; bài 11.5 cho nginx trả 404 với <code>/health/</code> từ ngoài vào.</p>

<h3>2. Chuyện gì xảy ra giữa SIGTERM và lúc thoát</h3>
<p>Đọc từ <code>nest-application-context.js</code> của Nest 12.6, <code>app.close()</code> chạy:</p>
${THU_TU_VI}
<p>Thí nghiệm (<code>b112</code>): một request <code>/cham?ms=2500</code> bắt đầu ở t = 0 và giữ một kết nối DB; SIGTERM ở t ≈ 350 ms; cứ 600 ms lại gửi mới <code>/health/ready</code> và <code>/phong</code>.</p>
<pre><code class="language-ts">${esc(MA_B_DB)}</code></pre>
<p><strong>A — không có hook tắt:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_A)}</code></pre>
<p><strong>C — có hook + <code>gracefulShutdownTimeoutMs: 1500</code>:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_C)}</code></pre>
<p><strong>D — như C, nhưng pool bị đóng ở <code>onModuleDestroy</code>:</strong></p>
<pre><code class="language-text">${esc(OUT_TAT_D)}</code></pre>
${BANG_VI}
<p>Hai bài học. Thời gian chờ của terminus chạy trong <code>beforeApplicationShutdown</code>, <em>sau</em> mọi <code>onModuleDestroy</code> — thứ gì bạn đóng ở đó đã mất trong khi ứng dụng vẫn đang phục vụ. Và thời gian chờ chỉ có ích nếu thứ đứng trước ứng dụng đọc <code>/health/ready</code> rồi thôi gửi request; bài 11.5 đo điều đó với hai bộ cân bằng tải. Ngoài container, mã thoát ở mọi cấu hình đều là 143: chạy hook xong, Nest phát lại tín hiệu (<code>useProcessExit: true</code> trong <code>enableShutdownHooks</code> thì thoát 0).</p>

<h3>3. Đưa vào lab-booking</h3>
<pre><code class="language-ts">${esc(MA_HC)}</code></pre>
<pre><code class="language-ts">${esc(MA_HM)}</code></pre>
<p>Những chi tiết đến từ test chứ không từ đọc tài liệu: <code>@Public()</code> vì guard JWT toàn cục (7.x) sẽ trả 401 cho bộ cân bằng tải; <code>@SkipThrottle()</code> vì kiểm hai lần mỗi giây là hết 100 request/phút (test của mốc đỏ 429 nếu thiếu); client Redis riêng với <code>enableOfflineQueue: false</code> để Redis chết thì hỏng ngay; <code>autoLogging.ignore</code> cho <code>/health</code> để log không ngập; <code>SHUTDOWN_GRACE_MS</code> trong schema môi trường, 0 ở dev và test.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<ol>
<li>Readiness của bạn kiểm DB, Redis và một nhà cung cấp SMS bên ngoài. Nhà cung cấp SMS sập một giờ. API của bạn ra sao, và nên đổi gì?</li>
<li>Kubernetes gửi SIGTERM và rút pod khỏi endpoint của Service <em>cùng lúc</em>, và việc rút mất vài giây mới tới mọi node. Bạn muốn cấu hình nào trong bảng, và grace bao lâu?</li>
<li>Vì sao <code>PrismaService.$disconnect()</code> nằm ở <code>onApplicationShutdown</code> chứ không ở <code>onModuleDestroy</code>?</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>Mọi bản báo chưa sẵn sàng, bộ cân bằng tải không còn backend nào, cả API sập một giờ vì một tính năng mà đa số request không dùng. Readiness chỉ nên kiểm thứ <em>mọi</em> request cần (DB, có thể Redis). Tính năng SMS thì giảm cấp (xếp hàng và thử lại — BullMQ, 9.1) hoặc báo <code>degraded</code>, trạng thái mà terminus 12 vẫn giữ HTTP 200.</li>
<li>Cấu hình C với grace dài hơn độ trễ lan truyền cộng chu kỳ kiểm — thường 5–10 giây — và <code>terminationGracePeriodSeconds</code> (hay <code>stop_grace_period</code> của Compose) dài hơn grace + request chậm nhất, không thì SIGKILL tới trước.</li>
<li>Cấu hình D đã đo: <code>onModuleDestroy</code> chạy trước thời gian chờ và trước khi server HTTP đóng, nên request vẫn đang được phục vụ nhận lỗi 500 "pool after calling end". <code>onApplicationShutdown</code> chạy sau khi server đã đóng.</li>
</ol>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Liveness khác readiness thế nào?</strong> Liveness: tiến trình còn đáng giữ không (không thì khởi động lại), không kiểm phụ thuộc. Readiness: giờ phục vụ được không (DB/Redis), dùng để điều hướng request.</li>
<li><strong><code>enableShutdownHooks()</code> làm gì?</strong> Nghe SIGTERM/SIGINT, chạy <code>app.close()</code> với các lifecycle hook theo thứ tự, rồi phát lại tín hiệu. Thiếu nó, Node chết ngay và request đang chạy bị cắt.</li>
<li><strong>Vì sao health check không được tự coi là "khoẻ" khi DB chậm?</strong> Mỗi indicator cần hạn chờ; không có thì lần kiểm treo cùng phụ thuộc.</li>
<li><strong>Đóng kết nối ở đâu?</strong> <code>onApplicationShutdown</code>, sau khi server HTTP đã dừng; worker hàng đợi xả việc ở <code>onModuleDestroy</code> (BullMQ, 9.1).</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Một ticket quen thuộc ở dự án outsourcing: "502 lác đác mỗi lần deploy". Trước khi đụng vào bộ cân bằng tải, hỏi ba câu mà giờ bạn trả lời được bằng số đo: có gọi <code>enableShutdownHooks()</code> không, CMD có phải dạng exec không (11.1), và có gì đóng pool ở <code>onModuleDestroy</code> không? Rồi tái hiện bằng một endpoint chậm và một dòng thời gian như trên — lỗi đã tái hiện kèm dòng thời gian là đường nhanh nhất để bản sửa được duyệt.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Liveness</span><span class="v">"Giữ hay khởi động lại?" — không kiểm phụ thuộc.</span></div>
  <div class="kv"><span class="k">Readiness</span><span class="v">"Gửi request hay không?" — kiểm thứ mọi request cần, mỗi thứ có hạn chờ.</span></div>
  <div class="kv"><span class="k">Tắt êm</span><span class="v">Thôi nhận việc mới, làm xong việc đang dở, rồi mới trả tài nguyên.</span></div>
  <div class="kv"><span class="k">Thời gian chờ (grace)</span><span class="v">Khoảng ứng dụng vẫn phục vụ sau SIGTERM trong khi báo chưa sẵn sàng.</span></div>
  <div class="kv"><span class="k">Bão khởi động lại</span><span class="v">Các bản bị khởi động lại liên tục vì liveness phụ thuộc thứ mà khởi động lại không chữa được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Liveness = không phụ thuộc; readiness = DB + Redis, mỗi cái <code>.withTimeout(1000)</code>; <code>attempt()</code> không trả giá trị.</li>
<li>Đo được: không hook ⇒ request đang chạy bị cắt; grace 1,5 s ⇒ vẫn phục vụ + ready 503 <code>shutting_down</code>; đóng pool ở <code>onModuleDestroy</code> ⇒ 500 trong lúc chờ.</li>
<li>Thứ tự: <code>onModuleDestroy</code> → <code>beforeApplicationShutdown</code> (chờ) → đóng HTTP → <code>onApplicationShutdown</code> (đóng pool ở đây).</li>
<li>Trong lab-booking: <code>@Public() @SkipThrottle()</code>, log yên lặng, <code>SHUTDOWN_GRACE_MS</code> từ cấu hình.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
