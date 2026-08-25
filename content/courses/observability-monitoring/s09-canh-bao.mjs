/**
 * Observability — Chương 9 — Cảnh báo: một lời hứa sẽ đánh thức ai đó.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 9 — Alerting: a promise to wake someone|||Chương 9 — Cảnh báo: một lời hứa sẽ đánh thức ai đó',
  slug: 'obs-ch9-canh-bao',
  description: 'Ngưỡng suy từ dữ liệu, SLO và ngân sách lỗi, tốc độ đốt, mệt mỏi vì cảnh báo.',
  sortOrder: 10,
  lessons: [
    {
      title: '9.1 — An alert is a promise to wake someone|||9.1 — Một cảnh báo là lời hứa sẽ đánh thức ai đó',
      slug: 'obs-9-1-loi-hua-danh-thuc',
      type: 'VIDEO',
      description: 'Bốn câu hỏi mọi cảnh báo phải trả lời được trước khi nó tồn tại, và vì sao "cảnh báo cho biết" là một mâu thuẫn.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>An alert is a promise to wake someone</h2>
<p class="lead">Chapters 1 through 8 built the ability to see. This chapter is about the much harder question of when to <em>interrupt a person</em> with what you see — and the failure mode is not missing alerts, it is having so many that nobody reads any of them.</p>

<h3>The definition that makes the rest follow</h3>
<pre><code>An alert is a claim that A HUMAN MUST ACT NOW.

Not "something is unusual".
Not "this might be interesting".
Not "for your information".

If nobody needs to do anything in the next few minutes,
it is not an alert. It is a dashboard, a report, or a
log line — all of which are fine, none of which should
make a phone ring at 3am.

The reason this definition is strict: every alert that
does NOT require action teaches the recipient that alerts
do not require action. That training is cumulative and
it is not reversible by adding a "this one is real"
label to the next one.</code></pre>

<h3>The four questions, before the alert exists</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">1. Is a user affected?</span><span class="lz-t">Right now, not hypothetically</span><span class="lz-d">&quot;CPU is at 80%&quot; affects nobody. &quot;12% of requests are failing&quot; affects one user in eight. Alert on the second; graph the first.</span></div>
  <div class="lz-node"><span class="lz-k">2. Is it getting worse?</span><span class="lz-t">Or is it already stable?</span><span class="lz-d">A condition that is bad and steady can wait for morning. A condition that doubled in ten minutes cannot. This is why rate-of-change usually beats a threshold.</span></div>
  <div class="lz-node"><span class="lz-k">3. Is there something to do?</span><span class="lz-t">A specific action, nameable now</span><span class="lz-d">If the runbook would say &quot;wait and see&quot;, the alert should have waited too. An alert with no action is a notification with an alarm attached.</span></div>
  <div class="lz-node"><span class="lz-k">4. Would you want to be woken?</span><span class="lz-t">Personally, at 3am, for this</span><span class="lz-d">The honest test. If the answer is &quot;not really&quot;, route it to a ticket. This is the same question lesson 1.3 asked about the <code>error</code> log level, and the answer must match — an alert and an error level are the same promise made twice.</span></div>
</div>

<h3>Three tiers, and only one of them wakes anybody</h3>
<pre><code>PAGE      Wakes a human immediately. Phone, not Slack.
          Criteria: users are affected AND it is getting
          worse AND there is an action.
          For a one-person project: 0–3 of these should
          exist. If you have twelve, you have zero.

TICKET    Creates work for business hours. Certificate
          expiring in 14 days, disk 80% full, an error
          rate that is elevated but stable.
          The condition is real; the urgency is not.

DASHBOARD Nothing is sent. You look when you look.
          Latency percentiles, memory trend, request rate.
          Most of what you built in chapters 4 and 5
          belongs here — and that is not a failure, it is
          the point. Context is not an alarm.</code></pre>

<h3>What actually deserves a page, for this repository</h3>
<pre><code>1. The site is unreachable from outside.
   Lesson 8.5's external check failing from two locations.
   Everything else is a detail; this one is the product
   being down.

2. Error rate above a burn-rate threshold (lesson 9.3).
   Not "any 5xx" — a rate that will exhaust the month's
   budget in hours.

3. Postgres is unreachable from the backend.
   Every feature depends on it, and it is the one
   dependency with no fallback.

That is three. Everything else — event loop lag, memory,
GC, pool waits, disk, certificate expiry — is a ticket or
a dashboard, because none of them is both user-affecting
and urgent at the moment it crosses a line.</code></pre>

<h3>The alert that should exist and usually does not</h3>
<pre><code class="language-promql"># Traffic has STOPPED. The failure lesson 4.5 measured:
# every system metric goes green when nobody can reach you.
sum(rate(http_requests_total[5m])) &lt; 0.1

# ...and the business version, which is stronger:
sum(rate(logins_total{outcome="success"}[15m])) == 0</code></pre>
<pre><code>Why this one is special:

  Every other alert fires when a number goes UP. This one
  fires when a number goes to ZERO — and zero is exactly
  what a broken frontend, a DNS misconfiguration, an
  expired certificate and a Cloudflare origin failure all
  look like from inside your backend.

  It is also the alert most likely to false-fire at 4am on
  a low-traffic service, which is why the login version is
  better: pick a window long enough that a genuine quiet
  period does not trip it. For this repo, 15 minutes with
  zero successful logins is a real signal at any hour.</code></pre>

<h3>What every alert must carry</h3>
<pre><code class="language-yaml">- alert: HighErrorBurnRate
  expr: |
    sum(rate(http_requests_total{code=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h])) &gt; 0.0144
  for: 5m                                  # ← must persist, not a spike
  labels:
    severity: page
  annotations:
    summary: "5xx burn rate 14.4× — 2% of the monthly budget in 1 hour"
    # WHAT IS BROKEN, in the first line, readable on a lock screen
    dashboard: "https://grafana.../d/api-overview"
    runbook:   "https://github.com/.../RUNBOOK.md#high-error-rate"
    query:     '{container="cuonghoangdev_backend", level="error"}'</code></pre>
<pre><code>The &#96;for: 5m&#96; is not decoration. Without it, a single scrape
that catches a deploy restart pages you. With it, the
condition must hold across several evaluations — which
filters out exactly the transients you do not want to be
woken for.

And the annotations exist because of when they are read:
half-awake, on a phone, in the dark. A link to the dashboard
and one to the runbook are worth more than a precise
description of the metric.</code></pre>

<div class="pitfall">
<p><strong>Trap — the alert you silence &quot;just for tonight&quot; is the one that is still silenced during the next real incident.</strong> Muting is a two-second action with no expiry, no owner and no reminder, and the condition that made it noisy — a threshold set slightly too tight — never gets fixed because the noise stopped. Six months later nobody remembers the mute exists, the same alert has genuine cause to fire, and it does not. <strong>The specific harm is that the postmortem records &quot;we had no alerting for this&quot; when in fact you had excellent alerting that was turned off by someone being reasonable at 2am.</strong> Every silence needs an expiry time and a note saying what must change before it lapses — and if your tooling cannot express that, a recurring calendar entry listing every muted alert is a crude fix that works.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🔔</span>
  <span class="lc-body"><span class="lc-title">Google SRE Workbook — alerting on SLOs</span><span class="lc-sub">The argument for alerting on user-visible symptoms rather than causes, and the multi-window approach lesson 9.3 measures.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Prometheus — alerting rules</span><span class="lc-sub">The expr / for / labels / annotations structure above, and how the &quot;for&quot; duration interacts with evaluation intervals.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Một cảnh báo là lời hứa sẽ đánh thức ai đó</h2>
<p class="lead">Chương 1 tới 8 đã dựng ra khả năng NHÌN. Chương này nói về câu hỏi khó hơn nhiều: khi nào thì được <em>NGẮT một con người</em> bằng cái bạn nhìn thấy — và kiểu hỏng ở đây không phải thiếu cảnh báo, mà là có nhiều tới mức chẳng ai đọc cái nào.</p>

<h3>Cái định nghĩa làm mọi thứ còn lại suy ra được</h3>
<pre><code>Một cảnh báo là một lời khẳng định rằng MỘT CON NGƯỜI PHẢI
HÀNH ĐỘNG NGAY BÂY GIỜ.

Không phải "có gì đó bất thường".
Không phải "cái này có thể thú vị".
Không phải "để anh biết".

Nếu chẳng ai cần làm gì trong vài phút tới thì nó không phải
một cảnh báo. Nó là một bảng theo dõi, một báo cáo, hay một
dòng log — cả ba đều ổn, và không cái nào nên làm một cái
điện thoại reo lúc 3 giờ sáng.

Lý do định nghĩa này khắt khe: mọi cảnh báo KHÔNG đòi hỏi hành
động đều đang dạy người nhận rằng cảnh báo thì không đòi hỏi
hành động. Sự huấn luyện ấy tích luỹ dần và nó không đảo ngược
được bằng cách gắn nhãn "cái này là thật đấy" lên cái kế tiếp.</code></pre>

<h3>Bốn câu hỏi, trước khi cái cảnh báo tồn tại</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">1. Có người dùng nào bị ảnh hưởng không?</span><span class="lz-t">Ngay bây giờ, không phải giả định</span><span class="lz-d">&quot;CPU ở mức 80%&quot; chẳng ảnh hưởng tới ai. &quot;12% số request đang hỏng&quot; ảnh hưởng tới một trên tám người dùng. Hãy cảnh báo theo cái thứ hai; vẽ đồ thị cho cái thứ nhất.</span></div>
  <div class="lz-node"><span class="lz-k">2. Nó có đang tệ thêm không?</span><span class="lz-t">Hay là đã ổn định rồi?</span><span class="lz-d">Một tình trạng tệ mà đứng yên thì chờ tới sáng được. Một tình trạng tăng gấp đôi trong mười phút thì không. Đây là lý do TỐC ĐỘ THAY ĐỔI thường hơn hẳn một cái ngưỡng.</span></div>
  <div class="lz-node"><span class="lz-k">3. Có việc gì để làm không?</span><span class="lz-t">Một hành động cụ thể, gọi tên được ngay lúc này</span><span class="lz-d">Nếu cuốn sổ tay sẽ nói &quot;chờ xem sao&quot; thì cái cảnh báo lẽ ra cũng đã nên chờ. Một cảnh báo không có hành động là một thông báo gắn thêm cái còi.</span></div>
  <div class="lz-node"><span class="lz-k">4. Bạn có MUỐN bị đánh thức không?</span><span class="lz-t">Đích thân, lúc 3 giờ sáng, vì cái này</span><span class="lz-d">Phép thử trung thực. Nếu câu trả lời là &quot;cũng không hẳn&quot; thì hãy chuyển nó thành một cái phiếu. Đây đúng là câu hỏi mà bài 1.3 đã hỏi về mức log <code>error</code>, và câu trả lời phải khớp — một cảnh báo và một mức lỗi là cùng một lời hứa nói ra hai lần.</span></div>
</div>

<h3>Ba bậc, và chỉ một bậc đánh thức ai đó</h3>
<pre><code>GỌI DẬY   Đánh thức một con người ngay. Điện thoại, không phải Slack.
          Tiêu chí: có người dùng bị ảnh hưởng VÀ nó đang tệ thêm
          VÀ có một hành động để làm.
          Với một dự án một người: nên tồn tại 0–3 cái loại này.
          Nếu bạn có mười hai cái thì bạn đang có không cái nào.

PHIẾU     Tạo việc cho giờ hành chính. Chứng chỉ hết hạn sau 14
          ngày, đĩa đầy 80%, một tỉ lệ lỗi cao hơn bình thường
          nhưng ổn định.
          Tình trạng là có thật; sự khẩn cấp thì không.

BẢNG      Không gửi gì cả. Bạn nhìn khi bạn nhìn.
          Phân vị độ trễ, xu hướng bộ nhớ, tốc độ request. Phần
          lớn thứ bạn dựng ở chương 4 và 5 thuộc về đây — và đó
          không phải một thất bại, đó là mấu chốt. NGỮ CẢNH KHÔNG
          PHẢI LÀ BÁO ĐỘNG.</code></pre>

<h3>Cái gì thật sự xứng đáng gọi dậy, với kho này</h3>
<pre><code>1. Trang không với tới được từ bên ngoài.
   Phép kiểm bên ngoài ở bài 8.5 trượt từ hai vị trí. Mọi thứ
   khác là chi tiết; cái này là sản phẩm đang chết.

2. Tỉ lệ lỗi vượt một ngưỡng tốc-độ-đốt (bài 9.3).
   Không phải "có 5xx nào" — mà là một tốc độ sẽ cạn ngân sách
   của cả tháng trong vài giờ.

3. Backend không với tới được Postgres.
   Mọi tính năng đều phụ thuộc vào nó, và nó là phụ thuộc duy
   nhất không có đường lùi.

Hết ba. Mọi thứ khác — độ trễ vòng lặp, bộ nhớ, GC, chờ bể, đĩa,
chứng chỉ hết hạn — là phiếu hoặc bảng, vì không cái nào vừa
ảnh-hưởng-người-dùng vừa khẩn cấp ngay tại cái khoảnh khắc nó
vượt một lằn ranh.</code></pre>

<h3>Cái cảnh báo lẽ ra phải có mà thường thì không có</h3>
<pre><code class="language-promql"># Lưu lượng đã DỪNG. Cú hỏng mà bài 4.5 đo được:
# mọi chỉ số hệ thống đều xanh khi không ai với tới được bạn.
sum(rate(http_requests_total[5m])) &lt; 0.1

# ...và bản nghiệp vụ, mạnh hơn:
sum(rate(logins_total{outcome="success"}[15m])) == 0</code></pre>
<pre><code>Vì sao cái này đặc biệt:

  Mọi cảnh báo khác đều nổ khi một con số ĐI LÊN. Cái này nổ khi
  một con số về KHÔNG — mà số không lại đúng là bộ dạng của một
  frontend hỏng, một cấu hình DNS sai, một chứng chỉ hết hạn và
  một cú Cloudflare đánh dấu origin chết, khi nhìn từ bên trong
  backend của bạn.

  Nó cũng là cái cảnh báo dễ báo động giả nhất vào 4 giờ sáng
  trên một dịch vụ ít lưu lượng, và đó là lý do bản đăng nhập tốt
  hơn: hãy chọn một cửa sổ đủ dài để một quãng vắng thật sự không
  làm nó nổ. Với kho này, mười lăm phút không một lần đăng nhập
  thành công là một tín hiệu thật vào bất cứ giờ nào.</code></pre>

<h3>Mọi cảnh báo phải mang theo những gì</h3>
<pre><code class="language-yaml">- alert: HighErrorBurnRate
  expr: |
    sum(rate(http_requests_total{code=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h])) &gt; 0.0144
  for: 5m                                  # ← phải kéo dài, không phải một cái gai
  labels:
    severity: page
  annotations:
    summary: "tốc độ đốt 5xx 14,4× — 2% ngân sách tháng trong 1 giờ"
    # CÁI GÌ ĐANG HỎNG, ngay dòng đầu, đọc được trên màn hình khoá
    dashboard: "https://grafana.../d/api-overview"
    runbook:   "https://github.com/.../RUNBOOK.md#high-error-rate"
    query:     '{container="cuonghoangdev_backend", level="error"}'</code></pre>
<pre><code>Cái &#96;for: 5m&#96; không phải trang trí. Không có nó, một lượt quét
duy nhất chộp trúng một lần khởi động lại lúc deploy sẽ gọi bạn
dậy. Có nó, cái điều kiện phải giữ được qua vài lượt đánh giá —
và điều đó lọc bỏ đúng những thứ thoáng qua mà bạn không muốn bị
đánh thức vì chúng.

Còn phần annotation tồn tại vì cái lúc chúng được đọc: nửa tỉnh
nửa mê, trên một cái điện thoại, trong bóng tối. Một đường dẫn
tới bảng theo dõi và một tới cuốn sổ tay có giá trị hơn một mô tả
chính xác về cái chỉ số.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cái cảnh báo bạn tắt tiếng &quot;chỉ đêm nay thôi&quot; chính là cái vẫn còn bị tắt tiếng trong lần sự cố thật kế tiếp.</strong> Tắt tiếng là một thao tác hai giây, không hạn kết thúc, không người chịu trách nhiệm, không lời nhắc, và cái điều kiện làm nó ồn ào — một cái ngưỡng đặt hơi chặt quá — thì không bao giờ được chữa vì tiếng ồn đã tắt. Sáu tháng sau chẳng ai còn nhớ cái lệnh tắt tiếng ấy tồn tại, cùng cái cảnh báo đó có lý do thật để nổ, và nó không nổ. <strong>Cái hại cụ thể là bản kiểm điểm sự cố ghi lại &quot;chúng ta không có cảnh báo cho chuyện này&quot; trong khi thật ra bạn có một cảnh báo xuất sắc mà một người rất biết điều đã tắt nó đi lúc 2 giờ sáng.</strong> Mọi lần tắt tiếng đều cần một thời hạn và một ghi chú nói rõ cái gì phải thay đổi trước khi nó hết hạn — và nếu công cụ của bạn không diễn đạt được điều đó thì một sự kiện lịch lặp lại liệt kê mọi cảnh báo đang tắt là một cách chữa thô mà chạy được.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🔔</span>
  <span class="lc-body"><span class="lc-title">Sách bài tập SRE của Google — cảnh báo theo SLO</span><span class="lc-sub">Lý lẽ cho việc cảnh báo theo triệu chứng người dùng thấy được chứ không theo nguyên nhân, và cách tiếp cận nhiều-cửa-sổ mà bài 9.3 đem ra đo.</span></span>
</a>
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Prometheus — luật cảnh báo</span><span class="lc-sub">Cấu trúc expr / for / labels / annotations ở trên, và cách khoảng thời gian &quot;for&quot; tương tác với chu kỳ đánh giá.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '9.2 — Thresholds you derive instead of guess|||9.2 — Ngưỡng suy ra được thay vì đoán mò',
      slug: 'obs-9-2-nguong-suy-ra',
      type: 'VIDEO',
      description: 'Vì sao "p99 > 500ms" là con số của người khác, và ba cách rút một ngưỡng ra khỏi chính dữ liệu của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Thresholds you derive instead of guess</h2>
<p class="lead">Almost every alert threshold in existence was copied from somewhere. &quot;p99 above 500 ms&quot;, &quot;memory above 80%&quot;, &quot;error rate above 1%&quot; — round numbers, no provenance. This lesson is three ways to produce a number that belongs to <em>your</em> system.</p>

<h3>Why a copied threshold is worse than none</h3>
<pre><code>Take "alert when p99 &gt; 500ms" against the distribution
measured in lesson 4.2:

  p50 15.2ms · p95 21.7ms · p99 989.4ms

  The alert is ALREADY FIRING. It has been firing since
  the day it was created, because 989 &gt; 500, and 989 is
  this service's NORMAL p99.

  Two outcomes, both bad:
    · It gets muted (lesson 9.1's pitfall), permanently.
    · Or the threshold is raised to 1200ms to stop the
      noise — a number now chosen by "make the alert stop"
      rather than by anything about users.

A threshold with no derivation cannot be defended, cannot
be tuned, and cannot be explained to the next person. It
is a number with a superstition attached.</code></pre>

<h3>Method 1 — from the data you already have</h3>
<pre><code class="language-promql"># Measure two weeks of normal operation, then set the
# threshold above the worst NORMAL value, not above zero.

# What was p99 latency, hour by hour, over 14 days?
quantile_over_time(0.99,
  histogram_quantile(0.99,
    sum by (le) (rate(http_request_duration_seconds_bucket[5m])))[14d:1h])</code></pre>
<pre><code>Say that returns 1.31s as the worst hour in two weeks,
with a typical hour around 0.99s.

  threshold = worst normal × 1.5  = ~2.0s

  · Below the worst normal → it fires on Tuesdays.
  · At exactly the worst normal → it fires roughly
    monthly, on nothing.
  · 1.5× above → it fires when something genuinely
    changed shape.

Now the alert has a derivation you can write in the
annotation: "1.5× the worst hour observed in the two weeks
before 2026-08-25, when p99 peaked at 1.31s."

Six months later, that sentence is what lets someone
decide whether the number is still right.</code></pre>

<h3>Method 2 — from what the user will tolerate</h3>
<pre><code>Sometimes the data is the wrong source, because the
current behaviour is not acceptable in the first place.

  "A note must save in under 1 second, or people
   type over the top of a save that has not landed."

  → threshold 1s, regardless of what p99 is today.
  → and today's p99 of 989ms means you are one bad
    day away from breaking that promise, which is
    itself worth knowing.

The difference between the two methods:

  From data:  "alert me when this changes"
  From users: "alert me when this is WRONG"

Use the second wherever you can state the requirement.
Use the first everywhere you cannot — which is most
places, honestly, and that is fine.</code></pre>

<h3>Method 3 — rate of change, when the level is meaningless</h3>
<pre><code class="language-promql"># RSS climbing is normal (lesson 5.2). "RSS &gt; 400MB" is
# meaningless without knowing the limit and the history.
# What matters is the SLOPE:

# Predict: will memory hit the container limit within 4 hours?
predict_linear(process_resident_memory_bytes[1h], 4*3600)
  &gt; container_memory_limit_bytes

# Same idea for disk — the failure this repo has already had:
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) &lt; 0</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It alerts before the wall, not at it</span><span class="lz-d">Four hours of warning on memory is enough to restart deliberately at a chosen moment instead of being OOM-killed mid-request.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It works without knowing what &quot;normal&quot; is</span><span class="lz-d">A service that normally sits at 200 MB and one that sits at 2 GB use the same rule. The threshold is the limit, which you already know.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It does not fire on a healthy sawtooth</span><span class="lz-d">Lesson 5.2's rising-then-collected pattern has a slope near zero over an hour. Only a genuine leak produces a positive trend that persists.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The disk version would have caught a real outage</span><span class="lz-d">18/08/2026, a deploy died with &quot;no space left on device&quot; as the disk fell to 1.8 GB during a build. A six-hour trend would have said so the previous evening.</span></div>
</div>

<h3>Percentages are a trap; use both numbers</h3>
<pre><code>❌ error_rate &gt; 1%

   At 500 rps  → 5 failures/second. Serious.
   At 0.5 rps  → one request failed. Nothing.

   Same alert, same percentage, opposite meanings. And the
   low-traffic case fires constantly at 4am, which is
   exactly when nobody should be woken for one request.

✅ Require both a rate and a count:

   sum(rate(http_requests_total{code=~"5.."}[5m])) / 
   sum(rate(http_requests_total[5m])) &gt; 0.01
   AND
   sum(rate(http_requests_total{code=~"5.."}[5m])) &gt; 0.1

   The second clause means "at least 6 failures per minute".
   Below that, the percentage is noise regardless of how
   large it looks.</code></pre>

<h3>The threshold review, which nobody schedules</h3>
<pre><code>Every threshold decays, because the system it describes
changes and the number does not.

  · Traffic grew 10× → your absolute count thresholds
    are now trivially exceeded.
  · You made the API faster → the latency threshold no
    longer catches a regression that lands well inside it.
  · You added caching → p50 dropped, p99 did not, and
    the gap alert from lesson 4.2 now fires constantly.

Once a quarter, for each alert, ask two questions:

  1. Has this fired? If never in six months, it is either
     perfectly tuned or dead. Test it deliberately and
     find out which.
  2. When it fired, did someone act? If every firing
     ended in "acknowledged, no action", it is not a
     page — demote it to a ticket.

An alert that has never fired and an alert that always
fires are the same amount of information: none.</code></pre>

<div class="pitfall">
<p><strong>Trap — a threshold derived from the last two weeks encodes whatever was broken during those two weeks.</strong> The method-1 query is honest about what the system <em>did</em>, not about what it <em>should</em> do — so if a slow query was live for that fortnight, the &quot;worst normal&quot; already includes it, the threshold is set above it, and the alert will now never fire for that class of problem again. The failure is self-sealing: <strong>the worse your service was during the sampling window, the more permissive the alert you derive, and the derivation looks equally rigorous either way.</strong> Before trusting a percentile you pulled from history, look at the graph over the same window and ask whether you would have been happy with it. If the answer is no, method 2 is the one to use — a number from a requirement is the only kind that does not inherit yesterday's bugs.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Prometheus — predict_linear and deriv</span><span class="lc-sub">The trend functions behind method 3, including how the range you pass changes how twitchy the prediction is.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/practical-alerting/" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — practical alerting</span><span class="lc-sub">How thresholds are chosen and reviewed in practice, and why alerting on causes rather than symptoms multiplies the number of rules.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Ngưỡng suy ra được thay vì đoán mò</h2>
<p class="lead">Gần như mọi ngưỡng cảnh báo đang tồn tại đều được chép từ đâu đó. &quot;p99 trên 500 ms&quot;, &quot;bộ nhớ trên 80%&quot;, &quot;tỉ lệ lỗi trên 1%&quot; — số tròn trịa, không rõ nguồn gốc. Bài này là ba cách tạo ra một con số thuộc về <em>hệ thống của bạn</em>.</p>

<h3>Vì sao một ngưỡng đi chép còn tệ hơn là không có</h3>
<pre><code>Hãy lấy "cảnh báo khi p99 &gt; 500ms" đặt cạnh cái phân bố đo được
ở bài 4.2:

  p50 15,2ms · p95 21,7ms · p99 989,4ms

  Cái cảnh báo ĐANG NỔ SẴN. Nó nổ từ cái ngày nó được tạo ra, vì
  989 &gt; 500, mà 989 chính là p99 BÌNH THƯỜNG của dịch vụ này.

  Hai kết cục, cả hai đều tệ:
    · Nó bị tắt tiếng (cái bẫy ở bài 9.1), vĩnh viễn.
    · Hoặc cái ngưỡng được nâng lên 1200ms để dập tiếng ồn —
      một con số giờ được chọn theo tiêu chí "làm cho cảnh báo
      im đi" chứ không theo bất cứ điều gì về người dùng.

Một cái ngưỡng không có nguồn gốc thì không bảo vệ được, không
chỉnh được, và không giải thích được cho người kế tiếp. Nó là một
con số kèm theo một niềm mê tín.</code></pre>

<h3>Cách 1 — từ chính dữ liệu bạn đang có</h3>
<pre><code class="language-promql"># Đo hai tuần vận hành bình thường, rồi đặt ngưỡng trên cái giá
# trị BÌNH THƯỜNG tệ nhất, chứ không phải trên số không.

# p99 độ trễ theo từng giờ, suốt 14 ngày, là bao nhiêu?
quantile_over_time(0.99,
  histogram_quantile(0.99,
    sum by (le) (rate(http_request_duration_seconds_bucket[5m])))[14d:1h])</code></pre>
<pre><code>Giả sử nó trả về 1,31s là giờ tệ nhất trong hai tuần, với một giờ
điển hình quanh 0,99s.

  ngưỡng = bình thường tệ nhất × 1,5  = ~2,0s

  · Dưới mức bình thường tệ nhất → nó nổ vào các thứ Ba.
  · Đúng bằng mức bình thường tệ nhất → nó nổ khoảng mỗi tháng
    một lần, vì chẳng có gì.
  · Cao hơn 1,5 lần → nó nổ khi có thứ gì đó thật sự đổi hình dạng.

Giờ cái cảnh báo đã có một nguồn gốc mà bạn viết được vào phần
annotation: "gấp 1,5 lần cái giờ tệ nhất quan sát được trong hai
tuần trước ngày 25/08/2026, khi p99 đạt đỉnh 1,31s."

Sáu tháng sau, chính cái câu đó là thứ cho phép ai đó quyết định
xem con số ấy còn đúng không.</code></pre>

<h3>Cách 2 — từ mức mà người dùng chịu được</h3>
<pre><code>Đôi khi dữ liệu là nguồn SAI, vì hành vi hiện tại vốn dĩ đã không
chấp nhận được ngay từ đầu.

  "Một ghi chú phải lưu xong trong dưới 1 giây, không thì người
   ta gõ đè lên một lần lưu chưa kịp đáp."

  → ngưỡng 1s, bất kể hôm nay p99 là bao nhiêu.
  → và cái p99 989ms của hôm nay nghĩa là bạn chỉ cách một ngày
    xấu trời là phá vỡ lời hứa đó, mà tự nó cũng đáng biết.

Khác biệt giữa hai cách:

  Từ dữ liệu:    "báo cho tôi khi cái này ĐỔI"
  Từ người dùng: "báo cho tôi khi cái này SAI"

Hãy dùng cách thứ hai ở mọi chỗ bạn nêu được yêu cầu. Dùng cách
thứ nhất ở mọi chỗ bạn không nêu được — mà nói thật là phần lớn
các chỗ, và như thế cũng ổn.</code></pre>

<h3>Cách 3 — tốc độ thay đổi, khi mức tuyệt đối vô nghĩa</h3>
<pre><code class="language-promql"># RSS leo lên là bình thường (bài 5.2). "RSS &gt; 400MB" là vô nghĩa
# nếu chưa biết hạn mức và lịch sử. Cái quan trọng là ĐỘ DỐC:

# Dự đoán: bộ nhớ có chạm hạn mức container trong 4 giờ tới không?
predict_linear(process_resident_memory_bytes[1h], 4*3600)
  &gt; container_memory_limit_bytes

# Cùng ý đó cho đĩa — cú hỏng mà kho này đã dính rồi:
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) &lt; 0</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó cảnh báo TRƯỚC bức tường, không phải lúc đâm vào</span><span class="lz-d">Bốn giờ báo trước về bộ nhớ là đủ để khởi động lại một cách có chủ ý vào một thời điểm bạn chọn, thay vì bị OOM giết giữa một request.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó chạy được mà không cần biết &quot;bình thường&quot; là gì</span><span class="lz-d">Một dịch vụ bình thường ở 200 MB và một cái ở 2 GB dùng chung một luật. Cái ngưỡng chính là hạn mức, thứ bạn vốn đã biết.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó không nổ vì một cái răng cưa khoẻ mạnh</span><span class="lz-d">Cái hình leo-rồi-được-thu-gom ở bài 5.2 có độ dốc gần bằng không trên khoảng một giờ. Chỉ một chỗ rò rỉ thật mới tạo ra một xu hướng dương kéo dài.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bản dành cho đĩa lẽ ra đã bắt được một sự cố có thật</span><span class="lz-d">18/08/2026, một lần deploy chết với &quot;no space left on device&quot; khi đĩa tụt xuống còn 1,8 GB giữa lúc dựng. Một xu hướng sáu giờ lẽ ra đã nói điều đó từ tối hôm trước.</span></div>
</div>

<h3>Phần trăm là một cái bẫy; hãy dùng cả hai con số</h3>
<pre><code>❌ error_rate &gt; 1%

   Ở 500 rps  → 5 cú hỏng mỗi giây. Nghiêm trọng.
   Ở 0,5 rps  → một request hỏng. Chẳng là gì.

   Cùng một cảnh báo, cùng một phần trăm, hai ý nghĩa ngược nhau.
   Và trường hợp ít lưu lượng thì nổ liên tục vào 4 giờ sáng, mà
   đó đúng là lúc không ai nên bị đánh thức vì một cái request.

✅ Hãy đòi cả một TỈ LỆ lẫn một SỐ ĐẾM:

   sum(rate(http_requests_total{code=~"5.."}[5m])) / 
   sum(rate(http_requests_total[5m])) &gt; 0.01
   VÀ
   sum(rate(http_requests_total{code=~"5.."}[5m])) &gt; 0.1

   Mệnh đề thứ hai nghĩa là "ít nhất 6 cú hỏng mỗi phút". Dưới
   mức đó thì cái phần trăm chỉ là tiếng ồn, bất kể nó trông to
   tới đâu.</code></pre>

<h3>Buổi rà soát ngưỡng mà chẳng ai đặt lịch</h3>
<pre><code>Mọi cái ngưỡng đều suy tàn, vì cái hệ thống nó mô tả thì đổi còn
con số thì không.

  · Lưu lượng tăng 10 lần → các ngưỡng theo SỐ ĐẾM tuyệt đối của
    bạn giờ bị vượt qua một cách tầm thường.
  · Bạn làm API nhanh hơn → cái ngưỡng độ trễ giờ không bắt được
    một cú tụt hiệu năng nằm gọn bên trong nó.
  · Bạn thêm bộ nhớ đệm → p50 tụt, p99 thì không, và cái cảnh báo
    khoảng-cách ở bài 4.2 giờ nổ liên tục.

Mỗi quý một lần, với từng cảnh báo, hãy hỏi hai câu:

  1. Cái này đã nổ chưa? Nếu sáu tháng chưa nổ lần nào thì hoặc nó
     được chỉnh hoàn hảo, hoặc nó đã chết. Hãy thử nó một cách có
     chủ ý để biết là cái nào.
  2. Khi nó nổ, có ai hành động không? Nếu mọi lần nổ đều kết thúc
     bằng "đã xác nhận, không hành động" thì nó không phải một cái
     gọi-dậy — hãy hạ nó xuống thành một cái phiếu.

Một cảnh báo chưa từng nổ và một cảnh báo lúc nào cũng nổ mang
cùng một lượng thông tin: không có gì.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một cái ngưỡng suy ra từ hai tuần vừa rồi sẽ mã hoá luôn bất cứ thứ gì đã hỏng trong hai tuần ấy.</strong> Câu truy vấn ở cách 1 trung thực về việc hệ thống <em>ĐÃ LÀM</em> gì, không trung thực về việc nó <em>NÊN LÀM</em> gì — nên nếu một truy vấn chậm đã sống suốt hai tuần đó thì cái &quot;bình thường tệ nhất&quot; vốn đã bao gồm nó, ngưỡng được đặt cao hơn nó, và cái cảnh báo giờ sẽ không bao giờ nổ cho lớp vấn đề đó nữa. Cú hỏng này tự bịt kín lấy mình: <strong>dịch vụ của bạn càng tệ trong cửa sổ lấy mẫu thì cái cảnh báo bạn suy ra càng dễ dãi, và phép suy ra thì trông chặt chẽ y hệt nhau trong cả hai trường hợp.</strong> Trước khi tin một cái phân vị bạn kéo ra từ lịch sử, hãy nhìn đồ thị trên đúng cửa sổ đó và tự hỏi bạn có hài lòng với nó không. Nếu câu trả lời là không thì cách 2 mới là cách nên dùng — một con số đến từ một YÊU CẦU là loại duy nhất không thừa hưởng lỗi của ngày hôm qua.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Prometheus — predict_linear và deriv</span><span class="lc-sub">Các hàm xu hướng đằng sau cách 3, kể cả việc khoảng thời gian bạn truyền vào làm cho dự đoán nhạy hay lì tới mức nào.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/practical-alerting/" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — cảnh báo trong thực tế</span><span class="lc-sub">Ngưỡng được chọn và rà soát thế nào trong thực tế, và vì sao cảnh báo theo nguyên nhân thay vì theo triệu chứng làm số luật nhân lên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '9.3 — SLO, error budget, burn rate|||9.3 — SLO, ngân sách lỗi, tốc độ đốt',
      slug: 'obs-9-3-slo-va-toc-do-dot',
      type: 'VIDEO',
      description: 'Tính thật: SLO 99,9% cho bạn 43 phút chết mỗi tháng. Và vì sao cảnh báo theo TỐC ĐỘ ĐỐT chỉ cần hai luật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>SLO, error budget, burn rate</h2>
<p class="lead">Lesson 9.2 derived thresholds from data and from requirements. This lesson is the third source, and the most useful one: a single number about what you promised, from which every alert threshold follows arithmetically.</p>

<h3>The three terms, defined once</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">SLI</span><span class="lz-t">The measurement</span><span class="lz-d">&quot;Fraction of requests that return non-5xx in under 1 second.&quot; A number between 0 and 1, computed from metrics you already have.</span></div>
  <div class="lz-node"><span class="lz-k">SLO</span><span class="lz-t">The target</span><span class="lz-d">&quot;That fraction is at least 99.9%, measured over 30 days.&quot; A choice, not a measurement — and the only number in this lesson you have to decide.</span></div>
  <div class="lz-node"><span class="lz-k">Error budget</span><span class="lz-t">What the target permits</span><span class="lz-d">100% − 99.9% = 0.1%. Over 30 days that is a specific number of minutes, and it is the thing you spend.</span></div>
</div>

<h3>What each SLO actually costs you, measured</h3>
<pre><code class="language-javascript">// m18.mjs — minutes of downtime each target permits
const MIN = 30*24*60;                    // minutes in 30 days
for (const slo of [0.99, 0.995, 0.999, 0.9995, 0.9999]) {
  const budget = MIN * (1 - slo);
  // ...per 30 days, per day, per hour
}
</code></pre>
<div class="out">$ node m18.mjs
SLO       thời gian chết được phép trong 30 ngày   trong 1 ngày   trong 1 giờ
  99.00%                      7.2 giờ        14 phút       36 giây
  99.50%                      3.6 giờ         7 phút       18 giây
  99.90%                      43 phút         1 phút        4 giây
  99.95%                      22 phút        43 giây        2 giây
  99.99%                       4 phút         9 giây        0 giây</div>
<pre><code>Read the 99.9% row against how this repository is operated:

  43 minutes per month. Deploys happen from a laptop by
  running deploy-nha.sh. A container restart is seconds,
  but a bad deploy that needs a rollback is easily ten
  minutes — which is a quarter of the month's budget for
  ONE bad deploy.

Now read 99.99%: four minutes per month, total, including
every deploy, every Postgres restart, every VPS reboot.
That target is not achievable on one VPS with manual
deploys, and choosing it anyway means the SLO is decoration.

For this repository, 99.5% (3.6 hours/month) is honest and
99.9% is ambitious. Picking the number you can actually
hold is the whole point — an SLO you routinely miss tells
you nothing when you miss it.</code></pre>

<h3>Burn rate: the one idea that makes alerting simple</h3>
<pre><code>Burn rate = how fast you are spending the budget,
            relative to spending it exactly evenly.

  burn rate 1×  → you will use exactly the budget in 30 days
  burn rate 10× → you will use it all in 3 days
  burn rate 1000× → you will use it all in 43 minutes</code></pre>
<div class="out">$ node m18.mjs
(SLO 99,9% → ngân sách = 0,1% số request)
tỉ lệ lỗi   hệ số đốt   cạn ngân sách sau
     0.1%          1×            30.0 ngày
     0.2%          2×            15.0 ngày
     0.5%          5×             6.0 ngày
     1.0%         10×             3.0 ngày
     5.0%         50×             14.4 giờ
    10.0%        100×              7.2 giờ
   100.0%       1000×              43 phút</div>
<p>That last row is worth pausing on: <strong>a total outage exhausts a 99.9% monthly budget in 43 minutes.</strong> Which is the same 43 minutes from the table above, arriving from the other direction — and it is why a full outage is the only thing that unambiguously deserves an immediate page.</p>

<h3>The two alerts that replace a dozen</h3>
<div class="out">Ngưỡng cảnh báo nhiều-cửa-sổ (Google SRE, SLO 99,9%):
  cửa sổ 1 giờ   hệ số đốt ≥ 14.4  = tỉ lệ lỗi 1.44%  → gọi ngay — 2% ngân sách trong 1 giờ
  cửa sổ 6 giờ   hệ số đốt ≥    6  = tỉ lệ lỗi 0.60%  → gọi ngay — 5% ngân sách trong 6 giờ
  cửa sổ 3 ngày  hệ số đốt ≥    1  = tỉ lệ lỗi 0.10%  → mở phiếu — 10% ngân sách trong 3 ngày</div>
<pre><code class="language-yaml">- alert: ErrorBudgetBurningFast
  # Two windows: the short one detects, the long one confirms.
  # Both must be over threshold, which kills single-spike noise.
  expr: |
    (
      sum(rate(http_requests_total{code=~"5.."}[1h]))
        / sum(rate(http_requests_total[1h])) &gt; 14.4 * 0.001
      and
      sum(rate(http_requests_total{code=~"5.."}[5m]))
        / sum(rate(http_requests_total[5m])) &gt; 14.4 * 0.001
    )
  labels: { severity: page }
  annotations:
    summary: "Burning the error budget 14.4× — 2% of the month in one hour"

- alert: ErrorBudgetBurningSlowly
  expr: |
    sum(rate(http_requests_total{code=~"5.."}[3d]))
      / sum(rate(http_requests_total[3d])) &gt; 1 * 0.001
  labels: { severity: ticket }
  annotations:
    summary: "10% of the monthly budget spent over 3 days"</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Two rules cover the whole severity range</span><span class="lz-d">A catastrophic outage and a slow bleed both get caught, by the same metric, with no separate thresholds for &quot;a bit broken&quot; and &quot;very broken&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The short-window clause is what prevents late alerts</span><span class="lz-d">A 1-hour window alone takes ~20 minutes to cross its threshold during a total outage. Requiring the 5-minute window too means it fires in about 5.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The long-window clause is what prevents false alerts</span><span class="lz-d">A 30-second blip moves the 5-minute window but not the 1-hour one. Both must agree, so transients are filtered without a <code>for:</code> delay.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Every threshold traces back to one decision</span><span class="lz-d">The 0.001 is the SLO. Change the SLO and every number moves consistently. No individual threshold has to be defended again.</span></div>
</div>

<h3>What the budget is FOR</h3>
<pre><code>The point of an error budget is not to measure failure.
It is to make "how much risk can we take" a NUMBER
instead of an argument.

  Budget remaining: 38 of 43 minutes
    → ship the risky refactor. You can afford a rollback.

  Budget remaining: 4 of 43 minutes
    → freeze. No non-essential deploys until the window
      rolls forward. Spend the time on the thing that
      burned it.

  Budget consistently untouched, month after month
    → your SLO is too loose, OR you are being too
      conservative and could ship faster. Both are worth
      knowing, and neither is visible without the number.

That last case is the one people miss. An error budget you
never spend is not a triumph — it is capacity you paid for
and did not use.</code></pre>

<h3>Picking the SLI, for this repository</h3>
<pre><code class="language-promql"># Availability: non-5xx, excluding the routes nobody waits on
sum(rate(http_requests_total{code!~"5..", route!~"/health.*|/metrics"}[30d]))
  / sum(rate(http_requests_total{route!~"/health.*|/metrics"}[30d]))

# Latency: served in under 1s (lesson 9.2, method 2)
sum(rate(http_request_duration_seconds_bucket{le="1"}[30d]))
  / sum(rate(http_request_duration_seconds_count[30d]))</code></pre>
<pre><code>Note the exclusions. Health checks are 5,760 requests/day
that always succeed instantly — leaving them in inflates
availability and makes the SLI describe your monitoring
rather than your users.

Start with ONE SLI. Availability is the right first choice
because it is unambiguous and every user notices it. Add
the latency one only when availability is comfortably met,
and never add a third until the first two have driven a
real decision.</code></pre>

<div class="pitfall">
<p><strong>Trap — a 30-day rolling window means a bad day keeps costing you for a month, and the day it stops is invisible.</strong> Burn 30 of your 43 minutes on the 3rd, and the budget stays depleted until the 3rd of the next month, when that incident silently rolls out of the window and 30 minutes reappear. Two things follow, both awkward. First, a deploy freeze declared on the 5th has no natural end date — it lifts because of arithmetic, not because anything improved, and if nobody notices, the freeze outlives its reason. Second, <strong>the graph recovers on a date with no event attached, so a month later someone reads the improvement as the fix having worked.</strong> Put the incident date on the budget dashboard as an annotation, and state the recovery date when you declare the freeze: &quot;frozen until the 3rd, when the incident of the 3rd leaves the window&quot; is a sentence that keeps everyone honest.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/implementing-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Google SRE Workbook — implementing SLOs</span><span class="lc-sub">Choosing an SLI, setting the target, and the multi-window multi-burn-rate table this lesson's thresholds come from.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — embracing risk</span><span class="lc-sub">Why an unspent error budget is a problem, and how the budget converts reliability arguments into a shared number.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>SLO, ngân sách lỗi, tốc độ đốt</h2>
<p class="lead">Bài 9.2 suy ngưỡng ra từ dữ liệu và từ yêu cầu. Bài này là nguồn thứ ba, và là nguồn hữu ích nhất: một con số duy nhất về thứ bạn đã hứa, và từ đó mọi ngưỡng cảnh báo suy ra được bằng số học.</p>

<h3>Ba thuật ngữ, định nghĩa một lần</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">SLI</span><span class="lz-t">Phép đo</span><span class="lz-d">&quot;Tỉ lệ request trả về không-5xx trong dưới 1 giây.&quot; Một con số giữa 0 và 1, tính từ những chỉ số bạn vốn đã có.</span></div>
  <div class="lz-node"><span class="lz-k">SLO</span><span class="lz-t">Mục tiêu</span><span class="lz-d">&quot;Tỉ lệ đó ít nhất là 99,9%, đo trên 30 ngày.&quot; Một LỰA CHỌN, không phải một phép đo — và là con số duy nhất trong bài này mà bạn phải tự quyết.</span></div>
  <div class="lz-node"><span class="lz-k">Ngân sách lỗi</span><span class="lz-t">Cái mà mục tiêu cho phép</span><span class="lz-d">100% − 99,9% = 0,1%. Trên 30 ngày đó là một số phút cụ thể, và nó là cái thứ bạn TIÊU.</span></div>
</div>

<h3>Mỗi mức SLO thật sự tốn của bạn bao nhiêu, đo thật</h3>
<pre><code class="language-javascript">// m18.mjs — số phút chết mà mỗi mục tiêu cho phép
const MIN = 30*24*60;                    // số phút trong 30 ngày
for (const slo of [0.99, 0.995, 0.999, 0.9995, 0.9999]) {
  const budget = MIN * (1 - slo);
  // ...trên 30 ngày, trên 1 ngày, trên 1 giờ
}
</code></pre>
<div class="out">$ node m18.mjs
SLO       thời gian chết được phép trong 30 ngày   trong 1 ngày   trong 1 giờ
  99.00%                      7.2 giờ        14 phút       36 giây
  99.50%                      3.6 giờ         7 phút       18 giây
  99.90%                      43 phút         1 phút        4 giây
  99.95%                      22 phút        43 giây        2 giây
  99.99%                       4 phút         9 giây        0 giây</div>
<pre><code>Hãy đọc hàng 99,9% đặt cạnh cách kho này được vận hành:

  43 phút mỗi tháng. Deploy được thực hiện từ một cái laptop bằng
  cách chạy deploy-nha.sh. Khởi động lại một container là vài
  giây, nhưng một lần deploy hỏng cần quay lui thì mười phút là
  chuyện thường — tức là một phần tư ngân sách cả tháng cho MỘT
  lần deploy hỏng.

Giờ đọc mức 99,99%: bốn phút mỗi tháng, tổng cộng, tính cả mọi
lần deploy, mọi lần Postgres khởi động lại, mọi lần VPS reboot.
Mục tiêu đó không đạt được trên một cái VPS với deploy thủ công,
và cứ chọn nó thì cái SLO chỉ là đồ trang trí.

Với kho này, 99,5% (3,6 giờ/tháng) là trung thực và 99,9% là đầy
tham vọng. Chọn con số bạn thật sự giữ được mới là toàn bộ mấu
chốt — một cái SLO bạn trượt đều đặn thì chẳng nói lên gì khi bạn
trượt nó.</code></pre>

<h3>Tốc độ đốt: một ý duy nhất làm việc cảnh báo trở nên đơn giản</h3>
<pre><code>Tốc độ đốt = bạn đang tiêu ngân sách nhanh tới đâu, so với
             việc tiêu nó đều tăm tắp.

  hệ số đốt 1×    → bạn sẽ dùng đúng hết ngân sách trong 30 ngày
  hệ số đốt 10×   → bạn dùng hết nó trong 3 ngày
  hệ số đốt 1000× → bạn dùng hết nó trong 43 phút</code></pre>
<div class="out">$ node m18.mjs
(SLO 99,9% → ngân sách = 0,1% số request)
tỉ lệ lỗi   hệ số đốt   cạn ngân sách sau
     0.1%          1×            30.0 ngày
     0.2%          2×            15.0 ngày
     0.5%          5×             6.0 ngày
     1.0%         10×             3.0 ngày
     5.0%         50×             14.4 giờ
    10.0%        100×              7.2 giờ
   100.0%       1000×              43 phút</div>
<p>Hàng cuối cùng đáng dừng lại: <strong>một sự cố toàn phần đốt cạn ngân sách tháng của mức 99,9% trong 43 phút.</strong> Chính là 43 phút ở cái bảng phía trên, đi tới từ hướng ngược lại — và đó là lý do một sự cố toàn phần là thứ duy nhất xứng đáng gọi dậy ngay lập tức một cách không mập mờ.</p>

<h3>Hai cảnh báo thay thế cho cả tá</h3>
<div class="out">Ngưỡng cảnh báo nhiều-cửa-sổ (Google SRE, SLO 99,9%):
  cửa sổ 1 giờ   hệ số đốt ≥ 14.4  = tỉ lệ lỗi 1.44%  → gọi ngay — 2% ngân sách trong 1 giờ
  cửa sổ 6 giờ   hệ số đốt ≥    6  = tỉ lệ lỗi 0.60%  → gọi ngay — 5% ngân sách trong 6 giờ
  cửa sổ 3 ngày  hệ số đốt ≥    1  = tỉ lệ lỗi 0.10%  → mở phiếu — 10% ngân sách trong 3 ngày</div>
<pre><code class="language-yaml">- alert: ErrorBudgetBurningFast
  # Hai cửa sổ: cái ngắn PHÁT HIỆN, cái dài XÁC NHẬN.
  # Cả hai phải vượt ngưỡng, và điều đó dập tiếng ồn của một cái gai đơn lẻ.
  expr: |
    (
      sum(rate(http_requests_total{code=~"5.."}[1h]))
        / sum(rate(http_requests_total[1h])) &gt; 14.4 * 0.001
      and
      sum(rate(http_requests_total{code=~"5.."}[5m]))
        / sum(rate(http_requests_total[5m])) &gt; 14.4 * 0.001
    )
  labels: { severity: page }
  annotations:
    summary: "Đang đốt ngân sách lỗi 14,4× — 2% của cả tháng trong một giờ"

- alert: ErrorBudgetBurningSlowly
  expr: |
    sum(rate(http_requests_total{code=~"5.."}[3d]))
      / sum(rate(http_requests_total[3d])) &gt; 1 * 0.001
  labels: { severity: ticket }
  annotations:
    summary: "Đã tiêu 10% ngân sách tháng trong 3 ngày"</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hai cái luật phủ trọn dải mức độ nghiêm trọng</span><span class="lz-d">Một sự cố thảm hoạ và một cú rỉ máu chậm đều bị bắt, bằng cùng một chỉ số, không cần ngưỡng riêng cho &quot;hơi hỏng&quot; và &quot;hỏng nặng&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mệnh đề cửa-sổ-ngắn là thứ ngăn cảnh báo tới muộn</span><span class="lz-d">Chỉ mình cửa sổ 1 giờ thì mất ~20 phút mới vượt được ngưỡng của nó trong một sự cố toàn phần. Đòi cả cửa sổ 5 phút nữa nghĩa là nó nổ trong khoảng 5 phút.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mệnh đề cửa-sổ-dài là thứ ngăn cảnh báo giả</span><span class="lz-d">Một cái chớp 30 giây làm nhúc nhích cửa sổ 5 phút nhưng không nhúc nhích cửa sổ 1 giờ. Cả hai phải đồng thuận, nên thứ thoáng qua bị lọc mà không cần một khoảng trễ <code>for:</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Mọi ngưỡng đều lần ngược về MỘT quyết định</span><span class="lz-d">Cái 0.001 chính là SLO. Đổi SLO thì mọi con số dịch chuyển một cách nhất quán. Không có cái ngưỡng riêng lẻ nào phải đi bảo vệ lại.</span></div>
</div>

<h3>Ngân sách để LÀM GÌ</h3>
<pre><code>Mục đích của một ngân sách lỗi không phải để đo sự thất bại. Nó
là để biến câu "chúng ta chịu được bao nhiêu rủi ro" thành một
CON SỐ thay vì một cuộc tranh cãi.

  Ngân sách còn lại: 38 trên 43 phút
    → cứ đem cái tái cấu trúc mạo hiểm lên. Bạn chịu được một
      lần quay lui.

  Ngân sách còn lại: 4 trên 43 phút
    → đóng băng. Không deploy gì không thiết yếu cho tới khi
      cửa sổ trôi tới. Hãy dùng thời gian đó cho cái thứ đã đốt nó.

  Ngân sách tháng nào cũng còn nguyên
    → SLO của bạn quá lỏng, HOẶC bạn đang quá thận trọng và
      lẽ ra ship nhanh hơn được. Cả hai đều đáng biết, và không
      cái nào nhìn thấy được nếu không có con số ấy.

Trường hợp cuối là cái người ta hay bỏ sót. Một ngân sách lỗi bạn
không bao giờ tiêu thì không phải một chiến thắng — nó là năng
lực bạn đã trả tiền mà không dùng.</code></pre>

<h3>Chọn SLI, cho kho này</h3>
<pre><code class="language-promql"># Khả dụng: không-5xx, loại trừ những route chẳng ai ngồi chờ
sum(rate(http_requests_total{code!~"5..", route!~"/health.*|/metrics"}[30d]))
  / sum(rate(http_requests_total{route!~"/health.*|/metrics"}[30d]))

# Độ trễ: phục vụ xong trong dưới 1s (bài 9.2, cách 2)
sum(rate(http_request_duration_seconds_bucket{le="1"}[30d]))
  / sum(rate(http_request_duration_seconds_count[30d]))</code></pre>
<pre><code>Hãy để ý mấy phần loại trừ. Phép kiểm sức khoẻ là 5.760 request
mỗi ngày luôn thành công tức thì — để chúng trong đó thì thổi
phồng độ khả dụng và làm cho cái SLI mô tả HỆ THỐNG THEO DÕI của
bạn chứ không mô tả người dùng.

Hãy bắt đầu với MỘT SLI. Độ khả dụng là lựa chọn đầu tiên đúng
đắn vì nó không mập mờ và mọi người dùng đều nhận ra. Chỉ thêm
cái độ trễ khi độ khả dụng đã đạt thoải mái, và đừng bao giờ thêm
cái thứ ba cho tới khi hai cái đầu đã dẫn tới một quyết định thật.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cửa sổ trượt 30 ngày nghĩa là một ngày tồi tệ vẫn tính tiền bạn suốt một tháng, và cái ngày nó ngừng tính thì vô hình.</strong> Đốt 30 trong 43 phút vào ngày mùng 3, và ngân sách sẽ cạn cho tới mùng 3 tháng sau, khi cái sự cố ấy âm thầm trôi ra khỏi cửa sổ và 30 phút xuất hiện lại. Hai điều nảy ra từ đó, cả hai đều gượng gạo. Thứ nhất, một lệnh đóng băng deploy tuyên bố vào mùng 5 chẳng có ngày kết thúc tự nhiên nào — nó được gỡ vì số học, không phải vì có gì cải thiện, và nếu không ai để ý thì lệnh đóng băng sống lâu hơn cả lý do của nó. Thứ hai, <strong>cái đồ thị hồi phục vào một ngày chẳng có sự kiện nào gắn kèm, nên một tháng sau ai đó đọc cái sự cải thiện ấy thành &quot;cách chữa đã có tác dụng&quot;.</strong> Hãy đặt ngày xảy ra sự cố lên bảng theo dõi ngân sách dưới dạng một chú thích, và nêu rõ ngày hồi phục khi bạn tuyên bố đóng băng: &quot;đóng băng tới mùng 3, khi sự cố ngày mùng 3 rời khỏi cửa sổ&quot; là một câu giữ cho mọi người trung thực.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/workbook/implementing-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Sách bài tập SRE của Google — triển khai SLO</span><span class="lc-sub">Chọn một SLI, đặt mục tiêu, và cái bảng nhiều-cửa-sổ nhiều-tốc-độ-đốt mà các ngưỡng ở bài này rút ra từ đó.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — chấp nhận rủi ro</span><span class="lc-sub">Vì sao một ngân sách lỗi không tiêu tới lại là một vấn đề, và cách ngân sách biến những cuộc tranh cãi về độ tin cậy thành một con số chung.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '9.4 — Alert fatigue, and on-call for one person|||9.4 — Mệt mỏi vì cảnh báo, và trực ca khi chỉ có một người',
      slug: 'obs-9-4-met-moi-va-truc-ca',
      type: 'VIDEO',
      description: 'Cách một hệ thống cảnh báo chết, và bộ luật trực ca cho một dự án không có ca trực.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Alert fatigue, and on-call for one person</h2>
<p class="lead">Every alerting system fails the same way, and it is not by missing something. It fails by being right too often about things that did not matter, until the person receiving it stops reading. This lesson is how that happens and what it looks like on a project with a team of one.</p>

<h3>The decay, in five steps</h3>
<pre><code>1. An alert fires. You look. It was nothing.
2. It fires again next week. You look, slower.
3. Third time, you glance at the title and dismiss it.
4. You add a filter so it goes to a quieter channel.
5. Six weeks later it fires for a REAL reason and you
   see it four hours after the fact.

Nothing in that sequence was unreasonable. Every step was
the rational response to the previous one. That is what
makes fatigue dangerous — it is not laziness, it is
correct behaviour applied to a badly calibrated system.

The number that matters is your ACTIONABLE RATE:

  actionable rate = alerts that led to action
                    ────────────────────────
                    alerts received

  above 70%  → healthy. You trust the pager.
  30–70%     → decaying. You are already skimming.
  below 30%  → dead. The alerts are decoration and you
               will miss the real one.</code></pre>

<h3>The four causes, and what each needs</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Threshold too tight</span><span class="lz-t">Fires on normal variation</span><span class="lz-d">The single most common cause, and lesson 9.2 is the whole fix: derive the number, do not copy it. A threshold that fires weekly on nothing is a threshold set below the observed normal.</span></div>
  <div class="lz-node"><span class="lz-k">Alerting on causes, not symptoms</span><span class="lz-t">One incident, twelve pages</span><span class="lz-d">Postgres slows → pool waits alert, latency alert, error rate alert, memory alert, event-loop alert. Five pages, one problem. Alert on the symptom users feel; keep the rest as dashboard context.</span></div>
  <div class="lz-node"><span class="lz-k">No grouping</span><span class="lz-t">One alert per instance, per route</span><span class="lz-d">The same condition across six routes is one incident. Alertmanager's <code>group_by</code> collapses them into one notification with six entries — which is one interruption instead of six.</span></div>
  <div class="lz-node"><span class="lz-k">Alerting on the predictable</span><span class="lz-t">Deploys, cron jobs, backups</span><span class="lz-d">If a nightly job spikes latency at 03:00 every night, that is not an alert, it is a schedule. Either suppress during the window or fix the job — but stop paging for a thing you can predict.</span></div>
</div>

<h3>Grouping and inhibition, concretely</h3>
<pre><code class="language-yaml"># alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s          # collect related alerts before sending
  group_interval: 5m       # then batch updates
  repeat_interval: 4h      # do not re-notify a known-firing alert
  routes:
    - matchers: [ severity="page" ]
      receiver: phone
    - matchers: [ severity="ticket" ]
      receiver: email

inhibit_rules:
  # If the whole site is down, do not also page about
  # latency, pool waits and error rate. One incident, one page.
  - source_matchers: [ alertname="SiteUnreachable" ]
    target_matchers: [ severity="page" ]
    equal: ['service']</code></pre>
<pre><code>The inhibit rule is the one people skip and then most need.
During a real outage EVERYTHING breaks at once, so an
un-inhibited setup sends its largest burst of notifications
at exactly the moment you need to concentrate.

  Without inhibition: 11 pages in 90 seconds.
  With it:            1 page, "SiteUnreachable", and the
                      other 10 visible on the dashboard
                      when you look.</code></pre>

<h3>On-call when there is no rotation</h3>
<pre><code>This repository is one person. There is no handover, no
secondary, and no one to escalate to. That changes what
"on-call" can honestly mean:

  · You are not on-call. You are REACHABLE, sometimes.
    Say this out loud rather than pretending otherwise —
    a 3am page nobody will answer is worse than no page,
    because it costs sleep and delivers nothing.

  · Therefore: MINIMISE, do not merely tune.
    A team of five can afford twenty page-level alerts.
    A team of one can afford at most three, because the
    fourth one displaces attention from the first three.

  · Everything else becomes a MORNING QUEUE. A single
    daily digest — "here is what fired overnight, here is
    what recovered on its own" — is more useful than
    twelve notifications nobody saw.</code></pre>
<pre><code class="language-yaml"># The one-person routing that actually works
route:
  receiver: morning-digest              # ← the DEFAULT is quiet
  routes:
    - matchers: [ severity="page" ]     # ← only three rules
      receiver: phone                   #   can ever match this
      repeat_interval: 1h

receivers:
  - name: phone
    # SMS or a call. NOT Slack — Slack is where alerts go
    # to be seen tomorrow, and pretending otherwise is how
    # you end up believing you have paging that you do not.
  - name: morning-digest
    # Email, batched, delivered at 08:00.</code></pre>

<h3>What to do instead of paging</h3>
<pre><code>For a one-person project, most conditions have a better
answer than waking you:

  RETRY          A transient upstream failure. The LLM
                 gateway falling back to a Claude model
                 (which this repo does deliberately) is a
                 self-healing alert that never needed to be one.

  DEGRADE        Redis unreachable → serve from Postgres.
                 Slower, still working. Count it as a metric,
                 mention it in the digest, do not page.

  SHED           Over capacity → return 503 to a fraction of
                 traffic and keep the rest fast. A partial
                 outage you chose beats a total one you did not.

  QUEUE          Embedding failed → retry it later. Lesson
                 3.3's queue exists for exactly this, and a
                 failed background job is a ticket, not a page.

Every one of those is an engineering fix that removes an
alert permanently. That is a much better use of an hour
than tuning the threshold on an alert that should not exist.</code></pre>

<h3>The monthly review, which takes ten minutes</h3>
<pre><code>For every alert that fired in the last month:

  · How many times?
  · How many led to a human doing something?
  · If zero → delete it or demote it to the digest.
    Not "tune it". Delete it. You can always add it back
    when you have a reason, and a deleted alert is honest
    while a muted one is a lie.

For every incident in the last month:

  · Did an alert catch it, or did a user tell you?
  · If a user told you, what alert would have caught it?
    Add exactly that one — and only if it meets the four
    tests in lesson 9.1.

That second question is the one that grows the system
correctly: alerts added because something got missed are
the only ones with a proven reason to exist.</code></pre>

<div class="pitfall">
<p><strong>Trap — routing alerts to Slack and calling it paging.</strong> Slack is where a message waits until someone opens the app, which at 3am is nobody and during focused work is twenty minutes later. Treating it as a pager produces a specific and expensive belief: the incident review says &quot;we were alerted at 02:14&quot; when what actually happened is that a message was written into a channel at 02:14 and read at 09:30. <strong>The gap between &quot;notified&quot; and &quot;noticed&quot; is invisible in every tool and is the entire difference between having paging and thinking you do.</strong> Either route your three page-level alerts to something that makes a phone ring against Do Not Disturb, or state plainly that your response time is &quot;next morning&quot; and set the SLO in lesson 9.3 accordingly — 99.9% is 43 minutes a month, which an eight-hour response time cannot meet.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/alerting/latest/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">📬</span>
  <span class="lc-body"><span class="lc-title">Alertmanager — routing, grouping and inhibition</span><span class="lc-sub">group_by, group_wait, repeat_interval and inhibit_rules — the configuration that turns eleven notifications into one.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/being-on-call/" target="_blank" rel="noopener">
  <span class="lc-ico">📟</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — being on-call</span><span class="lc-sub">Where the actionable-rate idea and the page budget come from, and why they scale down to a team of one.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Mệt mỏi vì cảnh báo, và trực ca khi chỉ có một người</h2>
<p class="lead">Mọi hệ thống cảnh báo đều hỏng theo cùng một cách, và đó không phải là bỏ sót thứ gì. Nó hỏng vì đúng quá thường xuyên về những thứ chẳng quan trọng, cho tới khi người nhận thôi đọc. Bài này nói chuyện đó xảy ra thế nào và nó trông ra sao trên một dự án có đội ngũ một người.</p>

<h3>Sự suy tàn, trong năm bước</h3>
<pre><code>1. Một cảnh báo nổ. Bạn xem. Chẳng có gì.
2. Tuần sau nó nổ nữa. Bạn xem, chậm hơn.
3. Lần thứ ba, bạn liếc cái tiêu đề rồi bỏ qua.
4. Bạn thêm một bộ lọc để nó đi sang một kênh im ắng hơn.
5. Sáu tuần sau nó nổ vì một lý do THẬT và bạn nhìn thấy
   sau đó bốn tiếng.

Không bước nào trong chuỗi đó là vô lý. Mỗi bước đều là phản ứng
hợp lý với bước trước. Đó là thứ làm cho sự mệt mỏi trở nên nguy
hiểm — nó không phải sự lười biếng, nó là hành vi ĐÚNG áp dụng
lên một hệ thống hiệu chỉnh tồi.

Con số đáng quan tâm là TỈ LỆ HÀNH ĐỘNG ĐƯỢC của bạn:

  tỉ lệ hành động được = số cảnh báo dẫn tới hành động
                         ───────────────────────────
                         số cảnh báo nhận được

  trên 70%   → khoẻ mạnh. Bạn tin cái máy nhắn tin.
  30–70%     → đang suy tàn. Bạn đã đọc lướt rồi.
  dưới 30%   → đã chết. Cảnh báo là đồ trang trí và bạn sẽ bỏ
               lỡ cái thật.</code></pre>

<h3>Bốn nguyên nhân, và mỗi cái cần gì</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Ngưỡng quá chặt</span><span class="lz-t">Nổ vì biến thiên bình thường</span><span class="lz-d">Nguyên nhân phổ biến nhất, và bài 9.2 là toàn bộ cách chữa: hãy SUY RA con số, đừng chép nó. Một cái ngưỡng nổ hằng tuần vì chẳng có gì là một cái ngưỡng đặt dưới mức bình thường quan sát được.</span></div>
  <div class="lz-node"><span class="lz-k">Cảnh báo theo NGUYÊN NHÂN, không theo TRIỆU CHỨNG</span><span class="lz-t">Một sự cố, mười hai lần gọi</span><span class="lz-d">Postgres chậm → cảnh báo chờ bể, cảnh báo độ trễ, cảnh báo tỉ lệ lỗi, cảnh báo bộ nhớ, cảnh báo vòng lặp sự kiện. Năm lần gọi, một vấn đề. Hãy cảnh báo theo cái triệu chứng người dùng cảm nhận được; giữ phần còn lại làm ngữ cảnh trên bảng.</span></div>
  <div class="lz-node"><span class="lz-k">Không gom nhóm</span><span class="lz-t">Một cảnh báo cho mỗi thực thể, mỗi route</span><span class="lz-d">Cùng một tình trạng trên sáu route là MỘT sự cố. <code>group_by</code> của Alertmanager gộp chúng thành một thông báo có sáu mục — tức là một lần bị ngắt thay vì sáu.</span></div>
  <div class="lz-node"><span class="lz-k">Cảnh báo về thứ đoán trước được</span><span class="lz-t">Deploy, cron, sao lưu</span><span class="lz-d">Nếu một việc chạy đêm làm vọt độ trễ vào 03:00 mỗi đêm thì đó không phải một cảnh báo, đó là một cái LỊCH. Hoặc đè nó lại trong cửa sổ đó, hoặc sửa cái việc ấy — nhưng hãy thôi gọi dậy vì một thứ bạn đoán trước được.</span></div>
</div>

<h3>Gom nhóm và ức chế, cho cụ thể</h3>
<pre><code class="language-yaml"># alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s          # gom các cảnh báo liên quan trước khi gửi
  group_interval: 5m       # rồi gửi cập nhật theo lô
  repeat_interval: 4h      # đừng báo lại một cảnh báo đã biết là đang nổ
  routes:
    - matchers: [ severity="page" ]
      receiver: phone
    - matchers: [ severity="ticket" ]
      receiver: email

inhibit_rules:
  # Nếu cả trang đã chết thì đừng gọi dậy thêm vì độ trễ, chờ bể
  # và tỉ lệ lỗi nữa. Một sự cố, một lần gọi.
  - source_matchers: [ alertname="SiteUnreachable" ]
    target_matchers: [ severity="page" ]
    equal: ['service']</code></pre>
<pre><code>Luật ức chế là thứ người ta bỏ qua rồi lại cần tới nhất. Trong
một sự cố thật thì MỌI THỨ hỏng cùng lúc, nên một cấu hình không
có ức chế sẽ gửi đợt thông báo lớn nhất của nó vào đúng cái
khoảnh khắc bạn cần tập trung.

  Không ức chế: 11 lần gọi trong 90 giây.
  Có ức chế:    1 lần gọi, "SiteUnreachable", và 10 cái kia
                nhìn thấy được trên bảng theo dõi khi bạn xem.</code></pre>

<h3>Trực ca khi không có ca trực nào</h3>
<pre><code>Kho này có một người. Không có bàn giao, không có người dự bị,
và không có ai để chuyển cấp lên. Điều đó thay đổi cái nghĩa mà
"trực ca" có thể mang một cách trung thực:

  · Bạn KHÔNG trực ca. Bạn LIÊN LẠC ĐƯỢC, đôi khi. Hãy nói thẳng
    điều đó ra thay vì giả vờ ngược lại — một lần gọi lúc 3 giờ
    sáng mà không ai nhấc máy thì tệ hơn là không gọi, vì nó tốn
    giấc ngủ và chẳng đem lại gì.

  · Do đó: hãy GIẢM TỚI TỐI THIỂU, đừng chỉ đi chỉnh. Một đội
    năm người chịu được hai mươi cảnh báo cấp gọi-dậy. Một đội
    một người chịu được nhiều nhất là ba, vì cái thứ tư sẽ lấy
    mất sự chú ý dành cho ba cái đầu.

  · Mọi thứ khác trở thành HÀNG ĐỢI BUỔI SÁNG. Một bản tổng hợp
    hằng ngày duy nhất — "đây là những gì đã nổ trong đêm, đây là
    những gì tự hồi phục" — hữu ích hơn mười hai thông báo không
    ai nhìn thấy.</code></pre>
<pre><code class="language-yaml"># Cách định tuyến một-người thật sự chạy được
route:
  receiver: morning-digest              # ← MẶC ĐỊNH là im lặng
  routes:
    - matchers: [ severity="page" ]     # ← chỉ ba cái luật
      receiver: phone                   #   có thể khớp được cái này
      repeat_interval: 1h

receivers:
  - name: phone
    # SMS hoặc một cuộc gọi. KHÔNG PHẢI Slack — Slack là nơi cảnh
    # báo đi tới để được xem vào ngày mai, và giả vờ ngược lại là
    # cách bạn kết thúc bằng việc tin rằng mình có hệ thống gọi
    # dậy mà thật ra thì không.
  - name: morning-digest
    # Email, gom lô, gửi lúc 08:00.</code></pre>

<h3>Làm gì thay vì gọi dậy</h3>
<pre><code>Với một dự án một người, phần lớn các tình trạng đều có câu trả
lời tốt hơn là đánh thức bạn:

  THỬ LẠI      Một cú hỏng thoáng qua ở thượng nguồn. Việc cổng
               LLM lùi về một model Claude (kho này làm thế một
               cách có chủ ý) là một cảnh báo tự lành mà đáng lẽ
               chưa bao giờ nên là một cảnh báo.

  SUY GIẢM     Không với tới Redis → phục vụ từ Postgres. Chậm
               hơn, vẫn chạy. Hãy đếm nó thành một chỉ số, nhắc
               nó trong bản tổng hợp, đừng gọi dậy.

  BỎ BỚT       Quá tải → trả 503 cho một phần lưu lượng và giữ
               phần còn lại chạy nhanh. Một sự cố một phần mà
               bạn CHỌN thì hơn một sự cố toàn phần bạn không chọn.

  XẾP HÀNG     Embedding hỏng → thử lại sau. Cái hàng đợi ở bài
               3.3 tồn tại đúng cho việc này, và một công việc
               nền hỏng là một cái phiếu, không phải một lần gọi.

Mỗi cái trong số đó là một cách chữa về mặt kỹ thuật gỡ bỏ vĩnh
viễn một cái cảnh báo. Đó là cách dùng một tiếng đồng hồ tốt hơn
nhiều so với việc đi chỉnh ngưỡng cho một cảnh báo lẽ ra không
nên tồn tại.</code></pre>

<h3>Buổi rà soát hằng tháng, tốn mười phút</h3>
<pre><code>Với mọi cảnh báo đã nổ trong tháng vừa rồi:

  · Nổ bao nhiêu lần?
  · Bao nhiêu lần dẫn tới việc một con người làm một điều gì đó?
  · Nếu bằng không → XOÁ nó hoặc hạ nó xuống bản tổng hợp.
    Không phải "chỉnh nó". Xoá nó. Bạn luôn thêm lại được khi có
    lý do, và một cảnh báo đã xoá thì trung thực còn một cảnh
    báo bị tắt tiếng thì là một lời nói dối.

Với mọi sự cố trong tháng vừa rồi:

  · Có cảnh báo nào bắt được không, hay một người dùng báo bạn?
  · Nếu người dùng báo, thì cảnh báo nào lẽ ra đã bắt được nó?
    Hãy thêm đúng cái đó — và chỉ khi nó qua được bốn phép thử
    ở bài 9.1.

Câu hỏi thứ hai là câu làm cho hệ thống lớn lên một cách đúng
đắn: những cảnh báo được thêm vào vì có thứ đã bị bỏ sót là
những cảnh báo duy nhất có một lý do tồn tại đã được chứng minh.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — định tuyến cảnh báo vào Slack rồi gọi đó là hệ thống gọi dậy.</strong> Slack là nơi một thông điệp nằm chờ cho tới khi có người mở ứng dụng ra, mà lúc 3 giờ sáng thì đó là không ai, còn trong lúc làm việc tập trung thì là hai mươi phút sau. Coi nó là một cái máy nhắn tin sinh ra một niềm tin rất cụ thể và rất đắt: bản kiểm điểm sự cố ghi &quot;chúng ta được cảnh báo lúc 02:14&quot; trong khi chuyện thật sự xảy ra là một thông điệp được viết vào một cái kênh lúc 02:14 và được đọc lúc 09:30. <strong>Cái khoảng cách giữa &quot;đã báo&quot; và &quot;đã thấy&quot; là vô hình trong mọi công cụ và nó là toàn bộ khác biệt giữa việc CÓ hệ thống gọi dậy và việc NGHĨ rằng mình có.</strong> Hoặc là định tuyến ba cảnh báo cấp gọi-dậy của bạn tới một thứ làm cho một cái điện thoại reo bất chấp chế độ Không làm phiền, hoặc là nói thẳng rằng thời gian phản hồi của bạn là &quot;sáng hôm sau&quot; rồi đặt cái SLO ở bài 9.3 cho tương xứng — 99,9% là 43 phút một tháng, mà một thời gian phản hồi tám tiếng thì không đáp ứng nổi.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://prometheus.io/docs/alerting/latest/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">📬</span>
  <span class="lc-body"><span class="lc-title">Alertmanager — định tuyến, gom nhóm và ức chế</span><span class="lc-sub">group_by, group_wait, repeat_interval và inhibit_rules — phần cấu hình biến mười một thông báo thành một.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/being-on-call/" target="_blank" rel="noopener">
  <span class="lc-ico">📟</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — trực ca</span><span class="lc-sub">Nơi ý tưởng tỉ-lệ-hành-động-được và ngân sách gọi-dậy đến từ đó, và vì sao chúng thu nhỏ được xuống một đội một người.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra chương 9',
      slug: 'obs-9-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về định nghĩa cảnh báo, ngưỡng suy ra được, ngân sách lỗi và mệt mỏi vì cảnh báo.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 9 · Quiz</span><h2>Six questions on alerting</h2><p class="lead">Three of these have an answer that means "delete the alert". That is usually the right answer and it is almost never the first one people reach for.</p></div><div class="ml-vi"><span class="eyebrow">Chương 9 · Kiểm tra</span><h2>Sáu câu về cảnh báo</h2><p class="lead">Ba câu trong đây có đáp án là "hãy xoá cái cảnh báo đi". Đó thường là đáp án đúng và gần như không bao giờ là cái người ta với tới đầu tiên.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What makes something an alert rather than a dashboard panel?|||Cái gì làm cho một thứ trở thành một CẢNH BÁO chứ không phải một ô trên bảng theo dõi?',
            options: [
              'A human must act now: a user is affected, it is getting worse, and there is a nameable action. If any of the three is missing it is a ticket or a dashboard — and every alert that does not require action teaches the recipient that alerts do not require action, which is cumulative and not reversible.|||Một con người phải hành động NGAY: có người dùng bị ảnh hưởng, nó đang tệ thêm, và có một hành động gọi tên được. Thiếu một trong ba thì nó là một cái phiếu hoặc một cái bảng — và mọi cảnh báo không đòi hỏi hành động đều đang dạy người nhận rằng cảnh báo thì không đòi hỏi hành động, điều đó tích luỹ dần và không đảo ngược được.',
              'That it has a threshold configured|||Rằng nó có một cái ngưỡng được cấu hình',
              'That it measures something important|||Rằng nó đo một thứ quan trọng',
              'That it can be routed to a notification channel|||Rằng nó định tuyến được tới một kênh thông báo',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You copy "alert when p99 > 500ms" onto a service whose normal p99 is 989ms. What happens?|||Bạn chép "cảnh báo khi p99 > 500ms" vào một dịch vụ có p99 bình thường là 989ms. Chuyện gì xảy ra?',
            options: [
              'It fires from the day it is created and never stops, so it gets muted permanently or raised to 1200ms — a number now chosen to make the noise stop rather than by anything about users. A threshold with no derivation cannot be defended, tuned or explained.|||Nó nổ từ ngày được tạo ra và không bao giờ ngừng, nên nó bị tắt tiếng vĩnh viễn hoặc bị nâng lên 1200ms — một con số giờ được chọn để dập tiếng ồn chứ không theo bất cứ điều gì về người dùng. Một cái ngưỡng không có nguồn gốc thì không bảo vệ được, không chỉnh được, không giải thích được.',
              'It correctly catches the service being slow|||Nó bắt đúng việc dịch vụ đang chậm',
              'Nothing — 500ms is a widely accepted standard|||Không gì cả — 500ms là một chuẩn được chấp nhận rộng rãi',
              'It fires only during traffic spikes|||Nó chỉ nổ trong những cơn dồn lưu lượng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A 99.9% SLO over 30 days. How much downtime does that permit, and what does a total outage cost?|||Một SLO 99,9% trên 30 ngày. Nó cho phép bao nhiêu thời gian chết, và một sự cố toàn phần tốn gì?',
            options: [
              '43 minutes per month — and a total outage burns at 1000×, exhausting the entire budget in exactly those 43 minutes. Which is why one bad deploy needing a ten-minute rollback spends a quarter of the month, and why 99.99% (4 minutes) is not achievable on one VPS with manual deploys.|||43 phút mỗi tháng — và một sự cố toàn phần đốt với hệ số 1000×, cạn sạch ngân sách trong đúng 43 phút đó. Đó là lý do một lần deploy hỏng cần quay lui mười phút tiêu mất một phần tư cả tháng, và là lý do 99,99% (4 phút) không đạt được trên một cái VPS với deploy thủ công.',
              '43 minutes, and a total outage would take about a week to exhaust it|||43 phút, và một sự cố toàn phần mất khoảng một tuần mới cạn được nó',
              '7.2 hours, the same as 99%|||7,2 giờ, giống hệt mức 99%',
              '1 minute per day and nothing more can be said|||1 phút mỗi ngày và không nói thêm được gì',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does a burn-rate alert use two windows — 5 minutes AND 1 hour — that must both be over threshold?|||Vì sao một cảnh báo tốc-độ-đốt dùng HAI cửa sổ — 5 phút VÀ 1 giờ — mà cả hai đều phải vượt ngưỡng?',
            options: [
              'The short window detects fast: a 1-hour window alone takes about 20 minutes to cross its threshold during a total outage, while requiring the 5-minute one too fires in about 5. The long window confirms: a 30-second blip moves the short window but not the long one, so transients are filtered without a "for:" delay.|||Cửa sổ ngắn PHÁT HIỆN nhanh: chỉ mình cửa sổ 1 giờ thì mất khoảng 20 phút mới vượt ngưỡng trong một sự cố toàn phần, còn đòi thêm cửa sổ 5 phút thì nó nổ trong khoảng 5 phút. Cửa sổ dài XÁC NHẬN: một cái chớp 30 giây làm nhúc nhích cửa sổ ngắn nhưng không nhúc nhích cửa sổ dài, nên thứ thoáng qua bị lọc mà không cần một khoảng trễ "for:".',
              'To reduce the query load on Prometheus|||Để giảm tải truy vấn cho Prometheus',
              'Because Alertmanager requires at least two expressions|||Vì Alertmanager đòi ít nhất hai biểu thức',
              'To alert separately on fast and slow burns|||Để cảnh báo riêng cho đốt nhanh và đốt chậm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An alert has fired eleven times in three months and never led to action. What should you do?|||Một cảnh báo đã nổ mười một lần trong ba tháng và chưa lần nào dẫn tới hành động. Bạn nên làm gì?',
            options: [
              'Delete it, or demote it to the digest — not "tune it". Every non-actionable alert lowers your actionable rate, and below about 30% you are skimming and will miss the real one. A deleted alert is honest; a muted one is a lie that survives into the next incident.|||Xoá nó, hoặc hạ nó xuống bản tổng hợp — không phải "chỉnh nó". Mọi cảnh báo không-hành-động-được đều hạ tỉ lệ hành-động-được của bạn xuống, và dưới khoảng 30% thì bạn đang đọc lướt và sẽ bỏ lỡ cái thật. Một cảnh báo đã xoá thì trung thực; một cái bị tắt tiếng là một lời nói dối sống sót sang tận sự cố kế tiếp.',
              'Raise the threshold until it stops firing|||Nâng ngưỡng lên cho tới khi nó ngừng nổ',
              'Mute it and revisit next quarter|||Tắt tiếng nó và xem lại vào quý sau',
              'Keep it — an alert that never causes work is free|||Giữ nó — một cảnh báo không gây ra việc gì thì miễn phí',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your three page-level alerts route to Slack. What is wrong with calling that paging?|||Ba cảnh báo cấp gọi-dậy của bạn định tuyến vào Slack. Gọi đó là hệ thống gọi dậy thì sai ở chỗ nào?',
            options: [
              'Slack is read when someone opens the app — nobody at 3am, twenty minutes later during focused work. The incident review then records "we were alerted at 02:14" when a message was written at 02:14 and read at 09:30. That invisible gap is the whole difference between having paging and thinking you do; either use something that rings against Do Not Disturb, or state the response time honestly and set the SLO to match.|||Slack được đọc khi có người mở ứng dụng ra — không ai lúc 3 giờ sáng, và hai mươi phút sau trong lúc làm việc tập trung. Bản kiểm điểm sự cố rồi sẽ ghi "chúng ta được cảnh báo lúc 02:14" trong khi một thông điệp được viết lúc 02:14 và được đọc lúc 09:30. Cái khoảng cách vô hình đó là toàn bộ khác biệt giữa việc CÓ hệ thống gọi dậy và việc NGHĨ rằng mình có; hoặc dùng một thứ reo được bất chấp chế độ Không làm phiền, hoặc nói thẳng thời gian phản hồi và đặt SLO cho khớp.',
              'Nothing — Slack notifications are push notifications|||Không gì cả — thông báo Slack là thông báo đẩy',
              'Slack has a rate limit that drops alerts|||Slack có giới hạn tốc độ làm rơi mất cảnh báo',
              'Slack cannot render Prometheus annotations|||Slack không hiển thị được annotation của Prometheus',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
