/** SDN302 · Slot 3.1 (slide gốc) — ExpressJS: Router.route() với bảng route của slide 40–47, middleware tự viết + 404, và câu hỏi về
 *  5 loại middleware, Express Generator, semver, express.json và mã trạng thái sau res.write (đã chạy thật bằng Express 4.19.2). */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const GOI = (m, u, b) => `__res(await module.exports.inject({ method: '${m}', url: '${u}'${b ? `, headers: { 'content-type': 'application/json' }, body: ${b}` : ''} }))`;
const BODY = `{ title: 'Hanoi', text: 'Old quarter', date: '2024-03-03' }`;

/* ── 1 ── articleRouter của slide 40–47 */
const E1 = bai({
  ten: 'The articles router of the slides: route("/") and route("/:id")', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Rebuild the <code>articleRouter</code> of the official slides (Slot 3.1, slides 40–47) and mount it on <code>/articles</code>. Export the app with <code>module.exports = app</code>.</p>
<table><thead><tr><th>Request</th><th>Status</th><th>Text sent with <code>res.send</code></th></tr></thead><tbody>
<tr><td>GET /articles</td><td>200</td><td>Will send all the articles to you!</td></tr>
<tr><td>POST /articles (JSON body)</td><td>201</td><td>Will add the article: TITLE with details: TEXT and DATE</td></tr>
<tr><td>PUT /articles</td><td>403</td><td>PUT operation not supported on /articles</td></tr>
<tr><td>DELETE /articles</td><td>200</td><td>Deleting all articles</td></tr>
<tr><td>GET /articles/:id</td><td>200</td><td>Will send details of the article: ID to you!</td></tr>
<tr><td>POST /articles/:id</td><td>403</td><td>POST operation not supported on /articles/ID</td></tr>
<tr><td>PUT /articles/:id (JSON body)</td><td>200</td><td>Will update the article: ID with title: TITLE</td></tr>
<tr><td>DELETE /articles/:id</td><td>200</td><td>Deleting article: ID</td></tr></tbody></table>
<p>Note the PUT on one article answers <b>200</b>: the slide wrote <code>res.write</code> and then <code>res.status(201)</code>, and run for real the client got 200 anyway — set the status once, before sending.</p>`,
  vi: J`<p>Dựng lại <code>articleRouter</code> của slide gốc (Slot 3.1, slide 40–47) và gắn nó ở <code>/articles</code>. Export app bằng <code>module.exports = app</code>.</p>
<table><thead><tr><th>Request</th><th>Mã</th><th>Chữ gửi bằng <code>res.send</code></th></tr></thead><tbody>
<tr><td>GET /articles</td><td>200</td><td>Will send all the articles to you!</td></tr>
<tr><td>POST /articles (thân JSON)</td><td>201</td><td>Will add the article: TITLE with details: TEXT and DATE</td></tr>
<tr><td>PUT /articles</td><td>403</td><td>PUT operation not supported on /articles</td></tr>
<tr><td>DELETE /articles</td><td>200</td><td>Deleting all articles</td></tr>
<tr><td>GET /articles/:id</td><td>200</td><td>Will send details of the article: ID to you!</td></tr>
<tr><td>POST /articles/:id</td><td>403</td><td>POST operation not supported on /articles/ID</td></tr>
<tr><td>PUT /articles/:id (thân JSON)</td><td>200</td><td>Will update the article: ID with title: TITLE</td></tr>
<tr><td>DELETE /articles/:id</td><td>200</td><td>Deleting article: ID</td></tr></tbody></table>
<p>Chú ý PUT một bài trả <b>200</b>: slide viết <code>res.write</code> rồi mới <code>res.status(201)</code>, chạy thật client vẫn nhận 200 — đặt mã một lần, trước khi gửi.</p>`,
  yc: [
    ['<code>const articleRouter = express.Router()</code> with <code>articleRouter.use(express.json())</code>.', '<code>const articleRouter = express.Router()</code> kèm <code>articleRouter.use(express.json())</code>.'],
    ['Two chains: <code>articleRouter.route(\'/\').get(…).post(…).put(…).delete(…)</code> and the same on <code>\'/:id\'</code>.', 'Hai chuỗi: <code>articleRouter.route(\'/\').get(…).post(…).put(…).delete(…)</code> và tương tự trên <code>\'/:id\'</code>.'],
    ['<code>app.use(\'/articles\', articleRouter)</code> and <code>module.exports = app</code>.', '<code>app.use(\'/articles\', articleRouter)</code> và <code>module.exports = app</code>.'],
  ],
  viDu: [['POST /articles {"title":"Hanoi","text":"Old quarter","date":"2024-03-03"}', '201 Will add the article: Hanoi with details: Old quarter and 2024-03-03', 'The router parses JSON itself.', 'Router tự phân tích JSON.'], ['PUT /articles', '403 PUT operation not supported on /articles', 'No PUT on the whole collection.', 'Không PUT cả tập hợp.']],
  goiY: [
    ['Paths inside the router are relative: <code>\'/:id\'</code> becomes <code>/articles/:id</code> once mounted.', 'Đường dẫn trong router là tương đối: <code>\'/:id\'</code> thành <code>/articles/:id</code> khi đã gắn.'],
    ['<code>res.status(403).send(\'…\')</code> — status first, then one send.', '<code>res.status(403).send(\'…\')</code> — mã trước, rồi gửi một lần.'],
  ],
  loi: [
    ['Forgetting <code>express.json()</code>: <code>req.body</code> is undefined and the POST crashes on <code>req.body.title</code>.', 'Quên <code>express.json()</code>: <code>req.body</code> là undefined và POST sập ở <code>req.body.title</code>.'],
    ['Mounting the router at <code>/</code> but writing <code>/articles</code> inside it — every URL becomes <code>/articles/articles</code>.', 'Gắn router ở <code>/</code> mà bên trong lại viết <code>/articles</code> — mọi URL thành <code>/articles/articles</code>.'],
    ['<code>res.write</code> then <code>res.status(201)</code>: the 200 was already sent.', '<code>res.write</code> rồi <code>res.status(201)</code>: mã 200 đã được gửi trước.'],
  ],
  gt: [
    '<code>express.Router()</code> is a mini-app; <code>route(path)</code> lets you write a path once and chain one handler per verb — exactly the structure Express Generator expects in <code>routes/</code>. Mounting with a prefix keeps the router reusable.',
    '<code>express.Router()</code> là một app thu nhỏ; <code>route(path)</code> cho viết đường dẫn một lần rồi nối mỗi động từ một handler — đúng cấu trúc Express Generator mong đợi trong <code>routes/</code>. Gắn kèm tiền tố giúp router dùng lại được.',
  ],
  kn: ['express.Router', 'route chaining'],
  tns: [tn('router', 'bộ định tuyến'), tn('mount', 'gắn', 'app.use(prefix, router)')],
  dau: J`const express = require('express');
const app = express();
const articleRouter = express.Router();

articleRouter.route('/')
  .get((req, res) => res.send('Will send all the articles to you!'))
  .post((req, res) => res.status(201).send('Will add the article: ' + req.body.title));

app.use(articleRouter);
module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();
const articleRouter = express.Router();
articleRouter.use(express.json());   // without it req.body is undefined

articleRouter.route('/')
  .get((req, res) => res.status(200).send('Will send all the articles to you!'))
  .post((req, res) => res.status(201).send('Will add the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date))
  .put((req, res) => res.status(403).send('PUT operation not supported on /articles'))
  .delete((req, res) => res.status(200).send('Deleting all articles'));

articleRouter.route('/:id')
  .get((req, res) => res.status(200).send('Will send details of the article: ' + req.params.id + ' to you!'))
  .post((req, res) => res.status(403).send('POST operation not supported on /articles/' + req.params.id))
  .put((req, res) => res.status(200).send('Will update the article: ' + req.params.id + ' with title: ' + req.body.title))
  .delete((req, res) => res.status(200).send('Deleting article: ' + req.params.id));

app.use('/articles', articleRouter);   // '/:id' inside becomes /articles/:id
module.exports = app;
`,
  cases: [
    { goi: GOI('GET', '/articles'), moTa: ['GET /articles → 200', 'GET /articles → 200'] },
    { goi: GOI('POST', '/articles', BODY), moTa: ['POST /articles → 201 with title, text, date', 'POST /articles → 201 kèm title, text, date'] },
    { goi: GOI('PUT', '/articles'), moTa: ['PUT /articles → 403', 'PUT /articles → 403'] },
    { goi: GOI('POST', '/articles/7'), moTa: ['POST /articles/7 → 403', 'POST /articles/7 → 403'] },
    { goi: GOI('PUT', '/articles/7', `{ title: 'Hue' }`), moTa: ['PUT /articles/7 → 200 (not 201)', 'PUT /articles/7 → 200 (không phải 201)'] },
    { goi: GOI('DELETE', '/articles'), an: true },
    { goi: GOI('GET', '/articles/42'), an: true },
    { goi: GOI('DELETE', '/articles/9'), an: true },
  ],
});

/* ── 2 ── middleware tự viết + 404 cuối */
const E2 = bai({
  ten: 'Custom middleware and the custom 404 of slide 11', kho: 'EASY', phut: 12, lib: ['express'],
  en: J`<p>Build an app with:</p>
<ol><li>a <b>logger</b> middleware registered first that pushes <code>METHOD URL</code> (e.g. <code>"GET /Hello"</code>) into the exported array <code>logs</code> and calls <code>next()</code>;</li>
<li><code>GET /</code> → <code>&lt;b&gt;My First&lt;/b&gt; Express http server</code> and <code>GET /Hello</code> → <code>Hello, World!</code>;</li>
<li>a last middleware answering <b>404</b> with <code>Sorry, that route doesn't exist. Have a nice day!</code>.</li></ol>
<p>Export <code>module.exports = { app, logs }</code>.</p>`,
  vi: J`<p>Dựng app gồm:</p>
<ol><li>middleware <b>logger</b> đăng ký đầu tiên, đẩy <code>METHOD URL</code> (ví dụ <code>"GET /Hello"</code>) vào mảng <code>logs</code> được export rồi gọi <code>next()</code>;</li>
<li><code>GET /</code> → <code>&lt;b&gt;My First&lt;/b&gt; Express http server</code> và <code>GET /Hello</code> → <code>Hello, World!</code>;</li>
<li>middleware cuối cùng trả <b>404</b> với <code>Sorry, that route doesn't exist. Have a nice day!</code>.</li></ol>
<p>Export <code>module.exports = { app, logs }</code>.</p>`,
  yc: [['Logger first, routes next, 404 last.', 'Logger trước, route sau, 404 cuối cùng.'], ['The logger must call <code>next()</code>.', 'Logger phải gọi <code>next()</code>.']],
  viDu: [['GET /nope', '404 Sorry, that route doesn\'t exist. Have a nice day!', 'No route matched, the last middleware answers.', 'Không route nào khớp, middleware cuối trả lời.']],
  goiY: [['Middleware signature: <code>(req, res, next)</code>.', 'Chữ ký middleware: <code>(req, res, next)</code>.'], ['Express runs middleware in the order you register them.', 'Express chạy middleware theo thứ tự bạn đăng ký.']],
  loi: [['A logger without <code>next()</code>: every request hangs.', 'Logger thiếu <code>next()</code>: mọi request bị treo.'], ['Putting the 404 middleware first: every page becomes 404.', 'Đặt middleware 404 đầu tiên: trang nào cũng thành 404.']],
  gt: ['A middleware does one of two things: ends the cycle (sends a response) or calls <code>next()</code>. Registered last, a plain middleware only runs when no route answered — that is the 404.', 'Middleware làm một trong hai việc: kết thúc chu trình (gửi response) hoặc gọi <code>next()</code>. Đăng ký cuối cùng, một middleware thường chỉ chạy khi không route nào trả lời — đó chính là 404.'],
  kn: ['middleware', '404 handler'],
  tns: [tn('middleware', 'phần mềm trung gian', 'hàm (req, res, next)')],
  dau: J`const express = require('express');
const app = express();
const logs = [];

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day!");
});
app.get('/Hello', (req, res) => res.send('Hello, World!'));

module.exports = { app, logs };
`,
  giai: J`const express = require('express');
const app = express();
const logs = [];

// 1) application-level middleware: runs for every request, then passes on
app.use((req, res, next) => {
  logs.push(req.method + ' ' + req.url);
  next();
});

// 2) routes
app.get('/', (req, res) => res.send('<b>My First</b> Express http server'));
app.get('/Hello', (req, res) => res.send('Hello, World!'));

// 3) registered LAST: only reached when no route above answered
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day!");
});

module.exports = { app, logs };
`,
  cases: [
    { goi: `__res(await module.exports.app.inject({ method: 'GET', url: '/Hello' }))`, moTa: ['GET /Hello → Hello, World!', 'GET /Hello → Hello, World!'] },
    { goi: `__res(await module.exports.app.inject({ method: 'GET', url: '/nope' }))`, moTa: ['Unknown route → custom 404', 'Route lạ → 404 tự viết'] },
    { goi: `(await module.exports.app.inject({ method: 'GET', url: '/' }), await module.exports.app.inject({ method: 'POST', url: '/x' }), module.exports.logs)`, moTa: ['The logger records every request in order', 'Logger ghi mọi request theo thứ tự'] },
    { goi: `__res(await module.exports.app.inject({ method: 'GET', url: '/' }))`, an: true },
  ],
});

/* ── 3 ── câu hỏi theo slide */
const E3 = cs({
  ten: 'ExpressJS slides: middleware types, Generator, semver and two traps', kho: 'EASY', phut: 10,
  en: 'Questions taken from the official Slot 3.1 slides — the kind Progress Test 1 asks.', vi: 'Câu hỏi lấy từ slide gốc Slot 3.1 — đúng kiểu Progress Test 1 hay hỏi.',
  cau: [
    qn('t1', ['Which are the five types of Express middleware listed in the slides? (choose all)', 'Năm loại middleware Express trong slide là? (chọn hết)'],
      ['Application-level', 'Router-level', 'Built-in', 'Error-handling', 'Third-party', 'Database-level'], [0, 1, 2, 3, 4],
      ['"Database-level" is not a middleware type; Mongoose hooks are a different thing.', '"Database-level" không phải loại middleware; hook của Mongoose là chuyện khác.']),
    q('t2', ['How does Express recognise an error-handling middleware?', 'Express nhận ra middleware xử lý lỗi bằng cách nào?'],
      ['It has four parameters (err, req, res, next)', 'Its name starts with "error"', 'It is registered with app.error()', 'It returns a rejected Promise'],
      ['Arity 4 is the only signal Express looks at.', 'Số tham số bằng 4 là dấu hiệu duy nhất Express xét.']),
    q('t3', ['In a project made by Express Generator, which file actually creates the HTTP server and calls listen?', 'Trong dự án tạo bằng Express Generator, tệp nào thật sự tạo HTTP server và gọi listen?'],
      ['bin/www', 'app.js', 'routes/index.js', 'package.json'],
      ['app.js builds and exports the app; bin/www imports it and listens (npm start runs node ./bin/www).', 'app.js dựng và export app; bin/www import nó rồi listen (npm start chạy node ./bin/www).']),
    q('t4', ['"express": "^4.19.2" in package.json accepts…', '"express": "^4.19.2" trong package.json chấp nhận…'],
      ['any 4.x.x from 4.19.2 (new minor and patch versions)', 'only 4.19.x (new patch versions, never a new minor)', 'exactly 4.19.2 and nothing else, ever', 'any newer version, including 5.0.0 and later'],
      ['^ allows minor + patch updates within the same major; ~ allows only patches.', '^ cho phép cập nhật minor + patch trong cùng major; ~ chỉ cho patch.']),
    q('t5', ['A POST sends JSON but the app never called express.json(). What is req.body?', 'POST gửi JSON nhưng app chưa gọi express.json(). req.body là gì?'],
      ['undefined', 'the parsed object', 'the raw JSON string', 'an empty object {} filled later'],
      ['Express 4 does not parse bodies by itself; checked for real, title/text/date print as undefined.', 'Express 4 không tự đọc thân; chạy thật, title/text/date in ra undefined.']),
    q('t6', ['A handler calls res.write("…") and then res.status(201).end("…"). Which status does the client receive (checked on Express 4.19.2)?', 'Handler gọi res.write("…") rồi res.status(201).end("…"). Client nhận mã nào (đã kiểm trên Express 4.19.2)?'],
      ['200', '201', '500', 'The request hangs'],
      ['The first write sends the headers with the default 200; later status changes are too late.', 'Lần write đầu đã gửi header với mã mặc định 200; đổi mã sau đó là quá muộn.']),
  ],
  goiY: [['Re-read slides 8, 16–17, 31, 37–38 of Slot 3.1.', 'Đọc lại slide 8, 16–17, 31, 37–38 của Slot 3.1.'], ['Think about what really happens on the wire.', 'Nghĩ xem điều gì thật sự diễn ra trên đường truyền.']],
  loi: [['Mixing up ^ and ~.', 'Nhầm ^ với ~.'], ['Believing app.js starts the server in a generated project.', 'Tin rằng app.js khởi động server trong dự án được sinh.']],
  tns: [tn('semantic versioning', 'đánh phiên bản ngữ nghĩa', 'MAJOR.MINOR.PATCH')],
  kn: ['middleware', 'Express Generator'],
});

export default doiDau({
  slug: 'sdn302-goc-3-1-expressjs',
  ten: 'Slot 3.1 ExpressJS (official slides)',
  khoa: KHOA,
  baiHoc: 'sdn302-goc-3-1-expressjs',
  de: [E2, E1, E3],
});
