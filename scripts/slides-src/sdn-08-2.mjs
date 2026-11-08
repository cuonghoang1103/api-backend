/**
 * sdn-08-2 — SDN302 · Chương 8 · Bài 8.2 "Production hardening: env, validation, rate limits & indexes" (slide EN, đợt 12b — 08/11/2026).
 * MỘT deck, HAI tập: sdn-8-2 (slide 1–11: bản "trước", env + fail-fast, validate ở cửa, Zod/Joi, rate limit, trust proxy) ·
 *   sdn-8-2-2 (slide 12–21: unique + E11000 ⇒ 409, unique thêm muộn, bản im lặng của Mongoose, index cho tốc độ, helmet + morgan, trước/sau, ăn điểm…).
 * Nguồn: SDN302 › sdn302-8-2-production (5 thói quen). BỔ SUNG: cùng một API trước/sau gia cố, cùng 10 lệnh curl (that/s82/before-app vs after-app) ·
 *   config.js kiểm env bằng Zod, thoát mã 1 · Joi đổi "12" thành 12, Zod strict từ chối · 401×5 rồi 429 kể cả mật khẩu đúng + header RateLimit draft-8 ·
 *   express-rate-limit tự cảnh báo trust proxy (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR / ERR_ERL_PERMISSIVE_TRUST_PROXY) · createIndex unique hỏng E11000 khi
 *   đã có bản trùng · Mongoose unique: true hỏng ÂM THẦM (chỉ còn _id_, User.init() mới lộ) · COLLSCAN 39.05 ms vs IXSCAN 0.86 ms trên 200,000 user.
 * Output THẬT: Node 22.23.3 · Express 5.3.0 · Mongoose 9.11.4 · MongoDB 7.0 (Docker sdn82-mongo, đã gỡ) · zod 4.6.7 · joi 18.3.2 · express-rate-limit 8.7.3 ·
 *   helmet 8.3.0 · morgan 1.12.1 · dotenv 18.0.9 — that/s82/*.
 */
import { lamDeck, two, box, cards, flow, bang, js, term, ma, ra, gay, cot } from './_sdn-chung.mjs';
import { JW } from './_c7-chung.mjs';

export const deck = { key: 'sdn-08-2', code: 'SDN302 8.2', title: 'Production hardening: env, validation, rate limits & indexes', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const J = (src, o = {}) => js(src, { sm: o.sm ?? true, hl: o.hl });
const T = (text, title, o = {}) => term(text, { title, sm: o.sm ?? true, hl: o.hl });
/** Output thật, dòng lệnh `$ …` thay bằng nhãn ngắn (kết quả giữ nguyên), gói dòng dài. */
const rut = (ten, nhan, a, b, n = 100) => { let k = 0; return gay(ra(ten, a, b).split('\n').map((l) => (l.startsWith('$ ') ? `$ ${nhan[k++] ?? l.slice(2)}` : l)).join('\n'), n); };
const ma1 = (ten, a, b) => ma(ten, a, b).replace(/\s+\/\/ # demo: start empty/, '');

export const slides = lamDeck({ chuong: 'Chapter 8 — Beyond the syllabus', bai: '8.2' }, [
  { cover: true, t: 'Production hardening:<br>env, validation, rate limits & indexes', sub: 'The same API before and after five habits — and ten real requests that show the difference.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A class project that passes every demo — and the six holes ten real requests find in it</li>
<li>Habit 1: settings from the environment, checked at startup (fail fast)</li>
<li>Habit 2: validation at the boundary, with Zod (or Joi), not with if (!name)</li>
<li>Habit 3: rate limiting the login, and the proxy setting that breaks it</li>
<li>Habit 4: a unique index on email — and what happens when you add it late</li>
<li>Habit 5: helmet for headers, morgan for a log line per request</li>
</ul>` + box('Outside the syllabus — but inside the project defence', 'None of this is graded as a session. All of it is what an examiner tries first: an empty name, a duplicate email, ten wrong passwords.', 'lam') },

  { t: 'Before: a class project that "works"', to: true, giua: true, body: JW(ma1('s82/before-app', 10, 12) + '\n' + ma1('s82/before-app', 15, 26), 92, [2, 6, 12, 15]) +
    box('It passes the demo — look closer', 'Validation is one if, the JWT secret is in the code, and anything in req.body goes into the database.', 'do2') },

  { t: 'Ten requests an examiner would send', to: true, giua: true, body: T(rut('s82/before-app', [
    'POST /api/products  {"name":"   ","price":-5}', 'POST /api/products  {"name":"Pen","price":"abc"}', 'POST /api/register  {…,"role":"admin"}',
    'POST /api/register  an@example.com   (again)', 'POST /api/register  an@example.com   (and again)', 'POST /api/products  {"name":   (broken JSON)',
    'POST /api/login  × 7 wrong passwords', 'POST /api/login  right password', 'GET /api/products  (headers)'], 1, 20, 104), 'the BEFORE app · real', { hl: [2, 4, 6, 8, 10, 12, 14, 19] }) },

  { t: 'Habit 1: settings come from the environment', to: true, giua: true, body: J(ma('s82/config', 2, 16), { hl: [1, 5, 6, 7, 13] }) +
    two(box('One place, read once', 'Every file imports config — nobody reads process.env directly, so a typo cannot hide in a corner of the app.', 'lam'),
      box('dotenv only for development', 'On the host you set real variables in its dashboard. .env stays on your laptop.', 'cam')) },

  { t: 'Fail fast — run it', to: true, giua: true, body: T(ra('s82/env-failfast', 2, 13), 'node app.js · three environments · real', { hl: [2, 3, 7, 10] }) +
    two(T(ra('s82/env-failfast', 15, 18), 'git status · .env in .gitignore · real'),
      box('Exit code 1 before the first request', 'Without the check, the first LOGIN crashes: "secretOrPrivateKey must have a value" (lesson 5.2).', 'xanh')) },

  { t: 'Habit 2: validate at the boundary', to: true, giua: true, body: JW(ma('s82/after-app', 27, 34), 92, [2, 4, 7, 8]) +
    two(box('safeParse', 'Never throws: returns success + data, or success: false + a list of issues. One middleware turns that into a 400 for every route.', 'lam'),
      box('req.body = r.data', 'The service now receives cleaned data: trimmed strings, no unknown fields. Nothing behind the boundary re-checks it.', 'xanh')) },

  { t: 'Same three requests, after', to: true, giua: true, body: T(rut('s82/after-app', [
    'POST /api/products  {"name":"   ","price":-5}', 'POST /api/products  {"name":"Pen","price":"abc"}', 'POST /api/register  {…,"role":"admin"}'], 1, 6, 104), 'the AFTER app · real', { hl: [2, 4, 6] }) +
    bang(['request', 'before', 'after'], [['blank name, price −5', '201 — saved', '400'], ['price "abc"', '500 + Mongoose internals', '400'], ['"role": "admin" in register', '201 — an admin account', '400 Unrecognized key']], { co: 22 }) +
    box('.strict() stops mass assignment', 'User.create({ ...req.body }) copied role from the stranger. A strict schema rejects every key you did not list.', 'do2') },

  { t: 'Zod or Joi — pick one', to: true, giua: true, body: JW(ma('s82/joi-vs-zod', 6, 7), 92) +
    T(gay(ra('s82/joi-vs-zod', 2, 5), 100), 'the same bad body { name: "   ", price: "12", role: "admin" } · real', { hl: [4, 6] }) +
    two(box('Joi converts by default', 'The string "12" quietly became the number 12, so Joi did not report price at all. Fine — if you know it.', 'cam'),
      box('Zod is strict by default', 'A string is not a number. Use z.coerce.number() for query strings, where everything arrives as text.', 'lam')) },

  { t: 'Habit 3: rate-limit the login', to: true, giua: true, body: J(ma('s82/after-app', 36, 37) + '\n' + ma('s82/after-app', 44, 44), { hl: [1, 3] }) +
    T(rut('s82/after-app', ['POST /api/login  × 7 wrong passwords', 'POST /api/login  right password'], 13, 19, 100), 'the AFTER app · real', { hl: [2, 4, 5, 6, 7] }) +
    two(box('After 5 tries: 429', 'Even the right password waits 900 s. That is the price: brute force now costs 15 minutes per 5 guesses.', 'xanh'),
      box('Standard headers', 'RateLimit says how many are left (r) and when the window resets (t); Retry-After tells the client when to come back.', 'lam')) },

  { t: 'Behind a proxy: who is the client?', to: true, giua: true, body: T(rut('s82/ratelimit-proxy', ['5 requests, trust proxy off, X-Forwarded-For 203.0.113.1…5', '5 requests, trust proxy true, a different X-Forwarded-For each time'], 1, 8), 'two apps, limit 3 · real', { hl: [2, 4, 5, 6, 7, 8] }) +
    T(ra('s82/ratelimit-proxy', 3, 3, 'server').slice(0, 96) + '…\n' + ra('s82/ratelimit-proxy', 13, 13, 'server').slice(0, 96) + '…', 'express-rate-limit warns in the server log · real', { hl: [1, 2] }) +
    box('trust proxy true = the attacker picks req.ip', 'Five "different" clients, never blocked. Behind exactly one proxy: app.set(\'trust proxy\', 1). Node.js 12.4 and API Design 5.3 measure it further.', 'do2') },

  // ───────── phần B (tập sdn-8-2-2) ─────────
  { t: 'Habit 4: one account per email', to: true, giua: true, body: T(rut('s82/before-app', ['POST /api/register  an@example.com', 'POST /api/register  an@example.com   (again)', 'POST /api/register  an@example.com   (and again)'], 5, 10, 100), 'BEFORE: three accounts, one email · real', { hl: [2, 4, 6] }) +
    T(rut('s82/after-app', ['POST /api/register  an@example.com', 'POST /api/register  an@example.com   (again)'], 7, 10, 100), 'AFTER: the database refuses · real', { hl: [4] }) +
    J(ma('s82/after-app', 18, 18) + '\n' + ma('s82/after-app', 52, 52), { sm: false }) },

  { t: 'Adding unique after the duplicates exist', to: true, giua: true, body: T(gay(ra('s82/index-unique', 2, 4).replace(/Index build failed: [0-9a-f-]+: Collection idx82\.users \( [0-9a-f-]+ \) :: caused by :: /, 'Index build failed: … caused by ::\n  '), 112), 'createIndex({ email: 1 }, { unique: true }) on last week\'s data · real', { hl: [2, 3, 4] }) +
    JW(ma('s82/index-unique', 16, 22), 100, [2, 5, 7]) + T(gay(ra('s82/index-unique', 5, 9), 112), 'clean first, then build the index · real', { hl: [3] }) },

  { t: 'The silent version: Mongoose', to: true, giua: true, body: J(ma('s82/unique-silent', 9, 14), { hl: [1, 2, 5] }) +
    T(gay(ra('s82/unique-silent', 2, 4), 100), 'node unique-silent.js · real', { hl: [1, 2, 3] }) +
    two(box('unique: true is not a validator', 'It only asks MongoDB to build an index — in the background. When the build fails, the app keeps running and duplicates keep coming.', 'do2'),
      box('await User.init() at startup', 'The after app waits for it before listen(): a failed index stops the deploy instead of hiding.', 'xanh')) },

  { t: 'An index also makes login fast', to: true, giua: true, body: J("await users.findOne({ email: 'user199999@example.com' });   // every login does this", { sm: false }) +
    T(gay(ra('s82/index-explain', 2, 4), 100), 'node index-explain.js · 200,000 users · real', { hl: [2, 3] }) +
    two(box('COLLSCAN: read every document', 'No index: MongoDB opens all 200,000 users to find one email.', 'do2'), box('IXSCAN: walk the B-tree', 'With email_1: one key, one document. The same unique index does both jobs.', 'xanh')) +
    box('Index what you filter and sort on', 'email for login, author + createdAt for a feed. Every extra index slows writes a little — do not index everything.', 'lam') },

  { t: 'Habit 5: helmet and morgan', to: true, giua: true, body: two(cot(T(ra('s82/before-app', 18, 20), 'BEFORE · response headers · real', { hl: [2] }),
      T(ra('s82/after-app', 21, 25).replace(/^(Content-Security-Policy: .{8}).*$/m, '$1…'), 'AFTER helmet() · first lines · real')),
    T(ra('s82/after-app', 2, 9, 'server'), 'morgan(\'tiny\') · the server log · real', { hl: [5, 6] })) +
    box('Two lines of setup', 'helmet() removes X-Powered-By and adds a dozen browser-protection headers. morgan prints method, path, status, size and time for every request.', 'lam') },

  { t: 'Ten requests, before and after', to: true, giua: true, body: bang(['the request', 'before', 'after'], [
    ['blank name, price −5', '201 saved', '400'], ['price "abc"', '500, internals leaked', '400'], ['"role": "admin"', '201 admin account', '400'],
    ['the same email again', '201 + 201', '201 then 409'], ['broken JSON', '500', '400'], ['7 wrong passwords', '401 × 7', '401 × 5, 429 × 2'],
    ['response headers', 'X-Powered-By: Express', 'helmet, no X-Powered-By'], ['startup without a secret', 'starts (secret in code)', 'exit code 1'],
  ], { co: 22 }) + box('Same routes, same happy path', 'Nothing a user does correctly changed. Only the wrong requests now get a clean, correct answer.', 'xanh') },

  { t: 'What earns the marks', to: true, giua: true, body: bang(['in your project', 'show it in the defence'], [
    ['config.js + .env in .gitignore', 'git status: no .env; start without it: exit 1'],
    ['a validate(schema) middleware, .strict()', 'POST a blank name and an extra "role": 400'],
    ['express-rate-limit on login', '6 wrong passwords: 429 + Retry-After'],
    ['unique index on email, E11000 → 409', 'register twice: 409, not two accounts'],
    ['helmet() + morgan', 'curl -I; the log line for each request'],
  ], { co: 22 }) + box('Practise', 'Code Lab › REST APIs: add a validation middleware and a 409 for duplicates to your project API, then run the ten requests above against it.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: J("const User = mongoose.model('User', new Schema({ email: { type: String, unique: true } }));\napp.post('/register', async (req, res) => {\n  if (!req.body.email) return res.status(400).json({ error: 'email required' });\n  res.status(201).json(await User.create(req.body));\n});\napp.listen(3000);", { sm: false, hl: [1, 3, 4, 6] }) +
    box('Exercise', 'The collection already has two users with the same email. Name four problems in these six lines and fix each.', '') +
    `<div data-k="dapan">${box('Answer', '1. unique: true on old duplicates: the index build fails silently — clean the data, then await User.init(). 2. if (!email) lets any shape in: a Zod schema with .strict(). 3. User.create(req.body) copies role from the stranger and stores the password unhashed: create from validated fields, hash the password. 4. Port in code: PORT from config, checked at startup.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why should the app exit when JWT_SECRET is missing, instead of starting?</li>
<li>What does .strict() add to a Zod object?</li>
<li>After 5 wrong passwords, does the right password still get in?</li>
<li>What does trust proxy true do to an IP-based rate limit?</li>
<li>You add unique: true to a schema whose collection has duplicates. What happens?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. So the error shows at deploy, not at the first login. &nbsp;2. Unknown keys (like role) are rejected: 400. &nbsp;3. No — 429 for the rest of the window (900 s here). &nbsp;4. Anyone can set X-Forwarded-For and never be counted. &nbsp;5. The index build fails in the background; the app keeps accepting duplicates until you clean the data.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Config: one config.js, read from env, validated, exit 1 if wrong; .env only on your laptop</li>
<li>Validation at the boundary: one validate(schema) middleware, .strict(), cleaned data inward</li>
<li>Rate limit the login; set trust proxy to the real number of proxies</li>
<li>Unique index on email (409, not two accounts); clean duplicates first, await init()</li>
<li>Index what you query; helmet() for headers; morgan for one log line per request</li>
</ul>` + box('Going deeper', 'Node.js course 6.3 (schemas), 9.1 (headers), 12.4 (rate limits on Redis), 7.5 (indexes); API Design 2.2 (validation at the door), 5.3 (rate limits and quotas).', 'lam') },
]);
