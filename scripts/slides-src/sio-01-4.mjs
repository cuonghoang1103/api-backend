/**
 * sio-01-4 — Socket.IO · Chapter 1 · Lesson 1.4 "Authentication: middleware runs BEFORE connection" (deck video + web, 13/11/2026).
 * Bài web: io-1-4-auth. Output THẬT (scratchpad/sio/demo/n1-4.txt · socket.io 4.8.3 · Node 22.23.3, Mac + Chromium Playwright):
 * mw: extractToken ba chỗ (auth · Authorization · cookie) đều connect; token sai ⇒ connect_error "unauthorized" active=false; không token ⇒ "missing token";
 * nem: middleware async NÉM (JSON.parse) ⇒ unhandled rejection ⇒ TIẾN TRÌNH SERVER CHẾT exit 1 (bài web nói "wrap thành connect_error" — SAI);
 * treo: quên next() ⇒ engine mở ngay, 45,0 s sau "transport close" (connectTimeout mặc định), active=true ⇒ thử lại vô tận;
 * url: ?token= nằm trong MỌI dòng access log (5 dòng), auth: { token } chỉ trong thân gói CONNECT 0{"token":…};
 * trang (Chromium): extraHeaders + transports ['websocket'] ⇒ header bị vứt ⇒ ↓44{"message":"missing token"} (sự cố thật 110097d08); auth ⇒ ↑40{"token":…} connect.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-4:file:xac-thuc.mjs": "// io.use() đọc token từ BA chỗ qua MỘT hàm (như extractToken() của kho) — rồi xem client thấy gì khi qua và khi bị từ chối\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst NGUOI = { 'tok-lan': { userId: 7, ten: 'lan' } };                       // \"cơ sở dữ liệu\" token giả\nconst docCookie = (h = '') => Object.fromEntries(h.split(';').filter(Boolean).map((p) => p.trim().split('=')));\nfunction extractToken({ cookies, headers, auth }) {                           // một hàm, ba chỗ — thứ tự như middleware Express\n  return cookies.token ?? headers.authorization?.replace(/^Bearer /, '') ?? auth?.token;\n}\nconst io = new Server(19471);\nio.use((socket, next) => {\n  const token = extractToken({ cookies: docCookie(socket.request.headers.cookie), headers: socket.request.headers, auth: socket.handshake.auth });\n  if (!token) return next(new Error('missing token'));\n  const u = NGUOI[token];\n  if (!u) return next(new Error('unauthorized'));\n  socket.data.user = u; next();\n});\nio.on('connection', (s) => console.log(`   server: connection — userId=${s.data.user.userId}`));\nconst thu = (ten, opts) => new Promise((xong) => {\n  console.log(ten);\n  const c = ketNoi('http://localhost:19471', { ...opts, reconnectionDelay: 300 });\n  c.on('connect', () => { console.log('   client: connect'); c.close(); setTimeout(xong, 50); });\n  c.on('connect_error', (e) => { console.log(`   client: connect_error \"${e.message}\" · active=${c.active}`); setTimeout(() => { c.close(); xong(); }, 600); });\n  c.on('disconnect', (r) => r !== 'io client disconnect' && console.log('   client: disconnect', r));\n});\nawait thu('1) auth: { token }', { auth: { token: 'tok-lan' } });\nawait thu('2) header Authorization: Bearer …', { extraHeaders: { authorization: 'Bearer tok-lan' } });\nawait thu('3) cookie token=…', { extraHeaders: { cookie: 'theme=dark; token=tok-lan' } });\nawait thu('4) token sai', { auth: { token: 'tok-gia' } });\nawait thu('5) không có token', {});\nio.close(); process.exit(0);\n",
 "n1-4:mw": "$ node xac-thuc.mjs\n1) auth: { token }\n   server: connection — userId=7\n   client: connect\n2) header Authorization: Bearer …\n   server: connection — userId=7\n   client: connect\n3) cookie token=…\n   server: connection — userId=7\n   client: connect\n4) token sai\n   client: connect_error \"unauthorized\" · active=false\n5) không có token\n   client: connect_error \"missing token\" · active=false",
 "n1-4:file:nem.mjs": "// Middleware NÉM lỗi (quên try/catch quanh verifyToken) — socket.io có biến nó thành connect_error không? Server chạy ở tiến trình con.\nimport { spawn } from 'node:child_process';\nimport { io as ketNoi } from 'socket.io-client';\nconst SV = \"const io=new (require('socket.io').Server)(19472);io.use(async(s,next)=>{JSON.parse(s.handshake.auth.token);next()});io.on('connection',()=>console.log('   server: connection'))\";\nconst sv = spawn('node', ['-e', SV], { stdio: ['ignore', 'pipe', 'pipe'] });\nconst t0 = Date.now(), T = () => ((Date.now() - t0) / 1000).toFixed(2).padStart(5) + ' s';\nsv.stderr.on('data', (d) => { const l = String(d).split('\\n').find((x) => /Error/.test(x)); if (l) console.log(T(), '   server stderr:', l.trim()); });\nsv.on('exit', (code) => console.log(T(), `   server: TIẾN TRÌNH CHẾT — exit code ${code}`));\nawait new Promise((r) => setTimeout(r, 500));\nconst c = ketNoi('http://localhost:19472', { auth: { token: 'không-phải-json' }, reconnection: false });\nc.on('connect', () => console.log(T(), 'client: connect'));\nc.on('connect_error', (e) => console.log(T(), `client: connect_error \"${e.message}\"`));\nc.on('disconnect', (r) => console.log(T(), `client: disconnect \"${r}\"`));\nawait new Promise((r) => setTimeout(r, 1500));\nprocess.exit(0);\n",
 "n1-4:nem": "$ node nem.mjs\n 0.53 s    server stderr: SyntaxError: Unexpected token 'k', \"không-phải-json\" is not valid JSON\n 0.53 s    server: TIẾN TRÌNH CHẾT — exit code 1\n 0.53 s client: connect_error \"xhr poll error\"\n 0.53 s client: disconnect \"transport error\"",
 "n1-4:file:treo.mjs": "// Middleware QUÊN gọi next() — client chờ bao lâu, và thấy gì? (connectTimeout mặc định của server)\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19473);\nio.use(async (socket, next) => { if (socket.handshake.auth.token === 'tok-lan') { /* …quên next() ở nhánh thành công */ } else next(new Error('unauthorized')); });\nconst t0 = Date.now(), T = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(5) + ' s';\nconst c = ketNoi('http://localhost:19473', { auth: { token: 'tok-lan' } });\nc.io.engine.on('open', () => console.log(T(), 'client: engine.io đã mở (tầng 2 OK) — chờ socket.io CONNECT…'));\nc.on('connect', () => console.log(T(), 'client: connect'));\nc.on('connect_error', (e) => console.log(T(), `client: connect_error \"${e.message}\"`));\nc.on('disconnect', (r) => console.log(T(), `client: disconnect \"${r}\" · connected=${c.connected} · active=${c.active}`));\nc.io.on('reconnect_attempt', (n) => { console.log(T(), `client: reconnect_attempt ${n} — và vòng lặp bắt đầu lại`); c.close(); io.close(); process.exit(0); });\n",
 "n1-4:treo": "$ node treo.mjs\n  0.0 s client: engine.io đã mở (tầng 2 OK) — chờ socket.io CONNECT…\n 45.0 s client: disconnect \"transport close\" · connected=false · active=true\n 46.2 s client: reconnect_attempt 1 — và vòng lặp bắt đầu lại",
 "n1-4:file:url.mjs": "// Token trong URL vs trong auth: cái nào lọt vào access log? Đặt một proxy ghi log (như nginx) trước server.\nimport net from 'node:net';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst io = new Server(19474);\nio.engine.on('connection', (raw) => raw.on('packet', (p) => p.type === 'message' && p.data.startsWith('0') && console.log(`   gói CONNECT (thân request): ${p.data}`)));\nconst proxy = net.createServer((a) => { const b = net.connect(19474); a.on('data', (d) => { const l = String(d).split('\\r\\n')[0]; if (/^(GET|POST) /.test(l)) console.log(`   access.log: ${l.replace(/&t=[^& ]+/, '').replace(/ HTTP\\/1\\.1$/, '')}`); }); a.pipe(b).pipe(a); a.on('error', () => {}); b.on('error', () => {}); }).listen(19475);\nfor (const [ten, url, opts] of [['A) io(\"…/?token=tok-lan\")', 'http://localhost:19475/?token=tok-lan', {}], ['B) io(\"…\", { auth: { token } })', 'http://localhost:19475', { auth: { token: 'tok-lan' } }]]) {\n  console.log(ten);\n  const c = ketNoi(url, { ...opts, forceNew: true });\n  await new Promise((r) => c.on('connect', r)); await new Promise((r) => setTimeout(r, 300)); c.close();\n  await new Promise((r) => setTimeout(r, 100));\n}\nio.close(); proxy.close(); process.exit(0);\n",
 "n1-4:url": "$ node url.mjs\nA) io(\"…/?token=tok-lan\")\n   access.log: GET /socket.io/?token=tok-lan&EIO=4&transport=polling\n   access.log: POST /socket.io/?token=tok-lan&EIO=4&transport=polling&sid=1zsQot5Tub6elJefAAAA\n   access.log: GET /socket.io/?token=tok-lan&EIO=4&transport=websocket&sid=1zsQot5Tub6elJefAAAA\n   access.log: GET /socket.io/?token=tok-lan&EIO=4&transport=polling&sid=1zsQot5Tub6elJefAAAA\n   gói CONNECT (thân request): 0\n   access.log: GET /socket.io/?token=tok-lan&EIO=4&transport=polling&sid=1zsQot5Tub6elJefAAAA\nB) io(\"…\", { auth: { token } })\n   access.log: GET /socket.io/?EIO=4&transport=polling\n   access.log: POST /socket.io/?EIO=4&transport=polling&sid=bzw8zaKQQQU5l638AAAB\n   access.log: GET /socket.io/?EIO=4&transport=websocket&sid=bzw8zaKQQQU5l638AAAB\n   gói CONNECT (thân request): 0{\"token\":\"tok-lan\"}\n   access.log: GET /socket.io/?EIO=4&transport=polling&sid=bzw8zaKQQQU5l638AAAB",
 "n1-4:file:trang14.mjs": "// Sự cố THẬT của kho (110097d08): extraHeaders + transports: ['websocket'] trong trình duyệt ⇒ header bị vứt ⇒ \"ngoại tuyến mãi\"\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { Server } from 'socket.io';\nconst srv = http.createServer((req, res) => { if (req.url === '/') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(readFileSync('trang14.html')); } });\nconst io = new Server(srv);\nio.use((s, next) => {\n  const h = s.handshake.headers.authorization, a = s.handshake.auth.token;\n  console.log(`server: handshake transport=${s.conn.transport.name} · authorization=${h ?? '(KHÔNG CÓ)'} · auth.token=${a ?? '(KHÔNG CÓ)'}`);\n  (h || a) ? next() : next(new Error('missing token'));\n});\nsrv.listen(19476, () => console.log('trang ở http://localhost:19476'));\n",
 "n1-4:file:trang14.html": "<!doctype html><html><head><meta charset=\"utf-8\"><title>token trong trình duyệt</title>\n<style>body{font:18px/1.5 system-ui;margin:24px;background:#f8fafc}h1{font-size:22px;margin:0 0 12px}pre{background:#0b1018;color:#e6edf3;padding:14px 18px;border-radius:10px;font:16px/1.6 Consolas,monospace}</style></head>\n<body><h1>⚡ gửi token từ trình duyệt — ba cách</h1><pre id=\"log\"></pre>\n<script src=\"/socket.io/socket.io.js\"></script>\n<script>\nconst log = (s) => (document.getElementById('log').textContent += s + '\\n');\nconst CACH = [\n  ['1) extraHeaders, transport mặc định', { extraHeaders: { authorization: 'Bearer tok-lan' } }],\n  [\"2) extraHeaders + transports: ['websocket']\", { extraHeaders: { authorization: 'Bearer tok-lan' }, transports: ['websocket'] }],\n  [\"3) auth: { token } + transports: ['websocket']\", { auth: { token: 'tok-lan' }, transports: ['websocket'] }],\n];\n(async () => {\n  for (const [ten, opts] of CACH) {\n    await new Promise((xong) => {\n      const s = io({ ...opts, forceNew: true, reconnection: false });\n      s.on('connect', () => { log(ten + ' → connect ✓'); s.close(); setTimeout(xong, 200); });\n      s.on('connect_error', (e) => { log(ten + ' → connect_error \"' + e.message + '\" ✗'); s.close(); setTimeout(xong, 200); });\n    });\n  }\n})();\n</script></body></html>\n",
 "n1-4:trang": "$ node /Users/admin/Documents/video-bai-giang/scratchpad/sio/anh.mjs /Users/admin/Documents/video-bai-giang/scratchpad/sio/spec/sio-1-4.json\n✓ trang  http://localhost:19476/  mạng 8 · console 0\ntrang ở http://localhost:19476\nserver: handshake transport=polling · authorization=Bearer tok-lan · auth.token=(KHÔNG CÓ)\nserver: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=(KHÔNG CÓ)\nserver: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=tok-lan",
 "n1-4:ws": "[[\"↓\", \"0{\\\"sid\\\":\\\"rqSfF5KUkn_6PitYAAAB\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":20000,\\\"maxPayload\\\":1000000}\", 264], [\"↑\", \"40\", 264], [\"↓\", \"44{\\\"message\\\":\\\"missing token\\\"}\", 264], [\"×\", \"close\", 265], [\"↓\", \"0{\\\"sid\\\":\\\"ABqsOh0CBh_rvV1eAAAC\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":20000,\\\"maxPayload\\\":1000000}\", 468], [\"↑\", \"40{\\\"token\\\":\\\"tok-lan\\\"}\", 468], [\"↓\", \"40{\\\"sid\\\":\\\"_d-RP3-VFl9pum9jAAAC\\\"}\", 469], [\"↑\", \"41\", 469], [\"×\", \"close\", 469]]"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, js, cmp, box, two, steps, kw, c, wire, br, path, vsd } from './_sio-chung.mjs';

export const deck = { key: 'sio-01-4', code: 'SIO 1.4', title: 'Authentication: middleware runs BEFORE connection', sub: 'Chapter 1 · Lesson 1.4' };
const O = (k) => { const v = DU_LIEU[`n1-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const WS = JSON.parse(O('ws'));
const SVLOG = O('trang').split('\n').filter((l) => l.startsWith('server: handshake'));

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.4', t: 'Authentication:<br>middleware runs BEFORE connection', sub: 'Three places for a token, one function — and what the client sees when you say no',
    en: 'Lesson one point four: authentication. The middleware runs before connection. Three places a token can live, one function to read them, and what the client sees when you say no.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>${c('io.use()')} + one shared ${c('extractToken()')}: cookie, header, handshake.auth</li>
    <li>A rejection is <b>connect_error</b> — never <code>disconnect</code> — and it is packet <code>44</code></li>
    <li>A middleware that THROWS does not reject: it can kill the whole server</li>
    <li>A middleware that never calls ${c('next()')}: 45 s of nothing, then an endless loop</li>
    <li>Tokens in the URL end up in every access-log line; in the browser, headers vanish on WebSocket</li></ul>`,
    en: 'Five takeaways: io.use with one shared extractToken; a rejection is connect error, never disconnect; a middleware that throws can kill the whole server; a middleware that never calls next gives forty-five seconds of nothing then a loop; and where tokens must not go.' },
  { t: 'One function, three places', body: two(js(`function extractToken({ cookies, headers, auth }) {
  return cookies.token                         // 1. cookie
    ?? headers.authorization?.slice(7)        // 2. Bearer …
    ?? auth?.token;                            // 3. auth
}

io.use((socket, next) => {
  const token = extractToken({
    cookies: parseCookie(socket.request.headers.cookie),
    headers: socket.request.headers,
    auth: socket.handshake.auth,
  });
  if (!token) return next(new Error('missing token'));
  const user = lookup(token);
  if (!user) return next(new Error('unauthorized'));
  socket.data.user = user;
  next();
});`, { sm: true, hl: [7, 13, 15, 17] }), steps([
      'The SAME <code>extractToken()</code> the Express middleware uses — change the rules once, both follow',
      'Reject with <code>next(new Error(…))</code>: the message reaches the client',
      `Accept: put the user in ${c('socket.data')}, then <code>next()</code>`,
      `Only after that does ${c("io.on('connection')")} run`,
    ]), 'r64'), to: true,
    en: 'One function, three places: the same extractToken the Express middleware uses reads the httpOnly cookie, then the Authorization header, then handshake.auth. Reject by calling next with an error, whose message reaches the client. Accept by storing the user in socket.data and calling next. Only then does connection run.' },
  { t: 'Measured: five clients at the door', body: two(tn(O('mw'), { fs: 17, wrap: 70 }), '<div>' +
      box('All three places work', 'auth, the Authorization header and the cookie each produced <code>connection</code> with userId 7 — from Node, where headers are free to set.', 'la2') +
      box('A rejection is connect_error', `Wrong token ⇒ ${c('connect_error "unauthorized"')}; none ⇒ ${c('"missing token"')}. <code>active=false</code>: the client does NOT retry, and the server's <code>connection</code> never ran.`, 'do2') + '</div>', 'r64'), to: true,
    en: 'Measured: five clients at the door. Token in auth, in the Authorization header, or in a cookie: all three connected as user seven. A wrong token gives connect error unauthorized; no token gives missing token. In both cases active is false, so the client does not retry, and the server connection handler never ran.' },
  { t: 'In a real browser: where the header goes missing', body: two(wire(WS.map(([h, chu, t]) => [h, chu, `${t} ms · ${/^0\{/.test(chu) ? 'engine.io OPEN' : chu === '40' ? 'CONNECT — no token in the body' : /^40\{"token/.test(chu) ? 'CONNECT with auth in the body' : /^44/.test(chu) ? 'CONNECT_ERROR from next(err)' : /^40\{"sid/.test(chu) ? 'CONNECT accepted' : chu === '41' ? 'DISCONNECT (closed by the page)' : 'socket closed'}`]), { fs: 15, w: 590, max: 38 }),
    '<div>' + br('sio-01-4', 'trang', { url: 'localhost:19476 · Chromium', vp: 960, h: 180, w: 400 }) + box('This repo, 17/09 (110097d08)', `${c('extraHeaders')} + ${c("transports: ['websocket']")}: the browser's WebSocket API cannot set headers, so the token was dropped — the desktop app stayed “offline” for a day. Fix: ${c('auth: { token }')} travels in the CONNECT body on every transport.`, 'do2') + '</div>', 'r64'), to: true,
    en: 'In a real browser: with extraHeaders and websocket only, the handshake arrives without the Authorization header, the client sends a CONNECT with no token, and the server answers packet forty-four, connect error, missing token. This was a real outage in this repo. With auth token, the token travels inside the CONNECT packet on every transport.' },
  { t: 'Measured: a middleware that THROWS kills the server', body: tn(O('nem'), { fs: 18, wrap: 100 }) + vsd(js(`io.use(async (socket, next) => {
  const p = verify(socket.handshake.auth.token);
  socket.data.userId = p.userId;   // ↑ throws
  next();
});`, { sm: true }), js(`io.use(async (socket, next) => {
  try {
    const p = verify(socket.handshake.auth.token);
    socket.data.userId = p.userId;
    next();
  } catch (err) {
    logger.warn({ err }, 'auth failed');
    next(new Error('unauthorized'));
  }
});`, { sm: true }), '✗ one bad token ⇒ unhandled rejection ⇒ process exits', '✓ every path ends in next()'),
    en: 'Measured: a middleware that throws. One client sends a token that is not valid JSON, the async middleware throws, and the error is not turned into connect error: it becomes an unhandled rejection and the whole server process exits with code one. Every user is disconnected. Wrap the body in try catch and end every path in next.' },
  { t: 'Measured: forget next() — 45 s of nothing', body: tn(O('treo'), { fs: 18, wrap: 100 }) + two(
      box('What the user sees', 'The engine.io pipe opens at once (layer 2 is fine), the socket.io CONNECT is never answered. After the server\'s <code>connectTimeout</code> (45 s by default) the pipe is closed: <code>transport close</code>, <code>active=true</code> ⇒ retry ⇒ the same 45 s again. Forever.', 'do2'),
      box('Not what the web page said', `There is no ${c('connect_error')} with "timeout" here — just a disconnect from a socket that never connected. Look for a missing ${c('next()')} whenever a client "never connects".`, 'lam')),
    en: 'Measured: forget to call next. The engine.io pipe opens immediately, but the socket.io connect is never answered. After the server connect timeout, forty-five seconds by default, the pipe closes with transport close, active stays true, and the client retries into the same wait. Forever. A client that never connects often means a missing next.' },
  { t: 'Client side: not every connect_error means logout', body: two(js(`const socket = io(url, { auth: { token: getJwt() } });

socket.on('connect_error', (err) => {
  if (err.message === 'unauthorized') {
    logout();              // the server said no
  } else if (socket.active) {
    showBanner('reconnecting…'); // network
  }
});`, { hl: [4, 6] }), cmp(['err.message', 'from', 'action'], [
      [c('unauthorized'), 'your next(err)', 'logout / refresh the token'], [c('missing token'), 'your next(err)', 'send the user to login'],
      [c('xhr poll error'), 'network', 'keep trying (active = true)'], [c('websocket error'), 'network', 'keep trying'],
    ]), 'r64'), to: true,
    en: 'Client side: not every connect error means logout. The same event fires for your rejection and for network failures. Branch on the message: unauthorized means log out or refresh the token; xhr poll error or websocket error means the network, so keep trying. Otherwise a five-second Wi-Fi drop sends the user back to the login page.' },
  { t: 'Trap: the token in the URL', body: tn(O('url'), { fs: 15, wrap: 110 }) + two(
      box('?token= is in EVERY request line', 'Every polling GET and POST and the WebSocket upgrade carry it — nginx, load balancers and proxies write it to access logs, which live far longer than the token.', 'do2'),
      box('auth: { token } stays out of the URL', `It travels in the CONNECT packet body: ${c('0{"token":"…"}')}. Or use an httpOnly cookie. Never the query string.`, 'la2')),
    en: 'The trap: a token in the URL. Behind a logging proxy, the query-string token appears on every request line: each polling GET and POST and the WebSocket upgrade. Access logs keep it far longer than the token lives. With auth token, it only travels in the body of the CONNECT packet.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('io.use()', 'connection middleware, runs BEFORE connection'), kw('extractToken()', 'one function: cookie, Authorization, handshake.auth'),
      kw('handshake.auth', 'client-supplied object, sent in the CONNECT body'), kw('next(err)', 'rejects — the client gets connect_error (packet 44)'),
      kw('connectTimeout', 'server closes a socket that never joined: 45 s'), kw('Auth vs network error', 'logout on one, retry on the other'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: io.use; extractToken; handshake.auth; next with an error, which the client receives as connect error, packet forty-four; connectTimeout; and the difference between an auth error and a network error.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add an ${c('io.use()')} that reads the token through one ${c('extractToken()')}`,
      'Connect with a wrong token: confirm connect_error, not disconnect',
      'Make it throw once without try/catch — watch the process; then fix it',
      'In the client, logout only on "unauthorized"; keep retrying otherwise',
    ]), box('Keep these', `<ul><li>Middleware runs before connection</li><li>Reject = next(err) = connect_error</li><li>Never let it throw; never forget next()</li><li>auth: { token } or httpOnly cookie — not the URL</li></ul>`, 'lam'), ''),
    en: 'Your turn: add a middleware with one extractToken; connect with a wrong token and see connect error; make it throw once and watch the process die, then fix it; and in the client, log out only on unauthorized. Keep: reject with next error; never throw; never forget next; no tokens in URLs.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The lifecycle of one connection', bai: '1.4' }, S);
