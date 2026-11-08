/** Node.js 5.1 — Từ http thuần tới Express: res.json / send / status / sendStatus / end, lỗi thiếu return, viết lại server 3.5, và tự dựng res.json trên http thuần. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, FAKE_RAW_RES } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '5.1 · What Express put on the wire', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s <code>curl -i</code> outputs. Each answer was checked against express@5 with a real HTTP request.',
  vi: 'Các câu về output <code>curl -i</code> của bài. Mỗi đáp án đã được kiểm với express@5 bằng request HTTP thật.',
  cau: [
    q('c1', ['<code>res.send(\'xin chao\')</code> answers with which Content-Type?', '<code>res.send(\'xin chao\')</code> trả về Content-Type nào?'],
      ['text/html; charset=utf-8', 'text/plain; charset=utf-8', 'application/json; charset=utf-8', 'application/octet-stream'],
      ['send() guesses from the argument: a string becomes HTML. A frontend calling await r.json() on it throws — for an API, use res.json() everywhere.', 'send() đoán theo đối số: chuỗi thành HTML. Frontend gọi await r.json() trên đó sẽ ném lỗi — với API, dùng res.json() ở mọi nơi.']),
    q('c2', ['A handler does <code>res.status(201)</code> and nothing else. The client…', 'Một handler chỉ làm <code>res.status(201)</code> và không gì nữa. Client…'],
      ['waits — status() only sets the code, it does not send', 'receives 201 with an empty body', 'receives 201 Created as text, like sendStatus', 'receives 500 because the body is missing'],
      ['Chain it: res.status(201).json(…). res.sendStatus(201) is a different function that sets the code AND sends “Created”.', 'Nối tiếp: res.status(201).json(…). res.sendStatus(201) là hàm khác, đặt mã VÀ gửi “Created”.']),
    q('c3', ['<code>res.json({ title: \'x\', draft: undefined, at: new Date(0) })</code> sends…', '<code>res.json({ title: \'x\', draft: undefined, at: new Date(0) })</code> gửi…'],
      ['{"title":"x","at":"1970-01-01T00:00:00.000Z"}', '{"title":"x","draft":null,"at":0}', '{"title":"x","draft":undefined,"at":"1970-01-01"}', '{"title":"x","at":{}}'],
      ['res.json uses JSON.stringify: undefined fields disappear and a Date becomes an ISO string.', 'res.json dùng JSON.stringify: trường undefined biến mất và Date thành chuỗi ISO.']),
    q('c4', ['A request to a route that does not exist, with no 404 handler of your own, gets…', 'Request tới một route không tồn tại, khi bạn chưa có handler 404 riêng, nhận…'],
      ['404 with an HTML page “Cannot GET /does-not-exist”', '404 with {"error":"Not Found"}', '200 with an empty body', 'A closed connection with no response'],
      ['Express’s default is HTML — the wrong shape for a JSON API. Lesson 5.4 replaces it; every default is replaceable.', 'Mặc định của Express là HTML — sai dạng cho một API JSON. Bài 5.4 thay nó; mọi mặc định đều thay được.']),
    q('c5', ['Express 4 vs Express 5: which difference does the lesson say matters now?', 'Express 4 và Express 5: khác biệt nào bài nói là quan trọng ngay?'],
      ['v5 forwards async handler errors, and wildcards must be named (*splat)', 'v5 removed res.json, so every route has to answer with res.send', 'v5 parses JSON bodies by itself, so express.json() is no longer needed', 'v5 only runs on TypeScript projects and refuses plain JavaScript files'],
      ['Measured: on Express 4.22.2 a throw after an await never answers (timeout + unhandledRejection); on 5.x the same route returns 500 through the error handler.', 'Đo được: trên Express 4.22.2, throw sau một await không bao giờ trả lời (hết giờ + unhandledRejection); trên 5.x cùng route đó trả 500 qua error handler.']),
  ],
  goiY: [['Look at the Content-Type line of each curl -i output in the lesson.', 'Nhìn dòng Content-Type của từng output curl -i trong bài.'], ['Which of these methods actually ends the response?', 'Trong các hàm này, hàm nào thật sự kết thúc phản hồi?']],
  loi: [['Using res.send for JSON APIs and wondering why the frontend’s r.json() fails.', 'Dùng res.send cho API JSON rồi thắc mắc vì sao r.json() của frontend hỏng.'], ['Confusing res.status(201) with res.sendStatus(201).', 'Nhầm res.status(201) với res.sendStatus(201).']],
  tns: [tn('res.json', 'gửi JSON'), tn('res.sendStatus', 'đặt mã và gửi chữ của mã'), tn('Content-Type', 'kiểu nội dung')],
  kn: ['Express'],
});

/* ─── 2. app đầu tiên ─── */
function createApp() {
  const app = express();
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });                       // always application/json
  });
  app.get('/text', (req, res) => {
    res.send('xin chao');                             // a string → text/html (the lesson's surprise)
  });
  app.get('/created', (req, res) => {
    res.status(201).json({ id: 7 });                  // status() only sets the code — chain the sender
  });
  app.delete('/notes/:id', (req, res) => {
    res.status(204).end();                            // 204 No Content: no body at all
  });
  return app;
}
const E2 = nodeBai({
  ten: '5.1 · Your first Express app: four responses', kho: 'EASY', phut: 10, kit: true, tep: 'app.js',
  en: `<p>Write <code>createApp()</code> that builds and returns an Express app (do not call <code>listen</code>) with:</p>
<table><thead><tr><th>route</th><th>response</th></tr></thead><tbody>
<tr><td>GET /health</td><td>200, JSON <code>{ "status": "ok" }</code></td></tr><tr><td>GET /text</td><td>200, the text <code>xin chao</code> sent with <code>res.send</code></td></tr>
<tr><td>GET /created</td><td>201, JSON <code>{ "id": 7 }</code></td></tr><tr><td>DELETE /notes/:id</td><td>204, no body</td></tr></tbody></table><p>The checks look at the status, the <code>Content-Type</code> header and the body — exactly what <code>curl -i</code> showed in the lesson.</p>`,
  vi: `<p>Viết <code>createApp()</code> dựng và trả về một app Express (không gọi <code>listen</code>) có:</p>
<table><thead><tr><th>route</th><th>phản hồi</th></tr></thead><tbody>
<tr><td>GET /health</td><td>200, JSON <code>{ "status": "ok" }</code></td></tr><tr><td>GET /text</td><td>200, chữ <code>xin chao</code> gửi bằng <code>res.send</code></td></tr>
<tr><td>GET /created</td><td>201, JSON <code>{ "id": 7 }</code></td></tr><tr><td>DELETE /notes/:id</td><td>204, không có thân</td></tr></tbody></table><p>Các kiểm nhìn status, header <code>Content-Type</code> và thân — đúng những gì <code>curl -i</code> cho thấy trong bài.</p>`,
  yc: [['Return the app from createApp(); never call app.listen().', 'Trả app từ createApp(); không bao giờ gọi app.listen().'], ['Use res.json for JSON — not res.send(JSON.stringify(…)).', 'Dùng res.json cho JSON — không phải res.send(JSON.stringify(…)).']],
  goiY: [['const app = express(); app.get(path, (req, res) => …); return app;', 'const app = express(); app.get(path, (req, res) => …); return app;'], ['res.status(n) returns res, so .json() or .end() can follow on the same line.', 'res.status(n) trả về res, nên .json() hay .end() theo ngay trên cùng dòng.']],
  loi: [['res.send(JSON.stringify(obj)) — the body is JSON text but Content-Type says text/html.', 'res.send(JSON.stringify(obj)) — thân là chữ JSON nhưng Content-Type ghi text/html.'], ['res.status(201) on its own — the request hangs.', 'Chỉ res.status(201) — request treo.'], ['res.status(204).json({}) and expecting {} to arrive — a 204 never has a body.', 'res.status(204).json({}) và mong {} tới nơi — 204 không bao giờ có thân.']],
  gt: ['Nine meaningful lines in the lesson produced status, Content-Type, Content-Length (and an ETag) on the wire. The grader’s <code>request()</code> reads them back the same way curl does: <code>/text</code> really is <code>text/html; charset=utf-8</code>, which is the lesson’s argument for using <code>res.json</code> in an API.', 'Chín dòng có nghĩa trong bài tạo ra status, Content-Type, Content-Length (và ETag) trên dây. <code>request()</code> của máy chấm đọc lại chúng như curl: <code>/text</code> thật sự là <code>text/html; charset=utf-8</code>, đó là lập luận của bài để dùng <code>res.json</code> trong API.'],
  kn: ['Express'], tns: [tn('app', 'ứng dụng Express'), tn('route handler', 'hàm xử lý route')],
  chung: 'const view = (r) => ({ status: r.status, type: r.headers["content-type"] || null, text: r.text });',
  dau: `/** build the app; the grader calls request(createApp(), method, url) */
function createApp() {
  const app = express();
  // Write your solution here
  app.get('/health', (req, res) => {
    res.send(JSON.stringify({ status: 'ok' }));
  });
  app.get('/created', (req, res) => {
    res.status(201);
  });
  return app;
}
`,
  giai: '// Reference solution — one line per response, the sender always chained after status()\n' + nguon(createApp),
  cases: [
    { goi: 'view(await request(createApp(), "GET", "/health"))', moTa: ['GET /health: JSON, not HTML', 'GET /health: JSON, không phải HTML'] },
    { goi: 'view(await request(createApp(), "GET", "/created"))', moTa: ['GET /created: 201 and a body', 'GET /created: 201 và có thân'] },
    { goi: 'view(await request(createApp(), "GET", "/text"))', moTa: ['GET /text: res.send of a string', 'GET /text: res.send một chuỗi'] },
    { goi: 'view(await request(createApp(), "DELETE", "/notes/3"))', an: true },
    { goi: '[(await request(createApp(), "GET", "/nope")).status, (await request(createApp(), "POST", "/health")).status]', an: true },
  ],
});

/* ─── 3. lỗi tuần đầu: thiếu return ─── */
function createApp3(audit) {
  const app = express();
  app.get('/secret', (req, res) => {
    // every res.* that ends the request gets a return in front of it
    if (!req.query.token) return res.status(401).json({ error: 'Unauthorized' });
    audit.push(`read secret with ${req.query.token}`);   // the expensive write runs only for accepted requests
    res.json({ secret: 'private data' });
  });
  app.use((err, req, res, next) => {
    console.log('[error handler]', err.code || err.message);
    if (!res.headersSent) res.status(500).json({ error: 'Internal' });
  });
  return app;
}
const E3 = nodeBai({
  ten: '5.1 · Fix the week-one bug: a response without return', kho: 'MEDIUM', phut: 10, kit: true, tep: 'app.js',
  en: `<p>The lesson’s “mistake everyone makes in week one”:</p><pre>if (!req.query.token) res.status(401).json({ error: 'Unauthorized' });  // no return!
res.json({ secret: 'private data' });</pre><pre>client sees : {"error":"Unauthorized"}   [401]
server logs : [error handler] ERR_HTTP_HEADERS_SENT</pre><p>The client got the right answer, so the bug hides for months — while the handler keeps running. Here the route also writes to an <code>audit</code> log (think: an expensive database write). Fix <code>createApp(audit)</code> so that a request without a token gets the 401, <b>nothing else runs</b>, and the server logs nothing; a request with <code>?token=…</code> pushes one audit line and gets the secret.</p>`,
  vi: `<p>“Lỗi ai cũng mắc trong tuần đầu” của bài:</p><pre>if (!req.query.token) res.status(401).json({ error: 'Unauthorized' });  // thiếu return!
res.json({ secret: 'private data' });</pre><pre>client sees : {"error":"Unauthorized"}   [401]
server logs : [error handler] ERR_HTTP_HEADERS_SENT</pre><p>Client nhận đúng câu trả lời nên lỗi trốn được hàng tháng — trong khi handler vẫn chạy tiếp. Ở đây route còn ghi vào nhật ký <code>audit</code> (hãy nghĩ: một lệnh ghi CSDL tốn kém). Sửa <code>createApp(audit)</code> để request không có token nhận 401, <b>không gì khác chạy</b>, và server không log gì; request có <code>?token=…</code> đẩy một dòng audit và nhận secret.</p>`,
  yc: [['Keep the route and the error handler; change only what is needed.', 'Giữ route và error handler; chỉ sửa chỗ cần sửa.']],
  goiY: [['One word fixes it.', 'Một từ là đủ sửa.'], ['Rule: every res.* that ends a request gets a return in front of it, unless it is the last statement.', 'Luật: mọi res.* kết thúc request đều có return phía trước, trừ khi nó là câu lệnh cuối.']],
  loi: [['Adding an else around the second res.json but leaving the audit write before it.', 'Thêm else quanh res.json thứ hai nhưng để lệnh ghi audit nằm trước nó.'], ['Silencing the error handler instead of fixing the route — the write for rejected requests still happens.', 'Bịt error handler thay vì sửa route — lệnh ghi cho request bị từ chối vẫn xảy ra.']],
  gt: ['The mini Express raises the same <code>ERR_HTTP_HEADERS_SENT</code> as real Express when a second <code>res.json</code> tries to set headers, and forwards it to your error handler — so the starter reproduces the lesson’s server log line exactly. With <code>return</code>, execution stops at the 401; the audit stays empty for rejected requests.', 'Mini Express ném đúng <code>ERR_HTTP_HEADERS_SENT</code> như Express thật khi res.json thứ hai cố đặt header, và chuyển nó tới error handler của bạn — nên code khởi đầu tái hiện đúng dòng log server của bài. Có <code>return</code>, code dừng ở 401; audit rỗng với request bị từ chối.'],
  kn: ['Express', 'control flow'], tns: [tn('early return', 'trả về sớm'), tn('ERR_HTTP_HEADERS_SENT', 'gửi header lần hai')],
  dau: `/** the lesson's /secret route, with an audit write — fix it */
function createApp3(audit) {
  const app = express();
  app.get('/secret', (req, res) => {
    if (!req.query.token) res.status(401).json({ error: 'Unauthorized' });
    audit.push(\`read secret with \${req.query.token}\`);
    res.json({ secret: 'private data' });
  });
  app.use((err, req, res, next) => {
    console.log('[error handler]', err.code || err.message);
    if (!res.headersSent) res.status(500).json({ error: 'Internal' });
  });
  return app;
}
`,
  giai: '// Reference solution — return in front of the response that ends the request\n' + nguon(createApp3),
  cases: [
    { chuanBi: 'const audit = []; const r = await request(createApp3(audit), "GET", "/secret");', goi: '({ status: r.status, body: r.body, audit, serverLog: __log })', moTa: ['No token: 401, no audit write, no server error', 'Không token: 401, không ghi audit, server không lỗi'] },
    { chuanBi: 'const audit = []; const r = await request(createApp3(audit), "GET", "/secret?token=abc");', goi: '({ status: r.status, body: r.body, audit, serverLog: __log })', moTa: ['With a token: one audit line', 'Có token: một dòng audit'] },
    { chuanBi: 'const audit = []; const app = createApp3(audit); for (let i = 0; i < 5; i++) await request(app, "GET", "/secret"); const ok = await request(app, "GET", "/secret?token=t1");', goi: '({ audit, serverLog: __log, last: ok.status })', an: true },
  ],
});

/* ─── 4. viết lại server 3.5 bằng Express ─── */
function createApp4(notes) {
  const app = express();
  app.use(express.json({ limit: '100kb' }));        // collects the stream, parses it, 400 on broken JSON
  app.get('/notes', (req, res) => res.json(notes));
  app.get('/notes/:id', (req, res) => {
    const note = notes.find((n) => n.id === Number(req.params.id));   // params are strings
    if (!note) return res.status(404).json({ error: 'Not Found' });
    res.json(note);
  });
  app.post('/notes', (req, res) => {
    const { title } = req.body ?? {};
    if (typeof title !== 'string' || title.trim() === '') return res.status(422).json({ error: 'title is required' });
    const note = { id: notes.length + 1, title: title.trim() };
    notes.push(note);
    res.status(201).json(note);
  });
  return app;
}
const E4 = nodeBai({
  ten: '5.1 · Rewrite the raw server of 3.5 in Express', kho: 'MEDIUM', phut: 18, kit: true, tep: 'app.js',
  en: `<p>Lesson 3.5’s four pains — routing by hand, reading the body, repetition, errors — crossed out one at a time. Rebuild that Notes server as <code>createApp(notes)</code>:</p>
<ul><li><code>express.json()</code> instead of collecting <code>data</code> events;</li><li><code>GET /notes</code> → the array; <code>GET /notes/:id</code> → the note or 404 <code>{ error: "Not Found" }</code> (<code>req.params.id</code> is a string!);</li><li><code>POST /notes</code> → 422 <code>{ error: "title is required" }</code> if <code>title</code> is missing or blank, else 201 with <code>{ id: notes.length + 1, title: trimmed }</code>, pushed into <code>notes</code>.</li></ul><p>A malformed JSON body must be answered with <b>400</b> by the parser — and the next request must still work. Unknown routes keep Express’s default 404 (lesson 5.4 replaces it).</p>`,
  vi: `<p>Bốn nỗi khổ của bài 3.5 — định tuyến tay, đọc body, lặp lại, lỗi — được gạch từng cái. Dựng lại server Notes đó thành <code>createApp(notes)</code>:</p>
<ul><li><code>express.json()</code> thay cho việc gom sự kiện <code>data</code>;</li><li><code>GET /notes</code> → mảng; <code>GET /notes/:id</code> → ghi chú hoặc 404 <code>{ error: "Not Found" }</code> (<code>req.params.id</code> là chuỗi!);</li><li><code>POST /notes</code> → 422 <code>{ error: "title is required" }</code> nếu thiếu <code>title</code> hoặc toàn khoảng trắng, ngược lại 201 với <code>{ id: notes.length + 1, title: đã trim }</code>, push vào <code>notes</code>.</li></ul><p>Body JSON hỏng phải được parser trả <b>400</b> — và request sau vẫn phải chạy. Route lạ giữ 404 mặc định của Express (bài 5.4 sẽ thay nó).</p>`,
  yc: [['Register express.json() before the routes that read req.body.', 'Đăng ký express.json() trước các route đọc req.body.'], ['Convert req.params.id with Number(…).', 'Đổi req.params.id bằng Number(…).']],
  goiY: [['app.use(express.json()) at the top; then one app.get / app.post per route.', 'app.use(express.json()) ở đầu; rồi mỗi route một app.get / app.post.'], ['notes.find((n) => n.id === Number(req.params.id)) — "1" === 1 is false.', 'notes.find((n) => n.id === Number(req.params.id)) — "1" === 1 là false.'], ['req.body ?? {} protects the destructuring if a client forgets Content-Type.', 'req.body ?? {} bảo vệ phép destructure khi client quên Content-Type.']],
  loi: [['Comparing n.id === req.params.id: every lookup 404s.', 'So n.id === req.params.id: mọi lần tra đều 404.'], ['Putting express.json() after the POST route: req.body is undefined there.', 'Đặt express.json() sau route POST: req.body ở đó là undefined.'], ['Calling JSON.parse yourself on req.body.', 'Tự gọi JSON.parse trên req.body.']],
  gt: ['Compare with 3.5’s <code>createHandler</code>: no URL splitting, no data events, no try/catch around JSON.parse — <code>express.json()</code> turns a broken body into a 400 before your handler runs, and the process never sees the SyntaxError. The lines that remain are the ones only you can write: which status, which validation.', 'So với <code>createHandler</code> của 3.5: không tách URL, không sự kiện data, không try/catch quanh JSON.parse — <code>express.json()</code> biến body hỏng thành 400 trước khi handler của bạn chạy, và tiến trình không bao giờ thấy SyntaxError. Những dòng còn lại là thứ chỉ bạn viết được: status nào, kiểm tra gì.'],
  kn: ['Express', 'body parsing'], tns: [tn('body parser', 'bộ phân tích thân request'), tn('route parameter', 'tham số route')],
  dau: `/** the Notes server of lesson 3.5, rebuilt with Express */
function createApp4(notes) {
  const app = express();
  // Write your solution here
  app.get('/notes', (req, res) => res.json(notes));
  app.get('/notes/:id', (req, res) => {
    const note = notes.find((n) => n.id === req.params.id);
    if (!note) return res.status(404).json({ error: 'Not Found' });
    res.json(note);
  });
  return app;
}
`,
  giai: '// Reference solution — the four pains, crossed out\n' + nguon(createApp4),
  chung: 'const s = (r) => ({ status: r.status, body: r.body ?? null });',
  cases: [
    { chuanBi: 'const app = createApp4([{ id: 1, title: "First note" }]);', goi: '[s(await request(app, "GET", "/notes/1")), s(await request(app, "GET", "/notes/2"))]', moTa: ['GET by id: "1" must find note 1', 'GET theo id: "1" phải tìm thấy ghi chú 1'] },
    { chuanBi: 'const notes = [{ id: 1, title: "First note" }]; const app = createApp4(notes);', goi: '[s(await request(app, "POST", "/notes", { body: { title: " Second note " } })), s(await request(app, "GET", "/notes"))]', moTa: ['POST then GET (lesson 3.5’s curl session)', 'POST rồi GET (phiên curl của bài 3.5)'] },
    { chuanBi: 'const app = createApp4([]);', goi: '[(await request(app, "POST", "/notes", { body: "{title:}" })).status, s(await request(app, "POST", "/notes", { body: { title: "still alive" } }))]', moTa: ['Broken JSON → 400, then the server still works', 'JSON hỏng → 400, sau đó server vẫn chạy'] },
    { chuanBi: 'const app = createApp4([]);', goi: '[s(await request(app, "POST", "/notes", { body: { title: "   " } })), s(await request(app, "POST", "/notes", { body: { body: "no title" } })), (await request(app, "GET", "/nope")).status]', an: true },
    { chuanBi: 'const app = createApp4([]);', goi: 's(await request(app, "POST", "/notes", { body: "{\\"title\\":\\"x\\"}", headers: { "content-type": "text/plain" } }))', an: true },
  ],
});

/* ─── 5. tự dựng res.json/send/status trên http thuần ─── */
const STATUS = `const STATUS_TEXT = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 422: 'Unprocessable Entity', 500: 'Internal Server Error' };
function utf8Length(str) { let n = 0; for (const ch of str) { const cp = ch.codePointAt(0); n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4; } return n; }
`;
function attachHelpers(res) {
  res.statusCode = 200;
  res.status = function (code) {
    res.statusCode = code;                         // only remembers the code — sending is someone else's job
    return res;                                    // chainable: res.status(201).json(…)
  };
  function finish(type, body) {
    const headers = {};
    if (res.statusCode === 204) {
      body = '';                                   // 204 never carries a body or content headers
    } else {
      if (type) headers['Content-Type'] = type;
      headers['Content-Length'] = String(utf8Length(body));   // bytes, as a header string
    }
    res.writeHead(res.statusCode, headers);
    res.end(body);
    return res;
  }
  res.json = function (obj) {
    return finish('application/json; charset=utf-8', JSON.stringify(obj) ?? '');
  };
  res.send = function (body) {
    if (body === null || body === undefined) return finish(null, '');           // nothing to send, nothing to guess
    if (typeof body === 'string') return finish('text/html; charset=utf-8', body);   // a string is guessed to be HTML
    return res.json(body);                                                       // objects, arrays, numbers, booleans
  };
  res.sendStatus = function (code) {
    res.statusCode = code;
    return finish('text/plain; charset=utf-8', STATUS_TEXT[code] || String(code));
  };
  return res;
}
const E5 = nodeBai({
  ten: '5.1 · Express is a thin layer: build res.json on raw http', kho: 'HARD', phut: 25,
  en: `<p>“Express is not magic: everything it does, you could write yourself.” Prove it for the response helpers. Write <code>attachHelpers(res)</code> that adds Express-like methods to a raw <code>node:http</code> response (which only has <code>writeHead</code> and <code>end</code>) and returns <code>res</code>:</p>
<ul><li><code>res.status(code)</code> — remembers the code (start at 200), sends nothing, returns <code>res</code>;</li><li><code>res.json(obj)</code> — <code>Content-Type: application/json; charset=utf-8</code>, <code>Content-Length</code> = UTF-8 bytes of <code>JSON.stringify(obj)</code> (as a string), then <code>writeHead</code> + <code>end</code>;</li><li><code>res.send(body)</code> — a string is sent with <code>Content-Type: text/html; charset=utf-8</code>; <code>null</code>/<code>undefined</code> → an empty body with <b>no</b> Content-Type (Content-Length <code>"0"</code>); anything else (object, array, number, boolean) behaves like <code>json</code>;</li><li><code>res.sendStatus(code)</code> — sets the code and sends its text (<code>STATUS_TEXT</code>) as <code>text/plain; charset=utf-8</code>;</li><li>with status <b>204</b>, every sender writes no body and no Content-Type / Content-Length.</li></ul><p>These are exactly the headers express@5 produced in the lesson and in the grader’s checks. <code>STATUS_TEXT</code> and <code>utf8Length</code> are provided.</p>`,
  vi: `<p>“Express không phải phép màu: mọi thứ nó làm, bạn đều tự viết được.” Hãy chứng minh với các hàm phản hồi. Viết <code>attachHelpers(res)</code> thêm các hàm kiểu Express vào một response <code>node:http</code> thuần (chỉ có <code>writeHead</code> và <code>end</code>) và trả về <code>res</code>:</p>
<ul><li><code>res.status(code)</code> — nhớ mã (bắt đầu là 200), không gửi gì, trả <code>res</code>;</li><li><code>res.json(obj)</code> — <code>Content-Type: application/json; charset=utf-8</code>, <code>Content-Length</code> = số byte UTF-8 của <code>JSON.stringify(obj)</code> (dạng chuỗi), rồi <code>writeHead</code> + <code>end</code>;</li><li><code>res.send(body)</code> — chuỗi được gửi với <code>Content-Type: text/html; charset=utf-8</code>; <code>null</code>/<code>undefined</code> → thân rỗng và <b>không</b> có Content-Type (Content-Length <code>"0"</code>); mọi thứ khác (object, mảng, số, boolean) xử lý như <code>json</code>;</li><li><code>res.sendStatus(code)</code> — đặt mã và gửi chữ của mã (<code>STATUS_TEXT</code>) dạng <code>text/plain; charset=utf-8</code>;</li><li>với status <b>204</b>, mọi hàm gửi đều không ghi thân và không Content-Type / Content-Length.</li></ul><p>Đây đúng là các header express@5 tạo ra trong bài và trong các kiểm của máy chấm. Có sẵn <code>STATUS_TEXT</code> và <code>utf8Length</code>.</p>`,
  dauVao: ['res — a raw response with writeHead(status, headers) and end(body)', 'res — response thuần có writeHead(status, headers) và end(body)'], dauRa: ['res, with status/json/send/sendStatus', 'res, có status/json/send/sendStatus'],
  goiY: [['Write one private finish(type, body) that every sender calls: it handles 204, the two headers, writeHead and end.', 'Viết một hàm riêng finish(type, body) mà mọi hàm gửi đều gọi: nó lo 204, hai header, writeHead và end.'], ['status() must return res — that is the whole trick behind chaining.', 'status() phải trả về res — đó là toàn bộ bí quyết của việc nối tiếp.'], ['After the string and null checks, send can simply return res.json(body).', 'Sau khi xét chuỗi và null, send chỉ cần return res.json(body).']],
  loi: [['status() calling writeHead right away: the later json() then writes headers twice (ERR_HTTP_HEADERS_SENT).', 'status() gọi writeHead ngay: json() sau đó ghi header hai lần (ERR_HTTP_HEADERS_SENT).'], ['Content-Length from body.length: wrong for "Ghi chú".', 'Content-Length từ body.length: sai với "Ghi chú".'], ['typeof null === "object" — send(null) must not become the JSON text "null".', 'typeof null === "object" — send(null) không được thành chữ JSON "null".'], ['send(42) as text/html: Express 5 sends numbers as JSON.', 'send(42) dạng text/html: Express 5 gửi số dạng JSON.']],
  gt: ['This is roughly what <code>express/lib/response.js</code> does: <code>status</code> stores, <code>json</code> stringifies and delegates to <code>send</code>, <code>send</code> picks a Content-Type and computes Content-Length, and the 204 branch strips the body. Express adds ETag, HEAD handling and charset negotiation on top — but there is no magic underneath, only <code>writeHead</code> and <code>end</code>.', 'Đây đại khái là việc <code>express/lib/response.js</code> làm: <code>status</code> cất mã, <code>json</code> stringify rồi giao cho <code>send</code>, <code>send</code> chọn Content-Type và tính Content-Length, và nhánh 204 bỏ thân. Express thêm ETag, xử lý HEAD và thương lượng charset ở trên — nhưng bên dưới không có phép màu nào, chỉ <code>writeHead</code> và <code>end</code>.'],
  kn: ['Express', 'http'], tns: [tn('method chaining', 'gọi nối tiếp'), tn('thin layer', 'lớp mỏng phủ lên')],
  chung: `${FAKE_RAW_RES}
function wire(fn) { const res = attachHelpers(mkRes()); fn(res); return res.rec; }`,
  dau: `${STATUS}
/** add status/json/send/sendStatus to a raw node:http response */
function attachHelpers(res) {
  // Write your solution here — status() sends too early
  res.status = function (code) { res.writeHead(code); return res; };
  res.json = function (obj) { res.end(JSON.stringify(obj)); return res; };
  res.send = function (body) { res.end(String(body)); return res; };
  res.sendStatus = function (code) { res.writeHead(code); res.end(STATUS_TEXT[code]); return res; };
  return res;
}
`,
  giai: `${STATUS}
// Reference solution — status() only remembers; one finish() writes headers and body
${nguon(attachHelpers)}`,
  cases: [
    { goi: 'wire((res) => res.json({ status: "ok", uptime: 1.23 }))', moTa: ['res.json: the lesson’s /health (Content-Length 29)', 'res.json: /health của bài (Content-Length 29)'] },
    { goi: 'wire((res) => res.status(201).json({ id: 7 }))', moTa: ['status() chains, sends once', 'status() nối tiếp, gửi một lần'] },
    { goi: 'wire((res) => res.send("xin chao"))', moTa: ['send(string) → text/html', 'send(chuỗi) → text/html'] },
    { goi: 'wire((res) => res.sendStatus(201))', an: true },
    { goi: '[wire((res) => res.status(204).json({ a: 1 })), wire((res) => res.status(204).send("x"))]', an: true },
    { goi: '[wire((res) => res.send({ title: "Ghi chú" })), wire((res) => res.send(null)), wire((res) => res.status(404).send(42))]', an: true },
    { goi: 'wire((res) => { const r = res.status(422); r.json({ error: "title is required" }); })', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-1-tu-http-toi-express', ten: '5.1 From raw http to Express', khoa: KHOA, baiHoc: 'nodejs-5-1-tu-http-toi-express', de: [E1, E2, E3, E4, E5] });
