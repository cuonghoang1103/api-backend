/**
 * 3.4 — Guard (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c3/app/src/b34/guard.ts:
 * APP_GUARD toàn cục (ApiKeyGuard + RolesGuard, Reflector.createDecorator Public/Roles, getAllAndOverride) vs CHE_DO=controller
 * (chỉ RoomsController có @UseGuards ⇒ ReportsController mới viết lộ dữ liệu, 200). Lỗi THẬT phát hiện khi soạn: @Public ở method
 * nhưng @Roles ở class ⇒ RolesGuard vẫn trả false ⇒ 403; SUA=1 sửa.
 * Sự cố thật: Optus 2022 — ACMA kiện ra Toà án Liên bang Úc (06/2024): lỗi mã năm 2018 làm kiểm soát truy cập của một API bị vượt qua (itnews 20/06/2024).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-9-2-rbac', title: 'Authentication 9.2 — RBAC', sub: 'Mô hình vai trò, và khi nào cái boolean thành bốn mươi cái — nền cho Chương 7.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'API Design 6.2 — Phân quyền theo đối tượng', sub: 'Guard kiểm vai trò; kiểm "bản ghi này có phải của bạn" là việc khác.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Guards', 'CanActivate, ExecutionContext, gắn guard, Reflector.createDecorator.', 'https://docs.nestjs.com/guards'),
  nguon('📘', 'NestJS Docs — Execution context', 'getHandler, getClass, getType; getAllAndOverride và getAllAndMerge.', 'https://docs.nestjs.com/fundamentals/execution-context'),
  nguon('📰', 'iTnews (20/06/2024) — Optus breach allegedly enabled by access control coding error', 'Hồ sơ ACMA: lỗi mã 2018 làm vô hiệu kiểm soát truy cập của một API ít dùng.', 'https://www.itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985'),
  nguon('🛡️', 'OWASP API Security Top 10 2023 — API5 Broken Function Level Authorization', 'Thiếu kiểm quyền ở mức chức năng/route.', 'https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/'),
].join('\n');
const MA_GUARD = "import 'reflect-metadata';\nimport { CanActivate, Controller, ExecutionContext, Get, Injectable, Module, Param, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common';\nimport { APP_GUARD, NestFactory, Reflector } from '@nestjs/core';\nimport { timingSafeEqual } from 'node:crypto';\nimport type { Request } from 'express';\n\n// decorator metadata có kiểu, không cần chuỗi khoá tự đặt (Nest 10+)\nexport const Public = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const Roles = Reflector.createDecorator<string[]>();\n\nconst KHOA: Record<string, { ten: string; vaiTro: string[] }> = {\n  'k-sv-0001': { ten: 'an', vaiTro: ['sv'] },\n  'k-gv-0002': { ten: 'binh', vaiTro: ['gv'] },\n};\nconst bang = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));\n\n@Injectable()\nexport class ApiKeyGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext): boolean {\n    // đọc metadata ở METHOD trước, rồi CLASS — thứ middleware không làm được\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const req = ctx.switchToHttp().getRequest<Request>();\n    const key = req.header('x-api-key') ?? '';\n    const ai = Object.entries(KHOA).find(([k]) => bang(k, key))?.[1];\n    if (!ai) throw new UnauthorizedException('Thiếu hoặc sai x-api-key');   // 401: chưa biết bạn là ai\n    (req as any).user = ai;\n    return true;\n  }\n}\n@Injectable()\nexport class RolesGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext): boolean {\n    const dich = [ctx.getHandler(), ctx.getClass()];\n    if (process.env.SUA && this.reflector.getAllAndOverride(Public, dich)) return true;  // SỬA: Public bỏ qua CẢ guard vai trò\n    const can = this.reflector.getAllAndOverride(Roles, dich);\n    if (!can) return true;\n    const user = ctx.switchToHttp().getRequest().user;\n    return can.some((v) => user?.vaiTro.includes(v));                      // false ⇒ Nest tự ném 403\n  }\n}\n\n@Controller('rooms')\n@Roles(['sv', 'gv'])                       // mặc định của cả controller\nclass RoomsController {\n  @Get() @Public() list() { return ['Lab 401', 'Lab 402']; }\n  @Get(':id') one(@Param('id', ParseIntPipe) id: number) { return { id }; }\n  @Get(':id/nhat-ky') @Roles(['gv']) log(@Param('id', ParseIntPipe) id: number) { return { id, nhatKy: '…' }; }  // ghi đè: chỉ giảng viên\n}\n\n// controller viết thêm tuần sau — người viết QUÊN gắn guard\n@Controller('reports') class ReportsController { @Get() all() { return { doanhThu: '12 800 000 đ', sdtSv: ['0912…'] }; } }\n\nconst TOAN_CUC = process.env.CHE_DO !== 'controller';\nif (!TOAN_CUC) UseGuards(ApiKeyGuard, RolesGuard)(RoomsController);   // chỉ gắn ở controller \"nhớ ra\"\n@Module({\n  controllers: [RoomsController, ReportsController],\n  providers: TOAN_CUC ? [{ provide: APP_GUARD, useClass: ApiKeyGuard }, { provide: APP_GUARD, useClass: RolesGuard }] : [],\n})\nclass AppModule {}\n\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst goi = async (u: string, key?: string) => {\n  const r = await fetch('http://127.0.0.1:3000' + u, { headers: key ? { 'x-api-key': key } : {} });\n  console.log(`GET ${u.padEnd(18)} key=${(key ?? '-').padEnd(10)} → ${r.status} ${await r.text()}`);\n};\nawait goi('/rooms');\nawait goi('/rooms/1');\nawait goi('/rooms/abc');                 // không khoá + id sai: guard chạy TRƯỚC pipe ⇒ 401, không phải 400\nawait goi('/rooms/abc', 'k-sv-0001');\nawait goi('/rooms/1', 'k-sv-0001');\nawait goi('/rooms/1/nhat-ky', 'k-sv-0001');\nawait goi('/rooms/1/nhat-ky', 'k-gv-0002');\nawait goi('/reports');\nawait app.close();";
const OUT_GUARD = "## to\u00e0n c\u1ee5c (APP_GUARD)\nGET /rooms             key=-          \u2192 403 {\"message\":\"Forbidden resource\",\"error\":\"Forbidden\",\"statusCode\":403}\nGET /rooms/1           key=-          \u2192 401 {\"message\":\"Thi\u1ebfu ho\u1eb7c sai x-api-key\",\"error\":\"Unauthorized\",\"statusCode\":401}\nGET /rooms/abc         key=-          \u2192 401 {\"message\":\"Thi\u1ebfu ho\u1eb7c sai x-api-key\",\"error\":\"Unauthorized\",\"statusCode\":401}\nGET /rooms/abc         key=k-sv-0001  \u2192 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/1           key=k-sv-0001  \u2192 200 {\"id\":1}\nGET /rooms/1/nhat-ky   key=k-sv-0001  \u2192 403 {\"message\":\"Forbidden resource\",\"error\":\"Forbidden\",\"statusCode\":403}\nGET /rooms/1/nhat-ky   key=k-gv-0002  \u2192 200 {\"id\":1,\"nhatKy\":\"\u2026\"}\nGET /reports           key=-          \u2192 401 {\"message\":\"Thi\u1ebfu ho\u1eb7c sai x-api-key\",\"error\":\"Unauthorized\",\"statusCode\":401}\n## CHE_DO=controller (ch\u1ec9 @UseGuards \u1edf RoomsController)\nGET /rooms             key=-          \u2192 403 {\"message\":\"Forbidden resource\",\"error\":\"Forbidden\",\"statusCode\":403}\nGET /rooms/1           key=-          \u2192 401 {\"message\":\"Thi\u1ebfu ho\u1eb7c sai x-api-key\",\"error\":\"Unauthorized\",\"statusCode\":401}\nGET /rooms/abc         key=-          \u2192 401 {\"message\":\"Thi\u1ebfu ho\u1eb7c sai x-api-key\",\"error\":\"Unauthorized\",\"statusCode\":401}\nGET /rooms/abc         key=k-sv-0001  \u2192 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/1           key=k-sv-0001  \u2192 200 {\"id\":1}\nGET /rooms/1/nhat-ky   key=k-sv-0001  \u2192 403 {\"message\":\"Forbidden resource\",\"error\":\"Forbidden\",\"statusCode\":403}\nGET /rooms/1/nhat-ky   key=k-gv-0002  \u2192 200 {\"id\":1,\"nhatKy\":\"\u2026\"}\nGET /reports           key=-          \u2192 200 {\"doanhThu\":\"12 800 000 \u0111\",\"sdtSv\":[\"0912\u2026\"]}";
const OUT_SUA = "## SUA=1 (RolesGuard c\u0169ng t\u00f4n tr\u1ecdng @Public)\nGET /rooms             key=-          \u2192 200 [\"Lab 401\",\"Lab 402\"]";

export default {
  title: '3.4 — Guards: CanActivate, ExecutionContext, Reflector and custom metadata decorators|||3.4 — Guard: CanActivate, ExecutionContext, Reflector và decorator metadata tự viết',
  slug: 'nst-3-4-guard',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Guard quyết định request có được vào handler; khác middleware ở chỗ đọc được metadata của handler. Chạy thật: ApiKeyGuard + RolesGuard qua APP_GUARD, @Public và @Roles tạo bằng Reflector.createDecorator, getAllAndOverride (method ghi đè class), 401 vs 403, guard chạy trước pipe. Lỗi thật phát hiện khi soạn: route @Public vẫn 403 vì vai trò khai ở class. So sánh mặc định chặn (toàn cục) với gắn từng controller: controller viết sau quên guard lộ dữ liệu — liên hệ vụ Optus 2022.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>3.4 — Guards: who may enter this particular room</h2>
<p class="lead">A guard answers one question: may this request reach this handler? It returns <code>true</code>, returns <code>false</code> (Nest replies 403), or throws (usually 401). The difference from middleware is the <code>ExecutionContext</code>: a guard knows the controller class and the method that will run, so it can read the metadata you put on them with decorators — <code>@Public()</code>, <code>@Roles(['gv'])</code>. That is what makes declarative authorization possible.</p>

<h3>Everyday analogy: the receptionist on each floor</h3>
<p>The gate guard (middleware) let you into the building. The receptionist on the 4th floor looks at the meeting list for <em>room 401 at 9:00</em> and checks your name is on it. Same person, different rooms, different answers — because the receptionist knows which room you are asking for.</p>

<h3>Experiment — an API key guard and a role guard, applied globally</h3>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<div class="out">${esc(OUT_GUARD)}</div>

<h4>Reading the first block (global guards via <code>APP_GUARD</code>)</h4>
<ul>
<li><code>/rooms/1</code> without a key: <strong>401</strong> — "I do not know who you are". With a student key on the teacher-only <code>nhat-ky</code> route: <strong>403</strong> — "I know you, and no". Returning <code>false</code> produced Nest's default <code>Forbidden resource</code>.</li>
<li><code>/rooms/abc</code> without a key is 401, with a key 400: the guard runs <strong>before</strong> the pipe.</li>
<li><code>@Roles(['gv'])</code> on the method overrode <code>@Roles(['sv','gv'])</code> on the class: <code>getAllAndOverride([handler, class])</code> returns the first one found. <code>getAllAndMerge</code> would combine both lists.</li>
<li><code>Reflector.createDecorator&lt;string[]&gt;()</code> gives a typed decorator and a key in one line — no string constant shared between <code>SetMetadata</code> and the guard.</li>
<li>The key comparison uses <code>timingSafeEqual</code>. A plain <code>===</code> stops at the first different character, and with enough measurements response time can leak how much of a guess was right.</li>
</ul>

<h4>A real bug, found while writing this lesson</h4>
<p>Look at the very first line: <code>GET /rooms</code> is marked <code>@Public()</code>, and still returned <strong>403</strong>. <code>ApiKeyGuard</code> honoured <code>@Public</code> and let it through without a user — then <code>RolesGuard</code> found <code>@Roles(['sv','gv'])</code> on the class, saw no user, and said no. Each guard looked correct on its own; together they broke the public route. The fix is one line: the role guard must also skip public routes (or merge both checks into one guard, as the lab does).</p>
<div class="out">${esc(OUT_SUA)}</div>
<p>This is why guard combinations need tests at the HTTP level (lab 3.7), not just unit tests of each guard.</p>

<h4>Reading the second block (guards on one controller only)</h4>
<p>Same code, but guards attached with <code>@UseGuards</code> to <code>RoomsController</code> only. Everything there behaves the same — and <code>/reports</code>, a controller someone added next week, answers <strong>200 with revenue and student phone numbers</strong> to anyone. Nobody wrote a vulnerability; someone simply did not write a decorator. A global guard makes the safe state the default: new routes are closed until someone explicitly writes <code>@Public()</code>, which a reviewer can see in the diff.</p>

<h3>🕵️ Real incident — Optus, September 2022</h3>
<p>Between 17 and 20 September 2022, an attacker pulled customer records from an Optus API endpoint, rotating through tens of thousands of IP addresses. In June 2024 the Australian Communications and Media Authority (ACMA) filed in the Federal Court, alleging that the access controls of that rarely used API had been rendered ineffective by a coding error introduced in 2018; Optus fixed the error on its main domain in 2021 but not on the subdomain where the API lived. ACMA's filing concerns around 3.6 million current and former customers (other figures, up to 9.5 million people, appear in reporting). Optus disputed that this was negligence. The lesson for Nest code is the same as the <code>/reports</code> experiment: access control that has to be remembered per endpoint will eventually be forgotten or broken on one of them. Deny by default, open explicitly, and test the closed state.</p>

<h3>ExecutionContext in two sentences</h3>
<p><code>ExecutionContext</code> extends <code>ArgumentsHost</code> with <code>getHandler()</code> and <code>getClass()</code>. <code>getType()</code> returns <code>'http'</code>, <code>'rpc'</code> or <code>'ws'</code>, so the same guard can work for HTTP, microservices (Chapter 10) and WebSocket gateways — just switch to the right context to find the credentials.</p>

<h3>🧪 Exercise (15 min)</h3>
<p>Without looking at the fix above: make <code>GET /rooms</code> public again while keeping both guards global and <code>@Roles</code> on the class. Then add a test (or a script line) proving that <code>/rooms/1/nhat-ky</code> is still 403 for a student.</p>
<details><summary>Show answer</summary>
<pre><code class="language-ts">canActivate(ctx: ExecutionContext): boolean {
  const dich = [ctx.getHandler(), ctx.getClass()];
  if (this.reflector.getAllAndOverride(Public, dich)) return true;   // public skips the role guard too
  const can = this.reflector.getAllAndOverride(Roles, dich);
  if (!can) return true;
  return can.some((v) =&gt; ctx.switchToHttp().getRequest().user?.vaiTro.includes(v));
}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>The other lines of the run are unchanged: <code>nhat-ky</code> is still 403 for <code>k-sv-0001</code> and 200 for <code>k-gv-0002</code>.</p>
</details>

<h3>💼 On the job</h3>
<p>Penetration testers hired by clients of outsourcing companies do exactly the <code>/reports</code> experiment at scale: list every route (from the OpenAPI document, Chapter 4), call each one without credentials and with a low-privilege account, and report everything that answers 200. A global guard plus a test that walks all routes is the cheapest way to make that report empty.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CanActivate</span><span class="v">Guard interface: <code>canActivate(ctx)</code> returns boolean (or a Promise/Observable of one).</span></div>
  <div class="kv"><span class="k">ExecutionContext</span><span class="v">ArgumentsHost + <code>getHandler()</code>, <code>getClass()</code>, <code>getType()</code>.</span></div>
  <div class="kv"><span class="k">Reflector</span><span class="v">Reads decorator metadata; <code>createDecorator</code>, <code>get</code>, <code>getAllAndOverride</code>, <code>getAllAndMerge</code>.</span></div>
  <div class="kv"><span class="k">APP_GUARD</span><span class="v">Token to register a global guard as a provider (with DI).</span></div>
  <div class="kv"><span class="k">401 / 403</span><span class="v">Not authenticated / authenticated but not allowed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Guards decide access, run after middleware and before interceptors and pipes, and can read route metadata.</li>
<li><code>false</code> ⇒ 403; throw <code>UnauthorizedException</code> for "who are you?" ⇒ 401.</li>
<li><code>Reflector.createDecorator</code> + <code>getAllAndOverride([handler, class])</code>: method overrides class.</li>
<li>Deny by default with <code>APP_GUARD</code>; opening a route must be explicit and visible.</li>
<li>Guards interact — test the combination over HTTP, including public routes.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>3.4 — Guard: ai được vào đúng căn phòng này</h2>
<p class="lead">Guard trả lời một câu: request này có được tới handler này không? Nó trả <code>true</code>, trả <code>false</code> (Nest đáp 403), hoặc ném lỗi (thường là 401). Khác middleware ở <code>ExecutionContext</code>: guard biết class controller và method sắp chạy, nên đọc được metadata bạn gắn lên chúng bằng decorator — <code>@Public()</code>, <code>@Roles(['gv'])</code>. Nhờ vậy mới phân quyền kiểu khai báo được.</p>

<h3>Liên hệ đời thường: lễ tân từng tầng</h3>
<p>Bác bảo vệ cổng (middleware) đã cho bạn vào toà nhà. Lễ tân tầng 4 nhìn danh sách cuộc họp <em>phòng 401 lúc 9 giờ</em> và kiểm tên bạn có trong đó không. Cùng một người, phòng khác nhau, câu trả lời khác nhau — vì lễ tân biết bạn đang xin vào phòng nào.</p>

<h3>Thí nghiệm — guard khoá API và guard vai trò, gắn toàn cục</h3>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<div class="out">${esc(OUT_GUARD)}</div>

<h4>Đọc khối thứ nhất (guard toàn cục qua <code>APP_GUARD</code>)</h4>
<ul>
<li><code>/rooms/1</code> không có khoá: <strong>401</strong> — "tôi không biết bạn là ai". Khoá sinh viên vào route <code>nhat-ky</code> chỉ dành cho giảng viên: <strong>403</strong> — "tôi biết bạn, và không". Trả <code>false</code> cho ra <code>Forbidden resource</code> mặc định của Nest.</li>
<li><code>/rooms/abc</code> không khoá là 401, có khoá là 400: guard chạy <strong>trước</strong> pipe.</li>
<li><code>@Roles(['gv'])</code> ở method ghi đè <code>@Roles(['sv','gv'])</code> ở class: <code>getAllAndOverride([handler, class])</code> trả cái tìm thấy đầu tiên. <code>getAllAndMerge</code> thì gộp hai danh sách.</li>
<li><code>Reflector.createDecorator&lt;string[]&gt;()</code> cho một decorator có kiểu và một khoá trong một dòng — không cần hằng chuỗi dùng chung giữa <code>SetMetadata</code> và guard.</li>
<li>So khoá bằng <code>timingSafeEqual</code>. Phép <code>===</code> thường dừng ngay ký tự khác đầu tiên; đo đủ nhiều lần, thời gian phản hồi có thể lộ ra đoán đúng được bao nhiêu ký tự.</li>
</ul>

<h4>Một lỗi thật, phát hiện ngay lúc soạn bài</h4>
<p>Nhìn dòng đầu tiên: <code>GET /rooms</code> đã gắn <code>@Public()</code>, vậy mà vẫn trả <strong>403</strong>. <code>ApiKeyGuard</code> tôn trọng <code>@Public</code> và cho qua mà không có user — rồi <code>RolesGuard</code> thấy <code>@Roles(['sv','gv'])</code> trên class, không thấy user, và từ chối. Từng guard nhìn riêng đều đúng; ghép lại thì làm hỏng route công khai. Sửa một dòng: guard vai trò cũng phải bỏ qua route công khai (hoặc gộp hai bước kiểm vào một guard, như lab làm).</p>
<div class="out">${esc(OUT_SUA)}</div>
<p>Đó là lý do tổ hợp guard cần test ở mức HTTP (lab 3.7), chứ không chỉ test đơn vị từng guard.</p>

<h4>Đọc khối thứ hai (guard chỉ gắn ở một controller)</h4>
<p>Cùng mã, nhưng guard gắn bằng <code>@UseGuards</code> chỉ cho <code>RoomsController</code>. Mọi thứ ở đó vẫn y như cũ — còn <code>/reports</code>, controller ai đó thêm tuần sau, trả <strong>200 kèm doanh thu và số điện thoại sinh viên</strong> cho bất kỳ ai. Không ai viết lỗ hổng cả; chỉ là có người không viết một decorator. Guard toàn cục biến trạng thái an toàn thành mặc định: route mới bị đóng cho tới khi có người viết tường minh <code>@Public()</code> — thứ người review nhìn thấy ngay trong diff.</p>

<h3>🕵️ Sự cố thật — Optus, tháng 9/2022</h3>
<p>Từ 17 tới 20/9/2022, một kẻ tấn công rút dữ liệu khách hàng từ một endpoint API của Optus, xoay vòng qua hàng chục nghìn địa chỉ IP. Tháng 6/2024, Cơ quan Truyền thông và Phương tiện Úc (ACMA) nộp đơn lên Toà án Liên bang, cáo buộc rằng kiểm soát truy cập của API ít dùng đó đã bị vô hiệu bởi một lỗi mã từ năm 2018; Optus sửa lỗi này ở tên miền chính năm 2021 nhưng không sửa ở tên miền phụ nơi API nằm. Hồ sơ của ACMA nói tới khoảng 3,6 triệu khách hàng hiện tại và cũ (báo chí còn nêu những con số khác, tới 9,5 triệu người). Optus không đồng ý rằng đây là sự cẩu thả. Bài học cho mã Nest giống hệt thí nghiệm <code>/reports</code>: kiểm soát truy cập phải nhớ gắn cho từng endpoint thì sớm muộn sẽ bị quên hoặc hỏng ở một endpoint. Mặc định chặn, mở tường minh, và test trạng thái đóng.</p>

<h3>ExecutionContext trong hai câu</h3>
<p><code>ExecutionContext</code> mở rộng <code>ArgumentsHost</code> thêm <code>getHandler()</code> và <code>getClass()</code>. <code>getType()</code> trả <code>'http'</code>, <code>'rpc'</code> hoặc <code>'ws'</code>, nên cùng một guard dùng được cho HTTP, microservice (Chương 10) và WebSocket gateway — chỉ cần chuyển sang đúng ngữ cảnh để lấy thông tin xác thực.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Đừng nhìn bản sửa ở trên: làm cho <code>GET /rooms</code> công khai trở lại, vẫn giữ cả hai guard toàn cục và <code>@Roles</code> ở class. Rồi thêm một test (hoặc một dòng kịch bản) chứng minh <code>/rooms/1/nhat-ky</code> vẫn 403 với sinh viên.</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">canActivate(ctx: ExecutionContext): boolean {
  const dich = [ctx.getHandler(), ctx.getClass()];
  if (this.reflector.getAllAndOverride(Public, dich)) return true;   // công khai thì bỏ qua cả guard vai trò
  const can = this.reflector.getAllAndOverride(Roles, dich);
  if (!can) return true;
  return can.some((v) =&gt; ctx.switchToHttp().getRequest().user?.vaiTro.includes(v));
}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>Các dòng còn lại của lần chạy không đổi: <code>nhat-ky</code> vẫn 403 với <code>k-sv-0001</code> và 200 với <code>k-gv-0002</code>.</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>Người kiểm thử xâm nhập mà khách hàng của công ty outsourcing thuê làm đúng thí nghiệm <code>/reports</code> ở quy mô lớn: liệt kê mọi route (từ tài liệu OpenAPI, Chương 4), gọi từng route không có thông tin xác thực và với tài khoản quyền thấp, rồi báo cáo mọi thứ trả 200. Guard toàn cục cộng một test đi qua mọi route là cách rẻ nhất để báo cáo đó trống trơn.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CanActivate</span><span class="v">Interface của guard: <code>canActivate(ctx)</code> trả boolean (hoặc Promise/Observable của boolean).</span></div>
  <div class="kv"><span class="k">ExecutionContext</span><span class="v">ArgumentsHost + <code>getHandler()</code>, <code>getClass()</code>, <code>getType()</code>.</span></div>
  <div class="kv"><span class="k">Reflector</span><span class="v">Đọc metadata của decorator; <code>createDecorator</code>, <code>get</code>, <code>getAllAndOverride</code>, <code>getAllAndMerge</code>.</span></div>
  <div class="kv"><span class="k">APP_GUARD</span><span class="v">Token đăng ký guard toàn cục như một provider (có DI).</span></div>
  <div class="kv"><span class="k">401 / 403</span><span class="v">Chưa xác thực / đã xác thực nhưng không được phép.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Guard quyết định quyền vào, chạy sau middleware và trước interceptor, pipe; đọc được metadata của route.</li>
<li><code>false</code> ⇒ 403; ném <code>UnauthorizedException</code> cho câu "bạn là ai?" ⇒ 401.</li>
<li><code>Reflector.createDecorator</code> + <code>getAllAndOverride([handler, class])</code>: method ghi đè class.</li>
<li>Mặc định chặn bằng <code>APP_GUARD</code>; mở một route phải tường minh và nhìn thấy được.</li>
<li>Các guard tác động lẫn nhau — test tổ hợp qua HTTP, kể cả route công khai.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
