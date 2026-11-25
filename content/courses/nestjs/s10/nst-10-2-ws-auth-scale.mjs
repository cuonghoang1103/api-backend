/**
 * 10.2 — Xác thực socket, phòng theo tài nguyên, và mở rộng bằng Redis adapter (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, socket.io 4.8.4, @socket.io/redis-adapter 8.3.0, ioredis 5.11.1, Redis 7.4 nst-redis 127.0.0.1:41901, @nestjs/jwt):
 * scratchpad/nst/lab/c10/app/src/b102 (+ b102g: @UseGuards cả lớp) + b102.sh/k102.mjs (an-danh, vao-cua KIEU=connection|middleware TRA_DB_MS=100,
 * idor [KIEM_CHU=1], het-han [HET_HAN=1], origin [ORIGIN=1], cum CUM=1 [REDIS_ADAPTER=1]) ⇒ lab/c10/o/102-*.txt; bài tập src/b102bt (B=b102bt ./b102.sh bt).
 * Sự cố: Gitpod CVE-2023-0957 — Snyk Security Labs 27/02/2023 (đã GET 24/11/2026). Ghép: gen.mjs rồi ghep.sh 102 nst-10-2-ws-auth-scale.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-3-xac-thuc-phan-quyen-socket', title: 'Node.js 11.3 — Xác thực và phân quyền socket', sub: 'Bốn loại token qua bắt tay, kết nối chết mà không biết, nối lại khôi phục gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-4-scale-adapter-backpressure', title: 'Node.js 11.4 — Mở rộng: adapter, sticky session, backpressure', sub: 'Vì sao cần sticky khi có polling, một client chậm ngốn 192 MB — bài này không lặp lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-4-so-huu', title: 'NestJS 7.4 — Quyền theo sở hữu', sub: 'Cùng câu hỏi "lịch này có phải của bạn" — mục 3 hỏi lại trên socket.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🛡️', 'Snyk Security Labs (27/02/2023) — Gitpod remote code execution 0-day vulnerability via WebSockets', 'CSWSH: bắt tay WebSocket không kiểm Origin + xác thực bằng cookie ⇒ chiếm tài khoản qua một liên kết. CVE-2023-0957, vá SaaS 14/02/2023.', 'https://snyk.io/blog/gitpod-remote-code-execution-vulnerability-websockets/'),
  nguon('📘', 'NestJS docs — Guards (WebSockets) và Adapters (Redis)', 'Guard trên @SubscribeMessage; ví dụ RedisIoAdapter với @socket.io/redis-adapter.', 'https://docs.nestjs.com/websockets/adapter'),
  nguon('📘', 'Socket.IO docs — Server options: allowRequest, cors', 'allowRequest(req, cb) chạy ở bắt tay, cho mọi transport; cors chỉ là header của phản hồi HTTP.', 'https://socket.io/docs/v4/server-options/'),
].join('\n');
const MA_BT = "import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport { WsException } from '@nestjs/websockets';\nimport type { Socket } from 'socket.io';\n\n/** Bài tập 10.2: mỗi tin đến, token của socket còn hạn không? Hết hạn ⇒ báo lỗi rồi ngắt. */\n@Injectable()\nexport class WsConHan implements CanActivate {\n  canActivate(ctx: ExecutionContext) {\n    const client = ctx.switchToWs().getClient<Socket>();\n    const exp: number | undefined = client.data.user?.exp;\n    if (!exp) throw new WsException('Chưa đăng nhập');\n    if (exp * 1000 <= Date.now()) {\n      setImmediate(() => client.disconnect(true));     // để sự kiện exception kịp đi trước\n      throw new WsException('Token đã hết hạn — đăng nhập lại');\n    }\n    return true;\n  }\n}";
const OUT_BT = "[SV 7 (token 2 giây)] connect\n[SV 7] theo-doi-lich 1 lúc còn hạn ⇒ {\"ok\":true,\"phong\":\"lich:1\"}\n… 2,5 giây sau\n[SV 7 (token 2 giây)] nhận 'exception': {\"status\":\"error\",\"message\":\"Token đã hết hạn — đăng nhập lại\",\"cause\":{\"pattern\":\"theo-doi-lich\",\"data\":\"1\"}}\n[SV 7 (token 2 giây)] disconnect: io server disconnect (đã nhận 0 thông báo)\n[SV 7] theo-doi-lich 1 lúc hết hạn ⇒ \"không có ack\"\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)";
const MA_XT = "import { JwtService } from '@nestjs/jwt';\nimport type { Socket } from 'socket.io';\n\nexport type NguoiDung = { sub: number; role: 'STUDENT' | 'ADMIN'; exp: number };\nexport const jwt = new JwtService({ secret: 'bi-mat-chi-de-lab-10-2' });\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\n/** Đọc token ở handshake.auth (client gửi bằng io(url, { auth: { token } })) — KHÔNG đọc cookie. */\nexport async function xacThuc(client: Socket): Promise<NguoiDung> {\n  const token = client.handshake.auth?.token;\n  if (typeof token !== 'string') throw new Error('thiếu token');\n  const nd = await jwt.verifyAsync<NguoiDung>(token);\n  await ngu(Number(process.env.TRA_DB_MS ?? 0));     // giả lập tra người dùng trong DB (bị khoá chưa?)\n  if (nd.sub === 9) throw new Error('tài khoản bị khoá');   // SV 9 bị khoá sau khi đã có token\n  return nd;\n}";
const MA_GUARD = "import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\nimport { WsException } from '@nestjs/websockets';\nimport type { Socket } from 'socket.io';\n\n@Injectable()\nexport class WsDaDangNhap implements CanActivate {\n  canActivate(ctx: ExecutionContext) {\n    const client = ctx.switchToWs().getClient<Socket>();\n    if (!client.data.user) throw new WsException('Chưa đăng nhập');\n    return true;\n  }\n}";
const MA_GW = "import { Logger, UseGuards } from '@nestjs/common';\nimport {\n  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage,\n  WebSocketGateway, WebSocketServer, WsException,\n} from '@nestjs/websockets';\nimport type { IncomingMessage } from 'node:http';\nimport type { Server, Socket } from 'socket.io';\nimport { xacThuc } from './xac-thuc.js';\nimport { WsDaDangNhap } from './ws-jwt.guard.js';\n\nconst CHO_PHEP = ['http://localhost:5173'];\nconst CHU_LICH: Record<string, number> = { '1': 7, '2': 8 };       // lịch 1 của SV 7, lịch 2 của SV 8\nconst KIEU = process.env.KIEU ?? 'guard';   // guard | connection | middleware\n\n@WebSocketGateway({\n  cors: { origin: CHO_PHEP, credentials: true },\n  ...(process.env.ORIGIN === '1' && {\n    allowRequest: (req: IncomingMessage, cb: (err: string | null, ok: boolean) => void) => cb(null, CHO_PHEP.includes(req.headers.origin ?? '')),\n  }),\n})\nexport class PhongGateway implements OnGatewayInit, OnGatewayConnection {\n  @WebSocketServer() server: Server;\n  private readonly log = new Logger('PhongGateway');\n\n  afterInit(server: Server) {\n    if (KIEU !== 'middleware') return;\n    server.use((client, next) => {                   // chạy TRƯỚC khi kết nối được chấp nhận\n      xacThuc(client).then((nd) => { client.data.user = nd; next(); }, (e) => next(new Error('unauthorized: ' + e.message)));\n    });\n  }\n\n  async handleConnection(client: Socket) {\n    if (KIEU === 'connection') {\n      try { client.data.user = await xacThuc(client); }\n      catch (e) { this.log.warn(`ngắt ${client.id}: ${(e as Error).message}`); client.disconnect(true); return; }\n    }\n    const nd = client.data.user;\n    if (nd && process.env.HET_HAN === '1') {         // token hết hạn ⇒ tự ngắt đúng lúc đó\n      const t = setTimeout(() => client.disconnect(true), nd.exp * 1000 - Date.now());\n      client.once('disconnect', () => clearTimeout(t));\n    }\n    this.log.log(`+ ${nd ? 'SV ' + nd.sub : 'ẩn danh'} (origin ${client.handshake.headers.origin ?? '-'})`);\n  }\n\n  @UseGuards(WsDaDangNhap)\n  @SubscribeMessage('theo-doi-lich')\n  theoDoi(@MessageBody() lichId: string, @ConnectedSocket() client: Socket) {\n    const nd = client.data.user;\n    if (process.env.KIEM_CHU === '1' && nd.role !== 'ADMIN' && CHU_LICH[lichId] !== nd.sub) {\n      throw new WsException('Không phải lịch của bạn');\n    }\n    void client.join(`lich:${lichId}`);\n    return { ok: true, phong: `lich:${lichId}` };\n  }\n\n  @SubscribeMessage('dem')\n  async dem(@MessageBody() phong: string) {\n    return { cucBo: this.server.sockets.adapter.rooms.get(phong)?.size ?? 0, toanCum: (await this.server.in(phong).fetchSockets()).length };\n  }\n}";
const MA_AD = "import { IoAdapter } from '@nestjs/platform-socket.io';\nimport { createAdapter } from '@socket.io/redis-adapter';\nimport { Redis } from 'ioredis';\nimport type { ServerOptions } from 'socket.io';\n\nexport class RedisIoAdapter extends IoAdapter {\n  private adapterConstructor: ReturnType<typeof createAdapter>;\n  private clients: Redis[] = [];\n\n  async connectToRedis(url: string) {\n    const pub = new Redis(url);\n    const sub = pub.duplicate();                       // kênh SUBSCRIBE phải là kết nối riêng\n    this.clients = [pub, sub];\n    this.adapterConstructor = createAdapter(pub, sub);\n  }\n\n  createIOServer(port: number, options?: ServerOptions) {\n    const server = super.createIOServer(port, options);\n    server.adapter(this.adapterConstructor);\n    return server;\n  }\n\n  async close(server: any) { await super.close(server); this.clients.forEach((c) => c.disconnect()); }\n}";
const MA_MAIN = "import 'reflect-metadata';\nimport { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module.js';\nimport { RedisIoAdapter } from './redis-io.adapter.js';\n\nconst app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });\nif (process.env.REDIS_ADAPTER === '1') {\n  const adapter = new RedisIoAdapter(app);\n  await adapter.connectToRedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:41901');\n  app.useWebSocketAdapter(adapter);\n}\nawait app.listen(Number(process.env.PORT ?? 41971), '127.0.0.1');";
const OUT_ANDANH = "[khách (không token)] connect\n$ curl -X POST 41971/thong-bao -d '{\"n\":3}'\n[khách] đã nhận 3 thông báo phát cho mọi người\n[khách (không token)] nhận 'exception': {\"status\":\"error\",\"message\":\"Chưa đăng nhập\",\"cause\":{\"pattern\":\"theo-doi-lich\",\"data\":\"1\"}}\n[khách (không token)] disconnect: io client disconnect (đã nhận 3 thông báo)\n—— log server .\n[Nest] LOG [PhongGateway] + ẩn danh (origin -)";
const OUT_GUARDLOP = "[khách (không token)] connect\n$ curl -X POST 41971/thong-bao -d '{\"n\":3}'\n[khách] đã nhận 3 thông báo phát cho mọi người\n[khách (không token)] nhận 'exception': {\"status\":\"error\",\"message\":\"Chưa đăng nhập\",\"cause\":{\"pattern\":\"theo-doi-lich\",\"data\":\"1\"}}\n[khách (không token)] disconnect: io client disconnect (đã nhận 3 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + ẩn danh (origin -)";
const OUT_CONN = "$ curl -X POST 41971/thong-bao -d '{\"n\":80}'\n[khách (không token)] connect\n[khách (không token)] disconnect: io server disconnect (đã nhận 0 thông báo)\n[khách (token giả)] connect\n[khách (token giả)] disconnect: io server disconnect (đã nhận 0 thông báo)\n[SV 9 (token thật, tài khoản bị khoá)] connect\n[SV 9 (token thật, tài khoản bị khoá)] disconnect: io server disconnect (đã nhận 21 thông báo)\nkết quả: không token nhận 0, token giả nhận 0, SV 9 bị khoá nhận 21\n—— log server a\n[Nest] WARN [PhongGateway] ngắt 65G6ae_PYQTdITNdAAAA: thiếu token\n[Nest] WARN [PhongGateway] ngắt VhvB_YKorCYvt9mBAAAB: invalid token\n[Nest] WARN [PhongGateway] ngắt 62b_2i0crE6VEyVvAAAC: tài khoản bị khoá";
const OUT_MW = "$ curl -X POST 41971/thong-bao -d '{\"n\":80}'\n[khách (không token)] connect_error: unauthorized: thiếu token\n[khách (token giả)] connect_error: unauthorized: invalid token\n[SV 9 (token thật, tài khoản bị khoá)] connect_error: unauthorized: tài khoản bị khoá\nkết quả: không token nhận 0, token giả nhận 0, SV 9 bị khoá nhận 0\n—— log server a";
const OUT_IDOR = "[SV 7] connect\n[SV 7] theo-doi-lich 2 ⇒ {\"ok\":true,\"phong\":\"lich:2\"}\n$ curl -X POST 41971/lich/2/duyet -d '{\"ghiChu\":\"SV 8, mã cửa phòng lab 4471\"}'\n[SV 7] nhận 'lich-doi': {\"id\":\"2\",\"status\":\"APPROVED\",\"ghiChu\":\"SV 8, mã cửa phòng lab 4471\",\"tu\":\"41971\"}\n[SV 7] disconnect: io client disconnect (đã nhận 0 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)";
const OUT_IDORSUA = "[SV 7] connect\n[SV 7] nhận 'exception': {\"status\":\"error\",\"message\":\"Không phải lịch của bạn\",\"cause\":{\"pattern\":\"theo-doi-lich\",\"data\":\"2\"}}\n[SV 7] theo-doi-lich 2 ⇒ \"không có ack\"\n$ curl -X POST 41971/lich/2/duyet -d '{\"ghiChu\":\"SV 8, mã cửa phòng lab 4471\"}'\n[SV 7] disconnect: io client disconnect (đã nhận 0 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)";
const OUT_HH = "[SV 7 (token 2 giây)] connect\n… 3 giây sau, token đã hết hạn 1 giây\n$ curl -X POST 41971/thong-bao -d '{\"n\":2}'\n[SV 7] connected=true, đã nhận 2 thông báo\n[SV 7 (token 2 giây)] disconnect: io client disconnect (đã nhận 2 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)";
const OUT_HHSUA = "[SV 7 (token 2 giây)] connect\n[SV 7 (token 2 giây)] disconnect: io server disconnect (đã nhận 0 thông báo)\n… 3 giây sau, token đã hết hạn 1 giây\n$ curl -X POST 41971/thong-bao -d '{\"n\":2}'\n[SV 7] connected=false, đã nhận 0 thông báo\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)";
const OUT_ORI = "[trang hợp lệ] connect\n[trang hợp lệ] disconnect: io client disconnect (đã nhận 0 thông báo)\n[evil.example, websocket] connect\n[evil.example, websocket] disconnect: io client disconnect (đã nhận 0 thông báo)\n[evil.example, polling] connect\n[evil.example, polling] disconnect: io client disconnect (đã nhận 0 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + ẩn danh (origin http://localhost:5173)\n[Nest] LOG [PhongGateway] + ẩn danh (origin http://evil.example)\n[Nest] LOG [PhongGateway] + ẩn danh (origin http://evil.example)";
const OUT_ORISUA = "[trang hợp lệ] connect\n[trang hợp lệ] disconnect: io client disconnect (đã nhận 0 thông báo)\n[evil.example, websocket] connect_error: websocket error\n[evil.example, polling] connect_error: xhr poll error\n—— log server a\n[Nest] LOG [PhongGateway] + ẩn danh (origin http://localhost:5173)";
const OUT_CUM = "[SV 7 @41971] connect\n[admin @41972] connect\n[admin] đếm phòng lich:1 ⇒ {\"cucBo\":1,\"toanCum\":1}\n$ curl -X POST 41971/lich/1/duyet -d '{\"ghiChu\":\"duyệt từ bản 1\"}'\n[SV 7 @41971] nhận 'lich-doi': {\"id\":\"1\",\"status\":\"APPROVED\",\"ghiChu\":\"duyệt từ bản 1\",\"tu\":\"41971\"}\n[SV 7 @41971] disconnect: io client disconnect (đã nhận 0 thông báo)\n[admin @41972] disconnect: io client disconnect (đã nhận 0 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)\n—— log server b\n[Nest] LOG [PhongGateway] + SV 1 (origin -)";
const OUT_CUMR = "[SV 7 @41971] connect\n[admin @41972] connect\n[admin] đếm phòng lich:1 ⇒ {\"cucBo\":1,\"toanCum\":2}\n$ curl -X POST 41971/lich/1/duyet -d '{\"ghiChu\":\"duyệt từ bản 1\"}'\n[SV 7 @41971] nhận 'lich-doi': {\"id\":\"1\",\"status\":\"APPROVED\",\"ghiChu\":\"duyệt từ bản 1\",\"tu\":\"41971\"}\n[admin @41972] nhận 'lich-doi': {\"id\":\"1\",\"status\":\"APPROVED\",\"ghiChu\":\"duyệt từ bản 1\",\"tu\":\"41971\"}\n[SV 7 @41971] disconnect: io client disconnect (đã nhận 0 thông báo)\n[admin @41972] disconnect: io client disconnect (đã nhận 0 thông báo)\n—— log server a\n[Nest] LOG [PhongGateway] + SV 7 (origin -)\n—— log server b\n[Nest] LOG [PhongGateway] + SV 1 (origin -)";
export default {
  title: '10.2 — Authenticating sockets, rooms per resource, and scaling with the Redis adapter|||10.2 — Xác thực socket, phòng theo tài nguyên, và mở rộng bằng Redis adapter',
  slug: 'nst-10-2-ws-auth-scale',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn chỗ một socket "đã đăng nhập" nói dối, đo thật trên Nest 12.6: @UseGuards (cả ở lớp) không chặn kết nối nên khách không token vẫn nhận tin phát chung; kiểm JWT trong handleConnection để lọt 21 tin cho tài khoản bị khoá, middleware trong afterInit lọt 0; theo dõi lịch người khác (IDOR qua socket); token hết hạn mà socket vẫn sống. Góc hacker: Gitpod CVE-2023-0957 (2023) và vì sao cors của gateway không chặn được websocket. Cuối cùng: RedisIoAdapter cho hai bản ứng dụng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>10.2 — Four places where a "logged-in" socket lies to you</h2>
<p class="lead">Over HTTP, every request carries its token and every request passes the guard. A socket is different: it is checked — if at all — once, and then lives for hours. Where you check, what you check per room, and what happens when the token expires are all decisions Nest leaves to you. The generic theory (token in the handshake, authenticated ≠ authorized) is in Node.js 11.3; here we measure the Nest-specific traps, then make two instances behave as one with the Redis adapter.</p>

<h3>Everyday analogy: the dormitory gate</h3>
<p>A dormitory checks your card at the gate, not after you are already sitting in the lobby listening to announcements. Being a resident does not open every room — your card opens your floor. And a card that expired last night should stop working at the gate tonight, not "whenever you next swipe it". Gate = handshake middleware, floor = room authorization, expiry = a disconnect timer.</p>

<h3>1. @UseGuards does not guard the connection</h3>
<p>Setup: <code>WsDaDangNhap</code> requires <code>client.data.user</code> and is placed on the handler. A client with no token:</p>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<div class="out">${esc(OUT_ANDANH)}</div>
<p>The guard blocked the message, but the anonymous socket <strong>connected and received all 3 broadcasts</strong>. Guards run per message; nothing in Nest runs a guard on connect. Putting <code>@UseGuards</code> on the whole class changes nothing:</p>
<div class="out">${esc(OUT_GUARDLOP)}</div>

<h3>2. handleConnection or middleware: a 100 ms window</h3>
<p>The gateway below can authenticate in two places. <code>xacThuc</code> verifies the JWT, then simulates a 100 ms database lookup ("is this account locked?"). The server broadcasts every 5 ms; three clients connect in the middle: no token, a forged token, and SV 9 whose token is valid but whose account was locked.</p>
<pre><code class="language-ts">${esc(MA_XT)}</code></pre>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<div class="out">$ # KIEU=connection — kiểm trong handleConnection
${esc(OUT_CONN)}</div>
<div class="out">$ # KIEU=middleware — server.use() trong afterInit
${esc(OUT_MW)}</div>
<ul>
<li><code>handleConnection</code> runs <em>after</em> Socket.IO accepted the socket and put it in the default room. While the async check runs, the socket is a full member: the locked account received <strong>21 broadcasts</strong>. Every client also saw <code>connect</code> first — a front-end that shows "online" on <code>connect</code> is lying too.</li>
<li><code>server.use()</code> registered in <code>afterInit</code> runs <em>before</em> acceptance. <code>next(new Error(…))</code> ⇒ <code>connect_error</code> with your message, zero messages received, no <code>handleConnection</code> call.</li>
<li>The fast rejections (no token, bad signature) leaked nothing in either mode. The leak only appears when the check is slow — exactly the checks that matter: locked users, revoked sessions.</li>
</ul>

<h3>3. Rooms per resource need their own authorization</h3>
<p>SV 7 is logged in. Booking 2 belongs to SV 8. Nothing stops SV 7 from joining <code>lich:2</code>:</p>
<div class="out">${esc(OUT_IDOR)}</div>
<p>That is IDOR over a socket — the same bug as <code>GET /bookings/2</code> without an owner check (lesson 7.4), except the attacker does not even have to poll. Check ownership in the join handler (<code>KIEM_CHU=1</code>):</p>
<div class="out">${esc(OUT_IDORSUA)}</div>

<h3>4. The token expires, the socket does not</h3>
<div class="out">${esc(OUT_HH)}</div>
<p>A 2-second token, still connected and receiving 3 seconds later. Over HTTP the next request would get 401; a socket never makes a "next request". Fix in <code>handleConnection</code>: a timer that disconnects at <code>exp</code> (<code>HET_HAN=1</code>). The client then fetches a new access token with its refresh token and reconnects.</p>
<div class="out">${esc(OUT_HHSUA)}</div>

<h3>⚠️ Hacker corner: Cross-Site WebSocket Hijacking — Gitpod, 2023</h3>
<p>Browsers do not apply the Same-Origin Policy or CORS to WebSocket connections. If a WebSocket server authenticates with <em>cookies</em> and does not check the <code>Origin</code> header, any web page you visit can open a socket to it in your name and both send and read messages. In February 2023 Snyk Security Labs reported exactly that against Gitpod (CVE-2023-0957): the handshake accepted <code>Origin: evil.com</code>, the JSON-RPC channel had no further authentication, and combined with a SameSite cookie bypass it led to full account takeover by visiting a link. Reported 13/02, fixed on gitpod.io 14/02/2023.</p>
<p>The gateway above has <code>cors: { origin: ['http://localhost:5173'] }</code>. Does that help?</p>
<div class="out">$ # chỉ có cors
${esc(OUT_ORI)}</div>
<div class="out">$ # thêm allowRequest kiểm Origin (ORIGIN=1)
${esc(OUT_ORISUA)}</div>
<ul>
<li><code>cors</code> only adds response headers for HTTP long-polling; a browser would refuse to let the page <em>read</em> those responses, but the websocket transport has no CORS at all, and a non-browser client ignores headers anyway. All three connected.</li>
<li><code>allowRequest</code> runs on the handshake for every transport ⇒ the foreign origin is rejected (<code>websocket error</code>, <code>xhr poll error</code>).</li>
<li>Our design (token in <code>handshake.auth</code>, never a cookie) is not exploitable by CSWSH: the attacker's page cannot read the token. Check Origin anyway — the day someone switches to cookie sessions, the gate is already there.</li>
</ul>

<h3>5. Two instances: the Redis adapter</h3>
<p>Two copies of the app behind a load balancer: SV 7 is on 41971, the admin on 41972, both in room <code>lich:1</code>. The approval is posted to 41971.</p>
<pre><code class="language-ts">${esc(MA_AD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">$ # hai bản, adapter mặc định (bộ nhớ trong)
${esc(OUT_CUM)}</div>
<div class="out">$ # hai bản, REDIS_ADAPTER=1
${esc(OUT_CUMR)}</div>
<ul>
<li>No error anywhere in the first run — the admin simply never hears about it. Every room lives in the memory of one process.</li>
<li>With the adapter, <code>server.to(room).emit</code> is published on Redis and every instance delivers to its local sockets. <code>fetchSockets()</code> now counts the whole cluster (2), while the local room map still says 1.</li>
<li>Nest's part is small: subclass <code>IoAdapter</code>, override <code>createIOServer</code>, register with <code>app.useWebSocketAdapter</code> before <code>listen</code>. The subscriber needs its own connection (<code>duplicate()</code>). Sticky sessions for long-polling and backpressure are in Node.js 11.4.</li>
</ul>

<h3>🧪 Exercise (15 min) — reject messages from an expired socket</h3>
<p>The disconnect timer handles broadcasts. Add a second line of defence: a guard <code>WsConHan</code> that, on every message, rejects with <code>WsException('Token đã hết hạn — đăng nhập lại')</code> and disconnects if <code>client.data.user.exp</code> has passed. Test with a 2-second token: a message at 0.3 s works, a message at 2.8 s is rejected and the socket is closed by the server.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>setImmediate</code> lets the <code>exception</code> event leave before the disconnect. The guard alone is not enough: an idle socket sends no messages but still receives broadcasts — keep the timer.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Where do you authenticate a WebSocket in Nest, and why not with a guard?</strong> In a Socket.IO middleware registered in <code>afterInit</code> (or a custom adapter); guards only run per message, and <code>handleConnection</code> runs after the socket is already a room member.</li>
<li><strong>A user is logged in. Can they join any room?</strong> No — authorize the join per resource (owner, role), exactly like an HTTP endpoint.</li>
<li><strong>What happens to a socket when the JWT expires?</strong> Nothing, unless you disconnect it at <code>exp</code>; the client then refreshes and reconnects.</li>
<li><strong>What is CSWSH and does CORS prevent it?</strong> A foreign page opening a socket with your cookies; CORS does not apply to WebSocket — check <code>Origin</code> in <code>allowRequest</code> and prefer tokens over cookies.</li>
<li><strong>Two instances, a client on each, events go missing. Why?</strong> Rooms are per process; add the Redis adapter.</li>
</ol>

<h3>💼 On the job</h3>
<p>Security reviews at outsourcing companies (and the customer's penetration test before go-live) check WebSocket endpoints less often than HTTP ones — which is why findings there hurt. Keep a short checklist in the pull request template for any gateway: handshake rejects no/invalid/revoked token; Origin allow-list; join handlers check ownership; disconnect at token expiry; payloads contain no data the room's audience must not see; Redis adapter configured when replicas &gt; 1.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Handshake middleware</span><span class="v"><code>server.use((socket, next) => …)</code> — runs before the connection is accepted.</span></div>
  <div class="kv"><span class="k">handleConnection</span><span class="v">Lifecycle hook after acceptance; too late to keep secrets.</span></div>
  <div class="kv"><span class="k">CSWSH</span><span class="v">Cross-Site WebSocket Hijacking: a foreign origin uses the victim's cookies on a socket.</span></div>
  <div class="kv"><span class="k">allowRequest</span><span class="v">Socket.IO option called on every handshake; the place for an Origin allow-list.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Relays room broadcasts between instances via Redis pub/sub.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Guards never run on connect — authenticate in handshake middleware; <code>handleConnection</code> leaked 21 messages in 100 ms.</li>
<li>Authorize every room join per resource.</li>
<li>Disconnect at token expiry; optionally re-check per message.</li>
<li><code>cors</code> does not protect websocket transport — <code>allowRequest</code> checks Origin; tokens beat cookies.</li>
<li>More than one instance ⇒ Redis adapter, or broadcasts silently miss users.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>10.2 — Bốn chỗ một socket "đã đăng nhập" nói dối bạn</h2>
<p class="lead">Với HTTP, request nào cũng mang token và request nào cũng qua guard. Socket thì khác: nó được kiểm — nếu có — đúng một lần, rồi sống hàng giờ. Kiểm ở đâu, mỗi phòng kiểm gì, token hết hạn thì sao — Nest để bạn tự quyết hết. Lý thuyết chung (token trong bắt tay, đã xác thực ≠ có quyền) nằm ở Node.js 11.3; ở đây ta đo các bẫy riêng của Nest, rồi cho hai bản ứng dụng chạy như một bằng Redis adapter.</p>

<h3>Liên hệ đời thường: cổng ký túc xá</h3>
<p>Ký túc xá kiểm thẻ ở cổng, không phải sau khi bạn đã ngồi trong sảnh nghe loa thông báo. Là sinh viên ở đây không có nghĩa mở được mọi phòng — thẻ chỉ mở tầng của bạn. Còn thẻ hết hạn từ tối qua thì tối nay phải bị chặn ở cổng, chứ không phải "lần tới bạn quẹt". Cổng = middleware lúc bắt tay, tầng = quyền vào phòng, hết hạn = bộ hẹn giờ ngắt kết nối.</p>

<h3>1. @UseGuards không gác cửa kết nối</h3>
<p>Dựng: <code>WsDaDangNhap</code> đòi có <code>client.data.user</code>, gắn ở handler. Một client không token:</p>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<div class="out">${esc(OUT_ANDANH)}</div>
<p>Guard chặn được tin nhắn, nhưng socket ẩn danh <strong>vẫn nối được và nhận đủ 3 tin phát chung</strong>. Guard chạy theo từng tin; trong Nest không có gì chạy guard lúc kết nối. Gắn <code>@UseGuards</code> lên cả lớp cũng không đổi gì:</p>
<div class="out">${esc(OUT_GUARDLOP)}</div>

<h3>2. handleConnection hay middleware: khe hở 100 ms</h3>
<p>Gateway dưới đây xác thực được ở hai chỗ. <code>xacThuc</code> kiểm JWT rồi giả lập 100 ms tra DB ("tài khoản này bị khoá chưa?"). Server phát tin mỗi 5 ms; ba client nối vào giữa chừng: không token, token giả, và SV 9 có token thật nhưng tài khoản đã bị khoá.</p>
<pre><code class="language-ts">${esc(MA_XT)}</code></pre>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<div class="out">$ # KIEU=connection — kiểm trong handleConnection
${esc(OUT_CONN)}</div>
<div class="out">$ # KIEU=middleware — server.use() trong afterInit
${esc(OUT_MW)}</div>
<ul>
<li><code>handleConnection</code> chạy <em>sau khi</em> Socket.IO đã nhận socket và cho vào room mặc định. Trong lúc kiểm bất đồng bộ, socket là thành viên đầy đủ: tài khoản bị khoá nhận <strong>21 tin</strong>. Client nào cũng thấy <code>connect</code> trước — front-end hiện "đang trực tuyến" khi có <code>connect</code> cũng đang nói dối.</li>
<li><code>server.use()</code> đăng ký trong <code>afterInit</code> chạy <em>trước khi</em> nhận. <code>next(new Error(…))</code> ⇒ <code>connect_error</code> mang thông điệp của bạn, không nhận tin nào, không gọi <code>handleConnection</code>.</li>
<li>Các ca bị từ chối nhanh (không token, sai chữ ký) không lọt gì ở cả hai cách. Lỗ chỉ lộ khi phép kiểm chậm — đúng những phép kiểm quan trọng: tài khoản bị khoá, phiên bị thu hồi.</li>
</ul>

<h3>3. Phòng theo tài nguyên cần phân quyền riêng</h3>
<p>SV 7 đã đăng nhập. Lịch 2 là của SV 8. Không gì ngăn SV 7 vào <code>lich:2</code>:</p>
<div class="out">${esc(OUT_IDOR)}</div>
<p>Đó là IDOR qua socket — cùng lỗi với <code>GET /bookings/2</code> không kiểm chủ (bài 7.4), chỉ khác là kẻ tấn công còn chẳng cần hỏi lại. Kiểm chủ sở hữu ngay trong handler vào phòng (<code>KIEM_CHU=1</code>):</p>
<div class="out">${esc(OUT_IDORSUA)}</div>

<h3>4. Token hết hạn, socket thì không</h3>
<div class="out">${esc(OUT_HH)}</div>
<p>Token 2 giây, 3 giây sau vẫn nối và vẫn nhận tin. Với HTTP thì request kế tiếp sẽ nhận 401; socket chẳng bao giờ có "request kế tiếp". Sửa trong <code>handleConnection</code>: một bộ hẹn giờ ngắt đúng lúc <code>exp</code> (<code>HET_HAN=1</code>). Client lấy access token mới bằng refresh token rồi nối lại.</p>
<div class="out">${esc(OUT_HHSUA)}</div>

<h3>⚠️ Góc hacker: Cross-Site WebSocket Hijacking — Gitpod, 2023</h3>
<p>Trình duyệt không áp Same-Origin Policy hay CORS cho kết nối WebSocket. Nếu server WebSocket xác thực bằng <em>cookie</em> và không kiểm header <code>Origin</code>, bất kỳ trang web nào bạn ghé cũng mở được socket tới nó dưới tên bạn, vừa gửi vừa đọc được tin. Tháng 2/2023 Snyk Security Labs báo đúng lỗi đó ở Gitpod (CVE-2023-0957): bắt tay chấp nhận <code>Origin: evil.com</code>, kênh JSON-RPC không xác thực gì thêm, cộng một cách vượt cookie SameSite ⇒ chiếm trọn tài khoản chỉ bằng việc bấm một liên kết. Báo ngày 13/02, gitpod.io vá ngày 14/02/2023.</p>
<p>Gateway ở trên có <code>cors: { origin: ['http://localhost:5173'] }</code>. Có giúp được không?</p>
<div class="out">$ # chỉ có cors
${esc(OUT_ORI)}</div>
<div class="out">$ # thêm allowRequest kiểm Origin (ORIGIN=1)
${esc(OUT_ORISUA)}</div>
<ul>
<li><code>cors</code> chỉ thêm header vào phản hồi HTTP của long-polling; trình duyệt sẽ không cho trang <em>đọc</em> phản hồi đó, nhưng transport websocket hoàn toàn không có CORS, còn client ngoài trình duyệt thì bỏ qua header. Cả ba đều nối được.</li>
<li><code>allowRequest</code> chạy ở bắt tay cho mọi transport ⇒ origin lạ bị từ chối (<code>websocket error</code>, <code>xhr poll error</code>).</li>
<li>Thiết kế của ta (token trong <code>handshake.auth</code>, không bao giờ là cookie) không bị CSWSH khai thác: trang của kẻ tấn công không đọc được token. Vẫn kiểm Origin — hôm nào có người chuyển sang phiên cookie thì cổng đã sẵn đó.</li>
</ul>

<h3>5. Hai bản ứng dụng: Redis adapter</h3>
<p>Hai bản sao ứng dụng sau load balancer: SV 7 ở 41971, admin ở 41972, cả hai trong phòng <code>lich:1</code>. Lệnh duyệt gửi vào 41971.</p>
<pre><code class="language-ts">${esc(MA_AD)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">$ # hai bản, adapter mặc định (bộ nhớ trong)
${esc(OUT_CUM)}</div>
<div class="out">$ # hai bản, REDIS_ADAPTER=1
${esc(OUT_CUMR)}</div>
<ul>
<li>Lần chạy đầu không có lỗi nào — admin chỉ đơn giản là không bao giờ biết. Mỗi room sống trong bộ nhớ của một tiến trình.</li>
<li>Có adapter, <code>server.to(room).emit</code> được publish lên Redis và mỗi bản giao cho socket tại chỗ của mình. <code>fetchSockets()</code> giờ đếm cả cụm (2), còn bảng room cục bộ vẫn báo 1.</li>
<li>Phần của Nest rất nhỏ: kế thừa <code>IoAdapter</code>, ghi đè <code>createIOServer</code>, đăng ký bằng <code>app.useWebSocketAdapter</code> trước <code>listen</code>. Kết nối subscribe phải riêng (<code>duplicate()</code>). Sticky session cho long-polling và backpressure ở Node.js 11.4.</li>
</ul>

<h3>🧪 Thực hành (15 phút) — từ chối tin của socket đã hết hạn</h3>
<p>Bộ hẹn giờ lo phần tin phát đi. Thêm lớp phòng thủ thứ hai: guard <code>WsConHan</code>, với mỗi tin đến, nếu <code>client.data.user.exp</code> đã qua thì ném <code>WsException('Token đã hết hạn — đăng nhập lại')</code> và ngắt kết nối. Kiểm bằng token 2 giây: tin ở giây 0,3 chạy được, tin ở giây 2,8 bị từ chối và server đóng socket.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>setImmediate</code> để sự kiện <code>exception</code> kịp đi trước khi ngắt. Chỉ guard thôi chưa đủ: socket ngồi im không gửi tin nhưng vẫn nhận tin phát — giữ bộ hẹn giờ.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Trong Nest xác thực WebSocket ở đâu, sao không dùng guard?</strong> Ở middleware Socket.IO đăng ký trong <code>afterInit</code> (hoặc adapter tự viết); guard chỉ chạy theo từng tin, còn <code>handleConnection</code> chạy khi socket đã là thành viên room.</li>
<li><strong>Người dùng đã đăng nhập thì vào được mọi phòng không?</strong> Không — phân quyền từng lần vào phòng theo tài nguyên (chủ sở hữu, vai trò), y như một endpoint HTTP.</li>
<li><strong>JWT hết hạn thì socket ra sao?</strong> Chẳng sao cả, trừ khi bạn ngắt nó đúng lúc <code>exp</code>; client làm mới token rồi nối lại.</li>
<li><strong>CSWSH là gì, CORS có chặn được không?</strong> Trang lạ mở socket bằng cookie của nạn nhân; CORS không áp cho WebSocket — kiểm <code>Origin</code> trong <code>allowRequest</code> và ưu tiên token hơn cookie.</li>
<li><strong>Hai bản ứng dụng, mỗi bản một client, sự kiện bị mất. Vì sao?</strong> Room nằm trong từng tiến trình; thêm Redis adapter.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Buổi review bảo mật ở công ty outsourcing (và đợt pentest của khách trước khi lên production) soi endpoint WebSocket ít hơn HTTP — nên lỗi ở đó mới đau. Giữ một danh sách kiểm ngắn trong mẫu pull request cho mọi gateway: bắt tay từ chối token thiếu/sai/bị thu hồi; danh sách Origin cho phép; handler vào phòng kiểm chủ; ngắt khi token hết hạn; payload không chứa dữ liệu mà người trong phòng không được thấy; có Redis adapter khi số bản &gt; 1.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Middleware bắt tay</span><span class="v"><code>server.use((socket, next) => …)</code> — chạy trước khi kết nối được nhận.</span></div>
  <div class="kv"><span class="k">handleConnection</span><span class="v">Hook vòng đời sau khi đã nhận; quá muộn để giữ bí mật.</span></div>
  <div class="kv"><span class="k">CSWSH</span><span class="v">Cross-Site WebSocket Hijacking: origin lạ dùng cookie của nạn nhân trên socket.</span></div>
  <div class="kv"><span class="k">allowRequest</span><span class="v">Tuỳ chọn Socket.IO gọi ở mọi lần bắt tay; chỗ đặt danh sách Origin cho phép.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Chuyển tin phát theo room giữa các bản qua Redis pub/sub.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Guard không bao giờ chạy lúc kết nối — xác thực ở middleware bắt tay; <code>handleConnection</code> lọt 21 tin trong 100 ms.</li>
<li>Phân quyền mọi lần vào phòng theo tài nguyên.</li>
<li>Ngắt khi token hết hạn; có thể kiểm thêm mỗi tin.</li>
<li><code>cors</code> không bảo vệ transport websocket — <code>allowRequest</code> kiểm Origin; token tốt hơn cookie.</li>
<li>Hơn một bản ứng dụng ⇒ Redis adapter, nếu không tin phát lặng lẽ trượt người nhận.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
