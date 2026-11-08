/**
 * node-11-2 — Node.js · Chapter 11 · Lesson 11.2 "ws or Socket.IO: what convenience costs" (slide EN, đợt 9 — 01/11/2026).
 * MỘT deck, HAI tập: node-11-2 (slide 1–12) · node-11-2-2 (slide 13–26).
 *   A: ws cho một đường ống · Socket.IO là giao thức (thật: khung 0/40/42/2/3 đọc bằng ws thô; hai bên không nói chuyện được) · năm thứ nó mua ·
 *      phép đo 1 RSS mỗi kết nối (thật: ws +33,8 MB / 5.000 ≈ 6,9 KB · Socket.IO +76,0 MB ≈ 15,6 KB) · so với chương 10 · phép đo 2 phát tin
 *      (thật: 5.000 client ws emit 32,8 ms, tin cuối 37,4 ms · Socket.IO 35,1 / 59,3 ms) · phát tin là vòng lặp · một lượt thích toàn cục vs room (thật 12,40 vs 0,26 ms)
 *   B: room = Set có tên · bốn kiểu tên · đo user:an (2 thiết bị) · io.to vs socket.to (thật) · ack (thật 0,81 ms; timeout 2.003 ms) · chọn cái nào ·
 *      website này · giới hạn 500 room tính THEO LẦN GỌI chứ không theo socket (thật: 100.000 room, +58,6 MB một socket) · năm lỗi · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-11-2-ws-vs-socketio-rooms. Output THẬT: that/c11/{io-wire,mem-broadcast,rooms,ack,room-cap} (Node 22.23.3, ws 8.22.1, socket.io 4.8.4).
 * Khác web: KB/kết nối 6,9 / 15,6 (web 10 / 22) · phát tin 5.000: ws 32,8 / 37,4 ms, io 35,1 / 59,3 ms (web 37,6 / 55,1 và 49,9 / 91,7) ·
 *   web ghi "giới hạn 500 room mỗi socket" — thật: 500 MỖI LẦN GỌI post:subscribe (đo: một socket vào 100.000 room) ⇒ sửa web.
 */
import { lamDeck, two, box, cards, steps, bang, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-11-2', code: 'NODE 11.2', title: 'ws or Socket.IO: what convenience costs', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c11/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const MB = { ws5: num(R('mem-broadcast', /^ws\s+\d/), /101\.5 \(\+([\d.]+)\)/), io5: num(R('mem-broadcast', /^socket\.io\s+\d/), /145\.7 \(\+([\d.]+)\)/),
  ws1: num(R('mem-broadcast', /^ws\s+\d/), /75\.7 \(\+([\d.]+)\)/), io1: num(R('mem-broadcast', /^socket\.io\s+\d/), /92\.7 \(\+([\d.]+)\)/),
  wsKB: num(R('mem-broadcast', /^ws: about/), /about ([\d.]+) KB/), ioKB: num(R('mem-broadcast', /^socket\.io: about/), /about ([\d.]+) KB/) };
const BC = (re) => { const s = R('mem-broadcast', re); return { emit: num(s, /emit ([\d.]+)/), first: num(s, /first ([\d.]+)/), last: num(s, /last ([\d.]+)/) }; };
const ws5 = BC(/^ws\s+5000/), io5 = BC(/^socket\.io\s+5000/), ws1 = BC(/^ws\s+1000/);
const like = { g: num(R('rooms', /io\.emit \(global\)/), /held the loop ([\d.]+)/), r: num(R('rooms', /io\.to\('post:7'\)/), /held the loop ([\d.]+)/) };
const CH10 = num(dong('c10/rss-4ways', /^4 x 120/), /\(\+([\d.]+) MB\)/);
const cap = { n: num(R('room-cap', /200 calls\s+-> socket is in [\d,]+ rooms, server/), /in ([\d,]+) rooms/), mb: num(R('room-cap', /server RSS/), /\+([\d.]+) MB/) };

// a broadcast is a loop
const loopSvg = `<svg data-k="vong" viewBox="0 0 1100 230" width="1100" height="230" font-family="Arial">
<rect x="10" y="70" width="200" height="90" rx="14" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><text x="110" y="108" text-anchor="middle" font-size="21" font-weight="700" fill="${NODE}">emit()</text><text x="110" y="136" text-anchor="middle" font-size="17" fill="#555">one JS loop</text>
${Array.from({ length: 9 }, (_, i) => `<rect x="${280 + i * 88}" y="80" width="70" height="70" rx="10" fill="${i < 3 ? NODE : i === 8 ? DO : '#cbd5e1'}22" stroke="${i < 3 ? NODE : i === 8 ? DO : '#94a3b8'}" stroke-width="2.5"/><text x="${315 + i * 88}" y="122" text-anchor="middle" font-size="18" font-weight="700" fill="#333">${i === 7 ? '…' : i === 8 ? '5000' : i + 1}</text>`).join('')}
<line x1="215" y1="115" x2="275" y2="115" stroke="#b85a2b" stroke-width="3"/>
<text x="315" y="190" text-anchor="middle" font-size="18" fill="${NODE}">write #1: first</text><text x="1019" y="190" text-anchor="middle" font-size="18" fill="${DO}">write #5000: last</text>
<text x="660" y="40" text-anchor="middle" font-size="19" fill="#555">while this loop runs, no HTTP request, timer or heartbeat is handled</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Realtime with WebSocket and Socket.IO', bai: '11.2' }, [
  { cover: true, t: 'ws or Socket.IO:<br>what convenience<br>costs', sub: 'Memory per connection, the real price of a broadcast — and rooms, the addressing model of realtime.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What Socket.IO really is — read off the wire with a raw WebSocket</li>
<li>Memory per connection, ws vs Socket.IO, at 1,000 and 5,000 connections</li>
<li>What one broadcast does to your event loop, measured first-to-last</li>
<li>Rooms: user, thread, post, socket.id — and the one-character bug of io.to vs socket.to</li>
<li>Acks: knowing a message was handled — and a room cap on this site that was not a cap</li>
</ul>` + box('Why it matters to you', 'Library choice is a ~2× memory decision; room design is a performance AND a security decision. After this lesson you can defend both with numbers.', 'lam') },

  { t: 'Raw ws gives you a pipe', to: true, giua: true, body: bang(['a real product needs…', 'with raw ws', 'with Socket.IO'], [
    ['reconnect after a tunnel or a sleep', 'you write it (and the backoff)', 'built in'],
    ['"send this to everyone in chat 42"', 'you keep the maps yourself', 'rooms'],
    ['users behind a proxy that blocks Upgrade', 'nothing works', 'HTTP long-polling fallback'],
    ['"did the server handle it?"', 'you invent request ids', 'acks'],
    ['a second server process', 'you wire Redis yourself', 'adapters (lesson 11.4)'],
  ], { co: 22 }) + box('Write it or adopt it', 'Everything in the right column exists in your app either way. The question is only who writes it — and who debugs it at 2 a.m.', 'cam') },

  { t: 'Socket.IO is a protocol, not a wrapper', to: true, giua: true, body: TT('c11/io-wire', 2, 10, 'node io-wire.mjs · a RAW ws client talks to a Socket.IO server, frame by frame · real', { hl: [1, 3, 6, 7], n: 100, sm: false }) +
    TT('c11/io-wire', 11, 12, 'the two worlds do not mix · real', { hl: [1, 2], n: 100, sm: false }) +
    box('Read the prefixes', '0 = engine.io opens a session · 40 = Socket.IO connects · 42 = an event: name + JSON · 2 / 3 = ping / pong. Each one is a WebSocket text frame from lesson 11.1 — with Socket.IO\'s own format inside.', 'lam') },

  { t: 'What you get for that incompatibility', to: true, giua: true, body: cards([
    ['Automatic reconnection', 'Exponential backoff with jitter, built in. Raw ws: you write it, and get the backoff wrong the first time.'],
    ['A fallback path', 'If the upgrade is blocked, the same session runs over HTTP long-polling. The user never learns their office proxy is broken.'],
    ['Named events + acks', 'socket.emit(\'thread:join\', 42, (res) => …) — a callback that fires when the other side has handled it.'],
    ['Rooms (and namespaces)', 'Named groups of sockets. The addressing model this lesson is really about.'],
    ['Adapters', 'A pluggable way to make broadcasts cross process boundaries — lesson 11.4.'],
    ['The price', 'Its own protocol (0, 40, 42…), its own client library, and memory — next slide.'],
  ], 3) + box('Two layers', 'engine.io moves packets and keeps the session alive (transport, heartbeat, upgrade); Socket.IO adds events, acks, rooms and adapters on top. Socket.IO course 0.1 takes the layers apart.', 'cam') },

  { t: 'Measurement 1 — memory per connection', to: true, giua: true, body: TT('c11/mem-broadcast', 2, 6, 'node mem-broadcast.mjs · server in its own process, gc() before each sample, clients in 20 other processes · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh([['ws · 5,000', MB.ws5, NODE, `+${MB.ws5} MB · ${MB.wsKB} KB each`], ['Socket.IO · 5,000', MB.io5, CAM, `+${MB.io5} MB · ${MB.ioKB} KB`]], { ghi: 'server RSS added by 5,000 idle connections · real' }) +
    box('About twice', `Socket.IO costs ≈ ${(MB.ioKB / MB.wsKB).toFixed(1)}× ws per connection — engine.io session state, heartbeat timers, the room set, the event-name machinery.`, 'lam') },

  { t: 'Put it next to chapter 10', to: true, giua: true, body: thanh([
    ['5,000 ws sockets', MB.ws5, NODE, `+${MB.ws5} MB`], ['5,000 Socket.IO sockets', MB.io5, CAM, `+${MB.io5} MB`], ['4 uploads × 120 MB (Ch 10)', CH10, DO, `+${CH10} MB`]], { ghi: 'server RSS · chapter 10 measured with multer memoryStorage · real', x0: 360 }) +
    two(box('Connections are cheap', `Five thousand people online fit in less RAM than one Chrome tab. Any VPS holds that.`, 'xanh'),
      box('What flows through them is not', 'Four people uploading videos into memory cost ten times more than five thousand idle sockets. Memory goes where the BYTES go — lesson 11.4 shows one slow client eating 186 MB.', 'do2')) },

  { t: 'How it was measured', to: true, giua: true, body: steps([
    'One server process per library; RSS sampled after two gc() calls: what stays, not garbage',
    'Clients live in OTHER processes (250 each), so the server process holds only server-side state',
    'Connect 1,000, sample; 4,000 more, sample; then one broadcast on a shared clock',
  ]) + bang(['', 'ws', 'Socket.IO'], [
    ['added RSS, 1,000 connections', `+${MB.ws1} MB`, `+${MB.io1} MB`], ['added RSS, 5,000 connections', `+${MB.ws5} MB`, `+${MB.io5} MB`], ['per connection', `≈ ${MB.wsKB} KB`, `≈ ${MB.ioKB} KB`],
  ], { co: 21 }) + box('Your numbers will differ', 'Another machine or version ⇒ other KB. The ratio (~2×) and the conclusion hold.', 'cam') },

  { t: 'Measurement 2 — one message to everyone', to: true, giua: true, body: TT('c11/mem-broadcast', 7, 11, 'node mem-broadcast.mjs · one emit to every client · times from the server\'s emit() call, same clock · real', { hl: [3, 5], n: 104, sm: false }) +
    thanh([['ws · first', ws5.first, NODE, `${ws5.first} ms`], ['ws · last', ws5.last, CAM, `${ws5.last} ms`], ['Socket.IO · last', io5.last, DO, `${io5.last} ms`]], { ghi: '5,000 clients · when did the first and the last client get it · real' }) },

  { t: 'A broadcast is a loop', to: true, giua: true, body: loopSvg +
    two(box('Read first vs last', `The first client had it ${ws5.first} ms after emit() started; the five-thousandth waited for 4,999 writes ahead of it: ${ws5.last} ms.`, 'lam'),
      box(`emit() returned after ${ws5.emit} ms`, `That is not "delivery took ${ws5.emit} ms". It is ${ws5.emit} ms during which the event loop did nothing else — no HTTP request was answered.`, 'do2')) +
    box('Chapter 2, again', 'A synchronous loop blocks everything. Realtime just gives you a new way to write one: a broadcast to a big audience.', 'cam') },

  { t: 'So the shape of your rooms is a performance decision', to: true, giua: true, body: TT('c11/rooms', 18, 20, 'node rooms.mjs · one "like" on post 7 · 2,004 sockets online, 12 of them looking at post 7 · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh([['io.emit (everyone)', like.g, DO, `${like.g} ms`], ['io.to(\'post:7\')', like.r, NODE, `${like.r} ms`]], { ghi: 'event loop held by one emit · global woke 2,000 sockets, the room woke 12 · real' }) +
    box('Every click of every like button', `A global emit is an O(all sockets) loop per click. A room emit loops only over the people who can SEE the change: ${(like.g / like.r).toFixed(0)}× less loop time here.`, 'xanh') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'ws', 'Socket.IO'], [
    ['what it is', 'the WebSocket protocol', 'a protocol ON TOP (0, 40, 42 …)'],
    ['memory per connection', `≈ ${MB.wsKB} KB`, `≈ ${MB.ioKB} KB`],
    ['5,000-client broadcast, last receipt', `${ws5.last} ms`, `${io5.last} ms`],
    ['reconnect, fallback, rooms, acks', 'you write them', 'built in'],
  ], { co: 23 }) + two(box('Remember', 'Connections are cheap; broadcasts are not — a fan-out is a loop on your one event loop.', 'xanh'),
    box('Next: rooms', 'Name the groups so every message reaches the smallest correct set of sockets.', 'lam')) +
    box('The one design rule of this lesson', 'Pick the library by who the client is; design the rooms by who must SEE each message. The second decision matters more than the first.', 'cam') },

  // ───────────── phần B ─────────────
  { t: 'Rooms: the addressing model', to: true, giua: true, body: cards([
    ['user:&lt;id&gt;', 'Every socket of ONE person: phone, laptop, three tabs. The target for anything addressed to a human: notifications, unread counts.'],
    ['thread:&lt;id&gt;', 'The conversation. Both participants join; a new message is sent ONCE to the room, not once per person.'],
    ['post:&lt;id&gt;', 'The sockets currently LOOKING at this post. Scoped to what is on screen, not to who the user is.'],
    ['socket.id', 'Every socket is automatically in a room named after itself — that is how a reply to exactly one tab works.'],
  ], 2) + box('What a room is', 'A named Set of socket ids, in the server\'s memory. Joining = a Set insert. Emitting to a room = a loop over THAT set only.', 'lam') },

  { t: 'The code is three lines', to: true, giua: true, body: J(`io.on('connection', (socket) => {
  socket.join(\`user:\${userId}\`);                               // every device of this person
  socket.on('thread:join', (id) => socket.join(\`thread:\${id}\`));   // (lesson 11.3: CHECK first!)
});

io.to(\`thread:\${threadId}\`).emit('thread:new-message', msg);  // the whole room
socket.to(\`thread:\${threadId}\`).emit('thread:typing', t);     // the room EXCEPT me
io.to(\`user:\${receiverId}\`).emit('social:notification', n);  // one person, all devices`, { sm: false, hl: [2, 6, 7, 8] }) +
    TT('c11/rooms', 2, 2, 'node rooms.mjs · what the server knows about binh · real', { hl: [1], n: 100, sm: false }) +
    box('Rooms live on the server', 'The client cannot list or join rooms by itself — it can only ASK, with an event. Whatever the server joins on its behalf is the whole security model (lesson 11.3).', 'lam') },

  { t: 'One person, every device', to: true, giua: true, body: TT('c11/rooms', 3, 7, 'node rooms.mjs · an has a laptop AND a phone connected · real', { hl: [2, 3], n: 100, sm: false }) +
    two(box('Address the human, not the socket', 'user:an reaches both of an\'s devices. Sending to a socket id would reach one tab and miss the phone in the pocket.', 'xanh'),
      box('Never use socket.id as a user id', 'It changes on every reconnect, and one user has several. Lesson 11.3 measures the change.', 'do2')) +
    box('Rooms clean up after themselves', 'When a socket disconnects, Socket.IO removes it from every room, and an empty room disappears. You never delete rooms by hand.', 'cam') },

  { t: 'io.to vs socket.to — a one-character bug', to: true, giua: true, body: TT('c11/rooms', 8, 17, 'node rooms.mjs · binh types in thread 42 · real', { hl: [4, 9], n: 100, sm: false }) +
    two(box('io.to(room)', 'Everyone in the room, INCLUDING the sender. binh saw "binh is typing…" on his own screen.', 'do2'),
      box('socket.to(room)', 'Everyone in the room EXCEPT the socket that sent it. That is what a typing indicator wants.', 'xanh')) },

  { t: 'Acknowledgements: knowing it was handled', to: true, giua: true, body: J(`// client
const res = await socket.emitWithAck('thread:join', 42);      // or emit(…, (res) => …)
if (!res.ok) showError(res.reason);
// server
socket.on('thread:join', (id, ack) => {
  const ok = isParticipant(socket.data.userId, id);
  if (ok) socket.join(\`thread:\${id}\`);
  ack?.({ ok, reason: ok ? null : 'NOT_PARTICIPANT' });
});`, { sm: false, hl: [2, 8] }) + bang(['event', 'ack?', 'why'], [['thread:join, message:send, vote', 'yes', 'the UI must show success or an error'], ['typing, cursor position', 'no', 'the next one replaces it anyway']], { co: 21 }) +
    box('Fire-and-forget by default', 'A plain emit gets no answer. Use an ack for anything the UI must react to.', 'lam') },

  { t: 'Acks, measured', to: true, giua: true, body: TT('c11/ack', 2, 6, 'node ack.mjs · real', { hl: [2, 3, 4, 5], n: 104, sm: false }) +
    two(box('Without an ack', 'A refused join and an accepted join look exactly the same to the client: silence. The UI just waits for messages that never come.', 'do2'),
      box('With an ack — and a timeout', 'The answer came back in under a millisecond. If the server never answers, .timeout(2000) turns silence into an error after 2 s.', 'xanh')) +
    box('An ack is not a delivery guarantee', 'It says "the handler ran". It does not store anything for a socket that is offline — lesson 11.3 measures what reconnecting loses.', 'cam') },

  { t: 'Which one should you pick', to: true, giua: true, body: cards([
    ['Choose ws', 'The client is not a browser (a device, another server), the protocol is yours to define, or the connection count is enormous and the extra KB per socket matter. You accept writing reconnect, heartbeat and routing.'],
    ['Choose Socket.IO', 'Browsers are the client and you want rooms, reconnection, fallback and cross-process broadcast without writing them. Cost: ~2× memory per connection and a protocol only its own client speaks.'],
  ], 2) + bang(['you need…', 'pick'], [['a chat or a notification system for a web app', 'Socket.IO'], ['10,000 IoT devices with a fixed binary format', 'ws'], ['server → browser only, plain HTTP', 'SSE (lesson 11.1)']], { co: 22 }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: cards([
    ['Rooms', 'user:&lt;id&gt;, admin:&lt;id&gt;, thread:&lt;id&gt;, post:&lt;id&gt; — the scheme of this lesson.'],
    ['Thread rooms joined AT CONNECT', 'A bug fix: a user sitting on /messages who had not clicked into a chat received nothing, and the unread badge froze until refresh.'],
    ['post:reacted → post:&lt;id&gt;', 'It used to be a global io.emit: every like woke every socket on the site. Now only the people looking at that post.'],
    ['Presence → an audience', '"X is online" goes to friends ∪ chat peers, not to everybody — the old way was an O(N²) storm after every deploy.'],
  ], 2) + box('Worth stealing', 'Each of the three changes replaced "send to everyone" with "send to the smallest set that needs it". That is the whole lesson in one habit.', 'xanh') },

  { t: 'A cap per call is not a cap per socket', to: true, giua: true, body: J(`socket.on('post:subscribe', (ids) => {      // same shape as this site's handler
  let joined = 0;
  for (const id of ids) { if (joined >= 500) break; socket.join(\`post:\${id}\`); joined++; }
});                                              // fix: if (socket.rooms.size > 500) break;`, { sm: false, hl: [3, 4] }) +
    TT('c11/room-cap', 2, 4, 'node room-cap.mjs · the client simply calls it again and again · real', { hl: [2, 3], n: 104, sm: false }) +
    box('Found while making this lesson', `"Capped so a client cannot join unbounded rooms" — but the counter resets on every call. One socket: ${cap.n.toLocaleString('en-US')} rooms, +${cap.mb} MB of server RAM. A cap must count what the SOCKET holds: socket.rooms.size.`, 'do2') },

  { t: 'Five room mistakes', to: true, giua: true, body: cards([
    ['io.emit() as a habit', 'A broadcast to every socket on the server. Invisible until you have users.'],
    ['Rooms lost on reconnect', 'A new connection is a new socket with NO rooms. Join in the connect handler, not once at page load.'],
    ['socket.id as a user id', 'Changes on every reconnect; one user has several.'],
    ['Join what the client asks, unchecked', 'Without a permission check it is a data leak (11.3); without a per-socket cap it is a memory leak (previous slide).'],
    ['Your own loop over io.sockets.sockets', 'The O(all sockets) pattern rooms exist to avoid.'],
    ['Fix in one sentence', 'Every message to the SMALLEST correct set of sockets, chosen by the server.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: J(`io.on('connection', (socket) => {
  // (a)
  socket.on('typing', ({ threadId }) => io.to(\`thread:\${threadId}\`).emit('typing', socket.id));
  // (b)
  socket.on('like', async (postId) => { await saveLike(postId); io.emit('post:reacted', { postId }); });
  // (c)
  socket.on('watch', (ids) => ids.forEach((id) => socket.join(\`post:\${id}\`)));
});`, { sm: false, hl: [3, 5, 7] }) + box('Exercise', 'Three lines, three problems from this lesson. Name each one and rewrite the line.', '') +
    `<div data-k="dapan">${box('Answer', '(a) io.to includes the sender, and socket.id is not a person ⇒ socket.to(…).emit(\'typing\', { userId: socket.data.userId }). (b) A global emit per like wakes every socket ⇒ io.to(`post:${postId}`).emit(…). (c) No permission check and no per-socket cap ⇒ check each id, and stop when socket.rooms.size reaches a limit.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why can a socket.io-client not talk to a raw ws server?</li>
<li>Roughly how much memory per connection did ws and Socket.IO take here?</li>
<li>emit() to 5,000 clients returned after ${ws5.emit} ms. What else happened during those ${ws5.emit} ms?</li>
<li>Which one excludes the sender: io.to(room) or socket.to(room)?</li>
<li>Why is "max 500 per call" not a cap?</li>
</ol>
<div data-k="dapan">${box('Answers', `1. Socket.IO is its own protocol on top (0, 40, 42…). &nbsp;2. ≈ ${MB.wsKB} KB vs ≈ ${MB.ioKB} KB. &nbsp;3. Nothing — the event loop was busy writing to sockets. &nbsp;4. socket.to. &nbsp;5. The client calls again; only socket.rooms.size limits what one socket holds.`, 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Socket.IO = a protocol on top of WebSocket: reconnect, fallback, acks, rooms, adapters — for ≈ 2× memory per connection</li>
<li>Connections are cheap (5,000 ≈ ${MB.ws5}–${MB.io5} MB); broadcasts are not: emit() is a loop on your event loop</li>
<li>Rooms: user (a person), thread (a conversation), post (what is on screen), socket.id (one tab)</li>
<li>socket.to excludes the sender; acks turn silence into an answer; caps count socket.rooms.size</li>
</ul>` + box('Next: lesson 11.3', 'Authenticate once, authorize every time: four tokens through the handshake — and a hole where any logged-in user could read anyone\'s private chat.', 'lam') },
]);
