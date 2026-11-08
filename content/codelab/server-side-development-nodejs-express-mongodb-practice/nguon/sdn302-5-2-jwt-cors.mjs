/** SDN302 · 5.2 — JWT, HTTPS, CORS & upload/download: ký token khi đăng nhập, requireAuth + requireRole, CORS allow-list (CORS không phải tường lửa), Multer (lọc + giới hạn), tải xuống với path.basename, chuyển hướng HTTP → HTTPS. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

/* ── 1 ── choice */
const E1 = cs({
  ten: 'JWT, HTTPS and CORS: what each one really protects', kho: 'EASY', phut: 10,
  en: 'Questions on the lesson (the CORS facts are the lesson\'s own measurement with Express 5.3 + cors 2.8.6; JWT behaviour checked with jsonwebtoken 9 on 08/11/2026).',
  vi: 'Câu hỏi về bài (các ý về CORS là phép đo của chính bài với Express 5.3 + cors 2.8.6; hành vi JWT đã kiểm với jsonwebtoken 9 ngày 08/11/2026).',
  cau: [
    q('j1', ['Anyone who gets a JWT can read its payload. Why?', 'Ai có JWT cũng đọc được payload của nó. Vì sao?'],
      ['The payload is only base64url-encoded; only the signature is protected', 'jwt.io has the server secret', 'The browser decrypts it to send it', 'It is a bug of the jsonwebtoken package'],
      ['So never put passwords or private data in it — an id and a role are fine.', 'Vì vậy không bao giờ để mật khẩu hay dữ liệu riêng tư trong đó — id và role thì được.']),
    q('j2', ['What does verifying a JWT prove?', 'Xác minh một JWT chứng minh điều gì?'],
      ['The server signed this exact header + payload, and it is not expired', 'The user is still logged in on the device that sent it', 'The token reached the server over an HTTPS connection', 'The payload was encrypted with the server\'s secret key'],
      ['Change one character of the payload and the signature no longer matches ⇒ "invalid signature".', 'Sửa một ký tự của payload là chữ ký không còn khớp ⇒ "invalid signature".']),
    q('j3', ['Sessions vs JWT: which statement is right?', 'Session vs JWT: câu nào đúng?'],
      ['JWT: the server stores nothing per login; sessions: a stored record per cookie', 'JWTs must be saved in MongoDB, or they cannot be verified later', 'Sessions cannot work for a React app on the same domain', 'A JWT can be revoked instantly by deleting it from the server'],
      ['Stateless is the point of JWT — and its cost: a stolen token is valid until it expires.', 'Không trạng thái là điểm mạnh của JWT — và là cái giá: token bị trộm vẫn hợp lệ tới khi hết hạn.']),
    q('j4', ['Why must the API use HTTPS even with JWT?', 'Vì sao API vẫn phải dùng HTTPS dù có JWT?'],
      ['On plain HTTP the Bearer header travels in clear text and can be copied', 'JWT verification only works when the server listens on port 443', 'Browsers refuse to attach an Authorization header over plain HTTP', 'HTTPS encrypts the payload, so nobody can decode the token'],
      ['HTTPS encrypts the whole request, headers included. The payload is still readable by whoever holds the token.', 'HTTPS mã hoá cả request, kể cả header. Payload vẫn đọc được bởi người cầm token.']),
    q('j5', ['<code>app.use(cors({ origin: \'http://localhost:5173\' }))</code>. A request comes with <code>Origin: http://evil.example</code>. What happens on the server? (measured in the lesson)', '<code>app.use(cors({ origin: \'http://localhost:5173\' }))</code>. Một request đến với <code>Origin: http://evil.example</code>. Server làm gì? (đã đo trong bài)'],
      ['The handler runs and answers 200; the evil page just cannot read it', 'cors answers 403 Forbidden and the route handler never runs', 'The connection is dropped before Express even sees the request', 'Express crashes with a CORS error and the process restarts'],
      ['CORS is a browser rule about reading responses, not a firewall. Protect data with authentication.', 'CORS là luật của trình duyệt về việc đọc response, không phải tường lửa. Bảo vệ dữ liệu bằng xác thực.']),
    qn('j6', ['Which belong in environment variables, never in code? (choose all)', 'Cái nào thuộc biến môi trường, không bao giờ ở trong mã? (chọn hết)'],
      ['<code>JWT_SECRET</code>', '<code>MONGODB_URI</code> with its password', 'The allowed front-end origin of production', 'The route path <code>/api/products</code>', 'The name of the <code>Product</code> model'],
      [0, 1, 2],
      ['Secrets and environment-specific settings go to <code>process.env</code> (a git-ignored <code>.env</code> locally, the host dashboard in production). Route paths and model names are code.', 'Bí mật và cấu hình theo môi trường đi vào <code>process.env</code> (<code>.env</code> bị git-ignore ở máy, bảng điều khiển của host ở production). Đường route và tên model là mã.']),
  ],
  goiY: [['Encoded ≠ encrypted.', 'Mã hoá base64 ≠ mã hoá bí mật.'], ['Who enforces CORS: the server or the browser?', 'Ai thực thi CORS: server hay trình duyệt?']],
  loi: [['Putting roles you want hidden in a JWT.', 'Để role muốn giấu trong JWT.'], ['Treating CORS as access control.', 'Coi CORS là kiểm soát truy cập.']],
  tns: [tn('JWT', 'JSON Web Token'), tn('stateless', 'không trạng thái'), tn('CORS', 'chia sẻ tài nguyên khác nguồn')],
  kn: ['JWT', 'CORS', 'HTTPS'],
});

/* ── 2 ── issue token */
const E2 = bai({
  ten: 'Sign a JWT at login: the payload, the secret from env, expiresIn', kho: 'MEDIUM', phut: 15, lib: ['express', 'auth'],
  en: J`<p>Write <code>issueToken(user)</code> and the login route that uses it:</p>
<ul><li><code>issueToken(user)</code> — <code>jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })</code>; if <code>JWT_SECRET</code> is missing throw <code>new Error('JWT_SECRET is not set')</code> (never fall back to a default secret);</li>
<li><code>POST /api/auth/login</code> — the credential check is given (<code>checkCredentials</code> returns the user or <code>null</code>); <code>null</code> ⇒ 401 <code>{ error: "Invalid credentials" }</code>; else 200 <code>{ token }</code>.</li></ul>
<p>The payload carries only what the API needs to authorise a request: the id and the role. No email, no password hash.</p>`,
  vi: J`<p>Viết <code>issueToken(user)</code> và route đăng nhập dùng nó:</p>
<ul><li><code>issueToken(user)</code> — <code>jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })</code>; thiếu <code>JWT_SECRET</code> thì ném <code>new Error('JWT_SECRET is not set')</code> (không bao giờ lùi về một secret mặc định);</li>
<li><code>POST /api/auth/login</code> — phần kiểm thông tin đăng nhập cho sẵn (<code>checkCredentials</code> trả người dùng hoặc <code>null</code>); <code>null</code> ⇒ 401 <code>{ error: "Invalid credentials" }</code>; còn lại 200 <code>{ token }</code>.</li></ul>
<p>Payload chỉ mang thứ API cần để phân quyền: id và role. Không email, không mã băm mật khẩu.</p>`,
  yc: [
    ['Read <code>process.env.JWT_SECRET</code> inside the function (it can change between deploys/tests).', 'Đọc <code>process.env.JWT_SECRET</code> bên trong hàm (nó có thể đổi giữa các lần deploy/test).'],
    ['<code>expiresIn: \'1d\'</code> ⇒ <code>exp = iat + 86400</code>.', '<code>expiresIn: \'1d\'</code> ⇒ <code>exp = iat + 86400</code>.'],
    ['Export <code>module.exports = { app, issueToken };</code>', 'Export <code>module.exports = { app, issueToken };</code>'],
  ],
  viDu: [['issueToken({ _id: "u1", role: "user", email: "an@x.com", password: "$2b$…" })', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>', 'payload = {"id":"u1","role":"user","iat":…,"exp":…+86400}', 'payload = {"id":"u1","role":"user","iat":…,"exp":…+86400}'], ['JWT_SECRET missing', 'throws Error: JWT_SECRET is not set', 'Fail loudly instead of signing with a guessable secret.', 'Hỏng ầm ĩ thay vì ký bằng secret đoán được.']],
  goiY: [
    ['<code>const secret = process.env.JWT_SECRET; if (!secret) throw new Error(\'JWT_SECRET is not set\');</code>', '<code>const secret = process.env.JWT_SECRET; if (!secret) throw new Error(\'JWT_SECRET is not set\');</code>'],
    ['Decode a token to look at it: <code>jwt.decode(token)</code> (no secret needed — that is the point of question 1).', 'Giải mã một token để xem: <code>jwt.decode(token)</code> (không cần secret — đó chính là ý của câu 1).'],
  ],
  loi: [
    ['<code>jwt.sign(user, …)</code> — the whole user (email, password hash) is now readable by anyone holding the token.', '<code>jwt.sign(user, …)</code> — cả người dùng (email, mã băm) giờ ai cầm token cũng đọc được.'],
    ['<code>process.env.JWT_SECRET || \'secret\'</code> — a forgotten env var on the host silently signs every token with a public secret.', '<code>process.env.JWT_SECRET || \'secret\'</code> — quên biến môi trường trên host là lặng lẽ ký mọi token bằng một secret công khai.'],
    ['<code>expiresIn: 1</code> thinking "1 day" — a number means SECONDS.', '<code>expiresIn: 1</code> tưởng là "1 ngày" — số nghĩa là GIÂY.'],
  ],
  gt: [
    'The token is the user\'s proof of login for the next requests, so it must be signed with a secret only the server knows and must expire. Keeping the payload to <code>id</code> + <code>role</code> limits what a leaked token reveals, and refusing to sign without a configured secret turns a deploy mistake into an obvious error instead of a silent forgery hole.',
    'Token là bằng chứng đăng nhập của người dùng cho các request sau, nên phải được ký bằng secret chỉ server biết và phải hết hạn. Giữ payload chỉ có <code>id</code> + <code>role</code> giới hạn những gì token bị lộ để lộ ra, và từ chối ký khi chưa cấu hình secret biến một lỗi deploy thành lỗi hiển nhiên thay vì một lỗ giả mạo âm thầm.',
  ],
  kn: ['jwt.sign', 'process.env'],
  tns: [tn('payload', 'phần dữ liệu của token'), tn('claim', 'mệnh đề trong payload', 'id, role, iat, exp'), tn('expiresIn', 'thời hạn')],
  env: { JWT_SECRET: 'test-jwt-secret' },
  dau: J`const express = require('express');
const jwt = require('jsonwebtoken');

// given: returns the user document or null
const USERS = [{ _id: 'u1', name: 'An', email: 'an@x.com', role: 'user', password: '$2b$10$hashhashhash' }];
async function checkCredentials(email, password) { return USERS.find((u) => u.email === email && password === 'secret123') || null; }

function issueToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: 1 });
}

const app = express();
app.use(express.json());
app.post('/api/auth/login', async (req, res) => {
  const user = await checkCredentials(req.body.email, req.body.password);
  res.json({ token: issueToken(user) });
});
module.exports = { app, issueToken };
`,
  giai: J`const express = require('express');
const jwt = require('jsonwebtoken');

// given: returns the user document or null
const USERS = [{ _id: 'u1', name: 'An', email: 'an@x.com', role: 'user', password: '$2b$10$hashhashhash' }];
async function checkCredentials(email, password) { return USERS.find((u) => u.email === email && password === 'secret123') || null; }

function issueToken(user) {
  const secret = process.env.JWT_SECRET;                        // from .env / the host dashboard
  if (!secret) throw new Error('JWT_SECRET is not set');        // never fall back to a guessable default
  // only what authorisation needs — the payload is readable by anyone holding the token
  return jwt.sign({ id: String(user._id), role: user.role }, secret, { expiresIn: '1d' });
}

const app = express();
app.use(express.json());
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const user = await checkCredentials(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: issueToken(user) });
  } catch (e) { next(e); }
});
module.exports = { app, issueToken };
`,
  chuanBi: `const { app, issueToken } = module.exports; const jwt = require('jsonwebtoken'); const U = { _id: 'u1', name: 'An', email: 'an@x.com', role: 'user', password: '$2b$10$hashhashhash' };
const look = (t) => { const p = jwt.decode(t); return { keys: Object.keys(p).sort(), id: p.id, role: p.role, life: p.exp - p.iat }; };`,
  cases: [
    { goi: `look(issueToken(U))`, moTa: ['Payload = id + role (+ iat, exp), lifetime 86400 s', 'Payload = id + role (+ iat, exp), thời hạn 86400 s'] },
    { goi: `jwt.verify(issueToken(U), 'test-jwt-secret').id`, moTa: ['Signed with process.env.JWT_SECRET', 'Ký bằng process.env.JWT_SECRET'] },
    { goi: `(delete process.env.JWT_SECRET, issueToken(U))`, nem: 'Error', thongDiep: 'JWT_SECRET is not set', moTa: ['No secret → throws, no default secret', 'Không có secret → ném lỗi, không có secret mặc định'] },
    { goi: `[(await app.inject({ method: 'POST', url: '/api/auth/login', body: { email: 'an@x.com', password: 'secret123' } })).body.token.split('.').length, __res(await app.inject({ method: 'POST', url: '/api/auth/login', body: { email: 'an@x.com', password: 'nope' } }))]`, moTa: ['Login → { token } or 401', 'Đăng nhập → { token } hoặc 401'] },
    { goi: `(process.env.JWT_SECRET = 'rotated', [jwt.verify(issueToken({ _id: 'u9', role: 'admin' }), 'rotated').role, (() => { try { jwt.verify(issueToken(U), 'test-jwt-secret'); return 'verified'; } catch (e) { return e.message; } })()])`, an: true },
    { goi: `JSON.stringify(jwt.decode(issueToken(U))).includes('an@x.com') || JSON.stringify(jwt.decode(issueToken(U))).includes('$2b$')`, an: true },
  ],
});

/* ── 3 ── requireAuth + requireRole */
const E3 = bai({
  ten: 'requireAuth (Bearer JWT) and requireRole — 401 vs 403', kho: 'MEDIUM', phut: 20, lib: ['express', 'auth'],
  en: J`<p>Make the lesson's <code>requireAuth</code> robust and add <code>requireRole(role)</code>:</p>
<ul><li><code>requireAuth</code>: the header must be exactly <code>Authorization: Bearer &lt;token&gt;</code> ⇒ otherwise 401 <code>{ error: "Missing token" }</code>; verify with <code>process.env.JWT_SECRET</code>; an expired token (<code>err.name === 'TokenExpiredError'</code>) ⇒ 401 <code>{ error: "Token expired" }</code>; any other failure ⇒ 401 <code>{ error: "Invalid token" }</code>; success ⇒ <code>req.user = payload</code> and <code>next()</code>;</li>
<li><code>requireRole(role)</code> returns a middleware: <code>req.user.role !== role</code> ⇒ <b>403</b> <code>{ error: "Forbidden" }</code>; else <code>next()</code>.</li></ul>
<p>Routes (given): <code>GET /api/me</code> (requireAuth) and <code>DELETE /api/products/:id</code> (requireAuth, requireRole('admin')).</p>`,
  vi: J`<p>Làm <code>requireAuth</code> của bài chắc chắn hơn và thêm <code>requireRole(role)</code>:</p>
<ul><li><code>requireAuth</code>: header phải đúng dạng <code>Authorization: Bearer &lt;token&gt;</code> ⇒ không thì 401 <code>{ error: "Missing token" }</code>; xác minh bằng <code>process.env.JWT_SECRET</code>; token hết hạn (<code>err.name === 'TokenExpiredError'</code>) ⇒ 401 <code>{ error: "Token expired" }</code>; mọi thất bại khác ⇒ 401 <code>{ error: "Invalid token" }</code>; thành công ⇒ <code>req.user = payload</code> và <code>next()</code>;</li>
<li><code>requireRole(role)</code> trả một middleware: <code>req.user.role !== role</code> ⇒ <b>403</b> <code>{ error: "Forbidden" }</code>; còn lại <code>next()</code>.</li></ul>
<p>Route (cho sẵn): <code>GET /api/me</code> (requireAuth) và <code>DELETE /api/products/:id</code> (requireAuth, requireRole('admin')).</p>`,
  yc: [
    ['<code>const [scheme, token] = (req.get(\'authorization\') || \'\').split(\' \');</code> and require <code>scheme === \'Bearer\' && token</code>.', '<code>const [scheme, token] = (req.get(\'authorization\') || \'\').split(\' \');</code> và đòi <code>scheme === \'Bearer\' && token</code>.'],
    ['401 = we do not know who you are; 403 = we know, and you may not.', '401 = không biết bạn là ai; 403 = biết rồi, và bạn không được phép.'],
    ['Export <code>module.exports = { app, requireAuth, requireRole };</code>', 'Export <code>module.exports = { app, requireAuth, requireRole };</code>'],
  ],
  viDu: [['GET /api/me  Authorization: Bearer <valid token of An>', '200 {"id":"u1","role":"user",…}', 'req.user is the verified payload.', 'req.user là payload đã xác minh.'], ['DELETE /api/products/7 with a user token', '403 {"error":"Forbidden"}', 'Authenticated, not authorised.', 'Đã xác thực, chưa được phân quyền.']],
  goiY: [
    ['<code>try { req.user = jwt.verify(token, process.env.JWT_SECRET); return next(); } catch (err) { … }</code>', '<code>try { req.user = jwt.verify(token, process.env.JWT_SECRET); return next(); } catch (err) { … }</code>'],
    ['<code>const requireRole = (role) => (req, res, next) => (req.user && req.user.role === role ? next() : res.status(403).json({ error: \'Forbidden\' }));</code>', '<code>const requireRole = (role) => (req, res, next) => (req.user && req.user.role === role ? next() : res.status(403).json({ error: \'Forbidden\' }));</code>'],
  ],
  loi: [
    ['The lesson\'s <code>header.replace(\'Bearer \', \'\')</code> accepts a bare token or <code>"Token xyz"</code> and sends odd strings to verify — check the scheme explicitly.', '<code>header.replace(\'Bearer \', \'\')</code> của bài nhận cả token trần hay <code>"Token xyz"</code> và đưa chuỗi lạ cho verify — hãy kiểm scheme tường minh.'],
    ['<code>jwt.decode</code> instead of <code>jwt.verify</code>: decode does not check the signature, so a forged payload <code>{"role":"admin"}</code> passes.', '<code>jwt.decode</code> thay vì <code>jwt.verify</code>: decode không kiểm chữ ký, nên payload giả <code>{"role":"admin"}</code> lọt qua.'],
    ['Answering 401 for a wrong role — the client then tries to log in again, which will not help.', 'Trả 401 cho sai role — client lại cố đăng nhập lần nữa, chẳng ích gì.'],
  ],
  gt: [
    '<code>jwt.verify</code> both checks the HMAC signature with the secret and enforces <code>exp</code>, throwing named errors you can map to precise messages. Authentication (who are you? — 401) and authorisation (may you? — 403) are separate middleware, chained on the route that needs them: <code>router.delete(\'/:id\', requireAuth, requireRole(\'admin\'), remove)</code>.',
    '<code>jwt.verify</code> vừa kiểm chữ ký HMAC bằng secret vừa ép <code>exp</code>, ném lỗi có tên để bạn ánh xạ thành thông báo chính xác. Xác thực (bạn là ai? — 401) và phân quyền (bạn có được không? — 403) là hai middleware riêng, nối trên route cần chúng: <code>router.delete(\'/:id\', requireAuth, requireRole(\'admin\'), remove)</code>.',
  ],
  kn: ['requireAuth', 'authorisation', 'jwt.verify'],
  tns: [tn('authentication', 'xác thực', 'bạn là ai'), tn('authorisation', 'phân quyền', 'bạn được làm gì'), tn('Bearer token', 'token mang theo trong header')],
  env: { JWT_SECRET: 'test-jwt-secret' },
  dau: J`const express = require('express');
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  req.user = jwt.decode(token);
  next();
}
function requireRole(role) {
  return (req, res, next) => next();
}

const app = express();
app.get('/api/me', requireAuth, (req, res) => res.json(req.user));
app.delete('/api/products/:id', requireAuth, requireRole('admin'), (req, res) => res.status(204).end());
module.exports = { app, requireAuth, requireRole };
`,
  giai: J`const express = require('express');
const jwt = require('jsonwebtoken');

// authentication: who are you? (401 when we cannot tell)
function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);    // checks the signature AND exp
    return next();
  } catch (err) {
    const error = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ error });
  }
}

// authorisation: may you? (403 when we know you and the answer is no)
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

const app = express();
app.get('/api/me', requireAuth, (req, res) => res.json(req.user));
app.delete('/api/products/:id', requireAuth, requireRole('admin'), (req, res) => res.status(204).end());
module.exports = { app, requireAuth, requireRole };
`,
  chuanBi: `const { app, requireAuth, requireRole } = module.exports; const jwt = require('jsonwebtoken'); const S = 'test-jwt-secret';
const user = jwt.sign({ id: 'u1', role: 'user' }, S, { expiresIn: '1h' }); const admin = jwt.sign({ id: 'a1', role: 'admin' }, S, { expiresIn: '1h' });
const expired = jwt.sign({ id: 'u1', role: 'user', iat: Math.floor(Date.now() / 1000) - 7200 }, S, { expiresIn: '1h' });
const forged = jwt.sign({ id: 'u1', role: 'admin' }, 'attacker-secret');
const go = async (method, url, auth) => { const r = await app.inject({ method, url, headers: auth ? { Authorization: auth } : {} }); return { status: r.status, body: r.body === '' ? null : (r.body && r.body.error) || (r.body && r.body.id) || r.body }; };`,
  cases: [
    { goi: `[await go('GET', '/api/me'), await go('GET', '/api/me', 'Bearer ' + user)]`, moTa: ['No header → 401 Missing token; valid token → 200', 'Không header → 401 Missing token; token hợp lệ → 200'] },
    { goi: `await go('GET', '/api/me', 'Bearer ' + expired)`, moTa: ['Expired token → 401 Token expired', 'Token hết hạn → 401 Token expired'] },
    { goi: `await go('GET', '/api/me', 'Bearer ' + forged)`, moTa: ['Token signed with another secret → 401 Invalid token', 'Token ký bằng secret khác → 401 Invalid token'] },
    { goi: `[await go('DELETE', '/api/products/7', 'Bearer ' + user), await go('DELETE', '/api/products/7', 'Bearer ' + admin)]`, moTa: ['User → 403 Forbidden; admin → 204', 'User → 403 Forbidden; admin → 204'] },
    { goi: `[await go('GET', '/api/me', user), await go('GET', '/api/me', 'Token ' + user), await go('GET', '/api/me', 'Bearer'), await go('GET', '/api/me', 'Bearer abc.def.ghi')]`, an: true },
    { goi: `__pick(await __goi(requireRole('admin'), {}), 'status body next')`, an: true },
    { goi: `(await __goi(requireAuth, { headers: { authorization: 'Bearer ' + admin } })).req.user.role`, an: true },
  ],
});

/* ── 4 ── CORS */
const E4 = bai({
  ten: 'Write the CORS middleware yourself: an allow-list, Vary and preflight', kho: 'MEDIUM', phut: 20, lib: ['express'],
  en: J`<p>Instead of <code>cors()</code>, write <code>corsAllowList(origins)</code> that returns a middleware:</p>
<ul><li>request <code>Origin</code> in the list ⇒ set <code>Access-Control-Allow-Origin: &lt;that origin&gt;</code> and <code>Access-Control-Allow-Credentials: true</code>;</li>
<li>always set <code>Vary: Origin</code> (the answer depends on the Origin header — caches must know);</li>
<li><code>OPTIONS</code> preflight from an allowed origin ⇒ <code>204</code> with <code>Access-Control-Allow-Methods: GET,POST,PUT,DELETE</code> and <code>Access-Control-Allow-Headers: Content-Type,Authorization</code>, and stop;</li>
<li>an origin NOT in the list gets no <code>Access-Control-Allow-*</code> header — but the request is <b>not</b> blocked here (<code>next()</code>): CORS is enforced by the browser, not by the server.</li></ul>`,
  vi: J`<p>Thay vì <code>cors()</code>, viết <code>corsAllowList(origins)</code> trả về một middleware:</p>
<ul><li><code>Origin</code> của request có trong danh sách ⇒ đặt <code>Access-Control-Allow-Origin: &lt;origin đó&gt;</code> và <code>Access-Control-Allow-Credentials: true</code>;</li>
<li>luôn đặt <code>Vary: Origin</code> (câu trả lời phụ thuộc header Origin — cache phải biết);</li>
<li>preflight <code>OPTIONS</code> từ origin được phép ⇒ <code>204</code> với <code>Access-Control-Allow-Methods: GET,POST,PUT,DELETE</code> và <code>Access-Control-Allow-Headers: Content-Type,Authorization</code>, và dừng;</li>
<li>origin KHÔNG có trong danh sách thì không có header <code>Access-Control-Allow-*</code> nào — nhưng request <b>không</b> bị chặn ở đây (<code>next()</code>): CORS do trình duyệt thực thi, không phải server.</li></ul>`,
  yc: [
    ['Never answer <code>*</code> together with credentials — browsers refuse that combination.', 'Không bao giờ trả <code>*</code> kèm credentials — trình duyệt từ chối tổ hợp đó.'],
    ['Compare origins exactly (<code>https://myapp.com</code> ≠ <code>https://myapp.com.evil.io</code>).', 'So origin chính xác (<code>https://myapp.com</code> ≠ <code>https://myapp.com.evil.io</code>).'],
    ['Export <code>module.exports = { app, corsAllowList };</code> (the app uses <code>corsAllowList([\'https://myapp.com\', \'http://localhost:5173\'])</code>).', 'Export <code>module.exports = { app, corsAllowList };</code> (app dùng <code>corsAllowList([\'https://myapp.com\', \'http://localhost:5173\'])</code>).'],
  ],
  viDu: [['GET /api/products  Origin: http://localhost:5173', '200 · Access-Control-Allow-Origin: http://localhost:5173 · Vary: Origin', 'The React dev server may read the response.', 'Server dev React được đọc response.'], ['GET /api/products  Origin: https://evil.example', '200 · no Access-Control-Allow-Origin · Vary: Origin', 'The handler ran; the evil page just cannot read the answer.', 'Handler đã chạy; trang xấu chỉ là không đọc được câu trả lời.']],
  goiY: [
    ['<code>const origin = req.get(\'origin\'); res.vary(\'Origin\'); if (origins.includes(origin)) { res.set(\'Access-Control-Allow-Origin\', origin); … }</code>', '<code>const origin = req.get(\'origin\'); res.vary(\'Origin\'); if (origins.includes(origin)) { res.set(\'Access-Control-Allow-Origin\', origin); … }</code>'],
    ['Preflight: <code>if (req.method === \'OPTIONS\') return res.status(204).end();</code> after setting the two extra headers.', 'Preflight: <code>if (req.method === \'OPTIONS\') return res.status(204).end();</code> sau khi đặt hai header thêm.'],
  ],
  loi: [
    ['Reflecting any origin (<code>res.set(\'Access-Control-Allow-Origin\', req.get(\'origin\'))</code>) with credentials: every website can read your users\' data.', 'Phản chiếu mọi origin (<code>res.set(\'Access-Control-Allow-Origin\', req.get(\'origin\'))</code>) kèm credentials: mọi trang web đọc được dữ liệu người dùng của bạn.'],
    ['<code>origin.includes(\'myapp.com\')</code> — <code>https://myapp.com.evil.io</code> passes.', '<code>origin.includes(\'myapp.com\')</code> — <code>https://myapp.com.evil.io</code> lọt qua.'],
    ['Answering 403 to unknown origins and believing the API is now protected — curl, Postman and server-side code send no Origin at all.', 'Trả 403 cho origin lạ và tin rằng API đã được bảo vệ — curl, Postman và mã phía server không gửi Origin nào cả.'],
  ],
  gt: [
    'CORS relaxes the browser\'s same-origin policy for the origins you list: the server only <b>declares</b> who may read, with <code>Access-Control-Allow-Origin</code>, and the browser enforces it. <code>Vary: Origin</code> stops a cache from serving one origin\'s answer to another. A JSON POST with a token first sends an <code>OPTIONS</code> preflight; answering it with the allowed methods and headers is what lets the real request go out.',
    'CORS nới chính sách cùng nguồn của trình duyệt cho các origin bạn liệt kê: server chỉ <b>tuyên bố</b> ai được đọc, bằng <code>Access-Control-Allow-Origin</code>, còn trình duyệt thực thi. <code>Vary: Origin</code> chặn cache đưa câu trả lời của origin này cho origin khác. Một POST JSON kèm token trước hết gửi preflight <code>OPTIONS</code>; trả lời nó với các phương thức và header được phép là thứ cho request thật đi ra.',
  ],
  kn: ['CORS', 'preflight'],
  tns: [tn('origin', 'nguồn gốc', 'scheme + host + port'), tn('preflight', 'request thăm dò OPTIONS'), tn('Vary', 'header báo cache câu trả lời phụ thuộc header nào')],
  dau: J`const express = require('express');

function corsAllowList(origins) {
  return (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
  };
}

const app = express();
app.use(corsAllowList(['https://myapp.com', 'http://localhost:5173']));
app.get('/api/products', (req, res) => res.json([{ id: 1, name: 'Book' }]));
app.post('/api/products', (req, res) => res.status(201).json({ ok: true }));
module.exports = { app, corsAllowList };
`,
  giai: J`const express = require('express');

function corsAllowList(origins) {
  return (req, res, next) => {
    const origin = req.get('origin');
    res.vary('Origin');                                      // the answer depends on Origin: tell caches
    if (origin && origins.includes(origin)) {                // exact match, never a substring test
      res.set('Access-Control-Allow-Origin', origin);        // echo THIS origin (never * with credentials)
      res.set('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {                        // preflight: say what is allowed, and stop
        res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        return res.status(204).end();
      }
    }
    next();                                                  // not blocked: the BROWSER enforces CORS
  };
}

const app = express();
app.use(corsAllowList(['https://myapp.com', 'http://localhost:5173']));
app.get('/api/products', (req, res) => res.json([{ id: 1, name: 'Book' }]));
app.post('/api/products', (req, res) => res.status(201).json({ ok: true }));
module.exports = { app, corsAllowList };
`,
  chuanBi: `const { app } = module.exports; const go = async (method, origin, extra = {}) => { const r = await app.inject({ method, url: '/api/products', headers: Object.assign(origin ? { Origin: origin } : {}, extra) }); const h = {}; Object.keys(r.headers).sort().forEach((k) => { if (/^access-control|^vary$/.test(k)) h[k] = r.headers[k]; }); return { status: r.status, headers: h }; };`,
  cases: [
    { goi: `await go('GET', 'http://localhost:5173')`, moTa: ['Allowed origin → echoed + credentials + Vary', 'Origin được phép → phản hồi lại + credentials + Vary'] },
    { goi: `await go('GET', 'https://evil.example')`, moTa: ['Unknown origin → no Allow-Origin, but the handler still answers 200', 'Origin lạ → không có Allow-Origin, nhưng handler vẫn trả 200'] },
    { goi: `await go('OPTIONS', 'https://myapp.com', { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' })`, moTa: ['Preflight → 204 with methods and headers', 'Preflight → 204 với methods và headers'] },
    { goi: `[await go('GET', 'https://myapp.com.evil.io'), await go('GET', null)]`, an: true },
    { goi: `await go('OPTIONS', 'https://evil.example', { 'Access-Control-Request-Method': 'POST' })`, an: true },
    { goi: `(await go('POST', 'https://myapp.com')).status`, an: true },
  ],
});

/* ── 5 ── multer */
const E5 = bai({
  ten: 'File upload with Multer: field name, type filter, size limit, clean errors', kho: 'MEDIUM', phut: 20, lib: ['express', 'web'],
  en: J`<p>Users upload an avatar: <code>POST /api/avatar</code>, multipart field <code>avatar</code>. Configure Multer and the route:</p>
<ul><li><code>multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 }, fileFilter })</code> — the filter accepts only <code>image/png</code> and <code>image/jpeg</code>; anything else: <code>cb(Object.assign(new Error('Only PNG or JPEG images'), { status: 415 }))</code>;</li>
<li>route <code>upload.single('avatar')</code> ⇒ no file ⇒ 400 <code>{ error: "avatar file required" }</code>; else 201 <code>{ file: req.file.filename, size: req.file.size, type: req.file.mimetype }</code>;</li>
<li>error handler: <code>MulterError</code> with code <code>LIMIT_FILE_SIZE</code> ⇒ 413 <code>{ error: "File too large (max 1 MB)" }</code>; other MulterErrors (e.g. a wrong field name) ⇒ 400 <code>{ error: err.message }</code>; errors with <code>status</code> ⇒ that status + message; else 500.</li></ul>
<p>The grader sends a file with <code>app.inject({ method: 'POST', url, file: { fieldname, originalname, mimetype, size } })</code>.</p>`,
  vi: J`<p>Người dùng tải ảnh đại diện: <code>POST /api/avatar</code>, field multipart <code>avatar</code>. Cấu hình Multer và route:</p>
<ul><li><code>multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 }, fileFilter })</code> — bộ lọc chỉ nhận <code>image/png</code> và <code>image/jpeg</code>; còn lại: <code>cb(Object.assign(new Error('Only PNG or JPEG images'), { status: 415 }))</code>;</li>
<li>route <code>upload.single('avatar')</code> ⇒ không có tệp ⇒ 400 <code>{ error: "avatar file required" }</code>; còn lại 201 <code>{ file: req.file.filename, size: req.file.size, type: req.file.mimetype }</code>;</li>
<li>error handler: <code>MulterError</code> mã <code>LIMIT_FILE_SIZE</code> ⇒ 413 <code>{ error: "File too large (max 1 MB)" }</code>; MulterError khác (vd sai tên field) ⇒ 400 <code>{ error: err.message }</code>; lỗi có <code>status</code> ⇒ mã đó + thông báo; còn lại 500.</li></ul>
<p>Máy chấm gửi tệp bằng <code>app.inject({ method: 'POST', url, file: { fieldname, originalname, mimetype, size } })</code>.</p>`,
  yc: [
    ['<code>const multer = require(\'multer\');</code> — <code>err instanceof multer.MulterError</code> identifies Multer\'s own errors.', '<code>const multer = require(\'multer\');</code> — <code>err instanceof multer.MulterError</code> nhận ra lỗi của chính Multer.'],
    ['The stored file name is Multer\'s random name (<code>req.file.filename</code>), never the client\'s <code>originalname</code>.', 'Tên tệp lưu là tên ngẫu nhiên của Multer (<code>req.file.filename</code>), không bao giờ là <code>originalname</code> của client.'],
    ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>'],
  ],
  viDu: [['POST /api/avatar  file avatar: me.png, image/png, 20 KB', '201 {"file":"3f9a…(32 hex)","size":20480,"type":"image/png"}', 'Saved under uploads/ with a random name.', 'Lưu trong uploads/ với tên ngẫu nhiên.'], ['the same with a 5 MB file', '413 {"error":"File too large (max 1 MB)"}', 'limits.fileSize.', 'limits.fileSize.']],
  goiY: [
    ['<code>const fileFilter = (req, file, cb) => (ALLOWED.includes(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error(\'Only PNG or JPEG images\'), { status: 415 })));</code>', '<code>const fileFilter = (req, file, cb) => (ALLOWED.includes(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error(\'Only PNG or JPEG images\'), { status: 415 })));</code>'],
    ['In the error handler test <code>err instanceof multer.MulterError</code> first, then <code>err.code === \'LIMIT_FILE_SIZE\'</code>.', 'Trong error handler kiểm <code>err instanceof multer.MulterError</code> trước, rồi <code>err.code === \'LIMIT_FILE_SIZE\'</code>.'],
  ],
  loi: [
    ['No size limit: one 2 GB upload fills the server disk.', 'Không giới hạn kích thước: một lần tải 2 GB làm đầy đĩa server.'],
    ['Trusting <code>originalname</code> for the stored path — <code>../../app.js</code> or a name with spaces breaks things (lesson 10.3 of the Node course).', 'Tin <code>originalname</code> để làm đường lưu — <code>../../app.js</code> hay tên có khoảng trắng phá hỏng mọi thứ (bài 10.3 khoá Node).'],
    ['No error handler: Multer\'s "File too large" becomes an HTML 500 page.', 'Không có error handler: "File too large" của Multer thành trang HTML 500.'],
  ],
  gt: [
    'Multer parses the multipart body, runs your <code>fileFilter</code> before storing, enforces <code>limits</code> while reading, and puts the result on <code>req.file</code>. Its failures arrive as errors in <code>next(err)</code>, so one error handler maps them to the right status: 413 for size, 415 for type, 400 for a wrong field. Note that <code>mimetype</code> is a CLAIM of the client — real checks look at the bytes (Node course 10.3).',
    'Multer đọc thân multipart, chạy <code>fileFilter</code> của bạn trước khi lưu, ép <code>limits</code> trong lúc đọc, và đặt kết quả vào <code>req.file</code>. Thất bại của nó đến dưới dạng lỗi trong <code>next(err)</code>, nên một error handler ánh xạ chúng sang đúng mã: 413 cho kích thước, 415 cho kiểu, 400 cho sai field. Lưu ý <code>mimetype</code> là LỜI KHAI của client — kiểm thật phải nhìn vào các byte (khoá Node 10.3).',
  ],
  kn: ['Multer', 'file upload', '413/415'],
  tns: [tn('multipart/form-data', 'kiểu thân để gửi tệp'), tn('MIME type', 'kiểu nội dung'), tn('413 Payload Too Large', 'quá lớn')],
  dau: J`const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const app = express();

app.post('/api/avatar', upload.single('file'), (req, res) => {
  res.json({ file: req.file.originalname });
});

module.exports = app;
`,
  giai: J`const express = require('express');
const multer = require('multer');

const ALLOWED = ['image/png', 'image/jpeg'];
const upload = multer({
  dest: 'uploads/',                                   // Multer picks a random file name
  limits: { fileSize: 1024 * 1024 },                  // 1 MB — enforced while reading
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error('Only PNG or JPEG images'), { status: 415 }));
  },
});

const app = express();

app.post('/api/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'avatar file required' });
  res.status(201).json({ file: req.file.filename, size: req.file.size, type: req.file.mimetype });
});

// one place that turns upload failures into clean JSON
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large (max 1 MB)' });
    return res.status(400).json({ error: err.message });       // e.g. "Unexpected field"
  }
  if (err.status) return res.status(err.status).json({ error: err.message });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
`,
  chuanBi: `const up = async (file) => { const r = await module.exports.inject({ method: 'POST', url: '/api/avatar', file }); const b = r.body; return { status: r.status, body: b && b.file ? { file: /^[0-9a-f]{32}$/.test(b.file) ? '<random hex>' : b.file, size: b.size, type: b.type } : b }; };`,
  cases: [
    { goi: `await up({ fieldname: 'avatar', originalname: 'me.png', mimetype: 'image/png', size: 20480 })`, moTa: ['A PNG under 1 MB → 201 with Multer’s random name', 'PNG dưới 1 MB → 201 với tên ngẫu nhiên của Multer'] },
    { goi: `await up({ fieldname: 'avatar', originalname: 'big.jpg', mimetype: 'image/jpeg', size: 5 * 1024 * 1024 })`, moTa: ['Too big → 413', 'Quá lớn → 413'] },
    { goi: `await up({ fieldname: 'avatar', originalname: 'cv.pdf', mimetype: 'application/pdf', size: 1000 })`, moTa: ['Not an image → 415', 'Không phải ảnh → 415'] },
    { goi: `[await up(undefined), await up({ fieldname: 'photo', originalname: 'me.png', mimetype: 'image/png', size: 10 })]`, moTa: ['No file → 400; wrong field → 400 Unexpected field', 'Không có tệp → 400; sai field → 400 Unexpected field'] },
    { goi: `await up({ fieldname: 'avatar', originalname: '../../app.js', mimetype: 'image/jpeg', size: 1024 * 1024 })`, an: true },
    { goi: `(await up({ fieldname: 'avatar', originalname: 'a.png', mimetype: 'image/png', size: 5 }), __disk.list().filter((p) => p.startsWith('/app/uploads/')).length)`, an: true },
  ],
});

/* ── 6 ── download + https redirect */
const E6 = bai({
  ten: 'Downloads without path traversal, and the HTTP → HTTPS redirect', kho: 'HARD', phut: 20, lib: ['express', 'http'],
  en: J`<p>Two pieces from the end of the lesson.</p>
<ol><li><code>GET /download/:name</code> — serve a file from <code>/app/uploads</code> as an attachment: run the name through <code>path.basename</code> (it strips <code>../</code>), build <code>path.join('/app/uploads', safe)</code>, and if the file exists answer with <code>res.download(fullPath, safe)</code>; otherwise <code>404</code> <code>{ error: "File not found" }</code>. A request for <code>..%2F.env</code> must never return <code>/app/.env</code>.</li>
<li><code>redirectToHttps(req, res)</code> — a plain <code>http</code> handler (for <code>http.createServer(redirectToHttps).listen(80)</code>) that answers <code>301</code> with <code>Location: https://&lt;host&gt;&lt;url&gt;</code> (keep the path and the query string).</li></ol>
<p>Use <code>fs.existsSync</code> to check the file. Export <code>module.exports = { app, redirectToHttps };</code></p>`,
  vi: J`<p>Hai mảnh ở cuối bài học.</p>
<ol><li><code>GET /download/:name</code> — phục vụ một tệp trong <code>/app/uploads</code> dạng tệp đính kèm: đưa tên qua <code>path.basename</code> (nó bỏ <code>../</code>), dựng <code>path.join('/app/uploads', safe)</code>, và nếu tệp tồn tại thì trả bằng <code>res.download(fullPath, safe)</code>; không thì <code>404</code> <code>{ error: "File not found" }</code>. Request xin <code>..%2F.env</code> không bao giờ được trả <code>/app/.env</code>.</li>
<li><code>redirectToHttps(req, res)</code> — một handler <code>http</code> thuần (cho <code>http.createServer(redirectToHttps).listen(80)</code>) trả <code>301</code> với <code>Location: https://&lt;host&gt;&lt;url&gt;</code> (giữ đường dẫn và query string).</li></ol>
<p>Dùng <code>fs.existsSync</code> để kiểm tệp. Export <code>module.exports = { app, redirectToHttps };</code></p>`,
  yc: [
    ['Express decodes <code>%2F</code> in <code>req.params.name</code>, so <code>..%2F.env</code> arrives as <code>../.env</code> — basename turns it into <code>.env</code>.', 'Express giải mã <code>%2F</code> trong <code>req.params.name</code>, nên <code>..%2F.env</code> đến dưới dạng <code>../.env</code> — basename biến nó thành <code>.env</code>.'],
    ['<code>res.download</code> sets <code>Content-Disposition: attachment; filename="…"</code>.', '<code>res.download</code> đặt <code>Content-Disposition: attachment; filename="…"</code>.'],
    ['Redirect: <code>res.writeHead(301, { Location: \'https://\' + req.headers.host + req.url }); res.end();</code>', 'Chuyển hướng: <code>res.writeHead(301, { Location: \'https://\' + req.headers.host + req.url }); res.end();</code>'],
  ],
  viDu: [['GET /download/report.pdf', '200  Content-Disposition: attachment; filename="report.pdf"', 'The file is saved, not displayed.', 'Tệp được lưu, không hiển thị.'], ['GET /download/..%2F.env', '404 {"error":"File not found"}', 'basename → ".env", which is not in uploads.', 'basename → ".env", không có trong uploads.']],
  goiY: [
    ['<code>const safe = path.basename(req.params.name); const full = path.join(\'/app/uploads\', safe); if (!fs.existsSync(full)) return res.status(404).json({ … });</code>', '<code>const safe = path.basename(req.params.name); const full = path.join(\'/app/uploads\', safe); if (!fs.existsSync(full)) return res.status(404).json({ … });</code>'],
    ['The redirect handler is the lesson\'s code — make sure it keeps <code>req.url</code> (path + query).', 'Handler chuyển hướng là mã của bài — nhớ giữ <code>req.url</code> (đường + query).'],
  ],
  loi: [
    ['<code>path.join(\'/app/uploads\', req.params.name)</code> without basename: <code>../.env</code> resolves to <code>/app/.env</code> — the database password leaks.', '<code>path.join(\'/app/uploads\', req.params.name)</code> không basename: <code>../.env</code> thành <code>/app/.env</code> — mật khẩu CSDL bị lộ.'],
    ['Redirecting to <code>https://example.com/</code> (a fixed URL): the user loses the page they asked for.', 'Chuyển hướng về <code>https://example.com/</code> (URL cố định): người dùng mất trang họ đã xin.'],
    ['302 instead of 301 for a permanent HTTPS move — browsers keep trying plain HTTP first.', '302 thay vì 301 cho việc chuyển HTTPS vĩnh viễn — trình duyệt cứ thử HTTP trước.'],
  ],
  gt: [
    'Any user input that becomes part of a file path is an attack surface: <code>path.basename</code> keeps only the last segment, so the request can only name files inside the folder you chose. <code>res.download</code> adds <code>Content-Disposition: attachment</code>, the difference between "show it" (<code>express.static</code>) and "save it". The 301 redirect sends plain-HTTP visitors to the encrypted site while preserving their path, so the Authorization header never travels in clear text afterwards.',
    'Mọi dữ liệu người dùng trở thành một phần của đường dẫn tệp đều là bề mặt tấn công: <code>path.basename</code> chỉ giữ đoạn cuối, nên request chỉ gọi được tên tệp trong thư mục bạn chọn. <code>res.download</code> thêm <code>Content-Disposition: attachment</code>, khác biệt giữa "hiển thị" (<code>express.static</code>) và "lưu về". Chuyển hướng 301 đưa khách HTTP thường sang trang mã hoá mà giữ đường dẫn của họ, nên sau đó header Authorization không bao giờ đi dạng chữ rõ.',
  ],
  kn: ['path traversal', 'res.download', 'HTTPS redirect'],
  tns: [tn('path traversal', 'duyệt ngược thư mục', '../ để thoát khỏi thư mục cho phép'), tn('Content-Disposition', 'header báo tải về')],
  dau: J`const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.get('/download/:name', (req, res) => {
  const full = path.join('/app/uploads', req.params.name);
  res.sendFile(full);
});

function redirectToHttps(req, res) {
  res.writeHead(302, { Location: 'https://' + req.headers.host });
  res.end();
}

module.exports = { app, redirectToHttps };
`,
  giai: J`const express = require('express');
const path = require('path');
const fs = require('fs');

const UPLOADS = '/app/uploads';
const app = express();

app.get('/download/:name', (req, res) => {
  const safe = path.basename(req.params.name);          // "../.env" ⇒ ".env": no way out of UPLOADS
  const full = path.join(UPLOADS, safe);
  if (!fs.existsSync(full)) return res.status(404).json({ error: 'File not found' });
  res.download(full, safe);                             // Content-Disposition: attachment ⇒ "save", not "show"
});

// for http.createServer(redirectToHttps).listen(80): every plain-HTTP request goes to HTTPS
function redirectToHttps(req, res) {
  res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });   // keep path + query
  res.end();
}

module.exports = { app, redirectToHttps };
`,
  chuanBi: `__disk.put('/app/uploads/report.pdf', '%PDF-1.7 quarterly report'); __disk.put('/app/.env', 'MONGODB_URI=mongodb+srv://admin:Sup3rS3cret@db/shop'); const { app, redirectToHttps } = module.exports; const http = require('http');
const dl = async (url) => { const r = await app.inject({ url }); return { status: r.status, disposition: r.headers['content-disposition'] || null, body: r.body }; };
const redir = async (url, host = 'shop.example.com') => { const r = await http.createServer(redirectToHttps).inject({ url, headers: { host } }); return { status: r.status, location: r.headers.location }; };`,
  cases: [
    { goi: `await dl('/download/report.pdf')`, moTa: ['An existing file → attachment', 'Tệp có sẵn → tệp đính kèm'] },
    { goi: `await dl('/download/..%2F.env')`, moTa: ['..%2F.env → 404, the .env never leaks', '..%2F.env → 404, .env không bao giờ lộ'] },
    { goi: `await dl('/download/nope.txt')`, moTa: ['Missing file → 404 JSON', 'Thiếu tệp → 404 JSON'] },
    { goi: `await redir('/cart?step=2')`, moTa: ['Redirect → 301 to https with path + query', 'Chuyển hướng → 301 sang https kèm đường + query'] },
    { goi: `[await dl('/download/..%2F..%2Fapp%2F.env'), await dl('/download/%2Fapp%2F.env')]`, an: true },
    { goi: `await redir('/', 'localhost:8080')`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-5-2-jwt-cors',
  ten: '5.2 JWT, HTTPS, CORS & file upload/download',
  khoa: KHOA,
  baiHoc: 'sdn302-5-2-jwt-cors',
  de: [E1, E2, E3, E4, E5, E6],
});
