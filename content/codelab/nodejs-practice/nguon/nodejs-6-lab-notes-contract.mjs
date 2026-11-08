/** Node.js · Lab Chương 6 — Notes API v2 giữ trọn hợp đồng (kiểm dữ liệu, cursor, ETag/If-Match, lỗi một hình dạng) + client thử lại an toàn (Idempotency-Key, 429/503, 412). */
import { modul, cs, q, tn, jsBai, TRO_GIUP, APP_ERROR } from './_node-c6-8.mjs';

/* ── Lab 6 · 1 — Review một pull request ── */
const L1 = cs({
  ten: 'Lab 6 · 1 — Review the pull request before it becomes a contract', kho: 'MEDIUM', phut: 12, dangBai: 'lab',
  en: 'A teammate opens a pull request for the Notes API. Every snippet below is from that PR. For each one, pick the problem lesson 6.x would point at — the review comment you would actually write. Once it ships, a mobile app depends on it for years.',
  vi: 'Một bạn cùng nhóm mở pull request cho Notes API. Mỗi đoạn dưới đây lấy từ PR đó. Với từng đoạn, chọn vấn đề mà bài 6.x sẽ chỉ ra — đúng lời nhận xét bạn sẽ viết khi review. Một khi phát hành, app di động sẽ phụ thuộc vào nó nhiều năm.',
  cau: [
    q('c1', ['<code>router.post("/getNotes", …)</code> and <code>router.post("/notes/:id/delete", …)</code>', '<code>router.post("/getNotes", …)</code> và <code>router.post("/notes/:id/delete", …)</code>'],
      ['Verbs in URLs hide the meaning from caches and retry policies — use GET /notes and DELETE /notes/:id', 'The paths must be camelCase to match the JavaScript handlers', 'POST is fine for everything as long as the body has an action field', 'Only the delete route is wrong; reading with POST is standard'],
      ['6.1: nouns in the URL, verbs in the method. A mobile SDK may retry DELETE; it must never retry POST.', '6.1: danh từ ở URL, động từ ở phương thức. SDK di động được thử lại DELETE; không bao giờ được thử lại POST.']),
    q('c2', ['<code>if (!note) return res.json({ success: false, error: "not found" })</code>', '<code>if (!note) return res.json({ success: false, error: "not found" })</code>'],
      ['A 200 with an error inside: monitoring sees zero errors and caches store the failure', 'It should be 500 because the database did not return a row', 'It is fine because the frontend checks success', 'It should be 204 because there is no content'],
      ['6.2: one error shape, every 4xx/5xx; the client branches on the status first.', '6.2: một hình dạng lỗi, cho mọi 4xx/5xx; client rẽ nhánh theo mã trạng thái trước.']),
    q('c3', ['<code>const notes = await db.note.findMany({ skip: (page - 1) * req.query.limit, take: req.query.limit })</code>', '<code>const notes = await db.note.findMany({ skip: (page - 1) * req.query.limit, take: req.query.limit })</code>'],
      ['limit is an unvalidated string with no maximum', 'skip must always be 0 for performance', 'findMany cannot take a limit; use a for loop instead', 'The only problem is that page should be called offset'],
      ['6.3 + 6.4: everything in req.query is a string, and a list endpoint ALWAYS has a limit.', '6.3 + 6.4: mọi thứ trong req.query là chuỗi, và endpoint danh sách LUÔN có giới hạn.']),
    q('c4', ['<code>await db.note.create({ data: { ...req.body, authorId: user.id } })</code>', '<code>await db.note.create({ data: { ...req.body, authorId: user.id } })</code>'],
      ['Mass assignment: any field the client sends (isAdmin, createdAt, version) goes in', 'authorId should come from the body so the client can choose', 'create() is slower than createMany()', 'Nothing: Prisma ignores unknown fields'],
      ['6.3: z.object() strips unknown keys; spreading req.body is the bug, spreading parsed.data is safe.', '6.3: z.object() lược khoá lạ; rải req.body là lỗi, rải parsed.data là an toàn.']),
    q('c5', ['<code>router.put("/notes/:id", (req, res) => { Object.assign(note, req.body); res.json(note); })</code> — the web editor sends the whole note it loaded.', '<code>router.put("/notes/:id", (req, res) => { Object.assign(note, req.body); res.json(note); })</code> — trình soạn trên web gửi cả ghi chú nó đã tải.'],
      ['Two editors silently overwrite each other', 'PUT must return 201', 'Object.assign is slow; use a loop', 'The note must be deleted and re-created instead'],
      ['6.1 + 6.5: the lost update, fixed with optimistic concurrency.', '6.1 + 6.5: mất cập nhật, sửa bằng đồng thời lạc quan.']),
    q('c6', ['In the mobile client: <code>for (let i = 0; i &lt; 3; i++) { try { return await post("/payments", body, { "Idempotency-Key": uuid() }) } catch {} }</code>', 'Trong client di động: <code>for (let i = 0; i &lt; 3; i++) { try { return await post("/payments", body, { "Idempotency-Key": uuid() }) } catch {} }</code>'],
      ['A fresh key per attempt defeats the mechanism', 'Three retries are too few for payments', 'The key must be the payment amount', 'Retrying POST is always fine when the network is flaky'],
      ['6.5: one UUID per user intent, created when the button is pressed, reused by every retry of that press.', '6.5: một UUID cho mỗi ý định của người dùng, tạo lúc bấm nút, dùng lại cho mọi lần thử lại của lần bấm đó.']),
  ],
  goiY: [['Match each snippet to the lesson it breaks: 6.1 methods, 6.2 status/shape, 6.3 validation, 6.4 limits, 6.5 contract.', 'Ghép mỗi đoạn với bài mà nó vi phạm: 6.1 phương thức, 6.2 mã/hình dạng, 6.3 kiểm dữ liệu, 6.4 giới hạn, 6.5 hợp đồng.'], ['Ask what the CLIENT (or the attacker) will do with this code a year from now.', 'Hỏi CLIENT (hoặc kẻ tấn công) sẽ làm gì với đoạn code này sau một năm.']],
  loi: [['Approving “it works on my machine” — every snippet works with twelve rows and one user.', 'Duyệt kiểu "máy mình chạy được" — đoạn nào cũng chạy được với mười hai dòng và một người dùng.'], ['Fixing the symptom (rename the route) but keeping the 200-with-error shape.', 'Sửa triệu chứng (đổi tên route) nhưng giữ kiểu 200 chứa lỗi.']],
  tns: [tn('code review', 'review code', 'Đọc thay đổi trước khi gộp.'), tn('contract', 'hợp đồng', 'Những gì client được phép dựa vào.')],
  kn: ['REST', 'API contract'],
});

/* ── Lab 6 · 2 — Notes API v2 giữ trọn hợp đồng ── */
function etagOf(note) {
  return '"' + hex(sha256(utf8(JSON.stringify(note)))).slice(0, 12) + '"';
}
function createNotesV2() {
  const notes = new Map();
  let nextId = 1;
  const send = (status, body, headers = {}) => ({ status, headers: body === null ? headers : { 'content-type': 'application/json', ...headers }, body });
  const fail = (status, code, message, fields) => send(status, { error: { code, message, ...(fields ? { fields } : {}) } });
  const notFound = (id) => fail(404, 'NOTE_NOT_FOUND', 'Note ' + id + ' does not exist');

  // one schema for create, the same rules for the fields a PATCH sends (lesson 6.3)
  function check(input, partial) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields: [{ path: '', message: 'body must be a JSON object' }] };
    const fields = [], data = {};
    if (!partial || 'title' in input) {
      if (typeof input.title !== 'string' || input.title.length < 1 || input.title.length > 200) fields.push({ path: 'title', message: 'title must be a non-empty string of at most 200 characters' });
      else data.title = input.title;
    }
    if ('body' in input) { if (typeof input.body !== 'string') fields.push({ path: 'body', message: 'body must be a string' }); else data.body = input.body; }
    else if (!partial) data.body = '';
    if ('pinned' in input) { if (typeof input.pinned !== 'boolean') fields.push({ path: 'pinned', message: 'pinned must be a boolean' }); else data.pinned = input.pinned; }
    else if (!partial) data.pinned = false;
    return { fields, data };                       // unknown keys never reach data: mass assignment closed
  }
  const invalid = (fields) => fail(422, 'VALIDATION_FAILED', 'The submitted data is not valid', fields);

  function list(params) {
    const fields = [];
    let limit = 10;
    if (params.has('limit')) {
      const n = Number(params.get('limit'));
      if (!Number.isInteger(n) || n < 1 || n > 50) fields.push({ path: 'limit', message: 'limit must be an integer between 1 and 50' });
      else limit = n;
    }
    if (fields.length) return fail(422, 'INVALID_QUERY', 'The query is not valid', fields);
    let after = null;
    if (params.has('after')) {
      after = Number(params.get('after'));
      if (!Number.isInteger(after) || after < 1) return fail(400, 'INVALID_CURSOR', 'cursor is not valid');
    }
    // cursor pagination, newest first: WHERE id < after ORDER BY id DESC LIMIT limit + 1
    const rows = [...notes.values()].sort((a, b) => b.id - a.id).filter((n) => after === null || n.id < after).slice(0, limit + 1);
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return send(200, { items, nextCursor: hasMore ? String(items[items.length - 1].id) : null, hasMore });
  }

  function handle(req) {
    const url = new URL(req.path, 'http://x');
    const headers = req.headers || {};
    const m = /^\/api\/v1\/notes(?:\/(\d+))?$/.exec(url.pathname);
    if (!m) return fail(404, 'NOT_FOUND', 'Cannot ' + req.method + ' ' + url.pathname);
    const id = m[1] ? Number(m[1]) : null;
    if (id === null && req.method === 'GET') return list(url.searchParams);
    if (id === null && req.method === 'POST') {
      const r = check(req.body, false);
      if (r.fields.length) return invalid(r.fields);
      const note = { id: nextId++, ...r.data, version: 1 };
      notes.set(note.id, note);
      return send(201, note, { location: '/api/v1/notes/' + note.id, etag: etagOf(note) });
    }
    if (id !== null && req.method === 'GET') return notes.has(id) ? send(200, notes.get(id), { etag: etagOf(notes.get(id)) }) : notFound(id);
    if (id !== null && req.method === 'PATCH') {
      const note = notes.get(id);
      if (!note) return notFound(id);
      if (!headers['if-match']) return fail(428, 'PRECONDITION_REQUIRED', 'If-Match header is required');
      if (headers['if-match'] !== etagOf(note)) return fail(412, 'PRECONDITION_FAILED', 'Someone else edited this note, reload');
      const r = check(req.body, true);
      if (r.fields.length) return invalid(r.fields);
      const next = { ...note, ...r.data, version: note.version + 1 };
      notes.set(id, next);
      return send(200, next, { etag: etagOf(next) });
    }
    if (id !== null && req.method === 'DELETE') return notes.delete(id) ? send(204, null) : notFound(id);
    return fail(404, 'NOT_FOUND', 'Cannot ' + req.method + ' ' + url.pathname);
  }
  return { handle };
}
const L2 = jsBai({
  ten: 'Lab 6 · 2 — Build createNotesV2(): the whole chapter-6 contract in one handler', kho: 'HARD', phut: 50, diem: 40, dangBai: 'lab',
  en: `<p>The lab’s deliverable: <code>/api/v1/notes</code> that keeps every promise of chapter 6. <code>createNotesV2()</code> returns <code>{ handle(req) }</code> with <code>req = { method, path, headers?, body? }</code> (<code>path</code> may carry a query string; header names lower case) and returns <code>{ status, headers, body }</code>. In-memory, ids from 1, notes are <code>{ id, title, body, pinned, version }</code>. <code>etagOf(note)</code> is in <code>helpers.js</code>.</p>
<h4>Contract</h4>
<ul>
<li><b>Errors</b> (every 4xx): <code>{ error: { code, message, fields? } }</code>. Every response with a body has <code>content-type: application/json</code>; a 204 has headers <code>{}</code> and body <code>null</code>.</li>
<li><b>POST /api/v1/notes</b> — body must be a JSON object (else 422 with <code>fields: [{ path: "", message: "body must be a JSON object" }]</code>). Rules, all reported at once, in the order title, body, pinned: <code>title</code> non-empty string ≤ 200 (<code>"title must be a non-empty string of at most 200 characters"</code>); <code>body</code> string if present (<code>"body must be a string"</code>), default <code>""</code>; <code>pinned</code> boolean if present (<code>"pinned must be a boolean"</code>), default <code>false</code>. Invalid ⇒ 422 <code>VALIDATION_FAILED</code>, message <code>"The submitted data is not valid"</code>. Unknown keys are stripped. Success ⇒ 201, <code>location: /api/v1/notes/&lt;id&gt;</code>, <code>etag</code>, body = note with <code>version: 1</code>.</li>
<li><b>GET /api/v1/notes?limit=&amp;after=</b> — newest first (id descending); <code>limit</code> default 10, must be an integer 1…50 (else 422 <code>INVALID_QUERY</code>, message <code>"The query is not valid"</code>, field <code>limit</code>: <code>"limit must be an integer between 1 and 50"</code>); <code>after</code> = a positive integer id (else 400 <code>INVALID_CURSOR</code>, <code>"cursor is not valid"</code>) ⇒ only ids &lt; after. Body <code>{ items, nextCursor, hasMore }</code>, <code>nextCursor</code> = the last item’s id <b>as a string</b> or <code>null</code>; use limit + 1, no count.</li>
<li><b>GET /api/v1/notes/:id</b> ⇒ 200 + <code>etag</code>. <b>PATCH</b> ⇒ 404 → 428 <code>PRECONDITION_REQUIRED</code> (<code>"If-Match header is required"</code>) → 412 <code>PRECONDITION_FAILED</code> (<code>"Someone else edited this note, reload"</code>) → 422 (same rules, only for the fields sent) → 200 with merged note, <code>version + 1</code>, new <code>etag</code>. <b>DELETE</b> ⇒ 204, then 404.</li>
<li>Unknown id ⇒ 404 <code>NOTE_NOT_FOUND</code>, <code>"Note &lt;id&gt; does not exist"</code>. Any other path/method ⇒ 404 <code>NOT_FOUND</code>, <code>"Cannot &lt;METHOD&gt; &lt;pathname&gt;"</code>.</li>
</ul>`,
  vi: `<p>Sản phẩm của lab: <code>/api/v1/notes</code> giữ mọi lời hứa của chương 6. <code>createNotesV2()</code> trả <code>{ handle(req) }</code> với <code>req = { method, path, headers?, body? }</code> (<code>path</code> có thể kèm query; tên header chữ thường) và trả <code>{ status, headers, body }</code>. Lưu trong bộ nhớ, id từ 1, ghi chú là <code>{ id, title, body, pinned, version }</code>. <code>etagOf(note)</code> nằm trong <code>helpers.js</code>.</p>
<h4>Hợp đồng</h4>
<ul>
<li><b>Lỗi</b> (mọi 4xx): <code>{ error: { code, message, fields? } }</code>. Mọi phản hồi có body có <code>content-type: application/json</code>; 204 có headers <code>{}</code> và body <code>null</code>.</li>
<li><b>POST /api/v1/notes</b> — body phải là object JSON (không thì 422 với <code>fields: [{ path: "", message: "body must be a JSON object" }]</code>). Luật, báo cùng lúc, theo thứ tự title, body, pinned: <code>title</code> chuỗi không rỗng ≤ 200 (<code>"title must be a non-empty string of at most 200 characters"</code>); <code>body</code> là chuỗi nếu có (<code>"body must be a string"</code>), mặc định <code>""</code>; <code>pinned</code> là boolean nếu có (<code>"pinned must be a boolean"</code>), mặc định <code>false</code>. Sai ⇒ 422 <code>VALIDATION_FAILED</code>, message <code>"The submitted data is not valid"</code>. Khoá lạ bị lược. Thành công ⇒ 201, <code>location: /api/v1/notes/&lt;id&gt;</code>, <code>etag</code>, body = ghi chú với <code>version: 1</code>.</li>
<li><b>GET /api/v1/notes?limit=&amp;after=</b> — mới nhất trước (id giảm dần); <code>limit</code> mặc định 10, phải là số nguyên 1…50 (không thì 422 <code>INVALID_QUERY</code>, message <code>"The query is not valid"</code>, trường <code>limit</code>: <code>"limit must be an integer between 1 and 50"</code>); <code>after</code> = id nguyên dương (không thì 400 <code>INVALID_CURSOR</code>, <code>"cursor is not valid"</code>) ⇒ chỉ id &lt; after. Body <code>{ items, nextCursor, hasMore }</code>, <code>nextCursor</code> = id của phần tử cuối <b>dạng chuỗi</b> hoặc <code>null</code>; dùng limit + 1, không đếm.</li>
<li><b>GET /api/v1/notes/:id</b> ⇒ 200 + <code>etag</code>. <b>PATCH</b> ⇒ 404 → 428 <code>PRECONDITION_REQUIRED</code> (<code>"If-Match header is required"</code>) → 412 <code>PRECONDITION_FAILED</code> (<code>"Someone else edited this note, reload"</code>) → 422 (cùng luật, chỉ cho trường được gửi) → 200 với ghi chú đã gộp, <code>version + 1</code>, <code>etag</code> mới. <b>DELETE</b> ⇒ 204, rồi 404.</li>
<li>Id không có ⇒ 404 <code>NOTE_NOT_FOUND</code>, <code>"Note &lt;id&gt; does not exist"</code>. Đường dẫn/phương thức khác ⇒ 404 <code>NOT_FOUND</code>, <code>"Cannot &lt;METHOD&gt; &lt;pathname&gt;"</code>.</li>
</ul>`,
  yc: [['Validation (6.3), status codes and one error shape (6.2), cursor pagination with a cap (6.4), ETag/If-Match (6.5).', 'Kiểm dữ liệu (6.3), mã trạng thái và một hình dạng lỗi (6.2), phân trang cursor có trần (6.4), ETag/If-Match (6.5).'], ['Reuse ONE validation function for POST and PATCH.', 'Dùng MỘT hàm kiểm cho cả POST và PATCH.'], ['Parse the query with <code>new URL(req.path, "http://x")</code> — values are strings.', 'Đọc query bằng <code>new URL(req.path, "http://x")</code> — giá trị là chuỗi.']],
  goiY: [['Structure: <code>send(status, body, headers)</code> and <code>fail(status, code, message, fields)</code> helpers, then <code>handle</code> = parse URL → match <code>/^\\/api\\/v1\\/notes(?:\\/(\\d+))?$/</code> → branch on method.', 'Cấu trúc: hàm <code>send(status, body, headers)</code> và <code>fail(status, code, message, fields)</code>, rồi <code>handle</code> = đọc URL → khớp <code>/^\\/api\\/v1\\/notes(?:\\/(\\d+))?$/</code> → rẽ nhánh theo phương thức.'], ['<code>check(input, partial)</code>: on create every rule applies and defaults fill in; on PATCH a rule applies only if the key is present.', '<code>check(input, partial)</code>: khi tạo mọi luật áp dụng và mặc định được điền; khi PATCH luật chỉ áp dụng nếu khoá có mặt.'], ['PATCH order matters: 404, 428, 412 are about the request’s right to write at all; 422 is about the values.', 'Thứ tự PATCH quan trọng: 404, 428, 412 là về quyền ghi của request; 422 là về giá trị.']],
  loi: [['Validating before checking If-Match: a stale client gets a 422 for a field and fixes the wrong thing.', 'Kiểm dữ liệu trước If-Match: client đang giữ bản cũ nhận 422 cho một trường và sửa sai chỗ.'], ['<code>nextCursor: items.at(-1).id</code> as a number — the contract says string (opaque to clients).', '<code>nextCursor: items.at(-1).id</code> dạng số — hợp đồng nói chuỗi (mờ với client).'], ['<code>{ ...req.body }</code> in POST — <code>version</code>, <code>id</code> and <code>isAdmin</code> come in.', '<code>{ ...req.body }</code> trong POST — <code>version</code>, <code>id</code> và <code>isAdmin</code> lọt vào.']],
  gt: ['Every rule here came from a measurement or a failure in chapter 6: the cap and the cursor from the million-row table, the error shape from the frontend that needs one interceptor, the schema from mass assignment, If-Match from the lost update. Put together they make an endpoint whose behaviour a client can rely on — which is the only thing an API really is.', 'Mọi luật ở đây đến từ một phép đo hay một sự cố của chương 6: trần và cursor từ bảng triệu dòng, hình dạng lỗi từ frontend cần đúng một interceptor, lược đồ từ mass assignment, If-Match từ mất cập nhật. Ghép lại, chúng tạo ra một endpoint mà client có thể dựa vào hành vi của nó — đó mới là API thật sự.'],
  kn: ['REST', 'validation', 'pagination', 'ETag'],
  tns: [tn('contract', 'hợp đồng'), tn('optimistic concurrency', 'đồng thời lạc quan'), tn('cursor', 'con trỏ phân trang')],
  tro: `${TRO_GIUP}\n// provided: the ETag of a note (quoted, 12 hex characters)\n${etagOf.toString()}\n`,
  dau: `function createNotesV2() {
  const notes = new Map();
  let nextId = 1;
  function handle(req) {
    // Write your solution here — start with POST and GET /notes/:id, then the list, then PATCH/DELETE
    if (req.method === 'POST' && req.path === '/api/v1/notes') {
      const note = { id: nextId++, ...req.body, version: 1 };
      notes.set(note.id, note);
      return { status: 201, headers: {}, body: note };
    }
    return { status: 404, headers: {}, body: { success: false } };
  }
  return { handle };
}
`,
  giai: createNotesV2,
  chung: `const api = createNotesV2(); const H = (method, path, body, headers = {}) => api.handle({ method, path, body, headers });
const seed = (n) => { for (let i = 1; i <= n; i++) H('POST', '/api/v1/notes', { title: 'Note ' + i }); };
const short = (r) => [r.status, r.body && r.body.error ? r.body.error.code : (r.body && r.body.items ? r.body.items.map((x) => x.id) : r.body && r.body.id)];`,
  cases: [
    { goi: `H('POST', '/api/v1/notes', { title: 'Learning Express', isAdmin: true, version: 7 })`, moTa: ['Create: 201, Location, ETag, stripped', 'Tạo: 201, Location, ETag, đã lược'] },
    { goi: `H('POST', '/api/v1/notes', { title: '', body: 5, pinned: 'yes' })`, moTa: ['Create: three problems at once ⇒ 422', 'Tạo: ba lỗi cùng lúc ⇒ 422'] },
    { goi: `(seed(5), [H('GET', '/api/v1/notes?limit=2').body, H('GET', '/api/v1/notes?limit=2&after=4').body.items.map((n) => n.id)])`, moTa: ['List: newest first, cursor, hasMore', 'Danh sách: mới nhất trước, cursor, hasMore'] },
    { goi: `(seed(1), (() => { const e = H('GET', '/api/v1/notes/1').headers.etag; return [short(H('PATCH', '/api/v1/notes/1', { title: 'A' }, { 'if-match': e })), short(H('PATCH', '/api/v1/notes/1', { title: 'B' }, { 'if-match': e })), short(H('PATCH', '/api/v1/notes/1', { title: 'C' }))]; })())`, moTa: ['PATCH: 200, then 412 with the old ETag, 428 without', 'PATCH: 200, rồi 412 với ETag cũ, 428 khi thiếu'] },
    { goi: `(seed(1), [H('DELETE', '/api/v1/notes/1'), short(H('DELETE', '/api/v1/notes/1')), short(H('GET', '/api/v1/notes/1'))])`, moTa: ['DELETE: 204 empty, then 404', 'DELETE: 204 rỗng, rồi 404'] },
    { goi: `[H('GET', '/api/v1/notes?limit=500'), H('GET', '/api/v1/notes?limit=abc'), short(H('GET', '/api/v1/notes?after=-3')), short(H('GET', '/api/v1/notes?after=x'))]`, an: true },
    { goi: `(seed(3), (() => { const pages = []; let after = null; for (let i = 0; i < 5; i++) { const b = H('GET', '/api/v1/notes?limit=1' + (after ? '&after=' + after : '')).body; pages.push(b.items.map((n) => n.id)); if (!b.hasMore) break; after = b.nextCursor; } return [pages, H('GET', '/api/v1/notes?limit=3').body.hasMore, H('GET', '/api/v1/notes').body.nextCursor]; })())`, an: true, moTa: ['Walk all pages; exact last page has hasMore false', 'Đi hết các trang; trang cuối vừa đủ có hasMore false'] },
    { goi: `(seed(1), (() => { const e = H('GET', '/api/v1/notes/1').headers.etag; const bad = H('PATCH', '/api/v1/notes/1', { title: '', pinned: 1 }, { 'if-match': e }); const ok = H('PATCH', '/api/v1/notes/1', { pinned: true, id: 99 }, { 'if-match': e }); return [bad.status, bad.body, ok.status, ok.body, ok.headers.etag === etagOf(ok.body)]; })())`, an: true, moTa: ['PATCH validates only the fields sent; stale-free ETag reuse after 422', 'PATCH chỉ kiểm trường được gửi; ETag vẫn dùng được sau 422'] },
    { goi: `[short(H('PATCH', '/api/v1/notes/9', { title: 'x' }, { 'if-match': '"a"' })), H('DELETE', '/api/v1/notes'), H('POST', '/api/v1/notes', [1, 2]), H('PUT', '/api/v1/notes/1', {})]`, an: true },
    { goi: `(seed(2), [H('POST', '/api/v1/notes', { title: 'x'.repeat(200), body: '', pinned: false }).status, H('POST', '/api/v1/notes', { title: 'x'.repeat(201) }).status, H('GET', '/api/v1/notes?limit=50').body.items.length])`, an: true },
  ],
  saiMau: [
    createNotesV2.toString().replace("nextCursor: hasMore ? String(items[items.length - 1].id) : null", 'nextCursor: hasMore ? items[items.length - 1].id : null'),
    createNotesV2.toString().replace("if (!headers['if-match']) return fail(428, 'PRECONDITION_REQUIRED', 'If-Match header is required');", ''),
    createNotesV2.toString().replace('.slice(0, limit + 1);', '.slice(0, limit);'),
  ],
});

/* ── Lab 6 · 3 — Client thử lại an toàn ── */
function createNotesClient({ base, newKey }) {
  const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const errorOf = async (res) => { let code = 'HTTP_' + res.status; try { code = (await res.json()).error.code; } catch {} return new AppError(res.status, code); };

  async function createNote(data) {
    const key = newKey();                       // ONE key per user intent — made here, reused by every retry below
    for (let attempt = 1; ; attempt++) {
      let res;
      try {
        res = await fetch(base + '/notes', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key }, body: JSON.stringify(data) });
      } catch (err) {
        if (attempt >= 3) throw err;            // network error: the request MAY have arrived — safe to retry only because of the key
        await wait(100);
        continue;
      }
      if (res.status === 201) return res.json();
      if (res.status === 429 && attempt < 3) { await wait(Number(res.headers.get('retry-after')) * 1000); continue; }  // told exactly when
      if (res.status === 503 && attempt < 3) { await wait(100); continue; }  // temporarily down: retry later
      throw await errorOf(res);                 // 400/401/403/409/422…: retrying the same request cannot help
    }
  }

  async function rename(id, title) {
    const got = await fetch(base + '/notes/' + id);
    if (!got.ok) throw await errorOf(got);
    const etag = got.headers.get('etag');
    const res = await fetch(base + '/notes/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json', 'if-match': etag }, body: JSON.stringify({ title }) });
    if (res.ok) return { conflict: false, note: await res.json() };
    if (res.status === 412) {
      // someone else saved first: reload and let the HUMAN decide — never blindly re-send the write
      const fresh = await fetch(base + '/notes/' + id);
      return { conflict: true, current: await fresh.json() };
    }
    throw await errorOf(res);
  }
  return { createNote, rename };
}
const B = 'http://api.test/api/v1';
const NOTE1 = { id: 1, title: 'Original', body: '', pinned: false, version: 1 };
const L3 = jsBai({
  ten: 'Lab 6 · 3 — Build createNotesClient(): retries that cannot double-create, and a 412 handed to the human', kho: 'HARD', phut: 40, diem: 40, dangBai: 'lab',
  en: `<p>The other side of the contract: the mobile client. Write <code>createNotesClient({ base, newKey })</code> returning <code>{ createNote(data), rename(id, title) }</code>. It uses the global <code>fetch</code> (the grader’s fake fetch — every call is recorded) and <code>setTimeout</code> (virtual clock). <code>AppError</code> is in <code>helpers.js</code>.</p>
<h4>createNote(data)</h4>
<ul><li>Call <code>newKey()</code> <b>exactly once</b> per <code>createNote</code> call. Send <code>POST base + "/notes"</code> with headers <code>content-type: application/json</code> and <code>idempotency-key: &lt;key&gt;</code>, body <code>JSON.stringify(data)</code>. At most <b>3 attempts</b>, all with the <b>same</b> key.</li>
<li>201 ⇒ return the parsed body.</li>
<li>Network error (fetch rejects) ⇒ wait 100 ms and retry; on the 3rd failure re-throw that error.</li>
<li>429 ⇒ wait <code>Retry-After</code> seconds (header) and retry. 503 ⇒ wait 100 ms and retry. If it is already the 3rd attempt, treat it like any other error.</li>
<li>Any other status ⇒ throw <code>new AppError(status, code)</code> immediately, <code>code</code> = <code>error.code</code> of the JSON body (or <code>"HTTP_&lt;status&gt;"</code> if the body has none). No retry — the same request will fail the same way.</li></ul>
<h4>rename(id, title)</h4>
<ul><li><code>GET base + "/notes/" + id</code> (not ok ⇒ throw AppError as above), read its <code>etag</code> header, then <code>PATCH</code> with <code>if-match</code> and body <code>{ title }</code>.</li>
<li>OK ⇒ <code>{ conflict: false, note }</code>. 412 ⇒ GET the note again and return <code>{ conflict: true, current }</code> — <b>do not re-send the PATCH</b>. Other errors ⇒ throw AppError.</li></ul>`,
  vi: `<p>Phía bên kia của hợp đồng: client di động. Viết <code>createNotesClient({ base, newKey })</code> trả <code>{ createNote(data), rename(id, title) }</code>. Nó dùng <code>fetch</code> toàn cục (fetch GIẢ của máy chấm — mọi lời gọi được ghi lại) và <code>setTimeout</code> (đồng hồ ảo). <code>AppError</code> nằm trong <code>helpers.js</code>.</p>
<h4>createNote(data)</h4>
<ul><li>Gọi <code>newKey()</code> <b>đúng một lần</b> cho mỗi lần gọi <code>createNote</code>. Gửi <code>POST base + "/notes"</code> với headers <code>content-type: application/json</code> và <code>idempotency-key: &lt;khoá&gt;</code>, body <code>JSON.stringify(data)</code>. Tối đa <b>3 lần thử</b>, tất cả với <b>cùng</b> khoá.</li>
<li>201 ⇒ trả body đã đọc.</li>
<li>Lỗi mạng (fetch reject) ⇒ chờ 100 ms rồi thử lại; hỏng lần thứ 3 thì ném lại chính lỗi đó.</li>
<li>429 ⇒ chờ <code>Retry-After</code> giây (header) rồi thử lại. 503 ⇒ chờ 100 ms rồi thử lại. Nếu đã là lần thử thứ 3 thì xử lý như lỗi khác.</li>
<li>Mã khác ⇒ ném ngay <code>new AppError(status, code)</code>, <code>code</code> = <code>error.code</code> trong body JSON (hoặc <code>"HTTP_&lt;status&gt;"</code> nếu body không có). Không thử lại — cùng request sẽ hỏng y như vậy.</li></ul>
<h4>rename(id, title)</h4>
<ul><li><code>GET base + "/notes/" + id</code> (không ok ⇒ ném AppError như trên), đọc header <code>etag</code>, rồi <code>PATCH</code> với <code>if-match</code> và body <code>{ title }</code>.</li>
<li>OK ⇒ <code>{ conflict: false, note }</code>. 412 ⇒ GET lại ghi chú và trả <code>{ conflict: true, current }</code> — <b>không gửi lại PATCH</b>. Lỗi khác ⇒ ném AppError.</li></ul>`,
  yc: [['The idempotency key is created once per intent, outside the retry loop.', 'Khoá idempotent tạo một lần cho mỗi ý định, ngoài vòng thử lại.'], ['Retry only what can succeed later: network errors, 429, 503.', 'Chỉ thử lại thứ có thể thành công sau: lỗi mạng, 429, 503.'], ['A 412 goes back to the user, not into a loop.', '412 trả về cho người dùng, không đi vào vòng lặp.']],
  goiY: [['<code>for (let attempt = 1; ; attempt++) { … }</code> with <code>try { res = await fetch(…) } catch (err) { … continue; }</code> around ONLY the fetch.', '<code>for (let attempt = 1; ; attempt++) { … }</code> với <code>try { res = await fetch(…) } catch (err) { … continue; }</code> CHỈ bọc fetch.'], ['<code>res.headers.get("retry-after")</code> is a string of seconds: multiply by 1000.', '<code>res.headers.get("retry-after")</code> là chuỗi số giây: nhân 1000.'], ['Read the error code with <code>(await res.json()).error.code</code> inside try/catch — the body may not be JSON.', 'Đọc mã lỗi bằng <code>(await res.json()).error.code</code> trong try/catch — body có thể không phải JSON.']],
  loi: [['Calling <code>newKey()</code> inside the loop: each retry is a brand-new intent, and a lost response becomes two notes.', 'Gọi <code>newKey()</code> trong vòng lặp: mỗi lần thử lại là một ý định mới, và phản hồi bị mất thành hai ghi chú.'], ['Retrying a 422: the server will say exactly the same thing three times.', 'Thử lại 422: server sẽ nói y hệt ba lần.'], ['Re-sending the PATCH after a 412 with the new ETag — that silently overwrites the other person’s edit, the bug ETag exists to prevent.', 'Gửi lại PATCH sau 412 với ETag mới — lặng lẽ ghi đè bản sửa của người khác, đúng lỗi ETag sinh ra để chặn.']],
  gt: ['Retrying is only safe when the server can recognise the repeat. The key makes POST retry-safe, but only if it is minted at the moment of intent — the attempts are the same intent. Status codes tell the client which failures are worth retrying (429 with its Retry-After, 503, the network) and which are not (every other 4xx). And a 412 is information for a human: it means someone else’s work exists that you have not seen.', 'Thử lại chỉ an toàn khi server nhận ra được lần lặp. Khoá làm POST thử lại an toàn, nhưng chỉ khi nó được tạo đúng lúc có ý định — các lần thử là cùng một ý định. Mã trạng thái cho client biết lỗi nào đáng thử lại (429 kèm Retry-After, 503, lỗi mạng) và lỗi nào không (mọi 4xx khác). Còn 412 là thông tin cho con người: nghĩa là có công sức của người khác mà bạn chưa thấy.'],
  kn: ['retries', 'idempotency key', 'ETag', 'fetch'],
  tns: [tn('retry policy', 'chính sách thử lại'), tn('backoff', 'chờ trước khi thử lại'), tn('user intent', 'ý định người dùng', 'Một lần bấm nút.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function createNotesClient({ base, newKey }) {
  async function createNote(data) {
    // Write your solution here
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(base + '/notes', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': newKey() }, body: JSON.stringify(data) });
        if (res.ok) return res.json();
      } catch (err) {}
    }
    throw new AppError(500, 'FAILED');
  }
  async function rename(id, title) {
    const res = await fetch(base + '/notes/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) });
    return { conflict: false, note: await res.json() };
  }
  return { createNote, rename };
}
`,
  giai: createNotesClient,
  chung: `let k = 0; const newKey = () => 'key-' + (++k);
const C = () => createNotesClient({ base: '${B}', newKey });
const calls = () => __fetchDaGoi.map((c) => c.method + ' ' + c.url.replace('${B}', '') + (c.headers['idempotency-key'] ? ' key=' + c.headers['idempotency-key'] : '') + (c.headers['if-match'] ? ' if-match=' + c.headers['if-match'] : ''));
const caught = async (p) => { try { return await p; } catch (e) { return { thrown: e.name, status: e.status, code: e.code, ...(e.name === 'AppError' ? {} : { message: e.message }) }; } };`,
  cases: [
    { goi: `[await C().createNote({ title: 'A' }), calls(), Date.now() - 1767225600000]`, moTa: ['Network error, then 201: same key twice', 'Lỗi mạng rồi 201: cùng khoá hai lần'],
      fetchGia: { [`POST ${B}/notes`]: [{ loiMang: true }, { status: 201, json: { id: 1, title: 'A', body: '', pinned: false, version: 1 } }] } },
    { goi: `[await caught(C().createNote({ title: '' })), calls()]`, moTa: ['422 is not retried', '422 không được thử lại'],
      fetchGia: { [`POST ${B}/notes`]: { status: 422, json: { error: { code: 'VALIDATION_FAILED', message: 'The submitted data is not valid' } } } } },
    { goi: `[await C().rename(1, 'Mine'), calls()]`, moTa: ['rename: GET for the ETag, then PATCH with If-Match', 'rename: GET lấy ETag, rồi PATCH kèm If-Match'],
      fetchGia: { [`GET ${B}/notes/1`]: { status: 200, json: NOTE1, headers: { etag: '"aaa111"' } }, [`PATCH ${B}/notes/1`]: { status: 200, json: { ...NOTE1, title: 'Mine', version: 2 }, headers: { etag: '"bbb222"' } } } },
    { goi: `[await C().createNote({ title: 'B' }), calls(), Date.now() - 1767225600000]`, an: true, moTa: ['429 Retry-After: 2 ⇒ waits 2 s, then 503 ⇒ 100 ms, then 201', '429 Retry-After: 2 ⇒ chờ 2 s, rồi 503 ⇒ 100 ms, rồi 201'],
      fetchGia: { [`POST ${B}/notes`]: [{ status: 429, json: { error: { code: 'RATE_LIMITED' } }, headers: { 'retry-after': '2' } }, { status: 503, text: 'busy' }, { status: 201, json: { id: 2, title: 'B' } }] } },
    { goi: `[await caught(C().createNote({ title: 'C' })), calls()]`, an: true, moTa: ['Three network errors ⇒ the error is re-thrown after 3 attempts', 'Ba lỗi mạng ⇒ ném lại lỗi sau 3 lần'],
      fetchGia: { [`POST ${B}/notes`]: { loiMang: true } } },
    { goi: `await (async () => { const c = C(); await c.createNote({ title: 'one' }); await c.createNote({ title: 'two' }); return calls(); })()`, an: true, moTa: ['Two intents ⇒ two different keys', 'Hai ý định ⇒ hai khoá khác nhau'],
      fetchGia: { [`POST ${B}/notes`]: { status: 201, json: { id: 3 } } } },
    { goi: `[await C().rename(1, 'Mine'), calls()]`, an: true, moTa: ['412 ⇒ reload, return conflict, never re-send PATCH', '412 ⇒ tải lại, trả xung đột, không gửi lại PATCH'],
      fetchGia: { [`GET ${B}/notes/1`]: [{ status: 200, json: NOTE1, headers: { etag: '"aaa111"' } }, { status: 200, json: { ...NOTE1, title: 'Theirs', version: 2 }, headers: { etag: '"ccc333"' } }], [`PATCH ${B}/notes/1`]: { status: 412, json: { error: { code: 'PRECONDITION_FAILED' } } } } },
    { goi: `[await caught(C().rename(9, 'x')), await caught(C().createNote({ title: 'D' })), calls()]`, an: true,
      fetchGia: { [`GET ${B}/notes/9`]: { status: 404, json: { error: { code: 'NOTE_NOT_FOUND' } } }, [`POST ${B}/notes`]: [{ status: 503, text: 'x' }, { status: 503, text: 'x' }, { status: 503, text: 'down' }] } },
  ],
  saiMau: [
    createNotesClient.toString().replace("const key = newKey();", '').replace("'idempotency-key': key", "'idempotency-key': newKey()"),
    createNotesClient.toString().replace("if (res.status === 429 && attempt < 3) { await wait(Number(res.headers.get('retry-after')) * 1000); continue; }", "if (res.status === 429 && attempt < 3) { await wait(100); continue; }"),
  ],
});

export default modul('nodejs-6-lab-notes-contract', 'Lab 6 — Notes API v2: a contract a mobile app can rely on', [L1, L2, L3], 'nodejs-6-5-hop-dong-api');
