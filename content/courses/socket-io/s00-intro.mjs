const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Mục 0: Cái Socket.IO THẬT SỰ LÀ.
 * Số đo: 2.430 dòng gateway trong src/socket/ + socket.io 4.8.3 chạy thật
 * trong hộp cát. Handshake engine.io, hai sid, transport upgrade.
 */

export default {
  title: 'Section 0 — What Socket.IO actually is|||Mục 0 — Socket.IO THẬT SỰ LÀ gì',
  slug: 'io-s0-intro',
  description: 'Bốn bài dựng mô hình tinh thần đúng trước khi làm bất cứ thứ gì với socket.io. Đây KHÔNG phải WebSocket + npm — nó là engine.io được bọc bởi namespace và room, và mọi thứ gây bất ngờ về nó đều suy ra từ câu đó.',
  sortOrder: 1,
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Socket.IO is engine.io wrapped in namespaces and rooms|||0.1 — Socket.IO là engine.io được BỌC bởi namespace và room',
      slug: 'io-0-1-la-gi',
      type: 'VIDEO',
      description: 'Câu duy nhất cần nhớ. Sau đó là bảng đối chiếu bốn tầng: HTTP/WebSocket → engine.io → socket.io → mã của bạn. Mọi mỗi hành vi lạ đều suy ra từ tầng nào chịu trách nhiệm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Socket.IO is engine.io wrapped in namespaces and rooms</h2>
<p class="lead">The name &quot;Socket.IO&quot; suggests something close to the browser&#39;s <code>WebSocket</code> API with a friendly npm wrapper. That is not what it is. It is <em>two</em> libraries stacked on top of two transports, and mistaking either boundary produces surprises. This lesson lays out the four layers before any code runs.</p>

<h3>The four layers</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">layer 4 — your code</span><span class="lz-lnote"><code>io.on(&#39;connection&#39;, s =&gt; s.on(&#39;chat:message&#39;, ...))</code>. Named events, JSON payloads, rooms. This is the part in <code>src/socket/*.ts</code></span></div>
<div class="lz-layer"><span class="lz-lname">layer 3 — socket.io</span><span class="lz-lnote">Adds namespaces, rooms, acks, binary handling, and a per-connection sid. Speaks its own packet format on top of layer 2. This is <code>socket.io</code> 4.8.3 in <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">layer 2 — engine.io</span><span class="lz-lnote">Manages the connection itself — heartbeats, transport upgrades, its OWN sid. Bundled with socket.io; you never install it directly, but you WILL see its packet types in DevTools</span></div>
<div class="lz-layer"><span class="lz-lname">layer 1 — the wire</span><span class="lz-lnote">Either an HTTP long-poll or a WebSocket, chosen by engine.io. Not one or the other for the life of the connection — the same connection can START as HTTP and UPGRADE to WebSocket 200ms later</span></div>
</div>

<h3>Measured on this repo</h3>
<pre><code class="language-bash">$ grep -rE "socket\\.io|@socket\\.io" package.json | head
"@socket.io/redis-adapter": "^8.3.0",
"socket.io": "^4.8.3",

$ ls src/socket/
call.socket.ts        &lt;-  275 dong  (video call signalling)
device.gateway.ts     &lt;- 1.035 dong  (Maker Lab, raw WebSocket)
listen-together.ts    &lt;-  302 dong  (dong bo phat nhac)
messaging.socket.ts   &lt;-  518 dong  (chat, presence, entry point)
notes-collaboration.gateway.ts  &lt;- 300 dong  (Yjs CRDT)
</code></pre>

<div class="out">2.430 dong gateway thật, TAT CA deu ngoi tren socket.io layer 3
CONG THEM device.gateway.ts (Maker Lab) doi khi dung WebSocket THUAN,
       KHONG qua socket.io — mot bai hoc rieng cua Chuong 8
</div>

<h3>Who does what — a side-by-side</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CORS</span><span class="lz-nsub">layer 3</span></span>
<span class="lz-nbody">Configured at <code>new IOServer(server, { cors: { origin: true, credentials: true } })</code>. The HTTP CORS you set up in Express does NOT apply to the WebSocket upgrade — socket.io has its own option for it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping/pong</span><span class="lz-nsub">layer 2</span></span>
<span class="lz-nbody">Engine.io sends a ping every <code>pingInterval</code> seconds on its own and disconnects after <code>pingTimeout</code> with no reply. This repo uses 25s/60s. You do NOT hand-write pings at layer 4.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reconnect</span><span class="lz-nsub">layer 3 (client)</span></span>
<span class="lz-nbody">The client reconnects on its own with exponential backoff — 1s, 2s, 4s by default, capped at 5s. Layer 4 only receives <code>&#39;connect&#39;</code>/<code>&#39;disconnect&#39;</code> events; you never write the loop.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">room broadcast</span><span class="lz-nsub">layer 3</span></span>
<span class="lz-nbody"><code>io.to(&#39;user:42&#39;).emit(...)</code> reaches only the sockets that have <code>socket.join(&#39;user:42&#39;)</code>. Rooms do NOT exist at layer 2 — they are a socket.io abstraction.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cluster broadcast</span><span class="lz-nsub">Redis adapter</span></span>
<span class="lz-nbody"><code>io.to(&#39;room&#39;).emit(...)</code> by default reaches only the CURRENT worker. A multi-worker cluster needs <code>@socket.io/redis-adapter</code> so sockets on other workers receive it too. This repo has one; Chapter 5 measures it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">binary data</span><span class="lz-nsub">layers 2 and 3</span></span>
<span class="lz-nbody">Buffer/ArrayBuffer is encoded into real WebSocket binary frames, not base64. The client receives the same type. You never think about layer 1.</span>
</div>
</div>

<h3>Four surprising behaviours and the layer responsible for each</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">&quot;the initial connection is an HTTP POST&quot;</span><span class="lz-d"><strong>Layers 1 and 2.</strong> The client tries HTTP long-poll first by default, then upgrades to WebSocket. Look at the DevTools Network tab — you will see a few requests to <code>/socket.io/?EIO=4&amp;transport=polling</code> before any WS frame shows up. Not a bug; a feature (Chapter 2).</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">&quot;the disconnect takes 60 seconds&quot;</span><span class="lz-d"><strong>Layer 2.</strong> That is <code>pingTimeout</code>. The server only learns the client is gone when a ping goes unanswered. For that entire 60s, <code>io.sockets.adapter.rooms</code> still believes the client is there. Shorten it by lowering <code>pingTimeout</code>, not by writing more code.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">&quot;the broadcast never reaches the other workers&quot;</span><span class="lz-d"><strong>Layer 3 + Redis adapter.</strong> Cluster mode runs 4 Node workers, and a WebSocket connects to exactly ONE of them and stays there (sticky sessions in nginx). <code>io.emit</code> by default reaches only that worker. The Redis adapter carries messages across workers over pub/sub. Chapter 5.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">&quot;the client is using 2 different sids&quot;</span><span class="lz-d"><strong>Layers 2 and 3.</strong> The engine.io sid is not the socket.io sid — one engine.io connection can carry several namespaces, and each namespace issues its own sid. Lesson 0.3 measures this by connecting with a raw WebSocket.</span></div>
</div>

<div class="callout warn">
<p><strong>This sentence matters — each thing that annoys you lives at a DIFFERENT layer.</strong> You do not &quot;debug Socket.IO&quot; as one monolithic thing. You debug layer 4 (business logic) when an <code>emit</code> leaves but never arrives; layer 3 when a room or namespace is wrong; layer 2 on a ping timeout; layer 1 when a proxy blocks WebSocket. Four different tools for four layers.</p>
</div>

<h3>What Socket.IO is NOT</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">NOT the <code>WebSocket</code> browser API</span><span class="lz-lnote">The browser has <code>new WebSocket(url)</code> — 200 lines of W3C spec. Socket.IO sits ON TOP of it and adds reconnect + rooms + acks + fallback. You do NOT call <code>new WebSocket</code> when you use socket.io</span></div>
<div class="lz-layer"><span class="lz-lname">NOT MQTT / STOMP</span><span class="lz-lnote">Those &quot;proper&quot; pub/sub protocols have deep topic hierarchies, QoS levels and retained messages. Socket.io has an event name (a flat string) plus rooms. Smaller and easier, but also FEWER features</span></div>
<div class="lz-layer"><span class="lz-lname">NOT a standalone &quot;realtime server&quot;</span><span class="lz-lnote">There is no <code>socket.io</code> process running on its own. It is a library living inside your Express process — same HTTP server, same port, same memory. That is exactly what makes Chapter 5 delicate</span></div>
<div class="lz-layer"><span class="lz-lname">NOT exactly-once delivery by default</span><span class="lz-lnote">If the client drops while an emit is in flight, THAT message can be lost. Chapter 6 teaches acks + retries to get &quot;at-least-once&quot;. Anyone who wants exactly-once has to build their own dedupe layer</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cài <code>ws</code> instead of <code>socket.io</code> because it is &quot;lighter&quot;.</strong> Yes, the <code>ws</code> library is ~20 KB and socket.io is ~150 KB. Then you write reconnect yourself (hard — how long? which backoff?), heartbeat (hard — a dead server and a dead client are not the same thing), room broadcast (easy but slow to build), and a fallback for proxies that strip the upgrade (very hard). Three months later you have a worse socket.io with no documentation. This repo DOES have one place that uses <code>ws</code> raw — <code>device.gateway.ts</code> — and it takes 1,035 lines to do its job; Chapter 8 teaches when that trade is worth making.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Socket.IO is engine.io (a connection manager with pings and transport upgrades) wrapped in namespaces and rooms (a per-event routing layer) — four layers matching four different debugging surfaces, and every surprise in this course traces back to exactly which layer is responsible.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — How it works</span><span class="lc-sub">socket.io/docs/v4/how-it-works — tài liệu chính thức mô tả bốn tầng, ngắn hơn bài này nhưng dùng làm nguồn thứ hai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol</span><span class="lc-sub">github.com/socketio/engine.io-protocol — đặc tả wire packet của layer 2, đọc xong hiểu bài 0.3 nói gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebSockets_API — layer 1, thứ mà socket.io ngồi lên trên. Nhỏ nhưng đủ để hiểu &quot;WebSocket&quot; thật ra là gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">The Socket.IO track on Code Lab</span><span class="lc-sub">/code-lab/tracks/socket-io${REF} — mười thử thách thực hành song song mỗi chương của khoá.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Socket.IO là engine.io được BỌC bởi namespace và room</h2>
<p class="lead">Cái tên &quot;Socket.IO&quot; gợi ra một thứ gần với API <code>WebSocket</code> của trình duyệt cộng một wrapper npm dễ chịu. KHÔNG phải vậy. Nó là <em>HAI</em> thư viện xếp chồng lên HAI transport, và nhầm ranh giới nào cũng sinh ra bất ngờ. Bài này bày bốn tầng ra trước khi bất kỳ dòng mã nào chạy.</p>

<h3>Bốn tầng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tầng 4 — mã của bạn</span><span class="lz-lnote"><code>io.on(&#39;connection&#39;, s =&gt; s.on(&#39;chat:message&#39;, ...))</code>. Sự kiện có tên, payload JSON, room. Phần này ở <code>src/socket/*.ts</code></span></div>
<div class="lz-layer"><span class="lz-lname">tầng 3 — socket.io</span><span class="lz-lnote">Thêm namespace, room, ack, xử lý binary, và một sid trên mỗi connection. Nói packet format riêng trên đầu tầng 2. Đây là <code>socket.io</code> 4.8.3 trong <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">tầng 2 — engine.io</span><span class="lz-lnote">Quản lý bản thân connection — heartbeat, upgrade transport, sid RIÊNG. Được bundle với socket.io; bạn không cài trực tiếp nhưng SẼ thấy packet type của nó trong DevTools</span></div>
<div class="lz-layer"><span class="lz-lname">tầng 1 — dây</span><span class="lz-lnote">Hoặc HTTP long-poll, hoặc WebSocket, do engine.io chọn. KHÔNG phải một trong hai suốt đời — cùng một connection có thể BẮT ĐẦU bằng HTTP rồi UPGRADE sang WebSocket 200ms sau đó</span></div>
</div>

<h3>Đo trên kho này</h3>
<pre><code class="language-bash">$ grep -rE "socket\\.io|@socket\\.io" package.json | head
"@socket.io/redis-adapter": "^8.3.0",
"socket.io": "^4.8.3",

$ ls src/socket/
call.socket.ts        &lt;-  275 dong  (video call signalling)
device.gateway.ts     &lt;- 1.035 dong  (Maker Lab, raw WebSocket)
listen-together.ts    &lt;-  302 dong  (dong bo phat nhac)
messaging.socket.ts   &lt;-  518 dong  (chat, presence, entry point)
notes-collaboration.gateway.ts  &lt;- 300 dong  (Yjs CRDT)
</code></pre>

<div class="out">2.430 dong gateway thật, TAT CA deu ngoi tren socket.io layer 3
CONG THEM device.gateway.ts (Maker Lab) doi khi dung WebSocket THUAN,
       KHONG qua socket.io — mot bai hoc rieng cua Chuong 8
</div>

<h3>Đối chiếu ai làm gì</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CORS</span><span class="lz-nsub">tầng 3</span></span>
<span class="lz-nbody">Cấu hình ở <code>new IOServer(server, { cors: { origin: true, credentials: true } })</code>. HTTP CORS bên Express KHÔNG áp cho upgrade WebSocket — socket.io có option riêng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping/pong</span><span class="lz-nsub">tầng 2</span></span>
<span class="lz-nbody">Engine.io tự gửi ping mỗi <code>pingInterval</code> giây, ngắt kết nối sau <code>pingTimeout</code> không hồi. Kho này dùng 25s/60s. Bạn KHÔNG viết ping bằng tay ở tầng 4.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reconnect</span><span class="lz-nsub">tầng 3 (client)</span></span>
<span class="lz-nbody">Client tự động reconnect với exponential backoff — mặc định 1s, 2s, 4s... tối đa 5s. Tầng 4 chỉ nhận <code>&#39;connect&#39;</code>/<code>&#39;disconnect&#39;</code> events; không cần viết loop.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">broadcast room</span><span class="lz-nsub">tầng 3</span></span>
<span class="lz-nbody"><code>io.to(&#39;user:42&#39;).emit(...)</code> chỉ đến các socket đã <code>socket.join(&#39;user:42&#39;)</code>. Room KHÔNG có ở tầng 2 — nó là abstraction của socket.io.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">broadcast cluster</span><span class="lz-nsub">Redis adapter</span></span>
<span class="lz-nbody"><code>io.to(&#39;room&#39;).emit(...)</code> mặc định chỉ đến worker HIỆN TẠI. Cụm nhiều worker cần <code>@socket.io/redis-adapter</code> để socket ở worker khác cũng nhận. Kho này có; Chương 5 đo cái đó.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">dữ liệu binary</span><span class="lz-nsub">tầng 2 và 3</span></span>
<span class="lz-nbody">Buffer/ArrayBuffer được encode thành binary frames của WebSocket, không phải base64. Client nhận cùng type. Không cần nghĩ về tầng 1.</span>
</div>
</div>

<h3>Bốn hành vi bất ngờ và tầng chịu trách nhiệm</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">&quot;kết nối ban đầu là POST HTTP&quot;</span><span class="lz-d"><strong>Tầng 1 và 2.</strong> Client mặc định thử HTTP long-poll trước, sau đó nâng cấp lên WebSocket. Xem DevTools Network tab — bạn sẽ thấy vài request đến <code>/socket.io/?EIO=4&amp;transport=polling</code> trước khi frame WS xuất hiện. Không phải bug; là feature (Chương 2).</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">&quot;disconnect mất 60 giây&quot;</span><span class="lz-d"><strong>Tầng 2.</strong> Đó là <code>pingTimeout</code>. Server chỉ biết client mất khi ping không trả lời. Tất cả 60s ấy, <code>io.sockets.adapter.rooms</code> vẫn tin client còn ở đó. Cắt ngắn bằng cách hạ <code>pingTimeout</code>, không phải bằng cách viết code thêm.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">&quot;broadcast không tới worker khác&quot;</span><span class="lz-d"><strong>Tầng 3 + Redis adapter.</strong> Cluster mode chạy 4 worker Node, và WebSocket connect vào MỘT worker cố định (sticky session ở nginx). <code>io.emit</code> mặc định chỉ đến worker đó. Redis adapter phát tin cross-worker qua pub/sub. Chương 5.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">&quot;client dùng 2 sid khác nhau&quot;</span><span class="lz-d"><strong>Tầng 2 và 3.</strong> Engine.io sid ≠ socket.io sid — engine.io connection có thể nuôi nhiều namespace, mỗi namespace phát sid riêng. Bài 0.3 đo chuyện này bằng cách kết nối WebSocket thô.</span></div>
</div>

<div class="callout warn">
<p><strong>Câu này quan trọng — mỗi thứ gây khó chịu là ở TẦNG khác.</strong> Bạn không &quot;debug Socket.IO&quot; như một khối duy nhất. Bạn debug tầng 4 (business logic) khi <code>emit</code> đi mà không đến; tầng 3 khi room/namespace sai; tầng 2 khi ping timeout; tầng 1 khi proxy chặn WebSocket. Bốn công cụ khác nhau cho bốn tầng.</p>
</div>

<h3>Cái Socket.IO KHÔNG phải</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">KHÔNG phải <code>WebSocket</code> API của trình duyệt</span><span class="lz-lnote">Trình duyệt có <code>new WebSocket(url)</code> — 200 dòng W3C spec. Socket.IO ngồi TRÊN nó, thêm reconnect + room + ack + fallback. Bạn KHÔNG gọi <code>new WebSocket</code> khi dùng socket.io</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG phải MQTT / STOMP</span><span class="lz-lnote">Các protocol pub/sub &quot;chuẩn&quot; đó có topic hierarchy phức tạp, mức QoS, retained message. Socket.io có event name (chuỗi phẳng) + room. Nhỏ hơn và dễ hơn, nhưng cũng ÍT tính năng hơn</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG phải một &quot;server realtime&quot; đứng riêng</span><span class="lz-lnote">Không có process <code>socket.io</code> chạy riêng. Nó là library ngồi trong tiến trình Express của bạn — chia sẻ cùng HTTP server, cùng port, cùng memory. Đó là chỗ Chương 5 phải cẩn thận</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG bảo đảm exactly-once delivery mặc định</span><span class="lz-lnote">Nếu client mất kết nối trong lúc emit đang bay, tin nhắn ĐÓ có thể mất. Chương 6 dạy cách dùng ack + retry để có &quot;at-least-once&quot;. Ai muốn exactly-once phải tự dựng dedupe layer</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cài <code>ws</code> thay vì <code>socket.io</code> vì &quot;nhẹ hơn&quot;.</strong> Vâng, thư viện <code>ws</code> là ~20 KB và socket.io là ~150 KB. Rồi bạn tự viết reconnect (khó — bao lâu? backoff nào?), heartbeat (khó — server chết vs client chết khác nhau), room broadcast (dễ nhưng tốn thời gian), fallback cho proxy strip upgrade (rất khó). Sau ba tháng bạn có một socket.io tệ hơn và không có tài liệu. Kho này CÓ một chỗ dùng <code>ws</code> thuần — <code>device.gateway.ts</code> — và nó cần 1.035 dòng để làm việc; Chương 8 dạy khi nào cái đánh đổi ấy đáng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.IO là engine.io (một trình quản lý connection có ping và upgrade transport) được bọc bởi namespace và room (một layer routing per-event) — bốn tầng ứng với bốn lớp gỡ lỗi khác nhau, và mọi thứ gây bất ngờ trong khoá này đều truy được về đúng tầng nào chịu trách nhiệm.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — How it works</span><span class="lc-sub">socket.io/docs/v4/how-it-works — tài liệu chính thức mô tả bốn tầng, ngắn hơn bài này nhưng dùng làm nguồn thứ hai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol</span><span class="lc-sub">github.com/socketio/engine.io-protocol — đặc tả wire packet của tầng 2, đọc xong hiểu bài 0.3 nói gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebSockets_API — tầng 1, thứ mà socket.io ngồi lên trên. Nhỏ nhưng đủ để hiểu &quot;WebSocket&quot; thật ra là gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Track Socket.IO trên Code Lab</span><span class="lc-sub">/code-lab/tracks/socket-io${REF} — mười thử thách thực hành song song mỗi chương của khoá.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Why long-polling is still not dead in 2026|||0.2 — Vì sao long-polling KHÔNG chết trong năm 2026',
      slug: 'io-0-2-long-poll',
      type: 'VIDEO',
      description: 'Kho này cấu hình `transports: [&quot;websocket&quot;, &quot;polling&quot;]` cố ý. Bài này chỉ ra ai vẫn đang lọt qua long-polling và tại sao tắt polling là một dòng cấu hình có thể chặn 3-5% users.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Why long-polling is still not dead in 2026</h2>
<p class="lead">Every modern browser supports WebSocket. Every modern OS supports WebSocket. So why does <code>src/socket/messaging.socket.ts</code> keep <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> in 2026? The comment right above it says &quot;WebSocket-only would break users behind corporate proxies that strip the upgrade header&quot;. This lesson measures who those users are and what &quot;break&quot; means.</p>

<h3>The real config in this repo</h3>
<pre><code class="language-ts">// src/socket/messaging.socket.ts:220-232
io = new IOServer(httpServer, {
  cors: { origin: true, credentials: true },
  // Long-poll fallback is enabled by default; WebSocket-only would
  // break users behind corporate proxies that strip the upgrade header.
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});
</code></pre>

<div class="callout warn">
<p><strong>The order in <code>transports: [...]</code> is NOT the order things are tried.</strong> Newcomers read <code>[&#39;websocket&#39;, &#39;polling&#39;]</code> and think &quot;try WebSocket first, fall back to polling&quot;. Wrong. By default the client <em>always</em> starts with polling (safe through every proxy) and then upgrades to WebSocket. That list only declares which transports are ALLOWED, not their order.</p>
</div>

<h3>Who still needs polling — four groups</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">office staff behind a proxy</span><span class="lz-nsub">2-4% audience</span></span>
<span class="lz-nbody">Corporations deploy filtering HTTP proxies (Zscaler, Palo Alto, Symantec) whose default configuration STRIPS the <code>Upgrade: websocket</code> header. The client attempts the upgrade → the server never sees the header → it stays on polling. Without polling the socket is simply dead.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">mobile 3G/4G in weak-coverage areas</span><span class="lz-nsub">1-2% audience</span></span>
<span class="lz-nbody">Some carrier-grade NATs (especially on &quot;budget&quot; plans) do not carry WebSocket reliably. The connection flickers, pings time out, reconnects loop. Polling over plain HTTP always gets through.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a misconfigured nginx</span><span class="lz-nsub">100% of yours if you forget</span></span>
<span class="lz-nbody">Nginx does NOT proxy the upgrade header by default. It needs <code>proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection &quot;upgrade&quot;;</code>. Forget it and WebSocket returns 400. With polling on, the client falls back AUTOMATICALLY — your users never learn you broke it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bots / scrapers</span><span class="lz-nsub">depends on the product</span></span>
<span class="lz-nbody">Many bots speak only HTTP. With polling on they can still connect if you want them to (analytics, monitoring). With polling off they die — which may be good or bad depending on the situation.</span>
</div>
</div>

<h3>Đo cost — long-polling nặng hơn WebSocket bao nhiêu?</h3>
<pre><code class="language-python"># mo phong: 100 tin nhan nho, mot huong, 5 phut
# polling  : moi tin phai keo mot HTTP request + response header (~800 byte overhead)
# websocket: moi tin la 2-14 byte frame overhead

polling_overhead   = 800 * 100         # 80.000 byte cho overhead
websocket_overhead =   6 * 100         # 600 byte cho overhead

ratio = 80_000 / 600                    # 133x
</code></pre>

<div class="out">100 tin, mot huong, 5 phut:
  polling   overhead: 80.000 byte
  websocket overhead: 600 byte
  polling nang gap: 133 lan

Do la MOT huong. Voi chat song phuong thi tang gap doi cho client.
</div>

<div class="callout warn">
<p><strong>But whoever is on polling has NO choice about it.</strong> 133× overhead is an alarming number for a backend taking millions of messages an hour, but the users stuck on polling are ~5% of the audience and they will send VERY FEW messages per hour (their network is slow). In practice, 5% × few-messages = &lt; 1% of total bytes. Measure it yourself before switching it off.</p>
</div>

<h3>When you can turn polling off</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">your internal app</span><span class="lz-d">If every user sits inside the company and you CONTROL the proxy, you can turn it off. It saves 5% of egress bandwidth and removes a whole class of bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">native mobile app</span><span class="lz-d">iOS/Android apps use WebSocket through the native stack (which usually does not traverse an office proxy). You can turn polling off on a mobile-only endpoint.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">you have ALREADY measured and know 0% of traffic is on polling</span><span class="lz-d">Log <code>socket.conn.transport.name</code> after the upgrade completes. If after 30 days no total exceeds 0.1%, you can switch it off.</span></div>
</div>

<div class="callout ok">
<p><strong>This repo keeps polling ON — the right call for a public web app in Vietnam.</strong> Users are on company laptops, coffee-shop wifi, mobile 3G — all of it. The CuongThai logs will show 3-5% of traffic on polling; turning polling off means 3-5% of users reporting &quot;chat doesn't work&quot;.</p>
</div>

<h3>Watching the transport upgrade with your own eyes</h3>
<pre><code class="language-bash"># chay socket.io test server
$ node probe1.mjs
listen on 44187
SERVER received connection, transport= polling      &lt;- bat dau
CLIENT connected, transport= websocket
SERVER upgrade to websocket                          &lt;- upgrade ~200ms sau
</code></pre>

<p>One &quot;connection&quot; as far as the client is concerned, two different layer-1 transports. The server reads <code>socket.conn.transport.name</code> to know who is where.</p>

<h3>Signs a client is stuck on polling</h3>
<pre><code class="language-ts">// server code
io.on('connection', socket => {
  logger.info('client connected', {
    transport: socket.conn.transport.name,   // "polling" hoac "websocket"
    ip: socket.handshake.address,
  });
  socket.conn.on('upgrade', t => {
    logger.info('upgraded transport', { transport: t.name });
  });
});
</code></pre>

<div class="out">Sau 24h thu thap tren production (mo phong):
  99.2% cac connection upgrade len websocket trong 500ms
   0.6% ngoi polling suot doi (proxy strip)
   0.2% khong bao gio ket noi duoc (upgrade timeout)
</div>

<div class="pitfall">
<p><strong>Bẫy — bật <code>transports: [&#39;websocket&#39;]</code> because a StackOverflow answer said it was &quot;faster&quot;.</strong> You cut polling → 3-5% of users report &quot;I'm not getting new messages&quot;. You cannot see why, because on your dev machine (good corporate network, no proxy) it works perfectly. This is the class of bug that does NOT reproduce in dev, and the log line &quot;client disconnect after ping timeout&quot; reads like a backend bug. The only way back is a rollback.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> is the right default for a public web app — the client always starts on polling and upgrades to WebSocket within ~200ms if it gets through the proxy, while the 3-5% of the audience sitting behind an upgrade-stripping proxy stay on polling (133× the overhead, but still working) — and turning polling off is a decision you measure, not one you take on StackOverflow's advice.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — hai transport được hỗ trợ, các chỉnh option client-side.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket handshake</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism — chi tiết cái <code>Upgrade: websocket</code> header mà proxy có thể strip.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx WebSocket proxying</span><span class="lc-sub">nginx.org/en/docs/http/websocket.html — hai dòng <code>proxy_set_header Upgrade</code> bắt buộc, kèm ví dụ và giải thích.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — nginx as the proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — nếu bạn quên hai dòng ở link trên, mọi upgrade sẽ 400 và bài này là bằng chứng vì sao có polling thì bạn không thấy hỏng.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Vì sao long-polling KHÔNG chết trong năm 2026</h2>
<p class="lead">Mọi trình duyệt hiện đại hỗ trợ WebSocket. Mọi OS hiện đại hỗ trợ WebSocket. Vậy tại sao <code>src/socket/messaging.socket.ts</code> vẫn giữ <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> trong năm 2026? Comment ngay trên nó nói &quot;WebSocket-only would break users behind corporate proxies that strip the upgrade header&quot;. Bài này đo xem những người đó là ai và &quot;break&quot; nghĩa là gì.</p>

<h3>Config thật trong kho này</h3>
<pre><code class="language-ts">// src/socket/messaging.socket.ts:220-232
io = new IOServer(httpServer, {
  cors: { origin: true, credentials: true },
  // Long-poll fallback is enabled by default; WebSocket-only would
  // break users behind corporate proxies that strip the upgrade header.
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});
</code></pre>

<div class="callout warn">
<p><strong>Thứ tự trong <code>transports: [...]</code> KHÔNG phải thứ tự thử.</strong> Người mới đọc đọc <code>[&#39;websocket&#39;, &#39;polling&#39;]</code> nghĩ &quot;thử WebSocket trước, polling nếu thất bại&quot;. Sai. Client mặc định <em>luôn</em> bắt đầu bằng polling (an toàn qua mọi proxy) rồi upgrade lên WebSocket. Cái list ấy chỉ khai báo transport nào được PHÉP dùng, không thứ tự.</p>
</div>

<h3>Ai vẫn cần polling — bốn nhóm</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nhân viên VP có proxy</span><span class="lz-nsub">2-4% audience</span></span>
<span class="lz-nbody">Các tập đoàn triển khai proxy HTTP filter (Zscaler, Palo Alto, Symantec) mà cấu hình mặc định STRIP <code>Upgrade: websocket</code> header. Client thử upgrade → server không nhận header → giữ nguyên polling. Không có polling thì socket dead.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">di động 3G/4G ở khu vực yếu</span><span class="lz-nsub">1-2% audience</span></span>
<span class="lz-nbody">Một số carrier NAT của viễn thông (đặc biệt các gói &quot;giá rẻ&quot;) không hỗ trợ WebSocket ổn định. Kết nối chập chờn, ping timeout, reconnect vòng. Polling qua HTTP thì luôn qua được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nginx cấu hình sai</span><span class="lz-nsub">100% của bạn nếu quên</span></span>
<span class="lz-nbody">Nginx mặc định KHÔNG proxy upgrade header. Cần <code>proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection &quot;upgrade&quot;;</code>. Quên = WebSocket 400. Có polling thì client TỰ ĐỘNG rơi về polling — người dùng không biết bạn đã hỏng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bot / cào trang</span><span class="lz-nsub">tuỳ product</span></span>
<span class="lz-nbody">Nhiều bot chỉ nói HTTP. Có polling thì bot vẫn kết nối được nếu bạn muốn (analytics, monitoring). Tắt polling thì bot chết — có thể tốt hoặc xấu tuỳ tình huống.</span>
</div>
</div>

<h3>Đo cost — long-polling nặng hơn WebSocket bao nhiêu?</h3>
<pre><code class="language-python"># mo phong: 100 tin nhan nho, mot huong, 5 phut
# polling  : moi tin phai keo mot HTTP request + response header (~800 byte overhead)
# websocket: moi tin la 2-14 byte frame overhead

polling_overhead   = 800 * 100         # 80.000 byte cho overhead
websocket_overhead =   6 * 100         # 600 byte cho overhead

ratio = 80_000 / 600                    # 133x
</code></pre>

<div class="out">100 tin, mot huong, 5 phut:
  polling   overhead: 80.000 byte
  websocket overhead: 600 byte
  polling nang gap: 133 lan

Do la MOT huong. Voi chat song phuong thi tang gap doi cho client.
</div>

<div class="callout warn">
<p><strong>Nhưng ai đang trên polling KHÔNG có lựa chọn.</strong> 133× overhead là con số đáng lo cho một backend nhận triệu tin nhắn/giờ, nhưng người dùng ngồi trên polling là ~5% audience và họ sẽ dùng RẤT ÍT tin nhắn/giờ (vì mạng chậm). Trong thực tế, 5% × ít-tin-nhắn = &lt; 1% tổng bytes. Tự đo trước khi tắt.</p>
</div>

<h3>Khi nào bạn có thể tắt polling</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">app internal của bạn</span><span class="lz-d">Nếu người dùng đều ngồi trong công ty và bạn KIỂM SOÁT proxy, có thể tắt. Tiết kiệm 5% băng thông đầu ra và loại một class bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">native mobile app</span><span class="lz-d">Ứng dụng iOS/Android tự dùng WebSocket qua stack native (thường không đi qua proxy văn phòng). Có thể tắt polling ở endpoint dành riêng cho mobile.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bạn ĐÃ đo và biết 0% traffic đang là polling</span><span class="lz-d">Log <code>socket.conn.transport.name</code> sau khi upgrade xong. Nếu sau 30 ngày không có tổng nào &gt; 0.1%, tắt được.</span></div>
</div>

<div class="callout ok">
<p><strong>Kho này giữ polling ON — quyết định đúng cho public web app tại Việt Nam.</strong> Người dùng có laptop công ty, wifi cafe, 3G di động, có tất cả. Log CuongThai sẽ có 3-5% traffic là polling; tắt polling = 3-5% users báo &quot;chat không chạy&quot;.</p>
</div>

<h3>Nhìn transport upgrade bằng mắt</h3>
<pre><code class="language-bash"># chay socket.io test server
$ node probe1.mjs
listen on 44187
SERVER received connection, transport= polling      &lt;- bat dau
CLIENT connected, transport= websocket
SERVER upgrade to websocket                          &lt;- upgrade ~200ms sau
</code></pre>

<p>Cùng một &quot;connection&quot; theo góc nhìn client, hai transport khác nhau ở tầng 1. Server nhìn <code>socket.conn.transport.name</code> để biết ai đang ở đâu.</p>

<h3>Dấu hiệu client kẹt ở polling</h3>
<pre><code class="language-ts">// server code
io.on('connection', socket => {
  logger.info('client connected', {
    transport: socket.conn.transport.name,   // "polling" hoac "websocket"
    ip: socket.handshake.address,
  });
  socket.conn.on('upgrade', t => {
    logger.info('upgraded transport', { transport: t.name });
  });
});
</code></pre>

<div class="out">Sau 24h thu thap tren production (mo phong):
  99.2% cac connection upgrade len websocket trong 500ms
   0.6% ngoi polling suot doi (proxy strip)
   0.2% khong bao gio ket noi duoc (upgrade timeout)
</div>

<div class="pitfall">
<p><strong>Bẫy — bật <code>transports: [&#39;websocket&#39;]</code> vì đọc trên StackOverflow bảo &quot;faster&quot;.</strong> Bạn cắt polling → 3-5% users báo &quot;không nhận được tin nhắn mới&quot;. Bạn không hiểu vì sao vì trên máy dev bạn (mạng công ty tốt, không proxy) chạy hoàn hảo. Đây là kiểu bug KHÔNG tái hiện được ở dev, và log nói &quot;client disconnect after ping timeout&quot; nghe như bug backend. Đường về phải qua rollback.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> là mặc định đúng cho public web app — client luôn bắt đầu bằng polling và upgrade lên WebSocket trong ~200ms nếu qua được proxy, còn 3-5% audience ngồi sau proxy strip upgrade thì tiếp tục polling (đắt 133× overhead nhưng vẫn chạy) — và tắt polling là quyết định phải đo, không phải quyết định theo hướng dẫn của StackOverflow.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — hai transport được hỗ trợ, các chỉnh option client-side.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket handshake</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism — chi tiết cái <code>Upgrade: websocket</code> header mà proxy có thể strip.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx WebSocket proxying</span><span class="lc-sub">nginx.org/en/docs/http/websocket.html — hai dòng <code>proxy_set_header Upgrade</code> bắt buộc, kèm ví dụ và giải thích.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nginx làm proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — nếu bạn quên hai dòng ở link trên, mọi upgrade sẽ 400 và bài này là bằng chứng vì sao có polling thì bạn không thấy hỏng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — What is on the wire: three real packets|||0.3 — Thứ trên dây: ba packet thật',
      slug: 'io-0-3-tren-day',
      type: 'VIDEO',
      description: 'Kết nối WebSocket thô bằng thư viện `ws`, không qua socket.io-client. Đọc ba frame đầu và biết mỗi ký tự nghĩa gì — từ đó DevTools tab WS đọc được như tiếng mẹ đẻ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>What is on the wire: three real packets</h2>
<p class="lead">Every previous lesson used the socket.io client library. This one bypasses it and connects with raw <code>ws</code>, so we can read the actual bytes and match them against the engine.io protocol spec. After this lesson, DevTools&#39; Network → WS tab is not magic — it is a list of packets you can decode.</p>

<h3>The measurement</h3>
<pre><code class="language-js">import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'http';

const srv = http.createServer();
const io = new Server(srv);
io.on('connection', s => s.emit('hello', { world: 42 }));
await new Promise(r => srv.listen(0, r));

const ws = new WebSocket(&#96;ws://localhost:\${srv.address().port}/socket.io/?EIO=4&transport=websocket&#96;);
ws.on('message', d =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise(r =&gt; ws.on('open', r));
ws.send('40');   // Manually send engine.io message + socket.io CONNECT
</code></pre>

<div class="out">$ node probe3.mjs
WIRE: "0{\\"sid\\":\\"sF7e3x9ZpVJa0IwhAAAA\\",\\"upgrades\\":[],\\"pingInterval\\":25000,\\"pingTimeout\\":20000,\\"maxPayload\\":1000000}"
WIRE: "40{\\"sid\\":\\"2f1OJR736nRPGKluAAAB\\"}"
WIRE: "42[\\"hello\\",{\\"world\\":42}]"
</div>

<p>Three frames. Each one starts with one or two digits — that is the engine.io/socket.io packet type. Let&#39;s decode them.</p>

<h3>Frame 1 — engine.io OPEN packet</h3>
<pre><code class="language-text">0{"sid":"sF7e3x9ZpVJa0IwhAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}
│
└── engine.io packet type 0 = OPEN
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>sid</code></span><span class="lz-lnote">The engine.io session id. This is the LAYER 2 sid — it identifies the connection, not the socket. Polling needs it so two separate HTTP requests know they belong to the same session</span></div>
<div class="lz-layer"><span class="lz-lname"><code>upgrades: []</code></span><span class="lz-lnote">Empty because this client connected over WebSocket from the start. Had it connected by polling, this list would read <code>[&quot;websocket&quot;]</code> to say &quot;you may upgrade to WebSocket whenever you like&quot;</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingInterval: 25000</code></span><span class="lz-lnote">The server will send a ping every 25 seconds. This is the default; this repo sets the same 25000</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingTimeout: 20000</code></span><span class="lz-lnote">If the server gets no pong within 20 seconds, the client is considered gone. Default is 20s; this repo sets 60000 (60s, higher to absorb mobile-network jitter)</span></div>
<div class="lz-layer"><span class="lz-lname"><code>maxPayload: 1000000</code></span><span class="lz-lnote">Maximum size of a single message: 1 MB. Anything larger is rejected at layer 2 before it ever reaches your code</span></div>
</div>

<h3>Frame 2 — socket.io CONNECT packet</h3>
<pre><code class="language-text">40{"sid":"2f1OJR736nRPGKluAAAB"}
│└─ socket.io packet type 0 = CONNECT
└── engine.io packet type 4 = MESSAGE
</code></pre>

<div class="callout warn">
<p><strong>This is where there are TWO sids.</strong> The engine.io sid in frame 1 (<code>sF7e3x9ZpVJa0IwhAAAA</code>) is different from the socket.io sid in frame 2 (<code>2f1OJR736nRPGKluAAAB</code>). One engine.io connection can carry several namespaces, and each namespace issues its OWN sid. In the debugger you will see <code>socket.id</code> và <code>socket.conn.id</code> — the first is the layer-3 sid, the second the layer-2 one. It is baffling the first time you meet it.</p>
</div>

<h3>Frame 3 — socket.io EVENT packet</h3>
<pre><code class="language-text">42["hello",{"world":42}]
│└─ socket.io packet type 2 = EVENT
└── engine.io packet type 4 = MESSAGE
</code></pre>

<p>The payload is a JSON array: the first element is the event NAME, the rest are its arguments. This is where your layer-4 code lines up:</p>

<pre><code class="language-ts">socket.emit('hello', { world: 42 })
//     ↑         ↑          ↑
//   type=2    name       args[0]
</code></pre>

<h3>The packet-type table — for the whole course</h3>
<pre><code class="language-text">engine.io packet types (chu so DAU tien)
0 = OPEN         (server gui khi ket noi thanh cong)
1 = CLOSE
2 = PING
3 = PONG
4 = MESSAGE      (chua mot socket.io packet ben trong)
5 = UPGRADE
6 = NOOP

socket.io packet types (chu so THU HAI, sau khi engine.io la 4)
0 = CONNECT      (client tham gia namespace)
1 = DISCONNECT
2 = EVENT        (tin nhan binh thuong)
3 = ACK          (phan hoi cho mot emit yeu cau ack)
4 = CONNECT_ERROR
5 = BINARY_EVENT (co attachment binary)
6 = BINARY_ACK
</code></pre>

<div class="callout ok">
<p><strong>Read this table straight out of DevTools.</strong> Open the Network tab, filter on &quot;WS&quot;, click the socket.io connection, then the Messages tab. Every row is one frame and you see the string it starts with. <code>42[...]</code> is an event, <code>2</code> alone is a ping, <code>3</code> alone is a pong. No more guessing why &quot;the client never got the emit&quot; — just look for the presence or absence of the <code>42[&quot;event-name&quot;,...]</code>.</p>
</div>

<h3>Why the four layers become obvious once you read packets</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">layer 1</span><span class="lz-t">WebSocket frame</span><span class="lz-d">Says only &quot;a message arrived&quot;, never &quot;which message&quot;. Text or binary, that is all. DevTools renders binary as hex and text as a string.</span></div>
<div class="lz-step"><span class="lz-k">layer 2</span><span class="lz-t">engine.io</span><span class="lz-d">The first digit. <code>0</code>=OPEN, <code>4</code>=MESSAGE. No payload and the story ends there. With a payload you read the rest under the LAYER 3 protocol.</span></div>
<div class="lz-step"><span class="lz-k">layer 3</span><span class="lz-t">socket.io</span><span class="lz-d">The second digit (when engine.io is 4). <code>0</code>=CONNECT, <code>2</code>=EVENT. The payload is JSON.</span></div>
<div class="lz-step"><span class="lz-k">layer 4</span><span class="lz-t">your code</span><span class="lz-d">From the JSON array, the first element is the event name and the rest are args. This is where <code>socket.on(&#39;event&#39;, ...args)</code> gets called.</span></div>
</div>

<h3>An ack on the wire</h3>
<pre><code class="language-text">Server:  421["chat:message",{"text":"hi"}]
                │
                └── ack id = 1

Client:  431[{"ok":true}]
         │
         └── ack response, khop id 1
</code></pre>

<p>Only when you <code>emit</code> with a callback does an ack id get assigned. No callback → no ack id → no &quot;at-least-once&quot; guarantee — Chapter 6 measures exactly this.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ <code>2</code> và <code>3</code> are &quot;ping&quot; and &quot;pong&quot; at LAYER 3.</strong> NO. <code>2</code> và <code>3</code> are packet types at LAYER 2 (engine.io). At LAYER 3 (socket.io, once engine.io has said 4), <code>2</code> is EVENT and <code>3</code> is ACK. Same digits, different layer, different meaning. Confusing the two is the number-one source of muddled logs when debugging the protocol.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The first three packets of every socket.io connection are OPEN (engine.io <code>0</code> mang sid + timings), CONNECT (engine.io <code>4</code> + socket.io <code>0</code> carrying the namespace sid) and EVENT (engine.io <code>4</code> + socket.io <code>2</code> mang <code>[&quot;name&quot;, ...args]</code>) — know those three and DevTools&#39; Network → WS tab becomes a packet list you can actually read, and every &quot;did the event go out?&quot; question turns into &quot;is there a <code>42[&quot;name&quot;,...]</code> in the tab?&quot;.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol spec</span><span class="lc-sub">github.com/socketio/engine.io-protocol — nguồn cho bảng packet type ở layer 2. Ngắn (dưới 300 dòng markdown) và bắt buộc đọc một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO protocol spec</span><span class="lc-sub">github.com/socketio/socket.io-protocol — nguồn cho bảng packet type ở layer 3, kèm định nghĩa ack và binary attachments.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket frame inspection</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — cách mở tab WS, lọc frame, và xem payload trong bảng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 11 — diagnosing realtime bugs</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng chính bảng packet của bài này ở bước một: có frame <code>42[...]</code> trên dây không?</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Thứ trên dây: ba packet thật</h2>
<p class="lead">Mọi bài trước đều dùng thư viện socket.io-client. Bài này bỏ qua nó và kết nối bằng <code>ws</code> thô, để đọc byte thật và đối chiếu với đặc tả engine.io. Sau bài này, tab Network → WS của DevTools không còn là ma thuật — nó là một danh sách packet bạn giải mã được.</p>

<h3>Phép đo</h3>
<pre><code class="language-js">import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'http';

const srv = http.createServer();
const io = new Server(srv);
io.on('connection', s => s.emit('hello', { world: 42 }));
await new Promise(r => srv.listen(0, r));

const ws = new WebSocket(&#96;ws://localhost:\${srv.address().port}/socket.io/?EIO=4&transport=websocket&#96;);
ws.on('message', d =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise(r =&gt; ws.on('open', r));
ws.send('40');   // gui thu cong engine.io message + socket.io CONNECT
</code></pre>

<div class="out">$ node probe3.mjs
WIRE: "0{\\"sid\\":\\"sF7e3x9ZpVJa0IwhAAAA\\",\\"upgrades\\":[],\\"pingInterval\\":25000,\\"pingTimeout\\":20000,\\"maxPayload\\":1000000}"
WIRE: "40{\\"sid\\":\\"2f1OJR736nRPGKluAAAB\\"}"
WIRE: "42[\\"hello\\",{\\"world\\":42}]"
</div>

<p>Ba frame. Mỗi cái bắt đầu bằng một hoặc hai chữ số — đó là packet type của engine.io/socket.io. Giải mã từng cái.</p>

<h3>Frame 1 — engine.io OPEN packet</h3>
<pre><code class="language-text">0{"sid":"sF7e3x9ZpVJa0IwhAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}
│
└── packet type engine.io 0 = OPEN
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>sid</code></span><span class="lz-lnote">Engine.io session id. Đây là sid của TẦNG 2 — nó định danh cái connection, không phải socket. Cần cho polling để hai HTTP request biết nói cùng một session</span></div>
<div class="lz-layer"><span class="lz-lname"><code>upgrades: []</code></span><span class="lz-lnote">Trống vì client này đã kết nối bằng WebSocket ngay từ đầu. Nếu kết nối bằng polling, list này sẽ là <code>[&quot;websocket&quot;]</code> để nói &quot;bạn có thể upgrade lên WebSocket bất cứ lúc nào&quot;</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingInterval: 25000</code></span><span class="lz-lnote">Server sẽ gửi ping mỗi 25 giây. Đây là default; kho này đặt cùng số 25000</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingTimeout: 20000</code></span><span class="lz-lnote">Nếu server không nhận pong trong 20 giây, client bị coi là mất. Default 20s; kho này đặt 60000 (60s, cao hơn để chịu được biến động mạng di động)</span></div>
<div class="lz-layer"><span class="lz-lname"><code>maxPayload: 1000000</code></span><span class="lz-lnote">Kích thước tối đa một tin nhắn: 1 MB. Vượt qua sẽ bị từ chối ở tầng 2 trước khi đến code của bạn</span></div>
</div>

<h3>Frame 2 — socket.io CONNECT packet</h3>
<pre><code class="language-text">40{"sid":"2f1OJR736nRPGKluAAAB"}
│└─ packet type socket.io 0 = CONNECT
└── packet type engine.io 4 = MESSAGE
</code></pre>

<div class="callout warn">
<p><strong>Đây là chỗ có HAI sid.</strong> Engine.io sid ở frame 1 (<code>sF7e3x9ZpVJa0IwhAAAA</code>) khác socket.io sid ở frame 2 (<code>2f1OJR736nRPGKluAAAB</code>). Một engine.io connection có thể nuôi nhiều namespace, và mỗi namespace phát sid RIÊNG. Trong debugger bạn sẽ thấy <code>socket.id</code> và <code>socket.conn.id</code> — cái đầu là sid tầng 3, cái sau là sid tầng 2. Lần đầu thấy là bối rối.</p>
</div>

<h3>Frame 3 — socket.io EVENT packet</h3>
<pre><code class="language-text">42["hello",{"world":42}]
│└─ packet type socket.io 2 = EVENT
└── packet type engine.io 4 = MESSAGE
</code></pre>

<p>Payload là một mảng JSON: phần tử đầu là TÊN sự kiện, các phần tử sau là các argument. Đây là chỗ code của bạn ở tầng 4 tương ứng:</p>

<pre><code class="language-ts">socket.emit('hello', { world: 42 })
//     ↑         ↑          ↑
//   type=2    name       args[0]
</code></pre>

<h3>Bảng packet type — cho toàn khoá học</h3>
<pre><code class="language-text">engine.io packet types (chu so DAU tien)
0 = OPEN         (server gui khi ket noi thanh cong)
1 = CLOSE
2 = PING
3 = PONG
4 = MESSAGE      (chua mot socket.io packet ben trong)
5 = UPGRADE
6 = NOOP

socket.io packet types (chu so THU HAI, sau khi engine.io la 4)
0 = CONNECT      (client tham gia namespace)
1 = DISCONNECT
2 = EVENT        (tin nhan binh thuong)
3 = ACK          (phan hoi cho mot emit yeu cau ack)
4 = CONNECT_ERROR
5 = BINARY_EVENT (co attachment binary)
6 = BINARY_ACK
</code></pre>

<div class="callout ok">
<p><strong>Đọc bảng này trong DevTools.</strong> Mở tab Network, lọc &quot;WS&quot;, click connection socket.io, tab Messages. Mỗi hàng là một frame và bạn thấy chuỗi bắt đầu bằng số. <code>42[...]</code> là event, <code>2</code> một mình là ping, <code>3</code> một mình là pong. Không cần đoán vì sao &quot;client không nhận emit&quot; — nhìn có hay không có frame <code>42[&quot;event-name&quot;,...]</code>.</p>
</div>

<h3>Vì sao bốn tầng lại rõ ràng khi nhìn packet</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tầng 1</span><span class="lz-t">WebSocket frame</span><span class="lz-d">Chỉ nói &quot;có tin&quot;, không nói &quot;tin gì&quot;. Text hay binary, thế thôi. DevTools hiển thị binary như hex, text như chuỗi.</span></div>
<div class="lz-step"><span class="lz-k">tầng 2</span><span class="lz-t">engine.io</span><span class="lz-d">Số đầu tiên. <code>0</code>=OPEN, <code>4</code>=MESSAGE. Không có payload thì hết chuyện. Có payload thì đọc phần còn lại theo protocol của TẦNG 3.</span></div>
<div class="lz-step"><span class="lz-k">tầng 3</span><span class="lz-t">socket.io</span><span class="lz-d">Số thứ hai (khi engine.io là 4). <code>0</code>=CONNECT, <code>2</code>=EVENT. Payload là JSON.</span></div>
<div class="lz-step"><span class="lz-k">tầng 4</span><span class="lz-t">mã của bạn</span><span class="lz-d">Từ JSON array, phần tử đầu là tên event, phần còn lại là args. Đây là chỗ <code>socket.on(&#39;event&#39;, ...args)</code> được gọi.</span></div>
</div>

<h3>Ack trên dây</h3>
<pre><code class="language-text">Server:  421["chat:message",{"text":"hi"}]
                │
                └── ack id = 1

Client:  431[{"ok":true}]
         │
         └── ack response, khop id 1
</code></pre>

<p>Chỉ khi bạn <code>emit</code> có callback là ack id được gán. Không có callback → không có ack id → không có &quot;at-least-once&quot; guarantee — Chương 6 sẽ đo cái này.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ <code>2</code> và <code>3</code> là &quot;ping&quot; và &quot;pong&quot; ở TẦNG 3.</strong> KHÔNG. <code>2</code> và <code>3</code> là packet type ở TẦNG 2 (engine.io). Ở TẦNG 3 (socket.io, sau khi engine.io là 4) thì <code>2</code> là EVENT và <code>3</code> là ACK. Cùng số, khác tầng, khác nghĩa. Nhầm lẫn ở đây là nguồn số 1 của log lộn xộn khi debug protocol.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba packet đầu tiên của mọi connection socket.io là OPEN (engine.io <code>0</code> mang sid + timings), CONNECT (engine.io <code>4</code> + socket.io <code>0</code> mang sid namespace) và EVENT (engine.io <code>4</code> + socket.io <code>2</code> mang <code>[&quot;name&quot;, ...args]</code>) — biết ba cái này thì tab DevTools&#39; Network → WS là một danh sách packet bạn đọc được, và mọi câu hỏi &quot;event có đi không&quot; trở thành câu hỏi &quot;có <code>42[&quot;name&quot;,...]</code> trong tab không&quot;.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol spec</span><span class="lc-sub">github.com/socketio/engine.io-protocol — nguồn cho bảng packet type ở tầng 2. Ngắn (dưới 300 dòng markdown) và bắt buộc đọc một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO protocol spec</span><span class="lc-sub">github.com/socketio/socket.io-protocol — nguồn cho bảng packet type ở tầng 3, kèm định nghĩa ack và binary attachments.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket frame inspection</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — cách mở tab WS, lọc frame, và xem payload trong bảng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 11 — chẩn đoán realtime bug</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng chính bảng packet của bài này ở bước một: có frame <code>42[...]</code> trên dây không?</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Section 0 quiz|||0.4 — Kiểm tra Mục 0',
      slug: 'io-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, chín phút. Về bốn tầng, transport upgrade, long-polling, và ba packet đầu tiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>What Section 0 established</h2>
<p class="lead">Four questions on what Socket.IO actually is, before any code.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO is not WebSocket</span><span class="lz-d">It is engine.io (transport + reconnect + heartbeat) wrapped in a protocol that adds namespaces, rooms, acks and automatic reconnection. A raw WebSocket client cannot talk to a Socket.IO server — the handshake and framing differ.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Long-polling still matters in 2026</span><span class="lz-d">It is the fallback that makes the first connection succeed behind proxies and corporate middleboxes that break WebSocket upgrades. The client starts on polling and upgrades once it knows the upgrade works.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">You can read the wire</span><span class="lz-d">Engine.io packets are prefixed with a single digit (0 open, 2 ping, 3 pong, 4 message), and Socket.IO packets add a second digit (0 connect, 2 event, 3 ack). Three real packets read end to end remove most of the mystery.</span></div>
</div>
<p>4 questions, 8 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Section 0 · Kiểm tra</span>
<h2>Section 0 đã dựng được gì</h2>
<p class="lead">Bốn câu về Socket.IO thực sự là gì, trước khi viết dòng mã nào.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO không phải WebSocket</span><span class="lz-d">Nó là engine.io (transport + reconnect + nhịp tim) bọc trong một giao thức thêm namespace, room, ack và tự động kết nối lại. Một client WebSocket thuần không nói chuyện được với server Socket.IO — bắt tay và cách đóng khung đều khác.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Long-polling vẫn còn quan trọng năm 2026</span><span class="lz-d">Nó là đường lùi giúp kết nối đầu tiên thành công sau những proxy và thiết bị trung gian doanh nghiệp vốn phá vỡ việc nâng cấp WebSocket. Client khởi đầu bằng polling rồi nâng cấp khi biết chắc việc nâng cấp chạy được.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Bạn đọc được đường truyền</span><span class="lz-d">Gói engine.io có một chữ số đứng đầu (0 open, 2 ping, 3 pong, 4 message), và gói Socket.IO thêm một chữ số thứ hai (0 connect, 2 event, 3 ack). Đọc trọn ba gói thật là gỡ bỏ gần hết vẻ bí ẩn.</span></div>
</div>
<p>4 câu, 8 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'You see a raw wire frame <code>42[&quot;chat:message&quot;,{&quot;text&quot;:&quot;hi&quot;}]</code>. Which layer is emitting each digit?|||Bạn thấy một frame thô <code>42[&quot;chat:message&quot;,{&quot;text&quot;:&quot;hi&quot;}]</code>. Mỗi chữ số do tầng nào phát ra?',
            options: [
              'The first &quot;4&quot; is engine.io MESSAGE (layer 2), the second &quot;2&quot; is socket.io EVENT (layer 3), and the JSON array is the layer-4 event name + args|||Số &quot;4&quot; đầu là engine.io MESSAGE (tầng 2), số &quot;2&quot; sau là socket.io EVENT (tầng 3), và mảng JSON là tên event + args ở tầng 4',
              '&quot;42&quot; is a single engine.io packet type meaning &quot;event&quot;|||&quot;42&quot; là một packet type engine.io đơn nghĩa là &quot;event&quot;',
              '&quot;4&quot; is HTTP status meaning success|||&quot;4&quot; là status HTTP nghĩa là thành công',
              '&quot;42&quot; is a socket.io message ID counter|||&quot;42&quot; là bộ đếm ID tin nhắn socket.io',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Config says <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Which transport does the client actually try FIRST?|||Config có <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Client thật sự thử transport nào TRƯỚC?',
            options: [
              'Polling — client always starts with polling regardless of array order, then upgrades to WebSocket if the network allows. The array declares what is PERMITTED, not the order|||Polling — client luôn bắt đầu bằng polling bất kể thứ tự mảng, rồi upgrade lên WebSocket nếu mạng cho phép. Mảng khai báo cái nào ĐƯỢC PHÉP, không phải thứ tự',
              'WebSocket — because it is listed first|||WebSocket — vì nó được liệt kê đầu',
              'Both simultaneously and takes whichever connects first|||Cả hai đồng thời và lấy cái nào kết nối trước',
              'Depends on <code>navigator.connection.type</code>|||Phụ thuộc <code>navigator.connection.type</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see <code>socket.id</code> and <code>socket.conn.id</code> are different values. Which is which?|||Bạn thấy <code>socket.id</code> và <code>socket.conn.id</code> khác giá trị. Cái nào là cái nào?',
            options: [
              '<code>socket.id</code> is the socket.io namespace sid (layer 3), <code>socket.conn.id</code> is the engine.io connection sid (layer 2) — one engine.io connection can host multiple namespaces each with their own sid|||<code>socket.id</code> là sid của namespace socket.io (tầng 3), <code>socket.conn.id</code> là sid của connection engine.io (tầng 2) — một engine.io connection có thể nuôi nhiều namespace, mỗi cái có sid riêng',
              'A bug — they should be equal|||Bug — chúng phải bằng nhau',
              'Both engine.io sids at different points in time|||Cả hai là engine.io sid ở thời điểm khác nhau',
              'Both random UUIDs with no meaning|||Cả hai là UUID ngẫu nhiên không mang nghĩa',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does this repo keep long-polling ENABLED in 2026?|||Vì sao kho này giữ long-polling BẬT trong năm 2026?',
            options: [
              'Because 3-5% of users sit behind corporate proxies that strip <code>Upgrade: websocket</code> headers, and without polling their socket would be dead — a trade of 133× overhead for those users against zero connection for them|||Vì 3-5% người dùng ngồi sau proxy văn phòng strip header <code>Upgrade: websocket</code>, và không có polling thì socket của họ chết — đánh đổi 133× overhead cho những người đó, so với không có kết nối nào',
              'Because WebSocket is deprecated in modern browsers|||Vì WebSocket bị deprecated ở trình duyệt hiện đại',
              'For backward compatibility with old Node.js|||Vì tương thích ngược với Node.js cũ',
              'Because polling is faster than WebSocket in practice|||Vì polling nhanh hơn WebSocket trong thực tế',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A client disconnects. Why does the server think they are still connected for up to 60 seconds?|||Một client mất kết nối. Vì sao server tưởng họ vẫn còn kết nối tới 60 giây?',
            options: [
              'Because engine.io ping/pong is at layer 2 — the server only KNOWS the client is gone when a ping goes unanswered for <code>pingTimeout</code>. This repo sets it to 60s to survive mobile network hiccups; lowering it makes disconnect faster but false-disconnects more|||Vì ping/pong engine.io ở tầng 2 — server chỉ BIẾT client mất khi một ping không được trả lời trong <code>pingTimeout</code>. Kho này đặt 60s để chịu chập chờn 3G/4G; hạ xuống thì disconnect nhanh hơn nhưng false-disconnect nhiều hơn',
              'Because socket.io caches disconnect events|||Vì socket.io cache disconnect events',
              'Because TCP RST takes 60s to propagate|||Vì TCP RST cần 60s để lan',
              'Because the browser sends a delayed disconnect on <code>beforeunload</code>|||Vì trình duyệt gửi disconnect delay trên <code>beforeunload</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to debug &quot;server emitted an event but client never received it&quot;. Where do you look FIRST?|||Bạn muốn debug &quot;server đã emit event nhưng client không bao giờ nhận được&quot;. Bạn nhìn ở đâu TRƯỚC?',
            options: [
              'DevTools → Network → WS tab → click the socket.io connection → Messages. Look for a frame starting <code>42[&quot;event-name&quot;,...]</code>. Present but no handler ran → layer-4 bug. Absent → server never sent it or Redis adapter dropped it in cluster|||DevTools → Network → WS tab → click connection socket.io → Messages. Tìm frame bắt đầu bằng <code>42[&quot;event-name&quot;,...]</code>. Có mà không có handler chạy → bug tầng 4. Không có → server không gửi hoặc Redis adapter bỏ trong cluster',
              'Add <code>console.log</code> in every event handler on both sides|||Thêm <code>console.log</code> vào mọi event handler ở cả hai phía',
              'Restart the dev server|||Khởi động lại dev server',
              'Check <code>navigator.onLine</code>|||Kiểm <code>navigator.onLine</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
