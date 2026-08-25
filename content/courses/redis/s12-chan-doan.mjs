/**
 * Redis — Chương 12: Chẩn đoán Redis, và đi tiếp về đâu.
 * Năm phút đầu · bảy hình dáng hỏng hóc · bộ công cụ · giám sát · kết khoá · quiz cuối.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 12 — Diagnosing Redis, and where to go next|||Chương 12 — Chẩn đoán Redis, và đi tiếp về đâu',
  description: 'Mọi sự cố Redis nghe giống nhau khi nó bắt đầu: "Redis chậm". Chương này biến câu đó thành một quy trình phân loại có thứ tự, bảy hình dáng hỏng hóc phân biệt được bằng ba lệnh, và một bộ công cụ chẩn đoán bạn dùng được mà không làm mọi thứ tệ đi. Rồi nó kết lại cả khoá học.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — The first five minutes of a Redis incident|||12.1 — Năm phút đầu của một sự cố Redis',
      slug: 'rd-12-1-nam-phut-dau',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một quy trình phân loại có thứ tự chạy được khi đang hoảng: bốn lệnh trả lời "còn sống không", "có bận không", "có đầy không", "có kết nối được không", và cây quyết định đưa bạn từ triệu chứng tới nguyên nhân trong năm phút.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>The first five minutes of a Redis incident</h2>
<p class="lead">Every Redis incident starts with the same sentence: "Redis is slow." That sentence is compatible with a dozen unrelated causes, and the difference between a five-minute incident and a two-hour one is having an order to check them in. Here is that order.</p>

<h3>The triage block: four commands, one paste</h3>
<pre><code>redis-cli PING
redis-cli --latency -i 3
redis-cli INFO clients  | grep -E "connected_clients|blocked_clients|maxclients"
redis-cli INFO memory   | grep -E "used_memory_human|used_memory_rss_human|maxmemory_human|mem_fragmentation_ratio"
redis-cli INFO stats    | grep -E "instantaneous_ops_per_sec|rejected_connections|evicted_keys|keyspace_misses"
redis-cli INFO persistence | grep -E "rdb_last_bgsave_status|aof_last_write_status|loading:"
redis-cli SLOWLOG GET 5 | paste - - - - - -
redis-cli INFO replication | head -4</code></pre>
<div class="out">PONG
min: 0, max: 214, avg: 12.41 (2913 samples)
connected_clients:9982
blocked_clients:0
maxclients:10000
used_memory_human:3.91G
used_memory_rss_human:4.12G
maxmemory_human:4.00G
mem_fragmentation_ratio:1.05
instantaneous_ops_per_sec:1841
rejected_connections:8842
evicted_keys:0
keyspace_misses:2841193
rdb_last_bgsave_status:ok
aof_last_write_status:ok
loading:0
1	1755949214	214882	KEYS session:*	10.1.4.22:53114
role:master
connected_slaves:1
master_failover_state:no-failover
slave0:ip=10.0.1.6,port=6380,state=online,offset=1841204,lag=0</div>
<div class="callout ok"><strong>That paste already contains the answer, twice over.</strong> <code>connected_clients:9982</code> against <code>maxclients:10000</code> with <code>rejected_connections:8842</code> says connections are exhausted (Lesson 10.5). <code>used_memory 3.91G</code> against <code>maxmemory 4.00G</code> with <code>evicted_keys:0</code> says the instance is at its limit on <code>noeviction</code>, so writes are erroring (Lesson 9.2). And the slowlog names a <code>KEYS session:*</code> from 10.1.4.22 that blocked the server for 215 ms (Lesson 2.3). Three independent findings from one block of output — which is the point of running the whole block first rather than chasing the first thing you notice.</div>

<h3>The four questions, in order</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is it alive?</span><span class="lz-t">PING · INFO persistence | grep loading</span><span class="lz-d"><code>PONG</code> means the process is up and answering. <code>-LOADING</code> means it is up and reading an AOF or RDB after a restart — which is not an outage, it is a wait, and <code>INFO persistence</code> tells you how far along (Lesson 9.4). No answer at all is a different investigation entirely: check the process, the port, the firewall.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Is it busy?</span><span class="lz-t">--latency · SLOWLOG GET · instantaneous_ops_per_sec</span><span class="lz-d">High <code>--latency</code> with low ops/s is the signature of one slow command blocking the single thread (Lesson 1.1), and <code>SLOWLOG</code> names it. High latency <em>and</em> high ops/s is genuine load. Low latency with a slow application means the problem is not Redis at all — go look at your service.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Is it full?</span><span class="lz-t">used_memory vs maxmemory · evicted_keys · fragmentation</span><span class="lz-d">At the limit on <code>noeviction</code>, writes fail and reads work — the confusing half-outage. With an <code>allkeys-*</code> policy, <code>evicted_keys</code> climbing means data is being deleted to make room, which may be silently removing things that are not caches (Lesson 9.2).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Can anything connect?</span><span class="lz-t">connected_clients vs maxclients · rejected_connections</span><span class="lz-d">A non-zero <code>rejected_connections</code> is unambiguous: something is opening more connections than the server allows, and it is usually a leak rather than growth (Lesson 10.5). <code>blocked_clients</code> dropping to zero when it should be twenty means your workers died (Lesson 4.1).</span></div>
</div>

<h3>From symptom to cause</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Latency high, ops/s low, slowlog full</span><span class="v">One O(N) command is blocking everyone. <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, an exact <code>XTRIM</code>, or a Lua script looping over a collection. The slowlog names the command and the client address — go fix that caller (Lessons 6.5, 7.3).</span></div>
  <div class="kv"><span class="k">Latency high, ops/s also high</span><span class="v">Real load, or a hot key. Check <code>INFO commandstats</code> for <code>usec_per_call</code> and <code>--hotkeys</code> if you are on LFU. Sharding will not help a single hot key (Lesson 11.4); caching upstream or splitting the key will.</span></div>
  <div class="kv"><span class="k">Writes failing, reads fine</span><span class="v">Three candidates and they are easy to tell apart: <code>OOM</code> means <code>maxmemory</code> with <code>noeviction</code>, <code>MISCONF</code> means a save is failing (Lesson 9.3), and <code>NOREPLICAS</code> means <code>min-replicas-to-write</code> is unsatisfied (Lesson 11.2). The error text is the diagnosis.</span></div>
  <div class="kv"><span class="k">Intermittent multi-second stalls</span><span class="v">A fork. Correlate with <code>rdb_last_bgsave_time_sec</code>, <code>latest_fork_usec</code> and <code>LATENCY LATEST</code>. If <code>latest_fork_usec</code> is tens of milliseconds per gigabyte, Transparent Huge Pages is on (Lesson 9.3).</span></div>
  <div class="kv"><span class="k">Everything looks healthy, application is broken</span><span class="v">Then it is a client problem: a connection leak, a pool exhausted upstream of Redis, a Sentinel failover the clients did not follow (Lesson 11.3), or a blocking command holding the only connection (Lesson 1.5). <code>CLIENT LIST</code> grouped by <code>name</code> and <code>addr</code> is the next step.</span></div>
</div>

<h3>What not to do while diagnosing</h3>
<pre><code><span class="tok-comment"># ❌ Never on a struggling production instance</span>
redis-cli KEYS '*'                    <span class="tok-comment"># blocks for as long as it takes</span>
redis-cli MONITOR                     <span class="tok-comment"># streams every command, costs real throughput</span>
redis-cli DEBUG SEGFAULT              <span class="tok-comment"># yes, this exists. no.</span>
redis-cli FLUSHALL                    <span class="tok-comment"># "let's clear the cache and see"</span>
redis-cli CONFIG SET maxmemory 0      <span class="tok-comment"># removes the limit, invites the OOM killer</span>

<span class="tok-comment"># ✅ Safe on production, all of them</span>
redis-cli --scan --pattern 'session:*' --count 100 | head
redis-cli --bigkeys
redis-cli --memkeys
redis-cli SLOWLOG GET 10
redis-cli LATENCY LATEST
redis-cli CLIENT LIST | awk '{print $2, $4}' | sort | uniq -c | sort -rn | head</code></pre>
<div class="pitfall"><strong>Pitfall:</strong> restarting Redis as the first move. It is the reflex, it usually appears to work, and it costs you three things at once. <strong>You lose the evidence:</strong> <code>SLOWLOG</code>, <code>LATENCY</code> history, <code>CLIENT LIST</code> and every <code>INFO</code> counter reset on restart, so the command that caused the incident is now unknowable and it will happen again next week. <strong>You may lose data:</strong> everything since the last save if you are on RDB alone, or up to a second on AOF <code>everysec</code> — and if <code>appendonly</code> was set with <code>CONFIG SET</code> and never written back with <code>CONFIG REWRITE</code>, the instance comes back without it (Lesson 10.1). <strong>And you turn a partial outage into a full one:</strong> loading a large AOF took nine seconds in Lesson 9.4, during which Redis answers <code>-LOADING</code> to everything, and a stampede of clients reconnecting at once can push the recovery well past that. Run the triage block first — it takes twenty seconds, it is entirely safe, and it usually contains the answer. Restart only when you know what you are restarting <em>for</em>.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Redis latency troubleshooting</span><span class="lc-sub">Redis's own incident checklist: slow commands, forks, swapping, THP, network, and how to distinguish each from the others. The best operational page in the docs.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/info/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">INFO</span><span class="lc-sub">Every field in every section. Worth one careful read while nothing is on fire, so the triage output is a diagnosis rather than a wall of numbers when something is.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: triage four incidents</span><span class="lc-sub">Graded exercises: four <code>INFO</code> pastes from real-shaped failures — name the cause of each, choose the next command, and identify the two "fixes" that would have destroyed the evidence.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Run the whole triage block before chasing anything — <code>PING</code>, <code>--latency</code>, three <code>INFO</code> sections, <code>SLOWLOG</code> — because one paste routinely contains two or three independent findings that you would miss by following the first symptom. Ask the four questions in order: is it alive, is it busy, is it full, can anything connect; the combination of high latency with <em>low</em> ops/s is the signature of a single blocking command, and the error text (<code>OOM</code>, <code>MISCONF</code>, <code>NOREPLICAS</code>) is itself the diagnosis. And do not restart first: it erases the slowlog, the latency history and every counter, it can lose data, and loading a large AOF turns a partial outage into a full one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Năm phút đầu của một sự cố Redis</h2>
<p class="lead">Mọi sự cố Redis đều bắt đầu bằng cùng một câu: "Redis chậm". Câu đó tương thích với cả tá nguyên nhân chẳng liên quan gì tới nhau, và khác biệt giữa một sự cố năm phút với một sự cố hai tiếng nằm ở chỗ có một thứ tự để kiểm chúng. Đây là cái thứ tự đó.</p>

<h3>Khối phân loại: bốn lệnh, một lần dán</h3>
<pre><code>redis-cli PING
redis-cli --latency -i 3
redis-cli INFO clients  | grep -E "connected_clients|blocked_clients|maxclients"
redis-cli INFO memory   | grep -E "used_memory_human|used_memory_rss_human|maxmemory_human|mem_fragmentation_ratio"
redis-cli INFO stats    | grep -E "instantaneous_ops_per_sec|rejected_connections|evicted_keys|keyspace_misses"
redis-cli INFO persistence | grep -E "rdb_last_bgsave_status|aof_last_write_status|loading:"
redis-cli SLOWLOG GET 5 | paste - - - - - -
redis-cli INFO replication | head -4</code></pre>
<div class="out">PONG
min: 0, max: 214, avg: 12.41 (2913 samples)
connected_clients:9982
blocked_clients:0
maxclients:10000
used_memory_human:3.91G
used_memory_rss_human:4.12G
maxmemory_human:4.00G
mem_fragmentation_ratio:1.05
instantaneous_ops_per_sec:1841
rejected_connections:8842
evicted_keys:0
keyspace_misses:2841193
rdb_last_bgsave_status:ok
aof_last_write_status:ok
loading:0
1	1755949214	214882	KEYS session:*	10.1.4.22:53114
role:master
connected_slaves:1
master_failover_state:no-failover
slave0:ip=10.0.1.6,port=6380,state=online,offset=1841204,lag=0</div>
<div class="callout ok"><strong>Chỗ dán đó đã chứa sẵn câu trả lời, tới hai lần.</strong> <code>connected_clients:9982</code> so với <code>maxclients:10000</code> kèm <code>rejected_connections:8842</code> nói rằng kết nối đã cạn (Bài 10.5). <code>used_memory 3.91G</code> so với <code>maxmemory 4.00G</code> kèm <code>evicted_keys:0</code> nói rằng cái máy đang ở sát trần với <code>noeviction</code>, nên các lượt ghi đang báo lỗi (Bài 9.2). Và slowlog gọi tên một lệnh <code>KEYS session:*</code> từ 10.1.4.22 đã chặn máy chủ 215 ms (Bài 2.3). Ba phát hiện độc lập từ một khối đầu ra — và đó chính là lý do phải chạy trọn cả khối trước thay vì đuổi theo cái thứ đầu tiên bạn nhìn thấy.</div>

<h3>Bốn câu hỏi, theo thứ tự</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Nó còn sống không?</span><span class="lz-t">PING · INFO persistence | grep loading</span><span class="lz-d"><code>PONG</code> nghĩa là tiến trình còn chạy và còn trả lời. <code>-LOADING</code> nghĩa là nó còn chạy và đang đọc một AOF hay RDB sau khi khởi động lại — đó không phải sự cố, đó là một khoảng chờ, và <code>INFO persistence</code> nói cho bạn biết nó đi tới đâu rồi (Bài 9.4). Không trả lời gì cả lại là một cuộc điều tra hoàn toàn khác: hãy kiểm tiến trình, cái cổng, tường lửa.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nó có bận không?</span><span class="lz-t">--latency · SLOWLOG GET · instantaneous_ops_per_sec</span><span class="lz-d"><code>--latency</code> cao mà ops/giây thấp là chữ ký của một lệnh chậm đang chặn cái luồng đơn (Bài 1.1), và <code>SLOWLOG</code> gọi tên nó ra. Độ trễ cao <em>và</em> ops/giây cao là tải thật. Độ trễ thấp mà ứng dụng chậm nghĩa là vấn đề không nằm ở Redis chút nào — hãy đi nhìn dịch vụ của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Nó có đầy không?</span><span class="lz-t">used_memory so với maxmemory · evicted_keys · phân mảnh</span><span class="lz-d">Ở sát trần với <code>noeviction</code> thì các lượt ghi hỏng còn các lượt đọc chạy — cái sự cố nửa vời gây rối trí. Với một chính sách <code>allkeys-*</code> thì <code>evicted_keys</code> leo lên nghĩa là dữ liệu đang bị xoá để lấy chỗ, và có thể đang âm thầm gỡ đi những thứ không phải bộ đệm (Bài 9.2).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Có gì kết nối được không?</span><span class="lz-t">connected_clients so với maxclients · rejected_connections</span><span class="lz-d">Một <code>rejected_connections</code> khác 0 là không thể nhầm lẫn: có thứ gì đó đang mở nhiều kết nối hơn mức máy chủ cho phép, và thường là một chỗ rò chứ không phải sự tăng trưởng (Bài 10.5). <code>blocked_clients</code> tụt về 0 trong khi đáng lẽ phải là 20 nghĩa là các worker của bạn đã chết (Bài 4.1).</span></div>
</div>

<h3>Từ triệu chứng tới nguyên nhân</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Độ trễ cao, ops/giây thấp, slowlog đầy</span><span class="v">Một lệnh O(N) đang chặn tất cả mọi người. <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, một lệnh <code>XTRIM</code> chính xác, hay một script Lua lặp qua một tập hợp. Slowlog gọi tên cái lệnh và địa chỉ khách — hãy đi sửa cái bên gọi đó (Bài 6.5, 7.3).</span></div>
  <div class="kv"><span class="k">Độ trễ cao, ops/giây cũng cao</span><span class="v">Tải thật, hoặc một khoá nóng. Hãy kiểm <code>INFO commandstats</code> tìm <code>usec_per_call</code> và dùng <code>--hotkeys</code> nếu bạn đang ở LFU. Chia mảnh không giúp gì cho một khoá nóng đơn lẻ (Bài 11.4); đệm ở tầng trên hoặc chẻ cái khoá ra thì giúp.</span></div>
  <div class="kv"><span class="k">Lượt ghi hỏng, lượt đọc ổn</span><span class="v">Ba ứng viên và chúng dễ phân biệt: <code>OOM</code> nghĩa là chạm <code>maxmemory</code> với <code>noeviction</code>, <code>MISCONF</code> nghĩa là một lần lưu đang thất bại (Bài 9.3), và <code>NOREPLICAS</code> nghĩa là <code>min-replicas-to-write</code> không thoả (Bài 11.2). Chính cái chữ trong thông báo lỗi là lời chẩn đoán.</span></div>
  <div class="kv"><span class="k">Những cú khựng vài giây thi thoảng</span><span class="v">Một cú fork. Hãy đối chiếu với <code>rdb_last_bgsave_time_sec</code>, <code>latest_fork_usec</code> và <code>LATENCY LATEST</code>. Nếu <code>latest_fork_usec</code> là vài chục mili giây mỗi gigabyte thì Transparent Huge Pages đang bật (Bài 9.3).</span></div>
  <div class="kv"><span class="k">Mọi thứ nhìn khoẻ mạnh, ứng dụng thì hỏng</span><span class="v">Vậy thì đó là vấn đề phía thư viện khách: một chỗ rò kết nối, một cái gáo cạn ở tầng trên Redis, một lần chuyển đổi Sentinel mà các khách không bám theo (Bài 11.3), hay một lệnh chặn đang ôm mất cái kết nối duy nhất (Bài 1.5). <code>CLIENT LIST</code> gom theo <code>name</code> và <code>addr</code> là bước tiếp theo.</span></div>
</div>

<h3>Đừng làm gì trong lúc chẩn đoán</h3>
<pre><code><span class="tok-comment"># ❌ Đừng bao giờ làm trên một máy production đang chật vật</span>
redis-cli KEYS '*'                    <span class="tok-comment"># chặn đúng bằng thời gian nó cần</span>
redis-cli MONITOR                     <span class="tok-comment"># đổ mọi lệnh ra, ngốn thông lượng thật</span>
redis-cli DEBUG SEGFAULT              <span class="tok-comment"># đúng, cái này có tồn tại. đừng.</span>
redis-cli FLUSHALL                    <span class="tok-comment"># "xoá bộ đệm xem sao"</span>
redis-cli CONFIG SET maxmemory 0      <span class="tok-comment"># gỡ cái trần, mời kẻ giết-vì-hết-bộ-nhớ tới</span>

<span class="tok-comment"># ✅ An toàn trên production, tất cả</span>
redis-cli --scan --pattern 'session:*' --count 100 | head
redis-cli --bigkeys
redis-cli --memkeys
redis-cli SLOWLOG GET 10
redis-cli LATENCY LATEST
redis-cli CLIENT LIST | awk '{print $2, $4}' | sort | uniq -c | sort -rn | head</code></pre>
<div class="pitfall"><strong>Cái bẫy:</strong> khởi động lại Redis làm nước đi đầu tiên. Đó là phản xạ, nó thường trông như có tác dụng, và nó lấy đi của bạn ba thứ cùng lúc. <strong>Bạn mất bằng chứng:</strong> <code>SLOWLOG</code>, lịch sử <code>LATENCY</code>, <code>CLIENT LIST</code> và mọi bộ đếm <code>INFO</code> đều bị đặt lại khi khởi động lại, nên cái lệnh gây ra sự cố giờ thành không thể biết được và nó sẽ tái diễn vào tuần sau. <strong>Bạn có thể mất dữ liệu:</strong> mọi thứ kể từ lần lưu gần nhất nếu bạn chỉ có RDB, hoặc tới một giây với AOF <code>everysec</code> — và nếu <code>appendonly</code> được đặt bằng <code>CONFIG SET</code> mà chưa từng ghi lại bằng <code>CONFIG REWRITE</code> thì cái máy quay lại mà không có nó (Bài 10.1). <strong>Và bạn biến một sự cố cục bộ thành một sự cố toàn phần:</strong> nạp một AOF lớn mất chín giây ở Bài 9.4, trong suốt thời gian đó Redis trả <code>-LOADING</code> cho mọi thứ, và một đàn khách cùng nối lại một lúc có thể đẩy quá trình hồi phục đi xa hơn con số đó nhiều. Hãy chạy khối phân loại trước — nó mất hai mươi giây, nó hoàn toàn an toàn, và nó thường chứa sẵn câu trả lời. Chỉ khởi động lại khi bạn đã biết mình khởi động lại <em>để làm gì</em>.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Redis latency troubleshooting</span><span class="lc-sub">Danh mục kiểm tra sự cố của chính Redis: lệnh chậm, cú fork, tráo ra đĩa, THP, mạng, và cách phân biệt từng cái với những cái còn lại. Trang vận hành hay nhất trong bộ tài liệu.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/info/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">INFO</span><span class="lc-sub">Từng trường trong từng mục. Đáng đọc kỹ một lượt lúc chẳng có gì đang cháy, để lúc có chuyện thì cái đầu ra phân loại là một lời chẩn đoán chứ không phải một bức tường số.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: phân loại bốn sự cố</span><span class="lc-sub">Bài chấm điểm: bốn khối <code>INFO</code> từ những hỏng hóc có hình dáng thật — hãy gọi tên nguyên nhân của từng cái, chọn lệnh tiếp theo, và chỉ ra hai "cách chữa" sẽ phá huỷ bằng chứng.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy chạy trọn khối phân loại trước khi đuổi theo bất cứ thứ gì — <code>PING</code>, <code>--latency</code>, ba mục <code>INFO</code>, <code>SLOWLOG</code> — vì một lần dán thường xuyên chứa hai ba phát hiện độc lập mà bạn sẽ bỏ lỡ nếu đi theo triệu chứng đầu tiên. Hãy hỏi bốn câu theo thứ tự: nó còn sống không, có bận không, có đầy không, có gì kết nối được không; tổ hợp độ trễ cao với ops/giây <em>thấp</em> là chữ ký của một lệnh chặn duy nhất, và chính chữ trong thông báo lỗi (<code>OOM</code>, <code>MISCONF</code>, <code>NOREPLICAS</code>) đã là lời chẩn đoán. Và đừng khởi động lại trước: nó xoá sạch slowlog, lịch sử độ trễ và mọi bộ đếm, nó làm mất dữ liệu được, và nạp một AOF lớn biến một sự cố cục bộ thành một sự cố toàn phần.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Seven failure shapes, and how to tell them apart|||12.2 — Bảy hình dáng hỏng hóc, và cách phân biệt chúng',
      slug: 'rd-12-2-bay-hinh-dang',
      type: 'LESSON',
      description: 'Bảy sự cố Redis lặp đi lặp lại ở mọi công ty, mỗi cái kèm chữ ký số liệu nhận ra nó, nguyên nhân thật, cách chữa ngay lúc đó và cách chữa để nó đừng tái diễn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Seven failure shapes, and how to tell them apart</h2>
<p class="lead">Redis fails in a small number of ways, over and over, at every company. Each one has a numeric signature that distinguishes it from the others in about ten seconds — and each one has a fix for right now and a different fix for never again.</p>

<h3>1 · The blocking command</h3>
<pre><code>redis-cli --latency -i 3
redis-cli INFO stats | grep instantaneous_ops_per_sec
redis-cli SLOWLOG GET 3 | paste - - - - - -
redis-cli INFO commandstats | sort -t= -k4 -rn | head -3</code></pre>
<div class="out">min: 0, max: 1204, avg: 88.12 (411 samples)
instantaneous_ops_per_sec:412
1	1755949214	1204882	KEYS user:*	10.1.4.22:53114
cmdstat_keys:calls=41,usec=48291204,usec_per_call=1177834.24
cmdstat_hgetall:calls=1204,usec=1444800,usec_per_call=1200.00
cmdstat_get:calls=8804111,usec=17608222,usec_per_call=2.00</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Signature</span><span class="v">Latency in the hundreds of milliseconds while <code>instantaneous_ops_per_sec</code> <em>drops</em>. Throughput falling as latency rises is the fingerprint — real load raises both together.</span></div>
  <div class="kv"><span class="k">Cause</span><span class="v">One O(N) command on a collection that grew: <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, an exact <code>XTRIM</code>, a Lua script looping (Lessons 2.3, 5.1, 7.3).</span></div>
  <div class="kv"><span class="k">Right now</span><span class="v">The slowlog names the command <em>and</em> the client address. Kill that client's connections with <code>CLIENT KILL ADDR</code>, or stop the job that runs it.</span></div>
  <div class="kv"><span class="k">Never again</span><span class="v"><code>-@dangerous</code> and <code>-@slow</code> on the ACL user that issued it (Lesson 10.3), <code>SCAN</code> instead of <code>KEYS</code>, <code>HMGET</code> instead of <code>HGETALL</code>, and an alert on <code>--latency</code> above a few milliseconds.</span></div>
</div>

<h3>2 · The memory wall</h3>
<pre><code>redis-cli INFO memory | grep -E "used_memory_human|maxmemory_human|maxmemory_policy"
redis-cli INFO stats  | grep -E "evicted_keys|expired_keys"
redis-cli SET probe 1
redis-cli --memkeys 2&gt;/dev/null | tail -3</code></pre>
<div class="out">used_memory_human:3.99G
maxmemory_human:4.00G
maxmemory_policy:noeviction
evicted_keys:0
expired_keys:1204471
(error) OOM command not allowed when used memory &gt; 'maxmemory'.
Biggest string found 'cache:report:2026-08' has 8912304 bytes
Biggest   hash found 'sess:archive' has 412880 bytes
Biggest   list found 'queue:dead' has 1204118 bytes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Signature</span><span class="v">Writes return <code>OOM</code>, reads work perfectly. Or, on an <code>allkeys-*</code> policy, no error at all but <code>evicted_keys</code> climbing — which is worse, because things are silently disappearing.</span></div>
  <div class="kv"><span class="k">Cause</span><span class="v">Almost always one of three: keys with no TTL accumulating (Lesson 2.2), an unbounded collection (Lessons 4.2, 8.2), or a dimension whose cardinality grew with traffic (Lesson 5.5).</span></div>
  <div class="kv"><span class="k">Right now</span><span class="v"><code>--memkeys</code> to name the culprit, then <code>UNLINK</code> it or give it a TTL. Raising <code>maxmemory</code> buys time only if the machine has the RAM and the fork headroom (Lesson 9.1).</span></div>
  <div class="kv"><span class="k">Never again</span><span class="v">Alert on <code>used_memory</code> at 75% of <code>maxmemory</code>, not at 100%. And separate the cache instance from the data instance so eviction cannot delete a queue (Lesson 9.2).</span></div>
</div>

<h3>3 · The connection leak</h3>
<pre><code>redis-cli INFO clients | grep -E "connected_clients|maxclients"
redis-cli INFO stats   | grep rejected_connections
redis-cli CLIENT LIST | awk '{print $2, $4}' | sed 's/addr=//;s/name=//' \\
  | awk '{split($1,a,":"); print a[1], $2}' | sort | uniq -c | sort -rn | head -4</code></pre>
<div class="out">connected_clients:9987
maxclients:10000
rejected_connections:41882
   8214 10.1.4.22 
   1204 10.1.4.23 api-worker
    412 10.1.4.24 api-worker
    157 10.1.4.25 reporting</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Signature</span><span class="v"><code>connected_clients</code> near <code>maxclients</code>, <code>rejected_connections</code> non-zero, and the count only ever rising — it does not fall overnight when traffic does.</span></div>
  <div class="kv"><span class="k">Cause</span><span class="v">A client creating a connection per request, a <code>duplicate()</code> inside a handler, or a subscriber that reconnects without closing (Lessons 1.5, 8.1). The <code>uniq -c</code> above names the host immediately: 8,214 unnamed connections from one machine.</span></div>
  <div class="kv"><span class="k">Right now</span><span class="v"><code>CLIENT KILL ADDR</code> per connection, or <code>CLIENT KILL MAXAGE</code> on 7.4 to clear the old ones in bulk. Then restart the offending service, which is what actually stops it.</span></div>
  <div class="kv"><span class="k">Never again</span><span class="v">Set a connection <code>name</code> per service so the next occurrence is a one-minute diagnosis, and alert at half of <code>maxclients</code> (Lesson 10.5).</span></div>
</div>

<h3>4 · The fork stall</h3>
<pre><code>redis-cli INFO stats | grep latest_fork_usec
redis-cli INFO persistence | grep -E "rdb_last_bgsave_time_sec|rdb_last_cow_size|aof_rewrite_in_progress"
redis-cli LATENCY LATEST
cat /sys/kernel/mm/transparent_hugepage/enabled</code></pre>
<div class="out">latest_fork_usec:1841204
rdb_last_bgsave_time_sec:14
rdb_last_cow_size:2841193472
aof_rewrite_in_progress:0
1) 1) "fork"
   2) (integer) 1755949214
   3) (integer) 1841
   4) (integer) 1841
[always] madvise never</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Signature: periodic multi-second stalls with nothing in the slowlog</span><span class="lz-lnote">The application sees latency spikes at regular intervals; <code>SLOWLOG</code> is empty because no command was slow — the whole process was stopped. <code>LATENCY LATEST</code> attributing the spike to <code>fork</code> is the confirmation.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cause: 1.8 seconds to fork, and THP is <code>always</code></span><span class="lz-lnote">A normal fork is about a millisecond per gigabyte. 1.8 seconds on a few-gigabyte instance means Transparent Huge Pages is making copy-on-write copy 2 MB at a time (Lesson 9.3). <code>rdb_last_cow_size</code> at 2.8 GB confirms the write rate is high during saves.</span></div>
  <div class="lz-layer"><span class="lz-lname">Fix: THP to <code>never</code>, <code>vm.overcommit_memory=1</code>, and fewer saves</span><span class="lz-lnote">Set both host settings persistently, move backups to a replica so the primary never forks for them (Lesson 11.1), and widen the <code>save</code> points if snapshots are running more often than the RPO requires.</span></div>
</div>

<h3>5, 6 and 7 · The three that are not about Redis</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">5 · The stampede</span><span class="lz-t">database load spikes while Redis is idle</span><span class="lz-d">Redis looks perfectly healthy — low latency, low ops/s — while the database is on fire in a repeating pattern that matches your TTL. A hot key expired and every request went to the database at once (Lesson 6.3). The fix is jitter, single-flight, or stale-while-revalidate, and none of it is a Redis setting.</span></div>
  <div class="lz-step"><span class="lz-k">6 · The silently stale cache</span><span class="lz-t">users report old data; every metric is green</span><span class="lz-d">No error anywhere, because nothing failed. Either an invalidation raced a slow reader (Lesson 6.4), or a read missed and filled the cache from a lagging replica (Lesson 11.2). Reproduce by comparing the cached value to the database directly — and remember that the TTL is what bounds the damage.</span></div>
  <div class="lz-step"><span class="lz-k">7 · The queue that stopped</span><span class="lz-t">lag rising, pending rising, consumers idle</span><span class="lz-d"><code>XINFO GROUPS</code> shows <code>lag</code> climbing while <code>pending</code> also climbs and every consumer's <code>idle</code> is in the minutes. The workers are dead or wedged, and nothing reclaims their entries without a sweeper (Lesson 8.4). <code>blocked_clients:0</code> is the same signal for a list-based queue (Lesson 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">What these three have in common</span><span class="lz-t">Redis is fine; the design around it is not</span><span class="lz-d">Every Redis metric is green, so the instinct is to look elsewhere in the stack — and the answer is in how the application uses Redis. These are the incidents that take longest, and the ones this course spent chapters 6 and 8 preventing.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> stopping at the first plausible cause. The triage block from Lesson 12.1 routinely surfaces two or three findings at once, and they are frequently related in a direction that is not obvious: memory pressure causes eviction, eviction destroys cache entries, the resulting miss rate causes a stampede, the stampede exhausts the connection pool, and the connection errors are what finally page someone. Start at the symptom and you fix the connection pool; start at the numbers and you find the unbounded key that started it forty minutes earlier. So write down every anomaly in the paste before acting on any of them, then ask which one could have caused the others — and afterwards, in the write-up, record the <em>chain</em> rather than the last link. The instance that filled up is the incident; the connection errors were only the part that was loud enough to notice.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Latency troubleshooting</span><span class="lc-sub">Redis's own catalogue of causes — slow commands, forks, swap, THP, network, expires — with the measurement that identifies each. The reference behind most of this lesson.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/latency-doctor/" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍⚕️</span>
  <span class="lc-body"><span class="lc-title">LATENCY DOCTOR</span><span class="lc-sub">Redis reads its own latency history and writes you a paragraph about it. Genuinely useful, and it needs <code>latency-monitor-threshold</code> set to work at all.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: name the shape</span><span class="lc-sub">Graded exercises: seven metric pastes, one per shape — identify each, give the immediate action and the permanent fix, and find the causal chain in the one paste that contains three findings.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> The shapes are distinguishable by numbers, not by the report: latency up with ops/s <em>down</em> is a blocking command, latency spikes with an empty slowlog is a fork, <code>connected_clients</code> that only rises is a leak, and <code>OOM</code> with reads working is the memory wall. Three of the seven are not Redis at all — a stampede, a silently stale cache and a stopped queue all show green Redis metrics, which is exactly why they take longest to diagnose. And do not stop at the first plausible cause: the findings usually form a chain, and the loud one at the end is rarely the one that started it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Bảy hình dáng hỏng hóc, và cách phân biệt chúng</h2>
<p class="lead">Redis hỏng theo một số ít cách, lặp đi lặp lại, ở mọi công ty. Mỗi cách có một chữ ký số liệu phân biệt nó với những cách khác trong khoảng mười giây — và mỗi cách có một phép chữa cho ngay lúc này và một phép chữa khác cho việc đừng bao giờ tái diễn.</p>

<h3>1 · Cái lệnh chặn</h3>
<pre><code>redis-cli --latency -i 3
redis-cli INFO stats | grep instantaneous_ops_per_sec
redis-cli SLOWLOG GET 3 | paste - - - - - -
redis-cli INFO commandstats | sort -t= -k4 -rn | head -3</code></pre>
<div class="out">min: 0, max: 1204, avg: 88.12 (411 samples)
instantaneous_ops_per_sec:412
1	1755949214	1204882	KEYS user:*	10.1.4.22:53114
cmdstat_keys:calls=41,usec=48291204,usec_per_call=1177834.24
cmdstat_hgetall:calls=1204,usec=1444800,usec_per_call=1200.00
cmdstat_get:calls=8804111,usec=17608222,usec_per_call=2.00</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chữ ký</span><span class="v">Độ trễ ở mức hàng trăm mili giây trong khi <code>instantaneous_ops_per_sec</code> <em>tụt xuống</em>. Thông lượng giảm khi độ trễ tăng chính là dấu vân tay — tải thật thì nâng cả hai lên cùng nhau.</span></div>
  <div class="kv"><span class="k">Nguyên nhân</span><span class="v">Một lệnh O(N) trên một tập hợp đã lớn lên: <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, một lệnh <code>XTRIM</code> chính xác, một script Lua đang lặp (Bài 2.3, 5.1, 7.3).</span></div>
  <div class="kv"><span class="k">Ngay lúc này</span><span class="v">Slowlog gọi tên cái lệnh <em>và</em> địa chỉ khách. Hãy giết các kết nối của khách đó bằng <code>CLIENT KILL ADDR</code>, hoặc dừng cái việc đang chạy nó.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ tái diễn</span><span class="v"><code>-@dangerous</code> và <code>-@slow</code> trên người dùng ACL đã gõ nó (Bài 10.3), <code>SCAN</code> thay cho <code>KEYS</code>, <code>HMGET</code> thay cho <code>HGETALL</code>, và một cảnh báo khi <code>--latency</code> vượt vài mili giây.</span></div>
</div>

<h3>2 · Bức tường bộ nhớ</h3>
<pre><code>redis-cli INFO memory | grep -E "used_memory_human|maxmemory_human|maxmemory_policy"
redis-cli INFO stats  | grep -E "evicted_keys|expired_keys"
redis-cli SET probe 1
redis-cli --memkeys 2&gt;/dev/null | tail -3</code></pre>
<div class="out">used_memory_human:3.99G
maxmemory_human:4.00G
maxmemory_policy:noeviction
evicted_keys:0
expired_keys:1204471
(error) OOM command not allowed when used memory &gt; 'maxmemory'.
Biggest string found 'cache:report:2026-08' has 8912304 bytes
Biggest   hash found 'sess:archive' has 412880 bytes
Biggest   list found 'queue:dead' has 1204118 bytes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chữ ký</span><span class="v">Các lượt ghi trả về <code>OOM</code>, các lượt đọc chạy hoàn hảo. Hoặc, với một chính sách <code>allkeys-*</code>, chẳng có lỗi nào cả nhưng <code>evicted_keys</code> đang leo lên — cái đó còn tệ hơn, vì đồ đang âm thầm biến mất.</span></div>
  <div class="kv"><span class="k">Nguyên nhân</span><span class="v">Gần như luôn là một trong ba: những khoá không có TTL chất đống lại (Bài 2.2), một tập hợp không có trần (Bài 4.2, 8.2), hoặc một cái chiều có lực lượng lớn lên theo lưu lượng (Bài 5.5).</span></div>
  <div class="kv"><span class="k">Ngay lúc này</span><span class="v"><code>--memkeys</code> để gọi tên thủ phạm, rồi <code>UNLINK</code> nó hoặc cho nó một TTL. Nâng <code>maxmemory</code> chỉ mua thêm thời gian nếu cái máy còn RAM và còn chỗ trống cho cú fork (Bài 9.1).</span></div>
  <div class="kv"><span class="k">Đừng bao giờ tái diễn</span><span class="v">Hãy đặt cảnh báo khi <code>used_memory</code> ở mức 75% của <code>maxmemory</code>, đừng đợi tới 100%. Và hãy tách máy bộ đệm khỏi máy dữ liệu để việc đẩy khoá không xoá được một hàng đợi (Bài 9.2).</span></div>
</div>

<h3>3 · Chỗ rò kết nối</h3>
<pre><code>redis-cli INFO clients | grep -E "connected_clients|maxclients"
redis-cli INFO stats   | grep rejected_connections
redis-cli CLIENT LIST | awk '{print $2, $4}' | sed 's/addr=//;s/name=//' \\
  | awk '{split($1,a,":"); print a[1], $2}' | sort | uniq -c | sort -rn | head -4</code></pre>
<div class="out">connected_clients:9987
maxclients:10000
rejected_connections:41882
   8214 10.1.4.22 
   1204 10.1.4.23 api-worker
    412 10.1.4.24 api-worker
    157 10.1.4.25 reporting</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chữ ký</span><span class="v"><code>connected_clients</code> sát <code>maxclients</code>, <code>rejected_connections</code> khác 0, và con số chỉ có tăng — nó không tụt vào ban đêm khi lưu lượng tụt.</span></div>
  <div class="kv"><span class="k">Nguyên nhân</span><span class="v">Một thư viện khách tạo một kết nối cho mỗi yêu cầu, một lệnh <code>duplicate()</code> nằm trong một bộ xử lý, hoặc một bên đăng ký nối lại mà không đóng cái cũ (Bài 1.5, 8.1). Cái <code>uniq -c</code> ở trên gọi tên cái máy ngay lập tức: 8.214 kết nối không tên từ một máy duy nhất.</span></div>
  <div class="kv"><span class="k">Ngay lúc này</span><span class="v"><code>CLIENT KILL ADDR</code> theo từng kết nối, hoặc <code>CLIENT KILL MAXAGE</code> trên bản 7.4 để dọn hàng loạt cái cũ. Rồi khởi động lại cái dịch vụ gây chuyện, vì đó mới là thứ thật sự chặn được nó.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ tái diễn</span><span class="v">Hãy đặt một cái <code>name</code> cho kết nối theo từng dịch vụ để lần sau việc chẩn đoán mất một phút, và hãy đặt cảnh báo ở mức nửa <code>maxclients</code> (Bài 10.5).</span></div>
</div>

<h3>4 · Cú khựng vì fork</h3>
<pre><code>redis-cli INFO stats | grep latest_fork_usec
redis-cli INFO persistence | grep -E "rdb_last_bgsave_time_sec|rdb_last_cow_size|aof_rewrite_in_progress"
redis-cli LATENCY LATEST
cat /sys/kernel/mm/transparent_hugepage/enabled</code></pre>
<div class="out">latest_fork_usec:1841204
rdb_last_bgsave_time_sec:14
rdb_last_cow_size:2841193472
aof_rewrite_in_progress:0
1) 1) "fork"
   2) (integer) 1755949214
   3) (integer) 1841
   4) (integer) 1841
[always] madvise never</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chữ ký: những cú khựng vài giây theo chu kỳ mà slowlog trống rỗng</span><span class="lz-lnote">Ứng dụng thấy độ trễ vọt lên đều đặn; <code>SLOWLOG</code> trống vì chẳng lệnh nào chậm cả — cả cái tiến trình đã bị dừng lại. <code>LATENCY LATEST</code> quy đợt vọt đó cho sự kiện <code>fork</code> là lời xác nhận.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nguyên nhân: 1,8 giây để fork, và THP đang ở <code>always</code></span><span class="lz-lnote">Một cú fork bình thường tốn khoảng một mili giây mỗi gigabyte. 1,8 giây trên một máy vài gigabyte nghĩa là Transparent Huge Pages đang bắt sao-chép-khi-ghi chép 2 MB một lần (Bài 9.3). <code>rdb_last_cow_size</code> ở mức 2,8 GB xác nhận rằng tốc độ ghi trong lúc lưu là cao.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cách chữa: THP về <code>never</code>, <code>vm.overcommit_memory=1</code>, và bớt số lần lưu</span><span class="lz-lnote">Hãy đặt cả hai thiết lập của máy chủ một cách bền vững, dời việc sao lưu sang một bản sao để bản chính không bao giờ fork vì nó nữa (Bài 11.1), và hãy nới các mốc <code>save</code> ra nếu ảnh chụp đang chạy dày hơn mức RPO đòi hỏi.</span></div>
</div>

<h3>5, 6 và 7 · Ba cái không phải chuyện của Redis</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">5 · Cú giẫm đạp</span><span class="lz-t">tải cơ sở dữ liệu vọt lên trong khi Redis nhàn rỗi</span><span class="lz-d">Redis trông hoàn toàn khoẻ mạnh — độ trễ thấp, ops/giây thấp — trong khi cơ sở dữ liệu đang cháy theo một chu kỳ lặp lại khớp với TTL của bạn. Một khoá nóng hết hạn và mọi yêu cầu cùng đổ xuống cơ sở dữ liệu một lúc (Bài 6.3). Cách chữa là rắc nhiễu, một-lượt-duy-nhất, hoặc phục-vụ-đồ-ôi-rồi-làm-mới, và chẳng cái nào là một thiết lập của Redis.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Bộ đệm ôi một cách âm thầm</span><span class="lz-t">người dùng báo dữ liệu cũ; mọi chỉ số đều xanh</span><span class="lz-d">Không có lỗi ở đâu cả, vì chẳng có gì thất bại. Hoặc là một phép vô hiệu hoá bị một bên đọc chậm đua qua mặt (Bài 6.4), hoặc là một lượt đọc trượt rồi nạp bộ đệm từ một bản sao đang tụt lại (Bài 11.2). Hãy tái hiện bằng cách so giá trị đã đệm với cơ sở dữ liệu trực tiếp — và hãy nhớ rằng TTL mới là thứ chặn mức thiệt hại.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Cái hàng đợi đã dừng</span><span class="lz-t">lag tăng, pending tăng, các consumer nằm im</span><span class="lz-d"><code>XINFO GROUPS</code> cho thấy <code>lag</code> leo lên trong khi <code>pending</code> cũng leo lên và <code>idle</code> của mọi consumer đều tính bằng phút. Các worker đã chết hoặc đang kẹt, và không gì đòi lại các mục của chúng nếu không có tiến trình quét (Bài 8.4). <code>blocked_clients:0</code> là đúng tín hiệu ấy cho một hàng đợi dựa trên list (Bài 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">Điểm chung của ba cái này</span><span class="lz-t">Redis thì ổn; thiết kế quanh nó thì không</span><span class="lz-d">Mọi chỉ số Redis đều xanh, nên bản năng là đi tìm ở chỗ khác trong hệ thống — mà câu trả lời lại nằm ở cách ứng dụng dùng Redis. Đây là những sự cố mất nhiều thời gian nhất, và là những cái mà khoá học này dành trọn chương 6 với chương 8 để ngăn.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> dừng lại ở nguyên nhân có lý đầu tiên. Khối phân loại ở Bài 12.1 thường xuyên phơi ra hai ba phát hiện cùng lúc, và chúng thường liên quan với nhau theo một chiều không hiển nhiên: áp lực bộ nhớ gây ra việc đẩy khoá, việc đẩy khoá phá huỷ các mục bộ đệm, tỉ lệ trượt sinh ra từ đó gây ra một cú giẫm đạp, cú giẫm đạp làm cạn gáo kết nối, và những lỗi kết nối mới là thứ cuối cùng gọi ai đó dậy. Bắt đầu từ triệu chứng thì bạn sửa cái gáo kết nối; bắt đầu từ các con số thì bạn tìm ra cái khoá không có trần đã khởi đầu mọi chuyện bốn mươi phút trước đó. Nên hãy ghi ra mọi bất thường trong lần dán đó trước khi hành động lên bất kỳ cái nào, rồi hỏi xem cái nào có thể đã gây ra những cái kia — và sau đó, trong bản tường trình, hãy ghi lại cả <em>chuỗi</em> chứ đừng ghi mỗi mắt xích cuối. Cái máy bị đầy mới là sự cố; những lỗi kết nối chỉ là phần đủ ồn để có người để ý.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Latency troubleshooting</span><span class="lc-sub">Danh mục nguyên nhân của chính Redis — lệnh chậm, cú fork, tráo ra đĩa, THP, mạng, hết hạn — kèm phép đo nhận ra từng cái. Là nguồn đứng sau phần lớn bài này.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/latency-doctor/" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍⚕️</span>
  <span class="lc-body"><span class="lc-title">LATENCY DOCTOR</span><span class="lc-sub">Redis tự đọc lịch sử độ trễ của chính nó rồi viết cho bạn một đoạn văn về chuyện đó. Thật sự hữu ích, và nó cần <code>latency-monitor-threshold</code> được đặt thì mới chạy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: gọi tên hình dáng</span><span class="lc-sub">Bài chấm điểm: bảy khối số liệu, mỗi hình dáng một khối — hãy nhận diện từng cái, đưa ra hành động tức thời và cách chữa vĩnh viễn, và tìm ra chuỗi nhân quả trong cái khối chứa tới ba phát hiện.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Các hình dáng phân biệt được bằng con số chứ không bằng lời báo cáo: độ trễ lên mà ops/giây <em>xuống</em> là một lệnh chặn, độ trễ vọt lên mà slowlog trống là một cú fork, <code>connected_clients</code> chỉ có tăng là một chỗ rò, và <code>OOM</code> kèm các lượt đọc vẫn chạy là bức tường bộ nhớ. Ba trong bảy cái hoàn toàn không phải chuyện của Redis — một cú giẫm đạp, một bộ đệm ôi âm thầm và một hàng đợi đã dừng đều cho thấy các chỉ số Redis màu xanh, và đó chính xác là lý do chúng mất nhiều thời gian chẩn đoán nhất. Và đừng dừng ở nguyên nhân có lý đầu tiên: các phát hiện thường tạo thành một chuỗi, và cái ồn ào ở cuối hiếm khi là cái đã khởi đầu mọi chuyện.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — The diagnostic toolbox|||12.3 — Bộ công cụ chẩn đoán',
      slug: 'rd-12-3-bo-cong-cu',
      type: 'LESSON',
      description: 'Mọi cờ của redis-cli đáng biết, họ lệnh LATENCY và MEMORY và OBJECT, COMMAND GETKEYS, MONITOR dùng cho an toàn, --intrinsic-latency để tách lỗi phần cứng khỏi lỗi Redis, và các công cụ bên ngoài đáng cài.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>The diagnostic toolbox</h2>
<p class="lead">Almost everything you need to diagnose Redis ships with Redis, and most of it is safe to run on production. This lesson is the inventory — organised by the question each tool answers, so that during an incident you are choosing rather than remembering.</p>

<h3>redis-cli, the flags worth knowing</h3>
<pre><code>redis-cli --scan --pattern 'sess:*' --count 200 | head -3   <span class="tok-comment"># safe KEYS</span>
redis-cli --bigkeys                     <span class="tok-comment"># biggest key per type, by element count</span>
redis-cli --memkeys                     <span class="tok-comment"># biggest key by MEMORY USAGE</span>
redis-cli --hotkeys                     <span class="tok-comment"># most accessed — requires an LFU policy</span>
redis-cli --stat -i 2                   <span class="tok-comment"># one live line per interval</span>
redis-cli --latency-history -i 10       <span class="tok-comment"># latency over time</span>
redis-cli --latency-dist                <span class="tok-comment"># a latency histogram, in colour</span>
redis-cli --intrinsic-latency 30        <span class="tok-comment"># the machine's own latency floor</span>
redis-cli --rdb /tmp/snap.rdb           <span class="tok-comment"># pull a snapshot over the wire</span>
redis-cli --pipe &lt; commands.txt         <span class="tok-comment"># bulk load, mass insert protocol</span>
redis-cli --no-raw --json GET somekey   <span class="tok-comment"># machine-readable output</span></code></pre>
<div class="out">sess:9f2a1c
sess:41b8e0
sess:7c2d91
[00.00%] Biggest hash found so far 'sess:archive' with 412880 bytes
Max latency so far: 1 microseconds.
Max latency so far: 24 microseconds.
Max latency so far: 41 microseconds.
41 microseconds — the system can deliver this baseline.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--intrinsic-latency</code> settles the argument</span><span class="v">It measures the host's own scheduling latency with no Redis involved. If it reports 40 microseconds and your <code>--latency</code> is 200 milliseconds, Redis is the problem. If it reports 30 milliseconds, the <em>machine</em> is the problem — a noisy neighbour, a throttled container, or a hypervisor — and no Redis tuning will help. Run it on the Redis host, not from your laptop.</span></div>
  <div class="kv"><span class="k"><code>--hotkeys</code> needs LFU</span><span class="v">It uses <code>OBJECT FREQ</code>, which only exists under an <code>*-lfu</code> policy (Lesson 9.2). On an LRU instance it errors — that is not a bug, and switching policy just to run it is usually not worth the disruption.</span></div>
  <div class="kv"><span class="k"><code>--bigkeys</code> and <code>--memkeys</code> answer different questions</span><span class="v">Element count versus bytes. A 50-field hash of megabyte values beats a 500,000-field hash of tiny integers, and only <code>--memkeys</code> tells you so (Lesson 9.1).</span></div>
  <div class="kv"><span class="k"><code>--rdb</code> is a backup over the network</span><span class="v">It asks the server for a full sync and writes the RDB locally — so it forks the primary (Lesson 9.3). Excellent for grabbing a copy of production to debug against locally; not something to run every hour.</span></div>
  <div class="kv"><span class="k">All of these use SCAN under the hood</span><span class="v"><code>--scan</code>, <code>--bigkeys</code>, <code>--memkeys</code> and <code>--hotkeys</code> iterate with a cursor and never block (Lesson 2.3). They are safe on production, which is exactly why they exist.</span></div>
</div>

<h3>The three command families</h3>
<pre><code><span class="tok-comment"># LATENCY — needs latency-monitor-threshold set to do anything</span>
redis-cli CONFIG SET latency-monitor-threshold 100
redis-cli LATENCY LATEST
redis-cli LATENCY HISTORY command | head -4
redis-cli LATENCY DOCTOR | head -6
redis-cli LATENCY RESET

<span class="tok-comment"># MEMORY — where the bytes are</span>
redis-cli MEMORY USAGE sess:9f2a1c SAMPLES 0
redis-cli MEMORY DOCTOR
redis-cli MEMORY PURGE                 <span class="tok-comment"># ask the allocator to release pages</span>

<span class="tok-comment"># OBJECT — what one key actually is</span>
redis-cli OBJECT ENCODING mykey
redis-cli OBJECT REFCOUNT mykey
redis-cli OBJECT IDLETIME mykey        <span class="tok-comment"># LRU policies</span>
redis-cli OBJECT FREQ mykey            <span class="tok-comment"># LFU policies</span></code></pre>
<div class="out">OK
1) 1) "command"
   2) (integer) 1755949214
   3) (integer) 214
   4) (integer) 214
1755949214 214
1755949104 188
1755948994 141
Dave, I have observed the system, and here is my analysis:

1. command: 12 latency spikes (average 184ms, mean deviation 41ms,
   period 88.40 sec). Worst all time event 214ms.
OK
312
Sam, I detected a few issues in this Redis instance memory implants:
 * High allocator fragmentation
OK
"listpack"
(integer) 1
(integer) 412
(error) ERR An LFU maxmemory policy is not selected...</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LATENCY tracks spikes by <em>event type</em></span><span class="lz-lnote">Not by command — by cause. <code>command</code>, <code>fork</code>, <code>expire-cycle</code>, <code>aof-write</code>, <code>eviction-del</code> and more. That attribution is what separates "a slow command" from "the RDB fork stalled us" (Lesson 12.2), and it is off until you set <code>latency-monitor-threshold</code>. Set it to 100 on every instance now, while nothing is wrong.</span></div>
  <div class="lz-layer"><span class="lz-lname">MEMORY PURGE is the one to know about</span><span class="lz-lnote">It asks jemalloc to return freed pages to the OS — useful after a large deletion when <code>mem_fragmentation_ratio</code> is high and you would rather not enable <code>activedefrag</code> permanently (Lesson 9.1). It is synchronous and can take a moment on a large instance.</span></div>
  <div class="lz-layer"><span class="lz-lname">OBJECT ENCODING is the fastest memory diagnosis</span><span class="lz-lnote">One command tells you whether a key is a cheap flat structure or the expensive general one — <code>listpack</code> versus <code>hashtable</code>, <code>intset</code> versus <code>hashtable</code>, <code>quicklist</code>, <code>skiplist</code>, <code>listpackex</code> (Lessons 4.2, 5.2, 5.4). When a key is unexpectedly large, this is the first thing to check.</span></div>
</div>

<h3>Reading a command you did not write</h3>
<pre><code>redis-cli COMMAND COUNT
redis-cli COMMAND INFO georadius | head -8
redis-cli COMMAND GETKEYS EVAL "return 1" 2 k1 k2 a1
redis-cli COMMAND GETKEYS ZADD myzset 1 a
redis-cli COMMAND DOCS SINTERCARD | head -6</code></pre>
<div class="out">(integer) 244
1) "georadius"
2) (integer) -6
3) 1) "write"
   2) "denyoom"
   3) "movablekeys"
4) (integer) 1
5) (integer) 1
6) (integer) 1
1) "k1"
2) "k2"
1) "myzset"
1) "SINTERCARD"
2) 1) "summary"
   2) "Returns the number of members from the intersection of multiple sets."
   3) "since"
   4) "7.0.0"</div>
<div class="callout ok"><strong><code>COMMAND GETKEYS</code> answers a question that is otherwise genuinely hard: which arguments of this command are keys?</strong> It matters for ACL rules (Lesson 10.3), for Cluster routing (Lesson 11.4), and for any proxy or middleware you write. Commands flagged <code>movablekeys</code> — <code>EVAL</code>, <code>GEORADIUS</code>, <code>SORT</code>, <code>ZUNIONSTORE</code>, <code>XREAD</code> — have key positions that depend on their arguments, which is exactly why guessing does not work and why this command exists. <code>COMMAND INFO</code> also gives you the flags, and <code>denyoom</code> is the one that tells you a command will be refused when memory is full.</div>

<h3>MONITOR, used safely</h3>
<pre><code><span class="tok-comment"># NEVER leave this running. Ten seconds, on a dev box, with a filter.</span>
timeout 10 redis-cli MONITOR | grep -i 'flushall\\|keys\\|config' | head -5
<span class="tok-comment"># Safer: sample the commandstats instead, twice, and diff</span>
redis-cli INFO commandstats &gt; /tmp/a; sleep 10; redis-cli INFO commandstats &gt; /tmp/b
diff /tmp/a /tmp/b | grep '^&gt;' | head -4</code></pre>
<div class="out">1755949214.882104 [0 10.1.4.22:53114] "KEYS" "user:*"
1755949215.104882 [0 10.1.4.23:41882] "CONFIG" "GET" "maxmemory"
&gt; cmdstat_get:calls=8812204,usec=17624408,usec_per_call=2.00
&gt; cmdstat_keys:calls=42,usec=49468038,usec_per_call=1177810.43
&gt; cmdstat_hgetall:calls=1218,usec=1461600,usec_per_call=1200.00</div>
<div class="pitfall"><strong>Pitfall:</strong> reaching for <code>MONITOR</code> as the default debugging tool. It streams every command executed by every client to your terminal, and the cost is not theoretical: Redis has to format and write each one, which on a busy instance measurably reduces throughput — the Redis documentation puts the hit at roughly 50% in its own benchmark. Worse, the output goes into a client output buffer that counts toward <code>maxmemory</code> (Lesson 9.1), so a <code>MONITOR</code> session on an already-full instance can push it over. And it exposes every key and value, including session tokens, to whoever is watching the terminal. Three rules make it survivable: <strong>never on a struggling production instance</strong> — it makes the incident worse; <strong>always with a <code>timeout</code> and a <code>grep</code></strong> so it cannot be forgotten; and <strong>prefer <code>INFO commandstats</code> sampled twice</strong>, which gives you the call counts and per-call cost of every command over an interval, with no streaming and no cost. The diff above answers "what is this instance actually doing" better than <code>MONITOR</code> does, and it is free.</div>

<h3>Worth installing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RedisInsight</span><span class="v">The official GUI: a key browser, a profiler, slowlog and memory analysis, and a CLI. Genuinely good for exploring an unfamiliar dataset, and the memory analyser answers "what is in here" faster than <code>--memkeys</code> plus guessing.</span></div>
  <div class="kv"><span class="k"><code>redis_exporter</code> for Prometheus</span><span class="v">Exposes every <code>INFO</code> field as a metric, plus per-key metrics if you configure them. This is what turns Lesson 12.4's dashboard from a wish into a dashboard.</span></div>
  <div class="kv"><span class="k"><code>redis-rdb-tools</code> / <code>rdb</code></span><span class="v">Parses an RDB file offline into a memory report or CSV. The safest possible analysis: copy the RDB somewhere else and take it apart with zero impact on production.</span></div>
  <div class="kv"><span class="k"><code>redis-check-rdb</code> and <code>redis-check-aof</code></span><span class="v">Already installed with Redis. Verify a backup at backup time rather than at restore time (Lesson 9.5); <code>--fix</code> on the AOF discards everything after the corruption, so copy first.</span></div>
  <div class="kv"><span class="k"><code>memtier_benchmark</code></span><span class="v">More flexible than <code>redis-benchmark</code>: mixed read/write ratios, key patterns, data sizes. Use it when you need to reproduce your actual workload rather than a synthetic one (Lesson 11.5).</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">redis-cli, fully documented</span><span class="lc-sub">Every flag including the ones nobody knows about: <code>--intrinsic-latency</code>, <code>--lru-test</code>, <code>--rdb</code>, <code>--pipe</code>, the JSON output modes and the cluster subcommands.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/redisinsight/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">RedisInsight</span><span class="lc-sub">The official GUI: memory analysis, the profiler, the slowlog viewer and a key browser that understands every type. Free, and worth having installed before you need it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the right tool</span><span class="lc-sub">Graded exercises: six questions about an instance — choose the one command that answers each, use <code>--intrinsic-latency</code> to rule the host in or out, and replace a <code>MONITOR</code> session with a <code>commandstats</code> diff.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Nearly every diagnostic ships with Redis and is safe on production because it uses <code>SCAN</code> — <code>--scan</code>, <code>--bigkeys</code>, <code>--memkeys</code>, <code>--hotkeys</code>, <code>--stat</code>, <code>--latency</code> — and <code>--intrinsic-latency</code> is the one that settles whether the problem is Redis or the machine underneath it. Set <code>latency-monitor-threshold</code> on every instance today, because <code>LATENCY</code> attributes spikes by <em>cause</em> — command, fork, expire cycle — and it records nothing until you turn it on. And do not reach for <code>MONITOR</code>: it costs real throughput, fills a client buffer that counts toward <code>maxmemory</code>, and exposes every value — while two samples of <code>INFO commandstats</code> answer the same question for free.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Bộ công cụ chẩn đoán</h2>
<p class="lead">Gần như mọi thứ bạn cần để chẩn đoán Redis đều đi kèm sẵn với Redis, và phần lớn chúng chạy an toàn trên production. Bài này là bản kiểm kê — sắp xếp theo câu hỏi mà từng công cụ trả lời, để lúc có sự cố thì bạn đang chọn chứ không phải đang cố nhớ.</p>

<h3>redis-cli, những cờ đáng biết</h3>
<pre><code>redis-cli --scan --pattern 'sess:*' --count 200 | head -3   <span class="tok-comment"># KEYS an toàn</span>
redis-cli --bigkeys                     <span class="tok-comment"># khoá lớn nhất mỗi kiểu, theo số phần tử</span>
redis-cli --memkeys                     <span class="tok-comment"># khoá lớn nhất theo MEMORY USAGE</span>
redis-cli --hotkeys                     <span class="tok-comment"># được truy cập nhiều nhất — cần chính sách LFU</span>
redis-cli --stat -i 2                   <span class="tok-comment"># mỗi khoảng một dòng trực tiếp</span>
redis-cli --latency-history -i 10       <span class="tok-comment"># độ trễ theo thời gian</span>
redis-cli --latency-dist                <span class="tok-comment"># biểu đồ tần suất độ trễ, có màu</span>
redis-cli --intrinsic-latency 30        <span class="tok-comment"># sàn độ trễ của chính cái máy</span>
redis-cli --rdb /tmp/snap.rdb           <span class="tok-comment"># kéo một ảnh chụp về qua đường truyền</span>
redis-cli --pipe &lt; commands.txt         <span class="tok-comment"># nạp hàng loạt, giao thức chèn khối lượng lớn</span>
redis-cli --no-raw --json GET somekey   <span class="tok-comment"># đầu ra máy đọc được</span></code></pre>
<div class="out">sess:9f2a1c
sess:41b8e0
sess:7c2d91
[00.00%] Biggest hash found so far 'sess:archive' with 412880 bytes
Max latency so far: 1 microseconds.
Max latency so far: 24 microseconds.
Max latency so far: 41 microseconds.
41 microseconds — the system can deliver this baseline.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--intrinsic-latency</code> phân định cuộc tranh cãi</span><span class="v">Nó đo độ trễ xếp lịch của chính cái máy chủ mà không có Redis dính vào. Nếu nó báo 40 micro giây trong khi <code>--latency</code> của bạn là 200 mili giây thì Redis là vấn đề. Nếu nó báo 30 mili giây thì <em>cái máy</em> là vấn đề — một hàng xóm ồn ào, một container bị bóp, hay một trình ảo hoá — và không mức tinh chỉnh Redis nào giúp được. Hãy chạy nó trên chính máy Redis, đừng chạy từ laptop của bạn.</span></div>
  <div class="kv"><span class="k"><code>--hotkeys</code> cần LFU</span><span class="v">Nó dùng <code>OBJECT FREQ</code>, vốn chỉ tồn tại dưới một chính sách <code>*-lfu</code> (Bài 9.2). Trên một máy chạy LRU thì nó báo lỗi — đó không phải lỗi phần mềm, và đổi chính sách chỉ để chạy nó thì thường không đáng với mức xáo trộn gây ra.</span></div>
  <div class="kv"><span class="k"><code>--bigkeys</code> và <code>--memkeys</code> trả lời hai câu hỏi khác nhau</span><span class="v">Số phần tử so với số byte. Một hash 50 trường chứa các giá trị cỡ megabyte thắng một hash 500.000 trường toàn số nguyên tí hon, và chỉ <code>--memkeys</code> nói cho bạn biết (Bài 9.1).</span></div>
  <div class="kv"><span class="k"><code>--rdb</code> là một bản sao lưu qua mạng</span><span class="v">Nó xin máy chủ một lần đồng bộ đầy đủ rồi ghi tệp RDB ra tại chỗ — nên nó fork bản chính (Bài 9.3). Tuyệt vời để lấy một bản sao của production về gỡ lỗi ở máy mình; không phải thứ để chạy mỗi tiếng.</span></div>
  <div class="kv"><span class="k">Tất cả chúng đều dùng SCAN bên dưới</span><span class="v"><code>--scan</code>, <code>--bigkeys</code>, <code>--memkeys</code> và <code>--hotkeys</code> đều duyệt bằng con trỏ và không bao giờ chặn (Bài 2.3). Chúng an toàn trên production, và đó chính xác là lý do chúng tồn tại.</span></div>
</div>

<h3>Ba họ lệnh</h3>
<pre><code><span class="tok-comment"># LATENCY — cần đặt latency-monitor-threshold thì mới làm gì</span>
redis-cli CONFIG SET latency-monitor-threshold 100
redis-cli LATENCY LATEST
redis-cli LATENCY HISTORY command | head -4
redis-cli LATENCY DOCTOR | head -6
redis-cli LATENCY RESET

<span class="tok-comment"># MEMORY — các byte đang nằm ở đâu</span>
redis-cli MEMORY USAGE sess:9f2a1c SAMPLES 0
redis-cli MEMORY DOCTOR
redis-cli MEMORY PURGE                 <span class="tok-comment"># xin bộ cấp phát trả trang về</span>

<span class="tok-comment"># OBJECT — một cái khoá thật ra là cái gì</span>
redis-cli OBJECT ENCODING mykey
redis-cli OBJECT REFCOUNT mykey
redis-cli OBJECT IDLETIME mykey        <span class="tok-comment"># các chính sách LRU</span>
redis-cli OBJECT FREQ mykey            <span class="tok-comment"># các chính sách LFU</span></code></pre>
<div class="out">OK
1) 1) "command"
   2) (integer) 1755949214
   3) (integer) 214
   4) (integer) 214
1755949214 214
1755949104 188
1755948994 141
Dave, I have observed the system, and here is my analysis:

1. command: 12 latency spikes (average 184ms, mean deviation 41ms,
   period 88.40 sec). Worst all time event 214ms.
OK
312
Sam, I detected a few issues in this Redis instance memory implants:
 * High allocator fragmentation
OK
"listpack"
(integer) 1
(integer) 412
(error) ERR An LFU maxmemory policy is not selected...</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LATENCY theo dõi các đợt vọt theo <em>loại sự kiện</em></span><span class="lz-lnote">Không theo lệnh — mà theo nguyên nhân. <code>command</code>, <code>fork</code>, <code>expire-cycle</code>, <code>aof-write</code>, <code>eviction-del</code> và nhiều nữa. Việc quy trách nhiệm đó là thứ tách "một lệnh chậm" khỏi "cú fork ghi RDB làm ta khựng" (Bài 12.2), và nó tắt cho tới khi bạn đặt <code>latency-monitor-threshold</code>. Hãy đặt nó bằng 100 trên mọi máy ngay bây giờ, lúc chưa có gì hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">MEMORY PURGE là cái đáng biết</span><span class="lz-lnote">Nó xin jemalloc trả các trang đã giải phóng về cho hệ điều hành — có ích sau một đợt xoá lớn khi <code>mem_fragmentation_ratio</code> đang cao mà bạn không muốn bật <code>activedefrag</code> vĩnh viễn (Bài 9.1). Nó đồng bộ và có thể mất một khoảnh khắc trên máy lớn.</span></div>
  <div class="lz-layer"><span class="lz-lname">OBJECT ENCODING là phép chẩn đoán bộ nhớ nhanh nhất</span><span class="lz-lnote">Một lệnh cho bạn biết một khoá là cấu trúc phẳng rẻ tiền hay cấu trúc tổng quát đắt đỏ — <code>listpack</code> so với <code>hashtable</code>, <code>intset</code> so với <code>hashtable</code>, <code>quicklist</code>, <code>skiplist</code>, <code>listpackex</code> (Bài 4.2, 5.2, 5.4). Khi một khoá lớn bất thường thì đây là thứ cần kiểm đầu tiên.</span></div>
</div>

<h3>Đọc một cái lệnh không phải bạn viết</h3>
<pre><code>redis-cli COMMAND COUNT
redis-cli COMMAND INFO georadius | head -8
redis-cli COMMAND GETKEYS EVAL "return 1" 2 k1 k2 a1
redis-cli COMMAND GETKEYS ZADD myzset 1 a
redis-cli COMMAND DOCS SINTERCARD | head -6</code></pre>
<div class="out">(integer) 244
1) "georadius"
2) (integer) -6
3) 1) "write"
   2) "denyoom"
   3) "movablekeys"
4) (integer) 1
5) (integer) 1
6) (integer) 1
1) "k1"
2) "k2"
1) "myzset"
1) "SINTERCARD"
2) 1) "summary"
   2) "Returns the number of members from the intersection of multiple sets."
   3) "since"
   4) "7.0.0"</div>
<div class="callout ok"><strong><code>COMMAND GETKEYS</code> trả lời một câu hỏi mà nếu không có nó thì thật sự khó: trong cái lệnh này thì tham số nào là khoá?</strong> Nó quan trọng với luật ACL (Bài 10.3), với định tuyến Cluster (Bài 11.4), và với bất kỳ proxy hay tầng trung gian nào bạn tự viết. Những lệnh gắn cờ <code>movablekeys</code> — <code>EVAL</code>, <code>GEORADIUS</code>, <code>SORT</code>, <code>ZUNIONSTORE</code>, <code>XREAD</code> — có vị trí khoá phụ thuộc vào chính các tham số của chúng, đó chính xác là lý do đoán mò không xong và là lý do lệnh này tồn tại. <code>COMMAND INFO</code> cũng cho bạn các cờ, và <code>denyoom</code> là cái nói cho bạn biết một lệnh sẽ bị từ chối khi bộ nhớ đầy.</div>

<h3>MONITOR, dùng cho an toàn</h3>
<pre><code><span class="tok-comment"># ĐỪNG BAO GIỜ để nó chạy dai. Mười giây, trên máy phát triển, có bộ lọc.</span>
timeout 10 redis-cli MONITOR | grep -i 'flushall\\|keys\\|config' | head -5
<span class="tok-comment"># An toàn hơn: hãy lấy mẫu commandstats hai lần rồi so sánh</span>
redis-cli INFO commandstats &gt; /tmp/a; sleep 10; redis-cli INFO commandstats &gt; /tmp/b
diff /tmp/a /tmp/b | grep '^&gt;' | head -4</code></pre>
<div class="out">1755949214.882104 [0 10.1.4.22:53114] "KEYS" "user:*"
1755949215.104882 [0 10.1.4.23:41882] "CONFIG" "GET" "maxmemory"
&gt; cmdstat_get:calls=8812204,usec=17624408,usec_per_call=2.00
&gt; cmdstat_keys:calls=42,usec=49468038,usec_per_call=1177810.43
&gt; cmdstat_hgetall:calls=1218,usec=1461600,usec_per_call=1200.00</div>
<div class="pitfall"><strong>Cái bẫy:</strong> với tay lấy <code>MONITOR</code> làm công cụ gỡ lỗi mặc định. Nó đổ mọi lệnh do mọi khách thực thi về cửa sổ của bạn, và cái giá không phải lý thuyết: Redis phải định dạng rồi ghi từng cái, và trên một máy bận thì việc đó làm giảm thông lượng ở mức đo được — tài liệu Redis đặt mức thiệt hại vào khoảng 50% trong phép đo của chính họ. Tệ hơn, đầu ra đi vào một bộ đệm đầu ra của khách vốn được tính vào <code>maxmemory</code> (Bài 9.1), nên một phiên <code>MONITOR</code> trên một máy vốn đã đầy có thể đẩy nó vượt trần. Và nó phơi ra mọi khoá và mọi giá trị, kể cả mã phiên đăng nhập, cho bất cứ ai đang nhìn màn hình. Ba luật làm cho nó sống được: <strong>đừng bao giờ chạy trên một máy production đang chật vật</strong> — nó làm sự cố tệ hơn; <strong>luôn kèm một lệnh <code>timeout</code> và một <code>grep</code></strong> để không thể quên nó; và <strong>hãy ưu tiên <code>INFO commandstats</code> lấy mẫu hai lần</strong>, cái đó cho bạn số lời gọi và chi phí mỗi lời gọi của mọi lệnh trong một khoảng, không đổ dữ liệu và không tốn gì. Phép so sánh ở trên trả lời câu "cái máy này thật sự đang làm gì" tốt hơn <code>MONITOR</code>, và nó miễn phí.</div>

<h3>Đáng cài thêm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RedisInsight</span><span class="v">Giao diện đồ hoạ chính thức: trình duyệt khoá, một bộ hồ sơ hiệu năng, slowlog và phân tích bộ nhớ, cùng một CLI. Thật sự tốt để khám phá một tập dữ liệu lạ, và bộ phân tích bộ nhớ trả lời câu "trong này có gì" nhanh hơn <code>--memkeys</code> cộng đoán mò.</span></div>
  <div class="kv"><span class="k"><code>redis_exporter</code> cho Prometheus</span><span class="v">Phơi mọi trường <code>INFO</code> thành một chỉ số, cộng thêm chỉ số theo từng khoá nếu bạn cấu hình. Đây là thứ biến bảng điều khiển ở Bài 12.4 từ một mong muốn thành một bảng điều khiển thật.</span></div>
  <div class="kv"><span class="k"><code>redis-rdb-tools</code> / <code>rdb</code></span><span class="v">Phân tích một tệp RDB ngoại tuyến thành một báo cáo bộ nhớ hoặc CSV. Là phép phân tích an toàn nhất có thể: chép tệp RDB đi chỗ khác rồi mổ xẻ nó với tác động bằng 0 lên production.</span></div>
  <div class="kv"><span class="k"><code>redis-check-rdb</code> và <code>redis-check-aof</code></span><span class="v">Vốn đã cài sẵn cùng Redis. Hãy kiểm một bản sao lưu ngay lúc sao lưu chứ đừng đợi lúc khôi phục (Bài 9.5); <code>--fix</code> trên AOF sẽ vứt bỏ mọi thứ sau chỗ hỏng, nên hãy chép ra trước.</span></div>
  <div class="kv"><span class="k"><code>memtier_benchmark</code></span><span class="v">Linh hoạt hơn <code>redis-benchmark</code>: tỉ lệ đọc/ghi trộn lẫn, các mẫu khoá, các kích thước dữ liệu. Hãy dùng nó khi bạn cần tái hiện khối lượng việc thật của mình chứ không phải một khối lượng tổng hợp (Bài 11.5).</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">redis-cli, tài liệu đầy đủ</span><span class="lc-sub">Mọi cờ kể cả những cái chẳng ai biết: <code>--intrinsic-latency</code>, <code>--lru-test</code>, <code>--rdb</code>, <code>--pipe</code>, các chế độ đầu ra JSON và các lệnh con cho cụm.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/redisinsight/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">RedisInsight</span><span class="lc-sub">Giao diện đồ hoạ chính thức: phân tích bộ nhớ, bộ hồ sơ hiệu năng, trình xem slowlog và một trình duyệt khoá hiểu mọi kiểu dữ liệu. Miễn phí, và đáng cài sẵn trước khi cần tới.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chọn đúng công cụ</span><span class="lc-sub">Bài chấm điểm: sáu câu hỏi về một cái máy — hãy chọn đúng một lệnh trả lời từng câu, dùng <code>--intrinsic-latency</code> để loại trừ hay quy tội cho cái máy chủ, và thay một phiên <code>MONITOR</code> bằng một phép so sánh <code>commandstats</code>.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Gần như mọi công cụ chẩn đoán đều đi kèm sẵn với Redis và an toàn trên production vì chúng dùng <code>SCAN</code> — <code>--scan</code>, <code>--bigkeys</code>, <code>--memkeys</code>, <code>--hotkeys</code>, <code>--stat</code>, <code>--latency</code> — và <code>--intrinsic-latency</code> là cái phân định xem vấn đề nằm ở Redis hay ở cái máy bên dưới nó. Hãy đặt <code>latency-monitor-threshold</code> trên mọi máy ngay hôm nay, vì <code>LATENCY</code> quy các đợt vọt theo <em>nguyên nhân</em> — lệnh, fork, chu kỳ hết hạn — và nó không ghi gì cho tới khi bạn bật lên. Và đừng với tay lấy <code>MONITOR</code>: nó tốn thông lượng thật, làm đầy một bộ đệm khách được tính vào <code>maxmemory</code>, và phơi ra mọi giá trị — trong khi hai lần lấy mẫu <code>INFO commandstats</code> trả lời đúng câu hỏi đó mà miễn phí.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Monitoring: the dashboard and the eight alerts|||12.4 — Giám sát: bảng điều khiển và tám cảnh báo',
      slug: 'rd-12-4-giam-sat',
      type: 'LESSON',
      description: 'Mười hai chỉ số đáng vẽ đồ thị và vì sao, tám cảnh báo đáng gọi người dậy kèm ngưỡng có lý lẽ, những cảnh báo phổ biến nên xoá đi, và cuốn sổ tay mà mỗi cảnh báo phải trỏ tới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Monitoring: the dashboard and the eight alerts</h2>
<p class="lead">A Redis dashboard with forty panels is a dashboard nobody reads during an incident. Twelve metrics cover everything in Lesson 12.2, eight alerts are worth waking someone for, and everything else belongs on a graph you look at deliberately rather than a page that interrupts you.</p>

<h3>The twelve metrics</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Saturation · <code>used_memory</code> / <code>maxmemory</code></span><span class="v">As a percentage. This is the single most predictive number Redis publishes: nearly every incident in Chapter 9 begins here, and it moves hours before anything breaks.</span></div>
  <div class="kv"><span class="k">Saturation · <code>connected_clients</code> / <code>maxclients</code></span><span class="v">Also as a percentage, and watch its <em>shape</em>: a line that only rises is a leak, not growth (Lesson 10.5).</span></div>
  <div class="kv"><span class="k">Latency · <code>--latency</code> p99, or the exporter's <code>latency_percentiles</code></span><span class="v">Sub-millisecond on a healthy instance. This is the metric that catches a blocking command before anyone files a ticket (Lesson 6.5).</span></div>
  <div class="kv"><span class="k">Throughput · <code>instantaneous_ops_per_sec</code></span><span class="v">Alongside latency, because the <em>combination</em> is the diagnosis: latency up with throughput down is a blocking command, both up is real load (Lesson 12.2).</span></div>
  <div class="kv"><span class="k">Errors · <code>rejected_connections</code>, <code>evicted_keys</code></span><span class="v">Two counters that should be flat at zero on a data instance. Any movement is a fact, not a warning.</span></div>
  <div class="kv"><span class="k">Cache health · <code>keyspace_hits</code> / <code>keyspace_misses</code></span><span class="v">As a rate rather than the lifetime total, and remember it is instance-wide — per-cache numbers only exist if your application counts them (Lesson 6.5).</span></div>
  <div class="kv"><span class="k">Persistence · <code>rdb_last_bgsave_status</code>, <code>aof_last_write_status</code></span><span class="v">Both should read <code>ok</code>. An <code>err</code> means writes are about to start failing with <code>MISCONF</code> (Lesson 9.3).</span></div>
  <div class="kv"><span class="k">Forks · <code>latest_fork_usec</code>, <code>rdb_last_cow_size</code></span><span class="v">Roughly a millisecond per gigabyte is normal. Tens of milliseconds per gigabyte means Transparent Huge Pages, and this graph is how you find it (Lesson 9.3).</span></div>
  <div class="kv"><span class="k">Replication · <code>master_link_status</code>, offset delta</span><span class="v">The byte difference between primary and replica offsets is lag in its most direct form, and a link that has been <code>down</code> for thirty seconds is a replica serving increasingly old data (Lesson 11.1).</span></div>
  <div class="kv"><span class="k">Workers · <code>blocked_clients</code></span><span class="v">Your consumer count, visible. Zero when it should be twenty means the workers are dead, and nothing else in your monitoring says so (Lesson 4.1).</span></div>
  <div class="kv"><span class="k">Queues · stream <code>lag</code> and <code>pending</code></span><span class="v">From <code>XINFO GROUPS</code>. Lag rising is falling behind; pending rising with flat lag is handlers failing (Lesson 8.3).</span></div>
  <div class="kv"><span class="k">Fragmentation · <code>mem_fragmentation_ratio</code></span><span class="v">Interesting above 1.5 and an emergency below 1.0, which means swapping (Lesson 9.1). Not worth alerting on; very much worth graphing.</span></div>
</div>

<h3>The eight alerts</h3>
<pre><code><span class="tok-comment"># Prometheus rules, with the reasoning in the annotations</span>
- alert: RedisMemoryHigh
  expr: redis_memory_used_bytes / redis_memory_max_bytes &gt; 0.75
  for: 10m
  annotations: { summary: "75% of maxmemory — act before OOM, not at it" }

- alert: RedisEvictingKeys
  expr: increase(redis_evicted_keys_total[10m]) &gt; 0
  annotations: { summary: "Keys are being deleted to make room" }

- alert: RedisConnectionsHigh
  expr: redis_connected_clients / redis_config_maxclients &gt; 0.5
  for: 15m
  annotations: { summary: "Half of maxclients — leak or genuine growth" }

- alert: RedisRejectingConnections
  expr: increase(redis_rejected_connections_total[5m]) &gt; 0
  annotations: { summary: "maxclients reached; clients cannot connect" }

- alert: RedisPersistenceFailing
  expr: redis_rdb_last_bgsave_status == 0 or redis_aof_last_write_status == 0
  annotations: { summary: "Saves failing — MISCONF and write errors next" }

- alert: RedisReplicationBroken
  expr: redis_master_link_up == 0
  for: 1m
  annotations: { summary: "Replica disconnected; failover material is stale" }

- alert: RedisLatencyHigh
  expr: redis_latency_percentiles_usec{quantile="0.99"} &gt; 10000
  for: 5m
  annotations: { summary: "p99 above 10ms — check SLOWLOG for a blocking command" }

- alert: RedisWorkersGone
  expr: redis_blocked_clients == 0
  for: 5m
  annotations: { summary: "No blocking consumers — the queue workers are dead" }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Alert at 75%, not at 100%</span><span class="lz-t">and with a <code>for:</code> clause</span><span class="lz-d">An alert that fires when memory is already full gives you no time to do anything but restart. 75% with a ten-minute window gives you an hour on most growth curves, and the <code>for:</code> stops a transient spike from paging anyone.</span></div>
  <div class="lz-step"><span class="lz-k">Alert on counters <em>moving</em>, not on their value</span><span class="lz-t">increase(x[10m]) &gt; 0</span><span class="lz-d"><code>evicted_keys</code> and <code>rejected_connections</code> are cumulative, so a threshold on the raw number fires forever after one bad afternoon. The rate of increase is the signal.</span></div>
  <div class="lz-step"><span class="lz-k">Alert on the derivative where the level is meaningless</span><span class="lz-t">a miss rate rising against flat traffic</span><span class="lz-d">A 40% cache miss rate might be perfectly healthy (Lesson 6.5). A miss rate that <em>rises</em> while request volume does not is always something: shorter TTLs, a growing working set, or penetration.</span></div>
  <div class="lz-step"><span class="lz-k">Every alert names its runbook</span><span class="lz-t">summary, cause, first command, escalation</span><span class="lz-d">An alert that says "Redis memory high" and nothing else costs the responder ten minutes of rediscovery. Link it to the triage block from Lesson 12.1 and the specific shape from Lesson 12.2, and the same alert costs two minutes.</span></div>
</div>

<h3>Alerts to delete</h3>
<pre><code><span class="tok-comment"># ❌ These page people and teach them to ignore pages</span>
- alert: RedisHitRateLow              <span class="tok-comment"># a ratio with no units (Lesson 6.5)</span>
  expr: redis_keyspace_hits / (hits + misses) &lt; 0.9

- alert: RedisMemoryFragmentation     <span class="tok-comment"># spikes after every big delete</span>
  expr: redis_mem_fragmentation_ratio &gt; 1.5

- alert: RedisHighOps                 <span class="tok-comment"># success is not an incident</span>
  expr: redis_instantaneous_ops_per_sec &gt; 50000

- alert: RedisKeyCountChanged         <span class="tok-comment"># keys expiring is the system working</span>
  expr: delta(redis_db_keys[5m]) &lt; -1000</code></pre>
<div class="callout warn"><strong>Every one of those fires regularly on a perfectly healthy instance, and the cost is not the noise — it is the habit.</strong> A team that has learned to dismiss Redis alerts without reading them will dismiss the one that mattered, and the incident will run for an hour before anyone looks. Hit ratio has no units and is trivially gameable. Fragmentation spikes for ninety seconds after every large deletion. High throughput is your service succeeding. And a key count dropping by thousands is expiration doing exactly its job. If an alert has never once corresponded to something a human needed to do, deleting it makes the system safer, not less monitored — put those four on a dashboard instead, where they are useful context and interrupt nobody.</div>

<h3>The runbook every alert points at</h3>
<pre><code><span class="tok-comment">## RedisMemoryHigh — used_memory &gt; 75% of maxmemory for 10m</span>

1. Triage:      the block from Lesson 12.1 — paste the whole output
2. Find it:     redis-cli --memkeys      (biggest key by bytes)
                redis-cli INFO keyspace  (keys vs expires — TTL coverage)
3. Decide:
   - one huge key, no longer needed  → UNLINK it
   - a prefix with no TTLs           → EXPIRE them, then fix the writer
   - genuine growth                  → raise maxmemory if the machine
                                       has the RAM AND the fork headroom
   - unclear                         → escalate; do NOT FLUSHALL
4. After:       why did it have no TTL? add the alert threshold you
                wish had existed, and write the finding down</code></pre>

<div class="pitfall"><strong>Pitfall:</strong> monitoring Redis and not monitoring what your application does with it. Every metric in this lesson is server-side, and three of the seven failure shapes in Lesson 12.2 show green on all of them: a stampede (Redis idle, database on fire), a silently stale cache (nothing failed anywhere), and a queue whose workers died (Redis perfectly healthy, nothing being processed). None of those is visible from <code>INFO</code>, and all of them are visible from your application if you instrument it — per-cache hit and miss counters tagged by cache name, the latency of a cache miss, queue depth and consumer heartbeat, and the age of the oldest unacknowledged entry. That is a few dozen lines (Lesson 6.5) and it converts your three longest-to-diagnose incidents into three obvious graphs. The rule underneath: <strong>Redis metrics tell you whether Redis is healthy; only your metrics tell you whether your use of it is.</strong></div>

<a class="link-card" href="https://github.com/oliver006/redis_exporter" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">redis_exporter</span><span class="lc-sub">The Prometheus exporter everyone uses: every <code>INFO</code> field as a metric, optional per-key and per-stream metrics, and a Grafana dashboard you can import as a starting point.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">The latency monitor</span><span class="lc-sub">What each tracked event type means and how to expose it — the source of the latency numbers that make the p99 alert above meaningful.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the dashboard</span><span class="lc-sub">Graded exercises: choose twelve panels from a list of forty and justify each, write four alert rules with thresholds and <code>for:</code> clauses, delete three noisy alerts with a reason, and write the runbook for one of them.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Twelve metrics cover every failure shape in this chapter, and the useful ones come in pairs — latency <em>with</em> throughput, memory <em>against</em> maxmemory, lag <em>with</em> pending — because the combination is the diagnosis and either number alone is not. Alert at 75% rather than 100%, on counters <em>moving</em> rather than on their cumulative value, and delete any alert that has never corresponded to something a human had to do: a team trained to dismiss Redis pages will dismiss the one that mattered. And server-side metrics cannot see a stampede, a silently stale cache or a dead worker pool — those need your application's own counters, which is a few dozen lines and the difference between a two-minute incident and a two-hour one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Giám sát: bảng điều khiển và tám cảnh báo</h2>
<p class="lead">Một bảng điều khiển Redis với bốn mươi khung là một bảng điều khiển không ai đọc lúc có sự cố. Mười hai chỉ số phủ hết mọi thứ ở Bài 12.2, tám cảnh báo đáng gọi người dậy, và mọi thứ còn lại thuộc về một cái đồ thị bạn nhìn một cách có chủ ý chứ không phải một trang báo động cắt ngang bạn.</p>

<h3>Mười hai chỉ số</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bão hoà · <code>used_memory</code> / <code>maxmemory</code></span><span class="v">Tính theo phần trăm. Đây là con số dự báo tốt nhất mà Redis công bố: gần như mọi sự cố ở Chương 9 đều bắt đầu từ đây, và nó nhúc nhích hàng giờ trước khi có gì hỏng.</span></div>
  <div class="kv"><span class="k">Bão hoà · <code>connected_clients</code> / <code>maxclients</code></span><span class="v">Cũng theo phần trăm, và hãy nhìn <em>hình dáng</em> của nó: một đường chỉ có đi lên là một chỗ rò, không phải sự tăng trưởng (Bài 10.5).</span></div>
  <div class="kv"><span class="k">Độ trễ · p99 của <code>--latency</code>, hoặc <code>latency_percentiles</code> của exporter</span><span class="v">Dưới một mili giây trên một máy khoẻ. Đây là chỉ số bắt được một lệnh chặn trước khi có ai gửi phiếu báo lỗi (Bài 6.5).</span></div>
  <div class="kv"><span class="k">Thông lượng · <code>instantaneous_ops_per_sec</code></span><span class="v">Đặt cạnh độ trễ, vì <em>tổ hợp</em> mới là lời chẩn đoán: độ trễ lên mà thông lượng xuống là một lệnh chặn, cả hai cùng lên là tải thật (Bài 12.2).</span></div>
  <div class="kv"><span class="k">Lỗi · <code>rejected_connections</code>, <code>evicted_keys</code></span><span class="v">Hai bộ đếm đáng lẽ phải phẳng ở mức 0 trên một máy dữ liệu. Nhúc nhích chút nào cũng là một sự thật, không phải một lời cảnh báo.</span></div>
  <div class="kv"><span class="k">Sức khoẻ bộ đệm · <code>keyspace_hits</code> / <code>keyspace_misses</code></span><span class="v">Dưới dạng tốc độ chứ đừng dùng tổng cả đời, và nhớ rằng nó tính cho cả máy — số liệu theo từng bộ đệm chỉ tồn tại nếu ứng dụng của bạn tự đếm (Bài 6.5).</span></div>
  <div class="kv"><span class="k">Lưu lâu dài · <code>rdb_last_bgsave_status</code>, <code>aof_last_write_status</code></span><span class="v">Cả hai đều phải đọc ra <code>ok</code>. Một chữ <code>err</code> nghĩa là các lượt ghi sắp bắt đầu hỏng với <code>MISCONF</code> (Bài 9.3).</span></div>
  <div class="kv"><span class="k">Fork · <code>latest_fork_usec</code>, <code>rdb_last_cow_size</code></span><span class="v">Khoảng một mili giây mỗi gigabyte là bình thường. Vài chục mili giây mỗi gigabyte nghĩa là Transparent Huge Pages, và cái đồ thị này là cách bạn tìm ra nó (Bài 9.3).</span></div>
  <div class="kv"><span class="k">Nhân bản · <code>master_link_status</code>, độ chênh offset</span><span class="v">Chênh lệch byte giữa offset của bản chính và bản sao là độ trễ ở dạng trực tiếp nhất, và một đường liên kết đã <code>down</code> ba mươi giây là một bản sao đang phục vụ dữ liệu ngày một cũ (Bài 11.1).</span></div>
  <div class="kv"><span class="k">Worker · <code>blocked_clients</code></span><span class="v">Số bên tiêu thụ của bạn, nhìn thấy được. Bằng 0 trong khi đáng lẽ phải là 20 nghĩa là các worker đã chết, và chẳng thứ nào khác trong hệ giám sát của bạn nói ra điều đó (Bài 4.1).</span></div>
  <div class="kv"><span class="k">Hàng đợi · <code>lag</code> và <code>pending</code> của stream</span><span class="v">Lấy từ <code>XINFO GROUPS</code>. Lag tăng là đang tụt lại; pending tăng trong khi lag phẳng là các handler đang thất bại (Bài 8.3).</span></div>
  <div class="kv"><span class="k">Phân mảnh · <code>mem_fragmentation_ratio</code></span><span class="v">Đáng chú ý khi trên 1,5 và là tình huống khẩn cấp khi dưới 1,0, tức là đang tráo ra đĩa (Bài 9.1). Không đáng đặt cảnh báo; rất đáng vẽ đồ thị.</span></div>
</div>

<h3>Tám cảnh báo</h3>
<pre><code><span class="tok-comment"># Các luật Prometheus, kèm lý lẽ trong phần chú thích</span>
- alert: RedisMemoryHigh
  expr: redis_memory_used_bytes / redis_memory_max_bytes &gt; 0.75
  for: 10m
  annotations: { summary: "75% of maxmemory — act before OOM, not at it" }

- alert: RedisEvictingKeys
  expr: increase(redis_evicted_keys_total[10m]) &gt; 0
  annotations: { summary: "Keys are being deleted to make room" }

- alert: RedisConnectionsHigh
  expr: redis_connected_clients / redis_config_maxclients &gt; 0.5
  for: 15m
  annotations: { summary: "Half of maxclients — leak or genuine growth" }

- alert: RedisRejectingConnections
  expr: increase(redis_rejected_connections_total[5m]) &gt; 0
  annotations: { summary: "maxclients reached; clients cannot connect" }

- alert: RedisPersistenceFailing
  expr: redis_rdb_last_bgsave_status == 0 or redis_aof_last_write_status == 0
  annotations: { summary: "Saves failing — MISCONF and write errors next" }

- alert: RedisReplicationBroken
  expr: redis_master_link_up == 0
  for: 1m
  annotations: { summary: "Replica disconnected; failover material is stale" }

- alert: RedisLatencyHigh
  expr: redis_latency_percentiles_usec{quantile="0.99"} &gt; 10000
  for: 5m
  annotations: { summary: "p99 above 10ms — check SLOWLOG for a blocking command" }

- alert: RedisWorkersGone
  expr: redis_blocked_clients == 0
  for: 5m
  annotations: { summary: "No blocking consumers — the queue workers are dead" }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Hãy cảnh báo ở 75%, đừng ở 100%</span><span class="lz-t">và kèm một mệnh đề <code>for:</code></span><span class="lz-d">Một cảnh báo nổ khi bộ nhớ đã đầy thì chẳng cho bạn thời gian làm gì ngoài khởi động lại. 75% với cửa sổ mười phút cho bạn khoảng một tiếng trên phần lớn đường tăng trưởng, và mệnh đề <code>for:</code> ngăn một đợt vọt thoáng qua gọi ai đó dậy.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy cảnh báo khi bộ đếm <em>nhích lên</em>, đừng cảnh báo theo giá trị của nó</span><span class="lz-t">increase(x[10m]) &gt; 0</span><span class="lz-d"><code>evicted_keys</code> và <code>rejected_connections</code> là cộng dồn, nên một ngưỡng đặt trên con số thô sẽ nổ mãi mãi sau đúng một buổi chiều tồi tệ. Tốc độ tăng mới là tín hiệu.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy cảnh báo theo đạo hàm ở chỗ mà mức tuyệt đối vô nghĩa</span><span class="lz-t">tỉ lệ trượt tăng trong khi lưu lượng phẳng</span><span class="lz-d">Một tỉ lệ trượt bộ đệm 40% có thể hoàn toàn lành mạnh (Bài 6.5). Một tỉ lệ trượt <em>tăng</em> trong khi lượng yêu cầu thì không, luôn luôn là có chuyện: TTL bị rút ngắn, tập đang làm việc lớn lên, hay xuyên thủng.</span></div>
  <div class="lz-step"><span class="lz-k">Mọi cảnh báo đều gọi tên cuốn sổ tay của nó</span><span class="lz-t">tóm tắt, nguyên nhân, lệnh đầu tiên, đường leo thang</span><span class="lz-d">Một cảnh báo nói "Redis memory high" rồi thôi thì bắt người trực mất mười phút khám phá lại từ đầu. Hãy nối nó tới khối phân loại ở Bài 12.1 và tới đúng cái hình dáng ở Bài 12.2, và cũng cảnh báo ấy chỉ tốn hai phút.</span></div>
</div>

<h3>Những cảnh báo nên xoá đi</h3>
<pre><code><span class="tok-comment"># ❌ Những cái này gọi người dậy và dạy họ phớt lờ các lời gọi</span>
- alert: RedisHitRateLow              <span class="tok-comment"># một tỉ lệ không mang đơn vị (Bài 6.5)</span>
  expr: redis_keyspace_hits / (hits + misses) &lt; 0.9

- alert: RedisMemoryFragmentation     <span class="tok-comment"># vọt lên sau mỗi đợt xoá lớn</span>
  expr: redis_mem_fragmentation_ratio &gt; 1.5

- alert: RedisHighOps                 <span class="tok-comment"># thành công không phải một sự cố</span>
  expr: redis_instantaneous_ops_per_sec &gt; 50000

- alert: RedisKeyCountChanged         <span class="tok-comment"># khoá hết hạn là hệ thống đang chạy đúng</span>
  expr: delta(redis_db_keys[5m]) &lt; -1000</code></pre>
<div class="callout warn"><strong>Mỗi cái trong số đó đều nổ đều đặn trên một máy hoàn toàn khoẻ mạnh, và cái giá không phải là sự ồn ào — mà là cái thói quen.</strong> Một đội đã học được cách gạt đi các cảnh báo Redis mà không thèm đọc sẽ gạt luôn cái cảnh báo thật sự quan trọng, và sự cố sẽ chạy suốt một tiếng trước khi có người ngó tới. Tỉ lệ trúng không mang đơn vị và dễ gian lận tới mức tầm thường. Phân mảnh vọt lên chín mươi giây sau mỗi đợt xoá lớn. Thông lượng cao là dịch vụ của bạn đang thành công. Và số khoá tụt xuống hàng nghìn là phép hết hạn đang làm đúng việc của nó. Nếu một cảnh báo chưa từng một lần tương ứng với việc mà một con người cần làm thì xoá nó đi làm cho hệ thống an toàn hơn chứ không phải ít được giám sát hơn — hãy đặt bốn cái đó lên một bảng điều khiển, nơi chúng là bối cảnh hữu ích và chẳng cắt ngang ai.</div>

<h3>Cuốn sổ tay mà mọi cảnh báo phải trỏ tới</h3>
<pre><code><span class="tok-comment">## RedisMemoryHigh — used_memory &gt; 75% của maxmemory trong 10 phút</span>

1. Phân loại:   khối lệnh ở Bài 12.1 — dán trọn cả đầu ra
2. Tìm nó:      redis-cli --memkeys      (khoá lớn nhất theo byte)
                redis-cli INFO keyspace  (keys so với expires — độ phủ TTL)
3. Quyết định:
   - một khoá khổng lồ, không cần nữa   → UNLINK nó
   - một tiền tố không có TTL nào       → EXPIRE chúng, rồi sửa bên ghi
   - tăng trưởng thật                   → nâng maxmemory nếu cái máy còn
                                          RAM VÀ còn chỗ trống cho fork
   - không rõ                           → leo thang; ĐỪNG FLUSHALL
4. Sau đó:      vì sao nó không có TTL? hãy thêm cái ngưỡng cảnh báo mà
                bạn ước gì đã có, và ghi lại phát hiện đó</code></pre>

<div class="pitfall"><strong>Cái bẫy:</strong> giám sát Redis mà không giám sát việc ứng dụng của bạn làm gì với nó. Mọi chỉ số trong bài này đều ở phía máy chủ, và ba trong bảy hình dáng hỏng hóc ở Bài 12.2 đều hiện màu xanh trên tất cả chúng: một cú giẫm đạp (Redis nhàn rỗi, cơ sở dữ liệu đang cháy), một bộ đệm ôi âm thầm (chẳng có gì hỏng ở đâu cả), và một hàng đợi có worker đã chết (Redis khoẻ mạnh hoàn hảo, chẳng có gì được xử lý). Không cái nào nhìn thấy được từ <code>INFO</code>, và tất cả đều nhìn thấy được từ ứng dụng của bạn nếu bạn gắn đo đạc vào — bộ đếm trúng và trượt theo từng bộ đệm gắn nhãn theo tên, độ trễ của một lượt trượt, độ sâu hàng đợi và nhịp tim của bên tiêu thụ, cùng tuổi của mục chưa xác nhận cũ nhất. Chỗ đó chỉ vài chục dòng (Bài 6.5) và nó biến ba sự cố mất nhiều thời gian chẩn đoán nhất của bạn thành ba cái đồ thị hiển nhiên. Luật nằm bên dưới: <strong>chỉ số Redis nói cho bạn biết Redis có khoẻ không; chỉ có chỉ số của bạn mới nói cho bạn biết cách bạn dùng nó có khoẻ không.</strong></div>

<a class="link-card" href="https://github.com/oliver006/redis_exporter" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">redis_exporter</span><span class="lc-sub">Bộ xuất Prometheus mà ai cũng dùng: mọi trường <code>INFO</code> thành một chỉ số, tuỳ chọn thêm chỉ số theo từng khoá và từng stream, và một bảng điều khiển Grafana bạn nhập về làm điểm xuất phát.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Bộ theo dõi độ trễ</span><span class="lc-sub">Từng loại sự kiện được theo dõi nghĩa là gì và cách phơi nó ra — là nguồn của những con số độ trễ làm cho cái cảnh báo p99 ở trên có ý nghĩa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng cái bảng điều khiển</span><span class="lc-sub">Bài chấm điểm: chọn mười hai khung từ một danh sách bốn mươi rồi biện minh từng cái, viết bốn luật cảnh báo kèm ngưỡng và mệnh đề <code>for:</code>, xoá ba cảnh báo nhiễu kèm lý do, và viết cuốn sổ tay cho một trong số chúng.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Mười hai chỉ số phủ hết mọi hình dáng hỏng hóc trong chương này, và những cái hữu ích đi thành cặp — độ trễ <em>cùng với</em> thông lượng, bộ nhớ <em>đối chiếu</em> maxmemory, lag <em>cùng với</em> pending — vì tổ hợp mới là lời chẩn đoán còn từng con số đứng một mình thì không. Hãy cảnh báo ở 75% chứ đừng ở 100%, cảnh báo khi bộ đếm <em>nhích lên</em> chứ đừng theo giá trị cộng dồn của nó, và hãy xoá mọi cảnh báo chưa từng tương ứng với việc mà một con người phải làm: một đội được huấn luyện để gạt đi các lời gọi từ Redis sẽ gạt luôn cái quan trọng. Và các chỉ số phía máy chủ không nhìn thấy được một cú giẫm đạp, một bộ đệm ôi âm thầm hay một dàn worker đã chết — những cái đó cần bộ đếm của chính ứng dụng bạn, chỉ vài chục dòng và là khác biệt giữa một sự cố hai phút với một sự cố hai tiếng.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What you know now, and where to go next|||12.5 — Bạn đã biết những gì, và đi tiếp về đâu',
      slug: 'rd-12-5-ket-khoa',
      type: 'LESSON',
      description: 'Bản đồ toàn khoá học, mười luật sống sót qua mọi thứ, một dự án tổng kết dùng tám trong mười hai chương, chuyện giấy phép Redis với Valkey nói thẳng, và đọc gì tiếp theo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What you know now, and where to go next</h2>
<p class="lead">Seventy lessons ago this course opened with a claim: that Redis is simple to start with and unforgiving afterwards, and that the gap between those two is almost entirely made of things nobody tells you. Here is what closed that gap, condensed into the shape it takes in your head.</p>

<h3>The map</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">the model</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One thread, one command at a time</span><span class="lz-nsub">Chapters 0–1. Every latency problem in this course is a consequence of this one fact, and so is every atomicity guarantee.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Keys, TTL and expiration</span><span class="lz-nsub">Chapter 2. A key without a TTL is a key that lives forever; lazy plus active expiry is why memory does not fall the instant something expires.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">the data structures</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Strings, bitmaps, HyperLogLog</span><span class="lz-nsub">Chapter 3. Counters, rate limits, and 12 KB that counts ten million uniques.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Lists, sets, sorted sets, hashes</span><span class="lz-nsub">Chapters 4–5. Choose by the question you will ask; encodings decide memory; <code>HEXPIRE</code> finally gave fields their own lifetimes.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">the patterns</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Caching, correctly</span><span class="lz-nsub">Chapter 6. Invalidation, stampedes, consistency with a database, and measuring whether it helps at all.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Atomicity and messaging</span><span class="lz-nsub">Chapters 7–8. MULTI is a queue, Lua is a critical section, locks are leases, and Streams are the queue that remembers.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">running it</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Memory, durability, security</span><span class="lz-nsub">Chapters 9–10. Eviction policies, RDB and AOF, ACLs, and the network exposure that made Redis famous for the wrong reason.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Scaling and diagnosing</span><span class="lz-nsub">Chapters 11–12. Replication is not high availability, Cluster answers one question, and every incident has a numeric signature.</span></div></div>
  </div>
</div>

<h3>Ten rules that survive everything</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Every key gets a TTL, or a reason why not</span><span class="v">Written down. Unbounded keys are the root of most memory incidents (Lessons 2.2, 9.2).</span></div>
  <div class="kv"><span class="k">2 · No O(N) command on a collection that can grow</span><span class="v"><code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>. One thread, remember (Lessons 1.1, 2.3).</span></div>
  <div class="kv"><span class="k">3 · Choose the structure by the question</span><span class="v">Membership → set. Order or range → sorted set. Duplicates → list. Fields → hash. Acknowledgement → stream (Lesson 4.5).</span></div>
  <div class="kv"><span class="k">4 · Delete to invalidate; write the database first</span><span class="v">Deleting is idempotent, writing values races, and the TTL is the backstop under both (Lessons 6.2, 6.4).</span></div>
  <div class="kv"><span class="k">5 · Jitter every TTL</span><span class="v">One line, and it prevents the entire synchronised-expiry class of stampede (Lesson 6.3).</span></div>
  <div class="kv"><span class="k">6 · Locks for efficiency; idempotency for correctness</span><span class="v">A timeout-based lock is a lease, and a paused process does not notice time passing (Lessons 7.5, 8.3).</span></div>
  <div class="kv"><span class="k">7 · Bound every collection at write time</span><span class="v"><code>LTRIM</code>, <code>ZREMRANGEBYRANK</code>, <code>XADD MAXLEN ~</code>, <code>EXPIRE</code>. Never on a cron (Lessons 4.1, 4.4, 8.2).</span></div>
  <div class="kv"><span class="k">8 · maxmemory at 60–70% of machine RAM</span><span class="v">Because the fork needs the rest, and the OOM killer takes the parent (Lessons 9.1, 9.3).</span></div>
  <div class="kv"><span class="k">9 · Never reachable without authentication</span><span class="v">Even on a network you are sure is private, because the network assumption is what changes (Lessons 10.2, 10.3).</span></div>
  <div class="kv"><span class="k">10 · Measure before you scale</span><span class="v">One instance does ~120k ops/s and most services use a few percent of it (Lesson 11.5).</span></div>
</div>

<h3>The capstone: build one thing that uses eight chapters</h3>
<pre><code><span class="tok-comment"># A URL shortener with analytics — small enough to finish, wide enough to matter</span>

1. Shorten      SET url:&lt;code&gt; &lt;target&gt; NX              <span class="tok-comment"># Ch 3: atomic, no collisions</span>
                INCR counter:codes                        <span class="tok-comment"># Ch 3: base62 the counter</span>

2. Redirect     GET url:&lt;code&gt;                            <span class="tok-comment"># Ch 6: cache-aside over Postgres</span>
                PFADD uv:&lt;code&gt;:&lt;date&gt; &lt;visitorId&gt;        <span class="tok-comment"># Ch 3: uniques in 12KB</span>
                HINCRBY stats:&lt;date&gt; clicks 1             <span class="tok-comment"># Ch 5: bounded dimensions</span>
                XADD events '*' code &lt;code&gt; ref &lt;referrer&gt; MAXLEN '~' 100000

3. Rate limit   EVAL &lt;token-bucket&gt; 1 rl:&lt;ip&gt; …          <span class="tok-comment"># Ch 7: Lua, atomic</span>

4. Dashboard    ZINCRBY top:&lt;date&gt; 1 &lt;code&gt;               <span class="tok-comment"># Ch 4: leaderboard</span>
                ZRANGE top:&lt;date&gt; 0 9 REV WITHSCORES
                ZREMRANGEBYRANK top:&lt;date&gt; 0 -1001        <span class="tok-comment"># Ch 4: bounded</span>

5. Worker       XREADGROUP GROUP agg w1 … STREAMS events '&gt;'  <span class="tok-comment"># Ch 8: consumer group</span>
                XACK after success · XAUTOCLAIM sweeper       <span class="tok-comment"># Ch 8: recovery</span>

6. Operate      ACL user per service · maxmemory + policy     <span class="tok-comment"># Ch 9, 10</span>
                appendonly yes · a replica for backups        <span class="tok-comment"># Ch 9, 11</span>
                the twelve metrics and eight alerts           <span class="tok-comment"># Ch 12</span></code></pre>
<div class="callout ok"><strong>Build it, then break it on purpose.</strong> Fill it until <code>maxmemory</code> is reached and watch which policy does what. Kill a worker mid-batch and confirm the sweeper reclaims its entries. Expire the hot cache key with fifty concurrent clients and watch the stampede, then fix it three different ways and measure each. Point <code>SENTINEL failover</code> at it and see whether your client follows. Every one of those takes ten minutes and teaches more than re-reading the chapter — and doing it on something you built, in a place where nothing is at stake, is the whole reason to build a capstone rather than read one.</div>

<h3>Redis, Valkey, and what to check before you choose</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The licence changed in 2024</span><span class="lz-lnote">Redis moved from the BSD licence to a source-available model, which prompted a fork: <strong>Valkey</strong>, hosted by the Linux Foundation and backed by several large cloud providers. Redis later added an open-source option again in Redis 8. The situation has moved more than once — check the current terms yourself rather than trusting any summary, including this one.</span></div>
  <div class="lz-layer"><span class="lz-lname">Everything in this course applies to both</span><span class="lz-lnote">Valkey forked from Redis 7.2, so every data structure, command, configuration directive and failure mode you have learned is the same on both. The divergence so far is in extensions and performance work, not in the fundamentals. Your knowledge is portable.</span></div>
  <div class="lz-layer"><span class="lz-lname">What to actually check</span><span class="lz-lnote">Which one your managed provider runs and at what version; whether the licence matters for how you ship (it usually does not for a service you operate, and it can for something you redistribute); and which features you depend on that arrived after 7.2 — <code>HEXPIRE</code> is 7.4, so it is the obvious one to verify (Lesson 5.4).</span></div>
</div>

<h3>Where to go next</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read the annotated <code>redis.conf</code></span><span class="v">End to end, once. It is genuinely well written and it is the fastest remaining way to discover things Redis can do that you did not know to ask about.</span></div>
  <div class="kv"><span class="k">Read the Cluster specification</span><span class="v">Not the tutorial — the spec. It is the clearest writing about distributed systems trade-offs in any database's documentation, and it states plainly when Cluster can lose writes.</span></div>
  <div class="kv"><span class="k">Read the source of one command</span><span class="v"><code>t_string.c</code> or <code>expire.c</code> in the Redis repository. The codebase is famously readable C, and seeing <code>setGenericCommand</code> makes everything in Chapter 3 concrete.</span></div>
  <div class="kv"><span class="k">Follow Redis's own docs on modules</span><span class="v">RedisJSON, RediSearch, RedisTimeSeries and the probabilistic types are a different Redis with a different operational story — worth knowing they exist before you build them by hand.</span></div>
  <div class="kv"><span class="k">Then go and operate one</span><span class="v">Nothing in this course substitutes for owning an instance through a growth curve, an incident and a version upgrade. The lessons stick when they cost you an evening.</span></div>
</div>

<div class="pitfall"><strong>Trap:</strong> treating Redis as &quot;a cache&quot; and stopping there. This course spent most of its time on the things that are not caching — distributed locks, rate limits, queues, streams, pub/sub — and every one of them has a failure mode a cache does not. A cache that loses data gets slower; a distributed lock that loses data lets two processes into the critical section. If you leave this course with only &quot;Redis is fast because it is in RAM&quot;, you have skipped the part the ten rules above are about: what is durable, what replicates, and what fails silently. Before using Redis for anything where losing data means losing money, re-read the durability section — it is not what people assume.</div>
<a class="link-card" href="https://redis.io/docs/latest/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">The Redis documentation</span><span class="lc-sub">Unusually good for a database: the command reference, the data-type guides, the operations section and the reference specs. Almost every link in this course points into it.</span></span>
</a>
<a class="link-card" href="https://github.com/redis/redis" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">The Redis source</span><span class="lc-sub">Readable C, well commented, and small enough to explore. Start with <code>t_hash.c</code>, <code>expire.c</code> or <code>evict.c</code> — each one makes a chapter of this course concrete.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">The capstone, graded</span><span class="lc-sub">Build the URL shortener end to end: the atomic short-code, the cache-aside redirect, the Lua rate limiter, the leaderboard, the consumer group with a sweeper, and the operational configuration. Every chapter, one project.</span></span>
</a>

<p class="note-ct"><strong>Three things to take with you.</strong> Almost everything in this course follows from one fact — one thread, one command at a time — so when something is slow, ask what is blocking rather than what is misconfigured. Redis will do exactly what you ask, including the destructive things: there are no constraints, no rollback and no schema, so the correctness lives in your design, and every guardrail in these seventy lessons is one you have to place yourself. And the ten rules above are worth more than the command reference: bound every collection, TTL every key, choose the structure by the question, and measure before you scale.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Bạn đã biết những gì, và đi tiếp về đâu</h2>
<p class="lead">Bảy mươi bài trước, khoá học này mở đầu bằng một khẳng định: rằng Redis dễ bắt đầu và không khoan nhượng về sau, và khoảng cách giữa hai điều đó gần như hoàn toàn làm bằng những thứ chẳng ai nói cho bạn. Đây là thứ đã lấp cái khoảng cách ấy, cô đọng lại theo đúng hình dáng nó nằm trong đầu bạn.</p>

<h3>Tấm bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">mô hình</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một luồng, mỗi lúc một lệnh</span><span class="lz-nsub">Chương 0–1. Mọi vấn đề độ trễ trong khoá này đều là hệ quả của đúng sự thật đó, và mọi bảo đảm nguyên tử cũng vậy.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Khoá, TTL và hết hạn</span><span class="lz-nsub">Chương 2. Một khoá không có TTL là một khoá sống mãi mãi; hết hạn lười cộng chủ động là lý do bộ nhớ không tụt xuống ngay khoảnh khắc thứ gì đó hết hạn.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">các cấu trúc dữ liệu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chuỗi, bitmap, HyperLogLog</span><span class="lz-nsub">Chương 3. Bộ đếm, giới hạn tần suất, và 12 KB đếm được mười triệu giá trị duy nhất.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">List, set, sorted set, hash</span><span class="lz-nsub">Chương 4–5. Chọn theo câu hỏi bạn sẽ hỏi; kiểu mã hoá quyết định bộ nhớ; <code>HEXPIRE</code> cuối cùng cũng cho từng trường tuổi thọ riêng.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">các khuôn mẫu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Làm bộ đệm cho đúng</span><span class="lz-nsub">Chương 6. Đẩy khoá cũ, giẫm đạp, nhất quán với cơ sở dữ liệu, và đo xem nó có giúp gì không đã.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tính nguyên tử và nhắn tin</span><span class="lz-nsub">Chương 7–8. MULTI là một hàng đợi, Lua là một vùng tới hạn, khoá là hợp đồng thuê, và Stream là hàng đợi biết nhớ.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">vận hành nó</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bộ nhớ, độ bền, bảo mật</span><span class="lz-nsub">Chương 9–10. Chính sách đẩy khoá, RDB và AOF, ACL, và cái mức phơi ra mạng làm Redis nổi tiếng vì lý do sai.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mở rộng và chẩn đoán</span><span class="lz-nsub">Chương 11–12. Nhân bản không phải sẵn sàng cao, Cluster trả lời đúng một câu hỏi, và mọi sự cố đều có chữ ký số liệu.</span></div></div>
  </div>
</div>

<h3>Mười luật sống sót qua mọi thứ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Mọi khoá đều có TTL, hoặc có lý do vì sao không</span><span class="v">Ghi ra giấy. Khoá không có trần là gốc rễ của phần lớn sự cố bộ nhớ (Bài 2.2, 9.2).</span></div>
  <div class="kv"><span class="k">2 · Không chạy lệnh O(N) lên một tập hợp có thể lớn lên</span><span class="v"><code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>. Một luồng, nhớ chứ (Bài 1.1, 2.3).</span></div>
  <div class="kv"><span class="k">3 · Chọn cấu trúc theo câu hỏi</span><span class="v">Kiểm tra thành viên → set. Thứ tự hay khoảng → sorted set. Cần trùng → list. Trường → hash. Cần xác nhận → stream (Bài 4.5).</span></div>
  <div class="kv"><span class="k">4 · Xoá để vô hiệu hoá; ghi cơ sở dữ liệu trước</span><span class="v">Xoá thì gọi bao nhiêu lần cũng ra một kết quả, ghi giá trị thì có đua, và TTL là lưới đỡ dưới cả hai (Bài 6.2, 6.4).</span></div>
  <div class="kv"><span class="k">5 · Rắc nhiễu vào mọi TTL</span><span class="v">Một dòng, và nó ngăn được trọn cả họ giẫm đạp do hết-hạn-đồng-loạt (Bài 6.3).</span></div>
  <div class="kv"><span class="k">6 · Khoá là để hiệu quả; lặp-lại-vô-hại là để đúng đắn</span><span class="v">Một cái khoá dựa trên hạn giờ là một hợp đồng thuê, và một tiến trình bị tạm dừng không nhận ra thời gian trôi (Bài 7.5, 8.3).</span></div>
  <div class="kv"><span class="k">7 · Chặn trần mọi tập hợp ngay lúc ghi</span><span class="v"><code>LTRIM</code>, <code>ZREMRANGEBYRANK</code>, <code>XADD MAXLEN ~</code>, <code>EXPIRE</code>. Đừng bao giờ bằng cron (Bài 4.1, 4.4, 8.2).</span></div>
  <div class="kv"><span class="k">8 · maxmemory ở mức 60–70% RAM của máy</span><span class="v">Vì cú fork cần phần còn lại, và kẻ giết-vì-hết-bộ-nhớ lấy mạng tiến trình cha (Bài 9.1, 9.3).</span></div>
  <div class="kv"><span class="k">9 · Đừng bao giờ với tới được mà không cần xác thực</span><span class="v">Ngay cả trên một mạng bạn chắc chắn là riêng tư, vì chính cái giả định về mạng mới là thứ thay đổi (Bài 10.2, 10.3).</span></div>
  <div class="kv"><span class="k">10 · Hãy đo trước khi mở rộng</span><span class="v">Một máy làm được ~120k phép/giây và phần lớn dịch vụ dùng vài phần trăm chỗ đó (Bài 11.5).</span></div>
</div>

<h3>Dự án tổng kết: dựng một thứ dùng tám chương</h3>
<pre><code><span class="tok-comment"># Một dịch vụ rút gọn URL kèm phân tích — đủ nhỏ để làm xong, đủ rộng để đáng làm</span>

1. Rút gọn     SET url:&lt;code&gt; &lt;target&gt; NX              <span class="tok-comment"># Ch 3: nguyên tử, không đụng nhau</span>
               INCR counter:codes                        <span class="tok-comment"># Ch 3: chuyển bộ đếm sang base62</span>

2. Chuyển hướng GET url:&lt;code&gt;                           <span class="tok-comment"># Ch 6: cache-aside trên Postgres</span>
               PFADD uv:&lt;code&gt;:&lt;date&gt; &lt;visitorId&gt;        <span class="tok-comment"># Ch 3: duy nhất trong 12KB</span>
               HINCRBY stats:&lt;date&gt; clicks 1             <span class="tok-comment"># Ch 5: chiều có trần</span>
               XADD events '*' code &lt;code&gt; ref &lt;referrer&gt; MAXLEN '~' 100000

3. Giới hạn    EVAL &lt;token-bucket&gt; 1 rl:&lt;ip&gt; …          <span class="tok-comment"># Ch 7: Lua, nguyên tử</span>

4. Bảng điều khiển ZINCRBY top:&lt;date&gt; 1 &lt;code&gt;           <span class="tok-comment"># Ch 4: bảng xếp hạng</span>
               ZRANGE top:&lt;date&gt; 0 9 REV WITHSCORES
               ZREMRANGEBYRANK top:&lt;date&gt; 0 -1001        <span class="tok-comment"># Ch 4: có trần</span>

5. Worker      XREADGROUP GROUP agg w1 … STREAMS events '&gt;'  <span class="tok-comment"># Ch 8: nhóm tiêu thụ</span>
               XACK sau khi thành công · tiến trình quét XAUTOCLAIM   <span class="tok-comment"># Ch 8</span>

6. Vận hành    mỗi dịch vụ một người dùng ACL · maxmemory + chính sách  <span class="tok-comment"># Ch 9, 10</span>
               appendonly yes · một bản sao để sao lưu                  <span class="tok-comment"># Ch 9, 11</span>
               mười hai chỉ số và tám cảnh báo                          <span class="tok-comment"># Ch 12</span></code></pre>
<div class="callout ok"><strong>Hãy dựng nó, rồi cố ý làm nó hỏng.</strong> Nhồi nó tới khi chạm <code>maxmemory</code> rồi xem chính sách nào làm gì. Giết một worker giữa lô rồi xác nhận tiến trình quét đòi lại các mục của nó. Cho khoá bộ đệm nóng hết hạn với năm mươi khách đồng thời rồi xem cú giẫm đạp, sau đó chữa nó theo ba cách khác nhau và đo từng cách. Trỏ <code>SENTINEL failover</code> vào nó rồi xem thư viện khách của bạn có bám theo không. Mỗi việc trong số đó mất mười phút và dạy nhiều hơn việc đọc lại chương sách — và làm nó trên một thứ do chính bạn dựng, ở một nơi chẳng có gì để mất, chính là toàn bộ lý do để dựng một dự án tổng kết thay vì đọc một cái.</div>

<h3>Redis, Valkey, và những gì cần kiểm trước khi chọn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Giấy phép đã đổi vào năm 2024</span><span class="lz-lnote">Redis chuyển từ giấy phép BSD sang một mô hình mở-nguồn-có-điều-kiện, và điều đó dẫn tới một nhánh rẽ: <strong>Valkey</strong>, do Linux Foundation bảo trợ và được vài nhà cung cấp đám mây lớn hậu thuẫn. Sau đó Redis lại thêm một lựa chọn mã nguồn mở ở bản Redis 8. Tình hình đã dịch chuyển hơn một lần — hãy tự kiểm các điều khoản hiện hành thay vì tin bất kỳ bản tóm tắt nào, kể cả bản này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mọi thứ trong khoá học này áp cho cả hai</span><span class="lz-lnote">Valkey rẽ nhánh từ Redis 7.2, nên mọi cấu trúc dữ liệu, mọi lệnh, mọi chỉ thị cấu hình và mọi kiểu hỏng bạn đã học đều giống nhau ở cả hai. Chỗ phân kỳ cho tới nay nằm ở các phần mở rộng và công việc tối ưu hiệu năng, không nằm ở phần nền tảng. Kiến thức của bạn mang đi được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ thật sự cần kiểm</span><span class="lz-lnote">Nhà cung cấp có quản lý của bạn chạy cái nào và ở phiên bản nào; giấy phép có quan trọng với cách bạn phát hành hay không (thường là không quan trọng với một dịch vụ do bạn vận hành, và có thể quan trọng với thứ bạn phân phối lại); và bạn đang phụ thuộc vào tính năng nào xuất hiện sau bản 7.2 — <code>HEXPIRE</code> là của bản 7.4, nên đó là cái hiển nhiên cần xác minh (Bài 5.4).</span></div>
</div>

<h3>Đi tiếp về đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy đọc tệp <code>redis.conf</code> có chú giải</span><span class="v">Từ đầu tới cuối, một lần. Nó thật sự được viết hay và là cách nhanh nhất còn lại để khám phá những thứ Redis làm được mà bạn chưa biết để mà hỏi.</span></div>
  <div class="kv"><span class="k">Hãy đọc bản đặc tả Cluster</span><span class="v">Không phải bài hướng dẫn — mà là bản đặc tả. Đó là đoạn viết rõ ràng nhất về các đánh đổi trong hệ phân tán trong tài liệu của bất kỳ cơ sở dữ liệu nào, và nó nói thẳng khi nào Cluster làm mất lượt ghi.</span></div>
  <div class="kv"><span class="k">Hãy đọc mã nguồn của một cái lệnh</span><span class="v"><code>t_string.c</code> hay <code>expire.c</code> trong kho mã Redis. Nền mã này nổi tiếng là C dễ đọc, và nhìn thấy <code>setGenericCommand</code> làm cho mọi thứ ở Chương 3 trở nên cụ thể.</span></div>
  <div class="kv"><span class="k">Hãy theo tài liệu của chính Redis về module</span><span class="v">RedisJSON, RediSearch, RedisTimeSeries và các kiểu xác suất là một Redis khác với một câu chuyện vận hành khác — đáng biết là chúng tồn tại trước khi bạn tự dựng lại chúng bằng tay.</span></div>
  <div class="kv"><span class="k">Rồi hãy đi vận hành một cái</span><span class="v">Không gì trong khoá học này thay thế được việc sở hữu một cái máy đi qua một đường tăng trưởng, một sự cố và một lần nâng phiên bản. Các bài học ngấm vào người khi chúng lấy của bạn một buổi tối.</span></div>
</div>

<div class="pitfall"><strong>Bẫy:</strong> coi Redis là &quot;một cái cache&quot; và dừng lại ở đó. Khoá này dành phần lớn thời gian cho những thứ KHÔNG phải cache — khoá phân tán, giới hạn tần suất, hàng đợi, luồng, pub/sub — và mỗi cái trong số đó có một chế độ hỏng riêng mà một bộ nhớ đệm không có. Một cache mất dữ liệu thì chậm đi; một khoá phân tán mất dữ liệu thì hai tiến trình cùng vào vùng tới hạn. Nếu bạn rời khoá này với đúng một câu &quot;Redis nhanh vì nó nằm trong RAM&quot; thì bạn đã bỏ lỡ phần mà mười luật ở trên nói tới: cái gì bền vững, cái gì tự nhân bản, cái gì im lặng khi hỏng. Trước khi dùng Redis cho một thứ mà mất dữ liệu là mất tiền, hãy kiểm lại mục về độ bền — nó không phải cái bạn đoán.</div>
<a class="link-card" href="https://redis.io/docs/latest/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Redis</span><span class="lc-sub">Tốt một cách bất thường so với một cơ sở dữ liệu: tài liệu tra cứu lệnh, các hướng dẫn theo kiểu dữ liệu, mục vận hành và các bản đặc tả. Gần như mọi liên kết trong khoá này đều trỏ vào đó.</span></span>
</a>
<a class="link-card" href="https://github.com/redis/redis" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Mã nguồn Redis</span><span class="lc-sub">C dễ đọc, chú thích tử tế, và đủ nhỏ để khám phá. Hãy bắt đầu với <code>t_hash.c</code>, <code>expire.c</code> hay <code>evict.c</code> — mỗi cái làm cho một chương của khoá này trở nên cụ thể.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">Dự án tổng kết, có chấm điểm</span><span class="lc-sub">Dựng dịch vụ rút gọn URL từ đầu tới cuối: mã ngắn nguyên tử, lượt chuyển hướng cache-aside, bộ giới hạn tần suất bằng Lua, bảng xếp hạng, nhóm tiêu thụ kèm tiến trình quét, và phần cấu hình vận hành. Mọi chương, một dự án.</span></span>
</a>

<p class="note-ct"><strong>Ba điều mang theo.</strong> Gần như mọi thứ trong khoá học này đều suy ra từ một sự thật — một luồng, mỗi lúc một lệnh — nên khi có thứ gì chậm thì hãy hỏi cái gì đang chặn chứ đừng hỏi cái gì đang cấu hình sai. Redis sẽ làm đúng cái bạn bảo, kể cả những thứ có sức phá huỷ: không có ràng buộc, không có quay lui và không có lược đồ, nên tính đúng đắn sống trong thiết kế của bạn, và mọi thanh chắn trong bảy mươi bài này là thanh chắn bạn phải tự đặt lấy. Và mười cái luật ở trên đáng giá hơn cả cuốn tra cứu lệnh: chặn trần mọi tập hợp, cho mọi khoá một TTL, chọn cấu trúc theo câu hỏi, và đo trước khi mở rộng.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Final exam: the whole course|||12.6 — Bài kiểm cuối: toàn bộ khoá học',
      slug: 'rd-12-6-quiz-cuoi',
      type: 'QUIZ',
      description: 'Mười hai câu trải khắp mười ba mục, mỗi câu về một điều mà nếu hiểu sai sẽ gây ra một sự cố thật. Đây là bài kiểm cuối của khoá Redis.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final exam</span>
<h2>Twelve questions, thirteen sections</h2>
<p class="lead">One question per major idea, drawn from every chapter. Each of these corresponds to a real production incident that this course exists to prevent — so a wrong answer here is worth more than a right one, because it tells you exactly which lesson to reread.</p>
<div class="callout ok">Eighteen minutes. Aim for 10/12. Anything you get wrong names the chapter to go back to, and the answers point at the specific lesson.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài kiểm cuối</span>
<h2>Mười hai câu, mười ba mục</h2>
<p class="lead">Mỗi ý lớn một câu, rút từ mọi chương. Mỗi câu ở đây tương ứng với một sự cố production có thật mà khoá học này sinh ra để ngăn — nên một câu sai ở đây đáng giá hơn một câu đúng, vì nó nói chính xác cho bạn biết phải đọc lại bài nào.</p>
<div class="callout ok">Mười tám phút. Nhắm 10/12. Bất cứ câu nào bạn sai đều gọi tên cái chương cần quay lại, và phần đáp án chỉ thẳng tới bài cụ thể.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'Redis is single-threaded for command execution. What is the most important consequence for how you write code against it?|||Redis thực thi lệnh bằng một luồng đơn. Hệ quả quan trọng nhất với cách bạn viết mã cho nó là gì?',
            options: [
              'You must serialise your own writes in the application to avoid races|||Bạn phải tự tuần tự hoá các lượt ghi trong ứng dụng để tránh đua',
              'Throughput is capped at a few thousand operations per second|||Thông lượng bị chặn ở mức vài nghìn phép mỗi giây',
              'Every command is atomic for free, and any single slow command blocks every other client for its whole duration|||Mọi lệnh đều nguyên tử miễn phí, và bất kỳ một lệnh chậm nào cũng chặn mọi khách khác suốt thời gian nó chạy',
              'Commands from one connection may be reordered relative to another connection|||Lệnh từ một kết nối có thể bị xếp lại thứ tự so với một kết nối khác',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You SET a key with EX 60 and then SET it again with no EX. What is its TTL afterwards?|||Bạn SET một khoá với EX 60 rồi SET lại nó mà không kèm EX. Sau đó TTL của nó là bao nhiêu?',
            options: [
              'None — a plain SET replaces the value AND clears the TTL, which is how keys meant to expire quietly become permanent|||Không có — một lệnh SET thường thay giá trị VÀ xoá luôn TTL, đó là cách những khoá lẽ ra phải hết hạn lặng lẽ trở thành vĩnh viễn',
              'The original 60 seconds, because SET only replaces the value|||Vẫn 60 giây ban đầu, vì SET chỉ thay giá trị',
              'Whatever remained of the 60 seconds at the moment of the second SET|||Phần còn lại của 60 giây tại khoảnh khắc lệnh SET thứ hai',
              'An error, because SET without KEEPTTL is rejected on a volatile key|||Một lỗi, vì SET không kèm KEEPTTL bị từ chối trên một khoá có hạn dùng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need to count unique visitors per day across ten million users, and you will never need the individual IDs back. What should you use?|||Bạn cần đếm số khách duy nhất mỗi ngày trên mười triệu người dùng, và sẽ không bao giờ cần lấy lại từng mã. Bạn nên dùng gì?',
            options: [
              'A set, since SCARD is O(1) and gives an exact answer|||Một set, vì SCARD là O(1) và cho câu trả lời chính xác',
              'A sorted set scored by timestamp, so you can also query by time|||Một sorted set chấm điểm theo mốc thời gian, để còn truy vấn được theo thời gian',
              'A hash with one field per user, which is cheaper than a set|||Một hash với mỗi người dùng một trường, rẻ hơn một set',
              'A HyperLogLog: about 12 KB regardless of cardinality with 0.81% error, versus hundreds of megabytes for an exact set|||Một HyperLogLog: khoảng 12 KB bất kể lực lượng với sai số 0,81%, so với hàng trăm megabyte cho một set chính xác',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'You need "the top 20 players", "what rank is this player" and "everything scored in the last hour" from the same data. Which structure?|||Bạn cần "20 người chơi dẫn đầu", "người chơi này hạng mấy" và "mọi thứ được chấm điểm trong một giờ qua" từ cùng một mớ dữ liệu. Cấu trúc nào?',
            options: [
              'A list, keeping it sorted on every insert with LINSERT|||Một list, giữ nó luôn được sắp bằng LINSERT ở mỗi lần chèn',
              'A sorted set: rank, range and top-N are all O(log N) on one structure, and score = timestamp makes the time window a range query|||Một sorted set: hạng, khoảng và top-N đều là O(log N) trên một cấu trúc duy nhất, và điểm = mốc thời gian biến cửa sổ thời gian thành một truy vấn khoảng',
              'A set plus a separate hash mapping members to scores|||Một set cộng một hash riêng ánh xạ phần tử sang điểm',
              'A stream, since entries are already ordered by time|||Một stream, vì các mục vốn đã được sắp theo thời gian',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A hash has 130 fields and OBJECT ENCODING says hashtable. You delete 100 fields. What happens to its memory?|||Một hash có 130 trường và OBJECT ENCODING báo hashtable. Bạn xoá 100 trường. Bộ nhớ của nó ra sao?',
            options: [
              'It converts back to listpack immediately, freeing most of the overhead|||Nó chuyển ngay về listpack, giải phóng phần lớn chi phí phụ',
              'It converts back after the next background rehash|||Nó chuyển về sau lần băm lại chạy nền tiếp theo',
              'The fields are freed but the encoding is irrelevant to memory usage|||Các trường được giải phóng nhưng kiểu mã hoá chẳng liên quan gì tới mức dùng bộ nhớ',
              'It stays a hashtable forever — the conversion is one-way, so it keeps paying 60–100 bytes of overhead per field|||Nó là hashtable mãi mãi — việc chuyển kiểu là một chiều, nên nó tiếp tục trả 60–100 byte chi phí phụ cho mỗi trường',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'On a write, which ordering is correct for cache invalidation, and why?|||Khi có lượt ghi, thứ tự nào đúng cho việc vô hiệu hoá bộ đệm, và vì sao?',
            options: [
              'Write the database, then DELETE the cache key — deleting is idempotent so concurrent writers cannot order themselves wrongly, and the TTL is the backstop if the delete never runs|||Ghi cơ sở dữ liệu, rồi XOÁ khoá bộ đệm — xoá thì gọi bao nhiêu lần cũng ra một kết quả nên các bên ghi đồng thời không thể tự xếp sai thứ tự, và TTL là lưới đỡ nếu lệnh xoá không bao giờ chạy',
              'Delete the cache key first, then write the database, so no stale value can be served|||Xoá khoá bộ đệm trước, rồi mới ghi cơ sở dữ liệu, để không giá trị ôi nào được phục vụ',
              'Write the database, then write the new value into the cache, avoiding a miss|||Ghi cơ sở dữ liệu, rồi ghi giá trị mới vào bộ đệm, tránh được một lần trượt',
              'Write both inside a MULTI so they are atomic together|||Ghi cả hai bên trong một MULTI để chúng nguyên tử cùng nhau',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'One hot cache key expires and 200 concurrent requests all query the database. Which fix addresses THIS problem?|||Một khoá bộ đệm nóng hết hạn và 200 yêu cầu đồng thời cùng truy vấn cơ sở dữ liệu. Cách chữa nào giải quyết ĐÚNG vấn đề này?',
            options: [
              'TTL jitter, which spreads the expiry across a window|||Rắc nhiễu TTL, trải cái hạn ra trên một cửa sổ',
              'A shorter TTL, so less data is lost per expiry|||TTL ngắn hơn, để mỗi lần hết hạn mất ít dữ liệu hơn',
              'Single-flight: a SET NX EX lock so one caller recomputes while the others wait briefly or serve stale — jitter fixes synchronised expiry of MANY keys, not concurrent misses on ONE|||Một-lượt-duy-nhất: một cái khoá SET NX EX để một bên gọi tính lại trong khi những bên khác chờ chút hoặc phục vụ đồ ôi — rắc nhiễu chữa việc NHIỀU khoá hết hạn đồng loạt, không chữa việc trượt đồng thời trên MỘT khoá',
              'Switching maxmemory-policy to allkeys-lfu so the hot key is never evicted|||Đổi maxmemory-policy sang allkeys-lfu để khoá nóng không bao giờ bị đẩy đi',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Inside a MULTI block, the second of four commands fails with WRONGTYPE. What is the state of the data afterwards?|||Trong một khối MULTI, lệnh thứ hai trên bốn hỏng với lỗi WRONGTYPE. Sau đó trạng thái dữ liệu ra sao?',
            options: [
              'Nothing was applied — EXEC detected the error and discarded the block|||Không gì được áp dụng — EXEC phát hiện lỗi và vứt cả khối đi',
              'Commands 1, 3 and 4 were applied and command 2 failed: Redis has no rollback, so you get a partial result you must find by checking every element of the reply array|||Lệnh 1, 3 và 4 được áp dụng còn lệnh 2 hỏng: Redis không có quay lui, nên bạn nhận một kết quả nửa vời phải tự tìm bằng cách kiểm mọi phần tử của mảng trả về',
              'Only command 1 was applied; execution stops at the first error|||Chỉ lệnh 1 được áp dụng; việc thực thi dừng ở lỗi đầu tiên',
              'The connection is closed to prevent an inconsistent state|||Kết nối bị đóng để ngăn một trạng thái không nhất quán',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A worker holds a SET NX PX 10000 lock, then suffers a 12-second GC pause. Another worker acquires the lock. What is the correct conclusion?|||Một worker đang giữ một cái khoá SET NX PX 10000, rồi dính một nhịp dọn rác 12 giây. Một worker khác giành được cái khoá. Kết luận đúng là gì?',
            options: [
              'A bug in the release script — the first worker should detect the expiry|||Một lỗi trong script nhả khoá — worker đầu tiên đáng lẽ phải phát hiện việc hết hạn',
              'A Redis replication issue that Redlock would prevent|||Một vấn đề nhân bản của Redis mà Redlock sẽ ngăn được',
              'A tuning mistake: the PX should simply exceed any possible pause|||Một sai sót tinh chỉnh: PX đáng lẽ chỉ cần lớn hơn mọi nhịp tạm dừng có thể xảy ra',
              'Inherent: any timeout-based lock is a lease and a paused process cannot notice time passing, so correctness needs fencing tokens, unique constraints or idempotency — the lock is only an efficiency optimisation|||Bản chất: mọi khoá dựa trên hạn giờ đều là một hợp đồng thuê và một tiến trình bị tạm dừng không nhận ra thời gian trôi, nên tính đúng đắn cần mã hàng rào, ràng buộc duy nhất hoặc tính lặp-lại-vô-hại — cái khoá chỉ là một phép tối ưu hiệu quả',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A stream consumer group handler charges a card, then the process dies before XACK. What happens, and what does it require of your code?|||Một handler của nhóm tiêu thụ stream quẹt thẻ xong thì tiến trình chết trước lệnh XACK. Chuyện gì xảy ra, và nó đòi hỏi gì ở mã của bạn?',
            options: [
              'The entry is discarded, so the charge happened but no record of it exists|||Mục đó bị vứt đi, nên lần quẹt thẻ đã xảy ra mà không có bản ghi nào',
              'Redis rolls the charge back as part of the pending-entry cleanup|||Redis quay lui lần quẹt thẻ như một phần của việc dọn dẹp mục đang chờ',
              'The entry stays pending, a sweeper reclaims it and it is delivered again — consumer groups are at-least-once, so the handler must be idempotent, and the stream entry ID is a ready-made idempotency key|||Mục đó vẫn nằm chờ, một tiến trình quét đòi lại nó và nó được giao lần nữa — nhóm tiêu thụ là ít-nhất-một-lần, nên handler phải lặp-lại-vô-hại, và mã mục của stream là một khoá chống trùng có sẵn',
              'Nothing — XACK is implicit once the handler returns without throwing|||Không sao cả — XACK là ngầm định ngay khi handler trả về mà không ném lỗi',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'One instance holds your cache, your job queue and your sessions, with maxmemory-policy allkeys-lru. Memory fills. What is the danger?|||Một cái máy giữ bộ đệm, hàng đợi việc và các phiên đăng nhập của bạn, với maxmemory-policy allkeys-lru. Bộ nhớ đầy lên. Nguy hiểm ở đâu?',
            options: [
              'Eviction does not know what a key is for: it can delete an unprocessed queue, a live session or a held lock as readily as a cache entry, silently, because those look idle|||Việc đẩy khoá không biết một khoá dùng để làm gì: nó xoá một hàng đợi chưa xử lý, một phiên đang sống hay một cái khoá đang được giữ dễ dàng như xoá một mục bộ đệm, một cách âm thầm, vì những thứ đó trông như đang nằm im',
              'Writes will begin failing with OOM while reads continue to work|||Các lượt ghi sẽ bắt đầu hỏng với lỗi OOM trong khi các lượt đọc vẫn chạy',
              'Redis will refuse to evict anything because the queue keys have no TTL|||Redis sẽ từ chối đẩy đi bất cứ thứ gì vì các khoá hàng đợi không có TTL',
              'Fragmentation rises, and activedefrag will stall the server while it runs|||Phân mảnh tăng lên, và activedefrag sẽ làm khựng máy chủ trong lúc nó chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run a primary with one replica and no Sentinel. The primary’s host dies. What actually happens?|||Bạn chạy một bản chính với một bản sao và không có Sentinel. Máy chủ của bản chính chết. Chuyện gì thật sự xảy ra?',
            options: [
              'The replica detects the failure and promotes itself within seconds|||Bản sao phát hiện hỏng hóc rồi tự thăng cấp trong vài giây',
              'Nothing promotes: the replica keeps serving increasingly stale reads while every write fails, because clients still point at the dead address — recovery is a manual runbook, which is what Sentinel or Cluster automates|||Không gì thăng cấp cả: bản sao cứ phục vụ những lượt đọc ngày một ôi trong khi mọi lượt ghi hỏng, vì các thư viện khách vẫn trỏ vào địa chỉ đã chết — việc hồi phục là một cuốn sổ tay thủ công, và đó là thứ Sentinel hay Cluster tự động hoá',
              'Clients automatically fail over because the replica advertises itself|||Các thư viện khách tự chuyển đổi vì bản sao tự quảng bá chính nó',
              'Writes are queued on the replica and applied when the primary returns|||Các lượt ghi được xếp hàng trên bản sao rồi áp dụng khi bản chính quay lại',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
