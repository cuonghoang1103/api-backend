/** Node.js 3.5 — Server HTTP không framework: định tuyến tay, gom body từ stream, gửi JSON đúng Content-Length, kết thúc đúng một lần. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, goi, FAKE_REQ, FAKE_RAW_RES } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '3.5 · What the raw http module makes you do', kho: 'EASY', phut: 6,
  en: 'Questions on the lesson’s 25-line Notes server and the four things that were painful. The error codes were measured on Node 22.',
  vi: 'Các câu về server Notes 25 dòng của bài và bốn điều gây khổ. Các mã lỗi đã đo trên Node 22.',
  cau: [
    q('c1', ['Why does the POST branch collect <code>data</code> events before parsing?', 'Vì sao nhánh POST phải gom các sự kiện <code>data</code> trước khi parse?'],
      ['req is a readable stream: the body arrives in chunks, and only "end" means it is complete', 'Node limits every data event to one character of the body', 'JSON.parse cannot read strings longer than 64 KB', 'The client sends the headers again inside the body'],
      ['Exactly lesson 3.3: req is a Readable. Parsing the first chunk would parse half a JSON document.', 'Đúng bài 3.3: req là một Readable. Parse chunk đầu là parse nửa tài liệu JSON.']),
    q('c2', ['A branch sends a response but forgets <code>return</code>; execution falls through to the 404 branch, which calls <code>res.writeHead(404, …)</code>. On Node 22 you get…', 'Một nhánh gửi phản hồi nhưng quên <code>return</code>; code chạy tiếp xuống nhánh 404, nơi gọi <code>res.writeHead(404, …)</code>. Trên Node 22 bạn nhận…'],
      ['ERR_HTTP_HEADERS_SENT thrown — with no handler around it, the process goes down', 'A second, separate HTTP response with status 404', 'Nothing: Node ignores writeHead after the response ended', 'The status of the first response silently changes to 404'],
      ['Measured: “Cannot write headers after they are sent to the client”. Writing a body after end() instead gives ERR_STREAM_WRITE_AFTER_END. Either way, with no framework to catch it the server crashes.', 'Đo được: “Cannot write headers after they are sent to the client”. Ghi thân sau end() thì ra ERR_STREAM_WRITE_AFTER_END. Kiểu nào thì khi không có framework bắt, server cũng sập.']),
    q('c3', ['A malformed body like <code>{title:}</code> reaches <code>JSON.parse(body)</code> inside the <code>end</code> callback. What happens?', 'Một body hỏng như <code>{title:}</code> tới <code>JSON.parse(body)</code> bên trong callback <code>end</code>. Chuyện gì xảy ra?'],
      ['A SyntaxError is thrown in a callback no try/catch wraps — it kills the process', 'Node answers 400 Bad Request automatically', 'JSON.parse returns undefined and the note is saved empty', 'The request is retried after the next data event'],
      ['There is no framework layer to turn a throw into a 400. Chapter 1 showed an uncaught throw ends the process — for every visitor, not just this one.', 'Không có tầng framework nào biến một throw thành 400. Chương 1 đã cho thấy throw không ai bắt kết thúc tiến trình — cho mọi người dùng, không chỉ người này.']),
    q('c4', ['You forget <code>res.end()</code> on one branch. The client…', 'Bạn quên <code>res.end()</code> ở một nhánh. Client…'],
      ['waits until it times out — the response never finishes', 'receives an empty 200 response immediately', 'receives a 500 from Node after 30 seconds', 'is disconnected and the server logs ERR_STREAM_PREMATURE_CLOSE'],
      ['Every response must end exactly once. No end = a hanging request and a connection kept open.', 'Mọi phản hồi phải kết thúc đúng một lần. Không end = request treo và một kết nối bị giữ mở.']),
    q('c5', ['Which of these does Express give you that the lesson’s server had to write by hand?', 'Cái nào trong số này Express cho sẵn mà server của bài phải tự viết?'],
      ['Body parsing, a router with parameters, an error layer, and res.json()', 'TCP connections, keep-alive, and HTTP/1.1 parsing', 'A database, sessions, and user accounts', 'Streaming, Buffers, and the event loop'],
      ['The four annoyances map almost exactly to the four things Express adds. TCP, HTTP parsing and streams come from node:http itself — Express sits on top of it.', 'Bốn điều phiền gần như khớp đúng bốn thứ Express thêm vào. TCP, phân tích HTTP và stream đến từ chính node:http — Express nằm trên nó.']),
  ],
  goiY: [['Re-read the lesson’s “Notice what was painful” table.', 'Đọc lại bảng “Notice what was painful” của bài.'], ['Think about what is still running after the line you are looking at.', 'Nghĩ xem còn gì đang chạy sau dòng bạn đang nhìn.']],
  loi: [['Believing Node turns a throw in a callback into a 500.', 'Tưởng Node biến một throw trong callback thành 500.'], ['Thinking a missing return only wastes a little CPU.', 'Tưởng thiếu return chỉ tốn chút CPU.']],
  tns: [tn('readable stream', 'stream đọc'), tn('writable stream', 'stream ghi'), tn('ERR_HTTP_HEADERS_SENT', 'lỗi gửi header lần hai')],
  kn: ['http'],
});

/* ─── 2. định tuyến bằng tay ─── */
function route(method, rawUrl) {
  // req.url is only "/notes/7?full=1" — URL needs a base to parse it
  const url = new URL(rawUrl, 'http://localhost');
  const query = Object.fromEntries(url.searchParams);
  const parts = url.pathname.split('/').slice(1);       // "/notes/7" → ["notes", "7"]
  if (parts.length === 1 && parts[0] === 'notes') {
    if (method === 'GET') return { route: 'list', params: {}, query };
    if (method === 'POST') return { route: 'create', params: {}, query };
  }
  if (parts.length === 2 && parts[0] === 'notes' && method === 'GET') {
    const id = Number(parts[1]);
    // a URL has no types: "abc" is a string like any other — check it
    if (!Number.isInteger(id) || id < 1) return { route: 'badId', params: { id: parts[1] }, query };
    return { route: 'get', params: { id }, query };
  }
  return { route: 'notFound', params: {}, query };
}
const E2 = nodeBai({
  ten: '3.5 · Route by hand: method, path, :id and the query', kho: 'EASY', phut: 12,
  en: `<p>“Routing is manual. Every route is an if.” Write the router of the lesson’s server as one function <code>route(method, rawUrl)</code> (rawUrl is <code>req.url</code>, e.g. <code>"/notes/7?full=1"</code>). Return <code>{ route, params, query }</code>:</p>
<table><thead><tr><th>request</th><th>route</th><th>params</th></tr></thead><tbody>
<tr><td>GET /notes</td><td>"list"</td><td>{}</td></tr><tr><td>POST /notes</td><td>"create"</td><td>{}</td></tr>
<tr><td>GET /notes/7</td><td>"get"</td><td>{ id: 7 } (a number)</td></tr><tr><td>GET /notes/abc</td><td>"badId"</td><td>{ id: "abc" } (the raw text)</td></tr>
<tr><td>anything else</td><td>"notFound"</td><td>{}</td></tr></tbody></table>
<p><code>query</code> is the query string as an object of strings (<code>Object.fromEntries(url.searchParams)</code>). Paths match exactly: <code>/notes/</code> is not <code>/notes</code> — one of the things a framework will smooth over later. A valid id is an integer ≥ 1.</p>`,
  vi: `<p>“Định tuyến là thủ công. Mỗi route là một câu if.” Viết bộ định tuyến của server trong bài thành một hàm <code>route(method, rawUrl)</code> (rawUrl là <code>req.url</code>, vd <code>"/notes/7?full=1"</code>). Trả về <code>{ route, params, query }</code>:</p>
<table><thead><tr><th>request</th><th>route</th><th>params</th></tr></thead><tbody>
<tr><td>GET /notes</td><td>"list"</td><td>{}</td></tr><tr><td>POST /notes</td><td>"create"</td><td>{}</td></tr>
<tr><td>GET /notes/7</td><td>"get"</td><td>{ id: 7 } (số)</td></tr><tr><td>GET /notes/abc</td><td>"badId"</td><td>{ id: "abc" } (chữ gốc)</td></tr>
<tr><td>còn lại</td><td>"notFound"</td><td>{}</td></tr></tbody></table>
<p><code>query</code> là query string dạng object các chuỗi (<code>Object.fromEntries(url.searchParams)</code>). Đường dẫn khớp chính xác: <code>/notes/</code> không phải <code>/notes</code> — một trong những thứ framework sẽ làm mượt sau này. id hợp lệ là số nguyên ≥ 1.</p>`,
  dauVao: ['method — "GET" | "POST" | …; rawUrl — path + optional query', 'method — "GET" | "POST" | …; rawUrl — đường dẫn + query (nếu có)'], dauRa: ['{ route, params, query }', '{ route, params, query }'],
  goiY: [['new URL(rawUrl, "http://localhost") gives you .pathname and .searchParams.', 'new URL(rawUrl, "http://localhost") cho bạn .pathname và .searchParams.'], ['pathname.split("/").slice(1): "/notes/7" → ["notes", "7"], "/notes/" → ["notes", ""].', 'pathname.split("/").slice(1): "/notes/7" → ["notes", "7"], "/notes/" → ["notes", ""].'], ['Number("abc") is NaN, Number("") is 0, Number("1.5") is 1.5 — Number.isInteger(id) && id >= 1 rejects all three.', 'Number("abc") là NaN, Number("") là 0, Number("1.5") là 1.5 — Number.isInteger(id) && id >= 1 loại cả ba.']],
  loi: [['Comparing req.url === "/notes": "/notes?page=2" no longer matches.', 'So req.url === "/notes": "/notes?page=2" không còn khớp.'], ['Returning id as the string "7": later comparisons with note.id === 7 fail.', 'Trả id là chuỗi "7": các phép so note.id === 7 sau đó trượt.'], ['parseInt("7abc") is 7 — a typo in the URL silently reads note 7.', 'parseInt("7abc") là 7 — gõ nhầm URL lại âm thầm đọc ghi chú 7.']],
  gt: ['This is the pain the lesson lists first. Two branches already need the path split, a type conversion and a check — and there is no way to declare “/notes/:id” once. Express’s router is precisely this function, generalised (lesson 5.2).', 'Đây là nỗi khổ bài liệt kê đầu tiên. Mới hai nhánh đã cần tách đường dẫn, đổi kiểu và kiểm tra — và không có cách nào khai báo “/notes/:id” một lần. Router của Express chính là hàm này, được tổng quát hoá (bài 5.2).'],
  kn: ['http', 'routing'], tns: [tn('pathname', 'phần đường dẫn của URL'), tn('query string', 'chuỗi truy vấn'), tn('path parameter', 'tham số đường dẫn')],
  dau: `/** the router of the raw server: { route, params, query } */
function route(method, rawUrl) {
  // Write your solution here — comparing the raw url breaks on every query string
  if (method === 'GET' && rawUrl === '/notes') return { route: 'list', params: {}, query: {} };
  if (method === 'POST' && rawUrl === '/notes') return { route: 'create', params: {}, query: {} };
  return { route: 'notFound', params: {}, query: {} };
}
`,
  giai: '// Reference solution — parse once, then one if per route\n' + nguon(route),
  cases: [
    { goi: goi('route', 'GET', '/notes'), moTa: ['List', 'Danh sách'] },
    { goi: goi('route', 'GET', '/notes?page=2&full=1'), moTa: ['A query string does not change the route', 'Query string không đổi route'] },
    { goi: goi('route', 'GET', '/notes/7'), moTa: ['Path parameter becomes a number', 'Tham số đường dẫn thành số'] },
    { goi: goi('route', 'POST', '/notes'), an: true },
    { goi: goi('route', 'GET', '/notes/abc'), an: true },
    { goi: goi('route', 'GET', '/notes/7abc'), an: true },
    { goi: goi('route', 'DELETE', '/notes'), an: true },
    { goi: goi('route', 'GET', '/notes/'), an: true },
    { goi: goi('route', 'GET', '/notes/0?x=1'), an: true },
    { goi: goi('route', 'GET', '/health'), an: true },
  ],
});

/* ─── 3. gom body ─── */
const UTF8 = `// ── provided helper (lesson 3.2): UTF-8 size of a string ──
function utf8Length(str) {
  let n = 0;
  for (const ch of str) { const cp = ch.codePointAt(0); n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4; }
  return n;
}
`;
function readJsonBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    let done = false;                       // settle once, even if more events arrive
    const fail = (status, message) => { done = true; reject(Object.assign(new Error(message), { status })); };
    req.on('data', (chunk) => {
      if (done) return;
      size += utf8Length(chunk);
      if (size > limitBytes) {
        req.destroy();                      // stop reading: do not buffer the rest of a 2 GB upload
        return fail(413, 'Body too large');
      }
      body += chunk;
    });
    req.on('end', () => {
      if (done) return;
      if (body === '') { done = true; return resolve({}); }
      try {
        const value = JSON.parse(body);     // a throw HERE would kill the process — catch it
        done = true;
        resolve(value);
      } catch {
        fail(400, 'Invalid JSON');
      }
    });
  });
}
const RUN_BODY = `${FAKE_REQ}
async function body(chunks, limit) { const req = mkReq('POST', '/notes', chunks); try { return { ok: await readJsonBody(req, limit), destroyed: req.destroyed }; } catch (e) { return { status: e.status, message: e.message, destroyed: req.destroyed }; } }`;
const E3 = nodeBai({
  ten: '3.5 · Collect a JSON body from the request stream', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson’s POST branch: <code>let body = ''; req.on('data', c =&gt; body += c); req.on('end', () =&gt; JSON.parse(body) …)</code> — no size limit and no error safety. Write <code>readJsonBody(req, limitBytes)</code> returning a Promise:</p>
<ul><li>collect the <code>data</code> chunks (strings); on <code>end</code>, resolve the parsed JSON (an empty body resolves <code>{}</code>);</li><li>malformed JSON → reject with an Error whose <code>status</code> is <code>400</code> and message <code>"Invalid JSON"</code> — never let <code>JSON.parse</code> throw out of the callback;</li><li>as soon as the total size goes over <code>limitBytes</code> <b>UTF-8 bytes</b>, call <code>req.destroy()</code> and reject with <code>status 413</code>, message <code>"Body too large"</code>.</li></ul><p><code>utf8Length(str)</code> from lesson 3.2 is provided.</p>`,
  vi: `<p>Nhánh POST của bài: <code>let body = ''; req.on('data', c =&gt; body += c); req.on('end', () =&gt; JSON.parse(body) …)</code> — không giới hạn kích thước, không an toàn lỗi. Viết <code>readJsonBody(req, limitBytes)</code> trả về một Promise:</p>
<ul><li>gom các chunk <code>data</code> (chuỗi); khi <code>end</code>, resolve JSON đã parse (body rỗng resolve <code>{}</code>);</li><li>JSON hỏng → reject một Error có <code>status</code> <code>400</code> và message <code>"Invalid JSON"</code> — không bao giờ để <code>JSON.parse</code> ném ra khỏi callback;</li><li>ngay khi tổng kích thước vượt <code>limitBytes</code> <b>byte UTF-8</b>, gọi <code>req.destroy()</code> và reject với <code>status 413</code>, message <code>"Body too large"</code>.</li></ul><p>Có sẵn <code>utf8Length(str)</code> từ bài 3.2.</p>`,
  dauVao: ['req — emits "data" (string chunks) then "end"; has destroy()', 'req — phát "data" (chunk chuỗi) rồi "end"; có destroy()'], dauRa: ['Promise of the parsed body, or rejected with err.status 400 / 413', 'Promise của body đã parse, hoặc reject với err.status 400 / 413'],
  goiY: [['Wrap the two listeners in new Promise((resolve, reject) => …).', 'Bọc hai listener trong new Promise((resolve, reject) => …).'], ['try { resolve(JSON.parse(body)) } catch { reject(…) } inside the end listener.', 'try { resolve(JSON.parse(body)) } catch { reject(…) } bên trong listener end.'], ['Count bytes with utf8Length(chunk), not chunk.length: the limit is in bytes.', 'Đếm byte bằng utf8Length(chunk), không phải chunk.length: giới hạn tính bằng byte.']],
  loi: [['JSON.parse without try/catch in the end callback — a single bad request crashes the server.', 'JSON.parse không có try/catch trong callback end — một request hỏng làm sập server.'], ['Checking the size only on "end": by then the whole 2 GB body is already in memory.', 'Chỉ kiểm kích thước lúc "end": lúc đó cả body 2 GB đã nằm trong RAM.'], ['Counting chunk.length: 600 Vietnamese characters can be 1,600 bytes.', 'Đếm chunk.length: 600 ký tự tiếng Việt có thể là 1.600 byte.']],
  gt: ['This is what <code>express.json()</code> does for you (with a default limit of 100kb, lesson 5.3). The size check runs per chunk so an attacker cannot make you buffer a huge body, and the parse error becomes a 400 instead of an uncaught exception.', 'Đây là việc <code>express.json()</code> làm giúp bạn (với giới hạn mặc định 100kb, bài 5.3). Phép kiểm kích thước chạy theo từng chunk nên kẻ tấn công không thể bắt bạn đệm một body khổng lồ, và lỗi parse thành 400 thay vì một exception không ai bắt.'],
  kn: ['http', 'streams', 'JSON'], tns: [tn('request body', 'thân request'), tn('payload too large', 'nội dung quá lớn (413)')],
  chung: RUN_BODY,
  dau: `${UTF8}
/** collect req's chunks and parse them as JSON — with a size limit and no crash */
function readJsonBody(req, limitBytes) {
  // Write your solution here — the lesson's version: no limit, and JSON.parse can throw
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => resolve(JSON.parse(body)));
  });
}
`,
  giai: `${UTF8}
// Reference solution — limit per chunk, parse inside try/catch, settle once
${nguon(readJsonBody)}`,
  cases: [
    { goi: 'await body([\'{"title":\', \'"Second note"}\'], 1000)', moTa: ['The lesson’s body, in two chunks', 'Body của bài, chia hai chunk'] },
    { goi: "await body(['{title:}'], 1000)", moTa: ['Malformed JSON → 400, no crash', 'JSON hỏng → 400, không sập'] },
    { goi: 'await body([], 1000)', moTa: ['Empty body → {}', 'Body rỗng → {}'] },
    { goi: "await body(['{\"t\":\"', 'x'.repeat(40), '\"}'], 30)", an: true },
    { goi: "await body(['{\"title\":\"Tiếng Việt có dấu\"}'], 30)", an: true },
    { goi: "await body(['{\"title\":\"ok\"}'], 30)", an: true },
    { goi: "await body(['[1,', '2,', '3]'], 100)", an: true },
  ],
});

/* ─── 4. sendJson ─── */
function sendJson(res, status, data) {
  if (status === 204) {
    // 204 No Content: no body, so no Content-Type and no Content-Length
    res.writeHead(204);
    res.end();
    return;
  }
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': utf8Length(body),            // bytes, not characters
  });
  res.end(body);
}
const RUN_SEND = `${FAKE_RAW_RES}
function send(status, data) { const res = mkRes(); sendJson(res, status, data); return res.rec; }`;
const E4 = nodeBai({
  ten: '3.5 · sendJson: status, Content-Type and the real Content-Length', kho: 'MEDIUM', phut: 12,
  en: `<p>“Repetition everywhere: you write the same headers and JSON.stringify in every branch.” Write the helper every raw server ends up with, <code>sendJson(res, status, data)</code>, on a <code>node:http</code> response:</p>
<ul><li>serialise <code>data</code> with <code>JSON.stringify</code>;</li><li><code>res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': … })</code> — Content-Length is the size in <b>UTF-8 bytes</b> (a note titled “Ghi chú” is longer in bytes than in characters);</li><li><code>res.end(body)</code> — once;</li><li>status <code>204</code> is special: <code>res.writeHead(204)</code> and <code>res.end()</code>, with no body and no content headers.</li></ul><p><code>utf8Length(str)</code> is provided. The fake <code>res</code> records what went on the wire and throws like Node if you write headers twice.</p>`,
  vi: `<p>“Lặp lại khắp nơi: bạn viết cùng các header và JSON.stringify ở mọi nhánh.” Viết hàm phụ mà server thuần nào rồi cũng có, <code>sendJson(res, status, data)</code>, trên một response của <code>node:http</code>:</p>
<ul><li>tuần tự hoá <code>data</code> bằng <code>JSON.stringify</code>;</li><li><code>res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': … })</code> — Content-Length là kích thước tính bằng <b>byte UTF-8</b> (ghi chú tên “Ghi chú” dài hơn khi tính byte so với ký tự);</li><li><code>res.end(body)</code> — một lần;</li><li>status <code>204</code> đặc biệt: <code>res.writeHead(204)</code> và <code>res.end()</code>, không thân và không header nội dung.</li></ul><p>Có sẵn <code>utf8Length(str)</code>. <code>res</code> giả ghi lại những gì lên dây và ném lỗi như Node nếu bạn ghi header hai lần.</p>`,
  dauVao: ['res — a node:http ServerResponse; status — number; data — any JSON value', 'res — ServerResponse của node:http; status — số; data — giá trị JSON bất kỳ'], dauRa: ['nothing (the response is sent)', 'không gì (phản hồi đã được gửi)'],
  goiY: [['Build the body string first; its utf8Length is the Content-Length.', 'Dựng chuỗi body trước; utf8Length của nó là Content-Length.'], ['Handle 204 with an early return before you stringify anything.', 'Xử lý 204 bằng một return sớm trước khi stringify gì cả.']],
  loi: [['"Content-Length": body.length — for “Ghi chú” the client reads fewer bytes than were sent and cuts the JSON.', '"Content-Length": body.length — với “Ghi chú” client đọc ít byte hơn số đã gửi và cắt cụt JSON.'], ['Sending "null" or "{}" with a 204: a 204 has no body by definition.', 'Gửi "null" hay "{}" kèm 204: 204 theo định nghĩa không có thân.']],
  gt: ['This helper is half of what <code>res.json()</code> is in Express (lesson 5.1 shows Express setting the same Content-Type and Content-Length). Getting Content-Length wrong is not cosmetic: a value smaller than the body truncates the response, a larger one makes the client wait for bytes that never come.', 'Hàm này là một nửa của <code>res.json()</code> trong Express (bài 5.1 cho thấy Express đặt đúng Content-Type và Content-Length này). Sai Content-Length không phải chuyện thẩm mỹ: giá trị nhỏ hơn thân làm cụt phản hồi, lớn hơn khiến client chờ những byte không bao giờ tới.'],
  kn: ['http', 'headers'], tns: [tn('Content-Length', 'độ dài nội dung (byte)'), tn('204 No Content', 'thành công, không có nội dung')],
  chung: RUN_SEND,
  dau: `${UTF8}
/** send data as JSON on a raw node:http response */
function sendJson(res, status, data) {
  // Write your solution here
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': body.length });
  res.end(body);
}
`,
  giai: `${UTF8}
// Reference solution — bytes for Content-Length, no body for 204
${nguon(sendJson)}`,
  cases: [
    { goi: 'send(200, [{ id: 1, title: "First note" }])', moTa: ['The lesson’s list response', 'Phản hồi danh sách của bài'] },
    { goi: 'send(201, { id: 2, title: "Ghi chú thứ hai" })', moTa: ['Vietnamese title: bytes ≠ characters', 'Tiêu đề tiếng Việt: byte ≠ ký tự'] },
    { goi: 'send(204, { ignored: true })', moTa: ['204 has no body', '204 không có thân'] },
    { goi: 'send(404, { error: "Not Found" })', an: true },
    { goi: 'send(200, { emoji: "😀", n: 1 })', an: true },
    { goi: 'send(200, "")', an: true },
  ],
});

/* ─── 5. cả server: định tuyến + body + gửi đúng một lần ─── */
function createHandler(notes) {
  return async function handler(req, res) {
    const { route: r, params } = route(req.method, req.url);
    if (r === 'list') return sendJson(res, 200, notes);
    if (r === 'badId') return sendJson(res, 400, { error: 'Invalid id' });
    if (r === 'get') {
      const note = notes.find((n) => n.id === params.id);
      if (!note) return sendJson(res, 404, { error: 'Not Found' });
      return sendJson(res, 200, note);
    }
    if (r === 'create') {
      let input;
      try {
        input = await readJsonBody(req, 1024);
      } catch (err) {
        return sendJson(res, err.status, { error: err.message });   // 400 or 413 — the process stays up
      }
      const title = typeof input.title === 'string' ? input.title.trim() : '';
      if (!title) return sendJson(res, 422, { error: 'title is required' });
      const note = { id: notes.length + 1, title };
      notes.push(note);
      return sendJson(res, 201, note);
    }
    return sendJson(res, 404, { error: 'Not Found' });   // every path ends with exactly one response
  };
}
const HELPERS = `${UTF8}
// ── provided: the three functions of the previous exercises ──
${nguon(route, readJsonBody, sendJson)}`;
const RUN_SERVER = `${FAKE_REQ}
${FAKE_RAW_RES}
async function call(h, method, url, text) { const chunks = []; if (text !== undefined) for (let i = 0; i < text.length; i += 8) chunks.push(text.slice(i, i + 8));
const req = mkReq(method, url, chunks); const res = mkRes(); let thrown = null;
try { await h(req, res); } catch (e) { thrown = e.name + ': ' + e.message; }
await new Promise((r) => setTimeout(r, 200));
const r = res.rec; return { status: r.status, body: r.body ? JSON.parse(r.body) : null, ends: r.ends, errors: r.errors, thrown }; }`;
const E5 = nodeBai({
  ten: '3.5 · The whole raw Notes server, crash-proof', kho: 'HARD', phut: 30,
  en: `<p>Assemble the lesson’s server — and fix what it got wrong. <code>createHandler(notes)</code> returns the <code>async (req, res)</code> you would pass to <code>createServer</code>. The provided helpers are your solutions so far: <code>route</code>, <code>readJsonBody</code>, <code>sendJson</code>.</p>
<table><thead><tr><th>request</th><th>response</th></tr></thead><tbody>
<tr><td>GET /notes</td><td>200, the array</td></tr><tr><td>GET /notes/:id</td><td>200 the note · 404 <code>{ error: "Not Found" }</code> · bad id → 400 <code>{ error: "Invalid id" }</code></td></tr>
<tr><td>POST /notes</td><td>body read with a 1024-byte limit; errors → their status + <code>{ error: err.message }</code>; title missing or blank → 422 <code>{ error: "title is required" }</code>; else 201 <code>{ id: notes.length + 1, title: trimmed }</code>, pushed into <code>notes</code></td></tr>
<tr><td>anything else</td><td>404 <code>{ error: "Not Found" }</code></td></tr></tbody></table>
<p>The grader checks every response: the status, the body, that <code>end()</code> ran <b>exactly once</b>, that Node raised no ERR_HTTP_HEADERS_SENT / ERR_STREAM_WRITE_AFTER_END, and that nothing was thrown.</p>`,
  vi: `<p>Ráp server của bài — và sửa những chỗ nó sai. <code>createHandler(notes)</code> trả về hàm <code>async (req, res)</code> bạn sẽ đưa cho <code>createServer</code>. Các hàm có sẵn là lời giải của các bài trước: <code>route</code>, <code>readJsonBody</code>, <code>sendJson</code>.</p>
<table><thead><tr><th>request</th><th>phản hồi</th></tr></thead><tbody>
<tr><td>GET /notes</td><td>200, mảng ghi chú</td></tr><tr><td>GET /notes/:id</td><td>200 ghi chú · 404 <code>{ error: "Not Found" }</code> · id sai → 400 <code>{ error: "Invalid id" }</code></td></tr>
<tr><td>POST /notes</td><td>đọc body giới hạn 1024 byte; lỗi → status của nó + <code>{ error: err.message }</code>; thiếu title hoặc toàn khoảng trắng → 422 <code>{ error: "title is required" }</code>; còn lại 201 <code>{ id: notes.length + 1, title: đã trim }</code>, push vào <code>notes</code></td></tr>
<tr><td>còn lại</td><td>404 <code>{ error: "Not Found" }</code></td></tr></tbody></table>
<p>Máy chấm kiểm mọi phản hồi: status, thân, <code>end()</code> chạy <b>đúng một lần</b>, Node không báo ERR_HTTP_HEADERS_SENT / ERR_STREAM_WRITE_AFTER_END, và không có gì bị ném ra.</p>`,
  dauVao: ['a sequence of requests on one handler', 'một chuỗi request trên cùng một handler'], dauRa: ['one complete response per request', 'mỗi request một phản hồi hoàn chỉnh'],
  yc: [['Every branch ends with return sendJson(…).', 'Mọi nhánh kết thúc bằng return sendJson(…).'], ['await readJsonBody inside try/catch — its rejections are 400/413 responses, not crashes.', 'await readJsonBody bên trong try/catch — reject của nó là phản hồi 400/413, không phải sập.']],
  goiY: [['Start with const { route: r, params } = route(req.method, req.url) and one if per route.', 'Bắt đầu bằng const { route: r, params } = route(req.method, req.url) và một if mỗi route.'], ['Write return in front of every sendJson — then a forgotten branch can never fall through into the 404.', 'Viết return trước mọi sendJson — khi đó không nhánh nào rơi xuống 404 được.'], ['Validate after parsing: typeof input.title === "string" and input.title.trim() !== "".', 'Kiểm sau khi parse: typeof input.title === "string" và input.title.trim() !== "".']],
  loi: [['A branch without return: the 404 at the bottom runs too — ERR_HTTP_HEADERS_SENT.', 'Một nhánh thiếu return: 404 ở cuối cũng chạy — ERR_HTTP_HEADERS_SENT.'], ['JSON.parse straight in an "end" listener: a malformed body throws where nobody catches it.', 'JSON.parse thẳng trong listener "end": body hỏng ném ở chỗ không ai bắt.'], ['Accepting { "title": "   " } as a title.', 'Chấp nhận { "title": "   " } làm tiêu đề.']],
  gt: ['Each check replays a request on a fake <code>req</code> (a stream emitting 8-character chunks) and a fake <code>res</code> that throws exactly like Node 22 on a second writeHead. The structure — one router, one body reader, one sender, and a return on every branch — is exactly what Express turns into <code>app.get</code>, <code>express.json()</code> and <code>res.json()</code> in chapter 5.', 'Mỗi kiểm phát lại một request trên <code>req</code> giả (stream phát chunk 8 ký tự) và <code>res</code> giả ném lỗi đúng như Node 22 khi writeHead lần hai. Cấu trúc — một router, một bộ đọc body, một hàm gửi, và return ở mọi nhánh — chính là thứ Express biến thành <code>app.get</code>, <code>express.json()</code> và <code>res.json()</code> ở chương 5.'],
  kn: ['http', 'error handling'], tns: [tn('request handler', 'hàm xử lý request'), tn('fall through', 'chạy lọt xuống nhánh sau'), tn('422 Unprocessable Entity', 'dữ liệu không hợp lệ')],
  chung: RUN_SERVER,
  dau: `${HELPERS}
/** the lesson's server, as a handler — make it crash-proof */
function createHandler(notes) {
  // Write your solution here — this is the lesson's code: no return, and JSON.parse in a callback
  return function handler(req, res) {
    const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
    if (req.method === 'GET' && url.pathname === '/notes') {
      sendJson(res, 200, notes);
    }
    if (req.method === 'POST' && url.pathname === '/notes') {
      let body = '';
      req.on('data', (c) => { body += c; });
      req.on('end', () => {
        const note = { id: notes.length + 1, ...JSON.parse(body) };
        notes.push(note);
        sendJson(res, 201, note);
      });
      return;
    }
    sendJson(res, 404, { error: 'Not Found' });
  };
}
`,
  giai: `${HELPERS}
// Reference solution — one response per path, every error turned into a status
${nguon(createHandler)}`,
  cases: [
    { chuanBi: 'const h = createHandler([{ id: 1, title: "First note" }]);', goi: 'await call(h, "GET", "/notes")', moTa: ['GET /notes: exactly one response', 'GET /notes: đúng một phản hồi'] },
    { chuanBi: 'const notes = [{ id: 1, title: "First note" }]; const h = createHandler(notes);', goi: '[await call(h, "POST", "/notes", \'{"title":"  Second note "}\'), await call(h, "GET", "/notes")]', moTa: ['POST then GET (the lesson’s curl session)', 'POST rồi GET (phiên curl của bài)'] },
    { chuanBi: 'const h = createHandler([]);', goi: 'await call(h, "POST", "/notes", "{title:}")', moTa: ['Malformed JSON → 400 and the server survives', 'JSON hỏng → 400 và server sống'] },
    { chuanBi: 'const h = createHandler([{ id: 1, title: "a" }]);', goi: '[await call(h, "GET", "/notes/1"), await call(h, "GET", "/notes/9"), await call(h, "GET", "/notes/x")]', an: true },
    { chuanBi: 'const h = createHandler([]);', goi: '[await call(h, "POST", "/notes", \'{"title":"   "}\'), await call(h, "POST", "/notes", \'{"body":"no title"}\'), await call(h, "POST", "/notes", \'{"title":5}\')]', an: true },
    { chuanBi: 'const h = createHandler([]);', goi: 'await call(h, "POST", "/notes", JSON.stringify({ title: "x".repeat(2000) }))', an: true },
    { chuanBi: 'const h = createHandler([]);', goi: '[await call(h, "DELETE", "/notes"), await call(h, "GET", "/nope")]', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-5-http-server', ten: '3.5 An HTTP server with no framework', khoa: KHOA, baiHoc: 'nodejs-3-5-http-server', de: [E1, E2, E3, E4, E5] });
