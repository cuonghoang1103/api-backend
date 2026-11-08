/** Node.js 6.2 — Mã trạng thái chọn theo chuyện đã xảy ra, 201 + Location, 204 rỗng, một hình dạng lỗi, quy ước trường. */
import { modul, cs, q, tn, jsBai, RES, APP_ERROR } from './_node-c6-8.mjs';

/* ── 1. Chọn mã ── */
const E1 = cs({
  ten: '6.2 · 1 — Pick the status code from what happened', kho: 'EASY', phut: 8,
  en: 'The status code is the first thing every client reads, and usually the only thing it branches on. Six situations from the Notes API; choose the code lesson 6.2 would send, and remember what the CLIENT will do with it (refresh a token, retry, show a field error…).',
  vi: 'Mã trạng thái là thứ đầu tiên client đọc, và thường là thứ duy nhất nó rẽ nhánh theo. Sáu tình huống của Notes API; chọn mã mà bài 6.2 sẽ gửi, và nhớ CLIENT sẽ làm gì với mã đó (làm mới token, thử lại, báo lỗi ô nhập…).',
  cau: [
    q('c1', ['A logged-in user with a valid token tries to delete a note in a workspace where they are read-only (they can see it exists).', 'Người dùng đã đăng nhập, token hợp lệ, xoá ghi chú trong không gian chỉ cho họ đọc (họ thấy nó tồn tại).'],
      ['403 Forbidden', '401 Unauthorized', '404 Not Found', '409 Conflict'],
      ['They are authenticated; logging in again will not help. Answering 401 would make a frontend with a 401 interceptor refresh and retry forever.', 'Họ đã xác thực; đăng nhập lại không giúp gì. Trả 401 sẽ khiến frontend có interceptor 401 làm mới token và thử lại mãi mãi.']),
    q('c2', ['The body is <code>{title:}</code> — not JSON at all.', 'Body là <code>{title:}</code> — không phải JSON.'],
      ['400 Bad Request', '422 Unprocessable Content', '500 Internal Server Error', '415 Unsupported Media Type'],
      ['400 = “I could not even parse this”. 422 is for JSON that parsed but has wrong values.', '400 = "tôi còn không đọc nổi". 422 dành cho JSON đọc được nhưng giá trị sai.']),
    q('c3', ['The body is <code>{"title":""}</code>: valid JSON, empty title.', 'Body là <code>{"title":""}</code>: JSON hợp lệ, tiêu đề rỗng.'],
      ['422 Unprocessable Content', '400 Bad Request', '409 Conflict', '204 No Content'],
      ['Syntactically fine, semantically invalid. Some teams use 400 for both — defensible — but never at random.', 'Cú pháp ổn, ngữ nghĩa sai. Có nhóm dùng 400 cho cả hai — chấp nhận được — nhưng đừng dùng ngẫu nhiên.']),
    q('c4', ['Register with an email that is already registered.', 'Đăng ký với email đã có người dùng.'],
      ['409 Conflict', '422 Unprocessable Content', '400 Bad Request', '403 Forbidden'],
      ['The test for 409: could this exact request have succeeded a minute ago? Yes ⇒ it collides with STATE, not a validation error. Chapter 7 maps Prisma’s P2002 onto 409.', 'Phép thử cho 409: đúng request này một phút trước có thể thành công không? Có ⇒ nó va chạm với TRẠNG THÁI, không phải lỗi kiểm tra. Chương 7 ánh xạ P2002 của Prisma sang 409.']),
    q('c5', ['DELETE /notes/1 succeeded. What should the response be?', 'DELETE /notes/1 thành công. Phản hồi nên là gì?'],
      ['204 with an empty body — <code>res.status(204).end()</code>', '204 with <code>{"ok":true}</code>', '200 with <code>{"success":false}</code>', '201 with a Location header'],
      ['204 means EMPTY: <code>res.status(204).json({ok:true})</code> is a contradiction.', '204 nghĩa là RỖNG: <code>res.status(204).json({ok:true})</code> là tự mâu thuẫn.']),
    q('c6', ['Your code threw because the database is unreachable during a restart.', 'Code của bạn ném lỗi vì CSDL không với tới được trong lúc khởi động lại.'],
      ['503 Service Unavailable — this one really means “retry later”', '400 Bad Request — the request could not be completed', '200 with an error inside the body so monitoring stays green', '404 Not Found — the data could not be found'],
      ['5xx means it was your side’s fault. 503 = temporarily down. And never a 200 with an error inside: monitoring sees zero errors, retries never trigger, caches store the failure.', '5xx nghĩa là lỗi phía bạn. 503 = tạm thời ngừng. Và đừng bao giờ 200 chứa lỗi bên trong: giám sát thấy 0 lỗi, không thử lại, cache lưu luôn thất bại.']),
  ],
  goiY: [['Ask in order: did it work? was it parseable? was it valid? who is at fault?', 'Hỏi theo thứ tự: có thành công không? đọc được không? hợp lệ không? lỗi của ai?'], ['401 = “I don’t know you”, 403 = “I know you and no”.', '401 = "tôi không biết bạn", 403 = "tôi biết bạn và không cho".']],
  loi: [['401 for a permission problem ⇒ infinite refresh loop in the frontend.', '401 cho vấn đề phân quyền ⇒ vòng làm mới token vô hạn ở frontend.'], ['422 for a duplicate email: the data is fine, the world disagrees ⇒ 409.', '422 cho email trùng: dữ liệu ổn, thế giới không đồng ý ⇒ 409.']],
  tns: [tn('401 Unauthorized', 'chưa xác thực'), tn('403 Forbidden', 'bị cấm'), tn('409 Conflict', 'xung đột trạng thái'), tn('422 Unprocessable', 'dữ liệu không hợp lệ')],
  kn: ['HTTP status codes'],
});

/* ── 2. 201 làm đúng, 204 rỗng ── */
function sendCreated(res, note) {
  // 201 + Location: tells any generic client where the new thing lives,
  // and the body is the created object (the client needs the server-made id and createdAt)
  return res.status(201).location('/api/v1/notes/' + note.id).json(note);
}
function sendDeleted(res) {
  // 204 means EMPTY: end() sends no body at all — never .json({ ok: true })
  return res.status(204).end();
}
const E2 = jsBai({
  ten: '6.2 · 2 — Write sendCreated and sendDeleted: 201 done properly, 204 that is really empty', kho: 'EASY', phut: 10,
  en: `<p>Two tiny helpers your routes will call. The grader gives them a fake Express <code>res</code> with <code>status(code)</code>, <code>location(url)</code>, <code>json(body)</code>, <code>send(body)</code>, <code>end()</code> (all chainable) and records what you did.</p>
<ul><li><code>sendCreated(res, note)</code>: status <b>201</b>, header <code>Location: /api/v1/notes/&lt;id&gt;</code>, body = the created note itself (not <code>{ ok: true }</code>).</li>
<li><code>sendDeleted(res)</code>: status <b>204</b> and <b>no body</b> — finish the response with <code>end()</code>.</li></ul>
<p>Real output from the lesson: <code>HTTP/1.1 201 Created · Location: /api/v1/notes/1 · {"id":1,"title":"Learning Express",…}</code>.</p>`,
  vi: `<p>Hai hàm nhỏ mà các route sẽ gọi. Máy chấm đưa vào một <code>res</code> Express GIẢ có <code>status(code)</code>, <code>location(url)</code>, <code>json(body)</code>, <code>send(body)</code>, <code>end()</code> (đều nối chuỗi được) và ghi lại bạn đã làm gì.</p>
<ul><li><code>sendCreated(res, note)</code>: mã <b>201</b>, header <code>Location: /api/v1/notes/&lt;id&gt;</code>, body = chính ghi chú vừa tạo (không phải <code>{ ok: true }</code>).</li>
<li><code>sendDeleted(res)</code>: mã <b>204</b> và <b>không có body</b> — kết thúc bằng <code>end()</code>.</li></ul>
<p>Output thật của bài: <code>HTTP/1.1 201 Created · Location: /api/v1/notes/1 · {"id":1,"title":"Learning Express",…}</code>.</p>`,
  yc: [['Use the methods of <code>res</code>; return nothing in particular.', 'Dùng các hàm của <code>res</code>; không cần trả về gì đặc biệt.'], ['Send exactly one response per call.', 'Mỗi lần gọi gửi đúng một phản hồi.']],
  goiY: [['<code>res.status(201)</code> returns <code>res</code>, so you can chain <code>.location(…).json(note)</code>.', '<code>res.status(201)</code> trả về <code>res</code>, nên nối được <code>.location(…).json(note)</code>.'], ['For 204 the last call is <code>.end()</code>, not <code>.json()</code> or <code>.send()</code>.', 'Với 204 lời gọi cuối là <code>.end()</code>, không phải <code>.json()</code> hay <code>.send()</code>.']],
  loi: [['Returning <code>{"ok":true}</code> after a create, forcing an extra round trip to learn the id.', 'Trả <code>{"ok":true}</code> sau khi tạo, buộc client gọi thêm một lần để biết id.'], ['<code>res.status(204).json({ ok: true })</code> — a body with “no content”.', '<code>res.status(204).json({ ok: true })</code> — một body "không có nội dung".'], ['Forgetting Location — cheap, standard, and generic clients rely on it.', 'Quên Location — rẻ, chuẩn, và client tổng quát dựa vào nó.']],
  gt: ['201 tells the client “a new resource exists”; Location says where; returning the object saves a GET. 204 is a promise that there is nothing to read — a client may skip parsing entirely, so a JSON body there is at best ignored and at worst breaks a strict client.', '201 báo client "đã có tài nguyên mới"; Location nói nó ở đâu; trả về object tiết kiệm một lần GET. 204 là lời hứa không có gì để đọc — client có thể bỏ qua việc phân tích, nên body JSON ở đó tốt nhất là bị lờ, tệ nhất là làm hỏng client chặt chẽ.'],
  kn: ['201 Created', '204 No Content'],
  tns: [tn('Location header', 'header Location', 'URL của tài nguyên vừa tạo.'), tn('No Content', 'không có nội dung', 'Mã 204 — body rỗng.')],
  dau: `function sendCreated(res, note) {
  // Write your solution here
  return res.status(200).json({ ok: true });
}
function sendDeleted(res) {
  return res.status(204).json({ ok: true });
}
`,
  giai: [sendCreated, sendDeleted],
  chung: RES,
  cases: [
    { goi: `(() => { const r = mkRes(); sendCreated(r, { id: 1, title: 'Learning Express', body: 'chapter 5' }); return view(r); })()`, moTa: ['Create note 1', 'Tạo ghi chú 1'] },
    { goi: `(() => { const r = mkRes(); sendDeleted(r); return view(r); })()`, moTa: ['Delete ⇒ 204 empty', 'Xoá ⇒ 204 rỗng'] },
    { goi: `(() => { const r = mkRes(); sendCreated(r, { id: 128, title: 'x', createdAt: '2026-07-27T15:00:00.000Z' }); return view(r); })()`, an: true },
    { goi: `(() => { const r = mkRes(); sendDeleted(r); return [r.body === undefined, r.ended, r.sent]; })()`, an: true },
  ],
  saiMau: [
    `function sendCreated(res, note) { return res.status(201).json(note); }\nfunction sendDeleted(res) { return res.status(204).end(); }`,
    `function sendCreated(res, note) { return res.status(201).location('/api/v1/notes/' + note.id).json(note); }\nfunction sendDeleted(res) { return res.status(204).send(''); }`,
  ],
});

/* ── 3. Bộ xử lý lỗi tập trung — một hình dạng cho mọi 4xx/5xx ── */
function errorHandler(err, req, res, next) {
  // 1) express.json() could not parse the body -> it is the CLIENT's malformed request
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'BAD_JSON', message: 'Request body is not valid JSON' } });
  }
  // 2) an error we raised on purpose: its status and stable code are the contract
  if (err instanceof AppError) {
    const body = { error: { code: err.code, message: err.message } };
    if (err.fields) body.error.fields = err.fields;               // one entry per bad field (lesson 6.3)
    if (err.status === 429 && err.retryAfter != null) res.set('Retry-After', String(err.retryAfter));
    return res.status(err.status).json(body);
  }
  // 3) anything else is OUR bug: 500, and never leak err.message (it may contain SQL, paths, secrets)
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal server error' } });
}
const E3 = jsBai({
  ten: '6.2 · 3 — Write errorHandler(err, req, res, next): one error shape for every 4xx and 5xx', kho: 'MEDIUM', phut: 15,
  en: `<p>Lesson 6.2: “Error — ALWAYS this shape, for every 4xx and 5xx: <code>{ "error": { "code": "NOTE_NOT_FOUND", "message": "…" } }</code>”. The client branches on <code>code</code>, never on <code>message</code>. Write the central Express error handler (the 4-argument middleware of lesson 5.4). <code>AppError(status, code, message)</code> is provided in <code>helpers.js</code>.</p>
<ul><li><code>err.type === 'entity.parse.failed'</code> (what <code>express.json()</code> throws for <code>{title:}</code>) ⇒ <b>400</b> <code>{ error: { code: "BAD_JSON", message: "Request body is not valid JSON" } }</code>.</li>
<li><code>AppError</code> ⇒ <code>err.status</code> with <code>{ error: { code, message } }</code>; if <code>err.fields</code> exists add it as <code>error.fields</code>; a 429 with <code>err.retryAfter</code> also sets header <code>Retry-After</code> to that number of seconds (as a string).</li>
<li>Anything else ⇒ <b>500</b> <code>{ error: { code: "INTERNAL", message: "Internal server error" } }</code> — do not copy the real <code>err.message</code> to the client.</li></ul>`,
  vi: `<p>Bài 6.2: "Lỗi — LUÔN hình dạng này, cho mọi 4xx và 5xx: <code>{ "error": { "code": "NOTE_NOT_FOUND", "message": "…" } }</code>". Client rẽ nhánh theo <code>code</code>, không bao giờ theo <code>message</code>. Viết bộ xử lý lỗi Express tập trung (middleware 4 tham số của bài 5.4). <code>AppError(status, code, message)</code> có sẵn trong <code>helpers.js</code>.</p>
<ul><li><code>err.type === 'entity.parse.failed'</code> (thứ <code>express.json()</code> ném với <code>{title:}</code>) ⇒ <b>400</b> <code>{ error: { code: "BAD_JSON", message: "Request body is not valid JSON" } }</code>.</li>
<li><code>AppError</code> ⇒ mã <code>err.status</code> với <code>{ error: { code, message } }</code>; có <code>err.fields</code> thì thêm vào <code>error.fields</code>; 429 có <code>err.retryAfter</code> thì đặt thêm header <code>Retry-After</code> bằng số giây đó (dạng chuỗi).</li>
<li>Mọi thứ khác ⇒ <b>500</b> <code>{ error: { code: "INTERNAL", message: "Internal server error" } }</code> — đừng chép <code>err.message</code> thật cho client.</li></ul>`,
  yc: [['Every response is <code>{ error: { code, message, fields? } }</code> with a 4xx/5xx status — never 200.', 'Mọi phản hồi là <code>{ error: { code, message, fields? } }</code> với mã 4xx/5xx — không bao giờ 200.'], ['Unknown errors never reveal their message.', 'Lỗi lạ không bao giờ lộ thông điệp.'], ['429 must carry Retry-After when the error knows it.', '429 phải kèm Retry-After khi lỗi biết giá trị.']],
  goiY: [['Check the three cases in order: parse error, AppError (<code>err instanceof AppError</code>), everything else.', 'Xét ba trường hợp theo thứ tự: lỗi đọc JSON, AppError (<code>err instanceof AppError</code>), còn lại.'], ['Build the body object first, then add <code>fields</code> only if present, then <code>res.status(...).json(body)</code>.', 'Dựng object body trước, thêm <code>fields</code> chỉ khi có, rồi <code>res.status(...).json(body)</code>.']],
  loi: [['<code>res.status(500).json({ error: { message: err.message } })</code> for unknown errors — a Prisma error message names your tables and columns.', '<code>res.status(500).json({ error: { message: err.message } })</code> cho lỗi lạ — thông điệp lỗi Prisma lộ tên bảng và cột.'], ['Treating the JSON parse failure as 500: it is the client’s malformed request, and a 500 tells it to retry.', 'Coi lỗi đọc JSON là 500: đó là request sai của client, và 500 bảo client thử lại.'], ['<code>res.json({ success: false })</code> with status 200 — monitoring sees zero errors.', '<code>res.json({ success: false })</code> với mã 200 — giám sát thấy 0 lỗi.']],
  gt: ['One shape, decided once, is what lets the frontend have exactly one interceptor: the STATUS drives the transport decision (401 ⇒ refresh, 429 ⇒ wait Retry-After, 5xx ⇒ maybe retry) and the CODE drives the UI decision. Hiding unknown messages is not politeness: an internal error message is a map of your system for whoever reads it.', 'Một hình dạng, quyết định một lần, là thứ cho frontend chỉ cần đúng một interceptor: MÃ TRẠNG THÁI quyết định việc truyền tải (401 ⇒ làm mới, 429 ⇒ chờ Retry-After, 5xx ⇒ có thể thử lại) còn CODE quyết định giao diện. Giấu thông điệp lạ không phải phép lịch sự: thông điệp lỗi nội bộ là bản đồ hệ thống cho bất kỳ ai đọc được.'],
  kn: ['error handling', 'response shape'],
  tns: [tn('error handler', 'bộ xử lý lỗi', 'Middleware 4 tham số (err, req, res, next).'), tn('stable code', 'mã ổn định', 'Client rẽ nhánh theo nó; message thì đổi được.'), tn('Retry-After', 'Retry-After', 'Số giây client nên chờ.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function errorHandler(err, req, res, next) {
  // Write your solution here
  res.status(err.status || 200).json({ success: false, message: err.message });
}
`,
  giai: errorHandler,
  chung: RES + `\nconst run = (err) => { const r = mkRes(); errorHandler(err, mkReq(), r, mkNext()); return view(r); };`,
  cases: [
    { goi: `run(new AppError(404, 'NOTE_NOT_FOUND', 'Note 42 does not exist'))`, moTa: ['AppError 404', 'AppError 404'] },
    { goi: `run(Object.assign(new SyntaxError('Unexpected token } in JSON'), { type: 'entity.parse.failed', status: 400 }))`, moTa: ['Unparseable body ⇒ 400', 'Body không đọc được ⇒ 400'] },
    { goi: `run(new Error('relation "Note" does not exist at character 15'))`, moTa: ['Unknown error ⇒ 500, message hidden', 'Lỗi lạ ⇒ 500, giấu thông điệp'] },
    { goi: `run(Object.assign(new AppError(422, 'VALIDATION_FAILED', 'The submitted data is not valid'), { fields: [{ path: 'title', message: 'title must not be empty' }] }))`, an: true },
    { goi: `run(Object.assign(new AppError(429, 'RATE_LIMITED', 'Too many attempts'), { retryAfter: 60 }))`, an: true },
    { goi: `run(Object.assign(new TypeError('Cannot read properties of undefined'), { status: 418 }))`, an: true },
    { goi: `run(new AppError(409, 'EMAIL_TAKEN', 'email already registered'))`, an: true },
  ],
  saiMau: [
    errorHandler.toString().replace("{ error: { code: 'INTERNAL', message: 'Internal server error' } }", "{ error: { code: 'INTERNAL', message: err.message } }"),
    errorHandler.toString().replace("if (err.status === 429 && err.retryAfter != null) res.set('Retry-After', String(err.retryAfter));", ''),
  ],
});

/* ── 4. Quy ước trường ── */
function toApi(row) {
  return {
    id: String(row.id),                                       // 64-bit ids: JS loses precision above 2^53 -> send strings
    title: row.title,
    body: row.body ?? null,                                   // explicit null, never "sometimes missing"
    isPublished: row.status === 1,                            // a boolean named for what is true
    price: { amount: Math.round(Number(row.price)), currency: 'VND' },   // money: smallest unit, integer
    createdAt: row.createdAt.toISOString(),                   // ISO 8601 UTC, like JSON.stringify(date)
  };
}
const E4 = jsBai({
  ten: '6.2 · 4 — Write toApi(row): the field conventions worth fixing early', kho: 'MEDIUM', phut: 12,
  en: `<p>A database row arrives in a shape that is fine for SQL and bad for clients. Write <code>toApi(row)</code> that returns exactly <code>{ id, title, body, isPublished, price, createdAt }</code>, following lesson 6.2’s conventions:</p>
<ul><li><b>Big ids as strings</b>: <code>row.id</code> may be a <code>BigInt</code> (<code>9007199254740993n</code>) or a number — always send <code>String(row.id)</code>.</li>
<li><b>Explicit null over missing</b>: <code>body</code> is <code>null</code> when the row has none (<code>undefined</code> or <code>null</code>); an empty string stays <code>""</code>.</li>
<li><b>Booleans named for what is true</b>: <code>row.status</code> is <code>1</code> (published) or <code>0</code> ⇒ <code>isPublished: true/false</code>.</li>
<li><b>Money in the smallest unit, as an integer</b>: <code>row.price</code> is a decimal string such as <code>"250000.00"</code> ⇒ <code>price: { amount: 250000, currency: "VND" }</code> (round to the nearest integer).</li>
<li><b>Timestamps in ISO 8601 UTC</b>: <code>row.createdAt</code> is a <code>Date</code> ⇒ <code>"2026-07-27T15:00:00.000Z"</code>.</li></ul>`,
  vi: `<p>Một dòng CSDL tới với hình dạng tốt cho SQL và tệ cho client. Viết <code>toApi(row)</code> trả về đúng <code>{ id, title, body, isPublished, price, createdAt }</code>, theo quy ước của bài 6.2:</p>
<ul><li><b>Id lớn dạng chuỗi</b>: <code>row.id</code> có thể là <code>BigInt</code> (<code>9007199254740993n</code>) hay số — luôn gửi <code>String(row.id)</code>.</li>
<li><b>null rõ ràng thay vì vắng mặt</b>: <code>body</code> là <code>null</code> khi dòng không có (<code>undefined</code> hay <code>null</code>); chuỗi rỗng giữ <code>""</code>.</li>
<li><b>Boolean đặt tên theo điều đúng</b>: <code>row.status</code> là <code>1</code> (đã xuất bản) hay <code>0</code> ⇒ <code>isPublished: true/false</code>.</li>
<li><b>Tiền theo đơn vị nhỏ nhất, số nguyên</b>: <code>row.price</code> là chuỗi thập phân như <code>"250000.00"</code> ⇒ <code>price: { amount: 250000, currency: "VND" }</code> (làm tròn tới số nguyên gần nhất).</li>
<li><b>Thời điểm ISO 8601 UTC</b>: <code>row.createdAt</code> là <code>Date</code> ⇒ <code>"2026-07-27T15:00:00.000Z"</code>.</li></ul>`,
  yc: [['Return only the six fields — no internal columns (<code>status</code>, <code>authorId</code>…).', 'Chỉ trả sáu trường — không lộ cột nội bộ (<code>status</code>, <code>authorId</code>…).'], ['Do not use <code>Number(row.id)</code>: it rounds ids above 2^53.', 'Đừng dùng <code>Number(row.id)</code>: nó làm tròn id lớn hơn 2^53.']],
  goiY: [['<code>String(9007199254740993n)</code> keeps every digit; <code>Number(9007199254740993n)</code> gives …992.', '<code>String(9007199254740993n)</code> giữ đủ chữ số; <code>Number(9007199254740993n)</code> ra …992.'], ['<code>row.body ?? null</code> turns both undefined and null into null but keeps <code>""</code>. <code>date.toISOString()</code> is always UTC with a Z.', '<code>row.body ?? null</code> biến cả undefined và null thành null nhưng giữ <code>""</code>. <code>date.toISOString()</code> luôn là UTC có chữ Z.']],
  loi: [['<code>row.body || null</code> turns a legitimately empty body into null.', '<code>row.body || null</code> biến body rỗng hợp lệ thành null.'], ['<code>parseFloat("250000.00")</code> kept as a float, or a local-time string like <code>"27/07/2026 22:00"</code> for the date.', 'Giữ <code>parseFloat("250000.00")</code> dạng số thực, hay chuỗi giờ địa phương kiểu <code>"27/07/2026 22:00"</code> cho ngày.'], ['<code>id: Number(row.id)</code> — silently rounded ids are a very expensive bug to find.', '<code>id: Number(row.id)</code> — id bị làm tròn lặng lẽ là lỗi rất đắt để tìm.']],
  gt: ['Each convention removes a way for clients to be wrong: strings for ids survive JavaScript’s 53-bit numbers, integers for money survive floating point, ISO UTC survives time zones, explicit null means one shape instead of two, and a positively named boolean cannot be misread as a double negative.', 'Mỗi quy ước bỏ đi một cách client có thể sai: id dạng chuỗi sống sót qua số 53 bit của JavaScript, tiền số nguyên sống sót qua số thực, ISO UTC sống sót qua múi giờ, null rõ ràng nghĩa là một hình dạng thay vì hai, và boolean đặt tên khẳng định không bị đọc nhầm thành phủ định kép.'],
  kn: ['response shape', 'JSON'],
  tns: [tn('ISO 8601', 'ISO 8601', 'Định dạng thời gian chuẩn, UTC kết thúc bằng Z.'), tn('BigInt', 'BigInt', 'Số nguyên lớn tuỳ ý; JSON.stringify không tự xử lý.'), tn('smallest unit', 'đơn vị nhỏ nhất', 'Tiền lưu bằng số nguyên (đồng, xu).')],
  dau: `function toApi(row) {
  // Write your solution here
  return { ...row, id: Number(row.id), createdAt: row.createdAt.toLocaleString() };
}
`,
  giai: toApi,
  cases: [
    { goi: `toApi({ id: 1, title: 'Learning Express', body: 'chapter 5', status: 1, price: '250000.00', createdAt: new Date('2026-07-27T15:00:00Z'), authorId: 7 })` },
    { goi: `toApi({ id: 9007199254740993n, title: 'Big id', status: 0, price: '0.00', createdAt: new Date('2026-07-27T08:30:00+07:00') })`, moTa: ['BigInt id, missing body, local-time date', 'Id BigInt, thiếu body, ngày theo giờ địa phương'] },
    { goi: `toApi({ id: 2, title: 'Empty', body: '', status: 1, price: '19999.50', createdAt: new Date(0) })`, an: true },
    { goi: `toApi({ id: 3n, title: 'Null body', body: null, status: 0, price: '1250000', createdAt: new Date('2030-01-01T00:00:00.123Z'), passwordHash: 'x' })`, an: true },
  ],
  saiMau: [
    toApi.toString().replace('body: row.body ?? null,', 'body: row.body || null,'),
    toApi.toString().replace('id: String(row.id),', 'id: String(Number(row.id)),'),
  ],
});

/* ── 5. Handler đăng ký: 400 → 422 → 409 → 201 ── */
async function register(req, res, users) {
  // 1) could we even parse it? -> 400
  let input;
  try { input = JSON.parse(req.rawBody); } catch {
    return res.status(400).json({ error: { code: 'BAD_JSON', message: 'Request body is not valid JSON' } });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) input = {};
  // 2) parsed, but are the values valid? -> 422 with EVERY bad field at once
  const fields = [];
  if (typeof input.email !== 'string' || !input.email.includes('@')) fields.push({ path: 'email', message: 'email must contain @' });
  if (typeof input.password !== 'string' || input.password.length < 8) fields.push({ path: 'password', message: 'password must be at least 8 characters' });
  if (fields.length) return res.status(422).json({ error: { code: 'VALIDATION_FAILED', message: 'The submitted data is not valid', fields } });
  // 3) valid on its own, but does the WORLD agree? -> 409
  const email = input.email.toLowerCase();
  if (await users.findByEmail(email)) return res.status(409).json({ error: { code: 'EMAIL_TAKEN', message: 'email already registered' } });
  // 4) it worked -> 201 + Location + the new resource (never the password)
  const user = await users.create({ email, password: input.password });
  return res.status(201).location('/api/v1/users/' + user.id).json({ id: user.id, email: user.email });
}
const E5 = jsBai({
  ten: '6.2 · 5 — Write register(req, res, users): 400, 422, 409 and 201 from one handler', kho: 'HARD', phut: 25,
  en: `<p>The four-step decision of lesson 6.2 — <i>did it work? was it malformed? was it valid but unacceptable? who is at fault?</i> — in one async handler. <code>req.rawBody</code> is the raw request text; <code>users</code> is a fake repository with <code>async findByEmail(email)</code> (user or <code>null</code>) and <code>async create({ email, password })</code> (returns <code>{ id, email }</code>).</p>
<ol><li><code>rawBody</code> is not JSON ⇒ <b>400</b> <code>{ error: { code: "BAD_JSON", message: "Request body is not valid JSON" } }</code>. (Valid JSON that is not an object, e.g. <code>[]</code>, counts as an empty object.)</li>
<li>Validate <b>all</b> fields, in this order, collecting every problem: <code>email</code> must be a string containing <code>@</code> (<code>"email must contain @"</code>); <code>password</code> must be a string of at least 8 characters (<code>"password must be at least 8 characters"</code>). Any problem ⇒ <b>422</b> <code>{ error: { code: "VALIDATION_FAILED", message: "The submitted data is not valid", fields: [{ path, message }…] } }</code>.</li>
<li>Emails are compared lower-cased. Already registered ⇒ <b>409</b> <code>{ error: { code: "EMAIL_TAKEN", message: "email already registered" } }</code>.</li>
<li>Otherwise create the user (lower-cased email) ⇒ <b>201</b>, <code>Location: /api/v1/users/&lt;id&gt;</code>, body <code>{ id, email }</code> — never the password.</li></ol>`,
  vi: `<p>Quyết định bốn bước của bài 6.2 — <i>thành công chưa? request có sai dạng? hợp lệ nhưng không chấp nhận được? lỗi của ai?</i> — trong một handler async. <code>req.rawBody</code> là chữ thô của request; <code>users</code> là kho GIẢ có <code>async findByEmail(email)</code> (người dùng hoặc <code>null</code>) và <code>async create({ email, password })</code> (trả <code>{ id, email }</code>).</p>
<ol><li><code>rawBody</code> không phải JSON ⇒ <b>400</b> <code>{ error: { code: "BAD_JSON", message: "Request body is not valid JSON" } }</code>. (JSON hợp lệ nhưng không phải object, vd <code>[]</code>, coi như object rỗng.)</li>
<li>Kiểm <b>mọi</b> trường, theo thứ tự này, gom đủ mọi lỗi: <code>email</code> phải là chuỗi chứa <code>@</code> (<code>"email must contain @"</code>); <code>password</code> phải là chuỗi dài ít nhất 8 ký tự (<code>"password must be at least 8 characters"</code>). Có lỗi ⇒ <b>422</b> <code>{ error: { code: "VALIDATION_FAILED", message: "The submitted data is not valid", fields: [{ path, message }…] } }</code>.</li>
<li>So email ở dạng chữ thường. Đã có ⇒ <b>409</b> <code>{ error: { code: "EMAIL_TAKEN", message: "email already registered" } }</code>.</li>
<li>Còn lại: tạo người dùng (email chữ thường) ⇒ <b>201</b>, <code>Location: /api/v1/users/&lt;id&gt;</code>, body <code>{ id, email }</code> — không bao giờ có mật khẩu.</li></ol>`,
  yc: [['Decide in the order 400 → 422 → 409 → 201; do not query the repository for a request that is invalid.', 'Quyết định theo thứ tự 400 → 422 → 409 → 201; đừng truy vấn kho cho request không hợp lệ.'], ['Report every invalid field at once.', 'Báo mọi trường sai cùng lúc.'], ['<code>await</code> the repository calls.', '<code>await</code> các lời gọi kho.']],
  goiY: [['Wrap only <code>JSON.parse</code> in try/catch — that is the 400 branch.', 'Chỉ bọc <code>JSON.parse</code> trong try/catch — đó là nhánh 400.'], ['Push into a <code>fields</code> array instead of returning on the first problem; after both checks, <code>if (fields.length) return 422</code>.', 'Đẩy vào mảng <code>fields</code> thay vì return ở lỗi đầu tiên; sau cả hai phép kiểm, <code>if (fields.length) return 422</code>.']],
  loi: [['Returning 422 for the duplicate email — the data is valid on its own; it collides with state (409).', 'Trả 422 cho email trùng — dữ liệu tự nó hợp lệ; nó va chạm với trạng thái (409).'], ['Stopping at the first invalid field, so a form reveals its errors one per submit.', 'Dừng ở trường sai đầu tiên, nên form lộ lỗi từng cái một mỗi lần gửi.'], ['Comparing emails case-sensitively: An@vd.com registers a second account next to an@vd.com.', 'So email phân biệt hoa thường: An@vd.com đăng ký thêm tài khoản bên cạnh an@vd.com.'], ['Echoing the request body back in the 201 — the password goes with it.', 'Trả lại nguyên body request trong 201 — mật khẩu đi theo.']],
  gt: ['The order is not arbitrary: you cannot validate what you could not parse, and you should not ask the database about data that is invalid anyway. Each branch answers a different question and each code tells the client a different thing to do — fix the code (400), fix the input (422), choose another email (409), or use the new resource at Location (201).', 'Thứ tự không tuỳ tiện: không kiểm được thứ không đọc được, và không nên hỏi CSDL về dữ liệu đằng nào cũng sai. Mỗi nhánh trả lời một câu hỏi khác và mỗi mã bảo client làm một việc khác — sửa code (400), sửa dữ liệu nhập (422), chọn email khác (409), hoặc dùng tài nguyên mới ở Location (201).'],
  kn: ['HTTP status codes', 'validation', 'async handlers'],
  tns: [tn('malformed', 'sai dạng', 'Không đọc nổi — 400.'), tn('conflict', 'xung đột', 'Hợp lệ nhưng va chạm trạng thái — 409.')],
  dau: `async function register(req, res, users) {
  // Write your solution here
  const input = JSON.parse(req.rawBody);
  if (!input.email.includes('@')) return res.status(400).json({ error: { code: 'VALIDATION_FAILED' } });
  const user = await users.create(input);
  return res.status(201).json(input);
}
`,
  giai: register,
  chung: RES + `
const mkUsers = (emails) => { const rows = emails.map((e, i) => ({ id: i + 1, email: e })); const log = [];
  const wait = (v) => new Promise((ok) => setTimeout(() => ok(v), 5));
  return { log, rows,
    findByEmail: (e) => { log.push('findByEmail ' + e); return wait(rows.find((r) => r.email === e) || null); },
    create: (d) => { log.push('create ' + d.email); const u = { id: rows.length + 1, email: d.email }; rows.push(u); return wait({ ...u }); } }; };
const call = async (rawBody, emails = ['an@vd.com']) => { const users = mkUsers(emails); const r = mkRes(); await register({ rawBody }, r, users); return { ...view(r), repo: users.log }; };`,
  cases: [
    { goi: `await call('{"email":"binh@vd.com","password":"correct horse"}')`, moTa: ['A new user ⇒ 201 + Location', 'Người dùng mới ⇒ 201 + Location'] },
    { goi: `await call('{title:}')`, moTa: ['Not JSON ⇒ 400, repository untouched', 'Không phải JSON ⇒ 400, kho không bị gọi'] },
    { goi: `await call('{"email":"no-at-sign","password":"123"}')`, moTa: ['Two bad fields ⇒ 422 with both', 'Hai trường sai ⇒ 422 kèm cả hai'] },
    { goi: `await call('{"email":"An@VD.com","password":"long enough"}')`, moTa: ['Same email, other case ⇒ 409', 'Cùng email, khác hoa thường ⇒ 409'] },
    { goi: `await call('[]')`, an: true },
    { goi: `await call('{"email":"chi@vd.com","password":12345678}')`, an: true },
    { goi: `await call('{"email":"Dung@VD.com","password":"12345678","role":"ADMIN"}', [])`, an: true },
    { goi: `await call('')`, an: true },
  ],
  saiMau: [
    register.toString().replace("return res.status(409).json({ error: { code: 'EMAIL_TAKEN', message: 'email already registered' } });", "return res.status(422).json({ error: { code: 'EMAIL_TAKEN', message: 'email already registered' } });"),
    register.toString().replace("const email = input.email.toLowerCase();", 'const email = input.email;'),
  ],
});

export default modul('nodejs-6-2-ma-trang-thai', '6.2 Status codes and response shape', [E1, E2, E3, E4, E5]);
