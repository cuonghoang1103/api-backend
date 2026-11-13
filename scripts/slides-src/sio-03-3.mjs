/**
 * sio-03-3 — Socket.IO · Chapter 3 · Lesson 3.3 "Room lifecycle: create, join, leave, cleanup" (deck video + web, 13/11/2026).
 * Bài web: io-3-3-room-lifecycle. Output THẬT (scratchpad/sio/demo/n3-3.txt · socket.io 4.8.3 · Node 22.23.3):
 * vong: room 'X' tạo ở join ĐẦU, xoá ở leave CUỐI — adapter PHÁT create-room / join-room / leave-room / delete-room (web: "không có event nào fire cho
 *   room deleted" — SAI); room mang sid cũng có create/delete; disconnect ⇒ leave-room + delete-room room sid.
 * ro: 1.000 host phòng tạm rời — room listen: còn 0, hostState (side state) còn 1.000 khi quên; dọn ở disconnect hoặc adapter 'delete-room' ⇒ 0.
 * leave: emit rồi leave ⇒ tin TỚI; leave rồi emit ⇒ không. nhieu: 1 socket join 100.000 room ⇒ heap +23,6 MB, disconnect ⇒ dọn hết.
 * kho: e9ed78dc6 (trần 500 room post: tính theo socket), listen-together.ts dọn state ở disconnect (dòng 338) + rooms.delete (175, 182).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-3:file:vong.mjs": "// Vòng đời room 'X': tạo lúc join ĐẦU, xoá lúc leave CUỐI — và adapter CÓ phát event cho từng bước\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19620);\nconst ad = io.of('/').adapter;\nconst ten = (r) => (io.sockets.sockets.has(r) ? `<sid ${r.slice(0, 4)}…>` : `'${r}'`);\nfor (const ev of ['create-room', 'delete-room', 'join-room', 'leave-room'])\n  ad.on(ev, (room, id) => console.log(`    adapter: ${ev.padEnd(11)} ${ten(room)}${id && id !== room ? ` · ${id.slice(0, 4)}…` : ''}`));\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst vao = () => new Promise((r) => { const c = ketNoi('http://localhost:19620', { transports: ['websocket'] }); c.on('connect', () => r(c)); });\nconst co = () => `rooms có 'X'? ${ad.rooms.has('X') ? `CÓ (${ad.rooms.get('X').size} socket)` : 'KHÔNG'}`;\nconst c1 = await vao(); const c2 = await vao(); await cho(100);\nconst [s1, s2] = [...io.sockets.sockets.values()];\nconsole.log('— s1.join(X) —');  s1.join('X'); console.log('  ' + co());\nconsole.log('— s2.join(X) —');  s2.join('X'); console.log('  ' + co());\nconsole.log('  adapter.rooms (mọi khoá):', [...ad.rooms.keys()].map(ten).join(' '));\nconsole.log('  chỉ room tự đặt (lọc bỏ sid):', [...ad.rooms.keys()].filter((r) => !io.sockets.sockets.has(r)).map(ten).join(' '));\nconsole.log('— s1.leave(X) —'); s1.leave('X'); console.log('  ' + co());\nconsole.log('— s2.leave(X) — người cuối —'); s2.leave('X'); console.log('  ' + co());\nconsole.log('— s1 disconnect (rời MỌI room, kể cả room mang sid) —'); c1.close(); await cho(200);\nprocess.exit(0);\n",
 "n3-3:vong": "$ node vong.mjs\n    adapter: create-room <sid CmO9…>\n    adapter: join-room   <sid CmO9…>\n    adapter: create-room <sid Ekrk…>\n    adapter: join-room   <sid Ekrk…>\n— s1.join(X) —\n    adapter: create-room 'X'\n    adapter: join-room   'X' · CmO9…\n  rooms có 'X'? CÓ (1 socket)\n— s2.join(X) —\n    adapter: join-room   'X' · Ekrk…\n  rooms có 'X'? CÓ (2 socket)\n  adapter.rooms (mọi khoá): <sid CmO9…> <sid Ekrk…> 'X'\n  chỉ room tự đặt (lọc bỏ sid): 'X'\n— s1.leave(X) —\n    adapter: leave-room  'X' · CmO9…\n  rooms có 'X'? CÓ (1 socket)\n— s2.leave(X) — người cuối —\n    adapter: leave-room  'X' · Ekrk…\n    adapter: delete-room 'X'\n  rooms có 'X'? KHÔNG\n— s1 disconnect (rời MỌI room, kể cả room mang sid) —\n    adapter: leave-room  <sid CmO9…>\n    adapter: delete-room <sid CmO9…>",
 "n3-3:file:ro.mjs": "// Phòng nghe chung tạm (kiểu listen:<id>): room TỰ dọn, Map state của BẠN thì không — 1.000 host vào rồi rời\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cach = process.argv[2] ?? 'quen';           // quen | disconnect | delete-room\nconst io = new Server(19621);\nconst hostState = new Map();                     // roomId → { track, host, ... } — \"side state\" của bạn\nio.on('connection', (s) => {\n  s.on('listen:create', (ack) => {\n    const id = Math.random().toString(36).slice(2, 8);\n    s.join(`listen:${id}`);\n    hostState.set(id, { host: s.id, track: 'x'.repeat(2000), members: [s.id] });\n    ack(id);\n  });\n  if (cach === 'disconnect') s.on('disconnect', () => { for (const [id, st] of hostState) if (st.host === s.id) hostState.delete(id); });\n});\nif (cach === 'delete-room') io.of('/').adapter.on('delete-room', (room) => { if (room.startsWith('listen:')) hostState.delete(room.slice(7)); });\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nfor (let lo = 0; lo < 2; lo++) {\n  const cs = await Promise.all(Array.from({ length: 500 }, () => new Promise((r) => { const c = ketNoi('http://localhost:19621', { transports: ['websocket'], forceNew: true }); c.on('connect', () => c.emit('listen:create', () => r(c))); })));\n  cs.forEach((c) => c.close()); await cho(500);\n  const phong = [...io.of('/').adapter.rooms.keys()].filter((r) => r.startsWith('listen:')).length;\n  console.log(`${cach.padEnd(11)} sau ${(lo + 1) * 500} host rời: room listen: còn ${phong} · hostState còn ${hostState.size}`);\n}\nprocess.exit(0);\n",
 "n3-3:ro": "$ node ro.mjs quen\nquen        sau 500 host rời: room listen: còn 0 · hostState còn 500\nquen        sau 1000 host rời: room listen: còn 0 · hostState còn 1000\n$ node ro.mjs disconnect\ndisconnect  sau 500 host rời: room listen: còn 0 · hostState còn 0\ndisconnect  sau 1000 host rời: room listen: còn 0 · hostState còn 0\n$ node ro.mjs delete-room\ndelete-room sau 500 host rời: room listen: còn 0 · hostState còn 0\ndelete-room sau 1000 host rời: room listen: còn 0 · hostState còn 0",
 "n3-3:file:leave.mjs": "// Bẫy leave(): emit TRƯỚC rồi leave ngay (cùng một nhịp đồng bộ) — tin có tới không? Còn leave TRƯỚC rồi emit?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19622);\nconst c = ketNoi('http://localhost:19622', { transports: ['websocket'] });\nconst nhan = []; c.on('tin', (x) => nhan.push(x));\nawait new Promise((r) => c.on('connect', r));\nconst s = [...io.sockets.sockets.values()][0];\ns.join('Y');\nio.to('Y').emit('tin', 'A: emit rồi leave'); s.leave('Y');\ns.join('Y'); s.leave('Y'); io.to('Y').emit('tin', 'B: leave rồi emit');\nawait new Promise((r) => setTimeout(r, 300));\nconsole.log('client nhận:', JSON.stringify(nhan));\nprocess.exit(0);\n",
 "n3-3:leave": "$ node leave.mjs\nclient nhận: [\"A: emit rồi leave\"]",
 "n3-3:file:nhieu.mjs": "// Một socket vào bao nhiêu room cũng được — không trần nào trong socket.io. 100.000 room post:<id> tốn bao nhiêu bộ nhớ?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19623);\nconst c = ketNoi('http://localhost:19623', { transports: ['websocket'] });\nawait new Promise((r) => c.on('connect', r));\nconst s = [...io.sockets.sockets.values()][0];\nconst mb = () => { global.gc(); return process.memoryUsage().heapUsed / 1048576; };\nconst truoc = mb();\nfor (let i = 1; i <= 100_000; i++) s.join(`post:${i}`);\nconsole.log(`1 socket · socket.rooms.size = ${s.rooms.size} · adapter.rooms.size = ${io.of('/').adapter.rooms.size} · heap +${(mb() - truoc).toFixed(1)} MB`);\nc.close(); await new Promise((r) => setTimeout(r, 300));\nconsole.log(`sau disconnect: adapter.rooms.size = ${io.of('/').adapter.rooms.size} · heap còn +${(mb() - truoc).toFixed(1)} MB`);\nprocess.exit(0);\n",
 "n3-3:nhieu": "$ node --expose-gc nhieu.mjs\n1 socket · socket.rooms.size = 100001 · adapter.rooms.size = 100001 · heap +23.6 MB\nsau disconnect: adapter.rooms.size = 0 · heap còn +0.1 MB",
 "n3-3:kho": "# Kho này: sự cố e9ed78dc6 (01/11/2026) — trần \"500 room post:\" đếm theo LƯỢT gọi chứ không theo socket\n$ git show -s --format='%h %ad %s' --date=short e9ed78dc6\ne9ed78dc6 2026-11-01 fix(socket): trần 500 phòng post:<id> tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.\n$ grep -n \"for (const r of socket.rooms) if (r.startsWith('post:'))\" src/socket/messaging.socket.ts\n603: for (const r of socket.rooms) if (r.startsWith('post:')) joined += 1;\n# listen-together.ts THẬT: state riêng (Map rooms) được dọn ở handler disconnect của chính nó + finalizeLeave\n$ grep -nE \"socket.on\\('disconnect'|rooms.delete\\(\" src/socket/listen-together.ts\n175: rooms.delete(room.id);\n182: if (room.members.size === 0) rooms.delete(room.id);\n338: socket.on('disconnect', () => {"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, path, meter, vsd } from './_sio-chung.mjs';

export const deck = { key: 'sio-03-3', code: 'SIO 3.3', title: 'Room lifecycle: create, join, leave, cleanup', sub: 'Chapter 3 · Lesson 3.3' };
const O = (k) => { const v = DU_LIEU[`n3-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const VONG = O('vong').split('\n').filter((l) => !l.startsWith('$ '));
const RO = O('ro').split('\n');
const LEAVE = O('leave').split('\n');
const NHIEU = O('nhieu').split('\n');
const KHO = O('kho').split('\n');
const iX = VONG.findIndex((l) => l.startsWith('— s1.join'));
const so = (re) => +re.exec(RO.join('\n'))[1];

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'Room lifecycle:<br>create, join, leave, cleanup', sub: 'Rooms clean themselves up. Your state does not — measured',
    en: 'Lesson three point three: the room lifecycle, create, join, leave and cleanup. Rooms clean themselves up; your own state does not. We measure both.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A room is created by the FIRST join and deleted by the LAST leave — no create call</li>
    <li>The adapter DOES announce it: ${c('create-room')} · ${c('join-room')} · ${c('leave-room')} · ${c('delete-room')}</li>
    <li>Your side state (Maps keyed by room) is NOT cleaned — 1,000 leftovers, measured</li>
    <li>Two correct cleanups: on ${c('disconnect')}, or on the adapter's ${c('delete-room')}</li>
    <li>leave() vs an emit already made · one socket in 100,000 rooms</li></ul>`,
    en: 'Five takeaways: a room is created by the first join and deleted by the last leave; the adapter does announce every step with four events; your own side state is not cleaned up; there are two correct places to clean it; and two traps, leave after emit, and one socket in a hundred thousand rooms.' },
  { t: 'The lifecycle of room “X”', body: path([{ t: "s1.join('X')", s: 'created · size 1', on: true, mau: '#1f8a3b' }, { t: "s2.join('X')", s: 'size 2' }, { t: "s1.leave('X')", s: 'size 1' }, { t: "s2.leave('X')", s: 'deleted · gone', on: true, mau: '#c0392b' }], { h: 130, fs: 22, nhan: ['', '', ''] }) +
    two(tn(VONG.filter((l) => l.startsWith('— s') || l.includes("rooms có 'X'")).slice(0, 8).join('\n'), { fs: 16, wrap: 60, title: 'measured — room X after each step' }), '<div>' + box('No declaration', `There is no ${c('createRoom()')}. ${c('join')} adds the sid to the Set of that name — creating the Set if it is missing. The last ${c('leave')} empties the Set, and the adapter removes the key.`, 'info') +
      box('Disconnect = leave everything', 'A disconnecting socket leaves every room it was in, including the room named after its own sid. You never need to call leave() before disconnect.', 'ok') + '</div>', 'r46'),
    en: 'The lifecycle of room X. The first join creates it with size one; a second join makes it two; one leave brings it back to one; the last leave deletes it. There is no create call: join adds the sid to a set, creating the set if needed. And a disconnect leaves every room, including its own sid room.' },
  { t: 'Measured: the adapter announces every step', body: two(tn(VONG.join('\n'), { fs: 14, wrap: 74 }), '<div>' +
      box('Web text: “no event fires for room deleted” — wrong', `The in-memory adapter is an EventEmitter: ${c('io.of("/").adapter.on("delete-room", (room) => …)')} fired right after the last leave. Same for ${c('create-room')}, ${c('join-room')}, ${c('leave-room')}.`, 'bad') +
      box('Note', `Sid rooms fire too: every connect is a ${c('create-room')} + ${c('join-room')}. Filter with ${c('io.sockets.sockets.has(room)')} (sid ⇒ true). With several workers (Chapter 5) each adapter only sees its own sockets.`, 'info') + '</div>', 'r64'),
    en: 'Measured: the adapter announces every step. The web text says no event fires when a room is deleted; that is wrong. The adapter emitted create room on the first join, join room and leave room for each socket, and delete room right after the last leave. Sid rooms fire too, so filter them out by checking whether the name is a socket id.' },
  { t: 'Ephemeral rooms: the room goes, your Map stays', body: two(tsx(`// a temporary "listen together" room (simplified)
socket.on('listen:create', (ack) => {
  const id = randomId();
  socket.join(\`listen:\${id}\`);
  hostState.set(id, { host: socket.id, track, members });
  ack(id);
});
// host disconnects → socket.io removes 'listen:<id>'
// … and hostState still holds the entry`, { fs: 16 }), box('Measured: 1,000 hosts created a room, then left', `socket.io's ${c('listen:')} rooms left: <b>0</b>. Your ${c('hostState')}: <b>1,000</b> entries (2 KB each here) — they stay until the process restarts.`, 'bad'), 'r64') + meter([
      ['forgot cleanup — hostState after 1,000 hosts left', so(/quen +sau 1000[^·]*· hostState còn (\d+)/), '#c0392b'],
      ['cleanup in disconnect', so(/disconnect +sau 1000[^·]*· hostState còn (\d+)/), '#1f8a3b'],
      ['cleanup on adapter "delete-room"', so(/delete-room sau 1000[^·]*· hostState còn (\d+)/), '#1f8a3b'],
    ], { don: ' entries', nhan: 470, w: 1110 }),
    en: 'Ephemeral rooms: the room goes, your map stays. A temporary listen together room keeps host state in a map. A thousand hosts created rooms and left. The socket.io rooms were all gone, but the map still held one thousand entries. Cleaning up on disconnect, or on the delete room event, brought it to zero.' },
  { t: 'Two correct cleanups', body: vsd(tsx(`socket.on('disconnect', () => {
  for (const [id, st] of hostState)
    if (st.host === socket.id)
      hostState.delete(id);
});`, { fs: 16 }), tsx(`const ad = io.of('/').adapter;
ad.on('delete-room', (room) => {
  if (room.startsWith('listen:'))
    hostState.delete(room.slice(7));
});`, { fs: 16 }), 'A · per socket: on disconnect', 'B · per room: on delete-room') + two(
      box('A — host-owned state', 'Drop what THIS socket owned. Right when the room should close as soon as the host leaves (the repo: listen-together.ts:338 + finalizeLeave).', 'info'),
      box('B — room-owned state', 'Drop it when the ROOM disappears, whoever left last. One place, no scan. Per worker only — each adapter sees its own sockets.', 'ok')) +
    path([{ t: 'who owns the state?', s: 'decide first', on: true }, { t: 'the host socket', s: '⇒ A · disconnect / leave' }, { t: 'the room itself', s: '⇒ B · delete-room' }], { h: 120, fs: 21 }),
    en: 'Two correct cleanups. A: on disconnect, drop what this socket owned; right for host owned state, and that is what the repo does in listen together, line three three eight. B: on the adapter delete room event, drop the state when the room itself disappears, whoever left last. One place, no scan, but per worker.' },
  { t: 'Seeing which rooms exist', body: two(tsx(`// ALL keys of the adapter — sid rooms included
const all = io.of('/').adapter.rooms; // Map<room, Set>

// only the rooms YOU created: drop names that are socket ids
const custom = [...all.keys()]
  .filter((name) => !io.sockets.sockets.has(name));`, { fs: 18 }), tn(VONG.filter((l) => /adapter\.rooms \(|chỉ room tự đặt/.test(l)).map((l) => l.trim()).join('\n'), { fs: 16, wrap: 46 }), 'r64') + two(
      box('Why the filter', 'Every connected socket adds one key — its sid. On a server with 10,000 sockets, the Map has at least 10,000 keys before any room of yours.', 'info'),
      box('Local only', `${c('adapter.rooms')} is this worker's Map. Across workers, ask with ${c("io.in(room).fetchSockets()")} (lesson 3.1, Chapter 5).`, 'ok')) +
    path([{ t: '<sid A>', s: 'socket A', mau: '#64748b' }, { t: '<sid B>', s: 'socket B', mau: '#64748b' }, { t: "'X'", s: 'yours', on: true }], { h: 120, fs: 22, nhan: ['', ''] }),
    en: 'Seeing which rooms exist. The adapter rooms map has every key, sid rooms included. To list only the rooms you created, drop names that are socket ids. Measured: the map held two sid rooms and X; the filter kept only X. And remember the map is local to this worker.' },
  { t: 'Trap: leave() after an emit', body: two(tsx(`io.to('Y').emit('tin', 'A: emit then leave');
socket.leave('Y');            // too late for A

socket.leave('Y');
io.to('Y').emit('tin', 'B: leave then emit');`, { fs: 19 }), tn(LEAVE.join('\n'), { fs: 18, wrap: 60 }), 'r64') + two(
      box('Measured', 'A arrived, B did not. The recipients of an emit are computed and the packet is written <b>during</b> the emit call — a later leave() cannot recall it.', 'info'),
      box('So', 'To stop someone getting an event, remove them from the room <b>before</b> emitting. Not a race, not a bug: emit is synchronous routing.', 'ok')) +
    path([{ t: "io.to('Y').emit()", s: 'look up Set Y now' }, { t: 'packet written', s: 'to each socket, now', on: true }, { t: "socket.leave('Y')", s: 'changes the NEXT emit only', mau: '#c0392b' }], { h: 130, fs: 21 }),
    en: 'Trap: leave after an emit. The emit first, then leave: the message arrived. Leave first, then emit: it did not. The recipients are computed and the packet is written during the emit call, so a later leave cannot recall it. To keep someone out, remove them before you emit.' },
  { t: 'No limit: one socket, 100,000 rooms', body: tn(NHIEU.join('\n'), { fs: 17, wrap: 110 }) + tn(KHO.filter((l) => !l.startsWith('#')).slice(0, 4).join('\n'), { fs: 15, wrap: 100 }) + two(
      box('socket.io has no cap', 'Nothing stops one socket joining 100,000 rooms: here +23.6 MB of heap, all released on disconnect. Every join from a client event is a memory cost you must bound.', 'bad'),
      box('This repo, 01/11 (e9ed78dc6)', `The “max 500 ${c('post:')} rooms” cap counted per <b>call</b> of ${c('post:subscribe')} — calling it repeatedly put one socket into 100,000 rooms. Fix: count ${c('socket.rooms')} (line 603).`, 'do2')),
    en: 'No limit: one socket can join a hundred thousand rooms. Here that cost twenty three point six megabytes of heap, released on disconnect. This repo had exactly that bug: the five hundred room cap counted calls instead of rooms, so repeated subscribes put one socket in a hundred thousand rooms. The fix counts socket rooms.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Room creation', 'implicit, on the first join'), kw('Room deletion', 'implicit, on the last leave'),
      kw('create-room / delete-room', 'adapter events (also join-room, leave-room)'), kw('Side state', 'your Maps keyed by room or sid (hostState…)'),
      kw('Manual cleanup', 'on disconnect, or on delete-room'), kw('Ephemeral room', 'short-lived, no DB row — the room IS the data'),
      kw('Room cap', 'bound joins per socket: count socket.rooms'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: room creation and deletion, both implicit; the adapter events create room and delete room; side state; manual cleanup; ephemeral room; and a room cap counted on socket rooms.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Listen to create-room / delete-room; join and leave X and watch both fire',
      'Build a temporary room with a side Map; disconnect 100 hosts; count leftovers',
      'Fix it twice: on disconnect, then on delete-room — both reach 0',
      'Cap joins per socket by counting socket.rooms',
    ]), box('Keep these', `<ul><li>First join creates, last leave deletes</li><li>delete-room DOES fire — use it</li><li>Rooms clean up; your Maps do not</li><li>leave() cannot recall a past emit</li><li>Bound rooms per socket</li></ul>`, 'info'), ''),
    en: 'Your turn: listen to the adapter events and watch them fire; build a temporary room with a side map, disconnect a hundred hosts and count the leftovers; fix it on disconnect and then on delete room; and cap joins per socket. Keep: rooms clean themselves up, your maps do not.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Rooms and namespaces', bai: '3.3' }, S);
