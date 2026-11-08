/** Node.js · Lab chương 5 — Notes API v2 bằng Express (tag, tìm kiếm, phân trang, hợp đồng lỗi, logger) + tài nguyên lồng comments (mergeParams, 404 đúng chủ, xoá dây chuyền). */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, pre } from './_node-c3-5.mjs';

const BROKEN = [
  "const app = express();",
  "app.use(express.json({ limit: '50mb' }));          // (a)",
  "app.use((err, req, res) => res.status(500).json({ error: err.message }));   // (b)",
  "app.use((req, res) => res.status(404).json({ error: 'Not Found' }));       // (c)",
  "app.use('/api/v1/notes', notesRouter);",
  "app.use(requestLogger);                             // (d)",
  "app.listen(3000);                                   // (e)",
];
const E1 = {
  ...cs({
    ten: 'Lab 5 · 1 — Review a broken app.js', kho: 'EASY', phut: 8,
    en: `A teammate wrote this <code>app.js</code>. Every marked line breaks one rule of chapter 5.${pre(BROKEN)}`,
    vi: `Một đồng đội viết <code>app.js</code> này. Mỗi dòng được đánh dấu phạm một luật của chương 5.${pre(BROKEN)}`,
    cau: [
      q('c1', ['What is wrong with (a)?', '(a) sai ở đâu?'],
        ['Any request can now buffer 50 MB before auth — keep the limit small', 'express.json() does not accept a limit option, so it is ignored', '50mb is below the default limit, so large notes get rejected', 'The limit must be a number of bytes; a string like 50mb is invalid'],
        ['The default is 100kb, and raising it “so uploads work” is a bad trade (lesson 5.3). Chapter 10 streams uploads.', 'Mặc định là 100kb, và nâng nó “để upload chạy” là đổi chác tồi (bài 5.3). Chương 10 cho upload chảy theo stream.']),
      q('c2', ['What is wrong with (b)?', '(b) sai ở đâu?'],
        ['Three parameters: never an error handler; it also leaks messages, too early', 'It should call next() after sending the response, or the chain hangs', 'Error handlers must be registered with app.error(), not app.use()', 'Nothing is wrong: Express recognises error handlers by their name'],
        ['fn.length must be 4, the 500 message must not be sent, and it must be the last app.use.', 'fn.length phải là 4, message của 500 không được gửi đi, và nó phải là app.use cuối cùng.']),
      q('c3', ['What is wrong with (c)?', '(c) sai ở đâu?'],
        ['It is above the router, so every request becomes a 404', 'A 404 handler needs four parameters', 'It should be res.sendStatus(404)', 'It must be mounted at "*"'],
        ['app.use with no path matches everything; the JSON 404 belongs after every route and before the error handler.', 'app.use không có path khớp mọi thứ; 404 JSON phải đứng sau mọi route và trước error handler.']),
      q('c4', ['What is wrong with (d) and (e)?', '(d) và (e) sai ở đâu?'],
        ['The logger must come first, and listen() here makes the app untestable', 'requestLogger has to be passed to app.listen() as its second argument', 'listen(3000) must be called before the routes, or they are not mounted', 'Nothing: the order of app.use calls never matters for middleware'],
        ['Position in the file is the whole API; index.js owns the port and the signals (lesson 5.5).', 'Vị trí trong tệp là toàn bộ API; index.js sở hữu cổng và tín hiệu (bài 5.5).']),
    ],
    goiY: [['Read the file top to bottom as the request does.', 'Đọc tệp từ trên xuống như request đi.'], ['Count the parameters of every function passed to app.use.', 'Đếm tham số của mọi hàm đưa vào app.use.']],
    loi: [['Thinking app.use order only matters for routes.', 'Tưởng thứ tự app.use chỉ quan trọng với route.'], ['Keeping listen() in the file that builds the app.', 'Giữ listen() trong tệp dựng app.']],
    tns: [tn('code review', 'duyệt code')],
    kn: ['Express'],
  }),
  dangBai: 'lab',
};

/* ─── Lab 5 · 2 — Notes API v2 ─── */
function createApp() {
  const app = express();
  app.disable('x-powered-by');

  // ── errors (5.4) ──
  class AppError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
  const fail = (status, code, message) => { throw new AppError(status, code, message); };

  // ── service (5.5): no req, no res ──
  const notes = new Map();
  let nextId = 1;
  const copy = (n) => ({ ...n, tags: [...n.tags] });

  // ── validation shared by POST and PATCH ──
  function cleanTitle(t) {
    if (typeof t !== 'string' || t.trim() === '') fail(422, 'VALIDATION_FAILED', 'title is required');
    if (t.trim().length > 100) fail(422, 'VALIDATION_FAILED', 'title is too long');
    return t.trim();
  }
  function cleanTags(tags) {
    if (!Array.isArray(tags) || tags.length > 5 || tags.some((x) => typeof x !== 'string' || x.trim() === '')) fail(422, 'VALIDATION_FAILED', 'tags must be an array of up to 5 strings');
    return [...new Set(tags.map((x) => x.trim().toLowerCase()))];
  }
  function cleanBody(b) {
    if (typeof b !== 'string') fail(422, 'VALIDATION_FAILED', 'body must be a string');
    return b;
  }
  function idOf(req) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) fail(400, 'INVALID_ID', 'id must be a positive integer');
    return id;
  }
  function find(req) {
    const id = idOf(req);
    const n = notes.get(id);
    if (!n) fail(404, 'NOTE_NOT_FOUND', `Note ${id} does not exist`);
    return n;
  }

  // ── logger first (5.3): it also sees a 400 for broken JSON ──
  app.use((req, res, next) => {
    const t0 = Date.now();
    res.on('finish', () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${(Date.now() - t0).toFixed(1)}ms`));
    next();
  });
  app.use(express.json({ limit: '10kb' }));
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // ── router (5.2 + 5.5): HTTP in, status codes out ──
  const r = express.Router();
  r.get('/', (req, res) => {
    const one = (v) => (Array.isArray(v) ? v[0] : v);
    const page = Math.max(1, Math.floor(Number(one(req.query.page) ?? 1) || 1));
    const limit = Math.min(50, Math.max(1, Math.floor(Number(one(req.query.limit) ?? 10) || 10)));
    const qText = typeof one(req.query.q) === 'string' ? one(req.query.q).trim().toLowerCase() : '';
    const tag = typeof one(req.query.tag) === 'string' ? one(req.query.tag).trim().toLowerCase() : '';
    let all = [...notes.values()];
    if (qText) all = all.filter((n) => n.title.toLowerCase().includes(qText) || n.body.toLowerCase().includes(qText));
    if (tag) all = all.filter((n) => n.tags.includes(tag));
    res.json({ items: all.slice((page - 1) * limit, page * limit).map(copy), page, limit, total: all.length });
  });
  r.get('/:id', (req, res) => res.json(copy(find(req))));
  r.post('/', (req, res) => {
    const input = req.body ?? {};
    const note = {
      id: nextId++,
      title: cleanTitle(input.title),
      body: input.body === undefined ? '' : cleanBody(input.body),
      tags: input.tags === undefined ? [] : cleanTags(input.tags),
      createdAt: new Date(Date.now()).toISOString(),
    };
    notes.set(note.id, note);
    res.status(201).location(`/api/v1/notes/${note.id}`).json(copy(note));
  });
  r.patch('/:id', (req, res) => {
    const n = find(req);
    const input = req.body ?? {};
    // validate everything first, then change: a bad tag must not leave a half-updated note
    const next = {
      title: input.title === undefined ? n.title : cleanTitle(input.title),
      body: input.body === undefined ? n.body : cleanBody(input.body),
      tags: input.tags === undefined ? n.tags : cleanTags(input.tags),
    };
    Object.assign(n, next);
    res.json(copy(n));
  });
  r.delete('/:id', (req, res) => {
    notes.delete(find(req).id);
    res.status(204).end();
  });
  app.use('/api/v1/notes', r);

  // ── 404 then the error handler, last (5.4) ──
  app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: `Cannot ${req.method} ${req.path}` } }));
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON');
    if (err.type === 'entity.too.large') err = new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
    const status = err.status || 500;
    if (status >= 500) console.error('[500]', err.message);
    res.status(status).json({ error: { code: err.code || 'INTERNAL', message: status >= 500 ? 'Internal server error' : err.message } });
  });
  return app;
}
const RUN = `const s = (r) => ({ status: r.status, location: r.headers.location || null, body: r.body ?? null });
async function seed(app) { for (const n of [{ title: 'Learning Express', body: 'chapter 5', tags: ['node', 'Express'] }, { title: 'Second note', tags: ['node'] }, { title: 'Groceries', body: 'buy express coffee' }]) await request(app, 'POST', '/api/v1/notes', { body: n }); __log.length = 0; }`;
const E2 = nodeBai({
  ten: 'Lab 5 · 2 — Notes API v2: tags, search, paging and one error contract', kho: 'HARD', phut: 60, dangBai: 'lab', kit: true, tep: 'app.js',
  en: `<p><b>Brief.</b> Build <code>createApp()</code> — the whole chapter in one Express app (in-memory storage). Everything is graded through HTTP with <code>request(app, …)</code>.</p>
<table><thead><tr><th>#</th><th>requirement</th></tr></thead><tbody>
<tr><td>1</td><td><code>x-powered-by</code> disabled. A request logger registered <b>first</b> prints <code>METHOD originalUrl status ms.toFixed(1)ms</code> on <code>finish</code>; then <code>express.json({ limit: '10kb' })</code>. <code>GET /health</code> → <code>{ status: "ok" }</code>.</td></tr>
<tr><td>2</td><td><code>POST /api/v1/notes</code> → 201 + <code>Location: /api/v1/notes/&lt;id&gt;</code> + <code>{ id, title, body, tags, createdAt }</code>. <code>title</code>: string, trimmed, 1–100 chars (“title is required” / “title is too long”). <code>body</code>: optional string, default <code>""</code> (“body must be a string”). <code>tags</code>: optional array of ≤ 5 non-empty strings (“tags must be an array of up to 5 strings”), stored trimmed, lower-cased, without duplicates, in first-seen order. All validation errors: 422 <code>VALIDATION_FAILED</code>. Ids start at 1, never reused; <code>createdAt = new Date(Date.now()).toISOString()</code>.</td></tr>
<tr><td>3</td><td><code>GET /api/v1/notes</code> → <code>{ items, page, limit, total }</code> in id order. page/limit as in 5.2 (first value of an array, integer, page ≥ 1 default 1, limit 1–50 default 10). <code>q</code>: case-insensitive substring of title or body. <code>tag</code>: notes having that tag (case-insensitive). <code>total</code> counts after filtering.</td></tr>
<tr><td>4</td><td><code>GET /api/v1/notes/:id</code> → the note. Id not a positive integer → 400 <code>INVALID_ID</code> “id must be a positive integer”; missing → 404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”.</td></tr>
<tr><td>5</td><td><code>PATCH /:id</code> → validates every field sent with the POST rules, and changes nothing if any of them is invalid; 200 + the note. <code>DELETE /:id</code> → 204. Both use the 400/404 of #4.</td></tr>
<tr><td>6</td><td>Errors: every error is <code>{ error: { code, message } }</code>; unknown route → 404 <code>NOT_FOUND</code> “Cannot GET /x”; broken JSON → 400 <code>INVALID_JSON</code>; too large → 413 <code>PAYLOAD_TOO_LARGE</code>; anything else → 500 <code>INTERNAL</code> “Internal server error”.</td></tr></tbody></table>
<p>Returned notes must be copies: changing a response object must not change the store.</p>`,
  vi: `<p><b>Đề.</b> Dựng <code>createApp()</code> — cả chương trong một app Express (lưu trong bộ nhớ). Mọi thứ được chấm qua HTTP bằng <code>request(app, …)</code>.</p>
<table><thead><tr><th>#</th><th>yêu cầu</th></tr></thead><tbody>
<tr><td>1</td><td>Tắt <code>x-powered-by</code>. Một logger đăng ký <b>đầu tiên</b> in <code>METHOD originalUrl status ms.toFixed(1)ms</code> ở <code>finish</code>; rồi <code>express.json({ limit: '10kb' })</code>. <code>GET /health</code> → <code>{ status: "ok" }</code>.</td></tr>
<tr><td>2</td><td><code>POST /api/v1/notes</code> → 201 + <code>Location: /api/v1/notes/&lt;id&gt;</code> + <code>{ id, title, body, tags, createdAt }</code>. <code>title</code>: chuỗi, trim, 1–100 ký tự (“title is required” / “title is too long”). <code>body</code>: chuỗi tuỳ chọn, mặc định <code>""</code> (“body must be a string”). <code>tags</code>: mảng tuỳ chọn ≤ 5 chuỗi không rỗng (“tags must be an array of up to 5 strings”), lưu đã trim, viết thường, không trùng, theo thứ tự gặp đầu. Mọi lỗi kiểm tra: 422 <code>VALIDATION_FAILED</code>. id từ 1, không dùng lại; <code>createdAt = new Date(Date.now()).toISOString()</code>.</td></tr>
<tr><td>3</td><td><code>GET /api/v1/notes</code> → <code>{ items, page, limit, total }</code> theo thứ tự id. page/limit như bài 5.2 (giá trị đầu nếu là mảng, số nguyên, page ≥ 1 mặc định 1, limit 1–50 mặc định 10). <code>q</code>: chuỗi con không phân biệt hoa thường của title hoặc body. <code>tag</code>: các ghi chú có tag đó (không phân biệt hoa thường). <code>total</code> đếm sau khi lọc.</td></tr>
<tr><td>4</td><td><code>GET /api/v1/notes/:id</code> → ghi chú. id không phải số nguyên dương → 400 <code>INVALID_ID</code> “id must be a positive integer”; không có → 404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”.</td></tr>
<tr><td>5</td><td><code>PATCH /:id</code> → kiểm mọi trường được gửi theo luật của POST, và không đổi gì nếu có trường sai; 200 + ghi chú. <code>DELETE /:id</code> → 204. Cả hai dùng 400/404 của #4.</td></tr>
<tr><td>6</td><td>Lỗi: mọi lỗi là <code>{ error: { code, message } }</code>; route lạ → 404 <code>NOT_FOUND</code> “Cannot GET /x”; JSON hỏng → 400 <code>INVALID_JSON</code>; quá lớn → 413 <code>PAYLOAD_TOO_LARGE</code>; còn lại → 500 <code>INTERNAL</code> “Internal server error”.</td></tr></tbody></table>
<p>Ghi chú trả về phải là bản sao: sửa object phản hồi không được làm đổi kho.</p>`,
  yc: [['Throw AppError from routes; one error handler answers.', 'Ném AppError từ route; một error handler trả lời.'], ['Middleware order: logger, json, health, router, 404, error handler.', 'Thứ tự middleware: logger, json, health, router, 404, error handler.']],
  goiY: [['Start from your 5.5 router and 5.4 handler; add cleanTitle/cleanTags/cleanBody helpers that throw AppError(422).', 'Bắt đầu từ router 5.5 và handler 5.4; thêm các hàm cleanTitle/cleanTags/cleanBody ném AppError(422).'], ['One find(req) helper gives you both the 400 and the 404 for GET, PATCH and DELETE.', 'Một hàm find(req) cho bạn cả 400 lẫn 404 cho GET, PATCH và DELETE.'], ['For PATCH, compute every new value first and assign at the end.', 'Với PATCH, tính mọi giá trị mới trước rồi mới gán ở cuối.']],
  loi: [['PATCH that assigns the title, then fails on tags: the note is half updated although the client got a 422.', 'PATCH gán title rồi mới trượt ở tags: ghi chú bị sửa một nửa dù client nhận 422.'], ['Number("1.5") passes Number.isNaN: use Number.isInteger and id >= 1.', 'Number("1.5") qua được Number.isNaN: dùng Number.isInteger và id >= 1.'], ['Filtering by tag case-sensitively: "Express" was stored as "express".', 'Lọc theo tag phân biệt hoa thường: "Express" đã lưu là "express".']],
  gt: ['This is the skeleton of every API on cuongthai.com: one app, middleware in a deliberate order, routers under /api/v1, a JSON 404 and one error handler at the bottom. The checks replay a full session; the log lines check the logger sees even the requests the parser rejects.', 'Đây là bộ khung của mọi API trên cuongthai.com: một app, middleware theo thứ tự có chủ ý, router dưới /api/v1, một 404 JSON và một error handler ở cuối. Các kiểm phát lại cả một phiên; các dòng log kiểm logger thấy được cả những request bị parser từ chối.'],
  kn: ['Express', 'REST', 'validation', 'errors'], tns: [tn('API contract', 'hợp đồng API'), tn('partial update', 'cập nhật một phần'), tn('atomic validation', 'kiểm tra trọn vẹn trước khi đổi')],
  chung: RUN,
  dau: `/** Notes API v2 — the whole chapter in one app */
function createApp() {
  const app = express();
  // Write your solution here — a first draft: no validation, no error contract, wrong order
  const notes = [];
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/api/v1/notes', (req, res) => res.json({ items: notes, page: 1, limit: 10, total: notes.length }));
  app.post('/api/v1/notes', (req, res) => {
    const note = { id: notes.length + 1, ...req.body };
    notes.push(note);
    res.status(201).json(note);
  });
  return app;
}
`,
  giai: '// Reference solution — the chapter, assembled: logger → json → routes → 404 → error handler\n' + nguon(createApp),
  cases: [
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: { title: "  Learning Express ", body: "chapter 5", tags: ["Node", "express", "node"] } })), (await request(app, "GET", "/health")).headers["x-powered-by"] || "none", __log]', moTa: ['POST: 201, Location, tags cleaned; no X-Powered-By; logger lines', 'POST: 201, Location, tags đã làm sạch; không X-Powered-By; các dòng log'] },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: { body: "no title" } })), s(await request(app, "POST", "/api/v1/notes", { body: { title: "x".repeat(101) } })), s(await request(app, "POST", "/api/v1/notes", { body: { title: "ok", tags: ["a", "b", "c", "d", "e", "f"] } })), s(await request(app, "POST", "/api/v1/notes", { body: { title: "ok", body: 5 } }))]', moTa: ['Validation: four 422s', 'Kiểm tra: bốn lỗi 422'] },
    { chuanBi: 'const app = createApp(); await seed(app);', goi: '[s(await request(app, "GET", "/api/v1/notes?q=EXPRESS")), s(await request(app, "GET", "/api/v1/notes?tag=Node&limit=1")), s(await request(app, "GET", "/api/v1/notes?page=2&limit=2"))]', moTa: ['Search, tag filter, paging', 'Tìm kiếm, lọc tag, phân trang'] },
    { chuanBi: 'const app = createApp(); await seed(app);', goi: '[s(await request(app, "GET", "/api/v1/notes/2")), s(await request(app, "GET", "/api/v1/notes/abc")), s(await request(app, "GET", "/api/v1/notes/1.5")), s(await request(app, "GET", "/api/v1/notes/99")), s(await request(app, "GET", "/api/v1/nope"))]', moTa: ['GET by id: 200, 400, 400, 404; JSON 404', 'GET theo id: 200, 400, 400, 404; 404 JSON'] },
    { chuanBi: 'const app = createApp(); await seed(app);', goi: '[s(await request(app, "PATCH", "/api/v1/notes/1", { body: { title: "Changed", tags: "not-an-array" } })), s(await request(app, "GET", "/api/v1/notes/1")), s(await request(app, "PATCH", "/api/v1/notes/1", { body: { body: "edited", tags: ["X"] } })), s(await request(app, "DELETE", "/api/v1/notes/3")), s(await request(app, "DELETE", "/api/v1/notes/3")), s(await request(app, "POST", "/api/v1/notes", { body: { title: "fourth" } }))]', an: true },
    { chuanBi: 'const app = createApp();', goi: '[s(await request(app, "POST", "/api/v1/notes", { body: "{title:}" })), s(await request(app, "POST", "/api/v1/notes", { body: { title: "big", body: "x".repeat(11000) } })), __log]', an: true },
    { chuanBi: 'const app = createApp(); await seed(app);', goi: 'await (async () => { const a = (await request(app, "GET", "/api/v1/notes/1")).body; a.tags.push("hacked"); a.title = "hacked"; const l = (await request(app, "GET", "/api/v1/notes")).body; l.items[0].tags.length = 0; return [s(await request(app, "GET", "/api/v1/notes/1")), (await request(app, "GET", "/api/v1/notes?page=abc&limit=1000&tag=")).body.limit, (await request(app, "GET", "/api/v1/notes?page=2&page=9&limit=2")).body.page]; })()', an: true },
  ],
});

/* ─── Lab 5 · 3 — comments lồng trong notes ─── */
const STORE = `// ── provided: the store (no HTTP) and the errors ──
class AppError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
function createStore() {
  const notes = new Map([[1, { id: 1, title: 'Learning Express' }], [2, { id: 2, title: 'Second note' }]]);
  const comments = new Map();
  let nextComment = 1;
  return {
    getNote: (id) => notes.get(id) || null,
    removeNote: (id) => notes.delete(id),
    listComments: (noteId) => [...comments.values()].filter((c) => c.noteId === noteId),
    getComment: (id) => comments.get(id) || null,
    addComment(noteId, text) { const c = { id: nextComment++, noteId, text, createdAt: new Date(Date.now()).toISOString() }; comments.set(c.id, c); return { ...c }; },
    removeComment: (id) => comments.delete(id),
    removeCommentsOf(noteId) { let n = 0; for (const c of [...comments.values()]) if (c.noteId === noteId) { comments.delete(c.id); n++; } return n; },
    countComments: () => comments.size,
  };
}
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON');
  const status = err.status || 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL', message: status >= 500 ? 'Internal server error' : err.message } });
}
`;
function createApp3(store) {
  const app = express();
  app.use(express.json());
  const positive = (v, what) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1) throw new AppError(400, 'INVALID_ID', `${what} must be a positive integer`);
    return n;
  };
  const noteOf = (req) => {
    const id = positive(req.params.noteId, 'noteId');
    if (!store.getNote(id)) throw new AppError(404, 'NOTE_NOT_FOUND', `Note ${id} does not exist`);
    return id;
  };

  // mergeParams: this router lives under /notes/:noteId and must read that id
  const comments = express.Router({ mergeParams: true });
  comments.get('/', (req, res) => {
    const noteId = noteOf(req);
    res.json({ items: store.listComments(noteId) });
  });
  comments.post('/', (req, res) => {
    const noteId = noteOf(req);
    const { text } = req.body ?? {};
    if (typeof text !== 'string' || text.trim() === '') throw new AppError(422, 'VALIDATION_FAILED', 'text is required');
    if (text.trim().length > 500) throw new AppError(422, 'VALIDATION_FAILED', 'text is too long');
    const c = store.addComment(noteId, text.trim());
    res.status(201).location(`/api/v1/notes/${noteId}/comments/${c.id}`).json(c);
  });
  comments.delete('/:commentId', (req, res) => {
    const noteId = noteOf(req);
    const id = positive(req.params.commentId, 'commentId');
    const c = store.getComment(id);
    // a comment of ANOTHER note is "not found" here — never delete across parents
    if (!c || c.noteId !== noteId) throw new AppError(404, 'COMMENT_NOT_FOUND', `Comment ${id} does not exist on note ${noteId}`);
    store.removeComment(id);
    res.status(204).end();
  });

  const notes = express.Router();
  notes.delete('/:noteId', (req, res) => {
    const noteId = noteOf(req);
    store.removeCommentsOf(noteId);        // cascade: no orphan comments pointing at a deleted note
    store.removeNote(noteId);
    res.status(204).end();
  });

  app.use('/api/v1/notes/:noteId/comments', comments);
  app.use('/api/v1/notes', notes);
  app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: `Cannot ${req.method} ${req.path}` } }));
  app.use(errorHandler);
  return app;
}
const RUN3 = 'const s = (r) => ({ status: r.status, location: r.headers.location || null, body: r.body ?? null });';
const E3 = nodeBai({
  ten: 'Lab 5 · 3 — Comments under notes: mergeParams, the right 404, cascading delete', kho: 'HARD', phut: 40, dangBai: 'lab', kit: true, tep: 'app.js',
  en: `<p><b>Brief.</b> Notes now have comments: <code>/api/v1/notes/:noteId/comments</code>. Write <code>createApp3(store)</code> using the provided <code>store</code> (no HTTP inside), <code>AppError</code> and <code>errorHandler</code>.</p>
<table><thead><tr><th>request</th><th>response</th></tr></thead><tbody>
<tr><td>GET …/comments</td><td>200 <code>{ items: store.listComments(noteId) }</code></td></tr>
<tr><td>POST …/comments <code>{ text }</code></td><td>201 + <code>Location: /api/v1/notes/&lt;noteId&gt;/comments/&lt;id&gt;</code> + the comment. <code>text</code> trimmed, 1–500 chars: 422 <code>VALIDATION_FAILED</code> “text is required” / “text is too long”</td></tr>
<tr><td>DELETE …/comments/:commentId</td><td>204. If the comment does not exist <b>or belongs to another note</b>: 404 <code>COMMENT_NOT_FOUND</code> “Comment &lt;id&gt; does not exist on note &lt;noteId&gt;”</td></tr>
<tr><td>DELETE /api/v1/notes/:noteId</td><td>204, and the note’s comments are deleted too (<code>store.removeCommentsOf</code>)</td></tr></tbody></table>
<p>For every route: <code>noteId</code> (and <code>commentId</code>) must be a positive integer → else 400 <code>INVALID_ID</code> “noteId must be a positive integer” (or “commentId …”); a missing note → 404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”. Unknown routes → the JSON 404 <code>NOT_FOUND</code>. Notes 1 and 2 exist at start.</p>`,
  vi: `<p><b>Đề.</b> Ghi chú giờ có bình luận: <code>/api/v1/notes/:noteId/comments</code>. Viết <code>createApp3(store)</code> dùng <code>store</code> có sẵn (không có HTTP bên trong), <code>AppError</code> và <code>errorHandler</code>.</p>
<table><thead><tr><th>request</th><th>phản hồi</th></tr></thead><tbody>
<tr><td>GET …/comments</td><td>200 <code>{ items: store.listComments(noteId) }</code></td></tr>
<tr><td>POST …/comments <code>{ text }</code></td><td>201 + <code>Location: /api/v1/notes/&lt;noteId&gt;/comments/&lt;id&gt;</code> + bình luận. <code>text</code> đã trim, 1–500 ký tự: 422 <code>VALIDATION_FAILED</code> “text is required” / “text is too long”</td></tr>
<tr><td>DELETE …/comments/:commentId</td><td>204. Nếu bình luận không tồn tại <b>hoặc thuộc ghi chú khác</b>: 404 <code>COMMENT_NOT_FOUND</code> “Comment &lt;id&gt; does not exist on note &lt;noteId&gt;”</td></tr>
<tr><td>DELETE /api/v1/notes/:noteId</td><td>204, và các bình luận của ghi chú cũng bị xoá (<code>store.removeCommentsOf</code>)</td></tr></tbody></table>
<p>Với mọi route: <code>noteId</code> (và <code>commentId</code>) phải là số nguyên dương → ngược lại 400 <code>INVALID_ID</code> “noteId must be a positive integer” (hoặc “commentId …”); ghi chú không có → 404 <code>NOTE_NOT_FOUND</code> “Note &lt;id&gt; does not exist”. Route lạ → 404 JSON <code>NOT_FOUND</code>. Lúc đầu có sẵn ghi chú 1 và 2.</p>`,
  yc: [['The comments router is created with mergeParams: true.', 'Router comments được tạo với mergeParams: true.'], ['Never delete a comment through the URL of another note.', 'Không bao giờ xoá bình luận qua URL của ghi chú khác.']],
  goiY: [['A noteOf(req) helper: validate the id, check the note exists, return the number.', 'Một hàm noteOf(req): kiểm id, kiểm ghi chú tồn tại, trả về số.'], ['Mount the comments router BEFORE the notes router, or /api/v1/notes/1/comments may be swallowed by a /:noteId route.', 'Gắn router comments TRƯỚC router notes, kẻo /api/v1/notes/1/comments bị một route /:noteId nuốt mất.'], ['On DELETE comment compare c.noteId with the noteId of the URL.', 'Khi DELETE bình luận, so c.noteId với noteId của URL.']],
  loi: [['Express.Router() without mergeParams: req.params.noteId is undefined and every request is a 400.', 'express.Router() thiếu mergeParams: req.params.noteId là undefined và mọi request đều 400.'], ['DELETE /notes/2/comments/1 deleting comment 1 of note 1 — an authorisation hole (chapter 8 calls it IDOR).', 'DELETE /notes/2/comments/1 xoá bình luận 1 của ghi chú 1 — một lỗ hổng phân quyền (chương 8 gọi là IDOR).'], ['Deleting the note but leaving its comments: orphans that point at nothing.', 'Xoá ghi chú nhưng để lại bình luận: những bản mồ côi trỏ vào hư không.']],
  gt: ['Nested resources are where routers and mergeParams earn their keep, and where the “right 404” matters: the URL says which parent a child belongs to, so the server must check that relationship rather than trusting the child id alone. In chapter 7 the cascade becomes an <code>ON DELETE CASCADE</code> foreign key; the HTTP contract stays exactly this.', 'Tài nguyên lồng là nơi router và mergeParams phát huy, và là nơi “404 đúng chỗ” quan trọng: URL nói con thuộc cha nào, nên server phải kiểm quan hệ đó thay vì chỉ tin id của con. Ở chương 7 phép xoá dây chuyền thành một khoá ngoại <code>ON DELETE CASCADE</code>; hợp đồng HTTP giữ nguyên như thế này.'],
  kn: ['Express', 'Router', 'REST'], tns: [tn('nested resource', 'tài nguyên lồng'), tn('cascading delete', 'xoá dây chuyền'), tn('IDOR', 'tham chiếu đối tượng trực tiếp không an toàn')],
  chung: RUN3,
  dau: `${STORE}
/** notes + nested comments */
function createApp3(store) {
  const app = express();
  app.use(express.json());
  // Write your solution here — a first draft
  const comments = express.Router();
  comments.get('/', (req, res) => res.json({ items: store.listComments(Number(req.params.noteId)) }));
  comments.post('/', (req, res) => {
    const c = store.addComment(Number(req.params.noteId), req.body.text);
    res.status(201).json(c);
  });
  comments.delete('/:commentId', (req, res) => {
    store.removeComment(Number(req.params.commentId));
    res.status(204).end();
  });
  app.use('/api/v1/notes/:noteId/comments', comments);
  app.use(errorHandler);
  return app;
}
`,
  giai: `${STORE}
// Reference solution — mergeParams, a parent check on every route, cascade on delete
${nguon(createApp3)}`,
  cases: [
    { chuanBi: 'const store = createStore(); const app = createApp3(store);', goi: '[s(await request(app, "POST", "/api/v1/notes/1/comments", { body: { text: "  nice note " } })), s(await request(app, "GET", "/api/v1/notes/1/comments"))]', moTa: ['POST 201 + Location, then GET', 'POST 201 + Location, rồi GET'] },
    { chuanBi: 'const store = createStore(); const app = createApp3(store);', goi: '[s(await request(app, "GET", "/api/v1/notes/9/comments")), s(await request(app, "POST", "/api/v1/notes/abc/comments", { body: { text: "x" } })), s(await request(app, "POST", "/api/v1/notes/1/comments", { body: { text: "   " } }))]', moTa: ['404 note, 400 id, 422 text', '404 ghi chú, 400 id, 422 text'] },
    { chuanBi: 'const store = createStore(); const app = createApp3(store); await request(app, "POST", "/api/v1/notes/1/comments", { body: { text: "on note 1" } });', goi: '[s(await request(app, "DELETE", "/api/v1/notes/2/comments/1")), store.countComments(), s(await request(app, "DELETE", "/api/v1/notes/1/comments/1")), store.countComments()]', moTa: ['Deleting through the wrong parent is a 404', 'Xoá qua sai ghi chú cha là 404'] },
    { chuanBi: 'const store = createStore(); const app = createApp3(store); for (const t of ["a", "b", "c"]) await request(app, "POST", "/api/v1/notes/2/comments", { body: { text: t } }); await request(app, "POST", "/api/v1/notes/1/comments", { body: { text: "keep" } });', goi: '[s(await request(app, "DELETE", "/api/v1/notes/2")), store.countComments(), s(await request(app, "GET", "/api/v1/notes/2/comments")), s(await request(app, "DELETE", "/api/v1/notes/2"))]', an: true },
    { chuanBi: 'const store = createStore(); const app = createApp3(store);', goi: '[s(await request(app, "DELETE", "/api/v1/notes/1/comments/0")), s(await request(app, "DELETE", "/api/v1/notes/1/comments/5")), s(await request(app, "POST", "/api/v1/notes/1/comments", { body: { text: "x".repeat(501) } })), s(await request(app, "POST", "/api/v1/notes/1/comments", { body: "{bad" })), s(await request(app, "GET", "/api/v1/zzz"))]', an: true },
    { chuanBi: 'const store = createStore(); const app = createApp3(store);', goi: '[s(await request(app, "POST", "/api/v1/notes/1/comments", {})), s(await request(app, "GET", "/api/v1/notes/2/comments/"))]', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-lab-notes-api', ten: 'Lab 5 — Notes API v2 with Express', khoa: KHOA, baiHoc: 'nodejs-5-5-notes-api', de: [E1, E2, E3] });
