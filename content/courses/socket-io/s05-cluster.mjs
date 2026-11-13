import G05_1 from './giang/sio-05-1.mjs';
import G05_2 from './giang/sio-05-2.mjs';
import G05_3 from './giang/sio-05-3.mjs';
import G05_4 from './giang/sio-05-4.mjs';
import G05_5 from './giang/sio-05-5.mjs';
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
${G05_1}
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
<pre><code class="language-ts">// messaging.socket.ts:263-276 (13/11/2026)
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
<p><strong>BEST-EFFORT — if Redis dies, socket.io STILL runs as a single instance.</strong> The fallback does not throw. It only logs a warning. The reason: this repo is single-instance today and the adapter is preparation for a future cluster. If Redis pauses during a DB restart, the sockets should not have to die with it. <strong>Measured — the warning only fires if <code>connect()</code> throws, and here it never does:</strong> <code>getRedis()</code> uses node-redis 4 with a <code>reconnectStrategy</code>, so with Redis down at boot it retries forever. A copy of this code waited 10 s, swallowed 21 connection errors and printed <strong>0</strong> warnings; the adapter stayed the in-memory <code>Adapter</code>. And <code>attachRedisAdapter(io)</code> is called with <code>void</code> — nobody awaits it.</p>
</div>

<h3>The overhead of pub/sub</h3>
<p><strong>Measured (13/11/2026, Redis 7 in Docker on the course machine, 2,000 sends on one clock):</strong> same-worker socket p50 0.072 ms / p99 0.242 ms; socket on another worker via Redis p50 0.552 ms / p99 1.540 ms — about <strong>+0.48 ms</strong>. The &quot;~100-400μs&quot; and &quot;4 * 50ms&quot; figures above are estimates, not measurements; measure your own network.</p>
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
<p><strong>Measured with <code>redis-cli MONITOR</code>:</strong> the real channel has a trailing <code>#</code> — <code>socket.io#/#thread:42#</code>. The room appears in the channel name only when the emit targets <strong>exactly one</strong> room; <code>io.emit</code> and <code>io.to([&#39;a&#39;,&#39;b&#39;])</code> both publish to <code>socket.io#/#</code>, and <code>except</code> travels inside the payload. Every worker <code>psubscribe</code>s <code>socket.io#/#*</code>, so <strong>every worker receives every broadcast</strong> — workers without the room drop it by channel name without decoding (0.4 ms per 1,000 messages measured). One measured message: msgpack 90 bytes vs the same content as JSON 125 bytes.</p>
<p><strong>The Redis adapter uses msgpack, not JSON.</strong> So looking at it through <code>redis-cli</code> shows binary — not directly readable. Use the adapter&#39;s debug tools, or parse the msgpack yourself.</p>
</div>

<div class="pitfall">
<p><strong>Trap — thinking the adapter shares all state through Redis by itself.</strong> NO. The adapter shares only BROADCASTS (outgoing packets). Room membership stays LOCAL to each worker. <code>io.sockets.adapter.rooms.get(&#39;X&#39;)</code> on worker A holds only A's sockets. To answer &quot;who is in room X&quot; across the whole cluster you must use <code>await io.in(&#39;X&#39;).fetchSockets()</code> — it uses Redis to aggregate.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Without the Redis adapter, a cluster-mode broadcast reaches only 1/N of your users (worker-local); with it, every <code>io.to(room).emit</code> goes through Redis pub/sub, adding ~100-400μs of latency but reaching everyone; this repo attaches it best-effort — if Redis is down it falls back to the in-memory single-instance adapter.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run two workers WITHOUT the Redis adapter, join a room from a socket on worker A, and emit from worker B — confirm only ~1/N of users receive it.</li>
<li>Attach <code>@socket.io/redis-adapter</code> and repeat; confirm every worker's sockets now receive the broadcast.</li>
<li>Measure the added latency (pub/sub round trip, ~100-400μs) and then stop Redis to see the best-effort fallback to the in-memory adapter.</li>
</ol>
<p><strong>Done when:</strong> a cross-worker broadcast reaches everyone with the adapter, and you have seen the fallback when Redis is down.</p></div>

<h3>🔬 Measured: four workers, eight users</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · redis 4.7.1 · Redis 7 — four real processes (fork), eight users in <code>thread:42</code> round-robin, worker 2 emits:</p>
<div class="out">$ node bon.mjs
— KHÔNG adapter (mặc định) · worker 2 gọi io.to('thread:42').emit —
  adapter = Adapter · rooms.get('thread:42').size = 2 · fetchSockets() = 2
  An(w1) ✗  Bình(w2) ✓  Chi(w3) ✗  Dũng(w4) ✗  Hà(w1) ✗  Khoa(w2) ✓  Lan(w3) ✗  Minh(w4) ✗
  ⇒ 2/8 người nhận
— CÓ Redis adapter · worker 2 gọi io.to('thread:42').emit —
  adapter = RedisAdapter · rooms.get('thread:42').size = 2 · fetchSockets() = 8
  An(w1) ✓  Bình(w2) ✓  Chi(w3) ✓  Dũng(w4) ✓  Hà(w1) ✓  Khoa(w2) ✓  Lan(w3) ✓  Minh(w4) ✓
  ⇒ 8/8 người nhận</div>
<p><strong>In Chromium</strong> — one page, An&#39;s frame on worker 1, Binh&#39;s on worker 2 (event frames only). No adapter, then Redis adapter:</p>
<div class="out">An    ↑ 42["gui","Chào cả phòng 42!"]   (751 ms)
An    ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (752 ms)</div>
<div class="out">An    ↑ 42["gui","Chào cả phòng 42!"]   (734 ms)
An    ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (736 ms)
Bình  ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (739 ms)</div>
<p><strong>On Redis</strong> — <code>redis-cli MONITOR</code> while two workers start and emit four ways:</p>
<div class="out">$ node kenh.mjs
PUBSUB NUMSUB socket.io-request#/# = 2 (số worker đang nghe)
PUBSUB NUMPAT = 1 (mẫu socket.io#/#* — hai worker cùng một mẫu)
một lần phát: msgpack 90 byte · cùng nội dung bằng JSON 125 byte
$ redis-cli MONITOR | grep -iE 'subscribe|publish'
"psubscribe" "socket.io#/#*"
"subscribe" "socket.io-request#/#" "socket.io-response#/#" "socket.io-response#/#i4E2ss#"
"psubscribe" "socket.io#/#*"
"subscribe" "socket.io-request#/#" "socket.io-response#/#" "socket.io-response#/#qedTJX#"
"PUBLISH" "socket.io#/#thread:42#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa3tin\\x82\\xa2id\\x01\\xa4text\\xafch\\xc3\\
"PUBLISH" "socket.io#/#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa8he-thong\\xb3b\\xe1\\xba\\xa3o tr\\xc3\\xac l\\xc3\\xb
"PUBLISH" "socket.io#/#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa3tin\\x81\\xa2id\\x02\\xa3nsp\\xa1/\\x83\\xa5rooms\\x92
"PUBLISH" "socket.io#/#user:7#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa8presence\\x81\\xa6online\\xc3\\xa3nsp\\xa1/\\</div>
<p><strong>Every worker hears every broadcast</strong> — the room lives on worker 1 only, 1,000 emits:</p>
<div class="out">$ node moi.mjs
worker 1: socket trong thread:42 = 1 · nhận từ Redis 1.000 tin · thời gian trong onmessage   4,1 ms
worker 2: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,5 ms
worker 3: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,4 ms
worker 4: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,4 ms
client ở worker 1 nhận 1.000 tin</div>
<p><strong>Latency</strong>:</p>
<div class="out">$ node tre.mjs
A (cùng worker 1, đường local) · p50 0,072 ms · p99 0,242 ms
B (worker 2, qua Redis)        · p50 0,552 ms · p99 1,540 ms
⇒ Redis thêm ≈ 0,480 ms ở p50 (Redis 7 trong Docker trên chính máy này)</div>
<p><strong>This repo&#39;s fallback, with Redis down at boot</strong> (a copy of <code>getRedis</code> + <code>attachRedisAdapter</code>):</p>
<div class="out">$ node chet.mjs
1,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 7 · dòng WARN: 0
5,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 15 · dòng WARN: 0
10,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 21 · dòng WARN: 0</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "async function attachRedisAdapter" -A14 src/socket/messaging.socket.ts
263:async function attachRedisAdapter(server: IOServer): Promise&lt;void&gt; {
264-  try {
265-    const base = await getRedis();
266-    const pubClient = base.duplicate();
267-    const subClient = base.duplicate();
268-    await Promise.all([pubClient.connect(), subClient.connect()]);
269-    server.adapter(createAdapter(pubClient, subClient));
270-    logger.info('Socket.IO Redis adapter attached (cross-worker broadcasts enabled)');
271-  } catch (err) {
272-    logger.warn('Socket.IO Redis adapter NOT attached — in-memory only (single instance)', {
273-      error: err instanceof Error ? err.message : String(err),
274-    });
275-  }
276-}
277-
$ grep -n "void attachRedisAdapter\\|reconnectStrategy" src/socket/messaging.socket.ts src/config/redis.ts
src/socket/messaging.socket.ts:330: void attachRedisAdapter(io);
src/config/redis.ts:31: reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000),
$ grep -n "container_name: cuonghoangdev_backend" docker-compose.yml ; grep -c "replicas" docker-compose.yml
114: container_name: cuonghoangdev_backend
0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// BỐN worker = bốn TIẾN TRÌNH Node (fork), mỗi cái một cổng, như 4 container sau proxy. 8 người vào phòng thread:42, chia vòng tròn 2 người/worker.</span>
<span class="tok-comment">// Worker 2 gọi io.to('thread:42').emit(...). Lần 1: adapter mặc định (in-memory). Lần 2: @socket.io/redis-adapter qua Redis sio-redis.</span>
import { fork } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const [, , vai, so, che] = process.argv;
if (vai === 'worker') {
  const opts = {};
  if (che === 'redis') {
    const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    opts.adapter = createAdapter(pub, sub);
  }
  const io = new Server(19700 + +so, opts);
  io.on('connection', (s) =&gt; s.join('thread:42'));
  process.on('message', async () =&gt; {
    io.to('thread:42').emit('tin', &#96;worker \${so} gửi&#96;);
    process.send({ adapter: io.of('/').adapter.constructor.name, local: io.of('/').adapter.rooms.get('thread:42')?.size ?? 0,
      toan: (await io.in('thread:42').fetchSockets()).length });
  });
  process.send('san-sang');
} else {
  const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
  const TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh'];
  for (const che of ['memory', 'redis']) {
    const ws = [1, 2, 3, 4].map((so) =&gt; fork(new URL(import.meta.url).pathname, ['worker', so, che]));
    await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
    const nhan = new Set();
    const cs = TEN.map((t, i) =&gt; { const w = (i % 4) + 1;
      const c = ketNoi(&#96;http://localhost:\${19700 + w}&#96;, { transports: ['websocket'], forceNew: true });
      c.on('tin', () =&gt; nhan.add(t)); return { t, w, c }; });
    await Promise.all(cs.map(({ c }) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
    ws[1].send('phat'); const kq = await new Promise((ok) =&gt; ws[1].once('message', ok)); await cho(400);
    console.log(&#96;— \${che === 'memory' ? 'KHÔNG adapter (mặc định)' : 'CÓ Redis adapter'} · worker 2 gọi io.to('thread:42').emit —&#96;);
    console.log(&#96;  adapter = \${kq.adapter} · rooms.get('thread:42').size = \${kq.local} · fetchSockets() = \${kq.toan}&#96;);
    console.log('  ' + cs.map(({ t, w }) =&gt; &#96;\${t}(w\${w}) \${nhan.has(t) ? '✓' : '✗'}&#96;).join('  '));
    console.log(&#96;  ⇒ \${nhan.size}/\${TEN.length} người nhận&#96;);
    cs.forEach(({ c }) =&gt; c.close()); ws.forEach((w) =&gt; w.kill()); await cho(300);
  }
  process.exit(0);
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Chép đúng cách kho gắn adapter: getRedis() (node-redis 4, reconnectStrategy) rồi attachRedisAdapter() có try/catch + logger.warn.</span>
<span class="tok-comment">// Lần này Redis KHÔNG chạy (cổng 19699 không ai nghe), như lúc backend khởi động mà container Redis chưa lên.</span>
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const t0 = performance.now(); const s = () =&gt; ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s';
let loi = 0;
async function getRedis() {
  const client = createClient({ socket: { port: 19699, reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000) } });
  client.on('error', () =&gt; loi++);
  await client.connect(); return client;
}
async function attachRedisAdapter(server) {
  try {
    const base = await getRedis(); const pub = base.duplicate(), sub = base.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    server.adapter(createAdapter(pub, sub)); console.log(&#96;\${s()}  INFO Socket.IO Redis adapter attached&#96;);
  } catch (err) { console.log(&#96;\${s()}  WARN Redis adapter NOT attached — in-memory only: \${err.message}&#96;); }
}
const io = new Server(19713);
void attachRedisAdapter(io);
for (const giay of [1, 5, 10]) {
  await new Promise((ok) =&gt; setTimeout(ok, giay * 1000 - (performance.now() - t0)));
  console.log(&#96;\${s()}  adapter = \${io.of('/').adapter.constructor.name} · lỗi kết nối đã nuốt: \${loi} · dòng WARN: 0&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and its price</span><span class="lc-sub">The delivery guarantee the adapter inherits</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — More than one process: adapter, sticky session, backpressure</span><span class="lc-sub">Two processes with the adapter, and the shared-connection trap</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cluster mode</span><span class="v">N Node workers sharing one port behind the proxy.</span></div>
  <div class="kv"><span class="k">Worker-local broadcast</span><span class="v">Default <code>io.emit</code> reaches only the sockets on the current worker (1/N).</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Carries broadcasts between workers over Redis pub/sub.</span></div>
  <div class="kv"><span class="k">pub/sub</span><span class="v">Redis publish/subscribe — the channel the adapter uses.</span></div>
  <div class="kv"><span class="k">Adapter latency</span><span class="v">~100-400μs added per cross-worker broadcast.</span></div>
  <div class="kv"><span class="k">Best-effort fallback</span><span class="v">If Redis is down, drop to the in-memory single-instance adapter.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Without the Redis adapter, a cluster broadcast reaches only 1/N of your users (worker-local).</li><li>With it, every <code>io.to(room).emit</code> goes through Redis pub/sub and reaches everyone.</li><li>The cost is ~100-400μs of added latency per broadcast.</li><li>This repo attaches it best-effort.</li><li>If Redis is down it falls back to the in-memory single-instance adapter.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter — API, protocol, và caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — PUBSUB</span><span class="lc-sub">redis.io/docs/manual/pubsub — fire-and-forget, không persist — nếu subscriber down, message MẤT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn${REF} — cả hai đều cần cho cluster.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.4: the bug that produces no error, reproduced</span><span class="lc-sub">The Node.js course runs two Socket.IO processes: without the adapter, process B emits in 0.34 ms to an empty room and the client on A gets nothing; with @socket.io/redis-adapter it arrives in 2.23 ms and fetchSockets() on B sees the socket on A. It also shows one shared Redis connection failing for pub + sub (ioredis and node-redis 4 both refuse GET after SUBSCRIBE).</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
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
<pre><code class="language-ts">// messaging.socket.ts:263-276 (13/11/2026)
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
<p><strong>BEST-EFFORT — nếu Redis chết, socket.io VẪN chạy đơn máy.</strong> Fallback không throw. Chỉ log warning. Lý do: kho này hiện single instance, adapter là chuẩn bị cho future cluster. Nếu Redis pause trong DB restart, socket không phải cùng chết. <strong>Đo thật — warning chỉ in khi <code>connect()</code> ném lỗi, mà ở đây nó không bao giờ ném:</strong> <code>getRedis()</code> dùng node-redis 4 có <code>reconnectStrategy</code>, nên Redis tắt lúc khởi động thì nó thử lại mãi. Bản chép đoạn mã này chờ 10 s, nuốt 21 lỗi nối, in <strong>0</strong> dòng warning; adapter vẫn là <code>Adapter</code> trong bộ nhớ. Và <code>attachRedisAdapter(io)</code> được gọi với <code>void</code> — không ai chờ nó.</p>
</div>

<h3>Overhead của pub/sub</h3>
<p><strong>Đo thật (13/11/2026, Redis 7 trong Docker trên máy của khoá, 2.000 lần phát, một đồng hồ):</strong> socket cùng worker p50 0,072 ms / p99 0,242 ms; socket ở worker khác qua Redis p50 0,552 ms / p99 1,540 ms — thêm khoảng <strong>0,48 ms</strong>. Các con số &quot;~100-400μs&quot; và &quot;4 * 50ms&quot; ở trên là ước lượng, không phải số đo; hãy đo mạng của bạn.</p>
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
<p><strong>Đo bằng <code>redis-cli MONITOR</code>:</strong> kênh thật có dấu <code>#</code> ở cuối — <code>socket.io#/#thread:42#</code>. Tên room chỉ nằm trong tên kênh khi phát vào <strong>đúng một</strong> room; <code>io.emit</code> và <code>io.to([&#39;a&#39;,&#39;b&#39;])</code> đều PUBLISH vào <code>socket.io#/#</code>, còn <code>except</code> nằm trong payload. Mọi worker <code>psubscribe</code> mẫu <code>socket.io#/#*</code>, nên <strong>worker nào cũng nhận mọi broadcast</strong> — worker không có room thì bỏ qua theo tên kênh mà không giải mã (đo: 0,4 ms cho 1.000 tin). Một tin đo được: msgpack 90 byte, cùng nội dung bằng JSON 125 byte.</p>
<p><strong>Redis adapter dùng msgpack, không JSON.</strong> Nên xem qua <code>redis-cli</code> thấy binary — không đọc trực tiếp. Dùng adapter&#39;s debug tools hoặc parse msgpack.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — nghĩ adapter tự share tất cả state qua Redis.</strong> KHÔNG. Adapter chỉ share BROADCASTS (packet đi ra). Rooms membership vẫn LOCAL trong mỗi worker. <code>io.sockets.adapter.rooms.get(&#39;X&#39;)</code> ở worker A chỉ có sockets của A. Cho công việc &quot;ai đang ở room X&quot; toàn cluster, phải dùng <code>await io.in(&#39;X&#39;).fetchSockets()</code> — nó dùng Redis để aggregate.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Không có Redis adapter, cluster mode broadcast chỉ đến 1/N user (worker-local); với adapter, mỗi <code>io.to(room).emit</code> qua Redis pub/sub thêm ~100-400μs latency nhưng đến đầy đủ; kho này attach best-effort — Redis down thì fallback in-memory single-instance.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy hai worker KHÔNG có Redis adapter, join một room từ một socket ở worker A, và emit từ worker B — xác nhận chỉ ~1/N user nhận.</li>
<li>Gắn <code>@socket.io/redis-adapter</code> và lặp lại; xác nhận socket của mọi worker giờ đều nhận broadcast.</li>
<li>Đo latency thêm vào (khứ hồi pub/sub, ~100-400μs) rồi dừng Redis để thấy best-effort fallback về in-memory adapter.</li>
</ol>
<p><strong>Đạt khi:</strong> một broadcast qua worker tới mọi người khi có adapter, và bạn đã thấy fallback khi Redis chết.</p></div>

<h3>🔬 Đo thật: bốn worker, tám người</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · redis 4.7.1 · Redis 7 — bốn tiến trình thật (fork), tám người vào <code>thread:42</code> chia vòng tròn, worker 2 phát:</p>
<div class="out">$ node bon.mjs
— KHÔNG adapter (mặc định) · worker 2 gọi io.to('thread:42').emit —
  adapter = Adapter · rooms.get('thread:42').size = 2 · fetchSockets() = 2
  An(w1) ✗  Bình(w2) ✓  Chi(w3) ✗  Dũng(w4) ✗  Hà(w1) ✗  Khoa(w2) ✓  Lan(w3) ✗  Minh(w4) ✗
  ⇒ 2/8 người nhận
— CÓ Redis adapter · worker 2 gọi io.to('thread:42').emit —
  adapter = RedisAdapter · rooms.get('thread:42').size = 2 · fetchSockets() = 8
  An(w1) ✓  Bình(w2) ✓  Chi(w3) ✓  Dũng(w4) ✓  Hà(w1) ✓  Khoa(w2) ✓  Lan(w3) ✓  Minh(w4) ✓
  ⇒ 8/8 người nhận</div>
<p><strong>Trong Chromium</strong> — một trang, khung của An nối worker 1, khung của Bình nối worker 2 (chỉ khung sự kiện). Không adapter, rồi có Redis adapter:</p>
<div class="out">An    ↑ 42["gui","Chào cả phòng 42!"]   (751 ms)
An    ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (752 ms)</div>
<div class="out">An    ↑ 42["gui","Chào cả phòng 42!"]   (734 ms)
An    ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (736 ms)
Bình  ↓ 42["tin",{"tu":"An","text":"Chào cả phòng 42!","worker":1}]   (739 ms)</div>
<p><strong>Trên Redis</strong> — <code>redis-cli MONITOR</code> trong lúc hai worker khởi động và phát bốn kiểu:</p>
<div class="out">$ node kenh.mjs
PUBSUB NUMSUB socket.io-request#/# = 2 (số worker đang nghe)
PUBSUB NUMPAT = 1 (mẫu socket.io#/#* — hai worker cùng một mẫu)
một lần phát: msgpack 90 byte · cùng nội dung bằng JSON 125 byte
$ redis-cli MONITOR | grep -iE 'subscribe|publish'
"psubscribe" "socket.io#/#*"
"subscribe" "socket.io-request#/#" "socket.io-response#/#" "socket.io-response#/#i4E2ss#"
"psubscribe" "socket.io#/#*"
"subscribe" "socket.io-request#/#" "socket.io-response#/#" "socket.io-response#/#qedTJX#"
"PUBLISH" "socket.io#/#thread:42#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa3tin\\x82\\xa2id\\x01\\xa4text\\xafch\\xc3\\
"PUBLISH" "socket.io#/#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa8he-thong\\xb3b\\xe1\\xba\\xa3o tr\\xc3\\xac l\\xc3\\xb
"PUBLISH" "socket.io#/#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa3tin\\x81\\xa2id\\x02\\xa3nsp\\xa1/\\x83\\xa5rooms\\x92
"PUBLISH" "socket.io#/#user:7#" "\\x93\\xa6i4E2ss\\x83\\xa4type\\x02\\xa4data\\x92\\xa8presence\\x81\\xa6online\\xc3\\xa3nsp\\xa1/\\</div>
<p><strong>Worker nào cũng nghe mọi broadcast</strong> — room chỉ ở worker 1, phát 1.000 lần:</p>
<div class="out">$ node moi.mjs
worker 1: socket trong thread:42 = 1 · nhận từ Redis 1.000 tin · thời gian trong onmessage   4,1 ms
worker 2: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,5 ms
worker 3: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,4 ms
worker 4: socket trong thread:42 = 0 · nhận từ Redis 1.000 tin · thời gian trong onmessage   0,4 ms
client ở worker 1 nhận 1.000 tin</div>
<p><strong>Độ trễ</strong>:</p>
<div class="out">$ node tre.mjs
A (cùng worker 1, đường local) · p50 0,072 ms · p99 0,242 ms
B (worker 2, qua Redis)        · p50 0,552 ms · p99 1,540 ms
⇒ Redis thêm ≈ 0,480 ms ở p50 (Redis 7 trong Docker trên chính máy này)</div>
<p><strong>Đường lùi của kho khi Redis tắt lúc khởi động</strong> (chép <code>getRedis</code> + <code>attachRedisAdapter</code>):</p>
<div class="out">$ node chet.mjs
1,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 7 · dòng WARN: 0
5,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 15 · dòng WARN: 0
10,0 s  adapter = Adapter · lỗi kết nối đã nuốt: 21 · dòng WARN: 0</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "async function attachRedisAdapter" -A14 src/socket/messaging.socket.ts
263:async function attachRedisAdapter(server: IOServer): Promise&lt;void&gt; {
264-  try {
265-    const base = await getRedis();
266-    const pubClient = base.duplicate();
267-    const subClient = base.duplicate();
268-    await Promise.all([pubClient.connect(), subClient.connect()]);
269-    server.adapter(createAdapter(pubClient, subClient));
270-    logger.info('Socket.IO Redis adapter attached (cross-worker broadcasts enabled)');
271-  } catch (err) {
272-    logger.warn('Socket.IO Redis adapter NOT attached — in-memory only (single instance)', {
273-      error: err instanceof Error ? err.message : String(err),
274-    });
275-  }
276-}
277-
$ grep -n "void attachRedisAdapter\\|reconnectStrategy" src/socket/messaging.socket.ts src/config/redis.ts
src/socket/messaging.socket.ts:330: void attachRedisAdapter(io);
src/config/redis.ts:31: reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000),
$ grep -n "container_name: cuonghoangdev_backend" docker-compose.yml ; grep -c "replicas" docker-compose.yml
114: container_name: cuonghoangdev_backend
0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// BỐN worker = bốn TIẾN TRÌNH Node (fork), mỗi cái một cổng, như 4 container sau proxy. 8 người vào phòng thread:42, chia vòng tròn 2 người/worker.</span>
<span class="tok-comment">// Worker 2 gọi io.to('thread:42').emit(...). Lần 1: adapter mặc định (in-memory). Lần 2: @socket.io/redis-adapter qua Redis sio-redis.</span>
import { fork } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const [, , vai, so, che] = process.argv;
if (vai === 'worker') {
  const opts = {};
  if (che === 'redis') {
    const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    opts.adapter = createAdapter(pub, sub);
  }
  const io = new Server(19700 + +so, opts);
  io.on('connection', (s) =&gt; s.join('thread:42'));
  process.on('message', async () =&gt; {
    io.to('thread:42').emit('tin', &#96;worker \${so} gửi&#96;);
    process.send({ adapter: io.of('/').adapter.constructor.name, local: io.of('/').adapter.rooms.get('thread:42')?.size ?? 0,
      toan: (await io.in('thread:42').fetchSockets()).length });
  });
  process.send('san-sang');
} else {
  const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
  const TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh'];
  for (const che of ['memory', 'redis']) {
    const ws = [1, 2, 3, 4].map((so) =&gt; fork(new URL(import.meta.url).pathname, ['worker', so, che]));
    await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
    const nhan = new Set();
    const cs = TEN.map((t, i) =&gt; { const w = (i % 4) + 1;
      const c = ketNoi(&#96;http://localhost:\${19700 + w}&#96;, { transports: ['websocket'], forceNew: true });
      c.on('tin', () =&gt; nhan.add(t)); return { t, w, c }; });
    await Promise.all(cs.map(({ c }) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
    ws[1].send('phat'); const kq = await new Promise((ok) =&gt; ws[1].once('message', ok)); await cho(400);
    console.log(&#96;— \${che === 'memory' ? 'KHÔNG adapter (mặc định)' : 'CÓ Redis adapter'} · worker 2 gọi io.to('thread:42').emit —&#96;);
    console.log(&#96;  adapter = \${kq.adapter} · rooms.get('thread:42').size = \${kq.local} · fetchSockets() = \${kq.toan}&#96;);
    console.log('  ' + cs.map(({ t, w }) =&gt; &#96;\${t}(w\${w}) \${nhan.has(t) ? '✓' : '✗'}&#96;).join('  '));
    console.log(&#96;  ⇒ \${nhan.size}/\${TEN.length} người nhận&#96;);
    cs.forEach(({ c }) =&gt; c.close()); ws.forEach((w) =&gt; w.kill()); await cho(300);
  }
  process.exit(0);
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Chép đúng cách kho gắn adapter: getRedis() (node-redis 4, reconnectStrategy) rồi attachRedisAdapter() có try/catch + logger.warn.</span>
<span class="tok-comment">// Lần này Redis KHÔNG chạy (cổng 19699 không ai nghe), như lúc backend khởi động mà container Redis chưa lên.</span>
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const t0 = performance.now(); const s = () =&gt; ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s';
let loi = 0;
async function getRedis() {
  const client = createClient({ socket: { port: 19699, reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000) } });
  client.on('error', () =&gt; loi++);
  await client.connect(); return client;
}
async function attachRedisAdapter(server) {
  try {
    const base = await getRedis(); const pub = base.duplicate(), sub = base.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    server.adapter(createAdapter(pub, sub)); console.log(&#96;\${s()}  INFO Socket.IO Redis adapter attached&#96;);
  } catch (err) { console.log(&#96;\${s()}  WARN Redis adapter NOT attached — in-memory only: \${err.message}&#96;); }
}
const io = new Server(19713);
void attachRedisAdapter(io);
for (const giay of [1, 5, 10]) {
  await new Promise((ok) =&gt; setTimeout(ok, giay * 1000 - (performance.now() - t0)));
  console.log(&#96;\${s()}  adapter = \${io.of('/').adapter.constructor.name} · lỗi kết nối đã nuốt: \${loi} · dòng WARN: 0&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Mức bảo đảm mà adapter thừa hưởng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược</span><span class="lc-sub">Hai tiến trình với adapter, và bẫy dùng chung kết nối</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cluster mode</span><span class="v">N worker Node chia sẻ một port sau proxy.</span></div>
  <div class="kv"><span class="k">Broadcast worker-local</span><span class="v"><code>io.emit</code> mặc định chỉ tới socket trên worker hiện tại (1/N).</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Chở broadcast giữa các worker qua Redis pub/sub.</span></div>
  <div class="kv"><span class="k">pub/sub</span><span class="v">Publish/subscribe của Redis — kênh adapter dùng.</span></div>
  <div class="kv"><span class="k">Latency adapter</span><span class="v">~100-400μs thêm vào mỗi broadcast qua worker.</span></div>
  <div class="kv"><span class="k">Best-effort fallback</span><span class="v">Nếu Redis chết, lùi về in-memory single-instance adapter.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Không có Redis adapter, một cluster broadcast chỉ tới 1/N user (worker-local).</li><li>Với nó, mỗi <code>io.to(room).emit</code> đi qua Redis pub/sub và tới mọi người.</li><li>Cái giá là ~100-400μs latency thêm mỗi broadcast.</li><li>Kho này gắn nó best-effort.</li><li>Nếu Redis chết nó lùi về in-memory single-instance adapter.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@socket.io/redis-adapter</span><span class="lc-sub">github.com/socketio/socket.io-redis-adapter — API, protocol, và caveats.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — PUBSUB</span><span class="lc-sub">redis.io/docs/manual/pubsub — fire-and-forget, không persist — nếu subscriber down, message MẤT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn${REF} — cả hai đều cần cho cluster.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.4: con bug không sinh ra lỗi, dựng lại</span><span class="lc-sub">Khoá Node.js chạy hai tiến trình Socket.IO: không có adapter, tiến trình B phát trong 0,34 ms vào một room rỗng và client ở A không nhận gì; có @socket.io/redis-adapter thì tin tới sau 2,23 ms và fetchSockets() trên B thấy socket nằm ở A. Bài đó còn cho thấy một kết nối Redis dùng chung cho pub + sub hỏng thế nào (ioredis lẫn node-redis 4 đều từ chối GET sau SUBSCRIBE).</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
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
${G05_2}
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
// ⚠ MEASURED: socketsJoin returns undefined — the await waits for nothing; right after it even the
//   local socket was not in 'vip' yet (the Redis adapter applies it when the request comes back): 0, then 3/3 after 50 ms
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
    // ⚠ MEASURED (13/11/2026): wrong — on timeout responses HOLDS the answers that arrived
    //   (err "timeout reached: only 1 responses received out of 2", responses = [{…worker 2}])
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
     ⚠ MEASURED: there IS a partial result — the callback gets (err, responses-so-far);
     serverSideEmitWithAck rejects and puts them on err.responses.

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
// ⚠ MEASURED: the client gets "io server disconnect", socket.active = false and makes 0 reconnect
//   attempts — a server-side disconnect is final; your app must call socket.connect() itself.
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
<p><strong>Trap — treating <code>serverSideEmit</code>'s callback as partial-results.</strong> If any worker misses the timeout you get an error and no responses at all, not the subset that answered. A monitoring endpoint written assuming partial results will show &quot;0 users online&quot; during a slow moment rather than a slightly stale number. <strong>Measured (13/11/2026) — the premise is wrong for @socket.io/redis-adapter 8.3.0:</strong> with one of three workers 6 s late, the callback fired at 5,001.9 ms with <code>err</code> AND <code>responses</code> holding the one answer that arrived; <code>serverSideEmitWithAck</code> rejected with the same partial array on <code>err.responses</code>. The real trap is the opposite: treating that partial array as the total.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The adapter adds four cluster-wide methods — <code>fetchSockets</code> (aggregate, returns command-only <code>RemoteSocket</code>s because listeners cannot be serialized across processes), <code>socketsJoin</code>/<code>socketsLeave</code> (change room membership for sockets you do not hold), <code>serverSideEmit</code> (all-or-nothing RPC to the <em>other</em> workers), and <code>disconnectSockets</code> (the half of &quot;log out everywhere&quot; that token revocation cannot do) — and the danger is not these methods but their local counterparts, which in a cluster answer for one worker out of N without ever raising an error.</p>
</div>

<h3>Which adapter methods tell the truth across workers</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">io.sockets</span><span class="lz-t">Local only — lies in a cluster</span><span class="lz-d">It is the map of sockets on <em>this</em> worker. In a four-worker cluster it sees a quarter of your users and reports it as the total.</span></div>
  <div class="lz-node"><span class="lz-k">await io.fetchSockets()</span><span class="lz-t">Cluster-wide — the one to reach for</span><span class="lz-d">Asks every worker through the adapter and returns remote socket handles. Slower, and correct.</span></div>
  <div class="lz-node"><span class="lz-k">socketsJoin / socketsLeave</span><span class="lz-t">Cluster-wide room changes</span><span class="lz-d">Moves sockets into or out of a room no matter which worker holds them. The local equivalent silently does nothing for three quarters of them.</span></div>
  <div class="lz-node"><span class="lz-k">disconnectSockets</span><span class="lz-t">Cluster-wide disconnect</span><span class="lz-d">Same reason: a ban implemented with the local map bans the user on one worker and leaves them connected on the others.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a presence count read from the local socket map.</strong> <code>io.sockets.size</code> returns the sockets on the worker that happened to handle the request, so in a four-worker cluster it reports roughly a quarter of the real number — and it varies per request, because the load balancer picks a different worker each time. The bug reads as &quot;the online count is wrong and keeps changing&quot;, which sounds like a race condition rather than a topology problem. It is also invisible in development, where there is one worker and the number is exactly right. Anything that must see every user goes through the adapter: <code>fetchSockets</code>, or a count kept in Redis.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Call <code>await io.fetchSockets()</code> in a cluster and compare its count to <code>io.sockets.size</code> — the local map reports only one worker's share.</li>
<li>Use <code>socketsJoin</code>/<code>socketsLeave</code> to move a socket held by ANOTHER worker into a room, and confirm the local equivalent silently fails for it.</li>
<li>Use <code>disconnectSockets</code> to implement &quot;log out everywhere&quot; and note that token revocation alone cannot drop the live connections.</li>
</ol>
<p><strong>Done when:</strong> you can show a local-map count lying in a cluster and fix it with a cluster-wide adapter method.</p></div>

<h3>🔬 Measured: the four methods on a real cluster</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · Redis 7 — three worker processes (fork). The helper that builds the cluster and runs code <em>inside</em> one worker:</p>
<pre><code class="language-javascript"><span class="tok-comment">// Dựng một CỤM thật: N worker = N tiến trình Node (fork), Redis adapter qua sio-redis, cổng 19721…; client nối worker nào tuỳ ý.</span>
<span class="tok-comment">// Mỗi worker: middleware đặt socket.data.userId, vào phòng user:&lt;id&gt;; nghe sự kiện server-side 'get-stats' (trả lời sau &#96;cham&#96; ms).</span>
<span class="tok-comment">// goi(k, 'mã JS') chạy một đoạn mã TRONG worker k (biến io có sẵn) và trả kết quả về — để bài đo đứng ở đúng một worker.</span>
import { fork } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
if (process.argv[2] === 'worker') {
  const so = +process.argv[3], cham = +process.argv[4];
  const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(19720 + so, { adapter: createAdapter(pub, sub) });
  io.use((s, next) =&gt; { s.data.userId = s.handshake.auth.userId; s.data.worker = so; next(); });
  io.on('connection', (s) =&gt; s.join(&#96;user:\${s.data.userId}&#96;));
  io.on('get-stats', (cb) =&gt; setTimeout(() =&gt; cb({ worker: so, count: io.of('/').sockets.size }), cham));
  const AsyncFn = (async () =&gt; {}).constructor;
  process.on('message', async ({ id, ma }) =&gt; process.send({ id, kq: await new AsyncFn('io', ma)(io) }));
  process.send('san-sang');
}
export async function moCum(n, cham = {}) {
  const ws = Array.from({ length: n }, (_, i) =&gt; fork(new URL(import.meta.url).pathname, ['worker', i + 1, cham[i + 1] ?? 0]));
  await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
  let dem = 0;
  const goi = (k, ma) =&gt; new Promise((ok) =&gt; { const id = ++dem; const nghe = (m) =&gt; { if (m.id === id) { ws[k - 1].off('message', nghe); ok(m.kq); } }; ws[k - 1].on('message', nghe); ws[k - 1].send({ id, ma }); });
  const ket = (k, userId) =&gt; new Promise((ok) =&gt; { const c = ketNoi(&#96;http://localhost:\${19720 + k}&#96;, { auth: { userId }, transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; ok(c)); });
  return { goi, ket, dong: () =&gt; ws.forEach((w) =&gt; w.kill()) };
}</code></pre>
<p><strong>Counting on worker 1</strong> (user 42 has a tab on each worker, 9 other users):</p>
<div class="out">$ node dem.mjs
worker 1 · adapter = RedisAdapter
worker 1 · io.of("/").sockets.size        = 4
worker 1 · (await io.fetchSockets()).length = 12
worker 1 · io.in('user:42').fetchSockets()  = 3 tab
worker 1 · fetchSockets 200 lần: p50 1,92 ms · p99 4,98 ms (local sockets.size: ~0,001 ms)</div>
<p><strong>RemoteSocket</strong> — what comes back, what is routed, and <code>data</code> as a snapshot:</p>
<div class="out">$ node remote.mjs
Socket · worker 1 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = function
RemoteSocket · worker 2 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = undefined
RemoteSocket · worker 3 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = undefined
  tab ở worker 1 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 1
  tab ở worker 3 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 3
  tab ở worker 2 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 2
sửa s.data.vip = true rồi hỏi lại ⇒ data.vip = undefined (data là BẢN CHỤP, không phải con trỏ)</div>
<p><strong>socketsJoin</strong> — local loop vs cluster, and what <code>await</code> really waits for:</p>
<div class="out">$ node join.mjs
local: lặp io.of("/").sockets ở worker 1 rồi join  ⇒ vip có 1 / 3 tab
cụm: socketsJoin trả về undefined · ngay sau đó vip ở worker 1 có 0 socket · 50 ms sau toàn cụm có 3 / 3 tab</div>
<p><strong>This repo&#39;s call check</strong> (call.socket.ts:161 reads the local room map) with the callee on another worker:</p>
<div class="out">$ node goi.mjs
worker 1 · rooms.get(user:9) = undefined ⇒ gọi hụt — 'khong-truc-tuyen'
worker 1 · fetchSockets(user:9) = 1 ⇒ đổ chuông</div>
<p><strong>serverSideEmit</strong> — healthy, then one worker 6 s late:</p>
<div class="out">$ node rpc.mjs
— 3 worker khoẻ —
  callback sau 4,8 ms · err = null · responses = [{"worker":2,"count":0},{"worker":3,"count":0}]
  serverSideEmitWithAck ⇒ [{"worker":3,"count":0},{"worker":2,"count":0}]
— worker 3 chậm 6 s —
  callback sau 5001,9 ms · err = "timeout reached: only 1 responses received out of 2" · responses = [{"worker":2,"count":0}]
  serverSideEmitWithAck ⇒ ném lỗi · e.responses = [{"worker":2,"count":0}]</div>
<p><strong>Banning user 42</strong> — local disconnect vs <code>disconnectSockets(true)</code>, then a private message:</p>
<div class="out">$ node dis.mjs
— ngắt kiểu local —
  tab ở worker 1: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 2: 🟢 vẫn nối · lý do "—" · active true · thử nối lại 0 lần · nhận 1 tin sau lệnh cấm
  tab ở worker 3: 🟢 vẫn nối · lý do "—" · active true · thử nối lại 0 lần · nhận 1 tin sau lệnh cấm
— ngắt kiểu cụm —
  tab ở worker 1: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 2: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 3: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm</div>
<p><strong>In Chromium</strong> — three tabs on three workers, frames after the ban (local, then cluster-wide):</p>
<div class="out">w1 ↓ 41   (1223 ms)
w1 × close   (1226 ms)
w2 ↓ 42["tin","tin nhắn riêng gửi SAU lệnh cấm"]   (1526 ms)
w3 ↓ 42["tin","tin nhắn riêng gửi SAU lệnh cấm"]   (1528 ms)</div>
<div class="out">w1 ↓ 41   (1214 ms)
w2 ↓ 41   (1214 ms)
w3 ↓ 41   (1214 ms)
w1 × close   (1215 ms)
w2 × close   (1215 ms)
w3 × close   (1215 ms)</div>
<p><strong>This repo:</strong> locking (kiemDuyetAdmin.service.ts:120) and deleting an account (dataRights.service.ts:137) already call <code>disconnectSockets(true)</code>; <code>changePassword</code> disconnects no socket.</p>
<div class="out">$ grep -rn "disconnectSockets\\|socketsLeave\\|fetchSockets\\|adapter.rooms.get" src --include=*.ts | grep -v test
src/services/kiemDuyetAdmin.service.ts:120: getIO()?.in(&#96;user:\${userId}&#96;).disconnectSockets(true);
src/services/dataRights.service.ts:137: getIO()?.in(&#96;user:\${userId}&#96;).disconnectSockets(true);
src/services/work/chat.service.ts:51: if (channelId) { io.in(&#96;user:\${userId}&#96;).socketsLeave(chatRoom(projectId, channelId)); return; }
src/services/work/chat.service.ts:52: void io.in(&#96;user:\${userId}&#96;).fetchSockets().then((ss) =&gt; {
src/services/work/events.ts:134: getIO()?.in(&#96;user:\${userId}&#96;).socketsLeave(projectRoom(projectId));
src/services/work/events.ts:135: getIO()?.in(&#96;user:\${userId}&#96;).socketsLeave(clientRoom(projectId));
src/services/work/events.ts:137: void getIO()?.in(&#96;user:\${userId}&#96;).fetchSockets().then((ss) =&gt; {
src/socket/doiKhang.socket.ts:337: io.in(khoa(p.ma)).socketsLeave(khoa(p.ma));
src/socket/doiKhang.socket.ts:452: const soThietBi = (await io.in(&#96;user:\${den}&#96;).fetchSockets().catch(() =&gt; [])).length;
src/socket/call.socket.ts:161: const phongBenKia = io.sockets.adapter.rooms.get(phong(p.toUserId));
$ grep -n "async changePassword" -A40 src/services/auth.service.ts | grep -c "disconnectSockets"
0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// serverSideEmit — worker 1 hỏi mọi worker KHÁC. Lượt 1: 3 worker khoẻ. Lượt 2: worker 3 trả lời chậm 6 s (requestsTimeout mặc định 5 s).</span>
import { moCum } from './cum52.mjs';
for (const [ten, cham] of [['3 worker khoẻ', {}], ['worker 3 chậm 6 s', { 3: 6000 }]]) {
  const { goi, dong } = await moCum(3, cham);
  console.log(&#96;— \${ten} —&#96;);
  console.log(await goi(1, &#96;const t = performance.now();
    const [err, res] = await new Promise((ok) =&gt; io.serverSideEmit('get-stats', (e, r) =&gt; ok([e, r])));
    const ms = (performance.now() - t).toFixed(1).replace('.', ',');
    return '  callback sau ' + ms + ' ms · err = ' + (err ? JSON.stringify(err.message) : 'null') + ' · responses = ' + JSON.stringify(res);&#96;));
  console.log(await goi(1, &#96;try { const r = await io.serverSideEmitWithAck('get-stats'); return '  serverSideEmitWithAck ⇒ ' + JSON.stringify(r); }
    catch (e) { return '  serverSideEmitWithAck ⇒ ném lỗi · e.responses = ' + JSON.stringify(e.responses); }&#96;));
  dong();
}
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// "Đăng xuất mọi nơi": user 42 có 3 tab ở 3 worker. Lượt 1: worker 1 ngắt kiểu LOCAL (socket.disconnect(true) với socket của mình).</span>
<span class="tok-comment">// Lượt 2: io.in('user:42').disconnectSockets(true). Mỗi tab ghi lý do ngắt, và 3 s sau còn tự nối lại không.</span>
import { moCum } from './cum52.mjs';
for (const kieu of ['local', 'cụm']) {
  const { goi, ket, dong } = await moCum(3);
  const tab = [];
  for (const k of [1, 2, 3]) { const c = await ket(k, 42); const st = { k, ly: '—', thu: 0, tin: 0 };
    c.on('disconnect', (r) =&gt; { st.ly = r; }); c.io.on('reconnect_attempt', () =&gt; st.thu++); c.on('tin', () =&gt; st.tin++); tab.push([c, st]); }
  await goi(1, kieu === 'local' ? "for (const s of io.of('/').sockets.values()) if (s.data.userId === 42) s.disconnect(true);" : "io.in('user:42').disconnectSockets(true);");
  await new Promise((ok) =&gt; setTimeout(ok, 300));
  await goi(2, "io.to('user:42').emit('tin', 'tin nhắn riêng sau khi bị cấm')");
  await new Promise((ok) =&gt; setTimeout(ok, 3000));
  console.log(&#96;— ngắt kiểu \${kieu} —&#96;);
  for (const [c, st] of tab) console.log(&#96;  tab ở worker \${st.k}: \${c.connected ? '🟢 vẫn nối' : '⛔ đã ngắt'} · lý do \${JSON.stringify(st.ly)} · active \${c.active} · thử nối lại \${st.thu} lần · nhận \${st.tin} tin sau lệnh cấm&#96;);
  dong(); tab.forEach(([c]) =&gt; c.close());
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-5-4-danh-sach-thiet-bi" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 5.4 — The device list: revocation the user can SEE</span><span class="lc-sub">The token half of “log out everywhere”</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — More than one process: adapter, sticky session, backpressure</span><span class="lc-sub">fetchSockets finding a socket in another process</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fetchSockets</code></span><span class="v">Aggregate across workers; returns command-only <code>RemoteSocket</code>s.</span></div>
  <div class="kv"><span class="k"><code>socketsJoin</code>/<code>socketsLeave</code></span><span class="v">Change room membership for sockets you do not hold.</span></div>
  <div class="kv"><span class="k"><code>serverSideEmit</code></span><span class="v">All-or-nothing RPC to the OTHER workers.</span></div>
  <div class="kv"><span class="k"><code>disconnectSockets</code></span><span class="v">The half of &quot;log out everywhere&quot; token revocation cannot do.</span></div>
  <div class="kv"><span class="k"><code>RemoteSocket</code></span><span class="v">A cross-process handle: commands only, no listeners (not serializable).</span></div>
  <div class="kv"><span class="k">Local counterpart</span><span class="v">The non-adapter method that answers for one worker without error.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The adapter adds four cluster-wide methods: <code>fetchSockets</code>, <code>socketsJoin</code>/<code>socketsLeave</code>, <code>serverSideEmit</code>, <code>disconnectSockets</code>.</li><li><code>fetchSockets</code> returns command-only <code>RemoteSocket</code>s because listeners cannot cross processes.</li><li>The danger is the LOCAL counterparts — in a cluster they answer for one worker out of N, with no error.</li><li>A presence count from <code>io.sockets.size</code> is the classic silent bug.</li><li>Anything that must see every user goes through the adapter or a Redis-kept count.</li></ul>

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
// ⚠ ĐO THẬT: socketsJoin trả về undefined — await không chờ gì; ngay sau đó cả socket local cũng
//   chưa vào 'vip' (Redis adapter áp dụng khi yêu cầu quay về): 0, rồi 3/3 sau 50 ms
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
    // ⚠ ĐO THẬT (13/11/2026): sai — khi quá giờ responses VẪN chứa các trả lời đã về
    //   (err "timeout reached: only 1 responses received out of 2", responses = [{…worker 2}])
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
     ⚠ ĐO THẬT: CÓ kết quả từng phần — callback nhận (err, các trả lời đã về);
     serverSideEmitWithAck ném lỗi và để chúng ở err.responses.

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
// ⚠ ĐO THẬT: client nhận "io server disconnect", socket.active = false, 0 lần thử nối lại —
//   server chủ động ngắt là ngắt hẳn; ứng dụng phải tự gọi socket.connect().
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
<p><strong>Bẫy — coi callback của <code>serverSideEmit</code> là kết quả từng phần.</strong> Nếu bất kỳ worker nào lỡ timeout, bạn nhận một lỗi và hoàn toàn không có response nào, chứ không phải cái tập con đã trả lời. Một endpoint giám sát viết theo giả định có kết quả từng phần sẽ hiện &quot;0 người online&quot; trong một khoảnh khắc chậm thay vì một con số hơi cũ. <strong>Đo thật (13/11/2026) — tiền đề sai với @socket.io/redis-adapter 8.3.0:</strong> một trong ba worker trễ 6 s, callback chạy ở 5.001,9 ms với <code>err</code> VÀ <code>responses</code> chứa đúng một trả lời đã về; <code>serverSideEmitWithAck</code> ném lỗi kèm mảng đó ở <code>err.responses</code>. Bẫy thật là ngược lại: coi mảng thiếu đó là tổng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Adapter thêm bốn method toàn-cluster — <code>fetchSockets</code> (gộp lại, trả về <code>RemoteSocket</code> chỉ-nhận-lệnh vì listener không serialize được qua tiến trình), <code>socketsJoin</code>/<code>socketsLeave</code> (đổi thành viên room cho những socket bạn không cầm), <code>serverSideEmit</code> (RPC được-tất-cả-hoặc-không-gì tới các worker <em>khác</em>), và <code>disconnectSockets</code> (nửa của &quot;đăng xuất mọi nơi&quot; mà việc thu hồi token không làm được) — và mối nguy không nằm ở những method này mà ở những bản local tương ứng, vốn trong cluster trả lời thay cho một worker trên N mà không bao giờ nêu lên một lỗi nào.</p>
</div>

<h3>Method nào của adapter nói thật xuyên qua các worker</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">io.sockets</span><span class="lz-t">Chỉ cục bộ — nói dối khi chạy cụm</span><span class="lz-d">Nó là bản đồ các socket trên <em>worker này</em>. Trong một cụm bốn worker nó thấy một phần tư số người dùng và báo cáo con số đó là tổng.</span></div>
  <div class="lz-node"><span class="lz-k">await io.fetchSockets()</span><span class="lz-t">Toàn cụm — cái đáng với tay tới</span><span class="lz-d">Hỏi mọi worker qua adapter rồi trả về các tay cầm socket ở xa. Chậm hơn, và đúng.</span></div>
  <div class="lz-node"><span class="lz-k">socketsJoin / socketsLeave</span><span class="lz-t">Đổi phòng trên toàn cụm</span><span class="lz-d">Chuyển socket vào hoặc ra khỏi một phòng bất kể worker nào đang giữ chúng. Bản cục bộ tương đương thì âm thầm chẳng làm gì với ba phần tư trong số đó.</span></div>
  <div class="lz-node"><span class="lz-k">disconnectSockets</span><span class="lz-t">Ngắt kết nối trên toàn cụm</span><span class="lz-d">Cùng lý do: một lệnh cấm hiện thực bằng bản đồ cục bộ sẽ cấm người dùng trên một worker và để họ vẫn kết nối trên các worker còn lại.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một con số hiện diện đọc từ bản đồ socket cục bộ.</strong> <code>io.sockets.size</code> trả về số socket trên đúng cái worker tình cờ xử lý request đó, nên trong một cụm bốn worker nó báo khoảng một phần tư con số thật — và nó thay đổi theo từng request, vì bộ cân bằng tải chọn một worker khác mỗi lần. Lỗi đọc lên thành &quot;số người online sai và cứ nhảy lung tung&quot;, nghe như một điều kiện tranh chấp chứ không phải một vấn đề về hình trạng hệ thống. Nó cũng vô hình ở môi trường phát triển, nơi chỉ có một worker và con số hoàn toàn chính xác. Mọi thứ phải nhìn thấy MỌI người dùng đều phải đi qua adapter: <code>fetchSockets</code>, hoặc một con số đếm giữ trong Redis.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gọi <code>await io.fetchSockets()</code> trong một cụm và so số của nó với <code>io.sockets.size</code> — bản đồ local chỉ báo phần của một worker.</li>
<li>Dùng <code>socketsJoin</code>/<code>socketsLeave</code> để đưa một socket do worker KHÁC giữ vào một room, và xác nhận bản local lặng lẽ hỏng với nó.</li>
<li>Dùng <code>disconnectSockets</code> để làm &quot;đăng xuất mọi nơi&quot; và để ý rằng chỉ thu hồi token không thể rớt các kết nối còn sống.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra một bộ đếm từ bản đồ local nói dối trong cụm và sửa nó bằng một method adapter toàn-cụm.</p></div>

<h3>🔬 Đo thật: bốn method trên một cụm thật</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · Redis 7 — ba tiến trình worker (fork). Tệp dựng cụm và chạy mã <em>ngay trong</em> một worker:</p>
<pre><code class="language-javascript"><span class="tok-comment">// Dựng một CỤM thật: N worker = N tiến trình Node (fork), Redis adapter qua sio-redis, cổng 19721…; client nối worker nào tuỳ ý.</span>
<span class="tok-comment">// Mỗi worker: middleware đặt socket.data.userId, vào phòng user:&lt;id&gt;; nghe sự kiện server-side 'get-stats' (trả lời sau &#96;cham&#96; ms).</span>
<span class="tok-comment">// goi(k, 'mã JS') chạy một đoạn mã TRONG worker k (biến io có sẵn) và trả kết quả về — để bài đo đứng ở đúng một worker.</span>
import { fork } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
if (process.argv[2] === 'worker') {
  const so = +process.argv[3], cham = +process.argv[4];
  const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(19720 + so, { adapter: createAdapter(pub, sub) });
  io.use((s, next) =&gt; { s.data.userId = s.handshake.auth.userId; s.data.worker = so; next(); });
  io.on('connection', (s) =&gt; s.join(&#96;user:\${s.data.userId}&#96;));
  io.on('get-stats', (cb) =&gt; setTimeout(() =&gt; cb({ worker: so, count: io.of('/').sockets.size }), cham));
  const AsyncFn = (async () =&gt; {}).constructor;
  process.on('message', async ({ id, ma }) =&gt; process.send({ id, kq: await new AsyncFn('io', ma)(io) }));
  process.send('san-sang');
}
export async function moCum(n, cham = {}) {
  const ws = Array.from({ length: n }, (_, i) =&gt; fork(new URL(import.meta.url).pathname, ['worker', i + 1, cham[i + 1] ?? 0]));
  await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
  let dem = 0;
  const goi = (k, ma) =&gt; new Promise((ok) =&gt; { const id = ++dem; const nghe = (m) =&gt; { if (m.id === id) { ws[k - 1].off('message', nghe); ok(m.kq); } }; ws[k - 1].on('message', nghe); ws[k - 1].send({ id, ma }); });
  const ket = (k, userId) =&gt; new Promise((ok) =&gt; { const c = ketNoi(&#96;http://localhost:\${19720 + k}&#96;, { auth: { userId }, transports: ['websocket'], forceNew: true }); c.once('connect', () =&gt; ok(c)); });
  return { goi, ket, dong: () =&gt; ws.forEach((w) =&gt; w.kill()) };
}</code></pre>
<p><strong>Đếm ở worker 1</strong> (user 42 có một tab ở mỗi worker, thêm 9 người khác):</p>
<div class="out">$ node dem.mjs
worker 1 · adapter = RedisAdapter
worker 1 · io.of("/").sockets.size        = 4
worker 1 · (await io.fetchSockets()).length = 12
worker 1 · io.in('user:42').fetchSockets()  = 3 tab
worker 1 · fetchSockets 200 lần: p50 1,92 ms · p99 4,98 ms (local sockets.size: ~0,001 ms)</div>
<p><strong>RemoteSocket</strong> — cái gì trả về, cái gì định tuyến được, và <code>data</code> là bản chụp:</p>
<div class="out">$ node remote.mjs
Socket · worker 1 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = function
RemoteSocket · worker 2 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = undefined
RemoteSocket · worker 3 · rooms ["user:42"] · auth {"userId":42} · typeof s.on = undefined
  tab ở worker 1 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 1
  tab ở worker 3 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 3
  tab ở worker 2 nhận 'nhac': lệnh từ worker 1 tới socket ở worker 2
sửa s.data.vip = true rồi hỏi lại ⇒ data.vip = undefined (data là BẢN CHỤP, không phải con trỏ)</div>
<p><strong>socketsJoin</strong> — lặp local vs cả cụm, và <code>await</code> thật ra chờ gì:</p>
<div class="out">$ node join.mjs
local: lặp io.of("/").sockets ở worker 1 rồi join  ⇒ vip có 1 / 3 tab
cụm: socketsJoin trả về undefined · ngay sau đó vip ở worker 1 có 0 socket · 50 ms sau toàn cụm có 3 / 3 tab</div>
<p><strong>Chỗ kiểm cuộc gọi của kho</strong> (call.socket.ts:161 đọc bảng room local) khi người nhận ở worker khác:</p>
<div class="out">$ node goi.mjs
worker 1 · rooms.get(user:9) = undefined ⇒ gọi hụt — 'khong-truc-tuyen'
worker 1 · fetchSockets(user:9) = 1 ⇒ đổ chuông</div>
<p><strong>serverSideEmit</strong> — cụm khoẻ, rồi một worker trễ 6 s:</p>
<div class="out">$ node rpc.mjs
— 3 worker khoẻ —
  callback sau 4,8 ms · err = null · responses = [{"worker":2,"count":0},{"worker":3,"count":0}]
  serverSideEmitWithAck ⇒ [{"worker":3,"count":0},{"worker":2,"count":0}]
— worker 3 chậm 6 s —
  callback sau 5001,9 ms · err = "timeout reached: only 1 responses received out of 2" · responses = [{"worker":2,"count":0}]
  serverSideEmitWithAck ⇒ ném lỗi · e.responses = [{"worker":2,"count":0}]</div>
<p><strong>Cấm user 42</strong> — ngắt local vs <code>disconnectSockets(true)</code>, rồi gửi một tin riêng:</p>
<div class="out">$ node dis.mjs
— ngắt kiểu local —
  tab ở worker 1: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 2: 🟢 vẫn nối · lý do "—" · active true · thử nối lại 0 lần · nhận 1 tin sau lệnh cấm
  tab ở worker 3: 🟢 vẫn nối · lý do "—" · active true · thử nối lại 0 lần · nhận 1 tin sau lệnh cấm
— ngắt kiểu cụm —
  tab ở worker 1: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 2: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm
  tab ở worker 3: ⛔ đã ngắt · lý do "io server disconnect" · active false · thử nối lại 0 lần · nhận 0 tin sau lệnh cấm</div>
<p><strong>Trong Chromium</strong> — ba tab ở ba worker, khung sau lệnh cấm (local, rồi toàn cụm):</p>
<div class="out">w1 ↓ 41   (1223 ms)
w1 × close   (1226 ms)
w2 ↓ 42["tin","tin nhắn riêng gửi SAU lệnh cấm"]   (1526 ms)
w3 ↓ 42["tin","tin nhắn riêng gửi SAU lệnh cấm"]   (1528 ms)</div>
<div class="out">w1 ↓ 41   (1214 ms)
w2 ↓ 41   (1214 ms)
w3 ↓ 41   (1214 ms)
w1 × close   (1215 ms)
w2 × close   (1215 ms)
w3 × close   (1215 ms)</div>
<p><strong>Kho này:</strong> khoá tài khoản (kiemDuyetAdmin.service.ts:120) và xoá tài khoản (dataRights.service.ts:137) đã gọi <code>disconnectSockets(true)</code>; <code>changePassword</code> không ngắt socket nào.</p>
<div class="out">$ grep -rn "disconnectSockets\\|socketsLeave\\|fetchSockets\\|adapter.rooms.get" src --include=*.ts | grep -v test
src/services/kiemDuyetAdmin.service.ts:120: getIO()?.in(&#96;user:\${userId}&#96;).disconnectSockets(true);
src/services/dataRights.service.ts:137: getIO()?.in(&#96;user:\${userId}&#96;).disconnectSockets(true);
src/services/work/chat.service.ts:51: if (channelId) { io.in(&#96;user:\${userId}&#96;).socketsLeave(chatRoom(projectId, channelId)); return; }
src/services/work/chat.service.ts:52: void io.in(&#96;user:\${userId}&#96;).fetchSockets().then((ss) =&gt; {
src/services/work/events.ts:134: getIO()?.in(&#96;user:\${userId}&#96;).socketsLeave(projectRoom(projectId));
src/services/work/events.ts:135: getIO()?.in(&#96;user:\${userId}&#96;).socketsLeave(clientRoom(projectId));
src/services/work/events.ts:137: void getIO()?.in(&#96;user:\${userId}&#96;).fetchSockets().then((ss) =&gt; {
src/socket/doiKhang.socket.ts:337: io.in(khoa(p.ma)).socketsLeave(khoa(p.ma));
src/socket/doiKhang.socket.ts:452: const soThietBi = (await io.in(&#96;user:\${den}&#96;).fetchSockets().catch(() =&gt; [])).length;
src/socket/call.socket.ts:161: const phongBenKia = io.sockets.adapter.rooms.get(phong(p.toUserId));
$ grep -n "async changePassword" -A40 src/services/auth.service.ts | grep -c "disconnectSockets"
0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// serverSideEmit — worker 1 hỏi mọi worker KHÁC. Lượt 1: 3 worker khoẻ. Lượt 2: worker 3 trả lời chậm 6 s (requestsTimeout mặc định 5 s).</span>
import { moCum } from './cum52.mjs';
for (const [ten, cham] of [['3 worker khoẻ', {}], ['worker 3 chậm 6 s', { 3: 6000 }]]) {
  const { goi, dong } = await moCum(3, cham);
  console.log(&#96;— \${ten} —&#96;);
  console.log(await goi(1, &#96;const t = performance.now();
    const [err, res] = await new Promise((ok) =&gt; io.serverSideEmit('get-stats', (e, r) =&gt; ok([e, r])));
    const ms = (performance.now() - t).toFixed(1).replace('.', ',');
    return '  callback sau ' + ms + ' ms · err = ' + (err ? JSON.stringify(err.message) : 'null') + ' · responses = ' + JSON.stringify(res);&#96;));
  console.log(await goi(1, &#96;try { const r = await io.serverSideEmitWithAck('get-stats'); return '  serverSideEmitWithAck ⇒ ' + JSON.stringify(r); }
    catch (e) { return '  serverSideEmitWithAck ⇒ ném lỗi · e.responses = ' + JSON.stringify(e.responses); }&#96;));
  dong();
}
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// "Đăng xuất mọi nơi": user 42 có 3 tab ở 3 worker. Lượt 1: worker 1 ngắt kiểu LOCAL (socket.disconnect(true) với socket của mình).</span>
<span class="tok-comment">// Lượt 2: io.in('user:42').disconnectSockets(true). Mỗi tab ghi lý do ngắt, và 3 s sau còn tự nối lại không.</span>
import { moCum } from './cum52.mjs';
for (const kieu of ['local', 'cụm']) {
  const { goi, ket, dong } = await moCum(3);
  const tab = [];
  for (const k of [1, 2, 3]) { const c = await ket(k, 42); const st = { k, ly: '—', thu: 0, tin: 0 };
    c.on('disconnect', (r) =&gt; { st.ly = r; }); c.io.on('reconnect_attempt', () =&gt; st.thu++); c.on('tin', () =&gt; st.tin++); tab.push([c, st]); }
  await goi(1, kieu === 'local' ? "for (const s of io.of('/').sockets.values()) if (s.data.userId === 42) s.disconnect(true);" : "io.in('user:42').disconnectSockets(true);");
  await new Promise((ok) =&gt; setTimeout(ok, 300));
  await goi(2, "io.to('user:42').emit('tin', 'tin nhắn riêng sau khi bị cấm')");
  await new Promise((ok) =&gt; setTimeout(ok, 3000));
  console.log(&#96;— ngắt kiểu \${kieu} —&#96;);
  for (const [c, st] of tab) console.log(&#96;  tab ở worker \${st.k}: \${c.connected ? '🟢 vẫn nối' : '⛔ đã ngắt'} · lý do \${JSON.stringify(st.ly)} · active \${c.active} · thử nối lại \${st.thu} lần · nhận \${st.tin} tin sau lệnh cấm&#96;);
  dong(); tab.forEach(([c]) =&gt; c.close());
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-5-4-danh-sach-thiet-bi" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 5.4 — Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY</span><span class="lc-sub">Nửa token của “đăng xuất mọi nơi”</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược</span><span class="lc-sub">fetchSockets thấy socket ở tiến trình khác</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fetchSockets</code></span><span class="v">Gộp qua các worker; trả về <code>RemoteSocket</code> chỉ-nhận-lệnh.</span></div>
  <div class="kv"><span class="k"><code>socketsJoin</code>/<code>socketsLeave</code></span><span class="v">Đổi thành viên room cho các socket bạn không cầm.</span></div>
  <div class="kv"><span class="k"><code>serverSideEmit</code></span><span class="v">RPC được-tất-cả-hoặc-không tới các worker KHÁC.</span></div>
  <div class="kv"><span class="k"><code>disconnectSockets</code></span><span class="v">Nửa của &quot;đăng xuất mọi nơi&quot; mà thu hồi token không làm được.</span></div>
  <div class="kv"><span class="k"><code>RemoteSocket</code></span><span class="v">Một handle xuyên tiến trình: chỉ lệnh, không listener (không serialize được).</span></div>
  <div class="kv"><span class="k">Bản local tương ứng</span><span class="v">Method không-adapter trả lời thay cho một worker mà không lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Adapter thêm bốn method toàn-cụm: <code>fetchSockets</code>, <code>socketsJoin</code>/<code>socketsLeave</code>, <code>serverSideEmit</code>, <code>disconnectSockets</code>.</li><li><code>fetchSockets</code> trả về <code>RemoteSocket</code> chỉ-nhận-lệnh vì listener không qua tiến trình được.</li><li>Mối nguy là các bản LOCAL — trong cụm chúng trả lời thay cho một worker trên N, không lỗi.</li><li>Một presence count từ <code>io.sockets.size</code> là bug âm thầm kinh điển.</li><li>Mọi thứ phải thấy mọi user đều đi qua adapter hoặc một con số giữ trong Redis.</li></ul>

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
${G05_3}
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

<p><strong>Measured (13/11/2026, Redis 7.4, adapter wired like this repo, 20 emits/s):</strong> quick restart (~0.4 s down) lost 6 of 131 messages to the other worker; a 2 s stall (<code>CLIENT PAUSE</code>) lost <strong>none</strong> — they arrived up to ~2 s late, in order; stopping Redis for 10 s, twice with the same script, gave run 1 <strong>0 lost but up to 11.2 s late</strong> and run 2 <strong>139 lost</strong>. So &quot;no replay after reconnect&quot; is wrong both ways: node-redis keeps publishes in its offline queue and flushes them on reconnect, and whether the other worker has re-subscribed by then is a race. Two more things the list above misses: a <code>PUBLISH</code> in flight when the socket closes is rejected and the adapter never catches it — without a <code>process.on(&#39;unhandledRejection&#39;)</code> handler Node 22 <strong>exits with code 1</strong> (this repo keeps the process alive at src/index.ts:866); and <code>fetchSockets()</code> hung 8.1 s for the whole outage (its first step, <code>PUBSUB NUMSUB</code>, has no timeout), then answered 1 socket where there were 2.</p>
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

<p><strong>Not measured here — from documentation:</strong> Sentinel only starts a failover after <code>down-after-milliseconds</code> (30 s in the sample sentinel.conf), so &quot;5-10s&quot; assumes a tuned config. For Redis Cluster, @socket.io/redis-adapter 8.3 ships <code>createShardedAdapter</code> (Redis 7 sharded pub/sub).</p>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Reproduce the three Redis failure modes against a running cluster: a quick restart, artificial slowness, and a full stop; log what happens to cross-worker broadcast in each.</li>
<li>Confirm this repo's best-effort fallback keeps the single instance working while cluster broadcast is down.</li>
<li>Add a check on the adapter's status so monitoring can alert when cluster broadcast degrades.</li>
</ol>
<p><strong>Done when:</strong> you can describe the effect of each failure mode and name the signal you would monitor.</p></div>

<h3>🔬 Measured: three failure modes on a real Redis</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · redis 4.7.1 · Redis 7.4 — two workers, A on worker 1, B on worker 2, worker 1 emits every 50 ms. First run without an <code>unhandledRejection</code> handler, then like this repo:</p>
<div class="out">$ node chet3.mjs restart khong-bat   # KHÔNG có process.on('unhandledRejection')
1,0 s  ⚡ docker restart sio-redis
1,0 s  pub.isReady = false
/Users/admin/.rtq-sio/lab/node_modules/@redis/client/dist/lib/client/socket.js:194

SocketClosedUnexpectedlyError: Socket closed unexpectedly

exit code: 1
$ node chet3.mjs restart
1,0 s  ⚡ docker restart sio-redis
1,0 s  pub.isReady = false
1,4 s  pub.isReady = true (nối lại)
— restart · worker 1 phát 131 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 131/131
  B (worker 2, qua Redis): nhận 125/131 · MẤT 6 — tin phát trong 1,0 s–1,3 s
  độ trễ tới B: p50 2 ms · lớn nhất 12 ms
  console.warn "missing 'error' handler on this Redis client": 32 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs pause
1,0 s  ⚡ redis-cli CLIENT PAUSE 2000 ALL (Redis treo 2 s)
1,3 s  fetchSockets() gọi ở worker 1 ⇒ trả 2 socket sau 1,8 s
— pause · worker 1 phát 111 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 111/111
  B (worker 2, qua Redis): nhận 111/111 · MẤT 0
  độ trễ tới B: p50 3 ms · lớn nhất 2033 ms
  console.warn "missing 'error' handler on this Redis client": 0 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 0 lần  · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs stop
1,0 s  ⚡ docker stop sio-redis … 10 s … docker start
1,0 s  pub.isReady = false
11,6 s  pub.isReady = true (nối lại)
3,5 s  fetchSockets() gọi ở worker 1 ⇒ trả 2 socket sau 8,1 s
— stop · worker 1 phát 347 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 347/347
  B (worker 2, qua Redis): nhận 347/347 · MẤT 0
  độ trễ tới B: p50 1811 ms · lớn nhất 11229 ms
  console.warn "missing 'error' handler on this Redis client": 100 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs stop   # lượt 2, y hệt
1,0 s  ⚡ docker stop sio-redis … 10 s … docker start
1,0 s  pub.isReady = false
3,5 s  fetchSockets() gọi ở worker 1 ⇒ trả 1 socket sau 8,1 s
11,6 s  pub.isReady = true (nối lại)
— stop · worker 1 phát 347 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 347/347
  B (worker 2, qua Redis): nhận 208/347 · MẤT 139 — tin phát trong 1,1 s–8,1 s
  độ trễ tới B: p50 3 ms · lớn nhất 11269 ms
  console.warn "missing 'error' handler on this Redis client": 100 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho</div>
<p><strong>This repo&#39;s boot order with Redis down</strong> (<code>new Server</code> then <code>void attachRedisAdapter(io)</code>): the late attach swaps in a new, empty adapter.</p>
<div class="out">$ node muon.mjs
0,2 s  client nối, server cho vào room user:7 · adapter = Adapter
0,4 s  phát vào user:7 ⇒ client nhận 1
4,0 s  docker start sio-redis
4,1 s  INFO Socket.IO Redis adapter attached
4,8 s  phát lại vào user:7 ⇒ client nhận thêm 0 · adapter.rooms.get('user:7') = undefined · socket.rooms vẫn nói ["user:7"] · client.connected = true</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "void attachRedisAdapter\\|io = new IOServer" src/socket/messaging.socket.ts ; grep -n "initSocketServer(server)\\|server.listen(config.port" src/index.ts
310: io = new IOServer(httpServer, {
330: void attachRedisAdapter(io);
751:initSocketServer(server);
994: server.listen(config.port, () =&gt; {
$ grep -n "maxmemory\\|condition: service_healthy" docker-compose.yml
91: command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes
203: condition: service_healthy
205: condition: service_healthy</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba kiểu Redis hỏng, đo THẬT trên container sio-redis. Hai worker (hai Server trong một tiến trình, một đồng hồ) gắn adapter ĐÚNG KIỂU KHO:</span>
<span class="tok-comment">// client gốc có reconnectStrategy (retries*50, trần 2 s) + listener 'error'; pub/sub = base.duplicate() (KHÔNG listener riêng, như kho).</span>
<span class="tok-comment">// A nối worker 1, B nối worker 2, cùng phòng r. Worker 1 phát tin số k mỗi 50 ms. Lúc 1 s: gây sự cố. Ghi: B nhận tin nào, trễ bao nhiêu.</span>
import { spawn } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const kieu = process.argv[2];
<span class="tok-comment">// Kho có process.on('unhandledRejection') ghi log rồi GIỮ tiến trình sống (src/index.ts:866). 'khong-bat' = ứng dụng thường, không có handler đó.</span>
let tuChoi = 0; const loaiTuChoi = new Set();
if (process.argv[3] !== 'khong-bat') process.on('unhandledRejection', (e) =&gt; { tuChoi++; loaiTuChoi.add(e?.constructor?.name); });
const t0 = Date.now(); const s = (ms = Date.now() - t0) =&gt; (ms / 1000).toFixed(1).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const docker = (...a) =&gt; new Promise((ok) =&gt; spawn('/usr/local/bin/docker', a, { stdio: 'ignore' }).on('exit', ok));
let canhBao = 0; const goc = console.warn; console.warn = (...a) =&gt; { if (String(a[0]).includes("missing 'error' handler")) canhBao++; else goc(...a); };
const moi = async (cong) =&gt; {
  const base = createClient({ url: 'redis://127.0.0.1:19661', socket: { reconnectStrategy: (r) =&gt; Math.min(r * 50, 2000) } });
  base.on('error', () =&gt; {}); await base.connect();
  const pub = base.duplicate(), sub = base.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) }); io.on('connection', (x) =&gt; x.join('r'));
  return { io, pub };
};
const w1 = await moi(19741), w2 = await moi(19742);
const ket = (c) =&gt; ketNoi(&#96;http://localhost:\${c}&#96;, { transports: ['websocket'], forceNew: true });
const A = ket(19741), B = ket(19742);
await Promise.all([A, B].map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
const nhanA = new Set(), nhanB = new Map();
A.on('tin', (m) =&gt; nhanA.add(m.k)); B.on('tin', (m) =&gt; nhanB.set(m.k, Date.now() - m.t));
let k = 0; const gui = new Map();
const nhip = setInterval(() =&gt; { const t = Date.now(); gui.set(k, t); w1.io.to('r').emit('tin', { k: k++, t }); }, 50);
const SU_CO = { restart: ['docker restart sio-redis', 1000, () =&gt; docker('restart', '-t', '0', 'sio-redis'), 6000],
  pause: ['redis-cli CLIENT PAUSE 2000 ALL (Redis treo 2 s)', 1000, () =&gt; docker('exec', 'sio-redis', 'redis-cli', 'CLIENT', 'PAUSE', '2000', 'ALL'), 5000],
  stop: ['docker stop sio-redis … 10 s … docker start', 1000, async () =&gt; { await docker('stop', '-t', '0', 'sio-redis'); await cho(10000); await docker('start', 'sio-redis'); }, 17000] }[kieu];
await cho(SU_CO[1] - (Date.now() - t0));
console.log(&#96;\${s()}  ⚡ \${SU_CO[0]}&#96;);
const xong = SU_CO[2]();
const fsT = Date.now();
if (kieu !== 'restart') setTimeout(() =&gt; { const a = Date.now(); w1.io.in('r').fetchSockets().then((x) =&gt; console.log(&#96;\${s(a - t0)}  fetchSockets() gọi ở worker 1 ⇒ trả \${x.length} socket sau \${s(Date.now() - a)}&#96;), (e) =&gt; console.log(&#96;\${s(a - t0)}  fetchSockets() ⇒ lỗi sau \${s(Date.now() - a)}: \${e.message}&#96;)); }, kieu === 'stop' ? 2500 : 300);
const theo = setInterval(() =&gt; { if (!w1.pub.isReady &amp;&amp; !theo.daIn) { theo.daIn = true; console.log(&#96;\${s()}  pub.isReady = false&#96;); } if (w1.pub.isReady &amp;&amp; theo.daIn &amp;&amp; !theo.lai) { theo.lai = true; console.log(&#96;\${s()}  pub.isReady = true (nối lại)&#96;); } }, 20);
await xong; await cho(SU_CO[3] - (Date.now() - fsT));
clearInterval(nhip); await cho(2500); clearInterval(theo);
const mat = [...gui.keys()].filter((x) =&gt; !nhanB.has(x));
const tre = [...nhanB.values()].sort((a, b) =&gt; a - b);
const doan = []; for (const x of mat) { const d = doan.at(-1); if (d &amp;&amp; x === d[1] + 1) d[1] = x; else doan.push([x, x]); }
const vao = (x) =&gt; s(gui.get(x) - t0);
console.log(&#96;— \${kieu} · worker 1 phát \${gui.size} tin (mỗi 50 ms) —&#96;);
console.log(&#96;  A (cùng worker 1): nhận \${nhanA.size}/\${gui.size}&#96;);
console.log(&#96;  B (worker 2, qua Redis): nhận \${nhanB.size}/\${gui.size} · MẤT \${mat.length}\${doan.length ? ' — tin phát trong ' + doan.map(([a, b]) =&gt; &#96;\${vao(a)}–\${vao(b)}&#96;).join(', ') : ''}&#96;);
console.log(&#96;  độ trễ tới B: p50 \${tre[Math.floor(tre.length / 2)]} ms · lớn nhất \${tre.at(-1)} ms&#96;);
console.log(&#96;  console.warn "missing 'error' handler on this Redis client": \${canhBao} lần&#96;);
console.log(&#96;  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): \${tuChoi} lần \${[...loaiTuChoi].join(' ')} · tiến trình vẫn sống nhờ handler kiểu kho&#96;);
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Chép đúng thứ tự của kho: new Server(...) rồi &#96;void attachRedisAdapter(io)&#96; — getRedis() có reconnectStrategy nên KHÔNG BAO GIỜ ném.</span>
<span class="tok-comment">// Redis đang tắt lúc khởi động. Client nối vào, join room user:7. 4 s sau Redis lên ⇒ adapter gắn MUỘN. Rồi phát vào user:7.</span>
import { spawn } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s';
const docker = (...a) =&gt; new Promise((ok) =&gt; spawn('/usr/local/bin/docker', a, { stdio: 'ignore' }).on('exit', ok));
async function getRedis() {
  const c = createClient({ url: 'redis://127.0.0.1:19661', socket: { reconnectStrategy: (r) =&gt; Math.min(r * 50, 2000) } });
  c.on('error', () =&gt; {}); await c.connect(); return c;
}
async function attachRedisAdapter(server) {
  try { const base = await getRedis(); const pub = base.duplicate(), sub = base.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
    server.adapter(createAdapter(pub, sub)); console.log(&#96;\${s()}  INFO Socket.IO Redis adapter attached&#96;);
  } catch (e) { console.log(&#96;\${s()}  WARN NOT attached: \${e.message}&#96;); }
}
await docker('stop', '-t', '0', 'sio-redis');
const io = new Server(19743);
io.on('connection', (x) =&gt; x.join('user:7'));
void attachRedisAdapter(io);
const c = ketNoi('http://localhost:19743', { transports: ['websocket'] }); let nhan = 0; c.on('tin', () =&gt; nhan++);
await new Promise((ok) =&gt; c.once('connect', ok));
console.log(&#96;\${s()}  client nối, server cho vào room user:7 · adapter = \${io.of('/').adapter.constructor.name}&#96;);
io.to('user:7').emit('tin'); await new Promise((ok) =&gt; setTimeout(ok, 200));
console.log(&#96;\${s()}  phát vào user:7 ⇒ client nhận \${nhan}&#96;);
await new Promise((ok) =&gt; setTimeout(ok, 3500)); await docker('start', 'sio-redis'); console.log(&#96;\${s()}  docker start sio-redis&#96;);
while (io.of('/').adapter.constructor.name !== 'RedisAdapter') await new Promise((ok) =&gt; setTimeout(ok, 100));
await new Promise((ok) =&gt; setTimeout(ok, 300));
const sk = [...io.of('/').sockets.values()][0];
io.to('user:7').emit('tin'); await new Promise((ok) =&gt; setTimeout(ok, 300));
console.log(&#96;\${s()}  phát lại vào user:7 ⇒ client nhận thêm \${nhan - 1} · adapter.rooms.get('user:7') = \${io.of('/').adapter.rooms.get('user:7')?.size ?? 'undefined'} · socket.rooms vẫn nói \${JSON.stringify([...sk.rooms].slice(1))} · client.connected = \${c.connected}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and its price</span><span class="lc-sub">Why a message with no live subscriber is gone</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-11-3-sentinel" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 11.3 — Sentinel: automatic failover</span><span class="lc-sub">The failover window this lesson only cites</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-4-5-thu-thap-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 4.5 — Which metrics to actually collect</span><span class="lc-sub">Where the adapter health signal belongs</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quick restart</span><span class="v">Redis bounces; broadcast is lost briefly, then recovers.</span></div>
  <div class="kv"><span class="k">Slowness</span><span class="v">Redis is up but slow; broadcasts lag or queue.</span></div>
  <div class="kv"><span class="k">Total death</span><span class="v">Redis is gone; cross-worker broadcast stops entirely.</span></div>
  <div class="kv"><span class="k">Best-effort fallback</span><span class="v">The in-memory adapter — fine while single-instance.</span></div>
  <div class="kv"><span class="k">Adapter status</span><span class="v">The signal cluster mode must monitor to catch degradation.</span></div>
  <div class="kv"><span class="k">Postgres adapter</span><span class="v">An alternative: 5-10ms slower, 8KB payload cap.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>All three Redis failure modes (quick restart, slowness, total death) cost you cluster broadcast for a while.</li><li>This repo chooses a best-effort fallback — the in-memory adapter, fine while single-instance.</li><li>Cluster mode must monitor the adapter's status to notice degradation.</li><li>The Postgres adapter is an alternative: 5-10ms slower, 8KB payloads.</li><li>The Node cluster adapter is another, but it does not scale across VMs.</li></ul>

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

<p><strong>Đo thật (13/11/2026, Redis 7.4, adapter gắn đúng kiểu kho, 20 tin/s):</strong> restart nhanh (~0,4 s) mất 6/131 tin sang worker kia; treo 2 s (<code>CLIENT PAUSE</code>) <strong>không mất</strong> tin nào — tới trễ tới ~2 s, đúng thứ tự; tắt Redis 10 s, hai lượt cùng một script: lượt 1 <strong>mất 0 nhưng trễ tới 11,2 s</strong>, lượt 2 <strong>mất 139</strong>. Nên &quot;sau reconnect không replay&quot; sai cả hai chiều: node-redis giữ lệnh PUBLISH trong hàng đợi offline và đẩy đi khi nối lại, còn worker kia đã kịp subscribe lại chưa là một cuộc đua. Hai điều danh sách trên bỏ sót: lệnh <code>PUBLISH</code> đang bay khi kết nối đứt bị từ chối và adapter không bao giờ catch — thiếu handler <code>process.on(&#39;unhandledRejection&#39;)</code> thì Node 22 <strong>thoát mã 1</strong> (kho này giữ tiến trình sống ở src/index.ts:866); và <code>fetchSockets()</code> treo 8,1 s suốt lúc Redis chết (bước đầu <code>PUBSUB NUMSUB</code> không có timeout), rồi trả 1 socket trong khi có 2.</p>
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

<p><strong>Không đo ở đây — theo tài liệu:</strong> Sentinel chỉ bắt đầu chuyển đổi sau <code>down-after-milliseconds</code> (30 s trong sentinel.conf mẫu), nên &quot;5-10s&quot; là cấu hình đã chỉnh. Với Redis Cluster, @socket.io/redis-adapter 8.3 có <code>createShardedAdapter</code> (sharded pub/sub của Redis 7).</p>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tái hiện ba failure mode của Redis trên một cụm đang chạy: restart nhanh, chậm giả, và dừng hẳn; log chuyện gì xảy ra với broadcast qua worker ở mỗi cái.</li>
<li>Xác nhận best-effort fallback của kho này giữ single instance chạy trong khi cluster broadcast mất.</li>
<li>Thêm một check trạng thái adapter để monitoring có thể cảnh báo khi cluster broadcast suy giảm.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn mô tả được tác động của mỗi failure mode và gọi tên tín hiệu bạn sẽ monitor.</p></div>

<h3>🔬 Đo thật: ba failure mode trên Redis thật</h3>
<p>socket.io 4.8.3 · @socket.io/redis-adapter 8.3.0 · redis 4.7.1 · Redis 7.4 — hai worker, A ở worker 1, B ở worker 2, worker 1 phát mỗi 50 ms. Lượt đầu không có handler <code>unhandledRejection</code>, các lượt sau giống kho:</p>
<div class="out">$ node chet3.mjs restart khong-bat   # KHÔNG có process.on('unhandledRejection')
1,0 s  ⚡ docker restart sio-redis
1,0 s  pub.isReady = false
/Users/admin/.rtq-sio/lab/node_modules/@redis/client/dist/lib/client/socket.js:194

SocketClosedUnexpectedlyError: Socket closed unexpectedly

exit code: 1
$ node chet3.mjs restart
1,0 s  ⚡ docker restart sio-redis
1,0 s  pub.isReady = false
1,4 s  pub.isReady = true (nối lại)
— restart · worker 1 phát 131 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 131/131
  B (worker 2, qua Redis): nhận 125/131 · MẤT 6 — tin phát trong 1,0 s–1,3 s
  độ trễ tới B: p50 2 ms · lớn nhất 12 ms
  console.warn "missing 'error' handler on this Redis client": 32 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs pause
1,0 s  ⚡ redis-cli CLIENT PAUSE 2000 ALL (Redis treo 2 s)
1,3 s  fetchSockets() gọi ở worker 1 ⇒ trả 2 socket sau 1,8 s
— pause · worker 1 phát 111 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 111/111
  B (worker 2, qua Redis): nhận 111/111 · MẤT 0
  độ trễ tới B: p50 3 ms · lớn nhất 2033 ms
  console.warn "missing 'error' handler on this Redis client": 0 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 0 lần  · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs stop
1,0 s  ⚡ docker stop sio-redis … 10 s … docker start
1,0 s  pub.isReady = false
11,6 s  pub.isReady = true (nối lại)
3,5 s  fetchSockets() gọi ở worker 1 ⇒ trả 2 socket sau 8,1 s
— stop · worker 1 phát 347 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 347/347
  B (worker 2, qua Redis): nhận 347/347 · MẤT 0
  độ trễ tới B: p50 1811 ms · lớn nhất 11229 ms
  console.warn "missing 'error' handler on this Redis client": 100 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho
$ node chet3.mjs stop   # lượt 2, y hệt
1,0 s  ⚡ docker stop sio-redis … 10 s … docker start
1,0 s  pub.isReady = false
3,5 s  fetchSockets() gọi ở worker 1 ⇒ trả 1 socket sau 8,1 s
11,6 s  pub.isReady = true (nối lại)
— stop · worker 1 phát 347 tin (mỗi 50 ms) —
  A (cùng worker 1): nhận 347/347
  B (worker 2, qua Redis): nhận 208/347 · MẤT 139 — tin phát trong 1,1 s–8,1 s
  độ trễ tới B: p50 3 ms · lớn nhất 11269 ms
  console.warn "missing 'error' handler on this Redis client": 100 lần
  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): 1 lần SocketClosedUnexpectedlyError · tiến trình vẫn sống nhờ handler kiểu kho</div>
<p><strong>Thứ tự khởi động của kho khi Redis tắt</strong> (<code>new Server</code> rồi <code>void attachRedisAdapter(io)</code>): gắn muộn thay vào một adapter mới, trống.</p>
<div class="out">$ node muon.mjs
0,2 s  client nối, server cho vào room user:7 · adapter = Adapter
0,4 s  phát vào user:7 ⇒ client nhận 1
4,0 s  docker start sio-redis
4,1 s  INFO Socket.IO Redis adapter attached
4,8 s  phát lại vào user:7 ⇒ client nhận thêm 0 · adapter.rooms.get('user:7') = undefined · socket.rooms vẫn nói ["user:7"] · client.connected = true</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "void attachRedisAdapter\\|io = new IOServer" src/socket/messaging.socket.ts ; grep -n "initSocketServer(server)\\|server.listen(config.port" src/index.ts
310: io = new IOServer(httpServer, {
330: void attachRedisAdapter(io);
751:initSocketServer(server);
994: server.listen(config.port, () =&gt; {
$ grep -n "maxmemory\\|condition: service_healthy" docker-compose.yml
91: command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes
203: condition: service_healthy
205: condition: service_healthy</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Ba kiểu Redis hỏng, đo THẬT trên container sio-redis. Hai worker (hai Server trong một tiến trình, một đồng hồ) gắn adapter ĐÚNG KIỂU KHO:</span>
<span class="tok-comment">// client gốc có reconnectStrategy (retries*50, trần 2 s) + listener 'error'; pub/sub = base.duplicate() (KHÔNG listener riêng, như kho).</span>
<span class="tok-comment">// A nối worker 1, B nối worker 2, cùng phòng r. Worker 1 phát tin số k mỗi 50 ms. Lúc 1 s: gây sự cố. Ghi: B nhận tin nào, trễ bao nhiêu.</span>
import { spawn } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const kieu = process.argv[2];
<span class="tok-comment">// Kho có process.on('unhandledRejection') ghi log rồi GIỮ tiến trình sống (src/index.ts:866). 'khong-bat' = ứng dụng thường, không có handler đó.</span>
let tuChoi = 0; const loaiTuChoi = new Set();
if (process.argv[3] !== 'khong-bat') process.on('unhandledRejection', (e) =&gt; { tuChoi++; loaiTuChoi.add(e?.constructor?.name); });
const t0 = Date.now(); const s = (ms = Date.now() - t0) =&gt; (ms / 1000).toFixed(1).replace('.', ',') + ' s';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const docker = (...a) =&gt; new Promise((ok) =&gt; spawn('/usr/local/bin/docker', a, { stdio: 'ignore' }).on('exit', ok));
let canhBao = 0; const goc = console.warn; console.warn = (...a) =&gt; { if (String(a[0]).includes("missing 'error' handler")) canhBao++; else goc(...a); };
const moi = async (cong) =&gt; {
  const base = createClient({ url: 'redis://127.0.0.1:19661', socket: { reconnectStrategy: (r) =&gt; Math.min(r * 50, 2000) } });
  base.on('error', () =&gt; {}); await base.connect();
  const pub = base.duplicate(), sub = base.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) }); io.on('connection', (x) =&gt; x.join('r'));
  return { io, pub };
};
const w1 = await moi(19741), w2 = await moi(19742);
const ket = (c) =&gt; ketNoi(&#96;http://localhost:\${c}&#96;, { transports: ['websocket'], forceNew: true });
const A = ket(19741), B = ket(19742);
await Promise.all([A, B].map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
const nhanA = new Set(), nhanB = new Map();
A.on('tin', (m) =&gt; nhanA.add(m.k)); B.on('tin', (m) =&gt; nhanB.set(m.k, Date.now() - m.t));
let k = 0; const gui = new Map();
const nhip = setInterval(() =&gt; { const t = Date.now(); gui.set(k, t); w1.io.to('r').emit('tin', { k: k++, t }); }, 50);
const SU_CO = { restart: ['docker restart sio-redis', 1000, () =&gt; docker('restart', '-t', '0', 'sio-redis'), 6000],
  pause: ['redis-cli CLIENT PAUSE 2000 ALL (Redis treo 2 s)', 1000, () =&gt; docker('exec', 'sio-redis', 'redis-cli', 'CLIENT', 'PAUSE', '2000', 'ALL'), 5000],
  stop: ['docker stop sio-redis … 10 s … docker start', 1000, async () =&gt; { await docker('stop', '-t', '0', 'sio-redis'); await cho(10000); await docker('start', 'sio-redis'); }, 17000] }[kieu];
await cho(SU_CO[1] - (Date.now() - t0));
console.log(&#96;\${s()}  ⚡ \${SU_CO[0]}&#96;);
const xong = SU_CO[2]();
const fsT = Date.now();
if (kieu !== 'restart') setTimeout(() =&gt; { const a = Date.now(); w1.io.in('r').fetchSockets().then((x) =&gt; console.log(&#96;\${s(a - t0)}  fetchSockets() gọi ở worker 1 ⇒ trả \${x.length} socket sau \${s(Date.now() - a)}&#96;), (e) =&gt; console.log(&#96;\${s(a - t0)}  fetchSockets() ⇒ lỗi sau \${s(Date.now() - a)}: \${e.message}&#96;)); }, kieu === 'stop' ? 2500 : 300);
const theo = setInterval(() =&gt; { if (!w1.pub.isReady &amp;&amp; !theo.daIn) { theo.daIn = true; console.log(&#96;\${s()}  pub.isReady = false&#96;); } if (w1.pub.isReady &amp;&amp; theo.daIn &amp;&amp; !theo.lai) { theo.lai = true; console.log(&#96;\${s()}  pub.isReady = true (nối lại)&#96;); } }, 20);
await xong; await cho(SU_CO[3] - (Date.now() - fsT));
clearInterval(nhip); await cho(2500); clearInterval(theo);
const mat = [...gui.keys()].filter((x) =&gt; !nhanB.has(x));
const tre = [...nhanB.values()].sort((a, b) =&gt; a - b);
const doan = []; for (const x of mat) { const d = doan.at(-1); if (d &amp;&amp; x === d[1] + 1) d[1] = x; else doan.push([x, x]); }
const vao = (x) =&gt; s(gui.get(x) - t0);
console.log(&#96;— \${kieu} · worker 1 phát \${gui.size} tin (mỗi 50 ms) —&#96;);
console.log(&#96;  A (cùng worker 1): nhận \${nhanA.size}/\${gui.size}&#96;);
console.log(&#96;  B (worker 2, qua Redis): nhận \${nhanB.size}/\${gui.size} · MẤT \${mat.length}\${doan.length ? ' — tin phát trong ' + doan.map(([a, b]) =&gt; &#96;\${vao(a)}–\${vao(b)}&#96;).join(', ') : ''}&#96;);
console.log(&#96;  độ trễ tới B: p50 \${tre[Math.floor(tre.length / 2)]} ms · lớn nhất \${tre.at(-1)} ms&#96;);
console.log(&#96;  console.warn "missing 'error' handler on this Redis client": \${canhBao} lần&#96;);
console.log(&#96;  unhandledRejection (PUBLISH đang bay bị huỷ, không ai .catch): \${tuChoi} lần \${[...loaiTuChoi].join(' ')} · tiến trình vẫn sống nhờ handler kiểu kho&#96;);
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Chép đúng thứ tự của kho: new Server(...) rồi &#96;void attachRedisAdapter(io)&#96; — getRedis() có reconnectStrategy nên KHÔNG BAO GIỜ ném.</span>
<span class="tok-comment">// Redis đang tắt lúc khởi động. Client nối vào, join room user:7. 4 s sau Redis lên ⇒ adapter gắn MUỘN. Rồi phát vào user:7.</span>
import { spawn } from 'node:child_process';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s';
const docker = (...a) =&gt; new Promise((ok) =&gt; spawn('/usr/local/bin/docker', a, { stdio: 'ignore' }).on('exit', ok));
async function getRedis() {
  const c = createClient({ url: 'redis://127.0.0.1:19661', socket: { reconnectStrategy: (r) =&gt; Math.min(r * 50, 2000) } });
  c.on('error', () =&gt; {}); await c.connect(); return c;
}
async function attachRedisAdapter(server) {
  try { const base = await getRedis(); const pub = base.duplicate(), sub = base.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
    server.adapter(createAdapter(pub, sub)); console.log(&#96;\${s()}  INFO Socket.IO Redis adapter attached&#96;);
  } catch (e) { console.log(&#96;\${s()}  WARN NOT attached: \${e.message}&#96;); }
}
await docker('stop', '-t', '0', 'sio-redis');
const io = new Server(19743);
io.on('connection', (x) =&gt; x.join('user:7'));
void attachRedisAdapter(io);
const c = ketNoi('http://localhost:19743', { transports: ['websocket'] }); let nhan = 0; c.on('tin', () =&gt; nhan++);
await new Promise((ok) =&gt; c.once('connect', ok));
console.log(&#96;\${s()}  client nối, server cho vào room user:7 · adapter = \${io.of('/').adapter.constructor.name}&#96;);
io.to('user:7').emit('tin'); await new Promise((ok) =&gt; setTimeout(ok, 200));
console.log(&#96;\${s()}  phát vào user:7 ⇒ client nhận \${nhan}&#96;);
await new Promise((ok) =&gt; setTimeout(ok, 3500)); await docker('start', 'sio-redis'); console.log(&#96;\${s()}  docker start sio-redis&#96;);
while (io.of('/').adapter.constructor.name !== 'RedisAdapter') await new Promise((ok) =&gt; setTimeout(ok, 100));
await new Promise((ok) =&gt; setTimeout(ok, 300));
const sk = [...io.of('/').sockets.values()][0];
io.to('user:7').emit('tin'); await new Promise((ok) =&gt; setTimeout(ok, 300));
console.log(&#96;\${s()}  phát lại vào user:7 ⇒ client nhận thêm \${nhan - 1} · adapter.rooms.get('user:7') = \${io.of('/').adapter.rooms.get('user:7')?.size ?? 'undefined'} · socket.rooms vẫn nói \${JSON.stringify([...sk.rooms].slice(1))} · client.connected = \${c.connected}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Vì sao không ai nghe thì tin mất</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-11-3-sentinel" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 11.3 — Sentinel: tự động chuyển đổi</span><span class="lc-sub">Khoảng chuyển đổi mà bài này chỉ trích tài liệu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-4-5-thu-thap-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 4.5 — Thật ra thì nên thu thập chỉ số nào</span><span class="lc-sub">Chỗ đặt tín hiệu sức khoẻ adapter</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Restart nhanh</span><span class="v">Redis bật lại; broadcast mất một chút rồi hồi.</span></div>
  <div class="kv"><span class="k">Chậm</span><span class="v">Redis còn sống nhưng chậm; broadcast trễ hoặc dồn hàng.</span></div>
  <div class="kv"><span class="k">Chết hoàn toàn</span><span class="v">Redis mất; broadcast qua worker dừng hẳn.</span></div>
  <div class="kv"><span class="k">Best-effort fallback</span><span class="v">In-memory adapter — ổn khi single-instance.</span></div>
  <div class="kv"><span class="k">Trạng thái adapter</span><span class="v">Tín hiệu cluster mode phải monitor để bắt suy giảm.</span></div>
  <div class="kv"><span class="k">Postgres adapter</span><span class="v">Một lựa chọn: chậm hơn 5-10ms, trần payload 8KB.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cả ba failure mode của Redis (restart nhanh, chậm, chết hoàn toàn) làm mất cluster broadcast một thời gian.</li><li>Kho này chọn best-effort fallback — in-memory adapter, ổn khi single-instance.</li><li>Cluster mode phải monitor trạng thái adapter để nhận ra suy giảm.</li><li>Postgres adapter là một lựa chọn: chậm hơn 5-10ms, payload 8KB.</li><li>Node cluster adapter là một cái khác, nhưng không scale qua VM.</li></ul>

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
${G05_4}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Scaling checklist: five things before adding a worker</h2>
<p class="lead">Adding a worker to a socket.io deployment goes wrong more often than it goes right. This checklist is the five things that must be true before you bring worker 2 online.</p>

<h3>Checklist</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sticky sessions at the proxy</span><span class="lz-d">Nginx <code>hash $cookie_io</code>. Without stickiness, polling breaks 50-75% of requests. Lesson 2.3. <strong>Measured in 2.3: <code>hash $cookie_io</code> itself breaks</strong> — the first handshake has no cookie, so nginx hashes an empty key (3 of 5 sessions got 400). Use <code>ip_hash</code>, or WebSocket-only clients.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Redis adapter attached</span><span class="lz-d">Check for the &quot;Redis adapter attached&quot; log line. If it says &quot;NOT attached&quot;, cluster fanout is gone. Lesson 5.1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">State keyed by userId, not sid</span><span class="lz-d">With reconnects and a cluster, the sid changes and the socket may land on a different worker. Cache state by userId (Redis-backed). Lessons 1.5 and 4.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Monitoring per-worker</span><span class="lz-d">Metrics <code>socket.io.connected_count</code> per worker. An imbalance means stickiness is burying someone. Track it on a Grafana dashboard.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Graceful shutdown</span><span class="lz-d">A worker about to restart: <code>io.close()</code> before exiting, so sockets disconnect cleanly (the client sees <code>&quot;io server disconnect&quot;</code> vs <code>&quot;transport close&quot;</code>). Lesson 1.2. <strong>Measured:</strong> after <code>io.close()</code> the client sees <code>&quot;transport close&quot;</code> and reconnects at once — which is what a rolling deploy needs; <code>&quot;io server disconnect&quot;</code> would stop auto-reconnect.</span></div>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the five-item checklist in order — sticky sessions, Redis adapter attached, state keyed by userId, per-worker metrics, graceful shutdown — and tick each against a sample service.</li>
<li>Remove one item (say, skip stickiness) and predict the specific bug it causes at medium scale.</li>
<li>Add per-worker metrics (connection count, event rate) so you can see imbalance across workers.</li>
</ol>
<p><strong>Done when:</strong> you can recite the five items in order and name the failure each one prevents.</p></div>

<h3>🔬 Measured: item 5 and item 4</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — a server process with 20 WebSocket clients gets SIGTERM like <code>docker stop</code>, then SIGKILL after docker&#39;s default 10 s. First this repo&#39;s handler (src/index.ts: <code>server.close(cb)</code> + a 30 s timer, no <code>io.close()</code>), then <code>io.close()</code> first:</p>
<div class="out">$ node tat.mjs cha kho
— chép src/index.ts: server.close(cb), không io.close() —
1,10 s ⚡ docker stop ⇒ SIGTERM
  [server] SIGTERM · 20 client đang nối
3,10 s client 0 hỏi ping-app trong lúc chờ ⇒ pong
11,10 s ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL
11,11 s tiến trình server kết thúc · code null · signal SIGKILL
  client: ngắt lần đầu lúc 11,11 s · lý do {"transport close":20} · sau đó 20/20 đang tự nối lại
$ node tat.mjs cha dung
— io.close() trước —
1,11 s ⚡ docker stop ⇒ SIGTERM
  [server] SIGTERM · 20 client đang nối
  [server] io.close xong sau 4 ms ⇒ exit(0)
3,61 s client 0 hỏi ping-app trong lúc chờ ⇒ lỗi: operation has timed out
1,11 s tiến trình server kết thúc · code 0 · signal null
  client: ngắt lần đầu lúc 1,11 s · lý do {"transport close":20} · sau đó 20/20 đang tự nối lại</div>
<p><code>server.close()</code> waits for every open connection, and a WebSocket never ends on its own — so the callback never fired; the backend service in docker-compose has no <code>stop_grace_period</code> (only nginx does), so SIGKILL at 10 s always beats the repo&#39;s 30 s timer.</p>
<p><strong>A rolling restart with sticky clients</strong> — only a per-worker gauge sees it:</p>
<div class="out">$ node lech.mjs
đầu ngày                           socket_io_connected w1=100 w2=100 w3=100 · max/min = 1,0
worker 2 đang deploy (tắt)         socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞
worker 2 lên lại                   socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞
5 s sau                            socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "upstream backend" -A3 nginx/nginx.conf
128: upstream backend {
129- server cuonghoangdev_backend:3001;
130- keepalive 32;
131- }
$ grep -n "io.close\\|stop_grace_period\\|clientsCount\\|prom-client" -r src docker-compose.yml package.json | grep -v test
410: stop_grace_period: 30s
0
$ grep -n "server.close(async\\|30_000\\|process.on('SIGTERM'" src/index.ts
822: server.close(async () =&gt; {
846: }, 30_000);
849: process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Graceful shutdown, đo THẬT. Tiến trình con = server Socket.IO, 20 client WebSocket nối vào. Lúc 1 s gửi SIGTERM như &#96;docker stop&#96;;</span>
<span class="tok-comment">// docker mặc định chờ 10 s rồi SIGKILL (compose của kho không đặt stop_grace_period cho backend).</span>
<span class="tok-comment">// kieu 'kho' = chép src/index.ts: server.close(cb) + hẹn 30 s exit(1), KHÔNG io.close(). kieu 'dung' = io.close() trước.</span>
import { fork } from 'node:child_process';
import http from 'node:http';
import { Server } from 'socket.io';
const [, , vai, kieu] = process.argv;
if (vai === 'con') {
  const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
  const server = http.createServer(); const io = new Server(server);
  io.on('connection', (x) =&gt; x.on('ping-app', (cb) =&gt; cb('pong')));
  server.listen(19751, () =&gt; process.send('san-sang'));
  process.on('SIGTERM', () =&gt; {
    console.log(&#96;  [server] SIGTERM · \${io.engine.clientsCount} client đang nối&#96;);
    const t = Date.now();
    if (kieu === 'dung') io.close(() =&gt; { console.log(&#96;  [server] io.close xong sau \${Date.now() - t} ms ⇒ exit(0)&#96;); process.exit(0); });
    else server.close(() =&gt; { console.log(&#96;  [server] HTTP server closed sau \${Date.now() - t} ms ⇒ exit(0)&#96;); process.exit(0); });
    setTimeout(() =&gt; { console.log('  [server] Could not close connections in time ⇒ exit(1)'); process.exit(1); }, 30_000);
  });
} else {
  const { io: ketNoi } = await import('socket.io-client');
  const t0 = Date.now(); const s = (ms = Date.now() - t0) =&gt; (ms / 1000).toFixed(2).replace('.', ',') + ' s';
  const con = fork(new URL(import.meta.url).pathname, ['con', kieu], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
  await new Promise((ok) =&gt; con.once('message', ok));
  const ds = Array.from({ length: 20 }, () =&gt; ketNoi('http://localhost:19751', { transports: ['websocket'], forceNew: true, reconnectionDelayMax: 1000 }));
  await Promise.all(ds.map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok))));
  const ly = new Map(); let lucDau = null;
  ds.forEach((c) =&gt; c.on('disconnect', (r) =&gt; { lucDau ??= Date.now() - t0; ly.set(r, (ly.get(r) ?? 0) + 1); }));
  let ketThuc = null; con.on('exit', (code, sig) =&gt; { ketThuc = &#96;\${s()} tiến trình server kết thúc · code \${code} · signal \${sig}&#96;; });
  console.log(&#96;— \${kieu === 'dung' ? 'io.close() trước' : 'chép src/index.ts: server.close(cb), không io.close()'} —&#96;);
  setTimeout(() =&gt; { console.log(&#96;\${s()} ⚡ docker stop ⇒ SIGTERM&#96;); con.kill('SIGTERM'); }, 1000);
  setTimeout(async () =&gt; { const r = await ds[0].timeout(500).emitWithAck('ping-app').catch((e) =&gt; 'lỗi: ' + e.message); console.log(&#96;\${s()} client 0 hỏi ping-app trong lúc chờ ⇒ \${r}&#96;); }, 3000);
  setTimeout(() =&gt; { if (con.exitCode === null) { console.log(&#96;\${s()} ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL&#96;); con.kill('SIGKILL'); } }, 11000);
  await new Promise((ok) =&gt; setTimeout(ok, 12500));
  console.log(ketThuc);
  console.log(&#96;  client: ngắt lần đầu lúc \${lucDau === null ? '—' : s(lucDau)} · lý do \${JSON.stringify(Object.fromEntries(ly))} · sau đó \${ds.filter((c) =&gt; c.active).length}/20 đang tự nối lại&#96;);
  ds.forEach((c) =&gt; c.close()); process.exit(0);
}</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-9-1-khoi-upstream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 9.1 — The upstream block and four ways to pick a server</span><span class="lc-sub">ip_hash for item 1</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy VPS · 3.2 — Shutting down politely, and the drain step I got wrong</span><span class="lc-sub">Item 5 from the deploy side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-4-5-thu-thap-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 4.5 — Which metrics to actually collect</span><span class="lc-sub">Item 4: per-worker gauges</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sticky sessions</span><span class="v">Pin a client to one worker so the polling handshake completes.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Cross-worker broadcast — required before a second worker.</span></div>
  <div class="kv"><span class="k">userId-keyed state</span><span class="v">State that survives reconnect and is worker-independent.</span></div>
  <div class="kv"><span class="k">Per-worker metrics</span><span class="v">Connection and event counts per worker to spot imbalance.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">Draining a worker's sockets before it exits on deploy.</span></div>
  <div class="kv"><span class="k">Silent bug</span><span class="v">A missed item that works in dev and breaks only at scale.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Before going from 1 worker to N, five things must be done in order.</li><li>Sticky sessions, then the Redis adapter attached.</li><li>Then state keyed by userId, then per-worker metrics, then graceful shutdown.</li><li>Order matters — each depends on the ones before it.</li><li>Miss any one and you get silent bugs at medium scale and a crisis at large scale.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes — checklist chính thức, phần này diễn giải cho use case kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — Observability</span><span class="lc-sub">/courses/observability-monitoring/learn${REF} — cách monitor metrics ở trên.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Checklist scale: năm việc trước khi thêm worker</h2>
<p class="lead">Thêm worker vào deployment socket.io hỏng thường hơn thành công. Checklist này là năm việc phải đúng trước khi bạn đưa worker 2 online.</p>

<h3>Checklist</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sticky sessions ở proxy</span><span class="lz-d">Nginx <code>hash $cookie_io</code>. Không sticky = polling break 50-75% requests. Bài 2.3. <strong>Bài 2.3 đã đo: chính <code>hash $cookie_io</code> hỏng</strong> — lần bắt tay đầu chưa có cookie nên nginx băm khoá rỗng (3/5 phiên bị 400). Dùng <code>ip_hash</code>, hoặc client chỉ WebSocket.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Redis adapter attached</span><span class="lz-d">Kiểm log &quot;Redis adapter attached&quot;. Nếu &quot;NOT attached&quot;, cluster fanout mất. Bài 5.1.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">State theo userId, không sid</span><span class="lz-d">Với reconnect + cluster, sid đổi và socket có thể ở worker khác. State cache theo userId (Redis-backed). Bài 1.5 + 4.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Monitoring per-worker</span><span class="lz-d">Metrics <code>socket.io.connected_count</code> per worker. Không cân bằng = sticky đang chôn ai đó. Grafana dashboard track.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Graceful shutdown</span><span class="lz-d">Worker sắp restart: <code>io.close()</code> trước exit, cho socket disconnect sạch (client thấy <code>&quot;io server disconnect&quot;</code> vs <code>&quot;transport close&quot;</code>). Bài 1.2. <strong>Đo thật:</strong> sau <code>io.close()</code> client thấy <code>&quot;transport close&quot;</code> và tự nối lại ngay — đúng thứ deploy cuốn chiếu cần; <code>&quot;io server disconnect&quot;</code> mới là lý do làm client ngừng tự nối lại.</span></div>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết checklist năm mục theo thứ tự — sticky sessions, Redis adapter attached, state theo userId, per-worker metrics, graceful shutdown — và tick từng cái với một service mẫu.</li>
<li>Bỏ một mục (ví dụ bỏ sticky) và đoán đúng bug cụ thể nó gây ra ở scale trung bình.</li>
<li>Thêm per-worker metrics (số connection, event rate) để bạn thấy mất cân bằng giữa các worker.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được năm mục theo thứ tự và gọi tên kiểu hỏng mà mỗi cái ngăn.</p></div>

<h3>🔬 Đo thật: mục 5 và mục 4</h3>
<p>socket.io 4.8.3 · Node 22.23.3 — một tiến trình server với 20 client WebSocket nhận SIGTERM như <code>docker stop</code>, rồi SIGKILL sau 10 s mặc định của docker. Trước là handler của kho (src/index.ts: <code>server.close(cb)</code> + hẹn 30 s, không <code>io.close()</code>), sau là gọi <code>io.close()</code> trước:</p>
<div class="out">$ node tat.mjs cha kho
— chép src/index.ts: server.close(cb), không io.close() —
1,10 s ⚡ docker stop ⇒ SIGTERM
  [server] SIGTERM · 20 client đang nối
3,10 s client 0 hỏi ping-app trong lúc chờ ⇒ pong
11,10 s ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL
11,11 s tiến trình server kết thúc · code null · signal SIGKILL
  client: ngắt lần đầu lúc 11,11 s · lý do {"transport close":20} · sau đó 20/20 đang tự nối lại
$ node tat.mjs cha dung
— io.close() trước —
1,11 s ⚡ docker stop ⇒ SIGTERM
  [server] SIGTERM · 20 client đang nối
  [server] io.close xong sau 4 ms ⇒ exit(0)
3,61 s client 0 hỏi ping-app trong lúc chờ ⇒ lỗi: operation has timed out
1,11 s tiến trình server kết thúc · code 0 · signal null
  client: ngắt lần đầu lúc 1,11 s · lý do {"transport close":20} · sau đó 20/20 đang tự nối lại</div>
<p><code>server.close()</code> chờ mọi kết nối đang mở, mà WebSocket không tự kết thúc — nên callback không bao giờ chạy; service backend trong docker-compose không có <code>stop_grace_period</code> (chỉ nginx có), nên SIGKILL ở giây 10 luôn tới trước hẹn 30 s của kho.</p>
<p><strong>Khởi động lại cuốn chiếu với client sticky</strong> — chỉ số liệu từng worker mới thấy:</p>
<div class="out">$ node lech.mjs
đầu ngày                           socket_io_connected w1=100 w2=100 w3=100 · max/min = 1,0
worker 2 đang deploy (tắt)         socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞
worker 2 lên lại                   socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞
5 s sau                            socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "upstream backend" -A3 nginx/nginx.conf
128: upstream backend {
129- server cuonghoangdev_backend:3001;
130- keepalive 32;
131- }
$ grep -n "io.close\\|stop_grace_period\\|clientsCount\\|prom-client" -r src docker-compose.yml package.json | grep -v test
410: stop_grace_period: 30s
0
$ grep -n "server.close(async\\|30_000\\|process.on('SIGTERM'" src/index.ts
822: server.close(async () =&gt; {
846: }, 30_000);
849: process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Graceful shutdown, đo THẬT. Tiến trình con = server Socket.IO, 20 client WebSocket nối vào. Lúc 1 s gửi SIGTERM như &#96;docker stop&#96;;</span>
<span class="tok-comment">// docker mặc định chờ 10 s rồi SIGKILL (compose của kho không đặt stop_grace_period cho backend).</span>
<span class="tok-comment">// kieu 'kho' = chép src/index.ts: server.close(cb) + hẹn 30 s exit(1), KHÔNG io.close(). kieu 'dung' = io.close() trước.</span>
import { fork } from 'node:child_process';
import http from 'node:http';
import { Server } from 'socket.io';
const [, , vai, kieu] = process.argv;
if (vai === 'con') {
  const t0 = Date.now(); const s = () =&gt; ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';
  const server = http.createServer(); const io = new Server(server);
  io.on('connection', (x) =&gt; x.on('ping-app', (cb) =&gt; cb('pong')));
  server.listen(19751, () =&gt; process.send('san-sang'));
  process.on('SIGTERM', () =&gt; {
    console.log(&#96;  [server] SIGTERM · \${io.engine.clientsCount} client đang nối&#96;);
    const t = Date.now();
    if (kieu === 'dung') io.close(() =&gt; { console.log(&#96;  [server] io.close xong sau \${Date.now() - t} ms ⇒ exit(0)&#96;); process.exit(0); });
    else server.close(() =&gt; { console.log(&#96;  [server] HTTP server closed sau \${Date.now() - t} ms ⇒ exit(0)&#96;); process.exit(0); });
    setTimeout(() =&gt; { console.log('  [server] Could not close connections in time ⇒ exit(1)'); process.exit(1); }, 30_000);
  });
} else {
  const { io: ketNoi } = await import('socket.io-client');
  const t0 = Date.now(); const s = (ms = Date.now() - t0) =&gt; (ms / 1000).toFixed(2).replace('.', ',') + ' s';
  const con = fork(new URL(import.meta.url).pathname, ['con', kieu], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
  await new Promise((ok) =&gt; con.once('message', ok));
  const ds = Array.from({ length: 20 }, () =&gt; ketNoi('http://localhost:19751', { transports: ['websocket'], forceNew: true, reconnectionDelayMax: 1000 }));
  await Promise.all(ds.map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok))));
  const ly = new Map(); let lucDau = null;
  ds.forEach((c) =&gt; c.on('disconnect', (r) =&gt; { lucDau ??= Date.now() - t0; ly.set(r, (ly.get(r) ?? 0) + 1); }));
  let ketThuc = null; con.on('exit', (code, sig) =&gt; { ketThuc = &#96;\${s()} tiến trình server kết thúc · code \${code} · signal \${sig}&#96;; });
  console.log(&#96;— \${kieu === 'dung' ? 'io.close() trước' : 'chép src/index.ts: server.close(cb), không io.close()'} —&#96;);
  setTimeout(() =&gt; { console.log(&#96;\${s()} ⚡ docker stop ⇒ SIGTERM&#96;); con.kill('SIGTERM'); }, 1000);
  setTimeout(async () =&gt; { const r = await ds[0].timeout(500).emitWithAck('ping-app').catch((e) =&gt; 'lỗi: ' + e.message); console.log(&#96;\${s()} client 0 hỏi ping-app trong lúc chờ ⇒ \${r}&#96;); }, 3000);
  setTimeout(() =&gt; { if (con.exitCode === null) { console.log(&#96;\${s()} ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL&#96;); con.kill('SIGKILL'); } }, 11000);
  await new Promise((ok) =&gt; setTimeout(ok, 12500));
  console.log(ketThuc);
  console.log(&#96;  client: ngắt lần đầu lúc \${lucDau === null ? '—' : s(lucDau)} · lý do \${JSON.stringify(Object.fromEntries(ly))} · sau đó \${ds.filter((c) =&gt; c.active).length}/20 đang tự nối lại&#96;);
  ds.forEach((c) =&gt; c.close()); process.exit(0);
}</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-9-1-khoi-upstream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 9.1 — Khối upstream và bốn cách chọn máy</span><span class="lc-sub">ip_hash cho mục 1</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy VPS · 3.2 — Tắt tử tế, và cái bước xả tôi viết sai</span><span class="lc-sub">Mục 5 nhìn từ phía deploy</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-4-5-thu-thap-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 4.5 — Thật ra thì nên thu thập chỉ số nào</span><span class="lc-sub">Mục 4: số liệu từng worker</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sticky sessions</span><span class="v">Ghim một client vào một worker để polling handshake hoàn tất.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Broadcast qua worker — bắt buộc trước khi có worker thứ hai.</span></div>
  <div class="kv"><span class="k">State theo userId</span><span class="v">State sống sót qua reconnect và độc lập với worker.</span></div>
  <div class="kv"><span class="k">Per-worker metrics</span><span class="v">Số connection và event mỗi worker để phát hiện mất cân bằng.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">Rút socket của một worker trước khi nó thoát lúc deploy.</span></div>
  <div class="kv"><span class="k">Bug âm thầm</span><span class="v">Một mục bị lỡ, chạy được ở dev và chỉ vỡ ở scale.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Trước khi từ 1 worker lên N, năm việc phải xong theo thứ tự.</li><li>Sticky sessions, rồi Redis adapter attached.</li><li>Rồi state theo userId, rồi per-worker metrics, rồi graceful shutdown.</li><li>Thứ tự quan trọng — mỗi cái phụ thuộc cái trước.</li><li>Thiếu bất cứ cái nào cũng tạo bug âm thầm ở scale trung bình và crisis ở scale lớn.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Using multiple nodes</span><span class="lc-sub">socket.io/docs/v4/using-multiple-nodes — checklist chính thức, phần này diễn giải cho use case kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — Observability</span><span class="lc-sub">/courses/observability-monitoring/learn${REF} — cách monitor metrics ở trên.</span></span></div>
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
${G05_5}
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
  cluster.setupPrimary({ serialization: 'advanced' });  // ⚠ MEASURED: required by the README — without it clients loop on "xhr poll error"
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

<p><strong>Measured (13/11/2026, one Mac, Redis 7.4 and Postgres 16 in Docker, no query load):</strong> the same bench — A sends from worker 1, B receives on worker 2, 1,000 times — gave cross-worker p50 / p99 of <strong>0.24 / 0.71 ms</strong> for the cluster adapter, <strong>0.84 / 2.16 ms</strong> for Redis and <strong>0.98 / 2.64 ms</strong> for Postgres. An idle Postgres is not &quot;5-10 ms slower&quot;; the real Postgres costs are elsewhere: two workers held <strong>5</strong> Postgres connections (one a permanent <code>LISTEN &quot;socket.io#/&quot;</code>), and the attachments table is <strong>not</strong> created by the adapter — a 10 KB message sent before <code>CREATE TABLE socket_io_attachments …</code> was <strong>lost with nothing logged</strong>. Two official options this page does not list: <code>@socket.io/redis-streams-adapter</code> (a Redis stream instead of pub/sub, so a short outage can be caught up) and <code>createShardedAdapter</code> for Redis 7 sharded pub/sub — neither measured here.</p>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>For four scenarios — one process, all workers on one machine, a second machine, modest traffic wanting simplicity — pick the right adapter (in-memory, cluster, redis, postgres).</li>
<li>Swap one adapter for another and confirm it is a one-line change, so the decision is only &quot;what is true today&quot;.</li>
<li>Note that in-memory is the silent default — reason about the bug it causes the first time you add a second process.</li>
</ol>
<p><strong>Done when:</strong> you can match each of the four adapters to its one selecting condition.</p></div>

<h3>🔬 Measured: one bench, three adapters</h3>
<p>socket.io 4.8.3 · @socket.io/cluster-adapter 0.3.0 · @socket.io/sticky 2.0.1 · @socket.io/redis-adapter 8.3.0 · @socket.io/postgres-adapter 0.5.0:</p>
<div class="out">$ node do55.mjs cluster
cluster   A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,24 ms · p99 0,71 ms
$ node do55.mjs redis
redis     A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,84 ms · p99 2,16 ms
$ node do55.mjs postgres
postgres  A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,98 ms · p99 2,64 ms</div>
<p><strong>The forgotten line</strong> of the cluster-adapter setup:</p>
<div class="out">$ node thieu.mjs
thiếu: connect_error "xhr poll error" × 3 — không bao giờ nối được
$ node thieu.mjs du
du: connect ✓ (websocket)</div>
<p><strong>Postgres adapter</strong> — connections, and a 10 KB message before and after creating the table:</p>
<div class="out">$ node lon.mjs
kết nối Postgres của 2 worker: 5 · LISTEN "socket.io#/" | SELECT pg_notify($1, $2)
phát 1 KB từ worker 1 ⇒ B ở worker 2 nhận: 1000 ký tự
phát 10 KB, chưa có bảng từ worker 1 ⇒ B ở worker 2 nhận: KHÔNG
tạo bảng rồi phát 10 KB ⇒ B nhận: 10000 ký tự · số dòng trong socket_io_attachments: 1</div>
<p><strong>Swapping by one environment variable</strong>, logging configured and actual:</p>
<div class="out">$ node doi.mjs
{"msg":"[socket] adapter","configured":"memory","actual":"Adapter"}
$ SOCKET_ADAPTER=redis REDIS_URL=redis://127.0.0.1:19661 node doi.mjs
{"msg":"[socket] adapter","configured":"redis","actual":"RedisAdapter"}
$ SOCKET_ADAPTER=postgres DATABASE_URL=postgres://postgres:lab@127.0.0.1:19660/postgres node doi.mjs
{"msg":"[socket] adapter","configured":"postgres","actual":"PostgresAdapter"}
$ SOCKET_ADAPTER=redis REDIS_URL=redis://127.0.0.1:19699 node doi.mjs   # REDIS_URL gõ nhầm cổng
{"msg":"[socket] adapter","configured":"redis","actual":"Adapter"}</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// MỘT phép đo cho mọi adapter: A nối worker 1, B nối worker 2 (cùng phòng r). A gửi 'phat' kèm giờ gửi; worker 1 io.to('r').emit('tin');</span>
<span class="tok-comment">// B nhận — A và B cùng một tiến trình nên dùng chung đồng hồ. 1.000 lượt nối tiếp. che = memory (một server) | cluster | redis | postgres.</span>
import cluster from 'node:cluster';
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const che = process.argv[2];
const CONG = 19761;
async function lamServer(cong, so) {
  let opts = {};
  if (che === 'redis') { const { createAdapter } = await import('@socket.io/redis-adapter'); const { createClient } = await import('redis');
    const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate(); await Promise.all([pub.connect(), sub.connect()]); opts.adapter = createAdapter(pub, sub); }
  if (che === 'postgres') { const { createAdapter } = await import('@socket.io/postgres-adapter'); const pg = (await import('pg')).default;
    opts.adapter = createAdapter(new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' })); }
  if (che === 'cluster') { const { createAdapter } = await import('@socket.io/cluster-adapter'); opts.adapter = createAdapter(); }
  const srv = http.createServer(); const io = new Server(srv, opts);
  if (che === 'cluster') { const { setupWorker } = await import('@socket.io/sticky'); setupWorker(io); } else srv.listen(cong);
  io.on('connection', (s) =&gt; { s.join('r'); s.emit('ban-la', so); s.on('phat', (t) =&gt; io.to('r').emit('tin', t)); });
  return io;
}
const t0 = performance.timeOrigin;
async function do1000(cong1, cong2) {
  const ket = (cong) =&gt; ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true });
  let A, B, wA, wB;
  for (;;) { A ??= ket(cong1); wA ??= await new Promise((ok) =&gt; A.once('ban-la', ok));
    const c = ket(cong2); const w = await new Promise((ok) =&gt; c.once('ban-la', ok)); if (w !== wA) { B = c; wB = w; break; } c.close(); }
  await new Promise((ok) =&gt; setTimeout(ok, 500));
  const d = []; let nhan = 0;
  for (let k = 0; k &lt; 1000; k++) { const p = new Promise((ok) =&gt; B.once('tin', (t) =&gt; { nhan++; d.push(performance.now() - t); ok(); })); A.emit('phat', performance.now()); await p; }
  d.sort((a, b) =&gt; a - b); const f = (x) =&gt; x.toFixed(2).replace('.', ',');
  console.log(&#96;\${che.padEnd(9)} A ở worker \${wA}, B ở worker \${wB} · B nhận \${nhan}/1000 · p50 \${f(d[500])} ms · p99 \${f(d[990])} ms&#96;);
}
if (che === 'cluster') {
  if (cluster.isPrimary) {
    const { setupMaster } = await import('@socket.io/sticky'); const { setupPrimary } = await import('@socket.io/cluster-adapter');
    const srv = http.createServer(); setupMaster(srv, { loadBalancingMethod: 'least-connection' }); setupPrimary(); srv.listen(CONG);
    cluster.setupPrimary({ serialization: 'advanced' });         <span class="tok-comment">  // README: giữ Buffer nguyên vẹn qua IPC</span>
    const ws = [cluster.fork({ SO: 1 }), cluster.fork({ SO: 2 })];
    await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('online', ok)))); await new Promise((ok) =&gt; setTimeout(ok, 800));
    await do1000(CONG, CONG); ws.forEach((w) =&gt; w.kill()); process.exit(0);
  } else await lamServer(CONG, +process.env.SO);
} else if (che === 'memory') { await lamServer(CONG, 1); await do1000(CONG, CONG).catch(() =&gt; {}); process.exit(0); }
else if (process.argv[3] === 'worker') { await lamServer(+process.argv[4], +process.argv[5]); process.send('san-sang'); }
else {
  const { fork } = await import('node:child_process');
  const ws = [1, 2].map((so) =&gt; fork(new URL(import.meta.url).pathname, [che, 'worker', CONG + so, so]));
  await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
  await do1000(CONG + 1, CONG + 2); ws.forEach((w) =&gt; w.kill()); process.exit(0);
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Postgres adapter: NOTIFY chỉ chở được &lt; 8000 byte. Tin 10 KB thì sao? Lượt 1: chưa tạo bảng socket_io_attachments. Lượt 2: tạo bảng rồi phát lại.</span>
<span class="tok-comment">// Đếm thêm: adapter giữ bao nhiêu kết nối Postgres, và đang LISTEN kênh nào.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/postgres-adapter';
import pg from 'pg';
const URL_PG = 'postgres://postgres:lab@127.0.0.1:19660/postgres';
const q = new pg.Client(URL_PG); await q.connect(); await q.query('DROP TABLE IF EXISTS socket_io_attachments');
process.on('unhandledRejection', (e) =&gt; console.log(&#96;  unhandledRejection: \${e.message}&#96;));
const moi = (cong) =&gt; { const io = new Server(cong, { adapter: createAdapter(new pg.Pool({ connectionString: URL_PG }), { errorHandler: (e) =&gt; console.log(&#96;  errorHandler: \${e.message}&#96;) }) }); io.on('connection', (s) =&gt; s.join('r')); return io; };
const w1 = moi(19763), w2 = moi(19764);
const B = ketNoi('http://localhost:19764', { transports: ['websocket'] }); let nhan = [];
B.on('tin', (x) =&gt; nhan.push(x.length));
await new Promise((ok) =&gt; B.once('connect', ok)); await new Promise((ok) =&gt; setTimeout(ok, 800));
const r = await q.query("SELECT count(*)::int AS n, string_agg(DISTINCT left(query, 40), ' | ') AS q FROM pg_stat_activity WHERE datname = 'postgres' AND pid &lt;&gt; pg_backend_pid()");
console.log(&#96;kết nối Postgres của 2 worker: \${r.rows[0].n} · \${r.rows[0].q}&#96;);
for (const [ten, kt] of [['1 KB', 1000], ['10 KB, chưa có bảng', 10000]]) {
  nhan = []; w1.to('r').emit('tin', 'x'.repeat(kt)); await new Promise((ok) =&gt; setTimeout(ok, 800));
  console.log(&#96;phát \${ten} từ worker 1 ⇒ B ở worker 2 nhận: \${nhan.length ? nhan[0] + ' ký tự' : 'KHÔNG'}&#96;);
}
await q.query('CREATE TABLE socket_io_attachments (id bigserial UNIQUE, created_at timestamptz DEFAULT NOW(), payload bytea)');
nhan = []; w1.to('r').emit('tin', 'x'.repeat(10000)); await new Promise((ok) =&gt; setTimeout(ok, 800));
console.log(&#96;tạo bảng rồi phát 10 KB ⇒ B nhận: \${nhan.length ? nhan[0] + ' ký tự' : 'KHÔNG'} · số dòng trong socket_io_attachments: \${(await q.query('SELECT count(*)::int AS n FROM socket_io_attachments')).rows[0].n}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-4-cluster-mo-rong" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.4 — Scaling out: 3.4× for CPU work, 1.06× for I/O work</span><span class="lc-sub">node:cluster, the base of the cluster adapter</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.2 — Stream: the log that remembers</span><span class="lc-sub">The base of the streams adapter</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Choosing: Pub/Sub, Stream, list or a real broker</span><span class="lc-sub">The same decision one layer down</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">in-memory adapter</span><span class="v">The silent default; correct only with a single process.</span></div>
  <div class="kv"><span class="k">cluster-adapter</span><span class="v">All workers on one machine under <code>node:cluster</code>; pairs with <code>@socket.io/sticky</code>.</span></div>
  <div class="kv"><span class="k">redis-adapter</span><span class="v">Needed once there is a second machine, or you already run Redis.</span></div>
  <div class="kv"><span class="k">postgres-adapter</span><span class="v">Modest realtime traffic where operational simplicity beats milliseconds.</span></div>
  <div class="kv"><span class="k">One-line swap</span><span class="v">Changing adapters is a single line, so the choice is reversible.</span></div>
  <div class="kv"><span class="k">Selecting condition</span><span class="v">Each adapter is chosen by one fact about your deployment today.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Four adapters exist, each selected by one condition.</li><li>in-memory for a single real process (dangerous only as the silent default).</li><li>cluster-adapter when every worker is on one machine under <code>node:cluster</code>.</li><li>redis-adapter once there is a second machine; postgres-adapter when simplicity beats milliseconds.</li><li>Swapping is a one-line change, so the real decision is only &quot;what is true today&quot;.</li></ul>

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
  cluster.setupPrimary({ serialization: 'advanced' });  // ⚠ ĐO THẬT: README bắt buộc — thiếu dòng này client báo "xhr poll error" mãi
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

<p><strong>Đo thật (13/11/2026, một máy Mac, Redis 7.4 và Postgres 16 trong Docker, không tải truy vấn):</strong> cùng một bàn đo — A gửi từ worker 1, B nhận ở worker 2, 1.000 lượt — cho p50 / p99 qua worker là <strong>0,24 / 0,71 ms</strong> với cluster adapter, <strong>0,84 / 2,16 ms</strong> với Redis và <strong>0,98 / 2,64 ms</strong> với Postgres. Postgres lúc rảnh không &quot;chậm hơn 5-10 ms&quot;; cái giá thật của Postgres nằm chỗ khác: hai worker giữ <strong>5</strong> kết nối Postgres (một cái <code>LISTEN &quot;socket.io#/&quot;</code> thường trực), và adapter <strong>không</strong> tự tạo bảng attachments — tin 10 KB gửi trước khi <code>CREATE TABLE socket_io_attachments …</code> <strong>mất mà không có dòng log nào</strong>. Hai lựa chọn chính thức trang này chưa liệt kê: <code>@socket.io/redis-streams-adapter</code> (Redis stream thay pub/sub, Redis gián đoạn ngắn có thể đọc bù) và <code>createShardedAdapter</code> cho sharded pub/sub của Redis 7 — cả hai chưa đo ở đây.</p>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Với bốn kịch bản — một tiến trình, mọi worker trên một máy, một máy thứ hai, traffic khiêm tốn muốn đơn giản — chọn đúng adapter (in-memory, cluster, redis, postgres).</li>
<li>Tráo một adapter sang cái khác và xác nhận đó là một thay đổi một dòng, nên quyết định chỉ là &quot;hôm nay điều gì đang đúng&quot;.</li>
<li>Để ý in-memory là mặc định im lặng — lập luận về bug nó gây ra lần đầu bạn thêm một tiến trình thứ hai.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn khớp được mỗi trong bốn adapter với điều kiện chọn duy nhất của nó.</p></div>

<h3>🔬 Đo thật: một bàn đo, ba adapter</h3>
<p>socket.io 4.8.3 · @socket.io/cluster-adapter 0.3.0 · @socket.io/sticky 2.0.1 · @socket.io/redis-adapter 8.3.0 · @socket.io/postgres-adapter 0.5.0:</p>
<div class="out">$ node do55.mjs cluster
cluster   A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,24 ms · p99 0,71 ms
$ node do55.mjs redis
redis     A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,84 ms · p99 2,16 ms
$ node do55.mjs postgres
postgres  A ở worker 1, B ở worker 2 · B nhận 1000/1000 · p50 0,98 ms · p99 2,64 ms</div>
<p><strong>Dòng hay bị quên</strong> khi dựng cluster-adapter:</p>
<div class="out">$ node thieu.mjs
thiếu: connect_error "xhr poll error" × 3 — không bao giờ nối được
$ node thieu.mjs du
du: connect ✓ (websocket)</div>
<p><strong>Postgres adapter</strong> — số kết nối, và tin 10 KB trước/sau khi tạo bảng:</p>
<div class="out">$ node lon.mjs
kết nối Postgres của 2 worker: 5 · LISTEN "socket.io#/" | SELECT pg_notify($1, $2)
phát 1 KB từ worker 1 ⇒ B ở worker 2 nhận: 1000 ký tự
phát 10 KB, chưa có bảng từ worker 1 ⇒ B ở worker 2 nhận: KHÔNG
tạo bảng rồi phát 10 KB ⇒ B nhận: 10000 ký tự · số dòng trong socket_io_attachments: 1</div>
<p><strong>Tráo bằng một biến môi trường</strong>, log cả định dùng lẫn thật sự chạy:</p>
<div class="out">$ node doi.mjs
{"msg":"[socket] adapter","configured":"memory","actual":"Adapter"}
$ SOCKET_ADAPTER=redis REDIS_URL=redis://127.0.0.1:19661 node doi.mjs
{"msg":"[socket] adapter","configured":"redis","actual":"RedisAdapter"}
$ SOCKET_ADAPTER=postgres DATABASE_URL=postgres://postgres:lab@127.0.0.1:19660/postgres node doi.mjs
{"msg":"[socket] adapter","configured":"postgres","actual":"PostgresAdapter"}
$ SOCKET_ADAPTER=redis REDIS_URL=redis://127.0.0.1:19699 node doi.mjs   # REDIS_URL gõ nhầm cổng
{"msg":"[socket] adapter","configured":"redis","actual":"Adapter"}</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// MỘT phép đo cho mọi adapter: A nối worker 1, B nối worker 2 (cùng phòng r). A gửi 'phat' kèm giờ gửi; worker 1 io.to('r').emit('tin');</span>
<span class="tok-comment">// B nhận — A và B cùng một tiến trình nên dùng chung đồng hồ. 1.000 lượt nối tiếp. che = memory (một server) | cluster | redis | postgres.</span>
import cluster from 'node:cluster';
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const che = process.argv[2];
const CONG = 19761;
async function lamServer(cong, so) {
  let opts = {};
  if (che === 'redis') { const { createAdapter } = await import('@socket.io/redis-adapter'); const { createClient } = await import('redis');
    const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate(); await Promise.all([pub.connect(), sub.connect()]); opts.adapter = createAdapter(pub, sub); }
  if (che === 'postgres') { const { createAdapter } = await import('@socket.io/postgres-adapter'); const pg = (await import('pg')).default;
    opts.adapter = createAdapter(new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' })); }
  if (che === 'cluster') { const { createAdapter } = await import('@socket.io/cluster-adapter'); opts.adapter = createAdapter(); }
  const srv = http.createServer(); const io = new Server(srv, opts);
  if (che === 'cluster') { const { setupWorker } = await import('@socket.io/sticky'); setupWorker(io); } else srv.listen(cong);
  io.on('connection', (s) =&gt; { s.join('r'); s.emit('ban-la', so); s.on('phat', (t) =&gt; io.to('r').emit('tin', t)); });
  return io;
}
const t0 = performance.timeOrigin;
async function do1000(cong1, cong2) {
  const ket = (cong) =&gt; ketNoi(&#96;http://localhost:\${cong}&#96;, { transports: ['websocket'], forceNew: true });
  let A, B, wA, wB;
  for (;;) { A ??= ket(cong1); wA ??= await new Promise((ok) =&gt; A.once('ban-la', ok));
    const c = ket(cong2); const w = await new Promise((ok) =&gt; c.once('ban-la', ok)); if (w !== wA) { B = c; wB = w; break; } c.close(); }
  await new Promise((ok) =&gt; setTimeout(ok, 500));
  const d = []; let nhan = 0;
  for (let k = 0; k &lt; 1000; k++) { const p = new Promise((ok) =&gt; B.once('tin', (t) =&gt; { nhan++; d.push(performance.now() - t); ok(); })); A.emit('phat', performance.now()); await p; }
  d.sort((a, b) =&gt; a - b); const f = (x) =&gt; x.toFixed(2).replace('.', ',');
  console.log(&#96;\${che.padEnd(9)} A ở worker \${wA}, B ở worker \${wB} · B nhận \${nhan}/1000 · p50 \${f(d[500])} ms · p99 \${f(d[990])} ms&#96;);
}
if (che === 'cluster') {
  if (cluster.isPrimary) {
    const { setupMaster } = await import('@socket.io/sticky'); const { setupPrimary } = await import('@socket.io/cluster-adapter');
    const srv = http.createServer(); setupMaster(srv, { loadBalancingMethod: 'least-connection' }); setupPrimary(); srv.listen(CONG);
    cluster.setupPrimary({ serialization: 'advanced' });         <span class="tok-comment">  // README: giữ Buffer nguyên vẹn qua IPC</span>
    const ws = [cluster.fork({ SO: 1 }), cluster.fork({ SO: 2 })];
    await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('online', ok)))); await new Promise((ok) =&gt; setTimeout(ok, 800));
    await do1000(CONG, CONG); ws.forEach((w) =&gt; w.kill()); process.exit(0);
  } else await lamServer(CONG, +process.env.SO);
} else if (che === 'memory') { await lamServer(CONG, 1); await do1000(CONG, CONG).catch(() =&gt; {}); process.exit(0); }
else if (process.argv[3] === 'worker') { await lamServer(+process.argv[4], +process.argv[5]); process.send('san-sang'); }
else {
  const { fork } = await import('node:child_process');
  const ws = [1, 2].map((so) =&gt; fork(new URL(import.meta.url).pathname, [che, 'worker', CONG + so, so]));
  await Promise.all(ws.map((w) =&gt; new Promise((ok) =&gt; w.once('message', ok))));
  await do1000(CONG + 1, CONG + 2); ws.forEach((w) =&gt; w.kill()); process.exit(0);
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Postgres adapter: NOTIFY chỉ chở được &lt; 8000 byte. Tin 10 KB thì sao? Lượt 1: chưa tạo bảng socket_io_attachments. Lượt 2: tạo bảng rồi phát lại.</span>
<span class="tok-comment">// Đếm thêm: adapter giữ bao nhiêu kết nối Postgres, và đang LISTEN kênh nào.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/postgres-adapter';
import pg from 'pg';
const URL_PG = 'postgres://postgres:lab@127.0.0.1:19660/postgres';
const q = new pg.Client(URL_PG); await q.connect(); await q.query('DROP TABLE IF EXISTS socket_io_attachments');
process.on('unhandledRejection', (e) =&gt; console.log(&#96;  unhandledRejection: \${e.message}&#96;));
const moi = (cong) =&gt; { const io = new Server(cong, { adapter: createAdapter(new pg.Pool({ connectionString: URL_PG }), { errorHandler: (e) =&gt; console.log(&#96;  errorHandler: \${e.message}&#96;) }) }); io.on('connection', (s) =&gt; s.join('r')); return io; };
const w1 = moi(19763), w2 = moi(19764);
const B = ketNoi('http://localhost:19764', { transports: ['websocket'] }); let nhan = [];
B.on('tin', (x) =&gt; nhan.push(x.length));
await new Promise((ok) =&gt; B.once('connect', ok)); await new Promise((ok) =&gt; setTimeout(ok, 800));
const r = await q.query("SELECT count(*)::int AS n, string_agg(DISTINCT left(query, 40), ' | ') AS q FROM pg_stat_activity WHERE datname = 'postgres' AND pid &lt;&gt; pg_backend_pid()");
console.log(&#96;kết nối Postgres của 2 worker: \${r.rows[0].n} · \${r.rows[0].q}&#96;);
for (const [ten, kt] of [['1 KB', 1000], ['10 KB, chưa có bảng', 10000]]) {
  nhan = []; w1.to('r').emit('tin', 'x'.repeat(kt)); await new Promise((ok) =&gt; setTimeout(ok, 800));
  console.log(&#96;phát \${ten} từ worker 1 ⇒ B ở worker 2 nhận: \${nhan.length ? nhan[0] + ' ký tự' : 'KHÔNG'}&#96;);
}
await q.query('CREATE TABLE socket_io_attachments (id bigserial UNIQUE, created_at timestamptz DEFAULT NOW(), payload bytea)');
nhan = []; w1.to('r').emit('tin', 'x'.repeat(10000)); await new Promise((ok) =&gt; setTimeout(ok, 800));
console.log(&#96;tạo bảng rồi phát 10 KB ⇒ B nhận: \${nhan.length ? nhan[0] + ' ký tự' : 'KHÔNG'} · số dòng trong socket_io_attachments: \${(await q.query('SELECT count(*)::int AS n FROM socket_io_attachments')).rows[0].n}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-4-cluster-mo-rong" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.4 — Mở rộng theo chiều ngang: 3,4× với việc CPU, 1,06× với việc I/O</span><span class="lc-sub">node:cluster, nền của cluster adapter</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.2 — Stream: cuốn nhật ký biết nhớ</span><span class="lc-sub">Nền của streams adapter</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Chọn: Pub/Sub, Stream, list hay một broker thật</span><span class="lc-sub">Cùng quyết định, ở tầng dưới</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">in-memory adapter</span><span class="v">Mặc định im lặng; chỉ đúng với một tiến trình duy nhất.</span></div>
  <div class="kv"><span class="k">cluster-adapter</span><span class="v">Mọi worker trên một máy dưới <code>node:cluster</code>; đi cặp với <code>@socket.io/sticky</code>.</span></div>
  <div class="kv"><span class="k">redis-adapter</span><span class="v">Cần một khi có máy thứ hai, hoặc bạn vốn đã chạy Redis.</span></div>
  <div class="kv"><span class="k">postgres-adapter</span><span class="v">Traffic realtime khiêm tốn, nơi đơn giản vận hành thắng mili giây.</span></div>
  <div class="kv"><span class="k">Tráo một dòng</span><span class="v">Đổi adapter chỉ một dòng, nên lựa chọn đảo được.</span></div>
  <div class="kv"><span class="k">Điều kiện chọn</span><span class="v">Mỗi adapter được chọn bởi một dữ kiện về deployment hôm nay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Có bốn adapter, mỗi cái được chọn bởi một điều kiện.</li><li>in-memory cho một tiến trình thật (nguy hiểm chỉ vì là mặc định im lặng).</li><li>cluster-adapter khi mọi worker trên một máy dưới <code>node:cluster</code>.</li><li>redis-adapter một khi có máy thứ hai; postgres-adapter khi đơn giản thắng mili giây.</li><li>Tráo là một thay đổi một dòng, nên quyết định thật sự chỉ là &quot;hôm nay điều gì đang đúng&quot;.</li></ul>

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
