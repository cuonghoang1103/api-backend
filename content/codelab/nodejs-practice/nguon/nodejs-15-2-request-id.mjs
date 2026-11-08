/** Node.js 15.2 — Request id: một mã xuyên mọi tầng, AsyncLocalStorage, dùng lại mã được gửi tới, giới hạn 64 ký tự. */
import { modul, cs, q, qn, tn, jsBai, nguon, RES_GIA } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Correlation: what one id fixes, and what a global variable breaks', kho: 'EASY', phut: 7,
  en: 'Questions on the measurements of lesson 15.2: three concurrent requests, the global-variable shortcut, the cost of AsyncLocalStorage and the rules for inbound ids.',
  vi: 'Câu hỏi về các phép đo của bài 15.2: ba request đồng thời, lối tắt biến toàn cục, chi phí của AsyncLocalStorage và luật cho mã được gửi tới.',
  cau: [
    q('c1', ['Three users hit GET /notes at the same moment and the log has 18 lines in a scrambled order. Adding a request id changes what?', 'Ba người dùng gọi GET /notes cùng lúc và log có 18 dòng trộn lẫn. Thêm request id thay đổi điều gì?'],
      ['The lines stay interleaved, but grep &lt;id&gt; rebuilds one complete request in order', 'The lines come out grouped per request, because Node now runs them one by one', 'Nothing in the file changes; the id only appears in the HTTP response header', 'The repo and service lines disappear, only the route line remains per request'],
      ['Interleaving is what concurrency looks like and cannot change. The id is what lets you rebuild each story from a pile of steps.', 'Xen kẽ là hình dạng của chạy đồng thời và không đổi được. Mã id là thứ cho phép dựng lại từng câu chuyện từ một đống bước.']),
    q('c2', ['Why did global.currentReqId = id put the wrong id on 6 of 18 lines?', 'Vì sao global.currentReqId = id gắn sai id cho 6 trên 18 dòng?'],
      ['Request A hits an await, B and C overwrite the global, A resumes and logs with C’s id', 'The global is copied per request by V8, but the copy is made after the first await', 'Express clears globals between middlewares, so later layers read an empty value', 'randomUUID() returned the same id twice, so two requests shared one value'],
      ['Requests overlap at every await. The result is the most expensive kind of wrong: every line has an id, so you trust it, and it lies.', 'Các request chồng lên nhau ở mỗi await. Kết quả là kiểu sai đắt nhất: dòng nào cũng có id nên bạn tin, và nó nói dối.']),
    q('c3', ['Measured with autocannon: baseline 16,042 req/s, randomUUID + req.id 15,391, AsyncLocalStorage 15,078, ALS + child logger 15,231. The conclusion?', 'Đo bằng autocannon: gốc 16.042 req/s, randomUUID + req.id 15.391, AsyncLocalStorage 15.078, ALS + logger con 15.231. Kết luận?'],
      ['The three instrumented rows are within noise: the cost is the extra middleware and field, not ALS', 'ALS costs 6%, so pass reqId as a parameter instead on any busy route', 'The child logger makes ALS faster, so always create one per request', 'randomUUID is the expensive part, so switch every id to a counter'],
      ['The bad reputation came from the old async_hooks API. Since Node 16 the promise-context path is heavily optimised: use AsyncLocalStorage.', 'Tiếng xấu đến từ API async_hooks cũ. Từ Node 16 đường ngữ cảnh promise đã được tối ưu mạnh: hãy dùng AsyncLocalStorage.']),
    q('c4', ['curl sends a 20,000-character X-Request-ID. What happened in the lesson?', 'curl gửi X-Request-ID dài 20.000 ký tự. Trong bài chuyện gì đã xảy ra?'],
      ['Node itself answered 431 Request Header Fields Too Large; the middleware never ran', 'The middleware truncated it to 64 characters and logged the shortened value', 'Express accepted it and wrote all 20,000 characters into every log line', 'nginx rewrote it into a new nanoid before the request reached Node'],
      ['Node’s default header limit is 16 KB (http.maxHeaderSize = 16384 in Node 22). Below that the middleware’s own rule applies: ≤ 64 characters is reused, longer is replaced. Trust, but truncate.', 'Giới hạn header mặc định của Node là 16 KB (http.maxHeaderSize = 16384 ở Node 22). Dưới mức đó thì luật của middleware áp dụng: ≤ 64 ký tự thì dùng lại, dài hơn thì thay. Tin, nhưng cắt.']),
    qn('c5', ['Where should the id go so that “it broke” becomes actionable? (choose all that apply)', 'Mã id nên đi tới đâu để câu “nó hỏng rồi” thành thứ xử lý được? (chọn mọi câu đúng)'],
      ['The response header, listed in Access-Control-Expose-Headers', 'The error body of the API, so support can paste it into a ticket', 'The BullMQ job payload, so a job ten minutes later traces back', 'A Prometheus label on http_requests_total, so dashboards show it'],
      [0, 1, 2],
      ['Every report about a request can carry it — header, error body, Sentry tag, SQL comment, job payload, outgoing calls. Never a metric label: one series per request id is the cardinality bomb of lesson 15.4.', 'Mọi thứ báo cáo về một request đều có thể mang nó — header, body lỗi, tag Sentry, chú thích SQL, payload job, lời gọi ra ngoài. Không bao giờ là nhãn metric: mỗi request id một chuỗi thời gian là quả bom cardinality của bài 15.4.']),
  ],
  goiY: [['Think about what happens at every await when two requests overlap.', 'Nghĩ xem chuyện gì xảy ra ở mỗi await khi hai request chồng nhau.'], ['Compare the three instrumented rows with each other, not with the baseline.', 'So ba dòng có đo đạc với nhau, không so với dòng gốc.']],
  loi: [['Using a global variable for per-request data: it looks right and lies.', 'Dùng biến toàn cục cho dữ liệu theo request: trông đúng và nói dối.'], ['Generating a new id at every hop, so one request through three services has three ids.', 'Sinh id mới ở mỗi chặng, nên một request qua ba dịch vụ có ba id.']],
  tns: [tn('request id', 'mã request', 'one id stamped at the door and carried by every line'), tn('AsyncLocalStorage', 'AsyncLocalStorage', 'node:async_hooks — context that survives await'), tn('ambient context', 'ngữ cảnh ngầm', 'data every layer needs but no function signature should carry')],
  kn: ['logging', 'AsyncLocalStorage', 'concurrency'],
});

function pickRequestId(inbound, gen) {
  // Dùng lại mã nginx/dịch vụ trước gửi tới — nếu là chuỗi 1..64 ký tự; không thì sinh mã mới.
  // Header do kẻ tấn công kiểm soát: tin, nhưng cắt (website dùng đúng giới hạn 64).
  if (typeof inbound === 'string' && inbound.length > 0 && inbound.length <= 64) return inbound;
  return gen();
}
const E2 = await jsBai({
  ten: 'pickRequestId(inbound, gen): reuse the id you were given, at most 64 characters', kho: 'EASY', phut: 6,
  en: '<p>Do not generate a new id at every hop. Write <code>pickRequestId(inbound, gen)</code>: <code>inbound</code> is the value of the <code>x-request-id</code> header (a string, or <code>undefined</code> when absent); <code>gen</code> is a function that makes a new id. Return <code>inbound</code> when it is a non-empty string of <b>at most 64</b> characters; otherwise return <code>gen()</code>. Call <code>gen</code> only when you need it.</p>',
  vi: '<p>Đừng sinh id mới ở mỗi chặng. Viết <code>pickRequestId(inbound, gen)</code>: <code>inbound</code> là giá trị header <code>x-request-id</code> (chuỗi, hoặc <code>undefined</code> khi không có); <code>gen</code> là hàm sinh id mới. Trả về <code>inbound</code> khi đó là chuỗi khác rỗng dài <b>tối đa 64</b> ký tự; không thì trả về <code>gen()</code>. Chỉ gọi <code>gen</code> khi cần.</p>',
  goiY: [['Three conditions: typeof === "string", length > 0, length <= 64.', 'Ba điều kiện: typeof === "string", length > 0, length <= 64.'], ['64 characters exactly is still accepted; 65 is replaced (the lesson’s curl test).', 'Đúng 64 ký tự vẫn nhận; 65 thì thay (phép thử curl trong bài).']],
  loi: [['Always generating a fresh id: the nginx id and the backend id no longer match, so grep finds half the story.', 'Luôn sinh id mới: id của nginx và id của backend không còn khớp, nên grep chỉ thấy nửa câu chuyện.'], ['Trusting any length: an attacker-controlled header goes into every log line you store.', 'Tin mọi độ dài: một header do kẻ tấn công kiểm soát đi vào mọi dòng log bạn lưu.']],
  gt: ['Reusing the inbound id is what makes one request keep one id across nginx, the backend and any service it calls. The length check is the “trust, but truncate” rule: anything longer than 64 characters is not an id you want in a log store.', 'Dùng lại id được gửi tới giúp một request giữ một id xuyên nginx, backend và mọi dịch vụ nó gọi. Kiểm độ dài là luật “tin, nhưng cắt”: thứ dài hơn 64 ký tự không phải id bạn muốn có trong kho log.'],
  kn: ['request id', 'input validation'],
  tns: [tn('inbound header', 'header gửi tới', 'set by the client or the proxy in front of you'), tn('hop', 'chặng', 'one process the request passes through')],
  dau: `/** reuse the inbound X-Request-ID, or generate one */
function pickRequestId(inbound, gen) {
  // Write your solution here
  return inbound || gen();
}
`,
  giai: '// Reference solution\n' + nguon(pickRequestId),
  cases: [
    { goi: 'pickRequestId("from-nginx-7f3a", () => "NEW")', moTa: ['An id from nginx is reused as is', 'Id từ nginx được dùng lại nguyên vẹn'] },
    { goi: 'pickRequestId(undefined, () => "mJumRwAigpAO")', moTa: ['No header: a new id', 'Không có header: id mới'] },
    { goi: 'pickRequestId("x".repeat(65), () => "NEW")', an: true },
    { goi: 'pickRequestId("y".repeat(64), () => "NEW")', an: true },
    { chuanBi: 'let calls = 0; const gen = () => { calls++; return "g" + calls; };', goi: '[pickRequestId("", gen), pickRequestId("ok", gen), calls]', an: true },
  ],
});

function requestId(gen) {
  return (req, res, next) => {
    const inbound = req.headers['x-request-id'];          // Node đưa tên header về chữ thường
    const id = typeof inbound === 'string' && inbound.length > 0 && inbound.length <= 64 ? inbound : gen();
    req.id = id;                                           // route nào cũng đọc được
    res.setHeader('X-Request-ID', id);                     // trả lại cho người dùng — kể cả khi lỗi
    // Không có dòng này thì JavaScript của frontend KHÔNG đọc được header (CORS) ⇒ không hiện id trong thông báo lỗi.
    const cur = res.headers['access-control-expose-headers'];
    if (!cur) res.setHeader('Access-Control-Expose-Headers', 'X-Request-ID');
    else if (!/(^|,)\s*x-request-id\s*(,|$)/i.test(cur)) res.setHeader('Access-Control-Expose-Headers', `${cur}, X-Request-ID`);
    next();
  };
}
const E3 = await jsBai({
  ten: 'requestId(gen): the middleware at position 1b of src/index.ts', kho: 'MEDIUM', phut: 14,
  en: '<p>Write the factory <code>requestId(gen)</code> that returns an Express middleware <code>(req, res, next)</code>:</p><ol><li>take <code>req.headers["x-request-id"]</code>; reuse it if it is a non-empty string of at most 64 characters, otherwise <code>gen()</code>;</li><li>store it as <code>req.id</code>;</li><li>echo it with <code>res.setHeader("X-Request-ID", id)</code>;</li><li>make sure <code>X-Request-ID</code> is listed in <code>Access-Control-Expose-Headers</code>: if the header is not set yet, set it to <code>"X-Request-ID"</code>; if it already has other names, append <code>", X-Request-ID"</code>; if it already lists it (any case), leave it;</li><li>call <code>next()</code>.</li></ol><p>The fake <code>res</code> of the tests stores headers in <code>res.headers</code> with <b>lower-case</b> names (like Node).</p>',
  vi: '<p>Viết hàm tạo <code>requestId(gen)</code> trả về middleware Express <code>(req, res, next)</code>:</p><ol><li>lấy <code>req.headers["x-request-id"]</code>; dùng lại nếu là chuỗi khác rỗng tối đa 64 ký tự, không thì <code>gen()</code>;</li><li>lưu vào <code>req.id</code>;</li><li>trả lại bằng <code>res.setHeader("X-Request-ID", id)</code>;</li><li>bảo đảm <code>X-Request-ID</code> có trong <code>Access-Control-Expose-Headers</code>: nếu header chưa có thì đặt <code>"X-Request-ID"</code>; nếu đã có tên khác thì nối thêm <code>", X-Request-ID"</code>; nếu đã có nó rồi (hoa thường bất kỳ) thì để nguyên;</li><li>gọi <code>next()</code>.</li></ol><p><code>res</code> giả của các kiểm lưu header trong <code>res.headers</code> với tên <b>chữ thường</b> (như Node).</p>',
  yc: [['Return a middleware function; do not send a response.', 'Trả về một hàm middleware; không gửi response.'], ['Call next() exactly once.', 'Gọi next() đúng một lần.']],
  goiY: [['Read the current value with res.headers["access-control-expose-headers"].', 'Đọc giá trị hiện tại bằng res.headers["access-control-expose-headers"].'], ['Check “already listed” case-insensitively, as a whole name in the comma list.', 'Kiểm “đã có” không phân biệt hoa thường, như một tên trọn vẹn trong danh sách phẩy.']],
  loi: [['Forgetting Access-Control-Expose-Headers: the header is on the wire, but the browser will not let your front end read it, so the error toast cannot show the id.', 'Quên Access-Control-Expose-Headers: header có trên đường truyền nhưng trình duyệt không cho frontend đọc, nên thông báo lỗi không hiện được id.'], ['Overwriting an existing expose list (e.g. "X-Total-Count"): another feature silently breaks.', 'Ghi đè danh sách expose đang có (vd "X-Total-Count"): một tính năng khác hỏng âm thầm.']],
  gt: ['This is the website’s middleware, mounted after Trust Proxy and before helmet, CORS and the rate limiter — so even a 429 carries an id. Returning the id is half of the value: it is how the only person who saw the failure can tell you which request it was.', 'Đây là middleware của website, gắn sau Trust Proxy và trước helmet, CORS và bộ giới hạn tốc độ — nên kể cả 429 cũng mang id. Trả id về là một nửa giá trị: đó là cách người duy nhất thấy lỗi có thể nói cho bạn đó là request nào.'],
  kn: ['middleware', 'CORS', 'request id'],
  tns: [tn('middleware factory', 'hàm tạo middleware', 'a function that returns (req, res, next)'), tn('Access-Control-Expose-Headers', 'Access-Control-Expose-Headers', 'which response headers browser JS may read')],
  dau: `/** request-id middleware */
function requestId(gen) {
  return (req, res, next) => {
    // Write your solution here
    const id = req.headers['x-request-id'] || gen();
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
  };
}
`,
  giai: '// Reference solution\n' + nguon(requestId),
  cases: [
    { chuanBi: `${RES_GIA} const res = mkRes(); const req = { headers: {} }; let nexts = 0; requestId(() => "jM3OZ73RMcKa")(req, res, () => nexts++);`, goi: '({ id: req.id, headers: res.headers, nexts })', moTa: ['No inbound id', 'Không có id gửi tới'] },
    { chuanBi: `${RES_GIA} const res = mkRes(); const req = { headers: { 'x-request-id': 'from-nginx-7f3a' } }; requestId(() => "NEW")(req, res, () => {});`, goi: '({ id: req.id, headers: res.headers })', moTa: ['The nginx id is reused', 'Dùng lại id của nginx'] },
    { chuanBi: `${RES_GIA} const res = mkRes(); res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count'); const req = { headers: { 'x-request-id': 'z'.repeat(65) } }; requestId(() => "NEW")(req, res, () => {});`, goi: '({ id: req.id, headers: res.headers })', an: true },
    { chuanBi: `${RES_GIA} const res = mkRes(); res.setHeader('Access-Control-Expose-Headers', 'x-request-id, X-Total-Count'); const req = { headers: { 'x-request-id': 'abc' } }; requestId(() => "NEW")(req, res, () => {});`, goi: 'res.headers["access-control-expose-headers"]', an: true },
    { chuanBi: `${RES_GIA} const res = mkRes(); res.setHeader('Access-Control-Expose-Headers', 'X-Request-ID-Old'); const req = { headers: {} }; requestId(() => "n1")(req, res, () => {});`, goi: 'res.headers["access-control-expose-headers"]', an: true },
  ],
});

function auditGlobalId(events) {
  // Mô phỏng lối tắt global.currentReqId = id: 'start' ghi đè biến toàn cục, 'log' dùng giá trị ĐANG có.
  // Trọng tài ẩn biết request thật của từng dòng (e.req) ⇒ đếm dòng bị gắn nhầm id.
  let current;
  let total = 0;
  const wrong = [];
  for (const e of events) {
    if (e.op === 'start') current = e.req;
    else if (e.op === 'log') {
      total++;
      if (current !== e.req) wrong.push(`${e.msg} [${e.req} as ${current}]`);
    }
  }
  return { total, wrong: wrong.length, lines: wrong };
}
const EV = [
  { req: 'a1', op: 'start' }, { req: 'a1', op: 'log', msg: 'route: received' },
  { req: 'b2', op: 'start' }, { req: 'b2', op: 'log', msg: 'route: received' },
  { req: 'c3', op: 'start' }, { req: 'c3', op: 'log', msg: 'route: received' },
  { req: 'a1', op: 'log', msg: 'repo: done' }, { req: 'b2', op: 'log', msg: 'repo: done' }, { req: 'c3', op: 'log', msg: 'repo: done' },
];
const E4 = await jsBai({
  ten: 'auditGlobalId(events): count the lines a global variable gets wrong', kho: 'MEDIUM', phut: 12,
  en: '<p>Replay the lesson’s referee. <code>events</code> is the order in which things really happened on the event loop: <code>{ req, op: "start" }</code> means the middleware ran <code>global.currentReqId = req</code>; <code>{ req, op: "log", msg }</code> means a line of request <code>req</code> was logged with whatever the global holds <b>at that moment</b>. Return <code>{ total, wrong, lines }</code>: the number of log lines, how many carry another request’s id (or none), and for each wrong line the text <code>"&lt;msg&gt; [&lt;real req&gt; as &lt;logged id&gt;]"</code> in order.</p>',
  vi: '<p>Chạy lại trọng tài của bài. <code>events</code> là thứ tự mọi việc thật sự diễn ra trên event loop: <code>{ req, op: "start" }</code> nghĩa là middleware chạy <code>global.currentReqId = req</code>; <code>{ req, op: "log", msg }</code> nghĩa là một dòng của request <code>req</code> được ghi với giá trị biến toàn cục <b>ngay lúc đó</b>. Trả về <code>{ total, wrong, lines }</code>: số dòng log, bao nhiêu dòng mang id của request khác (hoặc không có), và với mỗi dòng sai là chuỗi <code>"&lt;msg&gt; [&lt;req thật&gt; as &lt;id đã ghi&gt;]"</code> theo thứ tự.</p>',
  goiY: [['Keep one variable current; a start event overwrites it, a log event reads it.', 'Giữ một biến current; sự kiện start ghi đè, sự kiện log đọc nó.'], ['A log before any start logs undefined — format it with a template string, it prints "undefined".', 'Dòng log trước mọi start ghi undefined — định dạng bằng template string sẽ in "undefined".']],
  loi: [['Comparing each log line with the previous start of the SAME request: that is what AsyncLocalStorage gives you, not what a global does.', 'So mỗi dòng log với lần start trước của CÙNG request: đó là thứ AsyncLocalStorage cho bạn, không phải thứ biến toàn cục làm.'], ['Counting only lines with no id: the dangerous lines are the ones with a WRONG id.', 'Chỉ đếm dòng không có id: dòng nguy hiểm là dòng có id SAI.']],
  gt: ['With three overlapping requests the first lines are right by luck and every completion line after the last start carries the last id — the lesson counted 12 of 18 lines with 4a4c9b4c and 6 of them wrong. A global is shared by every request in the process; per-request data needs context that follows the async chain.', 'Với ba request chồng nhau, các dòng đầu đúng nhờ may mắn và mọi dòng hoàn tất sau lần start cuối đều mang id cuối — bài đếm 12/18 dòng mang 4a4c9b4c, 6 dòng trong đó sai. Biến toàn cục dùng chung cho mọi request của tiến trình; dữ liệu theo request cần ngữ cảnh đi theo chuỗi bất đồng bộ.'],
  kn: ['concurrency', 'event loop'],
  tns: [tn('interleaving', 'xen kẽ', 'steps of concurrent requests mixed in time'), tn('referee', 'trọng tài', 'a hidden record of the truth used to check the output')],
  dau: `/** how many log lines does global.currentReqId get wrong? */
function auditGlobalId(events) {
  // Write your solution here
  let total = 0;
  for (const e of events) if (e.op === 'log') total++;
  return { total, wrong: 0, lines: [] };
}
`,
  giai: '// Reference solution\n' + nguon(auditGlobalId),
  cases: [
    { goi: `auditGlobalId(${JSON.stringify(EV)})`, moTa: ['Three requests overlapping at an await', 'Ba request chồng nhau ở một await'] },
    { goi: `auditGlobalId(${JSON.stringify([{ req: 'a1', op: 'start' }, { req: 'a1', op: 'log', msg: 'x' }, { req: 'a1', op: 'log', msg: 'y' }])})`, moTa: ['One request at a time: the global looks fine', 'Từng request một: biến toàn cục trông ổn'] },
    { goi: `auditGlobalId(${JSON.stringify([{ req: 'z', op: 'log', msg: 'boot' }, ...EV, { req: 'b2', op: 'log', msg: 'route: reply' }])})`, an: true },
    { goi: 'auditGlobalId([])', an: true },
  ],
});

function createContext() {
  // AsyncLocalStorage thu nhỏ cho mã dùng callback: Node làm việc "mang ngữ cảnh qua await/timer" TỰ ĐỘNG;
  // ở đây ta làm bằng tay để thấy runtime phải làm gì.
  let current;                                        // store đang hiệu lực (undefined = ngoài mọi run)
  function run(store, fn) {
    const prev = current;
    current = store;
    try { return fn(); } finally { current = prev; }  // luôn trả lại — kể cả khi fn ném lỗi
  }
  function getStore() { return current; }
  function bind(fn) {
    const captured = current;                         // chụp ngữ cảnh LÚC ĐĂNG KÝ callback
    return (...args) => run(captured, () => fn(...args));
  }
  return { run, getStore, bind };
}
const E5 = await jsBai({
  ten: 'createContext(): a hand-made AsyncLocalStorage (run, getStore, bind)', kho: 'HARD', phut: 22,
  en: '<p>Only the runtime knows which async chain is running, so Node gives you <code>AsyncLocalStorage</code>. To see what it must do, build a hand-made one for callback code. <code>createContext()</code> returns <code>{ run, getStore, bind }</code>:</p><ul><li><code>run(store, fn)</code> — makes <code>store</code> the current store while <code>fn</code> runs synchronously, returns what <code>fn</code> returns, and <b>always</b> restores the previous store afterwards (even if <code>fn</code> throws; nested runs restore the outer store);</li><li><code>getStore()</code> — the current store, or <code>undefined</code> outside every run;</li><li><code>bind(fn)</code> — captures the store that is current <b>now</b> and returns a function that, whenever it is called later (e.g. by a timer), runs <code>fn</code> inside that captured store.</li></ul>',
  vi: '<p>Chỉ runtime biết chuỗi bất đồng bộ nào đang chạy, nên Node cho bạn <code>AsyncLocalStorage</code>. Để thấy nó phải làm gì, hãy tự làm một bản cho mã dùng callback. <code>createContext()</code> trả về <code>{ run, getStore, bind }</code>:</p><ul><li><code>run(store, fn)</code> — đặt <code>store</code> làm store hiện hành trong lúc <code>fn</code> chạy đồng bộ, trả về thứ <code>fn</code> trả về, và <b>luôn</b> trả lại store cũ sau đó (kể cả khi <code>fn</code> ném lỗi; run lồng nhau trả lại store bên ngoài);</li><li><code>getStore()</code> — store hiện hành, hoặc <code>undefined</code> khi ở ngoài mọi run;</li><li><code>bind(fn)</code> — chụp store đang hiện hành <b>lúc này</b> và trả về một hàm mà mỗi khi được gọi về sau (vd bởi timer) sẽ chạy <code>fn</code> bên trong store đã chụp.</li></ul>',
  yc: [['No global state outside createContext(): two contexts must not see each other’s stores.', 'Không trạng thái toàn cục ngoài createContext(): hai context không được thấy store của nhau.'], ['Restore the previous store in a finally block.', 'Trả lại store cũ trong khối finally.']],
  goiY: [['run is: save prev, set current, try { return fn() } finally { current = prev }.', 'run là: lưu prev, đặt current, try { return fn() } finally { current = prev }.'], ['bind must read current at bind time, not at call time — store it in a const of the closure, then reuse run.', 'bind phải đọc current lúc bind, không phải lúc gọi — giữ trong một const của closure, rồi dùng lại run.']],
  loi: [['Not restoring after run: code that runs later (a timer of another request) sees a store that is not its own — the global-variable bug again.', 'Không trả lại sau run: mã chạy sau (timer của request khác) thấy store không phải của nó — lại là lỗi biến toàn cục.'], ['bind reading the store when the callback fires: by then another request owns “current”.', 'bind đọc store lúc callback chạy: khi đó một request khác đã chiếm “current”.']],
  gt: ['This is the contract of AsyncLocalStorage.run / getStore and AsyncLocalStorage.bind. In real Node you never call bind yourself for await, timers or promises: the runtime captures the context when each async resource is created and restores it when its callback runs — that is the part your code cannot do, and why the middleware is just als.run({ log: logger.child({ reqId }) }, next).', 'Đây là hợp đồng của AsyncLocalStorage.run / getStore và AsyncLocalStorage.bind. Trong Node thật bạn không bao giờ tự gọi bind cho await, timer hay promise: runtime chụp ngữ cảnh khi mỗi tài nguyên bất đồng bộ được tạo và khôi phục khi callback của nó chạy — đó là phần mã của bạn không làm được, và vì thế middleware chỉ là als.run({ log: logger.child({ reqId }) }, next).'],
  kn: ['AsyncLocalStorage', 'closures', 'callbacks'],
  tns: [tn('store', 'kho ngữ cảnh', 'the value visible to everything inside one run'), tn('async chain', 'chuỗi bất đồng bộ', 'callbacks and continuations started by one request')],
  dau: `/** a hand-made AsyncLocalStorage */
function createContext() {
  // Write your solution here
  let current;
  return {
    run(store, fn) { current = store; return fn(); },
    getStore() { return current; },
    bind(fn) { return fn; },
  };
}
`,
  giai: '// Reference solution\n' + nguon(createContext),
  cases: [
    { chuanBi: 'const als = createContext(); const seen = []; als.run({ reqId: "A" }, () => { seen.push(als.getStore().reqId); als.run({ reqId: "B" }, () => seen.push(als.getStore().reqId)); seen.push(als.getStore().reqId); }); seen.push(String(als.getStore()));', goi: 'seen', moTa: ['Nested runs restore the outer store', 'Run lồng nhau trả lại store bên ngoài'] },
    { chuanBi: 'const als = createContext(); const seen = []; als.run({ reqId: "A" }, () => { setTimeout(als.bind(() => seen.push(als.getStore().reqId)), 20); }); als.run({ reqId: "B" }, () => { setTimeout(als.bind(() => seen.push(als.getStore().reqId)), 5); }); setTimeout(() => seen.push(String(als.getStore())), 1); await new Promise((r) => setTimeout(r, 40));', goi: 'seen', moTa: ['Two requests, timers firing later', 'Hai request, timer chạy về sau'] },
    { chuanBi: 'const als = createContext(); let err = ""; try { als.run({ reqId: "X" }, () => { throw new Error("boom"); }); } catch (e) { err = e.message; }', goi: '[err, String(als.getStore())]', an: true },
    { chuanBi: 'const a = createContext(); const b = createContext();', goi: 'a.run(1, () => b.run(2, () => [a.getStore(), b.getStore()]))', an: true },
    { chuanBi: 'const als = createContext(); const f = als.run({ u: "an" }, () => als.bind((x, y) => [als.getStore().u, x + y]));', goi: '[f(2, 3), String(als.getStore())]', an: true },
  ],
});

export default modul('nodejs-15-2-request-id', '15.2 Request id and AsyncLocalStorage', [E1, E2, E3, E4, E5]);
