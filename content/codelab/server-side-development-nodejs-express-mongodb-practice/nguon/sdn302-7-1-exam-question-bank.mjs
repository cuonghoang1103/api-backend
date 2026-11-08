/** SDN302 · 7.1 — Định dạng thi, snippet khởi đầu & ngân hàng câu hỏi theo CLO: chiến lược 85 phút, gõ bộ khung từ trí nhớ, PUT có validate + 404, GET kèm populate, các câu lý thuyết. */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn, maNguon } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'The 85-minute plan and the starter skeleton', kho: 'EASY', phut: 6, loai: 'order',
  en: 'The Practical Exam strategy of the lesson and the order of the memorised skeleton.',
  vi: 'Chiến lược Practical Exam của bài và thứ tự của bộ khung cần thuộc.',
  cau: [
    ord('o1', ['Order the three phases of the 85-minute Practical Exam.', 'Sắp ba giai đoạn của Practical Exam 85 phút.'],
      ['0–10 min: type the memorised starter (Mongoose, schema, router, error handler)', '10–60 min: the required endpoints + validation + status codes', '60–85 min: test every route in Postman, fix, add populate/auth if asked'],
      ['A working skeleton early turns the exam into "extend a working app" instead of "start from a blank file under panic".', 'Bộ khung chạy được từ sớm biến bài thi thành "mở rộng một app đang chạy" thay vì "bắt đầu từ tệp trắng trong hoảng loạn".']),
    ord('o2', ['Order the lines of the starter snippet.', 'Sắp các dòng của snippet khởi đầu.'],
      ['<code>const app = express(); app.use(express.json());</code>', '<code>mongoose.connect(process.env.MONGODB_URI);</code>', '<code>const Item = mongoose.model(\'Item\', new mongoose.Schema({ … }));</code>', '<code>app.get(\'/api/items\', …)</code> and <code>app.post(\'/api/items\', …)</code>', '<code>app.use((err, req, res, next) => res.status(500).json({ error: err.message }));</code>', '<code>app.listen(3000);</code>'],
      ['Parser before routes, model before the routes that use it, error handler after the routes, listen last.', 'Bộ đọc trước route, model trước các route dùng nó, error handler sau route, listen sau cùng.']),
  ],
  goiY: [['Skeleton first, features second, testing last.', 'Bộ khung trước, tính năng sau, kiểm thử cuối.'], ['Middleware order rules apply.', 'Luật thứ tự middleware vẫn áp dụng.']],
  loi: [['Testing everything at minute 80.', 'Kiểm mọi thứ ở phút 80.'], ['Error handler before the routes.', 'Error handler trước route.']],
  tns: [tn('skeleton', 'bộ khung')],
  kn: ['exam strategy'],
});

const E2 = bai({
  ten: 'Type the starter snippet from memory (Items API)', kho: 'MEDIUM', phut: 12, lib: ['mongoose', 'express'],
  en: J`<p>No hints in the editor this time — write the lesson's skeleton from memory:</p>
<ul><li><code>express()</code> + <code>express.json()</code>; <code>mongoose.connect(process.env.MONGODB_URI)</code> (never a hard-coded URI);</li>
<li>a model <code>Item</code> with <code>name</code> (String, required);</li>
<li><code>GET /api/items</code> → 200 + all items; <code>POST /api/items</code> → no <code>name</code> ⇒ 400 <code>{ error: "name required" }</code>, else 201 + the item;</li>
<li>both routes forward errors with <code>next(e)</code>; an error handler answers 500 <code>{ error: err.message }</code>;</li>
<li><code>app.listen(process.env.PORT || 3000)</code> and <code>module.exports = app;</code></li></ul>`,
  vi: J`<p>Lần này không có gợi ý trong editor — viết bộ khung của bài từ trí nhớ:</p>
<ul><li><code>express()</code> + <code>express.json()</code>; <code>mongoose.connect(process.env.MONGODB_URI)</code> (không bao giờ viết cứng URI);</li>
<li>model <code>Item</code> có <code>name</code> (String, bắt buộc);</li>
<li><code>GET /api/items</code> → 200 + mọi item; <code>POST /api/items</code> → thiếu <code>name</code> ⇒ 400 <code>{ error: "name required" }</code>, còn lại 201 + item;</li>
<li>cả hai route chuyển lỗi bằng <code>next(e)</code>; một error handler trả 500 <code>{ error: err.message }</code>;</li>
<li><code>app.listen(process.env.PORT || 3000)</code> và <code>module.exports = app;</code></li></ul>`,
  yc: [['Target: under 10 minutes, no searching.', 'Mục tiêu: dưới 10 phút, không tra cứu.'], ['The grader checks the app connected with the URI from the environment and listens on PORT.', 'Máy chấm kiểm app đã kết nối bằng URI từ môi trường và nghe ở PORT.']],
  viDu: [['POST /api/items {"name":"Pen"}', '201 {"_id":"…","name":"Pen","__v":0}', 'The happy path.', 'Đường thuận.'], ['POST /api/items {}', '400 {"error":"name required"}', 'Validated before the database.', 'Kiểm trước CSDL.']],
  goiY: [['Re-read the snippet in lesson 7.1 once, close it, then type.', 'Đọc lại snippet ở bài 7.1 một lần, đóng lại, rồi gõ.'], ['<code>app.post(\'/api/items\', async (req, res, next) => { try { if (!req.body.name) return res.status(400).json({ error: \'name required\' }); res.status(201).json(await Item.create(req.body)); } catch (e) { next(e); } });</code>', '<code>app.post(\'/api/items\', async (req, res, next) => { try { if (!req.body.name) return res.status(400).json({ error: \'name required\' }); res.status(201).json(await Item.create(req.body)); } catch (e) { next(e); } });</code>']],
  loi: [['<code>mongoose.connect(\'mongodb://localhost/test\')</code> — a hard-coded URI scores 0 in real PEs that require the .env.', '<code>mongoose.connect(\'mongodb://localhost/test\')</code> — URI viết cứng bị 0 điểm ở các PE thật yêu cầu .env.'], ['Forgetting <code>express.json()</code>: every POST is a 400 because <code>req.body</code> is undefined… or a crash.', 'Quên <code>express.json()</code>: mọi POST thành 400 vì <code>req.body</code> là undefined… hoặc sập.']],
  gt: ['This skeleton is the minimum that runs: parser, connection from the environment, one model, a read route, a validated create route, a central error handler, a port from the environment. Being able to type it in ten minutes is what the lesson calls "exam-fast".', 'Bộ khung này là tối thiểu để chạy: bộ đọc body, kết nối từ môi trường, một model, một route đọc, một route tạo có kiểm tra, một error handler trung tâm, cổng từ môi trường. Gõ được nó trong mười phút là điều bài gọi là "nhanh kiểu đi thi".'],
  kn: ['express skeleton', 'mongoose.connect'],
  tns: [tn('connection string', 'chuỗi kết nối')],
  env: { MONGODB_URI: 'mongodb+srv://student:pass@cluster0.example.mongodb.net/sdn302', PORT: '9999' },
  dau: J`// write the skeleton from memory
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());                                   // parse JSON bodies BEFORE the routes
mongoose.connect(process.env.MONGODB_URI);                 // the URI comes from .env, never from the code

const Item = mongoose.model('Item', new mongoose.Schema({ name: { type: String, required: true } }));

app.get('/api/items', async (req, res, next) => {
  try { res.json(await Item.find()); } catch (e) { next(e); }
});

app.post('/api/items', async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'name required' });
    res.status(201).json(await Item.create(req.body));
  } catch (e) { next(e); }
});

// error handler: 4 parameters, after every route
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

app.listen(process.env.PORT || 3000);
module.exports = app;
`,
  chuanBi: `const app = module.exports; const go = async (method, url, body) => { const r = await app.inject({ method, url, body }); return { status: r.status, body: Array.isArray(r.body) ? r.body.map((x) => x.name) : r.body && r.body.name ? r.body.name : r.body }; };`,
  cases: [
    { goi: `[await go('POST', '/api/items', { name: 'Pen' }), await go('GET', '/api/items')]`, moTa: ['POST → 201, then GET lists it', 'POST → 201, rồi GET liệt kê nó'] },
    { goi: `await go('POST', '/api/items', {})`, moTa: ['Missing name → 400', 'Thiếu name → 400'] },
    { goi: `(await __sleep(50), [__mongo.connectedTo, (__listening || []).map(String)])`, moTa: ['Connected with process.env.MONGODB_URI, listening on PORT', 'Kết nối bằng process.env.MONGODB_URI, nghe ở PORT'] },
    { goi: `[typeof mongoose.model('Item'), mongoose.model('Item').schema.path('name').options.required]`, an: true },
    { goi: `[await go('GET', '/api/items'), await go('POST', '/api/items', { name: 'A' }), await go('POST', '/api/items', { name: 'B' }), await go('GET', '/api/items')]`, an: true },
  ],
  kiemThem: [maNguon(['No connection string hard-coded in the code', 'Không viết cứng chuỗi kết nối trong mã'], 'mongodb(\\+srv)?://', { phuDinh: true })],
});

const E3 = bai({
  ten: 'Question bank: a PUT that validates input and returns 404 when the id is missing', kho: 'MEDIUM', phut: 15, lib: ['mongoose', 'express'],
  en: J`<p>The CLO3–5 question from the bank, as code. <code>PUT /api/posts/:id</code> with body <code>{ title, body }</code>:</p>
<ul><li>malformed id ⇒ 400 <code>{ error: "Invalid id" }</code>;</li>
<li><code>title</code> must be a string of 3–100 characters (after trim) ⇒ else 400 <code>{ error: "title must be 3-100 characters" }</code>; <code>body</code> is optional (a string if present, else 400 <code>{ error: "body must be a string" }</code>);</li>
<li>no post with that id ⇒ 404 <code>{ error: "Post not found" }</code>;</li>
<li>success ⇒ 200 + the UPDATED post (PUT replaces: a missing <code>body</code> becomes <code>""</code>).</li></ul>`,
  vi: J`<p>Câu CLO3–5 trong ngân hàng, viết thành mã. <code>PUT /api/posts/:id</code> với body <code>{ title, body }</code>:</p>
<ul><li>id dị dạng ⇒ 400 <code>{ error: "Invalid id" }</code>;</li>
<li><code>title</code> phải là chuỗi 3–100 ký tự (sau trim) ⇒ không thì 400 <code>{ error: "title must be 3-100 characters" }</code>; <code>body</code> tuỳ chọn (nếu có phải là chuỗi, không thì 400 <code>{ error: "body must be a string" }</code>);</li>
<li>không có bài với id đó ⇒ 404 <code>{ error: "Post not found" }</code>;</li>
<li>thành công ⇒ 200 + bài ĐÃ CẬP NHẬT (PUT là thay thế: thiếu <code>body</code> thì thành <code>""</code>).</li></ul>`,
  yc: [['Order of checks: id, title, body, existence.', 'Thứ tự kiểm: id, title, body, tồn tại.'], ['<code>findByIdAndUpdate(id, { title, body }, { new: true, runValidators: true })</code>.', '<code>findByIdAndUpdate(id, { title, body }, { new: true, runValidators: true })</code>.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['PUT /api/posts/<id> {"title":"  New title "}', '200 {"title":"New title","body":"", …}', 'PUT replaces the whole resource.', 'PUT thay toàn bộ tài nguyên.'], ['PUT /api/posts/<missing id> {"title":"Valid"}', '404 {"error":"Post not found"}', 'Validated first, then looked up.', 'Kiểm trước, tra sau.']],
  goiY: [['<code>const title = typeof req.body.title === \'string\' ? req.body.title.trim() : \'\';</code>', '<code>const title = typeof req.body.title === \'string\' ? req.body.title.trim() : \'\';</code>'], ['PUT vs PATCH: PUT sends the full new version, so fields you omit are reset.', 'PUT vs PATCH: PUT gửi phiên bản mới đầy đủ, nên field bạn bỏ qua bị đặt lại.']],
  loi: [['Missing <code>{ new: true }</code>: the answer shows the old title.', 'Thiếu <code>{ new: true }</code>: câu trả lời hiện tiêu đề cũ.'], ['Checking existence before validating: an invalid body still costs a database round trip and the error order differs from the contract.', 'Kiểm tồn tại trước khi kiểm hợp lệ: body sai vẫn tốn một lượt CSDL và thứ tự lỗi khác hợp đồng.']],
  gt: ['The bank question has three explicit parts — validate input, 404 when missing, return the update — and each maps to one line of defence. Validating before touching the database keeps the responses predictable, and PUT semantics (full replacement) explain why a missing body becomes an empty string.', 'Câu hỏi trong ngân hàng có ba phần rõ ràng — kiểm đầu vào, 404 khi thiếu, trả bản cập nhật — mỗi phần ứng với một tuyến phòng thủ. Kiểm trước khi đụng CSDL giữ câu trả lời dễ đoán, và ngữ nghĩa PUT (thay toàn bộ) giải thích vì sao thiếu body thì thành chuỗi rỗng.'],
  kn: ['PUT', 'validation', '404'],
  tns: [tn('full replacement', 'thay thế toàn bộ')],
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post', new mongoose.Schema({ title: { type: String, required: true }, body: { type: String, default: '' } }, { timestamps: true }));

const app = express();
app.use(express.json());
app.put('/api/posts/:id', async (req, res) => {
  res.json(await Post.findByIdAndUpdate(req.params.id, req.body));
});
module.exports = app;
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post', new mongoose.Schema({ title: { type: String, required: true }, body: { type: String, default: '' } }, { timestamps: true }));

const app = express();
app.use(express.json());

app.put('/api/posts/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (title.length < 3 || title.length > 100) return res.status(400).json({ error: 'title must be 3-100 characters' });
    const body = req.body.body === undefined ? '' : req.body.body;            // PUT replaces: missing ⇒ reset
    if (typeof body !== 'string') return res.status(400).json({ error: 'body must be a string' });

    const post = await Post.findByIdAndUpdate(req.params.id, { title, body }, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (e) { next(e); }
});

module.exports = app;
`,
  chuanBi: `const p = await Post.create({ title: 'Old title', body: 'Old body' }); const put = async (id, b) => { const r = await module.exports.inject({ method: 'PUT', url: '/api/posts/' + id, body: b }); return { status: r.status, body: r.body && r.body._id ? __pick(r.body, 'title body') : r.body }; };`,
  cases: [
    { goi: `await put(p._id, { title: '  New title ' })`, moTa: ['200 with the new title, body reset to ""', '200 với tiêu đề mới, body về ""'] },
    { goi: `await put(new mongoose.Types.ObjectId(), { title: 'Valid title' })`, moTa: ['Missing id → 404', 'Id không có → 404'] },
    { goi: `[await put('abc', { title: 'Valid title' }), await put(p._id, { title: 'ab' })]`, moTa: ['Bad id / short title → 400', 'Id sai / tiêu đề ngắn → 400'] },
    { goi: `[await put(p._id, { title: 'Good title', body: 42 }), await put(p._id, { title: 'x'.repeat(101) }), await put(p._id, { title: 'Good title', body: 'kept' })]`, an: true },
    { goi: `[await put(new mongoose.Types.ObjectId(), { title: 'no' }), await put(p._id, {})]`, an: true },
  ],
});

const E4 = bai({
  ten: 'Question bank: GET all posts with their author populated (+ optional filter)', kho: 'MEDIUM', phut: 15, lib: ['mongoose', 'express'],
  en: J`<p><code>GET /api/posts</code> returns every post, newest first, with <code>author</code> populated as <code>{ _id, name }</code>. Two optional query parameters:</p>
<ul><li><code>?author=&lt;userId&gt;</code> — only that author's posts; a malformed id ⇒ 400 <code>{ error: "Invalid author id" }</code>;</li>
<li><code>?q=text</code> — title contains <code>text</code>, case-insensitive (escape regex characters).</li></ul>
<p>Also add the logger of the bank question: one <code>console.log(´@{req.method} @{req.url}´)</code> per request, before the routes.</p>`,
  vi: J`<p><code>GET /api/posts</code> trả mọi bài viết, mới nhất trước, với <code>author</code> được populate thành <code>{ _id, name }</code>. Hai tham số query tuỳ chọn:</p>
<ul><li><code>?author=&lt;userId&gt;</code> — chỉ bài của tác giả đó; id dị dạng ⇒ 400 <code>{ error: "Invalid author id" }</code>;</li>
<li><code>?q=text</code> — tiêu đề chứa <code>text</code>, không phân biệt hoa thường (escape ký tự regex).</li></ul>
<p>Thêm cả logger của câu hỏi trong ngân hàng: mỗi request một <code>console.log(´@{req.method} @{req.url}´)</code>, trước các route.</p>`,
  yc: [['Build the filter object step by step, then one query.', 'Dựng đối tượng lọc từng bước, rồi một truy vấn.'], ['<code>.populate(\'author\', \'name\')</code> — never the email.', '<code>.populate(\'author\', \'name\')</code> — không bao giờ email.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['GET /api/posts?q=MONGO', '200 [{"title":"Mongoose populate","author":{"_id":"…","name":"An"}, …}]', 'Case-insensitive search on the title.', 'Tìm tiêu đề không phân biệt hoa thường.'], ['GET /api/posts?author=abc', '400 {"error":"Invalid author id"}', 'Checked before querying.', 'Kiểm trước khi truy vấn.']],
  goiY: [['<code>const filter = {}; if (req.query.author) { if (!mongoose.isValidObjectId(req.query.author)) return …; filter.author = req.query.author; }</code>', '<code>const filter = {}; if (req.query.author) { if (!mongoose.isValidObjectId(req.query.author)) return …; filter.author = req.query.author; }</code>'], ['<code>Post.find(filter).sort({ createdAt: -1 }).populate(\'author\', \'name\')</code>', '<code>Post.find(filter).sort({ createdAt: -1 }).populate(\'author\', \'name\')</code>']],
  loi: [['<code>populate(\'author\')</code> without a select — the email (and anything else on User) leaks.', '<code>populate(\'author\')</code> không select — email (và mọi thứ khác trên User) bị lộ.'], ['Passing <code>req.query</code> straight to <code>find</code>: <code>?title[$ne]=x</code> becomes a query operator (NoSQL injection).', 'Đưa thẳng <code>req.query</code> vào <code>find</code>: <code>?title[$ne]=x</code> thành toán tử truy vấn (NoSQL injection).']],
  gt: ['Building the filter from known parameters keeps the client from injecting operators and lets each parameter be validated on its own. Populate with a field list answers the bank question exactly ("with their author populated") without over-fetching.', 'Dựng bộ lọc từ các tham số đã biết ngăn client chèn toán tử và cho phép kiểm từng tham số riêng. Populate kèm danh sách field trả lời đúng câu hỏi ("with their author populated") mà không lấy thừa.'],
  kn: ['populate', 'query filters'],
  tns: [tn('NoSQL injection', 'chèn toán tử truy vấn')],
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));
const Post = mongoose.model('Post', new mongoose.Schema({ title: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, { timestamps: true }));

const app = express();
app.get('/api/posts', async (req, res) => {
  res.json(await Post.find(req.query).populate('author'));
});
module.exports = app;
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));
const Post = mongoose.model('Post', new mongoose.Schema({ title: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, { timestamps: true }));

const app = express();

// the bank's logger: method + URL, then next()
app.use((req, res, next) => { console.log(´@{req.method} @{req.url}´); next(); });

const escape = (s) => String(s).replace(/[.*+?^@{}()|[\]\\]/g, '\\$&');

app.get('/api/posts', async (req, res, next) => {
  try {
    const filter = {};                                       // built from KNOWN parameters only
    if (req.query.author !== undefined) {
      if (!mongoose.isValidObjectId(req.query.author)) return res.status(400).json({ error: 'Invalid author id' });
      filter.author = req.query.author;
    }
    if (req.query.q) filter.title = { $regex: escape(req.query.q), $options: 'i' };
    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate('author', 'name');
    res.json(posts);
  } catch (e) { next(e); }
});

module.exports = app;
`,
  chuanBi: `const an = await User.create({ name: 'An', email: 'an@x.com' }); const binh = await User.create({ name: 'Binh', email: 'binh@x.com' });
await Post.create({ title: 'Express routing', author: an._id }); await __sleep(5); await Post.create({ title: 'Mongoose populate', author: binh._id }); await __sleep(5); await Post.create({ title: 'Mongo indexes (C++ fans)', author: an._id });
const go = async (url) => { const r = await module.exports.inject({ url }); return { status: r.status, body: Array.isArray(r.body) ? r.body.map((p) => p.title + ' / ' + (p.author && p.author.name)) : r.body }; };`,
  cases: [
    { goi: `await go('/api/posts')`, moTa: ['All posts, newest first, author names', 'Mọi bài, mới nhất trước, có tên tác giả'] },
    { goi: `[await go('/api/posts?author=' + an._id), await go('/api/posts?author=abc')]`, moTa: ['author filter; malformed id → 400', 'Lọc theo author; id dị dạng → 400'] },
    { goi: `await go('/api/posts?q=MONGO')`, moTa: ['q is case-insensitive', 'q không phân biệt hoa thường'] },
    { goi: `(await module.exports.inject({ url: '/api/posts?q=x' }), __log)`, moTa: ['The logger prints method + URL', 'Logger in method + URL'] },
    { goi: `[await go('/api/posts?q=c%2B%2B'), JSON.stringify((await module.exports.inject({ url: '/api/posts' })).body).includes('@x.com')]`, an: true },
    { goi: `await go('/api/posts?author=' + binh._id + '&q=express')`, an: true },
  ],
});

const E5 = cs({
  ten: 'Question bank: the theory questions (CLO1–8)', kho: 'EASY', phut: 10,
  en: 'Short answers to the bank questions that do not need code. The Final Exam rewards "the course\'s own choice + one clause of reason".',
  vi: 'Trả lời ngắn các câu trong ngân hàng không cần mã. Final Exam thưởng điểm cho "lựa chọn của môn + một mệnh đề lý do".',
  cau: [
    q('b1', ['What does <code>express.json()</code> do, and what breaks without it?', '<code>express.json()</code> làm gì, và thiếu nó thì hỏng gì?'],
      ['It parses JSON request bodies into <code>req.body</code>; without it <code>req.body</code> is undefined on POST/PUT', 'It serialises responses to JSON; without it <code>res.json</code> fails', 'It validates JSON against a schema; without it invalid data is saved', 'It enables CORS for JSON requests'],
      ['Lesson 2.1: add the JSON parser before the routes.', 'Bài 2.1: thêm bộ đọc JSON trước các route.']),
    q('b2', ['Which status codes for: created, bad input, not found, unauthorized?', 'Mã nào cho: đã tạo, đầu vào sai, không tìm thấy, chưa xác thực?'],
      ['201, 400, 404, 401', '200, 500, 404, 403', '201, 422, 410, 403', '202, 400, 204, 401'],
      ['The REST vocabulary of lesson 4.1.', 'Từ vựng REST của bài 4.1.']),
    q('b3', ['Why must the JWT secret be in an environment variable?', 'Vì sao JWT secret phải nằm trong biến môi trường?'],
      ['Anyone reading the code or the Git history could forge any user\'s token', 'Environment variables make jwt.sign and jwt.verify run faster', 'jsonwebtoken refuses to sign with a secret written in the code', 'It lets the browser verify tokens without asking the server'],
      ['A committed secret is "a full account-forgery key for anyone who reads the repo".', 'Secret bị commit là "chìa khoá giả mạo mọi tài khoản cho bất kỳ ai đọc repo".']),
    q('b4', ['Explain in one clause why Node scales on one thread.', 'Giải thích trong một mệnh đề vì sao Node mở rộng được với một luồng.'],
      ['Non-blocking I/O: it registers a callback and serves others while waiting', 'It quietly creates one operating-system thread for every request', 'It compiles each JavaScript file to C++ before the server starts', 'It caches every response, so most requests never reach your code'],
      ['Lesson 1.1.', 'Bài 1.1.']),
    q('b5', ['What is BaaS and when would you use it over building a server?', 'BaaS là gì và khi nào dùng nó thay vì tự dựng server?'],
      ['Ready-made auth, database and storage; for small apps that need speed', 'A database that runs inside the browser; for apps that work offline', 'A way to deploy Express without Node; for big teams with many APIs', 'A testing service for REST APIs; to run before every release'],
      ['Lesson 6.1, CLO7.', 'Bài 6.1, CLO7.']),
  ],
  goiY: [['Answer with the course\'s choice + one reason.', 'Trả lời bằng lựa chọn của môn + một lý do.'], ['Each question points to one lesson.', 'Mỗi câu chỉ tới một bài.']],
  loi: [['Confusing 401 with 403.', 'Lẫn 401 với 403.'], ['Thinking express.json formats responses.', 'Tưởng express.json định dạng response.']],
  tns: [tn('question bank', 'ngân hàng câu hỏi')],
  kn: ['theory'],
});

export default doiDau({
  slug: 'sdn302-7-1-exam-question-bank',
  ten: '7.1 Exam formats, starter snippet & CLO question bank',
  khoa: KHOA,
  baiHoc: 'sdn302-7-1-exam-question-bank',
  de: [E1, E5, E2, E3, E4],
});
