/**
 * 10.3 — Microservice trong Nest: transport, @MessagePattern và @EventPattern, ứng dụng lai (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/microservices 12.6.0, ioredis 5.11.1, Redis 7.4 nst-redis 127.0.0.1:41901):
 * scratchpad/nst/lab/c10/app/src/b103 + b103.sh (co-ban, cham, loi, sap, pipe [PIPE_GLOBAL=1], lai [KE_THUA=1], SVC=2 hai-ban [TRANSPORT=redis], bt) ⇒ lab/c10/o/103-*.txt.
 * Ghép: gen.mjs rồi ghep.sh 103 nst-10-3-microservice.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-9-1-bullmq', title: 'NestJS 9.1 — Hàng đợi với @nestjs/bullmq', sub: 'Khi sự kiện không được phép mất: job bền trong Redis, thử lại, idempotency.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'distributed-systems', bai: 'dist-1-2-mang-khong-tin-cay', title: 'Hệ phân tán 1.2 — Mạng không tin cậy', sub: 'Không phân biệt được chậm và chết — nền của mục 2 và 4.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'kafka', bai: 'kafka-2-3-acks-retry', title: 'Kafka 2.3 — acks, thử lại và độ bền', sub: 'Transport có consumer group và lưu bền, nếu bạn cần hơn Redis pub/sub.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Microservices: Basics', 'createMicroservice, @MessagePattern, @EventPattern, ClientsModule, send/emit, timeout bằng rxjs.', 'https://docs.nestjs.com/microservices/basics'),
  nguon('📘', 'NestJS docs — Hybrid application', 'connectMicroservice, startAllMicroservices, inheritAppConfig cho pipe/guard/filter toàn cục.', 'https://docs.nestjs.com/faq/hybrid-application'),
  nguon('📘', 'NestJS docs — Redis / NATS / RabbitMQ transport', 'Redis là pub/sub (mọi bản đều nhận); NATS có queue group, RabbitMQ có hàng đợi cạnh tranh.', 'https://docs.nestjs.com/microservices/redis'),
].join('\n');
const MA_BT = "// Bài tập 10.3: lỗi từ dịch vụ khác ⇒ mã HTTP đúng nghĩa ở cổng API (không để mọi thứ thành 500)\nimport { BadGatewayException, BadRequestException, GatewayTimeoutException, HttpException, NotFoundException } from '@nestjs/common';\nimport { catchError, type Observable, throwError, timeout } from 'rxjs';\n\nconst BANG: Record<string, (m: string) => HttpException> = {\n  PHONG_KHONG_CO: (m) => new NotFoundException(m),\n  DU_LIEU_SAI: (m) => new BadRequestException(m),\n};\n\nexport const rpcSangHttp = <T>(ms = 1000) => (nguon: Observable<T>) => nguon.pipe(\n  timeout(ms),\n  catchError((e) => {\n    if (e?.name === 'TimeoutError') return throwError(() => new GatewayTimeoutException('Dịch vụ phòng không trả lời'));\n    const tao = BANG[e?.code];\n    if (tao) return throwError(() => tao(e.message ?? e.code));\n    return throwError(() => new BadGatewayException('Dịch vụ phòng lỗi'));   // lỗi lạ: 502, không lộ chi tiết\n  }),\n);";
const OUT_BT = "$ curl -s localhost:41981/loi-map/rpc\n{\"message\":\"Không có phòng L9\",\"error\":\"Not Found\",\"statusCode\":404}  (HTTP 404, 0.024438s)\n$ curl -s localhost:41981/loi-map/http\n{\"message\":\"Dịch vụ phòng lỗi\",\"error\":\"Bad Gateway\",\"statusCode\":502}  (HTTP 502, 0.004184s)\n$ curl -s localhost:41981/cham-map\n{\"message\":\"Dịch vụ phòng không trả lời\",\"error\":\"Gateway Timeout\",\"statusCode\":504}  (HTTP 504, 1.002948s)";
const MA_H = "import { Controller, Logger, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';\nimport { Ctx, EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';\nimport { IsInt, Min } from 'class-validator';\n\nclass GiuChoDto { @IsInt() @Min(1) soCho: number; }\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\nlet dem = 0;\n\n@Controller()\nexport class PhongHandlers {\n  private readonly log = new Logger(`Phong#${process.pid % 1000}`);\n\n  @MessagePattern('phong.lay')                    // hỏi–đáp: giá trị trả về đi ngược về client\n  lay(@Payload() id: string) {\n    ++dem; if (!process.env.IM) this.log.log(`phong.lay ${id} (lần xử lý thứ ${dem} ở bản này)`);\n    return { id, ten: `Phòng ${id}`, sucChua: 30 };\n  }\n\n  @MessagePattern('phong.cham')\n  async cham() { await ngu(5000); return 'xong sau 5 s'; }\n\n  @MessagePattern('phong.loi')\n  loi(@Payload() kieu: string) {\n    if (kieu === 'rpc') throw new RpcException({ code: 'PHONG_KHONG_CO', message: 'Không có phòng L9' });\n    throw new NotFoundException('Không có phòng L9');\n  }\n\n  @MessagePattern('phong.giu-cho')\n  giuCho(@Payload() dto: GiuChoDto) { return { daGiu: dto.soCho, kieu: typeof dto.soCho }; }\n\n  @UsePipes(new ValidationPipe({ transform: true }))\n  @MessagePattern('phong.giu-cho-pipe')\n  giuChoPipe(@Payload() dto: GiuChoDto) { return { daGiu: dto.soCho }; }\n\n  @UsePipes(new ValidationPipe({ exceptionFactory: (e) => new RpcException({ code: 'DU_LIEU_SAI', loi: e.flatMap((x) => Object.values(x.constraints ?? {})) }) }))\n  @MessagePattern('phong.giu-cho-rpc')\n  giuChoRpc(@Payload() dto: GiuChoDto) { return { daGiu: dto.soCho }; }\n\n  @EventPattern('lich.da-duyet')                  // sự kiện: không trả lời\n  async daDuyet(@Payload() d: { id: number }) {\n    await ngu(Number(process.env.SU_KIEN_MS ?? 0));\n    this.log.log(`lich.da-duyet ${d.id} ⇒ gửi email`);\n  }\n}";
const MA_API = "import { Body, Controller, GatewayTimeoutException, Get, Inject, Param, Post } from '@nestjs/common';\nimport { ClientProxy } from '@nestjs/microservices';\nimport { firstValueFrom, timeout } from 'rxjs';\n\n@Controller()\nexport class ApiController {\n  constructor(@Inject('PHONG') private readonly phong: ClientProxy) {}\n\n  @Get('phong/:id')\n  lay(@Param('id') id: string) { return firstValueFrom(this.phong.send('phong.lay', id)); }\n\n  @Get('phong-quen/:id')\n  quen(@Param('id') id: string) { this.phong.send('phong.lay', id); return { daGoi: true }; }   // không subscribe\n\n  @Post('duyet/:id')\n  duyet(@Param('id') id: string) { this.phong.emit('lich.da-duyet', { id: Number(id) }); return { daPhat: true }; }\n\n  @Get('cham')\n  cham() { return firstValueFrom(this.phong.send('phong.cham', {})); }\n\n  @Get('cham-co-han')\n  async chamCoHan() {\n    try { return await firstValueFrom(this.phong.send('phong.cham', {}).pipe(timeout(1000))); }\n    catch (e) { if ((e as Error).name === 'TimeoutError') throw new GatewayTimeoutException('Dịch vụ phòng không trả lời trong 1 s'); throw e; }\n  }\n\n  @Get('loi/:kieu')\n  async loi(@Param('kieu') kieu: string) {\n    try { return await firstValueFrom(this.phong.send('phong.loi', kieu)); }\n    catch (e) { return { clientNhan: e }; }\n  }\n\n  @Post('giu-cho/:pat')\n  async giuCho(@Param('pat') pat: string, @Body() body: unknown) {\n    try { return await firstValueFrom(this.phong.send(pat, body)); } catch (e) { return { clientNhan: e }; }\n  }\n}";
const MA_MAIN = "import 'reflect-metadata';\nimport { Module, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { ClientsModule, Transport, type MicroserviceOptions } from '@nestjs/microservices';\nimport { ApiController } from './api.controller.js';\nimport { PhongHandlers } from './phong.handlers.js';\n\nconst T = process.env.TRANSPORT === 'redis'\n  ? { transport: Transport.REDIS, options: { host: '127.0.0.1', port: 41901 } } as const\n  : { transport: Transport.TCP, options: { host: '127.0.0.1', port: 41982 } } as const;\nconst VAI = process.env.VAI ?? 'api';\nconst log = { logger: ['log', 'error', 'warn'] as ('log' | 'error' | 'warn')[] };\n\nif (VAI === 'svc') {                       // tiến trình dịch vụ phòng: không HTTP\n  @Module({ controllers: [PhongHandlers] }) class SvcModule {}\n  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SvcModule, { ...T, ...log });\n  if (process.env.PIPE_GLOBAL === '1') app.useGlobalPipes(new ValidationPipe({ transform: true }));\n  await app.listen();\n} else if (VAI === 'api') {                // cổng HTTP gọi sang dịch vụ phòng\n  @Module({ imports: [ClientsModule.register([{ name: 'PHONG', ...T }])], controllers: [ApiController] }) class ApiModule {}\n  const app = await NestFactory.create(ApiModule, log);\n  await app.listen(41981, '127.0.0.1');\n} else {                                   // ứng dụng lai: HTTP + microservice trong một tiến trình\n  @Module({ imports: [ClientsModule.register([{ name: 'PHONG', ...T }])], controllers: [ApiController, PhongHandlers] }) class LaiModule {}\n  const app = await NestFactory.create(LaiModule, log);\n  app.useGlobalPipes(new ValidationPipe({ transform: true }));\n  app.connectMicroservice<MicroserviceOptions>(T, { inheritAppConfig: process.env.KE_THUA === '1' });\n  await app.startAllMicroservices();\n  await app.listen(41981, '127.0.0.1');\n}";
const OUT_COBAN = "$ curl -s localhost:41981/phong/L1\n{\"id\":\"L1\",\"ten\":\"Phòng L1\",\"sucChua\":30}  (HTTP 200, 0.017510s)\n$ curl -s localhost:41981/phong-quen/L2\n{\"daGoi\":true}  (HTTP 200, 0.001749s)\n$ curl -s -X POST localhost:41981/duyet/7\n{\"daPhat\":true}  (HTTP 201, 0.002175s)\n—— log svc1.log\n[Nest] LOG [Phong#199] phong.lay L1 (lần xử lý thứ 1 ở bản này)\n[Nest] LOG [Phong#199] lich.da-duyet 7 ⇒ gửi email\n—— log api.log";
const OUT_CHAM = "$ curl -s localhost:41981/cham\nxong sau 5 s  (HTTP 200, 5.022718s)\n$ curl -s localhost:41981/cham-co-han\n{\"message\":\"Dịch vụ phòng không trả lời trong 1 s\",\"error\":\"Gateway Timeout\",\"statusCode\":504}  (HTTP 504, 1.003980s)\n—— log svc1.log\n—— log api.log";
const OUT_LOI = "$ curl -s localhost:41981/loi/rpc\n{\"clientNhan\":{\"code\":\"PHONG_KHONG_CO\",\"message\":\"Không có phòng L9\"}}  (HTTP 200, 0.016926s)\n$ curl -s localhost:41981/loi/http\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 200, 0.003056s)\n—— log svc1.log\n—— log api.log";
const OUT_SAP = "$ curl -s localhost:41981/phong/L1\n{\"id\":\"L1\",\"ten\":\"Phòng L1\",\"sucChua\":30}  (HTTP 200, 0.023459s)\n$ kill <dịch vụ phòng>\n$ curl -s localhost:41981/phong/L1\n{\"statusCode\":500,\"message\":\"Internal server error\"}  (HTTP 500, 0.003089s)\n$ curl -s -X POST localhost:41981/duyet/8\n{\"daPhat\":true}  (HTTP 201, 0.002089s)\n# bật lại dịch vụ phòng\n$ curl -s localhost:41981/phong/L1\n{\"id\":\"L1\",\"ten\":\"Phòng L1\",\"sucChua\":30}  (HTTP 200, 0.005967s)\n—— log svc1.log\n[Nest] LOG [Phong#88] phong.lay L1 (lần xử lý thứ 1 ở bản này)\n—— log api.log\n[Nest] ERROR [ExceptionsHandler] Error: connect ECONNREFUSED 127.0.0.1:41982\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {\n  errno: -111,\n  code: 'ECONNREFUSED',\n  syscall: 'connect',\n  address: '127.0.0.1',\n  port: 41982\n}";
const OUT_PIPE = "$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"daGiu\":\"3\",\"kieu\":\"string\"}  (HTTP 201, 0.027059s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-pipe\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.008507s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"daGiu\":0,\"kieu\":\"number\"}  (HTTP 201, 0.002787s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-rpc\n{\"clientNhan\":{\"code\":\"DU_LIEU_SAI\",\"loi\":[\"soCho must not be less than 1\",\"soCho must be an integer number\"]}}  (HTTP 201, 0.003383s)\n—— log svc1.log\n—— log api.log";
const OUT_PIPEG = "$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.023552s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-pipe\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.003542s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.003267s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-rpc\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.002871s)\n—— log svc1.log\n—— log api.log";
const OUT_LAI = "$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"daGiu\":\"3\",\"kieu\":\"string\"}  (HTTP 201, 0.025246s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-pipe\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.007524s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"daGiu\":0,\"kieu\":\"number\"}  (HTTP 201, 0.002238s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-rpc\n{\"clientNhan\":{\"code\":\"DU_LIEU_SAI\",\"loi\":[\"soCho must not be less than 1\",\"soCho must be an integer number\"]}}  (HTTP 201, 0.002614s)\n—— log api.log";
const OUT_LAIK = "$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.028824s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-pipe\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.002399s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.002456s)\n$ curl -s -X POST localhost:41981/giu-cho/phong.giu-cho-rpc\n{\"clientNhan\":{\"status\":\"error\",\"message\":\"Internal server error\"}}  (HTTP 201, 0.002395s)\n—— log api.log";
const OUT_RHAI = "$ curl -s localhost:41981/phong/L1\n{\"id\":\"L1\",\"ten\":\"Phòng L1\",\"sucChua\":30}  (HTTP 200, 0.060979s)\n$ curl -s localhost:41981/phong/L2\n{\"id\":\"L2\",\"ten\":\"Phòng L2\",\"sucChua\":30}  (HTTP 200, 0.004112s)\n$ curl -s -X POST localhost:41981/duyet/7\n{\"daPhat\":true}  (HTTP 201, 0.002727s)\n—— log svc1.log\n[Nest] LOG [Server] Connected to Redis. Subscribing to channels...\n[Nest] LOG [Server] Connected to Redis. Subscribing to channels...\n[Nest] LOG [Phong#868] phong.lay L1 (lần xử lý thứ 1 ở bản này)\n[Nest] LOG [Phong#868] phong.lay L2 (lần xử lý thứ 2 ở bản này)\n[Nest] LOG [Phong#868] lich.da-duyet 7 ⇒ gửi email\n—— log svc2.log\n[Nest] LOG [Server] Connected to Redis. Subscribing to channels...\n[Nest] LOG [Server] Connected to Redis. Subscribing to channels...\n[Nest] LOG [Phong#869] phong.lay L1 (lần xử lý thứ 1 ở bản này)\n[Nest] LOG [Phong#869] phong.lay L2 (lần xử lý thứ 2 ở bản này)\n[Nest] LOG [Phong#869] lich.da-duyet 7 ⇒ gửi email\n—— log api.log\n[Nest] LOG [ClientProxy] Connected to Redis. Subscribing to channels...";
const OUT_THAI = "$ curl -s localhost:41981/phong/L1\n{\"id\":\"L1\",\"ten\":\"Phòng L1\",\"sucChua\":30}  (HTTP 200, 0.022257s)\n$ curl -s localhost:41981/phong/L2\n{\"id\":\"L2\",\"ten\":\"Phòng L2\",\"sucChua\":30}  (HTTP 200, 0.002642s)\n$ curl -s -X POST localhost:41981/duyet/7\n{\"daPhat\":true}  (HTTP 201, 0.002459s)\n—— log svc1.log\n[Nest] ERROR [Server] Error: listen EADDRINUSE: address already in use 127.0.0.1:41982\n    at Server.setupListenHandle [as _listen2] (node:net:1940:16)\n    … (các khung gọi khác) {\n  code: 'EADDRINUSE',\n  errno: -98,\n  syscall: 'listen',\n  address: '127.0.0.1',\n  port: 41982\n}\n… (tiến trình thoát)\n—— log svc2.log\n[Nest] LOG [Phong#829] phong.lay L1 (lần xử lý thứ 1 ở bản này)\n[Nest] LOG [Phong#829] phong.lay L2 (lần xử lý thứ 2 ở bản này)\n[Nest] LOG [Phong#829] lich.da-duyet 7 ⇒ gửi email\n—— log api.log";
export default {
  title: '10.3 — Microservices in Nest: transports, @MessagePattern vs @EventPattern, hybrid apps|||10.3 — Microservice trong Nest: transport, @MessagePattern và @EventPattern, ứng dụng lai',
  slug: 'nst-10-3-microservice',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai tiến trình Nest nói chuyện qua @nestjs/microservices, đo thật: send() không subscribe thì không gửi, emit() thì gửi ngay; không đặt timeout ⇒ chờ theo dịch vụ chậm; NotFoundException không đi qua được (thành Internal server error), RpcException thì được; dịch vụ tắt ⇒ send lỗi, emit mất im lặng; transport Redis với hai bản ⇒ MỖI message chạy hai lần, kể cả hỏi–đáp; pipe toàn cục của ứng dụng lai chỉ áp khi inheritAppConfig.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>10.3 — Two Nest processes talking: what the transport does not do for you</h2>
<p class="lead"><code>@nestjs/microservices</code> lets one Nest app call another with decorators that look like controllers: <code>@MessagePattern</code> for request–response, <code>@EventPattern</code> for fire-and-forget, a <code>ClientProxy</code> to call them, and a choice of transport (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC, MQTT). It looks like a function call. This lesson measures the six ways it is not one, on TCP and Redis.</p>

<h3>Everyday analogy: a phone call and a notice board</h3>
<p><code>send</code> is a phone call: you wait for an answer, and if nobody picks up you must decide how long to hold. <code>emit</code> is pinning a notice on a board: you walk away immediately, and you never learn whether anyone read it — or whether the board was even there.</p>

<h3>1. The setup: a room service and an HTTP API</h3>
<pre><code class="language-ts">${esc(MA_H)}</code></pre>
<pre><code class="language-ts">${esc(MA_API)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><code>/phong/L1</code> ⇒ <code>send</code> + <code>firstValueFrom</code> ⇒ answered, logged once.</li>
<li><code>/phong-quen/L2</code> returned <code>{"daGoi":true}</code>, yet the service log has no <code>phong.lay L2</code>. <strong><code>send()</code> returns a cold Observable: nothing is sent until someone subscribes.</strong> A forgotten <code>await firstValueFrom(…)</code> is a silent no-op.</li>
<li><code>emit()</code> is hot: <code>lich.da-duyet 7</code> ran without anyone subscribing.</li>
</ul>

<h3>2. No timeout unless you add one</h3>
<div class="out">${esc(OUT_CHAM)}</div>
<p>The HTTP request waited the full 5 seconds of the slow handler — and would wait forever for a handler that never answers. Every <code>send</code> across a network needs <code>.pipe(timeout(ms))</code> and a mapping to <code>504</code>.</p>

<h3>3. Which errors survive the trip</h3>
<div class="out">${esc(OUT_LOI)}</div>
<p>An <code>RpcException</code> payload arrives intact. A <code>NotFoundException</code> — an HTTP exception — means nothing to a transport, so the client receives <code>Internal server error</code>. Services throw <code>RpcException</code> with a code; the HTTP edge translates codes into status codes (exercise).</p>

<h3>4. When the service is down</h3>
<div class="out">${esc(OUT_SAP)}</div>
<ul>
<li><code>send</code> fails fast with <code>ECONNREFUSED</code> ⇒ 500 unless you map it. After the restart the client reconnects by itself.</li>
<li><code>emit</code> answered <code>{"daPhat":true}</code> — and booking 8's event is <strong>gone</strong>: the restarted service never logged it. Neither TCP nor Redis pub/sub stores events. If losing it is not acceptable (an approval email), use a queue: BullMQ (9.1), RabbitMQ, Kafka.</li>
</ul>

<h3>5. Two replicas: TCP cannot, Redis does it twice</h3>
<div class="out">$ # SVC=2, TCP
${esc(OUT_THAI)}</div>
<div class="out">$ # SVC=2, TRANSPORT=redis
${esc(OUT_RHAI)}</div>
<ul>
<li>TCP: the second replica cannot bind the same host:port. Scaling a TCP microservice needs a load balancer in front and a client pointing at it.</li>
<li>Redis: both replicas subscribed — and <strong>both handled every message</strong>, including the request–response <code>phong.lay</code> (the client took the first answer and ignored the second) and the event (two emails). Redis transport is publish/subscribe, not a work queue.</li>
<li>If you need "one of N replicas handles it": NATS with a <code>queue</code> group, RabbitMQ (one queue, competing consumers), Kafka (consumer group) — all available as Nest transports. And every handler should still be idempotent (9.1).</li>
</ul>

<h3>6. Validation and the hybrid app</h3>
<p>Payloads arrive as plain JSON. Without a pipe, <code>soCho: "3"</code> reaches the handler as a string. With <code>ValidationPipe</code> it is rejected — as <code>Internal server error</code> again, for the same reason as in 10.1; give the pipe an <code>exceptionFactory</code> that throws <code>RpcException</code>:</p>
<div class="out">${esc(OUT_PIPE)}</div>
<p>A <strong>hybrid application</strong> is one process serving HTTP and a transport: <code>app.connectMicroservice(...)</code> then <code>app.startAllMicroservices()</code>. Global pipes registered with <code>app.useGlobalPipes</code> do <em>not</em> apply to its message handlers by default:</p>
<div class="out">$ # ứng dụng lai, useGlobalPipes(ValidationPipe), inheritAppConfig: false
${esc(OUT_LAI)}</div>
<div class="out">$ # inheritAppConfig: true
${esc(OUT_LAIK)}</div>
<p>With <code>inheritAppConfig: true</code> the global pipe runs first for every message (and its HTTP exception again becomes "Internal server error" — the global pipe needs the RPC-aware factory too).</p>

<h3>🧪 Exercise (15 min) — errors from another service, as correct HTTP codes</h3>
<p>Write an RxJS operator <code>rpcSangHttp()</code> for the API side: timeout ⇒ 504; <code>RpcException</code> with code <code>PHONG_KHONG_CO</code> ⇒ 404, <code>DU_LIEU_SAI</code> ⇒ 400; anything else ⇒ 502 without details. Use it on <code>phong.loi</code> and <code>phong.cham</code>.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>502 for unknown errors: the problem is upstream, not in the caller's request, and the upstream message stays in the upstream log.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>send vs emit in a Nest ClientProxy?</strong> send = request–response, cold Observable (must subscribe); emit = event, sent immediately, no reply, no delivery guarantee.</li>
<li><strong>What happens when the downstream service is slow?</strong> The caller waits as long as it does — there is no default timeout; add <code>timeout()</code> and map to 504.</li>
<li><strong>You run two replicas of a Redis-transport service. What changes?</strong> Both receive every message; handlers run twice. Use a transport with queue semantics or make handlers idempotent and deduplicate.</li>
<li><strong>Why does a NotFoundException in a microservice reach the client as "Internal server error"?</strong> HTTP exceptions do not serialize across transports; throw RpcException.</li>
<li><strong>What is a hybrid application and what is the catch?</strong> HTTP + microservice in one process; global enhancers need <code>inheritAppConfig: true</code>.</li>
</ol>

<h3>💼 On the job</h3>
<p>Customers sometimes ask for "microservice architecture" in the proposal. Before agreeing on a transport, ask which messages may be lost, which may be processed twice, and how many replicas each part runs. If the honest answers are "none", "none" and "more than one", Redis pub/sub is the wrong choice regardless of how easy it is to set up — and lesson 10.4 asks whether you need the network hop at all.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@MessagePattern</span><span class="v">Request–response handler; its return value goes back to <code>send()</code>.</span></div>
  <div class="kv"><span class="k">@EventPattern</span><span class="v">Event handler; nothing goes back to <code>emit()</code>.</span></div>
  <div class="kv"><span class="k">Cold Observable</span><span class="v">Does nothing until subscribed — <code>send()</code>.</span></div>
  <div class="kv"><span class="k">RpcException</span><span class="v">The exception that serializes to the caller.</span></div>
  <div class="kv"><span class="k">Hybrid app</span><span class="v">One Nest process with HTTP and a transport (<code>connectMicroservice</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>send()</code> needs a subscriber and a timeout; <code>emit()</code> has no reply and no guarantee.</li>
<li>Throw <code>RpcException</code>; translate codes to HTTP at the edge.</li>
<li>A stopped service loses events — use a queue when that matters.</li>
<li>Redis transport + 2 replicas = every message handled twice.</li>
<li>Hybrid apps: <code>inheritAppConfig</code> for global pipes; pipes need an RPC-aware <code>exceptionFactory</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>10.3 — Hai tiến trình Nest nói chuyện: transport không làm hộ bạn những gì</h2>
<p class="lead"><code>@nestjs/microservices</code> cho một ứng dụng Nest gọi ứng dụng khác bằng decorator trông như controller: <code>@MessagePattern</code> cho hỏi–đáp, <code>@EventPattern</code> cho bắn rồi quên, một <code>ClientProxy</code> để gọi, và nhiều transport để chọn (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC, MQTT). Trông như gọi hàm. Bài này đo sáu chỗ nó KHÔNG phải gọi hàm, trên TCP và Redis.</p>

<h3>Liên hệ đời thường: cuộc gọi điện và bảng thông báo</h3>
<p><code>send</code> là gọi điện: bạn chờ câu trả lời, không ai nhấc máy thì phải tự quyết giữ máy bao lâu. <code>emit</code> là ghim tờ thông báo lên bảng: bạn đi ngay, và không bao giờ biết có ai đọc không — thậm chí bảng có ở đó không.</p>

<h3>1. Dựng: một dịch vụ phòng và một API HTTP</h3>
<pre><code class="language-ts">${esc(MA_H)}</code></pre>
<pre><code class="language-ts">${esc(MA_API)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<div class="out">${esc(OUT_COBAN)}</div>
<ul>
<li><code>/phong/L1</code> ⇒ <code>send</code> + <code>firstValueFrom</code> ⇒ có trả lời, log đúng một lần.</li>
<li><code>/phong-quen/L2</code> trả <code>{"daGoi":true}</code>, vậy mà log dịch vụ không có <code>phong.lay L2</code>. <strong><code>send()</code> trả về Observable lạnh: chưa ai subscribe thì chưa gửi gì.</strong> Quên <code>await firstValueFrom(…)</code> là một lệnh câm.</li>
<li><code>emit()</code> thì nóng: <code>lich.da-duyet 7</code> chạy dù không ai subscribe.</li>
</ul>

<h3>2. Không có timeout trừ khi bạn tự thêm</h3>
<div class="out">${esc(OUT_CHAM)}</div>
<p>Request HTTP chờ trọn 5 giây của handler chậm — và sẽ chờ mãi với handler không bao giờ trả lời. Mọi <code>send</code> qua mạng cần <code>.pipe(timeout(ms))</code> và ánh xạ sang <code>504</code>.</p>

<h3>3. Lỗi nào sống sót qua đường truyền</h3>
<div class="out">${esc(OUT_LOI)}</div>
<p>Payload của <code>RpcException</code> tới nguyên vẹn. <code>NotFoundException</code> — một exception HTTP — chẳng có nghĩa gì với transport, nên client nhận <code>Internal server error</code>. Dịch vụ ném <code>RpcException</code> kèm mã; rìa HTTP dịch mã thành status code (bài tập).</p>

<h3>4. Khi dịch vụ tắt</h3>
<div class="out">${esc(OUT_SAP)}</div>
<ul>
<li><code>send</code> hỏng ngay với <code>ECONNREFUSED</code> ⇒ 500 nếu bạn không ánh xạ. Bật lại dịch vụ thì client tự nối lại.</li>
<li><code>emit</code> trả <code>{"daPhat":true}</code> — còn sự kiện của lịch 8 thì <strong>mất</strong>: dịch vụ bật lại không hề ghi nó. Cả TCP lẫn Redis pub/sub đều không lưu sự kiện. Nếu không được phép mất (email duyệt lịch), dùng hàng đợi: BullMQ (9.1), RabbitMQ, Kafka.</li>
</ul>

<h3>5. Hai bản: TCP không chạy được, Redis chạy hai lần</h3>
<div class="out">$ # SVC=2, TCP
${esc(OUT_THAI)}</div>
<div class="out">$ # SVC=2, TRANSPORT=redis
${esc(OUT_RHAI)}</div>
<ul>
<li>TCP: bản thứ hai không bind được cùng host:port. Muốn nhân bản dịch vụ TCP phải có load balancer đứng trước và client trỏ vào nó.</li>
<li>Redis: cả hai bản đều subscribe — và <strong>cả hai xử lý MỌI message</strong>, kể cả hỏi–đáp <code>phong.lay</code> (client lấy câu trả lời đầu, bỏ câu thứ hai) lẫn sự kiện (hai email). Transport Redis là publish/subscribe, không phải hàng đợi việc.</li>
<li>Cần "một trong N bản xử lý": NATS với nhóm <code>queue</code>, RabbitMQ (một hàng đợi, consumer cạnh tranh), Kafka (consumer group) — đều có sẵn transport trong Nest. Và handler nào cũng nên idempotent (9.1).</li>
</ul>

<h3>6. Kiểm dữ liệu và ứng dụng lai</h3>
<p>Payload tới dưới dạng JSON trơn. Không pipe ⇒ <code>soCho: "3"</code> vào tới handler dưới dạng chuỗi. Có <code>ValidationPipe</code> ⇒ bị chặn — lại thành <code>Internal server error</code>, cùng lý do như 10.1; cho pipe một <code>exceptionFactory</code> ném <code>RpcException</code>:</p>
<div class="out">${esc(OUT_PIPE)}</div>
<p><strong>Ứng dụng lai</strong> là một tiến trình phục vụ cả HTTP lẫn một transport: <code>app.connectMicroservice(...)</code> rồi <code>app.startAllMicroservices()</code>. Pipe toàn cục đăng ký bằng <code>app.useGlobalPipes</code> mặc định <em>không</em> áp cho handler message của nó:</p>
<div class="out">$ # ứng dụng lai, useGlobalPipes(ValidationPipe), inheritAppConfig: false
${esc(OUT_LAI)}</div>
<div class="out">$ # inheritAppConfig: true
${esc(OUT_LAIK)}</div>
<p>Với <code>inheritAppConfig: true</code>, pipe toàn cục chạy trước cho mọi message (và exception HTTP của nó lại thành "Internal server error" — pipe toàn cục cũng cần factory hiểu RPC).</p>

<h3>🧪 Thực hành (15 phút) — lỗi từ dịch vụ khác thành mã HTTP đúng nghĩa</h3>
<p>Viết toán tử RxJS <code>rpcSangHttp()</code> cho phía API: hết giờ ⇒ 504; <code>RpcException</code> mã <code>PHONG_KHONG_CO</code> ⇒ 404, <code>DU_LIEU_SAI</code> ⇒ 400; còn lại ⇒ 502 không kèm chi tiết. Dùng nó cho <code>phong.loi</code> và <code>phong.cham</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>502 cho lỗi lạ: vấn đề nằm ở phía trên, không phải ở request của người gọi, và thông điệp gốc ở lại trong log của dịch vụ đó.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>send và emit của ClientProxy khác gì?</strong> send = hỏi–đáp, Observable lạnh (phải subscribe); emit = sự kiện, gửi ngay, không trả lời, không bảo đảm tới.</li>
<li><strong>Dịch vụ phía dưới chậm thì sao?</strong> Bên gọi chờ bằng đúng thời gian đó — không có timeout mặc định; thêm <code>timeout()</code> và ánh xạ sang 504.</li>
<li><strong>Chạy hai bản một dịch vụ dùng transport Redis thì đổi gì?</strong> Cả hai nhận mọi message; handler chạy hai lần. Dùng transport có ngữ nghĩa hàng đợi, hoặc làm handler idempotent và lọc trùng.</li>
<li><strong>Sao NotFoundException trong microservice tới client thành "Internal server error"?</strong> Exception HTTP không tuần tự hoá qua transport được; ném RpcException.</li>
<li><strong>Ứng dụng lai là gì, bẫy ở đâu?</strong> HTTP + microservice trong một tiến trình; enhancer toàn cục cần <code>inheritAppConfig: true</code>.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Khách đôi khi đòi "kiến trúc microservice" ngay trong proposal. Trước khi chốt transport, hỏi: message nào được phép mất, message nào được phép xử lý hai lần, mỗi phần chạy bao nhiêu bản. Nếu câu trả lời thật là "không cái nào", "không cái nào" và "hơn một", thì Redis pub/sub là lựa chọn sai dù dựng dễ đến đâu — và bài 10.4 hỏi xem bạn có cần bước nhảy qua mạng đó không.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@MessagePattern</span><span class="v">Handler hỏi–đáp; giá trị trả về quay về <code>send()</code>.</span></div>
  <div class="kv"><span class="k">@EventPattern</span><span class="v">Handler sự kiện; không có gì quay về <code>emit()</code>.</span></div>
  <div class="kv"><span class="k">Observable lạnh</span><span class="v">Chưa subscribe thì chưa làm gì — <code>send()</code>.</span></div>
  <div class="kv"><span class="k">RpcException</span><span class="v">Exception tuần tự hoá được về bên gọi.</span></div>
  <div class="kv"><span class="k">Ứng dụng lai</span><span class="v">Một tiến trình Nest có cả HTTP và transport (<code>connectMicroservice</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>send()</code> cần người subscribe và một timeout; <code>emit()</code> không trả lời, không bảo đảm.</li>
<li>Ném <code>RpcException</code>; dịch mã sang HTTP ở rìa.</li>
<li>Dịch vụ tắt thì sự kiện mất — dùng hàng đợi khi chuyện đó quan trọng.</li>
<li>Transport Redis + 2 bản = mọi message xử lý hai lần.</li>
<li>Ứng dụng lai: <code>inheritAppConfig</code> cho pipe toàn cục; pipe cần <code>exceptionFactory</code> hiểu RPC.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
