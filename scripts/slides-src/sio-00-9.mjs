/**
 * sio-00-9 — Socket.IO · Section 0 · Start here (2/2) "The four-layer model, real incidents, and how to study this course" (deck video + web, 13/11/2026).
 * Bài web: io-0-0-start-here-2. Output THẬT (scratchpad/sio/demo/n0-9.txt · socket.io 4.8.3 · ws 8.23.0 (npm i mới) · Node 22.23.3, Mac):
 * npm i + một dòng in phiên bản; probe.js 15 dòng — SERVER connection transport=polling, CLIENT connect transport=polling, SERVER upgrade websocket,
 * SERVER nhận chao. Sự cố THẬT của kho (git log): 0852eb4ed 21/08 gọi người offline đổ chuông vào hư không · 110097d08 17/09 app desktop "ngoại tuyến mãi"
 * (transports:['websocket'] vứt extraHeaders) · 8a87e3298 15/10 mỗi tin tới HAI lần · 39eb43755 22/10 presence phát toàn cục · e9ed78dc6 01/11 một socket vào 100.000 phòng.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-9:file:probe.js": "// server + client trong 15 dòng: một event đi trọn hai đầu, in transport ở CẢ hai phía\nconst { Server } = require('socket.io');\nconst { io } = require('socket.io-client');\nconst server = new Server(19404);\nserver.on('connection', (socket) => {\n  console.log('SERVER connection · transport =', socket.conn.transport.name);\n  socket.conn.on('upgrade', (t) => console.log('SERVER upgrade   · transport =', t.name));\n  socket.on('chao', (msg) => { console.log('SERVER nhận chao:', msg); client.close(); server.close(); });\n});\nconst client = io('http://localhost:19404');\nclient.on('connect', () => {\n  console.log('CLIENT connect    · transport =', client.io.engine.transport.name);\n  setTimeout(() => client.emit('chao', { tu: 'client', luc: 'sau 300 ms' }), 300);\n});\n",
 "n0-9:mot-event": "$ node probe.js\nSERVER connection · transport = polling\nCLIENT connect    · transport = polling\nSERVER upgrade   · transport = websocket\nSERVER nhận chao: { tu: 'client', luc: 'sau 300 ms' }",
 "n0-9:su-co": "$ git log -1 --date=short --format='%ad %h %s' 0852eb4ed\n2026-08-21 0852eb4ed fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không\n$ git log -1 --date=short --format='%ad %h %s' 110097d08\n2026-09-17 110097d08 fix(tin nhắn): app desktop \"ngoại tuyến mãi\" — socket CHƯA TỪNG nối được lần nào\n$ git log -1 --date=short --format='%ad %h %s' 8a87e3298\n2026-10-15 8a87e3298 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần\n$ git log -1 --date=short --format='%ad %h %s' 39eb43755\n2026-10-22 39eb43755 fix(privacy): một luật trạng thái hoạt động cho mọi chỗ — khách/người lạ/chặn/đối ứng không thấy; socket không phát toàn cục\n$ git log -1 --date=short --format='%ad %h %s' e9ed78dc6\n2026-11-01 e9ed78dc6 fix(socket): trần 500 phòng post:<id> tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.000 phòng (~58 MB, đo ở bài Node.js 11.2); tách vaoPhongBaiViet + test",
 "n0-9:cai": "$ npm init -y > /dev/null && npm i socket.io@4.8.3 socket.io-client@4.8.3 ws 2>&1 | tail -2\n\nfound 0 vulnerabilities\n$ node -e \"console.log('socket.io', require('socket.io/package.json').version, '| ws', require('ws/package.json').version)\"\nsocket.io 4.8.3 | ws 8.23.0"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, icards, cmp, box, two, steps, kw, c, tiers, flow, vsd, XANH } from './_sio-chung.mjs';

export const deck = { key: 'sio-00-9', code: 'SIO 0.9', title: 'Start here (2/2) — The four-layer model, real incidents, and how to study', sub: 'Section 0 · Start here (2/2)' };
const O = (k) => { const v = DU_LIEU[`n0-9:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const SUCO = O('su-co').split('\n').filter((l) => /^\d{4}-/.test(l)).map((l) => l.split(' ').slice(0, 2));

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'Four layers, five incidents,<br>one way to study', sub: 'The model the whole course hangs on — and the bugs this repo really shipped',
    en: 'Start here, part two: the four-layer model the whole course hangs on, five real incidents from this repo, and an honest way to study a course built from measured packets.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four layers every connection stacks — and one event traced through them</li>
    <li>Three habits that repeat under different names</li>
    <li>Five real incidents from this repo, each owned by one layer</li>
    <li>A study loop: read → run a probe → read the wire → name the layer</li>
    <li>What a 50-minute study session looks like</li></ul>`,
    en: 'Five takeaways: the four layers and one event traced through them; three habits; five real incidents from this repo, each owned by a layer; a study loop; and what one study session looks like.' },
  { t: 'Four layers every connection stacks', body: tiers([
      ['code', 'Layer 4 — your code', `named events + JSON: socket.on('chat:message', …) — src/socket/*.ts`, '#1f8a3b'],
      ['layers', 'Layer 3 — socket.io', 'namespaces · rooms · acks · binary · one sid per namespace', XANH],
      ['pulse', 'Layer 2 — engine.io', 'the connection itself: heartbeat · transport upgrade · its OWN sid', '#7c3aed'],
      ['plug', 'Layer 1 — the wire', 'HTTP long-polling or WebSocket — chosen (and upgraded) by engine.io', '#c28a00'],
    ], { th: 70, gap: 20 }) + box('Before you debug anything', 'Decide which of the four layers owns the symptom. That choice picks the tool: your logs (4), room lists (3), DevTools WS frames (2), the proxy config (1).', 'lam'),
    en: 'Four layers. Layer four is your code: named events with JSON payloads. Layer three is socket.io: namespaces, rooms, acknowledgements, binary, and one id per namespace. Layer two is engine.io: the connection itself, with heartbeat, transport upgrade and its own id. Layer one is the wire: HTTP long-polling or a WebSocket. Name the layer before you debug.' },
  { t: 'Measured: one event, end to end, 15 lines', body: js(O('file:probe.js').trim().split('\n').slice(1).join('\n'), { sm: true }) + two(tn(O('mot-event'), { fs: 16, wrap: 56 }),
      box('Read it layer by layer', `Both sides start on <b>polling</b> (layer 1), engine.io <b>upgrades</b> to websocket (layer 2), the named event <code>chao</code> arrives with its JSON (layers 3–4).`, 'xanh')),
    en: 'One event end to end, in fifteen lines. The server logs the transport on connection and on upgrade; the client logs its transport on connect, then emits an event called chao. Real output: both sides start on polling, engine.io upgrades the connection to websocket, and the named event arrives with its JSON. Every line belongs to one layer.' },
  { t: 'Three habits that repeat', body: icards([
      ['gauge', 'Measure, don\'t guess', 'Every table here is a number someone ran. Your own measurement beats any default or blog post.'],
      ['layers', 'Name the layer first', 'Ping timeout = layer 2, wrong room = layer 3, blocked upgrade = layer 1. The layer picks the tool.'],
      ['shield', 'Let the library do the hard parts', 'Reconnect and heartbeat live in layers 2–3. You never hand-write them in layer 4.'],
    ], 3) + box('Why habits, not recipes', 'Socket.IO bugs are rarely "in Socket.IO". They are a layer you did not look at. These three habits are what the diagnosis chapter (10) turns into a decision tree.', ''), to: true,
    en: 'Three habits that repeat under different names. Measure, do not guess. Name the layer first, because the layer picks the tool. And let the library do the hard parts: reconnect and heartbeat belong to layers two and three, never to your own loop in layer four.' },
  { t: 'Five real incidents from this repo', body: cmp(['Date · commit', 'What people saw', 'Owner layer', 'Lesson'], [
      [`${SUCO[0][0]}<br><code>${SUCO[0][1]}</code>`, 'Calling an offline user: "Calling…" for 45 s, server logs perfectly clean', '3 — emit to an EMPTY room is silent', '7.3'],
      [`${SUCO[1][0]}<br><code>${SUCO[1][1]}</code>`, 'Desktop app "offline forever" — the socket had NEVER connected', '1–2 — websocket-only drops the auth header', '1.4'],
      [`${SUCO[2][0]}<br><code>${SUCO[2][1]}</code>`, 'Every chat message arrived TWICE (double ring)', '3 — two emits, a socket in both rooms', '3.4'],
      [`${SUCO[3][0]}<br><code>${SUCO[3][1]}</code>`, 'Online status leaked to strangers on an error path', '3–4 — fallback to a GLOBAL broadcast', '4.2'],
      [`${SUCO[4][0]}<br><code>${SUCO[4][1]}</code>`, 'One socket could join 100,000 rooms (~58 MB)', '3–4 — limit counted per call, not per socket', '3.3'],
    ]) + `<div class="cap">git log of this repo — dates and hashes are real; each one is taught in the lesson on the right</div>`,
    en: 'Five real incidents from this repo, each with its commit. A call to an offline user rang into nothing for forty-five seconds with clean logs. The desktop app stayed offline forever because a websocket-only client never sent its token. Messages arrived twice. Online status leaked through a global broadcast. And one socket could join a hundred thousand rooms. Each belongs to one layer and one lesson.' },
  { t: 'Incident: "offline forever" — a layer 1 choice broke auth', body: vsd(
      js(`io(URL, {\n  transports: ['websocket'],\n  extraHeaders: { Authorization: token },\n});\n// new WebSocket(uri) cannot set headers\n// ⇒ engine.io DROPS extraHeaders\n// ⇒ no token ⇒ rejected ⇒ retry forever`, { sm: true }),
      js(`io(URL, {\n  auth: { token },\n});\n// inside the OPEN packet:\n// every transport, never in the URL\n// server: socket.handshake.auth.token`, { sm: true }),
      '✗ What shipped (17/09/2026)', '✓ The fix') +
    two(box('Measured in the commit (Chromium + a small socket.io server)', `<code>transports:['websocket']</code> ⇒ handshake <b>without</b> <code>authorization</code><br>default (polling → websocket) ⇒ handshake <b>with</b> it`, 'lam'),
      box('Why nobody noticed', 'tsc was green, the app built, the screen drew — not one error surfaced. The badge just said Offline. Calls and typing indicators died too: same socket.', 'do2')),
    en: 'One incident up close. The desktop app forced transports websocket and sent the token in extraHeaders. A browser WebSocket cannot set headers, so engine.io silently dropped them, the server never saw the token, and the client retried forever. tsc was green and nothing errored. The fix: send the token in the auth option, which travels inside the opening packet on every transport.' },
  { t: 'How to study a course built from packets', body: flow([
      { t: 'Read', s: 'the lesson + slides' }, { t: 'Run a probe', s: 'a 15-line script', mau: XANH }, { t: 'Read the wire', s: 'frames, not logs', mau: XANH },
      { t: 'Name the layer', s: '1 · 2 · 3 · 4' }, { t: 'Code Lab', s: 'the same idea, by hand' },
    ], { h: 150, fs: 22 }) + two(box('A probe is…', `a throw-away script that connects and PRINTS the wire, so you read what really happened. Every lesson ships one under <b>🔁 Run it yourself</b>.`, 'lam'),
      box('Reading code ≠ running code', 'This course was written by running it — and the runs disagreed with the text more than once (you will see the corrections). Trust the run.', 'do2')) +
      cmp(['The text said', 'The run said', 'Where'], [['"disconnect takes 60 s"', '45.0 s with defaults · 85.0 s with this repo\'s 25 s + 60 s', 'lesson 0.1'], ['"upgrade ~200 ms later"', '6 ms on one machine — it is one round-trip of YOUR network', 'lesson 0.2']]),
    en: 'How to study a course built from packets: read the lesson, run a probe — a throw-away script that prints the wire — read the frames rather than your own logs, name the layer, then practise the same idea on Code Lab. Reading code is not running code: this course was written by running it, and the runs corrected the text more than once.' },
  { t: 'One 50-minute study session', body: two(steps([
      '<b>10 min</b> — watch one lesson, pause at every slide with output',
      '<b>15 min</b> — copy the "Run it yourself" probe, run it, compare YOUR numbers',
      '<b>10 min</b> — break it on purpose (kill the server, block the upgrade…) and read what changed',
      '<b>10 min</b> — Code Lab: the matching module, easy → hard',
      '<b>5 min</b> — one line in your notebook: which layer, which tool',
    ]), box('Minimum path vs full path', '<b>Minimum</b> (a working chat in a project): Section 0, Ch 1–4, 6. <b>Full</b> (production, interviews): everything, including cluster (5), WebRTC (7), Yjs (8), raw ws (9), diagnosis (10).', 'lam'), 'r64'),
    en: 'One study session of fifty minutes: ten minutes for one lesson; fifteen to run the probe and compare your numbers; ten to break it on purpose and read what changed; ten on the matching Code Lab module; five to write which layer and which tool. The minimum path for a working chat is section zero and chapters one to four and six; the full path is everything.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Four layers', 'wire · engine.io · socket.io · your code'), kw('engine.io', 'layer 2: heartbeat, upgrade, its own sid'), kw('socket.io', 'layer 3: namespaces, rooms, acks, binary'),
      kw('Probe', 'a tiny script that prints the wire'), kw('Transport', 'polling or websocket — the layer-1 wire'), kw('Owner layer', 'the layer whose tool can see the bug'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the four layers; engine.io; socket.io; a probe; transport; and owner layer, the layer whose tool can actually see the bug.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `In a scratch folder: ${c('npm i socket.io socket.io-client ws')} and print both versions`,
      'Write the 15-line server + client; emit one event and log it on the other side',
      `Log ${c('socket.conn.transport.name')} (server) and ${c('socket.io.engine.transport.name')} (client); map each line to a layer`,
      'Draw the four layers from memory',
    ]), box('Keep these', `<ul><li>Four layers: wire, engine.io, socket.io, your code</li><li>Name the layer before you debug</li><li>Real bugs here were silent — only the wire tells</li><li>Learn by running probes, not by reading</li></ul>`, 'lam'), ''),
    en: 'Your turn: install both libraries and print their versions; write the fifteen-line server and client and send one event; log the transport on both sides and map each line to a layer; then draw the four layers from memory. Keep: four layers; name the layer first; the real bugs were silent and only the wire tells; learn by running probes.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Socket.IO really is', bai: 'Start here 2/2' }, S);
