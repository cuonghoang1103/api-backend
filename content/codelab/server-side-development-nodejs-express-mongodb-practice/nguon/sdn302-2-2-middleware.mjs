/** SDN302 · 2.2 — Middleware: (req, res, next), thứ tự, 4 loại, logger, middleware bảo vệ, error handler 4 tham số, bọc async (Express 4). */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;

/* ── 1 ── order */
const E1 = cs({
  ten: 'Put the middleware chain in the right order', kho: 'EASY', phut: 8, loai: 'order',
  en: 'Middleware runs top to bottom. Arrange the lines of <code>app.js</code>, then the steps one request goes through.',
  vi: 'Middleware chạy từ trên xuống. Sắp lại các dòng của <code>app.js</code>, rồi các bước một request đi qua.',
  cau: [
    ord('o1', ['Arrange the lines of app.js so every middleware actually does its job.', 'Sắp các dòng của app.js để mọi middleware thật sự làm được việc của nó.'],
      ['<code>const app = express();</code>', '<code>app.use(express.json());</code>', '<code>app.use(cors({ origin: \'https://myapp.com\' }));</code>', '<code>app.use(logger);</code>', '<code>app.use(\'/api/products\', productRouter);</code>', '<code>app.use(notFound);</code>  // (req, res) ⇒ 404 JSON', '<code>app.use((err, req, res, next) => { … });</code>  // error handler'],
      ['Parsers and CORS before the routes (a parser after the route that needs the body silently does nothing); the 404 catch-all after every route; the error handler LAST, after the 404 handler, so it also receives errors forwarded by everything above it. (json/cors/logger can swap places among themselves — this order is the lesson\'s.)', 'Bộ đọc body và CORS trước route (bộ đọc đặt sau route cần body thì lặng lẽ vô dụng); bắt-404 sau mọi route; error handler CUỐI CÙNG, sau cả 404, để nhận được lỗi mọi thứ phía trên chuyển xuống. (json/cors/logger đổi chỗ cho nhau được — đây là thứ tự của bài.)']),
    ord('o2', ['<code>app.get(\'/api/me\', requireAuth, (req, res) => res.json(req.user))</code> with a global logger. A request WITH a valid token: in which order do things happen?', '<code>app.get(\'/api/me\', requireAuth, (req, res) => res.json(req.user))</code> có logger toàn cục. Một request CÓ token hợp lệ: các việc xảy ra theo thứ tự nào?'],
      ['logger prints <code>GET /api/me</code> and calls <code>next()</code>', '<code>requireAuth</code> verifies the token and sets <code>req.user</code>', '<code>requireAuth</code> calls <code>next()</code>', 'the route handler runs <code>res.json(req.user)</code>', 'the response leaves the server'],
      ['Each function hands control to the next one with <code>next()</code>; the handler is simply the last function in the chain. Without a token, <code>requireAuth</code> would answer 401 and never call <code>next()</code> — the handler would not run.', 'Mỗi hàm trao quyền cho hàm sau bằng <code>next()</code>; handler đơn giản là hàm cuối của chuỗi. Không có token, <code>requireAuth</code> trả 401 và không gọi <code>next()</code> — handler không chạy.']),
  ],
  goiY: [['Ask: does this line need something that an earlier line prepares?', 'Hỏi: dòng này có cần thứ mà một dòng trước chuẩn bị không?'], ['The error handler catches what comes from ABOVE it.', 'Error handler bắt những gì đến từ PHÍA TRÊN nó.']],
  loi: [['Putting the error handler before the routes.', 'Đặt error handler trước các route.'], ['Putting express.json() after the router.', 'Đặt express.json() sau router.']],
  tns: [tn('middleware chain', 'chuỗi middleware'), tn('next()', 'chuyển tiếp', 'trao quyền cho hàm kế tiếp')],
  kn: ['middleware order'],
});

/* ── 2 ── choice */
const E2 = cs({
  ten: 'The four kinds of middleware and the arity trap', kho: 'EASY', phut: 8,
  en: 'Questions on the kinds of middleware, <code>next()</code>, and how Express recognises an error handler.',
  vi: 'Câu hỏi về các loại middleware, <code>next()</code>, và cách Express nhận ra error handler.',
  cau: [
    q('k1', ['How does Express know that a function is an ERROR-handling middleware?', 'Express biết một hàm là middleware XỬ LÝ LỖI bằng cách nào?'],
      ['It declares four parameters: <code>(err, req, res, next)</code>', 'It is registered with <code>app.error()</code>', 'Its name ends with <code>Handler</code>', 'It is the last <code>app.use</code> in the file'],
      ['Express checks <code>fn.length === 4</code>. Drop <code>err</code> and it becomes a normal middleware that never sees errors.', 'Express kiểm <code>fn.length === 4</code>. Bỏ <code>err</code> là nó thành middleware thường, không bao giờ thấy lỗi.']),
    q('k2', ['A custom middleware logs the request and forgets to call <code>next()</code>. What does the client see?', 'Một middleware tự viết in request rồi quên gọi <code>next()</code>. Client thấy gì?'],
      ['Nothing — the request hangs until the client times out', 'A 404, because no route was reached', 'A 500 from the default error handler', 'The route runs anyway after the middleware returns'],
      ['A middleware must either end the response or call <code>next()</code>. Doing neither leaves the request open forever.', 'Middleware phải hoặc kết thúc response hoặc gọi <code>next()</code>. Không làm gì cả là request treo mãi.']),
    qn('k3', ['Match the examples to "third-party middleware". (choose all)', 'Chọn các ví dụ là "middleware bên thứ ba". (chọn hết)'],
      ['<code>cors()</code>', '<code>morgan(\'dev\')</code>', '<code>helmet()</code>', '<code>express.json()</code>', '<code>(req, res, next) => { console.log(req.url); next(); }</code>'],
      [0, 1, 2],
      ['<code>express.json()</code> and <code>express.static()</code> are built-in; the arrow function is custom; cors, morgan and helmet are npm packages.', '<code>express.json()</code> và <code>express.static()</code> là có sẵn; hàm mũi tên là tự viết; cors, morgan, helmet là gói npm.']),
    q('k4', ['Express 4: <code>app.get(\'/x\', async (req, res) => { throw new Error(\'db down\'); })</code>. What happens?', 'Express 4: <code>app.get(\'/x\', async (req, res) => { throw new Error(\'db down\'); })</code>. Chuyện gì xảy ra?'],
      ['The rejected promise is not caught — the error handler never runs and the request hangs', 'Express catches it and calls the error handler with the error', 'The process crashes immediately with exit code 1', 'Express answers 500 with the stack trace'],
      ['Express 4 ignores the promise an async handler returns. Forward errors with <code>next(err)</code> or a <code>wrap</code> helper. (Express 5 does forward rejected promises.)', 'Express 4 bỏ qua promise mà handler async trả về. Chuyển lỗi bằng <code>next(err)</code> hoặc hàm bọc <code>wrap</code>. (Express 5 thì có chuyển promise bị reject.)']),
    q('k5', ['Why <code>return res.status(401).json(…)</code> instead of just <code>res.status(401).json(…)</code> inside a guard?', 'Vì sao viết <code>return res.status(401).json(…)</code> thay vì chỉ <code>res.status(401).json(…)</code> trong một lệnh chặn?'],
      ['Without <code>return</code> the code below still runs and may call <code>next()</code> or send a second response', 'Express needs the return value to set the status code', '<code>return</code> makes the response faster', 'Without <code>return</code> the body is not serialised'],
      ['A second send throws <code>Cannot set headers after they are sent to the client</code>.', 'Gửi lần hai ném <code>Cannot set headers after they are sent to the client</code>.']),
  ],
  goiY: [['Count the parameters.', 'Đếm tham số.'], ['A middleware has two exits: send, or next().', 'Middleware có hai lối ra: gửi, hoặc next().']],
  loi: [['Thinking Express 4 catches async errors.', 'Tưởng Express 4 bắt lỗi async.'], ['Calling express.json() third-party.', 'Gọi express.json() là bên thứ ba.']],
  tns: [tn('arity', 'số tham số', 'fn.length'), tn('built-in middleware', 'middleware có sẵn')],
  kn: ['middleware kinds'],
});

/* ── 3 ── logger */
const E3 = bai({
  ten: 'A request logger with timing (res.on("finish"))', kho: 'MEDIUM', phut: 15, lib: ['express'],
  en: J`<p>Write the custom middleware <code>logger(req, res, next)</code> from the lesson, then make it useful: one line per request, printed <b>when the response is finished</b>, in the format</p>
<pre>GET /api/notes 200 15ms</pre>
<p>i.e. <code>method</code>, <code>req.originalUrl</code>, <code>res.statusCode</code> and the elapsed milliseconds measured with <code>Date.now()</code>. Register it with <code>app.use(logger)</code> before the routes. The app (two routes) is given.</p>`,
  vi: J`<p>Viết middleware tự viết <code>logger(req, res, next)</code> của bài, rồi làm cho nó hữu ích: mỗi request một dòng, in <b>khi response đã xong</b>, theo dạng</p>
<pre>GET /api/notes 200 15ms</pre>
<p>tức <code>method</code>, <code>req.originalUrl</code>, <code>res.statusCode</code> và số mili-giây đo bằng <code>Date.now()</code>. Đăng ký bằng <code>app.use(logger)</code> trước các route. App (hai route) cho sẵn.</p>`,
  yc: [
    ['Record <code>const start = Date.now()</code> when the middleware runs.', 'Ghi <code>const start = Date.now()</code> khi middleware chạy.'],
    ['Print inside <code>res.on(\'finish\', () => { … })</code> — at that moment <code>res.statusCode</code> is the real one.', 'In trong <code>res.on(\'finish\', () => { … })</code> — lúc đó <code>res.statusCode</code> mới là mã thật.'],
    ['Use <code>req.originalUrl</code> (the full URL), not <code>req.url</code> (shortened inside routers).', 'Dùng <code>req.originalUrl</code> (URL đầy đủ), không dùng <code>req.url</code> (bị rút ngắn trong router).'],
    ['Always call <code>next()</code>.', 'Luôn gọi <code>next()</code>.'],
  ],
  viDu: [['GET /api/notes (the route waits 15 ms)', 'console: GET /api/notes 200 15ms', 'Printed after the response, with the real status.', 'In sau khi trả lời, với mã thật.'], ['GET /api/nope', 'console: GET /api/nope 404 0ms', 'Even a 404 is logged.', 'Cả 404 cũng được ghi.']],
  goiY: [
    ['The lesson version prints too early: at the start of the request <code>res.statusCode</code> is still 200 for everything.', 'Bản của bài in quá sớm: lúc request mới đến, <code>res.statusCode</code> vẫn là 200 với mọi thứ.'],
    ['<code>res.on(\'finish\', () => console.log(´@{req.method} @{req.originalUrl} @{res.statusCode} @{Date.now() - start}ms´));</code>', '<code>res.on(\'finish\', () => console.log(´@{req.method} @{req.originalUrl} @{res.statusCode} @{Date.now() - start}ms´));</code>'],
  ],
  loi: [
    ['Forgetting <code>next()</code>: every request hangs and nothing is printed.', 'Quên <code>next()</code>: mọi request treo và không in gì.'],
    ['Logging before the route runs, so a 404 is printed as 200.', 'In trước khi route chạy nên 404 bị in thành 200.'],
    ['Registering the logger AFTER the routes: routes that answer never call next(), so the logger never runs for them.', 'Đăng ký logger SAU route: route đã trả lời thì không gọi next(), nên logger không bao giờ chạy với chúng.'],
  ],
  gt: [
    'A middleware runs on the way IN, but the status code is decided later by the route. Subscribing to the response\'s <code>finish</code> event lets one middleware see both ends of the request — this is exactly how morgan works. <code>Date.now()</code> difference gives the time the server spent, including the 15 ms the route waited.',
    'Middleware chạy ở chiều ĐI VÀO, còn mã trạng thái do route quyết sau. Đăng ký sự kiện <code>finish</code> của response giúp một middleware thấy cả hai đầu của request — đúng cách morgan làm. Hiệu <code>Date.now()</code> cho thời gian server đã dùng, gồm cả 15 ms route chờ.',
  ],
  kn: ['custom middleware', 'res.on finish'],
  tns: [tn('finish event', 'sự kiện finish', 'phát khi response đã gửi xong'), tn('originalUrl', 'URL gốc', 'không bị router cắt bớt')],
  dau: J`const express = require('express');
const app = express();

function logger(req, res, next) {
  console.log(´@{req.method} @{req.url} @{res.statusCode}´);
}

app.use(logger);

const router = express.Router();
router.get('/', async (req, res) => {
  await new Promise((r) => setTimeout(r, 15));   // pretend to read the database
  res.json([{ id: 1, title: 'Learn middleware' }]);
});
app.use('/api/notes', router);

module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();

function logger(req, res, next) {
  const start = Date.now();                       // when the request arrived
  res.on('finish', () => {                        // runs once the response has been sent
    const ms = Date.now() - start;
    console.log(´@{req.method} @{req.originalUrl} @{res.statusCode} @{ms}ms´);
  });
  next();                                         // never forget: hand control to the next function
}

app.use(logger);                                  // BEFORE the routes, or answered requests skip it

const router = express.Router();
router.get('/', async (req, res) => {
  await new Promise((r) => setTimeout(r, 15));   // pretend to read the database
  res.json([{ id: 1, title: 'Learn middleware' }]);
});
app.use('/api/notes', router);

module.exports = app;
`,
  cases: [
    { goi: `(await module.exports.inject({ url: '/api/notes' }), __log)`, moTa: ['GET /api/notes → one line with 200 and 15ms', 'GET /api/notes → một dòng có 200 và 15ms'] },
    { goi: `(await module.exports.inject({ url: '/api/nope' }), __log)`, moTa: ['A 404 is logged with 404', '404 được ghi đúng 404'] },
    { goi: `(await module.exports.inject({ url: '/api/notes' })).status`, moTa: ['The request is not blocked by the logger', 'Logger không chặn request'] },
    { goi: `(await module.exports.inject({ url: '/api/notes?page=2' }), await module.exports.inject({ method: 'POST', url: '/api/notes' }), __log)`, an: true },
  ],
});

/* ── 4 ── guard */
const E4 = bai({
  ten: 'A guard middleware, scoped to one router', kho: 'MEDIUM', phut: 15, lib: ['express'],
  en: J`<p>The admin routes must only answer clients that send the right API key. Write <code>requireApiKey(req, res, next)</code>:</p>
<ul><li>no <code>x-api-key</code> header ⇒ <code>401</code> <code>{ error: "API key required" }</code>;</li>
<li>a key different from <code>process.env.API_KEY</code> ⇒ <code>401</code> <code>{ error: "Invalid API key" }</code>;</li>
<li>the right key ⇒ set <code>req.client = 'admin'</code> and call <code>next()</code>.</li></ul>
<p>Then protect ONLY the admin router: <code>app.use('/api/admin', requireApiKey, adminRouter)</code>. <code>/api/public</code> stays open.</p>`,
  vi: J`<p>Các route admin chỉ được trả lời client gửi đúng API key. Viết <code>requireApiKey(req, res, next)</code>:</p>
<ul><li>không có header <code>x-api-key</code> ⇒ <code>401</code> <code>{ error: "API key required" }</code>;</li>
<li>key khác <code>process.env.API_KEY</code> ⇒ <code>401</code> <code>{ error: "Invalid API key" }</code>;</li>
<li>đúng key ⇒ đặt <code>req.client = 'admin'</code> và gọi <code>next()</code>.</li></ul>
<p>Rồi chỉ bảo vệ router admin: <code>app.use('/api/admin', requireApiKey, adminRouter)</code>. <code>/api/public</code> vẫn mở.</p>`,
  yc: [
    ['Read the header with <code>req.get(\'x-api-key\')</code> (header names are case-insensitive).', 'Đọc header bằng <code>req.get(\'x-api-key\')</code> (tên header không phân biệt hoa thường).'],
    ['Read the expected key from <code>process.env.API_KEY</code> at request time — never hard-code it.', 'Đọc key đúng từ <code>process.env.API_KEY</code> lúc có request — không bao giờ viết cứng.'],
    ['<code>return</code> after each 401 so <code>next()</code> is not called too.', '<code>return</code> sau mỗi 401 để không gọi thêm <code>next()</code>.'],
    ['Export both: <code>module.exports = { app, requireApiKey };</code>', 'Export cả hai: <code>module.exports = { app, requireApiKey };</code>'],
  ],
  viDu: [['GET /api/admin/stats  (x-api-key: s3cret)', '200 {"client":"admin","users":42}', 'The guard set req.client.', 'Lệnh chặn đã đặt req.client.'], ['GET /api/public/hello  (no key)', '200 {"hello":"world"}', 'The public router is not guarded.', 'Router public không bị chặn.']],
  goiY: [
    ['<code>const key = req.get(\'x-api-key\'); if (!key) return res.status(401).json({ error: \'API key required\' });</code>', '<code>const key = req.get(\'x-api-key\'); if (!key) return res.status(401).json({ error: \'API key required\' });</code>'],
    ['Middleware listed in <code>app.use(path, mw, router)</code> only runs for URLs under that path.', 'Middleware liệt kê trong <code>app.use(path, mw, router)</code> chỉ chạy cho URL dưới đường đó.'],
  ],
  loi: [
    ['<code>app.use(requireApiKey)</code> globally: the public routes are locked too.', '<code>app.use(requireApiKey)</code> toàn cục: route public cũng bị khoá.'],
    ['Missing <code>return</code>: the 401 is sent, then <code>next()</code> runs the route, which tries to send a second response.', 'Thiếu <code>return</code>: gửi 401 xong, <code>next()</code> lại chạy route, route cố gửi response thứ hai.'],
    ['Comparing with a key typed in the code: it ends up in Git and in every copy of the project.', 'So với key gõ thẳng trong mã: nó vào Git và vào mọi bản sao dự án.'],
  ],
  gt: [
    'A guard is a middleware with two exits: answer 401 (and stop), or enrich the request and call <code>next()</code>. Mounting it between the path and the router scopes it to that router only — the same shape the Node.js course calls "scoped middleware", and the same shape <code>requireAuth</code> takes with JWT in Chapter 5.',
    'Lệnh chặn là middleware có hai lối ra: trả 401 (và dừng), hoặc bổ sung request rồi gọi <code>next()</code>. Gắn nó giữa đường dẫn và router là giới hạn nó cho đúng router đó — cùng hình dạng mà khoá Node.js gọi là "middleware theo phạm vi", và cũng là hình dạng của <code>requireAuth</code> với JWT ở Chương 5.',
  ],
  kn: ['guard middleware', 'process.env'],
  tns: [tn('guard', 'lệnh chặn', 'middleware quyết định cho đi tiếp hay không'), tn('scoped middleware', 'middleware theo phạm vi')],
  dau: J`const express = require('express');
const app = express();

function requireApiKey(req, res, next) {
  if (req.headers['x-api-key'] !== 's3cret') {
    res.status(401).json({ error: 'Invalid API key' });
  }
  next();
}

const adminRouter = express.Router();
adminRouter.get('/stats', (req, res) => res.json({ client: req.client, users: 42 }));

const publicRouter = express.Router();
publicRouter.get('/hello', (req, res) => res.json({ hello: 'world' }));

app.use(requireApiKey);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);

module.exports = { app, requireApiKey };
`,
  giai: J`const express = require('express');
const app = express();

// guard: answer 401 and STOP, or enrich req and call next()
function requireApiKey(req, res, next) {
  const key = req.get('x-api-key');                       // header names are case-insensitive
  if (!key) return res.status(401).json({ error: 'API key required' });
  if (key !== process.env.API_KEY) {                      // the secret lives in the environment
    return res.status(401).json({ error: 'Invalid API key' });
  }
  req.client = 'admin';                                   // later handlers can read it
  next();
}

const adminRouter = express.Router();
adminRouter.get('/stats', (req, res) => res.json({ client: req.client, users: 42 }));

const publicRouter = express.Router();
publicRouter.get('/hello', (req, res) => res.json({ hello: 'world' }));

app.use('/api/admin', requireApiKey, adminRouter);        // scoped: only /api/admin/* is guarded
app.use('/api/public', publicRouter);

module.exports = { app, requireApiKey };
`,
  chuanBi: `process.env.API_KEY = 's3cret'; const { app, requireApiKey } = module.exports;`,
  cases: [
    { goi: `__pick(await __goi(requireApiKey, { headers: {} }), 'status body next')`, moTa: ['No key → 401 API key required, next not called', 'Không có key → 401 API key required, không gọi next'] },
    { goi: `__pick(await __goi(requireApiKey, { headers: { 'X-API-Key': 'nope' } }), 'status body next')`, moTa: ['Wrong key → 401 Invalid API key', 'Sai key → 401 Invalid API key'] },
    { goi: `__res(await app.inject({ url: '/api/admin/stats', headers: { 'x-api-key': 's3cret' } }))`, moTa: ['Right key → the admin route answers with client "admin"', 'Đúng key → route admin trả lời với client "admin"'] },
    { goi: `__res(await app.inject({ url: '/api/public/hello' }))`, moTa: ['/api/public is not guarded', '/api/public không bị chặn'] },
    { goi: `(process.env.API_KEY = 'rotated-key', [__res(await app.inject({ url: '/api/admin/stats', headers: { 'x-api-key': 's3cret' } })), __res(await app.inject({ url: '/api/admin/stats', headers: { 'x-api-key': 'rotated-key' } }))])`, an: true, moTa: ['The key is read from process.env, not hard-coded', 'Key đọc từ process.env, không viết cứng'] },
    { goi: `__pick(await __goi(requireApiKey, { headers: { 'x-api-key': 's3cret' } }), 'status next')`, an: true },
    { goi: `__res(await app.inject({ url: '/api/admin/stats' }))`, an: true },
  ],
});

/* ── 5 ── error handling */
const E5 = bai({
  ten: 'Central error handling: a JSON 404 and a 4-argument error handler', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Replace Express's HTML error pages with one consistent JSON shape <code>{ "error": "…" }</code>. Write two middleware and register them <b>after</b> all routes:</p>
<ol><li><code>notFound(req, res)</code> — <code>404</code> <code>{ error: "Not found: GET /api/nope" }</code> (method + <code>originalUrl</code> without the query string);</li>
<li><code>errorHandler(err, req, res, next)</code>:
<ul><li>invalid JSON body (<code>err.type === 'entity.parse.failed'</code>) ⇒ <code>400</code> <code>{ error: "Invalid JSON body" }</code>;</li>
<li>an error carrying <code>err.status</code> between 400 and 499 ⇒ that status and <code>err.message</code>;</li>
<li>anything else ⇒ <code>500</code> <code>{ error: "Internal Server Error" }</code> — never leak the real message of an unexpected error to the client; <code>console.error</code> it instead.</li></ul></li></ol>`,
  vi: J`<p>Thay các trang lỗi HTML của Express bằng một dạng JSON thống nhất <code>{ "error": "…" }</code>. Viết hai middleware và đăng ký <b>sau</b> mọi route:</p>
<ol><li><code>notFound(req, res)</code> — <code>404</code> <code>{ error: "Not found: GET /api/nope" }</code> (method + <code>originalUrl</code> bỏ query string);</li>
<li><code>errorHandler(err, req, res, next)</code>:
<ul><li>body JSON hỏng (<code>err.type === 'entity.parse.failed'</code>) ⇒ <code>400</code> <code>{ error: "Invalid JSON body" }</code>;</li>
<li>lỗi mang <code>err.status</code> từ 400 tới 499 ⇒ đúng mã đó và <code>err.message</code>;</li>
<li>mọi thứ khác ⇒ <code>500</code> <code>{ error: "Internal Server Error" }</code> — không bao giờ lộ thông báo thật của lỗi bất ngờ cho client; <code>console.error</code> nó thay vào đó.</li></ul></li></ol>`,
  yc: [
    ['<code>errorHandler</code> MUST declare four parameters, even if you do not use <code>next</code>.', '<code>errorHandler</code> PHẢI khai đủ bốn tham số, dù không dùng <code>next</code>.'],
    ['Order: routes → <code>app.use(notFound)</code> → <code>app.use(errorHandler)</code>.', 'Thứ tự: route → <code>app.use(notFound)</code> → <code>app.use(errorHandler)</code>.'],
    ['Export <code>module.exports = { app, notFound, errorHandler };</code>', 'Export <code>module.exports = { app, notFound, errorHandler };</code>'],
  ],
  viDu: [['GET /api/nope?x=1', '404 {"error":"Not found: GET /api/nope"}', 'No route matched; the query string is dropped.', 'Không route nào khớp; bỏ query string.'], ['GET /api/crash', '500 {"error":"Internal Server Error"}', 'The real message (a database password in the connection error!) stays in the server log.', 'Thông báo thật (có mật khẩu CSDL trong lỗi kết nối!) chỉ nằm trong log server.']],
  goiY: [
    ['<code>const path = req.originalUrl.split(\'?\')[0];</code>', '<code>const path = req.originalUrl.split(\'?\')[0];</code>'],
    ['<code>if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.message });</code>', '<code>if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.message });</code>'],
    ['Check <code>err.type === \'entity.parse.failed\'</code> before the generic 4xx rule (that error also has status 400, but its message is a parser message).', 'Kiểm <code>err.type === \'entity.parse.failed\'</code> trước luật 4xx chung (lỗi đó cũng có status 400, nhưng thông báo là của bộ đọc).'],
  ],
  loi: [
    ['<code>app.use((req, res, next, err) => …)</code> or three parameters: Express does not treat it as an error handler.', '<code>app.use((req, res, next, err) => …)</code> hoặc ba tham số: Express không coi nó là error handler.'],
    ['Sending <code>err.message</code> for every error: a crash message such as <code>connect ECONNREFUSED mongodb://admin:pass@…</code> reaches the browser.', 'Gửi <code>err.message</code> cho mọi lỗi: thông báo sập như <code>connect ECONNREFUSED mongodb://admin:pass@…</code> tới tận trình duyệt.'],
    ['Registering <code>notFound</code> before the routes: everything becomes a 404.', 'Đăng ký <code>notFound</code> trước route: mọi thứ thành 404.'],
  ],
  gt: [
    'Unknown URLs fall through every route and land in <code>notFound</code>; errors skip normal middleware and land in the only function with four parameters. Splitting "expected" errors (4xx, which carry a message meant for the client) from unexpected ones (500, whose message is for you) gives the React front-end one envelope to handle and keeps internals out of responses — the "consistent error shape" of lesson 4.1.',
    'URL lạ rơi qua mọi route và vào <code>notFound</code>; lỗi bỏ qua middleware thường và vào hàm duy nhất có bốn tham số. Tách lỗi "dự kiến" (4xx, mang thông báo dành cho client) khỏi lỗi bất ngờ (500, thông báo dành cho bạn) cho front-end React một vỏ duy nhất để xử lý và giữ nội tình ngoài response — "dạng lỗi thống nhất" của bài 4.1.',
  ],
  kn: ['error handler', '404 handler'],
  tns: [tn('error-handling middleware', 'middleware xử lý lỗi', '(err, req, res, next)'), tn('leak', 'rò rỉ', 'để lộ thông tin nội bộ')],
  dau: J`const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/notes', (req, res) => res.status(201).json({ title: req.body.title }));
app.get('/api/notes/:id', (req, res, next) => {
  if (req.params.id !== '1') { const e = new Error('Note not found'); e.status = 404; return next(e); }
  res.json({ id: 1, title: 'Hello' });
});
app.get('/api/crash', (req, res) => { throw new Error('connect ECONNREFUSED mongodb://admin:pass@db:27017'); });

function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res) {
  res.status(err.status || 500).json({ error: err.message });
}

app.use(errorHandler);
app.use(notFound);

module.exports = { app, notFound, errorHandler };
`,
  giai: J`const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/notes', (req, res) => res.status(201).json({ title: req.body.title }));
app.get('/api/notes/:id', (req, res, next) => {
  if (req.params.id !== '1') { const e = new Error('Note not found'); e.status = 404; return next(e); }
  res.json({ id: 1, title: 'Hello' });
});
app.get('/api/crash', (req, res) => { throw new Error('connect ECONNREFUSED mongodb://admin:pass@db:27017'); });

// 1) nothing matched: a JSON 404 instead of Express's HTML page
function notFound(req, res) {
  const path = req.originalUrl.split('?')[0];
  res.status(404).json({ error: ´Not found: @{req.method} @{path}´ });
}

// 2) FOUR parameters — that is how Express recognises an error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {                        // express.json() could not parse
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (err.status >= 400 && err.status < 500) {                     // expected: the message is for the client
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);                                              // unexpected: the details are for YOU
  res.status(500).json({ error: 'Internal Server Error' });
}

app.use(notFound);        // after every route
app.use(errorHandler);    // LAST
module.exports = { app, notFound, errorHandler };
`,
  chuanBi: `const { app } = module.exports; const go = async (o) => __res(await app.inject(o));`,
  cases: [
    { goi: `await go({ url: '/api/nope?x=1' })`, moTa: ['Unknown URL → JSON 404 with method and path', 'URL lạ → 404 JSON có method và đường dẫn'] },
    { goi: `await go({ url: '/api/notes/7' })`, moTa: ['next(err) with status 404 → 404 + its message', 'next(err) có status 404 → 404 + thông báo của nó'] },
    { goi: `await go({ url: '/api/crash' })`, moTa: ['A thrown error → 500 without leaking the message', 'Lỗi ném ra → 500 không lộ thông báo'] },
    { goi: `await go({ method: 'POST', url: '/api/notes', body: '{"title": oops}', headers: { 'content-type': 'application/json' } })`, moTa: ['Broken JSON body → 400 Invalid JSON body', 'Body JSON hỏng → 400 Invalid JSON body'] },
    { goi: `module.exports.errorHandler.length`, moTa: ['errorHandler declares 4 parameters', 'errorHandler khai 4 tham số'] },
    { goi: `[await go({ method: 'DELETE', url: '/api/notes/1' }), await go({ url: '/api/notes/1' })]`, an: true },
    { goi: `(await go({ url: '/api/crash' }), __log.some((l) => l.includes('ECONNREFUSED')))`, an: true, moTa: ['The real error is logged on the server', 'Lỗi thật được ghi ở server'] },
    { goi: `__pick(await __goi(module.exports.errorHandler, {}, { err: Object.assign(new Error('Too many'), { status: 429 }) }), 'status body')`, an: true },
  ],
});

/* ── 6 ── async wrapper */
const E6 = bai({
  ten: 'Express 4 and async handlers: write wrap() so errors reach the handler', kho: 'HARD', phut: 20, lib: ['express'],
  en: J`<p>The notes repository is asynchronous and sometimes fails (<code>notesRepo.findById</code> rejects with an error that has <code>status = 503</code> when the database is down). In Express 4 an <code>async</code> handler that throws or awaits a rejected promise does <b>not</b> reach the error handler: the request just hangs.</p>
<p>Write <code>wrap(fn)</code> — it returns a normal <code>(req, res, next)</code> middleware that calls <code>fn</code> and sends any rejection (or synchronous throw) to <code>next(err)</code>. Use it on both routes. The error handler is given.</p>`,
  vi: J`<p>Kho ghi chú là bất đồng bộ và đôi khi hỏng (<code>notesRepo.findById</code> reject với lỗi có <code>status = 503</code> khi CSDL sập). Trong Express 4, handler <code>async</code> ném lỗi hoặc await một promise bị reject <b>không</b> tới được error handler: request cứ treo.</p>
<p>Viết <code>wrap(fn)</code> — trả về một middleware <code>(req, res, next)</code> bình thường, gọi <code>fn</code> và chuyển mọi reject (hoặc lỗi ném đồng bộ) tới <code>next(err)</code>. Dùng nó cho cả hai route. Error handler cho sẵn.</p>`,
  yc: [
    ['<code>wrap(fn)</code> returns a function with the parameters <code>(req, res, next)</code>.', '<code>wrap(fn)</code> trả về hàm có tham số <code>(req, res, next)</code>.'],
    ['It must catch BOTH a rejected promise and a synchronous throw from <code>fn</code>.', 'Nó phải bắt CẢ promise bị reject lẫn lỗi ném đồng bộ từ <code>fn</code>.'],
    ['Wrap <code>GET /api/notes/:id</code> and <code>GET /api/notes</code>. Export <code>module.exports = { app, wrap };</code>', 'Bọc <code>GET /api/notes/:id</code> và <code>GET /api/notes</code>. Export <code>module.exports = { app, wrap };</code>'],
  ],
  viDu: [['GET /api/notes/1 (database up)', '200 {"id":1,"title":"Buy milk"}', 'Normal answer.', 'Trả lời bình thường.'], ['GET /api/notes/1 (database down)', '503 {"error":"Database unavailable"}', 'Before wrap(): no answer at all — the client times out.', 'Trước khi có wrap(): không trả lời gì — client hết thời gian chờ.']],
  goiY: [
    ['The lesson\'s one-liner: <code>const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);</code> — but it breaks if <code>fn</code> is not async and throws synchronously.', 'Một dòng của bài: <code>const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);</code> — nhưng nó hỏng nếu <code>fn</code> không async và ném lỗi đồng bộ.'],
    ['<code>Promise.resolve().then(() => fn(req, res, next)).catch(next)</code> turns a sync throw into a rejection too.', '<code>Promise.resolve().then(() => fn(req, res, next)).catch(next)</code> biến cả lỗi ném đồng bộ thành reject.'],
  ],
  loi: [
    ['Wrapping in <code>try { fn(req, res, next) } catch (e) { next(e) }</code> without <code>await</code>: the try/catch ends before the promise rejects.', 'Bọc bằng <code>try { fn(req, res, next) } catch (e) { next(e) }</code> mà không <code>await</code>: try/catch kết thúc trước khi promise reject.'],
    ['Calling <code>next(err)</code> AND <code>res.json</code> on the same request: "Cannot set headers after they are sent".', 'Vừa gọi <code>next(err)</code> VỪA <code>res.json</code> trên cùng request: "Cannot set headers after they are sent".'],
    ['Writing <code>.catch(next())</code> — that calls next immediately with no error.', 'Viết <code>.catch(next())</code> — gọi next ngay lập tức, không kèm lỗi.'],
  ],
  gt: [
    'Express 4 calls your handler and ignores what it returns, so a rejected promise has no listener. <code>wrap</code> attaches one: <code>.catch(next)</code> passes the error as the first argument of <code>next</code>, which makes Express skip to the four-parameter handler. Starting from <code>Promise.resolve().then(…)</code> also converts a synchronous throw into a rejection, so one wrapper covers both. In Express 5 this is built in — the wrapper becomes harmless and can stay.',
    'Express 4 gọi handler của bạn rồi bỏ qua giá trị trả về, nên promise bị reject không có ai nghe. <code>wrap</code> gắn người nghe đó: <code>.catch(next)</code> đưa lỗi làm đối số đầu của <code>next</code>, khiến Express nhảy tới handler bốn tham số. Bắt đầu từ <code>Promise.resolve().then(…)</code> còn biến lỗi ném đồng bộ thành reject, nên một hàm bọc lo cả hai. Express 5 có sẵn việc này — hàm bọc trở nên vô hại và giữ lại được.',
  ],
  kn: ['async errors', 'Express 4'],
  tns: [tn('unhandled rejection', 'promise bị reject không ai bắt'), tn('wrapper', 'hàm bọc', 'hàm nhận hàm và trả về hàm')],
  dau: J`const express = require('express');
const app = express();

// a fake asynchronous repository (the database)
const notesRepo = {
  down: false,
  async findById(id) {
    await new Promise((r) => setTimeout(r, 5));
    if (this.down) throw Object.assign(new Error('Database unavailable'), { status: 503 });
    return id === 1 ? { id: 1, title: 'Buy milk' } : null;
  },
  async findAll() {
    if (this.down) throw Object.assign(new Error('Database unavailable'), { status: 503 });
    return [{ id: 1, title: 'Buy milk' }];
  },
};

const wrap = (fn) => fn;

app.get('/api/notes', wrap(async (req, res) => {
  res.json(await notesRepo.findAll());
}));
app.get('/api/notes/:id', async (req, res) => {
  const note = await notesRepo.findById(Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
module.exports = { app, wrap, notesRepo };
`,
  giai: J`const express = require('express');
const app = express();

// a fake asynchronous repository (the database)
const notesRepo = {
  down: false,
  async findById(id) {
    await new Promise((r) => setTimeout(r, 5));
    if (this.down) throw Object.assign(new Error('Database unavailable'), { status: 503 });
    return id === 1 ? { id: 1, title: 'Buy milk' } : null;
  },
  async findAll() {
    if (this.down) throw Object.assign(new Error('Database unavailable'), { status: 503 });
    return [{ id: 1, title: 'Buy milk' }];
  },
};

// wrap(fn): a normal middleware that forwards ANY failure of fn to next(err)
const wrap = (fn) => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req, res, next))   // a sync throw inside fn becomes a rejection here too
    .catch(next);                     // Express 4 never does this for you
};

app.get('/api/notes', wrap(async (req, res) => {
  res.json(await notesRepo.findAll());
}));
app.get('/api/notes/:id', wrap(async (req, res) => {
  const note = await notesRepo.findById(Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
}));

app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
module.exports = { app, wrap, notesRepo };
`,
  chuanBi: `const { app, wrap, notesRepo } = module.exports; const go = async (url) => __res(await app.inject({ url, timeoutMs: 2000 }));`,
  cases: [
    { goi: `await go('/api/notes/1')`, moTa: ['Database up → 200', 'CSDL chạy → 200'] },
    { goi: `(notesRepo.down = true, await go('/api/notes/1'))`, moTa: ['Database down → 503 from the error handler (not a hang)', 'CSDL sập → 503 từ error handler (không treo)'] },
    { goi: `(notesRepo.down = true, await go('/api/notes'))`, moTa: ['The list route is protected too', 'Route danh sách cũng được bảo vệ'] },
    { goi: `await go('/api/notes/9')`, moTa: ['Unknown id → 404', 'Id lạ → 404'] },
    { goi: `__pick(await __goi(wrap(() => { throw Object.assign(new Error('sync boom'), { status: 418 }); }), {}), 'status next')`, an: true, moTa: ['A synchronous throw is forwarded too', 'Lỗi ném đồng bộ cũng được chuyển'] },
    { goi: `__pick(await __goi(wrap(async () => { throw new Error('late'); }), {}), 'next')`, an: true },
    { goi: `[wrap(async () => {}).length, typeof wrap(async () => {})]`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-2-2-middleware',
  ten: '2.2 Middleware: the heart of Express',
  khoa: KHOA,
  baiHoc: 'sdn302-2-2-middleware',
  de: [E1, E2, E3, E4, E5, E6],
});
