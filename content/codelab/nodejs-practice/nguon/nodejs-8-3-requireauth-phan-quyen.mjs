/** Node.js 8.3 — requireAuth với sáu lời từ chối, tra user mỗi request (tokenVersion), thứ tự gắn middleware, requireRole/permission, actor là tham số đầu, một canTouch, 404 thay vì 403, chặn IDOR và mass assignment. */
import { modul, cs, q, tn, jsBai, goi, RES, APP_ERROR } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '8.3 · 1 — Who are you, may you, and is it yours?', kho: 'EASY', phut: 8,
  en: 'Three layers, three questions, three status codes. Six situations from lesson 8.3.',
  vi: 'Ba tầng, ba câu hỏi, ba mã trạng thái. Sáu tình huống của bài 8.3.',
  cau: [
    q('c1', ['An expired access token is answered with 403. What does the frontend do?', 'Access token hết hạn được trả 403. Frontend sẽ làm gì?'],
      ['Logs the user out (or shows “forbidden”) instead of refreshing', 'Refreshes the token, as intended', 'Retries the same request until it works', 'Nothing, 403 and 401 are handled the same'],
      ['And the reverse — 401 for a permission problem — makes the client refresh forever against a wall.', 'Và ngược lại — 401 cho vấn đề phân quyền — khiến client làm mới mãi vào một bức tường.']),
    q('c2', ['requireAuth queries the User row on every request (1.010 ms vs 0.029 ms for verify only). What does that millisecond buy?', 'requireAuth truy vấn dòng User ở mọi request (1,010 ms so với 0,029 ms nếu chỉ verify). Mili giây đó mua được gì?'],
      ['Deletion, role changes and revocation take effect at once', 'Nothing useful; the lookup is only there for logging', 'It makes the JWT signature harder to forge offline', 'It refreshes the access token automatically when needed'],
      ['The useful question is not “stateless or not” but “how stale may an authorisation decision be?” — for roles and account status: not at all.', 'Câu hỏi hữu ích không phải "không trạng thái hay không" mà là "quyết định phân quyền được cũ tới mức nào?" — với vai trò và trạng thái tài khoản: không chút nào.']),
    q('c3', ['<code>router.use(requireAuth)</code> is the LAST line of the notes router. Which routes are protected?', '<code>router.use(requireAuth)</code> là dòng CUỐI của router notes. Route nào được bảo vệ?'],
      ['None of the ones declared above it', 'All of them, because use() applies to the whole router', 'Only GET routes', 'Only routes with a :id parameter'],
      ['Protect at the top, let routes opt out: forgetting then fails closed (a locked door), not open.', 'Bảo vệ ở đầu, để route chủ động mở ra: quên thì cửa khoá, không phải cửa mở.']),
    q('c4', ['<code>router.delete("/users/:id", requireRole("ADMIN"), requireAuth, handler)</code>. What happens?', '<code>router.delete("/users/:id", requireRole("ADMIN"), requireAuth, handler)</code>. Chuyện gì xảy ra?'],
      ['Every request is 403, the admin’s too', 'It works; order of middleware does not matter', 'Only non-admins are blocked', 'Express throws at startup'],
      ['Authenticate first, authorise second — in exactly that order. The message sends you hunting in the wrong place.', 'Xác thực trước, phân quyền sau — đúng thứ tự đó. Thông điệp lỗi khiến bạn đi tìm sai chỗ.']),
    q('c5', ['Binh (valid token) requests GET /notes/1, which belongs to An. The lesson answers 404, not 403. Why?', 'Bình (token hợp lệ) gọi GET /notes/1, ghi chú của An. Bài trả 404, không phải 403. Vì sao?'],
      ['403 confirms the note exists; 404 looks like it never existed', '404 is cheaper to compute than 403 for a busy server', 'Express cannot send a 403 status from inside a service', 'A 403 would make the frontend log Binh out at once'],
      ['Use 403 when the user already knows the resource exists (a workspace they can see but not edit).', 'Dùng 403 khi người dùng đã biết tài nguyên tồn tại (không gian làm việc họ thấy được mà không sửa được).']),
    q('c6', ['Why is <code>actor</code> the FIRST parameter of every service function?', 'Vì sao <code>actor</code> là tham số ĐẦU TIÊN của mọi hàm service?'],
      ['You cannot call the function without answering “on whose behalf?”', 'For performance', 'Because Express passes it first', 'So that the route can skip requireAuth'],
      ['The alternative — reading a global “current user” — is exactly how IDOR holes appear.', 'Cách khác — đọc "người dùng hiện tại" toàn cục — chính là cách lỗ IDOR xuất hiện.']),
  ],
  goiY: [['401 = who are you, 403 = are you allowed, 404 (from the service) = is it yours.', '401 = bạn là ai, 403 = bạn có được phép, 404 (từ service) = nó có phải của bạn.'], ['Middleware runs in declaration order.', 'Middleware chạy theo thứ tự khai báo.']],
  loi: [['Mounting requireAuth after the routes.', 'Gắn requireAuth sau các route.'], ['403 for someone else’s private note.', '403 cho ghi chú riêng của người khác.']],
  tns: [tn('authentication', 'xác thực', '401.'), tn('authorization', 'phân quyền', '403.'), tn('IDOR', 'IDOR', 'Tham chiếu trực tiếp đối tượng không an toàn: đổi số trong URL.')],
  kn: ['authorization', 'Express middleware'],
});

/* ── 2. readToken ── */
function readToken(req) {
  const h = req.get('authorization');
  // header first: mobile apps and server-to-server callers have no cookie jar
  if (typeof h === 'string' && h.startsWith('Bearer ') && h.slice(7).trim()) return h.slice(7).trim();
  // cookie as the fallback: a browser app is safer with an HttpOnly cookie (lesson 8.4)
  return req.cookies?.access_token || null;
}
const E2 = jsBai({
  ten: '8.3 · 2 — Write readToken(req): Bearer header first, HttpOnly cookie as the fallback', kho: 'EASY', phut: 8,
  en: `<p>“Header first, cookie as a fallback. Accepting both costs three lines.” Write <code>readToken(req)</code> — <code>req.get(name)</code> reads a header (case-insensitive), <code>req.cookies</code> may be missing:</p>
<ul><li>If <code>Authorization</code> starts with exactly <code>"Bearer "</code> and the rest (trimmed) is not empty ⇒ return the rest, trimmed.</li>
<li>Otherwise ⇒ <code>req.cookies.access_token</code> if it is a non-empty string, else <code>null</code>.</li></ul>
<p>A <code>Basic …</code> header is not a bearer token; an empty <code>"Bearer "</code> must not count as a token.</p>`,
  vi: `<p>"Header trước, cookie làm dự phòng. Nhận cả hai tốn ba dòng." Viết <code>readToken(req)</code> — <code>req.get(name)</code> đọc header (không phân biệt hoa thường), <code>req.cookies</code> có thể không có:</p>
<ul><li>Nếu <code>Authorization</code> bắt đầu đúng bằng <code>"Bearer "</code> và phần còn lại (đã trim) không rỗng ⇒ trả phần còn lại, đã trim.</li>
<li>Không thì ⇒ <code>req.cookies.access_token</code> nếu là chuỗi không rỗng, không nữa thì <code>null</code>.</li></ul>
<p>Header <code>Basic …</code> không phải bearer token; <code>"Bearer "</code> rỗng không được tính là token.</p>`,
  yc: [['Return a string or <code>null</code> — never <code>undefined</code> or <code>""</code>.', 'Trả chuỗi hoặc <code>null</code> — không bao giờ <code>undefined</code> hay <code>""</code>.'], ['Optional chaining for the cookies.', 'Optional chaining cho cookies.']],
  goiY: [['<code>const h = req.get("authorization")</code>; <code>h?.startsWith("Bearer ")</code>.', '<code>const h = req.get("authorization")</code>; <code>h?.startsWith("Bearer ")</code>.'], ['<code>return req.cookies?.access_token || null</code> turns undefined and <code>""</code> into null.', '<code>return req.cookies?.access_token || null</code> biến undefined và <code>""</code> thành null.']],
  loi: [['<code>h.split(" ")[1]</code>: “Basic dXNlcjpwYXNz” becomes a “token”.', '<code>h.split(" ")[1]</code>: "Basic dXNlcjpwYXNz" thành một "token".'], ['Returning <code>""</code> for <code>"Bearer "</code>: downstream code checks <code>=== null</code> and verifies an empty string.', 'Trả <code>""</code> cho <code>"Bearer "</code>: code phía sau kiểm <code>=== null</code> rồi đi verify một chuỗi rỗng.']],
  gt: ['Two transports for one token: a header for callers without a cookie jar, a cookie for browsers (where HttpOnly keeps it away from injected scripts). Normalising “nothing usable” to null gives requireAuth exactly one case to handle: NO_TOKEN.', 'Hai đường vận chuyển cho một token: header cho bên gọi không có hũ cookie, cookie cho trình duyệt (nơi HttpOnly giữ nó tránh xa script bị chèn). Quy mọi "không dùng được" về null cho requireAuth đúng một trường hợp phải xử lý: NO_TOKEN.'],
  kn: ['authentication', 'Express'],
  tns: [tn('Bearer token', 'token mang theo', 'Authorization: Bearer <token>.'), tn('HttpOnly cookie', 'cookie HttpOnly', 'JavaScript không đọc được.')],
  dau: `function readToken(req) {
  // Write your solution here
  return req.get('authorization').split(' ')[1];
}
`,
  giai: readToken,
  chung: RES,
  cases: [
    { goi: `readToken(mkReq({ headers: { Authorization: 'Bearer eyJhbGciOi.abc.def' } }))` },
    { goi: `readToken(mkReq({ cookies: { access_token: 'cookie-token' } }))`, moTa: ['No header ⇒ the cookie', 'Không có header ⇒ cookie'] },
    { goi: `[readToken(mkReq({ headers: { authorization: 'Basic dXNlcjpwYXNz' }, cookies: { access_token: 'c' } })), readToken(mkReq({ headers: { authorization: 'Bearer ' } })), readToken({ get: () => undefined })]`, an: true },
    { goi: `[readToken(mkReq({ headers: { AUTHORIZATION: 'Bearer  spaced  ' }, cookies: { access_token: 'c' } })), readToken(mkReq({ headers: { authorization: 'bearer lower' }, cookies: { access_token: '' } }))]`, an: true },
  ],
});

/* ── 3. requireAuth với sáu lời từ chối ── */
function makeRequireAuth({ verifyAccessToken, findUser }) {
  return async function requireAuth(req, res, next) {
    const token = readToken(req);
    if (!token) return next(new AppError(401, 'NO_TOKEN', 'Missing access token'));
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      // different codes so the client reacts differently: refresh on TOKEN_EXPIRED, log in again otherwise
      const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
      return next(new AppError(401, code, err.message));
    }
    // one database lookup: deletions, role changes and revocation take effect NOW, not in 15 minutes
    const user = await findUser(Number(payload.sub));
    if (!user) return next(new AppError(401, 'USER_GONE', 'Account no longer exists'));
    if (user.tokenVersion !== payload.tv) return next(new AppError(401, 'TOKEN_REVOKED', 'Token has been revoked'));
    req.user = { id: user.id, email: user.email, role: user.role };   // the role comes from the database, not the token
    next();
  };
}
const AUTH_FAKES = RES + `
class JsonWebTokenError extends Error { constructor(m) { super(m); this.name = 'JsonWebTokenError'; } }
class TokenExpiredError extends JsonWebTokenError { constructor(m) { super(m); this.name = 'TokenExpiredError'; } }
// fake verify: tokens look like "ok:<sub>:<tv>:<role>", "expired", "bad-sig", anything else = malformed
const verifyAccessToken = (t) => { if (t === 'expired') throw new TokenExpiredError('jwt expired'); if (t === 'bad-sig') throw new JsonWebTokenError('invalid signature');
  const m = /^ok:(\\d+):(\\d+):(\\w+)$/.exec(t); if (!m) throw new JsonWebTokenError('jwt malformed'); return { sub: m[1], tv: Number(m[2]), role: m[3] }; };
const USERS = [{ id: 1, email: 'an@vd.com', name: 'An', role: 'USER', tokenVersion: 0 }, { id: 2, email: 'binh@vd.com', name: 'Binh', role: 'USER', tokenVersion: 3 }, { id: 9, email: 'admin@vd.com', name: 'Admin', role: 'ADMIN', tokenVersion: 0 }];
let lookups = 0;
const findUser = (id) => new Promise((ok) => setTimeout(() => { lookups++; ok(USERS.find((u) => u.id === id) || null); }, 1));
const run = async (o) => { const req = mkReq(o); const next = mkNext(); await makeRequireAuth({ verifyAccessToken, findUser })(req, mkRes(), next);
  return { next: next.calls.map((e) => (e === undefined ? 'next()' : { status: e.status, code: e.code })), user: req.user ?? null, lookups }; };`;
const E3 = jsBai({
  ten: '8.3 · 3 — Write makeRequireAuth(): six refusals, each with its own code', kho: 'MEDIUM', phut: 20,
  en: `<p>Lesson 8.3’s middleware, with its dependencies injected so the grader can fake them. <code>makeRequireAuth({ verifyAccessToken, findUser })</code> returns <code>async (req, res, next)</code>. <code>readToken</code> (exercise 2) and <code>AppError</code> are in <code>helpers.js</code>.</p>
<ol><li>No token ⇒ <code>next(new AppError(401, 'NO_TOKEN', …))</code>.</li>
<li><code>verifyAccessToken(token)</code> (synchronous, like jwt.verify) throws: <code>err.name === 'TokenExpiredError'</code> ⇒ 401 <code>TOKEN_EXPIRED</code>; anything else ⇒ 401 <code>TOKEN_INVALID</code> (message = the error’s message).</li>
<li><code>await findUser(Number(payload.sub))</code> ⇒ <code>null</code> ⇒ 401 <code>USER_GONE</code>.</li>
<li><code>user.tokenVersion !== payload.tv</code> ⇒ 401 <code>TOKEN_REVOKED</code>.</li>
<li>Otherwise <code>req.user = { id, email, role }</code> <b>from the database row</b> (not from the token), then <code>next()</code>.</li></ol>
<p>Exactly one <code>next</code> call per request; never call findUser for a token that did not verify.</p>`,
  vi: `<p>Middleware của bài 8.3, với các phụ thuộc được tiêm vào để máy chấm làm giả. <code>makeRequireAuth({ verifyAccessToken, findUser })</code> trả <code>async (req, res, next)</code>. <code>readToken</code> (bài 2) và <code>AppError</code> nằm trong <code>helpers.js</code>.</p>
<ol><li>Không có token ⇒ <code>next(new AppError(401, 'NO_TOKEN', …))</code>.</li>
<li><code>verifyAccessToken(token)</code> (đồng bộ, như jwt.verify) ném lỗi: <code>err.name === 'TokenExpiredError'</code> ⇒ 401 <code>TOKEN_EXPIRED</code>; còn lại ⇒ 401 <code>TOKEN_INVALID</code> (message = message của lỗi).</li>
<li><code>await findUser(Number(payload.sub))</code> ⇒ <code>null</code> ⇒ 401 <code>USER_GONE</code>.</li>
<li><code>user.tokenVersion !== payload.tv</code> ⇒ 401 <code>TOKEN_REVOKED</code>.</li>
<li>Còn lại <code>req.user = { id, email, role }</code> <b>lấy từ dòng CSDL</b> (không phải từ token), rồi <code>next()</code>.</li></ol>
<p>Mỗi request đúng một lần gọi <code>next</code>; không bao giờ gọi findUser cho token chưa verify được.</p>`,
  yc: [['Each refusal is <code>next(AppError)</code>, never <code>res.status(…)</code> directly.', 'Mỗi lời từ chối là <code>next(AppError)</code>, không bao giờ <code>res.status(…)</code> trực tiếp.'], ['The role on req.user comes from the user row.', 'Role trên req.user lấy từ dòng user.']],
  goiY: [['Wrap ONLY <code>verifyAccessToken</code> in try/catch; return from the catch.', 'Chỉ bọc <code>verifyAccessToken</code> trong try/catch; return từ catch.'], ['<code>return next(…)</code> on every refusal so the next line never runs.', '<code>return next(…)</code> ở mọi lời từ chối để dòng sau không bao giờ chạy.']],
  loi: [['Taking the role from the token: an admin demoted an hour ago is still ADMIN until the token expires.', 'Lấy role từ token: admin bị hạ quyền một giờ trước vẫn là ADMIN tới khi token hết hạn.'], ['Mapping every verify error to TOKEN_EXPIRED — a forged token makes the client refresh instead of logging out.', 'Gộp mọi lỗi verify thành TOKEN_EXPIRED — token giả khiến client làm mới thay vì đăng xuất.'], ['Skipping the tokenVersion comparison: “log out everywhere” stops working (lesson 8.4).', 'Bỏ phép so tokenVersion: "đăng xuất mọi thiết bị" ngừng hoạt động (bài 8.4).']],
  gt: ['Each refusal has its own machine-readable code because the client must react differently: TOKEN_EXPIRED ⇒ refresh once; TOKEN_INVALID, USER_GONE, TOKEN_REVOKED ⇒ real logout; NO_TOKEN ⇒ show the login screen. The single lookup is what makes deletion, demotion and revocation immediate — at a cost of one millisecond against a route that spends ten on its real query.', 'Mỗi lời từ chối có mã riêng máy đọc được vì client phải phản ứng khác nhau: TOKEN_EXPIRED ⇒ làm mới một lần; TOKEN_INVALID, USER_GONE, TOKEN_REVOKED ⇒ đăng xuất thật; NO_TOKEN ⇒ hiện màn đăng nhập. Một lần tra duy nhất làm việc xoá, hạ quyền và thu hồi có hiệu lực ngay — với giá một mili giây so với route tốn mười mili giây cho truy vấn thật.'],
  kn: ['authentication', 'Express middleware'],
  tns: [tn('tokenVersion', 'phiên bản token', 'Bộ đếm trên user, chép vào token là tv.'), tn('fail closed', 'hỏng thì đóng')],
  tro: `// provided — exercise 2 and the AppError of lesson 5.4\n${readToken}\n${APP_ERROR}\n`,
  dau: `function makeRequireAuth({ verifyAccessToken, findUser }) {
  return async function requireAuth(req, res, next) {
    // Write your solution here
    const token = readToken(req);
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: Number(payload.sub), role: payload.role };
      next();
    } catch (err) {
      next(new AppError(401, 'TOKEN_EXPIRED', err.message));
    }
  };
}
`,
  giai: makeRequireAuth,
  chung: AUTH_FAKES,
  cases: [
    { goi: `await run({ headers: { authorization: 'Bearer ok:1:0:USER' } })`, moTa: ['A good token ⇒ req.user from the database', 'Token tốt ⇒ req.user từ CSDL'] },
    { goi: `[await run({}), await run({ headers: { authorization: 'Bearer bad-sig' } })]`, moTa: ['NO_TOKEN, TOKEN_INVALID (no lookup)', 'NO_TOKEN, TOKEN_INVALID (không tra)'] },
    { goi: `await run({ cookies: { access_token: 'expired' } })`, moTa: ['Expired ⇒ TOKEN_EXPIRED', 'Hết hạn ⇒ TOKEN_EXPIRED'] },
    { goi: `[await run({ headers: { authorization: 'Bearer ok:5:0:USER' } }), await run({ headers: { authorization: 'Bearer ok:2:2:USER' } })]`, an: true, moTa: ['Deleted user ⇒ USER_GONE; old tv ⇒ TOKEN_REVOKED', 'User đã xoá ⇒ USER_GONE; tv cũ ⇒ TOKEN_REVOKED'] },
    { goi: `await run({ headers: { authorization: 'Bearer ok:1:0:ADMIN' } })`, an: true, moTa: ['Token says ADMIN, database says USER', 'Token ghi ADMIN, CSDL ghi USER'] },
    { goi: `[await run({ headers: { authorization: 'Bearer garbage' } }), await run({ headers: { authorization: 'Bearer ok:9:0:ADMIN' } })]`, an: true },
  ],
  saiMau: [
    makeRequireAuth.toString().replace("req.user = { id: user.id, email: user.email, role: user.role };", "req.user = { id: user.id, email: user.email, role: payload.role };"),
    makeRequireAuth.toString().replace("if (user.tokenVersion !== payload.tv) return next(new AppError(401, 'TOKEN_REVOKED', 'Token has been revoked'));", ''),
  ],
});

/* ── 4. requireRole, rồi quyền chi tiết ── */
const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role)
    ? next()
    : next(new AppError(403, 'FORBIDDEN', 'Requires role ' + roles.join(' or ')));
const PERMISSIONS = {
  USER: ['note:read:own', 'note:write:own', 'note:delete:own'],
  MODERATOR: ['note:read:own', 'note:write:own', 'note:delete:own', 'note:read:any', 'note:delete:any'],
  ADMIN: ['note:read:own', 'note:write:own', 'note:delete:own', 'note:read:any', 'note:write:any', 'note:delete:any', 'user:delete'],
};
// adding a role = editing ONE table, not every route
const requirePermission = (perm) => (req, res, next) =>
  (PERMISSIONS[req.user?.role] || []).includes(perm)
    ? next()
    : next(new AppError(403, 'FORBIDDEN', 'Missing permission ' + perm));
const E4 = jsBai({
  ten: '8.3 · 4 — Write requireRole(...roles) and requirePermission(perm): 403, after authentication', kho: 'MEDIUM', phut: 12,
  en: `<p>Two middleware factories. <code>AppError</code> is in <code>helpers.js</code>.</p>
<ul><li><code>requireRole(...roles)</code> ⇒ <code>(req, res, next)</code>: <code>next()</code> if <code>req.user?.role</code> is one of <code>roles</code>, else <code>next(new AppError(403, 'FORBIDDEN', 'Requires role ADMIN or MODERATOR'))</code> (roles joined with <code>" or "</code>).</li>
<li>The next step the lesson names — permissions instead of more roles. Write the table <code>PERMISSIONS</code>: <code>USER</code> = <code>note:read:own</code>, <code>note:write:own</code>, <code>note:delete:own</code>; <code>MODERATOR</code> = USER’s plus <code>note:read:any</code>, <code>note:delete:any</code>; <code>ADMIN</code> = USER’s plus <code>note:read:any</code>, <code>note:write:any</code>, <code>note:delete:any</code>, <code>user:delete</code>. Then <code>requirePermission(perm)</code>: <code>next()</code> if the user’s role grants <code>perm</code>, else 403 <code>FORBIDDEN</code> with message <code>"Missing permission &lt;perm&gt;"</code>. Unknown role or no user ⇒ no permissions.</li></ul>
<p>One check runs them in the wrong order — before requireAuth set <code>req.user</code> — to show what the admin sees then.</p>`,
  vi: `<p>Hai hàm tạo middleware. <code>AppError</code> có trong <code>helpers.js</code>.</p>
<ul><li><code>requireRole(...roles)</code> ⇒ <code>(req, res, next)</code>: <code>next()</code> nếu <code>req.user?.role</code> là một trong <code>roles</code>, không thì <code>next(new AppError(403, 'FORBIDDEN', 'Requires role ADMIN or MODERATOR'))</code> (các vai trò nối bằng <code>" or "</code>).</li>
<li>Bước tiếp theo mà bài nhắc — quyền thay vì thêm vai trò. Viết bảng <code>PERMISSIONS</code> như bản tiếng Anh, rồi <code>requirePermission(perm)</code>: <code>next()</code> nếu vai trò của user cấp <code>perm</code>, không thì 403 <code>FORBIDDEN</code> với message <code>"Missing permission &lt;perm&gt;"</code>. Vai trò lạ hoặc không có user ⇒ không có quyền nào.</li></ul>
<p>Một kiểm chạy chúng sai thứ tự — trước khi requireAuth đặt <code>req.user</code> — để thấy admin nhận được gì khi đó.</p>`,
  yc: [['Always <code>next()</code> or <code>next(err)</code>, exactly once.', 'Luôn <code>next()</code> hoặc <code>next(err)</code>, đúng một lần.'], ['Read <code>req.user?.role</code> — never crash on a missing user.', 'Đọc <code>req.user?.role</code> — không bao giờ sập khi thiếu user.']],
  goiY: [['A factory: <code>const requireRole = (...roles) =&gt; (req, res, next) =&gt; …</code>.', 'Hàm tạo: <code>const requireRole = (...roles) =&gt; (req, res, next) =&gt; …</code>.'], ['<code>(PERMISSIONS[req.user?.role] || []).includes(perm)</code>.', '<code>(PERMISSIONS[req.user?.role] || []).includes(perm)</code>.']],
  loi: [['<code>req.user.role</code> without <code>?.</code>: in the wrong order the server throws a TypeError (500) instead of a 403.', '<code>req.user.role</code> không có <code>?.</code>: sai thứ tự thì server ném TypeError (500) thay vì 403.'], ['Answering 401 when the role is wrong — the client refreshes forever.', 'Trả 401 khi sai vai trò — client làm mới mãi.']],
  gt: ['A role check asks “is this KIND of user allowed?”; it cannot know which row they want, so it is a middleware for a group of routes. Permissions push the role→capability mapping into one table: a new MODERATOR role is one entry, not an edit to every route that ever said requireRole("ADMIN").', 'Kiểm vai trò hỏi "LOẠI người dùng này có được phép?"; nó không biết họ muốn dòng nào, nên nó là middleware cho một nhóm route. Quyền đẩy ánh xạ vai trò→khả năng vào một bảng: vai trò MODERATOR mới là một mục, không phải sửa mọi route từng ghi requireRole("ADMIN").'],
  kn: ['authorization', 'RBAC'],
  tns: [tn('RBAC', 'phân quyền theo vai trò'), tn('permission', 'quyền', 'note:delete:any')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `const requireRole = (...roles) => (req, res, next) => {
  // Write your solution here
  if (req.user.role === roles[0]) return next();
  next(new AppError(401, 'UNAUTHORIZED', 'Not allowed'));
};
const PERMISSIONS = {};
const requirePermission = (perm) => (req, res, next) => next();
`,
  giai: `// Reference solution
const requireRole = ${requireRole.toString()};

const PERMISSIONS = ${JSON.stringify(PERMISSIONS, null, 2)};

// adding a role = editing ONE table, not every route
const requirePermission = ${requirePermission.toString()};
`,
  chung: RES + `
const call = (mw, user) => { const req = mkReq({ user }); const next = mkNext(); try { mw(req, mkRes(), next); } catch (e) { return { crashed: e.name }; } return next.calls.map((e) => (e === undefined ? 'next()' : { status: e.status, code: e.code, message: e.message })); };
const U = (role) => ({ id: 1, role });`,
  cases: [
    { goi: `[call(requireRole('ADMIN'), U('ADMIN')), call(requireRole('ADMIN'), U('USER'))]`, moTa: ['ADMIN passes, USER gets 403', 'ADMIN qua, USER nhận 403'] },
    { goi: `call(requireRole('ADMIN', 'MODERATOR'), undefined)`, moTa: ['Wrong order: no req.user yet ⇒ 403 (not a crash)', 'Sai thứ tự: chưa có req.user ⇒ 403 (không sập)'] },
    { goi: `[call(requirePermission('note:delete:any'), U('MODERATOR')), call(requirePermission('note:write:any'), U('MODERATOR')), call(requirePermission('user:delete'), U('ADMIN'))]` },
    { goi: `[call(requireRole('MODERATOR', 'ADMIN'), U('MODERATOR')), call(requirePermission('note:read:own'), U('USER')), call(requirePermission('note:read:any'), U('USER')), call(requirePermission('note:read:own'), U('GUEST')), call(requirePermission('note:read:own'), undefined)]`, an: true },
    { goi: `Object.fromEntries(Object.entries(PERMISSIONS).map(([r, ps]) => [r, [...ps].sort()]))`, an: true, moTa: ['The permission table', 'Bảng quyền'] },
  ],
});

/* ── 5. Service có actor: một canTouch, 404 thay vì 403 ── */
function createNotesService(db) {
  // the permission rule lives in EXACTLY ONE PLACE: the owner, or an ADMIN
  const canTouch = (note, actor) => note.authorId === actor.id || actor.role === 'ADMIN';
  async function get(actor, id) {
    const note = await db.findNote(id);
    if (!note || !canTouch(note, actor)) return null;          // 404, NOT 403: do not confirm someone else's row exists
    return note;
  }
  return {
    async list(actor, { q } = {}) {
      // the authorId clause is the only thing between "my notes" and "everyone's notes"
      return db.findNotes({ authorId: actor.id, ...(q ? { q } : {}) });
    },
    get,
    async update(actor, id, patch) {
      if (!await get(actor, id)) return null;                   // the permission decision goes through get()
      const { id: _i, authorId: _a, ...safe } = patch;          // the owner cannot be changed through the body
      return db.updateNote(id, safe);
    },
    async remove(actor, id) {
      if (!await get(actor, id)) return false;
      await db.deleteNote(id);
      return true;
    },
  };
}
const NOTES_DB = `const mkDb = () => { const notes = new Map([[1, { id: 1, title: 'Ghi chu cua An', authorId: 1 }], [2, { id: 2, title: 'Ghi chu cua Binh', authorId: 2 }], [3, { id: 3, title: 'An again', authorId: 1 }]]);
  const wait = (v) => new Promise((ok) => setTimeout(() => ok(v), 1));
  return { notes,
    findNote: (id) => wait(notes.has(id) ? { ...notes.get(id) } : null),
    findNotes: (where) => wait([...notes.values()].filter((n) => (where.authorId === undefined || n.authorId === where.authorId) && (!where.q || n.title.toLowerCase().includes(where.q.toLowerCase()))).map((n) => ({ ...n }))),
    updateNote: (id, data) => wait(Object.assign(notes.get(id), data) && { ...notes.get(id) }),
    deleteNote: (id) => wait(notes.delete(id)) }; };
const an = { id: 1, role: 'USER' }, binh = { id: 2, role: 'USER' }, admin = { id: 9, role: 'ADMIN' };`;
const E5 = jsBai({
  ten: '8.3 · 5 — Delete AUTHOR_ID = 1: write createNotesService(db) with actor first and one canTouch', kho: 'HARD', phut: 25,
  en: `<p>The lie at the top of the chapter-7 service — <code>const AUTHOR_ID = 1</code> — is gone. Every function now takes the <b>actor</b> (<code>{ id, role }</code>, i.e. <code>req.user</code>) as its first parameter. <code>db</code> is a fake repository: <code>findNote(id)</code>, <code>findNotes({ authorId, q? })</code>, <code>updateNote(id, data)</code>, <code>deleteNote(id)</code> (all async). Write <code>createNotesService(db)</code> returning:</p>
<ul><li><code>list(actor, { q })</code> ⇒ only the actor’s notes (<code>findNotes({ authorId: actor.id, q })</code>, <code>q</code> only when given) — for an ADMIN too: “my notes”.</li>
<li><code>get(actor, id)</code> ⇒ the note if the actor <b>owns it or is ADMIN</b>; otherwise — missing <b>or someone else’s</b> — <code>null</code> (the route answers 404).</li>
<li><code>update(actor, id, patch)</code> ⇒ decides through <code>get</code>; <code>null</code> if not allowed; drops <code>id</code> and <code>authorId</code> from the patch; returns <code>updateNote(id, safe)</code>.</li>
<li><code>remove(actor, id)</code> ⇒ through <code>get</code>; <code>false</code> if not allowed, else delete and <code>true</code>.</li></ul>
<p>The hidden checks replay the lesson: Binh reads, deletes and lists An’s note, tries to hand his note to An through the body, and the admin reads note 1.</p>`,
  vi: `<p>Lời nói dối ở đầu service chương 7 — <code>const AUTHOR_ID = 1</code> — đã bị xoá. Mọi hàm giờ nhận <b>actor</b> (<code>{ id, role }</code>, tức <code>req.user</code>) làm tham số đầu. <code>db</code> là kho GIẢ: <code>findNote(id)</code>, <code>findNotes({ authorId, q? })</code>, <code>updateNote(id, data)</code>, <code>deleteNote(id)</code> (đều async). Viết <code>createNotesService(db)</code> trả về:</p>
<ul><li><code>list(actor, { q })</code> ⇒ chỉ ghi chú của actor (<code>findNotes({ authorId: actor.id, q })</code>, <code>q</code> chỉ khi có) — với ADMIN cũng vậy: "ghi chú của tôi".</li>
<li><code>get(actor, id)</code> ⇒ ghi chú nếu actor <b>là chủ hoặc là ADMIN</b>; không thì — không có <b>hoặc của người khác</b> — <code>null</code> (route trả 404).</li>
<li><code>update(actor, id, patch)</code> ⇒ quyết định qua <code>get</code>; <code>null</code> nếu không được phép; bỏ <code>id</code> và <code>authorId</code> khỏi patch; trả <code>updateNote(id, safe)</code>.</li>
<li><code>remove(actor, id)</code> ⇒ qua <code>get</code>; <code>false</code> nếu không được phép, không thì xoá và <code>true</code>.</li></ul>
<p>Các kiểm ẩn diễn lại bài: Bình đọc, xoá và liệt kê ghi chú của An, thử chuyển ghi chú của mình cho An qua body, và admin đọc ghi chú 1.</p>`,
  yc: [['One <code>canTouch</code>, used by get; update and remove go through get.', 'Một <code>canTouch</code>, dùng trong get; update và remove đi qua get.'], ['Someone else’s note looks exactly like a missing one.', 'Ghi chú của người khác trông y như ghi chú không tồn tại.']],
  goiY: [['<code>const canTouch = (note, actor) =&gt; note.authorId === actor.id || actor.role === "ADMIN";</code>', '<code>const canTouch = (note, actor) =&gt; note.authorId === actor.id || actor.role === "ADMIN";</code>'], ['<code>const { id: _i, authorId: _a, ...safe } = patch;</code> — an explicit denylist; chapter 6’s schema is the stronger allowlist.', '<code>const { id: _i, authorId: _a, ...safe } = patch;</code> — danh sách cấm tường minh; lược đồ của chương 6 là danh sách cho phép mạnh hơn.']],
  loi: [['Checking ownership in get but not in update/remove: Binh cannot read An’s note, and deletes it anyway.', 'Kiểm quyền sở hữu ở get mà không ở update/remove: Bình không đọc được ghi chú của An, nhưng vẫn xoá được.'], ['Dropping authorId from list’s where while adding the search filter — every user sees every note, no error, no failing test unless you wrote one.', 'Làm mất authorId trong where của list khi thêm bộ lọc tìm kiếm — mọi người thấy mọi ghi chú, không lỗi, không test nào đỏ trừ khi bạn viết.'], ['Returning a "FORBIDDEN" marker for someone else’s note so the route can send 403 — it confirms the id exists.', 'Trả dấu "FORBIDDEN" cho ghi chú người khác để route gửi 403 — nó xác nhận id có tồn tại.']],
  gt: ['IDOR needs no exploit code: a valid user types another number in the URL. The defence is structural — the actor is a required parameter, the rule lives in one function, and every operation passes through it — so changing the rule (shares, teams, moderators) is one edit and there is no fourth call site to forget. 404 for other people’s rows means ids cannot be used to map the database.', 'IDOR không cần code tấn công: một người dùng hợp lệ gõ số khác vào URL. Cách chống mang tính cấu trúc — actor là tham số bắt buộc, luật nằm trong một hàm, và mọi thao tác đi qua nó — nên đổi luật (chia sẻ, nhóm, người kiểm duyệt) là một chỗ sửa và không có nơi gọi thứ tư để quên. 404 cho dòng của người khác nghĩa là không dùng id để vẽ bản đồ CSDL được.'],
  kn: ['authorization', 'IDOR', 'mass assignment'],
  tns: [tn('actor', 'chủ thể', 'Người đang thực hiện thao tác.'), tn('ownership check', 'kiểm quyền sở hữu'), tn('IDOR', 'IDOR')],
  dau: `function createNotesService(db) {
  // Write your solution here (this is the chapter-7 version)
  const AUTHOR_ID = 1;
  return {
    list: (actor, { q } = {}) => db.findNotes({ q }),
    get: (actor, id) => db.findNote(id),
    update: (actor, id, patch) => db.updateNote(id, patch),
    remove: async (actor, id) => { await db.deleteNote(id); return true; },
  };
}
`,
  giai: createNotesService,
  chung: NOTES_DB,
  cases: [
    { goi: `await (async () => { const s = createNotesService(mkDb()); return [await s.get(an, 1), await s.get(an, 2), await s.get(an, 99)]; })()`, moTa: ['An: own note, Binh’s note (null), missing (null)', 'An: ghi chú của mình, của Bình (null), không có (null)'] },
    { goi: `await (async () => { const s = createNotesService(mkDb()); return [await s.list(an), await s.list(an, { q: 'again' })]; })()`, moTa: ['list: only An’s notes', 'list: chỉ ghi chú của An'] },
    { goi: `await (async () => { const db = mkDb(); const s = createNotesService(db); return [await s.get(binh, 1), await s.remove(binh, 1), await s.list(binh, { q: 'An' }), db.notes.has(1), await s.get(admin, 1)]; })()`, an: true, moTa: ['Lesson steps 6–6d: Binh vs An’s note, then the admin', 'Bước 6–6d của bài: Bình với ghi chú của An, rồi admin'] },
    { goi: `await (async () => { const db = mkDb(); const s = createNotesService(db); const r = await s.update(binh, 2, { title: 'mine', authorId: 1, id: 7 }); const x = await s.update(binh, 1, { title: 'hacked' }); return [r, x, db.notes.get(1).title]; })()`, an: true, moTa: ['Step 7: owner change through the body is blocked; Binh cannot update An’s', 'Bước 7: đổi chủ qua body bị chặn; Bình không sửa được của An'] },
    { goi: `await (async () => { const db = mkDb(); const s = createNotesService(db); return [await s.list(admin), await s.update(admin, 2, { title: 'moderated' }), await s.remove(admin, 3), [...db.notes.keys()]]; })()`, an: true },
  ],
  saiMau: [
    createNotesService.toString().replace("if (!await get(actor, id)) return false;\n      await db.deleteNote(id);", 'await db.deleteNote(id);'),
    createNotesService.toString().replace("return db.findNotes({ authorId: actor.id, ...(q ? { q } : {}) });", 'return db.findNotes({ ...(q ? { q } : {}) });'),
    createNotesService.toString().replace("const { id: _i, authorId: _a, ...safe } = patch;", 'const safe = patch;'),
  ],
});

/* ── 6. Thứ tự gắn middleware ── */
function auditRouter(stack) {
  // walk the stack in declaration order, exactly like Express does
  let authMounted = false;
  const problems = [];
  for (const layer of stack) {
    if (layer.type === 'use') { if (layer.name === 'requireAuth') authMounted = true; continue; }
    const chain = layer.middleware || [];
    const route = layer.method + ' ' + layer.path;
    const authAt = chain.indexOf('requireAuth');
    const authed = authMounted || authAt >= 0;
    if (!authed && !layer.public) problems.push({ route, problem: 'UNPROTECTED' });
    // requireRole/requirePermission read req.user: they must come after authentication
    const roleAt = chain.findIndex((m) => /^require(Role|Permission)\b/.test(m));
    if (roleAt >= 0 && !authMounted && (authAt < 0 || authAt > roleAt)) problems.push({ route, problem: 'ROLE_BEFORE_AUTH' });
  }
  return problems;
}
const E6 = jsBai({
  ten: '8.3 · 6 — Write auditRouter(stack): find the routes that mounting order left open', kho: 'MEDIUM', phut: 15,
  en: `<p>“<code>router.use(requireAuth)</code> only protects routes declared after it … with no error, no warning, and a test suite that still passes.” Audit a router statically. <code>stack</code> lists what was declared, in order: <code>{ type: 'use', name }</code> or <code>{ type: 'route', method, path, middleware: [names…], public?: true }</code> (the handler is not listed). Return <code>[{ route: "METHOD path", problem }]</code> in stack order:</p>
<ul><li><code>UNPROTECTED</code> — a route that is not <code>public</code>, declared before any <code>use</code> of <code>requireAuth</code>, and without <code>requireAuth</code> in its own chain.</li>
<li><code>ROLE_BEFORE_AUTH</code> — a route whose chain contains a name starting with <code>requireRole</code> or <code>requirePermission</code>, while no router-level <code>requireAuth</code> was mounted before it and its own <code>requireAuth</code> is missing or comes <b>after</b> that role check.</li></ul>
<p>A route can have both problems (UNPROTECTED first).</p>`,
  vi: `<p>"<code>router.use(requireAuth)</code> chỉ bảo vệ các route khai báo sau nó … không lỗi, không cảnh báo, và bộ test vẫn qua." Hãy soát một router mà không chạy. <code>stack</code> liệt kê những gì đã khai báo, theo thứ tự: <code>{ type: 'use', name }</code> hoặc <code>{ type: 'route', method, path, middleware: [tên…], public?: true }</code> (handler không được liệt kê). Trả <code>[{ route: "METHOD path", problem }]</code> theo thứ tự stack:</p>
<ul><li><code>UNPROTECTED</code> — route không <code>public</code>, khai báo trước mọi <code>use</code> của <code>requireAuth</code>, và không có <code>requireAuth</code> trong chuỗi riêng.</li>
<li><code>ROLE_BEFORE_AUTH</code> — route có trong chuỗi một tên bắt đầu bằng <code>requireRole</code> hoặc <code>requirePermission</code>, trong khi chưa có <code>requireAuth</code> cấp router nào được gắn trước nó và <code>requireAuth</code> riêng của nó thiếu hoặc đứng <b>sau</b> phép kiểm vai trò đó.</li></ul>
<p>Một route có thể mắc cả hai (UNPROTECTED trước).</p>`,
  yc: [['Respect declaration order.', 'Tôn trọng thứ tự khai báo.'], ['Public routes are never UNPROTECTED.', 'Route public không bao giờ là UNPROTECTED.']],
  goiY: [['Keep a flag <code>authMounted</code> that becomes true when you pass <code>{ type: "use", name: "requireAuth" }</code>.', 'Giữ cờ <code>authMounted</code> thành true khi đi qua <code>{ type: "use", name: "requireAuth" }</code>.'], ['For the role rule, compare <code>chain.indexOf("requireAuth")</code> with the index of the first role/permission check.', 'Với luật vai trò, so <code>chain.indexOf("requireAuth")</code> với vị trí phép kiểm vai trò/quyền đầu tiên.']],
  loi: [['Treating a router.use(requireAuth) at the bottom as protecting everything above it.', 'Coi router.use(requireAuth) ở cuối là bảo vệ mọi thứ phía trên.'], ['Missing <code>requirePermission(...)</code> because you only looked for requireRole.', 'Bỏ sót <code>requirePermission(...)</code> vì chỉ tìm requireRole.']],
  gt: ['Express has no notion of “this router is protected”: it walks layers in order and a route answers as soon as it matches. So protection is a property of position. Mounting requireAuth at the top makes forgetting fail closed; an audit like this one, run in CI, catches the cases where someone added a route above the line — cuongthai.com found routes where requireAdmin had simply been forgotten.', 'Express không có khái niệm "router này được bảo vệ": nó duyệt các lớp theo thứ tự và route trả lời ngay khi khớp. Nên bảo vệ là tính chất của vị trí. Gắn requireAuth ở đầu làm việc quên thành hỏng-thì-đóng; một phép soát như thế này chạy trong CI bắt được trường hợp ai đó thêm route phía trên dòng đó — cuongthai.com từng tìm ra route mà requireAdmin bị quên hẳn.'],
  kn: ['Express middleware', 'security review'],
  tns: [tn('middleware stack', 'chồng middleware'), tn('fail closed', 'hỏng thì đóng')],
  dau: `function auditRouter(stack) {
  // Write your solution here
  const authAnywhere = stack.some((l) => l.type === 'use' && l.name === 'requireAuth');
  return stack.filter((l) => l.type === 'route' && !authAnywhere && !l.public).map((l) => ({ route: l.method + ' ' + l.path, problem: 'UNPROTECTED' }));
}
`,
  giai: auditRouter,
  cases: [
    { goi: goi('auditRouter', [{ type: 'route', method: 'GET', path: '/notes' }, { type: 'route', method: 'POST', path: '/notes' }, { type: 'use', name: 'requireAuth' }]), moTa: ['requireAuth mounted at the bottom', 'requireAuth gắn ở cuối'] },
    { goi: goi('auditRouter', [{ type: 'use', name: 'requireAuth' }, { type: 'route', method: 'GET', path: '/notes' }, { type: 'route', method: 'DELETE', path: '/users/:id', middleware: ['requireRole(ADMIN)'] }]), moTa: ['Protected at the top: no problems', 'Bảo vệ ở đầu: không có vấn đề'] },
    { goi: goi('auditRouter', [{ type: 'route', method: 'DELETE', path: '/users/:id', middleware: ['requireRole(ADMIN)', 'requireAuth'] }, { type: 'route', method: 'GET', path: '/health', public: true }]), moTa: ['Role before auth in the chain', 'Vai trò trước xác thực trong chuỗi'] },
    { goi: goi('auditRouter', [{ type: 'use', name: 'json' }, { type: 'route', method: 'POST', path: '/auth/login', public: true }, { type: 'route', method: 'GET', path: '/admin/stats', middleware: ['requirePermission(user:delete)'] }, { type: 'route', method: 'GET', path: '/me', middleware: ['requireAuth'] }, { type: 'use', name: 'requireAuth' }, { type: 'route', method: 'PATCH', path: '/notes/:id', middleware: ['requireRole(USER)'] }]), an: true },
    { goi: goi('auditRouter', [{ type: 'route', method: 'GET', path: '/x', middleware: ['requireAuth', 'requireRole(ADMIN)'] }, { type: 'route', method: 'GET', path: '/y', public: true, middleware: ['requireRole(ADMIN)'] }, { type: 'use', name: 'logger' }]), an: true },
  ],
});

export default modul('nodejs-8-3-requireauth-phan-quyen', '8.3 requireAuth, roles, and deleting AUTHOR_ID = 1', [E1, E2, E3, E4, E5, E6]);
