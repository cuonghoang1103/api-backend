/**
 * 9.4 — Lab: Duyệt lịch và email nhắc qua hàng đợi (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/bullmq 12.0.2, bullmq 6.7.8, Redis 7.4.12 nst-redis, PostgreSQL 16.16 nst-pg, Vitest 4.1.12):
 * scratchpad/nst/lab/c9/app/src/lab94 (lời giải + lab94.e2e.spec.ts: API và worker là tiến trình con thật, kill -9 thật).
 * Lần 1: 5/6 xanh — test 5 sai kỳ vọng (lịch huỷ ngay thì cả email duyệt cũng không đi — processor đúng); thử phá: bỏ khoá idempotency ⇒ test 3 đỏ.
 * Chạy: lab/c9/o9.sh 94-dat vitest.lab94.config.ts. Ghép: gen.mjs rồi ghep.sh 94 nst-9-4-lab.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MA_SQL = `CREATE TABLE lab_bookings(
  id int PRIMARY KEY, email text NOT NULL, start_at timestamptz NOT NULL,
  status varchar(10) NOT NULL DEFAULT 'PENDING');
CREATE TABLE lab_email_log(
  booking_id int NOT NULL, kind varchar(10) NOT NULL, sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (booking_id, kind));`;

const MA_KHUNG = `@Processor('thong-bao', { concurrency: 5, lockDuration: 3000, stalledInterval: 1000 })
export class ThongBaoProcessor extends WorkerHost {
  constructor(@Inject(PG) private readonly db: pg.Pool, private readonly hopThu: HopThu) { super(); }

  async process(job: Job<{ bookingId: number }>) {
    // TODO 1: đọc trạng thái lịch LÚC CHẠY — không còn APPROVED thì bỏ qua
    // TODO 2: đã có dòng lab_email_log (booking, job.name) thì bỏ qua
    // TODO 3: gửi qua hopThu.gui(to, tieuDe, khoáIdempotency) — khoá phải giống nhau ở mọi lần chạy lại
    await new Promise((ok) => setTimeout(ok, Number(process.env.SAU_GUI_MS ?? 0)));   // khe chết của test 3 — giữ nguyên
    // TODO 4: ghi lab_email_log (chạy hai lần không lỗi)
  }
}`;

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-9-1-bullmq', title: 'NestJS 9.1 — Hàng đợi với @nestjs/bullmq', sub: 'Bốn cách một lần duyệt thành hai email — lab này biến chúng thành test.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-8-3-e2e', title: 'NestJS 8.3 — Test e2e với DB thật', sub: 'Dọn dữ liệu giữa test, cấu hình giống production.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-5-worker-chet-va-van-hanh', title: 'Node.js 13.5 — Khi worker chết', sub: 'SIGKILL giữa job, job treo, deploy — đo bằng BullMQ trần.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'BullMQ docs — Stalled jobs', 'lockDuration, stalledInterval, maxStalledCount: khi nào một job bị coi là treo.', 'https://docs.bullmq.io/guide/jobs/stalled'),
  nguon('📘', 'Stripe docs — Idempotent requests', 'Khoá idempotency: cùng khoá ⇒ cùng kết quả, không làm lại tác dụng phụ.', 'https://docs.stripe.com/api/idempotent_requests'),
].join('\n');
const MA_PROC = "// thong-bao.processor.ts — LỜI GIẢI lab 9.4: email \"đã duyệt\" và email nhắc trước giờ vào lab\nimport { Inject, Logger } from '@nestjs/common';\nimport { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';\nimport type { Job } from 'bullmq';\nimport type pg from 'pg';\nimport { HopThu } from '../b91/hop-thu.js';\nimport { PG } from './db.js';\n\nexport type ThongBaoJob = { bookingId: number };\n\n@Processor('thong-bao', { concurrency: 5, lockDuration: 3000, stalledInterval: 1000 })\nexport class ThongBaoProcessor extends WorkerHost {\n  private log = new Logger('ThongBao');\n  constructor(@Inject(PG) private readonly db: pg.Pool, private readonly hopThu: HopThu) { super(); }\n\n  async process(job: Job<ThongBaoJob>) {\n    const { bookingId } = job.data;\n    // 1. Đọc trạng thái LÚC CHẠY, không tin dữ liệu lúc xếp hàng (lịch có thể đã bị huỷ)\n    const { rows: [b] } = await this.db.query('SELECT status, email FROM lab_bookings WHERE id = $1', [bookingId]);\n    if (!b || b.status !== 'APPROVED') return `bỏ qua: lịch đang ${b?.status ?? 'không tồn tại'}`;\n    // 2. Đã ghi nhận gửi rồi ⇒ không gửi lại (job chạy lần 2 sau khi lần 1 xong trọn)\n    const { rowCount } = await this.db.query('SELECT 1 FROM lab_email_log WHERE booking_id = $1 AND kind = $2', [bookingId, job.name]);\n    if (rowCount) return 'bỏ qua: đã gửi trước đó';\n    // 3. Gửi kèm khoá idempotency ⇒ chết giữa bước 3 và 4 thì lần chạy lại bị nhà cung cấp chặn trùng\n    const tieuDe = job.name === 'duyet' ? `Lịch #${bookingId} đã được duyệt` : `Nhắc: lịch #${bookingId} sắp bắt đầu`;\n    const kq = await this.hopThu.gui(b.email, tieuDe, `${job.name}:${bookingId}`);\n    await new Promise((ok) => setTimeout(ok, Number(process.env.SAU_GUI_MS ?? 0)));   // khe chết thử nghiệm\n    // 4. Ghi nhận; ràng buộc UNIQUE chặn hai worker cùng ghi\n    await this.db.query('INSERT INTO lab_email_log(booking_id, kind) VALUES ($1, $2) ON CONFLICT DO NOTHING', [bookingId, job.name]);\n    this.log.log(`job ${job.id} (lần chạy ${job.attemptsStarted}): ${kq}`);\n    return kq;\n  }\n\n  @OnWorkerEvent('failed')\n  onFailed(job: Job, err: Error) { this.log.warn(`job ${job.id} hỏng lần ${job.attemptsMade}/${job.opts.attempts}: ${err.message}`); }\n}";
const MA_CTRL = "import { Controller, Delete, HttpCode, Inject, NotFoundException, Param, ParseIntPipe, Patch } from '@nestjs/common';\nimport { InjectQueue } from '@nestjs/bullmq';\nimport type { Queue } from 'bullmq';\nimport type pg from 'pg';\nimport { PG } from './db.js';\nimport type { ThongBaoJob } from './thong-bao.processor.js';\n\nconst NHAC_TRUOC_MS = Number(process.env.NHAC_TRUOC_MS ?? 30 * 60_000);   // nhắc trước 30 phút\n\n@Controller('bookings')\nexport class BookingsController {\n  constructor(@Inject(PG) private readonly db: pg.Pool, @InjectQueue('thong-bao') private readonly q: Queue<ThongBaoJob>) {}\n\n  @Patch(':id/approve')\n  async approve(@Param('id', ParseIntPipe) id: number) {\n    const { rows: [b] } = await this.db.query(\n      `UPDATE lab_bookings SET status = 'APPROVED' WHERE id = $1 AND status IN ('PENDING', 'APPROVED') RETURNING start_at`, [id]);\n    if (!b) throw new NotFoundException();\n    // Sau khi UPDATE đã commit (câu lệnh đơn tự commit) mới xếp hàng — không bao giờ ngược lại\n    await this.q.add('duyet', { bookingId: id }, { jobId: `duyet-${id}` });\n    const delay = new Date(b.start_at).getTime() - NHAC_TRUOC_MS - Date.now();\n    if (delay > 0) await this.q.add('nhac', { bookingId: id }, { jobId: `nhac-${id}`, delay });\n    return { id, status: 'APPROVED', nhacSauMs: Math.max(delay, 0) };\n  }\n\n  @Delete(':id') @HttpCode(200)\n  async cancel(@Param('id', ParseIntPipe) id: number) {\n    await this.db.query(`UPDATE lab_bookings SET status = 'CANCELLED' WHERE id = $1`, [id]);\n    const daGo = await this.q.remove(`nhac-${id}`);     // 1 = gỡ được; 0 = đã chạy/đang chạy ⇒ processor tự bỏ qua ở bước 1\n    return { id, status: 'CANCELLED', goNhac: daGo };\n  }\n}";
const MA_MOD = "import { Module } from '@nestjs/common';\nimport { BullModule } from '@nestjs/bullmq';\nimport { BookingsController } from './bookings.controller.js';\nimport { ThongBaoProcessor } from './thong-bao.processor.js';\nimport { HopThu } from '../b91/hop-thu.js';\nimport { DbModule } from './db.js';\n\nconst VAI = process.env.VAI ?? 'all';\n\n@Module({\n  imports: [\n    DbModule,\n    BullModule.forRoot({ connection: { url: process.env.REDIS_URL } }),\n    BullModule.registerQueue({\n      name: 'thong-bao',\n      defaultJobOptions: {\n        attempts: 5, backoff: { type: 'exponential', delay: 300 },\n        removeOnComplete: { age: 7 * 24 * 3600 },     // giữ 7 ngày ⇒ jobId còn chặn bấm lại trong 7 ngày\n        removeOnFail: { age: 30 * 24 * 3600 },\n      },\n    }),\n  ],\n  controllers: VAI === 'worker' ? [] : [BookingsController],\n  providers: VAI === 'api' ? [] : [ThongBaoProcessor, HopThu],\n})\nexport class Lab94Module {}";
const MA_DB = "import { Global, Module, OnApplicationShutdown, Inject } from '@nestjs/common';\nimport pg from 'pg';\n\nexport const PG = Symbol('PG');\n\n@Global()\n@Module({ providers: [{ provide: PG, useFactory: () => new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 }) }], exports: [PG] })\nexport class DbModule implements OnApplicationShutdown {\n  constructor(@Inject(PG) private readonly pool: pg.Pool) {}\n  onApplicationShutdown() { return this.pool.end(); }       // pha cuối: sau khi worker đã chờ job xong (bài 9.1)\n}";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport { Lab94Module } from './app.module.js';\n\nconst worker = process.env.VAI === 'worker';\nconst app = worker ? await NestFactory.createApplicationContext(Lab94Module, { logger: ['log', 'warn', 'error'] })\n                   : await NestFactory.create(Lab94Module, { logger: ['log', 'warn', 'error'] });\napp.enableShutdownHooks();\nif (!worker) await (app as any).listen(Number(process.env.PORT ?? 41941), '127.0.0.1');\nconsole.log(`pid ${process.pid} sẵn sàng (${process.env.VAI ?? 'all'})`);";
const MA_TEST = "// lab94.e2e.spec.ts — tiêu chí \"Đạt\" của lab 9.4, chạy trên Redis + PostgreSQL thật, API và worker là TIẾN TRÌNH riêng\nimport { spawn, type ChildProcess } from 'node:child_process';\nimport { Redis } from 'ioredis';\nimport pg from 'pg';\n\nconst API = 'http://127.0.0.1:41941';\nconst r = new Redis(process.env.REDIS_URL!);\nconst db = new pg.Pool({ connectionString: process.env.DATABASE_URL });\nconst tienTrinh: ChildProcess[] = [];\nconst ngu = (ms: number) => new Promise((ok) => setTimeout(ok, ms));\n\nfunction bat(vai: 'api' | 'worker', env: Record<string, string> = {}) {\n  const p = spawn('node', ['dist/lab94/main.js'], { env: { ...process.env, VAI: vai, NHAC_TRUOC_MS: '1000', ...env }, stdio: ['ignore', 'pipe', 'inherit'] });\n  tienTrinh.push(p);\n  return new Promise<ChildProcess>((ok) => p.stdout!.on('data', (d) => String(d).includes('sẵn sàng') && ok(p)));\n}\nconst hopThu = () => r.lrange('nst:hopthu', 0, -1);\nconst goi = (m: string, url: string) => fetch(API + url, { method: m }).then((x) => x.json());\n\nbeforeEach(async () => {\n  await r.flushall();\n  await db.query(`TRUNCATE lab_bookings, lab_email_log; INSERT INTO lab_bookings(id, email, start_at)\n    SELECT i, 'sv' || i || '@fpt.edu.vn', now() + interval '1 hour' FROM generate_series(1, 9) i`);\n  await bat('api');\n});\nafterEach(async () => { tienTrinh.splice(0).forEach((p) => p.kill('SIGKILL')); await ngu(200); });\nafterAll(async () => { await r.quit(); await db.end(); });\n\nit('1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi', async () => {\n  await bat('worker', { MAIL_MS: '500' });\n  const t0 = Date.now();\n  expect(await goi('PATCH', '/bookings/1/approve')).toMatchObject({ status: 'APPROVED' });\n  expect(Date.now() - t0).toBeLessThan(200);\n  await ngu(900);\n  expect(await hopThu()).toEqual(['sv1@fpt.edu.vn | Lịch #1 đã được duyệt']);\n});\n\nit('2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email', async () => {\n  await bat('worker');\n  await Promise.all([goi('PATCH', '/bookings/2/approve'), goi('PATCH', '/bookings/2/approve')]);\n  await ngu(500);\n  await goi('PATCH', '/bookings/2/approve');\n  await ngu(500);\n  expect(await hopThu()).toHaveLength(1);\n});\n\nit('3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng', async () => {\n  const w = await bat('worker', { SAU_GUI_MS: '5000' });\n  await goi('PATCH', '/bookings/3/approve');\n  await ngu(600);\n  expect(await hopThu()).toHaveLength(1);                        // thư đã đi\n  w.kill('SIGKILL');                                             // chết trong \"khe\"\n  await bat('worker');\n  await ngu(4500);                                               // lockDuration 3 s + kiểm treo mỗi 1 s\n  const job = await r.hmget('bull:thong-bao:duyet-3', 'ats', 'finishedOn');\n  expect(Number(job[0])).toBe(2);                                // job ĐÃ chạy hai lần…\n  expect(job[1]).not.toBeNull();\n  expect(await hopThu()).toHaveLength(1);                        // …mà người dùng chỉ nhận một thư\n  expect((await db.query('SELECT * FROM lab_email_log WHERE booking_id = 3')).rowCount).toBe(1);\n});\n\nit('4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email', async () => {\n  await bat('worker', { FAIL: '2' });\n  await goi('PATCH', '/bookings/4/approve');\n  await ngu(1800);                                               // 300 + 600 ms backoff\n  expect(await hopThu()).toHaveLength(1);\n  expect(await r.hget('bull:thong-bao:duyet-4', 'atm')).toBe('3');\n});\n\nit('5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc', async () => {\n  await bat('worker');                                           // bật worker TRƯỚC khi đặt giờ: khởi động mất ~1 s\n  await db.query(`UPDATE lab_bookings SET start_at = now() + interval '2 seconds' WHERE id IN (5, 6)`);\n  expect((await goi('PATCH', '/bookings/5/approve')).nhacSauMs).toBeGreaterThan(500);\n  await goi('PATCH', '/bookings/6/approve');\n  expect(await goi('DELETE', '/bookings/6')).toMatchObject({ goNhac: 1 });\n  await ngu(1700);\n  // lịch 6 bị huỷ ngay sau khi duyệt ⇒ lúc job 'duyet' chạy, bước 1 thấy CANCELLED ⇒ cả email duyệt cũng không đi\n  expect((await hopThu()).sort()).toEqual(['sv5@fpt.edu.vn | Lịch #5 đã được duyệt', 'sv5@fpt.edu.vn | Nhắc: lịch #5 sắp bắt đầu']);\n});\n\nit('6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi', async () => {\n  await goi('PATCH', '/bookings/7/approve');\n  await ngu(500);\n  expect(await r.llen('bull:thong-bao:wait')).toBe(1);\n  expect(await hopThu()).toHaveLength(0);\n  await bat('worker');\n  await ngu(500);\n  expect(await hopThu()).toHaveLength(1);\n});";
const OUT_LAN1 = " RUN  v4.1.12 /home/sv/app\n ✓ src/lab94/lab94.e2e.spec.ts > 1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi 2280ms\n ✓ src/lab94/lab94.e2e.spec.ts > 2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email 2259ms\n ✓ src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng 6853ms\n ✓ src/lab94/lab94.e2e.spec.ts > 4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email 3104ms\n × src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc 2934ms\n   → expected [ …(2) ] to deeply equal [ …(3) ]\n ✓ src/lab94/lab94.e2e.spec.ts > 6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi 2267ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc\nAssertionError: expected [ …(2) ] to deeply equal [ …(3) ]\n- Expected\n+ Received\n  [\n    \"sv5@fpt.edu.vn | Lịch #5 đã được duyệt\",\n    \"sv5@fpt.edu.vn | Nhắc: lịch #5 sắp bắt đầu\",\n-   \"sv6@fpt.edu.vn | Lịch #6 đã được duyệt\",\n  ]\n ❯ src/lab94/lab94.e2e.spec.ts:77:35\n       |                                   ^\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n Test Files  1 failed (1)\n      Tests  1 failed | 5 passed (6)\n   Start at  08:51:45\n   Duration  20.01s (transform 28ms, setup 0ms, import 105ms, tests 19.70s, environment 0ms)";
const OUT_DAT = " RUN  v4.1.12 /home/sv/app\n ✓ src/lab94/lab94.e2e.spec.ts > 1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi 2363ms\n ✓ src/lab94/lab94.e2e.spec.ts > 2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email 2409ms\n ✓ src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng 6747ms\n ✓ src/lab94/lab94.e2e.spec.ts > 4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email 2936ms\n ✓ src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc 2804ms\n ✓ src/lab94/lab94.e2e.spec.ts > 6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi 2118ms\n Test Files  1 passed (1)\n      Tests  6 passed (6)\n   Start at  09:15:59\n   Duration  19.69s (transform 31ms, setup 0ms, import 104ms, tests 19.38s, environment 0ms)";
const OUT_PHA = " RUN  v4.1.12 /home/sv/app\n ✓ src/lab94/lab94.e2e.spec.ts > 1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi 2152ms\n ✓ src/lab94/lab94.e2e.spec.ts > 2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email 2147ms\n × src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng 6809ms\n   → expected [ …(2) ] to have a length of 1 but got 2\n ✓ src/lab94/lab94.e2e.spec.ts > 4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email 3032ms\n ✓ src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc 3074ms\n ✓ src/lab94/lab94.e2e.spec.ts > 6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi 2359ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng\nAssertionError: expected [ …(2) ] to have a length of 1 but got 2\n- Expected\n+ Received\n- 1\n+ 2\n ❯ src/lab94/lab94.e2e.spec.ts:58:26\n       |                          ^\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n Test Files  1 failed (1)\n      Tests  1 failed | 5 passed (6)\n   Start at  09:16:19\n   Duration  19.82s (transform 23ms, setup 0ms, import 79ms, tests 19.58s, environment 0ms)";
const OUT_PHA1 = " ✓ src/lab94/lab94.e2e.spec.ts > 1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi 2584ms\n ✓ src/lab94/lab94.e2e.spec.ts > 2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email 2589ms\n ✓ src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng 7252ms\n ✓ src/lab94/lab94.e2e.spec.ts > 4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email 3378ms\n × src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc 3252ms\n ✓ src/lab94/lab94.e2e.spec.ts > 6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi 2447ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 5 passed (6)";
const OUT_PHAID = " ✓ src/lab94/lab94.e2e.spec.ts > 1. duyệt ⇒ đúng 1 email, API trả về trước khi email đi 2228ms\n ✓ src/lab94/lab94.e2e.spec.ts > 2. bấm duyệt 3 lần (kể cả sau khi job đã xong) ⇒ vẫn 1 email 2258ms\n × src/lab94/lab94.e2e.spec.ts > 3. worker bị kill -9 SAU khi gửi, TRƯỚC khi ghi nhận ⇒ worker mới chạy lại job nhưng không gửi trùng 6712ms\n   → expected +0 to be 2 // Object.is equality\n × src/lab94/lab94.e2e.spec.ts > 4. SMTP lỗi 2 lần ⇒ thử lại, lần 3 gửi được, vẫn 1 email 3075ms\n   → expected null to be '3' // Object.is equality\n ✓ src/lab94/lab94.e2e.spec.ts > 5. email nhắc đến đúng hẹn; huỷ lịch trước giờ nhắc ⇒ không nhắc 2955ms\n ✓ src/lab94/lab94.e2e.spec.ts > 6. API chạy một mình (không worker) ⇒ job nằm chờ, không mất; bật worker ⇒ gửi 2150ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  2 failed | 4 passed (6)";

export default {
  title: '9.4 — Lab: Booking approval and reminder emails through a queue|||9.4 — Lab: Duyệt lịch và email nhắc qua hàng đợi',
  slug: 'nst-9-4-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chạy trên Redis và PostgreSQL thật: duyệt lịch ⇒ email "đã duyệt" qua hàng đợi, email nhắc hẹn giờ trước buổi lab, huỷ lịch ⇒ gỡ nhắc. Đạt khi sáu test e2e xanh, trong đó API và worker là hai tiến trình thật và worker bị kill -9 giữa lúc gửi xong và lúc ghi nhận — người dùng vẫn chỉ nhận một email. Kèm thử phá ba lần: bỏ khoá idempotency ⇒ test 3 đỏ, bỏ kiểm trạng thái ⇒ test 5 đỏ, bỏ jobId ⇒ test bấm ba lần vẫn xanh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab</span>
<h2>9.4 — Lab: approval and reminder emails that survive a dead worker</h2>
<p class="lead">You build the notification part of the booking system: approving a booking enqueues an "approved" email and a reminder 30 minutes before the start; cancelling removes the reminder. The pass criterion is the hard case from 9.1: a worker killed with <code>kill -9</code> right after the email left must not cause a second email. Tests start the API and the worker as real child processes and kill them for real.</p>

<h3>Goal and pass criteria</h3>
<ol>
<li>Approve ⇒ exactly one email; the API answers before the email is sent.</li>
<li>Approve three times (two at once, one after the job finished) ⇒ one email.</li>
<li>Worker killed after sending, before recording ⇒ the job runs again, still one email, one row in <code>lab_email_log</code>.</li>
<li>SMTP fails twice ⇒ retried, sent on attempt 3, one email.</li>
<li>The reminder arrives on time; cancelling before it ⇒ no reminder.</li>
<li>API without a worker ⇒ the job waits; starting a worker sends it.</li>
</ol>

<h3>Setup</h3>
<pre><code class="language-bash">docker run -d --rm --name nst-redis -p 127.0.0.1:41901:6379 redis:7-alpine
docker run -d --rm --name nst-pg -e POSTGRES_USER=nst -e POSTGRES_PASSWORD=nst -e POSTGRES_DB=lab \\
  -p 127.0.0.1:41601:5432 --tmpfs /var/lib/postgresql/data postgres:16
npm i @nestjs/bullmq bullmq pg ioredis</code></pre>
<pre><code class="language-sql">${esc(MA_SQL)}</code></pre>
<p>Reuse <code>HopThu</code> from 9.1 (fake provider with an idempotency key). The API side and the module are given:</p>
<pre><code class="language-ts">${esc(MA_DB)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>

<h3>Step 1 — the tests (read them before writing code)</h3>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<p>Test 3 is the point of the lab: <code>SAU_GUI_MS=5000</code> opens a 5-second window after the send; the test kills the worker inside it and starts a new one. <code>lockDuration</code> 3 s and <code>stalledInterval</code> 1 s make the stalled job come back within ~4 s instead of the default 30 s.</p>

<h3>Step 2 — write the processor</h3>
<pre><code class="language-ts">${esc(MA_KHUNG)}</code></pre>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_PROC)}</code></pre>
<p>Why each step exists: step 1 handles "cancelled after enqueue"; step 2 handles a job re-run after it fully finished; step 3's key handles a crash between sending and recording (only the provider can know it already sent); step 4's primary key handles two workers recording at once. No single step covers all four.</p>
</details>

<h3>Step 3 — run</h3>
<p>The author's first run:</p>
<div class="out">${esc(OUT_LAN1)}</div>
<p>The code was right and the test was wrong. Booking 6 was cancelled a few milliseconds after approval, before the worker took the "approved" job — so step 1 saw CANCELLED and skipped the approval email too. That is the desired behaviour (do not tell a student "approved" about a booking that is already cancelled), so the expectation was fixed, with a comment:</p>
<div class="out">${esc(OUT_DAT)}</div>
<p>Six green in ~20 s — real processes, real timeouts. Keep such tests in the <code>db</code> project from 8.6, not in the unit loop.</p>

<h3>Break it on purpose</h3>
<p>A test that passes for the wrong reason is worse than no test. Remove only the idempotency key from step 3 (in the compiled <code>dist</code>) and run test 3 again:</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>Red at exactly the right test: two emails. Remove step 1 instead (the status check):</p>
<div class="out">${esc(OUT_PHA1)}</div>
<p>Only test 5 — the reminder for the cancelled booking went out. Now remove the <code>jobId</code> from the controller:</p>
<div class="out">${esc(OUT_PHAID)}</div>
<p>Test 2 (triple click) is <strong>still green</strong>: three jobs were created, but the idempotency key and the log table stopped the duplicates — defence in depth working. Tests 3 and 4 fail only because they read the job by its id <code>duyet-N</code>. So the <code>jobId</code> is an optimisation (fewer jobs, less work), the handler's idempotency is the guarantee.</p>
<p>Two traps the author hit while doing this. (1) "Restore by rebuilding" did not restore: with <code>"incremental": true</code>, <code>tsc</code> skips emitting when the sources have not changed, so the hand-edited <code>dist</code> stayed broken and the mutations piled up. Delete <code>dist</code> and <code>*.tsbuildinfo</code> between mutations. (2) Test 5 was flaky: the start time was set <em>before</em> the worker process booted (~1 s), so the reminder delay was sometimes under 500 ms. The fix — start the worker first — is in the test above.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you test that a job is idempotent under a crash?</strong> Run the worker as a separate process, open a window after the side effect, <code>SIGKILL</code> it there, start another, assert the side effect happened once.</li>
<li><strong>Why read the booking status in the worker instead of putting it in the job data?</strong> The job may run minutes or days later; the source of truth is the database at run time.</li>
<li><strong>What does <code>queue.remove(jobId)</code> return when the reminder already ran or is running?</strong> 0 — it cannot remove an active or finished job; that is why the processor checks the status again.</li>
<li><strong>Why is the idempotency key needed when there is already a log table?</strong> The crash can happen between sending and writing the log; only the provider has seen the send.</li>
<li><strong>Why close the pg pool in onApplicationShutdown?</strong> Workers wait for active jobs in onModuleDestroy; closing the pool in the same phase breaks the job (9.1).</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Delayed job</span><span class="v">add(…, { delay }) — runs no earlier than now + delay.</span></div>
  <div class="kv"><span class="k">queue.remove(id)</span><span class="v">Removes a waiting/delayed job; 0 if it is active or gone.</span></div>
  <div class="kv"><span class="k">Idempotency key</span><span class="v">Same key ⇒ the provider performs the effect once.</span></div>
  <div class="kv"><span class="k">Crash window</span><span class="v">Time between a side effect and recording it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four protections, four failure cases: status at run time, log table, idempotency key, unique constraint.</li>
<li>Test crashes with real processes and real <code>SIGKILL</code>; shorten <code>lockDuration</code> for the test.</li>
<li>A red first run can mean a wrong test; decide from the requirement, then write the reason next to the expectation.</li>
<li>Break the code on purpose to prove each test catches what it claims — and clean <code>dist</code> between breaks.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab</span>
<h2>9.4 — Lab: email duyệt và email nhắc sống sót qua một worker đã chết</h2>
<p class="lead">Bạn dựng phần thông báo của hệ thống đặt lịch: duyệt lịch thì xếp hàng một email "đã duyệt" và một email nhắc 30 phút trước giờ bắt đầu; huỷ lịch thì gỡ email nhắc. Tiêu chí đạt là ca khó ở 9.1: worker bị <code>kill -9</code> ngay sau khi email đã đi thì không được sinh email thứ hai. Test khởi động API và worker thành hai tiến trình con thật, và giết chúng thật.</p>

<h3>Mục tiêu và tiêu chí đạt</h3>
<ol>
<li>Duyệt ⇒ đúng một email; API trả lời trước khi email được gửi.</li>
<li>Duyệt ba lần (hai lần cùng lúc, một lần sau khi job đã xong) ⇒ một email.</li>
<li>Worker bị giết sau khi gửi, trước khi ghi nhận ⇒ job chạy lại, vẫn một email, một dòng trong <code>lab_email_log</code>.</li>
<li>SMTP lỗi hai lần ⇒ thử lại, lần 3 gửi được, một email.</li>
<li>Email nhắc đến đúng hẹn; huỷ trước giờ nhắc ⇒ không nhắc.</li>
<li>API chạy không có worker ⇒ job nằm chờ; bật worker ⇒ gửi.</li>
</ol>

<h3>Chuẩn bị</h3>
<pre><code class="language-bash">docker run -d --rm --name nst-redis -p 127.0.0.1:41901:6379 redis:7-alpine
docker run -d --rm --name nst-pg -e POSTGRES_USER=nst -e POSTGRES_PASSWORD=nst -e POSTGRES_DB=lab \\
  -p 127.0.0.1:41601:5432 --tmpfs /var/lib/postgresql/data postgres:16
npm i @nestjs/bullmq bullmq pg ioredis</code></pre>
<pre><code class="language-sql">${esc(MA_SQL)}</code></pre>
<p>Dùng lại <code>HopThu</code> của 9.1 (nhà cung cấp giả có khoá idempotency). Phía API và module được cho sẵn:</p>
<pre><code class="language-ts">${esc(MA_DB)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>

<h3>Bước 1 — bộ test (đọc trước khi viết mã)</h3>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<p>Test 3 là trọng tâm của lab: <code>SAU_GUI_MS=5000</code> mở một khe 5 giây sau khi gửi; test giết worker trong khe đó và bật worker mới. <code>lockDuration</code> 3 giây và <code>stalledInterval</code> 1 giây làm job treo quay lại trong khoảng 4 giây thay vì 30 giây mặc định.</p>

<h3>Bước 2 — viết processor</h3>
<pre><code class="language-ts">${esc(MA_KHUNG)}</code></pre>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_PROC)}</code></pre>
<p>Vì sao cần từng bước: bước 1 lo ca "bị huỷ sau khi đã xếp hàng"; bước 2 lo ca job chạy lại sau khi đã xong trọn; khoá ở bước 3 lo ca sập giữa lúc gửi và lúc ghi nhận (chỉ nhà cung cấp biết mình đã gửi); khoá chính ở bước 4 lo ca hai worker cùng ghi. Không bước nào một mình phủ được cả bốn.</p>
</details>

<h3>Bước 3 — chạy</h3>
<p>Lần chạy đầu của người soạn:</p>
<div class="out">${esc(OUT_LAN1)}</div>
<p>Mã đúng, test sai. Lịch 6 bị huỷ vài mili giây sau khi duyệt, trước khi worker lấy job "duyet" — nên bước 1 thấy CANCELLED và bỏ qua luôn email duyệt. Đó đúng là hành vi mong muốn (không báo "đã duyệt" cho một lịch đã bị huỷ), nên kỳ vọng được sửa, kèm chú thích:</p>
<div class="out">${esc(OUT_DAT)}</div>
<p>Sáu test xanh trong khoảng 20 giây — tiến trình thật, chờ thật. Để những test như vậy ở project <code>db</code> của 8.6, không để trong vòng chạy test đơn vị.</p>

<h3>Thử phá</h3>
<p>Một test xanh vì lý do sai còn tệ hơn không có test. Chỉ bỏ khoá idempotency ở bước 3 (trong <code>dist</code> đã biên dịch) rồi chạy lại test 3:</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>Đỏ đúng test cần đỏ: hai email. Giờ thay vào đó bỏ bước 1 (kiểm trạng thái):</p>
<div class="out">${esc(OUT_PHA1)}</div>
<p>Chỉ test 5 — email nhắc của lịch đã huỷ vẫn đi. Tiếp theo bỏ <code>jobId</code> ở controller:</p>
<div class="out">${esc(OUT_PHAID)}</div>
<p>Test 2 (bấm ba lần) <strong>vẫn xanh</strong>: ba job được tạo, nhưng khoá idempotency và bảng ghi nhận chặn được thư trùng — phòng thủ nhiều lớp đang làm việc. Test 3 và 4 đỏ chỉ vì chúng đọc job theo id <code>duyet-N</code>. Vậy <code>jobId</code> là tối ưu (ít job, ít việc), còn tính idempotent của hàm xử lý mới là bảo đảm.</p>
<p>Hai cái bẫy người soạn vấp khi làm phần này. (1) "Biên dịch lại để trả về như cũ" không trả về gì: với <code>"incremental": true</code>, <code>tsc</code> bỏ qua bước ghi tệp khi mã nguồn không đổi, nên <code>dist</code> đã sửa tay vẫn hỏng và các lần phá dồn lên nhau. Xoá <code>dist</code> và <code>*.tsbuildinfo</code> giữa các lần phá. (2) Test 5 chập chờn: giờ bắt đầu được đặt <em>trước</em> khi tiến trình worker khởi động xong (~1 giây), nên độ trễ nhắc có lúc dưới 500 ms. Cách sửa — bật worker trước — đã có trong bộ test ở trên.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test một job idempotent khi bị sập thế nào?</strong> Chạy worker ở tiến trình riêng, mở một khe sau tác dụng phụ, <code>SIGKILL</code> nó trong khe, bật worker khác, khẳng định tác dụng phụ chỉ xảy ra một lần.</li>
<li><strong>Sao worker đọc trạng thái lịch thay vì để sẵn trong dữ liệu job?</strong> Job có thể chạy sau vài phút, vài ngày; nguồn sự thật là DB ở thời điểm chạy.</li>
<li><strong><code>queue.remove(jobId)</code> trả gì khi email nhắc đã chạy hoặc đang chạy?</strong> 0 — không gỡ được job đang chạy hay đã xong; vì vậy processor kiểm trạng thái lần nữa.</li>
<li><strong>Đã có bảng ghi nhận rồi, cần khoá idempotency làm gì?</strong> Sập có thể xảy ra giữa lúc gửi và lúc ghi bảng; chỉ nhà cung cấp đã thấy lần gửi đó.</li>
<li><strong>Sao đóng pool pg ở onApplicationShutdown?</strong> Worker chờ job đang chạy ở onModuleDestroy; đóng pool cùng pha đó làm hỏng job (9.1).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job hẹn giờ (delayed)</span><span class="v">add(…, { delay }) — chạy không sớm hơn bây giờ + delay.</span></div>
  <div class="kv"><span class="k">queue.remove(id)</span><span class="v">Gỡ job đang chờ/hẹn giờ; trả 0 nếu job đang chạy hoặc không còn.</span></div>
  <div class="kv"><span class="k">Khoá idempotency</span><span class="v">Cùng khoá ⇒ nhà cung cấp chỉ thực hiện một lần.</span></div>
  <div class="kv"><span class="k">Khe sập</span><span class="v">Khoảng giữa lúc gây tác dụng phụ và lúc ghi nhận nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn lớp bảo vệ, bốn ca hỏng: trạng thái lúc chạy, bảng ghi nhận, khoá idempotency, ràng buộc UNIQUE.</li>
<li>Test sập bằng tiến trình thật và <code>SIGKILL</code> thật; rút ngắn <code>lockDuration</code> cho test.</li>
<li>Lần đầu đỏ có thể là test sai; quyết theo yêu cầu, rồi ghi lý do ngay cạnh kỳ vọng.</li>
<li>Cố tình phá mã để chứng minh từng test bắt đúng thứ nó tuyên bố — và dọn <code>dist</code> giữa các lần phá.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
