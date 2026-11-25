/**
 * 2.1 — Khung dự án Express + TypeScript (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (Node 22.22.2, Express 5.3.0, tsx 4.23.15, TypeScript 7.0.2): repo scratchpad/fsp/chiase, commit 5bba45a (tag ch2).
 * Bẫy "middleware lỗi 3 tham số" chạy thật 24/11 18:57: Express trả trang HTML kèm stack trace + đường dẫn tệp trên máy.
 * Node 22.22.2 có type stripping (process.features.typescript = 'strip') nhưng import đuôi .js ⇒ ERR_MODULE_NOT_FOUND (chạy thật).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const HTTP_ERROR = `// Lỗi "có chủ đích": service ném HttpError(404, 'KHONG_TIM_THAY', '…') ⇒ middleware lỗi trả đúng mã + JSON.
// Mọi lỗi KHÁC (bug, mất CSDL…) ⇒ 500 và KHÔNG lộ chi tiết cho client.
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}`;

const INFO_SERVICE = `// Service: logic nghiệp vụ, KHÔNG biết gì về req/res — gọi được từ route, từ test, từ script.
export function layThongTin() {
  return { ten: 'chiase-api', phienBan: '0.2.0' };
}`;

const INFO_CONTROLLER = `import type { Request, Response } from 'express';
import { layThongTin } from '../services/info.service.js';

// Controller: đọc request ⇒ gọi service ⇒ viết response. Mỏng, không chứa nghiệp vụ.
export function getInfo(_req: Request, res: Response) {
  res.json(layThongTin());
}`;

const ROUTES_21 = `import { Router } from 'express';
import { getInfo } from '../controllers/info.controller.js';

// Route: chỉ ánh xạ METHOD + đường dẫn ⇒ controller. Đọc tệp này là biết API có gì.
export const apiRouter = Router();
apiRouter.get('/', getInfo);`;

const NOT_FOUND = `import type { Request, Response } from 'express';

// Đặt SAU mọi route: request nào tới đây là không route nào nhận ⇒ 404 dạng JSON (mặc định Express trả trang HTML).
export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: { code: 'KHONG_CO_ROUTE', message: \`Không có \${req.method} \${req.path}\` } });
}`;

const ERROR_HANDLER = `import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error.js';

// Middleware lỗi của Express nhận ĐÚNG 4 tham số — thiếu \`next\` thì Express coi nó là middleware thường.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  // JSON hỏng trong body: express.json() ném lỗi có status 400 + type 'entity.parse.failed'
  if (typeof err === 'object' &amp;&amp; err !== null &amp;&amp; 'type' in err &amp;&amp; err.type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'JSON_HONG', message: 'Body không phải JSON hợp lệ' } });
    return;
  }
  console.error(\`[\${req.method} \${req.originalUrl}]\`, err);
  res.status(500).json({ error: { code: 'LOI_MAY_CHU', message: 'Có lỗi phía máy chủ' } });
}`;

const APP_21 = `import express from 'express';
import { apiRouter } from './routes/index.js';
import { notFound } from './middlewares/not-found.js';
import { errorHandler } from './middlewares/error-handler.js';

// Tách app (định nghĩa route) khỏi server (mở cổng) để Chương 8 test bằng Supertest mà không cần mở cổng thật.
export function taoApp() {
  const app = express();
  app.disable('x-powered-by'); // đừng quảng cáo "Express" cho người dò lỗ hổng
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', apiRouter);

  app.use(notFound); // sau mọi route
  app.use(errorHandler); // cuối cùng, 4 tham số
  return app;
}`;

const OUT_CURL = `$ curl -i localhost:41815/api
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 39
ETag: W/"27-O4hA1rSyrU7DqXvYe34peZxCJ34"
Date: Tue, 24 Nov 2026 11:56:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"ten":"chiase-api","phienBan":"0.2.0"}

$ curl -s localhost:41815/api/khong-co
{"error":{"code":"KHONG_CO_ROUTE","message":"Không có GET /api/khong-co"}}
$ curl -s -X POST localhost:41815/api -H 'Content-Type: application/json' -d '{ten:'
{"error":{"code":"JSON_HONG","message":"Body không phải JSON hợp lệ"}}
$ curl -s localhost:41815/api/thu-loi-async
{"error":{"code":"LOI_MAY_CHU","message":"Có lỗi phía máy chủ"}}`;

const OUT_BA_THAM_SO = `$ curl -si localhost:41815/api/thu-loi-async   # errorHandler chỉ có 3 tham số
HTTP/1.1 500 Internal Server Error
Content-Type: text/html; charset=utf-8
Content-Length: 289

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Error&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;pre&gt;Error: bug giả lập trong handler async&lt;br&gt; &amp;nbsp; &amp;nbsp;at &amp;lt;anonymous&amp;gt; (/home/…/chiase/apps/api/src/routes/thu-loi.ts:6:9)&lt;/pre&gt;
&lt;/body&gt;
&lt;/html&gt;`;

const OUT_WATCH = `$ npm run dev -w apps/api
API ChiaSe đang nghe http://localhost:41815 (cho phép web http://localhost:41811)
$ curl -s localhost:41815/api
{"ten":"chiase-api","phienBan":"0.2.0"}
# sửa services/info.service.ts: 0.2.0 → 0.2.1, bấm lưu
6:57:28 PM [tsx] change in ./src/services/info.service.ts Restarting...
API ChiaSe đang nghe http://localhost:41815 (cho phép web http://localhost:41811)
$ curl -s localhost:41815/api
{"ten":"chiase-api","phienBan":"0.2.1"}`;

const OUT_NODE_STRIP = `$ node src/server.ts
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/…/chiase/apps/api/src/config.js' imported from /home/…/chiase/apps/api/src/server.ts
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/…/chiase/apps/api/src/config.js'
}`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-3-middleware', title: 'Node.js 5.3 — Middleware: sợi dây chuyền mọi request đi qua', sub: 'next(), thứ tự đăng ký, middleware ứng dụng vs router — đào sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — Xử lý lỗi tập trung', sub: 'Vì sao middleware lỗi có 4 tham số, lỗi async trong Express 4 và 5.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'Node.js 5.2 — Định tuyến: params, query và Router', sub: 'Router() và gắn router con dưới một tiền tố.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Express — Error handling', 'Express 5: promise bị reject trong handler được chuyển thẳng tới middleware lỗi; middleware lỗi có 4 tham số.', 'https://expressjs.com/en/guide/error-handling.html'),
  nguon('📘', 'Express — Production best practices: security', 'Tắt X-Powered-By; không để lộ stack trace ở production.', 'https://expressjs.com/en/advanced/best-practice-security.html'),
  nguon('📘', 'Node.js — Running TypeScript natively', 'Type stripping: Node chạy .ts trực tiếp nhưng KHÔNG đổi đuôi import.', 'https://nodejs.org/api/typescript.html'),
].join('\n');

const CAY = `apps/api/src/
├── server.ts            # mở cổng (chỉ ở đây)
├── app.ts               # tạo app: middleware + gắn router + 404 + lỗi
├── config.ts            # đọc biến môi trường một lần
├── routes/index.ts      # METHOD + đường dẫn ⇒ controller
├── controllers/         # đọc req ⇒ gọi service ⇒ viết res
│   └── info.controller.ts
├── services/            # nghiệp vụ, không biết req/res
│   └── info.service.ts
├── middlewares/         # not-found.ts, error-handler.ts (2.3 thêm log-request.ts)
└── lib/http-error.ts    # lỗi "có chủ đích" mang mã HTTP`;

const MERMAID = `flowchart LR
  C[curl / trình duyệt] --> J["express.json()"]
  J --> R["/api router"]
  R -->|khớp| CT[controller]
  CT --> S[service]
  S -->|trả dữ liệu| CT
  CT -->|res.json| C
  R -->|không khớp| NF["notFound → 404 JSON"]
  S -.->|throw / reject| EH["errorHandler → 4xx/500 JSON"]`;

export default {
  title: '2.1 — Express + TypeScript project skeleton|||2.1 — Khung dự án Express + TypeScript',
  slug: 'fp-2-1-express-ts',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tách API thành routes → controllers → services; 404 và lỗi đều trả JSON qua middleware lỗi 4 tham số; Express 5 tự chuyển lỗi của handler async; tắt X-Powered-By; tsx watch khi dev và vì sao chưa chạy thẳng .ts bằng Node 22 — kèm bẫy thật: middleware lỗi thiếu một tham số làm lộ stack trace và đường dẫn tệp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Backend skeleton</span>
<h2>From one file to layers: routes, controllers, services, and errors that always come back as JSON</h2>
<p class="lead">In Chapter 1 the whole API was one route inside <code>app.ts</code>. That is fine for one route and painful for thirty. Before adding a database, you give the API the shape every later chapter will reuse: each file has one job, every error — expected or not — leaves the server as the same JSON shape, and nothing in a response tells a stranger which framework you use. Everything below ran on 24/11/2026 (Node 22.22.2, Express 5.3.0, tsx 4.23.15).</p>

<h3>Everyday picture: a restaurant</h3>
<p>The <strong>host at the door</strong> reads your booking and sends you to a table (route). The <strong>waiter</strong> takes the order, passes it to the kitchen and brings the plate back (controller). The <strong>chef</strong> cooks and never walks into the dining room (service). If the kitchen burns a dish, the customer does not see the fire — the waiter says "sorry, that dish is unavailable" (error handler). And there is no sign in the window saying which brand of oven is inside (X-Powered-By).</p>

<h3>The three layers and why they exist</h3>
<table>
<thead><tr><th>Layer</th><th>Job</th><th>Knows req/res?</th><th>Tested by (Chapter 8)</th></tr></thead>
<tbody>
<tr><td><code>routes/</code></td><td>Map METHOD + path → controller. Reading this file tells you the whole API.</td><td>No (only paths)</td><td>API tests</td></tr>
<tr><td><code>controllers/</code></td><td>Read the request, call a service, write the response. Thin.</td><td>Yes</td><td>API tests (Supertest)</td></tr>
<tr><td><code>services/</code></td><td>Business rules: "an email can only register once", "only the author can delete".</td><td><strong>No</strong></td><td>Unit tests, without HTTP</td></tr>
</tbody>
</table>
<p>The rule that matters: <strong>services never touch <code>req</code> or <code>res</code></strong>. Then the same rule can be called from a route, a test, a seed script or a background job. Chapter 3's "register" logic will live in a service, so the unit test in Chapter 8 does not need to fake an HTTP request.</p>
<pre><code class="language-text">${CAY}</code></pre>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>Step 1 — The files</h3>
<pre><code class="language-ts">${HTTP_ERROR}</code></pre>
<pre><code class="language-ts">${INFO_SERVICE}</code></pre>
<pre><code class="language-ts">${INFO_CONTROLLER}</code></pre>
<pre><code class="language-ts">${ROUTES_21}</code></pre>
<pre><code class="language-ts">${NOT_FOUND}</code></pre>
<pre><code class="language-ts">${ERROR_HANDLER}</code></pre>
<pre><code class="language-ts">${APP_21}</code></pre>
<p>Order in <code>app.ts</code> is the order a request travels: parse JSON → try the <code>/api</code> routes → if nothing matched, <code>notFound</code> → if anything threw, <code>errorHandler</code>. Put <code>notFound</code> before your routes and every request becomes a 404.</p>

<h3>Step 2 — Prove it with curl</h3>
<p>We temporarily added a route <code>/api/thu-loi-async</code> whose async handler throws (a planted bug), then:</p>
<div class="out">${OUT_CURL}</div>
<ul>
<li>No <code>X-Powered-By: Express</code> line any more (Chapter 1's curl had it). Hiding it does not make the app secure, but it stops automated scanners from picking you as an "Express target" for free.</li>
<li>Unknown route → 404 <em>JSON</em>, not Express's default HTML page. A React app can always do <code>res.json()</code> and read <code>error.code</code>.</li>
<li>Broken JSON body → 400 with a clear code instead of a 500.</li>
<li>The async handler threw <em>after</em> an <code>await</code>, and the client still got a clean 500. In <strong>Express 5</strong> a rejected promise from a handler is passed to the error middleware automatically. In Express 4 the same code left the request hanging and printed an "unhandled rejection" — that is why old tutorials wrap every handler in <code>try/catch</code> or use <code>express-async-errors</code>. You do not need either on Express 5.</li>
</ul>
<p>The server log, meanwhile, keeps the full detail for <em>you</em>: <code>[GET /api/thu-loi-async] Error: bug giả lập trong handler async at … thu-loi.ts:6:9</code>. Detail goes to the log, a generic message goes to the client.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — an error middleware with three parameters.</strong> Express recognises an error handler only by its <em>four</em> parameters <code>(err, req, res, next)</code>. Lint tools love to remove "unused" parameters. We removed <code>_next</code> and ran the same request:</p></div>
<div class="out">${OUT_BA_THAM_SO}</div>
<p>Our handler was now treated as a normal middleware and skipped; Express's built-in handler answered with an <strong>HTML page containing the stack trace and the absolute path of the file on the server</strong>. That path tells an attacker the folder layout and the user name of the machine. (Express hides the stack only when <code>NODE_ENV=production</code> — which a forgotten setting on a VPS will not be.) Keep the fourth parameter and prefix it with <code>_</code> so tools know it is intentionally unused.</p>

<h3>Step 3 — How the API runs during development</h3>
<div class="out">${OUT_WATCH}</div>
<p><code>tsx watch</code> runs TypeScript directly and restarts on every save. Alternatives you will meet at work: <code>nodemon</code> + <code>ts-node</code> (older projects), <code>node --watch</code> (plain JavaScript). Node 22.22 can now strip types from <code>.ts</code> files on its own (<code>process.features.typescript</code> prints <code>strip</code>), so why keep tsx? Try it:</p>
<div class="out">${OUT_NODE_STRIP}</div>
<p>Node's type stripping removes types but <strong>never rewrites import paths</strong>. Our imports end in <code>.js</code> (required by <code>module: nodenext</code> so the compiled output works), and <code>src/config.js</code> does not exist before a build. Making native Node work would mean importing <code>./config.ts</code> plus extra compiler options — possible, but a project-wide decision. For this course: tsx for development, <code>tsc</code> for the production build (Chapter 9).</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request arrives</span><span class="lz-d">express.json() parses the body (or throws 400 JSON_HONG)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">/api router</span><span class="lz-d">first matching METHOD + path wins → controller</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Controller → service</span><span class="lz-d">service returns data or throws HttpError / a real bug</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nothing matched</span><span class="lz-d">notFound → 404 JSON</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Anything threw</span><span class="lz-d">errorHandler: HttpError → its status; else 500 + details only in the log</span></div>
</div>

<h3>On the job: what reviewers say</h3>
<p>In an outsourcing team (FPT Software, for example) the most common review comments on a junior's first Express pull request are: "business logic in the controller — move it to a service", "this returns <code>res.status(500).send(err)</code> — you are sending the error object to the client", and "follow the existing error format". The team's error shape is a <em>contract</em> with the frontend and sometimes with the customer's QA scripts — never invent a second one in your module. Our shape is <code>{"error": {"code", "message"}}</code>; Chapter 5 adds a <code>details</code> field for validation.</p>

${spring(true, 'Spring Boot gives you the same layers by convention: @RestController (controller + route mapping in one class), @Service, and @Repository; a @RestControllerAdvice plays the role of our errorHandler. Spring also hides the "framework" header by default but has its own leak: server.error.include-stacktrace.', [
  ['sb-4-1-restcontroller', 'Spring Boot 4.1 — @RestController and request mapping'],
  ['sb-3-2-dependency-injection', 'Spring Boot 3.2 — Dependency injection: constructor or field'],
  ['sb-3-3-stereotype', 'Spring Boot 3.3 — Stereotype annotations, @Configuration and @Bean'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"Why separate controllers and services?"</strong> — Services hold the rules and know nothing about HTTP, so they are reusable (routes, jobs, scripts) and unit-testable without a server. Controllers stay thin translators.</li>
<li><strong>"How does Express know a middleware is an error handler?"</strong> — By arity: exactly four parameters. Three parameters and it is skipped for errors.</li>
<li><strong>"What happens when an async route handler throws in Express 4 vs 5?"</strong> — Express 4: the rejection is not caught, the request hangs until timeout. Express 5: the rejection is forwarded to the error middleware.</li>
<li><strong>"Why hide X-Powered-By and stack traces?"</strong> — Information disclosure: they tell attackers your framework, file layout and sometimes versions. It is defence in depth, not a fix for vulnerabilities.</li>
<li><strong>"Why does the 404 handler come after the routes?"</strong> — Middleware runs in registration order; a catch-all placed first would answer every request.</li>
</ol>

<h3>🧪 Lab 2.1 (45 min) — reshape your API</h3>
<div class="callout ok">
<ol>
<li>Create branch <code>ch2/nen-backend</code>. Split your Chapter 1 <code>app.ts</code> into <code>routes/</code>, <code>controllers/</code>, <code>services/</code>, <code>middlewares/</code>, <code>lib/</code> as above.</li>
<li>Add <code>notFound</code> and <code>errorHandler</code>; disable <code>x-powered-by</code>.</li>
<li>Plant a temporary async route that throws after an <code>await</code>. Run the four curl commands of Step 2 and compare with the output above.</li>
<li>Remove the fourth parameter of <code>errorHandler</code>, repeat the last curl, read the HTML you get. Put the parameter back. Delete the planted route.</li>
<li><code>npm run check</code> passes; commit: <code>refactor(api): tách routes/controllers/services, 404 + lỗi dạng JSON</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>curl -si localhost:41810/api</code> has no <code>X-Powered-By</code>; an unknown path returns 404 JSON; broken JSON returns 400 JSON; a thrown error returns 500 JSON with no stack in the body.</p>
<p><strong>Rubric (10 pts):</strong> layers separated, no <code>req</code>/<code>res</code> in services (3) · 404/400/500 all JSON in one shape (3) · X-Powered-By gone (1) · trap reproduced and explained in the commit message or notes (2) · check passes (1).</p>
</div>
<details><summary>Solution</summary>
<p>The files above are the exact files of ChiaSe (tag <code>ch2</code>). The three most common mistakes: (1) <code>app.use(notFound)</code> before <code>app.use('/api', apiRouter)</code> — every request 404s; (2) forgetting <code>return</code> after <code>res.status(...).json(...)</code> inside the <code>if</code> of the error handler, then sending a second response → "Cannot set headers after they are sent"; (3) importing <code>./routes/index</code> without <code>.js</code> — <code>tsc</code> with <code>nodenext</code> reports TS2835 and asks for the extension.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">controller</span><span class="v">Translates HTTP ↔ function calls; reads req, writes res.</span></div>
  <div class="kv"><span class="k">service</span><span class="v">Business rules, independent of HTTP.</span></div>
  <div class="kv"><span class="k">error middleware</span><span class="v">Express middleware with 4 parameters (err, req, res, next), runs when something throws.</span></div>
  <div class="kv"><span class="k">information disclosure</span><span class="v">Leaking internal details (framework, paths, stack traces) to clients.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">Node 22+ removing TypeScript types at load time without compiling or rewriting imports.</span></div>
  <div class="kv"><span class="k">HttpError</span><span class="v">Our error class carrying an HTTP status and a stable code for the client.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>routes → controllers → services; services never see req/res.</li>
<li>One error shape, <code>{"error":{"code","message"}}</code>, for 404, 400 and 500; details only in the server log.</li>
<li>Express 5 forwards async errors; the error middleware must keep four parameters.</li>
<li>X-Powered-By off; a three-parameter error handler leaks stack traces and file paths.</li>
<li>tsx watch in development; Node's own type stripping does not rewrite <code>.js</code> imports.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Khung backend</span>
<h2>Từ một tệp thành các lớp: routes, controllers, services, và lỗi nào cũng trả về JSON</h2>
<p class="lead">Ở Chương 1, cả API là một route nằm trong <code>app.ts</code>. Một route thì ổn, ba mươi route thì khổ. Trước khi thêm cơ sở dữ liệu, bạn cho API cái hình dạng mà mọi chương sau dùng lại: mỗi tệp một việc, mọi lỗi — có chủ đích hay không — rời máy chủ với cùng một dạng JSON, và không gì trong response nói cho người lạ biết bạn dùng framework nào. Mọi thứ dưới đây đã chạy ngày 24/11/2026 (Node 22.22.2, Express 5.3.0, tsx 4.23.15).</p>

<h3>Liên tưởng đời thường: một nhà hàng</h3>
<p><strong>Người đón khách ở cửa</strong> đọc tên đặt bàn và đưa bạn tới bàn (route). <strong>Người phục vụ</strong> ghi món, chuyển vào bếp và mang đĩa ra (controller). <strong>Đầu bếp</strong> nấu và không bao giờ bước ra phòng ăn (service). Nếu bếp làm cháy món, khách không nhìn thấy lửa — người phục vụ nói "xin lỗi, món này hết" (middleware lỗi). Và không có tấm biển nào ngoài cửa ghi lò nướng hãng gì (X-Powered-By).</p>

<h3>Ba lớp và vì sao cần chúng</h3>
<table>
<thead><tr><th>Lớp</th><th>Việc</th><th>Biết req/res?</th><th>Test bằng (Chương 8)</th></tr></thead>
<tbody>
<tr><td><code>routes/</code></td><td>Ánh xạ METHOD + đường dẫn → controller. Đọc tệp này là biết cả API.</td><td>Không (chỉ đường dẫn)</td><td>Test API</td></tr>
<tr><td><code>controllers/</code></td><td>Đọc request, gọi service, viết response. Mỏng.</td><td>Có</td><td>Test API (Supertest)</td></tr>
<tr><td><code>services/</code></td><td>Luật nghiệp vụ: "một email chỉ đăng ký một lần", "chỉ tác giả được xoá".</td><td><strong>Không</strong></td><td>Unit test, không cần HTTP</td></tr>
</tbody>
</table>
<p>Luật quan trọng nhất: <strong>service không bao giờ đụng <code>req</code> hay <code>res</code></strong>. Khi đó cùng một luật gọi được từ route, từ test, từ script seed hay từ job chạy nền. Logic "đăng ký" của Chương 3 sẽ nằm trong service, nên unit test ở Chương 8 không phải giả một request HTTP.</p>
<pre><code class="language-text">${CAY}</code></pre>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>Bước 1 — Các tệp</h3>
<pre><code class="language-ts">${HTTP_ERROR}</code></pre>
<pre><code class="language-ts">${INFO_SERVICE}</code></pre>
<pre><code class="language-ts">${INFO_CONTROLLER}</code></pre>
<pre><code class="language-ts">${ROUTES_21}</code></pre>
<pre><code class="language-ts">${NOT_FOUND}</code></pre>
<pre><code class="language-ts">${ERROR_HANDLER}</code></pre>
<pre><code class="language-ts">${APP_21}</code></pre>
<p>Thứ tự trong <code>app.ts</code> chính là đường request đi: parse JSON → thử các route <code>/api</code> → nếu không route nào khớp thì <code>notFound</code> → nếu có gì ném lỗi thì <code>errorHandler</code>. Đặt <code>notFound</code> trước các route thì request nào cũng thành 404.</p>

<h3>Bước 2 — Chứng minh bằng curl</h3>
<p>Chúng tôi tạm thêm route <code>/api/thu-loi-async</code> có handler async ném lỗi (bug cài sẵn), rồi chạy:</p>
<div class="out">${OUT_CURL}</div>
<ul>
<li>Không còn dòng <code>X-Powered-By: Express</code> (curl ở Chương 1 có dòng này). Giấu nó không làm ứng dụng an toàn hơn, nhưng thôi tặng miễn phí cho máy quét tự động cái nhãn "mục tiêu Express".</li>
<li>Route không tồn tại → 404 dạng <em>JSON</em>, không phải trang HTML mặc định của Express. Ứng dụng React lúc nào cũng gọi được <code>res.json()</code> và đọc <code>error.code</code>.</li>
<li>Body JSON hỏng → 400 với mã rõ ràng thay vì 500.</li>
<li>Handler async ném lỗi <em>sau</em> một <code>await</code>, client vẫn nhận 500 gọn gàng. Ở <strong>Express 5</strong>, promise bị reject trong handler được tự chuyển tới middleware lỗi. Ở Express 4, cùng đoạn mã đó làm request treo và in "unhandled rejection" — đó là lý do hướng dẫn cũ bọc mọi handler bằng <code>try/catch</code> hoặc dùng <code>express-async-errors</code>. Với Express 5 bạn không cần cả hai.</li>
</ul>
<p>Trong khi đó, log máy chủ vẫn giữ đủ chi tiết cho <em>bạn</em>: <code>[GET /api/thu-loi-async] Error: bug giả lập trong handler async at … thu-loi.ts:6:9</code>. Chi tiết vào log, câu chung chung ra client.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — middleware lỗi có ba tham số.</strong> Express nhận ra middleware lỗi CHỈ nhờ đủ <em>bốn</em> tham số <code>(err, req, res, next)</code>. Công cụ lint rất thích xoá tham số "không dùng". Chúng tôi xoá <code>_next</code> rồi gọi lại đúng request đó:</p></div>
<div class="out">${OUT_BA_THAM_SO}</div>
<p>Handler của ta bị coi là middleware thường và bị bỏ qua; handler có sẵn của Express trả lời bằng <strong>trang HTML chứa stack trace và đường dẫn tuyệt đối của tệp trên máy chủ</strong>. Đường dẫn đó cho kẻ tấn công biết cấu trúc thư mục và tên người dùng của máy. (Express chỉ giấu stack khi <code>NODE_ENV=production</code> — thứ rất dễ quên đặt trên VPS.) Giữ tham số thứ tư và thêm tiền tố <code>_</code> để công cụ biết đó là cố ý không dùng.</p>

<h3>Bước 3 — API chạy thế nào khi phát triển</h3>
<div class="out">${OUT_WATCH}</div>
<p><code>tsx watch</code> chạy TypeScript trực tiếp và khởi động lại mỗi lần lưu. Những lựa chọn khác bạn sẽ gặp khi đi làm: <code>nodemon</code> + <code>ts-node</code> (dự án cũ), <code>node --watch</code> (JavaScript thuần). Node 22.22 giờ đã tự bóc kiểu khỏi tệp <code>.ts</code> (<code>process.features.typescript</code> in ra <code>strip</code>), vậy giữ tsx làm gì? Thử xem:</p>
<div class="out">${OUT_NODE_STRIP}</div>
<p>Cơ chế bóc kiểu của Node chỉ xoá kiểu, <strong>không bao giờ sửa đường dẫn import</strong>. Import của ta kết thúc bằng <code>.js</code> (bắt buộc với <code>module: nodenext</code> để bản biên dịch chạy được), mà <code>src/config.js</code> chưa hề tồn tại trước khi build. Muốn chạy bằng Node trần phải import <code>./config.ts</code> cộng thêm tuỳ chọn trình biên dịch — làm được, nhưng là quyết định cho cả dự án. Trong khoá này: tsx khi phát triển, <code>tsc</code> khi build production (Chương 9).</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request tới</span><span class="lz-d">express.json() parse body (hoặc ném 400 JSON_HONG)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Router /api</span><span class="lz-d">METHOD + đường dẫn khớp đầu tiên thắng → controller</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Controller → service</span><span class="lz-d">service trả dữ liệu, hoặc ném HttpError / bug thật</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không khớp gì</span><span class="lz-d">notFound → 404 JSON</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Có gì ném lỗi</span><span class="lz-d">errorHandler: HttpError → đúng mã của nó; còn lại 500 + chi tiết chỉ trong log</span></div>
</div>

<h3>Đi làm thật: người review sẽ nói gì</h3>
<p>Trong đội outsourcing (ví dụ FPT Software), những bình luận review hay gặp nhất ở pull request Express đầu tiên của một bạn mới: "logic nghiệp vụ nằm trong controller — chuyển sang service", "chỗ này trả <code>res.status(500).send(err)</code> — em đang gửi nguyên object lỗi cho client", và "theo đúng định dạng lỗi đang có". Định dạng lỗi của đội là <em>hợp đồng</em> với frontend, có khi với cả script QA của khách hàng — đừng bao giờ tự đặt thêm định dạng thứ hai trong module của mình. Định dạng của ta là <code>{"error": {"code", "message"}}</code>; Chương 5 thêm trường <code>details</code> cho lỗi validate.</p>

${spring(false, 'Spring Boot cho bạn đúng các lớp này theo quy ước: @RestController (controller + ánh xạ route trong một lớp), @Service và @Repository; @RestControllerAdvice đóng vai errorHandler của ta. Spring mặc định không gửi header lộ framework, nhưng có kiểu lộ riêng: server.error.include-stacktrace.', [
  ['sb-4-1-restcontroller', 'Spring Boot 4.1 — @RestController và request mapping'],
  ['sb-3-2-dependency-injection', 'Spring Boot 3.2 — Dependency injection: qua constructor hay qua field'],
  ['sb-3-3-stereotype', 'Spring Boot 3.3 — Annotation phân loại, @Configuration và @Bean'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Vì sao tách controller và service?"</strong> — Service giữ luật nghiệp vụ và không biết gì về HTTP, nên dùng lại được (route, job, script) và unit test được mà không cần server. Controller chỉ là lớp phiên dịch mỏng.</li>
<li><strong>"Express biết một middleware là middleware lỗi bằng cách nào?"</strong> — Bằng số tham số: đúng bốn. Ba tham số thì bị bỏ qua khi có lỗi.</li>
<li><strong>"Handler async ném lỗi thì Express 4 và 5 khác nhau ra sao?"</strong> — Express 4: rejection không được bắt, request treo tới khi hết thời gian. Express 5: rejection được chuyển tới middleware lỗi.</li>
<li><strong>"Vì sao giấu X-Powered-By và stack trace?"</strong> — Lộ thông tin: chúng cho kẻ tấn công biết framework, cấu trúc tệp, đôi khi cả phiên bản. Đó là phòng thủ nhiều lớp, không phải cách vá lỗ hổng.</li>
<li><strong>"Vì sao handler 404 đặt sau các route?"</strong> — Middleware chạy theo thứ tự đăng ký; một cái "bắt hết" đặt trước sẽ trả lời mọi request.</li>
</ol>

<h3>🧪 Lab 2.1 (45 phút) — tái cấu trúc API của bạn</h3>
<div class="callout ok">
<ol>
<li>Tạo nhánh <code>ch2/nen-backend</code>. Tách <code>app.ts</code> của Chương 1 thành <code>routes/</code>, <code>controllers/</code>, <code>services/</code>, <code>middlewares/</code>, <code>lib/</code> như trên.</li>
<li>Thêm <code>notFound</code> và <code>errorHandler</code>; tắt <code>x-powered-by</code>.</li>
<li>Cài tạm một route async ném lỗi sau một <code>await</code>. Chạy bốn lệnh curl ở Bước 2 và so với output ở trên.</li>
<li>Xoá tham số thứ tư của <code>errorHandler</code>, chạy lại lệnh curl cuối, đọc trang HTML nhận được. Trả lại tham số. Xoá route cài tạm.</li>
<li><code>npm run check</code> đạt; commit: <code>refactor(api): tách routes/controllers/services, 404 + lỗi dạng JSON</code>.</li>
</ol>
<p><strong>Xong khi:</strong> <code>curl -si localhost:41810/api</code> không còn <code>X-Powered-By</code>; đường dẫn lạ trả 404 JSON; JSON hỏng trả 400 JSON; lỗi ném ra trả 500 JSON, body không có stack.</p>
<p><strong>Thang điểm (10):</strong> tách lớp, service không có <code>req</code>/<code>res</code> (3) · 404/400/500 đều JSON cùng một dạng (3) · hết X-Powered-By (1) · tái hiện được bẫy và giải thích trong commit hoặc ghi chú (2) · check đạt (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Các tệp ở trên chính là tệp thật của ChiaSe (tag <code>ch2</code>). Ba lỗi hay gặp nhất: (1) <code>app.use(notFound)</code> đặt trước <code>app.use('/api', apiRouter)</code> — mọi request đều 404; (2) quên <code>return</code> sau <code>res.status(...).json(...)</code> trong nhánh <code>if</code> của errorHandler, rồi gửi response lần hai → "Cannot set headers after they are sent"; (3) import <code>./routes/index</code> thiếu <code>.js</code> — <code>tsc</code> với <code>nodenext</code> báo TS2835 và đòi đuôi tệp.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">controller</span><span class="v">Lớp phiên dịch HTTP ↔ lời gọi hàm; đọc req, viết res.</span></div>
  <div class="kv"><span class="k">service</span><span class="v">Luật nghiệp vụ, không phụ thuộc HTTP.</span></div>
  <div class="kv"><span class="k">error middleware</span><span class="v">Middleware lỗi: middleware Express có 4 tham số (err, req, res, next), chạy khi có gì ném lỗi.</span></div>
  <div class="kv"><span class="k">information disclosure</span><span class="v">Lộ thông tin nội bộ (framework, đường dẫn, stack trace) cho client.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">Bóc kiểu: Node 22+ xoá kiểu TypeScript lúc nạp tệp, không biên dịch, không sửa import.</span></div>
  <div class="kv"><span class="k">HttpError</span><span class="v">Lớp lỗi của ta, mang mã HTTP và một mã ổn định cho client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>routes → controllers → services; service không bao giờ thấy req/res.</li>
<li>Một dạng lỗi <code>{"error":{"code","message"}}</code> cho 404, 400 và 500; chi tiết chỉ nằm trong log máy chủ.</li>
<li>Express 5 tự chuyển lỗi async; middleware lỗi phải giữ đủ bốn tham số.</li>
<li>Tắt X-Powered-By; middleware lỗi ba tham số làm lộ stack trace và đường dẫn tệp.</li>
<li>tsx watch khi phát triển; cơ chế bóc kiểu của Node không sửa import <code>.js</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
