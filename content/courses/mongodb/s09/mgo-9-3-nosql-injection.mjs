/**
 * 9.3 — NoSQL injection: chèn toán tử, $where và regex DoS (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s09-3-tiem'] (kịch bản demo/s09/s09-3-tiem.txt; API cố ý có lỗi _demo/node/s09-api-lo.mjs ở 127.0.0.1:47024,
 * bản vá s09-api-va.mjs ở 47025, s09-mg-sanitize.mjs; Express 5.3 + driver 7.9.1 + Mongoose 9.13; MongoDB 8.0.38).
 * Khối: 0 sai mật khẩu 401 · 1 {"$ne":null} ⇒ vào admin · 2 $regex + $gt ⇒ vào admin không cần email · 3–4 oracle mã đặt lại (^k 200 / ^z 404)
 * · 5–6 đổi mật khẩu admin bằng {"$ne":null} rồi đăng nhập · 7 Express 5 query parser simple ⇒ không thành object · 8 query parser extended ⇒ lộ
 * · 9–13 regex: thường 2 ms; sau 200 tài khoản "aaaa…!" ⇒ ~0,4–0,5 s/request · 14 mass assignment vaiTro admin · 15 lỗi lộ message
 * · 16–26 bản vá (400 / 200 / 400 / 200 / regex ~1–2 ms / 400 trường cấm / băm) · 27 Mongoose sanitizeFilter ⇒ $eq + CastError, trusted().
 * Số đo khác (mongosh, 200 tài liệu): (a+)+$ tăng ~×4 mỗi 2 ký tự tới n≈16 rồi chững ~2 ms/tài liệu (bộ máy regex có trần số bước) — lời chỉ nêu khoảng.
 * Kiểm trùng: $where trong populate (CVE-2024-53900) đã dạy ở 8.3 ⇒ chỉ nhắc + liên kết; regex Cloudflare 2019 ở 4.6 ⇒ không kể lại.
 * Nguồn GET kiểm 24/11/2026: NVD API CVE-2021-22911 (27/05/2021, Rocket.Chat 3.11–3.13, CVSS 9.8), Sonar blog "NoSQL Injections in Rocket.Chat 3.12.1"
 * (Paul Gerste, 18/05/2021: getPasswordPolicy không cần đăng nhập, params.token là object ⇒ $regex làm oracle lộ mã đặt lại; users.list chặn theo danh sách cấm ⇒ $where),
 * OWASP WSTG 4.7.5.6 Testing for NoSQL Injection, Mongoose docs sanitizeFilter / trusted().
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's09-3-tiem';

const LO = `// Trích _demo/node/s09-api-lo.mjs — đọc kỹ: nhìn qua thấy "bình thường"
app.use(express.json());                                  // body {"matKhau": {"$ne": null}} ⇒ req.body.matKhau là OBJECT

app.post('/dang-nhap', async (req, res) => {
  const u = await users.findOne({ email: req.body.email, matKhau: req.body.matKhau });   // ✘ object vào thẳng bộ lọc
  if (!u) return res.status(401).json({ loi: 'sai-thong-tin' });
  res.json({ chao: u.ten, vaiTro: u.vaiTro });
});
app.post('/dat-lai/kiem', async (req, res) => {           // trang "quên mật khẩu" gọi trước khi hiện ô mật khẩu mới
  const u = await users.findOne({ resetToken: req.body.token });                          // ✘
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
app.get('/tim', async (req, res) => {
  const ds = await users.find({ ten: { $regex: req.query.q, $options: 'i' } }).toArray();  // ✘ chuỗi người dùng = biểu thức
  res.json({ soKetQua: ds.length });
});
app.patch('/ho-so/:id', async (req, res) => {
  await users.updateOne({ _id: Number(req.params.id) }, { $set: req.body });              // ✘ mọi trường client gửi
  res.json(await users.findOne({ _id: Number(req.params.id) }));
});
app.use((err, req, res, next) => res.status(500).json({ loi: err.message }));           // ✘ lộ thông báo nội bộ`;

const VA = `// Trích _demo/node/s09-api-va.mjs — năm lớp vá
class LoiVao extends Error {}
const chuoi = (v, ten, max = 200) => {                    // (1) kiểm KIỂU ở cửa: object/mảng/số ⇒ 400
  if (typeof v !== 'string' || v.length === 0 || v.length > max) throw new LoiVao(ten);
  return v;
};
const thoatRegex = (s) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');

app.post('/dang-nhap', async (req, res) => {
  const email = chuoi(req.body?.email, 'email'), mk = chuoi(req.body?.matKhau, 'matKhau');
  const u = await users.findOne({ email });               // (2) chỉ tìm theo email, so mật khẩu băm bằng scrypt + timingSafeEqual
  if (!u || !dung(mk, u.matKhauBam)) return res.status(401).json({ loi: 'sai-thong-tin' });
  res.json({ chao: u.ten, vaiTro: u.vaiTro });
});
app.post('/dat-lai/kiem', async (req, res) => {           // (3) mã đặt lại: lưu sha256, có hạn 15 phút
  const tk = chuoi(req.body?.token, 'token', 64);
  const u = await users.findOne({ resetBam: sha(tk), resetHet: { $gt: new Date() } });
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
app.get('/tim', async (req, res) => {                     // (4) thoát ký tự, neo đầu chuỗi, giới hạn độ dài + thời gian
  const q = chuoi(req.query.q, 'q', 40);
  const ds = await users.find({ ten: { $regex: '^' + thoatRegex(q), $options: 'i' } }).limit(20).maxTimeMS(200).toArray();
  res.json({ soKetQua: ds.length });
});
const CHO_PHEP = ['ten', 'sdt'];                          // (5) danh sách CHO PHÉP, không phải danh sách cấm
app.patch('/ho-so/:id', async (req, res) => {
  const la = Object.keys(req.body ?? {}).filter((k) => !CHO_PHEP.includes(k));
  if (la.length) return res.status(400).json({ loi: 'truong-khong-duoc-sua', truong: la });
  /* … $set chỉ gồm các trường cho phép, mỗi trường qua chuoi() … */
});
app.use((err, req, res, next) => {                        // (6) lỗi có nghĩa ra ngoài, chi tiết vào log
  if (err instanceof LoiVao) return res.status(400).json({ loi: 'du-lieu-sai', truong: err.message });
  if (err?.code === 50) return res.status(503).json({ loi: 'qua-thoi-gian' });        // MaxTimeMSExpired
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });
});`;

const ZOD = `// Cùng ý tưởng bằng thư viện schema (zod) — hay gặp ở dự án NestJS/Express thật
import { z } from 'zod';
const DangNhap = z.object({ email: z.string().email().max(200), matKhau: z.string().min(1).max(200) }).strict();
app.post('/dang-nhap', async (req, res) => {
  const r = DangNhap.safeParse(req.body);                 // {"$ne": null} không phải string ⇒ success: false
  if (!r.success) return res.status(400).json({ loi: 'du-lieu-sai' });
  /* … dùng r.data, không bao giờ dùng req.body trực tiếp … */
});`;

export default {
  title: '9.3 — NoSQL injection: operator injection, $where and regex DoS|||9.3 — NoSQL injection: chèn toán tử, $where và regex DoS',
  slug: 'mgo-9-3-nosql-injection',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Tấn công thật một API Express cố ý có lỗi trên lab 127.0.0.1 rồi vá từng lỗ: đăng nhập vào tài khoản admin bằng {"$ne": null} và bằng $regex mà không cần biết email; dò mã đặt lại mật khẩu qua câu trả lời 200/404 rồi đổi luôn mật khẩu admin — đúng kiểu lỗi CVE-2021-22911 của Rocket.Chat (2021, CVSS 9.8); Express 5 mặc định không biến query string thành object nhưng một dòng app.set("query parser", "extended") mở lại lỗ; regex do người dùng gửi tốn ~0,4–0,5 s CPU mỗi request khi dữ liệu có chuỗi "aaaa…!"; mass assignment tự nâng quyền admin; lỗi trả nguyên message. Bản vá năm lớp: kiểm kiểu ở cửa, không so mật khẩu trong truy vấn (scrypt), băm mã đặt lại, thoát regex + maxTimeMS, danh sách trường cho phép — và Mongoose sanitizeFilter làm lưới an toàn thứ hai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>NoSQL injection: operator injection, $where and regex DoS</h2>
<p class="lead">SQL injection happens when user input becomes part of a SQL <em>string</em>. MongoDB queries are objects, not strings, so many developers assume they are immune. They are not: if user input can become an <em>object</em>, it can carry operators — <code>$ne</code>, <code>$gt</code>, <code>$regex</code>, <code>$where</code> — and change what the query means. This lesson attacks a small Express API that looks normal (all on 127.0.0.1, against our own lab), then fixes it layer by layer, and measures each fix.</p>
<p class="callout warn">Everything here runs only against the deliberately vulnerable API on your own machine. Trying these requests on systems you do not own or have written permission to test is illegal in Vietnam and almost everywhere else.</p>

<h3>An everyday picture: a form with a blank you can write anything into</h3>
<p>A bank form says "Account number: ____". A normal customer writes a number. A tricky one writes "<em>any account that is not empty</em>". A clerk who reads the blank literally and acts on it has just handed over someone else's money. JSON lets the client fill the blank with an <em>instruction</em> instead of a value; <code>findOne({ matKhau: req.body.matKhau })</code> is the clerk who obeys.</p>

<h3>1. The vulnerable API</h3>
${ma('js', LO)}


<h3>2. Why the login check fails open</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>The code expects <code>matKhau</code> to be a string. <code>express.json()</code> happily produces an object instead, and the driver passes that object to the server as a query operator. The filter no longer means "this email with this password" but "this email with <em>any</em> password" — so the check that should fail, passes. MongoDB reports no error: the query is perfectly valid. The root cause is a missing <strong>type check</strong>, not a database bug.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">HTTP body</span><span class="lz-t">a field that should be a string arrives as an object</span><span class="lz-d">valid JSON — nothing unusual for the parser</span></div>
  <div class="lz-step"><span class="lz-k">req.body.matKhau</span><span class="lz-t">typeof === 'object'</span><span class="lz-d">nobody checked the type</span></div>
  <div class="lz-step"><span class="lz-k">findOne(filter)</span><span class="lz-t">the object becomes an operator</span><span class="lz-d">"equals X" silently became "matches anything"</span></div>
  <div class="lz-step"><span class="lz-k">Fix at the door</span><span class="lz-t">typeof v === 'string' or a schema (zod)</span><span class="lz-d">400 before any query runs</span></div>
</div>

<h3>3. Password reset: a yes/no answer is already a leak</h3>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>The "is this reset code valid?" endpoint answers 200 or 404. If the code field can be an object, that yes/no answer reveals information about a secret the client should never learn, and the reset endpoint itself accepts "any code that exists" — the admin password is changed and the new one works. This is exactly the shape of a real vulnerability.</p>
<div class="callout"><p><strong>Real incident — Rocket.Chat, CVE-2021-22911 (2021).</strong> Sonar's researcher Paul Gerste reported that Rocket.Chat's <code>getPasswordPolicy</code> method could be called <em>without logging in</em>, and its <code>params.token</code> went into <code>Users.findOne()</code> without validation. An object with <code>$regex</code> turned the response into an oracle that leaked a user's password-reset token; a second injection in <code>users.list</code> got around a blocklist via <code>$where</code>. Chained, they led from no account to admin and then code execution. NVD: published 27/05/2021, affects Rocket.Chat 3.11–3.13, CVSS 9.8. The fix was the same as ours: validate types, prefer allowlists over blocklists.</p></div>
${nguon('🛡️', 'NVD — CVE-2021-22911', 'Rocket.Chat 3.11–3.13: unauthenticated NoSQL injection, potentially RCE (CVSS 9.8)', 'https://nvd.nist.gov/vuln/detail/CVE-2021-22911')}
${nguon('📰', 'Sonar — NoSQL Injections in Rocket.Chat 3.12.1 (18/05/2021)', 'getPasswordPolicy without login, $regex oracle on reset token, blocklist bypassed by $where', 'https://www.sonarsource.com/blog/nosql-injections-in-rocket-chat/')}

<h3>4. Query strings: Express 5 changed the default</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>In Express 4, <code>?email[$ne]=x</code> was parsed by the <code>qs</code> library into <code>{ email: { $ne: 'x' } }</code>. Express 5 defaults to the <em>simple</em> parser: the key stays the literal string <code>email[$ne]</code> and the query finds nothing. One line that teams add while migrating — <code>app.set('query parser', 'extended')</code> — brings the object back, and the same request returns the admin. Do not rely on the parser: check types on query parameters too.</p>

<h3>5. Regular expressions from users: CPU as the target</h3>
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>A pattern like <code>(a+)+$</code> forces the regex engine to try a huge number of ways to split a long run of <code>a</code> followed by a character that makes it fail. With no matching data it costs ~2 ms. After 200 accounts named <code>aaaaaaaaaaaaaaaaaaaa!</code> exist — anyone can register — each search costs ~0.4–0.5 s of server CPU. Measured in mongosh on 200 documents: the cost grows about 4× for every 2 extra characters, then flattens at ~2 ms <em>per document</em> (the engine has a step limit). So in MongoDB 8.0 the damage is bounded per document, but it multiplies by the number of documents scanned, and a user-supplied regex can never use an index efficiently. Eight requests in parallel finished in 0.63 s on this 12-core machine; a few hundred would keep every core busy. Lesson 4.6 showed the same class of bug taking down Cloudflare's WAF in 2019.</p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-4-6-truy-van-cham', title: 'Lesson 4.6 — finding slow queries (and the Cloudflare regex outage, 2019)', sub: 'profiler, slow query log, currentOp, killOp, maxTimeMS' })}

<h3>6. Mass assignment and leaked error messages</h3>
${lenh(K, 14)}
${lenh(K, 15)}
<p><code>$set: req.body</code> lets the client set <em>any</em> field — including <code>vaiTro</code>. The customer is now admin. The second request shows the error handler returning MongoDB's own message, which tells an attacker the field names and the query shape. Both are fixed by the same principle: the server decides which fields exist, never the client.</p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-8-3-mongoose-nang-cao', title: 'Lesson 8.3 — CVE-2024-53900: $where through Mongoose populate match', sub: 'server-side JavaScript reached through a library; why --noscripting matters (Lesson 9.1 self-check)' })}

<h3>7. The fix in five layers</h3>
${ma('js', VA)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
${lenh(K, 21)}
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
${lenh(K, 25)}
${lenh(K, 26)}
<p>Same requests, patched API: the object password is a 400 at the door; the real password still works; the object reset code is a 400 and the real code still works. With the same 200 "aaaa…!" accounts, the dangerous pattern is now treated as literal text (<code>^\\(a\\+\\)\\+\\$</code>) and takes ~1–2 ms; "aaaa" still finds them (limited to 20); a Vietnamese prefix "Bì" works. <code>vaiTro</code> in a PATCH is a 400 naming the forbidden field. In the database the password is a salted scrypt hash and the reset code a SHA-256 — a leaked backup no longer gives away either.</p>
${ma('js', ZOD)}

<h3>8. Mongoose: sanitizeFilter as a second net</h3>
${lenh(K, 27)}
<p>With <code>mongoose.set('sanitizeFilter', true)</code>, Mongoose wraps any object found in a filter value into <code>$eq</code>, so <code>{"$ne": null}</code> means "equals the object {$ne: null}"; then schema casting rejects it (CastError ⇒ map to 400 as in Lesson 8.3). When <em>your</em> code needs an operator, wrap it in <code>mongoose.trusted()</code>. This is a safety net, not the main defence: it doesn't cover the raw driver, <code>$set: req.body</code>, or regex strings.</p>
${nguon('📘', 'Mongoose API — sanitizeFilter / trusted()', 'wraps nested $ operators in $eq; trusted() marks an object as safe', 'https://mongoosejs.com/docs/api/mongoose.html')}
${nguon('📘', 'OWASP WSTG — Testing for NoSQL Injection', 'operator injection, $where, testing methodology', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection')}

<h3>🕵️ Attacker's view: how injection is found</h3>
<p>Testers do not guess blindly; they look for places where an API reacts differently to a value of a different <em>type</em> — an object instead of a string, an array instead of a number. A login that returns 400 for a type mismatch gives them nothing; one that returns 200 or a different error message is a lead. That is why the fixed API answers with the same short messages and validates types first. Practise this only against the lab and against projects you are authorized to test (bug bounty scopes, your own company's staging with written permission).</p>

<h3>💼 On the job: code review checklist for any MongoDB endpoint</h3>
<ul>
<li>Every value from <code>req.body</code>, <code>req.query</code>, <code>req.params</code>, headers is type-checked (or parsed by a schema) before it touches a filter.</li>
<li>No <code>$set: req.body</code>, no <code>{ ...req.body }</code> into insert — allowlist the fields.</li>
<li>No user string as <code>$regex</code> without escaping, a length limit, <code>maxTimeMS</code>, and preferably a prefix anchor or text/Atlas Search instead.</li>
<li>No <code>$where</code>, <code>$function</code>, <code>$accumulator</code> anywhere; server started with <code>--noscripting</code>.</li>
<li>Passwords hashed (scrypt/bcrypt/argon2) and compared outside the query; reset tokens random, hashed, expiring, single-use.</li>
<li>Error handler returns codes, never <code>err.message</code> or stack; details go to logs.</li>
</ul>
<p>On a Spring project the same rules apply: <code>@Valid</code> DTOs with typed fields instead of <code>Map&lt;String, Object&gt;</code>, and never build a <code>BasicQuery</code>/<code>Document</code> from a request JSON string.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"MongoDB doesn't use SQL. Can it be injected?"</strong> — Yes: if input can become an object, it can carry operators ($ne, $gt, $regex, $where). The fix is type validation at the boundary, not escaping strings.</li>
<li><strong>"Express 5 doesn't parse query strings into objects. Are we safe?"</strong> — Only for query strings with the default parser; JSON bodies still produce objects, and one config line restores qs. Validate everywhere.</li>
<li><strong>"What does sanitizeFilter do, and why isn't it enough?"</strong> — Wraps $-objects in $eq inside Mongoose filters. Doesn't protect the raw driver, update documents, or regex strings.</li>
<li><strong>"How should a password-reset token be stored and checked?"</strong> — Random (≥ 128 bits), store only its hash, with expiry, single use, compare as a string after type check; the check endpoint must not leak via different responses for malformed input.</li>
<li><strong>"A search box passes text to $regex. What can go wrong?"</strong> — CPU exhaustion with backtracking patterns, matching everything with <code>.*</code>, no index use. Escape, anchor, limit length, maxTimeMS, or use a text index.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>Start <code>s09-api-lo.mjs</code> and reproduce sections 2–6 with curl. For each, write one sentence: which line of code is at fault?</li>
<li>Patch only the login of <code>s09-api-lo.mjs</code> with a type check (no hashing yet). Which of the requests in section 2 still work? Why is that not the end of the job?</li>
<li>Write <code>timKiem(q)</code> for products: case-insensitive, Vietnamese-friendly, safe. Measure with the 200 "aaaa…!" names.</li>
<li>Rewrite <code>/ho-so/:id</code> in Spring Boot with a DTO. Which annotation stops <code>vaiTro</code>?</li>
</ol>
${loiGiai('Suggested answers', `<p>1. §2 <code>findOne({ email: req.body.email, matKhau: req.body.matKhau })</code>; §3 <code>findOne({ resetToken: req.body.token })</code>; §4 <code>app.set('query parser', 'extended')</code> + no type check; §5 <code>$regex: req.query.q</code>; §6 <code>$set: req.body</code> and <code>err.message</code>.</p>
<p>2. Requests 1–2 get 400. Login with the correct password still works — but the password is still compared inside the query and stored in plaintext: a leaked backup reveals every password, and the reset and search endpoints are still open. Injection is per endpoint.</p>
<p>3. Best: store a normalized field (<code>tenKhongDau</code>, lowercase, diacritics removed) with an index, search with <code>{ tenKhongDau: { $regex: '^' + thoat(chuanHoa(q)) } }</code> — a case-sensitive prefix regex on an indexed field uses the index (Lesson 4.6). Limit length 40, limit 20, maxTimeMS 200. Measured on the patched API: ~1–2 ms.</p>
<p>4. A DTO with only <code>ten</code> and <code>sdt</code> (<code>@Size(max = 60)</code>), bound with <code>@Valid @RequestBody</code>; unknown fields like <code>vaiTro</code> are then simply not bound. If you want a 400 instead of silently ignoring them, enable Jackson's <code>FAIL_ON_UNKNOWN_PROPERTIES</code> — check your project's mapper configuration, because Spring's default builder turns it off.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['NoSQL injection', 'User input becomes a query operator (object) and changes the meaning of the filter.'],
  ['Operator injection', 'Sending {"$ne": …}, {"$gt": …}, {"$regex": …} where a plain value was expected.'],
  ['Oracle', 'Any yes/no difference (status code, message, timing) that lets an attacker learn a secret bit by bit.'],
  ['ReDoS', 'Regular-expression denial of service: a pattern that makes the engine backtrack for a long time.'],
  ['Mass assignment', 'Copying client fields straight into a write ($set: req.body), letting clients set fields like role.'],
  ['sanitizeFilter / trusted()', 'Mongoose option that wraps $-objects in $eq; trusted() exempts objects your own code built.'],
  ['Allowlist', 'List of what is permitted; safer than a blocklist of what is forbidden (Rocket.Chat 2021).'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Queries are objects, so injection means "input became an object". Validate types at the boundary — that single rule blocks most of this lesson.</li>
<li>Express 5's simple query parser helps, JSON bodies don't; never rely on parser defaults.</li>
<li>Passwords: hashed and compared outside the query. Reset tokens: random, hashed, expiring.</li>
<li>User regex: escape, anchor, limit, maxTimeMS — or a dedicated search index.</li>
<li>Allowlist writable fields; return short error codes.</li>
<li>Mongoose sanitizeFilter and --noscripting are second nets, not the main defence.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>NoSQL injection: chèn toán tử, $where và regex DoS</h2>
<p class="lead">SQL injection xảy ra khi dữ liệu người dùng trở thành một phần của <em>chuỗi</em> SQL. Truy vấn MongoDB là object chứ không phải chuỗi, nên nhiều lập trình viên tin mình miễn nhiễm. Không phải vậy. Nếu dữ liệu người dùng có thể trở thành một <em>object</em>, nó mang theo được toán tử như <code>$ne</code>, <code>$gt</code>, <code>$regex</code>, <code>$where</code>, và làm đổi nghĩa câu truy vấn. Bài này thử tấn công một API Express nhỏ trông rất bình thường (tất cả ở 127.0.0.1, trên lab của chính mình), rồi vá từng lớp và đo lại sau mỗi lớp vá.</p>
<p class="callout warn">Mọi thứ ở đây chỉ chạy với API cố ý có lỗi trên máy của bạn. Gửi các request này tới hệ thống không phải của mình, hoặc chưa được cho phép kiểm thử bằng văn bản, là vi phạm pháp luật ở Việt Nam và hầu hết mọi nơi.</p>

<h3>Hình ảnh đời thường: tờ đơn có ô trống viết gì cũng được</h3>
<p>Tờ đơn ngân hàng ghi "Số tài khoản: ____". Khách bình thường điền một con số. Kẻ gian lại điền "<em>bất kỳ tài khoản nào không rỗng</em>". Nhân viên nào đọc ô trống theo đúng nghĩa đen rồi làm theo thì vừa giao tiền của người khác. JSON cho phép client điền vào ô trống một <em>mệnh lệnh</em> thay vì một giá trị, và <code>findOne({ matKhau: req.body.matKhau })</code> chính là người nhân viên làm theo.</p>

<h3>1. API có lỗ hổng</h3>
${ma('js', LO)}

<h3>2. Vì sao bước kiểm đăng nhập lại "mở cửa"</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>Mã nguồn chờ <code>matKhau</code> là một chuỗi. Nhưng <code>express.json()</code> vui vẻ tạo ra một object, và driver chuyển nguyên object đó lên máy chủ thành toán tử truy vấn. Bộ lọc không còn nghĩa "email này với mật khẩu này", mà thành "email này với mật khẩu <em>bất kỳ</em>". Thế là bước kiểm đáng lẽ phải trượt lại qua. MongoDB không báo lỗi gì, vì câu truy vấn hoàn toàn hợp lệ. Nguyên nhân gốc là thiếu <strong>kiểm kiểu dữ liệu</strong>, không phải lỗi của database.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thân HTTP</span><span class="lz-t">trường đáng lẽ là chuỗi lại tới dưới dạng object</span><span class="lz-d">JSON hợp lệ — bộ phân tích không thấy gì lạ</span></div>
  <div class="lz-step"><span class="lz-k">req.body.matKhau</span><span class="lz-t">typeof === 'object'</span><span class="lz-d">không ai kiểm kiểu</span></div>
  <div class="lz-step"><span class="lz-k">findOne(filter)</span><span class="lz-t">object biến thành toán tử</span><span class="lz-d">"bằng X" lặng lẽ thành "khớp mọi thứ"</span></div>
  <div class="lz-step"><span class="lz-k">Vá ở cửa</span><span class="lz-t">typeof v === 'string' hoặc dùng schema (zod)</span><span class="lz-d">trả 400 trước khi chạy bất kỳ truy vấn nào</span></div>
</div>

<h3>3. Đặt lại mật khẩu: câu trả lời có/không đã là rò rỉ</h3>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Endpoint "mã đặt lại này còn hợp lệ không?" trả 200 hoặc 404. Nếu trường mã có thể là object, câu trả lời có/không đó tiết lộ thông tin về một bí mật mà client không bao giờ được biết. Còn endpoint đặt lại thì nhận luôn "bất kỳ mã nào đang tồn tại": mật khẩu admin bị đổi, và mật khẩu mới dùng được ngay. Đây đúng là hình dạng của một lỗ hổng có thật.</p>
<div class="callout"><p><strong>Sự cố thật — Rocket.Chat, CVE-2021-22911 (2021).</strong> Nhà nghiên cứu Paul Gerste của Sonar báo rằng hàm <code>getPasswordPolicy</code> của Rocket.Chat gọi được <em>mà không cần đăng nhập</em>, và <code>params.token</code> của nó đi thẳng vào <code>Users.findOne()</code> không qua kiểm tra. Một object chứa <code>$regex</code> biến câu trả lời thành "máy dò" (oracle) làm lộ mã đặt lại mật khẩu của người dùng. Lỗ chèn thứ hai ở <code>users.list</code> vượt qua được danh sách cấm bằng <code>$where</code>. Nối hai lỗ lại, kẻ tấn công đi từ không có tài khoản tới quyền admin rồi chạy được mã. NVD: công bố 27/05/2021, ảnh hưởng Rocket.Chat 3.11–3.13, CVSS 9.8. Cách vá giống hệt bài này: kiểm kiểu, và dùng danh sách cho phép thay vì danh sách cấm.</p></div>
${nguon('🛡️', 'NVD — CVE-2021-22911', 'Rocket.Chat 3.11–3.13: NoSQL injection không cần đăng nhập, có thể dẫn tới chạy mã (CVSS 9.8)', 'https://nvd.nist.gov/vuln/detail/CVE-2021-22911')}
${nguon('📰', 'Sonar — NoSQL Injections in Rocket.Chat 3.12.1 (18/05/2021)', 'getPasswordPolicy không cần đăng nhập, oracle $regex lộ mã đặt lại, danh sách cấm bị vượt bằng $where', 'https://www.sonarsource.com/blog/nosql-injections-in-rocket-chat/')}

<h3>4. Query string: Express 5 đã đổi mặc định</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>Ở Express 4, <code>?email[$ne]=x</code> được thư viện <code>qs</code> phân tích thành <code>{ email: { $ne: 'x' } }</code>. Express 5 mặc định dùng bộ phân tích <em>simple</em>: khoá giữ nguyên là chuỗi <code>email[$ne]</code>, và truy vấn không tìm thấy gì. Nhưng chỉ một dòng mà nhiều nhóm thêm vào khi nâng cấp, <code>app.set('query parser', 'extended')</code>, là object quay lại và cùng request đó trả về admin. Đừng dựa vào bộ phân tích: tham số query cũng phải kiểm kiểu.</p>

<h3>5. Biểu thức chính quy do người dùng gửi: CPU thành mục tiêu</h3>
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>Một mẫu như <code>(a+)+$</code> buộc bộ máy regex thử rất nhiều cách chia một dãy <code>a</code> dài, khi ngay sau dãy đó là một ký tự làm phép khớp thất bại. Khi chưa có dữ liệu như thế, mỗi lần tìm tốn ~2 ms. Sau khi có 200 tài khoản tên <code>aaaaaaaaaaaaaaaaaaaa!</code> (ai cũng đăng ký được), mỗi lần tìm tốn ~0,4–0,5 giây CPU của máy chủ. Đo trong mongosh trên 200 tài liệu: chi phí tăng khoảng 4 lần mỗi khi dài thêm 2 ký tự, rồi chững lại ở ~2 ms <em>cho mỗi tài liệu</em> (bộ máy regex có trần số bước). Vậy ở MongoDB 8.0, thiệt hại có giới hạn trên từng tài liệu, nhưng nhân lên theo số tài liệu phải quét. Hơn nữa regex do người dùng gửi gần như không bao giờ dùng index hiệu quả. Tám request song song xong trong 0,63 giây trên máy 12 nhân này; vài trăm request sẽ giữ bận mọi nhân. Bài 4.6 đã kể một lỗi cùng loại từng đánh sập WAF của Cloudflare năm 2019.</p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-4-6-truy-van-cham', title: 'Bài 4.6 — tìm truy vấn chậm (và sự cố regex của Cloudflare, 2019)', sub: 'profiler, log truy vấn chậm, currentOp, killOp, maxTimeMS' })}

<h3>6. Mass assignment và thông báo lỗi bị lộ</h3>
${lenh(K, 14)}
${lenh(K, 15)}
<p><code>$set: req.body</code> cho client đặt <em>bất kỳ</em> trường nào, kể cả <code>vaiTro</code>. Thế là khách hàng thành admin. Request thứ hai cho thấy hàm xử lý lỗi trả nguyên thông báo của MongoDB, làm lộ tên trường và hình dạng câu truy vấn cho kẻ tấn công. Cả hai cùng được vá bằng một nguyên tắc: máy chủ quyết định có những trường nào, không bao giờ để client quyết định.</p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-8-3-mongoose-nang-cao', title: 'Bài 8.3 — CVE-2024-53900: $where lọt qua populate match của Mongoose', sub: 'JavaScript phía máy chủ bị gọi tới qua thư viện; vì sao cần --noscripting (script tự kiểm Bài 9.1)' })}

<h3>7. Vá trong năm lớp</h3>
${ma('js', VA)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
${lenh(K, 21)}
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
${lenh(K, 25)}
${lenh(K, 26)}
<p>Cùng các request đó, gửi tới API đã vá: mật khẩu dạng object bị trả 400 ngay ở cửa, mật khẩu đúng vẫn đăng nhập được; mã đặt lại dạng object bị 400, còn mã thật vẫn dùng được. Với đúng 200 tài khoản "aaaa…!", mẫu nguy hiểm giờ bị coi là chữ thường (<code>^\\(a\\+\\)\\+\\$</code>) và chỉ tốn ~1–2 ms; "aaaa" vẫn tìm ra các tài khoản đó (giới hạn 20 kết quả); tiền tố tiếng Việt "Bì" vẫn chạy. Gửi <code>vaiTro</code> trong PATCH bị 400, kèm tên trường bị cấm. Trong database, mật khẩu là giá trị băm scrypt có muối, mã đặt lại là SHA-256. Bản sao lưu có bị lộ cũng không làm lộ hai thứ đó.</p>
${ma('js', ZOD)}

<h3>8. Mongoose: sanitizeFilter là tấm lưới thứ hai</h3>
${lenh(K, 27)}
<p>Bật <code>mongoose.set('sanitizeFilter', true)</code> thì Mongoose bọc mọi object nằm trong giá trị của bộ lọc vào <code>$eq</code>. Khi đó <code>{"$ne": null}</code> nghĩa là "bằng đúng object {$ne: null}", rồi bước ép kiểu theo schema từ chối nó (CastError ⇒ ánh xạ thành 400 như Bài 8.3). Khi chính mã <em>của bạn</em> cần một toán tử, hãy bọc nó bằng <code>mongoose.trusted()</code>. Đây là lưới an toàn, không phải lớp phòng thủ chính: nó không che driver thô, không che <code>$set: req.body</code>, cũng không che chuỗi regex.</p>
${nguon('📘', 'Mongoose API — sanitizeFilter / trusted()', 'bọc toán tử $ lồng bên trong vào $eq; trusted() đánh dấu object an toàn', 'https://mongoosejs.com/docs/api/mongoose.html')}
${nguon('📘', 'OWASP WSTG — Testing for NoSQL Injection', 'chèn toán tử, $where, phương pháp kiểm thử', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection')}

<h3>🕵️ Góc hacker: người ta tìm ra lỗ chèn thế nào</h3>
<p>Người kiểm thử không đoán mò. Họ tìm chỗ API phản ứng khác đi khi nhận một giá trị khác <em>kiểu</em>: object thay vì chuỗi, mảng thay vì số. Một trang đăng nhập trả 400 khi sai kiểu thì không cho họ manh mối nào. Trang nào trả 200, hoặc trả một thông báo lỗi khác, là một đầu mối. Vì thế API đã vá luôn trả các câu ngắn giống nhau và kiểm kiểu trước tiên. Chỉ luyện những thứ này trên lab, và trên dự án bạn được phép kiểm thử (phạm vi bug bounty, staging của chính công ty mình khi có cho phép bằng văn bản).</p>

<h3>💼 Đi làm: danh sách soát khi review mọi endpoint dùng MongoDB</h3>
<ul>
<li>Mọi giá trị từ <code>req.body</code>, <code>req.query</code>, <code>req.params</code>, header đều được kiểm kiểu (hoặc qua schema) trước khi chạm vào bộ lọc.</li>
<li>Không có <code>$set: req.body</code>, không có <code>{ ...req.body }</code> đưa vào insert — liệt kê trường cho phép.</li>
<li>Không đưa chuỗi người dùng vào <code>$regex</code> mà thiếu thoát ký tự, giới hạn độ dài, <code>maxTimeMS</code>; tốt nhất là neo tiền tố hoặc dùng text index / Atlas Search.</li>
<li>Không có <code>$where</code>, <code>$function</code>, <code>$accumulator</code> ở đâu cả; máy chủ chạy với <code>--noscripting</code>.</li>
<li>Mật khẩu được băm (scrypt/bcrypt/argon2) và so sánh ngoài truy vấn; mã đặt lại ngẫu nhiên, lưu dạng băm, có hạn, dùng một lần.</li>
<li>Hàm xử lý lỗi trả mã lỗi, không bao giờ trả <code>err.message</code> hay stack; chi tiết ghi vào log.</li>
</ul>
<p>Ở dự án Spring, luật vẫn vậy: dùng DTO có <code>@Valid</code> với trường có kiểu rõ ràng thay vì <code>Map&lt;String, Object&gt;</code>, và không bao giờ dựng <code>BasicQuery</code>/<code>Document</code> từ chuỗi JSON của request.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"MongoDB không dùng SQL. Có bị injection không?"</strong> — Có. Nếu dữ liệu vào trở thành object thì nó mang được toán tử ($ne, $gt, $regex, $where). Cách vá là kiểm kiểu ở biên, không phải thoát chuỗi.</li>
<li><strong>"Express 5 không biến query string thành object. Vậy là an toàn?"</strong> — Chỉ đúng với query string khi dùng bộ phân tích mặc định. Thân JSON vẫn tạo object, và một dòng cấu hình là bật lại qs. Kiểm ở mọi nơi.</li>
<li><strong>"sanitizeFilter làm gì, và vì sao chưa đủ?"</strong> — Bọc object có $ vào $eq trong bộ lọc của Mongoose. Nó không bảo vệ driver thô, tài liệu update, hay chuỗi regex.</li>
<li><strong>"Mã đặt lại mật khẩu nên lưu và kiểm thế nào?"</strong> — Sinh ngẫu nhiên (≥ 128 bit), chỉ lưu giá trị băm, có hạn, dùng một lần, so như chuỗi sau khi kiểm kiểu. Endpoint kiểm không được làm lộ thông tin qua các câu trả lời khác nhau với đầu vào sai dạng.</li>
<li><strong>"Ô tìm kiếm đưa chữ vào $regex. Có thể hỏng ở đâu?"</strong> — Cạn CPU vì mẫu quay lui, <code>.*</code> khớp mọi thứ, không dùng được index. Thoát ký tự, neo đầu, giới hạn độ dài, maxTimeMS, hoặc dùng text index.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>s09-api-lo.mjs</code> và tái hiện mục 2–6 bằng curl. Với mỗi mục, viết một câu: dòng mã nào có lỗi?</li>
<li>Chỉ vá phần đăng nhập của <code>s09-api-lo.mjs</code> bằng kiểm kiểu (chưa băm mật khẩu). Những request nào ở mục 2 còn chạy được? Vì sao vá xong chỗ đó vẫn chưa hết việc?</li>
<li>Viết <code>timKiem(q)</code> cho sản phẩm: không phân biệt hoa thường, hợp tiếng Việt, an toàn. Đo với 200 tên "aaaa…!".</li>
<li>Viết lại <code>/ho-so/:id</code> bằng Spring Boot với DTO. Thứ gì chặn được <code>vaiTro</code>?</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Mục 2: <code>findOne({ email: req.body.email, matKhau: req.body.matKhau })</code>; mục 3: <code>findOne({ resetToken: req.body.token })</code>; mục 4: <code>app.set('query parser', 'extended')</code> cộng thiếu kiểm kiểu; mục 5: <code>$regex: req.query.q</code>; mục 6: <code>$set: req.body</code> và <code>err.message</code>.</p>
<p>2. Request 1–2 nhận 400. Đăng nhập bằng mật khẩu đúng vẫn chạy. Nhưng mật khẩu vẫn được so trong truy vấn và lưu dạng thô: lộ bản sao lưu là lộ mọi mật khẩu; endpoint đặt lại và tìm kiếm vẫn còn hở. Lỗ chèn phải vá theo từng endpoint.</p>
<p>3. Tốt nhất: lưu thêm một trường đã chuẩn hoá (<code>tenKhongDau</code>, chữ thường, bỏ dấu) có index, rồi tìm bằng <code>{ tenKhongDau: { $regex: '^' + thoat(chuanHoa(q)) } }</code>. Regex tiền tố phân biệt hoa thường trên trường có index sẽ dùng được index (Bài 4.6). Giới hạn độ dài 40, limit 20, maxTimeMS 200. Đo trên API đã vá: ~1–2 ms.</p>
<p>4. DTO chỉ có <code>ten</code> và <code>sdt</code> (<code>@Size(max = 60)</code>), nhận bằng <code>@Valid @RequestBody</code>; trường lạ như <code>vaiTro</code> khi đó đơn giản là không được gán. Muốn trả 400 thay vì lặng lẽ bỏ qua, bật <code>FAIL_ON_UNKNOWN_PROPERTIES</code> của Jackson. Kiểm cấu hình mapper của dự án, vì bộ dựng mặc định của Spring tắt tuỳ chọn này.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['NoSQL injection', 'Dữ liệu người dùng trở thành toán tử truy vấn (object) và làm đổi nghĩa bộ lọc.'],
  ['Chèn toán tử', 'Gửi {"$ne": …}, {"$gt": …}, {"$regex": …} vào chỗ đáng lẽ là một giá trị thường.'],
  ['Oracle (máy dò)', 'Bất kỳ khác biệt có/không nào (mã trạng thái, thông báo, thời gian) giúp kẻ tấn công đoán dần một bí mật.'],
  ['ReDoS', 'Từ chối dịch vụ bằng biểu thức chính quy: mẫu khiến bộ máy regex quay lui rất lâu.'],
  ['Mass assignment', 'Chép thẳng các trường của client vào lệnh ghi ($set: req.body), để client đặt được cả trường như vai trò.'],
  ['sanitizeFilter / trusted()', 'Tuỳ chọn Mongoose bọc object có $ vào $eq; trusted() miễn cho object do chính mã mình dựng.'],
  ['Danh sách cho phép (allowlist)', 'Liệt kê những gì được phép; an toàn hơn danh sách cấm (bài học Rocket.Chat 2021).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Truy vấn là object, nên injection nghĩa là "dữ liệu vào đã thành object". Kiểm kiểu ở biên: một luật đó chặn được phần lớn bài này.</li>
<li>Bộ phân tích simple của Express 5 có giúp, thân JSON thì không; đừng dựa vào mặc định của bộ phân tích.</li>
<li>Mật khẩu: băm, và so sánh ngoài truy vấn. Mã đặt lại: ngẫu nhiên, băm, có hạn.</li>
<li>Regex của người dùng: thoát ký tự, neo đầu, giới hạn, maxTimeMS — hoặc dùng index tìm kiếm riêng.</li>
<li>Liệt kê trường được ghi; trả mã lỗi ngắn.</li>
<li>sanitizeFilter của Mongoose và --noscripting là lưới thứ hai, không phải lớp phòng thủ chính.</li>
</ul>
</div>
`,
};
