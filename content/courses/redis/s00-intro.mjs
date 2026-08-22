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
  ],
};
