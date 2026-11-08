/** SDN302 · 1.2 — API, HTTP & server Node đầu tiên: giải phẫu request/response, server http thô, URL + query, đọc body từng mẩu, ngữ nghĩa phương thức REST. */
import { doiDau, KHOA, bai, cs, q, qn, bang1, tn } from './_sdn.mjs';

const J = String.raw;

/* ── 1 ── table */
const M = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const S = ['200', '201', '204', '400', '401', '404'];
const E1 = cs({
  ten: 'Anatomy of a request: method and status for each intention', kho: 'EASY', phut: 8, loai: 'table',
  en: 'For each thing the React app wants to do, choose the HTTP method and the status code of the <b>successful</b> (or described) answer — the vocabulary of the lesson\'s anatomy table.',
  vi: 'Với mỗi việc app React muốn làm, chọn phương thức HTTP và mã trạng thái của câu trả lời <b>thành công</b> (hoặc như mô tả) — từ vựng của bảng giải phẫu trong bài.',
  bang: [
    bang1('t1', ['Intention → method + status', 'Ý định → phương thức + mã'],
      [{ ma: 'viec', ten: 'Intention' }, { ma: 'm', ten: 'Method', luaChon: M }, { ma: 's', ten: 'Status', luaChon: S }],
      [
        { o: { viec: 'Read the list of products' }, a: { m: 'GET', s: '200' } },
        { o: { viec: 'Create a product from a JSON body' }, a: { m: 'POST', s: '201' } },
        { o: { viec: 'Replace product 42 with a full new version' }, a: { m: 'PUT', s: '200' } },
        { o: { viec: 'Change only the price of product 42' }, a: { m: 'PATCH', s: '200' } },
        { o: { viec: 'Remove product 42 (nothing to send back)' }, a: { m: 'DELETE', s: '204' } },
        { o: { viec: 'Read product 999, which does not exist' }, a: { m: 'GET', s: '404' } },
        { o: { viec: 'Create a product but the body has no name' }, a: { m: 'POST', s: '400' } },
        { o: { viec: 'Read /api/me without sending a token' }, a: { m: 'GET', s: '401' } },
      ],
      ['GET reads, POST creates (201 Created), PUT replaces, PATCH changes part, DELETE removes (204 = success with an empty body). The failure rows reuse the method of the attempt: the status code says what went wrong.', 'GET đọc, POST tạo (201 Created), PUT thay toàn bộ, PATCH sửa một phần, DELETE xoá (204 = thành công, thân rỗng). Các hàng thất bại giữ phương thức của lần thử: mã trạng thái nói cái gì sai.']),
  ],
  goiY: [['Read the verb of the intention: read / create / replace / change / remove.', 'Đọc động từ của ý định: đọc / tạo / thay / sửa / xoá.'], ['Status codes: 2xx success, 4xx the client\'s fault.', 'Mã trạng thái: 2xx thành công, 4xx lỗi phía client.']],
  loi: [['Answering 200 for a create.', 'Trả 200 cho thao tác tạo.'], ['Using POST to update.', 'Dùng POST để sửa.']],
  tns: [tn('method', 'phương thức'), tn('status code', 'mã trạng thái')],
  kn: ['HTTP'],
});

/* ── 2 ── raw server */
const E2 = bai({
  ten: 'The raw Node server of the lesson: GET /api/hello', kho: 'EASY', phut: 10, lib: ['http'],
  en: J`<p>Before Express, a server is <code>http.createServer((req, res) => …)</code> and you do everything by hand. Rebuild the lesson's server and export it:</p>
<ul><li><code>GET /api/hello</code> → <code>200</code>, header <code>Content-Type: application/json</code>, body <code>{"message":"Hello Node"}</code>;</li>
<li>anything else (another path, or another method on <code>/api/hello</code>) → <code>404</code>, body <code>Not found</code>.</li></ul>
<p><code>module.exports = server;</code> — do not call <code>listen</code>; the grader sends requests with <code>await server.inject({ method, url })</code> and gets <code>{ status, headers, body }</code> (body as text, like curl).</p>`,
  vi: J`<p>Trước Express, server là <code>http.createServer((req, res) => …)</code> và bạn tự làm mọi thứ. Dựng lại server của bài và export nó:</p>
<ul><li><code>GET /api/hello</code> → <code>200</code>, header <code>Content-Type: application/json</code>, thân <code>{"message":"Hello Node"}</code>;</li>
<li>mọi thứ khác (đường khác, hoặc phương thức khác trên <code>/api/hello</code>) → <code>404</code>, thân <code>Not found</code>.</li></ul>
<p><code>module.exports = server;</code> — không gọi <code>listen</code>; máy chấm gửi request bằng <code>await server.inject({ method, url })</code> và nhận <code>{ status, headers, body }</code> (thân dạng chữ, như curl).</p>`,
  yc: [
    ['Match both <code>req.url</code> AND <code>req.method</code>.', 'Khớp cả <code>req.url</code> LẪN <code>req.method</code>.'],
    ['Send the JSON with <code>res.writeHead(200, { \'Content-Type\': \'application/json\' })</code> + <code>res.end(JSON.stringify(…))</code>.', 'Gửi JSON bằng <code>res.writeHead(200, { \'Content-Type\': \'application/json\' })</code> + <code>res.end(JSON.stringify(…))</code>.'],
    ['Every branch must end the response, or the client waits forever.', 'Mọi nhánh phải kết thúc response, nếu không client chờ mãi.'],
  ],
  viDu: [['GET /api/hello', '200  content-type: application/json  {"message":"Hello Node"}', 'The happy path.', 'Đường thuận.'], ['POST /api/hello', '404  Not found', 'Right path, wrong method.', 'Đúng đường, sai phương thức.']],
  goiY: [
    ['<code>if (req.url === \'/api/hello\' && req.method === \'GET\') { … } else { … }</code>', '<code>if (req.url === \'/api/hello\' && req.method === \'GET\') { … } else { … }</code>'],
    ['<code>res.end()</code> only accepts a string (or Buffer): pass <code>JSON.stringify(obj)</code>, not the object.', '<code>res.end()</code> chỉ nhận chuỗi (hoặc Buffer): truyền <code>JSON.stringify(obj)</code>, không truyền đối tượng.'],
  ],
  loi: [
    ['<code>res.end({ message: \'Hello Node\' })</code> — Node throws a TypeError: the chunk must be a string or Buffer.', '<code>res.end({ message: \'Hello Node\' })</code> — Node ném TypeError: chunk phải là chuỗi hoặc Buffer.'],
    ['Forgetting the Content-Type header: browsers and axios then treat the body as plain text.', 'Quên header Content-Type: trình duyệt và axios coi thân là chữ thường.'],
    ['An <code>if</code> without <code>else</code>: unknown URLs never get an answer.', '<code>if</code> không có <code>else</code>: URL lạ không bao giờ được trả lời.'],
  ],
  gt: [
    'Every part of the anatomy table is manual here: matching method + URL, writing the status and headers, serialising the body and ending the response. That is exactly the list of things <code>app.get(\'/api/hello\', (req, res) => res.json({…}))</code> does for you in lesson 2.1 — which is why seeing it once by hand makes Express easier to trust.',
    'Mọi phần của bảng giải phẫu ở đây đều làm tay: khớp phương thức + URL, ghi mã và header, tuần tự hoá thân và kết thúc response. Đó đúng là danh sách những việc <code>app.get(\'/api/hello\', (req, res) => res.json({…}))</code> làm giúp bạn ở bài 2.1 — vì vậy tự tay làm một lần giúp bạn tin Express hơn.',
  ],
  kn: ['http module'],
  tns: [tn('http.createServer', 'tạo server HTTP'), tn('res.writeHead', 'ghi dòng trạng thái + header')],
  dau: J`const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/hello') {
    res.end({ message: 'Hello Node' });
  }
});

module.exports = server;
`,
  giai: J`const http = require('http');

const server = http.createServer((req, res) => {
  // match BOTH the path and the method
  if (req.url === '/api/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });   // status + headers
    res.end(JSON.stringify({ message: 'Hello Node' }));            // body must be a string
  } else {
    res.writeHead(404);
    res.end('Not found');                                           // every branch ends the response
  }
});

module.exports = server;   // bin/www (or a test) decides when to listen
`,
  chuanBi: `const go = async (method, url) => __pick(await module.exports.inject({ method, url }), 'status body');`,
  cases: [
    { goi: `await go('GET', '/api/hello')`, moTa: ['GET /api/hello → 200 + JSON', 'GET /api/hello → 200 + JSON'] },
    { goi: `(await module.exports.inject({ url: '/api/hello' })).headers['content-type']`, moTa: ['Content-Type is application/json', 'Content-Type là application/json'] },
    { goi: `await go('GET', '/nope')`, moTa: ['Unknown path → 404 Not found', 'Đường lạ → 404 Not found'] },
    { goi: `await go('POST', '/api/hello')`, an: true },
    { goi: `await go('DELETE', '/')`, an: true },
  ],
});

/* ── 3 ── URL parsing */
const E3 = bai({
  ten: 'Parse the URL by hand: /api/products/:id and ?minPrice=', kho: 'MEDIUM', phut: 18, lib: ['http'],
  en: J`<p>Without Express there is no <code>req.params</code> or <code>req.query</code> — only the raw string <code>req.url</code> (e.g. <code>/api/products/2?x=1</code>). Use <code>new URL(req.url, 'http://localhost')</code> to split it. Build a read-only products API:</p>
<ul><li><code>GET /api/products</code> → 200 + all products; with <code>?minPrice=N</code> only those with <code>price ≥ N</code>;</li>
<li><code>GET /api/products/:id</code> → 200 + one product, or 404 <code>{"error":"Product not found"}</code>;</li>
<li>any other method on these paths → <code>405</code> with header <code>Allow: GET</code> and <code>{"error":"Method not allowed"}</code>;</li>
<li>any other path → 404 <code>{"error":"Not found"}</code>.</li></ul>
<p>Every answer is JSON with <code>Content-Type: application/json</code>.</p>`,
  vi: J`<p>Không có Express thì không có <code>req.params</code> hay <code>req.query</code> — chỉ có chuỗi thô <code>req.url</code> (vd <code>/api/products/2?x=1</code>). Dùng <code>new URL(req.url, 'http://localhost')</code> để tách. Dựng API sản phẩm chỉ đọc:</p>
<ul><li><code>GET /api/products</code> → 200 + mọi sản phẩm; có <code>?minPrice=N</code> thì chỉ những sản phẩm <code>price ≥ N</code>;</li>
<li><code>GET /api/products/:id</code> → 200 + một sản phẩm, hoặc 404 <code>{"error":"Product not found"}</code>;</li>
<li>phương thức khác trên các đường này → <code>405</code> kèm header <code>Allow: GET</code> và <code>{"error":"Method not allowed"}</code>;</li>
<li>đường khác → 404 <code>{"error":"Not found"}</code>.</li></ul>
<p>Mọi câu trả lời là JSON với <code>Content-Type: application/json</code>.</p>`,
  yc: [
    ['<code>const url = new URL(req.url, \'http://localhost\')</code> ⇒ <code>url.pathname</code> and <code>url.searchParams.get(\'minPrice\')</code>.', '<code>const url = new URL(req.url, \'http://localhost\')</code> ⇒ <code>url.pathname</code> và <code>url.searchParams.get(\'minPrice\')</code>.'],
    ['Match the id with a regular expression, e.g. <code>/^\\/api\\/products\\/(\\d+)$/</code>.', 'Khớp id bằng biểu thức chính quy, vd <code>/^\\/api\\/products\\/(\\d+)$/</code>.'],
    ['Write one helper <code>send(res, status, data, headers)</code> instead of repeating writeHead/end.', 'Viết một hàm <code>send(res, status, data, headers)</code> thay vì lặp writeHead/end.'],
  ],
  viDu: [['GET /api/products?minPrice=5', '200 [{"id":1,"name":"Book","price":25},{"id":3,"name":"Notebook","price":5}]', 'searchParams values are strings — convert to Number.', 'Giá trị searchParams là chuỗi — đổi sang Number.'], ['DELETE /api/products/1', '405  Allow: GET  {"error":"Method not allowed"}', 'The path exists, the method does not.', 'Đường có, phương thức thì không.']],
  goiY: [
    ['Compare <code>url.pathname</code>, not <code>req.url</code>: <code>/api/products?minPrice=5</code> is not equal to <code>/api/products</code>.', 'So <code>url.pathname</code>, không so <code>req.url</code>: <code>/api/products?minPrice=5</code> không bằng <code>/api/products</code>.'],
    ['Decide the path first (list / one / unknown), then check the method — that is how you know 405 vs 404.', 'Xác định đường trước (danh sách / một cái / lạ), rồi mới kiểm phương thức — vậy mới phân biệt được 405 với 404.'],
  ],
  loi: [
    ['<code>if (req.url === \'/api/products\')</code> — the version with a query string falls into the 404 branch.', '<code>if (req.url === \'/api/products\')</code> — bản có query string rơi vào nhánh 404.'],
    ['Answering 404 for a wrong method: the resource exists, so 405 + <code>Allow</code> tells the client what IS allowed.', 'Trả 404 cho sai phương thức: tài nguyên có tồn tại, nên 405 + <code>Allow</code> cho client biết cái gì ĐƯỢC phép.'],
    ['<code>p.price >= url.searchParams.get(\'minPrice\')</code> with no minPrice: <code>null</code> becomes 0 and hides the bug until someone sends <code>abc</code>.', '<code>p.price >= url.searchParams.get(\'minPrice\')</code> khi không có minPrice: <code>null</code> thành 0 và giấu lỗi tới khi có người gửi <code>abc</code>.'],
  ],
  gt: [
    '<code>new URL</code> needs a base because <code>req.url</code> is only the path; it then gives the pathname and a parsed <code>searchParams</code>. Routing by regex + method is what Express\'s router does internally — and it also explains 405: the path matched, the method did not. Seeing how much code this takes is the argument for <code>express.Router()</code>.',
    '<code>new URL</code> cần một gốc vì <code>req.url</code> chỉ là phần đường dẫn; sau đó nó cho pathname và <code>searchParams</code> đã tách. Định tuyến bằng regex + phương thức là việc router của Express làm bên trong — và cũng giải thích 405: đường khớp, phương thức không. Thấy việc này tốn bao nhiêu mã chính là lý lẽ để dùng <code>express.Router()</code>.',
  ],
  kn: ['URL parsing', '405'],
  tns: [tn('pathname', 'phần đường dẫn của URL'), tn('405 Method Not Allowed', 'sai phương thức', 'kèm header Allow')],
  dau: J`const http = require('http');
const products = [
  { id: 1, name: 'Book', price: 25 },
  { id: 2, name: 'Pen', price: 2 },
  { id: 3, name: 'Notebook', price: 5 },
];

const server = http.createServer((req, res) => {
  if (req.url === '/api/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(products));
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

module.exports = server;
`,
  giai: J`const http = require('http');
const products = [
  { id: 1, name: 'Book', price: 25 },
  { id: 2, name: 'Pen', price: 2 },
  { id: 3, name: 'Notebook', price: 5 },
];

function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');      // req.url is only "/path?query"
  const one = url.pathname.match(/^\/api\/products\/(\d+)$/);
  const isList = url.pathname === '/api/products';

  if (!isList && !one) return send(res, 404, { error: 'Not found' });                 // unknown path
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET' });

  if (isList) {
    const raw = url.searchParams.get('minPrice');        // a string, or null when absent
    const min = raw === null ? -Infinity : Number(raw);
    return send(res, 200, products.filter((p) => p.price >= min));
  }
  const product = products.find((p) => p.id === Number(one[1]));
  if (!product) return send(res, 404, { error: 'Product not found' });
  send(res, 200, product);
});

module.exports = server;
`,
  chuanBi: `const go = async (method, url) => { const r = await module.exports.inject({ method, url }); return { status: r.status, allow: r.headers.allow || null, type: r.headers['content-type'] || null, body: r.body === undefined ? null : JSON.parse(r.body) }; };`,
  cases: [
    { goi: `await go('GET', '/api/products?minPrice=5')`, moTa: ['?minPrice=5 filters by price', '?minPrice=5 lọc theo giá'] },
    { goi: `await go('GET', '/api/products/2')`, moTa: ['/api/products/2 → the Pen', '/api/products/2 → cây bút'] },
    { goi: `await go('GET', '/api/products/9')`, moTa: ['Unknown id → 404 Product not found', 'Id lạ → 404 Product not found'] },
    { goi: `await go('DELETE', '/api/products/1')`, moTa: ['Wrong method → 405 + Allow: GET', 'Sai phương thức → 405 + Allow: GET'] },
    { goi: `[await go('GET', '/api/products'), await go('GET', '/api/users')]`, an: true },
    { goi: `[await go('POST', '/api/products'), await go('GET', '/api/products/2/reviews')]`, an: true },
    { goi: `await go('GET', '/api/products?minPrice=30')`, an: true },
  ],
});

/* ── 4 ── body chunks */
const E4 = bai({
  ten: 'Read a JSON body chunk by chunk (what express.json() does)', kho: 'HARD', phut: 25, lib: ['http'],
  en: J`<p>A raw server does not parse bodies: <code>req</code> is a stream, the body arrives in several <code>'data'</code> chunks and then <code>'end'</code>. Implement <code>POST /api/products</code>:</p>
<ul><li>header <code>Content-Type</code> not starting with <code>application/json</code> ⇒ <code>415</code> <code>{"error":"Content-Type must be application/json"}</code>;</li>
<li>collect every chunk, then <code>JSON.parse</code>; invalid JSON ⇒ <code>400</code> <code>{"error":"Invalid JSON"}</code>;</li>
<li><code>name</code> not a non-empty string or <code>price</code> not a number ⇒ <code>400</code> <code>{"error":"name and price required"}</code>;</li>
<li>otherwise add <code>{ id, name, price }</code> (next id = biggest + 1) and answer <code>201</code> with the product and a header <code>Location: /api/products/&lt;id&gt;</code>.</li></ul>
<p>Other routes: 404 <code>{"error":"Not found"}</code>. All JSON.</p>`,
  vi: J`<p>Server thô không đọc thân: <code>req</code> là một luồng, thân đến thành nhiều mẩu <code>'data'</code> rồi <code>'end'</code>. Hiện thực <code>POST /api/products</code>:</p>
<ul><li>header <code>Content-Type</code> không bắt đầu bằng <code>application/json</code> ⇒ <code>415</code> <code>{"error":"Content-Type must be application/json"}</code>;</li>
<li>gom mọi mẩu, rồi <code>JSON.parse</code>; JSON hỏng ⇒ <code>400</code> <code>{"error":"Invalid JSON"}</code>;</li>
<li><code>name</code> không phải chuỗi khác rỗng hoặc <code>price</code> không phải số ⇒ <code>400</code> <code>{"error":"name and price required"}</code>;</li>
<li>còn lại thì thêm <code>{ id, name, price }</code> (id kế = lớn nhất + 1) và trả <code>201</code> với sản phẩm và header <code>Location: /api/products/&lt;id&gt;</code>.</li></ul>
<p>Route khác: 404 <code>{"error":"Not found"}</code>. Tất cả là JSON.</p>`,
  yc: [
    ['<code>let raw = \'\'; req.on(\'data\', (chunk) => { raw += chunk; }); req.on(\'end\', () => { … });</code> — or <code>for await (const chunk of req)</code>.', '<code>let raw = \'\'; req.on(\'data\', (chunk) => { raw += chunk; }); req.on(\'end\', () => { … });</code> — hoặc <code>for await (const chunk of req)</code>.'],
    ['Only parse inside <code>\'end\'</code>: a single chunk is usually NOT the whole JSON.', 'Chỉ parse trong <code>\'end\'</code>: một mẩu thường KHÔNG phải cả JSON.'],
    ['Wrap <code>JSON.parse</code> in try/catch — a throw inside an event callback crashes a real server.', 'Bọc <code>JSON.parse</code> trong try/catch — lỗi ném trong callback sự kiện làm sập server thật.'],
  ],
  viDu: [['POST /api/products  Content-Type: application/json  {"name":"Ruler","price":3}', '201  Location: /api/products/4  {"id":4,"name":"Ruler","price":3}', 'The body arrived in 3 chunks.', 'Thân đến thành 3 mẩu.'], ['POST /api/products  Content-Type: text/plain', '415 {"error":"Content-Type must be application/json"}', 'Checked before reading the body.', 'Kiểm trước khi đọc thân.']],
  goiY: [
    ['Check the content type first: <code>(req.headers[\'content-type\'] || \'\').startsWith(\'application/json\')</code>.', 'Kiểm kiểu nội dung trước: <code>(req.headers[\'content-type\'] || \'\').startsWith(\'application/json\')</code>.'],
    ['Inside \'end\': <code>let data; try { data = JSON.parse(raw); } catch { return send(res, 400, { error: \'Invalid JSON\' }); }</code>', 'Trong \'end\': <code>let data; try { data = JSON.parse(raw); } catch { return send(res, 400, { error: \'Invalid JSON\' }); }</code>'],
  ],
  loi: [
    ['Parsing in the <code>\'data\'</code> handler: the first chunk <code>{"name":"Ru</code> is not valid JSON.', 'Parse trong handler <code>\'data\'</code>: mẩu đầu <code>{"name":"Ru</code> không phải JSON hợp lệ.'],
    ['Answering outside the \'end\' callback: the response is sent before the body has arrived.', 'Trả lời bên ngoài callback \'end\': response gửi đi trước khi thân tới.'],
    ['No try/catch around <code>JSON.parse</code>: one bad request kills the process for every user.', 'Không try/catch quanh <code>JSON.parse</code>: một request xấu giết tiến trình của mọi người dùng.'],
  ],
  gt: [
    'HTTP bodies stream: Node hands them over in pieces as they arrive from the network. Concatenating the chunks and parsing once on <code>\'end\'</code> is precisely the job of <code>express.json()</code> — it also checks the Content-Type, caps the size and turns a parse failure into a 400. <code>201</code> + <code>Location</code> tells the client where the new resource lives.',
    'Thân HTTP là luồng: Node trao chúng từng mẩu khi chúng đến từ mạng. Nối các mẩu rồi parse một lần ở <code>\'end\'</code> đúng là việc của <code>express.json()</code> — nó còn kiểm Content-Type, giới hạn kích thước và biến lỗi parse thành 400. <code>201</code> + <code>Location</code> cho client biết tài nguyên mới nằm ở đâu.',
  ],
  kn: ['streams', 'request body'],
  tns: [tn('chunk', 'mẩu dữ liệu'), tn('stream', 'luồng', 'dữ liệu đến dần dần'), tn('415 Unsupported Media Type', 'sai kiểu nội dung')],
  dau: J`const http = require('http');
const products = [{ id: 1, name: 'Book', price: 25 }, { id: 2, name: 'Pen', price: 2 }, { id: 3, name: 'Notebook', price: 5 }];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/products') {
    req.on('data', (chunk) => {
      const data = JSON.parse(chunk);
      products.push(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

module.exports = server;
`,
  giai: J`const http = require('http');
const products = [{ id: 1, name: 'Book', price: 25 }, { id: 2, name: 'Pen', price: 2 }, { id: 3, name: 'Notebook', price: 5 }];

function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (!(req.method === 'POST' && req.url === '/api/products')) return send(res, 404, { error: 'Not found' });

  // 1) check the media type BEFORE reading anything
  if (!(req.headers['content-type'] || '').startsWith('application/json')) {
    return send(res, 415, { error: 'Content-Type must be application/json' });
  }

  // 2) the body arrives in chunks: collect them all
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    // 3) parse ONCE, at the end, and never let a bad body throw out of this callback
    let data;
    try { data = JSON.parse(raw); } catch { return send(res, 400, { error: 'Invalid JSON' }); }

    const { name, price } = data || {};
    if (typeof name !== 'string' || !name.trim() || typeof price !== 'number') {
      return send(res, 400, { error: 'name and price required' });
    }
    const id = products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    const product = { id, name, price };
    products.push(product);
    send(res, 201, product, { Location: '/api/products/' + id });   // where the new resource lives
  });
});

module.exports = server;
`,
  chuanBi: `const post = async (body, type = 'application/json') => { const r = await module.exports.inject({ method: 'POST', url: '/api/products', headers: type ? { 'content-type': type } : {}, body }); return { status: r.status, location: r.headers.location || null, body: r.body ? JSON.parse(r.body) : null, crashed: r.crashed || null }; };`,
  cases: [
    { goi: `await post('{"name":"Ruler","price":3}')`, moTa: ['A valid body in several chunks → 201 + Location', 'Thân hợp lệ nhiều mẩu → 201 + Location'] },
    { goi: `await post('{"name":"Ruler", price: 3}')`, moTa: ['Invalid JSON → 400 (the server survives)', 'JSON hỏng → 400 (server còn sống)'] },
    { goi: `await post('hello', 'text/plain')`, moTa: ['text/plain → 415', 'text/plain → 415'] },
    { goi: `await post('{"name":"","price":3}')`, moTa: ['Empty name → 400', 'Tên rỗng → 400'] },
    { goi: `[await post('{"name":"Clip","price":1}'), await post('{"name":"Tape","price":4}', 'application/json; charset=utf-8')]`, an: true },
    { goi: `[await post('{"name":"Glue","price":"3"}'), await post('null'), await post('{}', null)]`, an: true },
    { goi: `__pick(await module.exports.inject({ url: '/api/products' }), 'status body')`, an: true },
  ],
});

/* ── 5 ── choice */
const E5 = cs({
  ten: 'REST methods mean something: safe, idempotent, cacheable', kho: 'MEDIUM', phut: 8,
  en: 'The ★ note of the lesson: "REST maps HTTP methods to intentions". These questions check what each method promises.',
  vi: 'Ghi chú ★ của bài: "REST ánh xạ phương thức HTTP vào ý định". Các câu hỏi kiểm xem mỗi phương thức hứa điều gì.',
  cau: [
    q('r1', ['Why must a GET never change data (e.g. <code>GET /api/products/2/delete</code>)?', 'Vì sao GET không bao giờ được đổi dữ liệu (vd <code>GET /api/products/2/delete</code>)?'],
      ['Browsers and caches may send GETs on their own, e.g. prefetching a link', 'A GET request cannot carry the id of a product in its URL', 'Express refuses to run a handler that changes data on GET', 'A GET is always slower than a DELETE on the same server'],
      ['GET is "safe": anything may repeat it, prefetch it or cache it. Changes belong to POST/PUT/PATCH/DELETE.', 'GET là "an toàn": bất cứ thứ gì cũng có thể lặp lại, tải trước hay cache nó. Thay đổi thuộc về POST/PUT/PATCH/DELETE.']),
    q('r2', ['The network drops while a client sends <code>PUT /api/products/2 {"price": 9}</code>. Is it safe to retry?', 'Mạng rớt khi client gửi <code>PUT /api/products/2 {"price": 9}</code>. Thử lại có an toàn không?'],
      ['Yes — PUT is idempotent: sending it twice leaves the same final state', 'No — the price would become 18', 'Only if the first request returned 201', 'No — PUT must never be retried, only POST can'],
      ['Idempotent = same request N times ⇒ same result as once. POST (create) is not: retrying may create a duplicate.', 'Idempotent = cùng request N lần ⇒ cùng kết quả như một lần. POST (tạo) thì không: thử lại có thể tạo bản trùng.']),
    q('r3', ['What does the raw <code>http</code> server NOT do for you that Express does?', 'Server <code>http</code> thô KHÔNG làm giúp bạn việc gì mà Express làm?'],
      ['Parse the JSON body, extract <code>:params</code>/query, and pick the handler by method + path', 'Open a TCP port and accept connections', 'Give you the request method and the request URL', 'Send a status code and headers back to the client'],
      ['The http module already accepts connections and exposes method/url/headers; everything above that (routing, body parsing, res.json) is Express.', 'Module http đã nhận kết nối và cho method/url/header; mọi thứ phía trên (định tuyến, đọc thân, res.json) là Express.']),
    qn('r4', ['Which requests should have a body? (choose all)', 'Request nào nên có thân? (chọn hết)'],
      ['<code>POST /api/products</code>', '<code>PUT /api/products/2</code>', '<code>PATCH /api/products/2</code>', '<code>GET /api/products?minPrice=5</code>', '<code>DELETE /api/products/2</code>'],
      [0, 1, 2],
      ['GET carries its parameters in the URL; DELETE identifies the target by URL. Create/replace/change send the new data in the body.', 'GET mang tham số trên URL; DELETE xác định đối tượng bằng URL. Tạo/thay/sửa gửi dữ liệu mới trong thân.']),
  ],
  goiY: [['Ask: what if this request is sent twice?', 'Hỏi: nếu request này bị gửi hai lần thì sao?'], ['Safe = no side effects.', 'An toàn = không tác dụng phụ.']],
  loi: [['Changing data with GET.', 'Đổi dữ liệu bằng GET.'], ['Thinking PUT is not retry-safe.', 'Tưởng PUT không thử lại được.']],
  tns: [tn('safe method', 'phương thức an toàn', 'không đổi dữ liệu'), tn('idempotent', 'luỹ đẳng', 'lặp lại không đổi kết quả')],
  kn: ['REST semantics'],
});

export default doiDau({
  slug: 'sdn302-1-2-http-server',
  ten: '1.2 APIs, HTTP & a first Node server',
  khoa: KHOA,
  baiHoc: 'sdn302-1-2-http-server',
  de: [E1, E2, E3, E4, E5],
});
