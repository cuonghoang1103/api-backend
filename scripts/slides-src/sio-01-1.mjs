/**
 * sio-01-1 — Socket.IO · Chapter 1 · Lesson 1.1 "Connect: five events in nine milliseconds" (deck video + web, 13/11/2026).
 * Bài web: io-1-1-connect. Output THẬT (scratchpad/sio/demo/n1-1.txt · socket.io 4.8.3 · Node 22.23.3, Mac):
 * c.id undefined lúc gọi io(); engine open 20 ms → io.use 23 → connection 24 (polling, rooms=[chính id]) → client connect 31 (cùng id) → nhận 'init' 31 → upgrade 31;
 * 5 lượt: transport lúc client connect = websocket 4/5, polling 1/5 (thứ tự connect ↔ upgrade KHÔNG cố định);
 * race: await 50 ms rồi mới on('thread:join') ⇒ event client gửi lúc connect RƠI MẤT (không lỗi); đăng ký trước ⇒ nhận { id: 7 }.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-1:file:ketnoi.mjs": "// Thứ tự các event lúc SINH một kết nối, ở cả hai phía, tính mili giây từ lúc gọi io()\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19440);\nconst t0 = performance.now(), T = () => String(Math.round(performance.now() - t0)).padStart(3);\nio.use((s, next) => { console.log(T(), 'server: middleware io.use        transport=' + s.conn.transport.name); next(); });\nio.on('connection', (s) => {\n  console.log(T(), `server: connection   id=${s.id}  transport=${s.conn.transport.name}  rooms=${JSON.stringify([...s.rooms])}`);\n  s.emit('init', { luc: 'gửi ngay trong handler connection' });\n  s.conn.once('upgrade', (t) => console.log(T(), 'server: upgrade → ' + t.name));\n});\nconst c = ketNoi('http://localhost:19440');\nconsole.log(T(), 'client: gọi io()  c.id =', c.id, ' connected =', c.connected);\nc.io.engine.on('open', () => console.log(T(), 'client: engine open (tầng 2)'));\nc.on('connect', () => console.log(T(), `client: connect      id=${c.id}  transport=${c.io.engine.transport.name}`));\nc.on('init', (d) => console.log(T(), 'client: nhận init —', d.luc));\nc.io.engine.on('upgrade', (t) => console.log(T(), 'client: upgrade → ' + t.name));\nsetTimeout(() => { c.close(); io.close(); process.exit(0); }, 600);\n",
 "n1-1:ketnoi": "$ node ketnoi.mjs\n 12 client: gọi io()  c.id = undefined  connected = false\n 28 client: engine open (tầng 2)\n 35 server: middleware io.use        transport=polling\n 36 server: connection   id=weYKClRjO8LngmXyAAAA  transport=polling  rooms=[\"weYKClRjO8LngmXyAAAA\"]\n 39 client: upgrade → websocket\n 40 client: connect      id=weYKClRjO8LngmXyAAAA  transport=websocket\n 40 client: nhận init — gửi ngay trong handler connection\n 40 server: upgrade → websocket\n$ for i in 1 2 3 4 5; do node ketnoi.mjs | grep 'client: connect'; done\n 34 client: connect      id=oetr6F_YHqIFctyiAAAA  transport=websocket\n 36 client: connect      id=5KpZ0KyCkQweasgzAAAA  transport=websocket\n 34 client: connect      id=DtoEYg6tFHp0aGD2AAAA  transport=websocket\n 68 client: connect      id=tDb0JZsiPKNOL3w1AAAA  transport=polling\n 39 client: connect      id=bwiUW8oIHsp_d5iGAAAA  transport=websocket",
 "n1-1:file:race.mjs": "// BẪY: handler connection await 50 ms rồi mới đăng ký on('thread:join'); client emit NGAY khi connect\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nfor (const [ten, cong, handler] of [\n  ['SAI  (await rồi mới on)', 19441, async (s) => { await cho(50); s.on('thread:join', (d) => console.log('   server nhận thread:join', d)); }],\n  ['ĐÚNG (on trước, await bên trong)', 19442, (s) => { s.on('thread:join', async (d) => { await cho(50); console.log('   server nhận thread:join', d); }); }],\n]) {\n  const io = new Server(cong); io.on('connection', handler);\n  const c = ketNoi('http://localhost:' + cong);\n  c.on('connect', () => c.emit('thread:join', { id: 7 }));\n  console.log(ten + ':');\n  await cho(400);\n  c.close(); io.close();\n}\nconsole.log('(dòng nào không có \"server nhận\" là event đã RƠI MẤT — không lỗi, không log)');\nprocess.exit(0);\n",
 "n1-1:race": "$ node race.mjs\nSAI  (await rồi mới on):\nĐÚNG (on trước, await bên trong):\n   server nhận thread:join { id: 7 }\n(dòng nào không có \"server nhận\" là event đã RƠI MẤT — không lỗi, không log)"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, seq, vsd, XANH } from './_sio-chung.mjs';

export const deck = { key: 'sio-01-1', code: 'SIO 1.1', title: 'Connect: five events in nine milliseconds', sub: 'Chapter 1 · Lesson 1.1' };
const O = (k) => { const v = DU_LIEU[`n1-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KN = O('ketnoi').split('\n');
const lan1 = KN.slice(1, KN.findIndex((l, i) => i > 0 && l.startsWith('$ ')));
const MS = (k) => +lan1.find((l) => l.includes(k)).trim().split(' ')[0];
const lan5 = KN.slice(KN.findIndex((l, i) => i > 0 && l.startsWith('$ ')) + 1);

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'Connect: five events<br>in nine milliseconds', sub: 'What fires, in what order, on which side — and what you may assume when',
    en: 'Lesson one point one: connect. Five events in about ten milliseconds. What fires, in what order, on which side, and what you are allowed to assume at each moment.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The birth of one connection, timed on both sides</li>
    <li>What you MAY assume inside <code>io.on('connection')</code></li>
    <li>What you may NOT assume — including the transport</li>
    <li>The repo's four-step handler: rooms → presence → handlers → disconnect</li>
    <li>The race: one <code>await</code> before <code>socket.on</code> loses events — measured</li></ul>`,
    en: 'Five takeaways: the birth of one connection timed on both sides; what you may assume in the connection handler; what you may not; the four-step handler; and the race where one await loses events.' },
  { t: 'Measured: the birth of one connection', body: tn(['$ node ketnoi.mjs', ...lan1].join('\n'), { fs: 14, wrap: 130 }) + seq(['client', 'server (engine.io)', 'your code'], [
      [0, 1, `engine.io handshake (polling) — ${MS('engine open')} ms`, '#7c3aed'], [1, 2, `io.use() — ${MS('middleware')} ms`, '#c28a00'], [1, 2, `'connection' — ${MS('server: connection')} ms (polling)`, XANH],
      [1, 0, `CONNECT + 'init' ⇒ client 'connect' — ${MS('client: connect')} ms`, '#1f8a3b'], [0, 1, `upgrade → websocket — ${MS('server: upgrade')} ms`, '#7c3aed', true]], { rh: 34, fs: 16 }),
    en: 'Measured: the birth of one connection, in milliseconds from the call to io. The engine opens at twenty-eight, the middleware runs at thirty-five, the server fires connection at thirty-six still on polling, the client upgrades at thirty-nine and fires connect at forty with the same id, already holding the init event. About twelve milliseconds from open to connect.' },
  { t: 'Connect vs upgrade: no fixed order', body: tn(['$ for i in 1 2 3 4 5; do node ketnoi.mjs | grep \'client: connect\'; done', ...lan5].join('\n'), { fs: 16, wrap: 116 }) + two(
      box('Same code, five runs', 'The client\'s transport at <code>connect</code> was <b>websocket 4 times, polling once</b>. Upgrade and connect race each other by a few milliseconds.', 'lam'),
      box('So never log "WebSocket client connected"', `In ${c("io.on('connection')")} the server transport is ALWAYS still polling; on the client it depends on luck. If you care, listen to ${c("socket.conn.on('upgrade')")}.`, 'do2')), to: true,
    en: 'Connect and upgrade have no fixed order. The same probe, five runs: at connect the client was on websocket four times and on polling once. On the server, connection always fires on polling. So never log websocket client connected there; listen for the upgrade event if you care.' },
  { t: 'What you MAY assume in io.on(\'connection\')', body: cmp(['Assumption', 'Holds?', 'Measured / why'], [
      [c('socket.id'), '✓ set', 'same value the client gets at connect; changes on reconnect (lesson 1.5)'],
      ['middleware passed', '✓', `${c('io.use()')} ran 1 ms earlier; ${c('socket.data.user')} set there is present`],
      [c('socket.rooms'), '✓ only its own id', `rooms = ["${(lan1.find((l) => l.includes('rooms=')) || '').match(/rooms=\["([^"]+)/)?.[1] ?? '…'}"] — join others yourself`],
      ['you can emit right away', '✓', "'init' sent inside the handler arrived at the client together with connect"],
      ['transport is websocket', '✗', 'server side it is polling here, every time'],
      ['the client will stay', '✗', 'it can vanish 100 ms later; the handler runs for a moment, not a session'],
    ], { hl: [4, 5] }), to: true,
    en: 'Inside the connection handler you may assume: socket.id is set; the middleware has passed; the socket is only in the room named after its own id; and you can emit right away — init arrived with connect. You may not assume the transport is websocket, nor that the client will stay.' },
  { t: 'The four-step handler this repo uses', body: two(js(`io.on('connection', (socket) => {
  const userId = socket.data.userId;
  socket.join(\`user:\${userId}\`);         // 1. rooms first
  markOnline(userId);                      // 2. presence
  socket.on('thread:join', onJoin);        // 3. handlers
  socket.on('thread:leave', onLeave);      //    — all NOW
  socket.on('disconnect', (reason) => {    // 4. cleanup
    markOffline(userId, reason);
  });
});`, { sm: true, hl: [3, 5, 6, 7] }), steps([
      '<b>Rooms</b> first, so anything emitted to <code>user:N</code> already reaches this socket',
      '<b>Presence</b>: tell only who cares (Chapter 4)',
      '<b>Handlers</b>: every <code>socket.on</code>, synchronously',
      '<b>Disconnect</b>: undo 1 and 2, or you leak',
    ]), 'r64'), to: true,
    en: 'The four-step handler this repo uses: join rooms first, so anything sent to the user room already reaches this socket; update presence; register every handler synchronously; and attach disconnect to undo the first two. Skip a step and you get a bug or a leak.' },
  { t: 'Measured: one await loses the first event', body: tn(O('race'), { fs: 17, wrap: 100 }) + vsd(
      js(`io.on('connection', async (socket) => {\n  await fetchUser(socket.data.userId); // 50 ms\n  socket.on('thread:join', onJoin);    // too late\n});`, { sm: true }),
      js(`io.on('connection', (socket) => {\n  socket.on('thread:join', async (d) => {\n    const user = await fetchUser(...);\n    onJoin(user, d);\n  });\n});`, { sm: true }),
      '✗ The client emitted at connect — event LOST', '✓ Register first, await inside'),
    en: 'Measured: one await loses the first event. The client emits thread join the moment it connects. With an await of fifty milliseconds before socket.on, the event arrived to no listener and vanished — no error, no log. Registering the handler first and awaiting inside it, the server received the event.' },
  { t: 'Why it vanishes: no buffer for unknown events', body: seq(['client', 'server socket', 'your handler'], [
      [0, 1, "connect, then emit('thread:join')", XANH], [1, 1, 'no listener yet ⇒ dropped', '#c0392b'], [2, 1, "…50 ms later: socket.on('thread:join')", '#c28a00', true], [0, 1, '(nothing is re-sent)', '#64748b', true]], { rh: 46, fs: 18 }) +
    two(box('Like any EventEmitter', 'An event emitted with no listener attached is simply not delivered. Socket.IO does not queue incoming events per name for later listeners.', 'lam'),
      box('Clients think emit = send', 'From the client side the emit "worked". Only the server knows it never had a listener — and it says nothing.', 'do2')), to: true,
    en: 'Why it vanishes: Socket.IO does not keep incoming events for listeners that do not exist yet. Like any EventEmitter, an event with no listener is simply not delivered, and nothing is re-sent. The client believes its emit worked; the server stays silent.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw("'connection' (server)", 'fires once per socket, after middleware'), kw("'connect' (client)", 'fires when the socket.io CONNECT arrives'),
      kw("'upgrade'", 'transport switched polling → websocket (layer 2)'), kw('socket.rooms', 'at connection: only its own id'),
      kw('Registration order', 'rooms → presence → handlers → disconnect'), kw('Synchronous registration', 'no await before socket.on'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: connection on the server; connect on the client; upgrade; socket.rooms; the registration order; and synchronous registration — no await before socket.on.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Timestamp middleware, connection, client connect, upgrade — run it 5 times',
      `Print ${c('socket.conn.transport.name')} and ${c('socket.rooms')} inside the connection handler`,
      'Put an <code>await</code> before one <code>socket.on</code>; emit at connect; watch it vanish',
      'Move the registration up; watch it arrive',
    ]), box('Keep these', `<ul><li>Birth ≈ 10 ms: open → middleware → connection → connect → upgrade</li><li>Server transport at connection = polling; client order varies</li><li>Rooms → presence → handlers → disconnect</li><li>No await before socket.on</li></ul>`, 'lam'), ''),
    en: 'Your turn: timestamp all five events and run it five times; print the transport and rooms in the handler; put an await before a socket.on and watch the early event vanish; then fix it. Keep: birth in about ten milliseconds; polling at connection; the four steps; no await before socket.on.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The lifecycle of one connection', bai: '1.1' }, S);
