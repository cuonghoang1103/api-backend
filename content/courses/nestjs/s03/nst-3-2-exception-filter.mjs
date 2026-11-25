/**
 * 3.2 — Ngoại lệ và filter (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c3/app/src/b32:
 * loi.ts (CHE_DO=mac-dinh | lo [filter trả stack] | problem [RFC 9457]; 6 route + body JSON hỏng), ngoai.ts (throw trong setTimeout ⇒ tiến trình chết, exit 1),
 * bt.ts (lỗi nghiệp vụ TrungLichError + @Catch(TrungLichError) ⇒ 409). OUT_SENT: lần chạy đầu của chính filter problem (đặt content-type SAU reply ⇒
 * ERR_HTTP_HEADERS_SENT) — lược bớt dòng stack giữa, đánh dấu "…".
 * Sự cố thật: Equifax 2017 qua CVE-2017-5638 (NVD: "incorrect exception handling and error-message generation") — 148 triệu người (House Oversight 12/2018).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-2-1-problem-details', title: 'API Design 2.1 — Problem Details (RFC 9457)', sub: 'Thiết kế dạng lỗi: type, title, status, detail, instance, mã cho máy đọc.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — Xử lý lỗi tập trung', sub: 'Bản Express: error middleware 4 tham số — thứ filter thay thế.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Exception filters', 'HttpException, lỗi dựng sẵn, @Catch, ArgumentsHost, BaseExceptionFilter.', 'https://docs.nestjs.com/exception-filters'),
  nguon('📜', 'RFC 9457 — Problem Details for HTTP APIs', 'application/problem+json: type, title, status, detail, instance.', 'https://www.rfc-editor.org/rfc/rfc9457'),
  nguon('🛡️', 'NVD — CVE-2017-5638 (Apache Struts 2)', 'Xử lý ngoại lệ và sinh thông báo lỗi sai ⇒ chạy lệnh từ xa qua header Content-Type.', 'https://nvd.nist.gov/vuln/detail/CVE-2017-5638'),
  nguon('📰', 'House Oversight Committee — báo cáo Equifax (12/2018)', '148 triệu người bị lộ; kết luận: "hoàn toàn có thể ngăn được".', 'https://oversight.house.gov/report/committee-releases-report-revealing-new-information-on-equifax-data-breach/'),
  nguon('🛡️', 'CWE-209 — Thông báo lỗi chứa thông tin nhạy cảm', 'Lớp điểm yếu của thí nghiệm 2.', 'https://cwe.mitre.org/data/definitions/209.html'),
].join('\n');
const MA_LOI = "import 'reflect-metadata';\nimport { ArgumentsHost, Body, Catch, ConflictException, Controller, ExceptionFilter, Get, HttpException, HttpStatus, Logger, Module, NotFoundException, Param, Post } from '@nestjs/common';\nimport { HttpAdapterHost, NestFactory } from '@nestjs/core';\nimport type { Request } from 'express';\n\n@Controller('rooms')\nclass RoomsController {\n  @Get('a/:id') a(@Param('id') id: string) { throw new NotFoundException(`Không có phòng ${id}`); }\n  @Get('b/:id') b(@Param('id') id: string) {   // Nest 12: errorCode cho máy đọc, message cho người đọc\n    throw new NotFoundException(`Không có phòng ${id}`, { errorCode: 'ROOM_NOT_FOUND' });\n  }\n  @Get('c') c() { throw new HttpException({ ly_do: 'trùng giờ', voi: 'booking #12' }, HttpStatus.CONFLICT); }\n  @Get('d') d() { throw new ConflictException('Phòng đã có người đặt', { cause: new Error('unique(room_id, slot)') }); }\n  @Get('e') e() { throw new Error('connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)'); }   // lỗi \"lạ\"\n  @Get('f') async f() { await Promise.resolve(); throw new TypeError(\"Cannot read properties of undefined (reading 'slot')\"); }\n  @Post('g') g(@Body() b: unknown) { return b; }\n}\n\n// filter \"dễ dãi\" — hay gặp trong dự án học: trả nguyên lỗi cho client\n@Catch()\nclass LoLoiFilter implements ExceptionFilter {\n  catch(err: any, host: ArgumentsHost) {\n    const res = host.switchToHttp().getResponse();\n    res.status(err.status ?? 500).json({ message: err.message, stack: err.stack });\n  }\n}\n\n// filter problem+json (RFC 9457): một dạng lỗi cho MỌI lỗi, log đủ ở server, client chỉ thấy điều an toàn\n@Catch()\nexport class ProblemFilter implements ExceptionFilter {\n  private log = new Logger('Loi');\n  constructor(private readonly host: HttpAdapterHost) {}\n  catch(err: unknown, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const req = ctx.getRequest<Request>();\n    const http = err instanceof HttpException;\n    const status = http ? err.getStatus() : (err as any)?.status ?? 500;  // body-parser ném lỗi có .status\n    const body = http ? err.getResponse() : undefined;\n    // body là chuỗi, hoặc {message,error,statusCode[,errorCode]} của lỗi dựng sẵn, hoặc object tự chọn\n    const { message, error, statusCode, errorCode, ...them } = typeof body === 'object' ? (body as any) : ({} as any);\n    const detail = status >= 500 ? 'Lỗi phía máy chủ — đã ghi log.'\n      : typeof body === 'string' ? body : message ?? (err as any)?.message;\n    const problem = {\n      type: `https://lab-booking.example/errors/${(http && err.errorCode) || status}`,\n      title: http ? err.name : status >= 500 ? 'Internal Server Error' : 'Bad Request',\n      status, detail, instance: req.originalUrl,\n      ...(http && err.errorCode ? { code: err.errorCode } : {}),\n      ...them,                                   // trường riêng của HttpException tự chọn (ly_do, voi…)\n    };\n    if (status >= 500) this.log.error(`${req.method} ${req.originalUrl}: ${(err as Error)?.stack?.split('\\n').slice(0, 2).join(' |')}`);\n    const res = ctx.getResponse();\n    this.host.httpAdapter.setHeader(res, 'content-type', 'application/problem+json'); // đặt TRƯỚC khi gửi\n    this.host.httpAdapter.reply(res, problem, status);\n  }\n}\n\n@Module({ controllers: [RoomsController] })\nclass AppModule {}\n\nconst CHE_DO = process.env.CHE_DO ?? 'mac-dinh';\nconst app = await NestFactory.create(AppModule, { logger: ['error'] });\nif (CHE_DO === 'lo') app.useGlobalFilters(new LoLoiFilter());\nif (CHE_DO === 'problem') app.useGlobalFilters(new ProblemFilter(app.get(HttpAdapterHost)));\nawait app.listen(3000);\nconst goi = async (m: string, u: string, body?: string) => {\n  const r = await fetch('http://127.0.0.1:3000' + u, { method: m, body, headers: body ? { 'content-type': 'application/json' } : {} });\n  const t = await r.text();\n  console.log(`${m} ${u} → ${r.status} ${r.headers.get('content-type')?.split(';')[0]}\\n    ${t.length > 400 ? t.slice(0, 400) + '…' : t}`);\n};\nfor (const u of (process.env.URLS ?? 'a/9 b/9 c d e f').split(' ')) await goi('GET', '/rooms/' + u);\nawait goi('POST', '/rooms/g', '{\"slot\": 3,}');\nawait app.close();";
const OUT_MACDINH = "## mac-dinh\nGET /rooms/a/9 → 404 application/json\n    {\"message\":\"Không có phòng 9\",\"error\":\"Not Found\",\"statusCode\":404}\nGET /rooms/b/9 → 404 application/json\n    {\"message\":\"Không có phòng 9\",\"error\":\"Not Found\",\"statusCode\":404,\"errorCode\":\"ROOM_NOT_FOUND\"}\nGET /rooms/c → 409 application/json\n    {\"ly_do\":\"trùng giờ\",\"voi\":\"booking #12\"}\nGET /rooms/d → 409 application/json\n    {\"message\":\"Phòng đã có người đặt\",\"error\":\"Conflict\",\"statusCode\":409}\n[Nest] ERROR [ExceptionsHandler] Error: connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)\n    at RoomsController.e (file:///app/c3/app/dist/b32/loi.js:23:17)\n    at file:///app/nst-esm/node_modules/@nestjs/core/router/router-execution-context.js:80:37\n    at InterceptorsConsumer.intercept (file:///app/nst-esm/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:11:20)\n    at file:///app/nst-esm/node_modules/@nestjs/core/router/router-execution-context.js:116:64\n    at RoomsController.e (file:///app/nst-esm/node_modules/@nestjs/core/router/router-proxy.js:6:23)\n    at Layer.handleRequest (/app/nst-esm/node_modules/router/lib/layer.js:169:33)\n    at next (/app/nst-esm/node_modules/router/lib/route.js:163:13)\n    at Route.dispatch (/app/nst-esm/node_modules/router/lib/route.js:123:3)\n    at handle (/app/nst-esm/node_modules/router/index.js:449:11)\n    at Layer.handleRequest (/app/nst-esm/node_modules/router/lib/layer.js:169:33)\nGET /rooms/e → 500 application/json\n    {\"statusCode\":500,\"message\":\"Internal server error\"}\n[Nest] ERROR [ExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'slot')\n    at RoomsController.f (file:///app/c3/app/dist/b32/loi.js:24:48)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\nGET /rooms/f → 500 application/json\n    {\"statusCode\":500,\"message\":\"Internal server error\"}\nPOST /rooms/g → 400 application/json\n    {\"message\":\"Expected double-quoted property name in JSON at position 11 (line 1 column 12)\",\"error\":\"Bad Request\",\"statusCode\":400}";
const OUT_LO = "## CHE_DO=lo\nGET /rooms/b/9 → 404 application/json\n    {\"message\":\"Không có phòng 9\",\"stack\":\"NotFoundException: Không có phòng 9\\n    at RoomsController.b (file:///app/c3/app/dist/b32/loi.js:19:15)\\n    at file:///app/nst-esm/node_modules/@nestjs/core/router/router-execution-context.js:80:37\\n    at InterceptorsConsumer.intercept (file:///app/nst-esm/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:11:20)\\n    at file:///app/nst-esm/no…\nGET /rooms/e → 500 application/json\n    {\"message\":\"connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)\",\"stack\":\"Error: connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)\\n    at RoomsController.e (file:///app/c3/app/dist/b32/loi.js:23:17)\\n    at file:///app/nst-esm/node_modules/@nestjs/core/router/router-execution-context.js:80:37\\n    at InterceptorsConsumer.intercept (file:///app/nst-esm/node_modules/@nestjs/core/interceptors/in…\nPOST /rooms/g → 400 application/json\n    {\"message\":\"Expected double-quoted property name in JSON at position 11 (line 1 column 12)\",\"stack\":\"BadRequestException: Expected double-quoted property name in JSON at position 11 (line 1 column 12)\\n    at ExpressAdapter.mapException (file:///app/nst-esm/node_modules/@nestjs/platform-express/adapters/express-adapter.js:512:24)\\n    at callback (file:///app/nst-esm/node_modules/@nestjs/core/rout…";
const OUT_PROBLEM = "## CHE_DO=problem\nGET /rooms/a/9 → 404 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/404\",\"title\":\"NotFoundException\",\"status\":404,\"detail\":\"Không có phòng 9\",\"instance\":\"/rooms/a/9\"}\nGET /rooms/b/9 → 404 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/ROOM_NOT_FOUND\",\"title\":\"NotFoundException\",\"status\":404,\"detail\":\"Không có phòng 9\",\"instance\":\"/rooms/b/9\",\"code\":\"ROOM_NOT_FOUND\"}\nGET /rooms/c → 409 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/409\",\"title\":\"HttpException\",\"status\":409,\"detail\":\"Http Exception\",\"instance\":\"/rooms/c\",\"ly_do\":\"trùng giờ\",\"voi\":\"booking #12\"}\nGET /rooms/d → 409 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/409\",\"title\":\"ConflictException\",\"status\":409,\"detail\":\"Phòng đã có người đặt\",\"instance\":\"/rooms/d\"}\n[Nest] ERROR [Loi] GET /rooms/e: Error: connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin) |    at RoomsController.e (file:///app/c3/app/dist/b32/loi.js:23:17)\nGET /rooms/e → 500 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\":\"Lỗi phía máy chủ — đã ghi log.\",\"instance\":\"/rooms/e\"}\n[Nest] ERROR [Loi] GET /rooms/f: TypeError: Cannot read properties of undefined (reading 'slot') |    at RoomsController.f (file:///app/c3/app/dist/b32/loi.js:24:48)\nGET /rooms/f → 500 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\":\"Lỗi phía máy chủ — đã ghi log.\",\"instance\":\"/rooms/f\"}\nPOST /rooms/g → 400 application/problem+json\n    {\"type\":\"https://lab-booking.example/errors/400\",\"title\":\"BadRequestException\",\"status\":400,\"detail\":\"Expected double-quoted property name in JSON at position 11 (line 1 column 12)\",\"instance\":\"/rooms/g\"}";
const OUT_SENT = "[Nest] ERROR [Loi] GET /rooms/a/9: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client\nGET /rooms/a/9 → 404 application/json\n    {\"type\":\"https://lab-booking.example/errors/404\",\"title\":\"NotFoundException\",\"status\":404,\"detail\":\"Không có phòng 9\",\"instance\":\"/rooms/a/9\"}\nError [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client\n    at ServerResponse.setHeader (node:_http_outgoing:700:11)\n    at ServerResponse.header (/app/nst-esm/node_modules/express/lib/response.js:685:10)\n    …\n    at ProblemFilter.catch (file:///app/c3/app/dist/b32/loi.js:106:31)";
const MA_NGOAI = "import 'reflect-metadata';\nimport { Controller, Get, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n@Controller('jobs') class JobsController {\n  @Get('trong') async trong() { await new Promise((r) => setTimeout(r, 10)); throw new Error('lỗi TRONG chuỗi promise'); }\n  @Get('ngoai') ngoai() {\n    setTimeout(() => { throw new Error('lỗi trong callback setTimeout — NGOÀI chuỗi promise'); }, 10);\n    return { ok: 'đã nhận, sẽ gửi email sau' };\n  }\n}\n@Module({ controllers: [JobsController] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nfor (const u of ['/jobs/trong', '/jobs/ngoai', '/jobs/trong']) {\n  try { const r = await fetch('http://127.0.0.1:3000' + u); console.log(`GET ${u} → ${r.status} ${await r.text()}`); }\n  catch (e: any) { console.log(`GET ${u} → không kết nối được (${e.cause?.code})`); }\n  await new Promise((r) => setTimeout(r, 50));\n}";
const OUT_NGOAI = "GET /jobs/trong → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nGET /jobs/ngoai → 200 {\"ok\":\"đã nhận, sẽ gửi email sau\"}\nfile:///app/c3/app/dist/b32/ngoai.js:16\n        setTimeout(() => { throw new Error('lỗi trong callback setTimeout — NGOÀI chuỗi promise'); }, 10);\n                           ^\n\nError: lỗi trong callback setTimeout — NGOÀI chuỗi promise\n    at Timeout._onTimeout (file:///app/c3/app/dist/b32/ngoai.js:16:34)\n    at listOnTimeout (node:internal/timers:585:17)\n    at process.processTimers (node:internal/timers:521:7)\n\nNode.js v22.23.5\nexit 1";
const MA_BT = "import 'reflect-metadata';\nimport { ArgumentsHost, Catch, Controller, ExceptionFilter, Injectable, Module, Post } from '@nestjs/common';\nimport { APP_FILTER, NestFactory } from '@nestjs/core';\nimport type { Response } from 'express';\n\n// lỗi NGHIỆP VỤ: service không import gì của HTTP — dùng lại được cho hàng đợi, CLI, WebSocket\nexport class TrungLichError extends Error {\n  constructor(readonly bookingId: number) { super(`trùng lịch với #${bookingId}`); }\n}\n@Injectable() class BookingsService { tao() { throw new TrungLichError(12); } }\n\n@Catch(TrungLichError)\nclass TrungLichFilter implements ExceptionFilter {\n  catch(e: TrungLichError, host: ArgumentsHost) {\n    host.switchToHttp().getResponse<Response>().status(409).type('application/problem+json')\n      .json({ type: 'https://lab-booking.example/errors/BOOKING_CONFLICT', status: 409, detail: e.message, trungVoi: e.bookingId });\n  }\n}\n@Controller('bookings') class C { constructor(private s: BookingsService) {} @Post() tao() { return this.s.tao(); } }\n@Module({ controllers: [C], providers: [BookingsService, ...(process.env.CO_FILTER ? [{ provide: APP_FILTER, useClass: TrungLichFilter }] : [])] })\nclass AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst r = await fetch('http://127.0.0.1:3000/bookings', { method: 'POST' });\nconsole.log(`CO_FILTER=${process.env.CO_FILTER ?? ''} POST /bookings → ${r.status} ${await r.text()}`);\nawait app.close();";
const OUT_BT = "CO_FILTER= POST /bookings → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nCO_FILTER=1 POST /bookings → 409 {\"type\":\"https://lab-booking.example/errors/BOOKING_CONFLICT\",\"status\":409,\"detail\":\"trùng lịch với #12\",\"trungVoi\":12}";

export default {
  title: '3.2 — Exceptions and filters: HttpException, built-in errors, a problem+json filter|||3.2 — Ngoại lệ và filter: HttpException, lỗi dựng sẵn, filter trả problem+json',
  slug: 'nst-3-2-exception-filter',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chạy thật 7 loại lỗi: HttpException và lỗi dựng sẵn, errorCode mới của Nest 12, object tự chọn, cause bị giữ kín, Error lạ ⇒ 500 chung chung + stack ở log, JSON hỏng ⇒ 400. Filter "dễ dãi" lộ IP, user DB và đường dẫn mã; filter problem+json (RFC 9457) dùng HttpAdapterHost, chỉ log 5xx ở server. Bẫy: đặt header sau khi gửi; throw trong setTimeout làm chết cả tiến trình. Sự cố thật: Equifax 2017 (CVE-2017-5638 — lỗi ở chính đường xử lý ngoại lệ).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>3.2 — When things go wrong: what the client sees, what the log keeps</h2>
<p class="lead">Every API has two audiences for an error: the client, who needs a stable, machine-readable shape and nothing more; and you at 2 a.m., who need the full story in the log. Nest's exception layer sits at the end of the pipeline and catches whatever is thrown in guards, interceptors, pipes and handlers. This lesson measures what it does by default, then replaces it with one problem+json format for the whole API.</p>

<h3>Everyday analogy: the bank counter</h3>
<p>When a transfer fails, the teller says "the transaction could not be completed, reference 7F3A" — not "the core banking server at 10.0.3.15 rejected user lab_admin". The details go into the internal ticket under the same reference. A filter is that teller: it turns any internal failure into a short, consistent answer, and makes sure the reference connects it to the log.</p>

<h3>Experiment 1 — the default behaviour, case by case</h3>
<pre><code class="language-ts">${esc(MA_LOI)}</code></pre>
<div class="out">${esc(OUT_MACDINH)}</div>
<table>
<thead><tr><th>Thrown</th><th>Client got</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td><code>NotFoundException('…')</code></td><td>404 <code>{message, error, statusCode}</code></td><td>The built-in classes (<code>BadRequest</code>, <code>Unauthorized</code>, <code>Forbidden</code>, <code>NotFound</code>, <code>Conflict</code>, …) build this body for you.</td></tr>
<tr><td>… with <code>{ errorCode }</code></td><td>same + <code>"errorCode":"ROOM_NOT_FOUND"</code></td><td><strong>New in Nest 12.</strong> A stable code for programs; the message is for people and may change or be translated.</td></tr>
<tr><td><code>HttpException(object, 409)</code></td><td>the object, as is</td><td>Full control — and full responsibility: no <code>statusCode</code> in the body unless you add it.</td></tr>
<tr><td><code>ConflictException(…, { cause })</code></td><td>no trace of <code>unique(room_id, slot)</code></td><td><code>cause</code> is for logs and debuggers; it is never serialized to the client.</td></tr>
<tr><td><code>new Error('ECONNREFUSED 10.0.3.15…')</code></td><td>500 <code>Internal server error</code></td><td>Anything that is not an <code>HttpException</code> becomes a generic 500. The stack goes to the log — good default.</td></tr>
<tr><td>error after <code>await</code></td><td>same 500</td><td>Async handlers are fine: Nest awaits them, so rejected promises are caught.</td></tr>
<tr><td>broken JSON body</td><td>400 with the parser's message</td><td>Thrown by Express's body parser, before any handler; Nest maps it to <code>BadRequestException</code>.</td></tr>
</tbody>
</table>

<h3>Experiment 2 — the "helpful" filter that leaks</h3>
<p>A pattern seen in many student projects and some real ones: a catch-all filter that returns <code>err.message</code> and <code>err.stack</code> "so the frontend can debug".</p>
<div class="out">${esc(OUT_LO)}</div>
<p>One request and an outsider knows: the database IP and port, the database user name, the absolute path of the code (<code>/app/c3/app/dist/…</code>), the Node framework and the router library with line numbers. That is reconnaissance done for free (weakness class CWE-209). The 500 response must say nothing the attacker can use; the details belong in the log, tied to a request id.</p>

<h3>🕵️ Real incident — Equifax, 2017</h3>
<p>In March 2017 Apache published CVE-2017-5638 for Struts 2. NVD's description: the Jakarta multipart parser had <em>"incorrect exception handling and error-message generation during file-upload attempts"</em>, allowing remote command execution through a crafted <code>Content-Type</code> header. The bug lived exactly in the error path — the code that builds an error message from a bad request evaluated part of that request. Equifax did not patch a public-facing portal; attackers got in that May. The US House Oversight Committee's report (December 2018) counted <strong>148 million</strong> people affected and called the breach "entirely preventable". Two takeaways for this lesson: error paths are attack surface just like happy paths, and never build error output by interpreting user input — at most quote it, escaped and length-limited (look at the <code>KhungGioPipe</code> message in lesson 3.3).</p>

<h3>Experiment 3 — one filter, one format: problem+json (RFC 9457)</h3>
<div class="out">${esc(OUT_PROBLEM)}</div>
<ul>
<li><code>@Catch()</code> with no argument catches <strong>everything</strong>, including non-HTTP errors. <code>@Catch(HttpException)</code> would leave unknown errors to Nest's default.</li>
<li>The filter talks to the HTTP server through <code>HttpAdapterHost</code>, not <code>res.status().json()</code>, so it works on Express and Fastify alike.</li>
<li><code>type</code> uses the Nest 12 <code>errorCode</code> when present — a URL clients can switch on and you can document.</li>
<li>5xx: client gets a fixed sentence, server log gets the first stack line. 4xx: the message is safe to show (you wrote it).</li>
<li>Extra fields of a custom <code>HttpException</code> object (<code>ly_do</code>, <code>voi</code>) become RFC 9457 "extension members".</li>
</ul>

<h3>Trap — setting a header after replying</h3>
<p>The first run of this very filter set <code>content-type</code> <em>after</em> <code>reply()</code>:</p>
<div class="out">${esc(OUT_SENT)}</div>
<p>The body reached the client with the wrong content type, and every error request produced a second error in the log. <code>ERR_HTTP_HEADERS_SENT</code> always means "something wrote to the response after it was sent" — in a filter, an interceptor that also writes, or a handler that uses <code>@Res()</code> and returns a value too.</p>

<h3>Experiment 4 — errors that never reach the filter</h3>
<pre><code class="language-ts">${esc(MA_NGOAI)}</code></pre>
<div class="out">${esc(OUT_NGOAI)}</div>
<p>An error thrown inside a <code>setTimeout</code>/event-emitter callback is outside the promise chain Nest is awaiting. No filter sees it: Node treats it as an uncaught exception and the <strong>whole process exits</strong> — the third request never got an answer, nor would anyone else's. "Send the email later" belongs in a queue (Chapter 9) or at least a <code>try/catch</code> inside the callback.</p>

<h3>Binding filters</h3>
<pre><code class="language-ts">@UseFilters(ProblemFilter)            // on a method or a controller class
app.useGlobalFilters(new ProblemFilter(app.get(HttpAdapterHost)));   // global, no DI
{ provide: APP_FILTER, useClass: ProblemFilter }                     // global, with DI — preferred (lesson 3.6)</code></pre>
<p>When several filters could match, the most specific one wins: method, then controller, then global. Only one filter handles a given error.</p>

<h3>🧪 Exercise (20 min)</h3>
<p><code>BookingsService</code> throws <code>ConflictException</code> today. But the same service will be called from a queue worker (Chapter 9) where "HTTP 409" means nothing. Make it throw a plain domain error <code>TrungLichError</code> and map it to 409 problem+json in a filter.</p>
<details><summary>Show answer</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Without the filter, the domain error is "unknown" ⇒ 500. With <code>@Catch(TrungLichError)</code> registered through <code>APP_FILTER</code>, it becomes 409 with the conflicting booking id. The service no longer imports anything from <code>@nestjs/common</code>'s HTTP exceptions.</p>
</details>

<h3>💼 On the job</h3>
<p>Mobile and web clients built by another team (often in another country) program against your error codes, not your messages. A real ticket shape: "the app shows 'Internal server error' when the slot is taken — return 409 with code BOOKING_CONFLICT". Agree on the list of codes in the API contract (OpenAPI, Chapter 4), and treat changing one as a breaking change.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpException</span><span class="v">Base class of HTTP errors: response body + status (+ options: <code>cause</code>, <code>description</code>, <code>errorCode</code>).</span></div>
  <div class="kv"><span class="k">errorCode</span><span class="v">Nest 12 option: stable machine-readable code added to the default body.</span></div>
  <div class="kv"><span class="k">@Catch()</span><span class="v">Declares which exception classes a filter handles; empty = everything.</span></div>
  <div class="kv"><span class="k">ArgumentsHost</span><span class="v">Wrapper around handler arguments; <code>switchToHttp()</code> gives request and response.</span></div>
  <div class="kv"><span class="k">HttpAdapterHost</span><span class="v">Access to the underlying server (Express/Fastify) in a platform-neutral way.</span></div>
  <div class="kv"><span class="k">problem+json</span><span class="v">RFC 9457 error format: <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>HTTP exceptions become their status and body; anything else becomes a generic 500 with the stack in the log.</li>
<li>Nest 12 <code>errorCode</code> gives clients a stable code; <code>cause</code> stays server-side.</li>
<li>Never return <code>err.message</code>/<code>err.stack</code> of unknown errors — it maps your infrastructure for an attacker (Equifax: the error path itself was the hole).</li>
<li>One global <code>@Catch()</code> filter ⇒ one error format; set headers before replying.</li>
<li>Errors outside the awaited chain (timers, emitters) kill the process — no filter can help.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>3.2 — Khi có lỗi: client thấy gì, log giữ gì</h2>
<p class="lead">Mỗi lỗi của API có hai người đọc: client, cần một dạng ổn định, máy đọc được, và không hơn; và chính bạn lúc 2 giờ sáng, cần đủ đầu đuôi trong log. Lớp ngoại lệ của Nest nằm cuối dây chuyền, bắt mọi thứ ném ra từ guard, interceptor, pipe và handler. Bài này đo xem mặc định Nest làm gì, rồi thay bằng một dạng problem+json cho cả API.</p>

<h3>Liên hệ đời thường: quầy giao dịch ngân hàng</h3>
<p>Khi chuyển khoản hỏng, giao dịch viên nói "giao dịch chưa thực hiện được, mã tra cứu 7F3A" — chứ không nói "máy chủ core banking ở 10.0.3.15 từ chối user lab_admin". Chi tiết nằm trong phiếu nội bộ, cùng mã tra cứu. Filter chính là giao dịch viên đó: biến mọi hỏng hóc bên trong thành một câu trả lời ngắn, nhất quán, và có mã nối sang log.</p>

<h3>Thí nghiệm 1 — mặc định của Nest, từng trường hợp</h3>
<pre><code class="language-ts">${esc(MA_LOI)}</code></pre>
<div class="out">${esc(OUT_MACDINH)}</div>
<table>
<thead><tr><th>Ném ra</th><th>Client nhận</th><th>Rút ra</th></tr></thead>
<tbody>
<tr><td><code>NotFoundException('…')</code></td><td>404 <code>{message, error, statusCode}</code></td><td>Các lớp dựng sẵn (<code>BadRequest</code>, <code>Unauthorized</code>, <code>Forbidden</code>, <code>NotFound</code>, <code>Conflict</code>, …) tự dựng body này.</td></tr>
<tr><td>… kèm <code>{ errorCode }</code></td><td>như trên + <code>"errorCode":"ROOM_NOT_FOUND"</code></td><td><strong>Mới ở Nest 12.</strong> Mã ổn định cho chương trình đọc; message là cho người đọc, có thể đổi hoặc dịch.</td></tr>
<tr><td><code>HttpException(object, 409)</code></td><td>nguyên object</td><td>Toàn quyền — và toàn trách nhiệm: body không có <code>statusCode</code> trừ khi bạn tự thêm.</td></tr>
<tr><td><code>ConflictException(…, { cause })</code></td><td>không dấu vết của <code>unique(room_id, slot)</code></td><td><code>cause</code> dành cho log và debugger; không bao giờ được gửi cho client.</td></tr>
<tr><td><code>new Error('ECONNREFUSED 10.0.3.15…')</code></td><td>500 <code>Internal server error</code></td><td>Thứ gì không phải <code>HttpException</code> đều thành 500 chung chung. Stack vào log — mặc định tốt.</td></tr>
<tr><td>lỗi sau <code>await</code></td><td>vẫn 500</td><td>Handler async không sao: Nest <code>await</code> nó, nên promise bị từ chối vẫn được bắt.</td></tr>
<tr><td>body JSON hỏng</td><td>400 kèm thông báo của bộ phân tích</td><td>Do bộ phân tích body của Express ném, trước mọi handler; Nest đổi thành <code>BadRequestException</code>.</td></tr>
</tbody>
</table>

<h3>Thí nghiệm 2 — filter "tốt bụng" làm lộ thông tin</h3>
<p>Mẫu thấy ở nhiều đồ án và cả vài dự án thật: một filter bắt hết rồi trả <code>err.message</code> và <code>err.stack</code> "để frontend dễ debug".</p>
<div class="out">${esc(OUT_LO)}</div>
<p>Một request là người ngoài biết: IP và cổng cơ sở dữ liệu, tên user cơ sở dữ liệu, đường dẫn tuyệt đối của mã (<code>/app/c3/app/dist/…</code>), framework và thư viện router kèm số dòng. Việc trinh sát đã được làm hộ, miễn phí (lớp điểm yếu CWE-209). Phản hồi 500 không được nói điều gì kẻ tấn công dùng được; chi tiết nằm trong log, gắn với request id.</p>

<h3>🕵️ Sự cố thật — Equifax, năm 2017</h3>
<p>Tháng 3/2017, Apache công bố CVE-2017-5638 cho Struts 2. Mô tả của NVD: bộ phân tích multipart Jakarta <em>"xử lý ngoại lệ và sinh thông báo lỗi không đúng khi tải tệp lên"</em>, cho phép chạy lệnh từ xa qua một header <code>Content-Type</code> được chế sẵn. Lỗi nằm đúng ở đường xử lý lỗi — đoạn mã dựng thông báo lỗi từ request hỏng đã "diễn giải" một phần chính request đó. Equifax không vá một cổng thông tin công khai; tháng 5 kẻ tấn công vào được. Báo cáo của Uỷ ban Giám sát Hạ viện Mỹ (12/2018) đếm <strong>148 triệu</strong> người bị ảnh hưởng và gọi vụ này là "hoàn toàn có thể ngăn được". Hai điều cho bài này: đường lỗi cũng là bề mặt tấn công như đường chạy đúng, và đừng bao giờ dựng output lỗi bằng cách diễn giải dữ liệu người dùng — cùng lắm là trích lại, đã thoát ký tự và giới hạn độ dài (xem thông báo của <code>KhungGioPipe</code> ở bài 3.3).</p>

<h3>Thí nghiệm 3 — một filter, một dạng: problem+json (RFC 9457)</h3>
<div class="out">${esc(OUT_PROBLEM)}</div>
<ul>
<li><code>@Catch()</code> không tham số bắt <strong>mọi thứ</strong>, kể cả lỗi không phải HTTP. <code>@Catch(HttpException)</code> thì để lỗi lạ lại cho mặc định của Nest.</li>
<li>Filter nói chuyện với server HTTP qua <code>HttpAdapterHost</code>, không qua <code>res.status().json()</code>, nên chạy được cả trên Express lẫn Fastify.</li>
<li><code>type</code> dùng <code>errorCode</code> của Nest 12 nếu có — một URL client rẽ nhánh theo được và bạn viết tài liệu được.</li>
<li>5xx: client nhận một câu cố định, log server giữ dòng stack đầu. 4xx: message an toàn để hiện (chính bạn viết).</li>
<li>Trường thêm của object <code>HttpException</code> tự chọn (<code>ly_do</code>, <code>voi</code>) thành "trường mở rộng" theo RFC 9457.</li>
</ul>

<h3>Bẫy — đặt header sau khi đã trả lời</h3>
<p>Lần chạy đầu của chính filter này đặt <code>content-type</code> <em>sau</em> <code>reply()</code>:</p>
<div class="out">${esc(OUT_SENT)}</div>
<p>Body tới client với content type sai, và mỗi request lỗi đẻ thêm một lỗi thứ hai trong log. <code>ERR_HTTP_HEADERS_SENT</code> luôn có nghĩa "có thứ ghi vào phản hồi sau khi nó đã gửi đi" — trong filter, trong interceptor cũng ghi, hoặc handler dùng <code>@Res()</code> mà vẫn <code>return</code> giá trị.</p>

<h3>Thí nghiệm 4 — lỗi không bao giờ tới filter</h3>
<pre><code class="language-ts">${esc(MA_NGOAI)}</code></pre>
<div class="out">${esc(OUT_NGOAI)}</div>
<p>Lỗi ném trong callback của <code>setTimeout</code> hay event emitter nằm ngoài chuỗi promise mà Nest đang <code>await</code>. Không filter nào thấy: Node coi là ngoại lệ không bắt và <strong>cả tiến trình thoát</strong> — request thứ ba không có trả lời, request của mọi người khác cũng vậy. Việc "gửi email sau" thuộc về hàng đợi (Chương 9), hoặc ít nhất là <code>try/catch</code> ngay trong callback.</p>

<h3>Gắn filter</h3>
<pre><code class="language-ts">@UseFilters(ProblemFilter)            // trên một method hoặc class controller
app.useGlobalFilters(new ProblemFilter(app.get(HttpAdapterHost)));   // toàn cục, không DI
{ provide: APP_FILTER, useClass: ProblemFilter }                     // toàn cục, có DI — nên dùng (bài 3.6)</code></pre>
<p>Khi nhiều filter cùng khớp, filter cụ thể nhất thắng: method, rồi controller, rồi toàn cục. Mỗi lỗi chỉ một filter xử lý.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Hiện <code>BookingsService</code> ném <code>ConflictException</code>. Nhưng chính service này sẽ được gọi từ worker hàng đợi (Chương 9), nơi "HTTP 409" vô nghĩa. Cho nó ném lỗi nghiệp vụ thuần <code>TrungLichError</code>, rồi đổi thành 409 problem+json trong một filter.</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Không có filter, lỗi nghiệp vụ là "lỗi lạ" ⇒ 500. Có <code>@Catch(TrungLichError)</code> đăng ký qua <code>APP_FILTER</code>, nó thành 409 kèm id lịch bị trùng. Service không còn import ngoại lệ HTTP nào của <code>@nestjs/common</code>.</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>Ứng dụng di động và web do nhóm khác làm (thường ở nước khác) lập trình theo mã lỗi của bạn, không theo message. Một phiếu việc thật có dạng: "ứng dụng hiện 'Internal server error' khi khung giờ đã có người đặt — trả 409 với mã BOOKING_CONFLICT". Thống nhất danh sách mã trong hợp đồng API (OpenAPI, Chương 4), và coi việc đổi một mã là thay đổi phá vỡ tương thích.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpException</span><span class="v">Lớp gốc của lỗi HTTP: body phản hồi + status (+ tuỳ chọn: <code>cause</code>, <code>description</code>, <code>errorCode</code>).</span></div>
  <div class="kv"><span class="k">errorCode</span><span class="v">Tuỳ chọn mới của Nest 12: mã ổn định cho máy đọc, thêm vào body mặc định.</span></div>
  <div class="kv"><span class="k">@Catch()</span><span class="v">Khai filter xử lý những lớp ngoại lệ nào; để trống = mọi thứ.</span></div>
  <div class="kv"><span class="k">ArgumentsHost</span><span class="v">Lớp bọc tham số của handler; <code>switchToHttp()</code> cho request và response.</span></div>
  <div class="kv"><span class="k">HttpAdapterHost</span><span class="v">Truy cập server bên dưới (Express/Fastify) mà không phụ thuộc nền tảng.</span></div>
  <div class="kv"><span class="k">problem+json</span><span class="v">Dạng lỗi RFC 9457: <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ngoại lệ HTTP thành đúng status và body của nó; thứ khác thành 500 chung chung, stack vào log.</li>
<li><code>errorCode</code> của Nest 12 cho client một mã ổn định; <code>cause</code> chỉ ở phía server.</li>
<li>Đừng bao giờ trả <code>err.message</code>/<code>err.stack</code> của lỗi lạ — nó vẽ bản đồ hạ tầng cho kẻ tấn công (Equifax: chính đường lỗi là lỗ hổng).</li>
<li>Một filter <code>@Catch()</code> toàn cục ⇒ một dạng lỗi; đặt header trước khi trả lời.</li>
<li>Lỗi nằm ngoài chuỗi được <code>await</code> (timer, emitter) giết cả tiến trình — filter nào cũng bó tay.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
