/**
 * 10.5 — Lab: Bảng tình trạng phòng cập nhật trực tiếp (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, socket.io 4.8.4, @socket.io/redis-adapter 8.3.0, Redis 7.4 nst-redis, Vitest 4.1.12):
 * scratchpad/nst/lab/c10/app/src/lab105 (lời giải + lab105.e2e.spec.ts: HAI bản ứng dụng là tiến trình con thật cổng 41991/41992).
 * Lần 1: 6/6 xanh. Thử phá (sửa dist, xoá dist + tsbuildinfo giữa các lần): bỏ Redis adapter ⇒ test 3, 4 đỏ; bỏ allowRequest ⇒ test 2 đỏ; phát trước khi giữ chỗ ⇒ test 4 đỏ.
 * Chạy: lab/c10/app/o10.sh 105-dat vitest.lab105.config.ts. Ghép: gen.mjs rồi ghep.sh 105 nst-10-5-lab.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MA_KHUNG = `@WebSocketGateway({
  cors: { origin: CHO_PHEP },
  // TODO 1: allowRequest — từ chối bắt tay nếu req.headers.origin không nằm trong CHO_PHEP
})
export class BangGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(private readonly store: LichStore) {}

  afterInit(server: Server) {
    // TODO 2: server.use(...) — kiểm JWT ở handshake.auth.token; sai ⇒ next(new Error('unauthorized'))
  }

  handleConnection(client: Socket) {
    // TODO 3: hẹn giờ ngắt socket đúng lúc token hết hạn
  }

  @SubscribeMessage('theo-doi-phong')
  async theoDoi(@MessageBody() phong: unknown, @ConnectedSocket() client: Socket) {
    // TODO 4: phòng không có ⇒ { ok: false, loi: 'PHONG_KHONG_CO' } trong ack
    // TODO 5: rời phòng đang xem (nếu có), vào 'phong:<id>', trả { ok: true, banDo }
  }

  phatDoi(phong: string, khung: string) {
    // TODO 6: phát 'khung-doi' cho đúng phòng
  }
}`;

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-10-2-ws-auth-scale', title: 'NestJS 10.2 — Xác thực socket và Redis adapter', sub: 'Mọi kỹ thuật lab cần: middleware bắt tay, Origin, hẹn giờ hết hạn, adapter.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-4-lab', title: 'NestJS 9.4 — Lab hàng đợi', sub: 'Cùng cách test: ứng dụng là tiến trình con thật, thử phá để chứng minh test có răng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-4-nguyen-tu-rate-limit-lock', title: 'Node.js 12.4 — Nguyên tử, rate limit và khoá với Redis', sub: 'SET NX: một người thắng giữa nhiều tiến trình — nền của LichStore.dat().', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Socket.IO docs — Testing', 'Dựng server thật, nối client thật trong test; emitWithAck và timeout.', 'https://socket.io/docs/v4/testing/'),
  nguon('📘', 'Redis docs — SET (tuỳ chọn NX)', 'Chỉ đặt khi khoá chưa tồn tại; trả nil nếu đã có — nguyên tử giữa mọi client.', 'https://redis.io/docs/latest/commands/set/'),
].join('\n');
const MA_STORE = "import { Injectable, OnApplicationShutdown } from '@nestjs/common';\nimport { Redis } from 'ioredis';\n\nexport const PHONG = ['L1', 'L2', 'L3'];\nexport const KHUNG = ['07:30', '09:30', '12:30', '14:30'];\n\n@Injectable()\nexport class LichStore implements OnApplicationShutdown {\n  private readonly r = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:41901/10');\n\n  /** Giữ chỗ nguyên tử trên Redis dùng chung cho mọi bản ứng dụng: SET NX ⇒ chỉ một người thắng. */\n  async dat(phong: string, khung: string, sv: number) {\n    return (await this.r.set(`slot:${phong}:${khung}`, String(sv), 'NX')) === 'OK';\n  }\n  async banDo(phong: string) {\n    const v = await this.r.mget(KHUNG.map((k) => `slot:${phong}:${k}`));\n    return Object.fromEntries(KHUNG.map((k, i) => [k, v[i] ? 'DA_DAT' : 'TRONG']));\n  }\n  onApplicationShutdown() { this.r.disconnect(); }\n}";
const MA_GW = "import { Logger } from '@nestjs/common';\nimport {\n  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage,\n  WebSocketGateway, WebSocketServer,\n} from '@nestjs/websockets';\nimport type { IncomingMessage } from 'node:http';\nimport type { Server, Socket } from 'socket.io';\nimport { CHO_PHEP, jwt, type NguoiDung } from './xac-thuc.js';\nimport { LichStore, PHONG } from './lich.store.js';\n\n@WebSocketGateway({\n  cors: { origin: CHO_PHEP },\n  // CORS không chặn transport websocket ⇒ tự kiểm Origin lúc bắt tay (chống CSWSH)\n  allowRequest: (req: IncomingMessage, cb: (e: string | null, ok: boolean) => void) => cb(null, CHO_PHEP.includes(req.headers.origin ?? '')),\n})\nexport class BangGateway implements OnGatewayInit, OnGatewayConnection {\n  @WebSocketServer() server: Server;\n  private readonly log = new Logger('BangGateway');\n  constructor(private readonly store: LichStore) {}\n\n  afterInit(server: Server) {\n    server.use((client, next) => {                       // trước khi chấp nhận kết nối: 0 tin lọt\n      jwt.verifyAsync<NguoiDung>(String(client.handshake.auth?.token ?? '')).then(\n        (nd) => { client.data.user = nd; next(); },\n        () => next(new Error('unauthorized')),\n      );\n    });\n  }\n\n  handleConnection(client: Socket) {\n    const nd: NguoiDung = client.data.user;\n    const t = setTimeout(() => client.disconnect(true), nd.exp * 1000 - Date.now());   // token hết hạn ⇒ ngắt\n    client.once('disconnect', () => clearTimeout(t));\n  }\n\n  @SubscribeMessage('theo-doi-phong')\n  async theoDoi(@MessageBody() phong: unknown, @ConnectedSocket() client: Socket) {\n    if (typeof phong !== 'string' || !PHONG.includes(phong)) return { ok: false, loi: 'PHONG_KHONG_CO' };   // lỗi nghiệp vụ đi trong ack\n    for (const r of client.rooms) if (r.startsWith('phong:')) void client.leave(r);   // một tab xem một phòng\n    void client.join(`phong:${phong}`);\n    return { ok: true, banDo: await this.store.banDo(phong) };                         // ảnh chụp ban đầu\n  }\n\n  phatDoi(phong: string, khung: string) {\n    this.server.to(`phong:${phong}`).emit('khung-doi', { phong, khung, trangThai: 'DA_DAT', tu: process.env.PORT });\n  }\n}";
const MA_CTRL = "import { Body, ConflictException, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';\nimport { IsIn, IsString } from 'class-validator';\nimport { BangGateway } from './bang.gateway.js';\nimport { KHUNG, LichStore, PHONG } from './lich.store.js';\nimport { jwt, type NguoiDung } from './xac-thuc.js';\n\nclass DatDto { @IsString() @IsIn(PHONG) phong: string; @IsString() @IsIn(KHUNG) khung: string; }\n\n@Controller('lich')\nexport class LichController {\n  constructor(private readonly store: LichStore, private readonly bang: BangGateway) {}\n\n  @Post()\n  async dat(@Body() dto: DatDto, @Headers('authorization') auth = '') {\n    const nd = await jwt.verifyAsync<NguoiDung>(auth.replace(/^Bearer /, '')).catch(() => { throw new UnauthorizedException(); });\n    if (!(await this.store.dat(dto.phong, dto.khung, nd.sub))) throw new ConflictException('Khung giờ đã có người đặt');\n    this.bang.phatDoi(dto.phong, dto.khung);          // CHỈ phát khi giữ chỗ thành công\n    return { ...dto, sv: nd.sub };\n  }\n}";
const MA_MAIN = "import 'reflect-metadata';\nimport { ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module.js';\nimport { RedisIoAdapter } from './redis-io.adapter.js';\n\nconst app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });\napp.useGlobalPipes(new ValidationPipe({ whitelist: true }));\nconst adapter = new RedisIoAdapter(app);\nawait adapter.connectToRedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:41901/10');\napp.useWebSocketAdapter(adapter);\napp.enableShutdownHooks();\nawait app.listen(Number(process.env.PORT ?? 41991), '127.0.0.1');";
const MA_XT = "import { JwtService } from '@nestjs/jwt';\n\nexport type NguoiDung = { sub: number; role: 'STUDENT' | 'ADMIN'; exp: number };\nexport const jwt = new JwtService({ secret: process.env.JWT_SECRET ?? 'bi-mat-lab-10-5-chi-dung-o-may-ban' });\nexport const CHO_PHEP = (process.env.ORIGINS ?? 'http://localhost:5173').split(',');";
const MA_TEST = "import { spawn, type ChildProcess } from 'node:child_process';\nimport { Redis } from 'ioredis';\nimport { io, type Socket } from 'socket.io-client';\nimport { JwtService } from '@nestjs/jwt';\n\nconst jwt = new JwtService({ secret: 'bi-mat-lab-10-5-chi-dung-o-may-ban' });\nconst A = 'http://127.0.0.1:41991', B = 'http://127.0.0.1:41992', ORIGIN = 'http://localhost:5173';\nconst tok = (sub: number, exp: string | number = '1h') => jwt.sign({ sub, role: 'STUDENT' }, { expiresIn: exp as never });\nconst redis = new Redis('redis://127.0.0.1:41901/10');\nconst ban: ChildProcess[] = [];\nconst mo: Socket[] = [];\n\nfunction batBan(port: number) {\n  const p = spawn('node', ['dist/lab105/main.js'], { env: { ...process.env, PORT: String(port) }, stdio: 'inherit' });\n  ban.push(p);\n}\nasync function choSan(url: string) {\n  for (let i = 0; i < 50; i++) { try { await fetch(url + '/lich', { method: 'POST' }); return; } catch { await new Promise((r) => setTimeout(r, 100)); } }\n  throw new Error('không lên: ' + url);\n}\nfunction noi(url: string, opt: Record<string, unknown> = {}) {\n  const s = io(url, { transports: ['websocket'], reconnection: false, extraHeaders: { Origin: ORIGIN }, auth: { token: tok(7) }, ...opt });\n  mo.push(s);\n  return s;\n}\nconst ketNoi = (s: Socket) => new Promise<string>((ok) => { s.on('connect', () => ok('connect')); s.on('connect_error', (e) => ok('connect_error: ' + e.message)); });\nconst nhan = (s: Socket) => { const ds: unknown[] = []; s.on('khung-doi', (d) => ds.push(d)); return ds; };\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\nconst dat = (url: string, phong: string, khung: string, sub = 8) =>\n  fetch(url + '/lich', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + tok(sub) }, body: JSON.stringify({ phong, khung }) });\n\nbeforeAll(async () => { await redis.flushdb(); batBan(41991); batBan(41992); await choSan(A); await choSan(B); });\nafterEach(async () => { mo.splice(0).forEach((s) => s.close()); await redis.flushdb(); });\nafterAll(async () => { ban.forEach((p) => p.kill('SIGTERM')); redis.disconnect(); });\n\ntest('1. socket không token / token sai bị từ chối lúc bắt tay', async () => {\n  expect(await ketNoi(noi(A, { auth: {} }))).toBe('connect_error: unauthorized');\n  expect(await ketNoi(noi(A, { auth: { token: tok(7).slice(0, -2) + 'xx' } }))).toBe('connect_error: unauthorized');\n});\n\ntest('2. Origin lạ bị từ chối dù token đúng (CSWSH)', async () => {\n  expect(await ketNoi(noi(A, { extraHeaders: { Origin: 'http://evil.example' } }))).toBe('connect_error: websocket error');\n  expect(await ketNoi(noi(A))).toBe('connect');\n});\n\ntest('3. đặt ở bản A, tab xem cùng phòng ở bản B thấy ngay; phòng khác không thấy', async () => {\n  const b = noi(B), c = noi(B, { auth: { token: tok(9) } });\n  await ketNoi(b); await ketNoi(c);\n  const r = await b.emitWithAck('theo-doi-phong', 'L1');\n  expect(r).toEqual({ ok: true, banDo: { '07:30': 'TRONG', '09:30': 'TRONG', '12:30': 'TRONG', '14:30': 'TRONG' } });\n  await c.emitWithAck('theo-doi-phong', 'L2');\n  const nb = nhan(b), nc = nhan(c);\n  expect((await dat(A, 'L1', '09:30')).status).toBe(201);\n  await ngu(300);\n  expect(nb).toEqual([{ phong: 'L1', khung: '09:30', trangThai: 'DA_DAT', tu: '41991' }]);\n  expect(nc).toEqual([]);\n});\n\ntest('4. hai người đặt cùng khung ở hai bản cùng lúc: một 201, một 409, người xem nhận đúng một tin', async () => {\n  const b = noi(B); await ketNoi(b); await b.emitWithAck('theo-doi-phong', 'L3');\n  const nb = nhan(b);\n  const kq = await Promise.all([dat(A, 'L3', '07:30', 8), dat(B, 'L3', '07:30', 9)]);\n  expect(kq.map((r) => r.status).sort()).toEqual([201, 409]);\n  await ngu(300);\n  expect(nb).toHaveLength(1);\n});\n\ntest('5. phòng không có ⇒ ack báo lỗi, không treo; đổi phòng ⇒ rời phòng cũ', async () => {\n  const b = noi(A); await ketNoi(b);\n  expect(await b.timeout(500).emitWithAck('theo-doi-phong', 'L9')).toEqual({ ok: false, loi: 'PHONG_KHONG_CO' });\n  await b.emitWithAck('theo-doi-phong', 'L1'); await b.emitWithAck('theo-doi-phong', 'L2');\n  const nb = nhan(b);\n  await dat(B, 'L1', '12:30'); await ngu(300);\n  expect(nb).toEqual([]);\n});\n\ntest('6. token hết hạn ⇒ server ngắt socket', async () => {\n  const b = noi(A, { auth: { token: tok(7, 2) } });\n  await ketNoi(b);\n  const ly = await new Promise((ok) => b.on('disconnect', ok));\n  expect(ly).toBe('io server disconnect');\n}, 5000);";
const OUT_DAT = " RUN  v4.1.12 /home/sv/app\n ✓ src/lab105/lab105.e2e.spec.ts > 1. socket không token / token sai bị từ chối lúc bắt tay 37ms\n ✓ src/lab105/lab105.e2e.spec.ts > 2. Origin lạ bị từ chối dù token đúng (CSWSH) 10ms\n ✓ src/lab105/lab105.e2e.spec.ts > 3. đặt ở bản A, tab xem cùng phòng ở bản B thấy ngay; phòng khác không thấy 351ms\n ✓ src/lab105/lab105.e2e.spec.ts > 4. hai người đặt cùng khung ở hai bản cùng lúc: một 201, một 409, người xem nhận đúng một tin 326ms\n ✓ src/lab105/lab105.e2e.spec.ts > 5. phòng không có ⇒ ack báo lỗi, không treo; đổi phòng ⇒ rời phòng cũ 329ms\n ✓ src/lab105/lab105.e2e.spec.ts > 6. token hết hạn ⇒ server ngắt socket 1440ms\n Test Files  1 passed (1)\n      Tests  6 passed (6)\n   Start at  09:38:22\n   Duration  4.24s (transform 57ms, setup 0ms, import 377ms, tests 3.60s, environment 0ms)";
const OUT_PHA1 = "   ✓ 1. socket không token / token sai bị từ chối lúc bắt tay 40ms\n   ✓ 2. Origin lạ bị từ chối dù token đúng (CSWSH) 12ms\n   × 3. đặt ở bản A, tab xem cùng phòng ở bản B thấy ngay; phòng khác không thấy 355ms\n   × 4. hai người đặt cùng khung ở hai bản cùng lúc: một 201, một 409, người xem nhận đúng một tin 324ms\n   ✓ 5. phòng không có ⇒ ack báo lỗi, không treo; đổi phòng ⇒ rời phòng cũ  317ms\n   ✓ 6. token hết hạn ⇒ server ngắt socket  1312ms\nAssertionError: expected [] to deeply equal [ { phong: 'L1', …(3) } ]\nAssertionError: expected [] to have a length of 1 but got +0\n      Tests  2 failed | 4 passed (6)";
const OUT_PHA2 = "   ✓ 1. socket không token / token sai bị từ chối lúc bắt tay 33ms\n   × 2. Origin lạ bị từ chối dù token đúng (CSWSH) 11ms\n   ✓ 3. đặt ở bản A, tab xem cùng phòng ở bản B thấy ngay; phòng khác không thấy  339ms\n   ✓ 4. hai người đặt cùng khung ở hai bản cùng lúc: một 201, một 409, người xem nhận đúng một tin  318ms\n   ✓ 5. phòng không có ⇒ ack báo lỗi, không treo; đổi phòng ⇒ rời phòng cũ  314ms\n   ✓ 6. token hết hạn ⇒ server ngắt socket  1670ms\nAssertionError: expected 'connect' to be 'connect_error: websocket error' // Object.is equality\n      Tests  1 failed | 5 passed (6)";
const OUT_PHA3 = "   ✓ 1. socket không token / token sai bị từ chối lúc bắt tay 44ms\n   ✓ 2. Origin lạ bị từ chối dù token đúng (CSWSH) 13ms\n   ✓ 3. đặt ở bản A, tab xem cùng phòng ở bản B thấy ngay; phòng khác không thấy  354ms\n   × 4. hai người đặt cùng khung ở hai bản cùng lúc: một 201, một 409, người xem nhận đúng một tin 337ms\n   ✓ 5. phòng không có ⇒ ack báo lỗi, không treo; đổi phòng ⇒ rời phòng cũ  318ms\n   ✓ 6. token hết hạn ⇒ server ngắt socket  1342ms\nAssertionError: expected [ { phong: 'L3', …(3) }, …(1) ] to have a length of 1 but got 2\n      Tests  1 failed | 5 passed (6)";
export default {
  title: '10.5 — Lab: A live room-availability board|||10.5 — Lab: Bảng tình trạng phòng cập nhật trực tiếp',
  slug: 'nst-10-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chạy trên Redis thật với HAI bản ứng dụng: đặt khung giờ ở tab A (bản 1), tab B đang xem cùng phòng (bản 2) đổi ngay. Đạt khi sáu test e2e xanh: socket không token và Origin lạ bị từ chối lúc bắt tay, hai người đặt cùng khung ở hai bản cùng lúc thì một 201 một 409 và người xem nhận đúng một tin, phòng sai trả lỗi trong ack, token hết hạn thì bị ngắt. Kèm thử phá ba lần để chứng minh từng test bắt đúng lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab</span>
<h2>10.5 — Lab: a live board that stays right with two instances</h2>
<p class="lead">You build the live board from lesson 10.1 properly: authenticated at the gate, Origin-checked, one tab per room, correct across two instances, and never announcing a booking that did not happen. The tests start two real instances of the app and talk to them with real Socket.IO clients.</p>

<h3>Goal and pass criteria</h3>
<ol>
<li>A socket with no token or a forged token gets <code>connect_error: unauthorized</code> — it never connects.</li>
<li>A foreign <code>Origin</code> is rejected even with a valid token.</li>
<li>Booking through instance A ⇒ a tab on instance B watching that room sees it within 300 ms; a tab watching another room sees nothing.</li>
<li>Two students book the same slot on the two instances at the same moment ⇒ one 201, one 409, and the watcher receives exactly one update.</li>
<li>Unknown room ⇒ <code>{ ok: false }</code> in the ack (no hang); switching rooms stops updates from the old one.</li>
<li>Token expired ⇒ the server disconnects the socket.</li>
</ol>

<h3>Setup</h3>
<pre><code class="language-bash">docker run -d --rm --name nst-redis -p 127.0.0.1:41901:6379 redis:7-alpine
npm i @nestjs/websockets @nestjs/platform-socket.io @socket.io/redis-adapter ioredis @nestjs/jwt
npm i -D socket.io-client</code></pre>
<p>Given: the slot store (atomic <code>SET NX</code> on Redis, shared by both instances), the JWT helper and the Redis adapter from 10.2.</p>
<pre><code class="language-ts">${esc(MA_STORE)}</code></pre>
<pre><code class="language-ts">${esc(MA_XT)}</code></pre>
<p>Your part — the gateway skeleton, plus the controller and <code>main.ts</code>:</p>
<pre><code class="language-ts">${esc(MA_KHUNG)}</code></pre>
<p>The tests (given; do not change them to make them pass):</p>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>

<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_DAT)}</div>
</details>

<h3>Prove the tests have teeth: break it three times</h3>
<p>Green tests only matter if they go red for the bug they claim to catch. Edit the built JavaScript, run, then rebuild from scratch (<code>rm -rf dist *.tsbuildinfo</code> — an incremental build does not overwrite a hand-edited <code>dist</code>).</p>
<div class="out">$ # phá 1: bỏ app.useWebSocketAdapter(adapter)
${esc(OUT_PHA1)}</div>
<div class="out">$ # phá 2: bỏ allowRequest
${esc(OUT_PHA2)}</div>
<div class="out">$ # phá 3: phatDoi() TRƯỚC store.dat()
${esc(OUT_PHA3)}</div>
<ul>
<li>Without the adapter nothing errors — the watcher on instance B simply hears nothing (tests 3 and 4). That is the bug you would ship if you only ever tested with one instance.</li>
<li>Without <code>allowRequest</code> only test 2 fails: <code>cors</code> alone does not stop the websocket transport (10.2).</li>
<li>Announce-then-reserve: the loser of the race still announced, so the watcher saw two "booked" messages for one slot. Only announce what has been committed.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you e2e-test a WebSocket feature that spans two instances?</strong> Start two real app processes, connect real clients to different instances, act through HTTP on one, assert on the other with a deadline.</li>
<li><strong>Why does the HTTP handler announce only after <code>SET NX</code> succeeded?</strong> The announcement is a statement of fact; the losing request must not make it.</li>
<li><strong>Why return the room snapshot in the join ack?</strong> Updates only tell you about changes after joining; without a snapshot the tab starts from stale data.</li>
<li><strong>What does the client do on <code>io server disconnect</code> after token expiry?</strong> Refresh the access token, reconnect, re-join the room, take the new snapshot.</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Snapshot + updates</span><span class="v">Full state in the join ack, then only changes.</span></div>
  <div class="kv"><span class="k">SET NX</span><span class="v">Atomic "set if absent" — one winner across instances.</span></div>
  <div class="kv"><span class="k">Mutation check</span><span class="v">Deliberately break the code to see the right test fail.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Gate: token in handshake middleware + Origin allow-list; expiry timer.</li>
<li>Rooms per resource, one room per tab, errors inside the ack.</li>
<li>Two instances need the Redis adapter <em>and</em> shared state (Redis, the database) — never in-memory maps.</li>
<li>Announce after commit; prove each test by breaking the code.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab</span>
<h2>10.5 — Lab: bảng trực tiếp vẫn đúng khi có hai bản ứng dụng</h2>
<p class="lead">Bạn dựng lại bảng trực tiếp của bài 10.1 cho đúng nghĩa: xác thực ngay ở cổng, kiểm Origin, mỗi tab một phòng, đúng khi chạy hai bản, và không bao giờ loan báo một lần đặt không xảy ra. Bộ test bật hai bản ứng dụng thật và nói chuyện với chúng bằng client Socket.IO thật.</p>

<h3>Mục tiêu và tiêu chí đạt</h3>
<ol>
<li>Socket không token hoặc token giả nhận <code>connect_error: unauthorized</code> — không bao giờ nối được.</li>
<li><code>Origin</code> lạ bị từ chối dù token đúng.</li>
<li>Đặt qua bản A ⇒ tab ở bản B đang xem phòng đó thấy trong 300 ms; tab xem phòng khác không thấy gì.</li>
<li>Hai sinh viên đặt cùng khung ở hai bản cùng lúc ⇒ một 201, một 409, người xem nhận đúng một tin.</li>
<li>Phòng không có ⇒ <code>{ ok: false }</code> trong ack (không treo); đổi phòng thì thôi nhận tin của phòng cũ.</li>
<li>Token hết hạn ⇒ server ngắt socket.</li>
</ol>

<h3>Chuẩn bị</h3>
<pre><code class="language-bash">docker run -d --rm --name nst-redis -p 127.0.0.1:41901:6379 redis:7-alpine
npm i @nestjs/websockets @nestjs/platform-socket.io @socket.io/redis-adapter ioredis @nestjs/jwt
npm i -D socket.io-client</code></pre>
<p>Cho sẵn: kho khung giờ (<code>SET NX</code> nguyên tử trên Redis, hai bản dùng chung), hàm JWT và Redis adapter của 10.2.</p>
<pre><code class="language-ts">${esc(MA_STORE)}</code></pre>
<pre><code class="language-ts">${esc(MA_XT)}</code></pre>
<p>Phần của bạn — khung gateway, cộng controller và <code>main.ts</code>:</p>
<pre><code class="language-ts">${esc(MA_KHUNG)}</code></pre>
<p>Bộ test (cho sẵn; không sửa test để cho xanh):</p>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>

<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_DAT)}</div>
</details>

<h3>Chứng minh test có răng: phá ba lần</h3>
<p>Test xanh chỉ có giá trị nếu nó đỏ đúng với lỗi nó tuyên bố bắt. Sửa tệp JavaScript đã build, chạy, rồi build lại từ đầu (<code>rm -rf dist *.tsbuildinfo</code> — build incremental không ghi đè <code>dist</code> đã sửa tay).</p>
<div class="out">$ # phá 1: bỏ app.useWebSocketAdapter(adapter)
${esc(OUT_PHA1)}</div>
<div class="out">$ # phá 2: bỏ allowRequest
${esc(OUT_PHA2)}</div>
<div class="out">$ # phá 3: phatDoi() TRƯỚC store.dat()
${esc(OUT_PHA3)}</div>
<ul>
<li>Bỏ adapter thì không có lỗi nào — người xem ở bản B chỉ đơn giản là không nghe gì (test 3 và 4). Đó là lỗi bạn sẽ mang lên production nếu chỉ từng test với một bản.</li>
<li>Bỏ <code>allowRequest</code> thì chỉ test 2 đỏ: riêng <code>cors</code> không chặn transport websocket (10.2).</li>
<li>Loan báo rồi mới giữ chỗ: người thua cuộc đua vẫn kịp loan báo, nên người xem thấy hai tin "đã đặt" cho một khung. Chỉ loan báo điều đã commit.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test e2e một tính năng WebSocket trải trên hai bản ứng dụng thế nào?</strong> Bật hai tiến trình ứng dụng thật, nối client thật vào hai bản khác nhau, thao tác qua HTTP ở một bản, khẳng định ở bản kia trong một hạn chờ.</li>
<li><strong>Sao handler HTTP chỉ loan báo sau khi <code>SET NX</code> thành công?</strong> Lời loan báo là khẳng định một sự thật; request thua không được phép nói nó.</li>
<li><strong>Sao trả ảnh chụp phòng trong ack lúc vào phòng?</strong> Tin cập nhật chỉ kể thay đổi sau lúc vào; không có ảnh chụp thì tab bắt đầu từ dữ liệu cũ.</li>
<li><strong>Client làm gì khi nhận <code>io server disconnect</code> vì token hết hạn?</strong> Làm mới access token, nối lại, vào lại phòng, lấy ảnh chụp mới.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh chụp + cập nhật</span><span class="v">Trạng thái đầy đủ trong ack lúc vào phòng, sau đó chỉ gửi thay đổi.</span></div>
  <div class="kv"><span class="k">SET NX</span><span class="v">"Đặt nếu chưa có" nguyên tử — một người thắng giữa các bản.</span></div>
  <div class="kv"><span class="k">Thử phá (mutation)</span><span class="v">Cố tình làm hỏng mã để thấy đúng test đó đỏ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cổng: token ở middleware bắt tay + danh sách Origin; hẹn giờ hết hạn.</li>
<li>Phòng theo tài nguyên, mỗi tab một phòng, lỗi đi trong ack.</li>
<li>Hai bản cần Redis adapter <em>và</em> trạng thái dùng chung (Redis, DB) — không bao giờ dùng Map trong bộ nhớ.</li>
<li>Loan báo sau khi commit; chứng minh từng test bằng cách phá mã.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
