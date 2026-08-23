/**
 * Redis — Chương 9: Bộ nhớ, đẩy khoá và lưu lâu dài.
 * Bộ nhớ đi đâu · maxmemory và tám chính sách · RDB và fork · AOF · chọn tư thế bền · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 9 — Memory, eviction and persistence|||Chương 9 — Bộ nhớ, đẩy khoá và lưu lâu dài',
  description: 'Redis sống trong RAM, nên hai câu hỏi quyết định số phận nó ở production: hết bộ nhớ thì nó vứt cái gì đi, và máy sập thì nó nhớ được cái gì. Chương này đo bộ nhớ thật sự đi đâu, mổ xẻ tám chính sách đẩy khoá, rồi so RDB với AOF bằng con số chứ không bằng cảm giác.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Where the memory actually goes|||9.1 — Bộ nhớ thật sự đi đâu',
      slug: 'rd-9-1-bo-nho-di-dau',
      type: 'LESSON',
      isFreePreview: true,
      description: 'used_memory với RSS với dataset, MEMORY STATS đọc từng dòng, chi phí phụ mà không khoá nào chịu trách nhiệm, phân mảnh bộ cấp phát và tỉ lệ dưới 1 nghĩa là đang tráo ra đĩa, cùng activedefrag.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Where the memory actually goes</h2>
<p class="lead">"Redis is using 8 GB" is four different numbers that rarely agree, and picking the wrong one is how you either buy a machine you did not need or run out of memory on the one you have. Before tuning anything, learn to read the meter.</p>

<h3>Four numbers, four meanings</h3>
<pre><code>redis-cli INFO memory | grep -E "^used_memory:|^used_memory_human|^used_memory_rss_human|^used_memory_peak_human|^used_memory_dataset:|^used_memory_lua|^maxmemory_human|^mem_fragmentation_ratio|^mem_allocator"</code></pre>
<div class="out">used_memory:1284419016
used_memory_human:1.20G
used_memory_rss_human:1.61G
used_memory_peak_human:2.84G
used_memory_dataset:1058291720
used_memory_lua:31744
maxmemory_human:4.00G
mem_fragmentation_ratio:1.29
mem_allocator:jemalloc-5.3.0</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">used_memory — what Redis asked the allocator for</span><span class="lz-lnote">The number <code>maxmemory</code> is compared against, and the one that decides eviction. It counts your data plus all of Redis's own structures, and it does <em>not</em> count memory the allocator is holding but not handing out.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_rss — what the OS thinks the process has</span><span class="lz-lnote">Resident set size, straight from the kernel. Higher than <code>used_memory</code> when the allocator is holding freed pages; <em>lower</em> when part of the process has been swapped to disk, which is the worst thing that can happen to Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_dataset — just your keys and values</span><span class="lz-lnote"><code>used_memory</code> minus the overhead below. In the reading above that is 1.06 GB of actual data inside 1.20 GB of process — so 18% of what Redis is using is not your data at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_peak — the high-water mark since start</span><span class="lz-lnote">This is the number to size a machine against, not the current one. A peak far above the current value usually means a bulk import, a big <code>ZUNIONSTORE</code>, or a client output buffer that ballooned during an incident.</span></div>
</div>

<h3>The overhead nobody owns</h3>
<pre><code>redis-cli MEMORY STATS | paste - - | grep -E "overhead.total|keys.count|dataset.bytes|dataset.percentage|peak.allocated|replication.backlog|clients.normal|clients.slaves|aof.buffer|keys.bytes-per-key|fragmentation"</code></pre>
<div class="out">overhead.total	226127296
keys.count	1842033
dataset.bytes	1058291720
dataset.percentage	82.39
peak.allocated	3049283584
replication.backlog	67108864
clients.slaves	20512
clients.normal	1662480
aof.buffer	0
keys.bytes-per-key	697
fragmentation	1.29</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>overhead.total</code> — 226 MB here</span><span class="v">The keyspace dictionary itself, the expires dictionary, client buffers, the replication backlog, and per-object headers. It grows with the <em>number</em> of keys, not their size, which is why a million tiny keys is expensive (Lesson 5.2).</span></div>
  <div class="kv"><span class="k"><code>replication.backlog</code> — 64 MB, always</span><span class="v">A fixed ring buffer sized by <code>repl-backlog-size</code>, allocated as soon as a replica connects and kept afterwards. On a small instance this single line can be most of your overhead (Chapter 11).</span></div>
  <div class="kv"><span class="k"><code>clients.normal</code> — output buffers</span><span class="v">1.6 MB across all clients is healthy. If this is hundreds of megabytes, someone is running a huge <code>HGETALL</code> or a slow subscriber is falling behind (Lesson 8.1) — and it counts toward <code>maxmemory</code>.</span></div>
  <div class="kv"><span class="k"><code>keys.bytes-per-key</code> — 697</span><span class="v">Total memory divided by key count. Useful as a trend: if it doubles overnight, something changed about the shape of your data, and this number notices before your dashboards do.</span></div>
  <div class="kv"><span class="k"><code>dataset.percentage</code> — 82%</span><span class="v">How much of Redis's memory is actually your data. Below ~70% on a large instance means overhead is dominating, and the usual cause is far too many keys for their size.</span></div>
</div>

<h3>Fragmentation, and the ratio that means something is wrong</h3>
<pre><code>redis-cli INFO memory | grep -E "fragmentation_ratio|fragmentation_bytes"
redis-cli MEMORY DOCTOR
<span class="tok-comment"># Let the allocator give pages back, in the background, while serving</span>
redis-cli CONFIG SET activedefrag yes
redis-cli CONFIG GET active-defrag-ignore-bytes active-defrag-threshold-lower
redis-cli INFO stats | grep active_defrag</code></pre>
<div class="out">mem_fragmentation_ratio:1.29
mem_fragmentation_bytes:329421928
Sam, I detected a few issues in this Redis instance memory implants:

 * High allocator fragmentation: This instance has an allocator external fragmentation greater than 1.1.
OK
1) "active-defrag-ignore-bytes"
2) "104857600"
3) "active-defrag-threshold-lower"
4) "10"
active_defrag_hits:18244
active_defrag_misses:2011
active_defrag_key_hits:9012
active_defrag_key_misses:118</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1.0 to 1.1 — healthy</span><span class="lz-t">the allocator is doing its job</span><span class="lz-d">A small gap is normal and expected. There is nothing to fix here and turning on defrag would cost CPU for no benefit.</span></div>
  <div class="lz-step"><span class="lz-k">Above ~1.5 — real fragmentation</span><span class="lz-t">freed memory the OS has not got back</span><span class="lz-d">Usually follows a big deletion or a workload with wildly varying object sizes: jemalloc keeps the pages because parts of them are still in use. <code>activedefrag yes</code> makes Redis relocate live objects to empty the pages, using CPU in the background to return RAM.</span></div>
  <div class="lz-step"><span class="lz-k">Below 1.0 — the emergency</span><span class="lz-t">RSS is smaller than used_memory</span><span class="lz-d">The kernel has swapped part of Redis to disk. A single-threaded server that touches a swapped page stalls for milliseconds and blocks everyone (Lesson 1.1), turning a memory problem into a latency catastrophe. Fix it by reducing memory or adding RAM — never by "tuning swappiness" and hoping.</span></div>
  <div class="lz-step"><span class="lz-k">Right after a restart — meaningless</span><span class="lz-t">and after a big delete, temporarily high</span><span class="lz-d">The ratio needs a warm, steady instance to mean anything. Do not page anyone at 3am because it spiked for ninety seconds after a <code>FLUSHDB</code>.</span></div>
</div>

<h3>Finding the actual culprit</h3>
<pre><code>redis-cli --memkeys --memkeys-samples 0 2&gt;/dev/null | tail -8
redis-cli --bigkeys 2&gt;/dev/null | grep -A6 "summary"
redis-cli INFO keyspace</code></pre>
<div class="out">[100.00%] Biggest   hash found so far 'sess:archive' with 412880 bytes

-------- summary -------
Sampled 1842033 keys in the keyspace!
Total key length in bytes is 33156594 (avg len 18.00)

Biggest   hash found 'sess:archive' has 412880 bytes
Biggest string found 'cache:report:2026-08' has 8912304 bytes
Biggest   list found 'queue:dead' has 1204118 bytes

1842033 keys with 3 types (100.00% of keys)
db0:keys=1842033,expires=1799210,avg_ttl=241833</div>
<div class="callout ok"><strong>Three commands answer "why is Redis full", in order.</strong> <code>INFO memory</code> tells you whether the problem is data, overhead or fragmentation. <code>MEMORY STATS</code> tells you which kind of overhead. <code>--memkeys</code> names the specific key — and note it ranks by <em>bytes</em>, unlike <code>--bigkeys</code> which ranks by element count, so a 50-field hash holding megabyte values beats a 500,000-field hash of tiny integers and only <code>--memkeys</code> will tell you (Lesson 5.2). All three use <code>SCAN</code> under the hood and are safe to run on production; none of them is <code>KEYS</code>.</div>

<div class="pitfall"><strong>Pitfall:</strong> sizing an instance from <code>used_memory</code> and being surprised at 3am. Three things push the real requirement well above the number you measured. <strong>The fork.</strong> A background save copies the page table and then diverges by copy-on-write as writes land — on a write-heavy instance this can add 30–50% transient RSS, and if the machine cannot supply it the kernel's OOM killer takes Redis, not the fork (Lesson 9.3). <strong>The peak, not the average.</strong> <code>used_memory_peak</code> exists because a nightly import or one large <code>ZUNIONSTORE</code> sets the real high-water mark, and <code>maxmemory</code> is compared against the instantaneous value, not a rolling average. <strong>Everything that is not your data.</strong> The replication backlog, client output buffers, the AOF buffer and the keyspace dictionary all count toward <code>maxmemory</code>, and on an instance with millions of small keys that overhead is routinely 20–30%. Size from <code>used_memory_peak</code> plus headroom for a fork, set <code>maxmemory</code> to roughly 60–70% of the machine's RAM rather than 95%, and treat the gap as the price of being able to save at all.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Memory optimization</span><span class="lc-sub">What each encoding costs, where the overhead comes from, and the small-object techniques. The reference behind most of the numbers in this lesson.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/memory-stats/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">MEMORY STATS</span><span class="lc-sub">Every field explained, including the ones that only make sense on a replica or during an AOF rewrite. Read it once and the output stops being noise.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read the meter</span><span class="lc-sub">Graded exercises: work out from four <code>INFO memory</code> readings whether the instance is fragmented, swapping or simply full; find the key responsible with <code>--memkeys</code>; and size an instance from a peak plus fork headroom.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Four numbers mean four things: <code>used_memory</code> is what eviction is measured against, <code>used_memory_rss</code> is what the OS sees, <code>used_memory_dataset</code> is your actual data, and <code>used_memory_peak</code> is what you should size the machine from. Overhead is not free and nobody owns it — the keyspace dictionary, the replication backlog and client output buffers all count toward <code>maxmemory</code>, and they scale with key count rather than data size. And the fragmentation ratio is a three-way signal: near 1.1 is healthy, above 1.5 is fragmentation that <code>activedefrag</code> can reclaim, and <em>below 1.0</em> means Redis is swapping, which is an emergency rather than a tuning opportunity.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Bộ nhớ thật sự đi đâu</h2>
<p class="lead">"Redis đang dùng 8 GB" là bốn con số khác nhau hiếm khi khớp nhau, và chọn nhầm con số là cách bạn hoặc mua một cái máy không cần tới, hoặc hết bộ nhớ trên cái máy đang có. Trước khi tinh chỉnh bất cứ thứ gì, hãy học đọc cái đồng hồ đo.</p>

<h3>Bốn con số, bốn ý nghĩa</h3>
<pre><code>redis-cli INFO memory | grep -E "^used_memory:|^used_memory_human|^used_memory_rss_human|^used_memory_peak_human|^used_memory_dataset:|^used_memory_lua|^maxmemory_human|^mem_fragmentation_ratio|^mem_allocator"</code></pre>
<div class="out">used_memory:1284419016
used_memory_human:1.20G
used_memory_rss_human:1.61G
used_memory_peak_human:2.84G
used_memory_dataset:1058291720
used_memory_lua:31744
maxmemory_human:4.00G
mem_fragmentation_ratio:1.29
mem_allocator:jemalloc-5.3.0</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">used_memory — thứ Redis đã xin bộ cấp phát</span><span class="lz-lnote">Con số mà <code>maxmemory</code> đem ra so, và là con số quyết định việc đẩy khoá. Nó đếm cả dữ liệu của bạn lẫn mọi cấu trúc của chính Redis, và nó <em>không</em> đếm phần bộ nhớ mà bộ cấp phát đang ôm nhưng chưa phát ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_rss — thứ mà hệ điều hành nghĩ tiến trình đang chiếm</span><span class="lz-lnote">Kích thước thường trú, lấy thẳng từ nhân. Cao hơn <code>used_memory</code> khi bộ cấp phát đang ôm các trang đã giải phóng; <em>thấp hơn</em> khi một phần tiến trình đã bị tráo ra đĩa, và đó là điều tệ nhất có thể xảy đến với Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_dataset — chỉ riêng khoá và giá trị của bạn</span><span class="lz-lnote"><code>used_memory</code> trừ đi phần chi phí phụ nói ở dưới. Trong lần đọc trên thì đó là 1,06 GB dữ liệu thật nằm trong một tiến trình 1,20 GB — nên 18% những gì Redis đang dùng hoàn toàn không phải dữ liệu của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">used_memory_peak — mốc cao nhất kể từ lúc khởi động</span><span class="lz-lnote">Đây mới là con số để chọn cỡ máy, không phải con số hiện tại. Một đỉnh cao hơn hẳn giá trị hiện tại thường nghĩa là một lần nhập hàng loạt, một lệnh <code>ZUNIONSTORE</code> lớn, hoặc một bộ đệm đầu ra của khách phình lên trong lúc có sự cố.</span></div>
</div>

<h3>Phần chi phí phụ không ai nhận</h3>
<pre><code>redis-cli MEMORY STATS | paste - - | grep -E "overhead.total|keys.count|dataset.bytes|dataset.percentage|peak.allocated|replication.backlog|clients.normal|clients.slaves|aof.buffer|keys.bytes-per-key|fragmentation"</code></pre>
<div class="out">overhead.total	226127296
keys.count	1842033
dataset.bytes	1058291720
dataset.percentage	82.39
peak.allocated	3049283584
replication.backlog	67108864
clients.slaves	20512
clients.normal	1662480
aof.buffer	0
keys.bytes-per-key	697
fragmentation	1.29</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>overhead.total</code> — 226 MB ở đây</span><span class="v">Bản thân từ điển không gian khoá, từ điển hạn dùng, bộ đệm của các khách, bộ đệm nhân bản, và phần đầu của từng đối tượng. Nó lớn theo <em>số lượng</em> khoá chứ không theo kích thước, đó là vì sao một triệu khoá tí hon lại đắt (Bài 5.2).</span></div>
  <div class="kv"><span class="k"><code>replication.backlog</code> — 64 MB, luôn luôn</span><span class="v">Một bộ đệm vòng cố định, cỡ đặt bằng <code>repl-backlog-size</code>, được cấp phát ngay khi một bản sao nối vào và giữ nguyên sau đó. Trên một máy nhỏ thì riêng dòng này có thể là phần lớn chi phí phụ của bạn (Chương 11).</span></div>
  <div class="kv"><span class="k"><code>clients.normal</code> — bộ đệm đầu ra</span><span class="v">1,6 MB trải trên tất cả các khách là lành mạnh. Nếu chỗ này là hàng trăm megabyte thì có ai đó đang chạy một lệnh <code>HGETALL</code> khổng lồ hoặc một bên đăng ký chậm đang tụt lại (Bài 8.1) — và nó được tính vào <code>maxmemory</code>.</span></div>
  <div class="kv"><span class="k"><code>keys.bytes-per-key</code> — 697</span><span class="v">Tổng bộ nhớ chia cho số khoá. Có ích như một xu hướng: nếu nó tăng gấp đôi sau một đêm thì có gì đó đã đổi về hình dáng dữ liệu của bạn, và con số này nhận ra trước cả bảng điều khiển của bạn.</span></div>
  <div class="kv"><span class="k"><code>dataset.percentage</code> — 82%</span><span class="v">Bao nhiêu phần bộ nhớ của Redis thật sự là dữ liệu của bạn. Dưới khoảng 70% trên một máy lớn nghĩa là chi phí phụ đang lấn át, và nguyên nhân thường gặp là quá nhiều khoá so với kích thước của chúng.</span></div>
</div>

<h3>Phân mảnh, và cái tỉ lệ báo hiệu có chuyện</h3>
<pre><code>redis-cli INFO memory | grep -E "fragmentation_ratio|fragmentation_bytes"
redis-cli MEMORY DOCTOR
<span class="tok-comment"># Để bộ cấp phát trả trang về, ở nền, trong lúc vẫn phục vụ</span>
redis-cli CONFIG SET activedefrag yes
redis-cli CONFIG GET active-defrag-ignore-bytes active-defrag-threshold-lower
redis-cli INFO stats | grep active_defrag</code></pre>
<div class="out">mem_fragmentation_ratio:1.29
mem_fragmentation_bytes:329421928
Sam, I detected a few issues in this Redis instance memory implants:

 * High allocator fragmentation: This instance has an allocator external fragmentation greater than 1.1.
OK
1) "active-defrag-ignore-bytes"
2) "104857600"
3) "active-defrag-threshold-lower"
4) "10"
active_defrag_hits:18244
active_defrag_misses:2011
active_defrag_key_hits:9012
active_defrag_key_misses:118</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1,0 tới 1,1 — lành mạnh</span><span class="lz-t">bộ cấp phát đang làm việc của nó</span><span class="lz-d">Một khoảng cách nhỏ là bình thường và đúng như dự kiến. Chẳng có gì để sửa ở đây và bật defrag lên chỉ tốn CPU mà không được gì.</span></div>
  <div class="lz-step"><span class="lz-k">Trên khoảng 1,5 — phân mảnh thật</span><span class="lz-t">bộ nhớ đã giải phóng mà hệ điều hành chưa nhận lại</span><span class="lz-d">Thường xảy ra sau một đợt xoá lớn hoặc với một khối lượng việc có kích thước đối tượng dao động dữ dội: jemalloc giữ các trang lại vì vài phần của chúng vẫn đang được dùng. <code>activedefrag yes</code> khiến Redis dời các đối tượng còn sống đi để làm rỗng các trang, tốn CPU ở nền để trả RAM về.</span></div>
  <div class="lz-step"><span class="lz-k">Dưới 1,0 — tình huống khẩn cấp</span><span class="lz-t">RSS nhỏ hơn used_memory</span><span class="lz-d">Nhân đã tráo một phần Redis ra đĩa. Một máy chủ đơn luồng chạm vào một trang đã tráo sẽ khựng lại hàng mili giây và chặn tất cả mọi người (Bài 1.1), biến một vấn đề bộ nhớ thành một thảm hoạ độ trễ. Hãy chữa bằng cách giảm bộ nhớ hoặc thêm RAM — đừng bao giờ chữa bằng cách "tinh chỉnh swappiness" rồi hy vọng.</span></div>
  <div class="lz-step"><span class="lz-k">Ngay sau khởi động lại — vô nghĩa</span><span class="lz-t">và sau một đợt xoá lớn thì cao tạm thời</span><span class="lz-d">Cái tỉ lệ này cần một máy ấm và ổn định mới có ý nghĩa. Đừng gọi ai dậy lúc 3 giờ sáng vì nó vọt lên trong chín mươi giây sau một lệnh <code>FLUSHDB</code>.</span></div>
</div>

<h3>Tìm ra thủ phạm thật</h3>
<pre><code>redis-cli --memkeys --memkeys-samples 0 2&gt;/dev/null | tail -8
redis-cli --bigkeys 2&gt;/dev/null | grep -A6 "summary"
redis-cli INFO keyspace</code></pre>
<div class="out">[100.00%] Biggest   hash found so far 'sess:archive' with 412880 bytes

-------- summary -------
Sampled 1842033 keys in the keyspace!
Total key length in bytes is 33156594 (avg len 18.00)

Biggest   hash found 'sess:archive' has 412880 bytes
Biggest string found 'cache:report:2026-08' has 8912304 bytes
Biggest   list found 'queue:dead' has 1204118 bytes

1842033 keys with 3 types (100.00% of keys)
db0:keys=1842033,expires=1799210,avg_ttl=241833</div>
<div class="callout ok"><strong>Ba lệnh trả lời câu "vì sao Redis đầy", theo thứ tự.</strong> <code>INFO memory</code> nói cho bạn biết vấn đề nằm ở dữ liệu, ở chi phí phụ, hay ở phân mảnh. <code>MEMORY STATS</code> nói đó là loại chi phí phụ nào. <code>--memkeys</code> gọi tên đúng cái khoá — và lưu ý nó xếp hạng theo <em>byte</em>, khác với <code>--bigkeys</code> vốn xếp theo số phần tử, nên một hash 50 trường chứa các giá trị cỡ megabyte sẽ thắng một hash 500.000 trường toàn số nguyên tí hon, và chỉ <code>--memkeys</code> nói cho bạn biết (Bài 5.2). Cả ba đều dùng <code>SCAN</code> bên dưới và chạy an toàn trên production; không cái nào là <code>KEYS</code> cả.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> chọn cỡ máy từ <code>used_memory</code> rồi ngạc nhiên lúc 3 giờ sáng. Ba thứ đẩy nhu cầu thật cao hơn hẳn con số bạn đo được. <strong>Cú fork.</strong> Một lần lưu chạy nền chép lại bảng trang rồi phân kỳ dần theo cơ chế sao-chép-khi-ghi khi các lượt ghi ập tới — trên một máy nặng ghi thì chuyện này thêm được 30–50% RSS tạm thời, và nếu cái máy không cấp nổi chừng đó thì kẻ giết-vì-hết-bộ-nhớ của nhân sẽ lấy mạng Redis chứ không lấy mạng cái fork (Bài 9.3). <strong>Đỉnh, không phải trung bình.</strong> <code>used_memory_peak</code> tồn tại vì một lần nhập chạy đêm hay một lệnh <code>ZUNIONSTORE</code> lớn mới đặt ra mốc cao nhất thật sự, và <code>maxmemory</code> được so với giá trị tức thời chứ không so với trung bình trượt. <strong>Mọi thứ không phải dữ liệu của bạn.</strong> Bộ đệm nhân bản, bộ đệm đầu ra của các khách, bộ đệm AOF và chính từ điển không gian khoá đều được tính vào <code>maxmemory</code>, và trên một máy có hàng triệu khoá nhỏ thì phần chi phí phụ ấy thường xuyên chiếm 20–30%. Hãy chọn cỡ từ <code>used_memory_peak</code> cộng thêm chỗ trống cho một cú fork, đặt <code>maxmemory</code> vào khoảng 60–70% RAM của máy chứ đừng đặt 95%, và hãy coi cái khoảng chênh đó là cái giá để bạn còn lưu được gì đó.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Memory optimization</span><span class="lc-sub">Mỗi kiểu mã hoá tốn gì, chi phí phụ từ đâu ra, và các kỹ thuật cho đối tượng nhỏ. Là nguồn đứng sau phần lớn con số trong bài này.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/memory-stats/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">MEMORY STATS</span><span class="lc-sub">Giải thích từng trường, kể cả những trường chỉ có nghĩa trên một bản sao hoặc trong lúc ghi lại AOF. Đọc một lần là cái đầu ra ấy thôi còn là nhiễu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đọc cái đồng hồ đo</span><span class="lc-sub">Bài chấm điểm: từ bốn lần đọc <code>INFO memory</code> hãy chỉ ra máy đang phân mảnh, đang tráo ra đĩa, hay đơn giản là đã đầy; tìm cái khoá chịu trách nhiệm bằng <code>--memkeys</code>; và chọn cỡ một cái máy từ đỉnh cộng chỗ trống cho fork.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Bốn con số mang bốn nghĩa: <code>used_memory</code> là thứ việc đẩy khoá đem ra đo, <code>used_memory_rss</code> là thứ hệ điều hành nhìn thấy, <code>used_memory_dataset</code> là dữ liệu thật của bạn, còn <code>used_memory_peak</code> là thứ bạn nên dùng để chọn cỡ máy. Chi phí phụ không miễn phí và chẳng ai nhận nó — từ điển không gian khoá, bộ đệm nhân bản và bộ đệm đầu ra của các khách đều tính vào <code>maxmemory</code>, và chúng lớn theo số khoá chứ không theo kích thước dữ liệu. Và tỉ lệ phân mảnh là một tín hiệu ba chiều: quanh 1,1 là lành mạnh, trên 1,5 là phân mảnh mà <code>activedefrag</code> đòi lại được, còn <em>dưới 1,0</em> nghĩa là Redis đang bị tráo ra đĩa, và đó là tình huống khẩn cấp chứ không phải một cơ hội tinh chỉnh.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — maxmemory and the eight eviction policies|||9.2 — maxmemory và tám chính sách đẩy khoá',
      slug: 'rd-9-2-day-khoa',
      type: 'LESSON',
      description: 'Chuyện gì xảy ra khi chạm trần, tám chính sách và cái nào đúng cho việc gì, LRU xấp xỉ với maxmemory-samples, LFU cùng lfu-log-factor và OBJECT FREQ, và vì sao noeviction mặc định lại làm mọi lệnh ghi hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>maxmemory and the eight eviction policies</h2>
<p class="lead">Sooner or later Redis reaches its memory limit. What happens next is a single configuration value, it has eight possible answers, and the default is the one that makes your application start failing rather than start losing data. Both of those are sometimes correct.</p>

<h3>Reaching the limit</h3>
<pre><code>redis-cli CONFIG SET maxmemory 100mb
redis-cli CONFIG GET maxmemory-policy
python3 -c "
for i in range(400_000): print(f'SET big:{i} {\\"x\\"*300}')
" | redis-cli --pipe 2&gt;&amp;1 | tail -3
redis-cli SET onemore x
redis-cli INFO stats | grep evicted_keys
redis-cli DBSIZE</code></pre>
<div class="out">OK
1) "maxmemory-policy"
2) "noeviction"
errors: 118422, replies: 400000
(error) OOM command not allowed when used memory &gt; 'maxmemory'.
evicted_keys:0
(integer) 281578</div>
<div class="callout warn"><strong>The default is <code>noeviction</code>, and it means writes fail while reads keep working.</strong> Every write command returns <code>OOM command not allowed when used memory &gt; 'maxmemory'</code>, which surfaces in your application as an exception on <code>SET</code>, on <code>LPUSH</code>, on <code>XADD</code> — while <code>GET</code> carries on serving happily. That asymmetry is what makes it confusing in an incident: the site half-works, reads are fine, and every write path is broken. It is the right default for Redis-as-a-database, because silently deleting data is worse than refusing to accept more. It is the wrong setting for Redis-as-a-cache, where you would much rather drop the coldest key than reject the write.</div>

<h3>The eight policies</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">noeviction — refuse writes (default)</span><span class="lz-lnote">Nothing is ever deleted. Writes error, reads work. Correct when every key matters: a queue, a session store you cannot lose, Redis as the source of truth. Pair it with an alert on <code>used_memory</code>, because by the time you see the OOM error you are already down.</span></div>
  <div class="lz-layer"><span class="lz-lname">allkeys-lru / allkeys-lfu / allkeys-random</span><span class="lz-lnote">Evict from <em>every</em> key, TTL or not. <code>allkeys-lru</code> is the standard cache setting: least recently used goes first. <code>allkeys-lfu</code> evicts the least <em>frequently</em> used, which is better when a few keys are hot forever and a long tail is touched once. <code>allkeys-random</code> is genuinely useful only when access is uniform — rare, but cheaper than tracking anything.</span></div>
  <div class="lz-layer"><span class="lz-lname">volatile-lru / volatile-lfu / volatile-random / volatile-ttl</span><span class="lz-lnote">Only consider keys that have a TTL. This is how you mix cache and non-cache in one instance: give cache keys a TTL and they become the only eviction candidates, while your queue and session keys are untouchable. <code>volatile-ttl</code> evicts whatever expires soonest, which approximates "least valuable".</span></div>
  <div class="lz-layer"><span class="lz-lname">The volatile trap</span><span class="lz-lnote">If no key has a TTL, every <code>volatile-*</code> policy behaves exactly like <code>noeviction</code> — Redis finds nothing eligible and starts refusing writes. An instance configured <code>volatile-lru</code> where somebody forgot the TTLs looks fine until the day it hits the limit and hard-fails with a policy that reads as safe.</span></div>
</div>
<pre><code>redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli SET onemore x
redis-cli INFO stats | grep evicted_keys
redis-cli DBSIZE
redis-cli CONFIG SET maxmemory-policy volatile-lru
redis-cli SET yetanother x            <span class="tok-comment"># no TTLs anywhere → OOM again</span></code></pre>
<div class="out">OK
OK
evicted_keys:38
(integer) 281541
OK
(error) OOM command not allowed when used memory &gt; 'maxmemory'.</div>

<h3>LRU is approximate, and that is on purpose</h3>
<pre><code>redis-cli CONFIG GET maxmemory-samples
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli OBJECT IDLETIME big:1
redis-cli GET big:1 &gt;/dev/null
redis-cli OBJECT IDLETIME big:1
redis-cli CONFIG SET maxmemory-samples 10      <span class="tok-comment"># more accurate, more CPU</span></code></pre>
<div class="out">1) "maxmemory-samples"
2) "5"
(integer) 412
(integer) 0
OK</div>
<div class="kv-grid">
  <div class="kv"><span class="k">There is no global LRU list</span><span class="v">Maintaining one would cost memory per key and a linked-list update on every access. Instead Redis samples <code>maxmemory-samples</code> random keys and evicts the best candidate among them, repeating until it is under the limit.</span></div>
  <div class="kv"><span class="k">5 samples is already close to true LRU</span><span class="v">The Redis docs publish the comparison graphs: at 5 samples the approximation is visually near-perfect for cache workloads, and 10 is nearly indistinguishable from exact. The default is a deliberate accuracy/CPU trade, not a limitation.</span></div>
  <div class="kv"><span class="k">A pool of candidates carries over</span><span class="v">Since Redis 3.0 the eviction pool remembers good candidates between rounds, which is why raising samples from 5 to 10 helps far less than you would expect. Raise it only if you have measured a problem.</span></div>
  <div class="kv"><span class="k"><code>OBJECT IDLETIME</code> shows the clock</span><span class="v">Seconds since the key was last accessed — available under LRU policies. Note that reading it does not count as an access, which is what makes it usable for diagnosis.</span></div>
  <div class="kv"><span class="k">Eviction happens on the write path</span><span class="v">Redis checks the limit before each command and evicts inline, in the same single thread (Lesson 1.1). Freeing 200 MB of large objects at once is a latency spike, and it shows up in <code>--latency</code> as a stall with no slow command to blame (Lesson 6.5).</span></div>
</div>

<h3>LFU: when "recent" is the wrong question</h3>
<pre><code>redis-cli CONFIG SET maxmemory-policy allkeys-lfu
redis-cli CONFIG GET lfu-log-factor lfu-decay-time
redis-cli SET hot v &gt;/dev/null
for i in $(seq 1 200); do redis-cli GET hot &gt;/dev/null; done
redis-cli OBJECT FREQ hot
redis-cli SET cold v &gt;/dev/null
redis-cli OBJECT FREQ cold</code></pre>
<div class="out">OK
1) "lfu-log-factor"
2) "10"
3) "lfu-decay-time"
4) "1"
(integer) 8
(integer) 5</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The counter is logarithmic</span><span class="lz-t">8 bits, saturating around 255</span><span class="lz-d">200 accesses produced a frequency of 8, not 200. Each hit increments probabilistically, with the probability falling as the counter rises — so a key accessed a million times and one accessed ten thousand times end up close, which is exactly what you want for ranking.</span></div>
  <div class="lz-step"><span class="lz-k">New keys start at 5</span><span class="lz-t">not 0</span><span class="lz-d">A deliberate grace period: a key that has just been created has not had a chance to prove itself, and starting at zero would evict every new key immediately. It decays back down if nothing touches it.</span></div>
  <div class="lz-step"><span class="lz-k"><code>lfu-decay-time</code> forgets</span><span class="lz-t">1 minute per decrement, by default</span><span class="lz-d">Without decay, a key that was hot last Tuesday would stay protected forever. The counter halves-then-decrements over time, so yesterday's popularity fades and the ranking tracks the present.</span></div>
  <div class="lz-step"><span class="lz-k">Choose LFU when the tail is scanned</span><span class="lz-t">crawlers, batch jobs, one-off report URLs</span><span class="lz-d">LRU is fooled by a full-catalogue scan: it evicts your genuinely hot keys to make room for a million pages touched once. LFU is not, because those pages never build up a frequency. That is the case where switching is worth real money.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> running one Redis instance for the cache <em>and</em> the queue <em>and</em> the sessions, on <code>allkeys-lru</code>. It is the most common Redis architecture in the world and it contains a landmine: eviction does not know what a key is <em>for</em>. When memory fills, <code>allkeys-lru</code> will cheerfully delete a stream containing unprocessed orders (Lesson 8.5), a session that logs a user out, or a distributed lock that is currently held (Lesson 7.5) — because those keys happened to be idle, which is exactly what a lock and a pending job look like. There is no error, no log line, and nothing that connects the missing orders to the memory pressure two hours earlier. Two ways out, and you want one of them before you need it. <strong>Separate instances</strong> is the honest answer: a cache instance on <code>allkeys-lru</code> that is <em>allowed</em> to lose data, and a data instance on <code>noeviction</code> that is not. <strong>Or <code>volatile-lru</code> with discipline:</strong> every cache key gets a TTL, nothing else does, and eviction can then only touch things designed to disappear — but that discipline is one forgotten <code>EX</code> away from failing, so add a check that alerts when a non-cache prefix acquires a TTL or a cache key loses one.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">🗑️</span>
  <span class="lc-body"><span class="lc-title">Key eviction</span><span class="lc-sub">All eight policies, the approximated-LRU graphs comparing 5 and 10 samples against true LRU, and the LFU counter maths. The graphs alone are worth the visit.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/object-freq/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">OBJECT FREQ and OBJECT IDLETIME</span><span class="lc-sub">How to inspect what eviction thinks of a specific key, which policy each command requires, and how the logarithmic counter maps to real access counts.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: fill an instance and watch</span><span class="lc-sub">Graded exercises: hit the limit under four policies and compare what survives, prove <code>volatile-lru</code> behaves as <code>noeviction</code> without TTLs, and pick a policy for five different workloads.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> The default <code>noeviction</code> fails writes while reads keep working — correct for Redis-as-a-database and wrong for Redis-as-a-cache, and the asymmetry is what makes the incident confusing. Every <code>volatile-*</code> policy degrades silently into <code>noeviction</code> when no key has a TTL, so a "safe-looking" configuration can hard-fail the first time it fills. And eviction does not know what a key is for: on a shared instance, <code>allkeys-lru</code> will delete a held lock, an unprocessed queue or a live session as readily as a cache entry — separate the instances, or enforce that only cache keys carry TTLs and use <code>volatile-*</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>maxmemory và tám chính sách đẩy khoá</h2>
<p class="lead">Sớm hay muộn Redis cũng chạm trần bộ nhớ. Chuyện xảy ra tiếp theo nằm gọn trong một giá trị cấu hình, nó có tám câu trả lời khả dĩ, và mặc định là cái làm ứng dụng của bạn bắt đầu hỏng chứ không phải bắt đầu mất dữ liệu. Cả hai điều đó đôi khi đều đúng.</p>

<h3>Chạm trần</h3>
<pre><code>redis-cli CONFIG SET maxmemory 100mb
redis-cli CONFIG GET maxmemory-policy
python3 -c "
for i in range(400_000): print(f'SET big:{i} {\\"x\\"*300}')
" | redis-cli --pipe 2&gt;&amp;1 | tail -3
redis-cli SET onemore x
redis-cli INFO stats | grep evicted_keys
redis-cli DBSIZE</code></pre>
<div class="out">OK
1) "maxmemory-policy"
2) "noeviction"
errors: 118422, replies: 400000
(error) OOM command not allowed when used memory &gt; 'maxmemory'.
evicted_keys:0
(integer) 281578</div>
<div class="callout warn"><strong>Mặc định là <code>noeviction</code>, và nó nghĩa là các lệnh ghi hỏng trong khi các lệnh đọc vẫn chạy.</strong> Mọi lệnh ghi đều trả về <code>OOM command not allowed when used memory &gt; 'maxmemory'</code>, và trong ứng dụng của bạn nó hiện ra thành một ngoại lệ ở <code>SET</code>, ở <code>LPUSH</code>, ở <code>XADD</code> — trong khi <code>GET</code> vẫn phục vụ vui vẻ. Sự bất đối xứng đó là thứ làm nó rối rắm lúc có sự cố: trang web chạy được một nửa, đọc thì ổn, và mọi nhánh ghi đều hỏng. Nó là mặc định đúng cho Redis-làm-cơ-sở-dữ-liệu, vì xoá dữ liệu âm thầm còn tệ hơn từ chối nhận thêm. Nó là thiết lập sai cho Redis-làm-bộ-đệm, nơi bạn thà bỏ đi cái khoá nguội nhất còn hơn từ chối lượt ghi.</div>

<h3>Tám chính sách</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">noeviction — từ chối lượt ghi (mặc định)</span><span class="lz-lnote">Không gì bị xoá cả. Ghi thì lỗi, đọc thì chạy. Đúng khi mọi khoá đều quan trọng: một hàng đợi, một kho phiên bạn không thể mất, Redis làm nguồn sự thật. Hãy ghép nó với một cảnh báo trên <code>used_memory</code>, vì tới lúc bạn thấy lỗi OOM thì bạn đã sập rồi.</span></div>
  <div class="lz-layer"><span class="lz-lname">allkeys-lru / allkeys-lfu / allkeys-random</span><span class="lz-lnote">Đẩy khoá từ <em>mọi</em> khoá, có TTL hay không. <code>allkeys-lru</code> là thiết lập bộ đệm tiêu chuẩn: cái lâu-không-dùng-nhất đi trước. <code>allkeys-lfu</code> đẩy cái ít được dùng <em>thường xuyên</em> nhất, tốt hơn khi vài khoá nóng mãi mãi còn một cái đuôi dài chỉ được chạm một lần. <code>allkeys-random</code> chỉ thật sự có ích khi truy cập là đồng đều — hiếm, nhưng rẻ hơn việc phải theo dõi bất cứ thứ gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">volatile-lru / volatile-lfu / volatile-random / volatile-ttl</span><span class="lz-lnote">Chỉ xét những khoá có TTL. Đây là cách bạn trộn phần bộ đệm với phần không phải bộ đệm trong một máy: cho khoá bộ đệm một TTL và chúng trở thành ứng viên đẩy khoá duy nhất, trong khi khoá hàng đợi và khoá phiên của bạn thì bất khả xâm phạm. <code>volatile-ttl</code> đẩy cái sắp hết hạn sớm nhất, xấp xỉ với "ít giá trị nhất".</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái bẫy của volatile</span><span class="lz-lnote">Nếu không khoá nào có TTL thì mọi chính sách <code>volatile-*</code> cư xử y hệt <code>noeviction</code> — Redis chẳng tìm thấy ứng viên nào hợp lệ và bắt đầu từ chối lượt ghi. Một máy cấu hình <code>volatile-lru</code> mà ai đó quên đặt TTL sẽ trông vẫn ổn cho tới cái ngày nó chạm trần rồi hỏng cứng với một chính sách nghe rất an toàn.</span></div>
</div>
<pre><code>redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli SET onemore x
redis-cli INFO stats | grep evicted_keys
redis-cli DBSIZE
redis-cli CONFIG SET maxmemory-policy volatile-lru
redis-cli SET yetanother x            <span class="tok-comment"># không đâu có TTL → lại OOM</span></code></pre>
<div class="out">OK
OK
evicted_keys:38
(integer) 281541
OK
(error) OOM command not allowed when used memory &gt; 'maxmemory'.</div>

<h3>LRU là xấp xỉ, và đó là cố ý</h3>
<pre><code>redis-cli CONFIG GET maxmemory-samples
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli OBJECT IDLETIME big:1
redis-cli GET big:1 &gt;/dev/null
redis-cli OBJECT IDLETIME big:1
redis-cli CONFIG SET maxmemory-samples 10      <span class="tok-comment"># chính xác hơn, tốn CPU hơn</span></code></pre>
<div class="out">1) "maxmemory-samples"
2) "5"
(integer) 412
(integer) 0
OK</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có danh sách LRU toàn cục nào</span><span class="v">Duy trì một cái sẽ tốn bộ nhớ cho mỗi khoá và một lần cập nhật danh sách liên kết ở mỗi lượt truy cập. Thay vào đó Redis lấy mẫu <code>maxmemory-samples</code> khoá ngẫu nhiên rồi đẩy ứng viên tốt nhất trong số đó, lặp lại cho tới khi xuống dưới trần.</span></div>
  <div class="kv"><span class="k">5 mẫu đã gần với LRU thật</span><span class="v">Tài liệu Redis công bố biểu đồ so sánh: ở 5 mẫu thì phép xấp xỉ nhìn gần như hoàn hảo với khối lượng việc kiểu bộ đệm, và 10 thì gần như không phân biệt được với chính xác. Mặc định là một cuộc đổi chác có chủ ý giữa độ chính xác và CPU, không phải một hạn chế.</span></div>
  <div class="kv"><span class="k">Một gáo ứng viên được mang sang vòng sau</span><span class="v">Từ Redis 3.0, gáo đẩy khoá nhớ lại các ứng viên tốt giữa các vòng, đó là lý do nâng số mẫu từ 5 lên 10 giúp ít hơn nhiều so với bạn tưởng. Chỉ nâng nó khi bạn đã đo được một vấn đề thật.</span></div>
  <div class="kv"><span class="k"><code>OBJECT IDLETIME</code> cho thấy cái đồng hồ</span><span class="v">Số giây kể từ lần cuối khoá được truy cập — dùng được dưới các chính sách LRU. Lưu ý rằng đọc nó không tính là một lượt truy cập, chính điều đó làm nó dùng được để chẩn đoán.</span></div>
  <div class="kv"><span class="k">Việc đẩy khoá xảy ra trên nhánh ghi</span><span class="v">Redis kiểm cái trần trước mỗi lệnh rồi đẩy khoá ngay tại chỗ, trong cùng một luồng đơn (Bài 1.1). Giải phóng 200 MB đối tượng lớn một lượt là một đợt vọt độ trễ, và nó hiện ra trong <code>--latency</code> như một cú khựng mà không có lệnh chậm nào để đổ lỗi (Bài 6.5).</span></div>
</div>

<h3>LFU: khi "gần đây" là câu hỏi sai</h3>
<pre><code>redis-cli CONFIG SET maxmemory-policy allkeys-lfu
redis-cli CONFIG GET lfu-log-factor lfu-decay-time
redis-cli SET hot v &gt;/dev/null
for i in $(seq 1 200); do redis-cli GET hot &gt;/dev/null; done
redis-cli OBJECT FREQ hot
redis-cli SET cold v &gt;/dev/null
redis-cli OBJECT FREQ cold</code></pre>
<div class="out">OK
1) "lfu-log-factor"
2) "10"
3) "lfu-decay-time"
4) "1"
(integer) 8
(integer) 5</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bộ đếm là logarit</span><span class="lz-t">8 bit, bão hoà quanh 255</span><span class="lz-d">200 lượt truy cập tạo ra tần suất bằng 8, không phải 200. Mỗi lượt trúng tăng bộ đếm theo xác suất, với xác suất giảm dần khi bộ đếm lên cao — nên một khoá được truy cập một triệu lần và một khoá mười nghìn lần rốt cuộc nằm gần nhau, đúng là thứ bạn cần để xếp hạng.</span></div>
  <div class="lz-step"><span class="lz-k">Khoá mới bắt đầu ở 5</span><span class="lz-t">không phải 0</span><span class="lz-d">Một khoảng ân hạn có chủ ý: một khoá vừa được tạo thì chưa có cơ hội chứng tỏ mình, và bắt đầu từ 0 sẽ khiến mọi khoá mới bị đẩy đi ngay lập tức. Nó tự tụt xuống nếu chẳng có gì chạm tới.</span></div>
  <div class="lz-step"><span class="lz-k"><code>lfu-decay-time</code> làm nhiệm vụ quên</span><span class="lz-t">mặc định 1 phút cho mỗi lần giảm</span><span class="lz-d">Không có phép quên thì một khoá từng nóng hồi thứ Ba tuần trước sẽ được che chở mãi mãi. Bộ đếm bị chia đôi rồi giảm dần theo thời gian, nên độ nổi tiếng của hôm qua phai đi và thứ hạng bám theo hiện tại.</span></div>
  <div class="lz-step"><span class="lz-k">Chọn LFU khi cái đuôi bị quét</span><span class="lz-t">bot thu thập, việc chạy lô, URL báo cáo một lần</span><span class="lz-d">LRU bị đánh lừa bởi một lượt quét toàn danh mục: nó đẩy đi những khoá thật sự nóng của bạn để lấy chỗ cho một triệu trang chỉ được chạm một lần. LFU thì không, vì những trang đó không bao giờ tích được tần suất. Đó là trường hợp mà việc chuyển đổi đáng tiền thật.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> chạy một máy Redis duy nhất cho bộ đệm <em>và</em> hàng đợi <em>và</em> phiên đăng nhập, với <code>allkeys-lru</code>. Đó là kiến trúc Redis phổ biến nhất trên đời và nó chứa một quả mìn: việc đẩy khoá không biết một cái khoá dùng để <em>làm gì</em>. Khi bộ nhớ đầy, <code>allkeys-lru</code> sẽ vui vẻ xoá một stream đang chứa những đơn hàng chưa xử lý (Bài 8.5), một phiên khiến người dùng bị đăng xuất, hay một cái khoá phân tán đang được giữ (Bài 7.5) — vì những khoá đó tình cờ đang nằm im, mà nằm im chính xác là dáng vẻ của một cái khoá và một việc đang chờ. Không có lỗi nào, không dòng nhật ký nào, và chẳng có gì nối những đơn hàng biến mất với áp lực bộ nhớ hai tiếng trước đó. Hai lối ra, và bạn muốn có một trong hai trước khi cần tới. <strong>Tách máy riêng</strong> là câu trả lời thành thật: một máy bộ đệm chạy <code>allkeys-lru</code> mà được <em>phép</em> mất dữ liệu, và một máy dữ liệu chạy <code>noeviction</code> mà thì không. <strong>Hoặc dùng <code>volatile-lru</code> kèm kỷ luật:</strong> mọi khoá bộ đệm đều có TTL, mọi thứ khác thì không, và khi ấy việc đẩy khoá chỉ chạm được vào những thứ vốn sinh ra để biến mất — nhưng cái kỷ luật ấy chỉ cách một lần quên <code>EX</code> là sụp, nên hãy thêm một phép kiểm cảnh báo khi một tiền tố không-phải-bộ-đệm bỗng có TTL hoặc một khoá bộ đệm bỗng mất TTL.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">🗑️</span>
  <span class="lc-body"><span class="lc-title">Key eviction</span><span class="lc-sub">Cả tám chính sách, các biểu đồ LRU xấp xỉ so sánh 5 mẫu với 10 mẫu và với LRU thật, cùng phần toán của bộ đếm LFU. Riêng mấy cái biểu đồ đã đáng ghé xem.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/object-freq/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">OBJECT FREQ và OBJECT IDLETIME</span><span class="lc-sub">Cách soi xem việc đẩy khoá đang nghĩ gì về một khoá cụ thể, mỗi lệnh cần chính sách nào, và bộ đếm logarit ánh xạ ra số lượt truy cập thật ra sao.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm đầy một máy rồi quan sát</span><span class="lc-sub">Bài chấm điểm: chạm trần dưới bốn chính sách rồi so xem cái gì sống sót, chứng minh <code>volatile-lru</code> cư xử như <code>noeviction</code> khi không có TTL, và chọn chính sách cho năm khối lượng việc khác nhau.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Mặc định <code>noeviction</code> làm hỏng các lệnh ghi trong khi các lệnh đọc vẫn chạy — đúng cho Redis-làm-cơ-sở-dữ-liệu và sai cho Redis-làm-bộ-đệm, và chính sự bất đối xứng ấy làm cho sự cố trở nên rối rắm. Mọi chính sách <code>volatile-*</code> âm thầm thoái hoá thành <code>noeviction</code> khi không khoá nào có TTL, nên một cấu hình "nhìn có vẻ an toàn" có thể hỏng cứng ngay lần đầu nó đầy. Và việc đẩy khoá không biết một khoá dùng để làm gì: trên một máy dùng chung, <code>allkeys-lru</code> sẽ xoá một cái khoá đang được giữ, một hàng đợi chưa xử lý hay một phiên đang sống dễ dàng như xoá một mục bộ đệm — hãy tách máy ra, hoặc bắt buộc chỉ khoá bộ đệm mới mang TTL rồi dùng <code>volatile-*</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — RDB: snapshots, fork and copy-on-write|||9.3 — RDB: ảnh chụp, fork và sao-chép-khi-ghi',
      slug: 'rd-9-3-rdb',
      type: 'LESSON',
      description: 'Các mốc save mặc định và bạn mất bao nhiêu, BGSAVE fork ra một tiến trình con và cái giá bộ nhớ thật của sao-chép-khi-ghi, latest_fork_usec, vm.overcommit_memory với huge page, và stop-writes-on-bgsave-error làm gì lúc 3 giờ sáng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>RDB: snapshots, fork and copy-on-write</h2>
<p class="lead">An RDB file is a point-in-time binary dump of the whole dataset. It is compact, it loads fast, it is what replication uses for a full sync — and it is produced by forking the process, which is the single operation most likely to take a Redis instance down.</p>

<h3>The default save points, and what they cost you</h3>
<pre><code>redis-cli CONFIG GET save
redis-cli CONFIG GET dir dbfilename rdbcompression rdbchecksum
redis-cli LASTSAVE
redis-cli BGSAVE
redis-cli INFO persistence | grep -E "rdb_bgsave_in_progress|rdb_last_bgsave_status|rdb_last_save_time|rdb_changes_since_last_save|rdb_last_bgsave_time_sec|latest_fork_usec"</code></pre>
<div class="out">1) "save"
2) "3600 1 300 100 60 10000"
1) "dir"
2) "/var/lib/redis"
3) "dbfilename"
4) "dump.rdb"
5) "rdbcompression"
6) "yes"
7) "rdbchecksum"
8) "yes"
(integer) 1755949100
Background saving started
rdb_bgsave_in_progress:0
rdb_last_bgsave_status:ok
rdb_last_save_time:1755949221
rdb_changes_since_last_save:0
rdb_last_bgsave_time_sec:2
latest_fork_usec:41882</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>save 3600 1 300 100 60 10000</code></span><span class="v">Three rules, any of which triggers a save: one change in an hour, 100 changes in five minutes, or 10,000 changes in one minute. Read it as "the busier it is, the more often it saves".</span></div>
  <div class="kv"><span class="k">What you lose is the window</span><span class="v">On a moderately busy instance the last rule dominates, so a crash loses up to a minute of writes. On a quiet one it can be five minutes or an hour. Say that number out loud before deciding RDB alone is enough.</span></div>
  <div class="kv"><span class="k"><code>SAVE</code> blocks; <code>BGSAVE</code> forks</span><span class="v">The synchronous <code>SAVE</code> writes the file in the main thread and stops the world for as long as it takes — seconds to minutes. There is no legitimate reason to run it on a live instance; it exists for shutdown paths and for when a fork is impossible.</span></div>
  <div class="kv"><span class="k"><code>rdb_changes_since_last_save</code></span><span class="v">Exactly how much is at risk right now. A number that never returns to zero means saves are failing or the write rate exceeds what the save points cover.</span></div>
  <div class="kv"><span class="k">RDB is also the replication mechanism</span><span class="v">A replica's first sync is an RDB transferred from the primary (Chapter 11). So even with <code>save ""</code> configured, a fork still happens whenever a replica connects — you have not escaped this lesson by disabling snapshots.</span></div>
</div>

<h3>The fork, and the memory it can cost</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork() duplicates the page table</span><span class="lz-t">not the memory — at first</span><span class="lz-d">The child sees an identical, frozen view of the dataset while sharing every physical page with the parent. The copy is cheap: <code>latest_fork_usec</code> above is 42 ms for a 1.2 GB instance, and it scales with the <em>page table</em>, roughly a millisecond per gigabyte.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The child writes the file at leisure</span><span class="lz-t">from its frozen snapshot</span><span class="lz-d">It walks the dataset, serialises it, writes to a temporary file, and renames it over <code>dump.rdb</code> at the end. The rename is atomic, so a crash mid-save never corrupts the previous good file.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Meanwhile the parent keeps serving</span><span class="lz-t">and every write triggers a page copy</span><span class="lz-d">This is copy-on-write. Each 4 KB page the parent modifies must be duplicated so the child still sees the old version. The extra memory is proportional to how much of the dataset changes <em>during the save</em>, not to its size.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The bill arrives on write-heavy instances</span><span class="lz-t">30–50% extra RSS, transient</span><span class="lz-d">A read-mostly instance costs almost nothing extra. One rewriting most of its keys during the save can approach doubling RSS. And the OOM killer, when it arrives, takes the parent — the largest process — not the child.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch copy-on-write cost in real time during a save</span>
redis-cli BGSAVE &gt;/dev/null
for i in 1 2 3 4; do
  redis-cli INFO memory | grep -E "^used_memory_human|^used_memory_rss_human" | paste - -
  sleep 1
done
redis-cli INFO persistence | grep -E "rdb_last_cow_size|aof_rewrite_in_progress"</code></pre>
<div class="out">used_memory_human:1.20G	used_memory_rss_human:1.61G
used_memory_human:1.20G	used_memory_rss_human:1.94G
used_memory_human:1.21G	used_memory_rss_human:2.28G
used_memory_human:1.21G	used_memory_rss_human:1.62G
rdb_last_cow_size:718274560
aof_rewrite_in_progress:0</div>
<div class="callout warn"><strong>RSS went from 1.61 GB to 2.28 GB and back — 718 MB of copy-on-write for a 1.2 GB dataset, during two seconds.</strong> Nothing in <code>used_memory</code> moved, because from Redis's point of view nothing was allocated: the kernel duplicated pages behind its back. This is why sizing an instance at 90% of machine RAM is a trap (Lesson 9.1). If the machine cannot supply that transient spike, the kernel's OOM killer picks the biggest process — the Redis parent — and your instance dies during a routine backup. <code>rdb_last_cow_size</code> is the number to watch; if it is a large fraction of your dataset, either lower the write rate during saves or accept that you need the headroom.</div>

<h3>Two host settings that are not optional</h3>
<pre><code>cat /proc/sys/vm/overcommit_memory
sudo sysctl vm.overcommit_memory=1
cat /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
redis-cli INFO stats | grep latest_fork_usec
grep -iE "overcommit|huge" /var/log/redis/redis-server.log | tail -2</code></pre>
<div class="out">0
vm.overcommit_memory = 1
[always] madvise never
never
latest_fork_usec:41882
# WARNING overcommit_memory is set to 0! Background save may fail under low memory condition.
# WARNING you have Transparent Huge Pages (THP) support enabled in your kernel.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>vm.overcommit_memory=1</code></span><span class="v">With the default <code>0</code>, the kernel heuristically refuses a fork that <em>might</em> need more memory than is free — even though copy-on-write means it almost certainly will not. The result is <code>BGSAVE</code> failing with "Cannot allocate memory" on an instance with plenty of RAM. Redis warns about this in its log at every startup.</span></div>
  <div class="kv"><span class="k">Transparent Huge Pages: <code>never</code></span><span class="v">THP makes copy-on-write copy 2 MB at a time instead of 4 KB — 512× the work per modified page. It turns a smooth save into latency spikes lasting hundreds of milliseconds. This is the single most common cause of "Redis is randomly slow" on a fresh Linux host.</span></div>
  <div class="kv"><span class="k">Make both persistent</span><span class="v"><code>/etc/sysctl.conf</code> for overcommit; a systemd unit or <code>/etc/rc.local</code> for THP, because the <code>/sys</code> write does not survive a reboot. Setting them once by hand and forgetting is how they come back six months later.</span></div>
  <div class="kv"><span class="k">In Docker, set them on the host</span><span class="v">Both are kernel-wide, not per-container. A containerised Redis inherits whatever the host has, and the warning in the log is telling you about the host, not the image (Chapter 10).</span></div>
  <div class="kv"><span class="k"><code>latest_fork_usec</code> is your fork health</span><span class="v">Roughly 1 ms per GB is normal. Tens of milliseconds per GB means THP or a memory-constrained host — and every one of those milliseconds is a full stall, because the fork happens in the main thread.</span></div>
</div>

<h3>When a save fails</h3>
<pre><code>redis-cli CONFIG GET stop-writes-on-bgsave-error
<span class="tok-comment"># Simulate: make the data directory unwritable</span>
sudo chmod 500 /var/lib/redis
redis-cli BGSAVE; sleep 1
redis-cli SET anything x
redis-cli INFO persistence | grep rdb_last_bgsave_status
sudo chmod 755 /var/lib/redis
redis-cli BGSAVE; sleep 1
redis-cli SET anything x</code></pre>
<div class="out">1) "stop-writes-on-bgsave-error"
2) "yes"
Background saving started
(error) MISCONF Redis is configured to save RDB snapshots, but it's currently unable to persist to disk. Commands that may modify the data set are disabled, because this instance is configured to report errors during writes if RDB snapshotting doesn't work (stop-writes-on-bgsave-error option). Please check the Redis logs for details about the RDB error.
rdb_last_bgsave_status:err
Background saving started
OK</div>
<div class="pitfall"><strong>Pitfall:</strong> meeting <code>MISCONF</code> at 3am and reaching for <code>stop-writes-on-bgsave-error no</code>. That setting exists so that a Redis which <em>cannot persist</em> stops pretending it can: rather than accepting writes it knows will vanish, it refuses them loudly. Turning it off makes the error disappear and the underlying problem — a full disk, a read-only mount, wrong ownership after a deploy, or a fork that could not allocate — carries on silently, and now every write is being accepted into memory with no durable copy behind it. The right sequence is: read the actual cause from the Redis log (it always logs the real error just above), check <code>df -h</code> on the <code>dir</code> path, check ownership, check <code>vm.overcommit_memory</code>, fix that, and confirm with a manual <code>BGSAVE</code> that <code>rdb_last_bgsave_status</code> returns to <code>ok</code> — at which point writes resume by themselves. The only defensible time to set it to <code>no</code> is on an instance that is deliberately a pure cache, where you have also set <code>save ""</code> and genuinely do not want persistence at all.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">The reference for RDB and AOF together: how snapshotting works, what fork costs, the durability trade-offs, and the backup section. Read it before choosing a posture (Lesson 9.5).</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Latency troubleshooting</span><span class="lc-sub">The fork and THP sections in particular, plus how to use <code>LATENCY LATEST</code> to prove a stall came from a save rather than a slow command.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: watch a fork</span><span class="lc-sub">Graded exercises: measure copy-on-write RSS during a save under read-heavy and write-heavy load, reproduce a <code>MISCONF</code> and diagnose it from the log, and compute how much data your save points put at risk.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> An RDB snapshot means you lose everything since the last one — read your <code>save</code> line and say the number out loud, because on a busy instance the default is up to a minute of writes. The fork itself is cheap but copy-on-write is not: RSS can rise 30–50% transiently during a save on a write-heavy instance, which is why <code>maxmemory</code> belongs at 60–70% of machine RAM and not 95%. And two host settings are mandatory rather than advisory — <code>vm.overcommit_memory=1</code> so the fork can happen at all, and Transparent Huge Pages set to <code>never</code> so copy-on-write copies 4 KB instead of 2 MB.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>RDB: ảnh chụp, fork và sao-chép-khi-ghi</h2>
<p class="lead">Một tệp RDB là bản đổ nhị phân của toàn bộ tập dữ liệu tại một thời điểm. Nó gọn, nó nạp nhanh, nó là thứ mà phép nhân bản dùng để đồng bộ đầy đủ — và nó được tạo ra bằng cách fork tiến trình, thao tác dễ hạ gục một máy Redis nhất.</p>

<h3>Các mốc save mặc định, và cái giá của chúng</h3>
<pre><code>redis-cli CONFIG GET save
redis-cli CONFIG GET dir dbfilename rdbcompression rdbchecksum
redis-cli LASTSAVE
redis-cli BGSAVE
redis-cli INFO persistence | grep -E "rdb_bgsave_in_progress|rdb_last_bgsave_status|rdb_last_save_time|rdb_changes_since_last_save|rdb_last_bgsave_time_sec|latest_fork_usec"</code></pre>
<div class="out">1) "save"
2) "3600 1 300 100 60 10000"
1) "dir"
2) "/var/lib/redis"
3) "dbfilename"
4) "dump.rdb"
5) "rdbcompression"
6) "yes"
7) "rdbchecksum"
8) "yes"
(integer) 1755949100
Background saving started
rdb_bgsave_in_progress:0
rdb_last_bgsave_status:ok
rdb_last_save_time:1755949221
rdb_changes_since_last_save:0
rdb_last_bgsave_time_sec:2
latest_fork_usec:41882</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>save 3600 1 300 100 60 10000</code></span><span class="v">Ba luật, chỉ cần một cái thoả là kích hoạt một lần lưu: một thay đổi trong một giờ, 100 thay đổi trong năm phút, hoặc 10.000 thay đổi trong một phút. Hãy đọc nó là "càng bận thì càng lưu thường xuyên".</span></div>
  <div class="kv"><span class="k">Thứ bạn mất chính là cái cửa sổ đó</span><span class="v">Trên một máy bận vừa phải thì luật cuối chiếm ưu thế, nên một cú sập làm mất tới một phút lượt ghi. Trên một máy vắng thì có thể là năm phút hoặc một giờ. Hãy nói con số đó thành lời trước khi kết luận rằng chỉ RDB là đủ.</span></div>
  <div class="kv"><span class="k"><code>SAVE</code> thì chặn; <code>BGSAVE</code> thì fork</span><span class="v">Lệnh <code>SAVE</code> đồng bộ ghi tệp ngay trong luồng chính và dừng cả thế giới đúng bằng thời gian nó cần — từ vài giây tới vài phút. Không có lý do chính đáng nào để chạy nó trên một máy đang sống; nó tồn tại cho các nhánh tắt máy và cho lúc không fork được.</span></div>
  <div class="kv"><span class="k"><code>rdb_changes_since_last_save</code></span><span class="v">Chính xác là lượng dữ liệu đang bị đặt cược ngay lúc này. Một con số không bao giờ về 0 nghĩa là các lần lưu đang thất bại hoặc tốc độ ghi vượt quá thứ mà các mốc save phủ được.</span></div>
  <div class="kv"><span class="k">RDB cũng là cơ chế nhân bản</span><span class="v">Lần đồng bộ đầu tiên của một bản sao là một tệp RDB truyền từ bản chính (Chương 11). Nên kể cả khi đã đặt <code>save ""</code>, một cú fork vẫn xảy ra mỗi lần có bản sao nối vào — bạn không thoát khỏi bài học này bằng cách tắt ảnh chụp đâu.</span></div>
</div>

<h3>Cú fork, và cái giá bộ nhớ nó gây ra</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · fork() nhân đôi bảng trang</span><span class="lz-t">không nhân đôi bộ nhớ — lúc đầu</span><span class="lz-d">Tiến trình con thấy một khung nhìn y hệt và đóng băng của tập dữ liệu, trong khi dùng chung mọi trang vật lý với tiến trình cha. Phép chép này rẻ: <code>latest_fork_usec</code> ở trên là 42 ms cho một máy 1,2 GB, và nó tăng theo <em>bảng trang</em>, cỡ một mili giây mỗi gigabyte.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tiến trình con ghi tệp một cách thong thả</span><span class="lz-t">từ cái ảnh chụp đã đóng băng của nó</span><span class="lz-d">Nó đi qua tập dữ liệu, tuần tự hoá, ghi ra một tệp tạm, rồi đổi tên đè lên <code>dump.rdb</code> ở cuối. Phép đổi tên là nguyên tử, nên một cú sập giữa chừng không bao giờ làm hỏng tệp tốt trước đó.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Trong lúc đó tiến trình cha vẫn phục vụ</span><span class="lz-t">và mỗi lượt ghi kích hoạt một lần chép trang</span><span class="lz-d">Đây là sao-chép-khi-ghi. Mỗi trang 4 KB mà tiến trình cha sửa đều phải được nhân đôi để tiến trình con vẫn thấy bản cũ. Phần bộ nhớ thêm tỉ lệ với lượng dữ liệu thay đổi <em>trong lúc lưu</em>, không tỉ lệ với kích thước tập dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Hoá đơn tới trên các máy nặng ghi</span><span class="lz-t">thêm 30–50% RSS, tạm thời</span><span class="lz-d">Một máy chủ yếu đọc thì gần như không tốn thêm gì. Một máy ghi lại phần lớn khoá của nó trong lúc lưu có thể tiệm cận gấp đôi RSS. Và kẻ giết-vì-hết-bộ-nhớ, khi tới, sẽ lấy mạng tiến trình cha — tiến trình lớn nhất — chứ không lấy mạng tiến trình con.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem cái giá sao-chép-khi-ghi theo thời gian thực trong lúc lưu</span>
redis-cli BGSAVE &gt;/dev/null
for i in 1 2 3 4; do
  redis-cli INFO memory | grep -E "^used_memory_human|^used_memory_rss_human" | paste - -
  sleep 1
done
redis-cli INFO persistence | grep -E "rdb_last_cow_size|aof_rewrite_in_progress"</code></pre>
<div class="out">used_memory_human:1.20G	used_memory_rss_human:1.61G
used_memory_human:1.20G	used_memory_rss_human:1.94G
used_memory_human:1.21G	used_memory_rss_human:2.28G
used_memory_human:1.21G	used_memory_rss_human:1.62G
rdb_last_cow_size:718274560
aof_rewrite_in_progress:0</div>
<div class="callout warn"><strong>RSS đi từ 1,61 GB lên 2,28 GB rồi quay lại — 718 MB sao-chép-khi-ghi cho một tập dữ liệu 1,2 GB, trong vòng hai giây.</strong> Không có gì trong <code>used_memory</code> nhúc nhích cả, vì đứng từ góc nhìn của Redis thì chẳng có gì được cấp phát: nhân đã nhân đôi các trang sau lưng nó. Đó là lý do chọn cỡ máy ở mức 90% RAM là một cái bẫy (Bài 9.1). Nếu cái máy không cấp nổi cái đỉnh tạm thời ấy thì kẻ giết-vì-hết-bộ-nhớ của nhân sẽ chọn tiến trình lớn nhất — tiến trình cha của Redis — và máy của bạn chết trong lúc đang sao lưu định kỳ. <code>rdb_last_cow_size</code> là con số cần theo dõi; nếu nó chiếm một phần lớn tập dữ liệu thì hoặc hãy giảm tốc độ ghi trong lúc lưu, hoặc chấp nhận rằng bạn cần chỗ trống ấy.</div>

<h3>Hai thiết lập của máy chủ, không phải tuỳ chọn</h3>
<pre><code>cat /proc/sys/vm/overcommit_memory
sudo sysctl vm.overcommit_memory=1
cat /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
redis-cli INFO stats | grep latest_fork_usec
grep -iE "overcommit|huge" /var/log/redis/redis-server.log | tail -2</code></pre>
<div class="out">0
vm.overcommit_memory = 1
[always] madvise never
never
latest_fork_usec:41882
# WARNING overcommit_memory is set to 0! Background save may fail under low memory condition.
# WARNING you have Transparent Huge Pages (THP) support enabled in your kernel.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>vm.overcommit_memory=1</code></span><span class="v">Với mặc định <code>0</code>, nhân dùng phép suy đoán để từ chối một cú fork <em>có thể</em> cần nhiều bộ nhớ hơn lượng đang rảnh — dù rằng sao-chép-khi-ghi nghĩa là gần như chắc chắn nó sẽ không cần. Kết quả là <code>BGSAVE</code> hỏng với lỗi "Cannot allocate memory" trên một máy còn thừa RAM. Redis cảnh báo chuyện này trong nhật ký ở mỗi lần khởi động.</span></div>
  <div class="kv"><span class="k">Transparent Huge Pages: <code>never</code></span><span class="v">THP khiến sao-chép-khi-ghi chép 2 MB một lần thay vì 4 KB — gấp 512 lần khối lượng việc cho mỗi trang bị sửa. Nó biến một lần lưu êm ả thành những đợt vọt độ trễ kéo dài hàng trăm mili giây. Đây là nguyên nhân phổ biến nhất của chuyện "Redis tự nhiên chậm" trên một máy Linux mới toanh.</span></div>
  <div class="kv"><span class="k">Hãy làm cho cả hai bền vững</span><span class="v"><code>/etc/sysctl.conf</code> cho overcommit; một unit systemd hoặc <code>/etc/rc.local</code> cho THP, vì lệnh ghi vào <code>/sys</code> không sống sót qua khởi động lại. Đặt tay một lần rồi quên là cách chúng quay về sau sáu tháng.</span></div>
  <div class="kv"><span class="k">Trong Docker, hãy đặt chúng trên máy chủ vật lý</span><span class="v">Cả hai đều ở phạm vi nhân, không theo từng container. Một Redis chạy trong container thừa hưởng bất cứ thứ gì máy chủ có, và cái cảnh báo trong nhật ký đang nói về máy chủ, không nói về cái ảnh (Chương 10).</span></div>
  <div class="kv"><span class="k"><code>latest_fork_usec</code> là sức khoẻ cú fork của bạn</span><span class="v">Cỡ 1 ms mỗi GB là bình thường. Vài chục mili giây mỗi GB nghĩa là có THP hoặc một máy chủ đang chật bộ nhớ — và mỗi mili giây trong đó là một cú khựng trọn vẹn, vì cú fork xảy ra trong luồng chính.</span></div>
</div>

<h3>Khi một lần lưu thất bại</h3>
<pre><code>redis-cli CONFIG GET stop-writes-on-bgsave-error
<span class="tok-comment"># Giả lập: làm cho thư mục dữ liệu không ghi được</span>
sudo chmod 500 /var/lib/redis
redis-cli BGSAVE; sleep 1
redis-cli SET anything x
redis-cli INFO persistence | grep rdb_last_bgsave_status
sudo chmod 755 /var/lib/redis
redis-cli BGSAVE; sleep 1
redis-cli SET anything x</code></pre>
<div class="out">1) "stop-writes-on-bgsave-error"
2) "yes"
Background saving started
(error) MISCONF Redis is configured to save RDB snapshots, but it's currently unable to persist to disk. Commands that may modify the data set are disabled, because this instance is configured to report errors during writes if RDB snapshotting doesn't work (stop-writes-on-bgsave-error option). Please check the Redis logs for details about the RDB error.
rdb_last_bgsave_status:err
Background saving started
OK</div>
<div class="pitfall"><strong>Cái bẫy:</strong> gặp <code>MISCONF</code> lúc 3 giờ sáng rồi với tay lấy <code>stop-writes-on-bgsave-error no</code>. Thiết lập đó tồn tại để một Redis <em>không lưu được</em> thôi giả vờ rằng nó lưu được: thay vì nhận những lượt ghi mà nó biết sẽ biến mất, nó từ chối một cách ồn ào. Tắt nó đi thì cái lỗi biến mất còn vấn đề nằm dưới — đĩa đầy, một điểm gắn chỉ-đọc, sai quyền sở hữu sau một lần deploy, hay một cú fork không cấp phát nổi — vẫn tiếp diễn âm thầm, và giờ mọi lượt ghi đang được nhận vào bộ nhớ mà không có bản bền vững nào đứng sau. Trình tự đúng là: đọc nguyên nhân thật từ nhật ký Redis (nó luôn ghi lỗi thật ngay phía trên), kiểm <code>df -h</code> trên đường dẫn <code>dir</code>, kiểm quyền sở hữu, kiểm <code>vm.overcommit_memory</code>, sửa cái đó, rồi xác nhận bằng một lệnh <code>BGSAVE</code> thủ công rằng <code>rdb_last_bgsave_status</code> đã về lại <code>ok</code> — tới lúc đó các lượt ghi tự động chạy lại. Thời điểm duy nhất bảo vệ được để đặt nó thành <code>no</code> là trên một máy cố ý làm bộ đệm thuần tuý, nơi bạn cũng đã đặt <code>save ""</code> và thật sự không muốn lưu lâu dài chút nào.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">Tài liệu tra cứu cho cả RDB lẫn AOF: cơ chế chụp ảnh, cú fork tốn gì, các đánh đổi về độ bền, và phần sao lưu. Hãy đọc trước khi chọn tư thế (Bài 9.5).</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Latency troubleshooting</span><span class="lc-sub">Đặc biệt là các mục về fork và THP, cộng cách dùng <code>LATENCY LATEST</code> để chứng minh một cú khựng đến từ một lần lưu chứ không từ một lệnh chậm.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: quan sát một cú fork</span><span class="lc-sub">Bài chấm điểm: đo RSS sao-chép-khi-ghi trong lúc lưu dưới tải nặng đọc và tải nặng ghi, tái hiện một lỗi <code>MISCONF</code> rồi chẩn đoán nó từ nhật ký, và tính xem các mốc save của bạn đang đặt cược bao nhiêu dữ liệu.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một ảnh chụp RDB nghĩa là bạn mất mọi thứ kể từ ảnh chụp trước — hãy đọc dòng <code>save</code> của bạn rồi nói con số đó thành lời, vì trên một máy bận thì mặc định là mất tới một phút lượt ghi. Bản thân cú fork thì rẻ nhưng sao-chép-khi-ghi thì không: RSS có thể tăng tạm thời 30–50% trong lúc lưu trên một máy nặng ghi, đó là lý do <code>maxmemory</code> nên nằm ở 60–70% RAM của máy chứ không phải 95%. Và hai thiết lập của máy chủ là bắt buộc chứ không phải khuyến nghị — <code>vm.overcommit_memory=1</code> để cú fork xảy ra được, và Transparent Huge Pages đặt thành <code>never</code> để sao-chép-khi-ghi chép 4 KB thay vì 2 MB.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — AOF: the log of every write|||9.4 — AOF: cuốn nhật ký mọi lượt ghi',
      slug: 'rd-9-4-aof',
      type: 'LESSON',
      description: 'appendfsync always với everysec với no và bạn thật sự mất bao nhiêu ở mỗi mức, việc ghi lại AOF cùng cú fork thứ hai, AOF nhiều phần của bản 7.0 với tệp kê khai, nạp lại chậm hơn RDB bao nhiêu, và redis-check-aof.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>AOF: the log of every write</h2>
<p class="lead">Where RDB takes a photograph every few minutes, AOF writes down every command that modified the dataset, in order, as it happens. Replaying that log rebuilds the data exactly. The interesting question is not whether it is more durable — it obviously is — but how much you pay for each additional nine.</p>

<h3>Turning it on and looking inside</h3>
<pre><code>redis-cli CONFIG SET appendonly yes
redis-cli CONFIG GET appendfsync appenddirname auto-aof-rewrite-percentage auto-aof-rewrite-min-size
redis-cli SET user:1 alice &gt;/dev/null
redis-cli INCR counter &gt;/dev/null
redis-cli EXPIRE user:1 60 &gt;/dev/null
ls -la /var/lib/redis/appendonlydir/
cat /var/lib/redis/appendonlydir/appendonly.aof.manifest
tail -c 200 /var/lib/redis/appendonlydir/*.incr.aof | tr '\\r' ' '</code></pre>
<div class="out">OK
1) "appendfsync"
2) "everysec"
3) "appenddirname"
4) "appendonlydir"
5) "auto-aof-rewrite-percentage"
6) "100"
7) "auto-aof-rewrite-min-size"
8) "67108864"
total 1244
-rw-r--r-- 1 redis redis 1264902 appendonly.aof.1.base.rdb
-rw-r--r-- 1 redis redis     198 appendonly.aof.1.incr.aof
-rw-r--r-- 1 redis redis      88 appendonly.aof.manifest
file appendonly.aof.1.base.rdb seq 1 type b
file appendonly.aof.1.incr.aof seq 1 type i
*3
 $3
 SET
 $6
 user:1
 $5
 alice
 *2
 $4
 INCR
 $7
 counter
 *3
 $9
 PEXPIREAT
 $6
 user:1
 $13
 1755949281000</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The log is RESP, the same protocol as the wire</span><span class="lz-lnote">Each entry is the command exactly as a client would send it (Lesson 1.3), which makes an AOF file human-readable with <code>cat</code> and recoverable by hand in an emergency. It is the most debuggable persistence format of any database you will use.</span></div>
  <div class="lz-layer"><span class="lz-lname">Commands are rewritten to be deterministic</span><span class="lz-lnote">Look at the third entry: <code>EXPIRE user:1 60</code> was written as <code>PEXPIREAT user:1 1755949281000</code>. Relative times, <code>SPOP</code>, <code>INCRBYFLOAT</code> and anything random are converted to their absolute, concrete effect — otherwise replaying the log a day later would produce different data.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis 7.0 split it into multiple files</span><span class="lz-lnote">An <code>appendonlydir/</code> containing a <em>base</em> file (an RDB snapshot), one or more <em>incr</em> files (the RESP log since that base), and a <em>manifest</em> listing them. Before 7.0 this was one file with an RDB preamble glued to the front; the split makes rewrites simpler and safer.</span></div>
</div>

<h3>appendfsync: the only setting that matters</h3>
<pre><code>redis-benchmark -t set -n 100000 -q                    <span class="tok-comment"># appendfsync everysec</span>
redis-cli CONFIG SET appendfsync always &gt;/dev/null
redis-benchmark -t set -n 100000 -q
redis-cli CONFIG SET appendfsync no &gt;/dev/null
redis-benchmark -t set -n 100000 -q
redis-cli CONFIG SET appendfsync everysec &gt;/dev/null</code></pre>
<div class="out">SET: 98716.68 requests per second, p50=0.263 msec
SET: 6204.13 requests per second, p50=4.119 msec
SET: 102249.49 requests per second, p50=0.255 msec</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>everysec</code> — the default, and the answer</span><span class="v">The AOF buffer is flushed to the OS on every write and <code>fsync</code>ed once a second by a background thread. You lose at most one second of writes on a hard crash, at essentially no throughput cost. This is where virtually everyone should be.</span></div>
  <div class="kv"><span class="k"><code>always</code> — 16× slower here</span><span class="v">An <code>fsync</code> per write command, so durability is per-command. 98,000 ops/s became 6,200. On NVMe it is less brutal than on spinning disks, but it is always the dominant cost, and p50 latency went from 0.26 ms to 4.1 ms.</span></div>
  <div class="kv"><span class="k"><code>no</code> — let the OS decide</span><span class="v">Redis never calls <code>fsync</code>; the kernel flushes on its own schedule, typically every 30 seconds. Same speed as <code>everysec</code> in practice, and you can lose half a minute. There is almost no situation where this beats <code>everysec</code>.</span></div>
  <div class="kv"><span class="k">"One second" assumes the disk keeps up</span><span class="v">If an <code>fsync</code> takes longer than a second — a busy disk, a network volume, a noisy neighbour — the next write blocks waiting for it. <code>aof_delayed_fsync</code> in <code>INFO persistence</code> counts exactly this, and a rising number means your disk, not Redis, is the problem.</span></div>
  <div class="kv"><span class="k">A crash is not the only failure</span><span class="v"><code>everysec</code> protects against a process crash and a kernel panic. It does not protect against a disk that lies about <code>fsync</code>, a cloud volume detaching, or a datacentre losing power without battery-backed cache. Durability is a chain, and Redis is one link.</span></div>
</div>

<h3>Rewriting: keeping the log from growing forever</h3>
<pre><code>redis-cli INFO persistence | grep -E "aof_enabled|aof_rewrite_in_progress|aof_last_rewrite_time_sec|aof_current_size|aof_base_size|aof_last_bgrewrite_status|aof_pending_rewrite"
redis-cli BGREWRITEAOF
sleep 3
redis-cli INFO persistence | grep -E "aof_current_size|aof_base_size|aof_last_bgrewrite_status"
ls /var/lib/redis/appendonlydir/</code></pre>
<div class="out">aof_enabled:1
aof_rewrite_in_progress:0
aof_last_rewrite_time_sec:2
aof_current_size:184203912
aof_base_size:91204118
aof_last_bgrewrite_status:ok
aof_pending_rewrite:0
Background append only file rewriting started
aof_current_size:92118004
aof_base_size:92117992
aof_last_bgrewrite_status:ok
appendonly.aof.2.base.rdb
appendonly.aof.2.incr.aof
appendonly.aof.manifest</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Why it is needed</span><span class="lz-t">a counter incremented a million times is a million lines</span><span class="lz-d">The log records commands, not state, so <code>INCR views:1</code> called a million times occupies a million entries to describe one integer. Without rewriting, the AOF grows without bound and startup time grows with it.</span></div>
  <div class="lz-step"><span class="lz-k">A rewrite is a second fork</span><span class="lz-t">with the same copy-on-write bill as a save</span><span class="lz-d">The child writes a fresh base file from its frozen snapshot while the parent keeps appending new commands to a new incr file. Everything in Lesson 9.3 about fork cost, THP and overcommit applies identically here.</span></div>
  <div class="lz-step"><span class="lz-k">It triggers automatically</span><span class="lz-t">100% growth, minimum 64 MB</span><span class="lz-d"><code>auto-aof-rewrite-percentage 100</code> means "rewrite when the file has doubled since the last rewrite", floored at <code>auto-aof-rewrite-min-size</code> so a tiny instance is not rewriting constantly. Above it shrank 184 MB back to 92 MB.</span></div>
  <div class="lz-step"><span class="lz-k">Never two forks at once</span><span class="lz-t">aof_pending_rewrite</span><span class="lz-d">If an RDB save is running when a rewrite is due, Redis defers the rewrite rather than forking twice — two children copying pages simultaneously is how a memory spike becomes an OOM kill.</span></div>
</div>

<h3>Startup: the cost you only notice during an incident</h3>
<pre><code>redis-cli DEBUG SLEEP 0 &gt;/dev/null
sudo systemctl restart redis-server
time redis-cli --no-raw PING
redis-cli INFO persistence | grep -E "loading:|async_loading"
grep -iE "DB loaded|Reading RDB|DB saved" /var/log/redis/redis-server.log | tail -3</code></pre>
<div class="out">PONG
real	0m9.284s
loading:0
async_loading:0
* DB loaded from base file appendonly.aof.2.base.rdb: 1.204 seconds
* DB loaded from incr file appendonly.aof.2.incr.aof: 8.011 seconds
* DB loaded from append only file: 9.215 seconds</div>
<div class="callout warn"><strong>Nine seconds to start, and eight of them were replaying the incr file.</strong> Loading an RDB is deserialising a compact binary format; loading an AOF is <em>executing</em> every command again through the normal command path. The base file — which is an RDB — took 1.2 seconds for the same data that the command log took 8 seconds to replay. That gap is why the multi-part format of Redis 7.0 matters, and why a recently-rewritten AOF starts far faster than one that has been accumulating for a week. During a restart Redis answers <code>-LOADING</code> to everything, so this is downtime: measure it on your real dataset, keep <code>auto-aof-rewrite-percentage</code> at the default so the incr file stays small, and remember the number when planning a failover (Chapter 11).</div>

<div class="pitfall"><strong>Pitfall:</strong> assuming an AOF that exists is an AOF that works. Three ways it can be there and be useless. <strong>It was never enabled.</strong> <code>appendonly no</code> is the default on most distributions, so an instance you inherited may have RDB only, and the <code>appendonlydir</code> you are looking at could be from a previous configuration — check <code>aof_enabled:1</code>, not the filesystem. <strong>It is truncated.</strong> A crash mid-write can leave a partial final command; by default <code>aof-load-truncated yes</code> lets Redis start anyway with a warning, which is usually right, but if the file is corrupted rather than truncated Redis refuses to start and you need <code>redis-check-aof --fix</code> — a command that <em>discards</em> everything after the corruption, so take a copy of the directory first. <strong>Nobody ever restored from it.</strong> An AOF that has never been loaded on a different machine is a backup you are hoping works. The only test that counts is the real one: copy <code>appendonlydir/</code> (or <code>dump.rdb</code>) to a second host, start Redis pointing at it, and compare <code>DBSIZE</code> and a few known keys. Do that on a schedule, write down how long it took, and you have a recovery time you can actually promise.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#append-only-file" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The append-only file</span><span class="lc-sub">The AOF half of the persistence page: the three <code>appendfsync</code> modes with their guarantees, how rewriting works, the multi-part format, and the truncated-vs-corrupted recovery procedures.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/bgrewriteaof/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">BGREWRITEAOF</span><span class="lc-sub">When it defers, what happens if a save is already running, and how the automatic triggers interact with a manual call.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: measure your durability</span><span class="lc-sub">Graded exercises: benchmark all three <code>appendfsync</code> modes, read raw RESP out of an incr file, force a rewrite and measure the shrink, and time a restart before and after.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>appendfsync everysec</code> is the answer for almost everyone: at most one second lost on a crash, at essentially no throughput cost, while <code>always</code> was 16× slower in the measurement above. An AOF grows without bound because it records commands rather than state, so rewriting is mandatory — and a rewrite is a second fork with the same copy-on-write bill as a snapshot. And loading an AOF means re-executing every command, which took 8 seconds against 1.2 for the equivalent RDB base file: that difference is your restart downtime, so measure it on real data and keep the incr file small.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>AOF: cuốn nhật ký mọi lượt ghi</h2>
<p class="lead">Trong khi RDB chụp một tấm ảnh vài phút một lần, AOF ghi lại mọi lệnh đã làm thay đổi tập dữ liệu, đúng thứ tự, ngay khi nó xảy ra. Phát lại cuốn nhật ký đó là dựng lại dữ liệu y hệt. Câu hỏi thú vị không phải là nó có bền hơn không — hiển nhiên là có — mà là bạn trả bao nhiêu cho từng số 9 thêm vào.</p>

<h3>Bật nó lên và nhìn vào bên trong</h3>
<pre><code>redis-cli CONFIG SET appendonly yes
redis-cli CONFIG GET appendfsync appenddirname auto-aof-rewrite-percentage auto-aof-rewrite-min-size
redis-cli SET user:1 alice &gt;/dev/null
redis-cli INCR counter &gt;/dev/null
redis-cli EXPIRE user:1 60 &gt;/dev/null
ls -la /var/lib/redis/appendonlydir/
cat /var/lib/redis/appendonlydir/appendonly.aof.manifest
tail -c 200 /var/lib/redis/appendonlydir/*.incr.aof | tr '\\r' ' '</code></pre>
<div class="out">OK
1) "appendfsync"
2) "everysec"
3) "appenddirname"
4) "appendonlydir"
5) "auto-aof-rewrite-percentage"
6) "100"
7) "auto-aof-rewrite-min-size"
8) "67108864"
total 1244
-rw-r--r-- 1 redis redis 1264902 appendonly.aof.1.base.rdb
-rw-r--r-- 1 redis redis     198 appendonly.aof.1.incr.aof
-rw-r--r-- 1 redis redis      88 appendonly.aof.manifest
file appendonly.aof.1.base.rdb seq 1 type b
file appendonly.aof.1.incr.aof seq 1 type i
*3
 $3
 SET
 $6
 user:1
 $5
 alice
 *2
 $4
 INCR
 $7
 counter
 *3
 $9
 PEXPIREAT
 $6
 user:1
 $13
 1755949281000</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cuốn nhật ký là RESP, cùng giao thức với đường truyền</span><span class="lz-lnote">Mỗi mục là cái lệnh y hệt như một khách sẽ gửi lên (Bài 1.3), điều đó khiến một tệp AOF đọc được bằng mắt với <code>cat</code> và cứu chữa được bằng tay lúc khẩn cấp. Nó là định dạng lưu lâu dài dễ gỡ lỗi nhất trong các cơ sở dữ liệu bạn sẽ dùng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các lệnh được viết lại cho tất định</span><span class="lz-lnote">Hãy nhìn mục thứ ba: <code>EXPIRE user:1 60</code> được ghi thành <code>PEXPIREAT user:1 1755949281000</code>. Thời gian tương đối, <code>SPOP</code>, <code>INCRBYFLOAT</code> và mọi thứ ngẫu nhiên đều bị chuyển thành hiệu ứng tuyệt đối, cụ thể của chúng — nếu không thì phát lại cuốn nhật ký một ngày sau sẽ ra dữ liệu khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis 7.0 tách nó thành nhiều tệp</span><span class="lz-lnote">Một thư mục <code>appendonlydir/</code> chứa một tệp <em>base</em> (một ảnh chụp RDB), một hoặc nhiều tệp <em>incr</em> (cuốn nhật ký RESP kể từ cái base ấy), và một tệp <em>kê khai</em> liệt kê chúng. Trước 7.0 thì đây là một tệp duy nhất với phần mở đầu RDB dán ở đầu; việc tách ra làm cho các lần ghi lại đơn giản và an toàn hơn.</span></div>
</div>

<h3>appendfsync: thiết lập duy nhất thật sự quan trọng</h3>
<pre><code>redis-benchmark -t set -n 100000 -q                    <span class="tok-comment"># appendfsync everysec</span>
redis-cli CONFIG SET appendfsync always &gt;/dev/null
redis-benchmark -t set -n 100000 -q
redis-cli CONFIG SET appendfsync no &gt;/dev/null
redis-benchmark -t set -n 100000 -q
redis-cli CONFIG SET appendfsync everysec &gt;/dev/null</code></pre>
<div class="out">SET: 98716.68 requests per second, p50=0.263 msec
SET: 6204.13 requests per second, p50=4.119 msec
SET: 102249.49 requests per second, p50=0.255 msec</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>everysec</code> — mặc định, và là đáp án</span><span class="v">Bộ đệm AOF được đẩy xuống hệ điều hành ở mỗi lượt ghi và được <code>fsync</code> mỗi giây một lần bởi một luồng nền. Bạn mất nhiều nhất một giây lượt ghi khi sập cứng, với chi phí thông lượng gần như bằng 0. Đây là chỗ mà gần như tất cả mọi người nên đứng.</span></div>
  <div class="kv"><span class="k"><code>always</code> — chậm hơn 16 lần ở đây</span><span class="v">Một lệnh <code>fsync</code> cho mỗi lệnh ghi, nên độ bền tính theo từng lệnh. 98.000 phép/giây thành 6.200. Trên NVMe thì đỡ tàn khốc hơn trên đĩa quay, nhưng nó luôn là chi phí chi phối, và độ trễ p50 đi từ 0,26 ms lên 4,1 ms.</span></div>
  <div class="kv"><span class="k"><code>no</code> — để hệ điều hành quyết</span><span class="v">Redis không bao giờ gọi <code>fsync</code>; nhân tự đẩy theo lịch của nó, thường là 30 giây một lần. Thực tế nhanh ngang <code>everysec</code>, và bạn có thể mất nửa phút. Gần như không có tình huống nào mà cái này thắng <code>everysec</code>.</span></div>
  <div class="kv"><span class="k">"Một giây" giả định cái đĩa theo kịp</span><span class="v">Nếu một lệnh <code>fsync</code> mất hơn một giây — đĩa bận, một ổ đĩa qua mạng, một hàng xóm ồn ào — thì lượt ghi kế tiếp bị chặn để chờ nó. <code>aof_delayed_fsync</code> trong <code>INFO persistence</code> đếm đúng chuyện đó, và một con số tăng dần nghĩa là cái đĩa của bạn mới là vấn đề, không phải Redis.</span></div>
  <div class="kv"><span class="k">Sập máy không phải kiểu hỏng duy nhất</span><span class="v"><code>everysec</code> bảo vệ trước một cú sập tiến trình và một cú hoảng loạn của nhân. Nó không bảo vệ trước một cái đĩa nói dối về <code>fsync</code>, một ổ đĩa đám mây tự tháo ra, hay một trung tâm dữ liệu mất điện mà không có cache đệm pin. Độ bền là một sợi xích, và Redis chỉ là một mắt.</span></div>
</div>

<h3>Ghi lại: giữ cho cuốn nhật ký khỏi phình mãi</h3>
<pre><code>redis-cli INFO persistence | grep -E "aof_enabled|aof_rewrite_in_progress|aof_last_rewrite_time_sec|aof_current_size|aof_base_size|aof_last_bgrewrite_status|aof_pending_rewrite"
redis-cli BGREWRITEAOF
sleep 3
redis-cli INFO persistence | grep -E "aof_current_size|aof_base_size|aof_last_bgrewrite_status"
ls /var/lib/redis/appendonlydir/</code></pre>
<div class="out">aof_enabled:1
aof_rewrite_in_progress:0
aof_last_rewrite_time_sec:2
aof_current_size:184203912
aof_base_size:91204118
aof_last_bgrewrite_status:ok
aof_pending_rewrite:0
Background append only file rewriting started
aof_current_size:92118004
aof_base_size:92117992
aof_last_bgrewrite_status:ok
appendonly.aof.2.base.rdb
appendonly.aof.2.incr.aof
appendonly.aof.manifest</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vì sao cần nó</span><span class="lz-t">một bộ đếm tăng một triệu lần là một triệu dòng</span><span class="lz-d">Cuốn nhật ký ghi lệnh chứ không ghi trạng thái, nên <code>INCR views:1</code> gọi một triệu lần chiếm một triệu mục để mô tả đúng một số nguyên. Không ghi lại thì AOF phình vô hạn và thời gian khởi động phình theo.</span></div>
  <div class="lz-step"><span class="lz-k">Một lần ghi lại là một cú fork thứ hai</span><span class="lz-t">với đúng hoá đơn sao-chép-khi-ghi như một lần lưu</span><span class="lz-d">Tiến trình con ghi một tệp base mới từ ảnh chụp đóng băng của nó trong khi tiến trình cha vẫn nối thêm lệnh mới vào một tệp incr mới. Mọi thứ ở Bài 9.3 về chi phí fork, THP và overcommit áp vào đây y hệt.</span></div>
  <div class="lz-step"><span class="lz-k">Nó tự kích hoạt</span><span class="lz-t">tăng 100%, tối thiểu 64 MB</span><span class="lz-d"><code>auto-aof-rewrite-percentage 100</code> nghĩa là "ghi lại khi tệp đã tăng gấp đôi kể từ lần ghi lại trước", có sàn là <code>auto-aof-rewrite-min-size</code> để một máy tí hon không phải ghi lại liên tục. Ở trên nó co từ 184 MB về 92 MB.</span></div>
  <div class="lz-step"><span class="lz-k">Không bao giờ hai cú fork cùng lúc</span><span class="lz-t">aof_pending_rewrite</span><span class="lz-d">Nếu một lần lưu RDB đang chạy khi tới hạn ghi lại, Redis hoãn việc ghi lại thay vì fork hai lần — hai tiến trình con cùng chép trang một lúc chính là cách một đợt vọt bộ nhớ biến thành một cú giết-vì-hết-bộ-nhớ.</span></div>
</div>

<h3>Khởi động: cái giá bạn chỉ để ý tới lúc có sự cố</h3>
<pre><code>redis-cli DEBUG SLEEP 0 &gt;/dev/null
sudo systemctl restart redis-server
time redis-cli --no-raw PING
redis-cli INFO persistence | grep -E "loading:|async_loading"
grep -iE "DB loaded|Reading RDB|DB saved" /var/log/redis/redis-server.log | tail -3</code></pre>
<div class="out">PONG
real	0m9.284s
loading:0
async_loading:0
* DB loaded from base file appendonly.aof.2.base.rdb: 1.204 seconds
* DB loaded from incr file appendonly.aof.2.incr.aof: 8.011 seconds
* DB loaded from append only file: 9.215 seconds</div>
<div class="callout warn"><strong>Chín giây để khởi động, và tám giây trong đó là phát lại tệp incr.</strong> Nạp một tệp RDB là giải mã một định dạng nhị phân gọn gàng; nạp một AOF là <em>thực thi</em> lại từng lệnh qua đúng nhánh xử lý lệnh bình thường. Tệp base — vốn là một RDB — mất 1,2 giây cho cùng lượng dữ liệu mà cuốn nhật ký lệnh phải mất 8 giây để phát lại. Chính khoảng cách đó là lý do định dạng nhiều phần của Redis 7.0 quan trọng, và là lý do một AOF vừa được ghi lại khởi động nhanh hơn hẳn một AOF đã tích luỹ cả tuần. Trong lúc khởi động lại thì Redis trả <code>-LOADING</code> cho mọi thứ, nên đây là thời gian chết: hãy đo nó trên tập dữ liệu thật của bạn, giữ <code>auto-aof-rewrite-percentage</code> ở mặc định để tệp incr luôn nhỏ, và hãy nhớ con số ấy khi lên kế hoạch chuyển đổi (Chương 11).</div>

<div class="pitfall"><strong>Cái bẫy:</strong> tưởng rằng một AOF đang tồn tại là một AOF chạy được. Có ba cách nó vừa ở đó vừa vô dụng. <strong>Nó chưa từng được bật.</strong> <code>appendonly no</code> là mặc định trên phần lớn bản phân phối, nên một máy bạn thừa kế lại có thể chỉ có RDB, và cái <code>appendonlydir</code> bạn đang nhìn có thể là dấu tích của một cấu hình cũ — hãy kiểm <code>aof_enabled:1</code>, đừng kiểm hệ tệp. <strong>Nó bị cắt cụt.</strong> Một cú sập giữa lượt ghi có thể để lại một lệnh cuối dở dang; mặc định <code>aof-load-truncated yes</code> cho Redis khởi động lên kèm một cảnh báo, và thường thì đúng, nhưng nếu tệp bị hỏng chứ không phải bị cắt cụt thì Redis từ chối khởi động và bạn cần <code>redis-check-aof --fix</code> — một lệnh <em>vứt bỏ</em> mọi thứ nằm sau chỗ hỏng, nên hãy chép cả thư mục ra trước đã. <strong>Chưa bao giờ có ai khôi phục từ nó.</strong> Một AOF chưa từng được nạp trên một máy khác là một bản sao lưu mà bạn đang hy vọng nó chạy. Phép thử duy nhất có giá trị là phép thử thật: chép <code>appendonlydir/</code> (hoặc <code>dump.rdb</code>) sang một máy thứ hai, khởi động Redis trỏ vào đó, rồi so <code>DBSIZE</code> cùng vài cái khoá đã biết. Hãy làm việc đó theo lịch, ghi lại nó mất bao lâu, và bạn có một thời gian khôi phục mà bạn thật sự hứa được.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#append-only-file" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The append-only file</span><span class="lc-sub">Nửa AOF của trang lưu lâu dài: ba chế độ <code>appendfsync</code> cùng bảo đảm của chúng, cơ chế ghi lại, định dạng nhiều phần, và quy trình cứu chữa cho trường hợp cắt cụt với trường hợp hỏng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/bgrewriteaof/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">BGREWRITEAOF</span><span class="lc-sub">Khi nào nó hoãn lại, chuyện gì xảy ra nếu đang có một lần lưu chạy dở, và các phép kích hoạt tự động tương tác thế nào với một lời gọi thủ công.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đo độ bền của chính bạn</span><span class="lc-sub">Bài chấm điểm: đo hiệu năng cả ba chế độ <code>appendfsync</code>, đọc RESP thô từ một tệp incr, ép một lần ghi lại rồi đo mức co lại, và bấm giờ một lần khởi động lại trước và sau đó.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>appendfsync everysec</code> là đáp án cho gần như tất cả mọi người: mất nhiều nhất một giây khi sập, với chi phí thông lượng gần như bằng 0, trong khi <code>always</code> chậm hơn 16 lần trong phép đo ở trên. Một AOF phình vô hạn vì nó ghi lệnh chứ không ghi trạng thái, nên việc ghi lại là bắt buộc — và một lần ghi lại là một cú fork thứ hai với đúng hoá đơn sao-chép-khi-ghi như một lần chụp ảnh. Và nạp một AOF nghĩa là thực thi lại từng lệnh, mất 8 giây so với 1,2 giây của tệp base RDB tương đương: khoảng chênh đó chính là thời gian chết lúc khởi động lại của bạn, nên hãy đo nó trên dữ liệu thật và giữ tệp incr luôn nhỏ.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Choosing a durability posture, and restoring|||9.5 — Chọn tư thế bền vững, và khôi phục',
      slug: 'rd-9-5-tu-the-ben',
      type: 'LESSON',
      description: 'Bốn tư thế kèm con số RPO thật, vì sao bật cả AOF lẫn RDB là mặc định đúng, quy trình sao lưu và khôi phục viết ra từng bước, và câu trả lời thành thật cho "Redis làm cơ sở dữ liệu chính được không".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Choosing a durability posture, and restoring</h2>
<p class="lead">Persistence is not a switch, it is a budget. You are buying a maximum amount of data loss (RPO) and a maximum time to come back (RTO), and paying in throughput, memory headroom and operational work. Here are the four postures with their real numbers.</p>

<h3>Four postures</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · No persistence — <code>save ""</code>, <code>appendonly no</code></span><span class="lz-lnote"><strong>RPO: everything. RTO: instant.</strong> A restart comes back empty and warms up from the source of truth. The right choice for a pure cache, and it removes fork spikes, disk I/O and every failure mode in Lessons 9.3–9.4 at once. Say out loud "an empty Redis is fine" before choosing it — that sentence is false more often than people expect.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · RDB only — the default</span><span class="lz-lnote"><strong>RPO: up to your save window (often 60s). RTO: fast.</strong> Compact files, quick loading, ideal for backups and replication. Acceptable when losing a minute of writes is genuinely survivable — analytics counters, derived data, a cache you would rather not rebuild from cold.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · AOF only — <code>appendonly yes</code>, <code>save ""</code></span><span class="lz-lnote"><strong>RPO: ≤1 second. RTO: slow.</strong> Strong durability, and startup replays the log (9 seconds in Lesson 9.4). The catch: a replica's full sync still forks an RDB, and you have no compact file to hand to a backup job — so this posture is rarer in practice than it sounds.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Both — <code>appendonly yes</code> and save points on</span><span class="lz-lnote"><strong>RPO: ≤1 second. RTO: fast-ish.</strong> On startup Redis prefers the AOF, so the AOF provides durability while the RDB gives you cheap backups and fast replica syncs. This is the correct default for any Redis holding data you cannot rebuild, and the extra cost over posture 3 is one periodic fork.</span></div>
</div>
<pre><code><span class="tok-comment"># Posture 4, written out</span>
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG SET appendfsync everysec
redis-cli CONFIG SET save "900 1 300 100 60 10000"
redis-cli CONFIG SET stop-writes-on-bgsave-error yes
redis-cli CONFIG SET maxmemory-policy noeviction
redis-cli CONFIG REWRITE                     <span class="tok-comment"># ← persist to redis.conf, or it is lost on restart</span>
redis-cli INFO persistence | grep -E "^aof_enabled|^rdb_last_bgsave_status|^aof_last_write_status"</code></pre>
<div class="out">OK
OK
OK
OK
OK
OK
aof_enabled:1
rdb_last_bgsave_status:ok
aof_last_write_status:ok</div>
<div class="callout warn"><strong><code>CONFIG SET</code> changes the running server and nothing else.</strong> Every setting above reverts on the next restart unless you either edit <code>redis.conf</code> or run <code>CONFIG REWRITE</code>, which writes the live configuration back into the file Redis was started with. This is how an instance ends up "configured" with AOF for eight months and then comes back from a reboot with <code>appendonly no</code> and an empty <code>appendonlydir</code>. If Redis was started without a config file, <code>CONFIG REWRITE</code> fails — and that is worth knowing before you rely on it.</div>

<h3>Backing up</h3>
<pre><code><span class="tok-comment"># 1 · Ask for a fresh snapshot and wait for it to finish</span>
BEFORE=$(redis-cli LASTSAVE)
redis-cli BGSAVE
while [ "$(redis-cli LASTSAVE)" = "$BEFORE" ]; do sleep 1; done
redis-cli INFO persistence | grep rdb_last_bgsave_status

<span class="tok-comment"># 2 · Copy the file — the rename at the end makes this safe</span>
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%F-%H%M).rdb

<span class="tok-comment"># 3 · Verify the copy is loadable BEFORE trusting it</span>
redis-check-rdb /backup/dump-$(date +%F-%H%M).rdb | tail -3</code></pre>
<div class="out">Background saving started
rdb_last_bgsave_status:ok
[offset 0] Checking RDB file dump-2026-08-23-1420.rdb
[offset 1264902] Checksum OK
[offset 1264902] \\o/ RDB looks OK! \\o/</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Poll <code>LASTSAVE</code>, do not sleep</span><span class="v"><code>BGSAVE</code> returns immediately; the file is not ready until <code>LASTSAVE</code> changes. A backup script that sleeps five seconds and copies will one day copy a half-written file on a bigger dataset.</span></div>
  <div class="kv"><span class="k">Copying <code>dump.rdb</code> is safe</span><span class="v">The child writes a temp file and renames it, so the file you copy is always a complete previous snapshot. Copying <code>appendonlydir/</code> live is <em>not</em> equally safe — the incr file is being appended to, so take the manifest and files together and accept that the tail may be truncated (which <code>aof-load-truncated</code> handles).</span></div>
  <div class="kv"><span class="k">Back up from a replica</span><span class="v">A replica can fork and write files without adding latency or copy-on-write pressure to the instance serving traffic (Chapter 11). If you have one, this is where backups belong.</span></div>
  <div class="kv"><span class="k">Verify every backup automatically</span><span class="v"><code>redis-check-rdb</code> is one command and it catches a truncated or corrupt file at backup time rather than at restore time. Put it in the script; a backup you have not verified is a hope.</span></div>
  <div class="kv"><span class="k">Keep them somewhere else</span><span class="v">An RDB next to the instance protects against a bad <code>FLUSHALL</code> and nothing else. Off-host, and ideally off-account, or the same event that takes the machine takes the backups.</span></div>
</div>

<h3>Restoring, step by step</h3>
<pre><code><span class="tok-comment"># 1 · Stop Redis. A running server will overwrite the file you are placing.</span>
sudo systemctl stop redis-server

<span class="tok-comment"># 2 · Put the file where &#96;dir&#96; + &#96;dbfilename&#96; say, with the right owner</span>
sudo cp /backup/dump-2026-08-23-1420.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb

<span class="tok-comment"># 3 · If AOF is enabled, it WINS over the RDB on startup — remove it,</span>
<span class="tok-comment">#     or Redis will load the old AOF and ignore the file you just restored.</span>
sudo mv /var/lib/redis/appendonlydir /var/lib/redis/appendonlydir.old

<span class="tok-comment"># 4 · Start, and confirm before letting traffic in</span>
sudo systemctl start redis-server
redis-cli DBSIZE
redis-cli --scan --count 5 | head -3
redis-cli INFO persistence | grep -E "loading:|rdb_last_load_keys_loaded"

<span class="tok-comment"># 5 · Re-enable AOF from the restored data, then keep the old dir until you are sure</span>
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG REWRITE</code></pre>
<div class="out">(integer) 1842033
sess:9f2a1c
cache:product:4201
queue:jobs
loading:0
rdb_last_load_keys_loaded:1842033</div>
<div class="callout ok"><strong>Step 3 is the one that catches people.</strong> When <code>appendonly yes</code>, Redis loads the AOF on startup and ignores <code>dump.rdb</code> entirely — so a restore that copies an RDB into place and starts the server appears to do nothing at all, because the old AOF is still there and still authoritative. Move it aside first. And note step 5: turning AOF back on with <code>CONFIG SET appendonly yes</code> triggers an immediate rewrite from the now-current data, which creates a fresh, correct <code>appendonlydir</code> — that is the supported way round, not editing the config and restarting again.</div>

<h3>Is Redis a database?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">It can be, and the honest requirement is a list</span><span class="lz-t">AOF everysec · noeviction · replicas · tested restores</span><span class="lz-d">With posture 4, <code>maxmemory-policy noeviction</code>, a replica for failover and a restore you have actually performed, Redis holds data safely. Plenty of production systems use it exactly this way.</span></div>
  <div class="lz-step"><span class="lz-k">What you give up: everything fits in RAM</span><span class="lz-t">and RAM costs 50–100× what disk costs</span><span class="lz-d">This is the real constraint. A 200 GB Postgres database is unremarkable; a 200 GB Redis instance is an architectural decision with a monthly invoice attached.</span></div>
  <div class="lz-step"><span class="lz-k">What you give up: queries</span><span class="lz-t">no joins, no ad-hoc filters, no aggregation</span><span class="lz-d">Every access path must be designed in advance as a key or an index you maintain yourself (Lesson 4.4). "Show me users who signed up last month and have not logged in since" is a five-second SQL query and a data model you did not build.</span></div>
  <div class="lz-step"><span class="lz-k">What you give up: transactions across keys</span><span class="lz-t">MULTI is not a transaction (Lesson 7.1)</span><span class="lz-d">No rollback, no isolation levels, no foreign keys, no constraints. Every invariant is enforced by your application code being correct, forever, in every code path.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> assuming a managed Redis has the durability you configured, or any at all. On a hosted service you often cannot set <code>appendonly</code>, cannot see the disk, and cannot run <code>BGSAVE</code> or <code>CONFIG REWRITE</code> — the provider decides, and several popular tiers run with persistence disabled entirely because it is faster and cheaper. The result is an instance that behaves exactly like posture 1 while your architecture diagram says posture 4. Find out before you need to know: run <code>redis-cli CONFIG GET appendonly save maxmemory-policy</code> against the actual production endpoint, read the provider's page on backups and their stated RPO, and ask specifically what happens on a node failure — "we have automatic failover" answers a different question than "how much data is lost". Then do the one test that settles it: take a backup through whatever mechanism they offer, restore it to a scratch instance, and check <code>DBSIZE</code>. If any of those steps is not possible, you are running a cache, whatever the diagram says, and the data in it must be rebuildable from somewhere else.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#backing-up-redis-data" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Backing up Redis data</span><span class="lc-sub">The official procedure, why copying an RDB is safe, the disaster-recovery notes, and the explicit warning about backups living on the same machine.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Configuration and CONFIG REWRITE</span><span class="lc-sub">How <code>redis.conf</code>, <code>CONFIG SET</code> and <code>CONFIG REWRITE</code> relate, and when a rewrite fails — the mechanism behind the most common "we configured that months ago" surprise.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lose it and get it back</span><span class="lc-sub">Graded exercises: pick a posture for four workloads and justify the RPO, write a backup script that polls <code>LASTSAVE</code> and verifies, and perform a full restore including the AOF step that silently ruins it.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Persistence is an RPO/RTO budget, not a switch: no persistence loses everything and starts instantly, RDB loses your save window, AOF <code>everysec</code> loses a second but starts slowly, and enabling both — AOF for durability, RDB for backups and replica syncs — is the correct default for data you cannot rebuild. <code>CONFIG SET</code> only changes the running server, so <code>CONFIG REWRITE</code> or an edited <code>redis.conf</code> is what makes it survive a restart. And when restoring, move <code>appendonlydir</code> aside first: with AOF enabled Redis loads it and ignores the <code>dump.rdb</code> you just carefully put in place.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Chọn tư thế bền vững, và khôi phục</h2>
<p class="lead">Lưu lâu dài không phải một cái công tắc, nó là một khoản ngân sách. Bạn đang mua một mức mất dữ liệu tối đa (RPO) và một thời gian quay lại tối đa (RTO), và trả bằng thông lượng, chỗ trống bộ nhớ và công vận hành. Đây là bốn tư thế cùng những con số thật của chúng.</p>

<h3>Bốn tư thế</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Không lưu gì — <code>save ""</code>, <code>appendonly no</code></span><span class="lz-lnote"><strong>RPO: mất sạch. RTO: tức thì.</strong> Một lần khởi động lại là quay về trống rỗng rồi ấm dần lên từ nguồn sự thật. Là lựa chọn đúng cho một bộ đệm thuần tuý, và nó gỡ bỏ cùng lúc các đợt vọt do fork, việc vào ra đĩa và mọi kiểu hỏng ở Bài 9.3–9.4. Hãy nói to câu "một Redis rỗng thì vẫn ổn" trước khi chọn nó — câu đó sai thường xuyên hơn người ta tưởng.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Chỉ RDB — mặc định</span><span class="lz-lnote"><strong>RPO: tới bằng cửa sổ save của bạn (thường 60 giây). RTO: nhanh.</strong> Tệp gọn, nạp nhanh, lý tưởng cho sao lưu và nhân bản. Chấp nhận được khi mất một phút lượt ghi thật sự sống được — bộ đếm phân tích, dữ liệu suy ra, một bộ đệm mà bạn thà không phải dựng lại từ nguội.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Chỉ AOF — <code>appendonly yes</code>, <code>save ""</code></span><span class="lz-lnote"><strong>RPO: ≤1 giây. RTO: chậm.</strong> Bền vững mạnh, và lúc khởi động thì phát lại cuốn nhật ký (9 giây ở Bài 9.4). Cái bẫy: một lần đồng bộ đầy đủ của bản sao vẫn fork ra một RDB, và bạn không có tệp gọn nào để giao cho việc sao lưu — nên tư thế này thực tế hiếm hơn nghe có vẻ.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Cả hai — <code>appendonly yes</code> và bật các mốc save</span><span class="lz-lnote"><strong>RPO: ≤1 giây. RTO: tương đối nhanh.</strong> Lúc khởi động Redis ưu tiên AOF, nên AOF lo phần bền vững còn RDB cho bạn bản sao lưu rẻ và những lần đồng bộ bản sao nhanh. Đây là mặc định đúng cho bất kỳ Redis nào giữ dữ liệu bạn không dựng lại được, và chi phí thêm so với tư thế 3 chỉ là một cú fork định kỳ.</span></div>
</div>
<pre><code><span class="tok-comment"># Tư thế 4, viết ra đầy đủ</span>
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG SET appendfsync everysec
redis-cli CONFIG SET save "900 1 300 100 60 10000"
redis-cli CONFIG SET stop-writes-on-bgsave-error yes
redis-cli CONFIG SET maxmemory-policy noeviction
redis-cli CONFIG REWRITE                     <span class="tok-comment"># ← ghi vào redis.conf, không thì mất khi khởi động lại</span>
redis-cli INFO persistence | grep -E "^aof_enabled|^rdb_last_bgsave_status|^aof_last_write_status"</code></pre>
<div class="out">OK
OK
OK
OK
OK
OK
aof_enabled:1
rdb_last_bgsave_status:ok
aof_last_write_status:ok</div>
<div class="callout warn"><strong><code>CONFIG SET</code> đổi máy chủ đang chạy và không đổi gì khác.</strong> Mọi thiết lập ở trên đều quay về cũ ở lần khởi động kế tiếp trừ khi bạn hoặc sửa <code>redis.conf</code>, hoặc chạy <code>CONFIG REWRITE</code>, vốn ghi cấu hình đang sống trở lại cái tệp mà Redis được khởi động cùng. Đây là cách một máy "đã cấu hình" AOF suốt tám tháng rồi sau một lần khởi động lại quay về với <code>appendonly no</code> và một <code>appendonlydir</code> rỗng. Nếu Redis được khởi động mà không có tệp cấu hình thì <code>CONFIG REWRITE</code> sẽ thất bại — và điều đó đáng biết trước khi bạn trông cậy vào nó.</div>

<h3>Sao lưu</h3>
<pre><code><span class="tok-comment"># 1 · Xin một ảnh chụp mới và chờ nó xong</span>
BEFORE=$(redis-cli LASTSAVE)
redis-cli BGSAVE
while [ "$(redis-cli LASTSAVE)" = "$BEFORE" ]; do sleep 1; done
redis-cli INFO persistence | grep rdb_last_bgsave_status

<span class="tok-comment"># 2 · Chép cái tệp — phép đổi tên ở cuối làm cho việc này an toàn</span>
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%F-%H%M).rdb

<span class="tok-comment"># 3 · Kiểm rằng bản chép nạp được TRƯỚC KHI tin nó</span>
redis-check-rdb /backup/dump-$(date +%F-%H%M).rdb | tail -3</code></pre>
<div class="out">Background saving started
rdb_last_bgsave_status:ok
[offset 0] Checking RDB file dump-2026-08-23-1420.rdb
[offset 1264902] Checksum OK
[offset 1264902] \\o/ RDB looks OK! \\o/</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy hỏi vòng <code>LASTSAVE</code>, đừng ngủ</span><span class="v"><code>BGSAVE</code> trả về ngay lập tức; tệp chưa sẵn sàng cho tới khi <code>LASTSAVE</code> đổi. Một script sao lưu ngủ năm giây rồi chép sẽ có ngày chép trúng một tệp mới ghi được một nửa trên tập dữ liệu lớn hơn.</span></div>
  <div class="kv"><span class="k">Chép <code>dump.rdb</code> là an toàn</span><span class="v">Tiến trình con ghi một tệp tạm rồi đổi tên, nên cái tệp bạn chép luôn là một ảnh chụp trước đó trọn vẹn. Chép <code>appendonlydir/</code> lúc đang sống thì <em>không</em> an toàn ngang vậy — tệp incr đang được nối thêm, nên hãy lấy tệp kê khai cùng các tệp một lượt và chấp nhận rằng phần đuôi có thể bị cắt cụt (điều mà <code>aof-load-truncated</code> xử lý được).</span></div>
  <div class="kv"><span class="k">Hãy sao lưu từ một bản sao</span><span class="v">Một bản sao fork và ghi tệp được mà không thêm độ trễ hay áp lực sao-chép-khi-ghi lên cái máy đang phục vụ lưu lượng (Chương 11). Nếu bạn có một cái thì đó mới là chỗ của việc sao lưu.</span></div>
  <div class="kv"><span class="k">Hãy kiểm mọi bản sao lưu một cách tự động</span><span class="v"><code>redis-check-rdb</code> gọn trong một lệnh và nó bắt được một tệp bị cắt cụt hay hỏng ngay lúc sao lưu chứ không phải lúc khôi phục. Hãy đưa nó vào script; một bản sao lưu chưa kiểm là một niềm hy vọng.</span></div>
  <div class="kv"><span class="k">Hãy giữ chúng ở nơi khác</span><span class="v">Một tệp RDB nằm cạnh cái máy chỉ bảo vệ trước một lệnh <code>FLUSHALL</code> lỡ tay và không bảo vệ gì khác. Hãy để ngoài máy, và tốt nhất là ngoài tài khoản, không thì cùng một sự kiện lấy đi cái máy sẽ lấy luôn các bản sao lưu.</span></div>
</div>

<h3>Khôi phục, từng bước</h3>
<pre><code><span class="tok-comment"># 1 · Dừng Redis. Một máy chủ đang chạy sẽ ghi đè lên cái tệp bạn đang đặt vào.</span>
sudo systemctl stop redis-server

<span class="tok-comment"># 2 · Đặt tệp vào đúng chỗ mà &#96;dir&#96; + &#96;dbfilename&#96; chỉ, với đúng chủ sở hữu</span>
sudo cp /backup/dump-2026-08-23-1420.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb

<span class="tok-comment"># 3 · Nếu AOF đang bật, nó THẮNG RDB lúc khởi động — hãy gỡ nó đi,</span>
<span class="tok-comment">#     không thì Redis nạp AOF cũ và phớt lờ cái tệp bạn vừa khôi phục.</span>
sudo mv /var/lib/redis/appendonlydir /var/lib/redis/appendonlydir.old

<span class="tok-comment"># 4 · Khởi động, và xác nhận trước khi cho lưu lượng vào</span>
sudo systemctl start redis-server
redis-cli DBSIZE
redis-cli --scan --count 5 | head -3
redis-cli INFO persistence | grep -E "loading:|rdb_last_load_keys_loaded"

<span class="tok-comment"># 5 · Bật lại AOF từ dữ liệu vừa khôi phục, rồi giữ thư mục cũ tới khi chắc chắn</span>
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG REWRITE</code></pre>
<div class="out">(integer) 1842033
sess:9f2a1c
cache:product:4201
queue:jobs
loading:0
rdb_last_load_keys_loaded:1842033</div>
<div class="callout ok"><strong>Bước 3 là bước bẫy người ta.</strong> Khi <code>appendonly yes</code>, Redis nạp AOF lúc khởi động và phớt lờ hoàn toàn <code>dump.rdb</code> — nên một lần khôi phục chép RDB vào chỗ rồi khởi động máy chủ sẽ trông như chẳng làm gì cả, vì cái AOF cũ vẫn ở đó và vẫn có thẩm quyền. Hãy dời nó sang bên trước. Và để ý bước 5: bật lại AOF bằng <code>CONFIG SET appendonly yes</code> sẽ kích hoạt ngay một lần ghi lại từ dữ liệu hiện tại, tạo ra một <code>appendonlydir</code> mới và đúng — đó mới là cách được hỗ trợ, chứ không phải sửa cấu hình rồi khởi động lại lần nữa.</div>

<h3>Redis có phải một cơ sở dữ liệu không?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Có thể là, và yêu cầu thành thật là một danh sách</span><span class="lz-t">AOF everysec · noeviction · bản sao · khôi phục đã thử</span><span class="lz-d">Với tư thế 4, <code>maxmemory-policy noeviction</code>, một bản sao để chuyển đổi và một lần khôi phục bạn thật sự đã thực hiện, Redis giữ dữ liệu an toàn. Khối hệ thống production dùng nó đúng theo cách này.</span></div>
  <div class="lz-step"><span class="lz-k">Thứ bạn từ bỏ: mọi thứ phải vừa trong RAM</span><span class="lz-t">và RAM đắt gấp 50–100 lần đĩa</span><span class="lz-d">Đây mới là ràng buộc thật. Một cơ sở dữ liệu Postgres 200 GB là chuyện bình thường; một máy Redis 200 GB là một quyết định kiến trúc kèm một tờ hoá đơn hằng tháng.</span></div>
  <div class="lz-step"><span class="lz-k">Thứ bạn từ bỏ: khả năng truy vấn</span><span class="lz-t">không join, không lọc tuỳ hứng, không tổng hợp</span><span class="lz-d">Mọi đường truy cập đều phải được thiết kế trước dưới dạng một cái khoá hay một chỉ mục bạn tự duy trì (Bài 4.4). "Cho tôi những người đăng ký tháng trước mà chưa đăng nhập lại lần nào" là một truy vấn SQL năm giây và là một mô hình dữ liệu bạn chưa hề dựng.</span></div>
  <div class="lz-step"><span class="lz-k">Thứ bạn từ bỏ: giao dịch xuyên nhiều khoá</span><span class="lz-t">MULTI không phải một giao dịch (Bài 7.1)</span><span class="lz-d">Không quay lui, không mức cô lập, không khoá ngoại, không ràng buộc. Mọi bất biến đều được bảo đảm bằng việc mã ứng dụng của bạn viết đúng, mãi mãi, ở mọi nhánh.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> mặc định rằng một Redis có quản lý có đúng độ bền bạn đã cấu hình, hoặc có độ bền nào đó. Trên một dịch vụ lưu trữ, bạn thường không đặt được <code>appendonly</code>, không nhìn thấy cái đĩa, và không chạy được <code>BGSAVE</code> hay <code>CONFIG REWRITE</code> — nhà cung cấp quyết định, và vài gói phổ biến chạy với phần lưu lâu dài tắt hẳn vì như thế nhanh hơn và rẻ hơn. Kết quả là một máy cư xử y hệt tư thế 1 trong khi sơ đồ kiến trúc của bạn nói là tư thế 4. Hãy tìm ra sự thật trước khi bạn cần biết: chạy <code>redis-cli CONFIG GET appendonly save maxmemory-policy</code> lên đúng cái đầu nối production, đọc trang của nhà cung cấp về sao lưu và mức RPO họ công bố, và hỏi cụ thể chuyện gì xảy ra khi một nút hỏng — "chúng tôi có chuyển đổi tự động" trả lời một câu hỏi khác với "mất bao nhiêu dữ liệu". Rồi hãy làm phép thử duy nhất ngã ngũ được: lấy một bản sao lưu qua bất cứ cơ chế nào họ có, khôi phục nó vào một máy nháp, và kiểm <code>DBSIZE</code>. Nếu có bước nào trong đó không làm được thì bạn đang chạy một cái bộ đệm, bất kể sơ đồ nói gì, và dữ liệu trong đó phải dựng lại được từ chỗ khác.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#backing-up-redis-data" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Backing up Redis data</span><span class="lc-sub">Quy trình chính thức, vì sao chép một tệp RDB là an toàn, các ghi chú về khôi phục sau thảm hoạ, và lời cảnh báo tường minh về việc bản sao lưu nằm chung máy.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Configuration và CONFIG REWRITE</span><span class="lc-sub"><code>redis.conf</code>, <code>CONFIG SET</code> và <code>CONFIG REWRITE</code> liên hệ với nhau ra sao, và khi nào một lần ghi lại thất bại — cơ chế đứng sau bất ngờ phổ biến nhất kiểu "bọn tôi cấu hình cái đó mấy tháng trước rồi mà".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm mất rồi lấy lại</span><span class="lc-sub">Bài chấm điểm: chọn tư thế cho bốn khối lượng việc và biện minh mức RPO, viết một script sao lưu biết hỏi vòng <code>LASTSAVE</code> và tự kiểm, và thực hiện một lần khôi phục trọn vẹn gồm cả cái bước AOF âm thầm phá hỏng nó.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Lưu lâu dài là một khoản ngân sách RPO/RTO chứ không phải một cái công tắc: không lưu gì thì mất sạch và khởi động tức thì, RDB thì mất bằng cửa sổ save của bạn, AOF <code>everysec</code> mất một giây nhưng khởi động chậm, còn bật cả hai — AOF cho độ bền, RDB cho sao lưu và đồng bộ bản sao — là mặc định đúng cho dữ liệu bạn không dựng lại được. <code>CONFIG SET</code> chỉ đổi máy chủ đang chạy, nên <code>CONFIG REWRITE</code> hoặc một tệp <code>redis.conf</code> đã sửa mới là thứ giúp nó sống sót qua khởi động lại. Và khi khôi phục, hãy dời <code>appendonlydir</code> sang bên trước đã: với AOF đang bật thì Redis nạp nó và phớt lờ cái <code>dump.rdb</code> bạn vừa cẩn thận đặt vào chỗ.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: memory and persistence|||9.6 — Trắc nghiệm: bộ nhớ và lưu lâu dài',
      slug: 'rd-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về bốn con số bộ nhớ, tỉ lệ phân mảnh dưới 1, noeviction làm hỏng lượt ghi, volatile-* không có TTL, sao-chép-khi-ghi, appendfsync, MISCONF, và bước AOF phá hỏng một lần khôi phục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the two things that decide whether Redis survives production. Half of them are about defaults that are correct for one use and dangerous for the other.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: what a fragmentation ratio below 1.0 means (9.1), how <code>volatile-*</code> behaves with no TTLs (9.2), why copy-on-write breaks a 90%-full machine (9.3), and the AOF step that silently ruins a restore (9.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về hai thứ quyết định Redis có sống nổi ở production hay không. Một nửa số câu nói về những giá trị mặc định đúng cho cách dùng này và nguy hiểm cho cách dùng kia.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: tỉ lệ phân mảnh dưới 1,0 nghĩa là gì (9.1), <code>volatile-*</code> cư xử ra sao khi không có TTL (9.2), vì sao sao-chép-khi-ghi phá hỏng một cái máy đầy 90% (9.3), và cái bước AOF âm thầm phá hỏng một lần khôi phục (9.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: '`mem_fragmentation_ratio` is 0.85. What does that mean, and what is the fix?|||`mem_fragmentation_ratio` là 0,85. Điều đó nghĩa là gì, và cách chữa là gì?',
            options: [
              'Excellent compaction — the allocator is packing memory better than requested; nothing to do|||Nén rất tốt — bộ cấp phát đang gói bộ nhớ chặt hơn mức được yêu cầu; không phải làm gì cả',
              'RSS is BELOW used_memory, which means the kernel has swapped part of Redis to disk — a single-threaded server touching a swapped page stalls everyone, so reduce memory or add RAM|||RSS THẤP HƠN used_memory, nghĩa là nhân đã tráo một phần Redis ra đĩa — một máy chủ đơn luồng chạm vào một trang đã tráo sẽ làm khựng tất cả mọi người, nên hãy giảm bộ nhớ hoặc thêm RAM',
              'Normal fragmentation; enable activedefrag to reclaim it|||Phân mảnh bình thường; hãy bật activedefrag để đòi lại',
              'A reporting bug that appears right after a restart and can be ignored|||Một lỗi báo cáo xuất hiện ngay sau khi khởi động lại và có thể bỏ qua',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your instance hits maxmemory with the default policy. What do users experience?|||Máy của bạn chạm maxmemory với chính sách mặc định. Người dùng trải nghiệm điều gì?',
            options: [
              'The whole instance stops responding until memory is freed|||Cả cái máy ngừng phản hồi cho tới khi bộ nhớ được giải phóng',
              'The oldest keys are deleted automatically and everything keeps working|||Các khoá cũ nhất bị xoá tự động và mọi thứ vẫn chạy',
              'The default is noeviction: every write command returns OOM while reads keep working — so the site half-works, which is what makes the incident confusing|||Mặc định là noeviction: mọi lệnh ghi trả về OOM trong khi các lệnh đọc vẫn chạy — nên trang web chạy được một nửa, và chính điều đó làm cho sự cố trở nên rối rắm',
              'Redis starts writing to disk as an overflow area|||Redis bắt đầu ghi xuống đĩa như một vùng tràn',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'An instance is configured `maxmemory-policy volatile-lru`, but no key in it has a TTL. What happens when it fills?|||Một máy được cấu hình `maxmemory-policy volatile-lru`, nhưng không khoá nào trong đó có TTL. Chuyện gì xảy ra khi nó đầy?',
            options: [
              'Redis falls back to allkeys-lru so that eviction can still proceed|||Redis lùi về allkeys-lru để việc đẩy khoá vẫn tiến hành được',
              'Redis assigns a default TTL to the oldest keys so they become eligible|||Redis gán một TTL mặc định cho các khoá cũ nhất để chúng thành ứng viên hợp lệ',
              'Eviction picks randomly among all keys, since none is preferred|||Việc đẩy khoá chọn ngẫu nhiên trong mọi khoá, vì không cái nào được ưu tiên',
              'It finds no eligible candidate and behaves exactly like noeviction — writes start failing, from a policy that reads as safe|||Nó không tìm được ứng viên hợp lệ nào và cư xử y hệt noeviction — các lượt ghi bắt đầu hỏng, từ một chính sách nghe rất an toàn',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'During a BGSAVE, used_memory stays flat but used_memory_rss rises by 700 MB and then falls back. What is happening?|||Trong một lần BGSAVE, used_memory nằm im nhưng used_memory_rss tăng 700 MB rồi tụt lại. Chuyện gì đang diễn ra?',
            options: [
              'The RDB file is being buffered in memory before it is written to disk|||Tệp RDB đang được đệm trong bộ nhớ trước khi ghi xuống đĩa',
              'Copy-on-write: each page the parent modifies while the child is saving must be duplicated, so the extra RSS is proportional to how much changes DURING the save — and the OOM killer takes the parent, not the child|||Sao-chép-khi-ghi: mỗi trang mà tiến trình cha sửa trong lúc tiến trình con đang lưu đều phải được nhân đôi, nên phần RSS thêm tỉ lệ với lượng thay đổi TRONG LÚC lưu — và kẻ giết-vì-hết-bộ-nhớ lấy mạng tiến trình cha, không phải tiến trình con',
              'Redis is compressing the dataset, which temporarily doubles it|||Redis đang nén tập dữ liệu, việc đó tạm thời làm nó lớn gấp đôi',
              'The replication backlog is being resized to match the snapshot|||Bộ đệm nhân bản đang được đổi cỡ cho khớp với ảnh chụp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The Redis log warns about Transparent Huge Pages at every startup. Why does it matter?|||Nhật ký Redis cảnh báo về Transparent Huge Pages ở mỗi lần khởi động. Vì sao chuyện đó quan trọng?',
            options: [
              'THP makes copy-on-write duplicate 2 MB at a time instead of 4 KB — 512x the work per modified page — turning a smooth save into latency spikes of hundreds of milliseconds|||THP khiến sao-chép-khi-ghi nhân đôi 2 MB một lần thay vì 4 KB — gấp 512 lần khối lượng việc cho mỗi trang bị sửa — biến một lần lưu êm ả thành những đợt vọt độ trễ hàng trăm mili giây',
              'THP prevents Redis from allocating more than 2 MB per key|||THP ngăn Redis cấp phát quá 2 MB cho mỗi khoá',
              'THP disables fork entirely, so BGSAVE silently does nothing|||THP tắt hẳn fork, nên BGSAVE âm thầm chẳng làm gì',
              'It is a cosmetic warning kept for historical reasons on modern kernels|||Đó là cảnh báo mang tính hình thức giữ lại vì lý do lịch sử trên các nhân hiện đại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Benchmarks show 98,000 ops/s with `appendfsync everysec` and 6,200 with `always`. What are you buying with that 16x?|||Phép đo cho thấy 98.000 phép/giây với `appendfsync everysec` và 6.200 với `always`. Bạn mua được gì với cái giá gấp 16 lần đó?',
            options: [
              'Protection against disk corruption, which everysec does not provide|||Sự bảo vệ trước hỏng đĩa, thứ mà everysec không cho',
              'Faster startup, because the AOF is written more compactly|||Khởi động nhanh hơn, vì AOF được ghi gọn hơn',
              'Per-command durability instead of per-second: everysec can lose up to one second of writes on a hard crash, always loses nothing — and for almost every application the second is affordable|||Độ bền theo từng lệnh thay vì theo từng giây: everysec có thể mất tới một giây lượt ghi khi sập cứng, còn always thì không mất gì — và với gần như mọi ứng dụng thì một giây ấy là chấp nhận được',
              'Nothing measurable; the difference is an artefact of the benchmark tool|||Không mua được gì đo đếm được; khác biệt đó là hiện tượng giả do công cụ đo gây ra',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Writes start failing with MISCONF. What is the correct first move?|||Các lượt ghi bắt đầu hỏng với lỗi MISCONF. Nước đi đầu tiên đúng đắn là gì?',
            options: [
              'Set stop-writes-on-bgsave-error no, which clears the error immediately|||Đặt stop-writes-on-bgsave-error no, việc đó xoá lỗi ngay lập tức',
              'Read the real error from the Redis log and check disk space, ownership and vm.overcommit_memory — MISCONF means Redis cannot persist and is refusing to accept writes it knows will vanish|||Đọc lỗi thật từ nhật ký Redis rồi kiểm dung lượng đĩa, quyền sở hữu và vm.overcommit_memory — MISCONF nghĩa là Redis không lưu được và đang từ chối nhận những lượt ghi mà nó biết sẽ biến mất',
              'Run FLUSHALL to free space so the save can complete|||Chạy FLUSHALL để giải phóng chỗ cho lần lưu hoàn tất',
              'Restart Redis, which clears the persistence error state|||Khởi động lại Redis, việc đó xoá trạng thái lỗi lưu trữ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You stop Redis, copy a backup dump.rdb into place, and start it. DBSIZE shows the OLD data, not the backup. Why?|||Bạn dừng Redis, chép một bản sao lưu dump.rdb vào chỗ, rồi khởi động. DBSIZE hiện dữ liệu CŨ chứ không phải bản sao lưu. Vì sao?',
            options: [
              'The file needed chown redis:redis, so Redis silently skipped it|||Tệp cần chown redis:redis, nên Redis âm thầm bỏ qua nó',
              'dump.rdb is only read when the dataset is empty; you must FLUSHALL first|||dump.rdb chỉ được đọc khi tập dữ liệu rỗng; bạn phải FLUSHALL trước',
              'appendonly is enabled, so Redis loads the AOF on startup and ignores dump.rdb entirely — move appendonlydir aside before restoring|||appendonly đang bật, nên Redis nạp AOF lúc khởi động và phớt lờ hoàn toàn dump.rdb — hãy dời appendonlydir sang bên trước khi khôi phục',
              'The backup was taken with SAVE rather than BGSAVE and is not loadable|||Bản sao lưu được lấy bằng SAVE chứ không phải BGSAVE nên không nạp được',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
