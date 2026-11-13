/**
 * sio-01-5 — Socket.IO · Chapter 1 · Lesson 1.5 "State that survives a reconnect: three patterns" (deck video + web, 13/11/2026).
 * Bài web: io-1-5-state. Output THẬT (scratchpad/sio/demo/n1-5.txt · socket.io 4.8.3 · Node 22.23.3, Mac):
 * song: qua một lần mạng chớp — id mới, rooms = [id], socket.data lúc vào middleware = {} (middleware chạy LẠI); cookie + handshake.auth gửi lại —
 *   NHƯNG auth là object tĩnh ⇒ gửi lại token CŨ (tok-cu) sau khi đã làm mới; auth là hàm ⇒ token mới (tok-moi);
 * ba: pattern 1 suy lại rooms từ "DB" · pattern 2 bản nháp theo userId trả lại · pattern 3 resume từ #2 ⇒ bù #3 #4 #5 · client giả mạo conv:999 ⇒ forbidden;
 * ready: emit lúc 'connect' khi server còn await 50 ms trước join ⇒ tin vang lại RƠI; emit lúc 'ready' ⇒ CÓ.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-5:file:song.mjs": "// Qua một lần nối lại: cái gì MẤT (id, rooms, data) và cái gì SỐNG (cookie, handshake.auth) — và auth tĩnh vs auth là HÀM khi token đã đổi\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst io = new Server(19480); let lanMw = 0;\nio.use((s, next) => { lanMw++; console.log(`   middleware chạy lần ${lanMw} · socket.data lúc vào = ${JSON.stringify(s.data)} · auth=${JSON.stringify(s.handshake.auth)} · cookie=${s.handshake.headers.cookie}`); s.data.userId = 42; next(); });\nio.on('connection', (s) => { console.log(`   connection id=${s.id} rooms=${JSON.stringify([...s.rooms])} data=${JSON.stringify(s.data)}`); s.on('join', (r) => { s.join(r); console.log(`   client xin join ⇒ rooms=${JSON.stringify([...s.rooms].slice(1))}`); }); });\nconst ong = new Set();\nnet.createServer((a) => { const b = net.connect(19480); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () => {}); x.on('close', () => { a.destroy(); b.destroy(); }); } }).listen(19481);\nconst catMang = () => { for (const x of ong) x.destroy(); ong.clear(); };\nlet token = 'tok-cu';\nfor (const [ten, auth] of [['A) auth là OBJECT tĩnh', { token }], ['B) auth là HÀM (gọi lại mỗi lần nối)', (cb) => cb({ token })]]) {\n  console.log(ten); token = 'tok-cu';\n  const c = ketNoi('http://localhost:19481', { auth: typeof auth === 'function' ? (cb) => cb({ token }) : { token }, extraHeaders: { cookie: 'sid=phien-7' }, reconnectionDelay: 300, reconnectionDelayMax: 300 });\n  await new Promise((r) => c.once('connect', r)); c.emit('join', ['room:42', 'vip']); await new Promise((r) => setTimeout(r, 200));\n  token = 'tok-moi';                                    // token vừa được làm mới (refresh) trong lúc đang kết nối\n  console.log('   … token làm mới thành tok-moi, rồi mạng chớp');\n  catMang(); await new Promise((r) => c.once('connect', r)); await cho(100); c.close(); await cho(100);\n}\nio.close(); process.exit(0);\n",
 "n1-5:song": "$ node song.mjs\nA) auth là OBJECT tĩnh\n   middleware chạy lần 1 · socket.data lúc vào = {} · auth={\"token\":\"tok-cu\"} · cookie=sid=phien-7\n   connection id=eHfPaz9bQ7AiMz0lAAAA rooms=[\"eHfPaz9bQ7AiMz0lAAAA\"] data={\"userId\":42}\n   client xin join ⇒ rooms=[\"room:42\",\"vip\"]\n   … token làm mới thành tok-moi, rồi mạng chớp\n   middleware chạy lần 2 · socket.data lúc vào = {} · auth={\"token\":\"tok-cu\"} · cookie=sid=phien-7\n   connection id=sNR0jxCAGMaJJOl-AAAB rooms=[\"sNR0jxCAGMaJJOl-AAAB\"] data={\"userId\":42}\nB) auth là HÀM (gọi lại mỗi lần nối)\n   middleware chạy lần 3 · socket.data lúc vào = {} · auth={\"token\":\"tok-cu\"} · cookie=sid=phien-7\n   connection id=OX0tzErkl5oq-CJ_AAAC rooms=[\"OX0tzErkl5oq-CJ_AAAC\"] data={\"userId\":42}\n   client xin join ⇒ rooms=[\"room:42\",\"vip\"]\n   … token làm mới thành tok-moi, rồi mạng chớp\n   middleware chạy lần 4 · socket.data lúc vào = {} · auth={\"token\":\"tok-moi\"} · cookie=sid=phien-7\n   connection id=foRVgF8iElnhZiEGAAAD rooms=[\"foRVgF8iElnhZiEGAAAD\"] data={\"userId\":42}",
 "n1-5:file:ba-pattern.mjs": "// Ba pattern khôi phục qua một lần nối lại, chạy cùng nhau + một client GIẢ MẠO resume cuộc hội thoại không phải của nó\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst DB = { phong: { 42: ['conv:1', 'team:dev'] }, quyen: { 42: ['conv:1'] }, tin: [] };          // \"database\" bền\nconst nhapTheoUser = new Map();                                                                      // pattern 2: khoá theo userId\nconst io = new Server(19482);\nio.use((s, next) => { s.data.userId = s.handshake.auth.userId; next(); });\nio.on('connection', async (s) => {\n  const uid = s.data.userId;\n  s.on('draft:update', (d) => nhapTheoUser.set(uid, d));\n  s.on('resume', ({ conv, lastEventId }, ack) => {\n    if (!DB.quyen[uid]?.includes(conv)) return ack({ error: 'forbidden' });                         // kiểm lại quyền, KHÔNG tin client\n    s.join(conv); ack({ missed: DB.tin.filter((t) => t.conv === conv && t.id > lastEventId) });\n  });\n  await s.join([`user:${uid}`, ...(DB.phong[uid] ?? [])]);                                           // pattern 1: suy lại từ dữ liệu bền\n  const nhap = nhapTheoUser.get(uid); if (nhap) s.emit('draft:restore', nhap);                     // pattern 2\n  console.log(`   server: connection #${s.id.slice(0, 6)} rooms=${JSON.stringify([...s.rooms].slice(1))}${nhap ? ` · trả bản nháp \"${nhap}\"` : ''}`);\n  s.emit('ready');\n});\nconst ong = new Set();\nnet.createServer((a) => { const b = net.connect(19482); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () => {}); x.on('close', () => { a.destroy(); b.destroy(); }); } }).listen(19483);\nlet lastEventId = 0;\nconst c = ketNoi('http://localhost:19483', { auth: { userId: 42 }, reconnectionDelay: 300, reconnectionDelayMax: 300 });\nc.on('msg', (t) => { lastEventId = t.id; console.log(`   client: nhận tin #${t.id}`); });\nc.on('draft:restore', (d) => console.log(`   client: khôi phục bản nháp \"${d}\"`));\nc.on('ready', () => c.emit('resume', { conv: 'conv:1', lastEventId }, (r) => console.log(`   client: resume từ #${lastEventId} ⇒ ${r.error ?? `bù ${r.missed.length} tin: ${r.missed.map((t) => '#' + t.id).join(' ')}`}`)));\nconst phat = (n) => { const t = { id: DB.tin.length + 1, conv: 'conv:1' }; DB.tin.push(t); io.to('conv:1').emit('msg', t); };\nawait new Promise((r) => c.once('ready', r)); await cho(100);\nconsole.log('1) đang nối: gõ nháp + nhận 2 tin'); c.emit('draft:update', 'Chào cả nh'); phat(); phat(); await cho(100);\nconsole.log('2) mạng chớp; server phát thêm 3 tin lúc client vắng'); for (const x of ong) x.destroy(); ong.clear(); phat(); phat(); phat();\nawait new Promise((r) => c.once('ready', r)); await cho(200);\nconsole.log('3) client giả mạo: resume conv:999 (không có quyền)');\nconst gia = ketNoi('http://localhost:19482', { auth: { userId: 13 } });\nawait new Promise((r) => gia.once('ready', r));\ngia.emit('resume', { conv: 'conv:999', lastEventId: 0 }, (r) => console.log(`   kẻ giả mạo nhận: ${JSON.stringify(r)}`));\nawait cho(200); c.close(); gia.close(); io.close(); process.exit(0);\n",
 "n1-5:ba": "$ node ba-pattern.mjs\n   server: connection #LX8mFj rooms=[\"user:42\",\"conv:1\",\"team:dev\"]\n   client: resume từ #0 ⇒ bù 0 tin: \n1) đang nối: gõ nháp + nhận 2 tin\n   client: nhận tin #1\n   client: nhận tin #2\n2) mạng chớp; server phát thêm 3 tin lúc client vắng\n   server: connection #bf-1cc rooms=[\"user:42\",\"conv:1\",\"team:dev\"] · trả bản nháp \"Chào cả nh\"\n   client: khôi phục bản nháp \"Chào cả nh\"\n   client: resume từ #2 ⇒ bù 3 tin: #3 #4 #5\n3) client giả mạo: resume conv:999 (không có quyền)\n   server: connection #k5gFcT rooms=[\"user:13\"]\n   kẻ giả mạo nhận: {\"error\":\"forbidden\"}",
 "n1-5:file:ready.mjs": "// Vì sao cần 'ready': server await truy vấn (50 ms) rồi mới join room; client emit NGAY lúc 'connect' và chờ tin vang lại trong room\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst io = new Server(19484);\nio.on('connection', async (s) => {\n  s.on('say', (text) => io.to('conv:1').emit('msg', text));          // handler đăng ký đồng bộ (bài 1.1)\n  await cho(50);                                                     // db.roomsForUser(...)\n  await s.join('conv:1');\n  s.emit('ready');\n});\nfor (const [ten, suKien] of [['A) emit lúc connect', 'connect'], [\"B) emit lúc 'ready'\", 'ready']]) {\n  const c = ketNoi('http://localhost:19484'); let nhan = false;\n  c.on('msg', () => (nhan = true));\n  c.on(suKien, () => c.emit('say', 'xin chào'));\n  await cho(400);\n  console.log(`${ten.padEnd(24)} ⇒ tin của chính mình vang lại trong conv:1? ${nhan ? 'CÓ' : 'KHÔNG — rơi vào hư không'}`);\n  c.close();\n}\nio.close(); process.exit(0);\n",
 "n1-5:ready": "$ node ready.mjs\nA) emit lúc connect      ⇒ tin của chính mình vang lại trong conv:1? KHÔNG — rơi vào hư không\nB) emit lúc 'ready'      ⇒ tin của chính mình vang lại trong conv:1? CÓ"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, vsd } from './_sio-chung.mjs';

export const deck = { key: 'sio-01-5', code: 'SIO 1.5', title: 'State that survives a reconnect: three patterns', sub: 'Chapter 1 · Lesson 1.5' };
const O = (k) => { const v = DU_LIEU[`n1-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const SONG = O('song').split('\n');
const iB = SONG.findIndex((l) => l.startsWith('B)'));
const catId = (l) => l.replace(/id=(\w{6})[\w-]+/g, 'id=$1…').replace(/rooms=\["(\w{6})[\w-]+"/g, 'rooms=["$1…"');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.5', t: 'State that survives a reconnect:<br>three patterns', sub: 'Derive it, key it by user, or let the client replay a cursor',
    en: 'Lesson one point five: state that survives a reconnect, in three patterns. Derive it, key it by user, or let the client replay a cursor.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What a reconnect wipes — id, rooms, <code>socket.data</code> — and what it sends again</li>
    <li>A trap: a static <code>auth</code> object replays the OLD token</li>
    <li>Pattern 1 derive · Pattern 2 server session by userId · Pattern 3 client replay</li>
    <li>All three together, measured — and a forged resume refused</li>
    <li>Why the server should say <code>ready</code> before the client talks</li></ul>`,
    en: 'Five takeaways: what a reconnect wipes and what it sends again; the static auth trap; the three patterns; all three together, measured, with a forged resume refused; and why the server should say ready.' },
  { t: 'Measured: what a reconnect wipes, what it sends again', body: tn(SONG.slice(0, iB).map(catId).join('\n'), { fs: 16, wrap: 110 }) + cmp(['', 'before the blip', 'after the reconnect'], [
      [c('socket.id'), 'eHfPaz…', '<b>new</b>: sNR0jx…'], [c('socket.rooms'), 'id + room:42 + vip', '<b>only its own id</b>'], [c('socket.data'), '{ userId: 42 }', '<b>{}</b> — the middleware runs again and refills it'],
      ['cookie / handshake.auth', 'sent', 'sent again ✓ — the base every pattern builds on'],
    ], { hl: [4] }),
    en: 'Measured: one network blip. After the reconnect the socket id is new, the rooms are back to just its own id, and socket.data is empty when the middleware starts, so the middleware runs again and refills it. What does come back are the HTTP-level facts: the cookie and handshake.auth are sent again. That is the base all three patterns build on.' },
  { t: 'Trap: a static auth object replays the OLD token', body: tn(SONG.slice(iB).map(catId).join('\n') + '\n(A, same run:) ' + SONG.slice(0, iB).filter((l) => /lần 2/.test(l)).map((l) => l.trim()).join(''), { fs: 15, wrap: 120 }) + vsd(js(`const socket = io(url, {
  auth: { token: getJwt() },  // evaluated ONCE
});`, { sm: true }), js(`const socket = io(url, {
  auth: (cb) => cb({ token: getJwt() }), // every connect
});`, { sm: true }), '✗ refreshed token, reconnect sends tok-cu', '✓ the function runs on every (re)connect: tok-moi'),
    en: 'A trap: the token was refreshed while connected, then the network blinked. With a static auth object the reconnect sent the old token; once it expires, the middleware will reject the user for no visible reason. Make auth a function: it is called on every connect and reconnect, and it sent the new token.' },
  { t: 'Pattern 1 — derive it again on connect (the default)', body: two(js(`io.use(async (socket, next) => {
  const user = await verify(socket.handshake.auth?.token);
  if (!user) return next(new Error('unauthorized'));
  socket.data.userId = user.id;
  next();
});

io.on('connection', async (socket) => {
  const uid = socket.data.userId;
  const rooms = await db.roomsForUser(uid);   // durable truth
  await socket.join([\`user:\${uid}\`, ...rooms]);
});`, { sm: true, hl: [10, 11] }), '<div>' + box('Why it is the default', 'Nothing can go stale: the server asks the database every time, so a reconnect is indistinguishable from a first connect. No TTL, no cleanup job.', 'la2') +
      box('The cost', 'One query per connection. A deploy or a mobile blip over thousands of clients = thousands of queries in seconds (Chapter 5). Cache <code>roomsForUser</code>; do not drop the pattern.', 'vang') + '</div>', 'r64'), to: true,
    en: 'Pattern one, the default: derive the state again on every connect. The middleware authenticates any connection the same way, and the connection handler rebuilds room membership from the database. Nothing can go stale. The cost is one query per connection; in a reconnect storm, cache it rather than drop the pattern.' },
  { t: 'Pattern 2 — a server-side session keyed by something stable', body: two(js(`// ✗ dangling after any reconnect
const draftsBySocket = new Map();
// ✓ survives: userId does not change
const draftsByUser = new Map();

io.on('connection', (socket) => {
  const uid = socket.data.userId;
  const draft = draftsByUser.get(uid);
  if (draft) socket.emit('draft:restore', draft);
  socket.on('draft:update', (d) => draftsByUser.set(uid, d));
});`, { hl: [4, 9] }), steps([
      '<b>Key by userId</b>, never socket.id — the id is regenerated',
      '<b>Cluster:</b> a Map belongs to ONE worker; the reconnect may land on another ⇒ Redis',
      '<b>Cleanup:</b> a TTL a little longer than your reconnect window — minutes, not hours',
      '<b>Restore</b> in <code>connection</code>: emit it back before the user notices',
    ]), 'r64'), to: true,
    en: 'Pattern two: a server-side session, keyed by something stable. A map keyed by socket id dangles after any reconnect; a map keyed by user id survives. Two constraints: in a cluster a map belongs to one worker and the reconnect may land elsewhere, so use Redis; and give it a TTL a little longer than the reconnect window.' },
  { t: 'Pattern 3 — the client keeps a cursor and replays it', body: two(js(`// client
socket.on('connect', () => {
  socket.emit('resume', { conv, lastEventId }, onMissed);
});

// server
socket.on('resume', async ({ conv, lastEventId }, ack) => {
  if (!(await canAccess(socket.data.userId, conv)))
    return ack({ error: 'forbidden' });     // re-check!
  await socket.join(conv);
  ack({ missed: await db.eventsSince(conv, lastEventId) });
});`, { sm: true, hl: [3, 8, 9, 11] }), '<div>' + box('The only pattern that fills the GAP', 'Patterns 1 and 2 restore where the user is. Only a cursor turns the reconnect into a query: “everything after this point”. That is how a chat shows what you missed in the tunnel.', 'lam') +
      box('Push state to the client, never trust', 'The client can claim any conversation id. Re-check permission inside <code>resume</code>, before the join.', 'do2') + '</div>', 'r64'), to: true,
    en: 'Pattern three: the client keeps a cursor and replays it. On connect it sends resume with the conversation and the last event id; the server re-checks permission, joins, and answers with everything after that point. It is the only pattern that fills the message gap. And the client controls both values, so never trust them.' },
  { t: 'Measured: all three together, and a forged resume', body: tn(O('ba'), { fs: 17, wrap: 100 }) + two(
      box('Restored', 'Pattern 1 rebuilt <code>conv:1</code> + <code>team:dev</code> from the "database"; pattern 2 handed back the half-typed draft; pattern 3 filled the gap: #3 #4 #5, sent while the client was away.', 'la2'),
      box('Refused', 'User 13 asked to resume <code>conv:999</code>: <code>forbidden</code>, and it was never joined.', 'do2'), 'r64'),
    en: 'Measured: all three together. The network blinks while the server emits three messages. After the reconnect, pattern one rebuilt the rooms from the database, pattern two returned the unfinished draft, and pattern three filled the gap with messages three, four and five. A forged client asking for conversation nine nine nine got forbidden.' },
  { t: "Measured: why the server says 'ready'", body: tn(O('ready'), { fs: 19, wrap: 100 }) + two(js(`io.on('connection', async (socket) => {
  socket.on('say', (t) => io.to('conv:1').emit('msg', t));
  await socket.join(await db.roomsForUser(uid)); // 50 ms
  socket.emit('ready');            // NOW it is safe
});

socket.on('ready', () => socket.emit('say', 'hi'));`, { hl: [4, 7] }),
      box('connected ≠ restored', `At <code>connect</code> the server was still awaiting its query; the socket had not joined <code>conv:1</code>, so its own message echoed into a room it was not in — silently lost. Wait for ${c('ready')}.`, 'do2'), 'r64'), to: true,
    en: 'Measured: why the server should say ready. The server registers its handler, then awaits a fifty-millisecond query before joining the room. A client that talks at connect sends its message into a room it has not joined yet, and its own echo is lost. A client that waits for ready gets it.' },
  { t: 'How to choose', body: cmp(['Ask', 'Pattern', 'Examples', 'Watch out'], [
      ['Can it be derived from durable data?', '<b>1 · derive</b>', 'room membership, permissions, subscriptions', 'cache the query for reconnect storms'],
      ['Ephemeral but owned by the server?', '<b>2 · server session</b>', 'an unsent draft, a wizard step, a rate-limit counter', 'key by userId, Redis + TTL with &gt;1 worker'],
      ['Does the client need what it MISSED?', '<b>3 · client replay</b>', 'chat, notifications, live feeds', 're-check permission; pair with Chapter 6 for guarantees'],
    ], { hl: [3] }) + `<p style="font-size:20px;color:#334155;margin:14px 0 0">Most real apps use all three in one connection handler — and end it with ${c("socket.emit('ready')")}.</p>`, to: true,
    en: 'How to choose. If it can be derived from durable data, derive it. If it is ephemeral but owned by the server, keep a session keyed by user id, in Redis with a TTL once you have more than one worker. If the client needs what it missed, let it replay a cursor and re-check permission. Most real apps use all three, and end with ready.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Lost on reconnect', 'socket.id, socket.rooms, socket.data'), kw('Survives', 'cookie and handshake.auth (static ⇒ the old value)'),
      kw('Derive pattern', 'rebuild from durable data on every connect'), kw('Server session', 'keyed by userId; Redis + TTL with workers'),
      kw('Client replay', 'the client sends a lastEventId cursor'), kw('Delivery gap', 'events sent while away are dropped by default'), kw("'ready'", 'connected AND restored — now safe to emit'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: what is lost on reconnect; what survives; the derive pattern; the server session; the client replay; the delivery gap; and the ready event.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'On reconnect, log id, rooms, data, handshake.auth and the cookie',
      'Refresh the token, blink the network: static auth vs auth function',
      'Pattern 1: rebuild rooms from the database in connection',
      'Pattern 3: a lastEventId cursor — a message sent while away must arrive',
    ]), box('Keep these', `<ul><li>A reconnect is a brand-new socket</li><li>Only cookie + handshake.auth come back — make auth a function</li><li>Derive · key by user · replay a cursor</li><li>Re-check permission; emit <code>ready</code> last</li></ul>`, 'lam'), ''),
    en: 'Your turn: log what survives a reconnect; refresh a token and compare a static auth with an auth function; rebuild rooms from the database; and add a last event id cursor so a message sent while away still arrives. Keep: a reconnect is a new socket; derive, key by user, or replay; re-check permission; and emit ready last.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The lifecycle of one connection', bai: '1.5' }, S);
