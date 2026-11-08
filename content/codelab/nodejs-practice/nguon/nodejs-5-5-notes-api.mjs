/** Node.js 5.5 — Ráp Notes API: service không biết HTTP, router chỉ dịch HTTP (201 + Location, 422, 404, 204), và tắt êm khi SIGTERM. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '5.5 · Why the Notes API is split the way it is', kho: 'EASY', phut: 6,
  en: 'Questions on the file layout (index / app / routes / services / middleware), on the curl session and on the SIGTERM experiment of the lesson.',
  vi: 'Các câu về cách chia tệp (index / app / routes / services / middleware), về phiên curl và thí nghiệm SIGTERM của bài.',
  cau: [
    q('c1', ['A service needs the id of the current user. The lesson’s rule says…', 'Một service cần id của người dùng hiện tại. Luật của bài nói…'],
      ['Take a userId argument — a service never imports or receives req/res', 'Pass req to the service so it can read req.user itself', 'Store the user in a global set by a middleware', 'Read it from a cookie inside the service'],
      ['That single restriction lets you call the same function from a route, a background job (ch. 13) and a test (ch. 14) without a fake HTTP request.', 'Chỉ một ràng buộc đó cho phép gọi cùng hàm từ route, từ việc nền (ch. 13) và từ test (ch. 14) mà không cần request HTTP giả.']),
    q('c2', ['Why does <code>createApp()</code> return the app instead of calling <code>listen()</code>?', 'Vì sao <code>createApp()</code> trả về app thay vì gọi <code>listen()</code>?'],
      ['Tests can build it with no port, no socket and nothing to clean up', 'Because listen() is deprecated in Express 5 and prints a warning', 'It makes the app start faster in production, since nothing listens', 'Express cannot call listen() from inside a function, only at top level'],
      ['Any file that calls app.listen() at import time is a file you cannot test without starting a server. index.mjs owns the port and the signals.', 'Tệp nào gọi app.listen() ngay lúc import là tệp không test được nếu không khởi động server. index.mjs sở hữu cổng và tín hiệu.']),
    q('c3', ['<code>POST /api/v1/notes</code> succeeds. What does the lesson’s response contain?', '<code>POST /api/v1/notes</code> thành công. Phản hồi của bài gồm gì?'],
      ['201, a Location header (/api/v1/notes/1) and the note as JSON', '200 OK and a small JSON body that says { "ok": true }', '204 No Content with a Location header and no body at all', '201 Created and the full list of notes, including the new one'],
      ['201 with a Location pointing at the created resource is what “created” means in HTTP; chapter 6 makes it a habit.', '201 kèm Location trỏ tới tài nguyên vừa tạo là ý nghĩa của “created” trong HTTP; chương 6 biến nó thành thói quen.']),
    q('c4', ['Docker sends SIGTERM during a deploy while a 3-second request is running. With the lesson’s handler…', 'Docker gửi SIGTERM lúc deploy trong khi một request 3 giây đang chạy. Với handler của bài…'],
      ['server.close() stops new connections, the slow request finishes with 200, then the process exits 0', 'the process exits immediately and the client gets a connection reset', 'the slow request is restarted on the new container', 'Docker waits forever because the request has not finished'],
      ['Measured in the lesson: “/slow responded … clean exit, client {"done":true} [200]”. Without the handler every deploy silently kills whatever was in flight (Docker sends SIGKILL ~10 s later).', 'Đo trong bài: “/slow responded … clean exit, client {"done":true} [200]”. Không có handler, mọi lần deploy âm thầm giết những gì đang chạy (Docker gửi SIGKILL ~10 giây sau).']),
  ],
  goiY: [['Ask of each file: what does it know about HTTP?', 'Hỏi với từng tệp: nó biết gì về HTTP?'], ['“Graceful” means: finish what is in flight, accept nothing new.', '“Êm” nghĩa là: làm xong những gì đang chạy, không nhận thêm gì mới.']],
  loi: [['Passing req into services “to save time”.', 'Truyền req vào service “cho nhanh”.'], ['Calling process.exit() straight away on SIGTERM.', 'Gọi process.exit() ngay khi nhận SIGTERM.']],
  tns: [tn('layered structure', 'cấu trúc phân tầng'), tn('graceful shutdown', 'tắt êm'), tn('SIGTERM', 'tín hiệu yêu cầu dừng')],
  kn: ['architecture', 'Express'],
});

/* ─── 2. service ─── */
function createNotesService() {
  const notes = new Map();      // in memory for now; chapter 7 swaps THIS file for PostgreSQL
  let nextId = 1;               // never reused, even after a delete
  const copy = (n) => ({ ...n });   // callers get copies: they cannot change the store behind our back
  return {
    list({ page = 1, limit = 10, q } = {}) {
      let all = [...notes.values()];
      if (q) {
        const needle = String(q).toLowerCase();
        all = all.filter((n) => n.title.toLowerCase().includes(needle) || n.body.toLowerCase().includes(needle));
      }
      const items = all.slice((page - 1) * limit, page * limit).map(copy);
      return { items, page, limit, total: all.length };
    },
    get(id) {
      const n = notes.get(id);
      return n ? copy(n) : null;
    },
    create({ title, body = '' }) {
      const note = { id: nextId++, title, body, createdAt: new Date(Date.now()).toISOString() };
      notes.set(note.id, note);
      return copy(note);
    },
    update(id, patch) {
      const n = notes.get(id);
      if (!n) return null;
      if (patch.title !== undefined) n.title = patch.title;   // only the fields that were sent
      if (patch.body !== undefined) n.body = patch.body;
      return copy(n);
    },
    remove(id) {
      return notes.delete(id);
    },
  };
}
const E2 = nodeBai({
  ten: '5.5 · notes.service: business rules with zero HTTP knowledge', kho: 'MEDIUM', phut: 20, tep: 'notes.service.js',
  en: `<p>Write <code>createNotesService()</code> — the file chapter 7 will swap for PostgreSQL without touching the router. It returns an object with:</p>
<ul><li><code>create({ title, body = '' })</code> → <code>{ id, title, body, createdAt }</code>: ids start at 1 and are <b>never reused</b>; <code>createdAt = new Date(Date.now()).toISOString()</code>;</li><li><code>get(id)</code> → the note or <code>null</code>;</li><li><code>list({ page = 1, limit = 10, q })</code> → <code>{ items, page, limit, total }</code> in id order; <code>q</code> keeps notes whose title or body contains it, case-insensitively; <code>total</code> counts after filtering, before paging;</li><li><code>update(id, patch)</code> → changes only the <code>title</code>/<code>body</code> fields present in patch; returns the note or <code>null</code>;</li><li><code>remove(id)</code> → <code>true</code> if it existed.</li></ul><p>Return <b>copies</b>: changing an object you got back must not change the store. And no <code>req</code>, no <code>res</code> anywhere in this file.</p>`,
  vi: `<p>Viết <code>createNotesService()</code> — tệp mà chương 7 sẽ thay bằng PostgreSQL mà không chạm vào router. Nó trả về object có:</p>
<ul><li><code>create({ title, body = '' })</code> → <code>{ id, title, body, createdAt }</code>: id bắt đầu từ 1 và <b>không bao giờ dùng lại</b>; <code>createdAt = new Date(Date.now()).toISOString()</code>;</li><li><code>get(id)</code> → ghi chú hoặc <code>null</code>;</li><li><code>list({ page = 1, limit = 10, q })</code> → <code>{ items, page, limit, total }</code> theo thứ tự id; <code>q</code> giữ ghi chú có title hoặc body chứa nó, không phân biệt hoa thường; <code>total</code> đếm sau khi lọc, trước khi phân trang;</li><li><code>update(id, patch)</code> → chỉ đổi các trường <code>title</code>/<code>body</code> có trong patch; trả ghi chú hoặc <code>null</code>;</li><li><code>remove(id)</code> → <code>true</code> nếu nó từng tồn tại.</li></ul><p>Trả về <b>bản sao</b>: sửa object nhận được không được làm đổi kho. Và không có <code>req</code>, không có <code>res</code> ở đâu trong tệp này.</p>`,
  dauVao: ['plain arguments (ids are numbers)', 'đối số thường (id là số)'], dauRa: ['plain objects — never HTTP', 'object thường — không bao giờ là HTTP'],
  goiY: [['A Map keyed by id keeps insertion order — that is your id order.', 'Map theo id giữ thứ tự chèn — đó chính là thứ tự id.'], ['Keep nextId in the closure; increment it on create only.', 'Giữ nextId trong closure; chỉ tăng khi create.'], ['slice((page - 1) * limit, page * limit) after filtering.', 'slice((page - 1) * limit, page * limit) sau khi lọc.']],
  loi: [['id = notes.size + 1: delete note 1 of 2, create again, and two notes share id 2.', 'id = notes.size + 1: xoá ghi chú 1 trong 2, tạo lại, và hai ghi chú cùng id 2.'], ['Returning the stored object: the router (or a test) mutates it and the store changes silently.', 'Trả về chính object đang lưu: router (hay test) sửa nó và kho âm thầm đổi theo.'], ['total = items.length: the frontend then thinks there is only one page.', 'total = items.length: frontend tưởng chỉ có một trang.']],
  gt: ['Everything in this file can be called from a route, a job or a test with plain values — exactly the property the lesson builds the whole layout around. The grader’s clock starts at 2026-01-01T00:00:00Z, so createdAt values are deterministic.', 'Mọi thứ trong tệp này gọi được từ route, việc nền hay test bằng giá trị thường — đúng tính chất mà bài dựng cả bố cục xoay quanh. Đồng hồ của máy chấm bắt đầu ở 2026-01-01T00:00:00Z, nên giá trị createdAt cố định.'],
  kn: ['architecture', 'services'], tns: [tn('service layer', 'tầng nghiệp vụ'), tn('defensive copy', 'bản sao phòng thủ')],
  dau: `/** the notes business rules — no req, no res */
function createNotesService() {
  // Write your solution here — this version leaks its internals and reuses ids
  const notes = [];
  return {
    list({ page = 1, limit = 10 } = {}) { const items = notes.slice((page - 1) * limit, page * limit); return { items, page, limit, total: items.length }; },
    get(id) { return notes.find((n) => n.id === id) || null; },
    create({ title, body = '' }) { const note = { id: notes.length + 1, title, body, createdAt: new Date(Date.now()).toISOString() }; notes.push(note); return note; },
    update(id, patch) { const n = notes.find((x) => x.id === id); if (!n) return null; Object.assign(n, patch); return n; },
    remove(id) { const i = notes.findIndex((n) => n.id === id); if (i < 0) return false; notes.splice(i, 1); return true; },
  };
}
`,
  giai: '// Reference solution — a Map, a counter, and copies on the way out\n' + nguon(createNotesService),
  cases: [
    { goi: '(() => { const s = createNotesService(); s.create({ title: "Learning Express", body: "chapter 5" }); s.create({ title: "Second note" }); return [s.list({ page: 1, limit: 10 }), s.list({ q: "EXPRESS" }).total]; })()', moTa: ['The lesson’s list and ?q=express', 'Danh sách và ?q=express của bài'] },
    { goi: '(() => { const s = createNotesService(); s.create({ title: "a" }); s.create({ title: "b" }); s.remove(1); return [s.create({ title: "c" }).id, s.get(1), s.remove(1)]; })()', moTa: ['Ids are never reused', 'id không bao giờ dùng lại'] },
    { goi: '(() => { const s = createNotesService(); s.create({ title: "Learning Express", body: "chapter 5" }); return [s.update(1, { body: "edited" }), s.update(9, { body: "x" })]; })()', moTa: ['PATCH changes only the fields sent', 'PATCH chỉ đổi các trường được gửi'] },
    { goi: '(() => { const s = createNotesService(); const n = s.create({ title: "safe" }); n.title = "hacked"; s.get(1).body = "hacked too"; s.list().items[0].title = "again"; return s.get(1); })()', an: true },
    { goi: '(() => { const s = createNotesService(); for (let i = 1; i <= 23; i++) s.create({ title: "note " + i, body: i % 2 ? "odd" : "even" }); return [s.list({ page: 3, limit: 10 }).items.map((n) => n.id), s.list({ page: 2, limit: 5, q: "ODD" }), s.list({ page: 9 }).items.length]; })()', an: true },
    { goi: '(() => { const s = createNotesService(); s.create({ title: "x" }); return [s.update(1, { title: undefined }), s.update(1, { title: "y", extra: 1 })]; })()', an: true },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'The service never mentions req or res', vi: 'Service không nhắc tới req hay res' }, khop: '\\breq\\b|\\bres\\b', phuDinh: true }],
});

/* ─── 3. router: chỉ HTTP ─── */
const PROVIDED = `// ── provided: errors.js and the service (from the previous exercises) ──
class AppError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
function notFound(req, res) { res.status(404).json({ error: { code: 'NOT_FOUND', message: \`Cannot \${req.method} \${req.path}\` } }); }
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON');
  const status = err.status || 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL', message: status >= 500 ? 'Internal server error' : err.message } });
}
${nguon(createNotesService)}`;
function notesRouter(service) {
  const router = express.Router();
  router.get('/', (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 10), 50);
    res.json(service.list({ page, limit, q: req.query.q }));
  });
  router.get('/:id', (req, res) => {
    const note = service.get(Number(req.params.id));
    if (!note) throw new AppError(404, 'NOTE_NOT_FOUND', `Note ${req.params.id} does not exist`);   // no try/catch: the handler gets it
    res.json(note);
  });
  router.post('/', (req, res) => {
    const { title, body } = req.body ?? {};
    if (typeof title !== 'string' || title.trim() === '') throw new AppError(422, 'VALIDATION_FAILED', 'title is required');
    const note = service.create({ title: title.trim(), body: body ?? '' });
    res.status(201).location(`/api/v1/notes/${note.id}`).json(note);   // "created" in HTTP = 201 + Location
  });
  router.patch('/:id', (req, res) => {
    const { title, body } = req.body ?? {};
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) throw new AppError(422, 'VALIDATION_FAILED', 'title must not be empty');
    const note = service.update(Number(req.params.id), { title: title === undefined ? undefined : title.trim(), body });
    if (!note) throw new AppError(404, 'NOTE_NOT_FOUND', `Note ${req.params.id} does not exist`);
    res.json(note);
  });
  router.delete('/:id', (req, res) => {
    if (!service.remove(Number(req.params.id))) throw new AppError(404, 'NOTE_NOT_FOUND', `Note ${req.params.id} does not exist`);
    res.status(204).end();
  });
  return router;
}
const APP = `function createApp() { const app = express(); app.disable('x-powered-by'); app.use(express.json({ limit: '100kb' }));
app.get('/health', (req, res) => res.json({ status: 'ok' })); app.use('/api/v1/notes', notesRouter(createNotesService()));
app.use(notFound); app.use(errorHandler); return app; }
const s = (r) => ({ status: r.status, location: r.headers.location || null, body: r.body ?? null });`;
const E3 = nodeBai({
  ten: '5.5 · notes.routes: HTTP in, status codes out', kho: 'MEDIUM', phut: 25, kit: true, tep: 'notes.routes.js',
  en: `<p>Write <code>notesRouter(service)</code> — “HTTP, and nothing else”. The service, <code>AppError</code>, <code>notFound</code>, <code>errorHandler</code> and <code>createApp()</code> (which mounts your router at <code>/api/v1/notes</code> after <code>express.json()</code>) are provided. No try/catch: <b>throw</b> an <code>AppError</code> and the error handler answers.</p>
<table><thead><tr><th>route</th><th>success</th><th>errors</th></tr></thead><tbody>
<tr><td>GET /</td><td>200 <code>service.list({ page, limit, q })</code> — page = <code>Number(req.query.page ?? 1)</code>, limit = <code>Math.min(Number(req.query.limit ?? 10), 50)</code></td><td></td></tr>
<tr><td>GET /:id</td><td>200 the note</td><td>404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”</td></tr>
<tr><td>POST /</td><td>201 + header <code>Location: /api/v1/notes/&lt;id&gt;</code> + the note (title trimmed, body default <code>""</code>)</td><td>422 <code>VALIDATION_FAILED</code> “title is required”</td></tr>
<tr><td>PATCH /:id</td><td>200 the updated note</td><td>422 “title must not be empty” if a title is sent but blank · 404</td></tr>
<tr><td>DELETE /:id</td><td>204, no body</td><td>404</td></tr></tbody></table>`,
  vi: `<p>Viết <code>notesRouter(service)</code> — “HTTP, và không gì khác”. Có sẵn service, <code>AppError</code>, <code>notFound</code>, <code>errorHandler</code> và <code>createApp()</code> (gắn router của bạn ở <code>/api/v1/notes</code> sau <code>express.json()</code>). Không try/catch: <b>throw</b> một <code>AppError</code> và error handler sẽ trả lời.</p>
<table><thead><tr><th>route</th><th>thành công</th><th>lỗi</th></tr></thead><tbody>
<tr><td>GET /</td><td>200 <code>service.list({ page, limit, q })</code> — page = <code>Number(req.query.page ?? 1)</code>, limit = <code>Math.min(Number(req.query.limit ?? 10), 50)</code></td><td></td></tr>
<tr><td>GET /:id</td><td>200 ghi chú</td><td>404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”</td></tr>
<tr><td>POST /</td><td>201 + header <code>Location: /api/v1/notes/&lt;id&gt;</code> + ghi chú (title đã trim, body mặc định <code>""</code>)</td><td>422 <code>VALIDATION_FAILED</code> “title is required”</td></tr>
<tr><td>PATCH /:id</td><td>200 ghi chú đã sửa</td><td>422 “title must not be empty” nếu gửi title mà rỗng · 404</td></tr>
<tr><td>DELETE /:id</td><td>204, không thân</td><td>404</td></tr></tbody></table>`,
  yc: [['No try/catch and no res.status(4xx) in the router: throw AppError.', 'Không try/catch và không res.status(4xx) trong router: throw AppError.'], ['Convert req.params.id with Number before calling the service.', 'Đổi req.params.id bằng Number trước khi gọi service.']],
  goiY: [['The lesson shows GET /, GET /:id, POST / and DELETE /:id almost line for line.', 'Bài cho GET /, GET /:id, POST / và DELETE /:id gần như từng dòng.'], ['res.status(201).location(url).json(note) — three chained calls.', 'res.status(201).location(url).json(note) — ba lời gọi nối tiếp.'], ['For PATCH, validate only what was sent: title === undefined means “do not change it”.', 'Với PATCH, chỉ kiểm thứ được gửi: title === undefined nghĩa là “đừng đổi”.']],
  loi: [['service.get(req.params.id): the Map has number keys, every lookup 404s.', 'service.get(req.params.id): Map dùng khoá số, mọi lần tra đều 404.'], ['Answering 200 to a POST, or 201 without Location.', 'Trả 200 cho POST, hoặc 201 mà thiếu Location.'], ['Sending a JSON body with 204.', 'Gửi thân JSON kèm 204.']],
  gt: ['The grader replays the lesson’s curl session against your router: 201 · 422 · 200 · 200 · 404 · 200 · 204 · 404, every error in the same <code>{ error: { code, message } }</code> shape. What is left in the router is only what you can decide: which status code, which validation, which service call.', 'Máy chấm phát lại phiên curl của bài trên router của bạn: 201 · 422 · 200 · 200 · 404 · 200 · 204 · 404, mọi lỗi cùng dạng <code>{ error: { code, message } }</code>. Những gì còn lại trong router chỉ là thứ bạn quyết định được: mã trạng thái nào, kiểm tra gì, gọi service nào.'],
  kn: ['Express', 'REST'], tns: [tn('Location header', 'header trỏ tới tài nguyên vừa tạo'), tn('PATCH', 'sửa một phần')],
  chung: APP,
  dau: `${PROVIDED}
/** the notes router: HTTP in, status codes out */
function notesRouter(service) {
  const router = express.Router();
  // Write your solution here
  router.get('/', (req, res) => res.json(service.list({})));
  router.post('/', (req, res) => {
    const note = service.create(req.body);
    res.json(note);
  });
  return router;
}
`,
  giai: `${PROVIDED}
// Reference solution — translate HTTP to service calls; errors are thrown, not answered here
${nguon(notesRouter)}`,
  cases: [
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: { title: "Learning Express", body: "chapter 5" } })), s(await request(app, "POST", "/api/v1/notes", { body: { body: "no title" } }))]', moTa: ['201 + Location, then 422', '201 + Location, rồi 422'] },
    { chuanBi: 'const app = createApp(); await request(app, "POST", "/api/v1/notes", { body: { title: "Learning Express", body: "chapter 5" } }); await request(app, "POST", "/api/v1/notes", { body: { title: "Second note" } });', goi: '[s(await request(app, "GET", "/api/v1/notes?page=1&limit=10")), s(await request(app, "GET", "/api/v1/notes?q=express")), s(await request(app, "GET", "/api/v1/notes/999"))]', moTa: ['List, search, 404', 'Danh sách, tìm kiếm, 404'] },
    { chuanBi: 'const app = createApp(); await request(app, "POST", "/api/v1/notes", { body: { title: "Learning Express", body: "chapter 5" } }); await request(app, "POST", "/api/v1/notes", { body: { title: "Second note" } });', goi: '[s(await request(app, "PATCH", "/api/v1/notes/1", { body: { body: "edited" } })), s(await request(app, "DELETE", "/api/v1/notes/2")), s(await request(app, "GET", "/api/v1/khong-co"))]', moTa: ['PATCH 200, DELETE 204, JSON 404', 'PATCH 200, DELETE 204, 404 JSON'] },
    { chuanBi: 'const app = createApp(); await request(app, "POST", "/api/v1/notes", { body: { title: "a" } });', goi: '[s(await request(app, "PATCH", "/api/v1/notes/1", { body: { title: "  " } })), s(await request(app, "PATCH", "/api/v1/notes/7", { body: { body: "x" } })), s(await request(app, "DELETE", "/api/v1/notes/7")), s(await request(app, "DELETE", "/api/v1/notes/1")), s(await request(app, "GET", "/api/v1/notes/1"))]', an: true },
    { chuanBi: 'const app = createApp(); for (let i = 0; i < 60; i++) await request(app, "POST", "/api/v1/notes", { body: { title: " n" + i + " " } });', goi: '[(await request(app, "GET", "/api/v1/notes?limit=1000")).body.items.length, (await request(app, "GET", "/api/v1/notes?page=2&limit=25")).body.items[0], (await request(app, "GET", "/api/v1/notes")).body.total]', an: true },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: "{broken" })), s(await request(app, "POST", "/api/v1/notes", { body: { title: 42 } })), s(await request(app, "POST", "/api/v1/notes", { body: { title: "x" }, headers: { "content-type": "text/plain" } }))]', an: true },
  ],
});

/* ─── 4. tắt êm ─── */
function shutdown(signal, server, proc, timers) {
  if (shutdown.started) return;                 // a second Ctrl+C while draining must not close twice
  shutdown.started = true;
  console.log(`${signal}: no longer accepting connections, draining…`);
  // keep sweeping: a connection that is busy now turns keep-alive idle later and would otherwise wait 5 s
  const sweep = timers.setInterval(() => server.closeIdleConnections(), 100);
  server.close(() => {                          // stop accepting, finish what is in flight
    timers.clearInterval(sweep);
    console.log('all in-flight requests done — clean exit');
    proc.exit(0);
  });
  timers.setTimeout(() => proc.exit(1), 10_000).unref();   // hard cap — unref so it never keeps us alive
}
const SERVER = `// virtual-clock model of node:http's server for one shutdown (keepAliveTimeout = 5000 ms)
function scenario(busyUntil, signalAt) { const T0 = Date.now(); const log = []; const out = { exits: [], closeCalls: 0, sweeps: 0 };
const conns = busyUntil.map((b) => ({ busyUntil: b, closed: false }));
let closing = false, closeCb = null;
const now = () => Date.now() - T0;
const idle = (c) => !c.closed && now() >= c.busyUntil;
const finish = () => { if (closing && closeCb && conns.every((c) => c.closed)) { const cb = closeCb; closeCb = null; setTimeout(cb, 0); } };
conns.forEach((c) => { setTimeout(() => { log.push(now() + 'ms request done'); setTimeout(() => { if (!c.closed) { c.closed = true; log.push(now() + 'ms keep-alive timeout closed a connection'); finish(); } }, 5000); }, c.busyUntil); });
const server = { close(cb) { out.closeCalls++; if (closing) { setTimeout(() => cb(Object.assign(new Error('Server is not running.'), { code: 'ERR_SERVER_NOT_RUNNING' })), 0); return; } closing = true; closeCb = cb; conns.forEach((c) => { if (idle(c)) c.closed = true; }); finish(); },
  closeIdleConnections() { out.sweeps++; conns.forEach((c) => { if (idle(c)) c.closed = true; }); finish(); } };
const timers = { handles: [], setTimeout(fn, ms) { const h = { id: setTimeout(fn, ms), unrefed: false, unref() { h.unrefed = true; return h; } }; timers.handles.push(h); return h; },
  setInterval(fn, ms) { const h = { id: setInterval(fn, ms), cleared: false, unref() { return h; } }; timers.handles.push(h); return h; }, clearInterval(h) { clearInterval(h.id); h.cleared = true; }, clearTimeout(h) { clearTimeout(h.id); } };
return new Promise((resolve) => { const proc = { exit(code) { out.exits.push([code, now()]); resolve({ exitCode: code, exitAt: now(), closeCalls: out.closeCalls, hardCapUnref: timers.handles.some((h) => h.unrefed), sweepCleared: timers.handles.filter((h) => 'cleared' in h).every((h) => h.cleared), logs: __log.slice() }); } };
  setTimeout(() => { shutdown.started = false; shutdown('SIGTERM', server, proc, timers); }, signalAt); }); }`;
const E4 = nodeBai({
  ten: '5.5 · Graceful shutdown that actually finishes in time', kho: 'HARD', phut: 30,
  en: `<p>Write <code>shutdown(signal, server, proc, timers)</code>, called on SIGTERM/SIGINT (<code>timers</code> = Node’s <code>setTimeout/setInterval/clearInterval</code>, whose handles have <code>unref()</code>):</p>
<ol><li><code>console.log(\`\${signal}: no longer accepting connections, draining…\`)</code>;</li><li><code>server.close(cb)</code> — in <code>cb</code>: stop the sweep, <code>console.log('all in-flight requests done — clean exit')</code>, <code>proc.exit(0)</code>;</li><li>a <b>hard cap</b>: <code>timers.setTimeout(() =&gt; proc.exit(1), 10000)</code>, <code>.unref()</code>’d;</li><li>the lesson’s measured fix: a request busy when shutdown starts leaves a keep-alive connection that stays open 5 s more. <b>Keep sweeping</b> — <code>timers.setInterval(() =&gt; server.closeIdleConnections(), 100)</code> — and clear that interval in the close callback (8.5 s → 2.5 s in the lesson);</li><li>a second signal while draining does nothing (set <code>shutdown.started</code>).</li></ol><p>The grader models node:http on its virtual clock: SIGTERM at 500 ms while a request runs until 3000 ms.</p>`,
  vi: `<p>Viết <code>shutdown(signal, server, proc, timers)</code>, được gọi khi nhận SIGTERM/SIGINT (<code>timers</code> = <code>setTimeout/setInterval/clearInterval</code> của Node, handle của chúng có <code>unref()</code>):</p>
<ol><li><code>console.log(\`\${signal}: no longer accepting connections, draining…\`)</code>;</li><li><code>server.close(cb)</code> — trong <code>cb</code>: dừng vòng quét, <code>console.log('all in-flight requests done — clean exit')</code>, <code>proc.exit(0)</code>;</li><li>một <b>trần cứng</b>: <code>timers.setTimeout(() =&gt; proc.exit(1), 10000)</code>, có <code>.unref()</code>;</li><li>cách sửa đã đo của bài: request đang bận lúc bắt đầu tắt để lại một kết nối keep-alive mở thêm 5 giây. <b>Quét liên tục</b> — <code>timers.setInterval(() =&gt; server.closeIdleConnections(), 100)</code> — và xoá interval đó trong callback của close (bài đo: 8,5 s → 2,5 s);</li><li>tín hiệu thứ hai trong lúc đang rút cạn thì không làm gì (đặt <code>shutdown.started</code>).</li></ol><p>Máy chấm mô phỏng node:http trên đồng hồ ảo: SIGTERM lúc 500 ms trong khi một request chạy tới 3000 ms.</p>`,
  dauVao: ['signal; server { close, closeIdleConnections }; proc { exit }; timers', 'signal; server { close, closeIdleConnections }; proc { exit }; timers'], dauRa: ['nothing — the process exits through proc.exit', 'không trả gì — tiến trình thoát qua proc.exit'],
  goiY: [['Start with the lesson’s shutdown() and add two lines: the interval and its clearInterval.', 'Bắt đầu từ shutdown() của bài và thêm hai dòng: interval và clearInterval của nó.'], ['Calling closeIdleConnections() once, right after close(), changes nothing — the connection is still busy at that moment.', 'Gọi closeIdleConnections() một lần ngay sau close() không đổi gì — lúc đó kết nối vẫn đang bận.'], ['A function is an object: shutdown.started works as a flag.', 'Hàm là một object: shutdown.started dùng làm cờ được.']],
  loi: [['proc.exit() on the spot: the in-flight request dies with the deploy.', 'proc.exit() ngay lập tức: request đang chạy chết theo lần deploy.'], ['No hard cap: a leaked connection keeps the process alive forever — until Docker’s SIGKILL.', 'Không có trần cứng: một kết nối rò giữ tiến trình sống mãi — cho tới SIGKILL của Docker.'], ['Forgetting unref(): the 10-second timer itself keeps a healthy process alive for 10 seconds.', 'Quên unref(): chính bộ hẹn giờ 10 giây giữ một tiến trình khoẻ mạnh sống thêm 10 giây.']],
  gt: ['On the model, the lesson’s version (close + hard cap, no sweep) exits at 8000 ms: the slow request ends at 3000 and its keep-alive connection waits out the 5 s timeout. With the sweep it exits at 3000–3100 ms; a request stuck past the cap ends with exit(1) at 10.5 s. These are the lesson’s Node 22 measurements, reproduced on a virtual clock.', 'Trên mô hình, bản của bài (close + trần cứng, không quét) thoát lúc 8000 ms: request chậm xong lúc 3000 và kết nối keep-alive của nó chờ hết 5 giây. Có quét thì thoát lúc 3000–3100 ms; request kẹt quá trần kết thúc bằng exit(1) lúc 10,5 s. Đây là các số đo Node 22 của bài, tái hiện trên đồng hồ ảo.'],
  kn: ['process', 'http', 'deploy'], tns: [tn('keep-alive', 'giữ kết nối mở cho request sau'), tn('unref()', 'không giữ tiến trình sống vì bộ hẹn giờ này'), tn('SIGKILL', 'tín hiệu giết tiến trình, không bắt được')],
  chung: SERVER,
  dau: `/** stop accepting, finish what is in flight, then exit */
function shutdown(signal, server, proc, timers) {
  // Write your solution here — the lesson's first version: no sweep, no guard
  console.log(\`\${signal}: no longer accepting connections, draining…\`);
  server.close(() => {
    console.log('all in-flight requests done — clean exit');
    proc.exit(0);
  });
  timers.setTimeout(() => proc.exit(1), 10_000).unref();
}
`,
  giai: '// Reference solution — close, sweep idle keep-alive connections, hard cap, run once\n' + nguon(shutdown),
  cases: [
    { timeoutMs: 20000, goi: '(await scenario([3000], 500))', moTa: ['The lesson’s /slow request: exits 0 soon after 3000 ms', 'Request /slow của bài: thoát 0 ngay sau 3000 ms'] },
    { timeoutMs: 20000, goi: '(await scenario([], 200))', moTa: ['Nothing in flight: exits 0 at once', 'Không có gì đang chạy: thoát 0 ngay'] },
    { timeoutMs: 20000, goi: '(await scenario([20000], 500))', moTa: ['A stuck request: the hard cap exits 1 at 10.5 s', 'Request kẹt: trần cứng thoát 1 lúc 10,5 s'] },
    { timeoutMs: 20000, goi: '(await scenario([1000, 3000, 2500], 600))', an: true },
    { timeoutMs: 20000, goi: '(await new Promise((r) => { const p = scenario([2000], 300); setTimeout(() => shutdown("SIGINT", { close() { throw new Error("closed twice"); }, closeIdleConnections() {} }, { exit() {} }, { setTimeout: () => ({ unref() {} }), setInterval: () => ({}), clearInterval() {} }), 400); p.then(r); }))', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-5-notes-api', ten: '5.5 Assembling the Notes API', khoa: KHOA, baiHoc: 'nodejs-5-5-notes-api', de: [E1, E2, E3, E4] });
