/** SDN302 · Lab Chương 4 — Bookstore REST API theo MVC + trang admin EJS: model có tham chiếu, service, controller, router, populate, ánh xạ lỗi một chỗ, res.render với view model. Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;

const L1 = cs({
  ten: 'Lab 4 · warm-up — which layer owns which line?', kho: 'EASY', phut: 6, dangBai: 'lab', loai: 'table',
  en: 'Before wiring the bookstore: place each line in its MVC layer.',
  vi: 'Trước khi ráp bookstore: đặt mỗi dòng vào đúng tầng MVC.',
  bang: [{
    ma: 'l1', de: '<p>Line → layer</p><p style="opacity:.75;font-size:.92em"><i>Dòng → tầng</i></p>',
    cot: [{ ma: 'dong', ten: 'Line' }, { ma: 'tang', ten: 'Layer', luaChon: ['route', 'controller', 'service', 'model', 'view'] }],
    hang: [
      { ma: 'r1', o: { dong: "router.post('/', controller.create)" } },
      { ma: 'r2', o: { dong: 'res.status(201).json(book)' } },
      { ma: 'r3', o: { dong: "if (!(await Author.exists({ _id: authorId }))) throw notFound('Author not found')" } },
      { ma: 'r4', o: { dong: "price: { type: Number, required: true, min: 0 }" } },
      { ma: 'r5', o: { dong: '<td><%= b.title %></td>' } },
      { ma: 'r6', o: { dong: "Book.find(filter).populate('author', 'name')" } },
    ],
    dapAn: { 'r1.tang': 'route', 'r2.tang': 'controller', 'r3.tang': 'service', 'r4.tang': 'model', 'r5.tang': 'view', 'r6.tang': 'service' },
    giaiThich: '<p>Routes map URL+method, controllers speak HTTP, services hold rules and orchestrate queries, models define the shape, views render HTML. The query in row 6 is built by the service (which calls the model) — a controller never queries.</p><p><i>VI: Route ánh xạ URL+phương thức, controller nói HTTP, service giữ luật và điều phối truy vấn, model định nghĩa hình dạng, view render HTML. Truy vấn ở hàng 6 do service dựng (service gọi model) — controller không bao giờ truy vấn.</i></p>',
  }],
  goiY: [['req/res ⇒ controller.', 'req/res ⇒ controller.'], ['A rule about other data ⇒ service.', 'Luật liên quan dữ liệu khác ⇒ service.']],
  loi: [['Putting queries in controllers.', 'Để truy vấn trong controller.'], ['Putting status codes in services.', 'Để mã trạng thái trong service.']],
  tns: [tn('layer', 'tầng')],
  kn: ['MVC'],
});

const L2 = bai({
  ten: 'Lab 4 — Bookstore API in MVC + an EJS admin page', kho: 'HARD', phut: 90, dangBai: 'lab', lib: ['mongoose', 'express', 'views'],
  en: J`<p>Build the bookstore of Chapter 4: models, a service, a controller, a router, one error handler, and a server-rendered admin page. The full brief is in the statement.</p>`,
  vi: J`<p>Dựng bookstore của Chương 4: model, service, controller, router, một error handler, và một trang admin render ở server. Đề đầy đủ nằm trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['<code>module.exports = { app, Author, Book };</code>', '<code>module.exports = { app, Author, Book };</code>']],
  viDu: [['GET /api/books?inStock=true', '200 [{"title":"Clean Code","price":25,"stock":3,"author":{"_id":"…","name":"Robert Martin"}, …}]', 'Populated, filtered, sorted by title.', 'Đã populate, đã lọc, sắp theo tiêu đề.'], ['GET /admin/books', '200 text/html <h1>Books (3)</h1><table>…<tr class="out">…</tr></table>', 'Server-rendered for the admin.', 'Render ở server cho admin.']],
  goiY: [['Copy the error handler of lesson 4.1 and add the AppError branch (<code>err.status</code>).', 'Chép error handler của bài 4.1 và thêm nhánh AppError (<code>err.status</code>).'], ['The admin page and the API call the SAME service function.', 'Trang admin và API gọi CÙNG một hàm service.']],
  loi: [['Checking the author in the controller — the rule belongs to the service so the admin page and scripts obey it too.', 'Kiểm tác giả trong controller — luật thuộc về service để trang admin và script cũng tuân theo.'], ['<code>&lt;%- b.title %&gt;</code> in the view: a book titled with HTML is injected.', '<code>&lt;%- b.title %&gt;</code> trong view: sách có tiêu đề chứa HTML bị chèn vào trang.'], ['A CastError on <code>price: "abc"</code> answered as "Invalid id".', 'CastError của <code>price: "abc"</code> bị trả thành "Invalid id".']],
  gt: ['Each layer does one job, so the same service feeds both the JSON API and the EJS page, and one error handler translates Mongoose\'s errors and your AppErrors into a consistent envelope. That is CLO5 + CLO8 in one deliverable — and the structure the Practical Exam rewards.', 'Mỗi tầng làm một việc, nên cùng một service nuôi cả API JSON lẫn trang EJS, và một error handler dịch lỗi của Mongoose cùng AppError của bạn thành một vỏ thống nhất. Đó là CLO5 + CLO8 trong một sản phẩm — và là cấu trúc Practical Exam thưởng điểm.'],
  kn: ['MVC', 'populate', 'EJS'],
  tns: [tn('view model', 'mô hình hiển thị')],
  banIn: {
    tieuDe: { en: 'Lab 4 — Bookstore API (MVC) + admin page', vi: 'Lab 4 — Bookstore API (MVC) + trang admin' },
    phu: { en: 'Express · Mongoose · EJS · 90 minutes · 10 marks', vi: 'Express · Mongoose · EJS · 90 phút · 10 điểm' },
    moTa: { en: '<p>A bookstore keeps authors and books. Write everything in <code>answer.js</code>, organised in sections: models → service → controller → router → app. Export <code>{ app, Author, Book }</code>. JSON errors always have the shape <code>{ "error": "…" }</code> (+ <code>details</code> for validation).</p>', vi: '<p>Một nhà sách lưu tác giả và sách. Viết mọi thứ trong <code>answer.js</code>, chia thành các phần: model → service → controller → router → app. Export <code>{ app, Author, Book }</code>. Lỗi JSON luôn có dạng <code>{ "error": "…" }</code> (+ <code>details</code> cho lỗi kiểm tra).</p>' },
    yeuCauChung: [{ en: 'The controller never touches a model; the service never touches req/res.', vi: 'Controller không bao giờ đụng model; service không bao giờ đụng req/res.' }, { en: 'In this practice views are strings: <code>app.set(\'views\', { books: \'…ejs…\' })</code>, <code>app.set(\'view engine\', \'ejs\')</code>.', vi: 'Trong bài luyện này view là chuỗi: <code>app.set(\'views\', { books: \'…ejs…\' })</code>, <code>app.set(\'view engine\', \'ejs\')</code>.' }],
    cayThuMuc: 'answer.js\n  // ── models ──\n  // ── service ──\n  // ── controller ──\n  // ── router + app ──\n  // ── views (EJS strings) ──\nlib/   ← provided',
    moHinh: [
      { ten: 'Author', truong: [['name', 'String', { en: 'required, trimmed, unique', vi: 'bắt buộc, trim, duy nhất' }]] },
      { ten: 'Book', truong: [['title', 'String', { en: 'required, trimmed', vi: 'bắt buộc, trim' }], ['price', 'Number', { en: 'required, min 0', vi: 'bắt buộc, min 0' }], ['stock', 'Number', { en: 'min 0, default 0', vi: 'min 0, mặc định 0' }], ['author', 'ObjectId → Author', { en: 'required', vi: 'bắt buộc' }]] },
    ],
    chucNang: [
      { ten: { en: 'Models', vi: 'Model' }, diem: 1.5, yeuCau: [{ en: 'Author and Book with the rules above; <code>{ timestamps: true }</code> on Book.', vi: 'Author và Book với các luật trên; <code>{ timestamps: true }</code> cho Book.' }] },
      { ten: { en: 'Read the books', vi: 'Đọc sách' }, diem: 2.5, yeuCau: [
        { en: '<code>GET /api/books</code> → 200, sorted by title, author populated as <code>{ _id, name }</code>; <code>?inStock=true</code> keeps <code>stock &gt; 0</code>; <code>?author=&lt;id&gt;</code> filters (malformed ⇒ 400 <code>Invalid id</code>).', vi: '<code>GET /api/books</code> → 200, sắp theo tiêu đề, author populate thành <code>{ _id, name }</code>; <code>?inStock=true</code> giữ <code>stock &gt; 0</code>; <code>?author=&lt;id&gt;</code> lọc (dị dạng ⇒ 400 <code>Invalid id</code>).' },
        { en: '<code>GET /api/books/:id</code> → 200 · 400 <code>Invalid id</code> · 404 <code>Book not found</code>.', vi: '<code>GET /api/books/:id</code> → 200 · 400 <code>Invalid id</code> · 404 <code>Book not found</code>.' }] },
      { ten: { en: 'Write the books', vi: 'Ghi sách' }, diem: 2.5, yeuCau: [
        { en: '<code>POST /api/books</code> → 201; the author must exist ⇒ else 404 <code>Author not found</code> (checked in the SERVICE); validation ⇒ 400 <code>{ error: "Validation failed", details: { path: message } }</code>.', vi: '<code>POST /api/books</code> → 201; tác giả phải tồn tại ⇒ không thì 404 <code>Author not found</code> (kiểm ở SERVICE); kiểm tra ⇒ 400 <code>{ error: "Validation failed", details: { path: message } }</code>.' },
        { en: '<code>PATCH /api/books/:id</code> (title, price, stock) → 200 with validators on · 404; <code>DELETE /api/books/:id</code> → 204 · 404. Only title, price, stock, author are accepted from bodies.', vi: '<code>PATCH /api/books/:id</code> (title, price, stock) → 200 có bật validator · 404; <code>DELETE /api/books/:id</code> → 204 · 404. Chỉ nhận title, price, stock, author từ body.' }] },
      { ten: { en: 'One error handler + JSON 404', vi: 'Một error handler + 404 JSON' }, diem: 1.5, yeuCau: [{ en: 'ValidationError → 400 + details (checked first) · CastError → 400 <code>Invalid id</code> · errors with <code>status</code> → that status · else 500 <code>Internal Server Error</code>; unknown routes → 404 <code>Not found</code>.', vi: 'ValidationError → 400 + details (kiểm trước) · CastError → 400 <code>Invalid id</code> · lỗi có <code>status</code> → mã đó · còn lại 500 <code>Internal Server Error</code>; route lạ → 404 <code>Not found</code>.' }] },
      { ten: { en: 'Admin page (EJS)', vi: 'Trang admin (EJS)' }, diem: 2, yeuCau: [
        { en: '<code>GET /admin/books</code> renders view <code>books</code> with <code>{ count, books: [{ title, author, priceText, out }] }</code> (same service as the API; <code>priceText = "$25.00"</code>; <code>out = stock === 0</code>).', vi: '<code>GET /admin/books</code> render view <code>books</code> với <code>{ count, books: [{ title, author, priceText, out }] }</code> (cùng service với API; <code>priceText = "$25.00"</code>; <code>out = stock === 0</code>).' },
        { en: 'HTML: <code>&lt;h1&gt;Books (N)&lt;/h1&gt;</code> then a <code>&lt;table&gt;</code> with one <code>&lt;tr&gt;</code> per book — <code>&lt;tr class="out"&gt;</code> when out of stock — and cells <code>title</code>, <code>author</code>, <code>priceText</code>, all escaped.', vi: 'HTML: <code>&lt;h1&gt;Books (N)&lt;/h1&gt;</code> rồi một <code>&lt;table&gt;</code> mỗi sách một <code>&lt;tr&gt;</code> — <code>&lt;tr class="out"&gt;</code> khi hết hàng — và các ô <code>title</code>, <code>author</code>, <code>priceText</code>, đều được thoát.' }] },
    ],
    truDiem: [{ en: 'A controller that calls a model directly: −1.', vi: 'Controller gọi thẳng model: −1.' }],
    nopBai: { en: 'Submit <code>answer.js</code>.', vi: 'Nộp <code>answer.js</code>.' },
  },
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const Author = mongoose.model('Author', new mongoose.Schema({ name: String }));
const Book = mongoose.model('Book', new mongoose.Schema({ title: String, price: Number, stock: Number, author: mongoose.Schema.Types.ObjectId }));

const app = express();
app.use(express.json());
app.get('/api/books', async (req, res) => res.json(await Book.find()));
app.post('/api/books', async (req, res) => res.json(await Book.create(req.body)));

module.exports = { app, Author, Book };
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── models ──
const Author = mongoose.model('Author', new Schema({ name: { type: String, required: true, trim: true, unique: true } }));
const Book = mongoose.model('Book', new Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, min: 0, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
}, { timestamps: true }));

// ── service: rules + queries, no HTTP ──
const fail = (status, message) => Object.assign(new Error(message), { status });
const bookService = {
  list({ inStock, author } = {}) {
    const filter = {};
    if (inStock) filter.stock = { $gt: 0 };
    if (author !== undefined) filter.author = author;            // a malformed id ⇒ CastError ⇒ 400
    return Book.find(filter).sort({ title: 1 }).populate('author', 'name');
  },
  get: (id) => Book.findById(id).populate('author', 'name'),
  async create(data) {
    if (data.author !== undefined && mongoose.isValidObjectId(data.author) && !(await Author.exists({ _id: data.author }))) {
      throw fail(404, 'Author not found');                      // a business rule about OTHER data
    }
    return Book.create(data);
  },
  update: (id, changes) => Book.findByIdAndUpdate(id, changes, { new: true, runValidators: true }),
  remove: (id) => Book.findByIdAndDelete(id),
};

// ── controller: HTTP only ──
const pick = (b, keys) => Object.fromEntries(keys.filter((k) => b[k] !== undefined).map((k) => [k, b[k]]));
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const notFound = (res) => res.status(404).json({ error: 'Book not found' });
const bookController = {
  list: wrap(async (req, res) => res.json(await bookService.list({ inStock: req.query.inStock === 'true', author: req.query.author }))),
  get: wrap(async (req, res) => { const b = await bookService.get(req.params.id); if (!b) return notFound(res); res.json(b); }),
  create: wrap(async (req, res) => res.status(201).json(await bookService.create(pick(req.body, ['title', 'price', 'stock', 'author'])))),
  update: wrap(async (req, res) => { const b = await bookService.update(req.params.id, pick(req.body, ['title', 'price', 'stock'])); if (!b) return notFound(res); res.json(b); }),
  remove: wrap(async (req, res) => { const b = await bookService.remove(req.params.id); if (!b) return notFound(res); res.status(204).end(); }),
  adminPage: wrap(async (req, res) => {
    const books = (await bookService.list()).map((b) => ({
      title: b.title, author: b.author ? b.author.name : '—', priceText: '$' + b.price.toFixed(2), out: b.stock === 0,
    }));
    res.render('books', { count: books.length, books });     // a display-ready view model
  }),
};

// ── router + app ──
const router = express.Router();
router.get('/', bookController.list);
router.post('/', bookController.create);
router.get('/:id', bookController.get);
router.patch('/:id', bookController.update);
router.delete('/:id', bookController.remove);

const app = express();
app.set('view engine', 'ejs');
app.set('views', {
  books: ´<h1>Books (<%= count %>)</h1>
<table>
  <% books.forEach((b) => { %>
    <tr<%- b.out ? ' class="out"' : '' %>><td><%= b.title %></td><td><%= b.author %></td><td><%= b.priceText %></td></tr>
  <% }) %>
</table>´,
});
app.use(express.json());
app.use('/api/books', router);
app.get('/admin/books', bookController.adminPage);
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: Object.fromEntries(Object.entries(err.errors).map(([p, e]) => [p, e.message])) });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  if (err.status) return res.status(err.status).json({ error: err.message });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = { app, Author, Book };
`,
  chuanBi: `const { app, Author, Book } = module.exports; const martin = await Author.create({ name: 'Robert Martin' }); const fowler = await Author.create({ name: 'Martin Fowler' });
const cc = await Book.create({ title: 'Clean Code', price: 25, stock: 3, author: martin._id }); await Book.create({ title: 'Refactoring', price: 40, stock: 0, author: fowler._id }); await Book.create({ title: 'Clean Architecture', price: 30.5, stock: 1, author: martin._id });
const go = async (method, url, body) => { const r = await app.inject({ method, url, body }); const b = r.body; return { status: r.status, body: Array.isArray(b) ? b.map((x) => x.title + ' / ' + (x.author && x.author.name)) : b && b._id ? __pick(b, 'title price stock') : b }; };
const norm = (h) => String(h).replace(/\\s+/g, ' ').replace(/\\s*(<[^>]+>)\\s*/g, '$1').trim();`,
  cases: [
    { goi: `[Book.schema.path('author').options.ref, Book.schema.path('price').options.min, await Book.create({ title: 'X', price: -1, author: martin._id }).then(() => 'saved', (e) => Object.keys(e.errors).join(','))]`, nhom: 'f1', moTa: ['Models: ref Author, min 0 enforced', 'Model: ref Author, ép min 0'] },
    { goi: `[await go('GET', '/api/books'), await go('GET', '/api/books?inStock=true')]`, nhom: 'f2', moTa: ['List sorted by title, populated; inStock filter', 'Danh sách sắp theo tiêu đề, đã populate; lọc inStock'] },
    { goi: `[await go('GET', '/api/books?author=' + fowler._id), await go('GET', '/api/books?author=abc'), await go('GET', '/api/books/' + cc._id), await go('GET', '/api/books/' + new mongoose.Types.ObjectId())]`, nhom: 'f2', moTa: ['author filter / bad id / one / missing', 'Lọc author / id sai / một / không có'] },
    { goi: `[await go('POST', '/api/books', { title: 'Patterns', price: 50, author: fowler._id, createdAt: 'x' }), await go('POST', '/api/books', { title: 'Ghost', price: 5, author: new mongoose.Types.ObjectId() }), await go('POST', '/api/books', { title: '', price: -5 })]`, nhom: 'f3', moTa: ['POST 201 / author not found 404 / validation 400', 'POST 201 / không có tác giả 404 / kiểm tra 400'] },
    { goi: `[await go('PATCH', '/api/books/' + cc._id, { stock: 0, author: fowler._id }), await go('PATCH', '/api/books/' + cc._id, { price: -1 }), await go('DELETE', '/api/books/' + cc._id), await go('DELETE', '/api/books/' + cc._id)]`, nhom: 'f3', an: true },
    { goi: `[await go('GET', '/api/books/zzz'), await go('GET', '/api/nope'), await go('POST', '/api/books', { title: 'T', price: 'abc', author: martin._id })]`, nhom: 'f4', moTa: ['CastError id → 400; unknown route → 404; a bad price is a validation error', 'CastError id → 400; route lạ → 404; giá sai là lỗi kiểm tra'] },
    { goi: `await (async () => { const r = await app.inject({ url: '/admin/books' }); return [r.status, r.headers['content-type'], norm(r.body)]; })()`, nhom: 'f5', moTa: ['The admin page: count, rows, out-of-stock class, formatted prices', 'Trang admin: số lượng, các hàng, class hết hàng, giá đã định dạng'] },
    { goi: `(await Book.create({ title: '<b>XSS</b> & co', price: 1, author: martin._id }), norm((await app.inject({ url: '/admin/books' })).body).includes('&lt;b&gt;XSS&lt;/b&gt; &amp; co'))`, nhom: 'f5', an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-4-lab-bookstore-mvc',
  ten: 'Lab 4 — Bookstore API in MVC + EJS admin page',
  khoa: KHOA,
  baiHoc: 'sdn302-4-1-rest-mvc',
  de: [L1, L2],
});
