/**
 * Node.js — Chương 15: Log và quan sát hệ thống (observability).
 * Mọi output là đo thật: Node v22.21.0 (máy 10 nhân), pino 10.1.0,
 * pino-http 11.0.0, prom-client 15.1.3, @opentelemetry/sdk-node 0.208.0,
 * express 5.2.1, pg 8.16.3, PostgreSQL 16 (local :5433), autocannon 8.0.0.
 * Phần production lấy bằng curl và đọc code thật của cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 15 — Logging and observability|||Chương 15 — Log và quan sát hệ thống',
  description: 'Vì sao console.log vẫn sống sót được ba năm rồi đột nhiên vô dụng đúng lúc bạn cần nó nhất, một dòng log giá bao nhiêu byte và bao nhiêu request mỗi giây, làm sao nối ba mươi dòng log rời rạc về đúng một request, và vì sao một nhãn Prometheus đặt sai chỗ ngốn 939MB RAM.',
  lessons: [
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — Three pillars, and why console.log runs out|||15.1 — Ba trụ cột, và điểm dừng của console.log',
      slug: 'nodejs-15-1-log-co-cau-truc',
      type: 'VIDEO',
      description: 'Đo thật con số mà ai cũng đoán mò: console.log so với pino về throughput, độ trễ p97.5, dung lượng đĩa và độ chặn event loop — rồi phát hiện thư viện log mặc định đang ghi nguyên Authorization header vào file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Three pillars, and why <code>console.log</code> runs out</h2>
<p class="lead">Fourteen chapters of this course debugged code by reading output on a terminal. That works because you were standing next to the process when it ran. Production removes that luxury: the process is inside a container, on a machine you are not looking at, serving people you cannot ask, and by the time you hear about a problem it already finished. Observability is the discipline of leaving behind enough evidence that a question you did not anticipate can still be answered afterwards.</p>

<h3>The three kinds of evidence</h3>
<p>The industry settled on three shapes of evidence, usually called the three pillars. They answer different questions and they are not substitutes for each other:</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Logs — discrete events</span><span class="lz-d">"at 02:14:07 request abc123 threw in listNotes". Answers the question <em>what happened to THIS ONE</em>. Expensive in volume, cheap in concept</span></div>
  <div class="lz-node"><span class="lz-t">Metrics — numbers aggregated over time</span><span class="lz-d">"the 5xx rate rose from 0.1% to 4% in 10 minutes". Answers <em>how the system as a whole is doing</em>. Astonishingly cheap, but it cannot tell one user's story</span></div>
  <div class="lz-node"><span class="lz-t">Traces — one request's timing tree</span><span class="lz-d">"that request took 8.2 seconds, 7.9 of them in 12 identical pg queries". Answers <em>where the time went</em>. The costliest to build, the most valuable when tracing a cause</span></div>
</div>

<p>A useful way to hold them in your head: metrics tell you <em>that</em> something is wrong, traces tell you <em>where</em> it is wrong, logs tell you <em>what exactly</em> was wrong. Alerting on logs is expensive; debugging with metrics is impossible. Most production incidents walk down that list in order.</p>

<h3>What is actually wrong with <code>console.log</code></h3>
<p>Nothing, while you are reading it with your eyes. Everything, the moment a machine has to read it. Compare one line of each:</p>

<pre><code>[2026-07-25T17:20:00.000Z] INFO request finished reqId=r-0 method=GET url=/api/v1/notes status=200 ms=12

{"level":30,"time":1785206560047,"pid":31843,"hostname":"Cuong-Hoang.local","reqId":"r-0","method":"GET","url":"/api/v1/notes","status":200,"ms":12,"msg":"request finished"}</code></pre>

<p>Both contain the same facts. Only the second can answer <em>"show me every request slower than 1000ms, grouped by URL, for the last hour"</em> without writing a regex that breaks the first time somebody puts a space in a title. That is the whole argument for structured logging, and lesson 15.3 measures exactly how much that difference is worth.</p>

<h3>The performance claim, measured</h3>
<p>"Structured logging is slower" is repeated everywhere and almost never measured. Here is 100.000 lines written by five different methods, same machine, output redirected to a real file on disk:</p>

<div class="out">console.log(chuỗi thô)        408,0ms   245.102 dòng/giây   RSS 53→64MB
console.log(JSON.stringify)   392,2ms   254.992 dòng/giây   RSS 53→64MB
pino → stdout                 188,4ms   530.809 dòng/giây   RSS 53→106MB
pino → file (async, đệm)      190,3ms   525.407 dòng/giây   RSS 53→105MB
pino → file (sync)            407,8ms   245.202 dòng/giây   RSS 53→64MB</div>

<p>Structured logging is not slower. <strong>pino writing JSON is 2,1× faster than <code>console.log</code> writing a shorter plain string</strong> — and it wrote <em>more</em> bytes doing it (17,8MB versus 10,9MB for the same 100.000 events). The speed comes from two design choices you can copy: pino serialises with a pre-compiled function per logger shape instead of a generic <code>JSON.stringify</code>, and it writes into a buffer that is flushed on a separate tick instead of issuing one <code>write(2)</code> syscall per line.</p>

<p>Look at the last row before concluding the library is magic. <strong>The same pino, configured with <code>sync: true</code>, drops straight back to console.log speed.</strong> The library was never the variable. The variable was buffering.</p>

<h3>Why a synchronous write hurts more than the number suggests</h3>
<p>Throughput hides the part that actually damages a server. Node's <code>process.stdout</code> is <strong>synchronous when it points at a file or a TTY</strong> — the write blocks the event loop until the kernel accepts the bytes. Measure it with a heartbeat: a <code>setInterval</code> every 20ms, recording its worst lateness while a burst of 100.000 lines is written:</p>

<div class="out">console.log   ghi 100.000 dòng trong 367ms   nhịp tim trễ TỐI ĐA 349ms
pino (đệm)    ghi 100.000 dòng trong 155ms   nhịp tim trễ TỐI ĐA 135ms</div>

<p>For 349 milliseconds nothing else ran: no request was parsed, no promise resolved, no timer fired. That is a single burst of logging producing a latency spike indistinguishable from a garbage-collection pause, and it will never appear in your logs — because the thing that would log it is the thing being blocked.</p>

<div class="callout warn">
<p><strong>Container caveat, and it flips the sign.</strong> Under Docker, stdout is a <em>pipe</em>, not a file, and Node writes to pipes asynchronously. So the blocking above does not reproduce in a container — instead the bytes queue in memory, and if the log consumer (the Docker daemon, a sidecar shipper) stalls, that queue grows without bound. You traded a latency spike for a memory leak. Neither is good; buffered-with-a-bound is the only answer that is.</p>
</div>

<h3>The number that matters: cost per request</h3>
<p>Lines per second is a benchmark. Requests per second is a bill. Same Express app, one route returning a tiny JSON body, hammered with <code>autocannon -c 50 -d 5</code>, and the only difference between runs is how it logs:</p>

<div class="out">cấu hình              req/giây   p50   p97.5   max     ghi ra đĩa
không log gì           14.729    3ms    5ms   37ms   0
console.log 1 dòng     12.121    3ms    7ms   40ms   53 B/dòng   3,06MB
pino gọn (JSON)        13.170    3ms    6ms   41ms   96 B/dòng   6,35MB
pino-http mặc định     10.313    4ms    7ms   41ms  486 B/dòng  23,96MB
pino-http (sync)        9.410    4ms    8ms   52ms  486 B/dòng  21,86MB</div>

<p>Three readings, in order of how often they are got wrong.</p>
<p><strong>One.</strong> Logging is not free. Even the cheapest option costs 10,6% of throughput. Anyone who tells you a log line is "basically nothing" has not measured one.</p>
<p><strong>Two.</strong> <strong>The structured logger beat the plain string</strong> — 13.170 against 12.121 — while writing 1,8× more bytes per line. Same conclusion as the microbenchmark, now with an HTTP server attached.</p>
<p><strong>Three, and this is the real lesson:</strong> the slow row is not "pino", it is <strong>pino-http with default settings</strong>, which writes 486 bytes per request instead of 96. The 30% throughput loss is buying you five times the disk for information nobody reads. The library did not make you slow. The default config did.</p>

<h3>What those 486 bytes actually contain</h3>
<p>Worth looking at before deciding it is harmless. One request, logged by <code>pino-http</code> out of the box, formatted for reading:</p>

<pre><code>{
 "level": 30,
 "time": 1785206702944,
 "pid": 32249,
 "hostname": "Cuong-Hoang.local",
 "req": {
  "id": 1,
  "method": "GET",
  "url": "/notes",
  "query": {},
  "params": {},
  "headers": {
   "host": "127.0.0.1:4518",
   "user-agent": "curl/8.7.1",
   "accept": "*/*",
   "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.demo",
   "cookie": "backend_token=abc123"
  },
  "remoteAddress": "::ffff:127.0.0.1",
  "remotePort": 54211
 },
 "res": { "statusCode": 200, "headers": { ... } },
 "responseTime": 3,
 "msg": "request completed"
}</code></pre>

<div class="danger">
<p><strong>Read the two lines in the middle again.</strong> The default configuration wrote <code>authorization: "Bearer eyJhbGci…"</code> and <code>cookie: "backend_token=abc123"</code> into a log file, in plaintext, for every single request. That file is then shipped to a log aggregator, replicated, indexed, retained for ninety days, and readable by everyone with dashboard access — including contractors, including the intern, including anyone who compromises the aggregator. <strong>Every session token of every user, sitting in a system that was never designed to hold secrets.</strong></p>
</div>

<p>This is not a bug in pino-http. It is the honest default: it logs the request, and headers are part of the request. It is your job to say which parts must never be written down. pino has a purpose-built option for exactly this:</p>

<pre><code>const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
    ],
    censor: '[ĐÃ CHE]',
  },
});</code></pre>

<p>Then a login request carrying a real password, a real bearer token and a real cookie — and a developer who "just for now" logged the whole body:</p>

<div class="out">BODY  : {"email":"a@b.com","password":"[ĐÃ CHE]","token":"[ĐÃ CHE]"}
HEADER: {"authorization":"[ĐÃ CHE]","cookie":"[ĐÃ CHE]"}
---- có lộ SECRET/MatKhauThat/rt_xyz/abc123 trong file? -> false</div>

<p>The <code>*.password</code> wildcard is the part that earns its keep. It matches the field wherever it appears — in a body, in a nested object, in a place you have not written yet — so the protection survives the next developer who logs something without thinking about it. Redaction that depends on everyone remembering is not redaction.</p>

<h3>Levels: the cheapest performance feature you own</h3>
<p>A log call that is below the configured level should cost nothing. Measure whether it does:</p>

<div class="out">pino level=warn, call log.debug() 100.000 lần   9,2ms   10.884.650 lần/giây
console.log có canh cấp độ bằng if            0,9ms  114.209.618 lần/giây</div>

<p>pino's suppressed call costs roughly 92 nanoseconds — it still builds the argument object before discovering the level is off. The hand-rolled guard costs 9 nanoseconds because the object is never built. Both are irrelevant next to a 500.000-per-second write. The practical rule: <strong>put <code>logger.debug</code> anywhere you want; put <code>logger.info</code> where you would be willing to pay for it in production</strong>, because that is exactly what you will do.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the expensive part of a suppressed log is not the logger, it is the argument. <code>logger.debug({ rows: await countEverything() }, 'x')</code> runs the query at every level, forever, including in production where the line is never written. If building the payload costs anything, guard it: <code>if (logger.isLevelEnabled('debug'))</code>.</p>
</div>

<h3>What this site does</h3>
<p>The backend behind cuongthai.com does not use pino. It has a 40-line <code>src/utils/logger.ts</code> that wraps <code>console.*</code> and switches format by environment:</p>

<pre><code>const line = config.nodeEnv === 'production'
  ? JSON.stringify(record)                       // máy đọc
  : \`[\${record.ts}] \${level.toUpperCase()} \${message}\`;  // người đọc</code></pre>

<p>That is a defensible choice for a single-container deployment: it is structured where it matters, it has zero dependencies, and it costs one <code>console.log</code>. What it gives up is exactly what this lesson measured — buffering, redaction and level-aware argument skipping. It is the right trade for now and the wrong trade at ten times the traffic, and the way you will know is that the p97.5 latency starts wobbling in a way the code does not explain.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> HTTP access logs come from <code>morgan('combined')</code>, with one deliberate override worth copying: some endpoints accept a JWT in the query string for SSE streaming, and morgan's default <code>:url</code> token would write that token into the access log verbatim. The site overrides the token to strip it — the same class of leak this lesson found in pino-http, caught by someone who thought about it in advance:</p>
<pre><code>morgan.token('url', (req) =&gt; (req.originalUrl || req.url || '')
  .replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '$1[REDACTED]'));</code></pre>
<p>Health probes are excluded via <code>skip</code>, so uptime checks every ten seconds do not drown the real traffic.</p>
</div>

<h3>The decision, compressed</h3>
<div class="kv-grid">
  <div class="kv"><span>Format</span><b>JSON in production, human-readable in dev. Never one format everywhere.</b></div>
  <div class="kv"><span>Library</span><b>Only matters through buffering + redaction + serialisers. console.log is fine until you need those.</b></div>
  <div class="kv"><span>Buffering</span><b>Non-negotiable at load. Sync writes to a file block the event loop for hundreds of milliseconds.</b></div>
  <div class="kv"><span>Redaction</span><b>Configure before the first deploy. A leaked token in a 90-day log store is a 90-day incident.</b></div>
  <div class="kv"><span>Defaults</span><b>Read what your logger writes by hand, once. 486 bytes per request is a decision, not a fact.</b></div>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-984"><span class="lc-t">Code Lab · The Three Pillars: Logs, Metrics, Traces</span><span class="lc-d">Exercises on what each pillar can and cannot answer</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-985"><span class="lc-t">Code Lab · Structured Logging</span><span class="lc-d">Turning console.log into machine-readable evidence</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Ba trụ cột, và điểm dừng của <code>console.log</code></h2>
<p class="lead">Mười bốn chương vừa rồi, bạn gỡ lỗi bằng cách đọc output trên terminal. Cách đó chạy được vì bạn đang đứng ngay cạnh tiến trình lúc nó chạy. Production lấy đi đặc quyền ấy: tiến trình nằm trong container, trên một cái máy bạn không nhìn thấy, phục vụ những người bạn không hỏi được, và tới lúc bạn nghe tin có sự cố thì nó đã xảy ra xong rồi. Quan sát hệ thống (observability) là kỷ luật để lại đủ bằng chứng, sao cho một câu hỏi bạn <em>chưa từng lường trước</em> vẫn trả lời được về sau.</p>

<h3>Ba dạng bằng chứng</h3>
<p>Ngành phần mềm chốt lại ba dạng bằng chứng, thường gọi là ba trụ cột. Chúng trả lời những câu hỏi khác nhau và <strong>không</strong> thay thế được cho nhau:</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Log — sự kiện rời rạc</span><span class="lz-d">"lúc 02:14:07 request abc123 ném lỗi ở listNotes". Trả lời <em>chuyện gì đã xảy ra với CÁI NÀY</em>. Đắt về dung lượng, rẻ về mặt khái niệm</span></div>
  <div class="lz-node"><span class="lz-t">Metric — số tổng hợp theo thời gian</span><span class="lz-d">"tỉ lệ 5xx tăng từ 0,1% lên 4% trong 10 phút". Trả lời <em>hệ thống nói chung đang thế nào</em>. Rẻ khủng khiếp, nhưng không kể được câu chuyện của một người dùng cụ thể</span></div>
  <div class="lz-node"><span class="lz-t">Trace — cây thời gian của một request</span><span class="lz-d">"request đó mất 8,2 giây, trong đó 7,9 giây nằm ở 12 truy vấn pg giống hệt nhau". Trả lời <em>thời gian đã đi đâu</em>. Đắt nhất để dựng, giá trị nhất khi truy nguyên</span></div>
</div>

<p>Một cách nhớ dễ dùng: <strong>metric cho biết CÓ chuyện, trace cho biết chuyện Ở ĐÂU, log cho biết chuyện đó CHÍNH XÁC là gì.</strong> Cảnh báo dựa trên log thì đắt; gỡ lỗi bằng metric thì bất khả thi. Phần lớn sự cố production đi đúng theo thứ tự đó.</p>

<h3>Vấn đề thật sự của <code>console.log</code></h3>
<p>Không có vấn đề gì cả, chừng nào <em>mắt bạn</em> đọc nó. Có mọi vấn đề, ngay khi <em>một cái máy</em> phải đọc nó. So một dòng của mỗi kiểu:</p>

<pre><code>[2026-07-25T17:20:00.000Z] INFO request finished reqId=r-0 method=GET url=/api/v1/notes status=200 ms=12

{"level":30,"time":1785206560047,"pid":31843,"hostname":"Cuong-Hoang.local","reqId":"r-0","method":"GET","url":"/api/v1/notes","status":200,"ms":12,"msg":"request finished"}</code></pre>

<p>Cả hai chứa cùng một sự thật. Chỉ dòng thứ hai trả lời được câu <em>"cho tôi xem mọi request chậm hơn 1000ms, gom theo URL, trong một giờ vừa rồi"</em> mà không phải viết một cái regex sẽ vỡ ngay lần đầu có người đặt dấu cách trong tiêu đề. Đó là toàn bộ lý lẽ của log có cấu trúc, và bài 15.3 sẽ đo xem khác biệt ấy đáng giá bao nhiêu.</p>

<h3>Đo cái luận điểm "chậm hơn"</h3>
<p>Câu "log có cấu trúc thì chậm hơn" được nhắc ở khắp nơi và gần như không ai đo. Đây là 100.000 dòng ghi bằng năm cách, cùng một máy, output đổ vào một file thật trên đĩa:</p>

<div class="out">console.log(chuỗi thô)        408,0ms   245.102 dòng/giây   RSS 53→64MB
console.log(JSON.stringify)   392,2ms   254.992 dòng/giây   RSS 53→64MB
pino → stdout                 188,4ms   530.809 dòng/giây   RSS 53→106MB
pino → file (async, có đệm)   190,3ms   525.407 dòng/giây   RSS 53→105MB
pino → file (sync)            407,8ms   245.202 dòng/giây   RSS 53→64MB</div>

<p>Log có cấu trúc <strong>không</strong> chậm hơn. <strong>pino ghi JSON nhanh gấp 2,1 lần <code>console.log</code> ghi một chuỗi ngắn hơn</strong> — và nó còn ghi <em>nhiều byte hơn</em> (17,8MB so với 10,9MB cho cùng 100.000 sự kiện). Tốc độ đến từ hai lựa chọn thiết kế mà bạn hoàn toàn bắt chước được: pino tuần tự hoá bằng một hàm biên dịch sẵn theo hình dạng của logger thay vì gọi <code>JSON.stringify</code> tổng quát, và nó ghi vào một vùng đệm rồi xả ở tick khác thay vì gọi một syscall <code>write(2)</code> cho mỗi dòng.</p>

<p>Nhưng hãy nhìn dòng cuối trước khi kết luận thư viện này có phép màu. <strong>Vẫn pino đó, cấu hình <code>sync: true</code>, tụt thẳng về đúng tốc độ console.log.</strong> Biến số chưa bao giờ là thư viện. Biến số là <em>đệm</em>.</p>

<h3>Vì sao ghi đồng bộ đau hơn con số nó thể hiện</h3>
<p>Throughput che mất phần thật sự làm hỏng một máy chủ. <code>process.stdout</code> của Node là <strong>đồng bộ khi nó trỏ vào file hoặc TTY</strong> — lệnh ghi <em>chặn</em> event loop cho tới khi nhân hệ điều hành nhận đủ byte. Đo bằng nhịp tim: một <code>setInterval</code> 20ms, ghi lại độ trễ tệ nhất của nó trong lúc 100.000 dòng đang được đổ ra:</p>

<div class="out">console.log   ghi 100.000 dòng trong 367ms   nhịp tim trễ TỐI ĐA 349ms
pino (có đệm) ghi 100.000 dòng trong 155ms   nhịp tim trễ TỐI ĐA 135ms</div>

<p>Trong 349 mili-giây đó <strong>không có gì khác chạy</strong>: không request nào được phân tích, không promise nào được giải quyết, không timer nào nổ. Đó là một đợt log duy nhất tạo ra một đỉnh trễ không phân biệt được với một lần dọn rác (GC) — và nó sẽ không bao giờ xuất hiện trong log của bạn, bởi vì thứ lẽ ra ghi lại nó chính là thứ đang bị chặn.</p>

<div class="callout warn">
<p><strong>Ngoại lệ trong container, và nó đảo dấu.</strong> Dưới Docker, stdout là một <em>pipe</em> chứ không phải file, mà Node ghi vào pipe theo kiểu bất đồng bộ. Nên hiện tượng chặn ở trên <em>không</em> tái hiện trong container — thay vào đó byte xếp hàng trong bộ nhớ, và nếu bên tiêu thụ log (Docker daemon, một sidecar gom log) bị nghẽn thì hàng đợi ấy phình không có trần. Bạn vừa đổi một đỉnh trễ lấy một chỗ rò bộ nhớ. Cả hai đều tệ; chỉ "có đệm và có trần" mới là câu trả lời đúng.</p>
</div>

<h3>Con số quan trọng nhất: giá trên mỗi request</h3>
<p>Số dòng mỗi giây là một bài benchmark. Số request mỗi giây là một cái hoá đơn. Vẫn app Express đó, một route trả JSON bé, nện bằng <code>autocannon -c 50 -d 5</code>, khác biệt duy nhất giữa các lần chạy là cách nó log:</p>

<div class="out">cấu hình              req/giây   p50   p97.5   max     ghi ra đĩa
không log gì           14.729    3ms    5ms   37ms   0
console.log 1 dòng     12.121    3ms    7ms   40ms   53 B/dòng   3,06MB
pino gọn (JSON)        13.170    3ms    6ms   41ms   96 B/dòng   6,35MB
pino-http mặc định     10.313    4ms    7ms   41ms  486 B/dòng  23,96MB
pino-http (sync)        9.410    4ms    8ms   52ms  486 B/dòng  21,86MB</div>

<p>Ba cách đọc, xếp theo mức độ hay bị hiểu sai.</p>
<p><strong>Một.</strong> Log không miễn phí. Ngay cả lựa chọn rẻ nhất cũng lấy mất 10,6% throughput. Ai bảo bạn một dòng log "gần như chả tốn gì" thì người đó chưa đo bao giờ.</p>
<p><strong>Hai.</strong> <strong>Logger có cấu trúc thắng chuỗi thô</strong> — 13.170 so với 12.121 — trong khi ghi nhiều hơn 1,8 lần số byte mỗi dòng. Cùng kết luận với microbenchmark, giờ có thêm một máy chủ HTTP gắn vào.</p>
<p><strong>Ba, và đây mới là bài học thật:</strong> dòng chậm không phải "pino", mà là <strong>pino-http với cấu hình mặc định</strong>, thứ ghi 486 byte mỗi request thay vì 96. Cái giá 30% throughput ấy đang mua cho bạn gấp năm lần dung lượng đĩa chứa thông tin không ai đọc. Thư viện không làm bạn chậm. <em>Cấu hình mặc định</em> làm bạn chậm.</p>

<h3>486 byte đó thật ra chứa gì</h3>
<p>Nên nhìn tận mắt trước khi kết luận nó vô hại. Một request, log bởi <code>pino-http</code> nguyên bản, định dạng lại cho dễ đọc:</p>

<pre><code>{
 "level": 30,
 "time": 1785206702944,
 "pid": 32249,
 "hostname": "Cuong-Hoang.local",
 "req": {
  "id": 1,
  "method": "GET",
  "url": "/notes",
  "query": {},
  "params": {},
  "headers": {
   "host": "127.0.0.1:4518",
   "user-agent": "curl/8.7.1",
   "accept": "*/*",
   "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.demo",
   "cookie": "backend_token=abc123"
  },
  "remoteAddress": "::ffff:127.0.0.1",
  "remotePort": 54211
 },
 "res": { "statusCode": 200, "headers": { ... } },
 "responseTime": 3,
 "msg": "request completed"
}</code></pre>

<div class="danger">
<p><strong>Đọc lại hai dòng ở giữa.</strong> Cấu hình mặc định vừa ghi <code>authorization: "Bearer eyJhbGci…"</code> và <code>cookie: "backend_token=abc123"</code> vào một file log, ở dạng chữ thường, <em>cho mọi request</em>. File đó sau đó được đẩy sang hệ gom log, nhân bản, đánh chỉ mục, giữ 90 ngày, và ai có quyền xem dashboard đều đọc được — kể cả nhà thầu ngoài, kể cả thực tập sinh, kể cả bất kỳ ai chiếm được hệ gom log. <strong>Toàn bộ token phiên của toàn bộ người dùng, nằm trong một hệ thống chưa bao giờ được thiết kế để giữ bí mật.</strong></p>
</div>

<p>Đây không phải lỗi của pino-http. Đó là mặc định trung thực: nó log request, mà header là một phần của request. Việc nói phần nào <em>không bao giờ được viết ra</em> là việc của bạn. pino có sẵn một tuỳ chọn sinh ra đúng cho chuyện này:</p>

<pre><code>const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
    ],
    censor: '[ĐÃ CHE]',
  },
});</code></pre>

<p>Rồi một request đăng nhập mang mật khẩu thật, bearer token thật, cookie thật — và một lập trình viên "tạm thời thôi" log cả body:</p>

<div class="out">BODY  : {"email":"a@b.com","password":"[ĐÃ CHE]","token":"[ĐÃ CHE]"}
HEADER: {"authorization":"[ĐÃ CHE]","cookie":"[ĐÃ CHE]"}
---- có lộ SECRET/MatKhauThat/rt_xyz/abc123 trong file? -> false</div>

<p>Ký tự đại diện <code>*.password</code> mới là thứ đáng đồng tiền. Nó khớp trường đó ở <em>bất kỳ đâu</em> — trong body, trong object lồng nhau, trong một chỗ bạn còn chưa viết ra — nên lớp bảo vệ sống sót qua được người tiếp theo lỡ log gì đó mà không nghĩ. Che bí mật mà phụ thuộc vào việc mọi người đều nhớ thì không phải là che bí mật.</p>

<h3>Cấp độ log: tính năng hiệu năng rẻ nhất bạn đang sở hữu</h3>
<p>Một lời gọi log nằm dưới cấp độ đã cấu hình thì lẽ ra phải tốn 0. Đo xem có đúng thế không:</p>

<div class="out">pino level=warn, gọi log.debug() 100.000 lần   9,2ms   10.884.650 lần/giây
console.log có canh cấp độ bằng if            0,9ms  114.209.618 lần/giây</div>

<p>Lời gọi bị chặn của pino tốn khoảng 92 nano-giây — nó vẫn <em>dựng object tham số</em> rồi mới phát hiện cấp độ đang tắt. Bản tự canh bằng <code>if</code> tốn 9 nano-giây vì object không bao giờ được dựng. Cả hai đều không đáng kể bên cạnh một lệnh ghi 500.000 dòng/giây. Quy tắc thực dụng: <strong>đặt <code>logger.debug</code> ở đâu tuỳ thích; đặt <code>logger.info</code> ở nơi bạn <em>sẵn sàng trả tiền</em> cho nó trong production</strong>, vì đó chính xác là điều sẽ xảy ra.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> phần đắt của một dòng log bị chặn không nằm ở logger, nó nằm ở <em>tham số</em>. <code>logger.debug({ rows: await countEverything() }, 'x')</code> chạy truy vấn đó ở mọi cấp độ, mãi mãi, kể cả trong production nơi dòng ấy không bao giờ được ghi. Nếu việc dựng payload có giá, hãy canh: <code>if (logger.isLevelEnabled('debug'))</code>.</p>
</div>

<h3>Site này đang làm gì</h3>
<p>Backend sau cuongthai.com không dùng pino. Nó có một file <code>src/utils/logger.ts</code> dài 40 dòng bọc quanh <code>console.*</code> và đổi định dạng theo môi trường:</p>

<pre><code>const line = config.nodeEnv === 'production'
  ? JSON.stringify(record)                       // cho máy đọc
  : \`[\${record.ts}] \${level.toUpperCase()} \${message}\`;  // cho người đọc</code></pre>

<p>Đó là lựa chọn bảo vệ được cho một triển khai một container: có cấu trúc ở chỗ cần có, không phụ thuộc gói ngoài, và giá bằng đúng một lời gọi <code>console.log</code>. Cái nó từ bỏ chính là những thứ bài này vừa đo — đệm, che bí mật, và bỏ qua tham số theo cấp độ. Đó là đánh đổi đúng ở thời điểm hiện tại và là đánh đổi sai khi lưu lượng gấp mười, và dấu hiệu để bạn biết là độ trễ p97.5 bắt đầu dao động theo cách mà code không giải thích được.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Access log HTTP đến từ <code>morgan('combined')</code>, kèm đúng một chỗ ghi đè rất đáng bắt chước: vài endpoint nhận JWT qua query string để chạy SSE, và token <code>:url</code> mặc định của morgan sẽ ghi nguyên cái JWT ấy vào access log. Site ghi đè token đó để cắt bỏ — cùng loại lỗ rò mà bài này vừa tìm thấy ở pino-http, chỉ khác là có người đã nghĩ tới trước:</p>
<pre><code>morgan.token('url', (req) =&gt; (req.originalUrl || req.url || '')
  .replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '$1[REDACTED]'));</code></pre>
<p>Các endpoint kiểm tra sức khoẻ được loại ra bằng <code>skip</code>, nên phép kiểm uptime chạy mỗi mười giây không nhấn chìm lưu lượng thật.</p>
</div>

<h3>Chốt lại thành quyết định</h3>
<div class="kv-grid">
  <div class="kv"><span>Định dạng</span><b>JSON ở production, dễ đọc ở dev. Đừng dùng một định dạng cho mọi nơi.</b></div>
  <div class="kv"><span>Thư viện</span><b>Chỉ quan trọng qua ba thứ: đệm, che bí mật, serializer. console.log ổn cho tới khi bạn cần chúng.</b></div>
  <div class="kv"><span>Đệm</span><b>Không thương lượng khi có tải. Ghi đồng bộ ra file chặn event loop hàng trăm mili-giây.</b></div>
  <div class="kv"><span>Che bí mật</span><b>Cấu hình TRƯỚC lần deploy đầu. Một token rò vào kho log giữ 90 ngày là một sự cố kéo dài 90 ngày.</b></div>
  <div class="kv"><span>Mặc định</span><b>Tự tay đọc xem logger của bạn ghi cái gì, một lần. 486 byte mỗi request là một quyết định, không phải một sự thật hiển nhiên.</b></div>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-984"><span class="lc-t">Code Lab · Ba trụ cột: Log, Metric, Trace</span><span class="lc-d">Bài tập về việc mỗi trụ cột trả lời được và không trả lời được gì</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-985"><span class="lc-t">Code Lab · Structured Logging</span><span class="lc-d">Biến console.log thành bằng chứng máy đọc được</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — Correlation: one id through every layer|||15.2 — Ngữ cảnh: một mã số xuyên qua mọi tầng',
      slug: 'nodejs-15-2-request-id',
      type: 'VIDEO',
      description: 'Ba request đồng thời, mười tám dòng log trộn lẫn vào nhau, và không dòng nào cho biết nó thuộc về ai — rồi sửa bằng AsyncLocalStorage và đo xem lớp sửa ấy tốn bao nhiêu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Correlation: one id through every layer</h2>
<p class="lead">A structured log line is a fact. A hundred structured log lines from a server handling forty concurrent requests is a pile of facts with the relationships torn out. This lesson is about the single field that puts the relationships back, and about the mechanism that gets that field into every line without threading a parameter through your entire codebase.</p>

<h3>The problem, reproduced honestly</h3>
<p>A three-layer Notes API — route calls service, service calls repository — each layer logging what it is doing. Three requests arrive at the same moment (users <code>an</code>, <code>binh</code>, <code>chi</code>). This is the real output, exactly as it came out:</p>

<div class="out">   —     | route: nhận request
   —     | service: bắt đầu userId=binh
   —     | repo: truy vấn notes userId=binh
   —     | route: nhận request
   —     | service: bắt đầu userId=chi
   —     | repo: truy vấn notes userId=chi
   —     | route: nhận request
   —     | service: bắt đầu userId=an
   —     | repo: truy vấn notes userId=an
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời</div>

<p>Read the bottom nine lines. Nine events, three requests, and <strong>nothing in the file says which is which</strong>. The <code>userId</code> field saved the first half only because the developer happened to pass it down; the completion path has no such luck. If one of those three had thrown, you could not tell which user's request failed.</p>

<p>Notice also that the order is scrambled — <code>binh</code>'s work appears before <code>chi</code>'s, whose work appears before <code>an</code>'s, and the completions come back in a third order entirely. That is not a bug. That is what concurrency looks like in a log file, and it is why "just read the lines around it" stops working the moment you have more than one user.</p>

<h3>The fix is one field</h3>
<p>Stamp every request with an id at the door, and put that id on every line the request produces. Same code, same three requests:</p>

<div class="out">cd2e4116 | route: nhận request
cd2e4116 | service: bắt đầu userId=chi
cd2e4116 | repo: truy vấn notes userId=chi
befb9fd3 | route: nhận request
befb9fd3 | service: bắt đầu userId=binh
befb9fd3 | repo: truy vấn notes userId=binh
c8efd8dd | route: nhận request
c8efd8dd | service: bắt đầu userId=an
c8efd8dd | repo: truy vấn notes userId=an
c8efd8dd | repo: xong rows=3
c8efd8dd | service: xong
c8efd8dd | route: trả lời
cd2e4116 | repo: xong rows=3
cd2e4116 | service: xong
cd2e4116 | route: trả lời
befb9fd3 | repo: xong rows=3
befb9fd3 | service: xong
befb9fd3 | route: trả lời</div>

<p>The lines are still interleaved — that did not change and cannot change. What changed is that <code>grep c8efd8dd</code> now reconstructs one complete request, in order, out of a file with a million lines in it. That is the entire value proposition, and it costs one field.</p>

<h3>The hard part is not the id. It is getting it everywhere.</h3>
<p>The obvious implementation is to pass it down:</p>

<pre><code>async function listNotes(userId, reqId) {           // ← tham số mới
  log.info({ reqId, userId }, 'service: bắt đầu');
  return repoFindNotes(userId, reqId);              // ← truyền tiếp
}</code></pre>

<p>This works, and it is what most codebases do for about six months. Then you notice that <code>reqId</code> has appeared in the signature of two hundred functions, none of which care about it, and that every new function has to be threaded before it can log, and that a helper three levels down cannot log at all because nobody passed it. The parameter is not carrying business meaning. It is carrying <em>ambient context</em>, and functions are a bad container for ambient context.</p>

<h3><code>AsyncLocalStorage</code>: ambient context that survives <code>await</code></h3>
<p>Node has a core module for exactly this. <code>AsyncLocalStorage</code> holds a value that is visible to everything running "inside" a call — including across <code>await</code>, timers, promise chains and callbacks — without any of those things naming it:</p>

<pre><code>import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const als = new AsyncLocalStorage();

// a single middleware, placed before every route
app.use((req, res, next) =&gt; {
  const reqId = req.headers['x-request-id'] || randomUUID().slice(0, 8);
  res.setHeader('X-Request-ID', reqId);
  als.run({ log: logger.child({ reqId }) }, next);
});

// everywhere else in the application
function log() { return als.getStore()?.log ?? logger; }</code></pre>

<p>Now the service and repository log through <code>log()</code> and get the right child logger automatically. <strong>Neither function takes <code>reqId</code> as a parameter.</strong> That is the output shown above — the three-layer app that produced those clean lines has no correlation parameter anywhere in it.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">A request arrives</span><span class="lz-d">middleware generates or reuses a reqId and echoes it back in the header <code>X-Request-ID</code></span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">als.run(store, next)</span><span class="lz-d">opens a "context region"; everything running inside <code>next()</code> can see the store</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Route → service → repo</span><span class="lz-d">call <code>als.getStore()</code>, get the right child logger, and no function takes an extra parameter</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">await, setTimeout, callback</span><span class="lz-d">the context follows the async chain; this is exactly where a global variable FAILS</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">The request ends</span><span class="lz-d">the context region is reclaimed automatically; nothing to clean up by hand</span></div>
</div>

<div class="callout">
<p><strong>Why a global variable does not work here.</strong> The tempting shortcut is <code>global.currentReqId = id</code>. It survives exactly until two requests overlap: request A sets the global, hits <code>await</code>, request B overwrites the global, A resumes and logs B's id. Every line is now wrong, and wrong in the most expensive way — it looks right. <code>AsyncLocalStorage</code> exists because the runtime is the only thing that knows which async chain you are currently on.</p>
</div>

<h3>What does that cost?</h3>
<p>"Async hooks are slow" is a real reputation, earned by the older <code>async_hooks</code> API. Measure the current one. Same Express app, one route, one log line, four configurations, <code>autocannon -c 50 -d 5</code>:</p>

<div class="out">cấu hình                        req/giây   p50   p97.5
không có gì (mốc)                13.687    3ms    6ms
chỉ sinh randomUUID + gắn req    12.825    3ms    6ms
AsyncLocalStorage (store trần)   12.839    3ms    6ms
AsyncLocalStorage + child logger 12.910    3ms    6ms</div>

<p>The three instrumented rows are within noise of each other. <strong>The entire cost — 6% — is paid by the extra middleware and the extra field in the log line. <code>AsyncLocalStorage</code> itself adds nothing measurable on top of that.</strong> The reputation is out of date; V8 and Node have optimised the promise-context path heavily since Node 16.</p>

<h3>Choosing the id</h3>
<p>Since the id is generated once per request, its cost is real but small. Measured, one million generations each:</p>

<div class="out">randomUUID()                          148,2ms    6.748.283/giây   80b208ab-9823-4c46-948c-1cb56a7319e1
Math.random().toString(36)            226,4ms    4.417.631/giây   unp295m4
randomUUID({disableEntropyCache:true}) 225,4ms*     887.127/giây   4788d7ff-ae40-4018-8ca1-e10e67733b4a
randomBytes(8).toString('hex')        578,8ms*     863.822/giây   2fe3eeb426e54847
bộ đếm pid+seq                         30,8ms   32.426.736/giây   p3e-lflr

* đo trên 200.000 và 500.000 vòng rồi quy đổi</div>

<p>Two surprises worth carrying away. <strong>The counter is 4,8× faster than <code>randomUUID</code></strong> — if you want the absolute cheapest id and your process is the only one generating them, <code>pid + sequence</code> is unbeatable and still unique across restarts. And <strong>disabling the entropy cache makes <code>randomUUID</code> 7,6× slower</strong>: by default Node pre-generates a block of randomness and slices ids out of it, which is why the cached path outruns <code>randomBytes</code> by a factor of eight.</p>

<p>At 13.000 requests per second, <code>randomUUID</code> costs 0,15% of one core. This is not a decision worth agonising over — but it is worth knowing that the "obviously cheap" option was the slow one and the "obviously slow" option was fast.</p>

<h3>Honouring the id you were given</h3>
<p>The id must not be generated fresh at every hop, or a request that crosses three services gets three ids and the whole exercise fails. The rule is: <strong>accept an inbound <code>X-Request-ID</code> if there is one, generate only if there is not</strong>, and always echo it back:</p>

<pre><code>const incoming = (req.headers['x-request-id'])?.trim();
const id = incoming &amp;&amp; incoming.length &lt;= 64 ? incoming : nanoid(12);
req.id = id;
res.setHeader('X-Request-ID', id);</code></pre>

<p>The length check matters. An inbound header is attacker-controlled: without a bound, someone posts a 4MB <code>X-Request-ID</code> and you obligingly write it into every log line of that request, then ship it to your aggregator, then pay for it. Trust-but-truncate.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> echoing the id back in the response header is not decoration — it is how a user reports a problem. "It broke" is unactionable; "it broke and the response said X-Request-ID: mJumRwAigpAO" is a grep away from the stack trace. Put the id in your error page, your API error body, and your support form.</p>
</div>

<h3>What this site does</h3>
<p>Ask cuongthai.com for anything and read the response headers — with <code>GET</code>, not <code>HEAD</code>:</p>

<div class="out">$ curl -s -o /dev/null -D - https://cuongthai.com/api/v1/courses

HTTP/1.1 200 OK
Server: nginx/1.27.5
X-Request-ID: mJumRwAigpAO
Access-Control-Expose-Headers: X-Request-ID,Content-Range,Accept-Ranges,Content-Length
RateLimit-Policy: 2000;w=900</div>

<p>Twelve characters from <code>nanoid</code>, generated by the first middleware in the chain, echoed back, and — the detail most implementations forget — listed in <code>Access-Control-Expose-Headers</code>. Without that line the browser will not let front-end JavaScript read the header, so the front end cannot show the id in an error toast and the whole chain of evidence breaks at the last step.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The middleware sits at position 1b in <code>src/index.ts</code> — before helmet, before CORS, before the rate limiter — so that even a request rejected with 429 carries an id. It honours an inbound header (nginx can set one) with a 64-character cap, exactly as described above. What the site does <em>not</em> yet have is <code>AsyncLocalStorage</code>: <code>req.id</code> is available on the request object, so route handlers can log it, but a service called three layers down cannot. That is the upgrade this lesson exists to justify.</p>
</div>

<h3>Beyond logs: the same id everywhere</h3>
<p>Once the id is ambient, everything that reports on a request can carry it, and every one of these has repaid the effort in a real incident:</p>

<div class="kv-grid">
  <div class="kv"><span>Response header</span><b>Users can read it and send it to you</b></div>
  <div class="kv"><span>Error body</span><b>Return it with the error so support can paste it into a ticket</b></div>
  <div class="kv"><span>Sentry / error tracker</span><b>Attach it as a tag → jump from an error report to the exact log lines</b></div>
  <div class="kv"><span>A slow DB query</span><b>Embed it in a SQL comment <code>/* reqId=abc */</code> → pg_stat_activity tells you which request is locking the table</b></div>
  <div class="kv"><span>Background jobs</span><b>Pass it in the BullMQ payload (chapter 13) → a job running 10 minutes later still traces back to the request that enqueued it</b></div>
  <div class="kv"><span>Calling another service</span><b>Forward it in the <code>X-Request-ID</code> header so the whole system shares one id</b></div>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-987"><span class="lc-t">Code Lab · Capturing Context &amp; Breadcrumbs</span><span class="lc-d">Attaching request context to every report</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-986"><span class="lc-t">Code Lab · Error Tracking with Sentry</span><span class="lc-d">Turning a stack trace into a tagged, searchable event</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Ngữ cảnh: một mã số xuyên qua mọi tầng</h2>
<p class="lead">Một dòng log có cấu trúc là một sự thật. Một trăm dòng log có cấu trúc từ máy chủ đang xử lý bốn mươi request đồng thời là một đống sự thật đã bị xé mất phần quan hệ giữa chúng. Bài này nói về đúng một trường dữ liệu để nối lại quan hệ ấy, và về cơ chế đưa trường đó vào <em>mọi</em> dòng mà không phải luồn một tham số xuyên qua cả codebase.</p>

<h3>Tái hiện vấn đề một cách trung thực</h3>
<p>Một Notes API ba tầng — route gọi service, service gọi repository — mỗi tầng log việc mình đang làm. Ba request đến cùng lúc (người dùng <code>an</code>, <code>binh</code>, <code>chi</code>). Đây là output thật, đúng như nó chạy ra:</p>

<div class="out">   —     | route: nhận request
   —     | service: bắt đầu userId=binh
   —     | repo: truy vấn notes userId=binh
   —     | route: nhận request
   —     | service: bắt đầu userId=chi
   —     | repo: truy vấn notes userId=chi
   —     | route: nhận request
   —     | service: bắt đầu userId=an
   —     | repo: truy vấn notes userId=an
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời
   —     | repo: xong rows=3
   —     | service: xong
   —     | route: trả lời</div>

<p>Đọc chín dòng cuối. Chín sự kiện, ba request, và <strong>không có gì trong file cho biết dòng nào thuộc về ai</strong>. Trường <code>userId</code> cứu được nửa đầu chỉ vì lập trình viên tình cờ truyền nó xuống; nhánh kết thúc thì không may mắn như vậy. Nếu một trong ba request ấy ném lỗi, bạn không thể biết request của người dùng nào đã hỏng.</p>

<p>Cũng để ý rằng thứ tự bị đảo lộn — việc của <code>binh</code> xuất hiện trước <code>chi</code>, rồi mới tới <code>an</code>, còn phần kết thúc lại quay về theo một thứ tự thứ ba hoàn toàn khác. Đó không phải lỗi. Đó là hình dạng của tính đồng thời khi nhìn qua file log, và đó là lý do "cứ đọc mấy dòng xung quanh là ra" ngừng hoạt động ngay khi bạn có nhiều hơn một người dùng.</p>

<h3>Cách sửa gọn trong một trường</h3>
<p>Đóng dấu mọi request bằng một mã số ngay ở cửa, rồi gắn mã đó vào mọi dòng mà request ấy sinh ra. Vẫn code đó, vẫn ba request đó:</p>

<div class="out">cd2e4116 | route: nhận request
cd2e4116 | service: bắt đầu userId=chi
cd2e4116 | repo: truy vấn notes userId=chi
befb9fd3 | route: nhận request
befb9fd3 | service: bắt đầu userId=binh
befb9fd3 | repo: truy vấn notes userId=binh
c8efd8dd | route: nhận request
c8efd8dd | service: bắt đầu userId=an
c8efd8dd | repo: truy vấn notes userId=an
c8efd8dd | repo: xong rows=3
c8efd8dd | service: xong
c8efd8dd | route: trả lời
cd2e4116 | repo: xong rows=3
cd2e4116 | service: xong
cd2e4116 | route: trả lời
befb9fd3 | repo: xong rows=3
befb9fd3 | service: xong
befb9fd3 | route: trả lời</div>

<p>Các dòng vẫn xen kẽ — điều đó không đổi và không thể đổi. Cái đã đổi là <code>grep c8efd8dd</code> giờ dựng lại được nguyên một request hoàn chỉnh, đúng thứ tự, từ một file có một triệu dòng. Đó là toàn bộ giá trị, và nó tốn đúng một trường.</p>

<h3>Phần khó không phải cái mã. Phần khó là đưa nó tới MỌI NƠI.</h3>
<p>Cách cài đặt hiển nhiên là truyền nó xuống:</p>

<pre><code>async function listNotes(userId, reqId) {           // ← tham số mới
  log.info({ reqId, userId }, 'service: bắt đầu');
  return repoFindNotes(userId, reqId);              // ← truyền tiếp
}</code></pre>

<p>Cách này chạy được, và phần lớn codebase làm đúng như vậy trong khoảng sáu tháng. Rồi bạn nhận ra <code>reqId</code> đã mọc vào chữ ký của hai trăm hàm mà không hàm nào quan tâm tới nó, rằng mọi hàm mới đều phải được luồn tham số trước khi log được, và rằng một hàm phụ trợ nằm sâu ba tầng thì <em>không log được gì cả</em> vì chẳng ai truyền cho nó. Tham số ấy không mang ý nghĩa nghiệp vụ. Nó mang <em>ngữ cảnh môi trường</em>, mà tham số hàm là cái hộp tồi để đựng ngữ cảnh môi trường.</p>

<h3><code>AsyncLocalStorage</code>: ngữ cảnh sống sót qua <code>await</code></h3>
<p>Node có sẵn một module lõi sinh ra đúng cho việc này. <code>AsyncLocalStorage</code> giữ một giá trị nhìn thấy được bởi mọi thứ đang chạy "bên trong" một lời gọi — kể cả xuyên qua <code>await</code>, timer, chuỗi promise và callback — mà không thứ nào trong số đó phải gọi tên nó:</p>

<pre><code>import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const als = new AsyncLocalStorage();

// đúng một middleware, đặt trước mọi route
app.use((req, res, next) =&gt; {
  const reqId = req.headers['x-request-id'] || randomUUID().slice(0, 8);
  res.setHeader('X-Request-ID', reqId);
  als.run({ log: logger.child({ reqId }) }, next);
});

// mọi nơi khác trong ứng dụng
function log() { return als.getStore()?.log ?? logger; }</code></pre>

<p>Giờ service và repository log qua <code>log()</code> và tự động nhận đúng child logger. <strong>Không hàm nào nhận <code>reqId</code> làm tham số.</strong> Đó chính là output ở trên — cái app ba tầng sinh ra những dòng sạch sẽ ấy không có một tham số ngữ cảnh nào trong người.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Request đến</span><span class="lz-d">middleware sinh hoặc nhận lại reqId, dội ngược vào header <code>X-Request-ID</code></span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">als.run(store, next)</span><span class="lz-d">mở một "vùng ngữ cảnh"; mọi thứ chạy bên trong <code>next()</code> đều nhìn thấy store</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Route → service → repo</span><span class="lz-d">gọi <code>als.getStore()</code>, lấy đúng child logger, không hàm nào nhận thêm tham số</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">await, setTimeout, callback</span><span class="lz-d">ngữ cảnh đi theo chuỗi bất đồng bộ; đây là điểm mà biến toàn cục THẤT BẠI</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Request kết thúc</span><span class="lz-d">vùng ngữ cảnh bị thu hồi tự động; không có gì phải dọn tay</span></div>
</div>

<div class="callout">
<p><strong>Vì sao biến toàn cục KHÔNG dùng được ở đây.</strong> Lối tắt hấp dẫn là <code>global.currentReqId = id</code>. Nó sống sót đúng tới lúc hai request chồng lên nhau: request A đặt biến toàn cục, gặp <code>await</code>, request B ghi đè biến ấy, A chạy tiếp và log ra mã của B. Mọi dòng giờ đều sai, và sai theo kiểu đắt nhất — trông vẫn đúng. <code>AsyncLocalStorage</code> tồn tại vì runtime là thứ duy nhất biết bạn đang ở trên chuỗi bất đồng bộ nào.</p>
</div>

<h3>Cái đó tốn bao nhiêu?</h3>
<p>"Async hooks chậm lắm" là một tiếng xấu có thật, kiếm được từ API <code>async_hooks</code> đời cũ. Đo cái đời nay xem sao. Vẫn app Express đó, một route, một dòng log, bốn cấu hình, <code>autocannon -c 50 -d 5</code>:</p>

<div class="out">cấu hình                            req/giây   p50   p97.5
không có gì (mốc)                    13.687    3ms    6ms
chỉ sinh randomUUID + gắn vào req     12.825    3ms    6ms
AsyncLocalStorage (store trần)        12.839    3ms    6ms
AsyncLocalStorage + child logger      12.910    3ms    6ms</div>

<p>Ba dòng có đo đạc nằm trong sai số của nhau. <strong>Toàn bộ chi phí — 6% — là do middleware phụ và trường phụ trong dòng log. Bản thân <code>AsyncLocalStorage</code> không thêm gì đo được lên trên đó.</strong> Tiếng xấu kia đã lỗi thời; V8 và Node đã tối ưu đường truyền ngữ cảnh promise rất mạnh kể từ Node 16.</p>

<h3>Chọn cách sinh mã</h3>
<p>Vì mã chỉ sinh một lần mỗi request nên giá của nó có thật nhưng nhỏ. Đo thật, mỗi cách một triệu lần:</p>

<div class="out">randomUUID()                          148,2ms    6.748.283/giây   80b208ab-9823-4c46-948c-1cb56a7319e1
Math.random().toString(36)            226,4ms    4.417.631/giây   unp295m4
randomUUID({disableEntropyCache:true}) 225,4ms*     887.127/giây   4788d7ff-ae40-4018-8ca1-e10e67733b4a
randomBytes(8).toString('hex')        578,8ms*     863.822/giây   2fe3eeb426e54847
bộ đếm pid+seq                         30,8ms   32.426.736/giây   p3e-lflr

* đo trên 200.000 và 500.000 vòng rồi quy đổi</div>

<p>Hai bất ngờ đáng mang về. <strong>Bộ đếm nhanh gấp 4,8 lần <code>randomUUID</code></strong> — nếu bạn muốn mã rẻ nhất tuyệt đối và tiến trình của bạn là nơi duy nhất sinh ra chúng thì <code>pid + số thứ tự</code> là vô địch mà vẫn không trùng sau khi khởi động lại. Và <strong>tắt bộ đệm entropy làm <code>randomUUID</code> chậm đi 7,6 lần</strong>: mặc định Node sinh sẵn một khối ngẫu nhiên rồi cắt mã ra từ đó, đó là lý do đường có đệm chạy nhanh hơn <code>randomBytes</code> tới tám lần.</p>

<p>Ở mức 13.000 request mỗi giây, <code>randomUUID</code> tốn 0,15% của một nhân. Đây không phải quyết định đáng vò đầu bứt tai — nhưng đáng biết rằng lựa chọn "hiển nhiên rẻ" lại là cái chậm, còn lựa chọn "hiển nhiên chậm" lại nhanh.</p>

<h3>Tôn trọng cái mã người ta đã đưa cho bạn</h3>
<p>Mã không được sinh mới ở mỗi chặng, nếu không một request đi qua ba dịch vụ sẽ có ba mã và cả bài tập này thất bại. Quy tắc là: <strong>nhận <code>X-Request-ID</code> từ bên ngoài nếu có, chỉ sinh mới khi không có</strong>, và luôn dội ngược lại:</p>

<pre><code>const incoming = (req.headers['x-request-id'])?.trim();
const id = incoming &amp;&amp; incoming.length &lt;= 64 ? incoming : nanoid(12);
req.id = id;
res.setHeader('X-Request-ID', id);</code></pre>

<p>Phép kiểm độ dài rất quan trọng. Header từ ngoài vào là thứ kẻ tấn công điều khiển được: không có trần, ai đó gửi một <code>X-Request-ID</code> dài 4MB và bạn ngoan ngoãn ghi nó vào <em>mọi</em> dòng log của request ấy, rồi đẩy sang hệ gom log, rồi trả tiền cho nó. Tin nhưng phải cắt.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> dội mã số ngược vào header phản hồi không phải để trang trí — đó là <em>cách người dùng báo lỗi cho bạn</em>. "Nó hỏng" thì không làm gì được; "nó hỏng và phản hồi ghi X-Request-ID: mJumRwAigpAO" thì chỉ cách stack trace đúng một lệnh grep. Hãy đặt mã ấy vào trang lỗi, vào thân lỗi của API, và vào biểu mẫu hỗ trợ.</p>
</div>

<h3>Site này đang làm gì</h3>
<p>Hỏi cuongthai.com bất cứ thứ gì rồi đọc header phản hồi — bằng <code>GET</code>, không phải <code>HEAD</code>:</p>

<div class="out">$ curl -s -o /dev/null -D - https://cuongthai.com/api/v1/courses

HTTP/1.1 200 OK
Server: nginx/1.27.5
X-Request-ID: mJumRwAigpAO
Access-Control-Expose-Headers: X-Request-ID,Content-Range,Accept-Ranges,Content-Length
RateLimit-Policy: 2000;w=900</div>

<p>Mười hai ký tự từ <code>nanoid</code>, sinh bởi middleware đầu tiên trong chuỗi, dội ngược lại, và — chi tiết mà phần lớn nơi khác quên — được liệt kê trong <code>Access-Control-Expose-Headers</code>. Không có dòng đó thì trình duyệt <em>không cho</em> JavaScript phía front-end đọc header, nên front-end không hiện được mã số trong thông báo lỗi và cả chuỗi bằng chứng đứt ngay ở bước cuối.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Middleware nằm ở vị trí 1b trong <code>src/index.ts</code> — trước helmet, trước CORS, trước bộ giới hạn tần suất — để cả một request bị từ chối bằng 429 cũng mang mã số. Nó tôn trọng header từ ngoài vào (nginx có thể đặt) với trần 64 ký tự, đúng như mô tả ở trên. Cái site <em>chưa</em> có là <code>AsyncLocalStorage</code>: <code>req.id</code> nằm trên object request nên route handler log được, nhưng một service nằm sâu ba tầng thì không. Đó chính là bước nâng cấp mà bài học này tồn tại để biện hộ.</p>
</div>

<h3>Không chỉ log: cùng một mã ở khắp nơi</h3>
<p>Một khi mã số đã thành ngữ cảnh môi trường, mọi thứ báo cáo về request đều mang được nó theo, và mỗi mục dưới đây đều đã trả đủ công sức bỏ ra trong một sự cố thật:</p>

<div class="kv-grid">
  <div class="kv"><span>Header phản hồi</span><b>Người dùng đọc được và gửi cho bạn</b></div>
  <div class="kv"><span>Thân lỗi API</span><b>Trả kèm mã lỗi để hỗ trợ khách hàng dán vào ticket</b></div>
  <div class="kv"><span>Sentry / hệ theo dõi lỗi</span><b>Gắn làm tag → nhảy từ báo lỗi sang đúng dòng log</b></div>
  <div class="kv"><span>Truy vấn DB chậm</span><b>Chèn vào SQL comment <code>/* reqId=abc */</code> → pg_stat_activity chỉ ra request nào đang khoá bảng</b></div>
  <div class="kv"><span>Job nền</span><b>Truyền vào payload BullMQ (chương 13) → job chạy 10 phút sau vẫn truy ngược được về request đã đẩy nó vào hàng đợi</b></div>
  <div class="kv"><span>Gọi service khác</span><b>Chuyển tiếp bằng header <code>X-Request-ID</code> để cả hệ thống dùng chung một mã</b></div>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-987"><span class="lc-t">Code Lab · Capturing Context &amp; Breadcrumbs</span><span class="lc-d">Gắn ngữ cảnh request vào mọi báo cáo</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-986"><span class="lc-t">Code Lab · Error Tracking with Sentry</span><span class="lc-d">Biến một stack trace thành sự kiện có tag, tìm kiếm được</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — What logs cost, and finding one line in a million|||15.3 — Log tốn bao nhiêu, và tìm một dòng trong một triệu',
      slug: 'nodejs-15-3-chi-phi-va-tim-kiem',
      type: 'VIDEO',
      description: '51,6GB mỗi ngày chỉ vì một cấu hình mặc định, một lệnh grep 2,2 giây trên 229MB, và một chiến lược lấy mẫu cắt 100 lần dung lượng mà vẫn giữ 100% sự cố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>What logs cost, and finding one line in a million</h2>
<p class="lead">Logging feels free because the cost arrives in a different month than the decision. You add a field in April; in September the log bill has doubled and nobody can point at which change did it. This lesson puts numbers on both halves — what a line costs to store, and what it costs to search — so the trade-off is visible while you are still making it.</p>

<h3>The daily bill, by log shape</h3>
<p>Four log formats, 200.000 realistic lines each (varied URLs, statuses, durations, user agents, IPs — not the same line repeated, which would compress unrealistically well). The last column extrapolates to a modest 1000 requests per second:</p>

<div class="out">kiểu dòng             200k dòng   B/dòng    gzip   tỉ lệ nén   1000 req/giây → mỗi ngày
chuỗi thô               23,8MB     125B    1,1MB    21,4×      10,0GB  (nén 0,47GB)
JSON gọn                31,4MB     165B    2,4MB    13,2×      13,2GB  (nén 1,00GB)
JSON đủ ngữ cảnh        58,2MB     305B    6,4MB     9,2×      24,6GB  (nén 2,68GB)
pino-http mặc định     122,3MB     641B    9,2MB    13,3×      51,6GB  (nén 3,87GB)</div>

<p>Three things to take from that table.</p>
<p><strong>The default costs 5,1× the minimum.</strong> Going from a hand-written 125-byte line to <code>pino-http</code> out of the box is the difference between 10GB and 51,6GB per day — at a typical managed-log price of roughly one dollar per gigabyte ingested, that is a five-thousand-dollar-a-month difference for information nobody reads.</p>
<p><strong>Structure costs about 30%.</strong> The honest comparison is line 1 against line 2: same facts, 125 bytes as text against 165 as JSON. That 32% is the real price of machine-readability, and the rest of this lesson is about what it buys.</p>
<p><strong>Compression is enormous and it is the reason you can afford any of this.</strong> 9× to 21×, because log lines are extremely repetitive by nature — the same keys, the same URLs, the same status codes, over and over. Note the inversion: the <em>richer</em> JSON compresses <em>better</em> in ratio terms (13,3× for pino-http) because more of each line is boilerplate. Never store logs uncompressed, and never estimate cost from the uncompressed size.</p>

<div class="callout warn">
<p><strong>Retention is the multiplier nobody budgets for.</strong> 24,6GB per day is not the number on the invoice. Ninety days of retention makes it 2,2TB, and if your aggregator replicates three ways it is 6,6TB. Retention is a slider that multiplies everything — and unlike sampling, it is one you can change after the fact, on old data, without touching any code.</p>
</div>

<h3>The other half: what does it cost to read?</h3>
<p>One million lines, 229MB of JSON logs, containing exactly one interesting request — a 500 that took 8241ms, buried at line 777.778. Every search below was run against that file:</p>

<div class="out">=== tìm 1 request theo requestId ===
grep chuỗi thô                       2,20s   1 dòng khớp
grep -F (chuỗi cố định)              2,22s   1 dòng khớp
jq lọc theo trường .requestId        3,78s   1 dòng khớp

=== tìm MỌI request chậm hơn 1000ms ===
jq 'select(.durationMs > 1000)'      3,70s   1 dòng khớp
grep -F '"status":500' | jq          2,40s   1 dòng khớp

=== tìm mọi dòng status 500 ===
grep -F '"status":500'               2,35s   1 dòng khớp
jq 'select(.status == 500)'          3,69s   1 dòng khớp</div>

<p>Two practical facts. <strong><code>grep</code> is roughly 1,6× faster than <code>jq</code></strong>, because it never parses anything — it scans bytes. And <strong>the fastest correct answer is the combination</strong>: <code>grep</code> to cut the file down to candidates, then <code>jq</code> to apply the condition that needs real types. 2,40s versus 3,70s, and the pattern scales — on a ten-gigabyte file that ratio is the difference between waiting and giving up.</p>

<p>Now look at the middle block again, because it contains the argument for this whole chapter. <strong>The query "every request slower than 1000ms" cannot be expressed against a plain-text log at all.</strong> <code>durationMs</code> is a number; <code>grep</code> compares bytes. You would have to write a regex that matches "a number greater than 1000" — which means enumerating digit-count cases — and it would silently break the first time a duration is formatted differently. With JSON it is nine characters: <code>.durationMs&gt;1000</code>. That is the 32% buying itself back.</p>

<h3>The question a log can answer that a metric cannot</h3>
<p>Because every line is a typed record, the log file is a database you did not have to set up. Computing p50/p95/max per URL directly from those million lines:</p>

<pre><code>$ jq -s 'group_by(.url)[] | {url: .[0].url, n: length,
    p50: (map(.durationMs)|sort|.[(length*0.5)|floor]),
    p95: (map(.durationMs)|sort|.[(length*0.95)|floor]),
    max: (map(.durationMs)|max)}' -c logs/haystack.log</code></pre>

<div class="out">{"url":"/api/v1/courses/nodejs","n":250000,"p50":60.1,"p95":114,"max":120}
{"url":"/api/v1/feed","n":250000,"p50":60.1,"p95":113.9,"max":8241}
{"url":"/api/v1/messages/threads","n":250000,"p50":60.1,"p95":114,"max":120}
{"url":"/api/v1/notes","n":250000,"p50":59.9,"p95":114,"max":120}

11,4 giây cho 1.000.000 dòng</div>

<div class="danger">
<p><strong>Stare at row two.</strong> <code>/api/v1/feed</code> has a p95 of 113,9ms — identical to every other route, comfortably inside any SLO you would write — and a <strong>max of 8241ms</strong>. One user waited eight and a half seconds and <em>the p95 does not know</em>. It cannot: one bad request in 250.000 is the 99,9996th percentile. <strong>Percentiles are designed to hide outliers; that is what makes them stable, and that is what makes them blind.</strong> Alert on percentiles, investigate with max, and never conclude "everything is fine" from a healthy p95 alone.</p>
</div>

<h3>Sampling: keeping the signal, dropping the bill</h3>
<p>The obvious way to cut log cost is to log less. The obvious way to log less — raise the level to <code>warn</code> — is also the way to throw away exactly the context you need when something breaks, because the interesting lines are the <code>info</code> ones <em>around</em> the error.</p>
<p>The better strategy is <strong>keep everything abnormal, sample the rest</strong>. Run over the same million lines: keep 100% of 5xx, 100% of anything slower than 1000ms, and 1% of everything else, chosen by a stable hash of the request id so that <em>all</em> lines of a sampled request survive together:</p>

<pre><code>let h = 0;
const s = record.requestId;
for (let i = 0; i &lt; s.length; i++) h = (h * 31 + s.charCodeAt(i)) &gt;&gt;&gt; 0;
const sampled = (h % 10000) &lt; RATE * 10000;

if (record.status &gt;= 500 || record.durationMs &gt; 1000 || sampled) keep(record);</code></pre>

<div class="out">tổng          1.000.000 dòng / 229,3MB
giữ lại          10.034 dòng /   2,3MB  = 1,00% dung lượng (giảm 100×)
lỗi 5xx       giữ 1/1 (100%)
request chậm  giữ 1/1 (100%)</div>

<p>A hundredfold reduction with <strong>zero loss of incident data</strong>. The hash is the part that makes it work: a naive <code>Math.random() &lt; 0.01</code> per line would keep a scattered 1% of lines from every request, producing a file full of orphaned fragments — the worst of both worlds. Hashing the request id means each request is entirely in or entirely out, so a sampled request is still a complete story.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the hash must be over a value that is <em>identical on every line of the request</em> and <em>stable across processes</em>. Hash the request id, not the timestamp, not a per-line counter, and not <code>Math.random()</code>. If two containers hash the same request differently, a request that crossed both is half-kept — which looks exactly like a request that vanished mid-flight, and you will spend an afternoon chasing it.</p>
</div>

<h3>Levels, and the one rule that keeps them useful</h3>
<p>Levels only work if everyone agrees what they mean. The version that survives contact with a team:</p>

<div class="kv-grid">
  <div class="kv"><span>error</span><b>Someone has to act. If you are not going to do anything about it, it is not an error</b></div>
  <div class="kv"><span>warn</span><b>Unusual but already handled: a successful retry, a fallback path, a quota exhausted</b></div>
  <div class="kv"><span>info</span><b>Business events you are willing to PAY to keep: logins, payments, data deletion</b></div>
  <div class="kv"><span>debug</span><b>Turned on while chasing a specific incident. OFF in production, controlled by an environment variable</b></div>
  <div class="kv"><span>trace</span><b>So detailed only its author can read it. Never enabled broadly</b></div>
</div>

<p>The rule that keeps this from rotting: <strong>an <code>error</code> that nobody acts on trains everyone to ignore <code>error</code></strong>. A log level is a promise about who will read it. Downgrade anything that fires routinely — a 401 on an expired token is not an error, it is Tuesday — or within a month your error channel is noise and a real outage scrolls past unnoticed.</p>

<h3>Rotation: the outage that logging causes</h3>
<p>At 24,6GB a day, a 100GB disk fills in four days. When it fills, PostgreSQL stops accepting writes, Docker cannot start containers, and the log that would have told you why cannot be written. <strong>This is the single most common way logging takes down a service</strong>, and this project has lived it — the VPS once filled its disk and killed Postgres with it.</p>

<pre><code># /etc/docker/daemon.json — trần cứng cho MỌI container
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "5" }
}</code></pre>

<p>250MB per container, hard ceiling, enforced by the daemon rather than by anyone remembering. Two details that matter: this applies only to containers <em>created after</em> the change, so existing ones need recreating; and <code>docker logs</code> only ever shows what is inside that window, which is why anything you need beyond a few hours must be shipped somewhere else before it rotates away.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">The application</span><span class="lz-d">writes JSON to stdout. It does NOT open files and does NOT rotate them — that is not the process's job</span></div>
  <div class="lz-layer"><span class="lz-t">Docker json-file driver</span><span class="lz-d">captures stdout and rotates by max-size/max-file. This is the hard ceiling against a full disk</span></div>
  <div class="lz-layer"><span class="lz-t">The collector (Vector, Promtail, Fluent Bit)</span><span class="lz-d">reads those files, samples, compresses and ships. If it dies, the application does not</span></div>
  <div class="lz-layer"><span class="lz-t">The log store (Loki, ELK, a paid service)</span><span class="lz-d">indexes, queries and retains. This is where the bill is calculated</span></div>
</div>

<p>The important property of that stack is that each layer can fail without taking the one above it down. An app that writes to stdout keeps serving when the shipper dies. An app that writes directly to a remote log service blocks when that service is slow — which is how a logging outage becomes an application outage.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The backend writes JSON to stdout and owns nothing below that line — no log files, no rotation code, no shipper embedded in the process. Docker's json-file driver handles rotation, and <code>docker logs</code> is the read path. It is the simplest arrangement that has the failure isolation above, and it is enough at this traffic. The two upgrades it is missing, in the order they will be needed: a shipper, so history outlives rotation; and sampling at the shipper, so history is affordable.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Working backwards from a symptom to a log line</span></a>
</div>
<div class="link-card exphub">
  <a href="/exp-hub${REF}"><span class="lc-t">Exp Hub · Log-reading commands on a VPS</span><span class="lc-d">docker logs, journalctl, grep + jq in practice</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Log tốn bao nhiêu, và tìm một dòng trong một triệu</h2>
<p class="lead">Log có cảm giác miễn phí vì cái giá của nó tới vào một tháng khác với tháng bạn ra quyết định. Bạn thêm một trường vào tháng Tư; tới tháng Chín hoá đơn log tăng gấp đôi và không ai chỉ ra được thay đổi nào gây ra. Bài này đặt con số lên cả hai nửa — một dòng tốn bao nhiêu để <em>lưu</em>, và tốn bao nhiêu để <em>tìm</em> — để bạn nhìn thấy đánh đổi ngay lúc còn đang cân nhắc.</p>

<h3>Hoá đơn mỗi ngày, theo hình dạng dòng log</h3>
<p>Bốn định dạng log, mỗi cái 200.000 dòng sát thực tế (URL, mã trạng thái, thời gian, user agent, IP đều biến thiên — không phải một dòng lặp lại, vì như thế sẽ nén tốt một cách giả tạo). Cột cuối quy đổi ra mức lưu lượng khiêm tốn 1000 request mỗi giây:</p>

<div class="out">kiểu dòng             200k dòng   B/dòng    gzip   tỉ lệ nén   1000 req/giây → mỗi ngày
chuỗi thô               23,8MB     125B    1,1MB    21,4×      10,0GB  (nén 0,47GB)
JSON gọn                31,4MB     165B    2,4MB    13,2×      13,2GB  (nén 1,00GB)
JSON đủ ngữ cảnh        58,2MB     305B    6,4MB     9,2×      24,6GB  (nén 2,68GB)
pino-http mặc định     122,3MB     641B    9,2MB    13,3×      51,6GB  (nén 3,87GB)</div>

<p>Ba điều rút ra từ bảng đó.</p>
<p><strong>Cấu hình mặc định tốn gấp 5,1 lần mức tối thiểu.</strong> Đi từ một dòng tự viết 125 byte sang <code>pino-http</code> nguyên bản là khác biệt giữa 10GB và 51,6GB mỗi ngày — với giá dịch vụ log điển hình khoảng một đô-la cho mỗi gigabyte nạp vào, đó là chênh lệch năm nghìn đô-la một tháng cho thông tin không ai đọc.</p>
<p><strong>Cấu trúc tốn khoảng 30%.</strong> Phép so trung thực là dòng 1 với dòng 2: cùng sự thật đó, 125 byte dạng chữ so với 165 byte dạng JSON. 32% ấy là cái giá thật của tính "máy đọc được", và phần còn lại của bài này nói về việc nó mua được gì.</p>
<p><strong>Nén thì khổng lồ, và đó là lý do bạn kham nổi tất cả những thứ này.</strong> 9 tới 21 lần, vì log vốn cực kỳ lặp lại — cùng bộ khoá, cùng URL, cùng mã trạng thái, lặp đi lặp lại. Để ý sự đảo ngược: JSON <em>giàu thông tin hơn</em> lại nén <em>tốt hơn</em> về tỉ lệ (13,3 lần với pino-http) vì phần khuôn mẫu chiếm tỉ trọng lớn hơn trong mỗi dòng. Đừng bao giờ lưu log không nén, và đừng bao giờ ước lượng chi phí từ dung lượng chưa nén.</p>

<div class="callout warn">
<p><strong>Thời gian giữ log là hệ số nhân không ai tính vào ngân sách.</strong> 24,6GB mỗi ngày không phải con số trên hoá đơn. Giữ 90 ngày biến nó thành 2,2TB, và nếu hệ gom log nhân bản ba lần thì thành 6,6TB. Thời gian giữ là một cái cần gạt nhân lên tất cả — và khác với lấy mẫu, đó là cần gạt bạn chỉnh được <em>sau khi</em> dữ liệu đã sinh ra, trên dữ liệu cũ, không cần đụng vào code.</p>
</div>

<h3>Nửa còn lại: đọc nó tốn bao nhiêu?</h3>
<p>Một triệu dòng, 229MB log JSON, chứa đúng một request đáng quan tâm — một lỗi 500 mất 8241ms, chôn ở dòng 777.778. Mọi phép tìm dưới đây đều chạy trên file đó:</p>

<div class="out">=== tìm 1 request theo requestId ===
grep chuỗi thô                       2,20s   1 dòng khớp
grep -F (chuỗi cố định)              2,22s   1 dòng khớp
jq lọc theo trường .requestId        3,78s   1 dòng khớp

=== tìm MỌI request chậm hơn 1000ms ===
jq 'select(.durationMs > 1000)'      3,70s   1 dòng khớp
grep -F '"status":500' | jq          2,40s   1 dòng khớp

=== tìm mọi dòng status 500 ===
grep -F '"status":500'               2,35s   1 dòng khớp
jq 'select(.status == 500)'          3,69s   1 dòng khớp</div>

<p>Hai sự thật dùng được ngay. <strong><code>grep</code> nhanh hơn <code>jq</code> khoảng 1,6 lần</strong>, vì nó không phân tích cú pháp gì cả — nó quét byte. Và <strong>câu trả lời đúng mà nhanh nhất là phép kết hợp</strong>: <code>grep</code> để cắt file xuống còn ứng viên, rồi <code>jq</code> để áp điều kiện cần kiểu dữ liệu thật. 2,40s so với 3,70s, và tỉ lệ đó còn giữ khi phóng to — trên file mười gigabyte, khoảng cách ấy là khác biệt giữa "chờ được" và "bỏ cuộc".</p>

<p>Giờ nhìn lại khối giữa, vì nó chứa lý lẽ cho cả chương này. <strong>Câu hỏi "mọi request chậm hơn 1000ms" hoàn toàn KHÔNG diễn đạt được trên log dạng chữ thường.</strong> <code>durationMs</code> là một con số; <code>grep</code> so sánh byte. Bạn sẽ phải viết một regex khớp "một số lớn hơn 1000" — nghĩa là liệt kê theo số chữ số — và nó sẽ vỡ trong im lặng ngay lần đầu có ai đó định dạng thời gian khác đi. Với JSON thì là chín ký tự: <code>.durationMs&gt;1000</code>. Đó là chỗ 32% kia tự trả lại tiền.</p>

<h3>Câu hỏi mà log trả lời được còn metric thì không</h3>
<p>Vì mỗi dòng là một bản ghi có kiểu, file log chính là một cơ sở dữ liệu bạn không phải dựng. Tính p50/p95/max theo từng URL trực tiếp từ một triệu dòng đó:</p>

<pre><code>$ jq -s 'group_by(.url)[] | {url: .[0].url, n: length,
    p50: (map(.durationMs)|sort|.[(length*0.5)|floor]),
    p95: (map(.durationMs)|sort|.[(length*0.95)|floor]),
    max: (map(.durationMs)|max)}' -c logs/haystack.log</code></pre>

<div class="out">{"url":"/api/v1/courses/nodejs","n":250000,"p50":60.1,"p95":114,"max":120}
{"url":"/api/v1/feed","n":250000,"p50":60.1,"p95":113.9,"max":8241}
{"url":"/api/v1/messages/threads","n":250000,"p50":60.1,"p95":114,"max":120}
{"url":"/api/v1/notes","n":250000,"p50":59.9,"p95":114,"max":120}

11,4 giây cho 1.000.000 dòng</div>

<div class="danger">
<p><strong>Nhìn kỹ dòng thứ hai.</strong> <code>/api/v1/feed</code> có p95 là 113,9ms — giống hệt mọi route khác, nằm thoải mái trong bất kỳ mức cam kết nào bạn viết ra — và <strong>max là 8241ms</strong>. Một người dùng đã chờ tám giây rưỡi và <em>p95 không hề biết</em>. Nó không thể biết: một request tệ trên 250.000 là phân vị thứ 99,9996. <strong>Phân vị được thiết kế để GIẤU giá trị ngoại lai; đó là thứ làm nó ổn định, và cũng là thứ làm nó mù.</strong> Hãy cảnh báo bằng phân vị, điều tra bằng max, và đừng bao giờ kết luận "mọi thứ ổn" chỉ từ một p95 đẹp.</p>
</div>

<h3>Lấy mẫu: giữ tín hiệu, bỏ hoá đơn</h3>
<p>Cách hiển nhiên để cắt chi phí log là log ít đi. Cách hiển nhiên để log ít đi — nâng cấp độ lên <code>warn</code> — cũng chính là cách vứt bỏ đúng cái ngữ cảnh bạn cần khi có sự cố, vì những dòng đáng giá là các dòng <code>info</code> nằm <em>xung quanh</em> lỗi.</p>
<p>Chiến lược tốt hơn là <strong>giữ hết mọi thứ bất thường, lấy mẫu phần còn lại</strong>. Chạy trên cùng một triệu dòng đó: giữ 100% lỗi 5xx, 100% mọi thứ chậm hơn 1000ms, và 1% phần còn lại, chọn bằng một hàm băm ổn định trên mã request để <em>mọi</em> dòng của một request được chọn đều sống sót cùng nhau:</p>

<pre><code>let h = 0;
const s = record.requestId;
for (let i = 0; i &lt; s.length; i++) h = (h * 31 + s.charCodeAt(i)) &gt;&gt;&gt; 0;
const sampled = (h % 10000) &lt; RATE * 10000;

if (record.status &gt;= 500 || record.durationMs &gt; 1000 || sampled) keep(record);</code></pre>

<div class="out">tổng          1.000.000 dòng / 229,3MB
giữ lại          10.034 dòng /   2,3MB  = 1,00% dung lượng (giảm 100×)
lỗi 5xx       giữ 1/1 (100%)
request chậm  giữ 1/1 (100%)</div>

<p>Giảm một trăm lần mà <strong>không mất một chút dữ liệu sự cố nào</strong>. Hàm băm mới là phần làm nó chạy được: một phép <code>Math.random() &lt; 0.01</code> ngây thơ trên từng dòng sẽ giữ 1% số dòng rải rác của <em>mọi</em> request, sinh ra một file toàn mảnh vụn mồ côi — tệ cả đôi đường. Băm theo mã request nghĩa là mỗi request hoặc vào trọn vẹn hoặc ra trọn vẹn, nên một request được lấy mẫu vẫn là một câu chuyện hoàn chỉnh.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> hàm băm phải chạy trên một giá trị <em>giống hệt nhau ở mọi dòng của request</em> và <em>ổn định qua các tiến trình</em>. Hãy băm mã request, đừng băm dấu thời gian, đừng băm một bộ đếm theo dòng, và tuyệt đối đừng dùng <code>Math.random()</code>. Nếu hai container băm cùng một request ra hai kết quả khác nhau thì request đi qua cả hai sẽ bị giữ một nửa — trông y hệt một request bốc hơi giữa chừng, và bạn sẽ mất cả buổi chiều đuổi theo nó.</p>
</div>

<h3>Cấp độ, và một quy tắc giữ cho chúng còn hữu dụng</h3>
<p>Cấp độ chỉ có tác dụng khi mọi người thống nhất chúng nghĩa là gì. Phiên bản sống sót được khi va vào một đội thật:</p>

<div class="kv-grid">
  <div class="kv"><span>error</span><b>Cần người xử lý. Nếu bạn không định làm gì với nó thì nó không phải error</b></div>
  <div class="kv"><span>warn</span><b>Bất thường nhưng đã tự xử lý được: thử lại thành công, rơi về phương án dự phòng, hết hạn mức</b></div>
  <div class="kv"><span>info</span><b>Sự kiện nghiệp vụ mà bạn sẵn sàng TRẢ TIỀN để giữ: đăng nhập, thanh toán, xoá dữ liệu</b></div>
  <div class="kv"><span>debug</span><b>Bật khi đang truy vết một sự cố cụ thể. TẮT ở production, tính bằng biến môi trường</b></div>
  <div class="kv"><span>trace</span><b>Chi tiết tới mức chỉ tác giả đọc nổi. Không bao giờ bật rộng</b></div>
</div>

<p>Quy tắc giữ cho hệ thống này khỏi mục nát: <strong>một <code>error</code> mà không ai xử lý sẽ dạy cả đội bỏ qua <code>error</code></strong>. Cấp độ log là một lời hứa về việc ai sẽ đọc nó. Hãy hạ cấp mọi thứ nổ đều đặn — một mã 401 vì token hết hạn không phải lỗi, đó là chuyện thường ngày — nếu không thì trong vòng một tháng kênh báo lỗi của bạn thành tiếng ồn và một sự cố thật sẽ trôi qua mà không ai để ý.</p>

<h3>Xoay vòng log: sự cố do chính việc ghi log gây ra</h3>
<p>Ở mức 24,6GB một ngày, một ổ đĩa 100GB đầy trong bốn ngày. Khi nó đầy, PostgreSQL ngừng nhận ghi, Docker không khởi động được container, và cái log lẽ ra nói cho bạn biết vì sao thì không ghi nổi. <strong>Đây là cách phổ biến nhất mà việc ghi log đánh sập một dịch vụ</strong>, và chính dự án này đã trải qua — VPS từng đầy đĩa và kéo Postgres chết theo.</p>

<pre><code># /etc/docker/daemon.json — trần cứng cho MỌI container
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "5" }
}</code></pre>

<p>250MB mỗi container, trần cứng, do daemon cưỡng chế chứ không phụ thuộc vào việc ai đó nhớ ra. Hai chi tiết quan trọng: cấu hình này chỉ áp cho container <em>được tạo sau</em> thay đổi, nên container cũ phải tạo lại; và <code>docker logs</code> chỉ bao giờ hiện được phần nằm trong cửa sổ đó, đó là lý do bất cứ thứ gì bạn cần quá vài tiếng đều phải được đẩy đi nơi khác trước khi nó bị xoay mất.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Ứng dụng</span><span class="lz-d">ghi JSON ra stdout. KHÔNG tự mở file, KHÔNG tự xoay vòng — đó không phải việc của tiến trình</span></div>
  <div class="lz-layer"><span class="lz-t">Docker json-file driver</span><span class="lz-d">bắt stdout, xoay vòng theo max-size/max-file. Đây là trần cứng chống đầy đĩa</span></div>
  <div class="lz-layer"><span class="lz-t">Bộ gom (Vector, Promtail, Fluent Bit)</span><span class="lz-d">đọc file đó, lấy mẫu, nén, đẩy đi. Chết cũng không làm chết ứng dụng</span></div>
  <div class="lz-layer"><span class="lz-t">Kho log (Loki, ELK, dịch vụ trả phí)</span><span class="lz-d">đánh chỉ mục, truy vấn, giữ theo hạn. Đây là nơi hoá đơn được tính</span></div>
</div>

<p>Tính chất quan trọng của chồng tầng đó là mỗi tầng hỏng được mà không kéo tầng trên chết theo. Ứng dụng ghi ra stdout vẫn phục vụ bình thường khi bộ gom chết. Ứng dụng ghi thẳng sang một dịch vụ log từ xa sẽ bị chặn khi dịch vụ đó chậm — và đó là cách một sự cố của hệ thống log biến thành sự cố của ứng dụng.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Backend ghi JSON ra stdout và không sở hữu gì bên dưới ranh giới đó — không file log, không code xoay vòng, không bộ gom nhúng trong tiến trình. Driver json-file của Docker lo phần xoay vòng, và <code>docker logs</code> là đường đọc. Đó là cách sắp xếp đơn giản nhất mà vẫn có được tính cô lập lỗi ở trên, và ở mức lưu lượng này thế là đủ. Hai thứ nó còn thiếu, theo thứ tự sẽ cần tới: một bộ gom, để lịch sử sống lâu hơn vòng xoay; và lấy mẫu ở bộ gom, để lịch sử ấy còn kham nổi.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Đi ngược từ triệu chứng về đúng dòng log</span></a>
</div>
<div class="link-card exphub">
  <a href="/exp-hub${REF}"><span class="lc-t">Exp Hub · Lệnh đọc log trên VPS</span><span class="lc-d">docker logs, journalctl, grep + jq trong thực tế</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — Metrics, and the label that ate 939MB|||15.4 — Metric, và cái nhãn ngốn 939MB',
      slug: 'nodejs-15-4-metrics-prometheus',
      type: 'VIDEO',
      description: 'Dựng /metrics bằng prom-client, hiểu counter và histogram bằng con số thật, rồi tái hiện vụ nổ cardinality: một nhãn đặt sai chỗ biến 127 chuỗi thành 1.400.000 và 939MB RAM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Metrics, and the label that ate 939MB</h2>
<p class="lead">Logs answer questions about one request. Metrics answer questions about all of them at once, for a cost that does not grow with traffic — a counter incremented ten million times occupies the same eight bytes as one incremented twice. That property is what makes metrics the only affordable way to watch a system continuously. It is also, as this lesson shows with a 939MB measurement, extremely easy to destroy by accident.</p>

<h3>The four instrument types</h3>
<p>Prometheus — the de facto standard, and what <code>prom-client</code> implements — has four:</p>

<div class="kv-grid">
  <div class="kv"><span>Counter</span><b>Only increases, never decreases. Total requests, total errors, total bytes sent. Ask for the "rate" with <code>rate()</code></b></div>
  <div class="kv"><span>Gauge</span><b>Moves freely up and down. Open connections, queue length, memory in use</b></div>
  <div class="kv"><span>Histogram</span><b>Counts observations falling into predefined buckets. This is what gives you p50/p95/p99</b></div>
  <div class="kv"><span>Summary</span><b>Computes percentiles INSIDE the process. Do not use it: it cannot be aggregated across containers</b></div>
</div>

<p>The Counter-versus-Gauge distinction matters more than it looks. A counter never resets except when the process restarts, and Prometheus detects that reset and corrects for it. A gauge that you increment and decrement by hand will drift out of sync the first time an error path skips the decrement — and drift silently, forever, because nothing recomputes it.</p>

<h3>A working <code>/metrics</code> in fifteen lines</h3>
<pre><code>import client from 'prom-client';

const reg = new client.Registry();
client.collectDefaultMetrics({ register: reg });   // CPU, RAM, event loop, GC

const httpTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Tổng số request',
  labelNames: ['method', 'route', 'status'],
  registers: [reg],
});
const httpDur = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Thời gian xử lý',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [reg],
});

app.use((req, res, next) =&gt; {
  const end = httpDur.startTimer();
  res.on('finish', () =&gt; {
    const route = req.route ? req.baseUrl + req.route.path : 'unknown';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpTotal.inc(labels);
    end(labels);
  });
  next();
});

app.get('/metrics', async (req, res) =&gt; {
  res.set('Content-Type', reg.contentType);
  res.end(await reg.metrics());
});</code></pre>

<p>The single most important line is <code>req.baseUrl + req.route.path</code>. That yields <code>/notes/:id</code> — the <strong>route template</strong> — not <code>/notes/1842</code>. Keep reading; the rest of this lesson is about what happens when you get that line wrong.</p>

<h3>Reading what comes out</h3>
<p>A histogram is not a magic percentile machine. It is a set of counters, one per bucket, each counting "how many observations were at most this long":</p>

<pre><code>http_request_duration_seconds_bucket{le="0.005",route="/notes/:id"} 118
http_request_duration_seconds_bucket{le="0.01",route="/notes/:id"}  291
http_request_duration_seconds_bucket{le="0.025",route="/notes/:id"} 299
http_request_duration_seconds_bucket{le="+Inf",route="/notes/:id"}  300
http_request_duration_seconds_sum{route="/notes/:id"}    2.184
http_request_duration_seconds_count{route="/notes/:id"}  300</code></pre>

<p>The percentile is computed <em>afterwards</em>, by interpolating between buckets, which has two consequences people trip over. <strong>The result is only as precise as your bucket edges</strong> — with the buckets above, any p95 that lands between 10ms and 25ms is a guess. And <strong>because buckets are plain counters, they add up across containers</strong>: three replicas' histograms sum into one correct global p95. A Summary cannot do that, which is the whole reason to avoid it.</p>

<div class="callout">
<p><strong>Choosing bucket edges.</strong> Put the boundaries around the values you will make decisions at. If your SLO is "95% under 300ms" then you need an edge at exactly 0.3, or you cannot measure your own SLO. The defaults in <code>prom-client</code> are a generic web-shaped guess; they are a fine starting point and a poor finishing one.</p>
</div>

<h3>The RED method: three metrics that cover most of it</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Rate</span><span class="lz-d"><code>rate(http_requests_total[5m])</code> — how many requests per second. A sudden drop means something upstream is blocking</span></div>
  <div class="lz-node"><span class="lz-t">Errors</span><span class="lz-d"><code>rate(http_requests_total{status=~"5.."}[5m])</code> — the failure rate. This is the metric most worth alerting on</span></div>
  <div class="lz-node"><span class="lz-t">Duration</span><span class="lz-d"><code>histogram_quantile(0.95, ...)</code> — how slow. A gradual rise is often the earliest sign of an incident about to happen</span></div>
</div>

<p>Three metrics, one middleware, and you can answer "is the API healthy right now" for every route without knowing anything about what the routes do. Everything past this point is refinement.</p>

<h3>Now the expensive mistake</h3>
<p>Everything above rests on one assumption: <strong>label values come from a small, fixed set</strong>. Prometheus stores one independent time series for every distinct combination of label values. Four methods × twenty routes × six statuses = 480 series, forever, regardless of traffic. That is the deal that makes metrics cheap.</p>

<p>Break the assumption and watch. Same app, 300 requests to <code>/notes/1</code> through <code>/notes/300</code>, three labelling strategies:</p>

<div class="out">cách gắn nhãn                    tổng số chuỗi   http_requests_total   /metrics
route mẫu (/notes/:id)                127 chuỗi         1 chuỗi           9.780B
URL thô (/notes/1, /notes/2, …)      4.313 chuỗi       300 chuỗi         391.460B
thêm nhãn user_id                      426 chuỗi       300 chuỗi          34.501B</div>

<p>Three hundred requests turned 9,7KB of metrics into 391KB — <strong>40× — and the traffic did not increase at all</strong>. Only the number of distinct label values did. The histogram is the amplifier: every new label value creates twelve bucket series plus a sum and a count, so one careless id multiplies by fourteen.</p>

<h3>How bad does it get?</h3>
<p>Three hundred is nothing. A real site has users. Same counter and histogram, labelled by user id, at three scales:</p>

<div class="out">số user khác nhau   RSS tiến trình   /metrics    thời gian sinh   số chuỗi
1.000               51 → 74MB         0,72MB          23ms          14.000
10.000              76 → 171MB        7,32MB         144ms         140.000
100.000            178 → 939MB       74,52MB       1.381ms       1.400.000</div>

<div class="danger">
<p><strong>Read the bottom row as an incident report.</strong> The process is holding <strong>939MB</strong> of metrics — on a 6GB VPS that is one sixth of the machine, and it never shrinks, because Prometheus series are never garbage-collected while the process lives. Prometheus scrapes every 15 seconds; each scrape takes <strong>1,4 seconds of blocked event loop</strong> and transfers <strong>74,5MB</strong>. That is 4,9MB/s of scrape traffic and roughly 9% of your CPU spent describing yourself instead of serving anyone. Then the scrape times out, Prometheus marks the target down, and you get paged for an outage that your monitoring caused.</p>
</div>

<p>The rule that prevents all of it, stated so it is hard to get wrong: <strong>a label value must come from a set you could write down on paper.</strong> Method, route template, status code, environment, region — all writable. User id, request id, email, note id, session id, raw URL, SQL string, error message — all unbounded, all forbidden.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the dangerous version is not <code>user_id</code> — that one is obviously wrong and gets caught in review. It is <code>error_message</code> as a label, which looks bounded because you "only have a few kinds of error", right up until one of them interpolates a value: <code>"note 8412 not found"</code>. Now you have one series per note id, created by an error path that only fires occasionally, so it grows slowly and is discovered months later during an out-of-memory incident.</p>
</div>

<h3>Where the unbounded things belong</h3>
<p>None of the forbidden values are useless — they are essential. They just belong in a different pillar:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">How many, and how fast?</span><span class="lz-d">METRIC — bounded labels, fixed price, kept for months</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Which one is slow, and where?</span><span class="lz-d">TRACE — carries the request id and user id, sampled to keep the price bearable</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">What happened to THIS user?</span><span class="lz-d">LOG — arbitrary fields, searched by grep, kept briefly</span></div>
</div>

<p>"Which users hit the error?" is a log question. "How many users hit the error?" is a metric question. They sound like the same question and they have wildly different prices.</p>

<h3>What <code>collectDefaultMetrics</code> gives you for free</h3>
<p>One line, and you get the numbers that explain most Node incidents without any application code:</p>

<div class="kv-grid">
  <div class="kv"><span>nodejs_eventloop_lag_p99_seconds</span><b>The single most important Node metric there is. Rising means something is BLOCKING (chapter 2)</b></div>
  <div class="kv"><span>nodejs_heap_size_used_bytes</span><b>A memory leak becomes visible hours before the OOM killer takes the container</b></div>
  <div class="kv"><span>nodejs_gc_duration_seconds</span><b>Explains the latency spikes the code cannot account for</b></div>
  <div class="kv"><span>process_cpu_seconds_total</span><b>CPU-bound or I/O-bound — answered by a single graph</b></div>
  <div class="kv"><span>nodejs_active_handles_total</span><b>Sockets and timers never closed. A steady rise means a resource leak</b></div>
</div>

<p>Event loop lag deserves a dashboard of its own. It is the metric that turns chapter 2's abstract "do not block the loop" into something you can alert on: when p99 lag crosses 100ms, some request somewhere is doing synchronous work, and every other request on that process is paying for it.</p>

<h3>Protecting the endpoint</h3>
<p><code>/metrics</code> describes your internals: route names, error rates, memory, sometimes version strings. It should not be on the public internet. Three options, in order of preference: bind the metrics server to a second port that only the private network can reach; or keep it on the main app and block <code>/metrics</code> at nginx for non-internal IPs; or require a bearer token. <strong>Do not skip this because "there is nothing sensitive in it"</strong> — route names alone map your entire attack surface.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Honest answer: this site has <strong>no <code>/metrics</code> endpoint at all</strong> — <code>curl</code> returns 404 for every plausible path. There is no Prometheus, no Grafana, no continuous view of rate/errors/duration; incidents are noticed by a person and diagnosed from <code>docker logs</code>. What it does have is Sentry, which covers the "errors" third of RED and nothing else. And one detail worth stealing: a middleware tags each request with its route template before reporting to Sentry, precisely so Sentry transactions do not explode into one entry per dynamic id — <strong>the same cardinality discipline this lesson measured, applied to a different tool</strong>. Adding <code>prom-client</code> is the single highest-value observability upgrade this codebase could make.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-990"><span class="lc-t">Code Lab · Metrics &amp; Dashboards</span><span class="lc-d">Counters, gauges, histograms and what to plot</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-618"><span class="lc-t">Code Lab · Advanced Observability and Distributed Tracing</span><span class="lc-d">Instrumenting a Node backend end to end</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Metric, và cái nhãn ngốn 939MB</h2>
<p class="lead">Log trả lời câu hỏi về một request. Metric trả lời câu hỏi về tất cả chúng cùng lúc, với một cái giá <em>không tăng theo lưu lượng</em> — một bộ đếm được cộng mười triệu lần chiếm đúng tám byte như bộ đếm được cộng hai lần. Chính tính chất ấy khiến metric là cách duy nhất kham nổi để theo dõi hệ thống liên tục. Và nó cũng, như bài này chứng minh bằng một phép đo 939MB, cực kỳ dễ phá hỏng do vô ý.</p>

<h3>Bốn loại công cụ đo</h3>
<p>Prometheus — chuẩn thực tế của ngành, và là thứ <code>prom-client</code> cài đặt — có bốn loại:</p>

<div class="kv-grid">
  <div class="kv"><span>Counter</span><b>Chỉ tăng, không giảm. Tổng request, tổng lỗi, tổng byte gửi đi. Hỏi "tốc độ" bằng <code>rate()</code></b></div>
  <div class="kv"><span>Gauge</span><b>Lên xuống tự do. Số kết nối đang mở, chiều dài hàng đợi, RAM đang dùng</b></div>
  <div class="kv"><span>Histogram</span><b>Đếm số quan sát rơi vào các khoảng định sẵn. Đây là thứ cho ra p50/p95/p99</b></div>
  <div class="kv"><span>Summary</span><b>Tính phân vị NGAY TRONG tiến trình. Đừng dùng: không cộng gộp được giữa nhiều container</b></div>
</div>

<p>Phân biệt Counter với Gauge quan trọng hơn vẻ ngoài của nó. Counter không bao giờ reset trừ khi tiến trình khởi động lại, và Prometheus phát hiện được lần reset ấy rồi tự hiệu chỉnh. Còn một gauge mà bạn tự tay tăng rồi tự tay giảm sẽ lệch khỏi sự thật ngay lần đầu một nhánh lỗi bỏ qua bước giảm — và lệch trong im lặng, mãi mãi, vì không có gì tính lại nó.</p>

<h3>Một <code>/metrics</code> chạy được trong mười lăm dòng</h3>
<pre><code>import client from 'prom-client';

const reg = new client.Registry();
client.collectDefaultMetrics({ register: reg });   // CPU, RAM, event loop, GC

const httpTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Tổng số request',
  labelNames: ['method', 'route', 'status'],
  registers: [reg],
});
const httpDur = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Thời gian xử lý',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [reg],
});

app.use((req, res, next) =&gt; {
  const end = httpDur.startTimer();
  res.on('finish', () =&gt; {
    const route = req.route ? req.baseUrl + req.route.path : 'unknown';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpTotal.inc(labels);
    end(labels);
  });
  next();
});

app.get('/metrics', async (req, res) =&gt; {
  res.set('Content-Type', reg.contentType);
  res.end(await reg.metrics());
});</code></pre>

<p>Dòng quan trọng nhất là <code>req.baseUrl + req.route.path</code>. Nó cho ra <code>/notes/:id</code> — <strong>mẫu route</strong> — chứ không phải <code>/notes/1842</code>. Đọc tiếp đi; phần còn lại của bài này nói về chuyện gì xảy ra khi bạn viết sai đúng dòng đó.</p>

<h3>Đọc thứ chui ra</h3>
<p>Histogram không phải cỗ máy phân vị thần kỳ. Nó là một tập bộ đếm, mỗi khoảng một cái, mỗi cái đếm "có bao nhiêu quan sát dài tối đa bằng chừng này":</p>

<pre><code>http_request_duration_seconds_bucket{le="0.005",route="/notes/:id"} 118
http_request_duration_seconds_bucket{le="0.01",route="/notes/:id"}  291
http_request_duration_seconds_bucket{le="0.025",route="/notes/:id"} 299
http_request_duration_seconds_bucket{le="+Inf",route="/notes/:id"}  300
http_request_duration_seconds_sum{route="/notes/:id"}    2.184
http_request_duration_seconds_count{route="/notes/:id"}  300</code></pre>

<p>Phân vị được tính <em>về sau</em>, bằng cách nội suy giữa các khoảng, và điều đó kéo theo hai hệ quả người ta hay vấp. <strong>Kết quả chỉ chính xác tới mức các mốc khoảng của bạn cho phép</strong> — với bộ khoảng ở trên, mọi giá trị p95 rơi vào giữa 10ms và 25ms đều là phỏng đoán. Và <strong>vì các khoảng chỉ là bộ đếm thường nên chúng cộng được qua nhiều container</strong>: histogram của ba bản sao cộng lại thành đúng một p95 toàn cục. Summary <em>không</em> làm được như vậy, và đó là toàn bộ lý do để tránh nó.</p>

<div class="callout">
<p><strong>Chọn mốc khoảng.</strong> Hãy đặt các mốc quanh những giá trị mà bạn sẽ dựa vào để ra quyết định. Nếu cam kết của bạn là "95% dưới 300ms" thì bạn cần một mốc đúng ở 0.3, nếu không thì bạn không đo được chính cam kết của mình. Bộ mặc định của <code>prom-client</code> là một phỏng đoán chung cho web; đó là điểm khởi đầu tốt và điểm kết thúc tồi.</p>
</div>

<h3>Phương pháp RED: ba chỉ số phủ được phần lớn</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Rate (tốc độ)</span><span class="lz-d"><code>rate(http_requests_total[5m])</code> — bao nhiêu request mỗi giây. Tụt đột ngột = có thứ ở phía trước đang chặn</span></div>
  <div class="lz-node"><span class="lz-t">Errors (lỗi)</span><span class="lz-d"><code>rate(http_requests_total{status=~"5.."}[5m])</code> — tỉ lệ hỏng. Đây là chỉ số đáng cảnh báo nhất</span></div>
  <div class="lz-node"><span class="lz-t">Duration (thời lượng)</span><span class="lz-d"><code>histogram_quantile(0.95, ...)</code> — chậm tới mức nào. Tăng dần thường là dấu hiệu sớm của một sự cố sắp tới</span></div>
</div>

<p>Ba chỉ số, một middleware, và bạn trả lời được câu "API có khoẻ không, ngay lúc này" cho mọi route mà không cần biết các route ấy làm gì. Mọi thứ sau điểm này chỉ là tinh chỉnh.</p>

<h3>Giờ tới cái sai đắt tiền</h3>
<p>Mọi thứ ở trên dựa trên một giả định: <strong>giá trị nhãn đến từ một tập hợp nhỏ và cố định</strong>. Prometheus lưu một chuỗi thời gian độc lập cho <em>mỗi tổ hợp giá trị nhãn khác nhau</em>. Bốn method × hai mươi route × sáu mã trạng thái = 480 chuỗi, mãi mãi, bất kể lưu lượng bao nhiêu. Đó là thoả thuận làm cho metric rẻ.</p>

<p>Phá vỡ giả định ấy rồi nhìn. Vẫn app đó, 300 request tới <code>/notes/1</code> đến <code>/notes/300</code>, ba cách gắn nhãn:</p>

<div class="out">cách gắn nhãn                    tổng số chuỗi   http_requests_total   /metrics
route mẫu (/notes/:id)                127 chuỗi         1 chuỗi           9.780B
URL thô (/notes/1, /notes/2, …)      4.313 chuỗi       300 chuỗi         391.460B
thêm nhãn user_id                      426 chuỗi       300 chuỗi          34.501B</div>

<p>Ba trăm request biến 9,7KB metric thành 391KB — <strong>gấp 40 lần — và lưu lượng không hề tăng</strong>. Chỉ có số giá trị nhãn khác nhau là tăng. Histogram là bộ khuếch đại: mỗi giá trị nhãn mới sinh ra mười hai chuỗi khoảng cộng thêm một sum và một count, nên một cái id cẩu thả nhân lên gấp mười bốn.</p>

<h3>Tệ tới mức nào?</h3>
<p>Ba trăm chưa là gì. Một site thật thì có người dùng. Vẫn counter và histogram ấy, gắn nhãn theo user id, ở ba quy mô:</p>

<div class="out">số user khác nhau   RSS tiến trình   /metrics    thời gian sinh   số chuỗi
1.000               51 → 74MB         0,72MB          23ms          14.000
10.000              76 → 171MB        7,32MB         144ms         140.000
100.000            178 → 939MB       74,52MB       1.381ms       1.400.000</div>

<div class="danger">
<p><strong>Hãy đọc dòng cuối như một bản báo cáo sự cố.</strong> Tiến trình đang giữ <strong>939MB</strong> metric — trên một VPS 6GB thì đó là một phần sáu cả cái máy, và nó không bao giờ co lại, vì chuỗi Prometheus không hề được dọn rác chừng nào tiến trình còn sống. Prometheus quét mỗi 15 giây; mỗi lần quét ngốn <strong>1,4 giây event loop bị chặn</strong> và truyền <strong>74,5MB</strong>. Tức là 4,9MB/giây lưu lượng quét và khoảng 9% CPU của bạn dành cho việc mô tả chính mình thay vì phục vụ ai đó. Rồi lần quét bị hết giờ, Prometheus đánh dấu mục tiêu là chết, và bạn bị gọi dậy vì một sự cố do chính hệ giám sát gây ra.</p>
</div>

<p>Quy tắc ngăn được toàn bộ chuyện đó, phát biểu sao cho khó làm sai: <strong>giá trị nhãn phải đến từ một tập hợp mà bạn viết ra giấy được.</strong> Method, mẫu route, mã trạng thái, môi trường, khu vực — đều viết ra giấy được. User id, mã request, email, id ghi chú, id phiên, URL thô, chuỗi SQL, thông điệp lỗi — đều vô hạn, đều bị cấm.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> phiên bản nguy hiểm không phải <code>user_id</code> — cái đó sai lộ liễu và sẽ bị bắt lúc review. Nguy hiểm là <code>error_message</code> làm nhãn, thứ <em>trông có vẻ</em> hữu hạn vì "chỉ có vài loại lỗi thôi mà", cho tới khi một trong số đó nội suy một giá trị vào: <code>"note 8412 not found"</code>. Giờ bạn có một chuỗi cho mỗi id ghi chú, sinh ra bởi một nhánh lỗi chỉ thỉnh thoảng chạy, nên nó phình chậm rãi và được phát hiện vài tháng sau trong một sự cố hết bộ nhớ.</p>
</div>

<h3>Chỗ đúng cho những thứ vô hạn</h3>
<p>Không giá trị nào trong danh sách cấm là vô dụng — chúng thiết yếu. Chỉ là chúng thuộc về một trụ cột khác:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Có bao nhiêu, nhanh chậm ra sao?</span><span class="lz-d">METRIC — nhãn giới hạn, giá cố định, giữ nhiều tháng</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Cái nào chậm, chậm ở đâu?</span><span class="lz-d">TRACE — có mã request, có user id, lấy mẫu để chịu nổi giá</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Chuyện gì đã xảy ra với người dùng NÀY?</span><span class="lz-d">LOG — mọi trường tuỳ ý, tìm bằng grep, giữ ngắn hạn</span></div>
</div>

<p>"Những người dùng nào dính lỗi?" là câu hỏi của log. "Bao nhiêu người dùng dính lỗi?" là câu hỏi của metric. Chúng nghe giống hệt nhau và có giá chênh nhau một trời một vực.</p>

<h3><code>collectDefaultMetrics</code> cho bạn cái gì miễn phí</h3>
<p>Một dòng, và bạn có những con số giải thích được phần lớn sự cố của Node mà không cần viết một dòng code ứng dụng nào:</p>

<div class="kv-grid">
  <div class="kv"><span>nodejs_eventloop_lag_p99_seconds</span><b>Chỉ số Node quan trọng nhất từng tồn tại. Tăng = có thứ đang CHẶN (chương 2)</b></div>
  <div class="kv"><span>nodejs_heap_size_used_bytes</span><b>Rò bộ nhớ nhìn thấy được nhiều giờ trước khi container bị OOM giết</b></div>
  <div class="kv"><span>nodejs_gc_duration_seconds</span><b>Giải thích những đỉnh trễ mà code không giải thích nổi</b></div>
  <div class="kv"><span>process_cpu_seconds_total</span><b>Đang nghẽn ở CPU hay ở I/O — trả lời được bằng một biểu đồ</b></div>
  <div class="kv"><span>nodejs_active_handles_total</span><b>Socket/timer không được đóng. Tăng đều = rò tài nguyên</b></div>
</div>

<p>Độ trễ event loop xứng đáng có một bảng điều khiển riêng. Đó là chỉ số biến câu "đừng chặn event loop" trừu tượng của chương 2 thành thứ bạn cảnh báo được: khi p99 của độ trễ vượt 100ms, có một request nào đó đang làm việc đồng bộ, và mọi request khác trên tiến trình ấy đang trả giá thay nó.</p>

<h3>Bảo vệ cái endpoint đó</h3>
<p><code>/metrics</code> mô tả nội tạng của bạn: tên route, tỉ lệ lỗi, bộ nhớ, đôi khi cả chuỗi phiên bản. Nó không nên nằm trên Internet công cộng. Ba lựa chọn, xếp theo mức độ ưa dùng: cho máy chủ metric nghe ở một cổng thứ hai mà chỉ mạng nội bộ với tới được; hoặc để chung app rồi chặn <code>/metrics</code> ở nginx với IP không nội bộ; hoặc bắt buộc bearer token. <strong>Đừng bỏ qua bước này với lý do "có gì nhạy cảm đâu"</strong> — chỉ riêng danh sách tên route đã vẽ ra toàn bộ bề mặt tấn công của bạn.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Câu trả lời trung thực: site này <strong>hoàn toàn không có endpoint <code>/metrics</code></strong> — <code>curl</code> trả 404 cho mọi đường dẫn hợp lý. Không có Prometheus, không Grafana, không có cái nhìn liên tục về tốc độ/lỗi/thời lượng; sự cố được phát hiện bởi một con người và chẩn đoán từ <code>docker logs</code>. Cái nó <em>có</em> là Sentry, thứ phủ được một phần ba "lỗi" của RED và không gì khác. Và một chi tiết đáng ăn cắp: một middleware gắn cho mỗi request mẫu route của nó <em>trước khi</em> báo sang Sentry, chính là để transaction của Sentry không nổ thành một mục cho mỗi id động — <strong>đúng cái kỷ luật cardinality mà bài này vừa đo, áp vào một công cụ khác</strong>. Thêm <code>prom-client</code> là nâng cấp quan sát có giá trị cao nhất mà codebase này có thể làm.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-990"><span class="lc-t">Code Lab · Metrics &amp; Dashboards</span><span class="lc-d">Counter, gauge, histogram và nên vẽ biểu đồ gì</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-618"><span class="lc-t">Code Lab · Advanced Observability and Distributed Tracing</span><span class="lc-d">Gắn đo đạc cho một backend Node từ đầu tới cuối</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: '15.5 — Tracing: where the time actually went|||15.5 — Trace: thời gian thật sự đi đâu',
      slug: 'nodejs-15-5-opentelemetry-trace',
      type: 'VIDEO',
      description: 'Bật OpenTelemetry, để nó tự vá Express và pg, rồi nhìn một cây span phơi bày lỗi N+1 mà không dòng log nào tố cáo — kèm hoá đơn thật: -40% throughput và một phát hiện phản trực giác về lấy mẫu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.5</span>
<h2>Tracing: where the time actually went</h2>
<p class="lead">A metric says the p95 is 400ms. A log says request <code>abc123</code> took 8241ms. Neither tells you <em>which part</em> of those milliseconds was spent where — and without that, optimising is guesswork with a profiler-shaped hole in it. A trace is the missing answer: a tree of timed intervals, one per unit of work, reconstructed for a single request across every function and every service it touched.</p>

<h3>The vocabulary, which is small</h3>
<div class="kv-grid">
  <div class="kv"><span>Span</span><b>A named interval of time: "pg query", "external API call", "route handling". It has a start, an end and attributes</b></div>
  <div class="kv"><span>Trace</span><b>The entire span tree of ONE request. Held together by a shared <code>trace_id</code> </b></div>
  <div class="kv"><span>Parent / child</span><b>A child span nested in a parent. This is what makes it a tree rather than a flat list</b></div>
  <div class="kv"><span>Context propagation</span><b>Carries the <code>trace_id</code> into another process through a header <code>traceparent</code>. The same mechanism as AsyncLocalStorage in lesson 15.2</b></div>
  <div class="kv"><span>Sampler</span><b>Decides which traces get RECORDED. Full tracing is expensive; this is the price lever</b></div>
</div>

<p>OpenTelemetry is the vendor-neutral standard that implements all of this. It matters because it means the instrumentation you write is not tied to a monitoring vendor: the same code exports to Jaeger, Tempo, Datadog, Honeycomb or a file.</p>

<h3>Turning it on</h3>
<p>The remarkable part is how little application code changes. Auto-instrumentation monkey-patches the libraries you already use — <code>http</code>, <code>express</code>, <code>pg</code>, <code>ioredis</code>, and about forty more:</p>

<pre><code>// PHẢI nạp TRƯỚC mọi import khác, nếu không việc vá thư viện không kịp
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({ 'service.name': 'notes-api' }),
  spanProcessor: new BatchSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': { enabled: false },   // quá ồn
  })],
});
sdk.start();

// app may only be imported AFTER this line
const { default: express } = await import('express');</code></pre>

<div class="pitfall">
<p><strong>A real trap, and a silent one.</strong> If the SDK starts after <code>express</code> or <code>pg</code> is imported, there is nothing left to patch — those modules are already bound. You get no error, no warning, just an empty trace tree, and you conclude tracing "does not work". Either use a top-level <code>await import()</code> as above, or start the SDK from a separate file loaded with <code>node --import ./tracing.mjs app.js</code>.</p>
</div>

<h3>What one request looks like</h3>
<p>One <code>GET /notes/:author</code> against the app from chapter 7 — a route that fetches a user, fetches their notes, and then (deliberately) loops over the results issuing one query each. Real output, 32 spans, trimmed for width:</p>

<div class="out">CÂY SPAN (32 span, traceId=e2546d5ffcd5d414da90bd88b164272e)

GET                                   60,19ms
  └─ GET                              48,83ms
    └─ request handler - /notes/:author  47,82ms
      └─ service.listNotes             44,33ms
        └─ pg-pool.connect             27,31ms
          └─ pg.connect                26,33ms
            └─ dns.lookup               2,51ms
            └─ tcp.connect              6,51ms
        └─ pg.query:SELECT obsdemo      2,53ms
        └─ pg.query:SELECT obsdemo      1,60ms
        └─ pg.query:SELECT obsdemo      1,28ms
        └─ pg.query:SELECT obsdemo      0,75ms
        └─ pg.query:SELECT obsdemo      0,60ms
        └─ pg.query:SELECT obsdemo      0,40ms
        └─ pg.query:SELECT obsdemo      0,56ms
        └─ pg.query:SELECT obsdemo      0,82ms
        └─ pg.query:SELECT obsdemo      0,78ms
        └─ pg.query:SELECT obsdemo      2,15ms
        └─ pg.query:SELECT obsdemo      0,57ms
        └─ pg.query:SELECT obsdemo      0,73ms</div>

<p>Twelve <code>pg.query</code> spans under one request. Nobody wrote a line of code to detect that; the shape of the tree <em>is</em> the diagnosis. This is chapter 7's N+1 problem, and note how differently it presents here: no individual query is slow — the worst is 2,53ms — so a "slow query log" with a 100ms threshold would report absolutely nothing. The problem is the <em>count</em>, and count is a shape you see in a tree and cannot see in a list.</p>

<p>The second thing the tree gives away is the 27,31ms <code>pg-pool.connect</code> at the top, containing a DNS lookup and a TCP handshake. That is chapter 7's cold-pool tax, visible as a distinct block instead of being smeared across the total. On the next request it disappears — and you can prove it, rather than assuming it.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">A metric alerts</span><span class="lz-d">/feed's p95 rose from 120ms to 900ms at 14:05</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Open the slow traces in that window</span><span class="lz-d">filter by route plus duration &gt; 500ms and take a handful</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Look at the tree's shape</span><span class="lz-d">one long span? or twenty short ones? Two completely different diseases</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Take the trace_id → grep the logs</span><span class="lz-d">read that exact request's log lines to learn what the PARAMETERS were</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Fix it, then confirm with the very metric from step 1</span><span class="lz-d">a closed loop; if p95 does not fall, you fixed the wrong thing</span></div>
</div>

<h3>Connecting logs to traces</h3>
<p>Step 4 of that loop only works if a log line can name its trace. pino has a <code>mixin</code> hook that runs on every line — read the active span from OpenTelemetry's context and attach its ids:</p>

<pre><code>const logger = pino({
  mixin() {
    const span = trace.getSpan(context.active());
    if (!span) return {};
    const c = span.spanContext();
    return { trace_id: c.traceId, span_id: c.spanId };
  },
});</code></pre>

<div class="out">=== dòng log ===
bắt đầu xử lý     trace_id=613716f833b32270… span_id=7dcf54e268d86304
phải xuống DB     trace_id=613716f833b32270… span_id=7dcf54e268d86304

=== span cùng trace ===
GET                        trace_id=613716f833b32270… span_id=9bcd68fd9731e392
request handler - /notes   trace_id=613716f833b32270… span_id=7dcf54e268d86304
GET                        trace_id=613716f833b32270… span_id=7792d5906ade2a2b</div>

<p>The log lines carry <code>span_id=7dcf54e2…</code>, which is exactly the <code>request handler - /notes</code> span. You can now jump from a log line to the trace it belongs to, and from any span in that trace back to every log line it produced. That bidirectional link is the single highest-value thing in this chapter, and it costs six lines.</p>

<h3>Now the bill</h3>
<p>Tracing is by far the most expensive pillar, and the honest numbers are not small. Same Express + pg app, one route, one query, <code>autocannon -c 20 -d 6</code>:</p>

<div class="out">cấu hình          req/giây   p50   p97.5   max     RSS
không OpenTelemetry  7.017    2ms    5ms   80ms   126MB
có OpenTelemetry     4.235    4ms    9ms   77ms   188MB</div>

<p><strong>A 39,6% throughput loss, p50 doubled, and 62MB of extra resident memory.</strong> Plus the install: <code>node_modules</code> went from 17MB to 89MB — <strong>+72MB across 80 <code>@opentelemetry/*</code> packages</strong>, in a project whose entire declared dependency list is eight entries. That is a real cost in Docker image size, cold-start time and supply-chain surface (chapter 4).</p>

<p>The obvious mitigation is sampling: only record a fraction of traces. Measure whether it works.</p>

<div class="out">cấu hình          req/giây   p50   p97.5   span xuất ra   RSS
không có SDK         7.243    2ms    5ms          0        124MB
sampler = 1,0        4.744    3ms    8ms    113.664        184MB
sampler = 0,1        4.960    3ms    7ms     11.264        187MB
sampler = 0,01       4.916    3ms    7ms      1.024        187MB</div>

<div class="danger">
<p><strong>Read those two columns against each other.</strong> Sampling cut exported spans by <strong>111× (113.664 → 1.024)</strong> and improved throughput by <strong>3,6%</strong>. Memory did not drop at all. <strong>Sampling saves your bandwidth and your monitoring bill. It does not save your CPU.</strong> The reason is structural: the instrumentation still patches every library call, still creates and propagates context on every request, still checks the sampler. Only the recording and exporting are skipped, and those were never the expensive part.</p>
</div>

<p>So sampling is the right lever for cost and the wrong lever for latency. If tracing overhead is hurting your p95, the answers are: instrument fewer libraries (disable <code>fs</code>, disable <code>dns</code>, keep <code>http</code> and your database), or run tracing on a subset of your fleet, or accept the 40% because knowing where the time goes is worth more than 40% of one machine. That last option is more often correct than people expect.</p>

<div class="callout warn">
<p><strong>Use <code>ParentBasedSampler</code>, always.</strong> A bare <code>TraceIdRatioBasedSampler</code> at each service samples independently, so a request crossing three services has a 1-in-1000 chance of being fully recorded at 10% each — you get fragments of traces, which are worse than none. <code>ParentBasedSampler</code> makes the decision once at the entry point and every downstream service honours it, so a sampled trace is complete end to end.</p>
</div>

<h3>Manual spans: where auto-instrumentation stops</h3>
<p>Auto-instrumentation traces I/O. It cannot see your business logic, because it does not know which of your function calls are meaningful. Add spans by hand only where a name would help a future incident:</p>

<pre><code>const span = tracer.startSpan('service.listNotes');
const out = await context.with(trace.setSpan(context.active(), span), async () =&gt; {
  const notes = await repo.find(authorId);
  span.setAttribute('notes.count', notes.length);      // ← thuộc tính, KHÔNG phải nhãn
  return notes;
});
span.end();</code></pre>

<p>Note the crucial difference from lesson 15.4: <strong>span attributes have no cardinality limit.</strong> <code>notes.count</code>, <code>user.id</code>, <code>request.id</code> are all fine here — a span is stored once and thrown away, it does not create a permanent time series. This is exactly why the forbidden metric labels belong on traces instead. Do not, however, put secrets there; a trace backend is no more designed to hold a bearer token than a log store is.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the <code>context.with(...)</code> wrapper is not optional decoration. <code>tracer.startSpan()</code> alone creates a span that is <em>not</em> active, so every child span created inside — including auto-instrumented <code>pg</code> queries — attaches to the wrong parent or to nothing. The tree comes out flat and you cannot see the nesting that was the entire point.</p>
</div>

<h3>What to instrument first, if you only do one thing</h3>
<div class="kv-grid">
  <div class="kv"><span>Inbound HTTP</span><b>Free through auto-instrumentation. This is the root of every trace tree</b></div>
  <div class="kv"><span>DB queries</span><b>Where most of the time actually lives. This is where N+1 exposes itself</b></div>
  <div class="kv"><span>Outbound HTTP calls</span><b>Third-party APIs are the number-one source of latency you do not control</b></div>
  <div class="kv"><span>Cache Redis</span><b>Cache hits and misses become visible on the tree instead of being inferred</b></div>
  <div class="kv"><span>Background jobs</span><b>Links the trace_id from the request that enqueued the job (chapter 13) to the moment the job runs</b></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> There is no OpenTelemetry here either — but Sentry's performance monitoring is a partial substitute: it records transactions with a span tree for a sampled fraction of requests. It covers the HTTP and database layers, and because a middleware tags transactions with the route template it does not suffer the cardinality problem. What it does not give is the vendor-neutral <code>trace_id</code> in log lines, so the log-to-trace jump described above still requires a human matching timestamps. Given the 39,6% measured overhead, the pragmatic path for a single-container deployment is: keep Sentry, add <code>prom-client</code> first, and reach for full OpenTelemetry when a second service appears — because that is the point at which "where did the time go" stops being answerable any other way.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-988"><span class="lc-t">Code Lab · Performance Monitoring &amp; Tracing</span><span class="lc-d">Spans, context propagation and reading a trace tree</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-618"><span class="lc-t">Code Lab · Advanced Observability and Distributed Tracing</span><span class="lc-d">OpenTelemetry on a real Express + pg service</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.5</span>
<h2>Trace: thời gian thật sự đi đâu</h2>
<p class="lead">Metric nói p95 là 400ms. Log nói request <code>abc123</code> mất 8241ms. Cả hai đều không cho biết <em>phần nào</em> trong đống mili-giây ấy tiêu ở đâu — mà thiếu điều đó thì tối ưu chỉ là đoán mò với một lỗ hổng hình cái profiler. Trace là câu trả lời còn thiếu: một <em>cây</em> các khoảng thời gian, mỗi khoảng là một đơn vị công việc, dựng lại cho đúng một request xuyên qua mọi hàm và mọi dịch vụ nó chạm vào.</p>

<h3>Từ vựng, và nó ngắn</h3>
<div class="kv-grid">
  <div class="kv"><span>Span</span><b>Một khoảng thời gian có tên: "truy vấn pg", "gọi API ngoài", "xử lý route". Có bắt đầu, kết thúc, thuộc tính</b></div>
  <div class="kv"><span>Trace</span><b>Toàn bộ cây span của MỘT request. Gắn với nhau bằng <code>trace_id</code> dùng chung</b></div>
  <div class="kv"><span>Cha / con</span><b>Span con nằm trong span cha. Đây là thứ tạo ra cấu trúc cây thay vì danh sách phẳng</b></div>
  <div class="kv"><span>Truyền ngữ cảnh</span><b>Chuyển <code>trace_id</code> sang tiến trình khác qua header <code>traceparent</code>. Cùng cơ chế với AsyncLocalStorage ở bài 15.2</b></div>
  <div class="kv"><span>Sampler</span><b>Quyết định trace nào được GHI LẠI. Trace đầy đủ thì đắt; đây là cần gạt giá tiền</b></div>
</div>

<p>OpenTelemetry là chuẩn trung lập với nhà cung cấp, cài đặt toàn bộ những thứ trên. Nó quan trọng vì nó có nghĩa là đoạn đo đạc bạn viết ra không bị trói vào một hãng giám sát nào: cùng một đoạn code ấy xuất sang được Jaeger, Tempo, Datadog, Honeycomb hoặc một cái file.</p>

<h3>Bật nó lên</h3>
<p>Điều đáng nể là code ứng dụng gần như không đổi. Auto-instrumentation vá nóng các thư viện bạn vốn đang dùng — <code>http</code>, <code>express</code>, <code>pg</code>, <code>ioredis</code>, và khoảng bốn mươi cái nữa:</p>

<pre><code>// PHẢI nạp TRƯỚC mọi import khác, nếu không việc vá thư viện không kịp
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({ 'service.name': 'notes-api' }),
  spanProcessor: new BatchSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': { enabled: false },   // quá ồn
  })],
});
sdk.start();

// chỉ SAU dòng này mới được import app
const { default: express } = await import('express');</code></pre>

<div class="pitfall">
<p><strong>Bẫy thật, và nó im lặng.</strong> Nếu SDK khởi động <em>sau</em> khi <code>express</code> hay <code>pg</code> đã được import thì chẳng còn gì để vá — các module đó đã bị ràng buộc xong. Bạn không nhận được lỗi nào, không cảnh báo nào, chỉ có một cây trace rỗng, rồi bạn kết luận rằng trace "không chạy được". Hoặc dùng <code>await import()</code> ở cấp cao nhất như trên, hoặc khởi động SDK từ một file riêng nạp bằng <code>node --import ./tracing.mjs app.js</code>.</p>
</div>

<h3>Một request trông như thế nào</h3>
<p>Một lệnh <code>GET /notes/:author</code> vào app của chương 7 — route lấy một người dùng, lấy ghi chú của họ, rồi (cố ý) lặp qua kết quả và bắn mỗi dòng một truy vấn. Output thật, 32 span, cắt bớt cho vừa bề ngang:</p>

<div class="out">CÂY SPAN (32 span, traceId=e2546d5ffcd5d414da90bd88b164272e)

GET                                   60,19ms
  └─ GET                              48,83ms
    └─ request handler - /notes/:author  47,82ms
      └─ service.listNotes             44,33ms
        └─ pg-pool.connect             27,31ms
          └─ pg.connect                26,33ms
            └─ dns.lookup               2,51ms
            └─ tcp.connect              6,51ms
        └─ pg.query:SELECT obsdemo      2,53ms
        └─ pg.query:SELECT obsdemo      1,60ms
        └─ pg.query:SELECT obsdemo      1,28ms
        └─ pg.query:SELECT obsdemo      0,75ms
        └─ pg.query:SELECT obsdemo      0,60ms
        └─ pg.query:SELECT obsdemo      0,40ms
        └─ pg.query:SELECT obsdemo      0,56ms
        └─ pg.query:SELECT obsdemo      0,82ms
        └─ pg.query:SELECT obsdemo      0,78ms
        └─ pg.query:SELECT obsdemo      2,15ms
        └─ pg.query:SELECT obsdemo      0,57ms
        └─ pg.query:SELECT obsdemo      0,73ms</div>

<p>Mười hai span <code>pg.query</code> dưới một request. Không ai viết một dòng code nào để phát hiện chuyện đó; <em>hình dạng của cái cây chính là chẩn đoán</em>. Đây là lỗi N+1 của chương 7, và hãy để ý nó xuất hiện khác đi thế nào ở đây: <strong>không truy vấn nào chậm cả</strong> — cái tệ nhất là 2,53ms — nên một "slow query log" đặt ngưỡng 100ms sẽ báo cáo chính xác con số không. Vấn đề nằm ở <em>số lượng</em>, mà số lượng là một hình dạng bạn nhìn thấy trong cây và không nhìn thấy trong danh sách.</p>

<p>Thứ hai mà cái cây tố cáo là span <code>pg-pool.connect</code> 27,31ms ở trên đầu, bên trong chứa một lần tra DNS và một lần bắt tay TCP. Đó là thuế "pool nguội" của chương 7, hiện ra thành một khối riêng biệt thay vì bị bôi đều vào tổng thời gian. Ở request tiếp theo nó biến mất — và bạn <em>chứng minh</em> được điều đó thay vì giả định.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Metric kêu</span><span class="lz-d">p95 của /feed tăng từ 120ms lên 900ms lúc 14:05</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Mở trace chậm trong khoảng đó</span><span class="lz-d">lọc theo route + thời lượng &gt; 500ms, lấy vài cái</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Nhìn hình dạng cây</span><span class="lz-d">một span dài? hay hai mươi span ngắn? Hai bệnh hoàn toàn khác nhau</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Lấy trace_id → grep log</span><span class="lz-d">đọc các dòng log của đúng request đó để biết THAM SỐ là gì</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Sửa, rồi xác nhận bằng chính metric ở bước 1</span><span class="lz-d">vòng lặp khép kín; nếu p95 không xuống thì bạn sửa nhầm chỗ</span></div>
</div>

<h3>Nối log với trace</h3>
<p>Bước 4 của vòng lặp đó chỉ chạy được nếu một dòng log gọi được tên trace của nó. pino có hook <code>mixin</code> chạy trên mọi dòng — đọc span đang hoạt động từ ngữ cảnh của OpenTelemetry rồi gắn mã của nó vào:</p>

<pre><code>const logger = pino({
  mixin() {
    const span = trace.getSpan(context.active());
    if (!span) return {};
    const c = span.spanContext();
    return { trace_id: c.traceId, span_id: c.spanId };
  },
});</code></pre>

<div class="out">=== dòng log ===
bắt đầu xử lý     trace_id=613716f833b32270… span_id=7dcf54e268d86304
phải xuống DB     trace_id=613716f833b32270… span_id=7dcf54e268d86304

=== span cùng trace ===
GET                        trace_id=613716f833b32270… span_id=9bcd68fd9731e392
request handler - /notes   trace_id=613716f833b32270… span_id=7dcf54e268d86304
GET                        trace_id=613716f833b32270… span_id=7792d5906ade2a2b</div>

<p>Hai dòng log mang <code>span_id=7dcf54e2…</code>, đúng là span <code>request handler - /notes</code>. Giờ bạn nhảy được từ một dòng log sang trace chứa nó, và từ bất kỳ span nào trong trace ấy quay ngược về mọi dòng log nó sinh ra. Liên kết hai chiều đó là thứ giá trị nhất trong cả chương này, và nó tốn sáu dòng code.</p>

<h3>Giờ tới hoá đơn</h3>
<p>Trace là trụ cột đắt nhất, và con số trung thực không hề nhỏ. Vẫn app Express + pg đó, một route, một truy vấn, <code>autocannon -c 20 -d 6</code>:</p>

<div class="out">cấu hình          req/giây   p50   p97.5   max     RSS
không OpenTelemetry  7.017    2ms    5ms   80ms   126MB
có OpenTelemetry     4.235    4ms    9ms   77ms   188MB</div>

<p><strong>Mất 39,6% throughput, p50 tăng gấp đôi, và tốn thêm 62MB bộ nhớ thường trú.</strong> Cộng thêm phần cài đặt: <code>node_modules</code> đi từ 17MB lên 89MB — <strong>+72MB qua 80 gói <code>@opentelemetry/*</code></strong>, trong một dự án mà toàn bộ danh sách phụ thuộc khai báo chỉ có tám mục. Đó là chi phí thật về kích thước ảnh Docker, thời gian khởi động nguội và bề mặt chuỗi cung ứng (chương 4).</p>

<p>Cách giảm nhẹ hiển nhiên là lấy mẫu: chỉ ghi lại một phần trace. Đo xem có ăn thua không.</p>

<div class="out">cấu hình          req/giây   p50   p97.5   span xuất ra   RSS
không có SDK         7.243    2ms    5ms          0        124MB
sampler = 1,0        4.744    3ms    8ms    113.664        184MB
sampler = 0,1        4.960    3ms    7ms     11.264        187MB
sampler = 0,01       4.916    3ms    7ms      1.024        187MB</div>

<div class="danger">
<p><strong>Đọc hai cột đó đối chiếu nhau.</strong> Lấy mẫu cắt số span xuất ra đi <strong>111 lần (113.664 → 1.024)</strong> và cải thiện throughput được <strong>3,6%</strong>. Bộ nhớ không giảm chút nào. <strong>Lấy mẫu tiết kiệm ĐƯỜNG TRUYỀN và HOÁ ĐƠN giám sát của bạn. Nó KHÔNG tiết kiệm CPU.</strong> Lý do nằm ở cấu trúc: lớp đo đạc vẫn vá mọi lời gọi thư viện, vẫn tạo và truyền ngữ cảnh ở mọi request, vẫn phải hỏi sampler. Chỉ phần ghi lại và xuất đi là được bỏ qua, mà chúng chưa bao giờ là phần đắt.</p>
</div>

<p>Vậy lấy mẫu là cần gạt đúng cho <em>chi phí</em> và là cần gạt sai cho <em>độ trễ</em>. Nếu chi phí trace đang làm đau p95 của bạn thì câu trả lời là: đo đạc ít thư viện lại (tắt <code>fs</code>, tắt <code>dns</code>, giữ <code>http</code> và cơ sở dữ liệu), hoặc chỉ bật trace trên một phần đội máy, hoặc chấp nhận 40% ấy vì biết thời gian đi đâu còn đáng giá hơn 40% của một cái máy. Lựa chọn cuối cùng đúng thường xuyên hơn người ta tưởng.</p>

<div class="callout warn">
<p><strong>Luôn dùng <code>ParentBasedSampler</code>.</strong> Một <code>TraceIdRatioBasedSampler</code> trần ở mỗi dịch vụ sẽ lấy mẫu độc lập, nên một request đi qua ba dịch vụ chỉ có xác suất 1 phần 1000 được ghi trọn vẹn nếu mỗi nơi lấy 10% — bạn nhận được những mảnh trace vụn, thứ còn tệ hơn là không có gì. <code>ParentBasedSampler</code> ra quyết định đúng một lần ở cửa vào và mọi dịch vụ phía sau tôn trọng quyết định ấy, nên một trace đã được lấy mẫu thì hoàn chỉnh từ đầu tới cuối.</p>
</div>

<h3>Span thủ công: nơi auto-instrumentation dừng lại</h3>
<p>Auto-instrumentation theo dõi I/O. Nó không nhìn thấy logic nghiệp vụ của bạn, vì nó không biết lời gọi hàm nào của bạn là có ý nghĩa. Chỉ thêm span bằng tay ở những chỗ mà một cái tên sẽ giúp ích cho một sự cố tương lai:</p>

<pre><code>const span = tracer.startSpan('service.listNotes');
const out = await context.with(trace.setSpan(context.active(), span), async () =&gt; {
  const notes = await repo.find(authorId);
  span.setAttribute('notes.count', notes.length);      // ← thuộc tính, KHÔNG phải nhãn
  return notes;
});
span.end();</code></pre>

<p>Để ý khác biệt cốt tử so với bài 15.4: <strong>thuộc tính của span KHÔNG bị giới hạn cardinality.</strong> <code>notes.count</code>, <code>user.id</code>, <code>request.id</code> đều hoàn toàn hợp lệ ở đây — một span được lưu một lần rồi vứt đi, nó không tạo ra chuỗi thời gian vĩnh viễn nào. Đây chính là lý do những nhãn bị cấm ở metric thì thuộc về trace. Tuy vậy đừng đặt bí mật vào đó; một kho trace cũng không được thiết kế để giữ bearer token hơn gì một kho log.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> cái bọc <code>context.with(...)</code> không phải đồ trang trí tuỳ chọn. Gọi <code>tracer.startSpan()</code> một mình tạo ra một span <em>không</em> ở trạng thái hoạt động, nên mọi span con sinh ra bên trong — kể cả các truy vấn <code>pg</code> do auto-instrumentation tạo — sẽ gắn nhầm cha hoặc không gắn vào đâu cả. Cái cây chui ra phẳng lì và bạn mất đúng cái cấu trúc lồng nhau vốn là toàn bộ mục đích.</p>
</div>

<h3>Nên đo đạc cái gì trước, nếu chỉ làm được một việc</h3>
<div class="kv-grid">
  <div class="kv"><span>HTTP vào</span><b>Miễn phí qua auto-instrumentation. Đây là gốc của mọi cây trace</b></div>
  <div class="kv"><span>Truy vấn DB</span><b>Nơi phần lớn thời gian thật sự nằm. Là chỗ N+1 tự lộ diện</b></div>
  <div class="kv"><span>Gọi HTTP ra ngoài</span><b>API bên thứ ba là nguyên nhân số một của độ trễ mà bạn không kiểm soát</b></div>
  <div class="kv"><span>Cache Redis</span><b>Trúng/trượt cache nhìn thấy được ngay trên cây, không phải suy đoán</b></div>
  <div class="kv"><span>Job nền</span><b>Nối trace_id từ request đẩy job vào hàng đợi (chương 13) sang lúc job chạy</b></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Ở đây cũng không có OpenTelemetry — nhưng phần theo dõi hiệu năng của Sentry là một vật thay thế bán phần: nó ghi lại transaction kèm cây span cho một phần request được lấy mẫu. Nó phủ được tầng HTTP và tầng cơ sở dữ liệu, và vì một middleware gắn mẫu route cho transaction nên nó không dính vấn đề cardinality. Cái nó <em>không</em> cho là <code>trace_id</code> trung lập nằm trong dòng log, nên cú nhảy log-sang-trace mô tả ở trên vẫn phải để một con người đối chiếu dấu thời gian bằng tay. Với chi phí 39,6% đã đo được, con đường thực dụng cho một triển khai một container là: giữ Sentry, thêm <code>prom-client</code> trước, và với tới OpenTelemetry đầy đủ khi có dịch vụ thứ hai xuất hiện — vì đó là thời điểm mà câu "thời gian đi đâu mất" không còn cách nào khác để trả lời.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-988"><span class="lc-t">Code Lab · Performance Monitoring &amp; Tracing</span><span class="lc-d">Span, truyền ngữ cảnh và cách đọc một cây trace</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-618"><span class="lc-t">Code Lab · Advanced Observability and Distributed Tracing</span><span class="lc-d">OpenTelemetry trên một dịch vụ Express + pg thật</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.6 ─────────────────────────── */
    {
      title: '15.6 — Health checks, alerts, and being woken at 3am|||15.6 — Health check, cảnh báo, và chuyện bị gọi dậy lúc 3 giờ sáng',
      slug: 'nodejs-15-6-health-check-canh-bao',
      type: 'VIDEO',
      description: 'Vì sao một health check kiểm tra database có thể tự tay giết chết ứng dụng đang khoẻ mạnh, cách phân biệt liveness với readiness, và quy tắc lọc cảnh báo sao cho người trực còn tin vào điện thoại của mình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.6</span>
<h2>Health checks, alerts, and being woken at 3am</h2>
<p class="lead">The previous three lessons built the ability to answer questions. This one is about the two places that ability meets a machine that will act on it automatically: the health check, which decides whether your container lives or dies, and the alert, which decides whether a human is woken up. Both are easy to write and easy to write in a way that makes outages worse.</p>

<h3>Two different questions that look like one</h3>
<div class="kv-grid">
  <div class="kv"><span>Liveness — "are you alive?"</span><b>Answering NO → the container is KILLED and restarted. It should only ask about the process itself</b></div>
  <div class="kv"><span>Readiness — "can you take work?"</span><b>Answering NO → you are pulled out of the load balancer, NOT killed. It is allowed to check dependencies</b></div>
</div>

<p>Confusing them is the single most expensive mistake in this lesson, so here is the failure in full. Suppose liveness checks the database. The database has a thirty-second hiccup. Every container fails its liveness probe, so the orchestrator kills them all. They restart — with cold connection pools, cold caches, cold JIT — and hammer the recovering database with a reconnect storm, which keeps it down. <strong>A thirty-second database blip has become a fifteen-minute total outage, and the monitoring system did it.</strong></p>

<p>The rule that prevents it: <strong>liveness answers only "is this process capable of responding at all". Nothing else.</strong></p>

<pre><code>// liveness — không chạm vào bất cứ thứ gì bên ngoài
app.get('/health/live', (req, res) =&gt; res.json({ status: 'ok' }));

// readiness — allowed to check dependencies, and MUST have a timeout
app.get('/health/ready', async (req, res) =&gt; {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    res.json({ status: 'ready', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'error' });
  }
});</code></pre>

<h3>The timeout is not optional, measured</h3>
<p>The dangerous database failure is not "down" — a refused connection fails instantly and cleanly. It is <strong>"accepting connections and never answering"</strong>: an overloaded server, a saturated pool, a network path that black-holes packets. Simulate it with a TCP listener that accepts and then goes silent, and measure four endpoints:</p>

<div class="out">/live          -&gt; 200 sau   32ms  {"status":"ok"}
/ready-good    -&gt; 200 sau   33ms  {"status":"ready"}
/ready-timeout -&gt; 503 sau  806ms  {"status":"not ready","e":"Connection terminated due to connection timeout"}
/ready-hang    -&gt; KHÔNG TRẢ LỜI trong 5000ms (probe sẽ coi là CHẾT)</div>

<div class="danger">
<p><strong>The last row is the whole lesson.</strong> The pool configured with <code>connectionTimeoutMillis: 0</code> — which is the <em>default</em> in several clients — never returns. The probe times out. If that probe was liveness, the container is now killed, for a database problem it had no part in and could have partially served around. One configuration line, <code>connectionTimeoutMillis: 800</code>, converts an infinite hang into a clean 503 in 806ms, and a clean 503 is something an orchestrator can handle correctly.</p>
</div>

<p>The corollary for probe configuration: the probe's own timeout must be <em>shorter</em> than the interval at which it runs, or slow probes queue up and you are measuring the queue rather than the app.</p>

<h3>What belongs in each check</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">/health/live</span><span class="lz-d">returns 200 unconditionally. It only fails when the process is wedged solid or dead</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">/health/ready</span><span class="lz-d">DB plus cache, each with a short timeout. Failing means removal from the load balancer, not a kill</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">/health (detailed)</span><span class="lz-d">uptime, version, environment, the status of each dependency. For HUMANS to read, not for probes</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Exclude it from the access log</span><span class="lz-d">a probe every 10 seconds is 8,640 lines a day per container carrying no information</span></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> a readiness check that queries the database on <em>every</em> call is itself load. At a ten-second interval across six containers behind three probes, that is a query every 0,55 seconds, forever, for information that changes rarely. Cache the result for a few seconds. A readiness check that contributes to the overload it is meant to detect is a very expensive kind of irony.</p>
</div>

<h3>Alerts: the number that matters is how many you ignore</h3>
<p>An alert is a promise that a human will do something. Every alert that fires without requiring action devalues every other alert, and the currency is trust — once an on-call engineer has silenced the same false page three times, they will silence the real one too. This is not a discipline problem; it is arithmetic.</p>

<div class="kv-grid">
  <div class="kv"><span>Wake a human</span><b>Users cannot use the product RIGHT NOW and somebody has to fix it IMMEDIATELY</b></div>
  <div class="kv"><span>A ticket, business hours</span><b>Degrading and will become an incident within days: disk at 80%, a certificate with 14 days left</b></div>
  <div class="kv"><span>Dashboard only</span><b>Worth looking at during an investigation, not worth sending anywhere</b></div>
</div>

<p>Four rules that do most of the work:</p>
<p><strong>Alert on symptoms, not causes.</strong> "5xx rate above 2% for 5 minutes" is a symptom — it fires for every cause, including the ones you have not imagined. "CPU above 90%" is a cause, and a bad alert: high CPU with healthy latency is a machine doing its job, and low CPU with 100% errors is an outage your alert missed.</p>
<p><strong>Require duration.</strong> "for 5 minutes" removes the entire class of alerts caused by a single scrape landing during a deploy. Nearly every noisy alert becomes reasonable by adding a <code>for</code> clause.</p>
<p><strong>Use a ratio, not a count.</strong> "50 errors per minute" is catastrophic at 100 requests/minute and invisible at 100.000. Rates survive growth; counts need re-tuning every quarter and never get it.</p>
<p><strong>Every alert needs a runbook link.</strong> At 3am the responder is not you and is not thinking clearly. An alert that says what to check first, and how to confirm it is over, is worth three alerts that just say something is wrong.</p>

<div class="callout">
<p><strong>The alerts that pay for themselves, in order.</strong> (1) 5xx ratio above threshold — catches almost everything. (2) p95 latency above SLO for 10 minutes — catches degradation before users complain. (3) Request rate dropped to near zero — catches the outages where <em>nothing</em> errors because nothing arrives, which the first two miss entirely. (4) Event loop lag p99 above 100ms — Node-specific, catches blocking. (5) Disk above 85% — the one that saved this project, discussed below.</p>
</div>

<h3>The four golden signals</h3>
<p>Google's SRE framing, and a good checklist for "have I forgotten a category":</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Latency</span><span class="lz-d">How slow — and measure successful and failed requests SEPARATELY, because errors usually return very fast and drag the average down misleadingly</span></div>
  <div class="lz-node"><span class="lz-t">Traffic</span><span class="lz-d">How many requests per second. Needed to tell "broken" apart from "nobody is visiting"</span></div>
  <div class="lz-node"><span class="lz-t">Errors</span><span class="lz-d">The failure rate. Remember the errors that return 200 with an empty body — they show up nowhere at all</span></div>
  <div class="lz-node"><span class="lz-t">Saturation</span><span class="lz-d">How much headroom is left: disk, memory, connection pool, event-loop lag. These are the EARLY WARNING metrics</span></div>
</div>

<p>Saturation is the one teams skip, and it is the one that gives warning. Latency, traffic and errors tell you an incident is happening. Saturation tells you one is coming — disk filling at a steady rate has a predictable arrival time, and a connection pool at 90% utilisation is one traffic spike away from timeouts.</p>

<h3>The incident this project actually had</h3>
<p>This is not hypothetical. The VPS behind cuongthai.com once filled its disk. PostgreSQL, unable to write, stopped accepting connections. The API returned 500 for everything. Recovery was <code>docker prune -af</code> plus a builder prune plus restarting Postgres.</p>
<p>Now trace it backwards through this lesson. <strong>Was it detectable?</strong> Yes — disk usage climbs steadily and predictably; a "disk above 85%" alert would have fired hours or days ahead. <strong>Was it visible in logs?</strong> Barely, and worse: the disk being full is precisely the condition under which logs cannot be written. <strong>Would a health check have caught it?</strong> A readiness check touching the database would have gone 503 — correctly. A <em>liveness</em> check touching the database would have killed every container on top of it, exactly the cascade described at the top of this lesson.</p>

<p>One incident, and every idea in this chapter has a part in it. That is the shape of most production failures: not one missing tool, but four small gaps that line up.</p>

<h3>The minimum that is genuinely worth having</h3>
<p>Full observability is a big project. This is the subset that catches most incidents, ordered by value per hour of work:</p>

<div class="kv-grid">
  <div class="kv"><span>1. Log JSON + request id</span><b>A few hours of work. Without it, every diagnosis is a guess</b></div>
  <div class="kv"><span>2. Error tracking (Sentry)</span><b>An afternoon. You learn something broke BEFORE a user messages you</b></div>
  <div class="kv"><span>3. An external uptime check</span><b>Ten minutes. It catches exactly the incident internal monitoring misses: the whole machine dying</b></div>
  <div class="kv"><span>4. Disk and memory alerts</span><b>Ten minutes. Precisely the incident described above</b></div>
  <div class="kv"><span>5. /metrics plus a RED dashboard</span><b>A day. It moves you from reacting to seeing things coming</b></div>
  <div class="kv"><span>6. Trace</span><b>A few days plus 40% of your throughput. Save it until there is a second service</b></div>
</div>

<p>Item 3 deserves emphasis because it is ten minutes of work and covers a blind spot nothing else does: <strong>monitoring that runs inside the thing it monitors cannot report that the thing is gone.</strong> A check from outside your network, hitting a real URL, is the only signal that survives the machine dying.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Three probes exist in <code>src/index.ts</code>: <code>/health</code> (detailed — DB check plus uptime, environment and connection status), <code>/health/live</code> (unconditional 200, correct), and <code>/health/ready</code> (DB check, 503 on failure, correct). The separation is right. Two gaps are worth naming honestly. First, nginx proxies only <code>/api/</code>, so none of the three is reachable from outside — the externally visible one is <code>/api/v1/system/health</code>, which returns <code>{"status":"ok"}</code> and <em>does not check the database at all</em>. If an external uptime monitor watches that URL, it will report "ok" during a total database outage. Second, the DB check has no explicit timeout, which is the exact hang measured earlier in this lesson. Both are small changes; neither is visible until the day it matters.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-989"><span class="lc-t">Code Lab · Health Checks &amp; Uptime</span><span class="lc-d">Liveness, readiness and probes that do not lie</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-991"><span class="lc-t">Code Lab · Alerting &amp; On-Call</span><span class="lc-d">Thresholds, runbooks and keeping alerts trustworthy</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.6</span>
<h2>Health check, cảnh báo, và chuyện bị gọi dậy lúc 3 giờ sáng</h2>
<p class="lead">Ba bài trước dựng lên khả năng <em>trả lời câu hỏi</em>. Bài này nói về hai chỗ mà khả năng ấy gặp một cái máy sẽ <em>tự động hành động</em> dựa trên nó: health check, thứ quyết định container của bạn sống hay chết, và cảnh báo, thứ quyết định có đánh thức một con người hay không. Cả hai đều dễ viết, và đều dễ viết theo cách làm sự cố tệ hơn.</p>

<h3>Hai câu hỏi khác nhau trông như một</h3>
<div class="kv-grid">
  <div class="kv"><span>Liveness — "còn sống không?"</span><b>Nếu trả lời SAI → container bị GIẾT và khởi động lại. Chỉ nên hỏi về chính tiến trình</b></div>
  <div class="kv"><span>Readiness — "nhận việc được chưa?"</span><b>Nếu trả lời SAI → bị rút khỏi cân bằng tải, KHÔNG bị giết. Được phép kiểm phụ thuộc</b></div>
</div>

<p>Nhầm lẫn hai thứ này là sai lầm đắt nhất trong bài, nên xin kể đủ kịch bản hỏng. Giả sử liveness kiểm tra cơ sở dữ liệu. Cơ sở dữ liệu nấc một cái ba mươi giây. Mọi container đều trượt probe liveness, nên bộ điều phối giết sạch. Chúng khởi động lại — với pool kết nối nguội, cache nguội, JIT nguội — rồi nện vào cái database đang hồi phục bằng một cơn bão kết nối lại, khiến nó tiếp tục nằm. <strong>Một cú nấc ba mươi giây của database vừa biến thành mười lăm phút sập hoàn toàn, và chính hệ giám sát đã làm chuyện đó.</strong></p>

<p>Quy tắc ngăn được nó: <strong>liveness chỉ trả lời đúng một câu "tiến trình này còn có khả năng phản hồi hay không". Không gì khác.</strong></p>

<pre><code>// liveness — không chạm vào bất cứ thứ gì bên ngoài
app.get('/health/live', (req, res) =&gt; res.json({ status: 'ok' }));

// readiness — được phép kiểm phụ thuộc, và BẮT BUỘC phải có timeout
app.get('/health/ready', async (req, res) =&gt; {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    res.json({ status: 'ready', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'error' });
  }
});</code></pre>

<h3>Timeout không phải tuỳ chọn, đo thật</h3>
<p>Kiểu hỏng nguy hiểm của database không phải là "chết" — một kết nối bị từ chối thì hỏng ngay lập tức và sạch sẽ. Nguy hiểm là <strong>"vẫn nhận kết nối và không bao giờ trả lời"</strong>: máy chủ quá tải, pool bão hoà, một đường mạng nuốt gói tin. Mô phỏng bằng một cái listener TCP nhận kết nối rồi im bặt, và đo bốn endpoint:</p>

<div class="out">/live          -&gt; 200 sau   32ms  {"status":"ok"}
/ready-good    -&gt; 200 sau   33ms  {"status":"ready"}
/ready-timeout -&gt; 503 sau  806ms  {"status":"not ready","e":"Connection terminated due to connection timeout"}
/ready-hang    -&gt; KHÔNG TRẢ LỜI trong 5000ms (probe sẽ coi là CHẾT)</div>

<div class="danger">
<p><strong>Dòng cuối chính là toàn bộ bài học.</strong> Cái pool cấu hình <code>connectionTimeoutMillis: 0</code> — vốn là <em>mặc định</em> ở nhiều client — không bao giờ quay lại. Probe hết giờ. Nếu probe đó là liveness thì container vừa bị giết, vì một sự cố database mà nó không hề gây ra và lẽ ra còn phục vụ được một phần. Đúng một dòng cấu hình, <code>connectionTimeoutMillis: 800</code>, biến một cú treo vô hạn thành một mã 503 gọn gàng trong 806ms, mà 503 gọn gàng là thứ bộ điều phối xử lý đúng được.</p>
</div>

<p>Hệ quả cho việc cấu hình probe: thời gian chờ của chính probe phải <em>ngắn hơn</em> chu kỳ nó chạy, nếu không các lần probe chậm sẽ xếp hàng và bạn đang đo cái hàng đợi chứ không phải đo ứng dụng.</p>

<h3>Cái gì thuộc về check nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">/health/live</span><span class="lz-d">trả 200 vô điều kiện. Chỉ SAI khi tiến trình treo cứng hoặc chết hẳn</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">/health/ready</span><span class="lz-d">DB + cache, mỗi cái có timeout ngắn. Sai = rút khỏi cân bằng tải, không giết</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">/health (chi tiết)</span><span class="lz-d">uptime, phiên bản, môi trường, trạng thái từng phụ thuộc. Cho CON NGƯỜI đọc, không cho probe</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Loại khỏi access log</span><span class="lz-d">probe 10 giây một lần = 8.640 dòng/ngày/container không mang tin gì</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> một readiness check truy vấn database ở <em>mọi</em> lần gọi thì bản thân nó là tải. Với chu kỳ mười giây, sáu container, ba nơi cùng probe, đó là một truy vấn mỗi 0,55 giây, mãi mãi, để lấy một thông tin hiếm khi đổi. Hãy cache kết quả vài giây. Một readiness check góp phần vào chính cái quá tải mà nó sinh ra để phát hiện là một kiểu mỉa mai rất đắt tiền.</p>
</div>

<h3>Cảnh báo: con số quan trọng là bạn phớt lờ bao nhiêu cái</h3>
<p>Một cảnh báo là lời hứa rằng sẽ có người làm gì đó. Mỗi cảnh báo nổ mà không cần hành động đều làm mất giá mọi cảnh báo còn lại, và đơn vị tiền tệ ở đây là <em>lòng tin</em> — khi một người trực đã tắt cùng một báo động giả ba lần thì họ sẽ tắt luôn cái thật. Đây không phải vấn đề kỷ luật; đây là số học.</p>

<div class="kv-grid">
  <div class="kv"><span>Đánh thức người</span><b>Người dùng đang không dùng được sản phẩm NGAY BÂY GIỜ và cần người sửa NGAY</b></div>
  <div class="kv"><span>Ticket, giờ hành chính</span><b>Đang xấu đi và sẽ thành sự cố trong vài ngày: đĩa 80%, chứng chỉ còn 14 ngày</b></div>
  <div class="kv"><span>Chỉ vào bảng điều khiển</span><b>Đáng nhìn khi đang điều tra, không đáng gửi đi đâu cả</b></div>
</div>

<p>Bốn quy tắc làm được phần lớn công việc:</p>
<p><strong>Cảnh báo theo triệu chứng, đừng theo nguyên nhân.</strong> "Tỉ lệ 5xx trên 2% trong 5 phút" là triệu chứng — nó nổ với <em>mọi</em> nguyên nhân, kể cả những nguyên nhân bạn chưa nghĩ ra. "CPU trên 90%" là nguyên nhân, và là một cảnh báo tồi: CPU cao mà độ trễ vẫn tốt là một cái máy đang làm đúng việc của nó, còn CPU thấp mà 100% lỗi là một sự cố mà cảnh báo của bạn bỏ sót.</p>
<p><strong>Bắt buộc có khoảng thời gian.</strong> Mệnh đề "trong 5 phút" xoá sạch cả một lớp cảnh báo sinh ra do đúng một lần quét rơi trúng lúc đang deploy. Gần như mọi cảnh báo ồn ào đều trở nên hợp lý khi thêm một mệnh đề <code>for</code>.</p>
<p><strong>Dùng tỉ lệ, đừng dùng số đếm.</strong> "50 lỗi mỗi phút" là thảm hoạ ở mức 100 request/phút và vô hình ở mức 100.000. Tỉ lệ sống sót qua tăng trưởng; số đếm cần chỉnh lại mỗi quý và không bao giờ được chỉnh.</p>
<p><strong>Mọi cảnh báo phải kèm link runbook.</strong> Lúc 3 giờ sáng, người phản hồi không phải bạn và không tỉnh táo. Một cảnh báo nói rõ kiểm gì trước và làm sao biết là đã hết đáng giá bằng ba cảnh báo chỉ nói rằng có gì đó sai.</p>

<div class="callout">
<p><strong>Những cảnh báo tự trả đủ tiền, xếp theo thứ tự.</strong> (1) Tỉ lệ 5xx vượt ngưỡng — bắt được gần như mọi thứ. (2) p95 vượt cam kết trong 10 phút — bắt được sự xuống cấp trước khi người dùng kêu. (3) Tốc độ request tụt về gần bằng không — bắt được loại sự cố mà <em>không có lỗi nào</em> vì không có gì đến cả, thứ mà hai cái trên bỏ sót hoàn toàn. (4) Độ trễ event loop p99 trên 100ms — riêng cho Node, bắt hiện tượng chặn. (5) Đĩa trên 85% — cái đã cứu chính dự án này, kể ngay dưới đây.</p>
</div>

<h3>Bốn tín hiệu vàng</h3>
<p>Cách phân loại của nhóm SRE ở Google, và là một danh sách kiểm tốt cho câu "mình có bỏ sót hạng mục nào không":</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Latency (độ trễ)</span><span class="lz-d">Chậm bao nhiêu — và đo RIÊNG request thành công với request lỗi, vì lỗi thường trả về rất nhanh và kéo trung bình xuống một cách giả tạo</span></div>
  <div class="lz-node"><span class="lz-t">Traffic (lưu lượng)</span><span class="lz-d">Bao nhiêu request/giây. Cần để phân biệt "hỏng" với "không có ai vào"</span></div>
  <div class="lz-node"><span class="lz-t">Errors (lỗi)</span><span class="lz-d">Tỉ lệ hỏng. Nhớ cả những lỗi trả về mã 200 nhưng thân rỗng — chúng không hiện ở đâu cả</span></div>
  <div class="lz-node"><span class="lz-t">Saturation (mức bão hoà)</span><span class="lz-d">Còn bao nhiêu chỗ trống: đĩa, RAM, pool kết nối, độ trễ event loop. Đây là chỉ số CẢNH BÁO SỚM</span></div>
</div>

<p>Bão hoà là thứ các đội hay bỏ qua, và là thứ duy nhất báo trước. Độ trễ, lưu lượng và lỗi cho biết một sự cố <em>đang</em> diễn ra. Bão hoà cho biết một sự cố <em>sắp</em> tới — đĩa đầy đều đặn thì có một thời điểm cập bến dự đoán được, và một pool kết nối dùng tới 90% chỉ cách một đợt tăng tải là tới hàng loạt timeout.</p>

<h3>Sự cố mà chính dự án này đã gặp</h3>
<p>Đây không phải giả thuyết. VPS sau lưng cuongthai.com từng đầy đĩa. PostgreSQL không ghi được nên ngừng nhận kết nối. API trả 500 cho mọi thứ. Cách hồi phục là <code>docker prune -af</code> cộng dọn cache builder cộng khởi động lại Postgres.</p>
<p>Giờ truy ngược nó qua bài học này. <strong>Có phát hiện trước được không?</strong> Có — dung lượng đĩa tăng đều và dự đoán được; một cảnh báo "đĩa trên 85%" sẽ nổ trước đó hàng giờ hoặc hàng ngày. <strong>Log có nhìn thấy không?</strong> Rất mờ nhạt, và tệ hơn: đĩa đầy chính là điều kiện mà log <em>không ghi nổi</em>. <strong>Health check có bắt được không?</strong> Một readiness check chạm vào database sẽ chuyển sang 503 — chính xác. Còn một <em>liveness</em> check chạm vào database sẽ giết sạch mọi container chồng lên trên đó, đúng cái hiệu ứng dây chuyền mô tả ở đầu bài.</p>

<p>Một sự cố, và mọi ý tưởng trong chương này đều có phần trong đó. Đó là hình dạng của phần lớn hỏng hóc production: không phải thiếu một công cụ, mà là bốn lỗ hổng nhỏ xếp thẳng hàng nhau.</p>

<h3>Mức tối thiểu thật sự đáng có</h3>
<p>Quan sát hệ thống đầy đủ là một dự án lớn. Đây là tập con bắt được phần lớn sự cố, xếp theo giá trị trên mỗi giờ công:</p>

<div class="kv-grid">
  <div class="kv"><span>1. Log JSON + mã request</span><b>Vài giờ làm. Không có nó thì mọi phép chẩn đoán đều là đoán</b></div>
  <div class="kv"><span>2. Theo dõi lỗi (Sentry)</span><b>Một buổi chiều. Bạn biết chuyện hỏng TRƯỚC khi người dùng nhắn tin</b></div>
  <div class="kv"><span>3. Uptime check từ bên ngoài</span><b>Mười phút. Bắt được đúng loại sự cố mà giám sát nội bộ bỏ sót: cả cái máy chết</b></div>
  <div class="kv"><span>4. Cảnh báo đĩa/RAM</span><b>Mười phút. Chính là sự cố đã kể ở trên</b></div>
  <div class="kv"><span>5. /metrics + biểu đồ RED</span><b>Một ngày. Chuyển từ phản ứng sang nhìn thấy trước</b></div>
  <div class="kv"><span>6. Trace</span><b>Vài ngày + 40% throughput. Để dành tới khi có dịch vụ thứ hai</b></div>
</div>

<p>Mục 3 đáng được nhấn mạnh vì nó tốn mười phút và phủ được một điểm mù mà không thứ nào khác phủ nổi: <strong>hệ giám sát chạy bên trong chính thứ nó giám sát thì không báo được rằng thứ đó đã biến mất.</strong> Một phép kiểm từ ngoài mạng của bạn, gọi vào một URL thật, là tín hiệu duy nhất sống sót khi cả cái máy chết.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Có ba probe trong <code>src/index.ts</code>: <code>/health</code> (chi tiết — kiểm DB cộng uptime, môi trường, trạng thái kết nối), <code>/health/live</code> (trả 200 vô điều kiện, đúng chuẩn), và <code>/health/ready</code> (kiểm DB, 503 khi hỏng, đúng chuẩn). Việc tách bạch là chính xác. Có hai lỗ hổng đáng gọi tên một cách trung thực. <em>Một</em>, nginx chỉ chuyển tiếp <code>/api/</code>, nên không cái nào trong ba cái với tới được từ bên ngoài — cái nhìn thấy từ ngoài là <code>/api/v1/system/health</code>, trả về <code>{"status":"ok"}</code> và <em>hoàn toàn không kiểm tra database</em>. Nếu một dịch vụ theo dõi uptime bên ngoài canh URL đó thì nó sẽ báo "ok" trong lúc database sập hoàn toàn. <em>Hai</em>, phép kiểm DB không đặt timeout tường minh, đúng cái kiểu treo đã đo ở trên. Cả hai đều là thay đổi nhỏ; và cả hai đều vô hình cho tới đúng cái ngày nó quan trọng.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-989"><span class="lc-t">Code Lab · Health Checks &amp; Uptime</span><span class="lc-d">Liveness, readiness và những probe không nói dối</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-991"><span class="lc-t">Code Lab · Alerting &amp; On-Call</span><span class="lc-d">Ngưỡng, runbook và giữ cho cảnh báo còn đáng tin</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 15.7 ─────────────────────────── */
    {
      title: '15.7 — Chapter 15 quiz|||15.7 — Kiểm tra chương 15',
      slug: 'nodejs-15-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu về log có cấu trúc, ngữ cảnh request, chi phí đĩa, cardinality của metric, giá thật của trace và bẫy health check — mỗi câu đều được phân định bởi một phép đo trong bài 15.1 tới 15.6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 15.1 to 15.6 — the structured logger that beat the plain string while writing more bytes, the default configuration that wrote every user's session token into a log file, the label that turned 127 time series into 1.400.000, the sampler that cut exported spans 111× and throughput by nothing, and the health check that never answered at all. Observability is the topic where the intuitive answer is most often the expensive one, so prefer the output block over the feeling.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 15.1 tới 15.6 — cái logger có cấu trúc thắng chuỗi thô dù ghi nhiều byte hơn, cấu hình mặc định ghi token phiên của mọi người dùng vào file log, cái nhãn biến 127 chuỗi thời gian thành 1.400.000, bộ lấy mẫu cắt số span xuất đi 111 lần mà không cắt được gì về throughput, và cái health check không bao giờ trả lời. Quan sát hệ thống là chủ đề mà câu trả lời theo trực giác thường là câu đắt tiền nhất, nên hãy tin khối kết quả đo hơn là tin cảm giác.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 800,
        questions: [
          {
            question: 'Writing 100.000 lines to a file measured 408,0ms with console.log on a short plain string, 190,3ms with pino writing longer JSON, and 407,8ms with the same pino configured sync: true. What is the variable that actually explains those numbers?|||Ghi 100.000 dòng ra file đo được 408,0ms với console.log dùng một chuỗi ngắn, 190,3ms với pino ghi JSON dài hơn, và 407,8ms với vẫn pino đó nhưng cấu hình sync: true. Biến số nào thật sự giải thích các con số ấy?',
            options: [
              'Buffering. pino is fast because it batches writes instead of issuing one syscall per line; force it synchronous and it drops to console.log speed, so the format was never the cost|||Việc đệm. pino nhanh vì nó gom nhiều lệnh ghi lại thay vì gọi một syscall cho mỗi dòng; ép nó chạy đồng bộ thì nó tụt về đúng tốc độ console.log, nên định dạng chưa bao giờ là cái giá',
              'JSON serialisation is inherently faster than string concatenation in V8|||Tuần tự hoá JSON vốn dĩ nhanh hơn nối chuỗi trong V8',
              'console.log is slow because it writes to stdout while pino writes to a file descriptor|||console.log chậm vì nó ghi ra stdout còn pino ghi vào một file descriptor',
              'The difference is measurement noise; at this scale all three are equivalent|||Khác biệt đó là nhiễu đo đạc; ở quy mô này cả ba là như nhau',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A team adds pino-http with default settings and ships it. A week later a security review reads one log line and files a critical finding. What did the review almost certainly see?|||Một đội thêm pino-http với cấu hình mặc định rồi đưa lên production. Một tuần sau, một buổi rà soát bảo mật đọc đúng một dòng log và mở một phát hiện mức nghiêm trọng. Buổi rà soát ấy gần như chắc chắn đã nhìn thấy cái gì?',
            options: [
              'The log line was 486 bytes, which exceeds the recommended maximum|||Dòng log dài 486 byte, vượt quá mức khuyến nghị tối đa',
              'The hostname and pid fields expose internal infrastructure naming|||Các trường hostname và pid làm lộ cách đặt tên hạ tầng nội bộ',
              'req.headers contained the Authorization bearer token and the session Cookie in plaintext, so every user session token is now sitting in a 90-day log store readable by anyone with dashboard access|||req.headers chứa nguyên Authorization bearer token và Cookie phiên ở dạng chữ thường, nên toàn bộ token phiên của mọi người dùng giờ nằm trong một kho log giữ 90 ngày mà ai có quyền xem dashboard cũng đọc được',
              'The responseTime field was rounded to whole milliseconds, hiding sub-millisecond variation|||Trường responseTime bị làm tròn tới mili-giây, che mất biến thiên dưới một mili-giây',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Four configurations were load-tested: no correlation at all 13.687 req/s, generating a randomUUID and attaching it 12.825 req/s, AsyncLocalStorage with a plain store 12.839 req/s, AsyncLocalStorage with a child logger 12.910 req/s. What does this say about the common advice to avoid AsyncLocalStorage for performance reasons?|||Bốn cấu hình được đo tải: không có ngữ cảnh gì 13.687 req/giây, sinh randomUUID rồi gắn vào 12.825 req/giây, AsyncLocalStorage với store trần 12.839 req/giây, AsyncLocalStorage kèm child logger 12.910 req/giây. Điều đó nói gì về lời khuyên phổ biến rằng nên tránh AsyncLocalStorage vì lý do hiệu năng?',
            options: [
              'The advice is correct — a 6% loss is significant and should be avoided|||Lời khuyên đó đúng — mất 6% là đáng kể và nên tránh',
              'The advice is out of date: the entire 6% is paid by the extra middleware and the extra log field, and AsyncLocalStorage adds nothing measurable on top of that|||Lời khuyên đó đã lỗi thời: toàn bộ 6% là do middleware phụ và trường log phụ, còn bản thân AsyncLocalStorage không thêm gì đo được lên trên đó',
              'The measurement is invalid because AsyncLocalStorage costs only appear above 50.000 req/s|||Phép đo không hợp lệ vì chi phí của AsyncLocalStorage chỉ hiện ra khi vượt 50.000 req/giây',
              'The child logger row being fastest proves the numbers are random noise and nothing can be concluded|||Việc dòng child logger nhanh nhất chứng tỏ các con số chỉ là nhiễu ngẫu nhiên và không kết luận được gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A 1.000.000-line JSON log was searched three ways: grep -F took 2,20s, jq filtering on a field took 3,78s, and grep piped into jq took 2,40s. Separately, the query "every request slower than 1000ms" ran fine on the JSON log. Which conclusion is best supported?|||Một file log JSON 1.000.000 dòng được tìm bằng ba cách: grep -F mất 2,20s, jq lọc theo trường mất 3,78s, và grep nối ống sang jq mất 2,40s. Riêng câu truy vấn "mọi request chậm hơn 1000ms" thì chạy ngon lành trên log JSON. Kết luận nào có cơ sở nhất?',
            options: [
              'jq should be avoided entirely because grep is always faster|||Nên tránh jq hoàn toàn vì grep lúc nào cũng nhanh hơn',
              'The 30% extra bytes JSON costs is not worth 1,6× slower searching|||Cái giá 30% byte tăng thêm của JSON không đáng với việc tìm kiếm chậm hơn 1,6 lần',
              'grep scans bytes and jq parses types, so the fastest correct approach is grep to narrow candidates then jq for the typed condition — and the typed condition is the thing a plain-text log cannot express at all|||grep quét byte còn jq phân tích kiểu dữ liệu, nên cách nhanh mà vẫn đúng là dùng grep thu hẹp ứng viên rồi jq áp điều kiện cần kiểu — và chính điều kiện cần kiểu ấy là thứ log dạng chữ thường không diễn đạt nổi',
              'Both tools are too slow at this scale and a log aggregator is mandatory before 1.000.000 lines|||Cả hai công cụ đều quá chậm ở quy mô này và bắt buộc phải có hệ gom log trước khi tới 1.000.000 dòng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Computing percentiles per URL directly from the log gave /api/v1/feed a p95 of 113,9ms — identical to every other route — and a max of 8241ms. What is the correct operational reading?|||Tính phân vị theo từng URL trực tiếp từ log cho ra /api/v1/feed có p95 là 113,9ms — giống hệt mọi route khác — và max là 8241ms. Cách đọc đúng về mặt vận hành là gì?',
            options: [
              'The max is an outlier and should be discarded as measurement error|||Giá trị max là ngoại lai và nên loại bỏ như một lỗi đo đạc',
              'Percentiles are designed to suppress outliers, which is what makes them stable and also what makes them blind — one bad request in 250.000 sits at the 99,9996th percentile, so alert on percentiles but investigate with max|||Phân vị được thiết kế để dập giá trị ngoại lai, đó là thứ làm nó ổn định và cũng là thứ làm nó mù — một request tệ trên 250.000 nằm ở phân vị 99,9996, nên hãy cảnh báo bằng phân vị nhưng điều tra bằng max',
              'The p95 must have been calculated incorrectly, since a max of 8241ms should raise it|||p95 chắc chắn đã bị tính sai, vì một giá trị max 8241ms lẽ ra phải kéo nó lên',
              'p99 should be used instead of p95, which would have caught the 8241ms request|||Nên dùng p99 thay cho p95, như vậy sẽ bắt được request 8241ms kia',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A sampling strategy kept 100% of 5xx responses, 100% of anything over 1000ms, and 1% of the rest, choosing the 1% by a stable hash of the request id. It reduced 229,3MB to 2,3MB while keeping every incident line. Why must the hash be over the request id rather than Math.random() per line?|||Một chiến lược lấy mẫu giữ 100% phản hồi 5xx, 100% mọi thứ trên 1000ms, và 1% phần còn lại, chọn 1% ấy bằng một hàm băm ổn định trên mã request. Nó giảm 229,3MB xuống 2,3MB mà vẫn giữ mọi dòng liên quan tới sự cố. Vì sao bắt buộc phải băm theo mã request thay vì dùng Math.random() cho từng dòng?',
            options: [
              'Math.random() is not cryptographically secure and could be predicted by an attacker|||Math.random() không an toàn về mặt mật mã và có thể bị kẻ tấn công đoán trước',
              'Hashing is faster than generating a random number for every line|||Băm thì nhanh hơn sinh một số ngẫu nhiên cho mỗi dòng',
              'A per-line random keeps a scattered 1% of lines from every request, producing orphaned fragments; hashing the request id makes each request entirely kept or entirely dropped, so a sampled request is still a complete story|||Ngẫu nhiên theo từng dòng sẽ giữ 1% số dòng rải rác của mọi request, sinh ra toàn mảnh vụn mồ côi; băm theo mã request khiến mỗi request hoặc được giữ trọn vẹn hoặc bị bỏ trọn vẹn, nên một request đã lấy mẫu vẫn là một câu chuyện hoàn chỉnh',
              'Math.random() would drift out of the 1% target over millions of lines|||Math.random() sẽ trôi lệch khỏi mục tiêu 1% sau hàng triệu dòng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'The same app was measured with three labelling strategies over 300 requests: route template gave 127 series and a 9.780-byte /metrics; raw URL gave 4.313 series and 391.460 bytes. Scaled to 100.000 distinct label values the process held 939MB and /metrics took 1.381ms to generate. What is the rule that prevents this?|||Vẫn app đó được đo với ba cách gắn nhãn trên 300 request: dùng mẫu route cho ra 127 chuỗi và /metrics nặng 9.780 byte; dùng URL thô cho ra 4.313 chuỗi và 391.460 byte. Phóng lên 100.000 giá trị nhãn khác nhau thì tiến trình giữ 939MB và /metrics mất 1.381ms để sinh ra. Quy tắc nào ngăn được chuyện này?',
            options: [
              'Increase the Prometheus scrape interval so the cost is paid less often|||Tăng chu kỳ quét của Prometheus để cái giá đó ít phải trả hơn',
              'Remove the histogram and keep only counters, since the histogram multiplies series|||Bỏ histogram và chỉ giữ counter, vì histogram nhân số chuỗi lên',
              'A label value must come from a set you could write down on paper — method, route template, status, environment are fine; user id, raw URL, request id and error messages containing interpolated values are forbidden|||Giá trị nhãn phải đến từ một tập hợp mà bạn viết ra giấy được — method, mẫu route, mã trạng thái, môi trường thì được; user id, URL thô, mã request và thông điệp lỗi có nội suy giá trị vào thì bị cấm',
              'Restart the process periodically so Prometheus series are garbage-collected|||Khởi động lại tiến trình định kỳ để các chuỗi Prometheus được dọn rác',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A trace of one request showed twelve pg.query spans, none of which exceeded 2,53ms. A slow-query log with a 100ms threshold reported nothing at all for that request. What does this demonstrate about traces versus logs?|||Một trace của một request cho thấy mười hai span pg.query, không cái nào vượt 2,53ms. Một slow-query log đặt ngưỡng 100ms không báo cáo gì hết về request đó. Điều này chứng minh gì về trace so với log?',
            options: [
              'The slow-query threshold was set too high and should be lowered to 1ms|||Ngưỡng slow-query bị đặt quá cao và nên hạ xuống 1ms',
              'The problem is the count, not the duration, and count is a shape visible in a tree but invisible in a flat list of events — an N+1 made of fast queries is undetectable by any per-query threshold|||Vấn đề nằm ở SỐ LƯỢNG chứ không phải thời lượng, mà số lượng là hình dạng nhìn thấy được trong cây và vô hình trong một danh sách sự kiện phẳng — một lỗi N+1 gồm toàn truy vấn nhanh thì không ngưỡng-trên-mỗi-truy-vấn nào phát hiện nổi',
              'Traces are always more accurate than logs because they measure at a lower level|||Trace luôn chính xác hơn log vì nó đo ở tầng thấp hơn',
              'Twelve queries under 3ms each is acceptable performance and there is nothing to fix|||Mười hai truy vấn mỗi cái dưới 3ms là hiệu năng chấp nhận được và không có gì phải sửa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Enabling OpenTelemetry dropped throughput from 7.017 to 4.235 req/s. Adding a 1% sampler cut exported spans from 113.664 to 1.024 — a factor of 111 — while throughput moved only from 4.744 to 4.916 req/s and memory did not drop at all. What is the correct interpretation?|||Bật OpenTelemetry làm throughput tụt từ 7.017 xuống 4.235 req/giây. Thêm bộ lấy mẫu 1% cắt số span xuất ra từ 113.664 xuống 1.024 — gấp 111 lần — trong khi throughput chỉ nhích từ 4.744 lên 4.916 req/giây và bộ nhớ không giảm chút nào. Cách hiểu đúng là gì?',
            options: [
              'Sampling saves export bandwidth and the monitoring bill, but not CPU — the instrumentation still patches every call and propagates context on every request; only recording and exporting are skipped|||Lấy mẫu tiết kiệm băng thông xuất đi và hoá đơn giám sát, nhưng không tiết kiệm CPU — lớp đo đạc vẫn vá mọi lời gọi và vẫn truyền ngữ cảnh ở mọi request; chỉ phần ghi lại và xuất đi là được bỏ qua',
              'The sampler was misconfigured, since a 111× reduction should produce a proportional speed-up|||Bộ lấy mẫu bị cấu hình sai, vì giảm 111 lần lẽ ra phải cho tăng tốc tương ứng',
              'Sampling should be set to 0 to recover the full 7.017 req/s|||Nên đặt lấy mẫu bằng 0 để lấy lại đủ 7.017 req/giây',
              'Memory did not drop because BatchSpanProcessor holds all spans regardless of sampling|||Bộ nhớ không giảm vì BatchSpanProcessor giữ mọi span bất kể có lấy mẫu hay không',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Four probes were measured against a database that accepts connections and then never answers: /live returned 200 in 32ms, /ready-timeout returned 503 in 806ms, and /ready-hang never responded within 5000ms. If /ready-hang had been wired as the liveness probe, what happens during a brief database hiccup?|||Bốn probe được đo với một database vẫn nhận kết nối rồi không bao giờ trả lời: /live trả 200 sau 32ms, /ready-timeout trả 503 sau 806ms, và /ready-hang không hề trả lời trong 5000ms. Nếu /ready-hang được nối làm probe liveness thì chuyện gì xảy ra trong một cú nấc ngắn của database?',
            options: [
              'Nothing — the orchestrator retries the probe until the database recovers|||Không sao cả — bộ điều phối sẽ thử lại probe cho tới khi database hồi phục',
              'Only the containers whose pool was exhausted get restarted, which is the desired self-healing behaviour|||Chỉ những container có pool cạn mới bị khởi động lại, đó chính là hành vi tự chữa lành mong muốn',
              'Every container fails liveness and gets killed, then restarts with cold pools and hammers the recovering database with a reconnect storm — turning a 30-second blip into a full outage caused by the monitoring itself|||Mọi container đều trượt liveness và bị giết, rồi khởi động lại với pool nguội và nện vào database đang hồi phục bằng một cơn bão kết nối lại — biến một cú nấc 30 giây thành một lần sập toàn diện do chính hệ giám sát gây ra',
              'The probe times out but liveness failures are advisory only, so nothing is killed|||Probe hết giờ nhưng liveness hỏng chỉ mang tính khuyến nghị, nên không có gì bị giết',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
