/**
 * Observability — Chương 5 — Những chỉ số chỉ Node.js nói cho bạn biết.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 5 — The metrics only Node.js can tell you|||Chương 5 — Những chỉ số chỉ Node.js nói cho bạn biết',
  slug: 'obs-ch5-nodejs',
  description: 'Độ trễ vòng lặp sự kiện, heap và RSS, GC, các bể tài nguyên, và phơi /metrics.',
  sortOrder: 6,
  lessons: [
    {
      title: '5.1 — Event loop lag: the only metric that means "stuck"|||5.1 — Độ trễ vòng lặp sự kiện: chỉ số duy nhất nghĩa là "đang đơ"',
      slug: 'obs-5-1-tre-vong-lap',
      type: 'VIDEO',
      description: 'Đo thật: chặn 200ms mỗi vòng thì CPU toàn máy đọc ra 23,8% — trông như nhàn rỗi. Độ trễ p99 đọc 201ms.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Event loop lag: the only metric that means &quot;stuck&quot;</h2>
<p class="lead">Chapter 4 ended with a claim that deserves proof: CPU percentage is the wrong saturation metric for Node, and event-loop lag is the right one. This lesson proves it by measuring both while deliberately stalling the process.</p>

<h3>Why CPU% cannot mean what you want it to mean</h3>
<pre><code>Your JavaScript runs on ONE thread. The machine has several.

  4-core VPS, your process fully saturating its single thread:

      per-process CPU:   ~100%     ← "one core is full"
      machine CPU:        ~25%     ← "the machine is fine"

  Which number does your dashboard show? Almost always the
  second one, because that is what &#96;docker stats&#96;, most host
  agents and every cloud console report by default.

So a Node process that is COMPLETELY blocked — accepting no
connections, answering nothing — displays as one quarter busy.</code></pre>

<h3>The measurement</h3>
<pre><code class="language-javascript">// m13.mjs — CPU and lag, side by side, on the same workload
import { monitorEventLoopDelay } from 'node:perf_hooks';
import os from 'node:os';

async function run(label, work) {
  const h = monitorEventLoopDelay({ resolution: 1 }); h.enable();
  const c0 = process.cpuUsage(), t0 = Date.now();
  while (Date.now() - t0 &lt; 2000) { await new Promise(r =&gt; setTimeout(r, 5)); work(); }
  const c = process.cpuUsage(c0), wall = (Date.now() - t0) * 1000;
  h.disable();
  const oneCore = (c.user + c.system) / wall * 100;
  // report oneCore, oneCore / os.cpus().length, and h.percentile(99)
}
</code></pre>
<div class="out">$ node m13.mjs
máy có 4 nhân

nhàn rỗi                   CPU 1 nhân 4%     CPU 4 nhân 1.0%   trễ p99    1ms
chặn 50ms mỗi vòng         CPU 1 nhân 91%    CPU 4 nhân 22.7%  trễ p99   51ms
chặn 200ms mỗi vòng        CPU 1 nhân 95%    CPU 4 nhân 23.8%  trễ p99  201ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Blocking for 200 ms per turn reads as 23.8% machine CPU</span><span class="lz-d">Every request is queueing behind a fifth of a second of blocked thread. From the machine's point of view, three quarters of the CPU is idle — and it is, uselessly.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CPU% cannot distinguish 50 ms from 200 ms: 91% vs 95%</span><span class="lz-d">Four points apart, for a workload that is four times worse. The metric has saturated and stopped carrying information exactly where you need resolution.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lag tracks the stall exactly: 1 ms → 51 ms → 201 ms</span><span class="lz-d">Linear, unambiguous, and it is the actual delay added to every request waiting behind the block. This number <em>is</em> the user's experience.</span></div>
</div>

<h3>What lag is, precisely</h3>
<pre><code>The event loop schedules a timer for 20ms from now.
It fires at 21.1ms. The lag for that turn is 1.1ms.

  lag = (when the callback ACTUALLY ran)
      − (when it was SUPPOSED to run)

That 1.1ms floor is normal — it is timer resolution and
scheduling overhead. What matters is the shape:

  lag stays flat        the loop is keeping up
  lag p99 spikes        SOMETHING blocked the thread for
                        that long, and every request that
                        arrived meanwhile waited that long
  lag p50 rises         the loop is over capacity in
                        general, not stalling occasionally</code></pre>

<h3>The subtlety that makes the metric useful</h3>
<p>From the earlier run of the same instrument across different workloads:</p>
<div class="out">$ node m2.mjs
nhàn rỗi                       p50=    1.1ms  p99=    1.5ms  max=   44.6ms
JSON.parse 200KB mỗi vòng      p50=    1.1ms  p99=    2.8ms  max=    3.3ms
vòng lặp chặn 20ms             p50=    1.1ms  p99=   20.6ms  max=   20.7ms
vòng lặp chặn 120ms            p50=    1.1ms  p99=  120.7ms  max=  120.7ms</div>
<pre><code>Look at the p50 column: 1.1ms in EVERY case, including
the one blocking for 120ms.

That is not a flaw — it is the whole point. A block is by
definition occasional; most turns of the loop are fine.
So:

  · p50 lag says "how healthy is the loop NORMALLY"
  · p99 lag says "how bad is the worst stall"

Alerting on MEAN or p50 lag catches almost nothing.
Alert on p99. Chapter 9 sets the threshold.

And note the idle row's max of 44.6ms — a single outlier
from process startup. This is why max is a bad alert
(lesson 4.2) even here.</code></pre>

<h3>Wiring it up</h3>
<pre><code class="language-typescript">// src/metrics/eventLoop.ts
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { Gauge } from 'prom-client';

const h = monitorEventLoopDelay({ resolution: 10 });   // 10ms is plenty
h.enable();

new Gauge({
  name: 'nodejs_eventloop_lag_seconds',
  help: 'Event loop delay',
  labelNames: ['quantile'] as const,
  collect() {                        // called at scrape time
    this.set({ quantile: '0.5' },  h.percentile(50) / 1e9);
    this.set({ quantile: '0.99' }, h.percentile(99) / 1e9);
    this.set({ quantile: '1' },    h.max / 1e9);
    h.reset();                       // ⚠️ reset, or percentiles cover all time
  },
});</code></pre>
<p>The <code>h.reset()</code> matters. Without it the histogram accumulates from process start, so a single bad minute keeps your p99 elevated for days and the metric stops responding to the present.</p>

<h3>What actually blocks the loop in this repository</h3>
<pre><code>Ranked by how often they surprise people:

1. JSON.parse / JSON.stringify on a large payload.
   200KB measured at ~2.8ms p99 above. A 5MB AI response
   body is ~70ms, per request, in the middle of the loop.

2. Synchronous crypto. bcrypt.hashSync, and scrypt or
   pbkdf2 called without a callback. Deliberately slow —
   that is the security property — and deliberately slow
   ON THE ONLY THREAD.

3. Regexes with catastrophic backtracking. One crafted
   input, one hundred percent of one core, indefinitely.
   Not milliseconds — minutes.

4. Big array work in a request. sort(), reduce() and
   nested loops over thousands of database rows.

5. readFileSync / existsSync anywhere near a request path,
   which is easy to introduce accidentally in config code
   that later gets called per-request.

Everything on this list is CPU work in JavaScript. Waiting
on Postgres, R2 or the LLM gateway does NOT block the loop —
that is what async is for, and it is why a slow database
shows up as latency without any lag at all.</code></pre>

<div class="pitfall">
<p><strong>Trap — a blocked event loop makes your health check lie, in the direction that keeps traffic flowing.</strong> While the thread is stuck, the HTTP server accepts connections at the kernel level but runs no handler, so a probe sent during the stall does not get a fast failure — it simply waits. If your orchestrator's timeout is longer than the stall, the probe eventually succeeds and reports the container healthy; if the stall is long enough to trip the timeout, the container is killed and restarted mid-request, which is worse. <strong>Either way the health check is describing the TCP layer, not your application, so a fully wedged process can pass a check that was written to detect exactly this.</strong> Chapter 8 covers what a probe must actually measure; the short version is that a readiness check should read the event-loop lag gauge and fail on it, because that is the number that knows.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — monitorEventLoopDelay</span><span class="lc-sub">The native histogram used above: its resolution option, the percentile and reset methods, and why it is cheaper than a setInterval-based estimate.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Node.js — Don't block the event loop</span><span class="lc-sub">The official guide to the five blocking patterns above, including the regex backtracking case and how to move work off-thread.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Độ trễ vòng lặp sự kiện: chỉ số duy nhất nghĩa là &quot;đang đơ&quot;</h2>
<p class="lead">Chương 4 kết thúc bằng một khẳng định đáng được chứng minh: phần trăm CPU là chỉ số bão hoà sai với Node, còn độ trễ vòng lặp sự kiện mới đúng. Bài này chứng minh bằng cách đo cả hai trong lúc cố ý làm tiến trình đứng lại.</p>

<h3>Vì sao CPU% không mang được cái nghĩa bạn muốn nó mang</h3>
<pre><code>JavaScript của bạn chạy trên MỘT luồng. Máy thì có nhiều nhân.

  VPS 4 nhân, tiến trình của bạn lấp đầy hoàn toàn luồng duy nhất:

      CPU theo tiến trình:  ~100%     ← "một nhân đã đầy"
      CPU toàn máy:          ~25%     ← "cái máy vẫn ổn"

  Bảng theo dõi của bạn hiện con số nào? Gần như luôn là con số
  thứ hai, vì đó là thứ &#96;docker stats&#96;, phần lớn tác nhân theo
  dõi máy chủ và mọi bảng điều khiển đám mây báo mặc định.

Vậy một tiến trình Node bị chặn HOÀN TOÀN — không nhận kết nối,
không trả lời gì — lại hiển thị là bận một phần tư.</code></pre>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m13.mjs — CPU và độ trễ, cạnh nhau, trên cùng một khối lượng công việc
import { monitorEventLoopDelay } from 'node:perf_hooks';
import os from 'node:os';

async function run(label, work) {
  const h = monitorEventLoopDelay({ resolution: 1 }); h.enable();
  const c0 = process.cpuUsage(), t0 = Date.now();
  while (Date.now() - t0 &lt; 2000) { await new Promise(r =&gt; setTimeout(r, 5)); work(); }
  const c = process.cpuUsage(c0), wall = (Date.now() - t0) * 1000;
  h.disable();
  const oneCore = (c.user + c.system) / wall * 100;
  // báo oneCore, oneCore / os.cpus().length, và h.percentile(99)
}
</code></pre>
<div class="out">$ node m13.mjs
máy có 4 nhân

nhàn rỗi                   CPU 1 nhân 4%     CPU 4 nhân 1.0%   trễ p99    1ms
chặn 50ms mỗi vòng         CPU 1 nhân 91%    CPU 4 nhân 22.7%  trễ p99   51ms
chặn 200ms mỗi vòng        CPU 1 nhân 95%    CPU 4 nhân 23.8%  trễ p99  201ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chặn 200 ms mỗi vòng đọc ra 23,8% CPU toàn máy</span><span class="lz-d">Mọi request đang xếp hàng sau một phần năm giây luồng bị chặn. Nhìn từ phía cái máy thì ba phần tư số CPU đang nhàn rỗi — và đúng thế thật, một cách vô ích.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CPU% không phân biệt nổi 50 ms với 200 ms: 91% so với 95%</span><span class="lz-d">Cách nhau bốn điểm, cho một khối lượng công việc tệ gấp bốn lần. Cái thước đã bão hoà và thôi mang thông tin đúng ở chỗ bạn cần độ phân giải.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Độ trễ bám sát cú đơ, chính xác: 1 ms → 51 ms → 201 ms</span><span class="lz-d">Tuyến tính, không mập mờ, và nó chính là độ trễ thật cộng thêm cho mọi request đang chờ sau cú chặn. Con số này <em>chính là</em> trải nghiệm của người dùng.</span></div>
</div>

<h3>Độ trễ là gì, cho chính xác</h3>
<pre><code>Vòng lặp sự kiện hẹn một bộ đếm giờ cho 20ms sau.
Nó nổ ở 21,1ms. Độ trễ của vòng đó là 1,1ms.

  độ trễ = (lúc callback THẬT SỰ chạy)
         − (lúc nó ĐÁNG LẼ phải chạy)

Cái sàn 1,1ms đó là bình thường — nó là độ phân giải bộ đếm giờ
và chi phí lập lịch. Cái quan trọng là hình dạng:

  độ trễ nằm phẳng      vòng lặp đang theo kịp
  p99 vọt gai           CÁI GÌ ĐÓ đã chặn luồng đúng bấy nhiêu
                        lâu, và mọi request tới trong lúc đó đã
                        phải chờ đúng bấy nhiêu
  p50 tăng lên          vòng lặp quá tải nói chung, không phải
                        thỉnh thoảng mới đơ</code></pre>

<h3>Cái tinh tế làm cho chỉ số này dùng được</h3>
<p>Từ lượt chạy trước của cùng dụng cụ ấy trên các khối lượng công việc khác nhau:</p>
<div class="out">$ node m2.mjs
nhàn rỗi                       p50=    1.1ms  p99=    1.5ms  max=   44.6ms
JSON.parse 200KB mỗi vòng      p50=    1.1ms  p99=    2.8ms  max=    3.3ms
vòng lặp chặn 20ms             p50=    1.1ms  p99=   20.6ms  max=   20.7ms
vòng lặp chặn 120ms            p50=    1.1ms  p99=  120.7ms  max=  120.7ms</div>
<pre><code>Hãy nhìn cột p50: 1,1ms ở MỌI trường hợp, kể cả cái đang chặn
120ms.

Đó không phải khiếm khuyết — đó là toàn bộ mấu chốt. Một cú chặn
theo định nghĩa là thỉnh thoảng; phần lớn các vòng vẫn ổn. Nên:

  · p50 nói "vòng lặp BÌNH THƯỜNG khoẻ tới đâu"
  · p99 nói "cú đơ tệ nhất tệ tới đâu"

Cảnh báo theo TRUNG BÌNH hay p50 thì bắt được gần như không gì.
Hãy cảnh báo theo p99. Chương 9 đặt ngưỡng.

Và để ý max 44,6ms ở hàng nhàn rỗi — một ca ngoại lệ đơn lẻ từ
lúc tiến trình khởi động. Đây là lý do max là một cảnh báo tồi
(bài 4.2) kể cả ở đây.</code></pre>

<h3>Cắm nó vào</h3>
<pre><code class="language-typescript">// src/metrics/eventLoop.ts
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { Gauge } from 'prom-client';

const h = monitorEventLoopDelay({ resolution: 10 });   // 10ms là thừa đủ
h.enable();

new Gauge({
  name: 'nodejs_eventloop_lag_seconds',
  help: 'Event loop delay',
  labelNames: ['quantile'] as const,
  collect() {                        // được gọi lúc bị quét
    this.set({ quantile: '0.5' },  h.percentile(50) / 1e9);
    this.set({ quantile: '0.99' }, h.percentile(99) / 1e9);
    this.set({ quantile: '1' },    h.max / 1e9);
    h.reset();                       // ⚠️ phải reset, không thì phân vị tính từ đầu
  },
});</code></pre>
<p>Cái <code>h.reset()</code> ấy quan trọng. Không có nó thì histogram tích luỹ từ lúc tiến trình khởi động, nên một phút tồi tệ duy nhất giữ p99 của bạn ở mức cao suốt nhiều ngày và cái chỉ số thôi phản ứng với hiện tại.</p>

<h3>Cái gì thật sự chặn vòng lặp trong kho này</h3>
<pre><code>Xếp theo mức độ hay làm người ta bất ngờ:

1. JSON.parse / JSON.stringify trên một payload lớn.
   200KB đo được ~2,8ms p99 ở trên. Một phản hồi AI 5MB là
   ~70ms, mỗi request, ngay giữa vòng lặp.

2. Mật mã đồng bộ. bcrypt.hashSync, và scrypt hay pbkdf2 gọi
   mà không có callback. Chậm một cách CÓ CHỦ Ý — đó là tính
   chất bảo mật — và chậm có chủ ý TRÊN LUỒNG DUY NHẤT.

3. Biểu thức chính quy quay lui thảm hoạ. Một đầu vào được
   dựng có chủ đích, một trăm phần trăm một nhân, vô thời hạn.
   Không phải mili giây — mà là phút.

4. Xử lý mảng lớn trong một request. sort(), reduce() và vòng
   lặp lồng nhau trên hàng nghìn hàng cơ sở dữ liệu.

5. readFileSync / existsSync ở bất cứ đâu gần đường request,
   thứ rất dễ vô tình đưa vào qua mã cấu hình mà về sau lại bị
   gọi ở mỗi request.

Mọi thứ trong danh sách này đều là việc CPU trong JavaScript.
Chờ Postgres, R2 hay cổng LLM thì KHÔNG chặn vòng lặp — đó là
mục đích của bất đồng bộ, và đó là lý do một cơ sở dữ liệu chậm
hiện ra dưới dạng độ trễ mà không kèm chút trễ vòng lặp nào.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một vòng lặp bị chặn làm phép kiểm sức khoẻ của bạn nói dối, theo hướng giữ cho lưu lượng vẫn chảy vào.</strong> Trong lúc luồng bị kẹt, máy chủ HTTP vẫn nhận kết nối ở mức nhân nhưng không chạy handler nào, nên một lượt thăm dò gửi trong lúc đơ không bị hỏng nhanh — nó chỉ đơn giản là chờ. Nếu ngưỡng thời gian của bộ điều phối dài hơn cú đơ, lượt thăm dò rốt cuộc thành công và báo container khoẻ mạnh; nếu cú đơ đủ dài để chạm ngưỡng, container bị giết và khởi động lại giữa chừng một request, và thế còn tệ hơn. <strong>Kiểu nào thì phép kiểm sức khoẻ cũng đang mô tả tầng TCP chứ không phải ứng dụng của bạn, nên một tiến trình kẹt cứng hoàn toàn vẫn qua được một phép kiểm viết ra để phát hiện đúng chuyện đó.</strong> Chương 8 nói về việc một lượt thăm dò thật sự phải đo gì; bản ngắn gọn là một phép kiểm sẵn-sàng nên đọc chính cái gauge độ trễ vòng lặp và trượt theo nó, vì đó là con số biết chuyện.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — monitorEventLoopDelay</span><span class="lc-sub">Cái histogram gốc dùng ở trên: tuỳ chọn resolution, các phương thức percentile và reset, và vì sao nó rẻ hơn một phép ước lượng dựa trên setInterval.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Node.js — Đừng chặn vòng lặp sự kiện</span><span class="lc-sub">Hướng dẫn chính thức về năm kiểu chặn ở trên, kể cả ca quay lui của regex và cách đẩy việc ra khỏi luồng chính.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '5.2 — RSS, heap, external: which number is the leak|||5.2 — RSS, heap, external: con số nào mới là chỗ rò rỉ',
      slug: 'obs-5-2-bo-nho',
      type: 'VIDEO',
      description: 'Đo thật: heap về lại 4 MB sau GC nhưng RSS ở nguyên 140 MB. Và 200 MB Buffer chỉ vào RSS khi bạn GHI vào nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>RSS, heap, external: which number is the leak</h2>
<p class="lead">&quot;Memory is climbing&quot; is the vaguest possible incident report, because Node reports five different memory numbers and they mean genuinely different things. This lesson measures all five at once while allocating memory in two different ways, and the results are not what most people expect.</p>

<h3>The five numbers</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>rss</code> — resident set size</span><span class="lz-lnote">Physical RAM this process occupies. <strong>This is the number the OOM killer and your container memory limit use.</strong> Includes the heap, buffers, code, stacks, everything.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>heapTotal</code></span><span class="lz-lnote">How much V8 has <em>reserved</em> for JavaScript objects. Grows in steps as V8 decides it needs more room.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>heapUsed</code></span><span class="lz-lnote">How much of that is live objects right now. <strong>This is the number a JavaScript memory leak shows up in.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname"><code>external</code></span><span class="lz-lnote">Memory allocated by C++ objects bound to JS — Buffers, some crypto, sharp's image data. Outside the heap, counted in rss.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>arrayBuffers</code></span><span class="lz-lnote">The subset of external that is ArrayBuffer and Buffer. Where a file-upload or image-processing leak appears.</span></div>
</div>

<h3>The measurement</h3>
<pre><code class="language-javascript">// m14.mjs — run with --expose-gc so we can force collection
const show = (l) =&gt; { const m = process.memoryUsage(); /* print all five */ };

show('at startup');
let junk = []; for (let i=0;i&lt;400_000;i++) junk.push({ id:i, s:'x'.repeat(40) });
show('after 400k objects on the heap');
junk = null; global.gc();
show('after dropping the reference + gc()');

const bufs = []; for (let i=0;i&lt;200;i++) bufs.push(Buffer.allocUnsafe(1024*1024));
show('after 200 MB of Buffers (off-heap)');
for (const b of bufs) b.fill(1);
show('after WRITING to those 200 MB');
</code></pre>
<div class="out">$ node --expose-gc m14.mjs
lúc khởi động                      rss   43  heapTotal    5  heapUsed    4  external    1  arrayBuffers    0
sau 400k object trong heap         rss  150  heapTotal  101  heapUsed   75  external    1  arrayBuffers    0
sau khi bỏ tham chiếu + gc()       rss  140  heapTotal   38  heapUsed    4  external    1  arrayBuffers    0
sau 200 MB Buffer (ngoài heap)     rss  143  heapTotal   37  heapUsed    4  external  202  arrayBuffers  200
sau khi GHI vào 200 MB Buffer đó   rss  343  heapTotal   37  heapUsed    4  external  202  arrayBuffers  200</div>

<h3>Three findings, all of them counter-intuitive</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The heap fully recovered; RSS did not</span><span class="lz-d"><code>heapUsed</code> went 4 → 75 → 4 MB. Perfect. <code>rss</code> went 43 → 150 → <strong>140</strong> MB. V8 does not return freed pages to the operating system, so RSS is a high-water mark. <strong>An RSS graph that rises and never falls is the normal, healthy shape.</strong></span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">200 MB of Buffers moved RSS by 3 MB</span><span class="lz-d"><code>external</code> jumped to 202 MB immediately, but <code>rss</code> went 140 → 143. <code>allocUnsafe</code> reserves address space; the pages are not resident until touched.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Writing to them moved RSS by 200 MB, instantly</span><span class="lz-d">143 → 343 MB, with no allocation at all — just <code>fill(1)</code>. <strong><code>external</code> reports what you asked for; <code>rss</code> reports what you are actually using; the OOM killer counts the second.</strong></span></div>
</div>

<h3>Reading a real graph</h3>
<pre><code>rss climbing, heapUsed FLAT
   → not a JavaScript leak. Look at external/arrayBuffers:
     Buffers not being released, an image pipeline holding
     decoded bitmaps, a native module. In this repo: sharp,
     FFmpeg output buffers, R2 upload bodies.

rss and heapUsed BOTH climbing, sawtooth in heapUsed
   → normal. The sawtooth IS garbage collection working.
     Judge by whether the BOTTOM of each sawtooth rises.

heapUsed's sawtooth BOTTOM rising over hours
   → this is the real JavaScript leak signature. Something
     survives every collection. A growing Map, an array
     that is only ever pushed to, listeners never removed.

rss climbing while heapTotal is flat at the limit
   → V8 cannot grow the heap and is collecting constantly.
     Check GC time (lesson 5.3) — the process is probably
     spending more time collecting than working.

rss flat at exactly the container limit
   → you are already being throttled or about to be killed.
     This is not a graph to investigate later.</code></pre>

<h3>What to alert on</h3>
<pre><code>✅ rss / container_memory_limit &gt; 0.85
   The only memory alert that maps to an actual consequence:
   crossing 1.0 is an OOM kill.

✅ heapUsed growth over 6 hours, measured at the daily minimum
   Compares like with like — the bottom of the sawtooth —
   so ordinary allocation churn does not trigger it.

❌ rss increased since yesterday
   Always true. See finding 1.

❌ heapUsed &gt; some fixed MB
   Meaningless without knowing the heap limit, which depends
   on --max-old-space-size and the container's memory.</code></pre>

<h3>The container-limit trap</h3>
<pre><code class="language-yaml"># docker-compose.yml — if you set this...
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M</code></pre>
<pre><code>...Node does NOT know about it. V8 picks its heap limit from
the HOST's total memory, not the cgroup limit. On a 6 GB VPS
with a 512 MB container limit, V8 happily plans for a ~2 GB
heap and gets OOM-killed at 512 MB — while heapUsed reads
around 300 MB and looks entirely healthy.

The fix is to tell it:

  NODE_OPTIONS=--max-old-space-size=384     # ~75% of the limit

Now V8 collects aggressively as it approaches 384 MB instead
of being killed at 512 MB with no warning. You trade some
throughput for a process that survives.</code></pre>

<div class="pitfall">
<p><strong>Trap — the most common Node memory leak in a codebase this size is an unbounded <code>Map</code> used as a cache.</strong> It reads as obviously correct: <code>const cache = new Map()</code> at module scope, <code>cache.set(userId, data)</code> on each request, and a check before doing expensive work. There is no eviction, so it grows with distinct users forever — and it grows <em>fastest under load</em>, which is when you can least afford it. The reason it survives review is that it looks nothing like a leak: nobody forgot to free anything, the code is doing exactly what it says. In this repository, <code>src/services/</code> is where these live, and the symptom is finding 3's signature — a rising sawtooth bottom in <code>heapUsed</code> over hours. <strong>Every module-level <code>Map</code>, <code>Set</code> or array that a request writes to needs a stated eviction policy at the point of declaration</strong>, whether that is an LRU with a size cap, a TTL, or a comment explaining why the key space is bounded.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#processmemoryusage" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Node.js — process.memoryUsage()</span><span class="lc-sub">The definitions of all five numbers measured above, including the note that rss includes the heap rather than sitting beside it.</span></span>
</a>
<a class="link-card dl" href="https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Heap snapshots — finding what is retained</span><span class="lc-sub">How to take a snapshot from a running Node process and read the retainer tree, which is how you find the Map from the pitfall.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>RSS, heap, external: con số nào mới là chỗ rò rỉ</h2>
<p class="lead">&quot;Bộ nhớ đang leo lên&quot; là bản báo cáo sự cố mơ hồ nhất có thể, vì Node báo ra năm con số bộ nhớ khác nhau và chúng mang những nghĩa thật sự khác nhau. Bài này đo cả năm cùng lúc trong khi cấp phát bộ nhớ theo hai cách khác nhau, và kết quả không phải thứ đa số người ta trông đợi.</p>

<h3>Năm con số</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>rss</code> — resident set size</span><span class="lz-lnote">RAM vật lý mà tiến trình này đang chiếm. <strong>Đây là con số mà OOM killer và hạn mức bộ nhớ container của bạn dùng.</strong> Bao gồm cả heap, buffer, mã, ngăn xếp, tất cả.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>heapTotal</code></span><span class="lz-lnote">V8 đã <em>đặt trước</em> bao nhiêu cho các object JavaScript. Phình theo từng bậc khi V8 thấy nó cần thêm chỗ.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>heapUsed</code></span><span class="lz-lnote">Trong chỗ đó thì có bao nhiêu là object đang sống ngay lúc này. <strong>Đây là con số mà một chỗ rò rỉ bộ nhớ JavaScript hiện ra.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname"><code>external</code></span><span class="lz-lnote">Bộ nhớ do các object C++ gắn với JS cấp phát — Buffer, một phần mật mã, dữ liệu ảnh của sharp. Nằm ngoài heap, được tính vào rss.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>arrayBuffers</code></span><span class="lz-lnote">Phần con của external gồm ArrayBuffer và Buffer. Chỗ một cú rò rỉ khi tải file lên hay xử lý ảnh hiện ra.</span></div>
</div>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m14.mjs — chạy với --expose-gc để ép được việc thu gom
const show = (l) =&gt; { const m = process.memoryUsage(); /* in cả năm */ };

show('lúc khởi động');
let junk = []; for (let i=0;i&lt;400_000;i++) junk.push({ id:i, s:'x'.repeat(40) });
show('sau 400k object trong heap');
junk = null; global.gc();
show('sau khi bỏ tham chiếu + gc()');

const bufs = []; for (let i=0;i&lt;200;i++) bufs.push(Buffer.allocUnsafe(1024*1024));
show('sau 200 MB Buffer (ngoài heap)');
for (const b of bufs) b.fill(1);
show('sau khi GHI vào 200 MB đó');
</code></pre>
<div class="out">$ node --expose-gc m14.mjs
lúc khởi động                      rss   43  heapTotal    5  heapUsed    4  external    1  arrayBuffers    0
sau 400k object trong heap         rss  150  heapTotal  101  heapUsed   75  external    1  arrayBuffers    0
sau khi bỏ tham chiếu + gc()       rss  140  heapTotal   38  heapUsed    4  external    1  arrayBuffers    0
sau 200 MB Buffer (ngoài heap)     rss  143  heapTotal   37  heapUsed    4  external  202  arrayBuffers  200
sau khi GHI vào 200 MB Buffer đó   rss  343  heapTotal   37  heapUsed    4  external  202  arrayBuffers  200</div>

<h3>Ba phát hiện, cả ba đều trái trực giác</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Heap hồi phục hoàn toàn; RSS thì không</span><span class="lz-d"><code>heapUsed</code> đi 4 → 75 → 4 MB. Hoàn hảo. <code>rss</code> đi 43 → 150 → <strong>140</strong> MB. V8 KHÔNG trả các trang đã giải phóng lại cho hệ điều hành, nên RSS là một mốc nước cao nhất. <strong>Một đồ thị RSS chỉ leo lên mà không bao giờ tụt xuống là hình dạng BÌNH THƯỜNG, khoẻ mạnh.</strong></span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">200 MB Buffer chỉ làm RSS nhích 3 MB</span><span class="lz-d"><code>external</code> vọt lên 202 MB ngay lập tức, nhưng <code>rss</code> đi 140 → 143. <code>allocUnsafe</code> đặt trước không gian địa chỉ; các trang chưa nằm trong RAM cho tới khi bị chạm vào.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi vào chúng làm RSS nhích 200 MB, tức thì</span><span class="lz-d">143 → 343 MB, mà không cấp phát thêm gì cả — chỉ là <code>fill(1)</code>. <strong><code>external</code> báo cái bạn ĐÃ XIN; <code>rss</code> báo cái bạn ĐANG THẬT SỰ DÙNG; OOM killer đếm cái thứ hai.</strong></span></div>
</div>

<h3>Đọc một đồ thị thật</h3>
<pre><code>rss leo, heapUsed PHẲNG
   → không phải rò rỉ JavaScript. Hãy nhìn external/arrayBuffers:
     Buffer không được thả, một đường ống ảnh đang giữ bitmap đã
     giải mã, một module native. Ở kho này: sharp, buffer đầu ra
     của FFmpeg, phần thân của lượt tải lên R2.

rss VÀ heapUsed cùng leo, heapUsed hình răng cưa
   → bình thường. Cái răng cưa CHÍNH LÀ việc thu gom rác đang chạy.
     Hãy xét theo việc ĐÁY của mỗi cái răng có dâng lên không.

ĐÁY răng cưa của heapUsed dâng lên qua nhiều giờ
   → đây mới là chữ ký của một cú rò rỉ JavaScript thật. Có cái gì
     đó sống sót qua mọi lần thu gom. Một Map đang phình, một mảng
     chỉ được push vào, những listener không bao giờ được gỡ.

rss leo trong khi heapTotal phẳng ở mức trần
   → V8 không phình heap được nữa và đang thu gom liên tục. Hãy
     kiểm thời gian GC (bài 5.3) — nhiều khả năng tiến trình đang
     tiêu thời gian cho việc thu gom nhiều hơn cho việc chính.

rss phẳng đúng ở mức hạn mức container
   → bạn đang bị bóp hoặc sắp bị giết. Đây không phải cái đồ thị
     để điều tra sau.</code></pre>

<h3>Cảnh báo theo cái gì</h3>
<pre><code>✅ rss / hạn_mức_bộ_nhớ_container &gt; 0,85
   Cảnh báo bộ nhớ duy nhất ánh xạ tới một hệ quả có thật:
   vượt 1,0 là bị OOM giết.

✅ mức phình của heapUsed qua 6 giờ, đo ở ĐIỂM THẤP NHẤT mỗi ngày
   So sánh cùng loại với cùng loại — cái đáy của răng cưa — nên
   việc cấp phát qua lại bình thường không kích hoạt nó.

❌ rss tăng so với hôm qua
   Luôn đúng. Xem phát hiện 1.

❌ heapUsed &gt; một số MB cố định
   Vô nghĩa nếu không biết trần heap, thứ phụ thuộc vào
   --max-old-space-size và bộ nhớ của container.</code></pre>

<h3>Cái bẫy hạn mức container</h3>
<pre><code class="language-yaml"># docker-compose.yml — nếu bạn đặt cái này...
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M</code></pre>
<pre><code>...thì Node KHÔNG biết về nó. V8 chọn trần heap của nó theo tổng
bộ nhớ của MÁY CHỦ, không theo hạn mức cgroup. Trên một VPS 6 GB
với hạn mức container 512 MB, V8 vui vẻ lên kế hoạch cho một cái
heap ~2 GB rồi bị OOM giết ở mốc 512 MB — trong khi heapUsed đọc
ra khoảng 300 MB và trông hoàn toàn khoẻ mạnh.

Cách chữa là nói cho nó biết:

  NODE_OPTIONS=--max-old-space-size=384     # ~75% của hạn mức

Giờ V8 thu gom quyết liệt khi nó tiến gần 384 MB thay vì bị giết
ở 512 MB mà không một lời báo trước. Bạn đánh đổi một chút thông
lượng lấy một tiến trình sống sót.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — chỗ rò rỉ bộ nhớ Node phổ biến nhất trong một kho mã cỡ này là một <code>Map</code> không có chặn dùng làm bộ nhớ đệm.</strong> Nó đọc lên thì hiển nhiên là đúng: <code>const cache = new Map()</code> ở phạm vi module, <code>cache.set(userId, data)</code> ở mỗi request, và một phép kiểm trước khi làm việc nặng. Không có cơ chế loại bỏ, nên nó phình theo số người dùng khác nhau, mãi mãi — và nó phình <em>nhanh nhất khi tải cao</em>, tức là đúng lúc bạn ít chịu nổi nhất. Lý do nó sống sót qua vòng review là vì nó chẳng giống một chỗ rò rỉ chút nào: không ai quên giải phóng gì cả, mã đang làm đúng cái nó nói. Trong kho này, <code>src/services/</code> là chỗ những cái đó sống, và triệu chứng là chữ ký của phát hiện 3 — đáy răng cưa của <code>heapUsed</code> dâng lên qua nhiều giờ. <strong>Mọi <code>Map</code>, <code>Set</code> hay mảng ở cấp module mà một request ghi vào đều cần một chính sách loại bỏ được nêu rõ ngay tại chỗ khai báo</strong>, dù đó là một LRU có trần kích thước, một TTL, hay một dòng chú thích giải thích vì sao không gian khoá là có chặn.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#processmemoryusage" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Node.js — process.memoryUsage()</span><span class="lc-sub">Định nghĩa của cả năm con số đo ở trên, kể cả lưu ý rằng rss BAO GỒM heap chứ không nằm cạnh nó.</span></span>
</a>
<a class="link-card dl" href="https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Ảnh chụp heap — tìm ra cái gì đang bị giữ lại</span><span class="lc-sub">Cách chụp một ảnh từ tiến trình Node đang chạy và đọc cây giữ tham chiếu, đó là cách bạn tìm ra cái Map ở cái bẫy trên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '5.3 — Garbage collection: the pauses you did not write|||5.3 — Thu gom rác: những lần dừng bạn không hề viết ra',
      slug: 'obs-5-3-thu-gom-rac',
      type: 'VIDEO',
      description: 'Đo thật: 82 lần dừng, 317 ms đứng yên, lần dài nhất 16,3 ms. Vì sao major GC mới là cái đáng theo dõi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Garbage collection: the pauses you did not write</h2>
<p class="lead">Every so often, V8 stops your JavaScript entirely and cleans up. You did not schedule these pauses and they are invisible in your code, but they are in your p99 — and lesson 5.2's rising heap makes them longer and more frequent. Here is what they actually cost.</p>

<h3>The two collectors</h3>
<pre><code>V8 splits the heap by AGE, because most objects die young.

  NEW SPACE (a few MB)          OLD SPACE (hundreds of MB)
  ─────────────────             ─────────────────────────
  Everything is born here.      Survivors get promoted here.
  Collected by SCAVENGE:        Collected by MARK-SWEEP:
  copy the survivors out,       walk every reachable object,
  wipe the rest.                free the rest, compact.

  Cost is proportional to       Cost is proportional to the
  SURVIVORS, not to garbage.    SIZE OF THE LIVE HEAP.
  Fast, frequent, ~1–5ms.       Slow, rare, ~10–100ms+.

The design consequence: allocating a million short-lived
objects is nearly free. KEEPING a million objects alive is
what costs you — every major GC has to walk all of them.</code></pre>

<h3>The measurement</h3>
<pre><code class="language-javascript">// m15.mjs — observe every GC pause, grouped by kind
import { PerformanceObserver, constants } from 'node:perf_hooks';

new PerformanceObserver(list =&gt; {
  for (const e of list.getEntries()) record(e.detail.kind, e.duration);
}).observe({ entryTypes: ['gc'] });

// A workload shaped like a real API: lots of short-lived objects
// per request, plus a cache that keeps a fraction of them alive.
const cache = [];
for (let r = 0; r &lt; 300; r++) {
  const tmp = [];
  for (let i = 0; i &lt; 30_000; i++) tmp.push({ id: i, name: 'user_' + i, tags: ['a','b'] });
  if (r % 10 === 0) cache.push(tmp.slice(0, 3000));      // some survive
}
</code></pre>
<div class="out">$ node m15.mjs
loại GC                 số lần   tổng ms    TB ms   max ms
minor (scavenge)            50     181.5     3.63      6.2
incremental                 16       8.0     0.50      0.7
major (mark-sweep)          16     127.3     7.96     16.3

tổng thời gian ĐỨNG YÊN vì GC: 317 ms trên 82 lần dừng
lần dừng p99: 16.3 ms   dài nhất: 16.3 ms</div>

<h3>Reading it</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">82 pauses totalling 317 ms of frozen thread</span><span class="lz-d">During that time nothing ran: no request handlers, no timers, no I/O callbacks. This is added directly to the latency of whatever was in flight.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Minor GC: 50 pauses, 3.63 ms average</span><span class="lz-d">Frequent and cheap, exactly as designed. Fifty scavenges is not a problem — it is the collector doing its job on short-lived objects.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Major GC: 16 pauses averaging 7.96 ms, worst 16.3 ms</span><span class="lz-d">Twice as expensive per pause as a scavenge, and this heap is tiny. Scale the live set to a real service's hundreds of megabytes and these become 50–200 ms.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The <em>rate</em> of major GC is the signal, not its duration</span><span class="lz-d">Sixteen majors in this short run means objects are being promoted to old space constantly — the cache. A healthy service does a handful of majors per minute, not per second.</span></div>
</div>

<h3>Why this shows up in p99 and nowhere else</h3>
<pre><code>A 16ms major GC hits ONE request out of however many are
served in that window. At 50 rps that is one request in
several hundred.

  p50   unaffected. The typical request never meets a GC.
  p95   barely affected.
  p99   this is exactly where a 16ms pause lands.

Which is lesson 4.2's argument arriving again from a
different direction: the average cannot see GC, and GC
is a real, recurring, measurable component of your worst
latencies.

Cross-check with lesson 5.1: a GC pause is ALSO event
loop lag, because the loop is frozen. If your p99 lag
spikes and your GC duration metric spikes at the same
timestamps, you have found the cause without a profiler.</code></pre>

<h3>Collecting it</h3>
<pre><code class="language-typescript">// prom-client does this for you — one line
import { collectDefaultMetrics } from 'prom-client';
collectDefaultMetrics({ gcDurationBuckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25] });

// Gives you: nodejs_gc_duration_seconds{kind="minor"|"major"|"incremental"}
// as a histogram — which, per lesson 4.3, means the buckets matter.
// These are chosen for the pause range measured above.</code></pre>
<pre><code class="language-promql"># Fraction of wall-clock time spent frozen in GC.
# Above ~5% you are paying real throughput for collection.
sum(rate(nodejs_gc_duration_seconds_sum[5m]))

# Major GC rate — the leading indicator from finding 4
rate(nodejs_gc_duration_seconds_count{kind="major"}[5m])

# p99 major pause, next to p99 event loop lag on the same panel
histogram_quantile(0.99,
  sum by (le) (rate(nodejs_gc_duration_seconds_bucket{kind="major"}[5m])))</code></pre>

<h3>What actually reduces GC pressure</h3>
<pre><code>✅ Keep less alive. This is the only real lever. The pitfall
   in lesson 5.2 — an unbounded Map — makes every future
   major GC slower, permanently, because the collector must
   walk it every time.

✅ Stream instead of buffering. Reading a 50MB upload into
   a Buffer promotes 50MB to old space. Piping it does not.

✅ Do not hold parsed JSON longer than you need it. The
   parsed object graph of a large payload is thousands of
   objects; letting it die in new space costs nothing,
   caching it costs a walk on every major GC.

⚠️ Object pooling: rarely worth it in modern V8. Allocation
   in new space is a pointer bump. Reusing objects keeps
   them alive, which moves cost from cheap scavenges to
   expensive majors. Measure before believing it helps.

❌ Calling global.gc() in production. It forces a full
   pause at a moment YOU chose rather than one V8 chose,
   and V8's choice is better informed than yours.</code></pre>

<div class="pitfall">
<p><strong>Trap — GC time rising is a symptom whose cause is somewhere else entirely, and treating it directly makes things worse.</strong> The instinct on seeing high GC time is to tune the collector: raise <code>--max-old-space-size</code>, try a different GC flag, reduce allocation. But a healthy service with a stable live set has stable GC time no matter how much it allocates — scavenge cost scales with survivors, not garbage. So rising major-GC time almost always means <strong>the live set is growing</strong>, which is lesson 5.2's leak wearing a different costume. Raising the heap limit is the specifically harmful response: it delays the OOM kill while making each major GC walk a larger heap, so pauses get longer and the eventual failure arrives later and hurts more. <strong>Read GC time as a pointer to <code>heapUsed</code>, and go find what is being retained.</strong></p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://v8.dev/blog/trash-talk" target="_blank" rel="noopener">
  <span class="lc-ico">🗑️</span>
  <span class="lc-body"><span class="lc-title">V8 — Trash talk: the Orinoco garbage collector</span><span class="lc-sub">How scavenge and mark-sweep actually work, from the team that wrote them, including why cost scales with survivors.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#class-performanceentry" target="_blank" rel="noopener">
  <span class="lc-ico">📉</span>
  <span class="lc-body"><span class="lc-title">Node.js — GC performance entries</span><span class="lc-sub">The PerformanceObserver API used in the measurement, and the kind constants that separate minor from major.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Thu gom rác: những lần dừng bạn không hề viết ra</h2>
<p class="lead">Thỉnh thoảng, V8 dừng hẳn JavaScript của bạn lại và đi dọn dẹp. Bạn không hề lên lịch cho những lần dừng ấy và chúng vô hình trong mã của bạn, nhưng chúng nằm trong p99 của bạn — và cái heap đang dâng của bài 5.2 làm chúng dài hơn và dày hơn. Đây là cái giá thật của chúng.</p>

<h3>Hai bộ thu gom</h3>
<pre><code>V8 chia heap theo TUỔI, vì phần lớn object chết non.

  NEW SPACE (vài MB)            OLD SPACE (hàng trăm MB)
  ─────────────────             ─────────────────────────
  Mọi thứ sinh ra ở đây.        Kẻ sống sót được thăng lên đây.
  Thu bằng SCAVENGE:            Thu bằng MARK-SWEEP:
  chép kẻ sống sót ra ngoài,    đi qua mọi object với tới được,
  quét sạch phần còn lại.       giải phóng phần còn lại, nén lại.

  Chi phí tỉ lệ với SỐ KẺ       Chi phí tỉ lệ với KÍCH THƯỚC
  SỐNG SÓT, không tỉ lệ với     PHẦN HEAP ĐANG SỐNG.
  lượng rác. Nhanh, dày,        Chậm, hiếm, ~10–100ms trở lên.
  ~1–5ms.

Hệ quả thiết kế: cấp phát một triệu object sống ngắn thì gần
như miễn phí. GIỮ một triệu object còn sống mới là cái tốn của
bạn — mỗi lần major GC đều phải đi qua tất cả chúng.</code></pre>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m15.mjs — quan sát mọi lần dừng vì GC, nhóm theo loại
import { PerformanceObserver, constants } from 'node:perf_hooks';

new PerformanceObserver(list =&gt; {
  for (const e of list.getEntries()) record(e.detail.kind, e.duration);
}).observe({ entryTypes: ['gc'] });

// Khối lượng công việc có hình dạng như một API thật: nhiều object
// sống ngắn mỗi request, cộng một cache giữ lại một phần chúng.
const cache = [];
for (let r = 0; r &lt; 300; r++) {
  const tmp = [];
  for (let i = 0; i &lt; 30_000; i++) tmp.push({ id: i, name: 'user_' + i, tags: ['a','b'] });
  if (r % 10 === 0) cache.push(tmp.slice(0, 3000));      // một phần sống sót
}
</code></pre>
<div class="out">$ node m15.mjs
loại GC                 số lần   tổng ms    TB ms   max ms
minor (scavenge)            50     181.5     3.63      6.2
incremental                 16       8.0     0.50      0.7
major (mark-sweep)          16     127.3     7.96     16.3

tổng thời gian ĐỨNG YÊN vì GC: 317 ms trên 82 lần dừng
lần dừng p99: 16.3 ms   dài nhất: 16.3 ms</div>

<h3>Đọc nó</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">82 lần dừng, cộng lại 317 ms luồng đóng băng</span><span class="lz-d">Trong khoảng đó không có gì chạy: không handler request, không bộ đếm giờ, không callback I/O. Cái này cộng thẳng vào độ trễ của bất cứ thứ gì đang bay dở.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Minor GC: 50 lần dừng, trung bình 3,63 ms</span><span class="lz-d">Dày và rẻ, đúng như thiết kế. Năm mươi lần scavenge không phải vấn đề — đó là bộ thu gom đang làm việc của nó với các object sống ngắn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Major GC: 16 lần dừng trung bình 7,96 ms, tệ nhất 16,3 ms</span><span class="lz-d">Đắt gấp đôi mỗi lần dừng so với scavenge, mà cái heap này thì bé xíu. Nhân phần sống lên hàng trăm megabyte của một dịch vụ thật thì những con số này thành 50–200 ms.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><em>Tần suất</em> major GC mới là tín hiệu, không phải thời lượng của nó</span><span class="lz-d">Mười sáu lần major trong một lượt chạy ngắn thế này nghĩa là object đang bị thăng lên old space liên tục — cái cache. Một dịch vụ khoẻ mạnh làm dăm ba lần major mỗi PHÚT, không phải mỗi giây.</span></div>
</div>

<h3>Vì sao cái này hiện ra ở p99 mà không ở đâu khác</h3>
<pre><code>Một lần major GC 16ms đánh trúng MỘT request trong số bao nhiêu
request được phục vụ trong cửa sổ đó. Ở 50 rps thì đó là một
request trong vài trăm.

  p50   không bị ảnh hưởng. Request điển hình chẳng gặp GC bao giờ.
  p95   ảnh hưởng không đáng kể.
  p99   đây chính là chỗ một lần dừng 16ms rơi vào.

Mà đó là lý lẽ của bài 4.2 quay lại từ một hướng khác: cái trung
bình không thấy được GC, mà GC là một thành phần có thật, lặp
lại, đo được của những độ trễ tệ nhất của bạn.

Đối chiếu với bài 5.1: một lần dừng vì GC CŨNG LÀ độ trễ vòng lặp
sự kiện, vì vòng lặp đang đóng băng. Nếu p99 độ trễ của bạn vọt
gai và chỉ số thời lượng GC cũng vọt gai ở cùng những dấu thời
gian, thì bạn đã tìm ra nguyên nhân mà không cần trình phân tích
hiệu năng nào.</code></pre>

<h3>Thu thập nó</h3>
<pre><code class="language-typescript">// prom-client làm sẵn cho bạn — một dòng
import { collectDefaultMetrics } from 'prom-client';
collectDefaultMetrics({ gcDurationBuckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25] });

// Cho bạn: nodejs_gc_duration_seconds{kind="minor"|"major"|"incremental"}
// dưới dạng histogram — mà theo bài 4.3 thì nghĩa là các ô rất quan trọng.
// Bộ ô này chọn cho đúng dải thời gian dừng đo được ở trên.</code></pre>
<pre><code class="language-promql"># Phần thời gian tường bị đóng băng trong GC.
# Trên khoảng 5% là bạn đang trả thông lượng thật cho việc thu gom.
sum(rate(nodejs_gc_duration_seconds_sum[5m]))

# Tần suất major GC — chỉ báo sớm từ phát hiện 4
rate(nodejs_gc_duration_seconds_count{kind="major"}[5m])

# p99 lần dừng major, đặt cạnh p99 độ trễ vòng lặp trên cùng một panel
histogram_quantile(0.99,
  sum by (le) (rate(nodejs_gc_duration_seconds_bucket{kind="major"}[5m])))</code></pre>

<h3>Cái gì thật sự giảm áp lực GC</h3>
<pre><code>✅ Giữ ít thứ sống lại hơn. Đây là đòn bẩy thật sự duy nhất.
   Cái bẫy ở bài 5.2 — một Map không có chặn — làm mọi lần major
   GC trong tương lai chậm hơn, VĨNH VIỄN, vì bộ thu gom phải đi
   qua nó mỗi lần.

✅ Chảy dòng thay vì đệm lại. Đọc một lượt tải lên 50MB vào một
   Buffer là thăng 50MB lên old space. Pipe nó thì không.

✅ Đừng giữ JSON đã bóc lâu hơn mức cần. Đồ thị object đã bóc của
   một payload lớn là hàng nghìn object; để nó chết trong new
   space thì chẳng tốn gì, đệm nó lại thì tốn một lượt đi qua ở
   mỗi lần major GC.

⚠️ Bể object (object pooling): hiếm khi đáng trong V8 hiện đại.
   Cấp phát trong new space chỉ là một cú đẩy con trỏ. Dùng lại
   object là giữ chúng sống, tức là chuyển chi phí từ scavenge rẻ
   sang major đắt. Hãy đo trước khi tin là nó giúp được.

❌ Gọi global.gc() trên production. Nó ép một lần dừng toàn phần
   vào một thời điểm BẠN chọn thay vì thời điểm V8 chọn, mà lựa
   chọn của V8 thì có nhiều thông tin hơn lựa chọn của bạn.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thời gian GC tăng lên là một TRIỆU CHỨNG mà nguyên nhân nằm ở chỗ hoàn toàn khác, và chữa thẳng vào nó thì làm mọi thứ tệ hơn.</strong> Bản năng khi thấy thời gian GC cao là đi chỉnh bộ thu gom: nâng <code>--max-old-space-size</code>, thử một cờ GC khác, giảm cấp phát. Nhưng một dịch vụ khoẻ mạnh với phần sống ổn định thì có thời gian GC ổn định bất kể nó cấp phát bao nhiêu — chi phí scavenge tỉ lệ với kẻ sống sót, không tỉ lệ với rác. Nên thời gian major GC tăng lên gần như luôn nghĩa là <strong>phần sống đang phình ra</strong>, mà đó là cú rò rỉ của bài 5.2 khoác một bộ đồ khác. Nâng trần heap là phản ứng gây hại một cách cụ thể: nó trì hoãn cú OOM giết trong khi làm mỗi lần major GC phải đi qua một cái heap lớn hơn, nên các lần dừng dài ra và cú hỏng cuối cùng tới muộn hơn và đau hơn. <strong>Hãy đọc thời gian GC như một cái mũi tên trỏ về <code>heapUsed</code>, rồi đi tìm xem cái gì đang bị giữ lại.</strong></p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://v8.dev/blog/trash-talk" target="_blank" rel="noopener">
  <span class="lc-ico">🗑️</span>
  <span class="lc-body"><span class="lc-title">V8 — Trash talk: bộ thu gom rác Orinoco</span><span class="lc-sub">Scavenge và mark-sweep thật sự chạy thế nào, từ chính đội viết ra chúng, kể cả lý do chi phí tỉ lệ với kẻ sống sót.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#class-performanceentry" target="_blank" rel="noopener">
  <span class="lc-ico">📉</span>
  <span class="lc-body"><span class="lc-title">Node.js — mục hiệu năng của GC</span><span class="lc-sub">API PerformanceObserver dùng trong phép đo, và các hằng số kind phân biệt minor với major.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '5.4 — Pools and handles: what is waiting on what|||5.4 — Bể tài nguyên và handle: cái gì đang chờ cái gì',
      slug: 'obs-5-4-be-va-handle',
      type: 'VIDEO',
      description: 'Bể kết nối Prisma của kho này chưa từng được đặt, và max_connections của Postgres chỉ nằm trong một dòng chú thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Pools and handles: what is waiting on what</h2>
<p class="lead">Lessons 5.1 to 5.3 covered saturation of the CPU thread and of memory. There is a third kind that produces the most confusing incidents of all: your process is idle, memory is fine, the database is fine — and every request takes four seconds, because they are all queueing for one of nine connections.</p>

<h3>Why a pool is a queue you cannot see</h3>
<pre><code>request 1 ─┐
request 2 ─┤
request 3 ─┼──▶ [ pool: 9 connections ] ──▶ Postgres
   ...     │           ▲
request 40─┘           │
                       └─ requests 10–40 are WAITING HERE

From the outside this is indistinguishable from a slow
database. Every symptom points at Postgres:

  · request latency high            ✓ matches "slow DB"
  · event loop lag NORMAL           ✓ matches "slow DB"
  · CPU low                         ✓ matches "slow DB"
  · Postgres CPU low                ✗ ...does not match
  · pg_stat_activity nearly empty   ✗ ...does not match

Those last two are the tell, and you only look at them if
you already suspect the pool. A pool-wait metric turns a
two-hour investigation into a glance.</code></pre>

<h3>What this repository actually configures</h3>
<pre><code class="language-bash">$ grep -n "connection_limit" .env.example prisma/schema.prisma
# (no output)

$ grep -c "max_connections" docker-compose.yml
1        # ...and it is inside a COMMENT, not a -c flag</code></pre>
<pre><code class="language-yaml"># docker-compose.yml:24 — the comment in question
# Performance tuning sized for the 2G container on the 8GB VPS (2026-07-14).
# shared_buffers = 25% of the container cap; work_mem is per-operation
# so kept modest vs max_connections.
command:
  - postgres
  - -c
  - shared_buffers=512MB
  # ...eight more -c flags, none of them max_connections</code></pre>
<p>So both numbers are defaults, and neither was chosen:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Prisma pool size</span><span class="lz-t">Default: <code>num_cpus × 2 + 1</code></span><span class="lz-d">On a 4-core VPS that is <strong>9 connections</strong>. It is also computed from the <em>host's</em> core count, not the container's CPU allocation — so it changes if you move to a bigger VPS, silently.</span></div>
  <div class="lz-node"><span class="lz-k">Postgres max_connections</span><span class="lz-t">Default: <strong>100</strong></span><span class="lz-d">Never set. The comment reasons about it correctly — <code>work_mem=12MB</code> is per-operation, so 100 connections doing sorts can far exceed the 2 GB container — but the value it reasons about is the default nobody wrote down.</span></div>
</div>
<p>Nine of one hundred are in use. That is not a problem — it is a service leaving 91% of its database capacity unused while queueing its own requests. And nobody would know, because there is no metric for it.</p>

<h3>The metric that resolves it</h3>
<pre><code class="language-typescript">// Prisma exposes pool internals via its metrics feature
// (schema.prisma: previewFeatures = ["metrics"])
import { Gauge, Histogram } from 'prom-client';

const poolWait = new Histogram({
  name: 'db_pool_wait_seconds',
  help: 'Time a query spent waiting for a free connection',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});

new Gauge({
  name: 'db_pool_connections',
  help: 'Prisma connection pool',
  labelNames: ['state'] as const,
  async collect() {
    const m = await prisma.$metrics.json();
    const g = (k) =&gt; m.gauges.find(x =&gt; x.key === k)?.value ?? 0;
    this.set({ state: 'busy' }, g('prisma_pool_connections_busy'));
    this.set({ state: 'idle' }, g('prisma_pool_connections_idle'));
    this.set({ state: 'waiting' }, g('prisma_client_queries_wait'));  // ← the one
  },
});</code></pre>
<pre><code>The three numbers, and how to read them together:

  busy ≈ pool size, waiting &gt; 0    the pool is the bottleneck.
                                   Raise connection_limit.

  busy low, waiting = 0,           the DATABASE is slow.
  query duration high              Look at pg_stat_statements.

  busy ≈ pool size, waiting = 0    exactly at capacity. Fine
                                   now, no headroom for a spike.

&#96;waiting&#96; is the metric. busy alone cannot distinguish
"perfectly utilised" from "everyone is queueing".</code></pre>

<h3>Sizing the pool honestly</h3>
<pre><code>The naive answer — "make it bigger" — is wrong past a point,
because Postgres connections are PROCESSES, not threads. Each
one costs memory and context switching, and past roughly
(2 × cores + effective_spindle_count) they make throughput
WORSE, not better.

For this VPS: 4 cores, SSD → about 9–12 is genuinely near
optimal for pure throughput. The default is not badly chosen;
it is just not chosen.

The real reason to raise it is BURSTINESS, not throughput:

  DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=10"

  connection_limit=20   absorbs a spike without queueing
  pool_timeout=10       fail after 10s instead of hanging
                        forever — a fast failure you can
                        alert on beats a slow one you cannot

And the budget: 20 per backend instance, plus the frontend's
connections, plus any worker, must stay well under 100. Write
the arithmetic down next to max_connections when you set it.</code></pre>

<h3>The other pool: outbound HTTP</h3>
<pre><code class="language-typescript">// Node's global agent limits concurrent sockets PER HOST.
// The default in Node 22 is 'Infinity' for http.globalAgent — but
// undici (which powers fetch) defaults to 128 connections per origin.
//
// This matters for the LLM gateway: lesson 3.5's incident was one
// call taking 30 seconds. If 128 of them are in flight and the
// gateway is slow, the 129th QUEUES — adding gateway latency to a
// request that has not even been sent yet.

import { Agent, setGlobalDispatcher } from 'undici';
setGlobalDispatcher(new Agent({
  connections: 32,                    // bounded, and known
  connectTimeout: 5_000,
  headersTimeout: 25_000,             // BELOW nginx's 30s — lesson 3.5
  bodyTimeout: 25_000,
}));</code></pre>

<h3>Handles: the cheap leak detector</h3>
<pre><code class="language-javascript">// Two numbers prom-client gives you for free
nodejs_active_handles_total     // open sockets, servers, timers, streams
nodejs_active_requests_total    // in-flight libuv operations (fs, dns)

// They are not precise, and that is fine — they are a SHAPE.
// A handle count that grows monotonically over hours means
// something is opened per request and never closed:
//
//   · a setInterval created inside a handler
//   · a database client constructed per request
//   · a stream whose 'close' path is only on the happy branch
//   · an event listener added but never removed
//
// This is one of the few metrics where the TREND is the whole
// signal and the absolute value means almost nothing.</code></pre>

<div class="pitfall">
<p><strong>Trap — pool exhaustion has a signature that points exactly the wrong way, and it deepens under load.</strong> When the pool is the bottleneck, every symptom you can see says &quot;the database is slow&quot;: request latency is high, the event loop is idle, CPU is low. The database itself is nearly idle, but you have no reason to check that, so the natural response is to optimise queries or add an index — which changes nothing, because the queries were never the problem. Worse, the feedback is inverted: <strong>a slower query holds its connection longer, so one genuinely slow query makes the pool wait spike for every <em>other</em> route</strong>, and the pattern on your dashboard is a whole service degrading at once with no single cause visible. The only way out is to measure the wait time itself. Without <code>waiting</code>, this incident is unsolvable by inspection; with it, it is a five-second diagnosis.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Prisma — the connection pool</span><span class="lc-sub">The default formula, connection_limit and pool_timeout, and the metrics feature used to expose the waiting gauge above.</span></span>
</a>
<a class="link-card dl" href="https://wiki.postgresql.org/wiki/Number_Of_Database_Connections" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL wiki — how many connections</span><span class="lc-sub">Why more connections reduce throughput past a point, with the formula this lesson's sizing advice comes from.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Bể tài nguyên và handle: cái gì đang chờ cái gì</h2>
<p class="lead">Bài 5.1 tới 5.3 nói về sự bão hoà của luồng CPU và của bộ nhớ. Còn một loại thứ ba sinh ra những sự cố khó hiểu nhất trong tất cả: tiến trình của bạn nhàn rỗi, bộ nhớ ổn, cơ sở dữ liệu ổn — và mọi request mất bốn giây, vì tất cả đang xếp hàng chờ một trong chín cái kết nối.</p>

<h3>Vì sao một cái bể là một hàng đợi bạn không nhìn thấy</h3>
<pre><code>request 1 ─┐
request 2 ─┤
request 3 ─┼──▶ [ bể: 9 kết nối ] ──▶ Postgres
   ...     │           ▲
request 40─┘           │
                       └─ request 10–40 đang CHỜ Ở ĐÂY

Nhìn từ bên ngoài thì cái này không phân biệt được với một cơ
sở dữ liệu chậm. Mọi triệu chứng đều chỉ vào Postgres:

  · độ trễ request cao              ✓ khớp với "DB chậm"
  · độ trễ vòng lặp BÌNH THƯỜNG     ✓ khớp với "DB chậm"
  · CPU thấp                        ✓ khớp với "DB chậm"
  · CPU của Postgres thấp           ✗ ...không khớp
  · pg_stat_activity gần như rỗng   ✗ ...không khớp

Hai cái cuối mới là dấu hiệu, mà bạn chỉ nhìn tới chúng nếu bạn
đã nghi cái bể rồi. Một chỉ số chờ-bể biến một cuộc điều tra hai
tiếng thành một cái liếc mắt.</code></pre>

<h3>Kho này thật sự cấu hình những gì</h3>
<pre><code class="language-bash">$ grep -n "connection_limit" .env.example prisma/schema.prisma
# (không có kết quả)

$ grep -c "max_connections" docker-compose.yml
1        # ...và nó nằm trong một dòng CHÚ THÍCH, không phải một cờ -c</code></pre>
<pre><code class="language-yaml"># docker-compose.yml:24 — cái chú thích đang nói tới
# Performance tuning sized for the 2G container on the 8GB VPS (2026-07-14).
# shared_buffers = 25% of the container cap; work_mem is per-operation
# so kept modest vs max_connections.
command:
  - postgres
  - -c
  - shared_buffers=512MB
  # ...tám cờ -c nữa, không cái nào là max_connections</code></pre>
<p>Vậy cả hai con số đều là mặc định, và không con số nào được chọn cả:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Kích thước bể Prisma</span><span class="lz-t">Mặc định: <code>num_cpus × 2 + 1</code></span><span class="lz-d">Trên một VPS 4 nhân đó là <strong>9 kết nối</strong>. Nó cũng được tính từ số nhân của <em>máy chủ</em>, không phải từ phần CPU cấp cho container — nên nó tự đổi nếu bạn chuyển sang một VPS lớn hơn, trong im lặng.</span></div>
  <div class="lz-node"><span class="lz-k">max_connections của Postgres</span><span class="lz-t">Mặc định: <strong>100</strong></span><span class="lz-d">Chưa từng được đặt. Cái chú thích lập luận về nó đúng — <code>work_mem=12MB</code> là theo từng thao tác, nên 100 kết nối cùng sắp xếp có thể vượt xa cái container 2 GB — nhưng cái giá trị mà nó lập luận về lại là mặc định không ai viết xuống.</span></div>
</div>
<p>Chín trên một trăm đang được dùng. Đó không phải một vấn đề — đó là một dịch vụ để không 91% dung lượng cơ sở dữ liệu của nó trong khi bắt chính request của nó xếp hàng. Và chẳng ai biết, vì không có chỉ số nào cho nó cả.</p>

<h3>Cái chỉ số giải quyết được chuyện đó</h3>
<pre><code class="language-typescript">// Prisma phơi phần bên trong của bể qua tính năng metrics
// (schema.prisma: previewFeatures = ["metrics"])
import { Gauge, Histogram } from 'prom-client';

const poolWait = new Histogram({
  name: 'db_pool_wait_seconds',
  help: 'Time a query spent waiting for a free connection',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});

new Gauge({
  name: 'db_pool_connections',
  help: 'Prisma connection pool',
  labelNames: ['state'] as const,
  async collect() {
    const m = await prisma.$metrics.json();
    const g = (k) =&gt; m.gauges.find(x =&gt; x.key === k)?.value ?? 0;
    this.set({ state: 'busy' }, g('prisma_pool_connections_busy'));
    this.set({ state: 'idle' }, g('prisma_pool_connections_idle'));
    this.set({ state: 'waiting' }, g('prisma_client_queries_wait'));  // ← cái này
  },
});</code></pre>
<pre><code>Ba con số, và cách đọc chúng cùng nhau:

  busy ≈ cỡ bể, waiting &gt; 0        cái bể là nút thắt cổ chai.
                                   Hãy nâng connection_limit.

  busy thấp, waiting = 0,          CƠ SỞ DỮ LIỆU chậm.
  thời lượng truy vấn cao          Hãy xem pg_stat_statements.

  busy ≈ cỡ bể, waiting = 0        đúng ở mức công suất. Giờ thì
                                   ổn, nhưng không còn chỗ cho
                                   một cơn dồn.

&#96;waiting&#96; mới là cái chỉ số. Chỉ mình busy không phân biệt được
"dùng hết công suất một cách hoàn hảo" với "tất cả đang xếp hàng".</code></pre>

<h3>Chọn cỡ bể cho trung thực</h3>
<pre><code>Câu trả lời ngây thơ — "làm nó to lên" — là sai quá một mức nào
đó, vì kết nối Postgres là những TIẾN TRÌNH, không phải luồng.
Mỗi cái tốn bộ nhớ và tốn chuyển ngữ cảnh, và quá khoảng
(2 × số nhân + số trục đĩa hiệu dụng) thì chúng làm thông lượng
TỆ ĐI chứ không tốt lên.

Với cái VPS này: 4 nhân, SSD → khoảng 9–12 là thật sự gần tối ưu
cho thông lượng thuần. Cái mặc định không phải chọn tồi; nó chỉ
là không được chọn.

Lý do thật sự để nâng nó là ĐỘ DỒN CỤC, không phải thông lượng:

  DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=10"

  connection_limit=20   hứng một cơn dồn mà không phải xếp hàng
  pool_timeout=10       hỏng sau 10s thay vì treo mãi mãi — một
                        cú hỏng nhanh mà bạn cảnh báo được thì
                        hơn một cú hỏng chậm mà bạn không

Và bài toán ngân sách: 20 cho mỗi thực thể backend, cộng số kết
nối của frontend, cộng bất cứ worker nào, phải nằm thoải mái dưới
100. Hãy viết phép tính đó ra ngay cạnh max_connections lúc bạn
đặt nó.</code></pre>

<h3>Cái bể còn lại: HTTP gửi đi</h3>
<pre><code class="language-typescript">// Agent toàn cục của Node giới hạn số socket đồng thời THEO TỪNG HOST.
// Mặc định ở Node 22 là 'Infinity' với http.globalAgent — nhưng undici
// (thứ chạy dưới fetch) mặc định 128 kết nối cho mỗi origin.
//
// Điều này quan trọng với cổng LLM: sự cố ở bài 3.5 là một lời gọi mất
// 30 giây. Nếu có 128 lời gọi như thế đang bay và cổng thì chậm, thì
// cái thứ 129 phải XẾP HÀNG — cộng thêm độ trễ của cổng vào một request
// còn chưa được gửi đi.

import { Agent, setGlobalDispatcher } from 'undici';
setGlobalDispatcher(new Agent({
  connections: 32,                    // có chặn, và biết trước
  connectTimeout: 5_000,
  headersTimeout: 25_000,             // DƯỚI mốc 30s của nginx — bài 3.5
  bodyTimeout: 25_000,
}));</code></pre>

<h3>Handle: máy dò rò rỉ giá rẻ</h3>
<pre><code class="language-javascript">// Hai con số prom-client cho bạn miễn phí
nodejs_active_handles_total     // socket, server, timer, stream đang mở
nodejs_active_requests_total    // thao tác libuv đang bay (fs, dns)

// Chúng không chính xác, và thế cũng được — chúng là một HÌNH DẠNG.
// Một số handle tăng đơn điệu qua nhiều giờ nghĩa là có cái gì đó được
// mở ra ở mỗi request và không bao giờ được đóng:
//
//   · một setInterval tạo bên trong một handler
//   · một client cơ sở dữ liệu dựng mới cho mỗi request
//   · một stream mà đường 'close' chỉ nằm ở nhánh thuận lợi
//   · một listener được thêm vào mà không bao giờ được gỡ
//
// Đây là một trong số ít chỉ số mà XU HƯỚNG là toàn bộ tín hiệu còn
// giá trị tuyệt đối thì gần như chẳng nói lên gì.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cạn bể kết nối có một chữ ký chỉ đúng vào hướng ngược lại, và nó sâu thêm khi tải tăng.</strong> Khi cái bể là nút thắt cổ chai, mọi triệu chứng bạn nhìn thấy đều nói &quot;cơ sở dữ liệu chậm&quot;: độ trễ request cao, vòng lặp sự kiện nhàn rỗi, CPU thấp. Bản thân cơ sở dữ liệu thì gần như rảnh rang, nhưng bạn chẳng có lý do gì để đi kiểm cái đó, nên phản ứng tự nhiên là đi tối ưu truy vấn hoặc thêm chỉ mục — và điều đó chẳng thay đổi gì, vì truy vấn chưa từng là vấn đề. Tệ hơn, phản hồi bị đảo ngược: <strong>một truy vấn chậm giữ kết nối của nó lâu hơn, nên MỘT truy vấn chậm thật sự làm thời gian chờ bể vọt lên cho MỌI route <em>khác</em></strong>, và cái hình dạng trên bảng theo dõi của bạn là cả một dịch vụ cùng lúc xuống cấp mà không thấy một nguyên nhân đơn lẻ nào. Lối thoát duy nhất là đo chính cái thời gian chờ ấy. Không có <code>waiting</code>, sự cố này không giải được bằng cách ngồi nhìn; có nó thì đây là một chẩn đoán năm giây.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Prisma — bể kết nối</span><span class="lc-sub">Công thức mặc định, connection_limit và pool_timeout, cùng tính năng metrics dùng để phơi cái gauge waiting ở trên.</span></span>
</a>
<a class="link-card dl" href="https://wiki.postgresql.org/wiki/Number_Of_Database_Connections" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Wiki PostgreSQL — bao nhiêu kết nối</span><span class="lc-sub">Vì sao nhiều kết nối hơn lại làm giảm thông lượng khi vượt một mức, kèm công thức mà lời khuyên chọn cỡ ở bài này rút ra từ đó.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '5.5 — Turning it all on, and what each number means|||5.5 — Bật hết lên, và mỗi con số nghĩa là gì',
      slug: 'obs-5-5-bat-het-len',
      type: 'VIDEO',
      description: 'collectDefaultMetrics cho bạn khoảng 60 chỉ số trong một dòng. Đây là bảy cái đáng nhìn và lý do bỏ phần còn lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Turning it all on, and what each number means</h2>
<p class="lead">One line of prom-client gives you roughly sixty Node metrics. That is both the easiest win in this course and a small version of the problem from lesson 4.5: sixty numbers nobody can interpret is not better than five they can. This lesson turns them on and then says which ones to actually look at.</p>

<h3>The one line</h3>
<pre><code class="language-typescript">// src/metrics.ts
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics({
  // Buckets chosen for the GC pauses measured in lesson 5.3
  gcDurationBuckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25],
  // A label on every metric, so you can tell instances apart
  labels: { service: 'backend', version: process.env.APP_VERSION ?? 'dev' },
});</code></pre>
<pre><code>What that gives you, by family:

  process_*            9 metrics   CPU, RSS, fds, start time
  nodejs_heap_*        7 metrics   the numbers from lesson 5.2
  nodejs_gc_*          1 histogram lesson 5.3
  nodejs_eventloop_*   2 metrics   lag mean and max — NOT p99
  nodejs_active_*      2 metrics   handles and requests, lesson 5.4
  nodejs_version_info  1 metric    a gauge whose VALUE is 1 and
                                   whose LABELS carry the version
  ...plus per-heap-space breakdowns, which is most of the count</code></pre>

<h3>The seven worth putting on a dashboard</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · <code>nodejs_eventloop_lag_p99_seconds</code></span><span class="lz-lnote">The saturation metric from lesson 5.1. ⚠️ The default <code>nodejs_eventloop_lag_seconds</code> is a <em>mean</em> — which lesson 5.1 measured as 1.1 ms even while blocking 120 ms. Use the p99 variant or the custom gauge from that lesson.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · <code>process_resident_memory_bytes</code></span><span class="lz-lnote">RSS. Alert on this divided by the container limit, per lesson 5.2. The only memory number with a consequence attached.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · <code>nodejs_heap_size_used_bytes</code></span><span class="lz-lnote">heapUsed. Watch the <em>bottom</em> of the sawtooth over hours — that is the leak signature.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>nodejs_external_memory_bytes</code></span><span class="lz-lnote">Buffers and native allocations. Rises when sharp, FFmpeg or an upload path holds data. The other half of &quot;memory is climbing&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · <code>nodejs_gc_duration_seconds{kind="major"}</code></span><span class="lz-lnote">Rate and p99. Read it as a pointer to metric 3, per lesson 5.3's pitfall.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · <code>process_open_fds</code></span><span class="lz-lnote">File descriptors, against <code>process_max_fds</code>. Hitting the ceiling produces <code>EMFILE</code>, which surfaces as &quot;cannot connect to anything&quot; and looks like a network outage.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · <code>nodejs_active_handles_total</code></span><span class="lz-lnote">Trend only, per lesson 5.4. Monotonic growth over hours means something is opened per request and never closed.</span></div>
</div>

<h3>The one that looks useless and is not</h3>
<pre><code>nodejs_version_info{version="v22.22.2", major="22", ...}  1

A gauge whose value is always 1. The DATA is in the labels.
This "info metric" pattern is worth knowing because it lets
you join a deployment fact onto a performance graph:

  # p99 latency, broken down by which app version served it
  histogram_quantile(0.99, sum by (le, version) (
    rate(http_request_duration_seconds_bucket[5m])
  ))

With the &#96;version&#96; label from collectDefaultMetrics above, a
deploy becomes visible ON the latency graph rather than being
something you correlate by squinting at timestamps. Chapter 11
uses this to answer "did the deploy cause it?" in one query.</code></pre>

<h3>What to ignore, and why it is there</h3>
<pre><code>nodejs_heap_space_size_*_bytes{space="new_space"|"old_space"|
  "code_space"|"map_space"|"large_object_space"|...}

That is 3 metrics × ~7 spaces = ~21 of your ~60 series, and
they are for debugging V8 itself. If you ever need them you
will be reading a V8 issue tracker, not a dashboard.

process_cpu_seconds_total
  Useful as a rate, but lesson 5.1 showed why it is the wrong
  saturation signal for Node. Keep it for context, do not
  alert on it.

process_start_time_seconds
  A constant. Its use is &#96;time() - process_start_time_seconds&#96;
  = uptime, which is genuinely valuable: a service whose
  uptime keeps resetting is crash-looping, and that is
  invisible in every other metric here.</code></pre>

<h3>The scrape itself, and its two failure modes</h3>
<pre><code class="language-yaml"># prometheus.yml
scrape_configs:
  - job_name: 'backend'
    scrape_interval: 15s
    scrape_timeout: 10s          # MUST be &lt; scrape_interval
    static_configs:
      - targets: ['backend:5000']</code></pre>
<pre><code>Failure 1: the scrape times out.
  Every metric goes stale simultaneously — including the
  ones that were fine. Watch &#96;up{job="backend"}&#96;, which
  Prometheus generates itself: 1 = scraped, 0 = failed.
  This is the metric that tells you your metrics are gone.

Failure 2: the scrape is expensive.
  collect() callbacks run at scrape time. Lesson 5.4's
  pool gauge does &#96;await prisma.$metrics.json()&#96; on EVERY
  scrape — every 15 seconds, forever. Keep collect()
  callbacks cheap and non-blocking, or you have built a
  monitoring system that degrades the thing it monitors.</code></pre>

<h3>Where this leaves you</h3>
<pre><code>After chapters 4 and 5 you have, for one line of setup plus
one middleware:

  · request rate, errors, and a latency histogram   (4.1)
  · event loop lag p99                              (5.1)
  · five memory numbers that mean different things  (5.2)
  · GC pause rate and duration                      (5.3)
  · pool waiting, handles, file descriptors         (5.4)
  · uptime and version, joinable onto any graph     (5.5)

That is enough to diagnose every failure shape in chapter 11
except one: WHERE inside a slow request the time went. For
that you need chapter 6.</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>collectDefaultMetrics</code> called twice throws, and the way people fix it makes the metrics wrong.</strong> Calling it a second time raises a duplicate-registration error, which happens easily: the module is imported by both the app and a test, or a hot-reloader re-evaluates it. The obvious fix — <code>register.clear()</code> before calling — compiles, runs, and silently resets <strong>every counter in the process to zero</strong>. Since <code>rate()</code> reads a decrease as a restart (lesson 4.1), your request-rate graph now has a gap and your error-rate alert has a blind spot, at a moment nothing else looks wrong. <strong>Guard the call instead of clearing the registry:</strong> put <code>collectDefaultMetrics</code> in a module that is imported exactly once from your entry point, and if you must be defensive, check <code>register.getSingleMetric('process_cpu_user_seconds_total')</code> and skip rather than clear.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://github.com/siimon/prom-client#default-metrics" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">prom-client — default metrics</span><span class="lc-sub">The full list of what one line collects, the options it takes, and the registry semantics behind the pitfall above.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Prometheus — scrape configuration</span><span class="lc-sub">scrape_interval versus scrape_timeout, staleness handling, and the automatically generated &#96;up&#96; metric.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Bật hết lên, và mỗi con số nghĩa là gì</h2>
<p class="lead">Một dòng prom-client cho bạn khoảng sáu mươi chỉ số của Node. Đó vừa là chiến thắng dễ nhất trong khoá này vừa là một phiên bản thu nhỏ của vấn đề ở bài 4.5: sáu mươi con số không ai diễn giải nổi thì không hơn được năm con số người ta hiểu. Bài này bật chúng lên rồi nói xem thật ra nên nhìn cái nào.</p>

<h3>Cái một dòng</h3>
<pre><code class="language-typescript">// src/metrics.ts
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics({
  // Ô chọn cho đúng dải thời gian dừng GC đo ở bài 5.3
  gcDurationBuckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25],
  // Một cái nhãn cho mọi chỉ số, để phân biệt được các thực thể
  labels: { service: 'backend', version: process.env.APP_VERSION ?? 'dev' },
});</code></pre>
<pre><code>Nó cho bạn những gì, theo họ:

  process_*            9 chỉ số    CPU, RSS, fd, thời điểm khởi động
  nodejs_heap_*        7 chỉ số    các con số ở bài 5.2
  nodejs_gc_*          1 histogram bài 5.3
  nodejs_eventloop_*   2 chỉ số    độ trễ trung bình và max — KHÔNG p99
  nodejs_active_*      2 chỉ số    handle và request, bài 5.4
  nodejs_version_info  1 chỉ số    một gauge có GIÁ TRỊ là 1 và có NHÃN
                                   mang phiên bản
  ...cộng phần chia nhỏ theo từng vùng heap, chiếm phần lớn con số</code></pre>

<h3>Bảy cái đáng để lên bảng theo dõi</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · <code>nodejs_eventloop_lag_p99_seconds</code></span><span class="lz-lnote">Chỉ số bão hoà của bài 5.1. ⚠️ Cái <code>nodejs_eventloop_lag_seconds</code> mặc định là một số TRUNG BÌNH — thứ mà bài 5.1 đo được là 1,1 ms ngay cả khi đang chặn 120 ms. Hãy dùng biến thể p99 hoặc cái gauge tự viết ở bài đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · <code>process_resident_memory_bytes</code></span><span class="lz-lnote">RSS. Hãy cảnh báo theo con số này chia cho hạn mức container, theo bài 5.2. Là con số bộ nhớ duy nhất có một hệ quả gắn kèm.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · <code>nodejs_heap_size_used_bytes</code></span><span class="lz-lnote">heapUsed. Hãy nhìn <em>đáy</em> của răng cưa qua nhiều giờ — đó mới là chữ ký của rò rỉ.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>nodejs_external_memory_bytes</code></span><span class="lz-lnote">Buffer và cấp phát native. Tăng lên khi sharp, FFmpeg hay một đường tải lên đang giữ dữ liệu. Là nửa còn lại của câu &quot;bộ nhớ đang leo&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · <code>nodejs_gc_duration_seconds{kind="major"}</code></span><span class="lz-lnote">Tần suất và p99. Hãy đọc nó như cái mũi tên trỏ về chỉ số 3, theo cái bẫy ở bài 5.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · <code>process_open_fds</code></span><span class="lz-lnote">File descriptor, đối chiếu với <code>process_max_fds</code>. Chạm trần thì sinh ra <code>EMFILE</code>, thứ nổi lên thành &quot;không kết nối được với bất cứ cái gì&quot; và trông y như một sự cố mạng.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · <code>nodejs_active_handles_total</code></span><span class="lz-lnote">Chỉ nhìn xu hướng, theo bài 5.4. Phình đơn điệu qua nhiều giờ nghĩa là có cái gì đó được mở ở mỗi request và không bao giờ được đóng.</span></div>
</div>

<h3>Cái trông vô dụng mà không vô dụng</h3>
<pre><code>nodejs_version_info{version="v22.22.2", major="22", ...}  1

Một gauge mà giá trị luôn là 1. DỮ LIỆU nằm trong các nhãn.
Cái mẫu "chỉ số thông tin" này đáng biết vì nó cho phép bạn ghép
một sự kiện triển khai vào một đồ thị hiệu năng:

  # độ trễ p99, chia theo phiên bản app nào đã phục vụ
  histogram_quantile(0.99, sum by (le, version) (
    rate(http_request_duration_seconds_bucket[5m])
  ))

Với cái nhãn &#96;version&#96; từ collectDefaultMetrics ở trên, một lần
deploy trở nên nhìn thấy được NGAY TRÊN đồ thị độ trễ thay vì là
thứ bạn phải nheo mắt đối chiếu dấu thời gian. Chương 11 dùng cái
này để trả lời "có phải lần deploy gây ra không?" trong một truy vấn.</code></pre>

<h3>Bỏ qua cái gì, và vì sao nó có mặt ở đó</h3>
<pre><code>nodejs_heap_space_size_*_bytes{space="new_space"|"old_space"|
  "code_space"|"map_space"|"large_object_space"|...}

Đó là 3 chỉ số × ~7 vùng = ~21 trong khoảng 60 chuỗi của bạn, và
chúng dành cho việc gỡ lỗi chính V8. Nếu có lúc nào bạn cần tới
chúng thì lúc ấy bạn đang đọc trình theo dõi lỗi của V8, chứ
không phải một bảng theo dõi.

process_cpu_seconds_total
  Hữu ích dưới dạng rate, nhưng bài 5.1 đã cho thấy vì sao nó là
  tín hiệu bão hoà sai với Node. Hãy giữ nó làm ngữ cảnh, đừng
  cảnh báo theo nó.

process_start_time_seconds
  Một hằng số. Công dụng của nó là &#96;time() - process_start_time_seconds&#96;
  = thời gian chạy, thứ thật sự giá trị: một dịch vụ mà thời gian
  chạy cứ về không là đang lặp vòng sập, và điều đó vô hình trong
  mọi chỉ số khác ở đây.</code></pre>

<h3>Bản thân lượt quét, và hai kiểu hỏng của nó</h3>
<pre><code class="language-yaml"># prometheus.yml
scrape_configs:
  - job_name: 'backend'
    scrape_interval: 15s
    scrape_timeout: 10s          # PHẢI nhỏ hơn scrape_interval
    static_configs:
      - targets: ['backend:5000']</code></pre>
<pre><code>Hỏng kiểu 1: lượt quét hết giờ.
  Mọi chỉ số cùng lúc trở nên cũ — kể cả những cái vốn vẫn ổn.
  Hãy theo dõi &#96;up{job="backend"}&#96;, thứ Prometheus tự sinh ra:
  1 = quét được, 0 = hỏng. Đây là chỉ số nói cho bạn biết rằng
  các chỉ số của bạn đã biến mất.

Hỏng kiểu 2: lượt quét đắt.
  Các callback collect() chạy vào lúc bị quét. Cái gauge bể ở bài
  5.4 gọi &#96;await prisma.$metrics.json()&#96; ở MỌI lượt quét — mười
  lăm giây một lần, mãi mãi. Hãy giữ cho các callback collect()
  rẻ và không chặn, không thì bạn vừa dựng ra một hệ thống theo
  dõi làm xuống cấp chính cái thứ nó theo dõi.</code></pre>

<h3>Chuyện này để bạn ở đâu</h3>
<pre><code>Sau chương 4 và 5, đổi lấy một dòng thiết lập cộng một
middleware, bạn có:

  · tốc độ request, lỗi, và một histogram độ trễ    (4.1)
  · p99 độ trễ vòng lặp sự kiện                     (5.1)
  · năm con số bộ nhớ mang những nghĩa khác nhau    (5.2)
  · tần suất và thời lượng dừng vì GC               (5.3)
  · thời gian chờ bể, handle, file descriptor       (5.4)
  · thời gian chạy và phiên bản, ghép được vào mọi
    đồ thị                                          (5.5)

Chừng đó đủ để chẩn đoán mọi hình dạng hỏng hóc ở chương 11 trừ
một cái: thời gian đi đâu Ở CHỖ NÀO bên trong một request chậm.
Cho cái đó thì bạn cần chương 6.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — gọi <code>collectDefaultMetrics</code> hai lần thì nó ném lỗi, và cách người ta chữa lỗi đó làm cho các chỉ số bị sai.</strong> Gọi nó lần thứ hai sinh ra lỗi đăng ký trùng, chuyện đó xảy ra rất dễ: module bị import bởi cả app lẫn một bài kiểm thử, hoặc một trình nạp nóng đánh giá lại nó. Cách chữa hiển nhiên — gọi <code>register.clear()</code> trước — thì biên dịch được, chạy được, và âm thầm đưa <strong>mọi counter trong tiến trình về không</strong>. Vì <code>rate()</code> đọc một phép giảm thành một lần khởi động lại (bài 4.1), đồ thị tốc độ request của bạn giờ có một lỗ hổng và cảnh báo tỉ lệ lỗi của bạn có một điểm mù, vào đúng cái lúc mà chẳng có gì khác trông có vẻ sai. <strong>Hãy CHẶN lời gọi thay vì xoá sổ đăng ký:</strong> đặt <code>collectDefaultMetrics</code> vào một module được import đúng một lần từ điểm vào của bạn, và nếu buộc phải phòng thủ thì hãy kiểm <code>register.getSingleMetric('process_cpu_user_seconds_total')</code> rồi bỏ qua chứ đừng xoá.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://github.com/siimon/prom-client#default-metrics" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">prom-client — chỉ số mặc định</span><span class="lc-sub">Danh sách đầy đủ những gì một dòng thu về, các tuỳ chọn nó nhận, và ngữ nghĩa của sổ đăng ký nằm sau cái bẫy ở trên.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Prometheus — cấu hình lượt quét</span><span class="lc-sub">scrape_interval so với scrape_timeout, cách xử lý dữ liệu cũ, và cái chỉ số &#96;up&#96; được sinh ra tự động.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'obs-5-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về độ trễ vòng lặp, RSS so với heap, GC, bể kết nối và chỉ số mặc định.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 5 · Quiz</span><h2>Six questions on Node internals</h2><p class="lead">Every one of these has a measured number behind it. Three of them describe a graph whose obvious reading is the wrong one.</p></div><div class="ml-vi"><span class="eyebrow">Chương 5 · Kiểm tra</span><h2>Sáu câu về bên trong Node</h2><p class="lead">Mỗi câu ở đây đều có một con số đã đo đứng sau. Ba câu mô tả một đồ thị mà cách đọc hiển nhiên lại là cách đọc sai.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'A Node process blocks 200 ms per turn on a 4-core VPS. What does machine CPU show, and why is that the wrong metric?|||Một tiến trình Node chặn 200 ms mỗi vòng trên một VPS 4 nhân. CPU toàn máy hiện ra bao nhiêu, và vì sao đó là chỉ số sai?',
            options: [
              '23.8% — measured — because JavaScript runs on one thread and one saturated core out of four reads as a quarter. CPU% also cannot distinguish 50 ms of blocking from 200 ms (91% vs 95%), while event-loop lag p99 tracks the stall exactly at 51 ms and 201 ms.|||23,8% — đo thật — vì JavaScript chạy trên một luồng và một nhân bão hoà trong bốn nhân đọc ra là một phần tư. CPU% cũng không phân biệt nổi chặn 50 ms với 200 ms (91% so với 95%), trong khi p99 độ trễ vòng lặp bám sát cú đơ chính xác ở 51 ms và 201 ms.',
              '100%, since the process is fully busy|||100%, vì tiến trình đang bận hoàn toàn',
              '0%, since blocking is not counted as CPU work|||0%, vì việc chặn không được tính là công việc CPU',
              '50%, since Node uses two threads by default|||50%, vì Node mặc định dùng hai luồng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is alerting on MEAN event loop lag nearly useless?|||Vì sao cảnh báo theo độ trễ vòng lặp TRUNG BÌNH gần như vô dụng?',
            options: [
              'Because a block is by definition occasional, so most turns are fine: the measurement showed p50 stayed at 1.1 ms in every case, including the run blocking for 120 ms, while p99 read 120.7 ms. prom-client\'s default nodejs_eventloop_lag_seconds is exactly this mean.|||Vì một cú chặn theo định nghĩa là thỉnh thoảng, nên phần lớn các vòng vẫn ổn: phép đo cho thấy p50 giữ nguyên 1,1 ms ở MỌI trường hợp, kể cả lượt chặn 120 ms, trong khi p99 đọc ra 120,7 ms. Cái nodejs_eventloop_lag_seconds mặc định của prom-client chính là con số trung bình đó.',
              'Because the mean is computed only once at process start|||Vì trung bình chỉ được tính một lần lúc tiến trình khởi động',
              'Because lag is measured in nanoseconds, which round badly|||Vì độ trễ đo bằng nano giây nên làm tròn kém',
              'Because mean lag is always zero on a healthy service|||Vì độ trễ trung bình luôn bằng không trên một dịch vụ khoẻ mạnh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'heapUsed went 4 → 75 → 4 MB across a GC, but rss went 43 → 150 → 140 MB. Is that a leak?|||heapUsed đi 4 → 75 → 4 MB qua một lần GC, nhưng rss đi 43 → 150 → 140 MB. Đó có phải rò rỉ không?',
            options: [
              'No. V8 does not return freed pages to the OS, so rss is a high-water mark and an rss graph that rises and never falls is the normal, healthy shape. The leak signature is the BOTTOM of the heapUsed sawtooth rising over hours.|||Không. V8 không trả các trang đã giải phóng lại cho hệ điều hành, nên rss là một mốc nước cao nhất và một đồ thị rss chỉ leo mà không tụt là hình dạng BÌNH THƯỜNG, khoẻ mạnh. Chữ ký của rò rỉ là ĐÁY của răng cưa heapUsed dâng lên qua nhiều giờ.',
              'Yes — rss not returning to 43 MB means 97 MB leaked|||Có — rss không về lại 43 MB nghĩa là đã rò rỉ 97 MB',
              'Yes, but only if heapTotal also stayed elevated|||Có, nhưng chỉ khi heapTotal cũng ở mức cao',
              'Cannot tell without also knowing external|||Không nói được nếu chưa biết cả external',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Allocating 200 MB of Buffers moved rss by 3 MB; writing to them moved it by 200 MB. What does that tell you?|||Cấp phát 200 MB Buffer làm rss nhích 3 MB; ghi vào chúng làm nó nhích 200 MB. Điều đó nói gì?',
            options: [
              'external reports what you asked for; rss reports what is actually resident, because allocUnsafe reserves address space and pages only become resident when touched. The OOM killer counts rss, so external can look alarming while nothing is at risk — and rss can jump 200 MB with no allocation at all.|||external báo cái bạn ĐÃ XIN; rss báo cái thật sự đang nằm trong RAM, vì allocUnsafe đặt trước không gian địa chỉ và các trang chỉ vào RAM khi bị chạm tới. OOM killer đếm rss, nên external có thể trông đáng báo động trong khi chẳng có gì rủi ro — và rss có thể nhảy 200 MB mà không hề có cấp phát nào.',
              'Buffers are compressed until written to|||Buffer được nén cho tới khi bị ghi vào',
              'The garbage collector freed the buffers between the two reads|||Bộ thu gom rác đã giải phóng các buffer giữa hai lần đọc',
              'rss does not include off-heap memory at all|||rss hoàn toàn không tính bộ nhớ ngoài heap',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Major GC time is rising steadily. What is the right response?|||Thời gian major GC đang tăng đều. Phản ứng đúng là gì?',
            options: [
              'Go find what is being retained, because GC cost scales with SURVIVORS, not with garbage — so rising major-GC time almost always means the live set is growing. Raising --max-old-space-size is specifically harmful: it delays the OOM kill while making each major GC walk a larger heap.|||Đi tìm xem cái gì đang bị GIỮ LẠI, vì chi phí GC tỉ lệ với KẺ SỐNG SÓT chứ không tỉ lệ với rác — nên thời gian major GC tăng gần như luôn nghĩa là phần sống đang phình. Nâng --max-old-space-size là có hại một cách cụ thể: nó trì hoãn cú OOM giết trong khi làm mỗi lần major GC phải đi qua một cái heap lớn hơn.',
              'Raise --max-old-space-size so V8 collects less often|||Nâng --max-old-space-size để V8 thu gom thưa hơn',
              'Call global.gc() periodically to spread the cost|||Gọi global.gc() định kỳ để dàn đều chi phí',
              'Reduce allocation, since GC cost scales with objects created|||Giảm cấp phát, vì chi phí GC tỉ lệ với số object được tạo ra',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Latency is high, the event loop is idle, CPU is low, and Postgres is nearly idle too. What is happening?|||Độ trễ cao, vòng lặp sự kiện nhàn rỗi, CPU thấp, và Postgres cũng gần như rảnh rang. Chuyện gì đang xảy ra?',
            options: [
              'Requests are queueing for a free connection. This repo never sets connection_limit, so Prisma\'s default is num_cpus × 2 + 1 = 9 on a 4-core VPS, while Postgres allows 100 — max_connections appears in docker-compose.yml only inside a comment. The db_pool "waiting" gauge is the only metric that distinguishes this from a slow database.|||Các request đang xếp hàng chờ một kết nối rảnh. Kho này chưa từng đặt connection_limit, nên mặc định của Prisma là num_cpus × 2 + 1 = 9 trên một VPS 4 nhân, trong khi Postgres cho phép 100 — max_connections chỉ xuất hiện trong docker-compose.yml bên trong một dòng chú thích. Cái gauge "waiting" của bể là chỉ số duy nhất phân biệt được chuyện này với một cơ sở dữ liệu chậm.',
              'The database is slow and needs an index|||Cơ sở dữ liệu chậm và cần thêm chỉ mục',
              'A garbage collection pause is blocking every request|||Một lần dừng thu gom rác đang chặn mọi request',
              'The network between the containers has failed|||Mạng giữa các container đã hỏng',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
