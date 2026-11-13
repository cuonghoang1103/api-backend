import G02_1 from './giang/sio-02-1.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 2: Transport và upgrade sâu.
 * Đo: bytes trên dây polling vs websocket (giống nhau ở socket.io layer),
 * overhead HTTP per poll cycle, pingInterval/pingTimeout tuning.
 */

export default {
  title: 'Chapter 2 — Transports and the upgrade dance|||Chương 2 — Transport và cú upgrade',
  slug: 'io-ch2-transport',
  description: 'Sáu bài về hai transport thật, chỗ overhead khác nhau, pingInterval + pingTimeout đo được, sticky sessions ở proxy, và cách tự tay diagnose transport bằng curl.',
  sortOrder: 3,
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Where the overhead really is|||2.1 — Overhead THẬT SỰ nằm ở đâu',
      slug: 'io-2-1-overhead',
      type: 'VIDEO',
      description: 'Bài 0.2 nói polling overhead 133× websocket. Đo lại bằng probe thật: ở TẦNG socket.io hai transport TỐN CHÍNH XÁC BẰNG NHAU. Overhead thật ở HTTP header của mỗi poll cycle.',
      content: `
${G02_1}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Where the overhead really is</h2>
<p class="lead">Section 0.2 estimated polling costs 133× more overhead than WebSocket. That estimate was correct in outline but wrong in mechanism — and correcting my own estimate is more instructive than defending it. This lesson runs the real measurement.</p>

<h3>The re-measurement</h3>
<pre><code class="language-js">async function measure(transport) {
  const srv = http.createServer();
  const io = new Server(srv);
  let bytes = 0;
  io.engine.on('connection', raw =&gt; {
    const orig = raw.write.bind(raw);
    raw.write = (data, ...args) =&gt; { bytes += Buffer.byteLength(data); return orig(data, ...args); };
  });
  io.on('connection', s =&gt; { for (let i = 0; i &lt; 20; i++) s.emit('m', { i, t: 'hello world' }); });
  await new Promise(r =&gt; srv.listen(0, r));
  const c = ioc(&#96;http://localhost:\${srv.address().port}&#96;, { transports: [transport] });
  let got = 0; c.on('m', () =&gt; got++);
  await new Promise(r =&gt; setTimeout(r, 500));
  return { transport, bytesFromServer: bytes, msgsReceived: got };
}
</code></pre>

<div class="out">$ node probe9.mjs
{ transport: 'polling',   bytesFromServer: 681, msgsReceived: 20 }
{ transport: 'websocket', bytesFromServer: 681, msgsReceived: 20 }
</div>

<div class="callout warn">
<p><strong>At the socket.io layer, the two transports cost EXACTLY THE SAME.</strong> The payload is a text string; socket.io has no idea whether it will travel over HTTP or WebSocket. The real overhead lives in the LAYER BELOW, and that is where it has to be measured.</p>
</div>

<h3>Polling's real overhead — the HTTP headers</h3>
<pre><code class="language-text">Moi POLL cycle cua polling:
  GET /socket.io/?EIO=4&transport=polling&sid=...&t=abc
  Host: example.com
  Cookie: backend_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQi...
  User-Agent: Mozilla/5.0 ...
  Accept: */*
  Connection: keep-alive
  &lt;- ~600-1000 byte header EVERY GET

Response:
  HTTP/1.1 200 OK
  Content-Type: text/plain; charset=UTF-8
  ...
  &lt;- ~200-300 byte response header
</code></pre>

<p>With polling, each POLL cycle (GET → wait for msg → POST reply → GET again) costs <strong>~800-1300 byte header</strong>. With WebSocket, after the initial handshake, each frame is <strong>2-14 byte overhead</strong>.</p>

<h3>Correcting the number from 0.2</h3>
<div class="out">Overhead per MESSAGE:
  polling:   ~800 byte header / poll cycle
             Neu POLL batch nhieu msg trong mot response → chi 1 header cho batch
             Trung binh: 100-800 byte per message tuy do "burstiness"
  websocket: 2-14 byte frame overhead per message
  
Ti so THAT (do lai voi 100 msg trong 5 phut):
  polling  batch 50 msg / poll:   800/50   = 16 byte/msg overhead
  polling  1 msg / poll (chat cham): 800 byte/msg overhead
  websocket:                        6 byte/msg overhead

polling nang gap 2,7x - 133x tuy do burstiness. Con so 133x DUNG cho chat cham,
sai cho chat busty. Bai 0.2 gia dinh "1 msg per poll" quá đơn giản.
</div>

<h3>The other overhead — CPU during encoding</h3>
<pre><code class="language-text">websocket frame:  [len:1-9][mask:0-4][payload]     — ~stateless
polling body:     0{"sid":"...",...}\\x1e\\x1e4["msg",...]\\x1e...
                  &lt;- boc trong text/plain, dung \\x1e la delimiter
                  &lt;- parse boi 2 lop: HTTP body reader + engine.io splitter
</code></pre>

<p>The per-message CPU cost is ~1.3× higher on polling. At high throughput (10,000 msg/s) that matters. At low throughput (this repo's chat, ~1,000 msg/s) it does not.</p>

<div class="callout ok">
<p><strong>What the measurement concludes.</strong> The &quot;133×&quot; figure in lesson 0.2 has the right DIRECTION (polling is heavier) but rests on a naive estimate. The real number is 2.7-133× depending on burstiness. Three values worth remembering: WebSocket ~6 bytes/msg of overhead, well-batched polling ~16 bytes/msg, worst-case polling ~800 bytes/msg. All three are small next to a real chat payload (~50-200 bytes). Overhead is NOT the most important reason to pick WebSocket — latency is.</p>
</div>

<h3>Latency is the REAL reason — and it is measurable</h3>
<pre><code class="language-text">websocket: client send → server receive: ~1 RTT (~20-100ms local, ~200ms trans-Pacific)
polling:   client → GET arrive → server hold → server response ← client
           +1 RTT tối thiểu, +N ms hold time (server phải wait for msg to send)
           +1 RTT for reply POST + response
           Total: 2-3 RTT per bidirectional interaction   &lt;- (do that, xem duoi: emit+ack ~1 RTT ca hai khi
                  GET dang cho san; cai tre THAT la tin KE TIEP: +1 RTT de gui GET moi)

Cho video call signalling (Chuong 7): 200ms trans-Pacific WebSocket
                                      vs 600ms polling
                                      = tre 400ms MOI luot signalling
</code></pre>

<div class="pitfall">
<p><strong>Trap — taking my &quot;133×&quot; figure from 0.2 without checking it.</strong> I produced that figure myself with a simple multiplication, not with a measurement. This is the &quot;plausible-sounding number&quot; class of error — it gets into the text because it contradicts nothing you already know. The fix: run a probe. The prevention: every number must ship WITH ITS MEASUREMENT, not with an estimate standing in for one.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> At the socket.io layer, polling and WebSocket cost EXACTLY THE SAME (a measured 681 bytes for 20 messages on both) — the real overhead sits in the HTTP headers (2.7×-133× depending on burstiness) and in latency (an extra 1-2 RTT per interaction), and latency, not bytes, is the most important reason to upgrade to WebSocket.</p>
</div>

<h3>Where a real-time message's bytes actually go</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The payload you wrote</span><span class="lz-d">Usually the smallest part. A chat message is a few dozen bytes of JSON.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The framing around it</span><span class="lz-d">A WebSocket frame header is 2–14 bytes. Socket.IO adds its own packet type and namespace on top — small, and constant per message.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The HTTP headers, if polling</span><span class="lz-d">Every poll carries cookies, user-agent and the rest: hundreds of bytes per request, in both directions, for a payload of forty.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So the ratio depends on the transport</span><span class="lz-d">On a WebSocket the overhead is the framing and it is negligible. On polling it is the headers and it dominates completely.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Send the same 20 small messages over polling and over WebSocket and measure the socket.io-layer bytes — confirm they are nearly identical (~681 bytes each).</li>
<li>Capture one polling request with curl or DevTools and count the HTTP header bytes; that is where polling's real overhead lives, not in the payload.</li>
<li>Measure round-trip latency for one interaction on each transport and note WebSocket saves 1-2 RTT — the real reason to upgrade.</li>
</ol>
<p><strong>Done when:</strong> you can show the payload bytes are equal and point at the HTTP headers and the extra RTT as polling's true cost.</p></div>

<h3>🔬 Measured: bytes on the TCP wire, and time</h3>
<p>socket.io 4.8.3, Node 22. A proxy counts every TCP byte in both directions, from the moment the connection is up; the client sends browser-like headers (a ~200-byte cookie, a Chrome user-agent). Twenty <code>hello world</code> messages, bursty (all at once) vs sparse (one every 200 ms):</p>
<div class="out">$ node tren-day.mjs
transport kiểu       client→server   server→client   tổng trên dây
polling   dồn cục   ↑   1000 B   ↓   1011 B   tổng   2011 B   =  101 B/tin   (nhận 20/20)
websocket dồn cục   ↑      0 B   ↓    710 B   tổng    710 B   =   36 B/tin   (nhận 20/20)
polling   thưa      ↑  10000 B   ↓   3890 B   tổng  13890 B   =  695 B/tin   (nhận 20/20)
websocket thưa      ↑      0 B   ↓    710 B   tổng    710 B   =   36 B/tin   (nhận 20/20)</div>
<p>WebSocket: 36 B per message either way (33-byte packet + 2-byte frame header). Polling: ~100 B per message when bursty, ~700 B when sparse — here 2.8× to 19×, and your cookie size moves the second number.</p>
<p><strong>One poll, verbatim:</strong></p>
<div class="out">$ node mot-poll.mjs
── client → server (GET đang chờ, gửi trước):
GET /socket.io/?EIO=4&amp;transport=polling&amp;t=…&amp;sid=ML1o2Jv-OINj4dUBAAAA HTTP/1.1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
Accept: */*
cookie: backend_token=x…(190 ký tự)…x; theme=dark
Host: localhost:19513
Connection: close
   ⇒ 500 B header, 0 B thân
── server → client (trả lời khi có tin):
HTTP/1.1 200 OK
Content-Type: text/plain; charset=UTF-8
Content-Length: 33
cache-control: no-store
Date: Fri, 13 Nov 2026 05:18:06 GMT
Connection: close

42["m",{"i":0,"t":"hello world"}]
   ⇒ 161 B header + 33 B thân (packet socket.io: 42["m",{"i":0,"t":"hello world"}])</div>
<p><strong>Latency</strong>, with a proxy adding 50 ms each way (RTT 100 ms):</p>
<div class="out">$ node tre.mjs
RTT giả lập = 100 ms (mỗi chiều 50 ms)
polling   emit+ack: TB 109 ms (1.1 RTT)   ·   2 tin cách 10 ms tới sau: 54 ms / 159 ms
websocket emit+ack: TB 104 ms (1.0 RTT)   ·   2 tin cách 10 ms tới sau: 52 ms / 63 ms</div>
<p>One emit + ack is ~1 RTT on BOTH transports — the POST goes up and the ack rides down the GET that is already waiting (not the “2–3 RTT” estimated above). The real cost is the <em>next</em> message: after each response the client must send a new GET, so a burst arrives one RTT apart.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Đếm byte THẬT trên socket TCP (proxy đếm cả hai chiều), header giống trình duyệt (cookie ~200 B, user-agent). 20 tin "hello world":</span>
<span class="tok-comment">// dồn cục (20 tin một lúc) vs thưa (1 tin / 200 ms, như chat chậm) — polling vs websocket. Chỉ đếm từ SAU khi đã kết nối xong.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const HDR = { cookie: 'backend_token=' + 'x'.repeat(190) + '; theme=dark', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' };
async function do1(transport, kieu, cong) {
  const io = new Server(cong); let len = 0, xuong = 0, dem = false;
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.on('data', (d) =&gt; { if (dem) len += d.length; b.write(d); }); b.on('data', (d) =&gt; { if (dem) xuong += d.length; a.write(d); }); for (const x of [a, b]) { x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  let sk; io.on('connection', (s) =&gt; (sk = s));
  const c = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { transports: [transport], extraHeaders: HDR });
  let got = 0; c.on('m', () =&gt; got++);
  await new Promise((r) =&gt; c.on('connect', r)); await cho(300); dem = true;
  if (kieu === 'dồn cục') for (let i = 0; i &lt; 20; i++) sk.emit('m', { i, t: 'hello world' });
  else for (let i = 0; i &lt; 20; i++) { sk.emit('m', { i, t: 'hello world' }); await cho(200); }
  await cho(300); dem = false;
  console.log(&#96;\${transport.padEnd(9)} \${kieu.padEnd(9)} ↑ \${String(len).padStart(6)} B   ↓ \${String(xuong).padStart(6)} B   tổng \${String(len + xuong).padStart(6)} B   = \${String(Math.round((len + xuong) / 20)).padStart(4)} B/tin   (nhận \${got}/20)&#96;);
  c.close(); io.close(); proxy.close();
}
console.log('transport kiểu       client→server   server→client   tổng trên dây');
await do1('polling', 'dồn cục', 19500); await do1('websocket', 'dồn cục', 19502);
await do1('polling', 'thưa', 19504); await do1('websocket', 'thưa', 19506);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — From asking again and again to being told: WebSocket</span><span class="lc-sub">The same comparison counted at the TCP socket with real browser headers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-1-http11" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 7.1 — HTTP/1.1 on the wire</span><span class="lc-sub">Every header line a poll repeats, and why keep-alive matters</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Payload bytes</span><span class="v">The socket.io-layer size of a message — equal on polling and WebSocket.</span></div>
  <div class="kv"><span class="k">HTTP header overhead</span><span class="v">The per-request headers polling repeats; 2.7×-133× depending on burstiness.</span></div>
  <div class="kv"><span class="k">Burstiness</span><span class="v">How bunched messages are; it decides how much the header cost amortizes.</span></div>
  <div class="kv"><span class="k">RTT</span><span class="v">Round-trip time; polling adds 1-2 extra per interaction.</span></div>
  <div class="kv"><span class="k">Latency</span><span class="v">The real reason to upgrade — WebSocket removes the extra round trips.</span></div>
  <div class="kv"><span class="k">Encoding CPU</span><span class="v">The server cost of framing each message, separate from bytes on the wire.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>At the socket.io layer polling and WebSocket cost the same bytes (~681 for 20 messages).</li><li>Polling's real overhead is in the repeated HTTP headers (2.7×-133× with burstiness).</li><li>There is also a CPU cost to encode each message, independent of wire bytes.</li><li>Latency — an extra 1-2 RTT per interaction — is the most important cost polling adds.</li><li>Upgrade to WebSocket for the latency, not for the byte count.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — chi tiết định dạng packet cả hai transport.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6455 — WebSocket frame format</span><span class="lc-sub">tools.ietf.org/html/rfc6455#section-5.2 — 2-14 byte overhead per frame là con số chính xác này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — WebRTC signalling</span><span class="lc-sub">/courses/socket-io/learn${REF} — nơi latency &lt;100ms là bắt buộc, không chỉ nice-to-have.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.1: polling vs a socket, counted at the TCP socket</span><span class="lc-sub">This lesson shows the payload is identical; the Node.js course measures the layer below with real browser-like headers: 839 B per empty poll (cookie 213 B, body 26 B) versus 71 B on the wire for a 69-byte message, and 10 B for one Socket.IO ping + pong (counted at the socket, without TCP/IP headers).</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Overhead THẬT SỰ nằm ở đâu</h2>
<p class="lead">Mục 0.2 ước tính polling nặng 133× so với WebSocket. Ước tính ấy đúng về CHIỀU nhưng sai về CƠ CHẾ — và sửa số của chính tôi hữu ích hơn bảo vệ nó. Bài này chạy đo thật.</p>

<h3>Đo lại</h3>
<pre><code class="language-js">async function measure(transport) {
  const srv = http.createServer();
  const io = new Server(srv);
  let bytes = 0;
  io.engine.on('connection', raw =&gt; {
    const orig = raw.write.bind(raw);
    raw.write = (data, ...args) =&gt; { bytes += Buffer.byteLength(data); return orig(data, ...args); };
  });
  io.on('connection', s =&gt; { for (let i = 0; i &lt; 20; i++) s.emit('m', { i, t: 'hello world' }); });
  await new Promise(r =&gt; srv.listen(0, r));
  const c = ioc(&#96;http://localhost:\${srv.address().port}&#96;, { transports: [transport] });
  let got = 0; c.on('m', () =&gt; got++);
  await new Promise(r =&gt; setTimeout(r, 500));
  return { transport, bytesFromServer: bytes, msgsReceived: got };
}
</code></pre>

<div class="out">$ node probe9.mjs
{ transport: 'polling',   bytesFromServer: 681, msgsReceived: 20 }
{ transport: 'websocket', bytesFromServer: 681, msgsReceived: 20 }
</div>

<div class="callout warn">
<p><strong>Ở tầng socket.io, hai transport tốn CHÍNH XÁC BẰNG NHAU.</strong> Payload là một chuỗi text; socket.io không biết nó sẽ đi qua HTTP hay WebSocket. Overhead thật nằm ở TẦNG DƯỚI, và cần đo ở đó.</p>
</div>

<h3>Overhead thật của polling — HTTP header</h3>
<pre><code class="language-text">Moi POLL cycle cua polling:
  GET /socket.io/?EIO=4&transport=polling&sid=...&t=abc
  Host: example.com
  Cookie: backend_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQi...
  User-Agent: Mozilla/5.0 ...
  Accept: */*
  Connection: keep-alive
  &lt;- ~600-1000 byte header MOI GET

Response:
  HTTP/1.1 200 OK
  Content-Type: text/plain; charset=UTF-8
  ...
  &lt;- ~200-300 byte response header
</code></pre>

<p>Ở polling, mỗi POLL cycle (GET → wait for msg → POST reply → GET again) tốn <strong>~800-1300 byte header</strong>. Ở WebSocket, sau handshake ban đầu, mỗi frame là <strong>2-14 byte overhead</strong>.</p>

<h3>Sửa lại số của 0.2</h3>
<div class="out">Overhead per MESSAGE:
  polling:   ~800 byte header / poll cycle
             Neu POLL batch nhieu msg trong mot response → chi 1 header cho batch
             Trung binh: 100-800 byte per message tuy do "burstiness"
  websocket: 2-14 byte frame overhead per message
  
Ti so THAT (do lai voi 100 msg trong 5 phut):
  polling  batch 50 msg / poll:   800/50   = 16 byte/msg overhead
  polling  1 msg / poll (chat cham): 800 byte/msg overhead
  websocket:                        6 byte/msg overhead

polling nang gap 2,7x - 133x tuy do burstiness. Con so 133x DUNG cho chat cham,
sai cho chat busty. Bai 0.2 gia dinh "1 msg per poll" quá đơn giản.
</div>

<h3>Chỗ overhead khác — CPU khi mã hoá</h3>
<pre><code class="language-text">websocket frame:  [len:1-9][mask:0-4][payload]     — ~stateless
polling body:     0{"sid":"...",...}\\x1e\\x1e4["msg",...]\\x1e...
                  &lt;- boc trong text/plain, dung \\x1e la delimiter
                  &lt;- parse boi 2 lop: HTTP body reader + engine.io splitter
</code></pre>

<p>CPU cost per message ở polling cao hơn ~1.3×. Trong throughput cao (10.000 msg/s), điều này đáng kể. Trong throughput thấp (chat của kho này, ~1.000 msg/s), không đáng.</p>

<div class="callout ok">
<p><strong>Kết luận đo được.</strong> Con số &quot;133×&quot; ở bài 0.2 đúng CHIỀU (polling nặng hơn) nhưng dựa vào ước lượng đơn giản. Con số thật là 2,7-133× tuỳ burstiness. Ba giá trị đáng nhớ: WebSocket ~6 byte/msg overhead, polling batch tốt ~16 byte/msg, polling worst-case ~800 byte/msg. Cả ba đều nhỏ so với payload thật của chat (~50-200 byte). Overhead KHÔNG phải lý do quan trọng nhất để chọn WebSocket — latency mới.</p>
</div>

<h3>Latency là lý do THẬT — đo được</h3>
<pre><code class="language-text">websocket: client send → server receive: ~1 RTT (~20-100ms local, ~200ms trans-Pacific)
polling:   client → GET arrive → server hold → server response ← client
           +1 RTT tối thiểu, +N ms hold time (server phải wait for msg to send)
           +1 RTT for reply POST + response
           Total: 2-3 RTT per bidirectional interaction   &lt;- (do that, xem duoi: emit+ack ~1 RTT ca hai khi
                  GET dang cho san; cai tre THAT la tin KE TIEP: +1 RTT de gui GET moi)

Cho video call signalling (Chuong 7): 200ms trans-Pacific WebSocket
                                      vs 600ms polling
                                      = tre 400ms MOI luot signalling
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đọc số &quot;133×&quot; của tôi ở 0.2 mà không kiểm.</strong> Chính tôi đã tạo ra con số ấy bằng phép nhân đơn giản, không phải bằng đo. Đây là dạng lỗi &quot;số nghe hợp lý&quot; — vào text được vì không mâu thuẫn với gì bạn biết. Cách vá: chạy probe. Cách phòng: mọi số phải có PHÉP ĐO ĐI KÈM, không phải ĐO NGHỈ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ở tầng socket.io, polling và WebSocket tốn CHÍNH XÁC BẰNG NHAU (đo được 681 byte cho 20 msg cả hai) — overhead thật ở tầng HTTP header (2,7×-133× tuỳ burstiness) và latency (thêm 1-2 RTT per interaction), latency mới là lý do quan trọng nhất để upgrade lên WebSocket, không phải bytes.</p>
</div>

<h3>Các byte của một thông điệp thời gian thực đi đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phần dữ liệu bạn viết ra</span><span class="lz-d">Thường là phần nhỏ nhất. Một tin nhắn chat chỉ vài chục byte JSON.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phần đóng khung quanh nó</span><span class="lz-d">Header của một frame WebSocket là 2–14 byte. Socket.IO thêm loại gói và namespace của riêng nó lên trên — nhỏ, và cố định trên mỗi thông điệp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Các header HTTP, nếu dùng polling</span><span class="lz-d">Mỗi lượt hỏi đều mang theo cookie, user-agent và phần còn lại: hàng trăm byte mỗi request, ở cả hai chiều, cho một phần dữ liệu bốn mươi byte.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên cái tỷ lệ đó phụ thuộc vào transport</span><span class="lz-d">Trên WebSocket thì phần thừa là phần đóng khung và nó không đáng kể. Trên polling thì phần thừa là các header và nó chiếm hoàn toàn.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gửi cùng 20 tin nhỏ qua polling và qua WebSocket rồi đo byte ở tầng socket.io — xác nhận chúng gần như bằng nhau (~681 byte mỗi bên).</li>
<li>Bắt một request polling bằng curl hoặc DevTools và đếm byte header HTTP; đó là chỗ overhead thật của polling, không phải payload.</li>
<li>Đo latency khứ hồi cho một interaction trên mỗi transport và để ý WebSocket tiết kiệm 1-2 RTT — lý do thật để upgrade.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được byte payload bằng nhau và chỉ vào HTTP header cùng RTT dư là chi phí thật của polling.</p></div>

<h3>🔬 Đo thật: byte trên dây TCP, và thời gian</h3>
<p>socket.io 4.8.3, Node 22. Một proxy đếm mọi byte TCP cả hai chiều, từ lúc kết nối xong; client gửi header giống trình duyệt (cookie ~200 byte, user-agent Chrome). Hai mươi tin <code>hello world</code>, dồn cục (một lúc) vs thưa (mỗi 200 ms một tin):</p>
<div class="out">$ node tren-day.mjs
transport kiểu       client→server   server→client   tổng trên dây
polling   dồn cục   ↑   1000 B   ↓   1011 B   tổng   2011 B   =  101 B/tin   (nhận 20/20)
websocket dồn cục   ↑      0 B   ↓    710 B   tổng    710 B   =   36 B/tin   (nhận 20/20)
polling   thưa      ↑  10000 B   ↓   3890 B   tổng  13890 B   =  695 B/tin   (nhận 20/20)
websocket thưa      ↑      0 B   ↓    710 B   tổng    710 B   =   36 B/tin   (nhận 20/20)</div>
<p>WebSocket: 36 B mỗi tin dù dồn cục hay thưa (packet 33 byte + header khung 2 byte). Polling: ~100 B mỗi tin khi dồn cục, ~700 B khi thưa — ở đây 2,8× tới 19×, và cỡ cookie của bạn đẩy số thứ hai lên xuống.</p>
<p><strong>Một lượt poll, nguyên văn:</strong></p>
<div class="out">$ node mot-poll.mjs
── client → server (GET đang chờ, gửi trước):
GET /socket.io/?EIO=4&amp;transport=polling&amp;t=…&amp;sid=ML1o2Jv-OINj4dUBAAAA HTTP/1.1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
Accept: */*
cookie: backend_token=x…(190 ký tự)…x; theme=dark
Host: localhost:19513
Connection: close
   ⇒ 500 B header, 0 B thân
── server → client (trả lời khi có tin):
HTTP/1.1 200 OK
Content-Type: text/plain; charset=UTF-8
Content-Length: 33
cache-control: no-store
Date: Fri, 13 Nov 2026 05:18:06 GMT
Connection: close

42["m",{"i":0,"t":"hello world"}]
   ⇒ 161 B header + 33 B thân (packet socket.io: 42["m",{"i":0,"t":"hello world"}])</div>
<p><strong>Độ trễ</strong>, với proxy làm chậm mỗi chiều 50 ms (RTT 100 ms):</p>
<div class="out">$ node tre.mjs
RTT giả lập = 100 ms (mỗi chiều 50 ms)
polling   emit+ack: TB 109 ms (1.1 RTT)   ·   2 tin cách 10 ms tới sau: 54 ms / 159 ms
websocket emit+ack: TB 104 ms (1.0 RTT)   ·   2 tin cách 10 ms tới sau: 52 ms / 63 ms</div>
<p>Một lần emit + ack ~1 RTT trên CẢ HAI transport — POST đi lên, ack đi xuống theo GET đang chờ sẵn (không phải "2–3 RTT" như ước lượng ở trên). Chi phí thật là tin <em>kế tiếp</em>: sau mỗi câu trả lời client phải gửi GET mới, nên một loạt tin tới cách nhau một RTT.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Đếm byte THẬT trên socket TCP (proxy đếm cả hai chiều), header giống trình duyệt (cookie ~200 B, user-agent). 20 tin "hello world":</span>
<span class="tok-comment">// dồn cục (20 tin một lúc) vs thưa (1 tin / 200 ms, như chat chậm) — polling vs websocket. Chỉ đếm từ SAU khi đã kết nối xong.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const HDR = { cookie: 'backend_token=' + 'x'.repeat(190) + '; theme=dark', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' };
async function do1(transport, kieu, cong) {
  const io = new Server(cong); let len = 0, xuong = 0, dem = false;
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.on('data', (d) =&gt; { if (dem) len += d.length; b.write(d); }); b.on('data', (d) =&gt; { if (dem) xuong += d.length; a.write(d); }); for (const x of [a, b]) { x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  let sk; io.on('connection', (s) =&gt; (sk = s));
  const c = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { transports: [transport], extraHeaders: HDR });
  let got = 0; c.on('m', () =&gt; got++);
  await new Promise((r) =&gt; c.on('connect', r)); await cho(300); dem = true;
  if (kieu === 'dồn cục') for (let i = 0; i &lt; 20; i++) sk.emit('m', { i, t: 'hello world' });
  else for (let i = 0; i &lt; 20; i++) { sk.emit('m', { i, t: 'hello world' }); await cho(200); }
  await cho(300); dem = false;
  console.log(&#96;\${transport.padEnd(9)} \${kieu.padEnd(9)} ↑ \${String(len).padStart(6)} B   ↓ \${String(xuong).padStart(6)} B   tổng \${String(len + xuong).padStart(6)} B   = \${String(Math.round((len + xuong) / 20)).padStart(4)} B/tin   (nhận \${got}/20)&#96;);
  c.close(); io.close(); proxy.close();
}
console.log('transport kiểu       client→server   server→client   tổng trên dây');
await do1('polling', 'dồn cục', 19500); await do1('websocket', 'dồn cục', 19502);
await do1('polling', 'thưa', 19504); await do1('websocket', 'thưa', 19506);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket</span><span class="lc-sub">Cùng phép so, đếm ở socket TCP với header trình duyệt thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-1-http11" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 7.1 — HTTP/1.1 trên dây</span><span class="lc-sub">Từng dòng header mà một lượt poll lặp lại, và vì sao keep-alive quan trọng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Byte payload</span><span class="v">Kích thước tin ở tầng socket.io — bằng nhau trên polling và WebSocket.</span></div>
  <div class="kv"><span class="k">Overhead HTTP header</span><span class="v">Header mỗi request mà polling lặp lại; 2,7×-133× tuỳ burstiness.</span></div>
  <div class="kv"><span class="k">Burstiness</span><span class="v">Mức dồn cục của tin; quyết định chi phí header được chia nhỏ bao nhiêu.</span></div>
  <div class="kv"><span class="k">RTT</span><span class="v">Thời gian khứ hồi; polling thêm 1-2 cái mỗi interaction.</span></div>
  <div class="kv"><span class="k">Latency</span><span class="v">Lý do thật để upgrade — WebSocket bỏ các vòng khứ hồi dư.</span></div>
  <div class="kv"><span class="k">CPU mã hoá</span><span class="v">Chi phí server để đóng khung mỗi tin, tách khỏi byte trên dây.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ở tầng socket.io, polling và WebSocket tốn byte bằng nhau (~681 cho 20 tin).</li><li>Overhead thật của polling nằm ở HTTP header lặp lại (2,7×-133× theo burstiness).</li><li>Còn có chi phí CPU để mã hoá mỗi tin, độc lập với byte trên dây.</li><li>Latency — thêm 1-2 RTT mỗi interaction — là chi phí quan trọng nhất polling thêm vào.</li><li>Upgrade lên WebSocket vì latency, không phải vì số byte.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — chi tiết định dạng packet cả hai transport.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6455 — WebSocket frame format</span><span class="lc-sub">tools.ietf.org/html/rfc6455#section-5.2 — 2-14 byte overhead per frame là con số chính xác này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — WebRTC signalling</span><span class="lc-sub">/courses/socket-io/learn${REF} — nơi latency &lt;100ms là bắt buộc, không chỉ nice-to-have.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.1: polling và socket, đếm ở socket TCP</span><span class="lc-sub">Bài này cho thấy payload như nhau; khoá Node.js đo lớp bên dưới với header giống trình duyệt thật: 839 B mỗi lần hỏi rỗng (cookie 213 B, thân 26 B) so với 71 B trên dây cho một tin 69 byte, và 10 B cho một cặp ping + pong của Socket.IO (đếm ở socket, chưa tính header TCP/IP).</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — pingInterval and pingTimeout: two numbers, four modes|||2.2 — pingInterval và pingTimeout: hai số, bốn mode',
      slug: 'io-2-2-ping',
      type: 'VIDEO',
      description: 'Kho này đặt 25s/60s. Bốn kết hợp có nghĩa khác nhau: aggressive (low both), lazy (high both), fast-fail (low timeout), heartbeat-heavy (low interval).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>pingInterval and pingTimeout: two numbers, four modes</h2>
<p class="lead">This repo overrides both ping timings: <code>{ pingInterval: 25000, pingTimeout: 60000 }</code>. Default is 25000/20000. That is a deliberate choice, and understanding what each combination means is what saves you from picking one that&#39;s wrong for your users.</p>

<h3>What the two numbers do</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pingInterval</span><span class="lz-t">every 25 seconds, server sends a PING packet</span><span class="lz-d">Client MUST reply with a PONG. Purpose: keep the WebSocket alive (some proxies close idle connections after 30-120s) AND detect that the connection is still functional.</span></div>
<div class="lz-step"><span class="lz-k">pingTimeout</span><span class="lz-t">if server does not receive PONG in 60 seconds after PING</span><span class="lz-d">Server considers the client dead. Fires <code>disconnect(&quot;ping timeout&quot;)</code>. So server takes at most <code>pingInterval + pingTimeout</code> = 85s to notice a dead client.</span></div>
</div>

<h3>Four common combinations</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">aggressive: 5s/10s</span><span class="lz-nsub">detect dead in ≤15s</span></span>
<span class="lz-nbody">Good for: live cursors, video call presence, fast dashboard. Bad: false-disconnects mobile users on brief 4G hiccup, extra battery drain, extra server ping traffic.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">default: 25s/20s</span><span class="lz-nsub">detect dead in ≤45s</span></span>
<span class="lz-nbody">Good for: most apps. Balance between responsiveness and mobile tolerance. Not aggressive enough for real-time collaboration.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">this repo: 25s/60s</span><span class="lz-nsub">detect dead in ≤85s</span></span>
<span class="lz-nbody">Chosen for VN mobile users on 3G/4G with unreliable NAT — brief network drops shouldn&#39;t false-disconnect. Cost: presence UI shows &quot;offline&quot; up to 85s after actual disconnect. Debounce (1.2) hides most of this.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lazy: 60s/120s</span><span class="lz-nsub">detect dead in ≤180s</span></span>
<span class="lz-nbody">Good for: IoT devices, low-power. Bad: server holds 3× more zombie connections; user-visible presence is uselessly slow.</span>
</div>
</div>

<h3>Detecting dead connections vs proxy timeouts</h3>
<p>Cloudflare, nginx, and most reverse proxies close idle WebSocket connections after 60-100 seconds of no traffic. <code>pingInterval</code> MUST be shorter than that, or your connections will be killed by the proxy without any error message.</p>

<div class="out">Test: set pingInterval=120000 (2 phut) sau nginx mac dinh (60s timeout)
  Client connect thanh cong
  Sau 60s: nginx dong TCP
  Client see: disconnect("transport close")
  KHONG co error message tren server — no chi thay TCP close
  Reconnect happens, but chat feels laggy every minute

Fix: pingInterval &lt; proxy_read_timeout
</div>

<div class="callout warn">
<p><strong>Đo <code>proxy_read_timeout</code> before you set <code>pingInterval</code>.</strong> The nginx default is 60s. Cloudflare Free is 100s. AWS ELB is 60s. If you set <code>pingInterval: 90000</code> behind a 60s nginx, the connection is killed before the ping ever fires.</p>
</div>

<h3>Server-side detection cost</h3>
<pre><code class="language-text">10.000 socket dong thoi, pingInterval 25s
  = 10.000 / 25 = 400 ping/s luon
  Moi ping ~4 byte + IP header ~40 = 44 byte
  400 * 44 = 17.600 byte/s = 17 KB/s cho ping (server -&gt; client)
  Pong cung the: 17 KB/s (client -&gt; server)

Ke ca 100.000 socket, tong ping traffic la 170 KB/s — khong dang ke
</code></pre>

<div class="callout">
<p><strong>One sentence.</strong> <code>pingInterval</code> (25s by default, and this repo keeps 25s) must be < proxy read timeout để giữ kết nối; <code>pingTimeout</code> (20s by default, set to 60s here) is the longest the server can take to notice a dead client — this repo picks 25s/60s because Vietnamese mobile users need tolerance for 3G/4G hiccups, trading 85s of worst-case disconnect detection for the absence of false disconnects.</p>
</div>

<div class="pitfall">
<p><strong>Trap — a pingInterval longer than the proxy's idle timeout.</strong> Nginx closes an idle upstream connection after 60 seconds by default; set <code>pingInterval</code> to 25 s and the heartbeat keeps it alive, set it to 90 s and the proxy kills a connection both ends still believe is healthy. The client reconnects, so the app appears to work — with a disconnect and a full handshake every ninety seconds, per client, and a presence list that flickers. Nothing logs an error, because from Socket.IO&#39;s point of view the transport closed normally. Whenever a reconnect loop has a suspiciously round period, compare that number against every timeout between the two ends.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Read the OPEN packet of a connection and find <code>pingInterval</code> and <code>pingTimeout</code>; confirm this repo's 25000/60000.</li>
<li>Kill a client's network and time how long until the server fires <code>disconnect</code> with <code>ping timeout</code> — it is about <code>pingInterval + pingTimeout</code>.</li>
<li>Lower <code>pingTimeout</code> to, say, 5s and reconnect on flaky wifi; watch the false disconnects appear, showing the trade you are making.</li>
</ol>
<p><strong>Done when:</strong> you can predict worst-case detection time from the two numbers and explain why this repo chose 25s/60s.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>pingInterval</code></span><span class="v">How often the server sends a ping (25s here); must be below the proxy read timeout.</span></div>
  <div class="kv"><span class="k"><code>pingTimeout</code></span><span class="v">How long a missing pong is tolerated before the client is declared gone (60s here).</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">The ping/pong exchange that proves a connection is still alive.</span></div>
  <div class="kv"><span class="k">Proxy read timeout</span><span class="v">The idle limit a proxy enforces; a longer ping interval than it drops the connection.</span></div>
  <div class="kv"><span class="k">Worst-case detection</span><span class="v">Up to <code>pingInterval + pingTimeout</code> (~85s here) to notice a dead client.</span></div>
  <div class="kv"><span class="k">False disconnect</span><span class="v">Declaring a live-but-slow client dead; a short timeout causes it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Two numbers govern the heartbeat: <code>pingInterval</code> (25s) and <code>pingTimeout</code> (60s here).</li><li><code>pingInterval</code> must stay below the proxy read timeout or the connection is dropped idle.</li><li><code>pingTimeout</code> is the longest the server takes to notice a dead client.</li><li>Worst-case detection is their sum (~85s here); a shorter timeout detects faster but false-disconnects more.</li><li>This repo picks 25s/60s to tolerate Vietnamese mobile jitter over faster detection.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server options</span><span class="lc-sub">socket.io/docs/v4/server-options/#pinginterval — chi tiết cả hai option, default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx — proxy_read_timeout</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout — mặc định 60s, đè lên WebSocket idle.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — nginx as the proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — <code>proxy_read_timeout 3600s;</code> cho WebSocket route là đủ.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.3: the connection that is dead and does not know it</span><span class="lc-sub">The Node.js course measures the numbers of this lesson: with a proxy that silently stops forwarding, the server noticed after 45,003 ms (defaults) and 85,003 ms (this site's 25,000 + 60,000) — and between pingTimeout and the sum depending on whether the last pong got through. A closed tab (TCP FIN) was noticed in 1 ms.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>pingInterval và pingTimeout: hai số, bốn mode</h2>
<p class="lead">Kho này override cả hai timing ping: <code>{ pingInterval: 25000, pingTimeout: 60000 }</code>. Default là 25000/20000. Đây là chọn lựa có chủ đích, và hiểu mỗi combination nghĩa gì là cái cứu bạn khỏi chọn nhầm cho user của mình.</p>

<h3>Hai số làm gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pingInterval</span><span class="lz-t">mỗi 25 giây, server gửi một packet PING</span><span class="lz-d">Client PHẢI trả PONG. Mục đích: giữ WebSocket sống (một số proxy đóng connection idle sau 30-120s) VÀ phát hiện connection còn hoạt động.</span></div>
<div class="lz-step"><span class="lz-k">pingTimeout</span><span class="lz-t">nếu server không nhận PONG trong 60 giây sau PING</span><span class="lz-d">Server coi client chết. Fire <code>disconnect(&quot;ping timeout&quot;)</code>. Vậy server mất tối đa <code>pingInterval + pingTimeout</code> = 85s để nhận biết client dead.</span></div>
</div>

<h3>Bốn combination phổ biến</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">hung dữ: 5s/10s</span><span class="lz-nsub">phát hiện chết ≤15s</span></span>
<span class="lz-nbody">Tốt cho: cursor live, presence video call, dashboard nhanh. Xấu: false-disconnect user mobile trên 4G hiccup ngắn, hao pin, ping traffic thêm.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">mặc định: 25s/20s</span><span class="lz-nsub">phát hiện chết ≤45s</span></span>
<span class="lz-nbody">Tốt cho: hầu hết app. Cân bằng giữa responsiveness và mobile tolerance. Không đủ hung dữ cho collaboration realtime.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">kho này: 25s/60s</span><span class="lz-nsub">phát hiện chết ≤85s</span></span>
<span class="lz-nbody">Chọn cho user VN mobile 3G/4G với NAT không ổn định — network drop ngắn không nên false-disconnect. Cost: presence UI hiện &quot;offline&quot; tới 85s sau khi thật sự disconnect. Debounce (1.2) che gần hết.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lười: 60s/120s</span><span class="lz-nsub">phát hiện chết ≤180s</span></span>
<span class="lz-nbody">Tốt cho: thiết bị IoT, low-power. Xấu: server giữ 3× nhiều zombie connection; presence user-visible chậm vô ích.</span>
</div>
</div>

<h3>Phát hiện dead connection vs proxy timeout</h3>
<p>Cloudflare, nginx, và hầu hết reverse proxy đóng connection WebSocket idle sau 60-100 giây không traffic. <code>pingInterval</code> PHẢI ngắn hơn cái đó, hoặc connection của bạn sẽ bị proxy giết mà không có error message.</p>

<div class="out">Test: dat pingInterval=120000 (2 phut) sau nginx mac dinh (60s timeout)
  Client connect thanh cong
  Sau 60s: nginx dong TCP
  Client see: disconnect("transport close")
  KHONG co error message tren server — no chi thay TCP close
  Reconnect happens, but chat feels laggy every minute

Fix: pingInterval &lt; proxy_read_timeout
</div>

<div class="callout warn">
<p><strong>Đo <code>proxy_read_timeout</code> của bạn trước khi đặt <code>pingInterval</code>.</strong> Default nginx là 60s. Cloudflare Free là 100s. AWS ELB là 60s. Nếu bạn đặt <code>pingInterval: 90000</code> sau nginx 60s, kết nối bị kill trước khi ping.</p>
</div>

<h3>Server-side detection cost</h3>
<pre><code class="language-text">10.000 socket dong thoi, pingInterval 25s
  = 10.000 / 25 = 400 ping/s luon
  Moi ping ~4 byte + IP header ~40 = 44 byte
  400 * 44 = 17.600 byte/s = 17 KB/s cho ping (server -&gt; client)
  Pong cung the: 17 KB/s (client -&gt; server)

Ke ca 100.000 socket, tong ping traffic la 170 KB/s — khong dang ke
</code></pre>

<div class="callout">
<p><strong>Một câu.</strong> <code>pingInterval</code> (mặc định 25s, kho này giữ 25s) phải &lt; proxy read timeout để giữ kết nối; <code>pingTimeout</code> (mặc định 20s, kho này đặt 60s) là độ trễ tối đa server nhận biết client dead — kho này chọn 25s/60s vì user mobile VN cần tolerance với 3G/4G hiccup, đổi 85s max disconnect detection lấy tránh false-disconnect.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — một pingInterval dài hơn thời gian chờ nhàn rỗi của proxy.</strong> Nginx mặc định đóng một kết nối upstream nhàn rỗi sau 60 giây; đặt <code>pingInterval</code> là 25 s thì nhịp tim giữ nó sống, đặt là 90 s thì proxy giết một kết nối mà cả hai đầu vẫn tin là khoẻ mạnh. Client kết nối lại, nên ứng dụng trông như vẫn chạy — với một lần rớt và một lần bắt tay đầy đủ cứ chín mươi giây một lần, cho mỗi client, và một danh sách hiện diện nhấp nháy. Chẳng có lỗi nào được ghi, vì theo cách nhìn của Socket.IO thì transport đã đóng một cách bình thường. Hễ một vòng lặp kết nối lại có chu kỳ tròn trịa một cách đáng ngờ thì hãy đem con số đó đối chiếu với MỌI thời gian chờ nằm giữa hai đầu.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đọc packet OPEN của một connection và tìm <code>pingInterval</code> và <code>pingTimeout</code>; xác nhận 25000/60000 của kho này.</li>
<li>Ngắt mạng một client và đo bao lâu tới khi server fire <code>disconnect</code> với <code>ping timeout</code> — khoảng <code>pingInterval + pingTimeout</code>.</li>
<li>Hạ <code>pingTimeout</code> xuống, ví dụ 5s, rồi reconnect trên wifi chập chờn; xem false disconnect xuất hiện, cho thấy cái đánh đổi bạn đang làm.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đoán được thời gian phát hiện tệ nhất từ hai số và giải thích vì sao kho này chọn 25s/60s.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>pingInterval</code></span><span class="v">Server gửi ping mỗi bao lâu (25s ở đây); phải nhỏ hơn proxy read timeout.</span></div>
  <div class="kv"><span class="k"><code>pingTimeout</code></span><span class="v">Chịu được một pong thiếu bao lâu trước khi coi client mất (60s ở đây).</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">Trao đổi ping/pong chứng minh connection còn sống.</span></div>
  <div class="kv"><span class="k">Proxy read timeout</span><span class="v">Giới hạn rảnh proxy áp; ping interval dài hơn nó thì connection bị rớt.</span></div>
  <div class="kv"><span class="k">Phát hiện tệ nhất</span><span class="v">Tối đa <code>pingInterval + pingTimeout</code> (~85s ở đây) để nhận ra client chết.</span></div>
  <div class="kv"><span class="k">False disconnect</span><span class="v">Coi một client còn sống-nhưng-chậm là chết; timeout ngắn gây ra.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Hai số điều khiển heartbeat: <code>pingInterval</code> (25s) và <code>pingTimeout</code> (60s ở đây).</li><li><code>pingInterval</code> phải nhỏ hơn proxy read timeout kẻo connection bị rớt vì rảnh.</li><li><code>pingTimeout</code> là độ trễ tối đa server nhận ra một client đã chết.</li><li>Phát hiện tệ nhất là tổng của chúng (~85s ở đây); timeout ngắn hơn phát hiện nhanh hơn nhưng false-disconnect nhiều hơn.</li><li>Kho này chọn 25s/60s để chịu biến động mạng di động VN thay vì phát hiện nhanh.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server options</span><span class="lc-sub">socket.io/docs/v4/server-options/#pinginterval — chi tiết cả hai option, default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx — proxy_read_timeout</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout — mặc định 60s, đè lên WebSocket idle.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nginx làm proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — <code>proxy_read_timeout 3600s;</code> cho WebSocket route là đủ.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.3: kết nối đã chết mà không biết mình chết</span><span class="lc-sub">Khoá Node.js đo đúng các con số của bài này: với một proxy lặng lẽ ngừng chuyển byte, server phát hiện sau 45.003 ms (mặc định) và 85.003 ms (25.000 + 60.000 của website) — và nằm giữa pingTimeout với tổng hai số tuỳ pong cuối có qua được không. Đóng tab (TCP FIN) thì server biết sau 1 ms.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Sticky sessions: why one client goes to one worker|||2.3 — Sticky sessions: vì sao một client về một worker',
      slug: 'io-2-3-sticky',
      type: 'VIDEO',
      description: 'Polling gồm nhiều HTTP request phải đến cùng worker để chia sẻ state. Không có sticky = client nào cũng lỗi trong cluster. Nginx `ip_hash` hoặc <code>hash</code>-by-cookie giải quyết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Sticky sessions: why one client goes to one worker</h2>
<p class="lead">In a single-worker Node process, this doesn&#39;t matter. In a cluster (multiple workers behind nginx round-robin) it&#39;s the difference between working and broken. Polling proves it first.</p>

<h3>The problem</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client sends first POST /socket.io/?transport=polling</span><span class="lz-d">Nginx round-robins to worker A. Worker A assigns a sid, stores session in-memory, replies with sid.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Client sends next GET /socket.io/?sid=X&amp;transport=polling</span><span class="lz-d">Nginx round-robins to worker B. Worker B looks up sid X — NOT FOUND (it&#39;s in worker A&#39;s memory). Returns 400 &quot;Session ID unknown&quot;.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Client sees a stream of 400 errors</span><span class="lz-d">Client library retries. Retries also round-robin. Random 50% (2 workers) or 75% (4 workers) of requests fail. Chat is unusably flaky.</span></div>
</div>

<div class="callout warn">
<p><strong>WebSocket-only does NOT fix this by itself.</strong> You might think &quot;just turn polling off&quot; — but the initial handshake STILL goes over polling by default. Even if you force WebSocket, some clients run older libraries that default to polling.</p>
</div>

<h3>Fix: sticky sessions</h3>
<pre><code class="language-nginx">upstream backend {
  ip_hash;             # sticky theo IP
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
  server 127.0.0.1:3004;
}

# HOAC: sticky theo cookie (tot hon vi IP co the doi qua CDN)
upstream backend {
  hash $cookie_io;
  server 127.0.0.1:3001;
  # ...
}
</code></pre>

<p><code>ip_hash</code> is simple, but two users behind the same NAT (an office) pile onto the same worker. <code>hash $cookie_io</code> is better — socket.io-client sets the <code>io</code> cookie automatically, so the distribution stays even.</p>

<h3>Verifying that stickiness actually works</h3>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8 9 10; do
  curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling' \\
    -H 'Cookie: io=abcdefgh' \\
    -o /dev/null -w '%{http_code} '
done
# 200 200 200 200 200 200 200 200 200 200    &lt;- sticky OK
# 200 400 200 400 200 400 200 400 200 400    &lt;- KHONG sticky, luan phien
</code></pre>

<h3>Cluster mode in this repo</h3>
<p>This repo runs the backend in ONE Docker container, not multi-worker (not yet). But the Redis adapter config (<code>attachRedisAdapter</code> trong <code>messaging.socket.ts:200</code>) is already in place — turn on clustering in PM2 or add Kubernetes replicas and it works. Sticky nginx is STILL required because of the polling handshake — the Redis adapter gives you cross-worker broadcast, NOT cross-worker sessions.</p>

<div class="pitfall">
<p><strong>Trap — thinking the Redis adapter replaces sticky sessions.</strong> NO. The Redis adapter fans broadcast messages out across workers; it does NOT share engine.io session state. Polling still needs one client to land back on the same worker. These are two different problems requiring two different solutions.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A polling handshake is several HTTP requests that must reach the same worker to share a session — without stickiness, 50-75% of requests fail in a cluster — and the fix is <code>ip_hash</code> or <code>hash $cookie_io</code> in nginx (not a socket.io setting); the Redis adapter (lesson 5.1) does NOT replace stickiness, because it shares broadcasts, not sessions.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run two workers behind a round-robin proxy with NO stickiness and connect over polling; watch the handshake fail as requests land on different workers.</li>
<li>Add <code>ip_hash</code> (or <code>hash $cookie_io</code>) in nginx and reconnect; confirm the handshake now completes.</li>
<li>Explain in one line why the Redis adapter does not fix this — it shares broadcasts, not the polling session.</li>
</ol>
<p><strong>Done when:</strong> you have reproduced the no-stickiness failure and fixed it with an nginx hash, not a socket.io setting.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sticky session</span><span class="v">Routing one client's requests to the same worker every time.</span></div>
  <div class="kv"><span class="k">Polling handshake</span><span class="v">Several HTTP requests that must reach the same worker to share a session.</span></div>
  <div class="kv"><span class="k"><code>ip_hash</code></span><span class="v">nginx rule pinning a client to a worker by source IP.</span></div>
  <div class="kv"><span class="k"><code>hash $cookie_io</code></span><span class="v">Pinning by the socket.io cookie instead of IP (better behind NAT).</span></div>
  <div class="kv"><span class="k">Cluster</span><span class="v">Multiple Node workers sharing one port behind the proxy.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Shares broadcasts across workers — not sessions, so it is not stickiness.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A polling handshake is several HTTP requests that must hit the same worker.</li><li>Without stickiness, 50-75% of handshake requests fail in a cluster.</li><li>The fix is <code>ip_hash</code> or <code>hash $cookie_io</code> in nginx — a proxy setting, not a socket.io one.</li><li>The Redis adapter does NOT replace stickiness; it shares broadcasts, not sessions.</li><li>WebSocket-only connections are less affected, but the handshake still starts on polling.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes/#sticky-sessions — giải thích chính thức tại sao cần và các option cấu hình cho từng proxy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx — hash directive</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#hash — <code>hash</code> hoạt động tốt hơn <code>ip_hash</code> khi client sau NAT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — the Redis adapter and clustering</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách Redis adapter làm broadcast cross-worker, và vì sao vẫn không thay thế sticky.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.4: sticky sessions, measured</span><span class="lc-sub">The Node.js course builds a round-robin TCP balancer in front of two processes: transport polling fails at connect (xhr post error; B answers 400 {"code":1,"message":"Session ID unknown"}), a client forcing transports: ['websocket'] works without stickiness, and polling with sticky routing works.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Sticky sessions: vì sao một client về một worker</h2>
<p class="lead">Ở single-worker Node process, chuyện này không quan trọng. Ở cluster (nhiều worker sau nginx round-robin) là khác biệt giữa chạy được và hỏng. Polling chứng minh trước.</p>

<h3>Vấn đề</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client gửi POST /socket.io/?transport=polling đầu tiên</span><span class="lz-d">Nginx round-robin đến worker A. Worker A cấp sid, lưu session in-memory, trả sid.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Client gửi GET /socket.io/?sid=X&amp;transport=polling tiếp</span><span class="lz-d">Nginx round-robin đến worker B. Worker B tra sid X — KHÔNG tìm thấy (nó ở memory của worker A). Trả 400 &quot;Session ID unknown&quot;.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Client thấy dòng lỗi 400</span><span class="lz-d">Library client retry. Retry cũng round-robin. Ngẫu nhiên 50% (2 worker) hay 75% (4 worker) requests fail. Chat lag không dùng được.</span></div>
</div>

<div class="callout warn">
<p><strong>WebSocket-only KHÔNG tự sửa.</strong> Bạn có thể nghĩ &quot;chỉ cần tắt polling&quot; — nhưng handshake ban đầu VẪN qua polling ở mặc định. Kể cả bắt buộc WebSocket, một số client dùng library cũ mặc định polling.</p>
</div>

<h3>Vá: sticky sessions</h3>
<pre><code class="language-nginx">upstream backend {
  ip_hash;             # sticky theo IP
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
  server 127.0.0.1:3004;
}

# HOAC: sticky theo cookie (tot hon vi IP co the doi qua CDN)
upstream backend {
  hash $cookie_io;
  server 127.0.0.1:3001;
  # ...
}
</code></pre>

<p><code>ip_hash</code> đơn giản nhưng hai user cùng NAT (văn phòng) dồn vào cùng worker. <code>hash $cookie_io</code> tốt hơn — socket.io-client set cookie <code>io</code> tự động, nó phân phối cân đối.</p>

<h3>Verify sticky đang hoạt động</h3>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8 9 10; do
  curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling' \\
    -H 'Cookie: io=abcdefgh' \\
    -o /dev/null -w '%{http_code} '
done
# 200 200 200 200 200 200 200 200 200 200    &lt;- sticky OK
# 200 400 200 400 200 400 200 400 200 400    &lt;- KHONG sticky, luan phien
</code></pre>

<h3>Cluster mode ở kho này</h3>
<p>Kho này chạy backend ở MỘT container Docker, không multi-worker (chưa). Nhưng cấu hình Redis adapter (<code>attachRedisAdapter</code> trong <code>messaging.socket.ts:200</code>) đã sẵn sàng — chỉ cần bật cluster ở PM2 hay Kubernetes replicas là nó hoạt động. Sticky nginx VẪN cần vì polling handshake — Redis adapter cross-worker broadcast, KHÔNG cross-worker session.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ Redis adapter thay thế sticky.</strong> KHÔNG. Redis adapter phát broadcast messages qua workers; nó KHÔNG chia sẻ engine.io session state. Polling vẫn cần một client về cùng worker. Đây là hai vấn đề khác nhau, cần hai giải pháp khác nhau.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Polling handshake là nhiều HTTP request phải đến cùng worker để chia sẻ session — không sticky = 50-75% requests fail trong cluster — vá là <code>ip_hash</code> hoặc <code>hash $cookie_io</code> ở nginx (không phải cấu hình socket.io); và Redis adapter (bài 5.1) KHÔNG thay thế sticky vì nó chia sẻ broadcast, không chia sẻ session.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy hai worker sau một proxy round-robin KHÔNG sticky và kết nối qua polling; xem handshake fail khi request rơi vào worker khác nhau.</li>
<li>Thêm <code>ip_hash</code> (hoặc <code>hash $cookie_io</code>) trong nginx và reconnect; xác nhận handshake giờ hoàn tất.</li>
<li>Giải thích một dòng vì sao Redis adapter không sửa được việc này — nó chia sẻ broadcast, không phải session polling.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện được lỗi không-sticky và vá nó bằng một hash nginx, không phải một cấu hình socket.io.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sticky session</span><span class="v">Định tuyến request của một client về cùng một worker mỗi lần.</span></div>
  <div class="kv"><span class="k">Polling handshake</span><span class="v">Nhiều HTTP request phải đến cùng worker để chia sẻ session.</span></div>
  <div class="kv"><span class="k"><code>ip_hash</code></span><span class="v">Luật nginx ghim một client vào một worker theo IP nguồn.</span></div>
  <div class="kv"><span class="k"><code>hash $cookie_io</code></span><span class="v">Ghim theo cookie socket.io thay vì IP (tốt hơn sau NAT).</span></div>
  <div class="kv"><span class="k">Cluster</span><span class="v">Nhiều worker Node chia sẻ một port sau proxy.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Chia sẻ broadcast qua worker — không phải session, nên không phải sticky.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một polling handshake là nhiều HTTP request phải trúng cùng một worker.</li><li>Không sticky, 50-75% request handshake fail trong cụm.</li><li>Vá là <code>ip_hash</code> hoặc <code>hash $cookie_io</code> trong nginx — một cấu hình proxy, không phải socket.io.</li><li>Redis adapter KHÔNG thay sticky; nó chia sẻ broadcast, không phải session.</li><li>Connection WebSocket-only ít ảnh hưởng hơn, nhưng handshake vẫn bắt đầu bằng polling.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes/#sticky-sessions — giải thích chính thức tại sao cần và các option cấu hình cho từng proxy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx — hash directive</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#hash — <code>hash</code> hoạt động tốt hơn <code>ip_hash</code> khi client sau NAT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — Redis adapter và cluster</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách Redis adapter làm broadcast cross-worker, và vì sao vẫn không thay thế sticky.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.4: sticky session, đo thật</span><span class="lc-sub">Khoá Node.js dựng một load balancer TCP luân phiên trước hai tiến trình: transport polling hỏng lúc kết nối (xhr post error; B trả 400 {"code":1,"message":"Session ID unknown"}), client ép transports: ['websocket'] chạy mà không cần sticky, và polling có định tuyến sticky thì chạy.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Diagnosing transports with curl|||2.4 — Chẩn đoán transport bằng curl',
      slug: 'io-2-4-curl',
      type: 'VIDEO',
      description: 'Ba lệnh curl reproduce chính handshake của socket.io. Hữu ích khi debug production mà không mở trình duyệt được — bạn tự xác nhận HTTP polling, upgrade, và sticky đều đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Diagnosing transports with curl</h2>
<p class="lead">Section 0.3 showed the wire packets by connecting with raw ws. This lesson does the same by hand from a terminal — useful when SSH&#39;d into a server or diagnosing on a machine without a browser.</p>

<h3>Command 1 — engine.io OPEN packet</h3>
<pre><code class="language-bash">$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling'
0{"sid":"XYZ...","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">200 OK, body starts with <code>0{...}</code></span><span class="lz-d">Socket.IO is up and a sid has been issued. The live configuration is readable right here — you can see <code>pingTimeout: 60000</code> against the default 20000, which confirms your config actually reached production.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">404</span><span class="lz-d">Nginx is not routing <code>/socket.io/</code> to the backend. Check the <code>location /socket.io/</code>.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">timeout</span><span class="lz-d">The backend is down or a firewall is blocking. Check whether <code>curl https://api.example.com/health</code> is healthy.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t"><code>upgrades:[]</code> is empty</span><span class="lz-d">The server cannot tell the client about WebSocket. Most likely nginx's <code>proxy_set_header Upgrade</code> is not right yet.</span></div>
</div>

<h3>Command 2 — checking sticky sessions</h3>
<pre><code class="language-bash">$ for i in 1 2 3 4 5 6 7 8 9 10; do
    curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling' \\
      -H 'Cookie: io=stickytest' \\
      -o /dev/null -w '%{http_code} '
  done
200 200 200 200 200 200 200 200 200 200
</code></pre>

<p>Every request returning 200 means stickiness is fine (or there is a single worker). Alternating 200/400 means round-robin is shuffling you around — see 2.3.</p>

<h3>Command 3 — checking auth</h3>
<pre><code class="language-bash"># khong cookie auth
$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling'
0{"sid":"XYZ",...}    &lt;- van 200: middleware CHUA reject o day (chua co CONNECT packet)

# gui CONNECT packet, JWT sai
$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling&sid=XYZ' \\
    -X POST -H 'Content-Type: text/plain' --data-binary '40{"token":"bad"}'
# server tra ok, sau do gui error packet vao poll ke tiep

$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling&sid=XYZ'
44"unauthorized"    &lt;- engine.io 4 + socket.io 4 (CONNECT_ERROR) + message
</code></pre>

<div class="callout ok">
<p><strong>Two advantages of curl.</strong> (1) It runs inside the backend container or on the VPS — no browser needed. (2) It logs the COMPLETE HTTP headers plus the response, including things DevTools hides (X-Powered-By, Server, custom headers).</p>
</div>

<h3>Real debugging scenarios</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;Chat stopped working after the deploy&quot;</span><span class="lz-nsub">where do you start?</span></span>
<span class="lz-nbody">Step 1: curl the handshake endpoint. A 200 with a sid means socket.io is alive. A 404 or a timeout sends you back to the nginx config.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;A random 50% of users are broken&quot;</span><span class="lz-nsub">stickiness or broadcast</span></span>
<span class="lz-nbody">Run the sticky-check loop from command 2. Alternating 200/400 → stickiness is not configured. All 200s but still broken → cross-worker broadcast, so you need the Redis adapter (Ch. 5).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;Endless ping timeouts&quot;</span><span class="lz-nsub">which values are actually running?</span></span>
<span class="lz-nbody">Command 1 output cho <code>pingInterval</code> + <code>pingTimeout</code>. If they differ from what you set in code, the deploy never landed. See <code>docker ps</code>, image tag.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Trap — using <code>curl -v</code> without understanding the output.</strong> <code>-v</code> dumps 50+ lines of headers. It is easy to get lost. Start with <code>-s -o /dev/null -w &#39;%{http_code}&#39;</code> — status code only. Then <code>-s</code> to see the body. Only reach for <code>-v</code> once you know what you are looking for.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three curl commands reproduce socket.io's handshake without a browser — verifying that the config shipped (pingTimeout appears in the OPEN body), verifying stickiness (the loop returns all 200s or alternates with 400s), and verifying auth (a CONNECT_ERROR packet <code>44</code>) — enough to debug 80% of production socket.io bugs.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run command 1: curl the engine.io handshake and read the OPEN body — confirm your shipped <code>pingTimeout</code> actually appears.</li>
<li>Run command 2: loop the handshake against the cluster and check it returns all 200s (sticky) or alternates with 400s (not sticky).</li>
<li>Run command 3: curl with a bad token and spot the CONNECT_ERROR packet starting <code>44</code>.</li>
</ol>
<p><strong>Done when:</strong> you can reproduce a socket.io handshake with curl alone and read config, stickiness and auth off the responses.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Handshake</span><span class="v">The first HTTP exchange that opens an engine.io session.</span></div>
  <div class="kv"><span class="k">OPEN body</span><span class="v">The <code>0{...}</code> JSON carrying sid and the ping timings you shipped.</span></div>
  <div class="kv"><span class="k">EIO / transport query</span><span class="v"><code>?EIO=4&amp;transport=polling</code> — the parameters curl must send.</span></div>
  <div class="kv"><span class="k">Sticky check</span><span class="v">Looping the handshake: all 200s = sticky, 400s mixed in = not.</span></div>
  <div class="kv"><span class="k">CONNECT_ERROR</span><span class="v">The <code>44</code> packet an auth rejection produces.</span></div>
  <div class="kv"><span class="k">Reproduce without a browser</span><span class="v">curl drives the handshake so you debug the server in isolation.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three curl commands reproduce the socket.io handshake with no browser.</li><li>Command 1 proves the config shipped — <code>pingTimeout</code> shows up in the OPEN body.</li><li>Command 2 proves stickiness — the loop returns all 200s or alternates with 400s.</li><li>Command 3 proves auth — a bad token yields a CONNECT_ERROR packet <code>44</code>.</li><li>Those three cover about 80% of production socket.io bugs.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol packet types</span><span class="lc-sub">github.com/socketio/engine.io-protocol#packet — bảng số ứng with chuỗi để giải mã output curl.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl manual — output formatting</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose — cách kiểm soát output, đặc biệt <code>-w</code> format string.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 11 — diagnosing realtime bugs</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng ba lệnh này ở các nhánh khác nhau.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chẩn đoán transport bằng curl</h2>
<p class="lead">Mục 0.3 chỉ ra wire packet bằng cách kết nối bằng ws thô. Bài này làm cùng vậy bằng tay từ terminal — hữu ích khi SSH vào server hoặc chẩn đoán trên máy không có trình duyệt.</p>

<h3>Command 1 — engine.io OPEN packet</h3>
<pre><code class="language-bash">$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling'
0{"sid":"XYZ...","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">200 OK, body bắt đầu bằng <code>0{...}</code></span><span class="lz-d">Socket.IO đang chạy, sid được cấp. Cấu hình chuẩn đọc được thẳng — bạn thấy <code>pingTimeout: 60000</code> vs default 20000 giúp verify config đã lên production.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">404</span><span class="lz-d">Nginx không route <code>/socket.io/</code> vào backend. Kiểm cấu hình <code>location /socket.io/</code>.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">timeout</span><span class="lz-d">Backend down hoặc firewall chặn. Kiểm <code>curl https://api.example.com/health</code> có ok không.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t"><code>upgrades:[]</code> trống</span><span class="lz-d">Server không tell client được về WebSocket. Có thể nginx <code>proxy_set_header Upgrade</code> chưa đúng.</span></div>
</div>

<h3>Command 2 — kiểm sticky sessions</h3>
<pre><code class="language-bash">$ for i in 1 2 3 4 5 6 7 8 9 10; do
    curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling' \\
      -H 'Cookie: io=stickytest' \\
      -o /dev/null -w '%{http_code} '
  done
200 200 200 200 200 200 200 200 200 200
</code></pre>

<p>Mọi request 200 = sticky đang OK (hoặc single worker). Xen kẽ 200/400 = round-robin đang lộn xộn — thấy 2.3.</p>

<h3>Command 3 — kiểm auth</h3>
<pre><code class="language-bash"># khong cookie auth
$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling'
0{"sid":"XYZ",...}    &lt;- van 200: middleware CHUA reject o day (chua co CONNECT packet)

# gui CONNECT packet, JWT sai
$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling&sid=XYZ' \\
    -X POST -H 'Content-Type: text/plain' --data-binary '40{"token":"bad"}'
# server tra ok, sau do gui error packet vao poll ke tiep

$ curl -s 'https://api.example.com/socket.io/?EIO=4&transport=polling&sid=XYZ'
44"unauthorized"    &lt;- engine.io 4 + socket.io 4 (CONNECT_ERROR) + message
</code></pre>

<div class="callout ok">
<p><strong>Hai ưu điểm của curl.</strong> (1) Chạy được ở container backend hoặc VPS — không cần trình duyệt. (2) Log ĐẦY ĐỦ HTTP header + response, thấy được cả stuff mà DevTools ẩn (X-Powered-By, Server, các custom header).</p>
</div>

<h3>Kịch bản debug thật</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;Chat không hoạt động sau deploy&quot;</span><span class="lz-nsub">bắt đầu ở đâu?</span></span>
<span class="lz-nbody">Bước 1: curl endpoint handshake. 200 với sid = socket.io sống. 404/timeout = trở về nginx config.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;Random 50% users bị lỗi&quot;</span><span class="lz-nsub">chấp nhận sticky hoặc broadcast</span></span>
<span class="lz-nbody">Chạy loop sticky check ở command 2. Xen kẽ 200/400 → sticky chưa cấu hình. Toàn 200 nhưng vẫn lỗi → broadcast cross-worker, cần Redis adapter (Ch5).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;Ping timeout mãi&quot;</span><span class="lz-nsub">giá trị nào đang chạy?</span></span>
<span class="lz-nbody">Command 1 output cho <code>pingInterval</code> + <code>pingTimeout</code>. Nếu chúng khác cái bạn set trong code = deploy chưa lên. Xem <code>docker ps</code>, image tag.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>curl -v</code> mà không hiểu output.</strong> <code>-v</code> dumps 50+ dòng header. Dễ bị bối rối. Bắt đầu bằng <code>-s -o /dev/null -w &#39;%{http_code}&#39;</code> — chỉ status code. Rồi <code>-s</code> để xem body. Chỉ dùng <code>-v</code> khi biết mình đang tìm gì.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba curl command reproduce handshake của socket.io mà không cần trình duyệt — kiểm cấu hình đã lên (pingTimeout hiện ra trong body OPEN), kiểm sticky (loop trả toàn 200 hay xen kẽ 400), và kiểm auth (CONNECT_ERROR packet <code>44</code>) — đủ để debug 80% các bug production socket.io.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy command 1: curl handshake engine.io và đọc body OPEN — xác nhận <code>pingTimeout</code> bạn đã deploy thật sự hiện ra.</li>
<li>Chạy command 2: lặp handshake vào cụm và kiểm nó trả toàn 200 (sticky) hay xen kẽ 400 (không sticky).</li>
<li>Chạy command 3: curl với token sai và tìm packet CONNECT_ERROR bắt đầu bằng <code>44</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện được một handshake socket.io chỉ bằng curl và đọc được cấu hình, sticky và auth từ các response.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Handshake</span><span class="v">Lượt HTTP đầu tiên mở một session engine.io.</span></div>
  <div class="kv"><span class="k">Body OPEN</span><span class="v">JSON <code>0{...}</code> mang sid và các số ping bạn đã deploy.</span></div>
  <div class="kv"><span class="k">Query EIO / transport</span><span class="v"><code>?EIO=4&amp;transport=polling</code> — các tham số curl phải gửi.</span></div>
  <div class="kv"><span class="k">Kiểm sticky</span><span class="v">Lặp handshake: toàn 200 = sticky, lẫn 400 = không.</span></div>
  <div class="kv"><span class="k">CONNECT_ERROR</span><span class="v">Packet <code>44</code> mà một lần từ chối auth tạo ra.</span></div>
  <div class="kv"><span class="k">Tái hiện không cần trình duyệt</span><span class="v">curl chạy handshake để bạn debug server một cách cô lập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba command curl tái hiện handshake socket.io mà không cần trình duyệt.</li><li>Command 1 chứng minh cấu hình đã lên — <code>pingTimeout</code> hiện trong body OPEN.</li><li>Command 2 chứng minh sticky — loop trả toàn 200 hoặc xen kẽ 400.</li><li>Command 3 chứng minh auth — token sai cho ra packet CONNECT_ERROR <code>44</code>.</li><li>Ba cái đó bao khoảng 80% bug production socket.io.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol packet types</span><span class="lc-sub">github.com/socketio/engine.io-protocol#packet — bảng số ứng với chuỗi để giải mã output curl.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl manual — output formatting</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose — cách kiểm soát output, đặc biệt <code>-w</code> format string.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 11 — chẩn đoán realtime bug</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng ba lệnh này ở các nhánh khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Binary payloads: not base64|||2.5 — Binary payload: KHÔNG phải base64',
      slug: 'io-2-5-binary',
      type: 'VIDEO',
      description: 'Buffer/ArrayBuffer được gửi qua WebSocket binary frame native — không encode qua base64. Kích thước bằng payload, không có ~33% overhead. Đo bằng probe.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Binary payloads: not base64</h2>
<p class="lead">Sending images, audio, or protobuf through socket.io? Payload appears as JSON in DevTools text view. But on the wire it&#39;s binary — no base64. This lesson measures why that matters and when a raw HTTP upload beats socket.io.</p>

<h3>Measurement</h3>
<pre><code class="language-js">const buf = Buffer.alloc(1024, 42);   // 1 KB of 0x2a
io.on('connection', s =&gt; {
  s.emit('binary', buf);
});
c.on('binary', (data) =&gt; {
  console.log('received Buffer of size:', data.length, 'first byte:', data[0]);
});
</code></pre>

<div class="out">received Buffer of size: 1024 first byte: 42
</div>

<h3>On the wire</h3>
<pre><code class="language-text">websocket frame:
  [opcode=0x02 (binary), len=1024, payload=&lt;1024 byte thuc te&gt;]
  
Total bytes: 1024 payload + 2-14 byte overhead = 1026-1038 byte
</code></pre>

<p>If socket.io encoded via base64, the size would be 1024 × 4/3 ≈ 1365 bytes plus JSON braces = ~1400 bytes. The measured result of 1026 bytes confirms a native binary frame.</p>

<h3>Polling is different — base64 is mandatory</h3>
<pre><code class="language-text">polling body la text/plain:
  4b1{"_placeholder":true,"num":0}
  &lt;- + attachment binary trong request tiep theo o base64

Overhead: 33% cho base64 encoding + 2 request extra (attach + data)
</code></pre>

<div class="callout warn">
<p><strong>Polling does NOT support native binary.</strong> If a client is connected over polling and you <code>emit()</code> a Buffer, socket.io base64-encodes it and splits it into a second request. The size grows 33% and latency doubles (2 HTTP round trips). This is ANOTHER reason to upgrade to WebSocket for binary use cases.</p>
</div>

<h3>When NOT to use socket.io for binary</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">large file uploads (&gt;1MB)</span><span class="lz-nsub">HTTP POST + progress</span></span>
<span class="lz-nbody">Use an HTTP <code>fetch</code> with <code>upload progress</code>. Realtime is not required — large files need chunking and resumption, neither of which socket.io does for you.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">video call</span><span class="lz-nsub">WebRTC</span></span>
<span class="lz-nbody">Media streams go peer-to-peer over WebRTC. Socket.io is used ONLY for signalling (offer/answer/ICE) — payloads under 10 KB. Chapter 7 measures this.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">image thumbnail (2-100 KB)</span><span class="lz-nsub">socket.io is fine here</span></span>
<span class="lz-nbody">The size is fine, latency matters, no progress bar needed. Socket.io's binary frames work well. This repo emits avatar updates exactly this way.</span>
</div>
</div>

<h3>maxHttpBufferSize — defending against oversized-payload DDoS</h3>
<pre><code class="language-ts">io = new IOServer(server, {
  maxHttpBufferSize: 1e6,   // 1 MB (default)
  // giam xuong 100_000 (100 KB) neu app cua ban khong nen nhan
  // payload lon — nguoi tan cong emit 1 MB va tiet kiem server
});
</code></pre>

<p>This repo keeps the 1 MB default. If a payload larger than 1 MB arrives, engine.io closes the connection with <code>disconnect(&quot;forced close&quot;)</code>.</p>

<div class="pitfall">
<p><strong>Trap — using a socket.io emit to upload a 10 MB file.</strong> You get <code>disconnect(forced close)</code> because you exceeded <code>maxHttpBufferSize</code>. Or you raise it to 100 MB — and then a single emit request holds 100 MB of server RAM. The fix: chunk the file, use a dedicated HTTP upload endpoint, and let socket.io ONLY announce &quot;upload finished&quot; in realtime.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A Buffer/ArrayBuffer over a socket.io WebSocket is a native binary frame (NO base64, no ~33% overhead), but over polling it must be base64-encoded and split across two HTTP requests — so binary use cases need WebSocket; large file uploads (&gt;1 MB) belong on a dedicated HTTP endpoint, because <code>maxHttpBufferSize</code> defaults to 1 MB and raising it opens a DDoS surface.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Emit a <code>Buffer</code> over a WebSocket connection and, in DevTools → WS, confirm the frame is binary (no base64, no ~33% bloat).</li>
<li>Force the same emit over polling and observe it is base64-encoded and split across HTTP requests.</li>
<li>Send a payload larger than 1 MB and watch it be rejected by the default <code>maxHttpBufferSize</code>; reason about why raising it is a DDoS surface, and route big uploads to an HTTP endpoint instead.</li>
</ol>
<p><strong>Done when:</strong> you have seen a native binary frame on WebSocket, base64 on polling, and the 1 MB rejection.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Binary frame</span><span class="v">A native WebSocket frame carrying bytes with no base64 overhead.</span></div>
  <div class="kv"><span class="k">base64 on polling</span><span class="v">Polling cannot send binary — it encodes to base64 (~33% bigger).</span></div>
  <div class="kv"><span class="k"><code>Buffer</code> / <code>ArrayBuffer</code></span><span class="v">The binary types socket.io sends as-is over WebSocket.</span></div>
  <div class="kv"><span class="k"><code>maxHttpBufferSize</code></span><span class="v">The per-message cap, 1 MB by default.</span></div>
  <div class="kv"><span class="k">DDoS surface</span><span class="v">Raising the cap lets one request allocate huge memory — an attack vector.</span></div>
  <div class="kv"><span class="k">Dedicated upload endpoint</span><span class="v">Large files belong on plain HTTP, not a socket emit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Buffer over WebSocket is a native binary frame — no base64, no ~33% overhead.</li><li>Over polling the same payload must be base64-encoded and split across two HTTP requests.</li><li>Binary use cases therefore want WebSocket.</li><li><code>maxHttpBufferSize</code> defaults to 1 MB; raising it opens a DDoS surface.</li><li>Large uploads (&gt;1 MB) belong on a dedicated HTTP endpoint, not a socket emit.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Binary support</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#binary — chi tiết Buffer, ArrayBuffer, Blob types và cách chúng được encode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — maxHttpBufferSize</span><span class="lc-sub">socket.io/docs/v4/server-options/#maxhttpbuffersize — trade off giữa payload lớn hỗ trợ vs DDoS resistance.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — WebRTC signalling</span><span class="lc-sub">/courses/socket-io/learn${REF} — ví dụ chuẩn: socket.io signalling payload &lt; 10 KB, media stream qua WebRTC.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Binary payload: KHÔNG phải base64</h2>
<p class="lead">Gửi ảnh, audio, protobuf qua socket.io? Payload xuất hiện là JSON trong DevTools text view. Nhưng trên dây là binary — không base64. Bài này đo tại sao chuyện đó quan trọng và khi nào HTTP upload raw thắng socket.io.</p>

<h3>Phép đo</h3>
<pre><code class="language-js">const buf = Buffer.alloc(1024, 42);   // 1 KB toan 0x2a
io.on('connection', s =&gt; {
  s.emit('binary', buf);
});
c.on('binary', (data) =&gt; {
  console.log('received Buffer of size:', data.length, 'first byte:', data[0]);
});
</code></pre>

<div class="out">received Buffer of size: 1024 first byte: 42
</div>

<h3>Trên dây</h3>
<pre><code class="language-text">websocket frame:
  [opcode=0x02 (binary), len=1024, payload=&lt;1024 byte thuc te&gt;]
  
Total bytes: 1024 payload + 2-14 byte overhead = 1026-1038 byte
</code></pre>

<p>Nếu socket.io encode qua base64, kích thước sẽ là 1024 × 4/3 ≈ 1365 byte + JSON braces = ~1400 byte. Kết quả đo được 1026 byte → khẳng định binary frame native.</p>

<h3>Polling khác — base64 bắt buộc</h3>
<pre><code class="language-text">polling body la text/plain:
  4b1{"_placeholder":true,"num":0}
  &lt;- + attachment binary trong request tiep theo o base64

Overhead: 33% cho base64 encoding + 2 request extra (attach + data)
</code></pre>

<div class="callout warn">
<p><strong>Polling KHÔNG hỗ trợ binary native.</strong> Nếu client kết nối bằng polling và bạn <code>emit()</code> một Buffer, socket.io encode nó thành base64 và tách vào request thứ hai. Kích thước tăng 33%, latency 2× (2 HTTP round trip). Đây là lý do KHÁC để upgrade sang WebSocket cho binary use case.</p>
</div>

<h3>Khi nào KHÔNG dùng socket.io cho binary</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">upload file lớn (&gt;1MB)</span><span class="lz-nsub">HTTP POST + progress</span></span>
<span class="lz-nbody">Dùng HTTP <code>fetch</code> với <code>upload progress</code>. Không cần realtime — file lớn phải chunk và resume, việc socket.io không làm sẵn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">video call</span><span class="lz-nsub">WebRTC</span></span>
<span class="lz-nbody">Media stream đi qua WebRTC peer-to-peer. Socket.io CHỈ dùng cho signalling (offer/answer/ICE) — payload &lt; 10 KB. Chương 7 đo cái này.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">image thumbnail (2-100 KB)</span><span class="lz-nsub">OK dùng socket.io</span></span>
<span class="lz-nbody">Kích thước OK, latency quan trọng, không cần progress. Socket.io binary frame chạy tốt. Kho này emit avatar update như vậy.</span>
</div>
</div>

<h3>maxHttpBufferSize — chống DDoS bằng payload lớn</h3>
<pre><code class="language-ts">io = new IOServer(server, {
  maxHttpBufferSize: 1e6,   // 1 MB (default)
  // giam xuong 100_000 (100 KB) neu app cua ban khong nen nhan
  // payload lon — nguoi tan cong emit 1 MB va tiet kiem server
});
</code></pre>

<p>Kho này giữ default 1 MB. Nếu bạn nhận payload &gt; 1 MB, engine.io đóng connection với <code>disconnect(&quot;forced close&quot;)</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng socket.io emit cho upload file 10 MB.</strong> Bạn nhận <code>disconnect(forced close)</code> vì vượt <code>maxHttpBufferSize</code>. Hoặc bạn tăng lên 100 MB — thì một request emit chiếm 100 MB RAM của server. Vá: chunk file, dùng HTTP upload endpoint riêng, socket.io CHỈ báo &quot;upload xong&quot; realtime.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Buffer/ArrayBuffer qua WebSocket socket.io là native binary frame (KHÔNG base64, không ~33% overhead), nhưng qua polling phải base64 và chia hai HTTP request — nên với binary use case cần WebSocket; upload file lớn (&gt;1 MB) đi HTTP endpoint riêng vì <code>maxHttpBufferSize</code> mặc định là 1 MB và tăng nó là mở DDoS surface.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Emit một <code>Buffer</code> qua một connection WebSocket và, trong DevTools → WS, xác nhận frame là binary (không base64, không phình ~33%).</li>
<li>Ép cùng emit đó qua polling và quan sát nó bị base64 và chia qua các HTTP request.</li>
<li>Gửi một payload lớn hơn 1 MB và xem nó bị từ chối bởi <code>maxHttpBufferSize</code> mặc định; lập luận vì sao tăng nó là một DDoS surface, và chuyển upload lớn sang một HTTP endpoint.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy một native binary frame trên WebSocket, base64 trên polling, và cú từ chối ở 1 MB.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Binary frame</span><span class="v">Một native WebSocket frame chở byte không có overhead base64.</span></div>
  <div class="kv"><span class="k">base64 trên polling</span><span class="v">Polling không gửi được binary — nó mã hoá base64 (lớn hơn ~33%).</span></div>
  <div class="kv"><span class="k"><code>Buffer</code> / <code>ArrayBuffer</code></span><span class="v">Các kiểu binary mà socket.io gửi nguyên trạng qua WebSocket.</span></div>
  <div class="kv"><span class="k"><code>maxHttpBufferSize</code></span><span class="v">Trần mỗi tin, mặc định 1 MB.</span></div>
  <div class="kv"><span class="k">DDoS surface</span><span class="v">Tăng trần cho một request cấp phát bộ nhớ khổng lồ — một hướng tấn công.</span></div>
  <div class="kv"><span class="k">Endpoint upload riêng</span><span class="v">File lớn thuộc về HTTP thuần, không phải một socket emit.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một Buffer qua WebSocket là một native binary frame — không base64, không overhead ~33%.</li><li>Qua polling, cùng payload phải base64 và chia qua hai HTTP request.</li><li>Vì vậy các use case binary muốn WebSocket.</li><li><code>maxHttpBufferSize</code> mặc định 1 MB; tăng nó mở một DDoS surface.</li><li>Upload lớn (&gt;1 MB) thuộc về một HTTP endpoint riêng, không phải một socket emit.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Binary support</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#binary — chi tiết Buffer, ArrayBuffer, Blob types và cách chúng được encode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — maxHttpBufferSize</span><span class="lc-sub">socket.io/docs/v4/server-options/#maxhttpbuffersize — trade off giữa payload lớn hỗ trợ vs DDoS resistance.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — WebRTC signalling</span><span class="lc-sub">/courses/socket-io/learn${REF} — ví dụ chuẩn: socket.io signalling payload &lt; 10 KB, media stream qua WebRTC.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'io-2-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về transport, pingInterval/pingTimeout, sticky sessions, curl diagnosis, binary.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>What Chapter 2 established</h2>
<p class="lead">Six questions on transports, heartbeats and the upgrade — where most production Socket.IO problems actually live.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">The overhead is the handshake, not the frames</span><span class="lz-d">A WebSocket frame costs 2-14 bytes. The connection setup costs a full HTTP round-trip plus an upgrade. That is why connection churn hurts far more than message volume.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">pingInterval and pingTimeout are four modes</span><span class="lz-d">The two numbers combine into distinct behaviours: healthy, slow-network-but-alive, dead-but-not-yet-noticed, and falsely-declared-dead. Tune them against your worst real network, not your laptop.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Sticky sessions are not optional on polling</span><span class="lz-d">A polling client makes many HTTP requests that must all reach the same worker, because the session lives in that worker's memory. Without stickiness the handshake succeeds and then the connection fails in a way that looks random.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Chương 2 đã dựng được gì</h2>
<p class="lead">Sáu câu về transport, nhịp tim và việc nâng cấp — nơi phần lớn sự cố Socket.IO trên production thực sự nằm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Chi phí nằm ở cú bắt tay, không phải ở khung tin</span><span class="lz-d">Một khung WebSocket tốn 2-14 byte. Việc thiết lập kết nối tốn trọn một vòng HTTP cộng một lần nâng cấp. Đó là lý do việc kết nối đứt-nối liên tục gây hại hơn nhiều so với lượng thông điệp.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">pingInterval và pingTimeout là bốn chế độ</span><span class="lz-d">Hai con số kết hợp thành những hành vi riêng biệt: khoẻ, mạng chậm nhưng còn sống, đã chết mà chưa bị phát hiện, và bị tuyên chết oan. Hãy tinh chỉnh chúng theo mạng thật tệ nhất của bạn, không phải theo cái laptop.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Sticky session không phải tuỳ chọn với polling</span><span class="lz-d">Một client polling tạo nhiều request HTTP mà tất cả đều phải tới đúng một worker, vì phiên sống trong bộ nhớ của worker đó. Không có sticky thì cú bắt tay thành công rồi kết nối hỏng theo kiểu trông như ngẫu nhiên.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Measuring server-to-client bytes for 20 messages: polling 681, WebSocket 681. What does the equal number tell you?|||Đo bytes server→client cho 20 msg: polling 681, WebSocket 681. Con số bằng nói với bạn gì?',
            options: [
              'The overhead difference between transports is NOT at the socket.io layer (payload is identical). It&#39;s at the HTTP layer (headers per poll) and in latency (extra RTTs) — the &quot;133×&quot; from Section 0.2 is worst-case, not typical|||Khác biệt overhead giữa transports KHÔNG ở tầng socket.io (payload y hệt). Ở tầng HTTP (header per poll) và latency (RTT thêm) — &quot;133×&quot; ở Mục 0.2 là worst-case, không typical',
              'Both transports use the same protocol underneath|||Cả hai transport dùng cùng protocol bên dưới',
              'Socket.io always adds padding to match sizes|||Socket.io thêm padding để khớp kích thước',
              'The measurement was buggy|||Phép đo bị bug',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Nginx <code>proxy_read_timeout</code> is default 60s. What must be true of <code>pingInterval</code>?|||Nginx <code>proxy_read_timeout</code> mặc định 60s. Cái gì phải đúng về <code>pingInterval</code>?',
            options: [
              'pingInterval MUST be less than proxy_read_timeout — otherwise nginx kills the idle connection before socket.io sends a ping, causing periodic silent transport closes|||pingInterval PHẢI nhỏ hơn proxy_read_timeout — nếu không nginx giết idle connection trước khi socket.io ping, gây silent transport close định kỳ',
              'pingInterval must equal proxy_read_timeout exactly|||pingInterval phải bằng đúng proxy_read_timeout',
              'They&#39;re unrelated — proxy is only for HTTP|||Không liên quan — proxy chỉ cho HTTP',
              'pingInterval must be GREATER than proxy_read_timeout|||pingInterval phải LỚN HƠN proxy_read_timeout',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a 4-worker cluster behind nginx round-robin (no sticky), what happens to polling clients?|||Trong cluster 4 worker sau nginx round-robin (không sticky), chuyện gì xảy ra với client polling?',
            options: [
              '75% of subsequent requests hit a worker that does not know the sid, returning HTTP 400 &quot;Session ID unknown&quot; — chat is unusably flaky. Fix: sticky sessions via ip_hash or hash $cookie_io|||75% các request tiếp theo đến worker không biết sid, trả HTTP 400 &quot;Session ID unknown&quot; — chat lag không dùng được. Vá: sticky sessions qua ip_hash hoặc hash $cookie_io',
              'Nothing — Redis adapter handles it automatically|||Không gì — Redis adapter tự lo',
              'Nginx retries transparently|||Nginx retry trong suốt',
              'Clients auto-reconnect and pick the right worker|||Client tự reconnect và chọn đúng worker',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run <code>curl -s .../socket.io/?EIO=4&amp;transport=polling</code> and get <code>0{&quot;pingTimeout&quot;:20000,...}</code>. What has that told you?|||Bạn chạy <code>curl -s .../socket.io/?EIO=4&amp;transport=polling</code> và nhận <code>0{&quot;pingTimeout&quot;:20000,...}</code>. Nó nói cho bạn gì?',
            options: [
              'Server is running default config (20s pingTimeout). If your code sets 60000, the deploy did NOT ship your change — check the running image tag|||Server chạy config mặc định (20s pingTimeout). Nếu code bạn đặt 60000, deploy KHÔNG lên bản của bạn — kiểm image tag',
              'Nothing — pingTimeout doesn&#39;t appear in the OPEN packet|||Không gì — pingTimeout không có trong OPEN packet',
              'Server is misconfigured — should be 60000|||Server sai cấu hình — phải là 60000',
              'Client should override to 20000|||Client nên override thành 20000',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Sending <code>Buffer.alloc(1024)</code> via socket.io on WebSocket transport. What&#39;s the on-wire size?|||Gửi <code>Buffer.alloc(1024)</code> qua socket.io trên transport WebSocket. Kích thước trên dây?',
            options: [
              '~1026-1038 bytes — the Buffer becomes a native WebSocket binary frame (opcode 0x02), no base64. Polling transport would need base64 + a second HTTP request, ~1400 bytes|||~1026-1038 bytes — Buffer thành binary frame native của WebSocket (opcode 0x02), không base64. Polling sẽ cần base64 + request HTTP thứ hai, ~1400 bytes',
              '~1400 bytes always — socket.io base64 encodes all binary|||~1400 bytes luôn — socket.io base64 encode mọi binary',
              '~5000 bytes — JSON stringify of a Buffer array|||~5000 bytes — JSON stringify mảng Buffer',
              'Rejected — socket.io does not support binary|||Bị từ chối — socket.io không hỗ trợ binary',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between Redis adapter and sticky sessions?|||Khác biệt giữa Redis adapter và sticky sessions?',
            options: [
              'Sticky sessions ensure ONE client always hits ONE worker (needed for polling session state). Redis adapter propagates broadcasts across workers (needed for io.to(room).emit to reach all connected clients). Different problems, both needed in cluster|||Sticky sessions bảo đảm MỘT client luôn tới MỘT worker (cần cho state session polling). Redis adapter phát broadcast qua các worker (cần cho io.to(room).emit đến mọi client). Vấn đề khác, cả hai đều cần trong cluster',
              'They are the same thing, redundant|||Chúng là cùng một thứ, thừa',
              'Redis adapter replaces sticky sessions|||Redis adapter thay thế sticky sessions',
              'Sticky sessions replace Redis adapter|||Sticky sessions thay thế Redis adapter',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
