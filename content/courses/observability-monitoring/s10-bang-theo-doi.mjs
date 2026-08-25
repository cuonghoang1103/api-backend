/**
 * Observability — Chương 10 — Bảng theo dõi người ta thật sự đọc.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 10 — Dashboards people actually read|||Chương 10 — Bảng theo dõi người ta thật sự đọc',
  slug: 'obs-ch10-bang',
  description: 'Bảng dành cho ai, ba cái bảng là đủ, đồ thị nói dối, từ bảng tới nguyên nhân trong ba cú bấm.',
  sortOrder: 11,
  lessons: [
    {
      title: '10.1 — Who is this dashboard for?|||10.1 — Cái bảng này dành cho ai?',
      slug: 'obs-10-1-danh-cho-ai',
      type: 'VIDEO',
      description: 'Ba khán giả, ba câu hỏi, ba cái bảng. Gộp chúng lại là cách bạn có một cái bảng không ai đọc.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Who is this dashboard for?</h2>
<p class="lead">Chapters 4 and 5 produced about sixty metrics. Chapter 9 established that almost none of them should page you. So they go on a dashboard — and this is where most observability work quietly dies, because a dashboard with sixty panels is a dashboard nobody opens.</p>

<h3>The failure, and why it is so consistent</h3>
<pre><code>A dashboard accumulates. Nobody ever deletes a panel.

  Month 1: 6 panels. Everyone can read it.
  Month 3: 19 panels, after two incidents each added
           "the graph that would have helped".
  Month 6: 40 panels across three screens. You scroll
           past most of them to reach the two you use.
  Month 9: nobody opens it. During the next incident
           someone runs a raw PromQL query instead,
           because that is faster than finding the panel.

Nothing was done wrong. Each panel was added by a person
solving a real problem. The dashboard died of correct
decisions, one at a time.

The fix is not discipline. It is that a dashboard must
have ONE AUDIENCE and ONE QUESTION, and panels that do
not serve that question belong on a different dashboard —
or nowhere.</code></pre>

<h3>Three audiences, three questions</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">The 3am you</span><span class="lz-t">&quot;Is it broken, and how badly?&quot;</span><span class="lz-d">Read in ten seconds, on a phone, half awake. Four panels maximum. Colour matters more than precision — this is the only dashboard where a red number is better than an exact number.</span></div>
  <div class="lz-node"><span class="lz-k">The investigating you</span><span class="lz-t">&quot;Where is the problem?&quot;</span><span class="lz-d">Read for ten minutes, on a laptop, during an incident. Twelve to fifteen panels, arranged so the eye moves from symptom to subsystem. This is the working dashboard.</span></div>
  <div class="lz-node"><span class="lz-k">The planning you</span><span class="lz-t">&quot;What is changing over weeks?&quot;</span><span class="lz-d">Read for ten minutes, once a month, over coffee. Long time ranges, trends, budgets. Nothing here needs to be fast, and nothing here should ever be looked at during an incident.</span></div>
</div>
<pre><code>The test that separates them: what TIME RANGE is it read at?

  3am dashboard        last 1 hour
  investigation        last 6 hours
  planning             last 30 days

A panel that is useful at all three ranges is rare. A
dashboard that tries to serve all three ranges shows a
30-day view during an incident, where a 4-second spike is
one pixel wide and invisible.</code></pre>

<h3>The 3am dashboard, in full</h3>
<pre><code>┌────────────────────┬────────────────────┐
│  IS IT UP?         │  ERROR RATE        │
│                    │                    │
│      ● OK          │      0.4%          │
│  (external check,  │  (last 5 min,      │
│   2 locations)     │   big number)      │
├────────────────────┼────────────────────┤
│  p99 LATENCY       │  BUDGET REMAINING  │
│                    │                    │
│     210 ms         │   38 / 43 min      │
│  (last 5 min)      │  (30-day window)   │
└────────────────────┴────────────────────┘

Four panels. No graphs — big numbers with colour
thresholds. It answers exactly one question: do I need
to get out of bed?

Why no graphs: at 3am on a phone, a sparkline conveys
less than a number and a colour. Save the graphs for
the moment you have decided to actually investigate.</code></pre>

<h3>The investigation dashboard, laid out to be read in order</h3>
<pre><code>ROW 1 — SYMPTOMS (what the user experiences)
  request rate │ error rate by code │ p50/p95/p99 latency

ROW 2 — THIS PROCESS (chapter 5)
  event loop lag p99 │ RSS vs limit │ GC major rate

ROW 3 — DEPENDENCIES (what it waits on)
  db pool: busy/idle/WAITING │ db query p99 │ outbound by host

ROW 4 — CONTEXT (what changed)
  deploys (version annotations) │ restarts (uptime) │ log error rate

The order is the diagnostic order, and that is the point:
you read top to bottom and each row narrows the previous one.

  Row 1 says WHETHER something is wrong.
  Row 2 says whether it is THIS PROCESS.
  Row 3 says whether it is something it WAITS ON.
  Row 4 says whether YOU caused it.

Fifteen panels, one screen, no scrolling. If it does not
fit on one screen, the dashboard is answering more than
one question.</code></pre>

<h3>Every panel earns its place by answering one question</h3>
<pre><code class="language-text">Before adding a panel, write the sentence:

  "I am adding &lt;panel&gt; so that when &lt;situation&gt; happens,
   I can tell &lt;A&gt; apart from &lt;B&gt;."

  ✅ "I am adding db_pool_waiting so that when latency is
      high, I can tell pool exhaustion apart from a slow
      database." (lesson 5.4 — these are indistinguishable
      without it)

  ✅ "I am adding the deploy annotation so that when
      anything changes shape, I can tell a deploy apart
      from an external cause."

  ❌ "I am adding heap_space_size_used_bytes because it
      is available."
     → No situation, no distinction. This is one of the
       ~21 series lesson 5.5 said to ignore.

If you cannot write the sentence, the panel is decoration.
Decoration is not free: it costs a slot in the reader's
attention during the ten seconds when attention is scarcest.</code></pre>

<div class="pitfall">
<p><strong>Trap — the panel added after an incident is usually the one that would have told you nothing.</strong> The reflex after a bad night is &quot;we need a graph for that&quot;, and the graph that gets built shows the thing you eventually found — the memory number, the specific queue depth — rather than the thing that would have led you there. So the dashboard grows a panel that only makes sense to someone who already knows the answer, and during the <em>next</em> incident, which is different, it is one more thing to scroll past. <strong>The honest question in a review is not &quot;what graph do we want&quot; but &quot;at which minute did we go down the wrong path, and what would have redirected us <em>then</em>?&quot;</strong> That question usually produces a panel already on the dashboard, unread — which means the fix is layout or removal, not addition.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Grafana — dashboard best practices</span><span class="lc-sub">Grafana's own guidance on audience, panel count and layout, including the argument for separate dashboards per question.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/workbook/monitoring/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Google SRE Workbook — monitoring</span><span class="lc-sub">The symptom-then-cause ordering the investigation dashboard uses, and why dashboards should be built around questions rather than data sources.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cái bảng này dành cho ai?</h2>
<p class="lead">Chương 4 và 5 tạo ra khoảng sáu mươi chỉ số. Chương 9 xác lập rằng gần như không cái nào trong số đó nên gọi bạn dậy. Vậy chúng lên bảng theo dõi — và đây chính là chỗ phần lớn công sức quan sát lặng lẽ chết đi, vì một cái bảng có sáu mươi ô là một cái bảng không ai mở.</p>

<h3>Cú hỏng, và vì sao nó nhất quán tới thế</h3>
<pre><code>Một cái bảng theo dõi TÍCH TỤ. Chẳng ai bao giờ xoá một cái ô.

  Tháng 1: 6 ô. Ai cũng đọc được.
  Tháng 3: 19 ô, sau hai lần sự cố mà mỗi lần lại thêm
           "cái đồ thị lẽ ra đã giúp được".
  Tháng 6: 40 ô trải trên ba màn hình. Bạn cuộn qua phần lớn
           chúng để tới hai cái bạn dùng.
  Tháng 9: chẳng ai mở nó. Trong lần sự cố kế tiếp có người gõ
           thẳng một câu PromQL thô, vì thế nhanh hơn là đi tìm
           cái ô.

Chẳng có gì làm sai cả. Mỗi cái ô đều do một con người thêm vào
để giải một vấn đề có thật. Cái bảng chết vì những quyết định
ĐÚNG ĐẮN, từng cái một.

Cách chữa không phải kỷ luật. Nó là: một cái bảng phải có MỘT
KHÁN GIẢ và MỘT CÂU HỎI, và những ô không phục vụ câu hỏi ấy thì
thuộc về một cái bảng khác — hoặc chẳng thuộc về đâu cả.</code></pre>

<h3>Ba khán giả, ba câu hỏi</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Bạn-lúc-3-giờ-sáng</span><span class="lz-t">&quot;Nó có hỏng không, và hỏng nặng tới đâu?&quot;</span><span class="lz-d">Đọc trong mười giây, trên một cái điện thoại, nửa tỉnh nửa mê. Tối đa bốn ô. Màu sắc quan trọng hơn độ chính xác — đây là cái bảng duy nhất mà một con số MÀU ĐỎ tốt hơn một con số chính xác.</span></div>
  <div class="lz-node"><span class="lz-k">Bạn-đang-điều-tra</span><span class="lz-t">&quot;Vấn đề nằm ở đâu?&quot;</span><span class="lz-d">Đọc trong mười phút, trên một cái laptop, giữa lúc sự cố. Mười hai tới mười lăm ô, sắp xếp sao cho mắt đi từ triệu chứng tới hệ thống con. Đây là cái bảng LÀM VIỆC.</span></div>
  <div class="lz-node"><span class="lz-k">Bạn-đang-hoạch-định</span><span class="lz-t">&quot;Cái gì đang đổi qua nhiều tuần?&quot;</span><span class="lz-d">Đọc trong mười phút, mỗi tháng một lần, bên tách cà phê. Khoảng thời gian dài, xu hướng, ngân sách. Không có gì ở đây cần nhanh, và không có gì ở đây được phép nhìn tới trong lúc sự cố.</span></div>
</div>
<pre><code>Phép thử tách chúng ra: nó được đọc ở KHOẢNG THỜI GIAN nào?

  bảng 3 giờ sáng     1 giờ gần nhất
  bảng điều tra       6 giờ gần nhất
  bảng hoạch định     30 ngày gần nhất

Một cái ô hữu ích ở cả ba khoảng là chuyện hiếm. Một cái bảng cố
phục vụ cả ba khoảng sẽ hiển thị tầm nhìn 30 ngày giữa lúc sự cố,
nơi một cái gai 4 giây rộng một điểm ảnh và vô hình.</code></pre>

<h3>Trọn cái bảng 3 giờ sáng</h3>
<pre><code>┌────────────────────┬────────────────────┐
│  CÓ SỐNG KHÔNG?    │  TỈ LỆ LỖI         │
│                    │                    │
│      ● OK          │      0,4%          │
│  (kiểm bên ngoài,  │  (5 phút gần nhất, │
│   2 vị trí)        │   số to)           │
├────────────────────┼────────────────────┤
│  ĐỘ TRỄ p99        │  NGÂN SÁCH CÒN LẠI │
│                    │                    │
│     210 ms         │   38 / 43 phút     │
│  (5 phút gần nhất) │  (cửa sổ 30 ngày)  │
└────────────────────┴────────────────────┘

Bốn ô. Không đồ thị — số to kèm ngưỡng màu. Nó trả lời đúng
MỘT câu hỏi: tôi có cần ra khỏi giường không?

Vì sao không đồ thị: lúc 3 giờ sáng trên một cái điện thoại, một
đường sparkline truyền đạt ít hơn một con số kèm một màu. Hãy để
dành đồ thị cho cái khoảnh khắc bạn đã quyết định là sẽ thật sự
đi điều tra.</code></pre>

<h3>Bảng điều tra, bố trí để đọc theo thứ tự</h3>
<pre><code>HÀNG 1 — TRIỆU CHỨNG (thứ người dùng trải nghiệm)
  tốc độ request │ tỉ lệ lỗi theo mã │ độ trễ p50/p95/p99

HÀNG 2 — TIẾN TRÌNH NÀY (chương 5)
  p99 trễ vòng lặp │ RSS so với hạn mức │ tần suất major GC

HÀNG 3 — PHỤ THUỘC (thứ nó chờ)
  bể db: bận/rảnh/ĐANG CHỜ │ p99 truy vấn db │ gọi ra ngoài theo host

HÀNG 4 — NGỮ CẢNH (cái gì đã đổi)
  các lần deploy (chú thích phiên bản) │ khởi động lại (uptime) │ tỉ lệ lỗi trong log

Thứ tự ấy chính là thứ tự chẩn đoán, và đó là mấu chốt: bạn đọc
từ trên xuống và mỗi hàng thu hẹp hàng trước nó lại.

  Hàng 1 nói CÓ hay không có gì sai.
  Hàng 2 nói có phải TIẾN TRÌNH NÀY không.
  Hàng 3 nói có phải thứ nó ĐANG CHỜ không.
  Hàng 4 nói có phải CHÍNH BẠN gây ra không.

Mười lăm ô, một màn hình, không cuộn. Nếu nó không vừa một màn
hình thì cái bảng đang trả lời nhiều hơn một câu hỏi.</code></pre>

<h3>Mỗi cái ô phải kiếm được chỗ đứng bằng cách trả lời một câu hỏi</h3>
<pre><code class="language-text">Trước khi thêm một cái ô, hãy viết ra câu này:

  "Tôi thêm &lt;ô&gt; để khi &lt;tình huống&gt; xảy ra, tôi phân biệt
   được &lt;A&gt; với &lt;B&gt;."

  ✅ "Tôi thêm db_pool_waiting để khi độ trễ cao, tôi phân biệt
      được cạn bể kết nối với một cơ sở dữ liệu chậm." (bài 5.4 —
      không có nó thì hai cái đó không phân biệt được)

  ✅ "Tôi thêm chú thích deploy để khi bất cứ thứ gì đổi hình
      dạng, tôi phân biệt được một lần deploy với một nguyên nhân
      bên ngoài."

  ❌ "Tôi thêm heap_space_size_used_bytes vì nó có sẵn."
     → Không tình huống, không phân biệt gì. Đây là một trong
       ~21 chuỗi mà bài 5.5 bảo hãy lờ đi.

Nếu bạn không viết được cái câu ấy thì cái ô đó là đồ trang trí.
Trang trí không miễn phí: nó chiếm một chỗ trong sự chú ý của
người đọc, đúng vào mười giây mà sự chú ý khan hiếm nhất.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cái ô được thêm vào sau một sự cố thường lại là cái lẽ ra chẳng nói cho bạn điều gì.</strong> Phản xạ sau một đêm tồi tệ là &quot;chúng ta cần một đồ thị cho cái đó&quot;, và cái đồ thị được dựng lên lại hiển thị THỨ BẠN RỐT CUỘC ĐÃ TÌM RA — con số bộ nhớ, cái độ sâu hàng đợi cụ thể — chứ không hiển thị thứ lẽ ra đã dẫn bạn tới đó. Nên cái bảng mọc ra một ô chỉ có nghĩa với người đã biết sẵn câu trả lời, và trong lần sự cố <em>KẾ TIẾP</em>, vốn khác đi, nó là thêm một thứ nữa để cuộn qua. <strong>Câu hỏi trung thực trong một buổi rà soát không phải &quot;chúng ta muốn đồ thị nào&quot; mà là &quot;ở phút thứ mấy chúng ta đi nhầm đường, và cái gì lẽ ra đã bẻ lái chúng ta <em>LÚC ĐÓ</em>?&quot;</strong> Câu hỏi ấy thường cho ra một cái ô vốn đã có sẵn trên bảng, chưa ai đọc — nghĩa là cách chữa là bố trí lại hoặc gỡ bỏ, không phải thêm vào.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Grafana — thông lệ tốt cho bảng theo dõi</span><span class="lc-sub">Hướng dẫn của chính Grafana về khán giả, số lượng ô và cách bố trí, kèm lý lẽ cho việc tách bảng theo từng câu hỏi.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/workbook/monitoring/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Sách bài tập SRE của Google — theo dõi</span><span class="lc-sub">Thứ tự triệu-chứng-rồi-nguyên-nhân mà bảng điều tra dùng, và vì sao bảng theo dõi nên dựng quanh câu hỏi chứ không quanh nguồn dữ liệu.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '10.2 — Charts that lie|||10.2 — Những đồ thị nói dối',
      slug: 'obs-10-2-do-thi-noi-doi',
      type: 'VIDEO',
      description: 'Sáu cách một đồ thị đúng dữ liệu vẫn dẫn bạn tới kết luận sai, và cách sửa từng cái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Charts that lie</h2>
<p class="lead">Every chart in this lesson is drawn from correct data by correctly-written software. That is what makes them dangerous: there is no bug to find, and the wrong conclusion feels like a discovery.</p>

<h3>Lie 1 — the truncated y-axis</h3>
<pre><code>Grafana auto-scales the y-axis to fit the data. So:

  Y AXIS 0.40 → 0.44        Y AXIS 0 → 100
  ┌──────────────┐          ┌──────────────┐
  │        ╱╲    │          │              │
  │    ╱╲╱   ╲   │          │              │
  │  ╱        ╲  │          │──────────────│  ← the same data
  └──────────────┘          └──────────────┘
   "ERROR RATE SPIKING"      "error rate: flat, 0.4%"

Same series. The first chart makes a 0.04-point wiggle
fill the panel, because that is all the variation there is.

Fix: set an explicit min of 0 for anything you reason
about as a magnitude — error rates, percentages, counts.
Auto-scale is correct for things you reason about as a
SHAPE, like latency during an incident.</code></pre>

<h3>Lie 2 — the time range doing the percentile averaging</h3>
<pre><code>This is lesson 4.2's pitfall, appearing as a UI behaviour:

  Zoom to 1 hour  → p99 shows a 4-second spike
  Zoom to 7 days  → the same spike shows as 400ms

Nothing changed except how many raw points had to be
squeezed into one pixel. If the panel averages p99 values
to fit, a bad hour inside a calm week disappears.

Fix, and it is mechanical:
  histogram_quantile(0.99, sum by (le) (
    rate(http_request_duration_seconds_bucket[$__rate_interval])))

$__rate_interval scales the aggregation window with the
zoom level, so the buckets are summed over the wider range
and the quantile is computed LAST — which is the only order
that gives the true p99 at every zoom.</code></pre>

<h3>Lie 3 — the counter drawn raw</h3>
<pre><code>http_requests_total plotted directly:

  ╱╱╱╱╱╱╱╱╱╱╱  ← always rising, always. Beautiful, useless.
  
It only ever goes up (lesson 4.1), so the graph shows the
same monotonic line whether traffic doubled or halved. The
SLOPE is the information, and your eye is bad at slopes.

  ❌ http_requests_total
  ✅ rate(http_requests_total[5m])

The tell: any graph that never comes back down is a counter
someone forgot to wrap in rate().</code></pre>

<h3>Lie 4 — the missing denominator</h3>
<pre><code>  "Errors: 47/min"  ← is that bad?

  At 5,000 req/min   → 0.94%. A normal Tuesday.
  At    60 req/min   → 78%.   The site is on fire.

The same number, two opposite conclusions, and the panel
does not tell you which. This is lesson 9.2's percentage
trap in visual form.

Fix: never show an error count without the request rate
in the SAME panel, or show the ratio directly. A panel
that requires the reader to remember another panel is a
panel that will be misread under pressure.</code></pre>

<h3>Lie 5 — the gap that means the opposite of what it looks like</h3>
<pre><code>  request rate
  ────────╲          ╱────────
           ╲        ╱
            (nothing)
            
A gap looks like "traffic stopped". It is much more often
"we stopped receiving data":

  · Prometheus scrape timed out (lesson 5.5) — the target
    was too slow to answer, so EVERY metric has a gap,
    including the ones that were fine.
  · The container restarted and the new one had not been
    scraped yet.
  · Prometheus itself was down.

Distinguishing them takes one panel: up{job="backend"}.
  up = 0 → we could not scrape. The gap is OURS.
  up = 1 with a flat zero → traffic really stopped.

Put &#96;up&#96; on the investigation dashboard. It is the panel
that tells you whether to trust the other fourteen.</code></pre>

<h3>Lie 6 — the average hiding inside a chart you did not choose</h3>
<pre><code>Grafana's default "Mean" legend calculation, and the
default single-line latency panel, are both averages —
which lesson 4.2 measured as describing nobody: mean
39.5ms against a p50 of 15.2 and a p99 of 989.

The subtle version: a legend that shows Mean while the
LINE shows p99. The line is honest and the number under
it is not, and people read the number.

Fix: set legend calculations to Max and Last, never Mean,
on any latency or error panel. If a single number must
appear, it should be the worst one in view — that is the
number a reader will act on.</code></pre>

<h3>The layout rules that prevent most of this</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Same units share an axis; different units never share a panel</span><span class="lz-d">A dual-axis chart with latency on the left and error rate on the right invites the eye to see a correlation between two arbitrary scalings. If they belong together, stack two panels with a shared time cursor instead.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Every panel has a threshold line where one exists</span><span class="lz-d">A latency graph with a line at your SLO turns &quot;is 800ms bad&quot; from a judgement into a look. Grafana draws these natively and almost nobody sets them.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Deploys are annotations, not a separate panel</span><span class="lz-d">A vertical line across every graph at each deploy answers &quot;did we cause it&quot; instantly, on every panel at once. This is lesson 5.5's version label doing its second job.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The panel title states the question, not the metric</span><span class="lz-d">&quot;Are requests queueing for a connection?&quot; beats &quot;db_pool_connections&quot;. The title is read by someone who does not remember what the metric means — which, six months later, is you.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — two lines on one chart create a causal story your eye believes before you have checked it.</strong> Put memory and latency on the same panel and any shared upward drift reads as &quot;memory pressure is causing slowness&quot;, because human vision is extremely good at finding correlation and has no mechanism at all for direction or lag. The failure is not that the chart is wrong — both series are accurate — it is that the chart <em>proposes a hypothesis and simultaneously appears to confirm it</em>, which is the one thing a diagnostic tool must never do. Under incident pressure that reading gets acted on, and an hour disappears into a memory investigation while the real cause sits on the next row. <strong>Correlation on a dashboard is a prompt to go and check, never a finding</strong> — and the check is the trace or the log, per lesson 6.4's pitfall.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/calculation-types/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Grafana — legend calculation types</span><span class="lc-sub">Mean, Max, Last and the rest — the setting behind lie 6, and why the default is the one to change first.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__rate_interval" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Grafana — $__rate_interval</span><span class="lc-sub">The variable that scales the aggregation window with the zoom level, which is the fix for lie 2.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Những đồ thị nói dối</h2>
<p class="lead">Mọi đồ thị trong bài này đều được vẽ từ dữ liệu ĐÚNG bởi phần mềm viết ĐÚNG. Đó chính là thứ làm chúng nguy hiểm: chẳng có lỗi nào để tìm cả, và cái kết luận sai thì có cảm giác như một khám phá.</p>

<h3>Nói dối 1 — trục y bị cắt cụt</h3>
<pre><code>Grafana tự co giãn trục y cho vừa dữ liệu. Nên:

  TRỤC Y 0,40 → 0,44        TRỤC Y 0 → 100
  ┌──────────────┐          ┌──────────────┐
  │        ╱╲    │          │              │
  │    ╱╲╱   ╲   │          │              │
  │  ╱        ╲  │          │──────────────│  ← cùng một dữ liệu
  └──────────────┘          └──────────────┘
   "TỈ LỆ LỖI ĐANG VỌT"      "tỉ lệ lỗi: phẳng, 0,4%"

Cùng một chuỗi. Đồ thị đầu làm cho một cái ngoe nguẩy 0,04 điểm
lấp đầy cả cái ô, vì đó là toàn bộ biến thiên đang có.

Cách chữa: đặt min tường minh bằng 0 cho bất cứ thứ gì bạn suy
luận như một ĐỘ LỚN — tỉ lệ lỗi, phần trăm, số đếm. Tự co giãn
thì đúng với những thứ bạn suy luận như một HÌNH DẠNG, ví dụ độ
trễ trong lúc sự cố.</code></pre>

<h3>Nói dối 2 — khoảng thời gian đang đi lấy trung bình các phân vị</h3>
<pre><code>Đây là cái bẫy ở bài 4.2, xuất hiện dưới dạng một hành vi giao diện:

  Thu về 1 giờ   → p99 hiện một cái gai 4 giây
  Thu về 7 ngày  → cùng cái gai đó hiện thành 400ms

Chẳng có gì đổi ngoài chuyện bao nhiêu điểm dữ liệu thô phải bị
nhét vào một điểm ảnh. Nếu cái ô lấy trung bình các giá trị p99
cho vừa, thì một giờ tồi tệ nằm trong một tuần êm ả sẽ biến mất.

Cách chữa, và nó máy móc:
  histogram_quantile(0.99, sum by (le) (
    rate(http_request_duration_seconds_bucket[$__rate_interval])))

$__rate_interval co giãn cửa sổ gộp theo mức thu phóng, nên các ô
được cộng trên khoảng rộng hơn và phân vị được tính SAU CÙNG —
đó là thứ tự duy nhất cho ra p99 thật ở mọi mức thu phóng.</code></pre>

<h3>Nói dối 3 — vẽ thẳng một cái counter</h3>
<pre><code>http_requests_total vẽ trực tiếp:

  ╱╱╱╱╱╱╱╱╱╱╱  ← luôn đi lên, luôn luôn. Đẹp, vô dụng.
  
Nó chỉ đi lên (bài 4.1), nên cái đồ thị hiện ra cùng một đường
đơn điệu bất kể lưu lượng tăng gấp đôi hay giảm một nửa. ĐỘ DỐC
mới là thông tin, mà mắt người thì rất tệ trong việc đọc độ dốc.

  ❌ http_requests_total
  ✅ rate(http_requests_total[5m])

Dấu hiệu nhận biết: bất cứ đồ thị nào không bao giờ đi xuống là
một cái counter mà ai đó quên bọc trong rate().</code></pre>

<h3>Nói dối 4 — thiếu mẫu số</h3>
<pre><code>  "Lỗi: 47/phút"  ← thế là tệ à?

  Ở 5.000 req/phút   → 0,94%. Một ngày thứ Ba bình thường.
  Ở    60 req/phút   → 78%.   Trang đang cháy.

Cùng một con số, hai kết luận ngược nhau, và cái ô không nói cho
bạn là cái nào. Đây là cái bẫy phần trăm ở bài 9.2 dưới dạng hình ảnh.

Cách chữa: đừng bao giờ hiện một số đếm lỗi mà không có tốc độ
request trong CÙNG một cái ô, hoặc hãy hiện thẳng cái tỉ lệ. Một
cái ô đòi người đọc phải nhớ một cái ô khác là một cái ô sẽ bị
đọc sai dưới áp lực.</code></pre>

<h3>Nói dối 5 — cái khoảng trống mang nghĩa ngược với vẻ ngoài của nó</h3>
<pre><code>  tốc độ request
  ────────╲          ╱────────
           ╲        ╱
          (không có gì)
            
Một khoảng trống trông như "lưu lượng đã dừng". Nó thường xuyên
là "chúng ta đã ngừng NHẬN ĐƯỢC dữ liệu" hơn nhiều:

  · Lượt quét của Prometheus hết giờ (bài 5.5) — mục tiêu chậm
    quá nên không trả lời kịp, thế là MỌI chỉ số đều có khoảng
    trống, kể cả những cái vốn vẫn ổn.
  · Container khởi động lại và cái mới chưa được quét.
  · Chính Prometheus chết.

Phân biệt chúng chỉ tốn một cái ô: up{job="backend"}.
  up = 0 → chúng ta không quét được. Cái khoảng trống là CỦA TA.
  up = 1 mà phẳng ở không → lưu lượng thật sự đã dừng.

Hãy để &#96;up&#96; lên bảng điều tra. Nó là cái ô nói cho bạn biết có
nên tin mười bốn cái kia hay không.</code></pre>

<h3>Nói dối 6 — cái trung bình nấp trong một đồ thị bạn không chọn</h3>
<pre><code>Phép tính chú giải "Mean" mặc định của Grafana, và cái ô độ trễ
một-đường mặc định, đều là TRUNG BÌNH — thứ mà bài 4.2 đo được là
mô tả KHÔNG AI: trung bình 39,5ms so với p50 15,2 và p99 989.

Bản tinh vi hơn: một chú giải hiện Mean trong khi ĐƯỜNG thì hiện
p99. Cái đường thì trung thực còn con số bên dưới nó thì không,
mà người ta lại đọc con số.

Cách chữa: đặt phép tính chú giải thành Max và Last, đừng bao giờ
Mean, trên mọi ô độ trễ hay lỗi. Nếu bắt buộc phải hiện một con số
duy nhất thì đó phải là con số TỆ NHẤT trong tầm nhìn — đó là con
số mà người đọc sẽ hành động theo.</code></pre>

<h3>Những luật bố trí ngăn được phần lớn chuyện này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cùng đơn vị thì chung trục; khác đơn vị thì đừng bao giờ chung một ô</span><span class="lz-d">Một đồ thị hai trục với độ trễ bên trái và tỉ lệ lỗi bên phải mời gọi con mắt nhìn ra một mối tương quan giữa hai phép co giãn hoàn toàn tuỳ tiện. Nếu chúng thuộc về nhau, hãy xếp chồng hai cái ô có chung con trỏ thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mọi cái ô đều có đường ngưỡng, ở chỗ nào có ngưỡng</span><span class="lz-d">Một đồ thị độ trễ có một đường kẻ ở mức SLO của bạn biến câu &quot;800ms có tệ không&quot; từ một phán đoán thành một cái liếc mắt. Grafana vẽ sẵn được và gần như không ai đặt.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Các lần deploy là CHÚ THÍCH, không phải một cái ô riêng</span><span class="lz-d">Một đường dọc cắt qua mọi đồ thị ở mỗi lần deploy trả lời câu &quot;có phải ta gây ra không&quot; ngay tức khắc, trên mọi ô cùng lúc. Đây là cái nhãn phiên bản ở bài 5.5 đang làm việc thứ hai của nó.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tiêu đề ô nêu CÂU HỎI, không nêu tên chỉ số</span><span class="lz-d">&quot;Request có đang xếp hàng chờ kết nối không?&quot; hơn hẳn &quot;db_pool_connections&quot;. Cái tiêu đề được đọc bởi một người không nhớ cái chỉ số ấy nghĩa là gì — mà sáu tháng sau, đó là bạn.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hai đường trên một đồ thị tạo ra một câu chuyện NHÂN QUẢ mà mắt bạn tin trước khi bạn kịp đi kiểm.</strong> Đặt bộ nhớ và độ trễ lên cùng một cái ô thì bất cứ xu hướng đi lên chung nào cũng đọc ra thành &quot;áp lực bộ nhớ đang gây chậm&quot;, vì thị giác con người cực giỏi trong việc tìm ra tương quan và hoàn toàn không có cơ chế nào cho chiều hay cho độ trễ pha. Cú hỏng không nằm ở chỗ đồ thị sai — cả hai chuỗi đều chính xác — mà nằm ở chỗ cái đồ thị <em>ĐỀ XUẤT một giả thuyết rồi đồng thời có vẻ như xác nhận nó</em>, mà đó đúng là điều một công cụ chẩn đoán tuyệt đối không được làm. Dưới áp lực sự cố thì cách đọc ấy được đem ra hành động, và một tiếng đồng hồ biến mất vào một cuộc điều tra bộ nhớ trong khi nguyên nhân thật ngồi ở hàng bên dưới. <strong>Tương quan trên một bảng theo dõi là một lời NHẮC đi kiểm, không bao giờ là một PHÁT HIỆN</strong> — và cái phép kiểm ấy là trace hoặc log, theo đúng cái bẫy ở bài 6.4.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/calculation-types/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Grafana — các loại phép tính chú giải</span><span class="lc-sub">Mean, Max, Last và phần còn lại — cái thiết lập đằng sau lời nói dối số 6, và vì sao cái mặc định là thứ nên đổi đầu tiên.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__rate_interval" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Grafana — $__rate_interval</span><span class="lc-sub">Cái biến co giãn cửa sổ gộp theo mức thu phóng, và đó là cách chữa cho lời nói dối số 2.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '10.3 — From dashboard to cause in three clicks|||10.3 — Từ bảng theo dõi tới nguyên nhân trong ba cú bấm',
      slug: 'obs-10-3-ba-cu-bam',
      type: 'VIDEO',
      description: 'Một bảng theo dõi chỉ ra được vấn đề mà không mở được nó ra thì chỉ là một cái ngõ cụt đẹp đẽ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>From dashboard to cause in three clicks</h2>
<p class="lead">A dashboard tells you a number is wrong. Then you need the request, the log line, the stack trace — and if getting there means opening another tool and retyping a time range, you will not do it under pressure. This lesson is about the wiring that turns four separate tools into one.</p>

<h3>The gap the whole course has been building toward closing</h3>
<pre><code>What a dashboard can tell you:

  "p99 latency on /api/v1/notes is 4 seconds"

What it cannot tell you:

  · WHICH requests were slow
  · WHERE inside them the time went
  · WHAT the code was doing at that moment
  · WHETHER anyone got an error

Each of those lives in a different pillar. The question is
whether crossing between them costs one click or five
minutes of copying timestamps between browser tabs.

Under incident pressure that difference decides whether
you follow the evidence or start guessing.</code></pre>

<h3>Click 1: metric → trace (exemplars)</h3>
<pre><code class="language-typescript">// prom-client attaches a trace id to individual histogram
// observations. Those become clickable dots on the graph.
httpDuration.observe(
  { method, route },
  durationSeconds,
  { traceID: currentContext()?.traceId },   // ← the exemplar
);</code></pre>
<pre><code>On the latency panel you now see faint dots scattered above
the p99 line. Each is one real request, and clicking it
opens that trace.

Why this matters more than it sounds: it removes the
SEARCH step entirely. Without exemplars, "find me a slow
request from around 14:07" is a Loki query, a scroll, and
a copied id. With them it is a click on the spike itself —
and you are guaranteed to land on a request that actually
was slow, not one that merely happened at the same minute.</code></pre>

<h3>Click 2: trace → logs</h3>
<pre><code class="language-json">// Grafana: Tempo data source → Trace to logs
{
  "datasourceUid": "loki",
  "tags": [{ "key": "service.name", "value": "container" }],
  "spanStartTimeShift": "-5m",
  "spanEndTimeShift": "5m",
  "filterByTraceID": true          // ← uses the traceId in the log line
}</code></pre>
<pre><code>This is why lesson 6.1 said to put traceId in your log
lines. With it, a span has a "Logs for this span" button
that runs:

  {container="cuonghoangdev_backend"} |= "&lt;traceId&gt;"

The time shift matters: ±5 minutes around the span, because
the log line that explains a failure is often written just
BEFORE the span you are looking at — the retry that
preceded it, the cache miss that caused it.</code></pre>

<h3>Click 3: log → the error, and back to the user</h3>
<pre><code class="language-typescript">// Lesson 7.4's four lines, doing their job here
logger.error('Express error handler', {
  requestId: ctx?.requestId,        // ← searchable from a screenshot
  traceId:   ctx?.traceId,          // ← opens the waterfall
  sentryEventId: eventId,           // ← opens the issue
});</code></pre>
<pre><code>Grafana turns any of those into a link with a derived field:

  Loki data source → Derived fields
    name:  sentryEventId
    regex: "sentryEventId":"([a-f0-9]{32})"
    url:   https://sentry.io/organizations/x/issues/?query=id:\${__value.raw}

Now every log line carrying a Sentry id renders that id as
a link. One click from the log to the grouped issue, with
its stack trace, its user count and its first-seen date.</code></pre>

<h3>The full path, timed</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0s</span><span class="lz-t">Alert: burn rate 14.4×</span><span class="lz-d">The annotation carries a dashboard link (lesson 9.1). Click it — the time range is already set to the incident.</span></div>
  <div class="lz-step"><span class="lz-k">10s</span><span class="lz-t">Row 1 shows p99 at 4s, errors at 3%</span><span class="lz-d">Rows 2 and 3 are normal: event loop fine, memory fine, pool not waiting. So it is not this process and not the pool.</span></div>
  <div class="lz-step"><span class="lz-k">25s</span><span class="lz-t">Click an exemplar dot on the p99 spike</span><span class="lz-d">A real slow request opens as a waterfall. Lesson 6.4's shape 4: one child owns 99% of it, the gateway call.</span></div>
  <div class="lz-step"><span class="lz-k">40s</span><span class="lz-t">&quot;Logs for this span&quot;</span><span class="lz-d">Every line of that request. The outbound log line names the host and the duration — 30,002 ms — and the line before it says which model and how many characters.</span></div>
  <div class="lz-step"><span class="lz-k">60s</span><span class="lz-t">Diagnosis, with evidence</span><span class="lz-d">One minute from page to cause, and every step was a click on something you were already looking at. Compare with lesson 3.5's six steps and twenty-five minutes.</span></div>
</div>

<h3>What to wire first, if you wire only one thing</h3>
<pre><code>The links are worth building in this order, because each
one is useful alone:

  1. traceId + requestId in every log line.
     Costs: one line in emit() (lesson 3.2).
     Buys: every cross-tool jump becomes POSSIBLE, even
     if you do it by copy-paste. Nothing else works
     without this.

  2. Alert annotations carrying a dashboard link.
     Costs: one line per alert rule.
     Buys: the 3am path from "phone buzzed" to "looking
     at the right time range" with no typing.

  3. Derived fields: log → Sentry, log → trace.
     Costs: two regexes in the Loki data source.
     Buys: click 3.

  4. Exemplars.
     Costs: a metrics change plus a Tempo data source.
     Buys: click 1 — the biggest single saving, and the
     one that needs the most infrastructure.

Most projects do 4 first because it is the impressive one,
and never do 1, which is why their exemplars open traces
whose logs cannot be found.</code></pre>

<div class="pitfall">
<p><strong>Trap — every link in this chain breaks silently, and it breaks in the direction of showing you plausible wrong data.</strong> Retention is the usual culprit: traces kept 24 hours (lesson 6.3) and metrics kept 30 days means every exemplar older than a day opens an empty trace view — not an error, just nothing, which reads as &quot;the trace was not sampled&quot; rather than &quot;this link has been dead for weeks&quot;. The worse case is the time-shift window: a ±5-minute log query around a span will happily return log lines from a <em>different</em> request if the traceId filter is misconfigured, and those lines look exactly like evidence. <strong>The whole chain is a system with no tests, used only during incidents, which is the worst possible combination.</strong> Once a month, take a random exemplar older than a day and walk all three clicks — it takes two minutes and it is the only way you will find out before an incident does.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/fundamentals/exemplars/" target="_blank" rel="noopener">
  <span class="lc-ico">✨</span>
  <span class="lc-body"><span class="lc-title">Grafana — exemplars</span><span class="lc-sub">How a trace id rides along with a histogram observation, what the storage cost is, and how to enable the dots on a panel.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/datasources/loki/configure-loki-data-source/#derived-fields" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Grafana — Loki derived fields</span><span class="lc-sub">The regex-to-link mechanism behind click 3, including linking to internal data sources as well as external URLs.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Từ bảng theo dõi tới nguyên nhân trong ba cú bấm</h2>
<p class="lead">Một bảng theo dõi nói cho bạn biết một con số đang sai. Rồi bạn cần cái request, cái dòng log, cái stack trace — và nếu để tới đó phải mở một công cụ khác rồi gõ lại một khoảng thời gian thì bạn sẽ không làm điều đó dưới áp lực. Bài này nói về phần đấu nối biến bốn công cụ riêng rẽ thành một.</p>

<h3>Cái khoảng trống mà cả khoá học này đang tiến tới việc bịt lại</h3>
<pre><code>Một bảng theo dõi nói được cho bạn:

  "p99 độ trễ trên /api/v1/notes là 4 giây"

Nó không nói được:

  · Những request NÀO chậm
  · Bên trong chúng thì thời gian đi ĐÂU
  · Đoạn mã đang LÀM GÌ vào lúc đó
  · Có ai nhận được lỗi KHÔNG

Mỗi thứ đó sống ở một trụ cột khác nhau. Câu hỏi là việc đi qua
lại giữa chúng tốn một cú bấm hay tốn năm phút chép dấu thời gian
qua lại giữa các tab trình duyệt.

Dưới áp lực sự cố thì cái khác biệt ấy quyết định việc bạn ĐI THEO
BẰNG CHỨNG hay bắt đầu ĐOÁN MÒ.</code></pre>

<h3>Bấm 1: chỉ số → trace (exemplar)</h3>
<pre><code class="language-typescript">// prom-client gắn một trace id vào từng quan sát histogram riêng
// lẻ. Chúng trở thành những chấm bấm được trên đồ thị.
httpDuration.observe(
  { method, route },
  durationSeconds,
  { traceID: currentContext()?.traceId },   // ← cái exemplar
);</code></pre>
<pre><code>Trên cái ô độ trễ giờ bạn thấy những chấm mờ rải rác phía trên
đường p99. Mỗi chấm là một request THẬT, và bấm vào nó thì mở ra
cái trace ấy.

Vì sao điều này quan trọng hơn vẻ ngoài của nó: nó gỡ bỏ hoàn
toàn bước TÌM KIẾM. Không có exemplar thì "tìm cho tôi một request
chậm quanh 14:07" là một truy vấn Loki, một lượt cuộn, và một cái
id chép tay. Có nó thì đó là một cú bấm vào chính cái gai — và bạn
được BẢO ĐẢM là rơi trúng một request thật sự chậm, chứ không phải
một cái tình cờ xảy ra cùng phút.</code></pre>

<h3>Bấm 2: trace → log</h3>
<pre><code class="language-json">// Grafana: nguồn dữ liệu Tempo → Trace to logs
{
  "datasourceUid": "loki",
  "tags": [{ "key": "service.name", "value": "container" }],
  "spanStartTimeShift": "-5m",
  "spanEndTimeShift": "5m",
  "filterByTraceID": true          // ← dùng traceId trong dòng log
}</code></pre>
<pre><code>Đây là lý do bài 6.1 bảo hãy đặt traceId vào các dòng log của
bạn. Có nó, một cái span sẽ có nút "Log của span này" chạy lệnh:

  {container="cuonghoangdev_backend"} |= "&lt;traceId&gt;"

Cái dịch thời gian rất quan trọng: ±5 phút quanh cái span, vì dòng
log giải thích một cú hỏng thường được ghi ngay TRƯỚC cái span bạn
đang nhìn — lần thử lại đi trước nó, cú trượt cache gây ra nó.</code></pre>

<h3>Bấm 3: log → cái lỗi, rồi quay về với người dùng</h3>
<pre><code class="language-typescript">// Bốn dòng của bài 7.4, đang làm việc của chúng ở đây
logger.error('Express error handler', {
  requestId: ctx?.requestId,        // ← tìm được từ một ảnh chụp màn hình
  traceId:   ctx?.traceId,          // ← mở ra biểu đồ thác
  sentryEventId: eventId,           // ← mở ra cái vấn đề
});</code></pre>
<pre><code>Grafana biến bất cứ cái nào trong số đó thành một liên kết bằng
một trường dẫn xuất:

  Nguồn dữ liệu Loki → Derived fields
    name:  sentryEventId
    regex: "sentryEventId":"([a-f0-9]{32})"
    url:   https://sentry.io/organizations/x/issues/?query=id:\${__value.raw}

Giờ mọi dòng log mang một id Sentry đều hiển thị id ấy dưới dạng
một liên kết. Một cú bấm từ dòng log tới cái vấn đề đã gom nhóm,
kèm stack trace, số người dùng và ngày thấy-lần-đầu của nó.</code></pre>

<h3>Trọn con đường, có bấm giờ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0s</span><span class="lz-t">Cảnh báo: tốc độ đốt 14,4×</span><span class="lz-d">Phần annotation mang theo một liên kết bảng theo dõi (bài 9.1). Bấm vào — khoảng thời gian đã được đặt sẵn đúng vào lúc sự cố.</span></div>
  <div class="lz-step"><span class="lz-k">10s</span><span class="lz-t">Hàng 1 hiện p99 ở 4s, lỗi ở 3%</span><span class="lz-d">Hàng 2 và 3 bình thường: vòng lặp sự kiện ổn, bộ nhớ ổn, bể không chờ. Vậy nó không phải tiến trình này và không phải cái bể.</span></div>
  <div class="lz-step"><span class="lz-k">25s</span><span class="lz-t">Bấm một chấm exemplar trên cái gai p99</span><span class="lz-d">Một request chậm THẬT mở ra thành biểu đồ thác. Hình 4 của bài 6.4: một đứa con chiếm 99% cả trace, chính là lời gọi cổng.</span></div>
  <div class="lz-step"><span class="lz-k">40s</span><span class="lz-t">&quot;Log của span này&quot;</span><span class="lz-d">Mọi dòng của request đó. Dòng log lời-gọi-ra-ngoài gọi tên host và thời lượng — 30.002 ms — và dòng trước nó nói model nào và bao nhiêu ký tự.</span></div>
  <div class="lz-step"><span class="lz-k">60s</span><span class="lz-t">Chẩn đoán, kèm bằng chứng</span><span class="lz-d">Một phút từ lúc bị gọi tới nguyên nhân, và mỗi bước đều là một cú bấm vào thứ bạn vốn đang nhìn. So với sáu bước và hai mươi lăm phút ở bài 3.5.</span></div>
</div>

<h3>Nối cái gì trước, nếu bạn chỉ nối được một thứ</h3>
<pre><code>Các mối nối đáng dựng theo thứ tự này, vì mỗi cái tự nó đã hữu ích:

  1. traceId + requestId trong MỌI dòng log.
     Tốn: một dòng trong emit() (bài 3.2).
     Được: mọi cú nhảy giữa các công cụ trở nên KHẢ THI, dù bạn
     làm nó bằng cách chép-dán. Không có cái này thì chẳng cái
     nào khác chạy được.

  2. Annotation của cảnh báo mang một liên kết bảng theo dõi.
     Tốn: một dòng cho mỗi luật cảnh báo.
     Được: con đường lúc 3 giờ sáng từ "điện thoại rung" tới
     "đang nhìn đúng khoảng thời gian" mà không phải gõ gì.

  3. Trường dẫn xuất: log → Sentry, log → trace.
     Tốn: hai biểu thức chính quy trong nguồn dữ liệu Loki.
     Được: cú bấm 3.

  4. Exemplar.
     Tốn: một thay đổi ở chỉ số cộng một nguồn dữ liệu Tempo.
     Được: cú bấm 1 — khoản tiết kiệm đơn lẻ lớn nhất, và cũng
     là cái cần nhiều hạ tầng nhất.

Phần lớn dự án làm số 4 trước vì nó gây ấn tượng, và không bao
giờ làm số 1, và đó là lý do exemplar của họ mở ra những cái trace
mà không tìm được log.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — mọi mối nối trong chuỗi này đều đứt trong im lặng, và nó đứt theo hướng cho bạn xem dữ liệu SAI mà nghe hợp lý.</strong> Thủ phạm thường là thời hạn lưu: trace giữ 24 giờ (bài 6.3) còn chỉ số giữ 30 ngày nghĩa là mọi exemplar cũ hơn một ngày sẽ mở ra một khung trace rỗng — không phải lỗi, chỉ là chẳng có gì, và điều đó đọc ra thành &quot;cái trace ấy không được lấy mẫu&quot; chứ không thành &quot;mối nối này đã chết hàng tuần rồi&quot;. Ca tệ hơn là cái cửa sổ dịch thời gian: một truy vấn log ±5 phút quanh một span sẽ vui vẻ trả về những dòng log của một request <em>KHÁC</em> nếu bộ lọc traceId bị cấu hình sai, và những dòng đó trông y hệt bằng chứng. <strong>Cả cái chuỗi này là một hệ thống không có bài kiểm nào, chỉ được dùng trong lúc sự cố, mà đó là tổ hợp tệ nhất có thể.</strong> Mỗi tháng một lần, hãy lấy một exemplar ngẫu nhiên cũ hơn một ngày rồi đi hết cả ba cú bấm — nó tốn hai phút và là cách duy nhất để bạn phát hiện ra trước khi một sự cố phát hiện ra.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/fundamentals/exemplars/" target="_blank" rel="noopener">
  <span class="lc-ico">✨</span>
  <span class="lc-body"><span class="lc-title">Grafana — exemplar</span><span class="lc-sub">Một trace id đi ké theo một quan sát histogram thế nào, chi phí lưu trữ là bao nhiêu, và cách bật những cái chấm ấy lên trên một cái ô.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/grafana/latest/datasources/loki/configure-loki-data-source/#derived-fields" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Grafana — trường dẫn xuất của Loki</span><span class="lc-sub">Cơ chế biểu-thức-thành-liên-kết đằng sau cú bấm 3, kể cả việc liên kết tới nguồn dữ liệu nội bộ chứ không chỉ URL bên ngoài.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '10.4 — Chapter 10 quiz|||10.4 — Kiểm tra chương 10',
      slug: 'obs-10-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về khán giả của bảng theo dõi, đồ thị nói dối, và việc nối các trụ cột lại.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 10 · Quiz</span><h2>Six questions on dashboards</h2><p class="lead">Four of these describe a chart drawn from correct data that leads to the wrong conclusion. There is no bug to find in any of them.</p></div><div class="ml-vi"><span class="eyebrow">Chương 10 · Kiểm tra</span><h2>Sáu câu về bảng theo dõi</h2><p class="lead">Bốn câu trong đây mô tả một đồ thị vẽ từ dữ liệu ĐÚNG mà dẫn tới kết luận SAI. Chẳng có lỗi nào để tìm trong cái nào cả.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why does a dashboard reliably decay from six useful panels to forty unread ones?|||Vì sao một bảng theo dõi đều đặn suy tàn từ sáu ô hữu ích thành bốn mươi ô không ai đọc?',
            options: [
              'Because every panel is added by someone solving a real problem and nobody ever deletes one — it dies of correct decisions, one at a time. The fix is not discipline but scope: one audience, one question, one time range per dashboard, and panels that do not serve it belong elsewhere.|||Vì mỗi cái ô đều do một người thêm vào để giải một vấn đề có thật và chẳng ai bao giờ xoá cái nào — nó chết vì những quyết định ĐÚNG, từng cái một. Cách chữa không phải kỷ luật mà là phạm vi: một khán giả, một câu hỏi, một khoảng thời gian cho mỗi bảng, và những ô không phục vụ nó thì thuộc về chỗ khác.',
              'Because Grafana has no way to delete panels|||Vì Grafana không có cách nào xoá ô',
              'Because metrics multiply faster than screens do|||Vì chỉ số nhân lên nhanh hơn màn hình',
              'Because people add panels without understanding them|||Vì người ta thêm ô mà không hiểu chúng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A p99 latency panel shows a 4-second spike at a 1-hour zoom and 400ms at a 7-day zoom. What is happening?|||Một ô độ trễ p99 hiện một cái gai 4 giây ở mức thu phóng 1 giờ và 400ms ở mức 7 ngày. Chuyện gì đang xảy ra?',
            options: [
              'The panel is averaging p99 values to fit more points into each pixel — lesson 4.2\'s pitfall as a UI behaviour, so an incident visibly shrinks as you widen the range. Fix it by aggregating buckets over the wider window and computing the quantile LAST: histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval]))).|||Cái ô đang lấy trung bình các giá trị p99 để nhét nhiều điểm hơn vào mỗi điểm ảnh — cái bẫy ở bài 4.2 dưới dạng một hành vi giao diện, nên một sự cố TEO NHỎ thấy rõ khi bạn nới khoảng thời gian. Chữa bằng cách gộp các Ô trên cửa sổ rộng hơn rồi tính phân vị SAU CÙNG: histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval]))).',
              'The 7-day view is correct and the 1-hour view is noise|||Tầm nhìn 7 ngày là đúng còn tầm nhìn 1 giờ là nhiễu',
              'Prometheus downsamples data older than 24 hours|||Prometheus giảm mẫu dữ liệu cũ hơn 24 giờ',
              'The spike was a scrape failure, not real latency|||Cái gai đó là một lượt quét hỏng, không phải độ trễ thật',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A graph shows a gap. What should you check before concluding traffic stopped?|||Một đồ thị hiện một khoảng trống. Bạn nên kiểm gì trước khi kết luận là lưu lượng đã dừng?',
            options: [
              'up{job="backend"}. A gap far more often means you stopped RECEIVING data — a scrape timeout (which puts a gap in every metric, including the healthy ones), a container restart before the first scrape, or Prometheus itself being down. up=0 means the gap is yours; up=1 with a flat zero means traffic really stopped.|||up{job="backend"}. Một khoảng trống thường xuyên hơn nhiều nghĩa là bạn đã ngừng NHẬN ĐƯỢC dữ liệu — một lượt quét hết giờ (thứ tạo khoảng trống trong MỌI chỉ số, kể cả những cái khoẻ mạnh), một container khởi động lại trước lượt quét đầu, hoặc chính Prometheus chết. up=0 nghĩa là cái khoảng trống là của bạn; up=1 mà phẳng ở không nghĩa là lưu lượng thật sự đã dừng.',
              'The error rate panel, which would spike at the same time|||Ô tỉ lệ lỗi, thứ sẽ vọt lên cùng lúc',
              'Nothing — a gap always means zero traffic|||Không gì cả — một khoảng trống luôn nghĩa là không có lưu lượng',
              'The deploy annotations, since deploys cause gaps|||Các chú thích deploy, vì deploy gây ra khoảng trống',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is "Errors: 47/min" a bad panel on its own?|||Vì sao "Lỗi: 47/phút" là một cái ô tồi khi đứng một mình?',
            options: [
              'It has no denominator: at 5,000 req/min that is 0.94% and normal; at 60 req/min it is 78% and the site is on fire. The same number supports two opposite conclusions, and a panel that requires the reader to remember another panel will be misread under pressure. Show the ratio, or the request rate in the same panel.|||Nó không có mẫu số: ở 5.000 req/phút thì đó là 0,94% và bình thường; ở 60 req/phút thì đó là 78% và trang đang cháy. Cùng một con số ủng hộ hai kết luận ngược nhau, và một cái ô đòi người đọc phải nhớ một cái ô khác sẽ bị đọc sai dưới áp lực. Hãy hiện cái tỉ lệ, hoặc hiện tốc độ request trong cùng cái ô.',
              'Because 47 is too small a number to display|||Vì 47 là một con số quá nhỏ để hiển thị',
              'Because error counts should always be cumulative|||Vì số đếm lỗi thì luôn phải là tích luỹ',
              'Because per-minute is the wrong unit for Prometheus|||Vì mỗi-phút là đơn vị sai với Prometheus',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Memory and latency drift upward together on one panel. What have you learned?|||Bộ nhớ và độ trễ cùng trôi lên trên một cái ô. Bạn học được gì?',
            options: [
              'Nothing yet. The eye finds correlation instantly and has no mechanism for direction or lag, so the chart proposes a hypothesis and appears to confirm it at the same time — which is the one thing a diagnostic tool must not do. Correlation on a dashboard is a prompt to go check a trace or a log, never a finding.|||Chưa học được gì cả. Con mắt tìm ra tương quan ngay tức khắc và không có cơ chế nào cho chiều hay cho độ trễ pha, nên cái đồ thị vừa ĐỀ XUẤT một giả thuyết vừa có vẻ như xác nhận nó cùng lúc — mà đó đúng là điều một công cụ chẩn đoán không được làm. Tương quan trên bảng theo dõi là một lời NHẮC đi kiểm một trace hay một log, không bao giờ là một PHÁT HIỆN.',
              'That memory pressure is causing the slowness|||Rằng áp lực bộ nhớ đang gây ra sự chậm chạp',
              'That the two metrics share a scrape failure|||Rằng hai chỉ số đó chung một lượt quét hỏng',
              'That a memory leak is confirmed by the latency rise|||Rằng một chỗ rò rỉ bộ nhớ đã được xác nhận bởi việc độ trễ tăng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of the four dashboard-to-cause links, which should you build first and why?|||Trong bốn mối nối từ bảng-theo-dõi tới nguyên-nhân, nên dựng cái nào trước và vì sao?',
            options: [
              'traceId and requestId in every log line — one line in emit(). It costs almost nothing and every other jump becomes possible, even by copy-paste. Exemplars are the impressive one and get built first, which is why so many projects have exemplars that open traces whose logs cannot be found.|||traceId và requestId trong MỌI dòng log — một dòng trong emit(). Nó gần như chẳng tốn gì và mọi cú nhảy khác đều trở nên khả thi, kể cả bằng chép-dán. Exemplar là cái gây ấn tượng và hay được dựng trước, và đó là lý do rất nhiều dự án có exemplar mở ra những trace mà không tìm được log.',
              'Exemplars, since they save the most clicks|||Exemplar, vì nó tiết kiệm nhiều cú bấm nhất',
              'Derived fields, since they need no code change|||Trường dẫn xuất, vì nó không cần sửa mã',
              'Alert annotations, since alerts come first chronologically|||Annotation của cảnh báo, vì cảnh báo tới trước về mặt thời gian',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
