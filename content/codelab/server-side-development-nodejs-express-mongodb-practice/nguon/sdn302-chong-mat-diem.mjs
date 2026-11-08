/** SDN302 · 0.6 — Vì sao mất điểm: 7 lỗi kinh điển (async, không validate, mật khẩu thô, sai mã trạng thái, controller béo, quên populate, chỉ đọc không chạy) — sửa từng lỗi trên mã chạy được. */
import { doiDau, KHOA, bai, cs, bang1, tn } from './_sdn.mjs';

const J = String.raw;
const NOTE = J`const express = require('express');
const mongoose = require('mongoose');
const Note = mongoose.model('Note', new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true }));`;

const FIX = ['await every Mongoose call', 'validate and answer 400', 'hash with bcrypt', 'use the right status code', 'split into route → controller → service → model', 'use .populate()', 'build endpoints under a timer'];
const E1 = cs({
  ten: 'The 7 ways to lose marks — and the fix for each', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each symptom seen in a graded project with the fix from the lesson.',
  vi: 'Ghép mỗi triệu chứng thấy trong một project được chấm với cách sửa của bài.',
  bang: [bang1('l1', ['Symptom → fix', 'Triệu chứng → cách sửa'], [{ ma: 'tc', ten: 'Symptom' }, { ma: 'fix', ten: 'Fix', luaChon: FIX }], [
    { o: { tc: 'res.json(Note.find()) sends {}' }, a: { fix: 'await every Mongoose call' } },
    { o: { tc: 'POST with an empty body crashes with a 500 and a stack trace' }, a: { fix: 'validate and answer 400' } },
    { o: { tc: 'Compass shows password: "123456"' }, a: { fix: 'hash with bcrypt' } },
    { o: { tc: 'GET of a missing id answers 200 null' }, a: { fix: 'use the right status code' } },
    { o: { tc: 'A 400-line routes.js that queries MongoDB in every route' }, a: { fix: 'split into route → controller → service → model' } },
    { o: { tc: 'Comments show user: "665f…" instead of the user\'s name' }, a: { fix: 'use .populate()' } },
    { o: { tc: 'Knows the theory, runs out of time in the Practical Exam' }, a: { fix: 'build endpoints under a timer' } },
  ], ['These are the seven rows of the lesson, in the same order — each is a habit you can practise in this track: async (1.1, 3.2), validation (4.1), bcrypt (5.1), status codes (4.1), MVC (4.1), populate (3.2), timed practice (7.1 and the PE module).', 'Đây là bảy hàng của bài, cùng thứ tự — mỗi hàng là một thói quen luyện được ngay trong track này: async (1.1, 3.2), validation (4.1), bcrypt (5.1), mã trạng thái (4.1), MVC (4.1), populate (3.2), luyện bấm giờ (7.1 và module PE).'])],
  goiY: [['Read the symptom as a bug report.', 'Đọc triệu chứng như một báo cáo lỗi.'], ['A Query object serialises to {}.', 'Đối tượng Query tuần tự hoá ra {}.']],
  loi: [['Fixing the 500 with try/catch that answers 500 anyway.', 'Sửa 500 bằng try/catch mà vẫn trả 500.'], ['Answering 200 null.', 'Trả 200 null.']],
  tns: [tn('symptom', 'triệu chứng')],
  kn: ['common mistakes'],
});

const E2 = bai({
  ten: 'Loss #1 — the async bug: a Query is not data', kho: 'MEDIUM', phut: 10, lib: ['mongoose', 'express'],
  en: J`<p>This endpoint "works" in the sense that it answers — but the answer is wrong. <code>GET /api/notes</code> must return <code>{ count, notes }</code> with every note, newest first (<code>createdAt</code> descending). Fix the async mistakes; keep the response shape.</p>`,
  vi: J`<p>Endpoint này "chạy" theo nghĩa là nó có trả lời — nhưng trả lời sai. <code>GET /api/notes</code> phải trả <code>{ count, notes }</code> với mọi ghi chú, mới nhất trước (<code>createdAt</code> giảm dần). Sửa các lỗi async; giữ hình dạng câu trả lời.</p>`,
  yc: [['Make the handler <code>async</code> and <code>await</code> the query.', 'Cho handler là <code>async</code> và <code>await</code> truy vấn.'], ['Forward errors with <code>next(err)</code>.', 'Chuyển lỗi bằng <code>next(err)</code>.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['GET /api/notes (3 notes)', '{"count":3,"notes":[{newest…},…]}', 'Before the fix: {"notes":{}} and no count.', 'Trước khi sửa: {"notes":{}} và không có count.']],
  goiY: [['<code>const notes = await Note.find().sort({ createdAt: -1 });</code>', '<code>const notes = await Note.find().sort({ createdAt: -1 });</code>'], ['<code>count: notes.length</code> works only once <code>notes</code> is an array.', '<code>count: notes.length</code> chỉ chạy khi <code>notes</code> đã là mảng.']],
  loi: [['Adding <code>await</code> but not <code>async</code>: SyntaxError at load time.', 'Thêm <code>await</code> mà không <code>async</code>: SyntaxError lúc nạp.'], ['<code>.sort({ createdAt: 1 })</code> — oldest first.', '<code>.sort({ createdAt: 1 })</code> — cũ nhất trước.']],
  gt: ['"Every DB call is async": without <code>await</code>, <code>notes</code> is a Query (it serialises to <code>{}</code>) and <code>notes.length</code> is undefined, which JSON drops. Awaiting turns the plan into an array.', '"Mọi lời gọi CSDL là async": không có <code>await</code>, <code>notes</code> là một Query (tuần tự hoá ra <code>{}</code>) và <code>notes.length</code> là undefined, JSON bỏ mất. Await biến kế hoạch thành mảng.'],
  kn: ['async/await'],
  tns: [tn('serialise', 'tuần tự hoá', 'biến đối tượng thành JSON')],
  dau: J`${NOTE}

const app = express();
app.get('/api/notes', (req, res) => {
  const notes = Note.find();
  res.json({ count: notes.length, notes });
});
module.exports = app;
`,
  giai: J`${NOTE}

const app = express();
app.get('/api/notes', async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });   // await: the Query becomes an ARRAY
    res.json({ count: notes.length, notes });
  } catch (err) { next(err); }
});
module.exports = app;
`,
  chuanBi: `await Note.create({ title: 'First' }); await __sleep(5); await Note.create({ title: 'Second' }); await __sleep(5); await Note.create({ title: 'Third', done: true }); const go = async () => (await module.exports.inject({ url: '/api/notes' })).body;`,
  cases: [
    { goi: `(await go()).count`, moTa: ['count is 3', 'count là 3'] },
    { goi: `(await go()).notes.map((n) => n.title)`, moTa: ['Newest first', 'Mới nhất trước'] },
    { goi: `(await Note.deleteMany({}), await go())`, an: true },
  ],
});

const E3 = bai({
  ten: 'Loss #2 + #4 — validation and status codes in one route', kho: 'MEDIUM', phut: 15, lib: ['mongoose', 'express'],
  en: J`<p>The starter answers <code>200</code> for everything and crashes on bad input. Rewrite two routes:</p>
<ul><li><code>POST /api/notes</code> — <code>title</code> must be a non-empty string ⇒ else <code>400</code> <code>{ error: "title is required" }</code>; success ⇒ <code>201</code> + the note;</li>
<li><code>PATCH /api/notes/:id</code> — invalid id ⇒ <code>400</code> <code>{ error: "Invalid id" }</code>; <code>done</code> must be a boolean ⇒ else <code>400</code> <code>{ error: "done must be true or false" }</code>; missing note ⇒ <code>404</code> <code>{ error: "Note not found" }</code>; success ⇒ <code>200</code> + the updated note.</li></ul>`,
  vi: J`<p>Code khởi đầu trả <code>200</code> cho mọi thứ và sập khi đầu vào xấu. Viết lại hai route:</p>
<ul><li><code>POST /api/notes</code> — <code>title</code> phải là chuỗi không rỗng ⇒ không thì <code>400</code> <code>{ error: "title is required" }</code>; thành công ⇒ <code>201</code> + ghi chú;</li>
<li><code>PATCH /api/notes/:id</code> — id sai ⇒ <code>400</code> <code>{ error: "Invalid id" }</code>; <code>done</code> phải là boolean ⇒ không thì <code>400</code> <code>{ error: "done must be true or false" }</code>; không có ghi chú ⇒ <code>404</code> <code>{ error: "Note not found" }</code>; thành công ⇒ <code>200</code> + ghi chú đã sửa.</li></ul>`,
  yc: [['<code>app.use(express.json())</code> first.', '<code>app.use(express.json())</code> trước tiên.'], ['Use <code>mongoose.isValidObjectId</code> and <code>{ new: true }</code>.', 'Dùng <code>mongoose.isValidObjectId</code> và <code>{ new: true }</code>.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['POST /api/notes {}', '400 {"error":"title is required"}', 'Not a 500 with a stack trace.', 'Không phải 500 kèm stack trace.'], ['PATCH /api/notes/<missing id> {"done":true}', '404 {"error":"Note not found"}', 'Not 200 null.', 'Không phải 200 null.']],
  goiY: [['Validate first, touch the database second.', 'Kiểm tra trước, đụng CSDL sau.'], ['<code>typeof req.body.done !== \'boolean\'</code> rejects <code>"true"</code> (a string) too — on purpose.', '<code>typeof req.body.done !== \'boolean\'</code> từ chối cả <code>"true"</code> (chuỗi) — có chủ ý.']],
  loi: [['Letting Mongoose\'s ValidationError reach the default handler — a 500 HTML page instead of a 400.', 'Để ValidationError của Mongoose tới handler mặc định — trang HTML 500 thay vì 400.'], ['<code>res.json(await Note.findByIdAndUpdate(…))</code> — <code>200 null</code> for a missing note.', '<code>res.json(await Note.findByIdAndUpdate(…))</code> — <code>200 null</code> cho ghi chú không có.']],
  gt: ['Validation at the top of the handler turns bad input into a precise 400 before any database work; the id check prevents a CastError; the <code>null</code> check maps "not there" to 404; and 201 tells the client that something was created. Status codes are the part of the answer the client reads first.', 'Kiểm tra ở đầu handler biến đầu vào xấu thành một 400 chính xác trước mọi việc với CSDL; kiểm id chặn CastError; kiểm <code>null</code> quy "không có" về 404; và 201 báo cho client là có thứ vừa được tạo. Mã trạng thái là phần client đọc đầu tiên.'],
  kn: ['validation', 'status codes'],
  tns: [tn('stack trace', 'dấu vết ngăn xếp', 'không bao giờ gửi cho client')],
  dau: J`${NOTE}

const app = express();
app.use(express.json());
app.post('/api/notes', async (req, res) => {
  res.json(await Note.create(req.body));
});
app.patch('/api/notes/:id', async (req, res) => {
  res.json(await Note.findByIdAndUpdate(req.params.id, { done: req.body.done }));
});
module.exports = app;
`,
  giai: J`${NOTE}

const app = express();
app.use(express.json());

app.post('/api/notes', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ error: 'title is required' });
    res.status(201).json(await Note.create({ title: title.trim() }));     // 201 Created
  } catch (err) { next(err); }
});

app.patch('/api/notes/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    if (typeof req.body.done !== 'boolean') return res.status(400).json({ error: 'done must be true or false' });
    const note = await Note.findByIdAndUpdate(req.params.id, { done: req.body.done }, { new: true });
    if (!note) return res.status(404).json({ error: 'Note not found' });   // never 200 null
    res.json(note);
  } catch (err) { next(err); }
});

module.exports = app;
`,
  chuanBi: `const n = await Note.create({ title: 'Existing' }); const go = async (method, url, body) => { const r = await module.exports.inject({ method, url, body }); return { status: r.status, body: r.body && r.body._id ? __pick(r.body, 'title done') : r.body }; };`,
  cases: [
    { goi: `[await go('POST', '/api/notes', {}), await go('POST', '/api/notes', { title: '  ' })]`, moTa: ['Missing/blank title → 400', 'Thiếu/rỗng title → 400'] },
    { goi: `await go('POST', '/api/notes', { title: 'Buy milk' })`, moTa: ['Valid → 201', 'Hợp lệ → 201'] },
    { goi: `[await go('PATCH', '/api/notes/abc', { done: true }), await go('PATCH', '/api/notes/' + n._id, { done: 'yes' })]`, moTa: ['Bad id / bad done → 400', 'Id sai / done sai → 400'] },
    { goi: `[await go('PATCH', '/api/notes/' + new mongoose.Types.ObjectId(), { done: true }), await go('PATCH', '/api/notes/' + n._id, { done: true })]`, moTa: ['Missing → 404; existing → 200 updated', 'Không có → 404; có → 200 đã sửa'] },
    { goi: `[await go('POST', '/api/notes', { title: 5 }), await go('PATCH', '/api/notes/' + n._id, { done: false })]`, an: true },
  ],
});

const E4 = bai({
  ten: 'Loss #5 — the fat controller: split it into layers', kho: 'HARD', phut: 20, lib: ['mongoose', 'express'],
  en: J`<p>The starter puts everything in one route. Split it without changing the behaviour of <code>GET /api/notes?done=true|false</code> (list, newest first, optional filter):</p>
<ul><li><code>makeNoteService(Note)</code> → <code>{ list({ done }) }</code> — the only code that touches the model;</li>
<li><code>makeNoteController(noteService)</code> → <code>{ list(req, res, next) }</code> — reads <code>req.query.done</code> (<code>"true"</code> / <code>"false"</code> / absent; anything else ⇒ <code>400</code> <code>{ error: "done must be true or false" }</code>), calls the service, answers 200;</li>
<li>the router wires <code>GET /</code> to the controller; the app mounts it on <code>/api/notes</code>.</li></ul>
<p>Export <code>module.exports = { app, makeNoteService, makeNoteController };</code>. The grader also tests each layer alone (a fake model for the service, a fake service for the controller).</p>`,
  vi: J`<p>Code khởi đầu dồn mọi thứ vào một route. Tách nó ra mà không đổi hành vi của <code>GET /api/notes?done=true|false</code> (danh sách, mới nhất trước, lọc tuỳ chọn):</p>
<ul><li><code>makeNoteService(Note)</code> → <code>{ list({ done }) }</code> — đoạn mã duy nhất đụng tới model;</li>
<li><code>makeNoteController(noteService)</code> → <code>{ list(req, res, next) }</code> — đọc <code>req.query.done</code> (<code>"true"</code> / <code>"false"</code> / vắng; khác nữa ⇒ <code>400</code> <code>{ error: "done must be true or false" }</code>), gọi service, trả 200;</li>
<li>router nối <code>GET /</code> với controller; app gắn nó ở <code>/api/notes</code>.</li></ul>
<p>Export <code>module.exports = { app, makeNoteService, makeNoteController };</code>. Máy chấm còn kiểm từng tầng riêng (model giả cho service, service giả cho controller).</p>`,
  yc: [['The service receives a real boolean (or <code>undefined</code>), never the query string.', 'Service nhận boolean thật (hoặc <code>undefined</code>), không bao giờ nhận query string.'], ['The controller never imports or calls the model.', 'Controller không bao giờ import hay gọi model.']],
  viDu: [['GET /api/notes?done=false', '200 [the notes not done, newest first]', 'Same result as before the refactor.', 'Cùng kết quả như trước khi tách.'], ['makeNoteController(fake).list with ?done=maybe', '400, and the fake service was never called', 'Validation lives in the controller.', 'Kiểm tra nằm ở controller.']],
  goiY: [['Service: <code>list: ({ done } = {}) => Note.find(done === undefined ? {} : { done }).sort({ createdAt: -1 })</code>', 'Service: <code>list: ({ done } = {}) => Note.find(done === undefined ? {} : { done }).sort({ createdAt: -1 })</code>'], ['Controller: <code>const raw = req.query.done; const done = raw === undefined ? undefined : raw === \'true\' ? true : raw === \'false\' ? false : null;</code>', 'Controller: <code>const raw = req.query.done; const done = raw === undefined ? undefined : raw === \'true\' ? true : raw === \'false\' ? false : null;</code>']],
  loi: [['Passing <code>req.query</code> straight to the service: <code>{ done: "false" }</code> — the string "false" is cast by Mongoose, but the service now depends on HTTP details.', 'Đưa thẳng <code>req.query</code> cho service: <code>{ done: "false" }</code> — chuỗi "false" được Mongoose ép kiểu, nhưng service giờ phụ thuộc chi tiết HTTP.'], ['Calling <code>Note.find</code> from the controller "just this once".', 'Gọi <code>Note.find</code> từ controller "chỉ lần này thôi".']],
  gt: ['After the split each layer has one job and can be tested alone with a fake neighbour — which is what the grader does. The route file shrinks to wiring, the controller to HTTP translation, and the service to the query. That is the MVC habit the lesson rewards and graders look for.', 'Sau khi tách, mỗi tầng có một việc và kiểm được riêng với một hàng xóm giả — đúng như máy chấm làm. Tệp route gọn lại thành phần nối dây, controller thành phần dịch HTTP, service thành phần truy vấn. Đó là thói quen MVC mà bài thưởng điểm và giám khảo tìm.'],
  kn: ['MVC', 'refactoring'],
  tns: [tn('refactor', 'tái cấu trúc', 'đổi cấu trúc, giữ hành vi')],
  dau: J`${NOTE}

const app = express();
app.get('/api/notes', async (req, res) => {
  const filter = req.query.done ? { done: req.query.done } : {};
  res.json(await Note.find(filter).sort({ createdAt: -1 }));
});

function makeNoteService(Note) { return {}; }
function makeNoteController(noteService) { return {}; }
module.exports = { app, makeNoteService, makeNoteController };
`,
  giai: J`${NOTE}

// service: the ONLY layer that touches the model
function makeNoteService(Note) {
  return {
    list({ done } = {}) {
      return Note.find(done === undefined ? {} : { done }).sort({ createdAt: -1 });
    },
  };
}

// controller: HTTP in, HTTP out — no model here
function makeNoteController(noteService) {
  return {
    async list(req, res, next) {
      try {
        const raw = req.query.done;
        const done = raw === undefined ? undefined : raw === 'true' ? true : raw === 'false' ? false : null;
        if (done === null) return res.status(400).json({ error: 'done must be true or false' });
        res.json(await noteService.list({ done }));
      } catch (err) { next(err); }
    },
  };
}

// route: wiring only
const controller = makeNoteController(makeNoteService(Note));
const router = express.Router();
router.get('/', controller.list);

const app = express();
app.use('/api/notes', router);
module.exports = { app, makeNoteService, makeNoteController };
`,
  chuanBi: `const { app, makeNoteService, makeNoteController } = module.exports; await Note.create({ title: 'A' }); await __sleep(5); await Note.create({ title: 'B', done: true }); await __sleep(5); await Note.create({ title: 'C' });
const titles = (list) => list.map((n) => n.title); const calls = [];
const fakeService = { list: async (o) => { calls.push(o); return [{ title: 'fake' }]; } };
const fakeModel = { find: (f) => { calls.push(f); return { sort: (s) => { calls.push(s); return Promise.resolve([]); } }; } };`,
  cases: [
    { goi: `[titles((await app.inject({ url: '/api/notes' })).body), titles((await app.inject({ url: '/api/notes?done=false' })).body)]`, moTa: ['The app still works: all, then not done', 'App vẫn chạy: tất cả, rồi chưa xong'] },
    { goi: `[__pick(await __goi(makeNoteController(fakeService).list, { url: '/?done=maybe' }), 'status body'), calls.length]`, moTa: ['Controller alone: bad done → 400, service not called', 'Riêng controller: done sai → 400, không gọi service'] },
    { goi: `(await __goi(makeNoteController(fakeService).list, { url: '/?done=true' }), calls)`, moTa: ['Controller passes a real boolean to the service', 'Controller đưa boolean thật cho service'] },
    { goi: `(await makeNoteService(fakeModel).list({}), await makeNoteService(fakeModel).list({ done: false }), calls)`, moTa: ['Service alone: builds the filter and the sort', 'Riêng service: dựng bộ lọc và sắp xếp'] },
    { goi: `[titles((await app.inject({ url: '/api/notes?done=true' })).body), (await app.inject({ url: '/api/notes?done=1' })).status]`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-chong-mat-diem',
  ten: '0.6 Why students lose marks & the formula for a high grade',
  khoa: KHOA,
  baiHoc: 'sdn302-chong-mat-diem',
  de: [E1, E2, E3, E4],
});
