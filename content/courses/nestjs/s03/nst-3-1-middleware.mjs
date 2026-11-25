/**
 * 3.1 — Middleware (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0, Express 5, helmet 8.3.0) — scratchpad/nst/lab/c3/app/src/b31:
 * mw.ts (request id dạng hàm + đo thời gian dạng class có DI, exclude health, 404 vẫn qua middleware, id bẩn bị thay),
 * them.ts (CHE_DO=helmet có/không HELMET=1 + enableCors; CHE_DO=quen-next ⇒ request treo, fetch huỷ sau 2 s),
 * sao.ts (forRoutes '*', '*path', '{*path}', 'rooms/*' [cảnh báo LegacyRouteConverter], 'rooms/{*path}', 'rooms', 'rooms,rooms/*path' ⇒ chạy 2 lần).
 * Logger Nest: đã cắt PID + ngày giờ (NO_COLOR=1, sed) cho gọn.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-3-middleware', title: 'Node.js 5.3 — Middleware: sợi dây mọi request đi qua', sub: 'Nền Express: (req, res, next), thứ tự app.use, lỗi đi đường riêng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — Một mã xuyên mọi tầng', sub: 'Request id + AsyncLocalStorage để log của mọi tầng có cùng mã.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-9-1-header-csp-cors', title: 'Node.js 9.1 — Header bảo mật, CSP và CORS', sub: 'Từng header helmet bật để làm gì — bài này chỉ chỉ cách gắn vào Nest.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'API Design 6.4 — CORS, CSRF và trình duyệt', sub: 'CORS chặn trình duyệt đọc phản hồi, không chặn request tới server.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Middleware', 'NestMiddleware, functional middleware, MiddlewareConsumer, exclude, forRoutes.', 'https://docs.nestjs.com/middleware'),
  nguon('📘', 'NestJS Docs — Migration guide (wildcard)', 'Express 5/path-to-regexp 8: "*" phải có tên — *path, {*path}.', 'https://docs.nestjs.com/migration-guide'),
  nguon('📦', 'helmet trên npm', 'Bộ middleware đặt header bảo mật; bản 8.3.0 dùng trong bài.', 'https://www.npmjs.com/package/helmet'),
].join('\n');

const FOR_ROUTES = `configure(c: MiddlewareConsumer) {
  c.apply(dem).forRoutes(P);    // P lần lượt là các mẫu dưới đây
}
// gọi lần lượt: GET /   GET /rooms   GET /rooms/7/bookings`;
const MA_MW = "import 'reflect-metadata';\nimport { Controller, Get, Injectable, Logger, MiddlewareConsumer, Module, NestMiddleware, NestModule, Param, RequestMethod } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport type { NextFunction, Request, Response } from 'express';\nimport { randomUUID } from 'node:crypto';\nimport helmet from 'helmet';\n\n// 1) Middleware DẠNG HÀM: không có DI, chỉ (req, res, next) như Express\nexport function requestId(req: Request, res: Response, next: NextFunction) {\n  const goi = req.header('x-request-id');\n  // nhận id từ phía trước (gateway, service khác) nhưng KHÔNG tin mù: chỉ chữ/số/gạch, tối đa 64 ký tự\n  const id = goi && /^[\\w-]{1,64}$/.test(goi) ? goi : randomUUID().slice(0, 8);\n  (req as any).id = id;\n  res.setHeader('x-request-id', id);\n  next();\n}\n\n// 2) Middleware DẠNG CLASS: được tiêm phụ thuộc (ở đây là Clock)\n@Injectable() export class Clock { now() { return performance.now(); } }\n\n@Injectable()\nexport class TimingMiddleware implements NestMiddleware {\n  private log = new Logger('HTTP');\n  constructor(private readonly clock: Clock) {}\n  use(req: Request, res: Response, next: NextFunction) {\n    const t0 = this.clock.now();\n    // middleware chạy TRƯỚC handler — muốn biết kết quả phải chờ sự kiện 'finish'\n    res.on('finish', () => {\n      this.log.log(`${req.method} ${req.originalUrl} → ${res.statusCode} ${(this.clock.now() - t0).toFixed(1)} ms id=${(req as any).id}`);\n    });\n    next();\n  }\n}\n\n@Controller('rooms')\nclass RoomsController {\n  @Get() list() { return [{ id: 1, name: 'Lab 401' }]; }\n  @Get(':id') one(@Param('id') id: string) { return { id, name: 'Lab ' + id }; }\n}\n@Controller('health')\nclass HealthController { @Get() ok() { return { ok: true }; } }\n\n@Module({ controllers: [RoomsController, HealthController], providers: [Clock] })\nclass AppModule implements NestModule {\n  configure(consumer: MiddlewareConsumer) {\n    consumer.apply(requestId, TimingMiddleware)            // chạy theo đúng thứ tự liệt kê\n      .exclude({ path: 'health', method: RequestMethod.GET }) // health check không cần log\n      .forRoutes('*path');                                  // Nest 11+/Express 5: wildcard phải có tên\n  }\n}\n\nconst app = await NestFactory.create(AppModule, { logger: ['log', 'error'] });\nif (process.env.HELMET) app.use(helmet());                  // middleware Express \"nguyên con\"\nawait app.listen(3000);\nconst hien = async (url: string, h: Record<string, string> = {}) => {\n  const r = await fetch('http://127.0.0.1:3000' + url, { headers: h });\n  await r.text();\n  console.log(`  ${url} → ${r.status}  x-request-id=${r.headers.get('x-request-id')}`);\n};\nawait hien('/rooms');\nawait hien('/rooms/7', { 'x-request-id': 'abc123' });\nawait hien('/rooms', { 'x-request-id': '<script>alert(1)</script>' });\nawait hien('/health');\nawait hien('/khong-co');                                    // route không tồn tại vẫn đi qua middleware\nawait new Promise((r) => setTimeout(r, 50));\nawait app.close();";
const OUT_MW = "[Nest] LOG [NestFactory] Starting Nest application...\n[Nest] LOG [InstanceLoader] AppModule dependencies initialized +6ms\n[Nest] LOG [RoutesResolver] RoomsController {/rooms}: +5ms\n[Nest] LOG [RouterExplorer] Mapped {/rooms, GET} route +2ms\n[Nest] LOG [RouterExplorer] Mapped {/rooms/:id, GET} route +0ms\n[Nest] LOG [RoutesResolver] HealthController {/health}: +1ms\n[Nest] LOG [RouterExplorer] Mapped {/health, GET} route +0ms\n[Nest] LOG [NestApplication] Nest application successfully started +1ms\n[Nest] LOG [HTTP] GET /rooms → 200 2.8 ms id=4d3491d8\n  /rooms → 200  x-request-id=4d3491d8\n[Nest] LOG [HTTP] GET /rooms/7 → 200 0.7 ms id=abc123\n  /rooms/7 → 200  x-request-id=abc123\n[Nest] LOG [HTTP] GET /rooms → 200 0.3 ms id=e73baffa\n  /rooms → 200  x-request-id=e73baffa\n  /health → 200  x-request-id=null\n[Nest] LOG [HTTP] GET /khong-co → 404 0.7 ms id=d3fcab16\n  /khong-co → 404  x-request-id=d3fcab16";
const MA_THEM = "import 'reflect-metadata';\nimport { Controller, Get, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport type { NextFunction, Request, Response } from 'express';\nimport helmet from 'helmet';\n\nconst CHE_DO = process.env.CHE_DO ?? 'helmet';\n@Controller('rooms') class RoomsController { @Get() list() { return []; } }\n\nfunction quenNext(req: Request, _res: Response, _next: NextFunction) {\n  console.log(`  [quenNext] thấy ${req.method} ${req.originalUrl} … rồi quên gọi next()`);\n}\nfunction hoiHandler(req: Request, _res: Response, next: NextFunction) {\n  // chỉ có req, res, next — không có ExecutionContext, không biết class/method nào sẽ xử lý\n  next();\n}\n\n@Module({ controllers: [RoomsController] })\nclass AppModule implements NestModule {\n  configure(c: MiddlewareConsumer) {\n    if (CHE_DO === 'quen-next') c.apply(quenNext).forRoutes('*path');\n    if (CHE_DO === 'sao-tran') c.apply(hoiHandler).forRoutes('*');      // cú pháp cũ của Nest 10\n    if (CHE_DO === 'helmet') c.apply(hoiHandler).forRoutes(RoomsController); // gắn theo controller\n  }\n}\nconst app = await NestFactory.create(AppModule, { logger: ['warn', 'error'] });\nif (CHE_DO === 'helmet' && process.env.HELMET) app.use(helmet());\nif (CHE_DO === 'helmet') app.enableCors({ origin: 'https://lab.fpt.edu.vn' });\nawait app.listen(3000);\nconst ctl = new AbortController(); const hen = setTimeout(() => ctl.abort(), 2000);\ntry {\n  const r = await fetch('http://127.0.0.1:3000/rooms', { signal: ctl.signal, headers: { origin: 'https://evil.example' } });\n  console.log(`  GET /rooms → ${r.status}`);\n  for (const [k, v] of r.headers) if (!['date', 'connection', 'keep-alive', 'etag', 'content-length'].includes(k)) console.log(`    ${k}: ${v}`);\n} catch (e: any) { console.log(`  GET /rooms → sau 2 s vẫn không có phản hồi (${e.name})`); }\nclearTimeout(hen);\nawait app.close();";
const OUT_HELMET = "  GET /rooms → 200\n    access-control-allow-origin: https://lab.fpt.edu.vn\n    content-type: application/json; charset=utf-8\n    vary: Origin\n    x-powered-by: Express\n## HELMET=1\n  GET /rooms → 200\n    access-control-allow-origin: https://lab.fpt.edu.vn\n    content-security-policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests\n    content-type: application/json; charset=utf-8\n    cross-origin-opener-policy: same-origin\n    cross-origin-resource-policy: same-origin\n    origin-agent-cluster: ?1\n    referrer-policy: no-referrer\n    strict-transport-security: max-age=31536000; includeSubDomains\n    vary: Origin\n    x-content-type-options: nosniff\n    x-dns-prefetch-control: off\n    x-download-options: noopen\n    x-frame-options: SAMEORIGIN\n    x-permitted-cross-domain-policies: none\n    x-xss-protection: 0";
const OUT_QUEN = "  [quenNext] thấy GET /rooms … rồi quên gọi next()\n  GET /rooms → sau 2 s vẫn không có phản hồi (AbortError)";
const OUT_SAO = "  forRoutes('*') → middleware chạy cho: [\"/\",\"/rooms\",\"/rooms/7/bookings\"]\n  forRoutes('*path') → middleware chạy cho: [\"/rooms\",\"/rooms/7/bookings\"]\n  forRoutes('{*path}') → middleware chạy cho: [\"/\",\"/rooms\",\"/rooms/7/bookings\"]\n[Nest] WARN [LegacyRouteConverter] Unsupported route path: \"/rooms/*\". In previous vers\n  forRoutes('rooms/*') → middleware chạy cho: [\"/rooms/7/bookings\"]\n  forRoutes('rooms/{*path}') → middleware chạy cho: [\"/rooms/7/bookings\"]";
const OUT_BT = "  forRoutes('rooms') → middleware chạy cho: [\"/rooms\",\"/rooms/7/bookings\"]\n  forRoutes('rooms,rooms/*path') → middleware chạy cho: [\"/rooms\",\"/rooms/7/bookings\",\"/rooms/7/bookings\"]";

export default {
  title: '3.1 — Middleware: functional and class middleware, consumer.apply, and Express middleware reuse|||3.1 — Middleware: dạng hàm và dạng class, consumer.apply, dùng lại middleware Express',
  slug: 'nst-3-1-middleware',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lớp đầu tiên của dây chuyền: middleware dạng hàm (request id) và dạng class có DI (đo thời gian bằng sự kiện finish), consumer.apply().exclude().forRoutes(). Chạy thật: route 404 vẫn đi qua middleware, id bẩn từ client bị thay, quên next() làm request treo, helmet thêm 12 header và gỡ x-powered-by, CORS không chặn được request tới server. Bẫy Nest 11+/Express 5: "*path" không khớp "/", "rooms/*" bị cảnh báo, gắn hai mẫu chồng nhau làm middleware chạy hai lần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>3.1 — Middleware: the gate before Nest knows anything</h2>
<p class="lead">Chapter 1.4 drew the pipeline: middleware → guard → interceptor → pipe → handler → filter. This chapter takes it one layer at a time. Middleware is first, and it is the dumbest layer on purpose: it sees <code>req</code>, <code>res</code> and <code>next</code> — exactly Express — and nothing about which controller method will run. That makes it the right place for things that apply to every request regardless of route: request ids, access logs, security headers, CORS, body size limits.</p>

<h3>Everyday analogy: the building's front gate</h3>
<p>The guard at the gate of an office building writes everyone into the visitor book and hands out a visitor badge. They do not know which meeting you are going to, or whether you are allowed in that meeting room — that is the receptionist on each floor (a Nest <em>guard</em>, lesson 3.4). If the gate guard forgets to open the barrier (<code>next()</code>), nobody gets in and nobody gets told why.</p>

<h3>Experiment 1 — a functional middleware and a class middleware</h3>
<pre><code class="language-ts">${esc(MA_MW)}</code></pre>
<div class="out">${esc(OUT_MW)}</div>
<table>
<thead><tr><th>Line in the output</th><th>What it shows</th></tr></thead>
<tbody>
<tr><td><code>/rooms → 200 … id=4d3491d8</code></td><td>No id from the client, so the function middleware generated one and echoed it in the <code>x-request-id</code> header. The access log printed it too — the class middleware ran second, in the order given to <code>apply()</code>.</td></tr>
<tr><td><code>/rooms/7 … id=abc123</code></td><td>An id coming from upstream (API gateway, another service) is kept, so one id follows the request across services.</td></tr>
<tr><td><code>&lt;script&gt;…</code> → <code>e73baffa</code></td><td>Upstream ids are <strong>accepted but not trusted</strong>: only letters, digits, <code>_</code> and <code>-</code>, at most 64 characters. Anything else is replaced. A header you copy into logs and responses is user input.</td></tr>
<tr><td><code>/health → 200 x-request-id=null</code></td><td><code>exclude()</code> applies to the whole <code>apply(...)</code> group: both middlewares skipped health checks (a load balancer calls them every few seconds — you do not want them in the access log).</td></tr>
<tr><td><code>/khong-co → 404 … id=d3fcab16</code></td><td>The route does not exist, yet middleware ran. Middleware is mounted on paths, before Nest's router picks a handler.</td></tr>
</tbody>
</table>
<p>The class version is <code>@Injectable()</code> and receives <code>Clock</code> through DI — use it when the middleware needs a service (config, logger, a repository). The function version is lighter when it needs nothing. The duration is measured on <code>res.on('finish')</code>: middleware runs <em>before</em> the handler, so the only way to see the final status code is to wait for the response to be sent.</p>

<h3>Experiment 2 — reusing Express middleware: helmet and CORS</h3>
<pre><code class="language-ts">${esc(MA_THEM)}</code></pre>
<div class="out">${esc(OUT_HELMET)}</div>
<p>Any Express middleware works through <code>app.use()</code> — Nest does not wrap it. <code>helmet()</code> added the security headers and removed <code>x-powered-by: Express</code> (one less hint for someone scanning for known Express bugs). What each header does is covered in the Node.js course; here the point is <em>where</em> it goes: in <code>main.ts</code>, before <code>listen()</code>.</p>
<p>Look again at CORS: the request came from <code>origin: https://evil.example</code>, and the server still answered <strong>200 with the data</strong>. It only said "the allowed origin is <code>https://lab.fpt.edu.vn</code>". CORS tells <em>browsers</em> not to hand the response to another site's JavaScript; it does not stop curl, Postman or a script. Authentication is still the guard's job.</p>

<h3>Experiment 3 — forgetting <code>next()</code></h3>
<div class="out">${esc(OUT_QUEN)}</div>
<p>No error, no log, no response: the request just hangs until the client gives up (here after 2 seconds; a browser waits minutes). If a middleware neither calls <code>next()</code> nor sends a response, the request is stuck. Typical cause: an <code>if</code> branch that returns early. Rule: every path through a middleware ends in <code>next()</code>, <code>next(err)</code> or a response.</p>

<h3>Experiment 4 — wildcards changed in Nest 11 (Express 5)</h3>
<pre><code class="language-ts">${esc(FOR_ROUTES)}</code></pre>
<div class="out">${esc(OUT_SAO)}</div>
<ul>
<li><code>'*'</code> alone is converted silently and matches everything, including <code>/</code>.</li>
<li><code>'*path'</code> needs at least one segment: <strong><code>/</code> is not covered</strong>. <code>'{*path}'</code> (braces = optional) covers <code>/</code> too. Use <code>'{*path}'</code> for "every route".</li>
<li><code>'rooms/*'</code> is old syntax: Nest prints a warning and converts it. Old tutorials and Stack Overflow answers are full of it — read the warning, do not ignore it.</li>
<li><code>'rooms/{*path}'</code> did <em>not</em> match <code>/rooms</code> itself in this run, despite the braces. Measure your patterns; do not trust your intuition.</li>
</ul>

<h3>Where middleware fits — and where it does not</h3>
<table>
<thead><tr><th>Good fit for middleware</th><th>Belongs in a later layer</th></tr></thead>
<tbody>
<tr><td>Request id, access log, helmet, CORS, compression, body size limits, raw-body capture for webhooks</td><td>"Does this user have role X for this route?" — needs route metadata ⇒ guard (3.4)</td></tr>
<tr><td>Things that must run even for 404s</td><td>Changing the handler's return value, timing just the handler ⇒ interceptor (3.5)</td></tr>
<tr><td>Reusing an existing Express middleware</td><td>Turning parameters into types ⇒ pipe (3.3); error format ⇒ filter (3.2)</td></tr>
</tbody>
</table>

<h3>🧪 Exercise (15 min)</h3>
<p>Make the timing middleware run for <code>/rooms</code> and every route under it (<code>/rooms/7/bookings</code>), but not for <code>/</code>. Check with the counting script from experiment 4.</p>
<details><summary>Show answer</summary>
<div class="out">${esc(OUT_BT)}</div>
<p><code>forRoutes('rooms')</code> is enough: a plain path is mounted like Express <code>app.use('/rooms')</code>, a prefix, so children are included. <code>forRoutes(RoomsController)</code> also works and survives renaming the path. The trap: adding <code>'rooms/*path'</code> "to be safe" makes the middleware run <strong>twice</strong> for <code>/rooms/7/bookings</code> — two access-log lines, two ids generated, double-counted metrics.</p>
</details>

<h3>💼 On the job</h3>
<p>Outsourcing projects for foreign clients almost always sit behind an API gateway (Kong, AWS ALB, Azure API Management) that adds its own trace header. A common first ticket for a new member: "make our service keep the gateway's request id and log it". That is experiment 1 with the header name changed — plus the validation, because a security reviewer will ask what happens when the header contains 10 KB of garbage.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestMiddleware</span><span class="v">Interface for class middleware: <code>use(req, res, next)</code>; the class can receive DI.</span></div>
  <div class="kv"><span class="k">MiddlewareConsumer</span><span class="v">Object passed to <code>configure()</code>: <code>apply().exclude().forRoutes()</code>.</span></div>
  <div class="kv"><span class="k">forRoutes</span><span class="v">Paths, <code>{ path, method }</code> objects or controller classes the middleware is mounted on.</span></div>
  <div class="kv"><span class="k">{*path}</span><span class="v">Named, optional wildcard (Express 5 / path-to-regexp 8); matches <code>/</code> too.</span></div>
  <div class="kv"><span class="k">helmet</span><span class="v">Express middleware that sets security headers; used as is via <code>app.use()</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Middleware runs first, on paths, before Nest picks a handler — even for 404s — and knows nothing about the handler.</li>
<li>Function middleware for simple things; class middleware when you need DI.</li>
<li>Every path through a middleware must end in <code>next()</code> or a response, or the request hangs silently.</li>
<li>Express middleware (helmet, cors, compression) is reused with <code>app.use()</code>. CORS does not protect the server.</li>
<li>Nest 11+: use <code>'{*path}'</code> for everything; plain <code>'rooms'</code> already covers children; overlapping patterns run twice.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>3.1 — Middleware: cổng gác trước khi Nest biết bất cứ điều gì</h2>
<p class="lead">Bài 1.4 đã vẽ dây chuyền: middleware → guard → interceptor → pipe → handler → filter. Chương này đi từng lớp một. Middleware đứng đầu, và cố ý là lớp "ngốc" nhất: nó chỉ thấy <code>req</code>, <code>res</code>, <code>next</code> — y hệt Express — và không biết method nào của controller sẽ chạy. Vì vậy nó hợp với những việc áp cho mọi request bất kể route: request id, log truy cập, header bảo mật, CORS, giới hạn kích thước body.</p>

<h3>Liên hệ đời thường: bảo vệ ở cổng toà nhà</h3>
<p>Bác bảo vệ ở cổng toà văn phòng ghi tên mọi người vào sổ và phát thẻ khách. Bác không biết bạn lên họp phòng nào, cũng không biết bạn có được vào phòng họp đó không — đó là việc của lễ tân từng tầng (<em>guard</em> của Nest, bài 3.4). Nếu bác quên mở barie (<code>next()</code>), không ai vào được và cũng chẳng ai được báo lý do.</p>

<h3>Thí nghiệm 1 — middleware dạng hàm và dạng class</h3>
<pre><code class="language-ts">${esc(MA_MW)}</code></pre>
<div class="out">${esc(OUT_MW)}</div>
<table>
<thead><tr><th>Dòng trong output</th><th>Cho thấy điều gì</th></tr></thead>
<tbody>
<tr><td><code>/rooms → 200 … id=4d3491d8</code></td><td>Client không gửi id, nên middleware dạng hàm tự sinh và trả lại ở header <code>x-request-id</code>. Log truy cập cũng in id đó — middleware dạng class chạy thứ hai, đúng thứ tự liệt kê trong <code>apply()</code>.</td></tr>
<tr><td><code>/rooms/7 … id=abc123</code></td><td>Id từ phía trước (API gateway, service khác) được giữ nguyên, để một mã đi theo request qua nhiều service.</td></tr>
<tr><td><code>&lt;script&gt;…</code> → <code>e73baffa</code></td><td>Id từ phía trước được <strong>nhận nhưng không tin mù</strong>: chỉ chữ, số, <code>_</code>, <code>-</code>, tối đa 64 ký tự; sai thì thay. Header bạn chép vào log và phản hồi chính là dữ liệu người dùng nhập.</td></tr>
<tr><td><code>/health → 200 x-request-id=null</code></td><td><code>exclude()</code> áp cho cả nhóm <code>apply(...)</code>: cả hai middleware bỏ qua health check (bộ cân bằng tải gọi nó vài giây một lần — không ai muốn nó tràn log truy cập).</td></tr>
<tr><td><code>/khong-co → 404 … id=d3fcab16</code></td><td>Route không tồn tại mà middleware vẫn chạy. Middleware gắn theo đường dẫn, chạy trước khi router của Nest chọn handler.</td></tr>
</tbody>
</table>
<p>Bản class có <code>@Injectable()</code> và nhận <code>Clock</code> qua DI — dùng khi middleware cần một service (cấu hình, logger, repository). Bản hàm gọn hơn khi không cần gì. Thời gian đo ở sự kiện <code>res.on('finish')</code>: middleware chạy <em>trước</em> handler, nên muốn biết mã trạng thái cuối cùng chỉ có cách chờ phản hồi gửi xong.</p>

<h3>Thí nghiệm 2 — dùng lại middleware Express: helmet và CORS</h3>
<pre><code class="language-ts">${esc(MA_THEM)}</code></pre>
<div class="out">${esc(OUT_HELMET)}</div>
<p>Middleware Express nào cũng gắn được bằng <code>app.use()</code> — Nest không bọc gì cả. <code>helmet()</code> thêm loạt header bảo mật và gỡ <code>x-powered-by: Express</code> (bớt một gợi ý cho kẻ đang dò lỗi đã biết của Express). Từng header làm gì đã có ở khoá Node.js; ở đây chỉ cần nhớ <em>chỗ</em> gắn: trong <code>main.ts</code>, trước <code>listen()</code>.</p>
<p>Nhìn lại CORS: request đến từ <code>origin: https://evil.example</code>, vậy mà server vẫn trả <strong>200 kèm dữ liệu</strong>. Nó chỉ nói "nguồn được phép là <code>https://lab.fpt.edu.vn</code>". CORS bảo <em>trình duyệt</em> đừng đưa phản hồi cho JavaScript của trang khác; nó không chặn curl, Postman hay một kịch bản. Xác thực vẫn là việc của guard.</p>

<h3>Thí nghiệm 3 — quên <code>next()</code></h3>
<div class="out">${esc(OUT_QUEN)}</div>
<p>Không lỗi, không log, không phản hồi: request cứ treo tới khi client bỏ cuộc (ở đây sau 2 giây; trình duyệt chờ vài phút). Middleware không gọi <code>next()</code> mà cũng không gửi phản hồi thì request kẹt luôn. Nguyên nhân hay gặp: một nhánh <code>if</code> <code>return</code> sớm. Luật: mọi đường đi trong middleware phải kết thúc bằng <code>next()</code>, <code>next(err)</code> hoặc một phản hồi.</p>

<h3>Thí nghiệm 4 — ký tự đại diện đã đổi từ Nest 11 (Express 5)</h3>
<pre><code class="language-ts">${esc(FOR_ROUTES)}</code></pre>
<div class="out">${esc(OUT_SAO)}</div>
<ul>
<li><code>'*'</code> đứng một mình được đổi ngầm và khớp mọi thứ, kể cả <code>/</code>.</li>
<li><code>'*path'</code> cần ít nhất một đoạn: <strong>không khớp <code>/</code></strong>. <code>'{*path}'</code> (ngoặc nhọn = tuỳ chọn) khớp cả <code>/</code>. Muốn "mọi route" thì dùng <code>'{*path}'</code>.</li>
<li><code>'rooms/*'</code> là cú pháp cũ: Nest in cảnh báo rồi tự đổi. Bài hướng dẫn cũ và câu trả lời Stack Overflow đầy cú pháp này — đọc cảnh báo, đừng lờ đi.</li>
<li><code>'rooms/{*path}'</code> lần chạy này <em>không</em> khớp chính <code>/rooms</code>, dù có ngoặc nhọn. Hãy đo mẫu của mình, đừng tin trực giác.</li>
</ul>

<h3>Middleware hợp với việc gì — và không hợp với việc gì</h3>
<table>
<thead><tr><th>Hợp với middleware</th><th>Thuộc về lớp sau</th></tr></thead>
<tbody>
<tr><td>Request id, log truy cập, helmet, CORS, nén, giới hạn body, giữ body thô cho webhook</td><td>"Người này có vai trò X cho route này không?" — cần metadata của route ⇒ guard (3.4)</td></tr>
<tr><td>Việc phải chạy cả với 404</td><td>Đổi giá trị handler trả về, đo riêng thời gian handler ⇒ interceptor (3.5)</td></tr>
<tr><td>Dùng lại một middleware Express có sẵn</td><td>Đổi tham số thành đúng kiểu ⇒ pipe (3.3); dạng lỗi ⇒ filter (3.2)</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Cho middleware đo thời gian chạy với <code>/rooms</code> và mọi route bên dưới (<code>/rooms/7/bookings</code>), nhưng không chạy với <code>/</code>. Kiểm bằng kịch bản đếm ở thí nghiệm 4.</p>
<details><summary>Xem đáp án</summary>
<div class="out">${esc(OUT_BT)}</div>
<p><code>forRoutes('rooms')</code> là đủ: đường dẫn thường được gắn như <code>app.use('/rooms')</code> của Express — khớp theo tiền tố, nên gồm cả route con. <code>forRoutes(RoomsController)</code> cũng được, và không vỡ khi đổi tên đường dẫn. Bẫy: thêm <code>'rooms/*path'</code> "cho chắc" khiến middleware chạy <strong>hai lần</strong> với <code>/rooms/7/bookings</code> — hai dòng log truy cập, sinh hai id, số đo bị đếm đôi.</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>Dự án outsourcing cho khách nước ngoài gần như luôn đứng sau một API gateway (Kong, AWS ALB, Azure API Management) tự thêm header vết của nó. Phiếu việc đầu tiên hay giao cho người mới: "cho service giữ request id của gateway và ghi vào log". Đó chính là thí nghiệm 1 đổi tên header — cộng thêm bước kiểm, vì người review bảo mật sẽ hỏi: header chứa 10 KB rác thì sao?</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestMiddleware</span><span class="v">Interface cho middleware dạng class: <code>use(req, res, next)</code>; class được tiêm phụ thuộc.</span></div>
  <div class="kv"><span class="k">MiddlewareConsumer</span><span class="v">Đối tượng truyền vào <code>configure()</code>: <code>apply().exclude().forRoutes()</code>.</span></div>
  <div class="kv"><span class="k">forRoutes</span><span class="v">Đường dẫn, object <code>{ path, method }</code> hoặc class controller mà middleware gắn vào.</span></div>
  <div class="kv"><span class="k">{*path}</span><span class="v">Ký tự đại diện có tên, tuỳ chọn (Express 5 / path-to-regexp 8); khớp cả <code>/</code>.</span></div>
  <div class="kv"><span class="k">helmet</span><span class="v">Middleware Express đặt header bảo mật; dùng nguyên bằng <code>app.use()</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Middleware chạy đầu tiên, theo đường dẫn, trước khi Nest chọn handler — cả với 404 — và không biết gì về handler.</li>
<li>Dạng hàm cho việc đơn giản; dạng class khi cần DI.</li>
<li>Mọi đường đi trong middleware phải kết thúc bằng <code>next()</code> hoặc một phản hồi, kẻo request treo lặng lẽ.</li>
<li>Middleware Express (helmet, cors, compression) dùng lại bằng <code>app.use()</code>. CORS không bảo vệ server.</li>
<li>Nest 11 trở đi: <code>'{*path}'</code> cho mọi route; <code>'rooms'</code> đã gồm route con; mẫu chồng nhau làm chạy hai lần.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
