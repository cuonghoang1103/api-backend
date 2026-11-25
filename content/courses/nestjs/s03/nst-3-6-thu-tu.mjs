/**
 * 3.6 — Phạm vi gắn và thứ tự chạy (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c3/app/src/b36:
 * thutu.ts (middleware app.use + module; guard/interceptor/pipe/filter ở 3 mức toàn cục [APP_*], controller, route + pipe tham số;
 * request thành công 19 bước, request lỗi 418 thêm "thấy lỗi" + filter route bắt; BT=1: filter route chỉ @Catch(NotFoundException) ⇒ filter controller bắt),
 * di.ts (CACH=app-guard | new [useGlobalGuards(new X()) không DI ⇒ TypeError ⇒ 500] | get [app.get(Reflector)]; createParamDecorator + applyDecorators).
 * Ghi chú: pipe của hai tham số xen kẽ vì Nest phân giải các tham số song song (Promise.all) — mỗi tham số vẫn đúng thứ tự toàn cục → controller → route → tham số.
 */
import { nguon } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = '';

const NGUON = [
  nguon('📘', 'NestJS Docs — Request lifecycle (FAQ)', 'Thứ tự chính thức: middleware → guard → interceptor → pipe → handler → interceptor → filter.', 'https://docs.nestjs.com/faq/request-lifecycle'),
  nguon('📘', 'NestJS Docs — Custom decorators', 'createParamDecorator, applyDecorators, decorator cho pipe.', 'https://docs.nestjs.com/custom-decorators'),
].join('\n');

const BANG = `Lớp          Gắn toàn cục (nên dùng)              Gắn ở controller/route
middleware   consumer.apply().forRoutes('{*path}') app.use(fn)  — chỉ HTTP
guard        { provide: APP_GUARD, useClass }        @UseGuards(X)
interceptor  { provide: APP_INTERCEPTOR, useClass }  @UseInterceptors(X)
pipe         { provide: APP_PIPE, useClass }         @UsePipes(X) · @Param('id', X)
filter       { provide: APP_FILTER, useClass }       @UseFilters(X)`;
const BANG_EN = `Layer        Global (preferred)                     Controller / route
middleware   consumer.apply().forRoutes('{*path}') app.use(fn)  — HTTP only
guard        { provide: APP_GUARD, useClass }        @UseGuards(X)
interceptor  { provide: APP_INTERCEPTOR, useClass }  @UseInterceptors(X)
pipe         { provide: APP_PIPE, useClass }         @UsePipes(X) · @Param('id', X)
filter       { provide: APP_FILTER, useClass }       @UseFilters(X)`;
const MA_TT = "import 'reflect-metadata';\nimport {\n  ArgumentsHost, CallHandler, CanActivate, Catch, Controller, ExceptionFilter, ExecutionContext, Get, HttpException, NotFoundException, Injectable,\n  MiddlewareConsumer, Module, NestInterceptor, NestModule, Param, PipeTransform, Query, UseFilters, UseGuards, UseInterceptors, UsePipes,\n} from '@nestjs/common';\nimport { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE, NestFactory } from '@nestjs/core';\nimport { tap } from 'rxjs';\nimport type { NextFunction, Request, Response } from 'express';\n\nconst vet: string[] = [];\nconst ghi = (s: string) => vet.push(s);\nconst G = (ten: string) => { @Injectable() class X implements CanActivate { canActivate() { ghi(`guard ${ten}`); return true; } } return X; };\nconst I = (ten: string) => {\n  @Injectable() class X implements NestInterceptor {\n    intercept(_c: ExecutionContext, n: CallHandler) { ghi(`interceptor ${ten} ▶ trước`); return n.handle().pipe(tap({ next: () => ghi(`interceptor ${ten} ◀ sau`), error: () => ghi(`interceptor ${ten} ◀ thấy lỗi`) })); }\n  } return X;\n};\nconst P = (ten: string) => { @Injectable() class X implements PipeTransform { transform(v: unknown, m: any) { ghi(`pipe ${ten} (${m.type}:${m.data})`); return v; } } return X; };\nconst F = (ten: string, bat: boolean) => {\n  @Catch(...(ten === 'route' && process.env.BT ? [NotFoundException] : [HttpException])) class X implements ExceptionFilter {\n    catch(e: HttpException, h: ArgumentsHost) {\n      ghi(`filter ${ten} BẮT`);\n      h.switchToHttp().getResponse<Response>().status(e.getStatus()).json({ batBoi: ten });\n    }\n  } return X;\n};\n\n@Controller('rooms')\n@UseGuards(G('controller')) @UseInterceptors(I('controller')) @UsePipes(P('controller')) @UseFilters(F('controller', true))\nclass RoomsController {\n  @Get(':id')\n  @UseGuards(G('route')) @UseInterceptors(I('route')) @UsePipes(P('route')) @UseFilters(F('route', true))\n  one(@Param('id', P('tham số id')) id: string, @Query('loi') loi?: string) {\n    ghi('HANDLER');\n    if (loi) throw new HttpException('lỗi thử', 418);\n    return { id };\n  }\n}\n@Module({\n  controllers: [RoomsController],\n  providers: [\n    { provide: APP_GUARD, useClass: G('toàn cục') }, { provide: APP_INTERCEPTOR, useClass: I('toàn cục') },\n    { provide: APP_PIPE, useClass: P('toàn cục') }, { provide: APP_FILTER, useClass: F('toàn cục', true) },\n  ],\n})\nclass AppModule implements NestModule {\n  configure(c: MiddlewareConsumer) { c.apply((_q: Request, _s: Response, n: NextFunction) => { ghi('middleware module'); n(); }).forRoutes('*path'); }\n}\nconst app = await NestFactory.create(AppModule, { logger: false });\napp.use((_q: Request, _s: Response, n: NextFunction) => { ghi('middleware app.use'); n(); });\nawait app.listen(3000);\nfor (const u of process.env.BT ? ['/rooms/7?loi=1'] : ['/rooms/7', '/rooms/7?loi=1']) {\n  vet.length = 0;\n  const r = await fetch('http://127.0.0.1:3000' + u);\n  console.log(`## GET ${u} → ${r.status} ${await r.text()}`);\n  vet.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s}`));\n}\nawait app.close();";
const OUT_TT = "## GET /rooms/7 → 200 {\"id\":\"7\"}\n   1. middleware app.use\n   2. middleware module\n   3. guard toàn cục\n   4. guard controller\n   5. guard route\n   6. interceptor toàn cục ▶ trước\n   7. interceptor controller ▶ trước\n   8. interceptor route ▶ trước\n   9. pipe toàn cục (query:loi)\n  10. pipe toàn cục (param:id)\n  11. pipe controller (query:loi)\n  12. pipe controller (param:id)\n  13. pipe route (query:loi)\n  14. pipe route (param:id)\n  15. pipe tham số id (param:id)\n  16. HANDLER\n  17. interceptor route ◀ sau\n  18. interceptor controller ◀ sau\n  19. interceptor toàn cục ◀ sau\n## GET /rooms/7?loi=1 → 418 {\"batBoi\":\"route\"}\n   1. middleware app.use\n   2. middleware module\n   3. guard toàn cục\n   4. guard controller\n   5. guard route\n   6. interceptor toàn cục ▶ trước\n   7. interceptor controller ▶ trước\n   8. interceptor route ▶ trước\n   9. pipe toàn cục (query:loi)\n  10. pipe toàn cục (param:id)\n  11. pipe controller (query:loi)\n  12. pipe controller (param:id)\n  13. pipe route (query:loi)\n  14. pipe route (param:id)\n  15. pipe tham số id (param:id)\n  16. HANDLER\n  17. interceptor route ◀ thấy lỗi\n  18. interceptor controller ◀ thấy lỗi\n  19. interceptor toàn cục ◀ thấy lỗi\n  20. filter route BẮT";
const MA_DI = "import 'reflect-metadata';\nimport { applyDecorators, CanActivate, Controller, createParamDecorator, ExecutionContext, Get, Injectable, Module, SetMetadata, UseGuards } from '@nestjs/common';\nimport { APP_GUARD, NestFactory, Reflector } from '@nestjs/core';\nimport { ApiKeyGuard, Roles, RolesGuard } from '../b34/guard-lib.js';\n\n// decorator tham số: lấy người dùng do guard gắn vào request\nexport const NguoiDung = createParamDecorator((truong: string | undefined, ctx: ExecutionContext) => {\n  const u = ctx.switchToHttp().getRequest().user;\n  return truong ? u?.[truong] : u;\n});\n// gộp nhiều decorator thành một — đọc như tài liệu\nexport const ChiDanh = (...vaiTro: string[]) => applyDecorators(Roles(vaiTro), SetMetadata('ghiNhatKy', true));\n\n@Controller('me')\nclass MeController {\n  @Get() @ChiDanh('sv', 'gv') me(@NguoiDung('ten') ten: string, @NguoiDung() u: object) { return { ten, u }; }\n}\nconst CACH = process.env.CACH ?? 'app-guard';\n@Module({ controllers: [MeController], providers: CACH === 'app-guard' ? [{ provide: APP_GUARD, useClass: ApiKeyGuard }, { provide: APP_GUARD, useClass: RolesGuard }] : [] })\nclass AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: ['error'] });\nif (CACH === 'new') app.useGlobalGuards(new ApiKeyGuard(undefined as any), new RolesGuard(undefined as any)); // tự new: không có DI\nif (CACH === 'get') app.useGlobalGuards(new ApiKeyGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));\nawait app.listen(3000);\nconst r = await fetch('http://127.0.0.1:3000/me', { headers: { 'x-api-key': 'k-sv-0001' } });\nconsole.log(`CACH=${CACH}: GET /me → ${r.status} ${await r.text()}`);\nawait app.close();";
const OUT_DI = "CACH=app-guard: GET /me → 200 {\"ten\":\"an\",\"u\":{\"ten\":\"an\",\"vaiTro\":[\"sv\"]}}\n[Nest] ERROR [ExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'getAllAndOverride')\nCACH=new: GET /me → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nCACH=get: GET /me → 200 {\"ten\":\"an\",\"u\":{\"ten\":\"an\",\"vaiTro\":[\"sv\"]}}";
const OUT_BT = "  18. interceptor controller ◀ thấy lỗi\n  19. interceptor toàn cục ◀ thấy lỗi\n  20. filter controller BẮT";

export default {
  title: '3.6 — Binding scope and execution order: global, controller, route — a full experiment|||3.6 — Phạm vi gắn và thứ tự chạy: toàn cục, controller, route — thí nghiệm đầy đủ',
  slug: 'nst-3-6-thu-tu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một thí nghiệm gắn mọi lớp ở cả ba mức (toàn cục, controller, route) và in thứ tự chạy thật: 19 bước cho request thành công, 20 cho request lỗi. Rút ra luật: guard/interceptor/pipe đi từ rộng tới hẹp, phần "sau" của interceptor đi ngược lại như củ hành, filter cụ thể nhất bắt và chỉ một filter. APP_GUARD so với useGlobalGuards(new X()): bản tự new không có DI ⇒ 500. createParamDecorator và applyDecorators. Bảng tra nhanh cuối bài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>3.6 — Everything at once: who runs first?</h2>
<p class="lead">Each of the last five lessons looked at one layer. Real applications have several of each, at different levels: a global guard plus a controller guard, a global interceptor plus a route one. Instead of memorizing a diagram, this lesson attaches a logging version of every layer at every level and prints the order Nest actually uses.</p>

<h3>Everyday analogy: airport</h3>
<p>Check-in desk for everyone (global), then the airline's own gate (controller), then the seat check on the plane (route). On the way back, you clear the plane first, then the gate, then the terminal — the reverse order. And if something goes wrong, the nearest staff member deals with it, not all of them at once.</p>

<h3>Experiment</h3>
<pre><code class="language-ts">${esc(MA_TT)}</code></pre>
<div class="out">${esc(OUT_TT)}</div>

<h3>The rules, read off the output</h3>
<ol>
<li><strong>Middleware</strong> first: <code>app.use()</code> middleware before module middleware.</li>
<li><strong>Guards</strong>: global → controller → route. The first one that says no stops everything after it.</li>
<li><strong>Interceptors, before part</strong>: global → controller → route.</li>
<li><strong>Pipes</strong>: for each parameter, global → controller → route → parameter. The two parameters' pipes appear interleaved because Nest resolves parameters concurrently; within each parameter the order is fixed.</li>
<li><strong>Handler</strong>.</li>
<li><strong>Interceptors, after part</strong>: route → controller → global — reversed, like layers of an onion. On error they see the error in the same reversed order (<code>thấy lỗi</code>).</li>
<li><strong>Filter</strong>: only <em>one</em> runs — the most specific one that matches. Here the route filter caught the 418; the controller and global filters never ran.</li>
</ol>
<p>Consequences you will use: a global guard can reject before any controller guard runs; the global interceptor measures the widest span (including the route interceptors); a route-level filter can special-case one endpoint's errors without touching the global format.</p>

<h3><code>APP_GUARD</code> vs <code>app.useGlobalGuards(new …)</code></h3>
<pre><code class="language-ts">${esc(MA_DI)}</code></pre>
<div class="out">${esc(OUT_DI)}</div>
<p><code>useGlobalGuards(new RolesGuard())</code> is created by you, outside the module, so Nest cannot inject <code>Reflector</code> — the first request crashed with a 500. You can pass dependencies by hand (<code>app.get(Reflector)</code>), but then the guard is invisible to <code>Test.createTestingModule</code>: tests that build the module without <code>main.ts</code> run <em>without</em> your guard, and <code>overrideProvider</code> cannot replace it. Registering through <code>APP_GUARD</code> / <code>APP_INTERCEPTOR</code> / <code>APP_PIPE</code> / <code>APP_FILTER</code> keeps everything inside DI. Use those.</p>

<h3>Two decorator helpers</h3>
<ul>
<li><code>createParamDecorator</code>: <code>@NguoiDung('ten')</code> reads <code>request.user</code> that the guard attached. Handlers stop touching the raw request, and the same decorator can later read from a JWT payload or a WebSocket client.</li>
<li><code>applyDecorators</code>: <code>@ChiDanh('sv', 'gv')</code> bundles <code>@Roles</code> + extra metadata (it could also add <code>@UseGuards</code> and Swagger decorators in Chapter 4). One readable line per route instead of four.</li>
</ul>

<h3>Quick reference</h3>
<pre><code>${esc(BANG_EN)}</code></pre>

<h3>🧪 Exercise (10 min) — predict, then run</h3>
<p>Change the route-level filter to <code>@Catch(NotFoundException)</code> only, keep everything else. The handler throws <code>HttpException(…, 418)</code>. Which filter answers, and does any other filter run?</p>
<details><summary>Show answer</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>The route filter does not match a 418, so Nest moves outward: the controller filter matches <code>HttpException</code> and handles it. The global filter still does not run — one error, one filter.</p>
</details>

<h3>💼 On the job</h3>
<p>Bugs from layer order are hard to see in code review because the layers live in different files: "the audit log misses rejected logins" (guard rejected before the logging interceptor ran), "response time metric excludes validation" (metric interceptor registered at route level, validation pipe global). When you get such a ticket, write down the 7 steps above for that route before touching code.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">APP_GUARD / _INTERCEPTOR / _PIPE / _FILTER</span><span class="v">Tokens to register global layers as providers, with DI and testability.</span></div>
  <div class="kv"><span class="k">useGlobal*</span><span class="v">Register instances created by hand in <code>main.ts</code>; no DI, invisible to testing modules.</span></div>
  <div class="kv"><span class="k">createParamDecorator</span><span class="v">Build a parameter decorator from <code>ExecutionContext</code>.</span></div>
  <div class="kv"><span class="k">applyDecorators</span><span class="v">Combine several decorators into one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Middleware → guards → interceptors (before) → pipes → handler → interceptors (after, reversed) → one filter.</li>
<li>Within a layer: global → controller → route (→ parameter for pipes).</li>
<li>The most specific matching filter wins, and only one runs.</li>
<li>Prefer <code>APP_*</code> providers over <code>useGlobal*(new …)</code>.</li>
<li>Custom param decorators and <code>applyDecorators</code> keep handlers short and intention-revealing.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>3.6 — Tất cả cùng lúc: ai chạy trước?</h2>
<p class="lead">Năm bài trước mỗi bài xem một lớp. Ứng dụng thật có nhiều cái mỗi loại, ở nhiều mức: guard toàn cục cộng guard controller, interceptor toàn cục cộng interceptor route. Thay vì học thuộc sơ đồ, bài này gắn một bản ghi vết của mọi lớp ở mọi mức và in ra thứ tự Nest thật sự dùng.</p>

<h3>Liên hệ đời thường: sân bay</h3>
<p>Quầy làm thủ tục cho mọi người (toàn cục), rồi cửa ra máy bay của hãng (controller), rồi kiểm chỗ ngồi trên máy bay (route). Lúc về thì ra khỏi máy bay trước, rồi qua cửa, rồi mới ra nhà ga — thứ tự ngược lại. Và nếu có sự cố, nhân viên gần nhất xử lý, chứ không phải tất cả cùng nhảy vào.</p>

<h3>Thí nghiệm</h3>
<pre><code class="language-ts">${esc(MA_TT)}</code></pre>
<div class="out">${esc(OUT_TT)}</div>

<h3>Luật, đọc thẳng từ output</h3>
<ol>
<li><strong>Middleware</strong> đầu tiên: middleware <code>app.use()</code> trước middleware của module.</li>
<li><strong>Guard</strong>: toàn cục → controller → route. Cái đầu tiên nói không là chặn mọi thứ phía sau.</li>
<li><strong>Interceptor, phần trước</strong>: toàn cục → controller → route.</li>
<li><strong>Pipe</strong>: với mỗi tham số, toàn cục → controller → route → tham số. Pipe của hai tham số in xen kẽ vì Nest phân giải các tham số song song; trong từng tham số, thứ tự là cố định.</li>
<li><strong>Handler</strong>.</li>
<li><strong>Interceptor, phần sau</strong>: route → controller → toàn cục — ngược lại, như các lớp vỏ củ hành. Khi lỗi, chúng thấy lỗi theo đúng thứ tự ngược đó (<code>thấy lỗi</code>).</li>
<li><strong>Filter</strong>: chỉ <em>một</em> cái chạy — cái cụ thể nhất khớp được. Ở đây filter route bắt lỗi 418; filter controller và toàn cục không chạy.</li>
</ol>
<p>Hệ quả sẽ dùng tới: guard toàn cục chặn được trước khi guard controller nào chạy; interceptor toàn cục đo khoảng rộng nhất (gồm cả interceptor của route); filter ở mức route xử lý riêng lỗi của một endpoint mà không đụng tới dạng lỗi toàn cục.</p>

<h3><code>APP_GUARD</code> so với <code>app.useGlobalGuards(new …)</code></h3>
<pre><code class="language-ts">${esc(MA_DI)}</code></pre>
<div class="out">${esc(OUT_DI)}</div>
<p><code>useGlobalGuards(new RolesGuard())</code> do bạn tự tạo, bên ngoài module, nên Nest không tiêm được <code>Reflector</code> — request đầu tiên sập 500. Có thể tự truyền phụ thuộc (<code>app.get(Reflector)</code>), nhưng khi đó guard vô hình với <code>Test.createTestingModule</code>: test dựng module mà không qua <code>main.ts</code> sẽ chạy <em>không có</em> guard của bạn, và <code>overrideProvider</code> không thay được nó. Đăng ký qua <code>APP_GUARD</code> / <code>APP_INTERCEPTOR</code> / <code>APP_PIPE</code> / <code>APP_FILTER</code> giữ mọi thứ trong DI. Hãy dùng cách này.</p>

<h3>Hai công cụ cho decorator</h3>
<ul>
<li><code>createParamDecorator</code>: <code>@NguoiDung('ten')</code> đọc <code>request.user</code> mà guard đã gắn. Handler thôi đụng vào request thô, và cùng decorator đó về sau có thể đọc từ payload JWT hay từ client WebSocket.</li>
<li><code>applyDecorators</code>: <code>@ChiDanh('sv', 'gv')</code> gói <code>@Roles</code> + metadata thêm (ở Chương 4 có thể gói cả <code>@UseGuards</code> và decorator Swagger). Mỗi route một dòng dễ đọc thay vì bốn.</li>
</ul>

<h3>Bảng tra nhanh</h3>
<pre><code>${esc(BANG)}</code></pre>

<h3>🧪 Thực hành (10 phút) — đoán trước, rồi chạy</h3>
<p>Đổi filter ở mức route thành chỉ <code>@Catch(NotFoundException)</code>, giữ nguyên mọi thứ khác. Handler ném <code>HttpException(…, 418)</code>. Filter nào trả lời, và có filter nào khác chạy không?</p>
<details><summary>Xem đáp án</summary>
<div class="out">${esc(OUT_BT)}</div>
<p>Filter route không khớp lỗi 418, nên Nest đi ra ngoài một lớp: filter controller khớp <code>HttpException</code> và xử lý. Filter toàn cục vẫn không chạy — một lỗi, một filter.</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>Lỗi do thứ tự lớp khó thấy khi review vì các lớp nằm ở những tệp khác nhau: "nhật ký kiểm toán thiếu các lần đăng nhập bị từ chối" (guard chặn trước khi interceptor ghi log kịp chạy), "số đo thời gian phản hồi không tính bước kiểm dữ liệu" (interceptor đo gắn ở route, pipe kiểm gắn toàn cục). Gặp phiếu việc kiểu này, hãy viết ra 7 bước ở trên cho đúng route đó trước khi sửa mã.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">APP_GUARD / _INTERCEPTOR / _PIPE / _FILTER</span><span class="v">Token đăng ký lớp toàn cục như provider, có DI và test được.</span></div>
  <div class="kv"><span class="k">useGlobal*</span><span class="v">Đăng ký đối tượng tự tạo trong <code>main.ts</code>; không DI, module test không thấy.</span></div>
  <div class="kv"><span class="k">createParamDecorator</span><span class="v">Dựng decorator tham số từ <code>ExecutionContext</code>.</span></div>
  <div class="kv"><span class="k">applyDecorators</span><span class="v">Gộp nhiều decorator thành một.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Middleware → guard → interceptor (trước) → pipe → handler → interceptor (sau, ngược lại) → một filter.</li>
<li>Trong một lớp: toàn cục → controller → route (→ tham số, với pipe).</li>
<li>Filter khớp cụ thể nhất thắng, và chỉ một filter chạy.</li>
<li>Ưu tiên provider <code>APP_*</code> hơn <code>useGlobal*(new …)</code>.</li>
<li>Decorator tham số tự viết và <code>applyDecorators</code> giữ handler ngắn, đọc là hiểu ý.</li>
</ul>
${NGUON}
</div>
`,
};
