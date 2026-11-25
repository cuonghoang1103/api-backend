/**
 * 3.5 — Interceptor (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0, rxjs 7.8) — scratchpad/nst/lab/c3/app/src/b35:
 * rx.ts (Observable lười, tap/map, catchError, timeout ⇒ TimeoutError), icp.ts (Timing + Boc qua APP_INTERCEPTOR, Timeout ở controller,
 * Cache ở route; pipe lỗi vẫn bị interceptor thấy; timeout 408 nhưng handler vẫn chạy xong sau 500 ms; lần gọi 2 lấy cache, handler 1 lần),
 * bt.ts (Server-Timing header đặt trong tap).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-9-1-server-cache', title: 'API Design 9.2 — Cache phía server với Redis', sub: 'Cache thật dùng chung nhiều tiến trình, và cơn dồn request khi khoá hết hạn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js 15.1 — Ba trụ cột quan sát', sub: 'Log, số đo, vết — interceptor đo thời gian là một nguồn số đo.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Interceptors', 'NestInterceptor, CallHandler, map/tap/catchError/timeout, ghi đè luồng.', 'https://docs.nestjs.com/interceptors'),
  nguon('📘', 'RxJS — Observable', 'Observable lười: không chạy cho tới khi có subscribe.', 'https://rxjs.dev/guide/observable'),
  nguon('📘', 'MDN — Server-Timing', 'Header cho DevTools hiện thời gian xử lý phía server.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Server-Timing'),
].join('\n');
const MA_RX = "// RxJS vừa đủ cho interceptor — chạy bằng node, không cần Nest\nimport { Observable, catchError, map, of, tap, throwError, timeout, firstValueFrom, delay } from 'rxjs';\n\n// Observable = \"công thức\" phát giá trị; CHƯA chạy cho tới khi có người subscribe\nconst handler = new Observable<number>((sub) => { console.log('  [handler] bắt đầu chạy'); sub.next(42); sub.complete(); });\nconsole.log('1) đã tạo Observable — chưa có dòng [handler] nào');\nconst kq = handler.pipe(\n  tap((v) => console.log('  [tap] nhìn thấy', v, '— không đổi giá trị')),\n  map((v) => ({ data: v })),\n);\nconsole.log('2) đã pipe — vẫn chưa chạy');\nconsole.log('3) subscribe →', JSON.stringify(await firstValueFrom(kq)));\n\nconst loi = throwError(() => new Error('DB sập'));\nconsole.log('4) catchError →', JSON.stringify(await firstValueFrom(loi.pipe(catchError((e) => of({ loi: e.message }))))));\ntry { await firstValueFrom(of('chậm').pipe(delay(300), timeout(100))); }\ncatch (e: any) { console.log('5) timeout(100) với nguồn chậm 300 ms →', e.name); }";
const OUT_RX = "1) đã tạo Observable — chưa có dòng [handler] nào\n2) đã pipe — vẫn chưa chạy\n  [handler] bắt đầu chạy\n  [tap] nhìn thấy 42 — không đổi giá trị\n3) subscribe → {\"data\":42}\n4) catchError → {\"loi\":\"DB sập\"}\n5) timeout(100) với nguồn chậm 300 ms → TimeoutError";
const MA_ICP = "import 'reflect-metadata';\nimport {\n  CallHandler, Controller, ExecutionContext, Get, Injectable, Logger, Module, NestInterceptor, Param, ParseIntPipe,\n  RequestTimeoutException, UseInterceptors,\n} from '@nestjs/common';\nimport { APP_INTERCEPTOR, NestFactory } from '@nestjs/core';\nimport { Observable, TimeoutError, catchError, map, of, tap, throwError, timeout } from 'rxjs';\n\n@Injectable()\nclass TimingInterceptor implements NestInterceptor {\n  private log = new Logger('Time');\n  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {\n    const t0 = performance.now();\n    const ten = `${ctx.getClass().name}.${ctx.getHandler().name}`;     // interceptor BIẾT handler nào — middleware thì không\n    return next.handle().pipe(tap({\n      next: () => this.log.log(`${ten} ok ${(performance.now() - t0).toFixed(0)} ms`),\n      error: (e) => this.log.warn(`${ten} lỗi ${e.constructor.name} ${(performance.now() - t0).toFixed(0)} ms`),\n    }));\n  }\n}\n@Injectable()\nclass BocInterceptor implements NestInterceptor {                       // { data: … } cho mọi phản hồi thành công\n  intercept(_c: ExecutionContext, next: CallHandler) { return next.handle().pipe(map((data) => ({ data }))); }\n}\n@Injectable()\nclass TimeoutInterceptor implements NestInterceptor {\n  intercept(_c: ExecutionContext, next: CallHandler) {\n    return next.handle().pipe(timeout(200), catchError((e) =>\n      e instanceof TimeoutError ? throwError(() => new RequestTimeoutException('Quá 200 ms')) : throwError(() => e)));\n  }\n}\n@Injectable()\nclass CacheInterceptor implements NestInterceptor {                     // cache trong bộ nhớ, 1 tiến trình — chỉ để hiểu cơ chế\n  private kho = new Map<string, { het: number; v: unknown }>();\n  intercept(ctx: ExecutionContext, next: CallHandler) {\n    const k = ctx.switchToHttp().getRequest().originalUrl;\n    const o = this.kho.get(k);\n    if (o && o.het > Date.now()) return of(o.v);                         // KHÔNG gọi next.handle() ⇒ handler không chạy\n    return next.handle().pipe(tap((v) => this.kho.set(k, { het: Date.now() + 5000, v })));\n  }\n}\nconst ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));\nlet lanGoi = 0;\n@Controller('rooms')\n@UseInterceptors(TimeoutInterceptor)\nclass RoomsController {\n  @Get('cham') async cham() { await ngu(500); console.log('  [cham] handler VẪN chạy xong sau 500 ms — timeout không huỷ được việc đang làm'); return 'xong muộn'; }\n  @Get('trong/:ngay') @UseInterceptors(CacheInterceptor)\n  async trong(@Param('ngay') ngay: string) { lanGoi++; await ngu(80); return { ngay, phongTrong: ['401', '402'], lanGoiHandler: lanGoi }; }\n  @Get(':id') one(@Param('id', ParseIntPipe) id: number) { return { id }; }\n}\n@Module({ controllers: [RoomsController], providers: [\n  { provide: APP_INTERCEPTOR, useClass: TimingInterceptor }, { provide: APP_INTERCEPTOR, useClass: BocInterceptor }] })\nclass AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: ['log', 'warn'] });\nawait app.listen(3000);\nconst sau = (s: string) => s.startsWith('[Nest]');\nfor (const u of ['/rooms/1', '/rooms/abc', '/rooms/cham', '/rooms/trong/2026-11-25', '/rooms/trong/2026-11-25']) {\n  const r = await fetch('http://127.0.0.1:3000' + u);\n  console.log(`GET ${u} → ${r.status} ${await r.text()}`);\n}\nawait ngu(600);\nawait app.close();";
const OUT_ICP = "[Nest] LOG [Time] RoomsController.one ok 1 ms\nGET /rooms/1 → 200 {\"data\":{\"id\":1}}\n[Nest] WARN [Time] RoomsController.one lỗi BadRequestException 0 ms\nGET /rooms/abc → 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\n[Nest] WARN [Time] RoomsController.cham lỗi RequestTimeoutException 202 ms\nGET /rooms/cham → 408 {\"message\":\"Quá 200 ms\",\"error\":\"Request Timeout\",\"statusCode\":408}\n[Nest] LOG [Time] RoomsController.trong ok 81 ms\nGET /rooms/trong/2026-11-25 → 200 {\"data\":{\"ngay\":\"2026-11-25\",\"phongTrong\":[\"401\",\"402\"],\"lanGoiHandler\":1}}\n[Nest] LOG [Time] RoomsController.trong ok 0 ms\nGET /rooms/trong/2026-11-25 → 200 {\"data\":{\"ngay\":\"2026-11-25\",\"phongTrong\":[\"401\",\"402\"],\"lanGoiHandler\":1}}\n  [cham] handler VẪN chạy xong sau 500 ms — timeout không huỷ được việc đang làm";
const MA_BT = "import 'reflect-metadata';\nimport { CallHandler, Controller, ExecutionContext, Get, Injectable, Module, NestInterceptor } from '@nestjs/common';\nimport { APP_INTERCEPTOR, NestFactory } from '@nestjs/core';\nimport { tap } from 'rxjs';\n@Injectable()\nclass ServerTiming implements NestInterceptor {\n  intercept(ctx: ExecutionContext, next: CallHandler) {\n    const t0 = performance.now();\n    // tap chạy khi handler có kết quả, TRƯỚC khi Nest gửi phản hồi ⇒ vẫn kịp đặt header\n    return next.handle().pipe(tap(() => ctx.switchToHttp().getResponse().setHeader('server-timing', `app;dur=${(performance.now() - t0).toFixed(1)}`)));\n  }\n}\n@Controller('rooms') class C { @Get() async ds() { await new Promise((r) => setTimeout(r, 40)); return []; } }\n@Module({ controllers: [C], providers: [{ provide: APP_INTERCEPTOR, useClass: ServerTiming }] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst r = await fetch('http://127.0.0.1:3000/rooms');\nconsole.log(`GET /rooms → ${r.status} server-timing: ${r.headers.get('server-timing')}`);\nawait app.close();";
const OUT_BT = "GET /rooms → 200 server-timing: app;dur=40.7";

export default {
  title: '3.5 — Interceptors: just enough RxJS, timing, response mapping, timeouts and caching|||3.5 — Interceptor: RxJS vừa đủ, đo thời gian, đổi dạng phản hồi, timeout và cache',
  slug: 'nst-3-5-interceptor',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Interceptor bọc quanh handler: chạy trước, nhận kết quả hoặc lỗi sau. RxJS vừa đủ (Observable lười, tap, map, catchError, timeout) chạy bằng node. Bốn interceptor chạy thật: đo thời gian theo tên Class.method, bọc phản hồi {data}, timeout 200 ms ⇒ 408 (nhưng handler vẫn chạy xong — timeout không huỷ việc), cache trong bộ nhớ bỏ qua handler. Lỗi của pipe vẫn đi qua interceptor. So sánh với middleware. Bài tập: header Server-Timing.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>3.5 — Interceptors: wrap the handler, before and after</h2>
<p class="lead">An interceptor is the only layer that sees both sides of the handler: it runs code before, then receives the handler's result (or error) as a stream it can transform. That makes it the place for timing, response envelopes, timeouts, caching and mapping errors — anything that needs to "wrap" the call. The stream is an RxJS <code>Observable</code>; you need only five operators.</p>

<h3>Everyday analogy: the delivery app</h3>
<p>The app takes your order before the restaurant sees it (before), and it receives the meal from the restaurant before you do (after). On the way back it can put it in a branded bag (map), note the cooking time (tap), cancel and refund if it takes too long (timeout) — or, for a drink it delivered five minutes ago to the same address, just send another from stock without bothering the kitchen (cache).</p>

<h3>RxJS, just enough</h3>
<pre><code class="language-ts">${esc(MA_RX)}</code></pre>
<div class="out">${esc(OUT_RX)}</div>
<ul>
<li>An <code>Observable</code> is a recipe; nothing runs until someone subscribes (lines 1–2 printed before the handler). Nest subscribes for you after your interceptors have built the pipe.</li>
<li><code>tap</code> looks without changing; <code>map</code> changes the value; <code>catchError</code> replaces an error with a value or another error; <code>timeout</code> turns "too slow" into a <code>TimeoutError</code>.</li>
<li>Handlers that return a plain value or a <code>Promise</code> are wrapped into an Observable by Nest — you never have to return Observables from controllers.</li>
</ul>

<h3>Experiment — four interceptors on a rooms controller</h3>
<pre><code class="language-ts">${esc(MA_ICP)}</code></pre>
<div class="out">${esc(OUT_ICP)}</div>
<table>
<thead><tr><th>Request</th><th>What happened</th></tr></thead>
<tbody>
<tr><td><code>/rooms/1</code></td><td><code>TimingInterceptor</code> logged <code>RoomsController.one</code> — the class and method names, which middleware cannot know. <code>BocInterceptor</code> wrapped the body as <code>{"data":…}</code>.</td></tr>
<tr><td><code>/rooms/abc</code></td><td>The <code>ParseIntPipe</code> error was seen by the timing interceptor: pipes run <em>inside</em> the interceptor's <code>next.handle()</code>. The error body is not wrapped — <code>map</code> only touches successful values.</td></tr>
<tr><td><code>/rooms/cham</code></td><td>After 200 ms the client got <strong>408</strong>. And then, at the end of the output: <em>"handler VẪN chạy xong sau 500 ms"</em>. A timeout stops <strong>waiting</strong>; it does not stop the <strong>work</strong>. If the handler was writing to the database, the write still happens. For real cancellation, pass an <code>AbortSignal</code> down to the HTTP client or query.</td></tr>
<tr><td><code>/rooms/trong/…</code> twice</td><td>The first call ran the handler (81 ms); the second returned the cached value in 0 ms and <code>lanGoiHandler</code> stayed 1. Returning <code>of(value)</code> without calling <code>next.handle()</code> skips the handler entirely.</td></tr>
</tbody>
</table>
<p>That cache is a <code>Map</code> in one process: two instances behind a load balancer will have two different caches, and nothing evicts old keys. It shows the mechanism; for real caching use Redis (cross-link below) or <code>@nestjs/cache-manager</code>. And never cache per-user responses under a URL-only key — lesson 2.4's Steam incident is exactly that.</p>

<h3>Interceptor or middleware?</h3>
<table>
<thead><tr><th></th><th>Middleware</th><th>Interceptor</th></tr></thead>
<tbody>
<tr><td>Knows the handler (class, method, metadata)</td><td>No</td><td>Yes (<code>ExecutionContext</code>)</td></tr>
<tr><td>Runs for 404 / guard-rejected requests</td><td>Yes</td><td>No — only when the handler is about to run</td></tr>
<tr><td>Sees the returned value</td><td>No (only raw bytes)</td><td>Yes, can transform it</td></tr>
<tr><td>Works for WebSocket / microservices</td><td>No (HTTP only)</td><td>Yes</td></tr>
</tbody>
</table>
<p>So: access log of every HTTP request ⇒ middleware; "how long did <code>BookingsController.create</code> take" ⇒ interceptor.</p>

<h3>🧪 Exercise (10 min)</h3>
<p>Add a global interceptor that sets the <code>Server-Timing</code> header with the handler's duration, so it shows up in Chrome DevTools' Timing tab.</p>
<details><summary>Show answer</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>tap</code> runs when the handler's value arrives, before Nest serializes and sends the response, so setting a header there still works. Setting it in a <code>finalize</code> or after the response is sent would produce <code>ERR_HTTP_HEADERS_SENT</code> (lesson 3.2).</p>
</details>

<h3>💼 On the job</h3>
<p>The <code>{ data: … }</code> envelope is a common client demand ("every response must have <code>data</code>, <code>meta</code>, <code>errors</code>"). Do it in one interceptor, not by changing every handler — and agree early, because changing the envelope later breaks every mobile app version already installed.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestInterceptor</span><span class="v"><code>intercept(ctx, next)</code> returns an Observable — usually <code>next.handle().pipe(…)</code>.</span></div>
  <div class="kv"><span class="k">CallHandler</span><span class="v"><code>next.handle()</code>: the Observable of the rest of the pipeline (pipes + handler).</span></div>
  <div class="kv"><span class="k">tap / map</span><span class="v">Observe without changing / transform the value.</span></div>
  <div class="kv"><span class="k">catchError / timeout</span><span class="v">Replace an error / fail when no value arrives in time.</span></div>
  <div class="kv"><span class="k">APP_INTERCEPTOR</span><span class="v">Token to register a global interceptor with DI.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Interceptors wrap pipes + handler: code before, then transform the result or error stream.</li>
<li>Five RxJS operators cover nearly every case: <code>tap</code>, <code>map</code>, <code>catchError</code>, <code>timeout</code>, <code>of</code>.</li>
<li>A timeout ends the wait, not the work.</li>
<li>Returning <code>of(x)</code> without <code>next.handle()</code> skips the handler — that is how caching works.</li>
<li>Middleware for every HTTP request; interceptors when you need the handler or its result.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>3.5 — Interceptor: bọc quanh handler, trước và sau</h2>
<p class="lead">Interceptor là lớp duy nhất nhìn thấy cả hai phía của handler: chạy mã phía trước, rồi nhận kết quả (hoặc lỗi) của handler dưới dạng một dòng chảy có thể biến đổi. Vì vậy nó là chỗ cho đo thời gian, bọc phản hồi, timeout, cache và đổi lỗi — mọi việc cần "bọc" quanh lời gọi. Dòng chảy đó là một <code>Observable</code> của RxJS; bạn chỉ cần năm toán tử.</p>

<h3>Liên hệ đời thường: ứng dụng giao đồ ăn</h3>
<p>Ứng dụng nhận đơn của bạn trước khi nhà hàng thấy (phía trước), và nhận món từ nhà hàng trước khi tới tay bạn (phía sau). Trên đường về, nó có thể cho món vào túi có logo (map), ghi lại thời gian nấu (tap), huỷ và hoàn tiền nếu quá lâu (timeout) — hoặc với ly nước vừa giao cho cùng địa chỉ năm phút trước, gửi luôn một ly có sẵn mà không làm phiền bếp (cache).</p>

<h3>RxJS, vừa đủ</h3>
<pre><code class="language-ts">${esc(MA_RX)}</code></pre>
<div class="out">${esc(OUT_RX)}</div>
<ul>
<li><code>Observable</code> là một công thức; chưa có gì chạy cho tới khi có người subscribe (dòng 1–2 in trước handler). Nest tự subscribe sau khi các interceptor của bạn dựng xong <code>pipe</code>.</li>
<li><code>tap</code> nhìn mà không đổi; <code>map</code> đổi giá trị; <code>catchError</code> thay lỗi bằng một giá trị hoặc lỗi khác; <code>timeout</code> biến "quá chậm" thành <code>TimeoutError</code>.</li>
<li>Handler trả giá trị thường hay <code>Promise</code> đều được Nest bọc thành Observable — bạn không bao giờ phải trả Observable từ controller.</li>
</ul>

<h3>Thí nghiệm — bốn interceptor trên một controller phòng</h3>
<pre><code class="language-ts">${esc(MA_ICP)}</code></pre>
<div class="out">${esc(OUT_ICP)}</div>
<table>
<thead><tr><th>Request</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td><code>/rooms/1</code></td><td><code>TimingInterceptor</code> ghi <code>RoomsController.one</code> — tên class và method, thứ middleware không thể biết. <code>BocInterceptor</code> bọc body thành <code>{"data":…}</code>.</td></tr>
<tr><td><code>/rooms/abc</code></td><td>Lỗi của <code>ParseIntPipe</code> bị interceptor đo thời gian nhìn thấy: pipe chạy <em>bên trong</em> <code>next.handle()</code> của interceptor. Body lỗi không bị bọc — <code>map</code> chỉ chạm vào giá trị thành công.</td></tr>
<tr><td><code>/rooms/cham</code></td><td>Sau 200 ms client nhận <strong>408</strong>. Rồi ở cuối output: <em>"handler VẪN chạy xong sau 500 ms"</em>. Timeout dừng việc <strong>chờ</strong>, không dừng việc <strong>làm</strong>. Nếu handler đang ghi cơ sở dữ liệu, lệnh ghi vẫn xảy ra. Muốn huỷ thật, truyền <code>AbortSignal</code> xuống HTTP client hay câu truy vấn.</td></tr>
<tr><td><code>/rooms/trong/…</code> hai lần</td><td>Lần đầu chạy handler (81 ms); lần hai trả giá trị trong cache sau 0 ms và <code>lanGoiHandler</code> vẫn là 1. Trả <code>of(value)</code> mà không gọi <code>next.handle()</code> là bỏ qua hẳn handler.</td></tr>
</tbody>
</table>
<p>Cache đó là một <code>Map</code> trong một tiến trình: hai bản chạy sau bộ cân bằng tải có hai cache khác nhau, và không gì dọn khoá cũ. Nó minh hoạ cơ chế; cache thật dùng Redis (liên kết bên dưới) hoặc <code>@nestjs/cache-manager</code>. Và đừng bao giờ cache phản hồi riêng từng người dùng với khoá chỉ là URL — sự cố Steam ở bài 2.4 chính là như thế.</p>

<h3>Interceptor hay middleware?</h3>
<table>
<thead><tr><th></th><th>Middleware</th><th>Interceptor</th></tr></thead>
<tbody>
<tr><td>Biết handler (class, method, metadata)</td><td>Không</td><td>Có (<code>ExecutionContext</code>)</td></tr>
<tr><td>Chạy với 404 / request bị guard chặn</td><td>Có</td><td>Không — chỉ khi handler sắp chạy</td></tr>
<tr><td>Thấy giá trị trả về</td><td>Không (chỉ thấy byte thô)</td><td>Có, đổi được</td></tr>
<tr><td>Dùng cho WebSocket / microservice</td><td>Không (chỉ HTTP)</td><td>Có</td></tr>
</tbody>
</table>
<p>Vậy: log truy cập của mọi request HTTP ⇒ middleware; "<code>BookingsController.create</code> mất bao lâu" ⇒ interceptor.</p>

<h3>🧪 Thực hành (10 phút)</h3>
<p>Thêm một interceptor toàn cục đặt header <code>Server-Timing</code> bằng thời gian chạy handler, để nó hiện trong tab Timing của Chrome DevTools.</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>tap</code> chạy khi giá trị của handler tới, trước khi Nest tuần tự hoá và gửi phản hồi, nên đặt header ở đó vẫn kịp. Đặt trong <code>finalize</code> hay sau khi phản hồi đã gửi sẽ ra <code>ERR_HTTP_HEADERS_SENT</code> (bài 3.2).</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>Lớp bọc <code>{ data: … }</code> là yêu cầu hay gặp của khách hàng ("mọi phản hồi phải có <code>data</code>, <code>meta</code>, <code>errors</code>"). Làm bằng một interceptor, đừng sửa từng handler — và chốt sớm, vì đổi lớp bọc về sau sẽ làm vỡ mọi phiên bản ứng dụng di động người dùng đã cài.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestInterceptor</span><span class="v"><code>intercept(ctx, next)</code> trả một Observable — thường là <code>next.handle().pipe(…)</code>.</span></div>
  <div class="kv"><span class="k">CallHandler</span><span class="v"><code>next.handle()</code>: Observable của phần còn lại của dây chuyền (pipe + handler).</span></div>
  <div class="kv"><span class="k">tap / map</span><span class="v">Quan sát không đổi / biến đổi giá trị.</span></div>
  <div class="kv"><span class="k">catchError / timeout</span><span class="v">Thay thế lỗi / báo lỗi khi không có giá trị kịp lúc.</span></div>
  <div class="kv"><span class="k">APP_INTERCEPTOR</span><span class="v">Token đăng ký interceptor toàn cục có DI.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Interceptor bọc pipe + handler: mã phía trước, rồi biến đổi dòng kết quả hoặc lỗi.</li>
<li>Năm toán tử RxJS đủ cho hầu hết trường hợp: <code>tap</code>, <code>map</code>, <code>catchError</code>, <code>timeout</code>, <code>of</code>.</li>
<li>Timeout kết thúc việc chờ, không kết thúc việc làm.</li>
<li>Trả <code>of(x)</code> mà không gọi <code>next.handle()</code> là bỏ qua handler — cache hoạt động như thế.</li>
<li>Middleware cho mọi request HTTP; interceptor khi cần biết handler hoặc kết quả của nó.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
