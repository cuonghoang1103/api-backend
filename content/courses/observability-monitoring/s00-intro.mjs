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
    /* ──────────────────── Bắt đầu tại đây 1/2 ──────────────────── */
    {
      title: 'Start here (1/2) — What observability is, where it came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Observability là gì, ra đời thế nào, và vì sao nó quan trọng với bạn',
      slug: 'obs-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người mới: observability là gì qua hình ảnh phòng hồi sức, phân biệt monitoring/observability, log/chỉ số/trace/lỗi, health check/kiểm từ ngoài, SLI/SLO/SLA; lịch sử có nguồn từ Kálmán 1960 tới OpenTelemetry 2019; vì sao nó ra đời; nó giúp gì cho đồ án, phỏng vấn, công việc; lộ trình 13 mục và cần gì trước khi học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What observability is, where it came from, and why it matters to you</h2>
<p class="lead">Hello, and welcome. If you have ever deployed a backend, you have probably lived this moment: someone says "the site is broken", you open the server, the process is running, nothing is red — and you have no idea what happened. This course is about closing that gap. Not making your system perfect, but making it <em>tell you</em> what it is doing, especially when you are not looking. We start without any tool to install, and we go slowly.</p>

<h3>Observability in one sentence — then in a hospital ward</h3>
<p><strong>Observability</strong> is how well you can work out what is happening inside a running system from the signals it gives off — without adding new code and redeploying every time you have a new question.</p>
<p>Picture an intensive-care ward. Each patient has a <strong>monitor</strong> showing heart rate and oxygen as numbers over time — those are <em>metrics</em>. Nurses write <strong>notes</strong> each time something happens: "14:02, gave 5 mg, patient complained of pain" — those are <em>logs</em>. When a patient is moved from emergency to X-ray to surgery, someone can follow the <strong>path</strong> and see where the hours went — that is a <em>trace</em>. The chart also records <strong>changes</strong>: a new drug, a new dose — and when the heart rate jumps, the first question is "what changed just before?". Finally there is an <strong>alarm</strong> that beeps when oxygen falls below a line, so the nurse does not have to stare at the screen all night.</p>
<p>A good ward can answer a question nobody wrote down in advance — "why does this patient get worse only after lunch?" — because the notes, the numbers and the changes are all there. A backend is the same. That ability is what this course builds.</p>

<h3>Words people mix up</h3>
<table>
  <thead><tr><th>Pair</th><th>The difference</th><th>Where in the course</th></tr></thead>
  <tbody>
    <tr><td><strong>Monitoring</strong> vs <strong>observability</strong></td><td>Monitoring checks questions you wrote down in advance ("is the process up?"). Observability lets you ask new questions afterwards ("why only this user, only above 4 MB?").</td><td>0.1</td></tr>
    <tr><td><strong>Log</strong> vs <strong>metric</strong> vs <strong>trace</strong></td><td>A log is one event in full detail. A metric is many events summarised into a number. A trace is one request followed across every step, with timing.</td><td>0.2, Ch 1, 4, 6</td></tr>
    <tr><td><strong>Error tracking</strong> vs <strong>logging</strong></td><td>A tool such as Sentry groups thousands of identical exceptions into one issue with a stack trace and a release; a log just records lines.</td><td>Ch 7</td></tr>
    <tr><td><strong>Health check</strong> vs <strong>checking from outside</strong></td><td>A health endpoint reports only what it tests, from inside. An external check hits the site the way a user does, from somewhere else.</td><td>Ch 8</td></tr>
    <tr><td><strong>Alert</strong> vs <strong>notification</strong></td><td>An alert is a promise to wake a person, so it must be rare and actionable. A message that nobody is expected to read is not an alert.</td><td>Ch 9</td></tr>
    <tr><td><strong>SLI</strong> vs <strong>SLO</strong> vs <strong>SLA</strong></td><td>SLI: the number you measure (share of requests under 500 ms). SLO: the target you set yourself (99% of them). SLA: a promise in a contract, with a penalty.</td><td>9.3</td></tr>
    <tr><td><strong>APM</strong> vs <strong>observability</strong></td><td>APM (application performance monitoring) is a product category that bundles several pillars behind one vendor. Observability is the property; a product is one way to get some of it.</td><td>7.5, 12.2</td></tr>
  </tbody>
</table>

<h3>A short history — with sources</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1960</span><span class="lz-t">The word comes from control theory</span><span class="lz-d">Rudolf E. Kalman defines a system as "observable" if its internal state can be worked out from its outputs (Kalman, "On the general theory of control systems", 1960). Software borrowed the word decades later.</span></div>
  <div class="lz-step"><span class="lz-k">1980s</span><span class="lz-t">syslog: every program writes lines to one place</span><span class="lz-d">Eric Allman writes syslog as part of the Sendmail project. The IETF documents it in RFC 3164 (August 2001) and standardises it as RFC 5424 (March 2009). The log line is the oldest pillar.</span></div>
  <div class="lz-step"><span class="lz-k">1999–2002</span><span class="lz-t">Checks that say OK, WARNING, CRITICAL</span><span class="lz-d">Ethan Galstad releases NetSaint on 14 March 1999; it is renamed Nagios in 2002. Plug-ins test hosts and services every few minutes and send email or pager alerts — classic monitoring of questions written in advance.</span></div>
  <div class="lz-step"><span class="lz-k">2010</span><span class="lz-t">Following one request through many servers</span><span class="lz-d">Google publishes "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure" (Sigelman et al.). The span-and-trace model it describes is the one you will use in Chapter 6.</span></div>
  <div class="lz-step"><span class="lz-k">2012–2018</span><span class="lz-t">Metrics as time series with labels</span><span class="lz-d">Prometheus starts at SoundCloud in 2012, after its StatsD- and Graphite-based tools could not keep up. It is announced publicly in January 2015, accepted by the CNCF in May 2016 as its second project after Kubernetes, and graduates in August 2018.</span></div>
  <div class="lz-step"><span class="lz-k">2016</span><span class="lz-t">The four golden signals</span><span class="lz-d">Google's Site Reliability Engineering book names latency, traffic, errors and saturation: "If you can only measure four metrics of your user-facing system, focus on these four." Chapter 4 starts from there.</span></div>
  <div class="lz-step"><span class="lz-k">2019</span><span class="lz-t">One open standard instead of two</span><span class="lz-d">The OpenTracing and OpenCensus projects merge into OpenTelemetry under the CNCF (announced May 2019). It is what Chapter 6 installs in Node.</span></div>
</div>
<p>Notice the direction: from "write a line somewhere" and "check a list of things every five minutes" to "record enough, in an open format, that you can ask a question nobody predicted". That is exactly the direction of this course.</p>

<h3>Why it was born</h3>
<p>Three changes made "is the server up?" stop being enough:</p>
<ul>
  <li><strong>One request stopped living in one place.</strong> A click now goes through a proxy, a Node process, a database, a queue and a worker. A failure in the middle shows up somewhere else, and only something that links the steps — a correlation id, a trace — can connect cause to symptom.</li>
  <li><strong>Failures stopped being "down".</strong> The usual outage today is "slow for some users", "broken for one feature", "wrong for anyone with a long name". A process-alive check is green through all of them.</li>
  <li><strong>The person fixing it is not the person who wrote it — and it is 2 a.m.</strong> Without recorded detail, every investigation starts from guessing. With it, the investigation starts from evidence.</li>
</ul>

<div class="pitfall"><p><strong>Trap — "we installed Grafana, so we have observability".</strong> A dashboard over the wrong numbers is decoration. If your logs cannot be tied to one request, if your only metric is CPU, and if nobody is woken when users see errors, a beautiful tool changes nothing. This course teaches the mechanism first — what each signal costs and what it can prove — and the tool second, because tools are replaceable and the mechanism is not.</p></div>

<h3>What this does for you — concretely</h3>
<ul>
  <li><strong>Team projects (SWP391, capstone):</strong> when the demo breaks the night before, you can open one log line with a request id and say exactly which request failed and why — instead of restarting everything and hoping.</li>
  <li><strong>Internship and junior interviews:</strong> typical questions are "What is the difference between monitoring and observability?", "Why is the average response time misleading?", "How would you debug an endpoint that is slow only in production?", "What would you alert on?", "What is a correlation id?". Lessons 0.1, 4.2, 11.1, 9.1 and 3.1 answer each one.</li>
  <li><strong>Backend work:</strong> real tickets look like "users say the upload sometimes hangs" or "the server restarts at night". Those are observability questions disguised as coding tasks — and being the person who can answer them is noticed.</li>
  <li><strong>Your own VPS:</strong> this course is built around one Node.js service on one machine — the setup students and small teams actually run — not a cluster you do not have.</li>
</ul>

<h3>What you will be able to do by the end</h3>
<ul>
  <li>Write structured JSON logs, know what a log line costs, and keep stdout from blocking your process (Chapter 1).</li>
  <li>Get logs off the machine with rotation and retention that will not fill the disk, and query them with LogQL (Chapter 2).</li>
  <li>Follow one request through every log line with AsyncLocalStorage and W3C Trace Context (Chapter 3).</li>
  <li>Choose the right kind of metric, use histograms for percentiles, and avoid the label that takes down your monitoring (Chapters 4–5).</li>
  <li>Read a trace waterfall, and know when tracing is not worth its cost (Chapter 6).</li>
  <li>Track errors without leaking personal data, and tie them to releases (Chapter 7).</li>
  <li>Write health checks that mean something, and alerts derived from SLOs instead of guesses (Chapters 8–9).</li>
  <li>Build three dashboards people read, and go from alert to cause in a calm first five minutes (Chapters 10–11).</li>
  <li>Decide what to build first for a real service, in order (Chapter 12).</li>
</ul>

<h3>The roadmap</h3>
<table>
  <thead><tr><th>Phase</th><th>Sections</th><th>You can then…</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · See one request</strong></td><td>0 Before you measure · 1 Structured logs · 2 The log pipeline · 3 Correlation</td><td>find every line of one failing request</td></tr>
    <tr><td><strong>2 · Count and time</strong></td><td>4 Metrics · 5 Node.js metrics · 6 Tracing</td><td>know p99 latency, error rate, and where the time went</td></tr>
    <tr><td><strong>3 · Errors and health</strong></td><td>7 Errors and Sentry · 8 Health checks</td><td>see each bug once, with its release, and trust your probes</td></tr>
    <tr><td><strong>4 · Act on it</strong></td><td>9 Alerting · 10 Dashboards · 11 Diagnosis</td><td>be woken only when users are hurting, and find the cause fast</td></tr>
    <tr><td><strong>5 · Decide</strong></td><td>12 What survived measurement</td><td>plan what to build first for any Node service</td></tr>
  </tbody>
</table>

<h3>What you need before you start</h3>
<ul>
  <li><strong>Needed:</strong> basic JavaScript and a little Express (a route, a middleware), comfort typing commands in a terminal, and Node.js 22 installed — the course's measurements were run on Node 22.22.2.</li>
  <li><strong>Helpful later:</strong> Docker, from Chapter 2 on, to see what it does with your log lines. A VPS is useful but not required; every early measurement runs on your laptop.</li>
  <li><strong>Not needed:</strong> any account or vendor. Lesson 0.3 builds the measuring rig from tools that ship inside Node; Prometheus, Grafana, Loki, OpenTelemetry and Sentry arrive only in the chapters that need them.</li>
</ul>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>node -v</code> in a terminal and note the version. Anything from 22 upwards will reproduce the course's numbers closely.</li>
  <li>Pick a backend you know — your team project, or any app you use every day.</li>
  <li>Write three questions you would want answered at 2 a.m. if it broke ("which requests failed?", "since when?", "what changed?").</li>
  <li>Next to each question, write which signal would answer it: log, metric, trace, or change event. Use the ward picture above if you are unsure.</li>
</ol>
<p><strong>Done when:</strong> you have your Node version and three questions, each matched to one signal. There is no wrong answer yet — lesson 0.2 shows how to check your choices.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Observability</span><span class="v">How well you can work out what is happening inside a system from what it emits, including questions nobody predicted.</span></div>
  <div class="kv"><span class="k">Monitoring</span><span class="v">Checking, again and again, conditions you decided in advance.</span></div>
  <div class="kv"><span class="k">Telemetry</span><span class="v">Everything a system emits about itself: logs, metrics, traces, error reports, change events.</span></div>
  <div class="kv"><span class="k">Log</span><span class="v">One event recorded in full detail, ideally as structured JSON.</span></div>
  <div class="kv"><span class="k">Metric</span><span class="v">Many events summarised as a number over time, such as requests per second.</span></div>
  <div class="kv"><span class="k">Trace / span</span><span class="v">One request followed across every step; each step is a timed span with a parent.</span></div>
  <div class="kv"><span class="k">Golden signals</span><span class="v">Latency, traffic, errors, saturation — the four numbers Google's SRE book says to watch first.</span></div>
  <div class="kv"><span class="k">SLI / SLO / SLA</span><span class="v">What you measure / the target you set / the target you promised in a contract.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Observability is being able to explain a running system from its signals, including for questions you never planned.</li>
  <li>Monitoring answers fixed questions; logs, metrics, traces, errors and change events each answer a different kind of question at a different cost.</li>
  <li>The history runs from Kalman's control theory (1960) and syslog (1980s) through Nagios checks, Dapper traces and Prometheus metrics to the open OpenTelemetry standard (2019).</li>
  <li>It was born because requests span many processes, failures became partial, and the person fixing them needs evidence instead of guesses.</li>
  <li>You need basic JavaScript, a terminal and Node 22 — no vendor accounts — and the course moves from one request to metrics, health, alerts and diagnosis.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Observability in control theory, Kalman (1960): <a href="https://en.wikipedia.org/wiki/Observability" target="_blank" rel="noopener">en.wikipedia.org/wiki/Observability</a></li>
  <li>syslog history, RFC 3164 and RFC 5424: <a href="https://en.wikipedia.org/wiki/Syslog" target="_blank" rel="noopener">en.wikipedia.org/wiki/Syslog</a> · <a href="https://www.rfc-editor.org/rfc/rfc5424" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc5424</a></li>
  <li>NetSaint and Nagios: <a href="https://en.wikipedia.org/wiki/Nagios" target="_blank" rel="noopener">en.wikipedia.org/wiki/Nagios</a></li>
  <li>Dapper (Google, 2010): <a href="https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/" target="_blank" rel="noopener">research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure</a></li>
  <li>Prometheus history: <a href="https://prometheus.io/docs/introduction/overview/" target="_blank" rel="noopener">prometheus.io/docs/introduction/overview</a> · <a href="https://en.wikipedia.org/wiki/Prometheus_(software)" target="_blank" rel="noopener">en.wikipedia.org/wiki/Prometheus_(software)</a></li>
  <li>The four golden signals: <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">sre.google/sre-book/monitoring-distributed-systems</a></li>
  <li>OpenTelemetry history (CNCF, May 2019): <a href="https://www.cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far/" target="_blank" rel="noopener">cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far</a></li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Observability là gì, ra đời thế nào, và vì sao nó quan trọng với bạn</h2>
<p class="lead">Chào bạn. Nếu bạn từng deploy một backend, chắc bạn đã gặp khoảnh khắc này: có người nhắn "web hỏng rồi", bạn mở máy chủ ra, tiến trình vẫn chạy, không có gì đỏ — và bạn hoàn toàn không biết chuyện gì đã xảy ra. Khoá này là để lấp khoảng trống đó. Không phải làm hệ thống hoàn hảo, mà làm cho nó <em>tự kể</em> cho bạn nghe nó đang làm gì, nhất là lúc bạn không nhìn. Ta bắt đầu mà chưa cần cài công cụ nào, và đi chậm thôi.</p>

<h3>Observability trong một câu — rồi trong một phòng hồi sức</h3>
<p><strong>Observability</strong> (khả năng quan sát) là mức độ bạn suy ra được điều gì đang diễn ra bên trong một hệ thống đang chạy từ những tín hiệu nó phát ra — mà không phải thêm code rồi deploy lại mỗi lần nảy ra một câu hỏi mới.</p>
<p>Hãy hình dung một phòng hồi sức. Mỗi bệnh nhân có một <strong>màn hình</strong> hiện nhịp tim và nồng độ oxy thành con số theo thời gian — đó là <em>chỉ số</em> (metric). Y tá ghi <strong>sổ</strong> mỗi lần có chuyện: "14:02, tiêm 5 mg, bệnh nhân kêu đau" — đó là <em>log</em>. Khi bệnh nhân được chuyển từ cấp cứu sang chụp X-quang rồi sang phòng mổ, ai đó lần theo được <strong>đường đi</strong> và thấy thời gian trôi vào đâu — đó là <em>trace</em>. Bệnh án còn ghi lại <strong>các thay đổi</strong>: thuốc mới, liều mới — và khi nhịp tim vọt lên, câu hỏi đầu tiên luôn là "ngay trước đó đã đổi gì?". Cuối cùng có một <strong>chuông báo</strong> kêu khi oxy tụt dưới một vạch, để y tá không phải nhìn chằm chằm vào màn hình cả đêm.</p>
<p>Một phòng hồi sức tốt trả lời được cả câu hỏi chưa ai viết ra từ trước — "sao bệnh nhân này chỉ xấu đi sau bữa trưa?" — vì sổ ghi, con số và các thay đổi đều còn đó. Backend cũng vậy. Khả năng ấy chính là thứ khoá này dựng cho bạn.</p>

<h3>Những cặp từ hay bị dùng lẫn</h3>
<table>
  <thead><tr><th>Cặp</th><th>Khác nhau ở đâu</th><th>Học ở đâu</th></tr></thead>
  <tbody>
    <tr><td><strong>Monitoring</strong> và <strong>observability</strong></td><td>Monitoring (giám sát) kiểm những câu hỏi bạn đã viết sẵn ("tiến trình còn sống không?"). Observability cho bạn hỏi câu mới sau khi sự việc đã xảy ra ("sao chỉ người này, chỉ khi tệp trên 4 MB?").</td><td>0.1</td></tr>
    <tr><td><strong>Log</strong>, <strong>chỉ số</strong> và <strong>trace</strong></td><td>Log là một sự kiện ghi đầy đủ chi tiết. Chỉ số là rất nhiều sự kiện gộp thành một con số. Trace là một request được lần theo qua từng bước, có đo thời gian.</td><td>0.2, Ch 1, 4, 6</td></tr>
    <tr><td><strong>Theo dõi lỗi</strong> và <strong>ghi log</strong></td><td>Công cụ như Sentry gom hàng nghìn ngoại lệ giống nhau thành một vấn đề, kèm stack trace và phiên bản phát hành; log thì chỉ ghi từng dòng.</td><td>Ch 7</td></tr>
    <tr><td><strong>Health check</strong> và <strong>kiểm từ bên ngoài</strong></td><td>Endpoint kiểm sức khoẻ chỉ báo đúng những gì nó kiểm, từ bên trong. Phép kiểm bên ngoài gọi vào trang như một người dùng thật, từ một nơi khác.</td><td>Ch 8</td></tr>
    <tr><td><strong>Cảnh báo</strong> và <strong>thông báo</strong></td><td>Cảnh báo là lời hứa sẽ đánh thức một người, nên phải hiếm và làm được gì đó ngay. Một tin nhắn không ai được kỳ vọng đọc thì không phải cảnh báo.</td><td>Ch 9</td></tr>
    <tr><td><strong>SLI</strong>, <strong>SLO</strong> và <strong>SLA</strong></td><td>SLI: con số bạn đo (tỷ lệ request dưới 500 ms). SLO: mục tiêu bạn tự đặt (99% trong số đó). SLA: lời hứa ghi trong hợp đồng, sai thì bị phạt.</td><td>9.3</td></tr>
    <tr><td><strong>APM</strong> và <strong>observability</strong></td><td>APM (giám sát hiệu năng ứng dụng) là một loại sản phẩm gói nhiều trụ cột vào một nhà cung cấp. Observability là một tính chất; sản phẩm chỉ là một cách để có được một phần của nó.</td><td>7.5, 12.2</td></tr>
  </tbody>
</table>

<h3>Một chút lịch sử — có nguồn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1960</span><span class="lz-t">Chữ này đến từ lý thuyết điều khiển</span><span class="lz-d">Rudolf E. Kálmán gọi một hệ là "quan sát được" nếu suy ra được trạng thái bên trong từ những gì nó xuất ra (Kalman, "On the general theory of control systems", 1960). Ngành phần mềm mượn chữ này mấy chục năm sau.</span></div>
  <div class="lz-step"><span class="lz-k">Thập niên 1980</span><span class="lz-t">syslog: mọi chương trình ghi dòng về một chỗ</span><span class="lz-d">Eric Allman viết syslog trong dự án Sendmail. IETF ghi nhận nó ở RFC 3164 (8/2001) và chuẩn hoá thành RFC 5424 (3/2009). Dòng log là trụ cột lâu đời nhất.</span></div>
  <div class="lz-step"><span class="lz-k">1999–2002</span><span class="lz-t">Những phép kiểm báo OK, WARNING, CRITICAL</span><span class="lz-d">Ethan Galstad phát hành NetSaint ngày 14/3/1999; năm 2002 nó đổi tên thành Nagios. Các plug-in kiểm máy và dịch vụ vài phút một lần rồi gửi email hoặc nhắn máy nhắn tin — giám sát kiểu cổ điển, chỉ cho những câu hỏi viết sẵn.</span></div>
  <div class="lz-step"><span class="lz-k">2010</span><span class="lz-t">Lần theo một request qua nhiều máy chủ</span><span class="lz-d">Google công bố "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure" (Sigelman và cộng sự). Mô hình span và trace trong đó chính là mô hình bạn dùng ở Chương 6.</span></div>
  <div class="lz-step"><span class="lz-k">2012–2018</span><span class="lz-t">Chỉ số thành chuỗi thời gian có nhãn</span><span class="lz-d">Prometheus bắt đầu ở SoundCloud năm 2012, khi bộ công cụ dựa trên StatsD và Graphite không theo kịp. Nó công bố rộng rãi tháng 1/2015, được CNCF nhận tháng 5/2016 làm dự án thứ hai sau Kubernetes, và "tốt nghiệp" tháng 8/2018.</span></div>
  <div class="lz-step"><span class="lz-k">2016</span><span class="lz-t">Bốn tín hiệu vàng</span><span class="lz-d">Cuốn Site Reliability Engineering của Google gọi tên độ trễ, lưu lượng, lỗi và độ bão hoà: "nếu chỉ đo được bốn chỉ số của hệ thống phục vụ người dùng, hãy tập trung vào bốn cái này". Chương 4 xuất phát từ đó.</span></div>
  <div class="lz-step"><span class="lz-k">2019</span><span class="lz-t">Một chuẩn mở thay cho hai</span><span class="lz-d">Hai dự án OpenTracing và OpenCensus nhập làm một thành OpenTelemetry dưới CNCF (công bố tháng 5/2019). Đây là thứ Chương 6 cài vào Node.</span></div>
</div>
<p>Để ý hướng đi: từ "ghi một dòng ở đâu đó" và "năm phút kiểm một danh sách" tới "ghi đủ, theo một định dạng mở, để hỏi được cả câu chưa ai đoán trước". Đó cũng đúng là hướng đi của khoá này.</p>

<h3>Vì sao nó ra đời</h3>
<p>Ba thay đổi khiến câu "máy chủ còn sống không?" không còn đủ:</p>
<ul>
  <li><strong>Một request không còn sống ở một chỗ.</strong> Một cú bấm giờ đi qua proxy, tiến trình Node, cơ sở dữ liệu, hàng đợi và worker. Hỏng ở giữa thì triệu chứng hiện ra ở chỗ khác, và chỉ thứ gì nối được các bước — correlation id, trace — mới nối được nguyên nhân với triệu chứng.</li>
  <li><strong>Sự cố không còn là "sập".</strong> Sự cố thường gặp bây giờ là "chậm với một số người", "hỏng đúng một tính năng", "sai với ai có tên dài". Phép kiểm "tiến trình còn sống" vẫn xanh suốt những lúc đó.</li>
  <li><strong>Người sửa không phải người viết — và lúc ấy là 2 giờ sáng.</strong> Không có chi tiết được ghi lại thì mọi cuộc điều tra bắt đầu bằng đoán mò. Có chi tiết thì nó bắt đầu bằng bằng chứng.</li>
</ul>

<div class="pitfall"><p><strong>Bẫy — "đã cài Grafana rồi, vậy là có observability".</strong> Bảng theo dõi vẽ trên con số sai chỉ là đồ trang trí. Nếu log không nối được về một request, nếu chỉ số duy nhất là CPU, và nếu không ai bị đánh thức khi người dùng gặp lỗi, thì công cụ đẹp đến đâu cũng không đổi được gì. Khoá này dạy cơ chế trước — mỗi tín hiệu tốn bao nhiêu và chứng minh được gì — rồi mới tới công cụ, vì công cụ thay được còn cơ chế thì không.</p></div>

<h3>Nó giúp gì cho bạn — cụ thể</h3>
<ul>
  <li><strong>Đồ án nhóm (SWP391, đồ án tốt nghiệp):</strong> khi đêm trước buổi bảo vệ bản demo hỏng, bạn mở được đúng một dòng log có request id và nói chính xác request nào lỗi, vì sao — thay vì khởi động lại tất cả rồi cầu may.</li>
  <li><strong>Phỏng vấn thực tập và junior:</strong> câu hay gặp: "Monitoring khác observability thế nào?", "Vì sao thời gian phản hồi trung bình gây hiểu lầm?", "Một endpoint chỉ chậm trên production thì bạn gỡ thế nào?", "Bạn sẽ đặt cảnh báo cho cái gì?", "Correlation id là gì?". Các bài 0.1, 4.2, 11.1, 9.1 và 3.1 trả lời lần lượt từng câu.</li>
  <li><strong>Đi làm backend:</strong> ticket thật thường là "người dùng bảo thỉnh thoảng tải tệp bị treo" hay "máy chủ tự khởi động lại ban đêm". Đó là câu hỏi observability đội lốt việc viết code — và người trả lời được chúng sẽ được để ý.</li>
  <li><strong>VPS của chính bạn:</strong> khoá này xoay quanh một dịch vụ Node.js trên một máy — đúng kiểu sinh viên và nhóm nhỏ thật sự chạy — chứ không phải một cụm máy bạn không có.</li>
</ul>

<h3>Học xong bạn tự làm được gì</h3>
<ul>
  <li>Ghi log JSON có cấu trúc, biết một dòng log tốn bao nhiêu, và không để stdout chặn tiến trình (Chương 1).</li>
  <li>Đưa log ra khỏi máy, xoay vòng và lưu giữ sao cho không đầy đĩa, và hỏi log bằng LogQL (Chương 2).</li>
  <li>Lần theo một request qua mọi dòng log bằng AsyncLocalStorage và W3C Trace Context (Chương 3).</li>
  <li>Chọn đúng loại chỉ số, dùng histogram để có phân vị, và tránh cái nhãn đánh sập chính hệ thống giám sát (Chương 4–5).</li>
  <li>Đọc biểu đồ thác của một trace, và biết khi nào trace không đáng cái giá của nó (Chương 6).</li>
  <li>Theo dõi lỗi mà không làm lộ dữ liệu cá nhân, và gắn lỗi với từng bản phát hành (Chương 7).</li>
  <li>Viết health check nói được điều gì đó, và cảnh báo suy ra từ SLO thay vì đoán (Chương 8–9).</li>
  <li>Dựng ba bảng theo dõi mà người ta thật sự đọc, và đi từ cảnh báo tới nguyên nhân trong năm phút đầu bình tĩnh (Chương 10–11).</li>
  <li>Quyết định nên dựng gì trước, theo thứ tự, cho một dịch vụ thật (Chương 12).</li>
</ul>

<h3>Lộ trình</h3>
<table>
  <thead><tr><th>Chặng</th><th>Các mục</th><th>Xong chặng bạn sẽ…</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · Thấy một request</strong></td><td>0 Trước khi đo · 1 Log có cấu trúc · 2 Đường ống log · 3 Correlation</td><td>tìm được mọi dòng log của một request bị lỗi</td></tr>
    <tr><td><strong>2 · Đếm và đo giờ</strong></td><td>4 Chỉ số · 5 Chỉ số riêng của Node.js · 6 Trace</td><td>biết độ trễ p99, tỷ lệ lỗi, và thời gian trôi vào đâu</td></tr>
    <tr><td><strong>3 · Lỗi và sức khoẻ</strong></td><td>7 Lỗi và Sentry · 8 Health check</td><td>thấy mỗi lỗi đúng một lần, kèm phiên bản, và tin được phép thăm dò của mình</td></tr>
    <tr><td><strong>4 · Hành động</strong></td><td>9 Cảnh báo · 10 Bảng theo dõi · 11 Chẩn đoán</td><td>chỉ bị đánh thức khi người dùng thật sự khổ, và tìm ra nguyên nhân nhanh</td></tr>
    <tr><td><strong>5 · Quyết định</strong></td><td>12 Những gì sống sót qua phép đo</td><td>lập kế hoạch dựng gì trước cho bất kỳ dịch vụ Node nào</td></tr>
  </tbody>
</table>

<h3>Cần gì trước khi học</h3>
<ul>
  <li><strong>Cần:</strong> JavaScript cơ bản và một chút Express (một route, một middleware), quen gõ lệnh trong terminal, và đã cài Node.js 22 — các phép đo trong khoá chạy trên Node 22.22.2.</li>
  <li><strong>Có thì tốt (về sau):</strong> Docker, từ Chương 2, để xem nó làm gì với dòng log của bạn. VPS có thì hay nhưng không bắt buộc; mọi phép đo ở các chương đầu chạy được trên laptop.</li>
  <li><strong>Không cần:</strong> tài khoản hay nhà cung cấp nào. Bài 0.3 dựng bộ đồ nghề đo từ những thứ có sẵn trong Node; Prometheus, Grafana, Loki, OpenTelemetry và Sentry chỉ xuất hiện ở chương cần tới chúng.</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>node -v</code> trong terminal và ghi lại phiên bản. Từ 22 trở lên là tái tạo được các con số của khoá khá sát.</li>
  <li>Chọn một backend bạn biết — đồ án nhóm, hoặc một app bạn dùng hằng ngày.</li>
  <li>Viết ba câu hỏi bạn muốn có câu trả lời nếu nó hỏng lúc 2 giờ sáng ("request nào lỗi?", "từ lúc nào?", "đã đổi gì?").</li>
  <li>Cạnh mỗi câu, ghi tín hiệu nào trả lời được nó: log, chỉ số, trace hay sự kiện thay đổi. Phân vân thì nhớ lại phòng hồi sức ở trên.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có phiên bản Node và ba câu hỏi, mỗi câu gắn với một tín hiệu. Chưa có đáp án sai — bài 0.2 sẽ chỉ cách tự kiểm lựa chọn của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Observability (khả năng quan sát)</span><span class="v">Mức độ suy ra được điều đang diễn ra bên trong hệ thống từ những gì nó phát ra, kể cả câu hỏi chưa ai đoán trước.</span></div>
  <div class="kv"><span class="k">Monitoring (giám sát)</span><span class="v">Kiểm đi kiểm lại những điều kiện bạn đã quyết từ trước.</span></div>
  <div class="kv"><span class="k">Telemetry (dữ liệu đo từ xa)</span><span class="v">Mọi thứ hệ thống phát ra về chính nó: log, chỉ số, trace, báo cáo lỗi, sự kiện thay đổi.</span></div>
  <div class="kv"><span class="k">Log</span><span class="v">Một sự kiện được ghi đầy đủ chi tiết, tốt nhất là JSON có cấu trúc.</span></div>
  <div class="kv"><span class="k">Metric (chỉ số)</span><span class="v">Nhiều sự kiện gộp thành một con số theo thời gian, ví dụ số request mỗi giây.</span></div>
  <div class="kv"><span class="k">Trace / span</span><span class="v">Một request được lần theo qua mọi bước; mỗi bước là một span có đo giờ và có cha.</span></div>
  <div class="kv"><span class="k">Golden signals (tín hiệu vàng)</span><span class="v">Độ trễ, lưu lượng, lỗi, độ bão hoà — bốn con số sách SRE của Google bảo nhìn trước tiên.</span></div>
  <div class="kv"><span class="k">SLI / SLO / SLA</span><span class="v">Thứ bạn đo / mục tiêu bạn tự đặt / mục tiêu bạn đã hứa trong hợp đồng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Observability là giải thích được một hệ thống đang chạy từ tín hiệu của nó, kể cả với câu hỏi bạn chưa từng lường trước.</li>
  <li>Monitoring trả lời câu hỏi cố định; log, chỉ số, trace, lỗi và sự kiện thay đổi mỗi thứ trả lời một kiểu câu hỏi với một mức chi phí khác nhau.</li>
  <li>Lịch sử đi từ lý thuyết điều khiển của Kálmán (1960) và syslog (thập niên 1980), qua phép kiểm của Nagios, trace của Dapper, chỉ số của Prometheus, tới chuẩn mở OpenTelemetry (2019).</li>
  <li>Nó ra đời vì request đi qua nhiều tiến trình, sự cố trở nên cục bộ, và người sửa cần bằng chứng chứ không cần đoán.</li>
  <li>Bạn cần JavaScript cơ bản, một terminal và Node 22 — không cần tài khoản nhà cung cấp nào — và khoá đi từ một request tới chỉ số, sức khoẻ, cảnh báo và chẩn đoán.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Khả năng quan sát trong lý thuyết điều khiển, Kálmán (1960): <a href="https://en.wikipedia.org/wiki/Observability" target="_blank" rel="noopener">en.wikipedia.org/wiki/Observability</a></li>
  <li>Lịch sử syslog, RFC 3164 và RFC 5424: <a href="https://en.wikipedia.org/wiki/Syslog" target="_blank" rel="noopener">en.wikipedia.org/wiki/Syslog</a> · <a href="https://www.rfc-editor.org/rfc/rfc5424" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc5424</a></li>
  <li>NetSaint và Nagios: <a href="https://en.wikipedia.org/wiki/Nagios" target="_blank" rel="noopener">en.wikipedia.org/wiki/Nagios</a></li>
  <li>Dapper (Google, 2010): <a href="https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/" target="_blank" rel="noopener">research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure</a></li>
  <li>Lịch sử Prometheus: <a href="https://prometheus.io/docs/introduction/overview/" target="_blank" rel="noopener">prometheus.io/docs/introduction/overview</a> · <a href="https://en.wikipedia.org/wiki/Prometheus_(software)" target="_blank" rel="noopener">en.wikipedia.org/wiki/Prometheus_(software)</a></li>
  <li>Bốn tín hiệu vàng: <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">sre.google/sre-book/monitoring-distributed-systems</a></li>
  <li>Lịch sử OpenTelemetry (CNCF, 5/2019): <a href="https://www.cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far/" target="_blank" rel="noopener">cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far</a></li>
</ul>
</div>
<div class="ml-en">
<h3>🔗 Connected lessons</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-15-1-log-co-cau-truc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js · 15.1 — Three pillars, and why console.log runs out</span><span class="lc-sub">The same three pillars from inside a Node application course — a shorter first pass if you want one before Chapter 1.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-9-1-do-cai-gi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy VPS · 9.1 — What to measure, and the number that lies</span><span class="lc-sub">Monitoring seen from the server you deploy to: which numbers matter on a real VPS.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>
<div class="ml-vi">
<h3>🔗 Bài liên quan</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-15-1-log-co-cau-truc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js · 15.1 — Ba trụ cột, và điểm dừng của console.log</span><span class="lc-sub">Cũng ba trụ cột ấy, nhìn từ khoá Node.js — một vòng làm quen ngắn hơn nếu bạn muốn trước Chương 1.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-9-1-do-cai-gi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy lên VPS · 9.1 — Đo cái gì, và con số NÓI DỐI</span><span class="lc-sub">Giám sát nhìn từ chính máy chủ bạn deploy lên: con số nào thật sự quan trọng trên một VPS.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ──────────────────── Bắt đầu tại đây 2/2 ──────────────────── */
    {
      title: 'Start here (2/2) — Flying blind: real incidents, and how to learn this without giving up|||Bắt đầu tại đây (2/2) — Khi bay mù: những sự cố thật, và cách học để không bỏ cuộc',
      slug: 'obs-0-9-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn sự cố có nguồn (Knight Capital 2012, AWS S3 2017, GitLab 2017, Facebook 2021) và các sự cố thật của chính kho này — mỗi cái: chuyện gì xảy ra, cái gì lẽ ra phải phát hiện, học ở chương nào; một tình huống minh hoạ đêm trước buổi bảo vệ đồ án; vì sao người mới hay nản và cách sửa; nhịp mỗi buổi học, lộ trình tối thiểu/đầy đủ, cách hỏi khi bí, các mốc tự đánh dấu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Flying blind: real incidents, and how to learn this without giving up</h2>
<p class="lead">Advice about logs and alerts can sound like paperwork: add an id here, a counter there, a rule for this. This lesson shows where that advice comes from — real incidents, with sources you can open, where the system was failing and the people running it could not see it, or saw it and did not know it mattered. Then we turn to you: a typical student-project disaster, why people give up on this topic, and a study plan that keeps you going.</p>

<h3>How to read the stories</h3>
<p>Every incident below links to a source: the company's own post-mortem or a regulator's filing. Numbers are the ones those sources give. For each story we ask three questions: <strong>what happened</strong>, <strong>what should have noticed it — and what actually did</strong>, and <strong>which chapter teaches the defence</strong>.</p>

<h3>1 · Knight Capital, 2012 — 97 emails that were not alerts</h3>
<p>On 1 August 2012, Knight Capital deployed new trading code, but one of its servers still ran an old, retired function. According to the US Securities and Exchange Commission's order (October 2013), in about 45 minutes the system sent orders that produced some 4 million executions in 154 stocks, and Knight lost more than $460 million. The detail that matters for this course: from about 8:01 a.m., before the market opened at 9:30, an internal system sent <strong>97 automated emails</strong> to a group of staff mentioning an error, "Power Peg disabled". In the SEC's words, Knight "did not design these types of messages to be system alerts, and Knight personnel generally did not review them".</p>
<p><strong>What it teaches:</strong> a message nobody is responsible for reading is not an alert, no matter how many you send. An alert needs an owner, a clear meaning, and few enough siblings that each one is read. Chapter 9 (an alert is a promise to wake someone; alert fatigue).</p>

<h3>2 · GitLab, 2017 — the backups that failed silently</h3>
<p>On 31 January 2017, while fighting a load problem, a GitLab engineer accidentally deleted the data directory of the production PostgreSQL primary. Restoring should have been routine. GitLab's post-mortem (10 February 2017) explains why it was not: the regular <code>pg_dump</code> backup "failed silently because it was using PostgreSQL 9.2, while GitLab.com runs on PostgreSQL 9.6". The job did send failure emails — but they "were rejected by the receiver" because of an email-authentication (DMARC) setting, so nobody saw them. Data created between 17:20 and 23:30 UTC was lost; GitLab estimated at least 5,000 projects, 5,000 comments and about 700 users.</p>
<p><strong>What it teaches:</strong> "no news" is not "good news". A job that can fail silently needs a signal when it <em>succeeds</em>, and an alert when that signal stops arriving — and the path that delivers alerts must itself be tested. Chapters 8 and 9.</p>

<h3>3 · Amazon S3, 2017 — the status page that depended on what it reported</h3>
<p>On 28 February 2017 at 9:37 a.m. PST, an S3 engineer following an established playbook ran a command with one input entered incorrectly, and far more servers were removed than intended. Two core S3 subsystems needed a full restart; S3 in the US-EAST-1 region finished recovering at 1:54 p.m. PST. AWS's own summary adds the part every monitoring engineer remembers: until 11:37 a.m. it could not update the individual services' status on its Service Health Dashboard "because of a dependency the SHD administration console has on Amazon S3".</p>
<p><strong>What it teaches:</strong> the thing that watches must not share a failure with the thing it watches. Check from outside, from somewhere the outage cannot reach. Lesson 8.5 (checking from outside, where the users are).</p>

<h3>4 · Facebook, 2021 — a health check that switched itself off</h3>
<p>On 4 October 2021, during routine maintenance, a command meant to assess backbone capacity "unintentionally took down all the connections in our backbone network", wrote Santosh Janardhan in Facebook's engineering post the next day. Then a safety mechanism made it worse: the DNS servers "disable those BGP advertisements if they themselves can not speak to our data centers" — a health check that acts — so the whole of Facebook vanished from the internet. And "the total loss of DNS broke many of the internal tools we'd normally use to investigate and resolve outages like this"; with primary and out-of-band access down, engineers had to be sent onsite.</p>
<p><strong>What it teaches:</strong> a probe that <em>does</em> something (withdraws traffic, restarts a process) needs as much care as the code it protects, and your diagnostic tools must not depend on the system being healthy. Lessons 8.1–8.2 (four probes; the liveness probe that restarts a healthy service) and Chapter 11.</p>

<h3>5 · This repository — every failure found by a human</h3>
<p>Lesson 0.1 opens with four incidents from this website's own history, recorded in the project's notes. The pattern is the same as above, only smaller: a route was never mounted because a stale build was deployed, and the health check stayed green the whole time because it only ran <code>SELECT 1</code>; after a bad image swap the backend restarted in a loop and users saw a 502 page for seven minutes. In every case the thing that noticed was a person using the site.</p>
<p><strong>What it teaches:</strong> you do not need to be Amazon for this to happen to you. Chapters 1, 8 and 11 take these incidents apart.</p>

<h3>The pattern</h3>
<table>
  <thead><tr><th>Incident</th><th>What really failed</th><th>The defence</th><th>Where</th></tr></thead>
  <tbody>
    <tr><td>Knight 2012</td><td>warnings sent, nobody owned them</td><td>few alerts, each with an owner and a meaning</td><td>Ch 9</td></tr>
    <tr><td>GitLab 2017</td><td>failure was silent, the alert path was broken</td><td>alert on missing success; test the alert path</td><td>Ch 8, 9</td></tr>
    <tr><td>AWS S3 2017</td><td>the monitor depended on the monitored</td><td>check from outside</td><td>8.5</td></tr>
    <tr><td>Facebook 2021</td><td>a probe acted, and the tools died with the network</td><td>careful probes; tools that work during the outage</td><td>8.1–8.2, Ch 11</td></tr>
    <tr><td>This repo</td><td>green health check, broken feature</td><td>health checks that test what users use</td><td>0.1, Ch 8</td></tr>
  </tbody>
</table>
<p>None of these needed exotic technology to prevent. They needed someone to ask, in advance, "how would we know?". That question is what you are about to practise.</p>

<h3>Closer to home: the night before the defence</h3>
<div class="callout warn"><p><strong>Illustrative scenario — not a real event.</strong> Each piece of it, though, is a failure this course reproduces on purpose.</p></div>
<p>A team of four runs its project API in Docker on a small VPS. The night before the defence:</p>
<ol>
  <li>The API prints a debug line for every request with <code>console.log</code>, and Docker's default log driver keeps every line with no rotation. The disk fills; PostgreSQL can no longer write, and bookings start failing with 500.</li>
  <li>The health endpoint only answers "ok" if the process is alive, so the uptime page stays green.</li>
  <li>The error lines that do get written have no request id, so nobody can tell which user, which route, or since when.</li>
  <li>Nothing is configured to tell anyone. The first person to notice is the lecturer pressing "Book" during the demo.</li>
</ol>
<p>Four small gaps, one ruined demo. Lesson 2.2 fixes the rotation, Chapter 8 the health check, Chapter 3 the request id, and Chapter 9 the silence.</p>

<h3>Why people give up on this topic — and the fix</h3>
<ul>
  <li><strong>Too many tools at once</strong> — Prometheus, Grafana, Loki, OpenTelemetry, Sentry. <em>Fix:</em> this course starts with tools that ship inside Node (lesson 0.3) and adds each product only in the chapter that needs it, after you have measured the thing by hand.</li>
  <li><strong>Your numbers do not match the lesson.</strong> <em>Fix:</em> absolute numbers depend on hardware; ratios are the lesson. Lesson 0.4 explains which differences matter.</li>
  <li><strong>It does not feel like "building a feature".</strong> <em>Fix:</em> every chapter ends with a failure you can reproduce and then see. Watching your own tool catch a bug you planted is the moment it clicks.</li>
  <li><strong>English terms pile up</strong> — cardinality, saturation, burn rate. <em>Fix:</em> every lesson ends with a 🗂 key-terms box in Vietnamese.</li>
</ul>

<h3>One study session, five steps</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the question first — 5 minutes</span><span class="lz-d">Each lesson exists to settle one question. Find it before reading the numbers.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Read the lesson — 20 minutes</span><span class="lz-d">The mechanism, the trap, the real output.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Run it yourself — 15 minutes</span><span class="lz-d">Type the script, run it, compare with the out block. Change one thing and predict before you run again.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Practice — 15–20 minutes</span><span class="lz-d">A small task with a "done when" you can check yourself.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Quiz, at the end of each section</span><span class="lz-d">Missed a question? Re-read the lesson it points to before moving on.</span></div>
</div>
<p>One rule: <strong>never paste a command you cannot explain</strong>. Read it, say what each part does, then run it.</p>

<h3>How long it takes</h3>
<table>
  <thead><tr><th>Plan</th><th>What you study</th><th>You finish with</th></tr></thead>
  <tbody>
    <tr><td><strong>Minimum · about 4–5 weeks</strong></td><td>Section 0, Chapter 1, Chapter 3, Chapter 4, lesson 5.5, Chapter 8, Chapter 9, lesson 12.2</td><td>one request traceable end to end, the core metrics, honest health checks and the one alert that matters</td></tr>
    <tr><td><strong>Full · about 9–10 weeks</strong></td><td>all thirteen sections and quizzes</td><td>everything above, plus the log pipeline, Node runtime metrics, tracing, error tracking, dashboards and diagnosis</td></tr>
  </tbody>
</table>
<p>These are estimates at roughly one lesson per day, about an hour each. Behind on the plan? Do not skip ahead — drop the extra experiments instead. Chapter 3 needs the logs from Chapter 1, and Chapter 9 needs the metrics from Chapter 4.</p>

<h3>When you are stuck</h3>
<ol>
  <li><strong>Check the version.</strong> <code>node -v</code> — the course was measured on Node 22.22.2. A very different version can change a number.</li>
  <li><strong>Read the conditions.</strong> Each measurement states what it was taken under: payload size, number of iterations, warm-up. Match them before comparing.</li>
  <li><strong>Compare ratios, not absolutes.</strong> If yours are half of mine across the board, your machine is simply faster.</li>
  <li><strong>Read the output line by line</strong> against the lesson's out block, and find the first line that differs.</li>
  <li><strong>Still stuck?</strong> Ask with four things: the exact command, the full output, your Node version and OS, and what you expected instead.</li>
</ol>

<h3>Milestones to tick</h3>
<ul>
  <li>☐ I can explain monitoring versus observability to a friend.</li>
  <li>☐ My service writes one JSON log line per request.</li>
  <li>☐ I can find every log line of one request by its id.</li>
  <li>☐ I know my p99 latency, not just the average.</li>
  <li>☐ My health check fails when a dependency users need is down.</li>
  <li>☐ One alert would wake me if users saw errors — and I have tested that it arrives.</li>
  <li>☐ I have written a blameless write-up of one incident, even a small one.</li>
</ul>
<p>Write the date next to each tick. On a slow evening, that list is proof that you are moving.</p>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
  <li>Open one of the four incident sources below and read it for five minutes.</li>
  <li>In one sentence, write what should have noticed the problem — and what actually did.</li>
  <li>Write the chapter of this course that teaches the defence, using the pattern table.</li>
  <li>Choose your plan (4–5 weeks or 9–10 weeks) and put the first three study sessions in your calendar.</li>
</ol>
<p><strong>Done when:</strong> you have one "what should have noticed" sentence, one chapter number, and three dated sessions in your calendar.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Post-mortem</span><span class="v">A written account of an incident: timeline, cause, what helped, what will change.</span></div>
  <div class="kv"><span class="k">Silent failure</span><span class="v">A failure that produces no signal anyone sees, like a backup job whose error emails are dropped.</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">A signal sent on success; an alert fires when it stops arriving.</span></div>
  <div class="kv"><span class="k">Alert fatigue</span><span class="v">So many alerts that people stop reading them — the state Knight's 97 emails describe.</span></div>
  <div class="kv"><span class="k">Shared fate</span><span class="v">When the monitor depends on the thing it monitors, so both fail together.</span></div>
  <div class="kv"><span class="k">Out-of-band access</span><span class="v">A way into your systems that does not depend on the systems being healthy.</span></div>
  <div class="kv"><span class="k">Probe</span><span class="v">An automatic check that can also act: remove a server from traffic, restart a process.</span></div>
  <div class="kv"><span class="k">Blameless write-up</span><span class="v">An incident report that looks for causes in the system, not for a person to blame.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Big incidents are usually ordinary gaps in seeing, not exotic technology: unread warnings, silent jobs, monitors that share fate, probes that act.</li>
  <li>An alert needs an owner and a meaning; a job that can fail silently needs a success signal; the monitor must survive what it monitors.</li>
  <li>Student projects fail the same way: a full disk from unrotated logs, a health check that only says "alive", errors with no request id, and nobody told.</li>
  <li>Study loop: find the question → read → run it yourself → 🧪 → quiz; never paste a command you cannot explain.</li>
  <li>Choose the minimum (about 4–5 weeks) or full plan (about 9–10 weeks) and tick the milestones with dates.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Knight Capital: SEC order, Release No. 34-70694, 16 Oct 2013 — <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/litigation/admin/2013/34-70694.pdf</a></li>
  <li>GitLab: post-mortem, 10 Feb 2017 — <a href="https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31</a></li>
  <li>Amazon S3: AWS summary of the 28 Feb 2017 disruption — <a href="https://aws.amazon.com/message/41926/" target="_blank" rel="noopener">aws.amazon.com/message/41926</a></li>
  <li>Facebook: "More details about the October 4 outage", 5 Oct 2021 — <a href="https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/" target="_blank" rel="noopener">engineering.fb.com/2021/10/05/networking-traffic/outage-details</a></li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi bay mù: những sự cố thật, và cách học để không bỏ cuộc</h2>
<p class="lead">Lời khuyên về log và cảnh báo nghe có thể giống thủ tục giấy tờ: thêm cái id chỗ này, cái bộ đếm chỗ kia, một luật cho chỗ nọ. Bài này cho bạn thấy những lời khuyên ấy từ đâu ra — từ những sự cố có thật, có nguồn bạn mở ra đọc được, khi hệ thống đang hỏng mà người vận hành không nhìn thấy, hoặc thấy mà không biết là quan trọng. Sau đó ta quay sang bạn: một "thảm hoạ" điển hình của đồ án sinh viên, vì sao người ta hay bỏ ngang chủ đề này, và một kế hoạch học giữ cho bạn đi tiếp.</p>

<h3>Đọc các câu chuyện thế nào</h3>
<p>Mỗi sự cố dưới đây đều dẫn nguồn: bản phân tích sau sự cố của chính công ty, hoặc văn bản của cơ quan quản lý. Con số là con số các nguồn đó đưa. Với mỗi chuyện ta hỏi ba câu: <strong>chuyện gì đã xảy ra</strong>, <strong>lẽ ra cái gì phải phát hiện ra nó — và thực tế cái gì đã phát hiện</strong>, và <strong>chương nào dạy cách phòng</strong>.</p>

<h3>1 · Knight Capital, 2012 — 97 email không phải cảnh báo</h3>
<p>Ngày 1/8/2012, Knight Capital deploy code giao dịch mới, nhưng một máy chủ vẫn chạy một chức năng cũ đã bỏ. Theo quyết định của Uỷ ban Chứng khoán Mỹ (SEC, tháng 10/2013), trong khoảng 45 phút hệ thống gửi ra những lệnh tạo thành chừng 4 triệu lần khớp lệnh trên 154 mã cổ phiếu, và Knight mất hơn 460 triệu đô-la. Chi tiết đáng kể cho khoá này: từ khoảng 8:01 sáng, trước giờ mở cửa thị trường 9:30, một hệ thống nội bộ đã gửi <strong>97 email tự động</strong> tới một nhóm nhân viên, nhắc tới một lỗi "Power Peg disabled". Theo lời SEC, Knight "không thiết kế loại tin nhắn này để làm cảnh báo hệ thống, và nhân viên Knight nhìn chung không đọc chúng khi nhận được".</p>
<p><strong>Bài học:</strong> một tin nhắn không ai có trách nhiệm đọc thì không phải cảnh báo, gửi bao nhiêu cũng vậy. Cảnh báo cần một người chịu trách nhiệm, một ý nghĩa rõ ràng, và đủ ít để cái nào cũng được đọc. Chương 9 (cảnh báo là lời hứa đánh thức ai đó; mệt mỏi vì cảnh báo).</p>

<h3>2 · GitLab, 2017 — bản sao lưu hỏng trong im lặng</h3>
<p>Ngày 31/1/2017, trong lúc chống đỡ một sự cố tải, một kỹ sư GitLab lỡ tay xoá thư mục dữ liệu của máy PostgreSQL chính trên production. Khôi phục lẽ ra là việc thường ngày. Bản phân tích sau sự cố của GitLab (10/2/2017) giải thích vì sao không phải vậy: bản sao lưu <code>pg_dump</code> định kỳ "hỏng trong im lặng vì dùng PostgreSQL 9.2, trong khi GitLab.com chạy PostgreSQL 9.6". Công việc ấy có gửi email báo lỗi — nhưng email "bị phía nhận từ chối" vì một thiết lập xác thực email (DMARC), nên không ai thấy. Dữ liệu tạo ra từ 17:20 tới 23:30 UTC bị mất; GitLab ước tính ít nhất 5.000 dự án, 5.000 bình luận và khoảng 700 người dùng.</p>
<p><strong>Bài học:</strong> "không có tin gì" không có nghĩa là "tin tốt". Một công việc có thể hỏng trong im lặng cần phát tín hiệu khi nó <em>thành công</em>, và một cảnh báo khi tín hiệu ấy ngừng tới — và chính đường đi của cảnh báo cũng phải được thử. Chương 8 và 9.</p>

<h3>3 · Amazon S3, 2017 — trang trạng thái phụ thuộc vào thứ nó báo cáo</h3>
<p>Ngày 28/2/2017, lúc 9:37 sáng giờ PST, một kỹ sư S3 làm theo quy trình có sẵn đã chạy một lệnh với một tham số gõ sai, và số máy chủ bị gỡ ra nhiều hơn dự định rất nhiều. Hai phân hệ lõi của S3 phải khởi động lại toàn bộ; S3 ở vùng US-EAST-1 hồi phục xong lúc 1:54 chiều PST. Bản tóm tắt của chính AWS có thêm chi tiết mà người làm giám sát nào cũng nhớ: tới 11:37 sáng họ không cập nhật được trạng thái từng dịch vụ trên Service Health Dashboard "vì trang quản trị của SHD phụ thuộc vào Amazon S3".</p>
<p><strong>Bài học:</strong> thứ đứng canh không được hỏng cùng với thứ nó canh. Hãy kiểm từ bên ngoài, từ một nơi sự cố không với tới được. Bài 8.5 (kiểm từ bên ngoài, nơi người dùng đứng).</p>

<h3>4 · Facebook, 2021 — một phép kiểm sức khoẻ tự tắt chính mình</h3>
<p>Ngày 4/10/2021, trong một lần bảo trì định kỳ, một lệnh nhằm đánh giá dung lượng đường trục "vô tình cắt mọi kết nối trong mạng đường trục của chúng tôi", Santosh Janardhan viết trên blog kỹ thuật của Facebook hôm sau. Rồi một cơ chế an toàn làm mọi thứ tệ hơn: các máy chủ DNS "tắt các thông báo BGP đó nếu chính chúng không nói chuyện được với các trung tâm dữ liệu" — một phép kiểm sức khoẻ có hành động — thế là toàn bộ Facebook biến mất khỏi Internet. Và "việc mất hoàn toàn DNS làm hỏng nhiều công cụ nội bộ chúng tôi thường dùng để điều tra và xử lý những sự cố như thế này"; khi cả đường vào chính lẫn đường vào dự phòng đều sập, họ phải cử kỹ sư tới tận nơi.</p>
<p><strong>Bài học:</strong> một phép thăm dò mà <em>làm</em> một việc gì đó (rút lưu lượng, khởi động lại tiến trình) cần được chăm chút như chính đoạn code nó bảo vệ, và công cụ chẩn đoán của bạn không được phụ thuộc vào việc hệ thống đang khoẻ. Bài 8.1–8.2 (bốn kiểu thăm dò; phép kiểm liveness khởi động lại một dịch vụ đang khoẻ) và Chương 11.</p>

<h3>5 · Chính kho mã này — sự cố nào cũng do con người phát hiện</h3>
<p>Bài 0.1 mở đầu bằng bốn sự cố trong lịch sử của chính website này, ghi lại trong sổ tay dự án. Khuôn mẫu y như trên, chỉ nhỏ hơn: một route không bao giờ được gắn vì deploy nhầm một bản build cũ, và health check vẫn xanh suốt vì nó chỉ chạy <code>SELECT 1</code>; sau một lần tráo ảnh hỏng, backend khởi động lại liên tục và người dùng thấy trang 502 trong bảy phút. Lần nào thứ phát hiện ra cũng là một người đang dùng trang.</p>
<p><strong>Bài học:</strong> bạn không cần là Amazon thì chuyện này mới xảy ra với bạn. Chương 1, 8 và 11 mổ xẻ các sự cố này.</p>

<h3>Khuôn mẫu chung</h3>
<table>
  <thead><tr><th>Sự cố</th><th>Thật ra hỏng ở đâu</th><th>Cách phòng</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>Knight 2012</td><td>có cảnh báo gửi đi, không ai nhận trách nhiệm</td><td>ít cảnh báo, cái nào cũng có người nhận và có ý nghĩa</td><td>Ch 9</td></tr>
    <tr><td>GitLab 2017</td><td>hỏng trong im lặng, đường báo lỗi cũng hỏng</td><td>cảnh báo khi thiếu tín hiệu thành công; thử đường cảnh báo</td><td>Ch 8, 9</td></tr>
    <tr><td>AWS S3 2017</td><td>thứ canh phụ thuộc thứ bị canh</td><td>kiểm từ bên ngoài</td><td>8.5</td></tr>
    <tr><td>Facebook 2021</td><td>phép thăm dò tự hành động, công cụ chết theo mạng</td><td>thăm dò cẩn thận; công cụ vẫn dùng được giữa sự cố</td><td>8.1–8.2, Ch 11</td></tr>
    <tr><td>Kho này</td><td>health check xanh, tính năng hỏng</td><td>health check kiểm đúng thứ người dùng dùng</td><td>0.1, Ch 8</td></tr>
  </tbody>
</table>
<p>Không chuyện nào cần công nghệ cao siêu để phòng. Chúng chỉ cần có người hỏi trước một câu: "lỡ hỏng thì mình biết bằng cách nào?". Câu hỏi đó chính là thứ bạn sắp luyện.</p>

<h3>Gần với bạn hơn: đêm trước buổi bảo vệ</h3>
<div class="callout warn"><p><strong>Tình huống minh hoạ — không phải chuyện có thật.</strong> Tuy vậy, từng mảnh của nó đều là kiểu hỏng mà khoá này cố tình tái hiện.</p></div>
<p>Một nhóm bốn người chạy API đồ án trong Docker trên một VPS nhỏ. Đêm trước buổi bảo vệ:</p>
<ol>
  <li>API in một dòng debug cho mọi request bằng <code>console.log</code>, và trình ghi log mặc định của Docker giữ mọi dòng mà không xoay vòng. Đĩa đầy; PostgreSQL không ghi được nữa, và các lượt đặt chỗ bắt đầu lỗi 500.</li>
  <li>Endpoint kiểm sức khoẻ chỉ trả "ok" nếu tiến trình còn sống, nên trang theo dõi uptime vẫn xanh.</li>
  <li>Những dòng lỗi được ghi ra thì không có request id, nên không ai biết người dùng nào, route nào, hay từ lúc nào.</li>
  <li>Không có gì được cấu hình để báo cho ai. Người đầu tiên phát hiện là thầy cô bấm "Đặt" giữa buổi demo.</li>
</ol>
<p>Bốn lỗ hổng nhỏ, một buổi demo đổ bể. Bài 2.2 sửa chuyện xoay vòng, Chương 8 sửa health check, Chương 3 sửa request id, và Chương 9 sửa sự im lặng.</p>

<h3>Vì sao người ta hay bỏ ngang chủ đề này — và cách sửa</h3>
<ul>
  <li><strong>Quá nhiều công cụ một lúc</strong> — Prometheus, Grafana, Loki, OpenTelemetry, Sentry. <em>Cách sửa:</em> khoá này bắt đầu bằng công cụ có sẵn trong Node (bài 0.3) và chỉ thêm từng sản phẩm ở chương cần tới nó, sau khi bạn đã tự đo bằng tay.</li>
  <li><strong>Số của bạn không khớp với bài.</strong> <em>Cách sửa:</em> số tuyệt đối phụ thuộc phần cứng; tỷ lệ mới là bài học. Bài 0.4 giải thích chênh lệch nào đáng để ý.</li>
  <li><strong>Cảm giác không phải "làm tính năng".</strong> <em>Cách sửa:</em> chương nào cũng kết bằng một kiểu hỏng bạn tự tái hiện rồi tự nhìn thấy. Khoảnh khắc công cụ của chính bạn bắt được con lỗi bạn vừa cài vào là lúc mọi thứ "vào".</li>
  <li><strong>Thuật ngữ tiếng Anh dồn dập</strong> — cardinality, saturation, burn rate. <em>Cách sửa:</em> bài nào cũng kết bằng ô 🗂 thuật ngữ giải nghĩa tiếng Việt.</li>
</ul>

<h3>Một buổi học, năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm câu hỏi trước — 5 phút</span><span class="lz-d">Bài nào cũng tồn tại để trả lời một câu hỏi. Tìm ra nó trước khi đọc các con số.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc bài — 20 phút</span><span class="lz-d">Cơ chế, cái bẫy, output thật.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tự chạy — 15 phút</span><span class="lz-d">Gõ lại script, chạy, so với khối output. Đổi một thứ và đoán trước khi chạy lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Thực hành — 15–20 phút</span><span class="lz-d">Một việc nhỏ có tiêu chí "Đạt khi" bạn tự kiểm được.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Trắc nghiệm, cuối mỗi mục</span><span class="lz-d">Sai câu nào thì đọc lại bài câu đó chỉ tới rồi mới đi tiếp.</span></div>
</div>
<p>Một luật duy nhất: <strong>không bao giờ dán một lệnh bạn chưa giải thích được</strong>. Đọc nó, nói từng phần làm gì, rồi mới chạy.</p>

<h3>Mất bao lâu</h3>
<table>
  <thead><tr><th>Kế hoạch</th><th>Học những gì</th><th>Xong bạn có</th></tr></thead>
  <tbody>
    <tr><td><strong>Tối thiểu · khoảng 4–5 tuần</strong></td><td>Mục 0, Chương 1, Chương 3, Chương 4, bài 5.5, Chương 8, Chương 9, bài 12.2</td><td>một request lần theo được từ đầu tới cuối, các chỉ số cốt lõi, health check trung thực và một cảnh báo thật sự quan trọng</td></tr>
    <tr><td><strong>Đầy đủ · khoảng 9–10 tuần</strong></td><td>cả mười ba mục và các bài trắc nghiệm</td><td>tất cả những thứ trên, cộng đường ống log, chỉ số của runtime Node, trace, theo dõi lỗi, bảng theo dõi và chẩn đoán</td></tr>
  </tbody>
</table>
<p>Đây là ước lượng với nhịp chừng một bài mỗi ngày, mỗi bài khoảng một giờ. Bị chậm so với kế hoạch? Đừng nhảy cóc — hãy bỏ bớt các thí nghiệm thêm. Chương 3 cần log của Chương 1, và Chương 9 cần chỉ số của Chương 4.</p>

<h3>Khi bị bí</h3>
<ol>
  <li><strong>Kiểm phiên bản.</strong> <code>node -v</code> — khoá được đo trên Node 22.22.2. Phiên bản khác hẳn có thể làm đổi một con số.</li>
  <li><strong>Đọc điều kiện đo.</strong> Mỗi phép đo đều ghi rõ được đo trong điều kiện nào: kích thước dữ liệu, số vòng lặp, có chạy nóng máy không. Khớp điều kiện rồi mới so.</li>
  <li><strong>So tỷ lệ, đừng so số tuyệt đối.</strong> Nếu mọi số của bạn đều bằng một nửa của bài, chỉ là máy bạn nhanh hơn.</li>
  <li><strong>Đọc output từng dòng</strong> so với khối output của bài, và tìm dòng đầu tiên khác nhau.</li>
  <li><strong>Vẫn bí?</strong> Hỏi kèm bốn thứ: lệnh chính xác, toàn bộ output, phiên bản Node và hệ điều hành, và bạn đã mong thấy gì.</li>
</ol>

<h3>Các mốc để tự đánh dấu</h3>
<ul>
  <li>☐ Tôi giải thích được monitoring khác observability cho một người bạn.</li>
  <li>☐ Dịch vụ của tôi ghi một dòng log JSON cho mỗi request.</li>
  <li>☐ Tôi tìm được mọi dòng log của một request theo id của nó.</li>
  <li>☐ Tôi biết độ trễ p99 của mình, không chỉ con số trung bình.</li>
  <li>☐ Health check của tôi báo hỏng khi một phụ thuộc người dùng cần bị sập.</li>
  <li>☐ Một cảnh báo sẽ đánh thức tôi nếu người dùng gặp lỗi — và tôi đã thử là nó tới thật.</li>
  <li>☐ Tôi đã viết một bản ghi lại không đổ lỗi cho một sự cố, dù nhỏ.</li>
</ul>
<p>Ghi ngày bên cạnh mỗi dấu tích. Vào một buổi tối uể oải, danh sách đó là bằng chứng bạn đang tiến lên.</p>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Mở một trong bốn nguồn sự cố ở dưới và đọc trong năm phút.</li>
  <li>Viết một câu: lẽ ra cái gì phải phát hiện ra sự cố — và thực tế cái gì đã phát hiện.</li>
  <li>Ghi chương nào của khoá này dạy cách phòng, dựa vào bảng khuôn mẫu chung.</li>
  <li>Chọn kế hoạch (4–5 tuần hay 9–10 tuần) và ghi ba buổi học đầu tiên vào lịch.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một câu "lẽ ra cái gì phải phát hiện", một số chương, và ba buổi học đã ghi ngày trong lịch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Post-mortem (phân tích sau sự cố)</span><span class="v">Bản viết lại một sự cố: diễn biến, nguyên nhân, cái gì đã giúp, cái gì sẽ đổi.</span></div>
  <div class="kv"><span class="k">Silent failure (hỏng im lặng)</span><span class="v">Lỗi không sinh ra tín hiệu nào ai thấy, như việc sao lưu mà email báo lỗi bị chặn.</span></div>
  <div class="kv"><span class="k">Heartbeat (nhịp tim)</span><span class="v">Tín hiệu gửi khi thành công; cảnh báo nổ khi nó ngừng tới.</span></div>
  <div class="kv"><span class="k">Alert fatigue (mệt mỏi vì cảnh báo)</span><span class="v">Cảnh báo nhiều tới mức người ta thôi đọc — đúng trạng thái 97 email của Knight cho thấy.</span></div>
  <div class="kv"><span class="k">Shared fate (chung số phận)</span><span class="v">Khi thứ canh phụ thuộc thứ bị canh, nên cả hai hỏng cùng lúc.</span></div>
  <div class="kv"><span class="k">Out-of-band access (đường vào dự phòng)</span><span class="v">Một lối vào hệ thống không phụ thuộc vào việc hệ thống đang khoẻ.</span></div>
  <div class="kv"><span class="k">Probe (phép thăm dò)</span><span class="v">Phép kiểm tự động có thể kèm hành động: rút máy khỏi lưu lượng, khởi động lại tiến trình.</span></div>
  <div class="kv"><span class="k">Blameless write-up (bản ghi không đổ lỗi)</span><span class="v">Báo cáo sự cố đi tìm nguyên nhân trong hệ thống, không đi tìm người để trách.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sự cố lớn thường là những lỗ hổng bình thường trong việc nhìn thấy, không phải công nghệ cao siêu: cảnh báo không ai đọc, công việc hỏng im lặng, thứ canh chung số phận với thứ bị canh, phép thăm dò tự hành động.</li>
  <li>Cảnh báo cần người nhận và ý nghĩa; công việc có thể hỏng im lặng cần tín hiệu thành công; thứ canh phải sống sót qua sự cố của thứ bị canh.</li>
  <li>Đồ án sinh viên hỏng y như vậy: đĩa đầy vì log không xoay vòng, health check chỉ biết "còn sống", lỗi không có request id, và không ai được báo.</li>
  <li>Nhịp học: tìm câu hỏi → đọc → tự chạy → 🧪 → trắc nghiệm; không dán lệnh mình chưa giải thích được.</li>
  <li>Chọn kế hoạch tối thiểu (khoảng 4–5 tuần) hoặc đầy đủ (khoảng 9–10 tuần) và đánh dấu các mốc kèm ngày.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Knight Capital: quyết định của SEC, Release No. 34-70694, 16/10/2013 — <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/litigation/admin/2013/34-70694.pdf</a></li>
  <li>GitLab: phân tích sau sự cố, 10/2/2017 — <a href="https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31</a></li>
  <li>Amazon S3: bản tóm tắt của AWS về sự cố 28/2/2017 — <a href="https://aws.amazon.com/message/41926/" target="_blank" rel="noopener">aws.amazon.com/message/41926</a></li>
  <li>Facebook: "More details about the October 4 outage", 5/10/2021 — <a href="https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/" target="_blank" rel="noopener">engineering.fb.com/2021/10/05/networking-traffic/outage-details</a></li>
</ul>
</div>
<div class="ml-en">
<h3>🔗 Connected lessons</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-11-1-nam-phut-dau" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy VPS · 11.1 — The first five minutes</span><span class="lc-sub">What to do in the first minutes of an incident on a real VPS — the practical side of the stories above.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-15-6-health-check-canh-bao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js · 15.6 — Health checks, alerts, and being woken at 3am</span><span class="lc-sub">Health checks and alerts written in a Node application, from the Node.js course.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>
<div class="ml-vi">
<h3>🔗 Bài liên quan</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-11-1-nam-phut-dau" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy lên VPS · 11.1 — Năm phút đầu tiên</span><span class="lc-sub">Làm gì trong những phút đầu của một sự cố trên VPS thật — mặt thực hành của các câu chuyện ở trên.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-15-6-health-check-canh-bao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js · 15.6 — Health check, cảnh báo, và chuyện bị gọi dậy lúc 3 giờ sáng</span><span class="lc-sub">Health check và cảnh báo viết trong một ứng dụng Node, ở khoá Node.js.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },


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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Measure the observability gap on a real repo, exactly the way this lesson did.</p>
<ol>
  <li>Pick any Node or TypeScript backend with a <code>src/</code> folder — this repository, or one of your own — and <code>cd</code> into it.</li>
  <li>Count the route files, and how many of them import a logger:</li>
</ol>
<pre><code class="language-bash">ls src/routes/*.ts | wc -l
grep -rl "logger" src/routes/*.ts | wc -l</code></pre>
<ol start="3">
  <li>Divide the second number by the first. That fraction is your logging coverage — write it down.</li>
  <li>Open one route file with zero logger imports, pick its riskiest handler, and finish this sentence: &quot;If this failed at 2am, the question I could not answer from logs is ___.&quot;</li>
</ol>
<p><strong>Done when:</strong> you have a single coverage ratio and one named blind spot — a concrete question about a real failure that your current logs cannot answer.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Monitoring</span><span class="v">Watching for failures you predicted in advance — &quot;is CPU above 80%?&quot;, &quot;is the process up?&quot;.</span></div>
  <div class="kv"><span class="k">Observability</span><span class="v">Being able to ask new questions about a failure after it happened, from detail you recorded.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">An endpoint that reports only the specific things it tests, and nothing beyond them.</span></div>
  <div class="kv"><span class="k">Blind spot</span><span class="v">Code that emits no telemetry, so a failure there is invisible until a user hits it.</span></div>
  <div class="kv"><span class="k">Detection mechanism</span><span class="v">Whatever actually notices a failure; in these four incidents it was always a human.</span></div>
  <div class="kv"><span class="k">requestId / correlationId</span><span class="v">An id attached to every log line of one request so the lines can be tied back together.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every incident in this repo&#39;s history was found by a person, not the server — the gap from &quot;broken&quot; to &quot;noticed&quot; ran from seven minutes to weeks.</li>
  <li>Logging was added only where someone once debugged something: 16 of 73 route files and 22 of 101 service files import the logger.</li>
  <li>Monitoring answers questions you wrote down in advance; observability answers the ones you did not.</li>
  <li>A green health check proves only what it checks — and the failures that reach users are usually not what anyone thought to check.</li>
</ul>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Đo khoảng cách quan sát trên một kho mã thật, đúng cách bài này đã làm.</p>
<ol>
  <li>Chọn một backend Node hay TypeScript bất kỳ có thư mục <code>src/</code> — chính kho này, hoặc một kho của bạn — rồi <code>cd</code> vào đó.</li>
  <li>Đếm số file routes, và bao nhiêu file trong đó có import logger:</li>
</ol>
<pre><code class="language-bash">ls src/routes/*.ts | wc -l
grep -rl "logger" src/routes/*.ts | wc -l</code></pre>
<ol start="3">
  <li>Chia con số thứ hai cho con số thứ nhất. Phân số đó là độ phủ log của bạn — ghi nó lại.</li>
  <li>Mở một file route không có import logger nào, chọn handler nguy hiểm nhất của nó, rồi hoàn thành câu này: &quot;Nếu cái này hỏng lúc 2 giờ sáng, câu hỏi tôi không trả lời được từ log là ___.&quot;</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một tỷ lệ độ phủ duy nhất và một điểm mù được gọi tên — một câu hỏi cụ thể về một cú hỏng thật mà log hiện tại của bạn không trả lời nổi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Monitoring (giám sát)</span><span class="v">Canh chừng những cú hỏng bạn đã tiên đoán trước — &quot;CPU có trên 80% không?&quot;, &quot;tiến trình còn sống không?&quot;.</span></div>
  <div class="kv"><span class="k">Observability (quan sát được)</span><span class="v">Khả năng hỏi những câu MỚI về một cú hỏng sau khi nó đã xảy ra, từ chi tiết bạn đã ghi lại.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">Một endpoint chỉ báo cáo đúng những thứ nó kiểm, và không gì ngoài chúng.</span></div>
  <div class="kv"><span class="k">Điểm mù (blind spot)</span><span class="v">Mã không phát ra tín hiệu nào, nên một cú hỏng ở đó vô hình cho tới khi một người dùng chạm phải.</span></div>
  <div class="kv"><span class="k">Cơ chế phát hiện</span><span class="v">Thứ thật sự nhận ra một cú hỏng; trong bốn sự cố này nó luôn là một con người.</span></div>
  <div class="kv"><span class="k">requestId / correlationId</span><span class="v">Một id gắn vào mọi dòng log của cùng một request để nối các dòng ấy lại với nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi sự cố trong lịch sử kho này đều do một người tìm ra, không phải máy chủ — khoảng cách từ &quot;đã hỏng&quot; tới &quot;được nhận ra&quot; trải từ bảy phút tới vài tuần.</li>
  <li>Log chỉ được thêm vào đúng chỗ từng có người gỡ lỗi: 16/73 file routes và 22/101 file services có import logger.</li>
  <li>Giám sát trả lời những câu bạn viết ra từ trước; quan sát được trả lời những câu bạn chưa hỏi.</li>
  <li>Một health check xanh chỉ chứng minh đúng thứ nó kiểm — và những cú hỏng chạm tới người dùng thường không phải thứ ai đó nghĩ tới việc đi kiểm.</li>
</ul>

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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Match questions to pillars, then price the cheapest pillar&#39;s opposite.</p>
<ol>
  <li>Write down four questions you would actually ask during an incident on a service you know.</li>
  <li>Tag each with the cheapest pillar that answers it: <strong>metric</strong>, <strong>log</strong>, <strong>trace</strong> or <strong>change event</strong>.</li>
  <li>Now price the log option for a &quot;how many 500s?&quot; question. One debug line per request on a service doing 500 rps:</li>
</ol>
<pre><code class="language-bash">node -e "console.log(500*60*60*24, 'log lines/day for one line per request at 500 rps')"</code></pre>
<ol start="4">
  <li>Compare that to a counter: one number, read in constant time regardless of traffic. Decide which of your four questions a counter answers for free.</li>
</ol>
<p><strong>Done when:</strong> every question has a pillar, and you can state that one debug line per request at 500 rps is about 43.2 million lines a day while the equivalent counter stays a single series.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logs</span><span class="v">One event in full detail; high cost per event, grows with traffic. The only pillar that carries an arbitrary payload.</span></div>
  <div class="kv"><span class="k">Metrics</span><span class="v">Many events summarised into numbers; cost is per series, not per request, so nearly free at any traffic.</span></div>
  <div class="kv"><span class="k">Traces</span><span class="v">One request across services, showing ordering and causality; expensive enough that sampling is mandatory.</span></div>
  <div class="kv"><span class="k">Change events</span><span class="v">Deploys, config edits, flags, migrations — the fourth signal, and the first thing you want on a graph.</span></div>
  <div class="kv"><span class="k">Time series</span><span class="v">A named metric plus its labels tracked over time; the unit metrics are billed and stored in.</span></div>
  <div class="kv"><span class="k">Sampling</span><span class="v">Keeping only a fraction of traces to bound cost — and losing the ones you did not keep.</span></div>
  <div class="kv"><span class="k">p99 latency</span><span class="v">The duration 99% of requests come in under; cheap from a histogram, ruinous to compute from logs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The three pillars are a cost model, not a taxonomy: logs, metrics and traces each answer a different question at a different price.</li>
  <li>The forgotten fourth signal is change events — most incidents are caused by a change, and a deploy marker ends an investigation before it starts.</li>
  <li>Choose the pillar by the question: counters for &quot;how many&quot;, logs for &quot;why this one&quot;, traces for &quot;where did the time go&quot;.</li>
  <li>Metric cost is flat in traffic; trace cost is linear ÷ sample rate; log cost is linear and uncapped, and verbosity multiplies it.</li>
</ul>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Ghép câu hỏi với trụ cột, rồi tính giá của phương án đắt.</p>
<ol>
  <li>Viết ra bốn câu hỏi bạn thật sự sẽ hỏi trong một sự cố trên một dịch vụ bạn biết.</li>
  <li>Gắn cho mỗi câu trụ cột RẺ NHẤT trả lời được nó: <strong>chỉ số</strong>, <strong>log</strong>, <strong>trace</strong> hay <strong>sự kiện thay đổi</strong>.</li>
  <li>Giờ tính giá phương án log cho câu &quot;có bao nhiêu cú 500?&quot;. Một dòng debug mỗi request trên dịch vụ chạy 500 rps:</li>
</ol>
<pre><code class="language-bash">node -e "console.log(500*60*60*24, 'dòng log/ngày cho một dòng mỗi request ở 500 rps')"</code></pre>
<ol start="4">
  <li>So nó với một bộ đếm: một con số, đọc trong thời gian hằng bất kể lưu lượng. Quyết định câu nào trong bốn câu được một bộ đếm trả lời miễn phí.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi câu hỏi đều có một trụ cột, và bạn phát biểu được rằng một dòng debug mỗi request ở 500 rps là khoảng 43,2 triệu dòng mỗi ngày trong khi bộ đếm tương đương vẫn là một chuỗi duy nhất.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Log</span><span class="v">Một sự kiện đầy đủ chi tiết; giá mỗi sự kiện cao, lớn theo lưu lượng. Trụ cột duy nhất mang được dữ liệu tuỳ ý.</span></div>
  <div class="kv"><span class="k">Chỉ số (metrics)</span><span class="v">Nhiều sự kiện tóm thành con số; giá theo chuỗi thời gian, không theo request, nên gần như miễn phí ở mọi lưu lượng.</span></div>
  <div class="kv"><span class="k">Trace</span><span class="v">Một request xuyên qua nhiều dịch vụ, cho thấy thứ tự và nhân quả; đắt tới mức lấy mẫu là bắt buộc.</span></div>
  <div class="kv"><span class="k">Sự kiện thay đổi</span><span class="v">Deploy, sửa cấu hình, cờ tính năng, migration — tín hiệu thứ tư, và thứ đầu tiên bạn muốn thấy trên biểu đồ.</span></div>
  <div class="kv"><span class="k">Chuỗi thời gian (time series)</span><span class="v">Một chỉ số có tên cùng các nhãn của nó theo dõi qua thời gian; đơn vị mà chỉ số được tính giá và lưu.</span></div>
  <div class="kv"><span class="k">Lấy mẫu (sampling)</span><span class="v">Chỉ giữ một phần trace để chặn chi phí — và mất đi những cái không giữ.</span></div>
  <div class="kv"><span class="k">p99 độ trễ</span><span class="v">Thời lượng mà 99% request nằm dưới; rẻ nếu lấy từ histogram, cực đắt nếu tính từ log.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Ba trụ cột là một mô hình CHI PHÍ, không phải cách phân loại: log, chỉ số và trace mỗi cái trả lời một câu hỏi khác nhau với một cái giá khác nhau.</li>
  <li>Tín hiệu thứ tư bị quên là sự kiện thay đổi — phần lớn sự cố do một thay đổi gây ra, và một dấu deploy kết thúc cuộc điều tra trước khi nó bắt đầu.</li>
  <li>Chọn trụ cột theo câu hỏi: bộ đếm cho &quot;bao nhiêu&quot;, log cho &quot;vì sao cái này&quot;, trace cho &quot;thời gian đi đâu mất&quot;.</li>
  <li>Giá chỉ số phẳng theo lưu lượng; giá trace tuyến tính ÷ tỷ lệ lấy mẫu; giá log tuyến tính và không trần, còn độ chi tiết thì nhân lên.</li>
</ul>

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
  return &#96;\${label.padEnd(30)} \${(ns / N).toFixed(0).padStart(5)} ns/op&#96;;
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Build the rig and prove it measures real work, not loop overhead.</p>
<ol>
  <li>Save the <code>bench()</code> harness from this lesson into <code>bench.mjs</code> and run it: <code>node bench.mjs</code>. Note the ns/op for <code>JSON.stringify</code>.</li>
  <li>Run the sanity check — an empty ten-million-iteration loop should take only a few milliseconds:</li>
</ol>
<pre><code class="language-bash">node -e "const t=process.hrtime.bigint(); for(let i=0;i&lt;1e7;i++); console.log(Number(process.hrtime.bigint()-t)/1e6+' ms')"</code></pre>
<ol start="3">
  <li>Delete the warm-up <code>fn()</code> call and re-run <code>bench.mjs</code>. Watch the ns/op jump — you just measured the interpreter instead of the compiled function.</li>
  <li>Add a line that prints <code>process.memoryUsage().heapUsed</code> and <code>process.stdout.writableLength</code>, and read what each reports at rest.</li>
</ol>
<p><strong>Done when:</strong> your empty loop is under ~10 ms (JIT on, clock monotonic), and you have seen the ns/op figure rise with the warm-up removed.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">process.hrtime.bigint()</span><span class="v">A monotonic nanosecond clock that cannot run backwards; use it for anything you subtract.</span></div>
  <div class="kv"><span class="k">Monotonic clock</span><span class="v">A clock that only moves forward, unaffected by NTP steps or VM snapshots — unlike the wall clock.</span></div>
  <div class="kv"><span class="k">Warm-up (JIT)</span><span class="v">A call made before timing so V8 compiles the function; without it you measure the interpreter.</span></div>
  <div class="kv"><span class="k">monitorEventLoopDelay()</span><span class="v">A perf_hooks histogram of how late the event loop runs — the most useful self-report a Node process has.</span></div>
  <div class="kv"><span class="k">process.memoryUsage()</span><span class="v">Five numbers (RSS, heapUsed, heapTotal, external, arrayBuffers) separating a code leak from runtime buffers.</span></div>
  <div class="kv"><span class="k">writableLength</span><span class="v">Bytes queued on a stream but not yet written — the signal that proves log backpressure in lesson 1.5.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every number in this course comes from four built-in Node tools — no agent, no account — so you can always check a vendor&#39;s dashboard against your own measurement.</li>
  <li>A trustworthy benchmark needs three things: a warm-up call, a monotonic clock, and dividing by N after the loop rather than timing each iteration.</li>
  <li>Use <code>hrtime.bigint()</code> for durations and keep <code>Date.now()</code> only for displayed timestamps — the wall clock can step backwards mid-measurement.</li>
  <li>The empty-loop sanity check confirms the JIT is on and the clock works before you trust any figure above it.</li>
</ul>

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
  return &#96;\${label.padEnd(30)} \${(ns / N).toFixed(0).padStart(5)} ns/thao tác&#96;;
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Dựng bộ đồ nghề và chứng minh nó đo việc thật, không phải chi phí vòng lặp.</p>
<ol>
  <li>Lưu khung <code>bench()</code> trong bài này vào <code>bench.mjs</code> rồi chạy: <code>node bench.mjs</code>. Ghi lại ns/thao tác của <code>JSON.stringify</code>.</li>
  <li>Chạy phép kiểm tỉnh táo — một vòng lặp rỗng mười triệu lần chỉ nên mất vài mili giây:</li>
</ol>
<pre><code class="language-bash">node -e "const t=process.hrtime.bigint(); for(let i=0;i&lt;1e7;i++); console.log(Number(process.hrtime.bigint()-t)/1e6+' ms')"</code></pre>
<ol start="3">
  <li>Xoá lời gọi làm nóng <code>fn()</code> rồi chạy lại <code>bench.mjs</code>. Nhìn ns/thao tác nhảy lên — bạn vừa đo trình thông dịch thay vì hàm đã biên dịch.</li>
  <li>Thêm một dòng in <code>process.memoryUsage().heapUsed</code> và <code>process.stdout.writableLength</code>, rồi đọc xem mỗi cái báo gì lúc rảnh.</li>
</ol>
<p><strong>Đạt khi:</strong> vòng lặp rỗng của bạn dưới ~10 ms (JIT bật, đồng hồ đơn điệu), và bạn đã thấy con số ns/thao tác tăng lên khi bỏ lời gọi làm nóng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">process.hrtime.bigint()</span><span class="v">Đồng hồ nano giây đơn điệu không thể chạy lùi; dùng cho mọi thứ bạn đem trừ.</span></div>
  <div class="kv"><span class="k">Đồng hồ đơn điệu</span><span class="v">Đồng hồ chỉ tiến, không bị NTP đẩy hay máy ảo chụp ảnh — khác đồng hồ tường.</span></div>
  <div class="kv"><span class="k">Làm nóng (JIT)</span><span class="v">Một lời gọi trước khi bấm giờ để V8 biên dịch hàm; thiếu nó là bạn đo trình thông dịch.</span></div>
  <div class="kv"><span class="k">monitorEventLoopDelay()</span><span class="v">Histogram của perf_hooks về độ trễ vòng lặp sự kiện — thứ tự báo cáo hữu ích nhất của một tiến trình Node.</span></div>
  <div class="kv"><span class="k">process.memoryUsage()</span><span class="v">Năm con số (RSS, heapUsed, heapTotal, external, arrayBuffers) tách rò rỉ trong mã với vùng đệm của runtime.</span></div>
  <div class="kv"><span class="k">writableLength</span><span class="v">Số byte xếp hàng trên một luồng mà chưa ghi ra — tín hiệu chứng minh nghẽn log ở bài 1.5.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi con số trong khoá này đến từ bốn công cụ có sẵn của Node — không tác nhân, không tài khoản — nên bạn luôn kiểm được bảng theo dõi của nhà cung cấp bằng phép đo của chính mình.</li>
  <li>Một benchmark đáng tin cần ba thứ: một lời gọi làm nóng, một đồng hồ đơn điệu, và chia cho N SAU vòng lặp thay vì bấm giờ từng vòng.</li>
  <li>Dùng <code>hrtime.bigint()</code> cho thời lượng và chỉ giữ <code>Date.now()</code> cho dấu thời gian hiển thị — đồng hồ tường có thể lùi giữa chừng phép đo.</li>
  <li>Phép kiểm vòng lặp rỗng xác nhận JIT đang bật và đồng hồ chạy được trước khi bạn tin bất cứ con số nào trên nó.</li>
</ul>

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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Run the loop once, now, so the habit is in place before chapter 1.</p>
<ol>
  <li>Take the <code>bench.mjs</code> from lesson 0.3 and run it twice. Record both ns/op figures and note how much they differ run to run.</li>
  <li>Run it once on an idle machine and once with a build or video playing. Watch the absolute numbers move.</li>
  <li>Now change one variable: benchmark <code>JSON.stringify</code> of a 2-field object versus a 20-field object. <strong>Predict the direction first</strong>, out loud, then run it.</li>
  <li>Compute the ratio (big ÷ small). Compare that ratio — not the absolute numbers — to what the later chapters report.</li>
</ol>
<p><strong>Done when:</strong> you have reproduced a ratio from the course and watched the absolute figures swing by tens of percent while the ratio held — proving ratios travel and absolutes do not.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">out block</span><span class="v">A real captured run shown in this course — reproduce it, do not memorise it.</span></div>
  <div class="kv"><span class="k">Reproduction</span><span class="v">Running a measurement yourself to confirm the mechanism, not just reading the result.</span></div>
  <div class="kv"><span class="k">Ratio vs absolute</span><span class="v">Absolute ns/op is hardware; the ratio between two measurements is the portable lesson.</span></div>
  <div class="kv"><span class="k">Conditions of a measurement</span><span class="v">The object shape, CPU and method a number was taken under; a figure without them becomes folklore.</span></div>
  <div class="kv"><span class="k">Predict-then-run</span><span class="v">Stating your expectation before running, so being wrong actually teaches you.</span></div>
  <div class="kv"><span class="k">Deliberate breakage</span><span class="v">Reproducing a failure on purpose here, where it is cheap, instead of meeting it at 2am.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every <code>out</code> block is a real run on Node 22.22.2 — the goal is to reproduce the numbers and notice where yours differ.</li>
  <li>Per lesson: read the mechanism, run it yourself, change one variable and predict first, then break it deliberately.</li>
  <li>Absolute numbers are hardware and will swing ±30%; the ratios are the lesson and should reproduce anywhere.</li>
  <li>The end objective: take a service you did not write and, within an hour, know its p99, follow one request, see the last deploy on the error graph, and say what would page a human.</li>
</ul>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Chạy vòng lặp học một lần, ngay bây giờ, để thói quen có sẵn trước chương 1.</p>
<ol>
  <li>Lấy <code>bench.mjs</code> từ bài 0.3 và chạy hai lần. Ghi lại cả hai con số ns/thao tác và để ý chúng lệch nhau bao nhiêu giữa các lần.</li>
  <li>Chạy một lần lúc máy rảnh và một lần khi có bản build hay video đang chạy. Nhìn con số tuyệt đối dịch đi.</li>
  <li>Giờ đổi một biến: đo <code>JSON.stringify</code> của một object 2 trường so với một object 20 trường. <strong>Đoán hướng trước</strong>, nói to ra, rồi mới chạy.</li>
  <li>Tính tỷ lệ (lớn ÷ nhỏ). So TỶ LỆ đó — không phải con số tuyệt đối — với thứ các chương sau báo cáo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã tái hiện một tỷ lệ của khoá học và nhìn con số tuyệt đối dao động hàng chục phần trăm trong khi tỷ lệ vẫn giữ — chứng minh tỷ lệ đi được còn số tuyệt đối thì không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">khối out</span><span class="v">Một lần chạy thật đã ghi lại trong khoá này — hãy tái hiện nó, đừng học thuộc.</span></div>
  <div class="kv"><span class="k">Tái hiện</span><span class="v">Tự chạy một phép đo để xác nhận cơ chế, không chỉ đọc kết quả.</span></div>
  <div class="kv"><span class="k">Tỷ lệ với tuyệt đối</span><span class="v">ns/thao tác tuyệt đối là phần cứng; tỷ lệ giữa hai phép đo mới là bài học mang đi được.</span></div>
  <div class="kv"><span class="k">Điều kiện của phép đo</span><span class="v">Hình dạng object, CPU và cách đo mà một con số được lấy dưới đó; con số thiếu chúng thành lời đồn.</span></div>
  <div class="kv"><span class="k">Đoán-rồi-chạy</span><span class="v">Phát biểu kỳ vọng trước khi chạy, để việc đoán sai thật sự dạy được bạn.</span></div>
  <div class="kv"><span class="k">Cố ý phá</span><span class="v">Tái hiện một cú hỏng có chủ đích ở đây, nơi nó rẻ, thay vì gặp nó lúc 2 giờ sáng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi khối <code>out</code> là một lần chạy thật trên Node 22.22.2 — mục tiêu là tái hiện các con số và để ý chỗ số bạn khác.</li>
  <li>Mỗi bài: đọc cơ chế, tự chạy, đổi một biến và đoán trước, rồi cố ý phá nó.</li>
  <li>Con số tuyệt đối là phần cứng và sẽ dao động ±30%; các tỷ lệ mới là bài học và phải tái hiện được ở bất cứ đâu.</li>
  <li>Mục tiêu cuối: cầm một dịch vụ bạn không viết và trong một tiếng, biết p99 của nó, lần theo một request, thấy lần deploy gần nhất trên biểu đồ lỗi, và nói được cú hỏng nào đáng gọi người dậy.</li>
</ul>

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
