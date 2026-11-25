/**
 * 1.4 — Vòng đời request (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c1/app/src/vongdoi/vongdoi.ts + t14.sh:
 * 4 request + 3 biến thể đáp án (t14v.sh) (/vd/7 · /vd/abc pipe ném 400 · /vd/0 handler ném 404 · header x-chan:1 guard chặn ⇒ 403), mỗi lớp in một dòng.
 * So sánh Spring MVC: Filter → DispatcherServlet → HandlerInterceptor.preHandle → argument resolver/@Valid → controller →
 * postHandle → @ControllerAdvice (đối chiếu docs.spring.io, mức khái niệm — không chạy Spring trong bài này).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-3-middleware', title: 'Node.js 5.3 — Middleware', sub: 'Chuỗi next() của Express — tầng đầu tiên của vòng đời Nest chính là nó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — Xử lý lỗi', sub: 'Middleware lỗi 4 tham số của Express — bản tự làm của exception filter.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Request lifecycle', 'Thứ tự chính thức: middleware → guard → interceptor → pipe → handler → interceptor → filter.', 'https://docs.nestjs.com/faq/request-lifecycle'),
  nguon('📘', 'Spring Framework — Handler interception', 'HandlerInterceptor preHandle/postHandle/afterCompletion — để đối chiếu.', 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html'),
].join('\n');
const MA_VD = "import { /* … */ } from '@nestjs/common';\n\nlet buoc = 0;\nconst ghi = (lop: string, viec: string) => console.log(`${String(++buoc).padStart(2)}. ${lop.padEnd(12)} ${viec}`);\n\n@Injectable()\nclass GhiMiddleware implements NestMiddleware {\n  use(req: Request, _res: Response, next: NextFunction) {\n    buoc = 0; console.log(`── ${req.method} ${req.originalUrl}`);\n    ghi('middleware', 'chưa biết handler nào sẽ chạy');\n    next();\n  }\n}\n\n@Injectable()\nclass GhiGuard implements CanActivate {\n  canActivate(ctx: ExecutionContext) {\n    const cho = ctx.switchToHttp().getRequest<Request>().headers['x-chan'] !== '1';\n    ghi('guard', `biết handler: ${ctx.getClass().name}.${ctx.getHandler().name} → ${cho ? 'cho qua' : 'CHẶN'}`);\n    return cho;\n  }\n}\n\n@Injectable()\nclass GhiInterceptor implements NestInterceptor {\n  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {\n    ghi('interceptor', 'trước handler');\n    const t = performance.now();\n    return next.handle().pipe(tap({\n      next: () => ghi('interceptor', `sau handler (${(performance.now() - t).toFixed(1)}ms)`),\n      error: (e) => ghi('interceptor', `thấy lỗi đi ngang: ${e.constructor.name}`),\n    }));\n  }\n}\n\nclass SoPipe implements PipeTransform {\n  transform(v: string) {\n    const n = Number(v);\n    ghi('pipe', `\"${v}\" → ${Number.isInteger(n) ? n : 'KHÔNG PHẢI SỐ'}`);\n    if (!Number.isInteger(n)) throw new BadRequestException('id phải là số nguyên');\n    return n;\n  }\n}\n\n@Catch(HttpException)\nclass GhiFilter implements ExceptionFilter {\n  catch(e: HttpException, host: ArgumentsHost) {\n    ghi('filter', `bắt ${e.getStatus()} ${e.message}`);\n    host.switchToHttp().getResponse<Response>().status(e.getStatus()).json({ loi: e.message });\n  }\n}\n\n@Controller('vd')\n@UseGuards(GhiGuard)\n@UseInterceptors(GhiInterceptor)\n@UseFilters(GhiFilter)\nclass VongDoiController {\n  @Get(':id')\n  mot(@Param('id', SoPipe) id: number) {\n    ghi('handler', `nhận id=${id} (kiểu ${typeof id})`);\n    if (id === 0) throw new HttpException('không có phòng số 0', 404);\n    return { id };\n  }\n}\n\n@Module({ controllers: [VongDoiController] })\nexport class VongDoiModule implements NestModule {\n  configure(consumer: MiddlewareConsumer) { consumer.apply(GhiMiddleware).forRoutes('vd'); }\n}";
const OUT_VD = "── GET /vd/7\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → cho qua\n 3. interceptor  trước handler\n 4. pipe         \"7\" → 7\n 5. handler      nhận id=7 (kiểu number)\n 6. interceptor  sau handler (0.8ms)\n   client nhận: {\"id\":7}\n── GET /vd/abc\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → cho qua\n 3. interceptor  trước handler\n 4. pipe         \"abc\" → KHÔNG PHẢI SỐ\n 5. interceptor  thấy lỗi đi ngang: BadRequestException\n 6. filter       bắt 400 id phải là số nguyên\n   client nhận: {\"loi\":\"id phải là số nguyên\"}\n── GET /vd/0\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → cho qua\n 3. interceptor  trước handler\n 4. pipe         \"0\" → 0\n 5. handler      nhận id=0 (kiểu number)\n 6. interceptor  thấy lỗi đi ngang: HttpException\n 7. filter       bắt 404 không có phòng số 0\n   client nhận: {\"loi\":\"không có phòng số 0\"}\n(header x-chan: 1)\n── GET /vd/7\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → CHẶN\n 3. filter       bắt 403 Forbidden resource\n   client nhận: {\"loi\":\"Forbidden resource\"}";
const OUT_BIENTHE = "##### 1. guard ném UnauthorizedException\n── GET /vd/7\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → CHẶN\n 3. filter       bắt 401 Unauthorized\n   client nhận: {\"loi\":\"Unauthorized\"}\n##### 2. tap của interceptor ném lỗi (không có header chặn)\n── GET /vd/7\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → cho qua\n 3. interceptor  trước handler\n 4. pipe         \"7\" → 7\n 5. handler      nhận id=7 (kiểu number)\n   client nhận: {\"statusCode\":500,\"message\":\"Internal server error\"}\n##### 3. @Catch(BadRequestException), guard chặn\n── GET /vd/7\n 1. middleware   chưa biết handler nào sẽ chạy\n 2. guard        biết handler: VongDoiController.mot → CHẶN\n   client nhận: {\"message\":\"Forbidden resource\",\"error\":\"Forbidden\",\"statusCode\":403}";

const SO_DO = `request
  │
  ▼
① middleware ......... chạy trước khi Nest biết handler nào (Express next())
  ▼
② guard .............. "request này có được tới handler này không?"   false ⇒ 403
  ▼
③ interceptor (trước)  bọc quanh handler: đo giờ, ghi log, đổi kết quả
  ▼
④ pipe ............... kiểm + chuyển đổi TỪNG đối số (@Param, @Body…)   sai ⇒ 400
  ▼
⑤ handler ............ phương thức controller của bạn
  ▼
⑥ interceptor (sau) .. thấy kết quả (hoặc lỗi) đi ngược ra
  ▼
⑦ exception filter ... bất kỳ lỗi nào ở ②–⑥ ⇒ thành phản hồi HTTP
  ▼
response`;

export default {
  title: '1.4 — The request lifecycle: middleware → guard → interceptor → pipe → handler → filter|||1.4 — Vòng đời request: middleware → guard → interceptor → pipe → handler → filter',
  slug: 'nst-1-4-vong-doi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bản đồ cả chương 3 trong một thí nghiệm: mỗi lớp (middleware, guard, interceptor, pipe, handler, filter) in một dòng log, chạy bốn request thật — bình thường, pipe từ chối, handler ném lỗi, guard chặn. Mỗi lớp trả lời câu hỏi nào, biết gì về handler, lỗi đi đường nào. So với chuỗi middleware Express và Filter/HandlerInterceptor/@ControllerAdvice của Spring.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>1.4 — Seven stops between the socket and your handler</h2>
<p class="lead">In Express everything is "middleware", so authentication, logging, validation and error handling all look the same and their order depends on who wrote <code>app.use</code> first. Nest splits the path into layers with different jobs and a <strong>fixed order</strong>. In this lesson you watch one request pass every layer, then three requests that fail at different places. Chapter 3 then teaches each layer in depth — this is the map.</p>

<h3>The map</h3>
<pre><code>${esc(SO_DO)}</code></pre>
<p>(The diagram labels are in Vietnamese; the English questions per layer are in the table below.)</p>

<h3>The experiment: every layer prints one line</h3>
<pre><code class="language-ts">${esc(MA_VD)}</code></pre>
<div class="out">${esc(OUT_VD)}</div>

<h3>Reading the four runs</h3>
<table>
<thead><tr><th>Request</th><th>What stopped it</th><th>What to learn</th></tr></thead>
<tbody>
<tr><td><code>/vd/7</code></td><td>nothing</td><td>Order 1→6. The pipe turned <code>"7"</code> into the number <code>7</code> <em>before</em> the handler saw it — the handler can trust its argument.</td></tr>
<tr><td><code>/vd/abc</code></td><td>pipe ⇒ 400</td><td>The handler never ran. The interceptor saw the error passing back out (it wraps the pipe too), then the filter turned it into a response.</td></tr>
<tr><td><code>/vd/0</code></td><td>handler ⇒ 404</td><td>Same path out: interceptor sees it, filter answers. You threw an exception; nobody wrote <code>res.status(404)</code>.</td></tr>
<tr><td><code>x-chan: 1</code></td><td>guard ⇒ 403</td><td>Interceptor, pipe and handler never ran. Nest converted <code>false</code> into <code>ForbiddenException</code>, which the filter caught. Cheap rejection: no parsing, no database.</td></tr>
</tbody>
</table>

<h3>One question per layer</h3>
<table>
<thead><tr><th>Layer</th><th>Question it answers</th><th>Knows the handler?</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Middleware</td><td>Something every request needs, regardless of route (request id, CORS, raw logging)</td><td>No — it runs before routing is resolved</td><td>3.1</td></tr>
<tr><td>Guard</td><td>May this request reach <em>this</em> handler? (logged in, role)</td><td>Yes: <code>ctx.getHandler()</code>, <code>ctx.getClass()</code> + metadata</td><td>3.4, 7</td></tr>
<tr><td>Interceptor</td><td>What should happen around the call? (timing, response shape, cache, timeout)</td><td>Yes</td><td>3.5</td></tr>
<tr><td>Pipe</td><td>Is this argument valid, and in which type?</td><td>Per argument</td><td>3.3, 4</td></tr>
<tr><td>Filter</td><td>This exception — which HTTP response?</td><td>Yes (via host)</td><td>3.2</td></tr>
</tbody>
</table>
<p>The column "knows the handler?" is the key difference with Express. Our guard printed <code>VongDoiController.mot</code>: it can read metadata such as <code>@Roles('admin')</code> placed on that exact method (lesson 3.4). Express middleware cannot — it runs before the router has picked a route.</p>

<h3>Compared with Express and Spring</h3>
<table>
<thead><tr><th>Job</th><th>Express</th><th>Nest</th><th>Spring MVC</th></tr></thead>
<tbody>
<tr><td>Every request</td><td><code>app.use(fn)</code></td><td>middleware</td><td>Servlet <code>Filter</code></td></tr>
<tr><td>Allowed to call this handler?</td><td>middleware placed on the route</td><td>guard</td><td><code>HandlerInterceptor.preHandle</code> / Spring Security</td></tr>
<tr><td>Around the call</td><td>(wrap by hand)</td><td>interceptor</td><td><code>preHandle</code> + <code>postHandle</code>, AOP <code>@Around</code></td></tr>
<tr><td>Convert/validate arguments</td><td>by hand in the handler</td><td>pipe</td><td>argument resolver + <code>@Valid</code></td></tr>
<tr><td>Exception ⇒ response</td><td>4-argument error middleware</td><td>exception filter</td><td><code>@ControllerAdvice</code> + <code>@ExceptionHandler</code></td></tr>
</tbody>
</table>
<p>If you know Spring, the mapping is almost one to one — which is not an accident: both frameworks solve the same problem of keeping cross-cutting concerns out of controllers.</p>

<h3>💼 At work</h3>
<p>A code review comment you will receive: "Don't check the role inside the controller." Suppose a teammate wrote <code>if (req.user.role !== 'admin') throw new ForbiddenException()</code> at the top of ten handlers. One handler added next month without that line is an open door. Moving the rule into a guard bound by metadata makes it declarative, visible in one place and testable once. Same for timing: one interceptor instead of <code>console.time</code> in every handler.</p>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<p>Without running anything, predict the numbered lines for each case, then add them to the experiment and check:</p>
<ol>
<li>The guard throws <code>new UnauthorizedException()</code> instead of returning <code>false</code>.</li>
<li>The handler returns normally but the interceptor's <code>tap</code> throws an error.</li>
<li>The filter is declared with <code>@Catch(BadRequestException)</code> only, and the guard blocks.</li>
</ol>
<details><summary>Show answers</summary>
<div class="out">${esc(OUT_BIENTHE)}</div>
<p>1 — middleware, guard, filter <code>bắt 401</code>: like the 403 case but a different status. 2 — 1–5 as normal, then <strong>no</strong> filter line and a 500: the error is still caught (interceptors are inside the exception layer), but a plain <code>Error</code> is not an <code>HttpException</code>, so our filter skips it and Nest's built-in filter answers <code>{"statusCode":500,"message":"Internal server error"}</code> — hiding the message from the client, which is what you want for unexpected errors. 3 — middleware, guard, then <strong>no</strong> filter line: our filter does not match <code>ForbiddenException</code>, so Nest's built-in global filter answers with <code>{"message":"Forbidden resource","error":"Forbidden","statusCode":403}</code>. A filter only catches what its <code>@Catch</code> lists.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">request lifecycle</span><span class="v">The fixed sequence of layers a request crosses in Nest.</span></div>
  <div class="kv"><span class="k">ExecutionContext</span><span class="v">Object given to guards/interceptors: the request plus which class and handler will run.</span></div>
  <div class="kv"><span class="k">cross-cutting concern</span><span class="v">A rule that applies to many handlers (auth, logging, errors) and should not be copy-pasted into each.</span></div>
  <div class="kv"><span class="k">binding</span><span class="v">Attaching a layer globally, to a controller, or to one route (<code>@UseGuards</code>, …); lesson 3.6.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Order in: middleware → guard → interceptor → pipe → handler; out: interceptor → filter.</li>
<li>Middleware does not know the handler; guards and interceptors do, so they can read route metadata.</li>
<li>Guard rejects ⇒ nothing after it runs (403). Pipe rejects ⇒ handler does not run (400).</li>
<li>Any exception from guard to interceptor ends in an exception filter; a filter catches only what <code>@Catch</code> lists.</li>
<li>Nest ≈ Spring: Filter, HandlerInterceptor, argument resolver/@Valid, @ControllerAdvice.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>1.4 — Bảy trạm giữa socket và handler của bạn</h2>
<p class="lead">Trong Express mọi thứ đều là "middleware", nên xác thực, ghi log, kiểm dữ liệu và xử lý lỗi trông giống hệt nhau, còn thứ tự thì tuỳ ai viết <code>app.use</code> trước. Nest chia đường đi thành các lớp có việc riêng và <strong>thứ tự cố định</strong>. Bài này cho bạn xem một request đi qua mọi lớp, rồi ba request hỏng ở ba chỗ khác nhau. Chương 3 sẽ dạy sâu từng lớp — đây là tấm bản đồ.</p>

<h3>Bản đồ</h3>
<pre><code>${esc(SO_DO)}</code></pre>

<h3>Thí nghiệm: mỗi lớp in một dòng</h3>
<pre><code class="language-ts">${esc(MA_VD)}</code></pre>
<div class="out">${esc(OUT_VD)}</div>

<h3>Đọc bốn lần chạy</h3>
<table>
<thead><tr><th>Request</th><th>Bị dừng ở đâu</th><th>Rút ra điều gì</th></tr></thead>
<tbody>
<tr><td><code>/vd/7</code></td><td>không đâu cả</td><td>Thứ tự 1→6. Pipe đã đổi <code>"7"</code> thành số <code>7</code> <em>trước khi</em> handler thấy — handler tin được đối số của mình.</td></tr>
<tr><td><code>/vd/abc</code></td><td>pipe ⇒ 400</td><td>Handler không hề chạy. Interceptor thấy lỗi đi ngược ra (nó bọc cả pipe), rồi filter biến lỗi thành phản hồi.</td></tr>
<tr><td><code>/vd/0</code></td><td>handler ⇒ 404</td><td>Cùng đường ra: interceptor thấy, filter trả lời. Bạn chỉ ném ngoại lệ; không ai viết <code>res.status(404)</code>.</td></tr>
<tr><td><code>x-chan: 1</code></td><td>guard ⇒ 403</td><td>Interceptor, pipe và handler không chạy. Nest đổi <code>false</code> thành <code>ForbiddenException</code>, filter bắt nó. Từ chối rẻ: không parse, không đụng cơ sở dữ liệu.</td></tr>
</tbody>
</table>

<h3>Mỗi lớp một câu hỏi</h3>
<table>
<thead><tr><th>Lớp</th><th>Câu hỏi nó trả lời</th><th>Biết handler không?</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Middleware</td><td>Việc mọi request đều cần, bất kể route (request id, CORS, log thô)</td><td>Không — nó chạy trước khi chọn route</td><td>3.1</td></tr>
<tr><td>Guard</td><td>Request này có được tới <em>handler này</em> không? (đã đăng nhập, vai trò)</td><td>Có: <code>ctx.getHandler()</code>, <code>ctx.getClass()</code> + metadata</td><td>3.4, 7</td></tr>
<tr><td>Interceptor</td><td>Quanh lời gọi cần làm gì? (đo giờ, dạng phản hồi, cache, timeout)</td><td>Có</td><td>3.5</td></tr>
<tr><td>Pipe</td><td>Đối số này có hợp lệ không, và mang kiểu gì?</td><td>Theo từng đối số</td><td>3.3, 4</td></tr>
<tr><td>Filter</td><td>Ngoại lệ này — thành phản hồi HTTP nào?</td><td>Có (qua host)</td><td>3.2</td></tr>
</tbody>
</table>
<p>Cột "biết handler không?" là khác biệt mấu chốt so với Express. Guard của ta in ra <code>VongDoiController.mot</code>: nó đọc được metadata như <code>@Roles('admin')</code> đặt trên đúng phương thức đó (bài 3.4). Middleware Express thì không — nó chạy trước khi router chọn route.</p>

<h3>So với Express và Spring</h3>
<table>
<thead><tr><th>Việc</th><th>Express</th><th>Nest</th><th>Spring MVC</th></tr></thead>
<tbody>
<tr><td>Mọi request</td><td><code>app.use(fn)</code></td><td>middleware</td><td>Servlet <code>Filter</code></td></tr>
<tr><td>Có được gọi handler này?</td><td>middleware đặt trên route</td><td>guard</td><td><code>HandlerInterceptor.preHandle</code> / Spring Security</td></tr>
<tr><td>Bọc quanh lời gọi</td><td>(tự bọc bằng tay)</td><td>interceptor</td><td><code>preHandle</code> + <code>postHandle</code>, AOP <code>@Around</code></td></tr>
<tr><td>Chuyển đổi/kiểm đối số</td><td>tự làm trong handler</td><td>pipe</td><td>argument resolver + <code>@Valid</code></td></tr>
<tr><td>Ngoại lệ ⇒ phản hồi</td><td>middleware lỗi 4 tham số</td><td>exception filter</td><td><code>@ControllerAdvice</code> + <code>@ExceptionHandler</code></td></tr>
</tbody>
</table>
<p>Nếu đã biết Spring, phép ánh xạ gần như một đổi một — không phải tình cờ: cả hai framework cùng giải một bài toán, giữ các mối quan tâm cắt ngang ra khỏi controller.</p>

<h3>💼 Tình huống đi làm</h3>
<p>Một nhận xét review mã bạn sẽ nhận: "Đừng kiểm vai trò trong controller." Giả sử bạn cùng nhóm viết <code>if (req.user.role !== 'admin') throw new ForbiddenException()</code> ở đầu mười handler. Tháng sau thêm handler thứ mười một mà quên dòng đó là mở toang cửa. Chuyển quy tắc vào một guard gắn bằng metadata làm nó thành khai báo, nhìn thấy ở một chỗ, test một lần. Đo giờ cũng vậy: một interceptor thay vì <code>console.time</code> trong mọi handler.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Không chạy gì, đoán các dòng đánh số cho từng trường hợp, rồi thêm vào thí nghiệm và kiểm:</p>
<ol>
<li>Guard ném <code>new UnauthorizedException()</code> thay vì trả <code>false</code>.</li>
<li>Handler trả về bình thường nhưng <code>tap</code> của interceptor ném lỗi.</li>
<li>Filter chỉ khai <code>@Catch(BadRequestException)</code>, và guard chặn.</li>
</ol>
<details><summary>Xem đáp án</summary>
<div class="out">${esc(OUT_BIENTHE)}</div>
<p>1 — middleware, guard, filter <code>bắt 401</code>: như ca 403 nhưng khác mã. 2 — 1–5 như thường, rồi <strong>không có</strong> dòng filter và nhận 500: lỗi vẫn được bắt (interceptor nằm bên trong tầng ngoại lệ), nhưng <code>Error</code> thường không phải <code>HttpException</code>, nên filter của ta bỏ qua và filter dựng sẵn của Nest trả <code>{"statusCode":500,"message":"Internal server error"}</code> — giấu nội dung lỗi khỏi client, đúng điều bạn muốn với lỗi bất ngờ. 3 — middleware, guard, rồi <strong>không có</strong> dòng filter: filter của ta không khớp <code>ForbiddenException</code>, nên filter toàn cục dựng sẵn của Nest trả lời <code>{"message":"Forbidden resource","error":"Forbidden","statusCode":403}</code>. Filter chỉ bắt đúng thứ <code>@Catch</code> liệt kê.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">vòng đời request</span><span class="v">Chuỗi lớp cố định mà một request đi qua trong Nest.</span></div>
  <div class="kv"><span class="k">ExecutionContext</span><span class="v">Đối tượng đưa cho guard/interceptor: request kèm class và handler sắp chạy.</span></div>
  <div class="kv"><span class="k">mối quan tâm cắt ngang</span><span class="v">Quy tắc áp cho nhiều handler (xác thực, log, lỗi), không nên chép vào từng cái.</span></div>
  <div class="kv"><span class="k">gắn (binding)</span><span class="v">Gắn một lớp ở mức toàn cục, controller hoặc một route (<code>@UseGuards</code>, …); bài 3.6.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chiều vào: middleware → guard → interceptor → pipe → handler; chiều ra: interceptor → filter.</li>
<li>Middleware không biết handler; guard và interceptor biết, nên đọc được metadata của route.</li>
<li>Guard từ chối ⇒ không gì phía sau chạy (403). Pipe từ chối ⇒ handler không chạy (400).</li>
<li>Mọi ngoại lệ từ guard tới interceptor kết thúc ở exception filter; filter chỉ bắt thứ <code>@Catch</code> liệt kê.</li>
<li>Nest ≈ Spring: Filter, HandlerInterceptor, argument resolver/@Valid, @ControllerAdvice.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
