/**
 * 10.6 — Mốc dự án 10: một tính năng thời gian thực trong lab-booking (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/websockets 12.6.0, socket.io 4.8.4, @socket.io/redis-adapter 8.3.0, @nestjs/throttler 6.8.0,
 * Prisma 7.10.1, PostgreSQL 16.16 nst-pg, Redis 7.4 nst-redis, Vitest 4.1.12): scratchpad/nst/lab/c10/moc10 (sao từ c9/moc9, 42 test xanh trước khi sửa).
 * Lần 1: 4/5 test mới đỏ (hết giờ) — APP_GUARD JwtAuthGuard chạy cho message WebSocket; sau đó ThrottlerGuard đếm mọi socket chung khoá "undefined".
 * Cuối: 47/47 xanh (o10db.sh moc10-xanh), xem10.sh = hai bản API thật 41993/41994. Ghép: gen.mjs rồi ghep.sh 106 nst-10-6-moc-du-an.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-9-5-moc-du-an', title: 'NestJS 9.5 — Mốc dự án 9', sub: 'Điểm xuất phát: 42 test, sự kiện BookingStatusChanged, Redis, API/worker tách.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-5-throttler-helmet', title: 'NestJS 7.5 — Throttler và Helmet', sub: 'Nơi ThrottlerGuard toàn cục được thêm — mốc này phát hiện nó cũng đếm message socket.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Đề dự án lab-booking', sub: 'Yêu cầu "một tính năng thời gian thực" và rubric.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Guards: binding guards (global)', 'useGlobalGuards/APP_GUARD áp cho mọi controller và mọi handler — gồm cả gateway.', 'https://docs.nestjs.com/guards'),
  nguon('📘', 'NestJS docs — Execution context: getType()', "ctx.getType() trả 'http' | 'ws' | 'rpc' — cách một enhancer dùng chung biết mình đang ở đâu.", 'https://docs.nestjs.com/fundamentals/execution-context'),
].join('\n');
const MA_SVC = "      const moi = await this.db.booking.create({ data: {\n        roomId: b.roomId, userId: u.id, studentId: u.studentCode, start: s, end: e, attendees: b.attendees, note: b.note, createdBy: `user:${u.id}`,\n      } });\n      // mốc 10: phát SAU khi INSERT đã commit; emit() đồng bộ, listener realtime tự nuốt lỗi (suppressErrors mặc định)\n      this.events.emit(BookingSlotChanged.TEN, new BookingSlotChanged(moi.roomId, moi.id, moi.start, moi.end, moi.status));\n      return moi;\n  // …\n    } catch (err) {\n      this.log.warn(`lịch ${id} đã ${status} nhưng xếp hàng thông báo hỏng: ${(err as Error).message} — chờ quét bù`);\n    }\n    this.events.emit(BookingSlotChanged.TEN, new BookingSlotChanged(b.roomId, id, b.start, b.end, status));   // mốc 10\n    return { ...b, status, version: b.version + 1 };\n  }";
const MA_JWTG = "import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { JwtService } from '@nestjs/jwt';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport { Public } from './decorators.js';\n\n/** Guard toàn cục #1: ai đang gọi. Đọc vai trò HIỆN TẠI từ DB (1 truy vấn theo khoá chính) và so tokenVersion (bài 7.3). */\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  private readonly log = new Logger(JwtAuthGuard.name);\n  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector, private readonly db: PrismaService) {}\n  async canActivate(ctx: ExecutionContext) {\n    // mốc 10: APP_GUARD chạy cho MỌI ngữ cảnh, kể cả message WebSocket ⇒ chỉ lo HTTP; socket đã xác thực lúc bắt tay (WsAuth)\n    if (ctx.getType() !== 'http') return true;\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const req = ctx.switchToHttp().getRequest();\n    const token = /^Bearer (\\S+)$/.exec(req.headers.authorization ?? '')?.[1];\n    if (!token) throw new UnauthorizedException('Thiếu Bearer token');\n    let p: { sub: string; ver: number };\n    try { p = await this.jwt.verifyAsync(token); } catch (e) {\n      this.log.warn(`token bị từ chối: ${(e as Error).message}`);\n      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');\n    }\n    const u = await this.db.user.findUnique({ where: { id: Number(p.sub) }, select: { id: true, role: true, studentCode: true, tokenVersion: true } });\n    if (!u || u.tokenVersion !== p.ver) throw new UnauthorizedException('Phiên đã bị thu hồi');\n    req.user = { id: u.id, role: u.role, studentCode: u.studentCode };\n    return true;\n  }\n}";
const MA_MAIN = "import { ganRedisAdapter } from './realtime/redis-io.adapter.js';\n  // …\n  cauHinhApp(app);                                  // body limit, trust proxy, shutdown hooks — test e2e gọi đúng hàm này\n  await ganRedisAdapter(app, c.get('REDIS_URL', { infer: true }));   // mốc 10: nhiều bản API cùng phát cho mọi socket";
const MA_APPM = "import { RealtimeModule } from './realtime/realtime.module.js';\n  // …\n    RealtimeModule,                      // mốc 10: bảng tình trạng phòng qua WebSocket\n  // …\n    { provide: APP_GUARD, useClass: HttpThrottlerGuard },   // đếm trước (kể cả request không token); mốc 10: chỉ HTTP";
const MA_ENV = "  // mốc 10: trang web nào được mở WebSocket (CORS không chặn transport websocket ⇒ gateway tự kiểm Origin)\n  WS_ORIGINS: z.string().default('http://localhost:5173').transform((s) => s.split(',').map((x) => x.trim())),";
const MA_TAO = "// tao-app.ts — dựng ứng dụng cho test e2e GIỐNG production: cùng AppModule, cùng cauHinhApp(); chỉ thay đồng hồ (và thứ gì truyền vào)\nimport { Test, type TestingModuleBuilder } from '@nestjs/testing';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { Clock } from '../common/clock.module.js';\nimport { cauHinhApp } from '../setup-app.js';\n\nexport async function taoApp(dongHo: { now(): Date } = { now: () => new Date('2026-12-01T00:00:00Z') }, sua: (b: TestingModuleBuilder) => TestingModuleBuilder = (b) => b,\n                             truocInit: (app: NestExpressApplication) => Promise<void> = async () => {}) {   // mốc 10: gắn adapter WS trước init\n  const { AppModule } = await import('../app.module.js');\n  const m = await sua(Test.createTestingModule({ imports: [AppModule] }).overrideProvider(Clock).useValue(dongHo)).compile();\n  const app = cauHinhApp(m.createNestApplication<NestExpressApplication>({ logger: false }));\n  await truocInit(app);\n  await app.init();\n  return app;\n}";
const MA_MOD = "import { Module } from '@nestjs/common';\nimport { AvailabilityGateway } from './availability.gateway.js';\nimport { RealtimeListener } from './realtime.listener.js';\nimport { WsAuth } from './ws-auth.js';\n\n@Module({ providers: [WsAuth, AvailabilityGateway, RealtimeListener] })\nexport class RealtimeModule {}";
const MA_EV = "// booking.events.ts — sự kiện của module đặt lịch. Module khác nghe tên này, không import BookingsService.\nexport class BookingStatusChanged {\n  static readonly TEN = 'booking.status-changed';\n  constructor(readonly bookingId: number, readonly status: string, readonly start: Date) {}\n}\n\n/** mốc 10: khung giờ của một phòng đổi trạng thái — CHỈ dữ liệu ai xem phòng cũng được thấy (không người đặt, không ghi chú) */\nexport class BookingSlotChanged {\n  static readonly TEN = 'booking.slot-changed';\n  constructor(readonly roomId: number, readonly bookingId: number, readonly start: Date, readonly end: Date, readonly status: string) {}\n}";
const MA_AUTH = "// ws-auth.ts — xác thực socket MỘT lần, lúc bắt tay, bằng cùng luật với JwtAuthGuard (chữ ký + tokenVersion trong DB)\nimport { Injectable } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport type { Socket } from 'socket.io';\nimport type { CurrentUserT } from '../auth/decorators.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\n\n@Injectable()\nexport class WsAuth {\n  constructor(private readonly jwt: JwtService, private readonly db: PrismaService) {}\n\n  /** Middleware của Socket.IO: gọi next(err) ⇒ client nhận connect_error, KHÔNG có giây nào ở trạng thái đã nối */\n  middleware() {\n    return (client: Socket, next: (err?: Error) => void) => {\n      this.xacThuc(String(client.handshake.auth?.token ?? '')).then(\n        ({ user, exp }) => { client.data.user = user; client.data.exp = exp; next(); },\n        () => next(new Error('unauthorized')),\n      );\n    };\n  }\n\n  private async xacThuc(token: string): Promise<{ user: CurrentUserT; exp: number }> {\n    const p = await this.jwt.verifyAsync<{ sub: string; ver: number; exp: number }>(token);\n    const u = await this.db.user.findUnique({ where: { id: Number(p.sub) }, select: { id: true, role: true, studentCode: true, tokenVersion: true } });\n    if (!u || u.tokenVersion !== p.ver) throw new Error('phiên đã bị thu hồi');\n    return { user: { id: u.id, role: u.role, studentCode: u.studentCode }, exp: p.exp };\n  }\n}";
const MA_GW = "// availability.gateway.ts — bảng tình trạng phòng: ai đã đăng nhập cũng xem được khung giờ trống/bận của một phòng\nimport { Logger } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport {\n  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer,\n} from '@nestjs/websockets';\nimport type { IncomingMessage } from 'node:http';\nimport type { Server, Socket } from 'socket.io';\nimport type { Env } from '../config/env.schema.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport { WsAuth } from './ws-auth.js';\n\nexport type SlotDto = { roomId: number; bookingId: number; start: string; end: string; status: string };\nexport const phongWs = (roomId: number) => `room:${roomId}`;\nlet ORIGINS: string[] = [];                              // decorator đọc lúc nạp lớp ⇒ giá trị đặt ở afterInit\n\n@WebSocketGateway({\n  cors: { origin: (o: string | undefined, cb: (e: Error | null, ok?: boolean) => void) => cb(null, !!o && ORIGINS.includes(o)) },\n  allowRequest: (req: IncomingMessage, cb: (e: string | null, ok: boolean) => void) => cb(null, ORIGINS.includes(req.headers.origin ?? '')),\n})\nexport class AvailabilityGateway implements OnGatewayInit, OnGatewayConnection {\n  @WebSocketServer() server: Server;\n  private readonly log = new Logger(AvailabilityGateway.name);\n  constructor(private readonly auth: WsAuth, private readonly db: PrismaService, private readonly c: ConfigService<Env, true>) {}\n\n  afterInit(server: Server) {\n    ORIGINS = this.c.get('WS_ORIGINS', { infer: true });\n    server.use(this.auth.middleware());\n  }\n\n  handleConnection(client: Socket) {\n    const ms = client.data.exp * 1000 - Date.now();      // access token 15 phút ⇒ hết hạn thì ngắt; client tự lấy token mới rồi nối lại\n    const t = setTimeout(() => client.disconnect(true), ms);\n    client.once('disconnect', () => clearTimeout(t));\n  }\n\n  @SubscribeMessage('watch-room')\n  async watch(@MessageBody() roomId: unknown, @ConnectedSocket() client: Socket) {\n    if (!Number.isInteger(roomId) || !(await this.db.room.findUnique({ where: { id: roomId as number }, select: { id: true } }))) {\n      return { ok: false, error: 'ROOM_NOT_FOUND' };     // lỗi nghiệp vụ trả trong ack — client không phải chờ hết giờ\n    }\n    for (const r of client.rooms) if (r.startsWith('room:')) void client.leave(r);\n    void client.join(phongWs(roomId as number));\n    const ds = await this.db.booking.findMany({\n      where: { roomId: roomId as number, status: { in: ['PENDING', 'APPROVED'] } }, orderBy: { start: 'asc' },\n      select: { id: true, roomId: true, start: true, end: true, status: true },        // select hẹp: không userId/note\n    });\n    return { ok: true, slots: ds.map((b): SlotDto => ({ roomId: b.roomId, bookingId: b.id, start: b.start.toISOString(), end: b.end.toISOString(), status: b.status })) };\n  }\n\n  phat(s: SlotDto) { this.server?.to(phongWs(s.roomId)).emit('slot', s); }   // server rỗng trong tiến trình worker (không HTTP)\n}";
const MA_LIS = "import { Injectable } from '@nestjs/common';\nimport { OnEvent } from '@nestjs/event-emitter';\nimport { BookingSlotChanged } from '../bookings/booking.events.js';\nimport { AvailabilityGateway } from './availability.gateway.js';\n\n/** Module đặt lịch không biết có WebSocket — nó chỉ phát sự kiện; module realtime nghe và đẩy ra socket */\n@Injectable()\nexport class RealtimeListener {\n  constructor(private readonly gw: AvailabilityGateway) {}\n  @OnEvent(BookingSlotChanged.TEN)\n  khiDoi(e: BookingSlotChanged) {\n    this.gw.phat({ roomId: e.roomId, bookingId: e.bookingId, start: e.start.toISOString(), end: e.end.toISOString(), status: e.status });\n  }\n}";
const MA_THR = "// http-throttler.guard.ts — mốc 10: ThrottlerGuard toàn cục cũng chạy cho message WebSocket; socket không có req.ip\n// ⇒ mọi socket của mọi người chung MỘT bộ đếm (khoá \"undefined\") ⇒ 100 tin/phút cho cả server. Chỉ đếm HTTP.\nimport { Injectable, type ExecutionContext } from '@nestjs/common';\nimport { ThrottlerGuard } from '@nestjs/throttler';\n\n@Injectable()\nexport class HttpThrottlerGuard extends ThrottlerGuard {\n  protected override async shouldSkip(ctx: ExecutionContext) { return ctx.getType() !== 'http'; }\n}";
const MA_TEST = "// moc10.e2e.spec.ts — mốc 10: bảng tình trạng phòng qua WebSocket. Socket.IO client thật nối vào app.listen(0).\nimport request from 'supertest';\nimport { io, type Socket } from 'socket.io-client';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { taoApp } from '../test/tao-app.js';\nimport { bearer } from '../test/auth.js';\nimport { ganRedisAdapter } from './redis-io.adapter.js';\nimport type { SlotDto } from './availability.gateway.js';\n\nconst ORIGIN = 'http://localhost:5173';\nlet app: NestExpressApplication, url: string;\nconst mo: Socket[] = [];\nbeforeAll(async () => { app = await taoApp(); await app.listen(0, '127.0.0.1'); url = await app.getUrl(); });\nafterEach(() => { mo.splice(0).forEach((s) => s.close()); });\nafterAll(async () => { await app.close(); });\n\nconst tokenCua = (a: NestExpressApplication, ai: 'an' | 'binh' | 'gv', ver = 0) => bearer(a, ai, ver).authorization.slice(7);\nfunction noi(u: string, token: string | undefined, origin = ORIGIN) {\n  const s = io(u, { transports: ['websocket'], reconnection: false, auth: token ? { token } : {}, extraHeaders: { Origin: origin } });\n  mo.push(s);\n  return s;\n}\nconst ketNoi = (s: Socket) => new Promise<string>((ok) => { s.on('connect', () => ok('connect')); s.on('connect_error', (e) => ok(`connect_error: ${e.message}`)); });\nconst nghe = (s: Socket) => { const ds: SlotDto[] = []; s.on('slot', (d) => ds.push(d)); return ds; };\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\nconst datLich = (a: NestExpressApplication, gio: string, roomId = 1) => request(a.getHttpServer()).post('/bookings').set(bearer(a, 'an'))\n  .send({ roomId, start: `2026-12-02T${gio}:00+07:00`, end: `2026-12-02T${gio.replace(/^\\d\\d/, (h) => String(+h + 1).padStart(2, '0'))}:00+07:00`, attendees: 5, note: 'mật: nhóm đồ án X' });\n\nit('từ chối lúc bắt tay: không token, phiên đã thu hồi (tokenVersion), Origin lạ', async () => {\n  expect(await ketNoi(noi(url, undefined))).toBe('connect_error: unauthorized');\n  expect(await ketNoi(noi(url, tokenCua(app, 'an', 1)))).toBe('connect_error: unauthorized');     // DB có tokenVersion 0\n  expect(await ketNoi(noi(url, tokenCua(app, 'an'), 'http://evil.example'))).toBe('connect_error: websocket error');\n  expect(await ketNoi(noi(url, tokenCua(app, 'an')))).toBe('connect');\n});\n\nit('watch-room: phòng có ⇒ ảnh chụp ban đầu; phòng không có ⇒ ack lỗi, không treo', async () => {\n  const id = (await datLich(app, '08').expect(201)).body.id;\n  const s = noi(url, tokenCua(app, 'binh')); await ketNoi(s);\n  const r = await s.emitWithAck('watch-room', 1);\n  expect(r.ok).toBe(true);\n  expect(r.slots).toContainEqual({ roomId: 1, bookingId: id, start: '2026-12-02T01:00:00.000Z', end: '2026-12-02T02:00:00.000Z', status: 'PENDING' });\n  expect(await s.timeout(500).emitWithAck('watch-room', 99)).toEqual({ ok: false, error: 'ROOM_NOT_FOUND' });\n  expect(await s.timeout(500).emitWithAck('watch-room', '1 OR 1=1')).toEqual({ ok: false, error: 'ROOM_NOT_FOUND' });\n});\n\nit('An đặt phòng 1 ⇒ Bình đang xem phòng 1 thấy ngay, KHÔNG thấy ai đặt/ghi chú; người xem phòng 2 không nhận gì', async () => {\n  const b = noi(url, tokenCua(app, 'binh')), g = noi(url, tokenCua(app, 'gv'));\n  await ketNoi(b); await ketNoi(g);\n  await b.emitWithAck('watch-room', 1); await g.emitWithAck('watch-room', 2);\n  const nb = nghe(b), ng = nghe(g);\n  const id = (await datLich(app, '10').expect(201)).body.id;\n  await ngu(200);\n  expect(nb).toEqual([{ roomId: 1, bookingId: id, start: '2026-12-02T03:00:00.000Z', end: '2026-12-02T04:00:00.000Z', status: 'PENDING' }]);\n  expect(ng).toEqual([]);\n});\n\nit('duyệt rồi huỷ ⇒ hai tin APPROVED, CANCELLED; đặt trùng (409) ⇒ không tin nào', async () => {\n  const b = noi(url, tokenCua(app, 'binh')); await ketNoi(b); await b.emitWithAck('watch-room', 1);\n  const id = (await datLich(app, '13').expect(201)).body.id;\n  await ngu(100);\n  const nb = nghe(b);\n  await datLich(app, '13').expect(409);\n  await request(app.getHttpServer()).patch(`/bookings/${id}/approve`).set(bearer(app, 'gv')).expect(200);\n  await request(app.getHttpServer()).delete(`/bookings/${id}`).set(bearer(app, 'an')).expect(200);\n  await ngu(200);\n  expect(nb.map((x) => [x.bookingId, x.status])).toEqual([[id, 'APPROVED'], [id, 'CANCELLED']]);\n});\n\nit('hai bản API dùng Redis adapter: đặt ở bản 1, socket nối vào bản 2 vẫn nhận', async () => {\n  const gan = (a: NestExpressApplication) => ganRedisAdapter(a, process.env.REDIS_URL!);\n  const [a1, a2] = [await taoApp(undefined, undefined, gan), await taoApp(undefined, undefined, gan)];\n  await a1.listen(0, '127.0.0.1'); await a2.listen(0, '127.0.0.1');\n  try {\n    const s = noi(await a2.getUrl(), tokenCua(a2, 'binh')); await ketNoi(s); await s.emitWithAck('watch-room', 1);\n    const ns = nghe(s);\n    const id = (await datLich(a1, '15').expect(201)).body.id;\n    await ngu(300);\n    expect(ns.map((x) => [x.bookingId, x.status])).toEqual([[id, 'PENDING']]);\n  } finally { await a1.close(); await a2.close(); }\n});";
const MA_CLIENT = "// xem10-client.mjs <url> <token> — một \"tab trình duyệt\": xem phòng 1, in mọi tin 'slot' trong 4 giây\nimport { io } from 'socket.io-client';\nconst s = io(process.argv[2], { transports: ['websocket'], auth: { token: process.argv[3] }, extraHeaders: { Origin: 'http://localhost:5173' } });\ns.on('connect_error', (e) => console.log('[tab] connect_error:', e.message));\ns.on('connect', async () => { const r = await s.emitWithAck('watch-room', 1); console.log(`[tab @${process.argv[2].slice(-5)}] watch-room 1 ⇒ ok=${r.ok}, ${r.slots.length} khung đang giữ`); });\ns.on('slot', (d) => console.log('[tab] slot:', JSON.stringify(d)));\nsetTimeout(() => process.exit(0), Number(process.argv[4] ?? 4000));";
const OUT_LAN1 = " RUN  v4.1.12 /home/sv/app\n ❯ |db| src/realtime/moc10.e2e.spec.ts (5 tests | 4 failed) 20807ms\n   ✓ từ chối lúc bắt tay: không token, phiên đã thu hồi (tokenVersion), Origin lạ 57ms\n   × watch-room: phòng có ⇒ ảnh chụp ban đầu; phòng không có ⇒ ack lỗi, không treo 5002ms\n   × An đặt phòng 1 ⇒ Bình đang xem phòng 1 thấy ngay, KHÔNG thấy ai đặt/ghi chú; người xem phòng 2 không nhận gì 5005ms\n   × duyệt rồi huỷ ⇒ hai tin APPROVED, CANCELLED; đặt trùng (409) ⇒ không tin nào 5002ms\n   × hai bản API dùng Redis adapter: đặt ở bản 1, socket nối vào bản 2 vẫn nhận 5007ms\nError: Test timed out in 5000ms.   (cả 4 test)\n      Tests  4 failed | 1 passed (5)";
const OUT_DEBUG = " RUN  v4.1.12 /home/sv/app\n[Nest] ERROR [WsExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'authorization')\n    at JwtAuthGuard.canActivate (/home/sv/app/src/auth/jwt-auth.guard.ts:15:53)\n    at GuardsConsumer.tryActivate (file:///home/sv/app/node_modules/@nestjs/core/guards/guards-consumer.js:13:34)\n    … (các khung gọi khác)\nEXCEPTION {\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"watch-room\",\"data\":1}}\n";
const OUT_THR = "EXCEPTION {\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"watch-room\",\"data\":1}}   (× 20)\nKQ {\"a\":50,\"b\":50,\"loi\":20}";
const OUT_THRSUA = "KQ {\"a\":60,\"b\":60,\"loi\":0}";
const OUT_XANH = " ✓ |unit| src/config/env.schema.spec.ts (5 tests) 24ms\n ✓ |db| src/bookings/bookings.service.db.spec.ts (3 tests) 968ms\n ✓ |db| src/bookings/dac-ta.e2e.spec.ts (6 tests) 1895ms\n ✓ |db| src/common/moc5.e2e.spec.ts (2 tests) 1024ms\n ✓ |db| src/common/pipeline.e2e.spec.ts (4 tests) 1043ms\n ✓ |db| src/notifications/moc9.e2e.spec.ts (4 tests) 1820ms\n ✓ |db| src/common/moc4.e2e.spec.ts (5 tests) 1111ms\n ✓ |db| src/common/moc6.e2e.spec.ts (3 tests) 1407ms\n ✓ |db| src/common/moc7.e2e.spec.ts (10 tests) 1908ms\n ✓ |db| src/realtime/moc10.e2e.spec.ts (5 tests) 2862ms\n Test Files  10 passed (10)\n      Tests  47 passed (47)";
const OUT_XEM = "$ node xem10-client.mjs http://127.0.0.1:41994 $TOKEN_GV &        # tab của cô Lan, nối vào BẢN 2\n[tab @41994] watch-room 1 ⇒ ok=true, 0 khung đang giữ\n$ node xem10-client.mjs http://127.0.0.1:41994 \"\"                 # tab không token\n[tab] connect_error: unauthorized\n$ curl -X POST localhost:41993/bookings …   # An đặt qua BẢN 1\n{\"id\":1,\"status\":\"PENDING\",\"roomId\":1}\n[tab] slot: {\"roomId\":1,\"bookingId\":1,\"start\":\"2026-12-10T01:00:00.000Z\",\"end\":\"2026-12-10T03:00:00.000Z\",\"status\":\"PENDING\"}\n$ curl -X POST … (cùng khung, lần 2)\n{\"type\":\"https://lab-booking.example/errors/BOOKING_CONFLICT\",\"title\":\"ConflictException\",\"status\":409,\"detail\":\"khung giờ đã có người đặt\",\"instance\":\"/bookings\",\"requestId\":\"82032deb-7ab6-4667-85a7-39832682e612\"}\n# log cảnh báo/lỗi hai bản:";
const OUT_ENV = " FAIL  |unit| src/config/env.schema.spec.ts > EnvSchema của lab-booking (mốc 5 → 9) > dev: mặc định đủ\nAssertionError: expected { NODE_ENV: 'development', …(14) } to deeply equal { NODE_ENV: 'development', …(13) }\n- Expected\n+ Received\n@@ -11,6 +11,9 @@\n    \"PORT\": 3000,\n    \"REDIS_URL\": \"redis://redis:6379\",\n    \"REFRESH_DAYS\": 14,\n    \"SWAGGER\": false,\n    \"TRUST_PROXY\": 0,\n+   \"WS_ORIGINS\": [\n+     \"http://localhost:5173\",\n+   ],\n  }\n Test Files  1 failed | 9 passed (10)\n      Tests  1 failed | 46 passed | 1 skipped (48)\n   Start at  09:42:50\n   Duration  6.15s (transform 1.65s, setup 7.20s, import 9.71s, tests 14.29s, environment 1ms)";
export default {
  title: '10.6 — Project milestone 10: one real-time feature in your project|||10.6 — Mốc dự án 10: một tính năng thời gian thực trong dự án',
  slug: 'nst-10-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thêm bảng tình trạng phòng trực tiếp vào lab-booking: module realtime nghe sự kiện của module đặt lịch, xác thực socket bằng cùng luật với JwtAuthGuard (chữ ký + tokenVersion), kiểm Origin, payload không lộ người đặt, Redis adapter cho nhiều bản API. Lần chạy đầu 4/5 test đỏ vì guard toàn cục (APP_GUARD) chạy cả cho message WebSocket; sửa xong lại thấy ThrottlerGuard đếm mọi socket chung một khoá. Cuối cùng 47/47 test xanh và hai bản API chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Milestone</span>
<h2>10.6 — Milestone 10: a live availability board in lab-booking</h2>
<p class="lead">The brief (0.2) asks for one real-time feature. In lab-booking it is the room board: while a student looks at room AL-201, slots appear, become approved or free again without a refresh. This milestone adds it to the project from 9.5 with everything from 10.1–10.5 — and the first test run uncovers two global enhancers that were never meant for sockets.</p>

<h3>Pass criteria</h3>
<ol>
<li>Handshake rejects: no token, a token whose <code>tokenVersion</code> was revoked, a foreign Origin.</li>
<li><code>watch-room</code> returns a snapshot; unknown room ⇒ <code>{ ok: false, error }</code> in the ack.</li>
<li>Create / approve / cancel ⇒ watchers of that room get <code>slot</code>; watchers of other rooms get nothing; a 409 produces nothing.</li>
<li>The payload contains no user id, student code or note.</li>
<li>Two API instances: a booking on one reaches a socket on the other.</li>
<li>All 42 tests from milestone 9 still pass.</li>
</ol>

<h3>Step 1 — configuration</h3>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>
<p>The schema test from milestone 5 pins every default, so it fails immediately — good, that is its job; update the expected object:</p>
<div class="out">${esc(OUT_ENV)}</div>

<h3>Step 2 — the booking module only announces</h3>
<p>A second event, separate from <code>BookingStatusChanged</code> (which carries data for emails): it holds only what anyone watching the room may see. It is emitted after the database write succeeded, with plain <code>emit</code> — the board is best effort; a failing listener must not fail the booking.</p>
<pre><code class="language-ts">${esc(MA_EV)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>

<h3>Step 3 — the realtime module</h3>
<p>Authentication follows the same rule as <code>JwtAuthGuard</code> (signature, then current <code>tokenVersion</code> from the database) but runs in handshake middleware, so a revoked session never connects (10.2):</p>
<pre><code class="language-ts">${esc(MA_AUTH)}</code></pre>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_LIS)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<ul>
<li>The Origin list comes from <code>ConfigService</code>, but decorator options are evaluated when the class loads — so <code>cors</code> and <code>allowRequest</code> read a module variable filled in <code>afterInit</code>.</li>
<li>The snapshot query uses a narrow <code>select</code>: a <code>findMany</code> without it would have sent <code>userId</code> and <code>note</code> to every watcher.</li>
<li><code>this.server?.</code>: the worker process (9.5) loads the same module but has no HTTP server, so no socket server either.</li>
</ul>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>

<h3>Step 4 — tests, and the first run</h3>
<p><code>taoApp</code> gets a hook to attach the WebSocket adapter before <code>init</code>; the tests listen on port 0 and connect real clients:</p>
<pre><code class="language-ts">${esc(MA_TAO)}</code></pre>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<div class="out">${esc(OUT_LAN1)}</div>
<p>Handshake tests pass; everything that sends a message times out. Listening for the <code>exception</code> event and turning on the error logger shows why:</p>
<div class="out">${esc(OUT_DEBUG)}</div>
<p><strong>Global guards registered with <code>APP_GUARD</code> run for WebSocket handlers too.</strong> <code>JwtAuthGuard</code> called <code>switchToHttp().getRequest()</code>, got the socket, read <code>.headers.authorization</code> of undefined and crashed — the client saw "Internal server error" and no ack (10.1). The guards were written in chapter 7 for HTTP only; now they must say so:</p>
<pre><code class="language-ts">${esc(MA_JWTG)}</code></pre>
<p><code>PermGuard</code> gets the same two lines. Then a check with 60 messages from each of two users:</p>
<div class="out">${esc(OUT_THR)}</div>
<p>One hundred messages succeeded, then <em>both</em> users were rejected. <code>ThrottlerGuard</code> (7.5) is global too; its tracker is <code>req.ip</code>, and a Socket.IO socket has no <code>.ip</code> — so every socket of every user shares one bucket keyed <code>undefined</code>: 100 messages per minute for the whole server. Restrict it to HTTP:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<div class="out">${esc(OUT_THRSUA)}</div>
<p>(If sockets need rate limiting, build it on <code>client.data.user.id</code> — a decision for later, written down in the backlog.)</p>

<h3>Step 5 — green, and a real run with two instances</h3>
<div class="out">${esc(OUT_XANH)}</div>
<pre><code class="language-js">${esc(MA_CLIENT)}</code></pre>
<div class="out">${esc(OUT_XEM)}</div>

<h3>Self-assessment (10 points for this milestone)</h3>
<table>
<tr><th>Criterion</th><th>Points</th><th>Evidence</th></tr>
<tr><td>Handshake auth incl. revoked session, Origin check</td><td>3</td><td>test 1, xem10.sh</td></tr>
<tr><td>Snapshot + errors in the ack</td><td>1</td><td>test 2</td></tr>
<tr><td>Correct room targeting, nothing on 409</td><td>2</td><td>tests 3–4</td></tr>
<tr><td>No private data in payloads</td><td>2</td><td>exact <code>toEqual</code> in test 3, narrow <code>select</code></td></tr>
<tr><td>Works across instances</td><td>1</td><td>test 5, xem10.sh</td></tr>
<tr><td>Global guards fixed for non-HTTP contexts</td><td>1</td><td>47/47</td></tr>
</table>
<p>Your own project: pick the one screen where users today press F5 to see changes (an order status, a seat map, a queue number) and make it live with the same structure. Commit as <code>milestone 10: realtime board</code>.</p>

<h3>📌 Summary</h3>
<ul>
<li>The booking module announces a public-safe event after the write; the realtime module turns it into room broadcasts.</li>
<li>Socket auth = the HTTP rule, moved to the handshake.</li>
<li>Every global enhancer (<code>APP_GUARD</code>, throttler) also runs for gateways — check <code>ctx.getType()</code>.</li>
<li>Tests found both problems before any user did.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Mốc dự án</span>
<h2>10.6 — Mốc dự án 10: bảng tình trạng phòng trực tiếp trong lab-booking</h2>
<p class="lead">Đề bài (0.2) đòi một tính năng thời gian thực. Ở lab-booking đó là bảng phòng: khi một sinh viên đang xem phòng AL-201, khung giờ hiện lên, được duyệt hay trống lại mà không cần tải lại. Mốc này thêm nó vào dự án của 9.5 bằng mọi thứ của 10.1–10.5 — và lần chạy test đầu tiên lôi ra hai enhancer toàn cục vốn không bao giờ được viết cho socket.</p>

<h3>Tiêu chí đạt</h3>
<ol>
<li>Bắt tay từ chối: không token, token có <code>tokenVersion</code> đã bị thu hồi, Origin lạ.</li>
<li><code>watch-room</code> trả ảnh chụp; phòng không có ⇒ <code>{ ok: false, error }</code> trong ack.</li>
<li>Tạo / duyệt / huỷ ⇒ người xem phòng đó nhận <code>slot</code>; người xem phòng khác không nhận gì; 409 không sinh tin nào.</li>
<li>Payload không có id người dùng, mã sinh viên hay ghi chú.</li>
<li>Hai bản API: đặt ở bản này, socket ở bản kia vẫn nhận.</li>
<li>42 test của mốc 9 vẫn xanh.</li>
</ol>

<h3>Bước 1 — cấu hình</h3>
<pre><code class="language-ts">${esc(MA_ENV)}</code></pre>
<p>Test schema từ mốc 5 ghim mọi giá trị mặc định nên đỏ ngay — tốt, đó là việc của nó; sửa object kỳ vọng:</p>
<div class="out">${esc(OUT_ENV)}</div>

<h3>Bước 2 — module đặt lịch chỉ loan báo</h3>
<p>Một sự kiện thứ hai, tách khỏi <code>BookingStatusChanged</code> (mang dữ liệu cho email): nó chỉ chứa điều mà ai đang xem phòng cũng được thấy. Phát sau khi ghi DB thành công, bằng <code>emit</code> thường — bảng là "cố gắng hết sức"; listener hỏng không được làm hỏng lần đặt lịch.</p>
<pre><code class="language-ts">${esc(MA_EV)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>

<h3>Bước 3 — module realtime</h3>
<p>Xác thực theo đúng luật của <code>JwtAuthGuard</code> (chữ ký, rồi <code>tokenVersion</code> hiện tại trong DB) nhưng chạy ở middleware bắt tay, nên phiên đã thu hồi không bao giờ nối được (10.2):</p>
<pre><code class="language-ts">${esc(MA_AUTH)}</code></pre>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_LIS)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<ul>
<li>Danh sách Origin lấy từ <code>ConfigService</code>, nhưng tuỳ chọn của decorator được tính lúc nạp lớp — nên <code>cors</code> và <code>allowRequest</code> đọc một biến của module, gán ở <code>afterInit</code>.</li>
<li>Truy vấn ảnh chụp dùng <code>select</code> hẹp: <code>findMany</code> trơn sẽ gửi <code>userId</code> và <code>note</code> cho mọi người xem.</li>
<li><code>this.server?.</code>: tiến trình worker (9.5) nạp cùng module nhưng không có server HTTP, nên cũng không có server socket.</li>
</ul>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-ts">${esc(MA_APPM)}</code></pre>

<h3>Bước 4 — test, và lần chạy đầu</h3>
<p><code>taoApp</code> có thêm một móc để gắn adapter WebSocket trước <code>init</code>; test lắng nghe cổng 0 và nối client thật:</p>
<pre><code class="language-ts">${esc(MA_TAO)}</code></pre>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<div class="out">${esc(OUT_LAN1)}</div>
<p>Các test bắt tay xanh; mọi test có gửi tin đều hết giờ. Nghe sự kiện <code>exception</code> và bật log lỗi thì thấy lý do:</p>
<div class="out">${esc(OUT_DEBUG)}</div>
<p><strong>Guard toàn cục đăng ký bằng <code>APP_GUARD</code> cũng chạy cho handler WebSocket.</strong> <code>JwtAuthGuard</code> gọi <code>switchToHttp().getRequest()</code>, nhận về socket, đọc <code>.headers.authorization</code> của undefined và sập — client thấy "Internal server error" và không có ack (10.1). Hai guard viết ở chương 7 chỉ cho HTTP; giờ phải nói rõ điều đó:</p>
<pre><code class="language-ts">${esc(MA_JWTG)}</code></pre>
<p><code>PermGuard</code> thêm đúng hai dòng như vậy. Rồi kiểm bằng 60 tin từ mỗi người trong hai người:</p>
<div class="out">${esc(OUT_THR)}</div>
<p>Một trăm tin thành công, sau đó <em>cả hai</em> người đều bị từ chối. <code>ThrottlerGuard</code> (7.5) cũng toàn cục; nó đếm theo <code>req.ip</code>, mà socket Socket.IO không có <code>.ip</code> — nên mọi socket của mọi người dùng chung một xô mang khoá <code>undefined</code>: 100 tin mỗi phút cho cả server. Giới hạn nó về HTTP:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<div class="out">${esc(OUT_THRSUA)}</div>
<p>(Nếu socket cần giới hạn tần suất thì dựng theo <code>client.data.user.id</code> — một quyết định để sau, ghi vào backlog.)</p>

<h3>Bước 5 — xanh, và chạy thật với hai bản</h3>
<div class="out">${esc(OUT_XANH)}</div>
<pre><code class="language-js">${esc(MA_CLIENT)}</code></pre>
<div class="out">${esc(OUT_XEM)}</div>

<h3>Tự chấm (10 điểm cho mốc này)</h3>
<table>
<tr><th>Tiêu chí</th><th>Điểm</th><th>Bằng chứng</th></tr>
<tr><td>Xác thực lúc bắt tay kể cả phiên bị thu hồi, kiểm Origin</td><td>3</td><td>test 1, xem10.sh</td></tr>
<tr><td>Ảnh chụp + lỗi trong ack</td><td>1</td><td>test 2</td></tr>
<tr><td>Phát đúng phòng, 409 không phát</td><td>2</td><td>test 3–4</td></tr>
<tr><td>Payload không có dữ liệu riêng tư</td><td>2</td><td><code>toEqual</code> chính xác ở test 3, <code>select</code> hẹp</td></tr>
<tr><td>Chạy đúng qua nhiều bản</td><td>1</td><td>test 5, xem10.sh</td></tr>
<tr><td>Guard toàn cục đã sửa cho ngữ cảnh không phải HTTP</td><td>1</td><td>47/47</td></tr>
</table>
<p>Dự án của bạn: chọn đúng một màn hình mà hôm nay người dùng phải bấm F5 mới thấy thay đổi (trạng thái đơn, sơ đồ ghế, số thứ tự) và làm nó trực tiếp theo cùng cấu trúc. Commit với thông điệp <code>milestone 10: realtime board</code>.</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Module đặt lịch loan báo một sự kiện an toàn để công khai sau khi ghi; module realtime biến nó thành tin phát theo phòng.</li>
<li>Xác thực socket = luật của HTTP, dời ra lúc bắt tay.</li>
<li>Mọi enhancer toàn cục (<code>APP_GUARD</code>, throttler) cũng chạy cho gateway — kiểm <code>ctx.getType()</code>.</li>
<li>Test tìm ra cả hai vấn đề trước khi người dùng nào gặp.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
