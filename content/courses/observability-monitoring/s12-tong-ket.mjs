/**
 * Observability — Chương 12 — Những gì sống sót qua phép đo.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 12 — What survived measurement|||Chương 12 — Những gì sống sót qua phép đo',
  slug: 'obs-ch12-tong-ket',
  description: 'Tổng kết mọi con số đã đo, dựng cái gì trước, và bài thi cuối khoá.',
  sortOrder: 13,
  lessons: [
    {
      title: '12.1 — Every number this course measured|||12.1 — Mọi con số khoá này đã đo',
      slug: 'obs-12-1-moi-con-so',
      type: 'VIDEO',
      description: 'Mười tám phép đo trong một bảng, và tám con số đã lật ngược một niềm tin phổ biến.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Every number this course measured</h2>
<p class="lead">This course was built on a rule: no claim about cost or behaviour without a measurement. Eighteen of them were run on Node 22.22.2 in a sandbox, and every script is in the lesson that used it. Here they all are, and then the eight that contradict something widely believed.</p>

<h3>Logs</h3>
<pre><code>ONE LOG LINE, built (lesson 1.4, N=200,000)
  bare string, no context                15 ns/line
  concat + context                       19 ns/line
  JSON.stringify (this repo's logger)   571 ns/line
  + new Date().toISOString()           1310 ns/line
  → the timestamp (~740 ns) costs MORE than the JSON

ONE LOG LINE, written (lesson 1.5, N=20,000)
  fd 1 → file                          2866 ns/line
  fd 1 → pipe (every container)        4985 ns/line
  fd 1 → /dev/null                     2303 ns/line
  → total real cost per production line: ~6,300 ns

SLOW PIPE READER (lesson 1.5, 400,000 lines)
  fast reader   RSS 43 → 55 MB,   0 bytes buffered
  slow reader   RSS 43 → 122 MB,  47,874,720 bytes buffered
  → a slow log shipper is a memory leak in your app

DOCKER'S ENVELOPE (lesson 2.1)
  your line          157 bytes
  after json-file    255 bytes    = 1.62× expansion
  → 50 rps × 5 lines/req = 5.13 GB/day

COMPRESSION (lesson 2.5, 200,000 lines)
  raw     29.9 MB      gzip -6  2.3 MB (12.8×)
                       zstd     2.1 MB (14.2×)
  → 30 days at 50 rps: 94.7 GB raw, 7.4 GB gzipped</code></pre>

<h3>Correlation and context</h3>
<pre><code>ASYNCLOCALSTORAGE (lesson 3.2, N=200,000)
  no ALS (baseline)                     238 ns/op
  ALS run() + one getStore()            915 ns/op
  ALS run() + ten getStore()            897 ns/op
  → run() costs 677 ns per request; getStore() is free
  → 0.034% of one core at 500 rps

THIS REPO, COUNTED (lesson 0.1)
  route declarations                    945
  routes files                           73  (16 import logger)
  services files                        101  (22 import logger)
  logger.*() calls                      370
  console.*() calls                      41
  requestId|correlationId|traceId          4  in 353 .ts files</code></pre>

<h3>Metrics</h3>
<pre><code>THE AVERAGE HIDES THE TAIL (lesson 4.2, n=100,000)
  mean 39.5ms  ← the only number a default dashboard shows
  p50 15.2 · p90 21.0 · p95 21.7 · p99 989.4 · max 1299.7
  requests over 200ms: 2,940 (2.9%)
  → p95→p99 jumps 45×; a p95 dashboard shows a healthy service

HISTOGRAM COST AND ERROR (lessons 4.3, n=1,000,000)
  storing every sample     7.6 MB
  storing the histogram    104 bytes    = 76,923× smaller
  BUT with prom-client's default buckets:
    p95 truth 27.6ms → histogram says 46.6ms   (69% wrong)
    p99 truth 1101ms → histogram says 1507ms   (37% wrong)
  buckets chosen from the measured distribution: 6.3% worst error
  exponential buckets (factor 1.7):            18.7% worst error

CARDINALITY (lesson 4.4)
  route + method + code            224 series      0.6 MB
  + userId (10k)             2,240,000 series    6.4 GB
  + real note ids (200k)     5,600,000 series   16.0 GB
  + millisecond timestamps 2,764,800,000 series   7.9 PB</code></pre>

<h3>Node internals</h3>
<pre><code>CPU% LIES, LAG DOES NOT (lesson 5.1, 4-core machine)
  idle                 CPU 1-core   4%  ·  4-core  1.0%  · lag p99   1ms
  blocking 50ms/turn   CPU 1-core  91%  ·  4-core 22.7%  · lag p99  51ms
  blocking 200ms/turn  CPU 1-core  95%  ·  4-core 23.8%  · lag p99 201ms
  → CPU% cannot distinguish 50ms from 200ms; lag tracks exactly

  and across workloads (lesson 5.1):
  p50 stays 1.1ms in EVERY case, including the 120ms block
  → mean/p50 lag alerts catch almost nothing

MEMORY (lesson 5.2)
  400k objects then GC:  heapUsed 4 → 75 → 4 MB
                         rss      43 → 150 → 140 MB
  → V8 never returns pages; a rising rss graph is NORMAL
  200 MB of Buffers:     rss 140 → 143 MB (allocated, not touched)
  after writing to them: rss 143 → 343 MB (no new allocation)
  → external reports what you asked for; rss what is resident

GARBAGE COLLECTION (lesson 5.3)
  minor (scavenge)     50 pauses  avg 3.63ms  max  6.2ms
  incremental          16 pauses  avg 0.50ms  max  0.7ms
  major (mark-sweep)   16 pauses  avg 7.96ms  max 16.3ms
  → 317 ms frozen across 82 pauses</code></pre>

<h3>Tracing and alerting</h3>
<pre><code>TRACE VOLUME (lesson 6.1)
  one realistic trace   6 spans, 2,796 bytes (466 B/span)
  → 17.8× one log line, per request
  → 100% sampling at 50 rps: 11.25 GB/day raw, 0.88 GB gzipped

HEAD SAMPLING MISSES (lesson 6.3)
  occurrences needed for a 95% chance of catching one:
    10% sampling  →   29
     1% sampling  →  299
   0.1% sampling  → 2,995

ERROR BUDGET (lesson 9.3, 30-day window)
  99.00%  7.2 hours    99.90%  43 minutes    99.99%  4 minutes
  burn rate at 100% errors: 1000× → the 99.9% budget is gone
  in exactly those 43 minutes</code></pre>

<h3>The eight results that contradict common belief</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The timestamp costs more than the JSON</span><span class="lz-d">740 ns of a 1,310 ns log line is <code>new Date().toISOString()</code>. Everyone optimises the serialisation; almost nobody caches the formatted second.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">AsyncLocalStorage is not slow</span><span class="lz-d">677 ns per request, and <code>getStore()</code> is unmeasurable. The reputation is real history from before Node 16, repeated ever since.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Default histogram buckets can be 69% wrong</span><span class="lz-d">And silently. The p95 a dashboard shows is a linear interpolation across whatever bucket happens to contain it.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A rising RSS graph is healthy</span><span class="lz-d">V8 does not return freed pages. The leak signature is the rising <em>bottom</em> of the heapUsed sawtooth, which almost nobody looks at.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">A blocked Node process reads as 24% CPU</span><span class="lz-d">On four cores. The dashboard your host provides shows the number that cannot see a total outage.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">p50 event-loop lag stays 1.1 ms through a 120 ms block</span><span class="lz-d">Which makes the default <code>nodejs_eventloop_lag_seconds</code> — a mean — nearly useless as an alert.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">1% sampling needs 299 occurrences</span><span class="lz-d">Head sampling discards precisely the rare failures that traces were adopted to find.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">A total outage exhausts a 99.9% month in 43 minutes</span><span class="lz-d">Which is the same 43 minutes the SLO permits, arriving from the other direction — and why one bad deploy is a quarter of the budget.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — these numbers are from one sandbox, on one Node version, on hardware that is not yours.</strong> The ratios are the durable part: the timestamp dominating the log line, RSS not returning, CPU% failing to see a blocked loop, sampling arithmetic. The absolute values are not — a faster CPU changes 1,310 ns, a different kernel changes the pipe throughput, and a 16-core machine makes the CPU% lie four times worse rather than better. <strong>The specific danger is quoting an absolute from here in a design document, where it becomes a fact with no provenance and outlives the hardware it came from.</strong> Every script is in its lesson; run them on your machine, and when you write the result down, write the date, the Node version and the core count next to it — which is exactly what this repository's own documentation does for its measured LLM prices, and why those entries are still trustworthy.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — perf_hooks</span><span class="lc-sub">The measurement toolkit used throughout: hrtime, monitorEventLoopDelay, PerformanceObserver for GC.</span></span>
</a>
<a class="link-card dl" href="https://github.com/bestiejs/benchmark.js" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">benchmark.js</span><span class="lc-sub">For measurements that need statistical rigour rather than the simple warm-up-then-loop approach these lessons use.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Mọi con số khoá này đã đo</h2>
<p class="lead">Khoá học này được dựng trên một luật: không khẳng định gì về chi phí hay hành vi mà không có một phép đo. Mười tám phép đo đã chạy trên Node 22.22.2 trong một hộp cát, và mọi script đều nằm trong chính bài đã dùng nó. Đây là tất cả chúng, rồi tới tám con số mâu thuẫn với một niềm tin phổ biến.</p>

<h3>Log</h3>
<pre><code>MỘT DÒNG LOG, lúc DỰNG (bài 1.4, N=200.000)
  chuỗi trần, không ngữ cảnh             15 ns/dòng
  nối chuỗi + ngữ cảnh                   19 ns/dòng
  JSON.stringify (logger của kho này)   571 ns/dòng
  + new Date().toISOString()           1310 ns/dòng
  → dấu thời gian (~740 ns) tốn HƠN cả phần JSON

MỘT DÒNG LOG, lúc GHI (bài 1.5, N=20.000)
  fd 1 → file                          2866 ns/dòng
  fd 1 → ống (mọi container)           4985 ns/dòng
  fd 1 → /dev/null                     2303 ns/dòng
  → tổng chi phí thật mỗi dòng production: ~6.300 ns

BÊN ĐỌC ỐNG CHẬM (bài 1.5, 400.000 dòng)
  đọc nhanh   RSS 43 → 55 MB,   0 byte trong đệm
  đọc chậm    RSS 43 → 122 MB,  47.874.720 byte trong đệm
  → một trình thu log chậm là một chỗ rò rỉ bộ nhớ trong app

PHONG BÌ CỦA DOCKER (bài 2.1)
  dòng của bạn       157 byte
  sau json-file      255 byte    = phình 1,62×
  → 50 rps × 5 dòng/req = 5,13 GB/ngày

NÉN (bài 2.5, 200.000 dòng)
  thô     29,9 MB     gzip -6  2,3 MB (12,8×)
                      zstd     2,1 MB (14,2×)
  → 30 ngày ở 50 rps: 94,7 GB thô, 7,4 GB đã gzip</code></pre>

<h3>Correlation và ngữ cảnh</h3>
<pre><code>ASYNCLOCALSTORAGE (bài 3.2, N=200.000)
  không ALS (mốc)                       238 ns/thao tác
  ALS run() + một getStore()            915 ns/thao tác
  ALS run() + mười getStore()           897 ns/thao tác
  → run() tốn 677 ns mỗi request; getStore() miễn phí
  → 0,034% một nhân ở mức 500 rps

KHO NÀY, ĐẾM THẬT (bài 0.1)
  khai báo route                        945
  file routes                            73  (16 import logger)
  file services                         101  (22 import logger)
  lời gọi logger.*()                    370
  lời gọi console.*()                    41
  requestId|correlationId|traceId          4  trên 353 file .ts</code></pre>

<h3>Chỉ số</h3>
<pre><code>TRUNG BÌNH GIẤU ĐUÔI (bài 4.2, n=100.000)
  TB 39,5ms  ← con số duy nhất bảng theo dõi mặc định hiện ra
  p50 15,2 · p90 21,0 · p95 21,7 · p99 989,4 · max 1299,7
  số request vượt 200ms: 2.940 (2,9%)
  → p95→p99 nhảy 45 lần; một bảng hiện p95 báo dịch vụ khoẻ mạnh

CHI PHÍ VÀ SAI SỐ HISTOGRAM (bài 4.3, n=1.000.000)
  lưu mọi mẫu              7,6 MB
  lưu histogram            104 byte    = nhỏ hơn 76.923 lần
  NHƯNG với bộ ô mặc định của prom-client:
    p95 thật 27,6ms → histogram nói 46,6ms   (sai 69%)
    p99 thật 1101ms → histogram nói 1507ms   (sai 37%)
  ô chọn theo phân bố đã đo:            sai số tệ nhất 6,3%
  ô cấp số nhân (hệ số 1,7):           sai số tệ nhất 18,7%

LỰC LƯỢNG NHÃN (bài 4.4)
  route + method + code            224 chuỗi      0,6 MB
  + userId (10k)             2.240.000 chuỗi      6,4 GB
  + id ghi chú thật (200k)   5.600.000 chuỗi     16,0 GB
  + dấu thời gian mili giây 2.764.800.000 chuỗi   7,9 PB</code></pre>

<h3>Bên trong Node</h3>
<pre><code>CPU% NÓI DỐI, ĐỘ TRỄ THÌ KHÔNG (bài 5.1, máy 4 nhân)
  nhàn rỗi           CPU 1-nhân   4%  ·  4-nhân  1,0%  · trễ p99   1ms
  chặn 50ms/vòng     CPU 1-nhân  91%  ·  4-nhân 22,7%  · trễ p99  51ms
  chặn 200ms/vòng    CPU 1-nhân  95%  ·  4-nhân 23,8%  · trễ p99 201ms
  → CPU% không phân biệt nổi 50ms với 200ms; độ trễ bám chính xác

  và trên nhiều khối lượng công việc (bài 5.1):
  p50 giữ nguyên 1,1ms ở MỌI trường hợp, kể cả lượt chặn 120ms
  → cảnh báo theo độ trễ trung bình/p50 bắt được gần như không gì

BỘ NHỚ (bài 5.2)
  400k object rồi GC:    heapUsed 4 → 75 → 4 MB
                         rss      43 → 150 → 140 MB
  → V8 không bao giờ trả trang; đồ thị rss đi lên là BÌNH THƯỜNG
  200 MB Buffer:         rss 140 → 143 MB (đã cấp phát, chưa chạm)
  sau khi ghi vào chúng: rss 143 → 343 MB (không cấp phát thêm)
  → external báo cái bạn XIN; rss báo cái đang thật sự nằm trong RAM

THU GOM RÁC (bài 5.3)
  minor (scavenge)     50 lần dừng  TB 3,63ms  max  6,2ms
  incremental          16 lần dừng  TB 0,50ms  max  0,7ms
  major (mark-sweep)   16 lần dừng  TB 7,96ms  max 16,3ms
  → 317 ms đóng băng trên 82 lần dừng</code></pre>

<h3>Trace và cảnh báo</h3>
<pre><code>LƯỢNG DỮ LIỆU TRACE (bài 6.1)
  một trace thực tế     6 span, 2.796 byte (466 B/span)
  → gấp 17,8 lần một dòng log, cho mỗi request
  → lấy mẫu 100% ở 50 rps: 11,25 GB/ngày thô, 0,88 GB đã gzip

LẤY MẪU ĐẦU BỎ SÓT (bài 6.3)
  số lần xảy ra cần có để có 95% cơ hội bắt được một cái:
    lấy mẫu 10%   →   29
    lấy mẫu 1%    →  299
    lấy mẫu 0,1%  → 2.995

NGÂN SÁCH LỖI (bài 9.3, cửa sổ 30 ngày)
  99,00%  7,2 giờ    99,90%  43 phút    99,99%  4 phút
  tốc độ đốt khi lỗi 100%: 1000× → ngân sách 99,9% biến mất
  trong đúng 43 phút đó</code></pre>

<h3>Tám kết quả mâu thuẫn với niềm tin phổ biến</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dấu thời gian tốn hơn cả phần JSON</span><span class="lz-d">740 ns trong một dòng log 1.310 ns là <code>new Date().toISOString()</code>. Ai cũng đi tối ưu phần tuần tự hoá; gần như không ai đệm lại cái giây đã định dạng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">AsyncLocalStorage KHÔNG chậm</span><span class="lz-d">677 ns mỗi request, và <code>getStore()</code> thì không đo được. Cái tiếng ấy là lịch sử có thật từ trước Node 16, được nhắc lại mãi từ đó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bộ ô histogram mặc định có thể sai 69%</span><span class="lz-d">Và sai trong im lặng. Cái p95 mà một bảng theo dõi hiện ra là một phép nội suy tuyến tính qua bất cứ cái ô nào tình cờ chứa nó.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Một đồ thị RSS đi lên là khoẻ mạnh</span><span class="lz-d">V8 không trả lại các trang đã giải phóng. Chữ ký của rò rỉ là ĐÁY của răng cưa heapUsed dâng lên, thứ gần như không ai nhìn.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Một tiến trình Node bị chặn đọc ra là 24% CPU</span><span class="lz-d">Trên bốn nhân. Cái bảng mà nhà cung cấp máy chủ đưa cho bạn hiển thị đúng con số không nhìn thấy được một sự cố toàn phần.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">p50 độ trễ vòng lặp giữ nguyên 1,1 ms xuyên qua một cú chặn 120 ms</span><span class="lz-d">Điều đó làm cho cái <code>nodejs_eventloop_lag_seconds</code> mặc định — một số trung bình — gần như vô dụng khi làm cảnh báo.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Lấy mẫu 1% cần 299 lần xảy ra</span><span class="lz-d">Lấy mẫu đầu vứt đi chính xác những cú hỏng hiếm mà người ta dùng trace để tìm.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Một sự cố toàn phần đốt cạn tháng 99,9% trong 43 phút</span><span class="lz-d">Đúng bằng 43 phút mà SLO cho phép, đi tới từ hướng ngược lại — và đó là lý do một lần deploy hỏng là một phần tư ngân sách.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — những con số này đến từ MỘT hộp cát, trên MỘT phiên bản Node, trên phần cứng không phải của bạn.</strong> Phần bền vững là các TỈ LỆ: dấu thời gian lấn át dòng log, RSS không trả lại, CPU% không nhìn thấy một vòng lặp bị chặn, số học của việc lấy mẫu. Các giá trị TUYỆT ĐỐI thì không — một CPU nhanh hơn làm đổi con số 1.310 ns, một nhân hệ điều hành khác làm đổi thông lượng ống, và một cái máy 16 nhân làm cho CPU% nói dối tệ hơn bốn lần chứ không tốt hơn. <strong>Cái nguy hiểm cụ thể là trích một con số tuyệt đối từ đây vào một tài liệu thiết kế, nơi nó trở thành một sự thật không có nguồn gốc và sống lâu hơn cả cái phần cứng nó đến từ đó.</strong> Mọi script đều nằm trong bài của nó; hãy chạy chúng trên máy của bạn, và khi bạn viết kết quả xuống, hãy viết cả ngày tháng, phiên bản Node và số nhân bên cạnh — mà đó chính xác là điều tài liệu của chính kho này làm với các mức giá LLM đã đo, và là lý do những mục ấy tới nay vẫn đáng tin.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — perf_hooks</span><span class="lc-sub">Bộ đồ nghề đo dùng xuyên suốt: hrtime, monitorEventLoopDelay, PerformanceObserver cho GC.</span></span>
</a>
<a class="link-card dl" href="https://github.com/bestiejs/benchmark.js" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">benchmark.js</span><span class="lc-sub">Cho những phép đo cần độ chặt chẽ thống kê thay vì cách hâm-nóng-rồi-lặp đơn giản mà các bài này dùng.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '12.2 — What to build first|||12.2 — Dựng cái gì trước',
      slug: 'obs-12-2-dung-cai-gi-truoc',
      type: 'VIDEO',
      description: 'Một kế hoạch xếp thứ tự cho kho này, từ hai giờ đầu tới tháng thứ ba — và bốn thứ trong đó là sửa lỗi đã tìm ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>What to build first</h2>
<p class="lead">Eleven chapters of capability is a menu, not a plan. This lesson is the ordering — for this repository specifically, and by extension for any single-service Node application on one VPS. Four of the first six items are fixing something this course found by reading the code.</p>

<h3>Hour 1–2: the four defects this course found</h3>
<pre><code>These are not features. They are bugs with names and line
numbers, each fixable in minutes.

1. docker-compose.yml healthcheck: /health → /health/live
   Lesson 8.2. Today a 20-second Postgres stall restarts
   every healthy container. One word.

2. nginx.conf: forward and log $request_id
   Lesson 3.3. Two lines. Today nginx computes an id, logs
   neither it nor Express's, so a 502 and the backend error
   that caused it cannot be joined.

3. logger.ts emit(): read the request context
   Lesson 3.2. One line, plus a 12-line requestContext.ts.
   All 370 existing logger calls gain a requestId.

4. docker-compose.yml: logging max-size/max-file on all 7 services
   Lesson 2.2. Today there is no limit anywhere, compensated
   by a weekly cron that truncates over 200 MB — on the disk
   that holds Postgres.

Everything below this line is new capability. Everything
above it is repair, and repair comes first.</code></pre>

<h3>Day 1: see one request end to end</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Validate the inbound id</span><span class="lz-lnote">Lesson 3.1's pitfall: <code>/^[A-Za-z0-9_-]{8,64}$/</code> or generate your own. Length alone is not enough when the header is attacker-controlled.</span></div>
  <div class="lz-layer"><span class="lz-lname">Return requestId in the error body</span><span class="lz-lnote">Lesson 7.4. A user quoting &quot;ref V1StGXR8_Z5j&quot; turns a support conversation into an exact lookup.</span></div>
  <div class="lz-layer"><span class="lz-lname">One request-completion log line</span><span class="lz-lnote">Route, status, ms, requestId. Not one per layer — lesson 2.5's volume arithmetic is why.</span></div>
  <div class="lz-layer"><span class="lz-lname">The poor man's trace</span><span class="lz-lnote">Lesson 6.5: an array of <code>{name, ms}</code> in the context, emitted as one field. ~80 bytes, catches three of chapter 6's five shapes, no collector.</span></div>
</div>

<h3>Week 1: metrics and the one alert that matters</h3>
<pre><code>1. collectDefaultMetrics + the HTTP middleware (lessons 4.1, 5.5)
   ⚠️ req.route?.path, NOT req.path — lesson 4.4, or bot
   traffic adds permanent series to your Prometheus.
   ⚠️ /metrics bound to the internal network — lesson 4.5.

2. Histogram buckets from YOUR data, not the defaults.
   You now have a day of request logs with ms in them.
   Compute the real p50/p95/p99 once and place boundaries
   around them. Skipping this is the 69% error of lesson 4.3.

3. The external uptime check (lesson 8.5).
   A GitHub Actions cron, every 15 minutes: HTTPS reaches
   the public hostname, certificate has 14+ days, one API
   route returns non-404. This covers the four layers that
   every internal check is blind to.

4. ONE alert: the site is unreachable from outside.
   Not three. One. Get it routing to something that rings,
   and confirm by triggering it deliberately.</code></pre>

<h3>Month 1: the pipeline and the second alert</h3>
<pre><code>1. Ship logs off the machine (lesson 2.3).
   Vector, docker_logs source, tail the FILE — architecture
   A, because the disk is a buffer with tens of gigabytes
   and your heap is not (lesson 1.5).
   ⚠️ Ship EVERY container, filter at query time — lesson
   2.3's pitfall, where include_images hides the nginx log
   during a 502.
   ⚠️ Do NOT label on msg — 325 distinct values, lesson 2.4.

2. Now that rotation and shipping exist, tighten
   max-size to 20m × 2. The two constraints stop fighting.

3. An SLO, chosen honestly (lesson 9.3).
   99.5% for a one-VPS manual-deploy project is defensible.
   99.9% is ambitious. 99.99% is decoration.

4. The second alert: burn rate, two windows (lesson 9.3).
   Every threshold in it derives from the SLO you just
   picked, which is why picking it first matters.</code></pre>

<h3>Month 2–3: depth, in the order the gaps appear</h3>
<pre><code>· Sentry, 5xx only (lesson 7.1), with sendDefaultPii:false,
  a git-SHA release (lesson 7.4), and the request_id tag.
  Verify by triggering a real error and READING the event —
  message, URL, custom context, breadcrumbs (lesson 7.3).

· The three cross-tool links (lesson 10.3), in order:
  ids in logs → alert annotations → derived fields →
  exemplars. Most projects do exemplars first and never
  do ids, which is why theirs open traces with no logs.

· The two dashboards (lesson 10.1): four panels for 3am,
  fifteen for investigation, laid out symptom → process →
  dependency → context.

· OpenTelemetry ONLY when a second service you wrote enters
  the request path (lesson 6.5). The TTS container already
  exists; the moment a request routes through it, the
  trigger has fired.</code></pre>

<h3>What NOT to build, and why</h3>
<pre><code>❌ Self-hosted Sentry / Loki / Tempo on this VPS.
   Lesson 7.5: ~1 GB of RAM on a box already running seven
   containers, and event storage on the disk that had the
   disk-full outage. Your monitoring dies during the
   incident that fills its disk.

❌ A metric per feature "in case".
   Lesson 4.5. Every unused metric is a series, a panel
   nobody reads, and something that looks alarming during
   an incident because nobody knows its normal.

❌ More than three page-level alerts.
   Lesson 9.4. On a team of one, the fourth displaces
   attention from the first three.

❌ Tracing before correlation.
   Lesson 6.5. A trace whose logs cannot be found is a
   waterfall with no explanation attached.</code></pre>

<h3>The order, in one line each</h3>
<pre><code>  hour 1   fix the four defects
  day 1    one request, end to end, in the logs
  week 1   metrics, buckets from your data, one alert
  month 1  ship the logs, pick an SLO, second alert
  month 2  errors with a release, the cross-tool links
  month 3  dashboards; tracing only if a second service appears

Each stage is USEFUL ALONE. That is the property that
matters: an observability project abandoned at week 2
should leave you better off than not starting, and this
ordering guarantees that. A project that goes
"collector → tracing → dashboards → and eventually
correlation" leaves you with infrastructure and no answers.</code></pre>

<div class="pitfall">
<p><strong>Trap — every item above competes with shipping features, and the honest framing is not &quot;quality versus speed&quot;.</strong> The four hour-one fixes take under two hours together and each one removes a specific failure that has already happened to this repository or is one Postgres hiccup away. Framing that as an investment in quality invites it to lose to the next feature, permanently — and it loses in a specific way: the work only gets prioritised <em>after</em> an incident, when it is done under pressure, badly, and only for the thing that just broke. <strong>The accurate framing is that lesson 3.5 measured the difference at six steps and twenty-five minutes versus one query and forty seconds, on one incident.</strong> Two hours of work pays back on the third incident, and there will be a third incident.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/implementing-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Google SRE Workbook — implementing SLOs</span><span class="lc-sub">The month-1 step in detail: choosing an SLI, setting a target you can hold, and deriving alerts from it.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — observability primer</span><span class="lc-sub">The vendor-neutral overview of the same four pillars, useful when you reach the month-3 decision about tracing.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Dựng cái gì trước</h2>
<p class="lead">Mười một chương năng lực là một cái thực đơn, không phải một kế hoạch. Bài này là THỨ TỰ — riêng cho kho này, và mở rộng ra là cho bất cứ ứng dụng Node một-dịch-vụ nào trên một cái VPS. Bốn trong sáu hạng mục đầu tiên là đi sửa một thứ mà khoá học này tìm ra bằng cách đọc mã.</p>

<h3>Giờ 1–2: bốn khiếm khuyết khoá này tìm ra</h3>
<pre><code>Đây không phải tính năng. Đây là những cái LỖI có tên và có số
dòng, mỗi cái sửa được trong vài phút.

1. healthcheck trong docker-compose.yml: /health → /health/live
   Bài 8.2. Hôm nay một cú đứng 20 giây của Postgres khởi động
   lại mọi container khoẻ mạnh. Một từ.

2. nginx.conf: chuyển tiếp và log $request_id
   Bài 3.3. Hai dòng. Hôm nay nginx có tính ra một cái id, không
   log cái của nó lẫn cái của Express, nên một lỗi 502 và cái lỗi
   backend gây ra nó không ghép lại được.

3. emit() trong logger.ts: đọc ngữ cảnh request
   Bài 3.2. Một dòng, cộng một file requestContext.ts 12 dòng.
   Cả 370 lời gọi logger đang có đều có thêm requestId.

4. docker-compose.yml: logging max-size/max-file cho cả 7 dịch vụ
   Bài 2.2. Hôm nay không có giới hạn nào ở đâu cả, bù lại bằng
   một cron hằng tuần cắt cụt những cái quá 200 MB — trên đúng
   cái đĩa chứa Postgres.

Mọi thứ dưới lằn ranh này là NĂNG LỰC MỚI. Mọi thứ trên nó là
SỬA CHỮA, và sửa chữa đi trước.</code></pre>

<h3>Ngày 1: nhìn một request từ đầu tới cuối</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Kiểm cái id đến từ ngoài</span><span class="lz-lnote">Cái bẫy ở bài 3.1: <code>/^[A-Za-z0-9_-]{8,64}$/</code> hoặc tự sinh cái của mình. Chỉ mình độ dài là chưa đủ khi cái header do phía tấn công điều khiển được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trả requestId trong phần thân lỗi</span><span class="lz-lnote">Bài 7.4. Một người dùng trích dẫn &quot;mã V1StGXR8_Z5j&quot; biến một cuộc trò chuyện hỗ trợ thành một phép tra chính xác.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một dòng log kết-thúc-request</span><span class="lz-lnote">Route, status, ms, requestId. Không phải mỗi tầng một dòng — phép tính lượng dữ liệu ở bài 2.5 là lý do.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trace của người nghèo</span><span class="lz-lnote">Bài 6.5: một mảng <code>{name, ms}</code> trong ngữ cảnh, phát ra thành một trường. ~80 byte, bắt được ba trong năm hình dạng của chương 6, không cần collector.</span></div>
</div>

<h3>Tuần 1: chỉ số và một cảnh báo duy nhất đáng có</h3>
<pre><code>1. collectDefaultMetrics + middleware HTTP (bài 4.1, 5.5)
   ⚠️ req.route?.path, KHÔNG phải req.path — bài 4.4, không thì
   lưu lượng bot thêm chuỗi vĩnh viễn vào Prometheus của bạn.
   ⚠️ /metrics trói vào mạng nội bộ — bài 4.5.

2. Ô histogram lấy từ DỮ LIỆU CỦA BẠN, không lấy mặc định.
   Giờ bạn đã có một ngày log request có sẵn trường ms. Hãy tính
   p50/p95/p99 thật một lần rồi đặt biên quanh chúng. Bỏ qua bước
   này chính là cái sai số 69% ở bài 4.3.

3. Phép kiểm thời gian sống từ bên ngoài (bài 8.5).
   Một cron GitHub Actions, mười lăm phút một lần: HTTPS với tới
   được tên miền công khai, chứng chỉ còn 14+ ngày, một route API
   trả về không-404. Cái này phủ bốn tầng mà mọi phép kiểm nội bộ
   đều mù.

4. MỘT cảnh báo: trang không với tới được từ bên ngoài.
   Không phải ba. Một. Hãy cho nó định tuyến tới một thứ reo được,
   rồi xác nhận bằng cách kích hoạt nó một cách có chủ ý.</code></pre>

<h3>Tháng 1: đường ống và cảnh báo thứ hai</h3>
<pre><code>1. Đưa log rời khỏi cái máy (bài 2.3).
   Vector, nguồn docker_logs, tail cái FILE — kiến trúc A, vì cái
   đĩa là một bộ đệm có hàng chục gigabyte còn heap của bạn thì
   không (bài 1.5).
   ⚠️ Thu MỌI container, lọc lúc truy vấn — cái bẫy ở bài 2.3, nơi
   include_images giấu mất log nginx đúng lúc có 502.
   ⚠️ ĐỪNG gắn nhãn theo msg — 325 giá trị khác nhau, bài 2.4.

2. Giờ đã có xoay vòng và có thu log, hãy siết max-size xuống
   20m × 2. Hai ràng buộc thôi đánh nhau.

3. Một SLO, chọn cho trung thực (bài 9.3).
   99,5% cho một dự án một-VPS deploy-thủ-công là bảo vệ được.
   99,9% là đầy tham vọng. 99,99% là đồ trang trí.

4. Cảnh báo thứ hai: tốc độ đốt, hai cửa sổ (bài 9.3).
   Mọi ngưỡng trong đó đều suy ra từ cái SLO bạn vừa chọn, và đó
   là lý do việc chọn nó trước lại quan trọng.</code></pre>

<h3>Tháng 2–3: chiều sâu, theo thứ tự các khoảng trống hiện ra</h3>
<pre><code>· Sentry, chỉ 5xx (bài 7.1), với sendDefaultPii:false, một bản
  phát hành là git SHA (bài 7.4), và cái tag request_id. Hãy xác
  minh bằng cách kích một lỗi thật rồi ĐỌC cái sự kiện — thông
  điệp, URL, ngữ cảnh tự đặt, breadcrumb (bài 7.3).

· Ba mối nối giữa các công cụ (bài 10.3), theo thứ tự:
  id trong log → annotation của cảnh báo → trường dẫn xuất →
  exemplar. Phần lớn dự án làm exemplar trước và không bao giờ
  làm phần id, và đó là lý do exemplar của họ mở ra những trace
  không có log.

· Hai cái bảng theo dõi (bài 10.1): bốn ô cho lúc 3 giờ sáng,
  mười lăm ô cho việc điều tra, bố trí theo triệu chứng → tiến
  trình → phụ thuộc → ngữ cảnh.

· OpenTelemetry CHỈ khi một dịch vụ thứ hai do bạn viết bước vào
  đường request (bài 6.5). Container TTS vốn đã tồn tại; ngay khi
  một request đi xuyên qua nó, cái kích hoạt đã nổ.</code></pre>

<h3>ĐỪNG dựng cái gì, và vì sao</h3>
<pre><code>❌ Tự dựng Sentry / Loki / Tempo trên cái VPS này.
   Bài 7.5: ~1 GB RAM trên một cái máy vốn đã chạy bảy container,
   và lưu sự kiện trên đúng cái đĩa từng có sự cố đầy đĩa. Hệ
   thống theo dõi của bạn chết trong đúng cái sự cố lấp đầy đĩa
   của nó.

❌ Một chỉ số cho mỗi tính năng "để phòng".
   Bài 4.5. Mỗi chỉ số không dùng là một chuỗi, một cái ô không ai
   đọc, và một thứ trông đáng báo động trong lúc sự cố vì chẳng ai
   biết mức bình thường của nó.

❌ Nhiều hơn ba cảnh báo cấp gọi-dậy.
   Bài 9.4. Với một đội một người, cái thứ tư lấy mất sự chú ý
   dành cho ba cái đầu.

❌ Trace trước khi có correlation.
   Bài 6.5. Một cái trace mà không tìm được log của nó là một biểu
   đồ thác không kèm lời giải thích nào.</code></pre>

<h3>Thứ tự, mỗi bước một dòng</h3>
<pre><code>  giờ 1     sửa bốn khiếm khuyết
  ngày 1    một request, từ đầu tới cuối, trong log
  tuần 1    chỉ số, ô lấy từ dữ liệu của bạn, một cảnh báo
  tháng 1   thu log đi, chọn một SLO, cảnh báo thứ hai
  tháng 2   lỗi kèm bản phát hành, các mối nối giữa công cụ
  tháng 3   bảng theo dõi; trace chỉ khi có dịch vụ thứ hai

Mỗi giai đoạn đều HỮU ÍCH KHI ĐỨNG MỘT MÌNH. Đó mới là tính chất
quan trọng: một dự án quan sát bị bỏ dở ở tuần thứ 2 vẫn phải để
bạn khá hơn so với không bắt đầu, và thứ tự này bảo đảm điều đó.
Một dự án đi theo kiểu "collector → trace → bảng theo dõi → rồi
cuối cùng mới correlation" thì để lại cho bạn một đống hạ tầng và
không câu trả lời nào.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — mọi hạng mục ở trên đều cạnh tranh với việc ship tính năng, và cách đặt vấn đề trung thực KHÔNG phải là &quot;chất lượng đấu với tốc độ&quot;.</strong> Bốn cái sửa ở giờ đầu tiên cộng lại tốn dưới hai tiếng và mỗi cái đều gỡ bỏ một cú hỏng CỤ THỂ đã từng xảy ra với kho này hoặc chỉ cách một cú nấc của Postgres. Đặt vấn đề đó thành một khoản đầu tư vào chất lượng là mời gọi nó thua cái tính năng kế tiếp, vĩnh viễn — và nó thua theo một cách rất cụ thể: cái việc ấy chỉ được ưu tiên <em>SAU</em> một sự cố, khi nó được làm dưới áp lực, làm ẩu, và chỉ làm cho đúng cái thứ vừa hỏng. <strong>Cách đặt vấn đề chính xác là: bài 3.5 đã đo được khác biệt là sáu bước và hai mươi lăm phút so với một truy vấn và bốn mươi giây, chỉ trên MỘT sự cố.</strong> Hai tiếng làm việc hoàn vốn ở sự cố thứ ba, và sẽ có một sự cố thứ ba.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/implementing-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Sách bài tập SRE của Google — triển khai SLO</span><span class="lc-sub">Bước tháng-1 chi tiết: chọn một SLI, đặt một mục tiêu bạn giữ được, và suy cảnh báo ra từ nó.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — nhập môn quan sát</span><span class="lc-sub">Bản tổng quan trung lập với nhà cung cấp về đúng bốn trụ cột ấy, hữu ích khi bạn tới quyết định tháng-3 về việc có dùng trace hay không.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '12.3 — Final exam|||12.3 — Bài thi cuối khoá',
      slug: 'obs-12-3-thi-cuoi-khoa',
      type: 'QUIZ',
      description: 'Mười câu trải mười hai chương. Mỗi đáp án là một con số đã đo hoặc một cơ chế cụ thể.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 12 · Final exam</span><h2>Ten questions across twelve chapters</h2><p class="lead">Twenty minutes. Every answer is a measured number or a named mechanism — nothing here is a matter of taste. Six of the ten describe a system that keeps working while telling you nothing, which is the recurring subject of this course.</p></div><div class="ml-vi"><span class="eyebrow">Chương 12 · Thi cuối khoá</span><h2>Mười câu trải mười hai chương</h2><p class="lead">Hai mươi phút. Mọi đáp án đều là một con số đã đo hoặc một cơ chế có tên — không có gì ở đây là chuyện gu thẩm mỹ. Sáu trong mười câu mô tả một hệ thống vẫn chạy trong khi chẳng nói cho bạn điều gì, và đó là chủ đề lặp lại của cả khoá học này.</p></div>`,
      quiz: {
        timeLimitSeconds: 1200,
        questions: [
          {
            question: 'Measured on Node 22, what is the most expensive part of this repo\'s production log line?|||Đo trên Node 22, phần đắt nhất của một dòng log production trong kho này là gì?',
            options: [
              'new Date().toISOString(), at ~740 of the 1,310 ns — more than the JSON.stringify it sits inside. And the write costs more still: 4,985 ns through a pipe, which is what every container uses, bringing the real total to roughly 6,300 ns per line.|||new Date().toISOString(), khoảng 740 trong tổng 1.310 ns — nhiều hơn cả cái JSON.stringify chứa nó. Và phép GHI còn tốn hơn nữa: 4.985 ns qua một cái ống, thứ mà mọi container đều dùng, đưa tổng thực tế lên khoảng 6.300 ns mỗi dòng.',
              'JSON.stringify, which dominates the rest|||JSON.stringify, thứ lấn át phần còn lại',
              'The level check at the top of emit()|||Phép kiểm mức log ở đầu hàm emit()',
              'The context object spread|||Phép trải object ngữ cảnh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A log shipper stalls and your process keeps calling console.log. Who runs out of memory?|||Một trình thu log nghẽn lại và tiến trình của bạn cứ tiếp tục gọi console.log. Ai hết bộ nhớ?',
            options: [
              'Your application. Measured: 400,000 lines with a slow reader pushed RSS from 43 to 122 MB with 47,874,720 bytes queued in process.stdout — no error, no blocking, writableNeedDrain true and unread. In a container fd 1 is always a pipe, so this is the production case, not an edge case.|||Ứng dụng của bạn. Đo được: 400.000 dòng với một bên đọc chậm đẩy RSS từ 43 lên 122 MB với 47.874.720 byte xếp hàng trong process.stdout — không lỗi, không chặn, writableNeedDrain bằng true và chẳng ai đọc. Trong một container thì fd 1 LUÔN là một cái ống, nên đây là trường hợp production chứ không phải một ca hiếm.',
              'The shipper, since it is the one falling behind|||Trình thu log, vì nó mới là cái đang tụt lại',
              'Neither — Node blocks until the reader catches up|||Không ai cả — Node chặn lại cho tới khi bên đọc theo kịp',
              'The kernel, which buffers the pipe|||Nhân hệ điều hành, thứ đệm cái ống lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo generates a request id and returns it in X-Request-ID. Why can\'t you search for it?|||Kho này sinh một request id và trả nó về trong X-Request-ID. Vì sao bạn không tìm được nó?',
            options: [
              'req.id is written once at src/index.ts:225 and read zero times — no logger call includes it, not even errorHandler.ts. And nginx never forwards $request_id, so the middleware\'s "honour an inbound id" branch is dead code in production. Two independent gaps, both checkable by grep.|||req.id được ghi một lần ở src/index.ts:225 và đọc KHÔNG lần nào — không lời gọi logger nào kèm nó, kể cả errorHandler.ts. Và nginx chưa bao giờ chuyển tiếp $request_id, nên cái nhánh "tôn trọng id đến từ ngoài" của middleware là mã chết trên production. Hai khoảng trống độc lập, cả hai đều kiểm được bằng grep.',
              'Because nanoid ids are too short to be unique|||Vì id do nanoid sinh ra quá ngắn nên không duy nhất',
              'Because Loki does not index response headers|||Vì Loki không đánh chỉ mục header phản hồi',
              'Because the id changes on each retry|||Vì cái id đổi ở mỗi lần thử lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Mean latency is 39.5 ms, p50 is 15.2 ms, p99 is 989 ms. What does the mean describe?|||Độ trễ trung bình là 39,5 ms, p50 là 15,2 ms, p99 là 989 ms. Cái trung bình mô tả gì?',
            options: [
              'Nobody. The fast group sits near 15 ms and the slow group near 1,000 ms; the mean lands in the empty gap between them and also understates normal performance by 2.6×. And p95→p99 jumps 45×, so a dashboard showing p95 reports a perfectly healthy service.|||KHÔNG AI cả. Nhóm nhanh nằm quanh 15 ms và nhóm chậm quanh 1.000 ms; cái trung bình rơi vào khoảng trống rỗng giữa hai nhóm và đồng thời nói xấu hiệu năng bình thường 2,6 lần. Và p95→p99 nhảy 45 lần, nên một bảng theo dõi hiện p95 sẽ báo một dịch vụ khoẻ mạnh hoàn hảo.',
              'The typical request, since it is close to p50|||Request điển hình, vì nó gần với p50',
              'The worst case, since it is above p50|||Trường hợp tệ nhất, vì nó cao hơn p50',
              'The service is healthy, since 39.5 ms is fast|||Rằng dịch vụ khoẻ mạnh, vì 39,5 ms là nhanh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You add a userId label to a metric with 224 series. What breaks, and what breaks with it?|||Bạn thêm nhãn userId vào một chỉ số đang có 224 chuỗi. Cái gì vỡ, và cái gì vỡ theo?',
            options: [
              '2,240,000 series and ~6.4 GB — more than the VPS has — because series count is a PRODUCT. Prometheus then OOM-loops through WAL replay, scrapes time out, and EVERY other metric loses data too, during the incident the label was added to diagnose.|||2.240.000 chuỗi và ~6,4 GB — nhiều hơn cả cái VPS có — vì số chuỗi là một TÍCH. Prometheus rồi lặp vòng bị OOM giết trong lúc phát lại WAL, các lượt quét hết giờ, và MỌI chỉ số khác cũng mất dữ liệu, đúng trong cái sự cố mà cái nhãn ấy được thêm vào để chẩn đoán.',
              'Only that metric, which is acceptable if you need per-user data|||Chỉ mình chỉ số đó, và như thế chấp nhận được nếu bạn cần dữ liệu theo người dùng',
              'Nothing measurable until you exceed 10 million series|||Không gì đo được cho tới khi bạn vượt 10 triệu chuỗi',
              'Query speed only; storage is unaffected|||Chỉ tốc độ truy vấn; lưu trữ không bị ảnh hưởng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Node process blocks 200 ms per turn on a 4-core VPS. What does each metric say?|||Một tiến trình Node chặn 200 ms mỗi vòng trên một VPS 4 nhân. Mỗi chỉ số nói gì?',
            options: [
              'Machine CPU reads 23.8% — it looks idle — while event-loop lag p99 reads 201 ms, tracking the stall exactly. CPU% also cannot distinguish 50 ms of blocking from 200 ms (91% vs 95%), and p50 lag stays at 1.1 ms in both cases, which is why the default mean-lag metric is useless as an alert.|||CPU toàn máy đọc ra 23,8% — trông như nhàn rỗi — trong khi p99 độ trễ vòng lặp đọc 201 ms, bám chính xác cú đơ. CPU% cũng không phân biệt nổi chặn 50 ms với 200 ms (91% so với 95%), và p50 độ trễ giữ nguyên 1,1 ms ở cả hai trường hợp, và đó là lý do cái chỉ số độ-trễ-trung-bình mặc định vô dụng khi làm cảnh báo.',
              'CPU reads 100% and lag reads 200 ms — both correct|||CPU đọc 100% và độ trễ đọc 200 ms — cả hai đều đúng',
              'Both metrics are flat, since blocking is not measured|||Cả hai chỉ số đều phẳng, vì việc chặn thì không đo được',
              'CPU reads 95% on the machine, which is the useful number|||CPU đọc 95% trên toàn máy, và đó là con số hữu ích',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'heapUsed returns to 4 MB after GC but RSS stays at 140 MB. Leak or not?|||heapUsed về lại 4 MB sau GC nhưng RSS ở nguyên 140 MB. Rò rỉ hay không?',
            options: [
              'Not a leak. V8 does not return freed pages to the OS, so RSS is a high-water mark and a rising-never-falling RSS graph is the normal healthy shape. The leak signature is the rising BOTTOM of the heapUsed sawtooth over hours — most commonly an unbounded module-level Map used as a cache.|||Không phải rò rỉ. V8 không trả các trang đã giải phóng lại cho hệ điều hành, nên RSS là một mốc nước cao nhất và một đồ thị RSS chỉ-lên-không-xuống là hình dạng khoẻ mạnh bình thường. Chữ ký của rò rỉ là ĐÁY của răng cưa heapUsed dâng lên qua nhiều giờ — phổ biến nhất là một cái Map cấp module không có chặn dùng làm bộ nhớ đệm.',
              'A leak — 136 MB was never freed|||Rò rỉ — 136 MB chưa bao giờ được giải phóng',
              'Cannot tell without knowing external|||Không nói được nếu chưa biết external',
              'A leak, but only if it persists across restarts|||Rò rỉ, nhưng chỉ khi nó còn sau các lần khởi động lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your Docker healthcheck curls /health, which runs SELECT 1. Postgres stalls for 20 seconds. What happens?|||Healthcheck Docker của bạn gọi /health, thứ chạy SELECT 1. Postgres đứng 20 giây. Chuyện gì xảy ra?',
            options: [
              'Three probes fail in 30 seconds, Docker kills a perfectly healthy Node process, the new container immediately opens nine pool connections into a recovering database, in-flight requests become 502s, and the container log explaining the stall is discarded with the old container. The fix is one word: /health/live.|||Ba lượt thăm dò trượt trong 30 giây, Docker giết một tiến trình Node hoàn toàn khoẻ mạnh, container mới lập tức mở chín kết nối bể vào một cơ sở dữ liệu đang hồi phục, các request đang bay thành 502, và cái log container giải thích cú đứng bị vứt đi cùng container cũ. Cách chữa là một từ: /health/live.',
              'The probe fails once and Docker waits for recovery|||Lượt thăm dò trượt một lần và Docker chờ nó hồi phục',
              'Nothing — Docker only logs unhealthy status|||Không gì cả — Docker chỉ ghi lại trạng thái không khoẻ',
              'Traffic is routed away, which is the correct behaviour|||Lưu lượng được định tuyến đi chỗ khác, và đó là hành vi đúng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'With a 99.9% SLO, how long does a total outage take to exhaust the monthly error budget?|||Với một SLO 99,9%, một sự cố toàn phần mất bao lâu để đốt cạn ngân sách lỗi của cả tháng?',
            options: [
              '43 minutes — burning at 1000×, which is exactly the 43 minutes of downtime the SLO permits over 30 days, arriving from the other direction. Which is why one bad deploy needing a ten-minute rollback spends a quarter of the month, and why 99.99% (4 minutes) is not achievable with manual deploys on one VPS.|||43 phút — đốt với hệ số 1000×, mà đó chính xác là 43 phút thời gian chết mà SLO cho phép trên 30 ngày, đi tới từ hướng ngược lại. Đó là lý do một lần deploy hỏng cần quay lui mười phút tiêu mất một phần tư cả tháng, và là lý do 99,99% (4 phút) không đạt được với deploy thủ công trên một cái VPS.',
              'About a week, since the budget is 0.1% of requests|||Khoảng một tuần, vì ngân sách là 0,1% số request',
              '7.2 hours, the same as a 99% SLO|||7,2 giờ, giống một SLO 99%',
              'It depends on traffic volume|||Còn tuỳ lưu lượng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Across four real incidents in this repository, what did all four have in common?|||Xuyên suốt bốn sự cố thật trong kho này, cả bốn có điểm chung gì?',
            options: [
              'None was diagnosed by reading code — all four were found by observing behaviour (a status code, a Network tab, a restart period, a production run), three had a one-command check that would have ended them in under a minute, and every one produced a permanent new check. Two of them passed every gate they had while covering nothing.|||Không cái nào được chẩn đoán bằng cách đọc mã — cả bốn đều được tìm ra bằng cách quan sát hành vi (một mã trạng thái, một tab Network, một chu kỳ khởi động lại, một lượt chạy trên production), ba cái có một phép kiểm một-lệnh lẽ ra đã kết thúc chúng trong chưa tới một phút, và cái nào cũng sinh ra một phép kiểm mới vĩnh viễn. Hai trong số đó qua sạch mọi cổng kiểm chúng có trong khi những cổng ấy chẳng phủ được gì.',
              'All four were caused by a deploy|||Cả bốn đều do một lần deploy gây ra',
              'All four were found by an alert|||Cả bốn đều được một cảnh báo tìm ra',
              'All four required a rollback to resolve|||Cả bốn đều phải quay lui mới xử lý được',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
