/** SDN302 · 2.1 — Express routing & your first app: app.get + req.params, Router theo tài nguyên, express.json(), thứ tự route, query string, Express Generator. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const SAN_PHAM = J`const products = [
  { id: 1, name: 'Book', price: 25 },
  { id: 2, name: 'Pen', price: 2 },
  { id: 3, name: 'Notebook', price: 5 },
];`;

/* ── 1 ── */
const E1 = bai({
  ten: 'Your first Express app: GET a list and GET one by :id', kho: 'EASY', phut: 10, lib: ['express'],
  en: J`<p>This is the first app of the lesson, finished properly. The products live in an array (no database yet).</p>
<ul><li><code>GET /api/products</code> → <code>200</code> and the whole array as JSON.</li>
<li><code>GET /api/products/:id</code> → <code>200</code> and the product whose <code>id</code> matches, or <code>404</code> with <code>{ "error": "Product not found" }</code>.</li></ul>
<p>Finish with <code>module.exports = app;</code> — the grader (like Supertest in a real project) sends requests to the exported app instead of a port: <code>await app.inject({ method: 'GET', url: '/api/products/2' })</code>.</p>`,
  vi: J`<p>Đây là app đầu tiên của bài học, làm cho đúng. Sản phẩm nằm trong một mảng (chưa có CSDL).</p>
<ul><li><code>GET /api/products</code> → <code>200</code> và cả mảng dạng JSON.</li>
<li><code>GET /api/products/:id</code> → <code>200</code> và sản phẩm có <code>id</code> khớp, hoặc <code>404</code> với <code>{ "error": "Product not found" }</code>.</li></ul>
<p>Kết thúc bằng <code>module.exports = app;</code> — máy chấm (như Supertest trong dự án thật) gửi request vào app được export thay vì vào một cổng: <code>await app.inject({ method: 'GET', url: '/api/products/2' })</code>.</p>`,
  yc: [
    ['Create the app with <code>express()</code> and keep the given <code>products</code> array.', 'Tạo app bằng <code>express()</code> và giữ nguyên mảng <code>products</code> cho sẵn.'],
    ['<code>GET /api/products</code> sends the array with <code>res.json()</code>.', '<code>GET /api/products</code> gửi mảng bằng <code>res.json()</code>.'],
    ['<code>GET /api/products/:id</code> finds the product by id. Remember: <code>req.params.id</code> is a <b>string</b>.', '<code>GET /api/products/:id</code> tìm sản phẩm theo id. Nhớ: <code>req.params.id</code> là <b>chuỗi</b>.'],
    ['Unknown id ⇒ <code>404</code> + <code>{ error: "Product not found" }</code>. Use <code>return</code> so nothing else is sent.', 'Id không có ⇒ <code>404</code> + <code>{ error: "Product not found" }</code>. Dùng <code>return</code> để không gửi thêm gì.'],
    ['Export the app: <code>module.exports = app;</code> (do not call <code>app.listen</code> in this file).', 'Export app: <code>module.exports = app;</code> (không gọi <code>app.listen</code> trong tệp này).'],
  ],
  dauVao: ['HTTP requests sent by the grader to the exported app.', 'Request HTTP máy chấm gửi vào app được export.'],
  dauRa: ['Status code + JSON body.', 'Mã trạng thái + thân JSON.'],
  viDu: [
    ['GET /api/products/2', '200 {"id":2,"name":"Pen","price":2}', 'The id in the URL is the string "2"; convert it before comparing with the number 2.', 'Id trên URL là chuỗi "2"; đổi kiểu trước khi so với số 2.'],
    ['GET /api/products/99', '404 {"error":"Product not found"}', 'No product has id 99.', 'Không sản phẩm nào có id 99.'],
  ],
  goiY: [
    ['Two routes: <code>app.get(\'/api/products\', …)</code> and <code>app.get(\'/api/products/:id\', …)</code>.', 'Hai route: <code>app.get(\'/api/products\', …)</code> và <code>app.get(\'/api/products/:id\', …)</code>.'],
    ['<code>const id = Number(req.params.id); const p = products.find((x) => x.id === id);</code> then <code>if (!p) return res.status(404).json({ error: \'Product not found\' });</code>', '<code>const id = Number(req.params.id); const p = products.find((x) => x.id === id);</code> rồi <code>if (!p) return res.status(404).json({ error: \'Product not found\' });</code>'],
  ],
  loi: [
    ['Comparing <code>x.id === req.params.id</code>: a number is never <code>===</code> a string, so every lookup is a 404.', 'So <code>x.id === req.params.id</code>: số không bao giờ <code>===</code> chuỗi, nên lần tìm nào cũng 404.'],
    ['Returning the lesson\'s placeholder <code>{ id, name: \'Book\' }</code> for every id — the route "works" but lies.', 'Trả mẫu giữ chỗ của bài <code>{ id, name: \'Book\' }</code> cho mọi id — route "chạy" nhưng nói sai.'],
    ['Forgetting <code>module.exports = app</code>: the file runs, but nothing outside it can reach the routes.', 'Quên <code>module.exports = app</code>: tệp chạy được nhưng bên ngoài không với tới route nào.'],
  ],
  gt: [
    'Express matched <code>/api/products/:id</code> and put the URL piece into <code>req.params.id</code> — always as a string, because a URL is text. Converting with <code>Number()</code> before comparing is the whole trick; an unknown id (or <code>abc</code>, which becomes <code>NaN</code>) finds nothing and the guard answers 404. <code>res.json()</code> sets <code>Content-Type: application/json</code> and serialises for you, which is what the raw <code>http</code> server of lesson 1.2 made you do by hand.',
    'Express khớp <code>/api/products/:id</code> và đặt mẩu URL vào <code>req.params.id</code> — luôn là chuỗi, vì URL là chữ. Đổi bằng <code>Number()</code> trước khi so là toàn bộ mẹo; id không có (hay <code>abc</code>, thành <code>NaN</code>) không tìm thấy gì và lệnh chặn trả 404. <code>res.json()</code> đặt <code>Content-Type: application/json</code> và tuần tự hoá giúp bạn — việc mà server <code>http</code> thô ở bài 1.2 bắt bạn làm tay.',
  ],
  kn: ['express', 'routing', 'route params'],
  tns: [tn('route parameter', 'tham số đường dẫn', ':id trong URL ⇒ req.params.id (chuỗi)'), tn('handler', 'hàm xử lý', '(req, res) => { … } chạy khi route khớp')],
  dau: J`const express = require('express');
const app = express();

${SAN_PHAM}

app.get('/api/products', (req, res) => {
  res.json(products);
});

// starter from the lesson: it always answers the same thing
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, name: 'Book' });
});

// export the app so it can be tested
`,
  giai: J`const express = require('express');
const app = express();

${SAN_PHAM}

// GET /api/products → the whole list (res.json sets Content-Type and serialises)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id → one product, or 404
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);            // req.params.id is ALWAYS a string ("2")
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });   // return ⇒ nothing else is sent
  }
  res.json(product);
});

module.exports = app;   // the tests (and bin/www in a generated app) import the app from here
`,
  cases: [
    { goi: `typeof module.exports.inject === 'function' && typeof module.exports.get === 'function'`, moTa: ['The file exports the Express app (module.exports = app)', 'Tệp export app Express (module.exports = app)'] },
    { goi: `__res(await module.exports.inject({ method: 'GET', url: '/api/products' }))`, moTa: ['GET /api/products → 200 + the array', 'GET /api/products → 200 + cả mảng'] },
    { goi: `__res(await module.exports.inject({ method: 'GET', url: '/api/products/2' }))`, moTa: ['GET /api/products/2 → the Pen', 'GET /api/products/2 → cây bút (Pen)'] },
    { goi: `__res(await module.exports.inject({ method: 'GET', url: '/api/products/99' }))`, moTa: ['GET /api/products/99 → 404 + error JSON', 'GET /api/products/99 → 404 + JSON lỗi'] },
    { goi: `__res(await module.exports.inject({ method: 'GET', url: '/api/products/3' }))`, an: true },
    { goi: `__res(await module.exports.inject({ method: 'GET', url: '/api/products/abc' }))`, an: true },
    { goi: `(await module.exports.inject({ method: 'GET', url: '/api/products/1' })).headers['content-type']`, an: true },
  ],
});

/* ── 2 ── */
const E2 = bai({
  ten: 'One router per resource: full CRUD on /api/products', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Organise the API the way the lesson recommends: one <code>express.Router()</code> for the <i>products</i> resource with its five routes, mounted with <code>app.use('/api/products', router)</code>. Data stays in memory.</p>
<table><thead><tr><th>Route</th><th>Success</th><th>Failure</th></tr></thead><tbody>
<tr><td><code>GET /</code></td><td>200 + array</td><td>—</td></tr>
<tr><td><code>GET /:id</code></td><td>200 + product</td><td>404 <code>{ error: "Product not found" }</code></td></tr>
<tr><td><code>POST /</code></td><td>201 + the new product <code>{ id, name, price }</code> (next id = biggest id + 1)</td><td>400 <code>{ error: "name and price required" }</code> when <code>name</code> is missing/empty or <code>price</code> is not a number</td></tr>
<tr><td><code>PUT /:id</code></td><td>200 + updated product (only <code>name</code>/<code>price</code> change)</td><td>404 as above</td></tr>
<tr><td><code>DELETE /:id</code></td><td>204, empty body</td><td>404 as above</td></tr></tbody></table>`,
  vi: J`<p>Tổ chức API đúng như bài khuyên: một <code>express.Router()</code> cho tài nguyên <i>products</i> với năm route, gắn bằng <code>app.use('/api/products', router)</code>. Dữ liệu ở trong bộ nhớ.</p>
<table><thead><tr><th>Route</th><th>Thành công</th><th>Thất bại</th></tr></thead><tbody>
<tr><td><code>GET /</code></td><td>200 + mảng</td><td>—</td></tr>
<tr><td><code>GET /:id</code></td><td>200 + sản phẩm</td><td>404 <code>{ error: "Product not found" }</code></td></tr>
<tr><td><code>POST /</code></td><td>201 + sản phẩm mới <code>{ id, name, price }</code> (id kế tiếp = id lớn nhất + 1)</td><td>400 <code>{ error: "name and price required" }</code> khi thiếu/rỗng <code>name</code> hoặc <code>price</code> không phải số</td></tr>
<tr><td><code>PUT /:id</code></td><td>200 + sản phẩm đã sửa (chỉ đổi <code>name</code>/<code>price</code>)</td><td>404 như trên</td></tr>
<tr><td><code>DELETE /:id</code></td><td>204, thân rỗng</td><td>404 như trên</td></tr></tbody></table>`,
  yc: [
    ['Put the five routes on <code>const router = express.Router()</code>, paths relative to the mount point (<code>/</code>, <code>/:id</code>).', 'Đặt năm route trên <code>const router = express.Router()</code>, đường dẫn tương đối với điểm gắn (<code>/</code>, <code>/:id</code>).'],
    ['Add <code>app.use(express.json())</code> <b>before</b> mounting the router, then <code>app.use(\'/api/products\', router)</code>.', 'Thêm <code>app.use(express.json())</code> <b>trước</b> khi gắn router, rồi <code>app.use(\'/api/products\', router)</code>.'],
    ['Validate POST: <code>name</code> a non-empty string, <code>price</code> a number (<code>typeof price === \'number\'</code>).', 'Kiểm tra POST: <code>name</code> là chuỗi không rỗng, <code>price</code> là số (<code>typeof price === \'number\'</code>).'],
    ['Copy only <code>name</code> and <code>price</code> from the body — a client must not be able to set <code>id</code>.', 'Chỉ chép <code>name</code> và <code>price</code> từ body — client không được tự đặt <code>id</code>.'],
    ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>'],
  ],
  viDu: [
    ['POST /api/products  {"name":"Ruler","price":3}', '201 {"id":4,"name":"Ruler","price":3}', 'Biggest id is 3, so the new one gets 4.', 'Id lớn nhất là 3 nên sản phẩm mới nhận 4.'],
    ['DELETE /api/products/2', '204 (no body)', 'Then GET /api/products/2 is a 404.', 'Sau đó GET /api/products/2 là 404.'],
  ],
  goiY: [
    ['Without <code>express.json()</code>, <code>req.body</code> is <code>undefined</code> and <code>req.body.name</code> throws a TypeError → 500.', 'Không có <code>express.json()</code> thì <code>req.body</code> là <code>undefined</code> và <code>req.body.name</code> ném TypeError → 500.'],
    ['A tiny helper avoids repeating the lookup: <code>const find = (id) => products.find((p) => p.id === Number(id));</code>', 'Một hàm nhỏ tránh lặp phần tìm: <code>const find = (id) => products.find((p) => p.id === Number(id));</code>'],
    ['Delete with <code>products.splice(products.indexOf(p), 1)</code> and answer <code>res.status(204).end()</code> (or <code>res.sendStatus(204)</code>).', 'Xoá bằng <code>products.splice(products.indexOf(p), 1)</code> và trả <code>res.status(204).end()</code> (hoặc <code>res.sendStatus(204)</code>).'],
  ],
  loi: [
    ['Mounting the router BEFORE <code>app.use(express.json())</code>: the routes run first and see <code>req.body === undefined</code>.', 'Gắn router TRƯỚC <code>app.use(express.json())</code>: route chạy trước và thấy <code>req.body === undefined</code>.'],
    ['Writing <code>router.get(\'/api/products/:id\')</code> inside a router mounted at <code>/api/products</code> — the real path becomes <code>/api/products/api/products/:id</code>.', 'Viết <code>router.get(\'/api/products/:id\')</code> trong router đã gắn ở <code>/api/products</code> — đường thật thành <code>/api/products/api/products/:id</code>.'],
    ['<code>products.push(req.body)</code>: the client can send <code>"id": 1</code> and create a duplicate id.', '<code>products.push(req.body)</code>: client gửi <code>"id": 1</code> là tạo được id trùng.'],
    ['<code>if (!price)</code> rejects a valid price of <code>0</code> — check the type instead.', '<code>if (!price)</code> từ chối giá hợp lệ <code>0</code> — hãy kiểm kiểu.'],
  ],
  gt: [
    'The router only knows paths relative to where it is mounted, so the same file can move to <code>/api/v2/products</code> without edits. <code>express.json()</code> must run before the router because middleware runs top to bottom. The new id is computed from the data (biggest + 1), and the body is copied field by field so a client cannot choose its own id — the first "never trust the client" rule of the course. 204 means "done, nothing to show", so it has no body.',
    'Router chỉ biết đường dẫn tương đối với chỗ nó được gắn, nên cùng tệp đó chuyển sang <code>/api/v2/products</code> mà không phải sửa. <code>express.json()</code> phải chạy trước router vì middleware chạy từ trên xuống. Id mới tính từ dữ liệu (lớn nhất + 1), và body được chép từng trường nên client không chọn được id — luật "đừng tin client" đầu tiên của môn. 204 nghĩa là "xong, không có gì để xem", nên không có thân.',
  ],
  kn: ['express.Router', 'CRUD', 'express.json'],
  tns: [tn('mount path', 'đường gắn', 'app.use(\'/api/products\', router) — router thấy đường dẫn đã bỏ phần này'), tn('body parser', 'bộ đọc thân request', 'express.json() biến chuỗi JSON thành req.body')],
  dau: J`const express = require('express');
const app = express();

${SAN_PHAM}

const router = express.Router();

router.get('/', (req, res) => res.json(products));

router.get('/:id', (req, res) => {
  const p = products.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

router.post('/', (req, res) => {
  const product = { id: products.length + 1, ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// PUT /:id and DELETE /:id are still missing

app.use('/api/products', router);
module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();

${SAN_PHAM}

const router = express.Router();
const find = (id) => products.find((p) => p.id === Number(id));   // params are strings
const notFound = (res) => res.status(404).json({ error: 'Product not found' });

router.get('/', (req, res) => res.json(products));

router.get('/:id', (req, res) => {
  const p = find(req.params.id);
  if (!p) return notFound(res);
  res.json(p);
});

router.post('/', (req, res) => {
  const { name, price } = req.body;                       // copy ONLY the fields we accept
  if (typeof name !== 'string' || !name.trim() || typeof price !== 'number') {
    return res.status(400).json({ error: 'name and price required' });
  }
  const id = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;   // biggest id + 1
  const product = { id, name, price };
  products.push(product);
  res.status(201).json(product);                          // 201 Created
});

router.put('/:id', (req, res) => {
  const p = find(req.params.id);
  if (!p) return notFound(res);
  const { name, price } = req.body;
  if (name !== undefined) p.name = name;
  if (price !== undefined) p.price = price;
  res.json(p);
});

router.delete('/:id', (req, res) => {
  const p = find(req.params.id);
  if (!p) return notFound(res);
  products.splice(products.indexOf(p), 1);
  res.status(204).end();                                  // 204: success, empty body
});

app.use(express.json());              // BEFORE the router: middleware runs top to bottom
app.use('/api/products', router);     // the router sees '/' and '/:id'
module.exports = app;
`,
  chuanBi: `const app = module.exports; const go = async (method, url, body) => __res(await app.inject({ method, url, body }));`,
  cases: [
    { goi: `await go('POST', '/api/products', { name: 'Ruler', price: 3 })`, moTa: ['POST creates a product → 201 with id 4', 'POST tạo sản phẩm → 201 với id 4'] },
    { goi: `await go('POST', '/api/products', { price: 3 })`, moTa: ['POST without name → 400', 'POST thiếu name → 400'] },
    { goi: `[await go('PUT', '/api/products/1', { price: 30 }), await go('GET', '/api/products/1')]`, moTa: ['PUT /1 changes the price', 'PUT /1 đổi giá'] },
    { goi: `[await go('DELETE', '/api/products/2'), await go('GET', '/api/products/2')]`, moTa: ['DELETE /2 → 204, then GET /2 → 404', 'DELETE /2 → 204, rồi GET /2 → 404'] },
    { goi: `[await go('DELETE', '/api/products/1'), await go('POST', '/api/products', { name: 'Clip', price: 1 }), await go('POST', '/api/products', { name: 'Tape', price: 4 })]`, an: true, moTa: ['Ids come from the data (biggest + 1), not from the array length', 'Id tính từ dữ liệu (lớn nhất + 1), không từ độ dài mảng'] },
    { goi: `await go('POST', '/api/products', { id: 1, name: 'Hack', price: 9 })`, an: true },
    { goi: `[await go('PUT', '/api/products/42', { price: 1 }), await go('DELETE', '/api/products/42')]`, an: true },
    { goi: `[await go('POST', '/api/products', { name: 'Free sample', price: 0 }), await go('POST', '/api/products', { name: 'Bad', price: '3' }), await go('POST', '/api/products', { name: '   ', price: 3 })]`, an: true },
  ],
});

/* ── 3 ── */
const E3 = bai({
  ten: 'The route-order bug: /search must come before /:id', kho: 'MEDIUM', phut: 12, lib: ['express'],
  en: J`<p>A teammate added a search route and it "never works": <code>GET /api/products/search?q=bo</code> always answers <code>404 Product not found</code>. Express tries routes <b>in the order they were declared</b> and <code>/:id</code> also matches <code>/search</code> (with <code>id = "search"</code>).</p>
<p>Fix the app so that:</p>
<ul><li><code>GET /api/products/search?q=…</code> → <code>200</code> + the products whose name contains <code>q</code>, <b>case-insensitive</b> (<code>"bo"</code> matches <i>Book</i> and <i>Notebook</i>);</li>
<li>missing or empty <code>q</code> → <code>400</code> <code>{ error: "q is required" }</code>;</li>
<li><code>GET /api/products/:id</code> keeps working exactly as before.</li></ul>`,
  vi: J`<p>Một bạn cùng nhóm thêm route tìm kiếm và nó "không bao giờ chạy": <code>GET /api/products/search?q=bo</code> luôn trả <code>404 Product not found</code>. Express thử các route <b>theo thứ tự khai báo</b> và <code>/:id</code> cũng khớp <code>/search</code> (với <code>id = "search"</code>).</p>
<p>Sửa app để:</p>
<ul><li><code>GET /api/products/search?q=…</code> → <code>200</code> + các sản phẩm có tên chứa <code>q</code>, <b>không phân biệt hoa thường</b> (<code>"bo"</code> khớp <i>Book</i> và <i>Notebook</i>);</li>
<li>thiếu hoặc rỗng <code>q</code> → <code>400</code> <code>{ error: "q is required" }</code>;</li>
<li><code>GET /api/products/:id</code> vẫn chạy y như cũ.</li></ul>`,
  yc: [
    ['Declare <code>/api/products/search</code> <b>before</b> <code>/api/products/:id</code>.', 'Khai báo <code>/api/products/search</code> <b>trước</b> <code>/api/products/:id</code>.'],
    ['Read the text from <code>req.query.q</code> (query values are strings, or <code>undefined</code>).', 'Đọc chữ từ <code>req.query.q</code> (giá trị query là chuỗi, hoặc <code>undefined</code>).'],
    ['Compare in lower case: <code>p.name.toLowerCase().includes(q.toLowerCase())</code>.', 'So ở chữ thường: <code>p.name.toLowerCase().includes(q.toLowerCase())</code>.'],
    ['No match is not an error: answer <code>200</code> with <code>[]</code>.', 'Không khớp không phải lỗi: trả <code>200</code> với <code>[]</code>.'],
  ],
  viDu: [
    ['GET /api/products/search?q=bo', '200 [{"id":1,"name":"Book","price":25},{"id":3,"name":"Notebook","price":5}]', 'Case-insensitive "contains".', '"Chứa" không phân biệt hoa thường.'],
    ['GET /api/products/search', '400 {"error":"q is required"}', 'No q at all.', 'Không có q.'],
  ],
  goiY: [
    ['Moving one block of code above the other is the whole fix for the 404.', 'Đưa một khối mã lên trên khối kia là toàn bộ cách sửa lỗi 404.'],
    ['<code>const q = (req.query.q || \'\').trim(); if (!q) return res.status(400).json({ error: \'q is required\' });</code>', '<code>const q = (req.query.q || \'\').trim(); if (!q) return res.status(400).json({ error: \'q is required\' });</code>'],
  ],
  loi: [
    ['Keeping <code>/:id</code> first and adding <code>if (req.params.id === \'search\')</code> inside it — it works, but every new fixed path needs another special case.', 'Giữ <code>/:id</code> ở trước rồi thêm <code>if (req.params.id === \'search\')</code> bên trong — chạy được, nhưng mỗi đường cố định mới lại cần thêm một ngoại lệ.'],
    ['Case-sensitive search: <code>"bo"</code> finds <i>Notebook</i> but not <i>Book</i>.', 'Tìm phân biệt hoa thường: <code>"bo"</code> thấy <i>Notebook</i> nhưng không thấy <i>Book</i>.'],
    ['Answering 404 for "no results" — the search worked, it just found nothing.', 'Trả 404 cho "không có kết quả" — tìm kiếm vẫn chạy đúng, chỉ là không thấy gì.'],
  ],
  gt: [
    'Express walks its route list top to bottom and stops at the first match. <code>/:id</code> matches ANY single segment, so a fixed path such as <code>/search</code> placed after it is unreachable. Rule: <b>specific paths first, parameter paths last</b>. The query string is parsed into <code>req.query</code> as strings; a missing <code>q</code> is <code>undefined</code>, hence <code>(req.query.q || \'\')</code>.',
    'Express đi danh sách route từ trên xuống và dừng ở chỗ khớp đầu tiên. <code>/:id</code> khớp MỌI đoạn đơn, nên đường cố định như <code>/search</code> đặt sau nó là không bao giờ tới được. Luật: <b>đường cụ thể trước, đường có tham số sau</b>. Query string được tách vào <code>req.query</code> dạng chuỗi; thiếu <code>q</code> là <code>undefined</code>, nên mới có <code>(req.query.q || \'\')</code>.',
  ],
  kn: ['route order', 'req.query'],
  tns: [tn('query string', 'chuỗi truy vấn', '?q=bo&page=2 ⇒ req.query'), tn('first match wins', 'khớp đầu tiên thắng')],
  dau: J`const express = require('express');
const app = express();

${SAN_PHAM}

app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.get('/api/products/search', (req, res) => {
  const q = req.query.q;
  res.json(products.filter((p) => p.name.includes(q)));
});

module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();

${SAN_PHAM}

// 1) the SPECIFIC path first — otherwise '/:id' swallows '/search' (id = "search")
app.get('/api/products/search', (req, res) => {
  const q = (req.query.q || '').trim();               // query values are strings or undefined
  if (!q) return res.status(400).json({ error: 'q is required' });
  const needle = q.toLowerCase();
  const found = products.filter((p) => p.name.toLowerCase().includes(needle));
  res.json(found);                                     // [] is a valid answer: 200, not 404
});

// 2) the parameter path last
app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

module.exports = app;
`,
  chuanBi: `const go = async (url) => __res(await module.exports.inject({ url }));`,
  cases: [
    { goi: `await go('/api/products/search?q=bo')`, moTa: ['search?q=bo → Book and Notebook', 'search?q=bo → Book và Notebook'] },
    { goi: `await go('/api/products/search')`, moTa: ['search without q → 400', 'search không có q → 400'] },
    { goi: `await go('/api/products/2')`, moTa: ['/:id still works', '/:id vẫn chạy'] },
    { goi: `await go('/api/products/search?q=PEN')`, an: true },
    { goi: `await go('/api/products/search?q=zzz')`, an: true },
    { goi: `[await go('/api/products/search?q='), await go('/api/products/search?q=%20%20')]`, an: true },
    { goi: `await go('/api/products/7')`, an: true },
  ],
});

/* ── 4 ── */
const E4 = bai({
  ten: 'Query strings: filter by price, sort and paginate', kho: 'HARD', phut: 25, lib: ['express'],
  en: J`<p><code>GET /api/products</code> now accepts optional query parameters. Answer <code>200</code> with <code>{ page, limit, total, items }</code>:</p>
<ul><li><code>minPrice</code>, <code>maxPrice</code> — keep products with <code>minPrice ≤ price ≤ maxPrice</code>;</li>
<li><code>sort</code> — <code>price</code> (ascending) or <code>-price</code> (descending); absent ⇒ keep the original order;</li>
<li><code>page</code> (default 1) and <code>limit</code> (default 2) — <code>items</code> is that page of the filtered + sorted list, <code>total</code> is how many matched before paging.</li></ul>
<p>Any of <code>minPrice, maxPrice, page, limit</code> that is present but not a number, or <code>page/limit &lt; 1</code>, or a <code>sort</code> other than the two values ⇒ <code>400</code> <code>{ error: "Invalid query: &lt;name&gt;" }</code> naming the <b>first</b> bad parameter in the order <code>minPrice, maxPrice, sort, page, limit</code>.</p>`,
  vi: J`<p><code>GET /api/products</code> giờ nhận thêm tham số query tuỳ chọn. Trả <code>200</code> với <code>{ page, limit, total, items }</code>:</p>
<ul><li><code>minPrice</code>, <code>maxPrice</code> — giữ sản phẩm có <code>minPrice ≤ price ≤ maxPrice</code>;</li>
<li><code>sort</code> — <code>price</code> (tăng dần) hoặc <code>-price</code> (giảm dần); vắng ⇒ giữ thứ tự gốc;</li>
<li><code>page</code> (mặc định 1) và <code>limit</code> (mặc định 2) — <code>items</code> là trang đó của danh sách đã lọc + sắp, <code>total</code> là số khớp trước khi chia trang.</li></ul>
<p>Bất kỳ <code>minPrice, maxPrice, page, limit</code> nào có mặt mà không phải số, hoặc <code>page/limit &lt; 1</code>, hoặc <code>sort</code> khác hai giá trị trên ⇒ <code>400</code> <code>{ error: "Invalid query: &lt;tên&gt;" }</code> nêu tham số sai <b>đầu tiên</b> theo thứ tự <code>minPrice, maxPrice, sort, page, limit</code>.</p>`,
  yc: [
    ['Every value in <code>req.query</code> is a <b>string</b>: convert with <code>Number()</code> and check <code>Number.isNaN</code>.', 'Mọi giá trị trong <code>req.query</code> là <b>chuỗi</b>: đổi bằng <code>Number()</code> và kiểm <code>Number.isNaN</code>.'],
    ['Filter first, then sort a <b>copy</b> (do not reorder the original array), then slice the page.', 'Lọc trước, rồi sắp một <b>bản sao</b> (không đảo mảng gốc), rồi cắt trang.'],
    ['<code>page</code> and <code>limit</code> in the answer are numbers, not strings.', '<code>page</code> và <code>limit</code> trong kết quả là số, không phải chuỗi.'],
  ],
  viDu: [
    ['GET /api/products?minPrice=3&sort=-price', '200 {"page":1,"limit":2,"total":3,"items":[{"id":5,"name":"Lamp","price":40},{"id":1,"name":"Book","price":25}]}', 'Three products cost ≥ 3; the first page of 2, most expensive first.', 'Ba sản phẩm giá ≥ 3; trang đầu gồm 2, đắt nhất trước.'],
    ['GET /api/products?limit=abc', '400 {"error":"Invalid query: limit"}', '"abc" is not a number.', '"abc" không phải số.'],
  ],
  goiY: [
    ['Write a small reader: <code>const num = (name, def) => { const raw = req.query[name]; if (raw === undefined) return def; const n = Number(raw); return Number.isNaN(n) ? null : n; };</code>', 'Viết một hàm đọc nhỏ: <code>const num = (name, def) => { const raw = req.query[name]; if (raw === undefined) return def; const n = Number(raw); return Number.isNaN(n) ? null : n; };</code>'],
    ['Paging: <code>items = list.slice((page - 1) * limit, page * limit)</code>.', 'Chia trang: <code>items = list.slice((page - 1) * limit, page * limit)</code>.'],
    ['<code>[...list].sort((a, b) => a.price - b.price)</code> sorts a copy; flip the sign for <code>-price</code>.', '<code>[...list].sort((a, b) => a.price - b.price)</code> sắp một bản sao; đổi dấu cho <code>-price</code>.'],
  ],
  loi: [
    ['Comparing strings: <code>p.price >= req.query.minPrice</code> compares a number with <code>"3"</code> — it happens to work, but <code>"100" < "20"</code> as strings breaks the next comparison you write.', 'So chuỗi: <code>p.price >= req.query.minPrice</code> so số với <code>"3"</code> — tình cờ chạy, nhưng <code>"100" < "20"</code> khi là chuỗi sẽ phá phép so tiếp theo bạn viết.'],
    ['<code>products.sort(…)</code> sorts the shared array in place: the next request without <code>sort</code> comes back in the wrong order.', '<code>products.sort(…)</code> sắp tại chỗ mảng dùng chung: request sau không có <code>sort</code> trả về sai thứ tự.'],
    ['Returning <code>"page": "2"</code> (a string) because it was copied straight from the query.', 'Trả <code>"page": "2"</code> (chuỗi) vì chép thẳng từ query.'],
  ],
  gt: [
    'The query string is text, so the handler converts each parameter once, validates it, and only then uses it. Filtering before paging makes <code>total</code> meaningful for a pager in React ("page 2 of 2"). Sorting a copy keeps the in-memory "database" in its natural order for the next request — a bug that never shows up in a single Postman call and always shows up in a demo.',
    'Query string là chữ, nên handler đổi kiểu mỗi tham số một lần, kiểm tra, rồi mới dùng. Lọc trước khi chia trang làm <code>total</code> có nghĩa cho thanh phân trang ở React ("trang 2 / 2"). Sắp trên bản sao giữ "CSDL" trong bộ nhớ đúng thứ tự gốc cho request sau — lỗi không bao giờ lộ trong một lần gọi Postman và luôn lộ khi demo.',
  ],
  kn: ['req.query', 'pagination', 'validation'],
  tns: [tn('pagination', 'phân trang', 'page + limit ⇒ slice'), tn('in place', 'tại chỗ', 'sort() sửa chính mảng đó')],
  dau: J`const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'Book', price: 25 },
  { id: 2, name: 'Pen', price: 2 },
  { id: 3, name: 'Notebook', price: 5 },
  { id: 4, name: 'Eraser', price: 1 },
  { id: 5, name: 'Lamp', price: 40 },
];

app.get('/api/products', (req, res) => {
  const { minPrice, maxPrice, sort, page = 1, limit = 2 } = req.query;
  let list = products.filter((p) => (!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice));
  if (sort === 'price') list = list.sort((a, b) => a.price - b.price);
  const items = list.slice((page - 1) * limit, page * limit);
  res.json({ page, limit, total: list.length, items });
});

module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'Book', price: 25 },
  { id: 2, name: 'Pen', price: 2 },
  { id: 3, name: 'Notebook', price: 5 },
  { id: 4, name: 'Eraser', price: 1 },
  { id: 5, name: 'Lamp', price: 40 },
];

app.get('/api/products', (req, res) => {
  // every value in req.query is a STRING (or undefined) — convert once, validate, then use
  const num = (name, def) => {
    const raw = req.query[name];
    if (raw === undefined) return def;
    const n = Number(raw);
    return raw.trim() === '' || Number.isNaN(n) ? null : n;     // null = invalid
  };
  const bad = (name) => res.status(400).json({ error: 'Invalid query: ' + name });

  const minPrice = num('minPrice', -Infinity);
  if (minPrice === null) return bad('minPrice');
  const maxPrice = num('maxPrice', Infinity);
  if (maxPrice === null) return bad('maxPrice');
  const sort = req.query.sort;
  if (sort !== undefined && sort !== 'price' && sort !== '-price') return bad('sort');
  const page = num('page', 1);
  if (page === null || page < 1) return bad('page');
  const limit = num('limit', 2);
  if (limit === null || limit < 1) return bad('limit');

  let list = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);   // 1. filter
  if (sort) {
    const dir = sort === '-price' ? -1 : 1;
    list = [...list].sort((a, b) => dir * (a.price - b.price));                     // 2. sort a COPY
  }
  const items = list.slice((page - 1) * limit, page * limit);                       // 3. page
  res.json({ page, limit, total: list.length, items });
});

module.exports = app;
`,
  chuanBi: `const go = async (url) => __res(await module.exports.inject({ url }));`,
  cases: [
    { goi: `await go('/api/products?minPrice=3&sort=-price')`, moTa: ['minPrice=3&sort=-price → first page, most expensive first', 'minPrice=3&sort=-price → trang đầu, đắt nhất trước'] },
    { goi: `await go('/api/products?limit=abc')`, moTa: ['limit=abc → 400 naming limit', 'limit=abc → 400 nêu limit'] },
    { goi: `await go('/api/products?sort=price&page=2&limit=2')`, moTa: ['sort=price&page=2 → the 3rd and 4th cheapest, page/limit are numbers', 'sort=price&page=2 → món rẻ thứ 3 và 4, page/limit là số'] },
    { goi: `[await go('/api/products?sort=-price&limit=1'), await go('/api/products?limit=5')]`, an: true, moTa: ['Sorting must not reorder the shared array', 'Sắp xếp không được đảo mảng dùng chung'] },
    { goi: `await go('/api/products?minPrice=2&maxPrice=25&limit=10')`, an: true },
    { goi: `[await go('/api/products?sort=name'), await go('/api/products?page=0'), await go('/api/products?maxPrice=x&page=0')]`, an: true },
    { goi: `await go('/api/products?minPrice=100')`, an: true },
  ],
});

/* ── 5 ── */
const E5 = cs({
  ten: 'Express basics and the Express Generator skeleton', kho: 'EASY', phut: 8,
  en: 'Questions on the routing part of the lesson and on what <code>npx express-generator --view=ejs myapp</code> creates (checked by running express-generator 4 on 08/11/2026).',
  vi: 'Câu hỏi về phần routing của bài và về những gì <code>npx express-generator --view=ejs myapp</code> tạo ra (đã kiểm bằng cách chạy express-generator 4 ngày 08/11/2026).',
  cau: [
    q('g1', ['In a generated app, which file creates the HTTP server and calls <code>listen</code>?', 'Trong app sinh ra, tệp nào tạo HTTP server và gọi <code>listen</code>?'],
      ['<code>bin/www</code> — it reads <code>process.env.PORT</code> (default 3000)', '<code>app.js</code> — it ends with <code>app.listen(3000)</code>', '<code>routes/index.js</code> — the first router starts the server', '<code>package.json</code> — the <code>"main"</code> field starts it'],
      ['<code>app.js</code> only builds and exports the app; <code>bin/www</code> does <code>http.createServer(app)</code> and <code>server.listen(port)</code>. That split is why the app can be imported by tests without opening a port.', '<code>app.js</code> chỉ dựng và export app; <code>bin/www</code> làm <code>http.createServer(app)</code> và <code>server.listen(port)</code>. Nhờ tách như vậy mà test import được app mà không mở cổng.']),
    q('g2', ['What does <code>npm start</code> run in a generated app?', '<code>npm start</code> chạy gì trong app sinh ra?'],
      ['<code>node ./bin/www</code>', '<code>node app.js</code>', '<code>nodemon app.js</code>', '<code>express start</code>'],
      ['The generated <code>package.json</code> has <code>"start": "node ./bin/www"</code>.', '<code>package.json</code> sinh ra có <code>"start": "node ./bin/www"</code>.']),
    qn('g3', ['Which folders/files does <code>--view=ejs</code> generate? (choose all)', '<code>--view=ejs</code> sinh ra những thư mục/tệp nào? (chọn hết)'],
      ['<code>routes/</code> with <code>index.js</code> and <code>users.js</code>', '<code>views/</code> with <code>index.ejs</code> and <code>error.ejs</code>', '<code>public/</code> (stylesheets) served by <code>express.static</code>', '<code>models/</code> with a Mongoose schema', '<code>controllers/</code> for the MVC layer'],
      [0, 1, 2],
      ['The generator knows nothing about your database or layers: <code>models/</code>, <code>controllers/</code> and <code>services/</code> are yours to add (Chapter 4).', 'Generator không biết gì về CSDL hay các tầng của bạn: <code>models/</code>, <code>controllers/</code>, <code>services/</code> là phần bạn tự thêm (Chương 4).']),
    q('g4', ['<code>app.get(\'/api/products/:id\', …)</code> receives <code>GET /api/products/42</code>. What is <code>req.params.id</code>?', '<code>app.get(\'/api/products/:id\', …)</code> nhận <code>GET /api/products/42</code>. <code>req.params.id</code> là gì?'],
      ['The string <code>"42"</code>', 'The number <code>42</code>', '<code>{ id: 42 }</code>', '<code>undefined</code> until <code>express.json()</code> runs'],
      ['Path parameters come from the URL, which is text. Convert with <code>Number()</code> before comparing with numeric ids.', 'Tham số đường dẫn lấy từ URL, mà URL là chữ. Đổi bằng <code>Number()</code> trước khi so với id kiểu số.']),
    q('g5', ['A POST route reads <code>req.body.name</code> and crashes with "Cannot read properties of undefined". Most likely cause?', 'Một route POST đọc <code>req.body.name</code> và sập với "Cannot read properties of undefined". Nguyên nhân khả dĩ nhất?'],
      ['<code>app.use(express.json())</code> is missing or placed after the route', 'The client used PUT instead of POST', 'The route path must end with a slash', 'Express only parses bodies on <code>app.post</code> inside a Router'],
      ['Without a body parser Express leaves <code>req.body</code> undefined. Put <code>express.json()</code> before the routes.', 'Không có bộ đọc body thì Express để <code>req.body</code> là undefined. Đặt <code>express.json()</code> trước các route.']),
    q('g6', ['Why does <code>res.json(obj)</code> replace three lines of the raw <code>http</code> server?', 'Vì sao <code>res.json(obj)</code> thay được ba dòng của server <code>http</code> thô?'],
      ['It sets <code>Content-Type: application/json</code>, serialises with <code>JSON.stringify</code> and ends the response', 'It compresses the body and caches it for the next request', 'It validates the object against a schema before sending', 'It retries the response if the client disconnects'],
      ['The raw server needed <code>writeHead(200, { \'Content-Type\': … })</code> + <code>JSON.stringify</code> + <code>end</code>. <code>res.status(code)</code> is the only extra call you still make.', 'Server thô cần <code>writeHead(200, { \'Content-Type\': … })</code> + <code>JSON.stringify</code> + <code>end</code>. <code>res.status(code)</code> là lời gọi thêm duy nhất bạn còn phải viết.']),
  ],
  goiY: [['Think about which file is imported and which file is executed.', 'Nghĩ xem tệp nào được import và tệp nào được chạy.'], ['A URL is text.', 'URL là chữ.']],
  loi: [['Believing app.js starts the server in a generated app.', 'Tin rằng app.js khởi động server trong app sinh ra.'], ['Expecting the generator to create models/controllers.', 'Tưởng generator tạo models/controllers.']],
  tns: [tn('scaffold', 'dựng khung', 'tạo sẵn cấu trúc thư mục + mã mẫu'), tn('Express Generator', 'bộ sinh app Express', 'npx express-generator')],
  kn: ['express-generator', 'express'],
});

export default doiDau({
  slug: 'sdn302-2-1-express-routing',
  ten: '2.1 Express routing & your first app',
  khoa: KHOA,
  baiHoc: 'sdn302-2-1-express-routing',
  de: [E1, E5, E2, E3, E4],
});
