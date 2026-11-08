/** SDN302 · 5.1 — Mật khẩu, bcrypt, session & Passport (CLO6): băm khi đăng ký, so khi đăng nhập, cùng một thông báo lỗi, select('+password'), hook pre('save') có isModified, LocalStrategy, session + cookie. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const USER = J`const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },   // the HASH; hidden by default
}));`;

/* ── 1 ── choice */
const E1 = cs({
  ten: 'Hashing passwords: what bcrypt does and why', kho: 'EASY', phut: 8,
  en: 'The two non-negotiables of the lesson — never store a plain-text password, never trust the client — and the reasons behind them.',
  vi: 'Hai điều không thương lượng của bài — không bao giờ lưu mật khẩu thô, không bao giờ tin client — và lý do phía sau.',
  cau: [
    q('p1', ['The users collection leaks. Why are bcrypt hashes much better than plain passwords?', 'Collection users bị lộ. Vì sao mã băm bcrypt tốt hơn nhiều so với mật khẩu thô?'],
      ['A hash is one-way and slow to compute; the attacker must guess each password, and each guess is expensive', 'bcrypt encrypts with the server key, so the attacker needs the key too', 'The hash can be decrypted only by MongoDB Atlas', 'Hashes are shorter, so less data leaks'],
      ['There is nothing to decrypt: login re-hashes the typed password and compares. Cost factor 10 makes each guess take tens of milliseconds.', 'Không có gì để giải mã: đăng nhập băm lại mật khẩu vừa gõ rồi so. Hệ số 10 làm mỗi lần đoán mất hàng chục mili-giây.']),
    q('p2', ['<code>bcrypt.hash(\'secret123\', 10)</code> twice gives two different strings. Why?', '<code>bcrypt.hash(\'secret123\', 10)</code> hai lần cho hai chuỗi khác nhau. Vì sao?'],
      ['A new random salt is generated each time and stored inside the hash', 'bcrypt adds the current time to the password', 'The second call uses 11 rounds', 'It is a bug: hashes must be identical'],
      ['The salt (22 characters after <code>$2b$10$</code>) makes identical passwords produce different hashes, so one precomputed table cannot crack everyone.', 'Salt (22 ký tự sau <code>$2b$10$</code>) làm các mật khẩu giống nhau ra mã băm khác nhau, nên một bảng tính sẵn không phá được tất cả.']),
    q('p3', ['How does login check a password against a stored bcrypt hash?', 'Đăng nhập kiểm mật khẩu với mã băm bcrypt đã lưu bằng cách nào?'],
      ['<code>await bcrypt.compare(typed, user.password)</code> — it re-hashes with the salt inside the stored hash', '<code>bcrypt.decrypt(user.password) === typed</code>', '<code>await bcrypt.hash(typed, 10) === user.password</code>', '<code>user.password === typed</code> because Mongoose hashes on read'],
      ['Hashing again with a NEW salt never matches; compare reuses the stored salt.', 'Băm lại với salt MỚI thì không bao giờ khớp; compare dùng lại salt đã lưu.']),
    q('p4', ['Why answer "Invalid credentials" for BOTH "no such email" and "wrong password"?', 'Vì sao trả "Invalid credentials" cho CẢ "không có email" lẫn "sai mật khẩu"?'],
      ['Different messages let an attacker list which emails have accounts', 'Express cannot send two different 401 messages', 'bcrypt cannot tell the difference', 'It makes the response smaller'],
      ['The ★ note of the lesson: a wording choice that closes a user-enumeration leak.', 'Ghi chú ★ của bài: một lựa chọn câu chữ đóng lỗ rò liệt kê người dùng.']),
    qn('p5', ['Which of these leak a password hash to the client? (choose all)', 'Cái nào làm lộ mã băm mật khẩu ra client? (chọn hết)'],
      ['<code>res.json(await User.findOne({ email }).select(\'+password\'))</code> after login', '<code>res.status(201).json(await User.create({ email, password: hash }))</code> — create returns the full document', '<code>console.log(user)</code> in a log shipped to a third-party service', '<code>res.json(await User.findById(id))</code> with <code>select: false</code> on password', '<code>res.json({ id: user._id, email: user.email })</code>'],
      [0, 1, 2],
      ['<code>select: false</code> hides the field on QUERIES, but the document returned by <code>create</code> still has it — and logs are a leak too.', '<code>select: false</code> giấu field ở TRUY VẤN, nhưng document do <code>create</code> trả về vẫn còn nó — và log cũng là một chỗ rò.']),
  ],
  goiY: [['One-way + salt + slow.', 'Một chiều + salt + chậm.'], ['Where does the salt live?', 'Salt nằm ở đâu?']],
  loi: [['Thinking hashes can be decrypted.', 'Tưởng mã băm giải mã được.'], ['Comparing two fresh hashes.', 'So hai mã băm mới tạo.']],
  tns: [tn('hash', 'băm'), tn('salt', 'muối', 'chuỗi ngẫu nhiên trộn vào trước khi băm'), tn('user enumeration', 'liệt kê người dùng')],
  kn: ['bcrypt'],
});

/* ── 2 ── register */
const E2 = bai({
  ten: 'Register: hash with bcrypt, never return the password, 409 on a taken email', kho: 'MEDIUM', phut: 18, lib: ['mongoose', 'express', 'auth'],
  en: J`<p>Write the handler <code>register(req, res, next)</code> for <code>POST /api/auth/register</code> with body <code>{ name, email, password }</code>:</p>
<ul><li>missing <code>name</code>/<code>email</code>/<code>password</code>, or a password shorter than 8 characters ⇒ <code>400</code> <code>{ error: "name, email and a password of 8+ characters are required" }</code>;</li>
<li>hash: <code>await bcrypt.hash(password, 10)</code> and store only the hash;</li>
<li>a taken email (Mongo duplicate key, <code>err.code === 11000</code>) ⇒ <code>409</code> <code>{ error: "Email already registered" }</code>;</li>
<li>success ⇒ <code>201</code> <code>{ id, name, email }</code> — the password (even hashed) never leaves the server.</li></ul>
<p>Other errors ⇒ <code>next(err)</code>. The <code>User</code> model is given (email is lower-cased by the schema).</p>`,
  vi: J`<p>Viết handler <code>register(req, res, next)</code> cho <code>POST /api/auth/register</code> với body <code>{ name, email, password }</code>:</p>
<ul><li>thiếu <code>name</code>/<code>email</code>/<code>password</code>, hoặc mật khẩu ngắn hơn 8 ký tự ⇒ <code>400</code> <code>{ error: "name, email and a password of 8+ characters are required" }</code>;</li>
<li>băm: <code>await bcrypt.hash(password, 10)</code> và chỉ lưu mã băm;</li>
<li>email đã có (trùng khoá Mongo, <code>err.code === 11000</code>) ⇒ <code>409</code> <code>{ error: "Email already registered" }</code>;</li>
<li>thành công ⇒ <code>201</code> <code>{ id, name, email }</code> — mật khẩu (kể cả đã băm) không bao giờ rời server.</li></ul>
<p>Lỗi khác ⇒ <code>next(err)</code>. Model <code>User</code> cho sẵn (schema tự đổi email thành chữ thường).</p>`,
  yc: [
    ['<code>const bcrypt = require(\'bcrypt\');</code> — <code>hash</code> is asynchronous: <code>await</code> it.', '<code>const bcrypt = require(\'bcrypt\');</code> — <code>hash</code> là bất đồng bộ: <code>await</code> nó.'],
    ['Build the response yourself: <code>{ id: user.id, name: user.name, email: user.email }</code>.', 'Tự dựng câu trả lời: <code>{ id: user.id, name: user.name, email: user.email }</code>.'],
    ['Export: <code>module.exports = { register };</code>', 'Export: <code>module.exports = { register };</code>'],
  ],
  viDu: [['POST {"name":"An","email":"AN@x.com","password":"secret123"}', '201 {"id":"…","name":"An","email":"an@x.com"}', 'Stored password: "$2b$10$…" (60 chars).', 'Mật khẩu lưu: "$2b$10$…" (60 ký tự).'], ['the same email again', '409 {"error":"Email already registered"}', 'The unique index refused it.', 'Index duy nhất đã từ chối.']],
  goiY: [
    ['<code>const hash = await bcrypt.hash(password, 10); const user = await User.create({ name, email, password: hash });</code>', '<code>const hash = await bcrypt.hash(password, 10); const user = await User.create({ name, email, password: hash });</code>'],
    ['<code>catch (err) { if (err.code === 11000) return res.status(409).json({ … }); next(err); }</code>', '<code>catch (err) { if (err.code === 11000) return res.status(409).json({ … }); next(err); }</code>'],
  ],
  loi: [
    ['<code>res.status(201).json(user)</code>: the document returned by <code>create</code> still contains the hash — <code>select: false</code> only affects queries.', '<code>res.status(201).json(user)</code>: document do <code>create</code> trả về vẫn chứa mã băm — <code>select: false</code> chỉ tác dụng với truy vấn.'],
    ['<code>bcrypt.hash(password, 10)</code> without <code>await</code>: a Promise is stored as the password and the save fails (or stores "[object Promise]").', '<code>bcrypt.hash(password, 10)</code> không <code>await</code>: một Promise bị lưu làm mật khẩu và việc lưu hỏng (hoặc lưu "[object Promise]").'],
    ['Checking "does this email exist?" with findOne and then creating — two requests at the same time both pass the check; the unique index is the real guard, so handle E11000.', 'Kiểm "email này có chưa?" bằng findOne rồi mới tạo — hai request cùng lúc đều qua phép kiểm; index duy nhất mới là người gác thật, nên hãy xử lý E11000.'],
  ],
  gt: [
    'The server receives the plain password once, hashes it with a fresh salt and keeps only the hash. Uniqueness is enforced by the database index, so the handler translates E11000 into 409 instead of racing with its own pre-check. The response is built field by field — the safest way to make sure the hash, which still sits on the document <code>create</code> returned, never leaves the server.',
    'Server nhận mật khẩu thô đúng một lần, băm với salt mới và chỉ giữ mã băm. Tính duy nhất do index của CSDL thực thi, nên handler dịch E11000 thành 409 thay vì chạy đua với phép kiểm trước của chính nó. Câu trả lời được dựng từng field — cách chắc chắn nhất để mã băm, vẫn còn nằm trên document mà <code>create</code> trả về, không bao giờ rời server.',
  ],
  kn: ['bcrypt.hash', 'E11000', 'safe responses'],
  tns: [tn('cost factor', 'hệ số chi phí', 'số vòng: 10 ⇒ 2^10'), tn('race condition', 'điều kiện tranh chấp')],
  dau: J`const bcrypt = require('bcrypt');
${USER}

async function register(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register };
`,
  giai: J`const bcrypt = require('bcrypt');
${USER}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'name, email and a password of 8+ characters are required' });
    }
    const hash = await bcrypt.hash(password, 10);              // one-way, salted, 2^10 rounds
    const user = await User.create({ name, email, password: hash });
    // build the answer field by field: the created document still holds the hash
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already registered' });   // the unique index said no
    next(err);
  }
}

module.exports = { register };
`,
  chuanBi: `const { register } = module.exports; const B = require('bcrypt'); const reg = async (body) => __pick(await __goi(register, { body }), 'status body next');
const stored = async (email) => (await User.findOne({ email }).select('+password')).password;`,
  cases: [
    { goi: `await (async () => { const r = await reg({ name: 'An', email: 'AN@x.com', password: 'secret123' }); return { status: r.status, keys: Object.keys(r.body).sort(), email: r.body.email }; })()`, moTa: ['201 with id, name, email only', '201 chỉ có id, name, email'] },
    { goi: `(await reg({ name: 'An', email: 'an@x.com', password: 'secret123' }), await stored('an@x.com').then((h) => [h.startsWith('$2b$10$'), h.length, h === 'secret123', B.compareSync('secret123', h)]))`, moTa: ['The stored password is a bcrypt hash that compares true', 'Mật khẩu đã lưu là mã băm bcrypt, compare ra true'] },
    { goi: `(await reg({ name: 'An', email: 'an@x.com', password: 'secret123' }), await reg({ name: 'Bao', email: 'An@X.com', password: 'another123' }))`, moTa: ['A taken email → 409', 'Email đã có → 409'] },
    { goi: `[await reg({ name: 'An', email: 'an@x.com', password: 'short' }), await reg({ email: 'an@x.com', password: 'secret123' })]`, moTa: ['Short password or missing name → 400', 'Mật khẩu ngắn hoặc thiếu name → 400'] },
    { goi: `await (async () => { await reg({ name: 'A', email: 'a@x.com', password: 'samepass1' }); await reg({ name: 'B', email: 'b@x.com', password: 'samepass1' }); return (await stored('a@x.com')) !== (await stored('b@x.com')); })()`, an: true, moTa: ['Same password, different hashes (salt)', 'Cùng mật khẩu, khác mã băm (salt)'] },
    { goi: `JSON.stringify(await reg({ name: 'C', email: 'c@x.com', password: 'whatever99' })).includes('$2b$')`, an: true },
    { goi: `[await reg({ name: 'D', email: 'd@x.com', password: 12345678 }), await reg({ name: 'E', email: 'e@x.com', password: '12345678' }).then((r) => r.status)]`, an: true },
  ],
});

/* ── 3 ── login */
const E3 = bai({
  ten: 'Login: select(\'+password\'), bcrypt.compare and one generic error', kho: 'MEDIUM', phut: 15, lib: ['mongoose', 'express', 'auth'],
  en: J`<p>Write <code>login(req, res, next)</code> for <code>POST /api/auth/login</code> with body <code>{ email, password }</code>:</p>
<ul><li>missing email or password ⇒ <code>400</code> <code>{ error: "email and password are required" }</code>;</li>
<li>find the user by email — the hash is hidden by <code>select: false</code>, so ask for it with <code>.select('+password')</code>;</li>
<li>no such user OR <code>bcrypt.compare</code> says false ⇒ the SAME answer: <code>401</code> <code>{ error: "Invalid credentials" }</code>;</li>
<li>success ⇒ <code>200</code> <code>{ id, name, email }</code>.</li></ul>`,
  vi: J`<p>Viết <code>login(req, res, next)</code> cho <code>POST /api/auth/login</code> với body <code>{ email, password }</code>:</p>
<ul><li>thiếu email hoặc mật khẩu ⇒ <code>400</code> <code>{ error: "email and password are required" }</code>;</li>
<li>tìm người dùng theo email — mã băm bị <code>select: false</code> giấu, nên xin nó bằng <code>.select('+password')</code>;</li>
<li>không có người dùng HOẶC <code>bcrypt.compare</code> nói false ⇒ CÙNG một câu trả lời: <code>401</code> <code>{ error: "Invalid credentials" }</code>;</li>
<li>thành công ⇒ <code>200</code> <code>{ id, name, email }</code>.</li></ul>`,
  yc: [
    ['Look up the email in lower case (the schema stores it lower-case): <code>String(email).toLowerCase().trim()</code>.', 'Tìm email ở dạng chữ thường (schema lưu chữ thường): <code>String(email).toLowerCase().trim()</code>.'],
    ['<code>const ok = user && await bcrypt.compare(password, user.password);</code>', '<code>const ok = user && await bcrypt.compare(password, user.password);</code>'],
    ['Export <code>module.exports = { login };</code>', 'Export <code>module.exports = { login };</code>'],
  ],
  viDu: [['{"email":"an@x.com","password":"secret123"}', '200 {"id":"…","name":"An","email":"an@x.com"}', 'Right password.', 'Đúng mật khẩu.'], ['{"email":"nobody@x.com","password":"secret123"}', '401 {"error":"Invalid credentials"}', 'Same as a wrong password.', 'Y như sai mật khẩu.']],
  goiY: [
    ['Without <code>.select(\'+password\')</code>, <code>user.password</code> is <code>undefined</code> and <code>bcrypt.compare</code> throws "Illegal arguments".', 'Không có <code>.select(\'+password\')</code>, <code>user.password</code> là <code>undefined</code> và <code>bcrypt.compare</code> ném "Illegal arguments".'],
    ['One <code>if (!ok) return res.status(401).json({ error: \'Invalid credentials\' });</code> covers both failures.', 'Một <code>if (!ok) return res.status(401).json({ error: \'Invalid credentials\' });</code> lo cả hai thất bại.'],
  ],
  loi: [
    ['Two messages ("email not found" / "wrong password") — an attacker can check which emails are registered.', 'Hai thông báo ("không thấy email" / "sai mật khẩu") — kẻ tấn công kiểm được email nào đã đăng ký.'],
    ['<code>user.password === password</code> — compares the hash with the plain text: always false.', '<code>user.password === password</code> — so mã băm với chữ thô: luôn sai.'],
    ['Returning the user found with <code>select(\'+password\')</code> as is: the hash goes out in the login response.', 'Trả nguyên người dùng tìm bằng <code>select(\'+password\')</code>: mã băm đi ra trong câu trả lời đăng nhập.'],
  ],
  gt: [
    'Login is the only place that needs the hash, so it opts in with <code>+password</code>; everywhere else the default hides it. <code>bcrypt.compare</code> extracts the salt from the stored hash, re-hashes the typed password and compares. Collapsing "unknown email" and "wrong password" into one 401 is the ★ point of the lesson: the API should not confirm which accounts exist.',
    'Đăng nhập là chỗ duy nhất cần mã băm, nên nó xin bằng <code>+password</code>; ở mọi nơi khác mặc định giấu đi. <code>bcrypt.compare</code> lấy salt từ mã băm đã lưu, băm lại mật khẩu vừa gõ và so. Gộp "email lạ" và "sai mật khẩu" thành một 401 là ý ★ của bài: API không nên xác nhận tài khoản nào tồn tại.',
  ],
  kn: ['bcrypt.compare', 'select +password'],
  tns: [tn('credentials', 'thông tin đăng nhập'), tn('opt-in select', 'xin field bị giấu')],
  dau: J`const bcrypt = require('bcrypt');
${USER}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email not found' });
    if (user.password !== password) return res.status(401).json({ error: 'Wrong password' });
    res.json(user);
  } catch (err) { next(err); }
}

module.exports = { login };
`,
  giai: J`const bcrypt = require('bcrypt');
${USER}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    // the hash is hidden by select: false — login is the ONE place that asks for it
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    const ok = user !== null && await bcrypt.compare(String(password), user.password);   // re-hash with the stored salt
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });               // same answer for both cases

    res.json({ id: user.id, name: user.name, email: user.email });                         // never the hash
  } catch (err) { next(err); }
}

module.exports = { login };
`,
  chuanBi: `const { login } = module.exports; const B = require('bcrypt'); await User.create({ name: 'An', email: 'an@x.com', password: await B.hash('secret123', 10) });
const go = async (body) => __pick(await __goi(login, { body }), 'status body next');`,
  cases: [
    { goi: `(await go({ email: 'an@x.com', password: 'secret123' })).status`, moTa: ['Right password → 200', 'Đúng mật khẩu → 200'] },
    { goi: `await (async () => { const r = await go({ email: 'an@x.com', password: 'secret123' }); return [Object.keys(r.body).sort(), r.body.email]; })()`, moTa: ['The answer has no password field', 'Câu trả lời không có field password'] },
    { goi: `[await go({ email: 'an@x.com', password: 'wrongpass' }), await go({ email: 'nobody@x.com', password: 'secret123' })]`, moTa: ['Wrong password and unknown email → the SAME 401', 'Sai mật khẩu và email lạ → CÙNG một 401'] },
    { goi: `[await go({ email: 'an@x.com' }), await go({})]`, moTa: ['Missing fields → 400', 'Thiếu field → 400'] },
    { goi: `(await go({ email: '  AN@X.COM ', password: 'secret123' })).status`, an: true },
    { goi: `JSON.stringify(await go({ email: 'an@x.com', password: 'secret123' })).includes('$2b$')`, an: true },
    { goi: `(await go({ email: 'an@x.com', password: 'SECRET123' })).status`, an: true },
  ],
});

/* ── 4 ── passport */
const E4 = bai({
  ten: 'Passport-local: write the verify callback (done(null, false) vs done(null, user))', kho: 'MEDIUM', phut: 15, lib: ['mongoose', 'express', 'auth', 'web'],
  en: J`<p>Passport standardises the login strategy: you write ONE function, the <b>verify callback</b>, and Passport calls it with the credentials and a <code>done</code> callback. Write <code>verifyLogin(email, password, done)</code>:</p>
<ul><li>unknown email or wrong password ⇒ <code>done(null, false, { message: 'Invalid credentials' })</code> (a failed login is not an error);</li>
<li>a database error ⇒ <code>done(err)</code>;</li>
<li>success ⇒ <code>done(null, user)</code> where <code>user</code> is <code>{ id, name, email }</code> (no hash).</li></ul>
<p>Register it with <code>passport.use(new LocalStrategy({ usernameField: 'email' }, verifyLogin))</code>. The route <code>POST /login</code> with <code>passport.authenticate('local', { session: false })</code> is given.</p>`,
  vi: J`<p>Passport chuẩn hoá chiến lược đăng nhập: bạn viết MỘT hàm, <b>verify callback</b>, và Passport gọi nó với thông tin đăng nhập và callback <code>done</code>. Viết <code>verifyLogin(email, password, done)</code>:</p>
<ul><li>email lạ hoặc sai mật khẩu ⇒ <code>done(null, false, { message: 'Invalid credentials' })</code> (đăng nhập hỏng không phải là lỗi);</li>
<li>lỗi CSDL ⇒ <code>done(err)</code>;</li>
<li>thành công ⇒ <code>done(null, user)</code> với <code>user</code> là <code>{ id, name, email }</code> (không mã băm).</li></ul>
<p>Đăng ký bằng <code>passport.use(new LocalStrategy({ usernameField: 'email' }, verifyLogin))</code>. Route <code>POST /login</code> với <code>passport.authenticate('local', { session: false })</code> cho sẵn.</p>`,
  yc: [
    ['Call <code>done</code> exactly once on every path.', 'Gọi <code>done</code> đúng một lần trên mọi nhánh.'],
    ['<code>usernameField: \'email\'</code> — by default Passport reads <code>req.body.username</code>.', '<code>usernameField: \'email\'</code> — mặc định Passport đọc <code>req.body.username</code>.'],
    ['Export <code>module.exports = { app, verifyLogin };</code>', 'Export <code>module.exports = { app, verifyLogin };</code>'],
  ],
  viDu: [['POST /login {"email":"an@x.com","password":"secret123"}', '200 {"user":{"id":"…","name":"An","email":"an@x.com"}}', 'done(null, user) ⇒ req.user.', 'done(null, user) ⇒ req.user.'], ['wrong password', '401 Unauthorized', 'done(null, false) ⇒ Passport answers 401.', 'done(null, false) ⇒ Passport trả 401.']],
  goiY: [
    ['Wrap the body in try/catch and call <code>done(err)</code> in the catch.', 'Bọc thân trong try/catch và gọi <code>done(err)</code> ở catch.'],
    ['This is the lesson\'s code, plus the safe user object and the message.', 'Đây là mã của bài, cộng đối tượng người dùng an toàn và thông báo.'],
  ],
  loi: [
    ['<code>done(new Error(\'Invalid credentials\'))</code> for a wrong password: Passport treats it as a SERVER error (500), not a failed login (401).', '<code>done(new Error(\'Invalid credentials\'))</code> cho sai mật khẩu: Passport coi là lỗi SERVER (500), không phải đăng nhập hỏng (401).'],
    ['Forgetting <code>usernameField</code>: every request answers 400 "Missing credentials" because <code>req.body.username</code> is undefined.', 'Quên <code>usernameField</code>: mọi request trả 400 "Missing credentials" vì <code>req.body.username</code> là undefined.'],
    ['<code>return done(null, user)</code> with the full document fetched with <code>+password</code> — the hash ends up in <code>req.user</code>.', '<code>return done(null, user)</code> với nguyên document lấy bằng <code>+password</code> — mã băm nằm trong <code>req.user</code>.'],
  ],
  gt: [
    'Passport separates "how do I get credentials" (the strategy: local, Google, JWT…) from "are they valid" (your verify callback). The <code>done</code> protocol has three outcomes: <code>done(err)</code> = something broke (500), <code>done(null, false, info)</code> = rejected (401), <code>done(null, user)</code> = accepted (<code>req.user</code>). Getting the middle one right is what makes a wrong password a normal 401.',
    'Passport tách "lấy thông tin đăng nhập thế nào" (chiến lược: local, Google, JWT…) khỏi "chúng có hợp lệ không" (verify callback của bạn). Giao ước <code>done</code> có ba kết cục: <code>done(err)</code> = có gì hỏng (500), <code>done(null, false, info)</code> = bị từ chối (401), <code>done(null, user)</code> = chấp nhận (<code>req.user</code>). Làm đúng cái ở giữa là thứ biến sai mật khẩu thành một 401 bình thường.',
  ],
  kn: ['Passport', 'LocalStrategy'],
  tns: [tn('strategy', 'chiến lược xác thực'), tn('verify callback', 'hàm kiểm tra thông tin đăng nhập')],
  dau: J`const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
${USER}

async function verifyLogin(email, password, done) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) return done(new Error('Invalid credentials'));
  return done(null, user);
}

passport.use(new LocalStrategy(verifyLogin));

const app = express();
app.use(express.json());
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => res.json({ user: req.user }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));
module.exports = { app, verifyLogin };
`,
  giai: J`const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
${USER}

// the verify callback: three outcomes, each reported through done
async function verifyLogin(email, password, done) {
  try {
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'Invalid credentials' });   // rejected: NOT an error ⇒ 401
    }
    return done(null, { id: user.id, name: user.name, email: user.email });   // accepted ⇒ req.user (no hash)
  } catch (err) {
    return done(err);                                                // broken ⇒ 500
  }
}

passport.use(new LocalStrategy({ usernameField: 'email' }, verifyLogin));   // read req.body.email

const app = express();
app.use(express.json());
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => res.json({ user: req.user }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));
module.exports = { app, verifyLogin };
`,
  chuanBi: `const { app, verifyLogin } = module.exports; const B = require('bcrypt'); await User.create({ name: 'An', email: 'an@x.com', password: await B.hash('secret123', 10) });
const done = (email, pw) => new Promise((ok) => { verifyLogin(email, pw, (err, user, info) => ok({ err: err ? err.message : null, user: user === undefined ? 'missing' : __json(user), info: info || null })); });
const post = async (body) => __res(await app.inject({ method: 'POST', url: '/login', body }));`,
  cases: [
    { goi: `await (async () => { const r = await done('an@x.com', 'secret123'); return [r.err, Object.keys(r.user).sort()]; })()`, moTa: ['Right password → done(null, { id, name, email })', 'Đúng mật khẩu → done(null, { id, name, email })'] },
    { goi: `[await done('an@x.com', 'nope'), await done('ghost@x.com', 'secret123')]`, moTa: ['Wrong password / unknown email → done(null, false, { message })', 'Sai mật khẩu / email lạ → done(null, false, { message })'] },
    { goi: `[(await post({ email: 'an@x.com', password: 'secret123' })).status, await post({ email: 'an@x.com', password: 'bad' })]`, moTa: ['Through Passport: 200, then 401 Unauthorized', 'Qua Passport: 200, rồi 401 Unauthorized'] },
    { goi: `(User.findOne = () => ({ select: () => Promise.reject(new Error('db down')) }), await done('an@x.com', 'secret123'))`, an: true, moTa: ['A database error → done(err)', 'Lỗi CSDL → done(err)'] },
    { goi: `JSON.stringify((await post({ email: 'an@x.com', password: 'secret123' })).body).includes('$2b$')`, an: true },
    { goi: `await post({ username: 'an@x.com', password: 'secret123' })`, an: true },
  ],
});

/* ── 5 ── pre save hook */
const E5 = bai({
  ten: 'Hash in a pre(\'save\') hook — but only when the password changed', kho: 'MEDIUM', phut: 18, lib: ['mongoose', 'auth'],
  en: J`<p>Many projects hash inside the model instead of the controller, so no route can forget it. Add to <code>userSchema</code>:</p>
<ul><li>a <code>pre('save')</code> hook that replaces <code>this.password</code> with its bcrypt hash (10 rounds) <b>only if</b> <code>this.isModified('password')</code>;</li>
<li>an instance method <code>comparePassword(plain)</code> → <code>Promise&lt;boolean&gt;</code>.</li></ul>
<p>Without the <code>isModified</code> guard, saving a user after changing only the name hashes the <b>hash</b> again — and the user can never log in again.</p>`,
  vi: J`<p>Nhiều dự án băm trong model thay vì trong controller, để không route nào quên được. Thêm vào <code>userSchema</code>:</p>
<ul><li>một hook <code>pre('save')</code> thay <code>this.password</code> bằng mã băm bcrypt của nó (10 vòng) <b>chỉ khi</b> <code>this.isModified('password')</code>;</li>
<li>một phương thức <code>comparePassword(plain)</code> → <code>Promise&lt;boolean&gt;</code>.</li></ul>
<p>Không có chốt <code>isModified</code>, lưu người dùng sau khi chỉ đổi tên sẽ băm lại <b>mã băm</b> — và người dùng không bao giờ đăng nhập lại được.</p>`,
  yc: [
    ['Use a regular <code>function</code> (not an arrow): <code>this</code> must be the document.', 'Dùng <code>function</code> thường (không dùng arrow): <code>this</code> phải là document.'],
    ['<code>userSchema.methods.comparePassword = function (plain) { return bcrypt.compare(plain, this.password); };</code>', '<code>userSchema.methods.comparePassword = function (plain) { return bcrypt.compare(plain, this.password); };</code>'],
    ['Hooks and methods must be added BEFORE <code>mongoose.model(\'User\', userSchema)</code>.', 'Hook và phương thức phải thêm TRƯỚC <code>mongoose.model(\'User\', userSchema)</code>.'],
  ],
  viDu: [['await User.create({ name: "An", email: "an@x.com", password: "secret123" })', 'stored: "$2b$10$…"', 'Hashed by the hook.', 'Hook đã băm.'], ['u.name = "An Nguyen"; await u.save(); await u.comparePassword("secret123")', 'true', 'The guard skipped re-hashing.', 'Chốt đã bỏ qua việc băm lại.']],
  goiY: [
    ['<code>userSchema.pre(\'save\', async function () { if (!this.isModified(\'password\')) return; this.password = await bcrypt.hash(this.password, 10); });</code>', '<code>userSchema.pre(\'save\', async function () { if (!this.isModified(\'password\')) return; this.password = await bcrypt.hash(this.password, 10); });</code>'],
    ['An async hook needs no <code>next</code>: returning (or throwing) is enough in Mongoose 8.', 'Hook async không cần <code>next</code>: return (hoặc throw) là đủ ở Mongoose 8.'],
  ],
  loi: [
    ['An arrow function hook: <code>this</code> is not the document, <code>this.password</code> is undefined.', 'Hook bằng arrow function: <code>this</code> không phải document, <code>this.password</code> là undefined.'],
    ['No <code>isModified</code> check: every save re-hashes the previous hash.', 'Không kiểm <code>isModified</code>: mỗi lần lưu lại băm chồng lên mã băm trước.'],
    ['Defining the hook after <code>mongoose.model(…)</code>: the compiled model never runs it.', 'Định nghĩa hook sau <code>mongoose.model(…)</code>: model đã biên dịch không bao giờ chạy nó.'],
  ],
  gt: [
    'A pre-save hook runs inside <code>create()</code> and every <code>save()</code>, after validation, with <code>this</code> = the document — the right moment to transform the password once. <code>isModified(\'password\')</code> is true for a new document and after you assign a new password, and false after unrelated edits, which is exactly when hashing must be skipped. (Updates with <code>findByIdAndUpdate</code> do NOT run save hooks — change passwords through <code>save()</code>.)',
    'Hook pre-save chạy trong <code>create()</code> và mọi <code>save()</code>, sau bước kiểm tra, với <code>this</code> = document — đúng lúc để biến đổi mật khẩu một lần. <code>isModified(\'password\')</code> đúng với document mới và sau khi bạn gán mật khẩu mới, sai sau các chỉnh sửa không liên quan, đúng lúc phải bỏ qua việc băm. (Cập nhật bằng <code>findByIdAndUpdate</code> KHÔNG chạy hook save — đổi mật khẩu qua <code>save()</code>.)',
  ],
  kn: ['mongoose middleware', 'isModified', 'instance methods'],
  tns: [tn('pre-save hook', 'hook trước khi lưu'), tn('instance method', 'phương thức của document')],
  dau: J`const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

userSchema.pre('save', async () => {
  this.password = await bcrypt.hash(this.password, 10);
});
`,
  giai: J`const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// a regular function: "this" is the document being saved
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;              // name changed only? keep the existing hash
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);           // Promise<boolean>
};

// compile AFTER hooks and methods are attached
const User = mongoose.model('User', userSchema);
`,
  chuanBi: `const B = require('bcrypt'); const raw = async (email) => (await mongoose.model('User').findOne({ email })).password;`,
  cases: [
    { goi: `(await mongoose.model('User').create({ name: 'An', email: 'an@x.com', password: 'secret123' }), (await raw('an@x.com')).startsWith('$2b$10$'))`, moTa: ['create() stores a hash', 'create() lưu mã băm'] },
    { goi: `await (async () => { const U = mongoose.model('User'); const u = await U.create({ name: 'An', email: 'an@x.com', password: 'secret123' }); const h1 = await raw('an@x.com'); u.name = 'An Nguyen'; await u.save(); return [h1 === await raw('an@x.com'), await u.comparePassword('secret123')]; })()`, moTa: ['Changing the name does not re-hash', 'Đổi tên không băm lại'] },
    { goi: `await (async () => { const U = mongoose.model('User'); const u = await U.create({ name: 'An', email: 'an@x.com', password: 'secret123' }); u.password = 'newpass99'; await u.save(); return [await u.comparePassword('newpass99'), await u.comparePassword('secret123'), B.compareSync('newpass99', await raw('an@x.com'))]; })()`, moTa: ['A new password is hashed again', 'Mật khẩu mới được băm lại'] },
    { goi: `await (async () => { const U = mongoose.model('User'); await U.create({ name: 'A', email: 'a@x.com', password: 'samepass1' }); const u = await U.findOne({ email: 'a@x.com' }); u.email = 'a2@x.com'; await u.save(); await u.save(); return u.comparePassword('samepass1'); })()`, an: true },
    { goi: `typeof mongoose.model('User').prototype.comparePassword`, an: true },
  ],
});

/* ── 6 ── sessions */
const E6 = bai({
  ten: 'Sessions & cookies: log in, remember the user, log out', kho: 'HARD', phut: 25, lib: ['mongoose', 'express', 'auth', 'web'],
  en: J`<p>The session flow of the lesson: the server verifies the password, stores a session and sends a cookie with the session id; the browser sends the cookie back on the next requests. Build it with <code>express-session</code>:</p>
<ul><li><code>app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax' } }))</code>;</li>
<li><code>POST /api/auth/login</code> — check email + password (bcrypt); wrong ⇒ 401 <code>{ error: "Invalid credentials" }</code>; right ⇒ <code>req.session.userId = user.id</code> and 200 <code>{ ok: true }</code>;</li>
<li><code>GET /api/me</code> — no <code>req.session.userId</code> ⇒ 401 <code>{ error: "Not logged in" }</code>; else 200 <code>{ id, name, email }</code> of that user;</li>
<li><code>POST /api/auth/logout</code> — <code>req.session.destroy(() => res.status(204).end())</code>.</li></ul>
<p>The grader keeps the cookie between requests like a browser.</p>`,
  vi: J`<p>Luồng session của bài: server kiểm mật khẩu, lưu một session và gửi cookie mang id session; trình duyệt gửi lại cookie ở các request sau. Dựng bằng <code>express-session</code>:</p>
<ul><li><code>app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax' } }))</code>;</li>
<li><code>POST /api/auth/login</code> — kiểm email + mật khẩu (bcrypt); sai ⇒ 401 <code>{ error: "Invalid credentials" }</code>; đúng ⇒ <code>req.session.userId = user.id</code> và 200 <code>{ ok: true }</code>;</li>
<li><code>GET /api/me</code> — không có <code>req.session.userId</code> ⇒ 401 <code>{ error: "Not logged in" }</code>; còn lại 200 <code>{ id, name, email }</code> của người đó;</li>
<li><code>POST /api/auth/logout</code> — <code>req.session.destroy(() => res.status(204).end())</code>.</li></ul>
<p>Máy chấm giữ cookie giữa các request như một trình duyệt.</p>`,
  yc: [
    ['Register <code>express.json()</code> and the session middleware BEFORE the routes.', 'Đăng ký <code>express.json()</code> và middleware session TRƯỚC các route.'],
    ['<code>saveUninitialized: false</code> — a visitor who never logs in gets no cookie at all.', '<code>saveUninitialized: false</code> — khách không bao giờ đăng nhập thì không có cookie nào.'],
    ['Store only the id in the session, not the user document.', 'Chỉ lưu id trong session, không lưu document người dùng.'],
    ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>'],
  ],
  viDu: [['POST /api/auth/login (right password)', '200 {"ok":true}  Set-Cookie: connect.sid=s%3A…; Path=/; HttpOnly; SameSite=Lax', 'The cookie carries only a signed session id.', 'Cookie chỉ mang một id session đã ký.'], ['GET /api/me with that cookie', '200 {"id":"…","name":"An","email":"an@x.com"}', 'The server looked up the session.', 'Server đã tra session.']],
  goiY: [
    ['<code>const session = require(\'express-session\');</code>', '<code>const session = require(\'express-session\');</code>'],
    ['<code>/api/me</code>: <code>const user = await User.findById(req.session.userId);</code> — the password is hidden by <code>select: false</code>, but still build the answer yourself.', '<code>/api/me</code>: <code>const user = await User.findById(req.session.userId);</code> — mật khẩu đã bị <code>select: false</code> giấu, nhưng vẫn tự dựng câu trả lời.'],
  ],
  loi: [
    ['A hard-coded <code>secret: \'keyboard cat\'</code> (from the docs): anyone who reads the code can forge session cookies.', 'Viết cứng <code>secret: \'keyboard cat\'</code> (chép từ tài liệu): ai đọc mã cũng làm giả được cookie session.'],
    ['Logging out with <code>req.session.userId = null</code> only — the session (and its id) stays valid in the store.', 'Đăng xuất chỉ bằng <code>req.session.userId = null</code> — session (và id của nó) vẫn còn hiệu lực trong kho.'],
    ['Putting the whole user (with the hash) into <code>req.session.user</code>.', 'Bỏ nguyên người dùng (kèm mã băm) vào <code>req.session.user</code>.'],
  ],
  gt: [
    'With sessions the server is stateful: the cookie holds only a signed, random id and the data stays in the session store. <code>httpOnly</code> keeps page scripts from reading the cookie, <code>sameSite: \'lax\'</code> stops it from riding along on most cross-site requests, and <code>destroy()</code> removes the server-side record so the old cookie becomes worthless. Lesson 5.2 compares this with JWT, where the server keeps nothing.',
    'Với session, server có trạng thái: cookie chỉ giữ một id ngẫu nhiên đã ký, dữ liệu ở trong kho session. <code>httpOnly</code> chặn script của trang đọc cookie, <code>sameSite: \'lax\'</code> chặn nó đi theo phần lớn request chéo trang, còn <code>destroy()</code> xoá bản ghi phía server nên cookie cũ thành vô giá trị. Bài 5.2 so sánh cách này với JWT, nơi server không giữ gì.',
  ],
  kn: ['express-session', 'cookies', 'stateful auth'],
  tns: [tn('session store', 'kho session'), tn('HttpOnly', 'cookie script không đọc được'), tn('SameSite', 'giới hạn gửi cookie chéo trang')],
  dau: J`const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
${USER}

const app = express();
app.use(express.json());
app.use(session({ secret: 'keyboard cat' }));

app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = user;
  res.json({ ok: true });
});
app.get('/api/me', (req, res) => res.json(req.session.user));
app.post('/api/auth/logout', (req, res) => { req.session.user = null; res.status(204).end(); });

module.exports = app;
`,
  giai: J`const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
${USER}

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,          // signs the cookie — from the environment, never in code
  resave: false,
  saveUninitialized: false,                    // no cookie until there is something to remember
  cookie: { httpOnly: true, sameSite: 'lax' }, // page scripts cannot read it; not sent on most cross-site requests
}));

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(String(password || ''), user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = user.id;              // only the id lives in the session
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get('/api/me', async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ error: 'Not logged in' });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) { next(e); }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.status(204).end());   // the server forgets the session: the old cookie is useless
});

module.exports = app;
`,
  env: { SESSION_SECRET: 'test-session-secret' },
  chuanBi: `const app = module.exports; const B = require('bcrypt'); await User.create({ name: 'An', email: 'an@x.com', password: await B.hash('secret123', 10) });
let jar = {}; const go = async (method, url, body) => { const r = await app.inject({ method, url, body, cookies: jar }); Object.assign(jar, __cookies(r)); return r; };
const login = (pw = 'secret123') => go('POST', '/api/auth/login', { email: 'an@x.com', password: pw });`,
  cases: [
    { goi: `[__res(await go('GET', '/api/me')), Object.keys(jar)]`, moTa: ['Before login: 401 and no cookie (saveUninitialized: false)', 'Trước đăng nhập: 401 và không cookie (saveUninitialized: false)'] },
    { goi: `await (async () => { const r = await login(); const c = [].concat(r.headers['set-cookie'] || [])[0] || ''; return [__res(r), /HttpOnly/.test(c), /SameSite=Lax/.test(c), (await go('GET', '/api/me')).body]; })()`, moTa: ['Login sets an HttpOnly, SameSite=Lax cookie; /api/me knows the user', 'Đăng nhập đặt cookie HttpOnly, SameSite=Lax; /api/me biết người dùng'] },
    { goi: `[__res(await login('wrong')), __res(await go('GET', '/api/me'))]`, moTa: ['Wrong password → 401, still not logged in', 'Sai mật khẩu → 401, vẫn chưa đăng nhập'] },
    { goi: `(await login(), [ (await go('POST', '/api/auth/logout')).status, __res(await go('GET', '/api/me')) ])`, moTa: ['Logout → 204, then /api/me → 401', 'Đăng xuất → 204, rồi /api/me → 401'] },
    { goi: `(await login(), await (async () => { const old = { ...jar }; await go('POST', '/api/auth/logout'); jar = old; return __res(await go('GET', '/api/me')); })())`, an: true, moTa: ['After logout, replaying the old cookie does not work', 'Sau đăng xuất, gửi lại cookie cũ không dùng được'] },
    { goi: `(await login(), JSON.stringify((await go('GET', '/api/me')).body).includes('$2b$'))`, an: true },
    { goi: `[__res(await go('POST', '/api/auth/login', { email: 'nobody@x.com', password: 'x' })), __res(await go('POST', '/api/auth/login', {}))]`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-5-1-passwords-sessions',
  ten: '5.1 Passwords, bcrypt, sessions & Passport',
  khoa: KHOA,
  baiHoc: 'sdn302-5-1-passwords-sessions',
  de: [E1, E2, E3, E4, E5, E6],
});
