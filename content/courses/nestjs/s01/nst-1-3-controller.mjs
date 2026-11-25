/**
 * 1.3 — Controller (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0, Express 5.3.0) — scratchpad/nst/lab/c1/app
 * (demo.controller.ts, demo2.controller.ts; kịch bản t13.sh, t13b.sh). @Get('users/me') khai sau ':id' ⇒ {"id":"me"};
 * '/:tu-:den' với 2026-12-01 ⇒ tu "2026-12", den "01"; @Get('tep/*') ⇒ WARN LegacyRouteConverter; @Res() quên gửi ⇒ curl exit 28.
 * Góc hacker: CVE-2024-45296 (GHSA-9wv6-86v2-598j, 09/09/2024) + CVE-2024-52798 (GHSA-rhx6-c78j-4q9w, 05/12/2024) — đo thật
 * path-to-regexp 0.1.7 / 0.1.10 / 0.1.12 / 8.4.2 trên máy nhà (Node v22.22.2); express 4.20.0→0.1.10, 4.21.2→0.1.12;
 * @nestjs/platform-express 10.4.4→express 4.21.0 (ghim đúng), 10.4.14 (09/12/2024)→4.21.2 (npm registry, đã GET 24/11/2026).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-6-2-ma-trang-thai', title: 'Node.js 6.2 — Mã trạng thái', sub: '201, 204, 404, 409, 422… dùng cái nào khi nào — bài này chỉ dạy cách Nest đặt chúng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-6-1-tai-nguyen-phuong-thuc', title: 'Node.js 6.1 — Tài nguyên và phương thức', sub: 'Thiết kế URL và chọn GET/POST/PATCH/DELETE.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Controllers', 'Route, tham số, mã trạng thái, header, redirect, @Res và passthrough.', 'https://docs.nestjs.com/controllers'),
  nguon('🛡️', 'GHSA-9wv6-86v2-598j — CVE-2024-45296', 'path-to-regexp sinh regex quay lui khi một đoạn có hai tham số (/:a-:b). 09/09/2024.', 'https://github.com/advisories/GHSA-9wv6-86v2-598j'),
  nguon('🛡️', 'GHSA-rhx6-c78j-4q9w — CVE-2024-52798', 'Bản vá 0.1.10 chưa đủ; nhánh 0.1.x phải lên 0.1.12. 05/12/2024.', 'https://github.com/advisories/GHSA-rhx6-c78j-4q9w'),
  nguon('📘', 'NestJS Docs — Migration guide (Express v5 routes)', 'Ký tự đại diện phải có tên: /users/{*path}.', 'https://docs.nestjs.com/migration-guide'),
].join('\n');
const MA_DEMO = "import {\n  Body, Controller, Delete, Get, Header, Headers, HttpCode, NotFoundException,\n  Param, Post, Query, Redirect, Res,\n} from '@nestjs/common';\nimport type { Response } from 'express';\nimport { of, delay } from 'rxjs';\n\n@Controller('demo')\nexport class DemoController {\n  // ── tham số đường dẫn: luôn là CHUỖI nếu không có pipe ──\n  @Get('users/:id')\n  motUser(@Param('id') id: string) {\n    return { id, kieu: typeof id };\n  }\n\n  @Get('users/me')                       // ⚠ khai SAU 'users/:id' ⇒ không bao giờ tới được\n  toi() {\n    return { toi: 'người đang đăng nhập' };\n  }\n\n  // ── query: chuỗi, hoặc mảng khi lặp khoá ──\n  @Get('tim')\n  tim(@Query() q: Record<string, unknown>, @Query('trang') trang?: string) {\n    return { q, trang, kieuTrang: typeof trang };\n  }\n\n  // ── body + mã trạng thái mặc định ──\n  @Post('echo')\n  echo(@Body() body: unknown, @Headers('content-type') ct?: string) {\n    return { nhan: body, ct };\n  }\n\n  @Post('dang-nhap')\n  @HttpCode(200)                         // POST mặc định 201; đăng nhập không \"tạo\" gì\n  dangNhap() {\n    return { ok: true };\n  }\n\n  @Get('bang-gia')\n  @Header('Cache-Control', 'no-store')\n  bangGia() {\n    return 'giá hôm nay';                // chuỗi ⇒ text/html\n  }\n\n  @Get('tai-lieu')\n  @Redirect('https://docs.nestjs.com', 302)\n  taiLieu(@Query('ban') ban?: string) {\n    if (ban === '10') return { url: 'https://docs.nestjs.com/v10/' };   // ghi đè url\n  }\n\n  @Delete('notes/:id')\n  xoa(@Param('id') id: string) {\n    if (id !== '1') throw new NotFoundException(`Note ${id} không tồn tại`);\n    // không return gì\n  }\n\n  // ── Promise và Observable đều được Nest chờ ──\n  @Get('cham')\n  async cham() {\n    await new Promise((r) => setTimeout(r, 200));\n    return { xong: 'sau 200ms' };\n  }\n\n  @Get('luong')\n  luong() {\n    return of({ tu: 'Observable' }).pipe(delay(100));\n  }\n\n  // ── @Res(): bạn tự lo hết, Nest đứng ngoài ──\n  @Get('res-quen')\n  resQuen(@Res() res: Response) {\n    if (Math.random() > 2) res.json({ khong: 'bao giờ' });\n    return { tuong: 'Nest sẽ gửi cái này' };   // ⚠ bị bỏ qua, request treo\n  }\n\n  @Get('res-passthrough')\n  resPass(@Res({ passthrough: true }) res: Response) {\n    res.cookie('xem', '1', { httpOnly: true });\n    return { van: 'Nest gửi giúp' };\n  }\n}";
const OUT_TT = "$ curl localhost:3000/demo/users/42\n{\"id\":\"42\",\"kieu\":\"string\"}\n$ curl localhost:3000/demo/users/me\n{\"id\":\"me\",\"kieu\":\"string\"}\n$ curl 'localhost:3000/demo/tim?q=nest&trang=2&tag=a&tag=b'\n{\"q\":{\"q\":\"nest\",\"trang\":\"2\",\"tag\":[\"a\",\"b\"]},\"trang\":\"2\",\"kieuTrang\":\"string\"}";
const OUT_BODY = "$ curl -i -X POST localhost:3000/demo/echo -H 'Content-Type: application/json' -d '{\"ten\":\"An\"}'\nHTTP/1.1 201 Created\nX-Powered-By: Express\nContent-Type: application/json; charset=utf-8\n…\n{\"nhan\":{\"ten\":\"An\"},\"ct\":\"application/json\"}\n$ curl -X POST localhost:3000/demo/echo -H 'Content-Type: text/plain' -d 'chữ thường'\n{\"ct\":\"text/plain\"}\n$ curl -s -o /dev/null -w '%{http_code}\\n' -X POST localhost:3000/demo/dang-nhap\n200";
const OUT_HEADER = "$ curl -i localhost:3000/demo/bang-gia\nHTTP/1.1 200 OK\nX-Powered-By: Express\nCache-Control: no-store\nContent-Type: text/html; charset=utf-8\n…\ngiá hôm nay\n$ curl -s -o /dev/null -w '%{http_code} %{redirect_url}\\n' localhost:3000/demo/tai-lieu\n302 https://docs.nestjs.com/\n$ curl -s -o /dev/null -w '%{http_code} %{redirect_url}\\n' 'localhost:3000/demo/tai-lieu?ban=10'\n302 https://docs.nestjs.com/v10/\n$ curl -i -X DELETE localhost:3000/demo/notes/1\nHTTP/1.1 200 OK\nX-Powered-By: Express\n…\nContent-Length: 0\n\n$ curl -X DELETE localhost:3000/demo/notes/9\n{\"message\":\"Note 9 không tồn tại\",\"error\":\"Not Found\",\"statusCode\":404}";
const OUT_ASYNC = "$ curl localhost:3000/demo/cham\n{\"xong\":\"sau 200ms\"}\n$ curl localhost:3000/demo/luong\n{\"tu\":\"Observable\"}";
const OUT_RES = "$ curl -m 3 localhost:3000/demo/res-quen; echo \"exit=$?\"\nexit=28              ← curl hết 3 giây chờ: server không bao giờ trả lời\n$ curl -i localhost:3000/demo/res-passthrough\nHTTP/1.1 200 OK\nX-Powered-By: Express\nSet-Cookie: xem=1; Path=/; HttpOnly\nContent-Type: application/json; charset=utf-8\n…\n{\"van\":\"Nest gửi giúp\"}";
const MA_DEMO2 = "import { Controller, Get, Param, Req } from '@nestjs/common';\nimport type { Request } from 'express';\n\n@Controller('demo2')\nexport class Demo2Controller {\n  @Get('users/me')                       // ✔ route cố định khai TRƯỚC route có tham số\n  toi() { return { toi: 'người đang đăng nhập' }; }\n\n  @Get('users/:id')\n  mot(@Param('id') id: string) { return { id }; }\n\n  @Get('tep/*duong')                     // Express 5 / Nest 11+: ký tự đại diện phải có tên\n  tep(@Param('duong') duong: string[]) { return { duong }; }\n\n  @Get('lich/:tu-:den')                  // hai tham số trong một đoạn\n  lich(@Param() p: Record<string, string>, @Req() req: Request) { return { p, url: req.url }; }\n}";
const OUT_TT2 = "$ curl localhost:3000/demo2/users/me\n{\"toi\":\"người đang đăng nhập\"}\n$ curl localhost:3000/demo2/users/42\n{\"id\":\"42\"}\n$ curl localhost:3000/demo2/tep/2026/11/bao-cao.pdf\n{\"duong\":[\"2026\",\"11\",\"bao-cao.pdf\"]}\n$ curl localhost:3000/demo2/lich/2026-12-01\n{\"p\":{\"tu\":\"2026-12\",\"den\":\"01\"},\"url\":\"/demo2/lich/2026-12-01\"}";
const OUT_LEGACY = "# viết kiểu cũ (Nest ≤ 10 / Express 4):  @Get('tep/*')\nWARN [LegacyRouteConverter] Unsupported route path: \"/demo2/tep/*\". In previous versions, the symbols ?, *, and + were used to denote optional or repeating path parameters. The latest version of \"path-to-regexp\" now requires the use of named parameters. For example, instead of using a route like /users/* to capture all routes starting with \"/users\", you should use /users/{*path}. … Attempting to auto-convert to \"/demo2/tep/{*path}\"...\n$ curl localhost:3000/demo2/tep/2026/11/a.pdf\n{}                   ← chạy được nhờ tự chuyển, nhưng tham số tên \"path\" — handler đọc @Param('duong') nên rỗng";
const OUT_REDOS = "$ node do.cjs        # route '/:a-:b', URL = '/' + '-' × n + '/x' (không khớp ⇒ regex thử mọi cách chia)\npath-to-regexp 0.1.7  /^\\/(?:([^\\/]+?))-(?:([^\\/]+?))\\/?$/i\n   URL dài  1003 ký tự: 0.5 ms\n   URL dài  4003 ký tự: 5.5 ms\n   URL dài 16003 ký tự: 87.8 ms\npath-to-regexp 0.1.10  /^(?:\\/([^/]+?))-(?:([^/]+?))\\/?$/i\n   URL dài  1003 ký tự: 0.4 ms\n   URL dài  4003 ký tự: 5.5 ms\n   URL dài 16003 ký tự: 87.5 ms\npath-to-regexp 0.1.12  /^(?:\\/([^/]+?))-(?:((?:(?!\\/|-).)+?))\\/?$/i\n   URL dài  1003 ký tự: 0.1 ms\n   URL dài  4003 ký tự: 0.0 ms\n   URL dài 16003 ký tự: 0.0 ms\npath-to-regexp 8.4.2  /^(?:\\/([^\\/]+)-([^\\/-]+|-))(?:\\/$)?$/i      (Express 5.3.0 trong Nest 12)\n   1000: 0.1 ms   4000: 0.0 ms   16000: 0.0 ms";

export default {
  title: '1.3 — Controllers: routes, params, query, body, status codes and headers|||1.3 — Controller: route, tham số, query, body, mã trạng thái và header',
  slug: 'nst-1-3-controller',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mọi decorator của controller, mỗi cái một curl thật: @Param/@Query luôn là chuỗi, query lặp khoá thành mảng, body chỉ đọc JSON, POST mặc định 201, @HttpCode/@Header/@Redirect, trả Promise và Observable. @Res() làm request treo nếu quên gửi; passthrough. Thứ tự route (users/me bị :id nuốt), ký tự đại diện có tên của Express 5. Góc hacker: CVE-2024-45296/52798 — hai tham số trong một đoạn URL làm treo CPU, đo thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>1.3 — Controllers: one decorator, one curl</h2>
<p class="lead">A controller translates HTTP into a function call and the return value back into HTTP. This lesson runs every decorator you will use daily against a real server, and shows three behaviours that surprise people: everything from the URL is a string, a route can silently swallow another, and <code>@Res()</code> can make a request hang forever. We end with a real denial-of-service bug that lived in the route matcher under Express — and therefore under Nest 10.</p>

<h3>The demo controller</h3>
<pre><code class="language-ts">${esc(MA_DEMO)}</code></pre>

<h3>Params and query: always strings</h3>
<div class="out">${esc(OUT_TT)}</div>
<ul>
<li><code>id</code> is <code>"42"</code>, not <code>42</code>, even though you might write <code>id: number</code> in TypeScript — the type annotation does not convert anything. Converting is the job of a <strong>pipe</strong> (<code>ParseIntPipe</code>, lesson 3.3).</li>
<li>A repeated key (<code>tag=a&amp;tag=b</code>) becomes an array. So <code>@Query('tag') tag: string</code> is a lie the day a client repeats the key — validate it (chapter 4).</li>
<li><code>/users/me</code> returned <code>{"id":"me"}</code>: the <code>users/me</code> handler was <strong>never reached</strong>. Routes are tried in declaration order and <code>:id</code> matches anything. Fix below.</li>
</ul>

<h3>Body, status code and headers</h3>
<div class="out">${esc(OUT_BODY)}</div>
<p><code>POST</code> answers <code>201 Created</code> by default, every other method <code>200</code>. A login creates nothing, so <code>@HttpCode(200)</code>. The <code>text/plain</code> request shows that the default body parser reads only JSON and URL-encoded forms — <code>body</code> was <code>undefined</code> and disappeared from the JSON.</p>
<div class="out">${esc(OUT_HEADER)}</div>
<ul>
<li>A returned <strong>string</strong> is sent as <code>text/html</code>; an object or array as JSON.</li>
<li><code>@Redirect(url, code)</code> sets a default target; returning <code>{ url }</code> overrides it per request.</li>
<li><code>DELETE</code> returning nothing gave <code>200</code> with an empty body. For "deleted, nothing to say" REST wants <code>204</code>: add <code>@HttpCode(204)</code> (the lab does).</li>
<li>Throwing <code>NotFoundException</code> produced a 404 with a JSON body — no <code>try/catch</code>, no <code>res.status()</code>. The built-in exception layer did it (lesson 3.2).</li>
</ul>

<h3>Async: return a Promise or an Observable</h3>
<div class="out">${esc(OUT_ASYNC)}</div>
<p>Nest awaits whatever you return. <code>async</code> handlers are the norm; Observables (RxJS) matter mostly for interceptors (lesson 3.5) and microservices.</p>

<h3><code>@Res()</code>: the escape hatch, and its price</h3>
<div class="out">${esc(OUT_RES)}</div>
<p>As soon as a handler asks for <code>@Res()</code>, Nest assumes <em>you</em> send the response and ignores the return value. Forget to call <code>res.json()</code> on one branch and the client waits until it times out — curl gave up after 3 s with exit code 28. Interceptors that transform the result (3.5) also stop working. And, as lesson 1.2 showed, the handler now only works on Express.</p>
<p>Use <code>@Res({ passthrough: true })</code> when you only need to <em>add</em> something (a cookie, a dynamic header) and still let Nest send the return value. Use plain <code>@Res()</code> only for streaming a file or similar low-level work.</p>

<h3>Route order, wildcards and two params in one segment</h3>
<pre><code class="language-ts">${esc(MA_DEMO2)}</code></pre>
<div class="out">${esc(OUT_TT2)}</div>
<ul>
<li>Fixed paths (<code>users/me</code>) go <strong>before</strong> parameterised ones (<code>users/:id</code>). Same rule as Express (node 5.2), same bug.</li>
<li>Nest 11+ runs on Express 5, where a wildcard must have a name: <code>*duong</code> collects the rest of the path as an array. Old code with <code>'tep/*'</code> still starts, with a warning — and the parameter is silently renamed:</li>
</ul>
<div class="out">${esc(OUT_LEGACY)}</div>
<ul>
<li><code>/:tu-:den</code> with <code>2026-12-01</code> gave <code>tu = "2026-12"</code>, <code>den = "01"</code>. Two parameters in one segment are ambiguous when the separator can appear in the values. Prefer <code>?tu=2026-12-01&amp;den=2026-12-05</code>. The next section shows this pattern also had a security history.</li>
</ul>

<h3>🕵️ Hacker's corner — CVE-2024-45296: a URL that burns CPU</h3>
<p>On 9 September 2024 the <code>path-to-regexp</code> project (the route matcher inside Express) published <a href="https://github.com/advisories/GHSA-9wv6-86v2-598j" target="_blank" rel="noopener">GHSA-9wv6-86v2-598j</a>: any route with two parameters in one segment, like <code>/:a-:b</code>, compiled into a regular expression that <strong>backtracks</strong>. A long URL that almost matches forces the regex to try every way of splitting it. We measured the actual versions:</p>
<div class="out">${esc(OUT_REDOS)}</div>
<p>Four times longer URL ⇒ sixteen times more time: quadratic. One 16 KB request costs ~88 ms of CPU, and Node has one main thread — a dozen such requests per second keep a core busy and every other user waits. Two lessons from the timeline:</p>
<ul>
<li><strong>The first fix was incomplete.</strong> Express 4.20.0 (10/09/2024) shipped <code>0.1.10</code>; our measurement shows the same timings. A second advisory, CVE-2024-52798 (05/12/2024), fixed it in <code>0.1.12</code>, shipped in Express 4.21.2 the same day. <code>@nestjs/platform-express</code> pins an <em>exact</em> Express version, so Nest users only received it by upgrading Nest itself, to 10.4.14 (09/12/2024). If you only upgraded once in September, you were still exposed.</li>
<li><strong>Nest 11/12 on Express 5 use <code>path-to-regexp</code> 8</strong>, which removed the risky features: 0 ms above. On a Nest 10 project at work, run <code>npm ls path-to-regexp</code> — anything below 0.1.12 is a ticket.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<ol>
<li>Add <code>GET /rooms/:id/bookings?from=&amp;to=</code>. Return <code>{ id, from, to }</code> with <code>typeof</code> of each. Call it with <code>from</code> repeated twice. What type do you get?</li>
<li>Make <code>DELETE /notes/:id</code> return 204 and check with <code>curl -i</code>.</li>
<li>Write a handler with <code>@Res()</code> that sends on only one branch, reproduce the hang, then fix it with <code>passthrough</code>.</li>
</ol>
<details><summary>Show answer for 1</summary>
<p><code>id</code> is a string; <code>from</code> becomes an array <code>["…","…"]</code> when repeated — <code>typeof</code> says <code>"object"</code>. Every value from the URL is a string or an array of strings until a pipe or a DTO converts and checks it.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">route handler</span><span class="v">The controller method bound to one method + path.</span></div>
  <div class="kv"><span class="k">route parameter</span><span class="v"><code>:id</code> in the path, read with <code>@Param('id')</code>; always a string.</span></div>
  <div class="kv"><span class="k">library-specific mode</span><span class="v">Using <code>@Res()</code>: you send the response; Nest's return-value handling is off.</span></div>
  <div class="kv"><span class="k">passthrough</span><span class="v"><code>@Res({ passthrough: true })</code>: touch <code>res</code> but let Nest send the return value.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Denial of service through a regular expression whose run time explodes on crafted input.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>URL params and query are strings (or arrays of strings); TypeScript types convert nothing.</li>
<li>POST ⇒ 201 by default; change with <code>@HttpCode</code>. Strings ⇒ text/html, objects ⇒ JSON.</li>
<li>Throw <code>HttpException</code> subclasses instead of setting status by hand.</li>
<li><code>@Res()</code> disables Nest's response handling — forget to send and the request hangs; prefer passthrough.</li>
<li>Fixed routes before <code>:id</code>; named wildcards on Express 5; avoid two params in one segment (CVE-2024-45296/52798).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>1.3 — Controller: mỗi decorator, một lệnh curl</h2>
<p class="lead">Controller dịch HTTP thành một lời gọi hàm, rồi dịch giá trị trả về ngược lại thành HTTP. Bài này chạy mọi decorator bạn sẽ dùng hằng ngày trên một server thật, và chỉ ra ba hành vi hay làm người ta bất ngờ: mọi thứ từ URL đều là chuỗi, một route có thể âm thầm nuốt route khác, và <code>@Res()</code> có thể làm request treo mãi. Cuối bài là một lỗi từ chối dịch vụ có thật, từng nằm trong bộ khớp route bên dưới Express — tức là bên dưới cả Nest 10.</p>

<h3>Controller dùng để thử</h3>
<pre><code class="language-ts">${esc(MA_DEMO)}</code></pre>

<h3>Param và query: luôn là chuỗi</h3>
<div class="out">${esc(OUT_TT)}</div>
<ul>
<li><code>id</code> là <code>"42"</code>, không phải <code>42</code>, kể cả khi bạn viết <code>id: number</code> trong TypeScript — chú thích kiểu không chuyển đổi gì cả. Chuyển đổi là việc của <strong>pipe</strong> (<code>ParseIntPipe</code>, bài 3.3).</li>
<li>Khoá lặp lại (<code>tag=a&amp;tag=b</code>) thành mảng. Vậy <code>@Query('tag') tag: string</code> là lời nói dối vào hôm client lặp khoá — phải kiểm (chương 4).</li>
<li><code>/users/me</code> trả <code>{"id":"me"}</code>: handler <code>users/me</code> <strong>không bao giờ được chạy tới</strong>. Route được thử theo thứ tự khai báo, và <code>:id</code> khớp mọi thứ. Cách sửa ở dưới.</li>
</ul>

<h3>Body, mã trạng thái và header</h3>
<div class="out">${esc(OUT_BODY)}</div>
<p><code>POST</code> mặc định trả <code>201 Created</code>, mọi phương thức khác trả <code>200</code>. Đăng nhập không tạo ra gì, nên dùng <code>@HttpCode(200)</code>. Request <code>text/plain</code> cho thấy bộ đọc body mặc định chỉ hiểu JSON và form URL-encoded — <code>body</code> là <code>undefined</code> và biến mất khỏi JSON.</p>
<div class="out">${esc(OUT_HEADER)}</div>
<ul>
<li>Trả về <strong>chuỗi</strong> ⇒ gửi dạng <code>text/html</code>; trả object hoặc mảng ⇒ JSON.</li>
<li><code>@Redirect(url, code)</code> đặt đích mặc định; trả <code>{ url }</code> thì ghi đè theo từng request.</li>
<li><code>DELETE</code> không trả gì cho ra <code>200</code> với body rỗng. Với "đã xoá, không có gì để nói", REST muốn <code>204</code>: thêm <code>@HttpCode(204)</code> (lab làm vậy).</li>
<li>Ném <code>NotFoundException</code> cho ra 404 có body JSON — không <code>try/catch</code>, không <code>res.status()</code>. Tầng ngoại lệ dựng sẵn đã làm việc đó (bài 3.2).</li>
</ul>

<h3>Bất đồng bộ: trả Promise hoặc Observable</h3>
<div class="out">${esc(OUT_ASYNC)}</div>
<p>Nest chờ bất cứ thứ gì bạn trả về. Handler <code>async</code> là chuyện thường ngày; Observable (RxJS) chủ yếu quan trọng ở interceptor (bài 3.5) và microservice.</p>

<h3><code>@Res()</code>: lối thoát hiểm, và cái giá của nó</h3>
<div class="out">${esc(OUT_RES)}</div>
<p>Ngay khi một handler đòi <code>@Res()</code>, Nest coi như <em>bạn</em> tự gửi phản hồi và bỏ qua giá trị trả về. Quên gọi <code>res.json()</code> ở một nhánh là client chờ tới khi hết giờ — curl bỏ cuộc sau 3 giây với mã thoát 28. Interceptor biến đổi kết quả (3.5) cũng thôi tác dụng. Và như bài 1.2 cho thấy, handler giờ chỉ chạy được trên Express.</p>
<p>Dùng <code>@Res({ passthrough: true })</code> khi bạn chỉ cần <em>thêm</em> một thứ (cookie, header động) mà vẫn để Nest gửi giá trị trả về. Chỉ dùng <code>@Res()</code> trần cho việc cấp thấp như stream một tệp.</p>

<h3>Thứ tự route, ký tự đại diện và hai tham số trong một đoạn</h3>
<pre><code class="language-ts">${esc(MA_DEMO2)}</code></pre>
<div class="out">${esc(OUT_TT2)}</div>
<ul>
<li>Đường cố định (<code>users/me</code>) đặt <strong>trước</strong> đường có tham số (<code>users/:id</code>). Cùng quy tắc với Express (node 5.2), cùng lỗi.</li>
<li>Nest 11 trở đi chạy trên Express 5, nơi ký tự đại diện phải có tên: <code>*duong</code> gom phần đường còn lại thành mảng. Mã cũ viết <code>'tep/*'</code> vẫn khởi động, kèm cảnh báo — và tham số bị đổi tên âm thầm:</li>
</ul>
<div class="out">${esc(OUT_LEGACY)}</div>
<ul>
<li><code>/:tu-:den</code> với <code>2026-12-01</code> cho <code>tu = "2026-12"</code>, <code>den = "01"</code>. Hai tham số trong một đoạn là mập mờ khi dấu ngăn cách có thể nằm trong giá trị. Nên dùng <code>?tu=2026-12-01&amp;den=2026-12-05</code>. Phần sau cho thấy kiểu route này còn có cả tiền sử bảo mật.</li>
</ul>

<h3>🕵️ Góc hacker — CVE-2024-45296: một URL đốt CPU</h3>
<p>Ngày 09/09/2024, dự án <code>path-to-regexp</code> (bộ khớp route bên trong Express) công bố <a href="https://github.com/advisories/GHSA-9wv6-86v2-598j" target="_blank" rel="noopener">GHSA-9wv6-86v2-598j</a>: route nào có hai tham số trong một đoạn, như <code>/:a-:b</code>, bị biên dịch thành biểu thức chính quy <strong>quay lui</strong>. Một URL dài gần khớp buộc regex thử mọi cách chia nó. Ta đo thật trên đúng các phiên bản:</p>
<div class="out">${esc(OUT_REDOS)}</div>
<p>URL dài gấp bốn ⇒ thời gian gấp mười sáu: tăng theo bình phương. Một request 16 KB tốn khoảng 88 mili giây CPU, mà Node chỉ có một luồng chính — chục request như vậy mỗi giây là đủ giữ bận một nhân, mọi người dùng khác phải chờ. Hai bài học từ dòng thời gian:</p>
<ul>
<li><strong>Bản vá đầu tiên chưa đủ.</strong> Express 4.20.0 (10/09/2024) đưa vào <code>0.1.10</code>; số đo của ta cho thấy thời gian y như cũ. Cảnh báo thứ hai, CVE-2024-52798 (05/12/2024), vá ở <code>0.1.12</code>, có trong Express 4.21.2 cùng ngày. <code>@nestjs/platform-express</code> ghim <em>đúng một</em> phiên bản Express, nên người dùng Nest chỉ nhận được bản vá khi nâng chính Nest, lên 10.4.14 (09/12/2024). Nếu bạn chỉ nâng cấp một lần hồi tháng 9, bạn vẫn hở.</li>
<li><strong>Nest 11/12 trên Express 5 dùng <code>path-to-regexp</code> 8</strong>, bản đã bỏ hẳn các tính năng rủi ro: 0 mili giây ở trên. Gặp dự án Nest 10 ở công ty, chạy <code>npm ls path-to-regexp</code> — dưới 0.1.12 là phải mở ticket.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm <code>GET /rooms/:id/bookings?from=&amp;to=</code>. Trả <code>{ id, from, to }</code> kèm <code>typeof</code> của từng cái. Gọi với <code>from</code> lặp hai lần. Bạn nhận kiểu gì?</li>
<li>Cho <code>DELETE /notes/:id</code> trả 204 và kiểm bằng <code>curl -i</code>.</li>
<li>Viết một handler dùng <code>@Res()</code> chỉ gửi ở một nhánh, tái hiện cảnh treo, rồi sửa bằng <code>passthrough</code>.</li>
</ol>
<details><summary>Xem đáp án câu 1</summary>
<p><code>id</code> là chuỗi; <code>from</code> thành mảng <code>["…","…"]</code> khi lặp — <code>typeof</code> nói <code>"object"</code>. Mọi giá trị từ URL là chuỗi hoặc mảng chuỗi cho tới khi một pipe hay DTO chuyển đổi và kiểm nó.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">route handler</span><span class="v">Phương thức của controller gắn với một cặp phương thức + đường dẫn.</span></div>
  <div class="kv"><span class="k">tham số route</span><span class="v"><code>:id</code> trong đường dẫn, đọc bằng <code>@Param('id')</code>; luôn là chuỗi.</span></div>
  <div class="kv"><span class="k">chế độ riêng thư viện</span><span class="v">Dùng <code>@Res()</code>: bạn tự gửi phản hồi; Nest tắt việc xử lý giá trị trả về.</span></div>
  <div class="kv"><span class="k">passthrough</span><span class="v"><code>@Res({ passthrough: true })</code>: đụng vào <code>res</code> nhưng vẫn để Nest gửi giá trị trả về.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Từ chối dịch vụ qua một biểu thức chính quy có thời gian chạy bùng nổ với đầu vào được chế sẵn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Param và query từ URL là chuỗi (hoặc mảng chuỗi); kiểu TypeScript không chuyển đổi gì.</li>
<li>POST mặc định 201; đổi bằng <code>@HttpCode</code>. Chuỗi ⇒ text/html, object ⇒ JSON.</li>
<li>Ném lớp con của <code>HttpException</code> thay vì tự đặt mã trạng thái.</li>
<li><code>@Res()</code> tắt việc gửi phản hồi của Nest — quên gửi là request treo; ưu tiên passthrough.</li>
<li>Route cố định trước <code>:id</code>; ký tự đại diện có tên trên Express 5; tránh hai tham số trong một đoạn (CVE-2024-45296/52798).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
