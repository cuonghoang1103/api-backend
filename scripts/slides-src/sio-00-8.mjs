/**
 * sio-00-8 — Socket.IO · Section 0 · Start here (1/2) "What realtime is, and why Socket.IO" (deck video + web, 13/11/2026).
 * Bài web: io-0-0-start-here-1. Output THẬT (scratchpad/sio/demo/n0-8.txt · socket.io 4.8.3 · ws 8.21.2 · Node 22.23.3, Mac):
 * 5 tin ở mốc cố định — short polling 2 s trễ TB 1.491 ms (5 request HTTP), Socket.IO đẩy trễ TB 3 ms (0 request); giết server rồi bật lại:
 * ws thô close 1006, readyState 3 mãi mãi; socket.io "transport close" ⇒ reconnect_attempt #1, #2 ⇒ nối lại id mới. npm: socket.io 0.6.0 = 2010-12-24
 * (tác giả LearnBoost), engine.io 2012-07-03, 1.0.0 2014-05-28, 4.0.0 2021-03-10, 4.8.3 2025-12-23, npm latest 4.8.4 (2026-09-25).
 * Kho: src/socket/ 8 tệp 3.935 dòng (không tính test) — web cũ ghi 2.430 dòng; device.gateway.ts 1.113 dòng (web cũ 1.035).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-8:file:poll-vs-push.mjs": "// Tin xảy ra ở 5 thời điểm CỐ ĐỊNH; client A hỏi lại mỗi 2 giây (short polling), client B nhận đẩy qua Socket.IO.\nimport http from 'node:http';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst MOC = [700, 2900, 4100, 6600, 8300];            // ms kể từ lúc bắt đầu\nconst tin = [];                                         // [{ i, luc }]\nconst srv = http.createServer((req, res) => {           // GET /tin?sau=n ⇒ các tin có chỉ số >= n\n  const sau = Number(new URL(req.url, 'http://x').searchParams.get('sau') ?? 0);\n  res.end(JSON.stringify(tin.filter((t) => t.i >= sau)));\n});\nconst io = new Server(srv);\nawait new Promise((r) => srv.listen(19401, r));\nconst t0 = Date.now(), tre = { poll: [], push: [] };\nlet soRequest = 0, daCo = 0;\nconst cho = setInterval(async () => {                   // A: short polling mỗi 2000 ms\n  soRequest++;\n  const ds = await (await fetch(`http://localhost:19401/tin?sau=${daCo}`)).json();\n  for (const t of ds) { tre.poll.push(Date.now() - t0 - t.luc); daCo = t.i + 1; }\n}, 2000);\nconst b = ketNoi('http://localhost:19401');            // B: Socket.IO, server đẩy\nb.on('tin', (t) => tre.push.push(Date.now() - t0 - t.luc));\nawait new Promise((r) => b.on('connect', r));\nMOC.forEach((ms, i) => setTimeout(() => { const t = { i, luc: ms }; tin.push(t); io.emit('tin', t); }, ms - (Date.now() - t0)));\nawait new Promise((r) => setTimeout(r, 10500));\nclearInterval(cho); b.close(); io.close();\nconsole.log('tin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy');\nMOC.forEach((ms, i) => console.log(`#${i + 1}   ${String(ms).padStart(5)} ms     trễ ${String(tre.poll[i]).padStart(5)} ms         trễ ${tre.push[i]} ms`));\nconst tb = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);\nconsole.log(`trung bình            ${tb(tre.poll)} ms              ${tb(tre.push)} ms`);\nconsole.log(`request HTTP trong 10,5 s: short polling ${soRequest} · Socket.IO 0 (1 kết nối mở suốt)`);\n",
 "n0-8:poll": "$ node poll-vs-push.mjs\ntin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy\n#1     700 ms     trễ  1318 ms         trễ 4 ms\n#2    2900 ms     trễ  1107 ms         trễ 3 ms\n#3    4100 ms     trễ  1909 ms         trễ 1 ms\n#4    6600 ms     trễ  1410 ms         trễ 3 ms\n#5    8300 ms     trễ  1712 ms         trễ 2 ms\ntrung bình            1491 ms              3 ms\nrequest HTTP trong 10,5 s: short polling 5 · Socket.IO 0 (1 kết nối mở suốt)",
 "n0-8:file:may-chu.mjs": "// Một tiến trình, hai server: ws THÔ ở 19402, Socket.IO ở 19403.\nimport http from 'node:http';\nimport { WebSocketServer } from 'ws';\nimport { Server } from 'socket.io';\nnew WebSocketServer({ port: 19402 });\nconst srv = http.createServer(); new Server(srv); srv.listen(19403);\n",
 "n0-8:file:ong-vs-sio.mjs": "// Giết server giữa chừng rồi bật lại: ws thô làm gì, Socket.IO làm gì?\nimport { spawn } from 'node:child_process';\nimport WebSocket from 'ws';\nimport { io as ketNoi } from 'socket.io-client';\nconst t0 = Date.now(), t = () => `${String(Date.now() - t0).padStart(5)} ms`;\nlet p = spawn('node', ['may-chu.mjs'], { stdio: 'ignore' });\nawait new Promise((r) => setTimeout(r, 500));\nconst ws = new WebSocket('ws://localhost:19402');\nws.on('open', () => console.log(t(), 'ws thô     open'));\nws.on('close', (c) => console.log(t(), `ws thô     close ${c} — readyState ${ws.readyState} (CLOSED)`));\nws.on('error', () => {});\nconst s = ketNoi('http://localhost:19403');\ns.on('connect', () => console.log(t(), `socket.io  connect  id=${s.id}`));\ns.on('disconnect', (ly) => console.log(t(), `socket.io  disconnect: ${ly}`));\ns.io.on('reconnect_attempt', (n) => console.log(t(), `socket.io  reconnect_attempt #${n}`));\ns.io.on('reconnect', (n) => console.log(t(), `socket.io  reconnect sau ${n} lần thử`));\nsetTimeout(() => { console.log(t(), '── GIẾT server (SIGKILL)'); p.kill('SIGKILL'); }, 1500);\nsetTimeout(() => { console.log(t(), '── BẬT LẠI server'); p = spawn('node', ['may-chu.mjs'], { stdio: 'ignore' }); }, 4000);\nsetTimeout(() => { console.log(t(), `kết quả: ws thô readyState=${ws.readyState} (vẫn chết) · socket.io connected=${s.connected}`); s.close(); p.kill('SIGKILL'); process.exit(0); }, 9000);\n",
 "n0-8:ong": "$ node ong-vs-sio.mjs\n  518 ms ws thô     open\n  530 ms socket.io  connect  id=Y_Dna2onqbhSG928AAAA\n 2014 ms ── GIẾT server (SIGKILL)\n 2019 ms socket.io  disconnect: transport close\n 2019 ms ws thô     close 1006 — readyState 3 (CLOSED)\n 3396 ms socket.io  reconnect_attempt #1\n 4514 ms ── BẬT LẠI server\n 5132 ms socket.io  reconnect_attempt #2\n 5141 ms socket.io  reconnect sau 2 lần thử\n 5145 ms socket.io  connect  id=8b4koOm48IU2GpakAAAA\n 9513 ms kết quả: ws thô readyState=3 (vẫn chết) · socket.io connected=true\n 9513 ms socket.io  disconnect: io client disconnect",
 "n0-8:lich-su": "$ npm view socket.io time --json | grep -E '\"(created|0\\.6\\.0|1\\.0\\.0|2\\.0\\.0|3\\.0\\.0|4\\.0\\.0|4\\.8\\.3|4\\.8\\.4)\"'\n  \"created\": \"2010-12-24T04:53:35.445Z\",\n  \"0.6.0\": \"2010-12-24T04:53:35.445Z\",\n  \"1.0.0\": \"2014-05-28T17:18:37.764Z\",\n  \"2.0.0\": \"2017-05-08T23:16:09.507Z\",\n  \"3.0.0\": \"2020-11-05T21:08:44.084Z\",\n  \"4.0.0\": \"2021-03-10T11:45:02.546Z\",\n  \"4.8.3\": \"2025-12-23T16:42:13.022Z\",\n  \"4.8.4\": \"2026-09-25T08:51:53.015Z\"\n$ npm view socket.io@0.6.0 author\nLearnBoost\n$ npm view engine.io time.created\n2012-07-03T22:35:39.760Z\n$ npm view socket.io version\n4.8.4",
 "n0-8:kho": "$ grep -nE '\"(socket.io|@socket.io/redis-adapter)\"' package.json\n78:    \"@socket.io/redis-adapter\": \"^8.3.0\",\n137:    \"socket.io\": \"^4.8.3\",\n$ wc -l $(ls src/socket/*.ts | grep -v test)\n     281 src/socket/call.socket.ts\n    1113 src/socket/device.gateway.ts\n     680 src/socket/doiKhang.socket.ts\n     362 src/socket/listen-together.ts\n     614 src/socket/messaging.socket.ts\n     300 src/socket/notes-collaboration.gateway.ts\n     410 src/socket/work-docs-collaboration.gateway.ts\n     175 src/socket/work.socket.ts\n    3935 total"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, hub, meter, flow, XANH } from './_sio-chung.mjs';

export const deck = { key: 'sio-00-8', code: 'SIO 0.8', title: 'Start here (1/2) — What realtime is, and why Socket.IO', sub: 'Section 0 · Start here (1/2)' };
const O = (k) => { const v = DU_LIEU[`n0-8:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const POLL = O('poll').split('\n');
const tre = POLL.filter((l) => /^#\d/.test(l)).map((l) => { const m = /^#(\d)\s+(\d+) ms\s+trễ\s+(\d+) ms\s+trễ (\d+) ms/.exec(l); return m && [m[1], m[2], m[3], m[4]]; }).filter(Boolean);
const tb = POLL.find((l) => l.startsWith('trung bình')).match(/\d+/g);
const WC = O('kho').split('\n').filter((l) => /^\s+\d+ src\/socket/.test(l)).map((l) => { const [n, p] = l.trim().split(/\s+/); return [p.replace('src/socket/', ''), +n]; });
const TONG = O('kho').match(/(\d+) total/)[1];

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What realtime is,<br>and why Socket.IO', sub: 'The other half of the web: the server talks first — measured, not assumed',
    en: 'Start here, part one: what realtime is, and why this course uses Socket.IO. Realtime is the other half of the web, where the server speaks first. Everything here is measured.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Request/response vs realtime — which problem each one solves</li>
    <li>Short polling vs a server push, measured on the same five events</li>
    <li>Why a raw WebSocket is only a pipe — killed and restarted live</li>
    <li>The four things Socket.IO adds on top of that pipe</li>
    <li>A short, verifiable history and where it runs in this repo</li>
    <li>What this course covers, and what it gives you</li></ul>`,
    en: 'Six takeaways: request/response versus realtime; short polling versus push, measured; why a raw WebSocket is only a pipe; the four things Socket.IO adds; a short verified history and where it runs in this repo; and the course map.' },
  { t: 'Two shapes of conversation', body: icards([
      ['page', 'Request / response', 'Client asks, server answers, done. Right for "load my profile".'],
      ['bolt', 'Realtime', 'One connection stays open; EITHER side may send at any moment. Right for "tell me the instant a message arrives".'],
      ['clock', 'Short polling', 'Fake realtime: the client asks again every few seconds. Costs requests and is always a beat late.'],
      ['plug', 'WebSocket', 'One long-lived, two-way connection — the wire real realtime is built on.'],
    ], 2) + box('Realtime you already use', 'A chat message that appears without reloading · a presence dot turning green · a cursor moving in a shared document · a call connecting.', 'lam'),
    en: 'Two shapes of conversation. Request and response: the client asks, the server answers, the exchange ends. Realtime: one connection stays open and either side may send at any moment. Short polling fakes realtime by asking again every few seconds. A WebSocket is the long-lived two-way wire that real realtime is built on.' },
  { t: 'Measured: short polling vs a server push', body: two(cmp(['Event', 'Happened at', 'Short polling (2 s)', 'Socket.IO push'],
      [...tre.map(([i, ms, p, s]) => [`#${i}`, `${ms} ms`, `+${p} ms`, `+${s} ms`]), ['<b>Average</b>', '', `<b>${tb[0]} ms</b>`, `<b>${tb[1]} ms</b>`]], { hl: [5] }),
      `<div>${meter([['short polling', +tb[0], '#c0392b'], ['Socket.IO push', +tb[1], XANH]], { nhan: 200, w: 470, rh: 52 })}${box('And the request count', 'In 10.5 s the poller sent <b>5</b> HTTP requests; the push side sent <b>0</b> — one connection stayed open the whole time.', 'do2')}</div>`) +
      box('Why the poller is ~1.5 s late', 'An event that happens just after a poll waits for the NEXT tick — anywhere from 0 to 2 s later, plus the request itself. Polling faster cuts the delay and multiplies the requests.', ''),
    en: 'Measured on the same five events. A client that polls every two seconds saw each event between one and two seconds late — one and a half seconds on average — and paid five HTTP requests. The Socket.IO client received each push within a few milliseconds over one connection that stayed open.' },
  { t: 'A raw WebSocket is only a pipe', body: tn(O('ong').split('\n').filter((l) => !/io client disconnect/.test(l)).join('\n'), { fs: 17, wrap: 96 }) +
      two(box('Kill the server, start it again', 'The raw <code>ws</code> client got <code>close 1006</code> and stayed at <code>readyState 3</code> — dead, forever. Nothing in the WebSocket API tries again.', 'do2'), box('Socket.IO noticed and came back', 'It logged <code>transport close</code>, retried on its own, and was connected again — with a NEW id — once the server was back.', 'xanh')),
    en: 'A raw WebSocket is only a pipe. We killed the server and started it again. The raw ws client received close code ten oh six and stayed closed forever; nothing in the WebSocket API retries. The Socket.IO client logged transport close, retried by itself, and reconnected with a new id as soon as the server returned.' },
  { t: 'What Socket.IO adds on top of the pipe', body: hub('Socket.IO\non the pipe', [
      ['loop', 'Reconnect', 'retries with backoff (Ch 1)'], ['pulse', 'Heartbeat', 'ping/pong: dead vs quiet (Ch 2)'],
      ['layers', 'Rooms', 'send to a group (Ch 3)'], ['merge', 'Fallback', 'HTTP long-polling (0.2, Ch 2)'],
      ['check', 'Acks', 'a reply per message (Ch 6)'], ['tree', 'Namespaces', 'channels on one connection'],
    ], { h: 360 }) + box('The price', `Bigger than ${c('ws')}, and its own protocol: a plain WebSocket client cannot talk to a Socket.IO server without speaking engine.io (lesson 0.3).`, 'lam'),
    en: 'What Socket.IO adds on top of the pipe: automatic reconnect with backoff, a heartbeat that tells a dead connection from a quiet one, rooms to broadcast to a group, and a fallback to HTTP long-polling when the WebSocket is blocked. It also adds acknowledgements and namespaces. The price: its own protocol on the wire.' },
  { t: 'A short history — checked on npm', body: flow([
      { t: '2010', s: '0.6.0 · LearnBoost' }, { t: '2012', s: 'engine.io split out' }, { t: '2014', s: '1.0 on engine.io' },
      { t: '2021', s: '4.0' }, { t: 'Dec 2025', s: '4.8.3 (this course)', mau: XANH }, { t: 'Sep 2026', s: '4.8.4 latest' },
    ], { h: 128, fs: 21 }) + two(tn(O('lich-su').split('\n').filter((l) => !/"created"/.test(l)).join('\n'), { fs: 13, wrap: 62 }),
      box('Why it was born', 'In 2010 WebSocket support in browsers was patchy. Socket.IO promised one API that worked everywhere by falling back to HTTP — that fallback is still in it today (lesson 0.2).', 'lam'), 'r64'),
    en: 'A short history, every date checked with npm view. Version zero point six was published in December twenty ten by LearnBoost. engine.io, the connection layer, was split out in twenty twelve, and version one, in twenty fourteen, sat on top of it. This course measures four point eight point three, the version in this repo; npm latest is four point eight point four.' },
  { t: 'Where it runs in this repo', body: two(meter(WC.map(([p, n]) => [p, n, p === 'device.gateway.ts' ? '#c0392b' : XANH]), { don: 'lines', nhan: 300, w: 600, rh: 40, fs: 16 }),
      `<div>${box(`${Number(TONG).toLocaleString('en-US')} lines of gateway code`, `8 files under ${c('src/socket/')} (tests excluded), measured 13/11/2026. Chat, calls, listen-together, notes, CT Work, the game lobby…`, 'lam')}${box('One file pays the full price', `${c('device.gateway.ts')} uses raw <code>ws</code> for the Maker Lab devices — ${WC.find((w) => w[0] === 'device.gateway.ts')[1].toLocaleString('en-US')} lines for one job. Chapter 9 is the honest account of when that trade is worth it.`, 'do2')}</div>`),
    en: 'Where it runs in this repo: eight gateway files, three thousand nine hundred thirty-five lines without tests — chat, calls, listen-together, shared notes, CT Work, the game lobby. One file, device.gateway.ts, uses raw ws for Maker Lab devices and needs over a thousand lines for that one job. Chapter nine explains when that trade is worth it.' },
  { t: 'What the course covers', body: flow([
      { t: 'Sec 0–2', s: 'wire · lifecycle' }, { t: 'Ch 3–4', s: 'rooms · presence' }, { t: 'Ch 5–6', s: 'cluster · acks' },
      { t: 'Ch 7–8', s: 'WebRTC · Yjs' }, { t: 'Ch 9', s: 'raw ws' }, { t: 'Ch 10–11', s: 'diagnose · exam' },
    ], { h: 150, fs: 22 }) + icards([
      ['code', 'For your project', 'chat, notifications, presence, live dashboards — built right the first time'],
      ['search', 'For interviews', 'polling vs WebSocket, scaling with Redis, delivery guarantees — answered with numbers'],
      ['wrench', 'For the job', 'reading frames in DevTools and naming the broken layer instead of guessing'],
    ], 3) + box('One rule for the whole course', 'Every table is a number somebody ran — on socket.io 4.8.3 or on this repo — not a guess. When your measurement disagrees, yours wins.', 'lam'), to: true,
    en: 'The course map: section zero and chapters one and two are the wire, the lifecycle and transports; three and four are rooms and presence; five and six clustering and acks; seven WebRTC signalling; eight collaborative editing with Yjs; nine raw WebSocket; ten and eleven diagnosis and the final exam. It pays off in projects, interviews and real debugging.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Realtime', 'the server sends the moment something happens'), kw('Request / response', 'ask, answer, close'), kw('Short polling', 'asking again on a timer'),
      kw('WebSocket', 'a long-lived two-way connection'), kw('Socket.IO', 'reconnect, heartbeat, rooms, fallback on top'), kw('Gateway', 'a server module that owns one realtime feature'),
      kw('Raw ws', 'the bare WebSocket library — just the pipe'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: realtime; request and response; short polling; WebSocket; Socket.IO; gateway, a server module that owns one realtime feature; and raw ws, the bare pipe.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Open a chat app you use on two devices; send from one and watch it appear on the other <b>without reloading</b>',
      `DevTools → Network → filter <b>WS</b>: find the ONE long-lived connection carrying the live traffic`,
      'List two features of that app that need realtime and one that is just request/response — and say why',
    ]), box('Keep these', `<ul><li>Realtime = the server pushes the moment it happens</li><li>Short polling is always a beat late and costs requests</li><li>A raw WebSocket is a pipe: no reconnect, no rooms</li><li>Socket.IO adds reconnect, heartbeat, rooms, fallback</li></ul>`, 'lam'), ''),
    en: 'Your turn: watch a chat message appear on a second device without reloading; find the single long-lived WebSocket in DevTools; and classify two realtime features and one request-response feature of that app. Keep: realtime means push; polling is late and costly; a raw WebSocket is just a pipe; Socket.IO adds reconnect, heartbeat, rooms and fallback.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Socket.IO really is', bai: 'Start here 1/2' }, S);
