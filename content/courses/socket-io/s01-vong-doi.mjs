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

<p>Socket.IO buffers packet ở tầng 2 khi handler chưa đăng ký? <strong>KHÔNG</strong>. Event tới trước khi handler đăng ký sẽ bị bỏ qua âm thầm. Điều này khác Node.js EventEmitter (cũng vậy) nhưng khác cách client mong đợi (họ nghĩ emit là send).</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>connection</code> handler như một &quot;init user session&quot; async khối lớn.</strong> Handler chạy đồng bộ, và một <code>await fetch()</code> ở đây tạo cửa sổ ~50-200ms mà event client gửi vào ĐÃ bị mất. Đăng ký handler NGAY, defer async logic vào INSIDE handler.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Vòng đời &quot;connect&quot; là ba event trong ~9ms — server <code>connection</code> (transport là polling, middleware đã pass, chưa join room), client <code>connect</code> (nhận sid), server <code>upgrade</code> (chuyển sang WebSocket) — và pattern chuẩn của handler <code>connection</code> là join room → cập nhật presence → đăng ký handler → gắn disconnect, theo đúng thứ tự đó, không có <code>await</code> giữa các bước đăng ký.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API</span><span class="lc-sub">socket.io/docs/v4/server-api — <code>io.on(&#39;connection&#39;)</code>, <code>socket.data</code>, <code>socket.join</code>. Tra khi cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Middleware</span><span class="lc-sub">socket.io/docs/v4/middlewares — cách <code>io.use()</code> chạy TRƯỚC <code>connection</code>, và làm gì khi middleware fail (client thấy <code>connect_error</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — EventEmitter</span><span class="lc-sub">nodejs.org/api/events.html — cơ chế underlying của <code>socket.on(...)</code> và tại sao event trước handler đăng ký bị bỏ qua.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — presence và bẫy O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — kho này chọn cấu trúc bốn bước ở trên vì lý do đo được trong Chương 4.</span></span></div>
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
<p><strong>One sentence.</strong> Sáu reason của <code>disconnect</code> chia hai nhóm — chủ động (io server/client disconnect, parse error) không tự reconnect và cần dọn NGAY, còn bất ngờ (transport close, ping timeout, transport error) TỰ ĐỘNG reconnect và cần debounce presence 2s + state cleanup 60s để tránh UI flap khi user chuyển mạng.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — disconnect reasons</span><span class="lc-sub">socket.io/docs/v4/client-socket-instance/#disconnect — sáu chuỗi reason, mỗi cái có định nghĩa chính xác về khi nào fire và có reconnect không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Page Visibility API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API — <code>visibilitychange</code> event, cho bạn biết tab đang khuất — hữu ích cho debounce chuyển tab thay vì network</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — presence và bẫy O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — sau khi bạn xử lý reason đúng, presence vẫn còn bẫy N²</span></span></div>
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

<h3>Server-side pattern để re-join room tự động</h3>
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
<p><strong>One sentence.</strong> Reconnect tự động ở TẦNG 2 (backoff exponential 1-5s, jitter ±50%, vô hạn attempts), nhưng ở TẦNG 3 &amp; 4 sid đổi + rooms trống + pending events mất — nên state của app phải track theo <code>userId</code> chứ không theo <code>socket.id</code>, và data quan trọng phải có pattern &quot;fetch-since-last-seen&quot; hơn là dựa vào emit đến đúng.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Manager options</span><span class="lc-sub">socket.io/docs/v4/client-options/#manager-options — mọi option reconnect, cùng default và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ để server GIỮ state (rooms + missed events) trong RAM một khoảng — trade off: memory. Không dùng ở kho này</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern &quot;fetch-since-last-seen&quot; đối lập với &quot;emit and hope&quot;.</span></span></div>
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
      title: '1.5 — State that survives reconnect: three patterns|||1.5 — State sống sót reconnect: ba pattern',
      slug: 'io-1-5-state',
      type: 'VIDEO',
      description: 'Ephemeral (không giữ), server-remembered (Map theo userId), client-refetched (sync-since-last-seen). Chọn cái nào phụ thuộc data cost + staleness tolerance.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>State that survives reconnect: three patterns</h2>
<p class="lead">Lesson 1.3 showed that reconnect wipes rooms, sid, and pending events. This lesson gives the three patterns for what to do about it, and when each fits.</p>

<h3>Pattern 1 — Ephemeral (don&#39;t save)</h3>
<pre><code class="language-ts">// Presence, typing indicators, cursor positions
socket.on('typing:start', () =&gt; io.to(&#96;thread:\${threadId}&#96;).emit('user:typing', userId));
// KHONG luu vao DB, KHONG luu vao Map — ephemeral hoan toan
</code></pre>

<p>Nếu client reconnect và typing indicator mất — không sao, họ sẽ gõ tiếp và trigger event mới. Data này KHÔNG đáng cost để giữ. Kho này dùng cho: <code>thread:typing</code>, <code>presence:update</code> (thời điểm mới nhất), <code>listen:sync-request</code>.</p>

<h3>Pattern 2 — Server-remembered (Map keyed by userId)</h3>
<pre><code class="language-ts">// Rooms user da join
const userRooms = new Map&lt;number, Set&lt;string&gt;&gt;();

socket.on('thread:join', (threadId) =&gt; {
  socket.join(&#96;thread:\${threadId}&#96;);
  const rooms = userRooms.get(userId) ?? new Set();
  rooms.add(&#96;thread:\${threadId}&#96;);
  userRooms.set(userId, rooms);
});

// Khi reconnect
io.on('connection', (socket) =&gt; {
  for (const r of userRooms.get(userId) ?? []) socket.join(r);
});
</code></pre>

<p>Server nhớ thay client. Data ở RAM (fast) hoặc Redis (persist qua restart). Kho này dùng cho: <code>userRooms</code> (implicit), <code>listen:room</code> host status.</p>

<h3>Pattern 3 — Client-refetched (sync-since-last-seen)</h3>
<pre><code class="language-ts">// Client gui timestamp cua tin cuoi da nhan, server tra danh sach tin sau do
c.on('connect', async () =&gt; {
  const lastSeen = localStorage.getItem('lastMessageAt');
  const missed = await api.get(&#96;/threads/messages?since=\${lastSeen}&#96;);
  for (const m of missed) addMessage(m);
});
</code></pre>

<p>Data ở DB đã có, chỉ cần fetch. Đây là pattern chuẩn cho tin nhắn quan trọng — KHÔNG dựa vào emit reach client. Kho này dùng cho: chat messages, notifications, feed posts.</p>

<h3>So sánh</h3>
<div class="out">Pattern      Data cost  Staleness   Complexity  Use for
1 Ephemeral  0          irrelevant  0            presence, typing
2 Server RAM small      seconds     medium       user rooms, active session
2 Server DB  small      minutes     high         cluster-safe rooms (Redis)
3 Client     large      up to hours medium       messages, notifications
</div>

<div class="callout warn">
<p><strong>Sai cost pattern tệ hơn không có pattern.</strong> Server-remember cho tin nhắn quan trọng (nếu server restart, mất) — bug lớn. Ephemeral cho user rooms (nếu reconnect, không nhận msg cho thread họ đang xem) — bug thầm. Xác định staleness tolerance trước khi chọn.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Ephemeral (không cost, không staleness care), server-remembered (RAM/Redis + <code>Map&lt;userId, ...&gt;</code>), client-refetched (DB có sẵn + sync-since-last-seen) — ba pattern cho ba loại data khác nhau, và sai pattern là bug lớn hơn không có pattern.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ tự động giữ state trong RAM một khoảng. Trade off: memory.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks and delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern 3 sâu hơn ở Chương 6.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>State sống sót reconnect: ba pattern</h2>
<p class="lead">Bài 1.3 chỉ ra reconnect xoá rooms, sid, và pending events. Bài này đưa ba pattern cho việc gì nên làm với chuyện đó, và mỗi cái hợp khi nào.</p>

<h3>Pattern 1 — Ephemeral (không giữ)</h3>
<pre><code class="language-ts">// Presence, typing indicator, con tro
socket.on('typing:start', () =&gt; io.to(&#96;thread:\${threadId}&#96;).emit('user:typing', userId));
// KHONG luu DB, KHONG luu Map — ephemeral hoan toan
</code></pre>

<p>Nếu client reconnect và typing indicator mất — không sao, họ gõ tiếp và trigger event mới. Data này KHÔNG đáng cost để giữ. Kho này dùng cho: <code>thread:typing</code>, <code>presence:update</code> (thời điểm mới nhất), <code>listen:sync-request</code>.</p>

<h3>Pattern 2 — Server nhớ (Map theo userId)</h3>
<pre><code class="language-ts">// Rooms user da join
const userRooms = new Map&lt;number, Set&lt;string&gt;&gt;();

socket.on('thread:join', (threadId) =&gt; {
  socket.join(&#96;thread:\${threadId}&#96;);
  const rooms = userRooms.get(userId) ?? new Set();
  rooms.add(&#96;thread:\${threadId}&#96;);
  userRooms.set(userId, rooms);
});

// Khi reconnect
io.on('connection', (socket) =&gt; {
  for (const r of userRooms.get(userId) ?? []) socket.join(r);
});
</code></pre>

<p>Server nhớ thay client. Data ở RAM (nhanh) hoặc Redis (persist qua restart). Kho này dùng cho: <code>userRooms</code> (implicit), <code>listen:room</code> host status.</p>

<h3>Pattern 3 — Client refetch (sync-since-last-seen)</h3>
<pre><code class="language-ts">// Client gui timestamp tin cuoi da nhan, server tra danh sach tin sau do
c.on('connect', async () =&gt; {
  const lastSeen = localStorage.getItem('lastMessageAt');
  const missed = await api.get(&#96;/threads/messages?since=\${lastSeen}&#96;);
  for (const m of missed) addMessage(m);
});
</code></pre>

<p>Data ở DB có sẵn, chỉ cần fetch. Đây là pattern chuẩn cho tin nhắn quan trọng — KHÔNG dựa vào emit tới client. Kho này dùng cho: chat messages, notifications, feed posts.</p>

<h3>So sánh</h3>
<div class="out">Pattern      Data cost  Staleness   Complexity  Dung cho
1 Ephemeral  0          khong quan  0            presence, typing
2 Server RAM nho        vai giay    trung binh   user rooms, active session
2 Server DB  nho        vai phut    cao          cluster-safe rooms (Redis)
3 Client     lon        toi vai gio trung binh   tin nhan, thong bao
</div>

<div class="callout warn">
<p><strong>Sai cost pattern tệ hơn không có pattern.</strong> Server-remember cho tin nhắn quan trọng (nếu server restart, mất) — bug lớn. Ephemeral cho user rooms (nếu reconnect, không nhận msg cho thread họ đang xem) — bug thầm. Xác định staleness tolerance trước khi chọn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ephemeral (không cost, không staleness care), server nhớ (RAM/Redis + <code>Map&lt;userId, ...&gt;</code>), client refetch (DB có sẵn + sync-since-last-seen) — ba pattern cho ba loại data khác nhau, và sai pattern là bug lớn hơn không có pattern.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Connection state recovery</span><span class="lc-sub">socket.io/docs/v4/connection-state-recovery — feature 4.6+ tự động giữ state trong RAM một khoảng. Trade off: memory.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery guarantees</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern 3 sâu hơn ở Chương 6.</span></span></div>
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
<p class="lead">Sáu câu, mười phút. Về vòng đời một connection từ birth (~9ms setup) đến death (một trong sáu reason) đến rebirth (auto backoff, sid mới, rooms trống).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã dựng được gì</h2>
<p class="lead">Sáu câu, mười phút. Về vòng đời một connection từ sinh (~9ms setup) đến chết (một trong sáu reason) đến sinh lại (auto backoff, sid mới, rooms trống).</p>
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
