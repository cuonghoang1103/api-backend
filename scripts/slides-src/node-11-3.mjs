/**
 * node-11-3 — Node.js · Chapter 11 · Lesson 11.3 "Authenticate once, authorize every time" (slide EN, đợt 9 — 01/11/2026).
 * MỘT deck, HAI tập: node-11-3 (slide 1–13) · node-11-3-2 (slide 14–26).
 *   A: REST mỗi lần vs socket một lần · thông tin xác thực từ đâu · middleware io.use · phép đo 1 năm token (thật) · connect_error không ném lỗi ·
 *      token trong URL nằm trong access log (thật) · trình duyệt không đặt được header cho WebSocket (website 17/09: auth trước, cookie sau) · kiểm lại thứ CSDL vô hiệu ·
 *      phép đo 2: hai handler · cái lỗ (thật: tin riêng tư lọt)
 *   B: vì sao là cả cuộc tấn công (thật: vòng for 200 room, 1 cảnh báo) · website sửa thế nào · mỗi socket.on là một endpoint · phép đo 3 kết nối chết
 *      (thật: FIN 1 ms · 1000+2000 ⇒ 3.003 / 2.000 ms · mặc định 45.003 ms · website 85.003 ms) · phép đo 4 kết nối lại (thật: A 0/5, B 5/5 qua REST,
 *      C recovery 5/5 cùng id, D sau khi server khởi động lại 0/5; với redis-adapter recovery = false) · socket là tín hiệu, REST là sự thật · sáu lỗi · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-11-3-xac-thuc-phan-quyen-socket. Output THẬT: that/c11/{auth-tokens,join-hole,dead-conn,reconnect,rec-adapter} (Node 22.23.3, socket.io 4.8.4,
 *   jsonwebtoken 9.0.3 với khoá GIẢ, @socket.io/redis-adapter 8.3.0 + Redis 7.4.9 trong Docker).
 * Khác web: thời gian phát hiện = pingTimeout nếu pong cũng mất (2.000 ms) tới pingInterval + pingTimeout nếu vừa nhận pong (3.003 ms) — web ghi "đúng bằng tổng" ·
 *   web ghi "Socket.IO không đệm cho socket đã ngắt" — đúng với mặc định; connectionStateRecovery (4.6+) có đệm, nhưng mất khi server khởi động lại và KHÔNG chạy với
 *   redis-adapter cổ điển (website đang dùng) ⇒ đo + bổ sung web. Web ghi website đọc JWT bằng extractToken — nay tokenBatTay đọc handshake.auth trước ⇒ bổ sung web.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-11-3', code: 'NODE 11.3', title: 'Authenticate once, authorize every time', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c11/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const ms = (re) => num(R('dead-conn', re), /after\s+([\d,]+) ms/);
const D = { fin: ms(/^tab closed/), after: ms(/right after a pong/), lost: ms(/pong is lost/), def: ms(/defaults/), site: ms(/this site/) };
const fmt = (n) => n.toLocaleString('en-US');
const flow3 = () => flow([{ t: 'socket: "msg 42 exists"', s: 'may be lost', mau: CAM }, { t: 'client: seen 41?', s: 'de-duplicate by id', mau: LAM }, { t: 'REST: GET ?since=41', s: 'the truth', mau: NODE }], { h: 120 });

export const slides = lamDeck({ chuong: 'Chapter 11 — Realtime with WebSocket and Socket.IO', bai: '11.3' }, [
  { cover: true, t: 'Authenticate once,<br>authorize<br>every time', sub: 'The credential arrives once. A thousand events follow. This lesson measures the hole in between — found in this site\'s own code.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Where a socket's credential comes from — and the one place it must never be</li>
<li>Five tokens through the handshake, and how a refusal really looks on the client</li>
<li>The hole: a logged-in user reading someone else's private chat with one event</li>
<li>How long a dead connection stays "online": 2 seconds to 85 seconds, measured</li>
<li>What reconnecting restores, what it loses, and the design that makes losing OK</li>
</ul>` + box('Why it matters to you', 'Realtime security bugs leave no trace in your REST logs. After this lesson you treat every socket handler as an endpoint, and you design a chat that survives a lift, a tunnel and a deploy.', 'lam') },

  { t: 'REST checks every time. A socket checks once.', to: true, giua: true, body: bang(['', 'REST request', 'socket event'], [
    ['credential travels', 'on EVERY request', 'once, on the handshake'],
    ['middleware runs', 'on every call — hard to forget', 'once, at connect'],
    ['then…', 'the request ends', 'a thousand events through a connection nobody re-checks'],
    ['access log line', 'one per request', 'one for the handshake, none for events'],
  ], { co: 23 }) + box('That asymmetry is where realtime security goes wrong', 'Authentication happens once. Authorization must still happen on every event — and nothing in the framework reminds you.', 'do2') },

  { t: 'Where the credential comes from', to: true, giua: true, body: cards([
    ['1 · socket.handshake.auth.token', 'Sent by the client in the first packet. JS must be able to read the token ⇒ it cannot be an httpOnly cookie. Works on every transport.'],
    ['2 · the Authorization header', 'Fine for non-browser clients. A browser\'s WebSocket API cannot set headers at all.'],
    ['3 · an httpOnly cookie', 'The browser sends it on the handshake by itself; page JavaScript can never read it. The safest for a web app on the same site.'],
  ], 3) + box('Never: the query string', '?token=… ends up in nginx access logs, in Referer headers and in your monitoring tool\'s URL field. Chapter 9\'s lesson, arriving through a different door — slide 8 shows the log line.', 'do2') },

  { t: 'The middleware: io.use runs before connection', to: true, giua: true, body: JW(ma('c11/auth-tokens', 14, 25), 100, [5, 7, 8, 9], { sm: false }) +
    box('Set once', 'socket.data.userId comes from a verified token, never from an event payload.', 'xanh') },

  { t: 'Measurement 1 — five tokens through the handshake', to: true, giua: true, body: TT('c11/auth-tokens', 2, 6, 'node auth-tokens.mjs · jsonwebtoken 9.0.3, a fake lab secret · real', { hl: [1, 2, 3, 4, 5], n: 104, sm: false }) +
    two(box('Four you expected', 'Valid · missing · expired · signed with a guessed key. jwt.verify sorts them in one line.', 'lam'),
      box('The fifth is the one people skip', 'A perfectly valid signature, but the role or the password changed since the token was issued. Only a database check (roleVersion) catches it.', 'cam')) +
    bang(['refusal', 'caught by', 'cost'], [['NO_TOKEN', 'one if', 'free'], ['jwt expired · invalid signature', 'jwt.verify', 'microseconds, no database'], ['TOKEN_STALE · ACCOUNT_DISABLED', 'a user lookup', 'one query per connect — not per event']], { co: 21 }) },

  { t: 'A refusal is an event, not an exception', to: true, giua: true, body: J(`const socket = io(URL, { auth: { token } });
socket.on('connect', () => setStatus('online'));
socket.on('connect_error', (err) => {          // without this line: silence
  setStatus('offline');
  if (err.message === 'TOKEN_STALE' || err.message === 'jwt expired') return refreshThenRetry();
  showError(err.message);
});`, { sm: false, hl: [3, 5] }) +
    TT('c11/auth-tokens', 7, 7, 'node auth-tokens.mjs · does it retry by itself? · real', { hl: [1], n: 104, sm: false }) +
    two(box('What users report', '"Realtime just doesn\'t work." No exception — the client waits for a connect that never comes.', 'do2'),
      box('No automatic retry after a refusal', 'A network drop is retried with backoff; a refusal is final until YOU call socket.connect().', 'cam')) },

  { t: 'Why never in the URL', to: true, giua: true, body: TT('c11/auth-tokens', 8, 9, 'node auth-tokens.mjs · what an access log records when the token rides in the URL · real (cut after the header part)', { hl: [2], n: 104, sm: false }) +
    cards([
      ['Access logs', 'nginx, the load balancer and the app all write the full request line. Logs are kept for months and read by more people than your database.'],
      ['Referer', 'A page opened from that URL may send it to another site.'],
      ['Monitoring', 'Error trackers and APM tools store the URL of every failing request.'],
    ], 3) + box('Same token, safer road', 'handshake.auth travels inside the first packet, not in the URL — this site moved to it for exactly that reason (next slide).', 'xanh') },

  { t: 'How cuongthai.com reads the token', to: true, giua: true, body: JW(`// src/socket/messaging.socket.ts (simplified)
export function tokenBatTay(socket) {
  const tuAuth = socket.handshake.auth?.token;          // 1. auth: passes EVERY transport, never in the URL
  if (typeof tuAuth === 'string' && tuAuth.length > 0) return tuAuth;
  return extractToken(socket.request);                 // 2. the httpOnly backend_token cookie (web)
}`, 100, [3, 5], { sm: false }) +
    two(box('Why auth comes first (measured by the site, 17/09/2026)', 'With transports: [\'websocket\'] a browser opens new WebSocket(uri) — headers cannot be set, so Authorization never arrived and the desktop app (no cookies) was refused on every connect.', 'cam'),
      box('Why the cookie stays', 'The website itself still logs in with the httpOnly cookie, which page JavaScript can never steal.', 'xanh')) },

  { t: 'Re-check what the database may have changed', to: true, giua: true, body: cards([
    ['Account disabled or locked', 'The token is still valid for days. The handshake looks the user up and refuses.'],
    ['Role or password changed', 'roleVersion in the token ≠ roleVersion in the database ⇒ refused (TOKEN_STALE above).'],
    ['But only at connect', 'A socket that connected BEFORE the change stays open. Disconnect the user\'s sockets when you lock them: io.in(`user:${id}`).disconnectSockets().'],
  ], 3) + J(`// when an admin locks user 7 or changes their role:
await prisma.user.update({ where: { id: 7 }, data: { locked: true, roleVersion: { increment: 1 } } });
io.in('user:7').disconnectSockets(true);   // every device of user 7, right now`, { sm: false, hl: [3] }) +
    box('cuongthai.com', 'Its handshake does the checks above: verifies the JWT, refuses disabled or locked accounts, and compares roleVersion against the database.', 'lam') },

  { t: 'Measurement 2 — two handlers', to: true, giua: true, body: JW(`// ❌ THE WRONG WAY — a type check standing in for a permission check
socket.on('join:unsafe', (id) => { if (typeof id === 'number') socket.join(\`thread:\${id}\`); });

// ✅ THE RIGHT WAY — authorize EVERY event
socket.on('join:safe', (id) => {
  if (!socket.data.threads.includes(id)) return socket.emit('thread:join-denied', { threadId: id });
  socket.join(\`thread:\${id}\`);
});`, 100, [2, 6], { sm: false }) + bang(['user', 'belongs to'], [['7 (the attacker, a normal account)', 'thread 42'], ['3 and 4', 'thread 99 — a private conversation']], { co: 22 }) + box('The setup', 'User 7 belongs to thread 42 and nothing else. They connect with a perfectly valid token — every check of the previous slides passes — then ask for thread 99, which belongs to users 3 and 4.', 'lam') },

  { t: 'The hole: authenticated is not authorized', to: true, giua: true, body: TT('c11/join-hole', 2, 4, 'node join-hole.mjs · user 7, a valid login, one event · real', { hl: [2, 3], n: 104, sm: false }) +
    two(box('One event', 'No stolen token, no XSS, no privilege escalation. A logged-in user emitted a number they do not own — and now receives that conversation live, message bodies included.', 'do2'),
      box('The difference', 'join:safe asked "is this user IN this thread?" — the same question the REST layer asks before GET /threads/99.', 'xanh')) +
    box('What the attacker needed', 'A free account and the browser console: socket.emit(\'join:unsafe\', 99). Nothing else.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'do', 'never'], [
    ['credential', 'httpOnly cookie (web) or handshake.auth', 'the query string'],
    ['checked', 'in io.use: signature, expiry, account, roleVersion', 'only the signature'],
    ['the user id', 'socket.data.userId, set at connect', 'a userId from the event payload'],
    ['joining a room', 'a permission check, every time', 'a type check'],
  ], { co: 22 }) + two(box('Remember', 'Authentication: once, at the handshake. Authorization: in every handler.', 'xanh'), box('Next', 'Why that one line was the whole attack, and how the site fixed it — then connections that die without telling anyone.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Why that is the whole attack', to: true, giua: true, body: TT('c11/join-hole', 5, 6, 'node join-hole.mjs · the same attacker, a for-loop · real', { hl: [1, 2], n: 104, sm: false }) +
    cards([
      ['Ids are sequential', 'Thread ids are integers. "Guessing" is a for loop: 200 conversations in a fraction of a second.'],
      ['Nothing in your logs', 'No GET /threads/99, no 403 — events have no URL. The only warning came from the handler that DID check.'],
      ['It ran in production', 'This site\'s thread:join read, in full: if (typeof threadId === \'number\') socket.join(`thread:${threadId}`).'],
    ], 3) + box('Found while writing the web lesson — and fixed', 'Any logged-in account could join any conversation\'s room and receive its messages live. Reproduced, measured, fixed (next slide). The video uses a copy, never the real site.', 'do2') },

  { t: 'How cuongthai.com fixed it', to: true, giua: true, body: JW(`// src/socket/messaging.socket.ts (simplified: the real one wraps this in an async IIFE + try/catch)
socket.on('thread:join', async (threadId) => {
  if (!Number.isInteger(threadId) || threadId <= 0) return;
  if (socket.rooms.has(\`thread:\${threadId}\`)) return;            // fast path: auto-joined at connect
  const allowed = await prisma.messageThread.findFirst({ where: { id: threadId,     // the REST rule
    OR: [{ type: 'ADMIN', OR: [{ userId }, { adminUserId: userId }] }, { type: 'USER', OR: [{ userAId: userId }, { userBId: userId }] }] } });
  if (!allowed) { logger.warn('thread:join denied'); return socket.emit('thread:join-denied', { threadId }); }
  socket.join(\`thread:\${threadId}\`);
});                                       // + a DB error ⇒ fail CLOSED (no join)`, 104, [5, 7], { sm: false }) +
    box('thread:typing had the same shape', 'Anyone could push "… is typing" into a stranger\'s chat. Now: if (!socket.rooms.has(`thread:${id}`)) return; — membership of the room IS the authorization.', 'cam') },

  { t: 'Every socket.on is an endpoint', to: true, giua: true, body: bang(['', 'REST endpoint', 'socket handler'], [
    ['has a URL you can grep for', 'yes', 'no — an event name'],
    ['sits in a route table', 'yes', 'no — scattered socket.on calls'],
    ['middleware chain to hang a check on', 'yes', 'no — you write it inside'],
    ['access log, 403 counter, rate limiter', 'yes', 'no'],
    ['reachable by any logged-in user', 'yes', 'YES'],
  ], { co: 22 }) + box('The rule', 'Review every socket.on like a POST route: who may call it, with which ids, how often? The absence of a URL does not make it less public.', 'do2') },

  { t: 'Measurement 3 — dead, and does not know it', to: true, giua: true, body: TT('c11/dead-conn', 2, 6, 'node dead-conn.mjs · a TCP proxy that silently stops forwarding = a phone walking into a lift · real', { hl: [1, 4, 5], n: 104, sm: false }) +
    two(box('A closed tab', `Sends a TCP FIN: the server knew in ${D.fin} ms.`, 'xanh'),
      box('A phone in a lift', `Sends nothing at all. Socket.IO defaults: ${fmt(D.def)} ms. This site's settings: ${fmt(D.site)} ms. Until then it is "online", in every room, receiving into the void.`, 'do2')) },

  { t: 'Why between pingTimeout and the sum', to: true, giua: true, body: bang(['the lift starts…', 'what the server sees', 'measured (1000 + 2000)'], [
    ['right after a pong arrived', 'waits pingInterval for the next ping, then pingTimeout for its pong', `${fmt(D.after)} ms`],
    ['while a ping is in flight', 'that pong is lost too: only pingTimeout', `${fmt(D.lost)} ms`],
  ], { co: 22 }) + bang(['settings', 'pingInterval + pingTimeout', 'worst case, measured'], [
    ['Socket.IO defaults', '25,000 + 20,000', `${fmt(D.def)} ms`], ['cuongthai.com', '25,000 + 60,000', `${fmt(D.site)} ms`],
  ], { co: 22 }) + box('A trade, not a bug', 'A longer timeout forgives a phone on a bad network; it also shows a ghost as "online" for up to a minute and a half.', 'cam') },

  { t: 'Measurement 4 — what reconnecting restores', to: true, giua: true, body: TT('c11/reconnect', 2, 6, 'node reconnect.mjs · a proxy "unplugs the cable" for 1.5 s; 5 messages are sent meanwhile · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    cards([
      ['A NEW socket id', 'Anything keyed by socket.id is gone.'],
      ['No rooms', 'The new socket is in no room: message 7, sent AFTER reconnecting, was missed too.'],
      ['The offline messages', 'Socket.IO does not keep them by default: 0 of 5.'],
    ], 3) + box('Reconnect took seconds, not milliseconds', 'Exponential backoff: the first retry hit an unplugged cable, the next one waited longer. Users will sit in that gap — design for it.', 'cam') },

  { t: 'The fix: rejoin, then catch up over REST', to: true, giua: true, body: JW(`socket.on('connect', async () => {             // runs on the FIRST connect AND every reconnect
  socket.emit('thread:join', 42);                // rooms are per socket: join again
  const last = Math.max(0, ...seen.keys());      // the newest message id we already have
  const missed = await (await fetch(\`/messages?since=\${last}\`)).json();
  for (const m of missed) if (!seen.has(m.id)) seen.set(m.id, m);   // de-duplicate by id
});`, 100, [2, 4, 5], { sm: false }) +
    TT('c11/reconnect', 7, 11, 'node reconnect.mjs · same cable, same 5 messages · real', { hl: [4, 5], n: 104, sm: false }) +
    box('Why it works', 'The database already has every message — the socket only told you SOMETHING happened. Ask the truth for what you missed, then keep listening.', 'xanh') },

  { t: 'connectionStateRecovery — and where it stops', to: true, giua: true, body: TT('c11/reconnect', 12, 21, 'node reconnect.mjs · Socket.IO ≥ 4.6 can buffer for a disconnected socket · real', { hl: [3, 4, 8, 9], n: 104, sm: false }) +
    TT('c11/rec-adapter', 2, 3, 'node rec-adapter.mjs · the same recovery behind the classic Redis adapter · real', { hl: [2], n: 104, sm: false }) +
    box('Nice, not a guarantee', 'It works on one process, for a short gap. A deploy restarts the process; the classic @socket.io/redis-adapter (what this site uses) does not support it. The REST catch-up is still the safety net.', 'cam') },

  { t: 'The socket is the signal. REST is the truth.', to: true, giua: true, body: cards([
    ['The socket = the signal', '"Something new exists, with an id above X." Fast, tiny — and allowed to be lost.'],
    ['REST = the truth', 'On every connect: GET /messages?since=&lt;last id&gt; fetches exactly what was missed.'],
    ['The client = the referee', 'Merges both sources and de-duplicates by id, because the same message can arrive down both paths.'],
  ], 3) + flow3() + box('The test of your design', 'A lost socket message must be a cosmetic delay, never lost data. If correctness depends on a frame arriving, you have built a message queue out of a UI transport.', 'do2') },

  { t: 'Six realtime security and reliability mistakes', to: true, giua: true, body: cards([
    ['Checks only at the handshake', 'That is authentication. Authorization belongs in every handler.'],
    ['Token in the query string', 'It lands in access logs and Referer headers.'],
    ['Trusting userId from the payload', 'Read socket.data.userId, set at connect.'],
    ['No rate limit per socket', 'One connection can emit thousands of events a second; your HTTP limiter never sees them.'],
    ['Assuming disconnect is prompt', `With defaults: up to ${Math.round(D.def / 1000)} s of a ghost "online".`],
    ['No catch-up path', 'Works perfectly until the first tunnel, lift or deploy.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: J(`const io = new Server(httpServer);
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;                  // (a)
  socket.on('doc:open', (docId) => socket.join(\`doc:\${docId}\`));  // (b)
  socket.on('doc:edit', ({ docId, patch }) => {                  // (c)
    io.to(\`doc:\${docId}\`).emit('doc:patch', patch);
  });
});`, { sm: false, hl: [3, 4, 5] }) + box('Exercise', 'A collaborative document editor. Find the three holes from this lesson and fix each.', '') +
    `<div data-k="dapan">${box('Answer', '(a) No authentication at all: anyone types any userId in the URL ⇒ io.use with a verified token, read socket.data.userId. (b) Any user opens any document ⇒ check that the user may READ docId before join, and answer with an ack. (c) Any socket can edit any document — even one it never opened ⇒ require socket.rooms.has(`doc:${docId}`) AND write permission, and rate-limit per socket.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Where should a browser's socket credential travel, and where never?</li>
<li>A valid JWT, but the user's role changed yesterday. What catches it?</li>
<li>Why did the join:unsafe hole leave nothing in the REST access log?</li>
<li>With Socket.IO defaults, up to how long is a vanished phone still "online"?</li>
<li>After a reconnect, what must the client do in its connect handler?</li>
</ol>
<div data-k="dapan">${box('Answers', `1. An httpOnly cookie or handshake.auth — never the query string. &nbsp;2. A roleVersion check against the database at the handshake. &nbsp;3. Events have no URL — there is no request line to log. &nbsp;4. pingInterval + pingTimeout: ${fmt(D.def)} ms measured. &nbsp;5. Rejoin its rooms and GET what it missed since the last id, de-duplicating by id.`, 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Authenticate once in io.use (signature, expiry, account, roleVersion); never put the token in the URL</li>
<li>Authorize every socket.on — one unchecked join let a logged-in user read a stranger's private chat</li>
<li>A dead connection is noticed after ${fmt(D.lost)}–${fmt(D.after)} ms with 1 s + 2 s pings; ${fmt(D.def)} ms with defaults</li>
<li>Reconnect = new id, no rooms, lost messages ⇒ rejoin + REST catch-up; recovery helps, but not across a deploy</li>
</ul>` + box('Next: lesson 11.4', 'More than one process: the bug that produces no error, the Redis adapter, sticky sessions — and one slow client eating 186 MB.', 'lam') },
]);
