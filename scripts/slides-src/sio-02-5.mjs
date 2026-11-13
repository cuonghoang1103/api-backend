/**
 * sio-02-5 — Socket.IO · Chapter 2 · Lesson 2.5 "Binary payloads: NOT base64" (deck video + web, 13/11/2026).
 * Bài web: io-2-5-binary. Output THẬT (scratchpad/sio/demo/n2-5.txt · socket.io 4.8.3 · Node 22.23.3 · Chromium Playwright):
 * byte: Buffer 1 KB ⇒ websocket 1074 B trên dây (khung chữ placeholder 451-[…] + khung nhị phân 1024 B), polling 1737 B (2 lượt GET: placeholder + "b"+base64 1369 B);
 * Chromium: ws ↓451-["binary",{"_placeholder":true,"num":0}] rồi ↓<binary 1024 B>; polling GET 44 B rồi GET 1369 B "bKioq…" (web vẽ MỘT khung 1024 — thiếu khung placeholder);
 * tran: client emit 1,1 MB > maxHttpBufferSize ⇒ websocket: server "transport error", client "transport close" (web nói "forced close" — SAI), polling: client
 * "transport error", server "transport close"; handler KHÔNG chạy; client TỰ nối lại.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-5:file:trang25.mjs": "// Trang Chromium: server emit Buffer 1 KB — bắt khung WS thật (opcode nhị phân) và thân polling thật\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { Server } from 'socket.io';\nconst srv = http.createServer((req, res) => { if (req.url.startsWith('/?') || req.url === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(readFileSync('trang25.html')); } });\nconst io = new Server(srv);\nio.on('connection', (s) => setTimeout(() => s.emit('binary', Buffer.alloc(1024, 42)), 400));\nsrv.listen(19566, () => console.log('trang ở http://localhost:19566'));\n",
 "n2-5:file:trang25.html": "<!doctype html><html><head><meta charset=\"utf-8\"><title>binary</title>\n<style>body{font:18px/1.5 system-ui;margin:24px;background:#f8fafc}pre{background:#0b1018;color:#e6edf3;padding:14px 18px;border-radius:10px;font:16px/1.6 Consolas,monospace}</style></head>\n<body><pre id=\"log\"></pre><script src=\"/socket.io/socket.io.js\"></script><script>\nconst log = (s) => (document.getElementById('log').textContent += s + '\\n');\nconst tr = new URLSearchParams(location.search).get('t') || 'websocket';\nconst socket = io({ transports: tr === 'polling' ? ['polling'] : ['polling', 'websocket'] });\nsocket.on('binary', (d) => log(tr + ': nhận ' + d.constructor.name + ' ' + d.byteLength + ' byte, byte đầu = ' + new Uint8Array(d)[0]));\n</script></body></html>\n",
 "n2-5:trang": "$ node /Users/admin/Documents/video-bai-giang/scratchpad/sio/anh.mjs /Users/admin/Documents/video-bai-giang/scratchpad/sio/spec/sio-2-5.json\n✓ ws  http://localhost:19566/?t=websocket  mạng 6 · console 0\n✓ poll  http://localhost:19566/?t=polling  mạng 15 · console 1",
 "n2-5:ws": "[[\"↑\", \"2probe\", 35], [\"↓\", \"3probe\", 36], [\"↑\", \"5\", 139], [\"↓\", \"451-[\\\"binary\\\",{\\\"_placeholder\\\":true,\\\"num\\\":0}]\", 436], [\"↓\", \"<binary 1024 B>\", 436]]",
 "n2-5:poll": "[[\"GET\", 118, \"0{\\\"sid\\\":\\\"prrUHSIx6mCPlyDUAAAB\\\",\\\"upgrades\\\":[\\\"websocket\\\"],\\\"pin\", 20, \"\"], [\"POST\", 2, \"ok\", 20, \"40\"], [\"GET\", 32, \"40{\\\"sid\\\":\\\"T_ZZeerupLkSfk19AAAB\\\"}\", 20, \"\"], [\"GET\", 44, \"451-[\\\"binary\\\",{\\\"_placeholder\\\":true,\\\"num\\\":0}]\", 422, \"\"], [\"GET\", 1369, \"bKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKio\", 430, \"\"]]",
 "n2-5:file:nhi-phan.mjs": "// Server emit một Buffer 1 KB (toàn 0x2a): client nhận gì, và trên dây TCP tốn bao nhiêu byte — websocket vs polling (proxy đếm byte, chỉ đếm sau khi đã nối)\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function do1(transport, cong) {\n  const io = new Server(cong); let sk, xuong = 0, dem = false, mau = '';\n  io.on('connection', (s) => (sk = s));\n  net.createServer((a) => { const b = net.connect(cong); a.pipe(b); b.on('data', (d) => { if (dem) { xuong += d.length; mau += d.toString('latin1'); } a.write(d); }); for (const x of [a, b]) x.on('error', () => {}); }).listen(cong + 1);\n  const c = ketNoi(`http://localhost:${cong + 1}`, { transports: [transport] });\n  c.on('binary', (data) => console.log(`${transport.padEnd(9)} client nhận: ${data.constructor.name} ${data.length} byte, byte đầu = ${data[0]}`));\n  await new Promise((r) => c.on('connect', r)); await cho(300);\n  dem = true; sk.emit('binary', Buffer.alloc(1024, 42)); await cho(300); dem = false;\n  const chu = mau.includes('\\r\\n\\r\\n') ? mau.split('\\r\\n\\r\\n').slice(1).join('') : mau;\n  console.log(`${transport.padEnd(9)} trên dây server→client: ${xuong} B · mẫu: ${JSON.stringify(chu.replace(/[\\x00-\\x09\\x0b-\\x1f]/g, (x) => (x === '\\x1e' ? '␞' : '·')).slice(0, 70))}…`);\n  c.close(); io.close(); await cho(100);\n}\nawait do1('websocket', 19560); await do1('polling', 19562);\nprocess.exit(0);\n",
 "n2-5:byte": "$ node nhi-phan.mjs\nwebsocket client nhận: Buffer 1024 byte, byte đầu = 42\nwebsocket trên dây server→client: 1074 B · mẫu: \",451-[\\\"binary\\\",{\\\"_placeholder\\\":true,\\\"num\\\":0}]~··********************\"…\npolling   client nhận: Buffer 1024 byte, byte đầu = 42\npolling   trên dây server→client: 1737 B · mẫu: \"451-[\\\"binary\\\",{\\\"_placeholder\\\":true,\\\"num\\\":0}]HTTP/1.1 200 OK·\\nContent-T\"…",
 "n2-5:file:tran.mjs": "// Client emit một Buffer 1,1 MB (> maxHttpBufferSize 1e6 mặc định): server làm gì, hai phía thấy reason gì?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nfor (const [transport, cong] of [['websocket', 19564], ['polling', 19565]]) {\n  const io = new Server(cong); let nhan = false;\n  io.on('connection', (s) => { s.on('to', () => (nhan = true)); s.on('disconnect', (r) => console.log(`${transport.padEnd(9)} server: disconnect \"${r}\"`)); });\n  const c = ketNoi(`http://localhost:${cong}`, { transports: [transport] });\n  c.on('disconnect', (r) => console.log(`${transport.padEnd(9)} client: disconnect \"${r}\" · active=${c.active}`));\n  await new Promise((r) => c.on('connect', r));\n  c.emit('to', Buffer.alloc(1_100_000, 1)); await cho(800);\n  console.log(`${transport.padEnd(9)} handler 'to' có chạy? ${nhan ? 'CÓ' : 'KHÔNG'}`);\n  c.close(); io.close();\n}\nprocess.exit(0);\n",
 "n2-5:tran": "$ node tran.mjs\nwebsocket server: disconnect \"transport error\"\nwebsocket client: disconnect \"transport close\" · active=true\nwebsocket handler 'to' có chạy? KHÔNG\npolling   client: disconnect \"transport error\" · active=true\npolling   server: disconnect \"transport close\"\npolling   handler 'to' có chạy? KHÔNG"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, wire, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-02-5', code: 'SIO 2.5', title: 'Binary payloads: NOT base64', sub: 'Chapter 2 · Lesson 2.5' };
const O = (k) => { const v = DU_LIEU[`n2-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const WS = JSON.parse(O('ws'));
const POLL = JSON.parse(O('poll'));
const BY = O('byte').split('\n');
const b = (tr) => +BY.find((l) => l.startsWith(tr) && l.includes('trên dây')).match(/(\d+) B/)[1];

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.5', t: 'Binary payloads:<br>NOT base64', sub: 'One Buffer, two frames on WebSocket, two requests on polling — and the 1 MB wall',
    en: 'Lesson two point five: binary payloads are not base64. One Buffer becomes two frames on WebSocket and two requests on polling, and there is a one megabyte wall.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Emit a Buffer: the client gets a Buffer (Node) or ArrayBuffer (browser) back</li>
    <li>On WebSocket: a text placeholder frame + a native binary frame</li>
    <li>On polling: the same placeholder, then the bytes as base64 in the next response</li>
    <li>Bytes on the wire, measured: ${b('websocket')} B vs ${b('polling')} B for 1 KB</li>
    <li>The 1 MB <code>maxHttpBufferSize</code>: what really happens above it</li></ul>`,
    en: 'Five takeaways: emitting a Buffer gives a Buffer or ArrayBuffer back; on WebSocket it is a placeholder frame plus a native binary frame; on polling the bytes come as base64 in the next response; the bytes on the wire, measured; and what really happens above the one megabyte limit.' },
  { t: 'In a real Chromium: two frames, not one', body: wire(WS.map(([h, chu, t]) => [h, chu, `${t} ms · ${chu.startsWith('451-') ? '4 MESSAGE + 5 BINARY_EVENT, 1 attachment' : chu.startsWith('<binary') ? 'the attachment: raw bytes, opcode binary' : chu === '5' ? 'upgrade' : 'probe'}`]), { fs: 18, w: 1110, max: 60 }) + two(box('Read it', `${c('451-')} = engine.io 4 MESSAGE + socket.io 5 BINARY_EVENT + "1 attachment follows". The JSON keeps a ${c('{"_placeholder":true,"num":0}')} where the Buffer was; the next frame IS the Buffer — 1024 raw bytes.`, 'lam'),
    box('Not what the web page drew', 'The web lesson shows ONE binary frame of 1024 bytes. There are two: the placeholder (text) and the attachment (binary).', 'do2')), to: true,
    en: 'In a real Chromium: two frames, not one. The first is text: four five one dash, meaning engine.io message, socket.io binary event, one attachment follows, with a placeholder object where the Buffer was. The second frame is the Buffer itself, one thousand twenty-four raw bytes. The web lesson drew only the second.' },
  { t: 'On polling: base64, in the next response', body: wire(POLL.map(([pp, kt, than, t, gui]) => [pp === 'POST' ? '↑' : '↓', pp === 'POST' ? gui : than, `${t} ms · ${pp} · ${kt} B${than.startsWith('b') ? ' — "b" + base64' : than.startsWith('451-') ? ' — placeholder' : ''}`]), { fs: 19, max: 60 }) +
    two(box('Same placeholder, different attachment', 'GET #1 returns the text packet (44 B). GET #2 returns <code>b</code> + base64 — <b>1369 B</b> for 1024 bytes: +33 %, plus one more round trip.', 'do2'),
      box('So', 'Binary-heavy features want the WebSocket upgrade: no base64, no extra request.', 'la2')), to: true,
    en: 'On polling: the same placeholder arrives in one GET, forty-four bytes. The bytes themselves arrive in the next GET as the letter b plus base64: one thousand three hundred sixty-nine bytes for one thousand twenty-four, a third more, and one more round trip.' },
  { t: 'Measured: bytes on the TCP wire for 1 KB', body: tn(O('byte'), { fs: 15, wrap: 120 }) + meter([['payload', 1024, '#64748b'], ['WebSocket', b('websocket'), '#1f8a3b'], ['polling', b('polling'), '#c0392b']], { don: 'B', nhan: 220, rh: 56, fs: 20 }), to: true,
    en: 'Measured on the TCP wire for one kilobyte: WebSocket one thousand seventy-four bytes, the payload plus a small placeholder frame and two frame headers. Polling one thousand seven hundred thirty-seven bytes: base64 plus two sets of HTTP headers.' },
  { t: 'Measured: above maxHttpBufferSize (1 MB)', body: tn(O('tran'), { fs: 17, wrap: 110 }) + two(
      box('What really happens', `The client emitted 1.1 MB. The handler never ran. The WHOLE connection closed: on WebSocket the server saw ${c('transport error')}, the client ${c('transport close')} — and reconnected (<code>active=true</code>).`, 'do2'),
      box('Not “forced close”', `The web lesson says ${c('disconnect("forced close")')}. Not on 4.8.3. And the client will happily retry — so a client stuck sending a too-big payload loops.`, 'lam')),
    en: 'Measured above the one megabyte limit. The client emitted one point one megabytes; the handler never ran, and the whole connection closed. On WebSocket the server saw transport error and the client transport close, then reconnected. Not forced close as the web lesson says.' },
  { t: 'When NOT to send binary through socket.io', body: cmp(['Payload', 'Use', 'Why'], [
      ['file upload &gt; 1 MB', 'HTTP POST + progress, chunked', 'resume, progress, no 1 MB wall, no RAM spike per emit'],
      ['video / voice', 'WebRTC media', 'socket.io only carries signalling (Chapter 7)'],
      ['thumbnail, avatar, protobuf (2–100 KB)', 'socket.io binary ✓', 'small, latency matters, native frame on WebSocket'],
      ['“just raise maxHttpBufferSize to 100 MB”', '✗', 'every emit can make the server buffer 100 MB — a DDoS surface'],
    ], { hl: [3, 4] }) + js(`io = new Server(server, { maxHttpBufferSize: 1e6 }); // default 1 MB`), to: true,
    en: 'When not to send binary through socket.io: uploads over a megabyte go to a plain HTTP endpoint with progress and chunks; video and voice go over WebRTC; thumbnails and small protobufs are fine. And raising the buffer limit to one hundred megabytes lets any client make the server buffer a hundred megabytes.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('BINARY_EVENT (5)', 'socket.io packet type with attachments'), kw('_placeholder', '{"_placeholder":true,"num":0} marks where a Buffer was'),
      kw('Binary frame', 'native WebSocket opcode — raw bytes, no base64'), kw('"b" + base64', 'how polling carries an attachment (+33 %)'),
      kw('maxHttpBufferSize', '1e6 by default; above it the connection is closed'), kw('Upload endpoint', 'big files belong to plain HTTP'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: binary event; the placeholder; the binary frame; b plus base64 on polling; max HTTP buffer size; and the upload endpoint.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Emit a 1 KB Buffer; in DevTools → WS find the placeholder frame AND the binary frame',
      `Force ${c("transports: ['polling']")}; find the second GET starting with "b"`,
      'Count bytes on the wire for both; compute the base64 overhead',
      'Emit 1.1 MB from the client; log the reason on BOTH sides',
    ]), box('Keep these', `<ul><li>Buffer in ⇒ Buffer/ArrayBuffer out</li><li>WebSocket: placeholder + native binary frame</li><li>Polling: base64 in an extra response (+33 %)</li><li>&gt; 1 MB ⇒ the connection dies; big files ⇒ HTTP</li></ul>`, 'lam'), ''),
    en: 'Your turn: emit a one kilobyte Buffer and find both frames; force polling and find the base64 response; count bytes on the wire; and emit one point one megabytes and log the reason on both sides. Keep: WebSocket sends a placeholder plus a native binary frame; polling sends base64 in an extra response; above one megabyte the connection dies.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Transports and the upgrade', bai: '2.5' }, S);
