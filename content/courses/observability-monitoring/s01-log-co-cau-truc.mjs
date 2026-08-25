/**
 * Observability — Chương 1 — Log có cấu trúc, và cái giá của nó.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 1 — Structured logs, and what they cost|||Chương 1 — Log có cấu trúc, và cái giá của nó',
  slug: 'obs-ch1-log',
  description: 'Năm bài: từ console.log tới một dòng JSON, cái gì thuộc về một dòng log, mức log, chi phí thật đo được, và stdout là một cái ống có thể đầy.',
  sortOrder: 2,
  lessons: [

    {
      title: '1.1 — From console.log to a line a machine can read|||1.1 — Từ console.log tới một dòng máy đọc được',
      slug: 'obs-1-1-tu-console-toi-json',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cùng một sự kiện, viết theo hai cách, và chỉ một cách trả lời được câu hỏi "cho tôi mọi lần thất bại của người dùng này".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>From console.log to a line a machine can read</h2>
<p class="lead">A log line has two audiences and they want opposite things. A human reading a terminal wants prose. A query engine reading a million lines wants fields. The whole of structured logging is the decision to serve the second audience, and to let a formatter serve the first.</p>

<h3>The same event, written two ways</h3>
<pre><code class="language-javascript">// Prose — readable, and unqueryable
console.log(\`User \${user.id} failed to upload \${file.name} (\${file.size} bytes) after \${ms}ms\`)
// → User u_8f3a failed to upload báo-cáo.pdf (4194304 bytes) after 8412ms

// Structured — one JSON object per line
logger.error('upload failed', {
  userId: user.id,
  file: file.name,
  bytes: file.size,
  ms,
})
// → {"ts":"2026-08-25T10:14:02.881Z","level":"error","msg":"upload failed",
//    "userId":"u_8f3a","file":"báo-cáo.pdf","bytes":4194304,"ms":8412}
</code></pre>
<p>Both lines contain the same five facts. The difference appears the moment you have a hundred thousand of them and want to answer a question.</p>

<h3>The questions each form can answer</h3>
<pre><code>Question                                     Prose            Structured
───────────────────────────────────────────  ───────────────  ──────────────
"Show me this user's failures"               grep u_8f3a      userId="u_8f3a"
"Which uploads took over 5 seconds?"         impossible*      ms &gt; 5000
"Average upload size for failures?"          impossible*      avg(bytes)
"Failures per hour, as a graph"              impossible*      count by hour
"Did báo-cáo.pdf fail more than once?"       grep, carefully  file="báo-cáo.pdf"

* possible with a regex that re-parses the sentence — until someone
  edits the wording, at which point every saved query breaks silently.</code></pre>
<p>The starred rows are the argument. You <em>can</em> extract a number from prose with a regular expression, and it works until the sentence changes. Someone rewords &quot;after 8412ms&quot; to &quot;in 8.4s&quot; during a refactor, every dashboard built on that regex goes to zero, and nothing errors — the query still runs, it just matches nothing. A field named <code>ms</code> cannot be reworded by accident.</p>

<h3>What this repository actually emits</h3>
<p><code>src/utils/logger.ts</code> is forty lines and does exactly one interesting thing: it switches format by environment.</p>
<pre><code class="language-typescript">const record = {
  ts: new Date().toISOString(),
  level,
  msg: message,
  ...(context || {}),
};
const line = config.nodeEnv === 'production'
  ? JSON.stringify(record)
  : \`[\${record.ts}] \${level.toUpperCase().padEnd(5)} \${message}\`
    + (context ? ' ' + JSON.stringify(context) : '');
</code></pre>
<div class="out">// production
{"ts":"2026-06-23T03:49:35.789Z","level":"info","msg":"Database connected","elapsedMs":12}
{"ts":"2026-06-23T03:49:36.043Z","level":"info","msg":"CuongHoangDev API running","port":3001,"env":"production"}

// development
[2026-06-23T03:34:13.358Z] INFO  Sentry initialized {"environment":"production"}
[2026-06-23T03:34:15.144Z] ERROR Database connection failed {"error":"Can't reach database server..."}</div>
<p>This is the right shape, and it is worth naming why: the <em>fields are the same in both modes</em>. Development only changes the rendering. A logger that drops fields in development is a logger that lets you ship a log line whose production form you have never seen.</p>

<h3>The three fields that must never move</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ts — when</span><span class="lz-d">ISO 8601, in UTC, always. A local-time log is unreadable the moment two machines are in different zones, and unsortable when one crosses a DST boundary.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">level — how much you care</span><span class="lz-d">One of a fixed set. Lesson 1.3 is entirely about why the set has to be small and what each value promises.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">msg — a stable event name</span><span class="lz-d">&quot;upload failed&quot;, not &quot;Upload of báo-cáo.pdf failed after 8412ms&quot;. The message identifies the <em>kind</em> of event; the variable parts belong in fields.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">…everything else is context</span><span class="lz-d">Spread in from the caller. This is the part that makes the line queryable, and lesson 1.2 is about choosing it.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — interpolating variables into <code>msg</code>, which makes every line a unique event.</strong> Writing <code>logger.info(&#96;upload failed for \${user.id}&#96;)</code> produces a different <code>msg</code> for every user, so the field that was supposed to <em>group</em> events instead splits them into thousands of one-off strings. Every consequence follows from that: you cannot count occurrences of an event type, alerting on &quot;more than 10 upload failures per minute&quot; has nothing to match on, and error-grouping tools like Sentry create a separate issue per user. Keep <code>msg</code> constant per call site and put the variable in a field — the same discipline that makes metric labels work in chapter 4.</p>
</div>

<h3>The cost of the change</h3>
<p>Structured logging is not free, and this course will not pretend otherwise: lesson 1.4 measures a JSON line at 571 ns against 19 ns for string concatenation, roughly thirty times more. Whether that matters depends entirely on how many lines per request you emit, which is the subject of lesson 1.2 — and on where stdout is pointing, which is lesson 1.5 and is the part that actually takes services down.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://getpino.io/#/docs/api" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">Pino — API documentation</span><span class="lc-sub">The de-facto structured logger for Node, and a good reference for the field conventions this lesson describes.</span></span>
</a>
<a class="link-card dl" href="https://jsonlines.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">JSON Lines (NDJSON)</span><span class="lc-sub">The one-object-per-line format this repo emits, and the reason a log file stays streamable and greppable.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Từ console.log tới một dòng máy đọc được</h2>
<p class="lead">Một dòng log có hai loại độc giả và họ muốn hai thứ trái ngược. Một con người đọc terminal thì muốn văn xuôi. Một máy truy vấn đọc một triệu dòng thì muốn các trường dữ liệu. Toàn bộ chuyện log có cấu trúc là cái quyết định phục vụ loại độc giả thứ hai, và để một bộ định dạng phục vụ loại thứ nhất.</p>

<h3>Cùng một sự kiện, viết theo hai cách</h3>
<pre><code class="language-javascript">// Văn xuôi — đọc được, và không truy vấn được
console.log(\`User \${user.id} failed to upload \${file.name} (\${file.size} bytes) after \${ms}ms\`)
// → User u_8f3a failed to upload báo-cáo.pdf (4194304 bytes) after 8412ms

// Có cấu trúc — mỗi dòng một object JSON
logger.error('upload failed', {
  userId: user.id,
  file: file.name,
  bytes: file.size,
  ms,
})
// → {"ts":"2026-08-25T10:14:02.881Z","level":"error","msg":"upload failed",
//    "userId":"u_8f3a","file":"báo-cáo.pdf","bytes":4194304,"ms":8412}
</code></pre>
<p>Cả hai dòng đều chứa cùng năm dữ kiện. Khác biệt lộ ra ngay khi bạn có một trăm nghìn dòng như thế và muốn trả lời một câu hỏi.</p>

<h3>Mỗi dạng trả lời được những câu nào</h3>
<pre><code>Câu hỏi                                      Văn xuôi         Có cấu trúc
───────────────────────────────────────────  ───────────────  ──────────────
"Cho tôi các lần hỏng của người dùng này"    grep u_8f3a      userId="u_8f3a"
"Lần upload nào quá 5 giây?"                 không được*      ms &gt; 5000
"Cỡ file trung bình của các lần hỏng?"       không được*      avg(bytes)
"Số lần hỏng mỗi giờ, vẽ thành biểu đồ"      không được*      count by hour
"báo-cáo.pdf có hỏng quá một lần không?"     grep, cẩn thận   file="báo-cáo.pdf"

* làm được bằng một regex phân tích lại câu văn — cho tới khi có người
  sửa cách diễn đạt, và lúc đó mọi truy vấn đã lưu hỏng lặng lẽ.</code></pre>
<p>Những dòng có dấu sao chính là lập luận. Bạn <em>có thể</em> rút một con số ra khỏi văn xuôi bằng biểu thức chính quy, và nó chạy được cho tới khi câu văn đổi. Có người sửa &quot;after 8412ms&quot; thành &quot;in 8.4s&quot; trong một lần tái cấu trúc, mọi bảng theo dõi dựng trên regex đó tụt về không, và chẳng gì báo lỗi — truy vấn vẫn chạy, chỉ là chẳng khớp gì cả. Một trường tên <code>ms</code> thì không thể bị vô tình đổi cách diễn đạt.</p>

<h3>Kho này thật sự phát ra cái gì</h3>
<p><code>src/utils/logger.ts</code> dài bốn mươi dòng và làm đúng một việc đáng chú ý: nó đổi định dạng theo môi trường.</p>
<pre><code class="language-typescript">const record = {
  ts: new Date().toISOString(),
  level,
  msg: message,
  ...(context || {}),
};
const line = config.nodeEnv === 'production'
  ? JSON.stringify(record)
  : \`[\${record.ts}] \${level.toUpperCase().padEnd(5)} \${message}\`
    + (context ? ' ' + JSON.stringify(context) : '');
</code></pre>
<div class="out">// production
{"ts":"2026-06-23T03:49:35.789Z","level":"info","msg":"Database connected","elapsedMs":12}
{"ts":"2026-06-23T03:49:36.043Z","level":"info","msg":"CuongHoangDev API running","port":3001,"env":"production"}

// development
[2026-06-23T03:34:13.358Z] INFO  Sentry initialized {"environment":"production"}
[2026-06-23T03:34:15.144Z] ERROR Database connection failed {"error":"Can't reach database server..."}</div>
<p>Đây là hình dạng đúng, và đáng gọi tên lý do: <em>các trường dữ liệu giống hệt nhau ở cả hai chế độ</em>. Môi trường phát triển chỉ đổi cách hiển thị. Một logger làm rơi mất trường ở môi trường phát triển là một logger cho phép bạn ship một dòng log mà bạn chưa từng nhìn thấy dạng production của nó.</p>

<h3>Ba trường không bao giờ được xê dịch</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ts — khi nào</span><span class="lz-d">ISO 8601, theo UTC, luôn luôn. Một dòng log theo giờ địa phương là không đọc nổi ngay khi có hai máy ở hai múi giờ, và không sắp xếp nổi khi một máy vắt qua ranh giới đổi giờ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">level — bạn quan tâm tới mức nào</span><span class="lz-d">Một trong một tập cố định. Bài 1.3 nói trọn vẹn về việc vì sao cái tập đó phải nhỏ và mỗi giá trị hứa hẹn điều gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">msg — một tên sự kiện ỔN ĐỊNH</span><span class="lz-d">&quot;upload failed&quot;, không phải &quot;Upload of báo-cáo.pdf failed after 8412ms&quot;. Thông điệp định danh <em>loại</em> sự kiện; phần thay đổi thuộc về các trường.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">…còn lại đều là ngữ cảnh</span><span class="lz-d">Trải vào từ chỗ gọi. Đây là phần làm cho dòng log truy vấn được, và bài 1.2 nói về việc chọn nó.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — nội suy biến vào <code>msg</code>, biến mỗi dòng thành một sự kiện độc nhất.</strong> Viết <code>logger.info(&#96;upload failed for \${user.id}&#96;)</code> sinh ra một <code>msg</code> khác nhau cho mỗi người dùng, nên cái trường lẽ ra để <em>gom nhóm</em> sự kiện lại đi xé chúng thành hàng nghìn chuỗi dùng một lần. Mọi hệ quả đều theo sau từ đó: bạn không đếm nổi số lần xảy ra của một loại sự kiện, một cảnh báo kiểu &quot;quá 10 lần upload hỏng mỗi phút&quot; chẳng có gì để khớp vào, và các công cụ gom nhóm lỗi như Sentry tạo ra một issue riêng cho mỗi người dùng. Hãy giữ <code>msg</code> cố định theo từng chỗ gọi và đặt phần biến thiên vào một trường — đúng cái kỷ luật làm cho nhãn của chỉ số chạy được ở chương 4.</p>
</div>

<h3>Cái giá của việc đổi sang</h3>
<p>Log có cấu trúc không miễn phí, và khoá này sẽ không giả vờ ngược lại: bài 1.4 đo một dòng JSON ở 571 ns so với 19 ns cho phép nối chuỗi, gấp khoảng ba mươi lần. Chuyện đó có đáng kể hay không phụ thuộc hoàn toàn vào việc bạn phát ra bao nhiêu dòng mỗi request, thứ mà bài 1.2 nói tới — và vào chỗ stdout đang trỏ vào, thứ là bài 1.5 và là phần thật sự hạ được dịch vụ.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://getpino.io/#/docs/api" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">Pino — Tài liệu API</span><span class="lc-sub">Bộ log có cấu trúc gần như tiêu chuẩn của Node, và là tài liệu tra cứu tốt cho các quy ước trường mà bài này mô tả.</span></span>
</a>
<a class="link-card dl" href="https://jsonlines.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">JSON Lines (NDJSON)</span><span class="lc-sub">Định dạng mỗi-dòng-một-object mà kho này phát ra, và lý do một file log vẫn truyền được theo luồng và grep được.</span></span>
</a>
</div>
`,
    },

    {
      title: '1.2 — What belongs on a log line, and what does not|||1.2 — Cái gì thuộc về một dòng log, và cái gì không',
      slug: 'obs-1-2-cai-gi-thuoc-ve',
      type: 'VIDEO',
      description: 'Ba câu hỏi quyết định mọi trường, và một danh sách những thứ không bao giờ được ghi ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What belongs on a log line, and what does not</h2>
<p class="lead">Choosing fields feels like a style question and is actually a cost and a security question. Every field you add is paid for on every occurrence of that event, forever, and a few of them are paid for in a breach notification.</p>

<h3>Three questions that decide every field</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Will you filter on it?</span><span class="lz-t">Then it is a field</span><span class="lz-d">userId, route, statusCode, tenantId, jobId. If you can imagine typing <code>field = value</code> during an incident, it earns its place.</span></div>
  <div class="lz-node"><span class="lz-k">Will you aggregate on it?</span><span class="lz-t">Then it is a field, and numeric</span><span class="lz-d">ms, bytes, rows, retries. Store the number, never a pre-formatted string — <code>&quot;8.4s&quot;</code> cannot be averaged and <code>8412</code> can.</span></div>
  <div class="lz-node"><span class="lz-k">Is it the same on every line?</span><span class="lz-t">Then it belongs on the stream, not the line</span><span class="lz-d">service name, host, version, environment. Attaching them per line multiplies your storage bill by the length of the strings, for information the shipper can add once.</span></div>
  <div class="lz-node"><span class="lz-k">Could it identify a person?</span><span class="lz-t">Then think again</span><span class="lz-d">Email, phone, full name, IP, precise location. An id is enough to join to the user record; the personal data does not need to be in a log that a dozen people can read.</span></div>
</div>

<h3>Never, under any circumstances</h3>
<pre><code>Never log                     Why not                     Log instead
────────────────────────────  ──────────────────────────  ─────────────────────
Passwords, even hashed        Hash + known email = attack  nothing
Session tokens, JWTs, cookies Replayable until expiry      token id / jti
API keys, DB URLs             Grants access, permanently   key name / provider
Full request bodies           Contains all of the above    field names only
Authorization headers         The token, verbatim          the auth scheme
Card numbers, national ids    Regulated in most countries  last four, if you must</code></pre>
<p>The middle column is the reason each rule is absolute rather than a preference. A log store is a lower-security system than the one that produced it: it is read by more people, retained for longer, replicated to more places, and exported to vendors. A secret that reaches it should be assumed compromised — which is why the correct response to &quot;we logged a token by accident&quot; is to rotate the token, not to delete the log line.</p>

<h3>How the accident usually happens</h3>
<pre><code class="language-javascript">// This looks careful, and logs the password
logger.info('login attempt', { body: req.body })

// This looks careful, and logs the Authorization header
logger.error('upstream failed', { config: err.config })

// This looks careful, and logs everything the ORM knows about the user
logger.debug('user loaded', { user })
</code></pre>
<p>Nobody writes <code>logger.info('password', pw)</code>. The leaks come from logging an object whose contents you did not enumerate — a request body, an Axios error config, an ORM model. The rule that prevents all three is the same: <strong>list the fields you want; never spread an object you did not build.</strong></p>

<h3>What this repo's Sentry service does, and why the same idea applies to logs</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts — the intent, in its own comment
// - **Privacy first**: we strip cookies, authorization headers,
//   and request bodies before sending them to Sentry. PII like
//   passwords, JWTs, and email addresses is never included in
//   event payloads.
sendDefaultPii: false,
</code></pre>
<p>The Sentry path in this codebase has an explicit scrubbing step. The logger has none — it serialises whatever context object the caller passes. That asymmetry is worth noticing: the same repository is careful with the error reporter and unguarded with the log line, and both end up in systems other people can read.</p>

<div class="pitfall">
<p><strong>Trap — a field that is unbounded in size, quietly dominating your log bill.</strong> Logging <code>{ items }</code> for a request that returned a hundred rows writes a hundred objects onto one line. It is invisible in development, where the array has three entries, and it is the whole cost in production, where the same line is now forty kilobytes and is written on every request. The failure is not an error — it is a log volume graph that grows faster than traffic, and a search that gets slower every week. Log <code>{ itemCount: items.length }</code> and, if you genuinely need the contents, log the ids: bounded, joinable, and three orders of magnitude smaller.</p>
</div>

<h3>A worked example: one route, before and after</h3>
<pre><code class="language-javascript">// Before: two lines, one useless, one dangerous
logger.info('creating note')
logger.info('note created', { note, user: req.user })

// After: one line, bounded, queryable, safe
logger.info('note created', {
  noteId: note.id,
  userId: req.user.id,
  bytes: note.body.length,
  tagCount: note.tags.length,
  ms: Date.now() - started,
})
</code></pre>
<p>The &quot;before&quot; version cannot answer a single operational question and can leak the user&#39;s email. The &quot;after&quot; version answers &quot;how big are the notes people actually write&quot;, &quot;which users are slowest&quot; and &quot;did creation get slower after the deploy&quot;, and contains nothing that would matter if the log store were read by someone who should not have it.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Logging Cheat Sheet</span><span class="lc-sub">What to log, what never to log, and the attacks that target the log store itself.</span></span>
</a>
<a class="link-card dl" href="https://gdpr.eu/eu-gdpr-personal-data/" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">GDPR — what counts as personal data</span><span class="lc-sub">Broader than most people assume; an IP address and a user id both qualify in context.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Cái gì thuộc về một dòng log, và cái gì không</h2>
<p class="lead">Chọn trường dữ liệu nghe như chuyện phong cách mà thật ra là chuyện chi phí và chuyện an toàn. Mỗi trường bạn thêm vào đều được trả tiền ở mọi lần sự kiện đó xảy ra, mãi mãi, và vài trường trong số đó được trả bằng một thông báo rò rỉ dữ liệu.</p>

<h3>Ba câu hỏi quyết định mọi trường</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Bạn có LỌC theo nó không?</span><span class="lz-t">Thì nó là một trường</span><span class="lz-d">userId, route, statusCode, tenantId, jobId. Nếu bạn hình dung được cảnh gõ <code>trường = giá trị</code> lúc đang có sự cố thì nó xứng chỗ.</span></div>
  <div class="lz-node"><span class="lz-k">Bạn có TỔNG HỢP theo nó không?</span><span class="lz-t">Thì nó là một trường, và phải là số</span><span class="lz-d">ms, bytes, rows, retries. Hãy lưu con số, đừng bao giờ lưu một chuỗi đã định dạng sẵn — <code>&quot;8.4s&quot;</code> không lấy trung bình được còn <code>8412</code> thì được.</span></div>
  <div class="lz-node"><span class="lz-k">Nó có giống nhau ở MỌI dòng không?</span><span class="lz-t">Thì nó thuộc về luồng, không thuộc về dòng</span><span class="lz-d">Tên dịch vụ, tên máy, phiên bản, môi trường. Gắn chúng vào từng dòng là nhân hoá đơn lưu trữ lên theo độ dài các chuỗi đó, cho một thông tin mà trình gửi log thêm vào một lần là xong.</span></div>
  <div class="lz-node"><span class="lz-k">Nó có định danh được một con người không?</span><span class="lz-t">Thì hãy nghĩ lại</span><span class="lz-d">Email, số điện thoại, họ tên đầy đủ, IP, vị trí chính xác. Một cái id là đủ để nối sang bản ghi người dùng; dữ liệu cá nhân không cần nằm trong một cuốn log mà cả chục người đọc được.</span></div>
</div>

<h3>Không bao giờ, trong bất kỳ hoàn cảnh nào</h3>
<pre><code>Đừng bao giờ log            Vì sao không                 Hãy log thứ này
──────────────────────────  ───────────────────────────  ─────────────────────
Mật khẩu, kể cả đã băm      Hash + email đã biết = tấn công  không gì cả
Token phiên, JWT, cookie    Phát lại được tới khi hết hạn    id của token / jti
Khoá API, URL cơ sở dữ liệu Cấp quyền truy cập, vĩnh viễn    tên khoá / nhà cung cấp
Toàn bộ thân request        Chứa tất cả những thứ trên       chỉ tên các trường
Header Authorization        Chính cái token, nguyên văn      lược đồ xác thực
Số thẻ, số định danh cá nhân Bị quản lý ở phần lớn quốc gia  bốn số cuối, nếu buộc phải</code></pre>
<p>Cột giữa là lý do mỗi luật ở đây là tuyệt đối chứ không phải một sở thích. Một kho log là một hệ thống có mức an toàn THẤP HƠN cái hệ thống sinh ra nó: nhiều người đọc hơn, giữ lâu hơn, nhân bản ra nhiều nơi hơn, và xuất sang cho các nhà cung cấp. Một bí mật lọt vào đó nên được coi là đã bị lộ — và đó là lý do phản ứng đúng với câu &quot;bọn mình lỡ log một cái token&quot; là XOAY token đó, chứ không phải đi xoá dòng log.</p>

<h3>Tai nạn thường xảy ra như thế nào</h3>
<pre><code class="language-javascript">// Cái này trông có vẻ cẩn thận, và nó log cả mật khẩu
logger.info('login attempt', { body: req.body })

// Cái này trông có vẻ cẩn thận, và nó log cả header Authorization
logger.error('upstream failed', { config: err.config })

// Cái này trông có vẻ cẩn thận, và nó log mọi thứ ORM biết về người dùng
logger.debug('user loaded', { user })
</code></pre>
<p>Chẳng ai viết <code>logger.info('password', pw)</code> cả. Các vụ rò rỉ đến từ việc log một object mà bạn chưa liệt kê ra nội dung của nó — một thân request, một object config lỗi của Axios, một model của ORM. Luật ngăn được cả ba là như nhau: <strong>hãy liệt kê những trường bạn muốn; đừng bao giờ trải một object mà bạn không tự tay dựng lên.</strong></p>

<h3>Dịch vụ Sentry của kho này làm gì, và vì sao cùng ý đó áp cho log</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts — ý định, nằm ngay trong comment của nó
// - **Privacy first**: we strip cookies, authorization headers,
//   and request bodies before sending them to Sentry. PII like
//   passwords, JWTs, and email addresses is never included in
//   event payloads.
sendDefaultPii: false,
</code></pre>
<p>Đường đi Sentry trong kho mã này có một bước tẩy dữ liệu tường minh. Cái logger thì không có — nó tuần tự hoá đúng cái object ngữ cảnh mà chỗ gọi truyền vào. Sự bất đối xứng đó đáng để ý: cùng một kho lại cẩn thận với bộ báo lỗi và để ngỏ với dòng log, mà cả hai đều kết thúc trong những hệ thống người khác đọc được.</p>

<div class="pitfall">
<p><strong>Bẫy — một trường không có giới hạn kích thước, lặng lẽ chiếm trọn hoá đơn log của bạn.</strong> Log <code>{ items }</code> cho một request trả về một trăm dòng là ghi một trăm object lên một dòng log. Nó vô hình ở môi trường phát triển, nơi cái mảng có ba phần tử, và nó là toàn bộ chi phí trên production, nơi cùng dòng đó giờ nặng bốn mươi kilobyte và được ghi ở mọi request. Cú hỏng không phải một cái lỗi — nó là một biểu đồ khối lượng log lớn nhanh hơn cả lưu lượng, và một phép tìm kiếm chậm dần mỗi tuần. Hãy log <code>{ itemCount: items.length }</code>, và nếu thật sự cần nội dung thì log các id: có giới hạn, nối được, và nhỏ hơn ba bậc độ lớn.</p>
</div>

<h3>Một ví dụ làm thật: một route, trước và sau</h3>
<pre><code class="language-javascript">// Trước: hai dòng, một dòng vô dụng, một dòng nguy hiểm
logger.info('creating note')
logger.info('note created', { note, user: req.user })

// Sau: một dòng, có giới hạn, truy vấn được, an toàn
logger.info('note created', {
  noteId: note.id,
  userId: req.user.id,
  bytes: note.body.length,
  tagCount: note.tags.length,
  ms: Date.now() - started,
})
</code></pre>
<p>Bản &quot;trước&quot; không trả lời nổi một câu hỏi vận hành nào và có thể làm rò email của người dùng. Bản &quot;sau&quot; trả lời được &quot;ghi chú người ta thật sự viết dài cỡ nào&quot;, &quot;người dùng nào chậm nhất&quot; và &quot;việc tạo ghi chú có chậm đi sau lần deploy không&quot;, mà chẳng chứa gì đáng ngại nếu kho log bị một người lẽ ra không được phép đọc.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Bản tra cứu về Logging</span><span class="lc-sub">Nên log gì, không bao giờ được log gì, và những cuộc tấn công nhắm vào chính cái kho log.</span></span>
</a>
<a class="link-card dl" href="https://gdpr.eu/eu-gdpr-personal-data/" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">GDPR — cái gì được tính là dữ liệu cá nhân</span><span class="lc-sub">Rộng hơn phần lớn người ta tưởng; một địa chỉ IP và một id người dùng đều đủ điều kiện tuỳ ngữ cảnh.</span></span>
</a>
</div>
`,
    },

    {
      title: '1.3 — Levels, and why everyone gets them wrong|||1.3 — Mức log, và vì sao ai cũng dùng sai',
      slug: 'obs-1-3-muc-log',
      type: 'VIDEO',
      description: 'Bốn mức, mỗi mức là một lời hứa với người đọc. Ba lời hứa đó bị phá liên tục, và bài này nói chính xác cách chữa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Levels, and why everyone gets them wrong</h2>
<p class="lead">A level is not a measure of how interesting a line is. It is a promise about what the reader should do when they see it, and levels stop working the moment that promise is broken — which happens in almost every codebase, in exactly three ways.</p>

<h3>Four levels, four promises</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">error — something failed, and a human may need to act</span><span class="lz-lnote">A request that could not be served, a job that will not retry, data that is now inconsistent. If nobody would ever act on it, it is not an error.</span></div>
  <div class="lz-layer"><span class="lz-lname">warn — it worked, but something is off</span><span class="lz-lnote">A fallback was used, a retry succeeded, a deprecated path was taken, a quota is near. Nobody acts now; someone should notice a trend.</span></div>
  <div class="lz-layer"><span class="lz-lname">info — a business event happened</span><span class="lz-lnote">Order placed, user registered, deploy started, job completed. One line per meaningful thing, not one per function call.</span></div>
  <div class="lz-layer"><span class="lz-lname">debug — the detail you need while investigating</span><span class="lz-lnote">Off in production by default. This repo enforces that literally: <code>if (level === 'debug' &amp;&amp; nodeEnv === 'production') return;</code></span></div>
</div>

<h3>The three ways the promise gets broken</h3>
<pre><code>Failure mode              What it looks like                 Consequence
────────────────────────  ─────────────────────────────────  ──────────────────────
Everything is info        95% of lines are info              info means nothing
Handled cases are error   "user not found" logged as error   error means nothing
warn is a dumping ground  "not sure if this matters" → warn  warn is never read</code></pre>
<p>The second row is the expensive one. When a 404 is logged at <code>error</code>, the error rate on your dashboard is dominated by users typing bad URLs, so a real spike in real errors is invisible inside the noise — and any alert built on error count is either permanently firing or set so high that it never catches anything. This repository&#39;s error handler gets this right and it is worth reading the reason in its own comment:</p>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts
// Report to Sentry — but only for 5xx errors. Client errors (4xx)
// are not bugs and would just spam the dashboard.
if (statusCode &gt;= 500) {
  captureException(err, { url: req.originalUrl, method: req.method, statusCode, code: err.code });
}
</code></pre>
<p>&quot;Client errors are not bugs&quot; is the whole rule, applied to Sentry. The same sentence applies to log levels: a 400 is the system working correctly, and it belongs at <code>info</code> or not at all.</p>

<h3>The test that settles every argument</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Would you page someone at 3am for this?</span><span class="lz-d">Yes → <code>error</code>. If the honest answer is &quot;no, but I would want to know&quot;, it is <code>warn</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Would a product person care that it happened?</span><span class="lz-d">Yes → <code>info</code>. &quot;Payment captured&quot; is info; &quot;entering validatePayment()&quot; is not, and is probably nothing.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Is it only useful while you are debugging this exact thing?</span><span class="lz-d">Then <code>debug</code> — and accept that it will be off in production, which is the point.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Still unsure?</span><span class="lz-d">Delete the line. A log nobody can classify is a log nobody will read, and it costs money on every request forever.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>debug</code> disabled by an early return, so the cost of building its context is paid anyway.</strong> This repo&#39;s logger drops debug lines in production with <code>if (level === 'debug' &amp;&amp; nodeEnv === 'production') return;</code> — but that check runs <em>inside</em> <code>emit()</code>, after the caller has already evaluated its arguments. So <code>logger.debug('state', { snapshot: JSON.parse(JSON.stringify(bigObject)) })</code> performs the deep clone on every request in production and then throws the result away. The line is invisible and the cost is not. Guard at the call site when the context is expensive (<code>if (logger.isDebug) logger.debug(...)</code>), or keep debug context cheap enough that building it does not matter.</p>
</div>

<h3>Why five or more levels usually makes things worse</h3>
<p>Adding <code>trace</code>, <code>fatal</code> and <code>notice</code> looks like more precision and delivers less. Every extra level is another decision at every call site, another threshold in every config, and another value that half the team maps differently — and the practical outcome is that lines drift towards the middle of the scale until <code>info</code> and <code>notice</code> are indistinguishable. Four levels, used honestly, carry more information than eight used approximately.</p>

<h3>What the level is not for</h3>
<p>It is not a subject tag. &quot;This is about payments&quot; is a field (<code>module: 'payments'</code>), not a level. It is also not a verbosity dial for a subsystem — that is what per-module filtering is for, and conflating the two produces the codebase where the payment team logs everything at <code>warn</code> so their lines survive the production filter.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Workbook — Alerting on SLOs</span><span class="lc-sub">Why &quot;would you page for this?&quot; is the right question, developed into a full alerting method in chapter 9.</span></span>
</a>
<a class="link-card dl" href="https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">RFC 5424 — syslog severity levels</span><span class="lc-sub">The eight-level scale everything else descends from, and a useful case study in why eight was too many.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Mức log, và vì sao ai cũng dùng sai</h2>
<p class="lead">Một mức log không phải thước đo xem một dòng thú vị tới đâu. Nó là một lời hứa về việc người đọc NÊN LÀM GÌ khi thấy nó, và các mức thôi hoạt động ngay khi lời hứa đó bị phá — chuyện xảy ra ở gần như mọi kho mã, theo đúng ba cách.</p>

<h3>Bốn mức, bốn lời hứa</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">error — có thứ gì đó hỏng, và có thể cần một con người ra tay</span><span class="lz-lnote">Một request không phục vụ nổi, một job sẽ không thử lại, dữ liệu giờ đã bất nhất. Nếu chẳng ai bao giờ ra tay vì nó thì nó không phải error.</span></div>
  <div class="lz-layer"><span class="lz-lname">warn — nó chạy được, nhưng có gì đó không ổn</span><span class="lz-lnote">Một phương án dự phòng đã được dùng, một lần thử lại đã thành công, một đường đi cũ đã được chọn, một hạn mức sắp chạm. Chẳng ai ra tay ngay; nhưng nên có người để ý cái xu hướng.</span></div>
  <div class="lz-layer"><span class="lz-lname">info — một sự kiện nghiệp vụ đã xảy ra</span><span class="lz-lnote">Đơn hàng được đặt, người dùng đăng ký, deploy bắt đầu, job hoàn tất. Mỗi thứ có ý nghĩa một dòng, không phải mỗi lời gọi hàm một dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">debug — chi tiết bạn cần trong lúc đang điều tra</span><span class="lz-lnote">Mặc định TẮT trên production. Kho này cưỡng chế đúng nghĩa đen: <code>if (level === 'debug' &amp;&amp; nodeEnv === 'production') return;</code></span></div>
</div>

<h3>Ba cách lời hứa đó bị phá</h3>
<pre><code>Kiểu hỏng                 Nhìn ra sao                         Hệ quả
────────────────────────  ─────────────────────────────────  ──────────────────────
Cái gì cũng info          95% số dòng là info                info chẳng nghĩa gì
Ca đã xử lý mà để error   "không tìm thấy user" ghi là error  error chẳng nghĩa gì
warn thành bãi rác        "không rõ có quan trọng không"→warn warn chẳng ai đọc</code></pre>
<p>Dòng thứ hai là dòng đắt đỏ. Khi một cú 404 được ghi ở mức <code>error</code>, tỷ lệ lỗi trên bảng theo dõi của bạn bị chi phối bởi người dùng gõ nhầm URL, nên một cú tăng vọt thật sự của lỗi thật là vô hình trong đám nhiễu — và mọi cảnh báo dựng trên số lượng lỗi thì hoặc nổ liên tục hoặc đặt cao tới mức chẳng bao giờ bắt được gì. Bộ xử lỗi của kho này làm đúng chỗ này và cái lý do trong chính comment của nó đáng đọc:</p>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts
// Report to Sentry — but only for 5xx errors. Client errors (4xx)
// are not bugs and would just spam the dashboard.
if (statusCode &gt;= 500) {
  captureException(err, { url: req.originalUrl, method: req.method, statusCode, code: err.code });
}
</code></pre>
<p>&quot;Lỗi phía client không phải bug&quot; chính là toàn bộ cái luật, áp cho Sentry. Đúng câu đó áp luôn cho mức log: một cú 400 là hệ thống đang chạy ĐÚNG, và nó thuộc về mức <code>info</code> hoặc chẳng thuộc về đâu cả.</p>

<h3>Phép thử dập tắt mọi tranh cãi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn có gọi người dậy lúc 3 giờ sáng vì cái này không?</span><span class="lz-d">Có → <code>error</code>. Nếu câu trả lời thành thật là &quot;không, nhưng tôi muốn biết&quot; thì nó là <code>warn</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một người làm sản phẩm có quan tâm là nó đã xảy ra không?</span><span class="lz-d">Có → <code>info</code>. &quot;Đã thu tiền&quot; là info; &quot;đang vào validatePayment()&quot; thì không, và có lẽ chẳng là gì cả.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó chỉ có ích trong lúc bạn đang gỡ đúng cái này?</span><span class="lz-d">Thì là <code>debug</code> — và hãy chấp nhận rằng nó sẽ tắt trên production, đó chính là mục đích.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Vẫn không chắc?</span><span class="lz-d">Xoá cái dòng đó đi. Một dòng log chẳng ai phân loại nổi là một dòng chẳng ai đọc, và nó tốn tiền ở mọi request, mãi mãi.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>debug</code> bị tắt bằng một lệnh return sớm, nên chi phí dựng ngữ cảnh cho nó vẫn bị trả.</strong> Logger của kho này bỏ các dòng debug trên production bằng <code>if (level === 'debug' &amp;&amp; nodeEnv === 'production') return;</code> — nhưng phép kiểm đó chạy <em>bên trong</em> <code>emit()</code>, sau khi chỗ gọi đã tính xong các đối số của nó. Nên <code>logger.debug('state', { snapshot: JSON.parse(JSON.stringify(bigObject)) })</code> vẫn thực hiện phép chép sâu ở mọi request trên production rồi vứt kết quả đi. Cái dòng thì vô hình còn cái giá thì không. Hãy chặn ngay tại chỗ gọi khi ngữ cảnh đắt đỏ (<code>if (logger.isDebug) logger.debug(...)</code>), hoặc giữ cho ngữ cảnh debug rẻ tới mức dựng nó chẳng đáng kể.</p>
</div>

<h3>Vì sao năm mức trở lên thường làm mọi thứ tệ hơn</h3>
<p>Thêm <code>trace</code>, <code>fatal</code> và <code>notice</code> trông như thêm độ chính xác mà lại cho ra ít hơn. Mỗi mức thừa là thêm một quyết định ở mọi chỗ gọi, thêm một ngưỡng trong mọi file cấu hình, và thêm một giá trị mà nửa đội ánh xạ theo cách khác — và kết cục thực tế là các dòng trôi dần về giữa thang cho tới khi <code>info</code> và <code>notice</code> không phân biệt nổi. Bốn mức dùng một cách thành thật mang nhiều thông tin hơn tám mức dùng đại khái.</p>

<h3>Mức log KHÔNG dùng để làm gì</h3>
<p>Nó không phải một cái nhãn chủ đề. &quot;Cái này về thanh toán&quot; là một trường (<code>module: 'payments'</code>), không phải một mức. Nó cũng không phải một núm vặn độ chi tiết cho một phân hệ — việc đó là của phép lọc theo module, và lẫn lộn hai thứ sẽ sinh ra cái kho mã mà đội thanh toán log mọi thứ ở mức <code>warn</code> để các dòng của họ sống sót qua bộ lọc production.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Sổ tay SRE của Google — Cảnh báo dựa trên SLO</span><span class="lc-sub">Vì sao &quot;bạn có gọi người dậy vì cái này không?&quot; là câu hỏi đúng, phát triển thành cả một phương pháp cảnh báo ở chương 9.</span></span>
</a>
<a class="link-card dl" href="https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">RFC 5424 — các mức nghiêm trọng của syslog</span><span class="lc-sub">Thang tám mức mà mọi thứ khác kế thừa từ đó, và một ca nghiên cứu hữu ích về việc vì sao tám là quá nhiều.</span></span>
</a>
</div>
`,
    },

    {
      title: '1.4 — What a log line actually costs, measured|||1.4 — Một dòng log thật sự tốn bao nhiêu, đo thật',
      slug: 'obs-1-4-chi-phi-that',
      type: 'VIDEO',
      description: 'Bốn cách viết cùng một dòng, đo trên Node 22. Kết quả bất ngờ: cái đắt nhất không phải JSON.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>What a log line actually costs, measured</h2>
<p class="lead">&quot;Structured logging is slower&quot; is repeated everywhere and almost never quantified. Here is the number, on Node 22.22.2, for the exact shape this repository emits — and the surprise is which part of the line dominates.</p>

<h3>The benchmark</h3>
<pre><code class="language-javascript">// m1.mjs
const N = 200_000;
const ctx = { userId: 'u_8f3a', route: '/api/v1/notes', ms: 42, ok: true };

function bench(label, fn) {
  fn();                                    // warm up
  const t = process.hrtime.bigint();
  for (let i = 0; i &lt; N; i++) fn();
  return Number(process.hrtime.bigint() - t) / N;   // ns per line
}

bench('bare string',        () =&gt; \`[info] request done\`);
bench('concat + context',   () =&gt; \`[info] request done u=\${ctx.userId} r=\${ctx.route} ms=\${ctx.ms}\`);
bench('JSON.stringify',     () =&gt; JSON.stringify({ ts: '2026-08-25T10:00:00.000Z', level: 'info', msg: 'request done', ...ctx }));
bench('+ new Date().toISOString()', () =&gt; JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg: 'request done', ...ctx }));
</code></pre>
<div class="out">$ node m1.mjs
chuỗi trần, không ngữ cảnh            15 ns/dòng       3 ms cho 200,000
nối chuỗi + ngữ cảnh                  19 ns/dòng       4 ms cho 200,000
JSON.stringify (như logger.ts)       571 ns/dòng     114 ms cho 200,000
+ new Date().toISOString()          1310 ns/dòng     262 ms cho 200,000</div>

<h3>Reading the four numbers</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">15 → 19 ns: context is nearly free in prose</span><span class="lz-d">Interpolating four values costs 4 ns. This is why prose logging feels cheap, and why the cost never appears in a profile.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">19 → 571 ns: serialisation is 30× the string</span><span class="lz-d">That is the real price of being queryable. Half a microsecond per line, paid on every line that survives the level filter.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">571 → 1310 ns: the timestamp more than doubles it</span><span class="lz-d">The single most expensive part of a structured log line in this repo is not the JSON. It is <code>new Date().toISOString()</code>, at ~740 ns.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So the field nobody thinks about is the one to optimise</span><span class="lz-d">Caching the formatted second and appending milliseconds, which is what fast loggers do, removes most of that 740 ns.</span></div>
</div>

<h3>Turning nanoseconds into something you can decide with</h3>
<pre><code>At 1,310 ns per line (this repo's logger.ts, production path):

lines per request   lines/sec at 500 rps   CPU spent logging
─────────────────   ────────────────────   ─────────────────
        1                    500              0.07%
        5                  2,500              0.33%
       20                 10,000              1.31%
      100                 50,000              6.55%

At 100 lines per request you are spending 6.5% of one core
serialising log lines — before anything has been written anywhere.</code></pre>
<p>One line per request is free by any reasonable standard. Twenty is a rounding error. A hundred — which sounds absurd until you count a debug line per function in a service with deep call chains — is a measurable tax, and it is paid entirely in the request path.</p>

<h3>The fix that costs nothing</h3>
<pre><code class="language-javascript">// Cache the ISO second; append milliseconds. Recomputes ~once per second.
let cachedSec = 0, cachedPrefix = '';
function fastTs() {
  const now = Date.now();
  const sec = (now / 1000) | 0;
  if (sec !== cachedSec) {
    cachedSec = sec;
    cachedPrefix = new Date(sec * 1000).toISOString().slice(0, 19);
  }
  return cachedPrefix + '.' + String(now % 1000).padStart(3, '0') + 'Z';
}
</code></pre>
<p>This is the trick every high-throughput logger uses, and it is worth understanding rather than importing blindly: it trades exactness of the sub-second boundary for one <code>Date</code> construction per second instead of one per line. For a log timestamp that is a trade with no downside; for anything you compute a duration from, it is not — which is why durations use <code>hrtime</code>, from lesson 0.3.</p>

<div class="pitfall">
<p><strong>Trap — concluding from these numbers that logging is expensive, and cutting the wrong lines.</strong> 1,310 ns is the <em>serialisation</em> cost, and it is dwarfed by what happens next: lesson 1.5 measures the write at 4,985 ns per line through a pipe, roughly four times more. So optimising the JSON while leaving a hundred lines per request in place is optimising the cheap half. The order that actually matters is: emit fewer lines first, then make the remaining lines cheaper. And when you do cut lines, cut <code>debug</code> and per-function noise — never the one line per request that carries the request id, because that line is what makes chapter 3 possible.</p>
</div>

<h3>What this does not measure</h3>
<p>Nothing here touches the disk, the network or the log shipper. It is the cost of turning an object into a string inside your process, and it is the floor. The next lesson measures the part that can actually stall a service.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://github.com/pinojs/pino/blob/main/docs/benchmarks.md" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">Pino — benchmarks</span><span class="lc-sub">Comparable numbers across Node loggers, and the design choices (like timestamp caching) that produce them.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#perf_hooksperformancenow" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — performance.now() and hrtime</span><span class="lc-sub">The two monotonic clocks, their resolutions, and why one of them is the right tool for a benchmark.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Một dòng log thật sự tốn bao nhiêu, đo thật</h2>
<p class="lead">&quot;Log có cấu trúc thì chậm hơn&quot; là câu được nhắc lại ở khắp nơi mà gần như chẳng bao giờ có con số. Đây là con số đó, trên Node 22.22.2, cho đúng hình dạng mà kho này phát ra — và điều bất ngờ nằm ở chỗ phần nào của dòng log chiếm chủ đạo.</p>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m1.mjs
const N = 200_000;
const ctx = { userId: 'u_8f3a', route: '/api/v1/notes', ms: 42, ok: true };

function bench(label, fn) {
  fn();                                    // làm nóng
  const t = process.hrtime.bigint();
  for (let i = 0; i &lt; N; i++) fn();
  return Number(process.hrtime.bigint() - t) / N;   // ns mỗi dòng
}

bench('chuỗi trần',         () =&gt; \`[info] request done\`);
bench('nối chuỗi + ngữ cảnh', () =&gt; \`[info] request done u=\${ctx.userId} r=\${ctx.route} ms=\${ctx.ms}\`);
bench('JSON.stringify',     () =&gt; JSON.stringify({ ts: '2026-08-25T10:00:00.000Z', level: 'info', msg: 'request done', ...ctx }));
bench('+ new Date().toISOString()', () =&gt; JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg: 'request done', ...ctx }));
</code></pre>
<div class="out">$ node m1.mjs
chuỗi trần, không ngữ cảnh            15 ns/dòng       3 ms cho 200,000
nối chuỗi + ngữ cảnh                  19 ns/dòng       4 ms cho 200,000
JSON.stringify (như logger.ts)       571 ns/dòng     114 ms cho 200,000
+ new Date().toISOString()          1310 ns/dòng     262 ms cho 200,000</div>

<h3>Đọc bốn con số</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">15 → 19 ns: ngữ cảnh gần như miễn phí trong văn xuôi</span><span class="lz-d">Nội suy bốn giá trị tốn 4 ns. Đó là lý do log kiểu văn xuôi có cảm giác rẻ, và là lý do cái giá đó chẳng bao giờ hiện ra trong một bản đo hồ sơ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">19 → 571 ns: tuần tự hoá gấp 30 lần cái chuỗi</span><span class="lz-d">Đó là giá thật của việc TRUY VẤN ĐƯỢC. Nửa micro giây mỗi dòng, trả ở mọi dòng sống sót qua bộ lọc mức.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">571 → 1310 ns: cái dấu thời gian làm nó tăng HƠN GẤP ĐÔI</span><span class="lz-d">Phần đắt nhất của một dòng log có cấu trúc trong kho này KHÔNG phải phần JSON. Nó là <code>new Date().toISOString()</code>, khoảng 740 ns.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên cái trường chẳng ai nghĩ tới lại là cái đáng tối ưu</span><span class="lz-d">Nhớ đệm phần giây đã định dạng rồi nối thêm mili giây — đúng thứ các logger nhanh làm — gỡ được phần lớn trong 740 ns đó.</span></div>
</div>

<h3>Biến nano giây thành thứ ra quyết định được</h3>
<pre><code>Ở mức 1.310 ns mỗi dòng (đường production của logger.ts kho này):

số dòng mỗi request   dòng/giây ở 500 rps   CPU tiêu cho việc log
───────────────────   ────────────────────   ─────────────────────
        1                    500              0,07%
        5                  2.500              0,33%
       20                 10.000              1,31%
      100                 50.000              6,55%

Ở mức 100 dòng mỗi request, bạn đang tiêu 6,5% một nhân CPU chỉ để
tuần tự hoá các dòng log — trước khi có gì được ghi ra bất cứ đâu.</code></pre>
<p>Một dòng mỗi request là miễn phí theo mọi chuẩn hợp lý. Hai mươi dòng là sai số làm tròn. Một trăm — nghe vô lý cho tới khi bạn đếm một dòng debug mỗi hàm trong một dịch vụ có chuỗi gọi sâu — là một khoản thuế đo được, và nó được trả trọn vẹn ngay trên đường đi của request.</p>

<h3>Cách chữa chẳng tốn gì</h3>
<pre><code class="language-javascript">// Nhớ đệm phần giây ISO; nối thêm mili giây. Tính lại ~mỗi giây một lần.
let cachedSec = 0, cachedPrefix = '';
function fastTs() {
  const now = Date.now();
  const sec = (now / 1000) | 0;
  if (sec !== cachedSec) {
    cachedSec = sec;
    cachedPrefix = new Date(sec * 1000).toISOString().slice(0, 19);
  }
  return cachedPrefix + '.' + String(now % 1000).padStart(3, '0') + 'Z';
}
</code></pre>
<p>Đây là mẹo mà mọi logger thông lượng cao đều dùng, và nó đáng hiểu chứ đừng import mù: nó đánh đổi độ chính xác ở ranh giới dưới-một-giây lấy MỘT lần dựng <code>Date</code> mỗi giây thay vì mỗi dòng. Với một dấu thời gian log thì đó là cuộc đổi chác không có mặt trái; với bất cứ thứ gì bạn đem tính khoảng thời gian thì có — và đó là lý do các khoảng thời gian dùng <code>hrtime</code>, từ bài 0.3.</p>

<div class="pitfall">
<p><strong>Bẫy — từ mấy con số này kết luận rằng việc log đắt đỏ, rồi đi cắt nhầm dòng.</strong> 1.310 ns là chi phí <em>tuần tự hoá</em>, và nó bị lấn át bởi thứ xảy ra ngay sau: bài 1.5 đo phép ghi ở 4.985 ns mỗi dòng qua một pipe, gấp khoảng bốn lần. Nên tối ưu phần JSON trong khi vẫn để nguyên một trăm dòng mỗi request là đang tối ưu cái nửa rẻ. Thứ tự thật sự đáng làm là: phát ít dòng đi trước đã, rồi mới làm cho các dòng còn lại rẻ hơn. Và khi cắt dòng thì hãy cắt <code>debug</code> và đám ồn ào mỗi-hàm-một-dòng — đừng bao giờ cắt cái dòng duy nhất mỗi request mang theo request id, vì chính dòng đó làm cho chương 3 khả thi.</p>
</div>

<h3>Phép đo này KHÔNG đo cái gì</h3>
<p>Chẳng có gì ở đây chạm tới đĩa, tới mạng hay tới trình gửi log. Đây là chi phí biến một object thành một chuỗi bên trong tiến trình của bạn, và nó là cái SÀN. Bài kế tiếp đo cái phần thật sự làm nghẽn được một dịch vụ.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://github.com/pinojs/pino/blob/main/docs/benchmarks.md" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">Pino — các phép đo chuẩn</span><span class="lc-sub">Con số so sánh được giữa các logger của Node, và những lựa chọn thiết kế (như nhớ đệm dấu thời gian) tạo ra chúng.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/perf_hooks.html#perf_hooksperformancenow" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Node.js — performance.now() và hrtime</span><span class="lc-sub">Hai đồng hồ đơn điệu, độ phân giải của chúng, và vì sao một trong hai là công cụ đúng cho một phép đo chuẩn.</span></span>
</a>
</div>
`,
    },
    {
      title: '1.5 — stdout is a pipe, and a pipe can fill up|||1.5 — stdout là một cái ống, và ống thì đầy được',
      slug: 'obs-1-5-stdout-la-mot-cai-ong',
      type: 'VIDEO',
      description: 'Đo thật: một trình thu log chậm biến console.log thành rò rỉ bộ nhớ, 122 MB RSS và 47 MB kẹt trong đệm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>stdout is a pipe, and a pipe can fill up</h2>
<p class="lead">Lesson 1.4 measured the cost of <em>building</em> a log line: 1,310 ns. This lesson measures what happens right after — the write itself — and that number is not a constant. It depends entirely on what file descriptor 1 happens to be pointing at, and in Docker it is always pointing at the one case that can hurt you.</p>

<h3>console.log does not write to a log file</h3>
<p><code>console.log</code> writes to file descriptor 1. That is all it knows. Whether fd 1 is a terminal, a file, a <code>/dev/null</code>, or a pipe into another process is decided outside your program, by whoever started it — and Node changes its own behaviour based on which one it found.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">fd 1 → file</span><span class="lz-t">Synchronous write</span><span class="lz-d">&#96;node app.js &gt; app.log&#96;. Every console.log blocks until the kernel accepts the bytes. Fast, and never loses a line on exit.</span></div>
  <div class="lz-node"><span class="lz-k">fd 1 → TTY</span><span class="lz-t">Synchronous write</span><span class="lz-d">Your terminal during development. Also blocking. This is why local behaviour never shows you the problem in this lesson.</span></div>
  <div class="lz-node"><span class="lz-k">fd 1 → pipe</span><span class="lz-t">ASYNCHRONOUS write</span><span class="lz-d">&#96;node app.js | shipper&#96;, and every container ever. Node buffers in the process heap and writes when the reader is ready. This is the case that can grow without bound.</span></div>
</div>
<p>The asymmetry matters because the pipe case is the only one you actually run in production, and the only one you never see while developing.</p>

<h3>Measurement: the same 20,000 lines, three destinations</h3>
<pre><code class="language-javascript">// m3.mjs — identical loop, only fd 1 differs
import tty from 'node:tty';
const N = 20_000;
const line = JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg: 'request done', route: '/api/v1/notes', ms: 42 });
const t = process.hrtime.bigint();
for (let i = 0; i &lt; N; i++) console.log(line);
const ns = Number(process.hrtime.bigint() - t);
process.stderr.write(&#96;\${tty.isatty(1) ? 'TTY' : 'not-TTY'}  \${(ns/1e6).toFixed(0)} ms  \${(ns/N).toFixed(0)} ns/line\\n&#96;);
</code></pre>
<div class="out">$ node m3.mjs &gt; out.log            # fd 1 → file
FILE:      57 ms   2866 ns/dòng   348,931 dòng/giây

$ node m3.mjs | cat &gt; out.log      # fd 1 → pipe
PIPE:     100 ms   4985 ns/dòng   200,622 dòng/giây

$ node m3.mjs &gt; /dev/null          # fd 1 → cái hố đen
/dev/null: 46 ms   2303 ns/dòng   434,278 dòng/giây</div>
<p>Read those against 1.4's 1,310 ns. Building the line is the cheap half. Writing it costs 2,303–4,985 ns depending on where it goes — two to four times more — and the pipe, the production case, is the most expensive of the three. Total real cost of one production log line in this repository: roughly <strong>6,300 ns</strong>, not 1,310.</p>
<p>But throughput is the boring finding. The interesting one only appears when the reader on the other end of the pipe stops keeping up.</p>

<h3>Measurement: what a slow reader actually does to you</h3>
<p>A log shipper falls behind for entirely ordinary reasons — the disk it writes to fills, the network to Loki is slow, the process is being restarted. Simulate exactly that: a reader that pauses 50 ms every 500 lines.</p>
<pre><code class="language-python"># slowreader.py — a log shipper that has fallen behind
import sys, time
n = 0
while True:
    line = sys.stdin.readline()
    if not line: break
    n += 1
    if n % 500 == 0: time.sleep(0.05)
</code></pre>
<pre><code class="language-javascript">// m5.mjs — measure RSS and the stdout buffer, not wall time
const line = JSON.stringify({ ts:'2026-08-25T10:00:00.000Z', level:'info', msg:'request done', route:'/api/v1/notes', ms:42, userId:'u_8f3a' });
const mb = () =&gt; (process.memoryUsage().rss / 1048576).toFixed(0);
const rss0 = mb();
for (let i = 0; i &lt; 400_000; i++) console.log(line);
process.stderr.write(
  &#96;RSS: \${rss0} MB → \${mb()} MB\\n&#96; +
  &#96;still in the stdout buffer: \${process.stdout.writableLength} bytes\\n&#96; +
  &#96;writableNeedDrain = \${process.stdout.writableNeedDrain}\\n&#96;);
</code></pre>
<div class="out">$ node m5.mjs | cat &gt; /dev/null                    # bên đọc NHANH
bên đọc NHANH: RSS 43 MB → 55 MB · đệm 0 byte · writableNeedDrain=false · nhận đủ 400000 dòng

$ node m5.mjs | python3 slowreader.py             # bên đọc CHẬM
bên đọc CHẬM:  RSS 43 MB → 122 MB · đệm 47,874,720 byte · writableNeedDrain=true</div>

<h3>Reading that result honestly</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The loop finished either way</span><span class="lz-d">Both runs called console.log 400,000 times and returned. Node never blocked your code, never threw, never warned. From inside the process, nothing was wrong.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">47.8 MB of log text is sitting in your heap</span><span class="lz-d">The slow reader took some of it; the rest is queued in <code>process.stdout</code>, held by your process, counted against your container's memory limit.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RSS went 43 → 122 MB, and that growth has no ceiling</span><span class="lz-d">The fast-reader run grew 12 MB; the slow-reader run grew 79 MB from the identical loop. Keep the reader slow and keep logging, and the number keeps climbing until the OOM killer arrives.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The flag that told you was there the whole time</span><span class="lz-d"><code>writableNeedDrain === true</code> is Node saying &quot;I am buffering for you and I would like you to stop&quot;. Almost no application ever reads it.</span></div>
</div>
<p>Restate the finding plainly, because it is the reason this lesson exists: <strong>a slow log shipper is a memory leak in your application.</strong> Not in the shipper. In the process that is merely writing to stdout, which has no idea anything is wrong, and which will be the thing that dies.</p>

<h3>Why Docker makes this the default case</h3>
<pre><code>your process                docker daemon              storage
────────────                ─────────────              ───────
console.log ──▶ fd 1 ──▶ PIPE ──▶ json-file driver ──▶ /var/lib/docker/
                          ▲                              containers/…-json.log
                          │
              this is always a pipe. There is no
              configuration that makes it a file.</code></pre>
<p>Every containerised Node process on this VPS writes into a pipe held open by the Docker daemon. So the pipe row of the first diagram is not an edge case you might hit — it is the only row that describes production. The daemon is normally a fast reader, which is why this stays invisible for months. It stops being a fast reader when the disk backing <code>/var/lib/docker</code> fills up, which is exactly the failure this repository has already had once.</p>

<h3>The three defences, in order of how much they cost you</h3>
<pre><code>1. Log less.        Fewer lines is the only fix with no downside.
                    Lesson 1.3's level discipline is this defence.

2. Don't buffer     Write to a FILE, let a sidecar tail the file.
   in the app.      fd 1 → file is synchronous: the kernel's page
                    cache absorbs the burst, not your heap. This is
                    what the log-shipper architecture in Chapter 2
                    is actually for.

3. Bound the        Read writableLength before logging; drop the
   buffer.          line when it is over a threshold. Losing debug
                    lines beats losing the process. Ugly, effective,
                    and almost nobody does it.</code></pre>
<pre><code class="language-javascript">// Defence 3, ~6 lines, in the emit() of src/utils/logger.ts
const MAX_BUFFERED = 8 * 1024 * 1024;          // 8 MB of queued stdout
let dropped = 0;

if (process.stdout.writableLength &gt; MAX_BUFFERED) {
  dropped++;                                    // count it, never silently vanish
  if (level !== 'error') return;                // errors always get through
}
if (dropped &amp;&amp; process.stdout.writableLength &lt; MAX_BUFFERED / 2) {
  const n = dropped; dropped = 0;
  console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'warn', msg: 'log lines dropped under backpressure', dropped: n }));
}
</code></pre>
<p>Note the shape: it drops, it counts what it dropped, and it reports the count once the pressure clears. A defence that discards data silently trades a visible crash for an invisible hole in your evidence — which, for an observability system, is the worse of the two.</p>

<div class="pitfall">
<p><strong>Trap — the log lines from your crash are the ones you lose.</strong> Because pipe writes are asynchronous, lines sitting in <code>process.stdout</code>'s buffer are gone if the process ends before they drain. <code>process.exit()</code> does not wait. Neither does an uncaught exception's default handler, nor <code>SIGKILL</code> from the OOM killer, nor <code>docker kill</code>. The practical consequence is precise and nasty: <strong>during an incident, when logging spikes and the buffer is deepest, the final seconds of log — the ones that explain the crash — are exactly the ones that never reach disk.</strong> This is why an incident's log so often stops several seconds before the timestamp on the crash. If you take one operational habit from this chapter, take this: in your <code>SIGTERM</code> handler, stop accepting requests, then let the event loop drain naturally rather than calling <code>process.exit()</code> — an empty loop exits on its own, and only then are the buffers actually flushed.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#a-note-on-process-io" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Node.js — A note on process I/O</span><span class="lc-sub">The official table of which stdout destinations are synchronous and which are not. Short, and the source of the three-row diagram above.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/stream.html#buffering" target="_blank" rel="noopener">
  <span class="lc-ico">🚰</span>
  <span class="lc-body"><span class="lc-title">Node.js Streams — Buffering and backpressure</span><span class="lc-sub">What writableLength, writableNeedDrain and the &#96;drain&#96; event mean, and the contract a well-behaved writer is supposed to honour.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>stdout là một cái ống, và ống thì đầy được</h2>
<p class="lead">Bài 1.4 đo cái giá <em>dựng</em> một dòng log: 1.310 ns. Bài này đo thứ xảy ra ngay sau đó — phép ghi — và con số ấy không phải hằng số. Nó phụ thuộc hoàn toàn vào việc file descriptor 1 đang trỏ vào đâu, và trong Docker thì nó luôn trỏ đúng vào trường hợp có thể làm bạn đau.</p>

<h3>console.log không ghi vào file log</h3>
<p><code>console.log</code> ghi vào file descriptor 1. Nó chỉ biết có thế. Fd 1 là một terminal, một file, một <code>/dev/null</code>, hay một cái ống dẫn sang tiến trình khác — chuyện đó do người khởi động chương trình quyết định, bên ngoài mã của bạn — và Node tự đổi hành vi tuỳ theo nó thấy cái nào.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">fd 1 → file</span><span class="lz-t">Ghi đồng bộ</span><span class="lz-d">&#96;node app.js &gt; app.log&#96;. Mỗi console.log chặn cho tới khi nhân nhận đủ byte. Nhanh, và không bao giờ mất dòng lúc thoát.</span></div>
  <div class="lz-node"><span class="lz-k">fd 1 → TTY</span><span class="lz-t">Ghi đồng bộ</span><span class="lz-d">Terminal của bạn lúc phát triển. Cũng chặn. Đây là lý do chạy ở máy mình không bao giờ lộ ra vấn đề của bài này.</span></div>
  <div class="lz-node"><span class="lz-k">fd 1 → ống</span><span class="lz-t">Ghi KHÔNG đồng bộ</span><span class="lz-d">&#96;node app.js | shipper&#96;, và mọi container từng có. Node đệm trong heap của tiến trình rồi ghi khi bên đọc sẵn sàng. Đây là trường hợp có thể phình không giới hạn.</span></div>
</div>
<p>Sự lệch này quan trọng vì trường hợp ống là cái duy nhất bạn thật sự chạy trên production, và là cái duy nhất bạn không bao giờ thấy lúc phát triển.</p>

<h3>Phép đo: cùng 20.000 dòng, ba đích đến</h3>
<pre><code class="language-javascript">// m3.mjs — vòng lặp y hệt, chỉ khác fd 1
import tty from 'node:tty';
const N = 20_000;
const line = JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg: 'request done', route: '/api/v1/notes', ms: 42 });
const t = process.hrtime.bigint();
for (let i = 0; i &lt; N; i++) console.log(line);
const ns = Number(process.hrtime.bigint() - t);
process.stderr.write(&#96;\${tty.isatty(1) ? 'TTY' : 'không-TTY'}  \${(ns/1e6).toFixed(0)} ms  \${(ns/N).toFixed(0)} ns/dòng\\n&#96;);
</code></pre>
<div class="out">$ node m3.mjs &gt; out.log            # fd 1 → file
FILE:      57 ms   2866 ns/dòng   348,931 dòng/giây

$ node m3.mjs | cat &gt; out.log      # fd 1 → ống
PIPE:     100 ms   4985 ns/dòng   200,622 dòng/giây

$ node m3.mjs &gt; /dev/null          # fd 1 → cái hố đen
/dev/null: 46 ms   2303 ns/dòng   434,278 dòng/giây</div>
<p>Hãy đọc mấy số đó cạnh 1.310 ns của bài 1.4. Dựng dòng log là nửa rẻ. Ghi nó tốn 2.303–4.985 ns tuỳ đích đến — gấp hai tới bốn lần — và cái ống, tức trường hợp production, là cái đắt nhất trong ba. Tổng chi phí thật của một dòng log production trong kho này: khoảng <strong>6.300 ns</strong>, không phải 1.310.</p>
<p>Nhưng thông lượng mới là phần chán. Phần thú vị chỉ hiện ra khi bên đọc ở đầu kia cái ống không theo kịp nữa.</p>

<h3>Phép đo: bên đọc chậm thật sự làm gì bạn</h3>
<p>Một trình thu log tụt lại vì những lý do hết sức bình thường — đĩa nó ghi vào đầy, đường mạng tới Loki chậm, tiến trình nó đang khởi động lại. Mô phỏng đúng thế: một bên đọc ngủ 50 ms sau mỗi 500 dòng.</p>
<pre><code class="language-python"># slowreader.py — một trình thu log đã tụt lại
import sys, time
n = 0
while True:
    line = sys.stdin.readline()
    if not line: break
    n += 1
    if n % 500 == 0: time.sleep(0.05)
</code></pre>
<pre><code class="language-javascript">// m5.mjs — đo RSS và bộ đệm stdout, không đo thời gian tường
const line = JSON.stringify({ ts:'2026-08-25T10:00:00.000Z', level:'info', msg:'request done', route:'/api/v1/notes', ms:42, userId:'u_8f3a' });
const mb = () =&gt; (process.memoryUsage().rss / 1048576).toFixed(0);
const rss0 = mb();
for (let i = 0; i &lt; 400_000; i++) console.log(line);
process.stderr.write(
  &#96;RSS: \${rss0} MB → \${mb()} MB\\n&#96; +
  &#96;còn tồn trong bộ đệm stdout: \${process.stdout.writableLength} byte\\n&#96; +
  &#96;writableNeedDrain = \${process.stdout.writableNeedDrain}\\n&#96;);
</code></pre>
<div class="out">$ node m5.mjs | cat &gt; /dev/null                    # bên đọc NHANH
bên đọc NHANH: RSS 43 MB → 55 MB · đệm 0 byte · writableNeedDrain=false · nhận đủ 400000 dòng

$ node m5.mjs | python3 slowreader.py             # bên đọc CHẬM
bên đọc CHẬM:  RSS 43 MB → 122 MB · đệm 47,874,720 byte · writableNeedDrain=true</div>

<h3>Đọc kết quả đó cho trung thực</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vòng lặp chạy xong ở cả hai lượt</span><span class="lz-d">Cả hai đều gọi console.log 400.000 lần rồi trả về. Node không chặn mã của bạn, không ném lỗi, không cảnh báo. Nhìn từ bên trong tiến trình, chẳng có gì sai.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">47,8 MB chữ log đang nằm trong heap của bạn</span><span class="lz-d">Bên đọc chậm lấy được một phần; phần còn lại xếp hàng trong <code>process.stdout</code>, do tiến trình của bạn giữ, và bị tính vào hạn mức bộ nhớ của container.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RSS đi từ 43 lên 122 MB, và mức phình đó không có trần</span><span class="lz-d">Lượt đọc nhanh phình 12 MB; lượt đọc chậm phình 79 MB từ đúng cùng một vòng lặp. Cứ để bên đọc chậm và cứ log tiếp, con số ấy leo mãi cho tới khi OOM killer tới.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cái cờ báo cho bạn đã ở đó suốt</span><span class="lz-d"><code>writableNeedDrain === true</code> là Node đang nói &quot;tôi đang đệm hộ anh và tôi muốn anh dừng lại&quot;. Gần như không ứng dụng nào đọc nó.</span></div>
</div>
<p>Nói lại phát hiện cho thẳng, vì nó là lý do bài này tồn tại: <strong>một trình thu log chậm là một chỗ rò rỉ bộ nhớ trong ứng dụng của bạn.</strong> Không phải trong trình thu. Trong cái tiến trình chỉ đang ghi ra stdout, không hề biết có gì sai, và là cái sẽ chết.</p>

<h3>Vì sao Docker biến đây thành trường hợp mặc định</h3>
<pre><code>tiến trình của bạn          docker daemon              nơi lưu
──────────────────          ─────────────              ───────
console.log ──▶ fd 1 ──▶ ỐNG ──▶ trình json-file ──▶ /var/lib/docker/
                          ▲                            containers/…-json.log
                          │
              chỗ này LUÔN là một cái ống. Không có
              cấu hình nào biến nó thành file được.</code></pre>
<p>Mọi tiến trình Node chạy trong container trên VPS này đều ghi vào một cái ống do docker daemon giữ. Vậy nên hàng &quot;ống&quot; ở sơ đồ đầu bài không phải một ca hiếm bạn có thể gặp — nó là hàng duy nhất mô tả production. Daemon thường là bên đọc nhanh, nên chuyện này ẩn mình hàng tháng trời. Nó thôi nhanh đúng lúc cái đĩa chứa <code>/var/lib/docker</code> đầy, mà đó chính là sự cố kho này đã dính một lần rồi.</p>

<h3>Ba lớp phòng thủ, xếp theo cái giá phải trả</h3>
<pre><code>1. Log ít đi.       Ít dòng hơn là cách chữa duy nhất không có mặt trái.
                    Kỷ luật mức log ở bài 1.3 chính là lớp phòng thủ này.

2. Đừng đệm         Ghi ra FILE, để một sidecar tail cái file đó.
   trong app.       fd 1 → file là đồng bộ: page cache của nhân hứng
                    cơn dồn, chứ không phải heap của bạn. Kiến trúc
                    trình thu log ở Chương 2 tồn tại là vì thế.

3. Chặn trần        Đọc writableLength trước khi log; bỏ dòng khi nó
   bộ đệm.          vượt ngưỡng. Mất mấy dòng debug còn hơn mất cả
                    tiến trình. Xấu, hiệu quả, và gần như không ai làm.</code></pre>
<pre><code class="language-javascript">// Lớp 3, ~6 dòng, đặt trong emit() của src/utils/logger.ts
const MAX_BUFFERED = 8 * 1024 * 1024;          // 8 MB stdout đang xếp hàng
let dropped = 0;

if (process.stdout.writableLength &gt; MAX_BUFFERED) {
  dropped++;                                    // đếm nó, đừng để biến mất im lặng
  if (level !== 'error') return;                // lỗi thì luôn được đi qua
}
if (dropped &amp;&amp; process.stdout.writableLength &lt; MAX_BUFFERED / 2) {
  const n = dropped; dropped = 0;
  console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'warn', msg: 'đã bỏ log vì nghẽn', dropped: n }));
}
</code></pre>
<p>Để ý hình dạng của nó: nó bỏ, nó đếm cái đã bỏ, và nó báo con số ấy khi áp lực đã hạ. Một lớp phòng thủ vứt dữ liệu trong im lặng là đem một cú sập nhìn thấy được đổi lấy một lỗ hổng vô hình trong bằng chứng của bạn — mà với một hệ thống quan sát thì đó là cái tệ hơn trong hai.</p>

<div class="pitfall">
<p><strong>Bẫy — mấy dòng log của cú sập chính là mấy dòng bạn mất.</strong> Vì ghi qua ống là không đồng bộ, những dòng đang nằm trong bộ đệm của <code>process.stdout</code> sẽ mất nếu tiến trình kết thúc trước khi chúng thoát hết. <code>process.exit()</code> không chờ. Trình xử lý mặc định của một ngoại lệ không bắt cũng không, <code>SIGKILL</code> từ OOM killer cũng không, <code>docker kill</code> cũng không. Hệ quả thực tế thì chính xác và khó chịu: <strong>trong lúc sự cố, khi log dồn lên và bộ đệm sâu nhất, mấy giây log cuối cùng — đúng mấy giây giải thích cú sập — lại là mấy giây không bao giờ xuống tới đĩa.</strong> Đây là lý do log của một sự cố hay dừng lại trước dấu thời gian của cú sập vài giây. Nếu chỉ lấy một thói quen vận hành từ chương này, hãy lấy cái này: trong trình xử lý <code>SIGTERM</code>, ngừng nhận request rồi để vòng lặp sự kiện tự cạn thay vì gọi <code>process.exit()</code> — một vòng lặp rỗng tự thoát, và chỉ tới lúc đó các bộ đệm mới thật sự được xả.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#a-note-on-process-io" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Node.js — Ghi chú về I/O của process</span><span class="lc-sub">Bảng chính thức nói đích stdout nào ghi đồng bộ và đích nào không. Ngắn, và là nguồn của sơ đồ ba hàng ở đầu bài.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/stream.html#buffering" target="_blank" rel="noopener">
  <span class="lc-ico">🚰</span>
  <span class="lc-body"><span class="lc-title">Node.js Streams — Đệm và nghẽn ngược</span><span class="lc-sub">writableLength, writableNeedDrain và sự kiện &#96;drain&#96; nghĩa là gì, và cái giao kèo mà một bên ghi tử tế lẽ ra phải tôn trọng.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra chương 1',
      slug: 'obs-1-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về log có cấu trúc, mức log, chi phí đo thật và nghẽn ngược stdout.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 1 · Quiz</span><h2>Six questions on structured logging</h2><p class="lead">Every answer here is a number or a mechanism measured in chapter 1, not an opinion about best practice. If two options both sound reasonable, the correct one is the one that names the mechanism.</p></div><div class="ml-vi"><span class="eyebrow">Chương 1 · Kiểm tra</span><h2>Sáu câu về log có cấu trúc</h2><p class="lead">Mọi đáp án ở đây là một con số hoặc một cơ chế đã đo trong chương 1, không phải một ý kiến về thông lệ tốt. Nếu hai lựa chọn nghe đều hợp lý, cái đúng là cái gọi tên được cơ chế.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Measured on Node 22, which part of this repo\'s production log line is the most expensive?|||Đo trên Node 22, phần nào của một dòng log production trong kho này là đắt nhất?',
            options: [
              'new Date().toISOString(), at roughly 740 ns — more than the JSON.stringify it sits inside. The four measurements went 15 → 19 → 571 → 1310 ns/line, and the last jump is the timestamp alone.|||new Date().toISOString(), khoảng 740 ns — nhiều hơn cả cái JSON.stringify chứa nó. Bốn phép đo đi 15 → 19 → 571 → 1310 ns/dòng, và bước nhảy cuối cùng chỉ là dấu thời gian.',
              'JSON.stringify, which dominates everything else in the line|||JSON.stringify, thứ lấn át mọi phần khác trong dòng log',
              'The string interpolation of the context fields|||Việc nội suy chuỗi cho các trường ngữ cảnh',
              'The level check at the top of emit()|||Phép kiểm mức log ở đầu hàm emit()',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The same 20,000-line loop took 57 ms to a file and 100 ms through a pipe. Why does the destination change the cost?|||Cùng một vòng lặp 20.000 dòng tốn 57 ms ra file và 100 ms qua ống. Vì sao đích đến làm đổi chi phí?',
            options: [
              'Because Node writes synchronously to files and TTYs but asynchronously to pipes — the pipe path adds stream machinery, buffering and event-loop work per line that the direct write does not have.|||Vì Node ghi đồng bộ vào file và TTY nhưng ghi không đồng bộ vào ống — đường ống thêm bộ máy stream, đệm và việc của vòng lặp sự kiện cho mỗi dòng, thứ mà phép ghi thẳng không có.',
              'Because pipes have a smaller kernel buffer than files|||Vì ống có bộ đệm nhân nhỏ hơn file',
              'Because the reading process on the other end is slow|||Vì tiến trình đọc ở đầu kia thì chậm',
              'Because writing to a file skips the JSON serialisation|||Vì ghi ra file thì bỏ qua bước tuần tự hoá JSON',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A log shipper stalls. Your Node process keeps calling console.log. What happens, and to whom?|||Một trình thu log nghẽn lại. Tiến trình Node của bạn cứ tiếp tục gọi console.log. Chuyện gì xảy ra, và với ai?',
            options: [
              'The unwritten text accumulates in your process\'s heap: measured at 47.8 MB queued and RSS 43 → 122 MB for 400,000 lines, with no error and no blocking. The shipper is fine; your application is the one that will hit its memory limit.|||Phần chữ chưa ghi được dồn lại trong heap của tiến trình bạn: đo được 47,8 MB đang xếp hàng và RSS 43 → 122 MB cho 400.000 dòng, không lỗi và không chặn. Trình thu vẫn ổn; ứng dụng của bạn mới là cái sẽ chạm trần bộ nhớ.',
              'console.log starts blocking until the shipper catches up, slowing requests|||console.log bắt đầu chặn cho tới khi trình thu theo kịp, làm request chậm lại',
              'Node throws EPIPE and the lines are dropped|||Node ném EPIPE và các dòng bị vứt bỏ',
              'The kernel buffers it; the application\'s memory is unaffected|||Nhân đệm giúp; bộ nhớ của ứng dụng không bị ảnh hưởng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why do the last few seconds of log so often go missing right before a crash?|||Vì sao mấy giây log cuối cùng hay biến mất ngay trước một cú sập?',
            options: [
              'Because pipe writes are asynchronous, so lines still in process.stdout\'s buffer are lost if the process ends before they drain — and process.exit(), an uncaught exception, SIGKILL and docker kill all end it without waiting. Logging spikes during an incident, so the buffer is deepest exactly when the evidence matters most.|||Vì ghi qua ống là không đồng bộ, nên những dòng còn nằm trong bộ đệm của process.stdout sẽ mất nếu tiến trình kết thúc trước khi chúng thoát hết — mà process.exit(), một ngoại lệ không bắt, SIGKILL và docker kill đều kết thúc nó mà không chờ. Log dồn lên trong lúc sự cố, nên bộ đệm sâu nhất đúng lúc bằng chứng quan trọng nhất.',
              'Because the log shipper batches and the last batch is never sent|||Vì trình thu log gom theo lô và lô cuối không bao giờ được gửi',
              'Because the timestamps drift when the process is under load|||Vì dấu thời gian trôi lệch khi tiến trình chịu tải',
              'Because log rotation truncates the file at the moment of the crash|||Vì việc xoay vòng log cắt cụt file ngay lúc sập',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What separates warn from error in a level scheme that still means something after a year?|||Cái gì tách warn khỏi error trong một hệ mức log vẫn còn ý nghĩa sau một năm?',
            options: [
              'Whether a human has to do something. error means the request failed and someone must look; warn means the system recovered on its own but the recovery is worth counting. The moment warn is used for "unusual but fine", nobody reads it and it stops carrying information.|||Chuyện có cần một con người làm gì đó hay không. error nghĩa là request đã hỏng và ai đó phải xem; warn nghĩa là hệ thống tự phục hồi được nhưng lần phục hồi ấy đáng được đếm. Ngay khi warn bị dùng cho "lạ nhưng không sao", chẳng ai đọc nó nữa và nó thôi mang thông tin.',
              'Severity of the underlying exception object|||Mức nghiêm trọng của đối tượng ngoại lệ bên dưới',
              'Whether the response status code was 4xx or 5xx|||Mã trạng thái phản hồi là 4xx hay 5xx',
              'Whether the line contains a stack trace|||Dòng log có chứa stack trace hay không',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You add req.body to every request log so debugging is easier. What did you just do?|||Bạn thêm req.body vào mọi dòng log request cho dễ gỡ lỗi. Bạn vừa làm gì?',
            options: [
              'Wrote passwords, tokens and private note content into log storage, and into every downstream system that reads it — with a retention period measured in weeks and an access list far wider than the database\'s. The fields you must never log are decided by what the field can contain, not by what today\'s callers happen to send.|||Ghi mật khẩu, token và nội dung ghi chú riêng tư vào nơi lưu log, và vào mọi hệ thống hạ nguồn đọc nó — với thời hạn lưu tính bằng tuần và danh sách người xem rộng hơn nhiều so với của cơ sở dữ liệu. Những trường không bao giờ được log là do trường ấy CÓ THỂ chứa gì quyết định, không phải do những chỗ gọi hôm nay tình cờ gửi gì.',
              'Nothing risky, as long as the log storage is private|||Không có gì rủi ro, miễn là nơi lưu log ở chế độ riêng tư',
              'Increased log volume, which is the only real cost here|||Làm tăng lượng log, và đó là cái giá thật duy nhất ở đây',
              'Made the logs more useful with no trade-off worth naming|||Làm log hữu ích hơn mà không có đánh đổi nào đáng nêu tên',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
