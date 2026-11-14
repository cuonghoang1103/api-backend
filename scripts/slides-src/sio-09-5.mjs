/**
 * sio-09-5 — Socket.IO · Chapter 9 · Lesson 9.5 "When socket.io is enough anyway" (deck video + web, 14/11/2026).
 * Bài web: io-9-5-lai-du. Output THẬT (scratchpad/sio/demo/n9-5.txt · lab ~/.rtq-sio/lab/c9 · GitHub API + npm 14/11/2026):
 * khach: client chính thức cho C++, Swift, Java; Python, C#, Rust cộng đồng; Go archived; Arduino/ESP32 có SocketIOclient. socket.io-client min 46.822 B / gzip 14.717 B.
 * tay: socket.io VIẾT TAY 13 dòng trên ws trần, EIO=4: 0 OPEN ⇒ 40 CONNECT ⇒ 42 EVENT ⇒ nhận telemetry thật từ gateway kho.
 *      EIO=3 (mặc định SocketIOclient): polling 400 "Unsupported protocol version"; websocket ⇒ khung hỏng; allowEIO3 ⇒ nối được nhưng auth trong CONNECT không có ⇒ 44"unauthorized".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-5:khach": "$ node khach95.mjs       # hỏi thẳng GitHub API + npm, 14/11/2026\nnền tảng                          kho GitHub                            sao   push cuối    archived\nJavaScript / Node / React Native  socketio/socket.io-client            10581  2024-07-09  không\nC++ (chính thức)                  socketio/socket.io-client-cpp         2357  2025-08-28  không\nSwift (chính thức)                socketio/socket.io-client-swift       5288  2024-10-01  không\nJava / Kotlin (chính thức)        socketio/socket.io-client-java        5396  2025-08-11  không\nPython                            miguelgrinberg/python-socketio        4369  2026-11-03  không\nC# .NET                           doghappy/socket.io-client-csharp       797  2026-07-24  không\nGo                                googollee/go-socket.io                5765  2024-09-29  CÓ\nRust                              1c3t3a/rust-socketio                   481  2025-02-03  không\nArduino / ESP32 (SocketIOclient)  Links2004/arduinoWebSockets           2069  2026-09-22  không\nsocket.io-client 4.8.4 (npm) · bản lab 4.8.3: socket.io.min.js 46.822 B · gzip 14.717 B",
 "n9-5:tay": "$ wc -l tay95.mjs\n      13 tay95.mjs\n$ node bo.mjs 1 &  node tay95.mjs 4      # socket.io VIẾT TAY trên WebSocket trần, giao thức đời 4 (EIO=4)\n   80 ms ↓ 0{\"sid\":\"oEjb-b6pHiJvgJX5AAAA\",\"upgrades\":[],\"pingInterval\":25000,\"pingTimeout\":20000,\"maxPayload\":1\n   81 ms ↑ 40{\"userId\":1}          (CONNECT namespace /, kèm auth)\n   82 ms ↓ 40{\"sid\":\"SgKlR-oAGcqSjiq2AAAA\"}\n   82 ms ↑ 42[\"maker:device:join\",1]  (EVENT)\n 1079 ms ↓ 42[\"maker:device:telemetry\",{\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":1,\"gui\":1794611\n 2082 ms ↓ 42[\"maker:device:telemetry\",{\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":2,\"gui\":1794611\n 3000 ms ↓ 42[\"maker:device:status\",{\"deviceId\":1,\"status\":\"OFFLINE\"}]\n$ curl -i \"localhost:19910/socket.io/?EIO=3&transport=polling\"     # mặc định của SocketIOclient trong firmware: EIO=3\nHTTP/1.1 400 Bad Request\n{\"code\":5,\"message\":\"Unsupported protocol version\"}\n$ node tay95.mjs 3       # EIO=3 qua WebSocket\n    8 ms ✕ lỗi: Invalid WebSocket frame: RSV1 must be clear\n$ EIO3=1 npx tsx may9.ts &  node tay95.mjs 3     # server bật allowEIO3: true\n   13 ms ↓ 0{\"sid\":\"oOHPYYbOslsFythDAAAA\",\"upgrades\":[],\"pingInterval\":25000,\"pingTimeout\":20000,\"maxPayload\":1\n   16 ms ↑ 40{\"userId\":1}          (CONNECT namespace /, kèm auth)\n   16 ms ↓ 44\"unauthorized\"\n   20 ms ↓ 44\"unauthorized\""
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, wire } from './_sio-chung.mjs';

export const deck = { key: 'sio-09-5', code: 'SIO 9.5', title: 'When socket.io is enough anyway', sub: 'Chapter 9 · Lesson 9.5' };
const O = (k) => { const v = DU_LIEU[`n9-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHACH = O('khach'), TAY = O('tay');
const ex = (txt, bo = [], n = 999) => txt.split('\n').filter((l) => !bo.some((r) => r.test(l))).map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const dong = Number(m(/^\s+(\d+) tay95\.mjs/m, TAY)[1]);
const bMin = m(/socket\.io\.min\.js ([\d.]+) B · gzip ([\d.]+) B/, KHACH);
const [tay4, tay3] = TAY.split(/^\$ curl/m);

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.5', t: 'When socket.io<br>is enough anyway', sub: 'Who really has a client, what the protocol costs to write by hand, and the version trap. Measured.',
    en: 'Lesson nine point five: when socket.io is enough anyway. Who really has a client, what the protocol costs to write by hand, and one version trap.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Which platforms really have a socket.io client — checked today, not remembered</li>
    <li>socket.io spoken by hand over a raw WebSocket in ${dong} lines</li>
    <li>The EIO=3 trap waiting in the ESP32 library’s defaults</li>
    <li>Raw ws vs socket.io vs HTTP polling for a device — what each really costs</li>
    <li>A decision rule you can apply to any new target</li></ul>`,
    en: 'Five takeaways: which platforms have a client; socket.io written by hand; the EIO three trap; the three options for a device and their costs; and a decision rule.' },
  { t: 'Who really has a socket.io client (checked today)', body: tn(KHACH, { fs: 14, wrap: 120 }) +
      two(box('Versus the web page', `“C++ / Arduino / ESP32: <b>NO</b> — raw WebSocket only.” Checked: an <b>official</b> C++ client exists, and the ESP32 library this repo’s firmware already uses ships ${c('SocketIOclient')}. Go’s community client is <b>archived</b> (the page: “limited”).`, 'bad'),
        box('Read it', `Star counts and dates are a health signal, not a guarantee. The JS client’s own repo looks quiet because development moved into the ${c('socketio/socket.io')} monorepo. Bundle: <b>${bMin[1]} B</b> minified, <b>${bMin[2]} B</b> gzip — not “~150 KB”.`, 'info')),
    en: 'Checked today on GitHub: there is an official C++ client, official Swift and Java clients, community Python, C sharp and Rust, an archived Go client, and the Arduino library ships a socket.io client. The JS bundle is about fifteen kilobytes gzipped.' },
  { t: 'socket.io by hand, over a raw WebSocket', body: tn(ex(tay4.replace(/\s+# socket\.io VIẾT TAY.*$/m, ''), [], 112), { fs: 14, wrap: 120 }) +
      two(wire([['↓', '0{"sid":…,"pingInterval":25000,…}', 'OPEN (engine.io)'], ['↑', '40{"userId":1}', 'CONNECT “/”, with auth'], ['↓', '40{"sid":…}', 'CONNECT ok'],
        ['↑', '42["maker:device:join",1]', 'EVENT'], ['↓', '42["maker:device:telemetry",{…}]', 'EVENT from the bridge'], ['↓ / ↑', '2 / 3', 'ping / pong']], { w: 620, fs: 15, max: 34 }),
      box('Read it', `<b>${dong} lines</b> on a plain WebSocket joined the repo’s room and received the board’s telemetry through the real bridge — exactly what ${c('SocketIOclient')} does on an ESP32. Four packet types; the protocol is not the hard part.`, 'ok'), 'r64'),
    en: 'socket.io written by hand over a plain WebSocket: thirteen lines. Open, connect with auth, emit an event, receive events, answer pings. That is all SocketIOclient does on an ESP32.' },
  { t: 'The version trap: EIO=3', body: tn('$ curl' + tay3, { fs: 14, wrap: 120 }) +
      two(box('Read it', `${c('SocketIOclient.begin()')} defaults to ${c('/socket.io/?EIO=3')}. A socket.io 4 server answers polling with <b>400 “Unsupported protocol version”</b>; over WebSocket the board just sees a <b>broken frame</b>. With ${c('allowEIO3: true')} it connects — but v2-style clients cannot send ${c('auth')} in CONNECT, so the repo’s middleware says <b>unauthorized</b>.`, 'bad'),
        box('The fix on the board', `Pass the URL yourself: ${c('"/socket.io/?EIO=4"')} — the library switches to the v4 ping rules when it sees ${c('EIO=4')} (${c('SocketIOclient.cpp:70')}). Or keep EIO=3, enable ${c('allowEIO3')}, and move the token to the query string — with the logging risk of lesson 1.4.`, 'ok')),
    en: 'The version trap. The ESP32 library defaults to engine IO version three. socket.io four rejects it: four hundred over polling, a broken frame over WebSocket. allowEIO3 connects but the auth payload is missing. Pass EIO four in the URL instead.' },
  { t: 'Three kinds of “device”', body: icards([
      ['cpu', 'Raspberry Pi, Linux box, Node', 'Full runtime: plain socket.io-client. Reconnect, acks, rooms built in. No bridge.'],
      ['eye', 'Phone app (iOS / Android)', 'Official Swift / Java clients, same events as the web. No bridge.'],
      ['bolt', 'ESP32 / Arduino', 'Two honest choices: SocketIOclient with EIO=4, or raw ws + a bridge like this repo. Pick by payload, not by myth.'],
      ['pulse', 'Streams binary media', 'Raw ws wins: 1 frame per chunk vs 2 with socket.io binary (lesson 9.3: 18 vs 34 frames per second of audio).'],
    ], 2),
    en: 'Three kinds of device: a Linux box uses socket.io client directly; a phone app uses the official native clients; an ESP32 can do either, and binary media is where raw ws really wins.' },
  { t: 'What each choice really costs here', body: cmp(['', 'raw ws + bridge (repo)', 'SocketIOclient (EIO=4)', 'HTTP polling'], [
      ['code on the server', '~90 lines of plumbing in a 1,113-line file (9.1)', 'one more socket.io namespace or room', 'a REST route + a queue'],
      ['bytes per telemetry', '58 B (9.1)', '58 B (9.1)', 'a full HTTP request each poll'],
      ['binary audio', '1 frame per 2 KB chunk', '2 frames per chunk (+3%)', 'not realistic'],
      ['reconnect / heartbeat', 'you write it (9.2 — fixed 3 s here)', 'library: reconnect + EIO ping', 'none needed'],
      ['command latency', 'immediate', 'immediate', '≈ half the poll interval on average'],
    ], { hl: [2] }) + box('Versus the web page', `“Don’t choose raw ws to save ~150 KB of library.” The client is ~${Math.round(Number(bMin[2].replace(/\./g, '')) / 1000)} KB gzipped in a browser; on a board the cost is flash and RAM, which the repo’s comment cites. The real win here is binary audio, not size.`, 'info'),
    en: 'What each choice costs: raw ws plus a bridge gives single binary frames but you write the reconnect; SocketIOclient gives reconnect and pings with two frames per binary chunk; HTTP polling is simplest but adds half a poll interval of latency.' },
  { t: 'HTTP polling for a device: the arithmetic', body: two(cmp(['poll every', 'requests / day / device', 'average command delay', 'worst case'], [
      ['1 s', '86,400', '0.5 s', '1 s'], ['5 s (the page’s example)', '17,280', '2.5 s', '5 s'], ['60 s', '1,440', '30 s', '60 s'], ['5 min (meter reading)', '288', '2.5 min', '5 min']], { hl: [1] }),
      box('When it is the right answer', `Readings that matter every few minutes — a water meter, a temperature log — and no commands that must land now. No socket to keep alive, no reconnect logic, works through any proxy. <b>Computed, not measured</b>: delay = poll interval ÷ 2 on average.`, 'ok'), 'r64') +
      box('Trap', `A browser developer writing raw ws “because socket.io is heavy”: loses reconnect, rooms, acks and the DevTools view for ~15 KB. The repo’s own browser side stays on socket.io for exactly that reason.`, 'bad'),
    en: 'HTTP polling arithmetic: the average command delay is half the poll interval, and requests per day grow quickly. It fits meters and logs, not commands that must land now. And do not hand-roll raw ws in a browser to save fifteen kilobytes.' },
  { t: 'A decision rule for any new target', body: cmp(['Question about the target', 'If yes', 'If no'], [
      ['Does it run JS, Swift, Kotlin/Java, Python, C#?', 'socket.io client — no bridge', 'next question'],
      ['Is there a maintained client for it (check today)?', 'use it — pin the protocol version (EIO=4)', 'raw ws + a bridge'],
      ['Does it stream binary media?', 'raw ws frames (1 per chunk)', 'socket.io events are fine'],
      ['Does it only report every few minutes, with no urgent commands?', 'HTTP polling is enough', 'keep a socket'],
    ], { hl: [1] }) + box('This repo’s answer', `ESP32 + two-way audio ⇒ raw ws + bridge, browsers on socket.io. A reasonable choice — for the audio, not because “no client exists”.`, 'ok'),
    en: 'A decision rule: if the platform has a maintained client, use it and pin the protocol version; if it streams binary media, raw frames win; if it only reports every few minutes, HTTP polling is enough.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('socket.io-client', 'official JS; also C++, Swift, Java'), kw('SocketIOclient', 'the Arduino/ESP32 client in arduinoWebSockets'),
      kw('EIO=4 / EIO=3', 'engine.io protocol versions; v4 server rejects 3'), kw('allowEIO3', 'server option for old clients'),
      kw('Packet digits', '0 open · 40 connect · 42 event · 2/3 ping'), kw('Bridge', 'raw ws ⇒ socket.io room, when you choose raw'),
      kw('HTTP polling', 'delay ≈ interval ÷ 2'), kw('Check today', 'client lists age; look them up'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: socket.io client; SocketIOclient; EIO four and three; allowEIO3; packet digits; bridge; HTTP polling; and check today.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Look up today which platforms have a maintained socket.io client',
      'Write socket.io by hand on a raw WebSocket: OPEN, CONNECT, EVENT, pong',
      'Try EIO=3 against a v4 server, then fix it with EIO=4',
      'Pick raw ws, SocketIOclient or HTTP polling for three targets — with reasons',
    ]), box('Keep these', `<ul><li>C++, Swift, Java have official clients; ESP32 has one too</li><li>The wire protocol fits in ${dong} lines</li><li>Pin EIO=4 on old libraries</li><li>Binary media is raw ws’s real advantage</li><li>Polling: delay ≈ interval ÷ 2</li></ul>`, 'info'), ''),
    en: 'Your turn: check the client list today, write socket.io by hand, hit the EIO three trap and fix it, then choose for three targets.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Raw WebSocket: when socket.io is not available', bai: '9.5' }, S);
