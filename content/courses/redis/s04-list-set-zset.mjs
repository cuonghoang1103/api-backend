/**
 * Redis — Chương 4: List, Set và Sorted Set.
 * List & hàng đợi · set & đại số tập hợp · sorted set · sorted set trong thực tế · chọn cấu trúc · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 4 — Lists, Sets and Sorted Sets|||Chương 4 — List, Set và Sorted Set',
  description: 'Ba cấu trúc tập hợp làm nên phần lớn giá trị thật của Redis: một hàng đợi có bên tiêu thụ chờ được, một tập hợp trả lời câu "có trong đó không" trong O(1), và một sorted set biến bảng xếp hạng, cửa sổ trượt, hàng đợi ưu tiên và việc hẹn giờ thành cùng MỘT cấu trúc.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Lists: queues and capped feeds|||4.1 — List: hàng đợi và dòng có trần',
      slug: 'rd-4-1-list',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đẩy và lấy từ hai đầu, độ phức tạp thật của LINSERT với LREM, BLPOP chặn kết nối chứ không chặn máy chủ, LMOVE cho hàng đợi tin cậy, LTRIM giữ dòng có trần, và vì sao đừng dùng list làm hàng đợi việc thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Lists: queues and capped feeds</h2>
<p class="lead">A Redis list is a doubly-linked structure with O(1) access at both ends and O(N) everywhere else. That single fact tells you what it is for — queues, stacks and recent-items feeds — and what it is not for: anything that needs to look at, or remove from, the middle.</p>

<h3>Both ends are cheap; the middle is not</h3>
<pre><code>redis-cli RPUSH q a b c
redis-cli LPUSH q z
redis-cli LRANGE q 0 -1
redis-cli LPOP q; redis-cli RPOP q
redis-cli LLEN q
redis-cli LINDEX q 0
redis-cli LPOP q 2          <span class="tok-comment"># 6.2+: pop several at once</span></code></pre>
<div class="out">(integer) 3
(integer) 4
1) "z"
2) "a"
3) "b"
4) "c"
"z"
"c"
(integer) 2
"a"
1) "a"
2) "b"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">O(1): <code>LPUSH</code> <code>RPUSH</code> <code>LPOP</code> <code>RPOP</code> <code>LLEN</code></span><span class="v">The only operations you should build on. A list with ten million elements pops just as fast as one with ten.</span></div>
  <div class="kv"><span class="k">O(N): <code>LINDEX</code> <code>LSET</code> <code>LINSERT</code> <code>LREM</code></span><span class="v">These walk from the nearest end. <code>LINDEX q 0</code> is instant; <code>LINDEX q 500000</code> walks half a million nodes while every other client waits.</span></div>
  <div class="kv"><span class="k"><code>LRANGE</code> is O(S+N)</span><span class="v">Offset plus count. <code>LRANGE q 0 9</code> is cheap at any list size; <code>LRANGE q 0 -1</code> on a large list is the classic accidental stall (Lesson 1.1).</span></div>
  <div class="kv"><span class="k">No random access, ever</span><span class="v">There is no index. If you need "element number 40,000", a list is the wrong structure — that is what a sorted set does in O(log N).</span></div>
  <div class="kv"><span class="k">Encoding: <code>listpack</code> then <code>quicklist</code></span><span class="v">Small lists are one flat allocation; past <code>list-max-listpack-size</code> (128) they become a linked list of listpacks. Both are O(1) at the ends.</span></div>
</div>
<pre><code>redis-cli DEL big &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'RPUSH big item:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli OBJECT ENCODING big
time redis-cli LPOP big &gt;/dev/null
time redis-cli LINDEX big 500000 &gt;/dev/null</code></pre>
<div class="out">"quicklist"
real	0m0.004s
real	0m0.031s</div>

<h3>Blocking pops: the connection waits, the server does not</h3>
<pre><code><span class="tok-comment"># Terminal 1 — blocks until something arrives, or 30 seconds pass</span>
redis-cli BLPOP queue:emails 30

<span class="tok-comment"># Terminal 2</span>
redis-cli RPUSH queue:emails "welcome:1042"</code></pre>
<div class="out">1) "queue:emails"
2) "welcome:1042"
(integer) 1</div>
<div class="callout ok"><strong>The <em>connection</em> is parked; the server keeps serving everyone else at full speed.</strong> Redis registers the client against that key and moves on — no polling, no timer, no CPU. When a <code>RPUSH</code> arrives, the blocked client is woken and served before the pushing client gets its reply. That is why <code>BLPOP</code> is not the "busy wait" it looks like, and it is also why each blocking consumer needs its own connection (Lesson 1.5): that one socket is unavailable until the pop returns.</div>
<pre><code>redis-cli BLPOP q1 q2 q3 5      <span class="tok-comment"># first non-empty key wins, in order</span>
redis-cli BLPOP q 0             <span class="tok-comment"># 0 = wait forever</span>
redis-cli BLMPOP 5 2 q1 q2 LEFT COUNT 10   <span class="tok-comment"># 7.0+: many keys, many elements</span>
redis-cli INFO clients | grep blocked</code></pre>
<div class="out">(nil)
blocked_clients:3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Timeout <code>0</code> means forever</span><span class="v">Reasonable for a dedicated worker, and a trap behind a proxy or a load balancer that kills idle connections. Prefer a finite timeout and a loop.</span></div>
  <div class="kv"><span class="k">Several keys, priority order</span><span class="v"><code>BLPOP high normal low 5</code> drains <code>high</code> completely before it ever looks at <code>normal</code>. A two-line priority queue — and a starvation risk if <code>high</code> is never empty.</span></div>
  <div class="kv"><span class="k">Wake order is FIFO</span><span class="v">The client that blocked first is served first. Fair, and worth knowing when you have twenty workers on one queue.</span></div>
  <div class="kv"><span class="k"><code>blocked_clients</code> in INFO</span><span class="v">Your worker count, visible. If it is zero when it should be twenty, your consumers are dead — a genuinely useful alert (Chapter 12).</span></div>
  <div class="kv"><span class="k">It does not work inside MULTI</span><span class="v">In a transaction the blocking variants behave like their non-blocking counterparts and return nil immediately. There is nothing to block on when the whole block runs atomically (Chapter 7).</span></div>
</div>

<h3>LMOVE: the reliable-queue pattern</h3>
<pre><code><span class="tok-comment"># Atomically move one item from the queue to a per-worker processing list</span>
redis-cli RPUSH queue:jobs job:1 job:2 job:3
redis-cli LMOVE queue:jobs processing:w1 LEFT RIGHT
redis-cli LRANGE queue:jobs 0 -1
redis-cli LRANGE processing:w1 0 -1
<span class="tok-comment"># …after the job succeeds, remove it from processing</span>
redis-cli LREM processing:w1 1 job:1</code></pre>
<div class="out">(integer) 3
"job:1"
1) "job:2"
2) "job:3"
1) "job:1"
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Why not just LPOP</span><span class="lz-t">a worker that dies after the pop loses the job</span><span class="lz-d">The item is gone from Redis and never finished. With <code>LMOVE</code> it sits in <code>processing:w1</code>, visible, and a sweeper can requeue anything that has been there too long.</span></div>
  <div class="lz-step"><span class="lz-k">One processing list per worker</span><span class="lz-t">processing:\${workerId}</span><span class="lz-d">So a sweeper can tell whose jobs are stuck. A shared processing list works too, but you lose the ability to attribute a stall.</span></div>
  <div class="lz-step"><span class="lz-k">BLMOVE for the blocking version</span><span class="lz-t">BLMOVE queue:jobs processing:w1 LEFT RIGHT 5</span><span class="lz-d">The same atomicity with a wait. This is the shape of every list-based worker loop worth writing.</span></div>
  <div class="lz-step"><span class="lz-k">You still need a sweeper</span><span class="lz-t">and a heartbeat, and a retry count</span><span class="lz-d">Which is the moment to notice you are rebuilding a job queue. Streams do this natively with consumer groups and <code>XAUTOCLAIM</code> (Chapter 8), and BullMQ does it on top of Redis for you.</span></div>
</div>

<h3>LTRIM: a feed that cannot grow</h3>
<pre><code><span class="tok-comment"># Keep only the 100 most recent items, on every write</span>
redis-cli LPUSH feed:1042 "post:9001"
redis-cli LTRIM feed:1042 0 99
redis-cli LLEN feed:1042
redis-cli LRANGE feed:1042 0 4</code></pre>
<div class="out">(integer) 101
OK
(integer) 100
1) "post:9001"
2) "post:8998"
3) "post:8997"
4) "post:8994"
5) "post:8990"</div>
<div class="callout"><strong><code>LPUSH</code> + <code>LTRIM</code> in a pipeline is the canonical capped feed.</strong> The list can never exceed 100 entries, so memory is bounded per user no matter how active they are, and reading page one is <code>LRANGE key 0 19</code> — O(20), independent of history. <code>LTRIM</code> itself is O(N) in the number of <em>removed</em> elements, so trimming to 100 on every push removes at most one element and costs nothing. Trimming a 10-million list down to 100 once, on the other hand, blocks.</div>

<h3>What lists are not for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Checking membership</span><span class="v">There is no <code>LCONTAINS</code>, and scanning with <code>LRANGE</code> is O(N) plus network. A set answers this in O(1) (Lesson 4.2).</span></div>
  <div class="kv"><span class="k">❌ Removing a specific item</span><span class="v"><code>LREM</code> walks the list. Fine on the tens; a stall on the millions. If you delete by identity, you want a set or a sorted set.</span></div>
  <div class="kv"><span class="k">❌ Ordering by anything but insertion</span><span class="v">A list is ordered by when things arrived, full stop. "Most recent" works; "highest score" does not.</span></div>
  <div class="kv"><span class="k">❌ A real job queue</span><span class="v">No acknowledgement, no retry, no visibility, no dead-letter. You can build those on <code>LMOVE</code> — or use Streams, which have them (Chapter 8).</span></div>
  <div class="kv"><span class="k">✅ Queues, stacks, capped recent-items feeds</span><span class="v">Push one end, pop the other, trim to a bound. Within that shape a list is unbeatable and costs almost nothing.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/lists/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis lists</span><span class="lc-sub">Every command with its complexity, and the official capped-feed and reliable-queue patterns written out. The complexity column is the part to read carefully.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/blmove/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">BLMOVE and the reliable queue</span><span class="lc-sub">The atomic move, why it replaces the deprecated <code>RPOPLPUSH</code>, and the worked pattern including the sweeper for abandoned items.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a queue and a feed</span><span class="lc-sub">Graded exercises: write a worker loop with <code>BLMOVE</code> and a sweeper, build a capped feed with <code>LPUSH</code> + <code>LTRIM</code>, and classify eight list commands by complexity.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> paginating a list with <code>LRANGE key offset offset+19</code>. Page one is instant, page five hundred is not — <code>LRANGE</code> is O(S+N) where S is the start offset, so it walks ten thousand nodes to reach the window and every other client waits while it does. The failure is invisible in development, where nobody scrolls past page three, and appears as unexplained latency spikes correlated with nothing obvious in production. Two fixes, depending on the shape: cap the list with <code>LTRIM</code> so deep pages cannot exist (which is honest — nobody reads page 500 of a feed), or use a sorted set scored by timestamp and paginate with <code>ZRANGEBYSCORE … LIMIT</code>, which is O(log N + count) regardless of depth. The same warning applies to <code>LINDEX</code> with a large index and to <code>LREM</code> on a long list: any list command that is not touching an end is walking the list.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Lists are O(1) at both ends and O(N) everywhere else — build on <code>LPUSH</code>/<code>RPUSH</code>/<code>LPOP</code>/<code>RPOP</code> and treat <code>LINDEX</code>, <code>LREM</code> and deep <code>LRANGE</code> as latency risks. <code>BLPOP</code> parks the <em>connection</em> without costing the server anything, so give every blocking consumer its own connection. And <code>LPUSH</code> + <code>LTRIM</code> gives you a feed with bounded memory and O(1) reads of page one — while a real job queue needs acknowledgements and retries that lists do not have.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>List: hàng đợi và dòng có trần</h2>
<p class="lead">List trong Redis là một cấu trúc liên kết hai chiều, O(1) ở cả hai đầu và O(N) ở mọi chỗ còn lại. Chỉ một sự thật đó đã nói cho bạn biết nó dùng để làm gì — hàng đợi, ngăn xếp, dòng "mới nhất" — và không dùng để làm gì: bất cứ việc gì phải nhìn vào, hay lấy ra từ, khúc giữa.</p>

<h3>Hai đầu thì rẻ, khúc giữa thì không</h3>
<pre><code>redis-cli RPUSH q a b c
redis-cli LPUSH q z
redis-cli LRANGE q 0 -1
redis-cli LPOP q; redis-cli RPOP q
redis-cli LLEN q
redis-cli LINDEX q 0
redis-cli LPOP q 2          <span class="tok-comment"># 6.2+: lấy ra nhiều phần tử một lượt</span></code></pre>
<div class="out">(integer) 3
(integer) 4
1) "z"
2) "a"
3) "b"
4) "c"
"z"
"c"
(integer) 2
"a"
1) "a"
2) "b"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">O(1): <code>LPUSH</code> <code>RPUSH</code> <code>LPOP</code> <code>RPOP</code> <code>LLEN</code></span><span class="v">Đây là những phép duy nhất nên xây lên. Một list mười triệu phần tử lấy ra nhanh y hệt list mười phần tử.</span></div>
  <div class="kv"><span class="k">O(N): <code>LINDEX</code> <code>LSET</code> <code>LINSERT</code> <code>LREM</code></span><span class="v">Chúng đi bộ từ đầu gần nhất. <code>LINDEX q 0</code> tức thì; <code>LINDEX q 500000</code> đi qua nửa triệu nút trong khi mọi khách khác nằm chờ.</span></div>
  <div class="kv"><span class="k"><code>LRANGE</code> là O(S+N)</span><span class="v">Vị trí bắt đầu cộng số phần tử. <code>LRANGE q 0 9</code> rẻ ở mọi kích thước; <code>LRANGE q 0 -1</code> trên list lớn là cú treo vô tình kinh điển (Bài 1.1).</span></div>
  <div class="kv"><span class="k">Không bao giờ có truy cập ngẫu nhiên</span><span class="v">Không có chỉ mục. Cần "phần tử thứ 40.000" thì list là cấu trúc sai — đó là việc của sorted set, O(log N).</span></div>
  <div class="kv"><span class="k">Mã hoá: <code>listpack</code> rồi <code>quicklist</code></span><span class="v">List nhỏ là một khối cấp phát phẳng; vượt <code>list-max-listpack-size</code> (128) nó thành danh sách liên kết của các listpack. Cả hai đều O(1) ở hai đầu.</span></div>
</div>
<pre><code>redis-cli DEL big &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'RPUSH big item:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli OBJECT ENCODING big
time redis-cli LPOP big &gt;/dev/null
time redis-cli LINDEX big 500000 &gt;/dev/null</code></pre>
<div class="out">"quicklist"
real	0m0.004s
real	0m0.031s</div>

<h3>Lấy ra kiểu chặn: kết nối chờ, máy chủ thì không</h3>
<pre><code><span class="tok-comment"># Cửa sổ 1 — chặn cho tới khi có gì đó tới, hoặc hết 30 giây</span>
redis-cli BLPOP queue:emails 30

<span class="tok-comment"># Cửa sổ 2</span>
redis-cli RPUSH queue:emails "welcome:1042"</code></pre>
<div class="out">1) "queue:emails"
2) "welcome:1042"
(integer) 1</div>
<div class="callout ok"><strong>Cái bị đỗ lại là <em>kết nối</em>; máy chủ vẫn phục vụ mọi người khác với tốc độ đầy đủ.</strong> Redis ghi tên khách đó vào khoá rồi đi tiếp — không hỏi vòng, không hẹn giờ, không tốn CPU. Khi một <code>RPUSH</code> tới, khách đang chặn được đánh thức và phục vụ <em>trước</em> khi khách đẩy nhận được câu trả lời. Đó là lý do <code>BLPOP</code> không phải cái "chờ bận" như vẻ ngoài của nó, và cũng là lý do mỗi bên tiêu thụ chặn cần kết nối riêng (Bài 1.5): cái socket ấy không dùng được cho việc gì khác cho tới lúc lấy ra xong.</div>
<pre><code>redis-cli BLPOP q1 q2 q3 5      <span class="tok-comment"># khoá không rỗng đầu tiên thắng, theo thứ tự</span>
redis-cli BLPOP q 0             <span class="tok-comment"># 0 = chờ mãi mãi</span>
redis-cli BLMPOP 5 2 q1 q2 LEFT COUNT 10   <span class="tok-comment"># 7.0+: nhiều khoá, nhiều phần tử</span>
redis-cli INFO clients | grep blocked</code></pre>
<div class="out">(nil)
blocked_clients:3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hạn chờ <code>0</code> nghĩa là mãi mãi</span><span class="v">Hợp lý cho một worker chuyên trách, và là cái bẫy khi phía sau có proxy hay bộ cân tải chuyên giết kết nối rảnh. Nên dùng hạn hữu hạn và một vòng lặp.</span></div>
  <div class="kv"><span class="k">Nhiều khoá, thứ tự ưu tiên</span><span class="v"><code>BLPOP high normal low 5</code> vét sạch <code>high</code> trước khi liếc tới <code>normal</code>. Một hàng đợi ưu tiên viết bằng hai dòng — và một rủi ro bỏ đói nếu <code>high</code> không bao giờ rỗng.</span></div>
  <div class="kv"><span class="k">Thứ tự đánh thức là FIFO</span><span class="v">Khách chặn trước được phục vụ trước. Công bằng, và đáng biết khi bạn có hai chục worker trên một hàng đợi.</span></div>
  <div class="kv"><span class="k"><code>blocked_clients</code> trong INFO</span><span class="v">Số worker của bạn, nhìn thấy được. Nếu nó bằng 0 trong khi đáng lẽ phải là 20 thì bên tiêu thụ đã chết — một cảnh báo thật sự có ích (Chương 12).</span></div>
  <div class="kv"><span class="k">Nó không chặn trong MULTI</span><span class="v">Trong giao dịch, các biến thể chặn cư xử y như bản không chặn và trả nil ngay. Không có gì để chặn khi cả khối chạy nguyên tử (Chương 7).</span></div>
</div>

<h3>LMOVE: khuôn hàng đợi tin cậy</h3>
<pre><code><span class="tok-comment"># Chuyển nguyên tử một việc từ hàng đợi sang list đang-xử-lý của riêng worker</span>
redis-cli RPUSH queue:jobs job:1 job:2 job:3
redis-cli LMOVE queue:jobs processing:w1 LEFT RIGHT
redis-cli LRANGE queue:jobs 0 -1
redis-cli LRANGE processing:w1 0 -1
<span class="tok-comment"># …sau khi việc chạy xong, gỡ nó khỏi processing</span>
redis-cli LREM processing:w1 1 job:1</code></pre>
<div class="out">(integer) 3
"job:1"
1) "job:2"
2) "job:3"
1) "job:1"
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vì sao không dùng LPOP</span><span class="lz-t">worker chết sau khi lấy ra là mất việc</span><span class="lz-d">Phần tử đã biến khỏi Redis và không bao giờ xong. Với <code>LMOVE</code> nó nằm trong <code>processing:w1</code>, nhìn thấy được, và một tiến trình quét có thể đẩy lại bất cứ việc nào nằm đó quá lâu.</span></div>
  <div class="lz-step"><span class="lz-k">Mỗi worker một list xử lý</span><span class="lz-t">processing:\${workerId}</span><span class="lz-d">Để tiến trình quét biết việc của ai đang kẹt. Dùng chung một list cũng chạy, nhưng bạn mất khả năng quy trách nhiệm cho một cú treo.</span></div>
  <div class="lz-step"><span class="lz-k">BLMOVE là bản chặn</span><span class="lz-t">BLMOVE queue:jobs processing:w1 LEFT RIGHT 5</span><span class="lz-d">Cùng tính nguyên tử, kèm chờ. Đây là hình dáng của mọi vòng lặp worker dựa trên list đáng viết.</span></div>
  <div class="lz-step"><span class="lz-k">Vẫn phải có tiến trình quét</span><span class="lz-t">và nhịp tim, và số lần thử lại</span><span class="lz-d">Tới đây là lúc nhận ra bạn đang dựng lại một hàng đợi việc. Stream làm sẵn chuyện này bằng consumer group và <code>XAUTOCLAIM</code> (Chương 8), còn BullMQ làm hộ bạn ngay trên Redis.</span></div>
</div>

<h3>LTRIM: một dòng không thể phình</h3>
<pre><code><span class="tok-comment"># Chỉ giữ 100 mục mới nhất, ở mỗi lần ghi</span>
redis-cli LPUSH feed:1042 "post:9001"
redis-cli LTRIM feed:1042 0 99
redis-cli LLEN feed:1042
redis-cli LRANGE feed:1042 0 4</code></pre>
<div class="out">(integer) 101
OK
(integer) 100
1) "post:9001"
2) "post:8998"
3) "post:8997"
4) "post:8994"
5) "post:8990"</div>
<div class="callout"><strong><code>LPUSH</code> + <code>LTRIM</code> trong một pipeline là khuôn dòng-có-trần chuẩn mực.</strong> List không bao giờ vượt 100 mục, nên bộ nhớ mỗi người dùng bị chặn trên bất kể họ hoạt động tới đâu, và đọc trang một là <code>LRANGE key 0 19</code> — O(20), độc lập với bề dày lịch sử. Bản thân <code>LTRIM</code> là O(N) theo số phần tử <em>bị xoá</em>, nên cắt về 100 ở mỗi lần đẩy chỉ xoá nhiều nhất một phần tử và gần như miễn phí. Ngược lại, cắt một list 10 triệu xuống 100 trong một lượt thì treo máy.</div>

<h3>List không dùng để làm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Kiểm tra có trong đó không</span><span class="v">Không có <code>LCONTAINS</code>, và quét bằng <code>LRANGE</code> là O(N) cộng thêm đường truyền. Set trả lời câu đó trong O(1) (Bài 4.2).</span></div>
  <div class="kv"><span class="k">❌ Gỡ một phần tử cụ thể</span><span class="v"><code>LREM</code> đi bộ qua list. Ổn ở cỡ vài chục; treo ở cỡ triệu. Nếu bạn xoá theo danh tính thì thứ bạn cần là set hoặc sorted set.</span></div>
  <div class="kv"><span class="k">❌ Sắp xếp theo bất cứ thứ gì ngoài thứ tự chèn</span><span class="v">List xếp theo lúc phần tử tới, hết. "Mới nhất" thì được; "điểm cao nhất" thì không.</span></div>
  <div class="kv"><span class="k">❌ Một hàng đợi việc thật</span><span class="v">Không xác nhận, không thử lại, không nhìn thấy trạng thái, không có thư chết. Bạn dựng được những thứ đó trên <code>LMOVE</code> — hoặc dùng Stream, vốn có sẵn (Chương 8).</span></div>
  <div class="kv"><span class="k">✅ Hàng đợi, ngăn xếp, dòng mới-nhất có trần</span><span class="v">Đẩy một đầu, lấy đầu kia, cắt về một mức trần. Trong đúng hình dáng đó thì list vô địch và gần như không tốn gì.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/lists/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis lists</span><span class="lc-sub">Mọi lệnh kèm độ phức tạp, và hai khuôn chính thức: dòng-có-trần với hàng-đợi-tin-cậy viết ra đầy đủ. Cột độ phức tạp mới là phần phải đọc kỹ.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/blmove/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">BLMOVE và hàng đợi tin cậy</span><span class="lc-sub">Phép chuyển nguyên tử, vì sao nó thay thế <code>RPOPLPUSH</code> đã bị bỏ, và khuôn mẫu chạy đủ kèm tiến trình quét các mục bị bỏ rơi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một hàng đợi và một dòng</span><span class="lc-sub">Bài chấm điểm: viết vòng lặp worker bằng <code>BLMOVE</code> kèm tiến trình quét, dựng dòng có trần bằng <code>LPUSH</code> + <code>LTRIM</code>, và phân loại tám lệnh list theo độ phức tạp.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy:</strong> phân trang một list bằng <code>LRANGE key offset offset+19</code>. Trang một tức thì, trang năm trăm thì không — <code>LRANGE</code> là O(S+N) với S là vị trí bắt đầu, nên nó đi bộ qua mười nghìn nút để tới cửa sổ cần lấy và mọi khách khác nằm chờ suốt lúc đó. Hỏng hóc này vô hình khi phát triển, nơi không ai cuộn quá trang ba, rồi hiện ra ở production dưới dạng những đợt trễ vọt lên không tương quan với bất cứ thứ gì rõ ràng. Hai cách chữa, tuỳ hình dáng bài toán: cắt list bằng <code>LTRIM</code> để trang sâu không thể tồn tại (cách này thành thật — không ai đọc trang 500 của một dòng tin), hoặc dùng sorted set chấm điểm theo mốc thời gian và phân trang bằng <code>ZRANGEBYSCORE … LIMIT</code>, vốn là O(log N + count) bất kể sâu tới đâu. Cảnh báo y hệt áp cho <code>LINDEX</code> với chỉ số lớn và cho <code>LREM</code> trên list dài: bất cứ lệnh list nào không chạm vào một đầu đều đang đi bộ qua list.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> List là O(1) ở hai đầu và O(N) ở mọi chỗ khác — hãy xây trên <code>LPUSH</code>/<code>RPUSH</code>/<code>LPOP</code>/<code>RPOP</code> và coi <code>LINDEX</code>, <code>LREM</code> cùng <code>LRANGE</code> sâu là rủi ro độ trễ. <code>BLPOP</code> đỗ <em>kết nối</em> lại mà không tốn gì của máy chủ, nên hãy cho mỗi bên tiêu thụ chặn một kết nối riêng. Và <code>LPUSH</code> + <code>LTRIM</code> cho bạn một dòng tin có bộ nhớ bị chặn trên và đọc trang một trong O(1) — trong khi một hàng đợi việc thật cần xác nhận và thử lại, thứ mà list không có.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Sets: membership and set algebra|||4.2 — Set: kiểm tra thành viên và đại số tập hợp',
      slug: 'rd-4-2-set',
      type: 'LESSON',
      description: 'SISMEMBER trong O(1), ba kiểu mã hoá của set và cái giá bộ nhớ khác nhau 10 lần, SMEMBERS là cái bẫy còn SSCAN là lối ra, SINTER/SUNION/SDIFF cùng độ phức tạp thật, SINTERCARD, và bốn bài toán thật mà set giải trong một lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Sets: membership and set algebra</h2>
<p class="lead">A set is an unordered collection of unique strings that answers one question in O(1): <em>is this in there?</em> That is worth a chapter on its own, because "is this user blocked", "has this ID been seen today", "does this role have this permission" and "do these two people follow each other" are all the same question — and a set answers all four without your application loading a single row.</p>

<h3>The five commands you will use every day</h3>
<pre><code>redis-cli SADD tags:post:9001 redis database cache backend
redis-cli SADD tags:post:9001 redis          <span class="tok-comment"># already there</span>
redis-cli SCARD tags:post:9001
redis-cli SISMEMBER tags:post:9001 cache
redis-cli SISMEMBER tags:post:9001 mongodb
redis-cli SMISMEMBER tags:post:9001 redis mongodb backend   <span class="tok-comment"># 6.2+</span>
redis-cli SREM tags:post:9001 backend
redis-cli SMEMBERS tags:post:9001</code></pre>
<div class="out">(integer) 4
(integer) 0
(integer) 4
(integer) 1
(integer) 0
1) (integer) 1
2) (integer) 0
3) (integer) 1
(integer) 1
1) "redis"
2) "database"
3) "cache"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SADD</code> returns how many were <em>new</em></span><span class="v">Not how many you sent. <code>SADD k a b a</code> returns 2. That return value is a free deduplication check: "was this the first time we saw this ID?" is one command, no read needed.</span></div>
  <div class="kv"><span class="k"><code>SISMEMBER</code> is O(1)</span><span class="v">A hash lookup. Ten members or ten million, the same nanoseconds. This is the whole reason sets exist.</span></div>
  <div class="kv"><span class="k"><code>SMISMEMBER</code> asks about many at once</span><span class="v">Redis 6.2+. One round trip instead of N — the same win as a pipeline (Lesson 1.4) but without the client-side bookkeeping.</span></div>
  <div class="kv"><span class="k">Order is not a thing</span><span class="v">The order you get back is an implementation detail of the encoding and it will change when the encoding changes. If you need order, you need a list or a sorted set.</span></div>
  <div class="kv"><span class="k">Members are strings, always</span><span class="v"><code>SADD s 1</code> and <code>SADD s "1"</code> are the same member. Numbers are stored as strings that <em>may</em> be encoded as integers internally — a memory optimisation, not a type.</span></div>
</div>

<h3>Three encodings, and a 10× memory difference</h3>
<pre><code>redis-cli DEL s1 s2 s3 &gt;/dev/null
redis-cli SADD s1 1 2 3 42 1000 &gt;/dev/null            <span class="tok-comment"># all integers, small</span>
redis-cli SADD s2 alice bob carol &gt;/dev/null          <span class="tok-comment"># strings, small</span>
for i in $(seq 1 600); do echo "SADD s3 user:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli OBJECT ENCODING s1
redis-cli OBJECT ENCODING s2
redis-cli OBJECT ENCODING s3
redis-cli MEMORY USAGE s1
redis-cli MEMORY USAGE s3</code></pre>
<div class="out">"intset"
"listpack"
"hashtable"
120
39320</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">intset</span><span class="lz-lnote">Every member is an integer and there are at most <code>set-max-intset-entries</code> (512). A sorted array of fixed-width integers — no pointers, no hash table, binary search for membership. Roughly <strong>8 bytes per member</strong>, which is as cheap as Redis gets. Adding one non-integer member converts the whole set.</span></div>
  <div class="lz-layer"><span class="lz-lname">listpack</span><span class="lz-lnote">Redis 7.2+. Small sets with non-integer members: one flat, contiguous allocation, scanned linearly. Bounded by <code>set-max-listpack-entries</code> (128) and <code>set-max-listpack-value</code> (64 bytes). Linear scan, but on 128 items inside one cache line-friendly block that is faster than chasing pointers.</span></div>
  <div class="lz-layer"><span class="lz-lname">hashtable</span><span class="lz-lnote">The general case: a real hash table with one <code>dictEntry</code> plus one <code>robj</code> per member. True O(1), and roughly <strong>60–90 bytes per member</strong> of overhead <em>before</em> your data. This is why 600 short members cost 39 KB while five integers cost 120 bytes.</span></div>
</div>
<div class="callout warn"><strong>The conversion is one-way and permanent.</strong> Push a set past its threshold and it becomes a hashtable; delete members back down to three and it <em>stays</em> a hashtable, because Redis never converts back. If you have a million sets that each briefly held 200 members, you are paying hashtable overhead on all of them forever. The fix is not tuning the thresholds up (that makes lookups linear on big sets) — it is <code>DEL</code> plus rebuild if a set genuinely shrank for good, or accepting the cost.</div>

<h3>SMEMBERS is the trap; SSCAN is the way out</h3>
<pre><code>redis-cli DEL huge &gt;/dev/null
python3 -c "
for i in range(2_000_000): print(f'SADD huge user:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli SCARD huge
time redis-cli SMEMBERS huge &gt;/dev/null
redis-cli --latency -i 2 &amp;                <span class="tok-comment"># watch what it does to everyone else</span>
redis-cli SSCAN huge 0 COUNT 100 | head -3</code></pre>
<div class="out">(integer) 2000000
real	0m1.847s
1) "1441792"
2) "user:1839203"
3) "user:774411"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SMEMBERS</code> is O(N) and it blocks</span><span class="v">1.8 seconds of a single-threaded server doing nothing else (Lesson 1.1). Every other client — every page load — waits. It is safe on sets you <em>know</em> are small and nowhere else.</span></div>
  <div class="kv"><span class="k"><code>SSCAN</code> returns a cursor</span><span class="v">Same contract as <code>SCAN</code> (Lesson 2.3): each call is O(1)-ish, the cursor is opaque, and you loop until it comes back <code>0</code>. Members present the whole time are returned at least once; members added or removed mid-scan may or may not appear.</span></div>
  <div class="kv"><span class="k">Usually you do not need the members at all</span><span class="v"><code>SISMEMBER</code>, <code>SCARD</code>, <code>SINTERCARD</code> and <code>SPOP</code> answer most real questions without transferring anything. "Give me all two million" is nearly always a design mistake upstream.</span></div>
  <div class="kv"><span class="k"><code>SSCAN</code> on a listpack/intset set ignores the cursor</span><span class="v">Small sets are returned in one shot with cursor <code>0</code>, because there is nothing to paginate. Your loop still works — that is the point of writing it as a loop.</span></div>
</div>

<h3>Random members: SRANDMEMBER vs SPOP</h3>
<pre><code>redis-cli SADD deck A K Q J 10 9 8 7
redis-cli SRANDMEMBER deck            <span class="tok-comment"># peek one, set unchanged</span>
redis-cli SRANDMEMBER deck 3          <span class="tok-comment"># 3 DISTINCT members</span>
redis-cli SRANDMEMBER deck -5         <span class="tok-comment"># 5 WITH repeats allowed</span>
redis-cli SPOP deck 2                 <span class="tok-comment"># remove and return</span>
redis-cli SCARD deck</code></pre>
<div class="out">(integer) 8
"Q"
1) "9"
2) "A"
3) "J"
1) "K"
2) "K"
3) "8"
4) "Q"
5) "K"
1) "10"
2) "7"
(integer) 6</div>
<div class="callout"><strong>The sign of the count changes the guarantee.</strong> A positive count gives you distinct members and returns fewer than you asked for if the set is smaller. A negative count samples <em>with</em> replacement — you can get the same member five times, and you can ask for more than the set contains. Positive is what you want for "show 3 random related posts"; negative is what you want for weighted sampling or load-testing. And <code>SPOP</code> is the destructive one: it is how you hand out a one-time code, a raffle ticket or a work item exactly once, because the removal and the read are the same atomic operation.</div>

<h3>Set algebra: the part your application should stop doing</h3>
<pre><code>redis-cli SADD follows:alice bob carol dave erin
redis-cli SADD follows:bob carol dave frank
redis-cli SINTER follows:alice follows:bob            <span class="tok-comment"># in common</span>
redis-cli SDIFF follows:alice follows:bob             <span class="tok-comment"># alice only</span>
redis-cli SUNION follows:alice follows:bob            <span class="tok-comment"># either</span>
redis-cli SINTERCARD 2 follows:alice follows:bob      <span class="tok-comment"># 7.0+: count only</span>
redis-cli SINTERCARD 2 follows:alice follows:bob LIMIT 1
redis-cli SINTERSTORE common follows:alice follows:bob</code></pre>
<div class="out">1) "carol"
2) "dave"
1) "bob"
2) "erin"
1) "bob"
2) "carol"
3) "dave"
4) "erin"
5) "frank"
(integer) 2
(integer) 1
(integer) 2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SINTER</span><span class="lz-t">O(N*M) worst case, but smarter in practice</span><span class="lz-d">Redis sorts the sets by cardinality and iterates the <em>smallest</em> one, testing each member against the others. So intersecting a 5-member set with a 5-million-member set costs about 5 lookups, not 5 million. Intersecting two 5-million sets costs 5 million.</span></div>
  <div class="lz-step"><span class="lz-k">SUNION and SDIFF</span><span class="lz-t">O(N) over the total number of members</span><span class="lz-d">No shortcut is possible — every member of every set has to be looked at. A union of two million-member sets is a million-plus-member reply built in memory before it is sent.</span></div>
  <div class="lz-step"><span class="lz-k">SINTERCARD with LIMIT</span><span class="lz-t">stops early once it has enough</span><span class="lz-d">Redis 7.0+. "Do these two users have at least one friend in common?" is <code>SINTERCARD 2 a b LIMIT 1</code> — it stops at the first hit instead of computing the whole intersection. For a yes/no question this is the difference between O(1) and O(N).</span></div>
  <div class="lz-step"><span class="lz-k">The …STORE variants write a new key</span><span class="lz-t">SINTERSTORE dest …</span><span class="lz-d">The result never crosses the network. Useful for building a materialised audience once and reading pages from it — and dangerous, because the destination key has <strong>no TTL</strong> and will sit in memory until something deletes it (Lesson 2.2).</span></div>
</div>
<div class="callout ok"><strong>This is the argument for putting the data in Redis at all.</strong> "Which of these 500 product IDs are in the user's wishlist" is, in SQL, either 500 round trips or one query with a 500-element <code>IN</code> clause that the planner may or may not handle well. In Redis it is <code>SMISMEMBER wishlist:1042 …</code> — one command, O(500) hash lookups, sub-millisecond, and the answer arrives in the order you asked. The set is not a cache of the database here; it is a purpose-built index that the database is bad at.</div>

<h3>Four real problems, one command each</h3>
<pre><code><span class="tok-comment"># 1. Unique visitors today (exact, and expensive at scale — see 3.4 for HLL)</span>
redis-cli SADD uv:2026-08-23 user:1042
redis-cli SCARD uv:2026-08-23

<span class="tok-comment"># 2. Idempotency: has this webhook already been processed?</span>
redis-cli SADD seen:webhooks evt_8f2a           <span class="tok-comment"># 1 = first time, process it</span>
redis-cli SADD seen:webhooks evt_8f2a           <span class="tok-comment"># 0 = duplicate, drop it</span>

<span class="tok-comment"># 3. Permissions: does this role have this capability?</span>
redis-cli SADD perms:role:editor post.write post.edit media.upload
redis-cli SISMEMBER perms:role:editor user.delete

<span class="tok-comment"># 4. Tag search: posts tagged BOTH redis AND docker</span>
redis-cli SADD tag:redis post:1 post:2 post:9
redis-cli SADD tag:docker post:2 post:9 post:11
redis-cli SINTER tag:redis tag:docker</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 0
(integer) 3
(integer) 0
(integer) 3
(integer) 3
1) "post:2"
2) "post:9"</div>
<div class="pitfall"><strong>Pitfall:</strong> the unbounded set. Every one of the four patterns above grows forever unless you say otherwise. <code>uv:2026-08-23</code> is fine because the date rolls and you <code>EXPIRE</code> it after 30 days; <code>seen:webhooks</code> is a disaster, because it is one key that accumulates every event ID your system has ever received — 50 million members, 4 GB, and no natural point at which anything removes them. The fix is to stop using one set: per-event keys with a TTL (<code>SET seen:evt_8f2a 1 NX EX 604800</code>) give you the same idempotency check with automatic cleanup, at the cost of more keys. Rule of thumb: a set is safe when it is bounded by something real (tags on a post, permissions in a role, members of a team) and dangerous when it is bounded only by time. Check yours with <code>redis-cli --bigkeys</code> (Chapter 12) before production does it for you.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sets/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis sets</span><span class="lc-sub">The full command list with complexities, plus the official write-ups of the tag-search and unique-visitor patterns. Read the complexity of <code>SINTER</code> and <code>SUNION</code> before you build on them.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/sintercard/" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">SINTERCARD and LIMIT</span><span class="lc-sub">The 7.0 command that turns "do they have anything in common?" from a full intersection into an early exit. Small command, large difference on hot paths.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: tags, permissions and idempotency</span><span class="lc-sub">Graded exercises: build tag search with <code>SINTER</code>, write an idempotency check that cannot grow without bound, and replace an <code>SMEMBERS</code> loop with <code>SSCAN</code>.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>SISMEMBER</code> is O(1) at any size and <code>SMEMBERS</code> is O(N) that blocks the whole server — the first is the reason to use a set, the second is the reason people get burned by one. Encoding decides memory: an <code>intset</code> costs ~8 bytes per member and a <code>hashtable</code> costs 60–90, the conversion happens silently at the threshold, and it never converts back. And set algebra belongs in Redis, not in your application — <code>SINTER</code> iterates the smallest set, <code>SINTERCARD … LIMIT 1</code> answers yes/no without computing the answer, and the <code>…STORE</code> variants keep large results off the wire at the price of a key with no TTL.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Set: kiểm tra thành viên và đại số tập hợp</h2>
<p class="lead">Set là một tập hợp không thứ tự gồm các chuỗi duy nhất, và nó trả lời đúng một câu hỏi trong O(1): <em>thứ này có ở trong đó không?</em> Chừng đó đủ để dành riêng một bài, vì "người dùng này có bị chặn không", "ID này hôm nay đã thấy chưa", "vai trò này có quyền này không" và "hai người này có theo dõi chung ai không" đều là cùng một câu hỏi — và set trả lời cả bốn mà ứng dụng của bạn không phải nạp lấy một dòng dữ liệu nào.</p>

<h3>Năm lệnh bạn sẽ dùng mỗi ngày</h3>
<pre><code>redis-cli SADD tags:post:9001 redis database cache backend
redis-cli SADD tags:post:9001 redis          <span class="tok-comment"># đã có sẵn</span>
redis-cli SCARD tags:post:9001
redis-cli SISMEMBER tags:post:9001 cache
redis-cli SISMEMBER tags:post:9001 mongodb
redis-cli SMISMEMBER tags:post:9001 redis mongodb backend   <span class="tok-comment"># 6.2+</span>
redis-cli SREM tags:post:9001 backend
redis-cli SMEMBERS tags:post:9001</code></pre>
<div class="out">(integer) 4
(integer) 0
(integer) 4
(integer) 1
(integer) 0
1) (integer) 1
2) (integer) 0
3) (integer) 1
(integer) 1
1) "redis"
2) "database"
3) "cache"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SADD</code> trả về số phần tử <em>mới</em></span><span class="v">Không phải số bạn gửi lên. <code>SADD k a b a</code> trả 2. Giá trị trả về đó là một phép khử trùng miễn phí: "đây có phải lần đầu ta thấy ID này không?" gói gọn trong một lệnh, không cần đọc trước.</span></div>
  <div class="kv"><span class="k"><code>SISMEMBER</code> là O(1)</span><span class="v">Một phép tra bảng băm. Mười phần tử hay mười triệu, cùng ngần ấy nano giây. Đây chính là toàn bộ lý do set tồn tại.</span></div>
  <div class="kv"><span class="k"><code>SMISMEMBER</code> hỏi nhiều thứ một lượt</span><span class="v">Redis 6.2+. Một vòng đi-về thay vì N — cùng cái lợi như pipeline (Bài 1.4) nhưng không phải tự ghi sổ ở phía khách.</span></div>
  <div class="kv"><span class="k">Thứ tự không tồn tại</span><span class="v">Thứ tự bạn nhận về là chi tiết cài đặt của kiểu mã hoá, và nó sẽ đổi khi kiểu mã hoá đổi. Cần thứ tự thì bạn cần list hoặc sorted set.</span></div>
  <div class="kv"><span class="k">Phần tử luôn luôn là chuỗi</span><span class="v"><code>SADD s 1</code> và <code>SADD s "1"</code> là cùng một phần tử. Số được lưu dạng chuỗi mà bên trong <em>có thể</em> được mã hoá thành số nguyên — một phép tiết kiệm bộ nhớ, không phải một kiểu dữ liệu.</span></div>
</div>

<h3>Ba kiểu mã hoá, và khoảng cách bộ nhớ 10 lần</h3>
<pre><code>redis-cli DEL s1 s2 s3 &gt;/dev/null
redis-cli SADD s1 1 2 3 42 1000 &gt;/dev/null            <span class="tok-comment"># toàn số nguyên, nhỏ</span>
redis-cli SADD s2 alice bob carol &gt;/dev/null          <span class="tok-comment"># chuỗi, nhỏ</span>
for i in $(seq 1 600); do echo "SADD s3 user:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli OBJECT ENCODING s1
redis-cli OBJECT ENCODING s2
redis-cli OBJECT ENCODING s3
redis-cli MEMORY USAGE s1
redis-cli MEMORY USAGE s3</code></pre>
<div class="out">"intset"
"listpack"
"hashtable"
120
39320</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">intset</span><span class="lz-lnote">Mọi phần tử đều là số nguyên và có nhiều nhất <code>set-max-intset-entries</code> (512). Một mảng số nguyên cùng bề rộng đã sắp xếp — không con trỏ, không bảng băm, tìm kiếm nhị phân để kiểm tra thành viên. Khoảng <strong>8 byte mỗi phần tử</strong>, rẻ nhất mà Redis có được. Thêm một phần tử không phải số nguyên là cả set bị chuyển kiểu.</span></div>
  <div class="lz-layer"><span class="lz-lname">listpack</span><span class="lz-lnote">Redis 7.2+. Set nhỏ có phần tử không phải số: một khối cấp phát phẳng, liền mạch, quét tuyến tính. Bị chặn bởi <code>set-max-listpack-entries</code> (128) và <code>set-max-listpack-value</code> (64 byte). Quét tuyến tính đấy, nhưng trên 128 mục nằm gọn trong một khối thân thiện với cache thì vẫn nhanh hơn đuổi theo con trỏ.</span></div>
  <div class="lz-layer"><span class="lz-lname">hashtable</span><span class="lz-lnote">Trường hợp tổng quát: một bảng băm thật, mỗi phần tử một <code>dictEntry</code> cộng một <code>robj</code>. O(1) thật sự, và tốn khoảng <strong>60–90 byte mỗi phần tử</strong> chi phí phụ <em>trước khi</em> tính dữ liệu của bạn. Đó là vì sao 600 phần tử ngắn tốn 39 KB trong khi năm số nguyên tốn 120 byte.</span></div>
</div>
<div class="callout warn"><strong>Việc chuyển kiểu là một chiều và vĩnh viễn.</strong> Đẩy một set vượt ngưỡng thì nó thành hashtable; xoá bớt phần tử xuống còn ba thì nó <em>vẫn</em> là hashtable, vì Redis không bao giờ chuyển ngược. Nếu bạn có một triệu set mà mỗi cái từng thoáng chứa 200 phần tử, bạn đang trả chi phí hashtable cho tất cả chúng mãi mãi. Cách chữa không phải nâng ngưỡng lên (làm vậy khiến tra cứu trên set lớn thành tuyến tính) — mà là <code>DEL</code> rồi dựng lại nếu set thật sự đã co lại lâu dài, hoặc chấp nhận cái giá.</div>

<h3>SMEMBERS là cái bẫy; SSCAN là lối ra</h3>
<pre><code>redis-cli DEL huge &gt;/dev/null
python3 -c "
for i in range(2_000_000): print(f'SADD huge user:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli SCARD huge
time redis-cli SMEMBERS huge &gt;/dev/null
redis-cli --latency -i 2 &amp;                <span class="tok-comment"># xem nó làm gì với mọi người khác</span>
redis-cli SSCAN huge 0 COUNT 100 | head -3</code></pre>
<div class="out">(integer) 2000000
real	0m1.847s
1) "1441792"
2) "user:1839203"
3) "user:774411"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SMEMBERS</code> là O(N) và nó chặn</span><span class="v">1,8 giây một máy chủ đơn luồng không làm gì khác (Bài 1.1). Mọi khách khác — mọi lượt tải trang — nằm chờ. Nó chỉ an toàn trên những set bạn <em>biết chắc</em> là nhỏ, và không an toàn ở đâu khác.</span></div>
  <div class="kv"><span class="k"><code>SSCAN</code> trả về con trỏ</span><span class="v">Cùng giao kèo với <code>SCAN</code> (Bài 2.3): mỗi lời gọi gần như O(1), con trỏ là thứ mờ đục, và bạn lặp cho tới khi nó trả về <code>0</code>. Phần tử có mặt suốt quá trình sẽ được trả về ít nhất một lần; phần tử thêm vào hay xoá đi giữa chừng thì có thể có, có thể không.</span></div>
  <div class="kv"><span class="k">Thường thì bạn chẳng cần các phần tử</span><span class="v"><code>SISMEMBER</code>, <code>SCARD</code>, <code>SINTERCARD</code> và <code>SPOP</code> trả lời hầu hết câu hỏi thật mà không chuyển đi thứ gì. "Cho tôi cả hai triệu" gần như luôn là một sai lầm thiết kế ở tầng trên.</span></div>
  <div class="kv"><span class="k"><code>SSCAN</code> trên set listpack/intset bỏ qua con trỏ</span><span class="v">Set nhỏ được trả về trọn một lượt kèm con trỏ <code>0</code>, vì chẳng có gì để phân trang. Vòng lặp của bạn vẫn chạy đúng — đó chính là lý do phải viết nó dạng vòng lặp.</span></div>
</div>

<h3>Lấy ngẫu nhiên: SRANDMEMBER với SPOP</h3>
<pre><code>redis-cli SADD deck A K Q J 10 9 8 7
redis-cli SRANDMEMBER deck            <span class="tok-comment"># nhìn một cái, set không đổi</span>
redis-cli SRANDMEMBER deck 3          <span class="tok-comment"># 3 phần tử KHÁC NHAU</span>
redis-cli SRANDMEMBER deck -5         <span class="tok-comment"># 5 phần tử, CHO PHÉP lặp lại</span>
redis-cli SPOP deck 2                 <span class="tok-comment"># lấy ra và xoá luôn</span>
redis-cli SCARD deck</code></pre>
<div class="out">(integer) 8
"Q"
1) "9"
2) "A"
3) "J"
1) "K"
2) "K"
3) "8"
4) "Q"
5) "K"
1) "10"
2) "7"
(integer) 6</div>
<div class="callout"><strong>Dấu của con số làm đổi luôn lời hứa.</strong> Số dương cho bạn các phần tử khác nhau và trả về ít hơn số bạn xin nếu set nhỏ hơn. Số âm là lấy mẫu <em>có hoàn lại</em> — bạn có thể nhận cùng một phần tử năm lần, và có thể xin nhiều hơn số phần tử set đang có. Số dương là thứ bạn muốn cho "hiện 3 bài liên quan ngẫu nhiên"; số âm là thứ bạn muốn khi lấy mẫu có trọng số hoặc thử tải. Còn <code>SPOP</code> là bản huỷ diệt: nó là cách bạn phát một mã dùng một lần, một vé xổ số hay một việc cần làm đúng một lần duy nhất, vì việc xoá và việc đọc là cùng một phép nguyên tử.</div>

<h3>Đại số tập hợp: phần mà ứng dụng của bạn nên thôi tự làm</h3>
<pre><code>redis-cli SADD follows:alice bob carol dave erin
redis-cli SADD follows:bob carol dave frank
redis-cli SINTER follows:alice follows:bob            <span class="tok-comment"># chung nhau</span>
redis-cli SDIFF follows:alice follows:bob             <span class="tok-comment"># chỉ alice có</span>
redis-cli SUNION follows:alice follows:bob            <span class="tok-comment"># một trong hai</span>
redis-cli SINTERCARD 2 follows:alice follows:bob      <span class="tok-comment"># 7.0+: chỉ đếm</span>
redis-cli SINTERCARD 2 follows:alice follows:bob LIMIT 1
redis-cli SINTERSTORE common follows:alice follows:bob</code></pre>
<div class="out">1) "carol"
2) "dave"
1) "bob"
2) "erin"
1) "bob"
2) "carol"
3) "dave"
4) "erin"
5) "frank"
(integer) 2
(integer) 1
(integer) 2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SINTER</span><span class="lz-t">O(N*M) ở trường hợp xấu nhất, nhưng thực tế khôn hơn</span><span class="lz-d">Redis sắp các set theo lực lượng rồi duyệt cái <em>nhỏ nhất</em>, thử từng phần tử với các set còn lại. Nên giao một set 5 phần tử với một set 5 triệu phần tử tốn khoảng 5 phép tra, không phải 5 triệu. Giao hai set 5 triệu thì tốn 5 triệu.</span></div>
  <div class="lz-step"><span class="lz-k">SUNION và SDIFF</span><span class="lz-t">O(N) trên tổng số phần tử</span><span class="lz-d">Không có đường tắt nào — mọi phần tử của mọi set đều phải được nhìn tới. Hợp hai set một triệu phần tử là một câu trả lời hơn một triệu phần tử được dựng trong bộ nhớ trước khi gửi đi.</span></div>
  <div class="lz-step"><span class="lz-k">SINTERCARD kèm LIMIT</span><span class="lz-t">dừng sớm ngay khi đủ</span><span class="lz-d">Redis 7.0+. "Hai người này có ít nhất một bạn chung không?" chính là <code>SINTERCARD 2 a b LIMIT 1</code> — nó dừng ở lần trúng đầu tiên thay vì tính cả phần giao. Với một câu hỏi có/không thì đây là khoảng cách giữa O(1) và O(N).</span></div>
  <div class="lz-step"><span class="lz-k">Biến thể …STORE ghi ra khoá mới</span><span class="lz-t">SINTERSTORE dest …</span><span class="lz-d">Kết quả không bao giờ đi qua mạng. Có ích khi dựng sẵn một tập khán giả rồi đọc từng trang từ đó — và cũng nguy hiểm, vì khoá đích <strong>không có TTL</strong> và sẽ nằm lì trong bộ nhớ cho tới khi có ai đó xoá nó (Bài 2.2).</span></div>
</div>
<div class="callout ok"><strong>Đây chính là lý lẽ cho việc đưa dữ liệu vào Redis ngay từ đầu.</strong> "Trong 500 mã sản phẩm này, cái nào nằm trong danh sách yêu thích của người dùng" — bằng SQL thì hoặc là 500 vòng đi-về, hoặc là một truy vấn với mệnh đề <code>IN</code> 500 phần tử mà bộ lập kế hoạch có thể xử lý tốt, cũng có thể không. Trong Redis nó là <code>SMISMEMBER wishlist:1042 …</code> — một lệnh, O(500) phép tra bảng băm, dưới một mili giây, và câu trả lời về đúng theo thứ tự bạn hỏi. Ở đây set không phải bộ đệm của cơ sở dữ liệu; nó là một chỉ mục dựng riêng cho việc mà cơ sở dữ liệu làm dở.</div>

<h3>Bốn bài toán thật, mỗi cái một lệnh</h3>
<pre><code><span class="tok-comment"># 1. Khách duy nhất hôm nay (chính xác, và đắt khi lớn — xem 3.4 cho HLL)</span>
redis-cli SADD uv:2026-08-23 user:1042
redis-cli SCARD uv:2026-08-23

<span class="tok-comment"># 2. Chống trùng: webhook này đã xử lý chưa?</span>
redis-cli SADD seen:webhooks evt_8f2a           <span class="tok-comment"># 1 = lần đầu, xử lý đi</span>
redis-cli SADD seen:webhooks evt_8f2a           <span class="tok-comment"># 0 = trùng, bỏ qua</span>

<span class="tok-comment"># 3. Quyền: vai trò này có năng lực này không?</span>
redis-cli SADD perms:role:editor post.write post.edit media.upload
redis-cli SISMEMBER perms:role:editor user.delete

<span class="tok-comment"># 4. Tìm theo thẻ: bài gắn CẢ redis LẪN docker</span>
redis-cli SADD tag:redis post:1 post:2 post:9
redis-cli SADD tag:docker post:2 post:9 post:11
redis-cli SINTER tag:redis tag:docker</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 0
(integer) 3
(integer) 0
(integer) 3
(integer) 3
1) "post:2"
2) "post:9"</div>
<div class="pitfall"><strong>Cái bẫy:</strong> set không có trần. Cả bốn khuôn ở trên đều phình mãi trừ khi bạn nói khác đi. <code>uv:2026-08-23</code> thì ổn vì ngày tự lăn và bạn <code>EXPIRE</code> nó sau 30 ngày; <code>seen:webhooks</code> thì là thảm hoạ, vì nó là MỘT khoá tích luỹ mọi mã sự kiện hệ thống bạn từng nhận — 50 triệu phần tử, 4 GB, và không có mốc tự nhiên nào để thứ gì đó dọn chúng đi. Cách chữa là thôi dùng một set: mỗi sự kiện một khoá kèm TTL (<code>SET seen:evt_8f2a 1 NX EX 604800</code>) cho bạn đúng phép chống trùng ấy kèm dọn dẹp tự động, đổi lại là nhiều khoá hơn. Quy tắc ngón tay cái: set an toàn khi nó bị chặn bởi một thứ có thật (thẻ của một bài, quyền trong một vai trò, thành viên một đội) và nguy hiểm khi nó chỉ bị chặn bởi thời gian. Kiểm cái của bạn bằng <code>redis-cli --bigkeys</code> (Chương 12) trước khi production kiểm hộ.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sets/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis sets</span><span class="lc-sub">Danh sách lệnh đầy đủ kèm độ phức tạp, cộng bản mô tả chính thức của khuôn tìm-theo-thẻ và khuôn khách-duy-nhất. Hãy đọc độ phức tạp của <code>SINTER</code> và <code>SUNION</code> trước khi xây lên chúng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/sintercard/" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">SINTERCARD và LIMIT</span><span class="lc-sub">Lệnh của bản 7.0 biến câu "hai bên có gì chung không?" từ một phép giao đầy đủ thành một lối thoát sớm. Lệnh nhỏ, khác biệt lớn trên đường đi nóng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: thẻ, quyền và chống trùng</span><span class="lc-sub">Bài chấm điểm: dựng tìm-kiếm-theo-thẻ bằng <code>SINTER</code>, viết một phép chống trùng không thể phình vô hạn, và thay một vòng lặp <code>SMEMBERS</code> bằng <code>SSCAN</code>.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>SISMEMBER</code> là O(1) ở mọi kích thước còn <code>SMEMBERS</code> là O(N) chặn cả máy chủ — cái đầu là lý do để dùng set, cái sau là lý do người ta bỏng tay vì set. Kiểu mã hoá quyết định bộ nhớ: <code>intset</code> tốn ~8 byte mỗi phần tử còn <code>hashtable</code> tốn 60–90, việc chuyển kiểu xảy ra âm thầm ở ngưỡng, và không bao giờ chuyển ngược. Và đại số tập hợp thuộc về Redis chứ không thuộc về ứng dụng của bạn — <code>SINTER</code> duyệt set nhỏ nhất, <code>SINTERCARD … LIMIT 1</code> trả lời có/không mà không cần tính ra đáp án, còn các biến thể <code>…STORE</code> giữ kết quả lớn khỏi đường truyền với cái giá là một khoá không có TTL.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Sorted sets: the structure that does everything|||4.3 — Sorted set: cấu trúc làm được mọi thứ',
      slug: 'rd-4-3-zset',
      type: 'LESSON',
      description: 'Vì sao sorted set là hai cấu trúc trong một, ZADD với NX/XX/GT/LT/CH/INCR, ZRANGE hợp nhất của 7.0, điểm số là double nên chỉ chính xác tới 2^53, ZRANGEBYLEX khi mọi điểm bằng nhau, và ZUNIONSTORE với WEIGHTS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Sorted sets: the structure that does everything</h2>
<p class="lead">A sorted set is a set where every member also carries a floating-point <em>score</em>, and the members are kept in score order at all times. That sounds like a small addition to <code>SADD</code>. It is not: it is the difference between a collection you can only ask "is this in there?" and a collection you can ask "who are the top ten", "how many are between these two values", "what rank is this one" and "give me everything older than an hour" — each in O(log N), each in one command.</p>

<h3>Two structures pretending to be one</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A hash table: member → score</span><span class="lz-lnote">This is what makes <code>ZSCORE</code> and <code>ZADD</code>-on-an-existing-member O(1). Ask "what is alice's score" and Redis does a single hash lookup — it never touches the ordered structure at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">A skip list: ordered by (score, member)</span><span class="lz-lnote">A probabilistic tower of linked lists where each level skips roughly half the nodes of the level below. Finding a position, inserting, deleting and counting a range are all O(log N). Ties in score are broken by comparing the member string lexicographically — that tie-break rule is what makes <code>ZRANGEBYLEX</code> possible.</span></div>
  <div class="lz-layer"><span class="lz-lname">…or a listpack, when the set is small</span><span class="lz-lnote">Under <code>zset-max-listpack-entries</code> (128) and <code>zset-max-listpack-value</code> (64 bytes), the whole thing is one flat allocation of member/score pairs scanned linearly. It is O(N), but N is tiny and the memory saved is enormous — the same one-way conversion story as sets.</span></div>
</div>
<pre><code>redis-cli DEL board &gt;/dev/null
redis-cli ZADD board 1500 alice 1720 bob 1310 carol 1720 dave
redis-cli OBJECT ENCODING board
redis-cli ZSCORE board bob
redis-cli ZCARD board
redis-cli ZRANGE board 0 -1 WITHSCORES</code></pre>
<div class="out">(integer) 4
"listpack"
"1720"
(integer) 4
1) "carol"
2) "1310"
3) "alice"
4) "1500"
5) "bob"
6) "1720"
7) "dave"
8) "1720"</div>
<div class="callout"><strong>Note where <code>bob</code> and <code>dave</code> landed.</strong> Both scored 1720, and <code>bob</code> comes first because <code>"bob" &lt; "dave"</code> as a byte string. Score first, member second — always, everywhere, in every command. That is not a detail you can ignore: it means a leaderboard with many tied scores is alphabetically ordered inside each tie, which is either exactly what you want or a bug report about "the ranking looks rigged towards names starting with A".</div>

<h3>ZADD is six commands wearing one name</h3>
<pre><code>redis-cli ZADD board NX 9999 alice        <span class="tok-comment"># NX: only if absent → no change</span>
redis-cli ZSCORE board alice
redis-cli ZADD board XX GT CH 1600 alice  <span class="tok-comment"># XX: only if present; GT: only if greater</span>
redis-cli ZADD board XX GT CH 1400 alice  <span class="tok-comment"># 1400 &lt; 1600 → refused</span>
redis-cli ZADD board INCR 50 alice        <span class="tok-comment"># behaves like ZINCRBY, returns new score</span>
redis-cli ZINCRBY board -100 alice</code></pre>
<div class="out">(integer) 0
"1500"
(integer) 1
(integer) 0
"1650"
"1550"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> / <code>XX</code></span><span class="v">Only add new members / only update existing ones. Mutually exclusive. <code>NX</code> is how you set a starting score without clobbering a player who already has one.</span></div>
  <div class="kv"><span class="k"><code>GT</code> / <code>LT</code></span><span class="v">Redis 6.2+. Update only if the new score is greater / less than the current one. <code>GT</code> is the entire implementation of "high score" — no read, no compare, no race between two servers writing at once.</span></div>
  <div class="kv"><span class="k"><code>CH</code></span><span class="v">Changes the return value from "how many were added" to "how many were added <em>or changed</em>". Without it, an update returns 0 and you cannot tell success from no-op.</span></div>
  <div class="kv"><span class="k"><code>INCR</code></span><span class="v">Adds to the score instead of setting it, and returns the new score as a string. Combined with <code>NX</code> it is "increment, or start at this value" in one atomic step. Combined with <code>GT</code>/<code>LT</code> it can return nil when the update is refused.</span></div>
  <div class="kv"><span class="k">Many pairs in one call</span><span class="v"><code>ZADD k 1 a 2 b 3 c</code> — one command, one atomic write, one round trip. Flags apply to all pairs in the call.</span></div>
</div>
<div class="callout ok"><strong><code>ZADD board GT CH</code> is the fix for a race you will otherwise write by hand.</strong> The naive high-score update is <code>ZSCORE</code>, compare in the application, then <code>ZADD</code> — and two app servers finishing a game at the same moment will both read 1500, both decide their score is higher, and the lower one will win because it wrote last. <code>GT</code> moves the comparison inside the single-threaded server (Lesson 1.1), where it cannot interleave. No <code>WATCH</code>, no Lua, no retry loop (Chapter 7). One flag.</div>

<h3>ZRANGE: one command, four ways to slice</h3>
<pre><code>redis-cli DEL board &gt;/dev/null
redis-cli ZADD board 1310 carol 1500 alice 1720 bob 1720 dave 1890 erin &gt;/dev/null
redis-cli ZRANGE board 0 2                       <span class="tok-comment"># by rank, lowest first</span>
redis-cli ZRANGE board 0 2 REV                   <span class="tok-comment"># 6.2+: top three</span>
redis-cli ZRANGE board 1500 1750 BYSCORE         <span class="tok-comment"># by score window</span>
redis-cli ZRANGE board "(1500" "+inf" BYSCORE    <span class="tok-comment"># ( = exclusive</span>
redis-cli ZRANGE board "+inf" 1500 BYSCORE REV LIMIT 0 2
redis-cli ZCOUNT board 1500 1750
redis-cli ZRANK board dave
redis-cli ZREVRANK board dave WITHSCORE          <span class="tok-comment"># 7.2+</span></code></pre>
<div class="out">1) "carol"
2) "alice"
3) "bob"
1) "erin"
2) "dave"
3) "bob"
1) "alice"
2) "bob"
3) "dave"
1) "bob"
2) "dave"
3) "erin"
1) "erin"
2) "dave"
(integer) 3
(integer) 3
1) (integer) 1
2) "1720"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">By rank (default)</span><span class="lz-t">ZRANGE k 0 9 — the first ten</span><span class="lz-d">Indices are zero-based, negative counts from the end, and the range is <em>inclusive</em> on both sides: <code>0 9</code> is ten elements, not nine. O(log N + count).</span></div>
  <div class="lz-step"><span class="lz-k">BYSCORE</span><span class="lz-t">ZRANGE k 1500 1750 BYSCORE</span><span class="lz-d">A window of values, not positions. <code>-inf</code> and <code>+inf</code> are valid endpoints, and a leading <code>(</code> makes an endpoint exclusive. This is the workhorse for time windows: score = timestamp.</span></div>
  <div class="lz-step"><span class="lz-k">BYLEX</span><span class="lz-t">ZRANGE k "[a" "[c" BYLEX</span><span class="lz-d">Lexicographic ranges — only meaningful when <em>every</em> member has the same score, because otherwise score ordering wins. Endpoints must start with <code>[</code> (inclusive), <code>(</code> (exclusive), or be <code>-</code> / <code>+</code>.</span></div>
  <div class="lz-step"><span class="lz-k">REV and LIMIT</span><span class="lz-t">…REV LIMIT offset count</span><span class="lz-d">Redis 6.2 folded <code>ZREVRANGE</code>, <code>ZRANGEBYSCORE</code>, <code>ZREVRANGEBYSCORE</code> and <code>ZRANGEBYLEX</code> into this one command. <code>LIMIT</code> works with <code>BYSCORE</code>/<code>BYLEX</code> only — and note that with <code>REV</code> the endpoints are given <em>high first</em>.</span></div>
</div>
<div class="callout warn"><strong>The old commands still exist and still work — and they are what you will find in every tutorial written before 2022.</strong> <code>ZREVRANGE k 0 9</code> is <code>ZRANGE k 0 9 REV</code>; <code>ZRANGEBYSCORE k min max</code> is <code>ZRANGE k min max BYSCORE</code>. Redis has deprecated the old family but has not removed it, and it will not. Use the unified form in new code — one command with flags is easier to build dynamically than four command names — but do not go on a rewriting spree in code that works.</div>

<h3>The score is a double, and that has a hard edge</h3>
<pre><code>redis-cli ZADD ids 9007199254740993 a       <span class="tok-comment"># 2^53 + 1</span>
redis-cli ZSCORE ids a
redis-cli ZADD prices 19.99 book
redis-cli ZINCRBY prices 0.01 book
redis-cli ZADD ranks inf top -inf bottom
redis-cli ZRANGE ranks 0 -1 WITHSCORES</code></pre>
<div class="out">(integer) 1
"9007199254740992"
(integer) 1
"20"
(integer) 2
1) "bottom"
2) "-inf"
3) "top"
4) "inf"</div>
<div class="pitfall"><strong>Pitfall:</strong> scores are IEEE-754 doubles, so integers are exact only up to 2^53 (9,007,199,254,740,992). Store a Twitter-style 64-bit snowflake ID or a nanosecond timestamp as a score and it will be silently rounded — look at the output above: 2^53+1 came back as 2^53. Nothing errors, nothing warns, and two different IDs can collapse onto the same score. Millisecond timestamps are safe until the year 287396, so use those, not nanoseconds. For large IDs, put the ID in the <em>member</em> and something smaller in the score. Money has the same edge from the other direction: <code>19.99 + 0.01</code> printed <code>20</code> here, but binary floating point cannot represent 0.1 exactly, and a long chain of <code>ZINCRBY</code> on currency will drift. Store cents as integers.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>inf</code> and <code>-inf</code> are real scores</span><span class="v">Useful as sentinels: <code>-inf</code> pins something to the bottom of a leaderboard, <code>inf</code> to the top, and both are valid range endpoints.</span></div>
  <div class="kv"><span class="k"><code>nan</code> is an error</span><span class="v">Any operation that would produce NaN — <code>ZINCRBY inf</code> on a member scored <code>-inf</code> — returns an error instead of corrupting the set.</span></div>
  <div class="kv"><span class="k">Scores print without trailing zeros</span><span class="v"><code>20</code>, not <code>20.0</code>. Do not string-compare scores; parse them.</span></div>
  <div class="kv"><span class="k">17 significant digits on the wire</span><span class="v">Redis formats scores with enough precision to round-trip a double exactly, so what you put in is what you get back — within the limits of what a double can hold in the first place.</span></div>
</div>

<h3>Popping, trimming and combining</h3>
<pre><code>redis-cli ZPOPMIN board                       <span class="tok-comment"># lowest score, removed</span>
redis-cli ZPOPMAX board 2                     <span class="tok-comment"># two highest</span>
redis-cli BZPOPMIN delayed 5                  <span class="tok-comment"># blocking, like BLPOP</span>
redis-cli ZREMRANGEBYSCORE events "-inf" 1755900000    <span class="tok-comment"># drop everything older</span>
redis-cli ZREMRANGEBYRANK board 0 -101                 <span class="tok-comment"># keep only the top 100</span>
redis-cli ZADD s1 1 a 2 b &gt;/dev/null; redis-cli ZADD s2 10 b 20 c &gt;/dev/null
redis-cli ZUNIONSTORE out 2 s1 s2 WEIGHTS 1 0.5 AGGREGATE SUM
redis-cli ZRANGE out 0 -1 WITHSCORES
redis-cli ZINTERCARD 2 s1 s2</code></pre>
<div class="out">1) "carol"
2) "1310"
1) "erin"
2) "1890"
3) "dave"
4) "1720"
(nil)
(integer) 0
(integer) 0
(integer) 3
1) "a"
2) "1"
3) "b"
4) "7"
5) "c"
6) "10"
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ZREMRANGEBYRANK k 0 -101</code></span><span class="v">The leaderboard trim. Ranks are ascending, so this deletes everything except the last 100 — the sorted-set equivalent of <code>LTRIM</code>, and the reason a leaderboard never needs unbounded memory.</span></div>
  <div class="kv"><span class="k"><code>ZREMRANGEBYSCORE k -inf &lt;cutoff&gt;</code></span><span class="v">The sliding-window sweep. With score = timestamp this drops everything older than the cutoff in O(log N + removed), which is exactly the rate limiter from Lesson 3.5.</span></div>
  <div class="kv"><span class="k"><code>WEIGHTS</code> multiplies before aggregating</span><span class="v">Above, <code>b</code> scored 2 in <code>s1</code> and 10 in <code>s2</code>; with weights 1 and 0.5 that is 2 + 5 = 7. This is how you blend "recency" and "popularity" into one ranking without doing arithmetic in your application.</span></div>
  <div class="kv"><span class="k"><code>AGGREGATE SUM|MIN|MAX</code></span><span class="v">SUM is the default. MIN and MAX pick one side's score instead of adding — MAX over daily leaderboards gives "best single day", SUM gives "total".</span></div>
  <div class="kv"><span class="k">The …STORE cost</span><span class="v"><code>ZUNIONSTORE</code> is O(N log N) over all input members and it materialises a new key with no TTL. On big inputs it is a blocking operation — do it on a replica, or on a schedule, not on a request path.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sorted-sets/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis sorted sets</span><span class="lc-sub">The reference for every Z-command with its complexity, the score/member tie-break rule, and the official leaderboard and range-query examples.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/zadd/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">ZADD: NX, XX, GT, LT, CH, INCR</span><span class="lc-sub">The flag matrix in full, including which combinations are illegal and exactly what each one returns. The <code>GT</code> section is worth reading twice.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: leaderboards and ranges</span><span class="lc-sub">Graded exercises: write a race-free high-score update with <code>GT</code>, translate four legacy <code>ZREVRANGEBYSCORE</code> calls to unified <code>ZRANGE</code>, and trim a leaderboard to its top 100.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A sorted set is a hash table plus a skip list, which is why <code>ZSCORE</code> is O(1) while ranks, ranges and counts are O(log N) — and why ties break on the member string, not on insertion order. <code>ZADD</code> carries six flags and two of them replace code you would otherwise write badly: <code>GT</code> makes a high-score update race-free with no transaction, and <code>CH</code> makes the return value tell you whether anything actually changed. And the score is a double: exact only to 2^53, so millisecond timestamps are safe, snowflake IDs and nanoseconds are not, and money belongs in integer cents.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Sorted set: cấu trúc làm được mọi thứ</h2>
<p class="lead">Sorted set là một set mà mỗi phần tử còn mang thêm một <em>điểm số</em> dấu phẩy động, và các phần tử luôn được giữ theo thứ tự điểm. Nghe như một bổ sung nhỏ cho <code>SADD</code>. Không phải vậy: đó là khoảng cách giữa một tập hợp chỉ trả lời được "cái này có trong đó không?" và một tập hợp trả lời được "mười người dẫn đầu là ai", "có bao nhiêu cái nằm giữa hai giá trị này", "cái này xếp hạng mấy" và "cho tôi mọi thứ cũ hơn một tiếng" — mỗi câu trong O(log N), mỗi câu một lệnh.</p>

<h3>Hai cấu trúc giả vờ là một</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một bảng băm: phần tử → điểm</span><span class="lz-lnote">Đây là thứ khiến <code>ZSCORE</code> và <code>ZADD</code>-lên-phần-tử-đã-có là O(1). Hỏi "điểm của alice là bao nhiêu" thì Redis tra bảng băm đúng một lần — nó không đụng tới cấu trúc có thứ tự chút nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một skip list: sắp theo (điểm, phần tử)</span><span class="lz-lnote">Một tháp danh sách liên kết ngẫu nhiên, mỗi tầng nhảy cóc qua khoảng một nửa số nút của tầng dưới. Tìm vị trí, chèn, xoá và đếm một khoảng đều là O(log N). Điểm bằng nhau thì phân định bằng cách so chuỗi phần tử theo thứ tự từ điển — chính luật phân định đó làm cho <code>ZRANGEBYLEX</code> có ý nghĩa.</span></div>
  <div class="lz-layer"><span class="lz-lname">…hoặc một listpack, khi tập nhỏ</span><span class="lz-lnote">Dưới <code>zset-max-listpack-entries</code> (128) và <code>zset-max-listpack-value</code> (64 byte), cả cấu trúc là một khối cấp phát phẳng gồm các cặp phần-tử/điểm, quét tuyến tính. Nó là O(N), nhưng N tí xíu còn bộ nhớ tiết kiệm được thì khổng lồ — vẫn câu chuyện chuyển kiểu một chiều như ở set.</span></div>
</div>
<pre><code>redis-cli DEL board &gt;/dev/null
redis-cli ZADD board 1500 alice 1720 bob 1310 carol 1720 dave
redis-cli OBJECT ENCODING board
redis-cli ZSCORE board bob
redis-cli ZCARD board
redis-cli ZRANGE board 0 -1 WITHSCORES</code></pre>
<div class="out">(integer) 4
"listpack"
"1720"
(integer) 4
1) "carol"
2) "1310"
3) "alice"
4) "1500"
5) "bob"
6) "1720"
7) "dave"
8) "1720"</div>
<div class="callout"><strong>Hãy để ý chỗ <code>bob</code> và <code>dave</code> rơi vào.</strong> Cả hai cùng 1720 điểm, và <code>bob</code> đứng trước vì <code>"bob" &lt; "dave"</code> khi so như chuỗi byte. Điểm trước, phần tử sau — luôn luôn, ở mọi nơi, trong mọi lệnh. Đây không phải chi tiết bỏ qua được: nó nghĩa là một bảng xếp hạng có nhiều điểm bằng nhau sẽ được sắp theo bảng chữ cái bên trong mỗi nhóm bằng điểm, và điều đó hoặc đúng ý bạn, hoặc là một phiếu báo lỗi kiểu "bảng xếp hạng có vẻ thiên vị tên bắt đầu bằng A".</div>

<h3>ZADD là sáu lệnh khoác chung một cái tên</h3>
<pre><code>redis-cli ZADD board NX 9999 alice        <span class="tok-comment"># NX: chỉ khi chưa có → không đổi gì</span>
redis-cli ZSCORE board alice
redis-cli ZADD board XX GT CH 1600 alice  <span class="tok-comment"># XX: chỉ khi đã có; GT: chỉ khi lớn hơn</span>
redis-cli ZADD board XX GT CH 1400 alice  <span class="tok-comment"># 1400 &lt; 1600 → từ chối</span>
redis-cli ZADD board INCR 50 alice        <span class="tok-comment"># cư xử như ZINCRBY, trả điểm mới</span>
redis-cli ZINCRBY board -100 alice</code></pre>
<div class="out">(integer) 0
"1500"
(integer) 1
(integer) 0
"1650"
"1550"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> / <code>XX</code></span><span class="v">Chỉ thêm phần tử mới / chỉ cập nhật phần tử đã có. Loại trừ nhau. <code>NX</code> là cách bạn đặt điểm khởi đầu mà không đè lên một người chơi vốn đã có điểm.</span></div>
  <div class="kv"><span class="k"><code>GT</code> / <code>LT</code></span><span class="v">Redis 6.2+. Chỉ cập nhật nếu điểm mới lớn hơn / nhỏ hơn điểm hiện tại. <code>GT</code> chính là toàn bộ phần cài đặt của "điểm cao nhất" — không đọc, không so, không đua giữa hai máy chủ cùng ghi một lúc.</span></div>
  <div class="kv"><span class="k"><code>CH</code></span><span class="v">Đổi giá trị trả về từ "thêm được bao nhiêu" thành "thêm <em>hoặc đổi</em> được bao nhiêu". Không có nó thì một lần cập nhật trả 0 và bạn không phân biệt được thành công với không-làm-gì.</span></div>
  <div class="kv"><span class="k"><code>INCR</code></span><span class="v">Cộng vào điểm thay vì đặt điểm, và trả về điểm mới dạng chuỗi. Ghép với <code>NX</code> nó là "tăng lên, hoặc bắt đầu từ giá trị này" gói trong một bước nguyên tử. Ghép với <code>GT</code>/<code>LT</code> nó có thể trả nil khi phép cập nhật bị từ chối.</span></div>
  <div class="kv"><span class="k">Nhiều cặp trong một lời gọi</span><span class="v"><code>ZADD k 1 a 2 b 3 c</code> — một lệnh, một lần ghi nguyên tử, một vòng đi-về. Các cờ áp cho mọi cặp trong lời gọi đó.</span></div>
</div>
<div class="callout ok"><strong><code>ZADD board GT CH</code> là cách chữa một cuộc đua mà nếu không có nó bạn sẽ tự viết bằng tay.</strong> Cách cập nhật điểm cao ngây thơ là <code>ZSCORE</code>, so sánh trong ứng dụng, rồi <code>ZADD</code> — và hai máy chủ ứng dụng cùng kết thúc một ván ở đúng một khoảnh khắc sẽ cùng đọc ra 1500, cùng kết luận điểm mình cao hơn, rồi bên <em>thấp</em> hơn thắng vì nó ghi sau. <code>GT</code> đưa phép so sánh vào bên trong máy chủ đơn luồng (Bài 1.1), nơi nó không thể xen kẽ. Không cần <code>WATCH</code>, không cần Lua, không cần vòng lặp thử lại (Chương 7). Một cái cờ.</div>

<h3>ZRANGE: một lệnh, bốn cách cắt lát</h3>
<pre><code>redis-cli DEL board &gt;/dev/null
redis-cli ZADD board 1310 carol 1500 alice 1720 bob 1720 dave 1890 erin &gt;/dev/null
redis-cli ZRANGE board 0 2                       <span class="tok-comment"># theo hạng, thấp trước</span>
redis-cli ZRANGE board 0 2 REV                   <span class="tok-comment"># 6.2+: top ba</span>
redis-cli ZRANGE board 1500 1750 BYSCORE         <span class="tok-comment"># theo cửa sổ điểm</span>
redis-cli ZRANGE board "(1500" "+inf" BYSCORE    <span class="tok-comment"># ( = không bao gồm</span>
redis-cli ZRANGE board "+inf" 1500 BYSCORE REV LIMIT 0 2
redis-cli ZCOUNT board 1500 1750
redis-cli ZRANK board dave
redis-cli ZREVRANK board dave WITHSCORE          <span class="tok-comment"># 7.2+</span></code></pre>
<div class="out">1) "carol"
2) "alice"
3) "bob"
1) "erin"
2) "dave"
3) "bob"
1) "alice"
2) "bob"
3) "dave"
1) "bob"
2) "dave"
3) "erin"
1) "erin"
2) "dave"
(integer) 3
(integer) 3
1) (integer) 1
2) "1720"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Theo hạng (mặc định)</span><span class="lz-t">ZRANGE k 0 9 — mười cái đầu</span><span class="lz-d">Chỉ số đếm từ 0, số âm đếm ngược từ cuối, và khoảng là <em>bao gồm</em> cả hai đầu: <code>0 9</code> là mười phần tử, không phải chín. O(log N + số phần tử).</span></div>
  <div class="lz-step"><span class="lz-k">BYSCORE</span><span class="lz-t">ZRANGE k 1500 1750 BYSCORE</span><span class="lz-d">Một cửa sổ giá trị, không phải vị trí. <code>-inf</code> và <code>+inf</code> là hai đầu mút hợp lệ, và dấu <code>(</code> đứng trước làm đầu mút thành không-bao-gồm. Đây là con ngựa kéo cho cửa sổ thời gian: điểm = mốc thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">BYLEX</span><span class="lz-t">ZRANGE k "[a" "[c" BYLEX</span><span class="lz-d">Khoảng theo thứ tự từ điển — chỉ có nghĩa khi <em>mọi</em> phần tử cùng điểm, vì nếu không thì thứ tự điểm thắng. Đầu mút phải bắt đầu bằng <code>[</code> (bao gồm), <code>(</code> (không bao gồm), hoặc là <code>-</code> / <code>+</code>.</span></div>
  <div class="lz-step"><span class="lz-k">REV và LIMIT</span><span class="lz-t">…REV LIMIT vị_trí số_lượng</span><span class="lz-d">Redis 6.2 gộp <code>ZREVRANGE</code>, <code>ZRANGEBYSCORE</code>, <code>ZREVRANGEBYSCORE</code> và <code>ZRANGEBYLEX</code> vào một lệnh này. <code>LIMIT</code> chỉ dùng được với <code>BYSCORE</code>/<code>BYLEX</code> — và lưu ý khi có <code>REV</code> thì đầu mút phải ghi <em>cao trước</em>.</span></div>
</div>
<div class="callout warn"><strong>Các lệnh cũ vẫn còn và vẫn chạy — và chúng là thứ bạn sẽ gặp trong mọi hướng dẫn viết trước 2022.</strong> <code>ZREVRANGE k 0 9</code> chính là <code>ZRANGE k 0 9 REV</code>; <code>ZRANGEBYSCORE k min max</code> chính là <code>ZRANGE k min max BYSCORE</code>. Redis đã đánh dấu họ lệnh cũ là lỗi thời nhưng không gỡ, và sẽ không gỡ. Dùng dạng hợp nhất trong mã mới — một lệnh kèm cờ thì dễ dựng động hơn bốn cái tên lệnh — nhưng đừng lao đi viết lại mã đang chạy tốt.</div>

<h3>Điểm số là double, và chỗ đó có một cạnh sắc</h3>
<pre><code>redis-cli ZADD ids 9007199254740993 a       <span class="tok-comment"># 2^53 + 1</span>
redis-cli ZSCORE ids a
redis-cli ZADD prices 19.99 book
redis-cli ZINCRBY prices 0.01 book
redis-cli ZADD ranks inf top -inf bottom
redis-cli ZRANGE ranks 0 -1 WITHSCORES</code></pre>
<div class="out">(integer) 1
"9007199254740992"
(integer) 1
"20"
(integer) 2
1) "bottom"
2) "-inf"
3) "top"
4) "inf"</div>
<div class="pitfall"><strong>Cái bẫy:</strong> điểm số là double IEEE-754, nên số nguyên chỉ chính xác tới 2^53 (9.007.199.254.740.992). Lưu một ID 64-bit kiểu snowflake của Twitter hay một mốc thời gian nano giây làm điểm là nó bị làm tròn âm thầm — hãy nhìn kết quả ở trên: 2^53+1 trả về thành 2^53. Không lỗi nào, không cảnh báo nào, và hai ID khác nhau có thể sập vào cùng một điểm. Mốc thời gian mili giây thì an toàn tới tận năm 287396, nên hãy dùng nó, đừng dùng nano giây. Với ID lớn, hãy đặt ID vào <em>phần tử</em> và đặt thứ gì nhỏ hơn vào điểm. Tiền bạc dính đúng cạnh sắc đó từ phía ngược lại: <code>19.99 + 0.01</code> ở đây in ra <code>20</code>, nhưng dấu phẩy động nhị phân không biểu diễn được 0,1 một cách chính xác, và một chuỗi dài <code>ZINCRBY</code> trên tiền tệ sẽ trôi dạt. Hãy lưu số xu dạng số nguyên.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>inf</code> và <code>-inf</code> là điểm thật</span><span class="v">Hữu ích làm cột mốc: <code>-inf</code> ghim một thứ xuống đáy bảng xếp hạng, <code>inf</code> ghim lên đỉnh, và cả hai đều là đầu mút khoảng hợp lệ.</span></div>
  <div class="kv"><span class="k"><code>nan</code> là lỗi</span><span class="v">Bất cứ phép nào sinh ra NaN — <code>ZINCRBY inf</code> lên một phần tử đang có điểm <code>-inf</code> — đều trả về lỗi thay vì làm hỏng cả tập.</span></div>
  <div class="kv"><span class="k">Điểm in ra không có số 0 thừa</span><span class="v"><code>20</code>, không phải <code>20.0</code>. Đừng so sánh điểm dạng chuỗi; hãy phân tích nó thành số.</span></div>
  <div class="kv"><span class="k">17 chữ số có nghĩa trên đường truyền</span><span class="v">Redis định dạng điểm với đủ độ chính xác để một double đi và về nguyên vẹn, nên thứ bạn đưa vào là thứ bạn lấy ra — trong giới hạn của thứ mà một double chứa nổi ngay từ đầu.</span></div>
</div>

<h3>Lấy ra, cắt bớt và kết hợp</h3>
<pre><code>redis-cli ZPOPMIN board                       <span class="tok-comment"># điểm thấp nhất, xoá luôn</span>
redis-cli ZPOPMAX board 2                     <span class="tok-comment"># hai cái điểm cao nhất</span>
redis-cli BZPOPMIN delayed 5                  <span class="tok-comment"># bản chặn, giống BLPOP</span>
redis-cli ZREMRANGEBYSCORE events "-inf" 1755900000    <span class="tok-comment"># bỏ mọi thứ cũ hơn</span>
redis-cli ZREMRANGEBYRANK board 0 -101                 <span class="tok-comment"># chỉ giữ 100 cái đỉnh</span>
redis-cli ZADD s1 1 a 2 b &gt;/dev/null; redis-cli ZADD s2 10 b 20 c &gt;/dev/null
redis-cli ZUNIONSTORE out 2 s1 s2 WEIGHTS 1 0.5 AGGREGATE SUM
redis-cli ZRANGE out 0 -1 WITHSCORES
redis-cli ZINTERCARD 2 s1 s2</code></pre>
<div class="out">1) "carol"
2) "1310"
1) "erin"
2) "1890"
3) "dave"
4) "1720"
(nil)
(integer) 0
(integer) 0
(integer) 3
1) "a"
2) "1"
3) "b"
4) "7"
5) "c"
6) "10"
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ZREMRANGEBYRANK k 0 -101</code></span><span class="v">Phép cắt bảng xếp hạng. Hạng đi từ thấp lên, nên câu này xoá tất cả trừ 100 cái cuối — bản sorted set của <code>LTRIM</code>, và là lý do một bảng xếp hạng không bao giờ cần bộ nhớ vô hạn.</span></div>
  <div class="kv"><span class="k"><code>ZREMRANGEBYSCORE k -inf &lt;mốc&gt;</code></span><span class="v">Phép quét cửa sổ trượt. Với điểm = mốc thời gian, câu này bỏ mọi thứ cũ hơn mốc trong O(log N + số bị xoá), đúng bằng bộ giới hạn tần suất ở Bài 3.5.</span></div>
  <div class="kv"><span class="k"><code>WEIGHTS</code> nhân trước khi gộp</span><span class="v">Ở trên, <code>b</code> có 2 điểm trong <code>s1</code> và 10 điểm trong <code>s2</code>; với trọng số 1 và 0,5 thì thành 2 + 5 = 7. Đây là cách bạn pha "độ mới" với "độ nổi tiếng" thành một thứ hạng duy nhất mà không phải làm toán trong ứng dụng.</span></div>
  <div class="kv"><span class="k"><code>AGGREGATE SUM|MIN|MAX</code></span><span class="v">SUM là mặc định. MIN và MAX chọn điểm của một phía thay vì cộng lại — MAX trên các bảng xếp hạng theo ngày cho ra "ngày tốt nhất", SUM cho ra "tổng cộng".</span></div>
  <div class="kv"><span class="k">Cái giá của …STORE</span><span class="v"><code>ZUNIONSTORE</code> là O(N log N) trên toàn bộ phần tử đầu vào và nó dựng ra một khoá mới không có TTL. Với đầu vào lớn thì đó là một phép chặn — hãy chạy nó trên bản sao, hoặc theo lịch, đừng chạy trên đường xử lý một yêu cầu.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sorted-sets/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis sorted sets</span><span class="lc-sub">Tài liệu tra cứu cho mọi lệnh Z kèm độ phức tạp, luật phân định điểm/phần-tử, và các ví dụ chính thức về bảng xếp hạng cùng truy vấn theo khoảng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/zadd/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">ZADD: NX, XX, GT, LT, CH, INCR</span><span class="lc-sub">Bảng cờ đầy đủ, gồm cả những tổ hợp không hợp lệ và chính xác từng cái trả về gì. Phần <code>GT</code> đáng đọc hai lượt.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: bảng xếp hạng và truy vấn khoảng</span><span class="lc-sub">Bài chấm điểm: viết một phép cập nhật điểm cao không có đua bằng <code>GT</code>, dịch bốn lời gọi <code>ZREVRANGEBYSCORE</code> kiểu cũ sang <code>ZRANGE</code> hợp nhất, và cắt một bảng xếp hạng còn 100 cái đỉnh.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Sorted set là một bảng băm cộng một skip list, đó là lý do <code>ZSCORE</code> là O(1) trong khi hạng, khoảng và phép đếm là O(log N) — và cũng là lý do điểm bằng nhau thì phân định theo chuỗi phần tử, không theo thứ tự chèn. <code>ZADD</code> mang sáu cờ và hai trong số đó thay cho phần mã bạn hẳn sẽ viết tệ: <code>GT</code> làm cho phép cập nhật điểm cao hết đua mà không cần giao dịch, còn <code>CH</code> làm giá trị trả về nói cho bạn biết có gì thật sự thay đổi hay không. Và điểm là một double: chỉ chính xác tới 2^53, nên mốc thời gian mili giây thì an toàn, ID snowflake và nano giây thì không, còn tiền thì phải nằm ở số xu dạng nguyên.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Sorted sets in practice: five patterns|||4.4 — Sorted set trong thực tế: năm khuôn mẫu',
      slug: 'rd-4-4-zset-thuc-te',
      type: 'LESSON',
      description: 'Bảng xếp hạng kèm hạng của chính mình, bộ hẹn giờ nhận việc nguyên tử, cửa sổ trượt, chỉ mục phụ theo giá và ngày, và gợi ý gõ bằng ZRANGEBYLEX — năm bài toán khác nhau trên đúng một cấu trúc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Sorted sets in practice: five patterns</h2>
<p class="lead">Lesson 4.3 was the commands. This one is what people actually build with them. Five patterns, all in production somewhere, all the same structure — and each one has a detail that only shows up once real traffic arrives.</p>

<h3>Pattern 1 — A leaderboard that can answer "what rank am I?"</h3>
<pre><code>redis-cli DEL lb &gt;/dev/null
python3 -c "
import random
random.seed(7)
for i in range(100000): print(f'ZADD lb {random.randint(0,50000)} player:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli ZCARD lb
redis-cli ZRANGE lb 0 4 REV WITHSCORES        <span class="tok-comment"># top 5</span>
redis-cli ZREVRANK lb player:42 WITHSCORE     <span class="tok-comment"># my rank, 0-based</span>
time redis-cli ZREVRANK lb player:99999 &gt;/dev/null</code></pre>
<div class="out">(integer) 100000
1) "player:63127"
2) "50000"
3) "player:9021"
4) "49999"
5) "player:71640"
6) "49999"
1) (integer) 21847
2) "39091"
real	0m0.003s</div>
<div class="callout ok"><strong>"What rank am I?" is the query relational databases are worst at and sorted sets are best at.</strong> In SQL it is <code>SELECT COUNT(*) FROM scores WHERE score &gt; ?</code> — a full index scan that gets slower as the table grows, or a window function over the whole table. In Redis it is <code>ZREVRANK</code>: 3 milliseconds on a hundred thousand players, O(log N), because the skip list keeps a span count on every node and walking down the tower sums those spans. Ten million players would take about 23 steps instead of 17.</div>
<pre><code><span class="tok-comment">// The three queries a leaderboard screen actually needs</span>
const [top, myRank, myScore] = await redis
  .multi()
  .zRange('lb', 0, 9, { REV: true, BY: 'RANK' })
  .zRevRank('lb', &#96;player:\${id}&#96;)
  .zScore('lb', &#96;player:\${id}&#96;)
  .exec();

<span class="tok-comment">// "Players around me" — the neighbours slice</span>
const start = Math.max(0, myRank - 2);
const around = await redis.zRange('lb', start, start + 4, { REV: true });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ranks are 0-based</span><span class="v"><code>ZREVRANK</code> returns 0 for first place. Add one before showing it to a human, and remember that <code>null</code> means "not in the leaderboard at all", not "last".</span></div>
  <div class="kv"><span class="k">Ties are ordered by member name</span><span class="v">Two players on 49999 are ranked alphabetically (Lesson 4.3). If that matters, encode the tiebreaker into the score itself: <code>score * 10^10 + (10^10 - timestamp)</code> ranks equal scores by who got there first — within the 2^53 budget.</span></div>
  <div class="kv"><span class="k">Trim on write, not on a cron</span><span class="v"><code>ZREMRANGEBYRANK lb 0 -1001</code> right after each <code>ZADD</code> keeps the top 1000 and costs nothing, because it removes at most one member per call.</span></div>
  <div class="kv"><span class="k">Per-period boards are separate keys</span><span class="v"><code>lb:2026-08</code>, <code>lb:2026-W34</code>, each with a TTL. "All time" is a <code>ZUNIONSTORE</code> over the months, run on a schedule, never on a request.</span></div>
  <div class="kv"><span class="k">Deep pages are cheap here</span><span class="v">Unlike <code>LRANGE</code> (Lesson 4.1), <code>ZRANGE lb 50000 50019 REV</code> is O(log N + 20). Page 2500 of a leaderboard costs the same as page 1.</span></div>
</div>

<h3>Pattern 2 — A delayed-job scheduler in nine lines</h3>
<pre><code><span class="tok-comment"># score = the unix ms at which the job should run</span>
redis-cli ZADD jobs:scheduled 1755950000000 "email:1042" 1755960000000 "report:88"
<span class="tok-comment"># a worker asks: what is due now?</span>
redis-cli ZRANGE jobs:scheduled "-inf" 1755955000000 BYSCORE LIMIT 0 10</code></pre>
<div class="out">(integer) 2
1) "email:1042"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Schedule</span><span class="lz-t">ZADD jobs:scheduled &lt;runAtMs&gt; &lt;jobId&gt;</span><span class="lz-d">Rescheduling is the same command — <code>ZADD</code> on an existing member just moves it. Cancelling is <code>ZREM</code>. Both O(log N), both idempotent.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Poll for due work</span><span class="lz-t">ZRANGE jobs -inf now BYSCORE LIMIT 0 10</span><span class="lz-d">Once a second is plenty. The query is O(log N + 10) regardless of how many million jobs are scheduled for next year, because the skip list jumps straight to <code>now</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Claim it atomically</span><span class="lz-t">ZREM returns 1 for exactly one worker</span><span class="lz-d">This is the whole trick. Twenty workers can read the same due job, but only one <code>ZREM</code> returns 1 — the rest return 0 and skip. No lock, no leader election, no coordination.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Then hand it to a real queue</span><span class="lz-t">RPUSH queue:jobs &lt;jobId&gt;</span><span class="lz-d">The sorted set answers "when", the list or stream answers "who runs it and what if it fails". Keeping the two jobs separate is what stops this from turning into a half-built queue (Lesson 4.1).</span></div>
</div>
<pre><code><span class="tok-comment">// The worker loop, in full</span>
setInterval(async () =&gt; {
  const due = await redis.zRange('jobs:scheduled', '-inf', Date.now(),
    { BY: 'SCORE', LIMIT: { offset: 0, count: 50 } });
  for (const jobId of due) {
    <span class="tok-comment">// ZREM is the claim: exactly one worker gets a 1 back</span>
    if (await redis.zRem('jobs:scheduled', jobId) === 1) {
      await redis.rPush('queue:jobs', jobId);
    }
  }
}, 1000);</code></pre>
<div class="callout warn"><strong>The gap between "read" and "claim" is real but harmless — and the gap between "claim" and "push" is not.</strong> If the process dies after <code>ZREM</code> and before <code>RPUSH</code>, the job is gone from both structures and nobody will ever run it. On a scheduler that sends invoices, that is a lost invoice. Two fixes: do both in a <code>MULTI</code> so they are one atomic unit (Chapter 7), or use a Lua script that pops-and-pushes in a single server-side step. The transaction is the easier one and it is enough here — this is exactly the class of bug that Chapter 7 exists to remove.</div>

<h3>Pattern 3 — Sliding windows: rate limits and "last hour" counts</h3>
<pre><code><span class="tok-comment"># One key per subject; score AND member are both the timestamp</span>
NOW=$(date +%s%3N)
redis-cli ZADD rl:user:1042 $NOW "$NOW-a1"
redis-cli ZREMRANGEBYSCORE rl:user:1042 "-inf" "($((NOW-60000))"
redis-cli ZCARD rl:user:1042
redis-cli EXPIRE rl:user:1042 120</code></pre>
<div class="out">(integer) 1
(integer) 0
(integer) 1
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why the member is not just the timestamp</span><span class="v">Two requests in the same millisecond would be the same member, and the second <code>ZADD</code> would silently overwrite instead of counting. Append a random suffix or a request ID — the member only has to be unique, it is never read.</span></div>
  <div class="kv"><span class="k">Sweep before you count</span><span class="v"><code>ZREMRANGEBYSCORE</code> then <code>ZCARD</code>, in that order, in one pipeline or <code>MULTI</code>. Counting first gives you a number that includes requests that have already aged out.</span></div>
  <div class="kv"><span class="k">Always set a TTL on the key</span><span class="v">The sweep only removes entries, never the key. A user who makes one request and disappears leaves an empty-ish key forever. <code>EXPIRE</code> to twice the window and the problem is gone (Lesson 2.2).</span></div>
  <div class="kv"><span class="k">Cost: one member per request</span><span class="v">~70 bytes each. At 100 requests/minute/user and a 1-minute window that is 7 KB per active user — fine. At a 24-hour window it is 10 MB per user, and you want a fixed-window counter (Lesson 3.5) or a bitmap instead.</span></div>
  <div class="kv"><span class="k">Same shape, different question</span><span class="v">Drop the limit check and this is "how many events in the last hour", "who was online in the last 5 minutes" (<code>ZRANGEBYSCORE</code> instead of <code>ZCARD</code>), or a presence list that cleans itself.</span></div>
</div>

<h3>Pattern 4 — A secondary index the database does not have</h3>
<pre><code><span class="tok-comment"># score = price in cents; member = the product id</span>
redis-cli ZADD idx:price 129900 sku:1001 89900 sku:1002 249900 sku:1003 89900 sku:1004
<span class="tok-comment"># "show me everything between 800k and 1.5M VND, cheapest first, page 1"</span>
redis-cli ZRANGE idx:price 80000 150000 BYSCORE LIMIT 0 20
redis-cli ZCOUNT idx:price 80000 150000        <span class="tok-comment"># the result count, O(log N)</span>
<span class="tok-comment"># newest-first feed: score = created_at ms</span>
redis-cli ZADD idx:new 1755949000000 post:9001 1755949600000 post:9002
redis-cli ZRANGE idx:new "+inf" "-inf" BYSCORE REV LIMIT 0 20</code></pre>
<div class="out">(integer) 4
1) "sku:1002"
2) "sku:1004"
3) "sku:1001"
(integer) 3
(integer) 2
1) "post:9002"
2) "post:9001"</div>
<div class="callout"><strong>Redis is not the source of truth here — Postgres is.</strong> The sorted set holds only IDs and one sortable number, the query returns twenty IDs in one O(log N + 20) call, and then you fetch those twenty rows by primary key, which is the one thing every database is fast at. What you have removed is the expensive part: the sort, the offset scan and the count. The catch is that you now have two copies of one fact, so the index has to be updated in the same code path as the write, and it needs a rebuild script for when they drift — because they will (Chapter 6).</div>

<h3>Pattern 5 — Autocomplete with ZRANGEBYLEX</h3>
<pre><code><span class="tok-comment"># EVERY member scores 0 — that is what makes lex ordering meaningful</span>
redis-cli ZADD ac 0 "hanoi" 0 "hai phong" 0 "ha giang" 0 "ho chi minh" 0 "hue"
redis-cli ZRANGE ac "[ha" "[ha\\xff" BYLEX          <span class="tok-comment"># prefix "ha"</span>
redis-cli ZRANGE ac "[h" "[h\\xff" BYLEX LIMIT 0 3
redis-cli ZLEXCOUNT ac "[ha" "[ha\\xff"</code></pre>
<div class="out">(integer) 5
1) "ha giang"
2) "hai phong"
3) "hanoi"
1) "ha giang"
2) "hai phong"
3) "hanoi"
(integer) 3</div>
<div class="pitfall"><strong>Pitfall:</strong> <code>ZRANGEBYLEX</code> silently returns nonsense the moment the scores are not all identical. The skip list is ordered by <em>(score, member)</em>, so a lex range is only a contiguous slice when every score is equal — otherwise Redis walks the structure in score order and the "range" you get back is whatever happened to fall between two positions. There is no error and no warning; you get a plausible-looking wrong answer. Add one autocomplete entry with score 1 instead of 0 and the results quietly break for every prefix. Two other details that bite: the prefix upper bound is the prefix plus <code>\\xff</code> (the highest byte), and comparison is byte-wise, so "Hanoi" and "hanoi" are far apart and Vietnamese diacritics sort after every ASCII letter. Normalise to lowercase, strip diacritics into the member, and keep the display form elsewhere — <code>0 "hanoi:Hà Nội"</code> is the usual trick.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sorted-sets/" target="_blank" rel="noopener">
  <span class="lc-ico">🏆</span>
  <span class="lc-body"><span class="lc-title">Sorted sets: the official patterns</span><span class="lc-sub">Redis's own write-up of leaderboards, rate limiting and secondary indexes, with the exact commands and their complexities side by side.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Redis use cases</span><span class="lc-sub">Short, honest descriptions of what Redis is used for in production — worth skimming to recognise which of your problems is already a solved pattern.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build all five</span><span class="lc-sub">Graded exercises: a leaderboard with "players around me", a scheduler whose claim cannot double-run, a sliding-window limiter with a TTL, and an autocomplete that survives a stray non-zero score.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> All five patterns are the same two decisions — what goes in the score, what goes in the member — and getting those right is the entire design. <code>ZREM</code> returning 1 is a free distributed claim: exactly one worker wins, with no lock and no coordination, and it is the backbone of the scheduler. And every one of these keys needs a bound: <code>ZREMRANGEBYRANK</code> for leaderboards, <code>ZREMRANGEBYSCORE</code> plus <code>EXPIRE</code> for windows, a rebuild script for indexes — an unbounded sorted set is just a slower memory leak.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Sorted set trong thực tế: năm khuôn mẫu</h2>
<p class="lead">Bài 4.3 là các lệnh. Bài này là những thứ người ta thật sự dựng bằng chúng. Năm khuôn mẫu, cái nào cũng đang chạy ở production đâu đó, cái nào cũng trên cùng một cấu trúc — và mỗi cái đều có một chi tiết chỉ lộ ra khi lưu lượng thật ập tới.</p>

<h3>Khuôn 1 — Bảng xếp hạng trả lời được "tôi hạng mấy?"</h3>
<pre><code>redis-cli DEL lb &gt;/dev/null
python3 -c "
import random
random.seed(7)
for i in range(100000): print(f'ZADD lb {random.randint(0,50000)} player:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli ZCARD lb
redis-cli ZRANGE lb 0 4 REV WITHSCORES        <span class="tok-comment"># top 5</span>
redis-cli ZREVRANK lb player:42 WITHSCORE     <span class="tok-comment"># hạng của tôi, đếm từ 0</span>
time redis-cli ZREVRANK lb player:99999 &gt;/dev/null</code></pre>
<div class="out">(integer) 100000
1) "player:63127"
2) "50000"
3) "player:9021"
4) "49999"
5) "player:71640"
6) "49999"
1) (integer) 21847
2) "39091"
real	0m0.003s</div>
<div class="callout ok"><strong>"Tôi hạng mấy?" là câu truy vấn mà cơ sở dữ liệu quan hệ dở nhất còn sorted set giỏi nhất.</strong> Bằng SQL nó là <code>SELECT COUNT(*) FROM scores WHERE score &gt; ?</code> — một lượt quét chỉ mục toàn phần, càng nhiều dòng càng chậm, hoặc một hàm cửa sổ chạy trên cả bảng. Trong Redis nó là <code>ZREVRANK</code>: 3 mili giây trên một trăm nghìn người chơi, O(log N), vì skip list giữ sẵn số nhịp nhảy trên mỗi nút và việc đi xuống theo tháp chỉ là cộng những nhịp ấy lại. Mười triệu người chơi sẽ tốn khoảng 23 bước thay vì 17.</div>
<pre><code><span class="tok-comment">// Ba truy vấn mà một màn hình bảng xếp hạng thật sự cần</span>
const [top, myRank, myScore] = await redis
  .multi()
  .zRange('lb', 0, 9, { REV: true, BY: 'RANK' })
  .zRevRank('lb', &#96;player:\${id}&#96;)
  .zScore('lb', &#96;player:\${id}&#96;)
  .exec();

<span class="tok-comment">// "Những người quanh tôi" — lát cắt hàng xóm</span>
const start = Math.max(0, myRank - 2);
const around = await redis.zRange('lb', start, start + 4, { REV: true });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hạng đếm từ 0</span><span class="v"><code>ZREVRANK</code> trả 0 cho vị trí nhất. Cộng một trước khi hiện ra cho người xem, và nhớ rằng <code>null</code> nghĩa là "không có trong bảng xếp hạng", không phải "hạng bét".</span></div>
  <div class="kv"><span class="k">Bằng điểm thì xếp theo tên phần tử</span><span class="v">Hai người cùng 49999 điểm được xếp theo bảng chữ cái (Bài 4.3). Nếu chuyện đó quan trọng, hãy nhét luôn tiêu chí phụ vào chính điểm số: <code>điểm * 10^10 + (10^10 - mốc_thời_gian)</code> xếp những người bằng điểm theo ai tới trước — trong hạn mức 2^53.</span></div>
  <div class="kv"><span class="k">Cắt lúc ghi, đừng cắt bằng cron</span><span class="v"><code>ZREMRANGEBYRANK lb 0 -1001</code> ngay sau mỗi <code>ZADD</code> giữ lại top 1000 và gần như miễn phí, vì mỗi lần gọi nó xoá nhiều nhất một phần tử.</span></div>
  <div class="kv"><span class="k">Bảng theo kỳ là các khoá riêng</span><span class="v"><code>lb:2026-08</code>, <code>lb:2026-W34</code>, mỗi cái một TTL. "Mọi thời đại" là một <code>ZUNIONSTORE</code> gộp các tháng, chạy theo lịch, không bao giờ chạy trong một yêu cầu.</span></div>
  <div class="kv"><span class="k">Trang sâu ở đây thì rẻ</span><span class="v">Khác với <code>LRANGE</code> (Bài 4.1), <code>ZRANGE lb 50000 50019 REV</code> là O(log N + 20). Trang 2500 của bảng xếp hạng tốn y hệt trang 1.</span></div>
</div>

<h3>Khuôn 2 — Bộ hẹn giờ chạy việc, gói trong chín dòng</h3>
<pre><code><span class="tok-comment"># điểm = mốc mili giây mà việc phải chạy</span>
redis-cli ZADD jobs:scheduled 1755950000000 "email:1042" 1755960000000 "report:88"
<span class="tok-comment"># một worker hỏi: giờ có gì tới hạn?</span>
redis-cli ZRANGE jobs:scheduled "-inf" 1755955000000 BYSCORE LIMIT 0 10</code></pre>
<div class="out">(integer) 2
1) "email:1042"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Hẹn giờ</span><span class="lz-t">ZADD jobs:scheduled &lt;runAtMs&gt; &lt;jobId&gt;</span><span class="lz-d">Hẹn lại cũng là đúng lệnh đó — <code>ZADD</code> lên phần tử đã có chỉ dời nó đi. Huỷ là <code>ZREM</code>. Cả hai O(log N), cả hai gọi bao nhiêu lần cũng ra một kết quả.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Hỏi việc tới hạn</span><span class="lz-t">ZRANGE jobs -inf now BYSCORE LIMIT 0 10</span><span class="lz-d">Mỗi giây một lần là quá đủ. Truy vấn là O(log N + 10) bất kể có bao nhiêu triệu việc đã hẹn cho sang năm, vì skip list nhảy thẳng tới mốc <code>now</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Nhận việc một cách nguyên tử</span><span class="lz-t">ZREM trả về 1 cho đúng một worker</span><span class="lz-d">Đây là toàn bộ mẹo. Hai chục worker có thể cùng đọc ra một việc tới hạn, nhưng chỉ một <code>ZREM</code> trả về 1 — số còn lại trả 0 và bỏ qua. Không khoá, không bầu chủ, không phải phối hợp gì.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Rồi giao cho một hàng đợi thật</span><span class="lz-t">RPUSH queue:jobs &lt;jobId&gt;</span><span class="lz-d">Sorted set trả lời "khi nào", còn list hay stream trả lời "ai chạy và hỏng thì sao". Tách bạch hai việc đó chính là thứ ngăn khuôn này biến thành một hàng đợi dựng dở (Bài 4.1).</span></div>
</div>
<pre><code><span class="tok-comment">// Vòng lặp của worker, đầy đủ</span>
setInterval(async () =&gt; {
  const due = await redis.zRange('jobs:scheduled', '-inf', Date.now(),
    { BY: 'SCORE', LIMIT: { offset: 0, count: 50 } });
  for (const jobId of due) {
    <span class="tok-comment">// ZREM chính là phép nhận việc: đúng một worker nhận lại số 1</span>
    if (await redis.zRem('jobs:scheduled', jobId) === 1) {
      await redis.rPush('queue:jobs', jobId);
    }
  }
}, 1000);</code></pre>
<div class="callout warn"><strong>Khe hở giữa "đọc" và "nhận việc" là có thật nhưng vô hại — còn khe hở giữa "nhận việc" và "đẩy" thì không.</strong> Nếu tiến trình chết sau <code>ZREM</code> và trước <code>RPUSH</code>, việc đó biến mất khỏi cả hai cấu trúc và sẽ không bao giờ có ai chạy nó. Trên một bộ hẹn giờ chuyên gửi hoá đơn, đó là một hoá đơn mất. Hai cách chữa: đặt cả hai vào một <code>MULTI</code> để chúng thành một khối nguyên tử (Chương 7), hoặc dùng một script Lua lấy-ra-và-đẩy-vào trong đúng một bước phía máy chủ. Giao dịch là cách dễ hơn và ở đây nó là đủ — đây đúng là loại lỗi mà Chương 7 sinh ra để dẹp.</div>

<h3>Khuôn 3 — Cửa sổ trượt: giới hạn tần suất và phép đếm "một giờ qua"</h3>
<pre><code><span class="tok-comment"># Mỗi đối tượng một khoá; CẢ điểm LẪN phần tử đều là mốc thời gian</span>
NOW=$(date +%s%3N)
redis-cli ZADD rl:user:1042 $NOW "$NOW-a1"
redis-cli ZREMRANGEBYSCORE rl:user:1042 "-inf" "($((NOW-60000))"
redis-cli ZCARD rl:user:1042
redis-cli EXPIRE rl:user:1042 120</code></pre>
<div class="out">(integer) 1
(integer) 0
(integer) 1
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao phần tử không chỉ là mốc thời gian</span><span class="v">Hai yêu cầu trong cùng một mili giây sẽ là cùng một phần tử, và lần <code>ZADD</code> thứ hai sẽ âm thầm đè lên thay vì được đếm. Hãy nối thêm một hậu tố ngẫu nhiên hay một mã yêu cầu — phần tử chỉ cần là duy nhất, nó không bao giờ được đọc tới.</span></div>
  <div class="kv"><span class="k">Quét trước rồi mới đếm</span><span class="v"><code>ZREMRANGEBYSCORE</code> rồi <code>ZCARD</code>, đúng thứ tự đó, trong một pipeline hoặc một <code>MULTI</code>. Đếm trước thì bạn nhận một con số bao gồm cả những yêu cầu đã hết hạn cửa sổ.</span></div>
  <div class="kv"><span class="k">Luôn đặt TTL cho khoá</span><span class="v">Phép quét chỉ gỡ phần tử, không bao giờ gỡ khoá. Một người dùng gửi đúng một yêu cầu rồi biến mất sẽ để lại một khoá gần-như-rỗng mãi mãi. <code>EXPIRE</code> gấp đôi độ dài cửa sổ là hết chuyện (Bài 2.2).</span></div>
  <div class="kv"><span class="k">Giá: một phần tử cho mỗi yêu cầu</span><span class="v">Khoảng 70 byte mỗi cái. Ở mức 100 yêu cầu/phút/người và cửa sổ 1 phút thì là 7 KB mỗi người dùng đang hoạt động — ổn. Ở cửa sổ 24 giờ thì thành 10 MB mỗi người, và lúc đó bạn muốn một bộ đếm cửa sổ cố định (Bài 3.5) hoặc một bitmap.</span></div>
  <div class="kv"><span class="k">Cùng hình dáng, câu hỏi khác</span><span class="v">Bỏ phần kiểm tra giới hạn đi thì đây là "một giờ qua có bao nhiêu sự kiện", "5 phút qua ai đang trực tuyến" (<code>ZRANGEBYSCORE</code> thay cho <code>ZCARD</code>), hay một danh sách hiện diện tự dọn dẹp.</span></div>
</div>

<h3>Khuôn 4 — Một chỉ mục phụ mà cơ sở dữ liệu không có</h3>
<pre><code><span class="tok-comment"># điểm = giá tính bằng xu; phần tử = mã sản phẩm</span>
redis-cli ZADD idx:price 129900 sku:1001 89900 sku:1002 249900 sku:1003 89900 sku:1004
<span class="tok-comment"># "cho tôi mọi thứ từ 800k tới 1,5 triệu, rẻ trước, trang 1"</span>
redis-cli ZRANGE idx:price 80000 150000 BYSCORE LIMIT 0 20
redis-cli ZCOUNT idx:price 80000 150000        <span class="tok-comment"># tổng số kết quả, O(log N)</span>
<span class="tok-comment"># dòng mới-nhất-trước: điểm = created_at tính bằng ms</span>
redis-cli ZADD idx:new 1755949000000 post:9001 1755949600000 post:9002
redis-cli ZRANGE idx:new "+inf" "-inf" BYSCORE REV LIMIT 0 20</code></pre>
<div class="out">(integer) 4
1) "sku:1002"
2) "sku:1004"
3) "sku:1001"
(integer) 3
(integer) 2
1) "post:9002"
2) "post:9001"</div>
<div class="callout"><strong>Ở đây Redis không phải nguồn sự thật — Postgres mới là.</strong> Sorted set chỉ giữ mã và một con số sắp xếp được, truy vấn trả về hai mươi cái mã trong một lời gọi O(log N + 20), rồi bạn lấy hai mươi dòng đó theo khoá chính, việc mà mọi cơ sở dữ liệu đều làm rất nhanh. Thứ bạn vừa gỡ bỏ là phần đắt: phép sắp xếp, phép quét bỏ qua và phép đếm. Cái giá là giờ bạn có hai bản sao của một sự thật, nên chỉ mục phải được cập nhật trong cùng nhánh mã với lệnh ghi, và nó cần một script dựng lại cho lúc hai bên lệch nhau — vì chúng sẽ lệch (Chương 6).</div>

<h3>Khuôn 5 — Gợi ý gõ bằng ZRANGEBYLEX</h3>
<pre><code><span class="tok-comment"># MỌI phần tử đều 0 điểm — chính điều đó làm thứ tự từ điển có nghĩa</span>
redis-cli ZADD ac 0 "hanoi" 0 "hai phong" 0 "ha giang" 0 "ho chi minh" 0 "hue"
redis-cli ZRANGE ac "[ha" "[ha\\xff" BYLEX          <span class="tok-comment"># tiền tố "ha"</span>
redis-cli ZRANGE ac "[h" "[h\\xff" BYLEX LIMIT 0 3
redis-cli ZLEXCOUNT ac "[ha" "[ha\\xff"</code></pre>
<div class="out">(integer) 5
1) "ha giang"
2) "hai phong"
3) "hanoi"
1) "ha giang"
2) "hai phong"
3) "hanoi"
(integer) 3</div>
<div class="pitfall"><strong>Cái bẫy:</strong> <code>ZRANGEBYLEX</code> âm thầm trả về thứ vô nghĩa ngay khi các điểm không còn giống hệt nhau. Skip list sắp theo <em>(điểm, phần tử)</em>, nên một khoảng từ điển chỉ là một lát cắt liền mạch khi mọi điểm bằng nhau — nếu không thì Redis đi qua cấu trúc theo thứ tự điểm và cái "khoảng" bạn nhận về là bất cứ thứ gì tình cờ rơi vào giữa hai vị trí. Không có lỗi và không có cảnh báo; bạn nhận một câu trả lời sai trông rất có lý. Chỉ cần thêm một mục gợi ý gõ với điểm 1 thay vì 0 là kết quả lặng lẽ hỏng cho mọi tiền tố. Hai chi tiết nữa cũng cắn: đầu mút trên của tiền tố là chính tiền tố cộng <code>\\xff</code> (byte lớn nhất), và phép so sánh là theo byte, nên "Hanoi" và "hanoi" nằm cách xa nhau còn dấu tiếng Việt xếp sau mọi chữ cái ASCII. Hãy chuẩn hoá về chữ thường, bỏ dấu để đưa vào phần tử, và giữ dạng hiển thị ở chỗ khác — <code>0 "hanoi:Hà Nội"</code> là mẹo thường dùng.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/sorted-sets/" target="_blank" rel="noopener">
  <span class="lc-ico">🏆</span>
  <span class="lc-body"><span class="lc-title">Sorted sets: các khuôn mẫu chính thức</span><span class="lc-sub">Bản mô tả của chính Redis về bảng xếp hạng, giới hạn tần suất và chỉ mục phụ, kèm đúng những lệnh cần dùng và độ phức tạp đặt cạnh nhau.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Redis use cases</span><span class="lc-sub">Những mô tả ngắn và thành thật về việc Redis được dùng làm gì ở production — đáng lướt qua để nhận ra bài toán nào của bạn vốn đã là một khuôn mẫu có sẵn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng cả năm</span><span class="lc-sub">Bài chấm điểm: một bảng xếp hạng có "những người quanh tôi", một bộ hẹn giờ mà phép nhận việc không thể chạy hai lần, một bộ giới hạn cửa sổ trượt có TTL, và một bộ gợi ý gõ sống sót qua một điểm khác 0 lọt vào.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cả năm khuôn mẫu đều là cùng hai quyết định — cái gì vào điểm, cái gì vào phần tử — và làm đúng hai thứ đó chính là toàn bộ phần thiết kế. <code>ZREM</code> trả về 1 là một phép nhận việc phân tán miễn phí: đúng một worker thắng, không khoá và không phối hợp, và nó là xương sống của bộ hẹn giờ. Và mọi khoá kiểu này đều cần một cái trần: <code>ZREMRANGEBYRANK</code> cho bảng xếp hạng, <code>ZREMRANGEBYSCORE</code> cộng <code>EXPIRE</code> cho cửa sổ, một script dựng lại cho chỉ mục — một sorted set không có trần chỉ là một chỗ rò bộ nhớ chậm hơn.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Choosing between them (and the geo bonus)|||4.5 — Chọn giữa ba cấu trúc (và món quà geo)',
      slug: 'rd-4-5-chon-cau-truc',
      type: 'LESSON',
      description: 'Cùng một bài toán dựng bằng list, set và sorted set rồi đo bộ nhớ thật; bảng quyết định theo câu hỏi chứ không theo cảm giác; giá của việc chọn sai; và GEOADD hoá ra chỉ là một sorted set đội lốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Choosing between them (and the geo bonus)</h2>
<p class="lead">Lists, sets and sorted sets overlap enough that almost any collection problem can be forced into any of them. The question is never "can it work" — it is what the wrong choice costs, and the cost is usually invisible until the data gets big. So here is the same problem built three ways, measured.</p>

<h3>One problem, three structures, real numbers</h3>
<pre><code><span class="tok-comment"># "the last 50,000 events for a user" — built three ways, same data</span>
redis-cli DEL ev:list ev:set ev:zset &gt;/dev/null
python3 -c "
for i in range(50_000):
    print(f'RPUSH ev:list evt:{i}')
    print(f'SADD  ev:set  evt:{i}')
    print(f'ZADD  ev:zset {1755900000+i} evt:{i}')
" | redis-cli --pipe &gt;/dev/null
for k in ev:list ev:set ev:zset; do
  printf "%-9s %-10s %s bytes\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done</code></pre>
<div class="out">ev:list   quicklist  568424 bytes
ev:set    hashtable  2884152 bytes
ev:zset   skiplist   5320248 bytes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">List: ~11 bytes per element</span><span class="v">A quicklist packs many elements into each listpack node, so the per-element overhead is a couple of bytes on top of the string itself. Nothing else comes close.</span></div>
  <div class="kv"><span class="k">Set: ~58 bytes per element</span><span class="v">5× the list. You are paying for the hash table that makes <code>SISMEMBER</code> O(1) — a <code>dictEntry</code>, a pointer and an allocation header per member.</span></div>
  <div class="kv"><span class="k">Sorted set: ~106 bytes per element</span><span class="v">9× the list, 2× the set. You are paying for <em>both</em> internal structures: the hash table for <code>ZSCORE</code> plus the skip list nodes with their level pointers and spans.</span></div>
  <div class="kv"><span class="k">The ratio is roughly 1 : 5 : 9</span><span class="v">Memorise that shape, not the exact bytes — it shifts with member length and encoding, but the ordering never does. Every capability has a price and this is it.</span></div>
  <div class="kv"><span class="k">Small collections invert this</span><span class="v">Under the listpack thresholds all three cost roughly the same, because all three are a flat block. The gap only opens after conversion — which is why "it was fine in staging" is such a common sentence.</span></div>
</div>
<div class="callout"><strong>Nine times the memory is not an argument against sorted sets.</strong> 5 MB for fifty thousand events is nothing, and being able to ask "how many in the last hour" and "what rank is this" in O(log N) is worth far more than 4 MB. The argument is against using a sorted set <em>when you never ask a sorted-set question</em> — a queue with a timestamp score that you only ever <code>ZPOPMIN</code> from is a list wearing a costume, and at fifty million elements the costume costs 5 GB.</div>

<h3>Choose by the question, not by the shape of the data</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Do you need duplicates?</span><span class="lz-t">yes → list (or stream)</span><span class="lz-d">Sets and sorted sets deduplicate by definition. Pushing the same event ID twice into a set silently loses one — which is a feature for idempotency and a data-loss bug for a log.</span></div>
  <div class="lz-step"><span class="lz-k">Do you ask "is X in here?"</span><span class="lz-t">yes → set or sorted set</span><span class="lz-d">A list has no membership test that is not O(N). If this question appears anywhere on a hot path, the list is already the wrong answer.</span></div>
  <div class="lz-step"><span class="lz-k">Do you need an order other than arrival?</span><span class="lz-t">yes → sorted set</span><span class="lz-d">By score, by rank, by range, by "top N", by time window. This is the only structure of the three that can answer any of those.</span></div>
  <div class="lz-step"><span class="lz-k">Do you only push one end and pop the other?</span><span class="lz-t">yes → list</span><span class="lz-d">Cheapest memory, O(1) at both ends, and <code>BLPOP</code>/<code>BLMOVE</code> for free. Do not pay for capabilities you will not use.</span></div>
  <div class="lz-step"><span class="lz-k">Do you compare two groups?</span><span class="lz-t">yes → set</span><span class="lz-d"><code>SINTER</code>, <code>SDIFF</code>, <code>SUNION</code>, <code>SINTERCARD</code>. Sorted sets have <code>ZINTERSTORE</code> too, but if you do not need the scores you are paying 2× memory for nothing.</span></div>
</div>
<pre><code><span class="tok-comment"># The same four questions, priced</span>
redis-cli DEBUG SLEEP 0 &gt;/dev/null              <span class="tok-comment"># (server is idle)</span>
time redis-cli SISMEMBER ev:set evt:49999 &gt;/dev/null      <span class="tok-comment"># O(1)</span>
time redis-cli ZSCORE   ev:zset evt:49999 &gt;/dev/null      <span class="tok-comment"># O(1)</span>
time redis-cli ZRANK    ev:zset evt:49999 &gt;/dev/null      <span class="tok-comment"># O(log N)</span>
time redis-cli LPOS     ev:list evt:49999 &gt;/dev/null      <span class="tok-comment"># O(N) — the trap</span></code></pre>
<div class="out">real	0m0.003s
real	0m0.003s
real	0m0.004s
real	0m0.019s</div>
<div class="callout warn"><strong>19 milliseconds is not slow — it is a server-wide outage in miniature.</strong> Redis is single-threaded (Lesson 1.1), so that one <code>LPOS</code> stopped every other client for 19 ms. At a thousand of those per second the server is doing nothing else. This is the shape of nearly every real Redis incident: not a command that fails, but a command that is O(N) on data that grew.</div>

<h3>The decision table, condensed</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job queue, chat backlog, capped feed</span><span class="v"><strong>List.</strong> Duplicates allowed, arrival order, O(1) ends, blocking pops, <code>LTRIM</code> for a bound.</span></div>
  <div class="kv"><span class="k">Tags, permissions, blocklists, "seen" checks</span><span class="v"><strong>Set.</strong> Uniqueness for free, O(1) membership, and set algebra your database cannot match.</span></div>
  <div class="kv"><span class="k">Leaderboards, schedulers, rate limits, secondary indexes</span><span class="v"><strong>Sorted set.</strong> Anything with "top", "rank", "between", "since" or "until" in the requirement.</span></div>
  <div class="kv"><span class="k">Event log you replay, with consumers and acks</span><span class="v"><strong>Stream</strong> (Chapter 8). If you are adding acknowledgements and retries to a list, stop — that structure already exists.</span></div>
  <div class="kv"><span class="k">Counting uniques at huge scale</span><span class="v"><strong>HyperLogLog</strong> (Lesson 3.4). A set of 10 million IPs is 580 MB; an HLL is 12 KB with 0.81% error. Choose by whether you need the members or just the count.</span></div>
  <div class="kv"><span class="k">One object with fields you update individually</span><span class="v"><strong>Hash</strong> (Chapter 5). Not a JSON string you <code>GET</code>, mutate and <code>SET</code> back — that pattern is a lost write waiting to happen.</span></div>
</div>

<h3>The geo bonus: a sorted set in disguise</h3>
<pre><code>redis-cli GEOADD vn 105.8542 21.0285 "hanoi" 106.6822 10.7626 "hcmc" 108.2208 16.0678 "danang"
redis-cli OBJECT ENCODING vn                     <span class="tok-comment"># ← look at this</span>
redis-cli TYPE vn
redis-cli ZSCORE vn hanoi                        <span class="tok-comment"># the raw geohash</span>
redis-cli GEODIST vn hanoi hcmc km
redis-cli GEOSEARCH vn FROMLONLAT 106.0 16.0 BYRADIUS 400 km ASC WITHDIST
redis-cli GEOSEARCH vn FROMMEMBER hanoi BYBOX 900 900 km ASC COUNT 2</code></pre>
<div class="out">(integer) 3
"skiplist"
zset
"3981230787217013"
"1140.4899"
1) 1) "danang"
   2) "224.4431"
1) "hanoi"
2) "danang"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">There is no geo type</span><span class="lz-lnote"><code>TYPE</code> says <code>zset</code> and <code>OBJECT ENCODING</code> says <code>skiplist</code>, because a geo key <em>is</em> a sorted set. Every Z-command works on it: <code>ZCARD vn</code> counts your locations, <code>ZREM vn hanoi</code> deletes one, <code>ZRANGE</code> lists them.</span></div>
  <div class="lz-layer"><span class="lz-lname">The score is a 52-bit geohash</span><span class="lz-lnote">Longitude and latitude are interleaved bit by bit into one integer, so nearby places get nearby scores. That is the whole idea: a 2-D proximity search becomes a handful of 1-D range scans on a structure Redis already has. 52 bits fits inside the 2^53 double budget exactly — not a coincidence.</span></div>
  <div class="lz-layer"><span class="lz-lname">GEOSEARCH replaced GEORADIUS</span><span class="lz-lnote">Redis 6.2 unified the old <code>GEORADIUS</code>/<code>GEORADIUSBYMEMBER</code> family into <code>GEOSEARCH</code> (read) and <code>GEOSEARCHSTORE</code> (write), with <code>FROMLONLAT</code>/<code>FROMMEMBER</code> and <code>BYRADIUS</code>/<code>BYBOX</code>. The old commands are deprecated but still work.</span></div>
</div>
<div class="pitfall"><strong>Pitfall:</strong> geo keys have no TTL per member and no way to expire a single location, exactly like any other sorted set — a driver-tracking key accumulates every driver who has ever logged in unless you sweep it yourself. Sweep with a companion sorted set scored by last-seen time: <code>ZADD seen &lt;nowMs&gt; driver:42</code> on every ping, then periodically <code>ZRANGE seen -inf &lt;cutoff&gt; BYSCORE</code> and <code>ZREM</code> those members from <em>both</em> keys. Two other edges: latitude is limited to ±85.05112878° (the Mercator projection cannot represent the poles), and <code>GEOSEARCH</code> with a large radius on a large key is O(N + log M) — it is a range scan, not magic, so a 5000 km radius over a million points is a blocking operation. Bound the radius, add <code>COUNT</code>, and remember that <code>COUNT</code> without <code>ANY</code> still computes the full result before truncating it.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Redis data types: the full index</span><span class="lc-sub">Every type in one page with links to its command reference. The right page to keep open while you are deciding what to model something as.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/geosearch/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">GEOSEARCH</span><span class="lc-sub">The unified 6.2 command: <code>FROMLONLAT</code> vs <code>FROMMEMBER</code>, <code>BYRADIUS</code> vs <code>BYBOX</code>, the <code>WITHDIST</code>/<code>WITHCOORD</code>/<code>WITHHASH</code> outputs, and the complexity you should read before shipping it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the right structure</span><span class="lc-sub">Graded exercises: eight requirements, choose a structure for each and justify it; then measure the memory difference yourself and find the one case where the expensive structure is the right call.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> The memory ratio is roughly 1 : 5 : 9 for list : set : sorted set on the same members — every extra capability is paid for, so do not buy one you never use. Choose by the <em>question</em> you will ask, not by what the data looks like: duplicates → list, membership → set, any kind of order or range → sorted set, acknowledgements → stream. And a geo key is literally a sorted set with a geohash for a score, which means every Z-command works on it, every sorted-set pitfall applies to it, and it needs the same self-imposed bound as any other unbounded key.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Chọn giữa ba cấu trúc (và món quà geo)</h2>
<p class="lead">List, set và sorted set giẫm lên nhau đủ nhiều để gần như bài toán tập hợp nào cũng có thể nhét vừa vào bất cứ cái nào. Câu hỏi không bao giờ là "có chạy được không" — mà là chọn sai thì tốn gì, và cái tốn ấy thường vô hình cho tới khi dữ liệu lớn lên. Nên đây là cùng một bài toán dựng ba kiểu, có đo đạc.</p>

<h3>Một bài toán, ba cấu trúc, số liệu thật</h3>
<pre><code><span class="tok-comment"># "50.000 sự kiện gần nhất của một người dùng" — dựng ba kiểu, cùng dữ liệu</span>
redis-cli DEL ev:list ev:set ev:zset &gt;/dev/null
python3 -c "
for i in range(50_000):
    print(f'RPUSH ev:list evt:{i}')
    print(f'SADD  ev:set  evt:{i}')
    print(f'ZADD  ev:zset {1755900000+i} evt:{i}')
" | redis-cli --pipe &gt;/dev/null
for k in ev:list ev:set ev:zset; do
  printf "%-9s %-10s %s bytes\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done</code></pre>
<div class="out">ev:list   quicklist  568424 bytes
ev:set    hashtable  2884152 bytes
ev:zset   skiplist   5320248 bytes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">List: ~11 byte mỗi phần tử</span><span class="v">Quicklist nhồi nhiều phần tử vào mỗi nút listpack, nên chi phí phụ trên mỗi phần tử chỉ là vài byte cộng thêm vào chính chuỗi đó. Không có cấu trúc nào đến gần được.</span></div>
  <div class="kv"><span class="k">Set: ~58 byte mỗi phần tử</span><span class="v">Gấp 5 lần list. Bạn đang trả tiền cho cái bảng băm khiến <code>SISMEMBER</code> thành O(1) — một <code>dictEntry</code>, một con trỏ và một phần đầu cấp phát cho mỗi phần tử.</span></div>
  <div class="kv"><span class="k">Sorted set: ~106 byte mỗi phần tử</span><span class="v">Gấp 9 lần list, gấp 2 lần set. Bạn đang trả tiền cho <em>cả hai</em> cấu trúc bên trong: bảng băm cho <code>ZSCORE</code> cộng các nút skip list với con trỏ tầng và nhịp nhảy của chúng.</span></div>
  <div class="kv"><span class="k">Tỉ lệ vào khoảng 1 : 5 : 9</span><span class="v">Hãy nhớ cái hình dạng đó, đừng nhớ con số chính xác — nó xê dịch theo độ dài phần tử và kiểu mã hoá, nhưng thứ tự thì không bao giờ đổi. Mọi năng lực đều có giá và đây chính là giá.</span></div>
  <div class="kv"><span class="k">Tập nhỏ thì đảo ngược chuyện này</span><span class="v">Dưới ngưỡng listpack thì cả ba tốn xấp xỉ như nhau, vì cả ba đều là một khối phẳng. Khoảng cách chỉ mở ra sau khi chuyển kiểu — đó là lý do câu "ở staging nó vẫn ổn mà" phổ biến đến thế.</span></div>
</div>
<div class="callout"><strong>Gấp chín lần bộ nhớ không phải lý lẽ chống lại sorted set.</strong> 5 MB cho năm mươi nghìn sự kiện chẳng là gì, và việc hỏi được "một giờ qua có bao nhiêu cái" cùng "cái này hạng mấy" trong O(log N) đáng giá hơn 4 MB rất nhiều. Lý lẽ ở đây là chống lại việc dùng sorted set <em>khi bạn không bao giờ hỏi một câu hỏi kiểu sorted set</em> — một hàng đợi có điểm là mốc thời gian mà bạn chỉ toàn <code>ZPOPMIN</code> từ đó ra thì chỉ là một cái list mặc áo hoá trang, và ở năm mươi triệu phần tử thì bộ áo ấy tốn 5 GB.</div>

<h3>Chọn theo câu hỏi, đừng chọn theo hình dạng dữ liệu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Có cần phần tử trùng nhau không?</span><span class="lz-t">có → list (hoặc stream)</span><span class="lz-d">Set và sorted set khử trùng theo định nghĩa. Đẩy cùng một mã sự kiện hai lần vào một set là âm thầm mất một cái — đó là tính năng cho việc chống trùng và là lỗi mất dữ liệu cho một cuốn nhật ký.</span></div>
  <div class="lz-step"><span class="lz-k">Có hỏi "X có ở trong này không?" không?</span><span class="lz-t">có → set hoặc sorted set</span><span class="lz-d">List không có phép kiểm tra thành viên nào không phải O(N). Nếu câu hỏi này xuất hiện ở bất kỳ đâu trên đường đi nóng thì list đã là câu trả lời sai rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Có cần thứ tự khác thứ tự tới không?</span><span class="lz-t">có → sorted set</span><span class="lz-d">Theo điểm, theo hạng, theo khoảng, theo "top N", theo cửa sổ thời gian. Đây là cấu trúc duy nhất trong ba cái trả lời được bất kỳ câu nào trong số đó.</span></div>
  <div class="lz-step"><span class="lz-k">Chỉ đẩy một đầu và lấy đầu kia thôi à?</span><span class="lz-t">đúng → list</span><span class="lz-d">Bộ nhớ rẻ nhất, O(1) ở cả hai đầu, và <code>BLPOP</code>/<code>BLMOVE</code> miễn phí. Đừng trả tiền cho những năng lực bạn sẽ không dùng.</span></div>
  <div class="lz-step"><span class="lz-k">Có so sánh hai nhóm với nhau không?</span><span class="lz-t">có → set</span><span class="lz-d"><code>SINTER</code>, <code>SDIFF</code>, <code>SUNION</code>, <code>SINTERCARD</code>. Sorted set cũng có <code>ZINTERSTORE</code>, nhưng nếu bạn không cần tới điểm thì bạn đang trả gấp đôi bộ nhớ để lấy về con số không.</span></div>
</div>
<pre><code><span class="tok-comment"># Cùng bốn câu hỏi, có bảng giá</span>
redis-cli DEBUG SLEEP 0 &gt;/dev/null              <span class="tok-comment"># (máy chủ đang rảnh)</span>
time redis-cli SISMEMBER ev:set evt:49999 &gt;/dev/null      <span class="tok-comment"># O(1)</span>
time redis-cli ZSCORE   ev:zset evt:49999 &gt;/dev/null      <span class="tok-comment"># O(1)</span>
time redis-cli ZRANK    ev:zset evt:49999 &gt;/dev/null      <span class="tok-comment"># O(log N)</span>
time redis-cli LPOS     ev:list evt:49999 &gt;/dev/null      <span class="tok-comment"># O(N) — cái bẫy</span></code></pre>
<div class="out">real	0m0.003s
real	0m0.003s
real	0m0.004s
real	0m0.019s</div>
<div class="callout warn"><strong>19 mili giây không phải là chậm — nó là một sự cố toàn máy chủ thu nhỏ.</strong> Redis đơn luồng (Bài 1.1), nên đúng một lệnh <code>LPOS</code> ấy đã chặn mọi khách khác 19 ms. Ở mức một nghìn lệnh như thế mỗi giây thì máy chủ không làm được gì khác. Đây là hình dáng của gần như mọi sự cố Redis thật: không phải một lệnh báo lỗi, mà một lệnh O(N) trên dữ liệu đã lớn lên.</div>

<h3>Bảng quyết định, rút gọn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hàng đợi việc, tồn đọng tin nhắn, dòng có trần</span><span class="v"><strong>List.</strong> Cho phép trùng, theo thứ tự tới, O(1) hai đầu, lấy ra kiểu chặn, <code>LTRIM</code> để có trần.</span></div>
  <div class="kv"><span class="k">Thẻ, quyền, danh sách chặn, phép kiểm "đã thấy"</span><span class="v"><strong>Set.</strong> Tính duy nhất miễn phí, kiểm tra thành viên O(1), và đại số tập hợp mà cơ sở dữ liệu của bạn không sánh được.</span></div>
  <div class="kv"><span class="k">Bảng xếp hạng, hẹn giờ, giới hạn tần suất, chỉ mục phụ</span><span class="v"><strong>Sorted set.</strong> Bất cứ thứ gì có chữ "top", "hạng", "giữa", "kể từ" hay "cho tới" trong yêu cầu.</span></div>
  <div class="kv"><span class="k">Nhật ký sự kiện có phát lại, có bên tiêu thụ và xác nhận</span><span class="v"><strong>Stream</strong> (Chương 8). Nếu bạn đang thêm xác nhận và thử lại vào một list thì hãy dừng — cấu trúc đó đã có sẵn rồi.</span></div>
  <div class="kv"><span class="k">Đếm số lượng duy nhất ở quy mô khổng lồ</span><span class="v"><strong>HyperLogLog</strong> (Bài 3.4). Một set 10 triệu địa chỉ IP là 580 MB; một HLL là 12 KB với sai số 0,81%. Chọn theo việc bạn cần các phần tử hay chỉ cần con số đếm.</span></div>
  <div class="kv"><span class="k">Một đối tượng có các trường bạn cập nhật riêng lẻ</span><span class="v"><strong>Hash</strong> (Chương 5). Không phải một chuỗi JSON mà bạn <code>GET</code>, sửa rồi <code>SET</code> ngược lại — khuôn đó là một lần ghi bị mất đang chờ xảy ra.</span></div>
</div>

<h3>Món quà geo: một sorted set đội lốt</h3>
<pre><code>redis-cli GEOADD vn 105.8542 21.0285 "hanoi" 106.6822 10.7626 "hcmc" 108.2208 16.0678 "danang"
redis-cli OBJECT ENCODING vn                     <span class="tok-comment"># ← nhìn dòng này</span>
redis-cli TYPE vn
redis-cli ZSCORE vn hanoi                        <span class="tok-comment"># mã geohash thô</span>
redis-cli GEODIST vn hanoi hcmc km
redis-cli GEOSEARCH vn FROMLONLAT 106.0 16.0 BYRADIUS 400 km ASC WITHDIST
redis-cli GEOSEARCH vn FROMMEMBER hanoi BYBOX 900 900 km ASC COUNT 2</code></pre>
<div class="out">(integer) 3
"skiplist"
zset
"3981230787217013"
"1140.4899"
1) 1) "danang"
   2) "224.4431"
1) "hanoi"
2) "danang"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không hề có kiểu geo</span><span class="lz-lnote"><code>TYPE</code> nói <code>zset</code> và <code>OBJECT ENCODING</code> nói <code>skiplist</code>, vì một khoá geo <em>chính là</em> một sorted set. Mọi lệnh Z đều chạy trên nó: <code>ZCARD vn</code> đếm số địa điểm, <code>ZREM vn hanoi</code> xoá một cái, <code>ZRANGE</code> liệt kê chúng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Điểm số là một geohash 52 bit</span><span class="lz-lnote">Kinh độ và vĩ độ được đan xen từng bit thành một số nguyên duy nhất, nên những nơi gần nhau có điểm gần nhau. Toàn bộ ý tưởng nằm ở đó: một phép tìm lân cận trong không gian 2 chiều trở thành vài lượt quét khoảng trong không gian 1 chiều, trên đúng cấu trúc mà Redis đã có sẵn. 52 bit lọt vừa khít vào hạn mức 2^53 của double — không phải trùng hợp.</span></div>
  <div class="lz-layer"><span class="lz-lname">GEOSEARCH đã thay GEORADIUS</span><span class="lz-lnote">Redis 6.2 gộp họ <code>GEORADIUS</code>/<code>GEORADIUSBYMEMBER</code> cũ thành <code>GEOSEARCH</code> (đọc) và <code>GEOSEARCHSTORE</code> (ghi), với <code>FROMLONLAT</code>/<code>FROMMEMBER</code> và <code>BYRADIUS</code>/<code>BYBOX</code>. Các lệnh cũ đã bị đánh dấu lỗi thời nhưng vẫn chạy.</span></div>
</div>
<div class="pitfall"><strong>Cái bẫy:</strong> khoá geo không có TTL cho từng phần tử và không có cách nào cho một địa điểm hết hạn, hệt như mọi sorted set khác — một khoá theo dõi tài xế sẽ tích luỹ mọi tài xế từng đăng nhập trừ khi bạn tự quét dọn. Hãy quét bằng một sorted set đi kèm chấm điểm theo lần-thấy-cuối: <code>ZADD seen &lt;nowMs&gt; driver:42</code> ở mỗi nhịp báo, rồi định kỳ <code>ZRANGE seen -inf &lt;mốc&gt; BYSCORE</code> và <code>ZREM</code> những phần tử đó khỏi <em>cả hai</em> khoá. Hai cạnh sắc nữa: vĩ độ bị giới hạn trong ±85,05112878° (phép chiếu Mercator không biểu diễn được hai cực), và <code>GEOSEARCH</code> với bán kính lớn trên khoá lớn là O(N + log M) — nó là một lượt quét khoảng chứ không phải phép màu, nên bán kính 5000 km trên một triệu điểm là một phép chặn. Hãy chặn bán kính lại, thêm <code>COUNT</code>, và nhớ rằng <code>COUNT</code> mà không kèm <code>ANY</code> vẫn tính ra toàn bộ kết quả rồi mới cắt bớt.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Redis data types: mục lục đầy đủ</span><span class="lc-sub">Mọi kiểu dữ liệu trong một trang kèm liên kết tới tài liệu lệnh của nó. Đúng trang nên mở sẵn trong lúc bạn đang quyết định mô hình hoá thứ gì đó thành cái gì.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/geosearch/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">GEOSEARCH</span><span class="lc-sub">Lệnh hợp nhất của bản 6.2: <code>FROMLONLAT</code> với <code>FROMMEMBER</code>, <code>BYRADIUS</code> với <code>BYBOX</code>, các đầu ra <code>WITHDIST</code>/<code>WITHCOORD</code>/<code>WITHHASH</code>, và độ phức tạp bạn nên đọc trước khi đưa lên chạy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chọn đúng cấu trúc</span><span class="lc-sub">Bài chấm điểm: tám yêu cầu, chọn một cấu trúc cho mỗi cái và giải thích vì sao; rồi tự đo khoảng cách bộ nhớ và tìm ra một trường hợp mà cấu trúc đắt tiền lại là lựa chọn đúng.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Tỉ lệ bộ nhớ vào khoảng 1 : 5 : 9 cho list : set : sorted set trên cùng những phần tử — mọi năng lực thêm vào đều phải trả tiền, nên đừng mua thứ bạn không bao giờ dùng. Hãy chọn theo <em>câu hỏi</em> bạn sẽ hỏi, đừng chọn theo hình dạng dữ liệu: cần trùng → list, cần kiểm tra thành viên → set, cần bất cứ thứ tự hay khoảng nào → sorted set, cần xác nhận → stream. Và một khoá geo đúng nghĩa đen là một sorted set với geohash làm điểm, nghĩa là mọi lệnh Z đều chạy trên nó, mọi cái bẫy của sorted set đều áp cho nó, và nó cần đúng cái trần tự đặt ra như mọi khoá không có trần khác.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: lists, sets and sorted sets|||4.6 — Trắc nghiệm: list, set và sorted set',
      slug: 'rd-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về độ phức tạp thật của list, cái gì bị chặn khi BLPOP chặn, giá trị trả về của SADD, việc chuyển kiểu một chiều của set, cờ GT của ZADD, trần 2^53 của điểm số, và điều kiện để ZRANGEBYLEX có nghĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the three collection types. Four of them are complexity questions — and in a single-threaded server, a complexity mistake is not a slow query, it is an outage that arrives three months after you shipped it.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: which list commands are O(N) (4.1), why a set's encoding never converts back (4.2), what <code>ZADD GT</code> replaces (4.3), and the one condition <code>ZRANGEBYLEX</code> needs to be meaningful (4.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về ba kiểu tập hợp. Bốn câu trong đó là câu hỏi về độ phức tạp — và trên một máy chủ đơn luồng, sai lầm về độ phức tạp không phải một truy vấn chậm, nó là một sự cố ập tới ba tháng sau ngày bạn đưa mã lên chạy.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: lệnh list nào là O(N) (4.1), vì sao kiểu mã hoá của set không bao giờ chuyển ngược (4.2), <code>ZADD GT</code> thay thế cho cái gì (4.3), và điều kiện duy nhất để <code>ZRANGEBYLEX</code> có nghĩa (4.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A list holds 5 million elements. Which of these commands is the one that will stall the whole server?|||Một list chứa 5 triệu phần tử. Lệnh nào trong số này là lệnh sẽ làm treo cả máy chủ?',
            options: [
              'LPUSH mylist x — pushing is O(1) but the list has to be reallocated|||LPUSH mylist x — đẩy vào là O(1) nhưng list phải được cấp phát lại',
              'LLEN mylist — counting 5 million elements takes 5 million steps|||LLEN mylist — đếm 5 triệu phần tử tốn 5 triệu bước',
              'LINDEX mylist 2500000 — it walks from the nearest end, so half the list|||LINDEX mylist 2500000 — nó đi bộ từ đầu gần nhất, tức là nửa cái list',
              'RPOP mylist — popping from the tail requires traversing to the tail|||RPOP mylist — lấy ra từ đuôi thì phải đi hết tới đuôi',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Twenty workers call `BLPOP jobs 0`. What is actually blocked while they wait?|||Hai mươi worker cùng gọi `BLPOP jobs 0`. Trong lúc chúng chờ thì cái gì thật sự bị chặn?',
            options: [
              'The whole server — Redis is single-threaded, so a blocking command blocks everything|||Cả máy chủ — Redis đơn luồng, nên một lệnh chặn sẽ chặn mọi thứ',
              'Only those twenty connections; the server registers them against the key and keeps serving everyone else at full speed|||Chỉ hai mươi kết nối đó; máy chủ ghi tên chúng vào khoá rồi vẫn phục vụ mọi người khác với tốc độ đầy đủ',
              'Nothing — BLPOP polls the key every 100ms from the client side|||Không gì cả — BLPOP hỏi vòng cái khoá mỗi 100ms từ phía khách',
              'The key — no other client can write to `jobs` until a pop returns|||Cái khoá — không khách nào khác ghi được vào `jobs` cho tới khi có một lượt lấy ra xong',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does the reliable-queue pattern use `LMOVE queue processing:w1` instead of a plain `LPOP queue`?|||Vì sao khuôn hàng-đợi-tin-cậy dùng `LMOVE queue processing:w1` thay vì một lệnh `LPOP queue` bình thường?',
            options: [
              'LMOVE is faster — one command instead of a pop plus a push|||LMOVE nhanh hơn — một lệnh thay vì một lượt lấy ra cộng một lượt đẩy vào',
              'LPOP is not atomic when several workers call it at the same time|||LPOP không nguyên tử khi nhiều worker cùng gọi một lúc',
              'LMOVE lets several workers share one job so it gets done twice for safety|||LMOVE cho phép nhiều worker chia nhau một việc để nó được làm hai lần cho chắc',
              'If the worker dies after an LPOP the job is gone forever; with LMOVE it is still visible in the processing list and a sweeper can requeue it|||Nếu worker chết sau LPOP thì việc mất luôn; với LMOVE nó vẫn nằm thấy được trong list xử lý và một tiến trình quét có thể đẩy nó lại',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'You run `SADD seen evt_1 evt_2 evt_1` on an empty set. What does it return, and what makes that return value useful?|||Bạn chạy `SADD seen evt_1 evt_2 evt_1` lên một set rỗng. Nó trả về gì, và điều gì làm giá trị trả về đó hữu ích?',
            options: [
              '2 — it counts only members that were NEW, so the return value is a free "have I seen this before?" check|||2 — nó chỉ đếm những phần tử MỚI, nên giá trị trả về là một phép kiểm "đã thấy cái này chưa?" miễn phí',
              '3 — it counts the arguments you sent, which is how you verify the command arrived intact|||3 — nó đếm số tham số bạn gửi lên, đó là cách bạn xác minh lệnh tới nơi nguyên vẹn',
              '1 — it returns 1 for success and 0 for failure, like SET|||1 — nó trả 1 nếu thành công và 0 nếu thất bại, giống SET',
              'An error — SADD rejects duplicate members in the same call|||Một lỗi — SADD từ chối phần tử trùng nhau trong cùng một lời gọi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A set grows past 128 members and becomes a `hashtable`. You then remove members until only 3 are left. What is its encoding now?|||Một set vượt quá 128 phần tử và thành `hashtable`. Sau đó bạn xoá bớt tới khi chỉ còn 3 phần tử. Giờ kiểu mã hoá của nó là gì?',
            options: [
              'listpack — Redis re-encodes on every write and picks the cheapest form|||listpack — Redis mã hoá lại ở mỗi lần ghi và chọn dạng rẻ nhất',
              'intset — a 3-member set always uses the cheapest encoding available|||intset — một set 3 phần tử luôn dùng kiểu mã hoá rẻ nhất có được',
              'listpack, but only after the next background rehash cycle|||listpack, nhưng chỉ sau chu kỳ băm lại chạy nền tiếp theo',
              'hashtable — the conversion is one-way and permanent, so a million briefly-large sets pay hashtable overhead forever|||hashtable — việc chuyển kiểu là một chiều và vĩnh viễn, nên một triệu set từng thoáng lớn sẽ trả chi phí hashtable mãi mãi',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Two app servers finish a game at the same instant and both want to record a high score. What does `ZADD board GT CH <score> <player>` remove the need for?|||Hai máy chủ ứng dụng cùng kết thúc một ván ở đúng một khoảnh khắc và cả hai đều muốn ghi lại điểm cao. `ZADD board GT CH <điểm> <người chơi>` gỡ bỏ nhu cầu dùng cái gì?',
            options: [
              'The TTL on the leaderboard key — GT keeps it alive automatically|||TTL trên khoá bảng xếp hạng — GT tự động giữ nó sống',
              'A read-compare-write cycle in the application, which races: both servers read the old score, both decide theirs is higher, and the LOWER one wins because it wrote last|||Một chu trình đọc-so-ghi trong ứng dụng, vốn có đua: cả hai máy chủ đọc điểm cũ, cả hai kết luận điểm mình cao hơn, và bên THẤP hơn thắng vì nó ghi sau',
              'The sorted set itself — GT lets you use a plain string key instead|||Chính cái sorted set — GT cho phép bạn dùng một khoá chuỗi thường thay thế',
              'The need to trim the leaderboard, since GT never adds new members|||Nhu cầu cắt bớt bảng xếp hạng, vì GT không bao giờ thêm phần tử mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You store a 64-bit snowflake ID as a sorted-set score. What happens?|||Bạn lưu một ID snowflake 64 bit làm điểm số của sorted set. Chuyện gì xảy ra?',
            options: [
              'Redis returns an error — scores must fit in a 32-bit integer|||Redis trả về lỗi — điểm số phải vừa trong một số nguyên 32 bit',
              'It works exactly — Redis stores scores as 64-bit integers when they have no fractional part|||Nó chạy chính xác — Redis lưu điểm dạng số nguyên 64 bit khi chúng không có phần thập phân',
              'It is silently rounded: scores are IEEE-754 doubles, exact only to 2^53, so two different IDs can collapse onto the same score with no error and no warning|||Nó bị làm tròn âm thầm: điểm là double IEEE-754, chỉ chính xác tới 2^53, nên hai ID khác nhau có thể sập vào cùng một điểm mà không lỗi, không cảnh báo',
              'The ID is stored as a string, so it sorts lexicographically instead of numerically|||ID được lưu dạng chuỗi, nên nó sắp theo thứ tự từ điển thay vì theo số',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Your autocomplete uses `ZRANGE ac "[ha" "[ha\\xff" BYLEX`. A colleague adds one entry with score 1 instead of 0. What happens?|||Bộ gợi ý gõ của bạn dùng `ZRANGE ac "[ha" "[ha\\xff" BYLEX`. Một đồng nghiệp thêm một mục với điểm 1 thay vì 0. Chuyện gì xảy ra?',
            options: [
              'Results quietly become wrong for every prefix: the skip list is ordered by (score, member), so a lex range is only a contiguous slice when every score is identical — no error, no warning|||Kết quả lặng lẽ sai cho mọi tiền tố: skip list sắp theo (điểm, phần tử), nên một khoảng từ điển chỉ là lát cắt liền mạch khi mọi điểm giống hệt nhau — không lỗi, không cảnh báo',
              'Only that one entry is misplaced; every other prefix keeps working correctly|||Chỉ mỗi mục đó bị đặt sai chỗ; mọi tiền tố khác vẫn chạy đúng',
              'Redis returns an error because BYLEX requires all scores to be zero|||Redis trả về lỗi vì BYLEX đòi mọi điểm phải bằng 0',
              'Nothing — BYLEX ignores scores entirely and sorts purely by member|||Không gì cả — BYLEX bỏ qua điểm hoàn toàn và sắp thuần theo phần tử',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
