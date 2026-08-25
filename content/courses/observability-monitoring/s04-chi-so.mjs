/**
 * Observability — Chương 4 — Chỉ số: đếm cái mà log không đếm nổi.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 4 — Metrics: counting what logs cannot|||Chương 4 — Chỉ số: đếm cái mà log không đếm nổi',
  slug: 'obs-ch4-chi-so',
  description: 'Bốn loại chỉ số, trung bình giấu đuôi, histogram, lực lượng nhãn, và tín hiệu vàng.',
  sortOrder: 5,
  lessons: [
    {
      title: '4.1 — What a metric is, and the four kinds|||4.1 — Chỉ số là gì, và bốn loại của nó',
      slug: 'obs-4-1-bon-loai-chi-so',
      type: 'VIDEO',
      description: 'Counter, gauge, histogram, summary — chọn sai loại thì con số bạn nhận về là vô nghĩa, không phải sai lệch.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>What a metric is, and the four kinds</h2>
<p class="lead">A log line is an event. A metric is a number that has been aggregated <em>before</em> it was stored — and that word &quot;before&quot; is the whole difference. It is why a metric costs a few bytes where a log costs 157, and why some questions it simply cannot answer.</p>

<h3>The trade you are making</h3>
<pre><code>LOG                              METRIC
one row per event                one number per (name, labels, time)

157 bytes × every request        ~3 KB per SERIES, forever,
= 5.13 GB/day at 50 rps          regardless of traffic

Can answer: "what happened to    Can answer: "how many, how fast,
request V1StGXR8_Z5j?"           how full — over time?"

CANNOT answer cheaply:           CANNOT answer at all:
"what is p99 over 30 days?"      "why did THIS request fail?"
(lesson 2.4 showed the query —
 it reads and sorts everything)</code></pre>
<p>Neither replaces the other. The skill is knowing, before you build, which pillar a question belongs to — because the wrong choice is not slightly inefficient, it is a thousand times more expensive or flatly impossible.</p>

<h3>The four kinds</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Counter</span><span class="lz-t">Only ever goes up</span><span class="lz-d">Requests served, errors, bytes sent, jobs completed. Resets to zero when the process restarts — which is fine, because you never read a counter directly, you read its <em>rate</em>.</span></div>
  <div class="lz-node"><span class="lz-k">Gauge</span><span class="lz-t">Goes up and down</span><span class="lz-d">Memory in use, active connections, queue depth, temperature. A snapshot of &quot;right now&quot;. The only kind where the raw value is meaningful on its own.</span></div>
  <div class="lz-node"><span class="lz-k">Histogram</span><span class="lz-t">Counts observations into buckets</span><span class="lz-d">Request durations, response sizes. Buckets are chosen in advance; each is a counter. Percentiles are computed from them at query time — lesson 4.3.</span></div>
  <div class="lz-node"><span class="lz-k">Summary</span><span class="lz-t">Computes percentiles in the process</span><span class="lz-d">Looks like a histogram and behaves very differently: the quantiles are calculated per instance and <strong>cannot be added across instances</strong>. Usually the wrong choice — see the pitfall.</span></div>
</div>

<h3>Counters: why the reset does not matter</h3>
<pre><code class="language-javascript">// You NEVER read a counter's value. You read its rate.
http_requests_total{route="/api/v1/notes",code="200"}  →  1,284,993

// That number means nothing. It is "since this process started".
// This is the number you actually want:

rate(http_requests_total[5m])          →  47.2 requests/second

// rate() knows that a DECREASE means a restart, and handles it.
// That is why "counters only go up" is a rule and not a suggestion:
// break it and rate() reads your decrement as a restart.</code></pre>
<pre><code>Getting this wrong, concretely:

  ❌ activeUsers.inc() on login, activeUsers.dec() on logout,
     declared as a Counter.
     → every logout looks like a process restart to rate(),
       and your request-rate graph grows spikes that are not real.

  ✅ Declare it a Gauge. Gauges are allowed to go down.</code></pre>

<h3>Gauges: the only kind you read directly</h3>
<pre><code class="language-javascript">// Node process metrics are almost all gauges
process_resident_memory_bytes        142_606_336
nodejs_eventloop_lag_p99_seconds     0.0012
nodejs_active_handles                47
db_pool_connections_in_use           8

// Sampled, not accumulated. Which means a spike BETWEEN
// two samples is invisible — a gauge scraped every 15s
// cannot see a 200ms burst. If the spike matters, count
// it with a counter or bucket it with a histogram instead.</code></pre>

<h3>Choosing, in one table</h3>
<pre><code>The question you want to answer        The kind

"How many X happened?"                  Counter
"How often is X happening?"             Counter + rate()
"What fraction of X failed?"            two Counters, divided
"How much X is there right now?"        Gauge
"How long does X take?"                 Histogram
"What is p99 of X?"                     Histogram
"What is p99 of X on ONE instance,
 and I will never aggregate it?"        Summary (rare)</code></pre>

<h3>How this repo would emit its first one</h3>
<pre><code class="language-typescript">// src/metrics.ts — prom-client, the standard Node library
import { Counter, Histogram, register } from 'prom-client';

export const httpRequests = new Counter({
  name: 'http_requests_total',                    // _total suffix: convention
  help: 'HTTP requests handled',
  labelNames: ['method', 'route', 'code'] as const,
});

export const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',          // SECONDS, not ms: convention
  help: 'HTTP request duration',
  labelNames: ['method', 'route'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});</code></pre>
<pre><code class="language-typescript">// src/index.ts — one middleware, after the request-id middleware
app.use((req, res, next) =&gt; {
  const end = httpDuration.startTimer({ method: req.method });
  res.on('finish', () =&gt; {
    const route = req.route?.path ?? 'unmatched';   // ⚠️ NOT req.path — lesson 4.4
    end({ route });
    httpRequests.inc({ method: req.method, route, code: String(res.statusCode) });
  });
  next();
});</code></pre>
<p>Two conventions in there that are worth following rather than arguing with: durations are in <em>seconds</em> as a float, and counters end in <code>_total</code>. Every dashboard, alert rule and example query you will ever copy assumes both.</p>

<div class="pitfall">
<p><strong>Trap — a Summary's quantiles cannot be averaged, added, or combined in any way.</strong> This is the one metric mistake that survives review, because the resulting graph looks entirely plausible. A Summary computes p99 <em>inside each process</em>, so with two backend containers you have two p99 values — and there is no arithmetic that turns them into the p99 of the combined traffic. Averaging them is meaningless: the mean of two 99th percentiles is not the 99th percentile of anything. Taking the max is a different wrong answer. <strong>The graph will show a number, it will move when load moves, and it will be wrong in a way no dashboard can reveal.</strong> Histograms do not have this problem — their buckets are counters, counters add, and the percentile is computed after summing. Use a Histogram unless you can state out loud why aggregation will never be needed.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/concepts/metric_types/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Prometheus — the four metric types</span><span class="lc-sub">The canonical definitions, including the histogram-versus-summary comparison that the pitfall above is drawn from.</span></span>
</a>
<a class="link-card dl" href="https://github.com/siimon/prom-client" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">prom-client — Prometheus for Node.js</span><span class="lc-sub">The library used throughout this chapter, including the default process metrics that chapter 5 turns on.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Chỉ số là gì, và bốn loại của nó</h2>
<p class="lead">Một dòng log là một sự kiện. Một chỉ số là một con số đã được gộp lại <em>trước khi</em> được lưu — và cái chữ &quot;trước khi&quot; ấy là toàn bộ khác biệt. Nó là lý do một chỉ số tốn vài byte trong khi một dòng log tốn 157, và là lý do có những câu hỏi nó đơn giản là không trả lời được.</p>

<h3>Cái bạn đang đánh đổi</h3>
<pre><code>LOG                              CHỈ SỐ
một hàng cho mỗi sự kiện         một số cho mỗi (tên, nhãn, thời điểm)

157 byte × mọi request           ~3 KB cho mỗi CHUỖI, mãi mãi,
= 5,13 GB/ngày ở mức 50 rps      bất kể lưu lượng bao nhiêu

Trả lời được: "request            Trả lời được: "bao nhiêu, nhanh cỡ
V1StGXR8_Z5j đã ra sao?"          nào, đầy tới đâu — theo thời gian?"

KHÔNG trả lời rẻ được:            KHÔNG trả lời được, chấm hết:
"p99 của 30 ngày là bao nhiêu?"   "vì sao CÁI request này hỏng?"
(bài 2.4 đã cho thấy truy vấn —
 nó đọc và sắp xếp tất cả)</code></pre>
<p>Không cái nào thay được cái nào. Kỹ năng ở đây là biết, TRƯỚC KHI dựng, một câu hỏi thuộc về trụ cột nào — vì chọn sai không phải là kém hiệu quả một chút, mà là đắt gấp nghìn lần hoặc bất khả thi hoàn toàn.</p>

<h3>Bốn loại</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Counter</span><span class="lz-t">Chỉ đi lên</span><span class="lz-d">Số request đã phục vụ, số lỗi, số byte đã gửi, số công việc đã xong. Về không khi tiến trình khởi động lại — và thế là ổn, vì bạn không bao giờ đọc thẳng một counter, bạn đọc <em>tốc độ</em> của nó.</span></div>
  <div class="lz-node"><span class="lz-k">Gauge</span><span class="lz-t">Lên rồi xuống được</span><span class="lz-d">Bộ nhớ đang dùng, số kết nối đang mở, độ sâu hàng đợi, nhiệt độ. Một ảnh chụp của &quot;ngay lúc này&quot;. Là loại duy nhất mà giá trị thô tự nó đã có nghĩa.</span></div>
  <div class="lz-node"><span class="lz-k">Histogram</span><span class="lz-t">Đếm quan sát vào các ô</span><span class="lz-d">Thời lượng request, kích thước phản hồi. Các ô được chọn trước; mỗi ô là một counter. Phân vị được tính từ chúng lúc truy vấn — bài 4.3.</span></div>
  <div class="lz-node"><span class="lz-k">Summary</span><span class="lz-t">Tính phân vị ngay trong tiến trình</span><span class="lz-d">Trông giống histogram và hành xử rất khác: các phân vị được tính theo từng thực thể và <strong>KHÔNG cộng lại được giữa các thực thể</strong>. Thường là lựa chọn sai — xem cái bẫy.</span></div>
</div>

<h3>Counter: vì sao việc reset không quan trọng</h3>
<pre><code class="language-javascript">// Bạn KHÔNG BAO GIỜ đọc giá trị của một counter. Bạn đọc tốc độ của nó.
http_requests_total{route="/api/v1/notes",code="200"}  →  1.284.993

// Con số ấy chẳng có nghĩa gì. Nó là "kể từ khi tiến trình này khởi động".
// Đây mới là con số bạn thật sự muốn:

rate(http_requests_total[5m])          →  47,2 request/giây

// rate() biết rằng GIẢM nghĩa là một lần khởi động lại, và nó xử lý được.
// Đó là lý do "counter chỉ đi lên" là một luật chứ không phải một gợi ý:
// phá nó thì rate() đọc phép giảm của bạn thành một lần khởi động lại.</code></pre>
<pre><code>Làm sai chuyện này, cụ thể:

  ❌ activeUsers.inc() lúc đăng nhập, activeUsers.dec() lúc đăng xuất,
     mà khai báo là Counter.
     → với rate(), mỗi lần đăng xuất trông như một lần khởi động lại,
       và đồ thị tốc độ request của bạn mọc ra những cái gai không có thật.

  ✅ Khai nó là Gauge. Gauge thì được phép đi xuống.</code></pre>

<h3>Gauge: loại duy nhất bạn đọc thẳng</h3>
<pre><code class="language-javascript">// Chỉ số của tiến trình Node gần như toàn là gauge
process_resident_memory_bytes        142_606_336
nodejs_eventloop_lag_p99_seconds     0.0012
nodejs_active_handles                47
db_pool_connections_in_use           8

// Được lấy mẫu, không phải tích luỹ. Nghĩa là một cái gai GIỮA hai lần
// lấy mẫu thì vô hình — một gauge quét 15 giây một lần không thấy được
// một cơn dồn 200ms. Nếu cái gai đó quan trọng thì hãy đếm nó bằng một
// counter hoặc chia ô nó bằng một histogram.</code></pre>

<h3>Chọn loại, trong một bảng</h3>
<pre><code>Câu hỏi bạn muốn trả lời               Loại

"Có bao nhiêu X đã xảy ra?"             Counter
"X đang xảy ra với tần suất nào?"       Counter + rate()
"Bao nhiêu phần trăm X đã hỏng?"        hai Counter, đem chia
"Ngay lúc này có bao nhiêu X?"          Gauge
"X mất bao lâu?"                        Histogram
"p99 của X là bao nhiêu?"               Histogram
"p99 của X trên MỘT thực thể, và tôi
 sẽ không bao giờ gộp nó?"              Summary (hiếm)</code></pre>

<h3>Kho này sẽ phát ra cái chỉ số đầu tiên thế nào</h3>
<pre><code class="language-typescript">// src/metrics.ts — prom-client, thư viện chuẩn của Node
import { Counter, Histogram, register } from 'prom-client';

export const httpRequests = new Counter({
  name: 'http_requests_total',                    // hậu tố _total: quy ước
  help: 'HTTP requests handled',
  labelNames: ['method', 'route', 'code'] as const,
});

export const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',          // GIÂY, không phải ms: quy ước
  help: 'HTTP request duration',
  labelNames: ['method', 'route'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});</code></pre>
<pre><code class="language-typescript">// src/index.ts — một middleware, đặt sau middleware request-id
app.use((req, res, next) =&gt; {
  const end = httpDuration.startTimer({ method: req.method });
  res.on('finish', () =&gt; {
    const route = req.route?.path ?? 'unmatched';   // ⚠️ KHÔNG phải req.path — bài 4.4
    end({ route });
    httpRequests.inc({ method: req.method, route, code: String(res.statusCode) });
  });
  next();
});</code></pre>
<p>Có hai quy ước trong đó đáng theo hơn là đáng cãi: thời lượng tính bằng <em>giây</em> dạng số thực, và counter kết thúc bằng <code>_total</code>. Mọi bảng theo dõi, luật cảnh báo và câu truy vấn mẫu bạn sẽ chép về đều giả định cả hai.</p>

<div class="pitfall">
<p><strong>Bẫy — phân vị của một Summary không lấy trung bình được, không cộng được, không kết hợp được bằng bất cứ cách nào.</strong> Đây là sai lầm về chỉ số sống sót qua được vòng review, vì cái đồ thị nó tạo ra trông hoàn toàn hợp lý. Một Summary tính p99 <em>bên trong từng tiến trình</em>, nên với hai container backend bạn có hai giá trị p99 — và không có phép tính nào biến chúng thành p99 của lưu lượng gộp lại. Lấy trung bình chúng là vô nghĩa: trung bình của hai phân vị 99 không phải phân vị 99 của bất cứ thứ gì. Lấy max là một câu trả lời sai kiểu khác. <strong>Đồ thị sẽ hiện ra một con số, nó sẽ nhúc nhích khi tải nhúc nhích, và nó sai theo một cách mà không bảng theo dõi nào lộ ra được.</strong> Histogram không dính vấn đề này — các ô của nó là counter, counter thì cộng được, và phân vị được tính sau khi cộng. Hãy dùng Histogram, trừ khi bạn nói thành lời được vì sao sẽ không bao giờ cần gộp.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/concepts/metric_types/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Prometheus — bốn loại chỉ số</span><span class="lc-sub">Định nghĩa gốc, kèm phần so sánh histogram với summary mà cái bẫy ở trên rút ra từ đó.</span></span>
</a>
<a class="link-card dl" href="https://github.com/siimon/prom-client" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">prom-client — Prometheus cho Node.js</span><span class="lc-sub">Thư viện dùng xuyên suốt chương này, kể cả bộ chỉ số tiến trình mặc định mà chương 5 sẽ bật lên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '4.2 — The average is a lie, and here is the measurement|||4.2 — Trung bình là một lời nói dối, và đây là phép đo',
      slug: 'obs-4-2-trung-binh-noi-doi',
      type: 'VIDEO',
      description: 'Đo trên 100.000 request: trung bình 39,5 ms trong khi p99 là 989 ms. 2.940 người dùng vô hình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The average is a lie, and here is the measurement</h2>
<p class="lead">Every default dashboard leads with an average response time. It is the single most misleading number in operations, and the reason is not subtle statistics — it is that averages are designed to hide exactly the thing you are looking for.</p>

<h3>The measurement</h3>
<p>One hundred thousand simulated requests, with the shape real traffic has: most fast, a small tail slow. Nothing exotic — a cache-hit majority and a cache-miss minority is enough to produce it.</p>
<pre><code class="language-javascript">// m7.mjs — realistic latency distribution, then every statistic
const lat = [];
for (let i = 0; i &lt; 100_000; i++) {
  lat.push(Math.random() &lt; 0.97
    ? 8 + Math.random() * 20             // 97%: cache hit, 8–28 ms
    : 700 + Math.random() * 600);        //  3%: cache miss + slow query
}
lat.sort((a, b) =&gt; a - b);
const q = p =&gt; lat[Math.floor(lat.length * p)];
</code></pre>
<div class="out">$ node m7.mjs
n = 100,000 request
trung bình     39.5 ms      ← con số duy nhất mà bảng theo dõi mặc định hiện ra
p50            15.2 ms
p90            21.0 ms
p95            21.7 ms
p99           989.4 ms
p99.9        1269.5 ms
max          1299.7 ms

số request &gt; 200 ms: 2,940 (2.9%)</div>

<h3>Read those seven numbers as seven different claims</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The average, 39.5 ms, describes nobody</span><span class="lz-d">Not one request in a hundred thousand took 39.5 ms. The fast group is around 15, the slow group around 1,000. The average sits in the empty gap between them.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">p50 is 15.2 ms — the typical experience is 2.6× better than the average</span><span class="lz-d">So the average also understates how good the service normally is. It is not conservative; it is simply wrong in both directions at once.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">p90 to p95 barely moves: 21.0 → 21.7 ms</span><span class="lz-d">Nine out of ten users have an excellent experience, and it stays excellent well into the tail. This is the number that makes people confident.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">p95 to p99 jumps 45×: 21.7 → 989.4 ms</span><span class="lz-d">The entire failure lives between the 95th and 99th percentile. A dashboard showing p95 would show a perfectly healthy service — this is why p95 is not enough.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">2,940 requests over 200 ms, per 100,000</span><span class="lz-d">At that traffic per hour, that is 2,940 people every hour waiting almost a second. The average mentions none of them.</span></div>
</div>

<h3>Why averages hide tails, mechanically</h3>
<pre><code>An average divides the total by the count. So a slow request
is diluted by every fast one that ran alongside it.

  99,000 requests at   15 ms  =  1,485,000 ms
   1,000 requests at 1000 ms  =  1,000,000 ms
                                ─────────────
  100,000 requests             =  2,485,000 ms  →  avg 24.9 ms

Now make the tail TEN TIMES WORSE — 10 full seconds:

  99,000 × 15 ms   =  1,485,000
   1,000 × 10000ms = 10,000,000
                     ──────────
                    11,485,000  →  avg 114.9 ms

The user experience became catastrophic. The average moved
from 25 ms to 115 ms — still under a tenth of a second, still
green on every dashboard with a 200 ms threshold.

More traffic makes this WORSE: the more fast requests you
serve, the more thoroughly they hide the slow ones.</code></pre>
<p>That last line is the cruel part. Averages get less informative exactly as you succeed and grow — the metric degrades as the system it measures gets bigger.</p>

<h3>What to put on the dashboard instead</h3>
<pre><code>p50   the typical experience. If this rises, EVERYONE is
      affected — usually a resource problem, not a bug.

p95   the unlucky-but-common experience. Rising p95 with a
      flat p50 means a subset of work is slow: one route,
      one query, one shard, one kind of input.

p99   where real problems live and where SLOs are written.
      Watch it next to p50: the GAP is the signal.

max   almost always useless on a dashboard. One request from
      a bot with a 300-second timeout owns this number forever.
      Useful in an incident, misleading on a wall.</code></pre>
<pre><code class="language-promql"># Prometheus: p50 and p99 side by side from ONE histogram
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# The gap itself, as a single graph — this is the one worth alerting on
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
  /
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))</code></pre>
<p>That ratio is a good first alert because it is scale-free: it stays flat whether you serve ten requests a second or ten thousand, and it moves when the <em>shape</em> of your latency changes, which is what an incident actually looks like.</p>

<h3>The one number people forget entirely</h3>
<pre><code>Every percentile above describes SUCCESSFUL requests.

A request that timed out at 30 seconds and returned 502
often is not in the histogram at all — it never reached
res.on('finish') with a normal path, or it was recorded
under a different route label.

So the failure mode is this:

   latency p99 IMPROVES during an outage
                    ▲
                    │ because the slow requests are now
                    │ FAILING FAST instead of succeeding slowly

Always put the error RATE on the same panel as latency.
Neither number means anything without the other.</code></pre>

<div class="pitfall">
<p><strong>Trap — you cannot average percentiles across time buckets, and every dashboard invites you to.</strong> Grafana shows a p99 line at one point per pixel; when you zoom out from one hour to seven days, it must combine buckets, and the naive combination is a mean of p99 values. That number is not the p99 of the week — it is the average of hourly p99s, which is systematically lower and gets lower the further you zoom out. <strong>The practical symptom is that an incident visibly shrinks as you widen the time range, so a week-long view of a bad week looks calm.</strong> With Prometheus histograms this is avoidable and the fix is mechanical: aggregate the <em>buckets</em> over the wider range and compute the quantile last — <code>histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval])))</code> — never take a quantile and then average it.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.brendangregg.com/blog/2018-02-09/kpti-kaiser-meltdown-performance.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — measuring latency properly</span><span class="lc-sub">A worked performance investigation showing why distributions, not averages, are what you reason from.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Prometheus — histograms and quantiles in practice</span><span class="lc-sub">Why the quantile is computed last, the error bounds it carries, and the aggregation rule from the pitfall above.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Trung bình là một lời nói dối, và đây là phép đo</h2>
<p class="lead">Mọi bảng theo dõi mặc định đều mở đầu bằng thời gian phản hồi trung bình. Nó là con số gây hiểu lầm nhất trong vận hành, và lý do không nằm ở thống kê tinh vi — nó nằm ở chỗ trung bình được thiết kế để che đi đúng cái thứ bạn đang tìm.</p>

<h3>Phép đo</h3>
<p>Một trăm nghìn request mô phỏng, với hình dạng mà lưu lượng thật có: đa số nhanh, một cái đuôi nhỏ chậm. Chẳng có gì kỳ lạ — đa số trúng cache và thiểu số trượt cache là đủ tạo ra nó.</p>
<pre><code class="language-javascript">// m7.mjs — phân bố độ trễ thực tế, rồi tính mọi thống kê
const lat = [];
for (let i = 0; i &lt; 100_000; i++) {
  lat.push(Math.random() &lt; 0.97
    ? 8 + Math.random() * 20             // 97%: trúng cache, 8–28 ms
    : 700 + Math.random() * 600);        //  3%: trượt cache + truy vấn chậm
}
lat.sort((a, b) =&gt; a - b);
const q = p =&gt; lat[Math.floor(lat.length * p)];
</code></pre>
<div class="out">$ node m7.mjs
n = 100,000 request
trung bình     39.5 ms      ← con số duy nhất mà bảng theo dõi mặc định hiện ra
p50            15.2 ms
p90            21.0 ms
p95            21.7 ms
p99           989.4 ms
p99.9        1269.5 ms
max          1299.7 ms

số request &gt; 200 ms: 2,940 (2.9%)</div>

<h3>Đọc bảy con số đó như bảy khẳng định khác nhau</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cái trung bình 39,5 ms mô tả KHÔNG AI cả</span><span class="lz-d">Không một request nào trong một trăm nghìn mất 39,5 ms. Nhóm nhanh quanh 15, nhóm chậm quanh 1.000. Cái trung bình nằm ở khoảng trống rỗng giữa hai nhóm.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">p50 là 15,2 ms — trải nghiệm điển hình tốt hơn trung bình 2,6 lần</span><span class="lz-d">Vậy nên cái trung bình cũng nói xấu dịch vụ của bạn lúc bình thường. Nó không phải bảo thủ; nó đơn giản là sai theo cả hai hướng cùng lúc.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">p90 tới p95 nhích rất ít: 21,0 → 21,7 ms</span><span class="lz-d">Chín trên mười người dùng có trải nghiệm xuất sắc, và nó vẫn xuất sắc khi đã đi sâu vào đuôi. Đây là con số làm người ta yên tâm.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">p95 sang p99 nhảy 45 lần: 21,7 → 989,4 ms</span><span class="lz-d">Toàn bộ cú hỏng nằm giữa phân vị 95 và 99. Một bảng theo dõi hiện p95 sẽ cho thấy một dịch vụ khoẻ mạnh hoàn hảo — đó là lý do p95 là chưa đủ.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">2.940 request vượt 200 ms, trên mỗi 100.000</span><span class="lz-d">Ở mức lưu lượng đó mỗi giờ, tức là mỗi giờ có 2.940 người chờ gần một giây. Cái trung bình không nhắc tới một ai trong số họ.</span></div>
</div>

<h3>Vì sao trung bình che đuôi, xét về cơ chế</h3>
<pre><code>Trung bình là lấy tổng chia cho số lượng. Nên một request chậm
bị pha loãng bởi mọi request nhanh chạy cạnh nó.

  99.000 request ở    15 ms  =  1.485.000 ms
   1.000 request ở  1000 ms  =  1.000.000 ms
                                ─────────────
  100.000 request            =  2.485.000 ms  →  TB 24,9 ms

Giờ làm cái đuôi TỆ GẤP MƯỜI LẦN — thành 10 giây tròn:

  99.000 × 15 ms   =  1.485.000
   1.000 × 10000ms = 10.000.000
                     ──────────
                     11.485.000  →  TB 114,9 ms

Trải nghiệm người dùng trở nên thảm hoạ. Cái trung bình đi từ
25 ms lên 115 ms — vẫn dưới một phần mười giây, vẫn màu xanh
trên mọi bảng theo dõi có ngưỡng 200 ms.

Càng nhiều lưu lượng thì chuyện này càng TỆ: bạn phục vụ càng
nhiều request nhanh thì chúng càng che kỹ mấy cái chậm.</code></pre>
<p>Dòng cuối cùng mới là chỗ tàn nhẫn. Trung bình càng ít thông tin đúng vào lúc bạn thành công và lớn lên — cái thước tự xuống cấp khi hệ thống nó đo phình to ra.</p>

<h3>Thay vào đó thì để gì lên bảng theo dõi</h3>
<pre><code>p50   trải nghiệm điển hình. Cái này tăng thì MỌI NGƯỜI bị
      ảnh hưởng — thường là vấn đề tài nguyên, không phải lỗi mã.

p95   trải nghiệm xui-nhưng-hay-gặp. p95 tăng mà p50 phẳng
      nghĩa là một nhóm công việc bị chậm: một route, một truy
      vấn, một mảnh dữ liệu, một loại đầu vào.

p99   nơi các vấn đề thật sự sống và nơi SLO được viết ra.
      Hãy nhìn nó cạnh p50: KHOẢNG CÁCH mới là tín hiệu.

max   gần như luôn vô dụng trên bảng theo dõi. Một request từ
      một con bot với ngưỡng 300 giây sẽ sở hữu con số này mãi
      mãi. Hữu ích lúc gỡ sự cố, gây hiểu lầm khi treo tường.</code></pre>
<pre><code class="language-promql"># Prometheus: p50 và p99 cạnh nhau từ MỘT histogram
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# Chính cái khoảng cách, thành một đồ thị — đây mới là cái đáng cảnh báo
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
  /
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))</code></pre>
<p>Cái tỉ số đó là một cảnh báo đầu tiên tốt vì nó không phụ thuộc quy mô: nó nằm phẳng dù bạn phục vụ mười request mỗi giây hay mười nghìn, và nó nhúc nhích khi <em>hình dạng</em> độ trễ của bạn đổi, mà đó chính là bộ dạng thật của một sự cố.</p>

<h3>Con số mà người ta quên sạch</h3>
<pre><code>Mọi phân vị ở trên đều mô tả những request THÀNH CÔNG.

Một request hết giờ ở giây thứ 30 rồi trả về 502 thường KHÔNG
nằm trong histogram — nó không đi tới res.on('finish') theo
đường bình thường, hoặc nó được ghi dưới một nhãn route khác.

Nên kiểu hỏng là thế này:

   p99 độ trễ TỐT LÊN trong lúc đang có sự cố
                    ▲
                    │ vì mấy request chậm giờ HỎNG NHANH
                    │ thay vì thành công chậm

Hãy luôn để TỈ LỆ LỖI trên cùng một panel với độ trễ.
Không con số nào có nghĩa nếu thiếu con số kia.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bạn không lấy trung bình các phân vị theo khoảng thời gian được, mà mọi bảng theo dõi đều mời bạn làm thế.</strong> Grafana vẽ đường p99 mỗi điểm ảnh một điểm dữ liệu; khi bạn thu tầm nhìn từ một giờ ra bảy ngày, nó buộc phải gộp các khoảng, và phép gộp ngây thơ là lấy trung bình các giá trị p99. Con số ấy không phải p99 của tuần — nó là trung bình của các p99 theo giờ, thứ luôn thấp hơn một cách có hệ thống và càng thu tầm nhìn ra càng thấp. <strong>Triệu chứng thực tế là một sự cố TEO NHỎ LẠI thấy rõ khi bạn nới khoảng thời gian, nên một tuần tồi tệ nhìn ở tầm một tuần lại trông êm ả.</strong> Với histogram của Prometheus thì chuyện này tránh được và cách chữa là máy móc: hãy gộp các <em>ô</em> trên khoảng rộng hơn rồi tính phân vị sau cùng — <code>histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval])))</code> — đừng bao giờ lấy phân vị trước rồi mới lấy trung bình.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.brendangregg.com/blog/2018-02-09/kpti-kaiser-meltdown-performance.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — đo độ trễ cho đúng</span><span class="lc-sub">Một cuộc điều tra hiệu năng làm sẵn cho thấy vì sao thứ bạn suy luận từ đó phải là phân bố chứ không phải trung bình.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Prometheus — histogram và phân vị trong thực tế</span><span class="lc-sub">Vì sao phân vị được tính sau cùng, sai số nó mang theo, và luật gộp ở cái bẫy trên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '4.3 — Histograms: a percentile for 104 bytes|||4.3 — Histogram: một phân vị với giá 104 byte',
      slug: 'obs-4-3-histogram',
      type: 'VIDEO',
      description: 'Đo thật: histogram nhỏ hơn 76.923 lần — nhưng ô mặc định cho sai số 69% ở p95. Cách chọn ô.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Histograms: a percentile for 104 bytes</h2>
<p class="lead">Lesson 4.2 established that you need p50 and p99, not an average. This lesson is about how you get them without storing every request — and about a failure mode nobody warns you about, where the histogram gives you a percentile that is 69% wrong and looks completely normal.</p>

<h3>The mechanism</h3>
<pre><code>A histogram is a row of counters, one per bucket boundary.
Prometheus buckets are CUMULATIVE — "le" means less-or-equal:

  http_request_duration_seconds_bucket{le="0.005"}   12,043
  http_request_duration_seconds_bucket{le="0.01"}    98,221
  http_request_duration_seconds_bucket{le="0.025"}  941,006   ← 94% land here
  http_request_duration_seconds_bucket{le="0.05"}   970,012
  http_request_duration_seconds_bucket{le="0.1"}    970,088
  ...
  http_request_duration_seconds_bucket{le="+Inf"} 1,000,000
  http_request_duration_seconds_sum                 39,512.4
  http_request_duration_seconds_count             1,000,000

Observing a request = incrementing every bucket it fits in.
Nothing is stored per request. The size never grows with traffic.

Because buckets are counters, they ADD across instances —
which is exactly why histograms aggregate and summaries do not.</code></pre>

<h3>Measurement: the size difference</h3>
<pre><code class="language-javascript">// m11.mjs — one million samples, then compare the two storage strategies
const BUCKETS = [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10];
const N = 1_000_000;
// ...observe every sample into the buckets, then compute quantiles both ways
</code></pre>
<div class="out">lưu MỌI mẫu (8 byte/mẫu): 7.6 MB   — và vẫn phải sắp xếp để hỏi
lưu histogram:             104 byte  — 13 số, bất kể N
tỉ lệ:                     76,923× nhỏ hơn</div>
<p>Thirteen numbers — eleven buckets plus <code>_sum</code> and <code>_count</code> — answer every percentile question about a million requests. And the 104 bytes is a constant: ten million requests would still be 104 bytes. That is the entire argument for metrics over the log query in lesson 2.4.</p>

<h3>Measurement: and now the part nobody mentions</h3>
<p>The same run, comparing the histogram's answer to the true percentile computed from the sorted samples:</p>
<div class="out">$ node m11.mjs
phân vị      chính xác     từ histogram    sai số
p50          18.3 ms          18.3 ms      0.1%
p90          26.6 ms          38.0 ms     43.2%
p95          27.6 ms          46.6 ms     68.9%
p99        1101.4 ms        1506.8 ms     36.8%
p99.9      1279.6 ms        2400.7 ms     87.6%</div>
<p>Read p95: the truth is 27.6 ms and the histogram reports 46.6 ms. Not a rounding error — <strong>69% wrong</strong>, using prom-client's default buckets, on an ordinary latency distribution. The p99.9 is off by 88%.</p>

<h3>Why, and it is not a bug</h3>
<pre><code>histogram_quantile interpolates LINEARLY inside the bucket
that contains the target. It has no other information.

Our traffic is bimodal: a cluster at 8–28 ms and a cluster
at 700–1300 ms. Look where the default boundaries fall:

  0.025 ─┐
         │  ← 94% of all requests are in HERE, and the next
  0.05  ─┘    boundary is at 50 ms. Everything between 25 and
              50 ms is one undifferentiated blob, so p90 and
              p95 get interpolated across a 25 ms-wide gap.

  1.0   ─┐
         │  ← the ENTIRE slow cluster (700–1300 ms) sits in
  2.5   ─┘    this one bucket. p99 and p99.9 are interpolated
              across a 1.5-SECOND-wide gap.

The interpolation assumes samples are spread evenly inside a
bucket. Ours are not — they are clumped at one end. The wider
the bucket relative to where the data actually sits, the more
wrong the answer, and the error is SILENT.</code></pre>

<h3>Measurement: choosing buckets fixes it</h3>
<pre><code class="language-javascript">// m12.mjs — same data, three bucket strategies
test('prom-client defaults',    [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10]);
test('chosen from measured p*', [0.005,0.01,0.015,0.02,0.025,0.03,0.05,0.1,
                                 0.3,0.6,0.8,1.0,1.2,1.4,2,5]);
test('exponential, factor 1.7', Array.from({length:16},(_,i)=&gt;0.004*Math.pow(1.7,i)));
</code></pre>
<div class="out">$ node m12.mjs
mặc định prom-client           11 ô   sai số tối đa 68.9%   p95: 46.6ms so với 27.6ms
chọn theo phân bố đo được      16 ô   sai số tối đa 6.3%   p95: 29.3ms so với 27.6ms
cấp số nhân (hệ số 1,7)        16 ô   sai số tối đa 18.7%   p95: 32.7ms so với 27.6ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Five extra buckets take the error from 69% to 6.3%</span><span class="lz-d">Sixteen numbers instead of eleven. The storage difference is 40 bytes per series; the accuracy difference is an order of magnitude.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Exponential buckets are the good default when you do not know the shape</span><span class="lz-d">18.7% error with zero knowledge of the distribution. Worse than tuned, far better than the defaults, and it degrades gracefully when traffic changes.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Buckets must be dense where your data actually is</span><span class="lz-d">The tuned set is dense at 5–30 ms and again at 300–1400 ms, because that is where the two clusters live. This is why you measure first and choose buckets second.</span></div>
</div>

<h3>How to choose them for a real service</h3>
<pre><code>1. Log the duration for a day. You already do — lesson 1.4's
   request-completion line has ms in it.

2. Compute the real p50, p90, p95, p99, p99.9 from those logs.
   ONE expensive query, once. This is the right use of the
   query lesson 2.4 warned you not to put on a dashboard.

3. Place boundaries so each of those percentiles has a narrow
   bucket AROUND it, not a wide one containing it.

4. Add headroom at the top. If p99.9 is 1.3s, have boundaries
   at 2s and 5s — an incident pushes latency somewhere your
   normal buckets never reach, and "+Inf" tells you nothing
   except "worse than 5 seconds".

5. Keep it under ~20 boundaries. Each one is a time series
   per label combination — lesson 4.4 explains what that
   multiplies into.</code></pre>
<pre><code class="language-typescript">// src/metrics.ts — buckets derived from measurement, with a comment saying so
export const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'] as const,
  // Measured 2026-08-25 from a day of request logs: p50 15ms, p95 28ms,
  // p99 990ms (cache-miss path). Dense at both clusters, headroom to 5s.
  buckets: [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.05, 0.1,
            0.3, 0.6, 0.8, 1.0, 1.2, 1.4, 2, 5],
});</code></pre>

<div class="pitfall">
<p><strong>Trap — changing a histogram's buckets breaks every historical comparison, silently.</strong> The bucket boundaries are part of the metric's identity: <code>le="0.025"</code> is a different time series from <code>le="0.03"</code>. When you deploy new buckets, the old series stop receiving data and the new ones start from zero, so <code>histogram_quantile</code> over a range that spans the deploy computes from whichever boundaries exist in each part of the window — and returns a number for both. <strong>The graph does not break; it bends, and the bend looks exactly like a real latency change at exactly the moment you deployed.</strong> That is how a bucket change gets misdiagnosed as a performance regression caused by whatever else shipped that day. Change buckets deliberately, note the date where your alert thresholds are defined, and do not trust a percentile graph across that boundary.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/practices/histograms/#errors-of-quantile-estimation" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Prometheus — errors of quantile estimation</span><span class="lc-sub">The official statement of the interpolation error this lesson measured, and the bound it can be trusted within.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/mimir/latest/references/architecture/native-histograms/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Native histograms</span><span class="lc-sub">The newer format that chooses resolution automatically, removing the bucket-selection problem this lesson is about.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Histogram: một phân vị với giá 104 byte</h2>
<p class="lead">Bài 4.2 đã xác lập rằng bạn cần p50 và p99, không cần trung bình. Bài này nói về cách lấy chúng mà không phải lưu từng request — và về một kiểu hỏng chẳng ai cảnh báo bạn, khi histogram đưa cho bạn một phân vị sai 69% mà trông hoàn toàn bình thường.</p>

<h3>Cơ chế</h3>
<pre><code>Một histogram là một hàng counter, mỗi biên một cái.
Ô của Prometheus là TÍCH LUỸ — "le" nghĩa là nhỏ hơn hoặc bằng:

  http_request_duration_seconds_bucket{le="0.005"}   12.043
  http_request_duration_seconds_bucket{le="0.01"}    98.221
  http_request_duration_seconds_bucket{le="0.025"}  941.006   ← 94% rơi vào đây
  http_request_duration_seconds_bucket{le="0.05"}   970.012
  http_request_duration_seconds_bucket{le="0.1"}    970.088
  ...
  http_request_duration_seconds_bucket{le="+Inf"} 1.000.000
  http_request_duration_seconds_sum                 39.512,4
  http_request_duration_seconds_count             1.000.000

Quan sát một request = tăng mọi cái ô mà nó lọt vào.
Không có gì được lưu cho từng request. Kích thước không phình
theo lưu lượng.

Vì ô là counter nên chúng CỘNG được giữa các thực thể — và đó
chính là lý do histogram gộp được còn summary thì không.</code></pre>

<h3>Phép đo: khác biệt về kích thước</h3>
<pre><code class="language-javascript">// m11.mjs — một triệu mẫu, rồi so hai chiến lược lưu trữ
const BUCKETS = [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10];
const N = 1_000_000;
// ...quan sát mọi mẫu vào các ô, rồi tính phân vị theo cả hai cách
</code></pre>
<div class="out">lưu MỌI mẫu (8 byte/mẫu): 7.6 MB   — và vẫn phải sắp xếp để hỏi
lưu histogram:             104 byte  — 13 số, bất kể N
tỉ lệ:                     76,923× nhỏ hơn</div>
<p>Mười ba con số — mười một ô cộng <code>_sum</code> và <code>_count</code> — trả lời mọi câu hỏi về phân vị của một triệu request. Và 104 byte ấy là một hằng số: mười triệu request thì vẫn là 104 byte. Đó là toàn bộ lý lẽ chọn chỉ số thay cho câu truy vấn log ở bài 2.4.</p>

<h3>Phép đo: và giờ tới phần chẳng ai nhắc</h3>
<p>Cùng lượt chạy đó, so câu trả lời của histogram với phân vị thật tính từ các mẫu đã sắp xếp:</p>
<div class="out">$ node m11.mjs
phân vị      chính xác     từ histogram    sai số
p50          18.3 ms          18.3 ms      0.1%
p90          26.6 ms          38.0 ms     43.2%
p95          27.6 ms          46.6 ms     68.9%
p99        1101.4 ms        1506.8 ms     36.8%
p99.9      1279.6 ms        2400.7 ms     87.6%</div>
<p>Hãy đọc dòng p95: sự thật là 27,6 ms và histogram báo 46,6 ms. Không phải sai số làm tròn — <strong>sai 69%</strong>, với bộ ô mặc định của prom-client, trên một phân bố độ trễ hết sức bình thường. Cái p99.9 thì lệch 88%.</p>

<h3>Vì sao, và đó không phải một lỗi</h3>
<pre><code>histogram_quantile NỘI SUY TUYẾN TÍNH bên trong cái ô chứa
mục tiêu. Nó không có thông tin nào khác.

Lưu lượng của ta có hai cụm: một cụm ở 8–28 ms và một cụm ở
700–1300 ms. Hãy nhìn xem biên mặc định rơi vào đâu:

  0.025 ─┐
         │  ← 94% số request nằm TRONG ĐÂY, và cái biên kế tiếp
  0.05  ─┘    ở tận 50 ms. Mọi thứ giữa 25 và 50 ms là một cục
              không phân biệt được, nên p90 và p95 bị nội suy
              qua một khoảng trống rộng 25 ms.

  1.0   ─┐
         │  ← TOÀN BỘ cụm chậm (700–1300 ms) nằm gọn trong một
  2.5   ─┘    cái ô này. p99 và p99.9 bị nội suy qua một khoảng
              trống rộng 1,5 GIÂY.

Phép nội suy giả định các mẫu rải đều trong một ô. Mẫu của ta
thì không — chúng dồn cục ở một đầu. Ô càng rộng so với chỗ dữ
liệu thật sự nằm thì câu trả lời càng sai, và sai TRONG IM LẶNG.</code></pre>

<h3>Phép đo: chọn ô cho tử tế thì chữa được</h3>
<pre><code class="language-javascript">// m12.mjs — cùng dữ liệu, ba chiến lược chọn ô
test('mặc định prom-client',   [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10]);
test('chọn từ p* đã đo',       [0.005,0.01,0.015,0.02,0.025,0.03,0.05,0.1,
                                0.3,0.6,0.8,1.0,1.2,1.4,2,5]);
test('cấp số nhân, hệ số 1,7', Array.from({length:16},(_,i)=&gt;0.004*Math.pow(1.7,i)));
</code></pre>
<div class="out">$ node m12.mjs
mặc định prom-client           11 ô   sai số tối đa 68.9%   p95: 46.6ms so với 27.6ms
chọn theo phân bố đo được      16 ô   sai số tối đa 6.3%   p95: 29.3ms so với 27.6ms
cấp số nhân (hệ số 1,7)        16 ô   sai số tối đa 18.7%   p95: 32.7ms so với 27.6ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Thêm năm cái ô kéo sai số từ 69% xuống 6,3%</span><span class="lz-d">Mười sáu con số thay vì mười một. Khác biệt lưu trữ là 40 byte mỗi chuỗi; khác biệt độ chính xác là một bậc độ lớn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ô cấp số nhân là mặc định tốt khi bạn chưa biết hình dạng</span><span class="lz-d">Sai số 18,7% với không một chút hiểu biết nào về phân bố. Tệ hơn bộ đã chỉnh, tốt hơn hẳn bộ mặc định, và nó xuống cấp một cách nhẹ nhàng khi lưu lượng đổi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ô phải DÀY ở đúng chỗ dữ liệu của bạn nằm</span><span class="lz-d">Bộ đã chỉnh dày ở 5–30 ms và dày lại ở 300–1400 ms, vì đó là chỗ hai cụm sống. Đây là lý do bạn đo trước rồi mới chọn ô sau.</span></div>
</div>

<h3>Chọn ô cho một dịch vụ thật</h3>
<pre><code>1. Log thời lượng trong một ngày. Bạn vốn đã làm — dòng
   kết-thúc-request của bài 1.4 có sẵn trường ms.

2. Tính p50, p90, p95, p99, p99.9 THẬT từ mấy cái log đó.
   MỘT truy vấn đắt, một lần duy nhất. Đây mới là chỗ dùng
   đúng cái truy vấn mà bài 2.4 dặn đừng treo lên bảng.

3. Đặt biên sao cho mỗi phân vị đó có một cái ô HẸP QUANH nó,
   chứ không phải một cái ô rộng chứa nó.

4. Chừa chỗ ở phía trên. Nếu p99.9 là 1,3s thì hãy có biên ở
   2s và 5s — một sự cố đẩy độ trễ tới chỗ mà bộ ô bình thường
   không với tới, và "+Inf" chẳng nói gì ngoài "tệ hơn 5 giây".

5. Giữ dưới khoảng 20 biên. Mỗi cái là một chuỗi thời gian cho
   mỗi tổ hợp nhãn — bài 4.4 giải thích cái đó nhân lên thành gì.</code></pre>
<pre><code class="language-typescript">// src/metrics.ts — ô suy ra từ phép đo, kèm chú thích nói rõ thế
export const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'] as const,
  // Đo 25/08/2026 từ một ngày log request: p50 15ms, p95 28ms,
  // p99 990ms (đường trượt cache). Dày ở cả hai cụm, chừa chỗ tới 5s.
  buckets: [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.05, 0.1,
            0.3, 0.6, 0.8, 1.0, 1.2, 1.4, 2, 5],
});</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đổi bộ ô của một histogram làm hỏng mọi phép so sánh với quá khứ, trong im lặng.</strong> Biên của ô là một phần danh tính của chỉ số: <code>le="0.025"</code> là một chuỗi thời gian khác với <code>le="0.03"</code>. Khi bạn deploy bộ ô mới, những chuỗi cũ ngừng nhận dữ liệu còn những chuỗi mới bắt đầu từ không, nên <code>histogram_quantile</code> trên một khoảng vắt qua lần deploy sẽ tính từ bất cứ bộ biên nào tồn tại ở từng phần của cửa sổ — và trả về một con số cho cả hai. <strong>Đồ thị không gãy; nó CONG, và cái chỗ cong ấy trông y hệt một thay đổi độ trễ thật vào đúng cái lúc bạn deploy.</strong> Đó là cách một lần đổi ô bị chẩn đoán nhầm thành một cú tụt hiệu năng do bất cứ thứ gì khác lên cùng ngày hôm đó. Hãy đổi ô một cách có chủ ý, ghi ngày lại ở chỗ định nghĩa ngưỡng cảnh báo, và đừng tin một đồ thị phân vị vắt qua cái ranh giới ấy.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/practices/histograms/#errors-of-quantile-estimation" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Prometheus — sai số của phép ước lượng phân vị</span><span class="lc-sub">Lời tuyên bố chính thức về đúng cái sai số nội suy mà bài này đo được, và cái biên mà nó đáng tin trong đó.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/mimir/latest/references/architecture/native-histograms/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Native histogram</span><span class="lc-sub">Định dạng mới hơn tự chọn độ phân giải, gỡ bỏ luôn bài toán chọn ô mà bài này nói tới.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '4.4 — Cardinality: how you take down your own monitoring|||4.4 — Lực lượng nhãn: cách bạn tự làm sập hệ thống theo dõi của mình',
      slug: 'obs-4-4-luc-luong-nhan',
      type: 'VIDEO',
      description: 'Đo thật: thêm userId vào một nhãn biến 224 chuỗi thành 2,24 triệu và 0,6 MB thành 6,4 GB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Cardinality: how you take down your own monitoring</h2>
<p class="lead">Lesson 2.4 measured the label-cardinality trap in Loki. The same trap exists in Prometheus and it is considerably more dangerous there, because Prometheus holds every active series in memory. This is the single most common way a monitoring system is destroyed, and it is always destroyed by someone trying to make it more useful.</p>

<h3>The multiplication</h3>
<pre><code>A "time series" is one metric name plus one exact combination
of label VALUES. Every combination is a separate series with
its own memory, its own index entry, its own chunks.

  http_requests_total{method="GET", route="/notes", code="200"}
  http_requests_total{method="GET", route="/notes", code="404"}
  http_requests_total{method="POST",route="/notes", code="201"}
       ▲                   ▲              ▲            ▲
       one metric name     └──────────────┴────────────┘
                              three labels, MULTIPLIED

  8 methods × 28 routes × 10 codes = 2,240 series.
  Add one histogram with 16 buckets = 35,840 more.

The count is a PRODUCT. Adding one label multiplies; it never
adds. That is the whole reason this fails so spectacularly.</code></pre>

<h3>The measurement</h3>
<pre><code class="language-javascript">// m6.mjs — start from a sane label set, then add one label at a time
const routes = 28, methods = 8, codes = 10;
const base = routes * methods;                    // route + method + code
// then multiply by userId (10k), by real note ids (200k), by ms timestamps
// ~3 KB per series is the commonly cited Prometheus figure
</code></pre>
<div class="out">$ node m6.mjs
nhãn                             chuỗi thời gian   RAM ước lượng   nhận xét
─────────────────────────────────────────────────────────────────────────────
route + method + code                        224          0.6 MB   đúng
+ userId (10k người dùng)              2,240,000       6408.7 MB   SAI
+ id ghi chú thật (200k)               5,600,000      16021.7 MB   SAI
+ dấu thời gian mili giây          2,764,800,000    7910156.3 MB   SAI hoàn toàn</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">224 series, 0.6 MB — this is correct and costs nothing</span><span class="lz-d">All three labels are bounded: you can write down every value they will ever take. This set answers almost every operational question you have.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">One userId label: 6.4 GB</span><span class="lz-d">Ten thousand users multiplies everything by ten thousand. This exceeds the entire RAM of the VPS, and it was added by someone who wanted to see per-user latency.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Un-normalised paths: 16 GB</span><span class="lz-d">This one is an accident, not a decision — using <code>req.path</code> instead of <code>req.route.path</code> makes <code>/api/v1/notes/abc123</code> its own route. Two hundred thousand notes, two hundred thousand routes.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A timestamp label: 7.9 <em>petabytes</em></span><span class="lz-d">Unbounded in time, so the number has no ceiling — it grows forever at a fixed rate. Absurd, and it happens: someone adds a <code>ts</code> label so they can &quot;see exactly when&quot;.</span></div>
</div>

<h3>The accident in this repository's shape</h3>
<pre><code class="language-typescript">// Lesson 4.1's middleware had this line. It is the whole lesson:
const route = req.route?.path ?? 'unmatched';    // ✅ '/notes/:id'
// NOT:
const route = req.path;                          // ❌ '/notes/abc123'</code></pre>
<pre><code>This repo has 945 route declarations. With req.route.path
that is at most 945 label values — large but bounded and
finite. With req.path it is one value per distinct URL ever
requested, which includes:

  · every note id, every user profile, every course slug
  · every 404 from a scanner probing /wp-admin, /.env,
    /phpmyadmin — bots generate THOUSANDS of unique paths
    per day and each becomes a permanent series

That last point is worth sitting with: the 'unmatched'
fallback is not defensive tidiness. Without it, anyone on
the internet can add series to your Prometheus by making
requests to URLs that do not exist.</code></pre>

<h3>What happens when you cross the line</h3>
<pre><code>Prometheus does not fail gracefully. In order:

1. Memory climbs. Every active series is resident.
2. Scrapes slow, because the /metrics response now has
   millions of lines to serialise.
3. Scrapes TIME OUT. You now have gaps in every metric,
   including the ones that were fine.
4. Prometheus is OOM-killed.
5. It restarts, replays the WAL, and is killed again
   while replaying. This loop can continue for hours.
6. Your monitoring is down during the incident that
   the high-cardinality metric was added to diagnose.

Note step 3: the damage is not limited to the bad metric.
One high-cardinality label breaks every other metric in
the same Prometheus.</code></pre>

<h3>What to do with the data you actually wanted</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Per-user latency?</span><span class="lz-t">That is a log, not a metric</span><span class="lz-d">Log the duration with the userId field (subject to lesson 1.2), and query it when you need it. Logs are per-event by design; that is what they cost 157 bytes for.</span></div>
  <div class="lz-node"><span class="lz-k">Which user is slowest?</span><span class="lz-t">That is a trace</span><span class="lz-d">Chapter 6. Sample a fraction of requests fully, and you get per-request detail without a series per user.</span></div>
  <div class="lz-node"><span class="lz-k">Per-tenant metrics, genuinely needed?</span><span class="lz-t">Bound it deliberately</span><span class="lz-d">A label with your ten largest customers by name and <code>other</code> for everyone else. Eleven values, forever, regardless of growth.</span></div>
  <div class="lz-node"><span class="lz-k">Just want to see the outliers?</span><span class="lz-t">A histogram already tells you</span><span class="lz-d">You do not need to know <em>who</em> was slow to know that 3% of requests exceed 200 ms and to go find them in the logs.</span></div>
</div>

<h3>A rule you can apply before writing the label</h3>
<pre><code>Before adding a label, answer out loud:

  "What is the maximum number of distinct values this
   can EVER have, and what makes that a maximum?"

  method      8. The HTTP spec.                      ✅
  code        ~40. The HTTP spec.                    ✅
  route       945. The number of route declarations. ✅
  cache_hit   2. Boolean.                            ✅

  userId      unbounded — grows with signups.        ❌
  noteId      unbounded — grows with usage.          ❌
  requestId   unbounded — one per request.           ❌❌
  error_msg   unbounded — includes interpolated
              values, ids, filenames.                ❌❌

If the answer contains "it depends" or "however many
users we have", it is not a label. It is a log field.</code></pre>

<div class="pitfall">
<p><strong>Trap — an error message is the highest-cardinality label there is, and it looks like the most useful one.</strong> <code>errors_total{message="..."}</code> is a natural thing to write and it detonates immediately, because real error messages carry interpolated data: <code>connect ETIMEDOUT 10.0.0.5:5432</code>, <code>Cannot read property 'x' of undefined at line 42</code>, <code>Invalid note id abc123</code>. Every distinct id, IP, port and filename becomes a permanent series, so the metric grows fastest exactly when the system is failing most — the moment you most need Prometheus alive is the moment your error metric is killing it. <strong>Label with a bounded error <em>class</em> you assign yourself</strong> — <code>errors_total{kind="db_timeout"}</code>, <code>kind="validation"</code>, <code>kind="upstream_5xx"</code> — and keep the message in the log line, where lesson 3.2's requestId will let you find it.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/practices/naming/#labels" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Prometheus — metric and label naming</span><span class="lc-sub">The official guidance including the explicit warning to keep label cardinality bounded, and the conventions from lesson 4.1.</span></span>
</a>
<a class="link-card dl" href="https://www.robustperception.io/cardinality-is-key/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Robust Perception — cardinality is key</span><span class="lc-sub">The classic write-up on why the count is a product, from the people who ran Prometheus in production longest.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Lực lượng nhãn: cách bạn tự làm sập hệ thống theo dõi của mình</h2>
<p class="lead">Bài 2.4 đã đo cái bẫy lực lượng nhãn trong Loki. Cái bẫy ấy cũng có trong Prometheus và ở đó nó nguy hiểm hơn đáng kể, vì Prometheus giữ mọi chuỗi đang hoạt động trong bộ nhớ. Đây là cách phổ biến nhất để một hệ thống theo dõi bị phá huỷ, và nó luôn bị phá huỷ bởi một người đang cố làm cho nó hữu ích hơn.</p>

<h3>Phép nhân</h3>
<pre><code>Một "chuỗi thời gian" là một tên chỉ số cộng một tổ hợp CHÍNH XÁC
các GIÁ TRỊ nhãn. Mỗi tổ hợp là một chuỗi riêng với bộ nhớ riêng,
mục chỉ mục riêng, chunk riêng.

  http_requests_total{method="GET", route="/notes", code="200"}
  http_requests_total{method="GET", route="/notes", code="404"}
  http_requests_total{method="POST",route="/notes", code="201"}
       ▲                   ▲              ▲            ▲
       một tên chỉ số      └──────────────┴────────────┘
                              ba nhãn, đem NHÂN với nhau

  8 method × 28 route × 10 mã = 2.240 chuỗi.
  Thêm một histogram 16 ô = 35.840 chuỗi nữa.

Con số là một TÍCH. Thêm một nhãn là NHÂN lên; không bao giờ là
cộng. Đó là toàn bộ lý do chuyện này hỏng một cách ngoạn mục.</code></pre>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m6.mjs — bắt đầu từ một bộ nhãn tỉnh táo, rồi thêm từng nhãn một
const routes = 28, methods = 8, codes = 10;
const base = routes * methods;                    // route + method + code
// rồi nhân với userId (10k), với id ghi chú thật (200k), với dấu thời gian ms
// ~3 KB mỗi chuỗi là con số thường được nêu cho Prometheus
</code></pre>
<div class="out">$ node m6.mjs
nhãn                             chuỗi thời gian   RAM ước lượng   nhận xét
─────────────────────────────────────────────────────────────────────────────
route + method + code                        224          0.6 MB   đúng
+ userId (10k người dùng)              2,240,000       6408.7 MB   SAI
+ id ghi chú thật (200k)               5,600,000      16021.7 MB   SAI
+ dấu thời gian mili giây          2,764,800,000    7910156.3 MB   SAI hoàn toàn</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">224 chuỗi, 0,6 MB — cái này đúng và chẳng tốn gì</span><span class="lz-d">Cả ba nhãn đều có chặn: bạn viết ra được mọi giá trị chúng sẽ từng nhận. Bộ này trả lời gần như mọi câu hỏi vận hành bạn có.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một cái nhãn userId: 6,4 GB</span><span class="lz-d">Mười nghìn người dùng nhân mọi thứ lên mười nghìn lần. Con số này vượt toàn bộ RAM của cái VPS, và nó được thêm vào bởi một người muốn xem độ trễ theo từng người dùng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đường dẫn chưa gộp: 16 GB</span><span class="lz-d">Cái này là tai nạn, không phải quyết định — dùng <code>req.path</code> thay vì <code>req.route.path</code> làm cho <code>/api/v1/notes/abc123</code> thành một route riêng. Hai trăm nghìn ghi chú, hai trăm nghìn route.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Một cái nhãn dấu thời gian: 7,9 <em>petabyte</em></span><span class="lz-d">Không có chặn theo thời gian, nên con số không có trần — nó phình mãi với một tốc độ cố định. Phi lý, và nó vẫn xảy ra: ai đó thêm một nhãn <code>ts</code> để &quot;xem chính xác lúc nào&quot;.</span></div>
</div>

<h3>Cái tai nạn ở đúng hình dạng của kho này</h3>
<pre><code class="language-typescript">// Middleware ở bài 4.1 có dòng này. Nó là toàn bộ bài học:
const route = req.route?.path ?? 'unmatched';    // ✅ '/notes/:id'
// KHÔNG PHẢI:
const route = req.path;                          // ❌ '/notes/abc123'</code></pre>
<pre><code>Kho này có 945 khai báo route. Với req.route.path thì đó là
tối đa 945 giá trị nhãn — lớn nhưng CÓ CHẶN và hữu hạn. Với
req.path thì đó là một giá trị cho mỗi URL khác nhau từng được
yêu cầu, trong đó có:

  · mọi id ghi chú, mọi hồ sơ người dùng, mọi slug khoá học
  · mọi lỗi 404 từ một con bot đang dò /wp-admin, /.env,
    /phpmyadmin — bot sinh ra HÀNG NGHÌN đường dẫn khác nhau
    mỗi ngày và mỗi cái thành một chuỗi vĩnh viễn

Điểm cuối cùng đáng ngồi lại một lúc: cái nhánh dự phòng
'unmatched' không phải sự gọn gàng phòng thân. Không có nó,
bất cứ ai trên Internet cũng thêm được chuỗi vào Prometheus của
bạn bằng cách gọi tới những URL không tồn tại.</code></pre>

<h3>Chuyện gì xảy ra khi bạn vượt lằn ranh</h3>
<pre><code>Prometheus không hỏng một cách nhẹ nhàng. Theo thứ tự:

1. Bộ nhớ leo lên. Mọi chuỗi đang hoạt động đều nằm trong RAM.
2. Việc quét chậm lại, vì phản hồi /metrics giờ có hàng triệu
   dòng phải tuần tự hoá.
3. Việc quét HẾT GIỜ. Giờ bạn có lỗ hổng trong MỌI chỉ số,
   kể cả những cái vốn vẫn ổn.
4. Prometheus bị OOM giết.
5. Nó khởi động lại, phát lại WAL, rồi lại bị giết trong lúc
   đang phát lại. Vòng lặp này kéo dài hàng giờ được.
6. Hệ thống theo dõi của bạn CHẾT trong đúng cái sự cố mà cái
   chỉ số lực lượng cao kia được thêm vào để chẩn đoán.

Để ý bước 3: thiệt hại không giới hạn ở cái chỉ số tồi. Một
cái nhãn lực lượng cao làm hỏng MỌI chỉ số khác trong cùng một
Prometheus.</code></pre>

<h3>Làm gì với cái dữ liệu bạn thật sự muốn</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Độ trễ theo người dùng?</span><span class="lz-t">Đó là một cái log, không phải chỉ số</span><span class="lz-d">Hãy log thời lượng kèm trường userId (theo đúng bài 1.2), rồi truy vấn khi cần. Log vốn thiết kế để ghi theo từng sự kiện; đó là thứ 157 byte của nó mua được.</span></div>
  <div class="lz-node"><span class="lz-k">Người dùng nào chậm nhất?</span><span class="lz-t">Đó là một cái trace</span><span class="lz-d">Chương 6. Lấy mẫu đầy đủ một phần nhỏ số request, và bạn có chi tiết theo từng request mà không cần một chuỗi cho mỗi người dùng.</span></div>
  <div class="lz-node"><span class="lz-k">Chỉ số theo khách hàng, thật sự cần?</span><span class="lz-t">Hãy chặn nó một cách có chủ ý</span><span class="lz-d">Một cái nhãn gồm mười khách hàng lớn nhất theo tên và <code>other</code> cho tất cả những người còn lại. Mười một giá trị, mãi mãi, bất kể lớn tới đâu.</span></div>
  <div class="lz-node"><span class="lz-k">Chỉ muốn thấy mấy ca ngoại lệ?</span><span class="lz-t">Histogram đã nói cho bạn rồi</span><span class="lz-d">Bạn không cần biết <em>ai</em> chậm mới biết được rằng 3% số request vượt 200 ms, rồi đi tìm họ trong log.</span></div>
</div>

<h3>Một quy tắc áp dụng được TRƯỚC KHI viết cái nhãn</h3>
<pre><code>Trước khi thêm một nhãn, hãy trả lời thành lời:

  "Số giá trị khác nhau tối đa mà cái này có thể TỪNG có là
   bao nhiêu, và cái gì làm cho đó là một mức tối đa?"

  method      8. Do đặc tả HTTP.                     ✅
  code        ~40. Do đặc tả HTTP.                   ✅
  route       945. Số khai báo route.                ✅
  cache_hit   2. Kiểu luận lý.                       ✅

  userId      không chặn — phình theo số người đăng ký.  ❌
  noteId      không chặn — phình theo mức sử dụng.       ❌
  requestId   không chặn — một cái mỗi request.          ❌❌
  error_msg   không chặn — chứa cả giá trị nội suy, id,
              tên file.                                  ❌❌

Nếu câu trả lời có chữ "còn tuỳ" hoặc "bao nhiêu người dùng
thì bấy nhiêu" thì nó không phải một cái nhãn. Nó là một
trường trong log.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thông điệp lỗi là cái nhãn có lực lượng cao nhất từng tồn tại, và nó trông như cái nhãn hữu ích nhất.</strong> <code>errors_total{message="..."}</code> là thứ tự nhiên người ta viết ra và nó nổ ngay lập tức, vì thông điệp lỗi thật mang theo dữ liệu nội suy: <code>connect ETIMEDOUT 10.0.0.5:5432</code>, <code>Cannot read property 'x' of undefined at line 42</code>, <code>Invalid note id abc123</code>. Mỗi id, IP, cổng và tên file khác nhau đều thành một chuỗi vĩnh viễn, nên cái chỉ số ấy phình nhanh nhất đúng vào lúc hệ thống hỏng nặng nhất — cái khoảnh khắc bạn cần Prometheus còn sống nhất chính là khoảnh khắc chỉ số lỗi của bạn đang giết nó. <strong>Hãy gắn nhãn bằng một LOẠI lỗi có chặn do chính bạn gán</strong> — <code>errors_total{kind="db_timeout"}</code>, <code>kind="validation"</code>, <code>kind="upstream_5xx"</code> — và giữ thông điệp trong dòng log, nơi cái requestId của bài 3.2 sẽ giúp bạn tìm ra nó.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/practices/naming/#labels" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Prometheus — đặt tên chỉ số và nhãn</span><span class="lc-sub">Hướng dẫn chính thức, kèm lời cảnh báo tường minh về việc giữ lực lượng nhãn có chặn, và các quy ước ở bài 4.1.</span></span>
</a>
<a class="link-card dl" href="https://www.robustperception.io/cardinality-is-key/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Robust Perception — lực lượng là mấu chốt</span><span class="lc-sub">Bài viết kinh điển về việc vì sao con số ấy là một tích, từ những người vận hành Prometheus trên production lâu nhất.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '4.5 — Which metrics to actually collect|||4.5 — Thật ra thì nên thu thập chỉ số nào',
      slug: 'obs-4-5-thu-thap-cai-gi',
      type: 'VIDEO',
      description: 'Bốn tín hiệu vàng, RED và USE, và bộ mười hai chỉ số đủ dùng cho kho này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Which metrics to actually collect</h2>
<p class="lead">The failure mode here is not collecting too little. It is collecting three hundred metrics, looking at four of them, and having no idea which of the remaining 296 would have caught the last outage. This lesson is about arriving at a short list on purpose.</p>

<h3>The four golden signals</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Latency</span><span class="lz-t">How long requests take</span><span class="lz-d">Split successful from failed. A fast 500 and a slow 200 are opposite problems, and averaging them together hides both — this is lesson 4.2's forgotten number.</span></div>
  <div class="lz-node"><span class="lz-k">Traffic</span><span class="lz-t">How much demand there is</span><span class="lz-d">Requests per second. Not interesting alone; essential as a denominator, and the thing that tells you whether &quot;errors are down&quot; means fixed or means nobody is using it.</span></div>
  <div class="lz-node"><span class="lz-k">Errors</span><span class="lz-t">What fraction is failing</span><span class="lz-d">Explicit failures (5xx), implicit ones (a 200 with a wrong body), and policy ones (succeeded but took 9 seconds when you promised 1).</span></div>
  <div class="lz-node"><span class="lz-k">Saturation</span><span class="lz-t">How full the constrained resource is</span><span class="lz-d">The hardest and most valuable. For Node it is event-loop lag, not CPU — chapter 5. For Postgres it is connection-pool usage. Saturation is the only one that predicts rather than reports.</span></div>
</div>
<p>Saturation deserves the emphasis because the other three are lagging indicators: they tell you something is already wrong. Saturation tells you the system is running out of room, which is the only warning you get before latency and errors move.</p>

<h3>RED and USE: two shortcuts for two kinds of thing</h3>
<pre><code>RED — for anything that SERVES requests
      (your API, each route, the LLM gateway calls)

  Rate       requests per second
  Errors     failures per second
  Duration   the distribution, as a histogram

USE — for anything that is a RESOURCE
      (CPU, memory, connection pool, queue, disk)

  Utilisation  % of time it is busy
  Saturation   how much work is QUEUED for it
  Errors       error events from the resource itself

The distinction matters: a queue that is 100% utilised is
working perfectly. A queue with a growing backlog is not.
Utilisation alone cannot tell those apart — which is why
USE has a separate saturation term.</code></pre>

<h3>Twelve metrics that would be enough for this repository</h3>
<pre><code>HTTP (RED) — from the middleware in lesson 4.1
  1  http_requests_total{method,route,code}       counter
  2  http_request_duration_seconds{method,route}  histogram

Node runtime (USE) — chapter 5 covers each of these
  3  nodejs_eventloop_lag_seconds{quantile}       gauge
  4  process_resident_memory_bytes                gauge
  5  nodejs_heap_size_used_bytes                  gauge
  6  nodejs_gc_duration_seconds                   histogram

Postgres (USE) — the resource this app is actually bound by
  7  db_pool_connections{state="in_use"|"idle"}   gauge
  8  db_query_duration_seconds{operation}         histogram

Dependencies (RED) — everything you do not control
  9  outbound_requests_total{host,code}           counter
 10  outbound_duration_seconds{host}              histogram

Business — the two that tell you the app WORKS
 11  logins_total{outcome}                        counter
 12  notes_created_total                          counter</code></pre>
<p>Twelve metric names. With bounded labels that is roughly 3,000 series including histogram buckets — under 10 MB, comfortable on this VPS, and it answers every question in chapters 9 through 11.</p>

<h3>Why the last two are not optional</h3>
<pre><code>Metrics 1–10 measure the SYSTEM. Metrics 11–12 measure
whether it does its job.

The distinction matters because of a specific failure:

  · A deploy ships a frontend bug. The login form posts
    to the wrong URL.
  · Backend metrics: request rate DOWN 90%, errors at
    zero, latency excellent, event loop idle, memory low.

    Every system metric is GREEN. Several are the
    greenest they have ever been.

  · logins_total: flat at zero.

That is the only metric that noticed. A drop in traffic
looks identical to a quiet Sunday, unless you are counting
something that is supposed to happen.</code></pre>
<p>Pick two or three numbers that represent your product working, and put them on the same dashboard as the system metrics. For this repo: logins, notes created, and one AI-feature completion count.</p>

<h3>What to leave out, and why</h3>
<pre><code>❌ CPU percentage, as a primary signal.
   Node is single-threaded. 100% of one core out of eight
   reads as 12.5% and is a total outage. Event-loop lag is
   the metric that means what CPU% is supposed to mean.

❌ A counter per feature, added "in case".
   Every unused metric is a series, a line on a dashboard
   nobody reads, and a thing that looks alarming during an
   incident when nobody knows what normal is for it.

❌ Anything you cannot state a threshold for.
   If you cannot say "above X is bad", you will not alert
   on it and you will not read it. Collect it when you have
   a question, not before.

⚠️ Metrics you keep but do not alert on.
   Legitimate — a dashboard needs context, not just alerts.
   But be honest that this is what they are, and keep them
   on a separate row from the ones that page you.</code></pre>

<h3>Exposing them</h3>
<pre><code class="language-typescript">// src/routes/metrics.routes.ts
import { register } from 'prom-client';

router.get('/metrics', async (req, res) =&gt; {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});</code></pre>
<pre><code class="language-yaml"># The endpoint must NOT be public — it is a map of your system.
# nginx: allow the Prometheus container, deny everyone else.
location = /metrics {
    allow 172.16.0.0/12;      # the docker network
    deny  all;
    proxy_pass http://backend:5000/metrics;
}</code></pre>
<p>And note it belongs on the skip list of the morgan logger, next to <code>/health</code>: Prometheus scrapes every 15 seconds, which is 5,760 access-log lines a day that say nothing.</p>

<div class="pitfall">
<p><strong>Trap — <code>/metrics</code> is an inventory of your system, and the default is to serve it to the internet.</strong> A single unauthenticated GET returns every route name you have, every dependency host you call, your process's memory and uptime, and often your app version and Node version — a reconnaissance package that saves an attacker the entire enumeration step. Custom business metrics make it worse: <code>notes_created_total</code> and <code>logins_total</code> are your growth figures, readable by anyone, updated every fifteen seconds. Worst of all, the endpoint is genuinely expensive to serve at scale, so it is a cheap denial-of-service target — one request, thousands of series serialised. <strong>Bind it to the internal network or require auth, and verify it from outside:</strong> <code>curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/metrics</code> must not return 200.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals" target="_blank" rel="noopener">
  <span class="lc-ico">🥇</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — the four golden signals</span><span class="lc-sub">The original framing, including why saturation is treated as the leading indicator and the others as lagging.</span></span>
</a>
<a class="link-card dl" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — the USE method</span><span class="lc-sub">Utilisation, saturation and errors as a checklist for resources, with the worked example of why utilisation alone is not enough.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Thật ra thì nên thu thập chỉ số nào</h2>
<p class="lead">Kiểu hỏng ở đây không phải thu thập quá ít. Nó là thu thập ba trăm chỉ số, nhìn bốn cái trong số đó, và không biết cái nào trong 296 cái còn lại lẽ ra đã bắt được sự cố lần trước. Bài này nói về việc đi tới một danh sách ngắn một cách có chủ ý.</p>

<h3>Bốn tín hiệu vàng</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Độ trễ</span><span class="lz-t">Request mất bao lâu</span><span class="lz-d">Tách phần thành công khỏi phần hỏng. Một lỗi 500 nhanh và một cái 200 chậm là hai vấn đề trái ngược, gộp trung bình lại thì che mất cả hai — đây là con số bị quên ở bài 4.2.</span></div>
  <div class="lz-node"><span class="lz-k">Lưu lượng</span><span class="lz-t">Nhu cầu nhiều tới đâu</span><span class="lz-d">Số request mỗi giây. Tự nó thì không thú vị; là mẫu số thì thiết yếu, và là thứ nói cho bạn biết &quot;lỗi giảm rồi&quot; nghĩa là đã chữa được hay nghĩa là chẳng còn ai dùng.</span></div>
  <div class="lz-node"><span class="lz-k">Lỗi</span><span class="lz-t">Bao nhiêu phần đang hỏng</span><span class="lz-d">Hỏng tường minh (5xx), hỏng ngầm (một cái 200 với nội dung sai), và hỏng theo cam kết (thành công nhưng mất 9 giây trong khi bạn hứa 1 giây).</span></div>
  <div class="lz-node"><span class="lz-k">Độ bão hoà</span><span class="lz-t">Cái tài nguyên bị chặn đầy tới đâu</span><span class="lz-d">Khó nhất và giá trị nhất. Với Node đó là độ trễ vòng lặp sự kiện, không phải CPU — chương 5. Với Postgres là mức dùng bể kết nối. Bão hoà là cái duy nhất DỰ BÁO chứ không phải tường thuật.</span></div>
</div>
<p>Độ bão hoà đáng được nhấn mạnh vì ba cái kia là chỉ báo trễ: chúng nói cho bạn biết có gì đó ĐÃ hỏng rồi. Độ bão hoà nói cho bạn biết hệ thống đang hết chỗ, mà đó là lời cảnh báo duy nhất bạn nhận được trước khi độ trễ và lỗi nhúc nhích.</p>

<h3>RED và USE: hai lối tắt cho hai loại thứ</h3>
<pre><code>RED — cho bất cứ thứ gì PHỤC VỤ request
      (API của bạn, từng route, các lời gọi cổng LLM)

  Rate       số request mỗi giây
  Errors     số cú hỏng mỗi giây
  Duration   phân bố, dưới dạng một histogram

USE — cho bất cứ thứ gì là một TÀI NGUYÊN
      (CPU, bộ nhớ, bể kết nối, hàng đợi, đĩa)

  Utilisation  % thời gian nó bận
  Saturation   bao nhiêu việc đang XẾP HÀNG chờ nó
  Errors       các sự kiện lỗi từ chính cái tài nguyên đó

Sự phân biệt này quan trọng: một hàng đợi dùng hết 100% công
suất là đang chạy hoàn hảo. Một hàng đợi có tồn đọng đang phình
thì không. Chỉ mình mức sử dụng không phân biệt được hai cái đó
— và đó là lý do USE có riêng một hạng mục bão hoà.</code></pre>

<h3>Mười hai chỉ số là đủ cho kho này</h3>
<pre><code>HTTP (RED) — từ middleware ở bài 4.1
  1  http_requests_total{method,route,code}       counter
  2  http_request_duration_seconds{method,route}  histogram

Runtime của Node (USE) — chương 5 nói từng cái
  3  nodejs_eventloop_lag_seconds{quantile}       gauge
  4  process_resident_memory_bytes                gauge
  5  nodejs_heap_size_used_bytes                  gauge
  6  nodejs_gc_duration_seconds                   histogram

Postgres (USE) — cái tài nguyên mà app này thật sự bị chặn bởi
  7  db_pool_connections{state="in_use"|"idle"}   gauge
  8  db_query_duration_seconds{operation}         histogram

Phụ thuộc (RED) — mọi thứ bạn không kiểm soát
  9  outbound_requests_total{host,code}           counter
 10  outbound_duration_seconds{host}              histogram

Nghiệp vụ — hai cái nói cho bạn biết app CHẠY ĐƯỢC
 11  logins_total{outcome}                        counter
 12  notes_created_total                          counter</code></pre>
<p>Mười hai cái tên chỉ số. Với nhãn có chặn thì đó là khoảng 3.000 chuỗi kể cả các ô histogram — dưới 10 MB, thoải mái trên cái VPS này, và nó trả lời mọi câu hỏi từ chương 9 tới chương 11.</p>

<h3>Vì sao hai cái cuối không phải tuỳ chọn</h3>
<pre><code>Chỉ số 1–10 đo HỆ THỐNG. Chỉ số 11–12 đo xem nó có làm được
việc của nó không.

Sự phân biệt này quan trọng vì một cú hỏng cụ thể:

  · Một lần deploy đem lên một lỗi frontend. Form đăng nhập
    post vào sai URL.
  · Chỉ số backend: tốc độ request GIẢM 90%, lỗi bằng không,
    độ trễ xuất sắc, vòng lặp sự kiện nhàn rỗi, bộ nhớ thấp.

    MỌI chỉ số hệ thống đều XANH. Vài cái xanh nhất từ trước
    tới nay.

  · logins_total: phẳng ở mức không.

Đó là chỉ số duy nhất nhận ra. Một cú tụt lưu lượng nhìn y hệt
một ngày Chủ nhật vắng vẻ, trừ khi bạn đang đếm một thứ đáng lẽ
phải xảy ra.</code></pre>
<p>Hãy chọn hai hoặc ba con số đại diện cho việc sản phẩm của bạn đang chạy được, rồi để chúng lên cùng cái bảng theo dõi với các chỉ số hệ thống. Với kho này: số lần đăng nhập, số ghi chú được tạo, và một con số đếm lượt hoàn thành của một tính năng AI.</p>

<h3>Bỏ cái gì ra ngoài, và vì sao</h3>
<pre><code>❌ Phần trăm CPU, làm tín hiệu chính.
   Node chạy một luồng. 100% của một nhân trong tám nhân đọc
   ra là 12,5% và đó là một sự cố toàn phần. Độ trễ vòng lặp
   sự kiện mới là chỉ số mang đúng cái nghĩa mà CPU% lẽ ra phải
   mang.

❌ Một counter cho mỗi tính năng, thêm vào "để phòng".
   Mỗi chỉ số không dùng là một chuỗi, một đường trên bảng theo
   dõi không ai đọc, và một thứ trông đáng báo động trong lúc
   sự cố khi chẳng ai biết mức bình thường của nó là bao nhiêu.

❌ Bất cứ thứ gì bạn không nêu được một ngưỡng cho nó.
   Nếu bạn không nói được "trên X là tệ", bạn sẽ không cảnh báo
   theo nó và bạn sẽ không đọc nó. Hãy thu thập khi bạn có một
   câu hỏi, đừng thu thập trước.

⚠️ Những chỉ số bạn giữ mà không cảnh báo theo.
   Chính đáng — một bảng theo dõi cần ngữ cảnh, không chỉ cần
   cảnh báo. Nhưng hãy trung thực rằng đó là bản chất của
   chúng, và để chúng ở một hàng riêng, tách khỏi mấy cái gọi
   bạn dậy.</code></pre>

<h3>Phơi chúng ra</h3>
<pre><code class="language-typescript">// src/routes/metrics.routes.ts
import { register } from 'prom-client';

router.get('/metrics', async (req, res) =&gt; {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});</code></pre>
<pre><code class="language-yaml"># Endpoint này KHÔNG được công khai — nó là bản đồ hệ thống của bạn.
# nginx: cho container Prometheus vào, chặn tất cả những ai khác.
location = /metrics {
    allow 172.16.0.0/12;      # mạng docker
    deny  all;
    proxy_pass http://backend:5000/metrics;
}</code></pre>
<p>Và để ý rằng nó thuộc về danh sách bỏ qua của morgan, nằm cạnh <code>/health</code>: Prometheus quét 15 giây một lần, tức là 5.760 dòng log truy cập mỗi ngày chẳng nói lên điều gì.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>/metrics</code> là một bản kê khai hệ thống của bạn, và mặc định là phục vụ nó ra Internet.</strong> Một lời gọi GET không xác thực trả về mọi tên route bạn có, mọi máy chủ phụ thuộc bạn gọi tới, bộ nhớ và thời gian chạy của tiến trình, và thường là cả phiên bản app lẫn phiên bản Node — một gói do thám tiết kiệm cho kẻ tấn công trọn cả bước liệt kê. Chỉ số nghiệp vụ tự thêm còn làm nó tệ hơn: <code>notes_created_total</code> và <code>logins_total</code> là các con số tăng trưởng của bạn, ai đọc cũng được, cập nhật mười lăm giây một lần. Tệ nhất là cái endpoint đó thật sự đắt khi phải phục vụ ở quy mô lớn, nên nó là một mục tiêu từ chối dịch vụ giá rẻ — một request, hàng nghìn chuỗi phải tuần tự hoá. <strong>Hãy trói nó vào mạng nội bộ hoặc bắt buộc xác thực, rồi kiểm từ bên ngoài:</strong> <code>curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/metrics</code> không được trả về 200.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals" target="_blank" rel="noopener">
  <span class="lc-ico">🥇</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — bốn tín hiệu vàng</span><span class="lc-sub">Cách đặt vấn đề gốc, kèm lý do vì sao độ bão hoà được coi là chỉ báo sớm còn ba cái kia là chỉ báo trễ.</span></span>
</a>
<a class="link-card dl" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — phương pháp USE</span><span class="lc-sub">Mức sử dụng, độ bão hoà và lỗi như một danh sách kiểm cho tài nguyên, kèm ví dụ làm sẵn về việc vì sao chỉ mình mức sử dụng là chưa đủ.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra chương 4',
      slug: 'obs-4-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về loại chỉ số, phân vị, ô histogram, lực lượng nhãn và chọn thu thập gì.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 4 · Quiz</span><h2>Six questions on metrics</h2><p class="lead">Four of these have a measured number as the answer. If you remember the number, you will not need to remember the reasoning — the number contains it.</p></div><div class="ml-vi"><span class="eyebrow">Chương 4 · Kiểm tra</span><h2>Sáu câu về chỉ số</h2><p class="lead">Bốn câu trong đây có đáp án là một con số đã đo. Nhớ con số thì bạn không cần nhớ lý lẽ — con số chứa sẵn nó rồi.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Measured on 100,000 requests: mean 39.5 ms, p50 15.2 ms, p95 21.7 ms, p99 989.4 ms. What does that tell you about the average?|||Đo trên 100.000 request: trung bình 39,5 ms, p50 15,2 ms, p95 21,7 ms, p99 989,4 ms. Điều đó nói gì về cái trung bình?',
            options: [
              'It describes nobody — not one request took 39.5 ms, because the fast group sits near 15 ms and the slow group near 1,000 ms and the average lands in the empty gap between them. It also understates normal performance by 2.6×, so it is wrong in both directions at once.|||Nó mô tả KHÔNG AI cả — không một request nào mất 39,5 ms, vì nhóm nhanh nằm quanh 15 ms còn nhóm chậm quanh 1.000 ms và cái trung bình rơi vào khoảng trống rỗng giữa hai nhóm. Nó cũng nói xấu hiệu năng bình thường 2,6 lần, nên nó sai theo cả hai hướng cùng lúc.',
              'It is a reasonable summary, being close to p50 and p95|||Nó là một bản tóm tắt hợp lý, vì gần với p50 và p95',
              'It is too high, so the real performance is better than reported|||Nó quá cao, nên hiệu năng thật tốt hơn báo cáo',
              'It shows the system is healthy since 39.5 ms is under 200 ms|||Nó cho thấy hệ thống khoẻ vì 39,5 ms dưới 200 ms',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A histogram stores a percentile for 104 bytes instead of 7.6 MB. What did you give up, measured?|||Một histogram lưu một phân vị với 104 byte thay vì 7,6 MB. Bạn đánh đổi cái gì, đo thật?',
            options: [
              'Accuracy that depends entirely on bucket choice: with prom-client\'s default buckets the measured p95 was 46.6 ms against a true 27.6 ms — 69% wrong — because histogram_quantile interpolates linearly across a bucket and the data was clumped at one end. Buckets chosen from the measured distribution brought the worst error to 6.3%.|||Độ chính xác, và nó phụ thuộc hoàn toàn vào việc chọn ô: với bộ ô mặc định của prom-client thì p95 đo được là 46,6 ms so với sự thật 27,6 ms — sai 69% — vì histogram_quantile nội suy tuyến tính qua một cái ô còn dữ liệu thì dồn cục ở một đầu. Bộ ô chọn từ phân bố đã đo kéo sai số tệ nhất xuống 6,3%.',
              'Nothing — histograms are exact, the saving is free|||Không gì cả — histogram là chính xác, phần tiết kiệm là miễn phí',
              'The ability to compute p50, which needs the raw samples|||Khả năng tính p50, thứ cần tới các mẫu thô',
              'Aggregation across instances, which only summaries support|||Khả năng gộp giữa các thực thể, thứ chỉ summary hỗ trợ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You add a userId label to http_requests_total, which has 224 series. What is the measured result?|||Bạn thêm nhãn userId vào http_requests_total, thứ đang có 224 chuỗi. Kết quả đo được là gì?',
            options: [
              '2,240,000 series and about 6.4 GB — more than the VPS has — because the series count is a PRODUCT, so a label multiplies rather than adds. Prometheus then OOM-loops through WAL replay, and every other metric loses data too, during the incident the label was added to diagnose.|||2.240.000 chuỗi và khoảng 6,4 GB — nhiều hơn cả cái VPS có — vì số chuỗi là một TÍCH, nên thêm một nhãn là NHÂN chứ không phải cộng. Prometheus rồi sẽ lặp vòng bị OOM giết trong lúc phát lại WAL, và mọi chỉ số khác cũng mất dữ liệu, đúng trong cái sự cố mà cái nhãn ấy được thêm vào để chẩn đoán.',
              'About 234 series — the label adds one value per user seen|||Khoảng 234 chuỗi — cái nhãn thêm một giá trị cho mỗi người dùng thấy được',
              'No change in series count, only in the label index|||Số chuỗi không đổi, chỉ đổi chỉ mục nhãn',
              '2,240,000 series but negligible memory, since counters are 8 bytes|||2.240.000 chuỗi nhưng bộ nhớ không đáng kể, vì counter chỉ 8 byte',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must the metrics middleware use req.route?.path rather than req.path?|||Vì sao middleware chỉ số phải dùng req.route?.path chứ không phải req.path?',
            options: [
              'req.route.path gives the template ("/notes/:id"), bounded by the 945 route declarations. req.path gives the actual URL, so every note id becomes a series — and so does every 404 from a scanner probing /wp-admin or /.env, which means anyone on the internet can add permanent series to your Prometheus.|||req.route.path cho ra khuôn mẫu ("/notes/:id"), có chặn bởi 945 khai báo route. req.path cho ra URL thật, nên mọi id ghi chú đều thành một chuỗi — và mọi lỗi 404 từ một con bot đang dò /wp-admin hay /.env cũng thế, nghĩa là bất cứ ai trên Internet cũng thêm được chuỗi vĩnh viễn vào Prometheus của bạn.',
              'req.path is undefined inside res.on(\'finish\')|||req.path là undefined bên trong res.on(\'finish\')',
              'They are equivalent; req.route.path is just shorter|||Hai cái tương đương; req.route.path chỉ ngắn hơn',
              'req.path includes the query string, which breaks the label|||req.path có kèm chuỗi truy vấn, làm hỏng cái nhãn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A deploy breaks the login form URL. Backend request rate drops 90%, errors are zero, latency is excellent. Which metric notices?|||Một lần deploy làm hỏng URL của form đăng nhập. Tốc độ request backend tụt 90%, lỗi bằng không, độ trễ xuất sắc. Chỉ số nào nhận ra?',
            options: [
              'logins_total, flat at zero. Every system metric is green — several are the greenest they have ever been — because a traffic drop is indistinguishable from a quiet Sunday unless you count something that is supposed to happen. That is why two or three business counters belong on the same dashboard.|||logins_total, phẳng ở mức không. Mọi chỉ số hệ thống đều xanh — vài cái xanh nhất từ trước tới nay — vì một cú tụt lưu lượng không phân biệt được với một ngày Chủ nhật vắng, trừ khi bạn đang đếm một thứ đáng lẽ phải xảy ra. Đó là lý do hai ba counter nghiệp vụ thuộc về cùng cái bảng theo dõi ấy.',
              'The error rate, which will spike from the failed posts|||Tỉ lệ lỗi, thứ sẽ vọt lên từ mấy lần post hỏng',
              'p99 latency, which rises when fewer requests are served|||Độ trễ p99, thứ tăng lên khi ít request được phục vụ hơn',
              'Event-loop lag, which detects the reduced load|||Độ trễ vòng lặp sự kiện, thứ phát hiện được mức tải giảm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is a Summary usually the wrong choice for request latency?|||Vì sao Summary thường là lựa chọn sai cho độ trễ request?',
            options: [
              'Because it computes quantiles inside each process, and quantiles cannot be combined: with two backend containers there is no arithmetic that turns two p99 values into the p99 of the combined traffic. The graph still shows a number that moves with load, and it is wrong in a way no dashboard reveals. Histogram buckets are counters, counters add, so the quantile is computed after summing.|||Vì nó tính phân vị bên trong từng tiến trình, mà phân vị thì không kết hợp được: với hai container backend thì không có phép tính nào biến hai giá trị p99 thành p99 của lưu lượng gộp lại. Đồ thị vẫn hiện một con số nhúc nhích theo tải, và nó sai theo một cách không bảng theo dõi nào lộ ra. Ô của histogram là counter, counter thì cộng được, nên phân vị được tính SAU khi cộng.',
              'Because summaries use more memory than histograms|||Vì summary tốn bộ nhớ hơn histogram',
              'Because summaries cannot represent values above one second|||Vì summary không biểu diễn được giá trị trên một giây',
              'Because prom-client does not implement summaries|||Vì prom-client không cài đặt summary',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
