/**
 * sio-00-3 — Socket.IO · Section 0 · Lesson 0.3 "What is on the wire: three real packets" (deck video + web, 13/11/2026).
 * Bài web: io-0-3-tren-day. Output THẬT (scratchpad/sio/demo/n0-3.txt · socket.io 4.8.3 · ws 8.21.2 · Node 22.23.3 · Chromium/Playwright):
 * ws thô ⇒ 0{sid,upgrades:[],25000,20000,1000000} · 40{sid khác} · 42["hello",{"world":42}]; curl polling ⇒ upgrades ["websocket"];
 * trình duyệt thật: GET 0{…} · POST 40 · GET 40{sid}␞42["hello",…] (hai packet MỘT response, ngăn bằng \x1e) · POST 420["chat:message",…] · GET 430[…];
 * websocket: 2probe/3probe/5 · server→client 420["hoi",…] / 430["vẫn ở đây"] · ping 2 / pong 3 mỗi 2 s (pingInterval 2000 của trang thử);
 * maxPayload: 999.000 ký tự nhận; 1.100.000 ký tự ⇒ server "transport error", client "transport close" (CẢ KẾT NỐI chết).
 * Lệch web: ví dụ ack 421/431 "ack id = 1" ⇒ id đếm từ 0 (420/430); "bị từ chối ở tầng 2" ⇒ cả kết nối bị đóng; link "Chương 11 — chẩn đoán" ⇒ Chương 10.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-3:file:probe3.mjs": "// Bỏ socket.io-client: nối bằng ws THÔ rồi in từng khung đúng như trên dây\nimport { Server } from 'socket.io';\nimport { WebSocket } from 'ws';\nimport http from 'node:http';\nconst srv = http.createServer();\nconst io = new Server(srv);\nio.on('connection', (s) => s.emit('hello', { world: 42 }));\nawait new Promise((r) => srv.listen(19430, r));\nconst ws = new WebSocket('ws://localhost:19430/socket.io/?EIO=4&transport=websocket');\nws.on('message', (d) => console.log('WIRE:', JSON.stringify(d.toString())));\nawait new Promise((r) => ws.on('open', r));\nws.send('40');   // tự tay gửi: engine.io MESSAGE (4) + socket.io CONNECT (0)\nsetTimeout(() => { ws.close(); io.close(); process.exit(0); }, 500);\n",
 "n0-3:tho": "$ node probe3.mjs\nWIRE: \"0{\\\"sid\\\":\\\"_ikI32unR-eK2JogAAAA\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":20000,\\\"maxPayload\\\":1000000}\"\nWIRE: \"40{\\\"sid\\\":\\\"xlJ0rzCiXqDDljo1AAAA\\\"}\"\nWIRE: \"42[\\\"hello\\\",{\\\"world\\\":42}]\"",
 "n0-3:curl": "$ curl -s 'http://localhost:19432/socket.io/?EIO=4&transport=polling'; echo\n0{\"sid\":\"EvCrVv0JqKt_j6OgAAAA\",\"upgrades\":[\"websocket\"],\"pingInterval\":25000,\"pingTimeout\":20000,\"maxPayload\":1000000}",
 "n0-3:file:trang.mjs": "// Server + trang web để Chromium mở: thấy khung WS thật (OPEN, CONNECT, EVENT, ping/pong, ack hai chiều)\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { Server } from 'socket.io';\nconst srv = http.createServer((req, res) => { if (req.url === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(readFileSync('trang.html')); } });\nconst io = new Server(srv, { pingInterval: 2000, pingTimeout: 2000 });\nio.on('connection', (s) => {\n  s.emit('hello', { world: 42 });\n  s.on('chat:message', (msg, ack) => ack({ ok: true, nhan: msg.text }));\n  setTimeout(() => s.emit('hoi', 'còn đó không?', (tl) => console.log('server nhận ack:', tl)), 1200);\n});\nsrv.listen(19431, () => console.log('trang ở http://localhost:19431'));\n",
 "n0-3:file:trang.html": "<!doctype html><html><head><meta charset=\"utf-8\"><title>socket.io trên dây</title>\n<style>body{font:18px/1.5 system-ui;margin:24px;background:#f8fafc}h1{font-size:22px;margin:0 0 12px}pre{background:#0b1018;color:#e6edf3;padding:14px 18px;border-radius:10px;font:16px/1.6 Consolas,monospace}</style></head>\n<body><h1>⚡ socket.io — nhật ký phía trình duyệt</h1><pre id=\"log\"></pre>\n<script src=\"/socket.io/socket.io.js\"></script>\n<script>\nconst log = (s) => (document.getElementById('log').textContent += s + '\\n');\nconst socket = io();\nsocket.on('connect', () => log('connect · socket.id=' + socket.id + ' · transport=' + socket.io.engine.transport.name));\nsocket.io.engine.on('upgrade', (t) => log('upgrade → ' + t.name));\nsocket.on('hello', (d) => { log('nhận hello ' + JSON.stringify(d)); socket.emit('chat:message', { text: 'hi' }, (r) => log('ack từ server ' + JSON.stringify(r))); });\nsocket.on('hoi', (cau, ack) => { log('server hỏi: ' + cau); ack('vẫn ở đây'); });\n</script></body></html>\n",
 "n0-3:trang": "$ node /Users/admin/Documents/video-bai-giang/scratchpad/sio/anh.mjs /Users/admin/Documents/video-bai-giang/scratchpad/sio/spec/sio-0-3.json\n✓ trang  http://localhost:19431/  mạng 7 · console 0\ntrang ở http://localhost:19431\nserver nhận ack: vẫn ở đây",
 "n0-3:file:to-qua.mjs": "// maxHttpBufferSize mặc định 1e6 (≈ 1 MB — chính là maxPayload trong gói OPEN): gửi 999.000 ký tự rồi 1.100.000 ký tự\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19433);\nio.on('connection', (s) => {\n  s.on('to', (x) => console.log(`server NHẬN chuỗi ${x.length.toLocaleString('vi-VN')} ký tự`));\n  s.on('disconnect', (ly) => { console.log(`server: disconnect \"${ly}\"`); });\n});\nconst c = ketNoi('http://localhost:19433', { transports: ['websocket'], reconnection: false });\nc.on('disconnect', (ly) => console.log(`client: disconnect \"${ly}\"`));\nawait new Promise((r) => c.on('connect', r));\nc.emit('to', 'a'.repeat(999000));\nawait new Promise((r) => setTimeout(r, 500));\nconsole.log('gửi 1.100.000 ký tự …');\nc.emit('to', 'a'.repeat(1100000));\nawait new Promise((r) => setTimeout(r, 800));\nio.close(); process.exit(0);\n",
 "n0-3:maxpayload": "$ node to-qua.mjs\nserver NHẬN chuỗi 999.000 ký tự\ngửi 1.100.000 ký tự …\nserver: disconnect \"transport error\"\nclient: disconnect \"transport close\"",
 "n0-3:xhr": "[[\"GET\", \"\", \"0{\\\"sid\\\":\\\"uPrY2c-RnVM5ml82AAAA\\\",\\\"upgrades\\\":[\\\"websocket\\\"],\\\"pingInterval\\\":2000,\\\"pingTimeout\\\":2000,\\\"maxPayload\\\":1000000}\"], [\"POST\", \"40\", \"ok\"], [\"GET\", \"\", \"40{\\\"sid\\\":\\\"iRQrTYYia_9yrUI3AAAA\\\"}\\u001e42[\\\"hello\\\",{\\\"world\\\":42}]\"], [\"POST\", \"420[\\\"chat:message\\\",{\\\"text\\\":\\\"hi\\\"}]\", \"ok\"], [\"GET\", \"\", \"430[{\\\"ok\\\":true,\\\"nhan\\\":\\\"hi\\\"}]\"]]",
 "n0-3:ws": "[[\"↑\", \"2probe\", 35], [\"↓\", \"3probe\", 37], [\"↑\", \"5\", 38], [\"↓\", \"420[\\\"hoi\\\",\\\"còn đó không?\\\"]\", 1234], [\"↑\", \"430[\\\"vẫn ở đây\\\"]\", 1234], [\"↓\", \"2\", 2026], [\"↑\", \"3\", 2026], [\"↓\", \"2\", 4027], [\"↑\", \"3\", 4027]]"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, wire, br, path, XANH } from './_sio-chung.mjs';

export const deck = { key: 'sio-00-3', code: 'SIO 0.3', title: 'What is on the wire: three real packets', sub: 'Section 0 · Lesson 0.3' };
const O = (k) => { const v = DU_LIEU[`n0-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const WIRE = O('tho').split('\n').filter((l) => l.startsWith('WIRE:')).map((l) => JSON.parse(l.slice(6)));
const XHR = JSON.parse(O('xhr'));
const WS = JSON.parse(O('ws'));
const OPEN = JSON.parse(WIRE[0].slice(1));

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.3', t: 'What is on the wire:<br>three real packets', sub: 'Skip the client library, read the bytes, decode every leading digit',
    en: 'Lesson zero point three: what is on the wire. We skip the client library, connect with a raw WebSocket, and decode three real packets digit by digit. After this, the WS tab in DevTools is a list you can read.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Connect with a raw WebSocket and print three real frames</li>
    <li>Decode OPEN, CONNECT and EVENT — and find the two sids</li>
    <li>The two packet-type tables: engine.io (1st digit), socket.io (2nd)</li>
    <li>The same packets in a real browser — polling first, then WebSocket</li>
    <li>Acks and ping/pong on the wire, and what maxPayload really does</li></ul>`,
    en: 'Five takeaways: three real frames from a raw WebSocket; decoding OPEN, CONNECT and EVENT and finding two ids; the two packet-type tables; the same packets in a real browser; and acks, ping-pong and maxPayload on the wire.' },
  { t: 'The probe: a raw WebSocket, no socket.io-client', body: js(O('file:probe3.mjs').trim(), { sm: true, hl: [9, 12] }) + tn(O('tho'), { fs: 15, wrap: 116 }),
    en: 'The probe: a Socket.IO server that emits hello on connection, and a raw ws client that connects to slash socket dot io with EIO four and transport websocket. By hand it sends four zero, then prints every frame. Three frames came back.' },
  { t: 'Frame 1 — engine.io OPEN', body: wire([['↓', WIRE[0], 'engine.io 0 = OPEN']], { fs: 17, max: 74 }) + cmp(['Field', 'Value', 'Meaning'], [
      ['sid', `<code>${OPEN.sid}</code>`, 'the engine.io (layer 2) session id — identifies the CONNECTION; polling requests carry it as <code>sid=</code>'],
      ['upgrades', `<code>${JSON.stringify(OPEN.upgrades)}</code>`, 'empty: we are already on WebSocket. Over polling it is <code>["websocket"]</code> (curl, below)'],
      ['pingInterval', `<code>${OPEN.pingInterval}</code>`, 'the server pings every 25 s (default; this repo also 25 000)'],
      ['pingTimeout', `<code>${OPEN.pingTimeout}</code>`, 'no pong within 20 s ⇒ gone (default; this repo 60 000)'],
      ['maxPayload', `<code>${OPEN.maxPayload}</code>`, '≈ 1 MB per message — exceed it and the CONNECTION is closed (measured, slide 11)'],
    ]) + tn(O('curl'), { fs: 14, wrap: 120 }),
    en: 'Frame one is engine.io OPEN: digit zero, then JSON. The sid is the layer two session id. Upgrades is empty because we are already on WebSocket; over polling, curl shows websocket in that list. pingInterval and pingTimeout are the defaults, twenty-five and twenty seconds. maxPayload is about one megabyte.' },
  { t: 'Frame 2 — socket.io CONNECT, and the second sid', body: wire([['↑', '40', 'sent by hand: 4 MESSAGE + 0 CONNECT'], ['↓', WIRE[1], 'engine.io 4 + socket.io 0 = CONNECT']], { fs: 22 }) + path([{ t: '4', s: 'engine.io MESSAGE' }, { t: '0', s: 'socket.io CONNECT', on: true }, { t: '{"sid":…}', s: 'the namespace\'s sid' }], { h: 150, fs: 26 }) + two(
      cmp(['Id', 'Value', 'Layer'], [['engine.io sid', `<code>${OPEN.sid}</code>`, '2 · the connection'], ['socket.io sid', `<code>${JSON.parse(WIRE[1].slice(2)).sid}</code>`, '3 · the socket in "/"']]),
      box('Two different values — on purpose', `One engine.io connection can carry several namespaces; each answers CONNECT with its own sid. In code: ${c('socket.conn.id')} vs ${c('socket.id')} (lesson 0.1 measured two namespaces on one connection).`, 'lam')), to: true,
    en: 'Frame two: we sent four zero, the server answered four zero with a JSON sid. Four is engine.io MESSAGE, zero is socket.io CONNECT. The sid inside is different from the one in frame one: one connection can carry several namespaces, and each answers with its own socket id.' },
  { t: 'Frame 3 — socket.io EVENT is your emit', body: wire([['↓', WIRE[2], 'engine.io 4 + socket.io 2 = EVENT']], { fs: 22 }) + path([{ t: '4', s: 'engine.io MESSAGE' }, { t: '2', s: 'socket.io EVENT', on: true }, { t: '"hello"', s: 'event name' }, { t: '{"world":42}', s: 'args[0]' }], { h: 150, fs: 26 }) + two(
      js(`socket.emit('hello', { world: 42 })\n//     ↓        ↓          ↓\n// 4 · 2 · ["hello", {"world":42}]\n//  ↑   ↑     name      args[0]\n// MESSAGE EVENT`, { sm: false }),
      box('Read it right to left', 'A JSON array: element 0 is the event NAME, the rest are the arguments. Layer 4 sees exactly that: <code>socket.on(\'hello\', (arg) => …)</code>.', 'xanh')), to: true,
    en: 'Frame three: four two, then a JSON array. Four is MESSAGE, two is EVENT. The first element of the array is the event name, hello; the rest are the arguments. That is exactly your emit of hello with world forty-two, as it travels.' },
  { t: 'Two tables for the whole course', body: two(cmp(['1st digit', 'engine.io (layer 2)'], [['0', 'OPEN'], ['1', 'CLOSE'], ['2', 'PING'], ['3', 'PONG'], ['4', 'MESSAGE — a socket.io packet follows'], ['5', 'UPGRADE'], ['6', 'NOOP']]),
      cmp(['2nd digit', 'socket.io (layer 3), after a 4'], [['0', 'CONNECT'], ['1', 'DISCONNECT'], ['2', 'EVENT'], ['3', 'ACK'], ['4', 'CONNECT_ERROR'], ['5', 'BINARY_EVENT'], ['6', 'BINARY_ACK']])) +
    box('Trap: 2 and 3 mean different things in different layers', 'Alone, <code>2</code> is a PING and <code>3</code> a PONG (layer 2). After a <code>4</code>, the same digits mean EVENT and ACK (layer 3). Mixing them up is the #1 source of confused protocol logs.', 'do2'),
    en: 'Two tables for the whole course. The first digit is engine.io: zero open, one close, two ping, three pong, four message, five upgrade, six noop. After a four, the second digit is socket.io: zero connect, one disconnect, two event, three ack, four connect error, five and six the binary variants. Trap: two and three alone are ping and pong; after a four they are event and ack.' },
  { t: 'In a real browser: the polling phase', body: wire(XHR.map(([m, gui, than]) => m === 'POST' ? ['↑', gui, `POST · server answers "${than}"`] : ['↓', than.replace(/\u001e/g, '␞'), 'GET response']), { fs: 19, max: 64 }) +
    two(box('Two packets, ONE response', `The third GET carried <code>40{…}</code> AND <code>42["hello",…]</code>, separated by the record separator <code>\\x1e</code> (shown as ␞). Polling batches whatever is queued.`, 'lam'),
      box('Acks start at 0', `The browser's first emit with a callback went out as <code>420[…]</code> — ack id <b>0</b>; the reply came back as <code>430[…]</code>.`, 'xanh')) +
    cmp(['URL parameter', 'Real value', 'Meaning'], [['EIO', '<code>4</code>', 'engine.io protocol version 4'], ['transport', '<code>polling</code>', 'layer 1 for this request'],
      ['t', '<code>ei192gby</code>', 'a cache-buster, new on every request'], ['sid', '<code>uPrY2c-RnVM5ml82AAAA</code>', 'the engine.io sid from OPEN — ties the requests into ONE connection']]),
    en: 'The same packets in a real Chromium page, polling phase. GET returns OPEN; POST sends four zero; the next GET carries two packets in one response, CONNECT and the hello event, separated by the record separator. The page then emitted chat message with a callback: four two zero, ack id zero, and the reply came back as four three zero.' },
  { t: 'In a real browser: the WebSocket phase', body: wire(WS.map(([h, chu, t]) => [h, chu, `${t} ms · ${chu === '2probe' ? 'probe: is this pipe alive?' : chu === '3probe' ? 'probe answered' : chu === '5' ? 'UPGRADE: switch to this pipe' : chu === '2' ? 'PING (server)' : chu === '3' ? 'PONG (client)' : chu.startsWith('42') ? 'EVENT with ack id 0 (server → client)' : chu.startsWith('43') ? 'ACK 0 — the client answered' : ''}`]), { fs: 19 }) +
    box('The upgrade dance, then quiet', `The client tests the new pipe with <code>2probe</code>/<code>3probe</code>, sends <code>5</code>, and polling stops. After that: your events, and a ping/pong every <code>pingInterval</code> (2 s on this test page).`, 'lam'),
    en: 'The WebSocket phase. The client tests the new pipe with two probe and three probe, then sends five, upgrade, and polling stops. The server emitted hoi with an acknowledgement, four two zero; the client answered four three zero. Then every two seconds on this test page: ping two from the server, pong three from the client.' },
  { t: 'What the page saw — and what DevTools shows', body: two(br('sio-00-3', 'trang', { url: 'localhost:19431 · Chromium (Playwright)', vp: 960, h: 300, w: 560 }),
      steps(['DevTools → <b>Network</b> → filter <b>WS</b>', 'Click the <code>/socket.io/?EIO=4&transport=websocket</code> row', 'Tab <b>Messages</b>: ↑ green = sent, ↓ = received', 'Read the leading digits with the two tables', 'No <code>42["your-event",…]</code> row ⇒ it never left'])) +
    box('One question replaces guessing', '"Did the client receive my emit?" becomes "is there a <code>42[\"name\",…]</code> row in the WS tab?" — the first branch of the diagnosis tree in Chapter 10.', ''), to: true,
    en: 'What the page logged, and how to see the same frames yourself: DevTools, Network, filter WS, click the socket dot io row, open Messages, and read the leading digits with the two tables. The question did my emit arrive becomes: is there a four two row with my event name? That is step one of the diagnosis tree in chapter ten.' },
  { t: 'Measured: maxPayload closes the CONNECTION', body: tn(O('maxpayload'), { fs: 17, wrap: 100 }) + two(
      box('Not "message rejected"', 'One message over the limit (default <code>maxHttpBufferSize</code> = 1e6) and engine.io closes the whole connection: server <code>transport error</code>, client <code>transport close</code>. Everything on that socket is gone with it.', 'do2'),
      box('What to do instead', 'Upload big files over HTTP (or object storage) and send only an id/URL through the socket. Raise the limit only knowingly — it is also your memory guard.', 'xanh')),
    en: 'Measured: maxPayload. A string of nine hundred ninety-nine thousand characters arrived. One of one point one million closed the whole connection: transport error on the server, transport close on the client. It is not a rejected message, it is a dead socket. Send big files over HTTP and only an id through the socket.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('engine.io packet type', '1st digit: 0 OPEN · 2 PING · 3 PONG · 4 MESSAGE'), kw('socket.io packet type', '2nd digit after 4: 0 CONNECT · 2 EVENT · 3 ACK'),
      kw('OPEN packet', 'sid · upgrades · pingInterval · pingTimeout · maxPayload'), kw('Two sids', 'socket.conn.id (layer 2) vs socket.id (layer 3)'),
      kw('EVENT frame', '42["name", …args] — your emit on the wire'), kw('Ack id', 'counts from 0; only when you emit WITH a callback'), kw('Record separator', '\\x1e between packets in one polling response'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: engine.io and socket.io packet types; the OPEN packet; the two ids; the EVENT frame; the ack id, which counts from zero; and the record separator between packets in one polling response.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Connect with raw ${c('ws')} to ${c('/socket.io/?EIO=4&transport=websocket')}, send ${c('40')}, print every frame`,
      'Decode the first three frames and find the TWO different sids',
      `${c('curl')} the polling URL and compare <code>upgrades</code>`,
      'In DevTools → WS → Messages, match every row to the two tables',
    ]), box('Keep these', `<ul><li>First three frames: OPEN · CONNECT · EVENT</li><li>1st digit = engine.io; 2nd (after 4) = socket.io</li><li>Two sids: connection vs socket</li><li>Acks count from 0; over maxPayload the connection dies</li></ul>`, 'lam'), ''),
    en: 'Your turn: connect with raw ws, send four zero and print every frame; decode the first three and find the two ids; curl the polling URL and compare upgrades; and in DevTools match every message row to the two tables. Keep: OPEN, CONNECT, EVENT; first digit engine.io, second socket.io; two ids; acks start at zero; over maxPayload the connection dies.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Socket.IO really is', bai: '0.3' }, S);
