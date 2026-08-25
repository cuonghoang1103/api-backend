/**
 * Observability — Mục 0: Trước khi đo.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Section 0 — Before you measure anything|||Mục 0 — Trước khi đo bất cứ thứ gì',
  slug: 'obs-muc0-intro',
  description: 'Vì sao khoá này tồn tại, ba trụ cột và cái thứ tư người ta quên, dựng môi trường đo, và cách học.',
  sortOrder: 1,
  lessons: [

    {
      title: '0.1 — The outage you cannot see from inside|||0.1 — Cú sự cố bạn không nhìn thấy từ bên trong',
      slug: 'obs-0-1-vi-sao',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một backend chạy được không có nghĩa là bạn biết nó đang làm gì. Bài này đo đúng khoảng cách đó trên chính kho này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>The outage you cannot see from inside</h2>
<p class="lead">Every failure in this repository&#39;s history has the same shape: the process was running, the health check was green, and something was quietly broken for minutes or hours before a human noticed. Not one of them was found by the server. All of them were found by a person using the site.</p>

<h3>Four real incidents, and what noticed each one</h3>
<pre><code>Incident (from this repo's CLAUDE.md)          What actually noticed it
────────────────────────────────────────────   ─────────────────────────────
GIF picker returned 403 for weeks              A user clicking the button
Sessions died silently after 24h               A user being logged out
Stale dist/ never mounted /api/v1/gifs         Two features "disappearing"
Backend restart-loop after a bad image swap    A 502 page, seven minutes in</code></pre>
<p>The column on the right is the finding. In four separate incidents the detection mechanism was a human being, and the delay between &quot;broken&quot; and &quot;noticed&quot; ranged from seven minutes to several weeks. That gap is what this course is about — not making the system perfect, but making it <em>tell you</em> when it is not.</p>

<h3>The gap, measured on this codebase</h3>
<p>These are counted with <code>grep</code> against <code>src/</code> as it stands today, not estimated:</p>
<div class="out">$ grep -rn "router\\.\\(get\\|post\\|put\\|patch\\|delete\\)(\\|app\\.\\(get\\|post\\|...)" src/ --include=*.ts | wc -l
945

$ ls src/routes/*.ts | wc -l
73
$ grep -rl "utils/logger" src/routes/*.ts | wc -l
16

$ ls src/services/*.ts | wc -l
101
$ grep -rl "utils/logger" src/services/*.ts | wc -l
22

$ grep -rn "requestId\\|x-request-id\\|correlationId\\|traceId" src/ --include=*.ts | wc -l
4</div>
<p>945 route declarations. 73 route files, of which <strong>16</strong> import the logger. 101 service files, of which <strong>22</strong> do. And across the entire backend, the words <code>requestId</code>, <code>correlationId</code> and <code>traceId</code> appear <strong>four times</strong> — which means that when two log lines from the same request land in the same file, there is no way to prove they belong together.</p>
<p>This is not an unusually bad codebase. It is a normal one: logging was added where someone was debugging something, and nowhere else. The result is a system that is observable in the places that already caused pain and blind everywhere else — which is exactly backwards, because the places that already caused pain are the ones you now understand.</p>

<h3>What "observable" actually means</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Monitoring answers questions you wrote down in advance</span><span class="lz-d">&quot;Is CPU above 80%?&quot; &quot;Is the process up?&quot; You knew to ask, so you built a check. It catches the failure you predicted.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Observability answers questions you did not</span><span class="lz-d">&quot;Why is this <em>one</em> user&#39;s upload timing out, only on Tuesdays, only above 4 MB?&quot; Nobody writes that check in advance. You need enough recorded detail to ask it afterwards.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The difference is what you can ask after the fact</span><span class="lz-d">A dashboard of eight numbers is monitoring. Being able to filter a week of requests by user, route and duration and find the pattern is observability.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Both cost money, and the second costs more</span><span class="lz-d">Which is why this course measures the cost of every mechanism it teaches, instead of recommending all of them.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — believing that a green health check means the application works.</strong> This repository&#39;s <code>/health</code> endpoint runs <code>SELECT 1</code> against Postgres and returns <code>{status:"ok"}</code>. During the stale-build incident, that check was green the entire time: the process was alive, the database was reachable, and <code>/api/v1/gifs</code> returned 404 because the route was never mounted. A health check proves the things it checks and <em>nothing else</em> — and the failures that actually reach users are almost never the things anyone thought to check. Chapter 8 takes that endpoint apart line by line.</p>
</div>

<h3>What this course is not</h3>
<p>It is not a tour of vendors. Every mechanism here — a log line, a counter, a span, an alert rule — is explained by what it costs and what it can prove, and the tool that implements it is secondary and replaceable. It is also not a performance course: Node.js chapter 16 covers making things fast, and this one covers <em>knowing</em> that they are not.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring distributed systems</span><span class="lc-sub">The four golden signals, and the argument for why symptom-based alerting beats cause-based.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — Observability primer</span><span class="lc-sub">The vendor-neutral definitions of logs, metrics and traces this course uses.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Cú sự cố bạn không nhìn thấy từ bên trong</h2>
<p class="lead">Mọi cú hỏng trong lịch sử kho này đều cùng một hình dạng: tiến trình vẫn chạy, phép kiểm sức khoẻ vẫn xanh, và có thứ gì đó lặng lẽ hỏng suốt mấy phút hoặc mấy giờ trước khi một con người nhận ra. Không cái nào trong số đó do máy chủ tìm ra. Tất cả đều do một người đang dùng trang web tìm ra.</p>

<h3>Bốn sự cố có thật, và cái gì đã phát hiện ra từng cái</h3>
<pre><code>Sự cố (từ CLAUDE.md của kho này)               Thứ thật sự phát hiện ra
────────────────────────────────────────────   ─────────────────────────────
Bộ chọn GIF trả 403 suốt mấy tuần              Một người dùng bấm vào nút
Phiên đăng nhập chết lặng lẽ sau 24 giờ        Một người dùng bị đăng xuất
dist/ cũ chưa từng gắn /api/v1/gifs            Hai tính năng "biến mất"
Backend lặp khởi động sau khi tráo nhầm ảnh    Một trang 502, ở phút thứ bảy</code></pre>
<p>Cột bên phải mới là phát hiện. Trong bốn sự cố riêng biệt, cơ chế phát hiện đều là một con người, và khoảng cách giữa &quot;đã hỏng&quot; và &quot;được nhận ra&quot; trải từ bảy phút tới vài tuần. Chính cái khoảng đó là thứ khoá này nói tới — không phải làm cho hệ thống hoàn hảo, mà làm cho nó <em>nói cho bạn biết</em> khi nó không hoàn hảo.</p>

<h3>Cái khoảng đó, đo trên chính kho mã này</h3>
<p>Đây là số đếm bằng <code>grep</code> trên <code>src/</code> ở trạng thái hôm nay, không phải ước lượng:</p>
<div class="out">$ grep -rn "router\\.\\(get\\|post\\|put\\|patch\\|delete\\)(\\|app\\.\\(get\\|post\\|...)" src/ --include=*.ts | wc -l
945

$ ls src/routes/*.ts | wc -l
73
$ grep -rl "utils/logger" src/routes/*.ts | wc -l
16

$ ls src/services/*.ts | wc -l
101
$ grep -rl "utils/logger" src/services/*.ts | wc -l
22

$ grep -rn "requestId\\|x-request-id\\|correlationId\\|traceId" src/ --include=*.ts | wc -l
4</div>
<p>945 khai báo route. 73 file routes, trong đó <strong>16</strong> file có import logger. 101 file services, trong đó <strong>22</strong> file có. Và trên toàn bộ backend, các chữ <code>requestId</code>, <code>correlationId</code> và <code>traceId</code> xuất hiện đúng <strong>bốn lần</strong> — nghĩa là khi hai dòng log của cùng một request rơi vào cùng một file, chẳng có cách nào chứng minh chúng thuộc về nhau.</p>
<p>Đây không phải một kho mã tệ bất thường. Nó bình thường: log được thêm vào đúng chỗ có người đang gỡ lỗi cái gì đó, và không thêm ở đâu khác. Kết quả là một hệ thống quan sát được ở đúng những nơi đã từng gây đau và mù ở mọi nơi còn lại — mà như thế là ngược hẳn, vì những nơi đã từng gây đau chính là những nơi giờ bạn đã hiểu.</p>

<h3>&quot;Quan sát được&quot; thật ra nghĩa là gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Giám sát trả lời những câu hỏi bạn đã viết ra từ trước</span><span class="lz-d">&quot;CPU có vượt 80% không?&quot; &quot;Tiến trình còn sống không?&quot; Bạn biết phải hỏi, nên bạn dựng một phép kiểm. Nó bắt được cú hỏng bạn đã tiên đoán.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quan sát được trả lời những câu bạn CHƯA hỏi</span><span class="lz-d">&quot;Vì sao upload của <em>đúng một</em> người dùng này hết giờ, chỉ vào thứ Ba, chỉ khi file trên 4 MB?&quot; Chẳng ai viết sẵn phép kiểm đó. Bạn cần đủ chi tiết đã ghi lại để hỏi nó về sau.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Khác biệt nằm ở thứ bạn hỏi được SAU khi chuyện đã xảy ra</span><span class="lz-d">Một bảng tám con số là giám sát. Lọc được một tuần request theo người dùng, theo route và theo thời lượng rồi tìm ra quy luật mới là quan sát được.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cả hai đều tốn tiền, và cái thứ hai tốn hơn</span><span class="lz-d">Đó là lý do khoá này đo chi phí của mọi cơ chế nó dạy, thay vì khuyên bạn dùng hết.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — tin rằng một phép kiểm sức khoẻ xanh nghĩa là ứng dụng chạy được.</strong> Endpoint <code>/health</code> của kho này chạy <code>SELECT 1</code> lên Postgres rồi trả về <code>{status:"ok"}</code>. Trong suốt sự cố build cũ, phép kiểm đó xanh từ đầu tới cuối: tiến trình còn sống, cơ sở dữ liệu với tới được, và <code>/api/v1/gifs</code> trả 404 vì cái route ấy chưa từng được gắn. Một phép kiểm sức khoẻ chứng minh đúng những thứ nó kiểm và <em>không gì khác</em> — mà những cú hỏng thật sự chạm tới người dùng thì gần như chẳng bao giờ là thứ có ai nghĩ tới việc đi kiểm. Chương 8 sẽ mổ xẻ cái endpoint đó từng dòng.</p>
</div>

<h3>Khoá này KHÔNG phải cái gì</h3>
<p>Nó không phải một chuyến tham quan các nhà cung cấp. Mọi cơ chế ở đây — một dòng log, một bộ đếm, một span, một luật cảnh báo — đều được giải thích bằng cái nó tốn và cái nó chứng minh được, còn công cụ hiện thực nó chỉ là thứ yếu và thay thế được. Nó cũng không phải một khoá hiệu năng: chương 16 của khoá Node.js lo việc làm cho mọi thứ nhanh, còn khoá này lo việc <em>biết</em> rằng chúng không nhanh.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — Giám sát hệ phân tán</span><span class="lc-sub">Bốn tín hiệu vàng, và lập luận vì sao cảnh báo theo triệu chứng hơn cảnh báo theo nguyên nhân.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — Nhập môn quan sát</span><span class="lc-sub">Định nghĩa trung lập với nhà cung cấp cho log, chỉ số và trace mà khoá này dùng.</span></span>
</a>
</div>
`,
    },

    {
      title: '0.2 — Three pillars, and the fourth one everybody forgets|||0.2 — Ba trụ cột, và cái thứ tư ai cũng quên',
      slug: 'obs-0-2-ba-tru-cot',
      type: 'VIDEO',
      description: 'Log, chỉ số, trace — mỗi cái trả lời một câu hỏi khác nhau và tốn một khoản khác nhau. Cái thứ tư không nằm trong danh sách chuẩn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Three pillars, and the fourth one everybody forgets</h2>
<p class="lead">The standard list is logs, metrics and traces. It is a useful list because each one answers a different question at a different cost — and choosing wrongly is how teams end up paying for a data warehouse to answer a question a counter would have answered for free.</p>

<h3>What each pillar is actually good at</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Logs</span><span class="lz-t">One event, in full detail</span><span class="lz-d">&quot;What exactly happened to <em>this</em> request?&quot; High detail, high cost per event, and cost grows with traffic. The only pillar that can carry an arbitrary payload.</span></div>
  <div class="lz-node"><span class="lz-k">Metrics</span><span class="lz-t">Many events, summarised</span><span class="lz-d">&quot;How many, how fast, how often?&quot; Almost free per event because the cost is per <em>series</em>, not per request — a counter incremented a billion times is still one number.</span></div>
  <div class="lz-node"><span class="lz-k">Traces</span><span class="lz-t">One request, across services</span><span class="lz-d">&quot;Where did the 900 ms go?&quot; The only one that shows causality and ordering. Expensive enough that sampling is mandatory, which chapter 6 measures.</span></div>
  <div class="lz-node"><span class="lz-k">The fourth</span><span class="lz-t">Change events</span><span class="lz-d">Deploys, config edits, feature flags, migrations. Not in the canonical list, and the first thing you want on a graph when something breaks at 14:02.</span></div>
</div>

<h3>Why the fourth one matters more than its reputation</h3>
<p>Roughly speaking, most incidents are caused by a change. If your dashboard shows error rate rising at 14:02 and nothing else, you are guessing. If the same graph has a vertical line at 14:01 labelled <code>deploy 8dc8bcc</code>, the investigation is over before it started.</p>
<p>This is unusually cheap to build. A deploy script that emits one line — a timestamp, a commit hash, and who ran it — into the same log stream as everything else gives you the annotation. This repository&#39;s <code>deploy-nha.sh</code> already knows all three facts; nothing currently records them anywhere a graph can read.</p>

<h3>Choosing between them, by the question</h3>
<pre><code>Question                                  Pillar     Why not the others
────────────────────────────────────────  ─────────  ────────────────────────────
"How many 500s in the last hour?"         Metric     A log query scans; a counter is read
"Why did request abc-123 fail?"           Log        A metric cannot carry the stack
"Which service made this endpoint slow?"  Trace      Logs lack ordering across processes
"Did it start when we deployed?"          Change     None of the other three record it
"What is p99 latency this week?"          Metric     Computable from logs, at 1000x the cost</code></pre>
<p>The last row is the one that costs teams money. p99 latency is derivable from request logs — you keep every request, you sort, you take the 99th percentile. It is also the single most expensive way to obtain a number that a histogram gives you for a few bytes per bucket. Chapter 4 does the arithmetic.</p>

<div class="pitfall">
<p><strong>Trap — using logs as a metrics store because logs are already there.</strong> It works at first: you have request logs, so you count 500s by searching for them. Then traffic grows, the search that took two seconds takes ninety, and the alert built on it starts timing out — so the alert becomes flaky, and a flaky alert gets muted. The failure is not that the query is slow; it is that <em>your alerting is now coupled to your log volume</em>, and log volume grows with exactly the traffic that makes incidents likely. Count with a counter, and keep logs for the questions only logs can answer.</p>
</div>

<h3>The cost shape, which decides most architecture</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Metrics: cost per series, per scrape interval</span><span class="lz-lnote">Independent of traffic. Ten requests a second or ten thousand, the same 224 series cost the same. This is why metrics carry the alerting.</span></div>
  <div class="lz-layer"><span class="lz-lname">Traces: cost per sampled request</span><span class="lz-lnote">Linear in traffic, divided by your sample rate. At 1% you pay for one in a hundred and lose the other ninety-nine — which is fine until the one you need is among them.</span></div>
  <div class="lz-layer"><span class="lz-lname">Logs: cost per event, uncapped</span><span class="lz-lnote">Linear in traffic and in verbosity, and the two multiply. Adding one debug line per request to a service doing 500 rps adds 43 million lines a day.</span></div>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/signals/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — Signals</span><span class="lc-sub">The formal definitions of traces, metrics, logs and baggage, and how they reference each other.</span></span>
</a>
<a class="link-card dl" href="https://charity.wtf/2018/09/06/two-key-differences-between-metrics-and-events/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Charity Majors — Metrics vs events</span><span class="lc-sub">The argument that the pillars are a cost model, not a taxonomy — worth reading against this lesson.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ba trụ cột, và cái thứ tư ai cũng quên</h2>
<p class="lead">Danh sách chuẩn là log, chỉ số và trace. Đó là một danh sách hữu ích vì mỗi cái trả lời một câu hỏi khác nhau với một cái giá khác nhau — và chọn sai chính là cách các đội đi tới chỗ trả tiền cho một kho dữ liệu để trả lời một câu hỏi mà một bộ đếm đã trả lời miễn phí.</p>

<h3>Mỗi trụ cột thật sự giỏi cái gì</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Log</span><span class="lz-t">Một sự kiện, đầy đủ chi tiết</span><span class="lz-d">&quot;Chính xác chuyện gì đã xảy ra với <em>cái</em> request này?&quot; Chi tiết cao, giá mỗi sự kiện cao, và giá lớn lên theo lưu lượng. Trụ cột duy nhất mang được một phần dữ liệu tuỳ ý.</span></div>
  <div class="lz-node"><span class="lz-k">Chỉ số</span><span class="lz-t">Nhiều sự kiện, đã tóm lại</span><span class="lz-d">&quot;Bao nhiêu, nhanh cỡ nào, thường xuyên không?&quot; Gần như miễn phí trên mỗi sự kiện vì giá tính theo <em>chuỗi thời gian</em> chứ không theo request — một bộ đếm tăng một tỷ lần vẫn là một con số.</span></div>
  <div class="lz-node"><span class="lz-k">Trace</span><span class="lz-t">Một request, xuyên qua nhiều dịch vụ</span><span class="lz-d">&quot;900 ms đó đi đâu mất?&quot; Cái duy nhất cho thấy quan hệ nhân quả và thứ tự. Đắt đủ để việc lấy mẫu là bắt buộc, thứ mà chương 6 đo.</span></div>
  <div class="lz-node"><span class="lz-k">Cái thứ tư</span><span class="lz-t">Sự kiện thay đổi</span><span class="lz-d">Deploy, sửa cấu hình, bật cờ tính năng, migration. Không nằm trong danh sách kinh điển, và là thứ đầu tiên bạn muốn thấy trên biểu đồ khi có gì đó hỏng lúc 14:02.</span></div>
</div>

<h3>Vì sao cái thứ tư quan trọng hơn tiếng tăm của nó</h3>
<p>Nói đại khái, phần lớn sự cố là do một thay đổi gây ra. Nếu bảng theo dõi của bạn hiện tỷ lệ lỗi tăng lúc 14:02 và không gì khác, bạn đang đoán. Nếu cùng biểu đồ đó có một đường dọc ở 14:01 ghi <code>deploy 8dc8bcc</code> thì cuộc điều tra kết thúc trước khi kịp bắt đầu.</p>
<p>Thứ này rẻ đến bất ngờ. Một script deploy phát ra đúng một dòng — một dấu thời gian, một mã commit, và ai đã chạy nó — vào cùng dòng log với mọi thứ khác là bạn có cái chú thích ấy. Script <code>deploy-nha.sh</code> của kho này đã biết cả ba dữ kiện; chỉ là hiện chẳng có gì ghi chúng lại ở một nơi mà biểu đồ đọc được.</p>

<h3>Chọn giữa chúng, theo câu hỏi</h3>
<pre><code>Câu hỏi                                   Trụ cột    Vì sao không phải cái khác
────────────────────────────────────────  ─────────  ────────────────────────────
"Một giờ qua có bao nhiêu cú 500?"        Chỉ số     Truy vấn log phải quét; bộ đếm chỉ đọc
"Vì sao request abc-123 hỏng?"            Log        Chỉ số không mang nổi vệt stack
"Dịch vụ nào làm endpoint này chậm?"      Trace      Log thiếu thứ tự xuyên qua tiến trình
"Nó bắt đầu đúng lúc mình deploy à?"      Thay đổi   Ba cái kia đều không ghi lại
"p99 tuần này là bao nhiêu?"              Chỉ số     Tính từ log được, với giá gấp 1000 lần</code></pre>
<p>Dòng cuối là dòng làm các đội tốn tiền. p99 độ trễ suy ra được từ log request — bạn giữ lại mọi request, sắp xếp, rồi lấy phân vị thứ 99. Nó cũng là cách đắt đỏ nhất để có được một con số mà một histogram cho bạn với vài byte mỗi ô. Chương 4 sẽ làm phép tính đó.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng log làm kho chỉ số vì log vốn đã có sẵn ở đó.</strong> Lúc đầu nó chạy được: bạn đã có log request, nên bạn đếm số 500 bằng cách tìm kiếm chúng. Rồi lưu lượng lớn lên, phép tìm vốn mất hai giây giờ mất chín mươi, và cái cảnh báo dựng trên đó bắt đầu hết giờ — thế là cảnh báo thành chập chờn, và một cảnh báo chập chờn thì bị tắt tiếng. Cú hỏng không nằm ở chỗ truy vấn chậm; nó nằm ở chỗ <em>hệ cảnh báo của bạn giờ dính chặt vào khối lượng log</em>, mà khối lượng log thì lớn lên theo đúng cái lưu lượng làm sự cố dễ xảy ra. Hãy đếm bằng một bộ đếm, và để dành log cho những câu hỏi mà chỉ log mới trả lời được.</p>
</div>

<h3>Hình dạng chi phí, thứ quyết định phần lớn kiến trúc</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chỉ số: giá theo chuỗi thời gian, theo chu kỳ thu thập</span><span class="lz-lnote">Độc lập với lưu lượng. Mười request một giây hay mười nghìn, cùng 224 chuỗi ấy vẫn tốn như nhau. Đó là lý do chỉ số gánh phần cảnh báo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trace: giá theo mỗi request được lấy mẫu</span><span class="lz-lnote">Tuyến tính theo lưu lượng, chia cho tỷ lệ lấy mẫu. Ở mức 1% bạn trả tiền cho một trên trăm và mất chín mươi chín cái còn lại — chuyện đó ổn cho tới khi cái bạn cần nằm trong số đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log: giá theo mỗi sự kiện, không có trần</span><span class="lz-lnote">Tuyến tính theo lưu lượng VÀ theo độ chi tiết, mà hai thứ đó nhân với nhau. Thêm một dòng debug mỗi request vào một dịch vụ chạy 500 rps là thêm 43 triệu dòng mỗi ngày.</span></div>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/signals/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — Các tín hiệu</span><span class="lc-sub">Định nghĩa hình thức của trace, chỉ số, log và baggage, cùng cách chúng tham chiếu lẫn nhau.</span></span>
</a>
<a class="link-card dl" href="https://charity.wtf/2018/09/06/two-key-differences-between-metrics-and-events/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Charity Majors — Chỉ số với sự kiện</span><span class="lc-sub">Lập luận rằng ba trụ cột là một mô hình CHI PHÍ chứ không phải một cách phân loại — đáng đọc đối chiếu với bài này.</span></span>
</a>
</div>
`,
    },

    {
      title: '0.3 — Building the measuring rig|||0.3 — Dựng bộ đồ nghề để đo',
      slug: 'obs-0-3-dung-moi-truong',
      type: 'VIDEO',
      description: 'Bốn công cụ có sẵn trong Node, không cần cài gì, và chúng đủ để tạo ra mọi con số trong khoá này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Building the measuring rig</h2>
<p class="lead">Every measurement in this course was produced with tools that ship inside Node.js. There is no agent to install and no account to create before lesson 1. That matters, because the first thing to learn about observability is how to measure something yourself — otherwise you cannot tell whether the vendor&#39;s dashboard is telling the truth.</p>

<h3>The four built-ins that do all the work</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">process.hrtime.bigint()</span><span class="lz-d">A monotonic nanosecond clock. Unlike <code>Date.now()</code> it cannot go backwards when NTP adjusts the system time, which is why every duration in this course uses it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">perf_hooks.monitorEventLoopDelay()</span><span class="lz-d">A histogram of how late the loop is running. One object, no dependencies, and it is the single most useful number a Node process can report about itself.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">process.memoryUsage()</span><span class="lz-d">RSS, heap used, heap total, external, array buffers. Five numbers that separate &quot;a leak in my code&quot; from &quot;a buffer the runtime is holding&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">process.stdout.writableLength</span><span class="lz-d">How many bytes are queued and not yet written. Obscure, and it is what proves the log-backpressure failure in lesson 1.5.</span></div>
</div>

<h3>A benchmark harness that does not lie to you</h3>
<pre><code class="language-javascript">// bench.mjs — the shape used for every timing in this course
const N = 200_000;

function bench(label, fn) {
  fn();                                    // warm up: let V8 optimise first
  const t = process.hrtime.bigint();       // monotonic, nanoseconds
  for (let i = 0; i &lt; N; i++) fn();
  const ns = Number(process.hrtime.bigint() - t);
  return \`\${label.padEnd(30)} \${(ns / N).toFixed(0).padStart(5)} ns/op\`;
}

console.log(bench('JSON.stringify', () =&gt; JSON.stringify({ a: 1, b: 'x' })));
</code></pre>
<p>Three details make the difference between a benchmark and a number that looks like one. The warm-up call lets V8 compile the function before the clock starts, otherwise you measure the interpreter. The monotonic clock cannot jump. And dividing by <code>N</code> after the loop, rather than timing each iteration, keeps the measurement overhead out of the result — timing 200,000 individual operations costs more than the operations do.</p>

<h3>Verify the rig before trusting it</h3>
<div class="out">$ node --version
v22.22.2

$ node -e "const t=process.hrtime.bigint(); for(let i=0;i&lt;1e7;i++); console.log(Number(process.hrtime.bigint()-t)/1e6+' ms cho 10 triệu vòng lặp rỗng')"
6.02 ms cho 10 triệu vòng lặp rỗng</div>
<p>An empty ten-million-iteration loop taking around 6 ms is the sanity check: it tells you the clock is working, the JIT is on, and a single iteration costs well under a nanosecond — so anything you measure above a few nanoseconds is real work rather than loop overhead.</p>

<div class="pitfall">
<p><strong>Trap — measuring with <code>Date.now()</code> and getting a negative duration.</strong> <code>Date.now()</code> reads the wall clock, and the wall clock is adjusted: NTP steps it, a VM resumes from a snapshot with a stale clock, a container starts before time sync completes. When it steps backwards mid-measurement you get a negative elapsed time, and the usual reaction is to treat it as a glitch and clamp it to zero — which silently discards the exact samples that were taken during a clock jump. Use <code>process.hrtime.bigint()</code> for anything you subtract, and keep <code>Date.now()</code> for timestamps you display. This is also why log lines carry a wall-clock <code>ts</code> but durations are measured separately.</p>
</div>

<h3>What you do not need yet</h3>
<p>No Prometheus, no Grafana, no OpenTelemetry collector, no Sentry account. Those arrive in the chapters that need them, and each one is introduced by first measuring the thing by hand so you can check its output. The rig above is enough for chapters 1 through 5.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">Node.js — perf_hooks</span><span class="lc-sub">monitorEventLoopDelay, performance marks, and the histogram API used throughout this course.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#processmemoryusage" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Node.js — process.memoryUsage()</span><span class="lc-sub">What each of the five numbers means, and which one actually answers &quot;is this a leak?&quot;.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Dựng bộ đồ nghề để đo</h2>
<p class="lead">Mọi phép đo trong khoá này đều được tạo ra bằng những công cụ có sẵn bên trong Node.js. Không có tác nhân nào phải cài và không có tài khoản nào phải tạo trước bài 1. Điều đó quan trọng, vì thứ đầu tiên cần học về quan sát là cách TỰ ĐO một thứ — không thì bạn chẳng biết được bảng theo dõi của nhà cung cấp có đang nói thật hay không.</p>

<h3>Bốn thứ có sẵn lo hết mọi việc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">process.hrtime.bigint()</span><span class="lz-d">Một đồng hồ nano giây đơn điệu. Khác <code>Date.now()</code>, nó không thể chạy lùi khi NTP chỉnh lại giờ hệ thống, và đó là lý do mọi khoảng thời gian trong khoá này đều dùng nó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">perf_hooks.monitorEventLoopDelay()</span><span class="lz-d">Một histogram về việc vòng lặp đang chạy trễ bao nhiêu. Một object, không phụ thuộc gì, và nó là con số hữu ích nhất mà một tiến trình Node báo cáo được về chính nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">process.memoryUsage()</span><span class="lz-d">RSS, heap đã dùng, heap tổng, external, array buffer. Năm con số tách bạch &quot;rò rỉ trong mã của tôi&quot; với &quot;một vùng đệm mà runtime đang giữ&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">process.stdout.writableLength</span><span class="lz-d">Bao nhiêu byte đang xếp hàng mà chưa ghi ra được. Ít người biết, và nó là thứ chứng minh cú hỏng do nghẽn log ở bài 1.5.</span></div>
</div>

<h3>Một khung đo không nói dối bạn</h3>
<pre><code class="language-javascript">// bench.mjs — hình dạng dùng cho mọi phép đo thời gian trong khoá này
const N = 200_000;

function bench(label, fn) {
  fn();                                    // làm nóng: để V8 tối ưu trước đã
  const t = process.hrtime.bigint();       // đơn điệu, nano giây
  for (let i = 0; i &lt; N; i++) fn();
  const ns = Number(process.hrtime.bigint() - t);
  return \`\${label.padEnd(30)} \${(ns / N).toFixed(0).padStart(5)} ns/thao tác\`;
}

console.log(bench('JSON.stringify', () =&gt; JSON.stringify({ a: 1, b: 'x' })));
</code></pre>
<p>Ba chi tiết tạo nên khác biệt giữa một phép đo và một con số trông giống phép đo. Lời gọi làm nóng để V8 biên dịch cái hàm trước khi đồng hồ bắt đầu chạy, không thì bạn đang đo trình thông dịch. Đồng hồ đơn điệu thì không nhảy được. Và việc chia cho <code>N</code> SAU vòng lặp, thay vì bấm giờ từng vòng, giữ cho phần chi phí đo nằm ngoài kết quả — bấm giờ 200.000 thao tác riêng lẻ tốn hơn cả bản thân các thao tác đó.</p>

<h3>Kiểm bộ đồ nghề trước khi tin nó</h3>
<div class="out">$ node --version
v22.22.2

$ node -e "const t=process.hrtime.bigint(); for(let i=0;i&lt;1e7;i++); console.log(Number(process.hrtime.bigint()-t)/1e6+' ms cho 10 triệu vòng lặp rỗng')"
6.02 ms cho 10 triệu vòng lặp rỗng</div>
<p>Một vòng lặp rỗng mười triệu lần mất khoảng 6 ms chính là phép kiểm tỉnh táo: nó cho biết đồng hồ đang chạy, JIT đang bật, và một vòng lặp tốn dưới một nano giây khá xa — nên mọi thứ bạn đo được trên vài nano giây đều là việc thật chứ không phải chi phí vòng lặp.</p>

<div class="pitfall">
<p><strong>Bẫy — đo bằng <code>Date.now()</code> rồi nhận về một khoảng thời gian ÂM.</strong> <code>Date.now()</code> đọc đồng hồ tường, mà đồng hồ tường thì bị chỉnh: NTP đẩy nó đi, một máy ảo hồi phục từ ảnh chụp với giờ cũ, một container khởi động trước khi đồng bộ giờ xong. Khi nó lùi lại giữa chừng phép đo bạn nhận một khoảng thời gian âm, và phản ứng thường thấy là coi đó là trục trặc rồi kẹp về không — việc đó âm thầm vứt đi đúng những mẫu được lấy trong lúc đồng hồ nhảy. Hãy dùng <code>process.hrtime.bigint()</code> cho mọi thứ bạn đem trừ, và để dành <code>Date.now()</code> cho những dấu thời gian bạn hiển thị. Đây cũng là lý do một dòng log mang <code>ts</code> theo đồng hồ tường nhưng thời lượng thì được đo riêng.</p>
</div>

<h3>Thứ bạn CHƯA cần</h3>
<p>Không Prometheus, không Grafana, không collector OpenTelemetry, không tài khoản Sentry. Những thứ đó tới ở đúng chương cần tới chúng, và mỗi cái đều được giới thiệu bằng cách đo thứ đó bằng tay trước, để bạn kiểm chứng được đầu ra của nó. Bộ đồ nghề ở trên là đủ cho chương 1 tới chương 5.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">Node.js — perf_hooks</span><span class="lc-sub">monitorEventLoopDelay, performance mark, và API histogram dùng xuyên suốt khoá này.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#processmemoryusage" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Node.js — process.memoryUsage()</span><span class="lc-sub">Mỗi con số trong năm con số nghĩa là gì, và cái nào thật sự trả lời câu &quot;đây có phải rò rỉ không?&quot;.</span></span>
</a>
</div>
`,
    },

    {
      title: '0.4 — How to study this course|||0.4 — Cách học khoá này',
      slug: 'obs-0-4-cach-hoc',
      type: 'VIDEO',
      description: 'Mỗi khối output ở đây là một lần chạy thật. Cách học đúng là chạy lại và tìm chỗ số của bạn khác số của tôi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to study this course</h2>
<p class="lead">Every <code>out</code> block in these thirteen sections is a real run, on Node 22.22.2, in a sandbox with the commands shown. That is a deliberate constraint, and it changes what studying means: your job is not to memorise the numbers, it is to reproduce them and notice where yours differ.</p>

<h3>The loop, four steps per lesson</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the mechanism before the numbers</span><span class="lz-d">Every measurement here exists to settle a specific question. If you cannot state the question, the number is trivia.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Run it yourself, on your machine</span><span class="lz-d">The scripts are short on purpose. Retyping one takes two minutes and is the difference between recognising an idea and being able to use it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Change one variable and predict first</span><span class="lz-d">Double the payload, halve the sample rate, slow the reader. Say what you expect out loud, then run it — being wrong is the part that teaches.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then break it deliberately</span><span class="lz-d">Fill the disk, kill the log shipper, add a high-cardinality label. Each failure in this course has a reproduction, and meeting it here is cheaper than at 2am.</span></div>
</div>

<h3>Why your numbers will differ, and which differences matter</h3>
<pre><code>Difference                      Expected?  What it means
──────────────────────────────  ─────────  ────────────────────────────────
±30% on any ns/op figure        yes        Different CPU. Ratios still hold.
Event loop p50 above 5 ms       no         Something else is running. Re-run idle.
Pipe slower than file           yes        Measured here too: 201k vs 349k lines/s
Buffered bytes staying at 0     yes        Your reader is fast. Slow it to see the failure.
JSON.stringify faster than 400ns  no       Check you are not measuring a cached string.</code></pre>
<p>Absolute numbers are hardware. Ratios are the lesson. When this course says a timestamp call more than doubles the cost of a log line, that ratio should reproduce on your machine even if both numbers are half of mine — and if it does not, that is a finding worth chasing.</p>

<div class="pitfall">
<p><strong>Trap — reading a measurement and skipping the conditions it was taken under.</strong> &quot;A structured log line costs 571 ns&quot; is true for a five-field object, serialised with <code>JSON.stringify</code>, on this CPU, with the string already built. Change any of those and the number moves — a twenty-field object with a nested error is several times more, and an object containing a <code>Date</code> is more again. This course labels the conditions on every measurement precisely so they travel with the number. When you quote one of these figures later, quote the sentence that says where it came from; a number without its conditions is how a measurement turns into folklore.</p>
</div>

<h3>What you should be able to do at the end</h3>
<p>Take a Node service you did not write, and within an hour: know its p99 latency and error rate, follow a single request through every log line it produced, see the last deploy on the same graph as the errors, and state which of its failures would page a human and which would not. That is the whole objective, and everything in the thirteen sections is aimed at it.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nodejs.org/en/learn/getting-started/profiling" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">Node.js — Profiling a Node application</span><span class="lc-sub">The built-in profiler, for the cases where a measurement tells you something is slow but not which line.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Node.js on Code Lab</span><span class="lc-sub">Drill the runtime fundamentals this course assumes — the event loop, streams and process APIs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cách học khoá này</h2>
<p class="lead">Mọi khối <code>out</code> trong mười ba mục này đều là một lần chạy thật, trên Node 22.22.2, trong một sandbox với đúng những lệnh được hiện ra. Đó là một ràng buộc có chủ đích, và nó làm đổi ý nghĩa của việc học: việc của bạn không phải học thuộc các con số, mà là tái hiện chúng rồi để ý xem chỗ nào số của bạn khác.</p>

<h3>Vòng lặp, bốn bước cho mỗi bài</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc CƠ CHẾ trước khi đọc con số</span><span class="lz-d">Mọi phép đo ở đây tồn tại để dập tắt một câu hỏi cụ thể. Nếu bạn phát biểu không nổi câu hỏi đó thì con số chỉ là chuyện vặt.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tự chạy nó, trên máy của bạn</span><span class="lz-d">Các script được viết ngắn có chủ đích. Gõ lại một cái mất hai phút và là khác biệt giữa việc NHẬN RA một ý tưởng với việc DÙNG được nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đổi một biến số, và ĐOÁN TRƯỚC</span><span class="lz-d">Nhân đôi dữ liệu, giảm nửa tỷ lệ lấy mẫu, làm chậm bên đọc. Hãy nói to ra thứ bạn mong đợi, rồi mới chạy — việc đoán sai mới là phần dạy được bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi cố ý phá nó</span><span class="lz-d">Làm đầy đĩa, giết trình gửi log, thêm một nhãn có cardinality cao. Mỗi cú hỏng trong khoá này đều có cách tái hiện, và gặp nó ở đây rẻ hơn gặp lúc 2 giờ sáng.</span></div>
</div>

<h3>Vì sao số của bạn sẽ khác, và khác chỗ nào thì đáng kể</h3>
<pre><code>Khác biệt                       Dự kiến?   Nó nghĩa là gì
──────────────────────────────  ─────────  ────────────────────────────────
±30% ở mọi con số ns/thao tác   có         CPU khác. Các TỶ LỆ vẫn đúng.
Vòng lặp p50 trên 5 ms          không      Có thứ khác đang chạy. Đo lại lúc rảnh.
Pipe chậm hơn file              có         Ở đây cũng đo được: 201k so với 349k dòng/s
Byte tồn trong đệm luôn bằng 0  có         Bên đọc của bạn nhanh. Hãy làm nó chậm lại.
JSON.stringify nhanh hơn 400ns  không      Kiểm xem bạn có đang đo một chuỗi đã đệm không.</code></pre>
<p>Con số tuyệt đối là chuyện phần cứng. TỶ LỆ mới là bài học. Khi khoá này nói một lời gọi lấy dấu thời gian làm chi phí một dòng log tăng hơn gấp đôi, cái tỷ lệ đó phải tái hiện được trên máy bạn ngay cả khi cả hai con số chỉ bằng một nửa của tôi — và nếu nó không tái hiện được thì đó là một phát hiện đáng đuổi theo.</p>

<div class="pitfall">
<p><strong>Bẫy — đọc một phép đo mà bỏ qua điều kiện nó được đo dưới đó.</strong> &quot;Một dòng log có cấu trúc tốn 571 ns&quot; là đúng với một object năm trường, tuần tự hoá bằng <code>JSON.stringify</code>, trên CPU này, với chuỗi đã dựng sẵn. Đổi bất cứ thứ nào trong số đó là con số dịch đi — một object hai mươi trường có lỗi lồng bên trong thì gấp mấy lần, và một object chứa một <code>Date</code> thì còn hơn nữa. Khoá này ghi rõ điều kiện trên mọi phép đo chính là để chúng đi theo con số. Khi bạn trích lại một trong những con số này về sau, hãy trích cả cái câu nói nó đến từ đâu; một con số tách khỏi điều kiện của nó chính là cách một phép đo biến thành một lời đồn.</p>
</div>

<h3>Học xong bạn phải làm được gì</h3>
<p>Cầm lấy một dịch vụ Node bạn không viết, và trong vòng một tiếng: biết được p99 độ trễ và tỷ lệ lỗi của nó, lần theo một request duy nhất qua mọi dòng log nó sinh ra, thấy được lần deploy gần nhất trên cùng biểu đồ với các lỗi, và phát biểu được cú hỏng nào của nó đáng gọi người dậy còn cú nào thì không. Đó là toàn bộ mục tiêu, và mọi thứ trong mười ba mục đều nhắm vào nó.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nodejs.org/en/learn/getting-started/profiling" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">Node.js — Đo hồ sơ một ứng dụng Node</span><span class="lc-sub">Bộ profiler có sẵn, cho những ca mà phép đo nói có thứ gì đó chậm nhưng không nói là dòng nào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: Node.js trên Code Lab</span><span class="lc-sub">Luyện phần nền tảng runtime mà khoá này giả định — vòng lặp sự kiện, luồng dữ liệu và các API của process.</span></span>
</a>
</div>
`,
    },

    {
      title: '0.5 — Section 0 quiz|||0.5 — Kiểm tra Mục 0',
      slug: 'obs-0-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về ba trụ cột, chi phí, và bộ đồ nghề đo.',
      content: `<div class="ml-en"><span class="eyebrow">Section 0 · Quiz</span><h2>Six questions before chapter 1</h2><p class="lead">Each one has a specific answer stated in section 0. If a question feels ambiguous, the ambiguity is the point — re-read the lesson it came from.</p></div><div class="ml-vi"><span class="eyebrow">Mục 0 · Kiểm tra</span><h2>Sáu câu trước khi vào chương 1</h2><p class="lead">Mỗi câu đều có một đáp án cụ thể đã nêu trong Mục 0. Nếu một câu nghe mập mờ thì chính sự mập mờ đó là điểm mấu chốt — hãy đọc lại bài nó đến từ đó.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'The /health endpoint returns ok and users report the site is broken. What does that combination prove?|||Endpoint /health trả về ok mà người dùng báo trang hỏng. Tổ hợp đó chứng minh điều gì?',
            options: [
              'That the health check verifies something narrower than "the application works" — here, that the process is alive and Postgres answers SELECT 1. Both were true during the stale-build incident while a route returned 404, because nothing in the check knows which routes are mounted.|||Rằng phép kiểm sức khoẻ xác minh một thứ hẹp hơn "ứng dụng chạy được" — ở đây là tiến trình còn sống và Postgres trả lời SELECT 1. Cả hai đều đúng trong sự cố build cũ trong khi một route trả 404, vì chẳng có gì trong phép kiểm biết được route nào đã được gắn.',
              'That the health check is broken and should be rewritten to return 503|||Rằng phép kiểm sức khoẻ bị hỏng và nên viết lại để trả về 503',
              'That the users are wrong, since the server reports healthy|||Rằng người dùng nhầm, vì máy chủ báo là khoẻ mạnh',
              'That Postgres is the component at fault|||Rằng Postgres mới là thành phần có lỗi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need p99 latency for the past week. Which pillar, and why not the others?|||Bạn cần p99 độ trễ của tuần vừa rồi. Trụ cột nào, và vì sao không phải cái khác?',
            options: [
              'A metric — specifically a histogram, whose cost is a few bytes per bucket regardless of traffic. It is derivable from request logs, but that means storing and sorting every request, which is roughly a thousand times more expensive for the same number.|||Chỉ số — cụ thể là một histogram, với chi phí vài byte mỗi ô bất kể lưu lượng. Nó suy ra được từ log request, nhưng như thế nghĩa là phải lưu và sắp xếp mọi request, đắt hơn cỡ một nghìn lần cho cùng một con số.',
              'A log query, since logs already contain every request|||Một truy vấn log, vì log vốn đã chứa mọi request',
              'A trace, since traces record duration|||Một trace, vì trace có ghi lại thời lượng',
              'None of them — p99 must be computed at the load balancer|||Không cái nào — p99 phải được tính ở bộ cân bằng tải',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does this course use process.hrtime.bigint() rather than Date.now() for durations?|||Vì sao khoá này dùng process.hrtime.bigint() thay vì Date.now() cho các khoảng thời gian?',
            options: [
              'Because Date.now() reads the wall clock, which gets adjusted by NTP, VM snapshot restores and container start-up time sync — so a subtraction across an adjustment can return a negative duration, and clamping that to zero silently discards exactly the samples taken during the jump.|||Vì Date.now() đọc đồng hồ tường, thứ bị chỉnh bởi NTP, bởi việc khôi phục ảnh chụp máy ảo và bởi lần đồng bộ giờ lúc container khởi động — nên một phép trừ vắt qua một lần chỉnh có thể trả về khoảng thời gian âm, và kẹp nó về không là âm thầm vứt đi đúng những mẫu được lấy trong lúc nhảy giờ.',
              'Because it has nanosecond resolution and Date.now() only has milliseconds|||Vì nó có độ phân giải nano giây còn Date.now() chỉ có mili giây',
              'Because Date.now() is slower to call|||Vì gọi Date.now() thì chậm hơn',
              'Because Date.now() is deprecated in Node 22|||Vì Date.now() đã bị loại bỏ trong Node 22',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In this repository, 73 route files exist and 16 import the logger. What is the practical consequence?|||Trong kho này có 73 file routes và 16 file có import logger. Hệ quả thực tế là gì?',
            options: [
              'Fifty-seven route files produce no application log line at all, so a failure inside one of them is invisible unless it throws — and even then only the error handler records it, without the request context that would identify which caller or which input triggered it.|||Năm mươi bảy file routes chẳng sinh ra dòng log ứng dụng nào, nên một cú hỏng bên trong một trong số đó là vô hình trừ khi nó ném lỗi — và kể cả khi ném thì cũng chỉ có bộ xử lỗi ghi lại, mà không kèm ngữ cảnh request đủ để biết chỗ gọi nào hay đầu vào nào đã kích hoạt nó.',
              'The other 57 files use console.log instead, which is equivalent|||57 file còn lại dùng console.log thay thế, và như thế là tương đương',
              'Nothing — Express logs every request by default|||Không sao cả — Express mặc định đã log mọi request',
              'Sentry covers the gap automatically|||Sentry tự động lấp chỗ trống đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the "fourth pillar" this section adds, and why does it matter during an incident?|||"Trụ cột thứ tư" mà mục này thêm vào là gì, và vì sao nó quan trọng khi có sự cố?',
            options: [
              'Change events — deploys, config edits, feature flags, migrations. Most incidents are caused by a change, so a vertical line labelled with a commit hash on the same graph as the error rate usually ends the investigation before it starts.|||Sự kiện thay đổi — deploy, sửa cấu hình, bật cờ tính năng, migration. Phần lớn sự cố là do một thay đổi gây ra, nên một đường dọc ghi mã commit nằm trên cùng biểu đồ với tỷ lệ lỗi thường kết thúc cuộc điều tra trước khi nó kịp bắt đầu.',
              'Profiling data from the V8 profiler|||Dữ liệu hồ sơ từ bộ profiler của V8',
              'Uptime checks from an external service|||Các phép kiểm uptime từ một dịch vụ bên ngoài',
              'User session recordings|||Bản ghi phiên làm việc của người dùng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your ns/op numbers are 30% lower than the ones printed in this course. What should you conclude?|||Con số ns/thao tác của bạn thấp hơn 30% so với số in trong khoá này. Bạn nên kết luận gì?',
            options: [
              'Nothing is wrong — absolute timings are a property of the CPU. What must reproduce is the ratios between the measurements; if a timestamp call still more than doubles the cost of a log line on your machine, the lesson holds.|||Chẳng có gì sai — thời gian tuyệt đối là tính chất của CPU. Thứ PHẢI tái hiện được là các tỷ lệ giữa những phép đo; nếu trên máy bạn một lời gọi lấy dấu thời gian vẫn làm chi phí một dòng log tăng hơn gấp đôi thì bài học vẫn đúng.',
              'The benchmark is broken and should be re-run with a larger N|||Phép đo bị hỏng và nên chạy lại với N lớn hơn',
              'Your Node version is too new|||Phiên bản Node của bạn quá mới',
              'The course numbers were fabricated|||Các con số trong khoá là bịa ra',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
