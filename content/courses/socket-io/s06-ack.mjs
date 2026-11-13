import G06_1 from './giang/sio-06-1.mjs';
import G06_2 from './giang/sio-06-2.mjs';
import G06_3 from './giang/sio-06-3.mjs';
import G06_4 from './giang/sio-06-4.mjs';
import G06_5 from './giang/sio-06-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 6: Acks và delivery guarantees.
 * Socket.io mặc định at-most-once (fire and forget). At-least-once cần ack + retry.
 * Exactly-once cần dedupe layer bên trên.
 */

export default {
  title: 'Chapter 6 — Acks and delivery guarantees|||Chương 6 — Ack và bảo đảm giao hàng',
  slug: 'io-ch6-ack',
  description: 'Sáu bài về ba mức delivery guarantee (at-most-once, at-least-once, exactly-once) và cost của mỗi cái. Socket.io mặc định at-most-once — cần chủ động thêm ack + retry để có at-least-once.',
  sortOrder: 7,
  lessons: [

    {
      title: '6.1 — Default is at-most-once: what socket.io does not promise|||6.1 — Mặc định là at-most-once: cái socket.io KHÔNG hứa',
      slug: 'io-6-1-at-most-once',
      type: 'VIDEO',
      description: 'Emit không có ack là fire-and-forget. Nếu client offline lúc packet đến, packet mất. Socket.io mặc định KHÔNG replay (connectionStateRecovery từ 4.6 là tuỳ chọn, cần adapter hỗ trợ).',
      content: `
${G06_1}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Default is at-most-once: what socket.io does not promise</h2>
<p class="lead">Coming from HTTP where response is guaranteed (or you see a timeout error), socket.io feels similar. It is not. <code>emit</code> is fire-and-forget by default — the packet goes into a send buffer and you never hear about it again.</p>

<h3>The measurement</h3>
<pre><code class="language-js">// Server: emit den client, KHONG cho ack
socket.emit('important', { id: 1 });
// packet enqueue vao send buffer engine.io -&gt; kernel TCP send buffer
// neu client offline luc nay, packet mat khi disconnect
// KHONG error tren server. KHONG log.
</code></pre>

<div class="callout warn">
<p><strong>This is at-most-once — not reliability.</strong> The packet either reaches the client or it does not. No guarantee. No exception. The client was offline for a few seconds? The message flew off into space. <strong>Measured:</strong> that is the server → client direction (a 1 s cut lost 10 of 40, <code>emit()</code> returned true 40/40). Client → server is different: while the client <em>knows</em> it is disconnected, emits wait in <code>socket.sendBuffer</code> and are flushed on reconnect (20 buffered, 1 lost at the exact moment of the close) — but in a silent black hole it does not know, and 30 of 40 were lost.</p>
</div>

<h3>Three ways a client &quot;loses&quot; a message</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">a disconnect mid-emit</span><span class="lz-d">The server queues the packet into the TCP send buffer and the disconnect happens 100ms later. The packet is in the buffer BUT the socket is closed — the kernel drops it.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">the client is polling, mid-POST-cycle</span><span class="lz-d">The server holds the packet for the next poll response. The client crashes before the GET poll — the packet dies in server memory, never persisted.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Redis adapter blip</span><span class="lz-d">A broadcast from worker A, a 1ms Redis pub/sub blip, and worker B misses it. Sockets on worker B receive nothing. No replay.</span></div>
</div>

<h3>Why the default is at-most-once</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Cost</span><span class="lz-lnote">At-least-once needs an ack, a retry and a dedupe key. The multiplier: ~2× the traffic, ~10× the code complexity. For realtime UI use cases (presence, typing) that is overkill</span></div>
<div class="lz-layer"><span class="lz-lname">Latency</span><span class="lz-lnote">An ack means a round trip. Realtime UI (cursors, animation) cannot absorb another 100ms per interaction</span></div>
<div class="lz-layer"><span class="lz-lname">Delivery is NOT socket.io's main concern</span><span class="lz-lnote">Socket.io is a realtime transport. If you need &quot;100% delivered&quot;, use an HTTP POST plus a DB write instead of a socket.io emit</span></div>
</div>

<h3>Three kinds of data that suit at-most-once</h3>
<pre><code class="language-text">✓ presence, typing indicators, cursor positions
✓ live scoreboard updates (tin nhat quan trong)
✓ chart tick updates
✓ notifications KHONG critical (them tab, se re-fetch khi mo)

Data mat rai rac cong voi cach tra ra khi user tuong tac -> UX OK
</code></pre>

<h3>Three kinds that do NOT suit at-most-once</h3>
<pre><code class="language-text">✗ chat messages (mat = user complain)
✗ payment confirmation (mat = ke toan sai)
✗ order status update (mat = customer service call)

Data quan trong -> luu DB, dung Bai 6.2 pattern
</code></pre>

<div class="pitfall">
<p><strong>Trap — expecting reliable delivery from socket.io because &quot;the WebSocket underneath guarantees delivery&quot;.</strong> WebSocket's TCP guarantees delivery WITHIN a connection. If the connection breaks, in-flight packets are LOST. WebSocket plus reconnect does NOT replay. This is the number-one misunderstanding among newer developers. <strong>Correction (measured):</strong> that is the <em>default</em>. Since socket.io 4.6, <code>connectionStateRecovery</code> keeps server → client packets with an offset and replays what the client missed (40/40, even after a 4 s black hole; <code>socket.recovered === true</code>). Limits: server → client only, within <code>maxDisconnectionDuration</code> (2 min), and the adapter must support it — the classic <code>@socket.io/redis-adapter</code> this repo uses does not (recovered=false, 10 lost); <code>@socket.io/redis-streams-adapter</code> does.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Socket.io defaults to at-most-once fire-and-forget — a packet sitting in the send buffer at disconnect time is lost, with no exception and no replay — which is right for presence, typing and UI updates but WRONG for chat, payments and order status, where you must deliberately add ack plus retry (lesson 6.2) or use an HTTP POST plus a DB write.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Queue an emit to a client, disconnect it before the packet drains, and confirm the message is simply lost — no exception, no replay.</li>
<li>Classify five features into &quot;at-most-once is fine&quot; (presence, typing, UI updates) versus &quot;needs stronger delivery&quot; (chat, payments, order status).</li>
<li>For one of the strong-delivery cases, sketch how you would add an ack plus retry or route it through an HTTP POST and a DB write.</li>
</ol>
<p><strong>Done when:</strong> you can demonstrate a lost message on disconnect and decide, per feature, whether at-most-once is acceptable.</p></div>

<h3>🔬 Measured: what gets lost, and what does not</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — a server emits 40 numbered messages (one per 100 ms) to room <code>user:1</code>; the client sits behind a tiny TCP proxy that either destroys the connection (a cut) or silently swallows every byte for 4 s (a black hole; <code>pingInterval</code> 1000 / <code>pingTimeout</code> 2000 to keep it short):</p>
<div class="out">$ node mat.mjs dut
0,02 s [server] connection
1,04 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,04 s [client] disconnect: transport close
1,04 s [server] disconnect: transport close
2,04 s [server] connection
2,04 s [client] nối lại
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 30/40 · MẤT 10 (id 11…20) · thứ tự nhận tăng dần
$ node mat.mjs ho
0,02 s [server] connection
1,04 s ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối
4,02 s [client] disconnect: ping timeout
4,02 s [server] disconnect: ping timeout
5,04 s ⚡ mạng về
6,04 s [server] connection
6,04 s [client] nối lại
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 10/40 · MẤT 30 (id 11…40) · thứ tự nhận tăng dần</div>
<p><strong>Client → server</strong> (the client emits 40): a server restart vs a black hole:</p>
<div class="out">$ node khach.mjs sap
1,04 s ⚡ server tắt (deploy)
1,04 s [client] disconnect: transport close · từ giờ emit vào sendBuffer
3,04 s ⚡ server lên lại
3,08 s [client] nối lại · sendBuffer đang giữ 20 tin ⇒ xả lên server
client: gửi 40 · 20 tin gửi lúc ĐÃ BIẾT mất kết nối (vào sendBuffer)
server: nhận 39/40 · MẤT 1 (id 11) · trùng 0
$ node khach.mjs ho
1,04 s ⚡ hố đen 4 s: nuốt byte, KHÔNG đóng
4,02 s [client] disconnect: ping timeout · từ giờ emit vào sendBuffer
5,04 s ⚡ mạng về
5,55 s [client] nối lại · sendBuffer đang giữ 0 tin ⇒ xả lên server
client: gửi 40 · 0 tin gửi lúc ĐÃ BIẾT mất kết nối (vào sendBuffer)
server: nhận 10/40 · MẤT 30 (id 11…40) · trùng 0</div>
<p><strong>connectionStateRecovery</strong> (socket.io ≥ 4.6), alone, after a black hole, and with two Redis adapters (real Redis 7):</p>
<div class="out">$ node mat.mjs csr
0,17 s [server] connection · recovered=false
1,22 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,22 s [client] disconnect: transport close
1,22 s [server] disconnect: transport close
2,29 s [server] connection · recovered=true
2,30 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần
$ node mat.mjs ho-csr
0,02 s [server] connection · recovered=false
1,03 s ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối
4,02 s [client] disconnect: ping timeout
4,02 s [server] disconnect: ping timeout
5,03 s ⚡ mạng về
6,04 s [server] connection · recovered=true
6,04 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần
$ node mat.mjs csr-redis
0,33 s [server] connection · recovered=false
1,35 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,36 s [client] disconnect: transport close
1,36 s [server] disconnect: transport close
2,38 s [server] connection · recovered=false
2,38 s [client] nối lại · socket.recovered=false
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 30/40 · MẤT 10 (id 11…20) · thứ tự nhận tăng dần
$ node mat.mjs csr-streams
0,25 s [server] connection · recovered=false
1,29 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,29 s [server] disconnect: transport close
1,29 s [client] disconnect: transport close
2,31 s [server] connection · recovered=true
2,31 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần</div>
<p><strong>This repo:</strong> recovery is not used, <code>pingTimeout</code> is 60 s (so a black hole can hide for 25 + 60 = 85 s), and chat is sent over HTTP and re-read over REST on every reconnect (<code>batKip</code>) — the socket is the doorbell, the database is the mailbox:</p>
<div class="out">$ grep -rn "connectionStateRecovery" src frontend/src | wc -l ; grep -n "pingTimeout" src/socket/messaging.socket.ts
0
356: pingTimeout: 60000,
$ grep -n "router.post('/threads/:id/messages'" src/routes/messages.routes.ts ; grep -n "async batKip\\|batKip();" frontend/src/store/messagingStore.ts
169:router.post('/threads/:id/messages', async (req: Request, res: Response, next: NextFunction) =&gt; {
1228: async batKip() {
1785: if (daTungNoi) void get().batKip();</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// at-most-once, đo THẬT: server phát 40 tin có id (mỗi 100 ms) tới room user:1; giữa chừng mạng của client gặp sự cố qua một proxy TCP.</span>
<span class="tok-comment">// kieu 'dut'  = mạng đứt hẳn (proxy hủy kết nối) ⇒ client tự nối lại sau ~1 s.</span>
<span class="tok-comment">// kieu 'ho'   = hố đen: proxy nuốt byte im lặng 4 s, không đóng gì (wifi chết, NAT quên) — pingInterval 1000 / pingTimeout 2000 cho nhanh.</span>
<span class="tok-comment">// kieu 'csr'  = như 'dut' nhưng server bật connectionStateRecovery (socket.io ≥ 4.6) · 'ho-csr' = hố đen + recovery</span>
<span class="tok-comment">// kieu 'csr-redis' / 'csr-streams' = recovery + adapter Redis (bản kho dùng) / Redis Streams — Redis thật :19661</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'dut';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

<span class="tok-comment">// proxy 19771 → 19770: 'thong' chuyển byte · 'ho' nuốt byte · huy() đóng mọi đường đang mở</span>
let che = 'thong'; const duong = new Set();
net.createServer((a) =&gt; {
  const b = net.connect(19770); duong.add([a, b]);
  a.on('data', (x) =&gt; che === 'thong' &amp;&amp; b.write(x)); b.on('data', (x) =&gt; che === 'thong' &amp;&amp; a.write(x));
  const dong = () =&gt; { a.destroy(); b.destroy(); }; a.on('error', dong); b.on('error', dong); a.on('close', dong); b.on('close', dong);
}).listen(19771);
const huy = () =&gt; { for (const [a, b] of duong) { a.destroy(); b.destroy(); } duong.clear(); };

const csr = kieu.includes('csr'); const hoDen = kieu.startsWith('ho');
let adapter;
if (kieu.startsWith('csr-')) {
  const { createClient } = await import('redis');
  const pub = createClient({ url: 'redis://127.0.0.1:19661' }); await pub.connect();
  if (kieu === 'csr-redis') { const { createAdapter } = await import('@socket.io/redis-adapter'); const sub = pub.duplicate(); await sub.connect(); adapter = createAdapter(pub, sub); }
  else { const { createAdapter } = await import('@socket.io/redis-streams-adapter'); adapter = createAdapter(pub); }
}
const io = new Server(19770, { pingInterval: 1000, pingTimeout: 2000, ...(csr ? { connectionStateRecovery: {} } : {}), ...(adapter ? { adapter } : {}) });
let loiServer = 0;
io.on('connection', (sk) =&gt; {
  sk.join('user:1');
  console.log(&#96;\${s()} [server] connection\${csr ? &#96; · recovered=\${sk.recovered}&#96; : ''}&#96;);
  sk.on('disconnect', (ly) =&gt; console.log(&#96;\${s()} [server] disconnect: \${ly}&#96;));
  sk.on('error', () =&gt; loiServer++);
});

const c = ketNoi('http://localhost:19771', { transports: ['websocket'], reconnectionDelay: 1000, reconnectionDelayMax: 1000, randomizationFactor: 0 });
const nhan = [];
c.on('important', (m) =&gt; nhan.push(m.id));
c.on('disconnect', (ly) =&gt; console.log(&#96;\${s()} [client] disconnect: \${ly}&#96;));
let lan = 0; c.on('connect', () =&gt; { if (lan++) console.log(&#96;\${s()} [client] nối lại\${csr ? &#96; · socket.recovered=\${c.recovered}&#96; : ''}&#96;); });
await new Promise((r) =&gt; c.once('connect', r));

let traVe = 0;
for (let id = 1; id &lt;= 40; id++) {
  if (id === 11) {
    if (hoDen) { che = 'ho'; console.log(&#96;\${s()} ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối&#96;); setTimeout(() =&gt; { che = 'thong'; huy(); console.log(&#96;\${s()} ⚡ mạng về&#96;); }, 4000); }
    else { huy(); console.log(&#96;\${s()} ⚡ mạng đứt: proxy hủy kết nối TCP&#96;); }
  }
  traVe += io.to('user:1').emit('important', { id }) ? 1 : 0;
  await cho(100);
}
await cho(hoDen ? 3000 : 1500);
const mat = []; for (let id = 1; id &lt;= 40; id++) if (!nhan.includes(id)) mat.push(id);
const day = (a) =&gt; a.length ? (a.length &gt; 2 &amp;&amp; a.at(-1) - a[0] === a.length - 1 ? &#96;\${a[0]}…\${a.at(-1)}&#96; : a.join(',')) : '—';
console.log(&#96;server: phát 40 · emit() trả true \${traVe}/40 · lỗi phía server \${loiServer}&#96;);
console.log(&#96;client: nhận \${nhan.length}/40 · MẤT \${mat.length} (id \${day(mat)}) · thứ tự nhận \${nhan.every((x, i) =&gt; !i || x &gt; nhan[i - 1]) ? 'tăng dần' : 'LỘN'}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire-and-forget, and what it costs</span><span class="lc-sub">What the classic adapter rides on</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Redis · 8.2 — Streams: a log that remembers</span><span class="lc-sub">Why the streams adapter can replay</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-2-3-nat" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 2.3 — NAT, private ranges and Docker networks</span><span class="lc-sub">Where a forgotten flow becomes a black hole</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at-most-once</span><span class="v">The default: deliver zero or one time, never retried.</span></div>
  <div class="kv"><span class="k">Fire-and-forget</span><span class="v">Emit with no acknowledgement and no tracking.</span></div>
  <div class="kv"><span class="k">Send buffer</span><span class="v">Where an outbound packet waits; lost if the socket drops first.</span></div>
  <div class="kv"><span class="k">Delivery guarantee</span><span class="v">The promise (or lack of one) that a message arrives.</span></div>
  <div class="kv"><span class="k">OK to lose</span><span class="v">Presence, typing, UI updates — a dropped one does not matter.</span></div>
  <div class="kv"><span class="k">Must not lose</span><span class="v">Chat, payments, order status — add ack+retry or use HTTP+DB.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Socket.io defaults to at-most-once fire-and-forget.</li><li>A packet sitting in the send buffer at disconnect time is lost — no exception, no replay.</li><li>That is right for presence, typing and UI updates.</li><li>It is wrong for chat, payments and order status.</li><li>For those, deliberately add ack plus retry (6.2) or use an HTTP POST plus a DB write.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Delivery guarantees</span><span class="lc-sub">socket.io/docs/v4/delivery-guarantees — tài liệu chính thức nói thẳng &quot;at-most-once by default&quot;.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 6.2 — ack + retry</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách nâng lên at-least-once.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Mặc định là at-most-once: cái socket.io KHÔNG hứa</h2>
<p class="lead">Đến từ HTTP nơi response được bảo đảm (hoặc bạn thấy timeout error), socket.io cảm giác giống. Không phải. <code>emit</code> mặc định là fire-and-forget — packet vào send buffer và bạn không nghe gì về nó nữa.</p>

<h3>Phép đo</h3>
<pre><code class="language-js">// Server: emit den client, KHONG cho ack
socket.emit('important', { id: 1 });
// packet enqueue vao send buffer engine.io -&gt; kernel TCP send buffer
// neu client offline luc nay, packet mat khi disconnect
// KHONG error tren server. KHONG log.
</code></pre>

<div class="callout warn">
<p><strong>Đây là at-most-once — không phải reliability.</strong> Packet đến client hoặc mất. Không có bảo đảm nào. Không có exception. Client offline vài giây? Message bay vào không gian. <strong>Đo thật:</strong> đó là chiều server → client (đứt 1 s mất 10/40, <code>emit()</code> vẫn trả true 40/40). Chiều client → server khác: khi client <em>biết</em> mình mất kết nối, emit chờ trong <code>socket.sendBuffer</code> và được xả khi nối lại (20 tin đệm, chỉ mất 1 tin ghi đúng lúc đóng) — nhưng trong hố đen im lặng client không biết, mất 30/40.</p>
</div>

<h3>Ba cách client &quot;mất&quot; message</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">disconnect trong lúc emit</span><span class="lz-d">Server enqueue packet vào TCP send buffer, disconnect happens 100ms sau. Packet trong buffer NHƯNG socket đã đóng — packet dropped ở kernel.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">client đang polling, đang giữa POST cycle</span><span class="lz-d">Server hold packet cho poll response tiếp theo. Client crash trước khi GET poll — packet mất trong RAM server, không persist.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Redis adapter blip</span><span class="lz-d">Broadcast từ worker A, Redis pub/sub blip 1ms, worker B miss. Sockets ở worker B không nhận. Không có replay.</span></div>
</div>

<h3>Vì sao default là at-most-once</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Chi phí</span><span class="lz-lnote">At-least-once cần ack + retry + dedupe key. Multiplication cost: ~2× traffic, ~10× code complexity. Cho use cases realtime UI (presence, typing), overkill</span></div>
<div class="lz-layer"><span class="lz-lname">Latency</span><span class="lz-lnote">Ack means round trip. Realtime UI (cursor, animation) không chấp nhận thêm 100ms per interaction</span></div>
<div class="lz-layer"><span class="lz-lname">Delivery không PHẢI concern chính của socket.io</span><span class="lz-lnote">Socket.io là realtime transport. Nếu bạn cần &quot;100% delivered&quot;, dùng HTTP POST + DB persist thay vì socket.io emit</span></div>
</div>

<h3>Ba loại data đúng cho at-most-once</h3>
<pre><code class="language-text">✓ presence, typing indicators, cursor positions
✓ live scoreboard updates (tin nhat quan trong)
✓ chart tick updates
✓ notifications KHONG critical (them tab, se re-fetch khi mo)

Data mat rai rac cong voi cach tra ra khi user tuong tac -> UX OK
</code></pre>

<h3>Ba loại KHÔNG đúng cho at-most-once</h3>
<pre><code class="language-text">✗ chat messages (mat = user complain)
✗ payment confirmation (mat = ke toan sai)
✗ order status update (mat = customer service call)

Data quan trong -> luu DB, dung Bai 6.2 pattern
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — nghĩ socket.io cho reliable delivery vì &quot;WebSocket bên dưới có delivery guarantee&quot;.</strong> WebSocket TCP bảo đảm packet đến TRONG connection. Nếu connection break, packet trong-flight MẤT. WebSocket + reconnect KHÔNG replay. Đây là điểm không hiểu số 1 khi dev mới. <strong>Sửa (đo thật):</strong> đó là <em>mặc định</em>. Từ socket.io 4.6, <code>connectionStateRecovery</code> giữ các packet server → client kèm offset và phát lại phần client đã lỡ (40/40, kể cả sau hố đen 4 s; <code>socket.recovered === true</code>). Giới hạn: chỉ chiều server → client, trong <code>maxDisconnectionDuration</code> (2 phút), và adapter phải hỗ trợ — <code>@socket.io/redis-adapter</code> cổ điển mà kho dùng thì KHÔNG (recovered=false, mất 10); <code>@socket.io/redis-streams-adapter</code> thì có.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.io default là at-most-once fire-and-forget — packet trong send buffer khi disconnect thì mất, không có exception, không có replay — đúng cho presence/typing/UI update nhưng SAI cho chat/payment/order status, phải chủ động thêm ack + retry (bài 6.2) hoặc dùng HTTP POST + DB.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Xếp một emit cho một client, disconnect nó trước khi packet drain, và xác nhận tin đơn giản bị mất — không exception, không replay.</li>
<li>Phân năm tính năng vào &quot;at-most-once là ổn&quot; (presence, typing, UI update) so với &quot;cần giao tin mạnh hơn&quot; (chat, payment, order status).</li>
<li>Với một trong các ca giao-tin-mạnh, phác cách bạn thêm ack + retry hoặc đưa qua một HTTP POST và một DB write.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn minh hoạ được một tin bị mất khi disconnect và quyết, theo từng tính năng, at-most-once có chấp nhận được không.</p></div>

<h3>🔬 Đo thật: cái gì mất, cái gì không</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — server phát 40 tin đánh số (mỗi 100 ms) tới room <code>user:1</code>; client nối qua một proxy TCP nhỏ, proxy hoặc hủy kết nối (mạng đứt) hoặc nuốt im mọi byte trong 4 s (hố đen; <code>pingInterval</code> 1000 / <code>pingTimeout</code> 2000 cho ngắn):</p>
<div class="out">$ node mat.mjs dut
0,02 s [server] connection
1,04 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,04 s [client] disconnect: transport close
1,04 s [server] disconnect: transport close
2,04 s [server] connection
2,04 s [client] nối lại
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 30/40 · MẤT 10 (id 11…20) · thứ tự nhận tăng dần
$ node mat.mjs ho
0,02 s [server] connection
1,04 s ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối
4,02 s [client] disconnect: ping timeout
4,02 s [server] disconnect: ping timeout
5,04 s ⚡ mạng về
6,04 s [server] connection
6,04 s [client] nối lại
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 10/40 · MẤT 30 (id 11…40) · thứ tự nhận tăng dần</div>
<p><strong>Chiều client → server</strong> (client gửi 40 tin): server khởi động lại so với hố đen:</p>
<div class="out">$ node khach.mjs sap
1,04 s ⚡ server tắt (deploy)
1,04 s [client] disconnect: transport close · từ giờ emit vào sendBuffer
3,04 s ⚡ server lên lại
3,08 s [client] nối lại · sendBuffer đang giữ 20 tin ⇒ xả lên server
client: gửi 40 · 20 tin gửi lúc ĐÃ BIẾT mất kết nối (vào sendBuffer)
server: nhận 39/40 · MẤT 1 (id 11) · trùng 0
$ node khach.mjs ho
1,04 s ⚡ hố đen 4 s: nuốt byte, KHÔNG đóng
4,02 s [client] disconnect: ping timeout · từ giờ emit vào sendBuffer
5,04 s ⚡ mạng về
5,55 s [client] nối lại · sendBuffer đang giữ 0 tin ⇒ xả lên server
client: gửi 40 · 0 tin gửi lúc ĐÃ BIẾT mất kết nối (vào sendBuffer)
server: nhận 10/40 · MẤT 30 (id 11…40) · trùng 0</div>
<p><strong>connectionStateRecovery</strong> (socket.io ≥ 4.6), một mình, sau hố đen, và với hai adapter Redis (Redis 7 thật):</p>
<div class="out">$ node mat.mjs csr
0,17 s [server] connection · recovered=false
1,22 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,22 s [client] disconnect: transport close
1,22 s [server] disconnect: transport close
2,29 s [server] connection · recovered=true
2,30 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần
$ node mat.mjs ho-csr
0,02 s [server] connection · recovered=false
1,03 s ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối
4,02 s [client] disconnect: ping timeout
4,02 s [server] disconnect: ping timeout
5,03 s ⚡ mạng về
6,04 s [server] connection · recovered=true
6,04 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần
$ node mat.mjs csr-redis
0,33 s [server] connection · recovered=false
1,35 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,36 s [client] disconnect: transport close
1,36 s [server] disconnect: transport close
2,38 s [server] connection · recovered=false
2,38 s [client] nối lại · socket.recovered=false
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 30/40 · MẤT 10 (id 11…20) · thứ tự nhận tăng dần
$ node mat.mjs csr-streams
0,25 s [server] connection · recovered=false
1,29 s ⚡ mạng đứt: proxy hủy kết nối TCP
1,29 s [server] disconnect: transport close
1,29 s [client] disconnect: transport close
2,31 s [server] connection · recovered=true
2,31 s [client] nối lại · socket.recovered=true
server: phát 40 · emit() trả true 40/40 · lỗi phía server 0
client: nhận 40/40 · MẤT 0 (id —) · thứ tự nhận tăng dần</div>
<p><strong>Kho này:</strong> không dùng recovery, <code>pingTimeout</code> 60 s (hố đen có thể giấu mình 25 + 60 = 85 s), còn tin chat gửi bằng HTTP và đọc lại qua REST mỗi lần nối lại (<code>batKip</code>) — socket là chuông cửa, cơ sở dữ liệu là hộp thư:</p>
<div class="out">$ grep -rn "connectionStateRecovery" src frontend/src | wc -l ; grep -n "pingTimeout" src/socket/messaging.socket.ts
0
356: pingTimeout: 60000,
$ grep -n "router.post('/threads/:id/messages'" src/routes/messages.routes.ts ; grep -n "async batKip\\|batKip();" frontend/src/store/messagingStore.ts
169:router.post('/threads/:id/messages', async (req: Request, res: Response, next: NextFunction) =&gt; {
1228: async batKip() {
1785: if (daTungNoi) void get().batKip();</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// at-most-once, đo THẬT: server phát 40 tin có id (mỗi 100 ms) tới room user:1; giữa chừng mạng của client gặp sự cố qua một proxy TCP.</span>
<span class="tok-comment">// kieu 'dut'  = mạng đứt hẳn (proxy hủy kết nối) ⇒ client tự nối lại sau ~1 s.</span>
<span class="tok-comment">// kieu 'ho'   = hố đen: proxy nuốt byte im lặng 4 s, không đóng gì (wifi chết, NAT quên) — pingInterval 1000 / pingTimeout 2000 cho nhanh.</span>
<span class="tok-comment">// kieu 'csr'  = như 'dut' nhưng server bật connectionStateRecovery (socket.io ≥ 4.6) · 'ho-csr' = hố đen + recovery</span>
<span class="tok-comment">// kieu 'csr-redis' / 'csr-streams' = recovery + adapter Redis (bản kho dùng) / Redis Streams — Redis thật :19661</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'dut';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

<span class="tok-comment">// proxy 19771 → 19770: 'thong' chuyển byte · 'ho' nuốt byte · huy() đóng mọi đường đang mở</span>
let che = 'thong'; const duong = new Set();
net.createServer((a) =&gt; {
  const b = net.connect(19770); duong.add([a, b]);
  a.on('data', (x) =&gt; che === 'thong' &amp;&amp; b.write(x)); b.on('data', (x) =&gt; che === 'thong' &amp;&amp; a.write(x));
  const dong = () =&gt; { a.destroy(); b.destroy(); }; a.on('error', dong); b.on('error', dong); a.on('close', dong); b.on('close', dong);
}).listen(19771);
const huy = () =&gt; { for (const [a, b] of duong) { a.destroy(); b.destroy(); } duong.clear(); };

const csr = kieu.includes('csr'); const hoDen = kieu.startsWith('ho');
let adapter;
if (kieu.startsWith('csr-')) {
  const { createClient } = await import('redis');
  const pub = createClient({ url: 'redis://127.0.0.1:19661' }); await pub.connect();
  if (kieu === 'csr-redis') { const { createAdapter } = await import('@socket.io/redis-adapter'); const sub = pub.duplicate(); await sub.connect(); adapter = createAdapter(pub, sub); }
  else { const { createAdapter } = await import('@socket.io/redis-streams-adapter'); adapter = createAdapter(pub); }
}
const io = new Server(19770, { pingInterval: 1000, pingTimeout: 2000, ...(csr ? { connectionStateRecovery: {} } : {}), ...(adapter ? { adapter } : {}) });
let loiServer = 0;
io.on('connection', (sk) =&gt; {
  sk.join('user:1');
  console.log(&#96;\${s()} [server] connection\${csr ? &#96; · recovered=\${sk.recovered}&#96; : ''}&#96;);
  sk.on('disconnect', (ly) =&gt; console.log(&#96;\${s()} [server] disconnect: \${ly}&#96;));
  sk.on('error', () =&gt; loiServer++);
});

const c = ketNoi('http://localhost:19771', { transports: ['websocket'], reconnectionDelay: 1000, reconnectionDelayMax: 1000, randomizationFactor: 0 });
const nhan = [];
c.on('important', (m) =&gt; nhan.push(m.id));
c.on('disconnect', (ly) =&gt; console.log(&#96;\${s()} [client] disconnect: \${ly}&#96;));
let lan = 0; c.on('connect', () =&gt; { if (lan++) console.log(&#96;\${s()} [client] nối lại\${csr ? &#96; · socket.recovered=\${c.recovered}&#96; : ''}&#96;); });
await new Promise((r) =&gt; c.once('connect', r));

let traVe = 0;
for (let id = 1; id &lt;= 40; id++) {
  if (id === 11) {
    if (hoDen) { che = 'ho'; console.log(&#96;\${s()} ⚡ hố đen: proxy nuốt mọi byte, KHÔNG đóng kết nối&#96;); setTimeout(() =&gt; { che = 'thong'; huy(); console.log(&#96;\${s()} ⚡ mạng về&#96;); }, 4000); }
    else { huy(); console.log(&#96;\${s()} ⚡ mạng đứt: proxy hủy kết nối TCP&#96;); }
  }
  traVe += io.to('user:1').emit('important', { id }) ? 1 : 0;
  await cho(100);
}
await cho(hoDen ? 3000 : 1500);
const mat = []; for (let id = 1; id &lt;= 40; id++) if (!nhan.includes(id)) mat.push(id);
const day = (a) =&gt; a.length ? (a.length &gt; 2 &amp;&amp; a.at(-1) - a[0] === a.length - 1 ? &#96;\${a[0]}…\${a.at(-1)}&#96; : a.join(',')) : '—';
console.log(&#96;server: phát 40 · emit() trả true \${traVe}/40 · lỗi phía server \${loiServer}&#96;);
console.log(&#96;client: nhận \${nhan.length}/40 · MẤT \${mat.length} (id \${day(mat)}) · thứ tự nhận \${nhan.every((x, i) =&gt; !i || x &gt; nhan[i - 1]) ? 'tăng dần' : 'LỘN'}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Thứ adapter cổ điển dựa vào</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Redis · 8.2 — Stream: cuốn nhật ký biết nhớ</span><span class="lc-sub">Vì sao streams adapter phát lại được</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-2-3-nat" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 2.3 — NAT, dải IP riêng và mạng Docker</span><span class="lc-sub">Chỗ một luồng bị quên thành hố đen</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at-most-once</span><span class="v">Mặc định: giao không hoặc một lần, không bao giờ thử lại.</span></div>
  <div class="kv"><span class="k">Fire-and-forget</span><span class="v">Emit không ack và không theo dõi.</span></div>
  <div class="kv"><span class="k">Send buffer</span><span class="v">Nơi một packet đi chờ; mất nếu socket rớt trước.</span></div>
  <div class="kv"><span class="k">Bảo đảm giao tin</span><span class="v">Lời hứa (hay thiếu nó) rằng một tin tới nơi.</span></div>
  <div class="kv"><span class="k">Mất được</span><span class="v">Presence, typing, UI update — rớt một cái không sao.</span></div>
  <div class="kv"><span class="k">Không được mất</span><span class="v">Chat, payment, order status — thêm ack+retry hoặc dùng HTTP+DB.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Socket.io mặc định at-most-once fire-and-forget.</li><li>Một packet đang trong send buffer lúc disconnect thì mất — không exception, không replay.</li><li>Điều đó đúng cho presence, typing và UI update.</li><li>Nó sai cho chat, payment và order status.</li><li>Với những cái đó, chủ động thêm ack + retry (6.2) hoặc dùng một HTTP POST cộng một DB write.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Delivery guarantees</span><span class="lc-sub">socket.io/docs/v4/delivery-guarantees — tài liệu chính thức nói thẳng &quot;at-most-once by default&quot;.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 6.2 — ack + retry</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách nâng lên at-least-once.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — At-least-once with ack + retry|||6.2 — At-least-once bằng ack + retry',
      slug: 'io-6-2-ack-retry',
      type: 'VIDEO',
      description: 'Emit có callback + timeout + retry. Duplicate delivery là chấp nhận được — dedupe bằng messageId ở client.',
      content: `
${G06_2}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>At-least-once with ack + retry</h2>
<p class="lead">Ack is socket.io&#39;s built-in mechanism for &quot;did it arrive?&quot;. Combined with a retry loop and a deduplication key, you have at-least-once delivery — the best guarantee socket.io itself can offer.</p>

<h3>Basic ack pattern</h3>
<pre><code class="language-ts">// Client — emit voi timeout va ack callback
try {
  const response = await socket.timeout(3000).emitWithAck('chat:send', {
    threadId, text, messageId: uuid(),
  });
  markSent(messageId);
} catch (err) {
  // Timeout hoac disconnect
  scheduleRetry(messageId);
}

// Server
socket.on('chat:send', async (data, ack) =&gt; {
  const msg = await prisma.message.create({ data });
  ack({ ok: true, id: msg.id });      // BAT BUOC goi ack, khong client se timeout
});
</code></pre>

<h3>A retry loop with a dedup key</h3>
<pre><code class="language-ts">async function sendWithRetry(msg: { messageId: string; text: string }) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt &lt;= maxAttempts; attempt++) {
    try {
      await socket.timeout(3000).emitWithAck('chat:send', msg);
      return; // success
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await sleep(attempt * 1000);   // 1s, 2s, 3s backoff
    }
  }
}
</code></pre>

<h3>Why the <code>messageId</code> critical</h3>
<pre><code class="language-ts">// Kich ban: client emit -&gt; server persist -&gt; ack timeout tren network path
// Client retry -&gt; server persist LAI -&gt; message trung
// Dedup: server check messageId truoc khi persist

socket.on('chat:send', async (data, ack) =&gt; {
  const existing = await prisma.message.findUnique({ where: { messageId: data.messageId } });
  if (existing) {
    ack({ ok: true, id: existing.id, duplicate: true });
    return;
  }
  const msg = await prisma.message.create({ data: { ...data, messageId: data.messageId } });
  ack({ ok: true, id: msg.id });
});
</code></pre>

<div class="callout ok">
<p><strong>Client generate <code>messageId</code> (a UUID) is created by the sender.</strong> The server does not generate it — if it did, every retry would be a new message and dedup would be impossible. The client generates the ID once and keeps it across every retry.</p>
</div>

<h3>Server-to-client ack — reverse direction</h3>
<pre><code class="language-ts">// Server emit ban notification, cho client ack &quot;received&quot;
io.to(&#96;user:\${userId}&#96;).timeout(5000).emit('notification:new', { id, text }, (err, responses) =&gt; {
  if (err) {
    // Client offline hoac chua ack
    saveForLater(userId, notification);
  } else {
    // responses la array — mot ack per socket cua user
    markDelivered(id, responses.map(r =&gt; r.socketId));
  }
});
</code></pre>

<h3>Cost analysis</h3>
<div class="out">Overhead so voi fire-and-forget:
  1. Extra round trip: +50-200ms latency
  2. Client PHAI reply ack: +CPU + 1 packet each
  3. Server PHAI track pending ack: memory Map&lt;messageId, timer&gt;
  4. Retry logic: potentially 2-3x more send events on flaky network
  5. Dedup query: +DB round trip per receive (or Redis SETNX)

Kho nay: chi dung ack cho chat:send. Presence, typing khong.
[do that 13/11: SAI — &quot;chat:send&quot; xuat hien 0 lan, emitWithAck 0 lan; chat gui bang HTTP POST /threads/:id/messages]
</div>

<div class="pitfall">
<p><strong>Trap — forgetting to call <code>ack</code> in the server handler.</strong> The client waits out the timeout (3 s in the code above — <strong>socket.io has no default ack timeout</strong>: measured, an <code>emitWithAck</code> without <code>.timeout()</code> was still waiting after 8 s, and only rejected with “socket has been disconnected” when the server closed) and retries. You assume the client is buggy; in fact the server never acked. The rule: every <code>emitWithAck</code> on the client MUST have a matching <code>ack(...)</code> on the server, even when the payload is empty. A missing ack is the number-one bug with this pattern.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> At-least-once trong socket.io = <code>emitWithAck</code> plus a timeout plus a backoff retry loop plus a client-generated <code>messageId</code> for server-side dedup — the cost is +50-200ms of latency plus the memory to track pending acks, so use it only for data that matters (chat, payments, orders), NOT for realtime UI updates.</p>
</div>

<h3>At-least-once, and the duplicate it guarantees</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Send, and wait for the ack</span><span class="lz-d">The ack proves the server received it. No ack within the timeout means <em>unknown</em>, not <em>failed</em>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Retry on timeout</span><span class="lz-d">Which is why delivery is at-least-once: the first attempt may have arrived and only the ack was lost.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So the receiver must deduplicate</span><span class="lz-d">A client-generated id on the message, and a set of ids already processed. Without it, a retry is a second message in the room.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cap the retries, then surface the failure</span><span class="lz-d">An unbounded retry loop against a down server is a queue that grows until the tab is closed.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — treating a missing ack as proof the message was not delivered.</strong> The ack travels back over the same connection that just proved unreliable, so its absence tells you nothing about the outbound half: the message may have arrived, been stored, and triggered a notification, with only the acknowledgement lost. Retrying is correct — and it means the operation happens twice unless the receiver deduplicates. Any handler behind an acked event must be idempotent: keyed inserts, a processed-id set, or an upsert. Getting this wrong produces the classic report of a chat message that appears twice, only on a flaky network.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Send a message with <code>emitWithAck</code> and a timeout; on timeout, retry with backoff — note the delivery is now at-least-once, so a duplicate is possible.</li>
<li>Attach a client-generated <code>messageId</code> and deduplicate on the server so the retry does not create a second message.</li>
<li>Cap the retries and surface a failure to the user instead of looping forever against a down server.</li>
</ol>
<p><strong>Done when:</strong> a lost-ack retry no longer duplicates the message, and your retry loop is bounded.</p></div>

<h3>🔬 Measured: the retry loop above, run as written</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 — <code>ack.mjs</code> copies <code>sendWithRetry</code> from this page (timeout 3000 ms, 3 attempts, pause attempt × 1000 ms); the server writes to a real table with <strong>no</strong> UNIQUE constraint. First the server forgets <code>ack()</code>; then it acks only after a 3.5 s database write:</p>
<div class="out">$ node ack.mjs thieu
0,05 s [client] lần 1: emitWithAck
0,05 s [server] nhận chat:send (messageId …bd9c)
3,06 s [client] lần 1: operation has timed out
4,06 s [client] lần 2: emitWithAck
4,06 s [server] nhận chat:send (messageId …bd9c)
7,06 s [client] lần 2: operation has timed out
9,06 s [client] lần 3: emitWithAck
9,06 s [server] nhận chat:send (messageId …bd9c)
12,06 s [client] lần 3: operation has timed out
12,06 s [client] BỎ CUỘC: operation has timed out
bảng tin: 3 dòng cho 1 messageId ⇒ TRÙNG 2
$ node ack.mjs cham
0,05 s [client] lần 1: emitWithAck
0,05 s [server] nhận chat:send (messageId …8c28)
3,05 s [client] lần 1: operation has timed out
3,58 s [server] đã ghi id 1 ⇒ ack
4,05 s [client] lần 2: emitWithAck
4,05 s [server] nhận chat:send (messageId …8c28)
7,05 s [client] lần 2: operation has timed out
7,57 s [server] đã ghi id 2 ⇒ ack
9,06 s [client] lần 3: emitWithAck
9,06 s [server] nhận chat:send (messageId …8c28)
12,06 s [client] lần 3: operation has timed out
12,06 s [client] BỎ CUỘC: operation has timed out
12,58 s [server] đã ghi id 3 ⇒ ack
bảng tin: 3 dòng cho 1 messageId ⇒ TRÙNG 2</div>
<p>Every attempt was stored, every late ack was silently dropped by the client, and the user was told it failed. <strong>Dedupe by <code>messageId</code></strong> exactly like the code above (look it up, then insert) — database 3.5 s, then 5 s:</p>
<div class="out">$ node ack.mjs kiem35
0,06 s [client] lần 1: emitWithAck
0,06 s [server] nhận chat:send (messageId …8d65)
3,06 s [client] lần 1: operation has timed out
3,57 s [server] đã ghi id 1 ⇒ ack
4,06 s [client] lần 2: emitWithAck
4,06 s [server] nhận chat:send (messageId …8d65)
4,06 s [server] trùng messageId ⇒ trả id cũ 1
4,06 s [client] ack {"ok":true,"id":1,"duplicate":true}
bảng tin: 1 dòng cho 1 messageId
$ node ack.mjs kiem5
0,07 s [client] lần 1: emitWithAck
0,07 s [server] nhận chat:send (messageId …df34)
3,07 s [client] lần 1: operation has timed out
4,07 s [client] lần 2: emitWithAck
4,07 s [server] nhận chat:send (messageId …df34)
5,08 s [server] đã ghi id 1 ⇒ ack
7,08 s [client] lần 2: operation has timed out
9,08 s [client] lần 3: emitWithAck
9,08 s [server] nhận chat:send (messageId …df34)
9,08 s [server] trùng messageId ⇒ trả id cũ 1
9,08 s [client] ack {"ok":true,"id":1,"duplicate":true}
9,10 s [server] đã ghi id 2 ⇒ ack
bảng tin: 2 dòng cho 1 messageId ⇒ TRÙNG 1</div>
<p>At 5 s the retry arrives while the first insert is still running: both lookups find nothing ⇒ two rows. Check-then-insert is a race; a UNIQUE constraint is not (lesson 6.3).</p>
<p><strong>The built-in client option</strong> <code>{ retries, ackTimeout }</code> (socket.io ≥ 4.6), and the cost of acks over a ~100 ms round trip (a TCP proxy holds every chunk 50 ms each way):</p>
<div class="out">$ node tudong.mjs
— phần 1: retries: 3, ackTimeout: 1000 —
  [server] nhận "chào Nam" lần 1 ⇒ ack sau 1,5 s
  [server] nhận "chào Nam" lần 2 ⇒ ack ngay
  [client] ack {"ok":true} sau 1022 ms · server đã nhận 2 lần
  sau 1,7 s nữa: server nhận tổng 2 lần cho MỘT lần gọi emitWithAck
— phần 2: 20 tin, RTT ~100 ms —
  emit không ack (bắn rồi quên)                   52 ms
  await emitWithAck từng tin một                2083 ms
  Promise.all 20 × emitWithAck (song song)       107 ms
  tuỳ chọn retries: 3 (hàng đợi, song song)     2078 ms</div>
<p>With <code>retries</code> set, the client queues emits and sends the next one only after the previous is acked — order is kept, throughput is not. And there is no default deadline:</p>
<div class="out">$ node macdinh.mjs
sau 8 s, không .timeout(): VẪN CHỜ
server đóng ⇒ reject: socket has been disconnected · sau 8006 ms</div>
<p><strong>This repo</strong> — no <code>chat:send</code> at all; acks with a timeout but without retries:</p>
<div class="out">$ grep -rn "chat:send" src frontend/src | wc -l ; grep -rn "emitWithAck" src frontend/src | wc -l
0
0
$ grep -n "HET_GIO = \\|s.timeout(HET_GIO)" frontend/src/lib/doiKhang/client.ts ; grep -c "ack?: Ack" src/socket/work.socket.ts
160:const HET_GIO = 6000;
171: s.timeout(HET_GIO).emit(ten, duLieu, (err: Error | null, res: Ack | undefined) =&gt; {
3
$ grep -n "async sendMessage(threadId\\|Roll back the optimistic" frontend/src/store/messagingStore.ts
970: async sendMessage(threadId, content, fileIds, parentMessageId, postShare, media) {
1052: // Roll back the optimistic insert</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// at-least-once bằng ack + retry, đo THẬT trên Postgres thật (container sio-pg :19660). Client gửi một tin chat bằng sendWithRetry y như bài web:</span>
<span class="tok-comment">// timeout 3000 ms, tối đa 3 lần, nghỉ attempt × 1000 ms. Server ghi vào bảng tin (KHÔNG có ràng buộc UNIQUE) — pg_sleep giả một DB chậm.</span>
<span class="tok-comment">// kieu 'thieu'  = server quên gọi ack            · 'cham' = server ghi xong mới ack, mất 3,5 s</span>
<span class="tok-comment">// kieu 'kiem35' = 'cham' + kiểm messageId trước khi ghi (findUnique rồi create như bài web)</span>
<span class="tok-comment">// kieu 'kiem5'  = như 'kiem35' nhưng DB chậm 5 s ⇒ lần thử lại tới khi lần đầu CHƯA ghi xong</span>
import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'cham';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 4 });
await db.query('DROP TABLE IF EXISTS tin; CREATE TABLE tin (id serial PRIMARY KEY, message_id uuid, noi_dung text, luc timestamptz DEFAULT now())');
const tre = kieu === 'kiem5' ? 5 : 3.5;

const io = new Server(19774);
io.on('connection', (sk) =&gt; sk.on('chat:send', async (data, ack) =&gt; {
  console.log(&#96;\${s()} [server] nhận chat:send (messageId …\${data.messageId.slice(-4)})&#96;);
  if (kieu === 'thieu') { await db.query('INSERT INTO tin (message_id, noi_dung) VALUES ($1, $2)', [data.messageId, data.text]); return; } // quên ack(...)
  if (kieu.startsWith('kiem')) {
    const { rows } = await db.query('SELECT id FROM tin WHERE message_id = $1', [data.messageId]);
    if (rows.length) { console.log(&#96;\${s()} [server] trùng messageId ⇒ trả id cũ \${rows[0].id}&#96;); return ack({ ok: true, id: rows[0].id, duplicate: true }); }
  }
  await db.query(&#96;SELECT pg_sleep(\${tre})&#96;);                     <span class="tok-comment">  // DB chậm</span>
  const r = (await db.query('INSERT INTO tin (message_id, noi_dung) VALUES ($1, $2) RETURNING id', [data.messageId, data.text])).rows[0];
  console.log(&#96;\${s()} [server] đã ghi id \${r.id} ⇒ ack&#96;);
  ack({ ok: true, id: r.id });
}));

const socket = ketNoi('http://localhost:19774', { transports: ['websocket'] });
await new Promise((r) =&gt; socket.once('connect', r));
async function sendWithRetry(msg) {            <span class="tok-comment">  // chép nguyên bài web 6.2</span>
  const maxAttempts = 3;
  for (let attempt = 1; attempt &lt;= maxAttempts; attempt++) {
    try {
      console.log(&#96;\${s()} [client] lần \${attempt}: emitWithAck&#96;);
      const res = await socket.timeout(3000).emitWithAck('chat:send', msg);
      console.log(&#96;\${s()} [client] ack \${JSON.stringify(res)}&#96;);
      return res;
    } catch (err) {
      console.log(&#96;\${s()} [client] lần \${attempt}: \${err.message}&#96;);
      if (attempt === maxAttempts) throw err;
      await cho(attempt * 1000);
    }
  }
}
await sendWithRetry({ messageId: randomUUID(), text: 'chào Nam' }).catch((e) =&gt; console.log(&#96;\${s()} [client] BỎ CUỘC: \${e.message}&#96;));
await cho(kieu === 'thieu' ? 500 : 6000);     <span class="tok-comment">  // chờ các lần ghi muộn của server</span>
const { rows } = await db.query('SELECT count(*)::int AS n, count(DISTINCT message_id)::int AS k FROM tin');
console.log(&#96;bảng tin: \${rows[0].n} dòng cho \${rows[0].k} messageId\${rows[0].n &gt; rows[0].k ? &#96; ⇒ TRÙNG \${rows[0].n - rows[0].k}&#96; : ''}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Failure: retries, backoff, and the charge that ran three times</span><span class="lc-sub">The same trap on the HTTP side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-14-2-api-that" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 14.2 — Real APIs: timeouts, retries, offline, idempotency</span><span class="lc-sub">The UI half: what to show while unsure</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, connection pools and timeouts in your code</span><span class="lc-sub">How to pick the 3 s</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at-least-once</span><span class="v">Deliver one or more times; the retry can cause a duplicate.</span></div>
  <div class="kv"><span class="k"><code>emitWithAck</code></span><span class="v">Emit and await the server's acknowledgement.</span></div>
  <div class="kv"><span class="k">Timeout + backoff</span><span class="v">Retry after no ack, spacing attempts out.</span></div>
  <div class="kv"><span class="k"><code>messageId</code></span><span class="v">A client-generated id so the server can deduplicate.</span></div>
  <div class="kv"><span class="k">Idempotent handler</span><span class="v">A handler safe to run twice (keyed insert, processed-id set, upsert).</span></div>
  <div class="kv"><span class="k">Missing ack ≠ not delivered</span><span class="v">The ack may be lost though the message arrived.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>At-least-once is <code>emitWithAck</code> plus a timeout plus a backoff retry loop.</li><li>Add a client-generated <code>messageId</code> so the server can deduplicate.</li><li>A missing ack means <em>unknown</em>, not <em>failed</em> — so a retry may duplicate.</li><li>Every handler behind an acked event must be idempotent.</li><li>The cost is +50-200ms latency and pending-ack memory — use it only for data that matters.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Acknowledgements</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#acknowledgements — API chuẩn và ví dụ emitWithAck.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>At-least-once bằng ack + retry</h2>
<p class="lead">Ack là cơ chế built-in của socket.io cho &quot;có đến không?&quot;. Kết hợp với retry loop và dedup key, bạn có at-least-once delivery — bảo đảm tốt nhất mà socket.io tự đưa được.</p>

<h3>Pattern ack cơ bản</h3>
<pre><code class="language-ts">// Client — emit voi timeout va ack callback
try {
  const response = await socket.timeout(3000).emitWithAck('chat:send', {
    threadId, text, messageId: uuid(),
  });
  markSent(messageId);
} catch (err) {
  // Timeout hoac disconnect
  scheduleRetry(messageId);
}

// Server
socket.on('chat:send', async (data, ack) =&gt; {
  const msg = await prisma.message.create({ data });
  ack({ ok: true, id: msg.id });      // BAT BUOC goi ack, khong client se timeout
});
</code></pre>

<h3>Retry loop với dedup key</h3>
<pre><code class="language-ts">async function sendWithRetry(msg: { messageId: string; text: string }) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt &lt;= maxAttempts; attempt++) {
    try {
      await socket.timeout(3000).emitWithAck('chat:send', msg);
      return; // success
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await sleep(attempt * 1000);   // 1s, 2s, 3s backoff
    }
  }
}
</code></pre>

<h3>Vì sao <code>messageId</code> critical</h3>
<pre><code class="language-ts">// Kich ban: client emit -&gt; server persist -&gt; ack timeout tren network path
// Client retry -&gt; server persist LAI -&gt; message trung
// Dedup: server check messageId truoc khi persist

socket.on('chat:send', async (data, ack) =&gt; {
  const existing = await prisma.message.findUnique({ where: { messageId: data.messageId } });
  if (existing) {
    ack({ ok: true, id: existing.id, duplicate: true });
    return;
  }
  const msg = await prisma.message.create({ data: { ...data, messageId: data.messageId } });
  ack({ ok: true, id: msg.id });
});
</code></pre>

<div class="callout ok">
<p><strong>Client generate <code>messageId</code> (UUID) ở gửi.</strong> Server không tự tạo — nếu tạo, retry là message mới (không dedup được). Client tạo ID lần đầu và giữ nó qua mọi retry.</p>
</div>

<h3>Server-to-client ack — ngược chiều</h3>
<pre><code class="language-ts">// Server emit ban notification, cho client ack &quot;received&quot;
io.to(&#96;user:\${userId}&#96;).timeout(5000).emit('notification:new', { id, text }, (err, responses) =&gt; {
  if (err) {
    // Client offline hoac chua ack
    saveForLater(userId, notification);
  } else {
    // responses la array — mot ack per socket cua user
    markDelivered(id, responses.map(r =&gt; r.socketId));
  }
});
</code></pre>

<h3>Phân tích cost</h3>
<div class="out">Overhead so voi fire-and-forget:
  1. Extra round trip: +50-200ms latency
  2. Client PHAI reply ack: +CPU + 1 packet each
  3. Server PHAI track pending ack: memory Map&lt;messageId, timer&gt;
  4. Retry logic: potentially 2-3x more send events on flaky network
  5. Dedup query: +DB round trip per receive (or Redis SETNX)

Kho nay: chi dung ack cho chat:send. Presence, typing khong.
[do that 13/11: SAI — &quot;chat:send&quot; xuat hien 0 lan, emitWithAck 0 lan; chat gui bang HTTP POST /threads/:id/messages]
</div>

<div class="pitfall">
<p><strong>Bẫy — quên gọi <code>ack</code> ở server handler.</strong> Client chờ hết timeout (3 s trong đoạn mã trên — <strong>socket.io KHÔNG có hạn chờ ack mặc định</strong>: đo thật, <code>emitWithAck</code> không kèm <code>.timeout()</code> sau 8 s vẫn chờ, chỉ bị từ chối “socket has been disconnected” khi server đóng), rồi retry. Bạn tưởng client bug, thật ra server không ack. Rule: mọi <code>emitWithAck</code> phía client PHẢI có <code>ack(...)</code> phía server, ngay cả khi payload trống. Missing ack là bug số 1 với ack pattern.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> At-least-once trong socket.io = <code>emitWithAck</code> + timeout + retry loop với backoff + client-generated <code>messageId</code> để dedup ở server — cost là +50-200ms latency + memory tracking pending acks, chỉ dùng cho data quan trọng (chat/payment/order), KHÔNG cho realtime UI updates.</p>
</div>

<h3>At-least-once, và bản sao mà nó bảo đảm sẽ có</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gửi đi, rồi chờ ack</span><span class="lz-d">Cái ack chứng minh máy chủ đã nhận được. Không có ack trong thời gian chờ nghĩa là <em>không biết</em>, chứ không phải <em>đã hỏng</em>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Thử lại khi hết giờ</span><span class="lz-d">Và đó là lý do việc giao nhận là ít-nhất-một-lần: lần thử đầu có thể đã tới nơi và chỉ có cái ack là bị mất.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nên bên nhận PHẢI khử trùng lặp</span><span class="lz-d">Một id do client sinh ra gắn vào thông điệp, cộng một tập các id đã xử lý. Không có nó, một lần thử lại là một thông điệp thứ hai trong phòng.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chặn số lần thử lại, rồi báo cú hỏng ra</span><span class="lz-d">Một vòng lặp thử lại không giới hạn nhắm vào một máy chủ đang chết là một hàng đợi phình lên cho tới khi tab bị đóng.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — coi việc thiếu ack là bằng chứng rằng thông điệp chưa được giao.</strong> Cái ack đi ngược về trên đúng cái kết nối vừa chứng tỏ là không đáng tin, nên việc nó vắng mặt chẳng nói gì với bạn về nửa chiều đi: thông điệp có thể đã tới nơi, đã được lưu, và đã kích hoạt một thông báo, chỉ có mỗi cái xác nhận là bị mất. Thử lại là đúng — và điều đó nghĩa là thao tác xảy ra hai lần trừ khi bên nhận có khử trùng lặp. Mọi handler nằm sau một sự kiện có ack đều phải lặp-lại-vô-hại: chèn theo khoá, một tập id đã xử lý, hoặc một phép upsert. Làm sai chỗ này sẽ sinh ra cái báo cáo kinh điển về một tin nhắn chat hiện ra hai lần, và chỉ hiện trên mạng chập chờn.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gửi một tin bằng <code>emitWithAck</code> và một timeout; khi timeout, retry với backoff — để ý giao tin giờ là at-least-once, nên có thể trùng.</li>
<li>Gắn một <code>messageId</code> do client tạo và dedup ở server để retry không tạo tin thứ hai.</li>
<li>Chặn số retry và báo lỗi cho user thay vì lặp mãi với một server đã chết.</li>
</ol>
<p><strong>Đạt khi:</strong> một retry do mất ack không còn làm trùng tin, và vòng retry của bạn có chặn.</p></div>

<h3>🔬 Đo thật: vòng thử lại ở trên, chạy y nguyên</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 — <code>ack.mjs</code> chép <code>sendWithRetry</code> của chính bài này (timeout 3000 ms, 3 lần, nghỉ attempt × 1000 ms); server ghi vào một bảng thật <strong>không</strong> có ràng buộc UNIQUE. Lượt đầu server quên <code>ack()</code>; lượt sau server chỉ ack sau khi ghi DB mất 3,5 s:</p>
<div class="out">$ node ack.mjs thieu
0,05 s [client] lần 1: emitWithAck
0,05 s [server] nhận chat:send (messageId …bd9c)
3,06 s [client] lần 1: operation has timed out
4,06 s [client] lần 2: emitWithAck
4,06 s [server] nhận chat:send (messageId …bd9c)
7,06 s [client] lần 2: operation has timed out
9,06 s [client] lần 3: emitWithAck
9,06 s [server] nhận chat:send (messageId …bd9c)
12,06 s [client] lần 3: operation has timed out
12,06 s [client] BỎ CUỘC: operation has timed out
bảng tin: 3 dòng cho 1 messageId ⇒ TRÙNG 2
$ node ack.mjs cham
0,05 s [client] lần 1: emitWithAck
0,05 s [server] nhận chat:send (messageId …8c28)
3,05 s [client] lần 1: operation has timed out
3,58 s [server] đã ghi id 1 ⇒ ack
4,05 s [client] lần 2: emitWithAck
4,05 s [server] nhận chat:send (messageId …8c28)
7,05 s [client] lần 2: operation has timed out
7,57 s [server] đã ghi id 2 ⇒ ack
9,06 s [client] lần 3: emitWithAck
9,06 s [server] nhận chat:send (messageId …8c28)
12,06 s [client] lần 3: operation has timed out
12,06 s [client] BỎ CUỘC: operation has timed out
12,58 s [server] đã ghi id 3 ⇒ ack
bảng tin: 3 dòng cho 1 messageId ⇒ TRÙNG 2</div>
<p>Lần nào cũng được lưu, ack tới muộn bị client lặng lẽ bỏ, và người dùng được báo là thất bại. <strong>Khử trùng bằng <code>messageId</code></strong> đúng như đoạn mã trên (tìm trước, rồi ghi) — DB 3,5 s, rồi 5 s:</p>
<div class="out">$ node ack.mjs kiem35
0,06 s [client] lần 1: emitWithAck
0,06 s [server] nhận chat:send (messageId …8d65)
3,06 s [client] lần 1: operation has timed out
3,57 s [server] đã ghi id 1 ⇒ ack
4,06 s [client] lần 2: emitWithAck
4,06 s [server] nhận chat:send (messageId …8d65)
4,06 s [server] trùng messageId ⇒ trả id cũ 1
4,06 s [client] ack {"ok":true,"id":1,"duplicate":true}
bảng tin: 1 dòng cho 1 messageId
$ node ack.mjs kiem5
0,07 s [client] lần 1: emitWithAck
0,07 s [server] nhận chat:send (messageId …df34)
3,07 s [client] lần 1: operation has timed out
4,07 s [client] lần 2: emitWithAck
4,07 s [server] nhận chat:send (messageId …df34)
5,08 s [server] đã ghi id 1 ⇒ ack
7,08 s [client] lần 2: operation has timed out
9,08 s [client] lần 3: emitWithAck
9,08 s [server] nhận chat:send (messageId …df34)
9,08 s [server] trùng messageId ⇒ trả id cũ 1
9,08 s [client] ack {"ok":true,"id":1,"duplicate":true}
9,10 s [server] đã ghi id 2 ⇒ ack
bảng tin: 2 dòng cho 1 messageId ⇒ TRÙNG 1</div>
<p>Ở 5 s, lần thử lại tới khi lần ghi đầu còn đang chạy: cả hai lần tìm đều không thấy ⇒ hai dòng. Kiểm-rồi-ghi là một cuộc đua; ràng buộc UNIQUE thì không (bài 6.3).</p>
<p><strong>Tuỳ chọn có sẵn của client</strong> <code>{ retries, ackTimeout }</code> (socket.io ≥ 4.6), và cái giá của ack qua đường đi-về ~100 ms (proxy TCP giữ mỗi mẩu 50 ms mỗi chiều):</p>
<div class="out">$ node tudong.mjs
— phần 1: retries: 3, ackTimeout: 1000 —
  [server] nhận "chào Nam" lần 1 ⇒ ack sau 1,5 s
  [server] nhận "chào Nam" lần 2 ⇒ ack ngay
  [client] ack {"ok":true} sau 1022 ms · server đã nhận 2 lần
  sau 1,7 s nữa: server nhận tổng 2 lần cho MỘT lần gọi emitWithAck
— phần 2: 20 tin, RTT ~100 ms —
  emit không ack (bắn rồi quên)                   52 ms
  await emitWithAck từng tin một                2083 ms
  Promise.all 20 × emitWithAck (song song)       107 ms
  tuỳ chọn retries: 3 (hàng đợi, song song)     2078 ms</div>
<p>Bật <code>retries</code> thì client xếp hàng các emit, tin sau chỉ đi khi tin trước có ack — giữ được thứ tự, mất tốc độ. Và không có hạn chờ mặc định:</p>
<div class="out">$ node macdinh.mjs
sau 8 s, không .timeout(): VẪN CHỜ
server đóng ⇒ reject: socket has been disconnected · sau 8006 ms</div>
<p><strong>Kho này</strong> — không có <code>chat:send</code> nào; có ack kèm timeout nhưng không thử lại:</p>
<div class="out">$ grep -rn "chat:send" src frontend/src | wc -l ; grep -rn "emitWithAck" src frontend/src | wc -l
0
0
$ grep -n "HET_GIO = \\|s.timeout(HET_GIO)" frontend/src/lib/doiKhang/client.ts ; grep -c "ack?: Ack" src/socket/work.socket.ts
160:const HET_GIO = 6000;
171: s.timeout(HET_GIO).emit(ten, duLieu, (err: Error | null, res: Ack | undefined) =&gt; {
3
$ grep -n "async sendMessage(threadId\\|Roll back the optimistic" frontend/src/store/messagingStore.ts
970: async sendMessage(threadId, content, fileIds, parentMessageId, postShare, media) {
1052: // Roll back the optimistic insert</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// at-least-once bằng ack + retry, đo THẬT trên Postgres thật (container sio-pg :19660). Client gửi một tin chat bằng sendWithRetry y như bài web:</span>
<span class="tok-comment">// timeout 3000 ms, tối đa 3 lần, nghỉ attempt × 1000 ms. Server ghi vào bảng tin (KHÔNG có ràng buộc UNIQUE) — pg_sleep giả một DB chậm.</span>
<span class="tok-comment">// kieu 'thieu'  = server quên gọi ack            · 'cham' = server ghi xong mới ack, mất 3,5 s</span>
<span class="tok-comment">// kieu 'kiem35' = 'cham' + kiểm messageId trước khi ghi (findUnique rồi create như bài web)</span>
<span class="tok-comment">// kieu 'kiem5'  = như 'kiem35' nhưng DB chậm 5 s ⇒ lần thử lại tới khi lần đầu CHƯA ghi xong</span>
import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'cham';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 4 });
await db.query('DROP TABLE IF EXISTS tin; CREATE TABLE tin (id serial PRIMARY KEY, message_id uuid, noi_dung text, luc timestamptz DEFAULT now())');
const tre = kieu === 'kiem5' ? 5 : 3.5;

const io = new Server(19774);
io.on('connection', (sk) =&gt; sk.on('chat:send', async (data, ack) =&gt; {
  console.log(&#96;\${s()} [server] nhận chat:send (messageId …\${data.messageId.slice(-4)})&#96;);
  if (kieu === 'thieu') { await db.query('INSERT INTO tin (message_id, noi_dung) VALUES ($1, $2)', [data.messageId, data.text]); return; } // quên ack(...)
  if (kieu.startsWith('kiem')) {
    const { rows } = await db.query('SELECT id FROM tin WHERE message_id = $1', [data.messageId]);
    if (rows.length) { console.log(&#96;\${s()} [server] trùng messageId ⇒ trả id cũ \${rows[0].id}&#96;); return ack({ ok: true, id: rows[0].id, duplicate: true }); }
  }
  await db.query(&#96;SELECT pg_sleep(\${tre})&#96;);                     <span class="tok-comment">  // DB chậm</span>
  const r = (await db.query('INSERT INTO tin (message_id, noi_dung) VALUES ($1, $2) RETURNING id', [data.messageId, data.text])).rows[0];
  console.log(&#96;\${s()} [server] đã ghi id \${r.id} ⇒ ack&#96;);
  ack({ ok: true, id: r.id });
}));

const socket = ketNoi('http://localhost:19774', { transports: ['websocket'] });
await new Promise((r) =&gt; socket.once('connect', r));
async function sendWithRetry(msg) {            <span class="tok-comment">  // chép nguyên bài web 6.2</span>
  const maxAttempts = 3;
  for (let attempt = 1; attempt &lt;= maxAttempts; attempt++) {
    try {
      console.log(&#96;\${s()} [client] lần \${attempt}: emitWithAck&#96;);
      const res = await socket.timeout(3000).emitWithAck('chat:send', msg);
      console.log(&#96;\${s()} [client] ack \${JSON.stringify(res)}&#96;);
      return res;
    } catch (err) {
      console.log(&#96;\${s()} [client] lần \${attempt}: \${err.message}&#96;);
      if (attempt === maxAttempts) throw err;
      await cho(attempt * 1000);
    }
  }
}
await sendWithRetry({ messageId: randomUUID(), text: 'chào Nam' }).catch((e) =&gt; console.log(&#96;\${s()} [client] BỎ CUỘC: \${e.message}&#96;));
await cho(kieu === 'thieu' ? 500 : 6000);     <span class="tok-comment">  // chờ các lần ghi muộn của server</span>
const { rows } = await db.query('SELECT count(*)::int AS n, count(DISTINCT message_id)::int AS k FROM tin');
console.log(&#96;bảng tin: \${rows[0].n} dòng cho \${rows[0].k} messageId\${rows[0].n &gt; rows[0].k ? &#96; ⇒ TRÙNG \${rows[0].n - rows[0].k}&#96; : ''}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần</span><span class="lc-sub">Cùng cái bẫy, phía HTTP</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-14-2-api-that" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 14.2 — API thật: hết giờ, thử lại, mất mạng, idempotency</span><span class="lc-sub">Nửa giao diện: hiện gì khi chưa chắc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, pool kết nối và timeout trong code của bạn</span><span class="lc-sub">Chọn con số 3 s thế nào</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at-least-once</span><span class="v">Giao một hoặc nhiều lần; retry có thể gây trùng.</span></div>
  <div class="kv"><span class="k"><code>emitWithAck</code></span><span class="v">Emit và chờ xác nhận của server.</span></div>
  <div class="kv"><span class="k">Timeout + backoff</span><span class="v">Retry sau khi không có ack, giãn các lần ra.</span></div>
  <div class="kv"><span class="k"><code>messageId</code></span><span class="v">Một id do client tạo để server dedup được.</span></div>
  <div class="kv"><span class="k">Handler idempotent</span><span class="v">Một handler chạy hai lần vẫn an toàn (chèn theo khoá, tập id, upsert).</span></div>
  <div class="kv"><span class="k">Thiếu ack ≠ chưa giao</span><span class="v">Ack có thể mất dù tin đã tới nơi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>At-least-once là <code>emitWithAck</code> cộng một timeout cộng một vòng retry có backoff.</li><li>Thêm một <code>messageId</code> do client tạo để server dedup được.</li><li>Thiếu ack nghĩa là <em>không rõ</em>, không phải <em>thất bại</em> — nên retry có thể trùng.</li><li>Mọi handler sau một event có ack phải idempotent.</li><li>Cost là +50-200ms latency và memory pending-ack — chỉ dùng cho data quan trọng.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Acknowledgements</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#acknowledgements — API chuẩn và ví dụ emitWithAck.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Exactly-once: only with dedupe layer|||6.3 — Exactly-once: chỉ có với dedupe layer',
      slug: 'io-6-3-exactly-once',
      type: 'VIDEO',
      description: 'Socket.io KHÔNG cho exactly-once tự nhiên. Muốn có, phải dedupe ở layer application dùng idempotency key hoặc unique constraint.',
      content: `
${G06_3}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Exactly-once: only with dedupe layer</h2>
<p class="lead">At-least-once from 6.2 means duplicates are possible. For &quot;each action happens exactly once&quot; (payment, order creation), you need a dedupe layer. Socket.io does not provide this natively.</p>

<h3>Dedupe key patterns</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">unique constraint DB</span><span class="lz-nsub">the most correct</span></span>
<span class="lz-nbody">Column <code>message_id</code> A UNIQUE constraint in Postgres. A duplicate insert throws → catch it and return the existing ID. Atomic, no race.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Redis SETNX with a TTL</span><span class="lz-nsub">nhanh, distributed</span></span>
<span class="lz-nbody"><code>SET dedupe:&lt;messageId&gt; 1 NX EX 3600</code>. OK means this is the first time you are processing it. nil means it is a duplicate. A one-hour TTL is enough because the retry loop is bounded.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">memory Map + LRU</span><span class="lz-nsub">single-instance</span></span>
<span class="lz-nbody">A Map&lt;messageId, timestamp&gt; with LRU eviction. Fastest, but NOT shared across workers — single-instance only.</span>
</div>
</div>

<h3>The standard pattern with Postgres</h3>
<pre><code class="language-ts">socket.on('order:create', async (data, ack) =&gt; {
  try {
    const order = await prisma.order.create({
      data: { messageId: data.messageId, userId, ...data },
    });
    ack({ ok: true, orderId: order.id });
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('messageId')) {
      // Duplicate — return the existing order
      const existing = await prisma.order.findUnique({ where: { messageId: data.messageId } });
      ack({ ok: true, orderId: existing.id, duplicate: true });
    } else {
      ack({ ok: false, error: err.message });
    }
  }
});
</code></pre>

<h3>Why SETNX is not enough for payments</h3>
<pre><code class="language-ts">// KEM: check dedupe roi mo process
const isNew = await redis.set(&#96;dedupe:\${id}&#96;, '1', 'NX', 'EX', 3600);
if (!isNew) return { duplicate: true };
await charge(userId, amount);   // BUG: neu crash o day, dedupe key da co, retry se bo qua nhung khong charge
</code></pre>

<pre><code class="language-ts">// TOT: charge + insert dedupe cung ATOMIC (DB transaction)
await prisma.$transaction(async (tx) =&gt; {
  const existing = await tx.payment.findUnique({ where: { messageId } });
  if (existing) return existing;
  const p = await tx.payment.create({ data: { messageId, ... } });
  await stripe.charge(...);   // charge sau khi DB row ton tai
  return p;
});
</code></pre>

<div class="callout warn">
<p><strong>This is NOT a socket.io matter.</strong> Exactly-once is a property of the whole system, not of the transport layer. Socket.io plus acks gives you at-least-once. For exactly-once, the application layer has to provide dedup plus an atomic operation. <strong>Measured — the “GOOD” example above is not exactly-once:</strong> a card charge inside <code>$transaction</code> is not rolled back with it. The process died before COMMIT: the payment row rolled back, the charge did not, and the retry charged again (2 charges). Passing the same <code>messageId</code> to the provider as its Idempotency-Key made it 1. The dedupe must cover every place that has an effect.</p>
</div>

<h3>The standard HTTP idempotency key</h3>
<pre><code class="language-text">HTTP:  POST /payments
       Idempotency-Key: 550e8400-e29b-...
       {amount: 100, ...}

Socket.io:  socket.emit('payment:create', { messageId: uuid(), amount: 100 })
            &lt;- messageId dong vai tro nhu Idempotency-Key
</code></pre>

<div class="pitfall">
<p><strong>Trap — using a short or predictable messageId.</strong> A timestamp or a sequential counter collides easily when clients run in parallel. UUID v4 (random) is the standard — 2^122 possibilities, effectively zero collisions.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Exactly-once needs a dedupe layer on top of at-least-once — a DB unique constraint (the most correct, and atomic), Redis SETNX (fast, cross-worker), or an in-memory Map (single-instance) — combined with a client-generated UUID messageId, which is the standard Idempotency-Key pattern.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a UUID <code>messageId</code> on the client and store processed ids; send the same message twice and confirm the second is ignored.</li>
<li>Implement the dedupe three ways — a DB unique constraint, Redis <code>SETNX</code>, and an in-memory Map — and note which is correct for single-instance versus cluster.</li>
<li>Explain why this is the same Idempotency-Key pattern used by payment APIs.</li>
</ol>
<p><strong>Done when:</strong> a duplicate delivery is rejected and you can pick the right dedupe store for your topology.</p></div>

<h3>🔬 Measured: four dedupe stores, a crash, and this repo's checkout</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 · Redis 7 — two socket.io servers in one process stand in for two workers, each with its own <code>Map</code>; 300 orders, every one sent twice. First the retry lands on the <em>other</em> worker 50 ms later; then both copies arrive at the same moment:</p>
<div class="out">$ node khu.mjs lech
kiemtruoc 300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 135 ms
map       300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 96 ms
setnx     300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 85 ms
unique    300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 418 ms
$ node khu.mjs cung
kiemtruoc 300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 129 ms
map       300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 63 ms
setnx     300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 43 ms
unique    300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 365 ms</div>
<p><strong>A crash in the middle of the handler</strong>, then a retry with the same <code>messageId</code> (the “provider” is a table written over its own connection, like an external system):</p>
<div class="out">$ node sap.mjs setnx
— setnx · messageId …a130 · 100.000 đ —
  [server] 💥 SẬP ở bước "sau SET NX"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [server] SET NX trả null ⇒ "trùng", bỏ qua
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true,"duplicate":true}
  KẾT QUẢ: bảng payment 0 dòng · nhà cung cấp đã trừ 0 lần = 0 đ ✗
$ node sap.mjs gd
— gd · messageId …119f · 100.000 đ —
  [server] 💥 SẬP ở bước "sau trừ tiền, trước COMMIT"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true}
  KẾT QUẢ: bảng payment 1 dòng · nhà cung cấp đã trừ 2 lần = 200.000 đ ✗
$ node sap.mjs khoa
— khoa · messageId …39c4 · 100.000 đ —
  [server] 💥 SẬP ở bước "sau trừ tiền, trước COMMIT"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true}
  KẾT QUẢ: bảng payment 1 dòng · nhà cung cấp đã trừ 1 lần = 100.000 đ ✓ đúng một lần</div>
<p><strong>Which id?</strong> 8 clients in parallel (worker threads), 50,000 ids each:</p>
<div class="out">$ node maid.mjs
Date.now()                     400.000 id ⇒      19 khác nhau · ĐỤNG 399.981
bộ đếm mỗi client (1, 2, 3…)   400.000 id ⇒  50.000 khác nhau · ĐỤNG 350.000
Math.random 6 ký tự            400.000 id ⇒ 399.962 khác nhau · ĐỤNG 38
crypto.randomUUID() (v4)       400.000 id ⇒ 400.000 khác nhau · ĐỤNG 0</div>
<p><strong>This repo's course checkout</strong> — the server checks <code>idempotencyKey</code> (UNIQUE per user), but the client creates a <em>fresh</em> key inside <code>createCourseOrder()</code>, so a second click never matches; the next guard (reuse a PENDING order) is check-then-create:</p>
<div class="out">$ grep -n "const idempotencyKey =" -A3 frontend/src/lib/api.ts
3595: const idempotencyKey =
3596- typeof crypto !== 'undefined' &amp;&amp; 'randomUUID' in crypto
3597- ? crypto.randomUUID()
3598- : &#96;\${Date.now()}-\${Math.random().toString(36).slice(2)}&#96;;
$ grep -n "if (idempotencyKey) {\\|existingPending = await prisma.courseOrder.findFirst" src/routes/payment.routes.ts ; grep -n "uk_course_order_idempotency" prisma/schema.prisma
377: if (idempotencyKey) {
412: const existingPending = await prisma.courseOrder.findFirst({
3508: @@unique([userId, idempotencyKey], name: "uk_course_order_idempotency")</div>
<p>The same pattern, copied and run with two tabs clicking “Buy” at once, then with a partial UNIQUE index:</p>
<div class="out">$ node dontrung.mjs kho
— mẫu kho · 20 lần: user 7 mở 2 tab, bấm "Mua" khoá 1…20 gần như cùng lúc (mỗi lần một idempotencyKey mới) —
  khoá 1 · tab 1: tạo mới ⇒ ORD797205
  khoá 1 · tab 2: tạo mới ⇒ ORD47014
  20 khoá ⇒ 40 đơn PENDING · 20 khoá có HAI đơn PENDING ✗ hai link thanh toán cho một khoá
$ node dontrung.mjs sua
— thêm UNIQUE một phần cho PENDING · 20 lần: user 7 mở 2 tab, bấm "Mua" khoá 1…20 gần như cùng lúc (mỗi lần một idempotencyKey mới) —
  khoá 1 · tab 1: DB từ chối bản trùng ⇒ trả ORD353832
  khoá 1 · tab 2: tạo mới ⇒ ORD353832
  20 khoá ⇒ 20 đơn PENDING · 0 khoá có HAI đơn PENDING ✓</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn cách khử trùng, đo THẬT: 2 server socket.io (= 2 worker, mỗi cái một Map riêng) · Redis thật :19661 · Postgres thật :19660.</span>
<span class="tok-comment">// 300 đơn hàng, MỖI đơn gửi 2 lần cùng messageId (lần thử lại). kieu 'lech' = lần 2 tới worker KHÁC sau 50 ms (nối lại sang worker khác);</span>
<span class="tok-comment">// kieu 'cung' = hai bản tới CÙNG LÚC (lần đầu chưa ghi xong thì lần thử lại đã tới).</span>
import pg from 'pg';
import { createClient } from 'redis';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'lech';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 20 });
const redis = createClient({ url: 'redis://127.0.0.1:19661' }); await redis.connect();
await db.query(&#96;DROP TABLE IF EXISTS don; CREATE TABLE don (id serial PRIMARY KEY, kho text, message_id uuid, so_tien int);
  CREATE UNIQUE INDEX don_unique ON don (message_id) WHERE kho = 'unique'&#96;);
await redis.del(await redis.keys('dedupe:*').then((k) =&gt; (k.length ? k : ['_'])));

const CACH = {
  <span class="tok-comment">// 0) SELECT rồi INSERT (findUnique rồi create — mẫu bài 6.2)</span>
  kiemtruoc: () =&gt; async (d) =&gt; { const { rows } = await db.query('SELECT 1 FROM don WHERE kho = $1 AND message_id = $2', ['kiemtruoc', d.messageId]); if (rows.length) return 'trùng';
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['kiemtruoc', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 1) Map trong tiến trình: kiểm rồi ghi</span>
  map: (daThay) =&gt; async (d) =&gt; { if (daThay.has(d.messageId)) return 'trùng'; daThay.set(d.messageId, Date.now());
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['map', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 2) Redis SET NX EX: lần đầu trả OK, lần sau trả null</span>
  setnx: () =&gt; async (d) =&gt; { const ok = await redis.set(&#96;dedupe:\${d.messageId}&#96;, '1', { NX: true, EX: 3600 }); if (!ok) return 'trùng';
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['setnx', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 3) UNIQUE trong Postgres: ghi luôn, trùng thì DB từ chối (mã 23505)</span>
  unique: () =&gt; async (d) =&gt; { try { await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['unique', d.messageId, d.soTien]); return 'mới'; }
    catch (e) { if (e.code === '23505') return 'trùng'; throw e; } },
};
for (const [k, [ten, tao]] of Object.entries(CACH).entries()) {
  const cong2 = [19780 + 2 * k, 19781 + 2 * k];        <span class="tok-comment">  // mỗi cách một cặp cổng</span>
  const ws = cong2.map((cong) =&gt; { const io = new Server(cong); const xuLy = tao(new Map()); <span class="tok-comment">  // mỗi worker một Map riêng</span>
    io.on('connection', (sk) =&gt; sk.on('order:create', async (d, ack) =&gt; ack(await xuLy(d)))); return io; });
  const [a, b] = await Promise.all(cong2.map((cong) =&gt; new Promise((r) =&gt; { const c = ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; r(c)); })));
  const t = Date.now();
  await Promise.all(Array.from({ length: 300 }, async (_, i) =&gt; {
    const d = { messageId: randomUUID(), soTien: 100 + i };
    if (kieu === 'cung') await Promise.all([a.emitWithAck('order:create', d), b.emitWithAck('order:create', d)]);
    else { await a.emitWithAck('order:create', d); await cho(50); await b.emitWithAck('order:create', d); }
  }));
  const { rows } = await db.query('SELECT count(*)::int n, count(DISTINCT message_id)::int k FROM don WHERE kho = $1', [ten]);
  console.log(&#96;\${ten.padEnd(9)} 300 đơn × 2 lần gửi ⇒ \${String(rows[0].n).padStart(3)} dòng · TRÙNG \${String(rows[0].n - rows[0].k).padStart(3)} · \${Date.now() - t} ms&#96;);
  a.close(); b.close(); ws.forEach((io) =&gt; io.close());
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-5-hop-dong-api" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.5 — API contracts: versions, ETag, idempotency</span><span class="lc-sub">The HTTP side of the same key</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 4.1 — INSERT: many rows, RETURNING & UPSERT</span><span class="lc-sub">ON CONFLICT instead of catching 23505</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-9-3-khong-dung-selectivity-partial" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 9.3 — Selectivity & partial indexes</span><span class="lc-sub">The fix for two pending orders</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exactly-once</span><span class="v">at-least-once delivery plus a dedupe layer that drops repeats.</span></div>
  <div class="kv"><span class="k">Dedupe layer</span><span class="v">The store of already-processed ids that rejects duplicates.</span></div>
  <div class="kv"><span class="k">DB unique constraint</span><span class="v">The most correct dedupe — atomic at the database.</span></div>
  <div class="kv"><span class="k">Redis <code>SETNX</code></span><span class="v">Fast, cross-worker dedupe set-if-not-exists.</span></div>
  <div class="kv"><span class="k">In-memory Map</span><span class="v">Single-instance dedupe only; not shared across workers.</span></div>
  <div class="kv"><span class="k">Idempotency-Key</span><span class="v">A client-generated UUID — the standard pattern this reuses.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Exactly-once needs a dedupe layer ON TOP of at-least-once.</li><li>Dedupe three ways: a DB unique constraint (most correct, atomic), Redis <code>SETNX</code> (fast, cross-worker), or an in-memory Map (single-instance).</li><li>Combine it with a client-generated UUID <code>messageId</code>.</li><li>That is exactly the Idempotency-Key pattern from payment APIs.</li><li>Pick the dedupe store that matches your topology.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Stripe — Idempotency</span><span class="lc-sub">stripe.com/docs/api/idempotent_requests — pattern chuẩn ngành cho payment.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Exactly-once: chỉ có với dedupe layer</h2>
<p class="lead">At-least-once từ 6.2 nghĩa là duplicate có thể có. Cho &quot;mỗi action diễn ra CHÍNH XÁC một lần&quot; (payment, tạo order), bạn cần dedupe layer. Socket.io không cung cấp cái này tự nhiên.</p>

<h3>Pattern dedupe key</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">unique constraint DB</span><span class="lz-nsub">chuẩn nhất</span></span>
<span class="lz-nbody">Column <code>message_id</code> UNIQUE trong Postgres. Duplicate insert throw exception → catch và trả ID cũ. Atomic, no race.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Redis SETNX với TTL</span><span class="lz-nsub">nhanh, distributed</span></span>
<span class="lz-nbody"><code>SET dedupe:&lt;messageId&gt; 1 NX EX 3600</code>. Trả OK = lần đầu process. Trả nil = duplicate. TTL 1 giờ đủ vì retry loop giới hạn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">memory Map + LRU</span><span class="lz-nsub">single-instance</span></span>
<span class="lz-nbody">Map&lt;messageId, timestamp&gt; với LRU eviction. Nhanh nhất nhưng KHÔNG share qua worker — chỉ cho single-instance.</span>
</div>
</div>

<h3>Pattern chuẩn với Postgres</h3>
<pre><code class="language-ts">socket.on('order:create', async (data, ack) =&gt; {
  try {
    const order = await prisma.order.create({
      data: { messageId: data.messageId, userId, ...data },
    });
    ack({ ok: true, orderId: order.id });
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('messageId')) {
      const existing = await prisma.order.findUnique({ where: { messageId: data.messageId } });
      ack({ ok: true, orderId: existing.id, duplicate: true });
    } else {
      ack({ ok: false, error: err.message });
    }
  }
});
</code></pre>

<h3>Vì sao SETNX không đủ cho payment</h3>
<pre><code class="language-ts">// KEM: check dedupe roi moi process
const isNew = await redis.set(&#96;dedupe:\${id}&#96;, '1', 'NX', 'EX', 3600);
if (!isNew) return { duplicate: true };
await charge(userId, amount);   // BUG: neu crash o day, dedupe key da co, retry se bo qua nhung khong charge
</code></pre>

<pre><code class="language-ts">// TOT: charge + insert dedupe cung ATOMIC (DB transaction)
await prisma.$transaction(async (tx) =&gt; {
  const existing = await tx.payment.findUnique({ where: { messageId } });
  if (existing) return existing;
  const p = await tx.payment.create({ data: { messageId, ... } });
  await stripe.charge(...);   // charge sau khi DB row ton tai
  return p;
});
</code></pre>

<div class="callout warn">
<p><strong>Đây KHÔNG phải chuyện socket.io.</strong> Exactly-once là property của toàn hệ thống, không riêng của layer transport. Socket.io + ack cho at-least-once. Muốn exactly-once, layer application phải có dedupe + atomic operation. <strong>Đo thật — ví dụ “TỐT” ở trên KHÔNG đúng một lần:</strong> lệnh trừ thẻ nằm trong <code>$transaction</code> không được hoàn tác cùng nó. Tiến trình chết trước COMMIT: dòng payment hoàn tác, tiền đã trừ thì không, lần thử lại trừ thêm (2 lần). Gửi chính <code>messageId</code> sang nhà cung cấp làm Idempotency-Key thì còn 1. Khử trùng phải phủ mọi chỗ gây tác dụng.</p>
</div>

<h3>Idempotency-key HTTP tiêu chuẩn</h3>
<pre><code class="language-text">HTTP:  POST /payments
       Idempotency-Key: 550e8400-e29b-...
       {amount: 100, ...}

Socket.io:  socket.emit('payment:create', { messageId: uuid(), amount: 100 })
            &lt;- messageId dong vai tro nhu Idempotency-Key
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng messageId ngắn hoặc predictable.</strong> Timestamp hoặc counter sequential dễ collision khi client chạy song song. UUID v4 (random) là chuẩn — 2^122 khả năng, thực tế zero collision.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Exactly-once cần dedupe layer bên trên at-least-once — unique constraint DB (chuẩn nhất, atomic), Redis SETNX (nhanh, cross-worker), hoặc memory Map (single-instance) — kết hợp với client-generated UUID messageId là chuẩn Idempotency-Key pattern.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một UUID <code>messageId</code> ở client và lưu các id đã xử lý; gửi cùng tin hai lần và xác nhận cái thứ hai bị bỏ.</li>
<li>Cài dedupe ba cách — một unique constraint DB, Redis <code>SETNX</code>, và một Map trong-process — và để ý cái nào đúng cho single-instance so với cluster.</li>
<li>Giải thích vì sao đây chính là Idempotency-Key pattern mà các payment API dùng.</li>
</ol>
<p><strong>Đạt khi:</strong> một giao tin trùng bị từ chối và bạn chọn được kho dedupe đúng cho topology của mình.</p></div>

<h3>🔬 Đo thật: bốn kho khử trùng, một vụ sập, và trang thanh toán của kho</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 · Redis 7 — hai server socket.io trong một tiến trình đóng vai hai worker, mỗi cái một <code>Map</code> riêng; 300 đơn, mỗi đơn gửi hai lần. Lượt đầu lần thử lại sang worker <em>kia</em> sau 50 ms; lượt sau hai bản tới cùng lúc:</p>
<div class="out">$ node khu.mjs lech
kiemtruoc 300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 135 ms
map       300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 96 ms
setnx     300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 85 ms
unique    300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 418 ms
$ node khu.mjs cung
kiemtruoc 300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 129 ms
map       300 đơn × 2 lần gửi ⇒ 600 dòng · TRÙNG 300 · 63 ms
setnx     300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 43 ms
unique    300 đơn × 2 lần gửi ⇒ 300 dòng · TRÙNG   0 · 365 ms</div>
<p><strong>Server sập giữa handler</strong>, rồi thử lại cùng <code>messageId</code> (“nhà cung cấp” là một bảng ghi qua kết nối riêng, như một hệ thống bên ngoài):</p>
<div class="out">$ node sap.mjs setnx
— setnx · messageId …a130 · 100.000 đ —
  [server] 💥 SẬP ở bước "sau SET NX"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [server] SET NX trả null ⇒ "trùng", bỏ qua
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true,"duplicate":true}
  KẾT QUẢ: bảng payment 0 dòng · nhà cung cấp đã trừ 0 lần = 0 đ ✗
$ node sap.mjs gd
— gd · messageId …119f · 100.000 đ —
  [server] 💥 SẬP ở bước "sau trừ tiền, trước COMMIT"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true}
  KẾT QUẢ: bảng payment 1 dòng · nhà cung cấp đã trừ 2 lần = 200.000 đ ✗
$ node sap.mjs khoa
— khoa · messageId …39c4 · 100.000 đ —
  [server] 💥 SẬP ở bước "sau trừ tiền, trước COMMIT"
  [client] lần 1 ⇒ lỗi: socket has been disconnected
  [client] lần 2 (thử lại, cùng messageId) ⇒ {"ok":true}
  KẾT QUẢ: bảng payment 1 dòng · nhà cung cấp đã trừ 1 lần = 100.000 đ ✓ đúng một lần</div>
<p><strong>Dùng id nào?</strong> 8 client song song (worker thread), mỗi client 50.000 id:</p>
<div class="out">$ node maid.mjs
Date.now()                     400.000 id ⇒      19 khác nhau · ĐỤNG 399.981
bộ đếm mỗi client (1, 2, 3…)   400.000 id ⇒  50.000 khác nhau · ĐỤNG 350.000
Math.random 6 ký tự            400.000 id ⇒ 399.962 khác nhau · ĐỤNG 38
crypto.randomUUID() (v4)       400.000 id ⇒ 400.000 khác nhau · ĐỤNG 0</div>
<p><strong>Trang mua khoá học của kho này</strong> — server kiểm <code>idempotencyKey</code> (UNIQUE theo người dùng), nhưng client tạo khoá <em>mới</em> ngay trong <code>createCourseOrder()</code>, nên lần bấm thứ hai không bao giờ khớp; chốt tiếp theo (dùng lại đơn PENDING) là kiểm-rồi-tạo:</p>
<div class="out">$ grep -n "const idempotencyKey =" -A3 frontend/src/lib/api.ts
3595: const idempotencyKey =
3596- typeof crypto !== 'undefined' &amp;&amp; 'randomUUID' in crypto
3597- ? crypto.randomUUID()
3598- : &#96;\${Date.now()}-\${Math.random().toString(36).slice(2)}&#96;;
$ grep -n "if (idempotencyKey) {\\|existingPending = await prisma.courseOrder.findFirst" src/routes/payment.routes.ts ; grep -n "uk_course_order_idempotency" prisma/schema.prisma
377: if (idempotencyKey) {
412: const existingPending = await prisma.courseOrder.findFirst({
3508: @@unique([userId, idempotencyKey], name: "uk_course_order_idempotency")</div>
<p>Chép đúng mẫu đó, chạy với hai tab bấm “Mua” cùng lúc, rồi thêm UNIQUE một phần:</p>
<div class="out">$ node dontrung.mjs kho
— mẫu kho · 20 lần: user 7 mở 2 tab, bấm "Mua" khoá 1…20 gần như cùng lúc (mỗi lần một idempotencyKey mới) —
  khoá 1 · tab 1: tạo mới ⇒ ORD797205
  khoá 1 · tab 2: tạo mới ⇒ ORD47014
  20 khoá ⇒ 40 đơn PENDING · 20 khoá có HAI đơn PENDING ✗ hai link thanh toán cho một khoá
$ node dontrung.mjs sua
— thêm UNIQUE một phần cho PENDING · 20 lần: user 7 mở 2 tab, bấm "Mua" khoá 1…20 gần như cùng lúc (mỗi lần một idempotencyKey mới) —
  khoá 1 · tab 1: DB từ chối bản trùng ⇒ trả ORD353832
  khoá 1 · tab 2: tạo mới ⇒ ORD353832
  20 khoá ⇒ 20 đơn PENDING · 0 khoá có HAI đơn PENDING ✓</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn cách khử trùng, đo THẬT: 2 server socket.io (= 2 worker, mỗi cái một Map riêng) · Redis thật :19661 · Postgres thật :19660.</span>
<span class="tok-comment">// 300 đơn hàng, MỖI đơn gửi 2 lần cùng messageId (lần thử lại). kieu 'lech' = lần 2 tới worker KHÁC sau 50 ms (nối lại sang worker khác);</span>
<span class="tok-comment">// kieu 'cung' = hai bản tới CÙNG LÚC (lần đầu chưa ghi xong thì lần thử lại đã tới).</span>
import pg from 'pg';
import { createClient } from 'redis';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'lech';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 20 });
const redis = createClient({ url: 'redis://127.0.0.1:19661' }); await redis.connect();
await db.query(&#96;DROP TABLE IF EXISTS don; CREATE TABLE don (id serial PRIMARY KEY, kho text, message_id uuid, so_tien int);
  CREATE UNIQUE INDEX don_unique ON don (message_id) WHERE kho = 'unique'&#96;);
await redis.del(await redis.keys('dedupe:*').then((k) =&gt; (k.length ? k : ['_'])));

const CACH = {
  <span class="tok-comment">// 0) SELECT rồi INSERT (findUnique rồi create — mẫu bài 6.2)</span>
  kiemtruoc: () =&gt; async (d) =&gt; { const { rows } = await db.query('SELECT 1 FROM don WHERE kho = $1 AND message_id = $2', ['kiemtruoc', d.messageId]); if (rows.length) return 'trùng';
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['kiemtruoc', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 1) Map trong tiến trình: kiểm rồi ghi</span>
  map: (daThay) =&gt; async (d) =&gt; { if (daThay.has(d.messageId)) return 'trùng'; daThay.set(d.messageId, Date.now());
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['map', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 2) Redis SET NX EX: lần đầu trả OK, lần sau trả null</span>
  setnx: () =&gt; async (d) =&gt; { const ok = await redis.set(&#96;dedupe:\${d.messageId}&#96;, '1', { NX: true, EX: 3600 }); if (!ok) return 'trùng';
    await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['setnx', d.messageId, d.soTien]); return 'mới'; },
  <span class="tok-comment">// 3) UNIQUE trong Postgres: ghi luôn, trùng thì DB từ chối (mã 23505)</span>
  unique: () =&gt; async (d) =&gt; { try { await db.query('INSERT INTO don (kho, message_id, so_tien) VALUES ($1, $2, $3)', ['unique', d.messageId, d.soTien]); return 'mới'; }
    catch (e) { if (e.code === '23505') return 'trùng'; throw e; } },
};
for (const [k, [ten, tao]] of Object.entries(CACH).entries()) {
  const cong2 = [19780 + 2 * k, 19781 + 2 * k];        <span class="tok-comment">  // mỗi cách một cặp cổng</span>
  const ws = cong2.map((cong) =&gt; { const io = new Server(cong); const xuLy = tao(new Map()); <span class="tok-comment">  // mỗi worker một Map riêng</span>
    io.on('connection', (sk) =&gt; sk.on('order:create', async (d, ack) =&gt; ack(await xuLy(d)))); return io; });
  const [a, b] = await Promise.all(cong2.map((cong) =&gt; new Promise((r) =&gt; { const c = ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; r(c)); })));
  const t = Date.now();
  await Promise.all(Array.from({ length: 300 }, async (_, i) =&gt; {
    const d = { messageId: randomUUID(), soTien: 100 + i };
    if (kieu === 'cung') await Promise.all([a.emitWithAck('order:create', d), b.emitWithAck('order:create', d)]);
    else { await a.emitWithAck('order:create', d); await cho(50); await b.emitWithAck('order:create', d); }
  }));
  const { rows } = await db.query('SELECT count(*)::int n, count(DISTINCT message_id)::int k FROM don WHERE kho = $1', [ten]);
  console.log(&#96;\${ten.padEnd(9)} 300 đơn × 2 lần gửi ⇒ \${String(rows[0].n).padStart(3)} dòng · TRÙNG \${String(rows[0].n - rows[0].k).padStart(3)} · \${Date.now() - t} ms&#96;);
  a.close(); b.close(); ws.forEach((io) =&gt; io.close());
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-5-hop-dong-api" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.5 — Hợp đồng API: phiên bản, ETag, idempotency</span><span class="lc-sub">Cùng một khoá, phía HTTP</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 4.1 — INSERT: nhiều dòng, RETURNING & UPSERT</span><span class="lc-sub">ON CONFLICT thay cho bắt 23505</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-9-3-khong-dung-selectivity-partial" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 9.3 — Độ chọn lọc & partial index</span><span class="lc-sub">Cách sửa hai đơn chờ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exactly-once</span><span class="v">Giao at-least-once cộng một dedupe layer bỏ các lần lặp.</span></div>
  <div class="kv"><span class="k">Dedupe layer</span><span class="v">Kho các id đã xử lý, từ chối bản trùng.</span></div>
  <div class="kv"><span class="k">Unique constraint DB</span><span class="v">Dedupe chuẩn nhất — atomic ở cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">Redis <code>SETNX</code></span><span class="v">Dedupe nhanh, cross-worker, set-if-not-exists.</span></div>
  <div class="kv"><span class="k">Map trong-process</span><span class="v">Dedupe chỉ single-instance; không share qua worker.</span></div>
  <div class="kv"><span class="k">Idempotency-Key</span><span class="v">Một UUID do client tạo — pattern chuẩn mà cái này dùng lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Exactly-once cần một dedupe layer BÊN TRÊN at-least-once.</li><li>Dedupe ba cách: unique constraint DB (chuẩn nhất, atomic), Redis <code>SETNX</code> (nhanh, cross-worker), hoặc Map trong-process (single-instance).</li><li>Kết hợp với một UUID <code>messageId</code> do client tạo.</li><li>Đó đúng là Idempotency-Key pattern từ các payment API.</li><li>Chọn kho dedupe khớp với topology của bạn.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Stripe — Idempotency</span><span class="lc-sub">stripe.com/docs/api/idempotent_requests — pattern chuẩn ngành cho payment.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Ordering: what socket.io does and does not guarantee|||6.4 — Thứ tự: socket.io hứa và KHÔNG hứa gì',
      slug: 'io-6-4-ordering',
      type: 'VIDEO',
      description: 'Trong một socket, events đến TCP-ordered. Giữa các socket khác nhau (multi-tab, multi-worker), thứ tự KHÔNG bảo đảm. Reordering fix bằng sequence number.',
      content: `
${G06_4}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Ordering: what socket.io does and does not guarantee</h2>
<p class="lead">TCP guarantees byte order. Socket.io on top preserves event order — WITHIN one socket. Between two sockets, no guarantee. This matters when your user has three tabs, or when broadcasts fan through Redis pub/sub.</p>

<h3>Ordering guarantees</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CO</span><span class="lz-t">Within one socket</span><span class="lz-d">The server emits event A then event B → the client receives A then B (TCP ordering). This holds for both polling and WebSocket.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Between two sockets</span><span class="lz-d">A user has tab 1 and tab 2 and the server broadcasts: <code>io.to(&quot;user:42&quot;).emit(&#39;X&#39;)</code>. Tab 1 may receive X before tab 2 or after — no guarantee either way.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Between two workers (a cluster)</span><span class="lz-d">Workers A and B both emit into the room. Redis pub/sub guarantees no cross-worker delivery order. <strong>Measured:</strong> each worker delivers its own message to local sockets at once and the other one after a Redis hop — two users saw a different order in 200 of 200 pairs; per-publisher order was kept.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Sau disconnect + reconnect</span><span class="lz-d">Events emitted during the disconnect window are lost. After the reconnect, new events arrive — but not the missed ones. There is no &quot;catch up in order&quot;.</span></div>
</div>

<h3>Fix reordering: sequence number</h3>
<pre><code class="language-ts">// Server: mo counter per room hoac per user
let seqCounter = 0;
io.to(&#96;thread:\${id}&#96;).emit('chat:message', { seq: ++seqCounter, ...data });

// Client: track lastSeen, sort khi nhan
let lastSeenSeq = 0;
const bufferedMessages = new Map&lt;number, Message&gt;();

socket.on('chat:message', (msg) =&gt; {
  if (msg.seq === lastSeenSeq + 1) {
    displayMessage(msg);
    lastSeenSeq++;
    // Kiem buffered
    while (bufferedMessages.has(lastSeenSeq + 1)) {
      lastSeenSeq++;
      displayMessage(bufferedMessages.get(lastSeenSeq));
      bufferedMessages.delete(lastSeenSeq);
    }
  } else if (msg.seq &gt; lastSeenSeq + 1) {
    // Gap — buffer, refetch neu gap lon
    bufferedMessages.set(msg.seq, msg);
    if (msg.seq - lastSeenSeq &gt; 10) refetch();
  }
  // seq &lt;= lastSeenSeq → duplicate, bo qua
});
</code></pre>

<h3>Sequence number vs timestamp</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">timestamp</span><span class="lz-lnote">Clock skew between server and client. Clock skew between workers in a cluster. Not dependable for ordering</span></div>
<div class="lz-layer"><span class="lz-lname">database ID (auto-increment)</span><span class="lz-lnote">The proper answer — the DB is monotonic. But it requires persisting before emitting (a DB round trip). This repo: <strong>measured, not quite</strong> — the event is <code>thread:new-message</code>, live messages are appended in arrival order (messagingStore.ts:1291), and only the catch-up path sorts by <code>createdAt</code> then id (:276-279)</span></div>
<div class="lz-layer"><span class="lz-lname">sequence counter server-side</span><span class="lz-lnote">Resets on restart. Needs an atomic Redis INCR in a cluster</span></div>
</div>

<h3>Trong practice</h3>
<pre><code class="language-text">Chat messages: DB auto-increment ID (chuan). Reorder client-side.
Notifications: thu tu KHONG quan trong, hien them theo nhan.
Payment status: state machine — client ap logic (PENDING -> PAID chi cho phep).
Live scores: overwrite theo lastest by timestamp, don gian.
</code></pre>

<div class="pitfall">
<p><strong>Trap — thinking &quot;WebSocket runs on TCP, so the order must be right&quot;.</strong> TCP ordering holds only between 2 endpoints sharing 1 connection. If the server has 4 workers emitting (via Redis pub/sub), or the client has 3 tabs (3 sockets), TCP ordering does not apply. You need a sequencing layer above it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Socket.io preserves order WITHIN a socket (TCP), but NOT across multiple sockets (multi-tab, cluster, reconnect gaps) — fix it with a sequence number in the payload (a DB auto-increment ID is best) plus reorder logic on the client, with gap detection to trigger a refetch when the gap grows too large.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Emit a burst of messages on one socket and confirm they arrive in order (TCP preserves it within a socket).</li>
<li>Now emit across two sockets (two tabs) or two workers and observe the order is NOT preserved across them.</li>
<li>Add a sequence number (a DB auto-increment id) to the payload and reorder on the client; detect a gap and refetch when it grows too large.</li>
</ol>
<p><strong>Done when:</strong> you can show in-socket order holding, cross-socket order breaking, and a sequence number fixing it.</p></div>

<h3>🔬 Measured: one socket, your handler, two workers</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 — 10,000 numbered messages on ONE socket (WebSocket, then polling); then 100 messages from the client into an <code>async</code> handler that writes to Postgres with a random 0–20 ms delay (like a busy database), first as a normal handler, then behind a per-socket promise queue:</p>
<div class="out">$ node thutu.mjs
— phần 1: server → client, MỘT socket, 10.000 tin —
  websocket nhận 10.000 tin trong 171 ms · đảo thứ tự: 0
  polling   nhận 10.000 tin trong 30 ms · đảo thứ tự: 0
— phần 2: client → server, MỘT socket, 100 tin, handler async ghi Postgres —
  handler async thường  · 133 ms · thứ tự id trong bảng: 9,3,6,10,1,11,12,2,15,13,18,8… · đảo 46
  xếp hàng mỗi socket · 1402 ms · thứ tự id trong bảng: 1,2,3,4,5,6,7,8,9,10,11,12… · đảo 0</div>
<p>The wire kept the order; the handler did not — the table's ids came out of order 46 times. A row the guarantees list above misses: <strong>inside your own async handler</strong>. <strong>Two workers</strong> with the Redis adapter (Redis 7): An on worker 1, Binh on worker 2, each worker emitting one message per round, 200 rounds — then the same with a sequence number from Postgres and client-side reordering:</p>
<div class="out">$ node cum.mjs tho
— phát thẳng, hiện theo thứ tự tới —
  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 A4 B4 … (400 tin)
  Bình (worker 2) thấy: B1 A1 B2 A2 B3 A3 B4 A4 … (400 tin)
  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 200 cặp
$ node cum.mjs seq
— seq từ Postgres, client xếp lại theo seq —
  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 84 lần, đệm lớn nhất 1
  Bình (worker 2) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 117 lần, đệm lớn nhất 2
  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 0 cặp</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "nextMsgs = \\[...cur, message\\]\\|merged.sort((a, b)" frontend/src/store/messagingStore.ts
276: merged.sort((a, b) =&gt; {
1291: nextMsgs = [...cur, message];
$ grep -n "if (Number.isFinite(ta) &amp;&amp; Number.isFinite(tb) &amp;&amp; ta !== tb) return ta - tb" frontend/src/store/messagingStore.ts
279: if (Number.isFinite(ta) &amp;&amp; Number.isFinite(tb) &amp;&amp; ta !== tb) return ta - tb;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Thứ tự GIỮA hai worker, đo THẬT: 2 server socket.io + Redis adapter (Redis :19661). An nối worker 1, Bình nối worker 2, cả hai ở room thread:1.</span>
<span class="tok-comment">// 200 lượt: worker 1 phát tin A, worker 2 phát tin B cùng lúc (như hai người gửi cùng lúc, mỗi người tới một worker).</span>
<span class="tok-comment">// kieu 'tho' = phát thẳng · 'seq' = mỗi tin lấy số thứ tự từ Postgres (:19660, sequence = id tự tăng) rồi mới phát; client xếp lại theo seq.</span>
import pg from 'pg';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'tho';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 4 });
await db.query('DROP SEQUENCE IF EXISTS seq_thread; CREATE SEQUENCE seq_thread');
const mo = async (cong) =&gt; { const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) }); io.on('connection', (s) =&gt; s.join('thread:1')); return io; };
const [w1, w2] = await Promise.all([mo(19793), mo(19794)]);
const noi = (cong) =&gt; new Promise((r) =&gt; { const c = ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; r(c)); });
const [an, binh] = await Promise.all([noi(19793), noi(19794)]);
await cho(300);

<span class="tok-comment">// client: hiện thẳng theo thứ tự tới, hoặc xếp lại theo seq (thuật toán bài web: lastSeen + bộ đệm khoảng trống)</span>
const lamClient = (c) =&gt; { const hien = []; let lastSeen = 0, demDem = 0, demMax = 0; const dem = new Map();
  c.on('tin', (m) =&gt; {
    if (kieu === 'tho') return hien.push(m.ten);
    if (m.seq === lastSeen + 1) { hien.push(m.ten); lastSeen++; while (dem.has(lastSeen + 1)) { lastSeen++; hien.push(dem.get(lastSeen)); dem.delete(lastSeen); } }
    else if (m.seq &gt; lastSeen + 1) { dem.set(m.seq, m.ten); demDem++; demMax = Math.max(demMax, dem.size); }
  });
  return { hien, thongKe: () =&gt; &#96;phải đệm \${demDem} lần, đệm lớn nhất \${demMax}&#96; }; };
const A = lamClient(an), B = lamClient(binh);
const phat = async (w, ten) =&gt; { const m = { ten }; if (kieu === 'seq') m.seq = Number((await db.query("SELECT nextval('seq_thread') AS s")).rows[0].s); w.to('thread:1').emit('tin', m); };
for (let k = 1; k &lt;= 200; k++) { await Promise.all([phat(w1, &#96;A\${k}&#96;), phat(w2, &#96;B\${k}&#96;)]); await cho(5); }
await cho(500);
let lech = 0; for (let k = 1; k &lt;= 200; k++) { const a = A.hien.indexOf(&#96;A\${k}&#96;) &lt; A.hien.indexOf(&#96;B\${k}&#96;), b = B.hien.indexOf(&#96;A\${k}&#96;) &lt; B.hien.indexOf(&#96;B\${k}&#96;); if (a !== b) lech++; }
console.log(&#96;— \${kieu === 'tho' ? 'phát thẳng, hiện theo thứ tự tới' : 'seq từ Postgres, client xếp lại theo seq'} —&#96;);
console.log(&#96;  An  (worker 1) thấy: \${A.hien.slice(0, 8).join(' ')} … (\${A.hien.length} tin)\${kieu === 'seq' ? ' · ' + A.thongKe() : ''}&#96;);
console.log(&#96;  Bình (worker 2) thấy: \${B.hien.slice(0, 8).join(' ')} … (\${B.hien.length} tin)\${kieu === 'seq' ? ' · ' + B.thongKe() : ''}&#96;);
console.log(&#96;  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở \${lech} cặp&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-1-1-osi-tcpip" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 1.2 — OSI and TCP/IP: the model people actually use</span><span class="lc-sub">Where byte order is promised, and its limit</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire-and-forget, and what it costs</span><span class="lc-sub">The hop between two workers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-5-pubsub-streams" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 12.5 — Pub/Sub and Streams: the message that vanished</span><span class="lc-sub">When messages need order and memory</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ordering</span><span class="v">Whether messages arrive in the order they were sent.</span></div>
  <div class="kv"><span class="k">Within a socket</span><span class="v">TCP preserves order on one connection.</span></div>
  <div class="kv"><span class="k">Across sockets</span><span class="v">Multi-tab, cluster and reconnect gaps break global order.</span></div>
  <div class="kv"><span class="k">Sequence number</span><span class="v">A per-message counter (a DB auto-increment id is best) to reorder by.</span></div>
  <div class="kv"><span class="k">Reorder logic</span><span class="v">Client-side buffering that sorts by sequence number.</span></div>
  <div class="kv"><span class="k">Gap detection</span><span class="v">Noticing a missing sequence number and refetching.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Socket.io preserves order WITHIN a socket (TCP).</li><li>It does NOT preserve order across sockets — multi-tab, cluster, reconnect gaps.</li><li>Fix it with a sequence number in the payload; a DB auto-increment id is best.</li><li>Reorder on the client by that sequence number.</li><li>Detect a gap and refetch when it grows too large.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Ordering guarantees</span><span class="lc-sub">socket.io/docs/v4/delivery-guarantees#ordering — chính thức nói về guarantee ordering.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Thứ tự: socket.io hứa và KHÔNG hứa gì</h2>
<p class="lead">TCP bảo đảm byte order. Socket.io trên đó giữ event order — TRONG MỘT socket. Giữa hai socket, không bảo đảm. Chuyện này quan trọng khi user có 3 tab, hay khi broadcast fan qua Redis pub/sub.</p>

<h3>Bảo đảm ordering</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CO</span><span class="lz-t">Trong một socket</span><span class="lz-d">Server emit event A rồi event B → client nhận A rồi B (TCP order). Đây là TRUE cho cả polling và WebSocket.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Giữa hai socket</span><span class="lz-d">User có tab 1 và tab 2, server broadcast: <code>io.to(&quot;user:42&quot;).emit(&#39;X&#39;)</code>. Tab 1 có thể nhận X trước tab 2 hoặc sau — không guarantee.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Giữa hai worker (cluster)</span><span class="lz-d">Worker A và B đều emit đến room. Redis pub/sub không guarantee thứ tự cross-worker delivery. <strong>Đo thật:</strong> mỗi worker giao tin của mình cho socket tại chỗ ngay, tin worker kia tới sau một vòng Redis — hai người thấy thứ tự khác nhau ở 200/200 cặp; thứ tự theo từng nơi phát vẫn giữ.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Sau disconnect + reconnect</span><span class="lz-d">Events phát trong khoảng disconnect mất. Sau reconnect, events mới đến — nhưng không phải các cái miss. Không có &quot;catch up in order&quot;.</span></div>
</div>

<h3>Vá reordering: sequence number</h3>
<pre><code class="language-ts">// Server: mo counter per room hoac per user
let seqCounter = 0;
io.to(&#96;thread:\${id}&#96;).emit('chat:message', { seq: ++seqCounter, ...data });

// Client: track lastSeen, sort khi nhan
let lastSeenSeq = 0;
const bufferedMessages = new Map&lt;number, Message&gt;();

socket.on('chat:message', (msg) =&gt; {
  if (msg.seq === lastSeenSeq + 1) {
    displayMessage(msg);
    lastSeenSeq++;
    // Kiem buffered
    while (bufferedMessages.has(lastSeenSeq + 1)) {
      lastSeenSeq++;
      displayMessage(bufferedMessages.get(lastSeenSeq));
      bufferedMessages.delete(lastSeenSeq);
    }
  } else if (msg.seq &gt; lastSeenSeq + 1) {
    // Gap — buffer, refetch neu gap lon
    bufferedMessages.set(msg.seq, msg);
    if (msg.seq - lastSeenSeq &gt; 10) refetch();
  }
  // seq &lt;= lastSeenSeq → duplicate, bo qua
});
</code></pre>

<h3>Sequence number vs timestamp</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">timestamp</span><span class="lz-lnote">Clock skew server vs client. Multi-worker clock skew giữa các worker. Không dependable cho ordering</span></div>
<div class="lz-layer"><span class="lz-lname">database ID (auto-increment)</span><span class="lz-lnote">Chuẩn — DB monotonic. Nhưng cần persist trước khi emit (round trip DB). Kho này: <strong>đo thật, chưa hẳn</strong> — event là <code>thread:new-message</code>, tin realtime được nối cuối theo thứ tự tới (messagingStore.ts:1291), chỉ đường bắt kịp mới sắp theo <code>createdAt</code> rồi id (:276-279)</span></div>
<div class="lz-layer"><span class="lz-lname">sequence counter server-side</span><span class="lz-lnote">Reset khi restart. Cần Redis atomic INCR cho cluster</span></div>
</div>

<h3>Trong practice</h3>
<pre><code class="language-text">Chat messages: DB auto-increment ID (chuan). Reorder client-side.
Notifications: thu tu KHONG quan trong, hien them theo nhan.
Payment status: state machine — client ap logic (PENDING -> PAID chi cho phep).
Live scores: overwrite theo lastest by timestamp, don gian.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — nghĩ &quot;WebSocket TCP nên order đúng&quot;.</strong> TCP order chỉ TRUE giữa 2 endpoint có 1 connection. Nếu server có 4 worker phát tin (Redis pub/sub), hoặc client có 3 tab (3 socket), TCP order không apply. Cần sequence layer trên.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.io giữ thứ tự TRONG một socket (TCP), nhưng KHÔNG cross-socket (multi-tab, cluster, reconnect gap) — vá bằng sequence number ở payload (tốt nhất là DB auto-increment ID) + reorder logic ở client, với gap detection để trigger refetch nếu gap quá lớn.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Emit một loạt tin trên một socket và xác nhận chúng tới đúng thứ tự (TCP giữ thứ tự trong một socket).</li>
<li>Giờ emit qua hai socket (hai tab) hoặc hai worker và quan sát thứ tự KHÔNG được giữ qua chúng.</li>
<li>Thêm một sequence number (một DB auto-increment id) vào payload và reorder ở client; phát hiện một gap và refetch khi nó lớn quá.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra thứ tự trong-socket giữ được, thứ tự cross-socket vỡ, và một sequence number vá nó.</p></div>

<h3>🔬 Đo thật: một socket, handler của bạn, hai worker</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Postgres 16 — 10.000 tin đánh số trên MỘT socket (WebSocket, rồi polling); rồi 100 tin từ client vào một handler <code>async</code> ghi Postgres với độ trễ ngẫu nhiên 0–20 ms (như DB lúc bận), lần đầu là handler thường, lần sau có hàng đợi Promise cho mỗi socket:</p>
<div class="out">$ node thutu.mjs
— phần 1: server → client, MỘT socket, 10.000 tin —
  websocket nhận 10.000 tin trong 171 ms · đảo thứ tự: 0
  polling   nhận 10.000 tin trong 30 ms · đảo thứ tự: 0
— phần 2: client → server, MỘT socket, 100 tin, handler async ghi Postgres —
  handler async thường  · 133 ms · thứ tự id trong bảng: 9,3,6,10,1,11,12,2,15,13,18,8… · đảo 46
  xếp hàng mỗi socket · 1402 ms · thứ tự id trong bảng: 1,2,3,4,5,6,7,8,9,10,11,12… · đảo 0</div>
<p>Trên dây giữ thứ tự; handler thì không — id trong bảng bị đảo 46 lần. Một dòng mà danh sách bảo đảm ở trên thiếu: <strong>bên trong handler async của chính bạn</strong>. <strong>Hai worker</strong> với Redis adapter (Redis 7): An ở worker 1, Bình ở worker 2, mỗi lượt mỗi worker phát một tin, 200 lượt — rồi làm lại với số thứ tự lấy từ Postgres và xếp lại ở client:</p>
<div class="out">$ node cum.mjs tho
— phát thẳng, hiện theo thứ tự tới —
  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 A4 B4 … (400 tin)
  Bình (worker 2) thấy: B1 A1 B2 A2 B3 A3 B4 A4 … (400 tin)
  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 200 cặp
$ node cum.mjs seq
— seq từ Postgres, client xếp lại theo seq —
  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 84 lần, đệm lớn nhất 1
  Bình (worker 2) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 117 lần, đệm lớn nhất 2
  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 0 cặp</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "nextMsgs = \\[...cur, message\\]\\|merged.sort((a, b)" frontend/src/store/messagingStore.ts
276: merged.sort((a, b) =&gt; {
1291: nextMsgs = [...cur, message];
$ grep -n "if (Number.isFinite(ta) &amp;&amp; Number.isFinite(tb) &amp;&amp; ta !== tb) return ta - tb" frontend/src/store/messagingStore.ts
279: if (Number.isFinite(ta) &amp;&amp; Number.isFinite(tb) &amp;&amp; ta !== tb) return ta - tb;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Thứ tự GIỮA hai worker, đo THẬT: 2 server socket.io + Redis adapter (Redis :19661). An nối worker 1, Bình nối worker 2, cả hai ở room thread:1.</span>
<span class="tok-comment">// 200 lượt: worker 1 phát tin A, worker 2 phát tin B cùng lúc (như hai người gửi cùng lúc, mỗi người tới một worker).</span>
<span class="tok-comment">// kieu 'tho' = phát thẳng · 'seq' = mỗi tin lấy số thứ tự từ Postgres (:19660, sequence = id tự tăng) rồi mới phát; client xếp lại theo seq.</span>
import pg from 'pg';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const kieu = process.argv[2] ?? 'tho';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 4 });
await db.query('DROP SEQUENCE IF EXISTS seq_thread; CREATE SEQUENCE seq_thread');
const mo = async (cong) =&gt; { const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) }); io.on('connection', (s) =&gt; s.join('thread:1')); return io; };
const [w1, w2] = await Promise.all([mo(19793), mo(19794)]);
const noi = (cong) =&gt; new Promise((r) =&gt; { const c = ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; r(c)); });
const [an, binh] = await Promise.all([noi(19793), noi(19794)]);
await cho(300);

<span class="tok-comment">// client: hiện thẳng theo thứ tự tới, hoặc xếp lại theo seq (thuật toán bài web: lastSeen + bộ đệm khoảng trống)</span>
const lamClient = (c) =&gt; { const hien = []; let lastSeen = 0, demDem = 0, demMax = 0; const dem = new Map();
  c.on('tin', (m) =&gt; {
    if (kieu === 'tho') return hien.push(m.ten);
    if (m.seq === lastSeen + 1) { hien.push(m.ten); lastSeen++; while (dem.has(lastSeen + 1)) { lastSeen++; hien.push(dem.get(lastSeen)); dem.delete(lastSeen); } }
    else if (m.seq &gt; lastSeen + 1) { dem.set(m.seq, m.ten); demDem++; demMax = Math.max(demMax, dem.size); }
  });
  return { hien, thongKe: () =&gt; &#96;phải đệm \${demDem} lần, đệm lớn nhất \${demMax}&#96; }; };
const A = lamClient(an), B = lamClient(binh);
const phat = async (w, ten) =&gt; { const m = { ten }; if (kieu === 'seq') m.seq = Number((await db.query("SELECT nextval('seq_thread') AS s")).rows[0].s); w.to('thread:1').emit('tin', m); };
for (let k = 1; k &lt;= 200; k++) { await Promise.all([phat(w1, &#96;A\${k}&#96;), phat(w2, &#96;B\${k}&#96;)]); await cho(5); }
await cho(500);
let lech = 0; for (let k = 1; k &lt;= 200; k++) { const a = A.hien.indexOf(&#96;A\${k}&#96;) &lt; A.hien.indexOf(&#96;B\${k}&#96;), b = B.hien.indexOf(&#96;A\${k}&#96;) &lt; B.hien.indexOf(&#96;B\${k}&#96;); if (a !== b) lech++; }
console.log(&#96;— \${kieu === 'tho' ? 'phát thẳng, hiện theo thứ tự tới' : 'seq từ Postgres, client xếp lại theo seq'} —&#96;);
console.log(&#96;  An  (worker 1) thấy: \${A.hien.slice(0, 8).join(' ')} … (\${A.hien.length} tin)\${kieu === 'seq' ? ' · ' + A.thongKe() : ''}&#96;);
console.log(&#96;  Bình (worker 2) thấy: \${B.hien.slice(0, 8).join(' ')} … (\${B.hien.length} tin)\${kieu === 'seq' ? ' · ' + B.thongKe() : ''}&#96;);
console.log(&#96;  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở \${lech} cặp&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-1-1-osi-tcpip" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 1.2 — OSI và TCP/IP: mô hình người ta thật sự dùng</span><span class="lc-sub">Chỗ thứ tự byte được hứa, và giới hạn của nó</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Chặng đi giữa hai worker</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-5-pubsub-streams" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 12.5 — Pub/Sub và Streams: tin nhắn đã biến mất</span><span class="lc-sub">Khi tin cần thứ tự và cần nhớ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ordering</span><span class="v">Liệu các tin tới đúng thứ tự chúng được gửi.</span></div>
  <div class="kv"><span class="k">Trong một socket</span><span class="v">TCP giữ thứ tự trên một connection.</span></div>
  <div class="kv"><span class="k">Qua nhiều socket</span><span class="v">Multi-tab, cluster và reconnect gap làm vỡ thứ tự toàn cục.</span></div>
  <div class="kv"><span class="k">Sequence number</span><span class="v">Một bộ đếm mỗi tin (DB auto-increment id là tốt nhất) để reorder.</span></div>
  <div class="kv"><span class="k">Reorder logic</span><span class="v">Đệm phía client, sắp theo sequence number.</span></div>
  <div class="kv"><span class="k">Gap detection</span><span class="v">Nhận ra một sequence number thiếu và refetch.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Socket.io giữ thứ tự TRONG một socket (TCP).</li><li>Nó KHÔNG giữ thứ tự qua nhiều socket — multi-tab, cluster, reconnect gap.</li><li>Vá bằng một sequence number ở payload; DB auto-increment id là tốt nhất.</li><li>Reorder ở client theo sequence number đó.</li><li>Phát hiện một gap và refetch khi nó lớn quá.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Ordering guarantees</span><span class="lc-sub">socket.io/docs/v4/delivery-guarantees#ordering — chính thức nói về guarantee ordering.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — When to use HTTP instead|||6.5 — Khi nào dùng HTTP thay vì socket.io',
      slug: 'io-6-5-vs-http',
      type: 'VIDEO',
      description: 'Ba criteria: (1) cần response ngay không, (2) cần server-push không, (3) cần strong delivery không. Nếu chỉ 1 hoặc 2 thì HTTP thắng.',
      content: `
${G06_5}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>When to use HTTP instead</h2>
<p class="lead">Socket.io is powerful, but for many actions HTTP POST is simpler, more reliable, and easier to debug. This lesson gives three criteria to decide.</p>

<h3>Three criteria</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Do you need server push (the server speaking first)?</span><span class="lz-d">A chat message arrives — the user did not request it, the server pushed. An order status changes — the user did not query, the server pushed. If the server has to push, you need socket.io.</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Do you need the response immediately?</span><span class="lz-d">A user clicks &quot;Send&quot; and expects the message to appear at once. An HTTP round trip is 100-500ms. A socket.io emit plus ack is ~50-100ms. If &gt;200ms of lag is unacceptable, use socket.io. <strong>Measured on the same ~100 ms link:</strong> a warm (keep-alive) HTTP POST took 105 ms and a socket.io ack 105 ms — one round trip each; only a <em>new</em> HTTP connection paid a second one (206 ms). The real difference is who can speak first, not speed.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Do you need strong delivery plus idempotency?</span><span class="lz-d">Payments, orders — losing one is a serious bug. HTTP has a standard Idempotency-Key plus retry. Socket.io makes you build the ack layer from scratch. If delivery is the priority, HTTP wins.</span></div>
</div>

<h3>The decision table</h3>
<div class="out">Feature              Q1 push?  Q2 fast?  Q3 reliable?  Choice
Chat message         YES       YES       YES           socket + ack + DB
Typing indicator     YES       YES       NO            socket, no ack
Presence             YES       NO        NO            socket, no ack
File upload          NO        NO        YES           HTTP POST (multipart)
Payment              NO        YES       YES           HTTP POST + Idempotency
Search               NO        YES       NO            HTTP GET
Push notification    YES       NO        YES           HTTP + FCM/APNS
Video signalling     YES       YES       YES           socket (Chuong 7)
</div>

<h3>The hybrid pattern — both</h3>
<pre><code class="language-ts">// Chat send: HTTP POST for persist + reliability, socket for realtime broadcast
async function sendMessage(threadId, text) {
  // 1. HTTP POST persist (co Idempotency-Key)
  const { messageId } = await api.post('/messages', { threadId, text }, {
    headers: { 'Idempotency-Key': uuid() },
  });
  
  // 2. Server-side: sau khi persist xong, emit toi room qua socket.io
  //    Client khac trong room nhan realtime
}
</code></pre>

<div class="callout ok">
<p><strong>The hybrid is very common.</strong> HTTP for the action and its reliability. Socket.io for the realtime notification that &quot;something new happened&quot;. This course teaches socket.io — but knowing where HTTP belongs matters just as much as knowing socket.io.</p>
</div>

<h3>Debugging — HTTP is far easier</h3>
<pre><code class="language-text">HTTP debugging:
  - Curl request tren terminal, xem response
  - Chrome Network tab, click, xem headers + payload
  - Postman/Insomnia collection
  - Retry buttons

Socket.io debugging:
  - DevTools WS tab (chua nhiu tool support tot)
  - Server log
  - Client-side console
  - Reproducibility: kho vi ephemeral
</code></pre>

<div class="pitfall">
<p><strong>Trap — using socket.io for EVERY action because it is &quot;more realtime&quot;.</strong> A user clicks &quot;Update profile&quot; — over a socket.io emit? Pointless. HTTP PUT has been the standard for 20 years, the tooling is complete and error handling is built in. Reach for socket.io only when you need a server push or when sub-100ms latency is critical.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three criteria (server push, sub-200ms latency, strong delivery) — all three point to socket.io plus acks; only one or two means plain HTTP or a hybrid (HTTP for the action, socket.io for the realtime notification); do not use socket.io for a profile update or ordinary CRUD, because HTTP has mature tooling and is far easier to debug.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Take three features and score each on the three criteria — server push, sub-200ms latency, strong delivery.</li>
<li>Route a feature that scores all three to socket.io + acks, and one that scores only one or two to plain HTTP or a hybrid.</li>
<li>Take a profile update (ordinary CRUD) and justify keeping it on HTTP rather than a socket emit.</li>
</ol>
<p><strong>Done when:</strong> you can decide socket.io vs HTTP vs hybrid for a feature by scoring the three criteria.</p></div>

<h3>🔬 Measured: latency, the hybrid, and SSE</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — one Node server answers <code>POST /messages</code> and the socket event <code>chat:send</code>; a TCP proxy holds every chunk 50 ms each way and adds one round trip to the first chunk of each connection (a TCP handshake; no TLS). Seven runs each, median:</p>
<div class="out">$ node tre.mjs
HTTP POST, kết nối MỚI mỗi lần (không keep-alive) trung vị  206 ms · lần đầu 217 ms
HTTP POST, giữ kết nối (keep-alive)            trung vị  105 ms · lần đầu 206 ms
socket.io emitWithAck (đã nối sẵn)             trung vị  105 ms · lần đầu 104 ms
(một lần nối socket.io WebSocket qua đường này: 315 ms)</div>
<p><strong>The hybrid</strong> — the action over HTTP with an <code>Idempotency-Key</code> (Postgres <code>UNIQUE</code>, <code>ON CONFLICT DO NOTHING</code>), the socket only as the bell; then Server-Sent Events with <code>id</code> + <code>Last-Event-ID</code>:</p>
<div class="out">$ curl -i -X POST -H 'Idempotency-Key: b8b4f68e-ca56-494c-bd65-47a6b336d9d4' -d '{"text":"chào Nam"}' localhost:19802/messages
HTTP/1.1 201 Created
{"id":1,"text":"chào Nam"}
$ curl -i -X POST -H 'Idempotency-Key: b8b4f68e-ca56-494c-bd65-47a6b336d9d4' -d '{"text":"chào Nam"}' localhost:19802/messages   # thử lại, CÙNG khoá
HTTP/1.1 200 OK
{"id":1,"text":"chào Nam","duplicate":true}
$ cat nghe.log   # client socket.io ở room thread:1
[nghe] đã nối
[nghe] message:new {"id":1,"text":"chào Nam"}
$ curl -s -N localhost:19802/sse
id: 1
data: {"gia":101}

id: 2
data: {"gia":102}

id: 3
data: {"gia":103}

id: 4
data: {"gia":104}

id: 5
data: {"gia":105}
$ curl -N -H 'Last-Event-ID: 3' localhost:19802/sse   # nối lại sau sự kiện 3
id: 4
data: {"gia":104}

id: 5
data: {"gia":105}</div>
<p><strong>In Chromium</strong> (two iframes: An posts with <code>fetch</code>, Binh listens on socket.io) — the retry returned the original, the bell rang once, and it arrived <em>before</em> An finished reading the 201, so the client must merge by id:</p>
<div class="out"> 643 ms  HTTP POST /messages ⇒ 201 · 29 B
 644 ms  HTTP POST /messages ⇒ 200 · 46 B
 626 ms  WS   ↓ 42["message:new",{"id":1,"text":"chào Bình"}]</div>
<p><strong>This repo</strong> — HTTP routes, socket handlers, SSE endpoints, and where chat rings the bell after saving:</p>
<div class="out">$ grep -rhoE "router\\.(get|post|put|patch|delete)\\(" src/routes | wc -l ; ls src/socket/*.ts | grep -v test | xargs grep -hoE "socket\\.on\\('" | wc -l
2606
58
$ grep -rl "text/event-stream" src | grep -v test | wc -l ; grep -n "emitter.emit('thread:new-message'" src/services/messages.service.ts
12
1811: emitter.emit('thread:new-message', payload);</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Mẫu HYBRID, chạy THẬT: HTTP cho hành động (POST /messages + Idempotency-Key, ghi Postgres :19660 có UNIQUE), socket.io chỉ để BÁO "có tin mới".</span>
<span class="tok-comment">// Thêm GET /sse (Server-Sent Events: đẩy một chiều bằng HTTP thường, có id + Last-Event-ID) và trang /hai (Chromium: An gửi bằng fetch, Bình nghe qua socket).</span>
import http from 'node:http';
import fs from 'node:fs';
import pg from 'pg';
import { Server } from 'socket.io';
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' });
await db.query('DROP TABLE IF EXISTS tin_lai; CREATE TABLE tin_lai (id serial PRIMARY KEY, idem_key text UNIQUE, noi_dung text)');
const trang = (ten) =&gt; fs.readFileSync(new URL(&#96;./lai/\${ten}.html&#96;, import.meta.url));
const server = http.createServer(async (req, res) =&gt; {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' &amp;&amp; url.pathname === '/messages') {
    let b = ''; for await (const x of req) b += x;
    const khoa = req.headers['idempotency-key'], { text } = JSON.parse(b || '{}');
    if (!khoa) { res.writeHead(400, { 'content-type': 'application/json' }); return res.end('{"error":"thiếu Idempotency-Key"}'); }
    const moi = await db.query('INSERT INTO tin_lai (idem_key, noi_dung) VALUES ($1, $2) ON CONFLICT (idem_key) DO NOTHING RETURNING id', [khoa, text]);
    if (moi.rows.length) {
      const tin = { id: moi.rows[0].id, text };
      io.to('thread:1').emit('message:new', tin);               <span class="tok-comment">  // socket chỉ là chuông cửa</span>
      res.writeHead(201, { 'content-type': 'application/json' }); return res.end(JSON.stringify(tin));
    }
    const cu = await db.query('SELECT id, noi_dung FROM tin_lai WHERE idem_key = $1', [khoa]);
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ id: cu.rows[0].id, text: cu.rows[0].noi_dung, duplicate: true }));
  }
  if (url.pathname === '/sse') {                                <span class="tok-comment">  // đẩy một chiều, chỉ HTTP</span>
    const tu = Number(req.headers['last-event-id'] ?? 0);
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
    let n = tu; const t = setInterval(() =&gt; { n++; res.write(&#96;id: \${n}\\ndata: {"gia":\${100 + n}}\\n\\n&#96;); if (n &gt;= 5) { clearInterval(t); res.end(); } }, 200);
    return req.on('close', () =&gt; clearInterval(t));
  }
  if (['/hai', '/an', '/binh'].includes(url.pathname)) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(trang(url.pathname.slice(1))); }
  if (!url.pathname.startsWith('/socket.io')) { res.writeHead(404); res.end(); }
});
const io = new Server(server);
io.on('connection', (s) =&gt; s.join('thread:1'));
server.listen(19802, () =&gt; console.log('lai.mjs nghe :19802'));</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, connection pools and timeouts in your code</span><span class="lc-sub">Why a warm HTTP request costs one round trip</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-5-hop-dong-api" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.5 — API contracts: versions, ETag, idempotency</span><span class="lc-sub">The HTTP half of the hybrid</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/web-development-project/learn?lessonSlug=wdp301-8-1-advanced" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy WDP301 · 8.1 — Advanced: tests, Docker, pagination, Socket.IO</span><span class="lc-sub">The project adds a socket bell on create — the hybrid</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server push</span><span class="v">Criterion 1: the server must initiate, not just answer.</span></div>
  <div class="kv"><span class="k">Sub-200ms latency</span><span class="v">Criterion 2: the interaction must feel instant.</span></div>
  <div class="kv"><span class="k">Strong delivery</span><span class="v">Criterion 3: the message must not be silently lost.</span></div>
  <div class="kv"><span class="k">All three → socket.io</span><span class="v">Use socket.io plus acks when every criterion holds.</span></div>
  <div class="kv"><span class="k">Hybrid</span><span class="v">HTTP for the action, socket.io for the realtime notification.</span></div>
  <div class="kv"><span class="k">Plain HTTP</span><span class="v">Ordinary CRUD — mature tooling, far easier to debug.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three criteria decide the transport: server push, sub-200ms latency, strong delivery.</li><li>All three point to socket.io plus acks.</li><li>Only one or two means plain HTTP or a hybrid (HTTP for the action, socket.io for the notification).</li><li>Do not use socket.io for a profile update or ordinary CRUD.</li><li>HTTP has mature tooling and is far easier to debug.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Server-Sent Events</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — HTTP one-way push, đơn giản hơn socket.io nếu chỉ push không cần bidirectional.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Khi nào dùng HTTP thay vì socket.io</h2>
<p class="lead">Socket.io mạnh mẽ, nhưng cho nhiều action HTTP POST đơn giản hơn, tin cậy hơn, và dễ debug hơn. Bài này đưa ba criteria để quyết định.</p>

<h3>Ba criteria</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Cần server-push (chủ động bắn ra)?</span><span class="lz-d">Chat message đến — user không request, server push. Order status change — user không query, server push. Nếu server phải push, cần socket.io.</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Cần response ngay?</span><span class="lz-d">User click &quot;Send&quot; và mong thấy tin nhắn hiện ngay. HTTP round trip 100-500ms. Socket.io emit + ack: ~50-100ms. Nếu lag &gt;200ms không chấp nhận được, socket.io. <strong>Đo trên cùng đường ~100 ms:</strong> HTTP POST giữ kết nối (keep-alive) 105 ms, ack socket.io 105 ms — mỗi bên đúng một vòng đi về; chỉ kết nối HTTP <em>mới</em> tốn thêm một vòng (206 ms). Khác biệt thật là ai được nói trước, không phải tốc độ.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Cần strong delivery + idempotency?</span><span class="lz-d">Payment, order — mất là bug lớn. HTTP có Idempotency-Key + retry chuẩn. Socket.io cần build ack layer từ đầu. Nếu YES cho delivery, HTTP thắng.</span></div>
</div>

<h3>Bảng quyết định</h3>
<div class="out">Feature              Q1 push?  Q2 fast?  Q3 reliable?  Choice
Chat message         YES       YES       YES           socket + ack + DB
Typing indicator     YES       YES       NO            socket, no ack
Presence             YES       NO        NO            socket, no ack
File upload          NO        NO        YES           HTTP POST (multipart)
Payment              NO        YES       YES           HTTP POST + Idempotency
Search               NO        YES       NO            HTTP GET
Push notification    YES       NO        YES           HTTP + FCM/APNS
Video signalling     YES       YES       YES           socket (Chuong 7)
</div>

<h3>Hybrid pattern — cả hai</h3>
<pre><code class="language-ts">// Chat send: HTTP POST for persist + reliability, socket for realtime broadcast
async function sendMessage(threadId, text) {
  // 1. HTTP POST persist (co Idempotency-Key)
  const { messageId } = await api.post('/messages', { threadId, text }, {
    headers: { 'Idempotency-Key': uuid() },
  });
  
  // 2. Server-side: sau khi persist xong, emit toi room qua socket.io
  //    Client khac trong room nhan realtime
}
</code></pre>

<div class="callout ok">
<p><strong>Hybrid rất phổ biến.</strong> HTTP cho action + reliability. Socket.io cho realtime notification &quot;có action mới&quot;. Khoá này dạy socket.io — nhưng biết dùng HTTP đúng chỗ quan trọng bằng biết dùng socket.io.</p>
</div>

<h3>Debug — HTTP dễ hơn nhiều</h3>
<pre><code class="language-text">HTTP debugging:
  - Curl request tren terminal, xem response
  - Chrome Network tab, click, xem headers + payload
  - Postman/Insomnia collection
  - Retry buttons

Socket.io debugging:
  - DevTools WS tab (chua nhiu tool support tot)
  - Server log
  - Client-side console
  - Reproducibility: kho vi ephemeral
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng socket.io cho MỌI action vì &quot;realtime hơn&quot;.</strong> User bấm &quot;Update profile&quot; — dùng socket.io emit? Vô nghĩa. HTTP PUT là chuẩn 20 năm, tools support đầy đủ, error handling built-in. Chỉ dùng socket.io khi cần push từ server hoặc latency &lt;100ms là critical.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba criteria (server-push, sub-200ms latency, strong delivery) — nếu cả 3 = socket.io + ack, chỉ 1-2 = HTTP thường hoặc hybrid (HTTP cho action + socket.io cho realtime notification); không dùng socket.io cho update profile hay CRUD thường vì HTTP có tools chín và debug dễ hơn nhiều.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy ba tính năng và chấm mỗi cái theo ba criteria — server push, latency dưới 200ms, giao tin mạnh.</li>
<li>Đưa một tính năng đạt cả ba vào socket.io + ack, và một cái chỉ đạt một-hai vào HTTP thường hoặc hybrid.</li>
<li>Lấy một update profile (CRUD thường) và biện minh cho việc giữ nó trên HTTP thay vì một socket emit.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn quyết được socket.io vs HTTP vs hybrid cho một tính năng bằng cách chấm ba criteria.</p></div>

<h3>🔬 Đo thật: độ trễ, mẫu lai, và SSE</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — một server Node vừa trả <code>POST /messages</code> vừa nhận event socket <code>chat:send</code>; proxy TCP giữ mỗi mẩu 50 ms mỗi chiều và thêm một vòng cho mẩu đầu của mỗi kết nối (bắt tay TCP; không TLS). Mỗi cách 7 lần, lấy trung vị:</p>
<div class="out">$ node tre.mjs
HTTP POST, kết nối MỚI mỗi lần (không keep-alive) trung vị  206 ms · lần đầu 217 ms
HTTP POST, giữ kết nối (keep-alive)            trung vị  105 ms · lần đầu 206 ms
socket.io emitWithAck (đã nối sẵn)             trung vị  105 ms · lần đầu 104 ms
(một lần nối socket.io WebSocket qua đường này: 315 ms)</div>
<p><strong>Mẫu lai</strong> — hành động đi HTTP kèm <code>Idempotency-Key</code> (Postgres <code>UNIQUE</code>, <code>ON CONFLICT DO NOTHING</code>), socket chỉ làm chuông; rồi Server-Sent Events có <code>id</code> + <code>Last-Event-ID</code>:</p>
<div class="out">$ curl -i -X POST -H 'Idempotency-Key: b8b4f68e-ca56-494c-bd65-47a6b336d9d4' -d '{"text":"chào Nam"}' localhost:19802/messages
HTTP/1.1 201 Created
{"id":1,"text":"chào Nam"}
$ curl -i -X POST -H 'Idempotency-Key: b8b4f68e-ca56-494c-bd65-47a6b336d9d4' -d '{"text":"chào Nam"}' localhost:19802/messages   # thử lại, CÙNG khoá
HTTP/1.1 200 OK
{"id":1,"text":"chào Nam","duplicate":true}
$ cat nghe.log   # client socket.io ở room thread:1
[nghe] đã nối
[nghe] message:new {"id":1,"text":"chào Nam"}
$ curl -s -N localhost:19802/sse
id: 1
data: {"gia":101}

id: 2
data: {"gia":102}

id: 3
data: {"gia":103}

id: 4
data: {"gia":104}

id: 5
data: {"gia":105}
$ curl -N -H 'Last-Event-ID: 3' localhost:19802/sse   # nối lại sau sự kiện 3
id: 4
data: {"gia":104}

id: 5
data: {"gia":105}</div>
<p><strong>Trong Chromium</strong> (hai iframe: An gửi bằng <code>fetch</code>, Bình nghe qua socket.io) — lần thử lại nhận lại kết quả cũ, chuông reo một lần, và tới <em>trước</em> khi An đọc xong 201, nên client phải gộp theo id:</p>
<div class="out"> 643 ms  HTTP POST /messages ⇒ 201 · 29 B
 644 ms  HTTP POST /messages ⇒ 200 · 46 B
 626 ms  WS   ↓ 42["message:new",{"id":1,"text":"chào Bình"}]</div>
<p><strong>Kho này</strong> — số tuyến HTTP, số handler socket, số chỗ dùng SSE, và chỗ chat bấm chuông sau khi lưu:</p>
<div class="out">$ grep -rhoE "router\\.(get|post|put|patch|delete)\\(" src/routes | wc -l ; ls src/socket/*.ts | grep -v test | xargs grep -hoE "socket\\.on\\('" | wc -l
2606
58
$ grep -rl "text/event-stream" src | grep -v test | wc -l ; grep -n "emitter.emit('thread:new-message'" src/services/messages.service.ts
12
1811: emitter.emit('thread:new-message', payload);</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Mẫu HYBRID, chạy THẬT: HTTP cho hành động (POST /messages + Idempotency-Key, ghi Postgres :19660 có UNIQUE), socket.io chỉ để BÁO "có tin mới".</span>
<span class="tok-comment">// Thêm GET /sse (Server-Sent Events: đẩy một chiều bằng HTTP thường, có id + Last-Event-ID) và trang /hai (Chromium: An gửi bằng fetch, Bình nghe qua socket).</span>
import http from 'node:http';
import fs from 'node:fs';
import pg from 'pg';
import { Server } from 'socket.io';
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' });
await db.query('DROP TABLE IF EXISTS tin_lai; CREATE TABLE tin_lai (id serial PRIMARY KEY, idem_key text UNIQUE, noi_dung text)');
const trang = (ten) =&gt; fs.readFileSync(new URL(&#96;./lai/\${ten}.html&#96;, import.meta.url));
const server = http.createServer(async (req, res) =&gt; {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' &amp;&amp; url.pathname === '/messages') {
    let b = ''; for await (const x of req) b += x;
    const khoa = req.headers['idempotency-key'], { text } = JSON.parse(b || '{}');
    if (!khoa) { res.writeHead(400, { 'content-type': 'application/json' }); return res.end('{"error":"thiếu Idempotency-Key"}'); }
    const moi = await db.query('INSERT INTO tin_lai (idem_key, noi_dung) VALUES ($1, $2) ON CONFLICT (idem_key) DO NOTHING RETURNING id', [khoa, text]);
    if (moi.rows.length) {
      const tin = { id: moi.rows[0].id, text };
      io.to('thread:1').emit('message:new', tin);               <span class="tok-comment">  // socket chỉ là chuông cửa</span>
      res.writeHead(201, { 'content-type': 'application/json' }); return res.end(JSON.stringify(tin));
    }
    const cu = await db.query('SELECT id, noi_dung FROM tin_lai WHERE idem_key = $1', [khoa]);
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ id: cu.rows[0].id, text: cu.rows[0].noi_dung, duplicate: true }));
  }
  if (url.pathname === '/sse') {                                <span class="tok-comment">  // đẩy một chiều, chỉ HTTP</span>
    const tu = Number(req.headers['last-event-id'] ?? 0);
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
    let n = tu; const t = setInterval(() =&gt; { n++; res.write(&#96;id: \${n}\\ndata: {"gia":\${100 + n}}\\n\\n&#96;); if (n &gt;= 5) { clearInterval(t); res.end(); } }, 200);
    return req.on('close', () =&gt; clearInterval(t));
  }
  if (['/hai', '/an', '/binh'].includes(url.pathname)) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(trang(url.pathname.slice(1))); }
  if (!url.pathname.startsWith('/socket.io')) { res.writeHead(404); res.end(); }
});
const io = new Server(server);
io.on('connection', (s) =&gt; s.join('thread:1'));
server.listen(19802, () =&gt; console.log('lai.mjs nghe :19802'));</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, pool kết nối và timeout trong code của bạn</span><span class="lc-sub">Vì sao HTTP ấm chỉ tốn một vòng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-5-hop-dong-api" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.5 — Hợp đồng API: phiên bản, ETag, idempotency</span><span class="lc-sub">Nửa HTTP của mẫu lai</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/web-development-project/learn?lessonSlug=wdp301-8-1-advanced" target="_blank" rel="noopener"><span class="lc-ico">🎓</span><span class="lc-body"><span class="lc-title">Academy WDP301 · 8.1 — Nâng cao: test, Docker, phân trang, Socket.IO</span><span class="lc-sub">Đồ án thêm chuông socket khi tạo — chính là mẫu lai</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server push</span><span class="v">Criteria 1: server phải chủ động, không chỉ đáp.</span></div>
  <div class="kv"><span class="k">Latency dưới 200ms</span><span class="v">Criteria 2: tương tác phải thấy tức thì.</span></div>
  <div class="kv"><span class="k">Giao tin mạnh</span><span class="v">Criteria 3: tin không được mất âm thầm.</span></div>
  <div class="kv"><span class="k">Cả ba → socket.io</span><span class="v">Dùng socket.io cộng ack khi mọi criteria đều đạt.</span></div>
  <div class="kv"><span class="k">Hybrid</span><span class="v">HTTP cho action, socket.io cho thông báo realtime.</span></div>
  <div class="kv"><span class="k">HTTP thường</span><span class="v">CRUD thường — tools chín, debug dễ hơn nhiều.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba criteria quyết định transport: server push, latency dưới 200ms, giao tin mạnh.</li><li>Cả ba chỉ về socket.io cộng ack.</li><li>Chỉ một-hai nghĩa là HTTP thường hoặc hybrid (HTTP cho action, socket.io cho thông báo).</li><li>Không dùng socket.io cho update profile hay CRUD thường.</li><li>HTTP có tools chín và debug dễ hơn nhiều.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Server-Sent Events</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — HTTP one-way push, đơn giản hơn socket.io nếu chỉ push không cần bidirectional.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
      slug: 'io-6-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về delivery guarantees, ack + retry, exactly-once, ordering, HTTP alternative.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>What Chapter 6 established</h2>
<p class="lead">Six questions on delivery guarantees — what Socket.IO promises, what it does not, and what you have to build.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">The default is at-most-once</span><span class="lz-d">A message emitted while a client is disconnected is gone. Socket.IO does not queue, does not retry, and does not tell you it was dropped. Anything stronger is your code, not the library.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">At-least-once needs ack plus retry</span><span class="lz-d">The ack callback tells you the client received it. Retrying until an ack arrives gives at-least-once — and therefore duplicates, which the receiver must tolerate.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Exactly-once needs a dedupe layer</span><span class="lz-d">There is no transport that gives it for free. A message id plus a seen-set on the receiver turns at-least-once into effectively-once; without that set, "exactly once" is a claim nobody has verified.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Chương 6 đã dựng được gì</h2>
<p class="lead">Sáu câu về bảo đảm giao nhận — Socket.IO hứa gì, không hứa gì, và bạn phải tự dựng gì.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Mặc định là at-most-once</span><span class="lz-d">Một thông điệp emit khi client đang mất kết nối thì mất luôn. Socket.IO không xếp hàng, không thử lại, và không báo cho bạn biết là nó đã rơi. Bất cứ thứ gì mạnh hơn đều là mã của bạn, không phải của thư viện.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">At-least-once cần ack cộng retry</span><span class="lz-d">Callback ack cho bạn biết client đã nhận. Thử lại tới khi có ack cho bạn at-least-once — và do đó có bản trùng, thứ mà bên nhận phải chịu được.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Exactly-once cần một lớp khử trùng</span><span class="lz-d">Không transport nào cho không thứ đó. Một id thông điệp cộng một tập đã-thấy ở bên nhận biến at-least-once thành gần-như-đúng-một-lần; không có tập đó thì "đúng một lần" chỉ là một lời khẳng định chưa ai kiểm chứng.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Server calls <code>socket.emit(&quot;msg&quot;, data)</code>. Client disconnects 100ms later before packet arrives. What happens?|||Server gọi <code>socket.emit(&quot;msg&quot;, data)</code>. Client disconnect 100ms sau trước khi packet đến. Chuyện gì?',
            options: [
              'Message is LOST silently. No exception, no log — socket.io is at-most-once by default. Reconnect does NOT replay|||Message MẤT âm thầm. Không exception, không log — socket.io default at-most-once. Reconnect KHÔNG replay',
              'Message queues on server and delivers on reconnect|||Message xếp hàng ở server và deliver khi reconnect',
              'Server throws an error you can catch|||Server throw error bạn có thể catch',
              'Message goes to Redis and delivers later|||Message vào Redis và deliver sau',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need at-least-once delivery for chat messages. What\'s the pattern?|||Bạn cần at-least-once delivery cho chat messages. Pattern gì?',
            options: [
              '<code>emitWithAck</code> with timeout + retry loop with backoff + client-generated messageId (UUID) for server-side deduplication|||<code>emitWithAck</code> với timeout + retry loop với backoff + messageId (UUID) sinh phía client cho server dedupe',
              'Just call emit() twice for redundancy|||Chỉ gọi emit() hai lần cho redundancy',
              'Use volatile.emit which has built-in ack|||Dùng volatile.emit có built-in ack',
              'Set pingInterval to 1s|||Đặt pingInterval là 1s',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need exactly-once for payment processing. How?|||Bạn cần exactly-once cho payment processing. Cách?',
            options: [
              'Dedupe layer above at-least-once — unique constraint in DB (atomic), Redis SETNX with TTL, or memory Map for single-instance. Socket.io does NOT provide exactly-once natively|||Dedupe layer trên at-least-once — unique constraint DB (atomic), Redis SETNX với TTL, hoặc memory Map cho single-instance. Socket.io KHÔNG cung cấp exactly-once tự nhiên',
              'Socket.io v4.6+ has exactly-once mode|||Socket.io v4.6+ có exactly-once mode',
              'Send the same message twice with a flag|||Gửi cùng message hai lần với một flag',
              'Use WebSocket instead of polling|||Dùng WebSocket thay vì polling',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Server emits event A, then event B on the same socket. Does client receive them in order?|||Server emit event A, rồi event B trên cùng socket. Client nhận theo thứ tự?',
            options: [
              'YES within one socket (TCP order preserved). NO across multiple sockets (multi-tab, cluster, reconnect gaps) — fix with sequence numbers|||CÓ trong một socket (TCP order). KHÔNG cross-socket (multi-tab, cluster, reconnect gap) — vá bằng sequence number',
              'Always in order, socket.io guarantees strict ordering|||Luôn đúng thứ tự, socket.io guarantees strict ordering',
              'Random order, always need sequence numbers|||Thứ tự ngẫu nhiên, luôn cần sequence number',
              'Depends on the packet payload size|||Phụ thuộc kích thước payload',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'User submits payment via socket.io emit. What\'s the risk?|||User submit payment qua socket.io emit. Nguy cơ gì?',
            options: [
              'If emit fails or ack times out, retry may double-charge. Payments should use HTTP POST with Idempotency-Key header — standard pattern, robust tooling, retry-safe|||Nếu emit fail hoặc ack timeout, retry có thể charge hai lần. Payment nên dùng HTTP POST với Idempotency-Key — pattern chuẩn, tooling robust, retry-safe',
              'No risk — socket.io is more reliable than HTTP|||Không có nguy cơ — socket.io tin cậy hơn HTTP',
              'Payment always requires WebSocket|||Payment luôn cần WebSocket',
              'Socket.io encrypts payment data automatically|||Socket.io tự encrypt payment data',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which task is BEST as an HTTP POST rather than socket.io emit?|||Task nào TỐT NHẤT là HTTP POST thay vì socket.io emit?',
            options: [
              'File upload — needs progress, chunk, resume, retry. HTTP tools mature. Socket.io <code>maxHttpBufferSize</code> caps at 1 MB and no built-in progress|||Upload file — cần progress, chunk, resume, retry. HTTP tools chín. Socket.io <code>maxHttpBufferSize</code> cap 1 MB và không có progress built-in',
              'Typing indicator|||Typing indicator',
              'Chat message from server broadcast|||Chat message từ server broadcast',
              'Live cursor position update|||Cập nhật vị trí con trỏ live',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
