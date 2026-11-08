/** Node.js 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket (bắt tay 101, 799 byte/lần hỏi rỗng, 12 triệu request/giờ, ws server nhỏ nhất). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Polling, SSE or WebSocket — and the handshake that starts it', kho: 'EASY', phut: 10,
  en: 'From the lesson: the handshake printed byte for byte, 20 empty polls vs 20 pushed messages, the hour with 10,000 users, and the five things that bite on day one. Question 4 was re-checked on Node 22.23 with ws 8.',
  vi: 'Từ bài: lần bắt tay in ra từng byte, 20 lần hỏi rỗng so với 20 tin được đẩy, một giờ với 10.000 người dùng, và năm thứ cắn bạn ngày đầu. Câu 4 được kiểm lại trên Node 22.23 với ws 8.',
  cau: [
    q('w1', ['A "new post" banner, a chat, and a job that finishes about once an hour (a minute late is fine). Pick the weakest thing that works for each.', 'Một banner "có bài mới", một khung chat, và một việc nền xong khoảng một giờ một lần (trễ một phút không sao). Chọn thứ yếu nhất đủ dùng cho từng cái.'],
      ['SSE · WebSocket · a one-minute poll', 'WebSocket · WebSocket · WebSocket', 'A 2-second poll · SSE · WebSocket', 'SSE · SSE · a 3-second poll'],
      ['One-way server → client is SSE; the client also talks back in a chat; something that changes hourly does not need new infrastructure. A 2-second poll pays socket-level cost for polling-level latency.', 'Một chiều server → client là SSE; chat thì client cũng nói lại; thứ đổi theo giờ không cần hạ tầng mới. Hỏi mỗi 2 giây là trả giá của socket cho độ trễ của polling.']),
    q('w2', ['The handshake ends in <code>HTTP/1.1 101 Switching Protocols</code>. Which consequence is right?', 'Lần bắt tay kết thúc bằng <code>HTTP/1.1 101 Switching Protocols</code>. Hệ quả nào đúng?'],
      ['It starts as HTTP, so cookies, TLS and the reverse proxy apply — and a proxy that does not understand Upgrade breaks it', 'After 101 every frame carries the cookies again, so auth can be checked per message', 'The browser opens a second TCP connection for the WebSocket after the 101', 'The 101 response is cached by proxies, so later connections skip the handshake'],
      ['Cookies arrive only on the handshake; after the 101 line the socket no longer speaks HTTP. sec-websocket-accept proves the peer is a real WebSocket server, not a cache replaying an old response.', 'Cookie chỉ tới ở lần bắt tay; sau dòng 101 socket không còn nói HTTP. sec-websocket-accept chứng minh bên kia là WebSocket server thật, không phải cache phát lại phản hồi cũ.']),
    q('w3', ['Behind nginx without <code>proxy_set_header Upgrade $http_upgrade</code> and <code>Connection "upgrade"</code>, what did a raw ws server attached to Express see?', 'Sau nginx thiếu <code>proxy_set_header Upgrade $http_upgrade</code> và <code>Connection "upgrade"</code>, ws server gắn vào Express thấy gì?'],
      ['A plain GET — so Express answered it (200 or 404) instead of 101', 'A 101 with a missing sec-websocket-accept, rejected by the browser', 'Nothing: nginx dropped the request and logged a 502', 'A WebSocket that connects but never receives frames'],
      ['nginx speaks HTTP/1.0 upstream by default and does not forward hop-by-hop headers. Socket.IO answered 400 {"code":3,"message":"Bad request"} in the same setup. Local dev works fine — production does not.', 'nginx mặc định nói HTTP/1.0 với upstream và không chuyển header hop-by-hop. Cùng cấu hình đó Socket.IO trả 400 {"code":3,"message":"Bad request"}. Máy dev chạy ngon — production thì không.']),
    q('w4', ['<code>ws.send({ a: 1 })</code> — an object, not a string. What happens?', '<code>ws.send({ a: 1 })</code> — một object, không phải chuỗi. Chuyện gì xảy ra?'],
      ['ws throws a TypeError at once; the standard WebSocket (browser, Node 22 global) silently sends "[object Object]"', 'Both serialise it with JSON.stringify automatically, so the receiver gets {"a":1} either way', 'Both throw a TypeError at once — the ws library and the browser-standard WebSocket alike', 'Both silently send the text "[object Object]" — the ws library and the standard WebSocket alike'],
      ['Verified: ws 8 throws "The first argument must be of type string or an instance of Buffer…"; Node 22’s global WebSocket sent the 15 bytes "[object Object]". Always JSON.stringify first.', 'Đã kiểm: ws 8 ném "The first argument must be of type string or an instance of Buffer…"; WebSocket toàn cục của Node 22 gửi 15 byte "[object Object]". Luôn JSON.stringify trước.']),
    qn('w5', ['Which match the measurements? (choose all)', 'Cái nào khớp số đo? (chọn mọi câu đúng)'],
      ['An empty authenticated poll cost about 799 bytes, mostly headers (the cookie alone ~250 B)', 'Twenty pushed 66-byte messages cost 2,082 bytes including the handshake', '10,000 tabs polling every 3 s for one hour: 12,000,000 requests', 'A WebSocket frame header is always 14 bytes', 'An open-socket round trip took about 0.9 ms'],
      [0, 1, 2, 4],
      ['A frame header is 2–6 bytes for small messages (2 server → client, +4 mask bytes client → server), which is why a 66-byte payload cost 68–72 bytes on the wire.', 'Header của frame là 2–6 byte với tin nhỏ (2 byte server → client, thêm 4 byte mặt nạ client → server), vì vậy payload 66 byte tốn 68–72 byte trên đường truyền.']),
  ],
  goiY: [['"Pick the weakest one that solves the problem."', '"Chọn cái yếu nhất giải được bài toán."'], ['Remember what is HTTP (the handshake) and what is not (everything after 101).', 'Nhớ cái gì là HTTP (lần bắt tay) và cái gì không (mọi thứ sau 101).']],
  loi: [['Using a 2-second poll to imitate realtime.', 'Dùng hỏi mỗi 2 giây để giả làm realtime.'], ['Sending objects through ws.send.', 'Gửi object qua ws.send.']],
  tns: [tn('polling', 'hỏi định kỳ', 'client hỏi lại mỗi N giây'), tn('SSE', 'Server-Sent Events', 'một phản hồi HTTP dài, server ghi dần, một chiều'), tn('101 Switching Protocols', 'đổi giao thức', 'kết thúc bắt tay WebSocket')],
  kn: ['WebSocket', 'polling'],
});

/* ─── 2. EASY · js — cái giá của polling ─── */
function pollingCost({ users, intervalSec, bytesPerPoll, hours }) {
  const requests = Math.floor(users * hours * 3600 / intervalSec);   // every tab asks once per interval
  const gib = Math.round(requests * bytesPerPoll / 1024 ** 3 * 100) / 100;   // the lesson's "GB" is 1024³ bytes
  return { requests, gib };
}

function frameSize(payloadBytes, fromClient) {
  // 2 bytes of header; a 16-bit length (+2) above 125 bytes, a 64-bit length (+8) above 65,535;
  // frames from a CLIENT are masked: +4 bytes of mask key.
  const len = payloadBytes <= 125 ? 0 : payloadBytes <= 65535 ? 2 : 8;
  return payloadBytes + 2 + len + (fromClient ? 4 : 0);
}

const E2 = jsBai({
  ten: 'Price an hour of polling against socket frames', kho: 'EASY', phut: 10,
  en: `<p>Write two calculators from the lesson’s measurements:</p>
<ul><li><code>pollingCost({ users, intervalSec, bytesPerPoll, hours })</code> → <code>{ requests, gib }</code>: <code>requests = floor(users × hours × 3600 / intervalSec)</code>; <code>gib = requests × bytesPerPoll / 1024³</code> rounded to 2 decimals. (10,000 users, every 3 s, 799 B, 1 h → 12,000,000 requests, 8.93.)</li>
<li><code>frameSize(payloadBytes, fromClient)</code> → bytes on the wire for one WebSocket frame: payload + 2-byte header, + 2 more if the payload is 126–65,535 bytes, + 8 more if larger, + 4 (mask key) if the frame goes client → server. (66 B server → client → 68.)</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Viết hai hàm tính theo số đo của bài:</p>
<ul><li><code>pollingCost({ users, intervalSec, bytesPerPoll, hours })</code> → <code>{ requests, gib }</code>: <code>requests = floor(users × hours × 3600 / intervalSec)</code>; <code>gib = requests × bytesPerPoll / 1024³</code> làm tròn 2 chữ số thập phân. (10.000 người, mỗi 3 giây, 799 B, 1 giờ → 12.000.000 request, 8,93.)</li>
<li><code>frameSize(payloadBytes, fromClient)</code> → số byte trên đường truyền của một frame WebSocket: payload + header 2 byte, + 2 nữa nếu payload 126–65.535 byte, + 8 nữa nếu lớn hơn, + 4 (khoá mặt nạ) nếu frame đi client → server. (66 B server → client → 68.)</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Requests per user per hour = 3600 / intervalSec.', 'Số request mỗi người mỗi giờ = 3600 / intervalSec.'], ['For frames, write the three length cases as a chain: ≤ 125, ≤ 65535, else.', 'Với frame, viết ba trường hợp độ dài thành chuỗi: ≤ 125, ≤ 65535, còn lại.']],
  loi: [['Dividing by 10⁹ instead of 1024³: you get 9.59, not the lesson’s 8.93.', 'Chia cho 10⁹ thay vì 1024³: ra 9,59, không phải 8,93 của bài.'], ['Forgetting that client frames are masked (+4 bytes).', 'Quên rằng frame từ client có mặt nạ (+4 byte).']],
  gt: ['The point of the arithmetic is the ratio: an empty poll is ~800 bytes of headers, cookie and URL, every interval, for every tab — while a pushed message is its payload plus 2–6 bytes. Multiply by an audience and an interval and polling becomes "unaffordable", not "simpler".', 'Điểm mấu chốt của phép tính là tỉ lệ: một lần hỏi rỗng là ~800 byte header, cookie và URL, mỗi chu kỳ, cho mỗi tab — còn một tin được đẩy chỉ là payload cộng 2–6 byte. Nhân với số người và chu kỳ thì polling thành "không kham nổi", không còn là "đơn giản hơn".'],
  kn: ['WebSocket', 'polling', 'capacity planning'],
  tns: [tn('frame', 'khung tin', 'đơn vị dữ liệu của WebSocket'), tn('masking', 'che mặt nạ', 'frame client → server bị XOR với khoá 4 byte')],
  dau: `/** One hour (or more) of polling: how many requests, how many GiB. */
function pollingCost({ users, intervalSec, bytesPerPoll, hours }) {
  // Write your solution here
  const requests = users * intervalSec * hours;
  return { requests, gib: requests * bytesPerPoll / 1e9 };
}

/** Bytes on the wire for one WebSocket frame. */
function frameSize(payloadBytes, fromClient) {
  return payloadBytes + 2;
}
`,
  giai: '// Reference solution\n' + nguon(pollingCost, frameSize),
  cases: [
    { goi: 'pollingCost({ users: 10000, intervalSec: 3, bytesPerPoll: 799, hours: 1 })', moTa: ['The lesson’s hour', 'Một giờ của bài'] },
    { goi: '[frameSize(66, false), frameSize(66, true)]', moTa: ['A 66-byte chat message, both directions', 'Tin chat 66 byte, cả hai chiều'] },
    { goi: '[frameSize(125, false), frameSize(126, false), frameSize(65535, true), frameSize(65536, false)]', moTa: ['The length boundaries', 'Các mốc độ dài'] },
    { goi: '[pollingCost({ users: 10000, intervalSec: 2, bytesPerPoll: 799, hours: 1 }), pollingCost({ users: 1, intervalSec: 60, bytesPerPoll: 799, hours: 1 }), pollingCost({ users: 500, intervalSec: 7, bytesPerPoll: 1200, hours: 24 })]', an: true },
    { goi: '[frameSize(0, false), frameSize(0, true), frameSize(1000000, true)]', an: true },
  ],
});

/* ─── 3. MEDIUM · js — có phải request bắt tay WebSocket không ─── */
function checkUpgrade(req) {
  const h = {};
  for (const k of Object.keys(req.headers || {})) h[k.toLowerCase()] = String(req.headers[k]);
  // No Upgrade header at all ⇒ an ordinary request: Express (same server, same port) answers it.
  if (h.upgrade === undefined) return { action: 'http' };
  const reject = (status, extra) => ({ action: 'reject', status, ...(extra ? { headers: extra } : {}) });
  if (h.upgrade.trim().toLowerCase() !== 'websocket') return reject(400);
  if (req.method !== 'GET') return reject(400);
  // Connection is a comma-separated list: "keep-alive, Upgrade" is valid and common (Firefox sends it).
  const tokens = (h.connection || '').split(',').map((t) => t.trim().toLowerCase());
  if (!tokens.includes('upgrade')) return reject(400);
  // Only version 13 exists; tell the client which one we speak.
  if (h['sec-websocket-version'] !== '13') return reject(426, { 'Sec-WebSocket-Version': '13' });
  // The key is 16 random bytes, base64-encoded: 22 characters + "==".
  if (!/^[A-Za-z0-9+/]{22}==$/.test(h['sec-websocket-key'] || '')) return reject(400);
  return { action: 'accept', status: 101 };
}

const HS = { 'sec-websocket-version': '13', 'sec-websocket-key': 'O67OtnHy8iWBoa5aPG0r2w==', connection: 'Upgrade', upgrade: 'websocket', 'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits', host: '127.0.0.1:4300' };
const E3 = jsBai({
  ten: 'Recognise a WebSocket handshake (and what nginx did to it)', kho: 'MEDIUM', phut: 18,
  en: `<p>The server shares one port with Express: "the upgrade only happens for requests carrying the Upgrade header; everything else is still Express." Write <code>checkUpgrade(req)</code> for <code>req = { method, headers }</code> (header names in any case):</p>
<ul><li>no <code>upgrade</code> header → <code>{ action:'http' }</code> (Express handles it — this is what the server sees behind an nginx that does not forward Upgrade);</li>
<li><code>upgrade</code> not equal to <code>websocket</code> (case-insensitive), method not <code>GET</code>, or <code>connection</code> (a comma-separated list) without an <code>upgrade</code> token → <code>{ action:'reject', status:400 }</code>;</li>
<li><code>sec-websocket-version</code> not <code>'13'</code> → <code>{ action:'reject', status:426, headers:{ 'Sec-WebSocket-Version':'13' } }</code>;</li>
<li><code>sec-websocket-key</code> not 22 base64 characters followed by <code>==</code> → <code>{ action:'reject', status:400 }</code>;</li>
<li>otherwise <code>{ action:'accept', status:101 }</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Server dùng chung một cổng với Express: "việc nâng cấp chỉ xảy ra với request có header Upgrade; mọi thứ khác vẫn là Express." Viết <code>checkUpgrade(req)</code> với <code>req = { method, headers }</code> (tên header kiểu chữ nào cũng được):</p>
<ul><li>không có header <code>upgrade</code> → <code>{ action:'http' }</code> (Express lo — đây là điều server thấy sau một nginx không chuyển Upgrade);</li>
<li><code>upgrade</code> khác <code>websocket</code> (không phân biệt hoa thường), method không phải <code>GET</code>, hoặc <code>connection</code> (danh sách cách nhau bằng dấu phẩy) không có từ <code>upgrade</code> → <code>{ action:'reject', status:400 }</code>;</li>
<li><code>sec-websocket-version</code> khác <code>'13'</code> → <code>{ action:'reject', status:426, headers:{ 'Sec-WebSocket-Version':'13' } }</code>;</li>
<li><code>sec-websocket-key</code> không phải 22 ký tự base64 theo sau là <code>==</code> → <code>{ action:'reject', status:400 }</code>;</li>
<li>còn lại <code>{ action:'accept', status:101 }</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Lower-case the header names into a new object first.', 'Viết thường tên header vào một object mới trước.'], ['<code>connection.split(",").map(t =&gt; t.trim().toLowerCase()).includes("upgrade")</code>.', '<code>connection.split(",").map(t =&gt; t.trim().toLowerCase()).includes("upgrade")</code>.']],
  loi: [['<code>connection === "Upgrade"</code>: Firefox sends <code>keep-alive, Upgrade</code> and is refused.', '<code>connection === "Upgrade"</code>: Firefox gửi <code>keep-alive, Upgrade</code> và bị từ chối.'], ['Rejecting every request without Upgrade — on a shared port that breaks every REST route.', 'Từ chối mọi request không có Upgrade — trên cổng dùng chung là hỏng mọi route REST.'], ['Answering a version mismatch with 400 and no hint; 426 + Sec-WebSocket-Version tells the client what to use.', 'Trả 400 không gợi ý khi lệch phiên bản; 426 + Sec-WebSocket-Version cho client biết phải dùng gì.']],
  gt: ['A WebSocket begins life as an ordinary HTTP GET, so the server must first decide whether this GET is asking to switch protocols at all. Absence of Upgrade means "plain HTTP" — which is also exactly why the nginx misconfiguration fails silently: the upgrade request arrives as a normal GET and Express answers it. Header values are tokens and lists, so they are compared case-insensitively and split, never matched as whole strings.', 'WebSocket bắt đầu như một HTTP GET thường, nên server phải quyết trước tiên GET này có xin đổi giao thức không. Không có Upgrade nghĩa là "HTTP thường" — cũng chính là lý do cấu hình nginx sai hỏng âm thầm: request nâng cấp tới như một GET bình thường và Express trả lời nó. Giá trị header là từ khoá và danh sách, nên so không phân biệt hoa thường và tách ra, không bao giờ khớp nguyên chuỗi.'],
  kn: ['WebSocket', 'HTTP headers'],
  tns: [tn('Upgrade', 'header nâng cấp', 'xin đổi sang giao thức khác'), tn('hop-by-hop header', 'header theo chặng', 'proxy không tự chuyển tiếp: Connection, Upgrade'), tn('426 Upgrade Required', 'cần nâng cấp', 'phiên bản giao thức không hỗ trợ')],
  dau: `/** Decide what to do with an incoming request on the shared HTTP/WebSocket port. */
function checkUpgrade(req) {
  // Write your solution here
  if (req.headers.upgrade !== 'websocket') return { action: 'http' };
  if (req.headers.connection !== 'Upgrade') return { action: 'reject', status: 400 };
  return { action: 'accept', status: 101 };
}
`,
  giai: '// Reference solution\n' + nguon(checkUpgrade),
  cases: [
    { goi: `checkUpgrade({ method: 'GET', headers: ${JSON.stringify(HS)} })`, moTa: ['The lesson’s captured handshake', 'Lần bắt tay đã chụp trong bài'] },
    { goi: `checkUpgrade({ method: 'GET', headers: { host: '127.0.0.1:4300', connection: 'close', 'sec-websocket-version': '13', 'sec-websocket-key': 'O67OtnHy8iWBoa5aPG0r2w==' } })`, moTa: ['Behind nginx without the Upgrade lines', 'Sau nginx thiếu các dòng Upgrade'] },
    { goi: `[checkUpgrade({ method: 'GET', headers: { ...${JSON.stringify(HS)}, connection: 'keep-alive, Upgrade', upgrade: 'WebSocket' } }), checkUpgrade({ method: 'GET', headers: { ...${JSON.stringify(HS)}, 'sec-websocket-version': '8' } })]`, moTa: ['Firefox-style Connection; old version → 426', 'Connection kiểu Firefox; phiên bản cũ → 426'] },
    { goi: `[checkUpgrade({ method: 'POST', headers: ${JSON.stringify(HS)} }), checkUpgrade({ method: 'GET', headers: { ...${JSON.stringify(HS)}, upgrade: 'h2c' } }), checkUpgrade({ method: 'GET', headers: { ...${JSON.stringify(HS)}, connection: 'keep-alive' } }), checkUpgrade({ method: 'GET', headers: { ...${JSON.stringify(HS)}, 'sec-websocket-key': 'short==' } })]`, an: true },
    { goi: `[checkUpgrade({ method: 'GET', headers: { Upgrade: 'websocket', Connection: 'Upgrade', 'Sec-WebSocket-Version': '13', 'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==' } }), checkUpgrade({ method: 'GET', headers: { upgrade: 'websocket', connection: 'Upgrade', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==' } }), checkUpgrade({ method: 'GET', headers: {} })]`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — xử lý một tin nhắn ─── */
function handleMessage(ws, data, isBinary) {
  // Always send a STRING: the ws library throws on an object, the browser API sends "[object Object]".
  const reply = (obj) => ws.send(JSON.stringify(obj));
  if (isBinary) return reply({ type: 'error', code: 'BINARY_NOT_SUPPORTED' });
  const text = data.toString();                                   // data is a Buffer — NOT an object
  if (text.length > 4096) { reply({ type: 'error', code: 'TOO_BIG' }); return ws.close(1009, 'message too big'); }
  let msg;
  try { msg = JSON.parse(text); } catch { return reply({ type: 'error', code: 'BAD_JSON' }); }   // one bad frame must not kill the socket
  if (typeof msg !== 'object' || msg === null || Array.isArray(msg) || typeof msg.type !== 'string') return reply({ type: 'error', code: 'BAD_MESSAGE' });
  if (msg.type === 'ping') return reply({ type: 'pong', t: msg.t ?? null });
  if (msg.type === 'echo') return reply({ type: 'echo', echo: msg.data ?? null });
  return reply({ type: 'error', code: 'UNKNOWN_TYPE' });
}

const WSF = String.raw`
// a fake ws socket that behaves like the ws library: send() THROWS on anything that is not a string/Buffer
function fakeWs() { const w = { sent: [], closed: null };
  w.send = (x) => { if (typeof x !== 'string') throw new TypeError('The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received an instance of Object'); w.sent.push(x); };
  w.close = (code, reason) => { w.closed = [code, reason]; }; return w; }
// a fake Buffer: has toString(), is not the parsed object
const buf = (s) => ({ toString: () => s, length: s.length });
function talk(frames) { const ws = fakeWs(); for (const f of frames) { try { handleMessage(ws, buf(f.data), !!f.binary); } catch (e) { ws.sent.push('THREW ' + e.name); } } return [ws.sent.map((s) => s.startsWith('THREW') ? s : JSON.parse(s)), ws.closed]; }
`;

const E4 = jsBai({
  ten: 'Handle a frame: it is a Buffer, and you answer with a string', kho: 'MEDIUM', phut: 15,
  en: `<p>From the smallest useful server: "<code>data</code> is a Buffer — NOT an object. You choose the format yourself." Write <code>handleMessage(ws, data, isBinary)</code> for a JSON protocol. Every reply is <code>ws.send(JSON.stringify(obj))</code>:</p>
<ul><li><code>isBinary</code> → <code>{ type:'error', code:'BINARY_NOT_SUPPORTED' }</code>;</li>
<li>text = <code>data.toString()</code>; longer than 4096 characters → reply <code>{ type:'error', code:'TOO_BIG' }</code> then <code>ws.close(1009, 'message too big')</code>;</li>
<li>not valid JSON → <code>{ type:'error', code:'BAD_JSON' }</code> (and keep the socket open);</li>
<li>not a plain object with a string <code>type</code> → <code>{ type:'error', code:'BAD_MESSAGE' }</code>;</li>
<li><code>ping</code> → <code>{ type:'pong', t }</code>; <code>echo</code> → <code>{ type:'echo', echo: data }</code> (missing values become <code>null</code>); any other type → <code>{ type:'error', code:'UNKNOWN_TYPE' }</code>.</li></ul>
<p>The fake <code>ws.send</code> throws a TypeError on a non-string, exactly like the ws library.</p>${MOI_TRUONG.en}`,
  vi: `<p>Từ server nhỏ nhất đủ dùng: "<code>data</code> là một Buffer — KHÔNG phải object. Định dạng do bạn tự chọn." Viết <code>handleMessage(ws, data, isBinary)</code> cho một giao thức JSON. Mọi câu trả lời là <code>ws.send(JSON.stringify(obj))</code>:</p>
<ul><li><code>isBinary</code> → <code>{ type:'error', code:'BINARY_NOT_SUPPORTED' }</code>;</li>
<li>text = <code>data.toString()</code>; dài hơn 4096 ký tự → trả <code>{ type:'error', code:'TOO_BIG' }</code> rồi <code>ws.close(1009, 'message too big')</code>;</li>
<li>không phải JSON hợp lệ → <code>{ type:'error', code:'BAD_JSON' }</code> (và giữ socket mở);</li>
<li>không phải object thường có <code>type</code> là chuỗi → <code>{ type:'error', code:'BAD_MESSAGE' }</code>;</li>
<li><code>ping</code> → <code>{ type:'pong', t }</code>; <code>echo</code> → <code>{ type:'echo', echo: data }</code> (giá trị thiếu thành <code>null</code>); type khác → <code>{ type:'error', code:'UNKNOWN_TYPE' }</code>.</li></ul>
<p><code>ws.send</code> giả ném TypeError với thứ không phải chuỗi, đúng như thư viện ws.</p>${MOI_TRUONG.vi}`,
  goiY: [['Write one helper <code>reply(obj)</code> that stringifies — then every branch is one line.', 'Viết một hàm phụ <code>reply(obj)</code> có stringify — khi đó mỗi nhánh chỉ một dòng.'], ['Wrap only <code>JSON.parse</code> in try/catch.', 'Chỉ bọc <code>JSON.parse</code> trong try/catch.']],
  loi: [['<code>JSON.parse(data)</code> works on a Buffer by accident (it calls toString) — but <code>data.type</code> on the Buffer is undefined.', '<code>JSON.parse(data)</code> chạy được trên Buffer do tình cờ (nó gọi toString) — nhưng <code>data.type</code> trên Buffer là undefined.'], ['<code>ws.send(obj)</code>: TypeError in ws, "[object Object]" in the browser API.', '<code>ws.send(obj)</code>: TypeError với ws, "[object Object]" với API trình duyệt.'], ['Letting a JSON.parse error escape: an unhandled exception in the message handler can take the process down.', 'Để lỗi JSON.parse thoát ra: exception không bắt trong handler tin nhắn có thể làm sập tiến trình.']],
  gt: ['A raw WebSocket is a pipe of frames; the protocol on top is yours. Treating every frame as untrusted text — size cap, parse in a try, shape check, explicit dispatch — is the same discipline as an HTTP body in 9.3, without the framework doing any of it for you. Replying with JSON.stringify keeps both kinds of client (ws and the browser API) honest.', 'WebSocket thô là một đường ống frame; giao thức phía trên là của bạn. Coi mỗi frame là chữ không đáng tin — giới hạn cỡ, parse trong try, kiểm hình dạng, phân nhánh rõ ràng — là cùng kỷ luật với thân HTTP ở 9.3, chỉ là không có framework làm hộ. Trả lời bằng JSON.stringify giữ cho cả hai kiểu client (ws và API trình duyệt) đúng.'],
  kn: ['WebSocket', 'validation'],
  tns: [tn('close code 1009', 'mã đóng 1009', 'tin nhắn quá lớn'), tn('dispatch', 'phân luồng', 'chọn xử lý theo trường type')],
  fakes: WSF,
  dau: `/** Handle one incoming WebSocket frame of a small JSON protocol. */
function handleMessage(ws, data, isBinary) {
  // Write your solution here
  const msg = JSON.parse(data);
  if (msg.type === 'ping') return ws.send({ type: 'pong', t: msg.t });
  if (msg.type === 'echo') return ws.send({ type: 'echo', echo: msg.data });
}
`,
  giai: '// Reference solution\n' + nguon(handleMessage),
  cases: [
    { goi: `talk([{ data: '{"type":"ping","t":1767225600000}' }, { data: '{"type":"echo","data":{"note":"xin chao"}}' }])`, moTa: ['ping and echo', 'ping và echo'] },
    { goi: `talk([{ data: '{not json' }, { data: '{"type":"ping"}' }])`, moTa: ['A bad frame does not kill the socket', 'Một frame hỏng không giết socket'] },
    { goi: `talk([{ data: 'x'.repeat(5000) }])`, moTa: ['Too big → error + close 1009', 'Quá lớn → lỗi + đóng 1009'] },
    { goi: `talk([{ data: '[1,2]' }, { data: '"ping"' }, { data: 'null' }, { data: '{"type":7}' }, { data: '{"type":"delete-all"}' }, { data: 'abc', binary: true }])`, an: true },
    { goi: `talk([{ data: '{"type":"echo"}' }, { data: '{"type":"echo","data":"' + 'a'.repeat(4000) + '"}' }])`, an: true },
  ],
});

/* ─── 5. HARD · js — tự kết nối lại, lùi theo hàm mũ có jitter ─── */
function createReconnector({ connect, baseMs, maxMs, random }) {
  let attempt = 0, timer = null, stopped = false, socket = null;
  const schedule = () => {
    if (stopped) return;
    // exponential backoff, capped, with "equal jitter": between 50% and 100% of the step,
    // so ten thousand clients dropped by one deploy do not come back in the same millisecond
    const step = Math.min(maxMs, baseMs * 2 ** attempt);
    const delay = Math.floor(step * (0.5 + random() / 2));
    attempt++;
    timer = setTimeout(open, delay);
  };
  const open = () => {
    timer = null;
    if (stopped) return;
    connect().then((s) => {
      if (stopped) { s.close(); return; }
      socket = s;
      attempt = 0;                                   // a successful connection resets the backoff
      s.onclose = () => { socket = null; schedule(); };
    }, schedule);                                    // refused / failed: back off and try again
  };
  return {
    start() { stopped = false; open(); },
    stop() { stopped = true; if (timer) clearTimeout(timer); timer = null; if (socket) socket.close(); },
    get attempt() { return attempt; },
  };
}

const RC = String.raw`
// a fake server: plan[i] = 'fail' (refuse the i-th connect) or a number (stay open that many ms, then drop)
function makeServer(plan) { const s = { calls: [], i: 0, t0: Date.now() };
  s.connect = () => { s.calls.push(Date.now() - s.t0); const p = s.i < plan.length ? plan[s.i++] : 'fail';
    return new Promise((res, rej) => setTimeout(() => { if (p === 'fail') return rej(new Error('ECONNREFUSED'));
      const sock = { open: true, onclose: null, close() { if (sock.open) { sock.open = false; } } }; res(sock);
      setTimeout(() => { if (sock.open) { sock.open = false; if (sock.onclose) sock.onclose(); } }, p); }, 10)); };
  return s; }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const half = () => 0.5;   // deterministic "random": delay = 75% of the step
function seq(xs) { let i = 0; return () => xs[i++ % xs.length]; }
`;

const E5 = jsBai({
  ten: 'Reconnect after the laptop wakes up — with jittered backoff', kho: 'HARD', phut: 30,
  en: `<p>"There is no built-in reconnect in raw ws — a laptop that sleeps comes back with a dead socket", and in 11.4: "a deploy that restarts every container at once: every client reconnects in the same second… make reconnect backoff jittered." Write <code>createReconnector({ connect, baseMs, maxMs, random })</code> → <code>{ start(), stop(), attempt }</code>:</p>
<ul><li><code>connect()</code> returns a Promise for a socket <code>{ onclose, close() }</code>, or rejects if the server refuses;</li>
<li><code>start()</code> connects at once. When a connect fails, or an open socket’s <code>onclose</code> fires, schedule the next connect after <code>floor(min(maxMs, baseMs·2<sup>attempt</sup>) × (0.5 + random()/2))</code> ms, then increment <code>attempt</code>;</li>
<li>a successful connect resets <code>attempt</code> to 0 (and sets <code>socket.onclose</code>);</li>
<li><code>stop()</code> cancels a pending retry, closes an open socket, and nothing reconnects after it; <code>attempt</code> is a getter.</li></ul>
<p>The fake server records the virtual time of every <code>connect()</code> call in <code>calls</code>; each connect takes 10 ms to answer.</p>${MOI_TRUONG.en}`,
  vi: `<p>"ws thô không có tự kết nối lại — laptop ngủ dậy là cầm một socket chết", và ở 11.4: "một lần deploy khởi động lại mọi container cùng lúc: mọi client kết nối lại trong cùng một giây… hãy cho backoff có jitter." Viết <code>createReconnector({ connect, baseMs, maxMs, random })</code> → <code>{ start(), stop(), attempt }</code>:</p>
<ul><li><code>connect()</code> trả Promise cho một socket <code>{ onclose, close() }</code>, hoặc reject nếu server từ chối;</li>
<li><code>start()</code> kết nối ngay. Khi một lần connect hỏng, hoặc <code>onclose</code> của socket đang mở được gọi, hẹn lần connect sau sau <code>floor(min(maxMs, baseMs·2<sup>attempt</sup>) × (0.5 + random()/2))</code> ms, rồi tăng <code>attempt</code>;</li>
<li>connect thành công đặt lại <code>attempt</code> về 0 (và gán <code>socket.onclose</code>);</li>
<li><code>stop()</code> huỷ lần thử đang hẹn, đóng socket đang mở, và sau đó không gì kết nối lại; <code>attempt</code> là getter.</li></ul>
<p>Server giả ghi thời điểm ảo của mỗi lần gọi <code>connect()</code> vào <code>calls</code>; mỗi lần connect mất 10 ms để trả lời.</p>${MOI_TRUONG.vi}`,
  goiY: [['Two internal functions: <code>open()</code> calls connect; <code>schedule()</code> computes the delay and sets a timer for <code>open</code>.', 'Hai hàm nội bộ: <code>open()</code> gọi connect; <code>schedule()</code> tính độ trễ và hẹn giờ gọi <code>open</code>.'], ['<code>connect().then(onOpen, schedule)</code> — the second argument handles the refusal.', '<code>connect().then(onOpen, schedule)</code> — đối số thứ hai xử lý lần bị từ chối.'], ['Keep the timer id so <code>stop()</code> can <code>clearTimeout</code> it, and check a <code>stopped</code> flag before every connect.', 'Giữ id của hẹn giờ để <code>stop()</code> <code>clearTimeout</code> được, và kiểm cờ <code>stopped</code> trước mỗi lần connect.']],
  loi: [['A fixed retry interval: after a deploy every client hammers the server in lock-step.', 'Khoảng thử lại cố định: sau deploy mọi client cùng nện vào server đều nhịp.'], ['Never resetting attempt: after one bad night the client waits maxMs even for a 1-second blip.', 'Không bao giờ đặt lại attempt: sau một đêm tệ client chờ maxMs kể cả với trục trặc 1 giây.'], ['stop() that only closes the socket: the pending timer fires and reconnects anyway.', 'stop() chỉ đóng socket: hẹn giờ đang chờ vẫn nổ và kết nối lại.']],
  gt: ['Exponential backoff spaces retries so a dead server is not hammered; the cap keeps a long outage from producing hour-long waits; the jitter spreads a crowd of clients that all lost their connection at the same instant — the thundering herd of 11.4. Resetting on success makes the next blip cheap again. Socket.IO ships exactly this (reconnectionDelay, reconnectionDelayMax, randomizationFactor); with raw ws you write it, which is the point of 11.2.', 'Backoff theo hàm mũ giãn các lần thử để server đang chết không bị nện; trần giữ một sự cố dài không biến thành chờ cả giờ; jitter rải đám đông client cùng mất kết nối một lúc — đàn bò giẫm đạp của 11.4. Đặt lại khi thành công làm trục trặc kế tiếp lại rẻ. Socket.IO có sẵn đúng thứ này (reconnectionDelay, reconnectionDelayMax, randomizationFactor); với ws thô bạn tự viết, đó chính là ý của 11.2.'],
  kn: ['WebSocket', 'reconnection', 'backoff', 'timers'],
  tns: [tn('exponential backoff', 'lùi theo hàm mũ', 'mỗi lần thử chờ gấp đôi'), tn('jitter', 'nhiễu ngẫu nhiên', 'rải thời điểm thử lại'), tn('thundering herd', 'đàn bò giẫm đạp', 'mọi client cùng quay lại một lúc')],
  fakes: RC,
  dau: `/** Keep a socket connected: retry with capped, jittered exponential backoff. */
function createReconnector({ connect, baseMs, maxMs, random }) {
  // Write your solution here
  let attempt = 0;
  const open = () => connect().then((s) => { s.onclose = () => setTimeout(open, baseMs); }, () => setTimeout(open, baseMs));
  return { start() { open(); }, stop() {}, get attempt() { return attempt; } };
}
`,
  giai: '// Reference solution\n' + nguon(createReconnector),
  cases: [
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer(["fail", "fail", "fail", 100000]); const r = createReconnector({ connect: s.connect, baseMs: 1000, maxMs: 30000, random: half }); r.start(); await sleep(10000); const a = r.attempt; r.stop(); return [s.calls, a]; })()', moTa: ['Three refusals, then connected: 0 · 760 · 2270 · 5280 ms', 'Ba lần bị từ chối rồi nối được: 0 · 760 · 2270 · 5280 ms'] },
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer([500, 500, 100000]); const r = createReconnector({ connect: s.connect, baseMs: 1000, maxMs: 30000, random: half }); r.start(); await sleep(5000); r.stop(); return s.calls; })()', moTa: ['A successful connection resets the backoff', 'Kết nối thành công đặt lại backoff'] },
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer([]); const r = createReconnector({ connect: s.connect, baseMs: 1000, maxMs: 4000, random: half }); r.start(); await sleep(16000); r.stop(); const n = s.calls.length; await sleep(20000); return [s.calls, n === s.calls.length]; })()', moTa: ['Capped at maxMs; nothing after stop()', 'Bị chặn ở maxMs; không gì sau stop()'] },
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer(["fail", "fail", "fail", "fail"]); const r = createReconnector({ connect: s.connect, baseMs: 1000, maxMs: 30000, random: seq([0, 0.999, 0.25, 0.75]) }); r.start(); await sleep(9000); r.stop(); return s.calls; })()', an: true },
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer([300, "fail", 100000]); const r = createReconnector({ connect: s.connect, baseMs: 200, maxMs: 1000, random: () => 1 }); r.start(); await sleep(3000); const a = r.attempt; r.stop(); await sleep(5000); return [s.calls, a]; })()', an: true },
    { timeoutMs: 60000, goi: 'await (async () => { const s = makeServer([100000]); const r = createReconnector({ connect: s.connect, baseMs: 100, maxMs: 1000, random: half }); r.start(); await sleep(50); r.stop(); await sleep(20000); return s.calls; })()', an: true },
  ],
});

export default modul('nodejs-11-1-websocket-co-ban', '11.1 From polling to WebSocket', [E1, E2, E3, E4, E5]);
