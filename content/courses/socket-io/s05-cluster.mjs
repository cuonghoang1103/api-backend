const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 5: Redis adapter và cluster.
 * Đo: kho này có attachRedisAdapter (best-effort). Bài này đo cost pub/sub,
 * cách rooms scale qua workers, và caveats khi cluster.
 */

export default {
  title: 'Chapter 5 — Redis adapter and clustering|||Chương 5 — Redis adapter và cluster',
  slug: 'io-ch5-cluster',
  description: 'Sáu bài về cluster mode — vì sao cần Redis adapter, cost pub/sub, sticky vs Redis (không thay thế), và pattern kho này chọn (best-effort).',
  sortOrder: 6,
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Why Redis adapter: cross-worker broadcast|||5.1 — Vì sao Redis adapter: broadcast qua worker',
      slug: 'io-5-1-vi-sao',
      type: 'VIDEO',
      description: '`io.to(room).emit(...)` mặc định chỉ đến worker hiện tại. Trong cluster nhiều worker, bạn thấy 25-75% users không nhận. Redis adapter phát tin qua pub/sub giữa workers.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Why Redis adapter: cross-worker broadcast</h2>
<p class="lead">Chapter 2.3 said &quot;Redis adapter does NOT replace sticky sessions&quot;. This chapter says the opposite half: without Redis adapter in cluster mode, broadcasts silently reach only 1/N of your users. This lesson measures why.</p>

<h3>The problem — single worker vs cluster</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Adapter kiểm memory-local rooms Map, tìm mọi socket trong <code>thread:42</code>, gửi packet. Đơn giản, đầy đủ.</span></div>
<div class="lz-step"><span class="lz-k">4 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Mỗi worker chỉ biết CÁC SOCKET CỦA MÌNH — 1/4 tổng. Broadcast đến 1/4 người trong room. 3/4 im lặng không nhận.</span></div>
<div class="lz-step"><span class="lz-k">4 worker + Redis</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Worker A publish message vào Redis channel <code>socket.io#thread:42</code>. Worker B, C, D subscribe. Mỗi worker nhận, broadcast local đến CÁC SOCKET CỦA MÌNH. Đầy đủ.</span></div>
</div>

<h3>Kho này — code attach adapter</h3>
<pre><code class="language-ts">// messaging.socket.ts:182-215
async function attachRedisAdapter(server: IOServer): Promise&lt;void&gt; {
  try {
    const base = await getRedis();
    const pubClient = base.duplicate();
    const subClient = base.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    server.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.IO Redis adapter attached (cross-worker broadcasts enabled)');
  } catch (err) {
    logger.warn('Socket.IO Redis adapter NOT attached — in-memory only (single instance)', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
</code></pre>

<div class="callout ok">
<p><strong>BEST-EFFORT — nếu Redis chết, socket.io VẪN chạy đơn máy.</strong> Fallback không throw. Chỉ log warning. Lý do: kho này hiện single instance, adapter là chuẩn bị cho future cluster. Nếu Redis pause trong DB restart, socket không phải cùng chết.</p>
</div>

<h3>Overhead của pub/sub</h3>
<pre><code class="language-text">Cost cho MOI broadcast:
  1. Serialize packet: ~1μs
  2. Redis PUBLISH: ~50-200μs (RTT den Redis)
  3. Worker B, C, D SUBSCRIBE receive: ~50-200μs
  4. Deserialize: ~1μs
  Total added latency: ~100-400μs

Cost cho 1 broadcast toi 10.000 socket:
  Serialize: 1μs (mot lan)
  Redis PUBLISH: 200μs (mot lan, cho worker chinh)
  Worker khac receive + serialize + broadcast: 4 * 50ms neu 10.000 phan bo deu 4 workers
</code></pre>

<h3>Pub/sub channel structure</h3>
<pre><code class="language-text">Redis channels du dung:
  socket.io#/#             # broadcast toan cluster (io.emit)
  socket.io#/#thread:42    # broadcast trong room
  socket.io#/#user:7       # broadcast toi mot user

Pattern la: socket.io#&lt;namespace&gt;#&lt;room-name&gt;
</code></pre>

<h3>Debug pub/sub</h3>
<pre><code class="language-bash">$ redis-cli PSUBSCRIBE 'socket.io#*'
1) "psubscribe"
2) "socket.io#*"
3) (integer) 1

# Trigger mot emit tu server, ban thay:
4) "pmessage"
5) "socket.io#*"
6) "socket.io#/#thread:42"
7) &lt;binary msgpack payload&gt;
</code></pre>

<div class="callout warn">
<p><strong>Redis adapter dùng msgpack, không JSON.</strong> Nên xem qua <code>redis-cli</code> thấy binary — không đọc trực tiếp. Dùng adapter&#39;s debug tools hoặc parse msgpack.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — nghĩ adapter tự share tất cả state qua Redis.</strong> KHÔNG. Adapter chỉ share BROADCASTS (packet đi ra). Rooms membership vẫn LOCAL trong mỗi worker. <code>io.sockets.adapter.rooms.get(&#39;X&#39;)</code> ở worker A chỉ có sockets của A. Cho công việc &quot;ai đang ở room X&quot; toàn cluster, phải dùng <code>await io.in(&#39;X&#39;).fetchSockets()</code> — nó dùng Redis để aggregate.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Không có Redis adapter, cluster mode broadcast chỉ đến 1/N users (worker-local); với adapter, mỗi <code>io.to(room).emit</code> qua Redis pub/sub thêm ~100-400μs latency nhưng đến đầy đủ; kho này attach best-effort — Redis down thì fallback in-memory single-instance.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter — API, protocol, và caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — PUBSUB</span><span class="lc-sub">redis.io/docs/manual/pubsub — fire-and-forget, không persist — nếu subscriber down, message MẤT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn${REF} — cả hai đều cần cho cluster.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Vì sao Redis adapter: broadcast qua worker</h2>
<p class="lead">Chương 2.3 nói &quot;Redis adapter KHÔNG thay thế sticky sessions&quot;. Chương này nói nửa ngược lại: không có Redis adapter trong cluster mode, broadcast âm thầm chỉ đến 1/N user. Bài này đo tại sao.</p>

<h3>Vấn đề — single worker vs cluster</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Adapter kiểm memory-local rooms Map, tìm mọi socket trong <code>thread:42</code>, gửi packet. Đơn giản, đầy đủ.</span></div>
<div class="lz-step"><span class="lz-k">4 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Mỗi worker chỉ biết CÁC SOCKET CỦA MÌNH — 1/4 tổng. Broadcast đến 1/4 người trong room. 3/4 im lặng không nhận.</span></div>
<div class="lz-step"><span class="lz-k">4 worker + Redis</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Worker A publish message vào Redis channel <code>socket.io#thread:42</code>. Worker B, C, D subscribe. Mỗi worker nhận, broadcast local đến CÁC SOCKET CỦA MÌNH. Đầy đủ.</span></div>
</div>

<h3>Kho này — code attach adapter</h3>
<pre><code class="language-ts">// messaging.socket.ts:182-215
async function attachRedisAdapter(server: IOServer): Promise&lt;void&gt; {
  try {
    const base = await getRedis();
    const pubClient = base.duplicate();
    const subClient = base.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    server.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.IO Redis adapter attached (cross-worker broadcasts enabled)');
  } catch (err) {
    logger.warn('Socket.IO Redis adapter NOT attached — in-memory only (single instance)', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
</code></pre>

<div class="callout ok">
<p><strong>BEST-EFFORT — nếu Redis chết, socket.io VẪN chạy đơn máy.</strong> Fallback không throw. Chỉ log warning. Lý do: kho này hiện single instance, adapter là chuẩn bị cho future cluster. Nếu Redis pause trong DB restart, socket không phải cùng chết.</p>
</div>

<h3>Overhead của pub/sub</h3>
<pre><code class="language-text">Cost cho MOI broadcast:
  1. Serialize packet: ~1μs
  2. Redis PUBLISH: ~50-200μs (RTT den Redis)
  3. Worker B, C, D SUBSCRIBE receive: ~50-200μs
  4. Deserialize: ~1μs
  Total added latency: ~100-400μs

Cost cho 1 broadcast toi 10.000 socket:
  Serialize: 1μs (mot lan)
  Redis PUBLISH: 200μs (mot lan, cho worker chinh)
  Worker khac receive + serialize + broadcast: 4 * 50ms neu 10.000 phan bo deu 4 workers
</code></pre>

<h3>Pub/sub channel structure</h3>
<pre><code class="language-text">Redis channels du dung:
  socket.io#/#             # broadcast toan cluster (io.emit)
  socket.io#/#thread:42    # broadcast trong room
  socket.io#/#user:7       # broadcast toi mot user

Pattern la: socket.io#&lt;namespace&gt;#&lt;room-name&gt;
</code></pre>

<h3>Debug pub/sub</h3>
<pre><code class="language-bash">$ redis-cli PSUBSCRIBE 'socket.io#*'
1) "psubscribe"
2) "socket.io#*"
3) (integer) 1

# Trigger mot emit tu server, ban thay:
4) "pmessage"
5) "socket.io#*"
6) "socket.io#/#thread:42"
7) &lt;binary msgpack payload&gt;
</code></pre>

<div class="callout warn">
<p><strong>Redis adapter dùng msgpack, không JSON.</strong> Nên xem qua <code>redis-cli</code> thấy binary — không đọc trực tiếp. Dùng adapter&#39;s debug tools hoặc parse msgpack.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — nghĩ adapter tự share tất cả state qua Redis.</strong> KHÔNG. Adapter chỉ share BROADCASTS (packet đi ra). Rooms membership vẫn LOCAL trong mỗi worker. <code>io.sockets.adapter.rooms.get(&#39;X&#39;)</code> ở worker A chỉ có sockets của A. Cho công việc &quot;ai đang ở room X&quot; toàn cluster, phải dùng <code>await io.in(&#39;X&#39;).fetchSockets()</code> — nó dùng Redis để aggregate.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Không có Redis adapter, cluster mode broadcast chỉ đến 1/N user (worker-local); với adapter, mỗi <code>io.to(room).emit</code> qua Redis pub/sub thêm ~100-400μs latency nhưng đến đầy đủ; kho này attach best-effort — Redis down thì fallback in-memory single-instance.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter — API, protocol, và caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — PUBSUB</span><span class="lc-sub">redis.io/docs/manual/pubsub — fire-and-forget, không persist — nếu subscriber down, message MẤT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn${REF} — cả hai đều cần cho cluster.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Adapter API: fetchSockets, serverSideEmit, socketsJoin|||5.2 — Adapter API: fetchSockets, serverSideEmit, socketsJoin',
      slug: 'io-5-2-adapter-api',
      type: 'VIDEO',
      description: 'Bốn method của adapter chạy được qua cluster. `fetchSockets()` lấy socket từ mọi worker. `serverSideEmit` là RPC giữa worker.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Adapter API: methods that scale across workers</h2>
<p class="lead">Adapter đem đến bốn method mà emit thường không có. Mỗi cái giải quyết vấn đề khác nhau trong cluster.</p>

<h3>fetchSockets — cluster-aware</h3>
<pre><code class="language-ts">// LOCAL only — chi thay socket cua worker hien tai
const localSockets = [...io.of('/').sockets.values()];

// CLUSTER-WIDE — Redis adapter aggregate tu moi worker
const allSockets = await io.fetchSockets();
// tra ve RemoteSocket[] — subset cua Socket API
allSockets[0].data.userId;     // data van co
allSockets[0].emit('foo');     // hoat dong
allSockets[0].on(...);         // KHONG — RemoteSocket khong subscribe
</code></pre>

<h3>socketsJoin / socketsLeave — cluster-wide room management</h3>
<pre><code class="language-ts">// Ep MOI socket cua user 42 (moi worker) join room "vip"
await io.in('user:42').socketsJoin('vip');

// Ep moi socket trong "old-room" roi ra
await io.in('old-room').socketsLeave('old-room');
</code></pre>

<h3>serverSideEmit — RPC giữa workers</h3>
<pre><code class="language-ts">// Worker A: emit request den moi worker khac + tra ket qua
io.serverSideEmit('get-stats', (err, responses) =&gt; {
  // responses la array tu moi worker khac
});

// Worker B, C, D: handler
io.on('get-stats', (cb) =&gt; {
  cb({ workerId: process.pid, count: io.sockets.sockets.size });
});
</code></pre>

<div class="callout ok">
<p><strong>Dùng cho monitoring hoặc admin command.</strong> Đếm tổng số socket qua cluster, kick user khỏi mọi worker, force reload config — đều dễ với <code>serverSideEmit</code>. KHÔNG dùng cho realtime message (overhead lớn hơn thẳng emit).</p>
</div>

<h3>disconnectSockets — kick user khỏi cluster</h3>
<pre><code class="language-ts">// Da doi mat khau — kick moi socket cua user 42
await io.in('user:42').disconnectSockets(true);
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng LOCAL <code>io.sockets.sockets</code> trong cluster.</strong> Trả về Map chỉ chứa sockets của WORKER hiện tại. Với 4 worker, bạn thấy 1/4 users. Luôn dùng <code>await io.fetchSockets()</code> cho public API.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Adapter cung cấp <code>fetchSockets</code>, <code>socketsJoin/Leave</code>, <code>serverSideEmit</code>, <code>disconnectSockets</code> — tất cả cluster-aware qua Redis, mỗi cái giải quyết một vấn đề (query membership, force room membership, RPC, kick) mà LOCAL socket.io API không giải quyết được.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API (adapter)</span><span class="lc-sub">socket.io/docs/v4/server-api#serverfetchsockets — bảng đầy đủ các method.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Adapter API: các method chạy được qua cluster</h2>
<p class="lead">Adapter đem đến bốn method mà emit thường không có. Mỗi cái giải quyết vấn đề khác nhau trong cluster.</p>

<h3>fetchSockets — cluster-aware</h3>
<pre><code class="language-ts">// LOCAL only — chi thay socket cua worker hien tai
const localSockets = [...io.of('/').sockets.values()];

// CLUSTER-WIDE — Redis adapter aggregate tu moi worker
const allSockets = await io.fetchSockets();
// tra ve RemoteSocket[] — subset cua Socket API
allSockets[0].data.userId;     // data van co
allSockets[0].emit('foo');     // hoat dong
allSockets[0].on(...);         // KHONG — RemoteSocket khong subscribe
</code></pre>

<h3>socketsJoin / socketsLeave — cluster-wide room management</h3>
<pre><code class="language-ts">// Ep MOI socket cua user 42 (moi worker) join room "vip"
await io.in('user:42').socketsJoin('vip');

// Ep moi socket trong "old-room" roi ra
await io.in('old-room').socketsLeave('old-room');
</code></pre>

<h3>serverSideEmit — RPC giữa workers</h3>
<pre><code class="language-ts">// Worker A: emit request den moi worker khac + tra ket qua
io.serverSideEmit('get-stats', (err, responses) =&gt; {
  // responses la array tu moi worker khac
});

// Worker B, C, D: handler
io.on('get-stats', (cb) =&gt; {
  cb({ workerId: process.pid, count: io.sockets.sockets.size });
});
</code></pre>

<div class="callout ok">
<p><strong>Dùng cho monitoring hoặc admin command.</strong> Đếm tổng số socket qua cluster, kick user khỏi mọi worker, force reload config — đều dễ với <code>serverSideEmit</code>. KHÔNG dùng cho realtime message (overhead lớn hơn thẳng emit).</p>
</div>

<h3>disconnectSockets — kick user khỏi cluster</h3>
<pre><code class="language-ts">// Da doi mat khau — kick moi socket cua user 42
await io.in('user:42').disconnectSockets(true);
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng LOCAL <code>io.sockets.sockets</code> trong cluster.</strong> Trả về Map chỉ chứa sockets của WORKER hiện tại. Với 4 worker, bạn thấy 1/4 users. Luôn dùng <code>await io.fetchSockets()</code> cho public API.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Adapter cung cấp <code>fetchSockets</code>, <code>socketsJoin/Leave</code>, <code>serverSideEmit</code>, <code>disconnectSockets</code> — tất cả cluster-aware qua Redis, mỗi cái giải quyết một vấn đề (query membership, force room membership, RPC, kick) mà LOCAL socket.io API không giải quyết được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API (adapter)</span><span class="lc-sub">socket.io/docs/v4/server-api#serverfetchsockets — bảng đầy đủ các method.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Failure mode: Redis down|||5.3 — Failure mode: Redis chết',
      slug: 'io-5-3-redis-down',
      type: 'VIDEO',
      description: 'Khi Redis mất, adapter tạm gián đoạn cross-worker broadcast. Kho này chọn best-effort: log warning, in-process broadcast vẫn hoạt động, cluster fanout mất tạm thời.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Failure mode: Redis down</h2>
<p class="lead">Redis is a dependency. It restarts, it lags, it fails over. What happens to socket.io in each of those?</p>

<h3>Three failure modes</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Redis restart nhanh (&lt;5s)</span><span class="lz-d">Pub/sub subscriptions bị mất trong lúc restart. Sau restart, adapter tự re-subscribe (ioredis auto-reconnect). Trong lúc down, cross-worker broadcasts BỊ RỚT — message đến worker A, không đến B/C/D. Sau reconnect, không replay.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Redis chậm/latency spike</span><span class="lz-d">PUBLISH latency tăng từ 1ms lên 500ms. Socket.io emit vẫn không throw — nó fire-and-forget vào Redis client&#39;s TCP send buffer. Nếu buffer đầy, PUBLISH bị queue trong RAM Node — mất tin nhắn không đến.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Redis hoàn toàn không reachable</span><span class="lz-d">Connection error. ioredis retry background. Adapter emit warning; broadcast được TRY nhưng đến nowhere. Cluster fanout hoàn toàn mất. Trong-worker vẫn OK.</span></div>
</div>

<h3>Kho này — code fallback</h3>
<pre><code class="language-ts">// attachRedisAdapter (5.1) log warning, KHONG throw
// -&gt; io van khoi dong, in-memory adapter mac dinh chay
// -&gt; single-worker: OK
// -&gt; cluster: 1/N broadcast fanout, bug am tham
</code></pre>

<div class="callout warn">
<p><strong>Đây là intentional trade-off.</strong> Kho này hôm nay single-instance nên fallback in-memory là OK. Ngày mai khi bật cluster mà không sửa fallback, bạn có bug âm thầm khi Redis blip. Fix: monitoring alarm on adapter warning, hoặc healthcheck kiểm adapter still connected.</p>
</div>

<h3>Redis failover — Redis Sentinel / Redis Cluster</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Sentinel</span><span class="lz-lnote">Failover 5-10s. Pub/sub subscriptions phải re-establish. Trong khoảng đó, broadcast mất</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Cluster (sharded)</span><span class="lz-lnote">Pub/sub trên Redis Cluster có limitation — bạn phải setup mode &quot;sharded pub/sub&quot; Redis 7+. socket.io adapter hỗ trợ nhưng cần cấu hình riêng</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Serverless (Upstash, ElastiCache)</span><span class="lz-lnote">Pub/sub thường KHÔNG hỗ trợ (khác từ Redis-compatible). Đọc doc trước khi chọn service</span></div>
</div>

<h3>Alternatives khi Redis không phù hợp</h3>
<pre><code class="language-text">Postgres adapter (@socket.io/postgres-adapter):
  Dung Postgres LISTEN/NOTIFY. Cost cao hon (~5-10ms), gioi han payload 8KB.
  Uu diem: neu ban da co Postgres, khong them dependency

Cluster adapter (khong dung Redis):
  Chi cho Node cluster mode (worker cua CUNG process). Khong scale qua VM.
  Nhanh (IPC in-memory) — good cho small cluster.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — nghĩ &quot;Redis rất reliable, không cần lo failure&quot;.</strong> Redis restart cho maintenance (~2 giờ/tháng). Trong 30s đó, cluster socket.io mất fanout. Không phải Redis hỏng — là planned maintenance. Design phải chịu được, không chỉ dựa vào Redis luôn up.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Ba failure modes của Redis (restart nhanh, chậm, chết hoàn toàn) đều làm cluster broadcast mất tạm thời — kho này chọn best-effort fallback (in-memory adapter mà single-instance OK), cluster mode cần monitoring adapter status; alternatives Postgres adapter (chậm hơn 5-10ms, 8KB payload) hoặc Node cluster adapter (không scale qua VM).</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter — Reliability</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter#reliability — chính thức nói về failure modes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/postgres-adapter</span><span class="lc-sub">github.com/socketio/socket.io-postgres-adapter — alternative dùng LISTEN/NOTIFY.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Failure mode: Redis chết</h2>
<p class="lead">Redis là dependency. Nó restart, nó chậm, nó failover. Chuyện gì xảy ra với socket.io trong mỗi tình huống?</p>

<h3>Ba failure mode</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Redis restart nhanh (&lt;5s)</span><span class="lz-d">Pub/sub subscriptions bị mất trong lúc restart. Sau restart, adapter tự re-subscribe (ioredis auto-reconnect). Trong lúc down, cross-worker broadcasts BỊ RỚT — message đến worker A, không đến B/C/D. Sau reconnect, không replay.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Redis chậm/latency spike</span><span class="lz-d">PUBLISH latency tăng từ 1ms lên 500ms. Socket.io emit vẫn không throw — nó fire-and-forget vào Redis client&#39;s TCP send buffer. Nếu buffer đầy, PUBLISH bị queue trong RAM Node — mất tin nhắn không đến.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Redis hoàn toàn không reachable</span><span class="lz-d">Connection error. ioredis retry background. Adapter emit warning; broadcast được TRY nhưng đến nowhere. Cluster fanout hoàn toàn mất. Trong-worker vẫn OK.</span></div>
</div>

<h3>Kho này — code fallback</h3>
<pre><code class="language-ts">// attachRedisAdapter (5.1) log warning, KHONG throw
// -&gt; io van khoi dong, in-memory adapter mac dinh chay
// -&gt; single-worker: OK
// -&gt; cluster: 1/N broadcast fanout, bug am tham
</code></pre>

<div class="callout warn">
<p><strong>Đây là intentional trade-off.</strong> Kho này hôm nay single-instance nên fallback in-memory là OK. Ngày mai khi bật cluster mà không sửa fallback, bạn có bug âm thầm khi Redis blip. Fix: monitoring alarm on adapter warning, hoặc healthcheck kiểm adapter still connected.</p>
</div>

<h3>Redis failover — Redis Sentinel / Redis Cluster</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Sentinel</span><span class="lz-lnote">Failover 5-10s. Pub/sub subscriptions phải re-establish. Trong khoảng đó, broadcast mất</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Cluster (sharded)</span><span class="lz-lnote">Pub/sub trên Redis Cluster có limitation — bạn phải setup mode &quot;sharded pub/sub&quot; Redis 7+. socket.io adapter hỗ trợ nhưng cần cấu hình riêng</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Serverless (Upstash, ElastiCache)</span><span class="lz-lnote">Pub/sub thường KHÔNG hỗ trợ (khác từ Redis-compatible). Đọc doc trước khi chọn service</span></div>
</div>

<h3>Alternatives khi Redis không phù hợp</h3>
<pre><code class="language-text">Postgres adapter (@socket.io/postgres-adapter):
  Dung Postgres LISTEN/NOTIFY. Cost cao hon (~5-10ms), gioi han payload 8KB.
  Uu diem: neu ban da co Postgres, khong them dependency

Cluster adapter (khong dung Redis):
  Chi cho Node cluster mode (worker cua CUNG process). Khong scale qua VM.
  Nhanh (IPC in-memory) — good cho small cluster.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — nghĩ &quot;Redis rất reliable, không cần lo failure&quot;.</strong> Redis restart cho maintenance (~2 giờ/tháng). Trong 30s đó, cluster socket.io mất fanout. Không phải Redis hỏng — là planned maintenance. Design phải chịu được, không chỉ dựa vào Redis luôn up.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba failure mode của Redis (restart nhanh, chậm, chết hoàn toàn) đều làm cluster broadcast mất tạm thời — kho này chọn best-effort fallback (in-memory adapter mà single-instance OK), cluster mode cần monitoring adapter status; alternatives Postgres adapter (chậm hơn 5-10ms, 8KB payload) hoặc Node cluster adapter (không scale qua VM).</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter — Reliability</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter#reliability — chính thức nói về failure modes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/postgres-adapter</span><span class="lc-sub">github.com/socketio/socket.io-postgres-adapter — alternative dùng LISTEN/NOTIFY.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Scaling checklist: five before adding a worker|||5.4 — Checklist scale: năm việc trước khi thêm worker',
      slug: 'io-5-4-checklist',
      type: 'VIDEO',
      description: 'Trước khi bật cluster: sticky sessions, Redis adapter, presence state theo userId (không sid), monitoring per-worker, graceful shutdown.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Scaling checklist: five things before adding a worker</h2>
<p class="lead">Adding a worker to a socket.io deployment goes wrong more often than it goes right. This checklist is the five things that must be true before you bring worker 2 online.</p>

<h3>Checklist</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sticky sessions ở proxy</span><span class="lz-d">Nginx <code>hash $cookie_io</code>. Không sticky = polling break 50-75% requests. Bài 2.3.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Redis adapter attached</span><span class="lz-d">Kiểm log &quot;Redis adapter attached&quot;. Nếu &quot;NOT attached&quot;, cluster fanout mất. Bài 5.1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">State theo userId, không sid</span><span class="lz-d">Với reconnect + cluster, sid đổi và socket có thể ở worker khác. State cache theo userId (Redis-backed). Bài 1.5 + 4.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Monitoring per-worker</span><span class="lz-d">Metrics <code>socket.io.connected_count</code> per worker. Không cân bằng = sticky đang chôn ai đó. Grafana dashboard track.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Graceful shutdown</span><span class="lz-d">Worker sắp restart: <code>io.close()</code> trước exit, cho socket disconnect sạch (client thấy <code>&quot;io server disconnect&quot;</code> vs <code>&quot;transport close&quot;</code>). Bài 1.2.</span></div>
</div>

<h3>Graceful shutdown code</h3>
<pre><code class="language-ts">process.on('SIGTERM', async () =&gt; {
  logger.info('SIGTERM received — starting graceful shutdown');
  
  // 1. Stop accepting new connections
  await new Promise((resolve) =&gt; server.close(resolve));
  
  // 2. Close all sockets cleanly
  io.close();
  
  // 3. Wait for pending ops (up to 30s)
  await Promise.race([
    Promise.all([...pendingOps]),
    new Promise(r =&gt; setTimeout(r, 30000)),
  ]);
  
  // 4. Close DB, Redis
  await prisma.$disconnect();
  await redis.quit();
  
  process.exit(0);
});
</code></pre>

<div class="callout ok">
<p><strong>Rolling restart pattern.</strong> Kubernetes/PM2 send SIGTERM, wait <code>terminationGracePeriodSeconds</code> (default 30s), then SIGKILL. Trong 30s đó, worker phải drain — không thì socket bị force-close ngoài ý muốn.</p>
</div>

<h3>Monitoring KPIs</h3>
<pre><code class="language-text">Per-worker metrics:
  socket_io_connected     : so socket dang giu
  socket_io_events_in     : events/sec worker nhan
  socket_io_events_out    : events/sec worker gui (bao gom broadcast)
  redis_adapter_pubsub    : messages pub qua Redis

Cluster-level:
  worker_socket_balance   : max/min socket count ratio (should be 1-2x, not 10x)
  redis_pubsub_latency    : p99 latency PUBLISH
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bật cluster trước khi làm 5 việc trên.</strong> Với 100 user, bạn KHÔNG thấy vấn đề. Với 1.000 user, bug âm thầm và unpredictable. Với 10.000 user, deploy hằng ngày là crisis. Làm checklist TRƯỚC, không SAU.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Trước khi từ 1 worker lên N, năm việc phải xong theo thứ tự: sticky sessions, Redis adapter attached, state theo userId, per-worker metrics, graceful shutdown — thiếu bất cứ cái nào cũng tạo bug âm thầm ở scale trung bình và crisis ở scale lớn.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes — checklist chính thức, phần này diễn giải cho use case kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — Observability</span><span class="lc-sub">/courses/observability/learn${REF} — cách monitor metrics ở trên.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Checklist scale: năm việc trước khi thêm worker</h2>
<p class="lead">Thêm worker vào deployment socket.io hỏng thường hơn thành công. Checklist này là năm việc phải đúng trước khi bạn đưa worker 2 online.</p>

<h3>Checklist</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sticky sessions ở proxy</span><span class="lz-d">Nginx <code>hash $cookie_io</code>. Không sticky = polling break 50-75% requests. Bài 2.3.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Redis adapter attached</span><span class="lz-d">Kiểm log &quot;Redis adapter attached&quot;. Nếu &quot;NOT attached&quot;, cluster fanout mất. Bài 5.1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">State theo userId, không sid</span><span class="lz-d">Với reconnect + cluster, sid đổi và socket có thể ở worker khác. State cache theo userId (Redis-backed). Bài 1.5 + 4.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Monitoring per-worker</span><span class="lz-d">Metrics <code>socket.io.connected_count</code> per worker. Không cân bằng = sticky đang chôn ai đó. Grafana dashboard track.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Graceful shutdown</span><span class="lz-d">Worker sắp restart: <code>io.close()</code> trước exit, cho socket disconnect sạch (client thấy <code>&quot;io server disconnect&quot;</code> vs <code>&quot;transport close&quot;</code>). Bài 1.2.</span></div>
</div>

<h3>Code graceful shutdown</h3>
<pre><code class="language-ts">process.on('SIGTERM', async () =&gt; {
  logger.info('SIGTERM received — starting graceful shutdown');
  
  // 1. Stop accepting new connections
  await new Promise((resolve) =&gt; server.close(resolve));
  
  // 2. Close all sockets cleanly
  io.close();
  
  // 3. Wait for pending ops (up to 30s)
  await Promise.race([
    Promise.all([...pendingOps]),
    new Promise(r =&gt; setTimeout(r, 30000)),
  ]);
  
  // 4. Close DB, Redis
  await prisma.$disconnect();
  await redis.quit();
  
  process.exit(0);
});
</code></pre>

<div class="callout ok">
<p><strong>Rolling restart pattern.</strong> Kubernetes/PM2 gửi SIGTERM, chờ <code>terminationGracePeriodSeconds</code> (default 30s), rồi SIGKILL. Trong 30s đó, worker phải drain — không thì socket bị force-close ngoài ý muốn.</p>
</div>

<h3>Monitoring KPIs</h3>
<pre><code class="language-text">Per-worker metrics:
  socket_io_connected     : so socket dang giu
  socket_io_events_in     : events/sec worker nhan
  socket_io_events_out    : events/sec worker gui (bao gom broadcast)
  redis_adapter_pubsub    : messages pub qua Redis

Cluster-level:
  worker_socket_balance   : max/min socket count ratio (should be 1-2x, not 10x)
  redis_pubsub_latency    : p99 latency PUBLISH
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bật cluster trước khi làm 5 việc trên.</strong> Với 100 user, bạn KHÔNG thấy vấn đề. Với 1.000 user, bug âm thầm và unpredictable. Với 10.000 user, deploy hằng ngày là crisis. Làm checklist TRƯỚC, không SAU.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Trước khi từ 1 worker lên N, năm việc phải xong theo thứ tự: sticky sessions, Redis adapter attached, state theo userId, per-worker metrics, graceful shutdown — thiếu bất cứ cái nào cũng tạo bug âm thầm ở scale trung bình và crisis ở scale lớn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes — checklist chính thức, phần này diễn giải cho use case kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — Observability</span><span class="lc-sub">/courses/observability/learn${REF} — cách monitor metrics ở trên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Alternatives to Redis adapter|||5.5 — Alternatives cho Redis adapter',
      slug: 'io-5-5-alt',
      type: 'VIDEO',
      description: 'MongoDB adapter, Postgres adapter, Kafka adapter, và AMQP adapter. Trade off nào cho mỗi cái, và khi nào không dùng adapter (single instance forever).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Alternatives to Redis adapter</h2>
<p class="lead">Redis is the default recommendation but not the only choice. This lesson catalogs official alternatives and when each fits.</p>

<h3>Bảng so sánh</h3>
<div class="out">Adapter               Backend           Latency  Payload   Persist?  Ideal
--------------------  ----------------  -------  --------  --------  -----
default (memory)      -                 &lt;1ms     unlimited no        single
@s.i/redis-adapter    Redis pub/sub     ~1ms     unlimited no        cluster N&lt;100
@s.i/redis-streams    Redis Streams     ~2ms     unlimited YES       replay needed
@s.i/postgres         Postgres LN       ~10ms    8KB       no        already have PG
@s.i/mongo            MongoDB tail      ~30ms    16MB      YES       already have Mongo
@s.i/cluster          Node cluster IPC  &lt;1ms     unlimited no        single VM only
@s.i/amqp             RabbitMQ          ~5ms     unlimited configurable  enterprise MQ
</div>

<h3>Khi nào NOT dùng adapter</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">single VM luôn</span><span class="lz-d">Kho này hôm nay. Single Docker container. Memory adapter đủ. Đừng thêm dependency chỉ để phòng xa.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">test / dev</span><span class="lz-d">Không cần thiết. Memory adapter chạy tự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Realtime KHÔNG mission-critical</span><span class="lz-d">Nếu broadcast rơi thỉnh thoảng OK (game state, chart update), thì memory + retry ở client đủ.</span></div>
</div>

<h3>Khi nào chọn adapter khác Redis</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">postgres-adapter</span><span class="lz-nsub">đã có Postgres, không muốn Redis</span></span>
<span class="lz-nbody">Dùng LISTEN/NOTIFY. Latency cao hơn ~10× nhưng nếu bạn broadcast không cực nhiều (chat, không phải game), OK. Không cần deploy Redis + monitoring Redis.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">redis-streams-adapter</span><span class="lz-nsub">cần replay khi worker join</span></span>
<span class="lz-nbody">Redis Streams persist messages. Worker mới join có thể replay last N messages — cho use case &quot;client offline 5 phút rồi reconnect, cần catch up&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cluster-adapter</span><span class="lz-nsub">Node cluster mode</span></span>
<span class="lz-nbody">Nếu bạn dùng <code>cluster.fork()</code> có &lt;8 worker cùng VM, IPC nhanh hơn Redis network hop. Nhưng không scale qua VM — bạn khoá mình trong 1 máy.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — chọn Kafka adapter cho scale cao.</strong> Kafka tuyệt vời cho event streaming, nhưng cho pub/sub realtime của socket.io, nó overkill. Latency 5-20ms + operational complexity. Chỉ dùng nếu bạn đã có Kafka cluster với ops team lo.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bảng adapter so sánh 7 lựa chọn với trade off khác nhau — Redis default cho cluster cỡ trung, Postgres nếu đã có sẵn, Redis Streams nếu cần replay, Kafka nếu enterprise-scale — và luôn nhớ &quot;không adapter&quot; là lựa chọn có nếu bạn thực sự single-instance.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapters</span><span class="lc-sub">socket.io/docs/v4/adapter — danh sách adapter chính thức + guide chọn.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Alternatives cho Redis adapter</h2>
<p class="lead">Redis là recommendation mặc định nhưng không phải duy nhất. Bài này liệt kê alternatives chính thức và mỗi cái hợp khi nào.</p>

<h3>Bảng so sánh</h3>
<div class="out">Adapter               Backend           Latency  Payload   Persist?  Ideal
--------------------  ----------------  -------  --------  --------  -----
default (memory)      -                 &lt;1ms     unlimited no        single
@s.i/redis-adapter    Redis pub/sub     ~1ms     unlimited no        cluster N&lt;100
@s.i/redis-streams    Redis Streams     ~2ms     unlimited YES       replay needed
@s.i/postgres         Postgres LN       ~10ms    8KB       no        already have PG
@s.i/mongo            MongoDB tail      ~30ms    16MB      YES       already have Mongo
@s.i/cluster          Node cluster IPC  &lt;1ms     unlimited no        single VM only
@s.i/amqp             RabbitMQ          ~5ms     unlimited configurable  enterprise MQ
</div>

<h3>Khi nào KHÔNG dùng adapter</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">single VM luôn</span><span class="lz-d">Kho này hôm nay. Single Docker container. Memory adapter đủ. Đừng thêm dependency chỉ để phòng xa.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">test / dev</span><span class="lz-d">Không cần thiết. Memory adapter chạy tự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Realtime KHÔNG mission-critical</span><span class="lz-d">Nếu broadcast rơi thỉnh thoảng OK (game state, chart update), thì memory + retry ở client đủ.</span></div>
</div>

<h3>Khi nào chọn adapter khác Redis</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">postgres-adapter</span><span class="lz-nsub">đã có Postgres, không muốn Redis</span></span>
<span class="lz-nbody">Dùng LISTEN/NOTIFY. Latency cao hơn ~10× nhưng nếu bạn broadcast không cực nhiều (chat, không phải game), OK. Không cần deploy Redis + monitoring Redis.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">redis-streams-adapter</span><span class="lz-nsub">cần replay khi worker join</span></span>
<span class="lz-nbody">Redis Streams persist messages. Worker mới join có thể replay last N messages — cho use case &quot;client offline 5 phút rồi reconnect, cần catch up&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cluster-adapter</span><span class="lz-nsub">Node cluster mode</span></span>
<span class="lz-nbody">Nếu bạn dùng <code>cluster.fork()</code> có &lt;8 worker cùng VM, IPC nhanh hơn Redis network hop. Nhưng không scale qua VM — bạn khoá mình trong 1 máy.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — chọn Kafka adapter cho scale cao.</strong> Kafka tuyệt vời cho event streaming, nhưng cho pub/sub realtime của socket.io, nó overkill. Latency 5-20ms + operational complexity. Chỉ dùng nếu bạn đã có Kafka cluster với ops team lo.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bảng adapter so sánh 7 lựa chọn với trade off khác nhau — Redis default cho cluster cỡ trung, Postgres nếu đã có sẵn, Redis Streams nếu cần replay, Kafka nếu enterprise-scale — và luôn nhớ &quot;không adapter&quot; là lựa chọn có nếu bạn thực sự single-instance.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapters</span><span class="lc-sub">socket.io/docs/v4/adapter — danh sách adapter chính thức + guide chọn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
      slug: 'io-5-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về Redis adapter, cluster gotchas, adapter API, và checklist scale.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>What Chapter 5 established</h2>
<p class="lead">Sáu câu về cluster mode socket.io — vì sao cần Redis, khi nào không, và checklist trước khi scale.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã dựng được gì</h2>
<p class="lead">Sáu câu về cluster mode socket.io — vì sao cần Redis, khi nào không, và checklist trước khi scale.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'In a 4-worker cluster WITHOUT Redis adapter, <code>io.to(&quot;room&quot;).emit(...)</code> reaches how many recipients?|||Trong cluster 4 worker KHÔNG có Redis adapter, <code>io.to(&quot;room&quot;).emit(...)</code> đến bao nhiêu người nhận?',
            options: [
              'Only the sockets on the CURRENT worker — roughly 1/4 of the room. Silent partial delivery. Fix: attach Redis adapter (pub/sub across workers)|||Chỉ socket trên worker HIỆN TẠI — khoảng 1/4 room. Delivery một phần âm thầm. Fix: attach Redis adapter (pub/sub qua worker)',
              'All sockets in the room, socket.io handles cluster automatically|||Mọi socket trong room, socket.io tự xử lý cluster',
              'Only the sending socket|||Chỉ socket gửi',
              'None — cluster mode disables broadcasts|||Không ai — cluster mode tắt broadcast',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does <code>await io.fetchSockets()</code> return in a cluster with Redis adapter?|||<code>await io.fetchSockets()</code> trong cluster có Redis adapter trả gì?',
            options: [
              'An array of RemoteSocket instances from ALL workers — a cluster-aware view; supports emit and data access but NOT on/off (RemoteSocket does not subscribe)|||Mảng RemoteSocket từ MỌI worker — cluster-aware; hỗ trợ emit và truy cập data nhưng KHÔNG on/off (RemoteSocket không subscribe)',
              'Only sockets on the current worker|||Chỉ socket trên worker hiện tại',
              'A count, not an array|||Một count, không phải mảng',
              'Sockets in the primary room only|||Chỉ socket trong primary room',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Redis restarts for 30s during maintenance. What happens to cluster broadcasts?|||Redis restart 30s cho maintenance. Chuyện gì với cluster broadcast?',
            options: [
              'Cross-worker broadcasts are LOST during those 30s — pub/sub subscriptions are torn down and re-established on reconnect, no replay. In-worker broadcasts still work. Alert should fire on adapter warning|||Cross-worker broadcast MẤT trong 30s đó — pub/sub subscription bị tear down và re-establish khi reconnect, không replay. In-worker broadcast vẫn OK. Alert nên nổ trên warning adapter',
              'Nothing — Redis adapter has built-in buffering|||Không gì — Redis adapter có buffer built-in',
              'All sockets disconnect|||Mọi socket disconnect',
              'Broadcasts replay automatically|||Broadcast replay tự động',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to enable cluster mode. What is the FIRST thing to check?|||Bạn muốn bật cluster mode. Việc ĐẦU TIÊN cần kiểm?',
            options: [
              'Sticky sessions at the proxy — without them, polling requests round-robin to workers that don\'t know the sid (HTTP 400). Redis adapter does NOT fix this|||Sticky sessions ở proxy — không có nó, polling request round-robin đến worker không biết sid (HTTP 400). Redis adapter KHÔNG fix cái này',
              'Add more RAM to workers|||Thêm RAM cho workers',
              'Disable pingTimeout|||Tắt pingTimeout',
              'Update socket.io to latest|||Update socket.io lên mới',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your app is single-VM with never a plan to cluster. Which adapter to use?|||App bạn single-VM không bao giờ định cluster. Adapter nào dùng?',
            options: [
              'The default in-memory adapter — no external dependency, sub-ms latency, unlimited payload. Adding Redis adapter is pure overhead and a new failure surface|||Adapter mặc định in-memory — không dependency ngoài, sub-ms latency, unlimited payload. Thêm Redis adapter là overhead thuần + failure surface mới',
              'Redis adapter for future-proofing|||Redis adapter để phòng xa',
              'Postgres adapter to reduce dependencies|||Postgres adapter để giảm dependency',
              'Both Redis and Postgres for redundancy|||Cả Redis và Postgres để dự phòng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is TRUE about <code>@socket.io/redis-streams-adapter</code>?|||Điều gì ĐÚNG về <code>@socket.io/redis-streams-adapter</code>?',
            options: [
              'Uses Redis Streams which PERSIST messages — a worker joining late can REPLAY missed messages; useful when clients reconnect after long offline periods|||Dùng Redis Streams PERSIST messages — worker join muộn có thể REPLAY messages đã mất; hữu ích khi client reconnect sau offline lâu',
              'Faster than pub/sub adapter|||Nhanh hơn pub/sub adapter',
              'Uses less memory|||Dùng ít memory hơn',
              'Automatically handles sticky sessions|||Tự xử lý sticky sessions',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
