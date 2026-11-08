/** Node.js 11.2 — ws hay Socket.IO: ~10 KB vs ~22 KB mỗi kết nối, phát rộng là một vòng lặp trên event loop, room, ack, giới hạn theo socket. */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Rooms, acks and what a broadcast really costs', kho: 'EASY', phut: 10,
  en: 'From the lesson: memory per connection at 1,000 and 5,000 sockets, a broadcast to 5,000 clients, the room naming scheme of this site, acks, and five room mistakes.',
  vi: 'Từ bài: bộ nhớ mỗi kết nối ở 1.000 và 5.000 socket, một lần phát rộng tới 5.000 client, cách đặt tên room của site này, ack, và năm lỗi về room.',
  cau: [
    q('r1', ['"Why do I see my own typing indicator?" The server does <code>io.to(`thread:${id}`).emit(\'thread:typing\', t)</code>. Fix?', '"Sao tôi thấy chính chỉ báo đang gõ của mình?" Server làm <code>io.to(`thread:${id}`).emit(\'thread:typing\', t)</code>. Sửa thế nào?'],
      ['<code>socket.to(room)</code> — the whole room except the sender', '<code>io.except(room)</code> — everyone outside the room', '<code>socket.emit()</code> — only the sender', '<code>io.emit()</code> — Socket.IO filters the sender automatically'],
      ['One character apart: io.to includes the sender, socket.to excludes it.', 'Khác nhau một ký tự: io.to gồm cả người gửi, socket.to loại người gửi.']),
    q('r2', ['A notification must reach a person on phone, laptop and three tabs. Which room?', 'Một thông báo phải tới một người đang dùng điện thoại, laptop và ba tab. Room nào?'],
      ['<code>user:&lt;id&gt;</code> — every socket that belongs to this person', '<code>socket.id</code> — the socket that logged in last', '<code>thread:&lt;id&gt;</code> — the conversation they are in', '<code>post:&lt;id&gt;</code> — the post they are looking at'],
      ['Address a HUMAN with user:&lt;id&gt;; a conversation with thread:&lt;id&gt;; what is on screen with post:&lt;id&gt;. socket.id changes on every reconnect and one user has several.', 'Gửi tới một NGƯỜI bằng user:&lt;id&gt;; một cuộc trò chuyện bằng thread:&lt;id&gt;; thứ đang hiện trên màn hình bằng post:&lt;id&gt;. socket.id đổi mỗi lần kết nối lại và một người có nhiều cái.']),
    q('r3', ['Broadcasting one message to 5,000 ws clients: <code>emit</code> returned in 37.6 ms, the last client received it at 55.1 ms. What do the 37.6 ms mean?', 'Phát một tin tới 5.000 client ws: <code>emit</code> trả về sau 37,6 ms, client cuối nhận ở 55,1 ms. 37,6 ms nghĩa là gì?'],
      ['The event loop was blocked doing the fan-out — no HTTP request was served during it', 'The network latency to the farthest client', 'The time Redis needed to publish the message', 'Nothing important: emit is asynchronous and returns immediately'],
      ['A broadcast is a loop: write to socket 1, socket 2, … The shape of your rooms is therefore a performance decision.', 'Phát rộng là một vòng lặp: ghi vào socket 1, socket 2, … Nên hình dạng room là một quyết định hiệu năng.']),
    q('r4', ['A client emits <code>thread:join</code> and the server refuses silently (no ack). What does the user see?', 'Client gửi <code>thread:join</code> và server từ chối im lặng (không ack). Người dùng thấy gì?'],
      ['Exactly the same as a successful join that never delivers events — the client is left guessing', 'An error event "forbidden" that Socket.IO sends automatically', 'A disconnect, because a refused join closes the socket', 'Nothing: the client retries until it is allowed'],
      ['Use acks for anything the UI must react to: <code>ack?.({ ok:false, reason:\'NOT_PARTICIPANT\' })</code>.', 'Dùng ack cho mọi thứ UI phải phản ứng: <code>ack?.({ ok:false, reason:\'NOT_PARTICIPANT\' })</code>.']),
    qn('r5', ['Which statements match the lesson? (choose all)', 'Nhận định nào khớp với bài? (chọn mọi câu đúng)'],
      ['Socket.IO cost about 22 KB per connection vs about 10 KB for ws', 'Rooms are lost on reconnect, so joining belongs in the connect handler', 'post:reacted used to be a global io.emit: every like woke every socket on the site', 'A cap of 500 ids PER CALL let one socket sit in 100,000 rooms (+58.6 MB)', 'A Socket.IO client can connect to a raw ws server if transports is [\'websocket\']'],
      [0, 1, 2, 3],
      ['Socket.IO is a protocol on top of WebSocket, so its client cannot talk to a raw ws server (and vice versa), whatever the transport.', 'Socket.IO là một giao thức trên WebSocket, nên client của nó không nói chuyện được với ws server thô (và ngược lại), dù transport là gì.']),
  ],
  goiY: [['Think "who should receive this?" before "how do I send it?".', 'Nghĩ "ai nên nhận cái này?" trước "gửi thế nào?".'], ['Re-read "Five room mistakes" and the cuongthai.com paragraph.', 'Đọc lại "Năm lỗi về room" và đoạn về cuongthai.com.']],
  loi: [['io.emit() as a habit.', 'Dùng io.emit() theo thói quen.'], ['Using socket.id as a user id.', 'Dùng socket.id làm id người dùng.']],
  tns: [tn('room', 'phòng', 'một tập socket có tên'), tn('ack', 'xác nhận', 'callback chạy khi bên kia đã xử lý'), tn('fan-out', 'phát toả', 'một tin gửi tới nhiều socket')],
  kn: ['Socket.IO', 'rooms'],
});

/* ─── 2. EASY · js — sự kiện nào tới room nào ─── */
function routeEvent(evt) {
  switch (evt && evt.type) {
    case 'social:notification': return { room: 'user:' + evt.receiverId, exceptSender: false };   // a person, all devices
    case 'feed:has-new': return { room: 'user:' + evt.receiverId, exceptSender: false };          // tiny count, REST fetches the rest
    case 'thread:new-message': return { room: 'thread:' + evt.threadId, exceptSender: false };    // both sides, once
    case 'thread:typing': return { room: 'thread:' + evt.threadId, exceptSender: true };           // socket.to: not back to me
    case 'post:reacted': return { room: 'post:' + evt.postId, exceptSender: false };              // only those LOOKING at it
    default: return null;                                                                          // never fall back to io.emit()
  }
}

const E2 = jsBai({
  ten: 'Route each event to the smallest correct room', kho: 'EASY', phut: 10,
  en: `<p>"Design the rooms so that every message reaches the smallest correct set of sockets." Using this site’s scheme, write <code>routeEvent(evt)</code> → <code>{ room, exceptSender }</code> or <code>null</code>:</p>
<ul><li><code>social:notification</code> and <code>feed:has-new</code> → <code>user:&lt;receiverId&gt;</code>;</li>
<li><code>thread:new-message</code> → <code>thread:&lt;threadId&gt;</code>; <code>thread:typing</code> → the same room with <code>exceptSender: true</code> (that is <code>socket.to</code>);</li>
<li><code>post:reacted</code> → <code>post:&lt;postId&gt;</code>;</li>
<li><code>exceptSender</code> is <code>false</code> for everything except typing; any other event type → <code>null</code> (never a global <code>io.emit</code>).</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>"Thiết kế room sao cho mỗi tin tới đúng tập socket nhỏ nhất." Theo cách đặt tên của site này, viết <code>routeEvent(evt)</code> → <code>{ room, exceptSender }</code> hoặc <code>null</code>:</p>
<ul><li><code>social:notification</code> và <code>feed:has-new</code> → <code>user:&lt;receiverId&gt;</code>;</li>
<li><code>thread:new-message</code> → <code>thread:&lt;threadId&gt;</code>; <code>thread:typing</code> → cùng room đó với <code>exceptSender: true</code> (tức <code>socket.to</code>);</li>
<li><code>post:reacted</code> → <code>post:&lt;postId&gt;</code>;</li>
<li><code>exceptSender</code> là <code>false</code> cho mọi thứ trừ typing; loại sự kiện khác → <code>null</code> (không bao giờ <code>io.emit</code> toàn cục).</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['A <code>switch (evt.type)</code> with one return per case.', 'Một <code>switch (evt.type)</code> mỗi case một return.'], ['Ask for each event: a person, a conversation, or what is on screen?', 'Hỏi mỗi sự kiện: một người, một cuộc trò chuyện, hay thứ đang trên màn hình?']],
  loi: [['Sending a like to every socket (io.emit): O(all sockets) per click.', 'Gửi lượt thích tới mọi socket (io.emit): O(mọi socket) mỗi lần bấm.'], ['Typing with exceptSender false: the sender sees "… is typing" about themselves.', 'Typing với exceptSender false: người gửi thấy "… đang gõ" về chính mình.']],
  gt: ['Each room name encodes an audience: a human (user:), a conversation (thread:), a screen (post:). Picking the room is picking the cost of the broadcast, because emitting iterates only that set. Returning null for unknown events forces a decision instead of a silent fallback to the site-wide broadcast that this project had to remove.', 'Mỗi tên room mã hoá một nhóm nhận: một người (user:), một cuộc trò chuyện (thread:), một màn hình (post:). Chọn room là chọn chi phí của lần phát, vì emit chỉ duyệt tập đó. Trả null cho sự kiện lạ buộc phải quyết định thay vì lặng lẽ rơi về phát toàn site — thứ dự án này đã phải gỡ bỏ.'],
  kn: ['Socket.IO', 'rooms'],
  tns: [tn('socket.to', 'phát trừ mình', 'cả room trừ socket gửi'), tn('io.to', 'phát cả room', 'gồm cả người gửi')],
  dau: `/** Which room should this event go to? */
function routeEvent(evt) {
  // Write your solution here
  return { room: 'all', exceptSender: false };
}
`,
  giai: '// Reference solution\n' + nguon(routeEvent),
  cases: [
    { goi: `routeEvent({ type: 'thread:new-message', threadId: 42, body: 'Chuyển khoản 50 triệu nhé' })`, moTa: ['A new message', 'Một tin mới'] },
    { goi: `routeEvent({ type: 'thread:typing', threadId: 42, userId: 7 })`, moTa: ['Typing excludes the sender', 'Typing loại người gửi'] },
    { goi: `[routeEvent({ type: 'post:reacted', postId: 9, count: 12 }), routeEvent({ type: 'social:notification', receiverId: 7 })]`, moTa: ['A like and a notification', 'Một lượt thích và một thông báo'] },
    { goi: `[routeEvent({ type: 'feed:has-new', receiverId: 3, count: 2 }), routeEvent({ type: 'admin:broadcast' }), routeEvent({}), routeEvent(null)]`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — room chỉ là một tập socket có tên ─── */
function createHub() {
  const rooms = new Map();          // room name -> Set of socket ids
  const of = new Map();             // socket id  -> Set of room names (to leave everything on disconnect)
  const outbox = {};                // socket id  -> delivered [event, data]
  const join = (id, room) => {
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room).add(id);        // joining is a set insert
    of.get(id).add(room);
  };
  const leave = (id, room) => {
    const set = rooms.get(room);
    if (set) { set.delete(id); if (!set.size) rooms.delete(room); }   // empty rooms disappear, like Socket.IO's adapter
    if (of.has(id)) of.get(id).delete(room);
  };
  return {
    outbox,
    connect(id, userId) {
      of.set(id, new Set());
      outbox[id] = [];
      join(id, id);                       // every socket is in a room named after itself
      join(id, 'user:' + userId);         // …and in its person's room
    },
    join, leave,
    disconnect(id) {
      for (const room of [...(of.get(id) || [])]) leave(id, room);   // rooms are NOT kept for a reconnect
      of.delete(id);
    },
    emit(room, event, data, exceptId) {
      // iterate ONLY this room's set — that is the whole point of rooms
      const to = [...(rooms.get(room) || [])].filter((id) => id !== exceptId).sort();
      for (const id of to) outbox[id].push([event, data]);
      return to;
    },
    roomsOf(id) { return [...(of.get(id) || [])].sort(); },
    size(room) { return rooms.has(room) ? rooms.get(room).size : 0; },
    roomCount() { return rooms.size; },
  };
}

const E3 = jsBai({
  ten: 'Build the rooms yourself: a named set of sockets', kho: 'MEDIUM', phut: 22,
  en: `<p>"A room is nothing more than a named set of sockets. Joining is a hash-set insert; emitting to a room iterates only that set." Write <code>createHub()</code> with:</p>
<ul><li><code>connect(socketId, userId)</code> — the socket joins the room named after itself and <code>user:&lt;userId&gt;</code>; <code>outbox[socketId]</code> starts as <code>[]</code>;</li>
<li><code>join(socketId, room)</code>, <code>leave(socketId, room)</code> — a room that becomes empty is deleted;</li>
<li><code>disconnect(socketId)</code> — leaves <b>every</b> room (nothing is kept for a reconnect);</li>
<li><code>emit(room, event, data, exceptId?)</code> — pushes <code>[event, data]</code> to the outbox of every member except <code>exceptId</code>; returns the sorted ids it delivered to (an unknown room → <code>[]</code>);</li>
<li><code>roomsOf(socketId)</code> (sorted), <code>size(room)</code>, <code>roomCount()</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>"Room không gì hơn một tập socket có tên. Join là thêm vào một hash-set; emit tới room chỉ duyệt tập đó." Viết <code>createHub()</code> có:</p>
<ul><li><code>connect(socketId, userId)</code> — socket vào room mang tên chính nó và <code>user:&lt;userId&gt;</code>; <code>outbox[socketId]</code> bắt đầu là <code>[]</code>;</li>
<li><code>join(socketId, room)</code>, <code>leave(socketId, room)</code> — room trở nên rỗng thì bị xoá;</li>
<li><code>disconnect(socketId)</code> — rời <b>mọi</b> room (không giữ gì cho lần kết nối lại);</li>
<li><code>emit(room, event, data, exceptId?)</code> — đẩy <code>[event, data]</code> vào outbox của mọi thành viên trừ <code>exceptId</code>; trả các id đã gửi tới, đã sắp xếp (room không tồn tại → <code>[]</code>);</li>
<li><code>roomsOf(socketId)</code> (đã sắp xếp), <code>size(room)</code>, <code>roomCount()</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Two maps: room → Set of ids, and id → Set of rooms (so disconnect knows what to leave).', 'Hai bảng: room → Set id, và id → Set room (để disconnect biết phải rời những gì).'], ['In <code>leave</code>, delete the room when its set becomes empty.', 'Trong <code>leave</code>, xoá room khi tập của nó rỗng.']],
  loi: [['Looping over every socket and checking membership in emit — the O(all sockets) pattern rooms exist to avoid.', 'Duyệt mọi socket rồi kiểm thành viên trong emit — đúng kiểu O(mọi socket) mà room sinh ra để tránh.'], ['Forgetting the reverse map: disconnect leaves the socket id in rooms forever (a slow leak).', 'Quên bảng ngược: disconnect để id socket nằm trong room mãi mãi (rò rỉ chậm).'], ['Keeping empty rooms: a million one-time post rooms is a million entries nobody uses.', 'Giữ room rỗng: một triệu room post dùng một lần là một triệu mục không ai dùng.']],
  gt: ['Rooms are just indexes over sockets, maintained in both directions: by room for cheap fan-out, by socket for cheap cleanup. This is also what Socket.IO’s in-memory adapter holds — and why it lives in ONE process: a second process has its own maps (11.4). Deleting a socket from every room on disconnect is why the client must re-join in its connect handler.', 'Room chỉ là chỉ mục trên socket, giữ hai chiều: theo room để phát rẻ, theo socket để dọn rẻ. Đây cũng là thứ adapter trong bộ nhớ của Socket.IO giữ — và vì sao nó nằm trong MỘT tiến trình: tiến trình thứ hai có bảng riêng (11.4). Xoá socket khỏi mọi room khi ngắt kết nối là lý do client phải join lại trong handler connect.'],
  kn: ['rooms', 'data structures'],
  tns: [tn('adapter', 'bộ chuyển', 'nơi Socket.IO giữ room; mặc định trong RAM'), tn('reverse index', 'chỉ mục ngược', 'từ socket tra ra room')],
  dau: `/** A minimal room registry. */
function createHub() {
  // Write your solution here
  const sockets = {};      // id -> { userId, rooms: [] }
  const outbox = {};
  return {
    outbox,
    connect(id, userId) { sockets[id] = { rooms: [id, 'user:' + userId] }; outbox[id] = []; },
    join(id, room) { sockets[id].rooms.push(room); },
    leave(id, room) { sockets[id].rooms = sockets[id].rooms.filter((r) => r !== room); },
    disconnect(id) { delete sockets[id]; },
    emit(room, event, data, exceptId) {
      const to = Object.keys(sockets).filter((id) => sockets[id].rooms.includes(room));
      for (const id of to) outbox[id].push([event, data]);
      return to;
    },
    roomsOf(id) { return sockets[id] ? sockets[id].rooms : []; },
    size(room) { return Object.values(sockets).filter((s) => s.rooms.includes(room)).length; },
    roomCount() { return 0; },
  };
}
`,
  giai: '// Reference solution\n' + nguon(createHub),
  cases: [
    { goi: '(() => { const h = createHub(); h.connect("JBrW", 7); h.connect("tab2", 7); h.connect("x9", 8); h.join("JBrW", "thread:42"); h.join("x9", "thread:42"); return [h.emit("user:7", "social:notification", { n: 1 }), h.emit("thread:42", "thread:new-message", { id: 5 }), h.outbox]; })()', moTa: ['user:7 reaches both tabs; thread:42 both sides', 'user:7 tới cả hai tab; thread:42 tới hai bên'] },
    { goi: '(() => { const h = createHub(); h.connect("a", 1); h.connect("b", 2); h.join("a", "thread:1"); h.join("b", "thread:1"); return [h.emit("thread:1", "thread:typing", { u: 1 }, "a"), h.outbox.a.length]; })()', moTa: ['exceptId = socket.to', 'exceptId = socket.to'] },
    { goi: '(() => { const h = createHub(); h.connect("a", 1); h.join("a", "post:9"); h.join("a", "thread:3"); const before = h.roomsOf("a"); h.disconnect("a"); return [before, h.roomsOf("a"), h.size("post:9"), h.roomCount()]; })()', moTa: ['disconnect leaves every room; empty rooms vanish', 'disconnect rời mọi room; room rỗng biến mất'] },
    { goi: '(() => { const h = createHub(); h.connect("a", 1); h.connect("b", 1); h.join("a", "post:1"); h.leave("a", "post:1"); h.leave("a", "post:1"); return [h.emit("post:1", "post:reacted", {}), h.emit("nope", "x", {}), h.size("user:1"), h.roomCount(), h.roomsOf("b")]; })()', an: true },
    { goi: '(() => { const h = createHub(); for (let i = 0; i < 5; i++) h.connect("s" + i, i % 2); h.disconnect("s1"); h.disconnect("s3"); return [h.emit("user:1", "e", 1), h.emit("user:0", "e", 2, "s2"), h.roomCount()]; })()', an: true },
  ],
});

/* ─── 4. MEDIUM · js — ack cho thread:join ─── */
function onThreadJoin(socket, threadId, ack) {
  // ack is optional: a client may emit without a callback — "ack?.()" never throws on undefined.
  const reply = (r) => { if (typeof ack === 'function') ack(r); };
  if (!Number.isInteger(threadId) || threadId <= 0) return reply({ ok: false, reason: 'BAD_THREAD_ID' });
  // Authorise against what the SERVER knows about this socket (loaded at connect), never the payload.
  const allowed = socket.data.threads.includes(threadId);
  if (!allowed) return reply({ ok: false, reason: 'NOT_PARTICIPANT' });
  socket.join('thread:' + threadId);
  reply({ ok: true, reason: null });
}

const SOCK = String.raw`
function fakeSocket(id, data) { const s = { id, data, rooms: new Set([id]), emitted: [] }; s.join = (r) => { s.rooms.add(r); }; s.leave = (r) => { s.rooms.delete(r); }; s.emit = (e, p) => { s.emitted.push([e, p]); }; return s; }
const acks = []; const ack = (r) => acks.push(r);
`;

const E4 = jsBai({
  ten: 'Answer thread:join with an ack the UI can react to', kho: 'MEDIUM', phut: 12,
  en: `<p>"Without one, a rejected join looks exactly like a successful join that never delivers events." Write the server side of the lesson’s ack example, <code>onThreadJoin(socket, threadId, ack)</code>:</p>
<ul><li><code>ack</code> may be missing (the client emitted without a callback) — never crash on that;</li>
<li><code>threadId</code> not a positive integer → <code>ack({ ok:false, reason:'BAD_THREAD_ID' })</code>;</li>
<li>not in <code>socket.data.threads</code> (loaded at connect) → <code>ack({ ok:false, reason:'NOT_PARTICIPANT' })</code>, no join;</li>
<li>otherwise <code>socket.join('thread:' + threadId)</code> and <code>ack({ ok:true, reason:null })</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>"Không có nó, một lần join bị từ chối trông y như một lần join thành công mà không bao giờ nhận sự kiện." Viết phía server của ví dụ ack trong bài, <code>onThreadJoin(socket, threadId, ack)</code>:</p>
<ul><li><code>ack</code> có thể không có (client emit không kèm callback) — không bao giờ sập vì điều đó;</li>
<li><code>threadId</code> không phải số nguyên dương → <code>ack({ ok:false, reason:'BAD_THREAD_ID' })</code>;</li>
<li>không có trong <code>socket.data.threads</code> (nạp lúc connect) → <code>ack({ ok:false, reason:'NOT_PARTICIPANT' })</code>, không join;</li>
<li>còn lại <code>socket.join('thread:' + threadId)</code> và <code>ack({ ok:true, reason:null })</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['<code>ack?.(…)</code> — or check <code>typeof ack === "function"</code>.', '<code>ack?.(…)</code> — hoặc kiểm <code>typeof ack === "function"</code>.'], ['<code>Number.isInteger(threadId) &amp;&amp; threadId &gt; 0</code> rejects "42", 4.2, NaN, -1.', '<code>Number.isInteger(threadId) &amp;&amp; threadId &gt; 0</code> loại "42", 4,2, NaN, -1.']],
  loi: [['<code>ack(…)</code> without a check: a client that emits without a callback crashes the handler.', '<code>ack(…)</code> không kiểm: client emit không kèm callback làm handler sập.'], ['Joining first and checking afterwards — for a moment the socket is in the room.', 'Join trước rồi mới kiểm — có một khoảnh khắc socket nằm trong room.'], ['<code>typeof threadId === "number"</code> as the only check: a type check standing in for a permission check (11.3).', '<code>typeof threadId === "number"</code> là phép kiểm duy nhất: kiểm kiểu đứng thay kiểm quyền (11.3).']],
  gt: ['An ack turns a fire-and-forget emit into a request/response, so the client can show "you are not in this conversation" instead of waiting forever. Validating the id, then authorising against server-side state, then joining — in that order — means the room is never entered by mistake; replying through a guard means a client without a callback is not a crash.', 'Ack biến một emit "bắn rồi quên" thành request/response, nên client hiện được "bạn không ở trong cuộc trò chuyện này" thay vì chờ mãi. Kiểm id, rồi phân quyền theo trạng thái phía server, rồi mới join — đúng thứ tự đó — nghĩa là không bao giờ vào nhầm room; trả lời qua một lớp kiểm nghĩa là client không có callback không làm sập.'],
  kn: ['Socket.IO', 'acknowledgements', 'authorization'],
  tns: [tn('acknowledgement', 'xác nhận', 'callback cuối của emit'), tn('fire-and-forget', 'bắn rồi quên', 'gửi mà không chờ phản hồi')],
  fakes: SOCK,
  dau: `/** socket.on('thread:join', (id, ack) => onThreadJoin(socket, id, ack)) */
function onThreadJoin(socket, threadId, ack) {
  // Write your solution here
  if (typeof threadId === 'number') socket.join('thread:' + threadId);
  ack({ ok: true });
}
`,
  giai: '// Reference solution\n' + nguon(onThreadJoin),
  cases: [
    { goi: '(() => { const s = fakeSocket("JBrW", { userId: 7, threads: [42] }); onThreadJoin(s, 42, ack); return [acks, [...s.rooms]]; })()', moTa: ['A participant joins', 'Người trong cuộc vào được'] },
    { goi: '(() => { const s = fakeSocket("JBrW", { userId: 7, threads: [42] }); onThreadJoin(s, 99, ack); return [acks, [...s.rooms]]; })()', moTa: ['Not a participant: refused with a reason', 'Không phải người trong cuộc: từ chối có lý do'] },
    { goi: '(() => { const s = fakeSocket("a", { userId: 7, threads: [42] }); try { onThreadJoin(s, 42); onThreadJoin(s, 99); return [...s.rooms]; } catch (e) { return "crashed: " + e.name; } })()', moTa: ['No ack callback: no crash', 'Không có callback ack: không sập'] },
    { goi: '(() => { const s = fakeSocket("a", { userId: 7, threads: [42, 7] }); for (const id of ["42", 4.2, NaN, -7, 0, null, 7]) onThreadJoin(s, id, ack); return [acks, [...s.rooms]]; })()', an: true },
  ],
});

/* ─── 5. HARD · js — giới hạn THEO SOCKET, và tập người nhận presence ─── */
function subscribePosts(socket, ids, cap) {
  if (!Array.isArray(ids)) return { joined: 0, refused: 0, error: 'BAD_IDS' };
  let joined = 0, refused = 0;
  // Count what the socket ALREADY holds — a per-call counter resets on every call and a client just calls again.
  let held = [...socket.rooms].filter((r) => r.startsWith('post:')).length;
  for (const id of new Set(ids)) {                              // duplicates in one call count once
    if (!Number.isInteger(id) || id <= 0) continue;            // ignore junk ids
    const room = 'post:' + id;
    if (socket.rooms.has(room)) continue;                       // already subscribed: free
    if (held >= cap) { refused++; continue; }
    socket.join(room);
    held++; joined++;
  }
  return { joined, refused };
}

function presenceAudience(userId, friends, chatPeers) {
  // friends ∪ chat peers, never the user themself — emitted per user room instead of to everybody (the old O(N²) storm)
  const ids = new Set([...friends, ...chatPeers].filter((x) => x !== userId));
  return [...ids].sort((a, b) => a - b).map((x) => 'user:' + x);
}

const E5 = jsBai({
  ten: 'A per-socket cap on post:subscribe, and a presence audience', kho: 'HARD', phut: 25,
  en: `<p>The site caps <code>post:subscribe</code> at 500 ids "per CALL, not per socket. The counter resets on every call, so a client that simply calls again keeps joining: … one socket sat in 100,000 rooms for +58.6 MB." And presence went from "broadcast to everybody" to "friends ∪ chat peers". Write:</p>
<ul><li><code>subscribePosts(socket, ids, cap)</code> → <code>{ joined, refused }</code>: <code>ids</code> not an array → <code>{ joined:0, refused:0, error:'BAD_IDS' }</code>; ignore ids that are not positive integers and duplicates; an id already joined costs nothing; a new id is joined (<code>socket.join('post:' + id)</code>) only while the socket holds fewer than <code>cap</code> rooms starting with <code>post:</code> — <b>counted on the socket</b>, across calls; otherwise it is refused;</li>
<li><code>presenceAudience(userId, friends, chatPeers)</code> → sorted (numerically) unique <code>user:&lt;id&gt;</code> rooms of friends ∪ peers, without the user.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Site giới hạn <code>post:subscribe</code> 500 id "theo LẦN GỌI, không theo socket. Bộ đếm đặt lại mỗi lần gọi, nên client chỉ cần gọi tiếp là cứ join: … một socket nằm trong 100.000 room, tốn +58,6 MB." Và presence đi từ "phát cho mọi người" sang "bạn bè ∪ người đang chat". Viết:</p>
<ul><li><code>subscribePosts(socket, ids, cap)</code> → <code>{ joined, refused }</code>: <code>ids</code> không phải mảng → <code>{ joined:0, refused:0, error:'BAD_IDS' }</code>; bỏ qua id không phải số nguyên dương và id trùng; id đã join thì không tốn gì; id mới chỉ được join (<code>socket.join('post:' + id)</code>) khi socket đang giữ ít hơn <code>cap</code> room bắt đầu bằng <code>post:</code> — <b>đếm trên socket</b>, qua mọi lần gọi; không thì bị từ chối;</li>
<li><code>presenceAudience(userId, friends, chatPeers)</code> → các room <code>user:&lt;id&gt;</code> không trùng của bạn bè ∪ người chat, sắp theo số, không gồm chính người đó.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Start from <code>held = [...socket.rooms].filter(r =&gt; r.startsWith("post:")).length</code>.', 'Bắt đầu từ <code>held = [...socket.rooms].filter(r =&gt; r.startsWith("post:")).length</code>.'], ['Iterate <code>new Set(ids)</code> to drop duplicates; skip ids already in <code>socket.rooms</code> before checking the cap.', 'Duyệt <code>new Set(ids)</code> để bỏ trùng; bỏ qua id đã có trong <code>socket.rooms</code> trước khi kiểm trần.']],
  loi: [['A <code>let n = 0</code> counter inside the handler: the cap is per call and a loop of calls defeats it (the measured 100,000 rooms).', 'Biến đếm <code>let n = 0</code> trong handler: trần theo lần gọi và một vòng lặp gọi là vượt được (100.000 room đã đo).'], ['Counting <code>socket.rooms.size</code>: it includes the socket’s own room and user:/thread: rooms, so the post budget shrinks for active users.', 'Đếm <code>socket.rooms.size</code>: nó gồm room của chính socket và room user:/thread:, nên ngân sách post bị co lại với người dùng tích cực.'], ['Presence to everyone: every deploy that reconnects N users becomes N × N emits.', 'Presence cho mọi người: mỗi lần deploy làm N người kết nối lại thành N × N lần emit.']],
  gt: ['A limit protects a resource only if it counts the resource itself. The resource here is the room memberships a socket holds, so the cap must be measured on the socket, across calls — anything per call is a speed bump. Already-joined ids are free so a client re-sending its visible posts is not punished. The presence audience is the same idea as rooms: compute the smallest correct set of recipients and emit only to them.', 'Một giới hạn chỉ bảo vệ tài nguyên nếu nó đếm chính tài nguyên đó. Tài nguyên ở đây là số room một socket đang giữ, nên trần phải đo trên socket, qua mọi lần gọi — tính theo lần gọi chỉ là gờ giảm tốc. Id đã join thì miễn phí để client gửi lại các bài đang hiện không bị phạt. Tập nhận presence cùng ý với room: tính đúng tập người nhận nhỏ nhất và chỉ emit cho họ.'],
  kn: ['rooms', 'rate limiting', 'Socket.IO'],
  tns: [tn('per-socket cap', 'trần theo socket', 'đếm thứ socket đang giữ'), tn('presence', 'trạng thái trực tuyến', 'ai đang online')],
  fakes: SOCK,
  dau: `/** socket.on('post:subscribe', (ids) => subscribePosts(socket, ids, 500)) */
function subscribePosts(socket, ids, cap) {
  // Write your solution here (this is the per-CALL cap the lesson measured)
  let n = 0;
  for (const id of ids) {
    if (n >= cap) break;
    socket.join('post:' + id);
    n++;
  }
  return { joined: n, refused: Math.max(0, ids.length - n) };
}

/** Who should hear that userId came online? */
function presenceAudience(userId, friends, chatPeers) {
  return friends.concat(chatPeers).map((x) => 'user:' + x);
}
`,
  giai: '// Reference solution\n' + nguon(subscribePosts, presenceAudience),
  cases: [
    { goi: '(() => { const s = fakeSocket("a", {}); const r1 = subscribePosts(s, [1, 2, 3], 5); const r2 = subscribePosts(s, [4, 5, 6, 7], 5); return [r1, r2, [...s.rooms].filter((x) => x.startsWith("post:")).length]; })()', moTa: ['The cap holds across calls', 'Trần giữ được qua nhiều lần gọi'] },
    { goi: '(() => { const s = fakeSocket("a", {}); let total = 0; for (let k = 0; k < 200; k++) total += subscribePosts(s, Array.from({ length: 500 }, (_, i) => k * 500 + i + 1), 500).joined; return [total, s.rooms.size]; })()', moTa: ['The 100,000-room attack stops at 500', 'Đòn 100.000 room dừng ở 500'] },
    { goi: 'presenceAudience(7, [3, 12, 9], [12, 2, 7])', moTa: ['friends ∪ peers, sorted, without me', 'bạn bè ∪ người chat, đã sắp, không có tôi'] },
    { goi: '(() => { const s = fakeSocket("a", {}); s.join("user:7"); s.join("thread:42"); return [subscribePosts(s, [1, 1, 2, "3", -4, 2.5, 2], 2), subscribePosts(s, [1, 2, 3], 2), subscribePosts(s, "1,2", 2), [...s.rooms].sort()]; })()', an: true },
    { goi: '[presenceAudience(1, [], []), presenceAudience(1, [10, 2, 33], [2, 1]), presenceAudience(5, [5, 5], [6])]', an: true },
  ],
});

export default modul('nodejs-11-2-ws-vs-socketio-rooms', '11.2 ws vs Socket.IO: rooms and acks', [E1, E2, E3, E4, E5]);
