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
      description: 'Emit không có ack là fire-and-forget. Nếu client offline lúc packet đến, packet mất. Socket.io KHÔNG replay.',
      content: `
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
<p><strong>This is at-most-once — not reliability.</strong> The packet either reaches the client or it does not. No guarantee. No exception. The client was offline for a few seconds? The message flew off into space.</p>
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
<p><strong>Trap — expecting reliable delivery from socket.io because &quot;the WebSocket underneath guarantees delivery&quot;.</strong> WebSocket's TCP guarantees delivery WITHIN a connection. If the connection breaks, in-flight packets are LOST. WebSocket plus reconnect does NOT replay. This is the number-one misunderstanding among newer developers.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Socket.io defaults to at-most-once fire-and-forget — a packet sitting in the send buffer at disconnect time is lost, with no exception and no replay — which is right for presence, typing and UI updates but WRONG for chat, payments and order status, where you must deliberately add ack plus retry (lesson 6.2) or use an HTTP POST plus a DB write.</p>
</div>

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
<p><strong>Đây là at-most-once — không phải reliability.</strong> Packet đến client hoặc mất. Không có bảo đảm nào. Không có exception. Client offline vài giây? Message bay vào không gian.</p>
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
<p><strong>Bẫy — nghĩ socket.io cho reliable delivery vì &quot;WebSocket bên dưới có delivery guarantee&quot;.</strong> WebSocket TCP bảo đảm packet đến TRONG connection. Nếu connection break, packet trong-flight MẤT. WebSocket + reconnect KHÔNG replay. Đây là điểm không hiểu số 1 khi dev mới.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.io default là at-most-once fire-and-forget — packet trong send buffer khi disconnect thì mất, không có exception, không có replay — đúng cho presence/typing/UI update nhưng SAI cho chat/payment/order status, phải chủ động thêm ack + retry (bài 6.2) hoặc dùng HTTP POST + DB.</p>
</div>

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
</div>

<div class="pitfall">
<p><strong>Trap — forgetting to call <code>ack</code> in the server handler.</strong> The client waits out the timeout (3s by default) and retries. You assume the client is buggy; in fact the server never acked. The rule: every <code>emitWithAck</code> on the client MUST have a matching <code>ack(...)</code> on the server, even when the payload is empty. A missing ack is the number-one bug with this pattern.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> At-least-once trong socket.io = <code>emitWithAck</code> plus a timeout plus a backoff retry loop plus a client-generated <code>messageId</code> for server-side dedup — the cost is +50-200ms of latency plus the memory to track pending acks, so use it only for data that matters (chat, payments, orders), NOT for realtime UI updates.</p>
</div>

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
</div>

<div class="pitfall">
<p><strong>Bẫy — quên gọi <code>ack</code> ở server handler.</strong> Client wait timeout (3s default), retry. Bạn tưởng client bug, thật ra server không ack. Rule: mọi <code>emitWithAck</code> phía client PHẢI có <code>ack(...)</code> phía server, ngay cả khi payload trống. Missing ack là bug số 1 với ack pattern.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> At-least-once trong socket.io = <code>emitWithAck</code> + timeout + retry loop với backoff + client-generated <code>messageId</code> để dedup ở server — cost là +50-200ms latency + memory tracking pending acks, chỉ dùng cho data quan trọng (chat/payment/order), KHÔNG cho realtime UI updates.</p>
</div>

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
      // Duplicate — trả order cũ
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
<p><strong>This is NOT a socket.io matter.</strong> Exactly-once is a property of the whole system, not of the transport layer. Socket.io plus acks gives you at-least-once. For exactly-once, the application layer has to provide dedup plus an atomic operation.</p>
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
<p><strong>Đây KHÔNG phải chuyện socket.io.</strong> Exactly-once là property của toàn hệ thống, không riêng của layer transport. Socket.io + ack cho at-least-once. Muốn exactly-once, layer application phải có dedupe + atomic operation.</p>
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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Ordering: what socket.io does and does not guarantee</h2>
<p class="lead">TCP guarantees byte order. Socket.io on top preserves event order — WITHIN one socket. Between two sockets, no guarantee. This matters when your user has three tabs, or when broadcasts fan through Redis pub/sub.</p>

<h3>Ordering guarantees</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CO</span><span class="lz-t">Within one socket</span><span class="lz-d">The server emits event A then event B → the client receives A then B (TCP ordering). This holds for both polling and WebSocket.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Between two sockets</span><span class="lz-d">A user has tab 1 and tab 2 and the server broadcasts: <code>io.to(&quot;user:42&quot;).emit(&#39;X&#39;)</code>. Tab 1 may receive X before tab 2 or after — no guarantee either way.</span></div>
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Between two workers (a cluster)</span><span class="lz-d">Workers A and B both emit into the room. Redis pub/sub guarantees no cross-worker delivery order.</span></div>
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
<div class="lz-layer"><span class="lz-lname">database ID (auto-increment)</span><span class="lz-lnote">The proper answer — the DB is monotonic. But it requires persisting before emitting (a DB round trip). This repo uses it for <code>chat:new-message</code></span></div>
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
<div class="lz-step"><span class="lz-k">KHONG</span><span class="lz-t">Giữa hai worker (cluster)</span><span class="lz-d">Worker A và B đều emit đến room. Redis pub/sub không guarantee thứ tự cross-worker delivery.</span></div>
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
<div class="lz-layer"><span class="lz-lname">database ID (auto-increment)</span><span class="lz-lnote">Chuẩn — DB monotonic. Nhưng cần persist trước khi emit (round trip DB). Kho này dùng cái này cho <code>chat:new-message</code></span></div>
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
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>When to use HTTP instead</h2>
<p class="lead">Socket.io is powerful, but for many actions HTTP POST is simpler, more reliable, and easier to debug. This lesson gives three criteria to decide.</p>

<h3>Three criteria</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Do you need server push (the server speaking first)?</span><span class="lz-d">A chat message arrives — the user did not request it, the server pushed. An order status changes — the user did not query, the server pushed. If the server has to push, you need socket.io.</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Do you need the response immediately?</span><span class="lz-d">A user clicks &quot;Send&quot; and expects the message to appear at once. An HTTP round trip is 100-500ms. A socket.io emit plus ack is ~50-100ms. If &gt;200ms of lag is unacceptable, use socket.io.</span></div>
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
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Cần response ngay?</span><span class="lz-d">User click &quot;Send&quot; và mong thấy tin nhắn hiện ngay. HTTP round trip 100-500ms. Socket.io emit + ack: ~50-100ms. Nếu lag &gt;200ms không chấp nhận được, socket.io.</span></div>
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
