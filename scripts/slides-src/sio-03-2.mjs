/**
 * sio-03-2 — Socket.IO · Chapter 3 · Lesson 3.2 "Namespaces: the tool you probably do NOT need" (deck video + web, 13/11/2026).
 * Bài web: io-3-2-namespace. Output THẬT (scratchpad/sio/demo/n3-2.txt · socket.io 4.8.3 · Node 22.23.3 · Chromium Playwright):
 * tach: '/' + '/admin' — middleware chạy riêng; CÙNG Manager + CÙNG engine sid, KHÁC socket.id; io.emit ở '/' không tới /admin; thread:42 hai Map riêng;
 *   namespace chưa khai ⇒ connect_error "Invalid namespace".
 * trinh: Chromium MỘT WebSocket: ↑40 · ↑40/admin, · ↓40{sid} · ↓40/admin,{sid} · ↓42["chao",…] · ↓42/admin,["chao",…].
 * dong: dynamic namespace, 2.000 tenant vào rồi rời hết: mặc định 2.001 namespace (heap 8,7 ⇒ 15,7 MB); cleanupEmptyChildNamespaces: true ⇒ 1
 *   (web nói "KHÔNG có cách nào cleanup" — SAI từ 4.6.0).
 * kho: grep io.of trong src = 0; gateway 8 tệp 3.935 dòng (web: "2.430 dòng, 5 feature").
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-2:file:ns.mjs": "// Hai namespace trên MỘT server: '/' và '/admin' — middleware, sid, room có tách nhau không? Có chung đường ống không?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19610);\nconst admin = io.of('/admin');\nio.use((s, next) => { console.log(`  middleware '/'      chạy cho ${s.nsp.name}`); next(); });\nadmin.use((s, next) => { console.log(`  middleware '/admin' chạy cho ${s.nsp.name}`); next(); });\nconst log = (ten) => (s) => { s.join('thread:42'); s.on('ping-thu', () => {}); console.log(`  [${ten}] connection · socket.id=${s.id.slice(0, 6)}… · engine sid=${s.conn.id.slice(0, 6)}…`); };\nio.on('connection', log('/'));\nadmin.on('connection', log('/admin'));\n\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst goc = ketNoi('http://localhost:19610');\nconst ad = ketNoi('http://localhost:19610/admin');\nawait cho(500);\nconsole.log('— hai socket, mấy đường ống? —');\nconsole.log(`goc.io === ad.io (cùng Manager)      → ${goc.io === ad.io}`);\nconsole.log(`engine.id của hai socket            → ${goc.io.engine.id.slice(0, 6)}… · ${ad.io.engine.id.slice(0, 6)}…`);\nconsole.log(`socket.id của hai socket            → ${goc.id.slice(0, 6)}… · ${ad.id.slice(0, 6)}…`);\nconsole.log('— emit có vượt namespace không? —');\nlet nGoc = 0, nAd = 0; goc.on('tin', () => nGoc++); ad.on('tin', () => nAd++);\nio.emit('tin'); await cho(200);                       console.log(`io.emit (namespace '/')             → goc ${nGoc} · admin ${nAd}`);\nio.to('thread:42').emit('tin'); await cho(200);       console.log(`io.to('thread:42') ở '/'            → goc ${nGoc} · admin ${nAd}`);\nadmin.to('thread:42').emit('tin'); await cho(200);    console.log(`admin.to('thread:42')               → goc ${nGoc} · admin ${nAd}`);\nconsole.log(`thread:42 ở '/' có ${io.sockets.adapter.rooms.get('thread:42').size} socket · ở '/admin' có ${admin.adapter.rooms.get('thread:42').size} socket — hai Map khác nhau`);\nconsole.log('— namespace không ai khai báo —');\nconst la = ketNoi('http://localhost:19610/khong-co', { reconnection: false });\nconsole.log('io(url + \"/khong-co\")               →', await new Promise((r) => { la.on('connect', () => r('connect')); la.on('connect_error', (e) => r(`connect_error \"${e.message}\"`)); }));\nprocess.exit(0);\n",
 "n3-2:tach": "$ node ns.mjs\n  middleware '/'      chạy cho /\n  [/] connection · socket.id=PmTj3P… · engine sid=_9-64N…\n  middleware '/admin' chạy cho /admin\n  [/admin] connection · socket.id=7XkdbU… · engine sid=_9-64N…\n— hai socket, mấy đường ống? —\ngoc.io === ad.io (cùng Manager)      → true\nengine.id của hai socket            → _9-64N… · _9-64N…\nsocket.id của hai socket            → PmTj3P… · 7XkdbU…\n— emit có vượt namespace không? —\nio.emit (namespace '/')             → goc 1 · admin 0\nio.to('thread:42') ở '/'            → goc 2 · admin 0\nadmin.to('thread:42')               → goc 2 · admin 1\nthread:42 ở '/' có 1 socket · ở '/admin' có 1 socket — hai Map khác nhau\n— namespace không ai khai báo —\nio(url + \"/khong-co\")               → connect_error \"Invalid namespace\"",
 "n3-2:file:trang32.mjs": "// Trang thật: MỘT trang mở io('/') và io('/admin') — Chromium mở mấy WebSocket? Khung của /admin trông thế nào?\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { Server } from 'socket.io';\nconst srv = http.createServer((req, res) => { if (req.url === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(readFileSync('trang32.html')); } });\nconst io = new Server(srv);\nio.on('connection', (s) => setTimeout(() => s.emit('chao', 'từ /'), 400));\nio.of('/admin').on('connection', (s) => setTimeout(() => s.emit('chao', 'từ /admin'), 600));\nsrv.listen(19611, () => console.log('trang ở http://localhost:19611'));\n",
 "n3-2:file:trang32.html": "<!doctype html><html><head><meta charset=\"utf-8\"><title>hai namespace</title>\n<style>body{font:18px/1.5 system-ui;margin:24px;background:#f8fafc}h1{font-size:22px;margin:0 0 12px}pre{background:#0b1018;color:#e6edf3;padding:14px 18px;border-radius:10px;font:16px/1.6 Consolas,monospace}</style></head>\n<body><h1>⚡ một trang, hai namespace — mấy WebSocket?</h1><pre id=\"log\"></pre>\n<script src=\"/socket.io/socket.io.js\"></script>\n<script>\nconst log = (s) => (document.getElementById('log').textContent += s + '\\n');\nconst goc = io({ transports: ['websocket'] });\nconst ad = io('/admin', { transports: ['websocket'] });\ngoc.on('connect', () => log(\"io('/')      connect ✓ id=\" + goc.id.slice(0, 6) + '…'));\nad.on('connect', () => log(\"io('/admin')  connect ✓ id=\" + ad.id.slice(0, 6) + '…'));\ngoc.on('chao', (d) => log(\"'/'      nhận chao: \" + d));\nad.on('chao', (d) => log(\"'/admin'  nhận chao: \" + d));\nsetTimeout(() => log('cùng Manager (một ống)? ' + (goc.io === ad.io)), 1200);\n</script></body></html>\n",
 "n3-2:trinh": "$ node /Users/admin/Documents/video-bai-giang/scratchpad/sio/anh.mjs /Users/admin/Documents/video-bai-giang/scratchpad/sio/spec/sio-3-2.json\n✓ trang  http://localhost:19611/  mạng 2 · console 0\ntrang ở http://localhost:19611",
 "n3-2:file:dong.mjs": "// Dynamic namespace: 2.000 tenant kết nối rồi rời hết — namespace có được dọn không? Mặc định vs cleanupEmptyChildNamespaces: true\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst don = process.argv[2] === 'don';\nconst io = new Server(19612, don ? { cleanupEmptyChildNamespaces: true } : {});\nio.of(/^\\/tenant-\\d+$/).on('connection', () => {});\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst mb = () => (process.memoryUsage().heapUsed / 1048576).toFixed(1);\nglobal.gc?.(); console.log(`${don ? 'cleanupEmptyChildNamespaces: true' : 'mặc định'} · lúc đầu: ${io._nsps.size} namespace · heap ${mb()} MB`);\nfor (let lo = 0; lo < 4; lo++) {\n  const cs = [];\n  for (let i = 0; i < 500; i++) cs.push(ketNoi(`http://localhost:19612/tenant-${lo * 500 + i}`, { transports: ['websocket'], forceNew: true }));\n  await Promise.all(cs.map((c) => new Promise((r) => c.on('connect', r))));\n  cs.forEach((c) => c.close()); await cho(400);\n  global.gc?.(); console.log(`  sau ${(lo + 1) * 500} tenant (đã rời hết): ${io._nsps.size} namespace · heap ${mb()} MB`);\n}\nprocess.exit(0);\n",
 "n3-2:dong": "$ node --expose-gc dong.mjs\nmặc định · lúc đầu: 1 namespace · heap 8.7 MB\n  sau 500 tenant (đã rời hết): 501 namespace · heap 14.1 MB\n  sau 1000 tenant (đã rời hết): 1001 namespace · heap 15.0 MB\n  sau 1500 tenant (đã rời hết): 1501 namespace · heap 15.9 MB\n  sau 2000 tenant (đã rời hết): 2001 namespace · heap 15.7 MB\n$ node --expose-gc dong.mjs don\ncleanupEmptyChildNamespaces: true · lúc đầu: 1 namespace · heap 8.7 MB\n  sau 500 tenant (đã rời hết): 1 namespace · heap 13.4 MB\n  sau 1000 tenant (đã rời hết): 1 namespace · heap 13.7 MB\n  sau 1500 tenant (đã rời hết): 1 namespace · heap 13.8 MB\n  sau 2000 tenant (đã rời hết): 1 namespace · heap 12.9 MB",
 "n3-2:kho": "# Kho này: có namespace nào không? Và gateway dài bao nhiêu?\n$ grep -rn \"io.of(\\|\\.of('/\" src --include='*.ts' | wc -l\n       0\n$ wc -l src/socket/*.ts | grep -v test\n     281 src/socket/call.socket.ts\n    1113 src/socket/device.gateway.ts\n     680 src/socket/doiKhang.socket.ts\n     362 src/socket/listen-together.ts\n     614 src/socket/messaging.socket.ts\n     300 src/socket/notes-collaboration.gateway.ts\n     410 src/socket/work-docs-collaboration.gateway.ts\n     175 src/socket/work.socket.ts\n    3935 total",
 "n3-2:ws": "[[\"↓\",\"0{\\\"sid\\\":\\\"ibMhTXtR3ldVvYl_AAAA\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":20000,\\\"maxPayload\\\":1000000}\",53],[\"↑\",\"40\",53],[\"↑\",\"40/admin,\",53],[\"↓\",\"40{\\\"sid\\\":\\\"RgCTHU4LlURIlj1xAAAA\\\"}\",54],[\"↓\",\"40/admin,{\\\"sid\\\":\\\"cnxShtO9ytUOnvgKAAAB\\\"}\",54],[\"↓\",\"42[\\\"chao\\\",\\\"từ /\\\"]\",456],[\"↓\",\"42/admin,[\\\"chao\\\",\\\"từ /admin\\\"]\",657]]"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, wire, path, meter, vsd } from './_sio-chung.mjs';

export const deck = { key: 'sio-03-2', code: 'SIO 3.2', title: 'Namespaces: the tool you probably do NOT need', sub: 'Chapter 3 · Lesson 3.2' };
const O = (k) => { const v = DU_LIEU[`n3-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const TACH = O('tach').split('\n').filter((l) => !l.startsWith('$ '));
const iOng = TACH.findIndex((l) => l.startsWith('— hai')), iEmit = TACH.findIndex((l) => l.startsWith('— emit')), iLa = TACH.findIndex((l) => l.startsWith('— namespace'));
const WS = JSON.parse(O('ws'));
const DONG = O('dong').split('\n');
const KHO = O('kho').split('\n').filter((l) => !l.startsWith('#'));
const so = (re) => DONG.filter((l) => re.test(l)).map((l) => +/: (\d+) namespace/.exec(l)[1]);
const MD = so(/^ {2}sau/).slice(0, 4), DON = so(/^ {2}sau/).slice(4);

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.2', t: 'Namespaces:<br>the tool you probably do NOT need', sub: 'Isolation, one shared pipe, and a leak that has an off switch — measured',
    en: 'Lesson three point two: namespaces, the tool you probably do not need. We measure their isolation, the one pipe they share, and a leak that has an off switch.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A namespace isolates middleware, socket ids and rooms — measured</li>
    <li>…but shares ONE engine.io connection: one WebSocket, prefixed packets</li>
    <li>The three hard walls that justify one: other auth, multi-tenant, team split</li>
    <li>Why this repo has zero namespaces (grep: 0)</li>
    <li>Dynamic namespaces pile up — and ${c('cleanupEmptyChildNamespaces')} fixes it</li></ul>`,
    en: 'Five takeaways: a namespace isolates middleware, socket ids and rooms; but it shares one engine.io connection; three hard walls justify one; this repo has zero namespaces; and dynamic namespaces pile up unless you turn on cleanup of empty child namespaces.' },
  { t: 'What a namespace is', body: two(tsx(`// server: the default namespace is '/'
io.on('connection', (s) => { /* … */ });

// a second namespace, with its own middleware
const admin = io.of('/admin');
admin.use(checkAdminSession);
admin.on('connection', (s) => { /* … */ });

// client: the PATH of the URL picks the namespace
const a = io('https://example.com');        // '/'
const b = io('https://example.com/admin');  // '/admin'`, { fs: 18 }),
    '<div>' + box('Isolated', 'Each namespace has its own middleware chain, its own socket ids and its own rooms Map. An emit in one never reaches the other.', 'info') +
    box('Shared', 'Both client sockets above ride the SAME engine.io connection — the namespace is a prefix inside each packet, not a new connection.', 'ok') + '</div>', 'r64'),
    en: 'What a namespace is. The default one is slash. io dot of slash admin creates a second one, with its own middleware and its own connection handler. On the client, the path of the URL picks the namespace. Namespaces are isolated, but both client sockets ride the same engine.io connection.' },
  { t: 'Measured: what is separate, what is shared', body: two(tn(TACH.join('\n'), { fs: 15, wrap: 70 }), '<div>' +
      box('Separate', `Middleware of ${c("'/'")} did not run for ${c('/admin')}. Two socket ids. ${c('io.emit')} reached only ${c("'/'")}; ${c('thread:42')} exists twice, in two Maps.`, 'info') +
      box('Shared', `${c('goc.io === ad.io')} is <b>true</b>: one Manager, one engine sid for both. And a namespace nobody declared ⇒ ${c('connect_error "Invalid namespace"')}.`, 'ok') + '</div>', 'r64'),
    en: 'Measured. Separate: the slash middleware did not run for admin, the two sockets have two ids, io emit reached only the default namespace, and thread forty two exists twice in two maps. Shared: one Manager and one engine sid for both. A namespace nobody declared gives connect error, invalid namespace.' },
  { t: 'On the wire: one WebSocket, the namespace is a prefix', body: wire(WS.map(([h, chu, t]) => [h, chu, `${t} ms · ${chu.startsWith('0{') ? 'engine.io OPEN — ONE connection' : chu === '40' ? "CONNECT to '/'" : chu === '40/admin,' ? "CONNECT to '/admin' — same pipe" : chu.startsWith('40/admin') ? 'CONNECT ok — /admin sid' : chu.startsWith('40{') ? "CONNECT ok — '/' sid" : chu.startsWith('42/admin') ? 'EVENT in /admin' : "EVENT in '/'"}`]), { fs: 17, max: 64 }) +
    path([{ t: '4', s: 'engine.io MESSAGE' }, { t: '2', s: 'socket.io EVENT' }, { t: '/admin,', s: 'namespace (omitted for /)', on: true }, { t: '["chao",…]', s: 'event + args' }], { h: 140, fs: 22 }),
    en: 'On the wire, in a real Chromium: the page opened io slash and io slash admin, and there was one WebSocket. Two connect packets, the second one prefixed with slash admin comma. Every event of the admin namespace carries that prefix; the default namespace omits it.' },
  { t: 'When you DO need a namespace: a hard wall', body: cmp(['Case', 'Namespace', 'Why a room is not enough'], [
      ['admin panel with different auth', c('/admin'), 'its own <b>middleware</b> chain: session cookie here, JWT on /'],
      ['multi-tenant SaaS', c('/tenant-<id>'), 'an emit in tenant A must not reach tenant B even with a bug'],
      ['code split by team', `${c('/notifications')} · ${c('/messaging')}`, 'teams cannot accidentally emit into each other’s events'],
    ]) + two(box('The test', 'Do the two sides need <b>different connect-time rules</b> (auth, limits), or a wall a coding mistake cannot cross? Then a namespace. Otherwise, a room prefix.', 'info'),
      box('Not a reason', '“To organise features.” That is the job of room prefixes and event-name prefixes: chat:message vs call:offer.', 'bad')),
    en: 'When you do need a namespace: a hard wall. An admin panel with different authentication, because the namespace has its own middleware. A multi tenant product, where an emit in one tenant must never reach another. Or code split by team. To organise features is not a reason: that is the job of room and event prefixes.' },
  { t: 'This repo: zero namespaces (real grep)', body: two(tn(KHO.join('\n'), { fs: 15, wrap: 74 }), '<div>' +
      box('Measured', `${c('io.of(')} appears <b>0</b> times in ${c('src/')}. The gateways are <b>8 files, 3,935 lines</b> (not counting tests) — the web text said 2,430 and five features.`, 'info') +
      box('Why none', '<ul><li>One auth: admin and users both use JWT, same middleware</li><li>Room prefixes already keep features apart</li><li>One namespace ⇒ one client to set up in every test</li></ul>', 'ok') + '</div>', 'r64') +
    path([{ t: 'auth', s: 'one: JWT for all' }, { t: 'features', s: 'thread: · call: · listen:', on: true }, { t: 'tests', s: 'one client per test' }], { h: 96, fs: 20, nhan: ['', ''] }),
    en: 'This repo has zero namespaces: io dot of appears zero times. The gateways are eight files, three thousand nine hundred thirty five lines without tests. Why none: one authentication for everyone, room prefixes already keep features apart, and one namespace means one client to set up in every test.' },
  { t: 'Dynamic namespaces pile up — measured', body: two(tn(DONG.join('\n'), { fs: 15, wrap: 62 }), meter([
      ['default, after 500', MD[0], '#c0392b'], ['default, after 2,000', MD[3], '#c0392b'], ['cleanup: true, after 500', DON[0], '#1f8a3b'], ['cleanup: true, after 2,000', DON[3], '#1f8a3b']], { don: ' ns', nhan: 260, w: 470 }), 'r64') + two(
      box('Default: they stay', `${c('io.of(/^\\/tenant-\\d+$/)')} creates a child namespace per tenant. 2,000 tenants connected and <b>all left</b> — 2,001 namespaces remained (heap 8.7 → 15.7 MB here).`, 'bad'),
      box('Web text: “no way to clean up” — wrong since 4.6.0', `${c('new Server({ cleanupEmptyChildNamespaces: true })')} removes a child namespace when its last socket leaves: back to 1.`, 'ok')),
    en: 'Dynamic namespaces pile up. A regex namespace creates a child namespace per tenant. Two thousand tenants connected and all left, and two thousand and one namespaces remained, a few megabytes of heap here. The web text says there is no way to clean up; since version four point six, the server option cleanup empty child namespaces removes them: back to one.' },
  { t: 'Traps', body: two(box('Namespace as a collection name', `${c("io.of('/thread-42')")} looks tidy — but every thread becomes a connection-level object with its own middleware, and the client must open a namespace per thread. That is a <b>room</b>: ${c("io.to('thread:42')")}.`, 'bad'),
      box('Namespace that was never declared', `The client connects to ${c('/admin')} before the server calls ${c("io.of('/admin')")} (lazy module, typo) ⇒ ${c('connect_error "Invalid namespace"')}, and the default reconnect keeps retrying.`, 'bad')) +
    path([{ t: 'feature split?', s: 'room prefix + event prefix', mau: '#1f8a3b' }, { t: 'different connect rules?', s: 'namespace', mau: '#2563eb', on: true }, { t: 'per-tenant, many?', s: 'namespace + cleanup: true', mau: '#7c3aed' }], { h: 150, fs: 21 }) + vsd(tsx(`io.of('/thread-42').emit('msg', m);`, { fs: 18 }),
      tsx(`socket.join('thread:42');
io.to('thread:42').emit('msg', m);`, { fs: 18 }), '✗ Namespace per thread', '✓ Room per thread'),
    en: 'Two traps. Using a namespace as a collection name, like one namespace per thread: that is a room. And connecting to a namespace the server never declared, from a typo or a lazy module, which gives invalid namespace, and the client keeps retrying. The rule: feature split, use prefixes; different connect rules, a namespace.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Namespace', 'connection-level isolation: own middleware, sid and rooms'), kw("io.of('/name')", 'create or get a namespace'),
      kw("Default namespace '/'", 'where every feature of this repo lives'), kw('Multiplexing', 'many namespaces, one engine.io connection'),
      kw('Hard wall', 'other auth, multi-tenant, team split'), kw('Dynamic namespace', 'created on demand by a regex or function'),
      kw('cleanupEmptyChildNamespaces', '4.6+: drop empty child namespaces'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: namespace; io dot of; the default namespace; multiplexing, many namespaces over one engine.io connection; a hard wall; dynamic namespace; and the option that cleans up empty child namespaces.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      "Add io.of('/admin') with its own middleware; check sid and rooms are separate",
      'Open DevTools: one WebSocket, find the /admin, prefix',
      'Get the same separation on / with an admin: room prefix',
      'Dynamic namespace: count io._nsps before and after cleanup: true',
    ]), box('Keep these', `<ul><li>Namespace = connection-level wall</li><li>Same engine.io pipe, prefixed packets</li><li>Need it only for a hard wall</li><li>This repo: 0 — prefixes suffice</li><li>Dynamic ⇒ turn cleanup on</li></ul>`, 'info'), ''),
    en: 'Your turn: add an admin namespace with its own middleware and check the separation; find the admin prefix in DevTools; reach the same separation with a room prefix; and count namespaces with and without cleanup. Keep: a namespace is a wall at connection level, sharing one pipe; use it only when you need that wall.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Rooms and namespaces', bai: '3.2' }, S);
