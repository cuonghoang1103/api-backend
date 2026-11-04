/**
 * Chương 9 · 9.2 — WebSocket: nâng cấp, frame và nhịp tim (slug khung netdev-9-2-websocket).
 * Output thật: lab/out/c92-*.out.txt (dựng lại: bash lab/code/dung-output-ch9.sh) — máy chủ WebSocket thô RFC 6455 viết tay.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-09-2.mjs';

const L = card;
const IO = { mon: 'Socket.IO', khoa: 'socket-io' };

export default {
  title: '9.2 — WebSocket: upgrade, frames and heartbeats|||9.2 — WebSocket: nâng cấp, frame và nhịp tim',
  slug: 'netdev-9-2-websocket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'WebSocket: một GET HTTP/1.1 với Upgrade ⇒ 101 Switching Protocols, rồi cùng kết nối TCP mang frame (hai chiều). Bắt tay Sec-WebSocket-Accept = base64(SHA-1(key + GUID cố định của RFC 6455)) — kiểm bằng tay. Sau 101 là frame (opcode text/binary/close/ping/pong, frame client che mặt nạ). Nhịp tim ping/pong giữ đường dây; proxy cắt socket IM theo idle timeout. Đo thật bằng một máy chủ WebSocket thô viết tay.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>WebSocket: upgrade, frames and heartbeats</h2>
<p class="lead">Everything so far has been one-way or faked two-way on top of request/response. WebSocket is the real thing: after a short handshake, one TCP connection carries messages <em>both</em> ways, with almost no per-message overhead — the backbone of chat, multiplayer games, live collaboration and trading screens. And like HTTP/1.1, it is simple enough to read on the wire. This lesson builds a WebSocket server by hand (no library) so you can watch the upgrade, verify the handshake with a pocket calculation, and see the frames flow.</p>

<h3>The upgrade: an HTTP request that becomes something else</h3>
<p>A WebSocket does not have its own port or its own start — it begins as an ordinary HTTP/1.1 <code>GET</code> that asks to switch protocols. <code>curl</code> can send exactly those headers:</p>
${run('c92-ws', 'curl', 1, { max: 6 })}
<p>The request carried <code>Upgrade: websocket</code> and <code>Connection: Upgrade</code>; the server answered <strong><code>101 Switching Protocols</code></strong>. From that byte on, the <em>same</em> TCP connection stops being HTTP and starts carrying WebSocket frames. This is why WebSocket works everywhere HTTP does, including through port 443 and TLS (<code>wss://</code>).</p>

<h3>The handshake you can verify by hand</h3>
<p>Notice the <code>Sec-WebSocket-Accept</code> in that reply. It is not random: the client sends a <code>Sec-WebSocket-Key</code>, and the server must return</p>
<ul>
<li><code>Sec-WebSocket-Accept = base64( SHA-1( key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" ) )</code></li>
</ul>
<p>That GUID is a fixed constant written into RFC 6455. The curl above sent the RFC's own sample key, <code>dGhlIHNhbXBsZSBub25jZQ==</code>, and got back exactly the RFC's sample accept, <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>. The accept value is <strong>not</strong> authentication — it proves the server genuinely understood the WebSocket upgrade and is not a cache or proxy blindly echoing a 101. A client that receives the wrong accept must abort the connection.</p>

<h3>After 101, it is frames — not HTTP</h3>
<p>Past the handshake, there are no more headers. Our hand-written client now switches to WebSocket framing, sends a message, and exchanges a heartbeat:</p>
${run('c92-ws', 'node', 1)}
<p>It sent a text frame (<code>hello LabFlow</code>), received the server's echo, sent a <strong>ping</strong> and got a <strong>pong</strong> back, then closed cleanly. All of it on one connection, in both directions, with a tiny per-frame header instead of a full set of HTTP headers each time.</p>

<h3>Frames, masking and opcodes</h3>
${kv([
  ['0x1 text / 0x2 binary', 'A data frame: UTF-8 text or raw bytes.'],
  ['0x8 close', 'Begin the closing handshake (then the TCP connection ends).'],
  ['0x9 ping / 0xA pong', 'Heartbeat: a ping must be answered with a pong.'],
  ['FIN bit', 'Marks the final frame of a message (a message can span frames).'],
  ['Mask', 'Client→server frames are XOR-masked with a random key; server→client are not.'],
])}
<p>You will almost never write framing by hand — a library does it — but having seen it, "my socket is sending gibberish" and "why are client frames masked" stop being mysteries. The masking rule exists to stop malicious frames from being misread by old, WebSocket-unaware proxies as something else.</p>

<div class="pitfall co-tieu-de">
<p><strong>A WebSocket that goes quiet gets cut — heartbeat or it drops every ~60 seconds.</strong> To a proxy or load balancer, an idle connection with no bytes flowing looks dead, so it closes it after an idle timeout (commonly 60 s on nginx, cloud LBs and Cloudflare). The symptom — "the socket drops exactly every minute" — is not a bug in your code; it is silence. Fix it from both ends: send a <strong>ping every 20–30 s</strong> so the line is never idle, treat a missing <strong>pong</strong> as a dead peer and reconnect, and raise the proxy's timeout (nginx <code>proxy_read_timeout</code> on the WebSocket <code>location</code>) above your heartbeat interval.</p>
</div>
${cauNoi('en', { ...IO, bai: 'io-6-5-vs-http', so: '6.5', ten: 'When to use HTTP instead', giong: 'deciding between a WebSocket and plain HTTP/SSE', khac: 'the Socket.IO course argues the trade-off at the application level (events, rooms, acknowledgements)', them: 'the raw RFC 6455 protocol underneath socket.io — the 101 upgrade, the SHA-1 accept, and the frames you read by hand here' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> prove to yourself that a WebSocket is "just" an HTTP upgrade plus frames, and explain a socket that drops every minute.</p>
<ol>
<li>Bring up the lab: <code>bash lab/code/dung-output-ch9.sh</code> starts the raw WebSocket server on <code>:5200</code>.</li>
<li>Send the upgrade with <code>curl</code> (the sample key) and confirm the <code>101</code> and the exact <code>Sec-WebSocket-Accept</code>.</li>
<li>Run the raw client (<code>node ch09/ws-client.mjs</code>) and identify the text echo, the ping and the pong.</li>
<li>Explain, in one line each, what the <code>101</code> means, why the accept is deterministic, and why an idle socket drops at ~60 s.</li>
</ol>
<p><strong>Done when:</strong> you have a real <code>101</code> with the RFC sample accept, a frame exchange with a pong, and three one-line explanations — the upgrade switches the connection off HTTP, the accept is <code>SHA-1(key+GUID)</code> so it is verifiable, and idle connections are killed by proxy timeouts (so you heartbeat).</p>
<details><summary>Solution</summary>
<p>The <code>101 Switching Protocols</code> means the TCP connection stops speaking HTTP and carries frames. The accept is <code>base64(SHA-1(key + 258EAFA5-…))</code>, so the sample key <code>dGhlIHNhbXBsZSBub25jZQ==</code> always yields <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code> — deterministic, proving the server understood the upgrade. The frame exchange shows a text echo and a ping answered by a pong. A socket with no traffic is closed by proxy/LB idle timeouts (~60 s); the fix is a periodic ping and a longer <code>proxy_read_timeout</code>.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['101 Switching Protocols', 'The response that turns an HTTP connection into a WebSocket.'],
  ['Upgrade / Connection', 'The request headers that ask to switch to WebSocket.'],
  ['Sec-WebSocket-Accept', 'base64(SHA-1(key + fixed GUID)) — proves the server understood.'],
  ['Frame', 'A small header (FIN, opcode, length, mask) plus payload — the unit after 101.'],
  ['Opcode', 'text/binary/close/ping/pong — what a frame is.'],
  ['Heartbeat (ping/pong)', 'Periodic frames that keep the line alive and detect a dead peer.'],
  ['Idle timeout', 'A proxy/LB closing a connection with no traffic (often ~60 s).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A WebSocket starts as an HTTP/1.1 <code>Upgrade</code> → <strong>101 Switching Protocols</strong>; then the TCP connection carries frames both ways.</li>
<li><code>Sec-WebSocket-Accept</code> = <code>base64(SHA-1(key + fixed GUID))</code> — deterministic, proving the server understood the upgrade.</li>
<li>After 101 it is <strong>frames</strong>, not HTTP: opcodes for text/binary/close/ping/pong; client→server frames are masked.</li>
<li><strong>Ping/pong heartbeats</strong> keep the line alive and detect a dead peer.</li>
<li>A silent socket is cut on a proxy <strong>idle timeout</strong> — heartbeat and raise <code>proxy_read_timeout</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc6455.html', '📄', 'RFC 6455 — The WebSocket Protocol', 'The upgrade, the Sec-WebSocket-Accept formula, frames and opcodes.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/API/WebSockets_API', '📘', 'MDN — WebSockets API', 'Using WebSocket from the browser: open, message, close, binary.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/API/WebSockets_API/Writing_WebSocket_servers', '📘', 'MDN — Writing WebSocket servers', 'The handshake and frame format from the server side, step by step.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>WebSocket: nâng cấp, frame và nhịp tim</h2>
<p class="lead">Mọi thứ tới giờ là một chiều hoặc hai-chiều giả trên nền hỏi/đáp. WebSocket là thứ thật: sau một cú bắt tay ngắn, một kết nối TCP mang tin nhắn <em>cả hai</em> chiều, gần như không phí mỗi tin nhắn — xương sống của chat, game nhiều người, cộng tác trực tiếp và màn hình giao dịch. Và như HTTP/1.1, nó đủ đơn giản để đọc trên dây. Bài này dựng một máy chủ WebSocket bằng tay (không thư viện) để bạn nhìn cú nâng, kiểm cú bắt tay bằng một phép tính bỏ túi, và thấy các khung chảy.</p>

<h3>Cú nâng: một yêu cầu HTTP trở thành thứ khác</h3>
<p>Một WebSocket không có cổng riêng hay khởi đầu riêng — nó bắt đầu như một <code>GET</code> HTTP/1.1 bình thường xin chuyển giao thức. <code>curl</code> gửi được đúng các header đó:</p>
${run('c92-ws', 'curl', 1, { max: 6 })}
<p>Yêu cầu mang <code>Upgrade: websocket</code> và <code>Connection: Upgrade</code>; máy chủ đáp <strong><code>101 Switching Protocols</code></strong>. Từ byte đó, <em>cùng</em> kết nối TCP thôi là HTTP và bắt đầu mang các khung WebSocket. Đây là lý do WebSocket chạy ở mọi nơi HTTP chạy, kể cả qua cổng 443 và TLS (<code>wss://</code>).</p>

<h3>Cú bắt tay bạn kiểm được bằng tay</h3>
<p>Để ý <code>Sec-WebSocket-Accept</code> trong câu trả lời đó. Nó không ngẫu nhiên: client gửi một <code>Sec-WebSocket-Key</code>, và máy chủ phải trả</p>
<ul>
<li><code>Sec-WebSocket-Accept = base64( SHA-1( key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" ) )</code></li>
</ul>
<p>GUID đó là một hằng số cố định ghi trong RFC 6455. curl ở trên gửi khoá mẫu của chính RFC, <code>dGhlIHNhbXBsZSBub25jZQ==</code>, và nhận lại đúng accept mẫu của RFC, <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>. Giá trị accept <strong>không</strong> phải xác thực — nó chứng minh máy chủ thật sự hiểu cú nâng WebSocket và không phải một cache hay proxy vọng lại một 101 mù quáng. Một client nhận accept sai phải huỷ kết nối.</p>

<h3>Sau 101, là frame — không phải HTTP</h3>
<p>Qua cú bắt tay, không còn header nào. Client viết tay của ta nay chuyển sang đóng khung WebSocket, gửi một tin nhắn, và trao đổi một nhịp tim:</p>
${run('c92-ws', 'node', 1)}
<p>Nó gửi một khung text (<code>hello LabFlow</code>), nhận echo của máy chủ, gửi một <strong>ping</strong> và nhận lại một <strong>pong</strong>, rồi đóng gọn. Tất cả trên một kết nối, cả hai chiều, với một header mỗi-khung tí hon thay vì một bộ header HTTP đầy đủ mỗi lần.</p>

<h3>Frame, mặt nạ và opcode</h3>
${kv([
  ['0x1 text / 0x2 binary', 'Một khung dữ liệu: văn bản UTF-8 hay byte thô.'],
  ['0x8 close', 'Bắt đầu cú bắt tay đóng (rồi kết nối TCP kết thúc).'],
  ['0x9 ping / 0xA pong', 'Nhịp tim: một ping phải được đáp bằng một pong.'],
  ['Bit FIN', 'Đánh dấu khung cuối của một tin nhắn (một tin có thể qua nhiều khung).'],
  ['Mặt nạ', 'Khung client→máy chủ XOR với một khoá ngẫu nhiên; máy chủ→client thì không.'],
])}
<p>Bạn gần như không bao giờ viết đóng khung bằng tay — một thư viện làm — nhưng đã thấy nó, "socket của tôi gửi chữ vô nghĩa" và "vì sao khung client che mặt nạ" thôi là bí ẩn. Luật che mặt nạ tồn tại để ngăn các khung ác ý bị các proxy cũ, không biết WebSocket, đọc nhầm thành thứ khác.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một WebSocket im lặng bị cắt — nhịp tim không thì rớt mỗi ~60 giây.</strong> Với một proxy hay cân bằng tải, một kết nối im không byte nào chảy trông như chết, nên nó đóng sau một idle timeout (thường 60 giây trên nginx, cloud LB và Cloudflare). Triệu chứng — "socket rớt đúng mỗi phút" — không phải lỗi trong mã bạn; đó là sự im lặng. Sửa từ cả hai đầu: gửi một <strong>ping mỗi 20–30 giây</strong> để đường dây không bao giờ im, coi một <strong>pong</strong> thiếu là một đối tác chết và nối lại, và nâng timeout của proxy (nginx <code>proxy_read_timeout</code> trên <code>location</code> WebSocket) cao hơn khoảng nhịp tim của bạn.</p>
</div>
${cauNoi('vi', { ...IO, bai: 'io-6-5-vs-http', so: '6.5', ten: 'Khi nào dùng HTTP thay vì', giong: 'quyết giữa một WebSocket và HTTP/SSE thuần', khac: 'khoá Socket.IO lập luận đánh đổi ở mức ứng dụng (sự kiện, phòng, xác nhận)', them: 'giao thức thô RFC 6455 bên dưới socket.io — cú nâng 101, accept SHA-1, và các khung bạn đọc bằng tay ở đây' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> tự chứng minh rằng một WebSocket "chỉ là" một cú nâng HTTP cộng frame, và giải thích một socket rớt mỗi phút.</p>
<ol>
<li>Dựng lab: <code>bash lab/code/dung-output-ch9.sh</code> khởi động máy chủ WebSocket thô trên <code>:5200</code>.</li>
<li>Gửi cú nâng với <code>curl</code> (khoá mẫu) và xác nhận <code>101</code> cùng <code>Sec-WebSocket-Accept</code> chính xác.</li>
<li>Chạy client thô (<code>node ch09/ws-client.mjs</code>) và nhận ra echo text, ping và pong.</li>
<li>Giải thích, mỗi cái một dòng, <code>101</code> nghĩa gì, vì sao accept tất định, và vì sao một socket im rớt ở ~60 giây.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một <code>101</code> thật với accept mẫu của RFC, một trao đổi frame với một pong, và ba giải thích một dòng — cú nâng chuyển kết nối khỏi HTTP, accept là <code>SHA-1(key+GUID)</code> nên kiểm được, và kết nối im bị idle timeout của proxy giết (nên bạn nhịp tim).</p>
<details><summary>Lời giải</summary>
<p><code>101 Switching Protocols</code> nghĩa là kết nối TCP thôi nói HTTP và mang frame. accept là <code>base64(SHA-1(key + 258EAFA5-…))</code>, nên khoá mẫu <code>dGhlIHNhbXBsZSBub25jZQ==</code> luôn cho ra <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code> — tất định, chứng minh máy chủ hiểu cú nâng. Trao đổi frame cho thấy một echo text và một ping được đáp bằng một pong. Một socket không lưu lượng bị idle timeout của proxy/LB đóng (~60 giây); cách sửa là một ping định kỳ và một <code>proxy_read_timeout</code> dài hơn.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['101 Switching Protocols', 'Câu trả lời biến một kết nối HTTP thành một WebSocket.'],
  ['Upgrade / Connection', 'Các header yêu cầu xin chuyển sang WebSocket.'],
  ['Sec-WebSocket-Accept', 'base64(SHA-1(key + GUID cố định)) — chứng minh máy chủ hiểu.'],
  ['Frame', 'Một header nhỏ (FIN, opcode, độ dài, mặt nạ) cộng payload — đơn vị sau 101.'],
  ['Opcode', 'text/binary/close/ping/pong — một khung là gì.'],
  ['Nhịp tim (ping/pong)', 'Các khung định kỳ giữ đường dây sống và phát hiện một đối tác chết.'],
  ['Idle timeout', 'Một proxy/LB đóng một kết nối không lưu lượng (thường ~60 giây).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một WebSocket bắt đầu như một <code>Upgrade</code> HTTP/1.1 → <strong>101 Switching Protocols</strong>; rồi kết nối TCP mang frame cả hai chiều.</li>
<li><code>Sec-WebSocket-Accept</code> = <code>base64(SHA-1(key + GUID cố định))</code> — tất định, chứng minh máy chủ hiểu cú nâng.</li>
<li>Sau 101 là <strong>frame</strong>, không phải HTTP: opcode cho text/binary/close/ping/pong; khung client→máy chủ che mặt nạ.</li>
<li><strong>Nhịp tim ping/pong</strong> giữ đường dây sống và phát hiện một đối tác chết.</li>
<li>Một socket im bị cắt ở một <strong>idle timeout</strong> của proxy — nhịp tim và nâng <code>proxy_read_timeout</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc6455.html', '📄', 'RFC 6455 — Giao thức WebSocket', 'Cú nâng, công thức Sec-WebSocket-Accept, frame và opcode.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/API/WebSockets_API', '📘', 'MDN — WebSockets API', 'Dùng WebSocket từ trình duyệt: open, message, close, nhị phân.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/API/WebSockets_API/Writing_WebSocket_servers', '📘', 'MDN — Viết máy chủ WebSocket', 'Cú bắt tay và định dạng frame từ phía máy chủ, từng bước.', 'Mở')}
</div>
`,
};
