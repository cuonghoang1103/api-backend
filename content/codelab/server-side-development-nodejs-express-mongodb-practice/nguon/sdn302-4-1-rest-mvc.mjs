/** SDN302 · 4.1 — REST API đầy đủ theo MVC: route → controller → service → model, mã trạng thái, controller "create" làm đúng, 404/400 id, luật nghiệp vụ ở service, dạng lỗi thống nhất. */
import { doiDau, KHOA, bai, cs, q, qn, ord, bang1, tn } from './_sdn.mjs';

const J = String.raw;
const MODEL = J`const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true }));`;
// một service giả ghi lại lời gọi — để kiểm controller không đụng model
const SPY = `const calls = []; const fakeService = (impl = {}) => new Proxy({}, { get: (t, name) => async (...args) => { calls.push([name, ...args.map((a) => __json(a))]); if (impl[name]) return impl[name](...args); return null; } });`;

/* ── 1 ── */
const CODES = ['200', '201', '204', '400', '401', '403', '404', '409', '500'];
const E1 = cs({
  ten: 'Status codes — the REST vocabulary', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Choose the status code for each outcome of the products API. The status is part of the contract: the React app reads it before the body.',
  vi: 'Chọn mã trạng thái cho mỗi kết quả của API sản phẩm. Mã là một phần hợp đồng: app React đọc nó trước cả thân.',
  bang: [bang1('s1', ['Outcome → status', 'Kết quả → mã'], [{ ma: 'kq', ten: 'Outcome' }, { ma: 'code', ten: 'Status', luaChon: CODES }], [
    { o: { kq: 'GET /api/products — the list' }, a: { code: '200' } },
    { o: { kq: 'POST /api/products — created' }, a: { code: '201' } },
    { o: { kq: 'DELETE /api/products/:id — deleted, no body' }, a: { code: '204' } },
    { o: { kq: 'POST without a name (validation failed)' }, a: { code: '400' } },
    { o: { kq: 'Any write without a token' }, a: { code: '401' } },
    { o: { kq: 'Logged in as a normal user, route is admin-only' }, a: { code: '403' } },
    { o: { kq: 'GET /api/products/:id — no such product' }, a: { code: '404' } },
    { o: { kq: 'POST a product whose unique name already exists' }, a: { code: '409' } },
    { o: { kq: 'The database driver throws an unexpected error' }, a: { code: '500' } },
  ], ['2xx: it worked (201 when something was created, 204 when there is nothing to return). 4xx: the client must change something — 400 bad input, 401 not logged in, 403 logged in but not allowed, 404 no such resource, 409 conflicts with the current state (duplicate). 5xx: the server failed; the client did nothing wrong.', '2xx: thành công (201 khi tạo mới, 204 khi không có gì để trả). 4xx: client phải sửa gì đó — 400 đầu vào sai, 401 chưa đăng nhập, 403 đã đăng nhập nhưng không được phép, 404 không có tài nguyên, 409 xung đột với trạng thái hiện tại (trùng). 5xx: server hỏng; client không làm gì sai.'])],
  goiY: [['401 = who are you? 403 = I know you, and no.', '401 = bạn là ai? 403 = tôi biết bạn, và không.'], ['409 is about the state of the data, 400 about the shape of the input.', '409 là về trạng thái dữ liệu, 400 là về hình dạng đầu vào.']],
  loi: [['200 for everything.', '200 cho mọi thứ.'], ['401 vs 403 swapped.', 'Nhầm 401 với 403.']],
  tns: [tn('status code', 'mã trạng thái'), tn('409 Conflict', 'xung đột')],
  kn: ['status codes'],
});

/* ── 2 ── order + choice */
const E2 = cs({
  ten: 'MVC layers: who does what, and who may call whom', kho: 'EASY', phut: 8, loai: 'order',
  en: 'The layers of the lesson and their dependency direction.',
  vi: 'Các tầng của bài và chiều phụ thuộc.',
  cau: [
    ord('l1', ['A <code>POST /api/products</code> request travels through the layers in which order?', 'Một request <code>POST /api/products</code> đi qua các tầng theo thứ tự nào?'],
      ['Route: <code>router.post(\'/\', create)</code> maps URL + method to the controller', 'Controller: reads <code>req.body</code>, validates, answers 400 if bad', 'Service: applies business rules (e.g. unique name)', 'Model: <code>Product.create(…)</code> — the only layer that touches MongoDB', 'Controller: sends <code>201</code> + JSON (or forwards the error with <code>next(err)</code>)'],
      ['Each layer only calls the one below it. The controller knows HTTP (req/res/status); the service knows the business, not HTTP; the model knows the database. That is why a service can be reused by a script or a test without an HTTP request.', 'Mỗi tầng chỉ gọi tầng ngay dưới. Controller biết HTTP (req/res/status); service biết nghiệp vụ, không biết HTTP; model biết CSDL. Vì vậy service dùng lại được trong script hay test mà không cần request HTTP.']),
    ord('l2', ['Sort these responsibilities from the TOP layer (closest to HTTP) to the BOTTOM layer (closest to MongoDB).', 'Sắp các trách nhiệm từ tầng TRÊN CÙNG (gần HTTP nhất) xuống tầng DƯỚI CÙNG (gần MongoDB nhất).'],
      ['Choose the status code', 'Decide that two products cannot share a name', 'Define the schema and run the query'],
      ['Status codes are HTTP, so they belong to the controller; "no duplicate names" is a business rule (service); schemas and queries are the model\'s job.', 'Mã trạng thái là HTTP nên thuộc controller; "không trùng tên" là luật nghiệp vụ (service); schema và truy vấn là việc của model.']),
  ],
  goiY: [['Who is allowed to know about req and res?', 'Ai được phép biết về req và res?'], ['Dependencies point down.', 'Phụ thuộc chỉ xuống dưới.']],
  loi: [['Status codes in the service.', 'Mã trạng thái nằm trong service.'], ['Controllers calling Product.create directly.', 'Controller gọi thẳng Product.create.']],
  tns: [tn('controller', 'bộ điều khiển', 'tầng HTTP'), tn('service', 'tầng nghiệp vụ')],
  kn: ['MVC'],
});

/* ── 3 ── controller create/list */
const E3 = bai({
  ten: 'The create controller, done right (and list)', kho: 'MEDIUM', phut: 15, lib: ['express'],
  en: J`<p>Write <code>makeProductController(productService)</code> that returns <code>{ list, create }</code>. The service is <b>injected</b> (the grader passes a fake one and records every call):</p>
<ul><li><code>list(req, res, next)</code> — <code>await productService.list()</code> and answer 200 with it;</li>
<li><code>create(req, res, next)</code> — the lesson's controller: take <code>name</code> and <code>price</code> from the body; if <code>!name || price == null</code> answer <code>400</code> <code>{ error: "name and price required" }</code>; otherwise <code>await productService.create({ name, price })</code> and answer <code>201</code> with the result;</li>
<li>both: any error ⇒ <code>next(err)</code> — never swallowed, never answered here.</li></ul>`,
  vi: J`<p>Viết <code>makeProductController(productService)</code> trả về <code>{ list, create }</code>. Service được <b>tiêm vào</b> (máy chấm truyền một service giả và ghi lại mọi lời gọi):</p>
<ul><li><code>list(req, res, next)</code> — <code>await productService.list()</code> và trả 200 với kết quả;</li>
<li><code>create(req, res, next)</code> — controller của bài: lấy <code>name</code> và <code>price</code> từ body; nếu <code>!name || price == null</code> trả <code>400</code> <code>{ error: "name and price required" }</code>; ngược lại <code>await productService.create({ name, price })</code> và trả <code>201</code> với kết quả;</li>
<li>cả hai: lỗi nào cũng ⇒ <code>next(err)</code> — không nuốt, không tự trả lời ở đây.</li></ul>`,
  yc: [
    ['Pass ONLY <code>{ name, price }</code> to the service — not the whole body (mass assignment).', 'Chỉ truyền <code>{ name, price }</code> cho service — không truyền cả body (gán hàng loạt).'],
    ['Wrap the body of each handler in <code>try { … } catch (err) { next(err); }</code>.', 'Bọc thân mỗi handler bằng <code>try { … } catch (err) { next(err); }</code>.'],
    ['The controller must not use <code>Product</code> or <code>mongoose</code> at all.', 'Controller không được dùng <code>Product</code> hay <code>mongoose</code>.'],
  ],
  viDu: [['create — body { name: "Pen", price: 2, isAdmin: true }', '201 + what the service returned · service called with { name: "Pen", price: 2 }', 'isAdmin never reaches the service.', 'isAdmin không bao giờ tới service.'], ['create — body { name: "Pen" }', '400 {"error":"name and price required"} · service NOT called', 'Validate before calling down.', 'Kiểm tra trước khi gọi xuống.']],
  goiY: [
    ['Start from the lesson\'s code: <code>const { name, price } = req.body; if (!name || price == null) return res.status(400).json({ … });</code>', 'Bắt đầu từ mã của bài: <code>const { name, price } = req.body; if (!name || price == null) return res.status(400).json({ … });</code>'],
    ['<code>price == null</code> (two =) is true for both <code>null</code> and <code>undefined</code>, and false for <code>0</code> — a free product is still valid.', '<code>price == null</code> (hai dấu =) đúng cho cả <code>null</code> lẫn <code>undefined</code>, và sai cho <code>0</code> — sản phẩm miễn phí vẫn hợp lệ.'],
  ],
  loi: [
    ['<code>productService.create(req.body)</code> — the client can add fields you never meant to accept.', '<code>productService.create(req.body)</code> — client thêm được những field bạn không định nhận.'],
    ['<code>catch (err) { res.status(500).json(err) }</code> in every controller — five copies of error handling, and Mongoose errors leak.', '<code>catch (err) { res.status(500).json(err) }</code> ở mọi controller — năm bản sao xử lý lỗi, và lỗi Mongoose bị lộ.'],
    ['<code>if (!price)</code> — rejects price 0.', '<code>if (!price)</code> — từ chối giá 0.'],
  ],
  gt: [
    'The factory receives its dependency instead of importing it, so the grader can hand it a fake and prove the controller only does HTTP work: validate, call down with exactly the accepted fields, pick the status, forward failures. "Every REST rule in one function", as the lesson says — and testable in isolation.',
    'Hàm nhà máy nhận phụ thuộc thay vì tự import, nên máy chấm đưa được một bản giả và chứng minh controller chỉ làm việc HTTP: kiểm tra, gọi xuống đúng các field được nhận, chọn mã, chuyển lỗi đi. "Mọi luật REST trong một hàm", như bài nói — và kiểm thử được riêng lẻ.',
  ],
  kn: ['controller', 'dependency injection'],
  tns: [tn('dependency injection', 'tiêm phụ thuộc'), tn('mass assignment', 'gán hàng loạt', 'nhận nguyên body từ client')],
  dau: J`function makeProductController(productService) {
  return {
    async list(req, res) {
      res.json(await productService.list());
    },
    async create(req, res) {
      try {
        if (!req.body.name || !req.body.price) return res.status(400).json({ error: 'name and price required' });
        const product = await productService.create(req.body);
        res.status(200).json(product);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  };
}
`,
  giai: J`// controllers/product.controller.js — HTTP only: read req, validate, call the service, answer
function makeProductController(productService) {
  return {
    async list(req, res, next) {
      try {
        res.json(await productService.list());
      } catch (err) { next(err); }                       // forward, never swallow
    },

    async create(req, res, next) {
      try {
        const { name, price } = req.body;               // only the fields we accept
        if (!name || price == null) {                   // == null: null or undefined, but 0 is fine
          return res.status(400).json({ error: 'name and price required' });
        }
        const product = await productService.create({ name, price });
        res.status(201).json(product);                  // 201 Created
      } catch (err) { next(err); }                       // the central error handler decides the answer
    },
  };
}
`,
  chuanBi: SPY,
  cases: [
    { goi: `[__pick(await __goi(makeProductController(fakeService({ create: async (d) => ({ _id: 'p1', ...d }) })).create, { body: { name: 'Pen', price: 2, isAdmin: true } }), 'status body next'), calls]`, moTa: ['create → 201, the service got { name, price } only', 'create → 201, service chỉ nhận { name, price }'] },
    { goi: `[__pick(await __goi(makeProductController(fakeService()).create, { body: { name: 'Pen' } }), 'status body'), calls]`, moTa: ['Missing price → 400 and the service is NOT called', 'Thiếu price → 400 và KHÔNG gọi service'] },
    { goi: `__pick(await __goi(makeProductController(fakeService({ create: async () => { throw Object.assign(new Error('E11000 duplicate key'), { code: 11000 }); } })).create, { body: { name: 'Pen', price: 2 } }), 'status next')`, moTa: ['A service error is forwarded with next(err)', 'Lỗi service được chuyển bằng next(err)'] },
    { goi: `__pick(await __goi(makeProductController(fakeService({ list: async () => [{ name: 'Pen' }] })).list, {}), 'status body')`, moTa: ['list → 200 + the service result', 'list → 200 + kết quả của service'] },
    { goi: `[__pick(await __goi(makeProductController(fakeService({ create: async (d) => d })).create, { body: { name: 'Sample', price: 0 } }), 'status body'), calls.length]`, an: true },
    { goi: `__pick(await __goi(makeProductController(fakeService({ list: async () => { throw new Error('db down'); } })).list, {}), 'status next')`, an: true },
    { goi: `[__pick(await __goi(makeProductController(fakeService()).create, { body: { price: 3 } }), 'status'), __pick(await __goi(makeProductController(fakeService()).create, { body: { name: '', price: 3 } }), 'status'), calls.length]`, an: true },
  ],
});

/* ── 4 ── getById / update / remove */
const E4 = bai({
  ten: 'getById, update, remove: 400 for a bad id, 404 when missing, 204 on delete', kho: 'MEDIUM', phut: 18, lib: ['mongoose', 'express'],
  en: J`<p>Extend the controller factory with three handlers. The service methods return the product or <code>null</code>:</p>
<ul><li><code>getById</code> — <code>req.params.id</code> not a valid ObjectId ⇒ <code>400</code> <code>{ error: "Invalid id" }</code> (do not call the service); <code>null</code> ⇒ <code>404</code> <code>{ error: "Product not found" }</code>; else 200;</li>
<li><code>update</code> — same id check; body must contain at least one of <code>name</code>, <code>price</code> ⇒ else 400 <code>{ error: "Nothing to update" }</code>; call <code>productService.update(id, { name?, price? })</code> with only the fields present; <code>null</code> ⇒ 404; else 200;</li>
<li><code>remove</code> — same id check; <code>productService.remove(id)</code> returns the deleted product or <code>null</code>; ⇒ <code>204</code> (empty) or 404.</li></ul>
<p>Errors ⇒ <code>next(err)</code>. Use <code>mongoose.isValidObjectId(id)</code>.</p>`,
  vi: J`<p>Mở rộng hàm nhà máy controller với ba handler. Các phương thức service trả sản phẩm hoặc <code>null</code>:</p>
<ul><li><code>getById</code> — <code>req.params.id</code> không phải ObjectId hợp lệ ⇒ <code>400</code> <code>{ error: "Invalid id" }</code> (không gọi service); <code>null</code> ⇒ <code>404</code> <code>{ error: "Product not found" }</code>; còn lại 200;</li>
<li><code>update</code> — cùng phép kiểm id; body phải có ít nhất một trong <code>name</code>, <code>price</code> ⇒ không thì 400 <code>{ error: "Nothing to update" }</code>; gọi <code>productService.update(id, { name?, price? })</code> chỉ với các field có mặt; <code>null</code> ⇒ 404; còn lại 200;</li>
<li><code>remove</code> — cùng phép kiểm id; <code>productService.remove(id)</code> trả sản phẩm đã xoá hoặc <code>null</code>; ⇒ <code>204</code> (rỗng) hoặc 404.</li></ul>
<p>Lỗi ⇒ <code>next(err)</code>. Dùng <code>mongoose.isValidObjectId(id)</code>.</p>`,
  yc: [
    ['A small helper avoids writing the id check three times.', 'Một hàm nhỏ tránh viết phép kiểm id ba lần.'],
    ['Build the update object field by field: <code>if (name !== undefined) changes.name = name;</code>', 'Dựng đối tượng cập nhật từng field: <code>if (name !== undefined) changes.name = name;</code>'],
    ['204 has no body: <code>res.status(204).end()</code>.', '204 không có thân: <code>res.status(204).end()</code>.'],
  ],
  viDu: [['GET /api/products/abc', '400 {"error":"Invalid id"}', 'Not even a database call.', 'Thậm chí không gọi CSDL.'], ['DELETE /api/products/<a real id>', '204', 'The service returned the deleted product.', 'Service trả sản phẩm đã xoá.']],
  goiY: [
    ['<code>const badId = (res, id) => !mongoose.isValidObjectId(id) && res.status(400).json({ error: \'Invalid id\' });</code> then <code>if (badId(res, req.params.id)) return;</code>', '<code>const badId = (res, id) => !mongoose.isValidObjectId(id) && res.status(400).json({ error: \'Invalid id\' });</code> rồi <code>if (badId(res, req.params.id)) return;</code>'],
    ['Without the id check, the service would throw a CastError and the error handler would answer 500 — the client sent a bad id, so it is a 400.', 'Không kiểm id, service sẽ ném CastError và error handler trả 500 — client gửi id sai nên phải là 400.'],
  ],
  loi: [
    ['Answering 200 with <code>null</code> when the product does not exist.', 'Trả 200 với <code>null</code> khi không có sản phẩm.'],
    ['Passing <code>req.body</code> to update: <code>{ price: 3, _id: \'…\' }</code> from a client would try to change the id.', 'Truyền <code>req.body</code> cho update: <code>{ price: 3, _id: \'…\' }</code> từ client sẽ cố đổi id.'],
    ['<code>res.status(204).json({ message: \'deleted\' })</code> — a 204 body is dropped by HTTP; send nothing.', '<code>res.status(204).json({ message: \'deleted\' })</code> — thân của 204 bị HTTP bỏ; đừng gửi gì.'],
  ],
  gt: [
    'Three outcomes, three codes: the client sent something malformed (400), the client asked for something that is not there (404), it worked (200/204). Checking the id shape in the controller keeps a CastError from becoming a misleading 500, and building the change set explicitly is the update-side version of "never trust the client".',
    'Ba kết cục, ba mã: client gửi thứ dị dạng (400), client hỏi thứ không có (404), thành công (200/204). Kiểm hình dạng id ngay ở controller giữ cho CastError không thành một lỗi 500 gây hiểu lầm, và dựng tập thay đổi tường minh là phiên bản phía cập nhật của "đừng tin client".',
  ],
  kn: ['404 vs 400', 'isValidObjectId'],
  tns: [tn('ObjectId', 'id 24 ký tự hex của MongoDB'), tn('204 No Content', 'thành công, không thân')],
  dau: J`const mongoose = require('mongoose');

function makeProductController(productService) {
  return {
    async getById(req, res, next) {
      try {
        res.json(await productService.getById(req.params.id));
      } catch (err) { next(err); }
    },
    async update(req, res, next) {
      try {
        res.json(await productService.update(req.params.id, req.body));
      } catch (err) { next(err); }
    },
    async remove(req, res, next) {
      try {
        await productService.remove(req.params.id);
        res.json({ message: 'deleted' });
      } catch (err) { next(err); }
    },
  };
}
`,
  giai: J`const mongoose = require('mongoose');

// answers 400 and returns true when the id is not a valid ObjectId
function badId(res, id) {
  if (mongoose.isValidObjectId(id)) return false;
  res.status(400).json({ error: 'Invalid id' });
  return true;
}
const notFound = (res) => res.status(404).json({ error: 'Product not found' });

function makeProductController(productService) {
  return {
    async getById(req, res, next) {
      try {
        if (badId(res, req.params.id)) return;          // malformed ⇒ 400, no DB call
        const product = await productService.getById(req.params.id);
        if (!product) return notFound(res);             // missing ⇒ 404
        res.json(product);
      } catch (err) { next(err); }
    },

    async update(req, res, next) {
      try {
        if (badId(res, req.params.id)) return;
        const { name, price } = req.body;
        const changes = {};                             // only the fields that are present
        if (name !== undefined) changes.name = name;
        if (price !== undefined) changes.price = price;
        if (!Object.keys(changes).length) return res.status(400).json({ error: 'Nothing to update' });
        const product = await productService.update(req.params.id, changes);
        if (!product) return notFound(res);
        res.json(product);
      } catch (err) { next(err); }
    },

    async remove(req, res, next) {
      try {
        if (badId(res, req.params.id)) return;
        const deleted = await productService.remove(req.params.id);
        if (!deleted) return notFound(res);
        res.status(204).end();                          // success, nothing to send
      } catch (err) { next(err); }
    },
  };
}
`,
  chuanBi: `${SPY} const ID = '6655aa00a1c2e3b4d5000001'; const PEN = { _id: ID, name: 'Pen', price: 2 };
const ctl = makeProductController(fakeService({ getById: async (id) => (id === ID ? PEN : null), update: async (id, c) => (id === ID ? { ...PEN, ...c } : null), remove: async (id) => (id === ID ? PEN : null) }));
const run = async (h, init) => __pick(await __goi(ctl[h], init), 'status body next');`,
  cases: [
    { goi: `[await run('getById', { params: { id: 'abc' } }), calls.length]`, moTa: ['Invalid id → 400 and no service call', 'Id sai → 400 và không gọi service'] },
    { goi: `[await run('getById', { params: { id: ID } }), await run('getById', { params: { id: '6655aa00a1c2e3b4d5000009' } })]`, moTa: ['Found → 200; missing → 404', 'Có → 200; không có → 404'] },
    { goi: `[await run('update', { params: { id: ID }, body: { price: 3, _id: 'hack', stock: 9 } }), calls]`, moTa: ['update passes only name/price that are present', 'update chỉ truyền name/price có mặt'] },
    { goi: `[await run('remove', { params: { id: ID } }), await run('remove', { params: { id: '6655aa00a1c2e3b4d5000009' } })]`, moTa: ['remove → 204 empty, or 404', 'remove → 204 rỗng, hoặc 404'] },
    { goi: `[await run('update', { params: { id: ID }, body: {} }), await run('update', { params: { id: 'nope' }, body: { price: 1 } }), calls.length]`, an: true },
    { goi: `[await run('update', { params: { id: ID }, body: { price: 0 } }), await run('remove', { params: { id: '123' } })]`, an: true },
    { goi: `__pick(await __goi(makeProductController(fakeService({ getById: async () => { throw new Error('db'); } })).getById, { params: { id: ID } }), 'status next')`, an: true },
  ],
});

/* ── 5 ── service layer */
const E5 = bai({
  ten: 'The service layer: business rules, no HTTP', kho: 'MEDIUM', phut: 20, lib: ['mongoose'],
  en: J`<p>Write <code>makeProductService(Product)</code> → <code>{ list, create, update }</code> on top of the Mongoose model. The service knows the <b>rules</b> but not HTTP: it never sees <code>req</code>/<code>res</code>, it throws an <code>AppError(status, message)</code> that the error handler will turn into a response.</p>
<ul><li><code>class AppError extends Error</code> with a <code>status</code> property (write it);</li>
<li><code>list({ q, minPrice })</code> — optional filters: name contains <code>q</code> (case-insensitive), <code>price ≥ minPrice</code>; sorted by name;</li>
<li><code>create({ name, price })</code> — rule: two products cannot have the same name, ignoring case ⇒ <code>AppError(409, "Product name already exists")</code>; rule: <code>price</code> must be <b>greater than</b> 0 ⇒ <code>AppError(400, "Price must be positive")</code>;</li>
<li><code>update(id, changes)</code> — same two rules (the name rule must not count the product itself), returns the updated product (schema validators on) or <code>null</code>.</li></ul>`,
  vi: J`<p>Viết <code>makeProductService(Product)</code> → <code>{ list, create, update }</code> trên model Mongoose. Service biết <b>luật</b> nhưng không biết HTTP: nó không thấy <code>req</code>/<code>res</code>, nó ném <code>AppError(status, message)</code> để error handler biến thành response.</p>
<ul><li><code>class AppError extends Error</code> có thuộc tính <code>status</code> (tự viết);</li>
<li><code>list({ q, minPrice })</code> — bộ lọc tuỳ chọn: tên chứa <code>q</code> (không phân biệt hoa thường), <code>price ≥ minPrice</code>; sắp theo tên;</li>
<li><code>create({ name, price })</code> — luật: hai sản phẩm không trùng tên, bỏ qua hoa thường ⇒ <code>AppError(409, "Product name already exists")</code>; luật: <code>price</code> phải <b>lớn hơn</b> 0 ⇒ <code>AppError(400, "Price must be positive")</code>;</li>
<li><code>update(id, changes)</code> — cùng hai luật (luật tên không được tính chính sản phẩm đó), trả sản phẩm đã sửa (bật validator của schema) hoặc <code>null</code>.</li></ul>`,
  yc: [
    ['Find a same-name product with a case-insensitive exact match: <code>{ name: new RegExp(\'^\' + escaped + \'$\', \'i\') }</code>.', 'Tìm sản phẩm cùng tên bằng phép khớp chính xác không phân biệt hoa thường: <code>{ name: new RegExp(\'^\' + escaped + \'$\', \'i\') }</code>.'],
    ['In <code>update</code>, exclude the product itself: <code>_id: { $ne: id }</code>.', 'Trong <code>update</code>, loại chính sản phẩm đó: <code>_id: { $ne: id }</code>.'],
    ['No <code>req</code>, <code>res</code> or status-code-sending in this file.', 'Không có <code>req</code>, <code>res</code> hay gửi mã trạng thái trong tệp này.'],
  ],
  viDu: [['create({ name: "pen", price: 3 }) when "Pen" exists', 'throws AppError { status: 409, message: "Product name already exists" }', 'Case is ignored.', 'Bỏ qua hoa thường.'], ['list({ q: "book" })', '[Notebook, Textbook]', 'Contains, case-insensitive, sorted by name.', 'Chứa, không phân biệt hoa thường, sắp theo tên.']],
  goiY: [
    ['<code>class AppError extends Error { constructor(status, message) { super(message); this.status = status; this.name = \'AppError\'; } }</code>', '<code>class AppError extends Error { constructor(status, message) { super(message); this.status = status; this.name = \'AppError\'; } }</code>'],
    ['Escape the name before building the RegExp, or "C++" becomes an invalid pattern.', 'Escape tên trước khi dựng RegExp, không thì "C++" thành mẫu sai.'],
  ],
  loi: [
    ['<code>Product.findOne({ name })</code> — exact case: "pen" and "Pen" both get created.', '<code>Product.findOne({ name })</code> — đúng hoa thường: "pen" và "Pen" đều được tạo.'],
    ['Forgetting <code>$ne: id</code> in update: renaming a product to its own name (or changing only its price) is refused as a duplicate.', 'Quên <code>$ne: id</code> trong update: đổi tên sản phẩm thành chính tên nó (hay chỉ đổi giá) bị từ chối vì "trùng".'],
    ['<code>res.status(409)</code> inside the service — the service cannot be reused by a script or a test without a fake response.', '<code>res.status(409)</code> trong service — service không dùng lại được trong script hay test nếu không có response giả.'],
  ],
  gt: [
    'Rules that are about the business ("unique names", "price > 0") live in one place, the service, so every caller — the REST controller, an EJS admin page, an import script — gets them for free. Throwing a typed <code>AppError</code> keeps the service HTTP-free while still telling the error handler which status to send. The schema keeps its own low-level rules (<code>min: 0</code>), the service adds the stricter business one.',
    'Luật nghiệp vụ ("tên không trùng", "giá > 0") ở một chỗ, là service, nên mọi bên gọi — controller REST, trang quản trị EJS, script nhập liệu — đều được hưởng. Ném <code>AppError</code> có kiểu giữ service sạch HTTP mà vẫn báo cho error handler biết gửi mã nào. Schema giữ luật cấp thấp của nó (<code>min: 0</code>), service thêm luật nghiệp vụ chặt hơn.',
  ],
  kn: ['service layer', 'business rules', 'custom errors'],
  tns: [tn('business rule', 'luật nghiệp vụ'), tn('AppError', 'lỗi ứng dụng có mã trạng thái')],
  dau: J`${MODEL}

class AppError extends Error {}

function makeProductService(Product) {
  return {
    list({ q, minPrice } = {}) {
      return Product.find({ name: q, price: { $gte: minPrice } });
    },
    async create({ name, price }) {
      if (await Product.findOne({ name })) throw new AppError('Product name already exists');
      return Product.create({ name, price });
    },
    async update(id, changes) {
      return Product.findByIdAndUpdate(id, changes);
    },
  };
}
`,
  giai: J`${MODEL}

// a typed error: the service says WHAT went wrong, the error handler turns it into HTTP
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

const escape = (s) => String(s).replace(/[.*+?^@{}()|[\]\\]/g, '\\$&');

function makeProductService(Product) {
  // rule 1: a name may exist only once, ignoring case (exceptId: the product being updated)
  async function assertNameFree(name, exceptId) {
    const filter = { name: new RegExp('^' + escape(name) + '$', 'i') };
    if (exceptId) filter._id = { $ne: exceptId };
    if (await Product.exists(filter)) throw new AppError(409, 'Product name already exists');
  }
  // rule 2: stricter than the schema's min: 0
  function assertPositive(price) {
    if (!(typeof price === 'number' && price > 0)) throw new AppError(400, 'Price must be positive');
  }

  return {
    async list({ q, minPrice } = {}) {
      const filter = {};
      if (q) filter.name = { $regex: escape(q), $options: 'i' };
      if (minPrice !== undefined) filter.price = { $gte: minPrice };
      return await Product.find(filter).sort({ name: 1 });
    },

    async create({ name, price }) {
      assertPositive(price);
      await assertNameFree(name);
      return await Product.create({ name, price });
    },

    async update(id, changes) {
      if (changes.price !== undefined) assertPositive(changes.price);
      if (changes.name !== undefined) await assertNameFree(changes.name, id);
      return await Product.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
    },
  };
}
`,
  chuanBi: `const svc = makeProductService(Product); const pen = await Product.create({ name: 'Pen', price: 2 }); await Product.create({ name: 'Notebook', price: 5 }); await Product.create({ name: 'Textbook', price: 30 });
const tryIt = (p) => p.then((d) => (Array.isArray(d) ? d.map((x) => x.name + ':' + x.price) : d && d.name + ':' + d.price), (e) => ({ name: e.name, status: e.status, message: e.message, isError: e instanceof Error }));`,
  cases: [
    { goi: `await tryIt(svc.create({ name: 'pen', price: 3 }))`, moTa: ['Duplicate name ignoring case → AppError 409', 'Trùng tên bỏ qua hoa thường → AppError 409'] },
    { goi: `await tryIt(svc.create({ name: 'Lamp', price: 0 }))`, moTa: ['price 0 → AppError 400', 'price 0 → AppError 400'] },
    { goi: `[await tryIt(svc.create({ name: 'Lamp', price: 40 })), await tryIt(svc.list({ q: 'BOOK' }))]`, moTa: ['create works; list({ q }) is case-insensitive and sorted', 'create chạy; list({ q }) không phân biệt hoa thường và có sắp'] },
    { goi: `[await tryIt(svc.update(pen._id, { name: 'PEN', price: 2.5 })), await tryIt(svc.update(pen._id, { name: 'notebook' }))]`, moTa: ['update: own name is fine, another product’s name is a 409', 'update: tên của chính nó thì được, tên sản phẩm khác là 409'] },
    { goi: `[await tryIt(svc.list({ minPrice: 5 })), await tryIt(svc.list())]`, an: true },
    { goi: `[await tryIt(svc.update(new mongoose.Types.ObjectId(), { price: 9 })), await tryIt(svc.update(pen._id, { price: -1 }))]`, an: true },
    { goi: `[await tryIt(svc.create({ name: 'C++ Primer', price: 50 })), await tryIt(svc.create({ name: 'c++ primer', price: 51 })), await tryIt(svc.list({ q: '+' }))]`, an: true },
  ],
});

/* ── 6 ── full wiring */
const E6 = bai({
  ten: 'Wire the whole API: router → controller → service → model + one error handler', kho: 'HARD', phut: 30, lib: ['mongoose', 'express'],
  en: J`<p>Put the layers together into a running app with a <b>consistent error shape</b> <code>{ "error": "…" }</code> (+ <code>details</code> for validation). The model is given; write the service, the controller, the router and the error handler.</p>
<table><thead><tr><th>Request</th><th>Answer</th></tr></thead><tbody>
<tr><td><code>GET /api/products</code></td><td>200 + products sorted by name</td></tr>
<tr><td><code>GET /api/products/:id</code></td><td>200 · 404 <code>Product not found</code></td></tr>
<tr><td><code>POST /api/products</code></td><td>201 · 400 from Mongoose validation: <code>{ error: "Validation failed", details: { price: "…message…" } }</code> · 409 <code>Product name already exists</code> (from the unique index, E11000)</td></tr>
<tr><td><code>PATCH /api/products/:id</code></td><td>200 (validators on) · 404</td></tr>
<tr><td><code>DELETE /api/products/:id</code></td><td>204 · 404</td></tr>
<tr><td>any malformed id</td><td>400 <code>Invalid id</code> (a Mongoose CastError)</td></tr>
<tr><td>anything unexpected</td><td>500 <code>Internal Server Error</code></td></tr></tbody></table>
<p>This time the controller does <b>not</b> check ids itself: the CastError travels to the error handler, which maps it. Export <code>module.exports = app</code>.</p>`,
  vi: J`<p>Ráp các tầng thành một app chạy được với <b>dạng lỗi thống nhất</b> <code>{ "error": "…" }</code> (+ <code>details</code> cho lỗi kiểm tra). Model cho sẵn; viết service, controller, router và error handler.</p>
<table><thead><tr><th>Request</th><th>Trả lời</th></tr></thead><tbody>
<tr><td><code>GET /api/products</code></td><td>200 + sản phẩm sắp theo tên</td></tr>
<tr><td><code>GET /api/products/:id</code></td><td>200 · 404 <code>Product not found</code></td></tr>
<tr><td><code>POST /api/products</code></td><td>201 · 400 từ validation của Mongoose: <code>{ error: "Validation failed", details: { price: "…thông báo…" } }</code> · 409 <code>Product name already exists</code> (từ index duy nhất, E11000)</td></tr>
<tr><td><code>PATCH /api/products/:id</code></td><td>200 (bật validator) · 404</td></tr>
<tr><td><code>DELETE /api/products/:id</code></td><td>204 · 404</td></tr>
<tr><td>id dị dạng bất kỳ</td><td>400 <code>Invalid id</code> (CastError của Mongoose)</td></tr>
<tr><td>mọi thứ bất ngờ</td><td>500 <code>Internal Server Error</code></td></tr></tbody></table>
<p>Lần này controller <b>không</b> tự kiểm id: CastError đi tới error handler và được ánh xạ ở đó. Export <code>module.exports = app</code>.</p>`,
  yc: [
    ['Error handler (4 params), in this order: <code>err.name === \'ValidationError\'</code> ⇒ 400 + details (path → message); <code>err.name === \'CastError\'</code> ⇒ 400 Invalid id; <code>err.code === 11000</code> ⇒ 409; <code>err.status</code> ⇒ that status; else 500.', 'Error handler (4 tham số), theo thứ tự: <code>err.name === \'ValidationError\'</code> ⇒ 400 + details (đường → thông báo); <code>err.name === \'CastError\'</code> ⇒ 400 Invalid id; <code>err.code === 11000</code> ⇒ 409; <code>err.status</code> ⇒ mã đó; còn lại 500.'],
    ['Check ValidationError BEFORE CastError: a ValidationError can contain a CastError for one field (<code>price: "abc"</code>), and that is a validation problem, not an id problem.', 'Kiểm ValidationError TRƯỚC CastError: ValidationError có thể chứa CastError cho một field (<code>price: "abc"</code>), và đó là lỗi kiểm tra, không phải lỗi id.'],
    ['Accept only <code>name</code> and <code>price</code> from the body on POST and PATCH.', 'Chỉ nhận <code>name</code> và <code>price</code> từ body ở POST và PATCH.'],
  ],
  viDu: [['POST /api/products {"name":"Pen","price":-1}', '400 {"error":"Validation failed","details":{"price":"Path `price` (-1) is less than minimum allowed value (0)."}}', 'The Mongoose message per path.', 'Thông báo Mongoose theo từng đường.'], ['GET /api/products/abc', '400 {"error":"Invalid id"}', 'CastError mapped centrally.', 'CastError được ánh xạ ở một chỗ.']],
  goiY: [
    ['<code>details = Object.fromEntries(Object.entries(err.errors).map(([path, e]) => [path, e.message]))</code>', '<code>details = Object.fromEntries(Object.entries(err.errors).map(([path, e]) => [path, e.message]))</code>'],
    ['A tiny <code>pick(body)</code> helper returns <code>{ name, price }</code> without the undefined ones.', 'Một hàm nhỏ <code>pick(body)</code> trả <code>{ name, price }</code> bỏ các giá trị undefined.'],
    ['Mount: <code>app.use(express.json()); app.use(\'/api/products\', router); app.use(errorHandler);</code>', 'Gắn: <code>app.use(express.json()); app.use(\'/api/products\', router); app.use(errorHandler);</code>'],
  ],
  loi: [
    ['Mapping every CastError to "Invalid id": <code>POST {"price":"abc"}</code> is then reported as a bad id.', 'Ánh xạ mọi CastError thành "Invalid id": <code>POST {"price":"abc"}</code> lại bị báo là id sai.'],
    ['Answering E11000 as 500 — a duplicate is the client\'s conflict (409), not a server failure.', 'Trả E11000 thành 500 — trùng là xung đột phía client (409), không phải server hỏng.'],
    ['Sending <code>err</code> itself with <code>res.json(err)</code>: internal shapes (and sometimes secrets) leak.', 'Gửi nguyên <code>err</code> bằng <code>res.json(err)</code>: hình dạng nội bộ (đôi khi cả bí mật) bị lộ.'],
  ],
  gt: [
    'With the layers in place, every route handler shrinks to "call the service, pick the success code", and every failure flows to ONE function that knows how to translate Mongoose\'s three error families (validation, cast, duplicate key) plus your own AppErrors into the API\'s single error envelope. That is the shape graders expect in the Practical Exam and the shape a React client can rely on.',
    'Khi các tầng đã đứng đúng chỗ, mỗi route handler gọn lại thành "gọi service, chọn mã thành công", và mọi thất bại chảy về MỘT hàm biết dịch ba họ lỗi của Mongoose (kiểm tra, ép kiểu, trùng khoá) cùng AppError của bạn thành một vỏ lỗi duy nhất của API. Đó là hình dạng giám khảo chờ ở Practical Exam và là hình dạng client React có thể dựa vào.',
  ],
  kn: ['MVC wiring', 'error mapping'],
  tns: [tn('error envelope', 'vỏ lỗi', 'một dạng JSON cho mọi lỗi'), tn('E11000', 'trùng khoá duy nhất')],
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true }));

const app = express();
app.use(express.json());

app.get('/api/products', async (req, res) => res.json(await Product.find()));
app.post('/api/products', async (req, res) => {
  try { res.json(await Product.create(req.body)); } catch (e) { res.status(500).json(e); }
});

module.exports = app;
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');

// ── model (given) ──
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true }));

// ── service: talks to the model, knows nothing about HTTP ──
const productService = {
  list: () => Product.find().sort({ name: 1 }),
  getById: (id) => Product.findById(id),
  create: (data) => Product.create(data),
  update: (id, changes) => Product.findByIdAndUpdate(id, changes, { new: true, runValidators: true }),
  remove: (id) => Product.findByIdAndDelete(id),
};

// ── controller: HTTP only ──
const pick = ({ name, price }) => Object.fromEntries(Object.entries({ name, price }).filter(([, v]) => v !== undefined));
const notFound = (res) => res.status(404).json({ error: 'Product not found' });
const controller = {
  async list(req, res, next) { try { res.json(await productService.list()); } catch (e) { next(e); } },
  async getById(req, res, next) {
    try { const p = await productService.getById(req.params.id); if (!p) return notFound(res); res.json(p); } catch (e) { next(e); }
  },
  async create(req, res, next) {
    try { res.status(201).json(await productService.create(pick(req.body))); } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { const p = await productService.update(req.params.id, pick(req.body)); if (!p) return notFound(res); res.json(p); } catch (e) { next(e); }
  },
  async remove(req, res, next) {
    try { const p = await productService.remove(req.params.id); if (!p) return notFound(res); res.status(204).end(); } catch (e) { next(e); }
  },
};

// ── router: URL + method ⇒ controller ──
const router = express.Router();
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

// ── one error handler, one error shape ──
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {                       // FIRST: it may contain a CastError for a field
    const details = Object.fromEntries(Object.entries(err.errors).map(([path, e]) => [path, e.message]));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ error: 'Product name already exists' });
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}

const app = express();
app.use(express.json());
app.use('/api/products', router);
app.use(errorHandler);
module.exports = app;
`,
  chuanBi: `const app = module.exports; const go = async (method, url, body) => __res(await app.inject({ method, url, body })); const P = mongoose.model('Product'); const pen = await P.create({ name: 'Pen', price: 2 }); await P.create({ name: 'Book', price: 25 });
const strip = (r) => (r.body && r.body._id ? { status: r.status, body: __pick(r.body, 'name price') } : r);`,
  cases: [
    { goi: `(await go('GET', '/api/products')).body.map((p) => p.name)`, moTa: ['GET list sorted by name', 'GET danh sách sắp theo tên'] },
    { goi: `strip(await go('POST', '/api/products', { name: 'Lamp', price: 40, _id: 'x' }))`, moTa: ['POST → 201', 'POST → 201'] },
    { goi: `await go('POST', '/api/products', { name: 'Pen2', price: -1 })`, moTa: ['Validation → 400 + details', 'Validation → 400 + details'] },
    { goi: `await go('POST', '/api/products', { name: 'Pen', price: 3 })`, moTa: ['Duplicate (E11000) → 409', 'Trùng (E11000) → 409'] },
    { goi: `[await go('GET', '/api/products/abc'), await go('DELETE', '/api/products/abc')]`, moTa: ['Malformed id → 400 Invalid id', 'Id dị dạng → 400 Invalid id'] },
    { goi: `[strip(await go('PATCH', '/api/products/' + pen._id, { price: 3 })), await go('PATCH', '/api/products/' + pen._id, { price: -3 })]`, an: true },
    { goi: `[await go('DELETE', '/api/products/' + pen._id), await go('GET', '/api/products/' + pen._id), await go('DELETE', '/api/products/' + pen._id)]`, an: true },
    { goi: `await go('POST', '/api/products', { name: 'Glue', price: 'abc' })`, an: true, moTa: ['A cast error on a field is a validation error, not "Invalid id"', 'Lỗi ép kiểu ở một field là lỗi kiểm tra, không phải "Invalid id"'] },
    { goi: `await go('POST', '/api/products', {})`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-4-1-rest-mvc',
  ten: '4.1 A full REST API with Express, Mongoose & MVC',
  khoa: KHOA,
  baiHoc: 'sdn302-4-1-rest-mvc',
  de: [E1, E2, E3, E4, E5, E6],
});
