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
<div class="lz-step"><span class="lz-k">1 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">The adapter checks its memory-local rooms Map, finds every socket in <code>thread:42</code>and sends the packet. Simple and complete.</span></div>
<div class="lz-step"><span class="lz-k">4 worker</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Each worker knows only ITS OWN SOCKETS — a quarter of the total. The broadcast reaches a quarter of the room. The other three quarters get nothing, silently.</span></div>
<div class="lz-step"><span class="lz-k">4 worker + Redis</span><span class="lz-t"><code>io.to(&quot;thread:42&quot;).emit(...)</code></span><span class="lz-d">Worker A publishes the message to the Redis channel <code>socket.io#thread:42</code>. Workers B, C and D are subscribed. Each one receives it and broadcasts locally to ITS OWN SOCKETS. Complete coverage.</span></div>
</div>

<h3>This repo — the code that attaches the adapter</h3>
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
<p><strong>BEST-EFFORT — if Redis dies, socket.io STILL runs as a single instance.</strong> The fallback does not throw. It only logs a warning. The reason: this repo is single-instance today and the adapter is preparation for a future cluster. If Redis pauses during a DB restart, the sockets should not have to die with it.</p>
</div>

<h3>The overhead of pub/sub</h3>
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
<p><strong>The Redis adapter uses msgpack, not JSON.</strong> So looking at it through <code>redis-cli</code> shows binary — not directly readable. Use the adapter&#39;s debug tools, or parse the msgpack yourself.</p>
</div>

<div class="pitfall">
<p><strong>Trap — thinking the adapter shares all state through Redis by itself.</strong> NO. The adapter shares only BROADCASTS (outgoing packets). Room membership stays LOCAL to each worker. <code>io.sockets.adapter.rooms.get(&#39;X&#39;)</code> on worker A holds only A's sockets. To answer &quot;who is in room X&quot; across the whole cluster you must use <code>await io.in(&#39;X&#39;).fetchSockets()</code> — it uses Redis to aggregate.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Without the Redis adapter, a cluster-mode broadcast reaches only 1/N of your users (worker-local); with it, every <code>io.to(room).emit</code> goes through Redis pub/sub, adding ~100-400μs of latency but reaching everyone; this repo attaches it best-effort — if Redis is down it falls back to the in-memory single-instance adapter.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter — API, protocol, và caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — PUBSUB</span><span class="lc-sub">redis.io/docs/manual/pubsub — fire-and-forget, không persist — nếu subscriber down, message MẤT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn${REF} — cả hai đều cần cho cluster.</span></span></div>
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
      title: '5.2 — Adapter API: the four methods that cross workers|||5.2 — Adapter API: bốn method đi xuyên worker',
      slug: 'io-5-2-adapter-api',
      type: 'VIDEO',
      description: 'fetchSockets, socketsJoin/Leave, serverSideEmit và disconnectSockets — bốn method chỉ đúng khi có adapter, và bốn method tương ứng của socket.io thuần sẽ nói dối trong cluster.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Adapter API: the four methods that cross workers</h2>
<p class="lead">Lesson 5.1 established that the adapter carries <code>emit</code> across workers. It also adds four methods that have no single-process equivalent — and, more importantly, it changes the meaning of four methods you were already using. The local versions do not throw in a cluster; they quietly answer for one worker out of N.</p>

<h3>The pairs: what lies, and what tells the truth</h3>
<pre><code class="language-text">LOCAL (one worker only)              CLUSTER-WIDE (via adapter)
──────────────────────────────────  ────────────────────────────────────
io.of('/').sockets                   await io.fetchSockets()
  a Map of THIS worker's sockets       RemoteSocket[] from every worker

socket.join(room)                    await io.in(sel).socketsJoin(room)
  joins one socket you hold            joins every matching socket anywhere

socket.disconnect()                  await io.in(sel).disconnectSockets()
  disconnects one socket you hold      disconnects every match anywhere

(no equivalent)                      io.serverSideEmit(ev, cb)
                                       RPC to the other worker processes

The left column does not error in a cluster. With 4 workers it answers
for ~25% of your users, which is exactly the kind of bug that passes
every local test and every staging test with one instance.
</code></pre>

<h3>fetchSockets — the one you will reach for most</h3>
<pre><code class="language-ts">// LOCAL — only this worker's sockets
const local = [...io.of('/').sockets.values()];
local.length;                    // 312 on a 4-worker box holding ~1,250

// CLUSTER-WIDE — the adapter asks every worker and aggregates
const all = await io.fetchSockets();
all.length;                      // 1,250

// What you get back is a RemoteSocket, not a Socket:
all[0].id;                       // ✅ present
all[0].data.userId;              // ✅ data is replicated with the socket
all[0].rooms;                    // ✅ Set of room names
all[0].handshake;                // ✅ headers, address, auth, query
all[0].emit('foo', payload);     // ✅ routed to the owning worker
all[0].join('vip');              // ✅ routed
all[0].leave('vip');             // ✅ routed
all[0].disconnect();             // ✅ routed
all[0].on('bar', handler);       // ❌ NOT available — see below
</code></pre>

<pre><code class="language-text">Why .on() is missing, and why that is not an oversight:

  A listener is a function. Functions cannot be serialized and shipped
  to another Node process. The socket lives on worker B; your handler
  closure lives on worker A. There is no mechanism that could make
  all[0].on('bar', fn) work.

  Everything that DOES work — emit, join, leave, disconnect — is a
  COMMAND: a message the adapter can serialize, publish to Redis, and
  have the owning worker execute. Everything that does not work is a
  SUBSCRIPTION, which would require moving code.

  That distinction is the whole mental model for the adapter API:
  you can tell a remote socket to do something; you cannot ask it to
  call you back.
</code></pre>

<h3>Filtering with fetchSockets</h3>
<pre><code class="language-ts">// Every socket in a room, across the cluster
const inRoom = await io.in('room:42').fetchSockets();

// Combine selectors — same chaining as emit
const vipsExceptOne = await io.in('vip').except('room:muted').fetchSockets();

// A namespace other than '/'
const admins = await io.of('/admin').fetchSockets();

// A common real query: is this user online anywhere?
async function isOnline(userId: number) {
  const sockets = await io.in(\`user:\${userId}\`).fetchSockets();
  return sockets.length &gt; 0;
}
</code></pre>

<div class="callout warn">
<p><strong>Cost note.</strong> <code>fetchSockets()</code> is a round-trip to every worker, gated by a timeout. It is fine on an admin endpoint or a once-per-minute metric. It is <em>not</em> fine inside a message handler that fires thousands of times a second — that turns one user action into N Redis round-trips. If you need &quot;is this user online&quot; on a hot path, keep a presence set in Redis instead (Chapter 4).</p>
</div>

<h3>socketsJoin / socketsLeave — moving rooms you do not hold</h3>
<pre><code class="language-ts">// The problem: user 42 has 3 tabs open, spread across 3 different
// workers. You want all of them in the "vip" room. You hold none
// of those socket objects.

await io.in('user:42').socketsJoin('vip');     // all three, anywhere
await io.in('old-room').socketsLeave('old-room');

// Also accepts an array
await io.in('user:42').socketsJoin(['vip', 'announcements']);
</code></pre>

<pre><code class="language-text">The pattern this exists for:

  1. A user upgrades to a paid plan mid-session
  2. Their entitlement changes, so their room membership must change
  3. But their sockets are on workers you are not currently executing on

  Without socketsJoin: you would emit a "re-subscribe" message to the
  user, and their client would have to ask to join — a round-trip to
  the browser and back, which fails if the tab is backgrounded.

  With socketsJoin: the server changes membership directly. The client
  does not participate and cannot get it wrong.
</code></pre>

<h3>serverSideEmit — RPC between worker processes</h3>
<pre><code class="language-ts">// Worker A asks every OTHER worker a question
io.serverSideEmit('get-stats', (err, responses) =&gt; {
  if (err) {
    // At least one worker did not answer before the timeout.
    // responses is NOT populated — you get the error instead.
    logger.warn('serverSideEmit timed out', { err: err.message });
    return;
  }
  // responses: one entry per other worker, in arbitrary order
  const total = responses.reduce((n, r) =&gt; n + r.count, 0);
});

// Every other worker answers
io.on('get-stats', (cb) =&gt; {
  cb({ pid: process.pid, count: io.of('/').sockets.size });
});
</code></pre>

<pre><code class="language-text">Four properties that decide whether you should use it:

  1. It reaches every OTHER worker, never the sender.
     A 4-worker cluster gives you 3 responses, not 4. If you want a
     cluster total, add the local value yourself.

  2. The callback is all-or-nothing.
     One slow worker means an error and NO partial results. There is
     no "here are the 2 that answered". Design for the error path.

  3. Arguments must be serializable.
     Same constraint as .on() above: no functions, no class instances
     with methods, no circular references.

  4. It is slow relative to emit.
     A publish, N subscribes, N handler runs, N publishes back, and a
     collect. Use it for admin and monitoring, never for user messages.
</code></pre>

<h3>disconnectSockets — the security-relevant one</h3>
<pre><code class="language-ts">// Password changed, or the account was banned. Every session of this
// user must end, on every worker, immediately.
await io.in(\`user:\${userId}\`).disconnectSockets(true);
//                                              ^^^^
// true  = close the underlying transport too (the client sees a real
//         disconnect and its reconnect logic runs)
// false = leave the low-level connection open (rarely what you want)
</code></pre>

<pre><code class="language-text">Why this matters more than it looks:

  Revoking a token in your database stops the NEXT request from
  authenticating. It does nothing to a WebSocket that authenticated
  ten minutes ago and is still open — that connection keeps receiving
  events for as long as it stays connected, which can be hours.

  So "log out everywhere" has two halves:
    1. invalidate the token / session record   (your auth layer)
    2. disconnectSockets across the cluster    (this method)

  Skipping the second half is a real vulnerability with a long tail:
  a banned user keeps seeing live messages until their network blips.
</code></pre>

<h3>Reading the source of truth</h3>
<pre><code class="language-ts">// Which adapter is actually installed? Worth logging at boot —
// a misconfigured deploy that silently ran the in-memory adapter is
// Chapter 5.3's failure mode, and this line catches it.
logger.info('[socket] adapter', {
  name: io.of('/').adapter.constructor.name,
  // 'Adapter'      → in-memory, single process only
  // 'RedisAdapter' → cluster-aware
});
</code></pre>

<div class="pitfall">
<p><strong>Trap — using <code>io.sockets.sockets</code> for a user-facing count.</strong> It is a <code>Map</code> of the current worker's sockets only. On 4 workers your &quot;online users&quot; number is roughly a quarter of the truth, and it is <em>different on every request</em> depending on which worker answered. It never throws, so nothing points at it. Use <code>await io.fetchSockets()</code>, or better, a Redis presence set.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating <code>serverSideEmit</code>'s callback as partial-results.</strong> If any worker misses the timeout you get an error and no responses at all, not the subset that answered. A monitoring endpoint written assuming partial results will show &quot;0 users online&quot; during a slow moment rather than a slightly stale number.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The adapter adds four cluster-wide methods — <code>fetchSockets</code> (aggregate, returns command-only <code>RemoteSocket</code>s because listeners cannot be serialized across processes), <code>socketsJoin</code>/<code>socketsLeave</code> (change room membership for sockets you do not hold), <code>serverSideEmit</code> (all-or-nothing RPC to the <em>other</em> workers), and <code>disconnectSockets</code> (the half of &quot;log out everywhere&quot; that token revocation cannot do) — and the danger is not these methods but their local counterparts, which in a cluster answer for one worker out of N without ever raising an error.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API</span><span class="lc-sub">socket.io/docs/v4/server-api#serverfetchsockets — bảng đầy đủ, kèm phần RemoteSocket.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — method nào đi qua adapter và method nào không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server-side emit</span><span class="lc-sub">socket.io/docs/v4/server-api#serverserversideemiteventname-args — ngữ nghĩa timeout và callback.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Adapter API: bốn method đi xuyên worker</h2>
<p class="lead">Bài 5.1 đã xác lập rằng adapter mang <code>emit</code> đi qua các worker. Nó còn thêm bốn method không có bản tương đương trong tiến trình đơn — và, quan trọng hơn, nó thay đổi ý nghĩa của bốn method bạn vốn đã dùng. Các phiên bản local không ném lỗi trong cluster; chúng lặng lẽ trả lời thay cho một worker trên N.</p>

<h3>Các cặp: cái nào nói dối, cái nào nói thật</h3>
<pre><code class="language-text">LOCAL (chỉ một worker)               TOÀN CLUSTER (qua adapter)
──────────────────────────────────  ────────────────────────────────────
io.of('/').sockets                   await io.fetchSockets()
  Map socket của CHÍNH worker này      RemoteSocket[] từ mọi worker

socket.join(room)                    await io.in(sel).socketsJoin(room)
  join một socket bạn đang cầm         join mọi socket khớp, ở bất kỳ đâu

socket.disconnect()                  await io.in(sel).disconnectSockets()
  ngắt một socket bạn đang cầm         ngắt mọi socket khớp, ở bất kỳ đâu

(không có tương đương)               io.serverSideEmit(ev, cb)
                                       RPC tới các tiến trình worker khác

Cột trái không báo lỗi trong cluster. Với 4 worker nó trả lời thay cho
~25% người dùng của bạn, đúng loại bug lọt qua mọi test local và mọi
test staging chạy một instance.
</code></pre>

<h3>fetchSockets — cái bạn sẽ dùng nhiều nhất</h3>
<pre><code class="language-ts">// LOCAL — chỉ socket của worker này
const local = [...io.of('/').sockets.values()];
local.length;                    // 312 trên máy 4 worker đang giữ ~1.250

// TOÀN CLUSTER — adapter hỏi mọi worker rồi gộp lại
const all = await io.fetchSockets();
all.length;                      // 1.250

// Thứ bạn nhận về là RemoteSocket, không phải Socket:
all[0].id;                       // ✅ có
all[0].data.userId;              // ✅ data được nhân bản cùng socket
all[0].rooms;                    // ✅ Set tên room
all[0].handshake;                // ✅ header, address, auth, query
all[0].emit('foo', payload);     // ✅ định tuyến tới worker sở hữu
all[0].join('vip');              // ✅ định tuyến
all[0].leave('vip');             // ✅ định tuyến
all[0].disconnect();             // ✅ định tuyến
all[0].on('bar', handler);       // ❌ KHÔNG có — xem dưới
</code></pre>

<pre><code class="language-text">Vì sao thiếu .on(), và vì sao đó không phải một thiếu sót:

  Một listener là một hàm. Hàm không serialize được để gửi sang một
  tiến trình Node khác. Socket sống ở worker B; closure handler của
  bạn sống ở worker A. Không có cơ chế nào làm cho
  all[0].on('bar', fn) chạy được.

  Mọi thứ CHẠY ĐƯỢC — emit, join, leave, disconnect — đều là một
  MỆNH LỆNH: một thông điệp mà adapter serialize được, publish lên
  Redis, và để worker sở hữu thực thi. Mọi thứ không chạy được đều là
  một ĐĂNG KÝ LẮNG NGHE, thứ đòi phải di chuyển mã.

  Sự phân biệt đó chính là toàn bộ mô hình tư duy cho adapter API:
  bạn ra lệnh được cho một socket ở xa; bạn không nhờ nó gọi lại
  cho bạn được.
</code></pre>

<h3>Lọc bằng fetchSockets</h3>
<pre><code class="language-ts">// Mọi socket trong một room, xuyên cluster
const inRoom = await io.in('room:42').fetchSockets();

// Kết hợp selector — cùng cách nối chuỗi như emit
const vipsExceptOne = await io.in('vip').except('room:muted').fetchSockets();

// Một namespace khác '/'
const admins = await io.of('/admin').fetchSockets();

// Một truy vấn thật rất hay gặp: user này có online ở đâu không?
async function isOnline(userId: number) {
  const sockets = await io.in(\`user:\${userId}\`).fetchSockets();
  return sockets.length &gt; 0;
}
</code></pre>

<div class="callout warn">
<p><strong>Ghi chú chi phí.</strong> <code>fetchSockets()</code> là một vòng gọi tới mọi worker, có timeout canh. Nó ổn trên một endpoint admin hoặc một chỉ số mỗi phút một lần. Nó <em>không</em> ổn bên trong một handler thông điệp chạy hàng nghìn lần mỗi giây — cái đó biến một thao tác của người dùng thành N vòng gọi Redis. Nếu cần &quot;user này có online không&quot; trên đường nóng, hãy giữ một tập presence trong Redis (Chương 4).</p>
</div>

<h3>socketsJoin / socketsLeave — đổi room của socket bạn không cầm</h3>
<pre><code class="language-ts">// Vấn đề: user 42 mở 3 tab, nằm rải trên 3 worker khác nhau. Bạn
// muốn cả ba vào room "vip". Bạn không cầm object socket nào trong số đó.

await io.in('user:42').socketsJoin('vip');     // cả ba, ở bất kỳ đâu
await io.in('old-room').socketsLeave('old-room');

// Cũng nhận một mảng
await io.in('user:42').socketsJoin(['vip', 'announcements']);
</code></pre>

<pre><code class="language-text">Cái pattern mà nó sinh ra để phục vụ:

  1. Một user nâng cấp lên gói trả phí giữa phiên
  2. Quyền lợi của họ đổi, nên room họ thuộc về phải đổi theo
  3. Nhưng socket của họ nằm trên những worker mà bạn không đang chạy trên đó

  Không có socketsJoin: bạn sẽ phải emit một thông điệp "đăng ký lại"
  xuống cho user, và client của họ phải xin join — một vòng đi xuống
  trình duyệt rồi quay lại, thứ sẽ hỏng nếu tab đang chạy nền.

  Có socketsJoin: server đổi thành viên trực tiếp. Client không tham
  gia vào và không thể làm sai được.
</code></pre>

<h3>serverSideEmit — RPC giữa các tiến trình worker</h3>
<pre><code class="language-ts">// Worker A hỏi mọi worker KHÁC một câu
io.serverSideEmit('get-stats', (err, responses) =&gt; {
  if (err) {
    // Ít nhất một worker không trả lời kịp timeout.
    // responses KHÔNG được điền — bạn nhận lỗi thay vào đó.
    logger.warn('serverSideEmit timed out', { err: err.message });
    return;
  }
  // responses: một mục cho mỗi worker khác, thứ tự tuỳ ý
  const total = responses.reduce((n, r) =&gt; n + r.count, 0);
});

// Mọi worker khác trả lời
io.on('get-stats', (cb) =&gt; {
  cb({ pid: process.pid, count: io.of('/').sockets.size });
});
</code></pre>

<pre><code class="language-text">Bốn tính chất quyết định bạn có nên dùng nó không:

  1. Nó tới mọi worker KHÁC, không bao giờ tới chính người gửi.
     Một cluster 4 worker cho bạn 3 response, không phải 4. Muốn tổng
     toàn cluster thì tự cộng giá trị local vào.

  2. Callback là được-tất-cả-hoặc-không-gì.
     Một worker chậm nghĩa là một lỗi và KHÔNG có kết quả từng phần.
     Không có chuyện "đây là 2 cái đã trả lời". Hãy thiết kế cho nhánh lỗi.

  3. Tham số phải serialize được.
     Cùng ràng buộc với .on() ở trên: không hàm, không instance class
     có method, không tham chiếu vòng.

  4. Nó chậm so với emit.
     Một lần publish, N lần subscribe, N lần chạy handler, N lần publish
     ngược, rồi một lần gom. Dùng cho admin và giám sát, không bao giờ
     cho thông điệp của người dùng.
</code></pre>

<h3>disconnectSockets — cái liên quan tới bảo mật</h3>
<pre><code class="language-ts">// Đã đổi mật khẩu, hoặc tài khoản bị cấm. Mọi phiên của user này
// phải chấm dứt, trên mọi worker, ngay lập tức.
await io.in(\`user:\${userId}\`).disconnectSockets(true);
//                                              ^^^^
// true  = đóng luôn transport bên dưới (client thấy một lần ngắt thật
//         và logic reconnect của nó chạy)
// false = để kết nối tầng thấp mở (hiếm khi là thứ bạn muốn)
</code></pre>

<pre><code class="language-text">Vì sao điều này quan trọng hơn vẻ ngoài của nó:

  Thu hồi một token trong database chặn được request TIẾP THEO xác thực.
  Nó không làm gì được với một WebSocket đã xác thực từ mười phút trước
  và vẫn đang mở — kết nối đó tiếp tục nhận sự kiện chừng nào nó còn
  kết nối, và chừng đó có thể là hàng giờ.

  Nên "đăng xuất mọi nơi" có hai nửa:
    1. vô hiệu hoá token / bản ghi phiên     (lớp auth của bạn)
    2. disconnectSockets xuyên cluster       (method này)

  Bỏ qua nửa thứ hai là một lỗ hổng thật với cái đuôi dài: một user
  bị cấm vẫn thấy thông điệp trực tiếp cho tới khi mạng của họ chớp.
</code></pre>

<h3>Đọc nguồn sự thật</h3>
<pre><code class="language-ts">// Adapter nào thực sự được cài? Đáng ghi log lúc khởi động —
// một lần deploy sai cấu hình mà âm thầm chạy adapter in-memory chính
// là failure mode ở Bài 5.3, và dòng này bắt được nó.
logger.info('[socket] adapter', {
  name: io.of('/').adapter.constructor.name,
  // 'Adapter'      → in-memory, chỉ một tiến trình
  // 'RedisAdapter' → nhận biết cluster
});
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>io.sockets.sockets</code> cho một con số hiển thị cho người dùng.</strong> Nó là một <code>Map</code> chỉ chứa socket của worker hiện tại. Trên 4 worker, con số &quot;người dùng đang online&quot; của bạn xấp xỉ một phần tư sự thật, và nó <em>khác nhau ở mỗi request</em> tuỳ worker nào trả lời. Nó không bao giờ ném lỗi, nên chẳng có gì chỉ vào nó. Hãy dùng <code>await io.fetchSockets()</code>, hoặc tốt hơn là một tập presence trong Redis.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi callback của <code>serverSideEmit</code> là kết quả từng phần.</strong> Nếu bất kỳ worker nào lỡ timeout, bạn nhận một lỗi và hoàn toàn không có response nào, chứ không phải cái tập con đã trả lời. Một endpoint giám sát viết theo giả định có kết quả từng phần sẽ hiện &quot;0 người online&quot; trong một khoảnh khắc chậm thay vì một con số hơi cũ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Adapter thêm bốn method toàn-cluster — <code>fetchSockets</code> (gộp lại, trả về <code>RemoteSocket</code> chỉ-nhận-lệnh vì listener không serialize được qua tiến trình), <code>socketsJoin</code>/<code>socketsLeave</code> (đổi thành viên room cho những socket bạn không cầm), <code>serverSideEmit</code> (RPC được-tất-cả-hoặc-không-gì tới các worker <em>khác</em>), và <code>disconnectSockets</code> (nửa của &quot;đăng xuất mọi nơi&quot; mà việc thu hồi token không làm được) — và mối nguy không nằm ở những method này mà ở những bản local tương ứng, vốn trong cluster trả lời thay cho một worker trên N mà không bao giờ nêu lên một lỗi nào.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server API</span><span class="lc-sub">socket.io/docs/v4/server-api#serverfetchsockets — bảng đầy đủ, kèm phần RemoteSocket.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — method nào đi qua adapter và method nào không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Server-side emit</span><span class="lc-sub">socket.io/docs/v4/server-api#serverserversideemiteventname-args — ngữ nghĩa timeout và callback.</span></span></div>
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
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Redis restart nhanh (&lt;5s)</span><span class="lz-d">Pub/sub subscriptions are lost during the restart. Afterwards the adapter re-subscribes on its own (ioredis auto-reconnect). While it is down, cross-worker broadcasts are DROPPED — the message reaches worker A but not B/C/D. After the reconnect, nothing is replayed.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Redis slow / a latency spike</span><span class="lz-d">PUBLISH latency climbs from 1ms to 500ms. The socket.io emit still does not throw — it fires and forgets into the Redis client&#39;s TCP send buffer. If that buffer fills, the PUBLISH queues in Node's memory — and the message quietly never arrives.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Redis completely unreachable</span><span class="lz-d">A connection error. ioredis retries in the background. The adapter emits a warning; the broadcast is ATTEMPTED but goes nowhere. Cluster fanout is entirely lost. Within a single worker things still work.</span></div>
</div>

<h3>This repo — the fallback code</h3>
<pre><code class="language-ts">// attachRedisAdapter (5.1) log warning, KHONG throw
// -&gt; io van khoi dong, in-memory adapter mac dinh chay
// -&gt; single-worker: OK
// -&gt; cluster: 1/N broadcast fanout, bug am tham
</code></pre>

<div class="callout warn">
<p><strong>This is a deliberate trade-off.</strong> This repo is single-instance today, so an in-memory fallback is fine. The day you enable clustering without revisiting that fallback, you get a silent bug on every Redis blip. The fix: alarm on the adapter warning, or a healthcheck that verifies the adapter is still connected.</p>
</div>

<h3>Redis failover — Redis Sentinel / Redis Cluster</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Sentinel</span><span class="lz-lnote">A 5-10s failover. Pub/sub subscriptions have to be re-established. During that window, broadcasts are lost</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Cluster (sharded)</span><span class="lz-lnote">Pub/sub on Redis Cluster has limitations — you have to set up &quot;sharded pub/sub&quot; mode on Redis 7+. The socket.io adapter supports it, but it needs its own configuration</span></div>
<div class="lz-layer"><span class="lz-lname">Redis Serverless (Upstash, ElastiCache)</span><span class="lz-lnote">Pub/sub is often NOT supported (Redis-compatible is not the same as Redis). Read the docs before choosing a service</span></div>
</div>

<h3>Alternatives when Redis is not a good fit</h3>
<pre><code class="language-text">Postgres adapter (@socket.io/postgres-adapter):
  Dung Postgres LISTEN/NOTIFY. Cost cao hon (~5-10ms), gioi han payload 8KB.
  Uu diem: neu ban da co Postgres, khong them dependency

Cluster adapter (khong dung Redis):
  Chi cho Node cluster mode (worker cua CUNG process). Khong scale qua VM.
  Nhanh (IPC in-memory) — good cho small cluster.
</code></pre>

<div class="pitfall">
<p><strong>Trap — thinking &quot;Redis is very reliable, no need to plan for failure&quot;.</strong> Redis restarts for maintenance (~2 hours a month). For those 30 seconds, the socket.io cluster loses fanout. Redis is not broken — this is planned maintenance. The design has to survive it rather than assume Redis is always up.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> All three Redis failure modes (a quick restart, slowness, total death) cost you cluster broadcast for a while — this repo chooses a best-effort fallback (the in-memory adapter, fine while single-instance), while cluster mode needs monitoring of the adapter's status; the alternatives are the Postgres adapter (5-10ms slower, 8KB payloads) or the Node cluster adapter (which does not scale across VMs).</p>
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
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sticky sessions at the proxy</span><span class="lz-d">Nginx <code>hash $cookie_io</code>. Without stickiness, polling breaks 50-75% of requests. Lesson 2.3.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Redis adapter attached</span><span class="lz-d">Check for the &quot;Redis adapter attached&quot; log line. If it says &quot;NOT attached&quot;, cluster fanout is gone. Lesson 5.1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">State keyed by userId, not sid</span><span class="lz-d">With reconnects and a cluster, the sid changes and the socket may land on a different worker. Cache state by userId (Redis-backed). Lessons 1.5 and 4.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Monitoring per-worker</span><span class="lz-d">Metrics <code>socket.io.connected_count</code> per worker. An imbalance means stickiness is burying someone. Track it on a Grafana dashboard.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Graceful shutdown</span><span class="lz-d">A worker about to restart: <code>io.close()</code> before exiting, so sockets disconnect cleanly (the client sees <code>&quot;io server disconnect&quot;</code> vs <code>&quot;transport close&quot;</code>). Lesson 1.2.</span></div>
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
<p><strong>Rolling restart pattern.</strong> Kubernetes/PM2 send SIGTERM, wait <code>terminationGracePeriodSeconds</code> (30s by default), then SIGKILL. In those 30 seconds the worker has to drain — otherwise sockets are force-closed against your intent.</p>
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
<p><strong>Trap — enabling clustering before doing the five things above.</strong> At 100 users you see NO problem. At 1,000 the bugs are silent and unpredictable. At 10,000 every daily deploy is a crisis. Work the checklist BEFORE, not after.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Before going from 1 worker to N, five things must be done in order: sticky sessions, the Redis adapter attached, state keyed by userId, per-worker metrics, and graceful shutdown — miss any one of them and you get silent bugs at medium scale and a crisis at large scale.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes — checklist chính thức, phần này diễn giải cho use case kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — Observability</span><span class="lc-sub">/courses/observability/learn${REF} — cách monitor metrics ở trên.</span></span></div>
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
      title: '5.5 — Alternatives to the Redis adapter|||5.5 — Những lựa chọn thay cho Redis adapter',
      slug: 'io-5-5-alt',
      type: 'VIDEO',
      description: 'Bốn cách khác để broadcast xuyên worker — cluster adapter, Postgres, MongoDB, và không cluster gì cả — kèm điều kiện khiến mỗi cái là lựa chọn đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Alternatives to the Redis adapter</h2>
<p class="lead">Redis is the default answer and usually the right one, but it is not the only one — and reaching for it reflexively means adding a service you now have to run, monitor and pay for. Four alternatives exist, and each is correct under a condition you can state precisely.</p>

<h3>The options, and the condition that selects each</h3>
<pre><code class="language-text">Option                    Correct when…                    Cost
───────────────────────  ──────────────────────────────  ──────────────────
No adapter at all         You genuinely run ONE process   Zero. Also the
(in-memory, the default)  and will keep doing so           default, which is
                                                           why it is dangerous

@socket.io/cluster-       All workers are on ONE machine  Zero extra infra
adapter                   via node:cluster                 Does NOT cross
                                                           machines

@socket.io/redis-adapter  Multiple machines, and you      A Redis you run
                          already run Redis                and monitor

@socket.io/postgres-      Multiple machines, and you      No new service if
adapter                   already run Postgres but NOT     Postgres is there
                          Redis                            Higher latency

@socket.io/mongo-adapter  Same, but MongoDB               Same trade
</code></pre>

<h3>Option 1 — no adapter, deliberately</h3>
<pre><code class="language-ts">// This is what you get if you configure nothing:
const io = new Server(httpServer);
io.of('/').adapter.constructor.name;   // 'Adapter' — in-memory
</code></pre>

<pre><code class="language-text">The in-memory adapter is correct when there is exactly one process,
and that is a real configuration:

  - A small app on a single VPS with one Node process
  - An internal tool with dozens, not thousands, of users
  - Any deployment where you have consciously decided that vertical
    scaling is enough for the next year

The danger is not that it is slow. It is that it is the DEFAULT, so
"we never chose an adapter" and "we chose the in-memory adapter"
produce identical code. The moment someone adds a second worker —
a pm2 instance count, a Docker replica, a Kubernetes scale-up — the
app keeps starting, keeps serving, and silently delivers messages to
roughly 1/N of the intended recipients.

That is why Lesson 5.2 ends with a boot-time log line. It costs one
line and turns an invisible misconfiguration into a visible one.
</code></pre>

<h3>Option 2 — the cluster adapter, for one machine</h3>
<pre><code class="language-ts">import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { setupMaster } from '@socket.io/sticky';

if (cluster.isPrimary) {
  const httpServer = http.createServer();
  setupMaster(httpServer, { loadBalancingMethod: 'least-connection' });
  setupPrimary();                       // routes adapter messages between workers
  httpServer.listen(3000);
  for (let i = 0; i &lt; os.cpus().length; i++) cluster.fork();
} else {
  const io = new Server(httpServer);
  io.adapter(createAdapter());          // IPC between workers, no Redis
}
</code></pre>

<pre><code class="language-text">What it does: routes adapter traffic over Node's built-in IPC channel
between the primary process and its workers.

  ✅ No external service. Nothing to install, monitor, or pay for.
  ✅ Lower latency than Redis — no network hop, no serialization to
     a separate process over TCP.
  ✅ Pairs with @socket.io/sticky, which solves the polling stickiness
     problem from Chapter 2 in the same setup.

  ❌ ONE machine only. The primary process is the router, so a second
     server has no way to participate.
  ❌ The primary becomes a bottleneck and a single point of failure
     for cross-worker delivery.

This is the option most small deployments should take and most skip.
If you run four workers on one VPS — which describes an enormous
number of Node apps — this gives you correct cross-worker broadcast
with no Redis at all.
</code></pre>

<h3>Option 3 — Postgres, when you already have it</h3>
<pre><code class="language-ts">import { createAdapter } from '@socket.io/postgres-adapter';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
io.adapter(createAdapter(pool));
</code></pre>

<pre><code class="language-text">It uses LISTEN/NOTIFY — Postgres's own pub/sub — plus a table for
payloads too large for a NOTIFY message (the limit is 8000 bytes).

  ✅ No new service if Postgres is already in your stack, which for
     this repo it is.
  ✅ One less thing to back up, secure, and upgrade.

  ❌ Higher latency than Redis. LISTEN/NOTIFY is not what Postgres is
     optimized for, and every broadcast now competes with your query
     workload for the same connections.
  ❌ Large payloads round-trip through a table, which turns a
     broadcast into a write.
  ❌ Connection pool pressure: the adapter holds a dedicated
     connection for LISTEN, and under load that matters.

The honest framing: this is a good choice when your realtime traffic
is modest and you value operational simplicity over milliseconds.
It is a poor choice for a chat-heavy app, because you have put your
message bus on the same box as your durable data.
</code></pre>

<h3>Deciding, in three questions</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Will you ever run more than one machine?</span><span class="lz-d">If genuinely no — and be honest, because &quot;we might scale later&quot; is not the same as a plan — the cluster adapter is strictly better than Redis: less to run, lower latency, and it solves stickiness in the same configuration.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Do you already run Redis?</span><span class="lz-d">If yes, use it. The Redis adapter is the best-tested, best-documented option, and adding one more use to a service you already operate costs nearly nothing. This repo already runs Redis for caching and queues, so the answer here is yes.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Is realtime traffic modest and Postgres already present?</span><span class="lz-d">Then the Postgres adapter is defensible, and it is the right call for an internal tool where adding a Redis is more operational burden than the latency is worth. Measure the p99 before committing — LISTEN/NOTIFY under a busy query load is not what the benchmarks show.</span></div>
</div>

<h3>The migration path between them</h3>
<pre><code class="language-ts">// Adapters are swappable at one line, which is the point of the
// abstraction. Moving from cluster-adapter to redis-adapter when a
// second machine appears is a config change, not a rewrite:

const adapter = process.env.SOCKET_ADAPTER ?? 'memory';

if (adapter === 'redis') {
  const pub = createClient({ url: process.env.REDIS_URL });
  const sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  io.adapter(createRedisAdapter(pub, sub));
} else if (adapter === 'cluster') {
  io.adapter(createClusterAdapter());
}
// else: in-memory, and the boot log will say so

logger.info('[socket] adapter', { configured: adapter, actual: io.of('/').adapter.constructor.name });
</code></pre>

<p>Note the log prints both the <em>intended</em> and the <em>actual</em> adapter. Those disagreeing — because an env var was missing, or a Redis connection failed and something swallowed the error — is precisely the silent misconfiguration this chapter keeps returning to.</p>

<div class="pitfall">
<p><strong>Trap — choosing Redis reflexively for a single-machine deployment.</strong> If all your workers are on one box under <code>node:cluster</code>, the cluster adapter is lower latency and adds no service to operate. Redis becomes correct the moment there is a second machine — not before.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating the Postgres adapter as a drop-in for Redis at any scale.</strong> LISTEN/NOTIFY caps payloads at 8000 bytes and spills larger ones to a table, and the adapter holds a dedicated connection. On a chat-heavy workload you have quietly put your message bus in contention with your durable data. Measure p99 broadcast latency under your real query load before committing.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Four adapters exist and each is selected by one condition — in-memory when you genuinely run one process (dangerous only because it is the silent default), <code>cluster-adapter</code> when every worker is on one machine under <code>node:cluster</code> (lower latency than Redis, no service to operate, and it pairs with <code>@socket.io/sticky</code>), <code>redis-adapter</code> once there is a second machine or you already run Redis, and <code>postgres-adapter</code> when realtime traffic is modest and operational simplicity beats milliseconds — and because swapping them is a one-line change, the real decision is only ever &quot;what is true today&quot;.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — danh sách adapter chính thức và giao diện chung.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/cluster-adapter</span><span class="lc-sub">github.com/socketio/socket.io-cluster-adapter — IPC giữa worker, dùng với setupPrimary.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/postgres-adapter</span><span class="lc-sub">github.com/socketio/socket.io-postgres-adapter — LISTEN/NOTIFY và giới hạn 8000 byte.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — NOTIFY</span><span class="lc-sub">postgresql.org/docs/current/sql-notify.html — trần payload và ngữ nghĩa hàng đợi.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Những lựa chọn thay cho Redis adapter</h2>
<p class="lead">Redis là câu trả lời mặc định và thường là câu trả lời đúng, nhưng nó không phải cái duy nhất — và với tới nó theo phản xạ nghĩa là thêm một dịch vụ mà từ giờ bạn phải chạy, giám sát và trả tiền. Có bốn lựa chọn thay thế, và mỗi cái đúng dưới một điều kiện bạn phát biểu được chính xác.</p>

<h3>Các lựa chọn, và điều kiện chọn ra từng cái</h3>
<pre><code class="language-text">Lựa chọn                  Đúng khi…                        Chi phí
───────────────────────  ──────────────────────────────  ──────────────────
Không adapter nào cả      Bạn thật sự chạy MỘT tiến      Bằng không. Cũng là
(in-memory, mặc định)     trình và sẽ giữ như vậy         mặc định, đó là lý
                                                          do nó nguy hiểm

@socket.io/cluster-       Mọi worker trên MỘT máy qua    Không thêm hạ tầng
adapter                   node:cluster                    KHÔNG đi xuyên máy

@socket.io/redis-adapter  Nhiều máy, và bạn vốn đã       Một Redis bạn chạy
                          chạy Redis                      và giám sát

@socket.io/postgres-      Nhiều máy, và bạn vốn đã có    Không dịch vụ mới
adapter                   Postgres nhưng KHÔNG có Redis   nếu Postgres đã có
                                                          Độ trễ cao hơn

@socket.io/mongo-adapter  Tương tự, nhưng MongoDB        Cùng đánh đổi
</code></pre>

<h3>Lựa chọn 1 — không adapter, một cách có chủ đích</h3>
<pre><code class="language-ts">// Đây là thứ bạn nhận được nếu không cấu hình gì:
const io = new Server(httpServer);
io.of('/').adapter.constructor.name;   // 'Adapter' — in-memory
</code></pre>

<pre><code class="language-text">Adapter in-memory là đúng khi có đúng một tiến trình, và đó là một
cấu hình có thật:

  - Một app nhỏ trên một VPS đơn với một tiến trình Node
  - Một công cụ nội bộ với vài chục, không phải vài nghìn, người dùng
  - Bất kỳ triển khai nào mà bạn đã quyết định một cách có ý thức rằng
    scale theo chiều dọc là đủ cho năm tới

Mối nguy không phải là nó chậm. Mà là nó là MẶC ĐỊNH, nên "chúng ta
chưa bao giờ chọn adapter" và "chúng ta đã chọn adapter in-memory"
sinh ra mã giống hệt nhau. Khoảnh khắc ai đó thêm một worker thứ hai —
một chỉ số instance của pm2, một replica Docker, một lần scale-up
Kubernetes — app vẫn khởi động, vẫn phục vụ, và âm thầm giao thông
điệp tới khoảng 1/N số người nhận đáng lẽ phải nhận.

Đó là lý do Bài 5.2 kết bằng một dòng log lúc khởi động. Nó tốn một
dòng và biến một cấu hình sai vô hình thành một cái nhìn thấy được.
</code></pre>

<h3>Lựa chọn 2 — cluster adapter, cho một máy</h3>
<pre><code class="language-ts">import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { setupMaster } from '@socket.io/sticky';

if (cluster.isPrimary) {
  const httpServer = http.createServer();
  setupMaster(httpServer, { loadBalancingMethod: 'least-connection' });
  setupPrimary();                       // định tuyến thông điệp adapter giữa worker
  httpServer.listen(3000);
  for (let i = 0; i &lt; os.cpus().length; i++) cluster.fork();
} else {
  const io = new Server(httpServer);
  io.adapter(createAdapter());          // IPC giữa worker, không Redis
}
</code></pre>

<pre><code class="language-text">Nó làm gì: định tuyến traffic adapter qua kênh IPC có sẵn của Node
giữa tiến trình chính và các worker của nó.

  ✅ Không dịch vụ ngoài. Không có gì để cài, giám sát, hay trả tiền.
  ✅ Độ trễ thấp hơn Redis — không nhảy qua mạng, không serialize sang
     một tiến trình riêng qua TCP.
  ✅ Đi cặp với @socket.io/sticky, thứ giải quyết vấn đề sticky của
     polling ở Chương 2 trong cùng một lần cấu hình.

  ❌ Chỉ MỘT máy. Tiến trình chính là bộ định tuyến, nên một server
     thứ hai không có cách nào tham gia.
  ❌ Tiến trình chính trở thành nút thắt cổ chai và một điểm hỏng đơn
     cho việc giao xuyên worker.

Đây là lựa chọn mà hầu hết triển khai nhỏ nên chọn và hầu hết đều bỏ
qua. Nếu bạn chạy bốn worker trên một VPS — thứ mô tả một số lượng
khổng lồ app Node — cái này cho bạn broadcast xuyên worker đúng đắn
mà không cần Redis nào cả.
</code></pre>

<h3>Lựa chọn 3 — Postgres, khi bạn vốn đã có nó</h3>
<pre><code class="language-ts">import { createAdapter } from '@socket.io/postgres-adapter';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
io.adapter(createAdapter(pool));
</code></pre>

<pre><code class="language-text">Nó dùng LISTEN/NOTIFY — pub/sub của chính Postgres — cộng một bảng cho
những tải trọng quá lớn với một thông điệp NOTIFY (giới hạn là 8000 byte).

  ✅ Không dịch vụ mới nếu Postgres vốn đã trong stack của bạn, mà với
     kho này thì đúng là vậy.
  ✅ Bớt một thứ phải sao lưu, bảo mật, và nâng cấp.

  ❌ Độ trễ cao hơn Redis. LISTEN/NOTIFY không phải thứ Postgres được
     tối ưu cho, và giờ mỗi lần broadcast đều tranh cùng những kết nối
     với tải truy vấn của bạn.
  ❌ Tải trọng lớn phải đi vòng qua một bảng, biến một lần broadcast
     thành một lần ghi.
  ❌ Áp lực lên connection pool: adapter giữ một kết nối riêng cho
     LISTEN, và dưới tải thì điều đó quan trọng.

Cách nói trung thực: đây là lựa chọn tốt khi traffic realtime của bạn
khiêm tốn và bạn coi trọng sự đơn giản vận hành hơn vài mili giây. Nó
là lựa chọn tệ cho một app nặng chat, vì bạn vừa đặt bus thông điệp
lên cùng cái máy với dữ liệu bền của mình.
</code></pre>

<h3>Quyết định, bằng ba câu hỏi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn có bao giờ chạy nhiều hơn một máy không?</span><span class="lz-d">Nếu thật sự không — và hãy trung thực, vì &quot;có thể sau này chúng ta sẽ scale&quot; không giống một kế hoạch — thì cluster adapter tốt hơn Redis một cách dứt khoát: ít thứ phải chạy hơn, độ trễ thấp hơn, và nó giải quyết luôn chuyện sticky trong cùng một lần cấu hình.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bạn vốn đã chạy Redis chưa?</span><span class="lz-d">Nếu rồi, hãy dùng nó. Redis adapter là lựa chọn được kiểm thử kỹ nhất, tài liệu tốt nhất, và thêm một mục đích dùng nữa cho một dịch vụ bạn vốn đã vận hành thì gần như không tốn gì. Kho này vốn đã chạy Redis cho cache và hàng đợi, nên câu trả lời ở đây là rồi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Traffic realtime có khiêm tốn và Postgres đã có sẵn không?</span><span class="lz-d">Vậy thì Postgres adapter là bảo vệ được, và nó là nước đi đúng cho một công cụ nội bộ nơi thêm một Redis là gánh nặng vận hành lớn hơn giá trị của vài mili giây. Hãy đo p99 trước khi cam kết — LISTEN/NOTIFY dưới một tải truy vấn bận không giống thứ các benchmark cho thấy.</span></div>
</div>

<h3>Đường chuyển đổi giữa chúng</h3>
<pre><code class="language-ts">// Adapter tráo được bằng một dòng, đó chính là điểm của lớp trừu tượng.
// Chuyển từ cluster-adapter sang redis-adapter khi máy thứ hai xuất hiện
// là một thay đổi cấu hình, không phải một lần viết lại:

const adapter = process.env.SOCKET_ADAPTER ?? 'memory';

if (adapter === 'redis') {
  const pub = createClient({ url: process.env.REDIS_URL });
  const sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  io.adapter(createRedisAdapter(pub, sub));
} else if (adapter === 'cluster') {
  io.adapter(createClusterAdapter());
}
// còn lại: in-memory, và log lúc khởi động sẽ nói ra điều đó

logger.info('[socket] adapter', { configured: adapter, actual: io.of('/').adapter.constructor.name });
</code></pre>

<p>Chú ý dòng log in ra cả adapter <em>định dùng</em> lẫn adapter <em>thực tế</em>. Hai cái đó bất đồng — vì một biến môi trường bị thiếu, hoặc một kết nối Redis hỏng mà có thứ gì đó nuốt mất lỗi — chính là cái cấu hình sai im lặng mà chương này cứ quay lại mãi.</p>

<div class="pitfall">
<p><strong>Bẫy — chọn Redis theo phản xạ cho một triển khai một máy.</strong> Nếu mọi worker của bạn nằm trên một máy dưới <code>node:cluster</code>, cluster adapter có độ trễ thấp hơn và không thêm dịch vụ nào phải vận hành. Redis trở nên đúng vào khoảnh khắc có máy thứ hai — không sớm hơn.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi Postgres adapter là bản thay thế thả-vào cho Redis ở mọi quy mô.</strong> LISTEN/NOTIFY chặn tải trọng ở 8000 byte và đổ những cái lớn hơn sang một bảng, còn adapter thì giữ một kết nối riêng. Trên một workload nặng chat, bạn vừa lặng lẽ đặt bus thông điệp vào thế tranh chấp với dữ liệu bền của mình. Hãy đo độ trễ broadcast p99 dưới tải truy vấn thật trước khi cam kết.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Có bốn adapter và mỗi cái được chọn bởi một điều kiện — in-memory khi bạn thật sự chạy một tiến trình (nguy hiểm chỉ vì nó là mặc định im lặng), <code>cluster-adapter</code> khi mọi worker nằm trên một máy dưới <code>node:cluster</code> (độ trễ thấp hơn Redis, không dịch vụ nào phải vận hành, và nó đi cặp với <code>@socket.io/sticky</code>), <code>redis-adapter</code> một khi có máy thứ hai hoặc bạn vốn đã chạy Redis, và <code>postgres-adapter</code> khi traffic realtime khiêm tốn và sự đơn giản vận hành thắng vài mili giây — và vì việc tráo chúng chỉ là một dòng, quyết định thật sự luôn chỉ là &quot;hôm nay điều gì đang đúng&quot;.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — danh sách adapter chính thức và giao diện chung.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/cluster-adapter</span><span class="lc-sub">github.com/socketio/socket.io-cluster-adapter — IPC giữa worker, dùng với setupPrimary.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/postgres-adapter</span><span class="lc-sub">github.com/socketio/socket.io-postgres-adapter — LISTEN/NOTIFY và giới hạn 8000 byte.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — NOTIFY</span><span class="lc-sub">postgresql.org/docs/current/sql-notify.html — trần payload và ngữ nghĩa hàng đợi.</span></span></div>
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
<p class="lead">Six questions on clustering — the point at which every local assumption about "the sockets" stops being true.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">One worker only knows its own sockets</span><span class="lz-d">Without an adapter, io.emit reaches the fraction of users connected to the worker that happens to be executing. Nothing errors. The Redis adapter publishes broadcasts so every worker delivers to its own share.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">The adapter adds four methods and changes four</span><span class="lz-d">fetchSockets, socketsJoin/Leave, serverSideEmit and disconnectSockets are cluster-wide. Their local counterparts — io.of("/").sockets above all — silently answer for one worker out of N.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Redis down is a partition, not an outage</span><span class="lz-d">Each worker keeps serving its own connected clients; only cross-worker delivery stops. That failure mode is quiet, which is why logging the adapter class name at boot is worth the one line.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã dựng được gì</h2>
<p class="lead">Sáu câu về clustering — thời điểm mà mọi giả định local về "các socket" thôi còn đúng.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Một worker chỉ biết socket của chính nó</span><span class="lz-d">Không có adapter, io.emit chỉ tới được phần user đang kết nối vào đúng worker tình cờ đang chạy. Không có lỗi nào. Redis adapter publish các lần broadcast để mọi worker giao cho phần của mình.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Adapter thêm bốn method và thay đổi bốn method</span><span class="lz-d">fetchSockets, socketsJoin/Leave, serverSideEmit và disconnectSockets là toàn cluster. Những bản local tương ứng — nhất là io.of("/").sockets — âm thầm trả lời thay cho một worker trên N.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Redis chết là một phân mảnh, không phải một cú sập</span><span class="lz-d">Mỗi worker vẫn phục vụ những client đang nối vào nó; chỉ việc giao xuyên worker là dừng. Kiểu hỏng đó rất im lặng, đó là lý do ghi log tên class adapter lúc khởi động đáng giá một dòng.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
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
