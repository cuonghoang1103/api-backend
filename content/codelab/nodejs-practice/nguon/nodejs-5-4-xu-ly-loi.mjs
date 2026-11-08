/** Node.js 5.4 — Xử lý lỗi tập trung: AppError + JSON 404, error handler 4 tham số, wrap() cho Express 4, log-rồi-thoát khi lỗi ngoài request, mã request cho lỗi 5xx. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, FAKE_EMITTER } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '5.4 · How an error reaches the handler (or does not)', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s proofs: Express 4.22.2 vs 5.x, the four-parameter rule, and the two errors that still kill the process. Re-measured with express 4.22.2 and 5.3.0.',
  vi: 'Các câu về những phép chứng minh của bài: Express 4.22.2 vs 5.x, luật bốn tham số, và hai loại lỗi vẫn giết tiến trình. Đã đo lại với express 4.22.2 và 5.3.0.',
  cau: [
    q('c1', ['You register <code>app.use((err, req, res) =&gt; res.status(500).json(…))</code> — three parameters. What happens to errors?', 'Bạn đăng ký <code>app.use((err, req, res) =&gt; res.status(500).json(…))</code> — ba tham số. Lỗi sẽ ra sao?'],
      ['It is treated as a normal middleware and never runs for errors — Express’s default HTML 500 answers instead', 'Express notices the missing next and treats it as an error handler anyway', 'Express throws at startup because an error handler needs four parameters', 'It runs for errors, but next() is undefined inside it'],
      ['Express counts declared parameters (fn.length) at registration time. No warning — “if errors are not reaching the handler, count the parameters first”.', 'Express đếm số tham số khai báo (fn.length) lúc đăng ký. Không có cảnh báo — “nếu lỗi không tới handler, hãy đếm tham số trước”.']),
    q('c2', ['<code>app.get(\'/x\', async () =&gt; { await sleep(10); throw new Error(\'boom\') })</code> on Express 4.22.2 — the client gets…', '<code>app.get(\'/x\', async () =&gt; { await sleep(10); throw new Error(\'boom\') })</code> trên Express 4.22.2 — client nhận…'],
      ['nothing: the request hangs, the error only appears as an unhandledRejection', 'a 500 from the error handler, like a sync throw', 'a 500 from Express’s default handler with the stack', 'a 400, because the handler returned a rejected promise'],
      ['Measured again: Express 4 times out, Express 5 answers 500 through the error handler. On v4 wrap every async handler: fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next).', 'Đo lại: Express 4 hết giờ, Express 5 trả 500 qua error handler. Trên v4 phải bọc mọi handler async: fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next).']),
    q('c3', ['On Express 5, a handler does <code>setTimeout(() =&gt; { throw new Error(\'x\') }, 10)</code>. Result?', 'Trên Express 5, một handler làm <code>setTimeout(() =&gt; { throw new Error(\'x\') }, 10)</code>. Kết quả?'],
      ['The process crashes — Express 5 only catches a rejected promise returned by the handler', 'Express 5 catches it and answers 500', 'The error is ignored because the response was already sent', 'Express converts it into next(err) when the timer fires'],
      ['By the time the callback runs, the request’s call stack is long gone. Plumb such errors through next(err).', 'Khi callback chạy, call stack của request đã mất từ lâu. Đưa những lỗi như vậy qua next(err).']),
    q('c4', ['While “tidying up”, someone moves the JSON 404 handler and the error handler ABOVE <code>app.use(\'/api/v1/notes\', notesRouter)</code>. Symptom?', 'Trong lúc “dọn dẹp”, ai đó dời handler 404 JSON và error handler lên TRÊN <code>app.use(\'/api/v1/notes\', notesRouter)</code>. Triệu chứng?'],
      ['Every request becomes a 404, even endpoints nobody touched', 'Only unknown routes return 404, as before', 'Errors are no longer caught, but routes still work', 'Express refuses to start because of the order'],
      ['app.use with no path matches everything, and the 404 handler responds — nothing below it ever runs.', 'app.use không có path khớp mọi thứ, và handler 404 phản hồi — không gì bên dưới được chạy nữa.']),
    q('c5', ['In <code>process.on(\'uncaughtException\', …)</code> the lesson logs and then…', 'Trong <code>process.on(\'uncaughtException\', …)</code> bài ghi log rồi…'],
      ['calls process.exit(1) and lets Docker/systemd start a clean process', 'keeps the server running so users are not affected', 'restarts the Express app inside the same process', 'sends a 500 to every open request'],
      ['After an uncaught exception the state is unknown (half a transaction, a released lock, a corrupted cache). A server that “survives” it quietly serves wrong data.', 'Sau một uncaught exception trạng thái không xác định (nửa transaction, khoá đã nhả, cache hỏng). Server “sống sót” qua nó sẽ âm thầm phục vụ dữ liệu sai.']),
  ],
  goiY: [['Three paths: sync throw, next(err), async throw — which one did Express 4 miss?', 'Ba con đường: throw đồng bộ, next(err), throw bất đồng bộ — Express 4 bỏ sót đường nào?'], ['Order in the file is still the whole API.', 'Thứ tự trong tệp vẫn là toàn bộ API.']],
  loi: [['Deleting the unused next parameter of the error handler “to satisfy the linter”.', 'Xoá tham số next không dùng của error handler “cho linter vui”.'], ['Catching uncaughtException and carrying on.', 'Bắt uncaughtException rồi chạy tiếp.']],
  tns: [tn('error handler', 'middleware xử lý lỗi (4 tham số)'), tn('unhandledRejection', 'Promise bị reject mà không ai bắt'), tn('supervisor', 'trình giám sát (Docker, systemd) khởi động lại tiến trình')],
  kn: ['Express', 'errors'],
});

/* ─── 2. AppError + notFound ─── */
class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;   // for HTTP and proxies
    this.code = code;       // a stable string the frontend can branch on forever
  }
}
function notFound(req, res) {
  // after every route, before the error handler
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Cannot ${req.method} ${req.path}` } });
}
const E2 = nodeBai({
  ten: '5.4 · AppError and a JSON 404', kho: 'EASY', phut: 10, kit: true, tep: 'errors.js',
  en: `<p>Write the two smallest pieces of <code>middleware/errors.js</code>:</p>
<ul><li><code>class AppError extends Error</code> with <code>constructor(status, code, message)</code> — it keeps the message (via <code>super</code>) and stores <code>status</code> and <code>code</code>. <code>new AppError(404, 'NOTE_NOT_FOUND', 'Note 42 does not exist')</code> must still be an <code>Error</code>;</li><li><code>notFound(req, res)</code> — the JSON 404 that replaces Express’s HTML page: status 404, <code>{ error: { code: "NOT_FOUND", message: "Cannot &lt;METHOD&gt; &lt;path&gt;" } }</code> (path without the query string).</li></ul><pre>curl /api/v1/khong-co
{"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}   [404]</pre>`,
  vi: `<p>Viết hai mảnh nhỏ nhất của <code>middleware/errors.js</code>:</p>
<ul><li><code>class AppError extends Error</code> với <code>constructor(status, code, message)</code> — giữ message (qua <code>super</code>) và lưu <code>status</code>, <code>code</code>. <code>new AppError(404, 'NOTE_NOT_FOUND', 'Note 42 does not exist')</code> vẫn phải là một <code>Error</code>;</li><li><code>notFound(req, res)</code> — 404 dạng JSON thay cho trang HTML của Express: status 404, <code>{ error: { code: "NOT_FOUND", message: "Cannot &lt;METHOD&gt; &lt;path&gt;" } }</code> (path không kèm query string).</li></ul><pre>curl /api/v1/khong-co
{"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}   [404]</pre>`,
  yc: [['AppError must call super(message) first.', 'AppError phải gọi super(message) trước.'], ['notFound uses req.path, not req.originalUrl.', 'notFound dùng req.path, không phải req.originalUrl.']],
  goiY: [['class AppError extends Error { constructor(status, code, message) { super(message); this.status = status; … } }', 'class AppError extends Error { constructor(status, code, message) { super(message); this.status = status; … } }'], ['notFound is a normal middleware: it answers and does not call next.', 'notFound là middleware thường: nó trả lời và không gọi next.']],
  loi: [['Forgetting super(message): this cannot be used before super() — the constructor throws.', 'Quên super(message): không dùng được this trước super() — constructor ném lỗi.'], ['A plain object { status, code } instead of a class: it is not an Error, has no stack, and instanceof checks fail.', 'Một object thường { status, code } thay vì lớp: nó không phải Error, không có stack, và instanceof thất bại.'], ['Putting the query string in the message: "Cannot GET /x?token=…" can leak secrets into logs.', 'Đưa query string vào message: "Cannot GET /x?token=…" có thể lộ bí mật vào log.']],
  gt: ['Why both a status and a code? The status is for HTTP and proxies; the code is for your frontend, which can branch on <code>NOTE_NOT_FOUND</code> forever while the human message changes, gets translated, or is rewritten by a designer. Never make a client parse the message string.', 'Vì sao cần cả status lẫn code? status dành cho HTTP và proxy; code dành cho frontend, nó rẽ nhánh theo <code>NOTE_NOT_FOUND</code> mãi mãi trong khi câu chữ cho người đọc có thể đổi, được dịch, hay bị designer viết lại. Đừng bao giờ bắt client phân tích chuỗi message.'],
  kn: ['errors', 'classes'], tns: [tn('custom error class', 'lớp lỗi tự định nghĩa'), tn('error code', 'mã lỗi ổn định cho máy đọc')],
  chung: 'function appWithNotFound() { const app = express(); app.get("/health", (req, res) => res.json({ status: "ok" })); app.use(notFound); return app; }',
  dau: `/** an Error that carries an HTTP status and a stable code */
class AppError {
  // Write your solution here — this is not an Error at all
  constructor(status, code, message) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}
/** the JSON 404, mounted after every route */
function notFound(req, res) {
  res.status(404).send('Not Found');
}
`,
  giai: '// Reference solution — a real Error subclass, and the JSON 404\n' + nguon(AppError, notFound),
  cases: [
    { goi: '(() => { const e = new AppError(404, "NOTE_NOT_FOUND", "Note 42 does not exist"); return [e instanceof Error, e.status, e.code, e.message, typeof e.stack]; })()', moTa: ['AppError is a real Error', 'AppError là một Error thật'] },
    { goi: 'await (async () => { const r = await request(appWithNotFound(), "GET", "/api/v1/khong-co"); return [r.status, r.body]; })()', moTa: ['The lesson’s JSON 404', '404 JSON của bài'] },
    { goi: 'await (async () => { const r = await request(appWithNotFound(), "DELETE", "/api/v1/notes/9?force=1"); return [r.status, r.headers["content-type"], r.body]; })()', an: true },
    { goi: 'await (async () => [(await request(appWithNotFound(), "GET", "/health")).status, new AppError(422, "VALIDATION_FAILED", "title is required").message])()', an: true },
  ],
});

/* ─── 3. error handler đầy đủ ─── */
const APPERR = nguon(AppError);
function errorHandler(err, req, res, next) {   // FOUR parameters — that is the signal
  // library errors are converted to our own shape first
  if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON');
  if (err.type === 'entity.too.large') err = new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
  const status = err.status || 500;
  if (status >= 500) console.error('[500]', err.message);    // our bug: log it (with the stack in real life)
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL',
      message: status >= 500 ? 'Internal server error' : err.message,   // never echo a 500 message
    },
  });
}
const ERR_APP = `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function mkApp() { const app = express(); app.use(express.json({ limit: '1kb' }));
app.get('/app-error', () => { throw new AppError(404, 'NOTE_NOT_FOUND', 'Không tìm thấy ghi chú'); });
app.get('/next-error', (req, res, next) => next(new AppError(422, 'VALIDATION_FAILED', 'title không được để trống')));
app.get('/boom', () => { throw new Error('relation "notes" does not exist (password=hunter2)'); });
app.get('/async', async () => { await sleep(10); throw new Error('blew up AFTER an await'); });
app.post('/notes', (req, res) => res.status(201).json(req.body));
app.use(errorHandler); return app; }
const s = (r) => [r.status, r.body ?? r.headers['content-type']];`;
const E3 = nodeBai({
  ten: '5.4 · The full error handler: one shape, no leaks', kho: 'MEDIUM', phut: 20, kit: true, tep: 'errors.js',
  en: `<p>Write the lesson’s <code>errorHandler(err, req, res, next)</code> (<code>AppError</code> is provided):</p>
<ul><li><b>first</b> convert body-parser errors: <code>err.type === "entity.parse.failed"</code> → <code>new AppError(400, "INVALID_JSON", "Request body is not valid JSON")</code>; <code>"entity.too.large"</code> → <code>new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large")</code>;</li><li><code>status = err.status || 500</code>;</li><li>for 5xx: <code>console.error('[500]', err.message)</code> — 4xx are normal traffic, do not log them;</li><li>respond <code>{ error: { code: err.code || "INTERNAL", message } }</code>, where <code>message</code> is <code>"Internal server error"</code> for 5xx (never echo it — internal messages leak table names and passwords) and <code>err.message</code> for 4xx.</li></ul><p>Keep the fourth parameter even though you do not use it.</p>`,
  vi: `<p>Viết <code>errorHandler(err, req, res, next)</code> của bài (có sẵn <code>AppError</code>):</p>
<ul><li><b>trước tiên</b> đổi lỗi của body-parser: <code>err.type === "entity.parse.failed"</code> → <code>new AppError(400, "INVALID_JSON", "Request body is not valid JSON")</code>; <code>"entity.too.large"</code> → <code>new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large")</code>;</li><li><code>status = err.status || 500</code>;</li><li>với 5xx: <code>console.error('[500]', err.message)</code> — 4xx là lưu lượng bình thường, đừng log;</li><li>trả <code>{ error: { code: err.code || "INTERNAL", message } }</code>, với <code>message</code> là <code>"Internal server error"</code> cho 5xx (không bao giờ gửi lại — thông điệp nội bộ lộ tên bảng và mật khẩu) và <code>err.message</code> cho 4xx.</li></ul><p>Giữ tham số thứ tư dù không dùng.</p>`,
  yc: [['errorHandler.length must be 4.', 'errorHandler.length phải là 4.'], ['One response shape for every error.', 'Một dạng phản hồi cho mọi lỗi.']],
  goiY: [['Convert first, then everything else is the generic path.', 'Đổi trước, phần còn lại đi đường chung.'], ['status >= 500 decides two things: whether to log, and which message to send.', 'status >= 500 quyết định hai việc: có log không, và gửi message nào.']],
  loi: [['(err, req, res) with three parameters: Express treats it as a normal middleware and its own HTML 500 answers.', '(err, req, res) với ba tham số: Express coi nó là middleware thường và trang HTML 500 của chính Express trả lời.'], ['res.status(500).json({ error: err.message }) — the client reads relation "notes" does not exist (password=…).', 'res.status(500).json({ error: err.message }) — client đọc được relation "notes" does not exist (password=…).'], ['Logging every 404 and 422: the real 500s drown in noise.', 'Log mọi 404 và 422: các lỗi 500 thật chìm trong tiếng ồn.']],
  gt: ['With this in place, sync throws, <code>next(err)</code> and (on Express 5) async throws all end in one function with one response shape — the lesson’s Express 5.2.1 output <code>{"error":{"code":"INTERNAL","message":"…"}}</code>. Chapter 7 adds Prisma’s P2002 → 409 and chapter 8 adds TokenExpiredError → 401 to the same conversion block.', 'Có nó rồi, throw đồng bộ, <code>next(err)</code> và (trên Express 5) throw bất đồng bộ đều kết thúc ở một hàm với một dạng phản hồi — đúng output Express 5.2.1 của bài <code>{"error":{"code":"INTERNAL","message":"…"}}</code>. Chương 7 thêm P2002 của Prisma → 409 và chương 8 thêm TokenExpiredError → 401 vào cùng khối chuyển đổi.'],
  kn: ['Express', 'errors'], tns: [tn('information leak', 'lộ thông tin'), tn('4xx vs 5xx', 'lỗi phía client vs lỗi phía server')],
  chung: ERR_APP,
  dau: `${APPERR}
/** one place, one response shape */
function errorHandler(err, req, res) {
  // Write your solution here — three parameters, and it echoes every message
  res.status(err.status || 500).json({ error: err.message });
}
`,
  giai: `${APPERR}
// Reference solution — convert, decide by status, log only 5xx, never echo a 500
${nguon(errorHandler)}`,
  cases: [
    { chuanBi: 'const app = mkApp();', goi: '[s(await request(app, "GET", "/app-error")), s(await request(app, "GET", "/next-error")), __log]', moTa: ['AppError thrown or passed to next: 404 / 422, nothing logged', 'AppError ném ra hoặc qua next: 404 / 422, không log gì'] },
    { chuanBi: 'const app = mkApp();', goi: '[s(await request(app, "GET", "/boom")), __log]', moTa: ['A 500 is logged but its message is not sent', '500 được log nhưng message không được gửi'] },
    { chuanBi: 'const app = mkApp();', goi: '[s(await request(app, "POST", "/notes", { body: "{title:}" })), s(await request(app, "POST", "/notes", { body: { t: "x".repeat(2000) } }))]', moTa: ['Body-parser errors in your shape', 'Lỗi body-parser theo dạng của bạn'] },
    { chuanBi: 'const app = mkApp();', goi: '[s(await request(app, "GET", "/async")), errorHandler.length, __log]', an: true },
    { chuanBi: 'const app = mkApp();', goi: '[s(await request(app, "POST", "/notes", { body: { title: "ok" } })), s(await request(app, "GET", "/next-error")), __log.length]', an: true },
  ],
});

/* ─── 4. wrap() cho Express 4 ─── */
function wrap(fn) {
  return function (req, res, next) {
    // a sync throw is caught by Express 4 itself; a rejection must be forwarded by hand
    Promise.resolve(fn(req, res, next)).catch((err) => next(err || new Error('Rejected promise')));
  };
}
const EX4 = `// what Express 4 does around a handler: it catches SYNC throws only
function express4Call(handler, req) { const calls = []; const res = { json: (b) => { calls.push(['json', b]); } };
const next = (err) => { calls.push(['next', err ? err.name + ': ' + err.message : 'no error']); };
try { handler(req || {}, res, next); } catch (e) { next(e); }
return new Promise((r) => setTimeout(() => r(calls), 50)); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));`;
const E4 = nodeBai({
  ten: '5.4 · wrap(): make async errors reach the handler on Express 4', kho: 'MEDIUM', phut: 15,
  en: `<p>Most of the Express code you will meet at work is still Express 4, where a throw after an <code>await</code> never reaches the error handler and the request hangs. The lesson’s fix:</p><pre>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next);</pre><p>Write <code>wrap(fn)</code> and fix the one edge the one-liner misses: a promise rejected with <b>nothing</b> (<code>Promise.reject()</code>, <code>throw undefined</code>) would call <code>next(undefined)</code> — which Express reads as “no error, carry on”. Pass <code>new Error('Rejected promise')</code> instead (that is exactly what Express 5 does).</p><p>The grader calls your wrapped handler the way Express 4 does: inside a <code>try/catch</code> that only sees <b>synchronous</b> throws.</p>`,
  vi: `<p>Phần lớn code Express bạn gặp ở chỗ làm vẫn là Express 4, nơi throw sau một <code>await</code> không bao giờ tới error handler và request treo. Cách sửa của bài:</p><pre>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next);</pre><p>Viết <code>wrap(fn)</code> và sửa luôn cái biên mà dòng đó bỏ sót: Promise bị reject với <b>không gì cả</b> (<code>Promise.reject()</code>, <code>throw undefined</code>) sẽ gọi <code>next(undefined)</code> — Express hiểu là “không lỗi, đi tiếp”. Hãy đưa <code>new Error('Rejected promise')</code> thay vào (đúng điều Express 5 làm).</p><p>Máy chấm gọi handler đã bọc theo cách Express 4 làm: bên trong một <code>try/catch</code> chỉ thấy throw <b>đồng bộ</b>.</p>`,
  dauVao: ['fn — a (possibly async) handler (req, res, next)', 'fn — handler (có thể async) (req, res, next)'], dauRa: ['a handler that forwards rejections to next', 'một handler chuyển reject sang next'],
  goiY: [['Promise.resolve(x) works whether fn returned a promise or a plain value.', 'Promise.resolve(x) chạy được dù fn trả Promise hay giá trị thường.'], ['.catch((err) => next(err || new Error("Rejected promise")))', '.catch((err) => next(err || new Error("Rejected promise")))']],
  loi: [['Calling next() in .then() after a successful handler: it continues the chain after the response was sent.', 'Gọi next() trong .then() sau handler thành công: chuỗi đi tiếp sau khi đã phản hồi.'], ['.catch(next) as-is: Promise.reject() becomes next(undefined) — the request silently falls through to the 404.', '.catch(next) nguyên văn: Promise.reject() thành next(undefined) — request âm thầm rơi xuống 404.'], ['Wrapping only some handlers: the one you forgot is the one that hangs.', 'Chỉ bọc vài handler: cái bạn quên chính là cái treo.']],
  gt: ['On Express 5 you no longer need this — the router does it, including the “Rejected promise” fallback. But you will still see <code>wrap</code> (or the <code>express-async-errors</code> package) in a lot of code, and knowing why it exists is how you recognise an Express 4 codebase that “randomly hangs”.', 'Trên Express 5 bạn không cần nó nữa — router làm việc này, kể cả phương án “Rejected promise”. Nhưng bạn vẫn sẽ gặp <code>wrap</code> (hay gói <code>express-async-errors</code>) trong rất nhiều code, và hiểu vì sao nó tồn tại là cách nhận ra một codebase Express 4 hay “treo ngẫu nhiên”.'],
  kn: ['Express', 'promises', 'errors'], tns: [tn('rejection', 'Promise bị từ chối'), tn('falsy', 'giá trị bị coi là false (undefined, null, 0, "")')],
  chung: EX4,
  dau: `/** forward async errors to next() — for Express 4 */
function wrap(fn) {
  // Write your solution here
  return fn;
}
`,
  giai: '// Reference solution — the lesson\'s one-liner, plus the falsy-rejection fallback\n' + nguon(wrap),
  cases: [
    { goi: 'await express4Call(wrap(async (req, res) => { await sleep(10); throw new Error("blew up AFTER an await"); }))', moTa: ['A throw after await reaches next(err)', 'Throw sau await tới được next(err)'] },
    { goi: 'await express4Call(wrap(async (req, res) => { await sleep(5); res.json({ ok: true }); }))', moTa: ['Success: no next() at all', 'Thành công: không gọi next()'] },
    { goi: 'await express4Call(wrap((req, res) => { throw new Error("sync"); }))', moTa: ['A sync throw still reaches next(err) once', 'Throw đồng bộ vẫn tới next(err) đúng một lần'] },
    { goi: '[await express4Call(wrap(async () => { await sleep(1); return Promise.reject(); })), await express4Call(wrap(() => Promise.reject(undefined)))]', an: true },
    { goi: '[await express4Call(wrap((req, res) => { res.json({ plain: true }); return 42; })), await express4Call(wrap(async (req, res, next) => { next(new TypeError("explicit")); }))]', an: true },
  ],
});

/* ─── 5. lỗi ngoài request: log rồi thoát ─── */
function installCrashHandlers(proc, log) {
  proc.on('unhandledRejection', (reason) => {
    log('unhandledRejection', reason instanceof Error ? reason.message : String(reason));
    proc.exit(1);           // log, then let the supervisor restart us with a clean state
  });
  proc.on('uncaughtException', (err) => {
    log('uncaughtException', err.message);
    proc.exit(1);
  });
}
const PROC = `${FAKE_EMITTER}
function mkProc() { const p = __em({ exits: [] }); p.exit = (code) => { p.exits.push(code); }; return p; }
function setup() { const proc = mkProc(); const lines = []; installCrashHandlers(proc, (...a) => lines.push(a.join(' '))); return { proc, lines }; }`;
const E5 = nodeBai({
  ten: '5.4 · The two errors that still kill the process: log, then exit', kho: 'MEDIUM', phut: 12,
  en: `<p>Express catches errors <i>inside</i> a request. Two categories live outside any request. Write <code>installCrashHandlers(proc, log)</code> (<code>proc</code> is <code>process</code>; in the grader a fake with <code>on</code> and <code>exit</code>):</p>
<ul><li><code>'unhandledRejection'</code> → <code>log('unhandledRejection', message)</code> then <code>proc.exit(1)</code> — the reason may not be an Error: use <code>reason.message</code> for an Error, <code>String(reason)</code> otherwise;</li><li><code>'uncaughtException'</code> → <code>log('uncaughtException', err.message)</code> then <code>proc.exit(1)</code>.</li></ul><p>Do <b>not</b> keep running: after an uncaught exception the process state is unknown.</p>`,
  vi: `<p>Express bắt lỗi <i>bên trong</i> một request. Hai loại lỗi sống ngoài mọi request. Viết <code>installCrashHandlers(proc, log)</code> (<code>proc</code> là <code>process</code>; trong máy chấm là bản giả có <code>on</code> và <code>exit</code>):</p>
<ul><li><code>'unhandledRejection'</code> → <code>log('unhandledRejection', message)</code> rồi <code>proc.exit(1)</code> — lý do có thể không phải Error: dùng <code>reason.message</code> nếu là Error, <code>String(reason)</code> nếu không;</li><li><code>'uncaughtException'</code> → <code>log('uncaughtException', err.message)</code> rồi <code>proc.exit(1)</code>.</li></ul><p><b>Không</b> được chạy tiếp: sau một uncaught exception trạng thái tiến trình không xác định.</p>`,
  dauVao: ['proc — an EventEmitter with exit(code); log — a function', 'proc — EventEmitter có exit(code); log — một hàm'], dauRa: ['nothing — it registers two listeners', 'không trả gì — nó đăng ký hai listener'],
  goiY: [['Two proc.on(…) calls, each ending with proc.exit(1).', 'Hai lời gọi proc.on(…), mỗi cái kết thúc bằng proc.exit(1).'], ['Promise.reject("nope") gives a string as the reason — no .message.', 'Promise.reject("nope") cho lý do là một chuỗi — không có .message.']],
  loi: [['Logging and carrying on: a half-finished transaction or a corrupted cache keeps serving wrong data.', 'Log rồi chạy tiếp: một transaction dở dang hay cache hỏng tiếp tục phục vụ dữ liệu sai.'], ['exit(0): the supervisor thinks the process stopped on purpose and may not restart it.', 'exit(0): trình giám sát tưởng tiến trình cố ý dừng và có thể không khởi động lại.'], ['reason.message on a string reason → undefined in the log.', 'reason.message trên lý do kiểu chuỗi → undefined trong log.']],
  gt: ['Exit code 1 tells Docker (<code>restart: unless-stopped</code>) or systemd that this was a failure, so it starts a clean process. Combined with graceful shutdown (lesson 5.5) and a supervisor, “crash early” is the safe default — this is why lesson 1.4 spent time on unhandledRejection.', 'Mã thoát 1 báo cho Docker (<code>restart: unless-stopped</code>) hay systemd rằng đây là thất bại, nên nó khởi động một tiến trình sạch. Cùng với tắt êm (bài 5.5) và một trình giám sát, “sập sớm” là mặc định an toàn — đó là lý do bài 1.4 dành thời gian cho unhandledRejection.'],
  kn: ['process', 'errors'], tns: [tn('exit code', 'mã thoát'), tn('crash early', 'sập sớm (fail fast)')],
  chung: PROC,
  dau: `/** log, then exit(1), for errors that live outside any request */
function installCrashHandlers(proc, log) {
  // Write your solution here — this keeps the process alive "to protect users"
  proc.on('uncaughtException', (err) => log('uncaughtException', err.message));
}
`,
  giai: '// Reference solution — log, then let the supervisor restart a clean process\n' + nguon(installCrashHandlers),
  cases: [
    { goi: '(() => { const { proc, lines } = setup(); proc.emit("uncaughtException", new Error("boom")); return { lines, exits: proc.exits }; })()', moTa: ['uncaughtException: log + exit(1)', 'uncaughtException: log + exit(1)'] },
    { goi: '(() => { const { proc, lines } = setup(); proc.emit("unhandledRejection", new Error("db down")); return { lines, exits: proc.exits }; })()', moTa: ['unhandledRejection: log + exit(1)', 'unhandledRejection: log + exit(1)'] },
    { goi: '(() => { const { proc, lines } = setup(); proc.emit("unhandledRejection", "nope"); proc.emit("unhandledRejection", 42); return { lines, exits: proc.exits, listeners: [proc.listenerCount("unhandledRejection"), proc.listenerCount("uncaughtException")] }; })()', an: true },
  ],
});

/* ─── 6. app đầy đủ: thứ tự + mã request ─── */
function requestId(req, res, next) {
  // reuse an id from the proxy if there is one, else make our own
  req.id = req.get('x-request-id') || `req-${++requestId.count}`;
  res.set('X-Request-ID', req.id);
  next();
}
requestId.count = 0;
function errorHandler6(err, req, res, next) {
  if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON');
  const status = err.status || 500;
  const body = { code: err.code || 'INTERNAL', message: status >= 500 ? 'Internal server error' : err.message };
  if (status >= 500) {
    body.requestId = req.id;                              // the id in the user's screenshot finds the stack in one grep
    console.error(`[500] ${req.id} ${err.message}`);
  }
  res.status(status).json({ error: body });
}
function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(requestId);                                     // first: every response gets an id
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/v1/notes', notesRouter());
  app.use(notFound);                                      // after the routes
  app.use(errorHandler6);                                 // last
  return app;
}
const ROUTES = `// ── provided: the routes (do not change) ──
${nguon(AppError, notFound)}
function notesRouter() {
  const r = express.Router();
  r.get('/', (req, res) => res.json({ items: [{ id: 1, title: 'Learning Express' }] }));
  r.get('/:id', (req, res) => { if (req.params.id !== '1') throw new AppError(404, 'NOTE_NOT_FOUND', \`Note \${req.params.id} does not exist\`); res.json({ id: 1, title: 'Learning Express' }); });
  r.post('/', (req, res) => res.status(201).json({ id: 2, ...req.body }));
  r.get('/crash/now', async () => { await new Promise((z) => setTimeout(z, 5)); throw new Error('connect ECONNREFUSED 10.0.0.5:5432'); });
  return r;
}`;
const E6 = nodeBai({
  ten: '5.4 · Wire it: request id, JSON 404 and the handler — in the right order', kho: 'HARD', phut: 30, kit: true, tep: 'app.js',
  en: `<p>The starter “tidied up” <code>createApp()</code> and now <b>every</b> endpoint answers 404. Fix it and add what this site’s error handler does on top of the lesson’s:</p>
<ol><li><code>requestId(req, res, next)</code>: <code>req.id</code> = the incoming <code>X-Request-ID</code> header if present, else <code>"req-1"</code>, <code>"req-2"</code>… (a counter <code>requestId.count</code>, starting at 0); set the response header <code>X-Request-ID</code>; <code>next()</code>;</li>
<li><code>errorHandler6(err, req, res, next)</code>: convert <code>entity.parse.failed</code> → <code>AppError(400, "INVALID_JSON", "Request body is not valid JSON")</code>; status = <code>err.status || 500</code>; body <code>{ error: { code, message } }</code> as in the previous exercise, and for <b>5xx only</b> add <code>requestId: req.id</code> and log <code>console.error(\`[500] \${req.id} \${err.message}\`)</code>;</li>
<li><code>createApp()</code>: <code>x-powered-by</code> disabled, then <code>requestId</code>, <code>express.json()</code>, the notes router at <code>/api/v1/notes</code>, <code>notFound</code>, <code>errorHandler6</code> — in that order.</li></ol><p><code>AppError</code>, <code>notFound</code> and <code>notesRouter()</code> are provided.</p>`,
  vi: `<p>Code khởi đầu đã “dọn dẹp” <code>createApp()</code> và giờ <b>mọi</b> endpoint đều trả 404. Sửa nó và thêm thứ mà error handler của trang này làm thêm so với bài:</p>
<ol><li><code>requestId(req, res, next)</code>: <code>req.id</code> = header <code>X-Request-ID</code> gửi tới nếu có, ngược lại <code>"req-1"</code>, <code>"req-2"</code>… (bộ đếm <code>requestId.count</code>, bắt đầu từ 0); đặt header phản hồi <code>X-Request-ID</code>; <code>next()</code>;</li>
<li><code>errorHandler6(err, req, res, next)</code>: đổi <code>entity.parse.failed</code> → <code>AppError(400, "INVALID_JSON", "Request body is not valid JSON")</code>; status = <code>err.status || 500</code>; thân <code>{ error: { code, message } }</code> như bài trước, và <b>chỉ với 5xx</b> thêm <code>requestId: req.id</code> và log <code>console.error(\`[500] \${req.id} \${err.message}\`)</code>;</li>
<li><code>createApp()</code>: tắt <code>x-powered-by</code>, rồi <code>requestId</code>, <code>express.json()</code>, router notes ở <code>/api/v1/notes</code>, <code>notFound</code>, <code>errorHandler6</code> — đúng thứ tự đó.</li></ol><p>Có sẵn <code>AppError</code>, <code>notFound</code> và <code>notesRouter()</code>.</p>`,
  yc: [['notFound and the error handler come after the router; the error handler is last.', 'notFound và error handler đứng sau router; error handler là cuối cùng.'], ['A 4xx response has no requestId field and logs nothing.', 'Phản hồi 4xx không có trường requestId và không log gì.']],
  goiY: [['Read the starter’s createApp top to bottom and ask, for GET /api/v1/notes, who answers first.', 'Đọc createApp của code khởi đầu từ trên xuống và hỏi, với GET /api/v1/notes, ai trả lời trước.'], ['requestId.count is a property on the function itself — ++requestId.count.', 'requestId.count là thuộc tính trên chính hàm — ++requestId.count.'], ['Build the body object first, then add requestId only when status >= 500.', 'Dựng object thân trước, rồi chỉ thêm requestId khi status >= 500.']],
  loi: [['notFound above the router: app.use with no path matches everything.', 'notFound trên router: app.use không có path khớp mọi thứ.'], ['requestId registered after the router: the 500 has no id to report.', 'requestId đăng ký sau router: lỗi 500 không có id để báo.'], ['Sending the id in every error: harmless, but 4xx are the client’s problem — the id is for finding OUR stack trace.', 'Gửi id trong mọi lỗi: vô hại, nhưng 4xx là chuyện của client — id dùng để tìm stack trace của MÌNH.']],
  gt: ['“When someone reports ‘it failed’, the id in their screenshot finds the exact stack trace in the logs in one grep — instead of guessing which of four hundred 500s that day was theirs.” Reusing an incoming <code>X-Request-ID</code> lets the id follow a request through Nginx and other services.', '“Khi ai đó báo ‘nó lỗi’, id trong ảnh chụp màn hình của họ tìm ra đúng stack trace trong log bằng một lệnh grep — thay vì đoán xem lỗi 500 nào trong bốn trăm lỗi hôm đó là của họ.” Dùng lại <code>X-Request-ID</code> gửi tới giúp id đi theo request qua Nginx và các dịch vụ khác.'],
  kn: ['Express', 'errors', 'observability'], tns: [tn('request id', 'mã định danh request'), tn('correlation', 'liên kết log của cùng một request')],
  chung: 'const s = (r) => ({ status: r.status, id: r.headers["x-request-id"] || null, powered: r.headers["x-powered-by"] || null, body: r.body ?? null });',
  dau: `${ROUTES}
/** stamps every request with an id */
function requestId(req, res, next) {
  // Write your solution here
  next();
}
requestId.count = 0;
/** the error handler, with a request id on 5xx */
function errorHandler6(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL', message: status >= 500 ? 'Internal server error' : err.message } });
}
/** the app — tidied up, and now everything is a 404 */
function createApp() {
  const app = express();
  app.use(requestId);
  app.use(express.json({ limit: '100kb' }));
  app.use(notFound);
  app.use(errorHandler6);
  app.use('/api/v1/notes', notesRouter());
  return app;
}
`,
  giai: `${ROUTES}
// Reference solution — id first, router, then 404, then the handler with the id on 5xx
${nguon(requestId, 'requestId.count = 0;', errorHandler6, createApp)}`,
  cases: [
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "GET", "/api/v1/notes")), s(await request(app, "GET", "/api/v1/notes/1"))]', moTa: ['Routes answer again; ids req-1, req-2; no X-Powered-By', 'Route trả lời lại; id req-1, req-2; không có X-Powered-By'] },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "GET", "/api/v1/notes/42")), s(await request(app, "GET", "/api/v1/khong-co")), __log]', moTa: ['404s: no requestId in the body, nothing logged', 'Các 404: không có requestId trong thân, không log gì'] },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "GET", "/api/v1/notes/crash/now")), __log]', moTa: ['A 500 carries the id, and the log line has it too', 'Lỗi 500 mang id, và dòng log cũng có'] },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: "{title:}", headers: { "X-Request-ID": "nginx-abc" } })), s(await request(app, "GET", "/api/v1/notes/crash/now", { headers: { "x-request-id": "nginx-def" } })), __log.filter((l) => l.startsWith("[500]"))]', an: true },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: { title: "Second note" } })), s(await request(app, "DELETE", "/api/v1/notes"))]', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-4-xu-ly-loi', ten: '5.4 Centralised error handling', khoa: KHOA, baiHoc: 'nodejs-5-4-xu-ly-loi', de: [E1, E2, E3, E4, E5, E6] });
