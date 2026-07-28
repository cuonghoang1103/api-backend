/**
 * Node.js — Chương 11: Realtime (WebSocket & Socket.IO).
 * Mọi output là đo thật: Node v22.21.0, ws 8.19.0, socket.io 4.8.3 + socket.io-client,
 * @socket.io/redis-adapter 8.3.0 + ioredis (Redis 7 trong Docker), express 5.2.1.
 * Cấu hình production lấy từ src/socket/messaging.socket.ts của chính cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 11 — Realtime with WebSocket and Socket.IO|||Chương 11 — Realtime với WebSocket và Socket.IO',
  description: 'Vì sao hỏi liên tục là cách đắt nhất để biết tin mới, WebSocket thật sự tốn bao nhiêu, Socket.IO mua gì bằng bộ nhớ, xác thực một lần nhưng phân quyền mọi lần, và chuyện gì xảy ra khi bạn chạy hai tiến trình.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — From asking repeatedly to being told: WebSocket|||11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket',
      slug: 'nodejs-11-1-websocket-co-ban',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-1-websocket-co-ban.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-1-websocket-co-ban.jpg',
        scenario: 'websocket',
        durationSeconds: 7,
        caption: { en: "The upgrade handshake, then messages both ways", vi: "Bắt tay nâng cấp, rồi tin nhắn đi hai chiều" },
      },
      type: 'VIDEO',
      description: 'Bắt tay Upgrade in ra nguyên văn, và phép đo trả lời câu hỏi "polling đắt tới mức nào": 799 byte cho mỗi lần hỏi mà câu trả lời là KHÔNG.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>From asking repeatedly to being told: WebSocket</h2>
<p class="lead">Every request so far in this course has been the client's idea. The browser asks, the server answers, the connection closes. That model has carried us through ten chapters and it breaks on exactly one requirement: <em>the server knows something first</em>. A message arrives, a friend comes online, a background job finishes. HTTP has no way to say so, so for twenty years we faked it by asking again and again. This lesson measures what that fake costs and what replaces it.</p>

<h3>Three ways to learn about something you did not ask for</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Polling</span><span class="lz-d">"anything new?" every N seconds. Simple, works everywhere, and pays full HTTP price for an answer that is almost always "no"</span></div>
  <div class="lz-step"><span class="lz-t">SSE (Server-Sent Events)</span><span class="lz-d">one long-lived HTTP response the server keeps writing into. One-way (server → client), plain HTTP, auto-reconnects. Perfect for notifications and progress bars</span></div>
  <div class="lz-step"><span class="lz-t">WebSocket</span><span class="lz-d">one TCP connection, both directions, tiny frames. The right answer when the client also talks back: chat, typing indicators, collaborative editing, games</span></div>
</div>
<p>Pick the weakest one that solves the problem. A "new post" banner does not need a bidirectional socket; a chat does.</p>

<h3>The handshake, printed byte for byte</h3>
<p>A WebSocket connection begins life as an ordinary HTTP GET. This is a real request captured by a raw <code>http</code> server:</p>
<div class="out">--- REQUEST BẮT TAY (client → server) ---
GET /socket HTTP/1.1
sec-websocket-version: 13
sec-websocket-key: O67OtnHy8iWBoa5aPG0r2w==
connection: Upgrade
upgrade: websocket
sec-websocket-extensions: permessage-deflate; client_max_window_bits
host: 127.0.0.1:4300

--- PHẢN HỒI BẮT TAY (server → client) ---
HTTP/1.1 101 Switching Protocols
upgrade: websocket
connection: Upgrade
sec-websocket-accept: Upm+pYUvMCSMenoyLWVjZht5jas=</div>
<p>Three consequences of that shape, and each one is a support ticket later. It is <strong>HTTP on the way in</strong>, so cookies, TLS, and your reverse proxy all apply — which is why authentication can reuse the same cookie as REST (lesson 11.3). It ends in <strong>101 Switching Protocols</strong>, so after that line the socket is no longer speaking HTTP; a proxy that does not understand <code>Upgrade</code> will hang or 400. And <code>sec-websocket-accept</code> is derived from the client's key with a fixed algorithm — it proves the peer really is a WebSocket server, not a cache replaying an old response.</p>
<p>Once open, a round trip is essentially free:</p>
<div class="out">RTT một vòng qua WS đã mở: 0,885ms</div>

<h3>Measurement 1 — what polling actually costs</h3>
<p>Twenty polls of a realistic endpoint — an authenticated <code>GET /api/v1/messages/unread</code> with a JWT cookie, a browser <code>User-Agent</code> and <code>Accept-Language</code>, over a <strong>keep-alive</strong> connection so we are being generous — where every answer is <code>{"unread":0,"messages":[]}</code>. Bytes counted at the TCP socket:</p>
<div class="out">A) POLLING — 20 lần hỏi "có tin mới không?" (đáp án: KHÔNG), keep-alive:
   client → server: 10.280 byte | server → client: 5.700 byte | tổng 15.980 byte
   trung bình mỗi lần: 799 byte</div>
<p>799 bytes to be told nothing happened. The response body is 47 bytes; the rest is headers — the cookie alone is ~250 bytes and it rides along on <em>every single poll</em>. And that is the best case: without keep-alive, add a TCP handshake and a TLS handshake per poll.</p>

<h3>Measurement 2 — the same information over a socket</h3>
<p>One handshake, then twenty <strong>real</strong> messages pushed down (not twenty "nothing happened"s):</p>
<div class="out">B) WEBSOCKET — bắt tay 1 lần rồi đẩy 20 tin THẬT xuống:
   client → server: 591 byte | server → client: 1.491 byte | tổng 2.082 byte
   payload gốc mỗi tin: 66 byte</div>
<p>Twenty deliveries for 2.082 bytes, handshake included — a WebSocket frame carrying 66 bytes of JSON costs about 68–72 bytes on the wire, because the frame header is 2–6 bytes and there are no headers, no cookies, no URL. Compare like for like: polling spent 15.980 bytes to deliver <em>zero</em> messages; the socket spent 2.082 to deliver twenty.</p>

<h3>Measurement 3 — multiply by your user count</h3>
<p>The per-request numbers look small until you put a real audience behind them. Ten thousand people with the tab open, polling every 3 seconds, for one hour:</p>
<div class="out">C) Quy đổi 1 GIỜ, 10.000 người dùng đang mở tab:
   polling 3 giây/lần: 8,93 GB, 12.000.000 request
   websocket rỗi     : chỉ bắt tay + ping/pong định kỳ, 0 request/giây</div>
<p>Twelve million requests an hour, 8,93GB of traffic, to transmit nothing. Each of those requests also runs your auth middleware, hits the database for the session, and occupies an event-loop tick. This is the number that turns "realtime is complicated" into "polling is unaffordable" — and note it gets <em>worse</em> as you shorten the interval, which is exactly what people do when they want it to feel faster.</p>

<div class="callout">
<p>Polling is not always wrong. If an event happens once an hour and a minute of latency is fine, a one-minute poll is 60 requests an hour per user and needs no new infrastructure. The trap is using a 2-second poll to imitate realtime — that is where you pay socket-level cost for polling-level latency.</p>
</div>

<h3>The smallest useful server</h3>
<pre><code><span class="tok-kw">import</span> { WebSocketServer } <span class="tok-kw">from</span> <span class="tok-str">'ws'</span>;
<span class="tok-kw">const</span> server = http.createServer(app);        <span class="tok-cmt">// CÙNG server HTTP với Express</span>
<span class="tok-kw">const</span> wss = <span class="tok-kw">new</span> WebSocketServer({ server });

wss.on(<span class="tok-str">'connection'</span>, (ws, req) =&gt; {
  ws.on(<span class="tok-str">'message'</span>, (data) =&gt; {
    <span class="tok-cmt">// data là Buffer — KHÔNG phải object. Bạn tự chọn định dạng.</span>
    <span class="tok-kw">const</span> msg = JSON.parse(data.toString());
    ws.send(JSON.stringify({ echo: msg }));
  });
  ws.on(<span class="tok-str">'close'</span>, () =&gt; { <span class="tok-cmt">/* dọn dẹp */</span> });
});
server.listen(<span class="tok-num">3001</span>);</code></pre>
<p>Note it shares the HTTP server. One port, one TLS certificate, one reverse-proxy rule. The upgrade only happens for requests carrying the <code>Upgrade</code> header; everything else is still Express.</p>

<div class="pitfall">
<p><strong>Five things that bite on day one.</strong> (1) <strong>The reverse proxy</strong>: nginx needs <code>proxy_http_version 1.1</code> plus <code>proxy_set_header Upgrade $http_upgrade;</code> and <code>Connection "upgrade"</code>, or the handshake dies with a 400 and your local dev works fine. (2) <code>ws.send()</code> takes strings/buffers, not objects — sending an object silently transmits <code>[object Object]</code>. (3) An idle proxy timeout (nginx default <code>proxy_read_timeout 60s</code>) kills a quiet socket; heartbeats are what keep it alive (lesson 11.3). (4) There is no built-in reconnect in raw <code>ws</code> — a laptop that sleeps comes back with a dead socket and no events. (5) A WebSocket does not send cookies on <em>frames</em>, only on the handshake, so authorization state must be captured at connect time.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The socket layer lives in <code>src/socket/messaging.socket.ts</code> and attaches to the same HTTP server Express uses: <code>const server = http.createServer(app)</code> in <code>src/index.ts</code>, then <code>initSocketServer(server)</code>. It is Socket.IO rather than raw <code>ws</code> — the next lesson measures what that choice costs — configured with <code>transports: ['websocket', 'polling']</code>, keeping the long-poll fallback on purpose: the comment in the code says WebSocket-only "would break users behind corporate proxies that strip the upgrade header". The events it carries are the ordinary product surface: <code>thread:new-message</code>, <code>thread:read</code>, <code>presence:update</code>, <code>social:notification</code>, <code>post:reacted</code>, and a deliberately tiny <code>feed:has-new</code> that carries only a count — the client then calls REST to fetch the actual posts, so the socket payload stays small no matter how big the feed is.</p>
</div>

<h3>What to take away</h3>
<p>WebSocket is not "faster HTTP" — it is a different question. Polling asks; a socket is told. The handshake is HTTP so everything you know about cookies and proxies still applies, and after 101 the per-message cost drops to almost nothing. Use SSE when the traffic is one-way, and keep polling for anything that genuinely changes once an hour.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-936" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 936 — WebSockets &amp; Realtime Fundamentals</span><span class="lc-sub">10 bài tập: bắt tay, khung tin, và vòng đời một kết nối.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-614" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 614 — WebSocket and Real-Time Communication</span><span class="lc-sub">10 bài tập: WebSocket trong một API Express thật.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Từ hỏi đi hỏi lại tới được báo: WebSocket</h2>
<p class="lead">Mọi request từ đầu khoá tới giờ đều là ý của client. Trình duyệt hỏi, máy chủ trả lời, kết nối đóng. Mô hình đó cõng chúng ta qua mười chương và gãy ở đúng một yêu cầu: <em>máy chủ biết trước một chuyện gì đó</em>. Một tin nhắn tới, một người bạn vừa online, một tác vụ nền vừa xong. HTTP không có cách nào nói ra, nên suốt hai mươi năm chúng ta giả vờ bằng cách hỏi đi hỏi lại. Bài này đo xem trò giả vờ đó tốn bao nhiêu và thứ gì thay thế nó.</p>

<h3>Ba cách để biết một chuyện mà bạn không hỏi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Polling (hỏi liên tục)</span><span class="lz-d">"có gì mới không?" mỗi N giây. Đơn giản, chạy ở đâu cũng được, và trả nguyên giá HTTP cho một câu trả lời gần như luôn là "không"</span></div>
  <div class="lz-step"><span class="lz-t">SSE (Server-Sent Events)</span><span class="lz-d">một phản hồi HTTP sống lâu mà máy chủ cứ ghi thêm vào. Một chiều (server → client), thuần HTTP, tự kết nối lại. Hoàn hảo cho thông báo và thanh tiến trình</span></div>
  <div class="lz-step"><span class="lz-t">WebSocket</span><span class="lz-d">một kết nối TCP, hai chiều, khung tin bé xíu. Câu trả lời đúng khi client cũng cần nói lại: chat, báo "đang nhập", soạn thảo cùng nhau, game</span></div>
</div>
<p>Hãy chọn thứ YẾU NHẤT mà vẫn giải quyết được bài toán. Một banner "có bài mới" không cần socket hai chiều; một khung chat thì cần.</p>

<h3>Cái bắt tay, in ra từng byte</h3>
<p>Một kết nối WebSocket bắt đầu đời mình như một request HTTP GET bình thường. Đây là request THẬT bắt được bằng một server <code>http</code> thô:</p>
<div class="out">--- REQUEST BẮT TAY (client → server) ---
GET /socket HTTP/1.1
sec-websocket-version: 13
sec-websocket-key: O67OtnHy8iWBoa5aPG0r2w==
connection: Upgrade
upgrade: websocket
sec-websocket-extensions: permessage-deflate; client_max_window_bits
host: 127.0.0.1:4300

--- PHẢN HỒI BẮT TAY (server → client) ---
HTTP/1.1 101 Switching Protocols
upgrade: websocket
connection: Upgrade
sec-websocket-accept: Upm+pYUvMCSMenoyLWVjZht5jas=</div>
<p>Ba hệ quả của cái hình dạng đó, và mỗi cái đều là một phiếu hỗ trợ về sau. Lúc đi vào nó <strong>vẫn là HTTP</strong>, nên cookie, TLS và reverse proxy của bạn đều có hiệu lực — đó là lý do phần xác thực dùng lại được đúng cái cookie của REST (bài 11.3). Nó kết thúc bằng <strong>101 Switching Protocols</strong>, nên sau dòng đó socket không còn nói HTTP nữa; một proxy không hiểu <code>Upgrade</code> sẽ làm nó treo hoặc trả 400. Và <code>sec-websocket-accept</code> được suy ra từ khoá của client bằng một thuật toán cố định — nó chứng minh đầu bên kia đúng là một máy chủ WebSocket, không phải một tầng cache đang phát lại phản hồi cũ.</p>
<p>Khi đã mở rồi, một vòng đi-về gần như miễn phí:</p>
<div class="out">RTT một vòng qua WS đã mở: 0,885ms</div>

<h3>Phép đo 1 — polling thật ra tốn bao nhiêu</h3>
<p>Hai mươi lần hỏi một endpoint thực tế — <code>GET /api/v1/messages/unread</code> có xác thực, kèm cookie JWT, <code>User-Agent</code> của trình duyệt và <code>Accept-Language</code>, đi trên kết nối <strong>keep-alive</strong> cho rộng lượng — mà mọi câu trả lời đều là <code>{"unread":0,"messages":[]}</code>. Byte đếm ở tầng socket TCP:</p>
<div class="out">A) POLLING — 20 lần hỏi "có tin mới không?" (đáp án: KHÔNG), keep-alive:
   client → server: 10.280 byte | server → client: 5.700 byte | tổng 15.980 byte
   trung bình mỗi lần: 799 byte</div>
<p>799 byte để được báo rằng không có gì xảy ra. Thân phản hồi chỉ 47 byte; phần còn lại là header — riêng cookie đã ~250 byte và nó đi kèm trong <em>từng lần hỏi một</em>. Mà đó mới là trường hợp tốt nhất: bỏ keep-alive đi thì mỗi lần hỏi còn cộng thêm một lần bắt tay TCP và một lần bắt tay TLS.</p>

<h3>Phép đo 2 — cũng chừng ấy thông tin nhưng đi qua socket</h3>
<p>Một lần bắt tay, rồi hai mươi tin nhắn <strong>THẬT</strong> được đẩy xuống (không phải hai mươi câu "không có gì"):</p>
<div class="out">B) WEBSOCKET — bắt tay 1 lần rồi đẩy 20 tin THẬT xuống:
   client → server: 591 byte | server → client: 1.491 byte | tổng 2.082 byte
   payload gốc mỗi tin: 66 byte</div>
<p>Hai mươi lần giao tin hết 2.082 byte, tính cả bắt tay — một khung WebSocket chở 66 byte JSON tốn khoảng 68–72 byte trên đường truyền, vì phần đầu khung chỉ 2–6 byte và không có header, không cookie, không URL. So sánh cho công bằng: polling tiêu 15.980 byte để giao <em>không</em> tin nào; socket tiêu 2.082 byte để giao hai mươi tin.</p>

<h3>Phép đo 3 — nhân với số người dùng của bạn</h3>
<p>Con số cho mỗi request trông bé cho tới khi bạn đặt một lượng khán giả thật đằng sau nó. Mười nghìn người mở tab, hỏi 3 giây một lần, trong một giờ:</p>
<div class="out">C) Quy đổi 1 GIỜ, 10.000 người dùng đang mở tab:
   polling 3 giây/lần: 8,93 GB, 12.000.000 request
   websocket rỗi     : chỉ bắt tay + ping/pong định kỳ, 0 request/giây</div>
<p>Mười hai triệu request một giờ, 8,93GB lưu lượng, để truyền đi con số không. Mỗi request trong đó còn chạy middleware xác thực của bạn, hỏi cơ sở dữ liệu về phiên, và chiếm một nhịp của event loop. Đây là con số biến câu "realtime phức tạp lắm" thành câu "polling không trả nổi tiền" — và để ý là nó còn <em>tệ hơn</em> khi bạn rút ngắn chu kỳ, mà rút ngắn chu kỳ đúng là việc người ta làm khi muốn nó "mượt hơn".</p>

<div class="callout">
<p>Polling không phải lúc nào cũng sai. Nếu một sự kiện xảy ra mỗi giờ một lần và trễ một phút vẫn ổn, thì hỏi mỗi phút một lần là 60 request/giờ/người và chẳng cần hạ tầng mới nào. Cái bẫy là dùng chu kỳ 2 giây để BẮT CHƯỚC realtime — đó là chỗ bạn trả cái giá của socket mà nhận độ trễ của polling.</p>
</div>

<h3>Máy chủ nhỏ nhất còn dùng được</h3>
<pre><code><span class="tok-kw">import</span> { WebSocketServer } <span class="tok-kw">from</span> <span class="tok-str">'ws'</span>;
<span class="tok-kw">const</span> server = http.createServer(app);        <span class="tok-cmt">// CÙNG server HTTP với Express</span>
<span class="tok-kw">const</span> wss = <span class="tok-kw">new</span> WebSocketServer({ server });

wss.on(<span class="tok-str">'connection'</span>, (ws, req) =&gt; {
  ws.on(<span class="tok-str">'message'</span>, (data) =&gt; {
    <span class="tok-cmt">// data là Buffer — KHÔNG phải object. Bạn tự chọn định dạng.</span>
    <span class="tok-kw">const</span> msg = JSON.parse(data.toString());
    ws.send(JSON.stringify({ echo: msg }));
  });
  ws.on(<span class="tok-str">'close'</span>, () =&gt; { <span class="tok-cmt">/* dọn dẹp */</span> });
});
server.listen(<span class="tok-num">3001</span>);</code></pre>
<p>Để ý nó dùng chung server HTTP. Một cổng, một chứng chỉ TLS, một luật reverse proxy. Việc nâng cấp giao thức chỉ xảy ra với những request mang header <code>Upgrade</code>; mọi thứ còn lại vẫn là Express.</p>

<div class="pitfall">
<p><strong>Năm thứ cắn bạn ngay ngày đầu.</strong> (1) <strong>Reverse proxy</strong>: nginx cần <code>proxy_http_version 1.1</code> cộng <code>proxy_set_header Upgrade $http_upgrade;</code> và <code>Connection "upgrade"</code>, nếu không cái bắt tay chết với lỗi 400 trong khi máy bạn chạy vẫn ngon. (2) <code>ws.send()</code> nhận chuỗi/buffer chứ không nhận object — gửi thẳng một object thì nó âm thầm truyền đi <code>[object Object]</code>. (3) Thời gian chờ nhàn rỗi của proxy (nginx mặc định <code>proxy_read_timeout 60s</code>) giết một socket đang im lặng; nhịp tim là thứ giữ nó sống (bài 11.3). (4) <code>ws</code> thuần KHÔNG có sẵn cơ chế kết nối lại — một chiếc laptop ngủ dậy sẽ mang theo một socket chết và không sự kiện nào cả. (5) WebSocket không gửi cookie theo <em>từng khung tin</em>, chỉ gửi lúc bắt tay, nên trạng thái phân quyền phải được chốt ngay lúc kết nối.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Tầng socket nằm ở <code>src/socket/messaging.socket.ts</code> và gắn vào đúng cái server HTTP mà Express đang dùng: <code>const server = http.createServer(app)</code> trong <code>src/index.ts</code>, rồi <code>initSocketServer(server)</code>. Nó dùng Socket.IO chứ không phải <code>ws</code> thuần — bài kế tiếp đo xem lựa chọn đó tốn gì — và cấu hình <code>transports: ['websocket', 'polling']</code>, cố tình giữ lại đường lui long-poll: comment trong code ghi rằng chỉ-WebSocket "sẽ làm hỏng trải nghiệm của người dùng ngồi sau proxy công ty có bóc header upgrade". Các sự kiện nó chở đều là bề mặt sản phẩm bình thường: <code>thread:new-message</code>, <code>thread:read</code>, <code>presence:update</code>, <code>social:notification</code>, <code>post:reacted</code>, và một sự kiện <code>feed:has-new</code> cố ý làm thật bé chỉ mang theo một con số đếm — client sau đó gọi REST để lấy bài viết thật, nhờ vậy payload của socket luôn nhỏ bất kể feed to tới đâu.</p>
</div>

<h3>Đọng lại gì</h3>
<p>WebSocket không phải "HTTP nhanh hơn" — nó là một câu hỏi khác. Polling thì đi hỏi; socket thì được báo. Cái bắt tay là HTTP nên mọi hiểu biết của bạn về cookie và proxy vẫn dùng được, và sau mã 101 thì giá mỗi tin nhắn rơi xuống gần như bằng không. Dùng SSE khi luồng chỉ một chiều, và cứ giữ polling cho những thứ thật sự chỉ đổi mỗi giờ một lần.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-936" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 936 — WebSockets &amp; Realtime Fundamentals</span><span class="lc-sub">10 bài tập: bắt tay, khung tin, và vòng đời một kết nối.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-614" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 614 — WebSocket and Real-Time Communication</span><span class="lc-sub">10 bài tập: WebSocket trong một API Express thật.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — ws or Socket.IO: what convenience costs|||11.2 — ws hay Socket.IO: cái giá của sự tiện nghi',
      slug: 'nodejs-11-2-ws-vs-socketio-rooms',
      type: 'VIDEO',
      description: 'Socket.IO thêm gì so với WebSocket trần, và cái giá đo được: 5.000 kết nối tốn +51MB với ws, +110MB với Socket.IO — cùng mô hình room đã cứu feed khỏi một vụ phát tin toàn cục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>ws or Socket.IO: what convenience costs</h2>
<p class="lead">Raw WebSocket gives you a pipe. Everything a real product needs on top of that pipe — reconnecting after a tunnel, knowing which sockets belong to which conversation, a fallback for the user behind a hostile proxy, waiting for an acknowledgement — you either write yourself or you adopt. Socket.IO is the common answer, and it is not free. This lesson measures the difference at 1.000 and 5.000 connections and then builds the abstraction that matters most: rooms.</p>

<h3>What Socket.IO is, precisely</h3>
<p>It is a protocol <em>on top of</em> WebSocket, not a wrapper around it. That distinction is why a Socket.IO client cannot talk to a raw <code>ws</code> server, and vice versa. What you get for that incompatibility:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tự kết nối lại</span><span class="v">exponential backoff, built in. In raw <code>ws</code> you write it — and you will get the backoff wrong the first time</span></div>
  <div class="kv"><span class="k">Đường lui (fallback)</span><span class="v">if the upgrade is blocked, it runs over HTTP long-polling instead. The user never learns their office proxy is broken</span></div>
  <div class="kv"><span class="k">Sự kiện có tên + ack</span><span class="v"><code>socket.emit('thread:join', id, (res) =&gt; …)</code> — named events and a callback that fires when the other side has actually handled it</span></div>
  <div class="kv"><span class="k">Room và namespace</span><span class="v">the addressing model this whole lesson is really about</span></div>
  <div class="kv"><span class="k">Adapter</span><span class="v">a pluggable way to make broadcasts cross process boundaries — lesson 11.4</span></div>
</div>

<h3>Measurement 1 — memory per connection</h3>
<p>Identical hardware, identical payloads. Server RSS measured with zero connections, then again once every client is connected:</p>
<div class="out">                       RSS nền   1.000 kết nối   5.000 kết nối
ws (thuần)             69,9MB    82,2MB (+12,3)  121,1MB (+51,2)
socket.io              70,3MB   106,6MB (+36,3)  179,9MB (+109,6)

thời gian mở 5.000 kết nối:  ws 1.107ms  |  socket.io 1.769ms</div>
<p>Roughly <strong>10KB per connection for ws and 22KB for Socket.IO</strong>. Both are small — 5.000 concurrent users cost 51MB or 110MB, which any VPS can hold. Put that next to chapter 10's numbers for perspective: four people uploading 120MB videos into memory cost 729MB, seven times what 5.000 idle sockets cost. Connections are cheap; what flows through them is not.</p>

<h3>Measurement 2 — broadcasting to everyone</h3>
<p>One message to every connected client, timed from the server's <code>emit()</code> call to the last client's receipt:</p>
<div class="out">1.000 client:  ws emit 17,0ms   → tin đầu 4,9ms, tin cuối 25,3ms
5.000 client:  ws emit 37,6ms   → tin đầu 4,0ms, tin cuối 55,1ms
5.000 client:  io emit 49,9ms   → tin đầu 3,1ms, tin cuối 91,7ms</div>
<p>Read the gap between "first" and "last". A broadcast is a loop: the server writes to socket 1, then socket 2, and the five-thousandth client waits for 4.999 writes ahead of it. <code>emit()</code> returning in 37ms does not mean delivery took 37ms — it means the <em>event loop was blocked for 37ms</em> doing the fan-out, which is 37ms during which no HTTP request is served either. This is the realtime version of chapter 2's lesson, and it is why the shape of your rooms is a performance decision.</p>

<h3>Rooms: the addressing model</h3>
<p>A room is nothing more than a named set of sockets. Joining is a hash-set insert; emitting to a room iterates only that set. The design question is what you name them:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">user:&lt;id&gt;</span><span class="lz-d">every socket that belongs to this person — phone, laptop, three tabs. The right target for anything addressed to a HUMAN: notifications, unread counts</span></div>
  <div class="lz-node"><span class="lz-t">thread:&lt;id&gt;</span><span class="lz-d">the conversation. Both participants join; a new message goes here once instead of being addressed per person</span></div>
  <div class="lz-node"><span class="lz-t">post:&lt;id&gt;</span><span class="lz-d">the sockets currently LOOKING at this post. Scoped to what is on screen, not to who the user is</span></div>
  <div class="lz-node"><span class="lz-t">socket.id</span><span class="lz-d">every socket is automatically in a room named after itself — that is how a direct reply to one tab works</span></div>
</div>
<pre><code>io.on(<span class="tok-str">'connection'</span>, (socket) =&gt; {
  socket.join(<span class="tok-str">&#96;user:\${userId}&#96;</span>);                 <span class="tok-cmt">// mọi thiết bị của người này</span>
  socket.on(<span class="tok-str">'thread:join'</span>, (id) =&gt; socket.join(<span class="tok-str">&#96;thread:\${id}&#96;</span>));
});

io.to(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>).emit(<span class="tok-str">'thread:new-message'</span>, msg);   <span class="tok-cmt">// cả phòng</span>
socket.to(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>).emit(<span class="tok-str">'thread:typing'</span>, t);      <span class="tok-cmt">// cả phòng TRỪ mình</span>
io.to(<span class="tok-str">&#96;user:\${receiverId}&#96;</span>).emit(<span class="tok-str">'social:notification'</span>, n);   <span class="tok-cmt">// một người</span></code></pre>
<p>The difference between <code>io.to(room)</code> and <code>socket.to(room)</code> is one character and it is the bug behind "why do I see my own typing indicator": <code>io.to</code> includes the sender, <code>socket.to</code> excludes them.</p>

<h3>Acknowledgements: when you need to know it arrived</h3>
<p>An <code>emit</code> is fire-and-forget. Socket.IO's ack turns one into a request/response:</p>
<pre><code><span class="tok-cmt">// client</span>
socket.emit(<span class="tok-str">'thread:join'</span>, <span class="tok-num">42</span>, (res) =&gt; {
  <span class="tok-kw">if</span> (!res.ok) showError(res.reason);
});
<span class="tok-cmt">// server</span>
socket.on(<span class="tok-str">'thread:join'</span>, (id, ack) =&gt; {
  <span class="tok-kw">const</span> allowed = checkParticipant(id);
  <span class="tok-kw">if</span> (allowed) socket.join(<span class="tok-str">&#96;thread:\${id}&#96;</span>);
  ack?.({ ok: allowed, reason: allowed ? <span class="tok-kw">null</span> : <span class="tok-str">'NOT_PARTICIPANT'</span> });
});</code></pre>
<p>Use acks for anything the UI must react to. Without one, a rejected join looks exactly like a successful join that never delivers events — the client is left guessing.</p>

<h3>Which one should you pick</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chọn <code>ws</code> thuần</span><span class="lz-lnote">when the client is not a browser (a device, another server), the protocol is yours to define, or the connection count is enormous and the 12KB matters. You accept writing reconnect, heartbeat and routing yourself</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn Socket.IO</span><span class="lz-lnote">when browsers are the client and you want rooms, reconnection and cross-process broadcast without writing them. Cost: ~2× memory per connection and a protocol only its own client speaks</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Socket.IO, with the room scheme above — <code>user:&lt;id&gt;</code>, <code>admin:&lt;id&gt;</code>, <code>thread:&lt;id&gt;</code>, <code>post:&lt;id&gt;</code> — and two decisions worth stealing. First, <strong>thread rooms are auto-joined at connect</strong>: on every connection the server queries the user's threads once and joins all of them. That was a bugfix, not a design flourish; the comment in <code>messaging.socket.ts</code> records the symptom — a user sitting on <code>/messages</code> who had not clicked into a conversation received nothing, so the unread badge froze until they refreshed. Second, <strong><code>post:reacted</code> used to be a global <code>io.emit</code></strong>: every like on any post woke up every connected socket on the site. It now goes only to <code>post:&lt;id&gt;</code>, which the feed subscribes to for the posts currently in view (capped at 500 rooms per socket so a malicious client cannot join unbounded rooms). The measurement above explains why that mattered: a global emit is an O(all sockets) loop on the event loop for every single click of a like button. Presence went the same way — instead of broadcasting "user X is online" to everybody, the server computes an <em>audience</em> (friends ∪ chat peers) and emits only to those user rooms, because the old version was an O(N²) storm every time a deploy made everyone reconnect at once.</p>
</div>

<div class="pitfall">
<p><strong>Five room mistakes.</strong> (1) <code>io.emit()</code> as a habit — it is a broadcast to every socket on the server, and it will not show up as a problem until you have users. (2) Forgetting that <strong>rooms are lost on reconnect</strong>: a new connection means a new socket with no rooms, so joining must happen in the <code>connect</code> handler, not once at page load. (3) Using <code>socket.id</code> as a user identifier — it changes on every reconnect and one user has several. (4) Joining a room per entity the client asks for, with no cap: an attacker joins a million rooms and your memory is theirs. (5) Doing the fan-out yourself with a loop over <code>io.sockets.sockets</code> — that is the O(all sockets) pattern rooms exist to avoid.</p>
</div>

<h3>What to take away</h3>
<p>Socket.IO costs about twice the memory per connection and buys reconnection, fallback, acks and rooms. Connections themselves are cheap; broadcasts are not, because a fan-out is a loop on your event loop. Design the rooms so that every message reaches the smallest correct set of sockets — that one decision matters more than which library you picked.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-939" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 939 — Rooms &amp; Namespaces</span><span class="lc-sub">10 bài tập: mô hình địa chỉ của realtime.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-940" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 940 — Broadcasting &amp; Acknowledgements</span><span class="lc-sub">10 bài tập: phát tin đúng phạm vi và chờ xác nhận.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>ws hay Socket.IO: cái giá của sự tiện nghi</h2>
<p class="lead">WebSocket trần cho bạn một cái ống. Mọi thứ mà một sản phẩm thật cần đắp thêm lên cái ống đó — kết nối lại sau khi chui qua hầm, biết socket nào thuộc cuộc trò chuyện nào, một đường lui cho người dùng ngồi sau proxy khó tính, chờ một lời xác nhận — bạn hoặc tự viết, hoặc đi mượn. Socket.IO là câu trả lời phổ biến, và nó không miễn phí. Bài này đo phần chênh ở mức 1.000 và 5.000 kết nối, rồi dựng lên tầng trừu tượng quan trọng nhất: room.</p>

<h3>Socket.IO chính xác là cái gì</h3>
<p>Nó là một giao thức nằm <em>trên</em> WebSocket, không phải một lớp bọc quanh WebSocket. Chính điểm khác biệt đó là lý do client Socket.IO không nói chuyện được với server <code>ws</code> thuần, và ngược lại. Đổi lấy sự không tương thích ấy, bạn được:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tự kết nối lại</span><span class="v">có sẵn, kèm giãn cách tăng dần. Với <code>ws</code> thuần bạn phải tự viết — và lần đầu bạn sẽ viết sai phần giãn cách</span></div>
  <div class="kv"><span class="k">Đường lui (fallback)</span><span class="v">nếu việc nâng cấp giao thức bị chặn, nó chạy bằng HTTP long-polling. Người dùng không bao giờ phải biết proxy công ty họ hỏng</span></div>
  <div class="kv"><span class="k">Sự kiện có tên + ack</span><span class="v"><code>socket.emit('thread:join', id, (res) =&gt; …)</code> — sự kiện có tên và một callback chỉ chạy khi đầu kia ĐÃ xử lý xong</span></div>
  <div class="kv"><span class="k">Room và namespace</span><span class="v">mô hình địa chỉ mà thật ra cả bài này nói về nó</span></div>
  <div class="kv"><span class="k">Adapter</span><span class="v">một cách cắm-thêm để việc phát tin vượt qua ranh giới tiến trình — bài 11.4</span></div>
</div>

<h3>Phép đo 1 — bộ nhớ cho mỗi kết nối</h3>
<p>Cùng phần cứng, cùng payload. RSS của máy chủ đo lúc chưa có kết nối nào, rồi đo lại khi mọi client đã nối:</p>
<div class="out">                       RSS nền   1.000 kết nối   5.000 kết nối
ws (thuần)             69,9MB    82,2MB (+12,3)  121,1MB (+51,2)
socket.io              70,3MB   106,6MB (+36,3)  179,9MB (+109,6)

thời gian mở 5.000 kết nối:  ws 1.107ms  |  socket.io 1.769ms</div>
<p>Tức khoảng <strong>10KB cho mỗi kết nối với ws và 22KB với Socket.IO</strong>. Cả hai đều nhỏ — 5.000 người dùng đồng thời tốn 51MB hoặc 110MB, con VPS nào cũng gánh được. Đặt cạnh những con số của chương 10 để thấy tỷ lệ: bốn người upload video 120MB vào bộ nhớ tốn 729MB, gấp bảy lần chỗ mà 5.000 socket rỗi tiêu tốn. Kết nối thì rẻ; thứ chảy qua nó mới đắt.</p>

<h3>Phép đo 2 — phát tin cho tất cả</h3>
<p>Một tin nhắn tới mọi client đang nối, bấm giờ từ lúc máy chủ gọi <code>emit()</code> tới lúc client cuối cùng nhận:</p>
<div class="out">1.000 client:  ws emit 17,0ms   → tin đầu 4,9ms, tin cuối 25,3ms
5.000 client:  ws emit 37,6ms   → tin đầu 4,0ms, tin cuối 55,1ms
5.000 client:  io emit 49,9ms   → tin đầu 3,1ms, tin cuối 91,7ms</div>
<p>Hãy đọc khoảng cách giữa "tin đầu" và "tin cuối". Phát tin là một vòng lặp: máy chủ ghi vào socket 1, rồi socket 2, và client thứ năm nghìn phải đợi 4.999 lượt ghi đứng trước nó. <code>emit()</code> trả về sau 37ms KHÔNG có nghĩa là giao tin mất 37ms — nó có nghĩa là <em>event loop bị chặn 37ms</em> để rải tin, tức 37ms đó không request HTTP nào được phục vụ. Đây là phiên bản realtime của bài học chương 2, và đó là lý do hình dạng các room của bạn là một quyết định về hiệu năng.</p>

<h3>Room: mô hình địa chỉ</h3>
<p>Một room chẳng qua là một tập hợp socket có tên. Vào phòng là một phép chèn vào tập băm; phát tin vào phòng chỉ duyệt đúng tập đó. Câu hỏi thiết kế nằm ở chỗ bạn đặt tên chúng thế nào:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">user:&lt;id&gt;</span><span class="lz-d">mọi socket thuộc về người này — điện thoại, laptop, ba cái tab. Đích đúng cho mọi thứ gửi tới một CON NGƯỜI: thông báo, số tin chưa đọc</span></div>
  <div class="lz-node"><span class="lz-t">thread:&lt;id&gt;</span><span class="lz-d">cuộc trò chuyện. Cả hai bên cùng vào; một tin nhắn mới chỉ gửi vào đây một lần thay vì gửi riêng cho từng người</span></div>
  <div class="lz-node"><span class="lz-t">post:&lt;id&gt;</span><span class="lz-d">những socket đang NHÌN bài viết này. Phạm vi theo thứ đang hiện trên màn hình, không theo người dùng là ai</span></div>
  <div class="lz-node"><span class="lz-t">socket.id</span><span class="lz-d">mỗi socket tự động nằm trong một room mang tên chính nó — đó là cách trả lời riêng cho đúng một cái tab</span></div>
</div>
<pre><code>io.on(<span class="tok-str">'connection'</span>, (socket) =&gt; {
  socket.join(<span class="tok-str">&#96;user:\${userId}&#96;</span>);                 <span class="tok-cmt">// mọi thiết bị của người này</span>
  socket.on(<span class="tok-str">'thread:join'</span>, (id) =&gt; socket.join(<span class="tok-str">&#96;thread:\${id}&#96;</span>));
});

io.to(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>).emit(<span class="tok-str">'thread:new-message'</span>, msg);   <span class="tok-cmt">// cả phòng</span>
socket.to(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>).emit(<span class="tok-str">'thread:typing'</span>, t);      <span class="tok-cmt">// cả phòng TRỪ mình</span>
io.to(<span class="tok-str">&#96;user:\${receiverId}&#96;</span>).emit(<span class="tok-str">'social:notification'</span>, n);   <span class="tok-cmt">// một người</span></code></pre>
<p>Khác biệt giữa <code>io.to(room)</code> và <code>socket.to(room)</code> đúng một ký tự, và nó là con bug đằng sau câu hỏi "sao tôi nhìn thấy chính mình đang nhập vậy": <code>io.to</code> bao gồm cả người gửi, <code>socket.to</code> loại người gửi ra.</p>

<h3>Ack: khi bạn cần biết tin đã tới</h3>
<p>Một lệnh <code>emit</code> là bắn-rồi-quên. Cơ chế ack của Socket.IO biến nó thành một cặp hỏi/đáp:</p>
<pre><code><span class="tok-cmt">// client</span>
socket.emit(<span class="tok-str">'thread:join'</span>, <span class="tok-num">42</span>, (res) =&gt; {
  <span class="tok-kw">if</span> (!res.ok) showError(res.reason);
});
<span class="tok-cmt">// server</span>
socket.on(<span class="tok-str">'thread:join'</span>, (id, ack) =&gt; {
  <span class="tok-kw">const</span> allowed = checkParticipant(id);
  <span class="tok-kw">if</span> (allowed) socket.join(<span class="tok-str">&#96;thread:\${id}&#96;</span>);
  ack?.({ ok: allowed, reason: allowed ? <span class="tok-kw">null</span> : <span class="tok-str">'NOT_PARTICIPANT'</span> });
});</code></pre>
<p>Hãy dùng ack cho mọi thứ mà giao diện phải phản ứng theo. Không có nó, một lần vào phòng bị từ chối trông y hệt một lần vào phòng thành công nhưng chẳng bao giờ có sự kiện nào tới — client chỉ còn nước đoán.</p>

<h3>Nên chọn cái nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chọn <code>ws</code> thuần</span><span class="lz-lnote">khi client không phải trình duyệt (một thiết bị, một máy chủ khác), khi giao thức là do bạn tự định nghĩa, hoặc khi số kết nối khổng lồ tới mức 12KB có ý nghĩa. Bạn chấp nhận tự viết phần kết nối lại, nhịp tim và định tuyến</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn Socket.IO</span><span class="lz-lnote">khi client là trình duyệt và bạn muốn có room, kết nối lại và phát tin xuyên tiến trình mà không phải tự viết. Giá phải trả: bộ nhớ mỗi kết nối gấp ~2 lần và một giao thức chỉ client của chính nó mới nói được</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Dùng Socket.IO, với đúng sơ đồ room ở trên — <code>user:&lt;id&gt;</code>, <code>admin:&lt;id&gt;</code>, <code>thread:&lt;id&gt;</code>, <code>post:&lt;id&gt;</code> — và hai quyết định đáng học lỏm. Thứ nhất, <strong>các phòng thread được tự động vào ngay lúc kết nối</strong>: mỗi lần có kết nối, máy chủ hỏi cơ sở dữ liệu một lần lấy danh sách thread của người dùng rồi vào hết. Đó là một bản vá lỗi chứ không phải nét vẽ cho đẹp; comment trong <code>messaging.socket.ts</code> ghi lại triệu chứng — một người đang ở <code>/messages</code> mà chưa bấm vào cuộc trò chuyện nào thì không nhận được gì cả, nên huy hiệu tin chưa đọc đứng hình cho tới khi họ tải lại trang. Thứ hai, <strong><code>post:reacted</code> trước đây là một lệnh <code>io.emit</code> toàn cục</strong>: mỗi lượt thả tim vào bất kỳ bài nào cũng đánh thức mọi socket đang nối trên toàn site. Giờ nó chỉ đi vào <code>post:&lt;id&gt;</code>, phòng mà feed đăng ký cho những bài đang hiển thị (giới hạn 500 phòng mỗi socket để một client xấu tính không vào phòng vô hạn được). Phép đo ở trên giải thích vì sao chuyện đó quan trọng: một lệnh phát toàn cục là một vòng lặp O(mọi socket) nằm trên event loop, cho từng cú bấm nút thích. Phần hiển thị đang-online cũng đi theo đúng con đường ấy — thay vì phát "người X vừa online" cho tất cả, máy chủ tính ra một <em>tập khán giả</em> (bạn bè ∪ người đang chat cùng) rồi chỉ phát vào các phòng user đó, vì bản cũ là một cơn bão O(N²) mỗi lần deploy khiến tất cả cùng kết nối lại một lúc.</p>
</div>

<div class="pitfall">
<p><strong>Năm lỗi về room.</strong> (1) Gõ <code>io.emit()</code> theo thói quen — đó là phát cho mọi socket trên máy chủ, và nó sẽ không lộ ra là vấn đề cho tới khi bạn có người dùng thật. (2) Quên rằng <strong>room mất sạch khi kết nối lại</strong>: kết nối mới là một socket mới không thuộc phòng nào, nên việc vào phòng phải nằm trong handler <code>connect</code> chứ không phải chạy một lần lúc mở trang. (3) Dùng <code>socket.id</code> làm định danh người dùng — nó đổi sau mỗi lần kết nối lại và một người có nhiều cái. (4) Cho vào phòng theo mọi thực thể client yêu cầu mà không đặt trần: kẻ tấn công vào một triệu phòng và bộ nhớ của bạn thành của họ. (5) Tự rải tin bằng vòng lặp trên <code>io.sockets.sockets</code> — đó đúng là kiểu O(mọi socket) mà room sinh ra để tránh.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Socket.IO tốn khoảng gấp đôi bộ nhớ cho mỗi kết nối và mua về phần kết nối lại, đường lui, ack và room. Bản thân kết nối thì rẻ; phát tin thì không, vì rải tin là một vòng lặp nằm trên event loop của bạn. Hãy thiết kế room sao cho mỗi tin nhắn chạm tới tập socket ĐÚNG và NHỎ NHẤT — riêng quyết định đó còn quan trọng hơn việc bạn chọn thư viện nào.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-939" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 939 — Rooms &amp; Namespaces</span><span class="lc-sub">10 bài tập: mô hình địa chỉ của realtime.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-940" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 940 — Broadcasting &amp; Acknowledgements</span><span class="lc-sub">10 bài tập: phát tin đúng phạm vi và chờ xác nhận.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Authenticate once, authorize every time|||11.3 — Xác thực một lần, phân quyền mọi lần',
      slug: 'nodejs-11-3-xac-thuc-phan-quyen-socket',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-3-xac-thuc-phan-quyen-socket.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-3-xac-thuc-phan-quyen-socket.jpg',
        scenario: 'websocket',
        durationSeconds: 8,
        caption: { en: "Joining a room that is not yours", vi: "Vào một phòng không phải của mình" },
      },
      type: 'VIDEO',
      description: 'JWT trong lúc bắt tay, và lỗ hổng cả bài này xoay quanh: một dòng thiếu kiểm quyền cho phép người lạ đọc tin nhắn riêng tư theo thời gian thực — tái hiện, rồi vá trên chính production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Authenticate once, authorize every time</h2>
<p class="lead">A REST request carries its credentials every time, so the middleware runs on every call and it is hard to forget. A socket is the opposite: the cookie arrives once, at the handshake, and then a thousand events flow through a connection nobody re-checks. That asymmetry is where realtime security goes wrong, and this lesson ends with a hole found in this site's own production code while the lesson was being written — reproduced, measured, and fixed.</p>

<h3>Where the credential comes from</h3>
<p>The handshake is HTTP, so all three of the usual places work — and the third is the one you want in a browser:</p>
<pre><code>io.use(<span class="tok-kw">async</span> (socket, next) =&gt; {
  <span class="tok-cmt">// 1. socket.handshake.auth.token  — client tự truyền (phải lấy từ JS ⇒ không httpOnly được)</span>
  <span class="tok-cmt">// 2. header Authorization         — dùng được cho client không phải trình duyệt</span>
  <span class="tok-cmt">// 3. cookie httpOnly              — trình duyệt tự gửi khi bắt tay ⇒ AN TOÀN NHẤT</span>
  <span class="tok-kw">const</span> token = extractToken(socket.request);
  <span class="tok-kw">if</span> (!token) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> Error(<span class="tok-str">'NO_TOKEN'</span>));
  <span class="tok-kw">try</span> {
    <span class="tok-kw">const</span> payload = jwt.verify(token, SECRET);
    socket.data.userId = payload.userId;      <span class="tok-cmt">// bám vào socket, KHÔNG tin client nữa</span>
    next();
  } <span class="tok-kw">catch</span> (e) { next(e); }
});</code></pre>
<p>Never put the token in the query string. It ends up in access logs, in <code>Referer</code> headers, and in your monitoring tool's URL field — chapter 9's lesson, arriving through a different door.</p>

<h3>Measurement 1 — four tokens through the handshake</h3>
<div class="out">token hợp lệ             → KẾT NỐI ĐƯỢC
không token              → BỊ TỪ CHỐI: NO_TOKEN
token hết hạn            → BỊ TỪ CHỐI: jwt expired
token tự ký khoá sai     → BỊ TỪ CHỐI: invalid signature</div>
<p>Rejection surfaces on the client as a <code>connect_error</code> event, not as a thrown exception — a client that only listens for <code>connect</code> will sit there silently forever, which is why an unauthenticated socket usually presents as "realtime just doesn't work" rather than as an error.</p>

<h3>Measurement 2 — the hole: authenticated is not authorized</h3>
<p>User 7 is a participant in thread 42 and nothing else. They connect with a perfectly valid token — every check above passes — and then emit one event. Two server implementations, side by side:</p>
<pre><code><span class="tok-cmt">// ❌ CÁCH SAI — chính xác là dòng từng nằm trong production của site này</span>
socket.on(<span class="tok-str">'join:unsafe'</span>, (room) =&gt; { socket.join(room); });

<span class="tok-cmt">// ✅ CÁCH ĐÚNG — kiểm quyền cho TỪNG sự kiện</span>
socket.on(<span class="tok-str">'join:safe'</span>, (threadId) =&gt; {
  <span class="tok-kw">if</span> (!socket.data.threads.includes(threadId)) <span class="tok-kw">return</span> socket.emit(<span class="tok-str">'error:forbidden'</span>, { threadId });
  socket.join(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>);
});</code></pre>
<p>User 7 asks for thread 99, which belongs to two other people:</p>
<div class="out">   join:unsafe → ĐÃ VÀO thread:99 (không ai kiểm!)
   join:safe   → TỪ CHỐI thread 99 (không phải người trong cuộc)
   ⚠️  socket lậu NHẬN ĐƯỢC tin riêng tư: {"threadId":99,"body":"Chuyển khoản 50 triệu nhé"}</div>
<p>That is the whole attack. No stolen token, no XSS, no privilege escalation — a legitimately logged-in user emitted one event with a number they do not own. Thread ids are sequential integers, so "guessing" is a <code>for</code> loop. And because it happens over a socket, <strong>nothing appears in your REST access logs</strong>: no <code>GET /threads/99</code>, no 403, nothing to alert on.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it — and what was wrong until this lesson.</strong> The handshake middleware in <code>src/socket/messaging.socket.ts</code> was already careful: it reads the JWT with the same <code>extractToken</code> as the REST middleware (production path = the <code>httpOnly</code> <code>backend_token</code> cookie, never exposed to JS), verifies it, loads the user, refuses if the account is disabled or locked, and — the part most implementations skip — <strong>re-checks <code>roleVersion</code> against the database</strong>, so a token issued before a password change or a role edit is rejected even though its signature is still valid.</p>
<p>The authorization side was not careful. The explicit opt-in handler read, in full: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(&#96;thread:\${threadId}&#96;); })</code> — a type check standing in for a permission check, exactly the <code>join:unsafe</code> above. Any logged-in account could join any conversation's room and receive its <code>thread:new-message</code> events live, message bodies included. It has been fixed: the handler now runs the same participation query the REST layer uses in <code>MessagesService.assertParticipant</code> (ADMIN threads: the user or the assigned admin; USER threads: the two sides), short-circuits when the room was already auto-joined at connect, <strong>fails closed</strong> if the database call throws, and answers a refusal with <code>thread:join-denied</code> plus a warning log. <code>thread:typing</code> had the same shape — anyone could push "… is typing" into a stranger's chat — and now requires the socket to already be a member of that room.</p>
<p>The lesson generalises past this one bug: <strong>every socket event handler is an endpoint</strong>. It just does not look like one, because it has no URL, no route table, and no middleware chain to hang the check on.</p>
</div>

<h3>Measurement 3 — the connection that is dead and does not know it</h3>
<p>A closed tab sends a TCP FIN and the server sees <code>disconnect</code> instantly. A phone that walks into a lift sends nothing at all. To measure the second case honestly you have to simulate a black hole — a TCP proxy that stops forwarding without closing anything. With <code>pingInterval: 1000, pingTimeout: 2000</code>:</p>
<div class="out">máy chủ phát hiện chết sau 3010ms (disconnect: ping timeout)</div>
<p>Exactly <code>pingInterval + pingTimeout</code>: the server sends a ping on the interval, then waits the timeout for a pong. Socket.IO's defaults are <strong>25.000ms + 20.000ms = up to 45 seconds</strong> before a vanished client is noticed. Until then it counts as online, sits in every room, and receives messages into the void.</p>

<h3>Measurement 4 — what reconnecting does and does not restore</h3>
<div class="out">kết nối, socket id: JBrWhg
→ "rút dây". Máy chủ phát 5 tin trong lúc client offline…
tự kết nối lại sau 1.053ms | id MỚI: eUE1ya (cũ: JBrWhg)
5 tin phát lúc offline → client nhận: 0 → MẤT TRẮNG
⇒ kết nối lại KHÔNG phát lại tin cũ, và id đổi ⇒ mọi room phải JOIN LẠI.</div>
<p>Two facts that shape every realtime UI. <strong>The socket id changes</strong>, so anything you keyed by it is gone and every room must be re-joined inside the <code>connect</code> handler. And <strong>messages sent while the client was away are lost</strong> — Socket.IO does not buffer for a disconnected socket. The pattern that fixes it is not a bigger buffer, it is a different division of labour:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Socket = tín hiệu</span><span class="lz-d">"có gì đó mới, id lớn hơn X" — nhanh, bé, và được phép mất</span></div>
  <div class="lz-step"><span class="lz-t">REST = sự thật</span><span class="lz-d">lúc kết nối lại, gọi <code>GET /messages?since=&lt;id cuối cùng thấy&gt;</code> để lấy đúng phần đã lỡ</span></div>
  <div class="lz-step"><span class="lz-t">Client = trọng tài</span><span class="lz-d">gộp hai nguồn, khử trùng lặp theo id — vì cùng một tin có thể tới cả hai đường</span></div>
</div>
<p>Design so that a lost socket message is a cosmetic delay, never lost data. If your product's correctness depends on a frame arriving, you have built a message queue out of a UI transport.</p>

<div class="pitfall">
<p><strong>Six realtime security and reliability mistakes.</strong> (1) Checking permissions only at the handshake — that is authentication; authorization belongs in every handler. (2) Token in the query string: it lands in nginx logs and <code>Referer</code> headers. (3) Trusting a <code>userId</code> that arrives in the event payload instead of reading <code>socket.data.userId</code> set at connect. (4) No rate limit per socket — one connection can emit thousands of events per second, and none of them touch your HTTP rate limiter. (5) Assuming <code>disconnect</code> fires promptly: with defaults you have up to 45 seconds of a ghost user showing as online. (6) Treating the socket as a reliable delivery channel and never writing the catch-up REST path — it works perfectly until the first tunnel, lift, or deploy.</p>
</div>

<h3>What to take away</h3>
<p>Authenticate at the handshake, with the same token rules as REST, and re-check anything the database might have invalidated since. Then treat every <code>socket.on</code> as an endpoint that needs its own authorization — the absence of a URL does not make it less public. And design for the connection dying without notice, because it will, and the fix is a REST catch-up rather than a bigger buffer.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-941" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 941 — Authentication &amp; Middleware</span><span class="lc-sub">10 bài tập: xác thực lúc bắt tay và kiểm quyền mỗi sự kiện.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-944" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 944 — Reconnection &amp; Reliability</span><span class="lc-sub">10 bài tập: mất mạng, kết nối lại, và bù phần đã lỡ.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Xác thực một lần, phân quyền mọi lần</h2>
<p class="lead">Một request REST mang theo thông tin xác thực trong từng lần gọi, nên middleware chạy ở mọi lần và rất khó quên. Socket thì ngược lại: cookie tới đúng một lần, lúc bắt tay, rồi cả nghìn sự kiện chảy qua một kết nối mà không ai kiểm lại. Chính sự bất đối xứng đó là chỗ bảo mật realtime đi sai, và bài này kết bằng một lỗ hổng tìm thấy trong chính code production của site này ngay trong lúc soạn bài — tái hiện, đo, rồi vá.</p>

<h3>Thông tin xác thực đến từ đâu</h3>
<p>Cái bắt tay là HTTP, nên cả ba chỗ quen thuộc đều dùng được — và chỗ thứ ba mới là thứ bạn muốn trên trình duyệt:</p>
<pre><code>io.use(<span class="tok-kw">async</span> (socket, next) =&gt; {
  <span class="tok-cmt">// 1. socket.handshake.auth.token  — client tự truyền (phải lấy từ JS ⇒ không httpOnly được)</span>
  <span class="tok-cmt">// 2. header Authorization         — dùng được cho client không phải trình duyệt</span>
  <span class="tok-cmt">// 3. cookie httpOnly              — trình duyệt tự gửi khi bắt tay ⇒ AN TOÀN NHẤT</span>
  <span class="tok-kw">const</span> token = extractToken(socket.request);
  <span class="tok-kw">if</span> (!token) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> Error(<span class="tok-str">'NO_TOKEN'</span>));
  <span class="tok-kw">try</span> {
    <span class="tok-kw">const</span> payload = jwt.verify(token, SECRET);
    socket.data.userId = payload.userId;      <span class="tok-cmt">// bám vào socket, KHÔNG tin client nữa</span>
    next();
  } <span class="tok-kw">catch</span> (e) { next(e); }
});</code></pre>
<p>Tuyệt đối đừng đặt token trong query string. Nó sẽ nằm lại trong log truy cập, trong header <code>Referer</code>, và trong ô URL của công cụ giám sát — đúng bài học chương 9, đi vào bằng một cánh cửa khác.</p>

<h3>Phép đo 1 — bốn loại token đi qua cái bắt tay</h3>
<div class="out">token hợp lệ             → KẾT NỐI ĐƯỢC
không token              → BỊ TỪ CHỐI: NO_TOKEN
token hết hạn            → BỊ TỪ CHỐI: jwt expired
token tự ký khoá sai     → BỊ TỪ CHỐI: invalid signature</div>
<p>Việc bị từ chối hiện ra ở client dưới dạng sự kiện <code>connect_error</code>, không phải một ngoại lệ được ném ra — một client chỉ lắng nghe <code>connect</code> sẽ ngồi im lặng mãi mãi, và đó là lý do một socket chưa xác thực thường biểu hiện thành câu "realtime tự nhiên không chạy" chứ không thành một thông báo lỗi.</p>

<h3>Phép đo 2 — cái lỗ: đã xác thực KHÔNG có nghĩa là có quyền</h3>
<p>Người dùng 7 là người trong cuộc của thread 42 và không của gì khác. Họ kết nối bằng một token hoàn toàn hợp lệ — mọi lớp kiểm ở trên đều qua — rồi emit đúng một sự kiện. Hai cách cài đặt phía máy chủ, đặt cạnh nhau:</p>
<pre><code><span class="tok-cmt">// ❌ CÁCH SAI — chính xác là dòng từng nằm trong production của site này</span>
socket.on(<span class="tok-str">'join:unsafe'</span>, (room) =&gt; { socket.join(room); });

<span class="tok-cmt">// ✅ CÁCH ĐÚNG — kiểm quyền cho TỪNG sự kiện</span>
socket.on(<span class="tok-str">'join:safe'</span>, (threadId) =&gt; {
  <span class="tok-kw">if</span> (!socket.data.threads.includes(threadId)) <span class="tok-kw">return</span> socket.emit(<span class="tok-str">'error:forbidden'</span>, { threadId });
  socket.join(<span class="tok-str">&#96;thread:\${threadId}&#96;</span>);
});</code></pre>
<p>Người dùng 7 xin vào thread 99, vốn là của hai người khác:</p>
<div class="out">   join:unsafe → ĐÃ VÀO thread:99 (không ai kiểm!)
   join:safe   → TỪ CHỐI thread 99 (không phải người trong cuộc)
   ⚠️  socket lậu NHẬN ĐƯỢC tin riêng tư: {"threadId":99,"body":"Chuyển khoản 50 triệu nhé"}</div>
<p>Toàn bộ đòn tấn công chỉ có thế. Không trộm token, không XSS, không leo thang đặc quyền — một người dùng đăng nhập hợp pháp emit một sự kiện kèm một con số không thuộc về mình. Id của thread là số nguyên tuần tự, nên "đoán" ở đây là một vòng <code>for</code>. Và vì chuyện xảy ra qua socket nên <strong>không có gì hiện lên trong log truy cập REST</strong>: không <code>GET /threads/99</code>, không lỗi 403, không có gì để mà cảnh báo.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào — và chỗ đã sai cho tới đúng bài học này.</strong> Middleware bắt tay trong <code>src/socket/messaging.socket.ts</code> vốn đã cẩn thận: nó đọc JWT bằng đúng <code>extractToken</code> của middleware REST (đường production = cookie <code>backend_token</code> có <code>httpOnly</code>, không bao giờ lộ ra cho JS), xác minh chữ ký, nạp người dùng, từ chối nếu tài khoản bị tắt hoặc bị khoá, và — phần mà phần lớn nơi khác bỏ qua — <strong>kiểm lại <code>roleVersion</code> với cơ sở dữ liệu</strong>, nên một token phát trước lúc đổi mật khẩu hay đổi vai trò sẽ bị từ chối dù chữ ký vẫn còn đúng.</p>
<p>Phía phân quyền thì không cẩn thận. Handler cho phép client chủ động vào phòng, nguyên văn, là: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(&#96;thread:\${threadId}&#96;); })</code> — một phép kiểm KIỂU DỮ LIỆU đứng thay cho một phép kiểm QUYỀN, đúng y <code>join:unsafe</code> ở trên. Bất kỳ tài khoản nào đã đăng nhập cũng có thể vào phòng của bất kỳ cuộc trò chuyện nào và nhận realtime các sự kiện <code>thread:new-message</code> của nó, kèm nguyên nội dung tin nhắn. Chỗ này đã được vá: handler giờ chạy đúng truy vấn kiểm người-trong-cuộc mà tầng REST dùng trong <code>MessagesService.assertParticipant</code> (thread ADMIN: người dùng hoặc admin được gán; thread USER: hai bên), đi đường tắt khi phòng đã được tự động vào lúc kết nối, <strong>fail closed</strong> nếu truy vấn cơ sở dữ liệu ném lỗi, và trả lời từ chối bằng <code>thread:join-denied</code> kèm một dòng log cảnh báo. <code>thread:typing</code> cùng hình dạng lỗi — ai cũng đẩy được "đang nhập…" vào khung chat của người lạ — nay bắt buộc socket phải ĐANG là thành viên của phòng đó.</p>
<p>Bài học tổng quát hơn con bug này: <strong>mỗi handler sự kiện socket là một endpoint</strong>. Chỉ là nó không trông giống endpoint, vì không có URL, không có bảng route, và không có chuỗi middleware nào để treo phép kiểm lên.</p>
</div>

<h3>Phép đo 3 — kết nối đã chết mà không biết mình chết</h3>
<p>Một cái tab đóng lại sẽ gửi gói TCP FIN và máy chủ thấy <code>disconnect</code> ngay lập tức. Một chiếc điện thoại đi vào thang máy thì không gửi gì cả. Muốn đo trường hợp thứ hai cho trung thực thì phải mô phỏng một hố đen — một proxy TCP ngừng chuyển tiếp mà không đóng gì hết. Với <code>pingInterval: 1000, pingTimeout: 2000</code>:</p>
<div class="out">máy chủ phát hiện chết sau 3010ms (disconnect: ping timeout)</div>
<p>Đúng bằng <code>pingInterval + pingTimeout</code>: máy chủ gửi ping theo chu kỳ, rồi chờ hết thời hạn để nhận pong. Mặc định của Socket.IO là <strong>25.000ms + 20.000ms = tối đa 45 giây</strong> trước khi một client biến mất bị phát hiện. Từ giờ tới lúc đó nó vẫn được tính là đang online, vẫn nằm trong mọi phòng, và vẫn nhận tin nhắn vào hư không.</p>

<h3>Phép đo 4 — kết nối lại khôi phục cái gì và KHÔNG khôi phục cái gì</h3>
<div class="out">kết nối, socket id: JBrWhg
→ "rút dây". Máy chủ phát 5 tin trong lúc client offline…
tự kết nối lại sau 1.053ms | id MỚI: eUE1ya (cũ: JBrWhg)
5 tin phát lúc offline → client nhận: 0 → MẤT TRẮNG
⇒ kết nối lại KHÔNG phát lại tin cũ, và id đổi ⇒ mọi room phải JOIN LẠI.</div>
<p>Hai sự thật định hình mọi giao diện realtime. <strong>Id của socket đổi</strong>, nên mọi thứ bạn đánh khoá theo nó đều mất, và mọi phòng phải được vào lại bên trong handler <code>connect</code>. Và <strong>những tin phát trong lúc client vắng mặt thì mất luôn</strong> — Socket.IO không đệm cho một socket đã ngắt. Mẫu hình sửa chuyện này không phải là một cái đệm to hơn, mà là một cách chia việc khác:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Socket = tín hiệu</span><span class="lz-d">"có gì đó mới, id lớn hơn X" — nhanh, bé, và được phép mất</span></div>
  <div class="lz-step"><span class="lz-t">REST = sự thật</span><span class="lz-d">lúc kết nối lại, gọi <code>GET /messages?since=&lt;id cuối cùng thấy&gt;</code> để lấy đúng phần đã lỡ</span></div>
  <div class="lz-step"><span class="lz-t">Client = trọng tài</span><span class="lz-d">gộp hai nguồn, khử trùng lặp theo id — vì cùng một tin có thể tới cả hai đường</span></div>
</div>
<p>Hãy thiết kế sao cho một tin socket bị mất chỉ là một khoảng trễ về mặt hình thức, không bao giờ là mất dữ liệu. Nếu tính đúng đắn của sản phẩm phụ thuộc vào việc một khung tin phải tới nơi, thì bạn đang dựng một hàng đợi tin nhắn bằng một phương tiện vốn chỉ để chở giao diện.</p>

<div class="pitfall">
<p><strong>Sáu lỗi bảo mật và độ tin cậy của realtime.</strong> (1) Chỉ kiểm quyền lúc bắt tay — đó là XÁC THỰC; PHÂN QUYỀN thuộc về từng handler. (2) Token nằm trong query string: nó rơi vào log nginx và header <code>Referer</code>. (3) Tin vào <code>userId</code> gửi kèm trong payload sự kiện thay vì đọc <code>socket.data.userId</code> đã chốt lúc kết nối. (4) Không giới hạn tần suất trên mỗi socket — một kết nối có thể emit hàng nghìn sự kiện mỗi giây, và không sự kiện nào đi qua bộ giới hạn tần suất HTTP của bạn. (5) Tưởng rằng <code>disconnect</code> nổ ngay: với cấu hình mặc định bạn có tới 45 giây một người dùng ma vẫn hiện là đang online. (6) Coi socket là kênh giao tin đáng tin cậy và không bao giờ viết đường REST bù lại — nó chạy hoàn hảo cho tới cái hầm, cái thang máy, hay lần deploy đầu tiên.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Hãy xác thực lúc bắt tay, bằng đúng luật token của REST, và kiểm lại những gì cơ sở dữ liệu có thể đã vô hiệu hoá từ lúc đó. Rồi đối xử với mỗi <code>socket.on</code> như một endpoint cần phép kiểm quyền của riêng nó — việc không có URL không làm nó bớt công khai. Và hãy thiết kế cho tình huống kết nối chết không báo trước, vì nó sẽ chết, và cách chữa là một đường REST bù lại chứ không phải một cái đệm to hơn.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-941" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 941 — Authentication &amp; Middleware</span><span class="lc-sub">10 bài tập: xác thực lúc bắt tay và kiểm quyền mỗi sự kiện.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-944" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 944 — Reconnection &amp; Reliability</span><span class="lc-sub">10 bài tập: mất mạng, kết nối lại, và bù phần đã lỡ.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — More than one process: adapters, sticky sessions, backpressure|||11.4 — Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược',
      slug: 'nodejs-11-4-scale-adapter-backpressure',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-4-scale-adapter-backpressure.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-11-4-scale-adapter-backpressure.jpg',
        scenario: 'websocket',
        durationSeconds: 7,
        caption: { en: "Two processes, and the message that reaches nobody", vi: "Hai tiến trình, và tin nhắn không tới được ai" },
      },
      type: 'VIDEO',
      description: 'Ngày bạn chạy tiến trình thứ hai, realtime im lặng hỏng: chứng minh bằng đo, vá bằng adapter Redis 5,02ms, cộng hai cái bẫy — LB luân phiên giết long-polling và một client đọc chậm ăn 192MB RAM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>More than one process: adapters, sticky sessions, backpressure</h2>
<p class="lead">Everything so far assumed one Node process holding every socket. The day you add a second one — a second container, a <code>cluster</code> worker, a rolling deploy where old and new run side by side — realtime breaks in the quietest way possible: nothing errors, some users just stop receiving. This lesson reproduces that, fixes it, and then measures the two other things that only show up once real users are on the other end.</p>

<h3>Measurement 1 — the bug that produces no error</h3>
<p>Two identical Socket.IO processes. A client connects to process A; process B emits to the room the client is in — which is what happens when the client's socket lives on one container and the HTTP request that triggers the event lands on the other:</p>
<div class="out">########## KHÔNG có adapter ##########
  client nối vào TIẾN TRÌNH A (:4310)
  A /count: {"localConns":1,"socketsInRoomClusterWide":1}
  B /count: {"localConns":0,"socketsInRoomClusterWide":0}
  phát từ TIẾN TRÌNH B (:4311) → {"emitMs":0.42,"local":0}
  ❌ client (ở A) KHÔNG nhận được gì</div>
<p>Look at process B: <code>emit</code> returned in 0,42ms and reported success. Rooms are an <strong>in-memory map inside one process</strong>, so B's room is genuinely empty — it fanned out to nobody, correctly and instantly. Nothing to log, nothing to alert on. Symptom in production: "messages arrive sometimes", which people blame on the network for weeks.</p>

<h3>Measurement 2 — the adapter</h3>
<p>Same test, with <code>@socket.io/redis-adapter</code> attached on both processes. The adapter publishes every broadcast to a Redis channel and each process replays it to its own local sockets:</p>
<pre><code><span class="tok-kw">import</span> { createAdapter } <span class="tok-kw">from</span> <span class="tok-str">'@socket.io/redis-adapter'</span>;
<span class="tok-kw">const</span> pub = <span class="tok-kw">new</span> Redis(REDIS_URL);
<span class="tok-kw">const</span> sub = pub.duplicate();          <span class="tok-cmt">// PHẢI là kết nối riêng: một client đang SUBSCRIBE không chạy lệnh khác được</span>
io.adapter(createAdapter(pub, sub));</code></pre>
<div class="out">########## CÓ adapter Redis ##########
  A /count: {"localConns":1,"socketsInRoomClusterWide":1}
  B /count: {"localConns":0,"socketsInRoomClusterWide":1}   ← B giờ THẤY socket ở A
  phát từ TIẾN TRÌNH B (:4313) → {"emitMs":1.13,"local":0}
  ✅ client (ở A) NHẬN ĐƯỢC sau 5,02ms</div>
<p>Cross-process delivery in 5,02ms, and <code>fetchSockets()</code> on B now reports the socket living on A — the adapter makes room membership a cluster-wide question. The cost is one Redis round trip per broadcast and two extra Redis connections per process.</p>

<h3>Measurement 3 — sticky sessions, and why "websocket-only" is a real choice</h3>
<p>Two processes behind a round-robin load balancer that sends each new TCP connection to the other process — no session affinity. Same client, two transport settings:</p>
<div class="out">transport=polling    qua LB luân phiên → HỎNG: xhr post error
transport=websocket  qua LB luân phiên → OK</div>
<p>The reason is structural. HTTP long-polling is <em>many</em> requests carrying one session id, so request 2 landing on the process that has never heard of that session fails. A WebSocket is <em>one</em> connection that lives on whichever process accepted it — once upgraded, affinity is automatic. Hence the two valid configurations:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bật sticky session</span><span class="lz-lnote">the load balancer routes by cookie or IP hash so every request of a session lands on the same process. Keeps the long-poll fallback working for users behind upgrade-stripping proxies</span></div>
  <div class="lz-layer"><span class="lz-lname">Hoặc <code>transports: ['websocket']</code></span><span class="lz-lnote">no sticky needed, because there is only ever one connection. Price: users whose proxy blocks the upgrade get nothing at all</span></div>
</div>
<p>Note what the adapter does <em>not</em> do: it fans broadcasts across processes, it does not make a session portable between them. Redis adapter and sticky sessions solve different halves.</p>

<h3>Measurement 4 — one slow client, 192MB</h3>
<p>A client that stops reading — a phone on a dying connection, a laptop mid-suspend — does not disappear. TCP applies backpressure, and everything the server keeps sending piles up in <em>your</em> memory:</p>
<div class="out">Client ngừng đọc. Máy chủ vẫn send() 3000 tin × 64KB = 187,5MB
  ws.bufferedAmount = 187,0MB  ← đang nằm trong RAM máy chủ
  RSS 65,1MB → 257,5MB (+192,4MB)
  readyState = 1 (1 = OPEN) → send() KHÔNG hề báo lỗi</div>
<p>The socket still reports <code>OPEN</code>. <code>send()</code> returns normally. One client cost 192MB and there is no error anywhere. The guard is to look before you write:</p>
<pre><code><span class="tok-kw">const</span> LIMIT = <span class="tok-num">1</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span>;               <span class="tok-cmt">// 1MB hàng đợi cho mỗi socket</span>
<span class="tok-kw">if</span> (ws.bufferedAmount &gt; LIMIT) {
  <span class="tok-cmt">// khách này không theo kịp: bỏ tin, hoặc đóng và bắt họ tải lại từ REST</span>
  <span class="tok-kw">return</span>;
}
ws.send(payload);</code></pre>
<div class="out">với ngưỡng 1,0MB: bỏ 100/100 tin thay vì phình RAM vô hạn</div>
<p>Dropping frames is the correct behaviour, and it is only acceptable because of the design rule from lesson 11.3: the socket is a signal, REST is the truth. A client that missed frames refetches and is whole again.</p>

<h3>The other shared resource: the event loop</h3>
<p>Every socket on a process shares one event loop. Chapter 2 measured a 3-second synchronous block; on an HTTP server that means slow requests, on a realtime server it means <strong>heartbeats stop being answered</strong>. Block for longer than <code>pingTimeout</code> and clients start disconnecting <em>themselves</em>, then all reconnect at once — a thundering herd caused by a single slow loop. This is also why the image work in chapter 10 is queued: CPU spent on one upload is latency added to every open socket.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>attachRedisAdapter()</code> in <code>src/socket/messaging.socket.ts</code> duplicates the shared ioredis client twice (one publisher, one subscriber — a subscribed connection cannot run other commands) and attaches the adapter, wrapped in a try/catch that <strong>falls back to the in-memory adapter and logs a warning</strong> if Redis is unreachable. That is the right trade for this deployment: with a single backend container, in-memory rooms are correct and realtime keeps working through a Redis outage; the moment a second instance exists, the adapter is what stops measurement 1 from happening. The transports stay <code>['websocket', 'polling']</code> — the fallback is kept deliberately for users behind upgrade-stripping proxies — which is exactly the configuration that <em>requires</em> sticky sessions before scaling out, and is worth writing on the wall before the second container ships. Ping settings are <code>pingInterval: 25000, pingTimeout: 60000</code>, more forgiving than the defaults: it tolerates a phone on a bad connection, at the cost of a ghost showing as online for up to 85 seconds.</p>
</div>

<div class="pitfall">
<p><strong>Six things that break at the second process.</strong> (1) No adapter — measurement 1, silent. (2) Sharing one Redis connection for pub and sub: a subscribed client refuses other commands and everything hangs. (3) Adding a second container without sticky sessions while long-polling is enabled. (4) In-memory state on the socket server (an online-users <code>Set</code>, a rooms map) — each process has its own, so "who is online" is now per-process; that state has to move to Redis. (5) A deploy that restarts every container at once: every client reconnects in the same second, which is a self-inflicted flood — stagger it or make reconnect backoff jittered. (6) Never bounding <code>bufferedAmount</code>, so one bad network becomes an OOM.</p>
</div>

<h3>What to take away</h3>
<p>Rooms live in one process's memory, so the second process makes them wrong — the adapter is not an optimisation, it is what keeps the model true. Sticky sessions are a separate problem and only disappear if you give up the long-poll fallback. And on the machine itself, remember what every socket shares: your memory, through send buffers, and your event loop, through everything else.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-942" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 942 — Scaling with the Redis Adapter</span><span class="lc-sub">10 bài tập: phát tin xuyên tiến trình và bài toán sticky session.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-947" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 947 — Production Patterns &amp; Security</span><span class="lc-sub">10 bài tập: chạy realtime thật trên nhiều tiến trình.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược</h2>
<p class="lead">Mọi thứ tới giờ đều giả định một tiến trình Node giữ toàn bộ socket. Ngày bạn thêm tiến trình thứ hai — một container nữa, một worker <code>cluster</code>, hay một lần deploy cuốn chiếu mà bản cũ và bản mới chạy song song — realtime hỏng theo cách im lặng nhất có thể: không lỗi nào cả, chỉ là vài người dùng ngừng nhận được. Bài này tái hiện chuyện đó, vá nó, rồi đo hai thứ còn lại vốn chỉ lộ ra khi có người dùng thật ở đầu bên kia.</p>

<h3>Phép đo 1 — con bug không sinh ra lỗi nào</h3>
<p>Hai tiến trình Socket.IO y hệt nhau. Client kết nối vào tiến trình A; tiến trình B phát tin vào đúng cái phòng client đang ở — đúng chuyện xảy ra khi socket của client nằm ở container này còn request HTTP kích hoạt sự kiện lại rơi vào container kia:</p>
<div class="out">########## KHÔNG có adapter ##########
  client nối vào TIẾN TRÌNH A (:4310)
  A /count: {"localConns":1,"socketsInRoomClusterWide":1}
  B /count: {"localConns":0,"socketsInRoomClusterWide":0}
  phát từ TIẾN TRÌNH B (:4311) → {"emitMs":0.42,"local":0}
  ❌ client (ở A) KHÔNG nhận được gì</div>
<p>Hãy nhìn tiến trình B: <code>emit</code> trả về sau 0,42ms và báo thành công. Room là một <strong>bản đồ trong bộ nhớ của MỘT tiến trình</strong>, nên phòng của B thật sự rỗng — nó đã rải tin cho không ai cả, một cách đúng đắn và tức thì. Không có gì để ghi log, không có gì để cảnh báo. Triệu chứng trên production: "tin nhắn lúc tới lúc không", và người ta đổ cho đường mạng suốt mấy tuần.</p>

<h3>Phép đo 2 — adapter</h3>
<p>Vẫn phép thử đó, gắn thêm <code>@socket.io/redis-adapter</code> ở cả hai tiến trình. Adapter công bố mọi lệnh phát tin lên một kênh Redis và mỗi tiến trình phát lại nó cho đám socket cục bộ của mình:</p>
<pre><code><span class="tok-kw">import</span> { createAdapter } <span class="tok-kw">from</span> <span class="tok-str">'@socket.io/redis-adapter'</span>;
<span class="tok-kw">const</span> pub = <span class="tok-kw">new</span> Redis(REDIS_URL);
<span class="tok-kw">const</span> sub = pub.duplicate();          <span class="tok-cmt">// PHẢI là kết nối riêng: một client đang SUBSCRIBE không chạy lệnh khác được</span>
io.adapter(createAdapter(pub, sub));</code></pre>
<div class="out">########## CÓ adapter Redis ##########
  A /count: {"localConns":1,"socketsInRoomClusterWide":1}
  B /count: {"localConns":0,"socketsInRoomClusterWide":1}   ← B giờ THẤY socket ở A
  phát từ TIẾN TRÌNH B (:4313) → {"emitMs":1.13,"local":0}
  ✅ client (ở A) NHẬN ĐƯỢC sau 5,02ms</div>
<p>Giao tin xuyên tiến trình trong 5,02ms, và <code>fetchSockets()</code> ở B giờ báo cáo cả cái socket đang sống ở A — adapter biến "ai đang ở trong phòng" thành một câu hỏi ở phạm vi cả cụm. Cái giá là một vòng đi-về Redis cho mỗi lệnh phát tin và hai kết nối Redis phụ cho mỗi tiến trình.</p>

<h3>Phép đo 3 — sticky session, và vì sao "chỉ dùng websocket" là một lựa chọn thật</h3>
<p>Hai tiến trình đứng sau một bộ cân bằng tải luân phiên, mỗi kết nối TCP mới được đẩy sang tiến trình còn lại — không có tính dính phiên. Cùng một client, hai cấu hình transport:</p>
<div class="out">transport=polling    qua LB luân phiên → HỎNG: xhr post error
transport=websocket  qua LB luân phiên → OK</div>
<p>Lý do nằm ở cấu trúc. HTTP long-polling là <em>nhiều</em> request cùng mang một id phiên, nên request thứ 2 rơi vào tiến trình chưa từng nghe nói tới phiên đó là hỏng. Còn WebSocket là <em>một</em> kết nối sống trên đúng tiến trình đã nhận nó — nâng cấp xong là tính dính có sẵn. Từ đó có hai cấu hình hợp lệ:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bật sticky session</span><span class="lz-lnote">bộ cân bằng tải định tuyến theo cookie hoặc băm IP để mọi request của một phiên rơi về cùng một tiến trình. Giữ được đường lui long-poll cho người dùng ngồi sau proxy bóc header upgrade</span></div>
  <div class="lz-layer"><span class="lz-lname">Hoặc <code>transports: ['websocket']</code></span><span class="lz-lnote">không cần sticky nữa, vì chỉ có duy nhất một kết nối. Giá phải trả: người dùng mà proxy chặn việc nâng cấp sẽ không nhận được gì hết</span></div>
</div>
<p>Để ý thứ adapter KHÔNG làm: nó rải tin xuyên tiến trình, nó không làm cho một phiên di chuyển được giữa các tiến trình. Adapter Redis và sticky session giải hai nửa khác nhau.</p>

<h3>Phép đo 4 — một client chậm, 192MB</h3>
<p>Một client ngừng đọc — điện thoại trên đường mạng đang tắt dần, laptop đang ngủ dở — không hề biến mất. TCP tạo áp lực ngược, và mọi thứ máy chủ vẫn tiếp tục gửi sẽ chất đống trong bộ nhớ của <em>bạn</em>:</p>
<div class="out">Client ngừng đọc. Máy chủ vẫn send() 3000 tin × 64KB = 187,5MB
  ws.bufferedAmount = 187,0MB  ← đang nằm trong RAM máy chủ
  RSS 65,1MB → 257,5MB (+192,4MB)
  readyState = 1 (1 = OPEN) → send() KHÔNG hề báo lỗi</div>
<p>Socket vẫn báo <code>OPEN</code>. <code>send()</code> vẫn trả về bình thường. Một client tốn 192MB và không có lỗi nào ở đâu cả. Cách chặn là nhìn trước khi ghi:</p>
<pre><code><span class="tok-kw">const</span> LIMIT = <span class="tok-num">1</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span>;               <span class="tok-cmt">// 1MB hàng đợi cho mỗi socket</span>
<span class="tok-kw">if</span> (ws.bufferedAmount &gt; LIMIT) {
  <span class="tok-cmt">// khách này không theo kịp: bỏ tin, hoặc đóng và bắt họ tải lại từ REST</span>
  <span class="tok-kw">return</span>;
}
ws.send(payload);</code></pre>
<div class="out">với ngưỡng 1,0MB: bỏ 100/100 tin thay vì phình RAM vô hạn</div>
<p>Bỏ bớt khung tin là hành vi ĐÚNG, và nó chỉ chấp nhận được nhờ nguyên tắc thiết kế ở bài 11.3: socket là tín hiệu, REST mới là sự thật. Một client bị lỡ vài khung tin chỉ cần tải lại là đầy đủ trở lại.</p>

<h3>Tài nguyên dùng chung còn lại: event loop</h3>
<p>Mọi socket trên một tiến trình đều dùng chung một event loop. Chương 2 đã đo một lần chặn đồng bộ 3 giây; trên một máy chủ HTTP điều đó nghĩa là request chậm, còn trên một máy chủ realtime thì nghĩa là <strong>nhịp tim không được trả lời</strong>. Chặn lâu hơn <code>pingTimeout</code> là các client bắt đầu TỰ ngắt kết nối, rồi cùng nối lại một lúc — một cơn bão do chính một vòng lặp chậm gây ra. Đó cũng là lý do phần xử lý ảnh ở chương 10 phải xếp hàng: CPU tiêu cho một lần upload là độ trễ cộng vào mọi socket đang mở.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>attachRedisAdapter()</code> trong <code>src/socket/messaging.socket.ts</code> nhân đôi client ioredis dùng chung thành hai (một để công bố, một để lắng nghe — một kết nối đang subscribe thì không chạy lệnh khác được) rồi gắn adapter, bọc trong try/catch để <strong>quay về adapter trong bộ nhớ và ghi log cảnh báo</strong> nếu Redis không với tới được. Đó là đánh đổi đúng cho cách triển khai này: với một container backend duy nhất, room trong bộ nhớ là đúng và realtime vẫn chạy xuyên qua một sự cố Redis; nhưng ngay khi có instance thứ hai, adapter chính là thứ ngăn phép đo 1 xảy ra. Phần transport vẫn để <code>['websocket', 'polling']</code> — đường lui được giữ có chủ đích cho người dùng sau proxy bóc header upgrade — và đó đúng là cấu hình <em>đòi hỏi</em> sticky session trước khi mở rộng ra nhiều máy, một điều đáng viết lên tường trước khi container thứ hai ra đời. Cấu hình nhịp tim là <code>pingInterval: 25000, pingTimeout: 60000</code>, rộng lượng hơn mặc định: nó chịu đựng được chiếc điện thoại sóng yếu, đổi lại một người dùng ma có thể hiện là đang online tới 85 giây.</p>
</div>

<div class="pitfall">
<p><strong>Sáu thứ vỡ ngay ở tiến trình thứ hai.</strong> (1) Không có adapter — đúng phép đo 1, im lặng. (2) Dùng chung một kết nối Redis cho cả publish lẫn subscribe: client đang subscribe từ chối mọi lệnh khác và mọi thứ treo. (3) Thêm container thứ hai mà không bật sticky session trong khi long-polling vẫn đang bật. (4) Giữ trạng thái trong bộ nhớ của máy chủ socket (một <code>Set</code> người đang online, một bản đồ phòng) — mỗi tiến trình có bản riêng, nên "ai đang online" giờ là câu trả lời theo từng tiến trình; trạng thái đó phải chuyển sang Redis. (5) Một lần deploy khởi động lại mọi container cùng lúc: mọi client nối lại trong cùng một giây, đó là cơn lũ tự mình gây ra — hãy làm lệch pha hoặc thêm nhiễu ngẫu nhiên vào khoảng chờ kết nối lại. (6) Không bao giờ chặn <code>bufferedAmount</code>, để một đường mạng tồi biến thành một cú OOM.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Room sống trong bộ nhớ của MỘT tiến trình, nên tiến trình thứ hai làm cho chúng sai — adapter không phải một phép tối ưu, nó là thứ giữ cho mô hình còn đúng. Sticky session là bài toán tách biệt và chỉ biến mất nếu bạn từ bỏ đường lui long-poll. Còn trên chính cái máy đó, hãy nhớ mọi socket đang dùng chung cái gì: bộ nhớ của bạn, qua các bộ đệm gửi, và event loop của bạn, qua mọi thứ còn lại.</p>

<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-942" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 942 — Scaling with the Redis Adapter</span><span class="lc-sub">10 bài tập: phát tin xuyên tiến trình và bài toán sticky session.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/socket-io${REF}#module-947" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 947 — Production Patterns &amp; Security</span><span class="lc-sub">10 bài tập: chạy realtime thật trên nhiều tiến trình.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Quiz: realtime|||11.5 — Kiểm tra: realtime',
      slug: 'nodejs-11-5-quiz',
      type: 'QUIZ',
      description: 'Chín câu về chi phí của polling, bộ nhớ mỗi kết nối, room, phân quyền theo sự kiện, nhịp tim, adapter, sticky session và áp lực ngược.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 11.1 to 11.4 — the 799 bytes a poll costs to say "nothing happened", the process that broadcast to nobody and reported success, the 192MB one slow client took. Realtime is the area where things fail without producing an error, so prefer the output block over your intuition.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 11.1 tới 11.4 — 799 byte mà một lần polling tốn để nói "không có gì xảy ra", cái tiến trình phát tin cho không ai mà vẫn báo thành công, 192MB mà một client chậm ăn mất. Realtime là mảng mà mọi thứ hỏng NHƯNG KHÔNG sinh ra lỗi, nên hãy tin khối kết quả đo hơn là tin trực giác.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A poll of an authenticated endpoint that answers {"unread":0} cost 799 bytes per request over keep-alive, while the JSON body is 47 bytes. Where did the rest go?|||Một lần polling tới endpoint có xác thực, trả về {"unread":0}, tốn 799 byte mỗi request trên kết nối keep-alive, trong khi thân JSON chỉ 47 byte. Chỗ còn lại đi đâu?',
            options: [
              'TCP and TLS handshakes on every request|||Bắt tay TCP và TLS ở mỗi request',
              'HTTP headers — cookie (~250B), User-Agent, Accept-Language and the response headers — which are re-sent in full on every single poll|||Header HTTP — cookie (~250B), User-Agent, Accept-Language và header phản hồi — bị gửi lại đầy đủ trong TỪNG lần hỏi',
              'JSON serialization overhead in Express|||Chi phí tuần tự hoá JSON của Express',
              'The socket buffer padding the payload to a fixed size|||Bộ đệm socket đệm thêm cho payload đủ một kích thước cố định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ws held 5.000 connections in +51,2MB and Socket.IO in +109,6MB. Given chapter 10 measured 729MB for four concurrent 120MB uploads, what is the right conclusion?|||ws giữ 5.000 kết nối hết +51,2MB còn Socket.IO hết +109,6MB. Biết chương 10 đo được 729MB cho bốn lượt upload 120MB đồng thời, kết luận đúng là gì?',
            options: [
              'Socket.IO is too heavy for production; use raw ws|||Socket.IO quá nặng cho production; hãy dùng ws thuần',
              'Connections themselves are cheap (~10–22KB each) — what costs memory is what flows through them, so pick the library for its features, not its per-connection footprint|||Bản thân kết nối rất rẻ (~10–22KB mỗi cái) — thứ tốn bộ nhớ là cái CHẢY QUA nó, nên hãy chọn thư viện theo tính năng chứ không theo dung lượng mỗi kết nối',
              'Memory scales quadratically with connection count|||Bộ nhớ tăng theo bình phương số kết nối',
              '5.000 connections is near the limit of a Node process|||5.000 kết nối là gần tới giới hạn của một tiến trình Node',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Broadcasting to 5.000 clients returned from emit() in 37,6ms while the last client received at 55,1ms. What does the 37,6ms actually represent?|||Phát tin cho 5.000 client thì emit() trả về sau 37,6ms trong khi client cuối cùng nhận lúc 55,1ms. Con số 37,6ms thật ra là gì?',
            options: [
              'Network latency to the slowest client|||Độ trễ mạng tới client chậm nhất',
              'Time the EVENT LOOP was blocked writing to 5.000 sockets in a loop — 37,6ms during which no HTTP request was served either|||Thời gian EVENT LOOP bị chặn để ghi lần lượt vào 5.000 socket — 37,6ms đó cũng không request HTTP nào được phục vụ',
              'The time Socket.IO spent serializing the payload once|||Thời gian Socket.IO tuần tự hoá payload một lần',
              'Redis adapter round-trip time|||Thời gian đi-về của adapter Redis',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A logged-in user with a fully valid token emitted thread:join with a thread id belonging to two other people, and started receiving that conversation&#39;s messages live. What was missing?|||Một người dùng đã đăng nhập với token hoàn toàn hợp lệ emit thread:join kèm id cuộc trò chuyện của hai người khác, và bắt đầu nhận tin nhắn của cuộc đó theo thời gian thực. Thứ còn thiếu là gì?',
            options: [
              'Token validation in the handshake middleware|||Việc kiểm token trong middleware bắt tay',
              'Per-event AUTHORIZATION — the handshake proved WHO they are; each handler must still prove they may do THIS. A typeof check is not a permission check|||PHÂN QUYỀN theo từng sự kiện — cái bắt tay chứng minh họ LÀ AI; mỗi handler vẫn phải chứng minh họ ĐƯỢC PHÉP làm việc NÀY. Kiểm typeof không phải kiểm quyền',
              'CORS configuration on the socket server|||Cấu hình CORS trên máy chủ socket',
              'Rate limiting on the thread:join event|||Giới hạn tần suất cho sự kiện thread:join',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With pingInterval 1000 and pingTimeout 2000, a client whose network black-holed was detected as gone after 3010ms. What follows for the Socket.IO defaults (25000 / 20000)?|||Với pingInterval 1000 và pingTimeout 2000, một client bị mất mạng kiểu hố đen được phát hiện là đã chết sau 3010ms. Từ đó suy ra gì cho cấu hình mặc định của Socket.IO (25000 / 20000)?',
            options: [
              'Detection is immediate because TCP reports the broken connection|||Phát hiện là tức thì vì TCP báo kết nối đã đứt',
              'Up to 45 seconds during which the user still counts as online, stays in every room, and receives messages into the void|||Có thể tới 45 giây mà người dùng vẫn được tính là đang online, vẫn nằm trong mọi phòng, và vẫn nhận tin vào hư không',
              'The client detects it first and tells the server|||Client tự phát hiện trước rồi báo cho máy chủ',
              'The connection is closed after 20 seconds regardless of pings|||Kết nối bị đóng sau 20 giây bất kể ping',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a reconnect the client got a NEW socket id and received 0 of the 5 messages emitted while it was offline. What is the correct design response?|||Sau khi kết nối lại, client nhận một socket id MỚI và nhận 0 trong số 5 tin phát lúc nó offline. Phản ứng thiết kế đúng là gì?',
            options: [
              'Increase the server-side buffer so messages are replayed on reconnect|||Tăng bộ đệm phía máy chủ để tin cũ được phát lại khi kết nối lại',
              'Treat the socket as a SIGNAL and REST as the truth: re-join rooms inside the connect handler and fetch what was missed with GET …?since=&lt;last id&gt;, de-duplicating by id|||Coi socket là TÍN HIỆU còn REST là sự thật: vào lại phòng bên trong handler connect và lấy phần đã lỡ bằng GET …?since=&lt;id cuối&gt;, khử trùng lặp theo id',
              'Key client state by socket.id so it resets cleanly on reconnect|||Đánh khoá trạng thái client theo socket.id để nó tự reset sạch khi kết nối lại',
              'Disable reconnection and ask the user to refresh|||Tắt tính năng kết nối lại và bảo người dùng tải lại trang',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two Socket.IO processes, no adapter: a client on process A got nothing when process B emitted to its room, and B&#39;s emit() returned in 0,42ms reporting success. Why is this so dangerous?|||Hai tiến trình Socket.IO, không adapter: client ở tiến trình A không nhận được gì khi tiến trình B phát vào phòng của nó, và emit() của B trả về sau 0,42ms báo thành công. Vì sao chuyện này nguy hiểm đến thế?',
            options: [
              'Because Redis was down and nobody noticed|||Vì Redis chết mà không ai để ý',
              'Because rooms are an in-memory map per process — B&#39;s room really was empty, so it fanned out correctly to nobody: no error, no log, nothing to alert on|||Vì room là bản đồ trong bộ nhớ của TỪNG tiến trình — phòng của B thật sự rỗng nên nó rải tin đúng đắn cho không ai cả: không lỗi, không log, không gì để cảnh báo',
              'Because the client should have connected to both processes|||Vì client lẽ ra phải kết nối vào cả hai tiến trình',
              'Because emit() is asynchronous and 0,42ms is too fast to have worked|||Vì emit() là bất đồng bộ và 0,42ms là quá nhanh để có thể đã chạy xong',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Behind a round-robin load balancer, transport=polling failed with "xhr post error" while transport=websocket worked. Does the Redis adapter fix the polling case?|||Đứng sau một bộ cân bằng tải luân phiên, transport=polling hỏng với "xhr post error" còn transport=websocket thì chạy. Adapter Redis có sửa được trường hợp polling không?',
            options: [
              'Yes — the adapter shares session state across processes|||Có — adapter chia sẻ trạng thái phiên giữa các tiến trình',
              'No. The adapter fans BROADCASTS across processes; it does not make a session portable. Long-polling is many requests carrying one session id, so it needs sticky sessions — or drop the fallback and use websocket only|||Không. Adapter rải PHÁT TIN xuyên tiến trình; nó không làm phiên di chuyển được. Long-polling là nhiều request cùng mang một id phiên nên nó cần sticky session — hoặc bỏ đường lui và chỉ dùng websocket',
              'Yes, provided both processes share the same Redis connection|||Có, miễn là hai tiến trình dùng chung một kết nối Redis',
              'No, because polling is deprecated in Socket.IO 4|||Không, vì polling đã bị loại bỏ ở Socket.IO 4',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A client stopped reading; the server kept calling send() and ws.bufferedAmount reached 187MB while RSS grew 192,4MB — with readyState still OPEN and no error. What is the fix?|||Một client ngừng đọc; máy chủ vẫn gọi send() và ws.bufferedAmount lên tới 187MB trong khi RSS tăng 192,4MB — readyState vẫn là OPEN và không lỗi nào. Cách sửa là gì?',
            options: [
              'Catch the error from send() and retry with backoff|||Bắt lỗi từ send() rồi thử lại với giãn cách tăng dần',
              'Check bufferedAmount before writing and DROP frames (or close the socket) past a threshold — safe precisely because the socket is a signal and REST is the truth|||Kiểm bufferedAmount trước khi ghi và BỎ khung tin (hoặc đóng socket) khi vượt ngưỡng — an toàn chính vì socket là tín hiệu còn REST mới là sự thật',
              'Enable permessage-deflate so the queue compresses|||Bật permessage-deflate để hàng đợi được nén lại',
              'Move the send loop into a worker thread|||Chuyển vòng lặp gửi vào một worker thread',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
