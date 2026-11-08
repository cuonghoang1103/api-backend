/** SDN302 · Lab Chương 8 — Orders API đã gia cố: kiểm tra ở rìa, tính tiền ở server (không tin client), trừ kho nguyên tử, báo cáo bằng aggregation, rate limit, header bảo mật + lỗi an toàn. Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

const L1 = cs({
  ten: 'Lab 8 · warm-up — what must the server never trust?', kho: 'EASY', phut: 6, dangBai: 'lab',
  en: 'An order request arrives from the browser. Decide what the server recomputes.',
  vi: 'Một request đặt hàng đến từ trình duyệt. Quyết định server phải tự tính lại cái gì.',
  cau: [
    qn('t1', ['The body is <code>{ items: [{ sku, qty, price }], total, customerEmail }</code>. Which values must the server IGNORE and recompute? (choose all)', 'Thân là <code>{ items: [{ sku, qty, price }], total, customerEmail }</code>. Server phải BỎ QUA và tự tính lại giá trị nào? (chọn hết)'],
      ['<code>items[].price</code> — read it from the products collection', '<code>total</code> — sum it on the server', '<code>items[].qty</code>', '<code>customerEmail</code>'],
      [0, 1], ['Quantities and the email are the customer\'s choices (validate them); prices and totals are the shop\'s facts.', 'Số lượng và email là lựa chọn của khách (hãy kiểm tra); giá và tổng là dữ kiện của cửa hàng.']),
    q('t2', ['Two customers buy the last unit at the same moment. Which update keeps stock correct?', 'Hai khách mua món cuối cùng cùng lúc. Lệnh cập nhật nào giữ kho đúng?'],
      ['<code>updateOne({ sku, stock: { $gte: qty } }, { $inc: { stock: -qty } })</code> and check <code>modifiedCount</code>', 'Read the product, compute <code>stock - qty</code> in JavaScript, then <code>$set</code> it', '<code>$set: { stock: 0 }</code> after every order', 'Decrement in the React app before calling the API'],
      ['The condition and the decrement happen in one atomic database operation; <code>modifiedCount: 0</code> means "not enough stock".', 'Điều kiện và phép trừ diễn ra trong một thao tác nguyên tử của CSDL; <code>modifiedCount: 0</code> nghĩa là "không đủ hàng".']),
  ],
  goiY: [['Prices are facts of the shop.', 'Giá là dữ kiện của cửa hàng.'], ['Check and change in one operation.', 'Kiểm và đổi trong một thao tác.']],
  loi: [['Trusting the client total.', 'Tin tổng tiền của client.'], ['Read-modify-write on stock.', 'Đọc-sửa-ghi trên kho.']],
  tns: [tn('atomic', 'nguyên tử')],
  kn: ['security', 'atomic updates'],
});

const L2 = bai({
  ten: 'Lab 8 — A hardened Orders API', kho: 'HARD', phut: 100, dangBai: 'lab', lib: ['mongoose', 'mongo-agg', 'express'],
  en: J`<p>Turn everything of Chapter 8 into one API: validation at the edge, server-side prices, atomic stock, an aggregation report, rate limiting and safe responses. The full brief is in the statement.</p>`,
  vi: J`<p>Gom mọi thứ của Chương 8 vào một API: kiểm tra ở rìa, giá tính ở server, kho nguyên tử, một báo cáo aggregation, rate limit và câu trả lời an toàn. Đề đầy đủ nằm trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['<code>module.exports = { app, Product, Order };</code>', '<code>module.exports = { app, Product, Order };</code>']],
  viDu: [['POST /api/orders {"customerEmail":"an@x.com","items":[{"sku":"BOOK-1","qty":2,"price":0.01}],"total":0.02}', '201 {"total":50,"items":[{"sku":"BOOK-1","qty":2,"price":25}], …}', 'The server ignored the client\'s price and total.', 'Server bỏ qua giá và tổng của client.']],
  goiY: [['Validate the shape first (a middleware), then load the products of the order with ONE query: <code>Product.find({ sku: { $in: skus } })</code>.', 'Kiểm hình dạng trước (một middleware), rồi nạp sản phẩm của đơn bằng MỘT truy vấn: <code>Product.find({ sku: { $in: skus } })</code>.'], ['If one decrement fails, put back the ones that already succeeded (<code>$inc: { stock: +qty }</code>) before answering 409.', 'Nếu một phép trừ hỏng, trả lại những phép đã thành công (<code>$inc: { stock: +qty }</code>) trước khi trả 409.']],
  loi: [['Using the price from the request body.', 'Dùng giá từ thân request.'], ['Decrementing stock with read-modify-write.', 'Trừ kho bằng đọc-sửa-ghi.'], ['$lookup with the model name instead of the collection name.', '$lookup bằng tên model thay vì tên collection.']],
  gt: ['A production API recomputes everything that is a fact of the business (prices, totals, stock) and validates everything that is a choice of the client (items, quantities, email). Atomic conditional updates keep stock right under concurrency, aggregation keeps reports inside the database, and the limiter + headers + safe error handler harden the edges.', 'Một API production tự tính lại mọi thứ là dữ kiện của doanh nghiệp (giá, tổng, kho) và kiểm tra mọi thứ là lựa chọn của client (món, số lượng, email). Cập nhật có điều kiện nguyên tử giữ kho đúng khi đồng thời, aggregation giữ báo cáo ở trong CSDL, còn limiter + header + error handler an toàn gia cố các rìa.'],
  kn: ['validation', 'atomic updates', 'aggregation', 'rate limiting'],
  tns: [tn('compensation', 'bù trừ', 'hoàn tác các bước đã làm khi bước sau hỏng')],
  timeoutMs: 200000,
  banIn: {
    tieuDe: { en: 'Lab 8 — Hardened Orders API', vi: 'Lab 8 — Orders API đã gia cố' },
    phu: { en: 'validation · atomic stock · aggregation · rate limit · 100 minutes · 10 marks', vi: 'validation · kho nguyên tử · aggregation · rate limit · 100 phút · 10 điểm' },
    moTa: { en: '<p>A shop sells products identified by <code>sku</code>. Customers place orders; the manager reads a "top products" report. Models are described below — write them, then the app. All answers are JSON.</p>', vi: '<p>Một cửa hàng bán sản phẩm định danh bằng <code>sku</code>. Khách đặt đơn; quản lý đọc báo cáo "sản phẩm bán chạy". Model mô tả bên dưới — viết chúng, rồi viết app. Mọi câu trả lời là JSON.</p>' },
    yeuCauChung: [{ en: 'Prices and totals are computed on the server from the products collection.', vi: 'Giá và tổng được tính ở server từ collection sản phẩm.' }, { en: 'The report is computed with <code>Order.aggregate</code>, not with a JavaScript loop over all orders.', vi: 'Báo cáo tính bằng <code>Order.aggregate</code>, không bằng vòng lặp JavaScript qua mọi đơn.' }],
    cayThuMuc: 'answer.js   ← models, middleware, routes\nlib/        ← provided',
    moHinh: [
      { ten: 'Product', truong: [['sku', 'String', { en: 'required, unique', vi: 'bắt buộc, duy nhất' }], ['name', 'String', 'required'], ['price', 'Number', 'required, min 0'], ['stock', 'Number', 'min 0']] },
      { ten: 'Order', truong: [['customerEmail', 'String', 'required, lowercase'], ['items', '[{ sku, qty, price }]', { en: 'price = the product price at order time', vi: 'price = giá sản phẩm lúc đặt' }], ['total', 'Number', { en: 'sum of qty × price', vi: 'tổng qty × price' }]] },
    ],
    chucNang: [
      { ten: { en: 'Validate at the edge', vi: 'Kiểm tra ở rìa' }, diem: 2, yeuCau: [{ en: 'Before the handler, <code>POST /api/orders</code> checks: <code>customerEmail</code> a string matching <code>/^\\S+@\\S+\\.\\S+$/</code>; <code>items</code> a non-empty array (max 10) of <code>{ sku: string, qty: integer 1–20 }</code>. Problems ⇒ 400 <code>{ "error": "Validation failed", "details": ["…", …] }</code> with the messages <code>"customerEmail is invalid"</code>, <code>"items must be a non-empty array (max 10)"</code>, <code>"items[i].sku is required"</code>, <code>"items[i].qty must be an integer 1-20"</code> (i = index), in that order.', vi: 'Trước handler, <code>POST /api/orders</code> kiểm: <code>customerEmail</code> là chuỗi khớp <code>/^\\S+@\\S+\\.\\S+$/</code>; <code>items</code> là mảng không rỗng (tối đa 10) gồm <code>{ sku: string, qty: số nguyên 1–20 }</code>. Có vấn đề ⇒ 400 <code>{ "error": "Validation failed", "details": ["…", …] }</code> với các thông báo <code>"customerEmail is invalid"</code>, <code>"items must be a non-empty array (max 10)"</code>, <code>"items[i].sku is required"</code>, <code>"items[i].qty must be an integer 1-20"</code> (i = chỉ số), theo thứ tự đó.' }] },
      { ten: { en: 'Create an order (server prices, atomic stock)', vi: 'Tạo đơn (giá ở server, kho nguyên tử)' }, diem: 2.5, yeuCau: [
        { en: 'An unknown sku ⇒ 404 <code>{ "error": "Unknown sku: X" }</code> (first unknown in item order).', vi: 'sku lạ ⇒ 404 <code>{ "error": "Unknown sku: X" }</code> (sku lạ đầu tiên theo thứ tự món).' },
        { en: 'Decrement each product with ONE conditional update (<code>stock ≥ qty</code>); if one fails, restore the previous ones and answer 409 <code>{ "error": "Out of stock: X" }</code>.', vi: 'Trừ mỗi sản phẩm bằng MỘT cập nhật có điều kiện (<code>stock ≥ qty</code>); nếu một cái hỏng, trả lại các cái trước và trả 409 <code>{ "error": "Out of stock: X" }</code>.' },
        { en: '201 + the order <code>{ _id, customerEmail, items: [{ sku, qty, price }], total }</code> — prices from the database, the client\'s <code>price</code>/<code>total</code> ignored.', vi: '201 + đơn <code>{ _id, customerEmail, items: [{ sku, qty, price }], total }</code> — giá từ CSDL, <code>price</code>/<code>total</code> của client bị bỏ qua.' }] },
      { ten: { en: 'Top products report', vi: 'Báo cáo sản phẩm bán chạy' }, diem: 2, yeuCau: [{ en: '<code>GET /api/reports/top-products?limit=N</code> (default 3, integer 1–10 ⇒ else 400 <code>{ "error": "Invalid limit" }</code>) ⇒ 200 <code>[{ sku, name, sold, revenue }]</code>, by <code>sold</code> descending — <code>$unwind</code> the items, <code>$group</code> by sku, <code>$sort</code>, <code>$limit</code>, then <code>$lookup</code> the product name.', vi: '<code>GET /api/reports/top-products?limit=N</code> (mặc định 3, số nguyên 1–10 ⇒ không thì 400 <code>{ "error": "Invalid limit" }</code>) ⇒ 200 <code>[{ sku, name, sold, revenue }]</code>, theo <code>sold</code> giảm dần — <code>$unwind</code> các món, <code>$group</code> theo sku, <code>$sort</code>, <code>$limit</code>, rồi <code>$lookup</code> tên sản phẩm.' }] },
      { ten: { en: 'Rate limit orders', vi: 'Giới hạn tần suất đặt đơn' }, diem: 1.5, yeuCau: [{ en: 'At most 3 <code>POST /api/orders</code> per IP per 60 s (fixed window); the 4th ⇒ 429 <code>{ "error": "Too many orders, try again later" }</code> + <code>Retry-After</code> (seconds, rounded up). Counted BEFORE validation.', vi: 'Tối đa 3 <code>POST /api/orders</code> mỗi IP mỗi 60 s (khung cố định); lần 4 ⇒ 429 <code>{ "error": "Too many orders, try again later" }</code> + <code>Retry-After</code> (giây, làm tròn lên). Đếm TRƯỚC khi kiểm tra.' }] },
      { ten: { en: 'Safe edges', vi: 'Rìa an toàn' }, diem: 2, yeuCau: [{ en: 'No <code>X-Powered-By</code>; every response has <code>X-Content-Type-Options: nosniff</code>; unknown routes ⇒ 404 <code>{ "error": "Not found" }</code>; invalid JSON ⇒ 400 <code>{ "error": "Invalid JSON" }</code>; anything unexpected ⇒ 500 <code>{ "error": "Internal Server Error" }</code> only.', vi: 'Không <code>X-Powered-By</code>; mọi response có <code>X-Content-Type-Options: nosniff</code>; route lạ ⇒ 404 <code>{ "error": "Not found" }</code>; JSON hỏng ⇒ 400 <code>{ "error": "Invalid JSON" }</code>; mọi thứ bất ngờ ⇒ chỉ 500 <code>{ "error": "Internal Server Error" }</code>.' }] },
    ],
    truDiem: [{ en: 'Using the client\'s price or total: the whole feature 2 is lost.', vi: 'Dùng giá hoặc tổng của client: mất cả chức năng 2.' }],
    nopBai: { en: 'Submit <code>answer.js</code>; <code>module.exports = { app, Product, Order };</code>', vi: 'Nộp <code>answer.js</code>; <code>module.exports = { app, Product, Order };</code>' },
  },
  dau: J`const express = require('express');
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({ sku: String, name: String, price: Number, stock: Number }));
const Order = mongoose.model('Order', new mongoose.Schema({ customerEmail: String, items: Array, total: Number }));

const app = express();
app.use(express.json());
app.post('/api/orders', async (req, res) => res.status(201).json(await Order.create(req.body)));
module.exports = { app, Product, Order };
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── models ──
const Product = mongoose.model('Product', new Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, min: 0, default: 0 },
}));
const Order = mongoose.model('Order', new Schema({
  customerEmail: { type: String, required: true, lowercase: true, trim: true },
  items: [{ sku: String, qty: Number, price: Number }],
  total: Number,
}, { timestamps: true }));

// ── edges ──
function securityHeaders(req, res, next) { res.set('X-Content-Type-Options', 'nosniff'); next(); }
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    let e = hits.get(req.ip);
    if (!e || now - e.start >= windowMs) { e = { start: now, count: 0 }; hits.set(req.ip, e); }
    if (++e.count > max) {
      res.set('Retry-After', String(Math.ceil((e.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: 'Too many orders, try again later' });
    }
    next();
  };
}
function validateOrder(req, res, next) {
  const b = req.body || {};
  const details = [];
  if (typeof b.customerEmail !== 'string' || !/^\S+@\S+\.\S+$/.test(b.customerEmail)) details.push('customerEmail is invalid');
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 10) details.push('items must be a non-empty array (max 10)');
  else b.items.forEach((it, i) => {
    if (!it || typeof it.sku !== 'string' || !it.sku) details.push(´items[@{i}].sku is required´);
    if (!it || !Number.isInteger(it.qty) || it.qty < 1 || it.qty > 20) details.push(´items[@{i}].qty must be an integer 1-20´);
  });
  if (details.length) return res.status(400).json({ error: 'Validation failed', details });
  req.body = { customerEmail: b.customerEmail, items: b.items.map((it) => ({ sku: it.sku, qty: it.qty })) };   // clean
  next();
}
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const app = express();
app.disable('x-powered-by');
app.use(securityHeaders);
app.use(express.json());

app.post('/api/orders', rateLimit({ windowMs: 60000, max: 3 }), validateOrder, wrap(async (req, res) => {
  const { customerEmail, items } = req.body;
  const products = await Product.find({ sku: { $in: items.map((i) => i.sku) } });   // ONE query
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const unknown = items.find((i) => !bySku.has(i.sku));
  if (unknown) return res.status(404).json({ error: 'Unknown sku: ' + unknown.sku });

  const done = [];
  for (const it of items) {
    // atomic: the condition and the decrement in one operation
    const r = await Product.updateOne({ sku: it.sku, stock: { $gte: it.qty } }, { $inc: { stock: -it.qty } });
    if (r.modifiedCount === 0) {
      for (const d of done) await Product.updateOne({ sku: d.sku }, { $inc: { stock: d.qty } });   // compensate
      return res.status(409).json({ error: 'Out of stock: ' + it.sku });
    }
    done.push(it);
  }
  const lines = items.map((it) => ({ sku: it.sku, qty: it.qty, price: bySku.get(it.sku).price }));   // SERVER prices
  const total = Math.round(lines.reduce((s, l) => s + l.qty * l.price, 0) * 100) / 100;
  const order = await Order.create({ customerEmail, items: lines, total });
  res.status(201).json({ _id: order._id, customerEmail: order.customerEmail, items: lines, total });
}));

app.get('/api/reports/top-products', wrap(async (req, res) => {
  const raw = req.query.limit;
  const limit = raw === undefined ? 3 : Number(raw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) return res.status(400).json({ error: 'Invalid limit' });
  const rows = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.sku', sold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
    { $sort: { sold: -1, _id: 1 } },
    { $limit: limit },
    { $lookup: { from: 'products', localField: '_id', foreignField: 'sku', as: 'p' } },
    { $unwind: '$p' },
    { $project: { _id: 0, sku: '$_id', name: '$p.name', sold: 1, revenue: 1 } },
  ]);
  res.json(rows);
}));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = { app, Product, Order };
`,
  chuanBi: `const { app, Product, Order } = module.exports; await Product.insertMany([{ sku: 'BOOK-1', name: 'Clean Code', price: 25, stock: 5 }, { sku: 'PEN-1', name: 'Blue pen', price: 1.5, stock: 100 }, { sku: 'LAMP-1', name: 'Desk lamp', price: 40, stock: 1 }]);
let ipN = 0; const order = async (body, ip) => { const r = await app.inject({ method: 'POST', url: '/api/orders', body, ip: ip || '10.0.0.' + (++ipN) }); return { status: r.status, body: r.body && r.body._id ? __pick(r.body, 'customerEmail items total') : r.body }; };
const stock = async () => (await Product.find().sort({ sku: 1 })).map((p) => p.sku + ':' + p.stock);`,
  cases: [
    { goi: `[await order({ customerEmail: 'nope', items: [{ sku: '', qty: 0 }, { sku: 'PEN-1', qty: 2.5 }] }), await order({ customerEmail: 'a@x.com', items: [] })]`, nhom: 'f1', moTa: ['Validation details in order', 'Chi tiết lỗi kiểm tra theo thứ tự'] },
    { goi: `[await order({ customerEmail: 'an@x.com', items: Array.from({ length: 11 }, () => ({ sku: 'PEN-1', qty: 1 })) }), await order(undefined)]`, nhom: 'f1', an: true },
    { goi: `[await order({ customerEmail: 'AN@x.com', items: [{ sku: 'BOOK-1', qty: 2, price: 0.01 }, { sku: 'PEN-1', qty: 3 }], total: 0.02 }), await stock()]`, nhom: 'f2', moTa: ['201 with server prices and total; stock decremented', '201 với giá và tổng của server; kho đã trừ'] },
    { goi: `[await order({ customerEmail: 'b@x.com', items: [{ sku: 'BOOK-1', qty: 1 }, { sku: 'GHOST', qty: 1 }] }), await order({ customerEmail: 'b@x.com', items: [{ sku: 'BOOK-1', qty: 2 }, { sku: 'LAMP-1', qty: 2 }] }), await stock()]`, nhom: 'f2', moTa: ['Unknown sku → 404; out of stock → 409 and earlier decrements restored', 'sku lạ → 404; hết hàng → 409 và các phép trừ trước được trả lại'] },
    { goi: `[await Promise.all([order({ customerEmail: 'c@x.com', items: [{ sku: 'LAMP-1', qty: 1 }] }), order({ customerEmail: 'd@x.com', items: [{ sku: 'LAMP-1', qty: 1 }] })]).then((rs) => rs.map((r) => r.status).sort()), await stock()]`, nhom: 'f2', an: true, moTa: ['Two buyers of the last lamp: exactly one wins', 'Hai người mua chiếc đèn cuối: đúng một người được'] },
    { goi: `(await order({ customerEmail: 'a@x.com', items: [{ sku: 'PEN-1', qty: 10 }, { sku: 'BOOK-1', qty: 1 }] }), await order({ customerEmail: 'b@x.com', items: [{ sku: 'BOOK-1', qty: 2 }, { sku: 'LAMP-1', qty: 1 }] }), [__res(await app.inject({ url: '/api/reports/top-products' })), __res(await app.inject({ url: '/api/reports/top-products?limit=1' })), (await app.inject({ url: '/api/reports/top-products?limit=50' })).status])`, nhom: 'f3', moTa: ['Top products by sold, with names and revenue; limit validated', 'Bán chạy theo số lượng, kèm tên và doanh thu; limit được kiểm'] },
    { goi: `[(await order({ customerEmail: 'x', items: [] }, '9.9.9.9')).status, (await order({ customerEmail: 'x', items: [] }, '9.9.9.9')).status, (await order({ customerEmail: 'x', items: [] }, '9.9.9.9')).status, await (async () => { const r = await app.inject({ method: 'POST', url: '/api/orders', ip: '9.9.9.9', body: {} }); return [r.status, r.body, r.headers['retry-after']]; })(), (await order({ customerEmail: 'x', items: [] }, '8.8.8.8')).status]`, nhom: 'f4', moTa: ['The 4th order request from one IP → 429 (counted before validation)', 'Request đặt đơn thứ 4 từ một IP → 429 (đếm trước khi kiểm tra)'] },
    { goi: `await (async () => { const a = await app.inject({ url: '/api/nope' }); const b = await app.inject({ method: 'POST', url: '/api/orders', ip: '7.7.7.7', body: '{"items": [', headers: { 'content-type': 'application/json' } }); return [a.status, a.body, a.headers['x-powered-by'] || null, a.headers['x-content-type-options'], b.status, b.body]; })()`, nhom: 'f5', moTa: ['Safe edges: 404 JSON, nosniff, no X-Powered-By, Invalid JSON', 'Rìa an toàn: 404 JSON, nosniff, không X-Powered-By, Invalid JSON'] },
    { goi: `(Product.find = () => { throw new Error('connect ECONNREFUSED mongodb://admin:pw@db'); }, __res(await app.inject({ method: 'POST', url: '/api/orders', ip: '6.6.6.6', body: { customerEmail: 'a@x.com', items: [{ sku: 'PEN-1', qty: 1 }] } })))`, nhom: 'f5', an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-8-lab-hardened-orders',
  ten: 'Lab 8 — A hardened Orders API',
  khoa: KHOA,
  baiHoc: 'sdn302-8-2-production',
  de: [L1, L2],
});
