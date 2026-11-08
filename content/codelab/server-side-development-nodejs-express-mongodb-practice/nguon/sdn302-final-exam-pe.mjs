/** SDN302 · Practical Exam (25%, 85 phút, on-going, cổng ≥ 4) — kế hoạch tập dượt của trang PE thành 4 bài chạy được: bộ khung + .env, schema + 5 route CRUD, populate + lọc/tìm, bcrypt + token bảo vệ một route. Miền "Course catalog" soạn mới, không chép đề thật. */
import { doiDau, KHOA, bai, maNguon, tn } from './_sdn.mjs';

const J = String.raw;
const ENV = { MONGO_URI: 'mongodb://127.0.0.1:27017/SDN_Practice', PORT: '9999', JWT_SECRET: 'pe-practice-secret' };
const DOTENV = 'MONGO_URI=mongodb://127.0.0.1:27017/SDN_Practice\nPORT=9999\nJWT_SECRET=pe-practice-secret\n';
const MODELS = J`const { Schema } = mongoose;
const Instructor = mongoose.model('Instructor', new Schema({ name: { type: String, required: true }, email: String }));
const Course = mongoose.model('Course', new Schema({
  title: { type: String, required: true, unique: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  price: { type: Number, required: true, min: 0 },
  instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
}, { timestamps: true }));`;

const P1 = bai({
  ten: 'PE rehearsal 1 — the skeleton in 10 minutes: .env, Mongoose, port 9999', kho: 'EASY', phut: 10, lib: ['mongoose', 'express'],
  en: J`<p>Many real PEs give 0 points if the app does not read its connection string from <code>.env</code> or does not serve on the required port. Type the skeleton from memory:</p>
<ul><li><code>require('dotenv').config()</code> first; <code>mongoose.connect(process.env.MONGO_URI)</code>;</li>
<li><code>express()</code> + <code>express.json()</code>;</li>
<li><code>GET /api/health</code> → 200 <code>{ status: "ok", db: "connected" }</code> when <code>mongoose.connection.readyState === 1</code>, else <code>{ status: "ok", db: "disconnected" }</code>;</li>
<li>a JSON 404 and an error handler (500 <code>{ error: "Internal Server Error" }</code>);</li>
<li><code>app.listen(process.env.PORT, …)</code> and <code>module.exports = app;</code></li></ul>
<p>The <code>.env</code> file is in the project (the grader loads it for you, like dotenv would).</p>`,
  vi: J`<p>Nhiều đề PE thật cho 0 điểm nếu app không đọc chuỗi kết nối từ <code>.env</code> hoặc không phục vụ ở đúng cổng yêu cầu. Gõ bộ khung từ trí nhớ:</p>
<ul><li><code>require('dotenv').config()</code> trước tiên; <code>mongoose.connect(process.env.MONGO_URI)</code>;</li>
<li><code>express()</code> + <code>express.json()</code>;</li>
<li><code>GET /api/health</code> → 200 <code>{ status: "ok", db: "connected" }</code> khi <code>mongoose.connection.readyState === 1</code>, ngược lại <code>{ status: "ok", db: "disconnected" }</code>;</li>
<li>một 404 JSON và một error handler (500 <code>{ error: "Internal Server Error" }</code>);</li>
<li><code>app.listen(process.env.PORT, …)</code> và <code>module.exports = app;</code></li></ul>
<p>Tệp <code>.env</code> có sẵn trong dự án (máy chấm nạp giúp bạn, như dotenv).</p>`,
  yc: [['No connection string or port number written in <code>answer.js</code>.', 'Không có chuỗi kết nối hay số cổng viết trong <code>answer.js</code>.'], ['Test as you go: the health route is your first Postman call.', 'Kiểm khi làm: route health là lời gọi Postman đầu tiên.']],
  viDu: [['GET http://localhost:9999/api/health (after the connection opened)', '200 {"status":"ok","db":"connected"}', 'The PE grader\'s first check.', 'Phép kiểm đầu tiên của giám khảo PE.']],
  goiY: [['The order: dotenv → express/json → connect → routes → 404 → error handler → listen.', 'Thứ tự: dotenv → express/json → connect → route → 404 → error handler → listen.'], ['<code>mongoose.connection.readyState</code>: 0 disconnected, 1 connected.', '<code>mongoose.connection.readyState</code>: 0 mất kết nối, 1 đã kết nối.']],
  loi: [['<code>mongoose.connect(\'mongodb://localhost:27017/test\')</code> — the hard-coded URI that costs the whole PE.', '<code>mongoose.connect(\'mongodb://localhost:27017/test\')</code> — URI viết cứng làm mất cả bài PE.'], ['<code>app.listen(3000)</code> when the paper says 9999.', '<code>app.listen(3000)</code> khi đề nói 9999.']],
  gt: ['Everything environment-specific comes from <code>process.env</code>, so the same file runs on the grader\'s machine with its own <code>.env</code>. The health route proves in one request that the server is up AND the database connection is open.', 'Mọi thứ phụ thuộc môi trường đến từ <code>process.env</code>, nên cùng một tệp chạy trên máy giám khảo với <code>.env</code> của họ. Route health chứng minh trong một request rằng server đang chạy VÀ kết nối CSDL đã mở.'],
  kn: ['dotenv', 'mongoose.connect'],
  tns: [tn('.env', 'tệp biến môi trường'), tn('readyState', 'trạng thái kết nối')],
  env: ENV, them: { '.env': DOTENV },
  dau: J`const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/test');

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3000);
module.exports = app;
`,
  giai: J`require('dotenv').config();                       // .env ⇒ process.env, before anything reads it
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).catch((err) => console.error('MongoDB connection failed:', err.message));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Internal Server Error' }); });

app.listen(process.env.PORT, () => console.log('Listening on ' + process.env.PORT));
module.exports = app;
`,
  chuanBi: `const app = module.exports;`,
  cases: [
    { goi: `(await __sleep(50), __res(await app.inject({ url: '/api/health' })))`, moTa: ['/api/health after connecting → db connected', '/api/health sau khi kết nối → db connected'] },
    { goi: `(await __sleep(50), [__mongo.connectedTo, (__listening || []).map(String)])`, moTa: ['Connected with MONGO_URI from .env, listening on 9999', 'Kết nối bằng MONGO_URI từ .env, nghe ở 9999'] },
    { goi: `__res(await app.inject({ url: '/api/nope' }))`, moTa: ['Unknown route → JSON 404', 'Route lạ → 404 JSON'] },
    { goi: `(await __sleep(50), mongoose.connection.readyState = 0, __res(await app.inject({ url: '/api/health' })))`, an: true, moTa: ['db reflects mongoose.connection.readyState (not hard-coded)', 'db phản ánh mongoose.connection.readyState (không viết cứng)'] },
  ],
  kiemThem: [
    maNguon(['No connection string in answer.js', 'Không có chuỗi kết nối trong answer.js'], 'mongodb(\\+srv)?://', { phuDinh: true }),
    maNguon(['dotenv is loaded', 'Có nạp dotenv'], "require\\(['\"]dotenv['\"]\\)\\.config\\(\\)"),
    maNguon(['No hard-coded port in listen()', 'Không viết cứng cổng trong listen()'], 'listen\\(\\s*\\d', { phuDinh: true }),
  ],
});

const P2 = bai({
  ten: 'PE rehearsal 2 — a resource from empty to five CRUD routes', kho: 'MEDIUM', phut: 25, lib: ['mongoose', 'express'],
  en: J`<p>The models are given. Build the router for <code>/api/courses</code> with the status codes the PE checks:</p>
<table><thead><tr><th>Route</th><th>Answer</th></tr></thead><tbody>
<tr><td><code>GET /</code></td><td>200 list, newest first</td></tr>
<tr><td><code>GET /:id</code></td><td>200 · 400 <code>Invalid id</code> · 404 <code>Course not found</code></td></tr>
<tr><td><code>POST /</code></td><td>201 · 400 <code>{ error: "Validation failed", details: { path: message } }</code> · 409 <code>Course title already exists</code></td></tr>
<tr><td><code>PUT /:id</code></td><td>200 updated (validators on) · 400 · 404</td></tr>
<tr><td><code>DELETE /:id</code></td><td>200 <code>{ message: "Course deleted" }</code> · 400 · 404</td></tr></tbody></table>
<p>Accept only <code>title</code>, <code>level</code>, <code>price</code>, <code>instructor</code> from bodies. Export <code>module.exports = app;</code></p>`,
  vi: J`<p>Model cho sẵn. Dựng router cho <code>/api/courses</code> với các mã trạng thái mà PE kiểm:</p>
<table><thead><tr><th>Route</th><th>Trả lời</th></tr></thead><tbody>
<tr><td><code>GET /</code></td><td>200 danh sách, mới nhất trước</td></tr>
<tr><td><code>GET /:id</code></td><td>200 · 400 <code>Invalid id</code> · 404 <code>Course not found</code></td></tr>
<tr><td><code>POST /</code></td><td>201 · 400 <code>{ error: "Validation failed", details: { path: message } }</code> · 409 <code>Course title already exists</code></td></tr>
<tr><td><code>PUT /:id</code></td><td>200 đã sửa (bật validator) · 400 · 404</td></tr>
<tr><td><code>DELETE /:id</code></td><td>200 <code>{ message: "Course deleted" }</code> · 400 · 404</td></tr></tbody></table>
<p>Chỉ nhận <code>title</code>, <code>level</code>, <code>price</code>, <code>instructor</code> từ body. Export <code>module.exports = app;</code></p>`,
  yc: [['One error handler maps ValidationError → 400 + details, CastError → 400 Invalid id, E11000 → 409.', 'Một error handler ánh xạ ValidationError → 400 + details, CastError → 400 Invalid id, E11000 → 409.'], ['A tiny <code>pick(body)</code> keeps only the four accepted fields.', 'Một hàm nhỏ <code>pick(body)</code> chỉ giữ bốn field được nhận.']],
  viDu: [['POST /api/courses {"title":"Node 101","price":-5}', '400 {"error":"Validation failed","details":{"price":"Path `price` (-5) is less than minimum allowed value (0)."}}', 'From the schema\'s min rule.', 'Từ luật min của schema.'], ['DELETE /api/courses/<id>', '200 {"message":"Course deleted"}', 'This PE wants a message, not 204 — read the paper.', 'PE này muốn có message, không phải 204 — đọc kỹ đề.']],
  goiY: [['Re-use the full wiring of lesson 4.1 — same error handler.', 'Dùng lại cách ráp đầy đủ ở bài 4.1 — cùng error handler.'], ['<code>const pick = ({ title, level, price, instructor }) => Object.fromEntries(Object.entries({ title, level, price, instructor }).filter(([, v]) => v !== undefined));</code>', '<code>const pick = ({ title, level, price, instructor }) => Object.fromEntries(Object.entries({ title, level, price, instructor }).filter(([, v]) => v !== undefined));</code>']],
  loi: [['Answering 204 when the paper asks for a message (or the reverse) — the rubric checks the exact status.', 'Trả 204 khi đề đòi một message (hoặc ngược lại) — thang chấm kiểm đúng mã.'], ['Mapping every CastError to "Invalid id": a bad <code>price</code> type is a validation error.', 'Ánh xạ mọi CastError thành "Invalid id": kiểu <code>price</code> sai là lỗi kiểm tra.']],
  gt: ['This is "a new resource, from empty folder to a working GET / POST", extended to the five routes, rehearsed until it takes minutes. The central error handler keeps every route short and gives the PE grader exactly the codes listed in the paper.', 'Đây là "một tài nguyên mới, từ thư mục trống tới GET / POST chạy được", mở rộng ra năm route, tập tới khi chỉ mất vài phút. Error handler trung tâm giữ mọi route ngắn gọn và đưa cho giám khảo PE đúng các mã liệt kê trong đề.'],
  kn: ['CRUD', 'status codes'],
  tns: [tn('rubric', 'thang chấm')],
  env: ENV, them: { '.env': DOTENV },
  dau: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
${MODELS}

const app = express();
app.use(express.json());
const router = express.Router();
router.get('/', async (req, res) => res.json(await Course.find()));
router.post('/', async (req, res) => res.json(await Course.create(req.body)));
app.use('/api/courses', router);
module.exports = app;
`,
  giai: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
${MODELS}

const pick = ({ title, level, price, instructor }) =>
  Object.fromEntries(Object.entries({ title, level, price, instructor }).filter(([, v]) => v !== undefined));
const notFound = (res) => res.status(404).json({ error: 'Course not found' });
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = express.Router();
router.get('/', wrap(async (req, res) => res.json(await Course.find().sort({ createdAt: -1 }))));
router.get('/:id', wrap(async (req, res) => {
  const c = await Course.findById(req.params.id);          // a malformed id ⇒ CastError ⇒ 400 below
  if (!c) return notFound(res);
  res.json(c);
}));
router.post('/', wrap(async (req, res) => res.status(201).json(await Course.create(pick(req.body)))));
router.put('/:id', wrap(async (req, res) => {
  const c = await Course.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!c) return notFound(res);
  res.json(c);
}));
router.delete('/:id', wrap(async (req, res) => {
  const c = await Course.findByIdAndDelete(req.params.id);
  if (!c) return notFound(res);
  res.json({ message: 'Course deleted' });                  // what this paper asks for
}));

const app = express();
app.use(express.json());
app.use('/api/courses', router);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: Object.fromEntries(Object.entries(err.errors).map(([p, e]) => [p, e.message])) });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ error: 'Course title already exists' });
  res.status(500).json({ error: 'Internal Server Error' });
});
module.exports = app;
`,
  chuanBi: `const go = async (method, url, body) => { const r = await module.exports.inject({ method, url, body }); const b = r.body; return { status: r.status, body: b && b._id ? __pick(b, 'title level price') : Array.isArray(b) ? b.map((x) => x.title) : b }; };
const t = await mongoose.model('Instructor').create({ name: 'Thay Hoa' }); const c1 = await mongoose.model('Course').create({ title: 'Git basics', price: 0, instructor: t._id }); await __sleep(5); const c2 = await mongoose.model('Course').create({ title: 'Express 101', price: 20, level: 'intermediate' });`,
  cases: [
    { goi: `[await go('GET', '/api/courses'), await go('GET', '/api/courses/' + c1._id), await go('GET', '/api/courses/abc'), await go('GET', '/api/courses/' + new mongoose.Types.ObjectId())]`, moTa: ['GET list newest first; GET one 200/400/404', 'GET danh sách mới nhất trước; GET một 200/400/404'] },
    { goi: `[await go('POST', '/api/courses', { title: 'Node 101', price: 10, _id: 'x', createdAt: 'hack' }), await go('POST', '/api/courses', { title: 'Node 102', price: -5, level: 'expert' })]`, moTa: ['POST 201; validation → 400 + details', 'POST 201; kiểm tra → 400 + details'] },
    { goi: `await go('POST', '/api/courses', { title: 'Git basics', price: 5 })`, moTa: ['Duplicate title → 409', 'Trùng tiêu đề → 409'] },
    { goi: `[await go('PUT', '/api/courses/' + c2._id, { price: 25, level: 'advanced' }), await go('PUT', '/api/courses/' + c2._id, { price: -1 }), await go('PUT', '/api/courses/' + new mongoose.Types.ObjectId(), { price: 1 })]`, moTa: ['PUT 200 / 400 / 404', 'PUT 200 / 400 / 404'] },
    { goi: `[await go('DELETE', '/api/courses/' + c1._id), await go('DELETE', '/api/courses/' + c1._id), await go('DELETE', '/api/courses/zz')]`, moTa: ['DELETE 200 message / 404 / 400', 'DELETE 200 message / 404 / 400'] },
    { goi: `[await go('POST', '/api/courses', {}), await go('POST', '/api/courses', { title: 'X', price: 'free' })]`, an: true },
  ],
});

const P3 = bai({
  ten: 'PE rehearsal 3 — populate a reference and filter/search a collection', kho: 'MEDIUM', phut: 20, lib: ['mongoose', 'express'],
  en: J`<p>Two read routes with the PE's favourite ingredients:</p>
<ol><li><code>GET /api/courses</code> — instructor populated as <code>{ _id, name }</code>, sorted by <code>price</code> ascending, optional filters: <code>?level=</code> (must be one of the enum ⇒ else 400 <code>{ error: "Invalid level" }</code>), <code>?maxPrice=</code> (a number ⇒ else 400 <code>{ error: "Invalid maxPrice" }</code>), <code>?q=</code> (title contains, case-insensitive, escaped);</li>
<li><code>GET /api/instructors/:id/courses</code> — 400 <code>Invalid id</code> · 404 <code>Instructor not found</code> · 200 <code>{ instructor: { _id, name }, count, courses: [{ _id, title, price }] }</code>.</li></ol>`,
  vi: J`<p>Hai route đọc với những "nguyên liệu" PE ưa dùng:</p>
<ol><li><code>GET /api/courses</code> — instructor được populate thành <code>{ _id, name }</code>, sắp theo <code>price</code> tăng dần, bộ lọc tuỳ chọn: <code>?level=</code> (phải thuộc enum ⇒ không thì 400 <code>{ error: "Invalid level" }</code>), <code>?maxPrice=</code> (là số ⇒ không thì 400 <code>{ error: "Invalid maxPrice" }</code>), <code>?q=</code> (tiêu đề chứa, không phân biệt hoa thường, có escape);</li>
<li><code>GET /api/instructors/:id/courses</code> — 400 <code>Invalid id</code> · 404 <code>Instructor not found</code> · 200 <code>{ instructor: { _id, name }, count, courses: [{ _id, title, price }] }</code>.</li></ol>`,
  yc: [['Build the filter from known parameters only — never <code>Course.find(req.query)</code>.', 'Dựng bộ lọc chỉ từ tham số đã biết — không bao giờ <code>Course.find(req.query)</code>.'], ['<code>.select(\'title price\')</code> for the instructor\'s course list.', '<code>.select(\'title price\')</code> cho danh sách khoá học của giảng viên.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['GET /api/courses?level=beginner&maxPrice=10', '200 [{"title":"Git basics","price":0,"instructor":{"_id":"…","name":"Thay Hoa"},…}]', 'Two filters, populated, cheapest first.', 'Hai bộ lọc, đã populate, rẻ nhất trước.'], ['GET /api/instructors/<id>/courses', '200 {"instructor":{"_id":"…","name":"Thay Hoa"},"count":2,"courses":[…]}', 'Two queries, one answer.', 'Hai truy vấn, một câu trả lời.']],
  goiY: [['<code>const LEVELS = Course.schema.path(\'level\').options.enum;</code> keeps the list in one place.', '<code>const LEVELS = Course.schema.path(\'level\').options.enum;</code> giữ danh sách ở một chỗ.'], ['<code>const [instructor, courses] = await Promise.all([Instructor.findById(id).select(\'name\'), Course.find({ instructor: id }).select(\'title price\').sort({ price: 1 })]);</code>', '<code>const [instructor, courses] = await Promise.all([Instructor.findById(id).select(\'name\'), Course.find({ instructor: id }).select(\'title price\').sort({ price: 1 })]);</code>']],
  loi: [['Forgetting that query values are strings: <code>maxPrice=10</code> must become a number before <code>$lte</code>.', 'Quên rằng giá trị query là chuỗi: <code>maxPrice=10</code> phải thành số trước <code>$lte</code>.'], ['<code>populate(\'instructor\')</code> without a field list — the instructor\'s email leaks.', '<code>populate(\'instructor\')</code> không có danh sách field — email giảng viên bị lộ.']],
  gt: ['Populate (CLO5) plus validated filters is the second half of most PE papers. Each query parameter is checked and converted once, the filter object is built explicitly, and the second route shows a "parent + children" answer assembled from two parallel queries.', 'Populate (CLO5) cộng các bộ lọc đã kiểm là nửa sau của đa số đề PE. Mỗi tham số query được kiểm và đổi kiểu một lần, đối tượng lọc được dựng tường minh, và route thứ hai cho một câu trả lời "cha + con" ráp từ hai truy vấn song song.'],
  kn: ['populate', 'filters', 'Promise.all'],
  tns: [tn('parent/children', 'cha/con', 'một tài nguyên và các tài nguyên tham chiếu tới nó')],
  env: ENV, them: { '.env': DOTENV },
  dau: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
${MODELS}

const app = express();
app.get('/api/courses', async (req, res) => res.json(await Course.find(req.query).populate('instructor')));
module.exports = app;
`,
  giai: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
${MODELS}

const LEVELS = Course.schema.path('level').options.enum;           // one source of truth
const escape = (s) => String(s).replace(/[.*+?^@{}()|[\]\\]/g, '\\$&');
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const app = express();

app.get('/api/courses', wrap(async (req, res) => {
  const filter = {};                                               // KNOWN parameters only
  const { level, maxPrice, q } = req.query;
  if (level !== undefined) {
    if (!LEVELS.includes(level)) return res.status(400).json({ error: 'Invalid level' });
    filter.level = level;
  }
  if (maxPrice !== undefined) {
    const n = Number(maxPrice);
    if (maxPrice === '' || Number.isNaN(n)) return res.status(400).json({ error: 'Invalid maxPrice' });
    filter.price = { $lte: n };
  }
  if (q) filter.title = { $regex: escape(q), $options: 'i' };
  res.json(await Course.find(filter).sort({ price: 1 }).populate('instructor', 'name'));
}));

app.get('/api/instructors/:id/courses', wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
  const [instructor, courses] = await Promise.all([
    Instructor.findById(id).select('name'),
    Course.find({ instructor: id }).select('title price').sort({ price: 1 }),
  ]);
  if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
  res.json({ instructor, count: courses.length, courses });
}));

module.exports = app;
`,
  chuanBi: `const I = mongoose.model('Instructor'); const C = mongoose.model('Course'); const hoa = await I.create({ name: 'Thay Hoa', email: 'hoa@fpt.edu.vn' }); const lan = await I.create({ name: 'Co Lan', email: 'lan@fpt.edu.vn' });
await C.create({ title: 'Git basics', price: 0, instructor: hoa._id }); await C.create({ title: 'Express 101', price: 20, level: 'intermediate', instructor: hoa._id }); await C.create({ title: 'MongoDB (C++ free)', price: 8, instructor: lan._id }); await C.create({ title: 'Advanced Node', price: 45, level: 'advanced', instructor: lan._id });
const go = async (url) => { const r = await module.exports.inject({ url }); const b = r.body; return { status: r.status, body: Array.isArray(b) ? b.map((c) => c.title + ' $' + c.price + ' ' + (c.instructor && c.instructor.name)) : b }; };`,
  cases: [
    { goi: `[await go('/api/courses'), await go('/api/courses?level=beginner&maxPrice=10')]`, moTa: ['All courses cheapest first with instructor names; two filters', 'Mọi khoá rẻ nhất trước kèm tên giảng viên; hai bộ lọc'] },
    { goi: `[await go('/api/courses?level=expert'), await go('/api/courses?maxPrice=cheap'), await go('/api/courses?q=EXPRESS')]`, moTa: ['Bad level / bad maxPrice → 400; q search', 'level sai / maxPrice sai → 400; tìm q'] },
    { goi: `await (async () => { const r = await module.exports.inject({ url: '/api/instructors/' + hoa._id + '/courses' }); return { status: r.status, instructor: r.body.instructor.name, count: r.body.count, courses: r.body.courses.map((c) => Object.keys(c).sort().join(',') + ':' + c.title) }; })()`, moTa: ['Instructor + count + course list', 'Giảng viên + số lượng + danh sách khoá'] },
    { goi: `[await go('/api/instructors/abc/courses'), await go('/api/instructors/' + new mongoose.Types.ObjectId() + '/courses')]`, moTa: ['400 / 404 for the instructor route', '400 / 404 cho route giảng viên'] },
    { goi: `[await go('/api/courses?q=c%2B%2B'), JSON.stringify((await module.exports.inject({ url: '/api/courses' })).body).includes('@fpt.edu.vn')]`, an: true },
    { goi: `await go('/api/courses?maxPrice=0&level=beginner')`, an: true },
  ],
});

const P4 = bai({
  ten: 'PE rehearsal 4 — hash, issue a token, protect one route', kho: 'HARD', phut: 25, lib: ['mongoose', 'express', 'auth'],
  en: J`<p>The last part of the rehearsal plan: "Hash a password with bcrypt, issue or verify a token, protect one route".</p>
<ul><li><code>POST /api/auth/register</code> <code>{ name, email, password }</code> → 201 <code>{ id, name, email, role }</code> (password hashed, role always <code>"student"</code>) · 400 missing fields · 409 email taken;</li>
<li><code>POST /api/auth/login</code> → 200 <code>{ token }</code> (JWT <code>{ id, role }</code>, 1 hour, <code>process.env.JWT_SECRET</code>) · 401 <code>Invalid credentials</code> for both failures;</li>
<li><code>POST /api/courses</code> — protected: no/invalid token ⇒ 401 <code>Unauthorized</code>; role not <code>"instructor"</code> ⇒ 403 <code>Forbidden</code>; else 201 the course, with <code>instructor</code> set from the TOKEN (never from the body).</li></ul>
<p>The <code>Account</code> model is given (password <code>select: false</code>).</p>`,
  vi: J`<p>Phần cuối của kế hoạch tập dượt: "Băm mật khẩu bằng bcrypt, cấp hoặc xác minh token, bảo vệ một route".</p>
<ul><li><code>POST /api/auth/register</code> <code>{ name, email, password }</code> → 201 <code>{ id, name, email, role }</code> (mật khẩu đã băm, role luôn là <code>"student"</code>) · 400 thiếu field · 409 email đã có;</li>
<li><code>POST /api/auth/login</code> → 200 <code>{ token }</code> (JWT <code>{ id, role }</code>, 1 giờ, <code>process.env.JWT_SECRET</code>) · 401 <code>Invalid credentials</code> cho cả hai thất bại;</li>
<li><code>POST /api/courses</code> — được bảo vệ: không có/sai token ⇒ 401 <code>Unauthorized</code>; role không phải <code>"instructor"</code> ⇒ 403 <code>Forbidden</code>; còn lại 201 khoá học, với <code>instructor</code> lấy từ TOKEN (không bao giờ từ body).</li></ul>
<p>Model <code>Account</code> cho sẵn (password <code>select: false</code>).</p>`,
  yc: [['Three middleware-sized pieces: <code>requireAuth</code>, <code>requireRole(\'instructor\')</code>, the handler.', 'Ba mảnh cỡ middleware: <code>requireAuth</code>, <code>requireRole(\'instructor\')</code>, handler.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['login as an instructor, then POST /api/courses {"title":"Hono intro","price":5,"instructor":"<someone else>"}', '201 {… "instructor": "<the id from the token>" …}', 'The body cannot choose the instructor.', 'Body không chọn được giảng viên.'], ['the same with a student token', '403 {"error":"Forbidden"}', 'Authenticated, not authorised.', 'Đã xác thực, chưa được phân quyền.']],
  goiY: [['Copy your own requireAuth from lesson 5.2 — that is the point of the rehearsal.', 'Chép requireAuth của chính bạn ở bài 5.2 — đó là mục đích của buổi tập dượt.'], ['<code>Course.create({ ...pick(req.body), instructor: req.user.id })</code> — the token wins.', '<code>Course.create({ ...pick(req.body), instructor: req.user.id })</code> — token thắng.']],
  loi: [['Letting the body set <code>role</code> on register: anyone becomes an instructor.', 'Để body đặt <code>role</code> khi đăng ký: ai cũng thành giảng viên.'], ['Taking <code>instructor</code> from the body on the protected route — one instructor can publish in another\'s name.', 'Lấy <code>instructor</code> từ body ở route được bảo vệ — giảng viên này đăng bài dưới tên người khác được.']],
  gt: ['bcrypt stores only a salted hash; login turns a correct password into a short-lived signed token; the protected route trusts only what it can verify (the token) and ignores what the client claims (body fields). Those three steps are the CLO6 half of a PE.', 'bcrypt chỉ lưu mã băm có salt; đăng nhập biến mật khẩu đúng thành một token đã ký có hạn ngắn; route được bảo vệ chỉ tin thứ nó xác minh được (token) và bỏ qua thứ client tự khai (field trong body). Ba bước đó là nửa CLO6 của một đề PE.'],
  kn: ['bcrypt', 'JWT', 'authorisation'],
  tns: [tn('claim', 'lời khai'), tn('short-lived token', 'token hạn ngắn')],
  env: ENV, them: { '.env': DOTENV },
  dau: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
${MODELS}
const Account = mongoose.model('Account', new Schema({ name: String, email: { type: String, unique: true, lowercase: true }, password: { type: String, select: false }, role: { type: String, default: 'student' } }));

const app = express();
app.use(express.json());
app.post('/api/auth/register', async (req, res) => res.status(201).json(await Account.create(req.body)));
app.post('/api/courses', async (req, res) => res.status(201).json(await Course.create(req.body)));
module.exports = app;
`,
  giai: J`require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
${MODELS}
const Account = mongoose.model('Account', new Schema({ name: String, email: { type: String, unique: true, lowercase: true }, password: { type: String, select: false }, role: { type: String, default: 'student' } }));

const app = express();
app.use(express.json());
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.post('/api/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
  try {
    const a = await Account.create({ name, email, password: await bcrypt.hash(password, 10), role: 'student' });   // role: the SERVER decides
    res.status(201).json({ id: a.id, name: a.name, email: a.email, role: a.role });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const a = await Account.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password');
  if (!a || !(await bcrypt.compare(String(req.body.password || ''), a.password))) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: a.id, role: a.role }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
}));

function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  try {
    if (scheme !== 'Bearer' || !token) throw new Error('no token');
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
}
const requireRole = (role) => (req, res, next) => (req.user.role === role ? next() : res.status(403).json({ error: 'Forbidden' }));

app.post('/api/courses', requireAuth, requireRole('instructor'), wrap(async (req, res) => {
  const { title, level, price } = req.body;
  res.status(201).json(await Course.create({ title, level, price, instructor: req.user.id }));   // the TOKEN decides who
}));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed' });
  res.status(500).json({ error: 'Internal Server Error' });
});
module.exports = app;
`,
  chuanBi: `const app = module.exports; const A = mongoose.model('Account'); const B = require('bcrypt');
const teacher = await A.create({ name: 'Thay Hoa', email: 'hoa@fpt.edu.vn', password: await B.hash('teach-pass', 10), role: 'instructor' });
const go = async (method, url, body, token) => __res(await app.inject({ method, url, body, headers: token ? { Authorization: 'Bearer ' + token } : {} }));
const login = async (email, password) => (await go('POST', '/api/auth/login', { email, password })).body.token;`,
  cases: [
    { goi: `[await go('POST', '/api/auth/register', { name: 'An', email: 'AN@fpt.edu.vn', password: 'student-pass', role: 'instructor' }).then((r) => ({ status: r.status, keys: Object.keys(r.body).sort(), role: r.body.role })), (await go('POST', '/api/auth/register', { name: 'An2', email: 'an@fpt.edu.vn', password: 'x12345678' })).status]`, moTa: ['Register → 201 role student (body role ignored); duplicate → 409', 'Đăng ký → 201 role student (bỏ role trong body); trùng → 409'] },
    { goi: `[typeof await login('hoa@fpt.edu.vn', 'teach-pass'), await go('POST', '/api/auth/login', { email: 'hoa@fpt.edu.vn', password: 'nope' }), await go('POST', '/api/auth/login', { email: 'ghost@x.com', password: 'teach-pass' })]`, moTa: ['Login → token; both failures → the same 401', 'Đăng nhập → token; cả hai thất bại → cùng một 401'] },
    { goi: `await (async () => { const t = await login('hoa@fpt.edu.vn', 'teach-pass'); const r = await go('POST', '/api/courses', { title: 'Hono intro', price: 5, instructor: String(new mongoose.Types.ObjectId()) }, t); return [r.status, r.body.instructor === String(teacher._id)]; })()`, moTa: ['Instructor token → 201, instructor taken from the token', 'Token giảng viên → 201, instructor lấy từ token'] },
    { goi: `await (async () => { await go('POST', '/api/auth/register', { name: 'An', email: 'an@fpt.edu.vn', password: 'student-pass' }); const t = await login('an@fpt.edu.vn', 'student-pass'); return [await go('POST', '/api/courses', { title: 'X', price: 1 }), await go('POST', '/api/courses', { title: 'X', price: 1 }, t), await go('POST', '/api/courses', { title: 'X', price: 1 }, 'not.a.token')]; })()`, moTa: ['No token 401 · student 403 · bad token 401', 'Không token 401 · sinh viên 403 · token sai 401'] },
    { goi: `[await go('POST', '/api/auth/register', { email: 'x@x.com' }), JSON.stringify(await go('POST', '/api/auth/register', { name: 'Z', email: 'z@x.com', password: 'zzzzzzzz' })).includes('$2b$')]`, an: true },
  ],
  timeoutMs: 60000,
});

export default doiDau({
  slug: 'sdn302-final-exam-pe',
  ten: 'Practical Exam — 25%, 85 minutes (rehearsal plan)',
  khoa: KHOA,
  baiHoc: 'sdn302-final-exam-pe',
  de: [P1, P2, P3, P4],
});
