/**
 * sio-10-2 — Socket.IO · Chapter 10 · Lesson 10.2 "Q1: is the client connected?" (deck video + web, 14/11/2026).
 * Bài web: io-10-2-q1. Output THẬT (scratchpad/sio/demo/n10-2.txt · lab ~/.rtq-sio/lab/c10: may102.mjs = middleware CHÉP LOGIC messaging.socket.ts:372-406;
 * q1.mjs = client ĐẶT NHƯ frontend/src/lib/socket.ts:115 (transports ['websocket','polling'], timeout 10000); proxy102.mjs 404 | catup | thong | den; q1den.mjs hố đen; Chromium thật):
 * auth: 6 kiểu từ chối ⇒ connect_error đúng chữ của kho, active=false, 0 lần thử lại; Chromium: WS mở (0{…}) ↑40 ↓44{"message":…} — KHÔNG có 403.
 * mang: server tắt / 404 / proxy bỏ Upgrade ⇒ CÙNG "websocket error" (chỉ description khác: 404/400); tường lửa nuốt ⇒ "timeout" sau 10 s;
 *       proxy bỏ Upgrade + client kiểu kho ⇒ KHÔNG BAO GIỜ nối (không lùi về polling — tryAllTransports mặc định false) = LỖI KHO; client mặc định / tryAllTransports ⇒ polling.
 * den: hố đen 3 s sau khi nối ⇒ socket.connected = true thêm ~82 s, 8 emit không lỗi, server nhận 0; ping timeout ở 85 s cả hai phía.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-2:kho": "$ sed -n '115,123p' frontend/src/lib/socket.ts            # client của kho đặt gì\n    const s = io(url, {\n      path: '/socket.io',\n      transports: ['websocket', 'polling'],\n      withCredentials: true,\n      auth: token ? { token } : undefined,\n      reconnection: true,\n      reconnectionDelay: 1000,\n      reconnectionDelayMax: 8000,\n      timeout: 10000,\n$ sed -n '352,354p' src/socket/messaging.socket.ts         # server của kho tin điều gì\n    // Long-poll fallback is enabled by default; WebSocket-only would\n    // break users behind corporate proxies that strip the upgrade header.\n    transports: ['websocket', 'polling'],\n$ grep -rn \"tryAllTransports\" src frontend/src | wc -l\n       0\n$ sed -n '372,409p' src/socket/messaging.socket.ts | grep -c \"logger\"     # middleware + connection: dòng log nào?\n0\n$ grep -rn \"socket connected\" src | wc -l                # dòng bài web bảo grep\n       0",
 "n10-2:auth": "$ node q1.mjs auth\ntoken đúng                   ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket\nkhông token                  ✗ connect_error sau 5 ms: \"No authentication token provided\" · type - · 1 lần trong 6 s\ntoken hết hạn                ✗ connect_error sau 3 ms: \"jwt expired\" · type - · 1 lần trong 6 s\ntoken ký sai bí mật          ✗ connect_error sau 3 ms: \"invalid signature\" · type - · 1 lần trong 6 s\ntoken rác                    ✗ connect_error sau 3 ms: \"jwt malformed\" · type - · 1 lần trong 6 s\ntài khoản bị khoá            ✗ connect_error sau 2 ms: \"Invalid session\" · type - · 1 lần trong 6 s\nđổi mật khẩu (roleVersion cũ) ✗ connect_error sau 2 ms: \"Session has been invalidated\" · type - · 1 lần trong 6 s\n$ # log server (kho không log khi nối hay khi từ chối)\nnghe :19960",
 "n10-2:mang": "$ node q1.mjs mang\nserver tắt (cổng trống)      ✗ connect_error sau 10 ms: \"websocket error\" · type TransportError · 3 lần trong 6 s\n                               description: \nproxy: /socket.io/ ⇒ 404     ✗ connect_error sau 4 ms: \"websocket error\" · type TransportError · 3 lần trong 6 s\n                               description: Unexpected server response: 404\nproxy: bỏ header Upgrade     ✗ connect_error sau 15 ms: \"websocket error\" · type TransportError · 4 lần trong 12 s\n                               description: Unexpected server response: 400\ntường lửa nuốt gói           ✗ connect_error sau 10002 ms: \"timeout\" · type - · 1 lần trong 12 s\nproxy đúng                   ✓ connect sau 8 ms · transport websocket · lúc 6 s: websocket\n$ node q1.mjs macdinh      # cùng hai proxy, client MẶC ĐỊNH của thư viện (polling trước)\nmặc định · proxy bỏ Upgrade  ✓ connect sau 25 ms · transport polling · lúc 6 s: polling\nmặc định · proxy đúng        ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket",
 "n10-2:den": "$ node q1den.mjs      # mạng chết kiểu đóng nắp laptop: không byte nào qua, không ai đóng kết nối\n  0.0 s  [client] connect · transport websocket\n  3.0 s  ── mạng chết (hố đen): không byte nào qua, không ai đóng kết nối ──\n 10.0 s  [client] socket.connected = true · emit \"tin\" #1 không lỗi · server đã nhận 0\n 20.0 s  [client] socket.connected = true · emit \"tin\" #2 không lỗi · server đã nhận 0\n 30.0 s  [client] socket.connected = true · emit \"tin\" #3 không lỗi · server đã nhận 0\n 40.0 s  [client] socket.connected = true · emit \"tin\" #4 không lỗi · server đã nhận 0\n 50.0 s  [client] socket.connected = true · emit \"tin\" #5 không lỗi · server đã nhận 0\n 60.0 s  [client] socket.connected = true · emit \"tin\" #6 không lỗi · server đã nhận 0\n 70.1 s  [client] socket.connected = true · emit \"tin\" #7 không lỗi · server đã nhận 0\n 80.1 s  [client] socket.connected = true · emit \"tin\" #8 không lỗi · server đã nhận 0\n 85.0 s  [client] disconnect: ping timeout · connected = false\n 85.0 s  [server] disconnect: ping timeout\ntổng: client emit 8 tin trong lúc connected = true · server nhận 0",
 "n10-2:quen": "$ node q1.mjs quen\nmiddleware quên next()       ✗ chưa connect\n                               disconnect \"transport close\" @45035 ms\n                               (không connect, không connect_error trong 50 s)",
 "n10-2:ws_notoken": "[{\"huong\":\"↓\",\"chu\":\"0{\\\"sid\\\":\\\"gPKi7mh2KPtg-ry7AAAN\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":60000,\\\"maxPayload\\\":1000000}\"},{\"huong\":\"↑\",\"chu\":\"40\"},{\"huong\":\"↓\",\"chu\":\"44{\\\"message\\\":\\\"No authentication token provided\\\"}\"},{\"huong\":\"×\",\"chu\":\"close\"}]",
 "n10-2:ws_catup": "[{\"huong\":\"×\",\"chu\":\"close\"},{\"huong\":\"×\",\"chu\":\"close\"},{\"huong\":\"×\",\"chu\":\"close\"}]",
 "n10-2:ws_catupfix": "[{\"huong\":\"×\",\"chu\":\"close\"}]"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, path, meter, wire, br } from './_sio-chung.mjs';

export const deck = { key: 'sio-10-2', code: 'SIO 10.2', title: 'Q1: is the client connected?', sub: 'Chapter 10 · Lesson 10.2' };
const O = (k) => { const v = DU_LIEU[`n10-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), AUTH = O('auth'), MANG = O('mang'), DEN = O('den');
const WS_NO = JSON.parse(O('ws_notoken'));
const giay = (re) => +m(re, DEN)[1].replace(',', '.');
const tDen = giay(/([\d.]+) s\s+── mạng chết/), tDisc = giay(/([\d.]+) s\s+\[client\] disconnect/);
const soEmit = +m(/client emit (\d+) tin/, DEN)[1], svNhan = +m(/server nhận (\d+)\s*$/m, DEN)[1];
const timeoutMs = +m(/tường lửa nuốt gói\s+✗ connect_error sau (\d+) ms/, MANG)[1];
const bo = (txt, re) => txt.split('\n').filter((l) => !re.some((r) => r.test(l))).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.2', t: 'Q1: is the client connected?', sub: 'Four checks in order — run against this repo’s middleware and its real client settings. One of them never connects.',
    en: 'Lesson ten point two: question one, is the client connected? Four checks in order, run against this repo’s middleware and its real client settings.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four Q1 checks, in order, and what each one can and cannot tell you</li>
    <li>An auth refusal is <b>not</b> a red 403 — what it really looks like on the wire</li>
    <li>Three different network faults that print the <b>same</b> error</li>
    <li>A real bug: this repo’s client never falls back to polling</li>
    <li>Why <code>socket.connected</code> said true for 80 seconds after the network died</li></ul>`,
    en: 'Five takeaways: the four checks; what an auth refusal really looks like; three faults with the same error; a real bug in this repo’s client; and why socket connected kept saying true.' },
  { t: 'Four checks, in order', to: true, body: path([
      { t: 'DevTools WS', s: 'did a socket open?', on: true }, { t: 'transport', s: 'engine.transport.name' }, { t: 'connect_error', s: 'message + Network status' }, { t: 'server log', s: 'did it reach the process?' }],
      { h: 170, fs: 21, nhan: ['', '', ''] }) +
      two(box('If Q1 is red, stop', `Q2–Q4 all assume a connection. Debugging event names while the socket never opened is the slowest way to lose an afternoon.`, 'bad'),
        box('Corrections from running it', `An auth refusal does <b>not</b> show a red 400/403; “polling always comes first” is false for this repo’s client; and this repo writes <b>no</b> log line on connect or refusal.`, 'info')),
    en: 'Four checks in order: the DevTools WS tab, the transport, the connect error, and the server log. If Q1 is red, stop. Running it corrected three things the page says.' },
  { t: 'Measured: what this repo’s client and server actually set', body: two(tn(KHO, { fs: 13, wrap: 80 }),
      '<div>' + box('Read it', `The client asks for ${c("['websocket', 'polling']")} — <b>WebSocket first</b>, no ${c('tryAllTransports')}. The server comment trusts a long-poll fallback for proxies that strip Upgrade.`, 'info') +
        box('And the server log', `<b>0</b> logger calls in the middleware and the connection handler; “socket connected” occurs <b>0</b> times in ${c('src/')}. Check 4 of the page has nothing to grep.`, 'bad') + '</div>', 'r64'),
    en: 'What the repo sets: the client asks for websocket first, without try all transports; the server comment trusts a polling fallback. And there is no log line on connect or refusal: check four has nothing to grep.' },
  { t: 'Measured: six ways the middleware says no', body: tn(bo(AUTH, [/^\$ # log/, /^nghe/]), { fs: 13, wrap: 124 }) +
      two(wire(WS_NO.map((k) => [k.huong, k.chu]), { fs: 15, max: 54, w: 560 }),
        box('Not a 403', `The WebSocket <b>opens</b> (green 101), then the server sends ${c('44{"message":…}')}: CONNECT_ERROR. The reason is the <b>exact</b> string from the middleware — never “unauthorized”. ${c('socket.active')} = false: no retry. The server log: nothing.`, 'ok')),
    en: 'Six refusals from the repo’s middleware. Each arrives as connect error with the middleware’s exact message. On the wire the WebSocket opens, then the server sends packet forty-four. No four hundred three, no retry.' },
  { t: 'In the browser: a green socket with a red reason inside', body: br('sio-10-2', 'notoken', { url: 'localhost:19960/q1.html?kieu=notoken', vp: 1100, h: 165, w: 1110 }) + `<div style="height:14px"></div>` +
      two(box('What DevTools shows', `Network → WS: one row, status <b>101</b>. Messages: ${c('0{"sid"…}')}, ${c('40')}, ${c('44{"message":"No authentication token provided"}')}, close. The row is not red — the refusal lives <b>inside</b> it.`, 'info'),
        box('What this repo’s client does', `${c('lib/socket.ts')} matches the message against ${c('/unauthor|token|jwt|expired|session/i')} and calls ${c('/api/auth/refresh')} — so the exact strings matter.`, 'ok')),
    en: 'In a real browser: the socket row is green, status one hundred one, and the refusal sits inside it as a message frame. This repo’s client matches that message text to decide whether to refresh the session.' },
  { t: 'Measured: three network faults, one error message', body: tn(bo(MANG, [/^\$ (node proxy|@)/]), { fs: 13, wrap: 120 }) +
      two(box('Read it', `Server down, a 404 from a proxy, a proxy that strips Upgrade: all print ${c('"websocket error"')}. Only ${c('description')} differs (404 / 400) — and in a browser it is an Event with no text. A firewall that drops packets gives ${c('"timeout"')} after ${(timeoutMs / 1000).toFixed(1)} s.`, 'info'),
        box('So check the Network tab', `The status code on the failed WS row is the only thing that tells these apart in a browser. “xhr poll error” only ever appears once polling is in play.`, 'ok')),
    en: 'Three network faults, one message: server down, a four oh four, and a proxy stripping upgrade all say websocket error. Only the status code in the Network tab tells them apart. A dropping firewall says timeout after ten seconds.' },
  { t: 'Real bug: behind a proxy that strips Upgrade, this repo never connects', body: br('sio-10-2', 'catup', { url: 'localhost:19960/q1.html?kieu=catup  (via a proxy that strips Upgrade)', vp: 1100, h: 250, w: 1110 }) +
      two(box('As shipped', `${c("transports: ['websocket', 'polling']")} with engine.io-client 6.6 = try the <b>first</b> transport only. WebSocket gets 400, the client retries WebSocket forever and <b>never</b> tries polling.`, 'bad'),
        box('The server believes the opposite', `${c('messaging.socket.ts:352')}: “Long-poll fallback is enabled by default; WebSocket-only would break users behind corporate proxies…” — the client config makes it WebSocket-only in practice.`, 'info')),
    en: 'A real bug: behind a proxy that strips the upgrade header, this repo’s client retries WebSocket forever and never falls back to polling — exactly what the server comment thinks is covered.' },
  { t: 'The fix: one option', body: br('sio-10-2', 'catupfix', { url: 'localhost:19960/q1.html?kieu=catup-fix  (same proxy)', vp: 1100, h: 130, w: 1110 }) + `<div style="height:12px"></div>` +
      two(box('tryAllTransports: true', `WebSocket fails <b>once</b>, then polling connects in the same attempt. Same proxy, same token. (Or keep the library default — polling first, then upgrade — which also connected in the terminal above.)`, 'ok'),
        box('Reproduce', `lab c10: ${c('node proxy102.mjs 19962 19960 catup')} then ${c('node q1.mjs mang')}. With the repo’s own client library (engine.io-client 6.6.5 in ${c('frontend/')}): 3 attempts in 8 s, all ${c('"websocket error"')}, description “Unexpected server response: 400”.`, 'info')) +
      icards([['shield', 'Why it hides', 'Home and office networks pass WebSocket; only some corporate / school proxies strip Upgrade — those users see “offline forever”.'], ['eye', 'How Q1 shows it', 'Network tab: a WS row with 400, repeating; no polling row ever appears.']], 2),
    en: 'The fix is one option: try all transports set to true. WebSocket fails once, then polling connects in the same attempt. The bug hides because most networks pass WebSocket.' },
  { t: 'Failure mode ⇒ what you see ⇒ fix (measured)', body: cmp(['failure', 'connect_error.message', 'Network tab', 'fix'], [
      ['no / bad token', 'the middleware’s own text', 'WS <b>101</b>, frame 44{…}', 'token, cookie, refresh'],
      ['server down', '"websocket error"', 'WS failed, no status', 'is the process up? curl /health'],
      ['proxy route missing', '"websocket error"', 'WS <b>404</b>', 'location /socket.io/'],
      ['proxy strips Upgrade', '"websocket error"', 'WS <b>400</b>, again and again', 'Upgrade headers + tryAllTransports'],
      ['firewall drops packets', '"timeout" (10 s here)', 'WS pending', 'network path, security group'],
      ['middleware forgot next()', 'no error for 45 s, then close', 'WS 101, no 40 reply', 'call next() (lesson 1.4)'],
    ], { hl: [3] }),
    en: 'The measured table: what each failure prints, what the Network tab shows, and the fix. The proxy that strips upgrade is the one this repo’s client cannot survive.' },
  { t: 'Measured: socket.connected kept saying true', body: two(
      tn(DEN, { fs: 13, wrap: 78 }),
      `<div>${meter([['flag still true after death', +(tDisc - tDen).toFixed(1), '#c0392b'], ['ping 25 s + timeout 60 s', 85, '#0e7490']], { don: 's', nhan: 240, w: 440, rh: 44, fs: 16 })}` +
      box('Read it', `After the network died the flag stayed <b>true</b> for ~${Math.round(tDisc - tDen)} s (ping 25 s + timeout 60 s, as in this repo). ${soEmit} emits went out <b>without an error</b>; the server received ${svNhan}.`, 'bad') +
      box('So', `Treat ${c('connected')} as a hint. Presence comes from the <b>server</b>; “offline” is defined by the ping timeout, not the flag.`, 'ok') + `</div>`, 'r64'),
    en: 'socket connected, measured: after the network died it stayed true for about eighty-two seconds, and eight emits went out without an error. The server received none. Treat the flag as a hint.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('101 Switching Protocols', 'a socket opened — not “authorised”'), kw('44{"message"}', 'CONNECT_ERROR from middleware'), kw('connect_error', 'message · type · description'),
      kw('socket.active', 'false ⇒ no automatic retry'), kw('"websocket error"', 'down · 404 · 400 look the same'), kw('tryAllTransports', 'fall back to the next transport'),
      kw('socket.connected', 'a local hint, late by ping + timeout'), kw('Q1 gate', 'red here ⇒ don’t debug Q2–Q4'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: one oh one; packet forty-four; connect error; socket active; websocket error; try all transports; socket connected; and the Q1 gate.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Connect without a token; find the 44 frame in the Messages tab',
      'Put a proxy that strips Upgrade in front; watch the repo’s client settings fail',
      'Add tryAllTransports: true; confirm it connects over polling',
      'Kill the network silently; time how long connected stays true',
    ]), box('Keep these', `<ul><li>Q1 red ⇒ stop; Q2–Q4 assume a socket</li><li>Auth refusal = 101 + 44, not 403</li><li>Same message, different status: read the Network tab</li><li>WebSocket-first needs tryAllTransports</li><li>connected is a hint; ping timeout decides</li></ul>`, 'info'), ''),
    en: 'Your turn: find the forty-four frame, break the upgrade, fix it with try all transports, and time the connected flag.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Diagnosis cookbook', bai: '10.2' }, S);
