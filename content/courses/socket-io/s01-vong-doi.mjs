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
<p><strong>Bẫy — dùng <code>connection</code> handler as one big async &quot;init user session&quot; block.</strong> The handler runs synchronously, and a single <code>await fetch()</code> here opens a ~50-200ms window in which events the client sends are ALREADY lost. Register the handlers IMMEDIATELY and defer the async work to INSIDE those handlers.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The &quot;connect&quot; lifecycle is three events inside ~9ms — server <code>connection</code> (transport is polling, middleware has passed, no rooms joined), client <code>connect</code> (sid received), server <code>upgrade</code> (switched to WebSocket) — and the standard shape of the <code>connection</code> handler is join rooms → update presence → register handlers → attach disconnect, in exactly that order, with no <code>await</code> between the registration steps.</p>
</div>

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
// -&gt; server and client both see: 'ping timeout'  (after 60s)
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
<span class="lz-nbody"><strong>Unexpected — it WILL reconnect on its own.</strong> There is no FIN packet at all — just ping/pong expiring after <code>pingTimeout</code>. This is the slow kind: a 60s wait in this repo. The UI has to choose: wait the full 60s before showing &quot;offline&quot;, or use a shorter timeout for UX purposes.</span>
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
<p><strong>Bẫy — dọn dẹp state NGAY khi thấy <code>disconnect</code>.</strong> Switching Wi-Fi → 4G produces <code>transport close</code>, and 800ms later the client is back. If you delete <code>onlineUserIds</code> immediately, the presence UI flaps. If you delete <code>currentThread</code> immediately, the client must re-join on reconnect and sees stale messages. Debounce; do not delete on the spot.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The six reasons of <code>disconnect</code> split into two groups — the deliberate ones (io server/client disconnect, parse error) do not reconnect and need cleanup IMMEDIATELY, while the unexpected ones (transport close, ping timeout, transport error) reconnect AUTOMATICALLY and need a 2s presence debounce plus 60s state cleanup so the UI does not flap when a user changes networks.</p>
</div>

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
// -&gt; ca server va client see: 'ping timeout'  (sau 60s)
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
<span class="lz-nbody"><strong>Bất ngờ — SẼ tự reconnect.</strong> Không có FIN packet nào — chỉ ping/pong hết hạn sau <code>pingTimeout</code>. Đây là kiểu chậm chạp: đợi 60s ở kho này. UI phải chọn: hoặc chờ 60s để hiện &quot;offline&quot;, hoặc dùng timeout ngắn hơn cho UX.</span>
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
4         2500 - 7500    &lt;- van cham max 5000
5+        2500 - 7500

Jitter la CO Y — 1000 client cung reconnect KHONG lam DDoS server luc cap dien lai
</div>

<div class="pitfall">
<p><strong>Bẫy — tắt reconnection.</strong> Someone writes <code>{ reconnection: false }</code> to make debugging easier in dev, then forgets. In prod: 5s of lost Wi-Fi means the user has to reload the page. Only disable it in tests, or when you are writing your own reconnect logic (very rare).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Reconnection is automatic at LAYER 2 (exponential backoff 1-5s, ±50% jitter, unlimited attempts), but at LAYERS 3 &amp; 4 the sid changes, the rooms are empty and pending events are lost — so application state must be tracked by <code>userId</code> and never by <code>socket.id</code>, and anything that matters needs a &quot;fetch-since-last-seen&quot; pattern rather than faith that the emit arrived.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Manager options</span><span class="lc-sub">socket.io/docs/v4/client-options/#manager-options — mọi option reconnect, cùng default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ để server GIỮ state (rooms + missed events) trong RAM một khoảng — trade off: memory. Không dùng ở kho này</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks and delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern &quot;fetch-since-last-seen&quot; đối lập với &quot;emit and hope&quot;.</span></span></div>
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
4         2500 - 7500    &lt;- van cham max 5000
5+        2500 - 7500

Jitter la CO Y — 1000 client cung reconnect KHONG lam DDoS server luc cap dien lai
</div>

<div class="pitfall">
<p><strong>Bẫy — tắt reconnection.</strong> Ai đó viết <code>{ reconnection: false }</code> để &quot;dễ debug&quot; ở dev, rồi quên. Prod: mất Wi-Fi 5s = user phải reload trang. Chỉ tắt trong test hoặc khi tự viết reconnect logic (rất hiếm).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Reconnect tự động ở TẦNG 2 (backoff exponential 1-5s, jitter ±50%, vô hạn attempts), nhưng ở TẦNG 3 &amp; 4 sid đổi + rooms trống + pending events mất — nên state của app phải track theo <code>userId</code> chứ không theo <code>socket.id</code>, và data quan trọng phải có pattern &quot;fetch-since-last-seen&quot; hơn là dựa vào emit đến đúng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Manager options</span><span class="lc-sub">socket.io/docs/v4/client-options/#manager-options — mọi option reconnect, cùng default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ để server GIỮ state (rooms + missed events) trong RAM một khoảng — trade off: memory. Không dùng ở kho này</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern &quot;fetch-since-last-seen&quot; đối lập với &quot;emit and hope&quot;.</span></span></div>
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
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">middleware throws</span><span class="lz-d">Same behaviour — socket.io wraps the throw into <code>connect_error</code>. But the exception is NOT logged on the server automatically; you must <code>logger.error</code> in the catch.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">middleware hangs (no next)</span><span class="lz-d">If you forget <code>next()</code> — even in the success branch — the connection stalls. Client sees a timeout after ~20-30s and finally <code>connect_error</code> with timeout. Bug &quot;client never connects&quot; is usually here.</span></div>
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
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">middleware throw</span><span class="lz-d">Cùng vậy — socket.io wrap throw thành <code>connect_error</code>. Nhưng exception KHÔNG log ở server tự động; bạn phải <code>logger.error</code> trong catch.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">middleware treo (không next)</span><span class="lz-d">Nếu bạn quên <code>next()</code> — kể cả trong nhánh success — connection kẹt. Client thấy timeout sau ~20-30s và cuối cùng <code>connect_error</code> với timeout. Bug &quot;client mãi không connect&quot; thường là chỗ này.</span></div>
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
<p><strong>Bẫy — keying anything by <code>socket.id</code> across a reconnect.</strong> The id is regenerated, so every <code>Map&lt;socketId, …&gt;</code> entry becomes garbage the moment the network blips. It leaks memory and the lookup silently misses. Key by user id, which is stable.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — trusting what the client replays.</strong> Pattern 3 has the client send a conversation id and a cursor. Both are attacker-controlled. Re-run your authorization check inside the <code>resume</code> handler; a client that asks to resume a conversation it was never in must be refused, not joined.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A reconnect is a new socket with a new id, empty rooms and empty <code>data</code>, and only the HTTP-layer facts (cookies, <code>handshake.auth</code>) survive — so restore with one of three patterns chosen by what the state <em>is</em>: re-derive it from durable data (default, never stale, costs a query), keep it server-side keyed by user id rather than socket id (in Redis once you have more than one worker, with a TTL), or have the client replay a <code>lastEventId</code> cursor so the server can answer with what was missed — and only the third closes the message gap, because socket.io's default delivery guarantee drops anything sent while the client was away.</p>
</div>

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
