/**
 * sio-00-2 — Socket.IO · Section 0 · Lesson 0.2 "Why long-polling is still not dead in 2026" (deck video + web, 13/11/2026).
 * Bài web: io-0-2-long-poll. Output THẬT (scratchpad/sio/demo/n0-2.txt · socket.io 4.8.3 · Node 22.23.3, Mac):
 * cấu hình thật messaging.socket.ts:286–299; server ['websocket','polling'] ⇒ client mặc định BẮT ĐẦU polling, upgrade sau 6 ms; client tự khai
 * transports ['websocket','polling'] ⇒ bắt đầu websocket; proxy TCP đếm byte, 100 tin nhỏ: polling 37.192 B (371,9 B/tin) vs websocket 3.692 B (36,9 B/tin),
 * phần chữ 3.492 B ⇒ overhead 337 vs 2 B/tin; proxy xoá Upgrade ⇒ server 400 {"code":3,"message":"Bad request"}, client mặc định vẫn nhận qua polling,
 * client chỉ-websocket connect_error 3 lần trong 4 s, không bao giờ nối.
 * Lệch web: dòng 220-232 ⇒ 286-299; "~200 ms" ⇒ 6 ms (một vòng đi-về); 133× (tính tay) ⇒ đo: ~10× tổng byte, overhead ~170×; % nhóm người dùng = ước lượng.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-2:cau-hinh": "$ grep -n -A13 'io = new IOServer' src/socket/messaging.socket.ts\n286:  io = new IOServer(httpServer, {\n287-    cors: {\n288-      // Mirror the Express CORS allow-list logic by accepting\n289-      // any origin here. Express CORS is the source of truth for\n290-      // HTTP — we just need to hand the upgrade through.\n291-      origin: true,\n292-      credentials: true,\n293-    },\n294-    // Long-poll fallback is enabled by default; WebSocket-only would\n295-    // break users behind corporate proxies that strip the upgrade header.\n296-    transports: ['websocket', 'polling'],\n297-    pingInterval: 25000,\n298-    pingTimeout: 60000,\n299-  });",
 "n0-2:file:thu-tu.mjs": "// Server khai transports: ['websocket', 'polling'] như kho — client mặc định bắt đầu bằng GÌ?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19420, { transports: ['websocket', 'polling'] });\nio.on('connection', (s) => {\n  const t0 = Date.now(), ten = s.handshake.query.ten;\n  console.log(`${ten}: server thấy transport ĐẦU TIÊN = ${s.conn.transport.name}`);\n  s.conn.once('upgrade', (t) => console.log(`${ten}: upgrade → ${t.name} sau ${Date.now() - t0} ms`));\n});\nconst a = ketNoi('http://localhost:19420', { query: { ten: 'client mặc định' } });\nawait new Promise((r) => setTimeout(r, 800));\nconst b = ketNoi('http://localhost:19420', { query: { ten: \"client transports:['websocket','polling']\" }, transports: ['websocket', 'polling'] });\nawait new Promise((r) => setTimeout(r, 800));\na.close(); b.close(); io.close();\n",
 "n0-2:thu-tu": "$ node thu-tu.mjs\nclient mặc định: server thấy transport ĐẦU TIÊN = polling\nclient mặc định: upgrade → websocket sau 6 ms\nclient transports:['websocket','polling']: server thấy transport ĐẦU TIÊN = websocket",
 "n0-2:file:dem-byte.mjs": "// Proxy TCP đếm byte trên dây: server đẩy 100 tin nhỏ, đo tổng byte HAI chiều, chỉ polling vs chỉ websocket.\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19421, { transports: ['polling', 'websocket'] });\nio.on('connection', async (s) => {\n  await new Promise((r) => setTimeout(r, 300));\n  s.emit('bat-dau'); await new Promise((r) => setTimeout(r, 300));\n  for (let i = 1; i <= 100; i++) { s.emit('tin', { i, chu: 'xin chao' }); await new Promise((r) => setTimeout(r, 20)); }\n});\nlet dem = { len: 0, xuong: 0 };\nnet.createServer((c) => {\n  const u = net.connect(19421);\n  c.on('data', (d) => { dem.len += d.length; u.write(d); });\n  u.on('data', (d) => { dem.xuong += d.length; c.write(d); });\n  c.on('close', () => u.destroy()); u.on('close', () => c.destroy());\n}).listen(19422);\nfor (const tr of ['polling', 'websocket']) {\n  const c = ketNoi('http://localhost:19422', { transports: [tr] });\n  let goc, n = 0;\n  c.on('bat-dau', () => { goc = { ...dem }; });\n  await new Promise((r) => c.on('tin', () => { if (++n === 100) r(); }));\n  const len = dem.len - goc.len, xuong = dem.xuong - goc.xuong;\n  console.log(`${tr.padEnd(9)}: 100 tin ⇒ client→server ${String(len).padStart(6)} B · server→client ${String(xuong).padStart(6)} B · tổng ${String(len + xuong).padStart(6)} B · ${((len + xuong) / 100).toFixed(1)} B/tin`);\n  c.close(); await new Promise((r) => setTimeout(r, 300));\n}\nlet tong = 0; for (let i = 1; i <= 100; i++) tong += `42[\"tin\",{\"i\":${i},\"chu\":\"xin chao\"}]`.length;\nconsole.log(`phần CHỮ của 100 tin (42[\"tin\",{\"i\":N,\"chu\":\"xin chao\"}]): ${tong} B ⇒ phần còn lại là overhead`);\nprocess.exit(0);\n",
 "n0-2:overhead": "$ node dem-byte.mjs\npolling  : 100 tin ⇒ client→server  17600 B · server→client  19592 B · tổng  37192 B · 371.9 B/tin\nwebsocket: 100 tin ⇒ client→server      0 B · server→client   3692 B · tổng   3692 B · 36.9 B/tin\nphần CHỮ của 100 tin (42[\"tin\",{\"i\":N,\"chu\":\"xin chao\"}]): 3492 B ⇒ phần còn lại là overhead",
 "n0-2:file:proxy-chan.mjs": "// Proxy \"văn phòng\" XOÁ header Upgrade (chuyển tiếp như GET thường). Hai client: mặc định vs transports:['websocket'].\nimport http from 'node:http';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19423);\nio.on('connection', (s) => setTimeout(() => s.emit('tin', 'chào ' + s.handshake.query.ten), 1500));\nconst proxy = http.createServer((req, res) => {\n  const u = http.request({ port: 19423, path: req.url, method: req.method, headers: req.headers }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });\n  req.pipe(u);\n});\nproxy.on('upgrade', (req, sock) => {                       // xoá Upgrade + Connection, gửi như GET thường\n  const { upgrade, connection, ...h } = req.headers;\n  http.get({ port: 19423, path: req.url, headers: h }, (r) => {\n    let b = ''; r.on('data', (d) => (b += d)); r.on('end', () => { sock.end(`HTTP/1.1 ${r.statusCode} ${r.statusMessage}\\r\\nContent-Length: ${Buffer.byteLength(b)}\\r\\n\\r\\n${b}`); console.log(`  proxy: chặn upgrade ⇒ server trả ${r.statusCode} ${b}`); });\n  });\n});\nproxy.listen(19424);\nfor (const [ten, opt] of [['mac-dinh', {}], ['chi-websocket', { transports: ['websocket'] }]]) {\n  const c = ketNoi('http://localhost:19424', { query: { ten }, ...opt });\n  let loi = 0;\n  c.on('connect_error', () => loi++);\n  c.on('tin', (x) => console.log(`${ten}: NHẬN \"${x}\" qua transport ${c.io.engine.transport.name}`));\n  await new Promise((r) => setTimeout(r, 4000));\n  console.log(`${ten}: sau 4 s — connected=${c.connected} · transport=${c.io.engine?.transport?.name ?? '—'} · connect_error ${loi} lần`);\n  c.close();\n}\nprocess.exit(0);\n",
 "n0-2:proxy-chan": "$ node proxy-chan.mjs\n  proxy: chặn upgrade ⇒ server trả 400 {\"code\":3,\"message\":\"Bad request\"}\nmac-dinh: NHẬN \"chào mac-dinh\" qua transport polling\nmac-dinh: sau 4 s — connected=true · transport=polling · connect_error 0 lần\n  proxy: chặn upgrade ⇒ server trả 400 {\"code\":3,\"message\":\"Bad request\"}\n  proxy: chặn upgrade ⇒ server trả 400 {\"code\":3,\"message\":\"Bad request\"}\n  proxy: chặn upgrade ⇒ server trả 400 {\"code\":3,\"message\":\"Bad request\"}\nchi-websocket: sau 4 s — connected=false · transport=websocket · connect_error 3 lần"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, sql, icards, cmp, box, two, steps, kw, c, meter, seq, XANH } from './_sio-chung.mjs';

export const deck = { key: 'sio-00-2', code: 'SIO 0.2', title: 'Why long-polling is still not dead in 2026', sub: 'Section 0 · Lesson 0.2' };
const O = (k) => { const v = DU_LIEU[`n0-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const BYTE = Object.fromEntries(O('overhead').split('\n').map((l) => /^(polling|websocket)\s*: 100 tin ⇒ client→server\s+(\d+) B · server→client\s+(\d+) B · tổng\s+(\d+) B · ([\d.]+) B\/tin/.exec(l)).filter(Boolean).map((m) => [m[1], { len: +m[2], xuong: +m[3], tong: +m[4], moi: +m[5] }]));
const CHU = +O('overhead').match(/\): (\d+) B ⇒/)[1];

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.2', t: 'Why long-polling is<br>still not dead in 2026', sub: 'Every browser speaks WebSocket. The repo still keeps polling on — here is who needs it, and what it costs',
    en: 'Lesson zero point two: why long-polling is still not dead in twenty twenty-six. Every browser speaks WebSocket, yet this repo keeps polling enabled. Who needs it, and what does it cost? We measure both.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The real config, line by line — and what the transports list does NOT mean</li>
    <li>Who still ends up on polling</li>
    <li>What polling costs per message — measured on the wire</li>
    <li>A proxy that strips Upgrade: default client vs websocket-only, measured</li>
    <li>When you may turn polling off — and how to know</li></ul>`,
    en: 'Five takeaways: the real config and what the transports list does not mean; who still ends up on polling; what polling costs per message, measured; a proxy that strips the upgrade, measured with two clients; and when you may turn polling off.' },
  { t: 'The real config in this repo', body: tn(O('cau-hinh'), { fs: 15, wrap: 110 }) + two(
      box('The comment says why', '"WebSocket-only would break users behind corporate proxies that strip the upgrade header." This lesson measures what "break" means.', 'lam'),
      box('25 s / 60 s', `${c('pingInterval: 25000')}, ${c('pingTimeout: 60000')} — a dead peer is noticed after up to 85 s (lesson 0.1).`, '')),
    en: 'The real config, in messaging.socket.ts, lines two hundred eighty-six to two hundred ninety-nine. CORS mirrors any origin, transports lists websocket and polling, and the heartbeat is twenty-five and sixty seconds. The comment explains polling: websocket-only would break users behind proxies that strip the upgrade header.' },
  { t: 'The transports list is NOT the order the client tries', body: tn(O('thu-tu'), { fs: 17, wrap: 100 }) + two(
      box('Server option = what is ALLOWED', `Even with ${c("transports: ['websocket', 'polling']")} on the server, a default client still <b>starts on polling</b> and upgrades — 6 ms later on one machine (one round-trip of YOUR network).`, 'lam'),
      box('Client option = what the client TRIES first', `A client that sets ${c("transports: ['websocket', 'polling']")} itself starts on <b>websocket</b> — and loses the safe first step (and, in a browser, any custom headers — lesson 0.9).`, 'do2')),
    en: 'The transports list on the server is not the order the client tries. With the repo\'s list, a default client still started on polling and upgraded six milliseconds later. Only when the client itself lists websocket first does it start on websocket — losing the safe first step through any proxy.' },
  { t: 'Who still ends up on polling', body: icards([
      ['shield', 'Office proxies & filters', 'Some corporate web filters strip or block the Upgrade header. The upgrade fails; polling keeps working.'],
      ['pulse', 'Weak mobile networks', 'Carrier NAT and flaky links can drop long-lived WebSockets; plain HTTP requests still get through.'],
      ['server', 'Your own misconfigured proxy', 'Nginx without the two Upgrade lines ⇒ every upgrade fails. With polling on, nobody notices — 100 % of users quietly on polling.'],
      ['search', 'Bots & simple HTTP clients', 'They speak only HTTP. Polling lets them connect if you want them to.'],
    ], 2) + box('How many people? Measure, do not quote', 'There is no public, trustworthy percentage. The only number that counts is yours: log <code>socket.conn.transport.name</code> after the upgrade window and count.', 'do2'), to: true,
    en: 'Who still ends up on polling: users behind office proxies that strip the Upgrade header; people on weak mobile networks; everyone, if your own Nginx forgot the two upgrade lines; and bots that speak only HTTP. How many? There is no trustworthy public number; log the transport name and count your own.' },
  { t: 'Measured: what polling costs per message', body: two(meter([
      ['polling — total', BYTE.polling.tong, '#c0392b'], ['websocket — total', BYTE.websocket.tong, XANH], ['the message text itself', CHU, '#1f8a3b']], { don: 'B', nhan: 250, w: 600, rh: 60, fs: 18 }),
      cmp(['Per message', 'polling', 'websocket'], [
        ['on the wire', `${BYTE.polling.moi} B`, `${BYTE.websocket.moi} B`],
        ['of which text', `${(CHU / 100).toFixed(1)} B`, `${(CHU / 100).toFixed(1)} B`],
        ['overhead', `<b>${((BYTE.polling.tong - CHU) / 100).toFixed(0)} B</b>`, `<b>${((BYTE.websocket.tong - CHU) / 100).toFixed(0)} B</b>`],
        ['client → server', `${BYTE.polling.len} B`, `${BYTE.websocket.len} B`],
      ])) + tn(O('overhead'), { fs: 15, wrap: 112 }) +
    box('Why ~10×', 'With polling every message rides a full HTTP request/response (headers, a new GET to wait for the next one, a POST for each reply) — ~337 B around a 35 B message. A WebSocket frame header is 2 B. A browser adds cookies and a User-Agent, so real polling is heavier still.', ''),
    en: 'Measured on the wire with a byte-counting TCP proxy: one hundred small messages from server to client. Polling moved thirty-seven thousand bytes, websocket under three thousand seven hundred; the message text itself was three thousand four hundred ninety-two. Per message, polling spent about three hundred thirty-seven bytes of overhead, websocket two: roughly ten times the total.' },
  { t: 'Measured: a proxy that strips Upgrade', body: seq(['client', 'office proxy', 'socket.io server'], [
      [0, 1, 'GET …transport=polling', '#1f8a3b'], [1, 2, 'forwarded as-is', '#1f8a3b'], [0, 1, 'GET …transport=websocket + Upgrade', '#2563eb'],
      [1, 2, 'Upgrade + Connection REMOVED', '#c0392b'], [2, 1, '400 {"code":3,"message":"Bad request"}', '#c0392b', true]], { rh: 38, fs: 17 }) +
    tn(O('proxy-chan'), { fs: 14, wrap: 118 }),
    en: 'Measured: a small proxy that removes the Upgrade and Connection headers, like some office filters. The server answers the stripped request with four hundred, bad request. The default client quietly stayed on polling and still received its message. The websocket-only client failed to connect three times in four seconds and never connected.' },
  { t: 'Your own Nginx can do the same thing', body: sql(`location /socket.io/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;   # without these two lines,
    proxy_set_header Connection "upgrade";    # every upgrade fails
}`, { lang: 'nginx', hl: [4, 5] }) + two(
      box('Why you would never notice', 'With polling enabled, the failed upgrade is silent: users keep chatting over polling, at ~10× the bytes. The Nginx course measures exactly this (lesson 3.5).', 'do2'),
    box('Check it in one command', `In DevTools → Network → WS: no WebSocket row while chat still works ⇒ you are on polling. Server side: ${c("socket.conn.transport.name === 'polling'")} long after connect.`, 'lam')), to: true,
    en: 'Your own Nginx can do the same thing. Without the two proxy_set_header lines for Upgrade and Connection, every upgrade fails. With polling on, nothing visibly breaks: users keep chatting over polling, at about ten times the bytes. Check it: no WebSocket row in DevTools while chat still works means you are on polling.' },
  { t: 'Detect clients stuck on polling', body: two(js(`io.on('connection', (socket) => {
  logger.info('connected', {
    transport: socket.conn.transport.name, // "polling" | "websocket"
    ip: socket.handshake.address,
  });
  socket.conn.on('upgrade', (t) => {
    logger.info('upgraded', { transport: t.name });
  });
});`, { sm: true }), steps([
      'Log the transport at connect AND on upgrade',
      'After a few seconds, count sockets still on <code>polling</code>',
      'Watch the number for weeks, per network/region if you can',
      'Only a measured, tiny, stable number justifies turning polling off',
    ]), 'r64') + box('What "stuck" looks like', `A socket whose ${c('transport.name')} is still <code>polling</code> seconds after connect, with no <code>upgrade</code> log line. On the course machine the upgrade took 6 ms; on a real network expect one round-trip.`, 'lam'), to: true,
    en: 'Detect clients stuck on polling: log the transport name at connect and on upgrade, count the sockets still on polling a few seconds later, and watch that number over weeks. Only a measured, tiny, stable number justifies turning polling off.' },
  { t: 'When you may turn polling off', body: cmp(['Situation', 'Turn polling off?', 'Why'], [
      ['Internal app, you control every proxy', '✓ possible', 'no unknown network in the path'],
      ['Native mobile endpoint', '✓ possible', 'native WebSocket stacks rarely pass office proxies'],
      ['You measured ~0 % on polling for weeks', '✓ possible', 'your own number, not a forum post'],
      ['Public web app, unknown networks', '✗ keep it', 'the users who need it are the ones you cannot test from your desk'],
    ], { hl: [3] }) + box('The bug you cannot reproduce', `Switching to ${c("transports: ['websocket']")} works perfectly on your machine — and some users report "no new messages". Logs say "ping timeout". The way back is a rollback.`, 'do2'), to: true,
    en: 'When you may turn polling off: an internal app where you control every proxy; a native mobile endpoint; or when you have measured almost zero percent on polling for weeks. For a public web app on unknown networks, keep it. Otherwise you ship a bug you cannot reproduce at your desk.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Long-polling', 'HTTP fallback: the server holds each request until it has data'), kw('Transport upgrade', 'polling → websocket on an open connection'),
      kw('transports (server)', 'which transports are ALLOWED'), kw('transports (client)', 'which one the client TRIES first'),
      kw('Upgrade: websocket', 'the handshake header a proxy can strip'), kw('Overhead', 'bytes on the wire that are not your message'), kw('conn.transport.name', 'where a socket is right now'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: long-polling; transport upgrade; the transports option on the server, what is allowed, and on the client, what is tried first; the Upgrade header; overhead; and conn.transport.name.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Server with ${c("transports: ['websocket', 'polling']")}; log ${c('socket.conn.transport.name')} and ${c("socket.conn.on('upgrade')")}`,
      'Connect a default client: see polling first, then the upgrade',
      `Put a header-stripping proxy in between (or an Nginx without the Upgrade lines); try a default client and a ${c("transports: ['websocket']")} client`,
      'Count bytes for 100 messages on each transport',
    ]), box('Keep these', `<ul><li>Default clients always start on polling, then upgrade</li><li>Polling ≈ 10× the bytes, but it still WORKS</li><li>Stripped Upgrade: default client survives, websocket-only dies</li><li>Turn polling off only after measuring</li></ul>`, 'lam'), ''),
    en: 'Your turn: log the transport and the upgrade on a server; watch a default client start on polling; put a header-stripping proxy in between and compare a default client with a websocket-only one; and count the bytes. Keep: clients start on polling; polling costs about ten times the bytes but works; behind a stripping proxy only the default client survives; measure before turning polling off.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Socket.IO really is', bai: '0.2' }, S);
