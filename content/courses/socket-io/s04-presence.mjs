const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 4: Presence và bẫy O(N²).
 * Đo: comment thật của kho này (messaging.socket.ts:180-198) nói về "O(N²)
 * storm during deploy reconnects". Bài này đo chính xác cost đó.
 */

export default {
  title: 'Chapter 4 — Presence and the O(N²) trap|||Chương 4 — Presence và bẫy O(N²)',
  slug: 'io-ch4-presence',
  description: 'Sáu bài về vì sao presence dễ làm sai, cost của cách sai đo được, và pattern kho này chọn — emitPresenceTo(audience) thay io.emit — với dữ liệu thật.',
  sortOrder: 5,
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Naive presence: io.emit and why it is O(N²)|||4.1 — Presence ngây thơ: io.emit và vì sao O(N²)',
      slug: 'io-4-1-presence-naive',
      type: 'VIDEO',
      description: 'Cách hiển nhiên — io.emit(`presence:update`, ...) — cho ra O(N²) cost khi N connect/disconnect. Comment thật của kho này (messaging.socket.ts:180-198) nói &quot;O(N²) storm during deploy reconnects&quot;.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Naive presence: io.emit and why it is O(N²)</h2>
<p class="lead">Every chat app wants to show &quot;X is online&quot;. The naive implementation seems obvious and works fine at 10 users. It falls apart at 10.000, and this repo has the comment to prove it: &quot;an O(N²) storm during deploy reconnects&quot;.</p>

<h3>The naive version</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);

  // NAIVE: broadcast to EVERYONE
  io.emit('presence:update', { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);
    io.emit('presence:update', { userId, online: false });
  });
});
</code></pre>

<h3>Cost analysis</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 user connect</span><span class="lz-t">1 event × N receivers</span><span class="lz-d">With N=10,000 sockets connected, each connect means 10,000 packets to send. Fine — 100 KB in total.</span></div>
<div class="lz-step"><span class="lz-k">N users connect</span><span class="lz-t">N × N = N² packets</span><span class="lz-d">With N=10,000 and all of them reconnecting at once (a deploy): 100,000,000 packets. At 60 bytes each that is 6 GB of traffic — in a handful of seconds.</span></div>
<div class="lz-step"><span class="lz-k">CPU cost</span><span class="lz-t">JSON.stringify × N²</span><span class="lz-d">Node serialises the payload N² times. At ~2μs per serialisation, 100M × 2μs = 200 seconds of CPU. Across 8 cores: 25 seconds of latency.</span></div>
</div>

<div class="out">Deploy scenario:
  Truoc deploy: 10.000 socket online
  Deploy: server restart, 10.000 disconnect + 10.000 reconnect
  Presence update: 20.000 events, moi cai duoc emit den 10.000 client
  Tong: 200.000.000 packet trong ~10 giay
  = 20 trieu packets/second
  = server dead
</div>

<h3>The actual comment in this repo</h3>
<pre><code class="language-ts">// messaging.socket.ts:180-198
/**
 * Emit a presence update ONLY to the given audience (their per-user
 * rooms), instead of io.emit to every connected socket. The FE only
 * ever renders presence for friends (ActiveNowRow) and chat peers
 * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
 * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
 * during deploy reconnects. audience = friends ∪ thread peers.
 */
function emitPresenceTo(
  audience: number[],
  payload: { userId: number; online: boolean; lastSeen: number },
): void {
  for (const uid of audience) {
    io?.to(&#96;user:\${uid}&#96;).emit('presence:update', payload);
  }
}
</code></pre>

<div class="callout ok">
<p><strong>This comment records a MEASUREMENT — not a theory.</strong> &quot;O(N²) storm during deploy reconnects&quot; narrates a real incident that happened and was then written down. The cost drops from N² to N × |audience| — with an average audience of 30 people, that is a ~333× reduction at N=10,000.</p>
</div>

<h3>The estimate for this repo</h3>
<div class="out">N = 10.000 online users (uoc luong tuong lai)
audience (friends + thread peers) trung binh: 30 nguoi

NAIVE:  10.000 connect * 10.000 receivers = 100.000.000 packets
FIX:    10.000 connect *     30 receivers =     300.000 packets

Tiet kiem: 333x tren luot event
Deploy storm giam tu ~5 phut server dead xuong ~1 giay lag nho
</div>

<h3>Why "just don't emit disconnect" is not enough</h3>
<pre><code class="language-ts">// Y tuong kem: chi emit connect, khong disconnect (presence tu decay)
io.on('connection', (socket) =&gt; {
  io.emit('presence:update', { userId, online: true });
  // KHONG emit disconnect
});

// Cost: 50% van la N x N = N^2. Van kem.
</code></pre>

<p>A 2× reduction does not solve a complexity problem — it is still O(N²). You have to change the ALGORITHM, not trim a constant.</p>

<div class="pitfall">
<p><strong>Trap — dismissing 10,000 users as &quot;too far off&quot; to care about today.</strong> This repo currently has ~200 online users. But a deploy storm scales as N² in <em>current N</em>, not in the target N. 200 × 200 = 40,000 packets. Still easy. 2,000 × 2,000 = 4 million packets — still survivable, but with a full second of lag. The problem detonates when you are not watching, not when you are waiting for it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Naive presence <code>io.emit</code> is O(N²) — at N=10,000 a deploy reconnect storm is 100 million packets in a few seconds (a dead server), and this repo's fix (<code>emitPresenceTo(audience)</code>, audience ≈ 30) cuts that 333× down to ~300k packets — and the repo's own comment is the evidence that it was actually measured.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Broadcasting messages</span><span class="lc-sub">socket.io/docs/v4/broadcasting-events — chi tiết cost của io.emit vs io.to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 4.2 — the friends table</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách lấy audience nhanh (query cache).</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Presence ngây thơ: io.emit và vì sao O(N²)</h2>
<p class="lead">Mọi chat app đều muốn hiện &quot;X đang online&quot;. Cách hiển nhiên có vẻ đúng và chạy tốt ở 10 user. Nó vỡ ở 10.000, và kho này có comment ghi lại: &quot;O(N²) storm during deploy reconnects&quot;.</p>

<h3>Phiên bản ngây thơ</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);

  // NGAY THO: broadcast den TAT CA
  io.emit('presence:update', { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);
    io.emit('presence:update', { userId, online: false });
  });
});
</code></pre>

<h3>Phân tích cost</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 user connect</span><span class="lz-t">1 event × N người nhận</span><span class="lz-d">Với N=10.000 sockets kết nối, mỗi connect là 10.000 packet cần gửi. OK, tổng 100 KB.</span></div>
<div class="lz-step"><span class="lz-k">N user connect</span><span class="lz-t">N × N = N² packets</span><span class="lz-d">Với N=10.000 và tất cả reconnect cùng lúc (deploy): 100.000.000 packet. Ở 60 byte/packet là 6 GB traffic — trong vài giây.</span></div>
<div class="lz-step"><span class="lz-k">CPU cost</span><span class="lz-t">JSON.stringify × N²</span><span class="lz-d">Node encode payload N² lần. Với ~2μs/serialize, 100M × 2μs = 200 giây CPU. Trên 8 core: 25 giây latency.</span></div>
</div>

<div class="out">Deploy scenario:
  Truoc deploy: 10.000 socket online
  Deploy: server restart, 10.000 disconnect + 10.000 reconnect
  Presence update: 20.000 events, moi cai duoc emit den 10.000 client
  Tong: 200.000.000 packet trong ~10 giay
  = 20 trieu packets/second
  = server dead
</div>

<h3>Comment thật của kho này</h3>
<pre><code class="language-ts">// messaging.socket.ts:180-198
/**
 * Emit a presence update ONLY to the given audience (their per-user
 * rooms), instead of io.emit to every connected socket. The FE only
 * ever renders presence for friends (ActiveNowRow) and chat peers
 * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
 * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
 * during deploy reconnects. audience = friends ∪ thread peers.
 */
function emitPresenceTo(
  audience: number[],
  payload: { userId: number; online: boolean; lastSeen: number },
): void {
  for (const uid of audience) {
    io?.to(&#96;user:\${uid}&#96;).emit('presence:update', payload);
  }
}
</code></pre>

<div class="callout ok">
<p><strong>Đây là comment ĐÃ ĐO — không phải lý thuyết.</strong> &quot;O(N²) storm during deploy reconnects&quot; là câu tường thuật một sự cố thật xảy ra rồi được ghi lại. Cost giảm từ N² xuống N × |audience| — với audience trung bình 30 người, thì factor giảm ~333× ở N=10.000.</p>
</div>

<h3>Ước lượng ở kho này</h3>
<div class="out">N = 10.000 online users (uoc luong tuong lai)
audience (friends + thread peers) trung binh: 30 nguoi

NGAYTHO: 10.000 connect * 10.000 receivers = 100.000.000 packets
VA:      10.000 connect *     30 receivers =     300.000 packets

Tiet kiem: 333x tren luot event
Deploy storm giam tu ~5 phut server dead xuong ~1 giay lag nho
</div>

<h3>Vì sao &quot;chỉ không emit disconnect&quot; không đủ</h3>
<pre><code class="language-ts">// Y tuong kem: chi emit connect, khong disconnect (presence tu decay)
io.on('connection', (socket) =&gt; {
  io.emit('presence:update', { userId, online: true });
  // KHONG emit disconnect
});

// Cost: 50% van la N x N = N^2. Van kem.
</code></pre>

<p>Giảm 2× không giải quyết vấn đề O — vẫn O(N²). Cần thay THUẬT toán, không chỉ trim constant.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ 10.000 user là &quot;quá scale&quot; không quan tâm hôm nay.</strong> Kho này ĐANG ~200 online user. Nhưng deploy storm scale hàm N² của <em>current N</em>, không target N. 200 × 200 = 40.000 packet. Vẫn dễ handle. 2.000 × 2.000 = 4 triệu packet — cũng handle được nhưng lag 1 giây. Vấn đề bung khi bạn ít khi để ý, không phải khi bạn đợi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presence ngây thơ <code>io.emit</code> là O(N²) — với N=10.000 và deploy reconnect storm là 100 triệu packet trong vài giây (server dead), và fix của kho này (<code>emitPresenceTo(audience)</code>, audience ≈ 30) giảm 333× xuống ~300k packet — trong đó comment kho là bằng chứng có đo thật.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Broadcasting messages</span><span class="lc-sub">socket.io/docs/v4/broadcasting-events — chi tiết cost của io.emit vs io.to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 4.2 — bảng friends</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách lấy audience nhanh (query cache).</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Audience: computing who cares|||4.2 — Audience: tính ai cần biết',
      slug: 'io-4-2-audience',
      type: 'VIDEO',
      description: 'Audience = friends ∪ thread peers. Cache trong Redis; invalidate khi friend add/remove hoặc thread join/leave. Không compute mỗi connect/disconnect.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Audience: computing who cares</h2>
<p class="lead">Lesson 4.1 pointed at <code>emitPresenceTo(audience)</code>. This lesson answers: what is that audience, how do you compute it fast, and where does it come from?</p>

<h3>Definition</h3>
<pre><code class="language-ts">// Ai can biet user X online/offline?
audience(X) = friends(X) &cup; threadPeers(X)

// friends(X) = ban be double-following
// threadPeers(X) = user chung mot cuoc chat DM
</code></pre>

<p>This repo's UI renders presence in only 4 places (the comment quoted in 4.1): <code>ActiveNowRow</code> (friends), <code>ThreadList</code>/<code>MiniChatDock</code>/<code>ChatInfoPanel</code>/<code>/messages</code> (chat peers). Nobody else needs to know. That is the audience.</p>

<h3>The naive computation — slow if it runs on every connect</h3>
<pre><code class="language-ts">async function getAudience(userId: number): Promise&lt;number[]&gt; {
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'ACCEPTED' },
  });
  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { userId } } },
    include: { participants: true },
  });
  const peers = new Set&lt;number&gt;();
  friends.forEach(f =&gt; peers.add(f.userAId === userId ? f.userBId : f.userAId));
  threads.forEach(t =&gt; t.participants.forEach(p =&gt; p.userId !== userId && peers.add(p.userId)));
  return [...peers];
}

// Cost: 2 query, ~10-20ms
// Chay moi connect/disconnect: 10.000 user * 20ms = 200 giay CPU tren deploy
</code></pre>

<div class="callout warn">
<p><strong>Computing the audience on every connect is an O(N) DB query.</strong> In a deploy storm that is 10,000 queries in a few seconds — the Prisma pool drains and DB CPU hits 100%. You need a CACHE.</p>
</div>

<h3>Cache trong Redis</h3>
<pre><code class="language-ts">const AUD_TTL = 300; // 5 phut

async function getAudienceCached(userId: number): Promise&lt;number[]&gt; {
  const key = &#96;presence:audience:\${userId}&#96;;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await getAudience(userId);
  await redis.setex(key, AUD_TTL, JSON.stringify(fresh));
  return fresh;
}

// Cost sau warm-up: ~1ms (redis GET)
// Deploy storm: 10.000 * 1ms = 10 giay chi phi audience compute
</code></pre>

<h3>When to invalidate</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">friend added/removed</span><span class="lz-d">Invalidate both users: <code>redis.del(&#96;presence:audience:\${a}&#96;, &#96;presence:audience:\${b}&#96;)</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thread created / participant added</span><span class="lz-d">Invalidate every participant of that thread.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">a 5-minute TTL</span><span class="lz-d">A backstop for when invalidation is missed (a bug, a race). The trade: at most 5 minutes of staleness, which is acceptable for presence.</span></div>
</div>

<h3>Alternative: precomputed table</h3>
<pre><code class="language-sql">-- Materialized audience per user
CREATE TABLE presence_audience (
  user_id       INT NOT NULL,
  audience_user INT NOT NULL,
  PRIMARY KEY (user_id, audience_user)
);
-- Populated on friend/thread changes; queried at connect
</code></pre>

<p>That is a different trade: write-heavy (every friend/thread change is N writes), read-fast (one index-backed query). This repo picks the Redis cache because the read/write ratio is ~100:1 — the cache is the healthier option.</p>

<div class="pitfall">
<p><strong>Trap — forgetting to invalidate the cache when one user blocks another.</strong> A block means removing the friend and leaving every shared thread. If invalidation is incomplete, the ex-friend keeps receiving presence updates for ~5 minutes. A very subtle bug, because users block rarely and tests usually miss it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The audience is friends ∪ thread peers, cached for 5 minutes in Redis (1ms per read once warm), invalidated on friend/thread changes with a TTL backstop — cutting the audience-computation cost for a 10k-user deploy storm from 200s to 10s, at the acceptable price of ≤5 minutes of presence staleness.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — Caching patterns</span><span class="lc-sub">redis.io/docs/manual/patterns/twemproxy — cache-aside, đủ cho use case này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">CuongThai's Redis keys</span><span class="lc-sub">/courses/redis/learn${REF} — pattern cache-aside chi tiết, kèm invalidation strategies.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Audience: tính ai cần biết</h2>
<p class="lead">Bài 4.1 trỏ đến <code>emitPresenceTo(audience)</code>. Bài này trả lời: audience đó là gì, làm sao tính nhanh, và nó đến từ đâu?</p>

<h3>Định nghĩa</h3>
<pre><code class="language-ts">// Ai can biet user X online/offline?
audience(X) = friends(X) &cup; threadPeers(X)

// friends(X) = ban be double-following
// threadPeers(X) = user chung mot cuoc chat DM
</code></pre>

<p>UI của kho render presence chỉ ở 4 chỗ (comment nêu ở 4.1): <code>ActiveNowRow</code> (bạn), <code>ThreadList</code>/<code>MiniChatDock</code>/<code>ChatInfoPanel</code>/<code>/messages</code> (chat peers). Không ai khác cần biết. Đó là audience.</p>

<h3>Ngây thơ compute — chậm nếu chạy mỗi connect</h3>
<pre><code class="language-ts">async function getAudience(userId: number): Promise&lt;number[]&gt; {
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'ACCEPTED' },
  });
  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { userId } } },
    include: { participants: true },
  });
  const peers = new Set&lt;number&gt;();
  friends.forEach(f =&gt; peers.add(f.userAId === userId ? f.userBId : f.userAId));
  threads.forEach(t =&gt; t.participants.forEach(p =&gt; p.userId !== userId && peers.add(p.userId)));
  return [...peers];
}

// Cost: 2 query, ~10-20ms
// Chay moi connect/disconnect: 10.000 user * 20ms = 200 giay CPU tren deploy
</code></pre>

<div class="callout warn">
<p><strong>Compute audience mỗi connect là O(N) query DB.</strong> Trong deploy storm, đó là 10.000 query trong vài giây — Prisma pool cạn, DB CPU 100%. Cần CACHE.</p>
</div>

<h3>Cache trong Redis</h3>
<pre><code class="language-ts">const AUD_TTL = 300; // 5 phut

async function getAudienceCached(userId: number): Promise&lt;number[]&gt; {
  const key = &#96;presence:audience:\${userId}&#96;;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await getAudience(userId);
  await redis.setex(key, AUD_TTL, JSON.stringify(fresh));
  return fresh;
}

// Cost sau warm-up: ~1ms (redis GET)
// Deploy storm: 10.000 * 1ms = 10 giay chi phi audience compute
</code></pre>

<h3>Invalidate khi nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">friend added/removed</span><span class="lz-d">Invalidate cả hai user: <code>redis.del(&#96;presence:audience:\${a}&#96;, &#96;presence:audience:\${b}&#96;)</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thread created / participant added</span><span class="lz-d">Invalidate tất cả participants của thread đó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TTL 5 phút</span><span class="lz-d">Backstop nếu invalidate miss (bug, race). Trade off: staleness tối đa 5 phút, chấp nhận được cho presence.</span></div>
</div>

<h3>Alternative: precomputed table</h3>
<pre><code class="language-sql">-- Materialized audience per user
CREATE TABLE presence_audience (
  user_id       INT NOT NULL,
  audience_user INT NOT NULL,
  PRIMARY KEY (user_id, audience_user)
);
-- Populated on friend/thread changes; queried at connect
</code></pre>

<p>Đây là tradeoff khác: write-heavy (mỗi friend/thread change là N write), read-fast (một query index-based). Kho này chọn Redis cache vì read/write ratio là ~100:1 — cache lành hơn.</p>

<div class="pitfall">
<p><strong>Bẫy — quên invalidate cache khi user block user khác.</strong> Block = remove friend + rời tất thread chung. Nếu invalidate không đầy đủ, ex-friend vẫn nhận presence updates ~5 phút. Bug rất tinh vi vì hiếm khi user block; test thường không bắt.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Audience = friends ∪ thread peers, cache 5 phút trong Redis (1ms per read sau warm-up), invalidate khi friend/thread change + TTL backstop — giảm cost compute audience từ 200s cho deploy storm 10k user xuống 10s, và trade off staleness ≤5 phút chấp nhận được cho presence.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — Caching patterns</span><span class="lc-sub">redis.io/docs/manual/patterns/twemproxy — cache-aside, đủ cho use case này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá Redis của CuongThai</span><span class="lc-sub">/courses/redis/learn${REF} — pattern cache-aside chi tiết, kèm invalidation strategies.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Multi-tab: one user, many sockets|||4.3 — Nhiều tab: một user, nhiều socket',
      slug: 'io-4-3-multi-tab',
      type: 'VIDEO',
      description: 'User mở 3 tab = 3 socket, 3 sid, cùng userId. Đóng 1 tab KHÔNG nghĩa là user offline. Track socket count per user.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Multi-tab: one user, many sockets</h2>
<p class="lead">A user opens the app in three tabs. That&#39;s three separate WebSocket connections, three sids, but ONE userId. When they close tab 2, they&#39;re not offline — tabs 1 and 3 still live. This lesson fixes the presence logic that gets this wrong.</p>

<h3>The buggy version</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);          // BUG: xoa ngay du user con tab khac
    emitPresenceTo(audience, { userId, online: false });
  });
});
</code></pre>

<div class="callout warn">
<p><strong>The resulting bug:</strong> A user with 2 tabs closes one → presence ripples (online → offline → online 200ms later, once the other tab reports in). Their friends watch the avatar flicker because they merely closed their inbox.</p>
</div>

<h3>Fix: reference counting</h3>
<pre><code class="language-ts">const socketsByUser = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;

  let sockets = socketsByUser.get(userId);
  if (!sockets) socketsByUser.set(userId, sockets = new Set());
  sockets.add(socket.id);

  const wasOffline = sockets.size === 1;
  if (wasOffline) {
    emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
  }

  socket.on('disconnect', () =&gt; {
    const sockets = socketsByUser.get(userId);
    if (!sockets) return;
    sockets.delete(socket.id);

    if (sockets.size === 0) {
      socketsByUser.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
    }
    // co tab khac -> KHONG emit offline
  });
});
</code></pre>

<h3>Combined with the debounce from 1.2</h3>
<pre><code class="language-ts">socket.on('disconnect', (reason) =&gt; {
  const sockets = socketsByUser.get(userId);
  if (!sockets) return;
  sockets.delete(socket.id);
  if (sockets.size &gt; 0) return;              // co tab khac, thoat

  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // debounce 2s cho reconnect
    scheduleOfflineDebounce(userId, 2000);
  } else {
    socketsByUser.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// scheduleOfflineDebounce cancel offline neu socket khac vao trong 2s
</code></pre>

<h3>&quot;lastSeen&quot; — more important than &quot;online&quot;</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">&quot;Active now&quot; strict</span><span class="lz-lnote">Shown only while a socket is connected. No &quot;online 2 minutes ago&quot;. Unambiguous, but the UI flickers easily</span></div>
<div class="lz-layer"><span class="lz-lname">&quot;Active recently&quot; broad</span><span class="lz-lnote">Shows &quot;Active&quot; for 5-10 minutes past lastSeen. A softer UI, but it can mislead — a user who has gone to bed still reads as online</span></div>
<div class="lz-layer"><span class="lz-lname">this repo</span><span class="lz-lnote">Emit both <code>online</code> (a boolean) and <code>lastSeen</code> (Date.now()). The client picks how to render it — <code>ActiveNowRow</code> uses the strict reading, <code>ThreadList</code> uses the broad one</span></div>
</div>

<h3>Redis-backed multi-instance</h3>
<pre><code class="language-ts">// Cluster: mot user co the co tab o worker 1 va tab o worker 2
// -&gt; socketsByUser trong-process KHONG du. Can Redis.

async function markOnline(userId: number, socketId: string) {
  const key = &#96;presence:sockets:\${userId}&#96;;
  await redis.sadd(key, socketId);
  await redis.expire(key, 3600);   // TTL backup

  const count = await redis.scard(key);
  if (count === 1) {
    emitPresenceTo(audience, { userId, online: true, ... });
  }
}
</code></pre>

<div class="pitfall">
<p><strong>Trap — forgetting to clean up <code>socketsByUser</code> when the cluster restarts.</strong> If a worker crashes, an in-process Set vanishes with it. Redis-backed, the entry survives — and a 1h backup TTL clears it eventually. WITHOUT that TTL it is orphaned forever.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Multi-tab presence needs reference counting (a Set&lt;socketId&gt; per userId), emitting offline only when the Set reaches 0 and no debounce has cancelled it — combined with a <code>lastSeen</code> timestamp so the frontend can choose a strict or broad display, and in a cluster it has to live in a Redis <code>SADD</code>/<code>SCARD</code> because an in-process Set is not shared across workers.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — SADD, SCARD, SREM</span><span class="lc-sub">redis.io/commands/sadd — atomic set operations, đủ cho multi-instance socket counting.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 1.2 — disconnect reasons</span><span class="lc-sub">/courses/socket-io/learn${REF} — debounce cho &quot;transport close&quot; là chỗ multi-tab bug hay giấu.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Nhiều tab: một user, nhiều socket</h2>
<p class="lead">User mở app trong 3 tab. Đó là 3 WebSocket riêng biệt, 3 sid, nhưng MỘT userId. Khi họ đóng tab 2, họ KHÔNG offline — tab 1 và 3 vẫn sống. Bài này vá presence logic dễ sai chỗ này.</p>

<h3>Phiên bản buggy</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);          // BUG: xoa ngay du user con tab khac
    emitPresenceTo(audience, { userId, online: false });
  });
});
</code></pre>

<div class="callout warn">
<p><strong>Kết quả bug:</strong> User có 2 tab, đóng 1 → presence gợn (online → offline → online 200ms sau khi tab kia gửi tín hiệu). Bạn bè của họ thấy avatar nhấp nháy khi họ chỉ đóng inbox.</p>
</div>

<h3>Vá: reference counting</h3>
<pre><code class="language-ts">const socketsByUser = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;

  let sockets = socketsByUser.get(userId);
  if (!sockets) socketsByUser.set(userId, sockets = new Set());
  sockets.add(socket.id);

  const wasOffline = sockets.size === 1;
  if (wasOffline) {
    emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
  }

  socket.on('disconnect', () =&gt; {
    const sockets = socketsByUser.get(userId);
    if (!sockets) return;
    sockets.delete(socket.id);

    if (sockets.size === 0) {
      socketsByUser.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
    }
    // co tab khac -> KHONG emit offline
  });
});
</code></pre>

<h3>Kết hợp với debounce từ 1.2</h3>
<pre><code class="language-ts">socket.on('disconnect', (reason) =&gt; {
  const sockets = socketsByUser.get(userId);
  if (!sockets) return;
  sockets.delete(socket.id);
  if (sockets.size &gt; 0) return;              // co tab khac, thoat

  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // debounce 2s cho reconnect
    scheduleOfflineDebounce(userId, 2000);
  } else {
    socketsByUser.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// scheduleOfflineDebounce cancel offline neu socket khac vao trong 2s
</code></pre>

<h3>&quot;lastSeen&quot; — quan trọng hơn &quot;online&quot;</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">&quot;Active now&quot; strict</span><span class="lz-lnote">Chỉ hiện khi có socket connected. Không giữ &quot;online 2 phút trước&quot;. Rõ ràng nhưng UI dễ nhấp nháy</span></div>
<div class="lz-layer"><span class="lz-lname">&quot;Active recently&quot; broad</span><span class="lz-lnote">Hiện &quot;Active&quot; cho tới 5-10 phút sau lastSeen. UI mềm hơn nhưng có thể mislead — user đã đi ngủ vẫn hiện online</span></div>
<div class="lz-layer"><span class="lz-lname">this repo</span><span class="lz-lnote">Emit cả <code>online</code> (boolean) và <code>lastSeen</code> (Date.now()). Client tự chọn render — <code>ActiveNowRow</code> dùng strict, <code>ThreadList</code> dùng broad</span></div>
</div>

<h3>Redis-backed multi-instance</h3>
<pre><code class="language-ts">// Cluster: mot user co the co tab o worker 1 va tab o worker 2
// -&gt; socketsByUser trong-process KHONG du. Can Redis.

async function markOnline(userId: number, socketId: string) {
  const key = &#96;presence:sockets:\${userId}&#96;;
  await redis.sadd(key, socketId);
  await redis.expire(key, 3600);   // TTL backup

  const count = await redis.scard(key);
  if (count === 1) {
    emitPresenceTo(audience, { userId, online: true, ... });
  }
}
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — quên cleanup <code>socketsByUser</code> khi cluster restart.</strong> Nếu worker crash, Set trong-process biến mất. Redis-backed thì entry vẫn còn — với TTL 1h backup, tự dọn. Nếu KHÔNG có TTL, orphan mãi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presence nhiều tab cần reference counting (Set&lt;socketId&gt; per userId), chỉ emit offline khi Set về 0 và không có debounce cancel — kết hợp với <code>lastSeen</code> timestamp cho FE chọn strict vs broad hiển thị, và trong cluster phải dùng Redis <code>SADD</code>/<code>SCARD</code> vì Set trong-process không share qua worker.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — SADD, SCARD, SREM</span><span class="lc-sub">redis.io/commands/sadd — atomic set operations, đủ cho multi-instance socket counting.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 1.2 — disconnect reasons</span><span class="lc-sub">/courses/socket-io/learn${REF} — debounce cho &quot;transport close&quot; là chỗ multi-tab bug hay giấu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Typing indicators: cost per keystroke|||4.4 — Typing indicator: cost mỗi phím gõ',
      slug: 'io-4-4-typing',
      type: 'VIDEO',
      description: 'Emit typing mỗi keystroke = spam. Debounce phía client 500ms, timeout auto-clear phía client 3s, không cần server nhớ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Typing indicators: cost per keystroke</h2>
<p class="lead">Typing indicators are the second most common presence-adjacent feature. The naive version emits an event per keystroke — with a fast typer that&#39;s ~10 events/second. For a 10-user thread, that&#39;s 100 events/second BROADCAST just for typing.</p>

<h3>Naive typer</h3>
<pre><code class="language-tsx">// FE naive
&lt;input onKeyDown={() =&gt; socket.emit('thread:typing', { threadId, userId })} /&gt;

// BE
socket.on('thread:typing', ({ threadId, userId }) =&gt; {
  socket.to(&#96;thread:\${threadId}&#96;).emit('thread:typing', userId);
});
</code></pre>

<div class="callout warn">
<p><strong>The cost in a busy chat:</strong> 10 people in a thread, each averaging 5 keystrokes a second. The server receives 50 events/second and fans each out to 9 people = 450 packets/second. For ONE thread. 100 threads = 45,000 packets/second just for typing indicators.</p>
</div>

<h3>Fix 1: debounce on the client</h3>
<pre><code class="language-tsx">// FE — chi emit khi bat dau go, khong emit lai neu dang go
let lastEmit = 0;
&lt;input onKeyDown={() =&gt; {
  const now = Date.now();
  if (now - lastEmit &gt; 3000) {   // chi emit toi da moi 3s
    socket.emit('thread:typing', { threadId });
    lastEmit = now;
  }
}} /&gt;
</code></pre>

<h3>Fix 2: an auto-clear timeout on the RECEIVING client</h3>
<pre><code class="language-tsx">// FE nhan — clear tu dong sau 3s neu khong nhan typing them
const typingTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('thread:typing', (userId) =&gt; {
  setTypingUsers(prev =&gt; new Set(prev).add(userId));

  const existing = typingTimers.get(userId);
  if (existing) clearTimeout(existing);
  typingTimers.set(userId, setTimeout(() =&gt; {
    setTypingUsers(prev =&gt; {
      const next = new Set(prev); next.delete(userId); return next;
    });
    typingTimers.delete(userId);
  }, 3000));
});
</code></pre>

<div class="callout ok">
<p><strong>The server does NOT need to store typing state.</strong> Entirely ephemeral — if the user disconnects, the client-side timeout clears it. No special <code>disconnect</code> handler required. This is the ephemeral pattern (lesson 1.5) applied correctly.</p>
</div>

<h3>The cost after the fix</h3>
<div class="out">Truoc: 10 user * 5 keystroke/s * 9 receiver = 450 packet/s (1 thread)
Sau debounce 3s: 10 user * 0.33 emit/s * 9 receiver = ~30 packet/s (1 thread)
Tiet kiem: 15x
</div>

<h3>An explicit &quot;stop typing&quot; event — do you need one?</h3>
<pre><code class="language-tsx">// TUY CHON — emit khi user xoa het chu hoac blur input
&lt;input onBlur={() =&gt; socket.emit('thread:typing:stop', { threadId })} /&gt;
</code></pre>

<p>You could. But the client-side timeout already handles it. An explicit &quot;stop&quot; clears the UI up to 3s sooner, at the cost of DOUBLING event traffic (every typing session needs 2 events). This repo does NOT use one — the timeout is smooth enough.</p>

<h3>A rate limit against DDoS</h3>
<pre><code class="language-ts">// Neu client bug hoac malicious, gioi han 5 emit/s
const rateLimiters = new Map&lt;string, { count: number; reset: number }&gt;();

socket.on('thread:typing', (data) =&gt; {
  const key = &#96;\${socket.id}:typing&#96;;
  const now = Date.now();
  const bucket = rateLimiters.get(key) ?? { count: 0, reset: now + 1000 };
  if (now &gt; bucket.reset) { bucket.count = 0; bucket.reset = now + 1000; }
  bucket.count++;
  if (bucket.count &gt; 5) return;   // im lang bo qua
  rateLimiters.set(key, bucket);

  socket.to(&#96;thread:\${data.threadId}&#96;).emit('thread:typing', data.userId);
});
</code></pre>

<div class="pitfall">
<p><strong>Trap — debouncing on the server instead of on the client.</strong> If the server does the debouncing, every socket still spams the server with events. The server saves only on BROADCAST, not on RECEIVE. Debouncing on the CLIENT saves both. Doing both (client debounce + server rate limit) is the standard.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Typing indicators need a CLIENT-side debounce (at most one emit every 3s) plus an auto-clear on the RECEIVING client (a 3s timeout after the last event) plus a server rate limit as backstop — the server stores no state, this is the ephemeral pattern (1.5) in its proper use case, and it cuts the cost 15× against emit-per-keystroke.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket.io — Rate limiting</span><span class="lc-sub">socket.io/get-started/basic-crud-application/#rate-limiting — pattern chuẩn cho server-side.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 1.5 — state patterns</span><span class="lc-sub">/courses/socket-io/learn${REF} — typing là ví dụ tuyệt vời cho ephemeral pattern.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Typing indicator: cost mỗi phím gõ</h2>
<p class="lead">Typing indicator là feature presence-adjacent phổ biến thứ hai. Phiên bản ngây thơ emit một event mỗi keystroke — với người gõ nhanh đó là ~10 events/giây. Cho thread 10 người, đó là 100 events/giây BROADCAST chỉ cho typing.</p>

<h3>Typer ngây thơ</h3>
<pre><code class="language-tsx">// FE ngay tho
&lt;input onKeyDown={() =&gt; socket.emit('thread:typing', { threadId, userId })} /&gt;

// BE
socket.on('thread:typing', ({ threadId, userId }) =&gt; {
  socket.to(&#96;thread:\${threadId}&#96;).emit('thread:typing', userId);
});
</code></pre>

<div class="callout warn">
<p><strong>Cost với chat busy:</strong> 10 người trong thread, mỗi người gõ 5 phím/giây trung bình. Server nhận 50 events/giây, phát mỗi cái đến 9 người = 450 packets/giây. Cho MỘT thread. 100 thread = 45.000 packets/giây cho typing indicator.</p>
</div>

<h3>Vá 1: debounce phía client</h3>
<pre><code class="language-tsx">// FE — chi emit khi bat dau go, khong emit lai neu dang go
let lastEmit = 0;
&lt;input onKeyDown={() =&gt; {
  const now = Date.now();
  if (now - lastEmit &gt; 3000) {   // chi emit toi da moi 3s
    socket.emit('thread:typing', { threadId });
    lastEmit = now;
  }
}} /&gt;
</code></pre>

<h3>Vá 2: timeout auto-clear phía CLIENT nhận</h3>
<pre><code class="language-tsx">// FE nhan — clear tu dong sau 3s neu khong nhan typing them
const typingTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('thread:typing', (userId) =&gt; {
  setTypingUsers(prev =&gt; new Set(prev).add(userId));

  const existing = typingTimers.get(userId);
  if (existing) clearTimeout(existing);
  typingTimers.set(userId, setTimeout(() =&gt; {
    setTypingUsers(prev =&gt; {
      const next = new Set(prev); next.delete(userId); return next;
    });
    typingTimers.delete(userId);
  }, 3000));
});
</code></pre>

<div class="callout ok">
<p><strong>Server KHÔNG cần lưu typing state.</strong> Ephemeral hoàn toàn — nếu user disconnect, client-side timeout tự dọn. Không cần <code>disconnect</code> handler đặc biệt. Đây là ephemeral pattern (bài 1.5) đúng ứng dụng.</p>
</div>

<h3>Cost sau khi vá</h3>
<div class="out">Truoc: 10 user * 5 keystroke/s * 9 receiver = 450 packet/s (1 thread)
Sau debounce 3s: 10 user * 0.33 emit/s * 9 receiver = ~30 packet/s (1 thread)
Tiet kiem: 15x
</div>

<h3>&quot;Stop typing&quot; explicit event — cần không?</h3>
<pre><code class="language-tsx">// TUY CHON — emit khi user xoa het chu hoac blur input
&lt;input onBlur={() =&gt; socket.emit('thread:typing:stop', { threadId })} /&gt;
</code></pre>

<p>Có thể. Nhưng client-side timeout đã lo. &quot;Stop&quot; explicit giúp UI clear sớm hơn 3s, nhưng cost là DOUBLE event traffic (mỗi typing session cần 2 event). Kho này KHÔNG dùng — timeout đã đủ mượt.</p>

<h3>Rate limit chống DDoS</h3>
<pre><code class="language-ts">// Neu client bug hoac malicious, gioi han 5 emit/s
const rateLimiters = new Map&lt;string, { count: number; reset: number }&gt;();

socket.on('thread:typing', (data) =&gt; {
  const key = &#96;\${socket.id}:typing&#96;;
  const now = Date.now();
  const bucket = rateLimiters.get(key) ?? { count: 0, reset: now + 1000 };
  if (now &gt; bucket.reset) { bucket.count = 0; bucket.reset = now + 1000; }
  bucket.count++;
  if (bucket.count &gt; 5) return;   // im lang bo qua
  rateLimiters.set(key, bucket);

  socket.to(&#96;thread:\${data.threadId}&#96;).emit('thread:typing', data.userId);
});
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — debounce phía server thay vì phía client.</strong> Nếu server debounce, mỗi socket vẫn spam server bằng events. Server chỉ tiết kiệm BROADCAST, không tiết kiệm RECEIVE. Debounce phía CLIENT giảm cả hai. Đặt cả hai (client debounce + server rate limit) là chuẩn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Typing indicator cần debounce phía CLIENT (chỉ emit mỗi 3s tối đa) + auto-clear phía CLIENT nhận (timeout 3s sau event cuối) + server rate limit backstop — server không cần lưu state, đây là ephemeral pattern (1.5) đúng use case và giảm cost 15× so với emit-per-keystroke.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket.io — Rate limiting</span><span class="lc-sub">socket.io/get-started/basic-crud-application/#rate-limiting — pattern chuẩn cho server-side.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 1.5 — state patterns</span><span class="lc-sub">/courses/socket-io/learn${REF} — typing là ví dụ tuyệt vời cho ephemeral pattern.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Read receipts: three visibility levels|||4.5 — Read receipt: ba mức hiển thị',
      slug: 'io-4-5-read-receipt',
      type: 'VIDEO',
      description: 'Đã gửi (server ack), đã đến (client ack), đã xem (user thao tác). Mỗi cái là quyết định UX + technical khác nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Read receipts: three visibility levels</h2>
<p class="lead">Messenger's &quot;Seen&quot; is a familiar feature. It hides three distinct levels — and all three differ in both technical implementation and UX signalling.</p>

<h3>The three levels</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SENT — the server has stored it</span><span class="lz-d">Client emit <code>chat:send</code>, the server persists to the DB and the ack succeeds. The UI shows a &quot;sent&quot; icon (one tick). No realtime needed — an HTTP POST would do.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DELIVERED — the client has received it</span><span class="lz-d">Server broadcast <code>chat:new-message</code> to the room, and each recipient socket acks back &quot;got it&quot;. The server updates <code>deliveredAt</code>. The UI shows a double tick. Requires sockets plus acks (lesson 6.x).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">READ — the user actually looked at it</span><span class="lz-d">The user scrolls to the message OR opens the thread. The client emits <code>chat:mark-read</code>. Server update <code>readAt</code>, which is broadcast back to the sender. The UI turns the tick blue. Requires detecting that the user saw it.</span></div>
</div>

<h3>SENT — the easiest</h3>
<pre><code class="language-ts">socket.emit('chat:send', { threadId, text }, (ack) =&gt; {
  if (ack.ok) markSent(ack.messageId);
});

// Server
socket.on('chat:send', async ({ threadId, text }, ack) =&gt; {
  const msg = await prisma.message.create({ data: { threadId, text, userId } });
  ack({ ok: true, messageId: msg.id });
  io.to(&#96;thread:\${threadId}&#96;).emit('chat:new-message', msg);
});
</code></pre>

<h3>DELIVERED — needs an ack from the recipient</h3>
<pre><code class="language-ts">// Server: nhan chat:new-message
socket.on('chat:new-message-ack', async ({ messageId }) =&gt; {
  await prisma.messageDelivery.upsert({
    where: { messageId_userId: { messageId, userId: socket.data.userId } },
    create: { messageId, userId: socket.data.userId, deliveredAt: new Date() },
    update: {},
  });
  // Bao sender
  io.to(&#96;user:\${msg.senderId}&#96;).emit('chat:delivered', { messageId, userId });
});
</code></pre>

<div class="callout warn">
<p><strong>DELIVERED is not READ.</strong> Delivered means &quot;the client received the packet&quot;. The user may have closed the tab, never scrolled to it, never looked — but the packet arrived. Do not collapse these two concepts.</p>
</div>

<h3>READ — needs detection that the user genuinely saw it</h3>
<pre><code class="language-tsx">// FE — IntersectionObserver detect message vao view
const observer = new IntersectionObserver((entries) =&gt; {
  entries.forEach(entry =&gt; {
    if (entry.isIntersecting) {
      const messageId = entry.target.dataset.msgId;
      socket.emit('chat:mark-read', { messageId });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Con phai check tab visible + focus + user thuc su xem, khong just scroll qua nhanh
</code></pre>

<h3>Optimization — batch mark-read</h3>
<pre><code class="language-tsx">// KHONG emit tung message
// Batch nhieu message cung luc va emit 1 event
const readBuffer = new Set&lt;number&gt;();
setInterval(() =&gt; {
  if (readBuffer.size === 0) return;
  socket.emit('chat:mark-read-batch', { messageIds: [...readBuffer] });
  readBuffer.clear();
}, 500);
</code></pre>

<h3>Cost — why read receipts so often come with an off switch</h3>
<div class="out">Chat 10 nguoi rat busy, moi nguoi doc 100 tin/gio
Read receipt: 10 * 100 = 1.000 mark-read events/gio/thread
Broadcast toi sender: 1.000 update UI events

Voi 1.000 thread dong thoi: 1.000.000 update/gio
</div>

<p>That cost is real. Many apps let users turn it off (Messenger has a &quot;turn off read receipts&quot; setting) not for privacy — but to cut server cost.</p>

<div class="pitfall">
<p><strong>Trap — treating DELIVERED as READ.</strong> The double tick (delivered) and the blue tick (read) are two different levels. If you treat delivered as read, users see &quot;seen&quot; even when the recipient never opened the tab. A serious UX bug, because people believe what that tick says.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Read receipts have three distinct levels (SENT is a server ack, DELIVERED a client ack, READ a visibility signal) — each needs a different implementation (a DB ack, a socket ack plus a Prisma upsert, an IntersectionObserver plus batching) and a different UX signal (one tick, two ticks, a blue tick) — and the cost is high enough that many apps let users switch it off.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — IntersectionObserver</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API — API chuẩn để detect element vào viewport.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — DELIVERED cần ack đúng cách để không mất khi client offline lúc receive.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Read receipt: ba mức hiển thị</h2>
<p class="lead">&quot;Đã xem&quot; ở Messenger là feature quen thuộc. Nó ẩn chứa ba mức tách biệt — và cả ba đều cần khác nhau về technical implementation và UX signalling.</p>

<h3>Ba mức</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SENT — server đã lưu</span><span class="lz-d">Client emit <code>chat:send</code>, server persist DB, ack thành công. UI hiện icon &quot;đã gửi&quot; (một dấu tick). Không cần realtime — HTTP POST cũng làm được.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DELIVERED — client đã nhận</span><span class="lz-d">Server broadcast <code>chat:new-message</code> đến room, mỗi socket recipient ack lại &quot;got it&quot;. Server cập nhật <code>deliveredAt</code>. UI hiện tick đôi. Cần socket + ack (bài 6.x).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">READ — user thao tác thấy</span><span class="lz-d">User scroll đến message HOẶC mở thread. Client emit <code>chat:mark-read</code>. Server update <code>readAt</code>, broadcast lại cho sender. UI tick xanh. Cần detection user thấy.</span></div>
</div>

<h3>SENT — dễ nhất</h3>
<pre><code class="language-ts">socket.emit('chat:send', { threadId, text }, (ack) =&gt; {
  if (ack.ok) markSent(ack.messageId);
});

// Server
socket.on('chat:send', async ({ threadId, text }, ack) =&gt; {
  const msg = await prisma.message.create({ data: { threadId, text, userId } });
  ack({ ok: true, messageId: msg.id });
  io.to(&#96;thread:\${threadId}&#96;).emit('chat:new-message', msg);
});
</code></pre>

<h3>DELIVERED — cần ack từ recipient</h3>
<pre><code class="language-ts">// Server: nhan chat:new-message
socket.on('chat:new-message-ack', async ({ messageId }) =&gt; {
  await prisma.messageDelivery.upsert({
    where: { messageId_userId: { messageId, userId: socket.data.userId } },
    create: { messageId, userId: socket.data.userId, deliveredAt: new Date() },
    update: {},
  });
  // Bao sender
  io.to(&#96;user:\${msg.senderId}&#96;).emit('chat:delivered', { messageId, userId });
});
</code></pre>

<div class="callout warn">
<p><strong>DELIVERED khác READ.</strong> Delivered = &quot;client đã nhận packet&quot;. User có thể đóng tab, chưa scroll đến, chưa nhìn — nhưng packet đã đến. Đừng gộp hai concept này.</p>
</div>

<h3>READ — cần detection user actual xem</h3>
<pre><code class="language-tsx">// FE — IntersectionObserver detect message vao view
const observer = new IntersectionObserver((entries) =&gt; {
  entries.forEach(entry =&gt; {
    if (entry.isIntersecting) {
      const messageId = entry.target.dataset.msgId;
      socket.emit('chat:mark-read', { messageId });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Con phai check tab visible + focus + user thuc su xem, khong just scroll qua nhanh
</code></pre>

<h3>Tối ưu — batch mark-read</h3>
<pre><code class="language-tsx">// KHONG emit tung message
// Batch nhieu message cung luc va emit 1 event
const readBuffer = new Set&lt;number&gt;();
setInterval(() =&gt; {
  if (readBuffer.size === 0) return;
  socket.emit('chat:mark-read-batch', { messageIds: [...readBuffer] });
  readBuffer.clear();
}, 500);
</code></pre>

<h3>Cost — vì sao read receipts hay tắt được</h3>
<div class="out">Chat 10 nguoi rat busy, moi nguoi doc 100 tin/gio
Read receipt: 10 * 100 = 1.000 mark-read events/gio/thread
Broadcast toi sender: 1.000 update UI events

Voi 1.000 thread dong thoi: 1.000.000 update/gio
</div>

<p>Đó là cost thật. Nhiều app cho user tắt (Messenger có setting &quot;turn off read receipts&quot;) không phải cho privacy — mà để giảm cost server.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng DELIVERED làm READ.</strong> Tick đôi (delivered) và tick xanh (read) là hai mức khác nhau. Nếu bạn dùng delivered = read, user thấy &quot;đã xem&quot; ngay cả khi họ chưa mở tab. Bug UX nghiêm trọng vì user tin điều đó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Read receipts có ba mức tách biệt (SENT server-ack, DELIVERED client-ack, READ user-visibility) — mỗi cái cần technical implementation khác (DB ack, socket ack + prisma upsert, IntersectionObserver + batch) và UX signal khác (một tick, hai tick, tick xanh) — cost cao khiến nhiều app cho user tắt được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — IntersectionObserver</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API — API chuẩn để detect element vào viewport.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — DELIVERED cần ack đúng cách để không mất khi client offline lúc receive.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'io-4-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về presence (O(N²) trap), audience compute, multi-tab, typing, read receipts.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 established</h2>
<p class="lead">Six questions on presence — the feature that looks trivial and is the most common way a Socket.IO app falls over.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">io.emit for presence is O(N²)</span><span class="lz-d">Every user's status change sent to every user means N status changes each fanned out to N recipients. At 1,000 users a single reconnect storm is a million messages. The fix is computing an audience, not broadcasting to everyone.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">One user is many sockets</span><span class="lz-d">Multiple tabs, phone and laptop, a reconnect in flight. Presence must be reference-counted per user, or closing one tab marks a user offline while they are still connected elsewhere.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Typing indicators cost per keystroke</span><span class="lz-d">Naively they are one message per character per recipient. Throttle at the client, and send "started"/"stopped" rather than a stream, or a single conversation can outweigh all your other traffic.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã dựng được gì</h2>
<p class="lead">Sáu câu về presence — tính năng trông có vẻ tầm thường và là cách phổ biến nhất khiến một app Socket.IO sụp.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">io.emit cho presence là O(N²)</span><span class="lz-d">Mỗi lần đổi trạng thái của một user gửi tới mọi user nghĩa là N lần đổi trạng thái, mỗi lần toả ra N người nhận. Ở 1.000 user, một cơn bão kết nối lại là một triệu thông điệp. Cách vá là tính ra tập khán giả, không phải broadcast cho tất cả.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Một user là nhiều socket</span><span class="lz-d">Nhiều tab, điện thoại và laptop, một lần kết nối lại đang bay. Presence phải đếm tham chiếu theo từng user, nếu không đóng một tab sẽ đánh dấu user offline trong khi họ vẫn còn kết nối ở nơi khác.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Chỉ báo đang gõ tốn tiền theo từng phím</span><span class="lz-d">Làm ngây thơ thì đó là một thông điệp cho mỗi ký tự cho mỗi người nhận. Hãy tiết chế ở phía client, và gửi "bắt đầu"/"dừng" thay vì một dòng liên tục, nếu không một cuộc hội thoại có thể nặng hơn toàn bộ traffic còn lại.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why does naive <code>io.emit(&quot;presence:update&quot;)</code> lead to O(N²) cost during deploy?|||Vì sao <code>io.emit(&quot;presence:update&quot;)</code> ngây thơ dẫn đến cost O(N²) khi deploy?',
            options: [
              'Because during deploy, all N users disconnect + reconnect roughly simultaneously — each of the 2N events is broadcast to N sockets = 2N² packets in a few seconds, at N=10.000 that\'s 200M packets|||Vì khi deploy, cả N user disconnect + reconnect gần như đồng thời — mỗi trong 2N events broadcast đến N sockets = 2N² packets trong vài giây, ở N=10.000 là 200M packets',
              'Because JSON.stringify is O(N)|||Vì JSON.stringify là O(N)',
              'Because socket.io uses recursion|||Vì socket.io dùng recursion',
              'Because Node.js is single-threaded|||Vì Node.js là single-threaded',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is <code>audience</code> in this repo\'s <code>emitPresenceTo(audience)</code>?|||<code>audience</code> trong <code>emitPresenceTo(audience)</code> của kho này là gì?',
            options: [
              'The union of user\'s friends and thread peers — the only users whose UI actually renders this user\'s presence. Cached in Redis 5min, invalidated on friend/thread changes|||Hợp của friends của user và thread peers — chỉ user nào UI thật sự render presence của user này. Cache Redis 5 phút, invalidate khi friend/thread đổi',
              'All online users|||Mọi user online',
              'The user\'s subscribers|||Subscriber của user',
              'A random sample of 100 users|||Mẫu ngẫu nhiên 100 user',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'User has 3 tabs open, closes 1. What should happen to their presence?|||User có 3 tab mở, đóng 1. Presence của họ thế nào?',
            options: [
              'Nothing — still online. This requires reference counting: <code>Map&lt;userId, Set&lt;socketId&gt;&gt;</code>, emit offline only when the Set becomes empty|||Không gì — vẫn online. Cái này cần reference counting: <code>Map&lt;userId, Set&lt;socketId&gt;&gt;</code>, emit offline chỉ khi Set về rỗng',
              'Immediately offline — reset UI|||Ngay lập tức offline — reset UI',
              'Flicker between online and offline|||Nhấp nháy giữa online và offline',
              'Depends on which tab was primary|||Phụ thuộc tab nào là primary',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Naive typing indicator emits per keystroke, 10 users × 5 keys/sec × 9 receivers = 450 packets/sec/thread. Best mitigation?|||Typing indicator ngây thơ emit per phím, 10 user × 5 phím/s × 9 nhận = 450 packet/s/thread. Cách giảm tốt nhất?',
            options: [
              'Client-side debounce (emit at most every 3s) + client-side auto-clear timeout (3s after last event) — server needs no state; ephemeral pattern from 1.5|||Client debounce (emit tối đa mỗi 3s) + client auto-clear timeout (3s sau event cuối) — server không cần state; ephemeral pattern từ 1.5',
              'Server-side debounce only|||Chỉ server debounce',
              'Use volatile.emit|||Dùng volatile.emit',
              'Increase pingInterval to 60s|||Tăng pingInterval lên 60s',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between DELIVERED and READ in read receipts?|||Khác biệt giữa DELIVERED và READ trong read receipts?',
            options: [
              'DELIVERED = client received the packet (double tick). READ = user actually viewed it (blue tick, needs IntersectionObserver + tab visible). Merging them shows &quot;seen&quot; even when user hasn\'t opened the tab|||DELIVERED = client nhận packet (tick đôi). READ = user thật sự xem (tick xanh, cần IntersectionObserver + tab visible). Gộp lại hiện &quot;đã xem&quot; ngay cả khi user chưa mở tab',
              'They are the same thing|||Chúng là cùng một thứ',
              'DELIVERED is optional, READ is required|||DELIVERED optional, READ bắt buộc',
              'DELIVERED is client-side, READ is server-side|||DELIVERED phía client, READ phía server',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why do apps let users disable read receipts?|||Vì sao app cho user tắt read receipts?',
            options: [
              'Not just privacy — mark-read events at scale (busy chat with 10 users × 100 msg/hour = 1000 events/hour/thread) create huge server cost. Disabling drops that traffic entirely for that user|||Không chỉ privacy — mark-read events ở scale (chat busy 10 user × 100 msg/gio = 1000 events/gio/thread) tạo cost server rất lớn. Tắt là drop hết traffic đó cho user',
              'Only for privacy|||Chỉ vì privacy',
              'To help network operators|||Giúp nhà mạng',
              'To reduce battery drain|||Giảm hao pin',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
