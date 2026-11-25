/**
 * 10.1 — WebSocket gateway: @WebSocketGateway, @SubscribeMessage, adapter Socket.IO và ws (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/websockets + platform-socket.io + platform-ws 12.6.0, socket.io 4.8.4, ws 8.23.0):
 * scratchpad/nst/lab/c10/app/src/b101 + b101.sh/k101.mjs (co-ban, loi, kiem, kiem PIPE_WS=1, tran, tran PIPE_GLOBAL=1, ws ADAPTER=ws, ws-sio) ⇒ lab/c10/o/101-*.txt;
 * bài tập: src/b101bt (B=b101bt ./b101.sh bt). Ghép: web-tool/c10/gen.mjs rồi ghep.sh 101 nst-10-1-gateway.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-1-websocket-co-ban', title: 'Node.js 11.1 — WebSocket từ cái bắt tay', sub: 'Polling tốn bao nhiêu, bắt tay in từng byte, máy chủ nhỏ nhất — bài này không giảng lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-2-ws-vs-socketio-rooms', title: 'Node.js 11.2 — ws hay Socket.IO, room và ack', sub: 'Bộ nhớ mỗi kết nối, mô hình địa chỉ room — nền của mục 1 và 5.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-2-exception-filter', title: 'NestJS 3.2 — Exception filter', sub: 'Filter HTTP; mục 3 cho thấy bản WebSocket khác ở đâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-4-1-dto-validation', title: 'NestJS 4.1 — DTO và ValidationPipe', sub: 'Cùng DTO, cùng pipe — mục 4 đo nó chạy trên socket.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Gateways', '@WebSocketGateway, @SubscribeMessage, @MessageBody, @ConnectedSocket, ack và { event, data }, lifecycle hook.', 'https://docs.nestjs.com/websockets/gateways'),
  nguon('📘', 'NestJS docs — Exception filters (WebSockets)', 'WsException, BaseWsExceptionFilter và sự kiện "exception".', 'https://docs.nestjs.com/websockets/exception-filters'),
  nguon('📘', 'NestJS docs — Adapters', 'IoAdapter (mặc định), WsAdapter của @nestjs/platform-ws, tự viết adapter.', 'https://docs.nestjs.com/websockets/adapter'),
].join('\n');
const MA_BT = "\n  @SubscribeMessage('roi')\n  roi(@MessageBody() phong: string, @ConnectedSocket() client: Socket) {\n    void client.leave(`phong:${phong}`);\n    return { ok: true };\n  }\n\n  @SubscribeMessage('dem')\n  async dem(@MessageBody() phong: unknown) {\n    if (typeof phong !== 'string' || !/^L\\d{1,2}$/.test(phong)) return { ok: false, loi: 'MA_PHONG_SAI' };   // lỗi đi trong ack\n    return { ok: true, phong, dangXem: (await this.server.in(`phong:${phong}`).fetchSockets()).length };\n  }";
const OUT_BT = "dem L1 ⇒ {\"ok\":true,\"phong\":\"L1\",\"dangXem\":2}\n[Binh] roi L1 ⇒ {\"ok\":true}\ndem L1 ⇒ {\"ok\":true,\"phong\":\"L1\",\"dangXem\":1}\ndem 'L1; DROP' ⇒ {\"ok\":false,\"loi\":\"MA_PHONG_SAI\"}";
const MA_GW = "import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';\nimport {\n  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,\n  SubscribeMessage, WebSocketGateway, WebSocketServer, WsException,\n} from '@nestjs/websockets';\nimport type { Server, Socket } from 'socket.io';\nimport { RoomsService } from './rooms.service.js';\nimport { DoiTrangThaiDto } from './dat.dto.js';\n\nconst PIPE_WS = process.env.PIPE_WS === '1'\n  ? new ValidationPipe({ exceptionFactory: (loi) => new WsException(loi.map((e) => Object.values(e.constraints ?? {})).flat()) })\n  : new ValidationPipe();\n\n@WebSocketGateway(Number(process.env.WS_PORT ?? 0) || undefined)   // không số ⇒ dùng chung cổng HTTP\nexport class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {\n  @WebSocketServer() server: Server;\n  private readonly log = new Logger(BoardGateway.name);\n\n  constructor(private readonly rooms: RoomsService) {}\n\n  afterInit() { this.log.log('afterInit: server WebSocket đã tạo'); }\n  handleConnection(client: Socket) { this.log.log(`+ ${client.data.ten = client.handshake.query.ten} (${this.server.engine.clientsCount} kết nối)`); }\n  handleDisconnect(client: Socket) { this.log.log(`- ${client.data.ten}`); }\n\n  @SubscribeMessage('ping')\n  ping(@MessageBody() data: unknown) {\n    return { pong: data, luc: 'server' };          // giá trị trả về ⇒ ack cho client\n  }\n\n  @SubscribeMessage('xem')\n  xem(@MessageBody() phong: string, @ConnectedSocket() client: Socket) {\n    void client.join(`phong:${phong}`);           // phòng theo tài nguyên\n    return this.rooms.get(phong);\n  }\n\n  @SubscribeMessage('hoi')\n  hoi() {\n    return { event: 'tra-loi', data: { gio: 'server trả bằng một sự kiện khác' } };\n  }\n\n  @SubscribeMessage('loi')\n  loi(@MessageBody() kieu: string) {\n    if (kieu === 'ws') throw new WsException('Phòng không tồn tại');\n    throw new Error('lỗi nội bộ: mật khẩu DB = hunter2');\n  }\n\n  @UsePipes(PIPE_WS)\n  @SubscribeMessage('doi')\n  doi(@MessageBody() dto: DoiTrangThaiDto) {\n    const kq = this.rooms.set(dto.phong, dto.trangThai);\n    this.phat(kq);\n    return { ok: true };\n  }\n\n  @SubscribeMessage('doi-tran')                    // không @UsePipes: chỉ có pipe toàn cục (nếu bật)\n  doiTran(@MessageBody() dto: DoiTrangThaiDto) {\n    return this.rooms.set(dto.phong, dto.trangThai);\n  }\n\n  phat(kq: { id: string; trangThai: unknown }) {\n    this.server.to(`phong:${kq.id}`).emit('trang-thai', kq);   // chỉ ai đang xem phòng đó\n  }\n}";
const MA_CTRL = "import { Body, Controller, Param, Post } from '@nestjs/common';\nimport { RoomsService, type TrangThai } from './rooms.service.js';\nimport { BoardGateway } from './board.gateway.js';\n\n@Controller('rooms')\nexport class RoomsController {\n  constructor(private readonly rooms: RoomsService, private readonly board: BoardGateway) {}\n\n  @Post(':id/status')\n  doi(@Param('id') id: string, @Body('trangThai') t: TrangThai) {\n    const kq = this.rooms.set(id, t);\n    this.board.phat(kq);                 // gateway là provider ⇒ tiêm được vào controller\n    return kq;\n  }\n\n  @Post('thong-bao')\n  thongBao(@Body('noiDung') noiDung: string) {\n    this.board.server.emit('thong-bao', noiDung);   // mọi socket đang nối\n    return { daGui: this.board.server.engine.clientsCount };\n  }\n}";
const MA_MAIN = "import 'reflect-metadata';\nimport { ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { WsAdapter } from '@nestjs/platform-ws';\nimport { AppModule } from './app.module.js';\n\nconst app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });\nif (process.env.ADAPTER === 'ws') app.useWebSocketAdapter(new WsAdapter(app));\nif (process.env.PIPE_GLOBAL === '1') app.useGlobalPipes(new ValidationPipe());\nawait app.listen(Number(process.env.PORT ?? 41961), '127.0.0.1');";
const MA_DTO = "import { IsIn, IsString, Length } from 'class-validator';\n\nexport class DoiTrangThaiDto {\n  @IsString() @Length(2, 10) phong: string;\n  @IsIn(['TRONG', 'DANG_DUNG', 'BAO_TRI']) trangThai: 'TRONG' | 'DANG_DUNG' | 'BAO_TRI';\n}";
const OUT_COBAN = "[An] ack ping: {\"pong\":42,\"luc\":\"server\"}\n[An] xem L1 ⇒ {\"id\":\"L1\",\"trangThai\":\"TRONG\"}\n[Binh] xem L2 ⇒ {\"id\":\"L2\",\"trangThai\":\"TRONG\"}\n$ curl -X POST /rooms/L1/status -d '{\"trangThai\":\"DANG_DUNG\"}'\n[An] nhận 'trang-thai': {\"id\":\"L1\",\"trangThai\":\"DANG_DUNG\"}\n201 {\"id\":\"L1\",\"trangThai\":\"DANG_DUNG\"}\n$ curl -X POST /rooms/thong-bao -d '{\"noiDung\":\"Bảo trì 22h\"}'\n[An] nhận 'thong-bao': \"Bảo trì 22h\"\n[Binh] nhận 'thong-bao': \"Bảo trì 22h\"\n201 {\"daGui\":2}\n[An] nhận 'tra-loi': {\"gio\":\"server trả bằng một sự kiện khác\"}\n[An] emit không callback ⇒ không có gì quay về\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] LOG [BoardGateway] + Binh (2 kết nối)\n[Nest] LOG [BoardGateway] - An\n[Nest] LOG [BoardGateway] - Binh";
const OUT_LOI = "[An] nhận 'exception': {\"status\":\"error\",\"message\":\"Phòng không tồn tại\",\"cause\":{\"pattern\":\"loi\",\"data\":\"ws\"}}\n[An] nhận 'exception': {\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"loi\",\"data\":\"thuong\"}}\n[An] nhận 'exception': {\"status\":\"error\",\"message\":\"Phòng không tồn tại\",\"cause\":{\"pattern\":\"loi\",\"data\":\"ws\"}}\n[An] ack khi lỗi: \"hết giờ chờ ack: operation has timed out\"\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"xem\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"hoi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"loi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi-tran\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] ERROR [WsExceptionsHandler] Error: lỗi nội bộ: mật khẩu DB = hunter2\n    at BoardGateway.loi (file:///home/sv/app/dist/b101/board.gateway.js:44:15)\n    at file:///home/sv/app/node_modules/@nestjs/websockets/context/ws-context-creator.js:51:33\n    at InterceptorsConsumer.intercept (file:///home/sv/app/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:11:20)\n    … (các khung gọi khác)\n[Nest] LOG [BoardGateway] - An";
const OUT_KIEM = "[An] doi hợp lệ ⇒ {\"ok\":true}\n[An] nhận 'exception': {\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"doi\",\"data\":{\"phong\":\"L1\",\"trangThai\":\"NO_TUNG\",\"admin\":true}}}\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +1ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"xem\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"hoi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"loi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi-tran\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] LOG [BoardGateway] - An";
const OUT_KIEMWS = "[An] doi hợp lệ ⇒ {\"ok\":true}\n[An] nhận 'exception': [\"trangThai must be one of the following values: TRONG, DANG_DUNG, BAO_TRI\"]\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +1ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"xem\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"hoi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"loi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi-tran\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +2ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] LOG [BoardGateway] - An";
const OUT_TRAN = "[An] doi-tran sai kiểu ⇒ {\"id\":\"L1\",\"trangThai\":\"NO_TUNG\"}\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +1ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"xem\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"hoi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"loi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi-tran\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +2ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] LOG [BoardGateway] - An";
const OUT_TRANG = "[An] nhận 'exception': {\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"doi-tran\",\"data\":{\"phong\":\"L1\",\"trangThai\":\"NO_TUNG\"}}}\n[An] doi-tran sai kiểu ⇒ \"hết giờ chờ ack\"\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"ping\" message +1ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"xem\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"hoi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"loi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi\" message +0ms\n[Nest] LOG [WebSocketsController] BoardGateway subscribed to the \"doi-tran\" message +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] LOG [BoardGateway] + An (1 kết nối)\n[Nest] LOG [BoardGateway] - An";
const OUT_WS = "> gửi {event:'ping', data:42}\n[ws] nhận: {\"event\":\"exception\",\"data\":{\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"handleConnection\"}}}\n[ws] nhận: {\"pong\":42,\"luc\":\"server\"}\n> gửi {event:'xem', data:'L1'}\n[ws] nhận: {\"event\":\"exception\",\"data\":{\"status\":\"error\",\"message\":\"Internal server error\",\"cause\":{\"pattern\":\"xem\",\"data\":\"L1\"}}}\n> gửi 'ping' (không phải JSON)\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] ERROR [WsExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'query')\n    at BoardGateway.handleConnection (file:///home/sv/app/dist/b101/board.gateway.js:29:85)\n    at file:///home/sv/app/node_modules/@nestjs/websockets/web-sockets-controller.js:395:37\n    … (các khung gọi khác)\n[Nest] ERROR [WsExceptionsHandler] TypeError: client.join is not a function\n    at BoardGateway.xem (file:///home/sv/app/dist/b101/board.gateway.js:35:21)\n    at file:///home/sv/app/node_modules/@nestjs/websockets/context/ws-context-creator.js:51:33\n    … (các khung gọi khác)\n[Nest] ERROR [WsExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'ten')\n    at BoardGateway.handleDisconnect (file:///home/sv/app/dist/b101/board.gateway.js:30:62)\n    at file:///home/sv/app/node_modules/@nestjs/websockets/web-sockets-controller.js:395:37\n    … (các khung gọi khác)";
const OUT_WSSIO = "[sio] connect_error: websocket error\n—— log server\n[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [BoardGateway] afterInit: server WebSocket đã tạo\n[Nest] LOG [NestApplication] Nest application successfully started +2ms";
export default {
  title: '10.1 — WebSocket gateways: @WebSocketGateway, @SubscribeMessage, Socket.IO and ws adapters|||10.1 — WebSocket gateway: @WebSocketGateway, @SubscribeMessage, adapter Socket.IO và ws',
  slug: 'nst-10-1-gateway',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gateway là một provider: tiêm service vào nó, tiêm nó vào controller. Đo thật trên Nest 12.6 + Socket.IO 4.8: giá trị trả về thành ack, { event, data } thành sự kiện khác, phát cho phòng và cho tất cả. Ba bẫy: lỗi trong handler ⇒ ack không bao giờ về; ValidationPipe trên socket ⇒ "Internal server error" và server không ghi log; đổi sang WsAdapter thì gateway viết cho Socket.IO hỏng ngay lúc kết nối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>10.1 — A gateway is a provider that speaks WebSocket</h2>
<p class="lead">The booking system needs a live board: when room L1 becomes busy, every open tab watching L1 changes colour without refreshing. How WebSocket works, what Socket.IO adds and how rooms address sockets is in the Node.js course, chapter 11 (links at the end). This lesson is only what Nest puts on top: the gateway class, its decorators, how errors and validation behave on a socket — which is not how they behave over HTTP — and what changes when you swap the adapter.</p>

<h3>Everyday analogy: the departure board at a station</h3>
<p>Nobody at a train station walks to the counter every minute to ask "is my train late?". The board updates itself; you look at the line for your platform. The board is the gateway, each platform is a room, and the station announcement that everyone hears is <code>server.emit</code>. The counter is still there for questions (HTTP), and it is the counter clerk who changes the board.</p>

<h3>1. The gateway, a controller that calls it, and a real run</h3>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Two Socket.IO clients (An watches L1, Bình watches L2), then two HTTP calls:</p>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><strong>The return value of a handler is the ack.</strong> <code>emitWithAck('ping', 42)</code> got <code>{"pong":42,…}</code>. If the client emits without a callback, the same return value goes nowhere (last line).</li>
<li><strong>Returning <code>{ event, data }</code></strong> sends a different event back to the same client (<code>'tra-loi'</code>) instead of an ack.</li>
<li><strong><code>server.to('phong:L1').emit</code></strong> reached An only; <code>server.emit</code> reached both. The room name is your addressing scheme — name it after the resource (<code>phong:&lt;id&gt;</code>), not after the user.</li>
<li><strong>The gateway is injected into the controller</strong> like any provider. HTTP changes the state, the gateway broadcasts it. Nest logs <code>subscribed to the "ping" message</code> for every handler at startup — a quick check that a handler was registered.</li>
<li><code>@WebSocketGateway()</code> without a port shares the HTTP port (one server, one TLS certificate, one proxy rule). <code>@WebSocketGateway(41962)</code> opens a separate server — rarely worth it.</li>
<li>Lifecycle: <code>afterInit</code> once when the server exists, <code>handleConnection</code> / <code>handleDisconnect</code> per socket. Lesson 10.2 shows why <code>handleConnection</code> is the wrong place for authentication.</li>
</ul>

<h3>2. Errors: the client may wait forever</h3>
<div class="out">${esc(OUT_LOI)}</div>
<ul>
<li><code>WsException('Phòng không tồn tại')</code> ⇒ an <code>exception</code> event with your message. Any other error ⇒ <code>"Internal server error"</code> to the client and the full stack in the server log — the database password in the message did not leak. Good.</li>
<li>But look at the last line: <strong>the ack never came</strong>. A handler that throws sends an <code>exception</code> event, not an ack, so a client awaiting <code>emitWithAck</code> waits until its own timeout — or forever if it has none. Two rules follow: clients always use <code>socket.timeout(ms).emitWithAck(…)</code>; expected business errors ("room full", "not found") go <em>inside the ack</em> as <code>{ ok: false, error }</code>; exceptions are for bugs.</li>
<li><code>cause</code> echoes the pattern and the data the client sent. Harmless here, but do not put secrets in a WsException object.</li>
</ul>

<h3>3. Validation on a socket: same pipe, different result</h3>
<p>Handler <code>doi</code> has <code>@UsePipes(new ValidationPipe())</code> and the DTO below. An sends a wrong status and an extra field:</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<div class="out">${esc(OUT_KIEM)}</div>
<p>The pipe worked — the invalid status was rejected — but the client only learns "Internal server error", and the server log is <strong>empty</strong>: <code>ValidationPipe</code> throws <code>BadRequestException</code>, an HTTP exception; the WebSocket filter does not know it, hides it and does not log it either. Fix: make the pipe throw a <code>WsException</code> (<code>PIPE_WS</code> in the gateway code):</p>
<div class="out">${esc(OUT_KIEMWS)}</div>
<p>Do global pipes apply to gateways? Handler <code>doi-tran</code> has no pipe. Without a global pipe the invalid status is <strong>saved</strong>; with <code>app.useGlobalPipes(new ValidationPipe())</code> it is rejected — so yes, in a normal application global pipes run for gateways too (lesson 10.3 shows the exception: hybrid apps).</p>
<div class="out">$ # không pipe nào
${esc(OUT_TRAN)}

$ # PIPE_GLOBAL=1
${esc(OUT_TRANG)}</div>

<h3>4. Swapping the adapter is not a config change</h3>
<p><code>app.useWebSocketAdapter(new WsAdapter(app))</code> from <code>@nestjs/platform-ws</code> replaces Socket.IO with the plain <code>ws</code> library: less memory per connection, any WebSocket client can connect. Same gateway, raw <code>ws</code> client sending <code>{ event, data }</code> JSON:</p>
<div class="out">${esc(OUT_WS)}</div>
<div class="out">$ # client Socket.IO vào server ws thuần
${esc(OUT_WSSIO)}</div>
<ul>
<li>The handler code still ran (<code>ping</code> answered), but everything Socket.IO-specific broke: no <code>client.handshake</code> (crash in <code>handleConnection</code>), no <code>client.join</code>, no rooms, no ack — the return value arrives as a plain JSON message.</li>
<li>A non-JSON message is dropped silently. A Socket.IO client cannot connect to a ws server at all — the protocols are different.</li>
<li>So the adapter is part of the contract with the front-end. Choose once, at the start: Socket.IO when you need rooms, acks, reconnection and a Redis adapter (most business apps); <code>ws</code> when clients are not browsers you control (IoT, other languages) or connection count matters more than features.</li>
</ul>

<h3>🧪 Exercise (15 min) — "who is watching this room?"</h3>
<p>Add two handlers to <code>BoardGateway</code>: <code>roi</code> (leave a room) and <code>dem</code> (count sockets watching a room, using <code>server.in(room).fetchSockets()</code>). A malformed room code must return <code>{ ok: false }</code> in the ack, not throw. Check with two clients: both watch L1 ⇒ 2; one leaves ⇒ 1; <code>'L1; DROP'</code> ⇒ error in the ack, no timeout.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Why <code>fetchSockets()</code> and not <code>server.sockets.adapter.rooms.get(room).size</code>? The second only counts this process; with the Redis adapter (10.2) <code>fetchSockets</code> asks every instance.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>What is a gateway in Nest, and how is it different from a controller?</strong> A provider bound to a WebSocket server instead of HTTP routes. Same DI, same guards/pipes/interceptors/filters, but handlers are keyed by event name and the return value is an ack.</li>
<li><strong>The client awaited an ack and hung. Why?</strong> The handler threw; Nest sent an <code>exception</code> event, not an ack. Use client timeouts and return business errors inside the ack.</li>
<li><strong>Does ValidationPipe work on WebSocket messages?</strong> It validates, but throws an HTTP exception that the WS filter turns into "Internal server error" without logging. Use <code>exceptionFactory</code> ⇒ <code>WsException</code>.</li>
<li><strong>Socket.IO or ws in Nest?</strong> Socket.IO for rooms, acks, reconnection, horizontal scaling with an adapter; ws for lighter connections and non-Socket.IO clients. They are not wire-compatible, so it is an early decision.</li>
</ol>

<h3>💼 On the job</h3>
<p>Outsourcing projects often receive "add realtime notifications" as a one-line change request. Before writing a gateway, agree with the front-end team on three things in writing: the library and major version of the client (Socket.IO 4 client ⇒ Socket.IO 4 server), the list of event names with their payloads, and how errors come back (ack with <code>ok:false</code>, or an <code>exception</code> event). <a href="https://www.asyncapi.com/" target="_blank" rel="noopener">AsyncAPI</a> is to events what OpenAPI is to HTTP; even a short table in the wiki saves a week of "the event does not arrive".</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Gateway</span><span class="v">Provider marked <code>@WebSocketGateway()</code>; its handlers answer WebSocket events.</span></div>
  <div class="kv"><span class="k">@SubscribeMessage(event)</span><span class="v">Marks a handler; the return value becomes the ack.</span></div>
  <div class="kv"><span class="k">@WebSocketServer()</span><span class="v">Injects the underlying server (Socket.IO <code>Server</code>) to emit outside handlers.</span></div>
  <div class="kv"><span class="k">WsException</span><span class="v">The exception the WS filter forwards to the client as an <code>exception</code> event.</span></div>
  <div class="kv"><span class="k">Adapter</span><span class="v">The library under the gateway: <code>IoAdapter</code> (default) or <code>WsAdapter</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A gateway is a provider: inject services into it, inject it into controllers to broadcast after HTTP changes.</li>
<li>Return value = ack; <code>{ event, data }</code> = another event; rooms named after resources.</li>
<li>Errors never produce an ack ⇒ client timeouts, and business errors inside the ack.</li>
<li>ValidationPipe on sockets needs <code>exceptionFactory ⇒ WsException</code>; global pipes do apply to gateways in a normal app.</li>
<li>The adapter is a protocol choice, not a config switch.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>10.1 — Gateway là một provider biết nói WebSocket</h2>
<p class="lead">Hệ thống đặt lịch cần một bảng trực tiếp: khi phòng L1 chuyển sang bận, mọi tab đang xem L1 đổi màu mà không cần tải lại. WebSocket chạy thế nào, Socket.IO thêm gì, room đánh địa chỉ socket ra sao — đã có ở khoá Node.js chương 11 (liên kết cuối bài). Bài này chỉ dạy phần Nest đặt lên trên: lớp gateway, các decorator, lỗi và kiểm dữ liệu trên socket — vốn KHÁC hẳn trên HTTP — và chuyện gì đổi khi thay adapter.</p>

<h3>Liên hệ đời thường: bảng giờ tàu ở nhà ga</h3>
<p>Ở ga tàu không ai phút nào cũng ra quầy hỏi "tàu tôi trễ chưa?". Bảng điện tử tự cập nhật; bạn chỉ nhìn dòng của sân ga mình. Bảng là gateway, mỗi sân ga là một room, còn loa thông báo cả ga cùng nghe là <code>server.emit</code>. Quầy vẫn còn để hỏi việc (HTTP), và chính nhân viên quầy là người đổi bảng.</p>

<h3>1. Gateway, controller gọi nó, và một lần chạy thật</h3>
<pre><code class="language-ts">${esc(MA_GW)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p>Hai client Socket.IO (An xem L1, Bình xem L2), rồi hai lệnh HTTP:</p>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><strong>Giá trị handler trả về chính là ack.</strong> <code>emitWithAck('ping', 42)</code> nhận <code>{"pong":42,…}</code>. Client emit mà không kèm callback thì cùng giá trị đó không đi đâu cả (dòng cuối).</li>
<li><strong>Trả về <code>{ event, data }</code></strong> ⇒ gửi một sự kiện khác (<code>'tra-loi'</code>) về đúng client đó, thay cho ack.</li>
<li><strong><code>server.to('phong:L1').emit</code></strong> chỉ tới An; <code>server.emit</code> tới cả hai. Tên room là sơ đồ địa chỉ của bạn — đặt theo tài nguyên (<code>phong:&lt;id&gt;</code>), không đặt theo người.</li>
<li><strong>Gateway được tiêm vào controller</strong> như mọi provider. HTTP đổi trạng thái, gateway phát đi. Lúc khởi động Nest in <code>subscribed to the "ping" message</code> cho từng handler — cách kiểm nhanh handler đã được đăng ký chưa.</li>
<li><code>@WebSocketGateway()</code> không ghi cổng ⇒ dùng chung cổng HTTP (một server, một chứng chỉ TLS, một luật proxy). <code>@WebSocketGateway(41962)</code> mở server riêng — hiếm khi đáng.</li>
<li>Vòng đời: <code>afterInit</code> một lần khi server đã có, <code>handleConnection</code> / <code>handleDisconnect</code> cho từng socket. Bài 10.2 cho thấy vì sao <code>handleConnection</code> là chỗ SAI để xác thực.</li>
</ul>

<h3>2. Lỗi: client có thể chờ mãi</h3>
<div class="out">${esc(OUT_LOI)}</div>
<ul>
<li><code>WsException('Phòng không tồn tại')</code> ⇒ sự kiện <code>exception</code> mang đúng thông điệp của bạn. Lỗi loại khác ⇒ client chỉ thấy <code>"Internal server error"</code>, stack đầy đủ nằm trong log server — mật khẩu DB trong thông điệp không lọt ra. Tốt.</li>
<li>Nhưng nhìn dòng cuối: <strong>ack không bao giờ tới</strong>. Handler ném lỗi thì Nest gửi sự kiện <code>exception</code>, không gửi ack, nên client đang <code>await emitWithAck</code> chờ tới khi hết giờ của chính nó — hoặc chờ mãi nếu không đặt. Hai luật rút ra: client luôn dùng <code>socket.timeout(ms).emitWithAck(…)</code>; lỗi nghiệp vụ lường trước ("phòng đầy", "không tìm thấy") đi <em>trong ack</em> dạng <code>{ ok: false, error }</code>; exception để dành cho lỗi lập trình.</li>
<li><code>cause</code> lặp lại pattern và dữ liệu client gửi. Ở đây vô hại, nhưng đừng đặt bí mật vào object của WsException.</li>
</ul>

<h3>3. Kiểm dữ liệu trên socket: cùng pipe, khác kết quả</h3>
<p>Handler <code>doi</code> có <code>@UsePipes(new ValidationPipe())</code> và DTO dưới đây. An gửi trạng thái sai kèm một trường thừa:</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<div class="out">${esc(OUT_KIEM)}</div>
<p>Pipe có chạy — trạng thái sai bị chặn — nhưng client chỉ biết "Internal server error", còn log server <strong>trống trơn</strong>: <code>ValidationPipe</code> ném <code>BadRequestException</code>, một exception của HTTP; filter WebSocket không biết nó, giấu đi và cũng không ghi log. Sửa: cho pipe ném <code>WsException</code> (<code>PIPE_WS</code> trong mã gateway):</p>
<div class="out">${esc(OUT_KIEMWS)}</div>
<p>Pipe toàn cục có áp cho gateway không? Handler <code>doi-tran</code> không gắn pipe nào. Không có pipe toàn cục ⇒ trạng thái sai được <strong>lưu luôn</strong>; có <code>app.useGlobalPipes(new ValidationPipe())</code> ⇒ bị chặn. Vậy trong ứng dụng thường, pipe toàn cục CÓ chạy cho gateway (bài 10.3 cho thấy ngoại lệ: ứng dụng lai).</p>
<div class="out">$ # không pipe nào
${esc(OUT_TRAN)}

$ # PIPE_GLOBAL=1
${esc(OUT_TRANG)}</div>

<h3>4. Đổi adapter không phải đổi cấu hình</h3>
<p><code>app.useWebSocketAdapter(new WsAdapter(app))</code> của <code>@nestjs/platform-ws</code> thay Socket.IO bằng thư viện <code>ws</code> thuần: tốn ít bộ nhớ hơn mỗi kết nối, client WebSocket nào cũng nối được. Cùng gateway, client <code>ws</code> thuần gửi JSON <code>{ event, data }</code>:</p>
<div class="out">${esc(OUT_WS)}</div>
<div class="out">$ # client Socket.IO vào server ws thuần
${esc(OUT_WSSIO)}</div>
<ul>
<li>Mã handler vẫn chạy (<code>ping</code> có trả lời), nhưng mọi thứ riêng của Socket.IO đều gãy: không có <code>client.handshake</code> (sập trong <code>handleConnection</code>), không có <code>client.join</code>, không room, không ack — giá trị trả về tới dưới dạng một tin JSON trơn.</li>
<li>Tin không phải JSON bị bỏ im lặng. Client Socket.IO hoàn toàn không nối được vào server ws — hai giao thức khác nhau.</li>
<li>Vậy adapter là một phần hợp đồng với front-end. Chọn một lần, ngay từ đầu: Socket.IO khi cần room, ack, tự nối lại và Redis adapter (đa số ứng dụng nghiệp vụ); <code>ws</code> khi client không phải trình duyệt bạn kiểm soát (IoT, ngôn ngữ khác) hoặc số kết nối quan trọng hơn tính năng.</li>
</ul>

<h3>🧪 Thực hành (15 phút) — "ai đang xem phòng này?"</h3>
<p>Thêm hai handler vào <code>BoardGateway</code>: <code>roi</code> (rời phòng) và <code>dem</code> (đếm số socket đang xem một phòng, dùng <code>server.in(room).fetchSockets()</code>). Mã phòng sai dạng phải trả <code>{ ok: false }</code> trong ack, không ném lỗi. Kiểm bằng hai client: cả hai xem L1 ⇒ 2; một người rời ⇒ 1; <code>'L1; DROP'</code> ⇒ lỗi trong ack, không phải chờ hết giờ.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Sao dùng <code>fetchSockets()</code> mà không dùng <code>server.sockets.adapter.rooms.get(room).size</code>? Cách sau chỉ đếm trong tiến trình này; khi có Redis adapter (10.2), <code>fetchSockets</code> hỏi mọi bản ứng dụng.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Gateway trong Nest là gì, khác controller chỗ nào?</strong> Provider gắn với server WebSocket thay vì route HTTP. Cùng DI, cùng guard/pipe/interceptor/filter, nhưng handler khoá theo tên sự kiện và giá trị trả về là ack.</li>
<li><strong>Client chờ ack rồi treo. Vì sao?</strong> Handler ném lỗi; Nest gửi sự kiện <code>exception</code> chứ không gửi ack. Đặt timeout phía client và trả lỗi nghiệp vụ trong ack.</li>
<li><strong>ValidationPipe có chạy với tin WebSocket không?</strong> Có kiểm, nhưng ném exception HTTP; filter WS biến nó thành "Internal server error" và không ghi log. Dùng <code>exceptionFactory</code> ⇒ <code>WsException</code>.</li>
<li><strong>Trong Nest chọn Socket.IO hay ws?</strong> Socket.IO cho room, ack, tự nối lại, mở rộng ngang bằng adapter; ws cho kết nối nhẹ và client không phải Socket.IO. Hai bên không nói chuyện được với nhau, nên đây là quyết định sớm.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Dự án outsourcing hay nhận "thêm thông báo realtime" như một change request một dòng. Trước khi viết gateway, thống nhất bằng văn bản với đội front-end ba điều: thư viện và phiên bản chính của client (client Socket.IO 4 ⇒ server Socket.IO 4), danh sách tên sự kiện kèm payload, và lỗi trả về kiểu gì (ack có <code>ok:false</code>, hay sự kiện <code>exception</code>). <a href="https://www.asyncapi.com/" target="_blank" rel="noopener">AsyncAPI</a> với sự kiện giống OpenAPI với HTTP; chỉ một bảng ngắn trên wiki cũng tiết kiệm cả tuần "sự kiện không tới".</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Gateway</span><span class="v">Provider gắn <code>@WebSocketGateway()</code>; handler của nó trả lời sự kiện WebSocket.</span></div>
  <div class="kv"><span class="k">@SubscribeMessage(event)</span><span class="v">Đánh dấu handler; giá trị trả về thành ack.</span></div>
  <div class="kv"><span class="k">@WebSocketServer()</span><span class="v">Tiêm server bên dưới (<code>Server</code> của Socket.IO) để phát ngoài handler.</span></div>
  <div class="kv"><span class="k">WsException</span><span class="v">Exception mà filter WS chuyển cho client thành sự kiện <code>exception</code>.</span></div>
  <div class="kv"><span class="k">Adapter</span><span class="v">Thư viện nằm dưới gateway: <code>IoAdapter</code> (mặc định) hoặc <code>WsAdapter</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gateway là provider: tiêm service vào nó, tiêm nó vào controller để phát sau khi HTTP đổi dữ liệu.</li>
<li>Giá trị trả về = ack; <code>{ event, data }</code> = sự kiện khác; room đặt tên theo tài nguyên.</li>
<li>Lỗi không bao giờ sinh ack ⇒ client đặt timeout, lỗi nghiệp vụ đi trong ack.</li>
<li>ValidationPipe trên socket cần <code>exceptionFactory ⇒ WsException</code>; pipe toàn cục có áp cho gateway trong ứng dụng thường.</li>
<li>Adapter là lựa chọn giao thức, không phải công tắc cấu hình.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
