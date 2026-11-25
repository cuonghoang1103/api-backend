/**
 * 9.1 — Hàng đợi với @nestjs/bullmq: producer, processor, thử lại và idempotency (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/bullmq 12.0.2, bullmq 6.7.8, Redis 7.4.12 container nst-redis 127.0.0.1:41901):
 * scratchpad/nst/lab/c9/app/src/b91 + b91.sh (co-ban, tach, khong-thu-lai, thu-lai, bam-hai-lan, bam-sau, giet-9, sigterm) ⇒ lab/c9/o/91-*.txt;
 * bài tập bt.spec.ts (Vitest 4.1.12; lần 1 đỏ vì beforeEach trả về hàm mock — giữ làm bẫy). Ghép: web-tool/c9/gen.mjs rồi ghep.sh 91 nst-9-1-bullmq.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-2-bullmq-co-ban', title: 'Node.js 13.2 — BullMQ: Queue, Worker, một job trong Redis', sub: 'Mở hộp Redis xem một job là gì, giá mỗi job, concurrency — bài này không giảng lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-3-thu-lai-va-idempotent', title: 'Node.js 13.3 — Thử lại, backoff, idempotent', sub: 'Ba cách làm hàm xử lý idempotent, đống job chết — nền của mục 3–4.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-5-worker-chet-va-van-hanh', title: 'Node.js 13.5 — Khi worker chết', sub: 'Job treo (stalled), deploy, dọn Redis — đo bằng BullMQ trần.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-4-scope-lifecycle', title: 'NestJS 2.4 — Scope và lifecycle hook', sub: 'Thứ tự onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown — mục 5 dựa vào đó.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Queues', 'BullModule.forRoot/registerQueue, @Processor, WorkerHost, @OnWorkerEvent, xử lý ở tiến trình riêng.', 'https://docs.nestjs.com/techniques/queues'),
  nguon('📘', 'BullMQ docs — Retrying failing jobs, Deduplication, Stalled jobs', 'attempts/backoff, jobId, removeOnComplete, lockDuration, stalledInterval.', 'https://docs.bullmq.io/guide/retrying-failing-jobs'),
  nguon('📰', 'BleepingComputer (18/06/2021) — HBO Max emailed a mysterious integration test to all subscribers', 'Một job email thử nghiệm chạy trên danh sách thật; HBO Max xin lỗi: "yes, it was the intern".', 'https://www.bleepingcomputer.com/news/technology/hbo-max-emailed-a-mysterious-integration-test-to-all-subscribers/'),
].join('\n');
const MA_HOPTHU = "// hop-thu.ts — \"nhà cung cấp email\" giả: thư gửi đi được ghi vào Redis (list nst:hopthu) nên vẫn còn khi tiến trình bị giết.\n// Giống nhà cung cấp thật ở chỗ: gửi rồi là không rút lại được; có (tuỳ chọn) khoá idempotency như Resend/Stripe.\nimport { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';\nimport { Redis } from 'ioredis';\n\n@Injectable()\nexport class HopThu implements OnModuleDestroy, OnApplicationShutdown {\n  private r = new Redis(process.env.REDIS_URL!);\n  private loiConLai = Number(process.env.FAIL ?? 0);          // FAIL=2 ⇒ hai lần gọi đầu ném lỗi (SMTP 421)\n\n  async gui(to: string, subject: string, idemKey?: string) {\n    await new Promise((ok) => setTimeout(ok, Number(process.env.MAIL_MS ?? 100)));\n    if (this.loiConLai > 0) { this.loiConLai--; throw new Error('421 SMTP tạm thời từ chối'); }\n    if (idemKey && !(await this.r.set(`nst:idem:${idemKey}`, '1', 'EX', 86400, 'NX'))) return 'trùng khoá — bỏ qua';\n    await this.r.rpush('nst:hopthu', `${to} | ${subject}`);\n    return 'đã gửi';\n  }\n  // Bản đầu: đóng ở onModuleDestroy — CÙNG pha với worker.close() của @nestjs/bullmq ⇒ job đang chạy mất kết nối.\n  async onModuleDestroy() { if (!process.env.DONG_MUON) await this.r.quit(); }\n  // Bản sửa: đóng ở onApplicationShutdown — pha thứ ba, sau khi mọi worker đã chờ job xong.\n  async onApplicationShutdown() { if (process.env.DONG_MUON) await this.r.quit(); }\n}";
const MA_PROC = "import { Logger } from '@nestjs/common';\nimport { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';\nimport type { Job } from 'bullmq';\nimport { HopThu } from './hop-thu.js';\n\nexport type DuyetJob = { bookingId: number; to: string };\n\n@Processor('email', { concurrency: 5, lockDuration: 3000, stalledInterval: 1000 })   // hai số cuối nhỏ để thí nghiệm nhanh\nexport class EmailProcessor extends WorkerHost {\n  private log = new Logger('EmailProcessor');\n  constructor(private readonly hopThu: HopThu) { super(); }                         // DI như mọi provider\n\n  async process(job: Job<DuyetJob>) {\n    switch (job.name) {\n      case 'booking-approved': {\n        const key = process.env.IDEM ? `approved:${job.data.bookingId}` : undefined;\n        const kq = await this.hopThu.gui(job.data.to, `Lịch #${job.data.bookingId} đã được duyệt`, key);\n        this.log.log(`job ${job.id} lần ${job.attemptsMade + 1}: ${kq}`);\n        await new Promise((ok) => setTimeout(ok, Number(process.env.SAU_GUI_MS ?? 0)));   // việc sau khi gửi (ghi DB…)\n        return kq;\n      }\n      default: throw new Error(`job lạ: ${job.name}`);\n    }\n  }\n\n  @OnWorkerEvent('failed')\n  onFailed(job: Job, err: Error) { this.log.warn(`job ${job.id} hỏng lần ${job.attemptsMade}: ${err.message}`); }\n}";
const MA_CTRL = "import { Controller, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';\nimport { InjectQueue } from '@nestjs/bullmq';\nimport type { Queue } from 'bullmq';\nimport type { DuyetJob } from './email.processor.js';\n\n@Controller('bookings')\nexport class BookingsController {\n  constructor(@InjectQueue('email') private readonly email: Queue<DuyetJob>) {}\n\n  @Post(':id/approve') @HttpCode(202)\n  async approve(@Param('id', ParseIntPipe) id: number) {\n    // … cập nhật DB (bài 9.5) …\n    const job = await this.email.add('booking-approved', { bookingId: id, to: `sv${id}@fpt.edu.vn` },\n      process.env.JOB_ID ? { jobId: `approved-${id}` } : {});\n    return { status: 'APPROVED', emailJob: job.id };\n  }\n}";
const MA_MOD = "import { Module } from '@nestjs/common';\nimport { BullModule } from '@nestjs/bullmq';\nimport { BookingsController } from './bookings.controller.js';\nimport { EmailProcessor } from './email.processor.js';\nimport { HopThu } from './hop-thu.js';\n\nconst VAI = process.env.VAI ?? 'all';                       // all | api | worker\n\n@Module({\n  imports: [\n    BullModule.forRoot({ connection: { url: process.env.REDIS_URL } }),\n    BullModule.registerQueue({\n      name: 'email',\n      defaultJobOptions: {\n        ...(process.env.ATTEMPTS && { attempts: Number(process.env.ATTEMPTS), backoff: { type: 'exponential', delay: 500 } }),\n        ...(process.env.RM && { removeOnComplete: true }),     // dọn job xong ngay — thường thấy trong dự án thật\n      },\n    }),\n  ],\n  controllers: VAI === 'worker' ? [] : [BookingsController],\n  providers: VAI === 'api' ? [] : [EmailProcessor, HopThu],\n})\nexport class AppModule91 {}";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport { AppModule91 } from './app.module.js';\n\nconst app = process.env.VAI === 'worker'\n  ? await NestFactory.createApplicationContext(AppModule91)   // tiến trình worker: không HTTP\n  : await NestFactory.create(AppModule91);\nif (process.env.HOOKS) app.enableShutdownHooks();             // SIGTERM ⇒ onModuleDestroy ⇒ worker.close()\nif (process.env.VAI !== 'worker') await (app as any).listen(Number(process.env.PORT ?? 41911), '127.0.0.1');\nconsole.log(`pid ${process.pid} sẵn sàng (${process.env.VAI ?? 'all'})`);";
const OUT_COBAN = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ curl -s -X POST localhost:41911/bookings/8/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"2\"}\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\nsv8@fpt.edu.vn | Lịch #8 đã được duyệt\n—— log tiến trình 1\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [NestApplication] Nest application successfully started +6ms\npid 3789999 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n[Nest] LOG [EmailProcessor] job 2 lần 1: đã gửi";
const OUT_TACH = "$ curl -s -X POST localhost:41911/bookings/9/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ redis-cli LLEN bull:email:wait\n1\n$ redis-cli LLEN nst:hopthu\n0\n# bật tiến trình worker (createApplicationContext, không HTTP)\n$ redis-cli LLEN bull:email:wait\n0\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv9@fpt.edu.vn | Lịch #9 đã được duyệt\n—— log tiến trình 1\npid 3784475 sẵn sàng (api)\n—— log tiến trình 2\npid 3784600 sẵn sàng (worker)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi";
const OUT_KHONG = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ redis-cli ZCARD bull:email:failed\n1\n$ redis-cli HMGET bull:email:1 ats atm failedReason\n1\n1\n421 SMTP tạm thời từ chối\n$ redis-cli LLEN nst:hopthu\n0\n—— log tiến trình 1\npid 3601534 sẵn sàng (all)\n[Nest] WARN [EmailProcessor] job 1 hỏng lần 1: 421 SMTP tạm thời từ chối";
const OUT_THULAI = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ redis-cli HMGET bull:email:1 atm timestamp finishedOn\n3\n1795484495832\n1795484497682\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n—— log tiến trình 1\npid 3616258 sẵn sàng (all)\n[Nest] WARN [EmailProcessor] job 1 hỏng lần 1: 421 SMTP tạm thời từ chối\n[Nest] WARN [EmailProcessor] job 1 hỏng lần 2: 421 SMTP tạm thời từ chối\n[Nest] LOG [EmailProcessor] job 1 lần 3: đã gửi";
const OUT_BAM = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"2\"}\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n—— log tiến trình 1\npid 3640472 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n[Nest] LOG [EmailProcessor] job 2 lần 1: đã gửi";
const OUT_BAMID = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"approved-7\"}\n$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"approved-7\"}\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n—— log tiến trình 1\npid 3633909 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job approved-7 lần 1: đã gửi";
const OUT_BAMSAU = "$ curl -s -X POST localhost:41911/bookings/7/approve\n\n# job đã xong; giảng viên bấm duyệt lại (trang bị tải lại)\n$ curl -s -X POST localhost:41911/bookings/7/approve\n\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n—— log tiến trình 1\nenv: 'JOB': No such file or directory";
const OUT_BAMSAURM = "$ curl -s -X POST localhost:41911/bookings/7/approve\n\n# job đã xong; giảng viên bấm duyệt lại (trang bị tải lại)\n$ curl -s -X POST localhost:41911/bookings/7/approve\n\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n—— log tiến trình 1\nenv: 'JOB': No such file or directory";
const OUT_GIET = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n# 1 giây sau: thư đã đi, job còn đang chạy phần sau\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n$ kill -9 <pid>    # sập nguồn, OOM, deploy ép\n# bật lại một worker, chờ 5 giây\n$ redis-cli HMGET bull:email:1 ats atm stc\n2\n1\n1\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n—— log tiến trình 1\npid 3772843 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n—— log tiến trình 2\npid 3780779 sẵn sàng (worker)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi";
const OUT_GIETIDEM = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n# 1 giây sau: thư đã đi, job còn đang chạy phần sau\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n$ kill -9 <pid>    # sập nguồn, OOM, deploy ép\n# bật lại một worker, chờ 5 giây\n$ redis-cli HMGET bull:email:1 ats atm stc\n2\n1\n1\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n—— log tiến trình 1\npid 3783986 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n—— log tiến trình 2\npid 3784062 sẵn sàng (worker)\n[Nest] LOG [EmailProcessor] job 1 lần 1: trùng khoá — bỏ qua";
const OUT_TERM = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ kill -TERM 3896222\ntiến trình thoát sau .052 s\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n$ redis-cli LLEN bull:email:active\n1\n—— log tiến trình 1\npid 3896222 sẵn sàng (all)";
const OUT_TERMHOOK = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ kill -TERM 3902412\ntiến trình thoát sau 2.50 s\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n$ redis-cli LLEN bull:email:active\n0\n—— log tiến trình 1\npid 3902412 sẵn sàng (all)\n[Nest] WARN [EmailProcessor] job 1 hỏng lần 1: Connection is closed.";
const OUT_TERMSUA = "$ curl -s -X POST localhost:41911/bookings/7/approve\n{\"status\":\"APPROVED\",\"emailJob\":\"1\"}\n$ kill -TERM 3931137\ntiến trình thoát sau 2.54 s\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt\n$ redis-cli LLEN bull:email:active\n0\n—— log tiến trình 1\npid 3931137 sẵn sàng (all)\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi";
const MA_BT = "// bt.spec.ts — bài tập 9.1: test đơn vị processor, không Redis, không Nest container\nimport type { Job } from 'bullmq';\nimport { EmailProcessor } from './email.processor.js';\nimport type { HopThu } from './hop-thu.js';\n\nconst job = (name: string, data: object, attemptsMade = 0) => ({ id: '1', name, data, attemptsMade }) as unknown as Job;\n\ndescribe('EmailProcessor', () => {\n  const hopThu = { gui: vi.fn() };\n  const p = new EmailProcessor(hopThu as unknown as HopThu);\n  // NGOẶC NHỌN: beforeEach trả về một hàm thì Vitest coi đó là hàm dọn dẹp và GỌI nó sau mỗi test\n  beforeEach(() => { hopThu.gui.mockReset().mockResolvedValue('đã gửi'); });\n\n  it('booking-approved ⇒ gửi đúng người, đúng tiêu đề, trả kết quả của hộp thư', async () => {\n    await expect(p.process(job('booking-approved', { bookingId: 7, to: 'sv7@fpt.edu.vn' }))).resolves.toBe('đã gửi');\n    expect(hopThu.gui).toHaveBeenCalledWith('sv7@fpt.edu.vn', 'Lịch #7 đã được duyệt', undefined);\n  });\n  it('lỗi SMTP ⇒ ném ra (để BullMQ thử lại), không nuốt', async () => {\n    hopThu.gui.mockRejectedValue(new Error('421'));\n    await expect(p.process(job('booking-approved', { bookingId: 7, to: 'x' }))).rejects.toThrow('421');\n  });\n  it('tên job lạ ⇒ ném lỗi, không âm thầm \"xong\"', async () => {\n    await expect(p.process(job('booking-aproved', { bookingId: 7 }))).rejects.toThrow('job lạ: booking-aproved');\n    expect(hopThu.gui).not.toHaveBeenCalled();\n  });\n});";
const OUT_BT = " RUN  v4.1.12 /home/sv/app\n[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n ✓ src/b91/bt.spec.ts > EmailProcessor > booking-approved ⇒ gửi đúng người, đúng tiêu đề, trả kết quả của hộp thư 6ms\n ✓ src/b91/bt.spec.ts > EmailProcessor > lỗi SMTP ⇒ ném ra (để BullMQ thử lại), không nuốt 1ms\n ✓ src/b91/bt.spec.ts > EmailProcessor > tên job lạ ⇒ ném lỗi, không âm thầm \"xong\" 1ms\n Test Files  1 passed (1)\n      Tests  3 passed (3)\n   Start at  09:03:15\n   Duration  579ms (transform 46ms, setup 0ms, import 367ms, tests 9ms, environment 0ms)";
const OUT_BT1 = "[Nest] LOG [EmailProcessor] job 1 lần 1: đã gửi\n ✓ src/b91/bt.spec.ts > EmailProcessor > booking-approved ⇒ gửi đúng người, đúng tiêu đề, trả kết quả của hộp thư 7ms\n × src/b91/bt.spec.ts > EmailProcessor > lỗi SMTP ⇒ ném ra (để BullMQ thử lại), không nuốt 5ms\n   → 421\n ✓ src/b91/bt.spec.ts > EmailProcessor > tên job lạ ⇒ ném lỗi, không âm thầm \"xong\" 1ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/b91/bt.spec.ts > EmailProcessor > lỗi SMTP ⇒ ném ra (để BullMQ thử lại), không nuốt\nError: 421\n ❯ src/b91/bt.spec.ts:18:34\n     16|   });\n     17|   it('lỗi SMTP ⇒ ném ra (để BullMQ thử lại), không nuốt', async () => {\n     18|     hopThu.gui.mockRejectedValue(new Error('421'));\n       |                                  ^\n     19|     await expect(p.process(job('booking-approved', { bookingId: 7, to:…\n     20|   });\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n Test Files  1 failed (1)\n      Tests  1 failed | 2 passed (3)\n   Duration  675ms (transform 54ms, setup 0ms, import 480ms, tests 15ms, environment 0ms)";
const OUT_EXPLORER = "    /**\n     * Runs in `onModuleDestroy`, the first shutdown phase, so the jobs in flight\n     * finish before the queues close (they do so in `onApplicationShutdown`).\n     */\n    onModuleDestroy() {\n        return Promise.all(this.workers.map((worker) => worker.close()));\n    }";

export default {
  title: '9.1 — Queues with @nestjs/bullmq: producers, processors, retries and idempotency|||9.1 — Hàng đợi với @nestjs/bullmq: producer, processor, thử lại và idempotency',
  slug: 'nst-9-1-bullmq',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nối BullMQ vào Nest: BullModule.forRoot, registerQueue, @InjectQueue, @Processor + WorkerHost, worker ở tiến trình riêng bằng createApplicationContext. Đo thật: không cấu hình attempts thì không thử lại; bấm duyệt hai lần ⇒ hai email; jobId chặn trùng nhưng removeOnComplete làm mất tác dụng; kill -9 giữa job ⇒ email gửi hai lần; SIGTERM với enableShutdownHooks vẫn hỏng nếu đóng kết nối ở onModuleDestroy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>9.1 — Queues in Nest: what the module gives you, and what it does not</h2>
<p class="lead">When a lecturer approves a booking, the student should get an email. Sending it inside the request makes the lecturer wait for an SMTP server and fails the approval when SMTP is down. The fix is a queue: the request writes a job to Redis and returns; a worker sends the email later and retries on failure. How BullMQ stores and runs jobs is taught in the Node.js course, chapter 13 (links below). This lesson covers the Nest part — wiring, DI inside processors, separate worker processes, shutdown — and measures the four ways one job turns into two emails.</p>

<h3>Everyday analogy: the laundry counter</h3>
<p>At a laundry you hand over the bag, get a ticket and leave — nobody makes you wait while the machine runs. The ticket is the job; the people in the back are workers. Two things can still go wrong: you hand in the same bag twice (two tickets, washed twice), or a washer quits halfway and the next person starts the load again. A queue system is mostly about those two cases.</p>

<h3>1. Wiring: four pieces</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_PROC)}</code></pre>
<p>The "email provider" is a fake that writes every sent message to a Redis list, so the messages survive a killed process — like a real provider, a sent email cannot be taken back:</p>
<pre><code class="language-ts">${esc(MA_HOPTHU)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><code>BullModule.forRoot</code> — the Redis connection for every queue. In a real project use <code>forRootAsync</code> with <code>ConfigService</code> (milestone 9.5).</li>
<li><code>registerQueue({ name })</code> — creates a <code>Queue</code> provider; <code>@InjectQueue('email')</code> injects it anywhere in that module.</li>
<li><code>@Processor('email')</code> + <code>extends WorkerHost</code> — Nest's explorer finds the class at startup and creates a BullMQ <code>Worker</code> that calls <code>process(job)</code>. Because the processor is a normal provider, it receives <code>HopThu</code> through the constructor.</li>
<li>The second argument of <code>@Processor</code> goes straight to BullMQ's <code>Worker</code>: <code>concurrency</code>, <code>lockDuration</code>, <code>stalledInterval</code>.</li>
</ul>

<h3>2. API and worker in separate processes</h3>
<p>The same module runs in two roles. The API process registers only the controller; the worker process registers only the processor and starts with <code>NestFactory.createApplicationContext</code> — Nest without HTTP.</p>
<div class="out">${esc(OUT_TACH)}</div>
<p>With no worker, the job waits in <code>bull:email:wait</code>; nothing is lost. When the worker starts, it drains the queue. This is how you scale: three API replicas, two workers, each scaled on its own.</p>

<h3>3. Retries are not on by default</h3>
<div class="out">${esc(OUT_KHONG)}</div>
<p>One temporary SMTP error and the job is <strong>failed forever</strong>: one attempt, no retry. Neither BullMQ nor Nest adds a default. Put it once in <code>registerQueue({ defaultJobOptions })</code>:</p>
<div class="out">${esc(OUT_THULAI)}</div>
<p>Three attempts; <code>finishedOn − timestamp</code> = 1,850 ms ≈ 500 + 1000 ms of exponential backoff plus three 100 ms "SMTP calls". Note the Redis field names in BullMQ 6: <code>atm</code> = attempts made, <code>ats</code> = attempts started, <code>stc</code> = stalled count.</p>

<h3>4. Four ways one approval becomes two emails</h3>
<p><strong>a) The lecturer double-clicks.</strong></p>
<div class="out">${esc(OUT_BAM)}</div>
<p><strong>b) A deterministic <code>jobId</code></strong> (<code>JOB_ID=1</code> ⇒ <code>approved-7</code>): BullMQ ignores an add whose id already exists.</p>
<div class="out">${esc(OUT_BAMID)}</div>
<p>It still holds after the job has completed, because completed jobs are kept:</p>
<div class="out">${esc(OUT_BAMSAU)}</div>
<p><strong>c) The same, plus <code>removeOnComplete: true</code></strong> — a setting copied into many projects to keep Redis small:</p>
<div class="out">${esc(OUT_BAMSAURM)}</div>
<p>The completed job was deleted, so the id is free again and the second click sends a second email. A <code>jobId</code> only deduplicates <em>while the job exists</em>. Keep completed jobs for as long as duplicates must be blocked (<code>removeOnComplete: { age: 7 * 86400 }</code>), or deduplicate in your database.</p>
<p><strong>d) The worker dies after sending, before finishing.</strong> <code>SAU_GUI_MS=3000</code> simulates work after the send (writing to the DB); we <code>kill -9</code> during it:</p>
<div class="out">${esc(OUT_GIET)}</div>
<p>The lock expired (<code>lockDuration</code> 3 s), the stalled check moved the job back to <em>wait</em>, and the new worker ran it again: <code>ats</code> = 2. Two traps in one output: the student got two emails, and the log says "lần 1" (attempt 1) both times — <code>job.attemptsMade</code> does not count stalled re-runs; use <code>job.attemptsStarted</code> if you need to know. Retries, deduplication and locks cannot remove this window: a queue gives <strong>at-least-once</strong> delivery. The handler has to be idempotent. With an idempotency key (<code>IDEM=1</code>; real providers such as Stripe, Resend and Postmark accept one):</p>
<div class="out">${esc(OUT_GIETIDEM)}</div>

<h3>5. Graceful shutdown: the Nest-specific trap</h3>
<p>Deploys and autoscaling stop processes with <code>SIGTERM</code>. A job takes 3 s (<code>MAIL_MS=3000</code>); we send SIGTERM 0.5 s into it.</p>
<p><strong>Without <code>enableShutdownHooks()</code></strong>: Node's default handler exits at once. The job is left <em>active</em> until its lock expires and another worker re-runs it.</p>
<div class="out">${esc(OUT_TERM)}</div>
<p><strong>With <code>enableShutdownHooks()</code></strong>: the process waits 2.5 s for the job… and the job fails anyway:</p>
<div class="out">${esc(OUT_TERMHOOK)}</div>
<p>Why? Nest runs shutdown in three phases: <code>onModuleDestroy</code> → <code>beforeApplicationShutdown</code> → <code>onApplicationShutdown</code>. Here is where <code>@nestjs/bullmq</code> closes its workers:</p>
<div class="out">${esc(OUT_EXPLORER)}</div>
<p><code>worker.close()</code> waits for the running job — but in the <em>same phase</em>, <code>HopThu.onModuleDestroy()</code> closed the Redis connection the job was still using. Hooks of one phase run concurrently, so a resource that jobs need must be closed in <code>onApplicationShutdown</code>:</p>
<div class="out">${esc(OUT_TERMSUA)}</div>
<p>The project's <code>PrismaService</code> from Chapter 6 disconnects in <code>onModuleDestroy</code> — exactly this bug once workers write to the database. Milestone 9.5 moves it.</p>

<h3>⚠️ Real incident: one job, every subscriber (HBO Max, 17/06/2021)</h3>
<p>On 17 June 2021 HBO Max subscribers received an email titled "Integration Test Email #1" whose body said the template is used by integration tests only. HBO Max apologised for sending an empty test email to part of its mailing list and added "yes, it was the intern" (BleepingComputer, 18/06/2021). The lesson for queues: a bulk-email job multiplies one mistake by the size of the list, and it cannot be recalled. Practical guards: a non-production environment must never hold production recipients or credentials (Chapter 5), a recipient allow-list in the dev mailer, and a cap on how many emails one job may enqueue. Blaming the intern is the joke; the system that let a test reach the real list is the bug.</p>

<h3>🧪 Exercise (15 min) — unit-test the processor without Redis</h3>
<p>Write three tests for <code>EmailProcessor</code> with a fake <code>HopThu</code>: the right recipient and subject; an SMTP error is rethrown (so BullMQ can retry); an unknown job name throws instead of "completing".</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>The first version had <code>beforeEach(() =&gt; hopThu.gui.mockReset().mockResolvedValue('đã gửi'))</code> — no braces. It failed like this:</p>
<div class="out">${esc(OUT_BT1)}</div>
<p>An arrow function without braces <em>returns</em> its expression — here the mock function. Vitest treats a function returned from <code>beforeEach</code> as a cleanup function and calls it after each test; in the SMTP test that call returned a rejected promise, failing the test. Braces fix it.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Does BullMQ guarantee a job runs exactly once?</strong> No — at-least-once. A worker can die after the side effect and before acknowledging; the stalled job runs again. Make handlers idempotent (idempotency key, unique constraint, check-then-act on your own state).</li>
<li><strong>How do you stop a double click from creating two jobs?</strong> A deterministic <code>jobId</code>; it only works while the job is kept, so do not combine it with <code>removeOnComplete: true</code> — or deduplicate in the database.</li>
<li><strong>How do you run workers separately from the API in Nest?</strong> Register processors only in the worker role and start it with <code>createApplicationContext</code>; the producer only needs <code>registerQueue</code> + <code>@InjectQueue</code>.</li>
<li><strong>What happens to a running job on deploy?</strong> With <code>enableShutdownHooks()</code>, <code>@nestjs/bullmq</code> calls <code>worker.close()</code> in <code>onModuleDestroy</code> and waits; resources jobs use must close in <code>onApplicationShutdown</code>. Without hooks the job is stalled and re-run later.</li>
</ol>

<h3>💼 On the job</h3>
<p>On an outsourcing project the client reports "students sometimes get two approval emails". Nobody can reproduce it locally — locally nothing is ever killed. Ask three questions in this lesson's order: is there a <code>jobId</code>, is <code>removeOnComplete: true</code> set, and does the handler survive being run twice? Then read the Redis hash of an affected job: <code>ats</code> 2 with <code>atm</code> 1 means a stalled re-run — check the pod restarts at that time. That turns "sometimes" into a reproducible test (lab 9.4).</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Producer / processor</span><span class="v">Code that adds jobs (@InjectQueue) / class that runs them (@Processor + WorkerHost).</span></div>
  <div class="kv"><span class="k">registerQueue</span><span class="v">Creates the Queue provider and the place for defaultJobOptions.</span></div>
  <div class="kv"><span class="k">createApplicationContext</span><span class="v">Nest without HTTP — the entry point for a worker process.</span></div>
  <div class="kv"><span class="k">attempts / backoff</span><span class="v">How many times, and how long to wait between them. Off unless you set it.</span></div>
  <div class="kv"><span class="k">jobId</span><span class="v">Deterministic id; a second add with the same id is ignored while the job exists.</span></div>
  <div class="kv"><span class="k">Stalled job</span><span class="v">Its lock expired while active (worker died); BullMQ moves it back to wait.</span></div>
  <div class="kv"><span class="k">At-least-once / idempotent</span><span class="v">A job may run more than once / running it twice has the effect of once.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>@nestjs/bullmq</code> = forRoot (connection) + registerQueue (queue + defaults) + @InjectQueue (producer) + @Processor/WorkerHost (consumer, with DI).</li>
<li>Run API and workers as separate processes; jobs wait safely in Redis.</li>
<li>No retries by default; set <code>attempts</code> + <code>backoff</code> in <code>defaultJobOptions</code>.</li>
<li>Duplicates come from the producer (fix: <code>jobId</code>, and keep completed jobs) and from stalled re-runs (fix: idempotent handler). Delivery is at-least-once.</li>
<li><code>enableShutdownHooks()</code> + close shared resources in <code>onApplicationShutdown</code>, never in <code>onModuleDestroy</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>9.1 — Hàng đợi trong Nest: module cho bạn gì, và không cho gì</h2>
<p class="lead">Giảng viên duyệt một lịch thì sinh viên phải nhận email. Gửi ngay trong request nghĩa là giảng viên phải chờ máy chủ SMTP, và SMTP sập thì thao tác duyệt cũng hỏng theo. Cách chữa là hàng đợi: request ghi một job vào Redis rồi trả về; worker gửi email sau và tự thử lại khi lỗi. BullMQ lưu và chạy job thế nào đã có ở khoá Node.js, chương 13 (liên kết cuối bài). Bài này dạy phần của Nest — nối dây, DI trong processor, worker ở tiến trình riêng, tắt máy — và đo bốn cách một job biến thành hai email.</p>

<h3>Liên hệ đời thường: quầy nhận giặt ủi</h3>
<p>Ở tiệm giặt, bạn đưa túi đồ, nhận phiếu rồi đi — không ai bắt bạn đứng chờ máy giặt chạy xong. Phiếu là job; người làm phía sau là worker. Vẫn còn hai chuyện có thể hỏng: bạn đưa cùng một túi hai lần (hai phiếu, giặt hai lần), hoặc một người giặt bỏ dở giữa chừng và người sau giặt lại từ đầu. Phần lớn chuyện của hệ thống hàng đợi xoay quanh hai trường hợp đó.</p>

<h3>1. Nối dây: bốn mảnh</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_PROC)}</code></pre>
<p>"Nhà cung cấp email" là đồ giả: mỗi thư gửi đi được ghi vào một list Redis, nên thư vẫn còn khi tiến trình bị giết — giống nhà cung cấp thật, thư đã gửi thì không rút lại được:</p>
<pre><code class="language-ts">${esc(MA_HOPTHU)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><code>BullModule.forRoot</code> — kết nối Redis dùng chung cho mọi hàng đợi. Dự án thật dùng <code>forRootAsync</code> với <code>ConfigService</code> (mốc 9.5).</li>
<li><code>registerQueue({ name })</code> — tạo provider <code>Queue</code>; <code>@InjectQueue('email')</code> tiêm nó vào bất kỳ đâu trong module đó.</li>
<li><code>@Processor('email')</code> + <code>extends WorkerHost</code> — lúc khởi động, explorer của Nest tìm lớp này và tạo một <code>Worker</code> BullMQ gọi <code>process(job)</code>. Processor là provider bình thường nên nhận <code>HopThu</code> qua constructor.</li>
<li>Tham số thứ hai của <code>@Processor</code> đi thẳng vào <code>Worker</code> của BullMQ: <code>concurrency</code>, <code>lockDuration</code>, <code>stalledInterval</code>.</li>
</ul>

<h3>2. API và worker ở hai tiến trình</h3>
<p>Cùng một module chạy hai vai. Tiến trình API chỉ đăng ký controller; tiến trình worker chỉ đăng ký processor và khởi động bằng <code>NestFactory.createApplicationContext</code> — Nest không có HTTP.</p>
<div class="out">${esc(OUT_TACH)}</div>
<p>Chưa có worker thì job nằm chờ trong <code>bull:email:wait</code>, không mất gì. Worker bật lên là rút cạn hàng đợi. Đây là cách mở rộng: ba bản API, hai worker, mỗi bên tăng giảm riêng.</p>

<h3>3. Thử lại không tự bật</h3>
<div class="out">${esc(OUT_KHONG)}</div>
<p>Một lỗi SMTP tạm thời là job <strong>hỏng vĩnh viễn</strong>: một lần chạy, không thử lại. Cả BullMQ lẫn Nest đều không đặt mặc định. Đặt một lần trong <code>registerQueue({ defaultJobOptions })</code>:</p>
<div class="out">${esc(OUT_THULAI)}</div>
<p>Ba lần chạy; <code>finishedOn − timestamp</code> = 1.850 ms ≈ 500 + 1000 ms backoff lũy thừa cộng ba "lần gọi SMTP" 100 ms. Để ý tên trường Redis ở BullMQ 6: <code>atm</code> = số lần đã chạy xong (attempts made), <code>ats</code> = số lần đã bắt đầu (attempts started), <code>stc</code> = số lần bị treo (stalled count).</p>

<h3>4. Bốn cách một lần duyệt thành hai email</h3>
<p><strong>a) Giảng viên bấm hai lần.</strong></p>
<div class="out">${esc(OUT_BAM)}</div>
<p><strong>b) <code>jobId</code> cố định</strong> (<code>JOB_ID=1</code> ⇒ <code>approved-7</code>): BullMQ bỏ qua lần thêm có id đã tồn tại.</p>
<div class="out">${esc(OUT_BAMID)}</div>
<p>Vẫn đúng cả khi job đã xong, vì job xong vẫn được giữ lại:</p>
<div class="out">${esc(OUT_BAMSAU)}</div>
<p><strong>c) Như trên, thêm <code>removeOnComplete: true</code></strong> — dòng cấu hình được chép vào rất nhiều dự án để Redis gọn:</p>
<div class="out">${esc(OUT_BAMSAURM)}</div>
<p>Job đã xong bị xoá, id được giải phóng, lần bấm thứ hai gửi email thứ hai. <code>jobId</code> chỉ chặn trùng <em>khi job còn tồn tại</em>. Hãy giữ job xong đủ lâu bằng khoảng thời gian cần chặn trùng (<code>removeOnComplete: { age: 7 * 86400 }</code>), hoặc chặn trùng trong cơ sở dữ liệu.</p>
<p><strong>d) Worker chết sau khi gửi, trước khi xong.</strong> <code>SAU_GUI_MS=3000</code> mô phỏng phần việc sau khi gửi (ghi DB); ta <code>kill -9</code> đúng lúc đó:</p>
<div class="out">${esc(OUT_GIET)}</div>
<p>Khoá hết hạn (<code>lockDuration</code> 3 giây), lượt kiểm job treo đưa job về hàng chờ, worker mới chạy lại: <code>ats</code> = 2. Một output, hai cái bẫy: sinh viên nhận hai email, và log ghi "lần 1" cả hai lần — <code>job.attemptsMade</code> không đếm lần chạy lại do treo; cần biết thì dùng <code>job.attemptsStarted</code>. Thử lại, chặn trùng hay khoá đều không xoá được khe hở này: hàng đợi chỉ hứa giao <strong>ít nhất một lần</strong> (at-least-once). Hàm xử lý phải idempotent. Có khoá idempotency (<code>IDEM=1</code>; nhà cung cấp thật như Stripe, Resend, Postmark đều nhận khoá này):</p>
<div class="out">${esc(OUT_GIETIDEM)}</div>

<h3>5. Tắt êm: cái bẫy riêng của Nest</h3>
<p>Deploy và tự co giãn dừng tiến trình bằng <code>SIGTERM</code>. Job mất 3 giây (<code>MAIL_MS=3000</code>); ta gửi SIGTERM khi job chạy được 0,5 giây.</p>
<p><strong>Không có <code>enableShutdownHooks()</code></strong>: bộ xử lý mặc định của Node thoát ngay. Job bị bỏ ở trạng thái <em>active</em> cho tới khi khoá hết hạn và worker khác chạy lại.</p>
<div class="out">${esc(OUT_TERM)}</div>
<p><strong>Có <code>enableShutdownHooks()</code></strong>: tiến trình chờ 2,5 giây cho job… rồi job vẫn hỏng:</p>
<div class="out">${esc(OUT_TERMHOOK)}</div>
<p>Vì sao? Nest tắt theo ba pha: <code>onModuleDestroy</code> → <code>beforeApplicationShutdown</code> → <code>onApplicationShutdown</code>. Đây là chỗ <code>@nestjs/bullmq</code> đóng worker:</p>
<div class="out">${esc(OUT_EXPLORER)}</div>
<p><code>worker.close()</code> chờ job đang chạy — nhưng <em>cùng pha đó</em>, <code>HopThu.onModuleDestroy()</code> đã đóng kết nối Redis mà job vẫn đang dùng. Các hook trong một pha chạy đồng thời, nên tài nguyên job cần phải đóng ở <code>onApplicationShutdown</code>:</p>
<div class="out">${esc(OUT_TERMSUA)}</div>
<p><code>PrismaService</code> của dự án từ Chương 6 ngắt kết nối ở <code>onModuleDestroy</code> — đúng lỗi này một khi worker ghi DB. Mốc 9.5 sẽ chuyển nó.</p>

<h3>⚠️ Sự cố thật: một job, mọi người đăng ký (HBO Max, 17/06/2021)</h3>
<p>Ngày 17/06/2021, người dùng HBO Max nhận một email tiêu đề "Integration Test Email #1", thân thư ghi mẫu này chỉ dùng cho test tích hợp. HBO Max xin lỗi vì đã gửi nhầm email thử nghiệm rỗng tới một phần danh sách, kèm câu "yes, it was the intern" (BleepingComputer, 18/06/2021). Bài học cho hàng đợi: job gửi email hàng loạt nhân một sai sót lên bằng cỡ danh sách, và không thu hồi được. Rào chắn thực tế: môi trường không phải production không bao giờ giữ danh sách người nhận hay thông tin đăng nhập thật (Chương 5), mailer dev có danh sách người nhận được phép, và giới hạn số email một job được xếp. Đổ cho thực tập sinh chỉ là câu đùa; lỗi thật là hệ thống cho phép một bài test chạm tới danh sách thật.</p>

<h3>🧪 Thực hành (15 phút) — test đơn vị processor, không cần Redis</h3>
<p>Viết ba test cho <code>EmailProcessor</code> với <code>HopThu</code> giả: đúng người nhận và tiêu đề; lỗi SMTP được ném lại (để BullMQ thử lại); tên job lạ thì ném lỗi chứ không "xong".</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Bản đầu viết <code>beforeEach(() =&gt; hopThu.gui.mockReset().mockResolvedValue('đã gửi'))</code> — không có ngoặc nhọn. Kết quả:</p>
<div class="out">${esc(OUT_BT1)}</div>
<p>Hàm mũi tên không ngoặc nhọn <em>trả về</em> biểu thức của nó — ở đây là chính hàm mock. Vitest coi hàm trả về từ <code>beforeEach</code> là hàm dọn dẹp và gọi nó sau mỗi test; ở test SMTP, lời gọi đó trả một promise bị từ chối, làm test đỏ. Thêm ngoặc nhọn là hết.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>BullMQ có bảo đảm job chạy đúng một lần không?</strong> Không — ít nhất một lần. Worker có thể chết sau khi đã gây tác dụng và trước khi báo xong; job treo sẽ chạy lại. Làm hàm xử lý idempotent (khoá idempotency, ràng buộc UNIQUE, kiểm trạng thái của chính mình rồi mới làm).</li>
<li><strong>Chặn bấm hai lần tạo hai job thế nào?</strong> <code>jobId</code> cố định; chỉ có tác dụng khi job còn được giữ, nên đừng đi kèm <code>removeOnComplete: true</code> — hoặc chặn trùng trong DB.</li>
<li><strong>Trong Nest, chạy worker tách khỏi API thế nào?</strong> Chỉ đăng ký processor ở vai worker và khởi động bằng <code>createApplicationContext</code>; phía xếp hàng chỉ cần <code>registerQueue</code> + <code>@InjectQueue</code>.</li>
<li><strong>Job đang chạy thì deploy sẽ ra sao?</strong> Có <code>enableShutdownHooks()</code>, <code>@nestjs/bullmq</code> gọi <code>worker.close()</code> ở <code>onModuleDestroy</code> và chờ; tài nguyên job dùng phải đóng ở <code>onApplicationShutdown</code>. Không có hook thì job bị treo và chạy lại sau.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, khách báo "thỉnh thoảng sinh viên nhận hai email duyệt". Trên máy mình không ai tái hiện được — vì ở máy mình chẳng có gì bị giết. Hỏi ba câu theo thứ tự của bài: có <code>jobId</code> không, có <code>removeOnComplete: true</code> không, và hàm xử lý chạy hai lần có sao không? Rồi đọc hash Redis của một job bị lỗi: <code>ats</code> 2 mà <code>atm</code> 1 nghĩa là chạy lại do treo — đối chiếu giờ đó pod có khởi động lại không. Thế là "thỉnh thoảng" thành một test tái hiện được (lab 9.4).</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Producer / processor</span><span class="v">Mã thêm job (@InjectQueue) / lớp chạy job (@Processor + WorkerHost).</span></div>
  <div class="kv"><span class="k">registerQueue</span><span class="v">Tạo provider Queue, và là chỗ đặt defaultJobOptions.</span></div>
  <div class="kv"><span class="k">createApplicationContext</span><span class="v">Nest không có HTTP — điểm vào của tiến trình worker.</span></div>
  <div class="kv"><span class="k">attempts / backoff</span><span class="v">Thử mấy lần, chờ bao lâu giữa các lần. Không đặt thì không có.</span></div>
  <div class="kv"><span class="k">jobId</span><span class="v">Id cố định; thêm lần hai cùng id bị bỏ qua khi job còn tồn tại.</span></div>
  <div class="kv"><span class="k">Job treo (stalled)</span><span class="v">Khoá hết hạn khi đang chạy (worker chết); BullMQ đưa về hàng chờ.</span></div>
  <div class="kv"><span class="k">Ít nhất một lần / idempotent</span><span class="v">Job có thể chạy hơn một lần / chạy hai lần có tác dụng như một lần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>@nestjs/bullmq</code> = forRoot (kết nối) + registerQueue (hàng đợi + mặc định) + @InjectQueue (xếp hàng) + @Processor/WorkerHost (chạy job, có DI).</li>
<li>Chạy API và worker ở hai tiến trình; job nằm chờ an toàn trong Redis.</li>
<li>Mặc định không thử lại; đặt <code>attempts</code> + <code>backoff</code> trong <code>defaultJobOptions</code>.</li>
<li>Trùng đến từ phía xếp hàng (chữa: <code>jobId</code>, và giữ job đã xong) và từ lần chạy lại do treo (chữa: hàm xử lý idempotent). Giao nhận là ít nhất một lần.</li>
<li><code>enableShutdownHooks()</code> + đóng tài nguyên dùng chung ở <code>onApplicationShutdown</code>, không bao giờ ở <code>onModuleDestroy</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
