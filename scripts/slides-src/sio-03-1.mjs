/**
 * sio-03-1 — Socket.IO · Chapter 3 · Lesson 3.1 "Rooms: the abstraction you actually need" (deck video + web, 13/11/2026).
 * Bài web: io-3-1-room. Output THẬT (scratchpad/sio/demo/n3-1.txt · socket.io 4.8.3 · Node 22.23.3 · Chromium Playwright):
 * rooms: 4 socket (c1 A · c2 B · c3 A+B · c4 không room) — socket.rooms size 2/2/3/1 (luôn có room mang sid); io.to('A') ⇒ c1,c3; io.to('A').to('B') =
 * io.to(['A','B']) ⇒ c1,c2,c3 mỗi socket ĐÚNG 1 lần; io.to(<sid c1>) ⇒ chỉ c1; adapter.rooms 6 mục (4 sid + A + B); fetchSockets A ⇒ c1,c3; giao tự lọc ⇒ c3.
 * trinh: Chromium chỉ nhận 42["thread:new-message",…] + 42["personal",…] — KHÔNG khung nào cho join, tên room KHÔNG lên dây.
 * kho: grep socket.join trong src/socket — user:, admin:, thread:, maker:device:, post:, listen:, dk:, project rooms.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-1:file:rooms.mjs": "// Bốn client: c1 chỉ ở A · c2 chỉ ở B · c3 ở cả A và B · c4 không room nào\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19600);\nconst tenCua = (s) => s.handshake.auth.ten;\nio.on('connection', (s) => { s.join(s.handshake.auth.rooms); s.emit('san-sang'); });   // join nhận chuỗi HOẶC mảng\n\nconst DS = { c1: ['A'], c2: ['B'], c3: ['A', 'B'], c4: [] };\nconst dem = {};\nawait Promise.all(Object.entries(DS).map(([ten, rooms]) => new Promise((r) => {\n  const c = ketNoi('http://localhost:19600', { auth: { ten, rooms } });\n  dem[ten] = 0; c.on('tin', () => dem[ten]++); c.on('san-sang', r);\n})));\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst thu = async (nhan, phat) => { for (const k in dem) dem[k] = 0; phat(); await cho(300); console.log(nhan.padEnd(28), JSON.stringify(dem)); };\n\nconsole.log('— socket.rooms của từng socket (phía server) —');\nfor (const s of io.sockets.sockets.values()) console.log(`${tenCua(s)}  size=${s.rooms.size}  ${[...s.rooms].map((r) => (r === s.id ? `<sid ${r.slice(0, 6)}…>` : r)).join(', ')}`);\n\nconsole.log('— ai nhận, mấy lần —');\nawait thu(\"io.to('A')\", () => io.to('A').emit('tin'));\nawait thu(\"io.to('A').to('B')\", () => io.to('A').to('B').emit('tin'));\nawait thu(\"io.to(['A', 'B'])\", () => io.to(['A', 'B']).emit('tin'));\nconst c1 = [...io.sockets.sockets.values()].find((s) => tenCua(s) === 'c1');\nawait thu('io.to(<sid của c1>)', () => io.to(c1.id).emit('tin'));\n\nconsole.log('— hỏi ai đang ở room —');\nconsole.log(\"adapter.rooms.get('A').size =\", io.sockets.adapter.rooms.get('A')?.size ?? 0, '(Set, đồng bộ, CHỈ worker này)');\nconst oA = await io.in('A').fetchSockets();\nconsole.log(\"await io.in('A').fetchSockets() →\", oA.map(tenCua).join(', '), '(Promise, đi qua adapter)');\nconsole.log(\"giao A ∩ B (tự lọc)        →\", oA.filter((s) => s.rooms.has('B')).map(tenCua).join(', '));\nconsole.log('adapter.rooms có', io.sockets.adapter.rooms.size, 'mục:', [...io.sockets.adapter.rooms.keys()].map((k) => (io.sockets.sockets.has(k) ? '<sid>' : k)).join(' '));\nprocess.exit(0);\n",
 "n3-1:rooms": "$ node rooms.mjs\n— socket.rooms của từng socket (phía server) —\nc2  size=2  <sid 2-5T9q…>, B\nc1  size=2  <sid gub87y…>, A\nc3  size=3  <sid 3nrKki…>, A, B\nc4  size=1  <sid JCwvnb…>\n— ai nhận, mấy lần —\nio.to('A')                   {\"c1\":1,\"c2\":0,\"c3\":1,\"c4\":0}\nio.to('A').to('B')           {\"c1\":1,\"c2\":1,\"c3\":1,\"c4\":0}\nio.to(['A', 'B'])            {\"c1\":1,\"c2\":1,\"c3\":1,\"c4\":0}\nio.to(<sid của c1>)          {\"c1\":1,\"c2\":0,\"c3\":0,\"c4\":0}\n— hỏi ai đang ở room —\nadapter.rooms.get('A').size = 2 (Set, đồng bộ, CHỈ worker này)\nawait io.in('A').fetchSockets() → c1, c3 (Promise, đi qua adapter)\ngiao A ∩ B (tự lọc)        → c3\nadapter.rooms có 6 mục: <sid> B <sid> A <sid> <sid>",
 "n3-1:file:trang31.mjs": "// Trang thật cho Chromium: server cho socket vào thread:42 + user:7 rồi phát ba kiểu — xem khung WebSocket mang gì\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { Server } from 'socket.io';\nconst srv = http.createServer((req, res) => { if (req.url === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(readFileSync('trang31.html')); } });\nconst io = new Server(srv);\nio.on('connection', async (s) => {\n  await s.join(['thread:42', 'user:7']);\n  console.log(`server: ${s.id.slice(0, 6)}… join thread:42 + user:7 → rooms = ${[...s.rooms].length} (cả room mang sid)`);\n  setTimeout(() => {\n    io.to('thread:42').emit('thread:new-message', { id: 1, text: 'chào cả thread' });\n    io.to('thread:42').to('user:7').emit('personal', { text: 'union: tới đúng MỘT lần' });\n    io.to('thread:99').emit('thread:new-message', { id: 2, text: 'thread khác' });\n  }, 600);\n});\nsrv.listen(19601, () => console.log('trang ở http://localhost:19601'));\n",
 "n3-1:file:trang31.html": "<!doctype html><html><head><meta charset=\"utf-8\"><title>room trên dây</title>\n<style>body{font:18px/1.5 system-ui;margin:24px;background:#f8fafc}h1{font-size:22px;margin:0 0 12px}pre{background:#0b1018;color:#e6edf3;padding:14px 18px;border-radius:10px;font:16px/1.6 Consolas,monospace}</style></head>\n<body><h1>⚡ room trên dây — trình duyệt nhận gì?</h1><pre id=\"log\"></pre>\n<script src=\"/socket.io/socket.io.js\"></script>\n<script>\nconst log = (s) => (document.getElementById('log').textContent += s + '\\n');\nconst s = io({ transports: ['websocket'] });\ns.on('connect', () => log('connect ✓  id=' + s.id.slice(0, 6) + '…  (client KHÔNG biết mình ở room nào)'));\ns.onAny((ev, d) => log('nhận \"' + ev + '\"  ' + JSON.stringify(d)));\nsetTimeout(() => log('— hết: 2 event, không event nào nói tên room —'), 1500);\n</script></body></html>\n",
 "n3-1:trinh": "$ node /Users/admin/Documents/video-bai-giang/scratchpad/sio/anh.mjs /Users/admin/Documents/video-bai-giang/scratchpad/sio/spec/sio-3-1.json\n✓ trang  http://localhost:19601/  mạng 2 · console 0\ntrang ở http://localhost:19601\nserver: I94HJ7… join thread:42 + user:7 → rooms = 3 (cả room mang sid)",
 "n3-1:kho": "# Kho cuongthai.com: socket vào room nào? (8 tệp gateway, 3.935 dòng không tính test)\n$ grep -n \"socket.join(\" src/socket/*.ts\ndoiKhang.socket.ts:343: void socket.join(khoa(p.ma));\ndoiKhang.socket.ts:526: p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));\nlisten-together.ts:153: socket.join(roomKey(room.id));\nmessaging.socket.ts:353: socket.join(`user:${user.id}`);\nmessaging.socket.ts:355: socket.join(`admin:${user.id}`);\nmessaging.socket.ts:360: socket.join('admin');\nmessaging.socket.ts:409: socket.join(`thread:${t.id}`);\nmessaging.socket.ts:468: socket.join(`thread:${threadId}`);\nmessaging.socket.ts:496: socket.join(`maker:device:${deviceId}`);\nmessaging.socket.ts:609: socket.join(room);\nwork.socket.ts:54: await socket.join(isClientScoped(access) ? clientRoom(pid) : projectRoom(pid));\nwork.socket.ts:111: await socket.join(room);\nwork.socket.ts:159: if (rooms.length) await socket.join(rooms);\n$ grep -n \"=> \\`listen:\\|return \\`maker:device\\|=> \\`dk:\" src/socket/*.ts\ndevice.gateway.ts:127: return `maker:device:${deviceId}`;\ndoiKhang.socket.ts:107:const khoa = (ma: string) => `dk:${ma}`;\nlisten-together.ts:97:const roomKey = (id: string) => `listen:${id}`;",
 "n3-1:ws": "[[\"↓\",\"0{\\\"sid\\\":\\\"gihI13xpqgN3KimgAAAA\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":20000,\\\"maxPayload\\\":1000000}\",34],[\"↑\",\"40\",34],[\"↓\",\"40{\\\"sid\\\":\\\"I94HJ7zygOfmyVnFAAAA\\\"}\",36],[\"↓\",\"42[\\\"thread:new-message\\\",{\\\"id\\\":1,\\\"text\\\":\\\"chào cả thread\\\"}]\",639],[\"↓\",\"42[\\\"personal\\\",{\\\"text\\\":\\\"union: tới đúng MỘT lần\\\"}]\",639]]"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, wire, path } from './_sio-chung.mjs';

export const deck = { key: 'sio-03-1', code: 'SIO 3.1', title: 'Rooms: the abstraction you actually need', sub: 'Chapter 3 · Lesson 3.1' };
const O = (k) => { const v = DU_LIEU[`n3-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const R = O('rooms').split('\n').filter((l) => !l.startsWith('$ '));
const iAi = R.findIndex((l) => l.startsWith('— ai')), iHoi = R.findIndex((l) => l.startsWith('— hỏi'));
const WS = JSON.parse(O('ws'));
const KHO = O('kho').split('\n').filter((l) => !l.startsWith('#'));

/** Venn A ∪ B: c1 chỉ A, c3 cả hai, c2 chỉ B, c4 ngoài — số lần nhận đo thật của io.to('A').to('B'). */
const venn = () => `<svg viewBox="0 0 540 300" width="540" height="300" font-family="Arial">
  <rect x="2" y="2" width="536" height="296" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="200" cy="150" r="110" fill="#0e749022" stroke="#0e7490" stroke-width="4"/>
  <circle cx="330" cy="150" r="110" fill="#2563eb22" stroke="#2563eb" stroke-width="4"/>
  <text x="140" y="60" font-size="26" font-weight="800" fill="#0e7490">A</text><text x="380" y="60" font-size="26" font-weight="800" fill="#2563eb">B</text>
  <text x="150" y="158" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1f2a">c1 ×1</text>
  <text x="265" y="158" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1f2a">c3 ×1</text>
  <text x="380" y="158" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1f2a">c2 ×1</text>
  <text x="490" y="280" text-anchor="middle" font-size="20" font-weight="700" fill="#64748b">c4 ×0</text>
</svg>`;

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.1', t: 'Rooms:<br>the abstraction you actually need', sub: 'A string tag on the server — measured with four sockets and a real browser',
    en: 'Lesson three point one: rooms, the abstraction you actually need. A room is a string tag on the server, and we measure it with four sockets and a real browser.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A room is a string tag kept on the SERVER — not a chat room, not on the wire</li>
    <li>Every socket is already in one room: its own sid ⇒ ${c('socket.rooms.size ≥ 1')}</li>
    <li>${c("io.to('A').to('B')")} = ${c("io.to(['A','B'])")} = UNION, each socket exactly once</li>
    <li>No intersection operator — filter it yourself</li>
    <li>The four room-key patterns of this repo, read from the real code</li></ul>`,
    en: 'Five takeaways: a room is a string tag kept on the server; every socket is already in the room of its own sid; chaining to with two rooms is a union, each socket exactly once; there is no intersection operator; and the four room key patterns of this repo.' },
  { t: 'A room is a tag: Map&lt;room, Set&lt;sid&gt;&gt; in the adapter', body: two(tsx(`// join = add a string tag to this socket (server side)
socket.join('thread:42');
socket.join(['user:7', 'any-string']); // or an array

// emit to every socket carrying the tag
io.to('thread:42').emit('new-message', msg);

// the adapter keeps one Map for the whole namespace
io.sockets.adapter.rooms   // Map<room, Set<sid>>`, { fs: 19 }),
    '<div>' + box('Not a chat room', 'A room has no owner, no members list in your DB, no create call. It is a key in a Map; the value is a Set of socket ids. It exists while the Set is non-empty.', 'info') +
    box('Only the server sees it', `The client cannot join a room by itself and is never told which rooms it is in. ${c('join')} sends nothing on the wire — measured below.`, 'ok') + '</div>', 'r64') +
    path([{ t: "socket.join('A')", s: 'server, sync' }, { t: 'adapter.rooms', s: "'A' → Set{sid}", on: true }, { t: "io.to('A').emit()", s: 'look up the Set' }, { t: 'one 42[…] each', s: 'no room name inside' }], { h: 150, fs: 21, nhan: ['adds sid', 'lookup', 'write'] }),
    en: 'A room is a tag. Join adds a string to this socket on the server, one string or an array. Emitting to a room reaches every socket with that tag. Underneath, the adapter keeps one map from room name to a set of socket ids. It is not a chat room, and only the server sees it.' },
  { t: 'Measured: socket.rooms always contains the sid', body: two(tn(R.slice(0, iAi).join('\n'), { fs: 21, wrap: 60 }),
    '<div>' + box('Read it', `c4 joined nothing — and still has <b>size=1</b>: the room named after its own sid. That is what makes ${c('io.to(socketId).emit()')} work.`, 'info') +
    box('Trap', `${c('if (socket.rooms.size === 0)')} is never true. “In no custom room” is ${c('size === 1')}.`, 'bad') + '</div>', 'r64') +
    path([{ t: 'c4 connects', s: 'joins nothing' }, { t: 'room <sid>', s: 'joined automatically', on: true }, { t: 'io.to(sid).emit()', s: 'reaches c4 only — measured' }], { h: 150, fs: 22, nhan: ['engine', 'so'] }),
    en: 'Measured: socket rooms always contains the sid. c4 joined nothing and still has size one, the room named after its own sid, which is what makes emitting to a socket id work. So testing size equals zero is never true; no custom room means size equals one.' },
  { t: 'Measured: who receives, and how many times', body: two(tn(R.slice(iAi, iHoi).join('\n'), { fs: 15, wrap: 70 }), venn(), 'r64') + two(
      box('Union, deduplicated', `${c("to('A').to('B')")} and ${c("to(['A','B'])")} are the same call: everyone in A <b>or</b> B. c3 is in both and still got the event <b>once</b>.`, 'ok'),
      box('No intersection', 'There is no “A and B” operator. Emit to a room that already means both, or filter sockets yourself (next slide but one).', 'bad')),
    en: 'Measured: who receives, and how many times. To A reaches c1 and c3. To A then to B, and the array form, are the same call, a union: c1, c2 and c3, each exactly once, even c3 which is in both. A socket id reaches only that socket. There is no intersection operator.' },
  { t: 'On the wire: room names never leave the server', body: wire(WS.map(([h, chu, t]) => [h, chu, `${t} ms · ${chu.startsWith('0{') ? 'engine.io OPEN' : chu === '40' ? 'CONNECT' : chu.startsWith('40{') ? 'CONNECT ok — namespace sid' : chu.includes('personal') ? 'EVENT — union, arrived ONCE' : 'EVENT — to thread:42'}`]), { fs: 18, max: 66 }) + path([{ t: 'join ×2', s: 'thread:42 + user:7', mau: '#64748b' }, { t: 'to(thread:42)', s: '↓ 1 frame', mau: '#1f8a3b' }, { t: 'to(42).to(user:7)', s: '↓ 1 frame (union)', mau: '#1f8a3b' }, { t: 'to(thread:99)', s: 'nothing', mau: '#c0392b' }], { h: 130, fs: 20, nhan: ['no frame', '', ''] }) + two(
      box('What is missing', `The server joined this socket to ${c('thread:42')} and ${c('user:7')} between frame 3 and frame 4. No frame. And no event carries a room name — the browser only sees ${c('42["event", data]')}.`, 'info'),
      box('So', `A third emit, to ${c('thread:99')}, produced nothing at all on this connection. Routing happens before the socket.io packet is written.`, 'ok')),
    en: 'On the wire, in a real Chromium: open, connect, then two events. The server joined this socket to two rooms, and no frame was sent for that. No event carries a room name. A third emit to another thread produced nothing on this connection: routing happens before the packet is written.' },
  { t: 'Asking who is in a room', body: tn(R.slice(iHoi).join('\n'), { fs: 18, wrap: 100 }) + cmp(['Call', 'Returns', 'Scope'], [
      [c("io.sockets.adapter.rooms.get('A')"), 'Set&lt;sid&gt; (or undefined), synchronous', 'THIS worker only'],
      [c("await io.in('A').fetchSockets()"), 'Promise of socket objects (with .rooms, .data)', 'every worker, through the adapter (Chapter 5)'],
      ['intersection A ∩ B', `${c("fetchSockets()")} then ${c(".filter(s => s.rooms.has('B'))")}`, 'you write it — measured: c3'],
    ]),
    en: 'Asking who is in a room. The adapter rooms map gives a set, synchronously, but only for this worker. fetchSockets returns a promise and goes through the adapter, so it covers every worker in a cluster. Intersection you write yourself: fetch A, keep sockets whose rooms has B. Measured: only c3.' },
  { t: 'The room-key patterns of this repo (real grep)', body: tn(KHO.slice(0, KHO.findIndex((l, i) => i > 0 && l.startsWith('$ '))).join('\n'), { fs: 14, wrap: 130 }) + cmp(['Pattern', 'Key', 'Joined when'], [
      ['per-user', c('user:${id}'), 'on connect — reach every tab of one person'],
      ['per-resource', `${c('thread:${id}')} · ${c('post:${id}')}`, 'when the user opens it; left when closed'],
      ['per-feature-instance', `${c('listen:${id}')} · ${c('dk:${ma}')}`, 'virtual rooms — no DB row, live in RAM (roomKey, khoa)'],
      ['per-device', c('maker:device:${id}'), 'dashboards watching one device (Chapter 9)'],
    ]),
    en: 'The room key patterns of this repo, from a real grep: per user, joined on connect; per resource, thread and post, joined when opened; per feature instance, listen together and the duel rooms, which have no database row; and per device, for dashboards watching one board, which is Chapter nine.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Room', 'a string tag on the server for routing events to a subset of sockets'), kw('io.to(room)', 'target one room for a broadcast'),
      kw('Room union', "to('A').to('B') = to(['A','B']) — A or B, once each"), kw('Auto sid room', 'every socket is in the room named after its own id'),
      kw('socket.rooms', 'the Set of rooms one socket belongs to (size ≥ 1)'), kw('fetchSockets()', 'who is in a room, across workers (Promise)'),
      kw('Room-key pattern', 'user: · thread:/post: · listen:/dk: · maker:device:'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: room; io to a room; room union; the automatic sid room; socket rooms; fetchSockets; and the room key patterns of this repo.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Join one socket to a few rooms and print socket.rooms — find the sid',
      "Broadcast with io.to(A).to(B) and count: a socket in BOTH gets it once",
      'Find A ∩ B with fetchSockets + rooms.has',
      'Write one example key for each repo pattern',
    ]), box('Keep these', `<ul><li>Room = string tag, server side only</li><li>size ≥ 1: the sid room</li><li>to(A).to(B) = union, once each</li><li>No intersection operator</li><li>Pick keys that target exactly who you need</li></ul>`, 'info'), ''),
    en: 'Your turn: join a socket to a few rooms and find the sid in its rooms; broadcast to two rooms and count, a socket in both gets it once; find the intersection with fetchSockets; and write one key for each repo pattern. Keep: a room is a server side string tag, and chaining is a union.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Rooms and namespaces', bai: '3.1' }, S);
