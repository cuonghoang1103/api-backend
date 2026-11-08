/** SDN302 · Final Exam (25%, 60 phút, cổng ≥ 4) — ôn rộng cả 8 CLO: định nghĩa, "chọn cách nào + một mệnh đề lý do", đọc mã và lần theo đường đi của request. Câu luyện soạn mới từ bài học, không chép đề thi thật. */
import { doiDau, KHOA, cs, q, qn, ord, bang1, tn } from './_sdn.mjs';

const E1 = cs({
  ten: 'CLO1–CLO4 in one sitting: Node, Express, Generator, MongoDB', kho: 'MEDIUM', phut: 12,
  en: 'Breadth beats depth: one or two items per CLO, each answerable in one clause.',
  vi: 'Rộng thắng sâu: mỗi CLO một hai câu, câu nào cũng trả lời được bằng một mệnh đề.',
  cau: [
    q('a1', ['CLO1 — What does <code>http.createServer(handler)</code> do?', 'CLO1 — <code>http.createServer(handler)</code> làm gì?'],
      ['Makes a server that calls handler(req, res) for each request', 'Starts listening on port 80 immediately, without listen()', 'Creates an Express app with routing and body parsing built in', 'Opens a connection to MongoDB using the default local URI'],
      ['The handler receives the raw request and response streams.', 'Handler nhận luồng request và response thô.']),
    q('a2', ['CLO1 — Which call blocks the event loop?', 'CLO1 — Lời gọi nào chặn event loop?'],
      ['<code>fs.readFileSync(\'big.csv\')</code> inside a route', '<code>await fs.promises.readFile(\'big.csv\')</code>', '<code>setTimeout(fn, 1000)</code>', '<code>await Product.find()</code>'],
      ['Sync I/O freezes the only thread for everyone.', 'I/O đồng bộ làm đứng luồng duy nhất cho mọi người.']),
    q('a3', ['CLO2 — In Express, where must <code>app.use((err, req, res, next) => …)</code> go?', 'CLO2 — Trong Express, <code>app.use((err, req, res, next) => …)</code> phải đặt ở đâu?'],
      ['After all routes — it catches errors forwarded from above it', 'Before all routes, so it is ready', 'Inside each route', 'Anywhere: Express sorts middleware by arity'],
      ['Middleware runs top to bottom.', 'Middleware chạy từ trên xuống.']),
    q('a4', ['CLO3 — Why does a generated app have both <code>app.js</code> and <code>bin/www</code>?', 'CLO3 — Vì sao app sinh ra có cả <code>app.js</code> lẫn <code>bin/www</code>?'],
      ['app.js builds the app; bin/www creates the server and listens on PORT', 'bin/www is only a backup copy of app.js made by the generator', 'app.js is used in development and bin/www only in production', 'bin/www holds the routes while app.js holds the middleware'],
      ['Separation of "what the app is" from "how it is served".', 'Tách "app là gì" khỏi "phục vụ nó thế nào".']),
    q('a5', ['CLO4 — A user has thousands of orders. Embed or reference?', 'CLO4 — Một người dùng có hàng nghìn đơn hàng. Nhúng hay tham chiếu?'],
      ['Reference: each order stores the user id — unbounded data is not embedded', 'Embed: one read gets everything', 'Embed the user in every order and drop the users collection', 'Neither: use a SQL database'],
      ['Data that grows without limit is referenced.', 'Dữ liệu lớn không giới hạn thì tham chiếu.']),
    q('a6', ['CLO4 — <code>db.products.updateOne({ name: \'Book\' }, { $set: { price: 30 } })</code> returns <code>modifiedCount: 0</code>. Why?', 'CLO4 — <code>db.products.updateOne({ name: \'Book\' }, { $set: { price: 30 } })</code> trả <code>modifiedCount: 0</code>. Vì sao?'],
      ['No document matched, or the price was already 30', 'updateOne always returns 0', 'The $set operator needs an array', 'MongoDB updates asynchronously, so the count comes later'],
      ['Check <code>matchedCount</code> to tell the two apart.', 'Xem <code>matchedCount</code> để phân biệt hai trường hợp.']),
  ],
  goiY: [['One clause per answer.', 'Mỗi câu một mệnh đề.'], ['Think about which chapter each CLO lives in.', 'Nghĩ xem mỗi CLO thuộc chương nào.']],
  loi: [['Over-answering with details from one CLO.', 'Trả lời quá chi tiết một CLO.'], ['Mixing CLO2 and CLO3.', 'Lẫn CLO2 và CLO3.']],
  tns: [tn('breadth', 'bề rộng')],
  kn: ['revision'],
});

const E2 = cs({
  ten: 'CLO5–CLO8: REST & Mongoose, authentication, BaaS, templating', kho: 'MEDIUM', phut: 12,
  en: 'Answer "which approach" questions with the course\'s choice and its reason.',
  vi: 'Trả lời câu "cách nào" bằng lựa chọn của môn và lý do của nó.',
  cau: [
    q('b1', ['CLO5 — <code>await Post.findById(id).populate(\'author\', \'name\')</code> returns…', 'CLO5 — <code>await Post.findById(id).populate(\'author\', \'name\')</code> trả về…'],
      ['The post with <code>author</code> replaced by <code>{ _id, name }</code>', 'The author document only', 'An array of posts', 'The post with <code>author</code> still an id'],
      ['The select argument limits the populated fields.', 'Đối số select giới hạn field được populate.']),
    q('b2', ['CLO5 — <code>findByIdAndUpdate(id, { price: -5 })</code> with <code>min: 0</code> in the schema saves -5. Why?', 'CLO5 — <code>findByIdAndUpdate(id, { price: -5 })</code> với <code>min: 0</code> trong schema vẫn lưu -5. Vì sao?'],
      ['Updates skip validators unless <code>runValidators: true</code>', 'min only works on strings, not on Number fields', 'Mongoose runs validators only when you call find', 'The schema was never compiled into a model'],
      ['And add <code>{ new: true }</code> to get the updated document back.', 'Và thêm <code>{ new: true }</code> để nhận lại document đã cập nhật.']),
    q('b3', ['CLO6 — Sessions or JWT for an API used by a React app on another domain? (the course\'s choice)', 'CLO6 — Session hay JWT cho API dùng bởi app React ở domain khác? (lựa chọn của môn)'],
      ['JWT, because the server stays stateless (token in a header)', 'Sessions, because session cookies are encrypted by default', 'Neither, because React apps cannot authenticate at all', 'Both at once on every route, to be doubly sure'],
      ['"JWT, because the server stays stateless" — exactly the one-clause answer style.', '"JWT, vì server không cần lưu trạng thái" — đúng kiểu trả lời một mệnh đề.']),
    q('b4', ['CLO6 — What belongs in a JWT payload?', 'CLO6 — Cái gì thuộc payload của JWT?'],
      ['The user id and role: the payload is readable by anyone', 'The password hash, so the server can re-check it later', 'The JWT secret, so the client can verify the signature', 'The full user document, to avoid querying the database'],
      ['Anyone holding the token can decode the payload.', 'Ai cầm token cũng giải mã được payload.']),
    q('b5', ['CLO7 — What does a BaaS provide?', 'CLO7 — BaaS cung cấp gì?'],
      ['Ready-made auth, database and storage instead of your own server', 'A faster drop-in replacement for the Express framework', 'A React component library for building admin pages', 'A way to run a full MongoDB server inside the browser'],
      ['Firebase, Supabase, Atlas App Services.', 'Firebase, Supabase, Atlas App Services.']),
    q('b6', ['CLO8 — Which template output is safe for text typed by users?', 'CLO8 — Đầu ra template nào an toàn cho chữ người dùng gõ?'],
      ['EJS <code>&lt;%= text %&gt;</code> or Handlebars <code>{{text}}</code>', 'EJS <code>&lt;%- text %&gt;</code>', 'Handlebars <code>{{{text}}}</code>', 'String concatenation into res.send'],
      ['The escaping forms; raw forms are for server-made HTML only.', 'Các dạng có thoát; dạng thô chỉ cho HTML do server tạo.']),
  ],
  goiY: [['Course choice + one reason.', 'Lựa chọn của môn + một lý do.'], ['Update defaults are surprising.', 'Mặc định của cập nhật hay gây bất ngờ.']],
  loi: [['Putting secrets in JWTs.', 'Để bí mật trong JWT.'], ['Using raw template tags for user data.', 'Dùng thẻ template thô cho dữ liệu người dùng.']],
  tns: [tn('stateless', 'không trạng thái')],
  kn: ['revision'],
});

const E3 = cs({
  ten: 'Code reading: trace the request through the middleware', kho: 'HARD', phut: 12, loai: 'order',
  en: 'The technique of the Final Exam page: "trace the request path — which middleware runs, in what order, and what the response would actually be."',
  vi: 'Kỹ thuật của trang Final Exam: "lần theo đường đi của request — middleware nào chạy, theo thứ tự nào, và câu trả lời thực sự là gì."',
  cau: [
    ord('c1', [`<pre>app.use(express.json());\napp.use((req, res, next) => { console.log('A'); next(); });\napp.use('/api', (req, res, next) => { console.log('B'); next(); });\napp.get('/api/me', requireAuth, (req, res) => { console.log('D'); res.json(req.user); });\n// requireAuth logs 'C' then calls next() for a valid token\napp.use((err, req, res, next) => { console.log('E'); res.status(500).end(); });</pre>GET /api/me with a VALID token. Order what is printed / sent.`, 'GET /api/me với token HỢP LỆ. Sắp những gì được in / gửi.'],
      ['A', 'B', 'C', 'D', 'the JSON response (200)'],
      ['express.json (no output) → global logger A → the /api-scoped middleware B → requireAuth C → the handler D, which sends 200. The error handler never runs because no error was passed to next.', 'express.json (không in) → logger toàn cục A → middleware giới hạn /api B → requireAuth C → handler D, gửi 200. Error handler không chạy vì không có lỗi nào được đưa vào next.']),
    ord('c2', [`<pre>app.get('/api/items/:id', (req, res) => { console.log('1'); res.json({ id: req.params.id }); });\napp.get('/api/items/search', (req, res) => { console.log('2'); res.json([]); });\napp.use((req, res) => { console.log('3'); res.status(404).json({ error: 'Not found' }); });</pre>Two requests: first GET /api/items/search, then GET /api/nope. Order what happens.`, 'Hai request: trước GET /api/items/search, sau GET /api/nope. Sắp những gì xảy ra.'],
      ['prints 1 (the :id route matched "search")', 'sends {"id":"search"} with 200', 'prints 3', 'sends 404 {"error":"Not found"}'],
      ['First match wins: "/:id" is declared before "/search", so the search route is unreachable — a classic bug to spot in code-reading items. The unknown URL falls through to the 404 middleware.', 'Khớp đầu tiên thắng: "/:id" khai trước "/search", nên route search không bao giờ tới được — lỗi kinh điển cần nhận ra trong câu đọc mã. URL lạ rơi xuống middleware 404.']),
  ],
  goiY: [['Walk the file top to bottom.', 'Đi tệp từ trên xuống.'], ['A response ends the chain.', 'Một câu trả lời kết thúc chuỗi.']],
  loi: [['Running the error handler without an error.', 'Cho error handler chạy khi không có lỗi.'], ['Thinking Express picks the most specific route.', 'Tưởng Express chọn route cụ thể nhất.']],
  tns: [tn('trace', 'lần theo')],
  kn: ['code reading'],
});

const E4 = cs({
  ten: 'What is the response? Status codes for code you read', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'For each snippet, choose the status the client actually receives.',
  vi: 'Với mỗi đoạn mã, chọn mã trạng thái client thực sự nhận.',
  bang: [bang1('r1', ['Snippet → status', 'Đoạn mã → mã'], [{ ma: 'ma', ten: 'Snippet' }, { ma: 's', ten: 'Status', luaChon: ['200', '201', '204', '400', '401', '404', '500', 'no response (hangs)'] }], [
    { o: { ma: 'res.status(201).json(await Item.create(req.body)) — valid body' }, a: { s: '201' } },
    { o: { ma: 'res.json(await Item.findById(id)) — id does not exist' }, a: { s: '200' } },
    { o: { ma: 'if (!item) return res.status(404).json({ error }) — id does not exist' }, a: { s: '404' } },
    { o: { ma: 'Express 4: app.get(x, async () => { throw new Error() }) with no wrapper' }, a: { s: 'no response (hangs)' } },
    { o: { ma: 'app.get(x, () => { throw new Error() }) — a synchronous throw, no error handler' }, a: { s: '500' } },
    { o: { ma: 'requireAuth with no Authorization header' }, a: { s: '401' } },
    { o: { ma: 'res.status(204).end() after a delete' }, a: { s: '204' } },
  ], ['Row 2 is the "200 null" bug: no check, so a missing item still answers 200. Row 4: Express 4 ignores rejected promises, so the request hangs; a synchronous throw (row 5) is caught and the default handler answers 500.', 'Hàng 2 là lỗi "200 null": không kiểm nên item không có vẫn trả 200. Hàng 4: Express 4 bỏ qua promise bị reject nên request treo; lỗi ném đồng bộ (hàng 5) được bắt và handler mặc định trả 500.'])],
  goiY: [['Read exactly what the code does, not what it should do.', 'Đọc đúng điều mã làm, không phải điều nó nên làm.'], ['Sync vs async throws differ in Express 4.', 'Ném đồng bộ và bất đồng bộ khác nhau ở Express 4.']],
  loi: [['Answering 404 for row 2.', 'Trả lời 404 cho hàng 2.'], ['Answering 500 for row 4.', 'Trả lời 500 cho hàng 4.']],
  tns: [tn('code reading', 'đọc mã')],
  kn: ['status codes'],
});

export default doiDau({
  slug: 'sdn302-final-exam-fe',
  ten: 'Final Exam — 25%, 60 minutes, gate ≥ 4 (revision)',
  khoa: KHOA,
  baiHoc: 'sdn302-final-exam-fe',
  de: [E1, E2, E3, E4],
});
