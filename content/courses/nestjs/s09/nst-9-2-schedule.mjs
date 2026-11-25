/**
 * 9.2 — Hẹn giờ với @nestjs/schedule: cron, interval, và chạy đúng một lần khi có nhiều bản (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/schedule 12.0.4, cron 4.4.0, @nestjs/bullmq 12.0.2 + bullmq 6.7.8, Redis 7.4.12):
 * scratchpad/nst/lab/c9/app/src/b92 + b92.sh (mot-ban, ba-ban, ba-ban CACH=khoa, ba-ban-bull, chong-cheo [WAIT=1], mot-ban NEM=1, bt) +
 * o/92-tz.mjs (múi giờ, chạy với TZ của máy và TZ=UTC) ⇒ lab/c9/o/92-*.txt. Ghép: web-tool/c9/gen.mjs rồi ghep.sh 92 nst-9-2-schedule.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-4-lich-trinh', title: 'Node.js 13.4 — Hẹn giờ, ưu tiên, job định kỳ', sub: 'Bốn nhu cầu lập lịch, bốn cơ chế — nền của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-4-nguyen-tu-rate-limit-lock', title: 'Node.js 12.4 — Thao tác nguyên tử, khoá Redis', sub: 'SET NX PX và vì sao khoá phải có hạn — mục 3 dùng lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-1-bullmq', title: 'NestJS 9.1 — Hàng đợi với @nestjs/bullmq', sub: 'Processor, worker tách tiến trình — job scheduler ở mục 4 chạy trên đó.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Task scheduling', '@Cron, @Interval, @Timeout, CronOptions (timeZone, waitForCompletion, disabled), SchedulerRegistry.', 'https://docs.nestjs.com/techniques/task-scheduling'),
  nguon('📘', 'BullMQ docs — Job Schedulers', 'upsertJobScheduler: pattern/every, tz, một lịch dùng chung cho mọi bản.', 'https://docs.bullmq.io/guide/job-schedulers'),
  nguon('📰', 'Microsoft Azure Blog — Summary of Windows Azure Service Disruption on Feb 29th, 2012', 'Chứng chỉ "hạn một năm" tính ra ngày 29/02/2013 không tồn tại ⇒ máy ảo mới không khởi tạo được.', 'https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/'),
].join('\n');
const MA_DONDEP = "// don-dep.service.ts — việc định kỳ: huỷ lịch PENDING quá hạn (ở đây chỉ đếm số lần chạy vào Redis để quan sát)\nimport { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';\nimport { Cron, Interval, Timeout } from '@nestjs/schedule';\nimport { Redis } from 'ioredis';\n\nconst CACH = process.env.CACH ?? 'tran';          // tran | khoa  (cách chống chạy trùng)\nconst VIEC_MS = Number(process.env.VIEC_MS ?? 200);\n\n@Injectable()\nexport class DonDepService implements OnApplicationShutdown {\n  private log = new Logger(`DonDep#${process.pid}`);\n  readonly r = new Redis(process.env.REDIS_URL!);\n\n  @Cron('*/2 * * * * *', { name: 'don-dep', waitForCompletion: !!process.env.WAIT })   // giây 0, 2, 4, …\n  async donDep() {\n    const tick = Math.floor(Date.now() / 2000) * 2;                // mốc giây chẵn của lượt này\n    if (CACH === 'khoa') {\n      const duoc = await this.r.set(`nst:khoa:don-dep:${tick}`, String(process.pid), 'PX', 60_000, 'NX');\n      if (!duoc) return;                                           // bản khác đã giành lượt này\n    }\n    const dang = await this.r.incr('nst:dang-chay');\n    this.log.log(`lượt ${tick % 100}: bắt đầu (đang chạy cùng lúc: ${dang})`);\n    if (process.env.NEM) throw new Error('DB mất kết nối');\n    await new Promise((ok) => setTimeout(ok, VIEC_MS));\n    await this.r.decr('nst:dang-chay');\n    await this.r.incr(`nst:lan:${tick}`);\n  }\n\n  @Interval('nhip', 5000) nhip() { this.log.log('interval 5 s'); }\n  @Timeout(1000) motLan() { this.log.log('timeout 1 s: chạy đúng một lần sau khởi động'); }\n\n  onApplicationShutdown() { return this.r.quit(); }\n}";
const MA_LICH = "import { Controller, Delete, Get, Param } from '@nestjs/common';\nimport { SchedulerRegistry } from '@nestjs/schedule';\n\n@Controller('lich')\nexport class LichController {\n  constructor(private readonly reg: SchedulerRegistry) {}\n\n  @Get() ds() {\n    return {\n      cron: [...this.reg.getCronJobs()].map(([ten, job]) => ({ ten, chay: job.isActive, lanToi: job.nextDate().toISO() })),\n      interval: this.reg.getIntervals(),\n      timeout: this.reg.getTimeouts(),\n    };\n  }\n  @Delete(':ten') dung(@Param('ten') ten: string) { this.reg.getCronJob(ten).stop(); return { daDung: ten }; }\n}";
const MA_BAOTRI = "// bao-tri.ts — cách 2: để BullMQ giữ lịch. Mọi bản đều \"upsert\" cùng một job scheduler ⇒ Redis chỉ có MỘT lịch,\n// mỗi lượt sinh MỘT job, chỉ một worker lấy được job đó.\nimport { Injectable, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';\nimport { BullModule, InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';\nimport type { Job, Queue } from 'bullmq';\nimport { Redis } from 'ioredis';\n\n@Injectable()\nexport class LichBaoTri implements OnApplicationBootstrap {\n  constructor(@InjectQueue('bao-tri') private readonly q: Queue) {}\n  async onApplicationBootstrap() {\n    await this.q.upsertJobScheduler('don-dep', { pattern: '*/2 * * * * *', tz: 'Asia/Ho_Chi_Minh' }, { name: 'don-dep' });\n  }\n}\n\n@Processor('bao-tri')\nexport class BaoTriProcessor extends WorkerHost {\n  private log = new Logger(`BaoTri#${process.pid}`);\n  private r = new Redis(process.env.REDIS_URL!);\n  async process(job: Job) {\n    const tick = Number(job.id!.split(':').pop()) / 1000;         // id = repeat:don-dep:<mốc lịch, ms>\n    this.log.log(`job ${job.id}`);\n    await this.r.incr(`nst:lan:${tick}`);\n  }\n}\n\n@Module({\n  imports: [\n    BullModule.forRoot({ connection: { url: process.env.REDIS_URL } }),\n    BullModule.registerQueue({ name: 'bao-tri', defaultJobOptions: { removeOnComplete: 100, removeOnFail: 1000 } }),\n  ],\n  providers: [LichBaoTri, BaoTriProcessor],\n})\nexport class BaoTriModule {}";
const OUT_MOT = "$ curl -s localhost:41921/lich | jq -c\n{\"cron\":[{\"ten\":\"don-dep\",\"chay\":true,\"lanToi\":\"2026-11-24T08:45:42.000+07:00\"}],\"interval\":[\"nhip\"],\"timeout\":[\"7d33b231-60c8-475a-b0ac-b76da49a6839\"]}\n—— log bản 1\n[Nest] LOG [DonDep#4007731] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4007731] lượt 40: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4007731] lượt 42: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4007731] interval 5 s\n[Nest] LOG [DonDep#4007731] lượt 44: bắt đầu (đang chạy cùng lúc: 1)";
const OUT_BA = "# số lần chạy của từng lượt (khoá = mốc giây)\nnst:lan:1795484754 → 3\nnst:lan:1795484756 → 3\nnst:lan:1795484758 → 3\nnst:lan:1795484760 → 3\n—— log bản 1\n[Nest] LOG [DonDep#4051716] lượt 54: bắt đầu (đang chạy cùng lúc: 3)\n[Nest] LOG [DonDep#4051716] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4051716] lượt 56: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4051716] lượt 58: bắt đầu (đang chạy cùng lúc: 3)\n[Nest] LOG [DonDep#4051716] interval 5 s\n[Nest] LOG [DonDep#4051716] lượt 60: bắt đầu (đang chạy cùng lúc: 2)\n—— log bản 2\n[Nest] LOG [DonDep#4051718] lượt 54: bắt đầu (đang chạy cùng lúc: 2)\n[Nest] LOG [DonDep#4051718] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4051718] lượt 56: bắt đầu (đang chạy cùng lúc: 2)\n[Nest] LOG [DonDep#4051718] lượt 58: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4051718] interval 5 s\n[Nest] LOG [DonDep#4051718] lượt 60: bắt đầu (đang chạy cùng lúc: 3)\n—— log bản 3";
const OUT_BAKHOA = "# số lần chạy của từng lượt (khoá = mốc giây)\nnst:lan:1795484762 → 1\nnst:lan:1795484764 → 1\nnst:lan:1795484766 → 1\nnst:lan:1795484768 → 1\n—— log bản 1\n[Nest] LOG [DonDep#4074562] lượt 62: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4074562] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4074562] lượt 64: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4074562] interval 5 s\n—— log bản 2\n[Nest] LOG [DonDep#4074567] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4074567] lượt 66: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4074567] interval 5 s\n[Nest] LOG [DonDep#4074567] lượt 68: bắt đầu (đang chạy cùng lúc: 1)\n—— log bản 3\n[Nest] LOG [DonDep#4074573] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4074573] interval 5 s";
const OUT_BABULL = "$ redis-cli KEYS bull:bao-tri:repeat*\nbull:bao-tri:repeat:don-dep:1795484858000\nbull:bao-tri:repeat:don-dep:1795484854000\nbull:bao-tri:repeat:don-dep:1795484856000\nbull:bao-tri:repeat\nbull:bao-tri:repeat:don-dep:1795484852000\nbull:bao-tri:repeat:don-dep\n# số lần chạy của từng lượt (khoá = mốc giây)\nnst:lan:1795484852 → 1\nnst:lan:1795484854 → 1\nnst:lan:1795484856 → 1\n—— log bản 1\n[Nest] LOG [BaoTri#157416] job repeat:don-dep:1795484854000\n—— log bản 2\n[Nest] LOG [BaoTri#157417] job repeat:don-dep:1795484852000\n[Nest] LOG [BaoTri#157417] job repeat:don-dep:1795484856000\n—— log bản 3";
const OUT_CHEO = "—— log bản 1\n[Nest] LOG [DonDep#4115632] lượt 78: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] LOG [DonDep#4115632] lượt 80: bắt đầu (đang chạy cùng lúc: 2)\n[Nest] LOG [DonDep#4115632] lượt 82: bắt đầu (đang chạy cùng lúc: 3)\n[Nest] LOG [DonDep#4115632] lượt 84: bắt đầu (đang chạy cùng lúc: 3)";
const OUT_CHEOWAIT = "—— log bản 1\n[Nest] LOG [DonDep#4148772] lượt 88: bắt đầu (đang chạy cùng lúc: 1)";
const OUT_NEM = "—— log bản 1\n[Nest] LOG [DonDep#4183353] timeout 1 s: chạy đúng một lần sau khởi động\n[Nest] LOG [DonDep#4183353] lượt 96: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] ERROR [Scheduler] Error: DB mất kết nối\n    at DonDepService.donDep (file:///home/sv/app/dist/b92/don-dep.service.js:28:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async CronJob.<anonymous> (file:///home/sv/app/node_modules/@nestjs/schedule/dist/schedule.explorer.js:121:17)\n[Nest] LOG [DonDep#4183353] lượt 98: bắt đầu (đang chạy cùng lúc: 2)\n[Nest] ERROR [Scheduler] Error: DB mất kết nối\n    at DonDepService.donDep (file:///home/sv/app/dist/b92/don-dep.service.js:28:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async CronJob.<anonymous> (file:///home/sv/app/node_modules/@nestjs/schedule/dist/schedule.explorer.js:121:17)\n[Nest] LOG [DonDep#4183353] interval 5 s\n[Nest] LOG [DonDep#4183353] lượt 0: bắt đầu (đang chạy cùng lúc: 3)\n[Nest] ERROR [Scheduler] Error: DB mất kết nối\n    at DonDepService.donDep (file:///home/sv/app/dist/b92/don-dep.service.js:28:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async CronJob.<anonymous> (file:///home/sv/app/node_modules/@nestjs/schedule/dist/schedule.explorer.js:121:17)";
const MA_TZ = "import { CronJob } from 'cron';\nfor (const tz of ['Asia/Ho_Chi_Minh', 'Asia/Saigon', 'UTC', 'Asia/HoChiMinh']) {\n  try { const j = CronJob.from({ cronTime: '0 0 7 * * *', onTick() {}, timeZone: tz }); console.log(tz.padEnd(17), '→ lần tới', j.nextDate().toISO()); }\n  catch (e) { console.log(tz.padEnd(17), '→ LỖI', e.message); }\n}\nconst j = CronJob.from({ cronTime: '0 0 7 * * *', onTick() {} });\nconsole.log('(không timeZone)  → lần tới', j.nextDate().toISO(), ' TZ tiến trình =', Intl.DateTimeFormat().resolvedOptions().timeZone);";
const OUT_TZ = "$ node tz.mjs\nAsia/Ho_Chi_Minh  → lần tới 2026-11-25T07:00:00.000+07:00\nAsia/Saigon       → lần tới 2026-11-25T07:00:00.000+07:00\nUTC               → lần tới 2026-11-24T07:00:00.000Z\nAsia/HoChiMinh    → LỖI Invalid timezone.\n(không timeZone)  → lần tới 2026-11-25T07:00:00.000+07:00  TZ tiến trình = Asia/Saigon\n$ TZ=UTC node tz.mjs     # như trong container node:22-alpine\nAsia/Ho_Chi_Minh  → lần tới 2026-11-25T07:00:00.000+07:00\nAsia/Saigon       → lần tới 2026-11-25T07:00:00.000+07:00\nUTC               → lần tới 2026-11-24T07:00:00.000Z\nAsia/HoChiMinh    → LỖI Invalid timezone.\n(không timeZone)  → lần tới 2026-11-24T07:00:00.000Z  TZ tiến trình = UTC";
const MA_BT = "// bt.service.ts — LỜI GIẢI bài tập 9.2: lỗi không làm rò trạng thái, lượt chồng bị bỏ qua có ghi log, khoá theo lượt\nimport { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';\nimport { Cron } from '@nestjs/schedule';\nimport { Redis } from 'ioredis';\n\n@Injectable()\nexport class DonDepSua implements OnApplicationShutdown {\n  private log = new Logger(`DonDep#${process.pid}`);\n  private r = new Redis(process.env.REDIS_URL!);\n  private dangChay = false;\n\n  @Cron('*/2 * * * * *', { name: 'don-dep' })\n  async donDep() {\n    if (this.dangChay) { this.log.warn('lượt trước chưa xong — bỏ lượt này'); return; }\n    const tick = Math.floor(Date.now() / 2000) * 2;\n    if (!(await this.r.set(`nst:khoa:don-dep:${tick}`, String(process.pid), 'PX', 60_000, 'NX'))) return;\n    this.dangChay = true;\n    const dang = await this.r.incr('nst:dang-chay');\n    try {\n      this.log.log(`lượt ${tick % 100}: bắt đầu (đang chạy cùng lúc: ${dang})`);\n      if (process.env.NEM) throw new Error('DB mất kết nối');\n      await new Promise((ok) => setTimeout(ok, Number(process.env.VIEC_MS ?? 200)));\n    } catch (e) {\n      this.log.error(`lượt ${tick % 100} hỏng: ${(e as Error).message}`);   // tự ghi log có ngữ cảnh; báo động ở đây\n    } finally {\n      await this.r.decr('nst:dang-chay');\n      this.dangChay = false;\n    }\n  }\n  onApplicationShutdown() { return this.r.quit(); }\n}";
const OUT_BTNEM = "$ redis-cli GET nst:dang-chay\n0\n—— log bản 1\n[Nest] LOG [DonDep#3017504] lượt 56: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] ERROR [DonDep#3017504] lượt 56 hỏng: DB mất kết nối\n[Nest] LOG [DonDep#3017504] lượt 58: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] ERROR [DonDep#3017504] lượt 58 hỏng: DB mất kết nối\n[Nest] LOG [DonDep#3017504] lượt 60: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] ERROR [DonDep#3017504] lượt 60 hỏng: DB mất kết nối\n[Nest] LOG [DonDep#3017504] lượt 62: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] ERROR [DonDep#3017504] lượt 62 hỏng: DB mất kết nối";
const OUT_BTCHEO = "$ redis-cli GET nst:dang-chay\n1\n—— log bản 1\n[Nest] LOG [DonDep#3042913] lượt 64: bắt đầu (đang chạy cùng lúc: 1)\n[Nest] WARN [DonDep#3042913] lượt trước chưa xong — bỏ lượt này\n[Nest] WARN [DonDep#3042913] lượt trước chưa xong — bỏ lượt này\n[Nest] LOG [DonDep#3042913] lượt 70: bắt đầu (đang chạy cùng lúc: 1)";

export default {
  title: '9.2 — Scheduling with @nestjs/schedule: cron, intervals, and running once across replicas|||9.2 — Hẹn giờ với @nestjs/schedule: cron, interval, và chạy đúng một lần khi có nhiều bản',
  slug: 'nst-9-2-schedule',
  type: 'LESSON',
  isFreePreview: true,
  description: '@Cron, @Interval, @Timeout và SchedulerRegistry; rồi đo thật cái bẫy lớn nhất: ba bản ứng dụng ⇒ mỗi lượt chạy ba lần. Hai cách sửa chạy thật: khoá Redis theo lượt và job scheduler của BullMQ (ba bản, mỗi lượt đúng một job). Kèm lượt chạy chồng nhau và waitForCompletion, lỗi trong cron chỉ được ghi log và làm rò trạng thái, cron không đặt timeZone chạy lệch 7 giờ trong container UTC.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>9.2 — Scheduled work: easy to write, easy to run three times</h2>
<p class="lead">The booking system needs work that nobody triggers: expire PENDING bookings whose start time has passed, delete old refresh tokens, send a daily report at 7 am. <code>@nestjs/schedule</code> makes that one decorator. The decorator runs in <em>every</em> process that loads the module — and production runs several. This lesson measures that, then fixes it two ways. Scheduling concepts in general are in Node.js 13.4.</p>

<h3>Everyday analogy: one alarm, three phones</h3>
<p>Set the same "take medicine" alarm on your phone, your tablet and your watch, and you may take three doses. Each device is right on its own; the problem is that none of them knows about the others. Replicas of an app are those three devices.</p>

<h3>1. Three decorators and a registry</h3>
<pre><code class="language-ts">${esc(MA_DONDEP)}</code></pre>
<pre><code class="language-ts">${esc(MA_LICH)}</code></pre>
<div class="out">${esc(OUT_MOT)}</div>
<ul>
<li>Six-field cron (<code>*/2 * * * * *</code>) has seconds first; five fields start at minutes. <code>CronExpression.EVERY_5_MINUTES</code> and friends avoid typos.</li>
<li><code>SchedulerRegistry</code> lists jobs, reads <code>nextDate()</code>, stops or adds jobs at runtime — useful for an admin "pause cleanup" switch. A <code>@Timeout</code> without a name gets a random UUID, so name everything you may need to find.</li>
<li>Import <code>ScheduleModule.forRoot()</code> once. Leaving it out of a test module is the simplest way to stop crons in tests.</li>
</ul>

<h3>2. Three replicas ⇒ three runs per tick</h3>
<p>Three processes on ports 41921–41923, the way three pods behind a load balancer run. Each run increments a counter keyed by the tick:</p>
<div class="out">${esc(OUT_BA)}</div>
<p>Every tick ran three times, often concurrently ("đang chạy cùng lúc: 3"). For "expire old bookings" that is harmless (an UPDATE is idempotent). For "send the daily report", "charge monthly fees" or "export to the ministry" it is three reports, three charges, three exports.</p>

<h3>3. Fix 1 — a Redis lock per tick</h3>
<p>With <code>CACH=khoa</code> every replica tries <code>SET nst:khoa:don-dep:&lt;tick&gt; NX PX 60000</code>; only the first succeeds:</p>
<div class="out">${esc(OUT_BAKHOA)}</div>
<p>One run per tick, spread across whichever replica wins. Limits: the key is the tick computed from each machine's clock, so replicas with clocks skewed by more than the interval disagree; and if the winner crashes, that tick is simply skipped. For cleanup jobs that is usually acceptable.</p>

<h3>4. Fix 2 — let BullMQ own the schedule</h3>
<pre><code class="language-ts">${esc(MA_BAOTRI)}</code></pre>
<div class="out">${esc(OUT_BABULL)}</div>
<p>All three processes called <code>upsertJobScheduler('don-dep', …)</code>, yet Redis holds one scheduler. Each tick produces one job whose id contains the scheduled time (<code>repeat:don-dep:1795484852000</code>), and only one worker can take it. You also get what <code>@Cron</code> lacks: retries (<code>attempts</code>), a history of runs, a failed list to inspect, and the job runs in the worker role, not in API pods. This is the default for work that must not run twice. A third option — import <code>ScheduleModule</code> only in a single "cron" replica — works until someone scales that deployment to 2.</p>

<h3>5. A slow run and the next tick</h3>
<p>The cleanup takes 4.5 s; the cron fires every 2 s:</p>
<div class="out">${esc(OUT_CHEO)}</div>
<p>By default the cron library starts the next run while the previous one is still going — three copies at once in one process. <code>waitForCompletion: true</code> skips ticks while a run is active:</p>
<div class="out">${esc(OUT_CHEOWAIT)}</div>

<h3>6. An error in a cron is a log line, nothing more</h3>
<div class="out">${esc(OUT_NEM)}</div>
<p>Nest catches the error and logs <code>[Scheduler] Error</code>; the process lives on; there is no retry and no alert. And the "running" counter went 1 → 2 → 3 although nothing was running: the decrement after the failed line never happened. State changed at the start of a run must be restored in <code>finally</code> (exercise below), and failures need your own alert — or a BullMQ job, whose failures are recorded.</p>

<h3>7. "7 am" in which time zone?</h3>
<pre><code class="language-js">${esc(MA_TZ)}</code></pre>
<div class="out">${esc(OUT_TZ)}</div>
<p>Without <code>timeZone</code>, the cron uses the process time zone. Your laptop is in Vietnam; the <code>node:22-alpine</code> container is UTC — so "7 am" fires at 14:00 Vietnam time in production. Always set <code>timeZone: 'Asia/Ho_Chi_Minh'</code> (or <code>tz</code> in BullMQ). A misspelled zone throws "Invalid timezone" when the job is created, so the app fails at startup — loud, which is good.</p>

<h3>⚠️ Real incident: a date that does not exist (Windows Azure, 29/02/2012)</h3>
<p>Microsoft's post-incident summary: the Azure guest agent created a transfer certificate valid "one year from today". On 29 February 2012 that meant 29 February 2013 — a date that does not exist — so certificate creation failed. It started at 00:00 UTC on 29 February (4 pm PST on the 28th), new virtual machines could not initialise, and Microsoft restored service management for most customers only at 05:23 PST — more than 13 hours later. Scheduled and date-based code fails on calendar edges: leap days, month ends, time-zone and daylight-saving changes, and "now" read from a machine in another zone. Test those dates with a fake clock (the project's <code>Clock</code> since Chapter 2) instead of trusting the day you wrote the code.</p>

<h3>🧪 Exercise (15 min) — a cron that fails safely</h3>
<p>Rewrite <code>donDep()</code> so that: an error does not leak the "running" counter; a run that is still going makes the next tick skip with a warning; replicas still run each tick once. Run it with <code>NEM=1</code> and with <code>VIEC_MS=4500</code>.</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BTNEM)}</div>
<div class="out">${esc(OUT_BTCHEO)}</div>
<p>In the second run the counter is 1 at the end because the process was killed mid-run — a counter in Redis cannot know that its owner died. That is why locks are keys with a TTL, not counters.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>You deploy three replicas with a @Cron. What happens?</strong> It runs three times per tick. Use a lock per tick, a BullMQ job scheduler, or run schedules in exactly one dedicated process.</li>
<li><strong>Why prefer a BullMQ job scheduler over @Cron for important work?</strong> One schedule for all replicas, one job per tick, retries, failure history, runs on workers.</li>
<li><strong>A cron job runs longer than its interval. Then?</strong> Runs overlap by default; use <code>waitForCompletion</code> or a lock, and make the work idempotent.</li>
<li><strong>Your 7 am job runs at 2 pm. Why?</strong> No <code>timeZone</code>; the container is UTC.</li>
</ol>

<h3>💼 On the job</h3>
<p>A common OJT ticket: "the nightly export sometimes appears twice". Check the replica count of the deployment first — it was 1 when the cron was written and 3 after the autoscaler was added. Then check whether the export file name contains the date (idempotent: the second run overwrites) or a timestamp (the second run creates a duplicate). The fix is a job scheduler plus an idempotent output, and a test with a fake clock on the last day of February.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@Cron / @Interval / @Timeout</span><span class="v">Run on a cron pattern / every N ms / once after N ms.</span></div>
  <div class="kv"><span class="k">SchedulerRegistry</span><span class="v">Find, stop, add scheduled jobs at runtime by name.</span></div>
  <div class="kv"><span class="k">waitForCompletion</span><span class="v">Skip ticks while the previous run is still active.</span></div>
  <div class="kv"><span class="k">Lock per tick</span><span class="v">SET key-of-this-tick NX PX — first replica wins the tick.</span></div>
  <div class="kv"><span class="k">Job scheduler (BullMQ)</span><span class="v">One schedule stored in Redis; each tick creates one job.</span></div>
  <div class="kv"><span class="k">timeZone / tz</span><span class="v">Zone in which the pattern is read; default is the process zone.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>@nestjs/schedule</code> runs in every process that loads it: N replicas ⇒ N runs.</li>
<li>Run once: a Redis lock per tick (simple), or a BullMQ job scheduler (retries, history — the default for important work).</li>
<li>Overlapping runs are on by default; <code>waitForCompletion</code> or a lock stops them.</li>
<li>Errors are only logged: restore state in <code>finally</code>, alert yourself.</li>
<li>Always set the time zone; test calendar edges with a fake clock.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>9.2 — Việc hẹn giờ: viết thì dễ, chạy ba lần cũng dễ</h2>
<p class="lead">Hệ thống đặt lịch cần những việc không ai bấm: chuyển lịch PENDING đã quá giờ sang hết hạn, xoá refresh token cũ, gửi báo cáo lúc 7 giờ sáng. <code>@nestjs/schedule</code> biến việc đó thành một decorator. Decorator ấy chạy ở <em>mọi</em> tiến trình nạp module — và production chạy nhiều tiến trình. Bài này đo điều đó, rồi sửa bằng hai cách. Khái niệm lập lịch nói chung có ở Node.js 13.4.</p>

<h3>Liên hệ đời thường: một báo thức, ba thiết bị</h3>
<p>Đặt cùng một báo thức "uống thuốc" trên điện thoại, máy tính bảng và đồng hồ, bạn có thể uống ba liều. Từng thiết bị đều đúng; vấn đề là không cái nào biết cái kia. Các bản của một ứng dụng chính là ba thiết bị đó.</p>

<h3>1. Ba decorator và một sổ đăng ký</h3>
<pre><code class="language-ts">${esc(MA_DONDEP)}</code></pre>
<pre><code class="language-ts">${esc(MA_LICH)}</code></pre>
<div class="out">${esc(OUT_MOT)}</div>
<ul>
<li>Cron sáu trường (<code>*/2 * * * * *</code>) có giây đứng đầu; loại năm trường bắt đầu từ phút. Dùng <code>CronExpression.EVERY_5_MINUTES</code> và các hằng tương tự để khỏi gõ nhầm.</li>
<li><code>SchedulerRegistry</code> liệt kê job, đọc <code>nextDate()</code>, dừng hoặc thêm job lúc đang chạy — hữu ích cho nút "tạm dừng dọn dẹp" của admin. <code>@Timeout</code> không đặt tên sẽ nhận một UUID ngẫu nhiên, nên hãy đặt tên mọi thứ bạn có thể cần tìm.</li>
<li>Import <code>ScheduleModule.forRoot()</code> đúng một lần. Không đưa nó vào module test là cách đơn giản nhất để cron không chạy trong test.</li>
</ul>

<h3>2. Ba bản ⇒ mỗi lượt chạy ba lần</h3>
<p>Ba tiến trình ở cổng 41921–41923, giống ba pod sau bộ cân bằng tải. Mỗi lần chạy tăng một bộ đếm có khoá là mốc lượt:</p>
<div class="out">${esc(OUT_BA)}</div>
<p>Lượt nào cũng chạy ba lần, thường là cùng lúc ("đang chạy cùng lúc: 3"). Với "chuyển lịch quá hạn" thì vô hại (một câu UPDATE là idempotent). Với "gửi báo cáo hằng ngày", "thu phí hằng tháng" hay "xuất dữ liệu cho Bộ" thì là ba báo cáo, ba lần thu tiền, ba lần xuất.</p>

<h3>3. Cách 1 — khoá Redis theo từng lượt</h3>
<p>Với <code>CACH=khoa</code>, bản nào cũng thử <code>SET nst:khoa:don-dep:&lt;mốc&gt; NX PX 60000</code>; chỉ bản đầu tiên thành công:</p>
<div class="out">${esc(OUT_BAKHOA)}</div>
<p>Mỗi lượt một lần, rơi vào bản nào giành được. Giới hạn: khoá là mốc lượt tính theo đồng hồ của từng máy, nên các bản lệch giờ nhau quá một chu kỳ sẽ bất đồng; và bản thắng mà sập thì lượt đó bị bỏ luôn. Với việc dọn dẹp, điều này thường chấp nhận được.</p>

<h3>4. Cách 2 — để BullMQ giữ lịch</h3>
<pre><code class="language-ts">${esc(MA_BAOTRI)}</code></pre>
<div class="out">${esc(OUT_BABULL)}</div>
<p>Cả ba tiến trình đều gọi <code>upsertJobScheduler('don-dep', …)</code>, nhưng Redis chỉ giữ một lịch. Mỗi lượt sinh một job có id chứa giờ hẹn (<code>repeat:don-dep:1795484852000</code>), và chỉ một worker lấy được nó. Bạn còn có những thứ <code>@Cron</code> không có: thử lại (<code>attempts</code>), lịch sử các lần chạy, danh sách job hỏng để xem, và job chạy ở vai worker chứ không trong pod API. Đây là lựa chọn mặc định cho việc không được chạy hai lần. Cách thứ ba — chỉ import <code>ScheduleModule</code> ở một bản "cron" riêng — chạy được cho tới ngày ai đó tăng bản đó lên 2.</p>

<h3>5. Lượt chạy chậm và lượt kế tiếp</h3>
<p>Việc dọn mất 4,5 giây; cron chạy mỗi 2 giây:</p>
<div class="out">${esc(OUT_CHEO)}</div>
<p>Mặc định, thư viện cron khởi động lượt mới khi lượt trước vẫn đang chạy — ba bản cùng lúc ngay trong một tiến trình. <code>waitForCompletion: true</code> bỏ qua các lượt tới khi lượt đang chạy xong:</p>
<div class="out">${esc(OUT_CHEOWAIT)}</div>

<h3>6. Lỗi trong cron chỉ là một dòng log</h3>
<div class="out">${esc(OUT_NEM)}</div>
<p>Nest bắt lỗi và ghi <code>[Scheduler] Error</code>; tiến trình vẫn sống; không thử lại, không báo động. Và bộ đếm "đang chạy" tăng 1 → 2 → 3 dù chẳng có gì đang chạy: dòng giảm bộ đếm nằm sau dòng ném lỗi nên không bao giờ chạy. Trạng thái thay đổi lúc bắt đầu lượt phải được trả lại trong <code>finally</code> (bài tập bên dưới), và lỗi cần báo động của riêng bạn — hoặc dùng job BullMQ, nơi lỗi được ghi lại.</p>

<h3>7. "7 giờ sáng" theo múi giờ nào?</h3>
<pre><code class="language-js">${esc(MA_TZ)}</code></pre>
<div class="out">${esc(OUT_TZ)}</div>
<p>Không đặt <code>timeZone</code> thì cron theo múi giờ của tiến trình. Máy bạn ở Việt Nam; container <code>node:22-alpine</code> chạy UTC — nên "7 giờ sáng" ở production chạy lúc 14 giờ giờ Việt Nam. Luôn đặt <code>timeZone: 'Asia/Ho_Chi_Minh'</code> (hoặc <code>tz</code> trong BullMQ). Gõ sai tên múi giờ thì job ném "Invalid timezone" ngay lúc tạo, ứng dụng hỏng từ lúc khởi động — ồn ào, và như thế là tốt.</p>

<h3>⚠️ Sự cố thật: một ngày không tồn tại (Windows Azure, 29/02/2012)</h3>
<p>Theo bản tổng kết sự cố của Microsoft: tác tử khách của Azure tạo chứng chỉ truyền có hạn "một năm kể từ hôm nay". Ngày 29/02/2012, "một năm sau" là 29/02/2013 — một ngày không tồn tại — nên tạo chứng chỉ thất bại. Lỗi bắt đầu lúc 00:00 UTC ngày 29/02 (16 giờ ngày 28 theo giờ PST), máy ảo mới không khởi tạo được, và tới 05:23 giờ PST — hơn 13 giờ sau — Microsoft mới khôi phục quản lý dịch vụ cho phần lớn khách hàng. Mã hẹn giờ và mã tính ngày hỏng ở mép lịch: ngày nhuận, cuối tháng, đổi múi giờ và giờ mùa hè, "bây giờ" đọc từ một máy ở múi giờ khác. Hãy test các ngày đó bằng đồng hồ giả (<code>Clock</code> của dự án từ Chương 2) thay vì tin vào ngày bạn viết mã.</p>

<h3>🧪 Thực hành (15 phút) — cron hỏng một cách an toàn</h3>
<p>Viết lại <code>donDep()</code> sao cho: lỗi không làm rò bộ đếm "đang chạy"; lượt đang chạy dở thì lượt kế bỏ qua kèm cảnh báo; nhiều bản vẫn chỉ chạy mỗi lượt một lần. Chạy với <code>NEM=1</code> và với <code>VIEC_MS=4500</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BTNEM)}</div>
<div class="out">${esc(OUT_BTCHEO)}</div>
<p>Ở lần chạy thứ hai, bộ đếm cuối cùng là 1 vì tiến trình bị giết giữa lượt — bộ đếm trong Redis không thể biết chủ của nó đã chết. Vì vậy khoá là một khoá có TTL, không phải bộ đếm.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Deploy ba bản có một @Cron thì sao?</strong> Mỗi lượt chạy ba lần. Dùng khoá theo lượt, job scheduler của BullMQ, hoặc chạy lịch ở đúng một tiến trình riêng.</li>
<li><strong>Vì sao việc quan trọng nên dùng job scheduler của BullMQ thay cho @Cron?</strong> Một lịch cho mọi bản, mỗi lượt một job, có thử lại, có lịch sử lỗi, chạy trên worker.</li>
<li><strong>Cron chạy lâu hơn chu kỳ của nó thì sao?</strong> Mặc định các lượt chồng lên nhau; dùng <code>waitForCompletion</code> hoặc khoá, và làm việc đó idempotent.</li>
<li><strong>Job 7 giờ sáng lại chạy lúc 14 giờ. Vì sao?</strong> Không đặt <code>timeZone</code>; container chạy UTC.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Một ticket hay gặp khi OJT: "bản xuất dữ liệu ban đêm thỉnh thoảng xuất hiện hai lần". Xem số bản của deployment trước — lúc viết cron là 1, sau khi thêm tự co giãn là 3. Rồi xem tên tệp xuất chứa ngày (idempotent: lần hai ghi đè) hay chứa dấu thời gian (lần hai tạo bản trùng). Cách sửa là job scheduler cộng đầu ra idempotent, kèm một test dùng đồng hồ giả vào ngày cuối tháng Hai.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@Cron / @Interval / @Timeout</span><span class="v">Chạy theo mẫu cron / mỗi N ms / một lần sau N ms.</span></div>
  <div class="kv"><span class="k">SchedulerRegistry</span><span class="v">Tìm, dừng, thêm việc hẹn giờ theo tên lúc đang chạy.</span></div>
  <div class="kv"><span class="k">waitForCompletion</span><span class="v">Bỏ qua các lượt khi lượt trước còn đang chạy.</span></div>
  <div class="kv"><span class="k">Khoá theo lượt</span><span class="v">SET khoá-của-lượt NX PX — bản đầu tiên giành được lượt.</span></div>
  <div class="kv"><span class="k">Job scheduler (BullMQ)</span><span class="v">Một lịch lưu trong Redis; mỗi lượt tạo một job.</span></div>
  <div class="kv"><span class="k">timeZone / tz</span><span class="v">Múi giờ để đọc mẫu cron; mặc định là múi giờ tiến trình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>@nestjs/schedule</code> chạy ở mọi tiến trình nạp nó: N bản ⇒ N lần.</li>
<li>Chạy một lần: khoá Redis theo lượt (đơn giản), hoặc job scheduler của BullMQ (thử lại, lịch sử — mặc định cho việc quan trọng).</li>
<li>Lượt chồng nhau là mặc định; <code>waitForCompletion</code> hoặc khoá sẽ chặn.</li>
<li>Lỗi chỉ được ghi log: trả trạng thái trong <code>finally</code>, tự báo động.</li>
<li>Luôn đặt múi giờ; test mép lịch bằng đồng hồ giả.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
