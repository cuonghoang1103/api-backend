/** Node.js 5.3 — Middleware: guard có return, logger đo thời gian bằng sự kiện 'finish', tự viết express.json(), và tự viết bộ chạy chuỗi middleware. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '5.3 · Position in the file is the whole API', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s chain (logs 1, 2, 3, 4, X), on <code>express.json()</code> and on the hang. Outputs were reproduced on express@5.',
  vi: 'Các câu về chuỗi của bài (log 1, 2, 3, 4, X), về <code>express.json()</code> và về request treo. Output đã được tái hiện trên express@5.',
  cau: [
    q('c1', ['With the lesson’s file, <code>curl /notes/new</code> prints which middleware logs?', 'Với tệp của bài, <code>curl /notes/new</code> in ra log của những middleware nào?'],
      ['1. global logger, then X. after the routes', '1. global logger only', '1, 2 and X — every app.use runs for every request', 'X only, because /notes/new is declared after it'],
      ['2 is scoped to /api. X sits above the /notes/new route and nothing had responded yet, so it ran. “After the routes” is only true relative to the routes declared above it.', '2 chỉ áp cho /api. X nằm trên route /notes/new và chưa có gì phản hồi, nên nó chạy. “Sau các route” chỉ đúng với các route khai phía trên nó.']),
    q('c2', ['<code>req.body</code> is <code>undefined</code> in a POST handler. Which is NOT one of the lesson’s three causes?', '<code>req.body</code> là <code>undefined</code> trong một handler POST. Đâu KHÔNG phải một trong ba nguyên nhân của bài?'],
      ['The handler is async, and Express 5 clears req.body after the first await', 'express.json() was never registered', 'The route is registered above app.use(express.json())', 'The client did not send Content-Type: application/json'],
      ['The parser deliberately ignores other content types; and a route above the parser runs before it. In Express 5 an unparsed body is undefined, so destructuring it throws a TypeError.', 'Parser cố ý bỏ qua kiểu nội dung khác; và route nằm trên parser chạy trước nó. Trong Express 5 body chưa parse là undefined, nên destructure nó ném TypeError.']),
    q('c3', ['The default 400 for <code>{title:}</code> leaked absolute paths and a stack trace. The lesson’s fix is…', '400 mặc định cho <code>{title:}</code> lộ đường dẫn tuyệt đối và stack trace. Cách sửa của bài là…'],
      ['NODE_ENV=production on the server AND your own error handler', 'Removing express.json() from the app', 'Raising the limit to 50mb so the body parses', 'Wrapping express.json() in try/catch'],
      ['Express’s default error handler prints stacks when NODE_ENV is not production. Do both, so nothing depends on one environment variable being right (lesson 5.4).', 'Error handler mặc định của Express in stack khi NODE_ENV không phải production. Làm cả hai, để không gì phụ thuộc vào một biến môi trường được đặt đúng (bài 5.4).']),
    q('c4', ['A middleware logs, then neither calls <code>next()</code> nor sends a response. The client…', 'Một middleware ghi log, rồi không gọi <code>next()</code> cũng không gửi phản hồi. Client…'],
      ['waits until it gives up (curl exit 28) — no error, no crash, the connection stays open', 'gets 404 from the next handler in the file', 'gets 500, because Express detects the missing next()', 'gets an empty 200 when the middleware function returns'],
      ['The hardest bug to spot by reading code: a missing next() looks like nothing at all. Enough of them exhaust the connection pool.', 'Lỗi khó thấy nhất khi đọc code: thiếu next() trông như chẳng có gì. Đủ nhiều thì cạn pool kết nối.']),
    q('c5', ['Why does the timing logger measure in <code>res.on(\'finish\')</code> instead of right after <code>next()</code>?', 'Vì sao logger đo thời gian trong <code>res.on(\'finish\')</code> thay vì ngay sau <code>next()</code>?'],
      ['next() does not wait for async handlers — code after it runs before the response is sent', 'next() throws if called twice, so the logger can only use events', '"finish" is the only place where req.method is available', 'Logging after next() is forbidden by Express 5'],
      ['The EventEmitter pattern from 3.4 doing real work: the middleware does almost nothing, calls next() at once, and the measurement happens when the response really ends.', 'Mẫu EventEmitter của bài 3.4 làm việc thật: middleware gần như không làm gì, gọi next() ngay, và phép đo diễn ra khi phản hồi thật sự kết thúc.']),
  ],
  goiY: [['Read the lesson’s chain table top to bottom for each URL.', 'Đọc bảng chuỗi của bài từ trên xuống cho từng URL.'], ['A middleware has exactly three legal endings.', 'Middleware có đúng ba cách kết thúc hợp lệ.']],
  loi: [['Believing app.use(fn) “after the routes” runs only when no route matched.', 'Tưởng app.use(fn) “sau các route” chỉ chạy khi không route nào khớp.'], ['Raising the body limit to fix uploads.', 'Nâng giới hạn body để sửa upload.']],
  tns: [tn('middleware', 'hàm trung gian (req, res, next)'), tn('scoped', 'giới hạn phạm vi'), tn('hang', 'request treo')],
  kn: ['Express', 'middleware'],
});

/* ─── 2. guard ─── */
function requireAdmin(req, res, next) {
  // reject AND stop: without return the handler below would still run
  if (req.get('x-role') !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
function requireRole(...roles) {
  // a factory: returns a middleware configured with the allowed roles
  return function (req, res, next) {
    const role = req.get('x-role');
    if (!role) return res.status(401).json({ error: 'Unauthorized' });          // who are you?
    if (!roles.includes(role)) return res.status(403).json({ error: 'Forbidden' });   // you, but not allowed
    next();
  };
}
const GUARD_APP = `function appWith(...mws) { const hits = []; const app = express();
app.get('/admin/stats', ...mws, (req, res) => { hits.push('handler ran'); res.json({ users: 128 }); });
app.use((err, req, res, next) => { console.log('[error handler]', err.code || err.message); if (!res.headersSent) res.status(500).json({ error: 'Internal' }); });
return { app, hits }; }
async function hit(t, headers) { const r = await request(t.app, 'GET', '/admin/stats', { headers: headers || {} }); return { status: r.status, body: r.body, hits: t.hits.slice() }; }`;
const E2 = nodeBai({
  ten: '5.3 · Guards: requireAdmin and a requireRole factory', kho: 'EASY', phut: 12, kit: true, tep: 'guards.js',
  en: `<p>“Scoped middleware — the shape of every guard.” Write two middlewares used as <code>app.get('/admin/stats', guard, handler)</code>:</p>
<ul><li><code>requireAdmin(req, res, next)</code> — header <code>x-role</code> is not <code>admin</code> → 403 <code>{ error: "Forbidden" }</code>; otherwise <code>next()</code>;</li><li><code>requireRole(...roles)</code> — returns a middleware: no <code>x-role</code> header → 401 <code>{ error: "Unauthorized" }</code>; a role not in <code>roles</code> → 403 <code>{ error: "Forbidden" }</code>; otherwise <code>next()</code>.</li></ul><p>The grader counts whether the handler ran. A rejected request must not reach it — and must not make the server log ERR_HTTP_HEADERS_SENT.</p>`,
  vi: `<p>“Middleware giới hạn phạm vi — hình dạng của mọi guard.” Viết hai middleware dùng như <code>app.get('/admin/stats', guard, handler)</code>:</p>
<ul><li><code>requireAdmin(req, res, next)</code> — header <code>x-role</code> không phải <code>admin</code> → 403 <code>{ error: "Forbidden" }</code>; ngược lại <code>next()</code>;</li><li><code>requireRole(...roles)</code> — trả về một middleware: không có header <code>x-role</code> → 401 <code>{ error: "Unauthorized" }</code>; vai trò không nằm trong <code>roles</code> → 403 <code>{ error: "Forbidden" }</code>; ngược lại <code>next()</code>.</li></ul><p>Máy chấm đếm xem handler có chạy không. Request bị từ chối không được tới nó — và không được làm server log ERR_HTTP_HEADERS_SENT.</p>`,
  yc: [['return in front of every rejection.', 'return trước mọi lần từ chối.'], ['Read headers with req.get("x-role") (case-insensitive) or req.headers["x-role"].', 'Đọc header bằng req.get("x-role") (không phân biệt hoa thường) hoặc req.headers["x-role"].']],
  goiY: [['The lesson’s requireAdmin is three lines; copy its shape.', 'requireAdmin của bài có ba dòng; chép hình dạng của nó.'], ['A factory is a function that returns (req, res, next) => { … } — the roles live in its closure.', 'Factory là một hàm trả về (req, res, next) => { … } — roles nằm trong closure của nó.']],
  loi: [['No return before res.status(403): the handler still runs, and the second response throws ERR_HTTP_HEADERS_SENT.', 'Thiếu return trước res.status(403): handler vẫn chạy, và phản hồi thứ hai ném ERR_HTTP_HEADERS_SENT.'], ['Writing app.get(path, requireRole, handler) — passing the factory itself instead of requireRole("admin").', 'Viết app.get(path, requireRole, handler) — truyền chính factory thay vì requireRole("admin").'], ['Answering 403 when there is no role at all: that is 401 — the client has not said who it is.', 'Trả 403 khi hoàn toàn không có vai trò: đó là 401 — client chưa nói mình là ai.']],
  gt: ['Every authentication system of chapter 8 is this function with a real token check instead of a header comparison. 401 means “I do not know who you are”, 403 means “I know, and the answer is no” — the distinction lets a frontend decide between “log in” and “ask an admin”.', 'Mọi hệ thống xác thực của chương 8 là hàm này với phép kiểm token thật thay cho việc so header. 401 nghĩa là “tôi không biết bạn là ai”, 403 nghĩa là “tôi biết, và câu trả lời là không” — sự khác biệt giúp frontend chọn giữa “đăng nhập” và “xin quyền admin”.'],
  kn: ['middleware', 'authorization'], tns: [tn('guard', 'middleware chặn cửa'), tn('factory', 'hàm tạo hàm'), tn('401 vs 403', 'chưa xác thực vs không có quyền')],
  chung: GUARD_APP,
  dau: `/** 403 unless x-role is admin */
function requireAdmin(req, res, next) {
  // Write your solution here — the lesson's guard, without its return
  if (req.headers['x-role'] !== 'admin') res.status(403).json({ error: 'Forbidden' });
  next();
}
/** a guard that lets through only the given roles */
function requireRole(...roles) {
  return function (req, res, next) {
    // Write your solution here
    next();
  };
}
`,
  giai: '// Reference solution — reject with return, otherwise next()\n' + nguon(requireAdmin, requireRole),
  cases: [
    { goi: '[await hit(appWith(requireAdmin)), __log]', moTa: ['No header: 403, handler not reached, no server error', 'Không có header: 403, không tới handler, server không lỗi'] },
    { goi: 'await hit(appWith(requireAdmin), { "x-role": "admin" })', moTa: ['x-role: admin → 200 {"users":128}', 'x-role: admin → 200 {"users":128}'] },
    { goi: '[await hit(appWith(requireRole("admin", "teacher"))), await hit(appWith(requireRole("admin", "teacher")), { "X-Role": "student" }), await hit(appWith(requireRole("admin", "teacher")), { "x-role": "teacher" })]', moTa: ['requireRole: 401, 403, 200', 'requireRole: 401, 403, 200'] },
    { goi: '[await hit(appWith(requireAdmin), { "x-role": "Admin" }), await hit(appWith(requireRole("admin"), requireAdmin), { "x-role": "admin" }), __log]', an: true },
    { goi: '[await hit(appWith(requireRole()), { "x-role": "admin" }), __log]', an: true },
  ],
});

/* ─── 3. logger có thời gian thật ─── */
function requestLogger(req, res, next) {
  const t0 = Date.now();                               // the grader's clock (process.hrtime does not exist in a browser)
  res.on('finish', () => {                             // EventEmitter (3.4): fires when the response really ends
    const ms = Date.now() - t0;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();                                              // don't block the chain!
}
const LOG_APP = `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function mkApp(logger) { const app = express(); app.use(logger); app.use(express.json());
const r = express.Router();
r.get('/', async (req, res) => { await sleep(7); res.json({ items: [], page: 1 }); });
r.post('/', async (req, res) => { const { title } = req.body ?? {}; if (!title) return res.status(422).json({ error: { code: 'VALIDATION_FAILED' } }); await sleep(5); res.status(201).json({ id: 1, title }); });
r.delete('/:id', async (req, res) => { await sleep(3); res.status(204).end(); });
app.use('/api/v1/notes', r); return app; }`;
const E3 = nodeBai({
  ten: '5.3 · A request logger with real timings', kho: 'MEDIUM', phut: 15, kit: true, tep: 'logger.js',
  en: `<p>Write the lesson’s <code>requestLogger(req, res, next)</code>. It must print one line per request, <b>after the response has finished</b>:</p><pre>POST /api/v1/notes 201 5.0ms
POST /api/v1/notes 422 0.0ms
GET /api/v1/notes?page=1&amp;limit=10 200 7.0ms
DELETE /api/v1/notes/2 204 3.0ms</pre><p>Format: <code>method originalUrl statusCode ms.toFixed(1) + "ms"</code>. Measure with <code>Date.now()</code> — the grader runs on a virtual clock, and <code>process.hrtime.bigint()</code> does not exist in a browser. The routes (mounted at <code>/api/v1/notes</code>, with <code>await</code>s inside) are given; your logger is registered first.</p>`,
  vi: `<p>Viết <code>requestLogger(req, res, next)</code> của bài. Nó phải in mỗi request một dòng, <b>sau khi phản hồi đã kết thúc</b>:</p><pre>POST /api/v1/notes 201 5.0ms
POST /api/v1/notes 422 0.0ms
GET /api/v1/notes?page=1&amp;limit=10 200 7.0ms
DELETE /api/v1/notes/2 204 3.0ms</pre><p>Định dạng: <code>method originalUrl statusCode ms.toFixed(1) + "ms"</code>. Đo bằng <code>Date.now()</code> — máy chấm chạy trên đồng hồ ảo, và <code>process.hrtime.bigint()</code> không tồn tại trong trình duyệt. Các route (gắn ở <code>/api/v1/notes</code>, có <code>await</code> bên trong) đã cho sẵn; logger của bạn được đăng ký đầu tiên.</p>`,
  yc: [['Call next() immediately; do the measuring in res.on("finish").', 'Gọi next() ngay; đo trong res.on("finish").'], ['Use req.originalUrl, not req.url.', 'Dùng req.originalUrl, không phải req.url.']],
  goiY: [['const t0 = Date.now(); res.on("finish", () => { … }); next();', 'const t0 = Date.now(); res.on("finish", () => { … }); next();'], ['Inside a mounted router req.url is "/2"; originalUrl keeps the full path and the query string.', 'Bên trong router đã gắn, req.url là "/2"; originalUrl giữ đường dẫn đầy đủ và query string.']],
  loi: [['Logging right after next(): the async handler has not answered yet — status 200 and 0.0ms for everything.', 'Log ngay sau next(): handler async chưa trả lời — status 200 và 0.0ms cho mọi thứ.'], ['Forgetting next(): every request hangs (the lesson’s “hang”).', 'Quên next(): mọi request treo (đúng “hang” của bài).'], ['Logging req.url: "/2" instead of "/api/v1/notes/2".', 'Log req.url: "/2" thay vì "/api/v1/notes/2".']],
  gt: ['Registered first, the logger also sees requests that the JSON parser rejects: a broken body is logged as <code>POST /api/v1/notes 400 0.0ms</code>. This site puts its access log after the parsers — the lesson notes that such requests then never reach the log line.', 'Đăng ký đầu tiên, logger còn thấy cả những request bị parser JSON từ chối: body hỏng được log là <code>POST /api/v1/notes 400 0.0ms</code>. Trang này đặt access log sau các parser — bài lưu ý rằng khi đó những request như vậy không bao giờ tới dòng log.'],
  kn: ['middleware', 'events', 'logging'], tns: [tn('access log', 'nhật ký truy cập'), tn('originalUrl', 'URL gốc client gửi')],
  chung: LOG_APP,
  dau: `/** one log line per request, with its real duration */
function requestLogger(req, res, next) {
  // Write your solution here — this logs before the response exists
  const t0 = Date.now();
  next();
  console.log(\`\${req.method} \${req.url} \${res.statusCode} \${(Date.now() - t0).toFixed(1)}ms\`);
}
`,
  giai: '// Reference solution — measure on "finish", call next() at once\n' + nguon(requestLogger),
  cases: [
    { chuanBi: 'const app = mkApp(requestLogger);', goi: '(await request(app, "POST", "/api/v1/notes", { body: { title: "Learning Express" } }), await request(app, "POST", "/api/v1/notes", { body: { body: "no title" } }), __log)', moTa: ['201 after 5 ms, 422 at once', '201 sau 5 ms, 422 ngay lập tức'] },
    { chuanBi: 'const app = mkApp(requestLogger);', goi: '(await request(app, "GET", "/api/v1/notes?page=1&limit=10"), await request(app, "DELETE", "/api/v1/notes/2"), __log)', moTa: ['originalUrl with the query string; 204', 'originalUrl kèm query string; 204'] },
    { chuanBi: 'const app = mkApp(requestLogger);', goi: '(await request(app, "POST", "/api/v1/notes", { body: "{title:}" }), await request(app, "GET", "/nope"), __log.filter((l) => /ms$/.test(l)))', an: true },
    { chuanBi: 'const app = mkApp(requestLogger);', goi: '(await Promise.all([request(app, "GET", "/api/v1/notes"), request(app, "DELETE", "/api/v1/notes/7")]), __log)', an: true },
  ],
});

/* ─── 4. tự viết express.json() ─── */
const UTF8 = `// ── provided helper ──
function utf8Length(str) { let n = 0; for (const ch of str) { const cp = ch.codePointAt(0); n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4; } return n; }
`;
function jsonParser(opts = {}) {
  const limit = opts.limit ?? 100 * 1024;                 // express.json() default: 100kb
  return function (req, res, next) {
    const type = String(req.headers['content-type'] || '').toLowerCase();
    // not a JSON body: leave req.body undefined and let the chain continue
    if (req.rawBody === undefined || !type.startsWith('application/json')) return next();
    const fail = (status, type2, message) => next(Object.assign(new Error(message), { status, type: type2 }));
    if (utf8Length(req.rawBody) > limit) return fail(413, 'entity.too.large', 'request entity too large');
    if (req.rawBody === '') { req.body = {}; return next(); }
    // strict mode: only objects and arrays at the top level
    if (!/^\s*[{[]/.test(req.rawBody)) return fail(400, 'entity.parse.failed', 'Unexpected token: only objects and arrays are accepted');
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (err) {
      return fail(400, 'entity.parse.failed', err.message);   // the parse error goes to the error handler, not up the stack
    }
    next();
  };
}
const PARSE = `function run(mw, headers, rawBody) { const req = { headers: headers, rawBody: rawBody, body: undefined }; let out = 'not called';
mw(req, {}, (err) => { out = err ? { status: err.status, type: err.type, isError: err instanceof Error } : 'next()'; });
return { next: out, body: req.body === undefined ? 'undefined' : req.body }; }
const J = { 'content-type': 'application/json' };`;
const E4 = nodeBai({
  ten: '5.3 · Write express.json() yourself', kho: 'MEDIUM', phut: 20,
  en: `<p>Most of the lesson’s “why is req.body undefined” answers live in one middleware. Write <code>jsonParser({ limit })</code> returning <code>(req, res, next)</code>. The body has already been collected into <code>req.rawBody</code> (a string, or <code>undefined</code> when there is none). Behave like <code>express.json()</code> (measured on express@5):</p>
<ul><li>no body, or <code>Content-Type</code> not starting with <code>application/json</code> → leave <code>req.body</code> <b>undefined</b>, <code>next()</code>;</li><li>more than <code>limit</code> UTF-8 bytes (default 102400 = 100kb) → <code>next(err)</code> with <code>err.status = 413</code>, <code>err.type = "entity.too.large"</code>;</li><li>empty body → <code>req.body = {}</code>;</li><li>strict: the first non-space character must be <code>{</code> or <code>[</code>, and the JSON must parse — else <code>next(err)</code> with <code>status 400</code>, <code>type "entity.parse.failed"</code>;</li><li>otherwise <code>req.body</code> = the parsed value, <code>next()</code>.</li></ul><p>Errors are <code>Error</code> objects passed to <code>next</code> — never thrown.</p>`,
  vi: `<p>Phần lớn câu trả lời cho “vì sao req.body là undefined” của bài nằm trong một middleware. Viết <code>jsonParser({ limit })</code> trả về <code>(req, res, next)</code>. Body đã được gom vào <code>req.rawBody</code> (chuỗi, hoặc <code>undefined</code> khi không có). Cư xử như <code>express.json()</code> (đo trên express@5):</p>
<ul><li>không có body, hoặc <code>Content-Type</code> không bắt đầu bằng <code>application/json</code> → để <code>req.body</code> <b>undefined</b>, <code>next()</code>;</li><li>quá <code>limit</code> byte UTF-8 (mặc định 102400 = 100kb) → <code>next(err)</code> với <code>err.status = 413</code>, <code>err.type = "entity.too.large"</code>;</li><li>body rỗng → <code>req.body = {}</code>;</li><li>strict: ký tự khác khoảng trắng đầu tiên phải là <code>{</code> hoặc <code>[</code>, và JSON phải parse được — ngược lại <code>next(err)</code> với <code>status 400</code>, <code>type "entity.parse.failed"</code>;</li><li>còn lại <code>req.body</code> = giá trị đã parse, <code>next()</code>.</li></ul><p>Lỗi là đối tượng <code>Error</code> đưa vào <code>next</code> — không bao giờ ném ra.</p>`,
  dauVao: ['opts — { limit?: number (bytes) }; then req { headers, rawBody }', 'opts — { limit?: number (byte) }; rồi req { headers, rawBody }'], dauRa: ['a middleware: sets req.body or calls next(err)', 'một middleware: gán req.body hoặc gọi next(err)'],
  goiY: [['Order matters: type check → size check → empty → strict → parse.', 'Thứ tự quan trọng: kiểm kiểu → kiểm cỡ → rỗng → strict → parse.'], ['Object.assign(new Error(msg), { status, type }) builds the error in one line.', 'Object.assign(new Error(msg), { status, type }) dựng lỗi trong một dòng.'], ['"application/json; charset=utf-8" also counts: compare the start, lower-cased.', '"application/json; charset=utf-8" cũng tính: so phần đầu, viết thường.']],
  loi: [['throw err inside the middleware: in a real stream callback that would escape to the process.', 'throw err trong middleware: trong callback stream thật nó sẽ thoát ra tới tiến trình.'], ['Parsing every body regardless of Content-Type — a text/plain body becomes an object nobody asked for.', 'Parse mọi body bất kể Content-Type — body text/plain thành object không ai yêu cầu.'], ['Setting req.body = {} for a missing body: Express 5 leaves it undefined.', 'Gán req.body = {} khi không có body: Express 5 để nó undefined.']],
  gt: ['Each rule was compared with express@5.3: <code>"abc"</code> as a JSON body is a 400 (strict), an empty JSON body is <code>{}</code>, <code>text/plain</code> leaves body undefined, and over the limit is a 413 with <code>type: "entity.too.large"</code>. Lesson 5.4’s error handler recognises exactly these <code>type</code> values to turn them into your own error shape.', 'Mỗi luật đã được so với express@5.3: <code>"abc"</code> làm body JSON là 400 (strict), body JSON rỗng là <code>{}</code>, <code>text/plain</code> để body undefined, và quá giới hạn là 413 với <code>type: "entity.too.large"</code>. Error handler của bài 5.4 nhận ra đúng các giá trị <code>type</code> này để đổi sang dạng lỗi của riêng bạn.'],
  kn: ['middleware', 'body parsing'], tns: [tn('strict mode', 'chế độ chặt (chỉ object/mảng)'), tn('413 Payload Too Large', 'nội dung quá lớn')],
  chung: PARSE,
  dau: `${UTF8}
/** express.json(), by hand */
function jsonParser(opts = {}) {
  return function (req, res, next) {
    // Write your solution here — parses everything and throws on bad JSON
    req.body = JSON.parse(req.rawBody || '{}');
    next();
  };
}
`,
  giai: `${UTF8}
// Reference solution — the same decisions express.json() makes, errors go to next()
${nguon(jsonParser)}`,
  cases: [
    { goi: 'run(jsonParser(), J, \'{"title":"Note 1"}\')', moTa: ['A valid JSON body', 'Body JSON hợp lệ'] },
    { goi: 'run(jsonParser(), J, "{title:}")', moTa: ['Malformed → next(err) 400, not a throw', 'Hỏng → next(err) 400, không ném'] },
    { goi: '[run(jsonParser(), { "content-type": "text/plain" }, \'{"title":"x"}\'), run(jsonParser(), {}, undefined)]', moTa: ['Other type / no body → req.body undefined', 'Kiểu khác / không body → req.body undefined'] },
    { goi: '[run(jsonParser({ limit: 20 }), J, JSON.stringify({ t: "x".repeat(30) })), run(jsonParser({ limit: 20 }), J, \'{"t":"Tiếng Việt"}\')]', an: true },
    { goi: '[run(jsonParser(), J, \'"abc"\'), run(jsonParser(), J, ""), run(jsonParser(), { "content-type": "application/json; charset=utf-8" }, " [1,2]")]', an: true },
    { goi: '[run(jsonParser(), { "content-type": "Application/JSON" }, "{}"), run(jsonParser(), J, "123")]', an: true },
  ],
});

/* ─── 5. bộ chạy chuỗi middleware ─── */
function runChain(stack, req, res) {
  let i = 0;
  const matches = (layer) => {
    if (layer.type === 'route') return layer.method === req.method && layer.path === req.path;
    const p = layer.path || '/';
    return p === '/' || req.path === p || req.path.startsWith(p + '/');     // use(): a prefix at a "/" boundary
  };
  function next(err) {
    while (i < stack.length) {
      const layer = stack[i++];
      if (!matches(layer)) continue;
      const isErrorHandler = layer.fn.length === 4;    // Express counts the declared parameters
      if (err ? !isErrorHandler : isErrorHandler) continue;   // errors skip normal ones, normal flow skips error handlers
      try {
        if (err) layer.fn(err, req, res, next);
        else layer.fn(req, res, next);
      } catch (e) {
        next(e);                                       // a throw becomes next(err)
      }
      return;                                          // the layer decides what happens next
    }
    // end of the stack: what Express's final handler does
    if (res.headersSent) return;
    if (err) res.status(500).json({ error: 'Internal Server Error' });
    else res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
  }
  next();
}
const CHAIN = `function mkRes() { const r = { statusCode: 200, headersSent: false, body: null, sends: 0 };
r.status = (n) => { r.statusCode = n; return r; };
r.json = (b) => { r.sends++; if (r.headersSent) throw Object.assign(new Error('Cannot set headers after they are sent to the client'), { code: 'ERR_HTTP_HEADERS_SENT' }); r.headersSent = true; r.body = b; return r; };
return r; }
function go(stack, method, path) { const trace = []; const res = mkRes(); const req = { method, path, trace };
runChain(stack(trace), req, res); return { trace, status: res.headersSent ? res.statusCode : 'no response (hang)', body: res.body }; }
const lessonStack = (t) => [
  { type: 'use', fn: (req, res, next) => { t.push('1. global logger'); next(); } },
  { type: 'use', path: '/api', fn: (req, res, next) => { t.push('2. only for /api/*'); next(); } },
  { type: 'route', method: 'GET', path: '/api/notes', fn: (req, res, next) => { t.push('3. route-level middleware'); next(); } },
  { type: 'route', method: 'GET', path: '/api/notes', fn: (req, res) => { t.push('4. final handler'); res.json({ ok: true }); } },
  { type: 'use', fn: (req, res, next) => { t.push('X. after the routes'); next(); } },
  { type: 'route', method: 'GET', path: '/notes/new', fn: (req, res) => res.json({ handler: 'new' }) },
];`;
const E5 = nodeBai({
  ten: '5.3 · Build the chain runner Express is made of', kho: 'HARD', phut: 35,
  en: `<p>“Everything is middleware.” Write the loop that walks the chain: <code>runChain(stack, req, res)</code>, where every layer is <code>{ type: "use", path?, fn }</code> or <code>{ type: "route", method, path, fn }</code> and <code>req</code> has <code>method</code> and <code>path</code>:</p>
<ul><li>a <b>route</b> layer matches when method and path are equal; a <b>use</b> layer matches every path when it has no path (or <code>"/"</code>), else when <code>req.path</code> equals it or starts with it followed by <code>/</code> (<code>/api</code> matches <code>/api/notes</code> but not <code>/apix</code>);</li><li>call layers in order with <code>(req, res, next)</code>. A layer whose <code>fn.length === 4</code> is an <b>error handler</b>: skipped in normal flow, called with <code>(err, req, res, next)</code> after <code>next(err)</code> — which skips every normal layer in between;</li><li>a <code>throw</code> inside a layer behaves like <code>next(thatError)</code>;</li><li>past the last layer: nothing if a response was already sent; else with an error → 500 <code>{ error: "Internal Server Error" }</code>, without → 404 <code>{ error: "Cannot GET /x" }</code>;</li><li>a layer that neither responds nor calls next simply ends the chain — the request hangs, exactly like the lesson.</li></ul>`,
  vi: `<p>“Mọi thứ đều là middleware.” Viết vòng lặp đi qua chuỗi: <code>runChain(stack, req, res)</code>, mỗi layer là <code>{ type: "use", path?, fn }</code> hoặc <code>{ type: "route", method, path, fn }</code> và <code>req</code> có <code>method</code> và <code>path</code>:</p>
<ul><li>layer <b>route</b> khớp khi method và path bằng nhau; layer <b>use</b> khớp mọi đường khi không có path (hoặc <code>"/"</code>), ngược lại khi <code>req.path</code> bằng nó hoặc bắt đầu bằng nó kèm <code>/</code> (<code>/api</code> khớp <code>/api/notes</code> nhưng không khớp <code>/apix</code>);</li><li>gọi các layer theo thứ tự với <code>(req, res, next)</code>. Layer có <code>fn.length === 4</code> là <b>error handler</b>: bị bỏ qua trong luồng thường, được gọi với <code>(err, req, res, next)</code> sau <code>next(err)</code> — lệnh này bỏ qua mọi layer thường ở giữa;</li><li><code>throw</code> bên trong một layer cư xử như <code>next(lỗiĐó)</code>;</li><li>qua layer cuối: không làm gì nếu đã có phản hồi; ngược lại có lỗi → 500 <code>{ error: "Internal Server Error" }</code>, không lỗi → 404 <code>{ error: "Cannot GET /x" }</code>;</li><li>layer không phản hồi cũng không gọi next thì chuỗi dừng — request treo, đúng như bài.</li></ul>`,
  dauVao: ['stack — layers in file order; req { method, path }; res { status, json, headersSent }', 'stack — các layer theo thứ tự tệp; req { method, path }; res { status, json, headersSent }'], dauRa: ['nothing — the result is what happened to res', 'không trả gì — kết quả là những gì xảy ra với res'],
  goiY: [['Keep an index i outside next(); each call to next(err) resumes the search from there.', 'Giữ chỉ số i bên ngoài next(); mỗi lần gọi next(err) tiếp tục tìm từ đó.'], ['Inside next: skip layers that do not match, and skip by kind: err ? !isErrorHandler : isErrorHandler.', 'Trong next: bỏ layer không khớp, và bỏ theo loại: err ? !isErrorHandler : isErrorHandler.'], ['After calling one layer, return — that layer decides whether the chain continues.', 'Sau khi gọi một layer thì return — layer đó quyết định chuỗi có đi tiếp không.']],
  loi: [['Looping over every layer automatically: a guard that responded 403 would not stop the chain.', 'Tự động lặp qua mọi layer: guard đã trả 403 cũng không chặn được chuỗi.'], ['Calling error handlers in normal flow (or normal layers after an error).', 'Gọi error handler trong luồng thường (hoặc layer thường sau khi có lỗi).'], ['Prefix matching with startsWith(p) only: "/apix" matches "/api".', 'So tiền tố chỉ bằng startsWith(p): "/apix" khớp "/api".']],
  gt: ['This is the core of Express’s router in twenty lines: an index, a matcher, and a <code>next</code> that resumes the search. Every behaviour of the lesson falls out of it — the 1-2-3-4 order, X running for /notes/new, the hang, the jump to the error handler — and the lesson’s own traces (1-2-3-4 for /api/notes, 1-X for /notes/new) were reproduced with the same stack on express@5.', 'Đây là lõi router của Express trong hai mươi dòng: một chỉ số, một hàm khớp, và một <code>next</code> tiếp tục cuộc tìm. Mọi hành vi của bài đều rơi ra từ đó — thứ tự 1-2-3-4, X chạy cho /notes/new, request treo, cú nhảy tới error handler — và chính các trace của bài (1-2-3-4 cho /api/notes, 1-X cho /notes/new) đã được tái hiện với cùng stack trên express@5.'],
  kn: ['middleware', 'Express internals'], tns: [tn('dispatcher', 'bộ điều phối'), tn('layer', 'một tầng trong stack'), tn('arity', 'số tham số khai báo (fn.length)')],
  chung: CHAIN,
  dau: `/** walk the middleware stack like Express does */
function runChain(stack, req, res) {
  // Write your solution here — this calls every matching layer, whatever happens
  for (const layer of stack) {
    const ok = layer.type === 'route' ? layer.method === req.method && layer.path === req.path : (!layer.path || req.path.startsWith(layer.path));
    if (ok) layer.fn(req, res, () => {});
  }
}
`,
  giai: '// Reference solution — an index, a matcher, and a next() that resumes the search\n' + nguon(runChain),
  cases: [
    { goi: 'go(lessonStack, "GET", "/api/notes")', moTa: ['The lesson’s GET /api/notes: 1, 2, 3, 4 and X never runs', 'GET /api/notes của bài: 1, 2, 3, 4 và X không chạy'] },
    { goi: 'go(lessonStack, "GET", "/notes/new")', moTa: ['GET /notes/new: 1 and X, then the route', 'GET /notes/new: 1 và X, rồi tới route'] },
    { goi: 'go((t) => [{ type: "use", fn: (req, res, next) => { t.push("guard"); return res.status(403).json({ error: "Forbidden" }); } }, { type: "route", method: "GET", path: "/admin", fn: (req, res) => { t.push("handler"); res.json({}); } }], "GET", "/admin")', moTa: ['A guard that responds stops the chain', 'Guard đã phản hồi thì chuỗi dừng'] },
    { goi: '[go(lessonStack, "GET", "/zzz"), go(lessonStack, "GET", "/apix")]', an: true },
    { goi: 'go((t) => [{ type: "use", fn: (req, res, next) => { t.push("a"); next(new Error("boom")); } }, { type: "use", fn: (req, res, next) => { t.push("skipped"); next(); } }, { type: "use", fn: (err, req, res, next) => { t.push("eh: " + err.message); res.status(422).json({ error: err.message }); } }], "GET", "/x")', an: true },
    { goi: 'go((t) => [{ type: "route", method: "GET", path: "/t", fn: (req, res) => { t.push("throws"); throw new Error("sync"); } }, { type: "use", fn: (err, req, res, next) => { t.push("eh1"); next(err); } }, { type: "use", fn: (req, res, next) => { t.push("normal, skipped"); next(); } }, { type: "use", fn: (err, req, res, next) => { t.push("eh2"); next(err); } }], "GET", "/t")', an: true },
    { goi: '[go((t) => [{ type: "use", path: "/hang", fn: (req, res, next) => { t.push("middleware ran, but never calls next()"); } }, { type: "route", method: "GET", path: "/hang", fn: (req, res) => res.json({ reached: true }) }], "GET", "/hang"), go((t) => [{ type: "use", fn: (err, req, res, next) => { t.push("eh in normal flow?"); } }, { type: "route", method: "POST", path: "/n", fn: (req, res) => { t.push("post"); res.status(201).json({}); } }], "POST", "/n")]', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-3-middleware', ten: '5.3 Middleware: the chain every request walks', khoa: KHOA, baiHoc: 'nodejs-5-3-middleware', de: [E1, E2, E3, E4, E5] });
