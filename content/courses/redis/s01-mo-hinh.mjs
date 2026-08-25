/**
 * Redis — Chương 1: mô hình thực thi.
 * Một luồng · vòng lặp sự kiện · RESP · đường đi của một câu lệnh · pipeline · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 1 — The execution model|||Chương 1 — Mô hình thực thi',
  description: 'Vì sao một máy chủ MỘT luồng lại nhanh hơn phần lớn máy chủ đa luồng, chuyện gì xảy ra với một câu lệnh từ lúc byte tới cho tới lúc trả lời, giao thức RESP nhìn tận mắt, độ phức tạp là hợp đồng thật, và pipeline biến 100 vòng mạng thành một.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — One thread, and why that is fast|||1.1 — Một luồng, và vì sao thế là nhanh',
      slug: 'rd-1-1-mot-luong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng lặp sự kiện và epoll, vì sao bỏ khoá lại nhanh hơn là dùng khoá, Redis thật ra dùng luồng ở đâu, io-threads làm gì và không làm gì, và hệ quả duy nhất bạn phải sống chung.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>One thread, and why that is fast</h2>
<p class="lead">Redis executes every command on a single thread. That sounds like an obvious bottleneck and it is the opposite: it is the reason Redis is both fast and simple to reason about. Understanding <em>why</em> is the single most useful thing in this course, because every performance rule that follows is a consequence of it.</p>

<h3>What the single thread is actually doing</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · epoll_wait</span><span class="lz-t">"tell me which of these 10,000 sockets has data"</span><span class="lz-d">One syscall, and the kernel returns only the sockets that are ready. This is why ten thousand idle connections cost almost nothing — there is no thread parked on each one.</span></div>
  <div class="lz-step"><span class="lz-k">2 · read + parse</span><span class="lz-t">pull bytes, decode the RESP frame</span><span class="lz-d">Cheap: RESP is designed to be parsed without lookahead or allocation (Lesson 1.3). A few hundred nanoseconds.</span></div>
  <div class="lz-step"><span class="lz-k">3 · execute</span><span class="lz-t">the actual command, on in-memory data</span><span class="lz-d">A hash lookup and a pointer dereference. Usually under a microsecond — and with no locks, no atomics, no cache-line contention, because nothing else is running.</span></div>
  <div class="lz-step"><span class="lz-k">4 · buffer the reply, loop</span><span class="lz-t">write into the client's output buffer and go back to step 1</span><span class="lz-d">The actual <code>write()</code> happens when the socket is writable, not now. The loop never blocks on a client that is slow to read.</span></div>
</div>
<pre><code>redis-cli INFO server | grep -E 'multiplexing|io_threads'
redis-cli INFO clients | grep -E 'connected_clients|blocked'
redis-cli INFO stats | grep -E 'instantaneous_ops|total_connections'</code></pre>
<div class="out">multiplexing_api:epoll
io_threads_active:0
connected_clients:842
blocked_clients:3
instantaneous_ops_per_sec:71284
total_connections_received:1284419</div>
<p>842 connected clients, one thread, seventy thousand operations per second. Nothing about that is a contradiction: at any instant, almost every one of those 842 connections is idle, and the ones that are not are handled in microseconds each.</p>

<h3>Why removing threads made it faster</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">No locks</span><span class="v">A multi-threaded in-memory store has to protect every data structure with a mutex or a lock-free algorithm. Both cost time on every operation, and the cost grows with core count. Redis pays zero.</span></div>
  <div class="kv"><span class="k">No context switches</span><span class="v">A context switch is roughly 1–3 microseconds — comparable to the entire cost of a Redis command. A design that switches threads per request would spend more time switching than working.</span></div>
  <div class="kv"><span class="k">No cache-line contention</span><span class="v">Two cores writing near the same memory invalidate each other's caches constantly. One core touching its own working set keeps everything in L1 and L2.</span></div>
  <div class="kv"><span class="k">The bottleneck is elsewhere anyway</span><span class="v">Redis is bound by memory bandwidth and network I/O, not CPU. Adding cores does not widen either. A single core saturates a gigabit link long before it runs out of cycles.</span></div>
  <div class="kv"><span class="k">Correctness is free</span><span class="v">Every command is atomic by construction. No transaction machinery, no isolation levels, no torn reads — this is what makes <code>INCR</code>, rate limiters and locks trivially correct (Chapter 7).</span></div>
</div>
<pre><code><span class="tok-comment"># One process, and it really is using about one core</span>
docker exec redis sh -c 'ps -o pid,nlwp,pcpu,comm -p 1'
docker stats --no-stream --format '{{.Name}} CPU={{.CPUPerc}} MEM={{.MemUsage}}' redis</code></pre>
<div class="out">  PID NLWP %CPU COMMAND
    1    4 98.7 redis-server
redis CPU=98.72% MEM=41.8MiB / 256MiB</div>
<div class="callout"><strong>Four threads, one of which does the work.</strong> <code>NLWP</code> shows 4 because Redis has always used background threads for a few specific jobs — the point is that none of them execute commands. Which brings us to what those threads actually do.</div>

<h3>Where Redis does use threads</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">bio_close_file</span><span class="lz-lnote">Closing files without blocking — mostly old AOF files after a rewrite. A <code>close()</code> on a large file can take milliseconds and there is no reason the main loop should wait for it.</span></div>
  <div class="lz-layer"><span class="lz-lname">bio_aof_fsync</span><span class="lz-lnote">Flushing the append-only file to disk. With <code>appendfsync everysec</code> this happens in the background; with <code>always</code> it happens on the main thread and costs you real latency (Chapter 9).</span></div>
  <div class="lz-layer"><span class="lz-lname">bio_lazy_free</span><span class="lz-lnote">Freeing large objects. <code>UNLINK</code> hands a huge key to this thread instead of freeing it inline — which is why <code>UNLINK</code> is safe on a ten-million-element set and <code>DEL</code> is not (Chapter 2).</span></div>
  <div class="lz-layer"><span class="lz-lname">io-threads (optional, 6.0+)</span><span class="lz-lnote">Parallelises <em>reading and writing sockets</em>, never command execution. Helps only when the network layer is the bottleneck — a large instance with big values on a fast NIC. Default off, and correctly so for most people.</span></div>
  <div class="lz-layer"><span class="lz-lname">The fork, for RDB and AOF rewrite</span><span class="lz-lnote">Not a thread but a whole child process, using copy-on-write. This is where a "Redis pause" usually comes from on a large dataset (Chapter 9).</span></div>
</div>
<pre><code><span class="tok-comment"># io-threads: parallel socket I/O, still one thread executing commands</span>
redis-cli CONFIG SET io-threads 4        <span class="tok-comment"># requires a restart in most builds</span>
redis-cli INFO threads 2&gt;/dev/null | head -3
redis-cli CONFIG GET io-threads-do-reads</code></pre>
<div class="out">io_thread_0:clients=842,reads=1284419,writes=1284401
1) "io-threads-do-reads"
2) "no"</div>

<h3>The consequence you have to live with</h3>
<pre><code><span class="tok-comment"># Two terminals. In the first:</span>
redis-cli DEBUG SLEEP 3

<span class="tok-comment"># In the second, at the same time:</span>
time redis-cli PING</code></pre>
<div class="out">OK
PONG

real	0m3.014s</div>
<div class="callout warn"><strong>A <code>PING</code> took three seconds, and Redis was not busy — it was blocked.</strong> This is the entire trade. One slow command is not slow for one client; it is slow for <em>every</em> client, including your healthcheck and your connection pool. That is why the complexity notes in the command reference are not academic, why <code>KEYS</code> is dangerous, and why the rest of this course keeps returning to the same question: <em>how long does this command hold the thread?</em></div>
<div class="kv-grid">
  <div class="kv"><span class="k">O(1) commands</span><span class="v"><code>GET</code>, <code>SET</code>, <code>INCR</code>, <code>HGET</code>, <code>SADD</code>, <code>LPUSH</code>, <code>ZSCORE</code>. Constant time regardless of size. These are safe at any scale, and they are most of what you should be running.</span></div>
  <div class="kv"><span class="k">O(log N)</span><span class="v"><code>ZADD</code>, <code>ZRANK</code>, <code>ZRANGEBYSCORE</code>. A sorted set with ten million members is about 23 steps. Effectively free.</span></div>
  <div class="kv"><span class="k">O(N) on the collection</span><span class="v"><code>LRANGE 0 -1</code>, <code>HGETALL</code>, <code>SMEMBERS</code>, <code>ZRANGE 0 -1</code>. Fine on 100 elements, a stall on 10 million. The size of the collection is your responsibility.</span></div>
  <div class="kv"><span class="k">O(N) on the keyspace</span><span class="v"><code>KEYS</code>, <code>FLUSHALL</code>, <code>DBSIZE</code> in old versions, <code>SORT</code> without a limit. These scale with your <em>entire</em> dataset, which is the dangerous kind.</span></div>
  <div class="kv"><span class="k">The rule</span><span class="v">Anything whose cost grows with data you do not control is a latency incident waiting for enough data. Check the complexity line before you use a command you have not used before.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/protocol-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Redis internals — the event loop</span><span class="lc-sub">The protocol spec doubles as the clearest description of how a command travels from socket to reply. Lesson 1.3 walks through it byte by byte.</span></span>
</a>
<a class="link-card" href="http://antirez.com/news/126" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">antirez — on Redis threading</span><span class="lc-sub">The author explaining the single-threaded decision in his own words, including what changed his mind about io-threads. Worth reading for the reasoning, not just the conclusion.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Redis latency troubleshooting</span><span class="lc-sub">The official guide to why a single-threaded server stalls: slow commands, fork pauses, swap, transparent huge pages. Chapter 12 builds on it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: measure the block</span><span class="lc-sub">Graded exercises: reproduce the <code>DEBUG SLEEP</code> stall, classify eight commands by complexity, and predict which of them is safe on a collection you do not control the size of.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming a bigger server will fix Redis latency. Extra cores do nothing for command execution — the single thread uses one, and the other fifteen sit idle while your slow <code>SMEMBERS</code> holds everyone up. What actually helps, in order: stop running O(N) commands on large collections, split hot data across more Redis instances (Chapter 11), and only then look at faster single-core clock speed or a better NIC. This inverts the usual scaling instinct and it is the correct one here: Redis scales by <em>keeping every command short</em>, not by adding hardware. A useful diagnostic habit is to treat <code>SLOWLOG</code> (Chapter 12) as the first place to look whenever latency rises, because in a single-threaded server the slow command and the latency spike are always the same event.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One thread executing commands means every command is atomic for free — no locks, no transactions, no lost updates — and that is what makes <code>INCR</code> and rate limiters correct by construction. The price is that one slow command blocks everybody, so the complexity line in the command reference is an operational fact rather than trivia. And the background threads that do exist (<code>fsync</code>, lazy free, optional io-threads) never execute commands: adding cores does not make Redis faster.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Một luồng, và vì sao thế là nhanh</h2>
<p class="lead">Redis thực thi mọi câu lệnh trên MỘT luồng. Nghe thì như một nút thắt hiển nhiên và thực tế thì ngược lại: đó chính là lý do Redis vừa nhanh vừa dễ suy luận. Hiểu được <em>VÌ SAO</em> là thứ hữu ích nhất trong cả khoá này, vì mọi luật về hiệu năng phía sau đều là hệ quả của nó.</p>

<h3>Cái luồng duy nhất đó thật ra đang làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · epoll_wait</span><span class="lz-t">"cho tôi biết trong 10.000 socket này cái nào có dữ liệu"</span><span class="lz-d">Một lời gọi hệ thống, và nhân trả về ĐÚNG những socket đã sẵn sàng. Đây là lý do mười nghìn kết nối nhàn rỗi gần như không tốn gì — không có luồng nào đậu trên từng cái.</span></div>
  <div class="lz-step"><span class="lz-k">2 · đọc + phân tích</span><span class="lz-t">kéo byte về, giải mã khung RESP</span><span class="lz-d">Rẻ: RESP được thiết kế để phân tích mà không cần nhìn trước và không cần cấp phát (Bài 1.3). Vài trăm nano giây.</span></div>
  <div class="lz-step"><span class="lz-k">3 · thực thi</span><span class="lz-t">chính câu lệnh đó, trên dữ liệu nằm trong bộ nhớ</span><span class="lz-d">Một lần tra bảng băm và một lần giải tham chiếu con trỏ. Thường dưới một micro giây — và không khoá, không nguyên tử phần cứng, không tranh chấp dòng cache, vì chẳng có gì khác đang chạy.</span></div>
  <div class="lz-step"><span class="lz-k">4 · đệm câu trả lời, quay vòng</span><span class="lz-t">ghi vào bộ đệm ra của client rồi quay lại bước 1</span><span class="lz-d">Lệnh <code>write()</code> thật xảy ra khi socket ghi được, không phải ngay lúc này. Vòng lặp không bao giờ nghẽn vì một client đọc chậm.</span></div>
</div>
<pre><code>redis-cli INFO server | grep -E 'multiplexing|io_threads'
redis-cli INFO clients | grep -E 'connected_clients|blocked'
redis-cli INFO stats | grep -E 'instantaneous_ops|total_connections'</code></pre>
<div class="out">multiplexing_api:epoll
io_threads_active:0
connected_clients:842
blocked_clients:3
instantaneous_ops_per_sec:71284
total_connections_received:1284419</div>
<p>842 client đang kết nối, một luồng, bảy mươi nghìn thao tác mỗi giây. Chẳng có gì mâu thuẫn ở đó cả: tại bất kỳ khoảnh khắc nào, gần như toàn bộ 842 kết nối ấy đều nhàn rỗi, và những cái không nhàn rỗi thì được xử lý trong vài micro giây mỗi cái.</p>

<h3>Vì sao BỎ luồng đi lại làm nó nhanh hơn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không khoá</span><span class="v">Một kho dữ liệu trong bộ nhớ chạy đa luồng buộc phải bảo vệ mọi cấu trúc dữ liệu bằng mutex hoặc một thuật toán không khoá. Cả hai đều tốn thời gian ở MỌI thao tác, và cái giá tăng theo số nhân. Redis trả bằng không.</span></div>
  <div class="kv"><span class="k">Không chuyển ngữ cảnh</span><span class="v">Một lần chuyển ngữ cảnh tốn khoảng 1–3 micro giây — ngang bằng TOÀN BỘ chi phí của một câu lệnh Redis. Một thiết kế chuyển luồng cho mỗi yêu cầu sẽ tốn thời gian chuyển nhiều hơn thời gian làm việc.</span></div>
  <div class="kv"><span class="k">Không tranh chấp dòng cache</span><span class="v">Hai nhân cùng ghi gần một vùng nhớ sẽ liên tục làm hỏng cache của nhau. Một nhân chạm vào tập làm việc của chính nó thì giữ được mọi thứ trong L1 và L2.</span></div>
  <div class="kv"><span class="k">Đằng nào nút thắt cũng nằm chỗ khác</span><span class="v">Redis bị giới hạn bởi băng thông bộ nhớ và I/O mạng, không phải CPU. Thêm nhân không nới rộng cái nào trong hai thứ đó. Một nhân duy nhất làm bão hoà một đường gigabit từ rất lâu trước khi nó cạn chu kỳ.</span></div>
  <div class="kv"><span class="k">Tính đúng đắn là miễn phí</span><span class="v">Mọi câu lệnh nguyên tử theo cấu tạo. Không bộ máy giao dịch, không mức cô lập, không đọc dở dang — đây là thứ khiến <code>INCR</code>, các bộ giới hạn tần suất và khoá đúng một cách hiển nhiên (Chương 7).</span></div>
</div>
<pre><code><span class="tok-comment"># Một tiến trình, và nó đúng là đang dùng khoảng một nhân</span>
docker exec redis sh -c 'ps -o pid,nlwp,pcpu,comm -p 1'
docker stats --no-stream --format '{{.Name}} CPU={{.CPUPerc}} MEM={{.MemUsage}}' redis</code></pre>
<div class="out">  PID NLWP %CPU COMMAND
    1    4 98.7 redis-server
redis CPU=98.72% MEM=41.8MiB / 256MiB</div>
<div class="callout"><strong>Bốn luồng, trong đó MỘT cái làm việc.</strong> <code>NLWP</code> hiện 4 vì Redis xưa nay vẫn dùng luồng nền cho vài việc cụ thể — điểm mấu chốt là không cái nào trong số đó THỰC THI câu lệnh. Điều đó dẫn tới câu hỏi mấy cái luồng ấy thật ra làm gì.</div>

<h3>Chỗ Redis CÓ dùng luồng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">bio_close_file</span><span class="lz-lnote">Đóng file mà không gây chặn — chủ yếu là các file AOF cũ sau một lượt viết lại. Một lệnh <code>close()</code> trên file lớn có thể mất vài mili giây và không có lý do gì vòng lặp chính phải chờ nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">bio_aof_fsync</span><span class="lz-lnote">Đẩy file append-only xuống đĩa. Với <code>appendfsync everysec</code> chuyện này diễn ra ở nền; với <code>always</code> nó diễn ra trên luồng chính và bắt bạn trả bằng độ trễ thật (Chương 9).</span></div>
  <div class="lz-layer"><span class="lz-lname">bio_lazy_free</span><span class="lz-lnote">Giải phóng những đối tượng lớn. <code>UNLINK</code> giao một cái khoá khổng lồ cho luồng này thay vì giải phóng ngay tại chỗ — đó là lý do <code>UNLINK</code> an toàn trên một set mười triệu phần tử còn <code>DEL</code> thì không (Chương 2).</span></div>
  <div class="lz-layer"><span class="lz-lname">io-threads (tuỳ chọn, 6.0+)</span><span class="lz-lnote">Song song hoá việc <em>ĐỌC VÀ GHI SOCKET</em>, không bao giờ song song hoá việc thực thi câu lệnh. Chỉ giúp khi tầng mạng là nút thắt — một instance lớn với giá trị to trên một card mạng nhanh. Mặc định tắt, và tắt là đúng với phần lớn người dùng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cú fork, cho RDB và viết lại AOF</span><span class="lz-lnote">Không phải một luồng mà là hẳn một tiến trình con, dùng cơ chế sao-chép-khi-ghi. Đây thường là chỗ sinh ra một cú "Redis đứng hình" trên tập dữ liệu lớn (Chương 9).</span></div>
</div>
<pre><code><span class="tok-comment"># io-threads: I/O socket song song, vẫn MỘT luồng thực thi câu lệnh</span>
redis-cli CONFIG SET io-threads 4        <span class="tok-comment"># phần lớn bản dựng cần khởi động lại</span>
redis-cli INFO threads 2&gt;/dev/null | head -3
redis-cli CONFIG GET io-threads-do-reads</code></pre>
<div class="out">io_thread_0:clients=842,reads=1284419,writes=1284401
1) "io-threads-do-reads"
2) "no"</div>

<h3>Cái hệ quả bạn buộc phải sống chung</h3>
<pre><code><span class="tok-comment"># Hai cửa sổ terminal. Ở cái thứ nhất:</span>
redis-cli DEBUG SLEEP 3

<span class="tok-comment"># Ở cái thứ hai, cùng lúc đó:</span>
time redis-cli PING</code></pre>
<div class="out">OK
PONG

real	0m3.014s</div>
<div class="callout warn"><strong>Một lệnh <code>PING</code> mất ba giây, và Redis không hề bận — nó bị CHẶN.</strong> Đây là toàn bộ cuộc đánh đổi. Một câu lệnh chậm không phải là chậm với một client; nó chậm với <em>MỌI</em> client, kể cả cái healthcheck và cái bể kết nối của bạn. Đó là lý do những ghi chú về độ phức tạp trong trang tra cứu không hề mang tính hàn lâm, là lý do <code>KEYS</code> nguy hiểm, và là lý do phần còn lại của khoá này cứ quay về đúng một câu hỏi: <em>câu lệnh này giữ cái luồng đó bao lâu?</em></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Câu lệnh O(1)</span><span class="v"><code>GET</code>, <code>SET</code>, <code>INCR</code>, <code>HGET</code>, <code>SADD</code>, <code>LPUSH</code>, <code>ZSCORE</code>. Thời gian hằng số bất kể kích thước. Chúng an toàn ở mọi quy mô, và chúng chiếm phần lớn những gì bạn nên chạy.</span></div>
  <div class="kv"><span class="k">O(log N)</span><span class="v"><code>ZADD</code>, <code>ZRANK</code>, <code>ZRANGEBYSCORE</code>. Một sorted set mười triệu thành viên chỉ khoảng 23 bước. Coi như miễn phí.</span></div>
  <div class="kv"><span class="k">O(N) theo tập hợp</span><span class="v"><code>LRANGE 0 -1</code>, <code>HGETALL</code>, <code>SMEMBERS</code>, <code>ZRANGE 0 -1</code>. Ổn với 100 phần tử, đứng hình với 10 triệu. Kích thước của tập hợp là TRÁCH NHIỆM CỦA BẠN.</span></div>
  <div class="kv"><span class="k">O(N) theo không gian khoá</span><span class="v"><code>KEYS</code>, <code>FLUSHALL</code>, <code>DBSIZE</code> ở bản cũ, <code>SORT</code> không giới hạn. Chúng tăng theo TOÀN BỘ tập dữ liệu của bạn, và đó mới là loại nguy hiểm.</span></div>
  <div class="kv"><span class="k">Cái luật</span><span class="v">Bất cứ thứ gì có chi phí tăng theo dữ liệu mà bạn không kiểm soát được đều là một sự cố độ trễ đang chờ đủ dữ liệu. Hãy kiểm dòng độ phức tạp trước khi dùng một câu lệnh bạn chưa từng dùng.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/protocol-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Ruột gan Redis — vòng lặp sự kiện</span><span class="lc-sub">Bản đặc tả giao thức đồng thời là mô tả rõ nhất về đường một câu lệnh đi từ socket tới câu trả lời. Bài 1.3 đi qua nó từng byte một.</span></span>
</a>
<a class="link-card" href="http://antirez.com/news/126" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">antirez — về chuyện đa luồng của Redis</span><span class="lc-sub">Chính tác giả giải thích quyết định một luồng bằng lời của ông, kể cả điều gì đã làm ông đổi ý về io-threads. Đáng đọc vì phần lập luận, không chỉ vì kết luận.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Gỡ rối độ trễ Redis</span><span class="lc-sub">Hướng dẫn chính thức về vì sao một máy chủ một luồng lại đứng hình: câu lệnh chậm, cú dừng vì fork, swap, transparent huge pages. Chương 12 dựng tiếp trên nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đo cú chặn</span><span class="lc-sub">Bài chấm điểm: tái hiện cú đứng hình do <code>DEBUG SLEEP</code>, phân loại tám câu lệnh theo độ phức tạp, và đoán cái nào an toàn trên một tập hợp mà bạn không kiểm soát được kích thước.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng rằng một máy chủ to hơn sẽ chữa được độ trễ của Redis. Thêm nhân KHÔNG làm gì cho việc thực thi câu lệnh — cái luồng duy nhất dùng một nhân, còn mười lăm nhân kia ngồi chơi trong lúc lệnh <code>SMEMBERS</code> chậm của bạn giữ chân tất cả mọi người. Thứ thật sự giúp được, theo thứ tự: ngừng chạy các câu lệnh O(N) trên tập hợp lớn, tách dữ liệu nóng ra nhiều instance Redis (Chương 11), và chỉ sau đó mới ngó tới xung nhịp một nhân cao hơn hay một card mạng tốt hơn. Điều này lật ngược bản năng mở rộng thông thường và ở đây thì lật ngược mới là đúng: Redis mở rộng bằng cách <em>GIỮ CHO MỌI CÂU LỆNH ĐỀU NGẮN</em>, không phải bằng cách thêm phần cứng. Một thói quen chẩn đoán hữu ích là coi <code>SLOWLOG</code> (Chương 12) là chỗ đầu tiên phải nhìn mỗi khi độ trễ tăng, vì trong một máy chủ một luồng thì câu lệnh chậm và cú vọt độ trễ luôn luôn là CÙNG một sự kiện.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một luồng thực thi câu lệnh nghĩa là mọi câu lệnh đều nguyên tử miễn phí — không khoá, không giao dịch, không mất cập nhật — và đó là thứ khiến <code>INCR</code> với các bộ giới hạn tần suất đúng theo cấu tạo. Cái giá là một câu lệnh chậm chặn tất cả mọi người, nên dòng độ phức tạp trong trang tra cứu là một sự thật VẬN HÀNH chứ không phải chuyện vặt. Và những luồng nền có tồn tại (<code>fsync</code>, giải phóng lười, io-threads tuỳ chọn) không bao giờ thực thi câu lệnh: thêm nhân không làm Redis nhanh hơn.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — The life of a command|||1.2 — Vòng đời của một câu lệnh',
      slug: 'rd-1-2-vong-doi-lenh',
      type: 'LESSON',
      description: 'Từ byte trên socket tới câu trả lời: bộ đệm truy vấn, bảng tra câu lệnh, thực thi, nhân bản và AOF, bộ đệm ra; client output buffer limits; và vì sao một client chậm có thể bị ngắt kết nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>The life of a command</h2>
<p class="lead">Following one <code>SET</code> from the socket to the reply explains a surprising number of production behaviours: why a huge argument can be rejected, why a slow client gets disconnected, why replication is asynchronous by default, and where the AOF write actually happens relative to your reply.</p>

<h3>The path, end to end</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">arrival</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">epoll says socket 47 is readable</span><span class="lz-nsub">The main loop reads up to 16KB into that client's query buffer</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Parse the RESP frame</span><span class="lz-nsub">Incomplete? Keep the partial bytes and return to the loop. Nothing blocks waiting for the rest.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">execution</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Look up the command</span><span class="lz-nsub">A hash table from name to function pointer, plus arity, flags and ACL check</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Run it</span><span class="lz-nsub">On the in-memory structure. Nothing else runs during this. Microseconds — unless the command is O(N).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">propagation &amp; reply</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">If it wrote: to replicas and AOF buffer</span><span class="lz-nsub">Appended to buffers, not flushed. This is why replication is async and why <code>everysec</code> can lose a second.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Reply into the output buffer</span><span class="lz-nsub">The actual write() happens when the socket is writable. The loop never waits on a slow reader.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Watch a single client's buffers while it works</span>
redis-cli CLIENT LIST | head -2</code></pre>
<div class="out">id=8412 addr=172.19.0.5:51234 laddr=172.19.0.2:6379 fd=47 name=api age=1841 idle=0
 flags=N db=0 sub=0 psub=0 multi=-1 watch=0 qbuf=26 qbuf-free=20448 argv-mem=10
 multi-mem=0 tot-net-in=184219 tot-net-out=9128441 rbs=1024 rbp=0 obl=0 oll=0
 omem=0 tot-mem=22298 events=r cmd=get user=default resp=2</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>qbuf</code> / <code>qbuf-free</code></span><span class="v">The query buffer — bytes received and not yet executed. Grows if a client sends a huge argument or a long pipeline. Capped by <code>proto-max-bulk-len</code> (512MB default).</span></div>
  <div class="kv"><span class="k"><code>obl</code> / <code>oll</code> / <code>omem</code></span><span class="v">Output buffer: fixed part, list of pending replies, and total memory. <strong>This is the one that matters</strong> — it grows when Redis produces replies faster than the client reads them.</span></div>
  <div class="kv"><span class="k"><code>cmd</code></span><span class="v">The last command this client ran. Combined with <code>CLIENT LIST</code> this is how you find which client is doing the expensive thing (Chapter 12).</span></div>
  <div class="kv"><span class="k"><code>age</code> / <code>idle</code></span><span class="v">Seconds since connect, and since the last command. A pool with hundreds of clients at <code>idle=3600</code> is a pool that is far larger than it needs to be.</span></div>
  <div class="kv"><span class="k"><code>resp</code></span><span class="v">Protocol version, 2 or 3. RESP3 (Lesson 1.3) gives typed replies and client-side caching; most libraries still default to 2.</span></div>
</div>

<h3>The output buffer, and the client that gets disconnected</h3>
<pre><code>redis-cli CONFIG GET client-output-buffer-limit</code></pre>
<div class="out">1) "client-output-buffer-limit"
2) "normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">normal 0 0 0</span><span class="lz-t">no limit for regular clients</span><span class="lz-d">A normal client that stops reading can grow its buffer without bound — which means one client running <code>LRANGE huge 0 -1</code> and then stalling can consume your whole maxmemory. Consider setting a limit.</span></div>
  <div class="lz-step"><span class="lz-k">slave 256mb 64mb 60</span><span class="lz-t">hard limit, soft limit, soft seconds</span><span class="lz-d">A replica that falls 256MB behind is disconnected and must resync from scratch — an expensive event on a large dataset (Chapter 11). Raise this before a big write burst.</span></div>
  <div class="lz-step"><span class="lz-k">pubsub 32mb 8mb 60</span><span class="lz-t">the one people hit first</span><span class="lz-d">A subscriber that cannot keep up is dropped, silently, and simply stops receiving messages. This is the single most common cause of "Pub/Sub lost my message" (Chapter 8).</span></div>
  <div class="lz-step"><span class="lz-k">What "soft" means</span><span class="lz-t">over the soft limit for N seconds → disconnect</span><span class="lz-d">A brief spike is tolerated; sustained pressure is not. The hard limit disconnects immediately, no grace.</span></div>
</div>
<pre><code><span class="tok-comment"># Find a client whose output buffer is growing — the one about to be dropped</span>
redis-cli CLIENT LIST | awk '{for(i=1;i&lt;=NF;i++) if($i ~ /^omem=/){split($i,a,"=");
  if(a[2]+0 &gt; 1048576) print $1, $2, $i}}'
redis-cli INFO clients | grep -E 'client_recent_max_output|client_recent_max_input'</code></pre>
<div class="out">id=9117 addr=172.19.0.9:44120 omem=41893120
client_recent_max_input_buffer:20512
client_recent_max_output_buffer:41893120</div>

<h3>Where the write to disk actually happens</h3>
<pre><code>redis-cli CONFIG GET appendfsync
redis-cli SET order:8842 '{"total":19.99}'
redis-cli INFO persistence | grep -E 'aof_enabled|aof_last_write_status|rdb_changes'</code></pre>
<div class="out">1) "appendfsync"
2) "everysec"
OK
aof_enabled:1
aof_last_write_status:ok
rdb_changes_since_last_save:1</div>
<div class="callout warn"><strong>The <code>OK</code> came back before the data was on disk.</strong> With the default <code>appendfsync everysec</code>, your command was appended to an in-memory AOF buffer and flushed by a background thread up to a second later. If the machine loses power in that window, that write is gone — and your client was told it succeeded. This is not a bug; it is the default trade, and it is the right one for a cache. Chapter 9 covers <code>appendfsync always</code> (durable, and roughly an order of magnitude slower) and how to decide.</div>

<h3>Replication happens after the reply too</h3>
<pre><code><span class="tok-comment"># On the primary</span>
redis-cli SET k v
redis-cli WAIT 1 100                     <span class="tok-comment"># wait for 1 replica, max 100ms</span>
redis-cli INFO replication | grep -E 'role|connected_slaves|master_repl_offset'</code></pre>
<div class="out">OK
(integer) 1
role:master
connected_slaves:1
master_repl_offset:8841029</div>
<p><code>WAIT 1 100</code> returned 1, meaning one replica had acknowledged the write within 100ms. Without <code>WAIT</code>, the primary replies to your client immediately and propagates afterwards — so a primary that dies in that gap loses acknowledged writes. <code>WAIT</code> turns asynchronous replication into something closer to synchronous, at the cost of latency, and it is worth knowing about long before you need it (Chapter 11).</p>

<h3>The order of effects, which matters more than it looks</h3>
<pre><code><span class="tok-comment"># A key expires. What happens, and in what order?</span>
redis-cli SET temp v EX 1
sleep 2
redis-cli DBSIZE
redis-cli INFO stats | grep -E 'expired_keys|keyspace_misses'</code></pre>
<div class="out">OK
(integer) 7
expired_keys:1
keyspace_misses:1</div>
<div class="callout ok"><strong>Expiration is not a background sweep that runs on time.</strong> A key is removed either when someone touches it (lazy) or when the periodic sampling job happens to pick it (active) — and the deletion is then propagated to replicas and the AOF as an explicit <code>DEL</code>. That last detail is why a replica never expires keys on its own: it waits to be told, so that a read on the primary and the same read on a replica never disagree. Chapter 2 measures how long a key can linger past its TTL.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/client-list/" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">CLIENT LIST</span><span class="lc-sub">Every field explained, including the buffer counters used above. Together with <code>CLIENT KILL</code> and <code>CLIENT NO-EVICT</code>, this is the toolkit for a misbehaving connection.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">client-output-buffer-limit</span><span class="lc-sub">The three classes, the soft/hard distinction and the defaults. Read this before debugging a subscriber that "randomly stops receiving".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: follow a command</span><span class="lc-sub">Graded exercises: read a <code>CLIENT LIST</code> line and say what that client is doing, identify the connection about to be disconnected, and explain what <code>OK</code> guarantees under <code>appendfsync everysec</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating a successful reply as a durability guarantee. Redis returns <code>OK</code> when the command has been applied to the in-memory data structure — before the AOF is flushed and before any replica has acknowledged. Under the default settings that leaves two distinct windows in which an acknowledged write can vanish: up to one second of AOF buffer on a power loss, and the entire replication lag on a primary failure. Neither is a defect, and for a cache neither matters. They matter enormously the moment somebody stores something in Redis that has no other copy — a payment reference, a one-time token, the only record that an email was sent. The rule that keeps you out of trouble: if losing it would be a bug, either it lives in PostgreSQL, or you have deliberately configured <code>appendfsync always</code> and understood what it costs (Chapter 9).</div>
<p class="note-ct"><strong>Three things to remember.</strong> A command is parsed, executed, propagated to replicas and the AOF buffer, and only then written into an output buffer — the reply reaches your client before any of it is on disk. The output buffer is where a slow client becomes a server problem, and <code>client-output-buffer-limit</code> silently disconnects subscribers and replicas that fall behind. And <code>CLIENT LIST</code>'s <code>omem</code>, <code>qbuf</code> and <code>cmd</code> fields are how you find the one connection causing trouble.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Vòng đời của một câu lệnh</h2>
<p class="lead">Đi theo một lệnh <code>SET</code> từ socket tới câu trả lời giải thích được nhiều hành vi production hơn bạn tưởng: vì sao một tham số khổng lồ bị từ chối, vì sao một client chậm bị ngắt kết nối, vì sao nhân bản mặc định là bất đồng bộ, và cái lệnh ghi AOF thật ra xảy ra ở đâu so với câu trả lời của bạn.</p>

<h3>Đường đi, từ đầu tới cuối</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">tới nơi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">epoll báo socket 47 đọc được</span><span class="lz-nsub">Vòng lặp chính đọc tối đa 16KB vào bộ đệm truy vấn của client đó</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Phân tích khung RESP</span><span class="lz-nsub">Chưa đủ? Giữ lại phần byte dở dang rồi quay về vòng lặp. Không có gì nghẽn lại chờ phần còn lại.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">thực thi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tra bảng câu lệnh</span><span class="lz-nsub">Một bảng băm từ tên sang con trỏ hàm, cộng số tham số, cờ và phép kiểm ACL</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy nó</span><span class="lz-nsub">Trên cấu trúc nằm trong bộ nhớ. Không gì khác chạy trong lúc này. Vài micro giây — trừ khi câu lệnh là O(N).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">lan truyền &amp; trả lời</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nếu là lệnh ghi: tới bản sao và bộ đệm AOF</span><span class="lz-nsub">Được nối vào bộ đệm, CHƯA đẩy xuống đĩa. Đây là lý do nhân bản là bất đồng bộ và lý do <code>everysec</code> có thể mất một giây.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trả lời vào bộ đệm ra</span><span class="lz-nsub">Lệnh write() thật xảy ra khi socket ghi được. Vòng lặp không bao giờ chờ một bên đọc chậm.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Xem bộ đệm của một client trong lúc nó làm việc</span>
redis-cli CLIENT LIST | head -2</code></pre>
<div class="out">id=8412 addr=172.19.0.5:51234 laddr=172.19.0.2:6379 fd=47 name=api age=1841 idle=0
 flags=N db=0 sub=0 psub=0 multi=-1 watch=0 qbuf=26 qbuf-free=20448 argv-mem=10
 multi-mem=0 tot-net-in=184219 tot-net-out=9128441 rbs=1024 rbp=0 obl=0 oll=0
 omem=0 tot-mem=22298 events=r cmd=get user=default resp=2</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>qbuf</code> / <code>qbuf-free</code></span><span class="v">Bộ đệm truy vấn — số byte đã nhận và chưa thực thi. Phình ra nếu một client gửi một tham số khổng lồ hoặc một pipeline dài. Bị chặn trần bởi <code>proto-max-bulk-len</code> (mặc định 512MB).</span></div>
  <div class="kv"><span class="k"><code>obl</code> / <code>oll</code> / <code>omem</code></span><span class="v">Bộ đệm ra: phần cố định, danh sách câu trả lời đang chờ, và tổng bộ nhớ. <strong>ĐÂY mới là cái quan trọng</strong> — nó phình ra khi Redis sinh câu trả lời nhanh hơn tốc độ client đọc.</span></div>
  <div class="kv"><span class="k"><code>cmd</code></span><span class="v">Câu lệnh gần nhất client này đã chạy. Ghép với <code>CLIENT LIST</code>, đây là cách bạn tìm ra client nào đang làm cái việc tốn kém (Chương 12).</span></div>
  <div class="kv"><span class="k"><code>age</code> / <code>idle</code></span><span class="v">Số giây kể từ lúc kết nối, và kể từ câu lệnh gần nhất. Một bể kết nối có hàng trăm client ở mức <code>idle=3600</code> là một cái bể to hơn nhu cầu rất nhiều.</span></div>
  <div class="kv"><span class="k"><code>resp</code></span><span class="v">Phiên bản giao thức, 2 hoặc 3. RESP3 (Bài 1.3) cho câu trả lời có kiểu và cache phía client; phần lớn thư viện vẫn mặc định là 2.</span></div>
</div>

<h3>Bộ đệm ra, và cái client bị ngắt kết nối</h3>
<pre><code>redis-cli CONFIG GET client-output-buffer-limit</code></pre>
<div class="out">1) "client-output-buffer-limit"
2) "normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">normal 0 0 0</span><span class="lz-t">không giới hạn cho client thường</span><span class="lz-d">Một client thường mà ngừng đọc có thể phình bộ đệm vô hạn — nghĩa là một client chạy <code>LRANGE huge 0 -1</code> rồi đứng hình có thể ăn hết maxmemory của bạn. Nên cân nhắc đặt một giới hạn.</span></div>
  <div class="lz-step"><span class="lz-k">slave 256mb 64mb 60</span><span class="lz-t">giới hạn cứng, giới hạn mềm, số giây mềm</span><span class="lz-d">Một bản sao tụt lại 256MB sẽ bị ngắt và phải đồng bộ lại từ đầu — một sự kiện tốn kém trên tập dữ liệu lớn (Chương 11). Hãy nâng con số này TRƯỚC một đợt ghi lớn.</span></div>
  <div class="lz-step"><span class="lz-k">pubsub 32mb 8mb 60</span><span class="lz-t">cái người ta đụng phải đầu tiên</span><span class="lz-d">Một bên đăng ký không theo kịp sẽ bị vứt, trong im lặng, và đơn giản là ngừng nhận tin nhắn. Đây là nguyên nhân phổ biến nhất của câu "Pub/Sub làm mất tin nhắn của tôi" (Chương 8).</span></div>
  <div class="lz-step"><span class="lz-k">"mềm" nghĩa là gì</span><span class="lz-t">vượt giới hạn mềm trong N giây → ngắt kết nối</span><span class="lz-d">Một cú vọt ngắn được tha thứ; áp lực kéo dài thì không. Giới hạn cứng ngắt ngay lập tức, không có ân hạn.</span></div>
</div>
<pre><code><span class="tok-comment"># Tìm client có bộ đệm ra đang phình — cái sắp bị vứt</span>
redis-cli CLIENT LIST | awk '{for(i=1;i&lt;=NF;i++) if($i ~ /^omem=/){split($i,a,"=");
  if(a[2]+0 &gt; 1048576) print $1, $2, $i}}'
redis-cli INFO clients | grep -E 'client_recent_max_output|client_recent_max_input'</code></pre>
<div class="out">id=9117 addr=172.19.0.9:44120 omem=41893120
client_recent_max_input_buffer:20512
client_recent_max_output_buffer:41893120</div>

<h3>Lệnh ghi xuống đĩa thật ra xảy ra ở đâu</h3>
<pre><code>redis-cli CONFIG GET appendfsync
redis-cli SET order:8842 '{"total":19.99}'
redis-cli INFO persistence | grep -E 'aof_enabled|aof_last_write_status|rdb_changes'</code></pre>
<div class="out">1) "appendfsync"
2) "everysec"
OK
aof_enabled:1
aof_last_write_status:ok
rdb_changes_since_last_save:1</div>
<div class="callout warn"><strong>Chữ <code>OK</code> quay về TRƯỚC khi dữ liệu nằm trên đĩa.</strong> Với mặc định <code>appendfsync everysec</code>, câu lệnh của bạn được nối vào một bộ đệm AOF trong bộ nhớ rồi được một luồng nền đẩy xuống đĩa muộn nhất là một giây sau. Nếu cái máy mất điện trong khoảng đó thì lệnh ghi ấy biến mất — và client của bạn đã được báo là thành công. Đây không phải một cái lỗi; đó là sự đánh đổi mặc định, và nó ĐÚNG cho một cái cache. Chương 9 nói về <code>appendfsync always</code> (bền, và chậm hơn khoảng một bậc độ lớn) cùng cách quyết định.</div>

<h3>Nhân bản cũng xảy ra SAU câu trả lời</h3>
<pre><code><span class="tok-comment"># Trên máy chính</span>
redis-cli SET k v
redis-cli WAIT 1 100                     <span class="tok-comment"># chờ 1 bản sao, tối đa 100ms</span>
redis-cli INFO replication | grep -E 'role|connected_slaves|master_repl_offset'</code></pre>
<div class="out">OK
(integer) 1
role:master
connected_slaves:1
master_repl_offset:8841029</div>
<p><code>WAIT 1 100</code> trả về 1, nghĩa là một bản sao đã xác nhận lệnh ghi trong vòng 100ms. Không có <code>WAIT</code> thì máy chính trả lời cho client của bạn ngay lập tức rồi mới lan truyền — nên một máy chính chết trong khoảng trống đó sẽ mất những lệnh ghi ĐÃ ĐƯỢC XÁC NHẬN. <code>WAIT</code> biến nhân bản bất đồng bộ thành thứ gần đồng bộ hơn, đổi lại bằng độ trễ, và nó đáng biết từ rất lâu trước khi bạn cần tới (Chương 11).</p>

<h3>Thứ tự các hiệu ứng, quan trọng hơn vẻ ngoài</h3>
<pre><code><span class="tok-comment"># Một khoá hết hạn. Chuyện gì xảy ra, và theo thứ tự nào?</span>
redis-cli SET temp v EX 1
sleep 2
redis-cli DBSIZE
redis-cli INFO stats | grep -E 'expired_keys|keyspace_misses'</code></pre>
<div class="out">OK
(integer) 7
expired_keys:1
keyspace_misses:1</div>
<div class="callout ok"><strong>Hết hạn KHÔNG phải một lượt quét nền chạy đúng giờ.</strong> Một khoá bị gỡ đi hoặc khi có ai chạm vào nó (lười), hoặc khi công việc lấy mẫu định kỳ tình cờ bốc trúng nó (chủ động) — và việc xoá đó sau đó được lan truyền tới các bản sao và tới AOF dưới dạng một lệnh <code>DEL</code> tường minh. Chi tiết cuối đó là lý do một bản sao KHÔNG BAO GIỜ tự làm hết hạn khoá: nó chờ được bảo, để một lệnh đọc trên máy chính và cũng lệnh đọc đó trên bản sao không bao giờ nói khác nhau. Chương 2 đo xem một khoá có thể nán lại bao lâu sau TTL của nó.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/client-list/" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">CLIENT LIST</span><span class="lc-sub">Giải thích từng trường, gồm cả những bộ đếm bộ đệm dùng ở trên. Cùng với <code>CLIENT KILL</code> và <code>CLIENT NO-EVICT</code>, đây là bộ đồ nghề cho một kết nối cư xử bậy.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">client-output-buffer-limit</span><span class="lc-sub">Ba lớp, phân biệt mềm/cứng và các giá trị mặc định. Hãy đọc trang này trước khi gỡ lỗi một bên đăng ký "tự nhiên ngừng nhận tin".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đi theo một câu lệnh</span><span class="lc-sub">Bài chấm điểm: đọc một dòng <code>CLIENT LIST</code> rồi nói client đó đang làm gì, xác định kết nối sắp bị ngắt, và giải thích chữ <code>OK</code> bảo đảm điều gì dưới <code>appendfsync everysec</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi một câu trả lời thành công là một bảo đảm về ĐỘ BỀN. Redis trả <code>OK</code> khi câu lệnh đã được áp lên cấu trúc dữ liệu trong bộ nhớ — trước khi AOF được đẩy xuống đĩa và trước khi có bản sao nào xác nhận. Với thiết lập mặc định, điều đó để lại HAI khoảng trống riêng biệt mà trong đó một lệnh ghi đã được xác nhận vẫn có thể biến mất: tối đa một giây bộ đệm AOF khi mất điện, và toàn bộ độ trễ nhân bản khi máy chính chết. Không cái nào là khuyết tật, và với một cái cache thì cả hai đều không quan trọng. Chúng cực kỳ quan trọng ngay khoảnh khắc có ai đó cất vào Redis một thứ không có bản sao nào khác — một mã tham chiếu thanh toán, một token dùng một lần, bản ghi DUY NHẤT rằng một email đã được gửi. Cái luật giữ bạn khỏi rắc rối: nếu mất nó là một cái lỗi, thì hoặc nó sống trong PostgreSQL, hoặc bạn đã CỐ Ý cấu hình <code>appendfsync always</code> và hiểu cái giá của nó (Chương 9).</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một câu lệnh được phân tích, thực thi, lan truyền tới bản sao và bộ đệm AOF, rồi mới được ghi vào bộ đệm ra — câu trả lời tới client của bạn TRƯỚC khi bất cứ phần nào trong đó nằm trên đĩa. Bộ đệm ra là chỗ một client chậm trở thành vấn đề của máy chủ, và <code>client-output-buffer-limit</code> lặng lẽ ngắt những bên đăng ký với bản sao bị tụt lại. Và ba trường <code>omem</code>, <code>qbuf</code> với <code>cmd</code> của <code>CLIENT LIST</code> là cách bạn tìm ra đúng cái kết nối đang gây chuyện.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — RESP, the protocol you can read|||1.3 — RESP, giao thức bạn đọc được',
      slug: 'rd-1-3-resp',
      type: 'LESSON',
      description: 'Năm kiểu của RESP2 nhìn bằng netcat, vì sao nó được thiết kế thế, RESP3 thêm gì, gõ thẳng Redis bằng nc và openssl, và ba lỗi giao thức bạn sẽ gặp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>RESP, the protocol you can read</h2>
<p class="lead">Redis speaks a text protocol simple enough to type by hand, and doing that once permanently demystifies what a client library is. It is also the reason the parser is so cheap — a design decision from 2009 that still holds up.</p>

<h3>Talk to Redis with netcat</h3>
<pre><code>printf 'PING\\r\\nSET greeting hello\\r\\nGET greeting\\r\\nLLEN nolist\\r\\n' | nc -q1 localhost 6379 | cat -A | head -8</code></pre>
<div class="out">+PONG$
+OK$
$5$
hello$
:0$</div>
<p><code>cat -A</code> shows <code>$</code> for each line ending. Five replies, five type markers, and you have just used Redis without a client library. The inline form above is the human-friendly variant; real clients send the array form below.</p>

<h3>The five RESP2 types, in full</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">+ Simple string</span><span class="lz-lnote"><code>+OK\\r\\n</code> — a short status. Cannot contain a newline, which is why it is only used for fixed replies like <code>OK</code>, <code>PONG</code>, <code>QUEUED</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">- Error</span><span class="lz-lnote"><code>-WRONGTYPE Operation against a key…\\r\\n</code> — identical to a simple string except the first byte, and the first word is a machine-readable error code.</span></div>
  <div class="lz-layer"><span class="lz-lname">: Integer</span><span class="lz-lnote"><code>:1042\\r\\n</code> — a 64-bit signed integer. Also how booleans arrive in RESP2: <code>:1</code> and <code>:0</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ Bulk string</span><span class="lz-lnote"><code>$5\\r\\nhello\\r\\n</code> — a length prefix, then exactly that many <em>bytes</em>. Binary-safe: a JPEG, a null byte and a Vietnamese sentence all travel identically. <code>$-1\\r\\n</code> is nil.</span></div>
  <div class="lz-layer"><span class="lz-lname">* Array</span><span class="lz-lnote"><code>*2\\r\\n$3\\r\\nfoo\\r\\n$3\\r\\nbar\\r\\n</code> — a count, then that many elements of any type, nesting allowed. <strong>Every command you send is an array of bulk strings.</strong></span></div>
</div>
<pre><code><span class="tok-comment"># What your client library actually sends for: SET user:1 "Cường"</span>
printf '*3\\r\\n$3\\r\\nSET\\r\\n$6\\r\\nuser:1\\r\\n$7\\r\\nC\\xc6\\xb0\\xe1\\xbb\\x9dng\\r\\n' \\
  | nc -q1 localhost 6379
redis-cli STRLEN user:1</code></pre>
<div class="out">+OK
(integer) 7</div>
<div class="callout ok"><strong>Note <code>$7</code> for a five-character name.</strong> "Cường" is five characters and seven bytes in UTF-8, and RESP counts bytes. Redis has no concept of text encoding at all — it stores and returns byte sequences, and every question about "why is my string length wrong" is really a question about encoding in your own language. <code>STRLEN</code> agrees: 7.</div>

<h3>Why the design is what it is</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Length-prefixed, not delimited</span><span class="v">The parser knows exactly how many bytes to read, so it never scans for a terminator and never needs to escape anything. This is what makes it binary-safe and fast at the same time.</span></div>
  <div class="kv"><span class="k">One byte of type</span><span class="v">A single <code>switch</code> on the first character selects the parse path. No tokeniser, no state machine of any size, no allocation to decide what a reply is.</span></div>
  <div class="kv"><span class="k">Human-readable</span><span class="v">You can debug it with <code>tcpdump</code> or by typing it. Deliberate: the author chose a text protocol over a binary one specifically so that people could see what was happening.</span></div>
  <div class="kv"><span class="k">Requests and replies are asymmetric</span><span class="v">Requests are always arrays of bulk strings; replies use whichever type fits. That asymmetry is what lets replies be compact while requests stay trivially parseable.</span></div>
  <div class="kv"><span class="k">Old, and unchanged</span><span class="v">RESP2 has been stable since 2009. Your client library from 2014 still works today, which is not a small thing.</span></div>
</div>

<h3>RESP3, and what it adds</h3>
<pre><code>redis-cli -3 HGETALL user:1042
redis-cli    HGETALL user:1042
redis-cli -3 CLIENT INFO | tr ' ' '\\n' | grep resp</code></pre>
<div class="out">1# "name" =&gt; "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
2# "plan" =&gt; "pro"
1) "name"
2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
3) "plan"
4) "pro"
resp=3</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Maps are actually maps</span><span class="lz-t">%2\\r\\n instead of *4\\r\\n</span><span class="lz-d"><code>HGETALL</code> returns a map type rather than a flat array your client has to pair up. Small, but it removes a whole class of off-by-one bug in client libraries.</span></div>
  <div class="lz-step"><span class="lz-k">More types</span><span class="lz-t">double, boolean, big number, verbatim string, set</span><span class="lz-d">A score comes back as a real double instead of a string you parse. <code>SMEMBERS</code> returns a set, not an array that happens to be unique.</span></div>
  <div class="lz-step"><span class="lz-k">Push messages on the same connection</span><span class="lz-t">&gt;4\\r\\n</span><span class="lz-d">Pub/Sub messages no longer require a dedicated connection in subscribe mode — the biggest practical win, and what makes client-side caching possible.</span></div>
  <div class="lz-step"><span class="lz-k">Client-side caching</span><span class="lz-t">CLIENT TRACKING ON</span><span class="lz-d">Redis pushes an invalidation message when a key your client cached changes. A local cache with correct invalidation, which is normally the hard part (Chapter 6).</span></div>
</div>
<div class="callout"><strong>Most libraries still default to RESP2, and that is fine.</strong> RESP3 is opt-in per connection via <code>HELLO 3</code>, and every command works identically on both. Turn it on when you want typed replies or client-side caching; there is no urgency otherwise, and mixing versions across a fleet causes no problems.</div>

<h3>Three protocol errors you will actually see</h3>
<pre><code>redis-cli LPUSH user:1042 x
redis-cli SET
printf 'GET\\r\\n' | nc -q1 localhost 6379
redis-cli SET big "$(head -c 600000000 /dev/zero | tr '\\0' 'a')" 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">(error) WRONGTYPE Operation against a key holding the wrong kind of value
(error) ERR wrong number of arguments for 'set' command
-ERR wrong number of arguments for 'get' command
(error) ERR Protocol error: invalid bulk length</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>WRONGTYPE</code></span><span class="v">The key exists and holds a different type. Almost always a key-naming collision — two features chose the same key. Chapter 2 is largely about preventing this.</span></div>
  <div class="kv"><span class="k"><code>ERR wrong number of arguments</code></span><span class="v">Arity is checked before execution, from the command table. Usually an empty variable in a shell script: <code>redis-cli SET key "$VAL"</code> where <code>VAL</code> is unset sends two arguments, not three.</span></div>
  <div class="kv"><span class="k"><code>Protocol error: invalid bulk length</code></span><span class="v">An argument bigger than <code>proto-max-bulk-len</code> (512MB). If you are anywhere near this, the value does not belong in Redis — and a single 512MB value blocks the server while it is copied.</span></div>
  <div class="kv"><span class="k">Errors are strings with a code</span><span class="v">The first word is the machine-readable part: <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code>. Match on that, never on the human sentence after it.</span></div>
  <div class="kv"><span class="k"><code>LOADING</code> and <code>MASTERDOWN</code></span><span class="v">Transient errors during startup or failover. A client that treats every error as fatal will fall over during a routine restart; retry these (Chapter 11).</span></div>
</div>

<h3>Speaking it over TLS</h3>
<pre><code>openssl s_client -connect redis.example.com:6380 -quiet 2&gt;/dev/null &lt;&lt;'EOF'
PING
INFO server
EOF</code></pre>
<div class="out">+PONG
$3129
# Server
redis_version:7.4.1
redis_mode:standalone
tcp_port:6380</div>
<p>Exactly the same protocol, wrapped in TLS. That is all <code>--tls</code> does in <code>redis-cli</code>, and it is why enabling TLS changes nothing about how you use Redis — only the transport (Chapter 10).</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/protocol-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">The RESP specification</span><span class="lc-sub">Short, complete and readable in fifteen minutes — both RESP2 and RESP3, with the exact bytes for every type. One of the better protocol specs in existence.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/client-side-caching/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Client-side caching (tracking)</span><span class="lc-sub">The RESP3 feature with the biggest practical payoff: a local cache Redis invalidates for you. Covers both default and broadcast modes and their trade-offs.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: speak RESP by hand</span><span class="lc-sub">Graded exercises: send commands with <code>nc</code>, decode five raw replies into values, and explain why a five-character Vietnamese name reports a length of 7.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> matching on the human-readable part of an error message. Client code that checks <code>err.message === 'WRONGTYPE Operation against a key holding the wrong kind of value'</code> works until a version bump rewords the sentence, and then silently stops handling the case it was written for. The first word is the contract: <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code> are the machine-readable codes, and only they are stable across versions. Two of them matter for correctness rather than debugging: <code>LOADING</code> means the server is still reading its dataset from disk after a restart, and <code>READONLY</code> means you sent a write to a replica after a failover. Both are temporary and both should be retried — a client that treats them as fatal turns a routine restart into an outage.</div>
<p class="note-ct"><strong>Three things to remember.</strong> RESP is length-prefixed and binary-safe, which is why it is both trivially parseable and able to carry a JPEG — and why lengths are counted in <em>bytes</em>, not characters. Every command you send is an array of bulk strings; replies use whichever of the five types fits. And an error's first word is the stable machine-readable code — match on that, and retry <code>LOADING</code> and <code>READONLY</code> instead of failing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>RESP, giao thức bạn đọc được</h2>
<p class="lead">Redis nói một giao thức văn bản đơn giản tới mức gõ tay được, và làm chuyện đó một lần là vĩnh viễn hết huyền bí về việc một thư viện client thật ra là gì. Nó cũng là lý do bộ phân tích rẻ đến thế — một quyết định thiết kế từ 2009 mà tới nay vẫn đứng vững.</p>

<h3>Nói chuyện với Redis bằng netcat</h3>
<pre><code>printf 'PING\\r\\nSET greeting hello\\r\\nGET greeting\\r\\nLLEN nolist\\r\\n' | nc -q1 localhost 6379 | cat -A | head -8</code></pre>
<div class="out">+PONG$
+OK$
$5$
hello$
:0$</div>
<p><code>cat -A</code> hiện dấu <code>$</code> ở mỗi chỗ kết thúc dòng. Năm câu trả lời, năm dấu hiệu kiểu, và bạn vừa dùng Redis mà không cần thư viện client nào. Dạng viết thẳng ở trên là biến thể thân thiện với con người; client thật gửi dạng mảng ở dưới.</p>

<h3>Năm kiểu của RESP2, đầy đủ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">+ Chuỗi đơn giản</span><span class="lz-lnote"><code>+OK\\r\\n</code> — một trạng thái ngắn. Không chứa được ký tự xuống dòng, và đó là lý do nó chỉ dùng cho những câu trả lời cố định như <code>OK</code>, <code>PONG</code>, <code>QUEUED</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">- Lỗi</span><span class="lz-lnote"><code>-WRONGTYPE Operation against a key…\\r\\n</code> — giống hệt một chuỗi đơn giản trừ byte đầu tiên, và TỪ ĐẦU TIÊN là một mã lỗi máy đọc được.</span></div>
  <div class="lz-layer"><span class="lz-lname">: Số nguyên</span><span class="lz-lnote"><code>:1042\\r\\n</code> — một số nguyên có dấu 64 bit. Cũng là cách giá trị luận lý về trong RESP2: <code>:1</code> và <code>:0</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">$ Chuỗi khối</span><span class="lz-lnote"><code>$5\\r\\nhello\\r\\n</code> — một tiền tố độ dài, rồi đúng chừng đó <em>BYTE</em>. An toàn nhị phân: một tấm JPEG, một byte null và một câu tiếng Việt đều đi qua y hệt nhau. <code>$-1\\r\\n</code> là nil.</span></div>
  <div class="lz-layer"><span class="lz-lname">* Mảng</span><span class="lz-lnote"><code>*2\\r\\n$3\\r\\nfoo\\r\\n$3\\r\\nbar\\r\\n</code> — một số đếm, rồi chừng đó phần tử thuộc kiểu bất kỳ, lồng nhau được. <strong>Mọi câu lệnh bạn gửi đi đều là một mảng các chuỗi khối.</strong></span></div>
</div>
<pre><code><span class="tok-comment"># Thứ thư viện client của bạn thật sự gửi cho: SET user:1 "Cường"</span>
printf '*3\\r\\n$3\\r\\nSET\\r\\n$6\\r\\nuser:1\\r\\n$7\\r\\nC\\xc6\\xb0\\xe1\\xbb\\x9dng\\r\\n' \\
  | nc -q1 localhost 6379
redis-cli STRLEN user:1</code></pre>
<div class="out">+OK
(integer) 7</div>
<div class="callout ok"><strong>Để ý <code>$7</code> cho một cái tên năm ký tự.</strong> "Cường" là năm ký tự và bảy byte trong UTF-8, còn RESP đếm BYTE. Redis hoàn toàn không có khái niệm về bảng mã văn bản — nó lưu và trả về những dãy byte, và mọi câu hỏi kiểu "vì sao độ dài chuỗi của tôi sai" thật ra là câu hỏi về bảng mã trong chính ngôn ngữ của bạn. <code>STRLEN</code> đồng ý: 7.</div>

<h3>Vì sao thiết kế lại như vậy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiền tố độ dài, không dùng dấu phân cách</span><span class="v">Bộ phân tích biết chính xác phải đọc bao nhiêu byte, nên nó không bao giờ phải quét tìm ký tự kết thúc và không bao giờ phải thoát ký tự gì. Đây là thứ khiến nó vừa an toàn nhị phân vừa nhanh.</span></div>
  <div class="kv"><span class="k">Một byte cho kiểu</span><span class="v">Một lệnh <code>switch</code> trên ký tự đầu tiên chọn ra đường phân tích. Không bộ tách token, không máy trạng thái cỡ nào cả, không cấp phát để quyết định một câu trả lời là gì.</span></div>
  <div class="kv"><span class="k">Con người đọc được</span><span class="v">Bạn gỡ lỗi nó được bằng <code>tcpdump</code> hoặc bằng cách tự gõ. Có chủ đích: tác giả chọn giao thức văn bản thay vì nhị phân chính là để người ta NHÌN THẤY chuyện gì đang xảy ra.</span></div>
  <div class="kv"><span class="k">Yêu cầu và câu trả lời bất đối xứng</span><span class="v">Yêu cầu luôn là mảng các chuỗi khối; câu trả lời dùng kiểu nào hợp thì dùng. Chính sự bất đối xứng đó cho phép câu trả lời gọn trong khi yêu cầu vẫn dễ phân tích tới mức tầm thường.</span></div>
  <div class="kv"><span class="k">Cũ, và không đổi</span><span class="v">RESP2 ổn định từ 2009. Thư viện client của bạn từ 2014 tới nay vẫn chạy, và đó không phải chuyện nhỏ.</span></div>
</div>

<h3>RESP3, và nó thêm gì</h3>
<pre><code>redis-cli -3 HGETALL user:1042
redis-cli    HGETALL user:1042
redis-cli -3 CLIENT INFO | tr ' ' '\\n' | grep resp</code></pre>
<div class="out">1# "name" =&gt; "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
2# "plan" =&gt; "pro"
1) "name"
2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
3) "plan"
4) "pro"
resp=3</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Map đúng là map</span><span class="lz-t">%2\\r\\n thay vì *4\\r\\n</span><span class="lz-d"><code>HGETALL</code> trả về một kiểu map chứ không phải một mảng phẳng mà client của bạn phải tự ghép cặp. Nhỏ thôi, nhưng nó xoá bỏ nguyên một nhóm lỗi lệch-một trong các thư viện client.</span></div>
  <div class="lz-step"><span class="lz-k">Nhiều kiểu hơn</span><span class="lz-t">double, boolean, số lớn, chuỗi nguyên văn, set</span><span class="lz-d">Một điểm số về dưới dạng số thực thật thay vì một chuỗi bạn phải phân tích. <code>SMEMBERS</code> trả về một SET, không phải một mảng tình cờ không trùng lặp.</span></div>
  <div class="lz-step"><span class="lz-k">Tin đẩy trên cùng một kết nối</span><span class="lz-t">&gt;4\\r\\n</span><span class="lz-d">Tin nhắn Pub/Sub không còn đòi một kết nối riêng ở chế độ đăng ký nữa — cái lợi thực tế lớn nhất, và là thứ khiến cache phía client trở nên khả thi.</span></div>
  <div class="lz-step"><span class="lz-k">Cache phía client</span><span class="lz-t">CLIENT TRACKING ON</span><span class="lz-d">Redis đẩy một tin nhắn vô hiệu hoá khi một khoá mà client của bạn đã cache bị thay đổi. Một cái cache cục bộ có vô hiệu hoá ĐÚNG, thứ vốn là phần khó (Chương 6).</span></div>
</div>
<div class="callout"><strong>Phần lớn thư viện vẫn mặc định RESP2, và như vậy là ổn.</strong> RESP3 là thứ bật theo từng kết nối bằng <code>HELLO 3</code>, và mọi câu lệnh đều chạy y hệt trên cả hai. Hãy bật nó khi bạn muốn câu trả lời có kiểu hoặc muốn cache phía client; ngoài ra không có gì gấp, và trộn lẫn phiên bản trong một đội máy chẳng gây vấn đề gì.</div>

<h3>Ba lỗi giao thức bạn sẽ thật sự gặp</h3>
<pre><code>redis-cli LPUSH user:1042 x
redis-cli SET
printf 'GET\\r\\n' | nc -q1 localhost 6379
redis-cli SET big "$(head -c 600000000 /dev/zero | tr '\\0' 'a')" 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">(error) WRONGTYPE Operation against a key holding the wrong kind of value
(error) ERR wrong number of arguments for 'set' command
-ERR wrong number of arguments for 'get' command
(error) ERR Protocol error: invalid bulk length</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>WRONGTYPE</code></span><span class="v">Khoá đó tồn tại và đang giữ một kiểu khác. Gần như luôn là một cú đụng tên khoá — hai tính năng chọn trùng một cái khoá. Chương 2 chủ yếu nói về việc ngăn chuyện này.</span></div>
  <div class="kv"><span class="k"><code>ERR wrong number of arguments</code></span><span class="v">Số tham số được kiểm TRƯỚC khi thực thi, dựa vào bảng câu lệnh. Thường là một biến rỗng trong script shell: <code>redis-cli SET key "$VAL"</code> với <code>VAL</code> chưa đặt sẽ gửi hai tham số chứ không phải ba.</span></div>
  <div class="kv"><span class="k"><code>Protocol error: invalid bulk length</code></span><span class="v">Một tham số lớn hơn <code>proto-max-bulk-len</code> (512MB). Nếu bạn đang ở đâu đó gần con số này thì cái giá trị ấy không thuộc về Redis — và một giá trị 512MB đơn lẻ sẽ chặn máy chủ trong lúc nó được chép.</span></div>
  <div class="kv"><span class="k">Lỗi là chuỗi có kèm MÃ</span><span class="v">Từ đầu tiên là phần máy đọc được: <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code>. Hãy so khớp theo cái đó, đừng bao giờ so theo câu chữ dành cho người phía sau.</span></div>
  <div class="kv"><span class="k"><code>LOADING</code> và <code>MASTERDOWN</code></span><span class="v">Lỗi thoáng qua trong lúc khởi động hoặc chuyển dự phòng. Một client coi mọi lỗi là chí mạng sẽ ngã sập trong một lần khởi động lại bình thường; hãy thử lại với những cái này (Chương 11).</span></div>
</div>

<h3>Nói giao thức đó qua TLS</h3>
<pre><code>openssl s_client -connect redis.example.com:6380 -quiet 2&gt;/dev/null &lt;&lt;'EOF'
PING
INFO server
EOF</code></pre>
<div class="out">+PONG
$3129
# Server
redis_version:7.4.1
redis_mode:standalone
tcp_port:6380</div>
<p>Vẫn đúng giao thức đó, chỉ bọc trong TLS. Đó là tất cả những gì <code>--tls</code> làm trong <code>redis-cli</code>, và đó là lý do bật TLS không đổi gì trong cách bạn dùng Redis — chỉ đổi tầng vận chuyển (Chương 10).</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/protocol-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">Đặc tả RESP</span><span class="lc-sub">Ngắn, đầy đủ và đọc hết trong mười lăm phút — cả RESP2 lẫn RESP3, kèm byte chính xác cho từng kiểu. Một trong những bản đặc tả giao thức tốt nhất từng có.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/client-side-caching/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Cache phía client (tracking)</span><span class="lc-sub">Tính năng của RESP3 có lợi ích thực tế lớn nhất: một cái cache cục bộ được chính Redis vô hiệu hoá hộ. Bao gồm cả chế độ mặc định và chế độ quảng bá cùng các đánh đổi của chúng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự tay nói RESP</span><span class="lc-sub">Bài chấm điểm: gửi câu lệnh bằng <code>nc</code>, giải mã năm câu trả lời thô thành giá trị, và giải thích vì sao một cái tên tiếng Việt năm ký tự lại báo độ dài là 7.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> so khớp theo phần chữ dành cho con người trong một thông báo lỗi. Mã client kiểm <code>err.message === 'WRONGTYPE Operation against a key holding the wrong kind of value'</code> chạy được cho tới khi một lần nâng phiên bản viết lại câu đó, rồi nó lặng lẽ ngừng xử lý đúng trường hợp nó được viết ra để xử lý. TỪ ĐẦU TIÊN mới là hợp đồng: <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code> là các mã máy đọc được, và chỉ chúng mới ổn định qua các phiên bản. Hai trong số đó quan trọng cho tính ĐÚNG ĐẮN chứ không chỉ cho việc gỡ lỗi: <code>LOADING</code> nghĩa là máy chủ vẫn đang đọc tập dữ liệu từ đĩa sau một lần khởi động lại, và <code>READONLY</code> nghĩa là bạn vừa gửi một lệnh ghi tới một bản sao sau một lần chuyển dự phòng. Cả hai đều tạm thời và cả hai đều nên được thử lại — một client coi chúng là chí mạng sẽ biến một lần khởi động lại bình thường thành một sự cố.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> RESP dùng tiền tố độ dài và an toàn nhị phân, đó là lý do nó vừa dễ phân tích tới mức tầm thường vừa chở được một tấm JPEG — và là lý do độ dài đếm bằng <em>BYTE</em>, không phải ký tự. Mọi câu lệnh bạn gửi đi đều là một mảng các chuỗi khối; câu trả lời dùng kiểu nào trong năm kiểu mà hợp. Và từ đầu tiên của một lỗi là mã máy đọc được ổn định — hãy so khớp theo nó, và hãy THỬ LẠI với <code>LOADING</code> cùng <code>READONLY</code> thay vì báo hỏng.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Pipelining: 100 round trips become one|||1.4 — Pipeline: 100 vòng mạng thành một',
      slug: 'rd-1-4-pipeline',
      type: 'LESSON',
      description: 'Vì sao N câu lệnh tốn N vòng mạng, pipeline sửa chuyện đó thế nào, đo thật 50 lần nhanh hơn, giới hạn của kích thước lô, pipeline khác MULTI ở đâu, và chế độ nạp hàng loạt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Pipelining: 100 round trips become one</h2>
<p class="lead">Lesson 0.1 measured a p50 of 0.31ms where Redis itself spent a few microseconds. That gap is the network, and pipelining is how you stop paying it once per command. It is the single largest performance win available to most applications, and it requires no change to Redis at all.</p>

<h3>The problem, measured</h3>
<pre><code><span class="tok-comment"># 10,000 commands, one at a time</span>
time redis-cli --eval /dev/stdin 0 &lt;&lt;'EOF' &gt;/dev/null
return 1
EOF
time for i in $(seq 1 1000); do redis-cli SET "k:$i" v &gt;/dev/null; done</code></pre>
<div class="out">real	0m0.019s
real	0m8.412s</div>
<pre><code><span class="tok-comment"># The same 1,000 commands, pipelined</span>
time (for i in $(seq 1 1000); do echo "SET k:$i v"; done | redis-cli --pipe)</code></pre>
<div class="out">All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000
real	0m0.164s</div>
<div class="callout ok"><strong>8.4 seconds became 0.16 — fifty times faster, with the same commands and the same server.</strong> Nothing about Redis changed; what changed is that the client stopped waiting for each reply before sending the next request. The 8.4 seconds was almost entirely the client sitting idle waiting for the network.</div>

<h3>Why it works</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">without pipelining</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">send · wait · receive</span><span class="lz-nsub">× 1000. Each cycle costs one full round trip — the client is idle for almost all of it.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">1000 × 0.3ms ≈ 300ms of pure waiting</span><span class="lz-nsub">Redis did 1000 × 2µs = 2ms of actual work</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">with pipelining</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">send 1000 · then receive 1000</span><span class="lz-nsub">One round trip for the whole batch, plus the bytes on the wire</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">≈ 0.3ms + transfer</span><span class="lz-nsub">Redis still does 2ms of work — which is now the dominant cost, as it should be</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">what changed</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing on the server</span><span class="lz-nsub">Redis reads several commands out of one buffer read and executes them in order, exactly as before</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Everything on the client</span><span class="lz-nsub">Do not block on the reply. Every mainstream library exposes this; most people never use it.</span></div></div>
  </div>
</div>

<h3>In your application</h3>
<pre><code><span class="tok-comment">// node-redis</span>
const pipeline = client.multi();          <span class="tok-comment">// or client.multi({ isolated: false })</span>
for (const id of ids) pipeline.hGetAll(&#96;user:\${id}&#96;);
const users = await pipeline.exec();

<span class="tok-comment">// ioredis — an explicit pipeline, no transaction semantics</span>
const p = redis.pipeline();
for (const id of ids) p.hgetall(&#96;user:\${id}&#96;);
const results = await p.exec();           <span class="tok-comment">// [[err, value], ...]</span></code></pre>
<pre><code><span class="tok-comment"># Or skip the pipeline entirely when a variadic command exists</span>
redis-cli MGET user:1:name user:2:name user:3:name
redis-cli MSET a 1 b 2 c 3
redis-cli HMGET user:1042 name plan logins
redis-cli SADD tags:77 a b c d e</code></pre>
<div class="out">1) "alice"
2) "bob"
3) "carol"
OK
1) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
2) "pro"
3) "42"
(integer) 5</div>
<div class="callout"><strong>A variadic command beats a pipeline when one exists.</strong> <code>MGET</code> is a single command with a single reply — fewer bytes, one parse, and it works identically in Redis Cluster where a pipeline can span slots. Reach for a pipeline when the commands genuinely differ; reach for <code>MGET</code>, <code>MSET</code>, <code>HMGET</code>, <code>SADD</code> or <code>ZADD</code> with many arguments when they do not.</div>

<h3>How large a batch, and why not larger</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Memory on the server</span><span class="lz-t">every queued reply sits in the output buffer</span><span class="lz-d">A pipeline of 100,000 <code>HGETALL</code>s builds 100,000 replies in RAM before any are read. That is how a pipeline turns into an out-of-memory event.</span></div>
  <div class="lz-step"><span class="lz-k">Latency for everyone else</span><span class="lz-t">the batch executes as one uninterrupted run</span><span class="lz-d">Redis processes what it read; a 50,000-command batch is 50,000 commands of blocking for every other client. The single-threaded rule applies to pipelines too.</span></div>
  <div class="lz-step"><span class="lz-k">Diminishing returns</span><span class="lz-t">the win is mostly captured by 100</span><span class="lz-d">Going from 1 to 100 removes 99% of the round trips. Going from 100 to 10,000 removes 0.99% more and costs you the two problems above.</span></div>
  <div class="lz-step"><span class="lz-k">The practical range</span><span class="lz-t">100–1000 commands per batch</span><span class="lz-d">Chunk a large job and let each chunk complete. <code>redis-cli --pipe</code> does exactly this internally, which is why it handles a million-line file without trouble.</span></div>
</div>
<pre><code><span class="tok-comment">// Chunking, which is what you actually want for a big job</span>
const CHUNK = 500;
for (let i = 0; i &lt; ids.length; i += CHUNK) {
  const p = redis.pipeline();
  for (const id of ids.slice(i, i + CHUNK)) p.del(&#96;cache:user:\${id}&#96;);
  await p.exec();
}</code></pre>

<h3>Pipeline is not a transaction</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pipeline</span><span class="v">A batching optimisation. Commands execute in order but <em>other clients' commands can interleave between them</em>. Each reply is independent; one failing does not stop the rest.</span></div>
  <div class="kv"><span class="k">MULTI/EXEC</span><span class="v">A transaction. Commands are queued and then executed as one uninterrupted unit — nothing interleaves. Also pipelined as a side effect, but that is not its purpose (Chapter 7).</span></div>
  <div class="kv"><span class="k">Both, together</span><span class="v">Sending <code>MULTI … EXEC</code> through a pipeline is normal and useful: you get atomicity from <code>MULTI</code> and one round trip from the pipeline.</span></div>
  <div class="kv"><span class="k">Errors differ</span><span class="v">In a pipeline, command 3 failing leaves commands 4–10 running normally. In <code>MULTI</code>, a queueing error aborts the whole thing — but a <em>runtime</em> error does not roll anything back, which surprises people (Chapter 7).</span></div>
  <div class="kv"><span class="k">Confusingly, node-redis calls it <code>multi()</code></span><span class="v">In node-redis v4, <code>client.multi()</code> is a transaction by default. ioredis separates <code>pipeline()</code> from <code>multi()</code>. Check which you are getting; the names do not agree across libraries.</span></div>
</div>

<h3>Bulk loading, for when you have a million of them</h3>
<pre><code><span class="tok-comment"># Generate RESP directly and feed it to --pipe: the fastest possible load</span>
python3 - &lt;&lt;'PY' &gt; /tmp/load.resp
for i in range(1_000_000):
    k, v = f"user:{i}:seen", str(i)
    print(f"*3\\r\\n$3\\r\\nSET\\r\\n\${len(k)}\\r\\n{k}\\r\\n\${len(v)}\\r\\n{v}\\r", end="\\n")
PY
time redis-cli --pipe &lt; /tmp/load.resp</code></pre>
<div class="out">All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000000

real	0m4.812s</div>
<p>A million writes in under five seconds, from a shell. <code>--pipe</code> reads raw RESP, sends it as fast as the socket accepts, and counts replies as they come back — no client library, no per-command round trip. This is the correct tool for a migration, a warm-up, or restoring a cache after a flush, and it is worth remembering before you write a script that loops.</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/pipelining/" target="_blank" rel="noopener">
  <span class="lc-ico">🚄</span>
  <span class="lc-body"><span class="lc-title">Redis pipelining</span><span class="lc-sub">The official explanation with benchmarks, including the interaction with round-trip time on a real network and why pipelining beats "just use more connections".</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/patterns/bulk-loading/" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">Bulk loading with --pipe</span><span class="lc-sub">How to generate RESP for a mass import, and why this is dramatically faster than a loop of client calls. The example generator is worth copying.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: make it 50× faster</span><span class="lc-sub">Graded exercises: measure a loop against a pipeline, rewrite three loops as variadic commands, and explain why a 100,000-command batch is worse than 200 batches of 500.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a loop of <code>await redis.get(...)</code> inside a request handler. It looks completely ordinary, it passes review, and each iteration costs a full network round trip — so fetching fifty cached user records takes fifty round trips and turns a 2ms operation into 15ms of waiting. The tell is easy to spot once you know it: any <code>for</code> or <code>map</code> loop with an <code>await</code> on a Redis call inside it. The fix is one of three, in order of preference: use the variadic command if one exists (<code>MGET</code>, <code>HMGET</code>), use a pipeline if the commands differ, or restructure so you need one key instead of fifty — a hash, or a JSON blob, or a sorted set range. This is the same shape as the N+1 query problem in SQL, it is just less visible because each individual call is genuinely fast.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Without pipelining you pay one network round trip per command, and for most applications that is where nearly all the time goes — 1,000 sequential commands took 8.4 seconds where a pipeline took 0.16. Batch 100–1000 at a time, not 100,000: every queued reply sits in the server's output buffer, and the batch blocks everyone else while it runs. And a pipeline is <em>not</em> a transaction — other clients interleave between your commands, and one failure does not stop the rest.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Pipeline: 100 vòng mạng thành một</h2>
<p class="lead">Bài 0.1 đo được p50 là 0,31ms trong khi bản thân Redis chỉ tốn vài micro giây. Cái khoảng cách đó chính là MẠNG, và pipeline là cách bạn thôi phải trả nó một lần cho mỗi câu lệnh. Đây là món lợi hiệu năng lớn nhất mà phần lớn ứng dụng có sẵn, và nó hoàn toàn không cần đổi gì ở Redis.</p>

<h3>Vấn đề, đo bằng số</h3>
<pre><code><span class="tok-comment"># 10.000 câu lệnh, chạy từng cái một</span>
time redis-cli --eval /dev/stdin 0 &lt;&lt;'EOF' &gt;/dev/null
return 1
EOF
time for i in $(seq 1 1000); do redis-cli SET "k:$i" v &gt;/dev/null; done</code></pre>
<div class="out">real	0m0.019s
real	0m8.412s</div>
<pre><code><span class="tok-comment"># Cũng 1.000 câu lệnh đó, đóng thành pipeline</span>
time (for i in $(seq 1 1000); do echo "SET k:$i v"; done | redis-cli --pipe)</code></pre>
<div class="out">All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000
real	0m0.164s</div>
<div class="callout ok"><strong>8,4 giây thành 0,16 — nhanh gấp năm mươi lần, với cùng câu lệnh và cùng máy chủ.</strong> Không có gì ở Redis thay đổi cả; thứ thay đổi là client thôi không chờ từng câu trả lời trước khi gửi yêu cầu kế tiếp. 8,4 giây đó gần như hoàn toàn là client ngồi không đợi mạng.</div>

<h3>Vì sao nó chạy được</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">không pipeline</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">gửi · chờ · nhận</span><span class="lz-nsub">× 1000. Mỗi chu kỳ tốn trọn một vòng mạng — client ngồi không gần như suốt.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">1000 × 0,3ms ≈ 300ms chờ thuần tuý</span><span class="lz-nsub">Redis làm 1000 × 2µs = 2ms công việc thật</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">có pipeline</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">gửi 1000 · rồi nhận 1000</span><span class="lz-nsub">Một vòng mạng cho cả lô, cộng thời gian byte chạy trên dây</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">≈ 0,3ms + truyền tải</span><span class="lz-nsub">Redis vẫn làm 2ms công việc — giờ nó là chi phí chính, đúng như phải thế</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">cái gì đã đổi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không gì ở phía máy chủ</span><span class="lz-nsub">Redis đọc nhiều câu lệnh ra từ một lần đọc bộ đệm rồi thực thi theo thứ tự, y hệt như trước</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tất cả ở phía client</span><span class="lz-nsub">Đừng nghẽn lại chờ câu trả lời. Mọi thư viện phổ biến đều có; phần lớn người ta không bao giờ dùng.</span></div></div>
  </div>
</div>

<h3>Trong ứng dụng của bạn</h3>
<pre><code><span class="tok-comment">// node-redis</span>
const pipeline = client.multi();          <span class="tok-comment">// hoặc client.multi({ isolated: false })</span>
for (const id of ids) pipeline.hGetAll(&#96;user:\${id}&#96;);
const users = await pipeline.exec();

<span class="tok-comment">// ioredis — một pipeline tường minh, không mang ngữ nghĩa giao dịch</span>
const p = redis.pipeline();
for (const id of ids) p.hgetall(&#96;user:\${id}&#96;);
const results = await p.exec();           <span class="tok-comment">// [[err, value], ...]</span></code></pre>
<pre><code><span class="tok-comment"># Hoặc bỏ hẳn pipeline khi đã có sẵn một câu lệnh nhận nhiều tham số</span>
redis-cli MGET user:1:name user:2:name user:3:name
redis-cli MSET a 1 b 2 c 3
redis-cli HMGET user:1042 name plan logins
redis-cli SADD tags:77 a b c d e</code></pre>
<div class="out">1) "alice"
2) "bob"
3) "carol"
OK
1) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
2) "pro"
3) "42"
(integer) 5</div>
<div class="callout"><strong>Một câu lệnh nhận nhiều tham số thắng một pipeline khi nó tồn tại.</strong> <code>MGET</code> là MỘT câu lệnh với MỘT câu trả lời — ít byte hơn, một lần phân tích, và nó chạy y hệt trong Redis Cluster nơi một pipeline có thể trải qua nhiều slot. Hãy với tới pipeline khi các câu lệnh thật sự khác nhau; hãy với tới <code>MGET</code>, <code>MSET</code>, <code>HMGET</code>, <code>SADD</code> hay <code>ZADD</code> với nhiều tham số khi chúng không khác.</div>

<h3>Lô lớn cỡ nào, và vì sao không lớn hơn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bộ nhớ ở máy chủ</span><span class="lz-t">mọi câu trả lời xếp hàng đều nằm trong bộ đệm ra</span><span class="lz-d">Một pipeline gồm 100.000 lệnh <code>HGETALL</code> dựng ra 100.000 câu trả lời trong RAM trước khi có cái nào được đọc. Đó là cách một pipeline biến thành một sự kiện hết bộ nhớ.</span></div>
  <div class="lz-step"><span class="lz-k">Độ trễ cho mọi người khác</span><span class="lz-t">cả lô chạy như một mạch không ngắt</span><span class="lz-d">Redis xử lý những gì nó đã đọc; một lô 50.000 câu lệnh là 50.000 câu lệnh chặn với mọi client khác. Luật một luồng áp cho cả pipeline.</span></div>
  <div class="lz-step"><span class="lz-k">Lợi ích giảm dần</span><span class="lz-t">phần lợi đã được gom gần hết ở mốc 100</span><span class="lz-d">Đi từ 1 lên 100 xoá 99% số vòng mạng. Đi từ 100 lên 10.000 xoá thêm 0,99% nữa và bắt bạn trả bằng hai vấn đề ở trên.</span></div>
  <div class="lz-step"><span class="lz-k">Khoảng thực tế</span><span class="lz-t">100–1000 câu lệnh mỗi lô</span><span class="lz-d">Hãy chia một việc lớn thành từng mẻ và để mỗi mẻ chạy xong. <code>redis-cli --pipe</code> làm đúng chuyện này ở bên trong, và đó là lý do nó xử lý một file triệu dòng không chút vất vả.</span></div>
</div>
<pre><code><span class="tok-comment">// Chia mẻ, thứ bạn thật sự cần cho một việc lớn</span>
const CHUNK = 500;
for (let i = 0; i &lt; ids.length; i += CHUNK) {
  const p = redis.pipeline();
  for (const id of ids.slice(i, i + CHUNK)) p.del(&#96;cache:user:\${id}&#96;);
  await p.exec();
}</code></pre>

<h3>Pipeline KHÔNG phải giao dịch</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pipeline</span><span class="v">Một phép tối ưu gom lô. Câu lệnh chạy theo thứ tự nhưng <em>câu lệnh của client khác CÓ THỂ xen vào giữa chúng</em>. Mỗi câu trả lời độc lập; một cái hỏng không chặn phần còn lại.</span></div>
  <div class="kv"><span class="k">MULTI/EXEC</span><span class="v">Một giao dịch. Câu lệnh được xếp hàng rồi thực thi như một khối không ngắt được — không gì xen vào. Nó cũng được đóng pipeline như một hệ quả phụ, nhưng đó không phải mục đích của nó (Chương 7).</span></div>
  <div class="kv"><span class="k">Cả hai, cùng lúc</span><span class="v">Gửi <code>MULTI … EXEC</code> qua một pipeline là chuyện bình thường và hữu ích: bạn có tính nguyên tử từ <code>MULTI</code> và một vòng mạng từ pipeline.</span></div>
  <div class="kv"><span class="k">Lỗi hành xử khác nhau</span><span class="v">Trong một pipeline, câu lệnh số 3 hỏng thì câu 4–10 vẫn chạy bình thường. Trong <code>MULTI</code>, một lỗi lúc xếp hàng huỷ toàn bộ — nhưng một lỗi lúc CHẠY thì không quay lui gì cả, và chuyện đó làm người ta bất ngờ (Chương 7).</span></div>
  <div class="kv"><span class="k">Rối ở chỗ node-redis gọi nó là <code>multi()</code></span><span class="v">Trong node-redis v4, <code>client.multi()</code> mặc định là một GIAO DỊCH. ioredis tách <code>pipeline()</code> khỏi <code>multi()</code>. Hãy kiểm xem bạn đang nhận cái nào; tên gọi không thống nhất giữa các thư viện.</span></div>
</div>

<h3>Nạp hàng loạt, cho lúc bạn có cả triệu cái</h3>
<pre><code><span class="tok-comment"># Sinh thẳng RESP rồi đút cho --pipe: cách nạp nhanh nhất có thể</span>
python3 - &lt;&lt;'PY' &gt; /tmp/load.resp
for i in range(1_000_000):
    k, v = f"user:{i}:seen", str(i)
    print(f"*3\\r\\n$3\\r\\nSET\\r\\n\${len(k)}\\r\\n{k}\\r\\n\${len(v)}\\r\\n{v}\\r", end="\\n")
PY
time redis-cli --pipe &lt; /tmp/load.resp</code></pre>
<div class="out">All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000000

real	0m4.812s</div>
<p>Một triệu lệnh ghi trong chưa tới năm giây, từ một cái shell. <code>--pipe</code> đọc RESP thô, gửi đi nhanh hết mức socket nhận được, và đếm câu trả lời khi chúng quay về — không thư viện client, không vòng mạng cho từng câu lệnh. Đây là công cụ ĐÚNG cho một lần di chuyển dữ liệu, một lần làm nóng cache, hoặc khôi phục cache sau một lần xoá sạch, và nó đáng nhớ trước khi bạn ngồi viết một script chạy vòng lặp.</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/pipelining/" target="_blank" rel="noopener">
  <span class="lc-ico">🚄</span>
  <span class="lc-body"><span class="lc-title">Pipeline trong Redis</span><span class="lc-sub">Giải thích chính thức kèm số đo, gồm cả tương tác với thời gian vòng mạng trên một mạng thật và vì sao pipeline thắng cách "cứ mở thêm nhiều kết nối".</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/patterns/bulk-loading/" target="_blank" rel="noopener">
  <span class="lc-ico">📥</span>
  <span class="lc-body"><span class="lc-title">Nạp hàng loạt bằng --pipe</span><span class="lc-sub">Cách sinh RESP cho một lần nhập khối lượng lớn, và vì sao cách này nhanh hơn hẳn một vòng lặp gọi client. Đoạn sinh dữ liệu mẫu đáng chép về.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm nó nhanh gấp 50 lần</span><span class="lc-sub">Bài chấm điểm: đo một vòng lặp so với một pipeline, viết lại ba vòng lặp thành câu lệnh nhiều tham số, và giải thích vì sao một lô 100.000 câu lệnh tệ hơn 200 lô mỗi lô 500.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một vòng lặp <code>await redis.get(...)</code> nằm trong một hàm xử lý request. Nó trông hoàn toàn bình thường, nó qua được review, và mỗi lượt lặp tốn trọn một vòng mạng — nên lấy năm mươi bản ghi người dùng đã cache tốn năm mươi vòng mạng và biến một thao tác 2ms thành 15ms ngồi chờ. Dấu hiệu rất dễ nhận ra khi bạn đã biết: bất kỳ vòng <code>for</code> hay <code>map</code> nào có một lệnh <code>await</code> gọi Redis bên trong. Cách chữa là một trong ba, theo thứ tự ưu tiên: dùng câu lệnh nhiều tham số nếu có (<code>MGET</code>, <code>HMGET</code>), dùng pipeline nếu các câu lệnh khác nhau, hoặc tái cấu trúc để bạn chỉ cần MỘT khoá thay vì năm mươi — một cái hash, hoặc một khối JSON, hoặc một dải sorted set. Đây cùng hình dạng với bài toán truy vấn N+1 trong SQL, chỉ khó thấy hơn vì từng lời gọi riêng lẻ đúng là nhanh thật.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Không có pipeline thì bạn trả một vòng mạng cho MỖI câu lệnh, và với phần lớn ứng dụng thì gần như toàn bộ thời gian đi vào đó — 1.000 câu lệnh tuần tự mất 8,4 giây trong khi một pipeline mất 0,16. Hãy gom lô 100–1000 một lần, đừng 100.000: mọi câu trả lời xếp hàng đều nằm trong bộ đệm ra của máy chủ, và cả lô chặn mọi người khác trong lúc nó chạy. Và một pipeline KHÔNG phải giao dịch — client khác xen được vào giữa các câu lệnh của bạn, và một cái hỏng không chặn phần còn lại.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Clients, pools and timeouts|||1.5 — Client, bể kết nối và thời gian chờ',
      slug: 'rd-1-5-client-pool',
      type: 'LESSON',
      description: 'Vì sao một kết nối thường là đủ, khi nào bạn cần một bể, những câu lệnh chiếm hẳn một kết nối, đặt thời gian chờ cho đúng, kết nối lại và thử lại, và cách đọc CLIENT LIST khi bể bị cạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Clients, pools and timeouts</h2>
<p class="lead">Connection handling is where most Redis client bugs live, and the reason is a mismatch of intuitions: people bring habits from SQL, where a connection is expensive and a pool is mandatory. Redis connections are cheap and its commands are fast, which changes the right answer — and creates a specific set of traps around the few commands that block.</p>

<h3>One connection is usually enough</h3>
<pre><code><span class="tok-comment">// node-redis: ONE client, shared, created once at startup</span>
import { createClient } from 'redis';
export const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (e) =&gt; console.error('redis:', e.message));
await redis.connect();</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Commands are pipelined automatically</span><span class="v">A single connection can have many commands in flight — the client writes them out and matches replies in order. Concurrency does not require concurrency of sockets.</span></div>
  <div class="kv"><span class="k">Each command is microseconds</span><span class="v">There is nothing to wait behind. Unlike a SQL query that holds a connection for 50ms, a Redis <code>GET</code> releases it immediately.</span></div>
  <div class="kv"><span class="k">A pool costs memory on the server</span><span class="v">Every connection has an input and output buffer. Fifty API instances × a pool of 50 is 2,500 connections and a real amount of RAM — and <code>maxclients</code> defaults to 10,000.</span></div>
  <div class="kv"><span class="k">When you do want a pool</span><span class="v">Very high throughput on a fast network where one socket saturates, or a language whose client is synchronous and blocking. Measure before assuming you are in that case.</span></div>
  <div class="kv"><span class="k">Never one connection per request</span><span class="v">The classic mistake. TCP handshake plus <code>AUTH</code> plus <code>SELECT</code> per request costs far more than the command, and you exhaust <code>maxclients</code> under load.</span></div>
</div>
<pre><code>redis-cli INFO clients | grep -E 'connected_clients|maxclients'
redis-cli CONFIG GET maxclients
redis-cli CLIENT LIST | awk '{print $NF}' | sort | uniq -c | sort -rn | head -3</code></pre>
<div class="out">connected_clients:842
maxclients:10000
    612 resp=2
    218 resp=2
     12 resp=3</div>

<h3>The commands that take a connection hostage</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SUBSCRIBE / PSUBSCRIBE</span><span class="lz-t">in RESP2, the connection enters subscribe mode</span><span class="lz-d">It can then only run subscribe-related commands. A shared client that subscribes stops being usable for anything else — this is the single most common Redis client bug. Use a dedicated connection, or RESP3 where push messages share the connection.</span></div>
  <div class="lz-step"><span class="lz-k">BLPOP / BRPOP / BLMOVE</span><span class="lz-t">blocks until an element arrives, or the timeout</span><span class="lz-d">The <em>connection</em> waits; the server is free and serves everyone else. But that connection is unavailable, so a worker doing <code>BLPOP</code> needs its own.</span></div>
  <div class="lz-step"><span class="lz-k">XREAD BLOCK / WAIT</span><span class="lz-t">same shape</span><span class="lz-d">Stream consumers and <code>WAIT</code> hold the connection for their duration. Give consumers a dedicated connection each.</span></div>
  <div class="lz-step"><span class="lz-k">MONITOR</span><span class="lz-t">holds the connection AND slows the server</span><span class="lz-d">Every command the server processes gets copied to that socket. Fine for a few seconds of debugging; never in an application.</span></div>
</div>
<pre><code><span class="tok-comment">// Two clients: one for commands, one for the subscription</span>
export const redis = createClient({ url: process.env.REDIS_URL });
export const sub   = redis.duplicate();       <span class="tok-comment">// same config, separate socket</span>
await Promise.all([redis.connect(), sub.connect()]);

await sub.subscribe('cache:invalidate', (msg) =&gt; { /* … */ });
await redis.get('user:1042');                  <span class="tok-comment">// still works — different connection</span></code></pre>
<pre><code>redis-cli CLIENT LIST | grep -E 'sub=[1-9]' | head -2</code></pre>
<div class="out">id=9241 addr=172.19.0.5:51288 name=sub sub=1 psub=0 multi=-1 cmd=subscribe resp=2</div>
<div class="callout warn"><strong><code>sub=1</code> is how you spot it.</strong> That connection has one active subscription and, on RESP2, can no longer run <code>GET</code>. If your application mysteriously stops being able to read from Redis after a subscription starts, this is why — and it is why every client library has a <code>duplicate()</code> or equivalent.</div>

<h3>Timeouts, in both directions</h3>
<pre><code><span class="tok-comment">// Client side: never let a request hang forever</span>
const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 5_000,
    reconnectStrategy: (retries) =&gt; Math.min(retries * 200, 5_000),
  },
});</code></pre>
<pre><code><span class="tok-comment"># Server side: drop connections that have been idle too long</span>
redis-cli CONFIG GET timeout
redis-cli CONFIG SET timeout 300
redis-cli CONFIG GET tcp-keepalive</code></pre>
<div class="out">1) "timeout"
2) "0"
OK
1) "tcp-keepalive"
2) "300"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>timeout 0</code> is the default</span><span class="v">Redis never closes an idle connection. Combined with a client that leaks connections, this is how you reach <code>maxclients</code> over days rather than seconds.</span></div>
  <div class="kv"><span class="k"><code>tcp-keepalive 300</code></span><span class="v">Sends a TCP keepalive every 300s, which detects connections killed by a NAT or a firewall that never sent a FIN. Leave it on; it is the reason half-dead connections get cleaned up.</span></div>
  <div class="kv"><span class="k">A command timeout is not a cancel</span><span class="v">If your client gives up after 100ms, Redis still runs the command to completion. Timeouts protect your application's latency, not the server's.</span></div>
  <div class="kv"><span class="k">Blocking commands need their own timeout</span><span class="v"><code>BLPOP queue 5</code> takes a timeout <em>argument</em>. Set it to less than your client's socket timeout, or the client gives up first and you lose the reply.</span></div>
  <div class="kv"><span class="k">Fail fast on a cache</span><span class="v">If Redis is a cache, a 50ms timeout that falls through to the database beats a 5-second wait. Decide this deliberately (Chapter 6).</span></div>
</div>

<h3>Reconnecting, and what happens to in-flight commands</h3>
<pre><code>redis-cli CLIENT KILL ID 9241
redis-cli INFO stats | grep -E 'rejected_connections|total_connections'</code></pre>
<div class="out">(integer) 1
rejected_connections:0
total_connections_received:1284420</div>
<pre><code><span class="tok-comment">// What a resilient wrapper looks like — for a CACHE, where a miss is survivable</span>
export async function cached(key, ttl, compute) {
  try {
    const hit = await redis.get(key);
    if (hit !== null) return JSON.parse(hit);
  } catch (err) {
    console.warn('redis read failed, falling through:', err.message);
  }
  const value = await compute();
  redis.set(key, JSON.stringify(value), { EX: ttl })
       .catch((err) =&gt; console.warn('redis write failed:', err.message));
  return value;
}</code></pre>
<div class="callout ok"><strong>Note that the write is not awaited and its failure is swallowed.</strong> For a cache that is correct: the value is already computed and being returned, so a failed cache write costs a future miss and nothing else. Making the request fail because the <em>cache</em> was unavailable turns a performance optimisation into a dependency — which is exactly backwards, and a real source of outages where "the cache went down and took the site with it".</div>

<h3>When the pool is exhausted</h3>
<pre><code>redis-cli INFO clients
redis-cli CLIENT LIST | awk '{split($5,a,"=");print a[2]}' | sort -rn | head -3
redis-cli CLIENT LIST | grep -c 'cmd=blpop'</code></pre>
<div class="out">connected_clients:9998
cluster_connections:0
maxclients:10000
blocked_clients:412
7412
7208
6941
412</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Symptom: ERR max number of clients reached</span><span class="lz-lnote">New connections are refused outright. Every instance of your app starts failing at once, and restarting them makes it briefly worse.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cause 1: leaked connections</span><span class="lz-lnote">A client created per request and never closed. <code>age</code> values in the thousands with <code>idle</code> equally high is the signature.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cause 2: too many blocking consumers</span><span class="lz-lnote">412 <code>blocked_clients</code> means 412 connections sitting in <code>BLPOP</code>. Each is legitimate; together they are a capacity plan nobody made.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cause 3: pools multiplied by instances</span><span class="lz-lnote">A pool of 50 looks small until you run 40 containers. Pool size should be chosen with the instance count in mind, not per process in isolation.</span></div>
  <div class="lz-layer"><span class="lz-lname">The immediate fix</span><span class="lz-lnote"><code>CLIENT KILL</code> the idle ones by age, raise <code>maxclients</code> temporarily, then fix the leak. Raising the limit alone just moves the wall.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Redis client libraries</span><span class="lc-sub">The official list by language, with the maintained ones marked. For Node, <code>node-redis</code> and <code>ioredis</code> are both good and differ mainly in API style and cluster handling.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/client-kill/" target="_blank" rel="noopener">
  <span class="lc-ico">🔪</span>
  <span class="lc-body"><span class="lc-title">CLIENT KILL and CLIENT LIST</span><span class="lc-sub">Filtering by <code>ID</code>, <code>ADDR</code>, <code>LADDR</code>, <code>TYPE</code> and <code>MAXAGE</code>. <code>CLIENT KILL TYPE normal MAXAGE 3600</code> is the one-liner for a connection leak.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: connection handling</span><span class="lc-sub">Graded exercises: explain why a shared client breaks after <code>SUBSCRIBE</code>, size a pool for 40 instances, and write a cache wrapper that survives Redis being down.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> calling <code>SUBSCRIBE</code> on the client you also use for normal commands. On RESP2 the connection enters subscribe mode and refuses every other command with <code>ERR Can't execute 'get': only (P|S)SUBSCRIBE …</code> — so the moment your invalidation listener starts, every cache read in the process begins failing. What makes it genuinely nasty is the timing: it usually works in development, where the subscription is set up in a different file and the failure only appears under a code path you exercise later. The fix is one line — <code>const sub = redis.duplicate()</code> — and the diagnostic is <code>CLIENT LIST | grep 'sub=[1-9]'</code>, which shows you the connection that has been taken over. The same applies to any blocking consumer: <code>BLPOP</code> and <code>XREAD BLOCK</code> hold their connection for the duration, so each worker gets its own.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One shared connection is usually right — commands are microseconds and the client pipelines automatically — while a connection per request exhausts <code>maxclients</code> under load. <code>SUBSCRIBE</code> and the blocking commands take a connection hostage, so they each need a dedicated one via <code>duplicate()</code>. And a cache wrapper must survive Redis being unavailable: catch the read, fall through to the source, and never let a failed cache <em>write</em> fail the request.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Client, bể kết nối và thời gian chờ</h2>
<p class="lead">Xử lý kết nối là nơi phần lớn lỗi client của Redis trú ngụ, và lý do là một sự lệch pha về trực giác: người ta mang thói quen từ SQL sang, nơi một kết nối là đắt đỏ và một bể kết nối là bắt buộc. Kết nối Redis thì rẻ và câu lệnh của nó thì nhanh, điều đó đổi câu trả lời đúng — và tạo ra một nhóm bẫy rất cụ thể quanh vài câu lệnh có tính CHẶN.</p>

<h3>Một kết nối thường là đủ</h3>
<pre><code><span class="tok-comment">// node-redis: MỘT client, dùng chung, tạo một lần lúc khởi động</span>
import { createClient } from 'redis';
export const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (e) =&gt; console.error('redis:', e.message));
await redis.connect();</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Câu lệnh được đóng pipeline tự động</span><span class="v">Một kết nối duy nhất có thể có nhiều câu lệnh đang bay — client ghi chúng ra rồi ghép câu trả lời theo thứ tự. Đồng thời KHÔNG đòi hỏi phải có nhiều socket.</span></div>
  <div class="kv"><span class="k">Mỗi câu lệnh chỉ vài micro giây</span><span class="v">Chẳng có gì để mà xếp hàng sau. Khác với một truy vấn SQL giữ kết nối 50ms, một lệnh <code>GET</code> của Redis nhả nó ra ngay lập tức.</span></div>
  <div class="kv"><span class="k">Một bể tốn bộ nhớ ở máy chủ</span><span class="v">Mỗi kết nối có một bộ đệm vào và một bộ đệm ra. Năm mươi instance API × một bể 50 là 2.500 kết nối và một lượng RAM thật — còn <code>maxclients</code> mặc định là 10.000.</span></div>
  <div class="kv"><span class="k">Khi nào bạn THẬT SỰ cần một bể</span><span class="v">Thông lượng rất cao trên một mạng nhanh tới mức một socket bị bão hoà, hoặc một ngôn ngữ mà client của nó là đồng bộ và có tính chặn. Hãy ĐO trước khi cho rằng mình thuộc trường hợp đó.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ mỗi request một kết nối</span><span class="v">Sai lầm kinh điển. Bắt tay TCP cộng <code>AUTH</code> cộng <code>SELECT</code> cho mỗi request tốn nhiều hơn hẳn cái câu lệnh, và bạn sẽ vét cạn <code>maxclients</code> khi có tải.</span></div>
</div>
<pre><code>redis-cli INFO clients | grep -E 'connected_clients|maxclients'
redis-cli CONFIG GET maxclients
redis-cli CLIENT LIST | awk '{print $NF}' | sort | uniq -c | sort -rn | head -3</code></pre>
<div class="out">connected_clients:842
maxclients:10000
    612 resp=2
    218 resp=2
     12 resp=3</div>

<h3>Những câu lệnh bắt cóc một kết nối</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SUBSCRIBE / PSUBSCRIBE</span><span class="lz-t">ở RESP2, kết nối chuyển sang chế độ đăng ký</span><span class="lz-d">Từ đó nó chỉ chạy được những câu lệnh liên quan tới đăng ký. Một client dùng chung mà đi đăng ký sẽ ngừng dùng được cho mọi việc khác — đây là lỗi client Redis phổ biến nhất. Hãy dùng một kết nối riêng, hoặc dùng RESP3 nơi tin đẩy chia sẻ được kết nối.</span></div>
  <div class="lz-step"><span class="lz-k">BLPOP / BRPOP / BLMOVE</span><span class="lz-t">chặn cho tới khi có phần tử, hoặc hết giờ</span><span class="lz-d">Cái <em>KẾT NỐI</em> chờ; máy chủ vẫn rảnh và phục vụ mọi người khác. Nhưng kết nối đó không dùng được nữa, nên một worker chạy <code>BLPOP</code> cần kết nối riêng của nó.</span></div>
  <div class="lz-step"><span class="lz-k">XREAD BLOCK / WAIT</span><span class="lz-t">cùng hình dạng</span><span class="lz-d">Bên tiêu thụ stream và lệnh <code>WAIT</code> giữ kết nối suốt thời gian của chúng. Hãy cho mỗi bên tiêu thụ một kết nối riêng.</span></div>
  <div class="lz-step"><span class="lz-k">MONITOR</span><span class="lz-t">giữ kết nối VÀ làm chậm máy chủ</span><span class="lz-d">Mọi câu lệnh máy chủ xử lý đều được chép sang cái socket đó. Ổn cho vài giây gỡ lỗi; không bao giờ ổn trong một ứng dụng.</span></div>
</div>
<pre><code><span class="tok-comment">// Hai client: một cho câu lệnh, một cho đăng ký</span>
export const redis = createClient({ url: process.env.REDIS_URL });
export const sub   = redis.duplicate();       <span class="tok-comment">// cùng cấu hình, socket riêng</span>
await Promise.all([redis.connect(), sub.connect()]);

await sub.subscribe('cache:invalidate', (msg) =&gt; { /* … */ });
await redis.get('user:1042');                  <span class="tok-comment">// vẫn chạy — kết nối khác</span></code></pre>
<pre><code>redis-cli CLIENT LIST | grep -E 'sub=[1-9]' | head -2</code></pre>
<div class="out">id=9241 addr=172.19.0.5:51288 name=sub sub=1 psub=0 multi=-1 cmd=subscribe resp=2</div>
<div class="callout warn"><strong><code>sub=1</code> là cách bạn nhận ra nó.</strong> Kết nối đó có một đăng ký đang hoạt động và, trên RESP2, không chạy được <code>GET</code> nữa. Nếu ứng dụng của bạn tự nhiên ngừng đọc được Redis sau khi một đăng ký bắt đầu thì đó chính là lý do — và đó là lý do mọi thư viện client đều có <code>duplicate()</code> hoặc thứ tương đương.</div>

<h3>Thời gian chờ, ở cả hai phía</h3>
<pre><code><span class="tok-comment">// Phía client: đừng bao giờ để một yêu cầu treo mãi mãi</span>
const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 5_000,
    reconnectStrategy: (retries) =&gt; Math.min(retries * 200, 5_000),
  },
});</code></pre>
<pre><code><span class="tok-comment"># Phía máy chủ: vứt những kết nối nhàn rỗi quá lâu</span>
redis-cli CONFIG GET timeout
redis-cli CONFIG SET timeout 300
redis-cli CONFIG GET tcp-keepalive</code></pre>
<div class="out">1) "timeout"
2) "0"
OK
1) "tcp-keepalive"
2) "300"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>timeout 0</code> là mặc định</span><span class="v">Redis không bao giờ tự đóng một kết nối nhàn rỗi. Ghép với một client rò rỉ kết nối, đây là cách bạn chạm <code>maxclients</code> sau vài ngày chứ không phải vài giây.</span></div>
  <div class="kv"><span class="k"><code>tcp-keepalive 300</code></span><span class="v">Gửi một gói keepalive TCP mỗi 300 giây, thứ phát hiện được những kết nối bị một NAT hay một tường lửa giết mà không hề gửi FIN. Cứ để bật; đó là lý do những kết nối chết dở được dọn đi.</span></div>
  <div class="kv"><span class="k">Thời gian chờ KHÔNG phải là huỷ lệnh</span><span class="v">Nếu client của bạn bỏ cuộc sau 100ms thì Redis vẫn chạy câu lệnh đó tới hết. Thời gian chờ bảo vệ độ trễ của ỨNG DỤNG bạn, không bảo vệ máy chủ.</span></div>
  <div class="kv"><span class="k">Câu lệnh chặn cần thời gian chờ riêng</span><span class="v"><code>BLPOP queue 5</code> nhận thời gian chờ như một THAM SỐ. Hãy đặt nó nhỏ hơn thời gian chờ socket của client, không thì client bỏ cuộc trước và bạn mất câu trả lời.</span></div>
  <div class="kv"><span class="k">Hỏng nhanh khi nó là cache</span><span class="v">Nếu Redis là một cái cache thì một thời gian chờ 50ms rồi rơi xuống cơ sở dữ liệu tốt hơn một cú chờ 5 giây. Hãy quyết chuyện này một cách có chủ đích (Chương 6).</span></div>
</div>

<h3>Kết nối lại, và chuyện gì xảy ra với câu lệnh đang bay</h3>
<pre><code>redis-cli CLIENT KILL ID 9241
redis-cli INFO stats | grep -E 'rejected_connections|total_connections'</code></pre>
<div class="out">(integer) 1
rejected_connections:0
total_connections_received:1284420</div>
<pre><code><span class="tok-comment">// Một lớp bọc chịu lỗi trông thế nào — cho một CACHE, nơi một lần trượt là sống được</span>
export async function cached(key, ttl, compute) {
  try {
    const hit = await redis.get(key);
    if (hit !== null) return JSON.parse(hit);
  } catch (err) {
    console.warn('redis read failed, falling through:', err.message);
  }
  const value = await compute();
  redis.set(key, JSON.stringify(value), { EX: ttl })
       .catch((err) =&gt; console.warn('redis write failed:', err.message));
  return value;
}</code></pre>
<div class="callout ok"><strong>Để ý là lệnh GHI không được await và lỗi của nó bị nuốt.</strong> Với một cái cache thì như vậy là ĐÚNG: giá trị đã được tính xong và đang được trả về, nên một lần ghi cache hỏng chỉ tốn thêm một lần trượt trong tương lai chứ không tốn gì khác. Làm cho cả request hỏng chỉ vì <em>CACHE</em> không sẵn sàng là biến một phép tối ưu hiệu năng thành một sự phụ thuộc — điều đó ngược hẳn, và là một nguồn sự cố có thật kiểu "cache chết và kéo cả trang web đi theo".</div>

<h3>Khi bể kết nối bị cạn</h3>
<pre><code>redis-cli INFO clients
redis-cli CLIENT LIST | awk '{split($5,a,"=");print a[2]}' | sort -rn | head -3
redis-cli CLIENT LIST | grep -c 'cmd=blpop'</code></pre>
<div class="out">connected_clients:9998
cluster_connections:0
maxclients:10000
blocked_clients:412
7412
7208
6941
412</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Triệu chứng: ERR max number of clients reached</span><span class="lz-lnote">Kết nối mới bị từ chối thẳng. Mọi instance của ứng dụng bắt đầu hỏng cùng lúc, và khởi động lại chúng thì tạm thời còn tệ hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nguyên nhân 1: rò rỉ kết nối</span><span class="lz-lnote">Một client được tạo cho mỗi request rồi không bao giờ đóng. Giá trị <code>age</code> hàng nghìn cùng với <code>idle</code> cũng cao chính là chữ ký của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nguyên nhân 2: quá nhiều bên tiêu thụ có tính chặn</span><span class="lz-lnote">412 <code>blocked_clients</code> nghĩa là 412 kết nối đang ngồi trong <code>BLPOP</code>. Từng cái đều chính đáng; gộp lại chúng là một kế hoạch dung lượng không ai từng lập.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nguyên nhân 3: bể nhân với số instance</span><span class="lz-lnote">Một bể 50 trông nhỏ cho tới khi bạn chạy 40 container. Kích thước bể phải được chọn với số instance trong đầu, không phải cho từng tiến trình một cách biệt lập.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cách chữa tức thì</span><span class="lz-lnote"><code>CLIENT KILL</code> những cái nhàn rỗi theo tuổi, tạm nâng <code>maxclients</code>, rồi đi vá chỗ rò. Chỉ nâng giới hạn thôi thì chỉ là dời cái bức tường đi xa hơn.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Thư viện client của Redis</span><span class="lc-sub">Danh sách chính thức theo ngôn ngữ, có đánh dấu những cái còn được bảo trì. Với Node thì <code>node-redis</code> và <code>ioredis</code> đều tốt và khác nhau chủ yếu ở phong cách API với cách xử lý cluster.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/client-kill/" target="_blank" rel="noopener">
  <span class="lc-ico">🔪</span>
  <span class="lc-body"><span class="lc-title">CLIENT KILL và CLIENT LIST</span><span class="lc-sub">Lọc theo <code>ID</code>, <code>ADDR</code>, <code>LADDR</code>, <code>TYPE</code> và <code>MAXAGE</code>. <code>CLIENT KILL TYPE normal MAXAGE 3600</code> là câu lệnh một dòng cho một chỗ rò kết nối.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: xử lý kết nối</span><span class="lc-sub">Bài chấm điểm: giải thích vì sao một client dùng chung hỏng sau <code>SUBSCRIBE</code>, tính kích thước bể cho 40 instance, và viết một lớp bọc cache sống sót khi Redis chết.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> gọi <code>SUBSCRIBE</code> trên chính cái client bạn cũng dùng cho câu lệnh thường. Trên RESP2, kết nối chuyển sang chế độ đăng ký và từ chối mọi câu lệnh khác với <code>ERR Can't execute 'get': only (P|S)SUBSCRIBE …</code> — nên ngay khoảnh khắc bộ lắng nghe vô hiệu hoá cache của bạn khởi động, mọi lệnh đọc cache trong tiến trình đó bắt đầu hỏng. Thứ khiến nó thật sự khó chịu là thời điểm: nó thường chạy tốt lúc phát triển, khi đăng ký được thiết lập ở một file khác và cái hỏng chỉ lộ ra dưới một đường mã bạn chạy tới muộn hơn. Cách chữa gọn một dòng — <code>const sub = redis.duplicate()</code> — và phép chẩn đoán là <code>CLIENT LIST | grep 'sub=[1-9]'</code>, thứ chỉ cho bạn thấy cái kết nối đã bị chiếm. Điều tương tự áp cho mọi bên tiêu thụ có tính chặn: <code>BLPOP</code> và <code>XREAD BLOCK</code> giữ kết nối của chúng suốt thời gian chạy, nên mỗi worker cần một kết nối riêng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một kết nối dùng chung thường là đúng — câu lệnh chỉ vài micro giây và client tự đóng pipeline — trong khi mỗi request một kết nối sẽ vét cạn <code>maxclients</code> khi có tải. <code>SUBSCRIBE</code> và các câu lệnh chặn bắt cóc một kết nối, nên mỗi cái cần một kết nối riêng qua <code>duplicate()</code>. Và một lớp bọc cache phải sống sót khi Redis không sẵn sàng: bắt lỗi lúc đọc, rơi xuống nguồn gốc, và đừng bao giờ để một lần GHI cache hỏng làm hỏng cả request.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Quiz: the execution model|||1.6 — Trắc nghiệm: mô hình thực thi',
      slug: 'rd-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một luồng, độ phức tạp, RESP đếm byte, mã lỗi, pipeline khác giao dịch, SUBSCRIBE chiếm kết nối, và độ bền của chữ OK.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the execution model. Everything in the remaining eleven chapters is a consequence of what is here, so these are worth getting right rather than nearly right.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: what "single-threaded" costs you as well as what it buys (1.1), what <code>OK</code> does and does not guarantee (1.2), and why a pipeline is not a transaction (1.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về mô hình thực thi. Mọi thứ trong mười một chương còn lại đều là hệ quả của những gì ở đây, nên chúng đáng để trả lời ĐÚNG chứ không phải gần đúng.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: một luồng bắt bạn TRẢ gì bên cạnh việc nó CHO gì (1.1), chữ <code>OK</code> bảo đảm và không bảo đảm điều gì (1.2), và vì sao một pipeline không phải giao dịch (1.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Redis executes commands on a single thread. What does that buy you, and what does it cost?|||Redis thực thi câu lệnh trên một luồng duy nhất. Điều đó cho bạn gì, và bắt bạn trả gì?',
            options: [
              'Buys atomicity for free — no locks, no lost updates; costs you the fact that ONE slow command blocks every other client|||Cho bạn tính nguyên tử miễn phí — không khoá, không mất cập nhật; bắt bạn trả bằng việc MỘT câu lệnh chậm chặn mọi client khác',
              'Buys lower memory use; costs you durability|||Cho bạn ít bộ nhớ hơn; bắt bạn trả bằng độ bền',
              'Buys nothing — it is a legacy limitation being removed|||Chẳng cho gì — đó là một hạn chế đời cũ đang được gỡ bỏ',
              'Buys parallelism across cores; costs you consistency|||Cho bạn tính song song trên nhiều nhân; bắt bạn trả bằng tính nhất quán',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your Redis latency has risen. You move it to a server with 32 cores instead of 4. What happens?|||Độ trễ Redis của bạn tăng lên. Bạn chuyển nó sang một máy chủ 32 nhân thay vì 4 nhân. Chuyện gì xảy ra?',
            options: [
              'Throughput roughly scales with core count|||Thông lượng tăng gần như tỷ lệ với số nhân',
              'Latency halves because commands are distributed|||Độ trễ giảm một nửa vì các câu lệnh được phân tán ra',
              'Essentially nothing — one thread executes commands and uses one core; fix the O(N) commands, or shard across instances|||Về cơ bản không gì cả — một luồng thực thi câu lệnh và dùng một nhân; hãy chữa các câu lệnh O(N), hoặc chia dữ liệu ra nhiều instance',
              'Redis refuses to start without io-threads configured|||Redis từ chối khởi động nếu chưa cấu hình io-threads',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: '`SET user:1 "Cường"` then `STRLEN user:1` returns 7 for a five-character name. Why?|||`SET user:1 "Cường"` rồi `STRLEN user:1` trả về 7 cho một cái tên năm ký tự. Vì sao?',
            options: [
              'Redis adds a two-byte type header|||Redis thêm một phần đầu hai byte cho kiểu dữ liệu',
              'RESP and Redis count BYTES, not characters — "Cường" is 7 bytes in UTF-8, and Redis has no concept of text encoding at all|||RESP và Redis đếm BYTE, không đếm ký tự — "Cường" là 7 byte trong UTF-8, và Redis hoàn toàn không có khái niệm bảng mã văn bản',
              'The quotes are included in the length|||Hai dấu nháy được tính vào độ dài',
              'STRLEN rounds up to the nearest word boundary|||STRLEN làm tròn lên tới biên từ gần nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your client receives an error. Which part should your code match on?|||Client của bạn nhận một lỗi. Mã của bạn nên so khớp theo phần nào?',
            options: [
              'The full message text, for precision|||Toàn bộ dòng chữ, cho chính xác',
              'The error length|||Độ dài của thông báo lỗi',
              'Nothing — treat all Redis errors as fatal|||Không gì cả — hãy coi mọi lỗi Redis là chí mạng',
              'The FIRST WORD — WRONGTYPE, NOSCRIPT, OOM, READONLY, MOVED, LOADING are the stable machine-readable codes; the sentence after can be reworded|||TỪ ĐẦU TIÊN — WRONGTYPE, NOSCRIPT, OOM, READONLY, MOVED, LOADING là các mã máy đọc được và ổn định; câu chữ phía sau có thể bị viết lại',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A loop of 1,000 sequential `await redis.set(...)` calls took 8.4 seconds. Where did that time go?|||Một vòng lặp 1.000 lời gọi `await redis.set(...)` tuần tự mất 8,4 giây. Thời gian đó đi đâu?',
            options: [
              'Almost entirely network round trips — the client waited for each reply before sending the next; a pipeline did the same work in 0.16s|||Gần như hoàn toàn vào các vòng mạng — client chờ từng câu trả lời trước khi gửi cái kế; một pipeline làm cùng công việc đó trong 0,16 giây',
              'Redis executing 1,000 commands|||Redis thực thi 1.000 câu lệnh',
              'Serialising the values|||Tuần tự hoá các giá trị',
              'Waiting for AOF fsync on each write|||Chờ fsync AOF ở mỗi lệnh ghi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between a pipeline and MULTI/EXEC?|||Khác biệt giữa một pipeline và MULTI/EXEC là gì?',
            options: [
              'They are the same thing under different names|||Chúng là cùng một thứ với hai cái tên khác nhau',
              'A pipeline batches for fewer round trips but other clients CAN interleave between your commands; MULTI/EXEC executes as one uninterrupted unit|||Pipeline gom lô để bớt vòng mạng nhưng client khác VẪN xen được vào giữa các câu lệnh của bạn; MULTI/EXEC chạy như một khối không ngắt được',
              'MULTI is faster; a pipeline is safer|||MULTI nhanh hơn; pipeline an toàn hơn',
              'A pipeline rolls back on error; MULTI does not|||Pipeline quay lui khi có lỗi; MULTI thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After your app calls `SUBSCRIBE` on its shared client, every `GET` starts failing. Why, and what is the fix?|||Sau khi ứng dụng của bạn gọi `SUBSCRIBE` trên client dùng chung, mọi lệnh `GET` bắt đầu hỏng. Vì sao, và cách chữa là gì?',
            options: [
              'The subscription used up the connection pool; raise maxclients|||Đăng ký đã dùng hết bể kết nối; hãy nâng maxclients',
              'Redis entered read-only mode; run REPLICAOF NO ONE|||Redis chuyển sang chế độ chỉ đọc; hãy chạy REPLICAOF NO ONE',
              'On RESP2 the connection enters subscribe mode and refuses other commands — give the subscriber its own connection with duplicate()|||Trên RESP2, kết nối chuyển sang chế độ đăng ký và từ chối các câu lệnh khác — hãy cho bên đăng ký một kết nối riêng bằng duplicate()',
              'GET is disallowed while any client is subscribed|||GET bị cấm khi có bất kỳ client nào đang đăng ký',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'With default settings, `SET k v` returns OK. What is guaranteed at that moment?|||Với thiết lập mặc định, `SET k v` trả về OK. Vào khoảnh khắc đó, điều gì được BẢO ĐẢM?',
            options: [
              'Only that the in-memory structure was updated — the AOF buffer is flushed up to a second later and replicas have not acknowledged, so an acknowledged write can still be lost|||Chỉ rằng cấu trúc trong bộ nhớ đã được cập nhật — bộ đệm AOF được đẩy xuống đĩa muộn nhất một giây sau và các bản sao chưa xác nhận, nên một lệnh ghi ĐÃ được xác nhận vẫn có thể mất',
              'The write is on disk and replicated|||Lệnh ghi đã nằm trên đĩa và đã được nhân bản',
              'The write is on disk but not yet replicated|||Lệnh ghi đã nằm trên đĩa nhưng chưa được nhân bản',
              'Nothing at all; OK is advisory|||Chẳng bảo đảm gì; OK chỉ mang tính tham khảo',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
