/** Node.js · Lab 11 — Realtime cho các cuộc trò chuyện của Notes: phía server (xác thực một lần, phân quyền mọi sự kiện, tự join, giới hạn) và phía client (kết nối lại có jitter, join lại, bù tin qua REST, bỏ trùng). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── L1. EASY · choice — duyệt thiết kế ─── */
const L1 = {
  ...cs({
    ten: 'Lab 11 · 1 — Design review of the realtime layer', kho: 'EASY', phut: 10,
    en: 'Before you build it: five design decisions for realtime Notes threads, each one taken from a measurement in Chapter 11.',
    vi: 'Trước khi dựng: năm quyết định thiết kế cho realtime của các cuộc trò chuyện Notes, mỗi cái lấy từ một phép đo của Chương 11.',
    cau: [
      q('d1', ['A user sits on /messages without clicking into a conversation, and the unread badge never updates. What is the fix this site shipped?', 'Người dùng ngồi ở /messages mà chưa bấm vào cuộc trò chuyện nào, và huy hiệu chưa đọc không bao giờ cập nhật. Bản sửa site này đã làm là gì?'],
        ['Auto-join every thread room of the user at connect (one query), then keep explicit joins for new threads', 'Poll /messages/unread every 2 seconds on that page', 'Emit new messages with io.emit so everyone receives them', 'Join the thread room only when the conversation is opened, and refresh the page otherwise'],
        ['The comment in messaging.socket.ts records exactly this symptom. Auto-join at connect also means a reconnect restores the rooms by itself.', 'Chú thích trong messaging.socket.ts ghi đúng triệu chứng này. Tự join lúc connect cũng có nghĩa lần kết nối lại tự khôi phục room.']),
      q('d2', ['What should <code>thread:new-message</code> carry, given that frames can be lost?', '<code>thread:new-message</code> nên mang gì, khi frame có thể bị mất?'],
        ['The message with its id — the client de-duplicates by id and catches up with GET ?since=&lt;last id&gt; on reconnect', 'Only the text, because ids would let attackers guess other threads', 'Nothing — clients should poll every second instead', 'The whole thread history, so a lost frame is repaired by the next one'],
        ['The socket is the signal, REST is the truth, the client is the referee. (A tiny signal like feed:has-new — a count only — is the extreme form of the same idea.)', 'Socket là tín hiệu, REST là sự thật, client là trọng tài. (Một tín hiệu nhỏ như feed:has-new — chỉ một con số — là dạng cực đoan của cùng ý tưởng.)']),
      q('d3', ['One client can emit thousands of events per second. Where does the limit belong?', 'Một client có thể emit hàng nghìn sự kiện mỗi giây. Giới hạn đặt ở đâu?'],
        ['Per socket, inside the socket layer — none of these events touch the HTTP rate limiter', 'In nginx, which counts WebSocket frames like requests', 'In express-rate-limit, which also wraps socket.on handlers', 'Nowhere: Socket.IO drops events above 100 per second by default'],
        ['Mistake (4) of 11.3. After the 101, frames never pass through Express middleware again.', 'Lỗi (4) của 11.3. Sau 101, frame không bao giờ đi qua middleware Express nữa.']),
      q('d4', ['The client’s reconnect uses a fixed 1-second retry. What happens after a deploy restarts the only backend?', 'Client kết nối lại với khoảng thử cố định 1 giây. Chuyện gì xảy ra sau khi deploy khởi động lại backend duy nhất?'],
        ['All clients reconnect in the same second, again and again — a self-inflicted flood; use capped, jittered backoff', 'Nothing bad: Socket.IO queues the reconnects on the server side and admits them one by one', 'Only the first client reconnects; the others wait until the server pushes them a wake-up event', 'The clients fall back to long-polling automatically, which spreads the load and avoids the problem'],
        ['Mistake (5) of 11.4: stagger the deploy or jitter the backoff.', 'Lỗi (5) của 11.4: deploy so le hoặc thêm jitter cho backoff.']),
      qn('d5', ['Which checks belong in <code>thread:send</code>? (choose all)', 'Những phép kiểm nào thuộc về <code>thread:send</code>? (chọn mọi câu đúng)'],
        ['The socket is a member of thread:&lt;id&gt; (authorize this event, not just the handshake)', 'authorId comes from socket.data.userId, never from the payload', 'The body length is bounded before it is stored', 'The message is persisted BEFORE it is emitted to the room', 'The Origin header of the frame matches the site'],
        [0, 1, 2, 3],
        ['Frames do not carry headers — the Origin was checkable only at the handshake. Persist first so the REST catch-up and the live emit tell the same story.', 'Frame không mang header — Origin chỉ kiểm được lúc bắt tay. Lưu trước để bù tin qua REST và emit trực tiếp kể cùng một câu chuyện.']),
    ],
    goiY: [['Every answer is a measurement from 11.1–11.4: find it.', 'Mỗi đáp án là một phép đo của 11.1–11.4: hãy tìm nó.'], ['Ask "what if this frame is lost / sent twice / sent by someone else?".', 'Hỏi "nếu frame này mất / gửi hai lần / do người khác gửi thì sao?".']],
    loi: [['Joining rooms only when the UI opens a thread.', 'Chỉ join room khi UI mở một cuộc trò chuyện.'], ['Treating the socket as reliable delivery.', 'Coi socket là kênh giao tin đáng tin cậy.']],
    tns: [tn('auto-join', 'tự vào phòng', 'join mọi room của người dùng lúc connect')],
    kn: ['WebSocket', 'design'],
  }),
  dangBai: 'lab',
};

/* ─── L2. HARD · js — phía server ─── */
function createRealtime({ verify, loadUser, db, io, log, limit }) {
  const windows = new Map();     // socket -> { start, count }: a per-SOCKET rate limit (the HTTP limiter never sees frames)
  const allowEvent = (socket) => {
    const now = Date.now();
    const w = windows.get(socket);
    if (!w || now - w.start >= limit.windowMs) { windows.set(socket, { start: now, count: 1 }); return true; }
    w.count++;
    return w.count <= limit.max;
  };
  return {
    // ---- authenticate ONCE: handshake ----
    async connect(socket) {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return { ok: false, error: 'NO_TOKEN' };
      let payload;
      try { payload = verify(token); } catch (e) { return { ok: false, error: e.message }; }
      let user;
      try { user = await loadUser(payload.userId); } catch { return { ok: false, error: 'AUTH_UNAVAILABLE' }; }
      if (!user) return { ok: false, error: 'USER_NOT_FOUND' };
      if (user.disabled || user.locked) return { ok: false, error: 'ACCOUNT_DISABLED' };
      if (user.roleVersion !== payload.roleVersion) return { ok: false, error: 'TOKEN_STALE' };
      socket.data.userId = user.id;
      socket.join('user:' + user.id);
      // auto-join every thread at connect (one query) — a reconnect restores the rooms by itself
      for (const t of await db.threadsOf(user.id)) socket.join('thread:' + t);
      return { ok: true };
    },
    // ---- authorize EVERY time: each event is an endpoint ----
    async on(socket, event, payload, ack) {
      const reply = (r) => { if (typeof ack === 'function') ack(r); };
      if (!allowEvent(socket)) return reply({ ok: false, reason: 'RATE_LIMITED' });
      const p = payload || {};
      const room = 'thread:' + p.threadId;
      const validId = Number.isInteger(p.threadId) && p.threadId > 0;
      if (event === 'thread:join') {
        if (!validId) return reply({ ok: false, reason: 'BAD_THREAD_ID' });
        if (socket.rooms.has(room)) return reply({ ok: true });
        let allowed = false;
        try { allowed = await db.isParticipant(p.threadId, socket.data.userId); } catch { allowed = false; }   // fail closed
        if (!allowed) {
          socket.emit('thread:join-denied', { threadId: p.threadId });
          log.push({ level: 'warn', msg: 'thread join denied', userId: socket.data.userId, threadId: p.threadId });
          return reply({ ok: false, reason: 'NOT_PARTICIPANT' });
        }
        socket.join(room);
        return reply({ ok: true });
      }
      if (event === 'thread:typing') {
        if (!validId || !socket.rooms.has(room)) return reply({ ok: false, reason: 'NOT_MEMBER' });
        socket.to(room).emit('thread:typing', { threadId: p.threadId, userId: socket.data.userId });   // not back to me
        return reply({ ok: true });
      }
      if (event === 'thread:send') {
        if (!validId || !socket.rooms.has(room)) return reply({ ok: false, reason: 'NOT_MEMBER' });
        if (typeof p.body !== 'string' || !p.body.trim() || p.body.length > 2000) return reply({ ok: false, reason: 'BAD_BODY' });
        // persist FIRST: the REST catch-up and the live emit must tell the same story
        const msg = await db.addMessage({ threadId: p.threadId, authorId: socket.data.userId, body: p.body });
        io.to(room).emit('thread:new-message', { id: msg.id, threadId: p.threadId, authorId: socket.data.userId, body: p.body });
        return reply({ ok: true, id: msg.id });
      }
      return reply({ ok: false, reason: 'UNKNOWN_EVENT' });
    },
  };
}

const SRV = String.raw`
const USERS = { 7: { id: 7, roleVersion: 3 }, 3: { id: 3, roleVersion: 1 }, 8: { id: 8, roleVersion: 1, disabled: true } };
function verify(t) { const [kind, id, rv] = String(t).split(':'); if (kind === 'expired') throw new Error('jwt expired'); if (kind !== 'ok') throw new Error('invalid signature'); return { userId: Number(id), roleVersion: Number(rv) }; }
async function loadUser(id) { await new Promise((r) => setTimeout(r, 2)); return USERS[id] || null; }
const PARTS = { 42: [7, 3], 43: [7], 99: [1, 2], 50: [3] };
const MSGS = []; let dbDown = false;
const db = {
  async threadsOf(u) { return Object.keys(PARTS).map(Number).filter((t) => PARTS[t].includes(u) && t !== 50 && t !== 43); },   // 43 is new: not auto-joined yet
  async isParticipant(t, u) { await new Promise((r) => setTimeout(r, 3)); if (dbDown) throw new Error('ETIMEDOUT'); return (PARTS[t] || []).includes(u); },
  async addMessage(m) { await new Promise((r) => setTimeout(r, 3)); const row = { id: MSGS.length + 1, ...m }; MSGS.push(row); return row; },
};
const roomLog = []; const io = { to: (room) => ({ emit: (e, p) => roomLog.push(['io', room, e, p]) }) };
const log = [];
function sock(id, token) { const s = { id, handshake: { auth: token === undefined ? {} : { token } }, data: {}, rooms: new Set([id]), emitted: [] };
  s.join = (r) => s.rooms.add(r); s.emit = (e, p) => s.emitted.push([e, p]); s.to = (room) => ({ emit: (e, p) => roomLog.push(['to', room, e, p]) }); return s; }
const LIMIT = { max: 20, windowMs: 1000 };
const acks = []; const ack = (r) => acks.push(r);
`;

const STARTER_SRV = `/** The realtime layer of Notes threads (one process). */
function createRealtime({ verify, loadUser, db, io, log, limit }) {
  // Write your solution here
  return {
    async connect(socket) {
      const payload = verify(socket.handshake.auth.token);
      socket.data.userId = payload.userId;
      socket.join('user:' + payload.userId);
      return { ok: true };
    },
    async on(socket, event, payload, ack) {
      if (event === 'thread:join') { socket.join('thread:' + payload.threadId); return ack && ack({ ok: true }); }
      if (event === 'thread:typing') { socket.to('thread:' + payload.threadId).emit('thread:typing', payload); return ack && ack({ ok: true }); }
      if (event === 'thread:send') {
        io.to('thread:' + payload.threadId).emit('thread:new-message', payload);
        const msg = await db.addMessage({ threadId: payload.threadId, authorId: payload.authorId, body: payload.body });
        return ack && ack({ ok: true, id: msg.id });
      }
    },
  };
}
`;

const L2 = jsBai({
  ten: 'Lab 11 · 2 — The server side: authenticate once, authorize every event', kho: 'HARD', phut: 45, diem: 40, dangBai: 'lab',
  en: `<p>Build the realtime layer of Notes threads for one process. <code>createRealtime({ verify, loadUser, db, io, log, limit })</code> → <code>{ connect(socket), on(socket, event, payload, ack) }</code>. Fakes: <code>socket = { handshake, data, rooms (Set), join, emit, to(room).emit }</code>, <code>io.to(room).emit</code>, <code>db = { threadsOf(userId), isParticipant(threadId, userId), addMessage({ threadId, authorId, body }) → { id, … } }</code> (all async).</p>
<p><b><code>async connect(socket)</code></b> → <code>{ ok:true }</code> or <code>{ ok:false, error }</code>: token from <code>handshake.auth.token</code> (missing → <code>NO_TOKEN</code>); <code>verify</code> throws → its <code>message</code>; <code>loadUser</code> throws → <code>AUTH_UNAVAILABLE</code>; no user → <code>USER_NOT_FOUND</code>; disabled/locked → <code>ACCOUNT_DISABLED</code>; roleVersion differs → <code>TOKEN_STALE</code>. Then <code>socket.data.userId</code>, join <code>user:&lt;id&gt;</code> and <b>every</b> <code>thread:&lt;id&gt;</code> from <code>db.threadsOf</code>.</p>
<p><b><code>async on(…)</code></b> — every reply goes through <code>ack</code> if it is a function:</p>
<ul><li>rate limit <b>per socket</b>: at most <code>limit.max</code> events per fixed window of <code>limit.windowMs</code> (window starts at the first event, <code>Date.now()</code>) → over it: <code>{ ok:false, reason:'RATE_LIMITED' }</code>;</li>
<li><code>thread:join {threadId}</code>: as in 11.3 — bad id → <code>BAD_THREAD_ID</code>; already a member → <code>{ ok:true }</code> without a DB call; <code>db.isParticipant</code> (throws ⇒ refused) false → emit <code>thread:join-denied {threadId}</code>, log <code>{ level:'warn', msg:'thread join denied', userId, threadId }</code>, <code>NOT_PARTICIPANT</code>; else join, <code>{ ok:true }</code>;</li>
<li><code>thread:typing {threadId}</code>: member only (else <code>NOT_MEMBER</code>) → <code>socket.to(room).emit('thread:typing', { threadId, userId })</code>, <code>{ ok:true }</code>;</li>
<li><code>thread:send {threadId, body}</code>: member only (<code>NOT_MEMBER</code>); body a string, non-empty after trim, ≤ 2000 chars (<code>BAD_BODY</code>); <b>persist first</b> with <code>authorId = socket.data.userId</code>, then <code>io.to(room).emit('thread:new-message', { id, threadId, authorId, body })</code>, reply <code>{ ok:true, id }</code>;</li>
<li>anything else → <code>UNKNOWN_EVENT</code>. Refusals are <code>{ ok:false, reason }</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Dựng tầng realtime cho các cuộc trò chuyện Notes, một tiến trình. <code>createRealtime({ verify, loadUser, db, io, log, limit })</code> → <code>{ connect(socket), on(socket, event, payload, ack) }</code>. Đồ giả: <code>socket = { handshake, data, rooms (Set), join, emit, to(room).emit }</code>, <code>io.to(room).emit</code>, <code>db = { threadsOf(userId), isParticipant(threadId, userId), addMessage({ threadId, authorId, body }) → { id, … } }</code> (đều async).</p>
<p><b><code>async connect(socket)</code></b> → <code>{ ok:true }</code> hoặc <code>{ ok:false, error }</code>: token từ <code>handshake.auth.token</code> (thiếu → <code>NO_TOKEN</code>); <code>verify</code> ném lỗi → <code>message</code> của nó; <code>loadUser</code> ném lỗi → <code>AUTH_UNAVAILABLE</code>; không có user → <code>USER_NOT_FOUND</code>; bị vô hiệu/khoá → <code>ACCOUNT_DISABLED</code>; roleVersion lệch → <code>TOKEN_STALE</code>. Rồi gán <code>socket.data.userId</code>, join <code>user:&lt;id&gt;</code> và <b>mọi</b> <code>thread:&lt;id&gt;</code> từ <code>db.threadsOf</code>.</p>
<p><b><code>async on(…)</code></b> — mọi câu trả lời đi qua <code>ack</code> nếu nó là hàm:</p>
<ul><li>giới hạn <b>theo socket</b>: tối đa <code>limit.max</code> sự kiện trong một cửa sổ cố định <code>limit.windowMs</code> (cửa sổ bắt đầu ở sự kiện đầu, theo <code>Date.now()</code>) → vượt: <code>{ ok:false, reason:'RATE_LIMITED' }</code>;</li>
<li><code>thread:join {threadId}</code>: như 11.3 — id sai → <code>BAD_THREAD_ID</code>; đã là thành viên → <code>{ ok:true }</code> không gọi CSDL; <code>db.isParticipant</code> (ném lỗi ⇒ từ chối) false → emit <code>thread:join-denied {threadId}</code>, log <code>{ level:'warn', msg:'thread join denied', userId, threadId }</code>, <code>NOT_PARTICIPANT</code>; còn lại join, <code>{ ok:true }</code>;</li>
<li><code>thread:typing {threadId}</code>: chỉ thành viên (không thì <code>NOT_MEMBER</code>) → <code>socket.to(room).emit('thread:typing', { threadId, userId })</code>, <code>{ ok:true }</code>;</li>
<li><code>thread:send {threadId, body}</code>: chỉ thành viên (<code>NOT_MEMBER</code>); body là chuỗi, không rỗng sau trim, ≤ 2000 ký tự (<code>BAD_BODY</code>); <b>lưu trước</b> với <code>authorId = socket.data.userId</code>, rồi <code>io.to(room).emit('thread:new-message', { id, threadId, authorId, body })</code>, trả <code>{ ok:true, id }</code>;</li>
<li>còn lại → <code>UNKNOWN_EVENT</code>. Lời từ chối là <code>{ ok:false, reason }</code>.</li></ul>${MOI_TRUONG.vi}`,
  yc: [['Reuse your code from 11.2 and 11.3 (socketAuth, makeThreadHandlers, the ack pattern).', 'Dùng lại code của bạn ở 11.2 và 11.3 (socketAuth, makeThreadHandlers, mẫu ack).'], ['Never read a user id from a payload.', 'Không bao giờ đọc id người dùng từ payload.']],
  goiY: [['Do the rate-limit check first in <code>on</code>, then dispatch on <code>event</code>.', 'Kiểm giới hạn trước tiên trong <code>on</code>, rồi mới phân nhánh theo <code>event</code>.'], ['Keep the per-socket windows in a <code>Map</code> created once in createRealtime, keyed by the socket object.', 'Giữ cửa sổ của từng socket trong một <code>Map</code> tạo một lần trong createRealtime, khoá là object socket.'], ['For send: membership → body → <code>await db.addMessage</code> → emit → ack. In that order.', 'Với send: thành viên → body → <code>await db.addMessage</code> → emit → ack. Đúng thứ tự đó.']],
  loi: [['Emitting before persisting: a client that catches up over REST misses a message others saw live (or sees one that was never saved).', 'Emit trước khi lưu: client bù tin qua REST lỡ một tin người khác đã thấy trực tiếp (hoặc thấy một tin chưa từng được lưu).'], ['authorId from the payload: anyone can post as anyone.', 'authorId từ payload: ai cũng đăng được dưới tên người khác.'], ['A global rate-limit counter instead of per socket: one noisy client silences everyone.', 'Bộ đếm giới hạn toàn cục thay vì theo socket: một client ồn ào làm cả hệ thống im lặng.']],
  gt: ['The two halves of the chapter meet here. The handshake is the single authentication point, re-checked against the database and failing closed; after it, every handler is treated as an endpoint with its own authorization, its own input validation and its own rate limit — because after the 101 none of the HTTP middleware runs again. Auto-joining at connect fixes the frozen badge and makes reconnects self-healing; persisting before emitting keeps the live path and the REST catch-up consistent.', 'Hai nửa của chương gặp nhau ở đây. Lần bắt tay là điểm xác thực duy nhất, kiểm lại với CSDL và đóng khi hỏng; sau đó mỗi handler được coi là một endpoint với phân quyền riêng, kiểm đầu vào riêng và giới hạn riêng — vì sau 101 không middleware HTTP nào chạy nữa. Tự join lúc connect sửa huy hiệu bị đứng và làm lần kết nối lại tự lành; lưu trước khi emit giữ đường trực tiếp và đường bù tin qua REST nhất quán.'],
  kn: ['WebSocket security', 'authorization', 'rate limiting', 'Socket.IO'],
  tns: [tn('fixed window', 'cửa sổ cố định', 'đếm sự kiện trong từng khoảng thời gian'), tn('persist-then-emit', 'lưu rồi mới phát', 'dữ liệu có trong CSDL trước khi báo')],
  fakes: SRV,
  dau: STARTER_SRV,
  giai: '// Reference solution\n' + nguon(createRealtime),
  cases: [
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const s = sock("JBrW", "ok:7:3"); const r = await rt.connect(s); return [r, s.data, [...s.rooms].sort()]; })()', moTa: ['connect: auto-join user + threads', 'connect: tự join user + các thread'] },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); return [await rt.connect(sock("a")), await rt.connect(sock("b", "expired:7:3")), await rt.connect(sock("c", "ok:7:2")), await rt.connect(sock("d", "ok:8:1"))]; })()', moTa: ['Refused handshakes', 'Các lần bắt tay bị từ chối'] },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const s = sock("a", "ok:7:3"); await rt.connect(s); await rt.on(s, "thread:join", { threadId: 99 }, ack); await rt.on(s, "thread:join", { threadId: 43 }, ack); return [acks, s.emitted, log, s.rooms.has("thread:99"), s.rooms.has("thread:43")]; })()', moTa: ['join: a stranger’s thread refused, a new own thread joined', 'join: thread của người lạ bị từ chối, thread mới của mình được vào'] },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const s = sock("a", "ok:7:3"); await rt.connect(s); await rt.on(s, "thread:send", { threadId: 42, body: "Chuyển khoản 50 triệu nhé", authorId: 1 }, ack); return [acks, MSGS, roomLog]; })()', moTa: ['send: persisted first, authorId from the socket', 'send: lưu trước, authorId từ socket'] },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const s = sock("a", "ok:7:3"); await rt.connect(s); await rt.on(s, "thread:send", { threadId: 99, body: "x" }, ack); await rt.on(s, "thread:send", { threadId: 42, body: "   " }, ack); await rt.on(s, "thread:send", { threadId: 42, body: "x".repeat(2001) }, ack); await rt.on(s, "thread:typing", { threadId: 99, userId: 1 }, ack); await rt.on(s, "thread:typing", { threadId: 42, userId: 1 }, ack); await rt.on(s, "admin:wipe", {}, ack); return [acks, MSGS.length, roomLog]; })()', an: true },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const a = sock("a", "ok:7:3"), b = sock("b", "ok:3:1"); await rt.connect(a); await rt.connect(b); for (let i = 0; i < 25; i++) await rt.on(a, "thread:typing", { threadId: 42 }, ack); await rt.on(b, "thread:typing", { threadId: 42 }, ack); await new Promise((r) => setTimeout(r, 1000)); await rt.on(a, "thread:typing", { threadId: 42 }, ack); return [acks.filter((x) => x.reason === "RATE_LIMITED").length, acks[acks.length - 2], acks[acks.length - 1]]; })()', an: true },
    { goi: 'await (async () => { const rt = createRealtime({ verify, loadUser, db, io, log, limit: LIMIT }); const s = sock("a", "ok:7:3"); await rt.connect(s); dbDown = true; await rt.on(s, "thread:join", { threadId: 43 }, ack); await rt.on(s, "thread:join", { threadId: 42 }, ack); await rt.on(s, "thread:join", { threadId: "43" }); return [acks, s.rooms.has("thread:43")]; })()', an: true },
  ],
});

/* ─── L3. HARD · js — phía client ─── */
function createThreadClient({ connect, fetchSince, threadIds, baseMs, maxMs, random }) {
  const byId = new Map();
  let lastSeenId = 0, attempt = 0, timer = null, stopped = false, socket = null;
  const add = (m) => {
    if (!m || !Number.isInteger(m.id) || byId.has(m.id)) return;     // de-duplicate by id: both paths may deliver it
    byId.set(m.id, m);
    if (m.id > lastSeenId) lastSeenId = m.id;
  };
  const schedule = () => {
    if (stopped) return;
    const delay = Math.floor(Math.min(maxMs, baseMs * 2 ** attempt) * (0.5 + random() / 2));   // capped, jittered
    attempt++;
    timer = setTimeout(open, delay);
  };
  const open = () => {
    timer = null;
    if (stopped) return;
    connect().then(async (s) => {
      if (stopped) { s.close(); return; }
      socket = s;
      attempt = 0;
      s.onmessage = add;                                               // live path: fast, may be lost
      s.onclose = () => { socket = null; schedule(); };
      for (const id of threadIds) s.emit('thread:join', id);          // new socket, no rooms: join again
      const missed = await fetchSince(lastSeenId);                      // truth path: everything after what we saw
      missed.forEach(add);
    }, schedule);
  };
  return {
    start() { stopped = false; open(); },
    stop() { stopped = true; if (timer) clearTimeout(timer); timer = null; if (socket) socket.close(); },
    messages() { return [...byId.values()].sort((a, b) => a.id - b.id); },
    get lastSeenId() { return lastSeenId; },
  };
}

const CLI = String.raw`
// the server's database: message i is created at virtual time i*300 ms (ids 1..10)
const DB = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, at: (i + 1) * 300, body: 'm' + (i + 1) }));
const T0 = Date.now(); const now = () => Date.now() - T0;
const calls = [], joins = [], fetches = [];
// plan[i]: 'fail' or { openFor: ms } — a connected socket receives LIVE every message created while it is open
function makeServer(plan) { let i = 0;
  return () => { calls.push(now()); const p = i < plan.length ? plan[i++] : 'fail';
    return new Promise((res, rej) => setTimeout(() => { if (p === 'fail') return rej(new Error('ECONNREFUSED'));
      const s = { open: true, onmessage: null, onclose: null, emit: (e, id) => joins.push([now(), e, id]), close() { s.open = false; } };
      for (const m of DB) { const wait = m.at - now(); if (wait >= 0) setTimeout(() => { if (s.open && s.onmessage) s.onmessage({ id: m.id, body: m.body }); }, wait); }
      setTimeout(() => { if (s.open) { s.open = false; if (s.onclose) s.onclose(); } }, p.openFor);
      res(s); }, 10)); }; }
async function fetchSince(id) { fetches.push([now(), id]); await new Promise((r) => setTimeout(r, 20)); return DB.filter((m) => m.id > id && m.at <= now()).map((m) => ({ id: m.id, body: m.body })); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const half = () => 0.5;
const ids = (c) => c.messages().map((m) => m.id);
`;

const L3 = jsBai({
  ten: 'Lab 11 · 3 — The client that survives tunnels, lifts and deploys', kho: 'HARD', phut: 40, diem: 40, dangBai: 'lab',
  en: `<p>Combine 11.1 and 11.3 into the client of a Notes thread. <code>createThreadClient({ connect, fetchSince, threadIds, baseMs, maxMs, random })</code> → <code>{ start(), stop(), messages(), lastSeenId }</code>:</p>
<ul><li><code>connect()</code> → Promise of a socket <code>{ onmessage, onclose, emit(event, arg), close() }</code>, or a rejection;</li>
<li>on every successful connect: reset the backoff; set <code>onmessage</code> (each live message <code>{ id, body }</code> is added unless its id is known); set <code>onclose</code>; <code>emit('thread:join', id)</code> for each of <code>threadIds</code>; then <code>await fetchSince(lastSeenId)</code> and add every message not already known — <b>including on the first connect</b> (initial load);</li>
<li>on a failed connect or a close: retry after <code>floor(min(maxMs, baseMs·2<sup>attempt</sup>) × (0.5 + random()/2))</code> ms, then <code>attempt++</code>;</li>
<li><code>stop()</code> cancels a pending retry and closes the socket; nothing reconnects after it;</li>
<li><code>messages()</code> sorted by id, no duplicates; <code>lastSeenId</code> = highest id seen.</li></ul>
<p>The fake server creates message <i>i</i> at virtual time <i>i</i>·300 ms and delivers it live only to a socket open at that moment; <code>fetchSince</code> takes 20 ms and returns what exists at its answer time — so the same message can arrive both ways.</p>${MOI_TRUONG.en}`,
  vi: `<p>Gộp 11.1 và 11.3 thành client của một cuộc trò chuyện Notes. <code>createThreadClient({ connect, fetchSince, threadIds, baseMs, maxMs, random })</code> → <code>{ start(), stop(), messages(), lastSeenId }</code>:</p>
<ul><li><code>connect()</code> → Promise của một socket <code>{ onmessage, onclose, emit(event, arg), close() }</code>, hoặc bị reject;</li>
<li>mỗi lần connect thành công: đặt lại backoff; gán <code>onmessage</code> (mỗi tin trực tiếp <code>{ id, body }</code> được thêm nếu id chưa biết); gán <code>onclose</code>; <code>emit('thread:join', id)</code> cho từng <code>threadIds</code>; rồi <code>await fetchSince(lastSeenId)</code> và thêm mọi tin chưa biết — <b>kể cả lần connect đầu</b> (tải ban đầu);</li>
<li>connect hỏng hoặc bị đóng: thử lại sau <code>floor(min(maxMs, baseMs·2<sup>attempt</sup>) × (0.5 + random()/2))</code> ms, rồi <code>attempt++</code>;</li>
<li><code>stop()</code> huỷ lần thử đang hẹn và đóng socket; sau đó không gì kết nối lại;</li>
<li><code>messages()</code> sắp theo id, không trùng; <code>lastSeenId</code> = id lớn nhất đã thấy.</li></ul>
<p>Server giả tạo tin thứ <i>i</i> ở thời điểm ảo <i>i</i>·300 ms và chỉ giao trực tiếp cho socket đang mở lúc đó; <code>fetchSince</code> mất 20 ms và trả những gì tồn tại lúc nó trả lời — nên cùng một tin có thể tới bằng cả hai đường.</p>${MOI_TRUONG.vi}`,
  yc: [['Reuse createReconnector (11.1) and createChatClient (11.3).', 'Dùng lại createReconnector (11.1) và createChatClient (11.3).'], ['Pass the lastSeenId at the moment of the fetch.', 'Truyền lastSeenId tại thời điểm fetch.']],
  goiY: [['Set <code>onmessage</code> BEFORE awaiting the fetch: live messages that arrive during it must not be lost.', 'Gán <code>onmessage</code> TRƯỚC khi await fetch: tin trực tiếp tới trong lúc đó không được mất.'], ['One <code>add()</code> with a Map keyed by id serves both paths.', 'Một hàm <code>add()</code> với Map khoá theo id phục vụ cả hai đường.']],
  loi: [['Fetching only after a REconnect: the first page load starts empty.', 'Chỉ fetch sau lần kết nối LẠI: lần tải trang đầu bắt đầu trống.'], ['Re-joining only once at start: after the first drop the new socket has no rooms and receives nothing live.', 'Chỉ join một lần lúc bắt đầu: sau lần rớt đầu, socket mới không có room và không nhận gì trực tiếp.'], ['A fixed retry interval.', 'Khoảng thử lại cố định.']],
  gt: ['Every failure mode of the chapter is handled by a division of labour rather than by trying to make the socket reliable: the backoff spreads reconnections, the re-join restores the rooms a new socket does not have, the REST fetch restores the messages the socket lost, and the id-keyed merge makes the overlap of the two paths harmless. The result is the lesson’s goal: a lost frame is a cosmetic delay, never lost data.', 'Mọi kiểu hỏng của chương được xử lý bằng cách chia việc chứ không bằng cố làm socket đáng tin: backoff rải các lần kết nối lại, join lại khôi phục room mà socket mới không có, fetch REST khôi phục tin socket đã mất, và phép gộp theo id làm phần chồng của hai đường trở nên vô hại. Kết quả đúng mục tiêu của bài: mất một frame chỉ là trễ hiển thị, không bao giờ mất dữ liệu.'],
  kn: ['reconnection', 'reliability', 'WebSocket'],
  tns: [tn('initial load', 'tải ban đầu', 'lần fetch đầu tiên khi mở trang')],
  fakes: CLI,
  dau: `/** The live client of a Notes thread. */
function createThreadClient({ connect, fetchSince, threadIds, baseMs, maxMs, random }) {
  // Write your solution here
  const list = [];
  let joined = false;
  const open = () => connect().then((s) => {
    s.onmessage = (m) => list.push(m);
    s.onclose = () => setTimeout(open, baseMs);
    if (!joined) { for (const id of threadIds) s.emit('thread:join', id); joined = true; }
  }, () => setTimeout(open, baseMs));
  return { start() { open(); }, stop() {}, messages() { return list; }, get lastSeenId() { return list.length ? list[list.length - 1].id : 0; } };
}
`,
  giai: '// Reference solution\n' + nguon(createThreadClient),
  cases: [
    { timeoutMs: 60000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer([{ openFor: 1000 }, "fail", { openFor: 100000 }]), fetchSince, threadIds: [42], baseMs: 1000, maxMs: 30000, random: half }); c.start(); await sleep(5000); c.stop(); return [ids(c), calls, joins.map((j) => j[0]), fetches]; })()', moTa: ['A drop at 1 s, a refusal, then back: all 10 messages, once each', 'Rớt ở giây 1, một lần bị từ chối, rồi trở lại: đủ 10 tin, mỗi tin một lần'] },
    { timeoutMs: 60000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer([{ openFor: 100000 }]), fetchSince, threadIds: [42, 43], baseMs: 1000, maxMs: 30000, random: half }); await sleep(950); c.start(); await sleep(3000); c.stop(); return [ids(c), fetches, joins.map((j) => j.slice(1))]; })()', moTa: ['Opened late: the initial fetch loads 1–3, the rest arrives live', 'Mở muộn: lần fetch đầu tải 1–3, phần còn lại tới trực tiếp'] },
    { timeoutMs: 60000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer([{ openFor: 290 }, { openFor: 100000 }]), fetchSince, threadIds: [42], baseMs: 1000, maxMs: 30000, random: () => 0.16 }); c.start(); await sleep(4000); c.stop(); return [ids(c), calls, fetches, c.lastSeenId]; })()', moTa: ['Reconnected 10 ms before message 3: it arrives live AND in the fetch — kept once', 'Kết nối lại 10 ms trước tin 3: nó tới trực tiếp VÀ trong lần fetch — giữ một bản'] },
    { timeoutMs: 120000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer(["fail", "fail", "fail", "fail", "fail", { openFor: 100000 }]), fetchSince, threadIds: [7], baseMs: 500, maxMs: 2000, random: half }); c.start(); await sleep(9000); c.stop(); return [calls, ids(c).length, fetches.length]; })()', an: true },
    { timeoutMs: 120000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer([{ openFor: 100000 }]), fetchSince, threadIds: [42], baseMs: 100, maxMs: 1000, random: half }); c.start(); await sleep(700); c.stop(); const n = calls.length; await sleep(5000); return [ids(c), n === calls.length, calls]; })()', an: true },
    { timeoutMs: 120000, goi: 'await (async () => { const c = createThreadClient({ connect: makeServer([{ openFor: 400 }, { openFor: 400 }, { openFor: 400 }, { openFor: 100000 }]), fetchSince, threadIds: [1, 2], baseMs: 200, maxMs: 800, random: () => 1 }); c.start(); await sleep(4000); c.stop(); return [ids(c), joins.length, fetches.map((f) => f[1])]; })()', an: true },
  ],
});

export default modul('nodejs-11-lab-realtime-notes', 'Lab 11 — Realtime Notes threads: server and client', [L1, L2, L3]);
