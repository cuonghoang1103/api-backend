/** SDN302 · Lab Chương 5 — API ghi chú có xác thực: đăng ký bcrypt, đăng nhập JWT, requireAuth, ghi chú chỉ chủ sở hữu thấy (404 thay vì 403 để không lộ), admin xoá được, CORS cho đúng origin của React. Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

const L1 = cs({
  ten: 'Lab 5 · warm-up — 401, 403 or 404?', kho: 'EASY', phut: 6, dangBai: 'lab',
  en: 'The status codes of an owner-only resource.',
  vi: 'Mã trạng thái của một tài nguyên chỉ chủ sở hữu dùng được.',
  cau: [
    q('s1', ['Binh (logged in) requests <code>GET /api/notes/&lt;An\'s note id&gt;</code>. What should the API answer?', 'Binh (đã đăng nhập) gọi <code>GET /api/notes/&lt;id ghi chú của An&gt;</code>. API nên trả gì?'],
      ['404 Not found — as if the note did not exist, so Binh learns nothing about An\'s notes', '403 Forbidden — the note exists but is not yours', '401 Unauthorized — Binh must log in again', '200 with an empty object'],
      ['For private resources, "not yours" and "does not exist" should look the same; 403 would confirm that the id is real.', 'Với tài nguyên riêng tư, "không phải của bạn" và "không tồn tại" nên trông như nhau; 403 sẽ xác nhận id đó có thật.']),
    q('s2', ['A request has an expired token. Status?', 'Một request có token hết hạn. Mã nào?'],
      ['401 — we do not know who you are any more', '403 — you are not allowed', '400 — the header is malformed', '440 — session timeout'],
      ['The client should log in again.', 'Client nên đăng nhập lại.']),
    q('s3', ['A normal user calls an admin-only route with a valid token. Status?', 'Người dùng thường gọi route chỉ dành cho admin với token hợp lệ. Mã nào?'],
      ['403 — authenticated, but not authorised', '401 — log in again', '404 — the route does not exist for users', '500'],
      ['Here the route is public knowledge, so 403 leaks nothing.', 'Ở đây route là điều ai cũng biết, nên 403 không lộ gì.']),
  ],
  goiY: [['Ask: does the answer reveal something?', 'Hỏi: câu trả lời có làm lộ điều gì không?'], ['401 = who? 403 = no.', '401 = ai? 403 = không.']],
  loi: [['403 on someone else\'s private note.', '403 cho ghi chú riêng của người khác.'], ['403 for an expired token.', '403 cho token hết hạn.']],
  tns: [tn('owner-only', 'chỉ chủ sở hữu')],
  kn: ['authorisation'],
});

const L2 = bai({
  ten: 'Lab 5 — Private notes API: bcrypt, JWT, ownership, CORS', kho: 'HARD', phut: 90, dangBai: 'lab', lib: ['mongoose', 'express', 'auth'],
  en: J`<p>Build an API where every user has private notes. The full brief is in the statement.</p>`,
  vi: J`<p>Dựng một API nơi mỗi người dùng có các ghi chú riêng. Đề đầy đủ nằm trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['POST /api/auth/login {"email":"an@x.com","password":"secret123"}', '200 {"token":"eyJ…"}', 'Then send Authorization: Bearer <token>.', 'Rồi gửi Authorization: Bearer <token>.'], ['GET /api/notes (Binh\'s token)', '200 [only Binh\'s notes]', 'The filter comes from the token, not from the query.', 'Bộ lọc lấy từ token, không từ query.']],
  goiY: [['Every notes query includes <code>owner: req.user.id</code> — except the admin delete.', 'Mọi truy vấn ghi chú đều có <code>owner: req.user.id</code> — trừ thao tác xoá của admin.'], ['<code>Note.findOne({ _id: id, owner: req.user.id })</code> answers "yours and exists" in one query; null ⇒ 404.', '<code>Note.findOne({ _id: id, owner: req.user.id })</code> trả lời "của bạn và tồn tại" trong một truy vấn; null ⇒ 404.']],
  loi: [['<code>Note.findById(id)</code> then checking the owner and answering 403 — it confirms the note exists.', '<code>Note.findById(id)</code> rồi kiểm chủ và trả 403 — nó xác nhận ghi chú có tồn tại.'], ['Taking <code>owner</code> from the body on create.', 'Lấy <code>owner</code> từ body khi tạo.'], ['<code>origin: \'*\'</code> with credentials in CORS.', '<code>origin: \'*\'</code> kèm credentials trong CORS.']],
  gt: ['Authentication tells the server WHO is calling (bcrypt + JWT); authorisation is then enforced in every query by scoping it to the owner, which is both simpler and safer than fetching first and comparing later. CORS opens the API to the one React origin that needs it, configured from the environment.', 'Xác thực cho server biết AI đang gọi (bcrypt + JWT); phân quyền rồi được thực thi trong mọi truy vấn bằng cách giới hạn theo chủ sở hữu, vừa đơn giản vừa an toàn hơn việc lấy ra trước rồi mới so. CORS mở API cho đúng một origin React cần nó, cấu hình từ môi trường.'],
  kn: ['bcrypt', 'JWT', 'ownership', 'CORS'],
  tns: [tn('scoped query', 'truy vấn giới hạn theo chủ')],
  env: { JWT_SECRET: 'lab5-secret', CLIENT_ORIGIN: 'http://localhost:5173' },
  banIn: {
    tieuDe: { en: 'Lab 5 — Private notes API', vi: 'Lab 5 — API ghi chú riêng tư' },
    phu: { en: 'bcrypt · JWT · ownership · CORS · 90 minutes · 10 marks', vi: 'bcrypt · JWT · quyền sở hữu · CORS · 90 phút · 10 điểm' },
    moTa: { en: '<p>Users register, log in and keep private notes; an admin may delete any note. The React front-end runs on <code>process.env.CLIENT_ORIGIN</code>. Tokens are signed with <code>process.env.JWT_SECRET</code>. All answers are JSON.</p>', vi: '<p>Người dùng đăng ký, đăng nhập và giữ ghi chú riêng; admin được xoá mọi ghi chú. Front-end React chạy ở <code>process.env.CLIENT_ORIGIN</code>. Token được ký bằng <code>process.env.JWT_SECRET</code>. Mọi câu trả lời là JSON.</p>' },
    yeuCauChung: [{ en: 'Models: <code>User { name, email (unique, lower-case), password (select: false), role: \'user\' | \'admin\' }</code>, <code>Note { title, body, owner → User }</code> with timestamps.', vi: 'Model: <code>User { name, email (duy nhất, chữ thường), password (select: false), role: \'user\' | \'admin\' }</code>, <code>Note { title, body, owner → User }</code> có timestamps.' }, { en: 'Never send a password or hash in any answer.', vi: 'Không bao giờ gửi mật khẩu hay mã băm trong câu trả lời nào.' }],
    cayThuMuc: 'answer.js   ← models, auth middleware, routes\nlib/        ← provided',
    moHinh: [{ ten: 'User', truong: [['name', 'String', 'required'], ['email', 'String', 'required, unique, lowercase'], ['password', 'String', { en: 'bcrypt hash, select: false', vi: 'mã băm bcrypt, select: false' }], ['role', 'String', "'user' | 'admin', default 'user'"]] }, { ten: 'Note', truong: [['title', 'String', { en: 'required, 1–100', vi: 'bắt buộc, 1–100' }], ['body', 'String', { en: 'default ""', vi: 'mặc định ""' }], ['owner', 'ObjectId → User', { en: 'set from the token', vi: 'lấy từ token' }]] }],
    chucNang: [
      { ten: { en: 'Register', vi: 'Đăng ký' }, diem: 2, yeuCau: [{ en: '<code>POST /api/auth/register { name, email, password }</code>: password ≥ 8 characters, name and email required ⇒ else 400 <code>{ "error": "name, email and a password of 8+ characters are required" }</code>; taken email ⇒ 409 <code>{ "error": "Email already registered" }</code>; 201 <code>{ id, name, email, role }</code> with role always <code>"user"</code>.', vi: '<code>POST /api/auth/register { name, email, password }</code>: mật khẩu ≥ 8 ký tự, name và email bắt buộc ⇒ không thì 400 <code>{ "error": "name, email and a password of 8+ characters are required" }</code>; email đã có ⇒ 409 <code>{ "error": "Email already registered" }</code>; 201 <code>{ id, name, email, role }</code> với role luôn là <code>"user"</code>.' }] },
      { ten: { en: 'Login', vi: 'Đăng nhập' }, diem: 2, yeuCau: [{ en: '<code>POST /api/auth/login</code> ⇒ 200 <code>{ token }</code> — a JWT with payload <code>{ id, role }</code>, valid 1 hour; unknown email or wrong password ⇒ the same 401 <code>{ "error": "Invalid credentials" }</code>.', vi: '<code>POST /api/auth/login</code> ⇒ 200 <code>{ token }</code> — JWT với payload <code>{ id, role }</code>, hạn 1 giờ; email lạ hoặc sai mật khẩu ⇒ cùng một 401 <code>{ "error": "Invalid credentials" }</code>.' }] },
      { ten: { en: 'requireAuth + /api/me', vi: 'requireAuth + /api/me' }, diem: 1.5, yeuCau: [{ en: 'Missing/invalid/expired Bearer token ⇒ 401 <code>{ "error": "Unauthorized" }</code>. <code>GET /api/me</code> ⇒ 200 <code>{ id, name, email, role }</code> of the caller.', vi: 'Thiếu/sai/hết hạn Bearer token ⇒ 401 <code>{ "error": "Unauthorized" }</code>. <code>GET /api/me</code> ⇒ 200 <code>{ id, name, email, role }</code> của người gọi.' }] },
      { ten: { en: 'Owner-only notes', vi: 'Ghi chú chỉ chủ sở hữu' }, diem: 3, yeuCau: [
        { en: '<code>POST /api/notes</code> ⇒ 201 (owner = the caller; title 1–100 ⇒ else 400 <code>{ "error": "title must be 1-100 characters" }</code>). <code>GET /api/notes</code> ⇒ the caller\'s notes only, newest first.', vi: '<code>POST /api/notes</code> ⇒ 201 (owner = người gọi; title 1–100 ⇒ không thì 400 <code>{ "error": "title must be 1-100 characters" }</code>). <code>GET /api/notes</code> ⇒ chỉ ghi chú của người gọi, mới nhất trước.' },
        { en: '<code>GET /api/notes/:id</code> and <code>DELETE /api/notes/:id</code>: a malformed id ⇒ 400 <code>{ "error": "Invalid id" }</code>; somebody else\'s note OR a missing note ⇒ the same 404 <code>{ "error": "Note not found" }</code>; delete ⇒ 204. An <b>admin</b> may delete any note.', vi: '<code>GET /api/notes/:id</code> và <code>DELETE /api/notes/:id</code>: id dị dạng ⇒ 400 <code>{ "error": "Invalid id" }</code>; ghi chú của người khác HOẶC không có ⇒ cùng một 404 <code>{ "error": "Note not found" }</code>; xoá ⇒ 204. <b>Admin</b> được xoá mọi ghi chú.' }] },
      { ten: { en: 'CORS for the React app', vi: 'CORS cho app React' }, diem: 1.5, yeuCau: [{ en: 'Requests from <code>CLIENT_ORIGIN</code> get <code>Access-Control-Allow-Origin: &lt;that origin&gt;</code> + <code>Access-Control-Allow-Credentials: true</code> + <code>Vary: Origin</code>; an <code>OPTIONS</code> preflight from it ⇒ 204 with <code>Access-Control-Allow-Methods: GET,POST,DELETE</code> and <code>Access-Control-Allow-Headers: Content-Type,Authorization</code>. Other origins get no Allow-Origin header.', vi: 'Request từ <code>CLIENT_ORIGIN</code> nhận <code>Access-Control-Allow-Origin: &lt;origin đó&gt;</code> + <code>Access-Control-Allow-Credentials: true</code> + <code>Vary: Origin</code>; preflight <code>OPTIONS</code> từ nó ⇒ 204 kèm <code>Access-Control-Allow-Methods: GET,POST,DELETE</code> và <code>Access-Control-Allow-Headers: Content-Type,Authorization</code>. Origin khác không có header Allow-Origin.' }] },
    ],
    truDiem: [{ en: 'A password hash in any response: −2.', vi: 'Mã băm mật khẩu trong bất kỳ câu trả lời nào: −2.' }, { en: 'A hard-coded JWT secret: −1.', vi: 'JWT secret viết cứng: −1.' }],
    nopBai: { en: 'Submit <code>answer.js</code>; <code>module.exports = app;</code>', vi: 'Nộp <code>answer.js</code>; <code>module.exports = app;</code>' },
  },
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String, password: String, role: { type: String, default: 'user' } }));
const Note = mongoose.model('Note', new mongoose.Schema({ title: String, body: String, owner: mongoose.Schema.Types.ObjectId }, { timestamps: true }));

const app = express();
app.use(express.json());
app.post('/api/auth/register', async (req, res) => res.status(201).json(await User.create(req.body)));
app.get('/api/notes', async (req, res) => res.json(await Note.find()));
module.exports = app;
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

// ── models ──
const User = mongoose.model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true }));
const Note = mongoose.model('Note', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  body: { type: String, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

// ── CORS: only the React origin from the environment ──
function cors(req, res, next) {
  const origin = req.get('origin');
  res.vary('Origin');
  if (origin && origin === process.env.CLIENT_ORIGIN) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET,POST,DELETE');
      res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return res.status(204).end();
    }
  }
  next();
}

// ── authentication ──
function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  try {
    if (scheme !== 'Bearer' || !token) throw new Error('no token');
    req.user = jwt.verify(token, process.env.JWT_SECRET);           // { id, role, iat, exp }
    next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
}

const app = express();
app.use(cors);
app.use(express.json());

app.post('/api/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'name, email and a password of 8+ characters are required' });
  }
  try {
    const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });   // role: default 'user'
    res.status(201).json(publicUser(u));
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password');
  if (!u || !(await bcrypt.compare(String(req.body.password || ''), u.password))) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
}));

app.get('/api/me', requireAuth, wrap(async (req, res) => {
  const u = await User.findById(req.user.id);
  if (!u) return res.status(401).json({ error: 'Unauthorized' });
  res.json(publicUser(u));
}));

// ── notes: every query is SCOPED to the owner ──
const notes = express.Router();
notes.use(requireAuth);
const badId = (res, id) => (mongoose.isValidObjectId(id) ? false : (res.status(400).json({ error: 'Invalid id' }), true));
notes.post('/', wrap(async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (title.length < 1 || title.length > 100) return res.status(400).json({ error: 'title must be 1-100 characters' });
  res.status(201).json(await Note.create({ title, body: req.body.body || '', owner: req.user.id }));   // owner from the TOKEN
}));
notes.get('/', wrap(async (req, res) => res.json(await Note.find({ owner: req.user.id }).sort({ createdAt: -1 }))));
notes.get('/:id', wrap(async (req, res) => {
  if (badId(res, req.params.id)) return;
  const n = await Note.findOne({ _id: req.params.id, owner: req.user.id });   // not yours = not found
  if (!n) return res.status(404).json({ error: 'Note not found' });
  res.json(n);
}));
notes.delete('/:id', wrap(async (req, res) => {
  if (badId(res, req.params.id)) return;
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
  const n = await Note.findOneAndDelete(filter);
  if (!n) return res.status(404).json({ error: 'Note not found' });
  res.status(204).end();
}));
app.use('/api/notes', notes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(err.name === 'ValidationError' ? 400 : 500).json({ error: err.name === 'ValidationError' ? 'Validation failed' : 'Internal Server Error' }));
module.exports = app;
`,
  chuanBi: `const app = module.exports; const B = require('bcrypt'); const jwt = require('jsonwebtoken'); const U = mongoose.model('User'); const N = mongoose.model('Note');
const an = await U.create({ name: 'An', email: 'an@x.com', password: await B.hash('secret123', 10) }); const binh = await U.create({ name: 'Binh', email: 'binh@x.com', password: await B.hash('binhpass99', 10) }); const boss = await U.create({ name: 'Boss', email: 'boss@x.com', password: await B.hash('bosspass99', 10), role: 'admin' });
const anNote = await N.create({ title: 'An private', owner: an._id }); await __sleep(5); await N.create({ title: 'An second', owner: an._id }); const binhNote = await N.create({ title: 'Binh private', owner: binh._id });
const tok = (u) => jwt.sign({ id: String(u._id), role: u.role }, 'lab5-secret', { expiresIn: '1h' });
const go = async (method, url, body, token, extra = {}) => { const r = await app.inject({ method, url, body, headers: Object.assign(token ? { Authorization: 'Bearer ' + token } : {}, extra) }); const b = r.body; return { status: r.status, body: Array.isArray(b) ? b.map((n) => n.title) : b && b._id ? __pick(b, 'title') : b }; };`,
  cases: [
    { goi: `[await go('POST', '/api/auth/register', { name: 'Chi', email: 'CHI@x.com', password: 'chipass99', role: 'admin' }).then((r) => [r.status, r.body.role, Object.keys(r.body).sort()]), (await go('POST', '/api/auth/register', { name: 'An2', email: 'an@x.com', password: 'whatever99' })).status, (await go('POST', '/api/auth/register', { name: 'D', email: 'd@x.com', password: 'short' })).status]`, nhom: 'f1', moTa: ['201 role user (body role ignored) / 409 / 400', '201 role user (bỏ role trong body) / 409 / 400'] },
    { goi: `(await go('POST', '/api/auth/register', { name: 'E', email: 'e@x.com', password: 'epass999' }), (await U.findOne({ email: 'e@x.com' }).select('+password')).password.startsWith('$2b$'))`, nhom: 'f1', an: true },
    { goi: `await (async () => { const r = await go('POST', '/api/auth/login', { email: 'an@x.com', password: 'secret123' }); const p = jwt.verify(r.body.token, 'lab5-secret'); return [r.status, p.id === String(an._id), p.role, p.exp - p.iat]; })()`, nhom: 'f2', moTa: ['Login → a JWT { id, role } valid 1 hour', 'Đăng nhập → JWT { id, role } hạn 1 giờ'] },
    { goi: `[await go('POST', '/api/auth/login', { email: 'an@x.com', password: 'nope' }), await go('POST', '/api/auth/login', { email: 'ghost@x.com', password: 'secret123' })]`, nhom: 'f2', moTa: ['Both failures → the same 401', 'Cả hai thất bại → cùng một 401'] },
    { goi: `[await go('GET', '/api/me', undefined, tok(an)), await go('GET', '/api/me'), await go('GET', '/api/me', undefined, jwt.sign({ id: String(an._id), role: 'user' }, 'wrong-secret'))]`, nhom: 'f3', moTa: ['/api/me with / without / with a forged token', '/api/me có / không / token giả'] },
    { goi: `[await go('POST', '/api/notes', { title: 'Mine', owner: String(binh._id) }, tok(an)), await go('GET', '/api/notes', undefined, tok(an)), await go('GET', '/api/notes', undefined, tok(binh)), await go('POST', '/api/notes', { title: '' }, tok(an))]`, nhom: 'f4', moTa: ['Create (owner from token) and list only my notes', 'Tạo (chủ lấy từ token) và chỉ liệt kê ghi chú của tôi'] },
    { goi: `[await go('GET', '/api/notes/' + anNote._id, undefined, tok(binh)), await go('GET', '/api/notes/' + new mongoose.Types.ObjectId(), undefined, tok(binh)), await go('GET', '/api/notes/abc', undefined, tok(binh)), await go('GET', '/api/notes/' + anNote._id, undefined, tok(an))]`, nhom: 'f4', moTa: ['Someone else’s note looks exactly like a missing one (404)', 'Ghi chú của người khác trông y như không tồn tại (404)'] },
    { goi: `[await go('DELETE', '/api/notes/' + anNote._id, undefined, tok(binh)), await go('DELETE', '/api/notes/' + binhNote._id, undefined, tok(boss)), await go('DELETE', '/api/notes/' + anNote._id, undefined, tok(an)), await go('GET', '/api/notes', undefined, tok(an))]`, nhom: 'f4', an: true },
    { goi: `await (async () => { const r = await app.inject({ method: 'OPTIONS', url: '/api/notes', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST' } }); const g = await app.inject({ url: '/api/me', headers: { Origin: 'https://evil.example', Authorization: 'Bearer ' + tok(an) } }); const pick = (h) => Object.fromEntries(Object.keys(h).filter((k) => /^access-control|^vary$/.test(k)).sort().map((k) => [k, h[k]])); return [r.status, pick(r.headers), g.status, pick(g.headers)]; })()`, nhom: 'f5', moTa: ['Preflight from the React origin → 204 + headers; another origin gets none', 'Preflight từ origin React → 204 + header; origin khác không có'] },
    { goi: `JSON.stringify([await go('GET', '/api/me', undefined, tok(an)), await go('POST', '/api/auth/register', { name: 'F', email: 'f@x.com', password: 'fpass9999' })]).includes('$2b$')`, nhom: 'f1', an: true },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'The JWT secret comes from process.env', vi: 'JWT secret lấy từ process.env' }, khop: 'process\\.env\\.JWT_SECRET', tep: 'answer.js', nhom: 'f2' }],
});

export default doiDau({
  slug: 'sdn302-5-lab-auth-notes',
  ten: 'Lab 5 — Private notes API: bcrypt, JWT, ownership, CORS',
  khoa: KHOA,
  baiHoc: 'sdn302-5-2-jwt-cors',
  de: [L1, L2],
});
