/** SDN302 · 8.2 — Gia cố production (★): cấu hình qua env, kiểm tra ở rìa (middleware validate), rate limit theo IP, index duy nhất (E11000 → 409, dọn trùng trước khi tạo index), header bảo mật. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'Five habits that turn a demo into a production API', kho: 'EASY', phut: 8,
  en: 'The five habits of lesson 8.2 and the warning about unique indexes.',
  vi: 'Năm thói quen của bài 8.2 và lời cảnh báo về index duy nhất.',
  cau: [
    q('h1', ['A collection already contains two users with the email <code>an@x.com</code>. You add <code>unique: true</code> to the schema. What happens?', 'Collection đã có hai người dùng cùng email <code>an@x.com</code>. Bạn thêm <code>unique: true</code> vào schema. Chuyện gì xảy ra?'],
      ['Building the unique index fails with E11000; duplicates stay in place', 'Mongoose silently deletes the newer of the two duplicate users', 'The schema starts rejecting every future insert into the collection', 'Nothing happens: unique only applies to brand-new collections'],
      ['"Adding a unique constraint does NOT retroactively clean existing duplicate data." Clean first, then build the index.', '"Thêm ràng buộc duy nhất KHÔNG dọn dữ liệu trùng đã có." Dọn trước, rồi mới tạo index.']),
    q('h2', ['What does <code>email: { type: String, unique: true, index: true }</code> give you?', '<code>email: { type: String, unique: true, index: true }</code> cho bạn điều gì?'],
      ['One account per email, enforced by MongoDB, plus fast email lookups', 'Encrypted email addresses that only the server can read back', 'A validator that answers the client with a friendly message', 'Automatic lower-casing of every email before it is saved'],
      ['Two wins from one line. (A unique field is already indexed; <code>index: true</code> just says it out loud.)', 'Hai cái lợi từ một dòng. (Field unique đã có index; <code>index: true</code> chỉ nói to ra.)']),
    q('h3', ['What is the main job of <code>express-rate-limit</code> on <code>POST /api/auth/login</code>?', 'Việc chính của <code>express-rate-limit</code> trên <code>POST /api/auth/login</code> là gì?'],
      ['Capping attempts per IP to blunt brute-force password guessing', 'Making bcrypt faster', 'Caching the login response', 'Blocking requests from other origins'],
      ['After N attempts in a window the client gets 429 Too Many Requests.', 'Sau N lần thử trong một khung giờ, client nhận 429 Too Many Requests.']),
    qn('h4', ['"Validate at the edge, trust nothing inside." Which statements follow from it? (choose all)', '"Kiểm tra ở rìa, không tin gì bên trong." Câu nào suy ra từ đó? (chọn hết)'],
      ['Validation lives in one middleware per route, before the controller', 'The service layer can assume its input is already clean', 'Unknown fields are dropped before reaching the service', 'Every service must re-check every field again', 'Validation is only needed in the React form'],
      [0, 1, 2], ['One boundary check means the inside never has to re-check defensively.', 'Kiểm một lần ở biên nghĩa là bên trong không phải kiểm lại phòng thủ.']),
    q('h5', ['<code>helmet()</code> and <code>morgan()</code> — which pair of jobs?', '<code>helmet()</code> và <code>morgan()</code> — cặp việc nào?'],
      ['helmet sets security headers; morgan logs requests', 'helmet logs requests; morgan sets security headers', 'Both validate request bodies', 'Both are rate limiters'],
      ['Security headers & logging: habit 5 of the lesson.', 'Header bảo mật & ghi log: thói quen 5 của bài.']),
  ],
  goiY: [['Indexes are built from the data that exists.', 'Index được dựng từ dữ liệu đang có.'], ['429 = too many requests.', '429 = quá nhiều request.']],
  loi: [['Expecting unique to clean duplicates.', 'Mong unique dọn bản trùng.'], ['Validating only in the front-end.', 'Chỉ kiểm tra ở front-end.']],
  tns: [tn('rate limiting', 'giới hạn tần suất'), tn('index', 'chỉ mục'), tn('brute force', 'dò mật khẩu bằng cách thử hàng loạt')],
  kn: ['production hardening'],
});

const E2 = bai({
  ten: 'Validate at the edge: a validateBody(schema) middleware', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Instead of <code>if (!name)</code> in every controller, write a tiny Joi/Zod-like middleware factory <code>validateBody(schema)</code>. A schema maps field names to rules:</p>
<pre>{ name:  { type: 'string', required: true, min: 2, max: 50 },   // min/max = length for strings
  price: { type: 'number', required: true, min: 0 },            // min/max = value for numbers
  tags:  { type: 'array' },
  email: { type: 'string', pattern: /^\S+@\S+\.\S+$/ } }</pre>
<ul><li>check each field <b>in schema order</b>, collect every problem as <code>{ field, message }</code> with these messages: <code>"is required"</code>, <code>"must be a string|number|boolean|array"</code>, <code>"must be at least N characters"</code> / <code>"must be at most N characters"</code>, <code>"must be at least N"</code> / <code>"must be at most N"</code>, <code>"has an invalid format"</code> — at most one problem per field (the first);</li>
<li>problems ⇒ <code>400</code> <code>{ error: "Validation failed", details: [...] }</code>;</li>
<li>no problem ⇒ replace <code>req.body</code> with a clean object containing <b>only the schema fields that were sent</b>, then <code>next()</code>.</li></ul>`,
  vi: J`<p>Thay vì <code>if (!name)</code> trong mọi controller, viết một hàm nhà máy middleware nhỏ kiểu Joi/Zod <code>validateBody(schema)</code>. Một schema ánh xạ tên field tới luật:</p>
<pre>{ name:  { type: 'string', required: true, min: 2, max: 50 },   // min/max = độ dài với chuỗi
  price: { type: 'number', required: true, min: 0 },            // min/max = giá trị với số
  tags:  { type: 'array' },
  email: { type: 'string', pattern: /^\S+@\S+\.\S+$/ } }</pre>
<ul><li>kiểm từng field <b>theo thứ tự schema</b>, gom mọi vấn đề thành <code>{ field, message }</code> với các thông báo: <code>"is required"</code>, <code>"must be a string|number|boolean|array"</code>, <code>"must be at least N characters"</code> / <code>"must be at most N characters"</code>, <code>"must be at least N"</code> / <code>"must be at most N"</code>, <code>"has an invalid format"</code> — mỗi field tối đa một vấn đề (cái đầu tiên);</li>
<li>có vấn đề ⇒ <code>400</code> <code>{ error: "Validation failed", details: [...] }</code>;</li>
<li>không vấn đề ⇒ thay <code>req.body</code> bằng đối tượng sạch chỉ chứa <b>các field của schema đã được gửi</b>, rồi <code>next()</code>.</li></ul>`,
  yc: [['A missing optional field is fine (skip its other rules); <code>null</code> counts as missing.', 'Field tuỳ chọn bị thiếu thì không sao (bỏ qua các luật khác của nó); <code>null</code> tính là thiếu.'], ['Type check: arrays are <code>Array.isArray</code>, numbers must not be <code>NaN</code>.', 'Kiểm kiểu: mảng dùng <code>Array.isArray</code>, số không được là <code>NaN</code>.'], ['Export <code>module.exports = { validateBody };</code>', 'Export <code>module.exports = { validateBody };</code>']],
  viDu: [['body { name: "A", price: -1, isAdmin: true }', '400 {"error":"Validation failed","details":[{"field":"name","message":"must be at least 2 characters"},{"field":"price","message":"must be at least 0"}]}', 'Two problems, schema order.', 'Hai vấn đề, theo thứ tự schema.'], ['body { name: "Pen", price: 2, isAdmin: true }', 'next() with req.body = { name: "Pen", price: 2 }', 'isAdmin is stripped.', 'isAdmin bị loại bỏ.']],
  goiY: [['<code>const typeOk = (t, v) => t === \'array\' ? Array.isArray(v) : t === \'number\' ? typeof v === \'number\' && !Number.isNaN(v) : typeof v === t;</code>', '<code>const typeOk = (t, v) => t === \'array\' ? Array.isArray(v) : t === \'number\' ? typeof v === \'number\' && !Number.isNaN(v) : typeof v === t;</code>'], ['Per field: <code>let message = null;</code> then a chain of <code>if (!message &amp;&amp; …)</code>; push when set.', 'Mỗi field: <code>let message = null;</code> rồi một chuỗi <code>if (!message &amp;&amp; …)</code>; có thì push.']],
  loi: [['Stopping at the first invalid field — the form can only show one error per round trip.', 'Dừng ở field sai đầu tiên — form chỉ hiện được một lỗi mỗi lượt.'], ['Keeping unknown fields in <code>req.body</code>: <code>isAdmin: true</code> reaches the service.', 'Giữ field lạ trong <code>req.body</code>: <code>isAdmin: true</code> tới được service.'], ['Treating <code>min</code> the same for strings and numbers.', 'Coi <code>min</code> như nhau cho chuỗi và số.']],
  gt: ['A declarative schema describes the input once; the middleware enforces it at the boundary and hands the controller a clean, allow-listed body. That is what libraries like Joi/Zod do (with many more rules) and why the service layer can stop checking defensively.', 'Một schema khai báo mô tả đầu vào một lần; middleware thực thi nó ở biên và trao cho controller một body sạch, chỉ gồm field được phép. Đó là việc các thư viện như Joi/Zod làm (với nhiều luật hơn nhiều) và là lý do tầng service thôi kiểm phòng thủ.'],
  kn: ['validation middleware', 'schemas'],
  tns: [tn('declarative', 'khai báo', 'nói cái gì, không nói làm thế nào'), tn('allow-list', 'danh sách cho phép')],
  dau: J`function validateBody(schema) {
  return (req, res, next) => {
    for (const field of Object.keys(schema)) {
      if (schema[field].required && !req.body[field]) {
        return res.status(400).json({ error: field + ' is required' });
      }
    }
    next();
  };
}
module.exports = { validateBody };
`,
  giai: J`function typeOk(type, v) {
  if (type === 'array') return Array.isArray(v);
  if (type === 'number') return typeof v === 'number' && !Number.isNaN(v);
  return typeof v === type;                                     // 'string' | 'boolean'
}

function checkField(rule, v) {
  if (v === undefined || v === null) return rule.required ? 'is required' : null;   // optional + missing: fine
  if (rule.type && !typeOk(rule.type, v)) return 'must be ' + (rule.type === 'array' ? 'an array' : 'a ' + rule.type);
  if (typeof v === 'string') {
    if (rule.min !== undefined && v.length < rule.min) return ´must be at least @{rule.min} characters´;
    if (rule.max !== undefined && v.length > rule.max) return ´must be at most @{rule.max} characters´;
    if (rule.pattern && !rule.pattern.test(v)) return 'has an invalid format';
  }
  if (typeof v === 'number') {
    if (rule.min !== undefined && v < rule.min) return ´must be at least @{rule.min}´;
    if (rule.max !== undefined && v > rule.max) return ´must be at most @{rule.max}´;
  }
  return null;
}

function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const details = [];
    const clean = {};
    for (const [field, rule] of Object.entries(schema)) {        // schema order
      const message = checkField(rule, body[field]);
      if (message) details.push({ field, message });
      else if (body[field] !== undefined && body[field] !== null) clean[field] = body[field];
    }
    if (details.length) return res.status(400).json({ error: 'Validation failed', details });
    req.body = clean;                                            // only allow-listed fields go further
    next();
  };
}
module.exports = { validateBody };
`,
  chuanBi: `const { validateBody } = module.exports; const schema = { name: { type: 'string', required: true, min: 2, max: 50 }, price: { type: 'number', required: true, min: 0 }, tags: { type: 'array' }, email: { type: 'string', pattern: /^\\S+@\\S+\\.\\S+$/ } };
const run = async (body) => { const r = await __goi(validateBody(schema), { body }); return { status: r.status, body: r.body, next: r.next, cleaned: r.next ? r.req.body : null }; };`,
  cases: [
    { goi: `await run({ name: 'A', price: -1, isAdmin: true })`, moTa: ['Two problems in schema order', 'Hai vấn đề theo thứ tự schema'] },
    { goi: `await run({ name: 'Pen', price: 2, isAdmin: true })`, moTa: ['Valid → next() with unknown fields stripped', 'Hợp lệ → next() và bỏ field lạ'] },
    { goi: `await run({ price: '2', tags: 'x', email: 'nope' })`, moTa: ['Missing, wrong types, bad format', 'Thiếu, sai kiểu, sai định dạng'] },
    { goi: `[await run({ name: 'x'.repeat(51), price: 0 }), await run({ name: 'Ok', price: NaN }), await run({ name: 'Ok', price: 1, tags: ['a'], email: 'a@b.co', email2: 'x' })]`, an: true },
    { goi: `[await run(undefined), await run({ name: null, price: null })]`, an: true },
  ],
});

const E3 = bai({
  ten: 'Rate limiting per IP: a fixed-window limiter with 429 and Retry-After', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Write <code>rateLimit({ windowMs, max })</code> — the idea of <code>express-rate-limit</code> — that returns a middleware:</p>
<ul><li>requests are counted per <code>req.ip</code> in fixed windows of <code>windowMs</code> milliseconds (a window starts with the first request of that IP; when <code>windowMs</code> has passed since, a new window starts);</li>
<li>every response carries <code>RateLimit-Limit: max</code> and <code>RateLimit-Remaining: n</code> (never below 0);</li>
<li>the (max+1)-th request in a window ⇒ <code>429</code> <code>{ error: "Too many requests, try again later" }</code> with header <code>Retry-After</code> = seconds until the window ends (rounded up), and the route is NOT called.</li></ul>
<p>The app applies <code>rateLimit({ windowMs: 60000, max: 5 })</code> to <code>POST /api/auth/login</code> only. Time is virtual: <code>Date.now()</code> moves when the grader waits.</p>`,
  vi: J`<p>Viết <code>rateLimit({ windowMs, max })</code> — ý tưởng của <code>express-rate-limit</code> — trả về một middleware:</p>
<ul><li>request được đếm theo <code>req.ip</code> trong các khung cố định <code>windowMs</code> mili-giây (một khung bắt đầu bằng request đầu tiên của IP đó; khi đã qua <code>windowMs</code> kể từ đó thì khung mới bắt đầu);</li>
<li>mọi response mang <code>RateLimit-Limit: max</code> và <code>RateLimit-Remaining: n</code> (không bao giờ dưới 0);</li>
<li>request thứ (max+1) trong một khung ⇒ <code>429</code> <code>{ error: "Too many requests, try again later" }</code> kèm header <code>Retry-After</code> = số giây tới khi khung kết thúc (làm tròn lên), và route KHÔNG được gọi.</li></ul>
<p>App áp <code>rateLimit({ windowMs: 60000, max: 5 })</code> cho riêng <code>POST /api/auth/login</code>. Thời gian là ảo: <code>Date.now()</code> nhích khi máy chấm chờ.</p>`,
  yc: [['Store <code>{ start, count }</code> in a <code>Map</code> keyed by IP, inside the factory (one store per limiter).', 'Lưu <code>{ start, count }</code> trong một <code>Map</code> theo khoá IP, bên trong hàm nhà máy (mỗi limiter một kho).'], ['<code>Math.ceil((start + windowMs - now) / 1000)</code> for Retry-After.', '<code>Math.ceil((start + windowMs - now) / 1000)</code> cho Retry-After.'], ['Export <code>module.exports = { app, rateLimit };</code>', 'Export <code>module.exports = { app, rateLimit };</code>']],
  viDu: [['6 × POST /api/auth/login from 10.0.0.1 within a minute', '401 401 401 401 401 then 429 (Retry-After: 60)', 'The 6th attempt never reaches bcrypt.', 'Lần thứ 6 không bao giờ chạm tới bcrypt.'], ['the same IP 61 seconds later', '401 again, RateLimit-Remaining: 4', 'A new window.', 'Một khung mới.']],
  goiY: [['<code>let e = hits.get(req.ip); if (!e || now - e.start >= windowMs) { e = { start: now, count: 0 }; hits.set(req.ip, e); } e.count++;</code>', '<code>let e = hits.get(req.ip); if (!e || now - e.start >= windowMs) { e = { start: now, count: 0 }; hits.set(req.ip, e); } e.count++;</code>'], ['Set the two RateLimit headers BEFORE deciding, so both 429 and normal answers carry them.', 'Đặt hai header RateLimit TRƯỚC khi quyết định, để cả 429 lẫn câu trả lời thường đều có.']],
  loi: [['One global counter for everyone: one attacker locks out every user.', 'Một bộ đếm chung cho mọi người: một kẻ tấn công khoá tất cả người dùng.'], ['The store outside the factory: two limiters (login, register) share counts.', 'Kho nằm ngoài hàm nhà máy: hai limiter (login, register) dùng chung số đếm.'], ['Applying the limiter AFTER the route: it never runs for answered requests.', 'Áp limiter SAU route: nó không bao giờ chạy cho request đã được trả lời.']],
  gt: ['A fixed window per IP is the simplest useful limiter: count, compare with max, refuse with 429 and tell the client when to come back. Scoping it to the login route blunts password brute-forcing without slowing normal browsing. (Real deployments keep the counters in Redis so several server instances share them.)', 'Khung cố định theo IP là limiter đơn giản nhất mà hữu ích: đếm, so với max, từ chối bằng 429 và báo client khi nào quay lại. Giới hạn nó cho route đăng nhập làm cùn việc dò mật khẩu mà không làm chậm việc duyệt bình thường. (Triển khai thật giữ bộ đếm trong Redis để nhiều instance server dùng chung.)'],
  kn: ['rate limiting', '429'],
  tns: [tn('fixed window', 'khung cố định'), tn('Retry-After', 'header báo thử lại sau bao lâu')],
  dau: J`const express = require('express');
let count = 0;
function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    count++;
    if (count > max) res.status(429).json({ error: 'Too many requests, try again later' });
    next();
  };
}

const app = express();
app.use(express.json());
app.post('/api/auth/login', (req, res) => res.status(401).json({ error: 'Invalid credentials' }));
app.post('/api/auth/login', rateLimit({ windowMs: 60000, max: 5 }));
module.exports = { app, rateLimit };
`,
  giai: J`const express = require('express');

function rateLimit({ windowMs, max }) {
  const hits = new Map();                                    // ip ⇒ { start, count } — one store per limiter
  return (req, res, next) => {
    const now = Date.now();
    let entry = hits.get(req.ip);
    if (!entry || now - entry.start >= windowMs) {           // first request, or the window is over
      entry = { start: now, count: 0 };
      hits.set(req.ip, entry);
    }
    entry.count++;
    res.set('RateLimit-Limit', String(max));
    res.set('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests, try again later' });   // the route is NOT called
    }
    next();
  };
}

const app = express();
app.use(express.json());
// only the login route is limited — before its handler
app.post('/api/auth/login', rateLimit({ windowMs: 60000, max: 5 }), (req, res) => res.status(401).json({ error: 'Invalid credentials' }));
module.exports = { app, rateLimit };
`,
  chuanBi: `const { app, rateLimit } = module.exports; const hit = async (ip = '10.0.0.1') => { const r = await app.inject({ method: 'POST', url: '/api/auth/login', ip, body: { email: 'a@x.com', password: 'guess' } }); return [r.status, r.headers['ratelimit-remaining'] || null, r.headers['retry-after'] || null]; };
const many = async (n, ip) => { const out = []; for (let i = 0; i < n; i++) out.push(await hit(ip)); return out; };`,
  cases: [
    { goi: `await many(6)`, moTa: ['5 attempts pass (401), the 6th is 429 with Retry-After', '5 lần qua (401), lần 6 là 429 kèm Retry-After'] },
    { goi: `[await many(6, '10.0.0.1'), await hit('10.0.0.2')]`, moTa: ['Counted per IP', 'Đếm theo IP'] },
    { goi: `(await many(6), await __sleep(20000), [await hit(), await __sleep(41000), await hit()])`, moTa: ['Retry-After counts down; a new window after 60 s', 'Retry-After đếm ngược; khung mới sau 60 s'] },
    { goi: `await (async () => { const lim = rateLimit({ windowMs: 1000, max: 1 }); const a = await __goi(lim, { ip: '1.1.1.1' }); const b = await __goi(lim, { ip: '1.1.1.1' }); return [a.next, b.status, b.headers['retry-after']]; })()`, an: true },
    { goi: `(await many(5), (await app.inject({ method: 'POST', url: '/api/auth/login', ip: '10.0.0.1' })).body)`, an: true },
  ],
  timeoutMs: 200000,
});

const E4 = bai({
  ten: 'Unique emails: clean the duplicates, build the index, answer 409', kho: 'MEDIUM', phut: 20, lib: ['mongoose', 'mongosh', 'express'],
  en: J`<p>The users collection was created without <code>unique</code>, and now contains duplicates — some identical, some differing only in letter case. The schema has been fixed (<code>email: { unique: true, lowercase: true }</code>) but <code>User.syncIndexes()</code> fails with E11000. Write:</p>
<ol><li><code>dedupeUsers()</code> — for each email compared <b>case-insensitively</b>, keep the OLDEST user (smallest <code>createdAt</code>) and delete the others; also store every kept email in lower case (<code>updateOne</code>); return the number of deleted users;</li>
<li><code>register(req, res, next)</code> — create the user; a duplicate (E11000 from the index) ⇒ <code>409</code> <code>{ error: "Email already registered" }</code>; else <code>201</code> <code>{ id, email }</code>.</li></ol>
<p>The grader runs <code>dedupeUsers()</code>, then <code>User.syncIndexes()</code>, then registers.</p>`,
  vi: J`<p>Collection users được tạo khi chưa có <code>unique</code>, và giờ chứa các bản trùng — có cái giống hệt, có cái chỉ khác nhau hoa thường. Schema đã được sửa (<code>email: { unique: true, lowercase: true }</code>) nhưng <code>User.syncIndexes()</code> hỏng với E11000. Viết:</p>
<ol><li><code>dedupeUsers()</code> — với mỗi email so <b>không phân biệt hoa thường</b>, giữ người dùng CŨ NHẤT (<code>createdAt</code> nhỏ nhất) và xoá những người còn lại; đồng thời lưu mọi email được giữ ở dạng chữ thường (<code>updateOne</code>); trả số người dùng đã xoá;</li>
<li><code>register(req, res, next)</code> — tạo người dùng; bản trùng (E11000 từ index) ⇒ <code>409</code> <code>{ error: "Email already registered" }</code>; còn lại <code>201</code> <code>{ id, email }</code>.</li></ol>
<p>Máy chấm chạy <code>dedupeUsers()</code>, rồi <code>User.syncIndexes()</code>, rồi đăng ký.</p>`,
  yc: [['Sort by <code>createdAt</code> ascending, walk the list, remember emails already kept in a <code>Set</code>.', 'Sắp theo <code>createdAt</code> tăng dần, đi qua danh sách, nhớ email đã giữ trong một <code>Set</code>.'], ['Delete with <code>User.deleteMany({ _id: { $in: ids } })</code> — one round trip.', 'Xoá bằng <code>User.deleteMany({ _id: { $in: ids } })</code> — một lượt.'], ['Export <code>module.exports = { User, dedupeUsers, register };</code>', 'Export <code>module.exports = { User, dedupeUsers, register };</code>']],
  viDu: [['users: An@x.com (oldest), An@x.com, binh@x.com, AN@x.com', 'dedupeUsers() → 2 · then syncIndexes() succeeds', 'One An and one Binh remain, both lower-case.', 'Còn một An và một Binh, đều chữ thường.'], ['register { email: "AN@x.com" } after that', '409 {"error":"Email already registered"}', 'lowercase: true + the unique index.', 'lowercase: true + index duy nhất.']],
  goiY: [['<code>const users = await User.find().sort({ createdAt: 1 });</code>', '<code>const users = await User.find().sort({ createdAt: 1 });</code>'], ['<code>const key = u.email.toLowerCase(); if (seen.has(key)) toDelete.push(u._id); else { seen.add(key); if (u.email !== key) await User.updateOne({ _id: u._id }, { email: key }); }</code>', '<code>const key = u.email.toLowerCase(); if (seen.has(key)) toDelete.push(u._id); else { seen.add(key); if (u.email !== key) await User.updateOne({ _id: u._id }, { email: key }); }</code>']],
  loi: [['Keeping the NEWEST user — the oldest account owns the history (orders, posts) that reference it.', 'Giữ người dùng MỚI NHẤT — tài khoản cũ nhất sở hữu lịch sử (đơn hàng, bài viết) đang tham chiếu tới nó.'], ['Lower-casing the kept emails after building the index: two "different" emails collide later.', 'Đổi email được giữ thành chữ thường sau khi tạo index: hai email "khác nhau" va nhau về sau.'], ['Answering E11000 as 500.', 'Trả E11000 thành 500.']],
  gt: ['A unique index is built from the data that exists, so duplicates must be resolved first — the warning of the lesson. Normalising the key (lower case) is part of the cleanup, otherwise "An@x.com" and "an@x.com" survive as two accounts. Afterwards the database guarantees uniqueness for every future write, and the API only has to translate E11000 into a 409.', 'Index duy nhất được dựng từ dữ liệu đang có, nên phải giải quyết bản trùng trước — lời cảnh báo của bài. Chuẩn hoá khoá (chữ thường) là một phần của việc dọn, không thì "An@x.com" và "an@x.com" vẫn sống thành hai tài khoản. Sau đó CSDL bảo đảm tính duy nhất cho mọi lần ghi về sau, và API chỉ việc dịch E11000 thành 409.'],
  kn: ['unique index', 'data cleanup', 'E11000'],
  tns: [tn('syncIndexes', 'đồng bộ index với schema'), tn('normalise', 'chuẩn hoá')],
  dau: J`const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true }));

async function dedupeUsers() {
  return 0;
}
async function register(req, res, next) {
  try { res.status(201).json(await User.create(req.body)); } catch (e) { next(e); }
}
module.exports = { User, dedupeUsers, register };
`,
  giai: J`const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true }));

async function dedupeUsers() {
  const users = await User.find().sort({ createdAt: 1 });        // oldest first
  const seen = new Set();
  const toDelete = [];
  for (const u of users) {
    const key = u.email.toLowerCase();
    if (seen.has(key)) { toDelete.push(u._id); continue; }        // a younger duplicate
    seen.add(key);
    if (u.email !== key) await User.updateOne({ _id: u._id }, { email: key });   // normalise the survivor
  }
  if (toDelete.length) await User.deleteMany({ _id: { $in: toDelete } });       // one round trip
  return toDelete.length;
}

async function register(req, res, next) {
  try {
    const user = await User.create({ name: req.body.name, email: req.body.email });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Email already registered' });   // the index said no
    next(e);
  }
}
module.exports = { User, dedupeUsers, register };
`,
  chuanBi: `const { dedupeUsers, register } = module.exports; const coll = mongoose.model('User').collection.name;
for (const [name, email] of [['An', 'An@x.com'], ['An 2', 'An@x.com'], ['Binh', 'binh@x.com'], ['An 3', 'AN@x.com']]) { db[coll].insertOne({ name, email, createdAt: new Date(Date.now()) }); await __sleep(10); }
const reg = async (body) => __pick(await __goi(register, { body }), 'status body');`,
  cases: [
    { goi: `await mongoose.model('User').syncIndexes().then(() => 'built', (e) => e.code)`, moTa: ['Before cleaning: the index cannot be built (E11000)', 'Trước khi dọn: không dựng được index (E11000)'] },
    { goi: `[await dedupeUsers(), (await mongoose.model('User').find().sort({ createdAt: 1 })).map((u) => u.name + ' ' + u.email)]`, moTa: ['2 deleted; the oldest An survives, lower-cased', 'Xoá 2; An cũ nhất còn lại, đã chữ thường'] },
    { goi: `(await dedupeUsers(), await mongoose.model('User').syncIndexes().then(() => 'built', (e) => e.code), [await reg({ name: 'X', email: 'AN@x.com' }), (await reg({ name: 'C', email: 'chi@x.com' })).status])`, moTa: ['After cleaning: the index builds, a duplicate → 409', 'Sau khi dọn: index dựng được, bản trùng → 409'] },
    { goi: `[await dedupeUsers(), await dedupeUsers()]`, an: true },
  ],
});

const E5 = bai({
  ten: 'Harden the app: security headers, no X-Powered-By, safe errors, limits', kho: 'HARD', phut: 25, lib: ['express'],
  en: J`<p>Turn the demo app into something you would trust with real users:</p>
<ol><li><code>app.disable('x-powered-by')</code> — do not advertise the framework;</li>
<li><code>securityHeaders</code> middleware (a small subset of what <code>helmet()</code> sets) on every response: <code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: SAMEORIGIN</code>, <code>Referrer-Policy: no-referrer</code>, <code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code>;</li>
<li><code>express.json({ limit: '10kb' })</code> — a body over 10 KB ⇒ <code>413</code> <code>{ error: "Payload too large" }</code>;</li>
<li>one error handler: <code>err.status</code> 4xx ⇒ that status and a safe message (<code>"Invalid JSON"</code> for <code>entity.parse.failed</code>, <code>"Payload too large"</code> for <code>entity.too.large</code>, else <code>err.message</code>); everything else ⇒ <code>500</code> <code>{ error: "Internal Server Error" }</code> and nothing more (no stack, no message);</li>
<li>a JSON 404 <code>{ error: "Not found" }</code> for unknown routes.</li></ol>
<p>Routes (given): <code>GET /api/health</code>, <code>POST /api/echo</code>, <code>GET /api/crash</code>. Export <code>module.exports = app;</code></p>`,
  vi: J`<p>Biến app demo thành thứ bạn dám giao cho người dùng thật:</p>
<ol><li><code>app.disable('x-powered-by')</code> — đừng quảng cáo framework;</li>
<li>middleware <code>securityHeaders</code> (một tập con nhỏ của những gì <code>helmet()</code> đặt) cho mọi response: <code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: SAMEORIGIN</code>, <code>Referrer-Policy: no-referrer</code>, <code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code>;</li>
<li><code>express.json({ limit: '10kb' })</code> — thân quá 10 KB ⇒ <code>413</code> <code>{ error: "Payload too large" }</code>;</li>
<li>một error handler: <code>err.status</code> 4xx ⇒ mã đó và thông báo an toàn (<code>"Invalid JSON"</code> cho <code>entity.parse.failed</code>, <code>"Payload too large"</code> cho <code>entity.too.large</code>, còn lại <code>err.message</code>); mọi thứ khác ⇒ <code>500</code> <code>{ error: "Internal Server Error" }</code> và không gì thêm (không stack, không message);</li>
<li>404 JSON <code>{ error: "Not found" }</code> cho route lạ.</li></ol>
<p>Route (cho sẵn): <code>GET /api/health</code>, <code>POST /api/echo</code>, <code>GET /api/crash</code>. Export <code>module.exports = app;</code></p>`,
  yc: [['<code>securityHeaders</code> goes FIRST so even 404 and error answers carry the headers.', '<code>securityHeaders</code> đặt ĐẦU TIÊN để cả câu trả lời 404 và lỗi cũng có header.'], ['The error handler has four parameters and comes last.', 'Error handler có bốn tham số và đứng cuối.']],
  viDu: [['GET /api/health', '200 {"ok":true} · X-Content-Type-Options: nosniff · … · no X-Powered-By', 'Headers on every response.', 'Header trên mọi response.'], ['GET /api/crash', '500 {"error":"Internal Server Error"}', 'The real message (a connection string) stays in the log.', 'Thông báo thật (một chuỗi kết nối) ở lại trong log.']],
  goiY: [['<code>const securityHeaders = (req, res, next) => { res.set({ \'X-Content-Type-Options\': \'nosniff\', … }); next(); };</code>', '<code>const securityHeaders = (req, res, next) => { res.set({ \'X-Content-Type-Options\': \'nosniff\', … }); next(); };</code>'], ['<code>if (err.type === \'entity.too.large\') return res.status(413).json({ error: \'Payload too large\' });</code>', '<code>if (err.type === \'entity.too.large\') return res.status(413).json({ error: \'Payload too large\' });</code>']],
  loi: [['Sending <code>err.stack</code> "to help debugging" — it reveals file paths, library versions and sometimes secrets.', 'Gửi <code>err.stack</code> "để dễ gỡ lỗi" — nó lộ đường dẫn tệp, phiên bản thư viện và đôi khi cả bí mật.'], ['Adding the headers in the route handlers only — the 404 and 500 answers miss them.', 'Chỉ thêm header trong route handler — câu trả lời 404 và 500 thiếu chúng.'], ['No body size limit: one 50 MB JSON body ties up the event loop while it is parsed.', 'Không giới hạn kích thước thân: một body JSON 50 MB chiếm event loop trong lúc được parse.']],
  gt: ['Each line removes one kind of risk: fewer fingerprints (no X-Powered-By), safer browser behaviour (nosniff, framing, referrer, HSTS), bounded input (body limit), and no internal details in failures. Putting the header middleware first and the error handler last makes every response — including the failures — follow the same policy.', 'Mỗi dòng gỡ một loại rủi ro: ít dấu vân tay hơn (không X-Powered-By), trình duyệt hành xử an toàn hơn (nosniff, chặn nhúng khung, referrer, HSTS), đầu vào có giới hạn (giới hạn body), và không lộ chi tiết nội bộ khi hỏng. Đặt middleware header đầu tiên và error handler cuối cùng khiến mọi response — kể cả lỗi — theo cùng một chính sách.'],
  kn: ['security headers', 'error hygiene', 'body limits'],
  tns: [tn('HSTS', 'Strict-Transport-Security', 'buộc trình duyệt dùng HTTPS'), tn('fingerprinting', 'nhận dạng công nghệ')],
  dau: J`const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.post('/api/echo', (req, res) => res.json(req.body));
app.get('/api/crash', () => { throw new Error('connect ECONNREFUSED mongodb://admin:pw@10.0.0.5:27017'); });

app.use((err, req, res, next) => res.status(500).json({ error: err.message, stack: err.stack }));
module.exports = app;
`,
  giai: J`const express = require('express');
const app = express();

app.disable('x-powered-by');                                   // do not advertise the framework

// a small subset of helmet(): FIRST, so 404s and errors carry the headers too
function securityHeaders(req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  });
  next();
}
app.use(securityHeaders);
app.use(express.json({ limit: '10kb' }));                      // bounded input

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.post('/api/echo', (req, res) => res.json(req.body));
app.get('/api/crash', () => { throw new Error('connect ECONNREFUSED mongodb://admin:pw@10.0.0.5:27017'); });

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status >= 400 && err.status < 500) {
    const error = err.type === 'entity.parse.failed' ? 'Invalid JSON'
      : err.type === 'entity.too.large' ? 'Payload too large'
        : err.message;
    return res.status(err.status).json({ error });
  }
  console.error(err);                                          // details for you, in the log
  res.status(500).json({ error: 'Internal Server Error' });    // nothing else for the client
});

module.exports = app;
`,
  chuanBi: `const go = async (method, url, body, headers) => { const r = await module.exports.inject({ method, url, body, headers }); const h = {}; ['x-powered-by', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'strict-transport-security'].forEach((k) => { h[k] = r.headers[k] || null; }); return { status: r.status, body: r.body, headers: h }; };`,
  cases: [
    { goi: `await go('GET', '/api/health')`, moTa: ['Security headers present, no X-Powered-By', 'Có header bảo mật, không X-Powered-By'] },
    { goi: `await go('GET', '/api/crash')`, moTa: ['500 without message or stack', '500 không message, không stack'] },
    { goi: `[(await go('GET', '/api/nope')), (await go('POST', '/api/echo', '{bad', { 'content-type': 'application/json' }))]`, moTa: ['JSON 404 and 400 Invalid JSON — with the headers', '404 JSON và 400 Invalid JSON — đều có header'] },
    { goi: `[(await go('POST', '/api/echo', { text: 'x'.repeat(11 * 1024) })).status, (await go('POST', '/api/echo', { text: 'x'.repeat(11 * 1024) })).body, (await go('POST', '/api/echo', { a: 1 })).body]`, moTa: ['A body over 10 KB → 413', 'Thân quá 10 KB → 413'] },
    { goi: `JSON.stringify(await go('GET', '/api/crash')).includes('mongodb://')`, an: true },
    { goi: `(await go('GET', '/api/crash'), __log.some((l) => l.includes('ECONNREFUSED')))`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-8-2-production',
  ten: '8.2 Production hardening: env, validation, rate limits & indexes',
  khoa: KHOA,
  baiHoc: 'sdn302-8-2-production',
  de: [E1, E2, E3, E4, E5],
});
