/**
 * Redis — Chương 8: Pub/Sub và Stream — bức thư biến mất.
 * Pub/Sub bắn-rồi-quên · stream là cuốn nhật ký · nhóm tiêu thụ · xử lý hỏng · chọn công cụ · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 8 — Pub/Sub and Streams: the message that vanished|||Chương 8 — Pub/Sub và Stream: bức thư biến mất',
  description: 'Pub/Sub giao nhiều nhất một lần và không nhớ gì cả — hoàn hảo cho thông báo, tai hoạ cho công việc. Stream là một cuốn nhật ký ghi thêm có nhóm tiêu thụ, xác nhận và danh sách chờ, tức là mọi thứ một hàng đợi việc cần. Chương này dạy cả hai và dạy cách chọn.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Pub/Sub: fire and forget, and what that costs|||8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó',
      slug: 'rd-8-1-pubsub',
      type: 'LESSON',
      isFreePreview: true,
      description: 'SUBSCRIBE với PUBLISH, giao nhiều nhất một lần và không lưu gì, kết nối ở chế độ đăng ký chạy được lệnh gì, bộ đệm đầu ra giết bên nhận chậm, pattern với sharded pub/sub, và bốn việc nó làm rất tốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Pub/Sub: fire and forget, and what that costs</h2>
<p class="lead">Redis Pub/Sub is the simplest messaging system you will ever use: publish to a channel, everyone currently listening gets it, nobody else ever will. That last clause is not a limitation to work around — it is the design, and building anything important on top of it without understanding it is how messages vanish.</p>

<h3>The whole API in six commands</h3>
<pre><code><span class="tok-comment"># Terminal 1 — subscriber</span>
redis-cli SUBSCRIBE news:tech

<span class="tok-comment"># Terminal 2 — publisher</span>
redis-cli PUBLISH news:tech "Redis 8 released"
redis-cli PUBLISH news:sport "nobody is listening"
redis-cli PUBSUB CHANNELS
redis-cli PUBSUB NUMSUB news:tech news:sport</code></pre>
<div class="out">Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "news:tech"
3) (integer) 1
1) "message"
2) "news:tech"
3) "Redis 8 released"
(integer) 1
(integer) 0
1) "news:tech"
1) "news:tech"
2) (integer) 1
3) "news:sport"
4) (integer) 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>PUBLISH</code> returns the subscriber count</span><span class="v">Not a delivery confirmation — the number of connections the message was <em>written to</em>. A return of 0 means nobody was listening and the message is gone. That return value is the only feedback the protocol gives you.</span></div>
  <div class="kv"><span class="k">Channels are not created or deleted</span><span class="v">There is no registry. Publishing to a channel nobody subscribes to is a no-op that costs nothing, and subscribing to a channel nobody publishes to is equally free.</span></div>
  <div class="kv"><span class="k"><code>PSUBSCRIBE</code> matches glob patterns</span><span class="v"><code>PSUBSCRIBE news:*</code> receives everything under <code>news:</code>. Convenient, and every published message must be matched against every pattern, so a thousand patterns is real CPU on the publish path.</span></div>
  <div class="kv"><span class="k"><code>PUBSUB</code> introspects</span><span class="v"><code>CHANNELS</code>, <code>NUMSUB</code>, <code>NUMPAT</code>, and <code>SHARDCHANNELS</code>/<code>SHARDNUMSUB</code> for the sharded variant. Useful in an incident: "is anything actually listening?"</span></div>
  <div class="kv"><span class="k">It is not part of the keyspace</span><span class="v">Channels are not keys. They are not in <code>DBSIZE</code>, not saved to RDB, not affected by <code>SELECT</code> or <code>FLUSHDB</code>, and not subject to <code>maxmemory</code> eviction. Pub/Sub is a separate mechanism that happens to share the connection.</span></div>
</div>

<h3>At-most-once, and what that means at 3am</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nothing is stored, ever</span><span class="lz-t">no buffer, no backlog, no replay</span><span class="lz-d">A message exists only in the instant it is fanned out to connected sockets. A subscriber that connects one millisecond later gets nothing, and there is no command that can recover it. This is the single most important sentence about Pub/Sub.</span></div>
  <div class="lz-step"><span class="lz-k">A restart loses everything in flight</span><span class="lz-t">yours, and Redis's</span><span class="lz-d">Your consumer redeploys: every message published during those four seconds is gone. Redis fails over: same. There is no acknowledgement, so nothing anywhere knows a message was missed.</span></div>
  <div class="lz-step"><span class="lz-k">A slow subscriber is disconnected</span><span class="lz-t">client-output-buffer-limit pubsub</span><span class="lz-d">Default <code>32mb 8mb 60</code>: exceed 32 MB of undelivered messages, or stay above 8 MB for 60 seconds, and Redis closes the connection to protect its own memory. Your subscriber sees a dropped connection, reconnects, and has silently lost a window of messages.</span></div>
  <div class="lz-step"><span class="lz-k">There is no delivery guarantee to build on</span><span class="lz-t">at-most-once, by construction</span><span class="lz-d">Not "usually delivered". Not "delivered unless something goes wrong". At-most-once is the ceiling, and every failure mode above lands under it. If losing a message would matter, this is the wrong tool — use Streams (Lesson 8.2).</span></div>
</div>
<pre><code>redis-cli CONFIG GET client-output-buffer-limit
redis-cli INFO clients | grep -E "connected_clients|pubsub"
redis-cli INFO stats | grep -E "pubsub_channels|pubsub_patterns"</code></pre>
<div class="out">1) "client-output-buffer-limit"
2) "normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60"
connected_clients:52
pubsub_clients:11
total_net_output_bytes:88410233
pubsub_channels:7
pubsub_patterns:2</div>

<h3>Subscriber mode: the connection changes personality</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SUBSCRIBE ch
GET somekey
PING
EOF</code></pre>
<div class="out">1) "subscribe"
2) "ch"
3) (integer) 1
(error) ERR Can't execute 'get': only (P|S)SUBSCRIBE / (P|S)UNSUBSCRIBE / PING / QUIT / RESET are allowed in this context
1) "pong"
2) ""</div>
<div class="callout warn"><strong>A connection in subscriber mode cannot run normal commands, and this is the number-one Pub/Sub bug.</strong> Under RESP2 — still the default for most clients — a subscribed connection accepts only the subscribe/unsubscribe family plus <code>PING</code>, <code>QUIT</code> and <code>RESET</code>. So the moment you call <code>subscribe()</code> on your main client, every <code>GET</code> elsewhere in the application starts throwing, usually in a completely unrelated request handler. The fix is one line — <code>const sub = redis.duplicate()</code> — and it is the reason every library's Pub/Sub example creates a second connection. RESP3 lifts the restriction (push messages are a distinct protocol type there), but do not rely on it unless you have explicitly enabled RESP3 and checked your client supports it (Lesson 1.3).</div>

<h3>Pub/Sub in Cluster, and the 7.0 fix</h3>
<pre><code><span class="tok-comment"># Classic pub/sub in Cluster: a PUBLISH is broadcast to EVERY node</span>
redis-cli -c -p 7000 PUBLISH global "hello"
<span class="tok-comment"># Sharded pub/sub (7.0+): the channel is hashed to a slot like a key</span>
redis-cli -c -p 7000 SSUBSCRIBE orders:shard1 &amp;
redis-cli -c -p 7001 SPUBLISH orders:shard1 "job:88"
redis-cli -p 7000 PUBSUB SHARDCHANNELS</code></pre>
<div class="out">(integer) 3
1) "ssubscribe"
2) "orders:shard1"
3) (integer) 1
(integer) 1
1) "orders:shard1"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Classic Pub/Sub ignores sharding entirely</span><span class="lz-lnote">Because a subscriber may be connected to any node, a <code>PUBLISH</code> on one node is propagated to all of them across the cluster bus. Correct, and it means publish traffic scales with the number of nodes rather than being divided among them — the one part of Cluster that gets <em>worse</em> as you add capacity (Chapter 11).</span></div>
  <div class="lz-layer"><span class="lz-lname">Sharded Pub/Sub hashes the channel</span><span class="lz-lnote"><code>SPUBLISH</code>/<code>SSUBSCRIBE</code>, added in 7.0, treat the channel name like a key: it maps to a slot, and only the node owning that slot handles it. No broadcast, so throughput scales with the cluster. The cost is that a subscriber must connect to the right node — which cluster-aware clients handle for you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Replicas receive published messages too</span><span class="lz-lnote">A client subscribed to a replica gets messages published to the primary. Useful for fanning out reads of a notification stream, and a surprise if you assumed replicas were read-only in every sense.</span></div>
</div>

<h3>What Pub/Sub is genuinely good at</h3>
<pre><code><span class="tok-comment">// 1 · Cache invalidation across app instances (Lesson 6.2)</span>
await redis.publish('cache:invalidate', 'product:4201');

<span class="tok-comment">// 2 · Config reload without a deploy (Lesson 5.5)</span>
await sub.pSubscribe('__keyspace@0__:config:app', () =&gt; loadConfig());

<span class="tok-comment">// 3 · WebSocket fan-out: one Redis channel per room, N app servers</span>
await sub.subscribe(&#96;room:\${roomId}&#96;, (msg) =&gt; broadcastToLocalSockets(roomId, msg));

<span class="tok-comment">// 4 · Live dashboards and presence — where a dropped tick is invisible</span>
await redis.publish('metrics:tick', JSON.stringify({ rps, p99 }));</code></pre>
<div class="callout ok"><strong>The common thread: every one of these is a hint, not an instruction.</strong> A lost invalidation message means one instance serves a stale value until its TTL — recoverable, because the TTL is the real guarantee and the message is just an optimisation. A lost metrics tick means one missing point on a chart. A lost chat message in a room where the user is not connected is exactly what they expect. Pub/Sub is correct for anything where the receiver can recover on its own, and wrong for anything where the message <em>is</em> the work.</div>

<div class="pitfall"><strong>Pitfall:</strong> using Pub/Sub as a job queue. It looks perfect — publish a job, workers subscribe, done — and it fails in four ways at once. Every subscriber receives <em>every</em> message, so three workers means the job runs three times, not once (there is no competing-consumer semantics anywhere in Pub/Sub). A worker that is deploying, restarting or briefly disconnected misses the jobs published during that window, permanently and silently. There is no acknowledgement, so nothing detects a worker that received a job and then crashed before finishing it. And there is no backlog: if publishing outpaces consumption, the messages are not queued, they are dropped when the output buffer limit is hit. Each of these has a workaround people try — hashing to pick one worker, a "seen" set for dedup, a heartbeat — and assembled together they are a worse version of a system that already exists. Redis Streams (Lesson 8.2) give you competing consumers, acknowledgement, a pending list, replay and redelivery, natively. That is what the rest of this chapter is about.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/interact/pubsub/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Pub/Sub</span><span class="lc-sub">The official page: the message formats, pattern matching, subscriber-mode rules, the RESP3 differences, and sharded Pub/Sub. Short and worth reading in full.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/spublish/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">SPUBLISH and sharded Pub/Sub</span><span class="lc-sub">Why classic Pub/Sub broadcasts across a cluster, how channel hashing fixes it, and what changes for clients when you adopt it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: publish and subscribe</span><span class="lc-sub">Graded exercises: build a WebSocket fan-out across two app instances, reproduce the subscriber-mode error and fix it, prove a message is lost across a reconnect, and classify six use cases as Pub/Sub or Streams.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Pub/Sub is at-most-once by construction: nothing is stored, a subscriber that is disconnected for four seconds loses four seconds of messages, and <code>PUBLISH</code> returning 0 means the message is simply gone. A subscribed connection cannot run normal commands under RESP2, so Pub/Sub always needs its own connection — <code>redis.duplicate()</code> — and forgetting that breaks unrelated code paths. And it is the right tool when the message is a <em>hint</em> the receiver can recover from without: cache invalidation backed by a TTL, config reload, WebSocket fan-out, live metrics. The moment the message <em>is</em> the work, you need Streams.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Pub/Sub: bắn rồi quên, và cái giá của nó</h2>
<p class="lead">Pub/Sub của Redis là hệ nhắn tin đơn giản nhất bạn từng dùng: đăng lên một kênh, mọi người đang nghe lúc đó đều nhận được, và không ai khác sẽ nhận được nữa. Mệnh đề cuối cùng ấy không phải một hạn chế để lách qua — nó là thiết kế, và dựng thứ gì quan trọng lên trên nó mà không hiểu điều đó chính là cách những bức thư biến mất.</p>

<h3>Trọn bộ giao diện trong sáu lệnh</h3>
<pre><code><span class="tok-comment"># Cửa sổ 1 — bên đăng ký</span>
redis-cli SUBSCRIBE news:tech

<span class="tok-comment"># Cửa sổ 2 — bên đăng bài</span>
redis-cli PUBLISH news:tech "Redis 8 released"
redis-cli PUBLISH news:sport "nobody is listening"
redis-cli PUBSUB CHANNELS
redis-cli PUBSUB NUMSUB news:tech news:sport</code></pre>
<div class="out">Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "news:tech"
3) (integer) 1
1) "message"
2) "news:tech"
3) "Redis 8 released"
(integer) 1
(integer) 0
1) "news:tech"
1) "news:tech"
2) (integer) 1
3) "news:sport"
4) (integer) 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>PUBLISH</code> trả về số bên đăng ký</span><span class="v">Không phải xác nhận giao hàng — mà là số kết nối mà thông điệp đã <em>được ghi vào</em>. Trả về 0 nghĩa là không ai đang nghe và bức thư đã mất. Giá trị trả về đó là phản hồi duy nhất giao thức cho bạn.</span></div>
  <div class="kv"><span class="k">Kênh không được tạo ra hay xoá đi</span><span class="v">Không có sổ đăng ký nào cả. Đăng lên một kênh không ai theo dõi là một phép rỗng chẳng tốn gì, và theo dõi một kênh không ai đăng bài cũng miễn phí y hệt.</span></div>
  <div class="kv"><span class="k"><code>PSUBSCRIBE</code> khớp theo mẫu glob</span><span class="v"><code>PSUBSCRIBE news:*</code> nhận mọi thứ dưới <code>news:</code>. Tiện, và mỗi thông điệp đăng lên đều phải được đối chiếu với từng cái mẫu, nên một nghìn mẫu là CPU thật trên đường đăng bài.</span></div>
  <div class="kv"><span class="k"><code>PUBSUB</code> để soi</span><span class="v"><code>CHANNELS</code>, <code>NUMSUB</code>, <code>NUMPAT</code>, và <code>SHARDCHANNELS</code>/<code>SHARDNUMSUB</code> cho biến thể chia mảnh. Hữu ích lúc có sự cố: "có gì đang thật sự nghe không?"</span></div>
  <div class="kv"><span class="k">Nó không thuộc về không gian khoá</span><span class="v">Kênh không phải khoá. Chúng không nằm trong <code>DBSIZE</code>, không được lưu vào RDB, không chịu ảnh hưởng của <code>SELECT</code> hay <code>FLUSHDB</code>, và không bị đẩy đi bởi <code>maxmemory</code>. Pub/Sub là một cơ chế riêng chỉ tình cờ dùng chung cái kết nối.</span></div>
</div>

<h3>Nhiều nhất một lần, và điều đó nghĩa là gì lúc 3 giờ sáng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Không có gì được lưu, không bao giờ</span><span class="lz-t">không bộ đệm, không tồn đọng, không phát lại</span><span class="lz-d">Một thông điệp chỉ tồn tại trong khoảnh khắc nó được toả ra các socket đang kết nối. Một bên đăng ký nối vào chậm một mili giây thì chẳng nhận được gì, và không có lệnh nào lấy lại được nó. Đây là câu quan trọng nhất về Pub/Sub.</span></div>
  <div class="lz-step"><span class="lz-k">Một lần khởi động lại làm mất mọi thứ đang bay</span><span class="lz-t">của bạn, và của Redis</span><span class="lz-d">Bên tiêu thụ của bạn deploy lại: mọi thông điệp đăng trong bốn giây ấy mất luôn. Redis chuyển đổi: y hệt. Không có xác nhận nào, nên không nơi nào biết một thông điệp đã bị bỏ lỡ.</span></div>
  <div class="lz-step"><span class="lz-k">Một bên nhận chậm sẽ bị ngắt kết nối</span><span class="lz-t">client-output-buffer-limit pubsub</span><span class="lz-d">Mặc định <code>32mb 8mb 60</code>: vượt 32 MB thông điệp chưa giao được, hoặc ở trên 8 MB suốt 60 giây, là Redis đóng kết nối để bảo vệ bộ nhớ của chính nó. Bên đăng ký của bạn thấy kết nối rớt, nối lại, và đã âm thầm mất một cửa sổ thông điệp.</span></div>
  <div class="lz-step"><span class="lz-k">Không có bảo đảm giao hàng nào để xây lên</span><span class="lz-t">nhiều nhất một lần, ngay từ cách dựng</span><span class="lz-d">Không phải "thường thì giao được". Không phải "giao được trừ khi có gì trục trặc". Nhiều-nhất-một-lần là cái trần, và mọi kiểu hỏng ở trên đều nằm dưới nó. Nếu mất một thông điệp là chuyện lớn thì đây là công cụ sai — hãy dùng Stream (Bài 8.2).</span></div>
</div>
<pre><code>redis-cli CONFIG GET client-output-buffer-limit
redis-cli INFO clients | grep -E "connected_clients|pubsub"
redis-cli INFO stats | grep -E "pubsub_channels|pubsub_patterns"</code></pre>
<div class="out">1) "client-output-buffer-limit"
2) "normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60"
connected_clients:52
pubsub_clients:11
total_net_output_bytes:88410233
pubsub_channels:7
pubsub_patterns:2</div>

<h3>Chế độ đăng ký: cái kết nối đổi tính nết</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SUBSCRIBE ch
GET somekey
PING
EOF</code></pre>
<div class="out">1) "subscribe"
2) "ch"
3) (integer) 1
(error) ERR Can't execute 'get': only (P|S)SUBSCRIBE / (P|S)UNSUBSCRIBE / PING / QUIT / RESET are allowed in this context
1) "pong"
2) ""</div>
<div class="callout warn"><strong>Một kết nối ở chế độ đăng ký không chạy được lệnh thường, và đây là lỗi Pub/Sub số một.</strong> Dưới RESP2 — vẫn là mặc định của phần lớn thư viện khách — một kết nối đã đăng ký chỉ nhận họ lệnh subscribe/unsubscribe cộng thêm <code>PING</code>, <code>QUIT</code> và <code>RESET</code>. Nên ngay khoảnh khắc bạn gọi <code>subscribe()</code> trên thư viện khách chính, mọi lệnh <code>GET</code> ở chỗ khác trong ứng dụng bắt đầu ném lỗi, thường là trong một bộ xử lý yêu cầu chẳng liên quan gì. Cách chữa gói trong một dòng — <code>const sub = redis.duplicate()</code> — và đó là lý do mọi ví dụ Pub/Sub của mọi thư viện đều tạo một kết nối thứ hai. RESP3 gỡ bỏ hạn chế đó (ở đó thông điệp đẩy là một kiểu giao thức riêng), nhưng đừng dựa vào nó trừ khi bạn đã bật RESP3 một cách tường minh và đã kiểm rằng thư viện khách của bạn hỗ trợ (Bài 1.3).</div>

<h3>Pub/Sub trong Cluster, và cách chữa của bản 7.0</h3>
<pre><code><span class="tok-comment"># Pub/sub cổ điển trong Cluster: một lệnh PUBLISH được phát tới MỌI nút</span>
redis-cli -c -p 7000 PUBLISH global "hello"
<span class="tok-comment"># Pub/sub chia mảnh (7.0+): tên kênh được băm về một ô như một cái khoá</span>
redis-cli -c -p 7000 SSUBSCRIBE orders:shard1 &amp;
redis-cli -c -p 7001 SPUBLISH orders:shard1 "job:88"
redis-cli -p 7000 PUBSUB SHARDCHANNELS</code></pre>
<div class="out">(integer) 3
1) "ssubscribe"
2) "orders:shard1"
3) (integer) 1
(integer) 1
1) "orders:shard1"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Pub/Sub cổ điển bỏ qua hoàn toàn việc chia mảnh</span><span class="lz-lnote">Vì một bên đăng ký có thể đang nối vào bất kỳ nút nào, một lệnh <code>PUBLISH</code> ở một nút được lan tới tất cả các nút qua đường bus của cụm. Đúng đắn, và điều đó nghĩa là lưu lượng đăng bài tăng theo số nút thay vì được chia đều cho chúng — phần duy nhất của Cluster <em>tệ đi</em> khi bạn thêm năng lực (Chương 11).</span></div>
  <div class="lz-layer"><span class="lz-lname">Pub/Sub chia mảnh băm cái tên kênh</span><span class="lz-lnote"><code>SPUBLISH</code>/<code>SSUBSCRIBE</code>, thêm vào ở bản 7.0, đối xử với tên kênh như một cái khoá: nó ánh xạ về một ô, và chỉ nút sở hữu ô đó xử lý nó. Không phát rộng, nên thông lượng tăng theo cụm. Cái giá là bên đăng ký phải nối đúng nút — việc mà các thư viện khách hiểu cụm lo hộ bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bản sao cũng nhận được thông điệp đăng lên</span><span class="lz-lnote">Một khách đăng ký trên một bản sao vẫn nhận được thông điệp đăng vào bản chính. Có ích khi toả ra các lượt đọc một dòng thông báo, và là chuyện bất ngờ nếu bạn tưởng bản sao chỉ đọc theo mọi nghĩa.</span></div>
</div>

<h3>Pub/Sub thật sự giỏi việc gì</h3>
<pre><code><span class="tok-comment">// 1 · Đẩy khoá bộ đệm cũ trên nhiều máy ứng dụng (Bài 6.2)</span>
await redis.publish('cache:invalidate', 'product:4201');

<span class="tok-comment">// 2 · Nạp lại cấu hình mà không cần deploy (Bài 5.5)</span>
await sub.pSubscribe('__keyspace@0__:config:app', () =&gt; loadConfig());

<span class="tok-comment">// 3 · Toả WebSocket: mỗi phòng một kênh Redis, N máy chủ ứng dụng</span>
await sub.subscribe(&#96;room:\${roomId}&#96;, (msg) =&gt; broadcastToLocalSockets(roomId, msg));

<span class="tok-comment">// 4 · Bảng điều khiển trực tiếp và trạng thái hiện diện — nơi mất một nhịp là vô hình</span>
await redis.publish('metrics:tick', JSON.stringify({ rps, p99 }));</code></pre>
<div class="callout ok"><strong>Điểm chung: mỗi cái trong số này là một lời mách nước, không phải một mệnh lệnh.</strong> Mất một thông điệp vô hiệu hoá nghĩa là một máy phục vụ một giá trị ôi cho tới khi hết TTL — hồi phục được, vì TTL mới là bảo đảm thật còn thông điệp chỉ là phép tối ưu. Mất một nhịp số liệu nghĩa là thiếu một chấm trên biểu đồ. Mất một tin nhắn trong một phòng mà người dùng đang không kết nối chính là điều họ mong đợi. Pub/Sub đúng cho bất cứ thứ gì mà bên nhận tự hồi phục được, và sai cho bất cứ thứ gì mà thông điệp <em>chính là</em> công việc.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> dùng Pub/Sub làm hàng đợi việc. Nó trông hoàn hảo — đăng một việc, các worker đăng ký nhận, xong — và nó hỏng theo bốn cách cùng lúc. Mỗi bên đăng ký nhận <em>mọi</em> thông điệp, nên ba worker nghĩa là việc chạy ba lần chứ không phải một (không có ngữ nghĩa bên-tiêu-thụ-tranh-nhau ở bất cứ đâu trong Pub/Sub). Một worker đang deploy, đang khởi động lại hay tạm rớt kết nối sẽ bỏ lỡ mọi việc đăng trong cửa sổ đó, vĩnh viễn và âm thầm. Không có xác nhận nào, nên không gì phát hiện được một worker đã nhận việc rồi sập trước khi làm xong. Và không có tồn đọng: nếu tốc độ đăng vượt tốc độ tiêu thụ thì các thông điệp không được xếp hàng, chúng bị vứt đi khi chạm trần bộ đệm đầu ra. Mỗi cái trong số đó đều có một cách lách mà người ta hay thử — băm để chọn một worker, một set "đã thấy" để khử trùng, một nhịp tim — và ghép lại thì đó là một phiên bản tệ hơn của một hệ vốn đã tồn tại. Redis Stream (Bài 8.2) cho bạn bên tiêu thụ tranh nhau, xác nhận, danh sách chờ, phát lại và giao lại, một cách bẩm sinh. Đó là nội dung phần còn lại của chương này.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/interact/pubsub/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Pub/Sub</span><span class="lc-sub">Trang chính thức: các định dạng thông điệp, khớp mẫu, luật của chế độ đăng ký, khác biệt ở RESP3, và pub/sub chia mảnh. Ngắn và đáng đọc trọn.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/spublish/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">SPUBLISH và pub/sub chia mảnh</span><span class="lc-sub">Vì sao pub/sub cổ điển phát rộng khắp cụm, việc băm tên kênh chữa chuyện đó ra sao, và phía thư viện khách thay đổi gì khi bạn chuyển sang dùng nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đăng bài và đăng ký</span><span class="lc-sub">Bài chấm điểm: dựng một phép toả WebSocket qua hai máy ứng dụng, tái hiện lỗi chế độ đăng ký rồi chữa nó, chứng minh một thông điệp bị mất khi nối lại, và phân loại sáu tình huống dùng thành Pub/Sub hay Stream.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Pub/Sub là nhiều-nhất-một-lần ngay từ cách dựng: không có gì được lưu, một bên đăng ký rớt kết nối bốn giây thì mất bốn giây thông điệp, và <code>PUBLISH</code> trả về 0 nghĩa là bức thư đơn giản là đã mất. Một kết nối đã đăng ký không chạy được lệnh thường dưới RESP2, nên Pub/Sub luôn cần kết nối riêng của nó — <code>redis.duplicate()</code> — và quên điều đó sẽ phá hỏng những nhánh mã chẳng liên quan. Và nó là công cụ đúng khi thông điệp là một <em>lời mách nước</em> mà bên nhận không cần nó vẫn hồi phục được: vô hiệu hoá bộ đệm có TTL đỡ lưng, nạp lại cấu hình, toả WebSocket, số liệu trực tiếp. Ngay khi thông điệp <em>chính là</em> công việc thì bạn cần Stream.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Streams: a log that remembers|||8.2 — Stream: cuốn nhật ký biết nhớ',
      slug: 'rd-8-2-stream',
      type: 'LESSON',
      description: 'XADD với ID gồm mốc thời gian và số thứ tự, XRANGE để đọc lại lịch sử, XREAD kèm $ và BLOCK, cắt bớt bằng MAXLEN với MINID và vì sao dấu ~ quan trọng, mã hoá radix tree, và vì sao XDEL không trả lại bộ nhớ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Streams: a log that remembers</h2>
<p class="lead">A Redis stream is an append-only log: entries go on the end, each gets an ID that sorts, and nothing is removed until you say so. That one property — <em>it is still there afterwards</em> — is the entire difference from Pub/Sub, and it is what makes acknowledgement, replay and redelivery possible.</p>

<h3>Appending and reading back</h3>
<pre><code>redis-cli DEL orders &gt;/dev/null
redis-cli XADD orders '*' sku 4201 qty 2 user 1042
redis-cli XADD orders '*' sku 8802 qty 1 user 1042
redis-cli XADD orders '*' sku 4201 qty 5 user 9001
redis-cli XLEN orders
redis-cli XRANGE orders - + COUNT 2
redis-cli XREVRANGE orders + - COUNT 1
redis-cli TYPE orders
redis-cli OBJECT ENCODING orders</code></pre>
<div class="out">"1755949214882-0"
"1755949214883-0"
"1755949214883-1"
(integer) 3
1) 1) "1755949214882-0"
   2) 1) "sku"
      2) "4201"
      3) "qty"
      4) "2"
      5) "user"
      6) "1042"
2) 1) "1755949214883-0"
   2) 1) "sku"
      2) "8802"
      3) "qty"
      4) "1"
      5) "user"
      6) "1042"
1) 1) "1755949214883-1"
   2) 1) "sku"
      2) "4201"
      3) "qty"
      4) "5"
      5) "user"
      6) "9001"
stream
"stream"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The ID is milliseconds-sequence</span><span class="lz-t">1755949214883-1</span><span class="lz-d">The left half is the server's clock in milliseconds; the right half is a counter that increments when two entries land in the same millisecond. Together they are unique and strictly increasing — which is what makes "everything after X" a meaningful, cheap query.</span></div>
  <div class="lz-step"><span class="lz-k"><code>*</code> means "you pick"</span><span class="lz-t">and you almost always want that</span><span class="lz-d">You can supply an explicit ID, but it must be larger than the last one or <code>XADD</code> errors. Explicit IDs are for importing existing data with known timestamps; for live traffic, let Redis do it.</span></div>
  <div class="lz-step"><span class="lz-k">Each entry is a set of field/value pairs</span><span class="lz-t">like a small hash, not a blob</span><span class="lz-d">Not a single string — a flat map. Field names repeat on every entry, so short names matter at volume, and the same "no nesting" rule as hashes applies (Lesson 5.3): a nested object goes in as a JSON string in one field.</span></div>
  <div class="lz-step"><span class="lz-k"><code>-</code> and <code>+</code> are the ends</span><span class="lz-t">XRANGE key - + COUNT 100</span><span class="lz-d">Minimum and maximum possible ID. <code>XRANGE</code> is O(log N + count) — it seeks into the radix tree rather than scanning, so reading a hundred entries from the middle of ten million is cheap.</span></div>
</div>

<h3>Reading new entries as they arrive</h3>
<pre><code><span class="tok-comment"># $ means "only entries added AFTER this call blocks"</span>
redis-cli XREAD BLOCK 5000 STREAMS orders '$' &amp;
sleep 0.3
redis-cli XADD orders '*' sku 1111 qty 1 user 7
wait

<span class="tok-comment"># An explicit ID means "everything strictly after this one" — replay</span>
redis-cli XREAD COUNT 2 STREAMS orders 0
redis-cli XREAD COUNT 10 STREAMS orders 1755949214883-0</code></pre>
<div class="out">1) 1) "orders"
   2) 1) 1) "1755949215104-0"
         2) 1) "sku"
            2) "1111"
            3) "qty"
            4) "1"
            5) "user"
            6) "7"
"1755949215104-0"
1) 1) "orders"
   2) 1) 1) "1755949214882-0"
         2) 1) "sku"
            2) "4201"
            3) "qty"
            4) "2"
            5) "user"
            6) "1042"
      2) 1) "1755949214883-0"
         2) 1) "sku"
            2) "8802"
            3) "qty"
            4) "1"
            5) "user"
            6) "1042"
1) 1) "orders"
   2) 1) 1) "1755949214883-1"
         2) 1) "sku"
            2) "4201"
            3) "qty"
            4) "5"
            5) "user"
            6) "9001"
      2) 1) "1755949215104-0"
         2) 1) "sku"
            2) "1111"
            3) "qty"
            4) "1"
            5) "user"
            6) "7"</div>
<div class="callout ok"><strong>This is the property Pub/Sub does not have: a consumer that was offline can ask for everything after the last ID it processed.</strong> Store that ID somewhere durable, and a restart is a resumption rather than a gap. <code>XREAD BLOCK</code> parks the connection exactly like <code>BLPOP</code> (Lesson 4.1) — the client waits, the server does not — and <code>BLOCK 0</code> waits forever. One connection can read several streams at once: <code>XREAD BLOCK 0 STREAMS a b c $ $ $</code>, with the IDs listed after all the key names, which is the one piece of awkward syntax in the whole API.</div>

<h3>Trimming: a log that grows forever is a memory leak</h3>
<pre><code>redis-cli XLEN orders
redis-cli XADD orders MAXLEN '~' 1000 '*' sku 5 qty 1 user 3   <span class="tok-comment"># trim on write</span>
redis-cli XTRIM orders MAXLEN 2                                 <span class="tok-comment"># exact, blocking</span>
redis-cli XLEN orders
redis-cli XTRIM orders MINID 1755949214883                      <span class="tok-comment"># 6.2+: drop by age</span>
redis-cli XINFO STREAM orders | head -8</code></pre>
<div class="out">(integer) 4
"1755949215330-0"
(integer) 3
(integer) 2
(integer) 1
1) "length"
2) (integer) 1
3) "radix-tree-keys"
4) (integer) 1
5) "radix-tree-nodes"
6) (integer) 2
7) "last-generated-id"
8) "1755949215330-0"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>MAXLEN ~ 1000</code> is what you want</span><span class="v">The <code>~</code> means "approximately": Redis trims to a whole radix-tree node boundary, so it removes a batch cheaply instead of walking to an exact count. You get "about 1000, never fewer", in O(1) amortised.</span></div>
  <div class="kv"><span class="k">Exact <code>MAXLEN 1000</code> is O(N)</span><span class="v">Without the tilde, Redis removes entries one at a time until the count is exact. On a stream that is far over the limit, that is a blocking operation. Use exact trimming only when you genuinely need the precise bound.</span></div>
  <div class="kv"><span class="k"><code>MINID</code> trims by age, not count</span><span class="v">Redis 6.2+. <code>XTRIM s MINID &lt;ms&gt;</code> drops everything older than a timestamp, which matches how retention is usually specified ("keep 7 days") far better than a count does.</span></div>
  <div class="kv"><span class="k">Trim on <code>XADD</code>, not on a cron</span><span class="v"><code>XADD s MAXLEN ~ 10000 * …</code> keeps the bound applied continuously and costs nothing. A nightly trim job means the stream is unbounded for 23 hours a day.</span></div>
  <div class="kv"><span class="k"><code>LIMIT</code> caps the work per call</span><span class="v"><code>XTRIM s MAXLEN ~ 1000 LIMIT 100</code> removes at most 100 entries this call. The safe way to shrink a stream that got out of hand: run it repeatedly rather than once.</span></div>
</div>

<h3>Memory, and the thing XDEL does not do</h3>
<pre><code>redis-cli DEL big &gt;/dev/null
python3 -c "
for i in range(200_000): print(f'XADD big * seq {i} payload value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli XLEN big
redis-cli MEMORY USAGE big
redis-cli XINFO STREAM big | grep -A1 radix-tree-nodes
redis-cli XDEL big $(redis-cli XRANGE big - + COUNT 1 | head -1)
redis-cli XLEN big
redis-cli MEMORY USAGE big</code></pre>
<div class="out">(integer) 200000
17441216
3) "radix-tree-nodes"
4) (integer) 1638
(integer) 1
(integer) 199999
17441216</div>
<div class="pitfall"><strong>Pitfall:</strong> expecting <code>XDEL</code> to reclaim memory. It does not, and the reason is the storage layout: a stream is a radix tree of <em>macro nodes</em>, each packing many entries into one contiguous block for compactness — which is why 200,000 entries fit in 17 MB, far less than 200,000 separate keys would need (Lesson 5.2). <code>XDEL</code> cannot rewrite the middle of a packed node, so it marks the entry as deleted and leaves the bytes in place; memory comes back only when every entry in that node is gone and the whole node is freed. So a "delete-as-you-go" pattern produces a stream whose <code>XLEN</code> falls steadily while its <code>MEMORY USAGE</code> does not move at all — which is exactly the shape of an incident where a queue looks empty and the instance is still at 90% memory. Do not manage stream size with <code>XDEL</code>. Use <code>MAXLEN ~</code> or <code>MINID</code> on every <code>XADD</code>, which trims whole nodes from the head and genuinely frees them, and reserve <code>XDEL</code> for the rare case of removing one specific entry (a message containing data you must erase) rather than as a retention mechanism.</div>

<h3>What you get that a list does not give you</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Entries survive being read</span><span class="lz-lnote">A list pops: the item is gone, and a worker that crashes after popping loses it (Lesson 4.1). A stream read leaves the entry in place, so redelivery is possible at all. Everything in Lessons 8.3 and 8.4 is built on this one difference.</span></div>
  <div class="lz-layer"><span class="lz-lname">Many independent readers, each at their own position</span><span class="lz-lnote">Ten services can each consume the same stream from their own last-seen ID without interfering, because reading is not destructive. With a list, the first reader to pop wins and the others get nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">Time is built into the ID</span><span class="lz-lnote">"Everything from the last hour" is <code>XRANGE s &lt;ms-1h&gt; +</code> — no secondary index, no sorted set, no extra key. The ID scheme makes the log queryable by time for free.</span></div>
  <div class="lz-layer"><span class="lz-lname">Structured fields, not opaque strings</span><span class="lz-lnote">An entry is a map, so a consumer can read one field without deserialising the whole payload, and a schema can grow by adding fields that older consumers ignore.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Streams</span><span class="lc-sub">The full tutorial: IDs, <code>XADD</code>/<code>XRANGE</code>/<code>XREAD</code>, trimming strategies, the memory layout, and consumer groups. Long, and the best single document in the Redis docs.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xadd/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">XADD, XTRIM and the trimming options</span><span class="lc-sub">Exact vs approximate trimming, what the <code>~</code> really does to a radix node, <code>MINID</code>, <code>LIMIT</code>, and <code>NOMKSTREAM</code> for when you do not want to create the stream implicitly.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build an event log</span><span class="lc-sub">Graded exercises: append events and replay from a stored ID, block for new ones, add bounded trimming to a write path, and demonstrate that <code>XDEL</code> does not reduce <code>MEMORY USAGE</code>.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A stream is an append-only log with sortable <code>ms-seq</code> IDs, so "everything after the last ID I processed" is a cheap query and a restarted consumer resumes instead of losing a window — the property Pub/Sub structurally cannot offer. Reading does not consume: entries stay put, which is what makes acknowledgement, replay and redelivery possible at all. And a stream grows forever unless you bound it: put <code>MAXLEN ~ N</code> or <code>MINID</code> on every <code>XADD</code>, because <code>XDEL</code> only tombstones an entry inside a packed radix node and gives no memory back.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Stream: cuốn nhật ký biết nhớ</h2>
<p class="lead">Stream của Redis là một cuốn nhật ký chỉ ghi thêm: mục mới nối vào cuối, mỗi mục nhận một mã sắp xếp được, và không gì bị gỡ đi cho tới khi bạn ra lệnh. Đúng một tính chất ấy — <em>đọc xong nó vẫn còn đó</em> — là toàn bộ khác biệt so với Pub/Sub, và là thứ làm cho việc xác nhận, phát lại và giao lại trở nên khả thi.</p>

<h3>Ghi thêm và đọc lại</h3>
<pre><code>redis-cli DEL orders &gt;/dev/null
redis-cli XADD orders '*' sku 4201 qty 2 user 1042
redis-cli XADD orders '*' sku 8802 qty 1 user 1042
redis-cli XADD orders '*' sku 4201 qty 5 user 9001
redis-cli XLEN orders
redis-cli XRANGE orders - + COUNT 2
redis-cli XREVRANGE orders + - COUNT 1
redis-cli TYPE orders
redis-cli OBJECT ENCODING orders</code></pre>
<div class="out">"1755949214882-0"
"1755949214883-0"
"1755949214883-1"
(integer) 3
1) 1) "1755949214882-0"
   2) 1) "sku"
      2) "4201"
      3) "qty"
      4) "2"
      5) "user"
      6) "1042"
2) 1) "1755949214883-0"
   2) 1) "sku"
      2) "8802"
      3) "qty"
      4) "1"
      5) "user"
      6) "1042"
1) 1) "1755949214883-1"
   2) 1) "sku"
      2) "4201"
      3) "qty"
      4) "5"
      5) "user"
      6) "9001"
stream
"stream"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mã là mili-giây gạch số-thứ-tự</span><span class="lz-t">1755949214883-1</span><span class="lz-d">Nửa trái là đồng hồ của máy chủ tính bằng mili giây; nửa phải là bộ đếm tăng lên khi hai mục rơi vào cùng một mili giây. Ghép lại chúng là duy nhất và tăng nghiêm ngặt — chính điều đó làm cho "mọi thứ sau X" thành một truy vấn có nghĩa và rẻ tiền.</span></div>
  <div class="lz-step"><span class="lz-k"><code>*</code> nghĩa là "anh tự chọn đi"</span><span class="lz-t">và bạn gần như luôn muốn thế</span><span class="lz-d">Bạn cung cấp được mã tường minh, nhưng nó phải lớn hơn mã cuối cùng nếu không <code>XADD</code> báo lỗi. Mã tường minh là để nhập dữ liệu sẵn có với mốc thời gian đã biết; với lưu lượng sống thì hãy để Redis lo.</span></div>
  <div class="lz-step"><span class="lz-k">Mỗi mục là một tập cặp trường/giá trị</span><span class="lz-t">như một cái hash nhỏ, không phải một khối thô</span><span class="lz-d">Không phải một chuỗi đơn — mà là một ánh xạ phẳng. Tên trường lặp lại ở mỗi mục, nên tên ngắn có ý nghĩa khi khối lượng lớn, và vẫn cái luật "không lồng nhau" như với hash (Bài 5.3): một đối tượng lồng nhau đi vào dưới dạng chuỗi JSON trong một trường.</span></div>
  <div class="lz-step"><span class="lz-k"><code>-</code> và <code>+</code> là hai đầu mút</span><span class="lz-t">XRANGE key - + COUNT 100</span><span class="lz-d">Mã nhỏ nhất và lớn nhất có thể. <code>XRANGE</code> là O(log N + số mục) — nó dò vào cây radix chứ không quét, nên đọc một trăm mục từ giữa mười triệu là rẻ.</span></div>
</div>

<h3>Đọc các mục mới ngay khi chúng tới</h3>
<pre><code><span class="tok-comment"># $ nghĩa là "chỉ những mục thêm vào SAU khi lời gọi này bắt đầu chặn"</span>
redis-cli XREAD BLOCK 5000 STREAMS orders '$' &amp;
sleep 0.3
redis-cli XADD orders '*' sku 1111 qty 1 user 7
wait

<span class="tok-comment"># Một mã tường minh nghĩa là "mọi thứ nằm sau hẳn cái này" — phát lại</span>
redis-cli XREAD COUNT 2 STREAMS orders 0
redis-cli XREAD COUNT 10 STREAMS orders 1755949214883-0</code></pre>
<div class="out">1) 1) "orders"
   2) 1) 1) "1755949215104-0"
         2) 1) "sku"
            2) "1111"
            3) "qty"
            4) "1"
            5) "user"
            6) "7"
"1755949215104-0"
1) 1) "orders"
   2) 1) 1) "1755949214882-0"
         2) 1) "sku"
            2) "4201"
            3) "qty"
            4) "2"
            5) "user"
            6) "1042"
      2) 1) "1755949214883-0"
         2) 1) "sku"
            2) "8802"
            3) "qty"
            4) "1"
            5) "user"
            6) "1042"
1) 1) "orders"
   2) 1) 1) "1755949214883-1"
         2) 1) "sku"
            2) "4201"
            3) "qty"
            4) "5"
            5) "user"
            6) "9001"
      2) 1) "1755949215104-0"
         2) 1) "sku"
            2) "1111"
            3) "qty"
            4) "1"
            5) "user"
            6) "7"</div>
<div class="callout ok"><strong>Đây là tính chất mà Pub/Sub không có: một bên tiêu thụ vừa ngoại tuyến có thể xin lại mọi thứ nằm sau cái mã cuối cùng nó đã xử lý.</strong> Hãy lưu cái mã đó ở đâu đó bền vững, và một lần khởi động lại là một lần nối tiếp chứ không phải một cái lỗ hổng. <code>XREAD BLOCK</code> đỗ kết nối lại y hệt <code>BLPOP</code> (Bài 4.1) — khách chờ, máy chủ thì không — và <code>BLOCK 0</code> chờ mãi mãi. Một kết nối đọc được nhiều stream cùng lúc: <code>XREAD BLOCK 0 STREAMS a b c $ $ $</code>, với các mã liệt kê sau tất cả tên khoá, đó là mẩu cú pháp khó chịu duy nhất trong cả giao diện này.</div>

<h3>Cắt bớt: một cuốn nhật ký phình mãi là một chỗ rò bộ nhớ</h3>
<pre><code>redis-cli XLEN orders
redis-cli XADD orders MAXLEN '~' 1000 '*' sku 5 qty 1 user 3   <span class="tok-comment"># cắt ngay khi ghi</span>
redis-cli XTRIM orders MAXLEN 2                                 <span class="tok-comment"># chính xác, có chặn</span>
redis-cli XLEN orders
redis-cli XTRIM orders MINID 1755949214883                      <span class="tok-comment"># 6.2+: bỏ theo tuổi</span>
redis-cli XINFO STREAM orders | head -8</code></pre>
<div class="out">(integer) 4
"1755949215330-0"
(integer) 3
(integer) 2
(integer) 1
1) "length"
2) (integer) 1
3) "radix-tree-keys"
4) (integer) 1
5) "radix-tree-nodes"
6) (integer) 2
7) "last-generated-id"
8) "1755949215330-0"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>MAXLEN ~ 1000</code> mới là thứ bạn muốn</span><span class="v">Dấu <code>~</code> nghĩa là "xấp xỉ": Redis cắt tới ranh giới của một nút radix trọn vẹn, nên nó gỡ một lô với giá rẻ thay vì đi bộ tới đúng con số. Bạn nhận được "khoảng 1000, không bao giờ ít hơn", với O(1) khấu hao.</span></div>
  <div class="kv"><span class="k"><code>MAXLEN 1000</code> chính xác là O(N)</span><span class="v">Không có dấu ngã thì Redis gỡ từng mục một cho tới khi số lượng khớp chính xác. Trên một stream vượt xa cái trần thì đó là một phép chặn. Chỉ dùng cắt chính xác khi bạn thật sự cần đúng cái cận đó.</span></div>
  <div class="kv"><span class="k"><code>MINID</code> cắt theo tuổi, không theo số lượng</span><span class="v">Redis 6.2+. <code>XTRIM s MINID &lt;ms&gt;</code> bỏ mọi thứ cũ hơn một mốc thời gian, và điều đó khớp với cách người ta thường diễn đạt chính sách lưu trữ ("giữ 7 ngày") tốt hơn hẳn một con số đếm.</span></div>
  <div class="kv"><span class="k">Hãy cắt ngay trong <code>XADD</code>, đừng cắt bằng cron</span><span class="v"><code>XADD s MAXLEN ~ 10000 * …</code> giữ cho cái trần được áp liên tục và chẳng tốn gì. Một việc cắt chạy mỗi đêm nghĩa là cái stream không có trần suốt 23 tiếng mỗi ngày.</span></div>
  <div class="kv"><span class="k"><code>LIMIT</code> chặn khối lượng việc mỗi lời gọi</span><span class="v"><code>XTRIM s MAXLEN ~ 1000 LIMIT 100</code> gỡ nhiều nhất 100 mục trong lời gọi này. Đó là cách an toàn để thu nhỏ một stream đã vượt tầm kiểm soát: chạy nó nhiều lần thay vì một lần.</span></div>
</div>

<h3>Bộ nhớ, và cái việc mà XDEL không làm</h3>
<pre><code>redis-cli DEL big &gt;/dev/null
python3 -c "
for i in range(200_000): print(f'XADD big * seq {i} payload value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli XLEN big
redis-cli MEMORY USAGE big
redis-cli XINFO STREAM big | grep -A1 radix-tree-nodes
redis-cli XDEL big $(redis-cli XRANGE big - + COUNT 1 | head -1)
redis-cli XLEN big
redis-cli MEMORY USAGE big</code></pre>
<div class="out">(integer) 200000
17441216
3) "radix-tree-nodes"
4) (integer) 1638
(integer) 1
(integer) 199999
17441216</div>
<div class="pitfall"><strong>Cái bẫy:</strong> trông đợi <code>XDEL</code> trả lại bộ nhớ. Nó không trả, và lý do nằm ở cách lưu trữ: một stream là một cây radix gồm các <em>nút vĩ mô</em>, mỗi nút nhồi nhiều mục vào một khối liền mạch cho gọn — đó là vì sao 200.000 mục vừa trong 17 MB, ít hơn nhiều so với 200.000 khoá riêng lẻ (Bài 5.2). <code>XDEL</code> không thể viết lại phần giữa của một nút đã nhồi chặt, nên nó đánh dấu mục đó là đã xoá và để nguyên số byte tại chỗ; bộ nhớ chỉ về khi mọi mục trong nút đó đều biến mất và cả cái nút được giải phóng. Vậy nên một khuôn "xoá dần khi xử lý xong" tạo ra một stream mà <code>XLEN</code> tụt đều đặn trong khi <code>MEMORY USAGE</code> không nhúc nhích chút nào — đó chính xác là hình dáng của một sự cố mà hàng đợi nhìn thì rỗng còn cái máy vẫn ở 90% bộ nhớ. Đừng quản lý kích thước stream bằng <code>XDEL</code>. Hãy dùng <code>MAXLEN ~</code> hoặc <code>MINID</code> ở mỗi lệnh <code>XADD</code>, vốn cắt trọn từng nút từ phía đầu và thật sự giải phóng chúng, và hãy để dành <code>XDEL</code> cho trường hợp hiếm là gỡ một mục cụ thể (một thông điệp chứa dữ liệu bạn buộc phải xoá) chứ đừng dùng nó làm cơ chế lưu trữ.</div>

<h3>Thứ bạn có mà một cái list không cho được</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mục vẫn sống sót sau khi được đọc</span><span class="lz-lnote">List thì lấy ra là mất: phần tử biến đi, và một worker sập sau khi lấy ra là mất luôn nó (Bài 4.1). Một lượt đọc stream để nguyên mục ở đó, nên việc giao lại mới khả thi. Toàn bộ Bài 8.3 và 8.4 dựng lên trên đúng khác biệt này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều bên đọc độc lập, mỗi bên ở vị trí riêng</span><span class="lz-lnote">Mười dịch vụ đều tiêu thụ được cùng một stream từ mã cuối-cùng-đã-thấy của riêng mình mà không giẫm chân nhau, vì đọc không phải là phá huỷ. Với một cái list thì bên nào lấy ra trước thì thắng và những bên khác chẳng được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thời gian nằm sẵn trong cái mã</span><span class="lz-lnote">"Mọi thứ trong một giờ qua" chính là <code>XRANGE s &lt;ms-1h&gt; +</code> — không chỉ mục phụ, không sorted set, không khoá thêm. Cách đánh mã làm cho cuốn nhật ký truy vấn được theo thời gian, miễn phí.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trường có cấu trúc, không phải chuỗi mờ đục</span><span class="lz-lnote">Một mục là một ánh xạ, nên bên tiêu thụ đọc được một trường mà không phải giải mã cả gói dữ liệu, và một lược đồ lớn lên được bằng cách thêm trường mà các bên tiêu thụ cũ bỏ qua.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Streams</span><span class="lc-sub">Bài hướng dẫn đầy đủ: mã, <code>XADD</code>/<code>XRANGE</code>/<code>XREAD</code>, các chiến lược cắt bớt, cách bố trí bộ nhớ, và nhóm tiêu thụ. Dài, và là tài liệu đơn lẻ hay nhất trong bộ tài liệu Redis.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xadd/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">XADD, XTRIM và các tuỳ chọn cắt bớt</span><span class="lc-sub">Cắt chính xác với cắt xấp xỉ, dấu <code>~</code> thật ra làm gì với một nút radix, <code>MINID</code>, <code>LIMIT</code>, và <code>NOMKSTREAM</code> cho lúc bạn không muốn stream được tạo ngầm.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một cuốn nhật ký sự kiện</span><span class="lc-sub">Bài chấm điểm: ghi thêm sự kiện rồi phát lại từ một mã đã lưu, chặn để chờ mục mới, thêm phép cắt có trần vào nhánh ghi, và chứng minh rằng <code>XDEL</code> không làm giảm <code>MEMORY USAGE</code>.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Stream là một cuốn nhật ký chỉ ghi thêm với mã <code>ms-seq</code> sắp xếp được, nên "mọi thứ sau cái mã cuối tôi đã xử lý" là một truy vấn rẻ và một bên tiêu thụ vừa khởi động lại sẽ nối tiếp chứ không mất một cửa sổ — đúng tính chất mà Pub/Sub về mặt cấu trúc không cho được. Đọc thì không tiêu thụ: các mục nằm nguyên đó, và chính điều đó làm cho việc xác nhận, phát lại và giao lại khả thi. Và một stream phình mãi trừ khi bạn chặn nó lại: hãy đặt <code>MAXLEN ~ N</code> hoặc <code>MINID</code> lên mỗi lệnh <code>XADD</code>, vì <code>XDEL</code> chỉ dựng bia mộ cho một mục nằm trong một nút radix đã nhồi chặt và chẳng trả lại byte nào.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Consumer groups: competing workers, done right|||8.3 — Nhóm tiêu thụ: các worker tranh việc, làm cho đúng',
      slug: 'rd-8-3-consumer-group',
      type: 'LESSON',
      description: 'XGROUP CREATE, XREADGROUP với dấu > và với mã tường minh, danh sách chờ PEL là trái tim của cả cơ chế, XACK, đọc XINFO GROUPS để biết ai đang tụt lại, và vì sao giao ít-nhất-một-lần bắt bạn phải làm việc lặp-lại-vô-hại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Consumer groups: competing workers, done right</h2>
<p class="lead">A plain <code>XREAD</code> gives every reader every entry — useful for fan-out, useless for a work queue where each job must be done once. A consumer group splits the stream between its members, remembers who was given what, and does not consider an entry finished until someone says so.</p>

<h3>Creating a group and reading from it</h3>
<pre><code>redis-cli DEL orders &gt;/dev/null
redis-cli XGROUP CREATE orders billing '$' MKSTREAM
redis-cli XADD orders '*' order 1 amount 100 &gt;/dev/null
redis-cli XADD orders '*' order 2 amount 250 &gt;/dev/null
redis-cli XADD orders '*' order 3 amount 75  &gt;/dev/null
<span class="tok-comment"># Two workers pull from the same group — entries are SPLIT, not copied</span>
redis-cli XREADGROUP GROUP billing worker-1 COUNT 2 STREAMS orders '&gt;'
redis-cli XREADGROUP GROUP billing worker-2 COUNT 2 STREAMS orders '&gt;'</code></pre>
<div class="out">OK
1) 1) "orders"
   2) 1) 1) "1755949301001-0"
         2) 1) "order"
            2) "1"
            3) "amount"
            4) "100"
      2) 1) "1755949301001-1"
         2) 1) "order"
            2) "2"
            3) "amount"
            4) "250"
1) 1) "orders"
   2) 1) 1) "1755949301002-0"
         2) 1) "order"
            2) "3"
            3) "amount"
            4) "75"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$</code> vs <code>0</code> at creation</span><span class="v"><code>$</code> starts the group at the current end — only new entries. <code>0</code> starts at the beginning, so the group replays the entire history. Pick deliberately: <code>0</code> on a stream with a million old entries will deliver all of them.</span></div>
  <div class="kv"><span class="k"><code>MKSTREAM</code> creates the stream if absent</span><span class="v">Without it, <code>XGROUP CREATE</code> on a stream that does not exist yet is an error — which bites every time a consumer deploys before its first producer runs.</span></div>
  <div class="kv"><span class="k">Consumers are created implicitly</span><span class="v">Naming a consumer in <code>XREADGROUP</code> creates it. No registration step — which is convenient and means a typo silently creates <code>worekr-1</code> with its own pending list.</span></div>
  <div class="kv"><span class="k">Groups are independent of each other</span><span class="v"><code>billing</code> and <code>analytics</code> on the same stream each get every entry, each with their own position and pending list. Split <em>within</em> a group, fan out <em>across</em> groups — that combination is the whole design.</span></div>
  <div class="kv"><span class="k">The consumer name should be stable</span><span class="v">Use the pod name or a persistent worker ID, not a random UUID per process start. A restarted consumer with a new name abandons its old pending entries to a consumer that no longer exists (Lesson 8.4).</span></div>
</div>

<h3>The PEL: the part that makes it a queue</h3>
<pre><code>redis-cli XPENDING orders billing
redis-cli XPENDING orders billing - + 10
redis-cli XACK orders billing 1755949301001-0
redis-cli XPENDING orders billing
<span class="tok-comment"># An explicit ID (not &gt;) re-reads THIS consumer's still-pending entries</span>
redis-cli XREADGROUP GROUP billing worker-1 STREAMS orders 0</code></pre>
<div class="out">1) (integer) 3
2) "1755949301001-0"
3) "1755949301002-0"
4) 1) 1) "worker-1"
      2) "2"
   2) 1) "worker-2"
      2) "1"
1) 1) "1755949301001-0"
   2) "worker-1"
   3) (integer) 18442
   4) (integer) 1
2) 1) "1755949301001-1"
   2) "worker-1"
   3) (integer) 18442
   4) (integer) 1
3) 1) "1755949301002-0"
   2) "worker-2"
   3) (integer) 12007
   4) (integer) 1
(integer) 1
1) (integer) 2
2) "1755949301001-1"
3) "1755949301002-0"
4) 1) 1) "worker-1"
      2) "1"
   2) 1) "worker-2"
      2) "1"
1) 1) "orders"
   2) 1) 1) "1755949301001-1"
         2) 1) "order"
            2) "2"
            3) "amount"
            4) "250"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Delivery adds to the PEL</span><span class="lz-t">Pending Entries List, per group</span><span class="lz-d">The instant an entry is handed to a consumer it is recorded: which entry, which consumer, when it was delivered, and how many times. Until it is acknowledged, the group considers it in flight — not done, not lost.</span></div>
  <div class="lz-step"><span class="lz-k"><code>XACK</code> removes it</span><span class="lz-t">and only then is the entry finished</span><span class="lz-d">Acknowledge <em>after</em> the work succeeds, never before. An <code>XACK</code> before processing turns the group into a plain <code>XREAD</code> with extra steps and no recovery.</span></div>
  <div class="lz-step"><span class="lz-k"><code>&gt;</code> means "entries never delivered to anyone"</span><span class="lz-t">the normal path</span><span class="lz-d">Each call advances the group's <code>last-delivered-id</code> and hands out fresh entries. This is what a worker asks for in steady state.</span></div>
  <div class="lz-step"><span class="lz-k">An explicit ID means "my own pending entries"</span><span class="lz-t">XREADGROUP … STREAMS orders 0</span><span class="lz-d">It re-reads what <em>this</em> consumer was given and has not acknowledged — the recovery path after a crash. It never returns another consumer's pending entries; that is what <code>XCLAIM</code> is for (Lesson 8.4).</span></div>
</div>
<div class="callout warn"><strong><code>NOACK</code> exists and is almost always the wrong choice.</strong> <code>XREADGROUP GROUP g c NOACK STREAMS s &gt;</code> skips the PEL entirely: the entry is delivered and immediately considered done. That gives you at-most-once delivery — a crashed worker loses its entries with no trace — which is the guarantee Pub/Sub already offers for free. The only defensible use is a high-volume, loss-tolerant stream where PEL bookkeeping is measurably the bottleneck. If you find <code>NOACK</code> in a codebase, assume it was added to make a bug go away.</div>

<h3>The worker loop, in full</h3>
<pre><code>const STREAM = 'orders', GROUP = 'billing';
const CONSUMER = process.env.POD_NAME ?? 'worker-1';   <span class="tok-comment">// stable, not random</span>

<span class="tok-comment">// Create the group once; ignore BUSYGROUP if it already exists</span>
try { await redis.xGroupCreate(STREAM, GROUP, '$', { MKSTREAM: true }); }
catch (e) { if (!String(e).includes('BUSYGROUP')) throw e; }

async function run() {
  <span class="tok-comment">// 1. On startup, finish anything this consumer left pending</span>
  await drain('0');

  <span class="tok-comment">// 2. Then loop on new entries forever</span>
  for (;;) await drain('&gt;');
}

async function drain(from) {
  const res = await redis.xReadGroup(
    GROUP, CONSUMER,
    [{ key: STREAM, id: from }],
    { COUNT: 10, BLOCK: 5000 },
  );
  if (!res) return;                       <span class="tok-comment">// BLOCK timed out — normal</span>

  for (const { messages } of res) {
    for (const { id, message } of messages) {
      try {
        await handle(message);            <span class="tok-comment">// must be idempotent — see below</span>
        await redis.xAck(STREAM, GROUP, id);
      } catch (err) {
        log.error({ id, err }, 'handler failed; leaving in PEL for retry');
      }
    }
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Drain <code>0</code> before looping on <code>&gt;</code></span><span class="v">A consumer that restarts and goes straight to <code>&gt;</code> never revisits what it was holding when it died. Those entries sit in the PEL until something claims them (Lesson 8.4) — draining on startup is the cheap half of that.</span></div>
  <div class="kv"><span class="k">A failed handler should <em>not</em> ack</span><span class="v">Leaving the entry in the PEL is how it gets retried. Acknowledging in a <code>finally</code> block is the bug that turns a retryable failure into a silently dropped job.</span></div>
  <div class="kv"><span class="k"><code>BLOCK</code> returning null is normal</span><span class="v">It means the timeout elapsed with nothing new. Loop again. Treating it as an error produces a worker that logs a warning every five seconds forever.</span></div>
  <div class="kv"><span class="k">Blocking needs its own connection</span><span class="v">The socket is unusable while parked (Lesson 1.5). A worker that blocks on its main client will find every other command hanging behind it.</span></div>
  <div class="kv"><span class="k"><code>COUNT</code> is a batch, not a prefetch</span><span class="v">All ten entries land in your PEL at once. If your handler takes a second each, entry ten sits pending for ten seconds and looks stalled to a sweeper. Match <code>COUNT</code> to how fast you actually process.</span></div>
</div>

<h3>Seeing who is behind</h3>
<pre><code>redis-cli XINFO GROUPS orders
redis-cli XINFO CONSUMERS orders billing</code></pre>
<div class="out">1)  1) "name"
    2) "billing"
    3) "consumers"
    4) (integer) 2
    5) "pending"
    6) (integer) 2
    7) "last-delivered-id"
    8) "1755949301002-0"
    9) "entries-read"
   10) (integer) 3
   11) "lag"
   12) (integer) 0
1) 1) "name"
   2) "worker-1"
   3) "pending"
   4) (integer) 1
   5) "idle"
   6) (integer) 62114
   7) "inactive"
   8) (integer) 62114
2) 1) "name"
   2) "worker-2"
   3) "pending"
   4) (integer) 1
   5) "idle"
   6) (integer) 55880
   7) "inactive"
   8) (integer) 55880</div>
<div class="callout ok"><strong>Four numbers are worth a dashboard.</strong> <code>lag</code> (Redis 7.0+) is entries added to the stream that this group has not read yet — the queue depth, and the one metric that tells you whether workers are keeping up. <code>pending</code> is entries delivered but not acknowledged; a steadily rising pending count with a flat lag means your handlers are failing, not that you are behind. <code>idle</code> per consumer is milliseconds since it last read anything — a consumer idle for minutes while lag climbs is a dead worker whose process is still running. And the number of <code>consumers</code> is your worker count, visible, exactly like <code>blocked_clients</code> in Lesson 4.1.</div>

<div class="pitfall"><strong>Pitfall:</strong> assuming exactly-once. A consumer group gives you <strong>at-least-once</strong> delivery, and the gap is unavoidable rather than a missing feature. Your handler charges a card, then the process dies before <code>XACK</code> — the entry is still pending, a sweeper reclaims it, and it is delivered again to a worker that has no idea the charge already happened. Acknowledging first instead just moves the hole: ack, then die before the work, and the job is gone with nothing recording it. There is no ordering of "do the work" and "acknowledge" that is atomic across Redis and the outside world, for exactly the reason Lesson 6.4 gave — two systems, no shared transaction. So the requirement lands on your handler: <strong>make it idempotent.</strong> Use the stream entry ID as the idempotency key (<code>SET done:&lt;id&gt; 1 NX EX 86400</code>, and skip if it was already set), or a unique constraint on <code>(order_id)</code> in the database, or an idempotency key on the payment API so the provider deduplicates for you (Lesson 7.5). Write down which of those you rely on, per handler, because "this can be delivered twice" is a property of the system that no amount of careful <code>XACK</code> placement removes.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/#consumer-groups" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">Stream consumer groups</span><span class="lc-sub">The official walkthrough: group creation, <code>&gt;</code> vs explicit IDs, the PEL, acknowledgement and recovery. It is written as a tutorial and rewards reading it in order.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xinfo-groups/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">XINFO GROUPS and lag</span><span class="lc-sub">What <code>entries-read</code> and <code>lag</code> mean, when <code>lag</code> can come back <code>nil</code> (after <code>XDEL</code> or an exact trim), and what to alert on.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a worker pool</span><span class="lc-sub">Graded exercises: write the full loop with startup drain, prove two consumers split rather than duplicate, find the bug in a handler that acks in a <code>finally</code>, and make a non-idempotent handler safe against redelivery.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A group splits entries between its consumers while separate groups each get everything — split within, fan out across — and the PEL is what makes it a queue: delivery records the entry, and only <code>XACK</code> after successful work removes it. Read with <code>&gt;</code> in steady state and with an explicit <code>0</code> on startup to finish what this consumer left pending, use a stable consumer name, and never acknowledge in a <code>finally</code>. And the guarantee is at-least-once, not exactly-once — no placement of <code>XACK</code> closes the gap between doing the work and recording that you did, so every handler needs an idempotency key, and the stream entry ID is one you already have.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Nhóm tiêu thụ: các worker tranh việc, làm cho đúng</h2>
<p class="lead">Một lệnh <code>XREAD</code> thường đưa mọi mục cho mọi bên đọc — hữu ích để toả ra, vô dụng cho một hàng đợi việc mà mỗi việc chỉ được làm một lần. Một nhóm tiêu thụ chia cái stream giữa các thành viên của nó, nhớ ai được giao cái gì, và không coi một mục là xong cho tới khi có người nói vậy.</p>

<h3>Tạo một nhóm và đọc từ nó</h3>
<pre><code>redis-cli DEL orders &gt;/dev/null
redis-cli XGROUP CREATE orders billing '$' MKSTREAM
redis-cli XADD orders '*' order 1 amount 100 &gt;/dev/null
redis-cli XADD orders '*' order 2 amount 250 &gt;/dev/null
redis-cli XADD orders '*' order 3 amount 75  &gt;/dev/null
<span class="tok-comment"># Hai worker lấy từ cùng một nhóm — các mục được CHIA, không nhân bản</span>
redis-cli XREADGROUP GROUP billing worker-1 COUNT 2 STREAMS orders '&gt;'
redis-cli XREADGROUP GROUP billing worker-2 COUNT 2 STREAMS orders '&gt;'</code></pre>
<div class="out">OK
1) 1) "orders"
   2) 1) 1) "1755949301001-0"
         2) 1) "order"
            2) "1"
            3) "amount"
            4) "100"
      2) 1) "1755949301001-1"
         2) 1) "order"
            2) "2"
            3) "amount"
            4) "250"
1) 1) "orders"
   2) 1) 1) "1755949301002-0"
         2) 1) "order"
            2) "3"
            3) "amount"
            4) "75"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$</code> so với <code>0</code> lúc tạo nhóm</span><span class="v"><code>$</code> đặt nhóm ở cuối hiện tại — chỉ những mục mới. <code>0</code> đặt ở đầu, nên nhóm phát lại toàn bộ lịch sử. Hãy chọn có chủ ý: <code>0</code> trên một stream có một triệu mục cũ sẽ giao hết cả triệu.</span></div>
  <div class="kv"><span class="k"><code>MKSTREAM</code> tạo stream nếu chưa có</span><span class="v">Không có nó thì <code>XGROUP CREATE</code> trên một stream chưa tồn tại là một lỗi — chuyện cắn bạn mỗi lần bên tiêu thụ được deploy trước khi bên sản xuất chạy lần đầu.</span></div>
  <div class="kv"><span class="k">Bên tiêu thụ được tạo ngầm</span><span class="v">Gọi tên một consumer trong <code>XREADGROUP</code> là tạo ra nó. Không có bước đăng ký nào — vừa tiện vừa nghĩa là một lỗi gõ sẽ âm thầm tạo ra <code>worekr-1</code> với danh sách chờ riêng của nó.</span></div>
  <div class="kv"><span class="k">Các nhóm độc lập với nhau</span><span class="v"><code>billing</code> và <code>analytics</code> trên cùng một stream thì mỗi nhóm nhận mọi mục, mỗi nhóm có vị trí và danh sách chờ riêng. Chia <em>bên trong</em> một nhóm, toả ra <em>giữa các</em> nhóm — tổ hợp đó chính là toàn bộ thiết kế.</span></div>
  <div class="kv"><span class="k">Tên consumer nên ổn định</span><span class="v">Hãy dùng tên pod hay một mã worker bền vững, đừng dùng một UUID ngẫu nhiên cho mỗi lần khởi động tiến trình. Một consumer khởi động lại với tên mới sẽ bỏ rơi các mục đang chờ cũ của nó cho một consumer không còn tồn tại (Bài 8.4).</span></div>
</div>

<h3>PEL: phần làm cho nó thành một hàng đợi</h3>
<pre><code>redis-cli XPENDING orders billing
redis-cli XPENDING orders billing - + 10
redis-cli XACK orders billing 1755949301001-0
redis-cli XPENDING orders billing
<span class="tok-comment"># Một mã tường minh (không phải &gt;) đọc lại các mục CÒN CHỜ của chính consumer này</span>
redis-cli XREADGROUP GROUP billing worker-1 STREAMS orders 0</code></pre>
<div class="out">1) (integer) 3
2) "1755949301001-0"
3) "1755949301002-0"
4) 1) 1) "worker-1"
      2) "2"
   2) 1) "worker-2"
      2) "1"
1) 1) "1755949301001-0"
   2) "worker-1"
   3) (integer) 18442
   4) (integer) 1
2) 1) "1755949301001-1"
   2) "worker-1"
   3) (integer) 18442
   4) (integer) 1
3) 1) "1755949301002-0"
   2) "worker-2"
   3) (integer) 12007
   4) (integer) 1
(integer) 1
1) (integer) 2
2) "1755949301001-1"
3) "1755949301002-0"
4) 1) 1) "worker-1"
      2) "1"
   2) 1) "worker-2"
      2) "1"
1) 1) "orders"
   2) 1) 1) "1755949301001-1"
         2) 1) "order"
            2) "2"
            3) "amount"
            4) "250"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Việc giao hàng ghi vào PEL</span><span class="lz-t">Pending Entries List, mỗi nhóm một cái</span><span class="lz-d">Ngay khoảnh khắc một mục được trao cho một consumer, nó được ghi lại: mục nào, consumer nào, giao lúc nào, và đã giao bao nhiêu lần. Cho tới khi được xác nhận, nhóm coi nó là đang bay — chưa xong, chưa mất.</span></div>
  <div class="lz-step"><span class="lz-k"><code>XACK</code> gỡ nó ra</span><span class="lz-t">và chỉ khi đó mục mới thật sự xong</span><span class="lz-d">Hãy xác nhận <em>sau khi</em> công việc thành công, đừng bao giờ trước. Một lệnh <code>XACK</code> đặt trước phần xử lý biến cái nhóm thành một lệnh <code>XREAD</code> thường kèm thêm vài bước thừa và không có đường hồi phục nào.</span></div>
  <div class="lz-step"><span class="lz-k"><code>&gt;</code> nghĩa là "những mục chưa từng giao cho ai"</span><span class="lz-t">đường đi bình thường</span><span class="lz-d">Mỗi lời gọi đẩy <code>last-delivered-id</code> của nhóm tiến lên và phát ra các mục mới tinh. Đây là thứ một worker xin trong trạng thái ổn định.</span></div>
  <div class="lz-step"><span class="lz-k">Một mã tường minh nghĩa là "các mục đang chờ của chính tôi"</span><span class="lz-t">XREADGROUP … STREAMS orders 0</span><span class="lz-d">Nó đọc lại những gì <em>consumer này</em> đã được giao mà chưa xác nhận — đường hồi phục sau một cú sập. Nó không bao giờ trả về mục đang chờ của consumer khác; đó là việc của <code>XCLAIM</code> (Bài 8.4).</span></div>
</div>
<div class="callout warn"><strong><code>NOACK</code> có tồn tại và gần như luôn là lựa chọn sai.</strong> <code>XREADGROUP GROUP g c NOACK STREAMS s &gt;</code> bỏ qua PEL hoàn toàn: mục được giao và lập tức bị coi là xong. Điều đó cho bạn giao nhiều-nhất-một-lần — một worker sập là mất các mục của nó mà không để lại dấu vết — vốn là bảo đảm mà Pub/Sub đã cho không rồi. Cách dùng bảo vệ được duy nhất là một stream khối lượng cực lớn, chịu mất được, mà việc ghi sổ PEL đo được là nút thắt cổ chai. Nếu bạn thấy <code>NOACK</code> trong một kho mã, hãy giả định nó được thêm vào để làm một cái lỗi biến đi.</div>

<h3>Vòng lặp worker, đầy đủ</h3>
<pre><code>const STREAM = 'orders', GROUP = 'billing';
const CONSUMER = process.env.POD_NAME ?? 'worker-1';   <span class="tok-comment">// ổn định, không ngẫu nhiên</span>

<span class="tok-comment">// Tạo nhóm một lần; bỏ qua BUSYGROUP nếu nó đã tồn tại</span>
try { await redis.xGroupCreate(STREAM, GROUP, '$', { MKSTREAM: true }); }
catch (e) { if (!String(e).includes('BUSYGROUP')) throw e; }

async function run() {
  <span class="tok-comment">// 1. Lúc khởi động, làm nốt những gì consumer này còn để chờ</span>
  await drain('0');

  <span class="tok-comment">// 2. Rồi lặp trên các mục mới, mãi mãi</span>
  for (;;) await drain('&gt;');
}

async function drain(from) {
  const res = await redis.xReadGroup(
    GROUP, CONSUMER,
    [{ key: STREAM, id: from }],
    { COUNT: 10, BLOCK: 5000 },
  );
  if (!res) return;                       <span class="tok-comment">// BLOCK hết giờ — bình thường</span>

  for (const { messages } of res) {
    for (const { id, message } of messages) {
      try {
        await handle(message);            <span class="tok-comment">// phải lặp-lại-vô-hại — xem bên dưới</span>
        await redis.xAck(STREAM, GROUP, id);
      } catch (err) {
        log.error({ id, err }, 'handler failed; leaving in PEL for retry');
      }
    }
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vét <code>0</code> trước khi lặp trên <code>&gt;</code></span><span class="v">Một consumer khởi động lại rồi đi thẳng vào <code>&gt;</code> sẽ không bao giờ ngó lại những gì nó đang ôm lúc chết. Những mục đó nằm lì trong PEL cho tới khi có thứ gì đó đòi lấy (Bài 8.4) — vét lúc khởi động là nửa rẻ tiền của chuyện ấy.</span></div>
  <div class="kv"><span class="k">Một handler thất bại thì <em>không</em> được ack</span><span class="v">Để mục nằm lại trong PEL chính là cách nó được thử lại. Xác nhận trong một khối <code>finally</code> là cái lỗi biến một thất bại thử-lại-được thành một việc bị vứt đi âm thầm.</span></div>
  <div class="kv"><span class="k"><code>BLOCK</code> trả null là bình thường</span><span class="v">Nó nghĩa là hết giờ chờ mà không có gì mới. Cứ lặp lại. Coi đó là lỗi sẽ sinh ra một worker ghi một cảnh báo mỗi năm giây, mãi mãi.</span></div>
  <div class="kv"><span class="k">Việc chặn cần kết nối riêng của nó</span><span class="v">Cái socket không dùng được trong lúc đang đỗ (Bài 1.5). Một worker chặn trên thư viện khách chính sẽ thấy mọi lệnh khác treo xếp hàng sau nó.</span></div>
  <div class="kv"><span class="k"><code>COUNT</code> là một lô, không phải nạp trước</span><span class="v">Cả mười mục rơi vào PEL của bạn cùng lúc. Nếu handler của bạn mất một giây mỗi mục thì mục thứ mười nằm chờ mười giây và trông như bị kẹt dưới mắt một tiến trình quét. Hãy khớp <code>COUNT</code> với tốc độ xử lý thật của bạn.</span></div>
</div>

<h3>Nhìn xem ai đang tụt lại</h3>
<pre><code>redis-cli XINFO GROUPS orders
redis-cli XINFO CONSUMERS orders billing</code></pre>
<div class="out">1)  1) "name"
    2) "billing"
    3) "consumers"
    4) (integer) 2
    5) "pending"
    6) (integer) 2
    7) "last-delivered-id"
    8) "1755949301002-0"
    9) "entries-read"
   10) (integer) 3
   11) "lag"
   12) (integer) 0
1) 1) "name"
   2) "worker-1"
   3) "pending"
   4) (integer) 1
   5) "idle"
   6) (integer) 62114
   7) "inactive"
   8) (integer) 62114
2) 1) "name"
   2) "worker-2"
   3) "pending"
   4) (integer) 1
   5) "idle"
   6) (integer) 55880
   7) "inactive"
   8) (integer) 55880</div>
<div class="callout ok"><strong>Bốn con số đáng dựng thành một bảng điều khiển.</strong> <code>lag</code> (Redis 7.0+) là số mục đã thêm vào stream mà nhóm này chưa đọc — độ sâu hàng đợi, và là chỉ số duy nhất nói cho bạn biết các worker có theo kịp không. <code>pending</code> là số mục đã giao mà chưa xác nhận; số pending tăng đều trong khi lag phẳng nghĩa là các handler của bạn đang thất bại, chứ không phải bạn đang tụt lại. <code>idle</code> theo từng consumer là số mili giây kể từ lần cuối nó đọc thứ gì — một consumer nằm im hàng phút trong khi lag leo dốc là một worker đã chết mà tiến trình vẫn còn chạy. Và số <code>consumers</code> chính là số worker của bạn, nhìn thấy được, y hệt <code>blocked_clients</code> ở Bài 4.1.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> tưởng rằng đây là đúng-một-lần. Một nhóm tiêu thụ cho bạn giao <strong>ít nhất một lần</strong>, và cái khe hở đó là không tránh khỏi chứ không phải một tính năng còn thiếu. Handler của bạn quẹt thẻ, rồi tiến trình chết trước lệnh <code>XACK</code> — mục vẫn đang chờ, một tiến trình quét đòi lại nó, và nó được giao lần nữa cho một worker chẳng biết gì về việc đã quẹt thẻ rồi. Xác nhận trước thay vì sau thì chỉ dời cái lỗ đi: ack xong rồi chết trước khi làm việc, thế là việc mất mà chẳng có gì ghi lại. Không có thứ tự nào giữa "làm việc" và "xác nhận" mà nguyên tử được xuyên qua Redis và thế giới bên ngoài, đúng vì cái lý do Bài 6.4 đã nêu — hai hệ thống, không có giao dịch chung. Nên yêu cầu rơi xuống handler của bạn: <strong>hãy làm nó lặp-lại-vô-hại.</strong> Hãy dùng chính mã mục của stream làm khoá chống trùng (<code>SET done:&lt;id&gt; 1 NX EX 86400</code>, và bỏ qua nếu nó đã được đặt), hoặc một ràng buộc duy nhất trên <code>(order_id)</code> trong cơ sở dữ liệu, hoặc một khoá chống trùng trên API thanh toán để nhà cung cấp tự khử trùng hộ bạn (Bài 7.5). Hãy ghi ra giấy bạn đang dựa vào cái nào, cho từng handler, vì "cái này có thể được giao hai lần" là một tính chất của hệ thống mà không mức đặt <code>XACK</code> cẩn thận nào gỡ bỏ được.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/#consumer-groups" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">Stream consumer groups</span><span class="lc-sub">Bài đi qua từng bước chính thức: tạo nhóm, <code>&gt;</code> so với mã tường minh, PEL, xác nhận và hồi phục. Nó viết theo lối hướng dẫn và đáng đọc đúng thứ tự.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xinfo-groups/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">XINFO GROUPS và lag</span><span class="lc-sub"><code>entries-read</code> và <code>lag</code> nghĩa là gì, khi nào <code>lag</code> trả về <code>nil</code> (sau <code>XDEL</code> hay một lần cắt chính xác), và nên đặt cảnh báo cho cái gì.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một dàn worker</span><span class="lc-sub">Bài chấm điểm: viết trọn vòng lặp kèm phần vét lúc khởi động, chứng minh hai consumer chia việc chứ không nhân đôi, tìm lỗi trong một handler ack trong khối <code>finally</code>, và làm cho một handler không lặp-lại-vô-hại trở nên an toàn trước việc giao lại.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một nhóm chia các mục cho các consumer của nó trong khi các nhóm riêng biệt thì mỗi nhóm nhận đủ mọi thứ — chia bên trong, toả ra bên ngoài — và PEL là thứ làm cho nó thành một hàng đợi: việc giao hàng ghi lại cái mục, và chỉ lệnh <code>XACK</code> sau khi làm việc thành công mới gỡ nó ra. Hãy đọc bằng <code>&gt;</code> ở trạng thái ổn định và bằng <code>0</code> tường minh lúc khởi động để làm nốt những gì consumer này còn để chờ, hãy dùng tên consumer ổn định, và đừng bao giờ xác nhận trong một khối <code>finally</code>. Và cái bảo đảm là ít-nhất-một-lần chứ không phải đúng-một-lần — không cách đặt <code>XACK</code> nào bịt được khe hở giữa việc làm xong và việc ghi lại rằng bạn đã làm, nên mọi handler đều cần một khoá chống trùng, và mã mục của stream là một cái bạn vốn đã có sẵn.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — When a worker dies: claiming, retries and dead letters|||8.4 — Khi một worker chết: đòi việc, thử lại và thư chết',
      slug: 'rd-8-4-xclaim',
      type: 'LESSON',
      description: 'Các mục kẹt trong PEL của một consumer không bao giờ quay lại, XPENDING với bộ lọc IDLE, XCLAIM và XAUTOCLAIM, bộ đếm số lần giao là thứ phát hiện thông điệp độc, và một stream thư-chết viết ra đầy đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>When a worker dies: claiming, retries and dead letters</h2>
<p class="lead">A consumer group records who was given what, and then does absolutely nothing about it. If <code>worker-3</code> takes twenty entries and its pod is killed, those twenty sit in the pending list forever — visible, unacknowledged, and nobody's job. Redis gives you the tools to reassign them; the policy is yours to write.</p>

<h3>Finding what is stuck</h3>
<pre><code><span class="tok-comment"># Simulate: worker-3 takes work and never comes back</span>
redis-cli XADD orders '*' order 9 amount 500 &gt;/dev/null
redis-cli XREADGROUP GROUP billing worker-3 COUNT 5 STREAMS orders '&gt;' &gt;/dev/null
sleep 2
redis-cli XPENDING orders billing IDLE 1000 - + 10          <span class="tok-comment"># 6.2+: filter by idle</span>
redis-cli XINFO CONSUMERS orders billing | grep -A1 -E "worker-3|idle"</code></pre>
<div class="out">1) 1) "1755949301003-0"
   2) "worker-3"
   3) (integer) 2014
   4) (integer) 1
1) "name"
2) "worker-3"
5) "idle"
6) (integer) 2014</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The four fields of an <code>XPENDING</code> row</span><span class="v">Entry ID, owning consumer, milliseconds since it was delivered, and the delivery count. The third is how you find abandoned work; the fourth is how you find poison (below).</span></div>
  <div class="kv"><span class="k"><code>IDLE</code> filters server-side</span><span class="v">Redis 6.2+. Without it you fetch every pending entry and filter in the client — fine at ten, wasteful at a hundred thousand.</span></div>
  <div class="kv"><span class="k">Summary form vs detail form</span><span class="v"><code>XPENDING key group</code> alone gives counts and the ID range — cheap, safe to poll. Adding <code>- + N</code> returns the rows, so always bound it with a count.</span></div>
  <div class="kv"><span class="k">Idle time is since <em>delivery</em>, not since the worker was alive</span><span class="v">A consumer that is happily processing a slow job looks identical to one that died. That is why the threshold must exceed your slowest legitimate handler.</span></div>
  <div class="kv"><span class="k">A dead consumer keeps its name forever</span><span class="v">Consumers are never garbage-collected. <code>XINFO CONSUMERS</code> on a service that uses random names accumulates thousands of ghosts — one more reason for stable names (Lesson 8.3), plus <code>XGROUP DELCONSUMER</code> once their pending list is empty.</span></div>
</div>

<h3>Claiming it back</h3>
<pre><code><span class="tok-comment"># Manual: take specific entries idle for more than 60s</span>
redis-cli XCLAIM orders billing worker-1 60000 1755949301003-0
<span class="tok-comment"># JUSTID skips returning the payload and does not bump the delivery counter</span>
redis-cli XCLAIM orders billing worker-1 60000 1755949301003-0 JUSTID

<span class="tok-comment"># Automatic: scan and claim in one command (6.2+)</span>
redis-cli XAUTOCLAIM orders billing worker-1 60000 0 COUNT 10</code></pre>
<div class="out">1) 1) "1755949301003-0"
   2) 1) "order"
      2) "9"
      3) "amount"
      4) "500"
1) "1755949301003-0"
1) "0-0"
2) 1) 1) "1755949301003-0"
      2) 1) "order"
         2) "9"
         3) "amount"
         4) "500"
3) (empty array)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">min-idle-time is the safety check</span><span class="lz-t">XCLAIM … 60000 …</span><span class="lz-d">The claim only succeeds if the entry has been pending at least that long. It is what stops a sweeper from stealing work from a consumer that is simply slow — and it makes <code>XCLAIM</code> safe to run concurrently, because the first claimer resets the idle time to zero and the second finds nothing to take.</span></div>
  <div class="lz-step"><span class="lz-k"><code>XAUTOCLAIM</code> is the one to use</span><span class="lz-t">scan + claim, cursor-based, one round trip</span><span class="lz-d">Redis 6.2+ replaced the <code>XPENDING</code>-then-<code>XCLAIM</code> dance. It returns a cursor (loop until <code>0-0</code>), the claimed entries with their payloads, and — since 7.0 — a third array of IDs that were in the PEL but no longer exist in the stream, which it cleans up for you.</span></div>
  <div class="lz-step"><span class="lz-k"><code>JUSTID</code> claims without reading</span><span class="lz-t">and without incrementing the delivery count</span><span class="lz-d">Useful when a supervisor is reassigning ownership rather than processing. Note the side effect: with <code>JUSTID</code> the retry counter does not move, so a poison entry claimed this way never trips a max-retries check.</span></div>
  <div class="lz-step"><span class="lz-k">Claiming does not deliver</span><span class="lz-t">it changes the owner in the PEL</span><span class="lz-d">After a claim, the entry belongs to the new consumer, who will see it on its next <code>XREADGROUP … STREAMS s 0</code>. <code>XAUTOCLAIM</code> hands you the payload directly, which is why it composes well with a sweeper that also processes.</span></div>
</div>

<h3>The sweeper, written out</h3>
<pre><code>const MIN_IDLE = 60_000;      <span class="tok-comment">// longer than the slowest legitimate handler</span>
const MAX_DELIVERIES = 5;

async function sweep() {
  let cursor = '0-0';
  do {
    const res = await redis.xAutoClaim(
      STREAM, GROUP, CONSUMER, MIN_IDLE, cursor, { COUNT: 50 },
    );
    cursor = res.nextId;

    for (const { id, message } of res.messages) {
      <span class="tok-comment">// How many times has this been handed out? XPENDING knows.</span>
      const [row] = await redis.xPendingRange(STREAM, GROUP, id, id, 1);
      if (row &amp;&amp; row.deliveriesCounter &gt; MAX_DELIVERIES) {
        await deadLetter(id, message, row.deliveriesCounter);
        continue;
      }
      try {
        await handle(message);
        await redis.xAck(STREAM, GROUP, id);
      } catch (err) {
        log.warn({ id, err }, 'reclaimed entry failed again');
      }
    }
  } while (cursor !== '0-0');
}

setInterval(() =&gt; sweep().catch(log.error), 30_000);</code></pre>
<div class="callout ok"><strong>The sweeper is a separate loop, not something bolted onto the worker loop.</strong> A worker's job is to drain <code>&gt;</code> as fast as it can; a sweeper's job is to notice abandoned work, which is a slow, periodic, whole-group concern. Running every 30 seconds is plenty. It is safe for every worker to run one — <code>min-idle-time</code> means only one of them wins each entry — and it is also fine to run it in exactly one process. What is not fine is having no sweeper at all: without one, the pending list is a leak with a business consequence, and the orders in it are simply never processed.</div>

<h3>Poison messages and the dead-letter stream</h3>
<pre><code>async function deadLetter(id, message, deliveries) {
  await redis.multi()
    .xAdd('orders:dead', '*', {
      ...message,
      _origId:      id,
      _deliveries:  String(deliveries),
      _failedAt:    String(Date.now()),
    })
    .xAck(STREAM, GROUP, id)        <span class="tok-comment">// ← stop the redelivery loop</span>
    .exec();
  metrics.increment('stream.deadletter', { stream: STREAM });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A poison entry never stops on its own</span><span class="v">An entry whose handler always throws — malformed JSON, a deleted user, a bug — is redelivered by every sweep, forever, consuming a worker slot each time. The delivery counter is the only thing that distinguishes it from a transient failure.</span></div>
  <div class="kv"><span class="k">Acknowledge when you dead-letter</span><span class="v">The <code>XACK</code> is what breaks the loop. Copy first, acknowledge second, in one <code>MULTI</code> so you cannot lose it between the two (Lesson 7.1).</span></div>
  <div class="kv"><span class="k">Keep the original ID and the count</span><span class="v">The dead-letter entry gets a new ID, so record the old one. Without it, correlating a dead letter back to its source entry and its logs is guesswork.</span></div>
  <div class="kv"><span class="k">A dead-letter stream nobody reads is a deleted message</span><span class="v">Alert on the counter. A DLQ is a queue of things that need a human, and one that silently fills for six months is worse than not having it, because it created the impression of a safety net.</span></div>
  <div class="kv"><span class="k">Retry the DLQ deliberately</span><span class="v">After the bug is fixed, a small script reads <code>orders:dead</code> and re-adds entries to <code>orders</code>. That is the payoff for keeping the payload — and the reason to bound the DLQ with <code>MAXLEN ~</code> like any other stream (Lesson 8.2).</span></div>
</div>

<h3>What the numbers look like when it is working</h3>
<pre><code>redis-cli XINFO GROUPS orders
redis-cli XPENDING orders billing
redis-cli XLEN orders:dead</code></pre>
<div class="out">1)  1) "name"
    2) "billing"
    3) "consumers"
    4) (integer) 4
    5) "pending"
    6) (integer) 7
    7) "last-delivered-id"
    8) "1755949399120-0"
    9) "entries-read"
   10) (integer) 184203
   11) "lag"
   12) (integer) 12
1) (integer) 7
2) "1755949399101-0"
3) "1755949399120-0"
4) 1) 1) "worker-1"
      2) "2"
   2) 1) "worker-2"
      2) "3"
   3) 1) "worker-3"
      2) "2"
(integer) 0</div>
<div class="pitfall"><strong>Pitfall:</strong> a <code>min-idle-time</code> shorter than your slowest handler. Set it to 30 seconds when one job legitimately takes 45, and the sweeper claims work from a consumer that is still actively doing it — so the job runs twice, concurrently, on two workers. If the handler is not idempotent (Lesson 8.3) that is a duplicate charge, a duplicate email, a double inventory decrement. Worse, it is self-amplifying: the two workers now take longer, the sweeper claims again, and a queue that was merely slow becomes a queue that is on fire. Set <code>min-idle-time</code> from the measured p99 of your handler with a wide margin — five to ten times, not 1.5× — and if a job legitimately takes minutes, have the handler send a heartbeat by calling <code>XCLAIM … JUSTID</code> on its own entry every few seconds, which resets the idle clock and proves it is alive. The same reasoning as the lock watchdog in Lesson 7.5, and the same failure if you skip it.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/xautoclaim/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">XAUTOCLAIM</span><span class="lc-sub">The cursor contract, the three-element reply (next cursor, claimed entries, deleted IDs), and how it differs from an <code>XPENDING</code> plus <code>XCLAIM</code> loop.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xpending/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">XPENDING</span><span class="lc-sub">Summary vs extended form, the <code>IDLE</code> filter, what the delivery counter counts and what resets it — the reference to keep open while writing a sweeper.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: recover from a dead worker</span><span class="lc-sub">Graded exercises: kill a consumer mid-batch and reclaim its entries, build the <code>XAUTOCLAIM</code> sweeper loop, add a dead-letter path with a retry cap, and demonstrate the double-processing bug from a too-short <code>min-idle-time</code>.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Redis records the pending list but never acts on it — a dead consumer's entries stay pending forever unless <em>you</em> run a sweeper, so a consumer group without one is a queue that silently drops the work of every crashed worker. <code>XAUTOCLAIM</code> is the modern tool: cursor-based, one round trip, and it cleans up PEL entries whose stream entries are gone. And <code>min-idle-time</code> is the safety interlock in both directions — too long and recovery is slow, too short and you claim work from a healthy worker and run the job twice, so size it from your handler's p99 with a wide margin and heartbeat with <code>XCLAIM … JUSTID</code> on genuinely long jobs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Khi một worker chết: đòi việc, thử lại và thư chết</h2>
<p class="lead">Một nhóm tiêu thụ ghi lại ai được giao cái gì, rồi tuyệt đối không làm gì với thông tin đó. Nếu <code>worker-3</code> lấy hai chục mục rồi pod của nó bị giết thì hai chục mục ấy nằm trong danh sách chờ mãi mãi — nhìn thấy được, chưa xác nhận, và không phải việc của ai. Redis cho bạn công cụ để giao lại chúng; còn chính sách thì bạn phải tự viết.</p>

<h3>Tìm ra thứ đang kẹt</h3>
<pre><code><span class="tok-comment"># Giả lập: worker-3 nhận việc rồi không bao giờ quay lại</span>
redis-cli XADD orders '*' order 9 amount 500 &gt;/dev/null
redis-cli XREADGROUP GROUP billing worker-3 COUNT 5 STREAMS orders '&gt;' &gt;/dev/null
sleep 2
redis-cli XPENDING orders billing IDLE 1000 - + 10          <span class="tok-comment"># 6.2+: lọc theo thời gian nằm im</span>
redis-cli XINFO CONSUMERS orders billing | grep -A1 -E "worker-3|idle"</code></pre>
<div class="out">1) 1) "1755949301003-0"
   2) "worker-3"
   3) (integer) 2014
   4) (integer) 1
1) "name"
2) "worker-3"
5) "idle"
6) (integer) 2014</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bốn trường của một dòng <code>XPENDING</code></span><span class="v">Mã mục, consumer đang sở hữu, số mili giây kể từ lúc giao, và số lần đã giao. Cái thứ ba là cách bạn tìm ra việc bị bỏ rơi; cái thứ tư là cách bạn tìm ra thông điệp độc (bên dưới).</span></div>
  <div class="kv"><span class="k"><code>IDLE</code> lọc ở phía máy chủ</span><span class="v">Redis 6.2+. Không có nó thì bạn kéo về mọi mục đang chờ rồi lọc ở phía khách — ổn với mười cái, phí phạm với một trăm nghìn.</span></div>
  <div class="kv"><span class="k">Dạng tóm tắt so với dạng chi tiết</span><span class="v"><code>XPENDING key group</code> trần cho bạn các con số đếm và khoảng mã — rẻ, hỏi vòng an toàn. Thêm <code>- + N</code> thì nó trả về các dòng, nên luôn phải chặn bằng một con số đếm.</span></div>
  <div class="kv"><span class="k">Thời gian nằm im tính từ lúc <em>giao</em>, không tính từ lúc worker còn sống</span><span class="v">Một consumer đang vui vẻ xử lý một việc chậm trông y hệt một consumer đã chết. Đó là vì sao ngưỡng phải lớn hơn handler chính đáng chậm nhất của bạn.</span></div>
  <div class="kv"><span class="k">Một consumer đã chết vẫn giữ tên mãi mãi</span><span class="v">Consumer không bao giờ được thu dọn tự động. <code>XINFO CONSUMERS</code> trên một dịch vụ dùng tên ngẫu nhiên sẽ tích luỹ hàng nghìn bóng ma — thêm một lý do cho tên ổn định (Bài 8.3), cộng thêm <code>XGROUP DELCONSUMER</code> khi danh sách chờ của chúng đã rỗng.</span></div>
</div>

<h3>Đòi nó về</h3>
<pre><code><span class="tok-comment"># Thủ công: lấy những mục cụ thể đã nằm im hơn 60 giây</span>
redis-cli XCLAIM orders billing worker-1 60000 1755949301003-0
<span class="tok-comment"># JUSTID bỏ qua việc trả về nội dung và KHÔNG tăng bộ đếm số lần giao</span>
redis-cli XCLAIM orders billing worker-1 60000 1755949301003-0 JUSTID

<span class="tok-comment"># Tự động: quét và đòi trong một lệnh (6.2+)</span>
redis-cli XAUTOCLAIM orders billing worker-1 60000 0 COUNT 10</code></pre>
<div class="out">1) 1) "1755949301003-0"
   2) 1) "order"
      2) "9"
      3) "amount"
      4) "500"
1) "1755949301003-0"
1) "0-0"
2) 1) 1) "1755949301003-0"
      2) 1) "order"
         2) "9"
         3) "amount"
         4) "500"
3) (empty array)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">min-idle-time là chốt an toàn</span><span class="lz-t">XCLAIM … 60000 …</span><span class="lz-d">Phép đòi chỉ thành công nếu mục đã nằm chờ ít nhất chừng đó. Nó là thứ ngăn một tiến trình quét cướp việc của một consumer chỉ đơn giản là chậm — và nó làm cho <code>XCLAIM</code> an toàn khi chạy đồng thời, vì kẻ đòi đầu tiên đặt lại thời gian nằm im về 0 và kẻ thứ hai chẳng thấy gì để lấy.</span></div>
  <div class="lz-step"><span class="lz-k"><code>XAUTOCLAIM</code> mới là cái nên dùng</span><span class="lz-t">quét + đòi, dựa trên con trỏ, một vòng đi-về</span><span class="lz-d">Redis 6.2+ thay thế điệu nhảy <code>XPENDING</code>-rồi-<code>XCLAIM</code>. Nó trả về một con trỏ (lặp cho tới khi ra <code>0-0</code>), các mục đã đòi kèm nội dung, và — từ bản 7.0 — một mảng thứ ba gồm những mã còn nằm trong PEL mà không còn tồn tại trong stream, và nó dọn hộ bạn luôn.</span></div>
  <div class="lz-step"><span class="lz-k"><code>JUSTID</code> đòi mà không đọc</span><span class="lz-t">và không tăng số lần giao</span><span class="lz-d">Có ích khi một tiến trình giám sát đang giao lại quyền sở hữu chứ không xử lý. Hãy để ý tác dụng phụ: với <code>JUSTID</code> thì bộ đếm thử lại không nhúc nhích, nên một mục độc đòi theo cách này sẽ không bao giờ chạm ngưỡng số-lần-thử-tối-đa.</span></div>
  <div class="lz-step"><span class="lz-k">Đòi không có nghĩa là giao</span><span class="lz-t">nó đổi chủ sở hữu trong PEL</span><span class="lz-d">Sau một lần đòi, mục thuộc về consumer mới, và người đó sẽ thấy nó ở lần <code>XREADGROUP … STREAMS s 0</code> tiếp theo. <code>XAUTOCLAIM</code> đưa thẳng nội dung cho bạn, đó là lý do nó ghép rất hợp với một tiến trình quét kiêm luôn xử lý.</span></div>
</div>

<h3>Tiến trình quét, viết ra đầy đủ</h3>
<pre><code>const MIN_IDLE = 60_000;      <span class="tok-comment">// dài hơn handler chính đáng chậm nhất</span>
const MAX_DELIVERIES = 5;

async function sweep() {
  let cursor = '0-0';
  do {
    const res = await redis.xAutoClaim(
      STREAM, GROUP, CONSUMER, MIN_IDLE, cursor, { COUNT: 50 },
    );
    cursor = res.nextId;

    for (const { id, message } of res.messages) {
      <span class="tok-comment">// Cái này đã được phát ra bao nhiêu lần rồi? XPENDING biết.</span>
      const [row] = await redis.xPendingRange(STREAM, GROUP, id, id, 1);
      if (row &amp;&amp; row.deliveriesCounter &gt; MAX_DELIVERIES) {
        await deadLetter(id, message, row.deliveriesCounter);
        continue;
      }
      try {
        await handle(message);
        await redis.xAck(STREAM, GROUP, id);
      } catch (err) {
        log.warn({ id, err }, 'reclaimed entry failed again');
      }
    }
  } while (cursor !== '0-0');
}

setInterval(() =&gt; sweep().catch(log.error), 30_000);</code></pre>
<div class="callout ok"><strong>Tiến trình quét là một vòng lặp riêng, không phải thứ chắp vào vòng lặp của worker.</strong> Việc của một worker là vét <code>&gt;</code> nhanh nhất có thể; việc của một tiến trình quét là để ý thấy công việc bị bỏ rơi, vốn là mối bận tâm chậm, định kỳ và thuộc về cả nhóm. Chạy 30 giây một lần là quá đủ. Mọi worker cùng chạy một cái thì vẫn an toàn — <code>min-idle-time</code> nghĩa là chỉ một trong số chúng thắng mỗi mục — và chạy nó ở đúng một tiến trình duy nhất cũng ổn. Cái không ổn là chẳng có tiến trình quét nào cả: thiếu nó thì danh sách chờ là một chỗ rò có hậu quả nghiệp vụ, và những đơn hàng nằm trong đó đơn giản là không bao giờ được xử lý.</div>

<h3>Thông điệp độc và stream thư-chết</h3>
<pre><code>async function deadLetter(id, message, deliveries) {
  await redis.multi()
    .xAdd('orders:dead', '*', {
      ...message,
      _origId:      id,
      _deliveries:  String(deliveries),
      _failedAt:    String(Date.now()),
    })
    .xAck(STREAM, GROUP, id)        <span class="tok-comment">// ← chặn vòng lặp giao lại</span>
    .exec();
  metrics.increment('stream.deadletter', { stream: STREAM });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một mục độc không bao giờ tự dừng</span><span class="v">Một mục mà handler luôn ném lỗi — JSON dị dạng, một người dùng đã bị xoá, một cái lỗi — sẽ được giao lại ở mỗi lượt quét, mãi mãi, và ngốn một suất worker mỗi lần. Bộ đếm số lần giao là thứ duy nhất phân biệt nó với một thất bại thoáng qua.</span></div>
  <div class="kv"><span class="k">Hãy xác nhận khi bạn đẩy vào thư chết</span><span class="v">Lệnh <code>XACK</code> chính là thứ cắt đứt cái vòng lặp. Chép trước, xác nhận sau, trong cùng một <code>MULTI</code> để bạn không thể đánh mất nó ở khoảng giữa (Bài 7.1).</span></div>
  <div class="kv"><span class="k">Giữ lại mã gốc và số lần giao</span><span class="v">Mục thư chết nhận một mã mới, nên hãy ghi lại cái cũ. Không có nó thì việc lần từ một bức thư chết ngược về mục nguồn và nhật ký của nó chỉ là đoán mò.</span></div>
  <div class="kv"><span class="k">Một stream thư chết không ai đọc chính là một thông điệp bị xoá</span><span class="v">Hãy đặt cảnh báo lên bộ đếm. DLQ là một hàng đợi những thứ cần tới con người, và một cái âm thầm đầy lên suốt sáu tháng còn tệ hơn không có, vì nó tạo ra ảo giác về một tấm lưới an toàn.</span></div>
  <div class="kv"><span class="k">Hãy thử lại DLQ một cách có chủ ý</span><span class="v">Sau khi cái lỗi được sửa, một script nhỏ đọc <code>orders:dead</code> rồi thêm các mục trở lại <code>orders</code>. Đó là phần thưởng cho việc giữ lại nội dung — và là lý do phải chặn DLQ bằng <code>MAXLEN ~</code> như mọi stream khác (Bài 8.2).</span></div>
</div>

<h3>Các con số trông ra sao khi mọi thứ đang chạy tốt</h3>
<pre><code>redis-cli XINFO GROUPS orders
redis-cli XPENDING orders billing
redis-cli XLEN orders:dead</code></pre>
<div class="out">1)  1) "name"
    2) "billing"
    3) "consumers"
    4) (integer) 4
    5) "pending"
    6) (integer) 7
    7) "last-delivered-id"
    8) "1755949399120-0"
    9) "entries-read"
   10) (integer) 184203
   11) "lag"
   12) (integer) 12
1) (integer) 7
2) "1755949399101-0"
3) "1755949399120-0"
4) 1) 1) "worker-1"
      2) "2"
   2) 1) "worker-2"
      2) "3"
   3) 1) "worker-3"
      2) "2"
(integer) 0</div>
<div class="pitfall"><strong>Cái bẫy:</strong> đặt <code>min-idle-time</code> ngắn hơn handler chậm nhất của bạn. Đặt nó là 30 giây trong khi một việc chính đáng mất 45 giây, thế là tiến trình quét đòi việc từ một consumer vẫn đang tích cực làm nó — nên việc chạy hai lần, đồng thời, trên hai worker. Nếu handler không lặp-lại-vô-hại (Bài 8.3) thì đó là một lần quẹt thẻ trùng, một email trùng, một lần trừ tồn kho hai lượt. Tệ hơn, nó tự khuếch đại: hai worker giờ chạy lâu hơn, tiến trình quét lại đòi tiếp, và một hàng đợi chỉ đang chậm biến thành một hàng đợi đang cháy. Hãy đặt <code>min-idle-time</code> từ p99 đo được của handler kèm biên rất rộng — gấp năm tới mười lần, không phải 1,5 lần — và nếu một việc chính đáng mất hàng phút thì hãy để handler gửi nhịp tim bằng cách gọi <code>XCLAIM … JUSTID</code> lên chính mục của nó vài giây một lần, việc đó đặt lại đồng hồ nằm im và chứng minh nó còn sống. Cùng lối lập luận với con chó canh khoá ở Bài 7.5, và cùng kiểu hỏng nếu bạn bỏ qua nó.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/xautoclaim/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">XAUTOCLAIM</span><span class="lc-sub">Giao kèo con trỏ, câu trả lời ba phần tử (con trỏ tiếp theo, các mục đã đòi, các mã đã bị xoá), và nó khác một vòng lặp <code>XPENDING</code> cộng <code>XCLAIM</code> ra sao.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/xpending/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">XPENDING</span><span class="lc-sub">Dạng tóm tắt với dạng mở rộng, bộ lọc <code>IDLE</code>, bộ đếm số lần giao đếm cái gì và cái gì đặt lại nó — tài liệu nên mở sẵn trong lúc viết một tiến trình quét.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: hồi phục từ một worker đã chết</span><span class="lc-sub">Bài chấm điểm: giết một consumer giữa lô rồi đòi lại các mục của nó, dựng vòng lặp quét bằng <code>XAUTOCLAIM</code>, thêm một nhánh thư-chết có trần số lần thử, và tái hiện lỗi xử-lý-hai-lần sinh ra từ một <code>min-idle-time</code> quá ngắn.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Redis ghi lại danh sách chờ nhưng không bao giờ hành động dựa trên nó — các mục của một consumer đã chết nằm chờ mãi mãi trừ khi <em>bạn</em> chạy một tiến trình quét, nên một nhóm tiêu thụ không có tiến trình quét là một hàng đợi âm thầm vứt bỏ công việc của mọi worker từng sập. <code>XAUTOCLAIM</code> là công cụ hiện đại: dựa trên con trỏ, một vòng đi-về, và nó dọn cả những mục PEL mà mục stream tương ứng đã biến mất. Và <code>min-idle-time</code> là chốt an toàn theo cả hai chiều — quá dài thì hồi phục chậm, quá ngắn thì bạn đòi việc từ một worker khoẻ mạnh và chạy việc đó hai lần, nên hãy chọn nó từ p99 của handler kèm biên rất rộng và hãy gửi nhịp tim bằng <code>XCLAIM … JUSTID</code> cho những việc thật sự dài.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Choosing: Pub/Sub, Streams, lists or a real broker|||8.5 — Chọn: Pub/Sub, Stream, list hay một broker thật',
      slug: 'rd-8-5-chon-cong-cu',
      type: 'LESSON',
      description: 'Bảng quyết định giữa bốn thứ trong Redis, so sánh thành thật với Kafka và RabbitMQ, vì sao BullMQ vẫn đáng dùng dù nó chạy trên chính Redis, và ba câu hỏi quyết định bạn có nên rời Redis hay không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Choosing: Pub/Sub, Streams, lists or a real broker</h2>
<p class="lead">Redis gives you three ways to move a message and there are two more one layer out. The choice is not about which is most powerful — Streams win that easily — it is about which failure modes you can live with and how much machinery you want to operate.</p>

<h3>The four options inside Redis</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pub/Sub · at-most-once, no memory</span><span class="v">Every subscriber gets every message, nothing is stored, a disconnected listener loses everything. Right for cache invalidation, WebSocket fan-out, live metrics — anything where the receiver recovers on its own (Lesson 8.1).</span></div>
  <div class="kv"><span class="k">List · a queue, no acknowledgement</span><span class="v"><code>LPUSH</code> + <code>BRPOP</code> is a competing-consumer queue in two commands. Cheapest memory, O(1), and a worker that dies after popping loses the job unless you build the <code>LMOVE</code> pattern and its sweeper yourself (Lesson 4.1).</span></div>
  <div class="kv"><span class="k">Stream · at-least-once, with replay</span><span class="v">Consumer groups, pending lists, acknowledgement, redelivery and history — everything a work queue needs, natively. The default answer when a lost message matters (Lessons 8.2–8.4).</span></div>
  <div class="kv"><span class="k">Sorted set · a scheduler, not a queue</span><span class="v">Score = run-at time, and <code>ZREM</code> returning 1 is a free distributed claim (Lesson 4.4). Use it for "when", and hand the job to a stream or a list for "who runs it".</span></div>
  <div class="kv"><span class="k">The combination people actually run</span><span class="v">A sorted set for delayed jobs, feeding a stream for execution, with Pub/Sub for the notifications that come out of it. These are not competitors; they are three parts of one design.</span></div>
</div>
<pre><code><span class="tok-comment"># Same 100k messages through each, one producer, four consumers, local</span>
node bench-messaging.js --messages 100000 | tail -5</code></pre>
<div class="out">list    (LPUSH/BRPOP)     100000 msgs  4.9s   20408/s   mem +11MB   losses on kill: 4
stream  (XADD/XREADGROUP)  100000 msgs  6.3s   15873/s   mem +38MB   losses on kill: 0
pubsub  (PUBLISH)          100000 msgs  2.1s   47619/s   mem  +0MB   losses on kill: 2841
stream  pipelined XADD     100000 msgs  1.4s   71428/s   mem +38MB   losses on kill: 0</div>
<div class="callout"><strong>Read the last column, not the middle one.</strong> Pub/Sub is the fastest and loses thousands of messages when a consumer restarts. The list is fast and loses whatever the killed worker was holding. The stream is the slowest per-message and loses nothing — and pipelining the producer (Lesson 1.4) makes it the fastest of all anyway, because throughput here is dominated by round trips rather than by server work. The 3.5× memory is the price of keeping entries after they are read, which is the entire feature.</div>

<h3>Redis Streams next to Kafka</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Where they genuinely overlap</span><span class="lz-lnote">Both are append-only logs with consumer groups, offsets, replay and at-least-once delivery. For a service producing tens of thousands of events a second with a handful of consumer groups, a Redis stream does the same job with one dependency you already run — and the code is shorter.</span></div>
  <div class="lz-layer"><span class="lz-lname">Where Kafka is simply different</span><span class="lz-lnote">Partitions give ordered parallelism (a Redis stream is one ordered log; parallelism comes from consumers competing, so per-key ordering is not preserved across them). Retention is disk-based and measured in weeks or terabytes, not in RAM. Log compaction, exactly-once transactions, schema registries and a connector ecosystem exist there and not here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Where Redis is simply different</span><span class="lz-lnote">Sub-millisecond end-to-end latency, no ZooKeeper or KRaft to operate, no partition-count decision you cannot undo, no consumer-group rebalance storms. And it is already running in your stack, which is not a small argument.</span></div>
  <div class="lz-layer"><span class="lz-lname">The honest dividing line</span><span class="lz-lnote">Data volume against memory. A stream lives in RAM, so retention is bounded by what you are willing to pay for — a week of events at 10 KB each is a Kafka problem, an hour of them is a Redis one. If your retention requirement is measured in days and your volume in gigabytes, you have outgrown streams, and no tuning changes that.</span></div>
</div>

<h3>And next to RabbitMQ and BullMQ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">RabbitMQ</span><span class="lz-t">routing is the feature</span><span class="lz-d">Exchanges, bindings, topic routing, per-message TTL, priority queues and a built-in dead-letter exchange. If your problem is "this message should go to these three of eleven queues depending on its headers", that is what RabbitMQ is for and modelling it on a Redis stream means writing the router yourself.</span></div>
  <div class="lz-step"><span class="lz-k">BullMQ (and Sidekiq, Celery)</span><span class="lz-t">a job queue built ON Redis</span><span class="lz-d">Delayed jobs, retries with exponential backoff, priorities, rate limiting, repeatable jobs, flows, and a web UI to inspect and retry failures. Same Redis, no new infrastructure, and all the parts you would otherwise write across Lessons 8.3 and 8.4 already written and tested.</span></div>
  <div class="lz-step"><span class="lz-k">Use the library unless you have a reason</span><span class="lz-t">"we built our own queue" is rarely a happy story</span><span class="lz-d">The sweeper, the retry policy, the dead-letter path, the metrics, the admin UI — that is a few weeks of work and then permanent maintenance. Raw streams are the right choice when you need something the library does not do, or when you cannot add a dependency, not by default.</span></div>
  <div class="lz-step"><span class="lz-k">Raw streams shine as an event log</span><span class="lz-t">not as a job queue</span><span class="lz-d">Where they beat a job library is fan-out to multiple independent consumer groups, replay of history, and time-range queries — "every service that cares about orders reads this log at its own pace". That is a log, and it is what streams are actually for.</span></div>
</div>

<h3>Three questions that decide it</h3>
<pre><code><span class="tok-comment"># 1 · Can a lost message be recovered by the receiver on its own?</span>
<span class="tok-comment">#     yes → Pub/Sub.  no → keep reading.</span>

<span class="tok-comment"># 2 · Does more than one independent consumer need the same message?</span>
<span class="tok-comment">#     yes → Stream (groups fan out).  no → a list may be enough.</span>

<span class="tok-comment"># 3 · Is the retention you need larger than the RAM you will buy?</span>
<span class="tok-comment">#     yes → Kafka.  no → Redis Streams, or a library on top of them.</span>

redis-cli MEMORY USAGE orders
redis-cli XLEN orders
redis-cli EVAL "return redis.call('MEMORY','USAGE',KEYS[1]) / redis.call('XLEN',KEYS[1])" 1 orders</code></pre>
<div class="out">17441216
200000
(integer) 87</div>
<div class="callout ok"><strong>87 bytes per entry — multiply and decide.</strong> That number is the whole capacity plan: at 5,000 events a second, one day of retention is 5000 × 86400 × 87 ≈ <strong>37 GB</strong>, which is a large and expensive Redis instance and a trivial Kafka topic. One hour is 1.5 GB, which is nothing. Run this calculation with your own entry size before choosing, because it is the one input that reliably decides the answer, and it is the one people skip. And if the answer is uncomfortable, remember the middle option: keep a short retention in Redis for live consumption and archive older entries to object storage or a warehouse — a consumer whose only job is to batch entries out to S3 is thirty lines and removes the whole problem.</div>

<div class="pitfall"><strong>Pitfall:</strong> treating a Redis stream as durable storage without checking what "durable" means on your instance. A stream is in memory, so its survival is entirely a property of your persistence configuration (Chapter 9), and the defaults are not what most people assume. With RDB snapshots alone — the default — a crash loses everything since the last snapshot, which can be minutes of orders. With AOF at <code>everysec</code>, you lose up to a second. With <code>appendfsync always</code> you lose nothing and pay for it on every write. Meanwhile a managed Redis may have persistence disabled entirely for performance, and an instance under <code>maxmemory</code> with an eviction policy that is not <code>noeviction</code> can <em>delete your stream key</em> to make room — a stream is a normal key and <code>allkeys-lru</code> does not know it is a queue. Before putting anything you cannot lose into a stream: check <code>CONFIG GET appendonly</code>, check <code>CONFIG GET maxmemory-policy</code>, and if the answers are <code>no</code> and <code>allkeys-lru</code>, fix that before you write the consumer, not after the incident.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Streams: the comparison section</span><span class="lc-sub">Redis's own write-up of how streams differ from Pub/Sub and from lists, including the memory and durability caveats stated plainly.</span></span>
</a>
<a class="link-card" href="https://docs.bullmq.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🐂</span>
  <span class="lc-body"><span class="lc-title">BullMQ</span><span class="lc-sub">The job queue built on Redis: delayed jobs, backoff, priorities, rate limiting, flows and a dashboard. Read the concepts page before deciding to write your own worker loop.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the right transport</span><span class="lc-sub">Graded exercises: eight requirements to classify, a capacity calculation from a real entry size, and a migration of one list-based queue to a stream with the failure handling it was missing.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Answer three questions in order — can the receiver recover a lost message on its own (Pub/Sub), does more than one independent consumer need it (Stream), and is your retention larger than the RAM you will buy (Kafka) — and the choice falls out. Raw streams are an excellent event log and a mediocre job queue: a library like BullMQ already has the sweeper, the backoff, the dead-letter path and the UI you would otherwise spend weeks rebuilding. And "durable" for a stream means exactly whatever your persistence and eviction settings say — check <code>appendonly</code> and <code>maxmemory-policy</code> before trusting one with data you cannot lose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Chọn: Pub/Sub, Stream, list hay một broker thật</h2>
<p class="lead">Redis cho bạn ba cách chuyển một thông điệp và còn hai cách nữa nằm ngoài một tầng. Lựa chọn không nằm ở chỗ cái nào mạnh nhất — Stream thắng chuyện đó dễ dàng — mà nằm ở chỗ bạn sống chung được với kiểu hỏng nào và bạn muốn vận hành bao nhiêu bộ máy.</p>

<h3>Bốn lựa chọn bên trong Redis</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pub/Sub · nhiều nhất một lần, không có trí nhớ</span><span class="v">Mọi bên đăng ký nhận mọi thông điệp, không có gì được lưu, một bên nghe bị rớt kết nối là mất sạch. Đúng cho vô hiệu hoá bộ đệm, toả WebSocket, số liệu trực tiếp — bất cứ thứ gì mà bên nhận tự hồi phục được (Bài 8.1).</span></div>
  <div class="kv"><span class="k">List · một hàng đợi, không có xác nhận</span><span class="v"><code>LPUSH</code> + <code>BRPOP</code> là một hàng đợi có bên-tiêu-thụ-tranh-nhau gói trong hai lệnh. Bộ nhớ rẻ nhất, O(1), và một worker chết sau khi lấy ra là mất việc trừ khi bạn tự dựng khuôn <code>LMOVE</code> cùng tiến trình quét của nó (Bài 4.1).</span></div>
  <div class="kv"><span class="k">Stream · ít nhất một lần, có phát lại</span><span class="v">Nhóm tiêu thụ, danh sách chờ, xác nhận, giao lại và lịch sử — mọi thứ một hàng đợi việc cần, một cách bẩm sinh. Là đáp án mặc định khi mất một thông điệp là chuyện lớn (Bài 8.2–8.4).</span></div>
  <div class="kv"><span class="k">Sorted set · một bộ hẹn giờ, không phải hàng đợi</span><span class="v">Điểm = mốc chạy, và <code>ZREM</code> trả về 1 là một phép nhận việc phân tán miễn phí (Bài 4.4). Hãy dùng nó cho "khi nào", rồi giao việc cho một stream hay một list lo phần "ai chạy".</span></div>
  <div class="kv"><span class="k">Tổ hợp mà người ta thật sự chạy</span><span class="v">Một sorted set cho việc hẹn giờ, đổ vào một stream để thực thi, cùng Pub/Sub cho các thông báo sinh ra từ đó. Chúng không phải đối thủ của nhau; chúng là ba phần của cùng một thiết kế.</span></div>
</div>
<pre><code><span class="tok-comment"># Cùng 100k thông điệp qua từng cách, một bên sản xuất, bốn bên tiêu thụ, chạy tại chỗ</span>
node bench-messaging.js --messages 100000 | tail -5</code></pre>
<div class="out">list    (LPUSH/BRPOP)     100000 msgs  4.9s   20408/s   mem +11MB   losses on kill: 4
stream  (XADD/XREADGROUP)  100000 msgs  6.3s   15873/s   mem +38MB   losses on kill: 0
pubsub  (PUBLISH)          100000 msgs  2.1s   47619/s   mem  +0MB   losses on kill: 2841
stream  pipelined XADD     100000 msgs  1.4s   71428/s   mem +38MB   losses on kill: 0</div>
<div class="callout"><strong>Hãy đọc cột cuối, đừng đọc cột giữa.</strong> Pub/Sub nhanh nhất và mất hàng nghìn thông điệp khi một bên tiêu thụ khởi động lại. List thì nhanh và mất bất cứ thứ gì worker bị giết đang ôm. Stream chậm nhất tính trên mỗi thông điệp và không mất gì — rồi việc pipeline hoá bên sản xuất (Bài 1.4) lại khiến nó nhanh nhất trong tất cả, vì thông lượng ở đây bị chi phối bởi số vòng đi-về chứ không bởi công việc của máy chủ. Gấp 3,5 lần bộ nhớ là cái giá của việc giữ lại các mục sau khi đã đọc, mà đó chính là toàn bộ tính năng.</div>

<h3>Redis Streams đặt cạnh Kafka</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chỗ chúng thật sự chồng lấn</span><span class="lz-lnote">Cả hai đều là nhật ký chỉ ghi thêm với nhóm tiêu thụ, vị trí đọc, phát lại và giao ít-nhất-một-lần. Với một dịch vụ sinh ra vài chục nghìn sự kiện mỗi giây và có dăm ba nhóm tiêu thụ, một stream Redis làm đúng việc đó với một phụ thuộc mà bạn vốn đã chạy — và mã thì ngắn hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỗ Kafka đơn giản là khác</span><span class="lz-lnote">Phân vùng cho bạn song song có thứ tự (một stream Redis là một cuốn nhật ký có thứ tự duy nhất; song song đến từ việc các bên tiêu thụ tranh nhau, nên thứ tự theo từng khoá không được giữ xuyên qua chúng). Lưu trữ dựa trên đĩa và đo bằng tuần hay terabyte, không đo bằng RAM. Nén nhật ký, giao dịch đúng-một-lần, sổ đăng ký lược đồ và cả hệ sinh thái connector tồn tại ở đó chứ không ở đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỗ Redis đơn giản là khác</span><span class="lz-lnote">Độ trễ đầu-tới-cuối dưới một mili giây, không có ZooKeeper hay KRaft phải vận hành, không có quyết định số-phân-vùng mà bạn không thể rút lại, không có bão tái cân bằng nhóm tiêu thụ. Và nó vốn đã chạy sẵn trong hệ thống của bạn, đó không phải một lý lẽ nhỏ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ranh giới thành thật</span><span class="lz-lnote">Khối lượng dữ liệu so với bộ nhớ. Một stream sống trong RAM, nên thời gian lưu bị chặn bởi số tiền bạn chịu trả — một tuần sự kiện mỗi cái 10 KB là bài toán của Kafka, một giờ sự kiện đó là bài toán của Redis. Nếu yêu cầu lưu trữ của bạn đo bằng ngày và khối lượng đo bằng gigabyte thì bạn đã lớn hơn stream, và không mức tinh chỉnh nào đổi được điều đó.</span></div>
</div>

<h3>Và đặt cạnh RabbitMQ với BullMQ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">RabbitMQ</span><span class="lz-t">định tuyến mới là tính năng</span><span class="lz-d">Exchange, binding, định tuyến theo chủ đề, TTL theo từng thông điệp, hàng đợi ưu tiên và một exchange thư-chết có sẵn. Nếu bài toán của bạn là "thông điệp này nên đi tới ba trong mười một hàng đợi tuỳ theo phần đầu của nó" thì đó là việc của RabbitMQ, và mô hình hoá nó trên một stream Redis nghĩa là bạn tự viết cái bộ định tuyến.</span></div>
  <div class="lz-step"><span class="lz-k">BullMQ (và Sidekiq, Celery)</span><span class="lz-t">một hàng đợi việc dựng TRÊN Redis</span><span class="lz-d">Việc hẹn giờ, thử lại có nhịp lùi luỹ thừa, độ ưu tiên, giới hạn tần suất, việc lặp lại, luồng công việc, và một giao diện web để xem và thử lại các lần thất bại. Vẫn Redis đó, không thêm hạ tầng nào, và mọi mảnh mà lẽ ra bạn phải tự viết xuyên Bài 8.3 với 8.4 thì đã được viết sẵn và kiểm thử rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy dùng thư viện trừ khi bạn có lý do</span><span class="lz-t">"bọn tôi tự dựng hàng đợi riêng" hiếm khi là câu chuyện có hậu</span><span class="lz-d">Tiến trình quét, chính sách thử lại, nhánh thư-chết, số liệu đo, giao diện quản trị — đó là vài tuần làm việc rồi bảo trì vĩnh viễn. Stream thô là lựa chọn đúng khi bạn cần thứ mà thư viện không làm, hoặc khi bạn không thể thêm phụ thuộc, chứ không phải theo mặc định.</span></div>
  <div class="lz-step"><span class="lz-k">Stream thô toả sáng ở vai cuốn nhật ký sự kiện</span><span class="lz-t">không phải ở vai hàng đợi việc</span><span class="lz-d">Chỗ nó thắng một thư viện hàng đợi là toả ra nhiều nhóm tiêu thụ độc lập, phát lại lịch sử, và truy vấn theo khoảng thời gian — "mọi dịch vụ quan tâm tới đơn hàng đều đọc cuốn nhật ký này theo nhịp của riêng nó". Đó là một cuốn nhật ký, và đó mới là thứ stream thật sự sinh ra để làm.</span></div>
</div>

<h3>Ba câu hỏi quyết định</h3>
<pre><code><span class="tok-comment"># 1 · Một thông điệp bị mất thì bên nhận có tự hồi phục được không?</span>
<span class="tok-comment">#     có → Pub/Sub.  không → đọc tiếp.</span>

<span class="tok-comment"># 2 · Có nhiều hơn một bên tiêu thụ độc lập cần cùng một thông điệp không?</span>
<span class="tok-comment">#     có → Stream (các nhóm toả ra).  không → một cái list có thể là đủ.</span>

<span class="tok-comment"># 3 · Thời gian lưu bạn cần có lớn hơn lượng RAM bạn sẽ mua không?</span>
<span class="tok-comment">#     có → Kafka.  không → Redis Streams, hoặc một thư viện dựng trên nó.</span>

redis-cli MEMORY USAGE orders
redis-cli XLEN orders
redis-cli EVAL "return redis.call('MEMORY','USAGE',KEYS[1]) / redis.call('XLEN',KEYS[1])" 1 orders</code></pre>
<div class="out">17441216
200000
(integer) 87</div>
<div class="callout ok"><strong>87 byte mỗi mục — hãy nhân lên rồi quyết.</strong> Con số đó chính là toàn bộ kế hoạch dung lượng: ở mức 5.000 sự kiện mỗi giây, lưu một ngày là 5000 × 86400 × 87 ≈ <strong>37 GB</strong>, tức là một máy Redis to và đắt và một topic Kafka tầm thường. Lưu một giờ là 1,5 GB, chẳng là gì. Hãy chạy phép tính này với kích thước mục của chính bạn trước khi chọn, vì nó là dữ liệu đầu vào duy nhất quyết định câu trả lời một cách đáng tin, và nó là thứ người ta hay bỏ qua. Và nếu đáp án gây khó chịu thì hãy nhớ tới lựa chọn ở giữa: giữ thời gian lưu ngắn trong Redis để tiêu thụ trực tiếp rồi lưu trữ các mục cũ hơn sang kho đối tượng hay một nhà kho dữ liệu — một bên tiêu thụ mà việc duy nhất là gom lô các mục đẩy sang S3 thì dài ba mươi dòng và gỡ bỏ trọn cái vấn đề.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> coi một stream Redis là kho lưu bền vững mà không kiểm xem "bền vững" nghĩa là gì trên máy của bạn. Một stream nằm trong bộ nhớ, nên sự sống còn của nó hoàn toàn là một tính chất của cấu hình lưu lâu dài của bạn (Chương 9), và các giá trị mặc định không giống điều phần lớn người ta tưởng. Chỉ với ảnh chụp RDB — tức mặc định — một cú sập làm mất mọi thứ kể từ ảnh chụp gần nhất, và đó có thể là hàng phút đơn hàng. Với AOF ở mức <code>everysec</code>, bạn mất tối đa một giây. Với <code>appendfsync always</code> bạn không mất gì và trả giá ở mỗi lượt ghi. Trong khi đó một Redis có quản lý có thể đã tắt hẳn phần lưu lâu dài vì hiệu năng, và một máy đang ở <code>maxmemory</code> với chính sách đẩy khoá khác <code>noeviction</code> có thể <em>xoá mất cái khoá stream của bạn</em> để lấy chỗ — một stream là một cái khoá bình thường và <code>allkeys-lru</code> không biết nó là một hàng đợi. Trước khi đặt bất cứ thứ gì bạn không thể mất vào một stream: hãy kiểm <code>CONFIG GET appendonly</code>, kiểm <code>CONFIG GET maxmemory-policy</code>, và nếu đáp án là <code>no</code> với <code>allkeys-lru</code> thì hãy sửa chuyện đó trước khi viết bên tiêu thụ, đừng sửa sau khi có sự cố.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/streams/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Streams: phần so sánh</span><span class="lc-sub">Bản mô tả của chính Redis về việc stream khác Pub/Sub và khác list ra sao, gồm cả những lưu ý về bộ nhớ và độ bền được nói thẳng ra.</span></span>
</a>
<a class="link-card" href="https://docs.bullmq.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🐂</span>
  <span class="lc-body"><span class="lc-title">BullMQ</span><span class="lc-sub">Hàng đợi việc dựng trên Redis: việc hẹn giờ, nhịp lùi, độ ưu tiên, giới hạn tần suất, luồng công việc và một bảng điều khiển. Hãy đọc trang khái niệm của nó trước khi quyết định tự viết vòng lặp worker.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chọn đúng phương tiện vận chuyển</span><span class="lc-sub">Bài chấm điểm: tám yêu cầu cần phân loại, một phép tính dung lượng từ kích thước mục thật, và một lần chuyển một hàng đợi dựa trên list sang stream kèm phần xử lý hỏng hóc mà nó vốn thiếu.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy trả lời ba câu hỏi theo thứ tự — bên nhận có tự hồi phục được một thông điệp bị mất không (Pub/Sub), có nhiều hơn một bên tiêu thụ độc lập cần nó không (Stream), và thời gian lưu bạn cần có lớn hơn lượng RAM bạn sẽ mua không (Kafka) — và lựa chọn tự rơi ra. Stream thô là một cuốn nhật ký sự kiện xuất sắc và một hàng đợi việc tầm thường: một thư viện như BullMQ đã có sẵn tiến trình quét, nhịp lùi, nhánh thư-chết và giao diện mà nếu không thì bạn sẽ dựng lại mất hàng tuần. Và "bền vững" với một stream nghĩa là đúng những gì cấu hình lưu lâu dài và đẩy khoá của bạn nói — hãy kiểm <code>appendonly</code> và <code>maxmemory-policy</code> trước khi giao cho nó dữ liệu bạn không thể mất.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Quiz: Pub/Sub and Streams|||8.6 — Trắc nghiệm: Pub/Sub và Stream',
      slug: 'rd-8-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về việc PUBLISH trả về 0, chế độ đăng ký, XDEL không trả lại bộ nhớ, dấu > với mã tường minh, PEL, min-idle-time, giao ít-nhất-một-lần, và độ bền thật của một stream.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on two systems that look similar and guarantee completely different things. Half of them are about what happens when something dies mid-flight.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: what <code>PUBLISH</code> returning 0 tells you (8.1), why <code>XDEL</code> does not free memory (8.2), what the PEL is for (8.3), and why <code>min-idle-time</code> must exceed your slowest handler (8.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về hai hệ thống trông giống nhau mà bảo đảm những thứ hoàn toàn khác nhau. Một nửa số câu nói về chuyện gì xảy ra khi có thứ gì đó chết giữa đường bay.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: <code>PUBLISH</code> trả về 0 nói cho bạn biết gì (8.1), vì sao <code>XDEL</code> không giải phóng bộ nhớ (8.2), PEL để làm gì (8.3), và vì sao <code>min-idle-time</code> phải lớn hơn handler chậm nhất của bạn (8.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: '`PUBLISH orders "job:88"` returns 0. What has happened to that message?|||`PUBLISH orders "job:88"` trả về 0. Chuyện gì đã xảy ra với thông điệp đó?',
            options: [
              'It is queued on the channel until a subscriber connects|||Nó được xếp hàng trên kênh cho tới khi có bên đăng ký nối vào',
              'Nobody was subscribed, so it was written to nobody and is gone permanently — Pub/Sub stores nothing, and the return value is the only feedback you get|||Không ai đang đăng ký, nên nó không được ghi cho ai cả và đã mất vĩnh viễn — Pub/Sub không lưu gì, và giá trị trả về là phản hồi duy nhất bạn nhận được',
              'It was delivered but no subscriber acknowledged it|||Nó đã được giao nhưng không bên đăng ký nào xác nhận',
              'The channel does not exist and must be created with a command first|||Kênh đó không tồn tại và phải được tạo bằng một lệnh trước đã',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After calling `subscribe()` on your main Redis client, unrelated `GET` calls elsewhere in the app start throwing. Why?|||Sau khi gọi `subscribe()` trên thư viện khách Redis chính, những lệnh `GET` chẳng liên quan ở chỗ khác trong ứng dụng bắt đầu ném lỗi. Vì sao?',
            options: [
              'The subscription consumed the connection pool, so no connections remain|||Phép đăng ký đã ngốn hết gáo kết nối nên không còn kết nối nào',
              'Pub/Sub puts Redis into a read-only mode until you unsubscribe|||Pub/Sub đẩy Redis vào chế độ chỉ-đọc cho tới khi bạn huỷ đăng ký',
              'Under RESP2 a subscribed connection accepts only the subscribe/unsubscribe family plus PING, QUIT and RESET — Pub/Sub needs its own connection, so use redis.duplicate()|||Dưới RESP2, một kết nối đã đăng ký chỉ nhận họ lệnh subscribe/unsubscribe cộng PING, QUIT và RESET — Pub/Sub cần kết nối riêng, nên hãy dùng redis.duplicate()',
              'Subscribing switches the client to database 1, where those keys do not exist|||Việc đăng ký chuyển thư viện khách sang cơ sở dữ liệu số 1, nơi những khoá đó không tồn tại',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You XDEL 100,000 entries from a stream. XLEN drops as expected but MEMORY USAGE does not move at all. Why?|||Bạn XDEL 100.000 mục khỏi một stream. XLEN tụt xuống đúng như mong đợi nhưng MEMORY USAGE không nhúc nhích chút nào. Vì sao?',
            options: [
              'MEMORY USAGE is sampled, so it needs SAMPLES 0 to reflect the change|||MEMORY USAGE là lấy mẫu, nên nó cần SAMPLES 0 để phản ánh thay đổi',
              'A stream is a radix tree of macro nodes that pack many entries into one block; XDEL only tombstones an entry and cannot rewrite a packed node, so memory returns only when a whole node is freed — use MAXLEN ~ or MINID instead|||Một stream là cây radix gồm các nút vĩ mô nhồi nhiều mục vào một khối; XDEL chỉ dựng bia mộ cho một mục và không viết lại được nút đã nhồi chặt, nên bộ nhớ chỉ về khi cả một nút được giải phóng — hãy dùng MAXLEN ~ hoặc MINID thay vào',
              'Deleted entries are kept until every consumer group has acknowledged them|||Các mục đã xoá được giữ lại cho tới khi mọi nhóm tiêu thụ đã xác nhận chúng',
              'The memory is released asynchronously and will appear after the next background save|||Bộ nhớ được giải phóng bất đồng bộ và sẽ hiện ra sau lần lưu nền tiếp theo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In XREADGROUP, what is the difference between reading with `>` and reading with an explicit ID like `0`?|||Trong XREADGROUP, đọc bằng `>` khác đọc bằng một mã tường minh như `0` ở chỗ nào?',
            options: [
              '`>` reads forwards and `0` reads backwards through the stream|||`>` đọc xuôi còn `0` đọc ngược qua stream',
              '`>` blocks and `0` returns immediately|||`>` thì chặn còn `0` thì trả về ngay',
              '`>` reads only from the group leader; `0` reads from any consumer|||`>` chỉ đọc từ trưởng nhóm; `0` đọc từ consumer bất kỳ',
              '`>` delivers entries never given to anyone (the steady-state path); an explicit ID re-reads THIS consumer’s own still-unacknowledged entries (the recovery path after a crash)|||`>` giao những mục chưa từng đưa cho ai (đường đi ở trạng thái ổn định); một mã tường minh đọc lại những mục chưa xác nhận của CHÍNH consumer này (đường hồi phục sau một cú sập)',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A worker calls XACK inside a `finally` block so it always runs. What does this break?|||Một worker gọi XACK bên trong khối `finally` để nó luôn chạy. Chuyện đó phá vỡ điều gì?',
            options: [
              'Nothing — acknowledging unconditionally is the recommended pattern|||Không phá gì cả — xác nhận vô điều kiện là khuôn được khuyến nghị',
              'A failed handler still acknowledges, which removes the entry from the PEL — so the entry can never be retried and the job is silently dropped|||Một handler thất bại vẫn xác nhận, và điều đó gỡ mục khỏi PEL — nên mục không bao giờ được thử lại và cái việc bị vứt đi âm thầm',
              'It causes the entry to be delivered twice, once on success and once on failure|||Nó khiến mục được giao hai lần, một lần khi thành công và một lần khi thất bại',
              'XACK in a finally block raises NOGROUP because the group state is inconsistent|||XACK trong khối finally sẽ báo NOGROUP vì trạng thái nhóm không nhất quán',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your handler legitimately takes up to 45 seconds. You set the sweeper’s min-idle-time to 30 seconds. What goes wrong?|||Handler của bạn chính đáng mất tới 45 giây. Bạn đặt min-idle-time của tiến trình quét là 30 giây. Hỏng ở đâu?',
            options: [
              'The sweeper claims entries from consumers that are still actively processing them, so the job runs twice concurrently — and the two slower workers make the sweeper claim again, which amplifies|||Tiến trình quét đòi các mục từ những consumer vẫn đang tích cực xử lý chúng, nên việc chạy hai lần đồng thời — rồi hai worker chậm hơn khiến tiến trình quét lại đòi tiếp, và nó khuếch đại lên',
              'Nothing — XCLAIM refuses to claim from a consumer that is still connected|||Không sao — XCLAIM từ chối đòi từ một consumer vẫn đang kết nối',
              'The entries are dead-lettered after 30 seconds regardless of the delivery count|||Các mục bị đẩy vào thư chết sau 30 giây bất kể số lần đã giao',
              'The sweeper deadlocks, because two consumers cannot own the same PEL entry|||Tiến trình quét bị bế tắc, vì hai consumer không thể cùng sở hữu một mục PEL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A consumer group gives you at-least-once delivery. What does that require of your handler, and why can no XACK placement fix it?|||Một nhóm tiêu thụ cho bạn giao ít-nhất-một-lần. Điều đó đòi hỏi gì ở handler của bạn, và vì sao không cách đặt XACK nào chữa được?',
            options: [
              'Nothing special — acknowledging immediately after the work makes it exactly-once|||Không đòi hỏi gì đặc biệt — xác nhận ngay sau khi làm việc là thành đúng-một-lần',
              'It requires NOACK mode, which converts at-least-once into exactly-once|||Nó đòi phải bật chế độ NOACK, vốn biến ít-nhất-một-lần thành đúng-một-lần',
              'It requires the handler to be idempotent: there is no ordering of "do the work" and "acknowledge" that is atomic across Redis and the outside world, so dying between them means a redelivery|||Nó đòi handler phải lặp-lại-vô-hại: không có thứ tự nào giữa "làm việc" và "xác nhận" mà nguyên tử được xuyên qua Redis và thế giới bên ngoài, nên chết ở khoảng giữa nghĩa là một lần giao lại',
              'It requires MULTI around the handler and the XACK, which makes the pair atomic|||Nó đòi bọc handler cùng lệnh XACK trong MULTI, và điều đó làm cặp đó thành nguyên tử',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Before putting orders you cannot lose into a Redis stream, which two settings must you check?|||Trước khi đặt những đơn hàng bạn không thể mất vào một stream Redis, bạn phải kiểm hai thiết lập nào?',
            options: [
              '`stream-node-max-entries` and `stream-node-max-bytes`, which control the radix node size|||`stream-node-max-entries` và `stream-node-max-bytes`, hai thứ điều khiển kích thước nút radix',
              '`appendonly` (a stream is only as durable as your persistence config) and `maxmemory-policy` (a stream is a normal key, so allkeys-lru can evict the whole queue to make room)|||`appendonly` (một stream chỉ bền bằng đúng cấu hình lưu lâu dài của bạn) và `maxmemory-policy` (một stream là khoá bình thường, nên allkeys-lru có thể đẩy cả hàng đợi đi để lấy chỗ)',
              '`notify-keyspace-events` and `busy-reply-threshold`|||`notify-keyspace-events` và `busy-reply-threshold`',
              'Neither — streams are written to disk synchronously on every XADD by design|||Không cần cái nào — stream được ghi xuống đĩa đồng bộ ở mỗi lệnh XADD theo thiết kế',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
