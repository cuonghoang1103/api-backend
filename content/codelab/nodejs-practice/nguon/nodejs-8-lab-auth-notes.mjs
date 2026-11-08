/** Node.js · Lab Chương 8 — Notes API có tài khoản: tầng nào từ chối với mã nào, ứng dụng xác thực đầy đủ (đăng ký, đăng nhập hằng thời gian + chặn dò, refresh xoay vòng, đăng xuất mọi nơi, ghi chú theo chủ), và soát lỗ hổng. */
import { modul, cs, q, bang1, tn, jsBai, TRO_GIUP } from './_node-c6-8.mjs';

/* ── Lab 8 · 1 — Tầng nào từ chối, mã nào ── */
const LAYER = ['csrfGuard', 'loginLimit', 'requireAuth', 'requireRole', 'service (canTouch / version)'];
const CODE = ['401', '403', '404', '409', '429'];
const L1 = cs({
  ten: 'Lab 8 · 1 — Which layer says no, and with which status?', kho: 'MEDIUM', phut: 10, dangBai: 'lab', loai: 'table',
  en: 'The finished Notes API has five guards in front of the data. For each request, say which layer refuses it first and with which status code — the client’s next move depends on exactly that pair.',
  vi: 'Notes API hoàn chỉnh có năm lớp gác trước dữ liệu. Với mỗi request, cho biết tầng nào từ chối trước tiên và với mã trạng thái nào — bước tiếp theo của client phụ thuộc đúng vào cặp đó.',
  bang: [bang1('b1', ['Request → layer → status', 'Request → tầng → mã'], [{ ma: 'r', ten: 'Request' }, { ma: 'l', ten: 'Layer', luaChon: LAYER }, { ma: 's', ten: 'Status', luaChon: CODE }], [
    { o: { r: 'POST /notes auto-submitted by a form on evil.com, with the victim’s cookie' }, a: { l: 'csrfGuard', s: '403' } },
    { o: { r: 'The 6th wrong password for an@vd.com from the same IP within a minute' }, a: { l: 'loginLimit', s: '429' } },
    { o: { r: 'GET /notes with an access token whose exp has passed' }, a: { l: 'requireAuth', s: '401' } },
    { o: { r: 'Binh, logged in, sends GET /notes/1 (An’s note)' }, a: { l: 'service (canTouch / version)', s: '404' } },
    { o: { r: 'A USER sends DELETE /users/7' }, a: { l: 'requireRole', s: '403' } },
    { o: { r: 'Device 1 uses its token after “log out everywhere” from device 2' }, a: { l: 'requireAuth', s: '401' } },
    { o: { r: 'PATCH /notes/1 with a version someone else already bumped' }, a: { l: 'service (canTouch / version)', s: '409' } },
  ], ['CSRF is stopped before anything trusts the cookie (403 CROSS_SITE / CSRF_TOKEN_MISMATCH). The limiter counts before verification (429 + Retry-After). requireAuth answers “who are you?” — expired (refresh once) and revoked (log out) are both 401 with different codes. requireRole answers “may your kind of user do this?” (403). Only the service knows the row: someone else’s private note is 404, a stale version is 409.', 'CSRF bị chặn trước khi có gì tin vào cookie (403 CROSS_SITE / CSRF_TOKEN_MISMATCH). Bộ chặn đếm trước khi kiểm (429 + Retry-After). requireAuth trả lời "bạn là ai?" — hết hạn (làm mới một lần) và bị thu hồi (đăng xuất) đều là 401 với mã khác nhau. requireRole trả lời "loại người dùng của bạn có được làm việc này?" (403). Chỉ service biết dòng dữ liệu: ghi chú riêng của người khác là 404, version cũ là 409.'])],
  goiY: [['Walk the request in order: CSRF, rate limit (login only), authentication, role, then the row.', 'Đi theo request theo thứ tự: CSRF, chặn tần suất (chỉ đăng nhập), xác thực, vai trò, rồi tới dòng dữ liệu.'], ['401 = who are you; 403 = not allowed; 404 = not yours to know about; 409 = the world changed.', '401 = bạn là ai; 403 = không được phép; 404 = bạn không được biết; 409 = thế giới đã đổi.']],
  loi: [['403 for someone else’s private note.', '403 cho ghi chú riêng của người khác.'], ['403 for an expired token — the client logs out instead of refreshing.', '403 cho token hết hạn — client đăng xuất thay vì làm mới.']],
  tns: [tn('defence in depth', 'phòng thủ nhiều lớp')],
  kn: ['authentication', 'authorization', 'CSRF', 'rate limiting'],
});

/* ── Lab 8 · 2 — Ứng dụng xác thực đầy đủ ── */
function createAuthApp({ hashPassword, verifyPassword, DUMMY_HASH, newToken }) {
  const users = [], sessions = [], notes = [], buckets = new Map();
  let familyN = 0;
  const err = (status, code) => ({ status, body: { error: { code } } });
  const h = (t) => hex(sha256(utf8(t)));
  function issue(user, familyId = 'fam-' + (++familyN)) {
    const refreshToken = newToken();
    sessions.push({ userId: user.id, familyId, tokenHash: h(refreshToken), expiresAt: Date.now() + 30 * 86400000, usedAt: null, revokedAt: null });
    return { accessToken: signAccess(user, Date.now()), refreshToken };
  }
  function authenticate(req) {
    const a = req.headers?.authorization || '';
    const token = a.startsWith('Bearer ') ? a.slice(7) : null;
    if (!token) return { fail: err(401, 'NO_TOKEN') };
    const p = parseAccess(token);
    if (!p) return { fail: err(401, 'TOKEN_INVALID') };
    if (Date.now() >= p.exp) return { fail: err(401, 'TOKEN_EXPIRED') };
    const user = users.find((u) => u.id === p.sub);               // look the user up: deletion, roles, revocation are immediate
    if (!user) return { fail: err(401, 'USER_GONE') };
    if (user.tokenVersion !== p.tv) return { fail: err(401, 'TOKEN_REVOKED') };
    return { user };
  }
  const routes = {
    async 'POST /auth/register'(req) {
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 8) return err(422, 'VALIDATION_FAILED');
      const e = email.toLowerCase();
      if (users.some((u) => u.email === e)) return err(409, 'EMAIL_TAKEN');
      const user = { id: users.length + 1, email: e, passwordHash: await hashPassword(password), role: users.length === 0 ? 'ADMIN' : 'USER', tokenVersion: 0 };
      users.push(user);
      return { status: 201, body: { id: user.id, email: user.email } };
    },
    async 'POST /auth/login'(req) {
      const email = String(req.body?.email ?? '').toLowerCase();
      // 1) rate limit by IP + email, counted BEFORE verification
      const key = req.ip + '|' + email, t = Date.now();
      let b = buckets.get(key);
      if (!b || t >= b.start + 60000) { b = { start: t, count: 0 }; buckets.set(key, b); }
      if (++b.count > 5) return err(429, 'RATE_LIMITED');
      // 2) always verify — against a dummy hash for unknown emails — so time and answer carry no information
      const user = users.find((u) => u.email === email);
      const ok = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, String(req.body?.password ?? ''));
      if (!user || !ok) return err(401, 'INVALID_CREDENTIALS');
      return { status: 200, body: issue(user) };                  // a new family per login
    },
    async 'POST /auth/refresh'(req) {
      const s = sessions.find((x) => x.tokenHash === h(String(req.body?.refreshToken ?? '')));
      if (!s) return err(401, 'REFRESH_INVALID');
      if (s.usedAt || s.revokedAt) {                              // reuse = theft: burn the whole family
        for (const x of sessions) if (x.familyId === s.familyId && !x.revokedAt) x.revokedAt = Date.now();
        return err(401, 'REFRESH_REUSE_DETECTED');
      }
      if (s.expiresAt <= Date.now()) return err(401, 'REFRESH_EXPIRED');
      s.usedAt = Date.now();
      return { status: 200, body: issue(users.find((u) => u.id === s.userId), s.familyId) };
    },
    async 'POST /auth/logout-all'(req, user) {
      for (const s of sessions) if (s.userId === user.id && !s.revokedAt) s.revokedAt = Date.now();
      user.tokenVersion++;                                        // every older access token dies on its next request
      return { status: 200, body: { tokenVersion: user.tokenVersion, ...issue(user) } };   // …except the caller's new one
    },
    async 'GET /notes'(req, user) {
      return { status: 200, body: { items: notes.filter((n) => n.authorId === user.id) } };
    },
    async 'POST /notes'(req, user) {
      if (typeof req.body?.title !== 'string' || !req.body.title) return err(422, 'VALIDATION_FAILED');
      const note = { id: notes.length + 1, title: req.body.title, authorId: user.id };   // the owner is the actor, never the body
      notes.push(note);
      return { status: 201, body: note };
    },
    async 'GET /notes/:id'(req, user, id) {
      const note = notes.find((n) => n.id === id);
      if (!note || (note.authorId !== user.id && user.role !== 'ADMIN')) return err(404, 'NOTE_NOT_FOUND');
      return { status: 200, body: note };
    },
  };
  const PUBLIC = ['POST /auth/register', 'POST /auth/login', 'POST /auth/refresh'];
  async function handle(req) {
    const m = /^\/notes\/(\d+)$/.exec(req.path);
    const name = req.method + ' ' + (m ? '/notes/:id' : req.path);
    const route = routes[Object.prototype.hasOwnProperty.call(routes, name) ? name : ''];
    if (!route) return err(404, 'NOT_FOUND');
    if (PUBLIC.includes(name)) return route(req);
    const a = authenticate(req);                                   // everything else requires a signed-in user
    if (a.fail) return a.fail;
    return route(req, a.user, m ? Number(m[1]) : undefined);
  }
  return { handle };
}
const TOKEN_HELPERS = `// provided — a stand-in for jwt.sign / jwt.verify (15-minute access tokens), so the lab is about the flow, not the crypto
function signAccess(user, nowMs) { return 'acc.' + user.id + '.' + user.tokenVersion + '.' + (nowMs + 15 * 60000); }
function parseAccess(token) { const m = /^acc\\.(\\d+)\\.(\\d+)\\.(\\d+)$/.exec(String(token)); return m ? { sub: Number(m[1]), tv: Number(m[2]), exp: Number(m[3]) } : null; }`;
const LAB_FAKES = `let hashes = 0, verifies = 0, tok = 0;
const deps = {
  hashPassword: (pw) => new Promise((ok) => setTimeout(() => { hashes++; ok('h:' + pw); }, 33)),
  verifyPassword: (hash, pw) => new Promise((ok) => setTimeout(() => { verifies++; ok(typeof hash === 'string' && hash === 'h:' + pw); }, 33)),
  DUMMY_HASH: 'h:\\u0000dummy-never-matches',
  newToken: () => 'rt' + (++tok) + '-' + 'z'.repeat(40),
};
const app = createAuthApp(deps);
const H = (method, path, body, token, ip = '203.0.113.7') => app.handle({ method, path, body, ip, headers: token ? { authorization: 'Bearer ' + token } : {} });
const S = (r) => r.status + (r.body && r.body.error ? ' ' + r.body.error.code : '');
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
const setup = async () => { await H('POST', '/auth/register', { email: 'admin@vd.com', password: 'admin-pass-1' }); await H('POST', '/auth/register', { email: 'an@vd.com', password: 'correct horse' }); await H('POST', '/auth/register', { email: 'binh@vd.com', password: 'binh-secret' }); };
const login = async (email, password) => (await H('POST', '/auth/login', { email, password })).body;`;
const L2 = jsBai({
  ten: 'Lab 8 · 2 — Build createAuthApp(): register, login, refresh, log out everywhere, and notes that belong to someone', kho: 'HARD', phut: 60, diem: 50, dangBai: 'lab',
  en: `<p>The whole chapter as one in-memory app. <code>createAuthApp({ hashPassword, verifyPassword, DUMMY_HASH, newToken })</code> returns <code>{ handle(req) }</code>, <code>req = { method, path, body?, ip, headers }</code>, result <code>{ status, body }</code>; every error body is <code>{ error: { code } }</code>. Hashing is async (33 virtual ms). <code>helpers.js</code>: <code>sha256</code>, <code>hex</code>, <code>utf8</code>, and a stand-in for JWT — <code>signAccess(user, nowMs)</code> (valid 15 min, carries <code>tv</code>) and <code>parseAccess(token)</code> ⇒ <code>{ sub, tv, exp }</code> or <code>null</code>. Use <code>Date.now()</code> for time.</p>
<ul>
<li><b>POST /auth/register</b> <code>{ email, password }</code> — email with <code>@</code>, password ≥ 8 chars, else 422 <code>VALIDATION_FAILED</code>; lower-case the email; taken ⇒ 409 <code>EMAIL_TAKEN</code>; store <code>await hashPassword(password)</code>, role <code>ADMIN</code> for the very first user and <code>USER</code> after, <code>tokenVersion: 0</code>; 201 <code>{ id, email }</code> (ids from 1).</li>
<li><b>POST /auth/login</b> — limit per <code>ip + "|" + lower-cased email</code>: a 60 s window from the first attempt, attempt 6+ ⇒ 429 <code>RATE_LIMITED</code> <i>before</i> verifying. Always <code>await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password)</code>; failure ⇒ 401 <code>INVALID_CREDENTIALS</code>; success ⇒ 200 <code>{ accessToken, refreshToken }</code> in a <b>new family</b>.</li>
<li><b>Refresh tokens</b>: <code>newToken()</code>, stored only as <code>hex(sha256(utf8(token)))</code>, 30 days. <b>POST /auth/refresh</b> <code>{ refreshToken }</code> — unknown ⇒ 401 <code>REFRESH_INVALID</code>; used or revoked ⇒ revoke the family, 401 <code>REFRESH_REUSE_DETECTED</code>; expired ⇒ 401 <code>REFRESH_EXPIRED</code>; else mark used and 200 with a new pair in the <b>same</b> family.</li>
<li><b>Every other route requires</b> <code>Authorization: Bearer &lt;access&gt;</code>: none ⇒ 401 <code>NO_TOKEN</code>; <code>parseAccess</code> null ⇒ <code>TOKEN_INVALID</code>; <code>Date.now() &gt;= exp</code> ⇒ <code>TOKEN_EXPIRED</code>; no such user ⇒ <code>USER_GONE</code>; <code>tv</code> ≠ the user’s <code>tokenVersion</code> ⇒ <code>TOKEN_REVOKED</code>.</li>
<li><b>POST /auth/logout-all</b> — revoke all the user’s refresh sessions, <code>tokenVersion + 1</code>, 200 <code>{ tokenVersion, accessToken, refreshToken }</code> (a fresh pair for the caller, new family).</li>
<li><b>GET /notes</b> ⇒ 200 <code>{ items }</code> — only the caller’s notes. <b>POST /notes</b> <code>{ title }</code> (non-empty string, else 422) ⇒ 201 <code>{ id, title, authorId }</code>, owner = the caller. <b>GET /notes/:id</b> ⇒ the note if the caller owns it or is ADMIN, else 404 <code>NOTE_NOT_FOUND</code>.</li>
<li>Anything else ⇒ 404 <code>NOT_FOUND</code>.</li></ul>`,
  vi: `<p>Cả chương thành một ứng dụng trong bộ nhớ. <code>createAuthApp({ hashPassword, verifyPassword, DUMMY_HASH, newToken })</code> trả <code>{ handle(req) }</code>, <code>req = { method, path, body?, ip, headers }</code>, kết quả <code>{ status, body }</code>; mọi body lỗi là <code>{ error: { code } }</code>. Băm là bất đồng bộ (33 ms ảo). <code>helpers.js</code>: <code>sha256</code>, <code>hex</code>, <code>utf8</code>, và bản thay thế JWT — <code>signAccess(user, nowMs)</code> (hiệu lực 15 phút, mang <code>tv</code>) và <code>parseAccess(token)</code> ⇒ <code>{ sub, tv, exp }</code> hoặc <code>null</code>. Dùng <code>Date.now()</code> cho thời gian.</p>
<ul>
<li><b>POST /auth/register</b> <code>{ email, password }</code> — email có <code>@</code>, mật khẩu ≥ 8 ký tự, không thì 422 <code>VALIDATION_FAILED</code>; email chữ thường; đã có ⇒ 409 <code>EMAIL_TAKEN</code>; lưu <code>await hashPassword(password)</code>, vai trò <code>ADMIN</code> cho người đầu tiên và <code>USER</code> sau đó, <code>tokenVersion: 0</code>; 201 <code>{ id, email }</code> (id từ 1).</li>
<li><b>POST /auth/login</b> — giới hạn theo <code>ip + "|" + email chữ thường</code>: cửa sổ 60 s từ lần thử đầu, lần thứ 6 trở đi ⇒ 429 <code>RATE_LIMITED</code> <i>trước khi</i> kiểm. Luôn <code>await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password)</code>; hỏng ⇒ 401 <code>INVALID_CREDENTIALS</code>; thành công ⇒ 200 <code>{ accessToken, refreshToken }</code> trong một <b>họ mới</b>.</li>
<li><b>Refresh token</b>: <code>newToken()</code>, chỉ lưu dạng <code>hex(sha256(utf8(token)))</code>, 30 ngày. <b>POST /auth/refresh</b> <code>{ refreshToken }</code> — lạ ⇒ 401 <code>REFRESH_INVALID</code>; đã dùng hoặc bị thu hồi ⇒ thu hồi cả họ, 401 <code>REFRESH_REUSE_DETECTED</code>; hết hạn ⇒ 401 <code>REFRESH_EXPIRED</code>; còn lại đánh dấu đã dùng và 200 với cặp mới trong <b>cùng</b> họ.</li>
<li><b>Mọi route khác đều cần</b> <code>Authorization: Bearer &lt;access&gt;</code>: không có ⇒ 401 <code>NO_TOKEN</code>; <code>parseAccess</code> null ⇒ <code>TOKEN_INVALID</code>; <code>Date.now() &gt;= exp</code> ⇒ <code>TOKEN_EXPIRED</code>; không có user ⇒ <code>USER_GONE</code>; <code>tv</code> ≠ <code>tokenVersion</code> của user ⇒ <code>TOKEN_REVOKED</code>.</li>
<li><b>POST /auth/logout-all</b> — thu hồi mọi phiên refresh của user, <code>tokenVersion + 1</code>, 200 <code>{ tokenVersion, accessToken, refreshToken }</code> (cặp mới cho người gọi, họ mới).</li>
<li><b>GET /notes</b> ⇒ 200 <code>{ items }</code> — chỉ ghi chú của người gọi. <b>POST /notes</b> <code>{ title }</code> (chuỗi không rỗng, không thì 422) ⇒ 201 <code>{ id, title, authorId }</code>, chủ = người gọi. <b>GET /notes/:id</b> ⇒ ghi chú nếu người gọi là chủ hoặc ADMIN, không thì 404 <code>NOTE_NOT_FOUND</code>.</li>
<li>Còn lại ⇒ 404 <code>NOT_FOUND</code>.</li></ul>`,
  yc: [['8.1 (DUMMY_HASH), 8.2 (refresh rotation, reuse), 8.3 (requireAuth, tokenVersion, canTouch, 404), 8.4 (logout-all, rate limit) — together.', '8.1 (DUMMY_HASH), 8.2 (xoay vòng refresh, dùng lại), 8.3 (requireAuth, tokenVersion, canTouch, 404), 8.4 (đăng xuất mọi nơi, chặn tần suất) — cùng nhau.'], ['Authenticate every route that is not one of the three public auth routes.', 'Xác thực mọi route không thuộc ba route xác thực công khai.']],
  goiY: [['Structure: a table <code>routes["METHOD /path"]</code>, a list of PUBLIC route names, and one <code>authenticate(req)</code> that returns <code>{ user }</code> or <code>{ fail }</code> — protect by default.', 'Cấu trúc: một bảng <code>routes["METHOD /path"]</code>, danh sách tên route PUBLIC, và một <code>authenticate(req)</code> trả <code>{ user }</code> hoặc <code>{ fail }</code> — mặc định là bảo vệ.'], ['<code>issue(user, familyId = newFamily())</code> is shared by login (new family), refresh (same family) and logout-all (new family).', '<code>issue(user, familyId = họMới())</code> dùng chung cho login (họ mới), refresh (cùng họ) và logout-all (họ mới).'], ['Reuse your solutions: 8.1 · 5 (login), 8.2 · 4 (refresh), 8.3 · 3 and 8.3 · 5, 8.4 · 4 and 8.4 · 5.', 'Dùng lại lời giải: 8.1 · 5 (login), 8.2 · 4 (refresh), 8.3 · 3 và 8.3 · 5, 8.4 · 4 và 8.4 · 5.']],
  loi: [['Listing the routes that NEED auth instead of the ones that do not: a new route ships open.', 'Liệt kê route CẦN xác thực thay vì route KHÔNG cần: route mới ra mắt trong trạng thái mở.'], ['Returning early for unknown emails at login — the timing check in the hidden tests catches it.', 'Return sớm với email lạ khi đăng nhập — kiểm thời gian trong các kiểm ẩn bắt được.'], ['Forgetting the caller’s new pair after logout-all, or bumping tokenVersion without revoking the refresh sessions.', 'Quên cặp mới cho người gọi sau logout-all, hoặc tăng tokenVersion mà không thu hồi phiên refresh.']],
  gt: ['Each guard answers one question and owns one status: the limiter (429) protects the expensive, guessable endpoint; the dummy hash makes failures indistinguishable; refresh rotation turns a stolen token into a detectable event; requireAuth with a lookup makes deletion and revocation immediate; the service’s ownership rule turns someone else’s note into a 404. Protecting by default — a short PUBLIC list — is what makes a forgotten line fail closed.', 'Mỗi lớp gác trả lời một câu hỏi và giữ một mã trạng thái: bộ chặn (429) bảo vệ endpoint đắt và đoán được; hash giả làm các thất bại không phân biệt được; xoay vòng refresh biến token bị trộm thành sự kiện phát hiện được; requireAuth có tra cứu làm việc xoá và thu hồi có hiệu lực ngay; luật sở hữu của service biến ghi chú của người khác thành 404. Bảo vệ mặc định — một danh sách PUBLIC ngắn — là thứ khiến một dòng bị quên trở thành hỏng-thì-đóng.'],
  kn: ['authentication', 'authorization', 'refresh tokens', 'rate limiting'],
  tns: [tn('protect by default', 'bảo vệ mặc định'), tn('session family', 'họ phiên')],
  tro: TRO_GIUP + '\n' + TOKEN_HELPERS + '\n',
  dau: `function createAuthApp({ hashPassword, verifyPassword, DUMMY_HASH, newToken }) {
  const users = [], notes = [];
  // Write your solution here — start with register and login, then requireAuth, then refresh and logout-all
  async function handle(req) {
    if (req.method === 'POST' && req.path === '/auth/register') {
      const user = { id: users.length + 1, email: req.body.email, passwordHash: await hashPassword(req.body.password), role: 'USER', tokenVersion: 0 };
      users.push(user);
      return { status: 201, body: { id: user.id, email: user.email } };
    }
    if (req.method === 'POST' && req.path === '/auth/login') {
      const user = users.find((u) => u.email === req.body.email);
      if (!user) return { status: 401, body: { error: { code: 'NO_SUCH_USER' } } };
      if (!await verifyPassword(user.passwordHash, req.body.password)) return { status: 401, body: { error: { code: 'INVALID_CREDENTIALS' } } };
      return { status: 200, body: { accessToken: signAccess(user, Date.now()), refreshToken: newToken() } };
    }
    if (req.method === 'GET' && req.path === '/notes') return { status: 200, body: { items: notes } };
    return { status: 404, body: { error: { code: 'NOT_FOUND' } } };
  }
  return { handle };
}
`,
  giai: createAuthApp,
  chung: LAB_FAKES,
  timeoutMs: 3600000,
  cases: [
    { goi: `await (async () => { const a = await H('POST', '/auth/register', { email: 'An@VD.com', password: 'correct horse' }); const b = await H('POST', '/auth/register', { email: 'an@vd.com', password: 'other password' }); const c = await H('POST', '/auth/register', { email: 'bad', password: '123' }); return [a, S(b), S(c), hashes]; })()`, moTa: ['Register: 201, 409 (case-insensitive), 422', 'Đăng ký: 201, 409 (không phân biệt hoa thường), 422'] },
    { goi: `await (async () => { await setup(); const t = await login('an@vd.com', 'correct horse'); const mine = await H('POST', '/notes', { title: 'Ghi chu cua An', authorId: 3 }, t.accessToken); const list = await H('GET', '/notes', null, t.accessToken); return [mine, list.body, S(await H('GET', '/notes'))]; })()`, moTa: ['Login, create a note (owner = caller), list, no token ⇒ 401', 'Đăng nhập, tạo ghi chú (chủ = người gọi), liệt kê, không token ⇒ 401'] },
    { goi: `await (async () => { await setup(); const an = await login('an@vd.com', 'correct horse'); const binh = await login('binh@vd.com', 'binh-secret'); const admin = await login('admin@vd.com', 'admin-pass-1'); await H('POST', '/notes', { title: 'An private' }, an.accessToken); return [S(await H('GET', '/notes/1', null, binh.accessToken)), (await H('GET', '/notes', null, binh.accessToken)).body, (await H('GET', '/notes/1', null, admin.accessToken)).status]; })()`, moTa: ['IDOR: Binh gets 404 for An’s note, the admin gets it', 'IDOR: Bình nhận 404 với ghi chú của An, admin đọc được'] },
    { goi: `await (async () => { await setup(); const t = await login('an@vd.com', 'correct horse'); const r1 = await H('POST', '/auth/refresh', { refreshToken: t.refreshToken }); const thief = await H('POST', '/auth/refresh', { refreshToken: t.refreshToken }); const victim = await H('POST', '/auth/refresh', { refreshToken: r1.body.refreshToken }); return [r1.status, r1.body.refreshToken !== t.refreshToken, S(thief), S(victim)]; })()`, moTa: ['Refresh rotates; reuse burns the family', 'Refresh xoay vòng; dùng lại đốt cả họ'] },
    { goi: `await (async () => { await setup(); const d1 = await login('an@vd.com', 'correct horse'); const d2 = await login('an@vd.com', 'correct horse'); const out = await H('POST', '/auth/logout-all', null, d2.accessToken); return [out.body.tokenVersion, S(await H('GET', '/notes', null, d1.accessToken)), S(await H('GET', '/notes', null, d2.accessToken)), (await H('GET', '/notes', null, out.body.accessToken)).status, S(await H('POST', '/auth/refresh', { refreshToken: d1.refreshToken }))]; })()`, an: true, moTa: ['Log out everywhere: old tokens TOKEN_REVOKED, the caller stays in, old refresh refused', 'Đăng xuất mọi nơi: token cũ TOKEN_REVOKED, người gọi ở lại, refresh cũ bị từ chối'] },
    { goi: `await (async () => { await setup(); const t0 = Date.now(); const a = await H('POST', '/auth/login', { email: 'an@vd.com', password: 'nope' }); const t1 = Date.now(); const b = await H('POST', '/auth/login', { email: 'ghost@vd.com', password: 'nope' }); const t2 = Date.now(); return [S(a), S(b), t1 - t0 === t2 - t1, verifies]; })()`, an: true, moTa: ['Unknown email: same answer, same time', 'Email lạ: cùng câu trả lời, cùng thời gian'] },
    { goi: `await (async () => { await setup(); const r = []; for (let i = 0; i < 6; i++) r.push(S(await H('POST', '/auth/login', { email: 'AN@vd.com', password: 'guess' + i }))); r.push(S(await H('POST', '/auth/login', { email: 'an@vd.com', password: 'correct horse' }))); r.push(S(await H('POST', '/auth/login', { email: 'binh@vd.com', password: 'binh-secret' }))); r.push(S(await H('POST', '/auth/login', { email: 'an@vd.com', password: 'correct horse' }, null, '198.51.100.2'))); await wait(60000); r.push(S(await H('POST', '/auth/login', { email: 'an@vd.com', password: 'correct horse' }))); return [r, verifies]; })()`, an: true, moTa: ['Rate limit: 5 attempts, then 429 even for the right password; other email / other IP allowed; window expires', 'Chặn tần suất: 5 lần, rồi 429 kể cả mật khẩu đúng; email khác / IP khác được; cửa sổ tự hết'] },
    { goi: `await (async () => { await setup(); const t = await login('an@vd.com', 'correct horse'); await wait(15 * 60000); return [S(await H('GET', '/notes', null, t.accessToken)), S(await H('GET', '/notes', null, 'garbage')), S(await H('GET', '/notes', null, 'acc.99.0.' + (Date.now() + 1000))), S(await H('DELETE', '/notes/1', null, t.accessToken)), (await H('POST', '/auth/refresh', { refreshToken: t.refreshToken })).status]; })()`, an: true, moTa: ['After 15 min: TOKEN_EXPIRED, then refresh works; garbage, deleted user, unknown route', 'Sau 15 phút: TOKEN_EXPIRED, rồi refresh chạy; rác, user không tồn tại, route lạ'] },
  ],
  saiMau: [
    createAuthApp.toString().replace("const ok = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, String(req.body?.password ?? ''));\n      if (!user || !ok)", "if (!user) return err(401, 'INVALID_CREDENTIALS');\n      const ok = await verifyPassword(user.passwordHash, String(req.body?.password ?? ''));\n      if (!ok)"),
    createAuthApp.toString().replace("return { status: 200, body: { tokenVersion: user.tokenVersion, ...issue(user) } };", 'return { status: 200, body: { tokenVersion: user.tokenVersion } };'),
    createAuthApp.toString().replace("if (!note || (note.authorId !== user.id && user.role !== 'ADMIN')) return err(404, 'NOTE_NOT_FOUND');", "if (!note) return err(404, 'NOTE_NOT_FOUND');"),
  ],
});

/* ── Lab 8 · 3 — Soát lỗ hổng ── */
const L3 = cs({
  ten: 'Lab 8 · 3 — Security review: one line, one hole', kho: 'MEDIUM', phut: 10, dangBai: 'lab',
  en: 'Each snippet below comes from a real-looking pull request against the lab app. Each one compiles, passes the happy-path tests, and opens exactly one hole that chapter 8 measured. Name it.',
  vi: 'Mỗi đoạn dưới đây lấy từ một pull request trông rất thật vào app của lab. Đoạn nào cũng biên dịch được, qua test đường suôn sẻ, và mở đúng một lỗ hổng mà chương 8 đã đo. Gọi tên nó.',
  cau: [
    q('c1', ['<code>const payload = jwt.decode(readToken(req)); req.user = await findUser(payload.sub);</code>', '<code>const payload = jwt.decode(readToken(req)); req.user = await findUser(payload.sub);</code>'],
      ['No authentication: decode never checks the signature', 'A slow login, because decode is expensive to run', 'An expired token is accepted for a few more seconds', 'Nothing, because findUser still checks the account'],
      ['8.2: decode ≠ verify. Grep for it.', '8.2: decode ≠ verify. Hãy grep nó.']),
    q('c2', ['<code>app.set("trust proxy", true)</code> in front of the login limiter.', '<code>app.set("trust proxy", true)</code> đặt trước bộ chặn đăng nhập.'],
      ['req.ip becomes the leftmost X-Forwarded-For entry, which the client writes — a fresh fake IP per request and the limit evaporates', 'Every request appears to come from the proxy, so one bucket for the whole internet', 'Cookies stop being Secure', 'Nothing — trust proxy only affects logging'],
      ['8.4: set the exact number of proxies and take the entry your own proxy appended.', '8.4: đặt đúng số proxy và lấy mục do proxy của bạn nối vào.']),
    q('c3', ['<code>const hash = bcrypt.hashSync(password, 12);</code> inside the register handler.', '<code>const hash = bcrypt.hashSync(password, 12);</code> trong handler đăng ký.'],
      ['It blocks the event loop ~324 ms per call', 'The salt is reused between users', 'bcrypt cost 12 is too weak', 'The hash cannot be verified later'],
      ['8.1: the async API runs on the thread pool; hashSync froze the process 2959 ms.', '8.1: API bất đồng bộ chạy trên thread pool; hashSync làm đơ tiến trình 2959 ms.']),
    q('c4', ['<code>req.user = { id: Number(payload.sub), role: payload.role }</code> — no database lookup, “for performance”.', '<code>req.user = { id: Number(payload.sub), role: payload.role }</code> — không tra CSDL, "cho nhanh".'],
      ['A demoted admin stays admin and revocation waits for expiry', 'Access tokens can no longer be refreshed by the client', 'Every request after the first one becomes a 403', 'CSRF protection is quietly disabled for the router'],
      ['8.3: one millisecond buys immediate deletion, role changes and revocation.', '8.3: một mili giây mua được việc xoá, đổi vai trò và thu hồi có hiệu lực ngay.']),
    q('c5', ['<code>res.cookie("access_token", token, { httpOnly: true, sameSite: "none" })</code>', '<code>res.cookie("access_token", token, { httpOnly: true, sameSite: "none" })</code>'],
      ['SameSite=None without Secure is rejected by browsers', 'HttpOnly lets JavaScript read the token', 'The cookie expires immediately', 'None is the same as Lax'],
      ['8.4: SameSite=Lax on every auth cookie, then an Origin check, then double-submit for anything irreversible.', '8.4: SameSite=Lax cho mọi cookie xác thực, rồi kiểm Origin, rồi double-submit cho mọi thứ không đảo ngược được.']),
  ],
  goiY: [['For each snippet ask: what can an attacker (or a fired employee) now do that they could not before?', 'Với mỗi đoạn, hỏi: kẻ tấn công (hoặc nhân viên đã nghỉ) giờ làm được gì mà trước đó không làm được?'], ['Every answer is a measurement from lessons 8.1–8.4.', 'Mọi câu trả lời là một phép đo trong bài 8.1–8.4.']],
  loi: [['Approving because the tests pass — every snippet passes the happy path.', 'Duyệt vì test qua — đoạn nào cũng qua đường suôn sẻ.'], ['Treating performance shortcuts in the auth path as harmless.', 'Coi các lối tắt hiệu năng trong đường xác thực là vô hại.']],
  tns: [tn('security review', 'soát an ninh')],
  kn: ['security review'],
});

export default modul('nodejs-8-lab-auth-notes', 'Lab 8 — Accounts for the Notes API: from password to private note', [L1, L2, L3], 'nodejs-8-4-cookie-csrf-thu-hoi');
