/**
 * Observability — Chương 6 — Trace: thời gian thật sự đi đâu.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 6 — Tracing: where the time actually went|||Chương 6 — Trace: thời gian thật sự đi đâu',
  slug: 'obs-ch6-trace',
  description: 'Span, OpenTelemetry trong Node, lấy mẫu đầu và đuôi, đọc một biểu đồ thác.',
  sortOrder: 7,
  lessons: [
    {
      title: '6.1 — A span is an interval with a parent|||6.1 — Một span là một khoảng thời gian có cha',
      slug: 'obs-6-1-span-la-gi',
      type: 'VIDEO',
      description: 'Vì sao một trace là một CÂY chứ không phải một danh sách, và cái cây ấy trả lời được câu hỏi mà log không trả lời nổi.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>A span is an interval with a parent</h2>
<p class="lead">Correlation (chapter 3) gave you every line belonging to one request. Metrics (chapters 4–5) gave you how often and how fast, in aggregate. Neither answers the question you ask most often during an incident: <em>this</em> request took 4 seconds — where did the 4 seconds go? That question needs structure, and structure is what a trace adds.</p>

<h3>What correlated logs cannot tell you</h3>
<pre><code>Correlated logs give you a LIST, ordered by time:

  10:00:00.100  request started        route=/api/v1/notes
  10:00:00.104  auth ok                userId=u_8f3a
  10:00:00.110  querying notes
  10:00:04.010  outbound call finished host=modelapi.vn ms=3890
  10:00:04.012  request completed      ms=3912

You can see WHEN things happened. You cannot see:

  · Did the notes query run BEFORE the outbound call,
    or in parallel with it?
  · The gap from 00.110 to 04.010 — was that the query,
    the gateway, or something with no log line at all?
  · Which of them CAUSED the other to run?

A list has order. It does not have nesting, and nesting
is where the answer lives.</code></pre>

<h3>The same request as a tree</h3>
<pre><code>GET /api/v1/notes ─────────────────────────────── 3912ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ embed.generate ────────────────────────────── 3890ms
  │    └─ POST modelapi.vn ──────────────────────── 3889ms
  └─ response.serialise ─ 6ms

Now the answer is visual and unambiguous: 3889 of 3912ms
is ONE outbound call, and it is nested INSIDE embed.generate,
which means embed.generate is not slow — it is waiting.

Note what the indentation tells you that the list could not:
the gateway call is a CHILD of embed.generate, so fixing
"embed.generate is slow" means changing when embedding runs,
not making embed.generate faster.</code></pre>

<h3>The four fields that make it work</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">traceId</span><span class="lz-t">Which operation this belongs to</span><span class="lz-d">Identical across every span in the tree. This is the W3C trace-id from lesson 3.4 — the same 32 hex characters, travelling in the same header.</span></div>
  <div class="lz-node"><span class="lz-k">spanId</span><span class="lz-t">This particular interval</span><span class="lz-d">Unique. Sixteen hex characters. Every unit of work gets its own.</span></div>
  <div class="lz-node"><span class="lz-k">parentSpanId</span><span class="lz-t">What caused this work</span><span class="lz-d">The whole point. Absent on exactly one span per trace — the root. This single field turns a list into a tree.</span></div>
  <div class="lz-node"><span class="lz-k">start and end</span><span class="lz-t">Nanosecond timestamps</span><span class="lz-d">Duration is derived, not stored. And because you have both ends of every interval, overlap is computable — which is how you tell parallel work from sequential.</span></div>
</div>
<pre><code class="language-json">// one span, in the OTLP shape it is actually transmitted in
{
  "traceId":      "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId":       "00f067aa0ba902b7",
  "parentSpanId": "0020000000000001",
  "name":         "prisma:query Note.findMany",
  "kind":         2,
  "startTimeUnixNano": "1756108800000000000",
  "endTimeUnixNano":   "1756108800012000000",
  "attributes": [
    { "key": "db.system",    "value": { "stringValue": "postgresql" } },
    { "key": "db.statement", "value": { "stringValue": "SELECT \\"id\\" FROM \\"Note\\" WHERE …" } }
  ],
  "status": { "code": 1 }
}</code></pre>

<h3>Measurement: what a trace costs</h3>
<p>Build a trace for one realistic request in this repository — HTTP root, auth, three Prisma queries, one gateway call — and count the bytes:</p>
<div class="out">$ node m16.mjs
một trace = 6 span, 2796 byte  ( 466 byte/span )
so với MỘT dòng log của kho này: 157 byte  → 17.8×

ở 50 rps = 4.3 triệu request/ngày

tỉ lệ lấy mẫu   trace/ngày        dữ liệu thô/ngày   sau gzip 12,8×
     100.0%         4320k           11.25 GB           0.88 GB
      10.0%          432k            1.12 GB           0.09 GB
       1.0%           43k            0.11 GB           0.01 GB
       0.1%            4k            0.01 GB           0.00 GB</div>
<p><strong>Eighteen times a log line, per request.</strong> That is the number that makes sampling mandatory rather than optional, and lesson 6.3 is entirely about choosing the rate. Note also that traces compress like logs do — the 12.8× from lesson 2.5 applies, because span data is even more repetitive than log text.</p>

<h3>The five span kinds, and why the distinction matters</h3>
<pre><code>SERVER    you received a request. One per inbound request.
CLIENT    you made a request to something else.
INTERNAL  work inside your process. Default.
PRODUCER  you put a message on a queue.
CONSUMER  you took one off.

The kinds are not decoration — tooling uses them to build
the SERVICE MAP. A CLIENT span in your service and a SERVER
span in another with the same parent link are what let a
tool draw "backend calls gateway" without being told.

PRODUCER/CONSUMER is the pair that handles lesson 3.3's
queue boundary: the consumer span links back to the producer
across a gap of hours, using a span LINK rather than a
parent, because it is caused-by but not contained-in.</code></pre>

<h3>Where the three pillars now sit</h3>
<pre><code>METRIC   "p99 on /api/v1/notes is 4s"       → something is wrong
TRACE    "3889 of 3912ms is the gateway"    → WHERE it is wrong
LOG      "gateway returned 200 after 3889ms,
          prompt was 4210 chars"            → WHY it is wrong

You need all three, and in that order. A trace without logs
tells you which span was slow but not what it was doing. Logs
without a trace tell you what happened but not how it nests.

This is why span and trace ids belong in your log lines:

  logger.info('embedding requested', {
    chars: text.length,
    traceId: ctx.traceId,      // ← jump from a slow span
    spanId:  ctx.spanId,       //   straight to its log lines
  });</code></pre>

<div class="pitfall">
<p><strong>Trap — a span's duration includes time it spent waiting for its own children, so the parent is always the slowest span and that is meaningless.</strong> Read a waterfall naively and the root span is 3912 ms, so the root looks like the problem — but a parent's duration is by definition at least the sum of the critical path beneath it. The number you actually want is <em>self time</em>: duration minus the time covered by children. Most tools show it, and most people read the raw duration instead, which is why investigations so often start by staring at the HTTP handler and concluding &quot;the request is slow&quot;. <strong>Sort by self time, not duration, and the answer is usually the first row.</strong> The same trap has a sharper edge with parallel children: five 1-second queries running concurrently under a 1.1-second parent sum to 5 seconds of child time inside 1.1 seconds of wall clock, so a naive &quot;sum the children&quot; check reports a negative self time and some tools display that as zero rather than as the parallelism it is.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — traces and spans</span><span class="lc-sub">The canonical definitions of span, parent, kind, attributes and status, including the span-link mechanism for queue boundaries.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/specs/semconv/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — semantic conventions</span><span class="lc-sub">The agreed attribute names (http.route, db.statement, net.peer.name) that let a tool understand spans it has never seen before.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Một span là một khoảng thời gian có cha</h2>
<p class="lead">Correlation (chương 3) cho bạn mọi dòng log thuộc về một request. Chỉ số (chương 4–5) cho bạn biết bao nhiêu lần và nhanh cỡ nào, ở mức gộp. Không cái nào trả lời được câu hỏi bạn hỏi nhiều nhất trong lúc sự cố: <em>cái</em> request này mất 4 giây — 4 giây ấy đi đâu? Câu hỏi đó cần cấu trúc, và cấu trúc chính là thứ một trace thêm vào.</p>

<h3>Log đã ghép vẫn không nói cho bạn được điều gì</h3>
<pre><code>Log đã ghép cho bạn một DANH SÁCH, xếp theo thời gian:

  10:00:00.100  request started        route=/api/v1/notes
  10:00:00.104  auth ok                userId=u_8f3a
  10:00:00.110  querying notes
  10:00:04.010  outbound call finished host=modelapi.vn ms=3890
  10:00:04.012  request completed      ms=3912

Bạn thấy được mọi thứ xảy ra KHI NÀO. Bạn không thấy được:

  · Truy vấn ghi chú chạy TRƯỚC lời gọi ra ngoài, hay chạy
    song song với nó?
  · Cái khoảng trống từ 00.110 tới 04.010 — đó là truy vấn,
    là cổng, hay là một thứ chẳng có dòng log nào cả?
  · Cái nào GÂY RA cái kia chạy?

Một danh sách có thứ tự. Nó không có sự lồng nhau, mà sự
lồng nhau mới là chỗ câu trả lời nằm.</code></pre>

<h3>Cùng request đó, dưới dạng một cái cây</h3>
<pre><code>GET /api/v1/notes ─────────────────────────────── 3912ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ embed.generate ────────────────────────────── 3890ms
  │    └─ POST modelapi.vn ──────────────────────── 3889ms
  └─ response.serialise ─ 6ms

Giờ câu trả lời hiện ra bằng hình và không mập mờ: 3889 trong
3912ms là MỘT lời gọi ra ngoài, và nó lồng BÊN TRONG
embed.generate, nghĩa là embed.generate không chậm — nó đang chờ.

Hãy để ý cái phần thụt lề nói cho bạn điều mà danh sách không nói
được: lời gọi cổng là CON của embed.generate, nên chữa cái
"embed.generate chậm" nghĩa là đổi chỗ chạy việc embedding, chứ
không phải làm cho embed.generate nhanh hơn.</code></pre>

<h3>Bốn trường làm cho nó chạy được</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">traceId</span><span class="lz-t">Cái này thuộc về thao tác nào</span><span class="lz-d">Y hệt nhau ở mọi span trong cây. Đây chính là trace-id của W3C ở bài 3.4 — cùng 32 ký tự hex ấy, đi trong cùng cái header ấy.</span></div>
  <div class="lz-node"><span class="lz-k">spanId</span><span class="lz-t">Chính cái khoảng thời gian này</span><span class="lz-d">Duy nhất. Mười sáu ký tự hex. Mỗi đơn vị công việc có một cái riêng.</span></div>
  <div class="lz-node"><span class="lz-k">parentSpanId</span><span class="lz-t">Cái gì gây ra công việc này</span><span class="lz-d">Toàn bộ mấu chốt. Vắng mặt ở đúng một span mỗi trace — cái gốc. Chỉ một trường này thôi biến một danh sách thành một cái cây.</span></div>
  <div class="lz-node"><span class="lz-k">start và end</span><span class="lz-t">Dấu thời gian nano giây</span><span class="lz-d">Thời lượng được suy ra, không được lưu. Và vì bạn có cả hai đầu của mọi khoảng, sự chồng lấn là tính được — đó là cách bạn phân biệt việc chạy song song với việc chạy tuần tự.</span></div>
</div>
<pre><code class="language-json">// một span, đúng hình dạng OTLP mà nó thật sự được truyền đi
{
  "traceId":      "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId":       "00f067aa0ba902b7",
  "parentSpanId": "0020000000000001",
  "name":         "prisma:query Note.findMany",
  "kind":         2,
  "startTimeUnixNano": "1756108800000000000",
  "endTimeUnixNano":   "1756108800012000000",
  "attributes": [
    { "key": "db.system",    "value": { "stringValue": "postgresql" } },
    { "key": "db.statement", "value": { "stringValue": "SELECT \\"id\\" FROM \\"Note\\" WHERE …" } }
  ],
  "status": { "code": 1 }
}</code></pre>

<h3>Phép đo: một trace tốn bao nhiêu</h3>
<p>Dựng một trace cho một request thực tế trong kho này — gốc HTTP, xác thực, ba truy vấn Prisma, một lời gọi cổng — rồi đếm byte:</p>
<div class="out">$ node m16.mjs
một trace = 6 span, 2796 byte  ( 466 byte/span )
so với MỘT dòng log của kho này: 157 byte  → 17.8×

ở 50 rps = 4.3 triệu request/ngày

tỉ lệ lấy mẫu   trace/ngày        dữ liệu thô/ngày   sau gzip 12,8×
     100.0%         4320k           11.25 GB           0.88 GB
      10.0%          432k            1.12 GB           0.09 GB
       1.0%           43k            0.11 GB           0.01 GB
       0.1%            4k            0.01 GB           0.00 GB</div>
<p><strong>Gấp mười tám lần một dòng log, cho mỗi request.</strong> Đó là con số làm cho việc lấy mẫu trở thành bắt buộc chứ không phải tuỳ chọn, và bài 6.3 nói trọn về việc chọn tỉ lệ. Cũng để ý rằng trace nén tốt như log — cái 12,8× của bài 2.5 áp dụng được ở đây, vì dữ liệu span còn lặp lại nhiều hơn cả chữ trong log.</p>

<h3>Năm loại span, và vì sao sự phân biệt ấy quan trọng</h3>
<pre><code>SERVER    bạn NHẬN một request. Một cái cho mỗi request đi vào.
CLIENT    bạn GỬI một request tới thứ khác.
INTERNAL  việc bên trong tiến trình của bạn. Mặc định.
PRODUCER  bạn đặt một thông điệp lên hàng đợi.
CONSUMER  bạn lấy một cái xuống.

Mấy cái loại này không phải trang trí — công cụ dùng chúng để
dựng BẢN ĐỒ DỊCH VỤ. Một span CLIENT trong dịch vụ của bạn và
một span SERVER trong dịch vụ khác cùng một liên kết cha chính
là thứ cho phép một công cụ vẽ ra "backend gọi cổng" mà không
cần ai nói cho nó.

Cặp PRODUCER/CONSUMER là cặp xử lý cái ranh giới hàng đợi ở bài
3.3: span consumer liên kết ngược về producer qua một khoảng
cách hàng giờ, bằng một span LINK chứ không phải một quan hệ
cha, vì nó là bị-gây-ra-bởi chứ không phải nằm-bên-trong.</code></pre>

<h3>Ba trụ cột giờ đứng ở đâu</h3>
<pre><code>CHỈ SỐ   "p99 trên /api/v1/notes là 4s"       → có gì đó sai
TRACE    "3889 trong 3912ms là cái cổng"      → sai Ở ĐÂU
LOG      "cổng trả 200 sau 3889ms, prompt
          dài 4210 ký tự"                     → sai VÌ SAO

Bạn cần cả ba, và theo đúng thứ tự đó. Một trace không có log
nói cho bạn span nào chậm nhưng không nói nó đang làm gì. Log
không có trace nói cho bạn chuyện gì đã xảy ra nhưng không nói
nó lồng nhau ra sao.

Đây là lý do span id và trace id thuộc về các dòng log của bạn:

  logger.info('embedding requested', {
    chars: text.length,
    traceId: ctx.traceId,      // ← nhảy từ một span chậm
    spanId:  ctx.spanId,       //   thẳng tới các dòng log của nó
  });</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thời lượng của một span BAO GỒM cả thời gian nó chờ chính các con của nó, nên span cha luôn là span chậm nhất và điều đó vô nghĩa.</strong> Đọc một biểu đồ thác một cách ngây thơ thì span gốc là 3912 ms, nên cái gốc trông như là vấn đề — nhưng thời lượng của một span cha theo định nghĩa ít nhất bằng tổng đường găng bên dưới nó. Con số bạn thật sự cần là <em>thời gian tự thân</em>: thời lượng trừ đi phần thời gian mà các con che phủ. Phần lớn công cụ có hiện nó, và phần lớn người ta lại đọc thời lượng thô, và đó là lý do các cuộc điều tra hay bắt đầu bằng việc ngồi nhìn cái handler HTTP rồi kết luận &quot;request chậm&quot;. <strong>Hãy sắp xếp theo thời gian tự thân chứ không theo thời lượng, và câu trả lời thường là dòng đầu tiên.</strong> Cái bẫy đó còn sắc hơn với các con chạy song song: năm truy vấn mỗi cái 1 giây chạy đồng thời dưới một span cha 1,1 giây cộng lại thành 5 giây thời gian con bên trong 1,1 giây thời gian tường, nên một phép kiểm ngây thơ kiểu &quot;cộng các con lại&quot; báo ra thời gian tự thân ÂM và vài công cụ hiển thị nó thành số không thay vì thành cái sự song song mà nó thật sự là.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — trace và span</span><span class="lc-sub">Định nghĩa gốc của span, cha, kind, thuộc tính và trạng thái, kể cả cơ chế span link cho ranh giới hàng đợi.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/specs/semconv/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — quy ước ngữ nghĩa</span><span class="lc-sub">Những tên thuộc tính đã thống nhất (http.route, db.statement, net.peer.name) cho phép một công cụ hiểu được những span nó chưa từng thấy.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '6.2 — OpenTelemetry in Node, and what auto-instrumentation really does|||6.2 — OpenTelemetry trong Node, và việc tự-đo-đạc thật ra làm gì',
      slug: 'obs-6-2-otel-trong-node',
      type: 'VIDEO',
      description: 'Vá vào lúc nạp module, khởi tạo phải chạy TRƯỚC mọi import khác, và cái span thủ công duy nhất đáng viết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>OpenTelemetry in Node, and what auto-instrumentation really does</h2>
<p class="lead">The selling point of OpenTelemetry is that you get a full trace without writing any spans. That is true, and it is worth understanding <em>how</em>, because the mechanism explains every way the setup goes wrong — and it goes wrong in the same way for almost everyone.</p>

<h3>The mechanism: it rewrites modules as they load</h3>
<pre><code>When you require('http') or import Prisma, OpenTelemetry has
already registered a hook in Node's module loader. It:

  1. intercepts the module before your code gets it
  2. wraps the functions it knows about
  3. hands you the wrapped version

  http.request  ──▶  [ start CLIENT span ]
                     original http.request
                     [ end span, record status ]

You called http.request. You got a traced http.request. No
code of yours changed.

THE CONSEQUENCE that catches everyone: this only works for
modules loaded AFTER the hook is installed. A module already
in the require cache is never re-wrapped. So initialisation
order is not a style preference — it is the difference
between full traces and empty ones.</code></pre>

<h3>Setup, in the only order that works</h3>
<pre><code class="language-typescript">// src/tracing.ts — this file imports NOTHING from your app
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name':    'cuonghoangdev-backend',
    'service.version': process.env.APP_VERSION ?? 'dev',
    'deployment.environment': process.env.NODE_ENV ?? 'development',
  }),
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations({
    // /health every 30s and /metrics every 15s would be most of your traces
    '@opentelemetry/instrumentation-http': {
      ignoreIncomingRequestHook: (req) =&gt;
        ['/health', '/health/live', '/health/ready', '/metrics'].includes(req.url ?? ''),
    },
    // noisy, rarely useful, and fs spans can outnumber everything else
    '@opentelemetry/instrumentation-fs': { enabled: false },
  })],
});
sdk.start();</code></pre>
<pre><code class="language-json">// package.json — the --import flag guarantees the order
{
  "scripts": {
    "start": "node --import ./dist/tracing.js dist/index.js"
  }
}</code></pre>
<pre><code>Why --import and not a plain import at the top of index.ts:

  ESM hoists ALL imports before executing ANY module body.
  So this does not work:

    import './tracing.js';        // ← looks first
    import express from 'express'; // ← but is LOADED first

  Both are hoisted; express is resolved and cached before
  tracing.js ever runs. Every express span is missing, and
  the setup looks correct.

  --import runs the module in a separate, earlier phase.
  That is the whole reason the flag exists.</code></pre>

<h3>What you get without writing a single span</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">HTTP server</span><span class="lz-lnote">A SERVER span per inbound request, with <code>http.route</code>, method and status. This is the root of nearly every trace. It also extracts <code>traceparent</code> from the incoming headers — lesson 3.4's propagation, for free.</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTP client and fetch</span><span class="lz-lnote">A CLIENT span per outbound call, and it <em>injects</em> <code>traceparent</code> into the outgoing request. This is the boundary-4 code you wrote by hand in lesson 3.3, now automatic.</span></div>
  <div class="lz-layer"><span class="lz-lname">Express</span><span class="lz-lnote">A span per middleware and per route handler. Genuinely useful once — it shows you the middleware that is slow, which is invisible everywhere else.</span></div>
  <div class="lz-layer"><span class="lz-lname">Prisma / pg</span><span class="lz-lnote">A span per query, with <code>db.statement</code>. This is the one that pays for the whole setup, because it separates &quot;the database is slow&quot; from &quot;we make forty queries&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis, DNS, gRPC, and ~40 more</span><span class="lz-lnote">Included in <code>auto-instrumentations-node</code>. Each is cheap when the library is absent — the hook simply never fires.</span></div>
</div>

<h3>The one span worth writing by hand</h3>
<pre><code class="language-typescript">// Auto-instrumentation traces I/O. It cannot see YOUR logic.
import { trace, SpanStatusCode } from '@opentelemetry/api';
const tracer = trace.getTracer('cuonghoangdev');

export async function generateEmbedding(text: string) {
  return tracer.startActiveSpan('embed.generate', async (span) =&gt; {
    span.setAttribute('embed.chars', text.length);       // ← bounded-ish, useful
    span.setAttribute('embed.model', model);
    try {
      const result = await callGateway(text);            // auto-traced CHILD
      span.setAttribute('embed.dimensions', result.length);
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();                                        // ⚠️ ALWAYS
    }
  });
}</code></pre>
<pre><code>Which operations deserve a manual span:

  ✅ Anything with a business name you would say out loud
     ("generate embedding", "grade exam", "transcode video")
  ✅ Anything that WRAPS several I/O calls, so the trace
     shows the grouping rather than five unrelated children
  ✅ Anything CPU-heavy — it is invisible otherwise, because
     auto-instrumentation only sees I/O

  ❌ Every function. A trace with 300 spans is unreadable
     and costs 300 × 466 bytes.
  ❌ Anything inside a tight loop. Ten thousand spans in one
     trace will be dropped by the exporter's span limit, and
     the trace you kept is now incomplete in a way nothing
     tells you about.</code></pre>

<h3>The batching that keeps it off your request path</h3>
<pre><code>Spans are NOT sent when they end. The BatchSpanProcessor
queues them and flushes on a timer:

  maxQueueSize:            2048 spans
  scheduledDelayMillis:    5000  (flush every 5s)
  maxExportBatchSize:      512
  exportTimeoutMillis:     30000

So the cost on your request path is: create an object, set
some fields, push to an array. The network call happens later,
on a timer, in the background.

⚠️ maxQueueSize is a DROP threshold, not a backpressure
signal. Exceed it — a traffic spike, or a collector that is
down — and spans are silently discarded. Watch
otelcol_exporter_send_failed_spans if you run a collector;
otherwise you will believe you are sampling 10% when you are
sampling "10% minus whatever got dropped".</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>db.statement</code> can contain the parameter values, and then your trace store holds the data you spent lesson 1.2 keeping out of logs.</strong> Whether it does depends on the driver and the instrumentation version: Prisma's spans normally carry the parameterised statement with <code>$1</code> placeholders, but raw <code>pg</code> queries, some ORMs, and any code path that interpolates into SQL will put the literal values in the span — email addresses in a <code>WHERE</code> clause, a note's full text in an <code>INSERT</code>. The failure is quiet in a specific way: <strong>the span is not a log line, so it does not go through your logger's redaction, and it lands in a trace backend whose access controls are usually looser than your log store's.</strong> Verify it rather than assuming — send one request, open the trace, and read the actual <code>db.statement</code> value — and set <code>enhancedDatabaseReporting: false</code> plus a span processor that strips the attribute if there is any doubt.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/languages/js/getting-started/nodejs/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — getting started with Node.js</span><span class="lc-sub">The official setup, including the --import ordering requirement that this lesson's second code block depends on.</span></span>
</a>
<a class="link-card dl" href="https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/metapackages/auto-instrumentations-node" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">auto-instrumentations-node</span><span class="lc-sub">Every library it patches, and the per-instrumentation config options used above to silence health checks and fs.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>OpenTelemetry trong Node, và việc tự-đo-đạc thật ra làm gì</h2>
<p class="lead">Điểm bán hàng của OpenTelemetry là bạn có một trace đầy đủ mà không phải viết span nào. Điều đó đúng, và đáng hiểu <em>bằng cách nào</em>, vì cái cơ chế ấy giải thích mọi cách mà việc thiết lập bị sai — và nó sai theo cùng một kiểu với gần như tất cả mọi người.</p>

<h3>Cơ chế: nó viết lại module ngay lúc chúng được nạp</h3>
<pre><code>Khi bạn require('http') hay import Prisma, OpenTelemetry đã kịp
đăng ký một cái móc trong trình nạp module của Node. Nó:

  1. chặn module lại trước khi mã của bạn nhận được
  2. bọc những hàm mà nó biết
  3. trao cho bạn bản đã bọc

  http.request  ──▶  [ mở span CLIENT ]
                     http.request gốc
                     [ đóng span, ghi lại trạng thái ]

Bạn gọi http.request. Bạn nhận được một http.request có trace.
Không dòng mã nào của bạn thay đổi.

HỆ QUẢ tóm được tất cả mọi người: chuyện này chỉ chạy với những
module được nạp SAU KHI cái móc được cài. Một module đã nằm sẵn
trong bộ đệm require thì không bao giờ được bọc lại. Nên thứ tự
khởi tạo không phải sở thích về phong cách — nó là khác biệt
giữa trace đầy đủ và trace rỗng.</code></pre>

<h3>Thiết lập, theo thứ tự duy nhất chạy được</h3>
<pre><code class="language-typescript">// src/tracing.ts — file này KHÔNG import gì từ app của bạn
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name':    'cuonghoangdev-backend',
    'service.version': process.env.APP_VERSION ?? 'dev',
    'deployment.environment': process.env.NODE_ENV ?? 'development',
  }),
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations({
    // /health 30 giây một lần và /metrics 15 giây một lần sẽ chiếm phần lớn trace
    '@opentelemetry/instrumentation-http': {
      ignoreIncomingRequestHook: (req) =&gt;
        ['/health', '/health/live', '/health/ready', '/metrics'].includes(req.url ?? ''),
    },
    // ồn ào, hiếm khi hữu ích, và span của fs có thể đông hơn mọi thứ khác cộng lại
    '@opentelemetry/instrumentation-fs': { enabled: false },
  })],
});
sdk.start();</code></pre>
<pre><code class="language-json">// package.json — cờ --import bảo đảm đúng thứ tự
{
  "scripts": {
    "start": "node --import ./dist/tracing.js dist/index.js"
  }
}</code></pre>
<pre><code>Vì sao dùng --import mà không phải một dòng import thường ở đầu
index.ts:

  ESM CẨU (hoist) MỌI lệnh import lên trước khi thực thi thân
  của BẤT CỨ module nào. Nên cái này KHÔNG chạy:

    import './tracing.js';        // ← trông thì đứng trước
    import express from 'express'; // ← nhưng lại được NẠP trước

  Cả hai đều bị cẩu lên; express được phân giải và đưa vào bộ
  đệm trước khi tracing.js kịp chạy. Mọi span của express đều
  biến mất, và cái thiết lập thì trông vẫn đúng.

  --import chạy module ở một pha riêng, sớm hơn. Đó là toàn bộ
  lý do cái cờ ấy tồn tại.</code></pre>

<h3>Bạn nhận được gì mà không phải viết một span nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Máy chủ HTTP</span><span class="lz-lnote">Một span SERVER cho mỗi request đi vào, kèm <code>http.route</code>, method và status. Đây là gốc của gần như mọi trace. Nó cũng bóc <code>traceparent</code> ra khỏi header đến — việc truyền ngữ cảnh của bài 3.4, miễn phí.</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTP client và fetch</span><span class="lz-lnote">Một span CLIENT cho mỗi lời gọi ra ngoài, và nó <em>chèn</em> <code>traceparent</code> vào request gửi đi. Đây chính là đoạn mã ranh giới 4 bạn viết tay ở bài 3.3, giờ thành tự động.</span></div>
  <div class="lz-layer"><span class="lz-lname">Express</span><span class="lz-lnote">Một span cho mỗi middleware và mỗi route handler. Thật sự hữu ích một lần — nó cho bạn thấy cái middleware nào chậm, thứ vô hình ở mọi chỗ khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">Prisma / pg</span><span class="lz-lnote">Một span cho mỗi truy vấn, kèm <code>db.statement</code>. Đây là cái trả tiền cho cả bộ thiết lập, vì nó tách &quot;cơ sở dữ liệu chậm&quot; ra khỏi &quot;chúng ta gọi bốn mươi truy vấn&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis, DNS, gRPC, và ~40 thứ nữa</span><span class="lz-lnote">Có sẵn trong <code>auto-instrumentations-node</code>. Mỗi cái đều rẻ khi thư viện tương ứng vắng mặt — cái móc đơn giản là không bao giờ nổ.</span></div>
</div>

<h3>Cái span duy nhất đáng viết tay</h3>
<pre><code class="language-typescript">// Tự-đo-đạc trace được I/O. Nó không thấy được LÔ-GÍC CỦA BẠN.
import { trace, SpanStatusCode } from '@opentelemetry/api';
const tracer = trace.getTracer('cuonghoangdev');

export async function generateEmbedding(text: string) {
  return tracer.startActiveSpan('embed.generate', async (span) =&gt; {
    span.setAttribute('embed.chars', text.length);       // ← tạm có chặn, hữu ích
    span.setAttribute('embed.model', model);
    try {
      const result = await callGateway(text);            // CON, tự trace
      span.setAttribute('embed.dimensions', result.length);
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();                                        // ⚠️ LUÔN LUÔN
    }
  });
}</code></pre>
<pre><code>Thao tác nào xứng đáng có một span viết tay:

  ✅ Bất cứ thứ gì có một cái tên nghiệp vụ mà bạn nói thành lời
     được ("sinh embedding", "chấm bài thi", "chuyển mã video")
  ✅ Bất cứ thứ gì BỌC vài lời gọi I/O, để trace hiện ra sự gom
     nhóm thay vì năm đứa con chẳng liên quan gì nhau
  ✅ Bất cứ thứ gì nặng CPU — ngoài ra thì nó vô hình, vì tự-đo-
     đạc chỉ thấy được I/O

  ❌ Mọi hàm. Một trace 300 span thì không đọc nổi và tốn
     300 × 466 byte.
  ❌ Bất cứ thứ gì bên trong một vòng lặp chặt. Mười nghìn span
     trong một trace sẽ bị trình xuất vứt bớt theo hạn mức span,
     và cái trace bạn giữ được giờ khuyết một cách mà chẳng có
     gì báo cho bạn.</code></pre>

<h3>Cơ chế gom lô giữ nó khỏi đường request của bạn</h3>
<pre><code>Span KHÔNG được gửi đi lúc chúng kết thúc. BatchSpanProcessor
xếp chúng vào hàng và xả theo bộ đếm giờ:

  maxQueueSize:            2048 span
  scheduledDelayMillis:    5000  (xả 5 giây một lần)
  maxExportBatchSize:      512
  exportTimeoutMillis:     30000

Nên chi phí trên đường request của bạn là: tạo một object, đặt
vài trường, đẩy vào một mảng. Lời gọi mạng xảy ra sau đó, theo
bộ đếm giờ, ở nền.

⚠️ maxQueueSize là một ngưỡng VỨT BỎ, không phải một tín hiệu
nghẽn ngược. Vượt nó — một cơn dồn lưu lượng, hoặc một collector
đang chết — và span bị vứt trong im lặng. Hãy theo dõi
otelcol_exporter_send_failed_spans nếu bạn chạy một collector;
không thì bạn sẽ tin rằng mình đang lấy mẫu 10% trong khi thật
ra là "10% trừ đi bao nhiêu cái đã bị vứt".</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>db.statement</code> có thể chứa cả GIÁ TRỊ tham số, và khi đó kho trace của bạn giữ đúng cái dữ liệu mà bài 1.2 bắt bạn giữ ra khỏi log.</strong> Có hay không thì tuỳ vào driver và phiên bản bộ đo đạc: span của Prisma bình thường mang câu lệnh đã tham số hoá với chỗ giữ <code>$1</code>, nhưng truy vấn <code>pg</code> thô, vài ORM khác, và bất cứ nhánh mã nào nội suy thẳng vào SQL sẽ đặt giá trị nguyên văn vào span — địa chỉ email trong một mệnh đề <code>WHERE</code>, toàn văn một ghi chú trong một câu <code>INSERT</code>. Cú hỏng này lặng lẽ theo một cách rất cụ thể: <strong>span không phải một dòng log, nên nó không đi qua bộ che của logger, và nó rơi vào một backend trace mà quyền truy cập thường lỏng hơn kho log của bạn.</strong> Hãy đi kiểm thay vì giả định — gửi một request, mở trace ra, và đọc chính cái giá trị <code>db.statement</code> — rồi đặt <code>enhancedDatabaseReporting: false</code> cộng một span processor xoá thuộc tính đó nếu còn chút nghi ngờ nào.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/languages/js/getting-started/nodejs/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — bắt đầu với Node.js</span><span class="lc-sub">Bộ thiết lập chính thức, kèm yêu cầu về thứ tự --import mà khối mã thứ hai của bài này phụ thuộc vào.</span></span>
</a>
<a class="link-card dl" href="https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/metapackages/auto-instrumentations-node" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">auto-instrumentations-node</span><span class="lc-sub">Mọi thư viện nó vá, và các tuỳ chọn cấu hình theo từng bộ đo đạc dùng ở trên để làm im phép kiểm sức khoẻ và fs.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '6.3 — Sampling: the arithmetic nobody does|||6.3 — Lấy mẫu: phép tính chẳng ai chịu làm',
      slug: 'obs-6-3-lay-mau',
      type: 'VIDEO',
      description: 'Tính thật: lấy mẫu đầu 1% cần lỗi xảy ra 299 lần mới có 95% cơ hội bắt được một cái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Sampling: the arithmetic nobody does</h2>
<p class="lead">Lesson 6.1 measured a trace at 2,796 bytes — eighteen log lines per request. So you sample. The rate is usually chosen by copying a number from a blog post, and this lesson is the arithmetic that shows what that number actually buys.</p>

<h3>The two places you can decide</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Head sampling</span><span class="lz-t">Decide at the first span</span><span class="lz-d">Roll a die when the request arrives; the decision rides in <code>traceparent</code>'s flags byte so every downstream service agrees. Cheap, simple, and <strong>it decides before it knows whether anything interesting happened.</strong></span></div>
  <div class="lz-node"><span class="lz-k">Tail sampling</span><span class="lz-t">Decide when the trace is complete</span><span class="lz-d">Buffer all spans, then keep the ones that errored or were slow. Perfect selection, at the cost of a collector that holds every in-flight trace in memory for a configured window.</span></div>
</div>

<h3>The measurement: what head sampling misses</h3>
<pre><code class="language-javascript">// m17.mjs — at 50 rps, how many ERROR traces survive each rate?
const day = 50 * 86400;                    // 4.32M requests/day
for (const rate of [0.05, 0.01, 0.001, 0.0001, 0.00001]) {
  const errs = day * rate;
  // ...kept = errs × samplingRate
}
// and: how many times must a bug occur for a 95% chance of catching one?
Math.ceil(Math.log(0.05) / Math.log(1 - samplingRate));
</code></pre>
<div class="out">$ node m17.mjs
4.32 triệu request/ngày

tỉ lệ lỗi   lỗi/ngày   lấy mẫu 10%   lấy mẫu 1%   lấy mẫu 0,1%
   5.000%      216000       21600       2160        216
   1.000%       43200        4320        432         43
   0.100%        4320         432         43          4
   0.010%         432          43          4       0.43
   0.001%          43           4       0.43       0.04

Số lần một lỗi phải xảy ra để có 95% cơ hội bắt được ÍT NHẤT một cái:
  lấy mẫu 10%  →  29 lần
  lấy mẫu 1%  →  299 lần
  lấy mẫu 0.1%  →  2995 lần</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">At 1% head sampling, a bug must fire 299 times</span><span class="lz-d">…before you have a 95% chance of holding even one trace of it. A bug that hits ten users a day will not appear in your traces for a month.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The user who reports it is a single occurrence</span><span class="lz-d">Their trace was kept with probability 1%. Ninety-nine times out of a hundred, the answer to &quot;can you look up my request&quot; is no — which is exactly the moment tracing was supposed to help.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The bugs sampling loses are the ones worth finding</span><span class="lz-d">A 5% error rate survives any rate — but you did not need a trace to notice a 5% error rate. The 0.01% failure, the one nobody has diagnosed for weeks, is exactly the one head sampling throws away.</span></div>
</div>

<h3>Tail sampling: decide after you know</h3>
<pre><code class="language-yaml"># otel-collector.yaml
processors:
  tail_sampling:
    decision_wait: 10s          # how long to buffer a trace before deciding
    num_traces: 50000           # in-flight traces held in memory
    policies:
      - name: keep-all-errors
        type: status_code
        status_code: { status_codes: [ERROR] }

      - name: keep-slow
        type: latency
        latency: { threshold_ms: 1000 }

      - name: keep-a-baseline
        type: probabilistic
        probabilistic: { sampling_percentage: 1 }</code></pre>
<pre><code>What that costs, and what it buys:

  · 100% of errors kept        ← the 299-occurrences problem
                                 disappears entirely
  · 100% of slow requests kept ← every p99 outlier is inspectable
  ·   1% of normal traffic     ← the baseline you compare against

Volume: at 50 rps with a 1% error rate, that is
  43,200 error traces + 4,320 slow + 43,200 baseline
  ≈ 91,000 traces/day ≈ 0.24 GB raw, 0.02 GB compressed.

Compare to 100% at 11.25 GB/day. You keep everything that
matters for 2% of the volume.

The cost is real but bounded: decision_wait × throughput
worth of spans held in the collector's RAM. At 50 rps and
10s that is ~500 traces buffered — a few MB. At 5000 rps
it is ~50,000 traces, and num_traces becomes a number you
must size deliberately.</code></pre>

<h3>The trap in the middle: a trace with holes</h3>
<pre><code>Tail sampling REQUIRES that every span of a trace reaches
the same collector instance. Two collectors behind a
round-robin load balancer will each see part of a trace,
each decide independently, and each keep a fragment.

  collector A sees: root + 2 db spans     → not slow → drop
  collector B sees: the gateway span      → slow     → keep

  Result: a "trace" with one span in it, no parent, no
  context. Worse than nothing, because it looks like data.

The fix is a load-balancing exporter that routes by traceId,
so all spans of a trace land on the same instance:

  exporters:
    loadbalancing:
      routing_key: traceID
      protocol: { otlp: { ... } }

If you run one collector, you do not have this problem —
and one collector is the right answer for this repository.</code></pre>

<h3>Choosing, for a service this size</h3>
<pre><code>&lt; 100 rps  (this repo)
  → 100% head sampling. No decision needed.
    11 GB/day raw sounds like a lot until you note it is
    0.88 GB compressed and your retention is 7 days.
    Keeping everything is simpler than any sampling bug.

100–1000 rps
  → tail sampling, single collector. All errors, all slow,
    1% baseline. This is the sweet spot where tail sampling
    is clearly worth the extra moving part.

&gt; 1000 rps
  → tail sampling with a load-balancing exporter, and now
    num_traces and decision_wait are numbers you tune and
    monitor rather than set once.

Note the shape of that advice: the smallest and largest
services both have a simple answer. The middle is where
you actually have to think.</code></pre>

<h3>The rate that is always wrong</h3>
<pre><code>❌ A head sampling rate chosen to hit a COST target.

   "We can afford 2 GB/day, so 18% sampling."

   That number has no relationship to what you need to
   see. It will keep 18% of the traffic you already
   understand and 18% of the failures you do not.

✅ Work backwards from the question instead:

   "I need to be able to look up any user's reported
    request." → keep 100% of errors. Nothing else works.

   "I need to see the shape of normal traffic."
    → 1% baseline is plenty. You are looking at a
      distribution, not an individual.</code></pre>

<div class="pitfall">
<p><strong>Trap — sampled traces make terrible metrics, and the arithmetic that seems to fix it hides the failures.</strong> Counting spans to get a request rate or an error rate is tempting because the data is right there, but at 1% sampling every count is 1% of the truth, so people scale it back up by 100×. That works for high-volume totals and breaks precisely where it matters: <strong>one error trace becomes &quot;100 errors&quot;, and zero error traces becomes &quot;0 errors&quot; for a bug that is failing every minute.</strong> The error-rate graph built this way is quantised into jumps of 100 and reads zero most of the time. Metrics are counted on every request, before sampling, which is why chapter 4 exists as a separate pillar — use spans to explain a number, never to produce one.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/sampling/" target="_blank" rel="noopener">
  <span class="lc-ico">🎲</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — sampling</span><span class="lc-sub">Head versus tail, the parent-based samplers that keep a distributed decision consistent, and how the flags byte carries it.</span></span>
</a>
<a class="link-card dl" href="https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">The tail sampling processor</span><span class="lc-sub">Every policy type, the memory implications of decision_wait and num_traces, and the load-balancing requirement from this lesson.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Lấy mẫu: phép tính chẳng ai chịu làm</h2>
<p class="lead">Bài 6.1 đo được một trace nặng 2.796 byte — mười tám dòng log cho mỗi request. Nên bạn lấy mẫu. Cái tỉ lệ ấy thường được chọn bằng cách chép một con số từ một bài blog, và bài này là phép tính cho thấy con số ấy thật ra mua được gì.</p>

<h3>Hai chỗ bạn quyết định được</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Lấy mẫu ĐẦU</span><span class="lz-t">Quyết ở span đầu tiên</span><span class="lz-d">Gieo xúc xắc khi request tới; quyết định ấy đi theo byte cờ của <code>traceparent</code> nên mọi dịch vụ hạ nguồn đều đồng ý. Rẻ, đơn giản, và <strong>nó quyết TRƯỚC KHI biết có chuyện gì đáng quan tâm xảy ra hay không.</strong></span></div>
  <div class="lz-node"><span class="lz-k">Lấy mẫu ĐUÔI</span><span class="lz-t">Quyết khi trace đã hoàn tất</span><span class="lz-d">Đệm mọi span lại, rồi giữ những cái đã lỗi hoặc chậm. Chọn lựa hoàn hảo, đổi lại là một collector giữ mọi trace đang bay trong bộ nhớ suốt một cửa sổ đã cấu hình.</span></div>
</div>

<h3>Phép đo: lấy mẫu đầu bỏ sót cái gì</h3>
<pre><code class="language-javascript">// m17.mjs — ở 50 rps, mỗi tỉ lệ giữ lại được bao nhiêu trace LỖI?
const day = 50 * 86400;                    // 4,32 triệu request/ngày
for (const rate of [0.05, 0.01, 0.001, 0.0001, 0.00001]) {
  const errs = day * rate;
  // ...giữ được = errs × tỉ lệ lấy mẫu
}
// và: một lỗi phải xảy ra bao nhiêu lần để có 95% cơ hội bắt được một cái?
Math.ceil(Math.log(0.05) / Math.log(1 - samplingRate));
</code></pre>
<div class="out">$ node m17.mjs
4.32 triệu request/ngày

tỉ lệ lỗi   lỗi/ngày   lấy mẫu 10%   lấy mẫu 1%   lấy mẫu 0,1%
   5.000%      216000       21600       2160        216
   1.000%       43200        4320        432         43
   0.100%        4320         432         43          4
   0.010%         432          43          4       0.43
   0.001%          43           4       0.43       0.04

Số lần một lỗi phải xảy ra để có 95% cơ hội bắt được ÍT NHẤT một cái:
  lấy mẫu 10%  →  29 lần
  lấy mẫu 1%  →  299 lần
  lấy mẫu 0.1%  →  2995 lần</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Ở mức lấy mẫu đầu 1%, một lỗi phải nổ 299 lần</span><span class="lz-d">…thì bạn mới có 95% cơ hội giữ được dù chỉ một cái trace của nó. Một lỗi đánh trúng mười người dùng mỗi ngày sẽ không xuất hiện trong trace của bạn trong suốt một tháng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Người dùng báo lỗi là một lần xảy ra duy nhất</span><span class="lz-d">Trace của họ được giữ với xác suất 1%. Chín mươi chín trên một trăm lần, câu trả lời cho &quot;anh tra giúp tôi cái request đó được không&quot; là không — mà đó chính là cái khoảnh khắc trace lẽ ra phải giúp được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Những lỗi mà việc lấy mẫu đánh mất lại là những lỗi đáng tìm</span><span class="lz-d">Một tỉ lệ lỗi 5% sống sót qua mọi tỉ lệ lấy mẫu — nhưng bạn có cần trace đâu mới nhận ra được một tỉ lệ lỗi 5%. Cái cú hỏng 0,01%, cái mà đã hàng tuần chẳng ai chẩn đoán ra, mới đúng là cái mà lấy mẫu đầu vứt đi.</span></div>
</div>

<h3>Lấy mẫu đuôi: quyết sau khi đã biết</h3>
<pre><code class="language-yaml"># otel-collector.yaml
processors:
  tail_sampling:
    decision_wait: 10s          # đệm một trace bao lâu trước khi quyết
    num_traces: 50000           # số trace đang bay giữ trong bộ nhớ
    policies:
      - name: keep-all-errors
        type: status_code
        status_code: { status_codes: [ERROR] }

      - name: keep-slow
        type: latency
        latency: { threshold_ms: 1000 }

      - name: keep-a-baseline
        type: probabilistic
        probabilistic: { sampling_percentage: 1 }</code></pre>
<pre><code>Cái đó tốn gì, và mua được gì:

  · giữ 100% số lỗi         ← bài toán 299-lần biến mất hoàn toàn
  · giữ 100% request chậm   ← mọi ca ngoại lệ p99 đều xem được
  · giữ 1% lưu lượng thường ← cái mốc để bạn so sánh

Lượng: ở 50 rps với tỉ lệ lỗi 1%, đó là
  43.200 trace lỗi + 4.320 trace chậm + 43.200 trace mốc
  ≈ 91.000 trace/ngày ≈ 0,24 GB thô, 0,02 GB đã nén.

So với 100% là 11,25 GB/ngày. Bạn giữ mọi thứ quan trọng với
2% khối lượng.

Cái giá là có thật nhưng có chặn: lượng span tương đương
decision_wait × thông lượng nằm trong RAM của collector. Ở 50 rps
và 10s thì đó là ~500 trace đang đệm — vài MB. Ở 5000 rps thì là
~50.000 trace, và num_traces trở thành một con số bạn phải chọn
cỡ một cách có chủ ý.</code></pre>

<h3>Cái bẫy nằm ở giữa: một trace thủng lỗ</h3>
<pre><code>Lấy mẫu đuôi ĐÒI HỎI mọi span của một trace phải tới cùng một
thực thể collector. Hai collector đứng sau một bộ cân bằng tải
xoay vòng sẽ mỗi cái thấy một phần của trace, mỗi cái quyết độc
lập, và mỗi cái giữ lại một mảnh.

  collector A thấy: gốc + 2 span db     → không chậm → vứt
  collector B thấy: span của cổng       → chậm       → giữ

  Kết quả: một "trace" có đúng một span, không cha, không ngữ
  cảnh. Tệ hơn cả không có gì, vì nó trông như dữ liệu.

Cách chữa là một trình xuất cân bằng tải định tuyến theo traceId,
để mọi span của một trace rơi vào cùng một thực thể:

  exporters:
    loadbalancing:
      routing_key: traceID
      protocol: { otlp: { ... } }

Nếu bạn chạy một collector thì bạn không có vấn đề này — và một
collector chính là câu trả lời đúng cho kho này.</code></pre>

<h3>Chọn thế nào, cho một dịch vụ cỡ này</h3>
<pre><code>&lt; 100 rps  (kho này)
  → lấy mẫu đầu 100%. Không cần quyết định gì cả.
    11 GB/ngày thô nghe thì nhiều cho tới khi bạn để ý rằng
    nó là 0,88 GB sau nén và thời hạn lưu của bạn là 7 ngày.
    Giữ tất cả thì đơn giản hơn mọi cái lỗi lấy mẫu.

100–1000 rps
  → lấy mẫu đuôi, một collector. Mọi lỗi, mọi cái chậm, 1% mốc.
    Đây là vùng ngọt mà lấy mẫu đuôi rõ ràng đáng với cái bộ
    phận chuyển động thêm vào.

&gt; 1000 rps
  → lấy mẫu đuôi với một trình xuất cân bằng tải, và giờ
    num_traces với decision_wait là những con số bạn phải chỉnh
    và theo dõi chứ không đặt một lần rồi thôi.

Hãy để ý hình dạng của lời khuyên đó: cả dịch vụ nhỏ nhất lẫn
lớn nhất đều có một câu trả lời đơn giản. Phần ở giữa mới là chỗ
bạn thật sự phải suy nghĩ.</code></pre>

<h3>Cái tỉ lệ luôn luôn sai</h3>
<pre><code>❌ Một tỉ lệ lấy mẫu đầu chọn để chạm một mức CHI PHÍ.

   "Ta chịu được 2 GB/ngày, vậy lấy mẫu 18%."

   Con số đó chẳng liên quan gì tới thứ bạn cần nhìn thấy.
   Nó sẽ giữ 18% cái lưu lượng bạn vốn đã hiểu và 18% những
   cú hỏng bạn không hiểu.

✅ Hãy làm ngược từ câu hỏi thay vì thế:

   "Tôi cần tra được request mà bất cứ người dùng nào báo lên."
    → giữ 100% số lỗi. Không cách nào khác chạy được.

   "Tôi cần thấy hình dạng của lưu lượng bình thường."
    → 1% làm mốc là thừa đủ. Bạn đang nhìn một phân bố, không
      phải nhìn một cá thể.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — trace đã lấy mẫu làm chỉ số cực tệ, và cái phép tính có vẻ chữa được điều đó lại giấu đi chính những cú hỏng.</strong> Đếm span để lấy tốc độ request hay tỉ lệ lỗi rất hấp dẫn vì dữ liệu nằm ngay đó, nhưng ở mức lấy mẫu 1% thì mọi con số đếm đều là 1% sự thật, nên người ta nhân ngược lên 100 lần. Cách đó chạy được với những con số tổng lưu lượng lớn và vỡ đúng ở chỗ quan trọng: <strong>một cái trace lỗi thành &quot;100 lỗi&quot;, và không cái trace lỗi nào thành &quot;0 lỗi&quot; cho một cú hỏng đang nổ mỗi phút.</strong> Đồ thị tỉ lệ lỗi dựng theo kiểu đó bị lượng tử hoá thành những bước nhảy 100 và phần lớn thời gian đọc ra số không. Chỉ số được đếm ở MỌI request, trước khi lấy mẫu, và đó là lý do chương 4 tồn tại như một trụ cột riêng — hãy dùng span để GIẢI THÍCH một con số, đừng bao giờ dùng nó để SINH RA một con số.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/sampling/" target="_blank" rel="noopener">
  <span class="lc-ico">🎲</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — lấy mẫu</span><span class="lc-sub">Đầu so với đuôi, các bộ lấy mẫu dựa-trên-cha giữ cho một quyết định phân tán nhất quán, và cách byte cờ mang nó đi.</span></span>
</a>
<a class="link-card dl" href="https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Bộ xử lý lấy mẫu đuôi</span><span class="lc-sub">Mọi loại chính sách, hệ quả bộ nhớ của decision_wait và num_traces, và yêu cầu cân bằng tải nêu trong bài này.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '6.4 — Reading a waterfall: five shapes|||6.4 — Đọc biểu đồ thác: năm hình dạng',
      slug: 'obs-6-4-doc-bieu-do-thac',
      type: 'VIDEO',
      description: 'N+1, tuần tự-đáng-lẽ-song-song, khoảng trống không giải thích được, và hai hình dạng nữa nhận ra ngay bằng mắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Reading a waterfall: five shapes</h2>
<p class="lead">Traces earn their cost in one specific way: certain performance bugs have a <em>visual</em> signature that is instantly recognisable and nearly impossible to see in logs or metrics. Learn five shapes and you diagnose most slow requests by looking rather than reasoning.</p>

<h3>Shape 1 — the staircase (N+1 queries)</h3>
<pre><code>GET /api/v1/notes ─────────────────────────────── 840ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ ... (96 more, identical name, ~8ms each)
  └─ response.serialise ─ 4ms

Twenty identical short bars in a row, then a hundred.
Each query is FAST. The problem is that there are 100.

  · logs:    100 lines that all look correct
  · metrics: db_query_duration p99 is 8ms — excellent
  · trace:   unmistakable at a glance

This is why an ORM makes N+1 easy to write: nothing is
slow, nothing errors, and the only symptom is the shape.

Fix: one query with an include/join. 840ms → ~20ms.</code></pre>

<h3>Shape 2 — the ladder (sequential work that could be parallel)</h3>
<pre><code>POST /api/v1/posts ────────────────────────────── 1240ms
  ├─ upload.toR2 ──────────── 380ms
  │                          └─ then ─┐
  ├─ image.generateThumbnail ─────────── 420ms
  │                                     └─ then ─┐
  ├─ embed.generate ──────────────────────────────── 390ms
  └─ prisma:query Post.create ── 12ms

Each bar STARTS where the previous one ENDED. Nothing
overlaps. 380 + 420 + 390 = 1190ms of the 1240ms.

Ask of each pair: does the second one need the first one's
result? Here the thumbnail needs the upload, but the
embedding needs only the text — it could have run from the
start.

  await Promise.all([uploadAndThumbnail(), embed(text)])

  1240ms → 800ms, no new infrastructure, one line.

The shape is the diagnosis. In logs this is five timestamps
you would have to subtract by hand.</code></pre>

<h3>Shape 3 — the gap (time nobody accounted for)</h3>
<pre><code>GET /api/v1/feed ──────────────────────────────── 2100ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Post.findMany ── 30ms
  │
  │        ← 1900ms of NOTHING. No span. No log line.
  │
  └─ response.serialise ─ 8ms

A gap means work happened that nothing is instrumented to
see. Three candidates, in order of likelihood:

  1. CPU work in JavaScript. Auto-instrumentation only
     sees I/O (lesson 6.2), so a sort over 50,000 rows or
     a JSON.stringify of a huge payload is invisible.
     Cross-check: event loop lag p99 spiked at the same
     moment (lesson 5.1). If it did, this is it.

  2. Waiting for a resource, not a service. A connection
     pool wait (lesson 5.4) produces exactly this: no span,
     because no query has started yet.

  3. A library nobody instrumented. sharp, ffmpeg, a
     native module. Add a manual span (lesson 6.2).

A gap is the most VALUABLE shape, because it is the one
that tells you your instrumentation has a hole — and the
hole is where your time is going.</code></pre>

<h3>Shape 4 — the long pole (one child owns everything)</h3>
<pre><code>POST /api/v1/notes ────────────────────────────── 3912ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ embed.generate ────────────────────────────── 3890ms
  │    └─ POST modelapi.vn ──────────────────────── 3889ms
  └─ response.serialise ─ 6ms

One bar is 99% of the trace, and it has exactly one child
that is 99.97% of IT. That nesting is the whole answer:
embed.generate is not slow, it is WAITING.

This is lesson 3.5's incident, and note what the trace adds
over the correlated logs: the logs told you the gateway took
3890ms. The trace tells you it was the ONLY thing, that
nothing ran in parallel with it, and therefore that moving
it off the request path recovers the entire 3.9 seconds.

The remedy follows from the shape: it is a leaf with no
siblings running alongside, so it is a candidate for the
queue that already exists in this repo.</code></pre>

<h3>Shape 5 — the fan-out that hides a straggler</h3>
<pre><code>GET /api/v1/dashboard ─────────────────────────── 1180ms
  ├─ prisma:query Note.count ──── 18ms
  ├─ prisma:query Post.count ──── 22ms
  ├─ prisma:query Course.count ── 19ms
  ├─ prisma:query Message.count ─────────────────── 1170ms  ← ★
  └─ prisma:query Media.count ─── 21ms

Five children running in PARALLEL — they all start at the
same x-position. Four are fast. One is not.

Parallelism means total time = the SLOWEST child, not the
sum. So Promise.all() has an important property: adding
more parallel work is free until one of them is slow, and
then that one work item costs you everything.

  · metrics: db_query_duration p99 is high — but WHICH
    query? The metric aggregates all five.
  · trace: the straggler has a name and a statement.

The fix is usually not "make Message.count faster" — it is
"why is a dashboard doing a COUNT(*) on the largest table",
which is a question the trace put in front of you.</code></pre>

<h3>The reading order that works</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sort by self time, not duration</span><span class="lz-d">Lesson 6.1's pitfall. The root is always the longest bar and is never the answer.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Look for repetition before looking for length</span><span class="lz-d">Shape 1 hides in plain sight because every individual bar is short. Count identical span names before you read any duration.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Check the left edges</span><span class="lz-d">All children starting at the same x means parallel (shape 5); staggered means sequential (shape 2). This one glance distinguishes two completely different fixes.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Account for every millisecond</span><span class="lz-d">Add up the children. If they do not cover the parent, you have shape 3, and the missing time is the most interesting thing on the screen.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a slow trace and a slow service are different problems, and one trace cannot tell them apart.</strong> Opening the slowest trace and finding a 4-second gateway call feels like a diagnosis, but a single trace is one sample: it cannot say whether that call is 4 seconds always, or 4 seconds for one unlucky request out of ten thousand. Fixing the second one is wasted work, and worse, the trace <em>looks</em> like proof, so the wasted work feels justified. The discipline is to move between pillars in both directions: <strong>a metric tells you a problem is real and how often; a trace tells you where it is; then a metric again confirms the fix moved the distribution rather than one sample.</strong> A trace-driven &quot;fix&quot; with no before-and-after percentile is an anecdote, and the p99 you were chasing will still be there.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/tempo/latest/getting-started/traces/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Grafana Tempo — reading traces</span><span class="lc-sub">The waterfall UI these shapes are drawn from, including how self time is displayed and how to jump from a span to its logs.</span></span>
</a>
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Prisma — relation queries and include</span><span class="lc-sub">The fix for shape 1: how include and select collapse a staircase of queries into one.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Đọc biểu đồ thác: năm hình dạng</h2>
<p class="lead">Trace kiếm lại cái giá của nó theo một cách rất cụ thể: một số lỗi hiệu năng có <em>chữ ký hình ảnh</em> nhận ra được ngay tức khắc và gần như không thể thấy trong log hay chỉ số. Học năm hình dạng thì bạn chẩn đoán được phần lớn request chậm bằng cách NHÌN chứ không phải bằng cách suy luận.</p>

<h3>Hình 1 — bậc thang (truy vấn N+1)</h3>
<pre><code>GET /api/v1/notes ─────────────────────────────── 840ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ prisma:query User.findUnique ─ 8ms
  ├─ ... (96 cái nữa, cùng tên, mỗi cái ~8ms)
  └─ response.serialise ─ 4ms

Hai mươi thanh ngắn y hệt nhau xếp hàng, rồi một trăm cái.
Mỗi truy vấn đều NHANH. Vấn đề là có tới 100 cái.

  · log:    100 dòng trông đều đúng cả
  · chỉ số: db_query_duration p99 là 8ms — xuất sắc
  · trace:  nhìn phát là biết

Đây là lý do một ORM làm cho N+1 dễ viết ra: chẳng có gì chậm,
chẳng có gì lỗi, và triệu chứng duy nhất là cái hình dạng.

Cách chữa: một truy vấn có include/join. 840ms → ~20ms.</code></pre>

<h3>Hình 2 — cái thang (việc tuần tự lẽ ra chạy song song được)</h3>
<pre><code>POST /api/v1/posts ────────────────────────────── 1240ms
  ├─ upload.toR2 ──────────── 380ms
  │                          └─ rồi ─┐
  ├─ image.generateThumbnail ────────── 420ms
  │                                    └─ rồi ─┐
  ├─ embed.generate ─────────────────────────────── 390ms
  └─ prisma:query Post.create ── 12ms

Mỗi thanh BẮT ĐẦU ở chỗ thanh trước KẾT THÚC. Không cái nào
chồng lấn. 380 + 420 + 390 = 1190ms trong tổng 1240ms.

Hãy hỏi từng cặp: cái thứ hai có cần kết quả của cái thứ nhất
không? Ở đây ảnh thu nhỏ cần lượt tải lên, nhưng embedding chỉ
cần phần chữ — nó lẽ ra đã chạy được ngay từ đầu.

  await Promise.all([uploadAndThumbnail(), embed(text)])

  1240ms → 800ms, không thêm hạ tầng gì, một dòng mã.

Cái hình dạng CHÍNH LÀ chẩn đoán. Trong log thì đây là năm dấu
thời gian mà bạn phải ngồi trừ bằng tay.</code></pre>

<h3>Hình 3 — khoảng trống (thời gian không ai giải trình được)</h3>
<pre><code>GET /api/v1/feed ──────────────────────────────── 2100ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Post.findMany ── 30ms
  │
  │        ← 1900ms KHÔNG CÓ GÌ. Không span. Không dòng log.
  │
  └─ response.serialise ─ 8ms

Một khoảng trống nghĩa là có việc đã xảy ra mà chẳng có bộ đo
đạc nào nhìn thấy. Ba ứng viên, xếp theo khả năng:

  1. Việc CPU trong JavaScript. Tự-đo-đạc chỉ thấy I/O (bài
     6.2), nên một phép sắp xếp trên 50.000 hàng hay một
     JSON.stringify của payload khổng lồ là vô hình.
     Đối chiếu: p99 độ trễ vòng lặp có vọt gai đúng lúc đó
     không (bài 5.1). Nếu có thì chính là nó.

  2. Chờ một TÀI NGUYÊN, không phải một dịch vụ. Chờ bể kết nối
     (bài 5.4) sinh ra đúng cái này: không span nào, vì chưa có
     truy vấn nào bắt đầu cả.

  3. Một thư viện không ai đo đạc. sharp, ffmpeg, một module
     native. Hãy thêm một span viết tay (bài 6.2).

Khoảng trống là hình dạng GIÁ TRỊ NHẤT, vì nó là cái nói cho bạn
biết bộ đo đạc của bạn có một lỗ thủng — và cái lỗ ấy chính là
chỗ thời gian của bạn đang chảy đi.</code></pre>

<h3>Hình 4 — cái cột dài (một đứa con chiếm hết)</h3>
<pre><code>POST /api/v1/notes ────────────────────────────── 3912ms
  ├─ auth.verifyJwt ─ 4ms
  ├─ prisma:query Note.findMany ── 12ms
  ├─ embed.generate ────────────────────────────── 3890ms
  │    └─ POST modelapi.vn ──────────────────────── 3889ms
  └─ response.serialise ─ 6ms

Một cái thanh chiếm 99% cả trace, và nó có đúng MỘT đứa con
chiếm 99,97% CỦA NÓ. Cái sự lồng nhau đó là toàn bộ câu trả lời:
embed.generate không chậm, nó đang CHỜ.

Đây là sự cố ở bài 3.5, và hãy để ý cái trace thêm được gì so
với log đã ghép: log nói cho bạn biết cổng mất 3890ms. Trace nói
cho bạn biết nó là thứ DUY NHẤT, rằng không có gì chạy song song
với nó, và do đó chuyển nó ra khỏi đường request thì lấy lại
được trọn 3,9 giây.

Cách chữa suy ra từ hình dạng: nó là một cái lá không có anh em
nào chạy cùng, nên nó là ứng viên cho cái hàng đợi vốn đã tồn
tại trong kho này.</code></pre>

<h3>Hình 5 — toả ra mà giấu một kẻ tụt hậu</h3>
<pre><code>GET /api/v1/dashboard ─────────────────────────── 1180ms
  ├─ prisma:query Note.count ──── 18ms
  ├─ prisma:query Post.count ──── 22ms
  ├─ prisma:query Course.count ── 19ms
  ├─ prisma:query Message.count ─────────────────── 1170ms  ← ★
  └─ prisma:query Media.count ─── 21ms

Năm đứa con chạy SONG SONG — chúng đều bắt đầu ở cùng một vị trí
ngang. Bốn cái nhanh. Một cái thì không.

Chạy song song nghĩa là tổng thời gian = đứa con CHẬM NHẤT, chứ
không phải tổng. Nên Promise.all() có một tính chất quan trọng:
thêm việc chạy song song thì miễn phí cho tới khi một cái trong
số chúng chậm, và lúc đó đúng cái việc ấy tính tiền bạn tất cả.

  · chỉ số: db_query_duration p99 cao — nhưng truy vấn NÀO?
    Cái chỉ số gộp cả năm cái lại.
  · trace: kẻ tụt hậu có tên và có câu lệnh.

Cách chữa thường không phải "làm Message.count nhanh hơn" — mà
là "vì sao một bảng tổng quan lại đi COUNT(*) trên cái bảng lớn
nhất", một câu hỏi mà cái trace đặt sẵn trước mặt bạn.</code></pre>

<h3>Thứ tự đọc chạy được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sắp xếp theo thời gian tự thân, không theo thời lượng</span><span class="lz-d">Cái bẫy ở bài 6.1. Span gốc luôn là thanh dài nhất và không bao giờ là câu trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tìm sự LẶP LẠI trước khi tìm độ DÀI</span><span class="lz-d">Hình 1 giấu mình ngay giữa thanh thiên bạch nhật vì từng cái thanh riêng lẻ đều ngắn. Hãy đếm số span trùng tên trước khi đọc bất cứ thời lượng nào.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nhìn các cạnh TRÁI</span><span class="lz-d">Mọi đứa con bắt đầu ở cùng vị trí ngang nghĩa là song song (hình 5); so le nghĩa là tuần tự (hình 2). Chỉ một cái liếc mắt này phân biệt hai cách chữa hoàn toàn khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Giải trình từng mili giây một</span><span class="lz-d">Hãy cộng các đứa con lại. Nếu chúng không phủ hết cái cha thì bạn đang có hình 3, và cái phần thời gian khuyết ấy là thứ thú vị nhất trên màn hình.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một trace chậm và một dịch vụ chậm là hai vấn đề khác nhau, và một cái trace không phân biệt được chúng.</strong> Mở cái trace chậm nhất ra rồi thấy một lời gọi cổng 4 giây thì có cảm giác như một chẩn đoán, nhưng một cái trace đơn lẻ là MỘT mẫu: nó không nói được lời gọi ấy luôn mất 4 giây, hay 4 giây cho một request xui xẻo trong mười nghìn cái. Chữa cái thứ hai là công cốc, mà tệ hơn là cái trace <em>trông như</em> bằng chứng, nên cái công cốc ấy lại có vẻ chính đáng. Kỷ luật ở đây là đi lại giữa các trụ cột theo cả hai chiều: <strong>một chỉ số nói cho bạn biết vấn đề là có thật và xảy ra bao nhiêu lần; một trace nói cho bạn nó ở đâu; rồi một chỉ số nữa xác nhận cách chữa đã dịch chuyển được cả PHÂN BỐ chứ không phải một cái mẫu.</strong> Một cách &quot;chữa&quot; dẫn dắt bởi trace mà không có phân vị trước-và-sau chỉ là một giai thoại, và cái p99 bạn đang đuổi theo vẫn sẽ còn nguyên đó.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/tempo/latest/getting-started/traces/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Grafana Tempo — đọc trace</span><span class="lc-sub">Giao diện biểu đồ thác mà năm hình dạng này vẽ theo, kể cả cách thời gian tự thân được hiển thị và cách nhảy từ một span sang các dòng log của nó.</span></span>
</a>
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Prisma — truy vấn quan hệ và include</span><span class="lc-sub">Cách chữa cho hình 1: include và select gộp một cái bậc thang truy vấn thành một truy vấn duy nhất thế nào.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '6.5 — When tracing is not worth it|||6.5 — Khi nào trace không đáng',
      slug: 'obs-6-5-khi-nao-khong-dang',
      type: 'VIDEO',
      description: 'Tính sổ trung thực cho một kho một-dịch-vụ, và bản trace-của-người-nghèo có 80% giá trị với 2% công sức.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>When tracing is not worth it</h2>
<p class="lead">This chapter has been arguing for tracing. Here is the honest case against it for a repository shaped like this one — because a course that only sells you things is not teaching you to decide.</p>

<h3>The bill, itemised</h3>
<pre><code>ONE-TIME
  · SDK setup, --import ordering, exporter config   half a day
  · A collector to run and keep running             a container
  · Learning to read a waterfall                    a few hours

ONGOING
  · 11.25 GB/day raw at 100% sampling (measured, 6.1)
  · The collector's RAM, if tail sampling
  · Every dependency upgrade can break an
    instrumentation patch, silently — the spans just
    stop appearing, and nothing alerts on their absence
  · A second place PII can leak (the db.statement
    pitfall in lesson 6.2)

WHAT IT ACTUALLY BUYS on ONE service
  · The five shapes from lesson 6.4
  · ...and that is genuinely most of it</code></pre>

<h3>The uncomfortable part</h3>
<pre><code>Tracing was designed for distributed systems. Its core value
proposition is "the request crossed eight services and you
cannot tell which one was slow".

This repository has one backend, one frontend, one database,
one cache, and calls to two external APIs. The request does
not cross eight services — it crosses two, and one of them
you do not control.

For the SINGLE-SERVICE case, most of what a trace tells you
is available more cheaply:

  N+1 queries       → Prisma query logging + a count.
                      Or just: log the query count per
                      request and alert above 20.
  Sequential work   → read the code. There are five awaits.
  The gateway is    → the outbound log line from lesson 3.3
  slow                already has host and ms.
  CPU gap           → event loop lag p99 (lesson 5.1)

Every one of those is a line you already wrote in chapters
1 through 5.</code></pre>

<h3>The poor man's trace: 80% of the value, 2% of the setup</h3>
<pre><code class="language-typescript">// src/utils/timings.ts — no SDK, no collector, no exporter
import { currentContext } from './requestContext.js';

export async function timed&lt;T&gt;(name: string, fn: () =&gt; Promise&lt;T&gt;): Promise&lt;T&gt; {
  const t = process.hrtime.bigint();
  try {
    return await fn();
  } finally {
    const ms = Number(process.hrtime.bigint() - t) / 1e6;
    const ctx = currentContext();
    if (ctx) (ctx.timings ??= []).push({ name, ms: Math.round(ms * 10) / 10 });
  }
}</code></pre>
<pre><code class="language-typescript">// One line in the request-completion log — chapter 1's line, extended
res.on('finish', () =&gt; {
  const ctx = currentContext();
  logger.info('request completed', {
    route, status: res.statusCode, ms: totalMs,
    timings: ctx?.timings,            // ← the whole thing
  });
});</code></pre>
<div class="out">{"ts":"2026-08-25T10:00:04.012Z","level":"info","msg":"request completed",
 "route":"/api/v1/notes","status":200,"ms":3912,"requestId":"V1StGXR8_Z5j",
 "timings":[{"name":"auth","ms":4},{"name":"db.notes","ms":12},
            {"name":"embed","ms":3890},{"name":"serialise","ms":6}]}</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It finds shape 4 and shape 2 immediately</span><span class="lz-d">The long pole and the sequential ladder are both obvious from a flat list of durations that sums to the total.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It finds shape 3, the gap, by subtraction</span><span class="lz-d">Sum the timings, compare to <code>ms</code>. A large remainder is unaccounted time — the most valuable finding in lesson 6.4, available from arithmetic.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It costs ~80 extra bytes on one log line</span><span class="lz-d">Against 2,796 bytes for a real trace. No collector, no SDK, no version-skew risk, and it rides along inside a log line you already ship.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">What it cannot do: nesting, parallelism, cross-service</span><span class="lz-d">Shapes 1 and 5 need the tree. And the moment there are two services, this stops working entirely — which is precisely the signal to adopt the real thing.</span></div>
</div>

<h3>The decision, stated as a rule</h3>
<pre><code>ADOPT OpenTelemetry when ANY of these is true:

  ✓ More than one service you wrote is in the request path.
    This is the real trigger. One service → the poor man's
    version. Two → traces, immediately.

  ✓ You argue with a vendor about latency. A trace with
    their span in it ends the argument; a log line saying
    "3890ms" does not.

  ✓ You have background workers whose failures are hard to
    tie back to what enqueued them (lesson 3.3, boundary 3).

  ✓ Someone will pay for a managed backend. Running Tempo
    or Jaeger yourself on the same 6GB VPS that had a
    disk-full outage is a real cost with a real risk.

DO NOT adopt it yet when:

  ✗ It would be the third observability system you have
    half-finished. Chapters 1–5 first. Complete beats
    comprehensive.

  ✗ You cannot name a question you have asked in the last
    month that a trace would have answered. Instrument for
    questions you have, not for coverage.</code></pre>

<h3>What this repository should actually do</h3>
<pre><code>1. The poor man's trace. Two files, forty lines, uses the
   AsyncLocalStorage context that lesson 3.2 already built.
   Ship it this week.

2. Prisma query COUNT per request as a log field. Six lines
   of middleware, and it catches every shape-1 staircase
   without any waterfall UI at all.

3. Revisit OTel when a second service appears — the TTS
   container is already a separate service, so the moment a
   request path routes through it, the trigger has fired.

That is not "tracing is bad". It is: the value of a trace
scales with the number of hops, and this repo has one.</code></pre>

<div class="pitfall">
<p><strong>Trap — the failure mode of tracing is not cost, it is a half-instrumented system that lies by omission.</strong> A trace that covers HTTP and Postgres but not sharp, ffmpeg or your own CPU-heavy code shows a request as 200 ms of database inside 2 seconds of wall clock — and the 1.8-second gap looks like the framework being slow rather than like missing instrumentation. That is bad enough, and it gets worse over time: an instrumentation patch silently stops matching after a dependency upgrade, so a span that used to appear simply does not, and <strong>nothing alerts on the absence of data you never explicitly asked for.</strong> The trace still renders, still looks complete, and now attributes that library's time to its parent. Either instrument the whole request path — including the manual spans from lesson 6.2 — or use the poor man's version, where the arithmetic makes every gap visible by construction.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/collector/deployment/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry Collector — deployment patterns</span><span class="lc-sub">Agent versus gateway, what each actually costs to run, and the sizing guidance behind this lesson's &quot;a container to keep running&quot;.</span></span>
</a>
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener">
  <span class="lc-ico">🪵</span>
  <span class="lc-body"><span class="lc-title">Prisma — query logging</span><span class="lc-sub">The event-based logger used for the per-request query count above, which catches N+1 without any tracing infrastructure.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Khi nào trace không đáng</h2>
<p class="lead">Cả chương này đã đi biện hộ cho trace. Đây là lý lẽ trung thực CHỐNG lại nó với một kho có hình dạng như kho này — vì một khoá học chỉ biết bán cho bạn thứ này thứ kia thì không dạy bạn cách quyết định.</p>

<h3>Hoá đơn, kê từng khoản</h3>
<pre><code>MỘT LẦN
  · Thiết lập SDK, thứ tự --import, cấu hình trình xuất   nửa ngày
  · Một collector phải chạy và phải duy trì                một container
  · Học đọc biểu đồ thác                                   vài giờ

THƯỜNG XUYÊN
  · 11,25 GB/ngày thô ở mức lấy mẫu 100% (đã đo, bài 6.1)
  · RAM của collector, nếu lấy mẫu đuôi
  · Mỗi lần nâng cấp phụ thuộc đều có thể làm hỏng một bản vá đo
    đạc, TRONG IM LẶNG — mấy cái span đơn giản là thôi xuất hiện,
    và chẳng có cảnh báo nào cho sự vắng mặt của chúng
  · Thêm một chỗ nữa dữ liệu cá nhân rò ra được (cái bẫy
    db.statement ở bài 6.2)

NÓ THẬT SỰ MUA ĐƯỢC GÌ trên MỘT dịch vụ
  · Năm hình dạng ở bài 6.4
  · ...và đó gần như là tất cả, nói thật</code></pre>

<h3>Phần khó chịu</h3>
<pre><code>Trace được thiết kế cho hệ thống phân tán. Giá trị cốt lõi của
nó là "request đi qua tám dịch vụ và bạn không biết cái nào chậm".

Kho này có một backend, một frontend, một cơ sở dữ liệu, một
cache, và các lời gọi tới hai API bên ngoài. Request không đi qua
tám dịch vụ — nó đi qua hai, và một trong hai thì bạn không
kiểm soát.

Với trường hợp MỘT DỊCH VỤ, phần lớn những gì một trace nói cho
bạn đều có sẵn với giá rẻ hơn:

  Truy vấn N+1      → log truy vấn của Prisma + một phép đếm.
                      Hoặc đơn giản: log số truy vấn mỗi request
                      rồi cảnh báo khi vượt 20.
  Việc tuần tự      → đọc mã. Có năm lệnh await.
  Cổng chậm         → dòng log lời-gọi-ra-ngoài ở bài 3.3 vốn đã
                      có sẵn host và ms.
  Khoảng trống CPU  → p99 độ trễ vòng lặp (bài 5.1)

Từng cái một trong số đó là một dòng bạn đã viết ở chương 1 tới 5.</code></pre>

<h3>Trace của người nghèo: 80% giá trị, 2% công thiết lập</h3>
<pre><code class="language-typescript">// src/utils/timings.ts — không SDK, không collector, không trình xuất
import { currentContext } from './requestContext.js';

export async function timed&lt;T&gt;(name: string, fn: () =&gt; Promise&lt;T&gt;): Promise&lt;T&gt; {
  const t = process.hrtime.bigint();
  try {
    return await fn();
  } finally {
    const ms = Number(process.hrtime.bigint() - t) / 1e6;
    const ctx = currentContext();
    if (ctx) (ctx.timings ??= []).push({ name, ms: Math.round(ms * 10) / 10 });
  }
}</code></pre>
<pre><code class="language-typescript">// Một dòng trong log kết-thúc-request — dòng của chương 1, mở rộng ra
res.on('finish', () =&gt; {
  const ctx = currentContext();
  logger.info('request completed', {
    route, status: res.statusCode, ms: totalMs,
    timings: ctx?.timings,            // ← toàn bộ nó nằm ở đây
  });
});</code></pre>
<div class="out">{"ts":"2026-08-25T10:00:04.012Z","level":"info","msg":"request completed",
 "route":"/api/v1/notes","status":200,"ms":3912,"requestId":"V1StGXR8_Z5j",
 "timings":[{"name":"auth","ms":4},{"name":"db.notes","ms":12},
            {"name":"embed","ms":3890},{"name":"serialise","ms":6}]}</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó tìm ra hình 4 và hình 2 ngay lập tức</span><span class="lz-d">Cái cột dài và cái thang tuần tự đều hiển nhiên từ một danh sách phẳng các thời lượng cộng lại bằng tổng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó tìm ra hình 3, cái khoảng trống, bằng phép trừ</span><span class="lz-d">Cộng các timings lại, so với <code>ms</code>. Phần dư lớn chính là thời gian không giải trình được — phát hiện giá trị nhất ở bài 6.4, có được bằng một phép tính số học.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó tốn thêm ~80 byte trên một dòng log</span><span class="lz-d">So với 2.796 byte cho một cái trace thật. Không collector, không SDK, không rủi ro lệch phiên bản, và nó đi ké bên trong một dòng log bạn vốn đã gửi đi.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cái nó không làm được: sự lồng nhau, tính song song, xuyên dịch vụ</span><span class="lz-d">Hình 1 và hình 5 cần cái cây. Và ngay khi có hai dịch vụ, cái này thôi chạy hoàn toàn — mà đó chính xác là tín hiệu để chuyển sang đồ thật.</span></div>
</div>

<h3>Quyết định, nêu thành một quy tắc</h3>
<pre><code>HÃY DÙNG OpenTelemetry khi BẤT CỨ điều nào sau đây đúng:

  ✓ Có nhiều hơn một dịch vụ do BẠN viết nằm trên đường request.
    Đây mới là cái kích hoạt thật. Một dịch vụ → bản của người
    nghèo. Hai → trace, ngay lập tức.

  ✓ Bạn hay tranh cãi với một nhà cung cấp về độ trễ. Một cái
    trace có span của họ trong đó chấm dứt cuộc tranh cãi; một
    dòng log ghi "3890ms" thì không.

  ✓ Bạn có worker chạy nền mà những cú hỏng của chúng khó buộc
    ngược về thứ đã xếp hàng chúng (bài 3.3, ranh giới 3).

  ✓ Có người chịu chi cho một backend dịch vụ. Tự chạy Tempo hay
    Jaeger trên đúng cái VPS 6GB từng có một sự cố đầy đĩa là một
    chi phí có thật kèm một rủi ro có thật.

ĐỪNG dùng nó vội khi:

  ✗ Nó sẽ là hệ thống quan sát thứ ba mà bạn làm dở dang. Chương
    1–5 trước đã. Xong hẳn thì hơn phủ rộng.

  ✗ Bạn không gọi tên được một câu hỏi bạn đã hỏi trong tháng vừa
    rồi mà một cái trace lẽ ra đã trả lời được. Hãy đo đạc cho
    những câu hỏi bạn CÓ, đừng đo đạc cho độ phủ.</code></pre>

<h3>Kho này thật sự nên làm gì</h3>
<pre><code>1. Trace của người nghèo. Hai file, bốn mươi dòng, dùng lại đúng
   cái ngữ cảnh AsyncLocalStorage mà bài 3.2 đã dựng. Đem lên
   trong tuần này.

2. ĐẾM số truy vấn Prisma mỗi request thành một trường log. Sáu
   dòng middleware, và nó bắt được mọi cái bậc thang hình-1 mà
   chẳng cần giao diện biểu đồ thác nào.

3. Xem lại chuyện OTel khi có dịch vụ thứ hai xuất hiện —
   container TTS vốn đã là một dịch vụ riêng, nên ngay khi một
   đường request đi xuyên qua nó, cái kích hoạt đã nổ rồi.

Đó không phải "trace là thứ tồi". Nó là: giá trị của một trace tỉ
lệ với số chặng, và kho này có một chặng.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — kiểu hỏng của việc trace không phải là chi phí, mà là một hệ thống đo đạc dở dang nói dối bằng cách BỎ SÓT.</strong> Một trace phủ được HTTP và Postgres nhưng không phủ sharp, ffmpeg hay chính đoạn mã nặng CPU của bạn sẽ hiện một request thành 200 ms cơ sở dữ liệu nằm trong 2 giây thời gian tường — và cái khoảng trống 1,8 giây kia trông như framework chậm chứ không trông như bộ đo đạc bị khuyết. Thế đã đủ tệ, và nó còn tệ thêm theo thời gian: một bản vá đo đạc âm thầm thôi khớp sau một lần nâng cấp phụ thuộc, nên một cái span vốn hay xuất hiện thì đơn giản là không xuất hiện nữa, và <strong>chẳng có cảnh báo nào cho sự VẮNG MẶT của thứ dữ liệu mà bạn chưa từng yêu cầu một cách tường minh.</strong> Cái trace vẫn vẽ ra, vẫn trông đầy đủ, và giờ gán thời gian của thư viện kia cho cái cha của nó. Hoặc là đo đạc trọn đường request — kể cả các span viết tay ở bài 6.2 — hoặc là dùng bản của người nghèo, nơi phép tính số học làm mọi khoảng trống hiện ra theo đúng thiết kế.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://opentelemetry.io/docs/collector/deployment/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry Collector — các kiểu triển khai</span><span class="lc-sub">Agent so với gateway, mỗi kiểu thật sự tốn gì để chạy, và hướng dẫn chọn cỡ đằng sau câu &quot;một container phải duy trì&quot; của bài này.</span></span>
</a>
<a class="link-card dl" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener">
  <span class="lc-ico">🪵</span>
  <span class="lc-body"><span class="lc-title">Prisma — log truy vấn</span><span class="lc-sub">Bộ logger dựa trên sự kiện dùng cho phép đếm truy vấn mỗi request ở trên, thứ bắt được N+1 mà không cần hạ tầng trace nào.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra chương 6',
      slug: 'obs-6-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về span, thứ tự khởi tạo, lấy mẫu, hình dạng biểu đồ thác và khi nào đừng dùng trace.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 6 · Quiz</span><h2>Six questions on tracing</h2><p class="lead">The last question has an answer that argues against the chapter. That is deliberate — knowing when not to adopt something is part of knowing it.</p></div><div class="ml-vi"><span class="eyebrow">Chương 6 · Kiểm tra</span><h2>Sáu câu về trace</h2><p class="lead">Câu cuối có một đáp án phản bác lại chính chương này. Đó là cố ý — biết khi nào KHÔNG nên dùng một thứ cũng là một phần của việc hiểu nó.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What does a trace show that correlated logs cannot?|||Một trace cho thấy điều gì mà log đã ghép không cho thấy được?',
            options: [
              'Nesting: parentSpanId turns a time-ordered list into a tree, so you can see which work CAUSED which, and whether two spans ran in parallel or in sequence. A list has order; it does not have structure, and the structure is where the answer lives.|||Sự lồng nhau: parentSpanId biến một danh sách xếp theo thời gian thành một cái cây, nên bạn thấy được việc nào GÂY RA việc nào, và hai span chạy song song hay tuần tự. Một danh sách có thứ tự; nó không có cấu trúc, mà cấu trúc mới là chỗ câu trả lời nằm.',
              'Higher timestamp precision than logs provide|||Độ chính xác dấu thời gian cao hơn log',
              'The ability to search by user id|||Khả năng tìm kiếm theo id người dùng',
              'Nothing — a trace is correlated logs in a different display|||Không gì cả — trace là log đã ghép hiển thị theo kiểu khác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must OpenTelemetry start via `node --import ./tracing.js` rather than a top-line import?|||Vì sao OpenTelemetry phải khởi động qua `node --import ./tracing.js` chứ không phải một dòng import ở đầu file?',
            options: [
              'Because auto-instrumentation patches modules as they load, and ESM hoists all imports before executing any module body — so express would be resolved and cached before tracing.js runs. Every express span would be missing while the setup looks correct. --import runs it in an earlier phase.|||Vì tự-đo-đạc vá module ngay lúc chúng được nạp, mà ESM CẨU mọi lệnh import lên trước khi thực thi thân của bất cứ module nào — nên express sẽ được phân giải và đưa vào bộ đệm trước khi tracing.js kịp chạy. Mọi span của express sẽ biến mất trong khi thiết lập trông vẫn đúng. --import chạy nó ở một pha sớm hơn.',
              'Because the SDK requires a separate process to run|||Vì SDK cần một tiến trình riêng để chạy',
              'Because --import gives the SDK more memory|||Vì --import cho SDK nhiều bộ nhớ hơn',
              'It does not matter; both work identically|||Không quan trọng; cả hai chạy y hệt nhau',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'With 1% head sampling, how often must a bug occur before you likely have a trace of it?|||Với lấy mẫu đầu 1%, một lỗi phải xảy ra bao nhiêu lần thì bạn mới có khả năng giữ được một trace của nó?',
            options: [
              '299 times, for a 95% chance of catching at least one — computed as log(0.05)/log(0.99). So a bug hitting ten users a day is invisible in traces for a month, and the single user who reports theirs had a 1% chance of being kept. Head sampling discards exactly the rare failures worth finding.|||299 lần, để có 95% cơ hội bắt được ít nhất một cái — tính bằng log(0,05)/log(0,99). Nên một lỗi đánh trúng mười người dùng mỗi ngày là vô hình trong trace suốt một tháng, và cái người dùng duy nhất báo lỗi thì trace của họ chỉ có 1% cơ hội được giữ. Lấy mẫu đầu vứt đi đúng những cú hỏng hiếm đáng tìm.',
              'Once — sampling is applied per user, not per request|||Một lần — việc lấy mẫu áp dụng theo người dùng, không theo request',
              'About 10 times, since 1% of 1000 is 10|||Khoảng 10 lần, vì 1% của 1000 là 10',
              '100 times, because 1/0.01 = 100 exactly|||100 lần, vì 1/0,01 = 100 chính xác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A waterfall shows twenty identical 8ms prisma:query spans in a row, then eighty more. What is it, and why did metrics miss it?|||Một biểu đồ thác hiện hai mươi span prisma:query 8ms y hệt nhau xếp hàng, rồi tám mươi cái nữa. Đó là gì, và vì sao chỉ số bỏ sót nó?',
            options: [
              'An N+1 query. Metrics missed it because db_query_duration p99 is 8 ms, which is excellent — every individual query is fast, and the only symptom is that there are a hundred of them. The trace makes it a shape you recognise instead of a number you have to derive.|||Một truy vấn N+1. Chỉ số bỏ sót vì db_query_duration p99 là 8 ms, tức là xuất sắc — từng truy vấn riêng lẻ đều nhanh, và triệu chứng duy nhất là có tới một trăm cái. Trace biến nó thành một HÌNH DẠNG bạn nhận ra được thay vì một con số bạn phải tự suy ra.',
              'A retry loop, which metrics would show as elevated error rate|||Một vòng lặp thử lại, thứ mà chỉ số sẽ hiện thành tỉ lệ lỗi tăng cao',
              'Connection pool exhaustion, visible in the waiting gauge|||Cạn bể kết nối, nhìn thấy được ở gauge waiting',
              'Normal behaviour — parallel queries always look like this|||Hành vi bình thường — truy vấn song song luôn trông như thế',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A trace shows a 1900ms gap with no span and no log line. What is the most likely cause, and what confirms it?|||Một trace hiện một khoảng trống 1900ms không có span, không có dòng log. Nguyên nhân khả dĩ nhất là gì, và cái gì xác nhận nó?',
            options: [
              'CPU work in JavaScript, because auto-instrumentation only sees I/O. Confirm it by checking whether event-loop lag p99 spiked at the same timestamp. The other candidates are a connection-pool wait (no query has started, so no span) or an uninstrumented native library.|||Việc CPU trong JavaScript, vì tự-đo-đạc chỉ thấy được I/O. Xác nhận bằng cách kiểm xem p99 độ trễ vòng lặp có vọt gai ở cùng dấu thời gian đó không. Hai ứng viên còn lại là chờ bể kết nối (chưa truy vấn nào bắt đầu nên không có span) hoặc một thư viện native không được đo đạc.',
              'Network latency, confirmed by the outbound span duration|||Độ trễ mạng, xác nhận bằng thời lượng của span gửi đi',
              'A dropped span, confirmed by the exporter queue size|||Một span bị vứt, xác nhận bằng kích thước hàng đợi của trình xuất',
              'Clock skew between the client and server|||Lệch đồng hồ giữa client và máy chủ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'For a single-service repository like this one, what is the honest recommendation?|||Với một kho một-dịch-vụ như kho này, khuyến nghị trung thực là gì?',
            options: [
              'Start with the poor man\'s trace: an array of {name, ms} accumulated in the AsyncLocalStorage context and emitted as one field on the request-completion log line. About 80 extra bytes against 2,796 for a real trace, and it catches the long pole, the sequential ladder and the unaccounted gap. Adopt OpenTelemetry when a second service you wrote enters the request path.|||Hãy bắt đầu bằng trace của người nghèo: một mảng {name, ms} tích luỹ trong ngữ cảnh AsyncLocalStorage rồi phát ra thành một trường trên dòng log kết-thúc-request. Khoảng 80 byte thêm so với 2.796 byte của một trace thật, và nó bắt được cái cột dài, cái thang tuần tự và cái khoảng trống không giải trình được. Hãy dùng OpenTelemetry khi một dịch vụ thứ hai do bạn viết bước vào đường request.',
              'Adopt full OpenTelemetry immediately — coverage is always worth it|||Dùng trọn bộ OpenTelemetry ngay — độ phủ thì lúc nào cũng đáng',
              'Skip tracing entirely; logs and metrics answer everything|||Bỏ hẳn trace; log và chỉ số trả lời được mọi thứ',
              'Use 0.1% head sampling to keep the cost near zero|||Dùng lấy mẫu đầu 0,1% để giữ chi phí gần bằng không',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
