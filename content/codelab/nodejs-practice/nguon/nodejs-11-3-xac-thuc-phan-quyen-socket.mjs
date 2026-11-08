/** Node.js 11.3 — Xác thực một lần, phân quyền mọi lần: token lúc bắt tay, lỗ join:unsafe đã có trên production, ping timeout, kết nối lại mất tin ⇒ REST là sự thật. */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Authenticated is not authorized', kho: 'EASY', phut: 10,
  en: 'From the lesson: four tokens through the handshake, the join:unsafe hole that ran in this site’s production, a black-holed connection detected after 3,010 ms, and five messages lost during a reconnect.',
  vi: 'Từ bài: bốn token qua lần bắt tay, lỗ join:unsafe từng chạy trên production của site này, một kết nối bị "hố đen" được phát hiện sau 3.010 ms, và năm tin mất trong lúc kết nối lại.',
  cau: [
    q('a1', ['Where should a browser’s credential come from on the handshake?', 'Thông tin xác thực của trình duyệt nên đến từ đâu lúc bắt tay?'],
      ['An httpOnly cookie (or handshake.auth.token) — never the query string', 'The query string, because WebSocket cannot set headers', 'A field in every event payload, checked per message', 'The Origin header, which proves which site opened the socket'],
      ['A token in the URL lands in access logs, Referer headers and your monitoring tool. This site reads handshake.auth.token first (it travels inside the first packet), then the httpOnly backend_token cookie.', 'Token trong URL nằm trong access log, header Referer và công cụ giám sát. Site này đọc handshake.auth.token trước (nó đi trong gói đầu tiên), rồi tới cookie httpOnly backend_token.']),
    q('a2', ['User 7 (valid token, participant of thread 42 only) emits <code>join:unsafe</code> with 99. What happened?', 'Người dùng 7 (token hợp lệ, chỉ ở thread 42) gửi <code>join:unsafe</code> với 99. Chuyện gì xảy ra?'],
      ['It joined thread:99 and received a stranger’s private message — and nothing appeared in the REST logs', 'The handshake middleware rejected the event, because it runs on every emit', 'Socket.IO refused, because room names must match the user id', 'It joined, but rooms never receive messages sent before the join'],
      ['Every socket.on is an endpoint. Thread ids are sequential, so guessing is a for loop, and nothing alerts: no GET /threads/99, no 403.', 'Mỗi socket.on là một endpoint. Id thread tăng dần nên đoán chỉ là một vòng for, và không gì báo động: không có GET /threads/99, không có 403.']),
    q('a3', ['With <code>pingInterval: 1000, pingTimeout: 2000</code> a phone walks into a lift (sends nothing). Worst case before the server notices?', 'Với <code>pingInterval: 1000, pingTimeout: 2000</code> một điện thoại đi vào thang máy (không gửi gì). Trường hợp xấu nhất trước khi server nhận ra?'],
      ['About 3,000 ms — pingInterval + pingTimeout (measured 3,010 ms)', '2,000 ms — only the timeout counts', '1,000 ms — the next ping fails immediately', 'Never, until TCP keepalive (2 hours) fires'],
      ['Defaults 25,000 + 20,000 = up to 45 s of a ghost user; this site’s 25,000 + 60,000 = 85 s. Until then the ghost sits in every room.', 'Mặc định 25.000 + 20.000 = tới 45 giây một "bóng ma"; site này 25.000 + 60.000 = 85 giây. Trong lúc đó bóng ma nằm trong mọi room.']),
    q('a4', ['The client was offline for a second while the server emitted 5 messages. After the automatic reconnect?', 'Client offline một giây trong lúc server phát 5 tin. Sau khi tự kết nối lại?'],
      ['A NEW socket id, no rooms, and 0 of the 5 messages — catch up over REST', 'The same socket id and all 5 messages, replayed by Socket.IO', 'A new id, but rooms are restored and the 5 messages replayed', 'The same id; messages are lost but rooms are kept'],
      ['By default nothing is buffered. connectionStateRecovery can replay, but in one process’s memory and not behind the classic redis adapter (measured 0/5). The socket is the signal; REST is the truth.', 'Mặc định không gì được đệm. connectionStateRecovery có thể phát lại, nhưng trong bộ nhớ một tiến trình và không chạy sau redis adapter cổ điển (đo 0/5). Socket là tín hiệu; REST là sự thật.']),
    qn('a5', ['Which are on the lesson’s list of realtime mistakes? (choose all)', 'Cái nào nằm trong danh sách lỗi realtime của bài? (chọn mọi câu đúng)'],
      ['Checking permissions only at the handshake', 'Trusting a userId that arrives in the event payload', 'No rate limit per socket', 'Treating the socket as a reliable delivery channel with no REST catch-up', 'Re-checking roleVersion against the database at connect'],
      [0, 1, 2, 3],
      ['Re-checking roleVersion is the careful part of this site’s handshake: a token issued before a role change is refused even though its signature is valid.', 'Kiểm lại roleVersion là phần cẩn thận trong lần bắt tay của site này: token cấp trước khi đổi vai trò bị từ chối dù chữ ký vẫn hợp lệ.']),
  ],
  goiY: [['Separate the two questions: "who are you?" (once) and "may you do this?" (every event).', 'Tách hai câu hỏi: "bạn là ai?" (một lần) và "bạn có được làm việc này không?" (mọi sự kiện).'], ['For the timing question, the server pings on the interval and then waits the timeout.', 'Với câu thời gian, server ping theo chu kỳ rồi chờ hết timeout.']],
  loi: [['A type check standing in for a permission check: <code>if (typeof threadId === "number") socket.join(…)</code>.', 'Kiểm kiểu đứng thay kiểm quyền: <code>if (typeof threadId === "number") socket.join(…)</code>.'], ['Building a message queue out of a UI transport.', 'Dựng một hàng đợi tin nhắn từ một kênh hiển thị.']],
  tns: [tn('authentication', 'xác thực', 'bạn là ai — một lần lúc bắt tay'), tn('authorization', 'phân quyền', 'bạn được làm gì — mỗi sự kiện'), tn('connect_error', 'lỗi kết nối', 'sự kiện client nhận khi bắt tay bị từ chối')],
  kn: ['WebSocket security', 'authorization'],
});

/* ─── 2. EASY · js — lấy token lúc bắt tay ─── */
function extractToken(handshake) {
  const hs = handshake || {};
  // 1) handshake.auth.token: inside the first packet on every transport, never in a URL
  if (hs.auth && typeof hs.auth.token === 'string' && hs.auth.token) return { token: hs.auth.token, source: 'auth' };
  const headers = {};
  for (const k of Object.keys(hs.headers || {})) headers[k.toLowerCase()] = String(hs.headers[k]);
  // 2) Authorization: Bearer … — for non-browser clients
  const m = /^Bearer\s+(\S+)$/i.exec(headers.authorization || '');
  if (m) return { token: m[1], source: 'header' };
  // 3) the httpOnly cookie the browser sends on the handshake — same as the REST middleware
  for (const part of (headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === 'backend_token') {
      const v = decodeURIComponent(part.slice(i + 1).trim());
      if (v) return { token: v, source: 'cookie' };
    }
  }
  // hs.query.token is deliberately IGNORED: a token in the URL ends up in access logs and Referer headers
  return null;
}

const E2 = jsBai({
  ten: 'Find the token on the handshake — and refuse the query string', kho: 'EASY', phut: 12,
  en: `<p>This site’s <code>tokenBatTay()</code> reads the credential in a fixed order. Write <code>extractToken(handshake)</code> for <code>handshake = { auth, headers, query }</code> → <code>{ token, source }</code> or <code>null</code>:</p>
<ol><li><code>auth.token</code> (a non-empty string) → source <code>'auth'</code>;</li>
<li>header <code>authorization: Bearer &lt;token&gt;</code> (header name and the word Bearer in any case) → <code>'header'</code>;</li>
<li>cookie <code>backend_token=&lt;value&gt;</code> in the <code>cookie</code> header (several cookies separated by <code>;</code>, value URL-decoded, an empty value does not count) → <code>'cookie'</code>;</li>
<li>otherwise <code>null</code> — <b>even if <code>query.token</code> is present</b>.</li></ol>${MOI_TRUONG.en}`,
  vi: `<p><code>tokenBatTay()</code> của site này đọc thông tin xác thực theo thứ tự cố định. Viết <code>extractToken(handshake)</code> với <code>handshake = { auth, headers, query }</code> → <code>{ token, source }</code> hoặc <code>null</code>:</p>
<ol><li><code>auth.token</code> (chuỗi không rỗng) → source <code>'auth'</code>;</li>
<li>header <code>authorization: Bearer &lt;token&gt;</code> (tên header và chữ Bearer kiểu chữ nào cũng được) → <code>'header'</code>;</li>
<li>cookie <code>backend_token=&lt;giá trị&gt;</code> trong header <code>cookie</code> (nhiều cookie cách nhau bằng <code>;</code>, giá trị được giải mã URL, giá trị rỗng không tính) → <code>'cookie'</code>;</li>
<li>còn lại <code>null</code> — <b>kể cả khi có <code>query.token</code></b>.</li></ol>${MOI_TRUONG.vi}`,
  goiY: [['Lower-case the header names, then try the three sources in order and return at the first hit.', 'Viết thường tên header, rồi thử ba nguồn theo thứ tự và trả về ở nguồn đầu tiên có.'], ['For cookies, split on <code>;</code>, then on the FIRST <code>=</code> only (values can contain =).', 'Với cookie, tách theo <code>;</code>, rồi chỉ theo dấu <code>=</code> ĐẦU TIÊN (giá trị có thể chứa =).']],
  loi: [['Accepting <code>?token=</code> "for convenience": it is in nginx’s access log forever.', 'Nhận <code>?token=</code> "cho tiện": nó nằm mãi trong access log của nginx.'], ['Matching <code>cookie.includes("backend_token=")</code>: <code>old_backend_token=x</code> also matches.', 'Khớp <code>cookie.includes("backend_token=")</code>: <code>old_backend_token=x</code> cũng khớp.'], ['Splitting a cookie on every <code>=</code>: a base64 value ending in <code>==</code> is cut.', 'Tách cookie theo mọi dấu <code>=</code>: giá trị base64 kết thúc bằng <code>==</code> bị cắt.']],
  gt: ['The handshake is HTTP, so the usual places work — and the order encodes a security decision: the token a JS client passes explicitly, then a header for non-browser clients, then the httpOnly cookie the browser attaches by itself. The query string is refused on purpose, because a URL is the most widely logged thing in your stack.', 'Lần bắt tay là HTTP nên các chỗ quen thuộc đều dùng được — và thứ tự mã hoá một quyết định bảo mật: token client JS truyền rõ ràng, rồi header cho client không phải trình duyệt, rồi cookie httpOnly trình duyệt tự gắn. Query string bị từ chối có chủ đích, vì URL là thứ bị ghi log nhiều nhất trong hệ thống.'],
  kn: ['WebSocket security', 'cookies'],
  tns: [tn('handshake.auth', 'dữ liệu xác thực lúc bắt tay', 'Socket.IO gửi trong gói đầu tiên'), tn('Bearer token', 'token mang theo', 'Authorization: Bearer …')],
  dau: `/** Where is the credential on this Socket.IO handshake? */
function extractToken(handshake) {
  // Write your solution here
  const t = handshake.query && handshake.query.token;
  if (t) return { token: t, source: 'query' };
  if (handshake.auth && handshake.auth.token) return { token: handshake.auth.token, source: 'auth' };
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(extractToken),
  cases: [
    { goi: `extractToken({ auth: { token: 'eyJhbGciOi.AAA' }, headers: { cookie: 'backend_token=eyJhbGciOi.BBB' }, query: {} })`, moTa: ['auth.token wins', 'auth.token thắng'] },
    { goi: `extractToken({ auth: {}, headers: { Cookie: 'theme=dark; backend_token=eyJhbGciOi.NGUOI-DUNG; lang=vi' }, query: {} })`, moTa: ['The httpOnly cookie among others', 'Cookie httpOnly giữa các cookie khác'] },
    { goi: `extractToken({ auth: {}, headers: {}, query: { token: 'eyJhbGciOi.LEAKED' } })`, moTa: ['The query string is ignored', 'Query string bị bỏ qua'] },
    { goi: `[extractToken({ headers: { Authorization: 'bearer abc.def.ghi' } }), extractToken({ headers: { authorization: 'Basic dXNlcjpwYXNz' } }), extractToken({ auth: { token: '' }, headers: { cookie: 'backend_token=' } }), extractToken({})]`, an: true },
    { goi: `[extractToken({ headers: { cookie: 'old_backend_token=x; backend_token=YWJj%3D%3D' } }), extractToken({ headers: { cookie: 'backend_token=a=b==' } }), extractToken({ auth: { token: 42 }, headers: { authorization: 'Bearer t1' } })]`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — middleware bắt tay: xác thực + kiểm lại với CSDL ─── */
function socketAuth({ verify, loadUser }) {
  return async function (socket, next) {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('NO_TOKEN'));            // surfaces on the client as connect_error
    let payload;
    try {
      payload = verify(token);
    } catch (err) {
      return next(err);                                         // "jwt expired", "invalid signature"…
    }
    let user;
    try {
      user = await loadUser(payload.userId);
    } catch {
      return next(new Error('AUTH_UNAVAILABLE'));               // fail CLOSED: no database, no socket
    }
    if (!user) return next(new Error('USER_NOT_FOUND'));
    if (user.disabled || user.locked) return next(new Error('ACCOUNT_DISABLED'));
    // the part most implementations skip: a password change or role edit bumps roleVersion,
    // and a token issued before it is refused even though its signature is still valid
    if (user.roleVersion !== payload.roleVersion) return next(new Error('TOKEN_STALE'));
    socket.data.userId = user.id;                               // from now on the CLIENT is not trusted about who it is
    socket.data.threads = user.threadIds.slice();               // loaded once, used by every handler
    next();
  };
}

const AUTH = String.raw`
const USERS = { 7: { id: 7, roleVersion: 3, threadIds: [42] }, 8: { id: 8, roleVersion: 1, threadIds: [], locked: true }, 9: { id: 9, roleVersion: 2, threadIds: [5, 6] } };
// fake jwt.verify: "ok:<userId>:<roleVersion>" is valid, "expired:…" and anything else throw like jsonwebtoken
function verify(t) { const [kind, id, rv] = String(t).split(':'); if (kind === 'expired') throw Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' }); if (kind !== 'ok') throw Object.assign(new Error('invalid signature'), { name: 'JsonWebTokenError' }); return { userId: Number(id), roleVersion: Number(rv) }; }
let dbDown = false; const loads = [];
async function loadUser(id) { loads.push(id); await new Promise((r) => setTimeout(r, 3)); if (dbDown) throw new Error('connect ECONNREFUSED'); return USERS[id] || null; }
async function handshake(mw, auth) { const socket = { handshake: { auth, headers: {} }, data: {} }; const calls = []; await mw(socket, (e) => calls.push(e ? e.message : 'ok')); return [calls, socket.data]; }
`;

const E3 = jsBai({
  ten: 'The handshake middleware: verify, load, and re-check roleVersion', kho: 'MEDIUM', phut: 18,
  en: `<p>Measurement 1: valid → connected; no token → <code>NO_TOKEN</code>; expired → <code>jwt expired</code>; wrong key → <code>invalid signature</code>. This site also "loads the user, refuses if the account is disabled or locked, and re-checks roleVersion against the database". Write <code>socketAuth({ verify, loadUser })</code> → <code>async (socket, next)</code> for <code>io.use</code>:</p>
<ol><li>token = <code>socket.handshake.auth.token</code>; missing → <code>next(new Error('NO_TOKEN'))</code>;</li>
<li><code>payload = verify(token)</code>; if it throws → <code>next(err)</code> with that same error;</li>
<li><code>user = await loadUser(payload.userId)</code>; if it throws → <code>next(new Error('AUTH_UNAVAILABLE'))</code> (fail closed);</li>
<li>no user → <code>USER_NOT_FOUND</code>; <code>disabled</code> or <code>locked</code> → <code>ACCOUNT_DISABLED</code>; <code>user.roleVersion !== payload.roleVersion</code> → <code>TOKEN_STALE</code>;</li>
<li>set <code>socket.data.userId = user.id</code> and <code>socket.data.threads</code> = a copy of <code>user.threadIds</code>, then <code>next()</code> with no argument.</li></ol>${MOI_TRUONG.en}`,
  vi: `<p>Phép đo 1: hợp lệ → nối được; không token → <code>NO_TOKEN</code>; hết hạn → <code>jwt expired</code>; sai khoá → <code>invalid signature</code>. Site này còn "nạp người dùng, từ chối nếu tài khoản bị vô hiệu hoá hoặc khoá, và kiểm lại roleVersion với CSDL". Viết <code>socketAuth({ verify, loadUser })</code> → <code>async (socket, next)</code> cho <code>io.use</code>:</p>
<ol><li>token = <code>socket.handshake.auth.token</code>; thiếu → <code>next(new Error('NO_TOKEN'))</code>;</li>
<li><code>payload = verify(token)</code>; nếu ném lỗi → <code>next(err)</code> với đúng lỗi đó;</li>
<li><code>user = await loadUser(payload.userId)</code>; nếu ném lỗi → <code>next(new Error('AUTH_UNAVAILABLE'))</code> (đóng khi hỏng);</li>
<li>không có user → <code>USER_NOT_FOUND</code>; <code>disabled</code> hoặc <code>locked</code> → <code>ACCOUNT_DISABLED</code>; <code>user.roleVersion !== payload.roleVersion</code> → <code>TOKEN_STALE</code>;</li>
<li>gán <code>socket.data.userId = user.id</code> và <code>socket.data.threads</code> = bản sao <code>user.threadIds</code>, rồi <code>next()</code> không đối số.</li></ol>${MOI_TRUONG.vi}`,
  goiY: [['Two separate try/catch blocks: one for verify (pass its error on), one for loadUser (replace it with AUTH_UNAVAILABLE).', 'Hai khối try/catch riêng: một cho verify (chuyển tiếp lỗi của nó), một cho loadUser (thay bằng AUTH_UNAVAILABLE).'], ['Every refusal is <code>return next(new Error(CODE))</code> — the return matters.', 'Mỗi lần từ chối là <code>return next(new Error(MÃ))</code> — chữ return quan trọng.']],
  loi: [['Forgetting <code>return</code> before a refusing <code>next(err)</code>: the code goes on and calls <code>next()</code> again — the socket connects.', 'Quên <code>return</code> trước <code>next(err)</code> từ chối: code chạy tiếp và gọi <code>next()</code> lần nữa — socket vẫn nối được.'], ['Letting a DB outage connect the socket "to be resilient" — fail closed.', 'Để CSDL sập mà socket vẫn nối "cho bền" — phải đóng khi hỏng.'], ['Skipping roleVersion: a token from before a password change keeps a live socket.', 'Bỏ qua roleVersion: token từ trước lần đổi mật khẩu vẫn giữ được socket sống.']],
  gt: ['The handshake is the one moment a socket proves who it is, so everything that could have invalidated the token since it was issued — the account state and the role version — is checked against the database there, and failures close the door. After it, <code>socket.data.userId</code> is the server’s own record; handlers read it instead of anything the client sends.', 'Lần bắt tay là khoảnh khắc duy nhất socket chứng minh nó là ai, nên mọi thứ có thể làm token mất hiệu lực từ lúc cấp — trạng thái tài khoản và phiên bản vai trò — được kiểm với CSDL ngay tại đó, và hỏng thì đóng cửa. Sau đó <code>socket.data.userId</code> là bản ghi của chính server; các handler đọc nó thay vì thứ client gửi.'],
  kn: ['WebSocket security', 'JWT', 'middleware'],
  tns: [tn('io.use', 'middleware của Socket.IO', 'chạy một lần cho mỗi kết nối'), tn('roleVersion', 'phiên bản vai trò', 'tăng khi đổi mật khẩu/vai trò ⇒ token cũ mất hiệu lực'), tn('fail closed', 'đóng khi hỏng', 'lỗi ⇒ từ chối, không cho qua')],
  fakes: AUTH,
  dau: `/** io.use(socketAuth({ verify, loadUser })) */
function socketAuth({ verify, loadUser }) {
  return async function (socket, next) {
    // Write your solution here
    const token = socket.handshake.auth.token;
    if (!token) next(new Error('NO_TOKEN'));
    try {
      const payload = verify(token);
      socket.data.userId = payload.userId;
    } catch (e) { next(e); }
    next();
  };
}
`,
  giai: '// Reference solution\n' + nguon(socketAuth),
  cases: [
    { goi: 'await handshake(socketAuth({ verify, loadUser }), { token: "ok:7:3" })', moTa: ['A valid token connects', 'Token hợp lệ nối được'] },
    { goi: '[await handshake(socketAuth({ verify, loadUser }), {}), await handshake(socketAuth({ verify, loadUser }), { token: "expired:7:3" }), await handshake(socketAuth({ verify, loadUser }), { token: "forged:1:1" })]', moTa: ['The lesson’s three refusals', 'Ba lần từ chối của bài'] },
    { goi: 'await handshake(socketAuth({ verify, loadUser }), { token: "ok:7:2" })', moTa: ['Token issued before a role change', 'Token cấp trước lần đổi vai trò'] },
    { goi: '[await handshake(socketAuth({ verify, loadUser }), { token: "ok:8:1" }), await handshake(socketAuth({ verify, loadUser }), { token: "ok:404:1" }), loads]', an: true },
    { goi: 'await (async () => { dbDown = true; return [await handshake(socketAuth({ verify, loadUser }), { token: "ok:9:2" })]; })()', an: true },
    { goi: 'await (async () => { const r = await handshake(socketAuth({ verify, loadUser }), { token: "ok:9:2" }); r[1].threads.push(99); return [r, USERS[9].threadIds]; })()', an: true },
  ],
});

/* ─── 4. MEDIUM · js — phân quyền MỖI sự kiện ─── */
function makeThreadHandlers({ db, log }) {
  return {
    async joinThread(socket, threadId, ack) {
      const reply = (r) => { if (typeof ack === 'function') ack(r); };
      const room = 'thread:' + threadId;
      if (!Number.isInteger(threadId) || threadId <= 0) return reply({ ok: false });
      if (socket.rooms.has(room)) return reply({ ok: true });       // auto-joined at connect: no DB round trip
      let allowed = false;
      try {
        // the SAME participation query the REST layer uses — and the user id from socket.data, never from the payload
        allowed = await db.isParticipant(threadId, socket.data.userId);
      } catch (err) {
        log.push({ level: 'error', msg: 'participant check failed', threadId });
        allowed = false;                                             // fail closed
      }
      if (!allowed) {
        socket.emit('thread:join-denied', { threadId });
        log.push({ level: 'warn', msg: 'thread join denied', userId: socket.data.userId, threadId });
        return reply({ ok: false });
      }
      socket.join(room);
      reply({ ok: true });
    },
    typing(socket, payload) {
      const threadId = payload && payload.threadId;
      const room = 'thread:' + threadId;
      if (!socket.rooms.has(room)) return false;                    // not a member ⇒ cannot type into this chat
      socket.to(room).emit('thread:typing', { threadId, userId: socket.data.userId });   // payload.userId is ignored
      return true;
    },
  };
}

const TH = String.raw`
function fakeSocket(id, data, rooms) { const s = { id, data, rooms: new Set([id].concat(rooms || [])), emitted: [], sentTo: [] };
  s.join = (r) => { s.rooms.add(r); }; s.emit = (e, p) => { s.emitted.push([e, p]); }; s.to = (room) => ({ emit: (e, p) => { s.sentTo.push([room, e, p]); } }); return s; }
const PARTS = { 42: [7, 3], 99: [1, 2], 5: [9, 7] };
let dbDown = false; const queries = []; const log = [];
const db = { async isParticipant(threadId, userId) { queries.push([threadId, userId]); await new Promise((r) => setTimeout(r, 5)); if (dbDown) throw new Error('connect ETIMEDOUT'); return (PARTS[threadId] || []).includes(userId); } };
const acks = []; const ack = (r) => acks.push(r);
`;

const E4 = jsBai({
  ten: 'Fix the production hole: authorize thread:join and thread:typing', kho: 'MEDIUM', phut: 20,
  en: `<p>The handler that ran in production: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(\`thread:\${threadId}\`); })</code> — "a type check standing in for a permission check". And <code>thread:typing</code> "had the same shape". Write <code>makeThreadHandlers({ db, log })</code> → <code>{ joinThread, typing }</code> like the fix:</p>
<ul><li><code>async joinThread(socket, threadId, ack?)</code>: not a positive integer → <code>ack({ ok:false })</code>; already in <code>thread:&lt;id&gt;</code> → <code>ack({ ok:true })</code> <b>without a DB call</b>; otherwise <code>await db.isParticipant(threadId, socket.data.userId)</code> — if it throws, log <code>{ level:'error', msg:'participant check failed', threadId }</code> and treat it as refused (fail closed); refused → <code>socket.emit('thread:join-denied', { threadId })</code>, log <code>{ level:'warn', msg:'thread join denied', userId, threadId }</code>, <code>ack({ ok:false })</code>; allowed → join, <code>ack({ ok:true })</code>. <code>ack</code> may be missing.</li>
<li><code>typing(socket, payload)</code>: only if the socket is already in <code>thread:&lt;payload.threadId&gt;</code>: <code>socket.to(room).emit('thread:typing', { threadId, userId: socket.data.userId })</code> and return <code>true</code>; otherwise return <code>false</code>. Never use <code>payload.userId</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Handler từng chạy trên production: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(\`thread:\${threadId}\`); })</code> — "một phép kiểm kiểu đứng thay phép kiểm quyền". Và <code>thread:typing</code> "cũng cùng kiểu". Viết <code>makeThreadHandlers({ db, log })</code> → <code>{ joinThread, typing }</code> như bản vá:</p>
<ul><li><code>async joinThread(socket, threadId, ack?)</code>: không phải số nguyên dương → <code>ack({ ok:false })</code>; đã ở trong <code>thread:&lt;id&gt;</code> → <code>ack({ ok:true })</code> <b>không gọi CSDL</b>; còn lại <code>await db.isParticipant(threadId, socket.data.userId)</code> — ném lỗi thì log <code>{ level:'error', msg:'participant check failed', threadId }</code> và coi như bị từ chối (đóng khi hỏng); bị từ chối → <code>socket.emit('thread:join-denied', { threadId })</code>, log <code>{ level:'warn', msg:'thread join denied', userId, threadId }</code>, <code>ack({ ok:false })</code>; được phép → join, <code>ack({ ok:true })</code>. <code>ack</code> có thể không có.</li>
<li><code>typing(socket, payload)</code>: chỉ khi socket đã ở trong <code>thread:&lt;payload.threadId&gt;</code>: <code>socket.to(room).emit('thread:typing', { threadId, userId: socket.data.userId })</code> và trả <code>true</code>; không thì trả <code>false</code>. Không bao giờ dùng <code>payload.userId</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Order: validate → already a member? → ask the DB (try/catch) → deny or join.', 'Thứ tự: kiểm hợp lệ → đã là thành viên? → hỏi CSDL (try/catch) → từ chối hoặc join.'], ['The user id always comes from <code>socket.data.userId</code>, set by the handshake middleware.', 'Id người dùng luôn lấy từ <code>socket.data.userId</code>, do middleware bắt tay gán.']],
  loi: [['<code>catch { allowed = true }</code> "so users are not blocked when the DB is slow" — fail open is the hole again.', '<code>catch { allowed = true }</code> "để người dùng không bị chặn khi CSDL chậm" — mở khi hỏng là lại lỗ hổng.'], ['Trusting <code>payload.userId</code> in typing: anyone can make "Admin is typing…" appear.', 'Tin <code>payload.userId</code> trong typing: ai cũng làm hiện được "Admin đang gõ…".'], ['Querying the DB for a room the socket was auto-joined to at connect — wasted work on every click.', 'Hỏi CSDL cho room socket đã được tự join lúc connect — tốn công mỗi lần bấm.']],
  gt: ['"Every socket event handler is an endpoint. It just does not look like one." The fix gives each handler what a REST route gets from middleware: an identity from the server (socket.data), a permission check against the same source of truth as REST, a fail-closed path when that check cannot run, and a visible refusal (an event + a log line) — which is the only alerting a socket hole will ever produce.', '"Mỗi handler sự kiện của socket là một endpoint. Chỉ là nó không trông giống." Bản vá cho mỗi handler thứ một route REST nhận từ middleware: danh tính từ server (socket.data), phép kiểm quyền với cùng nguồn sự thật như REST, đường đóng khi phép kiểm không chạy được, và lời từ chối nhìn thấy được (một sự kiện + một dòng log) — thứ báo động duy nhất mà một lỗ socket từng tạo ra.'],
  kn: ['WebSocket security', 'authorization'],
  tns: [tn('IDOR', 'tham chiếu đối tượng không kiểm quyền', 'đổi một id là thấy dữ liệu người khác'), tn('per-event authorization', 'phân quyền theo sự kiện', 'kiểm quyền trong từng socket.on')],
  fakes: TH,
  dau: `/** The thread handlers as they ran in production — fix them. */
function makeThreadHandlers({ db, log }) {
  return {
    async joinThread(socket, threadId, ack) {
      // Write your solution here
      if (typeof threadId === 'number') socket.join('thread:' + threadId);
      if (ack) ack({ ok: true });
    },
    typing(socket, payload) {
      socket.to('thread:' + payload.threadId).emit('thread:typing', { threadId: payload.threadId, userId: payload.userId });
      return true;
    },
  };
}
`,
  giai: '// Reference solution\n' + nguon(makeThreadHandlers),
  cases: [
    { goi: 'await (async () => { const s = fakeSocket("a", { userId: 7 }); const h = makeThreadHandlers({ db, log }); await h.joinThread(s, 99, ack); return [[...s.rooms], s.emitted, acks, log]; })()', moTa: ['The lesson’s attack: user 7 asks for thread 99', 'Đòn của bài: người dùng 7 xin thread 99'] },
    { goi: 'await (async () => { const s = fakeSocket("a", { userId: 7 }); const h = makeThreadHandlers({ db, log }); await h.joinThread(s, 42, ack); return [[...s.rooms], acks, queries]; })()', moTa: ['A participant joins', 'Người trong cuộc vào được'] },
    { goi: 'await (async () => { const s = fakeSocket("a", { userId: 7 }, ["thread:42"]); const h = makeThreadHandlers({ db, log }); await h.joinThread(s, 42, ack); return [acks, queries.length]; })()', moTa: ['Already auto-joined: no DB call', 'Đã tự join: không gọi CSDL'] },
    { goi: '(() => { const s = fakeSocket("a", { userId: 7 }, ["thread:42"]); const h = makeThreadHandlers({ db, log }); return [h.typing(s, { threadId: 42, userId: 1 }), h.typing(s, { threadId: 99 }), s.sentTo]; })()', moTa: ['typing: member only, user id from the socket', 'typing: chỉ thành viên, id người dùng từ socket'] },
    { goi: 'await (async () => { dbDown = true; const s = fakeSocket("a", { userId: 7 }); const h = makeThreadHandlers({ db, log }); await h.joinThread(s, 42, ack); return [[...s.rooms], acks, log, s.emitted]; })()', an: true },
    { goi: 'await (async () => { const s = fakeSocket("a", { userId: 9 }); const h = makeThreadHandlers({ db, log }); try { await h.joinThread(s, 5); await h.joinThread(s, "5"); await h.joinThread(s, 42); } catch (e) { return "crashed " + e.name; } return [[...s.rooms].sort(), queries, s.emitted]; })()', an: true },
  ],
});

/* ─── 5. HARD · js — socket là tín hiệu, REST là sự thật ─── */
function createChatClient({ fetchSince, rejoin }) {
  const byId = new Map();
  let lastSeenId = 0;
  const add = (m) => {
    if (!m || !Number.isInteger(m.id) || byId.has(m.id)) return false;   // the referee: de-duplicate by id
    byId.set(m.id, m);
    if (m.id > lastSeenId) lastSeenId = m.id;
    return true;
  };
  return {
    onSocketMessage(msg) { return add(msg); },                             // fast, tiny, allowed to be lost
    async onReconnect() {
      rejoin();                                                            // a NEW socket has no rooms: join again first
      const since = lastSeenId;
      const missed = await fetchSince(since);                              // GET /messages?since=<last id seen>
      let added = 0;
      for (const m of missed) if (add(m)) added++;                         // the same message may arrive down both paths
      return added;
    },
    messages() { return [...byId.values()].sort((a, b) => a.id - b.id); },
    get lastSeenId() { return lastSeenId; },
  };
}

const CU = String.raw`
const SERVER = [1, 2, 3, 4, 5, 6, 7].map((id) => ({ id, body: 'm' + id }));
const fetched = []; const order = [];
async function fetchSince(id) { order.push('fetch'); fetched.push(id); await new Promise((r) => setTimeout(r, 40)); return SERVER.filter((m) => m.id > id).map((m) => ({ ...m })); }
const rejoin = () => order.push('rejoin');
const ids = (c) => c.messages().map((m) => m.id);
`;

const E5 = jsBai({
  ten: 'Catch up after a reconnect: the socket is the signal, REST is the truth', kho: 'HARD', phut: 25,
  en: `<p>Measurement 4: five messages sent while offline → 0 received after the reconnect, and the socket id changed. The fix "is not a bigger buffer, it is a different division of labour": the socket is the signal, REST is the truth, the client is the referee that "merges both sources and de-duplicates by id — because the same message can arrive down both paths". Write <code>createChatClient({ fetchSince, rejoin })</code> → <code>{ onSocketMessage, onReconnect, messages, lastSeenId }</code>:</p>
<ul><li><code>onSocketMessage(msg)</code> — add <code>msg</code> (<code>{ id, body }</code>, integer id) unless that id is already known; return <code>true</code> if added;</li>
<li><code>lastSeenId</code> (getter) — the highest id seen so far (0 at first);</li>
<li><code>async onReconnect()</code> — call <code>rejoin()</code> first (a new socket has no rooms), then <code>await fetchSince(lastSeenId)</code> (the value at the moment of the call) and add every returned message that is not already known; return how many were added;</li>
<li><code>messages()</code> — all messages sorted by id (socket messages can arrive out of order).</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Phép đo 4: năm tin gửi lúc offline → nhận 0 sau khi kết nối lại, và socket id đổi. Cách sửa "không phải bộ đệm lớn hơn, mà là chia việc khác đi": socket là tín hiệu, REST là sự thật, client là trọng tài "gộp cả hai nguồn và bỏ trùng theo id — vì cùng một tin có thể tới bằng cả hai đường". Viết <code>createChatClient({ fetchSince, rejoin })</code> → <code>{ onSocketMessage, onReconnect, messages, lastSeenId }</code>:</p>
<ul><li><code>onSocketMessage(msg)</code> — thêm <code>msg</code> (<code>{ id, body }</code>, id nguyên) trừ khi id đó đã biết; trả <code>true</code> nếu đã thêm;</li>
<li><code>lastSeenId</code> (getter) — id lớn nhất đã thấy (ban đầu 0);</li>
<li><code>async onReconnect()</code> — gọi <code>rejoin()</code> trước (socket mới không có room), rồi <code>await fetchSince(lastSeenId)</code> (giá trị tại lúc gọi) và thêm mọi tin trả về chưa biết; trả số tin đã thêm;</li>
<li><code>messages()</code> — mọi tin sắp theo id (tin qua socket có thể tới lệch thứ tự).</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['A <code>Map</code> keyed by id is the de-duplicator; <code>lastSeenId</code> is the max of the keys.', 'Một <code>Map</code> khoá theo id là bộ bỏ trùng; <code>lastSeenId</code> là khoá lớn nhất.'], ['A socket message can arrive DURING the fetch — the same add() function handles both paths.', 'Tin qua socket có thể tới TRONG lúc fetch — cùng một hàm add() xử lý cả hai đường.']],
  loi: [['Appending fetched messages to an array: the one that also arrived on the socket shows twice.', 'Nối tin fetch vào mảng: tin cũng tới qua socket hiện hai lần.'], ['Fetching "since the last message in the array" when the array is unsorted: an out-of-order frame makes you skip messages.', 'Fetch "từ tin cuối trong mảng" khi mảng chưa sắp: một frame lệch thứ tự làm bạn bỏ sót tin.'], ['Not re-joining: the REST catch-up works once, then nothing arrives live because the new socket has no rooms.', 'Không join lại: lần bù qua REST chạy một lần, rồi không gì tới trực tiếp vì socket mới không có room.']],
  gt: ['Design so that a lost socket message is a cosmetic delay, never lost data. The socket path is fast and lossy; the REST path is complete because it asks the database "everything after X"; a single de-duplicating merge by id makes the two paths safe to overlap. This is also why connectionStateRecovery is not the answer here: it lives in one process’s memory and does not survive a restart or the redis adapter.', 'Thiết kế sao cho mất một tin socket chỉ là trễ hiển thị, không bao giờ mất dữ liệu. Đường socket nhanh mà có thể mất; đường REST đủ vì nó hỏi CSDL "mọi thứ sau X"; một phép gộp duy nhất có bỏ trùng theo id làm hai đường chồng nhau mà vẫn an toàn. Đó cũng là lý do connectionStateRecovery không phải câu trả lời ở đây: nó nằm trong bộ nhớ một tiến trình và không sống qua một lần khởi động lại hay redis adapter.'],
  kn: ['reliability', 'WebSocket', 'idempotency'],
  tns: [tn('catch-up', 'bù tin', 'lấy qua REST những gì đã lỡ'), tn('de-duplicate', 'bỏ trùng', 'cùng id chỉ giữ một bản')],
  fakes: CU,
  dau: `/** A chat client that survives reconnects. */
function createChatClient({ fetchSince, rejoin }) {
  // Write your solution here
  const list = [];
  return {
    onSocketMessage(msg) { list.push(msg); return true; },
    async onReconnect() { const missed = await fetchSince(list.length ? list[list.length - 1].id : 0); list.push(...missed); return missed.length; },
    messages() { return list; },
    get lastSeenId() { return list.length ? list[list.length - 1].id : 0; },
  };
}
`,
  giai: '// Reference solution\n' + nguon(createChatClient),
  cases: [
    { goi: 'await (async () => { const c = createChatClient({ fetchSince, rejoin }); c.onSocketMessage(SERVER[0]); c.onSocketMessage(SERVER[1]); /* offline: 3..7 lost */ const n = await c.onReconnect(); return [n, ids(c), fetched, order]; })()', moTa: ['Five lost messages come back over REST', 'Năm tin mất quay về qua REST'] },
    { goi: 'await (async () => { const c = createChatClient({ fetchSince, rejoin }); c.onSocketMessage(SERVER[0]); const p = c.onReconnect(); c.onSocketMessage(SERVER[4]); const n = await p; return [n, ids(c)]; })()', moTa: ['Message 5 arrives on both paths: shown once', 'Tin 5 tới bằng cả hai đường: hiện một lần'] },
    { goi: '(() => { const c = createChatClient({ fetchSince, rejoin }); const r = [c.onSocketMessage(SERVER[2]), c.onSocketMessage(SERVER[0]), c.onSocketMessage(SERVER[2])]; return [r, ids(c), c.lastSeenId]; })()', moTa: ['Out of order and duplicated', 'Lệch thứ tự và bị trùng'] },
    { goi: 'await (async () => { const c = createChatClient({ fetchSince, rejoin }); c.onSocketMessage(SERVER[0]); c.onSocketMessage(SERVER[1]); c.onSocketMessage(SERVER[2]); const n = await c.onReconnect(); c.onSocketMessage({ id: 8, body: "m8" }); return [n, fetched, ids(c), c.lastSeenId]; })()', an: true },
    { goi: 'await (async () => { const c = createChatClient({ fetchSince, rejoin }); const a = await c.onReconnect(); const b = await c.onReconnect(); return [a, b, fetched, order, c.onSocketMessage({ id: 7, body: "dup" }), c.onSocketMessage({ id: "8" }), ids(c)]; })()', an: true },
  ],
});

export default modul('nodejs-11-3-xac-thuc-phan-quyen-socket', '11.3 Authenticate once, authorize every time', [E1, E2, E3, E4, E5]);
