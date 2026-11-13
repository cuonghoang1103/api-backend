import G01_1 from './giang/sio-01-1.mjs';
import G01_2 from './giang/sio-01-2.mjs';
import G01_3 from './giang/sio-01-3.mjs';
import G01_4 from './giang/sio-01-4.mjs';
import G01_5 from './giang/sio-01-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 1: Vòng đời một connection.
 * Số đo: connection events order + timing, 4 disconnect reasons, reconnect
 * behaviour đo bằng cả server-kill và transport-close.
 */

export default {
  title: 'Chapter 1 — The lifecycle of one connection|||Chương 1 — Vòng đời một connection',
  slug: 'io-ch1-vong-doi',
  description: 'Sáu bài đi từ HTTP request đầu tiên đến disconnect cuối. Bốn lý do disconnect, mỗi cái có ý nghĩa vận hành khác nhau. Reconnect với backoff, lifecycle event ở cả hai phía.',
  sortOrder: 2,
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Connect: five events in nine milliseconds|||1.1 — Connect: năm event trong chín mili giây',
      slug: 'io-1-1-connect',
      type: 'VIDEO',
      description: 'Đo bằng probe thật: server thấy connection ở 26ms, client thấy connect ở 35ms, upgrade sang WebSocket ở cùng 35ms. Ba event đó do ai phát ra và có gì bảo đảm về thứ tự.',
      content: `
${G01_1}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Connect: five events in nine milliseconds</h2>
<p class="lead">Section 0 mapped four layers. This chapter follows a single connection through them from birth to death. Lesson 1.1 measures the birth: what fires, in what order, on which side, and what you can assume when.</p>

<h3>The measurement</h3>
<pre><code class="language-js">const events = [];
const t0 = performance.now();
const T = () => Math.round(performance.now() - t0);

io.on('connection', s => {
  events.push([T(), 'server: connection', s.id, s.conn.transport.name]);
  s.conn.on('upgrade', t => events.push([T(), 'server: upgrade', s.id, t.name]));
});

const c = ioc(&#96;http://localhost:\${port}&#96;);
c.on('connect', () =&gt; events.push([T(), 'client: connect', c.id]));
</code></pre>

<div class="out">--- normal connect ---
26 | server: connection | wk01tAXjhacshcBLAAAB | polling
35 | client: connect    | wk01tAXjhacshcBLAAAB
35 | server: upgrade    | wk01tAXjhacshcBLAAAB | websocket
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">t=26ms</span><span class="lz-t">server: <code>connection</code></span><span class="lz-d">The handshake is done. The client has sent its first HTTP POST, the server has issued a sid, and the JWT (if any) has been checked. <code>s.conn.transport.name</code> is still <code>polling</code> at this point — <em>the upgrade has not happened yet</em>.</span></div>
<div class="lz-step"><span class="lz-k">t=35ms</span><span class="lz-t">client: <code>connect</code></span><span class="lz-d">The client sees socket.io's CONNECT packet (frame 2 in lesson 0.3) and receives its sid from the server. Only now does <code>c.id</code> hold a value — before this it was <code>undefined</code>.</span></div>
<div class="lz-step"><span class="lz-k">t=35ms</span><span class="lz-t">server: <code>upgrade</code> → websocket</span><span class="lz-d">The client opens a WebSocket connection and engine.io swaps transports. From here on every frame travels over WS instead of HTTP polling. This is a layer-2-only event — layer-4 code does NOT need to know about it.</span></div>
</div>

<h3>What you ARE allowed to assume inside the handler <code>connection</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the socket has a sid</span><span class="lz-lnote"><code>s.id</code> holds a value — you can log it, put it in a map, use it as a key. It does NOT change for the life of this connection (but it WILL change on a reconnect — see lesson 1.5)</span></div>
<div class="lz-layer"><span class="lz-lname">the auth middleware has already run</span><span class="lz-lnote">If you declared <code>io.use(...)</code>, it has already passed. <code>socket.data.user</code> (which this repo sets from the JWT) is already present. No null check needed</span></div>
<div class="lz-layer"><span class="lz-lname">no rooms joined yet</span><span class="lz-lnote">By default a socket joins only the room named after its own sid (the thing that makes <code>io.to(sid).emit(...)</code>work). To join any other room you must call <code>socket.join(&#39;user:42&#39;)</code> in this handler</span></div>
</div>

<h3>What you may NOT assume</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the transport is not guaranteed to be WebSocket</span><span class="lz-lnote"><code>s.conn.transport.name</code> là <code>&#39;polling&#39;</code> at the moment <code>connection</code> fires. The upgrade has not happened yet. Nothing depends on it so far, but do not log &quot;WebSocket client connected&quot; here — it will be lying 3-5% of the time (the group that never upgrades)</span></div>
<div class="lz-layer"><span class="lz-lname">the client has not seen it yet <code>connect</code></span><span class="lz-lnote">There are 9ms between <code>connection</code> on the server and <code>connect</code> on the client. If you <code>socket.emit(&#39;init:data&#39;, ...)</code> trong handler <code>connection</code>, that event queues up and is sent right after. The client will receive it — but during that window the client has not attached any handler yet</span></div>
<div class="lz-layer"><span class="lz-lname">the client is here to stay</span><span class="lz-lnote">The client may drop 100ms later (a network blink, a closed tab). <code>connection</code> the handler runs for ONE instant, not for ONE session</span></div>
</div>

<h3>The standard pattern this repo uses</h3>
<pre><code class="language-ts">// messaging.socket.ts
io.on('connection', async (socket) =&gt; {
  const userId = socket.data.userId as number;

  // 1. gia nhap cac room can thiet
  socket.join(&#96;user:\${userId}&#96;);

  // 2. cap nhat presence — chi den nguoi can biet
  onlineUserIds.add(userId);
  const audience = await getFriendsAndThreadPeers(userId);
  emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });

  // 3. gan cac handler
  socket.on('thread:join', handleThreadJoin);
  socket.on('thread:leave', handleThreadLeave);
  // ...

  // 4. handler cho disconnect
  socket.on('disconnect', async (reason) =&gt; {
    onlineUserIds.delete(userId);
    const audience2 = await getFriendsAndThreadPeers(userId);
    emitPresenceTo(audience2, { userId, online: false, lastSeen: Date.now() });
    logger.info('socket disconnect', { userId, reason });
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Four steps — in this order.</strong> (1) Join the rooms first, so that <em>other events</em> emitting to that room land in the right place. (2) Update presence. (3) Register handlers for the messages the client will send. (4) A <code>disconnect</code> handler to clean up. This repo does all four — drop any one of them and you get a bug or a leak.</p>
</div>

<h3>Where the race conditions live</h3>
<pre><code class="language-ts">// BUG: client emit 'thread:join' TRUOC khi server dang ky handler
io.on('connection', async (socket) =&gt; {
  await fetchUser(socket.data.userId);           // ~50ms — client CO the emit trong khoang nay
  socket.on('thread:join', handleThreadJoin);    // handler dang ky quá muon
});

// FIX: dang ky handler NGAY, roi await
io.on('connection', async (socket) =&gt; {
  socket.on('thread:join', async (data, ack) =&gt; {
    const user = await fetchUser(socket.data.userId);
    handleThreadJoin(user, data, ack);
  });
});
</code></pre>

<p>Does Socket.IO buffer packets at layer 2 while the handler is not registered yet? <strong>NO</strong>. An event that arrives before its handler is registered is dropped silently. This matches Node.js EventEmitter (same behaviour) but not what the client expects (they think emit means send).</p>

<div class="pitfall">
<p><strong>Trap — writing the <code>connection</code> handler as one big async &quot;init user session&quot; block.</strong> The handler runs synchronously, and a single <code>await fetch()</code> here opens a ~50-200ms window in which events the client sends are ALREADY lost. Register the handlers IMMEDIATELY and defer the async work to INSIDE those handlers.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The &quot;connect&quot; lifecycle is three events inside ~9ms — server <code>connection</code> (transport is polling, middleware has passed, no rooms joined), client <code>connect</code> (sid received), server <code>upgrade</code> (switched to WebSocket) — and the standard shape of the <code>connection</code> handler is join rooms → update presence → register handlers → attach disconnect, in exactly that order, with no <code>await</code> between the registration steps.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Log a timestamp at server <code>connection</code>, client <code>connect</code>, and server <code>upgrade</code>; measure the ~9ms window between them.</li>
<li>Inside the <code>connection</code> handler, print <code>socket.conn.transport.name</code> (it is <code>polling</code>) and <code>socket.rooms</code> (only the socket's own id) to confirm what you may assume there.</li>
<li>Write the handler in the canonical order — join rooms, update presence, register handlers, attach <code>disconnect</code> — then add an <code>await</code> between two registrations and reason about the event that could now slip through.</li>
</ol>
<p><strong>Done when:</strong> you have measured the three-event window and can state why no <code>await</code> sits between the registration steps.</p></div>

<h3>🔬 Measured: five events, and an order that is not fixed</h3>
<p>socket.io 4.8.3, Node 22, milliseconds from the call to <code>io()</code> — engine open, middleware, connection, client upgrade/connect:</p>
<div class="out"> 12 client: gọi io()  c.id = undefined  connected = false
 28 client: engine open (tầng 2)
 35 server: middleware io.use        transport=polling
 36 server: connection   id=weYKClRjO8LngmXyAAAA  transport=polling  rooms=["weYKClRjO8LngmXyAAAA"]
 39 client: upgrade → websocket
 40 client: connect      id=weYKClRjO8LngmXyAAAA  transport=websocket
 40 client: nhận init — gửi ngay trong handler connection
 40 server: upgrade → websocket</div>
<p>Five events from engine open to client connect in about 12 ms on the course machine. The client received <code>init</code> (emitted inside the connection handler) together with <code>connect</code>. <code>c.id</code> is <code>undefined</code> until then.</p>
<p>The same probe five times, printing only the client's transport at <code>connect</code>:</p>
<div class="out"> 34 client: connect      id=oetr6F_YHqIFctyiAAAA  transport=websocket
 36 client: connect      id=5KpZ0KyCkQweasgzAAAA  transport=websocket
 34 client: connect      id=DtoEYg6tFHp0aGD2AAAA  transport=websocket
 68 client: connect      id=tDb0JZsiPKNOL3w1AAAA  transport=polling
 39 client: connect      id=bwiUW8oIHsp_d5iGAAAA  transport=websocket</div>
<p>Websocket 4 times, polling once: client <code>connect</code> and the upgrade race each other. On the server, <code>connection</code> always fires on polling.</p>
<p><strong>The race, measured</strong> — the client emits <code>thread:join</code> at <code>connect</code>:</p>
<div class="out">$ node race.mjs
SAI  (await rồi mới on):
ĐÚNG (on trước, await bên trong):
   server nhận thread:join { id: 7 }
(dòng nào không có "server nhận" là event đã RƠI MẤT — không lỗi, không log)</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// BẪY: handler connection await 50 ms rồi mới đăng ký on('thread:join'); client emit NGAY khi connect</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const [ten, cong, handler] of [
  ['SAI  (await rồi mới on)', 19441, async (s) =&gt; { await cho(50); s.on('thread:join', (d) =&gt; console.log('   server nhận thread:join', d)); }],
  ['ĐÚNG (on trước, await bên trong)', 19442, (s) =&gt; { s.on('thread:join', async (d) =&gt; { await cho(50); console.log('   server nhận thread:join', d); }); }],
]) {
  const io = new Server(cong); io.on('connection', handler);
  const c = ketNoi('http://localhost:' + cong);
  c.on('connect', () =&gt; c.emit('thread:join', { id: 7 }));
  console.log(ten + ':');
  await cho(400);
  c.close(); io.close();
}
console.log('(dòng nào không có "server nhận" là event đã RƠI MẤT — không lỗi, không log)');
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-4-eventemitter" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.4 — EventEmitter</span><span class="lc-sub">Why an event with no listener is simply not delivered</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Authentication: middleware runs before connection</span><span class="lc-sub">What io.use() can reject before connection ever fires</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>connection</code> event</span><span class="v">Server-side, fires once per socket after middleware passes.</span></div>
  <div class="kv"><span class="k"><code>connect</code> event</span><span class="v">Client-side, fires when the sid has been received.</span></div>
  <div class="kv"><span class="k"><code>upgrade</code> event</span><span class="v">The transport switched from polling to WebSocket.</span></div>
  <div class="kv"><span class="k"><code>socket.rooms</code></span><span class="v">The set of rooms a socket is in; at connect, only its own id.</span></div>
  <div class="kv"><span class="k">Registration order</span><span class="v">join rooms → presence → handlers → disconnect, in that order.</span></div>
  <div class="kv"><span class="k">Synchronous body</span><span class="v">No <code>await</code> between registrations, so no early event is missed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>&quot;Connect&quot; is three events in ~9ms: server <code>connection</code>, client <code>connect</code>, server <code>upgrade</code>.</li><li>At <code>connection</code> time the transport is polling, middleware has passed, and only the socket's own room is joined.</li><li>The canonical handler order is join rooms → update presence → register handlers → attach <code>disconnect</code>.</li><li>Keep the registration steps synchronous — an <code>await</code> between them can drop an event that arrives first.</li><li>Do not assume WebSocket yet; the upgrade lands a few ms later.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API</span><span class="lc-sub">socket.io/docs/v4/server-api — <code>io.on(&#39;connection&#39;)</code>, <code>socket.data</code>, <code>socket.join</code>. Tra khi cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middleware</span><span class="lc-sub">socket.io/docs/v4/middlewares — cách <code>io.use()</code> chạy TRƯỚC <code>connection</code>, và làm gì khi middleware fail (client thấy <code>connect_error</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — EventEmitter</span><span class="lc-sub">nodejs.org/api/events.html — cơ chế underlying của <code>socket.on(...)</code> và tại sao event trước handler đăng ký bị bỏ qua.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — presence and the O(N²) trap</span><span class="lc-sub">/courses/socket-io/learn${REF} — kho này chọn cấu trúc bốn bước ở trên vì lý do đo được trong Chương 4.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Connect: năm event trong chín mili giây</h2>
<p class="lead">Mục 0 vẽ bốn tầng. Chương này theo một connection duy nhất qua chúng từ sinh đến diệt. Bài 1.1 đo lúc sinh: cái gì fire, theo thứ tự nào, ở phía nào, và bạn được phép giả định gì khi nào.</p>

<h3>Phép đo</h3>
<pre><code class="language-js">const events = [];
const t0 = performance.now();
const T = () => Math.round(performance.now() - t0);

io.on('connection', s => {
  events.push([T(), 'server: connection', s.id, s.conn.transport.name]);
  s.conn.on('upgrade', t => events.push([T(), 'server: upgrade', s.id, t.name]));
});

const c = ioc(&#96;http://localhost:\${port}&#96;);
c.on('connect', () =&gt; events.push([T(), 'client: connect', c.id]));
</code></pre>

<div class="out">--- normal connect ---
26 | server: connection | wk01tAXjhacshcBLAAAB | polling
35 | client: connect    | wk01tAXjhacshcBLAAAB
35 | server: upgrade    | wk01tAXjhacshcBLAAAB | websocket
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">t=26ms</span><span class="lz-t">server: <code>connection</code></span><span class="lz-d">Handshake xong. Client đã gửi POST HTTP đầu tiên, server đã cấp sid, JWT (nếu có) đã kiểm. <code>s.conn.transport.name</code> vẫn là <code>polling</code> tại đây — <em>upgrade chưa xảy ra</em>.</span></div>
<div class="lz-step"><span class="lz-k">t=35ms</span><span class="lz-t">client: <code>connect</code></span><span class="lz-d">Client thấy CONNECT packet của socket.io (frame 2 ở bài 0.3). Nhận sid từ server. Lúc này <code>c.id</code> có giá trị — trước đó là <code>undefined</code>.</span></div>
<div class="lz-step"><span class="lz-k">t=35ms</span><span class="lz-t">server: <code>upgrade</code> → websocket</span><span class="lz-d">Client mở WebSocket connection, engine.io hoán transport. Từ giờ tất cả frame đi qua WS thay vì HTTP polling. Đây là event chỉ ở tầng 2 — code tầng 4 KHÔNG cần biết.</span></div>
</div>

<h3>Cái bạn ĐƯỢC PHÉP giả định trong handler <code>connection</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">socket có sid</span><span class="lz-lnote"><code>s.id</code> có giá trị — bạn có thể log, gán vào bảng, dùng làm key. Nó KHÔNG đổi trong đời connection này (nhưng SẼ đổi nếu reconnect — xem bài 1.5)</span></div>
<div class="lz-layer"><span class="lz-lname">middleware auth đã chạy</span><span class="lz-lnote">Nếu bạn khai <code>io.use(...)</code>, nó đã pass. <code>socket.data.user</code> (kho này set từ JWT) đã có mặt. Không cần kiểm null</span></div>
<div class="lz-layer"><span class="lz-lname">chưa join room nào</span><span class="lz-lnote">Socket mặc định chỉ join room mang chính sid của nó (thứ cho phép <code>io.to(sid).emit(...)</code>). Muốn join room khác thì phải gọi <code>socket.join(&#39;user:42&#39;)</code> ở handler này</span></div>
</div>

<h3>Cái bạn KHÔNG được giả định</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">transport không đảm bảo là WebSocket</span><span class="lz-lnote"><code>s.conn.transport.name</code> là <code>&#39;polling&#39;</code> tại thời điểm <code>connection</code> fire. Upgrade chưa xảy ra. Chưa gì phụ thuộc điều này, nhưng đừng log &quot;WebSocket client connected&quot; ở đây — sẽ nói dối 3-5% trường hợp (nhóm không upgrade được)</span></div>
<div class="lz-layer"><span class="lz-lname">client chưa thấy <code>connect</code></span><span class="lz-lnote">Có 9ms giữa <code>connection</code> ở server và <code>connect</code> ở client. Nếu bạn <code>socket.emit(&#39;init:data&#39;, ...)</code> trong handler <code>connection</code>, event ấy xếp hàng và gửi ngay sau. Client sẽ nhận nó — nhưng trong khoảng đó, client chưa gắn được handler nào</span></div>
<div class="lz-layer"><span class="lz-lname">client sẽ ở lại</span><span class="lz-lnote">Client có thể mất kết nối 100ms sau (chớp mạng, đóng tab). <code>connection</code> handler chạy trên MỘT khoảnh khắc, không phải trên MỘT phiên</span></div>
</div>

<h3>Mã pattern chuẩn của kho này</h3>
<pre><code class="language-ts">// messaging.socket.ts
io.on('connection', async (socket) =&gt; {
  const userId = socket.data.userId as number;

  // 1. gia nhap cac room can thiet
  socket.join(&#96;user:\${userId}&#96;);

  // 2. cap nhat presence — chi den nguoi can biet
  onlineUserIds.add(userId);
  const audience = await getFriendsAndThreadPeers(userId);
  emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });

  // 3. gan cac handler
  socket.on('thread:join', handleThreadJoin);
  socket.on('thread:leave', handleThreadLeave);
  // ...

  // 4. handler cho disconnect
  socket.on('disconnect', async (reason) =&gt; {
    onlineUserIds.delete(userId);
    const audience2 = await getFriendsAndThreadPeers(userId);
    emitPresenceTo(audience2, { userId, online: false, lastSeen: Date.now() });
    logger.info('socket disconnect', { userId, reason });
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Bốn bước — theo thứ tự này.</strong> (1) Join room trước, để <em>các event khác</em> emit tới room đúng chỗ. (2) Cập nhật presence. (3) Đăng ký handler cho các message client sẽ gửi. (4) Handler <code>disconnect</code> để dọn dẹp. Kho này làm đủ bốn — bỏ bước nào cũng có bug hoặc leak.</p>
</div>

<h3>Chỗ có race conditions</h3>
<pre><code class="language-ts">// BUG: client emit 'thread:join' TRUOC khi server dang ky handler
io.on('connection', async (socket) =&gt; {
  await fetchUser(socket.data.userId);           // ~50ms — client CO the emit trong khoang nay
  socket.on('thread:join', handleThreadJoin);    // handler dang ky quá muon
});

// FIX: dang ky handler NGAY, roi await
io.on('connection', async (socket) =&gt; {
  socket.on('thread:join', async (data, ack) =&gt; {
    const user = await fetchUser(socket.data.userId);
    handleThreadJoin(user, data, ack);
  });
});
</code></pre>

<p>Socket.IO buffer packet ở tầng 2 khi handler chưa đăng ký? <strong>KHÔNG</strong>. Event tới trước khi handler đăng ký sẽ bị bỏ qua âm thầm. Điều này khác Node.js EventEmitter (cũng vậy) nhưng khác cách client mong đợi (họ nghĩ emit là send).</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>connection</code> handler như một &quot;init user session&quot; async khối lớn.</strong> Handler chạy đồng bộ, và một <code>await fetch()</code> ở đây tạo cửa sổ ~50-200ms mà event client gửi vào ĐÃ bị mất. Đăng ký handler NGAY, defer async logic vào INSIDE handler.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Vòng đời &quot;connect&quot; là ba event trong ~9ms — server <code>connection</code> (transport là polling, middleware đã pass, chưa join room), client <code>connect</code> (nhận sid), server <code>upgrade</code> (chuyển sang WebSocket) — và pattern chuẩn của handler <code>connection</code> là join room → cập nhật presence → đăng ký handler → gắn disconnect, theo đúng thứ tự đó, không có <code>await</code> giữa các bước đăng ký.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Log một mốc thời gian ở server <code>connection</code>, client <code>connect</code>, và server <code>upgrade</code>; đo cửa sổ ~9ms giữa chúng.</li>
<li>Trong handler <code>connection</code>, in <code>socket.conn.transport.name</code> (là <code>polling</code>) và <code>socket.rooms</code> (chỉ có id của chính socket) để xác nhận cái bạn được phép giả định ở đó.</li>
<li>Viết handler theo đúng thứ tự chuẩn — join room, cập nhật presence, đăng ký handler, gắn <code>disconnect</code> — rồi chèn một <code>await</code> giữa hai bước đăng ký và lập luận về event giờ có thể lọt qua.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã đo được cửa sổ ba event và nói được vì sao không có <code>await</code> giữa các bước đăng ký.</p></div>

<h3>🔬 Đo thật: năm event, và một thứ tự không cố định</h3>
<p>socket.io 4.8.3, Node 22, mili giây tính từ lúc gọi <code>io()</code> — engine open, middleware, connection, client upgrade/connect:</p>
<div class="out"> 12 client: gọi io()  c.id = undefined  connected = false
 28 client: engine open (tầng 2)
 35 server: middleware io.use        transport=polling
 36 server: connection   id=weYKClRjO8LngmXyAAAA  transport=polling  rooms=["weYKClRjO8LngmXyAAAA"]
 39 client: upgrade → websocket
 40 client: connect      id=weYKClRjO8LngmXyAAAA  transport=websocket
 40 client: nhận init — gửi ngay trong handler connection
 40 server: upgrade → websocket</div>
<p>Năm event từ engine open tới client connect trong khoảng 12 ms trên máy của khoá. Client nhận <code>init</code> (emit ngay trong handler connection) cùng lúc với <code>connect</code>. Trước đó <code>c.id</code> là <code>undefined</code>.</p>
<p>Cùng probe chạy năm lần, chỉ in transport của client lúc <code>connect</code>:</p>
<div class="out"> 34 client: connect      id=oetr6F_YHqIFctyiAAAA  transport=websocket
 36 client: connect      id=5KpZ0KyCkQweasgzAAAA  transport=websocket
 34 client: connect      id=DtoEYg6tFHp0aGD2AAAA  transport=websocket
 68 client: connect      id=tDb0JZsiPKNOL3w1AAAA  transport=polling
 39 client: connect      id=bwiUW8oIHsp_d5iGAAAA  transport=websocket</div>
<p>Websocket 4 lần, polling 1 lần: <code>connect</code> ở client và cú upgrade đua nhau. Ở server, <code>connection</code> luôn chạy khi còn polling.</p>
<p><strong>Race, đo thật</strong> — client emit <code>thread:join</code> ngay lúc <code>connect</code>:</p>
<div class="out">$ node race.mjs
SAI  (await rồi mới on):
ĐÚNG (on trước, await bên trong):
   server nhận thread:join { id: 7 }
(dòng nào không có "server nhận" là event đã RƠI MẤT — không lỗi, không log)</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// BẪY: handler connection await 50 ms rồi mới đăng ký on('thread:join'); client emit NGAY khi connect</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const [ten, cong, handler] of [
  ['SAI  (await rồi mới on)', 19441, async (s) =&gt; { await cho(50); s.on('thread:join', (d) =&gt; console.log('   server nhận thread:join', d)); }],
  ['ĐÚNG (on trước, await bên trong)', 19442, (s) =&gt; { s.on('thread:join', async (d) =&gt; { await cho(50); console.log('   server nhận thread:join', d); }); }],
]) {
  const io = new Server(cong); io.on('connection', handler);
  const c = ketNoi('http://localhost:' + cong);
  c.on('connect', () =&gt; c.emit('thread:join', { id: 7 }));
  console.log(ten + ':');
  await cho(400);
  c.close(); io.close();
}
console.log('(dòng nào không có "server nhận" là event đã RƠI MẤT — không lỗi, không log)');
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-4-eventemitter" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.4 — EventEmitter</span><span class="lc-sub">Vì sao event không có ai nghe thì không được giao</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Xác thực: middleware chạy TRƯỚC connection</span><span class="lc-sub">io.use() từ chối được gì trước khi connection kịp chạy</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">event <code>connection</code></span><span class="v">Phía server, fire một lần mỗi socket sau khi middleware pass.</span></div>
  <div class="kv"><span class="k">event <code>connect</code></span><span class="v">Phía client, fire khi đã nhận được sid.</span></div>
  <div class="kv"><span class="k">event <code>upgrade</code></span><span class="v">Transport đã chuyển từ polling sang WebSocket.</span></div>
  <div class="kv"><span class="k"><code>socket.rooms</code></span><span class="v">Tập room một socket đang ở; lúc connect chỉ có id của chính nó.</span></div>
  <div class="kv"><span class="k">Thứ tự đăng ký</span><span class="v">join room → presence → handler → disconnect, theo thứ tự đó.</span></div>
  <div class="kv"><span class="k">Thân handler đồng bộ</span><span class="v">Không <code>await</code> giữa các bước đăng ký, để không bỏ lỡ event sớm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>&quot;Connect&quot; là ba event trong ~9ms: server <code>connection</code>, client <code>connect</code>, server <code>upgrade</code>.</li><li>Lúc <code>connection</code>, transport là polling, middleware đã pass, và chỉ room của chính socket được join.</li><li>Thứ tự handler chuẩn: join room → cập nhật presence → đăng ký handler → gắn <code>disconnect</code>.</li><li>Giữ các bước đăng ký đồng bộ — một <code>await</code> ở giữa có thể làm rớt event tới trước.</li><li>Chưa được giả định WebSocket; upgrade tới vài ms sau.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API</span><span class="lc-sub">socket.io/docs/v4/server-api — <code>io.on(&#39;connection&#39;)</code>, <code>socket.data</code>, <code>socket.join</code>. Tra khi cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middleware</span><span class="lc-sub">socket.io/docs/v4/middlewares — cách <code>io.use()</code> chạy TRƯỚC <code>connection</code>, và làm gì khi middleware fail (client thấy <code>connect_error</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — EventEmitter</span><span class="lc-sub">nodejs.org/api/events.html — cơ chế bên dưới <code>socket.on(...)</code> và tại sao event trước handler đăng ký bị bỏ qua.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — presence và bẫy O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — kho này chọn cấu trúc bốn bước ở trên vì lý do đo được trong Chương 4.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Four disconnect reasons, each with a different response|||1.2 — Bốn lý do disconnect, mỗi cái đáp lại khác nhau',
      slug: 'io-1-2-disconnect',
      type: 'VIDEO',
      description: 'Đo bằng probe: `s.disconnect(true)` cho client &quot;io server disconnect&quot;, `c.close()` cho &quot;io client disconnect&quot;, transport close cho &quot;transport close&quot;, ping timeout cho &quot;ping timeout&quot;. Mỗi cái đòi hỏi phản ứng riêng.',
      content: `
${G01_2}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Four disconnect reasons, each with a different response</h2>
<p class="lead">The <code>disconnect</code> event on both sides gives a <code>reason</code> string. There are six possible values total; four are common and each carries different operational meaning. Getting them right decides whether reconnect is automatic, whether presence UI flickers, and whether you accidentally leak resources.</p>

<h3>Measured on the sandbox</h3>
<pre><code class="language-js">// scenario 1: server forces disconnect
io.on('connection', s =&gt; s.disconnect(true));
// -&gt; client sees: 'io server disconnect'

// scenario 2: client calls close
c.close();
// -&gt; server sees: 'client namespace disconnect'
// -&gt; client sees: 'io client disconnect'

// scenario 3: transport close (network drop, kill server)
srv.closeAllConnections();
// -&gt; server sees: 'transport close' (if it survives)
// -&gt; client sees: 'transport close'

// scenario 4: ping timeout (network dead, no clean close)
// -&gt; only the SURVIVING side sees: 'ping timeout'  (after pingInterval + pingTimeout: 45 s default, 85 s in this repo)
</code></pre>

<h3>Four reasons and what each means</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">io server disconnect</span><span class="lz-nsub">you called <code>socket.disconnect(true)</code></span></span>
<span class="lz-nbody"><strong>Deliberate — no automatic reconnect.</strong> The client will NOT try to reconnect. Use this when a user logs out, or is kicked out of a feature. To reconnect, the client must call <code>c.connect()</code> tay.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">io client disconnect</span><span class="lz-nsub">the client called <code>c.close()</code></span></span>
<span class="lz-nbody"><strong>Deliberate — no automatic reconnect.</strong> The user closed it themselves — a closed tab, a logout route change, or a <code>useEffect</code> cleanup. The server should clear presence IMMEDIATELY.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">transport close</span><span class="lz-nsub">an abnormal TCP close</span></span>
<span class="lz-nbody"><strong>Unexpected — it WILL reconnect on its own.</strong> A killed server, lost Wi-Fi, a fresh deploy. The client backs off and retries by itself. The server should wait a moment before wiping all state — the client may well be back within 2 seconds.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping timeout</span><span class="lz-nsub">the network died quietly</span></span>
<span class="lz-nbody"><strong>Unexpected — it WILL reconnect on its own.</strong> There is no FIN packet at all — just ping/pong expiring after <code>pingTimeout</code>. This is the slow kind: 25 s pingInterval + 60 s pingTimeout = an 85 s wait in this repo (45 s with the defaults). The UI has to choose: wait the full 85 s before showing &quot;offline&quot;, or use a shorter timeout for UX purposes.</span>
</div>
</div>

<h3>Your response table, reason by reason</h3>
<div class="out">reason                          reconnect?  presence update?  clean up state?
io server disconnect            KHONG       NGAY              NGAY
io client disconnect            KHONG       NGAY              NGAY
transport close                 CO          DEBOUNCE 2s       DEBOUNCE 60s
ping timeout                    CO          DEBOUNCE 2s       DEBOUNCE 60s
transport error                 CO          DEBOUNCE 2s       DEBOUNCE 60s
parse error                     KHONG       NGAY              NGAY (voi log SEV)
</div>

<div class="callout warn">
<p><strong>Not debouncing the &quot;offline&quot; presence is the main UX bug here.</strong> A user moves from Wi-Fi to 4G — you see <code>disconnect(transport close)</code>, drop their presence to offline IMMEDIATELY and broadcast <code>presence:update</code> to 20 friends. 800ms later the socket reconnects and presence goes back to online. The result: their friends watch the avatar flicker grey-green — a false alarm. Debouncing 2 seconds before broadcasting &quot;offline&quot; fixes it.</p>
</div>

<h3>Ba pattern debounce presence</h3>
<pre><code class="language-ts">// pattern 1: debounce O(n) — mot timer moi user
const offlineTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('disconnect', (reason) =&gt; {
  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // 2s debounce truoc khi bao offline
    const timer = setTimeout(() =&gt; {
      onlineUserIds.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
      offlineTimers.delete(userId);
    }, 2000);
    offlineTimers.set(userId, timer);
  } else {
    // disconnect chu dong — bao NGAY
    onlineUserIds.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// khi reconnect, huy timer
io.on('connection', (socket) =&gt; {
  const timer = offlineTimers.get(userId);
  if (timer) { clearTimeout(timer); offlineTimers.delete(userId); }
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
});
</code></pre>

<h3>Why the <code>disconnect</code> handler receives a <code>reason</code>, not an <code>error</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>reason</code> is a descriptive string</span><span class="lz-lnote">Six string values. You <code>switch (reason)</code> on them in code — you do not <code>catch (err)</code>. This is a deliberate API decision: every disconnect is &quot;normal&quot;, not an exception</span></div>
<div class="lz-layer"><span class="lz-lname">a disconnect caused by an auth failure</span><span class="lz-lnote">never reaches the <code>disconnect</code> handler. If the <code>io.use()</code> middleware rejects, the client sees <code>connect_error</code>. That is a SEPARATE event — <code>disconnect</code> only fires for sockets that connected successfully</span></div>
<div class="lz-layer"><span class="lz-lname">side effect trong <code>disconnect</code></span><span class="lz-lnote">It runs synchronously and is not async-safe. If you <code>await</code> a Prisma query, a later event (during a reconnect, say) can happen before the cleanup finishes. Use a lock or a queue in that case</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — clearing state IMMEDIATELY on seeing <code>disconnect</code>.</strong> Switching Wi-Fi → 4G produces <code>transport close</code>, and 800ms later the client is back. If you delete <code>onlineUserIds</code> immediately, the presence UI flaps. If you delete <code>currentThread</code> immediately, the client must re-join on reconnect and sees stale messages. Debounce; do not delete on the spot.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The six reasons of <code>disconnect</code> split into two groups — the deliberate ones (io server/client disconnect, parse error) do not reconnect and need cleanup IMMEDIATELY, while the unexpected ones (transport close, ping timeout, transport error) reconnect AUTOMATICALLY and need a 2s presence debounce plus 60s state cleanup so the UI does not flap when a user changes networks.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Trigger as many reasons as you can and log them in <code>socket.on('disconnect', reason =&gt; ...)</code>: close the tab (transport close), call <code>socket.disconnect()</code> on the server (io server disconnect), kill the network (ping timeout).</li>
<li>Sort each reason into deliberate (no reconnect, clean up now) versus unexpected (auto-reconnect, debounce).</li>
<li>Implement a ~2s presence debounce plus a ~60s state cleanup and watch the presence dot stop flapping when you toggle wifi off and on.</li>
</ol>
<p><strong>Done when:</strong> you can predict the reason string for three scenarios and chose cleanup-now versus debounce for each.</p></div>

<h3>🔬 Measured: nine ways to die, the reason on both sides</h3>
<p>socket.io 4.8.3, Node 22. <code>pingInterval</code>/<code>pingTimeout</code> shortened to 1000/1000 so a frozen peer is detected in seconds. <code>active</code> is <code>socket.active</code> on the client — <code>true</code> means it will reconnect on its own:</p>
<div class="out">$ node ly-do.mjs
1) server gọi socket.disconnect(true)
   server: "server namespace disconnect"
   client: "io server disconnect"   · active=false (KHÔNG nối lại)
2) client gọi socket.disconnect()
   server: "client namespace disconnect"
   client: "io client disconnect"   · active=false (KHÔNG nối lại)
3) gửi một packet hỏng lên server
   server: "forced close"
   client: "transport close"   · active=true (TỰ nối lại)
4) middleware io.use() từ chối (auth fail)
   server: (không có event disconnect)
   client: "connect_error: unauthorized"   · active=false (KHÔNG nối lại)
5a) tiến trình CLIENT bị kill -9
   server: "transport close"
   client: (không có event disconnect)
5b) tiến trình SERVER bị kill -9
   server: (không có event disconnect)
   client: "transport close"   · active=true (TỰ nối lại)
6a) CLIENT đông cứng — server chờ ping/pong
   server: "ping timeout"
   client: (không có event disconnect)   · sau 2.0 s
6b) SERVER đông cứng — client chờ ping
   server: (không có event disconnect)
   client: "ping timeout"   · active=true (TỰ nối lại)   · sau 2.0 s
7) server gọi io.close() (deploy, khởi động lại)
   server: "server shutting down"
   client: "transport close"   · active=true (TỰ nối lại)</div>
<p>What the numbers say: deliberate disconnects (1, 2) are <code>active=false</code>. A rejected middleware (4) never produces <code>disconnect</code> — only <code>connect_error</code>. A killed process (5) is noticed at once (the OS closes TCP for it); a frozen one (6) only after <code>pingInterval + pingTimeout</code>, and only by the survivor. A malformed packet (3) made the server close with <code>forced close</code>, and the client reconnected. A graceful <code>io.close()</code> (7, a deploy) is <code>server shutting down</code> on the server and <code>transport close</code> — with reconnect — on the client.</p>
<p><strong>On the wire, in a real Chromium:</strong> the client disconnects, reconnects by hand, then the server kicks it:</p>
<div class="out">   38 ms  ↑  2probe
   40 ms  ↓  3probe
  142 ms  ↑  5
 1240 ms  ↑  41
 1256 ms  ×  close
 1847 ms  ↑  2probe
 1847 ms  ↓  3probe
 1950 ms  ↑  5
 3047 ms  ↓  41
 3047 ms  ×  close</div>
<p><code>41</code> = engine.io MESSAGE + socket.io DISCONNECT. A deliberate disconnect is announced by that packet; a dead process or a dead network sends nothing.</p>
<p><strong>One network switch, measured</strong> — a TCP proxy cuts every connection at 1.00 s; <code>minh</code> watches <code>lan</code>'s presence:</p>
<div class="out">$ node flap.mjs
── KHÔNG debounce
 0.01 s minh thấy: lan 🟢 online
 0.01 s lan: connect
 1.00 s &gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP
 1.00 s server: lan disconnect "transport close"
 1.00 s minh thấy: lan ⚪ offline
 2.00 s minh thấy: lan 🟢 online
 2.00 s lan: connect
 4.20 s &gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()
 4.21 s server: lan disconnect "client namespace disconnect"
 4.21 s minh thấy: lan ⚪ offline
── debounce 2 s cho reason bất ngờ
 0.01 s minh thấy: lan 🟢 online
 0.01 s lan: connect
 1.00 s &gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP
 1.00 s server: lan disconnect "transport close"
 1.91 s server: lan quay lại kịp — huỷ hẹn giờ offline
 1.91 s lan: connect
 4.20 s &gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()
 4.20 s server: lan disconnect "client namespace disconnect"
 4.20 s minh thấy: lan ⚪ offline</div>
<p>Without debounce: offline, then online again a moment later — the flicker. With a 2 s debounce on unexpected reasons: the timer is cancelled on reconnect and nobody sees offline; a real logout still shows offline immediately.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Đổi mạng (Wi-Fi → 4G) giả lập bằng một proxy TCP cắt mọi kết nối. minh quan sát presence của lan — có và không có debounce 2 s.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
let t0; const T = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).padStart(5) + ' s';

async function chay(ten, cong, debounce) {
  console.log(&#96;── \${ten}&#96;);
  const io = new Server(cong); const hen = new Map();
  const bao = (user, online) =&gt; io.to('quan-sat').emit('presence', { user, online });
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.user;
    if (u === 'minh') return s.join('quan-sat');
    if (hen.has(u)) { clearTimeout(hen.get(u)); hen.delete(u); console.log(T(), &#96;server: \${u} quay lại kịp — huỷ hẹn giờ offline&#96;); }
    else bao(u, true);
    s.on('disconnect', (ly) =&gt; {
      console.log(T(), &#96;server: \${u} disconnect "\${ly}"&#96;);
      const batNgo = ['transport close', 'ping timeout', 'transport error'].includes(ly);
      if (debounce &amp;&amp; batNgo) hen.set(u, setTimeout(() =&gt; { hen.delete(u); bao(u, false); }, 2000));
      else bao(u, false);
    });
  });
  <span class="tok-comment">// proxy TCP: lan đi qua đây; doiMang() cắt mọi đường ống, như rớt Wi-Fi rồi bắt 4G</span>
  const ong = new Set();
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  const minh = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 'minh' } });
  minh.on('presence', (p) =&gt; console.log(T(), &#96;minh thấy: \${p.user} \${p.online ? '🟢 online' : '⚪ offline'}&#96;));
  await cho(300);
  t0 = Date.now();
  const lan = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { auth: { user: 'lan' } });
  lan.on('connect', () =&gt; console.log(T(), 'lan: connect'));
  await cho(1000);
  console.log(T(), '&gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP');
  for (const x of ong) x.destroy(); ong.clear();
  await cho(3200);
  console.log(T(), '&gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()');
  lan.disconnect();
  await cho(400);
  minh.close(); io.close(); proxy.close();
}
await chay('KHÔNG debounce', 19452, false);
await chay('debounce 2 s cho reason bất ngờ', 19454, true);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-1-bat-tay" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.1 — Three-way handshake and closing a connection</span><span class="lc-sub">The FIN a deliberate close sends — and why a frozen peer sends nothing</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, connection pools and timeouts in your code</span><span class="lc-sub">Why only a timeout can detect a silently dead peer</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">disconnect reason</span><span class="v">The string passed to the <code>disconnect</code> handler explaining why.</span></div>
  <div class="kv"><span class="k">io server disconnect</span><span class="v">Server called <code>socket.disconnect()</code> — no auto-reconnect.</span></div>
  <div class="kv"><span class="k">io client disconnect</span><span class="v">Client called <code>socket.disconnect()</code> — no auto-reconnect.</span></div>
  <div class="kv"><span class="k">transport close / ping timeout / transport error</span><span class="v">Unexpected — the client auto-reconnects.</span></div>
  <div class="kv"><span class="k">Presence debounce</span><span class="v">Wait ~2s before marking offline so a quick reconnect does not flap.</span></div>
  <div class="kv"><span class="k">State cleanup delay</span><span class="v">~60s before tearing down server state, in case the user returns.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>disconnect</code> hands you a reason, not an error — the reason decides your response.</li><li>Deliberate reasons (io server/client disconnect, parse error) do not reconnect: clean up immediately.</li><li>Unexpected reasons (transport close, ping timeout, transport error) auto-reconnect: debounce instead.</li><li>Use ~2s presence debounce plus ~60s state cleanup so the UI does not flap on network changes.</li><li>There is no error object because most disconnects are normal, not failures.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — disconnect reasons</span><span class="lc-sub">socket.io/docs/v4/client-socket-instance/#disconnect — sáu chuỗi reason, mỗi cái có định nghĩa chính xác về khi nào fire và có reconnect không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Page Visibility API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API — <code>visibilitychange</code> event, cho bạn biết tab đang khuất — hữu ích cho debounce chuyển tab thay vì network</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — presence and the O(N²) trap</span><span class="lc-sub">/courses/socket-io/learn${REF} — sau khi bạn xử lý reason đúng, presence vẫn còn bẫy N²</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Bốn lý do disconnect, mỗi cái đáp lại khác nhau</h2>
<p class="lead">Event <code>disconnect</code> ở cả hai phía đưa cho bạn một chuỗi <code>reason</code>. Có sáu giá trị tổng cộng; bốn cái phổ biến và mỗi cái mang ý nghĩa vận hành khác nhau. Làm đúng quyết định reconnect có tự động không, presence UI có flap không, và bạn có bị leak resource không.</p>

<h3>Đo trong hộp cát</h3>
<pre><code class="language-js">// scenario 1: server ep disconnect
io.on('connection', s =&gt; s.disconnect(true));
// -&gt; client see: 'io server disconnect'

// scenario 2: client goi close
c.close();
// -&gt; server see: 'client namespace disconnect'
// -&gt; client see: 'io client disconnect'

// scenario 3: transport close (mat mang, kill server)
srv.closeAllConnections();
// -&gt; server see: 'transport close' (neu con song)
// -&gt; client see: 'transport close'

// scenario 4: ping timeout (mang chet am tham)
// -&gt; chi phia CON SONG see: 'ping timeout'  (sau pingInterval + pingTimeout: 45 s mac dinh, 85 s o kho nay)
</code></pre>

<h3>Bốn reason và ý nghĩa</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">io server disconnect</span><span class="lz-nsub">bạn gọi <code>socket.disconnect(true)</code></span></span>
<span class="lz-nbody"><strong>Chủ động — không tự reconnect.</strong> Client sẽ KHÔNG cố kết nối lại. Dùng khi user đăng xuất, hoặc kick khỏi một feature. Nếu muốn reconnect thì client phải gọi <code>c.connect()</code> tay.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">io client disconnect</span><span class="lz-nsub">client gọi <code>c.close()</code></span></span>
<span class="lz-nbody"><strong>Chủ động — không tự reconnect.</strong> User tự đóng — có thể do đóng tab, chuyển route logout, hay <code>useEffect</code> cleanup. Server nên dọn presence NGAY.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">transport close</span><span class="lz-nsub">TCP close bất thường</span></span>
<span class="lz-nbody"><strong>Bất ngờ — SẼ tự reconnect.</strong> Kill server, mất Wi-Fi, deploy mới. Client tự backoff và thử lại. Server nên đợi một ngắn trước khi dọn hết state — có thể client quay lại trong 2 giây.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping timeout</span><span class="lz-nsub">network chết âm thầm</span></span>
<span class="lz-nbody"><strong>Bất ngờ — SẼ tự reconnect.</strong> Không có FIN packet nào — chỉ ping/pong hết hạn sau <code>pingTimeout</code>. Đây là kiểu chậm chạp: 25 s pingInterval + 60 s pingTimeout = đợi 85 s ở kho này (45 s với mặc định). UI phải chọn: hoặc chờ 85 s để hiện &quot;offline&quot;, hoặc dùng timeout ngắn hơn cho UX.</span>
</div>
</div>

<h3>Bảng phản ứng của bạn cho mỗi reason</h3>
<div class="out">reason                          reconnect?  presence update?  clean up state?
io server disconnect            KHONG       NGAY              NGAY
io client disconnect            KHONG       NGAY              NGAY
transport close                 CO          DEBOUNCE 2s       DEBOUNCE 60s
ping timeout                    CO          DEBOUNCE 2s       DEBOUNCE 60s
transport error                 CO          DEBOUNCE 2s       DEBOUNCE 60s
parse error                     KHONG       NGAY              NGAY (voi log SEV)
</div>

<div class="callout warn">
<p><strong>Không debounce presence &quot;offline&quot; là bug UX chính.</strong> Người dùng chuyển từ Wi-Fi sang 4G — bạn thấy <code>disconnect(transport close)</code>, cập nhật presence xuống offline NGAY, phát <code>presence:update</code> cho 20 bạn. 800ms sau socket reconnect, presence lại lên online. Kết quả: bạn bè của họ thấy avatar nhấp nháy xám-xanh — báo động sai. Debounce 2 giây trước khi phát &quot;offline&quot; giải quyết.</p>
</div>

<h3>Ba pattern debounce presence</h3>
<pre><code class="language-ts">// pattern 1: debounce O(n) — mot timer moi user
const offlineTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('disconnect', (reason) =&gt; {
  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // 2s debounce truoc khi bao offline
    const timer = setTimeout(() =&gt; {
      onlineUserIds.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
      offlineTimers.delete(userId);
    }, 2000);
    offlineTimers.set(userId, timer);
  } else {
    // disconnect chu dong — bao NGAY
    onlineUserIds.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// khi reconnect, huy timer
io.on('connection', (socket) =&gt; {
  const timer = offlineTimers.get(userId);
  if (timer) { clearTimeout(timer); offlineTimers.delete(userId); }
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
});
</code></pre>

<h3>Vì sao <code>disconnect</code> handler nhận <code>reason</code>, không <code>error</code></h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>reason</code> là chuỗi mô tả</span><span class="lz-lnote">Sáu giá trị chuỗi. Bạn <code>switch (reason)</code> trong code — không phải <code>catch (err)</code>. Đây là quyết định API cố ý: mọi disconnect là &quot;bình thường&quot;, không phải exception</span></div>
<div class="lz-layer"><span class="lz-lname">disconnect vì auth fail</span><span class="lz-lnote">KHÔNG đến <code>disconnect</code> handler. Nếu middleware <code>io.use()</code> reject, client thấy <code>connect_error</code>. Đó là event RIÊNG — <code>disconnect</code> chỉ fire cho socket đã connect thành công</span></div>
<div class="lz-layer"><span class="lz-lname">side effect trong <code>disconnect</code></span><span class="lz-lnote">Chạy đồng bộ, không phải async safe. Nếu <code>await</code> query Prisma, event sau (như trong lúc reconnect) có thể diễn ra trước khi cleanup xong. Dùng lock hoặc queue trong trường hợp đó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dọn dẹp state NGAY khi thấy <code>disconnect</code>.</strong> Chuyển Wi-Fi → 4G tạo <code>transport close</code>, và 800ms sau client quay lại. Nếu bạn xoá <code>onlineUserIds</code> ngay, presence UI flap. Nếu bạn xoá <code>currentThread</code> ngay, client phải re-join khi reconnect và thấy tin nhắn cũ. Debounce, không xoá ngay.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Sáu reason của <code>disconnect</code> chia hai nhóm — chủ động (io server/client disconnect, parse error) không tự reconnect và cần dọn NGAY, còn bất ngờ (transport close, ping timeout, transport error) TỰ ĐỘNG reconnect và cần debounce presence 2s + state cleanup 60s để tránh UI flap khi user chuyển mạng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Kích hoạt càng nhiều reason càng tốt và log trong <code>socket.on('disconnect', reason =&gt; ...)</code>: đóng tab (transport close), gọi <code>socket.disconnect()</code> ở server (io server disconnect), ngắt mạng (ping timeout).</li>
<li>Xếp mỗi reason vào chủ động (không reconnect, dọn ngay) hay bất ngờ (tự reconnect, debounce).</li>
<li>Cài một debounce presence ~2s cộng một state cleanup ~60s và xem chấm presence ngừng nhấp nháy khi bạn tắt rồi bật lại wifi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đoán được chuỗi reason cho ba kịch bản và chọn dọn-ngay hay debounce cho mỗi cái.</p></div>

<h3>🔬 Đo thật: chín cách chết, reason ở cả hai phía</h3>
<p>socket.io 4.8.3, Node 22. <code>pingInterval</code>/<code>pingTimeout</code> rút còn 1000/1000 để bên đông cứng bị phát hiện trong vài giây. <code>active</code> là <code>socket.active</code> phía client — <code>true</code> nghĩa là nó sẽ tự nối lại:</p>
<div class="out">$ node ly-do.mjs
1) server gọi socket.disconnect(true)
   server: "server namespace disconnect"
   client: "io server disconnect"   · active=false (KHÔNG nối lại)
2) client gọi socket.disconnect()
   server: "client namespace disconnect"
   client: "io client disconnect"   · active=false (KHÔNG nối lại)
3) gửi một packet hỏng lên server
   server: "forced close"
   client: "transport close"   · active=true (TỰ nối lại)
4) middleware io.use() từ chối (auth fail)
   server: (không có event disconnect)
   client: "connect_error: unauthorized"   · active=false (KHÔNG nối lại)
5a) tiến trình CLIENT bị kill -9
   server: "transport close"
   client: (không có event disconnect)
5b) tiến trình SERVER bị kill -9
   server: (không có event disconnect)
   client: "transport close"   · active=true (TỰ nối lại)
6a) CLIENT đông cứng — server chờ ping/pong
   server: "ping timeout"
   client: (không có event disconnect)   · sau 2.0 s
6b) SERVER đông cứng — client chờ ping
   server: (không có event disconnect)
   client: "ping timeout"   · active=true (TỰ nối lại)   · sau 2.0 s
7) server gọi io.close() (deploy, khởi động lại)
   server: "server shutting down"
   client: "transport close"   · active=true (TỰ nối lại)</div>
<p>Số đo nói gì: ngắt chủ động (1, 2) cho <code>active=false</code>. Middleware từ chối (4) KHÔNG sinh <code>disconnect</code> — chỉ <code>connect_error</code>. Tiến trình bị giết (5) được biết ngay (hệ điều hành đóng TCP thay nó); tiến trình đông cứng (6) chỉ bị phát hiện sau <code>pingInterval + pingTimeout</code>, và chỉ phía còn sống thấy. Packet hỏng (3) làm server đóng với <code>forced close</code>, client tự nối lại. <code>io.close()</code> có trật tự (7, lúc deploy) là <code>server shutting down</code> ở server và <code>transport close</code> — có nối lại — ở client.</p>
<p><strong>Trên dây, trong Chromium thật:</strong> client tự ngắt, nối lại bằng tay, rồi server đá ra:</p>
<div class="out">   38 ms  ↑  2probe
   40 ms  ↓  3probe
  142 ms  ↑  5
 1240 ms  ↑  41
 1256 ms  ×  close
 1847 ms  ↑  2probe
 1847 ms  ↓  3probe
 1950 ms  ↑  5
 3047 ms  ↓  41
 3047 ms  ×  close</div>
<p><code>41</code> = engine.io MESSAGE + socket.io DISCONNECT. Ngắt chủ động được báo trước bằng packet này; tiến trình chết hay mạng chết thì không gửi gì.</p>
<p><strong>Một lần đổi mạng, đo thật</strong> — proxy TCP cắt mọi kết nối ở giây 1,00; <code>minh</code> theo dõi presence của <code>lan</code>:</p>
<div class="out">$ node flap.mjs
── KHÔNG debounce
 0.01 s minh thấy: lan 🟢 online
 0.01 s lan: connect
 1.00 s &gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP
 1.00 s server: lan disconnect "transport close"
 1.00 s minh thấy: lan ⚪ offline
 2.00 s minh thấy: lan 🟢 online
 2.00 s lan: connect
 4.20 s &gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()
 4.21 s server: lan disconnect "client namespace disconnect"
 4.21 s minh thấy: lan ⚪ offline
── debounce 2 s cho reason bất ngờ
 0.01 s minh thấy: lan 🟢 online
 0.01 s lan: connect
 1.00 s &gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP
 1.00 s server: lan disconnect "transport close"
 1.91 s server: lan quay lại kịp — huỷ hẹn giờ offline
 1.91 s lan: connect
 4.20 s &gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()
 4.20 s server: lan disconnect "client namespace disconnect"
 4.20 s minh thấy: lan ⚪ offline</div>
<p>Không debounce: offline rồi online lại ngay sau đó — nhấp nháy. Debounce 2 s cho reason bất ngờ: hẹn giờ bị huỷ khi nối lại, không ai thấy offline; đăng xuất thật vẫn báo offline ngay.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Đổi mạng (Wi-Fi → 4G) giả lập bằng một proxy TCP cắt mọi kết nối. minh quan sát presence của lan — có và không có debounce 2 s.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
let t0; const T = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).padStart(5) + ' s';

async function chay(ten, cong, debounce) {
  console.log(&#96;── \${ten}&#96;);
  const io = new Server(cong); const hen = new Map();
  const bao = (user, online) =&gt; io.to('quan-sat').emit('presence', { user, online });
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.user;
    if (u === 'minh') return s.join('quan-sat');
    if (hen.has(u)) { clearTimeout(hen.get(u)); hen.delete(u); console.log(T(), &#96;server: \${u} quay lại kịp — huỷ hẹn giờ offline&#96;); }
    else bao(u, true);
    s.on('disconnect', (ly) =&gt; {
      console.log(T(), &#96;server: \${u} disconnect "\${ly}"&#96;);
      const batNgo = ['transport close', 'ping timeout', 'transport error'].includes(ly);
      if (debounce &amp;&amp; batNgo) hen.set(u, setTimeout(() =&gt; { hen.delete(u); bao(u, false); }, 2000));
      else bao(u, false);
    });
  });
  <span class="tok-comment">// proxy TCP: lan đi qua đây; doiMang() cắt mọi đường ống, như rớt Wi-Fi rồi bắt 4G</span>
  const ong = new Set();
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  const minh = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 'minh' } });
  minh.on('presence', (p) =&gt; console.log(T(), &#96;minh thấy: \${p.user} \${p.online ? '🟢 online' : '⚪ offline'}&#96;));
  await cho(300);
  t0 = Date.now();
  const lan = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { auth: { user: 'lan' } });
  lan.on('connect', () =&gt; console.log(T(), 'lan: connect'));
  await cho(1000);
  console.log(T(), '&gt;&gt;&gt; lan đổi mạng: cắt mọi kết nối TCP');
  for (const x of ong) x.destroy(); ong.clear();
  await cho(3200);
  console.log(T(), '&gt;&gt;&gt; lan bấm Đăng xuất: lan.disconnect()');
  lan.disconnect();
  await cho(400);
  minh.close(); io.close(); proxy.close();
}
await chay('KHÔNG debounce', 19452, false);
await chay('debounce 2 s cho reason bất ngờ', 19454, true);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-1-bat-tay" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.1 — Bắt tay ba bước và đóng kết nối</span><span class="lc-sub">Gói FIN của một lần đóng chủ động — và vì sao bên bị đông cứng không gửi gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-5-keepalive-pool" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.5 — Keep-alive, pool kết nối và timeout trong code của bạn</span><span class="lc-sub">Vì sao chỉ một timeout mới phát hiện được bên kia chết âm thầm</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">disconnect reason</span><span class="v">Chuỗi truyền vào handler <code>disconnect</code> giải thích vì sao.</span></div>
  <div class="kv"><span class="k">io server disconnect</span><span class="v">Server gọi <code>socket.disconnect()</code> — không tự reconnect.</span></div>
  <div class="kv"><span class="k">io client disconnect</span><span class="v">Client gọi <code>socket.disconnect()</code> — không tự reconnect.</span></div>
  <div class="kv"><span class="k">transport close / ping timeout / transport error</span><span class="v">Bất ngờ — client tự reconnect.</span></div>
  <div class="kv"><span class="k">Debounce presence</span><span class="v">Chờ ~2s trước khi đánh dấu offline để một reconnect nhanh không nhấp nháy.</span></div>
  <div class="kv"><span class="k">Độ trễ dọn state</span><span class="v">~60s trước khi phá state phía server, phòng khi user quay lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>disconnect</code> trao cho bạn một reason, không phải error — reason quyết định phản ứng.</li><li>Reason chủ động (io server/client disconnect, parse error) không reconnect: dọn ngay.</li><li>Reason bất ngờ (transport close, ping timeout, transport error) tự reconnect: debounce.</li><li>Dùng debounce presence ~2s cộng dọn state ~60s để UI không nhấp nháy khi đổi mạng.</li><li>Không có object error vì hầu hết disconnect là bình thường, không phải lỗi.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — disconnect reasons</span><span class="lc-sub">socket.io/docs/v4/client-socket-instance/#disconnect — sáu chuỗi reason, mỗi cái có định nghĩa chính xác về khi nào fire và có reconnect không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Page Visibility API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API — <code>visibilitychange</code> event, cho bạn biết tab đang khuất — hữu ích cho debounce chuyển tab thay vì network</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — presence và bẫy O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — sau khi bạn xử lý reason đúng, presence vẫn còn bẫy N²</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Reconnect: what actually happens, and what does not|||1.3 — Reconnect: cái thật sự xảy ra và cái KHÔNG',
      slug: 'io-1-3-reconnect',
      type: 'VIDEO',
      description: 'Client tự backoff 1s, 2s, 4s (max 5s), vô hạn. Nhưng sid MỚI, rooms TRỐNG, và event trong khoảng disconnect BỊ MẤT. Đo bằng probe kill-restart server.',
      content: `
${G01_3}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Reconnect: what actually happens, and what does not</h2>
<p class="lead">Socket.IO&#39;s reconnect is famously &quot;automatic&quot;. That&#39;s true, but incomplete — the client library handles the connection, and everything above the connection (rooms, subscriptions, pending events) is your problem. Measuring this now saves a class of subtle bugs later.</p>

<h3>The probe: kill and restart server</h3>
<pre><code class="language-js">const c = ioc('http://localhost:9999', {
  reconnectionDelay: 500,           // start with 500ms
  reconnectionDelayMax: 500,        // don't back off (for measurement)
});
c.on('connect', () =&gt; log('connect', c.id.substring(0,10)));
c.io.on('reconnect_attempt', n =&gt; log('reconnect_attempt', n));
c.io.on('reconnect', n =&gt; log('reconnect', n));

// kill server, restart 1.2s later
</code></pre>

<div class="out">t=  0 client: connect            wk01tAXjhac
t=313 kill server...
t=314 client: disconnect         transport close
t=814 client: reconnect_attempt  1
t=815 client: reconnect_error    connect ECONNREFUSED
t=1314 client: reconnect_attempt 2
t=1514 restart server...
t=1520 client: reconnect_attempt 3
t=1553 client: reconnect         3
t=1553 client: connect           JAlAcN05WmD    &lt;- SID MOI
</div>

<h3>Three things change on a reconnect</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · a new sid</span><span class="lz-nsub">wk01tA... → JAlAcN...</span></span>
<span class="lz-nbody">The server sees this as an ENTIRELY NEW connection. <code>io.on(&#39;connection&#39;)</code> fires again. If you keep a <code>Map&lt;sid, userId&gt;</code>map, the old entry stays there until disconnect fires — and disconnect can fire AFTER the new connect, purely as a matter of timing.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · empty rooms</span><span class="lz-nsub">everything must be re-joined</span></span>
<span class="lz-nbody">The new socket belongs to no room except the one named after its sid. If the client had previously joined <code>thread:42</code>, they are NOT there any more. The server has to re-join automatically based on <code>userId</code>, or the client has to re-send <code>thread:join</code> — your call.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · pending events are LOST</span><span class="lz-nsub">emits during the disconnect window</span></span>
<span class="lz-nbody">If the server <code>io.to(&#39;thread:42&#39;).emit(&#39;msg&#39;, ...)</code> while the client is disconnected (400ms → 1553ms on my probe), that event goes to WHICHEVER sockets are in the room at that moment — and this client is not one of them. A reconnect does NOT replay anything. Chapter 6 teaches the &quot;fetch-since-last-seen&quot; pattern.</span>
</div>
</div>

<h3>The server-side pattern for re-joining rooms automatically</h3>
<pre><code class="language-ts">// Track cac room USER da join, khong phai SOCKET
const userRooms = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId as number;

  // socket luon join room user:XX
  socket.join(&#96;user:\${userId}&#96;);

  // re-join cac room khac ma user nay tung o
  const rooms = userRooms.get(userId);
  if (rooms) for (const r of rooms) socket.join(r);

  socket.on('thread:join', (threadId) =&gt; {
    socket.join(&#96;thread:\${threadId}&#96;);
    let s = userRooms.get(userId); if (!s) userRooms.set(userId, s = new Set());
    s.add(&#96;thread:\${threadId}&#96;);
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Track by USER, not by SOCKET.</strong> Because the sid changes on every reconnect, a map keyed by sid leaks (you cannot delete the old entry, because no event reliably tells you to). A map keyed by <code>userId</code> survives reconnects, and you clear it once every socket belonging to that user has disconnected.</p>
</div>

<h3>Client-side: c.id is <code>undefined</code> in the <code>reconnect</code></h3>
<pre><code class="language-ts">c.io.on('reconnect', (n) =&gt; {
  console.log(c.id);  // undefined — reconnect fire TRUOC khi 'connect' fire
});

// FIX: doi 'connect'
c.on('connect', () =&gt; {
  console.log(c.id);  // co gia tri
});
</code></pre>

<p>This is a subtle piece of timing: <code>reconnect</code> on the manager fires at layer 2 (the engine.io reconnect), while <code>connect</code> on the socket fires at layer 3 (the socket.io CONNECT packet has arrived). The manager knows first. I only measured this because my probe crashed the first time.</p>

<h3>Default backoff vs a configured one</h3>
<pre><code class="language-ts">// default
const c = io(url, {
  reconnection: true,           // ON, khong tat neu khong biet minh dang lam gi
  reconnectionAttempts: Infinity,   // khong bo cuoc
  reconnectionDelay: 1000,      // bat dau 1s
  reconnectionDelayMax: 5000,   // toi da 5s
  randomizationFactor: 0.5,     // +/-50% jitter
});
</code></pre>

<div class="out">Attempt   delay (ms, +jitter)
1         500 - 1500
2         1000 - 3000
3         2000 - 5000    &lt;- da cham cap max
4         4000 - 5000    &lt;- 8000 +/- 4000, roi CAT o 5000
5+        5000           &lt;- moi client cho DUNG 5000 (tran ap SAU jitter)

Jitter la CO Y — 1000 client cung reconnect KHONG lam DDoS server luc cap dien lai
</div>

<div class="pitfall">
<p><strong>Trap — switching reconnection off.</strong> Someone writes <code>{ reconnection: false }</code> to make debugging easier in dev, then forgets. In prod: 5s of lost Wi-Fi means the user has to reload the page. Only disable it in tests, or when you are writing your own reconnect logic (very rare).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Reconnection is automatic at LAYER 2 (exponential backoff 1-5s, ±50% jitter, unlimited attempts), but at LAYERS 3 &amp; 4 the sid changes, the rooms are empty and pending events are lost — so application state must be tracked by <code>userId</code> and never by <code>socket.id</code>, and anything that matters needs a &quot;fetch-since-last-seen&quot; pattern rather than faith that the emit arrived.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run a client, then kill and restart the server; log the reconnect attempts and watch the client recover on its own.</li>
<li>Across the reconnect, confirm the three things that change: a new <code>socket.id</code>, empty <code>socket.rooms</code>, and pending emits lost — then re-join the rooms inside the <code>connection</code> handler.</li>
<li>Replace any <code>socket.id</code>-keyed state with <code>userId</code>-keyed state and confirm it survives the reconnect.</li>
</ol>
<p><strong>Done when:</strong> you have seen an automatic reconnect and can list the three things that change across it.</p></div>

<h3>🔬 Measured: kill -9, restart, and what really comes back</h3>
<p>socket.io 4.8.3, Node 22, <code>reconnectionDelay</code> = <code>reconnectionDelayMax</code> = 500 ms. The server is killed at ~0.7 s and restarted 1.2 s later:</p>
<div class="out">$ node restart.mjs
server: connection id=-Ne6EQ1wSpGEM0C6AAAA rooms=["-Ne6EQ1wSpGEM0C6AAAA"]
t= 427 client: connect            id=-Ne6EQ1wSpGEM0C6AAAA
t= 712 &gt;&gt;&gt; kill -9 server
t= 714 client: disconnect         transport close
t=1217 client: reconnect_attempt  1
t=1222 client: reconnect_error    xhr poll error
t=1724 client: reconnect_attempt  2
t=1729 client: reconnect_error    xhr poll error
t=1914 &gt;&gt;&gt; khởi động lại server
t=2231 client: reconnect_attempt  3
t=2241 client: reconnect          3   (c.id lúc này = undefined)
server: connection id=xybuPyUoMY9eYfakAAAA rooms=["xybuPyUoMY9eYfakAAAA"]
t=2249 client: connect            id=xybuPyUoMY9eYfakAAAA
t=3415 client: disconnect         io client disconnect</div>
<p><code>reconnect</code> (the Manager, layer 2) fires BEFORE <code>connect</code> (the Socket, layer 3) — and <code>c.id</code> is still <code>undefined</code> there. The new connection has a NEW id and only its own room. (On this machine the failed attempts report <code>xhr poll error</code>, not <code>ECONNREFUSED</code>.)</p>
<p><strong>The real backoff</strong> — 40 clients pointed at a port with no server, default options:</p>
<div class="out">$ node backoff.mjs
lần thử   chờ thấp nhất   chờ cao nhất   trung bình   (ms, 40 client)
   1            563           1480          985
   2           1124           2983         1923
   3           2256           5002         4017
   4           4583           5003         4991
   5           5000           5003         5002
   6           5000           5003         5002
   7           5000           5005         5002</div>
<p>1000 × 2<sup>n−1</sup> ± 50 %, then capped at 5000 — the cap is applied AFTER the jitter, so attempt 4 is 4000–5000 ms and from attempt 5 every client waits exactly 5 s.</p>
<p><strong>Three things a reconnect does not restore</strong> — a TCP proxy cuts the client at 1 s while the server emits into <code>thread:42</code> every 100 ms:</p>
<div class="out">$ node mat.mjs
── 1) ngây thơ: join một lần lúc đầu
   server: connection id=6YsoCY6j41Td3bhPAAAA rooms=["6YsoCY6j41Td3bhPAAAA"]
   server: connection id=N33c2swB0LQV7vAQAAAB rooms=["N33c2swB0LQV7vAQAAAB"]
   server đã phát 34 tin · client nhận 9 · MẤT 25 (từ #10 tới #34)
── 2) join lại theo userId trong connection
   server: connection id=nGg4f9ZPxQiepr0cAAAC rooms=["nGg4f9ZPxQiepr0cAAAC"]
   server: connection id=JUlTmIzH9C7lSlQiAAAD rooms=["JUlTmIzH9C7lSlQiAAAD","thread:42"]
   server đã phát 34 tin · client nhận 28 · MẤT 6 (từ #10 tới #15)
── 3) join lại + hỏi "since" tin cuối đã thấy
   server: connection id=Wup2MkbrWCA4guRsAAAE rooms=["Wup2MkbrWCA4guRsAAAE"]
   server: connection id=jtJjBBiJtcPnBBbqAAAF rooms=["jtJjBBiJtcPnBBbqAAAF","thread:42"]
   client: bù 8 tin đã lỡ
   server đã phát 34 tin · client nhận 34 · MẤT 0</div>
<p>Naive: new id + empty rooms ⇒ the stream is gone for good. Re-join by userId: the stream resumes, but what was emitted meanwhile is lost. Re-join + <code>since</code> (fetch-since-last-seen): 0 lost.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba thứ đổi qua một reconnect: id mới · room trống · tin gửi lúc vắng mặt MẤT. Proxy TCP cắt kết nối ở giây 1; server phát tin vào thread:42 mỗi 100 ms.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
async function chay(ten, cong, kieu) {
  const io = new Server(cong); const lichSu = []; let seq = 0; const daJoin = new Map(); <span class="tok-comment">  // daJoin: userId → Set room (KHOÁ THEO USER)</span>
  const phat = setInterval(() =&gt; { seq++; lichSu.push(seq); io.to('thread:42').emit('msg', seq); }, 100);
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.userId;
    if (kieu !== 'ngay-tho') for (const r of daJoin.get(u) ?? []) s.join(r);            <span class="tok-comment">  // join lại theo userId</span>
    s.on('thread:join', (r) =&gt; { s.join(r); (daJoin.get(u) ?? daJoin.set(u, new Set()).get(u)).add(r); });
    s.on('since', (tu, ack) =&gt; ack(lichSu.filter((x) =&gt; x &gt; tu)));                        <span class="tok-comment">  // "fetch-since-last-seen"</span>
    console.log(&#96;   server: connection id=\${s.id} rooms=\${JSON.stringify([...s.rooms])}&#96;);
  });
  const ong = new Set();
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  const nhan = []; let lan = 0;
  const c = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { auth: { userId: 7 } });
  c.on('msg', (n) =&gt; nhan.push(n));
  c.on('connect', () =&gt; {
    lan++;
    if (lan === 1) c.emit('thread:join', 'thread:42');
    else if (kieu === 'bu') c.emit('since', Math.max(0, ...nhan), (thieu) =&gt; { nhan.push(...thieu); console.log(&#96;   client: bù \${thieu.length} tin đã lỡ&#96;); });
  });
  console.log(&#96;── \${ten}&#96;);
  await cho(1000); for (const x of ong) x.destroy(); ong.clear();
  await cho(2500); clearInterval(phat); await cho(300);
  const coDu = new Set(nhan), mat = lichSu.filter((x) =&gt; !coDu.has(x));
  console.log(&#96;   server đã phát \${lichSu.length} tin · client nhận \${coDu.size} · MẤT \${mat.length}\${mat.length ? &#96; (từ #\${mat[0]} tới #\${mat.at(-1)})&#96; : ''}&#96;);
  c.close(); io.close(); proxy.close();
}
await chay('1) ngây thơ: join một lần lúc đầu', 19462, 'ngay-tho');
await chay('2) join lại theo userId trong connection', 19464, 'join-lai');
await chay('3) join lại + hỏi "since" tin cuối đã thấy', 19466, 'bu');
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.3 — Authenticate once, authorize every time</span><span class="lc-sub">Measurement 4: what a reconnect restores — and connectionStateRecovery measured four ways</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-2-ack-retry" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.2 — At-least-once with ack + retry</span><span class="lc-sub">The delivery guarantee that fetch-since-last-seen builds on</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reconnection</span><span class="v">Layer-2 automatic retry after the connection drops.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">1s, 2s, 4s… capped ~5s, with ±50% jitter, unlimited attempts.</span></div>
  <div class="kv"><span class="k">New sid</span><span class="v">The reconnected socket has a new <code>socket.id</code>; the old rooms are gone.</span></div>
  <div class="kv"><span class="k">Re-join on connect</span><span class="v">The server re-adds the socket to its rooms on every <code>connection</code>.</span></div>
  <div class="kv"><span class="k">userId keying</span><span class="v">Track application state by <code>userId</code>, never <code>socket.id</code>.</span></div>
  <div class="kv"><span class="k">fetch-since-last-seen</span><span class="v">Pull what was missed rather than trust an in-flight emit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Reconnect is automatic at layer 2: exponential backoff 1-5s, jitter, unlimited attempts.</li><li>Across a reconnect the sid changes, the rooms are empty, and pending events are lost.</li><li>Re-join rooms in the <code>connection</code> handler every time; never rely on the old membership.</li><li>Track state by <code>userId</code>, not <code>socket.id</code>, so it survives the new socket.</li><li>Anything important needs a fetch-since-last-seen, not faith that the emit arrived.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Manager options</span><span class="lc-sub">socket.io/docs/v4/client-options/#manager-options — mọi option reconnect, cùng default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ để server GIỮ state (rooms + missed events) trong RAM một khoảng — trade off: memory. Không dùng ở kho này</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks and delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern &quot;fetch-since-last-seen&quot; đối lập với &quot;emit and hope&quot;.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.3: what reconnecting restores, measured four ways</span><span class="lc-sub">The Node.js course unplugs a proxy for 1.5 s while 5 messages are sent: default 0/5 and a new id; rejoin + REST catch-up 5/5; connectionStateRecovery 5/5 with the same id — but 0/5 after a server restart, and recovered = false behind @socket.io/redis-adapter (what this site uses). The REST catch-up stays the safety net.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Reconnect: cái thật sự xảy ra và cái KHÔNG</h2>
<p class="lead">Reconnect của Socket.IO nổi tiếng là &quot;tự động&quot;. Đúng, nhưng không đủ — thư viện client xử lý cái CONNECTION, còn mọi thứ TRÊN connection (room, subscription, event chưa gửi) là việc của bạn. Đo cái này bây giờ tránh một lớp bug tinh vi về sau.</p>

<h3>Probe: kill và restart server</h3>
<pre><code class="language-js">const c = ioc('http://localhost:9999', {
  reconnectionDelay: 500,           // bat dau 500ms
  reconnectionDelayMax: 500,        // khong backoff (de do)
});
c.on('connect', () =&gt; log('connect', c.id.substring(0,10)));
c.io.on('reconnect_attempt', n =&gt; log('reconnect_attempt', n));
c.io.on('reconnect', n =&gt; log('reconnect', n));

// kill server, restart sau 1.2s
</code></pre>

<div class="out">t=  0 client: connect            wk01tAXjhac
t=313 kill server...
t=314 client: disconnect         transport close
t=814 client: reconnect_attempt  1
t=815 client: reconnect_error    connect ECONNREFUSED
t=1314 client: reconnect_attempt 2
t=1514 restart server...
t=1520 client: reconnect_attempt 3
t=1553 client: reconnect         3
t=1553 client: connect           JAlAcN05WmD    &lt;- SID MOI
</div>

<h3>Ba điều thay đổi khi reconnect</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · sid mới</span><span class="lz-nsub">wk01tA... → JAlAcN...</span></span>
<span class="lz-nbody">Server thấy đây là connection HOÀN TOÀN MỚI. <code>io.on(&#39;connection&#39;)</code> fire lại. Nếu bạn có bảng <code>Map&lt;sid, userId&gt;</code>, entry cũ vẫn nằm đó cho tới khi disconnect fire — mà disconnect có thể fire SAU khi connect mới, do timing.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · rooms trống</span><span class="lz-nsub">phải re-join tất</span></span>
<span class="lz-nbody">Socket mới không thuộc room nào ngoài room mang sid của nó. Nếu client trước đó join <code>thread:42</code>, họ KHÔNG còn ở đó nữa. Server phải tự động re-join dựa trên <code>userId</code>, hoặc client phải phát lại <code>thread:join</code> — quyết định của bạn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · pending events MẤT</span><span class="lz-nsub">emit trong khoảng disconnect</span></span>
<span class="lz-nbody">Nếu server <code>io.to(&#39;thread:42&#39;).emit(&#39;msg&#39;, ...)</code> trong lúc client đang disconnect (400ms → 1553ms trên probe), event ấy đi tới CÁC socket còn ở room lúc đó — không có client này. Reconnect KHÔNG có replay. Chương 6 dạy pattern &quot;fetch-since-last-seen&quot;.</span>
</div>
</div>

<h3>Pattern server-side để re-join room tự động</h3>
<pre><code class="language-ts">// Track cac room USER da join, khong phai SOCKET
const userRooms = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId as number;

  // socket luon join room user:XX
  socket.join(&#96;user:\${userId}&#96;);

  // re-join cac room khac ma user nay tung o
  const rooms = userRooms.get(userId);
  if (rooms) for (const r of rooms) socket.join(r);

  socket.on('thread:join', (threadId) =&gt; {
    socket.join(&#96;thread:\${threadId}&#96;);
    let s = userRooms.get(userId); if (!s) userRooms.set(userId, s = new Set());
    s.add(&#96;thread:\${threadId}&#96;);
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Track theo USER, không theo SOCKET.</strong> Vì sid đổi mỗi reconnect, một bảng khoá theo sid sẽ leak (không xoá được entry cũ vì bạn không có event chắc chắn). Bảng khoá theo <code>userId</code> tồn tại xuyên reconnect và bạn dọn khi tất cả socket của user ấy disconnect.</p>
</div>

<h3>Client-side: c.id là <code>undefined</code> ở event <code>reconnect</code></h3>
<pre><code class="language-ts">c.io.on('reconnect', (n) =&gt; {
  console.log(c.id);  // undefined — reconnect fire TRUOC khi 'connect' fire
});

// FIX: doi 'connect'
c.on('connect', () =&gt; {
  console.log(c.id);  // co gia tri
});
</code></pre>

<p>Đây là timing subtle: <code>reconnect</code> ở manager fire ở tầng 2 (engine.io reconnect), <code>connect</code> ở socket fire ở tầng 3 (socket.io CONNECT packet đã nhận). Manager biết trước. Đo được vì probe của tôi crash lần đầu.</p>

<h3>Backoff mặc định vs cấu hình</h3>
<pre><code class="language-ts">// default
const c = io(url, {
  reconnection: true,           // ON, khong tat neu khong biet minh dang lam gi
  reconnectionAttempts: Infinity,   // khong bo cuoc
  reconnectionDelay: 1000,      // bat dau 1s
  reconnectionDelayMax: 5000,   // toi da 5s
  randomizationFactor: 0.5,     // +/-50% jitter
});
</code></pre>

<div class="out">Attempt   delay (ms, +jitter)
1         500 - 1500
2         1000 - 3000
3         2000 - 5000    &lt;- da cham cap max
4         4000 - 5000    &lt;- 8000 +/- 4000, roi CAT o 5000
5+        5000           &lt;- moi client cho DUNG 5000 (tran ap SAU jitter)

Jitter la CO Y — 1000 client cung reconnect KHONG lam DDoS server luc cap dien lai
</div>

<div class="pitfall">
<p><strong>Bẫy — tắt reconnection.</strong> Ai đó viết <code>{ reconnection: false }</code> để &quot;dễ debug&quot; ở dev, rồi quên. Prod: mất Wi-Fi 5s = user phải reload trang. Chỉ tắt trong test hoặc khi tự viết reconnect logic (rất hiếm).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Reconnect tự động ở TẦNG 2 (backoff exponential 1-5s, jitter ±50%, vô hạn attempts), nhưng ở TẦNG 3 &amp; 4 sid đổi + rooms trống + pending events mất — nên state của app phải track theo <code>userId</code> chứ không theo <code>socket.id</code>, và data quan trọng phải có pattern &quot;fetch-since-last-seen&quot; hơn là dựa vào emit đến đúng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy một client, rồi kill và restart server; log các lần reconnect và xem client tự hồi phục.</li>
<li>Qua lần reconnect, xác nhận ba thứ thay đổi: <code>socket.id</code> mới, <code>socket.rooms</code> rỗng, và pending emit mất — rồi re-join room trong handler <code>connection</code>.</li>
<li>Thay mọi state khoá theo <code>socket.id</code> bằng state khoá theo <code>userId</code> và xác nhận nó sống sót qua reconnect.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy một reconnect tự động và liệt kê được ba thứ thay đổi qua nó.</p></div>

<h3>🔬 Đo thật: kill -9, khởi động lại, và cái gì thật sự quay về</h3>
<p>socket.io 4.8.3, Node 22, <code>reconnectionDelay</code> = <code>reconnectionDelayMax</code> = 500 ms. Server bị giết ở ~0,7 s rồi bật lại sau 1,2 s:</p>
<div class="out">$ node restart.mjs
server: connection id=-Ne6EQ1wSpGEM0C6AAAA rooms=["-Ne6EQ1wSpGEM0C6AAAA"]
t= 427 client: connect            id=-Ne6EQ1wSpGEM0C6AAAA
t= 712 &gt;&gt;&gt; kill -9 server
t= 714 client: disconnect         transport close
t=1217 client: reconnect_attempt  1
t=1222 client: reconnect_error    xhr poll error
t=1724 client: reconnect_attempt  2
t=1729 client: reconnect_error    xhr poll error
t=1914 &gt;&gt;&gt; khởi động lại server
t=2231 client: reconnect_attempt  3
t=2241 client: reconnect          3   (c.id lúc này = undefined)
server: connection id=xybuPyUoMY9eYfakAAAA rooms=["xybuPyUoMY9eYfakAAAA"]
t=2249 client: connect            id=xybuPyUoMY9eYfakAAAA
t=3415 client: disconnect         io client disconnect</div>
<p><code>reconnect</code> (Manager, tầng 2) chạy TRƯỚC <code>connect</code> (Socket, tầng 3) — và ở đó <code>c.id</code> vẫn là <code>undefined</code>. Kết nối mới có id MỚI và chỉ ở room của chính nó. (Trên máy của khoá, lần thử hỏng báo <code>xhr poll error</code>, không phải <code>ECONNREFUSED</code>.)</p>
<p><strong>Backoff thật</strong> — 40 client nối vào một cổng không có server, option mặc định:</p>
<div class="out">$ node backoff.mjs
lần thử   chờ thấp nhất   chờ cao nhất   trung bình   (ms, 40 client)
   1            563           1480          985
   2           1124           2983         1923
   3           2256           5002         4017
   4           4583           5003         4991
   5           5000           5003         5002
   6           5000           5003         5002
   7           5000           5005         5002</div>
<p>1000 × 2<sup>n−1</sup> ± 50 %, rồi chặn trần 5000 — trần áp SAU jitter, nên lần 4 là 4000–5000 ms và từ lần 5 mọi client chờ đúng 5 s.</p>
<p><strong>Ba thứ reconnect không khôi phục</strong> — proxy TCP cắt client ở giây 1 trong lúc server phát vào <code>thread:42</code> mỗi 100 ms:</p>
<div class="out">$ node mat.mjs
── 1) ngây thơ: join một lần lúc đầu
   server: connection id=6YsoCY6j41Td3bhPAAAA rooms=["6YsoCY6j41Td3bhPAAAA"]
   server: connection id=N33c2swB0LQV7vAQAAAB rooms=["N33c2swB0LQV7vAQAAAB"]
   server đã phát 34 tin · client nhận 9 · MẤT 25 (từ #10 tới #34)
── 2) join lại theo userId trong connection
   server: connection id=nGg4f9ZPxQiepr0cAAAC rooms=["nGg4f9ZPxQiepr0cAAAC"]
   server: connection id=JUlTmIzH9C7lSlQiAAAD rooms=["JUlTmIzH9C7lSlQiAAAD","thread:42"]
   server đã phát 34 tin · client nhận 28 · MẤT 6 (từ #10 tới #15)
── 3) join lại + hỏi "since" tin cuối đã thấy
   server: connection id=Wup2MkbrWCA4guRsAAAE rooms=["Wup2MkbrWCA4guRsAAAE"]
   server: connection id=jtJjBBiJtcPnBBbqAAAF rooms=["jtJjBBiJtcPnBBbqAAAF","thread:42"]
   client: bù 8 tin đã lỡ
   server đã phát 34 tin · client nhận 34 · MẤT 0</div>
<p>Ngây thơ: id mới + room trống ⇒ mất hẳn luồng tin. Join lại theo userId: luồng chảy lại, nhưng tin phát lúc vắng mặt vẫn mất. Join lại + <code>since</code> (fetch-since-last-seen): mất 0.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba thứ đổi qua một reconnect: id mới · room trống · tin gửi lúc vắng mặt MẤT. Proxy TCP cắt kết nối ở giây 1; server phát tin vào thread:42 mỗi 100 ms.</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
async function chay(ten, cong, kieu) {
  const io = new Server(cong); const lichSu = []; let seq = 0; const daJoin = new Map(); <span class="tok-comment">  // daJoin: userId → Set room (KHOÁ THEO USER)</span>
  const phat = setInterval(() =&gt; { seq++; lichSu.push(seq); io.to('thread:42').emit('msg', seq); }, 100);
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.userId;
    if (kieu !== 'ngay-tho') for (const r of daJoin.get(u) ?? []) s.join(r);            <span class="tok-comment">  // join lại theo userId</span>
    s.on('thread:join', (r) =&gt; { s.join(r); (daJoin.get(u) ?? daJoin.set(u, new Set()).get(u)).add(r); });
    s.on('since', (tu, ack) =&gt; ack(lichSu.filter((x) =&gt; x &gt; tu)));                        <span class="tok-comment">  // "fetch-since-last-seen"</span>
    console.log(&#96;   server: connection id=\${s.id} rooms=\${JSON.stringify([...s.rooms])}&#96;);
  });
  const ong = new Set();
  const proxy = net.createServer((a) =&gt; { const b = net.connect(cong); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(cong + 1);
  const nhan = []; let lan = 0;
  const c = ketNoi(&#96;http://localhost:\${cong + 1}&#96;, { auth: { userId: 7 } });
  c.on('msg', (n) =&gt; nhan.push(n));
  c.on('connect', () =&gt; {
    lan++;
    if (lan === 1) c.emit('thread:join', 'thread:42');
    else if (kieu === 'bu') c.emit('since', Math.max(0, ...nhan), (thieu) =&gt; { nhan.push(...thieu); console.log(&#96;   client: bù \${thieu.length} tin đã lỡ&#96;); });
  });
  console.log(&#96;── \${ten}&#96;);
  await cho(1000); for (const x of ong) x.destroy(); ong.clear();
  await cho(2500); clearInterval(phat); await cho(300);
  const coDu = new Set(nhan), mat = lichSu.filter((x) =&gt; !coDu.has(x));
  console.log(&#96;   server đã phát \${lichSu.length} tin · client nhận \${coDu.size} · MẤT \${mat.length}\${mat.length ? &#96; (từ #\${mat[0]} tới #\${mat.at(-1)})&#96; : ''}&#96;);
  c.close(); io.close(); proxy.close();
}
await chay('1) ngây thơ: join một lần lúc đầu', 19462, 'ngay-tho');
await chay('2) join lại theo userId trong connection', 19464, 'join-lai');
await chay('3) join lại + hỏi "since" tin cuối đã thấy', 19466, 'bu');
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.3 — Xác thực một lần, phân quyền mọi lần</span><span class="lc-sub">Phép đo 4: kết nối lại khôi phục gì — và connectionStateRecovery đo bốn cách</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-2-ack-retry" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.2 — At-least-once bằng ack + retry</span><span class="lc-sub">Bảo đảm giao hàng mà fetch-since-last-seen dựa vào</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reconnection</span><span class="v">Thử lại tự động ở tầng 2 sau khi connection rớt.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">1s, 2s, 4s… trần ~5s, jitter ±50%, vô hạn attempt.</span></div>
  <div class="kv"><span class="k">sid mới</span><span class="v">Socket reconnect có <code>socket.id</code> mới; room cũ mất.</span></div>
  <div class="kv"><span class="k">Re-join lúc connect</span><span class="v">Server thêm lại socket vào room ở mỗi <code>connection</code>.</span></div>
  <div class="kv"><span class="k">Khoá theo userId</span><span class="v">Track state app theo <code>userId</code>, không bao giờ theo <code>socket.id</code>.</span></div>
  <div class="kv"><span class="k">fetch-since-last-seen</span><span class="v">Kéo về phần đã lỡ thay vì tin vào một emit đang bay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Reconnect tự động ở tầng 2: backoff exponential 1-5s, jitter, vô hạn attempt.</li><li>Qua một reconnect, sid đổi, room rỗng, và pending event mất.</li><li>Re-join room trong handler <code>connection</code> mỗi lần; đừng dựa vào membership cũ.</li><li>Track state theo <code>userId</code>, không theo <code>socket.id</code>, để nó sống sót qua socket mới.</li><li>Thứ gì quan trọng cần fetch-since-last-seen, không phải niềm tin emit đã đến.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Manager options</span><span class="lc-sub">socket.io/docs/v4/client-options/#manager-options — mọi option reconnect, cùng default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ để server GIỮ state (rooms + missed events) trong RAM một khoảng — trade off: memory. Không dùng ở kho này</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern &quot;fetch-since-last-seen&quot; đối lập với &quot;emit and hope&quot;.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.3: kết nối lại khôi phục gì, đo bốn cách</span><span class="lc-sub">Khoá Node.js rút một proxy 1,5 giây trong lúc phát 5 tin: mặc định 0/5 và id mới; vào lại room + bù qua REST 5/5; connectionStateRecovery 5/5 với cùng id — nhưng 0/5 sau khi server khởi động lại, và recovered = false sau @socket.io/redis-adapter (thứ website này dùng). Đường bù qua REST vẫn là lưới an toàn.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Authentication: middleware runs before connection|||1.4 — Xác thực: middleware chạy TRƯỚC connection',
      slug: 'io-1-4-auth',
      type: 'VIDEO',
      description: 'Kho này đọc JWT từ cookie backend_token, header Authorization, hoặc auth.token — dùng lại extractToken() của Express. Auth fail cho client thấy connect_error, không disconnect.',
      content: `
${G01_4}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Authentication: middleware runs before connection</h2>
<p class="lead">Every socket in this repo goes through authentication before its <code>connection</code> event fires. This lesson shows how the auth middleware reads a JWT from the same three places the Express middleware does, and what the client sees when auth fails (spoiler: not <code>disconnect</code>).</p>

<h3>The pattern in <code>messaging.socket.ts</code></h3>
<pre><code class="language-ts">import { extractToken } from '../middleware/auth.js';
import { verifyToken } from '../services/auth.service.js';

io.use(async (socket, next) =&gt; {
  try {
    const token = extractToken({
      cookies: parseCookieHeader(socket.request.headers.cookie),
      headers: {
        authorization: socket.request.headers.authorization,
      },
      auth: (socket.handshake as any).auth,
    });
    if (!token) return next(new Error('missing token'));

    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    socket.data.user   = await fetchUser(payload.userId);
    next();
  } catch (err) {
    next(new Error('unauthorized'));
  }
});
</code></pre>

<div class="callout ok">
<p><strong>Three sources of token, ONE shared function.</strong> This repo re-uses Express&#39;s <code>extractToken()</code> — the same function that knows every token location. Three changes in Express automatically propagate to sockets. No copy-paste, no drift.</p>
</div>

<h3>Three auth failure flows on the wire</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t"><code>next(new Error(&#39;unauthorized&#39;))</code></span><span class="lz-d">Client sees a <code>connect_error</code> event with <code>err.message === &#39;unauthorized&#39;</code>. Socket does NOT connect. <code>connection</code> does NOT fire on the server; <code>connect</code> does NOT fire on the client.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">middleware throws</span><span class="lz-d">NOT the same (measured on 4.8.3): a throw — or a rejected promise from an <code>async</code> middleware — is NOT turned into <code>connect_error</code>. It becomes an unhandled rejection, and Node 22 exits the WHOLE server process (exit code 1, every user disconnected). Wrap the body in <code>try/catch</code>, log, and end every path in <code>next()</code>.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">middleware hangs (no next)</span><span class="lz-d">If you forget <code>next()</code> — even in the success branch — the connection stalls. Measured: the engine.io pipe opens at once, the socket.io CONNECT is never answered; after the server&#39;s <code>connectTimeout</code> (45 s by default) the client gets <code>disconnect &quot;transport close&quot;</code> with <code>active=true</code>, retries, and waits 45 s again — forever. No <code>connect_error</code> at all. Bug &quot;client never connects&quot; is usually here.</span></div>
</div>

<h3>Client-side: reading <code>connect_error</code></h3>
<pre><code class="language-ts">const c = io(url, { auth: { token: getJwt() } });

c.on('connect_error', (err) =&gt; {
  if (err.message === 'unauthorized') {
    logout();
  } else {
    // network error, transport broken, etc.
    // Do NOT log out — user is still logged in
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Do NOT call <code>logout()</code> on EVERY <code>connect_error</code>.</strong> The same event fires for auth failure AND transport error. Distinguish by <code>err.message</code>. Otherwise a 5s Wi-Fi drop kicks the user to /login. Real bug.</p>
</div>

<div class="pitfall">
<p><strong>Pitfall — putting JWT in URL query string.</strong> <code>io(&#39;https://api/?token=xyz&#39;)</code> feels convenient — token goes through on all transports. But URLs sit in nginx access logs and in reverse proxy logs along the way. JWT expiry is short but log retention is long. Use <code>auth: { token }</code> or an httpOnly cookie, not URL.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>io.use()</code> middleware runs BEFORE the <code>connection</code> event, reads the JWT from three places (cookie, <code>Authorization</code> header, <code>handshake.auth.token</code>) through the shared <code>extractToken()</code> helper, and its failure surfaces as <code>connect_error</code> (not <code>disconnect</code>) — client code must distinguish auth failure (log out) from network error (do not log out).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add an <code>io.use()</code> middleware that reads the JWT via <code>extractToken()</code> (cookie, <code>Authorization</code> header, <code>handshake.auth.token</code>) and calls <code>next(err)</code> on failure.</li>
<li>Connect with a bad token and confirm the client sees <code>connect_error</code>, NOT <code>disconnect</code>.</li>
<li>In the client, branch on the error: an auth failure logs out; a network error keeps retrying.</li>
</ol>
<p><strong>Done when:</strong> a bad token surfaces as <code>connect_error</code> and your client logs out only on auth failure.</p></div>

<h3>🔬 Measured: five clients at the door</h3>
<p>socket.io 4.8.3, Node 22, one <code>extractToken()</code> reading cookie → Authorization → <code>handshake.auth</code>:</p>
<div class="out">$ node xac-thuc.mjs
1) auth: { token }
   server: connection — userId=7
   client: connect
2) header Authorization: Bearer …
   server: connection — userId=7
   client: connect
3) cookie token=…
   server: connection — userId=7
   client: connect
4) token sai
   client: connect_error "unauthorized" · active=false
5) không có token
   client: connect_error "missing token" · active=false</div>
<p>All three places work from Node. A rejection is <code>connect_error</code> with your message and <code>active=false</code> — the server's <code>connection</code> never runs, and there is no <code>disconnect</code>.</p>
<p><strong>A middleware that throws</strong> (an <code>async</code> middleware calls <code>JSON.parse</code> on a bad token, no try/catch):</p>
<div class="out">$ node nem.mjs
 0.53 s    server stderr: SyntaxError: Unexpected token 'k', "không-phải-json" is not valid JSON
 0.53 s    server: TIẾN TRÌNH CHẾT — exit code 1
 0.53 s client: connect_error "xhr poll error"
 0.53 s client: disconnect "transport error"</div>
<p><strong>A middleware that forgets <code>next()</code></strong> in the success branch:</p>
<div class="out">$ node treo.mjs
  0.0 s client: engine.io đã mở (tầng 2 OK) — chờ socket.io CONNECT…
 45.0 s client: disconnect "transport close" · connected=false · active=true
 46.2 s client: reconnect_attempt 1 — và vòng lặp bắt đầu lại</div>
<p><strong>The token in the URL</strong> — behind a logging proxy, like nginx:</p>
<div class="out">$ node url.mjs
A) io("…/?token=tok-lan")
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling
   access.log: POST /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=websocket&amp;sid=1zsQot5Tub6elJefAAAA
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
   gói CONNECT (thân request): 0
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
B) io("…", { auth: { token } })
   access.log: GET /socket.io/?EIO=4&amp;transport=polling
   access.log: POST /socket.io/?EIO=4&amp;transport=polling&amp;sid=bzw8zaKQQQU5l638AAAB
   access.log: GET /socket.io/?EIO=4&amp;transport=websocket&amp;sid=bzw8zaKQQQU5l638AAAB
   gói CONNECT (thân request): 0{"token":"tok-lan"}
   access.log: GET /socket.io/?EIO=4&amp;transport=polling&amp;sid=bzw8zaKQQQU5l638AAAB</div>
<p><strong>In a real Chromium</strong> (this repo's 17/09 outage, commit 110097d08): <code>extraHeaders</code> + <code>transports: ['websocket']</code> — the browser's WebSocket API cannot set headers:</p>
<div class="out">server: handshake transport=polling · authorization=Bearer tok-lan · auth.token=(KHÔNG CÓ)
server: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=(KHÔNG CÓ)
server: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=tok-lan</div>
<div class="out"> 264 ms  ↓  0{"sid":"rqSfF5KUkn_6PitYAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"max
 264 ms  ↑  40
 264 ms  ↓  44{"message":"missing token"}
 265 ms  ×  close
 468 ms  ↓  0{"sid":"ABqsOh0CBh_rvV1eAAAC","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"max
 468 ms  ↑  40{"token":"tok-lan"}
 469 ms  ↓  40{"sid":"_d-RP3-VFl9pum9jAAAC"}
 469 ms  ↑  41
 469 ms  ×  close</div>
<p><code>44{"message":"missing token"}</code> is the CONNECT_ERROR packet that <code>next(err)</code> produces. With <code>auth: { token }</code> the token rides in the CONNECT body (<code>40{"token":…}</code>) on every transport.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// io.use() đọc token từ BA chỗ qua MỘT hàm (như extractToken() của kho) — rồi xem client thấy gì khi qua và khi bị từ chối</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const NGUOI = { 'tok-lan': { userId: 7, ten: 'lan' } };                     <span class="tok-comment">  // "cơ sở dữ liệu" token giả</span>
const docCookie = (h = '') =&gt; Object.fromEntries(h.split(';').filter(Boolean).map((p) =&gt; p.trim().split('=')));
function extractToken({ cookies, headers, auth }) {                         <span class="tok-comment">  // một hàm, ba chỗ — thứ tự như middleware Express</span>
  return cookies.token ?? headers.authorization?.replace(/^Bearer /, '') ?? auth?.token;
}
const io = new Server(19471);
io.use((socket, next) =&gt; {
  const token = extractToken({ cookies: docCookie(socket.request.headers.cookie), headers: socket.request.headers, auth: socket.handshake.auth });
  if (!token) return next(new Error('missing token'));
  const u = NGUOI[token];
  if (!u) return next(new Error('unauthorized'));
  socket.data.user = u; next();
});
io.on('connection', (s) =&gt; console.log(&#96;   server: connection — userId=\${s.data.user.userId}&#96;));
const thu = (ten, opts) =&gt; new Promise((xong) =&gt; {
  console.log(ten);
  const c = ketNoi('http://localhost:19471', { ...opts, reconnectionDelay: 300 });
  c.on('connect', () =&gt; { console.log('   client: connect'); c.close(); setTimeout(xong, 50); });
  c.on('connect_error', (e) =&gt; { console.log(&#96;   client: connect_error "\${e.message}" · active=\${c.active}&#96;); setTimeout(() =&gt; { c.close(); xong(); }, 600); });
  c.on('disconnect', (r) =&gt; r !== 'io client disconnect' &amp;&amp; console.log('   client: disconnect', r));
});
await thu('1) auth: { token }', { auth: { token: 'tok-lan' } });
await thu('2) header Authorization: Bearer …', { extraHeaders: { authorization: 'Bearer tok-lan' } });
await thu('3) cookie token=…', { extraHeaders: { cookie: 'theme=dark; token=tok-lan' } });
await thu('4) token sai', { auth: { token: 'tok-gia' } });
await thu('5) không có token', {});
io.close(); process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-5-cat-token-o-dau" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.5 — Where to keep a token in the browser</span><span class="lc-sub">Cookie, memory, storage — and what each one leaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-10-1-log-mac-dinh-bo-sot" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 10.1 — What the default log format leaves out</span><span class="lc-sub">The request line — query string included — is in every access-log line</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>io.use()</code></span><span class="v">Connection middleware that runs BEFORE the <code>connection</code> event.</span></div>
  <div class="kv"><span class="k"><code>extractToken()</code></span><span class="v">Shared helper reading the JWT from cookie, header, or <code>handshake.auth</code>.</span></div>
  <div class="kv"><span class="k"><code>handshake.auth.token</code></span><span class="v">The client-supplied token field in the handshake.</span></div>
  <div class="kv"><span class="k"><code>connect_error</code></span><span class="v">The client event an auth failure surfaces as.</span></div>
  <div class="kv"><span class="k"><code>next(err)</code></span><span class="v">How middleware rejects a connection before it is established.</span></div>
  <div class="kv"><span class="k">Auth vs network error</span><span class="v">Log out on the first; keep retrying on the second.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>io.use()</code> middleware runs before the <code>connection</code> event — reject here and connection never fires.</li><li>Read the JWT through the shared <code>extractToken()</code>: cookie, <code>Authorization</code> header, or <code>handshake.auth.token</code>.</li><li>A rejected connection surfaces as <code>connect_error</code> on the client, not <code>disconnect</code>.</li><li>Client code must distinguish auth failure (log out) from network error (keep retrying).</li><li>Same token extraction as Express, so one auth rule covers both.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middleware</span><span class="lc-sub">socket.io/docs/v4/middlewares — API details with JWT examples.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication course</span><span class="lc-sub">/courses/authentication/learn${REF} — the source of <code>extractToken()</code> and the httpOnly cookie pattern this lesson re-uses.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Xác thực: middleware chạy TRƯỚC connection</h2>
<p class="lead">Mọi socket trong kho này đi qua xác thực trước khi event <code>connection</code> fire. Bài này chỉ cách auth middleware đọc JWT từ ba nơi mà Express middleware cũng đọc, và cái client thấy khi auth fail (spoiler: KHÔNG phải <code>disconnect</code>).</p>

<h3>Pattern trong <code>messaging.socket.ts</code></h3>
<pre><code class="language-ts">import { extractToken } from '../middleware/auth.js';
import { verifyToken } from '../services/auth.service.js';

io.use(async (socket, next) =&gt; {
  try {
    const token = extractToken({
      cookies: parseCookieHeader(socket.request.headers.cookie),
      headers: {
        authorization: socket.request.headers.authorization,
      },
      auth: (socket.handshake as any).auth,
    });
    if (!token) return next(new Error('missing token'));

    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    socket.data.user   = await fetchUser(payload.userId);
    next();
  } catch (err) {
    next(new Error('unauthorized'));
  }
});
</code></pre>

<div class="callout ok">
<p><strong>Ba nơi lấy token, MỘT hàm dùng chung.</strong> Kho này dùng lại <code>extractToken()</code> của middleware Express — cùng một hàm biết mọi chỗ đặt token. Ba thay đổi trong Express tự áp cho socket. Không copy-paste, không lệch nhịp.</p>
</div>

<h3>Ba luồng auth failure trên dây</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t"><code>next(new Error(&#39;unauthorized&#39;))</code></span><span class="lz-d">Client thấy event <code>connect_error</code> với <code>err.message === &#39;unauthorized&#39;</code>. Socket KHÔNG connect. KHÔNG fire <code>connection</code> ở server, KHÔNG fire <code>connect</code> ở client.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">middleware throw</span><span class="lz-d">KHÔNG giống (đo trên 4.8.3): throw — hay promise bị reject của middleware <code>async</code> — KHÔNG được đổi thành <code>connect_error</code>. Nó thành unhandled rejection, và Node 22 tắt CẢ tiến trình server (exit code 1, mọi người dùng rớt). Bọc thân trong <code>try/catch</code>, ghi log, và kết thúc mọi nhánh bằng <code>next()</code>.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">middleware treo (không next)</span><span class="lz-d">Nếu bạn quên <code>next()</code> — kể cả trong nhánh success — connection kẹt. Đo thật: đường ống engine.io mở ngay, packet CONNECT của socket.io không bao giờ được trả lời; sau <code>connectTimeout</code> của server (mặc định 45 s) client nhận <code>disconnect &quot;transport close&quot;</code> với <code>active=true</code>, thử lại, rồi chờ 45 s nữa — mãi mãi. Không có <code>connect_error</code> nào. Bug &quot;client mãi không connect&quot; thường là chỗ này.</span></div>
</div>

<h3>Client-side: đọc <code>connect_error</code></h3>
<pre><code class="language-ts">const c = io(url, { auth: { token: getJwt() } });

c.on('connect_error', (err) =&gt; {
  if (err.message === 'unauthorized') {
    logout();
  } else {
    // network error, transport hong, v.v.
    // KHONG logout — con nguoi con dang nhap
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Đừng gọi <code>logout()</code> trên MỌI <code>connect_error</code>.</strong> Cùng event fire cho auth fail VÀ transport error. Phân biệt bằng <code>err.message</code>. Không thì user mất Wi-Fi 5s = bị đá về login. Bug thực.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng URL query string cho JWT.</strong> <code>io(&#39;https://api/?token=xyz&#39;)</code> thấy tiện — token đi qua ở tất cả transport. Nhưng URL nằm trong access log của nginx + trong các reverse proxy log giữa đường. Token JWT có expiry ngắn nhưng log giữ lâu. Dùng <code>auth: { token }</code> hoặc cookie httpOnly, KHÔNG URL.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Middleware <code>io.use()</code> chạy TRƯỚC event <code>connection</code>, đọc JWT từ ba nơi (cookie, header <code>Authorization</code>, <code>handshake.auth.token</code>) qua hàm <code>extractToken()</code> dùng chung với Express, và fail cho client thấy <code>connect_error</code> (không phải <code>disconnect</code>) — phải phân biệt trong client giữa auth fail (logout) và network error (không logout).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một middleware <code>io.use()</code> đọc JWT qua <code>extractToken()</code> (cookie, header <code>Authorization</code>, <code>handshake.auth.token</code>) và gọi <code>next(err)</code> khi fail.</li>
<li>Kết nối với token sai và xác nhận client thấy <code>connect_error</code>, KHÔNG phải <code>disconnect</code>.</li>
<li>Trong client, rẽ nhánh theo lỗi: auth fail thì logout; network error thì tiếp tục thử lại.</li>
</ol>
<p><strong>Đạt khi:</strong> một token sai hiện ra dưới dạng <code>connect_error</code> và client chỉ logout khi auth fail.</p></div>

<h3>🔬 Đo thật: năm client gõ cửa</h3>
<p>socket.io 4.8.3, Node 22, một <code>extractToken()</code> đọc cookie → Authorization → <code>handshake.auth</code>:</p>
<div class="out">$ node xac-thuc.mjs
1) auth: { token }
   server: connection — userId=7
   client: connect
2) header Authorization: Bearer …
   server: connection — userId=7
   client: connect
3) cookie token=…
   server: connection — userId=7
   client: connect
4) token sai
   client: connect_error "unauthorized" · active=false
5) không có token
   client: connect_error "missing token" · active=false</div>
<p>Cả ba chỗ đều dùng được từ Node. Bị từ chối là <code>connect_error</code> mang thông điệp của bạn, <code>active=false</code> — <code>connection</code> ở server không chạy, và không có <code>disconnect</code> nào.</p>
<p><strong>Middleware ném lỗi</strong> (middleware <code>async</code> gọi <code>JSON.parse</code> trên token hỏng, không try/catch):</p>
<div class="out">$ node nem.mjs
 0.53 s    server stderr: SyntaxError: Unexpected token 'k', "không-phải-json" is not valid JSON
 0.53 s    server: TIẾN TRÌNH CHẾT — exit code 1
 0.53 s client: connect_error "xhr poll error"
 0.53 s client: disconnect "transport error"</div>
<p><strong>Middleware quên <code>next()</code></strong> ở nhánh thành công:</p>
<div class="out">$ node treo.mjs
  0.0 s client: engine.io đã mở (tầng 2 OK) — chờ socket.io CONNECT…
 45.0 s client: disconnect "transport close" · connected=false · active=true
 46.2 s client: reconnect_attempt 1 — và vòng lặp bắt đầu lại</div>
<p><strong>Token trên URL</strong> — sau một proxy ghi log, giống nginx:</p>
<div class="out">$ node url.mjs
A) io("…/?token=tok-lan")
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling
   access.log: POST /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=websocket&amp;sid=1zsQot5Tub6elJefAAAA
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
   gói CONNECT (thân request): 0
   access.log: GET /socket.io/?token=tok-lan&amp;EIO=4&amp;transport=polling&amp;sid=1zsQot5Tub6elJefAAAA
B) io("…", { auth: { token } })
   access.log: GET /socket.io/?EIO=4&amp;transport=polling
   access.log: POST /socket.io/?EIO=4&amp;transport=polling&amp;sid=bzw8zaKQQQU5l638AAAB
   access.log: GET /socket.io/?EIO=4&amp;transport=websocket&amp;sid=bzw8zaKQQQU5l638AAAB
   gói CONNECT (thân request): 0{"token":"tok-lan"}
   access.log: GET /socket.io/?EIO=4&amp;transport=polling&amp;sid=bzw8zaKQQQU5l638AAAB</div>
<p><strong>Trong Chromium thật</strong> (sự cố 17/09 của kho, commit 110097d08): <code>extraHeaders</code> + <code>transports: ['websocket']</code> — WebSocket của trình duyệt không đặt được header:</p>
<div class="out">server: handshake transport=polling · authorization=Bearer tok-lan · auth.token=(KHÔNG CÓ)
server: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=(KHÔNG CÓ)
server: handshake transport=websocket · authorization=(KHÔNG CÓ) · auth.token=tok-lan</div>
<div class="out"> 264 ms  ↓  0{"sid":"rqSfF5KUkn_6PitYAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"max
 264 ms  ↑  40
 264 ms  ↓  44{"message":"missing token"}
 265 ms  ×  close
 468 ms  ↓  0{"sid":"ABqsOh0CBh_rvV1eAAAC","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"max
 468 ms  ↑  40{"token":"tok-lan"}
 469 ms  ↓  40{"sid":"_d-RP3-VFl9pum9jAAAC"}
 469 ms  ↑  41
 469 ms  ×  close</div>
<p><code>44{"message":"missing token"}</code> là packet CONNECT_ERROR do <code>next(err)</code> sinh ra. Với <code>auth: { token }</code>, token đi trong thân CONNECT (<code>40{"token":…}</code>) trên mọi transport.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// io.use() đọc token từ BA chỗ qua MỘT hàm (như extractToken() của kho) — rồi xem client thấy gì khi qua và khi bị từ chối</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const NGUOI = { 'tok-lan': { userId: 7, ten: 'lan' } };                     <span class="tok-comment">  // "cơ sở dữ liệu" token giả</span>
const docCookie = (h = '') =&gt; Object.fromEntries(h.split(';').filter(Boolean).map((p) =&gt; p.trim().split('=')));
function extractToken({ cookies, headers, auth }) {                         <span class="tok-comment">  // một hàm, ba chỗ — thứ tự như middleware Express</span>
  return cookies.token ?? headers.authorization?.replace(/^Bearer /, '') ?? auth?.token;
}
const io = new Server(19471);
io.use((socket, next) =&gt; {
  const token = extractToken({ cookies: docCookie(socket.request.headers.cookie), headers: socket.request.headers, auth: socket.handshake.auth });
  if (!token) return next(new Error('missing token'));
  const u = NGUOI[token];
  if (!u) return next(new Error('unauthorized'));
  socket.data.user = u; next();
});
io.on('connection', (s) =&gt; console.log(&#96;   server: connection — userId=\${s.data.user.userId}&#96;));
const thu = (ten, opts) =&gt; new Promise((xong) =&gt; {
  console.log(ten);
  const c = ketNoi('http://localhost:19471', { ...opts, reconnectionDelay: 300 });
  c.on('connect', () =&gt; { console.log('   client: connect'); c.close(); setTimeout(xong, 50); });
  c.on('connect_error', (e) =&gt; { console.log(&#96;   client: connect_error "\${e.message}" · active=\${c.active}&#96;); setTimeout(() =&gt; { c.close(); xong(); }, 600); });
  c.on('disconnect', (r) =&gt; r !== 'io client disconnect' &amp;&amp; console.log('   client: disconnect', r));
});
await thu('1) auth: { token }', { auth: { token: 'tok-lan' } });
await thu('2) header Authorization: Bearer …', { extraHeaders: { authorization: 'Bearer tok-lan' } });
await thu('3) cookie token=…', { extraHeaders: { cookie: 'theme=dark; token=tok-lan' } });
await thu('4) token sai', { auth: { token: 'tok-gia' } });
await thu('5) không có token', {});
io.close(); process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-5-cat-token-o-dau" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.5 — Cất token ở đâu trong trình duyệt</span><span class="lc-sub">Cookie, bộ nhớ, storage — và mỗi chỗ để lộ gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-10-1-log-mac-dinh-bo-sot" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 10.1 — Định dạng log mặc định bỏ sót cái gì</span><span class="lc-sub">Dòng request — kể cả query string — nằm trong mọi dòng access log</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>io.use()</code></span><span class="v">Middleware connection chạy TRƯỚC event <code>connection</code>.</span></div>
  <div class="kv"><span class="k"><code>extractToken()</code></span><span class="v">Hàm dùng chung đọc JWT từ cookie, header, hoặc <code>handshake.auth</code>.</span></div>
  <div class="kv"><span class="k"><code>handshake.auth.token</code></span><span class="v">Trường token do client cấp trong handshake.</span></div>
  <div class="kv"><span class="k"><code>connect_error</code></span><span class="v">Event client mà một auth failure hiện ra dưới dạng đó.</span></div>
  <div class="kv"><span class="k"><code>next(err)</code></span><span class="v">Cách middleware từ chối một connection trước khi nó được thiết lập.</span></div>
  <div class="kv"><span class="k">Auth vs network error</span><span class="v">Logout với cái đầu; tiếp tục thử lại với cái sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Middleware <code>io.use()</code> chạy trước event <code>connection</code> — từ chối ở đây thì connection không bao giờ fire.</li><li>Đọc JWT qua <code>extractToken()</code> dùng chung: cookie, header <code>Authorization</code>, hoặc <code>handshake.auth.token</code>.</li><li>Một connection bị từ chối hiện ra dưới dạng <code>connect_error</code> ở client, không phải <code>disconnect</code>.</li><li>Client phải phân biệt auth fail (logout) với network error (tiếp tục thử lại).</li><li>Cùng cách rút token như Express, nên một luật auth bao cả hai.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middleware</span><span class="lc-sub">socket.io/docs/v4/middlewares — API chính xác, kèm ví dụ cho JWT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá Authentication</span><span class="lc-sub">/courses/authentication/learn${REF} — nguồn gốc của <code>extractToken()</code> và pattern cookie httpOnly mà bài này tái sử dụng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — State that survives reconnect: three patterns|||1.5 — Trạng thái sống sót qua reconnect: ba pattern',
      slug: 'io-1-5-state',
      type: 'VIDEO',
      description: 'Một kết nối mới là một socket mới với room rỗng và data rỗng. Ba pattern lấp khoảng trống đó, mỗi cái đúng cho một loại trạng thái khác nhau.',
      content: `
${G01_5}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>State that survives reconnect: three patterns</h2>
<p class="lead">Lesson 1.3 established that a reconnect is a brand-new connection: new socket id, empty rooms, empty <code>socket.data</code>. Nothing carries over automatically. Every realtime app therefore needs a deliberate answer to &quot;what happens to the session&quot;, and there are exactly three shapes that answer takes.</p>

<h3>What is actually lost</h3>
<pre><code class="language-text">Before disconnect                    After reconnect
──────────────────────────────────  ──────────────────────────────────
socket.id = 'AbC123'                 socket.id = 'XyZ789'   ← different
socket.rooms = {'AbC123',            socket.rooms = {'XyZ789'}
                'room:42', 'vip'}                     ← only its own id
socket.data = { userId: 42,          socket.data = {}
                role: 'admin' }                       ← empty

Server-side references to the old id are now dangling. Anything you
stored keyed by socket.id points at a socket that no longer exists.

What DOES survive: the HTTP-layer facts. Cookies are re-sent, and
&#96;socket.handshake.auth&#96; is re-supplied by the client, so middleware
can authenticate the new connection exactly as it did the first one.
That is the foundation all three patterns build on.
</code></pre>

<h3>Pattern 1 — re-derive on connect (the default, and usually right)</h3>
<pre><code class="language-ts">// Middleware authenticates every connection, old or new, identically.
io.use(async (socket, next) =&gt; {
  const token = socket.handshake.auth?.token;
  const user = await verify(token);
  if (!user) return next(new Error('unauthorized'));
  socket.data.userId = user.id;
  socket.data.role = user.role;
  next();
});

io.on('connection', async (socket) =&gt; {
  // Rebuild room membership from durable data, not from memory.
  const rooms = await db.roomsForUser(socket.data.userId);
  await socket.join([\`user:\${socket.data.userId}\`, ...rooms]);
});
</code></pre>

<pre><code class="language-text">Why this is the default:

  It has no state to go stale. The server asks the database what the
  truth is, every time, and a reconnect is indistinguishable from a
  first connection. There is no expiry to tune, no cleanup job, and
  no window during which two representations disagree.

  Cost: one query per connection. On a reconnect storm — a deploy, a
  mobile network blip across thousands of clients — that is thousands
  of queries in a few seconds. Chapter 5's checklist covers this;
  the mitigation is caching roomsForUser, not abandoning the pattern.
</code></pre>

<h3>Pattern 2 — a server-side session keyed by something stable</h3>
<pre><code class="language-ts">// The socket id changes; the USER id does not. Key everything by the
// thing that survives.

// ❌ Dangling after any reconnect
const draftsBySocket = new Map&lt;string, Draft&gt;();

// ✅ Survives, because userId is stable
const draftsByUser = new Map&lt;number, Draft&gt;();

io.on('connection', (socket) =&gt; {
  const uid = socket.data.userId;
  const draft = draftsByUser.get(uid);
  if (draft) socket.emit('draft:restore', draft);

  socket.on('draft:update', (d) =&gt; draftsByUser.set(uid, d));
});
</code></pre>

<pre><code class="language-text">Two constraints that decide whether this works:

  1. In a cluster, a Map is per-worker.
     The reconnect may land on a different worker (Chapter 2's
     stickiness only pins a SESSION, not a future reconnect), so an
     in-process Map is a cache with a random miss rate. Put it in
     Redis with a TTL if the state matters.

  2. It needs an eviction story.
     A user who never comes back leaves their entry forever. A TTL
     slightly longer than your reconnect window — a few minutes, not
     hours — bounds it without discarding legitimate reconnects.
</code></pre>

<h3>Pattern 3 — the client holds it and replays</h3>
<pre><code class="language-ts">// The client already knows what it was doing. Let it say so.
socket.on('connect', () =&gt; {
  socket.emit('resume', {
    conversationId: currentConversationId,
    lastEventId: lastSeenEventId,     // ← the important half
  });
});

// Server answers with only what was missed
socket.on('resume', async ({ conversationId, lastEventId }, ack) =&gt; {
  if (!(await canAccess(socket.data.userId, conversationId))) {
    return ack({ error: 'forbidden' });
  }
  await socket.join(\`conv:\${conversationId}\`);
  const missed = await db.eventsSince(conversationId, lastEventId);
  ack({ missed });
});
</code></pre>

<pre><code class="language-text">This is the only pattern that closes the GAP, not just the state.

  Patterns 1 and 2 restore where the user was. Neither delivers the
  messages that arrived while they were disconnected — Chapter 6
  establishes that socket.io's default is at-most-once, so those
  messages are simply gone.

  A &#96;lastEventId&#96; turns the reconnect into a query: "everything after
  this point". That is the mechanism behind every chat app that shows
  you what you missed while the train was in a tunnel.

⚠️ Everything the client sends is untrusted. The &#96;resume&#96; handler
   above re-checks authorization before joining, because a client can
   claim any conversationId it likes. Pattern 3 moves state to the
   client; it must not move TRUST there.
</code></pre>

<h3>Choosing</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Is it derivable from durable data? → Pattern 1</span><span class="lz-d">Room membership, permissions, subscriptions. Re-deriving costs a query and can never go stale, which is worth more than the query costs. Cache it if reconnect storms show up in your database metrics.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Is it ephemeral but server-owned? → Pattern 2</span><span class="lz-d">An unsent draft, a wizard step, a rate-limit counter. Key it by user id rather than socket id, put it in Redis if you run more than one worker, and give it a TTL a little longer than your reconnect window.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Does the client need what it MISSED? → Pattern 3</span><span class="lz-d">Chat, notifications, live feeds. Only a client-supplied cursor lets the server answer &quot;what happened since&quot;. Re-authorize everything the client claims, and pair it with Chapter 6 if delivery must be guaranteed rather than best-effort.</span></div>
</div>

<h3>Most real apps use all three at once</h3>
<pre><code class="language-ts">io.on('connection', async (socket) =&gt; {
  const uid = socket.data.userId;                       // set by middleware

  // 1 — re-derive durable membership
  await socket.join([\`user:\${uid}\`, ...(await db.roomsForUser(uid))]);

  // 2 — restore ephemeral server-side state
  const draft = await redis.get(\`draft:\${uid}\`);
  if (draft) socket.emit('draft:restore', JSON.parse(draft));

  // 3 — let the client ask for the gap
  socket.on('resume', handleResume);

  socket.emit('ready');                                 // now it is safe to send
});
</code></pre>

<p>The <code>ready</code> event at the end matters more than it looks. Without it the client cannot tell &quot;connected&quot; from &quot;connected and restored&quot;, so it may emit into a socket that has not joined its rooms yet — and those emits go nowhere, silently.</p>

<div class="pitfall">
<p><strong>Trap — keying anything by <code>socket.id</code> across a reconnect.</strong> The id is regenerated, so every <code>Map&lt;socketId, …&gt;</code> entry becomes garbage the moment the network blips. It leaks memory and the lookup silently misses. Key by user id, which is stable.</p>
</div>

<div class="pitfall">
<p><strong>Trap — trusting what the client replays.</strong> Pattern 3 has the client send a conversation id and a cursor. Both are attacker-controlled. Re-run your authorization check inside the <code>resume</code> handler; a client that asks to resume a conversation it was never in must be refused, not joined.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A reconnect is a new socket with a new id, empty rooms and empty <code>data</code>, and only the HTTP-layer facts (cookies, <code>handshake.auth</code>) survive — so restore with one of three patterns chosen by what the state <em>is</em>: re-derive it from durable data (default, never stale, costs a query), keep it server-side keyed by user id rather than socket id (in Redis once you have more than one worker, with a TTL), or have the client replay a <code>lastEventId</code> cursor so the server can answer with what was missed — and only the third closes the message gap, because socket.io's default delivery guarantee drops anything sent while the client was away.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>On a reconnect, log what survived (<code>handshake.auth</code>, cookies) versus what reset (<code>socket.id</code>, <code>socket.rooms</code>, <code>socket.data</code>).</li>
<li>Implement pattern 1 — re-derive the user's rooms from the database in the <code>connection</code> handler.</li>
<li>Implement pattern 3 — have the client send a <code>lastEventId</code> and the server reply with what was missed; confirm a message sent DURING the outage now arrives after reconnect.</li>
</ol>
<p><strong>Done when:</strong> a message sent while the client was away is delivered after reconnect via a <code>lastEventId</code> cursor.</p></div>

<h3>🔬 Measured: what one network blip wipes, and what comes back</h3>
<p>socket.io 4.8.3, Node 22. The client connects through a TCP proxy, joins two rooms; its token is refreshed; then the proxy cuts the connection:</p>
<div class="out">$ node song.mjs
A) auth là OBJECT tĩnh
   middleware chạy lần 1 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=eHfPaz9bQ7AiMz0lAAAA rooms=["eHfPaz9bQ7AiMz0lAAAA"] data={"userId":42}
   client xin join ⇒ rooms=["room:42","vip"]
   … token làm mới thành tok-moi, rồi mạng chớp
   middleware chạy lần 2 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=sNR0jxCAGMaJJOl-AAAB rooms=["sNR0jxCAGMaJJOl-AAAB"] data={"userId":42}
B) auth là HÀM (gọi lại mỗi lần nối)
   middleware chạy lần 3 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=OX0tzErkl5oq-CJ_AAAC rooms=["OX0tzErkl5oq-CJ_AAAC"] data={"userId":42}
   client xin join ⇒ rooms=["room:42","vip"]
   … token làm mới thành tok-moi, rồi mạng chớp
   middleware chạy lần 4 · socket.data lúc vào = {} · auth={"token":"tok-moi"} · cookie=sid=phien-7
   connection id=foRVgF8iElnhZiEGAAAD rooms=["foRVgF8iElnhZiEGAAAD"] data={"userId":42}</div>
<p>After the reconnect: a new id, <code>rooms</code> back to just its own id, <code>socket.data</code> empty when the middleware starts (it runs again). The cookie and <code>handshake.auth</code> are sent again — <strong>but a static <code>auth</code> object replays the token it was created with</strong> (<code>tok-cu</code>), even after a refresh. Make <code>auth</code> a function — <code>auth: (cb) =&gt; cb({ token: getJwt() })</code> — and it runs on every (re)connect (<code>tok-moi</code>).</p>
<p><strong>All three patterns in one connection handler</strong>, plus a forged resume:</p>
<div class="out">$ node ba-pattern.mjs
   server: connection #LX8mFj rooms=["user:42","conv:1","team:dev"]
   client: resume từ #0 ⇒ bù 0 tin: 
1) đang nối: gõ nháp + nhận 2 tin
   client: nhận tin #1
   client: nhận tin #2
2) mạng chớp; server phát thêm 3 tin lúc client vắng
   server: connection #bf-1cc rooms=["user:42","conv:1","team:dev"] · trả bản nháp "Chào cả nh"
   client: khôi phục bản nháp "Chào cả nh"
   client: resume từ #2 ⇒ bù 3 tin: #3 #4 #5
3) client giả mạo: resume conv:999 (không có quyền)
   server: connection #k5gFcT rooms=["user:13"]
   kẻ giả mạo nhận: {"error":"forbidden"}</div>
<p><strong>Why <code>ready</code></strong> — the server awaits a 50 ms query before joining <code>conv:1</code>:</p>
<div class="out">$ node ready.mjs
A) emit lúc connect      ⇒ tin của chính mình vang lại trong conv:1? KHÔNG — rơi vào hư không
B) emit lúc 'ready'      ⇒ tin của chính mình vang lại trong conv:1? CÓ</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba pattern khôi phục qua một lần nối lại, chạy cùng nhau + một client GIẢ MẠO resume cuộc hội thoại không phải của nó</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const DB = { phong: { 42: ['conv:1', 'team:dev'] }, quyen: { 42: ['conv:1'] }, tin: [] };        <span class="tok-comment">  // "database" bền</span>
const nhapTheoUser = new Map();                                                                    <span class="tok-comment">  // pattern 2: khoá theo userId</span>
const io = new Server(19482);
io.use((s, next) =&gt; { s.data.userId = s.handshake.auth.userId; next(); });
io.on('connection', async (s) =&gt; {
  const uid = s.data.userId;
  s.on('draft:update', (d) =&gt; nhapTheoUser.set(uid, d));
  s.on('resume', ({ conv, lastEventId }, ack) =&gt; {
    if (!DB.quyen[uid]?.includes(conv)) return ack({ error: 'forbidden' });                       <span class="tok-comment">  // kiểm lại quyền, KHÔNG tin client</span>
    s.join(conv); ack({ missed: DB.tin.filter((t) =&gt; t.conv === conv &amp;&amp; t.id &gt; lastEventId) });
  });
  await s.join([&#96;user:\${uid}&#96;, ...(DB.phong[uid] ?? [])]);                                         <span class="tok-comment">  // pattern 1: suy lại từ dữ liệu bền</span>
  const nhap = nhapTheoUser.get(uid); if (nhap) s.emit('draft:restore', nhap);                   <span class="tok-comment">  // pattern 2</span>
  console.log(&#96;   server: connection #\${s.id.slice(0, 6)} rooms=\${JSON.stringify([...s.rooms].slice(1))}\${nhap ? &#96; · trả bản nháp "\${nhap}"&#96; : ''}&#96;);
  s.emit('ready');
});
const ong = new Set();
net.createServer((a) =&gt; { const b = net.connect(19482); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(19483);
let lastEventId = 0;
const c = ketNoi('http://localhost:19483', { auth: { userId: 42 }, reconnectionDelay: 300, reconnectionDelayMax: 300 });
c.on('msg', (t) =&gt; { lastEventId = t.id; console.log(&#96;   client: nhận tin #\${t.id}&#96;); });
c.on('draft:restore', (d) =&gt; console.log(&#96;   client: khôi phục bản nháp "\${d}"&#96;));
c.on('ready', () =&gt; c.emit('resume', { conv: 'conv:1', lastEventId }, (r) =&gt; console.log(&#96;   client: resume từ #\${lastEventId} ⇒ \${r.error ?? &#96;bù \${r.missed.length} tin: \${r.missed.map((t) =&gt; '#' + t.id).join(' ')}&#96;}&#96;)));
const phat = (n) =&gt; { const t = { id: DB.tin.length + 1, conv: 'conv:1' }; DB.tin.push(t); io.to('conv:1').emit('msg', t); };
await new Promise((r) =&gt; c.once('ready', r)); await cho(100);
console.log('1) đang nối: gõ nháp + nhận 2 tin'); c.emit('draft:update', 'Chào cả nh'); phat(); phat(); await cho(100);
console.log('2) mạng chớp; server phát thêm 3 tin lúc client vắng'); for (const x of ong) x.destroy(); ong.clear(); phat(); phat(); phat();
await new Promise((r) =&gt; c.once('ready', r)); await cho(200);
console.log('3) client giả mạo: resume conv:999 (không có quyền)');
const gia = ketNoi('http://localhost:19482', { auth: { userId: 13 } });
await new Promise((r) =&gt; gia.once('ready', r));
gia.emit('resume', { conv: 'conv:999', lastEventId: 0 }, (r) =&gt; console.log(&#96;   kẻ giả mạo nhận: \${JSON.stringify(r)}&#96;));
await cho(200); c.close(); gia.close(); io.close(); process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-5-5-hash-thuc-te" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 5.5 — Hashes in practice: sessions, carts, counters, config</span><span class="lc-sub">Pattern 2 in Redis: one hash per user, with a TTL</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-1-at-most-once" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.1 — The default is at-most-once</span><span class="lc-sub">Why pattern 3 is the only one that fills the message gap</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lost on reconnect</span><span class="v"><code>socket.id</code>, <code>socket.rooms</code> and <code>socket.data</code> all reset.</span></div>
  <div class="kv"><span class="k">Survives</span><span class="v">HTTP-layer facts: cookies and <code>handshake.auth</code>.</span></div>
  <div class="kv"><span class="k">Re-derive pattern</span><span class="v">Rebuild state from durable data on every connect (the default).</span></div>
  <div class="kv"><span class="k">Server-side session</span><span class="v">State keyed by <code>userId</code> (in Redis with a TTL once multi-worker).</span></div>
  <div class="kv"><span class="k">Client replay</span><span class="v">The client holds a <code>lastEventId</code> cursor and replays it.</span></div>
  <div class="kv"><span class="k">Delivery gap</span><span class="v">socket.io drops events sent while the client was disconnected.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A reconnect is a brand-new socket: new id, empty rooms, empty <code>data</code>.</li><li>Only HTTP-layer facts (cookies, <code>handshake.auth</code>) survive.</li><li>Re-derive from durable data is the default — never stale, costs a query.</li><li>Keep server-side state keyed by <code>userId</code> (Redis + TTL when multi-worker) for speed.</li><li>Only a client-replayed <code>lastEventId</code> cursor closes the message gap of the default delivery guarantee.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — bản dựng sẵn của Pattern 3, và giới hạn của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middlewares</span><span class="lc-sub">socket.io/docs/v4/middlewares — vì sao xác thực chạy trước sự kiện connection.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — The Socket instance</span><span class="lc-sub">socket.io/docs/v4/server-socket-instance — socket.data, socket.rooms, và vòng đời của chúng.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Trạng thái sống sót qua reconnect: ba pattern</h2>
<p class="lead">Bài 1.3 đã xác lập rằng một lần kết nối lại là một kết nối hoàn toàn mới: socket id mới, room rỗng, <code>socket.data</code> rỗng. Không gì tự động mang sang. Vì thế mọi app realtime đều cần một câu trả lời có chủ đích cho câu hỏi &quot;phiên làm việc thì sao&quot;, và câu trả lời đó có đúng ba hình dạng.</p>

<h3>Cái gì thực sự mất</h3>
<pre><code class="language-text">Trước khi ngắt                       Sau khi nối lại
──────────────────────────────────  ──────────────────────────────────
socket.id = 'AbC123'                 socket.id = 'XyZ789'   ← khác
socket.rooms = {'AbC123',            socket.rooms = {'XyZ789'}
                'room:42', 'vip'}                     ← chỉ có id của nó
socket.data = { userId: 42,          socket.data = {}
                role: 'admin' }                       ← rỗng

Mọi tham chiếu phía server tới id cũ giờ đều lơ lửng. Bất cứ thứ gì
bạn lưu theo khoá socket.id đều trỏ vào một socket không còn tồn tại.

Thứ CÓ sống sót: những dữ kiện ở tầng HTTP. Cookie được gửi lại, và
&#96;socket.handshake.auth&#96; được client cung cấp lại, nên middleware xác
thực được kết nối mới y hệt như nó đã làm với kết nối đầu tiên.
Đó là nền móng mà cả ba pattern dựng lên trên.
</code></pre>

<h3>Pattern 1 — suy lại lúc connect (mặc định, và thường là đúng)</h3>
<pre><code class="language-ts">// Middleware xác thực mọi kết nối, cũ hay mới, y như nhau.
io.use(async (socket, next) =&gt; {
  const token = socket.handshake.auth?.token;
  const user = await verify(token);
  if (!user) return next(new Error('unauthorized'));
  socket.data.userId = user.id;
  socket.data.role = user.role;
  next();
});

io.on('connection', async (socket) =&gt; {
  // Dựng lại thành viên room từ dữ liệu bền, không phải từ bộ nhớ.
  const rooms = await db.roomsForUser(socket.data.userId);
  await socket.join([\`user:\${socket.data.userId}\`, ...rooms]);
});
</code></pre>

<pre><code class="language-text">Vì sao đây là mặc định:

  Nó không có trạng thái nào để cũ đi. Server hỏi database sự thật là
  gì, mỗi lần, và một lần kết nối lại không phân biệt được với một
  kết nối đầu tiên. Không có hạn nào phải tinh chỉnh, không job dọn
  dẹp nào, và không có cửa sổ thời gian nào mà hai biểu diễn bất đồng.

  Cái giá: một truy vấn cho mỗi kết nối. Trong một cơn bão kết nối
  lại — một lần deploy, một cú chớp mạng di động trên hàng nghìn
  client — đó là hàng nghìn truy vấn trong vài giây. Checklist ở
  Chương 5 nói về chuyện này; cách giảm nhẹ là cache roomsForUser,
  không phải bỏ pattern.
</code></pre>

<h3>Pattern 2 — một phiên phía server, khoá bằng thứ ổn định</h3>
<pre><code class="language-ts">// socket id đổi; USER id thì không. Hãy khoá mọi thứ theo thứ sống sót.

// ❌ Lơ lửng sau bất kỳ lần kết nối lại nào
const draftsBySocket = new Map&lt;string, Draft&gt;();

// ✅ Sống sót, vì userId ổn định
const draftsByUser = new Map&lt;number, Draft&gt;();

io.on('connection', (socket) =&gt; {
  const uid = socket.data.userId;
  const draft = draftsByUser.get(uid);
  if (draft) socket.emit('draft:restore', draft);

  socket.on('draft:update', (d) =&gt; draftsByUser.set(uid, d));
});
</code></pre>

<pre><code class="language-text">Hai ràng buộc quyết định cái này có chạy được không:

  1. Trong cluster, một Map là của riêng từng worker.
     Lần kết nối lại có thể rơi vào một worker khác (sticky ở Chương 2
     chỉ ghim một PHIÊN, không ghim một lần kết nối lại trong tương
     lai), nên một Map trong tiến trình là một cache với tỷ lệ trượt
     ngẫu nhiên. Hãy đặt nó vào Redis kèm TTL nếu trạng thái đó quan trọng.

  2. Nó cần một câu chuyện dọn dẹp.
     Một user không bao giờ quay lại để lại mục của họ mãi mãi. Một
     TTL dài hơn cửa sổ kết nối lại của bạn một chút — vài phút, không
     phải vài giờ — chặn được nó mà không vứt đi những lần nối lại hợp lệ.
</code></pre>

<h3>Pattern 3 — client giữ và phát lại</h3>
<pre><code class="language-ts">// Client vốn đã biết nó đang làm gì. Hãy để nó nói ra.
socket.on('connect', () =&gt; {
  socket.emit('resume', {
    conversationId: currentConversationId,
    lastEventId: lastSeenEventId,     // ← nửa quan trọng
  });
});

// Server trả lời chỉ bằng phần đã bỏ lỡ
socket.on('resume', async ({ conversationId, lastEventId }, ack) =&gt; {
  if (!(await canAccess(socket.data.userId, conversationId))) {
    return ack({ error: 'forbidden' });
  }
  await socket.join(\`conv:\${conversationId}\`);
  const missed = await db.eventsSince(conversationId, lastEventId);
  ack({ missed });
});
</code></pre>

<pre><code class="language-text">Đây là pattern duy nhất lấp được KHOẢNG TRỐNG, không chỉ trạng thái.

  Pattern 1 và 2 khôi phục chỗ người dùng đang ở. Không cái nào giao
  những thông điệp đã tới trong lúc họ mất kết nối — Chương 6 xác lập
  rằng mặc định của socket.io là at-most-once, nên những thông điệp
  đó đơn giản là mất.

  Một &#96;lastEventId&#96; biến lần kết nối lại thành một truy vấn: "mọi thứ
  sau điểm này". Đó là cơ chế đằng sau mọi app chat cho bạn xem thứ
  bạn đã bỏ lỡ trong lúc tàu chui qua hầm.

⚠️ Mọi thứ client gửi đều không đáng tin. Handler &#96;resume&#96; ở trên kiểm
   lại quyền trước khi join, vì một client khai được bất kỳ
   conversationId nào nó thích. Pattern 3 đẩy trạng thái sang client;
   nó không được đẩy NIỀM TIN sang đó.
</code></pre>

<h3>Chọn thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó suy ra được từ dữ liệu bền không? → Pattern 1</span><span class="lz-d">Thành viên room, quyền, đăng ký theo dõi. Suy lại tốn một truy vấn và không bao giờ cũ đi được, và điều đó đáng giá hơn cái giá của truy vấn. Hãy cache nó nếu bão kết nối lại xuất hiện trong số liệu database của bạn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó phù du nhưng do server sở hữu? → Pattern 2</span><span class="lz-d">Một bản nháp chưa gửi, một bước trong wizard, một bộ đếm giới hạn tốc độ. Hãy khoá theo user id thay vì socket id, đặt vào Redis nếu bạn chạy nhiều hơn một worker, và cho nó một TTL dài hơn cửa sổ kết nối lại một chút.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Client có cần thứ nó ĐÃ BỎ LỠ không? → Pattern 3</span><span class="lz-d">Chat, thông báo, feed trực tiếp. Chỉ một con trỏ do client cung cấp mới cho phép server trả lời &quot;chuyện gì đã xảy ra từ lúc đó&quot;. Hãy kiểm lại quyền cho mọi thứ client khai, và ghép nó với Chương 6 nếu việc giao nhận phải được bảo đảm chứ không phải nỗ-lực-tốt-nhất.</span></div>
</div>

<h3>Hầu hết app thật dùng cả ba cùng lúc</h3>
<pre><code class="language-ts">io.on('connection', async (socket) =&gt; {
  const uid = socket.data.userId;                       // do middleware đặt

  // 1 — suy lại thành viên bền
  await socket.join([\`user:\${uid}\`, ...(await db.roomsForUser(uid))]);

  // 2 — khôi phục trạng thái phù du phía server
  const draft = await redis.get(\`draft:\${uid}\`);
  if (draft) socket.emit('draft:restore', JSON.parse(draft));

  // 3 — để client hỏi phần bị bỏ lỡ
  socket.on('resume', handleResume);

  socket.emit('ready');                                 // giờ mới an toàn để gửi
});
</code></pre>

<p>Sự kiện <code>ready</code> ở cuối quan trọng hơn vẻ ngoài của nó. Không có nó, client không phân biệt được &quot;đã kết nối&quot; với &quot;đã kết nối và đã khôi phục&quot;, nên nó có thể emit vào một socket còn chưa join room của mình — và những lần emit đó đi vào hư không, một cách im lặng.</p>

<div class="pitfall">
<p><strong>Bẫy — khoá bất cứ thứ gì theo <code>socket.id</code> qua một lần kết nối lại.</strong> Id được sinh lại, nên mọi mục <code>Map&lt;socketId, …&gt;</code> trở thành rác vào khoảnh khắc mạng chớp. Nó rò bộ nhớ và phép tra cứu trượt trong im lặng. Hãy khoá theo user id, thứ ổn định.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tin thứ client phát lại.</strong> Pattern 3 để client gửi một conversation id và một con trỏ. Cả hai đều do kẻ tấn công điều khiển được. Hãy chạy lại phép kiểm quyền bên trong handler <code>resume</code>; một client xin resume một cuộc hội thoại nó chưa bao giờ ở trong đó phải bị từ chối, không phải được cho join.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một lần kết nối lại là một socket mới với id mới, room rỗng và <code>data</code> rỗng, và chỉ những dữ kiện ở tầng HTTP (cookie, <code>handshake.auth</code>) sống sót — nên hãy khôi phục bằng một trong ba pattern, chọn theo bản chất của trạng thái: suy lại từ dữ liệu bền (mặc định, không bao giờ cũ, tốn một truy vấn), giữ phía server khoá theo user id thay vì socket id (trong Redis một khi bạn có hơn một worker, kèm TTL), hoặc để client phát lại một con trỏ <code>lastEventId</code> để server trả lời bằng phần đã bỏ lỡ — và chỉ cái thứ ba lấp được khoảng trống thông điệp, vì bảo đảm giao nhận mặc định của socket.io vứt bỏ bất cứ thứ gì gửi trong lúc client vắng mặt.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Khi reconnect, log cái gì sống sót (<code>handshake.auth</code>, cookie) so với cái gì reset (<code>socket.id</code>, <code>socket.rooms</code>, <code>socket.data</code>).</li>
<li>Cài pattern 1 — suy lại room của user từ cơ sở dữ liệu trong handler <code>connection</code>.</li>
<li>Cài pattern 3 — để client gửi một <code>lastEventId</code> và server trả về phần đã lỡ; xác nhận một tin gửi TRONG lúc mất kết nối giờ tới nơi sau reconnect.</li>
</ol>
<p><strong>Đạt khi:</strong> một tin gửi lúc client vắng mặt được giao sau reconnect nhờ con trỏ <code>lastEventId</code>.</p></div>

<h3>🔬 Đo thật: một lần mạng chớp xoá gì, và cái gì quay về</h3>
<p>socket.io 4.8.3, Node 22. Client nối qua một proxy TCP, join hai room; token được làm mới; rồi proxy cắt kết nối:</p>
<div class="out">$ node song.mjs
A) auth là OBJECT tĩnh
   middleware chạy lần 1 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=eHfPaz9bQ7AiMz0lAAAA rooms=["eHfPaz9bQ7AiMz0lAAAA"] data={"userId":42}
   client xin join ⇒ rooms=["room:42","vip"]
   … token làm mới thành tok-moi, rồi mạng chớp
   middleware chạy lần 2 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=sNR0jxCAGMaJJOl-AAAB rooms=["sNR0jxCAGMaJJOl-AAAB"] data={"userId":42}
B) auth là HÀM (gọi lại mỗi lần nối)
   middleware chạy lần 3 · socket.data lúc vào = {} · auth={"token":"tok-cu"} · cookie=sid=phien-7
   connection id=OX0tzErkl5oq-CJ_AAAC rooms=["OX0tzErkl5oq-CJ_AAAC"] data={"userId":42}
   client xin join ⇒ rooms=["room:42","vip"]
   … token làm mới thành tok-moi, rồi mạng chớp
   middleware chạy lần 4 · socket.data lúc vào = {} · auth={"token":"tok-moi"} · cookie=sid=phien-7
   connection id=foRVgF8iElnhZiEGAAAD rooms=["foRVgF8iElnhZiEGAAAD"] data={"userId":42}</div>
<p>Sau khi nối lại: id mới, <code>rooms</code> chỉ còn id của nó, <code>socket.data</code> rỗng lúc middleware bắt đầu (middleware chạy lại). Cookie và <code>handshake.auth</code> được gửi lại — <strong>nhưng <code>auth</code> là object tĩnh thì gửi lại đúng token lúc tạo</strong> (<code>tok-cu</code>), dù đã làm mới. Viết <code>auth</code> thành hàm — <code>auth: (cb) =&gt; cb({ token: getJwt() })</code> — nó chạy lại mỗi lần (nối lại) (<code>tok-moi</code>).</p>
<p><strong>Cả ba pattern trong một handler connection</strong>, cộng một lần resume giả mạo:</p>
<div class="out">$ node ba-pattern.mjs
   server: connection #LX8mFj rooms=["user:42","conv:1","team:dev"]
   client: resume từ #0 ⇒ bù 0 tin: 
1) đang nối: gõ nháp + nhận 2 tin
   client: nhận tin #1
   client: nhận tin #2
2) mạng chớp; server phát thêm 3 tin lúc client vắng
   server: connection #bf-1cc rooms=["user:42","conv:1","team:dev"] · trả bản nháp "Chào cả nh"
   client: khôi phục bản nháp "Chào cả nh"
   client: resume từ #2 ⇒ bù 3 tin: #3 #4 #5
3) client giả mạo: resume conv:999 (không có quyền)
   server: connection #k5gFcT rooms=["user:13"]
   kẻ giả mạo nhận: {"error":"forbidden"}</div>
<p><strong>Vì sao cần <code>ready</code></strong> — server await truy vấn 50 ms rồi mới join <code>conv:1</code>:</p>
<div class="out">$ node ready.mjs
A) emit lúc connect      ⇒ tin của chính mình vang lại trong conv:1? KHÔNG — rơi vào hư không
B) emit lúc 'ready'      ⇒ tin của chính mình vang lại trong conv:1? CÓ</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba pattern khôi phục qua một lần nối lại, chạy cùng nhau + một client GIẢ MẠO resume cuộc hội thoại không phải của nó</span>
import net from 'node:net';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const DB = { phong: { 42: ['conv:1', 'team:dev'] }, quyen: { 42: ['conv:1'] }, tin: [] };        <span class="tok-comment">  // "database" bền</span>
const nhapTheoUser = new Map();                                                                    <span class="tok-comment">  // pattern 2: khoá theo userId</span>
const io = new Server(19482);
io.use((s, next) =&gt; { s.data.userId = s.handshake.auth.userId; next(); });
io.on('connection', async (s) =&gt; {
  const uid = s.data.userId;
  s.on('draft:update', (d) =&gt; nhapTheoUser.set(uid, d));
  s.on('resume', ({ conv, lastEventId }, ack) =&gt; {
    if (!DB.quyen[uid]?.includes(conv)) return ack({ error: 'forbidden' });                       <span class="tok-comment">  // kiểm lại quyền, KHÔNG tin client</span>
    s.join(conv); ack({ missed: DB.tin.filter((t) =&gt; t.conv === conv &amp;&amp; t.id &gt; lastEventId) });
  });
  await s.join([&#96;user:\${uid}&#96;, ...(DB.phong[uid] ?? [])]);                                         <span class="tok-comment">  // pattern 1: suy lại từ dữ liệu bền</span>
  const nhap = nhapTheoUser.get(uid); if (nhap) s.emit('draft:restore', nhap);                   <span class="tok-comment">  // pattern 2</span>
  console.log(&#96;   server: connection #\${s.id.slice(0, 6)} rooms=\${JSON.stringify([...s.rooms].slice(1))}\${nhap ? &#96; · trả bản nháp "\${nhap}"&#96; : ''}&#96;);
  s.emit('ready');
});
const ong = new Set();
net.createServer((a) =&gt; { const b = net.connect(19482); a.pipe(b).pipe(a); for (const x of [a, b]) { ong.add(x); x.on('error', () =&gt; {}); x.on('close', () =&gt; { a.destroy(); b.destroy(); }); } }).listen(19483);
let lastEventId = 0;
const c = ketNoi('http://localhost:19483', { auth: { userId: 42 }, reconnectionDelay: 300, reconnectionDelayMax: 300 });
c.on('msg', (t) =&gt; { lastEventId = t.id; console.log(&#96;   client: nhận tin #\${t.id}&#96;); });
c.on('draft:restore', (d) =&gt; console.log(&#96;   client: khôi phục bản nháp "\${d}"&#96;));
c.on('ready', () =&gt; c.emit('resume', { conv: 'conv:1', lastEventId }, (r) =&gt; console.log(&#96;   client: resume từ #\${lastEventId} ⇒ \${r.error ?? &#96;bù \${r.missed.length} tin: \${r.missed.map((t) =&gt; '#' + t.id).join(' ')}&#96;}&#96;)));
const phat = (n) =&gt; { const t = { id: DB.tin.length + 1, conv: 'conv:1' }; DB.tin.push(t); io.to('conv:1').emit('msg', t); };
await new Promise((r) =&gt; c.once('ready', r)); await cho(100);
console.log('1) đang nối: gõ nháp + nhận 2 tin'); c.emit('draft:update', 'Chào cả nh'); phat(); phat(); await cho(100);
console.log('2) mạng chớp; server phát thêm 3 tin lúc client vắng'); for (const x of ong) x.destroy(); ong.clear(); phat(); phat(); phat();
await new Promise((r) =&gt; c.once('ready', r)); await cho(200);
console.log('3) client giả mạo: resume conv:999 (không có quyền)');
const gia = ketNoi('http://localhost:19482', { auth: { userId: 13 } });
await new Promise((r) =&gt; gia.once('ready', r));
gia.emit('resume', { conv: 'conv:999', lastEventId: 0 }, (r) =&gt; console.log(&#96;   kẻ giả mạo nhận: \${JSON.stringify(r)}&#96;));
await cho(200); c.close(); gia.close(); io.close(); process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-5-5-hash-thuc-te" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 5.5 — Hash trong thực tế: phiên, giỏ hàng, bộ đếm, cấu hình</span><span class="lc-sub">Pattern 2 trong Redis: mỗi user một hash, kèm TTL</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-6-1-at-most-once" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 6.1 — Mặc định là at-most-once</span><span class="lc-sub">Vì sao pattern 3 là cái duy nhất lấp được khoảng trống tin nhắn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mất khi reconnect</span><span class="v"><code>socket.id</code>, <code>socket.rooms</code> và <code>socket.data</code> đều reset.</span></div>
  <div class="kv"><span class="k">Sống sót</span><span class="v">Dữ kiện tầng HTTP: cookie và <code>handshake.auth</code>.</span></div>
  <div class="kv"><span class="k">Pattern suy lại</span><span class="v">Dựng lại state từ dữ liệu bền ở mỗi lần connect (mặc định).</span></div>
  <div class="kv"><span class="k">Phiên phía server</span><span class="v">State khoá theo <code>userId</code> (trong Redis kèm TTL khi đã nhiều worker).</span></div>
  <div class="kv"><span class="k">Client phát lại</span><span class="v">Client giữ một con trỏ <code>lastEventId</code> và phát lại nó.</span></div>
  <div class="kv"><span class="k">Khoảng trống giao tin</span><span class="v">socket.io vứt event gửi trong lúc client mất kết nối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một reconnect là một socket hoàn toàn mới: id mới, room rỗng, <code>data</code> rỗng.</li><li>Chỉ dữ kiện tầng HTTP (cookie, <code>handshake.auth</code>) sống sót.</li><li>Suy lại từ dữ liệu bền là mặc định — không bao giờ cũ, tốn một truy vấn.</li><li>Giữ state phía server khoá theo <code>userId</code> (Redis + TTL khi nhiều worker) cho nhanh.</li><li>Chỉ con trỏ <code>lastEventId</code> do client phát lại mới lấp được khoảng trống giao tin của bảo đảm mặc định.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — bản dựng sẵn của Pattern 3, và giới hạn của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middlewares</span><span class="lc-sub">socket.io/docs/v4/middlewares — vì sao xác thực chạy trước sự kiện connection.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — The Socket instance</span><span class="lc-sub">socket.io/docs/v4/server-socket-instance — socket.data, socket.rooms, và vòng đời của chúng.</span></span></div>
</div>
`,
    },


    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'io-1-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về vòng đời: connect events, disconnect reasons, reconnect behaviour, state patterns.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>What Chapter 1 established</h2>
<p class="lead">Six questions on the lifecycle of a single connection — the part every later chapter assumes you know.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Connect is five events, not one</span><span class="lz-d">The handshake fires a sequence, and middleware runs BEFORE the connection event. That ordering is what makes authentication possible at all: reject in middleware and the socket never reaches your handlers.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Four disconnect reasons, four responses</span><span class="lz-d">A client-initiated close, a server-initiated close, a transport error and a ping timeout mean different things. Treating them identically is how you end up reconnecting when you should not, or not reconnecting when you should.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Reconnect does not restore state</span><span class="lz-d">A new connection gets a new socket id and empty rooms. Nothing about the previous session survives automatically. Three patterns close that gap: re-join on connect, server-side session lookup, and client-held state replayed after connect.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã dựng được gì</h2>
<p class="lead">Sáu câu về vòng đời của một kết nối đơn lẻ — phần mà mọi chương sau đều giả định bạn đã nắm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Connect là năm sự kiện, không phải một</span><span class="lz-d">Cú bắt tay phát ra một chuỗi, và middleware chạy TRƯỚC sự kiện connection. Chính thứ tự đó là thứ làm cho việc xác thực khả thi: từ chối trong middleware thì socket không bao giờ tới được handler của bạn.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Bốn lý do ngắt, bốn cách phản ứng</span><span class="lz-d">Client chủ động đóng, server chủ động đóng, lỗi transport, và ping timeout mang ý nghĩa khác nhau. Xử chúng như nhau là cách bạn kết nối lại khi lẽ ra không nên, hoặc không kết nối lại khi lẽ ra phải.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Kết nối lại không khôi phục trạng thái</span><span class="lz-d">Một kết nối mới nhận một socket id mới và room rỗng. Không gì của phiên trước tự động sống sót. Ba pattern lấp khoảng trống đó: join lại lúc connect, tra cứu phiên phía server, và trạng thái do client giữ rồi phát lại sau khi connect.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'At <code>io.on(&quot;connection&quot;, s =&gt; ...)</code>, what is <code>s.conn.transport.name</code>?|||Ở <code>io.on(&quot;connection&quot;, s =&gt; ...)</code>, <code>s.conn.transport.name</code> là gì?',
            options: [
              '&quot;polling&quot; — the client hasn\'t upgraded yet; upgrade fires ~9ms later|||&quot;polling&quot; — client chưa upgrade; upgrade fire ~9ms sau đó',
              '&quot;websocket&quot; — always, at connection time|||&quot;websocket&quot; — luôn, tại thời điểm connection',
              'undefined — transport is set later|||undefined — transport được set sau',
              'Depends on the client&#39;s network|||Phụ thuộc network của client',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Client sees <code>disconnect(&quot;transport close&quot;)</code>. What happens next?|||Client thấy <code>disconnect(&quot;transport close&quot;)</code>. Chuyện gì tiếp theo?',
            options: [
              'Client automatically retries with exponential backoff (1s, 2s, 4s, capped at 5s) — no code needed; server should DEBOUNCE presence updates by 2s to avoid UI flicker|||Client tự động thử lại với backoff (1s, 2s, 4s, tối đa 5s) — không cần code; server nên DEBOUNCE cập nhật presence 2s để tránh UI flap',
              'Nothing — client stays disconnected until user reloads|||Không gì — client stay disconnect tới khi user reload',
              'Client immediately logs out|||Client đăng xuất ngay',
              'Server-side <code>disconnect</code> handler blocks reconnect|||Handler <code>disconnect</code> server-side chặn reconnect',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'After reconnect, <code>socket.id</code> is <code>&quot;JAlAcN...&quot;</code> where it was <code>&quot;wk01tA...&quot;</code>. Why?|||Sau reconnect, <code>socket.id</code> là <code>&quot;JAlAcN...&quot;</code> khi trước là <code>&quot;wk01tA...&quot;</code>. Vì sao?',
            options: [
              'Server sees a fresh connection — <code>connection</code> handler fires again with a brand-new sid. Server-side state must be keyed by <code>userId</code>, not <code>socket.id</code>, to survive reconnect|||Server thấy connection MỚI hoàn toàn — handler <code>connection</code> fire lại với sid mới. State server-side phải khoá theo <code>userId</code>, không theo <code>socket.id</code>, để sống sót reconnect',
              'A bug — sid should be stable|||Bug — sid phải ổn định',
              'The server rotated its sid pool|||Server đã xoay pool sid',
              'The client passed a new session ID|||Client đã truyền session ID mới',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Middleware <code>io.use((s, next) =&gt; { /* forgot next() */ })</code>. What does the client see?|||Middleware <code>io.use((s, next) =&gt; { /* quên next() */ })</code>. Client thấy gì?',
            options: [
              'Nothing for ~20-30s, then a <code>connect_error</code> with timeout — because middleware never called <code>next()</code> so the handshake never completed|||Không gì trong ~20-30s, rồi <code>connect_error</code> với timeout — vì middleware không gọi <code>next()</code> nên handshake không hoàn tất',
              'Immediate <code>connect_error</code> with &quot;middleware missing next&quot;|||<code>connect_error</code> tức thì với &quot;middleware thiếu next&quot;',
              'Connection succeeds silently|||Kết nối thành công âm thầm',
              '<code>disconnect</code> event with reason &quot;middleware error&quot;|||<code>disconnect</code> với reason &quot;middleware error&quot;',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You call <code>logout()</code> on every <code>connect_error</code>. What is the bug?|||Bạn gọi <code>logout()</code> mỗi <code>connect_error</code>. Bug là gì?',
            options: [
              '<code>connect_error</code> fires for BOTH auth failures (should log out) AND transport errors like network drops (should NOT log out) — 5s Wi-Fi loss will kick the user to /login|||<code>connect_error</code> fire cho CẢ auth fail (nên logout) VÀ lỗi transport như mất mạng (KHÔNG nên logout) — mất Wi-Fi 5s sẽ đá user về /login',
              '<code>logout()</code> is not synchronous|||<code>logout()</code> không đồng bộ',
              '<code>connect_error</code> is deprecated|||<code>connect_error</code> bị deprecated',
              'The event only fires after 30s|||Event chỉ fire sau 30s',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which state pattern fits chat MESSAGES (must not be lost)?|||Pattern state nào hợp với TIN NHẮN chat (không được mất)?',
            options: [
              'Pattern 3 client-refetched — messages live in DB anyway; on reconnect fetch <code>?since=lastSeen</code>. Do not rely on emit reaching the client|||Pattern 3 client refetch — tin nhắn vốn ở DB; khi reconnect fetch <code>?since=lastSeen</code>. Không dựa vào emit tới client',
              'Pattern 1 ephemeral — messages are OK to lose on reconnect|||Pattern 1 ephemeral — tin nhắn OK mất khi reconnect',
              'Pattern 2 server RAM — server holds every message in memory|||Pattern 2 server RAM — server giữ mọi tin trong bộ nhớ',
              'None — messages should be a HTTP POST, not socket|||Không — tin nhắn nên là HTTP POST, không socket',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
