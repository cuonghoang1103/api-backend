/**
 * 9.3 — Sự kiện với @nestjs/event-emitter: tách module trong một ứng dụng (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/event-emitter 12.0.3 / eventemitter2 6.4.9, PostgreSQL 16.16 nst-pg, Redis 7.4.12):
 * scratchpad/nst/lab/c9/app/src/b93 + b93.sh (co-ban [CHO, KHONG_ASYNC], truoc-commit, giet, som [SOM=2], DEM_LOI [NO_SUPPRESS]) ⇒ lab/c9/o/93-*.txt;
 * đã đọc event-subscribers.loader.js (wrapFunctionInTryCatchBlocks, suppressErrors mặc định true). Ghép: gen.mjs rồi ghep.sh 93 nst-9-3-events.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-6-2-transaction', title: 'NestJS 6.2 — Transaction xuyên service', sub: 'Mục 4 của bài này là mặt trái: việc bên ngoài DB không rollback được.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-1-bullmq', title: 'NestJS 9.1 — Hàng đợi với @nestjs/bullmq', sub: 'Khi sự kiện phải sống qua lúc sập: chuyển sang job.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-13-1-vi-sao-hang-doi', title: 'Node.js 13.1 — Request không phải chỗ làm việc nặng', sub: 'Cái gì nên vào hàng đợi, cái gì không.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Events', 'EventEmitterModule.forRoot, @OnEvent (async, suppressErrors, prependListener), wildcard, EventEmitterReadinessWatcher.', 'https://docs.nestjs.com/techniques/events'),
  nguon('📘', 'microservices.io — Pattern: Transactional outbox', 'Ghi thông điệp vào bảng outbox trong cùng transaction, tiến trình khác chuyển đi sau.', 'https://microservices.io/patterns/data/transactional-outbox.html'),
].join('\n');
const MA_SUKIEN = "// su-kien.ts — sự kiện là một lớp: tên + dữ liệu có kiểu, cả hai phía cùng import\nexport class BookingApproved {\n  static readonly TEN = 'booking.approved';\n  constructor(readonly bookingId: number, readonly to: string) {}\n}";
const MA_SVC = "import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';\nimport { EventEmitter2 } from '@nestjs/event-emitter';\nimport pg from 'pg';\nimport { BookingApproved } from './su-kien.js';\n\n@Injectable()\nexport class BookingsService implements OnModuleInit, OnApplicationBootstrap {\n  private log = new Logger('BookingsService');\n  readonly pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 });\n  constructor(private readonly events: EventEmitter2) {}\n\n  onModuleInit() {          // thí nghiệm: phát sự kiện quá sớm\n    if (process.env.SOM === '1') this.log.warn(`emit trong onModuleInit trả về ${this.events.emit(BookingApproved.TEN, new BookingApproved(1, 'som@fpt.edu.vn'))}`);\n  }\n  onApplicationBootstrap() {\n    if (process.env.SOM === '2') this.log.warn(`emit trong onApplicationBootstrap trả về ${this.events.emit(BookingApproved.TEN, new BookingApproved(2, 'som@fpt.edu.vn'))}`);\n  }\n\n  async approve(id: number) {\n    const t0 = performance.now();\n    const c = await this.pool.connect();\n    try {\n      await c.query('BEGIN');\n      await c.query(`UPDATE bookings SET status = 'APPROVED' WHERE id = $1`, [id]);\n      const ev = new BookingApproved(id, `sv${id}@fpt.edu.vn`);\n      if (process.env.CHO) await this.events.emitAsync(BookingApproved.TEN, ev);   // chờ mọi listener xong\n      else this.events.emit(BookingApproved.TEN, ev);                              // phát rồi đi tiếp\n      // việc tiếp theo trong cùng transaction — id 13 vi phạm ràng buộc để mô phỏng lỗi sau khi đã phát\n      await c.query(`INSERT INTO audit(booking_id, action) VALUES ($1, 'approve')`, [id]);\n      await c.query('COMMIT');\n    } catch (e) {\n      await c.query('ROLLBACK');\n      throw e;\n    } finally {\n      c.release();\n      this.log.log(`approve(${id}) trả về sau ${(performance.now() - t0).toFixed(0)} ms`);\n    }\n    return { id, status: 'APPROVED' };\n  }\n}";
const MA_LIS = "import { Injectable, Logger } from '@nestjs/common';\nimport { OnEvent } from '@nestjs/event-emitter';\nimport { Redis } from 'ioredis';\nimport pg from 'pg';\nimport { BookingApproved } from './su-kien.js';\n\nconst SUPPRESS = !process.env.NO_SUPPRESS;\n\n@Injectable()   // module thông báo: không import gì từ module đặt lịch ngoài lớp sự kiện\nexport class ThongBaoListener {\n  private log = new Logger('ThongBaoListener');\n  private r = new Redis(process.env.REDIS_URL!);\n  private pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });\n\n  @OnEvent(BookingApproved.TEN, { async: !process.env.KHONG_ASYNC, suppressErrors: SUPPRESS })\n  async guiEmail(e: BookingApproved) {\n    await new Promise((ok) => setTimeout(ok, Number(process.env.MAIL_MS ?? 300)));    // gọi SMTP\n    if (process.env.MAIL_LOI) throw new Error('SMTP 421');\n    const { rows } = await this.pool.query('SELECT status FROM bookings WHERE id = $1', [e.bookingId]);\n    await this.r.rpush('nst:hopthu', `${e.to} | Lịch #${e.bookingId} đã được duyệt (DB lúc gửi: ${rows[0]?.status ?? '—'})`);\n    this.log.log(`đã gửi email cho lịch #${e.bookingId}`);\n  }\n}\n\n@Injectable()\nexport class ThongKeListener {\n  private log = new Logger('ThongKeListener');\n  @OnEvent('booking.*', { suppressErrors: SUPPRESS })   // wildcard — cần EventEmitterModule.forRoot({ wildcard: true })\n  dem(e: BookingApproved) {\n    if (process.env.DEM_LOI) throw new Error('bộ đếm hỏng');\n    this.log.log(`+1 lượt duyệt (lịch #${e.bookingId})`);\n  }\n}";
const MA_MOD = "import { Controller, Module, Param, ParseIntPipe, Patch } from '@nestjs/common';\nimport { EventEmitterModule } from '@nestjs/event-emitter';\nimport { BookingsService } from './bookings.service.js';\nimport { ThongBaoListener, ThongKeListener } from './listeners.js';\nimport { BookingsServiceSua } from './bt.service.js';\n\n@Controller('bookings')\nclass BookingsController {\n  constructor(private readonly s: BookingsService) {}\n  @Patch(':id/approve') approve(@Param('id', ParseIntPipe) id: number) { return this.s.approve(id); }\n}\n\n@Module({\n  imports: [EventEmitterModule.forRoot({ wildcard: true })],\n  controllers: [BookingsController],\n  providers: [process.env.BT ? { provide: BookingsService, useClass: BookingsServiceSua } : BookingsService, ThongBaoListener, ThongKeListener],\n})\nexport class AppModule93 {}";
const OUT_COBAN = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.023983s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: APPROVED)\n—— log tiến trình 1\npid 335734 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [BookingsService] approve(7) trả về sau 17 ms\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";
const OUT_CHO = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.026205s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: APPROVED)\n—— log tiến trình 1\npid 347297 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [BookingsService] approve(7) trả về sau 19 ms\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";
const OUT_CHOSYNC = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.333243s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: PENDING)\n—— log tiến trình 1\npid 395527 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7\n[Nest] LOG [BookingsService] approve(7) trả về sau 325 ms";
const OUT_SYNC = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.025068s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: APPROVED)\n—— log tiến trình 1\npid 402930 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [BookingsService] approve(7) trả về sau 17 ms\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";
const OUT_TRUOC = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/13/approve\n{\"statusCode\":500,\"message\":\"Internal server error\"} (500, 0.021795s)\n$ psql -c \"SELECT id, status FROM bookings WHERE id = 13\"\n id | status  \n----+---------\n 13 | PENDING\n(1 row)\n\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv13@fpt.edu.vn | Lịch #13 đã được duyệt (DB lúc gửi: PENDING)\n—— log tiến trình 1\npid 403463 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #13)\n[Nest] LOG [BookingsService] approve(13) trả về sau 15 ms\n[Nest] ERROR [ExceptionsHandler] error: new row for relation \"audit\" violates check constraint \"audit_booking_id_check\"\n    at /home/sv/app/node_modules/pg/lib/client.js:694:17\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async BookingsService.approve (file:///home/sv/app/dist/b93/bookings.service.js:36:13)\n    at async file:///home/sv/app/node_modules/@nestjs/core/router/router-execution-context.js:117:62\n    at async BookingsController.approve (file:///home/sv/app/node_modules/@nestjs/core/router/router-proxy.js:6:17) {\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #13";
const OUT_GIET = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.019219s)\n$ kill -9 <pid>\n$ psql -c \"SELECT id, status FROM bookings WHERE id = 7\"\n id |  status  \n----+----------\n  7 | APPROVED\n(1 row)\n\n$ redis-cli LLEN nst:hopthu\n0\n—— log tiến trình 1\npid 403794 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [BookingsService] approve(7) trả về sau 13 ms\n—— log tiến trình 2\npid 403839 sẵn sàng";
const OUT_SOM = "$ redis-cli LRANGE nst:hopthu 0 -1\n\n—— log tiến trình 1\n[Nest] WARN [BookingsService] emit trong onModuleInit trả về false\npid 462370 sẵn sàng";
const OUT_SOM2 = "$ redis-cli LRANGE nst:hopthu 0 -1\nsom@fpt.edu.vn | Lịch #2 đã được duyệt (DB lúc gửi: PENDING)\n—— log tiến trình 1\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #2)\n[Nest] WARN [BookingsService] emit trong onApplicationBootstrap trả về true\npid 470493 sẵn sàng\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #2";
const MA_BT = "// bt.service.ts — LỜI GIẢI bài tập 9.3: chỉ phát sự kiện SAU khi COMMIT thành công\nimport { Injectable, Logger } from '@nestjs/common';\nimport { EventEmitter2 } from '@nestjs/event-emitter';\nimport pg from 'pg';\nimport { BookingApproved } from './su-kien.js';\n\n@Injectable()\nexport class BookingsServiceSua {\n  private log = new Logger('BookingsServiceSua');\n  readonly pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 });\n  constructor(private readonly events: EventEmitter2) {}\n\n  async approve(id: number) {\n    const c = await this.pool.connect();\n    const sauCommit: BookingApproved[] = [];               // gom sự kiện, chưa phát\n    try {\n      await c.query('BEGIN');\n      await c.query(`UPDATE bookings SET status = 'APPROVED' WHERE id = $1`, [id]);\n      sauCommit.push(new BookingApproved(id, `sv${id}@fpt.edu.vn`));\n      await c.query(`INSERT INTO audit(booking_id, action) VALUES ($1, 'approve')`, [id]);\n      await c.query('COMMIT');\n    } catch (e) {\n      await c.query('ROLLBACK');                           // rollback ⇒ sự kiện bị bỏ cùng dữ liệu\n      throw e;\n    } finally {\n      c.release();\n    }\n    for (const ev of sauCommit) this.events.emit(BookingApproved.TEN, ev);   // dữ liệu đã bền ⇒ mới báo\n    this.log.log(`approve(${id}) xong, đã phát ${sauCommit.length} sự kiện`);\n    return { id, status: 'APPROVED' };\n  }\n}";
const OUT_BT = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/13/approve\n{\"statusCode\":500,\"message\":\"Internal server error\"} (500, 0.030923s)\n$ psql -c \"SELECT id, status FROM bookings WHERE id = 13\"\n id | status  \n----+---------\n 13 | PENDING\n(1 row)\n\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n—— log tiến trình 1\npid 3541126 sẵn sàng\n[Nest] ERROR [ExceptionsHandler] error: new row for relation \"audit\" violates check constraint \"audit_booking_id_check\"\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.039137s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: APPROVED)\n—— log tiến trình 1\npid 3551854 sẵn sàng\n[Nest] LOG [ThongKeListener] +1 lượt duyệt (lịch #7)\n[Nest] LOG [BookingsServiceSua] approve(7) xong, đã phát 1 sự kiện\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";
const OUT_LOI = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"id\":7,\"status\":\"APPROVED\"} (200, 0.021728s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: APPROVED)\n—— log tiến trình 1\npid 475694 sẵn sàng\n[Nest] ERROR [Event] bộ đếm hỏng\nError: bộ đếm hỏng\n    at ThongKeListener.dem (file:///home/sv/app/dist/b93/listeners.js:43:19)\n    at EventSubscribersLoader.wrapFunctionInTryCatchBlocks (file:///home/sv/app/node_modules/@nestjs/event-emitter/dist/event-subscribers.loader.js:151:46)\n    at EventEmitter.<anonymous> (file:///home/sv/app/node_modules/@nestjs/event-emitter/dist/event-subscribers.loader.js:84:61)\n    at EventEmitter.emit (/home/sv/app/node_modules/eventemitter2/lib/eventemitter2.js:1041:22)\n    at BookingsService.approve (file:///home/sv/app/dist/b93/bookings.service.js:39:29)\n[Nest] LOG [BookingsService] approve(7) trả về sau 15 ms\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";
const OUT_LOINO = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n (000, 0.029697s)\n$ redis-cli LRANGE nst:hopthu 0 -1\n\n—— log tiến trình 1\npid 475939 sẵn sàng\nfile:///home/sv/app/dist/b93/listeners.js:43\n            throw new Error('bộ đếm hỏng');\n                  ^\n\nError: bộ đếm hỏng\n    at ThongKeListener.dem (file:///home/sv/app/dist/b93/listeners.js:43:19)\n    at EventSubscribersLoader.wrapFunctionInTryCatchBlocks (file:///home/sv/app/node_modules/@nestjs/event-emitter/dist/event-subscribers.loader.js:151:46)\n    at EventEmitter.<anonymous> (file:///home/sv/app/node_modules/@nestjs/event-emitter/dist/event-subscribers.loader.js:84:61)\n    at EventEmitter.emit (/home/sv/app/node_modules/eventemitter2/lib/eventemitter2.js:1041:22)\n    at BookingsService.approve (file:///home/sv/app/dist/b93/bookings.service.js:39:29)\n\nNode.js v22.22.2";
const OUT_LOINOCHO = "$ curl -s -w ' (%{http_code}, %{time_total}s)' -X PATCH localhost:41931/bookings/7/approve\n{\"statusCode\":500,\"message\":\"Internal server error\"} (500, 0.020674s)\n$ redis-cli LRANGE nst:hopthu 0 -1\nsv7@fpt.edu.vn | Lịch #7 đã được duyệt (DB lúc gửi: PENDING)\n—— log tiến trình 1\npid 477097 sẵn sàng\n[Nest] LOG [BookingsService] approve(7) trả về sau 13 ms\n[Nest] ERROR [ExceptionsHandler] Error: bộ đếm hỏng\n[Nest] LOG [ThongBaoListener] đã gửi email cho lịch #7";

export default {
  title: '9.3 — Events with @nestjs/event-emitter: decoupling modules inside one app|||9.3 — Sự kiện với @nestjs/event-emitter: tách module trong một ứng dụng',
  slug: 'nst-9-3-events',
  type: 'LESSON',
  isFreePreview: true,
  description: 'EventEmitterModule, lớp sự kiện, @OnEvent và wildcard để module đặt lịch không phải biết module thông báo. Đo thật: emit với emitAsync, và {async: true} làm emitAsync không chờ; lỗi listener bị nuốt mặc định, còn suppressErrors: false với emit() làm sập cả tiến trình; phát trước commit ⇒ email "đã duyệt" cho lịch bị rollback; phát trong onModuleInit ⇒ mất; kill -9 ⇒ mất. Khi nào chuyển sang hàng đợi, outbox ở mức nhận biết.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>9.3 — In-process events: a cheap way to decouple, with sharp edges</h2>
<p class="lead">After approval, three things should happen: an email, a statistics counter, later a realtime update (Chapter 10). If <code>BookingsService</code> calls all three, the booking module depends on every module that cares about bookings. An event inverts that: the booking module announces "booking approved" and does not know who listens. <code>@nestjs/event-emitter</code> does this inside one process, in memory. This lesson shows the wiring, then measures what "in memory" costs.</p>

<h3>Everyday analogy: the school loudspeaker</h3>
<p>The office announces "class 10A1 moves to room 201". Whoever cares acts; the office does not phone each teacher. But a loudspeaker has no memory: a teacher out of the room misses it, and if the power cuts mid-sentence, nobody hears the rest. A queue is a noticeboard — the message stays until someone takes it.</p>

<h3>1. Wiring: an event class, an emitter, listeners</h3>
<pre><code class="language-ts">${esc(MA_SUKIEN)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_LIS)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li>An event <strong>class</strong> gives the name and the payload one type that both sides import; a string typo becomes a compile error.</li>
<li><code>@OnEvent('booking.*')</code> needs <code>forRoot({ wildcard: true })</code>; the delimiter is <code>.</code>.</li>
<li>Listeners are providers, discovered at startup, with normal DI. The email listener queries the database with its own pool — note the "DB lúc gửi" (status at send time) column, it matters below.</li>
</ul>

<h3>2. emit, emitAsync, and the option that cancels waiting</h3>
<table>
<tr><th>Call</th><th>Listener</th><th>Request time</th><th>Status seen by listener</th></tr>
<tr><td><code>emit</code></td><td><code>{ async: true }</code></td><td>17 ms</td><td>APPROVED</td></tr>
<tr><td><code>emitAsync</code></td><td><code>{ async: true }</code></td><td>19 ms — did not wait</td><td>APPROVED</td></tr>
<tr><td><code>emitAsync</code></td><td>no <code>async</code></td><td>325 ms — waited</td><td><strong>PENDING</strong></td></tr>
<tr><td><code>emit</code></td><td>no <code>async</code></td><td>17 ms</td><td>APPROVED</td></tr>
</table>
<div class="out">${esc(OUT_CHO)}</div>
<div class="out">${esc(OUT_CHOSYNC)}</div>
<p>Two measured surprises. <code>{ async: true }</code> makes EventEmitter2 call the listener on a later tick, so <code>emitAsync</code> has nothing to wait for — choose one: either you wait (<code>emitAsync</code>, no <code>async</code>), or you fire and forget. And when the service waits, the listener runs <em>inside</em> the open transaction, reads with another connection, and sees PENDING: the email said "approved" before the approval existed for anyone else.</p>

<h3>3. Errors in listeners: swallowed, or fatal</h3>
<p><code>@nestjs/event-emitter</code> wraps every listener in an async try/catch. With the default <code>suppressErrors: true</code>, a thrown error is logged and the request carries on:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>Set <code>suppressErrors: false</code> to "see the errors" and keep using <code>emit()</code>:</p>
<div class="out">${esc(OUT_LOINO)}</div>
<p>The whole process died (<code>curl</code> got no response, code 000). The wrapper is async, so its rethrow becomes a rejected promise that <code>emit()</code> never awaits — an unhandled rejection, which ends a Node 22 process. Every request in flight on that pod died with it. <code>suppressErrors: false</code> is only safe with <code>emitAsync</code>, where the caller receives the error:</p>
<div class="out">${esc(OUT_LOINOCHO)}</div>
<p>The request got 500 and the transaction rolled back — yet the other listener had already sent "approved". Listeners are not part of your transaction.</p>

<h3>4. Emitting before commit</h3>
<p>Booking 13 violates a constraint in the step <em>after</em> <code>emit</code>:</p>
<div class="out">${esc(OUT_TRUOC)}</div>
<p>500, the booking is still PENDING, and the student has an email saying it was approved. Rule: emit after the data is durable. Inside a Prisma interactive transaction or a CLS <code>@Transactional</code> (6.2), collect events and emit them after commit (exercise).</p>

<h3>5. Emitting too early</h3>
<div class="out">${esc(OUT_SOM)}</div>
<div class="out">${esc(OUT_SOM2)}</div>
<p><code>emit</code> in <code>onModuleInit</code> returns <code>false</code> — no listener yet — and the event is gone without an error. Listeners are attached in the event module's <code>onApplicationBootstrap</code>, which runs before yours because your module imports it. Emit from <code>onApplicationBootstrap</code> or later, or await <code>EventEmitterReadinessWatcher.waitUntilReady()</code>.</p>

<h3>6. A crash loses everything in flight</h3>
<div class="out">${esc(OUT_GIET)}</div>
<p>The approval is committed; the email listener was waiting on SMTP when the process was killed; after restart there is no trace that an email was owed. Nothing to retry, nothing to inspect.</p>

<h3>7. Event, queue or outbox?</h3>
<table>
<tr><th></th><th>Event (in memory)</th><th>Queue (BullMQ)</th><th>Outbox</th></tr>
<tr><td>Survives a crash</td><td>no</td><td>after add() returns</td><td>yes — same transaction as the data</td></tr>
<tr><td>Retries, history</td><td>no</td><td>yes</td><td>via the relay + queue</td></tr>
<tr><td>Crosses processes</td><td>no</td><td>yes</td><td>yes</td></tr>
<tr><td>Use for</td><td>cheap side effects you can lose: counters, cache invalidation, logs; decoupling modules</td><td>emails, payments, calls to other systems</td><td>when "data saved but message lost" is unacceptable</td></tr>
</table>
<p><strong>Outbox, at recognition level:</strong> in the same transaction that approves the booking, insert a row into an <code>outbox</code> table; a separate relay reads unsent rows, publishes them (queue, broker), and marks them sent. Commit ⇒ the message exists; rollback ⇒ it never existed. The project uses a light version in 9.5: the database is the truth, and a scheduled sweep re-enqueues approvals that have no email recorded. A common combination is an event for decoupling whose listener only does <code>queue.add()</code> — fast, and the job survives.</p>

<h3>🧪 Exercise (15 min) — emit only after commit</h3>
<p>Rewrite <code>approve()</code> so that booking 13 (rollback) sends no email, and booking 7 still sends exactly one with the status APPROVED visible to the listener.</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>First run: booking 13 — 500, PENDING, empty mailbox. Second run: booking 7 — 200 and one email that read APPROVED. The remaining gap: a crash between COMMIT and <code>emit</code> still loses the event; closing that gap is what an outbox is for.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>When do you use EventEmitter and when a queue?</strong> Events to decouple modules for side effects you can lose; a queue when the work must survive a crash, retry, or run elsewhere.</li>
<li><strong>emit vs emitAsync?</strong> <code>emit</code> returns immediately; <code>emitAsync</code> awaits listeners (unless they are registered with <code>async: true</code>) and passes their errors to the caller.</li>
<li><strong>Why can an event listener send an email for data that was rolled back?</strong> It was emitted inside the transaction; side effects outside the DB do not roll back. Emit after commit or use an outbox.</li>
<li><strong>What is the transactional outbox pattern?</strong> Write the message to an outbox table in the same transaction as the data; a relay publishes it afterwards; gives at-least-once publishing with no lost messages.</li>
</ol>

<h3>💼 On the job</h3>
<p>In a code review you see <code>@OnEvent('order.paid', { suppressErrors: false })</code> with <code>this.events.emit(...)</code> — the author wanted errors to be visible. Comment with the measurement from section 3: one failing listener kills the pod and every request on it. Suggest <code>emitAsync</code> with handling at the call site, or keep the default and alert from the listener. Reviews that cite a reproducible measurement get accepted much faster than "I think this is risky".</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EventEmitter2</span><span class="v">The emitter behind @nestjs/event-emitter; in-process, in-memory.</span></div>
  <div class="kv"><span class="k">@OnEvent(name, options)</span><span class="v">Marks a provider method as a listener; options async, suppressErrors, prependListener.</span></div>
  <div class="kv"><span class="k">emitAsync</span><span class="v">Emit and await the listeners' promises.</span></div>
  <div class="kv"><span class="k">suppressErrors</span><span class="v">Default true: listener errors are logged and swallowed.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">Message row written in the data's transaction, published later by a relay.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Events decouple modules: the emitter does not know its listeners; use an event class for name + payload.</li>
<li><code>{ async: true }</code> listeners are never awaited, even by <code>emitAsync</code>.</li>
<li>Default: listener errors are swallowed. <code>suppressErrors: false</code> + <code>emit()</code> crashes the process.</li>
<li>Emit after commit and after bootstrap; in-memory events die with the process.</li>
<li>Must not be lost ⇒ queue (and an outbox or sweep when "saved but not sent" is unacceptable).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>9.3 — Sự kiện trong tiến trình: cách tách module rẻ tiền, nhưng có cạnh sắc</h2>
<p class="lead">Sau khi duyệt, ba việc cần xảy ra: gửi email, tăng bộ đếm thống kê, sau này còn cập nhật thời gian thực (Chương 10). Nếu <code>BookingsService</code> tự gọi cả ba, module đặt lịch phụ thuộc vào mọi module quan tâm tới lịch. Sự kiện đảo chiều phụ thuộc: module đặt lịch thông báo "lịch đã duyệt" mà không cần biết ai nghe. <code>@nestjs/event-emitter</code> làm việc đó trong một tiến trình, trên bộ nhớ. Bài này nối dây, rồi đo cái giá của "trên bộ nhớ".</p>

<h3>Liên hệ đời thường: loa phát thanh của trường</h3>
<p>Văn phòng phát loa "lớp 10A1 chuyển sang phòng 201". Ai liên quan thì làm; văn phòng không gọi từng thầy cô. Nhưng loa không có trí nhớ: thầy cô đang ra ngoài là lỡ, và mất điện giữa câu thì không ai nghe phần còn lại. Hàng đợi là bảng tin — thông báo nằm đó cho tới khi có người gỡ.</p>

<h3>1. Nối dây: một lớp sự kiện, một bên phát, các bên nghe</h3>
<pre><code class="language-ts">${esc(MA_SUKIEN)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_LIS)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li>Dùng <strong>lớp</strong> sự kiện để tên và dữ liệu có chung một kiểu mà hai phía cùng import; gõ sai tên thành lỗi biên dịch.</li>
<li><code>@OnEvent('booking.*')</code> cần <code>forRoot({ wildcard: true })</code>; dấu phân cách là <code>.</code>.</li>
<li>Listener là provider, được tìm ra lúc khởi động, có DI bình thường. Listener email đọc DB bằng pool riêng — để ý cột "DB lúc gửi", phần dưới sẽ cần.</li>
</ul>

<h3>2. emit, emitAsync, và tuỳ chọn làm mất việc chờ</h3>
<table>
<tr><th>Lời gọi</th><th>Listener</th><th>Thời gian request</th><th>Trạng thái listener thấy</th></tr>
<tr><td><code>emit</code></td><td><code>{ async: true }</code></td><td>17 ms</td><td>APPROVED</td></tr>
<tr><td><code>emitAsync</code></td><td><code>{ async: true }</code></td><td>19 ms — không chờ</td><td>APPROVED</td></tr>
<tr><td><code>emitAsync</code></td><td>không <code>async</code></td><td>325 ms — có chờ</td><td><strong>PENDING</strong></td></tr>
<tr><td><code>emit</code></td><td>không <code>async</code></td><td>17 ms</td><td>APPROVED</td></tr>
</table>
<div class="out">${esc(OUT_CHO)}</div>
<div class="out">${esc(OUT_CHOSYNC)}</div>
<p>Hai bất ngờ đo được. <code>{ async: true }</code> khiến EventEmitter2 gọi listener ở một lượt sau, nên <code>emitAsync</code> chẳng có gì để chờ — hãy chọn một: hoặc chờ (<code>emitAsync</code>, không <code>async</code>), hoặc phát rồi quên. Và khi service chờ, listener chạy <em>bên trong</em> transaction đang mở, đọc bằng kết nối khác và thấy PENDING: email đã báo "đã duyệt" trước khi việc duyệt tồn tại với bất kỳ ai khác.</p>

<h3>3. Lỗi trong listener: bị nuốt, hoặc chết người</h3>
<p><code>@nestjs/event-emitter</code> bọc mọi listener trong một try/catch bất đồng bộ. Với mặc định <code>suppressErrors: true</code>, lỗi ném ra được ghi log và request đi tiếp:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>Đặt <code>suppressErrors: false</code> cho "thấy được lỗi" mà vẫn dùng <code>emit()</code>:</p>
<div class="out">${esc(OUT_LOINO)}</div>
<p>Cả tiến trình chết (<code>curl</code> không nhận được trả lời, mã 000). Lớp bọc là hàm async, nên lệnh ném lại của nó thành một promise bị từ chối mà <code>emit()</code> không bao giờ chờ — unhandled rejection, thứ kết liễu tiến trình Node 22. Mọi request đang chạy trên pod đó chết theo. <code>suppressErrors: false</code> chỉ an toàn với <code>emitAsync</code>, nơi bên gọi nhận được lỗi:</p>
<div class="out">${esc(OUT_LOINOCHO)}</div>
<p>Request nhận 500 và transaction rollback — vậy mà listener kia đã gửi "đã duyệt". Listener không nằm trong transaction của bạn.</p>

<h3>4. Phát trước khi commit</h3>
<p>Lịch 13 vi phạm một ràng buộc ở bước <em>sau</em> <code>emit</code>:</p>
<div class="out">${esc(OUT_TRUOC)}</div>
<p>500, lịch vẫn PENDING, còn sinh viên có email báo đã duyệt. Luật: chỉ phát khi dữ liệu đã bền. Trong transaction tương tác của Prisma hay <code>@Transactional</code> của CLS (6.2), gom sự kiện lại và phát sau khi commit (bài tập).</p>

<h3>5. Phát quá sớm</h3>
<div class="out">${esc(OUT_SOM)}</div>
<div class="out">${esc(OUT_SOM2)}</div>
<p><code>emit</code> trong <code>onModuleInit</code> trả <code>false</code> — chưa có listener — và sự kiện biến mất không một lỗi. Listener được gắn ở <code>onApplicationBootstrap</code> của module sự kiện, chạy trước của bạn vì module bạn import nó. Hãy phát từ <code>onApplicationBootstrap</code> trở đi, hoặc chờ <code>EventEmitterReadinessWatcher.waitUntilReady()</code>.</p>

<h3>6. Sập là mất mọi thứ đang dở</h3>
<div class="out">${esc(OUT_GIET)}</div>
<p>Việc duyệt đã commit; listener email đang chờ SMTP thì tiến trình bị giết; khởi động lại không còn dấu vết nào là đang nợ một email. Không có gì để thử lại, không có gì để xem.</p>

<h3>7. Sự kiện, hàng đợi hay outbox?</h3>
<table>
<tr><th></th><th>Sự kiện (bộ nhớ)</th><th>Hàng đợi (BullMQ)</th><th>Outbox</th></tr>
<tr><td>Sống qua lúc sập</td><td>không</td><td>kể từ khi add() trả về</td><td>có — cùng transaction với dữ liệu</td></tr>
<tr><td>Thử lại, lịch sử</td><td>không</td><td>có</td><td>qua relay + hàng đợi</td></tr>
<tr><td>Đi qua tiến trình khác</td><td>không</td><td>có</td><td>có</td></tr>
<tr><td>Dùng cho</td><td>tác dụng phụ rẻ, mất cũng được: bộ đếm, xoá cache, log; tách module</td><td>email, thanh toán, gọi hệ thống khác</td><td>khi "đã lưu mà mất thông điệp" là không chấp nhận được</td></tr>
</table>
<p><strong>Outbox, ở mức nhận biết:</strong> trong cùng transaction duyệt lịch, chèn một dòng vào bảng <code>outbox</code>; một relay riêng đọc các dòng chưa gửi, đẩy đi (hàng đợi, broker) rồi đánh dấu đã gửi. Commit ⇒ thông điệp tồn tại; rollback ⇒ nó chưa từng có. Dự án dùng bản nhẹ ở 9.5: DB là sự thật, một job hẹn giờ quét lại các lịch đã duyệt mà chưa ghi nhận email. Cách kết hợp hay gặp: sự kiện để tách module, còn listener chỉ làm <code>queue.add()</code> — nhanh, và job sống sót.</p>

<h3>🧪 Thực hành (15 phút) — chỉ phát sau khi commit</h3>
<p>Viết lại <code>approve()</code> để lịch 13 (rollback) không gửi email nào, còn lịch 7 vẫn gửi đúng một email và listener thấy trạng thái APPROVED.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Lần chạy đầu: lịch 13 — 500, PENDING, hộp thư trống. Lần thứ hai: lịch 7 — 200 và một email đọc được APPROVED. Khe hở còn lại: sập giữa COMMIT và <code>emit</code> vẫn mất sự kiện; bịt khe đó chính là việc của outbox.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Khi nào dùng EventEmitter, khi nào dùng hàng đợi?</strong> Sự kiện để tách module cho tác dụng phụ mất cũng được; hàng đợi khi việc phải sống qua lúc sập, cần thử lại, hoặc chạy ở nơi khác.</li>
<li><strong>emit khác emitAsync thế nào?</strong> <code>emit</code> trả về ngay; <code>emitAsync</code> chờ các listener (trừ khi chúng đăng ký <code>async: true</code>) và chuyển lỗi của chúng về bên gọi.</li>
<li><strong>Vì sao listener có thể gửi email cho dữ liệu đã rollback?</strong> Nó được phát bên trong transaction; tác dụng phụ ngoài DB không rollback. Phát sau commit hoặc dùng outbox.</li>
<li><strong>Transactional outbox là gì?</strong> Ghi thông điệp vào bảng outbox trong cùng transaction với dữ liệu; relay đẩy đi sau; phát ít nhất một lần, không mất thông điệp.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Khi review mã, bạn thấy <code>@OnEvent('order.paid', { suppressErrors: false })</code> đi với <code>this.events.emit(...)</code> — tác giả muốn lỗi hiện ra. Hãy bình luận kèm phép đo ở mục 3: một listener lỗi giết cả pod cùng mọi request trên đó. Đề xuất <code>emitAsync</code> và xử lý ở chỗ gọi, hoặc giữ mặc định và báo động từ trong listener. Bình luận review có kèm phép đo tái hiện được sẽ được nhận nhanh hơn nhiều so với "em thấy chỗ này rủi ro".</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EventEmitter2</span><span class="v">Bộ phát đứng sau @nestjs/event-emitter; trong tiến trình, trên bộ nhớ.</span></div>
  <div class="kv"><span class="k">@OnEvent(tên, tuỳ chọn)</span><span class="v">Đánh dấu phương thức của provider là listener; tuỳ chọn async, suppressErrors, prependListener.</span></div>
  <div class="kv"><span class="k">emitAsync</span><span class="v">Phát và chờ promise của các listener.</span></div>
  <div class="kv"><span class="k">suppressErrors</span><span class="v">Mặc định true: lỗi listener được ghi log rồi nuốt.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">Dòng thông điệp ghi trong transaction của dữ liệu, relay đẩy đi sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sự kiện tách module: bên phát không biết bên nghe; dùng lớp sự kiện cho tên + dữ liệu.</li>
<li>Listener <code>{ async: true }</code> không bao giờ được chờ, kể cả bởi <code>emitAsync</code>.</li>
<li>Mặc định lỗi listener bị nuốt. <code>suppressErrors: false</code> + <code>emit()</code> làm sập tiến trình.</li>
<li>Phát sau commit và sau bootstrap; sự kiện trên bộ nhớ chết cùng tiến trình.</li>
<li>Không được mất ⇒ hàng đợi (thêm outbox hoặc quét bù khi "đã lưu mà chưa gửi" là không chấp nhận được).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
