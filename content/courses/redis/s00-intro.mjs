/**
 * Redis — Mục 0: Redis giải quyết gì, và cài đặt.
 * Bài toán · cài trong hai mươi giây · năm phút đầu tiên · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Section 0 — What Redis solves, and getting set up|||Mục 0 — Redis giải quyết gì, và cài đặt',
  description: 'Vì sao một cơ sở dữ liệu sống trong RAM lại đáng có, Redis KHÔNG phải cái gì, cài trong hai mươi giây bằng Docker hoặc trực tiếp, năm phút đầu tiên với redis-cli, và bản đồ mười ba chương phía trước.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Redis solves|||0.1 — Redis giải quyết gì',
      slug: 'rd-0-1-van-de',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Con số làm Redis đáng tồn tại, ba việc nó làm tốt hơn mọi thứ khác, ba việc nó KHÔNG nên làm, nó khác PostgreSQL và Memcached ở đâu, và bản đồ mười ba chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What Redis solves</h2>
<p class="lead">Every database eventually hits the same wall: the disk. Redis does not have that wall, because it keeps everything in memory — and that single decision changes what is worth building. A leaderboard over ten million players, a rate limiter that survives a traffic spike, a session store that answers in a tenth of a millisecond: all of these are ordinary in Redis and awkward everywhere else.</p>

<h3>The number that justifies its existence</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">CPU L1 cache</span><span class="lz-lnote">≈ 1 nanosecond. The processor's own memory. Nothing you write in an application ever touches this directly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Main memory (RAM)</span><span class="lz-lnote">≈ 100 nanoseconds. <strong>This is where Redis lives.</strong> A million times faster than a disk seek, and the reason a Redis command costs microseconds rather than milliseconds.</span></div>
  <div class="lz-layer"><span class="lz-lname">SSD random read</span><span class="lz-lnote">≈ 100 microseconds — a thousand times slower than RAM. This is where PostgreSQL lives, once the data is bigger than its page cache.</span></div>
  <div class="lz-layer"><span class="lz-lname">Spinning disk seek</span><span class="lz-lnote">≈ 10 milliseconds — a hundred thousand times slower than RAM. Still the storage under many cheap VPS instances.</span></div>
  <div class="lz-layer"><span class="lz-lname">Network round trip, same datacentre</span><span class="lz-lnote">≈ 500 microseconds. Note this is <em>slower</em> than a Redis operation — which means for most workloads, the network is the cost and Redis itself is free.</span></div>
</div>
<pre><code><span class="tok-comment"># Measure it yourself, on real hardware</span>
redis-cli --latency -i 3
redis-benchmark -q -t set,get,incr -n 100000 -P 1</code></pre>
<div class="out">min: 0, max: 1, avg: 0.09 (2841 samples)
SET: 71428.57 requests per second, p50=0.311 msec
GET: 74626.86 requests per second, p50=0.303 msec
INCR: 73529.41 requests per second, p50=0.311 msec</div>
<p>An average latency of 0.09ms and seventy thousand operations per second from a single-threaded process on an ordinary machine. Look closely at those numbers: the p50 of 0.31ms is <em>almost entirely network</em>. Redis did its work in a few microseconds and then spent ten times longer waiting for TCP.</p>

<h3>Three things Redis does better than anything else</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Caching with real structure</span><span class="v">Not just "store this blob for 60 seconds". A cached list you can push to, a cached counter you can increment atomically, a cached set you can test membership in — all without deserialising anything.</span></div>
  <div class="kv"><span class="k">Operations that are hard in SQL</span><span class="v">"Top 100 players by score, right now, with each player's rank" is one command and O(log N). In PostgreSQL it is a window function over a table you have to keep indexed and sorted.</span></div>
  <div class="kv"><span class="k">Atomic coordination</span><span class="v">Rate limits, locks, one-time tokens, job queues. Single-threaded execution means a command either happened completely or not at all, with no transaction machinery and no contention.</span></div>
</div>
<pre><code><span class="tok-comment"># The leaderboard, complete. Two commands.</span>
redis-cli ZADD lb 1520 alice 1980 bob 1740 carol 2310 dave
redis-cli ZREVRANGE lb 0 2 WITHSCORES
redis-cli ZREVRANK lb carol</code></pre>
<div class="out">(integer) 4
1) "dave"
2) "2310"
3) "bob"
4) "1980"
5) "carol"
6) "1740"
(integer) 2</div>

<h3>Three things Redis should not be</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Your only database</span><span class="lz-t">RAM is expensive and finite</span><span class="lz-d">A 64GB dataset costs a fortune in RAM and a rounding error on disk. Redis holds what benefits from being in memory; PostgreSQL holds the truth.</span></div>
  <div class="lz-step"><span class="lz-k">A place for data you cannot lose</span><span class="lz-t">persistence is real but not free</span><span class="lz-d">Redis <em>can</em> persist (Chapter 9), and it is genuinely durable when configured for it — but the default settings trade durability for speed, and the default is what most people run.</span></div>
  <div class="lz-step"><span class="lz-k">A relational store</span><span class="lz-t">no joins, no foreign keys, no query planner</span><span class="lz-d">You choose the access path by choosing the key. That is exactly why it is fast, and exactly why "find all orders where status = shipped and total &gt; 100" is the wrong question to ask it.</span></div>
</div>

<h3>Redis versus the two things people compare it to</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">versus PostgreSQL</span><span class="v">Different jobs, not competitors. Postgres gives you durability, joins, constraints and a query planner. Redis gives you microseconds and data structures. Nearly every production system runs both, and the interesting design question is which data belongs where.</span></div>
  <div class="kv"><span class="k">versus Memcached</span><span class="v">Memcached is a pure key-value cache: strings in, strings out, multi-threaded, extremely simple. Redis has data structures, persistence, replication, scripting and pub/sub. If all you need is a string cache, Memcached is a fine and smaller answer.</span></div>
  <div class="kv"><span class="k">versus "just use a Map in my app"</span><span class="v">An in-process map dies with the process, is invisible to your other three instances, and cannot be shared with the worker. Redis is the map that survives a restart and that everyone sees.</span></div>
  <div class="kv"><span class="k">versus Valkey</span><span class="v">A fork created in 2024 after Redis changed its licence, backed by the Linux Foundation and largely command-compatible. Everything in this course applies to both; where they diverge, the divergence is in newer modules, not in the fundamentals.</span></div>
</div>

<h3>The thirteen chapters ahead</h3>
<pre><code>0   What Redis solves · install · your first five minutes
1   The execution model: one thread, RESP, and why that is fast
2   Keys, TTL and expiration: the parts everyone gets wrong
3   Strings, counters, bitmaps and HyperLogLog
4   Lists, Sets and Sorted Sets: the structures worth learning
5   Hashes, and how to model an object
6   Caching properly: invalidation, stampedes and stale data
7   Atomicity: MULTI, WATCH, Lua and Functions
8   Pub/Sub and Streams: the message that vanished
9   Memory, eviction and persistence
10  Running Redis: configuration, security and ACLs
11  Scaling: replication, Sentinel and Cluster
12  Diagnosing Redis, and where to go next</code></pre>
<div class="callout ok"><strong>What this course is not.</strong> It is not a tour of every one of the 240 commands — the official reference does that better, and you will look them up as you need them. It is the model underneath: what happens when a command arrives, why some commands are dangerous, which structure fits which problem, and what breaks in production. Once that model is in place, the reference reads as a menu rather than a wall.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Redis — Get started</span><span class="lc-sub">The official introduction, with an interactive shell in the browser. Worth twenty minutes before Chapter 1, and it costs nothing to install.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">The command reference</span><span class="lc-sub">All 240+ commands with their time complexity stated for each. That complexity line is the single most useful thing on the page — it is how you avoid the commands that freeze a server.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Redis track</span><span class="lc-sub">Graded exercises alongside every chapter of this course — from your first <code>SET</code> to a working rate limiter, a leaderboard and a Lua script.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reaching for Redis because something is slow, without measuring where the time goes. The usual outcome is a cache in front of a query that was never the bottleneck, and now you have two sources of truth and a cache invalidation problem you did not have before. Measure first: if a page takes 800ms and 40ms of that is the database, Redis can save you at most 40ms and will cost you correctness. The workloads Redis transforms are the ones where the <em>same</em> expensive answer is computed thousands of times, or where the operation itself is a poor fit for SQL — a counter incremented on every request, a leaderboard read constantly and written constantly, a rate limit checked before every call. If your problem is not one of those shapes, the fix is probably an index.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Redis lives in RAM, which is roughly a thousand times faster than an SSD — fast enough that for most workloads the network, not Redis, is the cost. Its real value is not raw speed but <em>data structures</em>: problems that are awkward in SQL become one command with a known complexity. And it is a companion to a real database, not a replacement — the interesting question is always which data belongs where.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Redis giải quyết gì</h2>
<p class="lead">Mọi cơ sở dữ liệu rốt cuộc đều đâm vào cùng một bức tường: cái đĩa. Redis không có bức tường đó, vì nó giữ mọi thứ trong bộ nhớ — và riêng quyết định ấy thay đổi những gì đáng để xây. Một bảng xếp hạng mười triệu người chơi, một bộ giới hạn tần suất sống sót qua một đợt tải đột biến, một kho phiên đăng nhập trả lời trong một phần mười mili giây: tất cả đều là chuyện bình thường trong Redis và vụng về ở mọi nơi khác.</p>

<h3>Con số biện minh cho sự tồn tại của nó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cache L1 của CPU</span><span class="lz-lnote">≈ 1 nano giây. Bộ nhớ của chính bộ xử lý. Không có thứ gì bạn viết trong ứng dụng chạm trực tiếp vào đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ nhớ chính (RAM)</span><span class="lz-lnote">≈ 100 nano giây. <strong>Đây là chỗ Redis sống.</strong> Nhanh gấp một triệu lần một lần tìm kiếm trên đĩa, và là lý do một câu lệnh Redis tốn micro giây chứ không phải mili giây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đọc ngẫu nhiên trên SSD</span><span class="lz-lnote">≈ 100 micro giây — chậm gấp một nghìn lần RAM. Đây là chỗ PostgreSQL sống, một khi dữ liệu lớn hơn page cache của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tìm kiếm trên đĩa quay</span><span class="lz-lnote">≈ 10 mili giây — chậm gấp một trăm nghìn lần RAM. Vẫn là thứ lưu trữ nằm dưới nhiều con VPS giá rẻ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một vòng mạng, cùng trung tâm dữ liệu</span><span class="lz-lnote">≈ 500 micro giây. Để ý là con số này CHẬM HƠN một thao tác Redis — nghĩa là với phần lớn khối lượng công việc, mạng mới là cái giá còn bản thân Redis thì miễn phí.</span></div>
</div>
<pre><code><span class="tok-comment"># Tự đo lấy, trên phần cứng thật</span>
redis-cli --latency -i 3
redis-benchmark -q -t set,get,incr -n 100000 -P 1</code></pre>
<div class="out">min: 0, max: 1, avg: 0.09 (2841 samples)
SET: 71428.57 requests per second, p50=0.311 msec
GET: 74626.86 requests per second, p50=0.303 msec
INCR: 73529.41 requests per second, p50=0.311 msec</div>
<p>Độ trễ trung bình 0,09ms và bảy mươi nghìn thao tác mỗi giây từ một tiến trình MỘT LUỒNG trên một cái máy bình thường. Hãy nhìn kỹ mấy con số đó: cái p50 0,31ms <em>gần như hoàn toàn là mạng</em>. Redis làm xong việc của nó trong vài micro giây rồi ngồi chờ TCP lâu gấp mười lần chừng đó.</p>

<h3>Ba việc Redis làm tốt hơn mọi thứ khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache có CẤU TRÚC thật</span><span class="v">Không chỉ là "cất cái khối này trong 60 giây". Một danh sách đã cache mà bạn đẩy thêm phần tử vào được, một bộ đếm đã cache mà bạn tăng được một cách nguyên tử, một tập hợp đã cache mà bạn kiểm được thành viên — tất cả mà không phải giải tuần tự hoá gì cả.</span></div>
  <div class="kv"><span class="k">Những thao tác khó trong SQL</span><span class="v">"Top 100 người chơi theo điểm, ngay lúc này, kèm thứ hạng của từng người" là MỘT câu lệnh và O(log N). Trong PostgreSQL đó là một hàm cửa sổ trên một bảng bạn phải giữ cho có chỉ mục và luôn sắp xếp.</span></div>
  <div class="kv"><span class="k">Phối hợp nguyên tử</span><span class="v">Giới hạn tần suất, khoá, token dùng một lần, hàng đợi việc. Thực thi một luồng nghĩa là một câu lệnh hoặc xảy ra trọn vẹn hoặc không xảy ra, không cần bộ máy giao dịch và không có tranh chấp.</span></div>
</div>
<pre><code><span class="tok-comment"># Bảng xếp hạng, đầy đủ. Hai câu lệnh.</span>
redis-cli ZADD lb 1520 alice 1980 bob 1740 carol 2310 dave
redis-cli ZREVRANGE lb 0 2 WITHSCORES
redis-cli ZREVRANK lb carol</code></pre>
<div class="out">(integer) 4
1) "dave"
2) "2310"
3) "bob"
4) "1980"
5) "carol"
6) "1740"
(integer) 2</div>

<h3>Ba việc Redis không nên là</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cơ sở dữ liệu DUY NHẤT của bạn</span><span class="lz-t">RAM thì đắt và hữu hạn</span><span class="lz-d">Một tập dữ liệu 64GB tốn cả gia tài tiền RAM và một khoản làm tròn tiền đĩa. Redis giữ những gì được lợi khi nằm trong bộ nhớ; PostgreSQL giữ SỰ THẬT.</span></div>
  <div class="lz-step"><span class="lz-k">Chỗ để dữ liệu không được phép mất</span><span class="lz-t">lưu lâu dài là có thật nhưng không miễn phí</span><span class="lz-d">Redis <em>CÓ THỂ</em> lưu lâu dài (Chương 9), và nó bền thật khi được cấu hình cho điều đó — nhưng thiết lập mặc định đánh đổi độ bền lấy tốc độ, và mặc định là thứ phần lớn người ta đang chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Một kho quan hệ</span><span class="lz-t">không join, không khoá ngoại, không bộ lập kế hoạch truy vấn</span><span class="lz-d">Bạn chọn đường truy cập bằng cách chọn cái khoá. Đó đúng là lý do nó nhanh, và cũng đúng là lý do "tìm mọi đơn hàng có trạng thái đã giao và tổng &gt; 100" là câu hỏi sai để hỏi nó.</span></div>
</div>

<h3>Redis so với hai thứ người ta hay đem ra so</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">so với PostgreSQL</span><span class="v">Hai việc khác nhau, không phải đối thủ. Postgres cho bạn độ bền, join, ràng buộc và một bộ lập kế hoạch truy vấn. Redis cho bạn micro giây và các cấu trúc dữ liệu. Gần như mọi hệ thống production đều chạy cả hai, và câu hỏi thiết kế thú vị là dữ liệu nào thuộc về đâu.</span></div>
  <div class="kv"><span class="k">so với Memcached</span><span class="v">Memcached là một cache khoá-giá trị thuần: chuỗi vào, chuỗi ra, đa luồng, cực kỳ đơn giản. Redis có cấu trúc dữ liệu, lưu lâu dài, nhân bản, kịch bản và pub/sub. Nếu bạn chỉ cần một cache chuỗi thì Memcached là câu trả lời ổn và nhỏ hơn.</span></div>
  <div class="kv"><span class="k">so với "cứ dùng một cái Map trong app"</span><span class="v">Một map trong tiến trình chết theo tiến trình, vô hình với ba instance khác của bạn, và không chia sẻ được với con worker. Redis là cái map sống sót qua khởi động lại và mọi người đều nhìn thấy.</span></div>
  <div class="kv"><span class="k">so với Valkey</span><span class="v">Một bản rẽ nhánh tạo năm 2024 sau khi Redis đổi giấy phép, do Linux Foundation đỡ đầu và phần lớn tương thích câu lệnh. Mọi thứ trong khoá này áp cho cả hai; chỗ chúng phân kỳ nằm ở các module mới, không nằm ở phần nền tảng.</span></div>
</div>

<h3>Mười ba chương phía trước</h3>
<pre><code>0   Redis giải quyết gì · cài đặt · năm phút đầu tiên
1   Mô hình thực thi: một luồng, RESP, và vì sao thế là nhanh
2   Khoá, TTL và hết hạn: những phần ai cũng làm sai
3   Chuỗi, bộ đếm, bitmap và HyperLogLog
4   List, Set và Sorted Set: những cấu trúc đáng học
5   Hash, và cách mô hình hoá một đối tượng
6   Cache cho đúng: vô hiệu hoá, stampede và dữ liệu cũ
7   Tính nguyên tử: MULTI, WATCH, Lua và Functions
8   Pub/Sub và Streams: cái tin nhắn đã biến mất
9   Bộ nhớ, đẩy khoá và lưu lâu dài
10  Vận hành Redis: cấu hình, bảo mật và ACL
11  Mở rộng: nhân bản, Sentinel và Cluster
12  Chẩn đoán Redis, và đi tiếp về đâu</code></pre>
<div class="callout ok"><strong>Khoá này KHÔNG phải cái gì.</strong> Nó không phải một chuyến tham quan cả 240 câu lệnh — tài liệu chính thức làm việc đó tốt hơn, và bạn sẽ tra chúng khi cần. Nó là cái MÔ HÌNH nằm dưới: chuyện gì xảy ra khi một câu lệnh tới, vì sao vài câu lệnh nguy hiểm, cấu trúc nào hợp với bài toán nào, và cái gì vỡ trên production. Một khi mô hình đó nằm đúng chỗ, phần tra cứu đọc như một thực đơn thay vì một bức tường.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Redis — Get started</span><span class="lc-sub">Phần giới thiệu chính thức, có sẵn một cái shell tương tác trong trình duyệt. Đáng bỏ hai mươi phút trước Chương 1, và không tốn gì để cài.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Trang tra cứu câu lệnh</span><span class="lc-sub">Đủ 240+ câu lệnh với độ phức tạp thời gian ghi rõ cho từng cái. Chính dòng độ phức tạp đó là thứ hữu ích nhất trên trang — đó là cách bạn tránh những câu lệnh làm đứng cả máy chủ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: track Redis</span><span class="lc-sub">Bài chấm điểm đi kèm mọi chương của khoá này — từ lệnh <code>SET</code> đầu tiên tới một bộ giới hạn tần suất chạy được, một bảng xếp hạng và một script Lua.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> với tay lấy Redis vì có cái gì đó chậm, mà chưa đo xem thời gian đi đâu. Kết cục thường thấy là một cái cache đặt trước một truy vấn vốn chưa bao giờ là nút thắt, và giờ bạn có hai nguồn sự thật cùng một bài toán vô hiệu hoá cache mà trước đó bạn không có. Hãy đo trước: nếu một trang mất 800ms và 40ms trong đó là cơ sở dữ liệu, thì Redis nhiều nhất cứu được cho bạn 40ms và bắt bạn trả bằng tính đúng đắn. Những khối lượng công việc mà Redis biến đổi là những cái mà CÙNG một câu trả lời tốn kém được tính đi tính lại hàng nghìn lần, hoặc bản thân thao tác đó vốn không hợp với SQL — một bộ đếm tăng ở mọi yêu cầu, một bảng xếp hạng vừa đọc vừa ghi liên tục, một giới hạn tần suất kiểm trước mọi lời gọi. Nếu vấn đề của bạn không có hình dạng nào trong đó thì cách chữa nhiều khả năng là một cái chỉ mục.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Redis sống trong RAM, thứ nhanh gấp khoảng một nghìn lần một cái SSD — nhanh tới mức với phần lớn khối lượng công việc thì MẠNG mới là cái giá, chứ không phải Redis. Giá trị thật của nó không nằm ở tốc độ thô mà nằm ở <em>CẤU TRÚC DỮ LIỆU</em>: những bài toán vụng về trong SQL trở thành một câu lệnh có độ phức tạp đã biết. Và nó là bạn đồng hành của một cơ sở dữ liệu thật, không phải thứ thay thế — câu hỏi thú vị luôn là dữ liệu nào thuộc về đâu.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Getting Redis running|||0.2 — Cho Redis chạy lên',
      slug: 'rd-0-2-cai-dat',
      type: 'LESSON',
      description: 'Docker trong hai mươi giây, cài trực tiếp trên Linux và macOS, redis-cli với các cờ đáng biết, kiểm nó chạy thật, và bốn thiết lập cần đổi ngay ở lần đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Getting Redis running</h2>
<p class="lead">Redis is one binary with no dependencies, which makes installing it refreshingly boring. The interesting part is not getting it running — it is the four settings that separate "it started" from "it will not surprise you later", and those take about a minute.</p>

<h3>Docker, in twenty seconds</h3>
<pre><code>docker run -d --name redis -p 127.0.0.1:6379:6379 redis:7.4-alpine
docker exec -it redis redis-cli PING
docker exec -it redis redis-cli INFO server | grep -E 'redis_version|os|multiplexing'</code></pre>
<div class="out">PONG
redis_version:7.4.1
os:Linux 6.8.0-45-generic x86_64
multiplexing_api:epoll</div>
<div class="callout ok"><strong>Note the <code>127.0.0.1:</code> in front of the port.</strong> Without it, <code>-p 6379:6379</code> publishes Redis on every interface of the host — and because Docker's rules bypass UFW entirely, that means the open internet regardless of your firewall. An exposed Redis with no password is compromised within hours; internet-wide scanners look for exactly this. Bind to loopback, always, unless you have a specific reason and a password.</div>
<pre><code><span class="tok-comment"># A persistent, size-capped Redis you can actually keep</span>
docker run -d --name redis \\
  -p 127.0.0.1:6379:6379 \\
  -v redis-data:/data \\
  redis:7.4-alpine redis-server \\
    --appendonly yes \\
    --maxmemory 256mb \\
    --maxmemory-policy allkeys-lru
docker exec redis redis-cli CONFIG GET maxmemory-policy</code></pre>
<div class="out">1) "maxmemory-policy"
2) "allkeys-lru"</div>

<h3>Installing it directly</h3>
<pre><code><span class="tok-comment"># Debian / Ubuntu — the official APT repository, not the distro's old package</span>
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis.gpg
echo "deb [signed-by=/usr/share/keyrings/redis.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" \\
  | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update &amp;&amp; sudo apt-get install -y redis
redis-server --version</code></pre>
<div class="out">Redis server v=7.4.1 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64</div>
<pre><code><span class="tok-comment"># macOS</span>
brew install redis &amp;&amp; brew services start redis

<span class="tok-comment"># Windows — WSL2, or Docker. There is no supported native build.</span>
wsl --install -d Ubuntu   <span class="tok-comment"># then follow the Debian instructions inside</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Use the official repository</span><span class="v">Ubuntu's own <code>redis-server</code> package is frequently two major versions behind, which means missing commands and missing fixes. The APT repo above tracks upstream.</span></div>
  <div class="kv"><span class="k">Docker for development</span><span class="v">Nothing to uninstall, trivially reset, and the same image runs in CI. Chapter 7 of the Docker course covers the volume you would attach to keep the data.</span></div>
  <div class="kv"><span class="k">Native for a dedicated server</span><span class="v">Slightly lower latency, and systemd handles restarts and logging for you (Chapter 10). On a machine that runs only Redis, this is the simpler setup.</span></div>
  <div class="kv"><span class="k">Managed, when it matters</span><span class="v">Redis Cloud, ElastiCache, Upstash. You give up config access and gain failover and backups. Everything in Chapters 1–8 still applies unchanged.</span></div>
  <div class="kv"><span class="k">Version 7.0 is the floor</span><span class="v">This course uses 7.4. Functions arrived in 7.0, hash-field TTL in 7.4. If you are on 6.x, most of it still applies — the lessons say so where it matters.</span></div>
</div>

<h3>redis-cli, and the flags worth knowing</h3>
<pre><code>redis-cli                                   <span class="tok-comment"># interactive, localhost:6379</span>
redis-cli -h 10.0.0.7 -p 6380 -a "$PASS"    <span class="tok-comment"># another host (see the warning below)</span>
redis-cli -n 3 KEYS '*'                     <span class="tok-comment"># database 3</span>
redis-cli --scan --pattern 'session:*' | head -3
redis-cli --stat                            <span class="tok-comment"># live one-line stats</span>
redis-cli --bigkeys                         <span class="tok-comment"># find the keys eating your RAM</span>
redis-cli --latency-history -i 5            <span class="tok-comment"># latency over time</span>
redis-cli MONITOR                           <span class="tok-comment"># every command, live — see the warning</span></code></pre>
<div class="out">session:8f21ac
session:3b7e10
session:c4d902
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
14213      41.82M   6       0       1284419 (+0)        842</div>
<div class="callout warn"><strong>Two warnings about that list.</strong> <code>-a</code> puts the password in your shell history and in <code>ps</code> output for every user on the machine — use <code>REDISCLI_AUTH</code> or the interactive <code>AUTH</code> command instead. And <code>MONITOR</code> streams <em>every</em> command the server processes to your terminal, which on a busy instance costs real throughput and can itself become the reason things are slow. Both are fine for two seconds on a development box and wrong on production.</div>

<h3>Check it actually works</h3>
<pre><code>redis-cli PING
redis-cli SET greeting "xin chào" EX 60
redis-cli GET greeting
redis-cli TTL greeting
redis-cli INFO memory | grep -E 'used_memory_human|maxmemory_human|mem_fragmentation'</code></pre>
<div class="out">PONG
OK
"xin ch\\xc3\\xa0o"
(integer) 57
used_memory_human:1.09M
maxmemory_human:256.00M
mem_fragmentation_ratio:5.42</div>
<p>Two things worth noticing in that output. The Vietnamese text comes back escaped because <code>redis-cli</code> shows raw bytes by default — Redis stores bytes and has no idea about character encodings; add <code>--no-raw</code> off or use <code>--raw</code> to see the actual characters. And <code>mem_fragmentation_ratio</code> of 5.42 looks alarming but is meaningless on an almost-empty instance; it only matters once <code>used_memory</code> is substantial (Chapter 9).</p>

<h3>Four settings to change before you forget</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A password, or ACL users</span><span class="lz-t">requirepass, or better: ACL SETUSER</span><span class="lz-d">Redis has no authentication by default. On anything reachable by more than your own laptop, this is the first line of defence and it takes one config line (Chapter 10).</span></div>
  <div class="lz-step"><span class="lz-k">2 · maxmemory and a policy</span><span class="lz-t">maxmemory 256mb · maxmemory-policy allkeys-lru</span><span class="lz-d">Without both, Redis grows until the OOM killer takes it. With them it evicts and keeps serving — a degraded cache instead of a dead one (Chapter 9).</span></div>
  <div class="lz-step"><span class="lz-k">3 · Decide about persistence</span><span class="lz-t">appendonly yes, or deliberately no</span><span class="lz-d">The default snapshots occasionally, which is neither fast nor durable. Pick one on purpose: pure cache (none), or a store you care about (AOF).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Rename or disable the dangerous commands</span><span class="lz-t">FLUSHALL, KEYS, CONFIG, DEBUG</span><span class="lz-d">One <code>FLUSHALL</code> empties everything instantly with no confirmation and no undo. In production, restrict them by ACL (Chapter 10).</span></div>
</div>
<pre><code><span class="tok-comment"># Where the config lives, and how to change one value without a restart</span>
redis-cli CONFIG GET dir
redis-cli CONFIG SET maxmemory 512mb
redis-cli CONFIG REWRITE          <span class="tok-comment"># persist it back into redis.conf</span>
redis-cli CONFIG GET maxmemory</code></pre>
<div class="out">1) "dir"
2) "/data"
OK
OK
1) "maxmemory"
2) "536870912"</div>
<div class="callout"><strong><code>CONFIG SET</code> changes the running server; <code>CONFIG REWRITE</code> writes it back to the file so it survives a restart.</strong> Forgetting the second one is how a setting works perfectly for three weeks and then vanishes during an unrelated restart — with nobody remembering that it was ever set by hand. If Redis was started without a config file, <code>CONFIG REWRITE</code> returns an error, which is itself a useful signal about how your instance was launched.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/" target="_blank" rel="noopener">
  <span class="lc-ico">💿</span>
  <span class="lc-body"><span class="lc-title">Installing Redis</span><span class="lc-sub">Official instructions for every platform, including the APT and Homebrew repositories and building from source. The source build is genuinely easy and worth doing once.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">redis-cli reference</span><span class="lc-sub">Every flag, including <code>--bigkeys</code>, <code>--memkeys</code>, <code>--hotkeys</code>, <code>--rdb</code> and the pipe mode for bulk loading. Several of them are diagnostic tools you will want in Chapter 12.</span></span>
</a>
<a class="link-card" href="https://raw.githubusercontent.com/redis/redis/7.4/redis.conf" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">The annotated redis.conf</span><span class="lc-sub">The default config file, and it is a genuinely good document — every setting has a paragraph explaining the trade-off. Reading it end to end is a fast way to learn what Redis can do.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: get set up</span><span class="lc-sub">Graded exercises: start a Redis with persistence and a memory cap, confirm the settings took effect, and explain why publishing 6379 on all interfaces is dangerous.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> starting Redis with the default configuration on a machine with a public IP. There is no password by default, and until Redis 3.2 there was not even a protected mode — which is why "open Redis instances" remain one of the most reliably exploited things on the internet. The attack does not stop at reading your data: an unauthenticated Redis can be told to write its dump file into <code>~/.ssh/authorized_keys</code>, which turns a cache into a shell. Modern Redis refuses external connections when it has no password and no bind directive, but that protection disappears the moment someone sets <code>bind 0.0.0.0</code> to "make it work". Bind to loopback, put it on a private container network (Docker course, Chapter 8), and set a password anyway.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Publish Redis on <code>127.0.0.1</code> only — a container port published on all interfaces bypasses your firewall entirely, and an open Redis is compromised in hours. Set <code>maxmemory</code> and a <code>maxmemory-policy</code> the day you start, not the day it OOMs. And <code>CONFIG SET</code> changes the running server while <code>CONFIG REWRITE</code> makes it survive a restart — forgetting the second is how settings quietly disappear.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cho Redis chạy lên</h2>
<p class="lead">Redis là một tệp nhị phân duy nhất không phụ thuộc gì, nên cài nó nhàm chán một cách dễ chịu. Phần thú vị không phải là cho nó chạy — mà là bốn thiết lập tách "nó đã khởi động" khỏi "nó sẽ không làm bạn bất ngờ về sau", và chừng đó tốn khoảng một phút.</p>

<h3>Docker, trong hai mươi giây</h3>
<pre><code>docker run -d --name redis -p 127.0.0.1:6379:6379 redis:7.4-alpine
docker exec -it redis redis-cli PING
docker exec -it redis redis-cli INFO server | grep -E 'redis_version|os|multiplexing'</code></pre>
<div class="out">PONG
redis_version:7.4.1
os:Linux 6.8.0-45-generic x86_64
multiplexing_api:epoll</div>
<div class="callout ok"><strong>Để ý cái <code>127.0.0.1:</code> đứng trước số cổng.</strong> Không có nó thì <code>-p 6379:6379</code> công bố Redis trên MỌI giao diện của máy chủ — và vì luật của Docker đi vòng hẳn qua UFW, điều đó nghĩa là Internet công cộng bất kể tường lửa của bạn. Một Redis phơi ra mà không có mật khẩu sẽ bị chiếm trong vài giờ; máy quét khắp Internet tìm đúng thứ này. Hãy gắn vào loopback, luôn luôn, trừ khi bạn có lý do cụ thể VÀ có mật khẩu.</div>
<pre><code><span class="tok-comment"># Một Redis có lưu lâu dài và có trần dung lượng, thứ bạn giữ lại được</span>
docker run -d --name redis \\
  -p 127.0.0.1:6379:6379 \\
  -v redis-data:/data \\
  redis:7.4-alpine redis-server \\
    --appendonly yes \\
    --maxmemory 256mb \\
    --maxmemory-policy allkeys-lru
docker exec redis redis-cli CONFIG GET maxmemory-policy</code></pre>
<div class="out">1) "maxmemory-policy"
2) "allkeys-lru"</div>

<h3>Cài trực tiếp</h3>
<pre><code><span class="tok-comment"># Debian / Ubuntu — kho APT chính thức, không phải gói cũ của bản phân phối</span>
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis.gpg
echo "deb [signed-by=/usr/share/keyrings/redis.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" \\
  | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update &amp;&amp; sudo apt-get install -y redis
redis-server --version</code></pre>
<div class="out">Redis server v=7.4.1 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64</div>
<pre><code><span class="tok-comment"># macOS</span>
brew install redis &amp;&amp; brew services start redis

<span class="tok-comment"># Windows — WSL2, hoặc Docker. Không có bản dựng gốc nào được hỗ trợ.</span>
wsl --install -d Ubuntu   <span class="tok-comment"># rồi làm theo hướng dẫn Debian bên trong</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng kho chính thức</span><span class="v">Gói <code>redis-server</code> của chính Ubuntu thường chậm hai phiên bản chính, nghĩa là thiếu câu lệnh và thiếu bản vá. Kho APT ở trên bám theo thượng nguồn.</span></div>
  <div class="kv"><span class="k">Docker cho lúc phát triển</span><span class="v">Không có gì để gỡ, đặt lại dễ như bỡn, và cùng cái ảnh đó chạy trong CI. Chương 7 khoá Docker nói về cái volume bạn gắn vào để giữ dữ liệu.</span></div>
  <div class="kv"><span class="k">Cài gốc cho một máy chủ chuyên dụng</span><span class="v">Độ trễ thấp hơn chút, và systemd lo hộ việc khởi động lại với ghi log (Chương 10). Trên một cái máy chỉ chạy Redis thì đây là cấu hình đơn giản hơn.</span></div>
  <div class="kv"><span class="k">Dịch vụ có quản, khi cần</span><span class="v">Redis Cloud, ElastiCache, Upstash. Bạn từ bỏ quyền truy cập cấu hình và nhận lại chuyển dự phòng với sao lưu. Mọi thứ ở Chương 1–8 vẫn áp dụng nguyên vẹn.</span></div>
  <div class="kv"><span class="k">Phiên bản 7.0 là mức sàn</span><span class="v">Khoá này dùng 7.4. Functions xuất hiện ở 7.0, TTL cho từng trường hash ở 7.4. Nếu bạn đang ở 6.x thì phần lớn vẫn áp dụng — các bài học có nói rõ ở những chỗ khác biệt.</span></div>
</div>

<h3>redis-cli, và những cờ đáng biết</h3>
<pre><code>redis-cli                                   <span class="tok-comment"># tương tác, localhost:6379</span>
redis-cli -h 10.0.0.7 -p 6380 -a "$PASS"    <span class="tok-comment"># máy khác (xem cảnh báo bên dưới)</span>
redis-cli -n 3 KEYS '*'                     <span class="tok-comment"># cơ sở dữ liệu số 3</span>
redis-cli --scan --pattern 'session:*' | head -3
redis-cli --stat                            <span class="tok-comment"># thống kê một dòng, cập nhật liên tục</span>
redis-cli --bigkeys                         <span class="tok-comment"># tìm những khoá đang ăn RAM của bạn</span>
redis-cli --latency-history -i 5            <span class="tok-comment"># độ trễ theo thời gian</span>
redis-cli MONITOR                           <span class="tok-comment"># mọi câu lệnh, trực tiếp — xem cảnh báo</span></code></pre>
<div class="out">session:8f21ac
session:3b7e10
session:c4d902
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
14213      41.82M   6       0       1284419 (+0)        842</div>
<div class="callout warn"><strong>Hai cảnh báo về danh sách đó.</strong> Cờ <code>-a</code> đặt mật khẩu vào lịch sử shell của bạn và vào kết quả <code>ps</code> cho mọi người dùng trên máy — hãy dùng <code>REDISCLI_AUTH</code> hoặc câu lệnh <code>AUTH</code> tương tác thay thế. Và <code>MONITOR</code> đổ <em>MỌI</em> câu lệnh máy chủ xử lý ra terminal của bạn, thứ mà trên một instance bận rộn tốn thông lượng thật và tự nó có thể trở thành lý do mọi thứ chậm. Cả hai đều ổn trong hai giây trên máy phát triển và đều SAI trên production.</div>

<h3>Kiểm xem nó chạy thật</h3>
<pre><code>redis-cli PING
redis-cli SET greeting "xin chào" EX 60
redis-cli GET greeting
redis-cli TTL greeting
redis-cli INFO memory | grep -E 'used_memory_human|maxmemory_human|mem_fragmentation'</code></pre>
<div class="out">PONG
OK
"xin ch\\xc3\\xa0o"
(integer) 57
used_memory_human:1.09M
maxmemory_human:256.00M
mem_fragmentation_ratio:5.42</div>
<p>Có hai thứ đáng để ý trong kết quả đó. Dòng tiếng Việt trả về ở dạng thoát ký tự vì <code>redis-cli</code> mặc định hiện byte thô — Redis lưu BYTE và hoàn toàn không biết gì về bảng mã ký tự; hãy dùng <code>--raw</code> để thấy ký tự thật. Và <code>mem_fragmentation_ratio</code> bằng 5,42 nghe đáng báo động nhưng vô nghĩa trên một instance gần như rỗng; nó chỉ có ý nghĩa khi <code>used_memory</code> đã đáng kể (Chương 9).</p>

<h3>Bốn thiết lập cần đổi trước khi bạn quên</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một mật khẩu, hoặc người dùng ACL</span><span class="lz-t">requirepass, hoặc tốt hơn: ACL SETUSER</span><span class="lz-d">Redis mặc định KHÔNG có xác thực. Trên bất cứ thứ gì mà nhiều hơn cái máy của bạn với tới được, đây là tuyến phòng thủ đầu tiên và nó tốn một dòng cấu hình (Chương 10).</span></div>
  <div class="lz-step"><span class="lz-k">2 · maxmemory kèm một chính sách</span><span class="lz-t">maxmemory 256mb · maxmemory-policy allkeys-lru</span><span class="lz-d">Không có đủ cả hai thì Redis phình tới khi bộ giết OOM lấy nó đi. Có cả hai thì nó đẩy bớt khoá và tiếp tục phục vụ — một cái cache suy giảm thay vì một cái cache đã chết (Chương 9).</span></div>
  <div class="lz-step"><span class="lz-k">3 · Quyết chuyện lưu lâu dài</span><span class="lz-t">appendonly yes, hoặc cố ý là không</span><span class="lz-d">Mặc định chụp ảnh thi thoảng, thứ vừa không nhanh vừa không bền. Hãy chọn một cái có chủ đích: cache thuần (không lưu), hoặc một kho bạn quan tâm (AOF).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Đổi tên hoặc tắt những câu lệnh nguy hiểm</span><span class="lz-t">FLUSHALL, KEYS, CONFIG, DEBUG</span><span class="lz-d">Một lệnh <code>FLUSHALL</code> làm rỗng mọi thứ tức thì, không xác nhận và không hoàn tác. Trên production hãy hạn chế chúng bằng ACL (Chương 10).</span></div>
</div>
<pre><code><span class="tok-comment"># Cấu hình nằm ở đâu, và đổi một giá trị mà không phải khởi động lại</span>
redis-cli CONFIG GET dir
redis-cli CONFIG SET maxmemory 512mb
redis-cli CONFIG REWRITE          <span class="tok-comment"># ghi ngược lại vào redis.conf</span>
redis-cli CONFIG GET maxmemory</code></pre>
<div class="out">1) "dir"
2) "/data"
OK
OK
1) "maxmemory"
2) "536870912"</div>
<div class="callout"><strong><code>CONFIG SET</code> đổi máy chủ ĐANG CHẠY; <code>CONFIG REWRITE</code> ghi nó ngược vào file để nó sống sót qua khởi động lại.</strong> Quên bước thứ hai là cách một thiết lập chạy hoàn hảo suốt ba tuần rồi biến mất trong một lần khởi động lại chẳng liên quan — mà không ai nhớ rằng nó từng được đặt bằng tay. Nếu Redis khởi động mà không có file cấu hình thì <code>CONFIG REWRITE</code> trả về lỗi, và bản thân điều đó là một tín hiệu hữu ích về cách instance của bạn được khởi chạy.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/" target="_blank" rel="noopener">
  <span class="lc-ico">💿</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Redis</span><span class="lc-sub">Hướng dẫn chính thức cho mọi nền tảng, gồm kho APT với Homebrew và cách dựng từ mã nguồn. Dựng từ nguồn thật sự dễ và đáng làm một lần.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Tra cứu redis-cli</span><span class="lc-sub">Mọi cái cờ, gồm <code>--bigkeys</code>, <code>--memkeys</code>, <code>--hotkeys</code>, <code>--rdb</code> và chế độ ống dẫn để nạp hàng loạt. Vài cái trong đó là công cụ chẩn đoán bạn sẽ cần ở Chương 12.</span></span>
</a>
<a class="link-card" href="https://raw.githubusercontent.com/redis/redis/7.4/redis.conf" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">File redis.conf có chú giải</span><span class="lc-sub">File cấu hình mặc định, và nó thật sự là một tài liệu tốt — mọi thiết lập đều có một đoạn giải thích sự đánh đổi. Đọc nó từ đầu tới cuối là cách nhanh để biết Redis làm được gì.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: cài đặt xong xuôi</span><span class="lc-sub">Bài chấm điểm: khởi động một Redis có lưu lâu dài và có trần bộ nhớ, xác nhận các thiết lập đã có hiệu lực, và giải thích vì sao công bố 6379 trên mọi giao diện là nguy hiểm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> khởi động Redis với cấu hình mặc định trên một cái máy có IP công khai. Mặc định KHÔNG có mật khẩu, và mãi tới Redis 3.2 mới có chế độ bảo vệ — đó là lý do "những instance Redis mở toang" vẫn là một trong những thứ bị khai thác đều đặn nhất trên Internet. Cuộc tấn công không dừng ở việc đọc dữ liệu của bạn: một Redis không xác thực có thể bị bảo ghi file dump của nó vào <code>~/.ssh/authorized_keys</code>, thứ biến một cái cache thành một cái shell. Redis đời mới từ chối kết nối từ ngoài khi nó không có mật khẩu và không có chỉ thị bind, nhưng lớp bảo vệ đó biến mất ngay khoảnh khắc có người đặt <code>bind 0.0.0.0</code> để "cho nó chạy". Hãy gắn vào loopback, đặt nó lên một mạng container riêng (khoá Docker, Chương 8), và cứ đặt mật khẩu.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Chỉ công bố Redis ở <code>127.0.0.1</code> — một cổng container công bố trên mọi giao diện đi vòng hẳn qua tường lửa của bạn, và một Redis mở toang bị chiếm trong vài giờ. Hãy đặt <code>maxmemory</code> cùng một <code>maxmemory-policy</code> ngay ngày bạn bắt đầu, đừng đợi tới ngày nó chết OOM. Và <code>CONFIG SET</code> đổi máy chủ đang chạy còn <code>CONFIG REWRITE</code> khiến nó sống sót qua khởi động lại — quên cái thứ hai là cách các thiết lập lặng lẽ biến mất.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Your first five minutes|||0.3 — Năm phút đầu tiên của bạn',
      slug: 'rd-0-3-nam-phut',
      type: 'LESSON',
      description: 'Mười lăm câu lệnh dựng nên một mô hình tinh thần: SET/GET, TTL, INCR, một danh sách, một tập hợp, một bảng xếp hạng, một hash — rồi TYPE, OBJECT ENCODING và DEBUG để nhìn thấy Redis đang lưu chúng ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Your first five minutes</h2>
<p class="lead">Fifteen commands, run in order, and you will have touched every idea the rest of the course expands on: keys and values, expiry, atomic counters, the five core data structures, and the fact that Redis chooses a different internal representation depending on how big your data is.</p>

<h3>Keys and values</h3>
<pre><code>redis-cli
127.0.0.1:6379&gt; SET user:1042:name "Cường"
127.0.0.1:6379&gt; GET user:1042:name
127.0.0.1:6379&gt; EXISTS user:1042:name user:9999:name
127.0.0.1:6379&gt; TYPE user:1042:name
127.0.0.1:6379&gt; DEL user:1042:name</code></pre>
<div class="out">OK
"C\\xc6\\xb0\\xe1\\xbb\\x9dng"
(integer) 1
string
(integer) 1</div>
<div class="callout"><strong>The colons in <code>user:1042:name</code> mean nothing to Redis.</strong> There are no namespaces, no tables, no hierarchy — the whole keyspace is one flat dictionary, and <code>user:1042:name</code> is just a fourteen-byte string. The convention exists purely for humans and for <code>SCAN --pattern</code>, and adopting it consistently from your very first key is one of the few decisions that gets expensive to change later (Chapter 2).</div>

<h3>Expiry, which is the feature people underuse</h3>
<pre><code>127.0.0.1:6379&gt; SET session:8f21ac '{"uid":1042}' EX 30
127.0.0.1:6379&gt; TTL session:8f21ac
127.0.0.1:6379&gt; PERSIST session:8f21ac
127.0.0.1:6379&gt; TTL session:8f21ac
127.0.0.1:6379&gt; EXPIRE session:8f21ac 30
127.0.0.1:6379&gt; SET session:8f21ac '{"uid":1042}' KEEPTTL</code></pre>
<div class="out">OK
(integer) 28
(integer) 1
(integer) -1
(integer) 1
OK</div>
<p>Three return values worth memorising now. <code>TTL</code> gives seconds remaining, <code>-1</code> means the key exists with no expiry, and <code>-2</code> means the key does not exist at all. That third case is the one that catches people: a missing key and an immortal key look similar in code and are completely different in meaning.</p>

<h3>Counters, and why they are not a race condition</h3>
<pre><code>127.0.0.1:6379&gt; INCR page:home:views
127.0.0.1:6379&gt; INCRBY page:home:views 10
127.0.0.1:6379&gt; INCRBYFLOAT cart:1042:total 19.99
127.0.0.1:6379&gt; GET page:home:views</code></pre>
<div class="out">(integer) 1
(integer) 11
"19.99"
"11"</div>
<div class="callout ok"><strong><code>INCR</code> is read-modify-write, and it is atomic — that is the whole point.</strong> Ten thousand concurrent clients all running <code>INCR</code> produce exactly ten thousand, with no locks, no transactions and no lost updates. In your application, <code>counter = counter + 1</code> across two processes loses increments; in Redis it cannot, because the server executes one command at a time (Chapter 1). This single property is why rate limiters and job counters live here.</div>

<h3>The four structures you will use most</h3>
<pre><code><span class="tok-comment"># A list — ordered, push and pop from either end</span>
127.0.0.1:6379&gt; RPUSH queue:emails "welcome:1042" "digest:1042"
127.0.0.1:6379&gt; LRANGE queue:emails 0 -1
127.0.0.1:6379&gt; LPOP queue:emails

<span class="tok-comment"># A set — unordered, unique, membership in O(1)</span>
127.0.0.1:6379&gt; SADD post:77:likes 1042 2091 1042
127.0.0.1:6379&gt; SCARD post:77:likes
127.0.0.1:6379&gt; SISMEMBER post:77:likes 1042</code></pre>
<div class="out">(integer) 2
1) "welcome:1042"
2) "digest:1042"
"welcome:1042"
(integer) 2
(integer) 2
(integer) 1</div>
<pre><code><span class="tok-comment"># A sorted set — a set where every member has a score, kept in order</span>
127.0.0.1:6379&gt; ZADD leaderboard 1520 alice 1980 bob 2310 dave
127.0.0.1:6379&gt; ZREVRANGE leaderboard 0 1 WITHSCORES
127.0.0.1:6379&gt; ZSCORE leaderboard bob
127.0.0.1:6379&gt; ZINCRBY leaderboard 100 bob

<span class="tok-comment"># A hash — a small dictionary under one key</span>
127.0.0.1:6379&gt; HSET user:1042 name "Cường" plan pro logins 41
127.0.0.1:6379&gt; HGET user:1042 plan
127.0.0.1:6379&gt; HINCRBY user:1042 logins 1
127.0.0.1:6379&gt; HGETALL user:1042</code></pre>
<div class="out">1) "dave"
2) "2310"
3) "bob"
4) "1980"
"1980"
"2080"
(integer) 3
"pro"
(integer) 42
1) "name"
2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
3) "plan"
4) "pro"
5) "logins"
6) "42"</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">pick by question</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"What is the value of X?"</span><span class="lz-nsub">String — GET/SET. The default, and right more often than people admit.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"What are the fields of X?"</span><span class="lz-nsub">Hash — read or update one field without touching the rest.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">collections</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"In what order did these arrive?"</span><span class="lz-nsub">List — a queue, a recent-items feed, a capped log.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Is X in this group, and how many are there?"</span><span class="lz-nsub">Set — uniqueness, membership, intersections between groups.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">the powerful one</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"What are the top N, and where does X rank?"</span><span class="lz-nsub">Sorted set — leaderboards, priority queues, time windows, delayed jobs.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chapters 3–5</span><span class="lz-nsub">Each of these gets a full chapter, including the ones this list leaves out: bitmaps, HyperLogLog, geo and streams.</span></div></div>
  </div>
</div>

<h3>Look at how Redis is actually storing it</h3>
<pre><code>127.0.0.1:6379&gt; OBJECT ENCODING user:1042
127.0.0.1:6379&gt; HSET user:1042 bio "a fairly long biography string that pushes this hash past the listpack threshold of 64 bytes per value"
127.0.0.1:6379&gt; OBJECT ENCODING user:1042
127.0.0.1:6379&gt; MEMORY USAGE user:1042
127.0.0.1:6379&gt; DBSIZE</code></pre>
<div class="out">"listpack"
(integer) 1
"hashtable"
(integer) 312
(integer) 7</div>
<div class="callout ok"><strong>The encoding changed underneath you, and that is Redis's most useful trick.</strong> A small hash is stored as a <em>listpack</em> — a compact array scanned linearly, which is faster and far smaller than a hash table at these sizes. Once a value crosses 64 bytes or the hash passes 128 fields, Redis silently converts it to a real hash table. Same commands, same results, radically different memory. Chapter 5 measures the difference; it is often 5–10× and it is why "just use a hash" is usually good advice.</div>

<h3>Two commands to never run on production, and their replacements</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ <code>KEYS *</code></span><span class="v">Scans the entire keyspace in one blocking operation. On a million keys it freezes the server for seconds — every other client waits. It is the single most common way people take down their own Redis.</span></div>
  <div class="kv"><span class="k">✅ <code>SCAN 0 MATCH user:* COUNT 100</code></span><span class="v">Iterates in small batches, returning a cursor. Slower in total, invisible to everyone else. <code>redis-cli --scan --pattern 'user:*'</code> wraps it for you.</span></div>
  <div class="kv"><span class="k">❌ <code>FLUSHALL</code></span><span class="v">Deletes every key in every database, instantly, with no confirmation and no undo. There is no version of this that is a good idea on a machine with real data.</span></div>
  <div class="kv"><span class="k">✅ <code>SCAN</code> + <code>UNLINK</code></span><span class="v">Delete what you meant to delete. <code>UNLINK</code> frees memory in a background thread, so removing a huge key does not block (Chapter 2).</span></div>
</div>
<pre><code>127.0.0.1:6379&gt; SCAN 0 MATCH 'user:*' COUNT 100
127.0.0.1:6379&gt; INFO keyspace</code></pre>
<div class="out">1) "0"
2) 1) "user:1042"
db0:keys=7,expires=1,avg_ttl=27412</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Redis data types</span><span class="lc-sub">One page per type with the commands, the complexity and a worked example. The best single map of what Redis can hold, and worth skimming before Chapter 3.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">The keyspace</span><span class="lc-sub">How keys work, what is legal in a key name, the cost of very long keys, and the exact semantics of <code>SCAN</code>'s guarantees — which are subtler than they look.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: your first commands</span><span class="lc-sub">Graded exercises: build a session with a TTL, a counter, a like-set and a leaderboard, then predict what <code>OBJECT ENCODING</code> reports before and after a value grows.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> running <code>KEYS *</code> "just to see what is in there". It is the first command everyone tries, it works instantly on a development box with forty keys, and it is a genuine outage on a production instance with two million. Redis is single-threaded: <code>KEYS</code> walks the entire keyspace in one uninterruptible operation, and every other client — your API, your workers, your healthcheck — waits behind it. Several seconds of total freeze is normal at a million keys, which is long enough for connection pools to time out and for your monitoring to declare the site down. Use <code>redis-cli --scan --pattern 'user:*'</code>, which does the same job in cursor-sized bites, or <code>DBSIZE</code> when all you want is the count. This is the first instance of a theme that runs through the whole course: <em>in a single-threaded server, one slow command is everyone's slow command.</em></div>
<p class="note-ct"><strong>Three things to remember.</strong> The keyspace is one flat dictionary — the colons in <code>user:1042:name</code> are a human convention, and picking one on day one saves you later. <code>TTL</code> returns seconds, or <code>-1</code> for no expiry, or <code>-2</code> for a key that does not exist; those last two are different and code often conflates them. And Redis silently switches its internal encoding as data grows, which is why a small hash costs a fraction of what you would expect — and why <code>OBJECT ENCODING</code> is worth checking when memory surprises you.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Năm phút đầu tiên của bạn</h2>
<p class="lead">Mười lăm câu lệnh, chạy theo thứ tự, và bạn sẽ chạm vào mọi ý tưởng mà phần còn lại của khoá này khai triển: khoá với giá trị, hết hạn, bộ đếm nguyên tử, năm cấu trúc dữ liệu cốt lõi, và cái sự thật rằng Redis chọn một cách biểu diễn nội bộ KHÁC NHAU tuỳ theo dữ liệu của bạn to cỡ nào.</p>

<h3>Khoá và giá trị</h3>
<pre><code>redis-cli
127.0.0.1:6379&gt; SET user:1042:name "Cường"
127.0.0.1:6379&gt; GET user:1042:name
127.0.0.1:6379&gt; EXISTS user:1042:name user:9999:name
127.0.0.1:6379&gt; TYPE user:1042:name
127.0.0.1:6379&gt; DEL user:1042:name</code></pre>
<div class="out">OK
"C\\xc6\\xb0\\xe1\\xbb\\x9dng"
(integer) 1
string
(integer) 1</div>
<div class="callout"><strong>Mấy dấu hai chấm trong <code>user:1042:name</code> chẳng có ý nghĩa gì với Redis.</strong> Không có không gian tên, không có bảng, không có phân cấp — toàn bộ không gian khoá là MỘT cuốn từ điển phẳng, và <code>user:1042:name</code> chỉ là một chuỗi mười bốn byte. Quy ước đó tồn tại thuần tuý cho con người và cho <code>SCAN --pattern</code>, và chọn một quy ước rồi theo nó nhất quán ngay từ cái khoá đầu tiên là một trong số ít quyết định mà đổi về sau thì tốn kém (Chương 2).</div>

<h3>Hết hạn, tính năng người ta hay dùng thiếu</h3>
<pre><code>127.0.0.1:6379&gt; SET session:8f21ac '{"uid":1042}' EX 30
127.0.0.1:6379&gt; TTL session:8f21ac
127.0.0.1:6379&gt; PERSIST session:8f21ac
127.0.0.1:6379&gt; TTL session:8f21ac
127.0.0.1:6379&gt; EXPIRE session:8f21ac 30
127.0.0.1:6379&gt; SET session:8f21ac '{"uid":1042}' KEEPTTL</code></pre>
<div class="out">OK
(integer) 28
(integer) 1
(integer) -1
(integer) 1
OK</div>
<p>Ba giá trị trả về đáng thuộc lòng ngay bây giờ. <code>TTL</code> cho số giây còn lại, <code>-1</code> nghĩa là khoá tồn tại và không có hạn, và <code>-2</code> nghĩa là khoá hoàn toàn không tồn tại. Trường hợp thứ ba mới là cái bẫy người ta: một khoá bị thiếu và một khoá bất tử trông giống nhau trong mã và có ý nghĩa hoàn toàn khác nhau.</p>

<h3>Bộ đếm, và vì sao nó không phải một cuộc đua</h3>
<pre><code>127.0.0.1:6379&gt; INCR page:home:views
127.0.0.1:6379&gt; INCRBY page:home:views 10
127.0.0.1:6379&gt; INCRBYFLOAT cart:1042:total 19.99
127.0.0.1:6379&gt; GET page:home:views</code></pre>
<div class="out">(integer) 1
(integer) 11
"19.99"
"11"</div>
<div class="callout ok"><strong><code>INCR</code> là đọc-sửa-ghi, và nó NGUYÊN TỬ — đó là toàn bộ ý nghĩa của nó.</strong> Mười nghìn client chạy <code>INCR</code> đồng thời cho ra đúng mười nghìn, không khoá, không giao dịch, không mất cập nhật nào. Trong ứng dụng của bạn, <code>counter = counter + 1</code> chạy trên hai tiến trình sẽ mất bớt lượt tăng; trong Redis thì không thể, vì máy chủ thực thi MỘT câu lệnh tại một thời điểm (Chương 1). Riêng tính chất này là lý do các bộ giới hạn tần suất và bộ đếm việc sống ở đây.</div>

<h3>Bốn cấu trúc bạn sẽ dùng nhiều nhất</h3>
<pre><code><span class="tok-comment"># List — có thứ tự, đẩy vào và lấy ra từ cả hai đầu</span>
127.0.0.1:6379&gt; RPUSH queue:emails "welcome:1042" "digest:1042"
127.0.0.1:6379&gt; LRANGE queue:emails 0 -1
127.0.0.1:6379&gt; LPOP queue:emails

<span class="tok-comment"># Set — không thứ tự, không trùng lặp, kiểm thành viên trong O(1)</span>
127.0.0.1:6379&gt; SADD post:77:likes 1042 2091 1042
127.0.0.1:6379&gt; SCARD post:77:likes
127.0.0.1:6379&gt; SISMEMBER post:77:likes 1042</code></pre>
<div class="out">(integer) 2
1) "welcome:1042"
2) "digest:1042"
"welcome:1042"
(integer) 2
(integer) 2
(integer) 1</div>
<pre><code><span class="tok-comment"># Sorted set — một tập hợp mà mỗi thành viên có một điểm số, luôn được giữ theo thứ tự</span>
127.0.0.1:6379&gt; ZADD leaderboard 1520 alice 1980 bob 2310 dave
127.0.0.1:6379&gt; ZREVRANGE leaderboard 0 1 WITHSCORES
127.0.0.1:6379&gt; ZSCORE leaderboard bob
127.0.0.1:6379&gt; ZINCRBY leaderboard 100 bob

<span class="tok-comment"># Hash — một cuốn từ điển nhỏ nằm dưới một cái khoá</span>
127.0.0.1:6379&gt; HSET user:1042 name "Cường" plan pro logins 41
127.0.0.1:6379&gt; HGET user:1042 plan
127.0.0.1:6379&gt; HINCRBY user:1042 logins 1
127.0.0.1:6379&gt; HGETALL user:1042</code></pre>
<div class="out">1) "dave"
2) "2310"
3) "bob"
4) "1980"
"1980"
"2080"
(integer) 3
"pro"
(integer) 42
1) "name"
2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
3) "plan"
4) "pro"
5) "logins"
6) "42"</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">chọn theo câu hỏi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Giá trị của X là gì?"</span><span class="lz-nsub">String — GET/SET. Mặc định, và đúng nhiều hơn mức người ta chịu thừa nhận.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"X có những trường nào?"</span><span class="lz-nsub">Hash — đọc hoặc cập nhật MỘT trường mà không đụng tới phần còn lại.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">tập hợp</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Chúng tới theo thứ tự nào?"</span><span class="lz-nsub">List — một hàng đợi, một dòng các mục gần đây, một cuốn log có trần.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"X có trong nhóm này không, và có bao nhiêu?"</span><span class="lz-nsub">Set — tính duy nhất, kiểm thành viên, giao nhau giữa các nhóm.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">cái mạnh nhất</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Top N là ai, và X đứng thứ mấy?"</span><span class="lz-nsub">Sorted set — bảng xếp hạng, hàng đợi ưu tiên, cửa sổ thời gian, việc hẹn giờ.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chương 3–5</span><span class="lz-nsub">Mỗi cái được một chương đầy đủ, kể cả những cái danh sách này bỏ qua: bitmap, HyperLogLog, geo và stream.</span></div></div>
  </div>
</div>

<h3>Nhìn xem Redis thật sự đang lưu nó thế nào</h3>
<pre><code>127.0.0.1:6379&gt; OBJECT ENCODING user:1042
127.0.0.1:6379&gt; HSET user:1042 bio "một dòng tiểu sử khá dài đẩy cái hash này vượt ngưỡng listpack 64 byte cho mỗi giá trị"
127.0.0.1:6379&gt; OBJECT ENCODING user:1042
127.0.0.1:6379&gt; MEMORY USAGE user:1042
127.0.0.1:6379&gt; DBSIZE</code></pre>
<div class="out">"listpack"
(integer) 1
"hashtable"
(integer) 312
(integer) 7</div>
<div class="callout ok"><strong>Cách mã hoá đã đổi ngay dưới chân bạn, và đó là mẹo hữu ích nhất của Redis.</strong> Một hash nhỏ được lưu dưới dạng <em>listpack</em> — một mảng gọn được quét tuyến tính, thứ vừa nhanh hơn vừa nhỏ hơn nhiều so với một bảng băm ở kích thước này. Một khi một giá trị vượt 64 byte hoặc cái hash vượt 128 trường, Redis lặng lẽ chuyển nó thành một bảng băm thật. Cùng câu lệnh, cùng kết quả, bộ nhớ khác nhau một trời một vực. Chương 5 đo khác biệt đó; nó thường là 5–10 lần và đó là lý do "cứ dùng hash đi" thường là lời khuyên tốt.</div>

<h3>Hai câu lệnh đừng bao giờ chạy trên production, và thứ thay thế</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ <code>KEYS *</code></span><span class="v">Quét toàn bộ không gian khoá trong MỘT thao tác chặn. Với một triệu khoá, nó làm đông cứng máy chủ vài giây — mọi client khác nằm chờ. Đó là cách phổ biến nhất người ta tự đánh sập Redis của chính mình.</span></div>
  <div class="kv"><span class="k">✅ <code>SCAN 0 MATCH user:* COUNT 100</code></span><span class="v">Duyệt theo từng mẻ nhỏ, trả về một con trỏ. Tổng thời gian chậm hơn, nhưng vô hình với mọi người khác. <code>redis-cli --scan --pattern 'user:*'</code> bọc sẵn cho bạn.</span></div>
  <div class="kv"><span class="k">❌ <code>FLUSHALL</code></span><span class="v">Xoá mọi khoá trong mọi cơ sở dữ liệu, tức khắc, không xác nhận và không hoàn tác. Không có phiên bản nào của việc này là ý hay trên một cái máy có dữ liệu thật.</span></div>
  <div class="kv"><span class="k">✅ <code>SCAN</code> + <code>UNLINK</code></span><span class="v">Xoá đúng thứ bạn định xoá. <code>UNLINK</code> giải phóng bộ nhớ ở một luồng nền, nên xoá một khoá khổng lồ không gây chặn (Chương 2).</span></div>
</div>
<pre><code>127.0.0.1:6379&gt; SCAN 0 MATCH 'user:*' COUNT 100
127.0.0.1:6379&gt; INFO keyspace</code></pre>
<div class="out">1) "0"
2) 1) "user:1042"
db0:keys=7,expires=1,avg_ttl=27412</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Các kiểu dữ liệu của Redis</span><span class="lc-sub">Mỗi kiểu một trang kèm câu lệnh, độ phức tạp và một ví dụ đã làm sẵn. Bản đồ tốt nhất về những gì Redis chứa được, đáng lướt qua trước Chương 3.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Không gian khoá</span><span class="lc-sub">Khoá hoạt động ra sao, cái gì hợp lệ trong một tên khoá, cái giá của khoá quá dài, và ngữ nghĩa chính xác về những gì <code>SCAN</code> bảo đảm — vốn tinh vi hơn vẻ ngoài.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: những câu lệnh đầu tiên</span><span class="lc-sub">Bài chấm điểm: dựng một phiên có TTL, một bộ đếm, một tập hợp lượt thích và một bảng xếp hạng, rồi đoán trước <code>OBJECT ENCODING</code> báo gì trước và sau khi một giá trị phình ra.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy <code>KEYS *</code> "chỉ để xem trong đó có gì". Đó là câu lệnh đầu tiên ai cũng thử, nó chạy tức thì trên một máy phát triển có bốn chục khoá, và nó là một sự cố THẬT trên một instance production có hai triệu khoá. Redis chạy một luồng: <code>KEYS</code> đi hết không gian khoá trong một thao tác không ngắt được, và mọi client khác — API của bạn, đám worker, cái healthcheck — nằm xếp hàng sau nó. Vài giây đông cứng toàn phần là bình thường ở mức một triệu khoá, đủ lâu để các bể kết nối hết giờ và để hệ giám sát tuyên bố trang web đã chết. Hãy dùng <code>redis-cli --scan --pattern 'user:*'</code>, thứ làm cùng công việc theo từng miếng cỡ con trỏ, hoặc <code>DBSIZE</code> khi tất cả những gì bạn cần là con số. Đây là lần đầu tiên xuất hiện một chủ đề chạy xuyên cả khoá học: <em>trong một máy chủ một luồng, một câu lệnh chậm là câu lệnh chậm của TẤT CẢ MỌI NGƯỜI.</em></div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Không gian khoá là một cuốn từ điển phẳng — mấy dấu hai chấm trong <code>user:1042:name</code> là quy ước của con người, và chọn một quy ước ngay ngày đầu là tiết kiệm về sau. <code>TTL</code> trả về số giây, hoặc <code>-1</code> khi không có hạn, hoặc <code>-2</code> khi khoá không tồn tại; hai cái sau khác nhau và mã nguồn hay gộp chúng làm một. Và Redis lặng lẽ đổi cách mã hoá nội bộ khi dữ liệu phình ra, đó là lý do một hash nhỏ tốn một phần nhỏ so với bạn tưởng — và là lý do <code>OBJECT ENCODING</code> đáng kiểm khi bộ nhớ làm bạn bất ngờ.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Quiz: getting oriented|||0.4 — Trắc nghiệm: định hướng',
      slug: 'rd-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về thang độ trễ, Redis không nên là gì, KEYS với SCAN, ba giá trị trả về của TTL, tính nguyên tử của INCR, và vì sao gắn 6379 ra ngoài là nguy hiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Getting oriented</h2>
<p class="lead">Six questions on the setup material. Nothing here is difficult; the point is that these four facts are the ones you will lean on in every chapter that follows.</p>
<div class="callout ok">Aim for 5/6. The two that matter most: why <code>KEYS *</code> is an outage on a real instance (0.3), and why publishing 6379 on all interfaces is dangerous regardless of your firewall (0.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Trắc nghiệm</span>
<h2>Định hướng</h2>
<p class="lead">Sáu câu về phần cài đặt. Không có gì khó ở đây; điểm mấu chốt là bốn sự thật này chính là những thứ bạn sẽ dựa vào ở mọi chương phía sau.</p>
<div class="callout ok">Nhắm 5/6. Hai câu quan trọng nhất: vì sao <code>KEYS *</code> là một sự cố trên một instance thật (0.3), và vì sao công bố 6379 trên mọi giao diện là nguy hiểm bất kể tường lửa của bạn (0.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'Redis reports a p50 latency of 0.31ms while its own operation took a few microseconds. Where did the rest of the time go?|||Redis báo độ trễ p50 là 0,31ms trong khi thao tác của chính nó chỉ tốn vài micro giây. Phần thời gian còn lại đi đâu?',
            options: [
              'Disk I/O for persistence|||Vào việc đọc ghi đĩa cho lưu lâu dài',
              'The network round trip — for most workloads the network is the cost and Redis itself is effectively free|||Vào một vòng đi-về của MẠNG — với phần lớn khối lượng công việc thì mạng mới là cái giá còn bản thân Redis gần như miễn phí',
              'Serialising the value to JSON|||Vào việc tuần tự hoá giá trị sang JSON',
              'Waiting for the single thread to become free|||Vào việc chờ cái luồng duy nhất rảnh ra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which of these is the WRONG job for Redis?|||Cái nào sau đây là công việc SAI cho Redis?',
            options: [
              'A rate limiter checked before every API call|||Một bộ giới hạn tần suất kiểm trước mọi lời gọi API',
              'A leaderboard read and written constantly|||Một bảng xếp hạng vừa đọc vừa ghi liên tục',
              'The single source of truth for your orders table, with joins and constraints|||Nguồn sự thật DUY NHẤT cho bảng đơn hàng của bạn, kèm join và ràng buộc',
              'A session store answering in under a millisecond|||Một kho phiên đăng nhập trả lời trong chưa tới một mili giây',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why is `KEYS *` dangerous on a production instance with two million keys?|||Vì sao `KEYS *` nguy hiểm trên một instance production có hai triệu khoá?',
            options: [
              'It returns too much data for redis-cli to display|||Nó trả về quá nhiều dữ liệu cho redis-cli hiển thị',
              'It permanently locks the keys it returns|||Nó khoá vĩnh viễn những khoá mà nó trả về',
              'It uses too much memory on the client|||Nó tốn quá nhiều bộ nhớ ở phía client',
              'Redis is single-threaded: KEYS walks the whole keyspace in one uninterruptible operation, so every other client waits — seconds of total freeze; use SCAN|||Redis chạy một luồng: KEYS đi hết không gian khoá trong một thao tác không ngắt được, nên mọi client khác phải chờ — vài giây đông cứng toàn phần; hãy dùng SCAN',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: '`TTL mykey` returns -2. What does that mean?|||`TTL mykey` trả về -2. Điều đó nghĩa là gì?',
            options: [
              'The key does not exist at all — while -1 means it exists with no expiry, and a positive number is the seconds remaining|||Khoá đó hoàn toàn không tồn tại — trong khi -1 nghĩa là nó tồn tại và không có hạn, còn số dương là số giây còn lại',
              'The key expired two seconds ago|||Khoá đã hết hạn hai giây trước',
              'The key has no expiry set|||Khoá không được đặt thời hạn nào',
              'The TTL command is not supported for that type|||Câu lệnh TTL không hỗ trợ kiểu dữ liệu đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Ten thousand clients run `INCR views` at the same instant. What is the final value, and why?|||Mười nghìn client cùng chạy `INCR views` tại đúng một thời điểm. Giá trị cuối cùng là bao nhiêu, và vì sao?',
            options: [
              'Somewhere below 10000, because of lost updates|||Đâu đó dưới 10000, vì có những lần cập nhật bị mất',
              'Exactly 10000 — the server executes one command at a time, so INCR is atomic with no locks and no lost updates|||Đúng 10000 — máy chủ thực thi MỘT câu lệnh tại một thời điểm, nên INCR là nguyên tử, không cần khoá và không mất cập nhật nào',
              'Exactly 10000, but only if you wrap it in MULTI/EXEC|||Đúng 10000, nhưng chỉ khi bạn bọc nó trong MULTI/EXEC',
              'Undefined; you must use a Lua script for correctness|||Không xác định; bạn phải dùng một script Lua mới đúng được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run `docker run -d -p 6379:6379 redis` on a VPS with UFW allowing only 22, 80 and 443. Is Redis reachable from the internet?|||Bạn chạy `docker run -d -p 6379:6379 redis` trên một con VPS với UFW chỉ cho phép 22, 80 và 443. Redis có với tới được từ Internet không?',
            options: [
              'No, UFW blocks port 6379|||Không, UFW chặn cổng 6379',
              'Only if you also disable protected mode|||Chỉ khi bạn cũng tắt chế độ bảo vệ',
              'Yes — Docker writes DNAT rules that run before UFW\'s filter rules, so the port is open and an unauthenticated Redis is compromised within hours; publish to 127.0.0.1 instead|||Có — Docker ghi luật DNAT chạy trước luật filter của UFW, nên cổng đó đang mở và một Redis không xác thực sẽ bị chiếm trong vài giờ; hãy công bố vào 127.0.0.1 thay vì vậy',
              'Only from machines on the same subnet|||Chỉ từ những máy trong cùng mạng con',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
