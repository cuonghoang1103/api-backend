/**
 * sio-01-3 — Socket.IO · Chapter 1 · Lesson 1.3 "Reconnect: what actually happens, and what does not" (deck video + web, 13/11/2026).
 * Bài web: io-1-3-reconnect. Output THẬT (scratchpad/sio/demo/n1-3.txt · socket.io 4.8.3 · Node 22.23.3, Mac):
 * restart: kill -9 server, khởi động lại sau 1,2 s ⇒ transport close · attempt 1, 2 (xhr poll error) · attempt 3 ⇒ reconnect 3 (c.id = undefined) ⇒ connect id MỚI, rooms = [id];
 * backoff: 40 client, cổng không server ⇒ chờ thật lần 1 563–1480 · 2 1124–2983 · 3 2256–5002 · 4 4583–5003 · 5+ = 5000 (bảng web "4: 2500–7500" SAI);
 * mat: proxy cắt ở giây 1, server phát vào thread:42 mỗi 100 ms ⇒ ngây thơ mất 25/34 (room mất hẳn) · join lại theo userId mất 6 · + since ⇒ mất 0.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-3:file:restart.mjs": "// Probe của bài web: giết server (kill -9) rồi khởi động lại sau 1,2 s — client làm gì, theo thứ tự nào, và c.id lúc 'reconnect' là gì\nimport { spawn } from 'node:child_process';\nimport { io as ketNoi } from 'socket.io-client';\nconst SV = \"const io=new (require('socket.io').Server)(19460);io.on('connection',(s)=>console.log('server: connection id='+s.id+' rooms='+JSON.stringify([...s.rooms])))\";\nlet sv = spawn('node', ['-e', SV], { stdio: ['ignore', 'inherit', 'inherit'] });\nconst t0 = performance.now(), T = () => 't=' + String(Math.round(performance.now() - t0)).padStart(4);\nawait new Promise((r) => setTimeout(r, 400));\nconst c = ketNoi('http://localhost:19460', { reconnectionDelay: 500, reconnectionDelayMax: 500 });\nc.on('connect', () => console.log(T(), 'client: connect            id=' + c.id));\nc.on('disconnect', (r) => console.log(T(), 'client: disconnect         ' + r));\nc.io.on('reconnect_attempt', (n) => console.log(T(), 'client: reconnect_attempt  ' + n));\nc.io.on('reconnect_error', (e) => console.log(T(), 'client: reconnect_error    ' + (e.description?.message ?? e.message)));\nc.io.on('reconnect', (n) => console.log(T(), 'client: reconnect          ' + n + '   (c.id lúc này = ' + c.id + ')'));\nawait new Promise((r) => setTimeout(r, 300));\nconsole.log(T(), '>>> kill -9 server'); sv.kill('SIGKILL');\nawait new Promise((r) => setTimeout(r, 1200));\nconsole.log(T(), '>>> khởi động lại server'); sv = spawn('node', ['-e', SV], { stdio: ['ignore', 'inherit', 'inherit'] });\nawait new Promise((r) => setTimeout(r, 1500));\nc.close(); sv.kill('SIGKILL'); process.exit(0);\n",
 "n1-3:restart": "$ node restart.mjs\nserver: connection id=-Ne6EQ1wSpGEM0C6AAAA rooms=[\"-Ne6EQ1wSpGEM0C6AAAA\"]\nt= 427 client: connect            id=-Ne6EQ1wSpGEM0C6AAAA\nt= 712 >>> kill -9 server\nt= 714 client: disconnect         transport close\nt=1217 client: reconnect_attempt  1\nt=1222 client: reconnect_error    xhr poll error\nt=1724 client: reconnect_attempt  2\nt=1729 client: reconnect_error    xhr poll error\nt=1914 >>> khởi động lại server\nt=2231 client: reconnect_attempt  3\nt=2241 client: reconnect          3   (c.id lúc này = undefined)\nserver: connection id=xybuPyUoMY9eYfakAAAA rooms=[\"xybuPyUoMY9eYfakAAAA\"]\nt=2249 client: connect            id=xybuPyUoMY9eYfakAAAA\nt=3415 client: disconnect         io client disconnect",
 "n1-3:file:backoff.mjs": "// 40 client cùng nối vào một cổng KHÔNG có server — đo khoảng chờ thật trước mỗi lần thử (mặc định 1000 / 5000 / ±50 %)\nimport { io as ketNoi } from 'socket.io-client';\nconst N = 40, LAN = 7, cho = {};\nfor (let i = 0; i < N; i++) {\n  const c = ketNoi('http://localhost:19461');\n  let truoc = performance.now();\n  c.io.on('reconnect_attempt', (n) => { const d = performance.now() - truoc; (cho[n] ??= []).push(d); truoc = performance.now(); if (n >= LAN) c.close(); });\n  c.io.on('reconnect_error', () => { truoc = performance.now(); });\n  c.on('connect_error', () => { truoc = performance.now(); });\n}\nawait new Promise((r) => setTimeout(r, 31000));\nconsole.log('lần thử   chờ thấp nhất   chờ cao nhất   trung bình   (ms, 40 client)');\nfor (let n = 1; n <= LAN; n++) { const d = cho[n] ?? []; if (!d.length) continue;\n  console.log(String(n).padStart(4), String(Math.round(Math.min(...d))).padStart(14), String(Math.round(Math.max(...d))).padStart(14), String(Math.round(d.reduce((a, b) => a + b, 0) / d.length)).padStart(12)); }\nprocess.exit(0);\n",
 "n1-3:backoff": "$ node backoff.mjs\nlần thử   chờ thấp nhất   chờ cao nhất   trung bình   (ms, 40 client)\n   1            563           1480          985\n   2           1124           2983         1923\n   3           2256           5002         4017\n   4           4583           5003         4991\n   5           5000           5003         5002\n   6           5000           5003         5002\n   7           5000           5005         5002",
 "n1-3:file:mat.mjs": "// Ba thứ đổi qua một reconnect: id mới · room trống · tin gửi lúc vắng mặt MẤT. Proxy TCP cắt kết nối ở giây 1; server phát tin vào thread:42 mỗi 100 ms.\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function chay(ten, cong, kieu) {\n  const io = new Server(cong); const lichSu = []; let seq = 0; const daJoin = new Map();   // daJoin: userId → Set room (KHOÁ THEO USER)\n  const phat = setInterval(() => { seq++; lichSu.push(seq); io.to('thread:42').emit('msg', seq); }, 100);\n  io.on('connection', (s) => {\n    const u = s.handshake.auth.userId;\n    if (kieu !== 'ngay-tho') for (const r of daJoin.get(u) ?? []) s.join(r);              // join lại theo userId\n    s.on('thread:join', (r) => { s.join(r); (daJoin.get(u) ?? daJoin.set(u, new Set()).get(u)).add(r); });\n    s.on('since', (tu, ack) => ack(lichSu.filter((x) => x > tu)));                          // \"fetch-since-last-seen\"\n    console.log(`   server: connection id=${s.id} rooms=${JSON.stringify([...s.rooms])}`);\n  });\n  const ong = new Set();\n  const proxy = net.createServer((a) => { const b = net.connect(cong); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () => {}); x.on('close', () => { a.destroy(); b.destroy(); }); } }).listen(cong + 1);\n  const nhan = []; let lan = 0;\n  const c = ketNoi(`http://localhost:${cong + 1}`, { auth: { userId: 7 } });\n  c.on('msg', (n) => nhan.push(n));\n  c.on('connect', () => {\n    lan++;\n    if (lan === 1) c.emit('thread:join', 'thread:42');\n    else if (kieu === 'bu') c.emit('since', Math.max(0, ...nhan), (thieu) => { nhan.push(...thieu); console.log(`   client: bù ${thieu.length} tin đã lỡ`); });\n  });\n  console.log(`── ${ten}`);\n  await cho(1000); for (const x of ong) x.destroy(); ong.clear();\n  await cho(2500); clearInterval(phat); await cho(300);\n  const coDu = new Set(nhan), mat = lichSu.filter((x) => !coDu.has(x));\n  console.log(`   server đã phát ${lichSu.length} tin · client nhận ${coDu.size} · MẤT ${mat.length}${mat.length ? ` (từ #${mat[0]} tới #${mat.at(-1)})` : ''}`);\n  c.close(); io.close(); proxy.close();\n}\nawait chay('1) ngây thơ: join một lần lúc đầu', 19462, 'ngay-tho');\nawait chay('2) join lại theo userId trong connection', 19464, 'join-lai');\nawait chay('3) join lại + hỏi \"since\" tin cuối đã thấy', 19466, 'bu');\nprocess.exit(0);\n",
 "n1-3:mat": "$ node mat.mjs\n── 1) ngây thơ: join một lần lúc đầu\n   server: connection id=6YsoCY6j41Td3bhPAAAA rooms=[\"6YsoCY6j41Td3bhPAAAA\"]\n   server: connection id=N33c2swB0LQV7vAQAAAB rooms=[\"N33c2swB0LQV7vAQAAAB\"]\n   server đã phát 34 tin · client nhận 9 · MẤT 25 (từ #10 tới #34)\n── 2) join lại theo userId trong connection\n   server: connection id=nGg4f9ZPxQiepr0cAAAC rooms=[\"nGg4f9ZPxQiepr0cAAAC\"]\n   server: connection id=JUlTmIzH9C7lSlQiAAAD rooms=[\"JUlTmIzH9C7lSlQiAAAD\",\"thread:42\"]\n   server đã phát 34 tin · client nhận 28 · MẤT 6 (từ #10 tới #15)\n── 3) join lại + hỏi \"since\" tin cuối đã thấy\n   server: connection id=Wup2MkbrWCA4guRsAAAE rooms=[\"Wup2MkbrWCA4guRsAAAE\"]\n   server: connection id=jtJjBBiJtcPnBBbqAAAF rooms=[\"jtJjBBiJtcPnBBbqAAAF\",\"thread:42\"]\n   client: bù 8 tin đã lỡ\n   server đã phát 34 tin · client nhận 34 · MẤT 0"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, vsd, path } from './_sio-chung.mjs';

export const deck = { key: 'sio-01-3', code: 'SIO 1.3', title: 'Reconnect: what actually happens, and what does not', sub: 'Chapter 1 · Lesson 1.3' };
const O = (k) => { const v = DU_LIEU[`n1-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const RS = O('restart').split('\n');
const ms = (re) => +(RS.find((l) => re.test(l)) || '').match(/t=\s*(\d+)/)[1];
const BO = O('backoff').split('\n').slice(2).map((l) => l.trim().split(/\s+/).map(Number));
const MAT = O('mat').split('\n');
const matSo = MAT.filter((l) => /MẤT/.test(l)).map((l) => l.match(/phát (\d+) tin · client nhận (\d+) · MẤT (\d+)/).slice(1).map(Number));
const LY_THUYET = [[500, 1500], [1000, 3000], [2000, 5000], [4000, 5000], [5000, 5000], [5000, 5000], [5000, 5000]];

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'Reconnect: what happens,<br>and what does not', sub: 'The library restores the CONNECTION. Everything on top of it is your job',
    en: 'Lesson one point three: reconnect — what actually happens, and what does not. The library restores the connection; everything on top of it is your job.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A kill-and-restart, timed event by event on the client</li>
    <li>Why ${c('c.id')} is <code>undefined</code> inside the <code>reconnect</code> event</li>
    <li>The real backoff: 40 clients, seven attempts, measured</li>
    <li>Three things a reconnect does NOT bring back — new sid, empty rooms, lost events</li>
    <li>The fix: track by userId, re-join on connection, fetch-since-last-seen</li></ul>`,
    en: 'Five takeaways: a kill and restart timed on the client; why c.id is undefined in the reconnect event; the real backoff measured on forty clients; the three things a reconnect does not bring back; and the fix.' },
  { t: 'Measured: kill -9 the server, restart it 1.2 s later', body: tn(O('restart'), { fs: 15, wrap: 100 }) + path([{ t: 'transport close', s: `${ms(/kill -9/)} ms`, mau: '#c0392b' }, { t: 'attempt 1 · 2', s: 'xhr poll error', mau: '#c28a00' },
      { t: "'reconnect' 3", s: 'c.id = undefined', mau: '#7c3aed', on: true }, { t: "'connect'", s: 'NEW id', mau: '#1f8a3b', on: true }], { h: 130, fs: 19 }),
    en: 'Measured: kill the server with kill minus nine, restart it one point two seconds later. The client sees transport close at once, tries every five hundred milliseconds and gets xhr poll error twice, then on the third attempt the engine opens: reconnect fires, and only after that does connect fire, with a brand new id.' },
  { t: "Why c.id is undefined in 'reconnect'", body: vsd(js(`c.io.on('reconnect', (n) => {
  console.log(c.id);   // undefined — layer 2 only
});`, { sm: true }), js(`c.on('connect', () => {
  console.log(c.id);   // the NEW id — layer 3 done
});`, { sm: true }), "✗ Manager 'reconnect' (engine.io, layer 2)", "✓ Socket 'connect' (socket.io CONNECT, layer 3)") +
    two(box('Two objects, two layers', `${c('c.io')} is the <b>Manager</b>: it owns the engine.io pipe and fires <code>reconnect</code> when the pipe is back. ${c('c')} is the <b>Socket</b>: it fires <code>connect</code> when the namespace CONNECT packet arrives — a few ms later.`, 'lam'),
      box('So', `Put every "after reconnect" action — re-join, re-sync, read ${c('c.id')} — in ${c("c.on('connect')")}. It runs on the first connect too, which is exactly what you want.`, 'la2')), to: true,
    en: 'Why c.id is undefined in reconnect: c.io is the Manager, which owns the engine.io pipe and fires reconnect when the pipe is back. c is the Socket, which fires connect only when the namespace CONNECT packet arrives, a few milliseconds later. So put every after-reconnect action in the connect handler.' },
  { t: 'The real backoff: 40 clients, seven attempts', body: two(cmp(['attempt', 'measured min', 'measured max', 'average', 'formula (±50 %, cap 5 s)'],
      BO.map(([n, a, b, tb], i) => [String(n), `${a} ms`, `${b} ms`, `${tb} ms`, `${LY_THUYET[i][0]}–${LY_THUYET[i][1]} ms`]), { hl: [4, 5] }),
    box('Read it', `Delay = 1000 × 2<sup>n−1</sup>, ±50 % jitter, then <b>capped at 5000</b>. Attempt 4 is already 4000–5000 ms, and from attempt 5 every client waits <b>exactly 5 s</b>. (The web table's “2500–7500” for attempt 4 is impossible: the cap is applied after the jitter.)`, 'lam'), 'r64'), to: true,
    en: 'The real backoff, forty clients pointed at a port with no server. The delay doubles from one second with plus or minus fifty percent jitter, then is capped at five seconds. Attempt four was already between four and a half and five seconds, and from attempt five every client waited exactly five seconds. Jitter spreads the first attempts so a thousand clients do not return at the same instant.' },
  { t: 'Measured: three things a reconnect does NOT restore', body: tn(O('mat'), { fs: 15, wrap: 110 }) + two(
      box('New sid, empty rooms', 'The second <code>connection</code> has a NEW id and <code>rooms = [its own id]</code>. In run 1 the client never heard thread:42 again: 25 of 34 messages lost.', 'do2'),
      box('Events sent meanwhile: gone', `Re-joining by userId stops the bleeding, but the ${matSo[1][2]} messages sent while the client was away are still lost. Asking "since my last one" brings it to <b>0</b>.`, 'lam')),
    en: 'Measured: a TCP proxy cuts the client at one second while the server emits into thread forty-two every hundred milliseconds. Naive: the new socket has a new id and empty rooms, so twenty-five of thirty-four messages are lost. Re-joining by user id stops the bleeding but the messages sent while it was away are still gone. Adding a since request brings the loss to zero.' },
  { t: 'Re-join on every connection, keyed by userId', body: two(js(`const userRooms = new Map();   // userId → Set<room>

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  socket.join(\`user:\${userId}\`);
  for (const r of userRooms.get(userId) ?? []) socket.join(r);

  socket.on('thread:join', (threadId) => {
    const r = \`thread:\${threadId}\`;
    socket.join(r);
    if (!userRooms.has(userId)) userRooms.set(userId, new Set());
    userRooms.get(userId).add(r);
  });
});`, { sm: true, hl: [1, 6, 12] }), steps([
      'The socket id changes every reconnect ⇒ a table keyed by <b>socket.id</b> leaks',
      'Key by <b>userId</b>: it survives the new socket',
      'Re-join in <code>connection</code>, every time — never trust old membership',
      'Clean the userId entry when the LAST socket of that user leaves (lesson 4.3)',
    ]), 'r64'), to: true,
    en: 'The server-side pattern: keep the rooms a user has joined in a map keyed by user id, not by socket id, because the socket id changes on every reconnect. In every connection handler, join the user room and re-join each remembered room. Clean the entry only when the last socket of that user leaves.' },
  { t: 'fetch-since-last-seen: the part no library does for you', body: js(`let lastSeen = 0;
socket.on('msg', (m) => { lastSeen = m.seq; render(m); });

socket.on('connect', () => { // + every reconnect
  socket.emit('since', lastSeen, (missed) => {
    missed.forEach(render); // dedupe by seq
  });
});`, { sm: true, hl: [4, 5] }) + cmp(['Option', 'Measured', 'Cost'], [
      ['re-join only', `${matSo[1][2]} of ${matSo[1][0]} lost`, 'free'],
      ['re-join + since', `${matSo[2][2]} of ${matSo[2][0]} lost`, 'a store with sequence numbers'],
      [c('connectionStateRecovery'), 'same id, 5/5 — one process only', '0/5 after a restart; not with the classic Redis adapter (Node.js 11.3)'],
    ], { hl: [2] }), to: true,
    en: 'fetch since last seen: the client remembers the last sequence number it rendered, and on every connect asks the server for everything after it. Re-join only lost messages; re-join plus since lost none. connection state recovery keeps the same id and replays, but only inside one process; after a restart, or behind the classic Redis adapter, it gives nothing, as the Node.js course measured.' },
  { t: 'Trap: turning reconnection off', body: js(`const socket = io(url, {
  reconnection: false, // "easier to debug"… then forgotten
});`, { sm: true }) + two(box('What production gets', 'Wi-Fi drops for 5 s ⇒ <code>transport close</code> ⇒ no attempt at all ⇒ the user must <b>reload the page</b>. Nothing in the UI says why.', 'do2'),
    cmp(['Option', 'Default', 'Keep it?'], [
      [c('reconnection'), 'true', 'yes — except in tests'], [c('reconnectionAttempts'), 'Infinity', 'yes — show a banner instead of giving up'],
      [c('reconnectionDelay / Max'), '1000 / 5000', 'yes'], [c('randomizationFactor'), '0.5', 'yes — jitter protects the server'],
    ]), 'r46'),
    en: 'The trap: someone sets reconnection to false to make debugging easier and forgets it. In production a five-second Wi-Fi drop means no attempt at all, and the user must reload the page. Keep the defaults: reconnection on, infinite attempts, one second growing to five, and fifty percent jitter.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Manager (c.io)', "owns the engine.io pipe; fires 'reconnect_attempt', 'reconnect'"), kw('Socket (c)', "fires 'connect' when the namespace CONNECT arrives"),
      kw('Exponential backoff', '1 s, 2 s, 4 s… capped at 5 s, ±50 % jitter'), kw('New sid', 'every reconnect is a brand-new socket on the server'),
      kw('Re-join on connection', 'rebuild room membership every time'), kw('Key by userId', 'never by socket.id'), kw('fetch-since-last-seen', 'pull what you missed by sequence number'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the Manager and the Socket; exponential backoff with a five-second cap and jitter; the new sid; re-join on connection; keying state by user id; and fetch since last seen.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Kill and restart a server; log every Manager and Socket event with timestamps',
      `Print ${c('c.id')} in <code>reconnect</code> and in <code>connect</code>`,
      'Cut the network while the server emits; count what you lost',
      'Re-join by userId, then add <code>since</code>; get the loss to 0',
    ]), box('Keep these', `<ul><li>Reconnect restores the pipe, not your app state</li><li>New sid · empty rooms · missed events lost</li><li>Act in <code>connect</code>, not in <code>reconnect</code></li><li>Backoff 1 → 5 s, then a flat 5 s</li></ul>`, 'lam'), ''),
    en: 'Your turn: kill and restart a server and log every event; print c.id in reconnect and in connect; cut the network while the server emits and count your losses; then re-join by user id and add since until the loss is zero. Keep: reconnect restores the pipe, not your state.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The lifecycle of one connection', bai: '1.3' }, S);
