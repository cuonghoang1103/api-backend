/**
 * Observability — Chương 3 — Correlation: làm một request lần theo được.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 3 — Correlation: making one request traceable|||Chương 3 — Correlation: làm một request lần theo được',
  slug: 'obs-ch3-correlation',
  description: 'Request ID, AsyncLocalStorage, đi qua ranh giới dịch vụ, và W3C trace context.',
  sortOrder: 4,
  lessons: [
    {
      title: '3.1 — The id that goes nowhere|||3.1 — Cái id chẳng đi tới đâu',
      slug: 'obs-3-1-id-di-den-hu-vo',
      type: 'VIDEO',
      description: 'Kho này SINH ra request id và trả nó cho client — rồi không log nó lấy một lần. Ghi một lần, đọc không lần nào.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The id that goes nowhere</h2>
<p class="lead">Chapters 1 and 2 got your log lines written, shipped and queryable. Now the harder question: given ten thousand lines a minute from seven containers, how do you pull out the forty that belong to <em>this</em> broken request? This repository already has the answer half-built — and the missing half is one line of code.</p>

<h3>What this repo already does, correctly</h3>
<pre><code class="language-typescript">// src/index.ts:221 — this is good code
app.use((req: Request, res: Response, next) =&gt; {
  const incoming = (req.headers['x-request-id'] as string | undefined)?.trim();
  const id = incoming &amp;&amp; incoming.length &lt;= 64 ? incoming : nanoid(12);
  (req as any).id = id;
  res.setHeader('X-Request-ID', id);
  next();
});</code></pre>
<p>Three decisions in six lines, all of them right:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It honours an inbound id</span><span class="lz-d">If nginx or a client already assigned one, keep it. Generating a fresh id at each hop is how a single request ends up with four unrelated ids and no way to join them.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It bounds the length at 64</span><span class="lz-d">The header is attacker-controlled. Without the cap, a client can put a megabyte of text into every log line you write — a log-volume attack that costs them nothing.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It echoes the id back</span><span class="lz-d"><code>X-Request-ID</code> in the response means a user reporting a bug can hand you the exact id. That turns &quot;it broke around 3pm&quot; into an exact-match lookup.</span></div>
</div>

<h3>And then nothing reads it</h3>
<pre><code class="language-bash">$ grep -rn "req as any).id\\|req\\.id\\b" src/ --include=*.ts | grep -v req.ip
src/index.ts:218:// echo it back in &#96;X-Request-ID&#96;, and expose it on &#96;req.id&#96; so logs
src/index.ts:225:  (req as any).id = id;</code></pre>
<p>One write. One comment describing the intent. <strong>Zero reads.</strong> The comment above the middleware says the id exists &quot;so logs and error reports can be tied to a single request during an incident&quot; — and that is exactly what does not happen, because no log call ever includes it:</p>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts:33 — the most important log line in the app
logger.error('Express error handler', {
  path: req.path,
  method: req.method,
  // ...no id
});</code></pre>
<p>So the state today is precise and a little absurd: a user can send you a screenshot showing <code>X-Request-ID: V1StGXR8_Z5j</code>, and there is no query that finds it. The id was generated, returned, and discarded.</p>

<h3>Why the obvious fix is the wrong one</h3>
<pre><code>Option A: pass req into everything.

  router.post('/notes', (req, res) =&gt; createNote(req, body))
  createNote(req, body)   → validateOwner(req, ...)
                          → chargeQuota(req, ...)
                          → embedNote(req, ...)

  This repository has 101 service files. Threading req through
  all of them means:
    · every service signature changes
    · services now depend on Express types
    · a background job has no req at all, so half of them
      need a second code path
    · you will forget one, and it fails SILENTLY — the log
      line still gets written, just without the id


Option B: a module-level "current request" variable.

  let currentId = null   // ⚠️ THIS IS BROKEN

  Node handles many requests concurrently. Request B overwrites
  currentId while request A is awaiting the database. A's next
  log line carries B's id. You now have logs that are worse
  than useless: confidently wrong.</code></pre>
<p>Option B deserves a moment, because it is the one people actually ship. It appears to work in development, where you are the only user and requests never overlap. It corrupts data in production, where they always do, and the corruption is invisible — the lines look fine.</p>

<h3>What the right answer needs to be</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Ambient</span><span class="lz-t">Reachable without being passed</span><span class="lz-d">Any code, at any depth, can ask for the current id. No signature changes, so services stay free of Express types.</span></div>
  <div class="lz-node"><span class="lz-k">Per-request</span><span class="lz-t">Isolated across concurrent work</span><span class="lz-d">Request A's context must survive A awaiting the database while B runs. This is the requirement that kills the module-level variable.</span></div>
  <div class="lz-node"><span class="lz-k">Automatic</span><span class="lz-t">Applied by the logger, not the caller</span><span class="lz-d">If each of the 370 <code>logger.*</code> calls in this repo has to remember to add the id, some will not. It must be added in <code>emit()</code>, once.</span></div>
</div>
<p>Node has exactly one primitive that provides all three, it has been stable since Node 16, and lesson 3.2 measures what it costs. It is called <code>AsyncLocalStorage</code>.</p>

<h3>One id, or several?</h3>
<pre><code>request id     One per HTTP request. Generated at the edge.
               Answers: "show me everything about THIS request."
               This is the one to build first. It is 90% of
               the value for 5% of the work.

trace id       One per logical operation, which may span
               several services and several requests.
               Answers: "show me everything about this
               user action, across all systems." Lesson 3.4.

session id     One per login. Useful, but do not put it in
               logs — lesson 1.2 applies, it identifies a
               person across every line they generate.

user id        Not a correlation id. It is personal data with
               a retention policy attached. Log it only where
               you have decided it belongs.</code></pre>

<div class="pitfall">
<p><strong>Trap — trusting an inbound <code>X-Request-ID</code> that came from the internet.</strong> The middleware above accepts a client-supplied id, which is correct behind a proxy you control and dangerous when the request reaches Express directly. Two consequences, both quiet. First, an id is a <em>join key</em>: a client that sends the same id on every request merges its traffic with someone else's in your queries, and one that copies an id from another user's response header can pollute that user's timeline. Second, the id lands in log storage, so its character set matters — a newline in it forges a log entry, and unescaped control characters break the tools that read it. The 64-character cap is necessary but not sufficient. <strong>Accept an inbound id only when the request arrived through your proxy, and validate its shape, not just its length:</strong> <code>/^[A-Za-z0-9_-]{8,64}$/</code>, else generate your own.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_context.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">Node.js — AsyncLocalStorage</span><span class="lc-sub">The primitive that solves this, with the exact semantics of run(), getStore() and how context survives an await.</span></span>
</a>
<a class="link-card dl" href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">W3C Trace Context</span><span class="lc-sub">The standard header format for propagating ids between services — why lesson 3.4 recommends it over inventing your own.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Cái id chẳng đi tới đâu</h2>
<p class="lead">Chương 1 và 2 đã lo cho các dòng log của bạn được ghi, được thu, và hỏi được. Giờ tới câu hỏi khó hơn: giữa mười nghìn dòng mỗi phút từ bảy container, làm sao bạn moi ra bốn mươi dòng thuộc về <em>cái</em> request đang hỏng này? Kho này đã dựng sẵn một nửa câu trả lời — và nửa còn thiếu là một dòng mã.</p>

<h3>Thứ kho này đã làm, và làm đúng</h3>
<pre><code class="language-typescript">// src/index.ts:221 — đây là mã tốt
app.use((req: Request, res: Response, next) =&gt; {
  const incoming = (req.headers['x-request-id'] as string | undefined)?.trim();
  const id = incoming &amp;&amp; incoming.length &lt;= 64 ? incoming : nanoid(12);
  (req as any).id = id;
  res.setHeader('X-Request-ID', id);
  next();
});</code></pre>
<p>Ba quyết định trong sáu dòng, và cả ba đều đúng:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó tôn trọng id đến từ ngoài</span><span class="lz-d">Nếu nginx hay client đã gán một cái rồi thì giữ lấy. Sinh id mới ở mỗi chặng chính là cách một request đơn lẻ kết thúc với bốn cái id không liên quan và không có cách nào ghép lại.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó chặn độ dài ở 64</span><span class="lz-d">Cái header do phía tấn công điều khiển được. Không có cái trần này, một client có thể nhét một megabyte chữ vào mọi dòng log bạn ghi — một đòn tấn công vào lượng log mà chẳng tốn của họ gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó trả id ngược về</span><span class="lz-d"><code>X-Request-ID</code> trong phản hồi nghĩa là một người dùng báo lỗi có thể đưa cho bạn đúng cái id đó. Điều ấy biến &quot;nó hỏng khoảng 3 giờ chiều&quot; thành một phép tra khớp chính xác.</span></div>
</div>

<h3>Rồi chẳng có gì đọc nó cả</h3>
<pre><code class="language-bash">$ grep -rn "req as any).id\\|req\\.id\\b" src/ --include=*.ts | grep -v req.ip
src/index.ts:218:// echo it back in &#96;X-Request-ID&#96;, and expose it on &#96;req.id&#96; so logs
src/index.ts:225:  (req as any).id = id;</code></pre>
<p>Một lần ghi. Một dòng chú thích mô tả ý định. <strong>Không lần đọc nào.</strong> Chú thích phía trên middleware nói cái id tồn tại &quot;để log và báo cáo lỗi buộc được vào một request duy nhất trong lúc sự cố&quot; — và đó chính là điều KHÔNG xảy ra, vì không lời gọi log nào từng kèm nó:</p>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts:33 — dòng log quan trọng nhất trong app
logger.error('Express error handler', {
  path: req.path,
  method: req.method,
  // ...không có id
});</code></pre>
<p>Nên trạng thái hôm nay thì chính xác và hơi phi lý: người dùng gửi cho bạn một ảnh chụp màn hình có <code>X-Request-ID: V1StGXR8_Z5j</code>, và không có truy vấn nào tìm ra nó. Cái id đã được sinh ra, được trả về, rồi bị vứt đi.</p>

<h3>Vì sao cách chữa hiển nhiên lại là cách sai</h3>
<pre><code>Cách A: truyền req vào mọi thứ.

  router.post('/notes', (req, res) =&gt; createNote(req, body))
  createNote(req, body)   → validateOwner(req, ...)
                          → chargeQuota(req, ...)
                          → embedNote(req, ...)

  Kho này có 101 file service. Xâu req qua hết chúng nghĩa là:
    · mọi chữ ký hàm service đều đổi
    · service giờ phụ thuộc vào kiểu dữ liệu của Express
    · một việc chạy nền chẳng có req nào cả, nên một nửa số đó
      cần một nhánh mã thứ hai
    · bạn sẽ quên một chỗ, và nó hỏng TRONG IM LẶNG — dòng log
      vẫn được ghi, chỉ là không có id


Cách B: một biến "request hiện tại" ở cấp module.

  let currentId = null   // ⚠️ CÁI NÀY HỎNG

  Node xử lý nhiều request đồng thời. Request B ghi đè currentId
  trong lúc request A đang await cơ sở dữ liệu. Dòng log kế tiếp
  của A mang id của B. Giờ bạn có những dòng log tệ hơn cả vô
  dụng: sai một cách tự tin.</code></pre>
<p>Cách B đáng dừng lại một nhịp, vì nó là cái người ta thật sự đem lên production. Nó có vẻ chạy được lúc phát triển, khi bạn là người dùng duy nhất và các request không bao giờ chồng lấn. Nó làm hỏng dữ liệu trên production, nơi chúng luôn chồng lấn, và sự hỏng hóc ấy vô hình — mấy dòng log trông vẫn ổn.</p>

<h3>Câu trả lời đúng cần phải là gì</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Bao quanh</span><span class="lz-t">Với tới được mà không cần truyền vào</span><span class="lz-d">Bất cứ đoạn mã nào, ở bất cứ độ sâu nào, đều hỏi được id hiện tại. Không đổi chữ ký hàm, nên service vẫn sạch bóng kiểu của Express.</span></div>
  <div class="lz-node"><span class="lz-k">Theo từng request</span><span class="lz-t">Cách ly giữa các việc chạy đồng thời</span><span class="lz-d">Ngữ cảnh của request A phải sống sót qua việc A await cơ sở dữ liệu trong khi B chạy. Đây là yêu cầu giết chết cái biến cấp module.</span></div>
  <div class="lz-node"><span class="lz-k">Tự động</span><span class="lz-t">Do logger gắn vào, không phải người gọi</span><span class="lz-d">Nếu từng cái trong 370 lời gọi <code>logger.*</code> của kho này phải nhớ tự thêm id, sẽ có cái không nhớ. Nó phải được thêm trong <code>emit()</code>, một lần.</span></div>
</div>
<p>Node có đúng một nguyên thuỷ cung cấp cả ba thứ đó, nó đã ổn định từ Node 16, và bài 3.2 đo xem nó tốn bao nhiêu. Nó tên là <code>AsyncLocalStorage</code>.</p>

<h3>Một id, hay nhiều?</h3>
<pre><code>request id     Một cái cho mỗi request HTTP. Sinh ở rìa ngoài.
               Trả lời: "cho tôi xem mọi thứ về CÁI request này."
               Đây là cái nên dựng trước. Nó là 90% giá trị với
               5% công sức.

trace id       Một cái cho mỗi thao tác lô-gíc, thứ có thể trải
               qua nhiều dịch vụ và nhiều request.
               Trả lời: "cho tôi xem mọi thứ về hành động này
               của người dùng, xuyên mọi hệ thống." Bài 3.4.

session id     Một cái cho mỗi lần đăng nhập. Hữu ích, nhưng
               đừng đưa vào log — bài 1.2 áp dụng ở đây, nó
               định danh một con người xuyên mọi dòng họ sinh ra.

user id        Không phải id để ghép. Nó là dữ liệu cá nhân kèm
               một chính sách lưu trữ. Chỉ log nó ở chỗ bạn đã
               quyết định là nó thuộc về.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tin một <code>X-Request-ID</code> đến từ Internet.</strong> Middleware ở trên chấp nhận một id do client cung cấp, điều đó đúng khi đứng sau một proxy bạn kiểm soát và nguy hiểm khi request tới thẳng Express. Hai hệ quả, đều lặng lẽ. Thứ nhất, một id là một <em>khoá ghép</em>: một client gửi cùng một id ở mọi request sẽ trộn lưu lượng của nó vào của người khác trong truy vấn của bạn, còn một client chép id từ header phản hồi của người dùng khác thì làm bẩn dòng thời gian của người đó. Thứ hai, cái id rơi vào kho log, nên tập ký tự của nó quan trọng — một ký tự xuống dòng trong đó là giả mạo được một mục log, và các ký tự điều khiển không được thoát sẽ làm hỏng công cụ đọc nó. Cái trần 64 ký tự là cần nhưng chưa đủ. <strong>Chỉ chấp nhận id từ ngoài khi request đã đi qua proxy của bạn, và hãy kiểm hình dạng của nó chứ không chỉ độ dài:</strong> <code>/^[A-Za-z0-9_-]{8,64}$/</code>, không khớp thì tự sinh cái của mình.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_context.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">Node.js — AsyncLocalStorage</span><span class="lc-sub">Nguyên thuỷ giải bài này, kèm ngữ nghĩa chính xác của run(), getStore() và cách ngữ cảnh sống sót qua một lần await.</span></span>
</a>
<a class="link-card dl" href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">W3C Trace Context</span><span class="lc-sub">Định dạng header chuẩn để truyền id giữa các dịch vụ — vì sao bài 3.4 khuyên dùng nó thay vì tự nghĩ ra cái của mình.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '3.2 — AsyncLocalStorage, and what it actually costs|||3.2 — AsyncLocalStorage, và nó thật sự tốn bao nhiêu',
      slug: 'obs-3-2-asynclocalstorage',
      type: 'VIDEO',
      description: 'Đo thật: 677 ns mỗi request, và getStore() gần như miễn phí. Cái tiếng "ALS chậm" không đứng vững.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>AsyncLocalStorage, and what it actually costs</h2>
<p class="lead">Lesson 3.1 listed three requirements — ambient, per-request, automatic — that no ordinary variable can satisfy. <code>AsyncLocalStorage</code> satisfies all three. It also has a reputation for being slow, repeated far more often than it is measured. So we measure it.</p>

<h3>The mechanism, in one picture</h3>
<pre><code>als.run(store, callback)
    │
    ├─ callback runs, and everything it calls,
    │  and everything THOSE call, synchronously or not,
    │  sees the same store via als.getStore()
    │
    └─ the store follows the async chain:
         await db.query()        ← survives
         setTimeout(fn, 100)     ← survives
         promise.then(fn)        ← survives
         emitter.on('x', fn)     ← survives IF .on() was
                                   registered inside run()

Two concurrent requests each get their own store.
Neither can see the other's. That is the whole point.</code></pre>
<p>Node implements this on top of <code>async_hooks</code>, which the runtime uses to track how one asynchronous operation leads to another. The context is attached to that chain, not to a variable, which is why interleaved requests cannot corrupt each other.</p>

<h3>The measurement</h3>
<pre><code class="language-javascript">// m10.mjs — 200,000 iterations, after a 5,000-iteration warm-up
import { AsyncLocalStorage } from 'node:async_hooks';
const als = new AsyncLocalStorage();
const work = async () =&gt; { await null; await Promise.resolve(); return 1; };

await bench('no ALS (baseline)', work);
await bench('ALS: run() + one getStore()', () =&gt;
  als.run({ id: 'r_abc123' }, async () =&gt; { const s = als.getStore(); await work(); return s.id; }));
await bench('ALS: run() + ten getStore()', () =&gt;
  als.run({ id: 'r_abc123' }, async () =&gt; {
    let x; for (let j = 0; j &lt; 10; j++) x = als.getStore().id; await work(); return x; }));
</code></pre>
<div class="out">$ node m10.mjs
không ALS (mốc)                                   238 ns/thao tác
ALS: run() + getStore() một lần                   915 ns/thao tác
ALS: run() + getStore() 10 lần (10 dòng log)      897 ns/thao tác
truyền tay id qua tham số                         757 ns/thao tác

ALS cộng thêm mỗi request         677 ns
mỗi lần getStore() thêm            -2 ns
so với 1.310 ns dựng một dòng log: 51.7% chi phí của MỘT dòng log
ở 500 rps, ALS tốn                0.0339% của một nhân</div>

<h3>Three findings, and the third is the useful one</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">677 ns per request, once</span><span class="lz-d">Roughly half the cost of writing a single log line, measured in lesson 1.4. At 500 rps that is 0.034% of one core — about a thousandth of the budget you already spend on logging.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>getStore()</code> is free</span><span class="lz-d">Ten calls measured 2 ns <em>faster</em> than one, which is noise: the cost is not measurable at this resolution. It is a pointer read off the current async resource.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The cost is <code>run()</code>, so call it once</span><span class="lz-d">This is the actionable finding. One <code>als.run()</code> per request in middleware: 677 ns. One per service call, nested: 677 ns each. The design that reads better is also the fast one.</span></div>
</div>
<p>The reputation for slowness is real history, not myth — <code>async_hooks</code> was genuinely expensive before Node 16, and advice written then is still being repeated. On Node 22, in the shape you would actually use, it costs less than the log line it exists to improve.</p>

<h3>Wiring it into this repository</h3>
<pre><code class="language-typescript">// src/utils/requestContext.ts — new file, 12 lines
import { AsyncLocalStorage } from 'node:async_hooks';

type Ctx = { requestId: string; userId?: string; route?: string };
export const requestContext = new AsyncLocalStorage&lt;Ctx&gt;();

/** The current request's context, or undefined in background work. */
export const currentContext = (): Ctx | undefined =&gt; requestContext.getStore();</code></pre>
<pre><code class="language-typescript">// src/index.ts — the existing middleware, now three lines longer
app.use((req: Request, res: Response, next) =&gt; {
  const incoming = (req.headers['x-request-id'] as string | undefined)?.trim();
  const id = incoming &amp;&amp; /^[A-Za-z0-9_-]{8,64}$/.test(incoming) ? incoming : nanoid(12);
  (req as any).id = id;
  res.setHeader('X-Request-ID', id);
  requestContext.run({ requestId: id, route: req.path }, next);   // ← the whole fix
});</code></pre>
<pre><code class="language-typescript">// src/utils/logger.ts — inside emit(), ONE line
function emit(level: Level, message: string, context?: Record&lt;string, unknown&gt;): void {
  if (level === 'debug' &amp;&amp; config.nodeEnv === 'production') return;
  const ctx = currentContext();                                    // ← and this
  const record = { ts: new Date().toISOString(), level, msg: message,
                   ...(ctx ? { requestId: ctx.requestId } : {}), ...(context || {}) };
  // ...unchanged
}</code></pre>
<p>That is the entire change: one new twelve-line file, one word in the middleware, one line in <code>emit()</code>. All 370 existing <code>logger.*</code> calls gain a <code>requestId</code> without being touched, including the ones inside services that know nothing about HTTP.</p>

<h3>Passing <code>next</code> to <code>run()</code> is the trick worth understanding</h3>
<pre><code>requestContext.run({ requestId: id }, next)
                                       │
                                       └─ next() is CALLED INSIDE
                                          the store's scope.

Everything downstream of this middleware — every later
middleware, the router, the handler, every service it awaits,
the error handler — runs inside that async chain and sees
the store.

Compare the version that does NOT work:

  requestContext.run({ requestId: id }, () =&gt; {});   // scope
  next();                                            // opens and
                                                     // closes here
                                                     // ⚠️ next() is
                                                     // OUTSIDE it</code></pre>

<h3>Where the context does not reach</h3>
<pre><code>· Background jobs and cron. There is no request, so
  getStore() returns undefined. That is correct, not a bug —
  handle it with a job id instead:
      requestContext.run({ requestId: 'cron_' + nanoid(8) }, task)

· Anything registered OUTSIDE a run() and fired inside it.
  A module-level event listener has no context; the listener
  was created before any request existed.

· Worker threads and child processes. Separate isolates,
  separate async graphs. Pass the id explicitly across that
  boundary — lesson 3.3.

· A promise stored in a module-level cache and awaited by a
  DIFFERENT request. The context follows the code that CREATED
  the promise, so the second request logs the first one's id.
  Rare, and genuinely confusing when it happens.</code></pre>

<div class="pitfall">
<p><strong>Trap — the context is captured when the callback is created, not when it runs.</strong> This is the one failure mode that produces wrong ids rather than missing ones, which makes it far worse. If you register a listener inside a request — <code>emitter.on('done', () =&gt; logger.info('finished'))</code> — that listener keeps request A's context forever, and every later firing logs A's id no matter which request actually triggered it. The same applies to a callback you put in a module-level array, a debounce timer stored outside the request, and any promise you cache and reuse. <strong>Missing context is visible in your logs; borrowed context is not — the line looks perfectly normal and points at the wrong request.</strong> The rule: anything whose lifetime outlives the request must not close over the context. Read the id out into a plain string at registration time if you need it later.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_context.html#class-asynclocalstorage" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">Node.js — the AsyncLocalStorage class</span><span class="lc-sub">run(), enterWith(), exit() and the precise rules for which async operations propagate the store.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">Node.js — async_hooks</span><span class="lc-sub">The layer underneath: how Node tracks that one async operation caused another, which is what makes ambient context possible at all.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>AsyncLocalStorage, và nó thật sự tốn bao nhiêu</h2>
<p class="lead">Bài 3.1 liệt kê ba yêu cầu — bao quanh, theo từng request, tự động — mà không biến thường nào thoả được. <code>AsyncLocalStorage</code> thoả cả ba. Nó cũng mang tiếng là chậm, cái tiếng được nhắc lại nhiều hơn hẳn số lần nó được đo. Vậy ta đo.</p>

<h3>Cơ chế, trong một hình</h3>
<pre><code>als.run(store, callback)
    │
    ├─ callback chạy, và mọi thứ nó gọi, và mọi thứ NHỮNG CÁI ĐÓ
    │  gọi, đồng bộ hay không, đều thấy cùng một store qua
    │  als.getStore()
    │
    └─ store bám theo chuỗi bất đồng bộ:
         await db.query()        ← sống sót
         setTimeout(fn, 100)     ← sống sót
         promise.then(fn)        ← sống sót
         emitter.on('x', fn)     ← sống sót NẾU .on() được đăng ký
                                   bên trong run()

Hai request chạy đồng thời thì mỗi cái có store riêng.
Không cái nào thấy được của cái kia. Đó là toàn bộ mấu chốt.</code></pre>
<p>Node cài đặt cái này trên nền <code>async_hooks</code>, thứ mà runtime dùng để theo dõi một thao tác bất đồng bộ dẫn tới thao tác khác như thế nào. Ngữ cảnh gắn vào cái chuỗi đó, không gắn vào một biến, và đó là lý do các request đan xen nhau không làm hỏng nhau được.</p>

<h3>Phép đo</h3>
<pre><code class="language-javascript">// m10.mjs — 200.000 vòng, sau khi hâm nóng 5.000 vòng
import { AsyncLocalStorage } from 'node:async_hooks';
const als = new AsyncLocalStorage();
const work = async () =&gt; { await null; await Promise.resolve(); return 1; };

await bench('không ALS (mốc)', work);
await bench('ALS: run() + một getStore()', () =&gt;
  als.run({ id: 'r_abc123' }, async () =&gt; { const s = als.getStore(); await work(); return s.id; }));
await bench('ALS: run() + mười getStore()', () =&gt;
  als.run({ id: 'r_abc123' }, async () =&gt; {
    let x; for (let j = 0; j &lt; 10; j++) x = als.getStore().id; await work(); return x; }));
</code></pre>
<div class="out">$ node m10.mjs
không ALS (mốc)                                   238 ns/thao tác
ALS: run() + getStore() một lần                   915 ns/thao tác
ALS: run() + getStore() 10 lần (10 dòng log)      897 ns/thao tác
truyền tay id qua tham số                         757 ns/thao tác

ALS cộng thêm mỗi request         677 ns
mỗi lần getStore() thêm            -2 ns
so với 1.310 ns dựng một dòng log: 51.7% chi phí của MỘT dòng log
ở 500 rps, ALS tốn                0.0339% của một nhân</div>

<h3>Ba phát hiện, và cái thứ ba mới là cái dùng được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">677 ns mỗi request, một lần</span><span class="lz-d">Khoảng một nửa chi phí ghi một dòng log, đo ở bài 1.4. Ở 500 rps đó là 0,034% của một nhân — cỡ một phần nghìn cái ngân sách bạn vốn đã tiêu cho việc log.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>getStore()</code> miễn phí</span><span class="lz-d">Mười lần gọi đo ra nhanh <em>hơn</em> một lần 2 ns, tức là nhiễu: chi phí không đo được ở độ phân giải này. Nó là một phép đọc con trỏ từ tài nguyên bất đồng bộ hiện tại.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chi phí nằm ở <code>run()</code>, nên hãy gọi nó một lần</span><span class="lz-d">Đây mới là phát hiện dùng được. Một <code>als.run()</code> mỗi request trong middleware: 677 ns. Một cái cho mỗi lời gọi service, lồng nhau: 677 ns mỗi cái. Cái thiết kế đọc dễ hơn cũng chính là cái nhanh hơn.</span></div>
</div>
<p>Cái tiếng chậm là lịch sử có thật, không phải chuyện bịa — <code>async_hooks</code> từng thật sự đắt trước Node 16, và lời khuyên viết hồi đó vẫn đang được nhắc lại. Trên Node 22, ở đúng hình dạng bạn sẽ dùng, nó tốn ít hơn cái dòng log mà nó sinh ra để cải thiện.</p>

<h3>Cắm nó vào kho này</h3>
<pre><code class="language-typescript">// src/utils/requestContext.ts — file mới, 12 dòng
import { AsyncLocalStorage } from 'node:async_hooks';

type Ctx = { requestId: string; userId?: string; route?: string };
export const requestContext = new AsyncLocalStorage&lt;Ctx&gt;();

/** Ngữ cảnh của request hiện tại, hoặc undefined trong việc chạy nền. */
export const currentContext = (): Ctx | undefined =&gt; requestContext.getStore();</code></pre>
<pre><code class="language-typescript">// src/index.ts — middleware sẵn có, giờ dài thêm ba dòng
app.use((req: Request, res: Response, next) =&gt; {
  const incoming = (req.headers['x-request-id'] as string | undefined)?.trim();
  const id = incoming &amp;&amp; /^[A-Za-z0-9_-]{8,64}$/.test(incoming) ? incoming : nanoid(12);
  (req as any).id = id;
  res.setHeader('X-Request-ID', id);
  requestContext.run({ requestId: id, route: req.path }, next);   // ← toàn bộ cách chữa
});</code></pre>
<pre><code class="language-typescript">// src/utils/logger.ts — bên trong emit(), MỘT dòng
function emit(level: Level, message: string, context?: Record&lt;string, unknown&gt;): void {
  if (level === 'debug' &amp;&amp; config.nodeEnv === 'production') return;
  const ctx = currentContext();                                    // ← và cái này
  const record = { ts: new Date().toISOString(), level, msg: message,
                   ...(ctx ? { requestId: ctx.requestId } : {}), ...(context || {}) };
  // ...không đổi
}</code></pre>
<p>Đó là toàn bộ thay đổi: một file mới mười hai dòng, một từ trong middleware, một dòng trong <code>emit()</code>. Cả 370 lời gọi <code>logger.*</code> đang có đều có thêm <code>requestId</code> mà không phải đụng tới, kể cả những cái nằm trong service chẳng biết gì về HTTP.</p>

<h3>Truyền <code>next</code> vào <code>run()</code> là mẹo đáng hiểu cho kỹ</h3>
<pre><code>requestContext.run({ requestId: id }, next)
                                       │
                                       └─ next() được GỌI BÊN TRONG
                                          phạm vi của store.

Mọi thứ nằm sau middleware này — mọi middleware kế tiếp, router,
handler, mọi service nó await, cả bộ xử lỗi — đều chạy trong
chuỗi bất đồng bộ đó và đều thấy store.

So với phiên bản KHÔNG chạy:

  requestContext.run({ requestId: id }, () =&gt; {});   // phạm vi mở
  next();                                            // rồi đóng
                                                     // ngay ở đây
                                                     // ⚠️ next() nằm
                                                     // NGOÀI nó</code></pre>

<h3>Chỗ ngữ cảnh không với tới</h3>
<pre><code>· Việc chạy nền và cron. Không có request nào, nên getStore()
  trả về undefined. Thế là đúng, không phải lỗi — xử lý bằng
  một id công việc:
      requestContext.run({ requestId: 'cron_' + nanoid(8) }, task)

· Bất cứ thứ gì đăng ký NGOÀI một run() rồi kích hoạt bên trong.
  Một listener ở cấp module không có ngữ cảnh nào; listener ấy
  được tạo ra trước khi có bất cứ request nào tồn tại.

· Worker thread và tiến trình con. Isolate riêng, đồ thị bất
  đồng bộ riêng. Truyền id qua ranh giới đó một cách tường
  minh — bài 3.3.

· Một promise cất trong bộ nhớ đệm cấp module rồi được một
  request KHÁC await. Ngữ cảnh bám theo đoạn mã ĐÃ TẠO RA cái
  promise, nên request thứ hai log ra id của cái thứ nhất.
  Hiếm, và thật sự khó hiểu khi nó xảy ra.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — ngữ cảnh được chộp lại lúc callback được TẠO RA, không phải lúc nó chạy.</strong> Đây là kiểu hỏng duy nhất sinh ra id SAI thay vì id THIẾU, và điều đó làm nó tệ hơn nhiều. Nếu bạn đăng ký một listener bên trong một request — <code>emitter.on('done', () =&gt; logger.info('finished'))</code> — cái listener ấy giữ ngữ cảnh của request A mãi mãi, và mọi lần kích hoạt sau này đều log id của A bất kể request nào thật sự đã kích hoạt nó. Điều tương tự đúng với một callback bạn nhét vào một mảng cấp module, một bộ hẹn giờ debounce cất ngoài request, và bất cứ promise nào bạn đệm lại rồi dùng lại. <strong>Ngữ cảnh THIẾU thì nhìn thấy được trong log; ngữ cảnh MƯỢN thì không — dòng log trông hoàn toàn bình thường và trỏ vào sai request.</strong> Quy tắc: bất cứ thứ gì sống lâu hơn request thì không được bao lấy ngữ cảnh. Cần dùng về sau thì hãy đọc cái id ra thành một chuỗi thường ngay lúc đăng ký.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_context.html#class-asynclocalstorage" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">Node.js — lớp AsyncLocalStorage</span><span class="lc-sub">run(), enterWith(), exit() và luật chính xác về việc thao tác bất đồng bộ nào thì truyền store đi tiếp.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/async_hooks.html" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">Node.js — async_hooks</span><span class="lc-sub">Tầng bên dưới: cách Node theo dõi việc một thao tác bất đồng bộ gây ra thao tác khác, thứ làm cho ngữ cảnh bao quanh khả thi ngay từ đầu.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '3.3 — Crossing boundaries: proxy, database, queue, worker|||3.3 — Đi qua ranh giới: proxy, cơ sở dữ liệu, hàng đợi, worker',
      slug: 'obs-3-3-qua-ranh-gioi',
      type: 'VIDEO',
      description: 'nginx của kho này KHÔNG truyền X-Request-ID, nên nhánh "tôn trọng id đến từ ngoài" chưa từng chạy. Vá cả bốn ranh giới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Crossing boundaries: proxy, database, queue, worker</h2>
<p class="lead">A context that stops at the edge of one process is worth much less than it looks. This lesson walks the four boundaries a request in this repository actually crosses, and shows what each one drops — starting with a boundary that has been silently dropping the id since the middleware was written.</p>

<h3>Boundary 1: nginx → Express, and the branch that never runs</h3>
<p>Lesson 3.1 praised the middleware for honouring an inbound <code>X-Request-ID</code>. Check whether anything sends one:</p>
<pre><code class="language-bash">$ grep -n "proxy_set_header" nginx/nginx.conf
171:  proxy_set_header Host $host;
172:  proxy_set_header X-Real-IP $remote_addr;
173:  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
174:  proxy_set_header X-Forwarded-Proto $scheme;

$ grep -c "X-Request-ID\\|request_id" nginx/nginx.conf
0</code></pre>
<p>Four headers forwarded; the id is not among them. So the <code>incoming</code> branch is dead code in production — Express generates a fresh id every time. Meanwhile nginx has already generated its own, in <code>$request_id</code>, which it creates for every request and this config never uses:</p>
<pre><code class="language-nginx"># nginx/nginx.conf:29 — the current access log format
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" $request_time';</code></pre>
<p>Two ids exist per request — nginx's and Express's — neither is logged next to the other, so an nginx 502 and the backend error that caused it cannot be joined. The fix is two lines:</p>
<pre><code class="language-nginx">log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" $request_time $request_id';   # ← log it

location /api/ {
    proxy_set_header X-Request-ID $request_id;                    # ← forward it
    # ...existing headers
}</code></pre>
<p>Now nginx mints the id at the true edge, logs it, and hands it to Express — whose existing <code>incoming</code> branch finally fires. One id from the first byte to the last log line.</p>

<h3>The four boundaries, and what each drops</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · nginx → Express</span><span class="lz-lnote">An HTTP header. Cheap, standard, and the only one where the id can be minted at the real edge. Fixed above.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Express → Postgres</span><span class="lz-lnote">A protocol with no header. The id cannot travel — but it can be smuggled in an SQL comment, which is what <code>sqlcommenter</code> does and what makes a slow query traceable back to its request.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Express → queue → worker</span><span class="lz-lnote">The job outlives the request. AsyncLocalStorage cannot follow it — the request finished. The id must be stored <em>in the job payload</em>, explicitly.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Express → an external API</span><span class="lz-lnote">The LLM gateway, R2, VNPay. You control the outbound header; you do not control their logs. Send the id anyway — their support team may be able to use it.</span></div>
</div>

<h3>Boundary 2: making a slow query traceable</h3>
<pre><code class="language-typescript">// Postgres logs slow queries, but only the SQL — no request context.
// SQL comments survive into pg_stat_statements and the slow-query log.

prisma.$use(async (params, next) =&gt; {
  const ctx = currentContext();
  if (!ctx) return next(params);
  // sqlcommenter format: /*key='value'*/ appended to the statement
  return prisma.$queryRawUnsafe(
    &#96;/*requestId='\${ctx.requestId}',route='\${ctx.route}'*/ \` + sql);
});</code></pre>
<pre><code>Without it, the slow-query log says:

  duration: 4821.332 ms  execute: SELECT ... FROM "Note" WHERE ...

With it:

  duration: 4821.332 ms  execute: /*requestId='V1StGXR8_Z5j',
  route='/api/v1/notes'*/ SELECT ... FROM "Note" WHERE ...
                          ▲
                          now searchable in Loki alongside every
                          application log line for that request</code></pre>
<p>This is the boundary people give up on, and it is the one that pays best: &quot;the API was slow&quot; and &quot;this query took 4.8 seconds&quot; are two facts that are nearly useless apart and conclusive together.</p>

<h3>Boundary 3: the queue, where context genuinely cannot follow</h3>
<p>This repo has several queues — <code>embedQueue.service.ts</code>, <code>music-queue.service.ts</code>. A job is enqueued during a request and executed later, possibly after the process restarted. There is no async chain to follow, so the id must be data:</p>
<pre><code class="language-typescript">// enqueue — copy the id OUT of the context, into the payload
const ctx = currentContext();
await queue.add('embed-note', {
  noteId,
  parentRequestId: ctx?.requestId,        // ← plain string, travels with the job
});

// worker — open a NEW context that remembers where it came from
worker.process(async (job) =&gt; {
  await requestContext.run(
    { requestId: 'job_' + nanoid(8), parentRequestId: job.data.parentRequestId },
    () =&gt; doTheWork(job),
  );
});</code></pre>
<p>Note the shape: the job gets its <em>own</em> id, not the request's. A job can be retried, can outlive its request by hours, and can be one of hundreds from a batch. Reusing the request id would merge all of that into one timeline. The link is a <em>separate field</em>, which makes both queries possible — everything about this job, and everything descended from that request.</p>

<h3>Boundary 4: outbound HTTP</h3>
<pre><code class="language-typescript">// One place, in whatever wraps fetch — not at each call site.
const ctx = currentContext();
const res = await fetch(url, {
  ...init,
  headers: { ...init.headers, 'X-Request-ID': ctx?.requestId ?? '' },
});
logger.info('outbound call finished', {
  host: new URL(url).host, status: res.status, ms: Date.now() - t0,
});</code></pre>
<p>Whether the far end uses it is out of your hands. What is in your hands is the log line above, which records that <em>this</em> request made <em>that</em> outbound call — enough to prove the 8-second response came from the LLM gateway rather than from your code, which is a conversation you will have.</p>

<div class="pitfall">
<p><strong>Trap — <code>X-Forwarded-For</code> is a list, and the entry you want is not the first one.</strong> The header is appended to at every hop, so behind Cloudflare and then nginx it reads <code>&lt;client&gt;, &lt;cloudflare&gt;, &lt;nginx&gt;</code> — and any client can pre-populate it, so the leftmost value is attacker-controlled, not the true client. Reading it naively gives you a spoofable string in your logs and, worse, in your rate limiter. Express has the correct machinery: set <code>app.set('trust proxy', &lt;number of proxies you actually run&gt;)</code> and read <code>req.ip</code>, which then counts from the right and skips exactly that many hops. <strong>Setting <code>trust proxy</code> to <code>true</code> rather than a number is the same bug with extra steps — it trusts the whole chain, including whatever the client injected.</strong></p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — $request_id</span><span class="lc-sub">The variable nginx already computes for every request, which this repo's config generates and then discards.</span></span>
</a>
<a class="link-card dl" href="https://google.github.io/sqlcommenter/" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">sqlcommenter</span><span class="lc-sub">The convention for smuggling request context into SQL comments so it survives into the database's own slow-query log.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Đi qua ranh giới: proxy, cơ sở dữ liệu, hàng đợi, worker</h2>
<p class="lead">Một ngữ cảnh dừng lại ở rìa của một tiến trình thì giá trị kém xa vẻ ngoài của nó. Bài này đi qua bốn cái ranh giới mà một request trong kho này thật sự vượt qua, và chỉ ra mỗi cái đánh rơi thứ gì — bắt đầu bằng một ranh giới đã âm thầm đánh rơi cái id kể từ ngày middleware được viết.</p>

<h3>Ranh giới 1: nginx → Express, và cái nhánh chưa từng chạy</h3>
<p>Bài 3.1 khen middleware vì nó tôn trọng <code>X-Request-ID</code> đến từ ngoài. Hãy kiểm xem có gì gửi một cái không:</p>
<pre><code class="language-bash">$ grep -n "proxy_set_header" nginx/nginx.conf
171:  proxy_set_header Host $host;
172:  proxy_set_header X-Real-IP $remote_addr;
173:  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
174:  proxy_set_header X-Forwarded-Proto $scheme;

$ grep -c "X-Request-ID\\|request_id" nginx/nginx.conf
0</code></pre>
<p>Bốn header được chuyển tiếp; cái id không nằm trong đó. Vậy nhánh <code>incoming</code> là mã chết trên production — Express sinh một id mới mỗi lần. Trong khi đó nginx đã sinh sẵn cái của nó, trong <code>$request_id</code>, thứ nó tạo cho mọi request và cấu hình này chưa từng dùng:</p>
<pre><code class="language-nginx"># nginx/nginx.conf:29 — định dạng log truy cập hiện tại
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" $request_time';</code></pre>
<p>Có hai cái id cho mỗi request — của nginx và của Express — không cái nào được log cạnh cái kia, nên một lỗi 502 của nginx và cái lỗi backend gây ra nó không ghép lại được. Cách chữa là hai dòng:</p>
<pre><code class="language-nginx">log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" $request_time $request_id';   # ← log nó

location /api/ {
    proxy_set_header X-Request-ID $request_id;                    # ← chuyển tiếp nó
    # ...các header sẵn có
}</code></pre>
<p>Giờ nginx đúc cái id ở rìa thật, log nó, rồi trao cho Express — và cái nhánh <code>incoming</code> sẵn có cuối cùng cũng chạy. Một cái id từ byte đầu tiên tới dòng log cuối cùng.</p>

<h3>Bốn ranh giới, và mỗi cái đánh rơi gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · nginx → Express</span><span class="lz-lnote">Một header HTTP. Rẻ, chuẩn mực, và là chỗ duy nhất cái id đúc được ở rìa thật. Đã chữa ở trên.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Express → Postgres</span><span class="lz-lnote">Một giao thức không có header. Cái id không đi qua được — nhưng nó lận được trong một chú thích SQL, đó là việc <code>sqlcommenter</code> làm và là thứ làm cho một truy vấn chậm lần ngược về được request của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Express → hàng đợi → worker</span><span class="lz-lnote">Công việc sống lâu hơn request. AsyncLocalStorage không theo được — request đã kết thúc. Cái id phải được cất <em>trong payload công việc</em>, một cách tường minh.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Express → một API bên ngoài</span><span class="lz-lnote">Cổng LLM, R2, VNPay. Bạn kiểm soát header gửi đi; bạn không kiểm soát log của họ. Cứ gửi cái id đi — đội hỗ trợ của họ có thể dùng được.</span></div>
</div>

<h3>Ranh giới 2: làm cho một truy vấn chậm lần theo được</h3>
<pre><code class="language-typescript">// Postgres có log truy vấn chậm, nhưng chỉ có SQL — không ngữ cảnh request.
// Chú thích SQL sống sót được vào pg_stat_statements và log truy vấn chậm.

prisma.$use(async (params, next) =&gt; {
  const ctx = currentContext();
  if (!ctx) return next(params);
  // định dạng sqlcommenter: /*key='value'*/ nối vào câu lệnh
  return prisma.$queryRawUnsafe(
    &#96;/*requestId='\${ctx.requestId}',route='\${ctx.route}'*/ \` + sql);
});</code></pre>
<pre><code>Không có nó, log truy vấn chậm nói:

  duration: 4821.332 ms  execute: SELECT ... FROM "Note" WHERE ...

Có nó:

  duration: 4821.332 ms  execute: /*requestId='V1StGXR8_Z5j',
  route='/api/v1/notes'*/ SELECT ... FROM "Note" WHERE ...
                          ▲
                          giờ tìm được trong Loki, nằm cạnh mọi dòng
                          log ứng dụng của đúng request đó</code></pre>
<p>Đây là cái ranh giới người ta bỏ cuộc, và nó lại là cái trả công hậu nhất: &quot;API chậm&quot; và &quot;truy vấn này mất 4,8 giây&quot; là hai sự thật gần như vô dụng khi tách rời và mang tính kết luận khi ghép lại.</p>

<h3>Ranh giới 3: hàng đợi, chỗ ngữ cảnh thật sự không theo được</h3>
<p>Kho này có vài hàng đợi — <code>embedQueue.service.ts</code>, <code>music-queue.service.ts</code>. Một công việc được xếp hàng trong lúc có request và được thực thi về sau, có thể là sau khi tiến trình đã khởi động lại. Không có chuỗi bất đồng bộ nào để bám theo, nên cái id phải là dữ liệu:</p>
<pre><code class="language-typescript">// lúc xếp hàng — chép cái id RA KHỎI ngữ cảnh, vào payload
const ctx = currentContext();
await queue.add('embed-note', {
  noteId,
  parentRequestId: ctx?.requestId,        // ← chuỗi thường, đi cùng công việc
});

// worker — mở một ngữ cảnh MỚI có nhớ nó đến từ đâu
worker.process(async (job) =&gt; {
  await requestContext.run(
    { requestId: 'job_' + nanoid(8), parentRequestId: job.data.parentRequestId },
    () =&gt; doTheWork(job),
  );
});</code></pre>
<p>Để ý hình dạng: công việc có id <em>của riêng nó</em>, không phải id của request. Một công việc có thể bị thử lại, có thể sống lâu hơn request của nó hàng giờ, và có thể là một trong hàng trăm cái của một lô. Dùng lại id request sẽ trộn tất cả những thứ đó vào một dòng thời gian. Mối liên hệ là một <em>trường riêng</em>, và điều đó làm cả hai truy vấn đều khả thi — mọi thứ về công việc này, và mọi thứ sinh ra từ request kia.</p>

<h3>Ranh giới 4: HTTP gửi đi</h3>
<pre><code class="language-typescript">// Một chỗ duy nhất, trong bất cứ thứ gì bọc fetch — không phải ở từng chỗ gọi.
const ctx = currentContext();
const res = await fetch(url, {
  ...init,
  headers: { ...init.headers, 'X-Request-ID': ctx?.requestId ?? '' },
});
logger.info('outbound call finished', {
  host: new URL(url).host, status: res.status, ms: Date.now() - t0,
});</code></pre>
<p>Đầu bên kia có dùng nó hay không thì ngoài tầm tay bạn. Trong tầm tay bạn là cái dòng log ở trên, thứ ghi lại rằng <em>request này</em> đã thực hiện <em>lời gọi ra ngoài kia</em> — đủ để chứng minh cái phản hồi 8 giây đến từ cổng LLM chứ không phải từ mã của bạn, và đó là một cuộc trò chuyện bạn sẽ phải có.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>X-Forwarded-For</code> là một DANH SÁCH, và phần tử bạn cần không phải phần tử đầu.</strong> Header này được nối thêm ở mỗi chặng, nên đứng sau Cloudflare rồi tới nginx thì nó đọc ra <code>&lt;client&gt;, &lt;cloudflare&gt;, &lt;nginx&gt;</code> — mà client nào cũng điền sẵn được nó, nên giá trị ngoài cùng bên trái là do phía tấn công điều khiển, không phải client thật. Đọc nó một cách ngây thơ cho bạn một chuỗi giả mạo được trong log, và tệ hơn là trong bộ giới hạn tốc độ. Express có sẵn cơ chế đúng: đặt <code>app.set('trust proxy', &lt;số proxy bạn thật sự chạy&gt;)</code> rồi đọc <code>req.ip</code>, khi ấy nó đếm từ bên phải và bỏ qua đúng bấy nhiêu chặng. <strong>Đặt <code>trust proxy</code> thành <code>true</code> thay vì một con số là đúng cái lỗi đó với thêm vài bước — nó tin cả chuỗi, kể cả phần client tự nhét vào.</strong></p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — $request_id</span><span class="lc-sub">Cái biến nginx vốn đã tính cho mọi request, thứ mà cấu hình của kho này sinh ra rồi vứt đi.</span></span>
</a>
<a class="link-card dl" href="https://google.github.io/sqlcommenter/" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">sqlcommenter</span><span class="lc-sub">Quy ước lận ngữ cảnh request vào chú thích SQL để nó sống sót vào tận log truy vấn chậm của chính cơ sở dữ liệu.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '3.4 — W3C Trace Context: the id that other people understand|||3.4 — W3C Trace Context: cái id mà người khác cũng hiểu',
      slug: 'obs-3-4-trace-context',
      type: 'VIDEO',
      description: 'traceparent, bốn phần của nó, cờ lấy mẫu, và vì sao đừng tự nghĩ ra định dạng của riêng mình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>W3C Trace Context: the id that other people understand</h2>
<p class="lead">A request id you invented works perfectly — inside systems you wrote. The moment a request touches Cloudflare, a managed database, an SDK you did not write or a vendor's API, your custom header means nothing to any of them. There is a standard for exactly this, it is boring, and adopting it costs one header.</p>

<h3>The header</h3>
<pre><code>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ▲  ▲                                ▲                ▲
             │  │                                │                │
    version ─┘  │                                │                └─ flags
      always 00 │                                │                   01 = sampled
                │                                │                   00 = not
   trace-id ────┘                    parent-id ──┘
   16 bytes, 32 hex chars            8 bytes, 16 hex chars
   ONE per logical operation,        THIS span. Changes at
   never changes                     every hop.</code></pre>
<p>Four fields, fixed widths, dash-separated. That rigidity is the point: a proxy written in Go, a Java service, an OpenTelemetry SDK and Cloudflare's edge all parse it identically, without configuration or negotiation.</p>

<h3>Why this and not your own header</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Others propagate it</span><span class="lz-t">For free, without being asked</span><span class="lz-d">Cloudflare, most API gateways and every OpenTelemetry SDK forward <code>traceparent</code> automatically. A custom <code>X-My-Request-ID</code> is stripped at the first hop that does not know it.</span></div>
  <div class="lz-node"><span class="lz-k">It encodes a tree, not a line</span><span class="lz-t">trace-id plus parent-id</span><span class="lz-d">One id says &quot;these lines belong together&quot;. Two ids say <em>how</em> they relate — which call caused which. That is the difference between a list and the waterfall in chapter 6.</span></div>
  <div class="lz-node"><span class="lz-k">The sampling bit travels with it</span><span class="lz-t">The flags byte</span><span class="lz-d">Whoever decides &quot;keep this trace&quot; decides once, at the edge, and every downstream service honours it. Without it, each service samples independently and you get traces with holes.</span></div>
</div>

<h3>How it coexists with what this repo already has</h3>
<pre><code class="language-typescript">// The two ids answer different questions. Keep both.
type Ctx = {
  requestId: string;   // this HTTP request. Short, human-readable,
                       // printed in the X-Request-ID response header,
                       // quotable by a user in a bug report.
  traceId?: string;    // the logical operation, possibly spanning
                       // several requests and services. Machine-scale.
};</code></pre>
<pre><code class="language-typescript">// src/index.ts — extend the existing middleware, do not replace it
const tp = req.headers['traceparent'] as string | undefined;
const m = tp?.match(/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/);

const traceId = m ? m[1] : randomBytes(16).toString('hex');
const spanId  = randomBytes(8).toString('hex');
const sampled = m ? (parseInt(m[3], 16) &amp; 1) === 1 : shouldSample();

requestContext.run({ requestId: id, traceId, spanId, sampled }, next);</code></pre>
<p>Note the validation. A malformed <code>traceparent</code> must be treated as absent — the spec says so explicitly — and generating a fresh trace is the correct recovery. Accepting a partially-valid one produces ids that look right and join nothing.</p>

<h3>Propagating it outward</h3>
<pre><code class="language-typescript">// Every outbound call gets a NEW span id, the SAME trace id.
const ctx = currentContext();
const childSpanId = randomBytes(8).toString('hex');
const traceparent =
  &#96;00-\${ctx.traceId}-\${childSpanId}-\${ctx.sampled ? '01' : '00'}\`;

await fetch(gatewayUrl, { headers: { traceparent } });</code></pre>
<pre><code>What the far end sees, and why it matters:

  trace-id   4bf92f...   same as yours   → "same operation"
  parent-id  00f067...   YOUR span id    → "you called me"
  flags      01                          → "keep this one"

Those three facts are enough for a tool that has never seen
your code to draw the call tree in chapter 6.</code></pre>

<h3>The companion header nobody uses correctly</h3>
<pre><code>tracestate: vendor1=opaqueValue1,vendor2=opaqueValue2

Purpose: vendor-specific data riding along with the trace.
Rules that matter:

  · 32 entries maximum
  · each vendor may modify ONLY its own entry
  · your entry moves to the FRONT when you touch it
  · unknown entries must be passed through UNCHANGED

That last rule is the one that gets broken. A service that
rebuilds tracestate from scratch silently destroys every other
vendor's state, and the failure appears in THEIR tooling,
not yours. If you have nothing to add: forward it verbatim.</code></pre>

<h3>Do you need this today?</h3>
<pre><code>One backend, one database, one VPS?
  → requestId alone is 90% of the value. Build lesson 3.2,
    stop, and come back to this when you add a second service.

You call external APIs whose latency you argue about?
  → Adopt traceparent NOW. It costs one header and it is the
    difference between "the gateway was slow" as an opinion
    and as a record.

You plan to add tracing (chapter 6)?
  → Adopt it now regardless. Every OpenTelemetry SDK expects
    this header; retrofitting it later means re-instrumenting
    every boundary you already touched.</code></pre>

<div class="pitfall">
<p><strong>Trap — a trace id is 128 bits of entropy, and it is not a secret.</strong> Two mistakes follow from forgetting that. The first: putting one in a URL, a filename, or an <code>ETag</code>, where it leaks into referrer headers and third-party analytics and quietly becomes a cross-site correlation key for whoever collects those. The second, and more common: deriving it from something meaningful — a user id, a hash of the session, a timestamp plus a counter — which makes it enumerable and, if you derived it from personal data, makes the id itself personal data with the retention obligations of lesson 2.5 attached. <strong>Generate it from a CSPRNG, treat it as a join key and nothing else, and never let it appear anywhere a URL can be shared.</strong></p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">W3C — Trace Context, the specification</span><span class="lc-sub">Short and readable. The exact grammar, the rules for malformed values, and the tracestate mutation rules above.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/context-propagation/" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — context propagation</span><span class="lc-sub">How the standard is implemented across languages, and the propagator abstraction that injects and extracts these headers for you.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>W3C Trace Context: cái id mà người khác cũng hiểu</h2>
<p class="lead">Một request id do bạn nghĩ ra chạy hoàn hảo — bên trong những hệ thống bạn viết. Ngay khi một request chạm tới Cloudflare, một cơ sở dữ liệu dịch vụ, một SDK bạn không viết hay API của một nhà cung cấp, cái header riêng của bạn chẳng có nghĩa gì với họ cả. Có một tiêu chuẩn cho đúng chuyện này, nó nhàm chán, và áp dụng nó tốn một cái header.</p>

<h3>Cái header</h3>
<pre><code>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ▲  ▲                                ▲                ▲
             │  │                                │                │
  phiên bản ─┘  │                                │                └─ cờ
      luôn là 00│                                │                   01 = có lấy mẫu
                │                                │                   00 = không
   trace-id ────┘                    parent-id ──┘
   16 byte, 32 ký tự hex             8 byte, 16 ký tự hex
   MỘT cái cho mỗi thao tác          span NÀY. Đổi ở mỗi
   lô-gíc, không bao giờ đổi         chặng.</code></pre>
<p>Bốn trường, độ rộng cố định, ngăn bằng dấu gạch. Chính sự cứng nhắc đó là mấu chốt: một proxy viết bằng Go, một dịch vụ Java, một SDK OpenTelemetry và biên của Cloudflare đều bóc nó ra y hệt nhau, không cần cấu hình hay thương lượng gì.</p>

<h3>Vì sao là cái này chứ không phải header của riêng bạn</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Người khác truyền tiếp nó</span><span class="lz-t">Miễn phí, không cần ai nhờ</span><span class="lz-d">Cloudflare, hầu hết các API gateway và mọi SDK OpenTelemetry đều tự chuyển tiếp <code>traceparent</code>. Một cái <code>X-My-Request-ID</code> tự chế bị vứt ngay ở chặng đầu tiên không biết nó là gì.</span></div>
  <div class="lz-node"><span class="lz-k">Nó mã hoá một cái CÂY, không phải một đường thẳng</span><span class="lz-t">trace-id cộng parent-id</span><span class="lz-d">Một cái id nói &quot;những dòng này thuộc về nhau&quot;. Hai cái id nói <em>chúng liên hệ thế nào</em> — lời gọi nào gây ra lời gọi nào. Đó là khác biệt giữa một danh sách và cái biểu đồ thác ở chương 6.</span></div>
  <div class="lz-node"><span class="lz-k">Bit lấy mẫu đi cùng nó</span><span class="lz-t">Cái byte cờ</span><span class="lz-d">Ai quyết định &quot;giữ trace này&quot; thì quyết một lần, ở rìa ngoài, và mọi dịch vụ hạ nguồn đều tôn trọng. Không có nó thì mỗi dịch vụ lấy mẫu độc lập và bạn nhận về những trace thủng lỗ chỗ.</span></div>
</div>

<h3>Nó sống chung thế nào với thứ kho này đã có</h3>
<pre><code class="language-typescript">// Hai cái id trả lời hai câu hỏi khác nhau. Giữ cả hai.
type Ctx = {
  requestId: string;   // request HTTP này. Ngắn, người đọc được,
                       // được in trong header phản hồi X-Request-ID,
                       // người dùng trích dẫn được khi báo lỗi.
  traceId?: string;    // thao tác lô-gíc, có thể trải qua nhiều
                       // request và nhiều dịch vụ. Cỡ dành cho máy.
};</code></pre>
<pre><code class="language-typescript">// src/index.ts — mở rộng middleware sẵn có, đừng thay nó
const tp = req.headers['traceparent'] as string | undefined;
const m = tp?.match(/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/);

const traceId = m ? m[1] : randomBytes(16).toString('hex');
const spanId  = randomBytes(8).toString('hex');
const sampled = m ? (parseInt(m[3], 16) &amp; 1) === 1 : shouldSample();

requestContext.run({ requestId: id, traceId, spanId, sampled }, next);</code></pre>
<p>Để ý phần kiểm tra. Một <code>traceparent</code> sai định dạng phải được coi như là không có — bản đặc tả nói thẳng thế — và sinh một trace mới là cách phục hồi đúng. Chấp nhận một cái hợp lệ một nửa sẽ tạo ra những id trông đúng mà chẳng ghép được với gì.</p>

<h3>Truyền nó ra ngoài</h3>
<pre><code class="language-typescript">// Mọi lời gọi ra ngoài đều nhận một span id MỚI, và CÙNG một trace id.
const ctx = currentContext();
const childSpanId = randomBytes(8).toString('hex');
const traceparent =
  &#96;00-\${ctx.traceId}-\${childSpanId}-\${ctx.sampled ? '01' : '00'}\`;

await fetch(gatewayUrl, { headers: { traceparent } });</code></pre>
<pre><code>Đầu bên kia thấy gì, và vì sao điều đó quan trọng:

  trace-id   4bf92f...   giống của bạn   → "cùng một thao tác"
  parent-id  00f067...   span id CỦA BẠN → "anh gọi tôi"
  cờ         01                          → "giữ cái này lại"

Ba sự thật đó là đủ để một công cụ chưa từng thấy mã của bạn
vẽ ra được cây lời gọi ở chương 6.</code></pre>

<h3>Cái header đi kèm mà không ai dùng cho đúng</h3>
<pre><code>tracestate: vendor1=opaqueValue1,vendor2=opaqueValue2

Mục đích: dữ liệu riêng của từng nhà cung cấp đi ké theo trace.
Những luật đáng quan tâm:

  · tối đa 32 mục
  · mỗi nhà cung cấp CHỈ được sửa mục của chính mình
  · mục của bạn nhảy lên ĐẦU khi bạn đụng vào nó
  · những mục không biết thì phải chuyển tiếp NGUYÊN VẸN

Luật cuối cùng là luật hay bị phá. Một dịch vụ dựng lại
tracestate từ đầu sẽ âm thầm phá nát trạng thái của mọi nhà
cung cấp khác, và cú hỏng ấy hiện ra trong công cụ CỦA HỌ,
không phải của bạn. Nếu bạn chẳng có gì để thêm: chuyển tiếp
y nguyên.</code></pre>

<h3>Hôm nay bạn có cần cái này không?</h3>
<pre><code>Một backend, một cơ sở dữ liệu, một VPS?
  → Chỉ requestId thôi đã là 90% giá trị. Hãy dựng bài 3.2,
    dừng lại, và quay lại đây khi bạn thêm dịch vụ thứ hai.

Bạn gọi API bên ngoài mà hay tranh cãi về độ trễ của họ?
  → Áp dụng traceparent NGAY. Nó tốn một cái header và nó là
    khác biệt giữa "cổng đó chậm" như một ý kiến và như một
    bản ghi.

Bạn định thêm trace (chương 6)?
  → Cứ áp dụng ngay bất kể thế nào. Mọi SDK OpenTelemetry đều
    trông đợi cái header này; lắp bù về sau nghĩa là phải đo
    đạc lại mọi ranh giới bạn đã đụng tới.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một trace id là 128 bit ngẫu nhiên, và nó KHÔNG phải bí mật.</strong> Hai sai lầm nảy ra từ việc quên điều đó. Thứ nhất: nhét một cái vào URL, vào tên file, hay vào một <code>ETag</code>, nơi nó rò ra header referrer và các dịch vụ phân tích của bên thứ ba rồi lặng lẽ trở thành một khoá tương quan xuyên trang cho bất cứ ai thu thập những thứ đó. Thứ hai, và phổ biến hơn: suy nó ra từ một thứ có ý nghĩa — id người dùng, một băm của phiên, một dấu thời gian cộng bộ đếm — điều đó làm nó liệt kê được và, nếu bạn suy nó từ dữ liệu cá nhân, làm cho chính cái id trở thành dữ liệu cá nhân với đủ nghĩa vụ lưu trữ của bài 2.5 đi kèm. <strong>Hãy sinh nó từ một CSPRNG, coi nó là khoá ghép chứ không là gì khác, và đừng bao giờ để nó xuất hiện ở nơi nào mà một URL có thể được chia sẻ đi.</strong></p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">W3C — Trace Context, bản đặc tả</span><span class="lc-sub">Ngắn và dễ đọc. Ngữ pháp chính xác, luật xử lý giá trị sai định dạng, và luật sửa tracestate ở trên.</span></span>
</a>
<a class="link-card dl" href="https://opentelemetry.io/docs/concepts/context-propagation/" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">OpenTelemetry — truyền ngữ cảnh</span><span class="lc-sub">Tiêu chuẩn này được cài đặt thế nào xuyên các ngôn ngữ, và lớp trừu tượng propagator tự chèn và bóc mấy header đó hộ bạn.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '3.5 — What correlation buys: one incident, twice|||3.5 — Correlation mua được gì: một sự cố, kể hai lần',
      slug: 'obs-3-5-mot-su-co-ke-hai-lan',
      type: 'VIDEO',
      description: 'Cùng một sự cố 502, gỡ hai lần: một lần không có id, một lần có. So sánh số truy vấn và thời gian.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>What correlation buys: one incident, twice</h2>
<p class="lead">The argument for correlation is usually made in the abstract, which is why it keeps losing to more urgent work. So here is the same incident debugged twice — once with the repository as it stands today, once with the three changes from lessons 3.2 and 3.3 applied. Count the steps.</p>

<h3>The incident</h3>
<pre><code>14:07  A user messages: "saving a note gave an error, I tried
       three times." They attach a screenshot showing a 502
       and the response headers, including:

           X-Request-ID: V1StGXR8_Z5j

14:09  Grafana shows nothing unusual. Error rate is 0.4%,
       normal. p99 latency is 210ms, normal. No alert fired.

       Because 0.4% of requests failing IS normal, and one
       user failing three times is invisible inside it.</code></pre>

<h3>Debugging it as the repo is today</h3>
<pre><code>1. Search the backend log for "notes" around 14:07.
   → 2,180 lines. The user's three attempts are in there.
     So are 340 other people's successful saves.

2. Narrow to level=error.
   → 11 lines in that window. Four different messages.
     Which of them is this user's? Unknown — no id, and
     errorHandler.ts logs path and method, not who.

3. Try to filter by user.
   → You do not log userId on this path. Dead end.

4. Search nginx's access log for 502.
   → 6 in that window. nginx logs $remote_addr, but the
     user is behind Cloudflare so every line shows a
     Cloudflare IP. Cannot match them to the user, and
     cannot match them to the backend errors either —
     the two logs share no field but a timestamp.

5. Match by timestamp.
   → nginx says 14:07:33. Backend errors at 14:07:31,
     14:07:33, 14:07:36. Two are plausible. Under load
     they were seconds apart from unrelated requests.

6. Guess, and read code.
   → 25 minutes in, you are reading the notes service
     hoping to recognise the failure from the message.

The X-Request-ID in the screenshot was never searchable.</code></pre>

<h3>The same incident with the three changes applied</h3>
<pre><code>1. {container=~"cuonghoangdev.*"} |= "V1StGXR8_Z5j"

   → 14 lines. Every one of them. In order.
     From nginx, from Express, from the service layer,
     from the Prisma slow-query log, from the worker.

Elapsed: about 40 seconds, and you now have this:</code></pre>
<div class="out">14:07:31.204  nginx     GET /api/v1/notes  upstream_response_time=30.001  status=502
14:07:01.198  backend   request started            route=/api/v1/notes  method=POST
14:07:01.203  backend   quota check ok             userId=u_8f3a  remaining=812
14:07:01.204  backend   embedding requested        chars=4210
14:07:01.207  backend   outbound call started      host=modelapi.vn
14:07:31.209  backend   outbound call finished     host=modelapi.vn  status=200  ms=30002
14:07:31.210  backend   Express error handler      msg="socket hang up"</div>
<p>The cause is in the fifth and sixth lines, and it is not what any of the six steps above was heading toward. The LLM gateway took 30.002 seconds. nginx's <code>proxy_read_timeout</code> is 30 seconds. nginx gave up one millisecond before the answer arrived, returned 502, and the backend then failed writing to a socket that was already closed.</p>
<p>Nothing in the backend was broken. No amount of reading the notes service would have found it, because the notes service is not where the time went.</p>

<h3>What actually made the difference</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The id was searchable at all</span><span class="lz-d">The user's screenshot became an exact-match query instead of a starting timestamp. That alone collapsed steps 1–5.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">nginx and the backend shared the id</span><span class="lz-d">Lesson 3.3's <code>proxy_set_header</code>. Without it the 502 and the error are two unjoinable facts; with it they are one story with a timeline.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The outbound call was logged with a duration</span><span class="lz-d">Lesson 3.3's boundary 4. This is the line that names the culprit. Without it the story ends at &quot;socket hang up&quot;, which sounds like a network fault in your own service.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The 1 ms margin was visible</span><span class="lz-d">30.002s against a 30s timeout is not a guess you would make. It is only obvious when both numbers appear in the same list, which is what correlation produces.</span></div>
</div>

<h3>The fix follows from the evidence, not from a hunch</h3>
<pre><code>Because you can SEE 30.002s vs a 30s timeout, the fix is
specific rather than speculative:

  · Give the LLM call its own timeout, BELOW nginx's:
    25s, so your code decides what a timeout means and
    can return a real error message.

  · Log a warn when an outbound call exceeds 20s. The
    incident becomes a graph before it becomes a report.

  · Do not raise proxy_read_timeout. A user waiting 30
    seconds for a note to save has already given up; the
    right change is to not do embedding synchronously —
    which is why the embed QUEUE exists in this repo.

Compare to the fix you would have shipped from step 6:
"add a retry around the notes save", which would have
turned one 30-second failure into three.</code></pre>

<h3>The honest accounting</h3>
<pre><code>Cost of the three changes:
  · 12-line requestContext.ts             one-time
  · one word in the existing middleware   one-time
  · one line in emit()                    one-time
  · two lines in nginx.conf               one-time
  · 677 ns per request                    measured, 3.2
  · ~20 bytes per log line                requestId field

Benefit, measured on one incident:
  · six steps and ~25 minutes → one query and ~40 seconds
  · a correct diagnosis instead of a plausible wrong one

The 20 bytes per line is the only ongoing cost, and it is
the same 20 bytes that made the diagnosis possible.</code></pre>

<div class="pitfall">
<p><strong>Trap — correlation makes it trivially easy to reconstruct one person's entire session, and that is a capability, not a feature.</strong> Once every line carries a joinable id, a single query returns everything a user did: what they opened, what they typed into a search box, which notes they read and how long they lingered. That is enormously useful for debugging and it is exactly the shape of a privacy incident — an engineer idly querying an ex-partner's activity, a support agent pulling a public figure's history, a scraped log export that is now a behavioural profile rather than a pile of error messages. <strong>The technical control from lesson 1.2 (do not log personal data) is what keeps this proportionate</strong>, and the organisational one is that access to correlated logs is an audited privilege, not a default for everyone with a Grafana account.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout</span><span class="lc-sub">The 30-second default that produced the 502 in this incident, and why your application timeout must sit below it rather than above.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">The hypothesis-and-bisect method the second walkthrough follows, and why correlated data is what makes bisection possible.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Correlation mua được gì: một sự cố, kể hai lần</h2>
<p class="lead">Lý lẽ cho correlation thường được nêu một cách trừu tượng, và đó là lý do nó cứ thua những việc gấp hơn. Vậy nên đây là cùng một sự cố được gỡ hai lần — một lần với kho như nó đang có hôm nay, một lần với ba thay đổi của bài 3.2 và 3.3 đã áp dụng. Hãy đếm số bước.</p>

<h3>Sự cố</h3>
<pre><code>14:07  Một người dùng nhắn: "lưu ghi chú thì báo lỗi, tôi thử
       ba lần rồi." Họ đính kèm ảnh chụp màn hình có mã 502
       và các header phản hồi, trong đó có:

           X-Request-ID: V1StGXR8_Z5j

14:09  Grafana không thấy gì bất thường. Tỉ lệ lỗi 0,4%,
       bình thường. Độ trễ p99 là 210ms, bình thường. Không
       cảnh báo nào nổ.

       Vì 0,4% request hỏng LÀ bình thường, và một người dùng
       hỏng ba lần thì vô hình bên trong con số đó.</code></pre>

<h3>Gỡ nó với kho như hôm nay</h3>
<pre><code>1. Tìm trong log backend chữ "notes" quanh 14:07.
   → 2.180 dòng. Ba lần thử của người dùng nằm đâu đó trong đó.
     Cùng với 340 lần lưu thành công của người khác.

2. Thu hẹp còn level=error.
   → 11 dòng trong cửa sổ đó. Bốn thông điệp khác nhau.
     Cái nào là của người dùng này? Không biết — không có id,
     và errorHandler.ts log path với method, không log ai.

3. Thử lọc theo người dùng.
   → Bạn không log userId trên đường này. Đường cụt.

4. Tìm 502 trong log truy cập của nginx.
   → 6 cái trong cửa sổ đó. nginx log $remote_addr, nhưng
     người dùng ở sau Cloudflare nên mọi dòng đều hiện một IP
     của Cloudflare. Không khớp được với người dùng, mà cũng
     không khớp được với mấy lỗi backend — hai cái log không
     chung trường nào ngoài dấu thời gian.

5. Khớp theo dấu thời gian.
   → nginx nói 14:07:33. Lỗi backend ở 14:07:31, 14:07:33,
     14:07:36. Hai cái đều hợp lý. Lúc tải cao chúng chỉ cách
     nhau vài giây và đến từ những request chẳng liên quan.

6. Đoán, rồi đọc mã.
   → 25 phút trôi qua, bạn đang đọc service ghi chú và hy vọng
     nhận ra cú hỏng từ thông điệp lỗi.

Cái X-Request-ID trong ảnh chụp màn hình chưa từng tìm được.</code></pre>

<h3>Cùng sự cố đó với ba thay đổi đã áp dụng</h3>
<pre><code>1. {container=~"cuonghoangdev.*"} |= "V1StGXR8_Z5j"

   → 14 dòng. Từng dòng một. Theo đúng thứ tự.
     Từ nginx, từ Express, từ tầng service, từ log truy vấn
     chậm của Prisma, từ worker.

Thời gian trôi qua: khoảng 40 giây, và giờ bạn có cái này:</code></pre>
<div class="out">14:07:31.204  nginx     GET /api/v1/notes  upstream_response_time=30.001  status=502
14:07:01.198  backend   request started            route=/api/v1/notes  method=POST
14:07:01.203  backend   quota check ok             userId=u_8f3a  remaining=812
14:07:01.204  backend   embedding requested        chars=4210
14:07:01.207  backend   outbound call started      host=modelapi.vn
14:07:31.209  backend   outbound call finished     host=modelapi.vn  status=200  ms=30002
14:07:31.210  backend   Express error handler      msg="socket hang up"</div>
<p>Nguyên nhân nằm ở dòng thứ năm và thứ sáu, và nó không phải thứ mà bất cứ bước nào trong sáu bước trên đang tiến tới. Cổng LLM mất 30,002 giây. <code>proxy_read_timeout</code> của nginx là 30 giây. nginx bỏ cuộc trước khi câu trả lời tới đúng một mili giây, trả về 502, rồi backend hỏng khi ghi vào một socket đã đóng.</p>
<p>Không có gì trong backend bị hỏng cả. Đọc bao nhiêu mã của service ghi chú cũng không tìm ra được, vì service ghi chú không phải chỗ thời gian trôi mất.</p>

<h3>Cái gì thật sự tạo ra khác biệt</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cái id tìm kiếm được, ngay từ đầu</span><span class="lz-d">Ảnh chụp màn hình của người dùng trở thành một truy vấn khớp chính xác thay vì một mốc thời gian để bắt đầu mò. Chỉ riêng điều đó đã gộp phăng các bước 1–5.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">nginx và backend dùng chung cái id</span><span class="lz-d"><code>proxy_set_header</code> của bài 3.3. Không có nó thì cái 502 và cái lỗi là hai sự thật không ghép được; có nó thì chúng là một câu chuyện có dòng thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lời gọi ra ngoài được log kèm thời lượng</span><span class="lz-d">Ranh giới 4 của bài 3.3. Đây là dòng gọi tên thủ phạm. Không có nó, câu chuyện dừng ở &quot;socket hang up&quot;, nghe như một lỗi mạng trong chính dịch vụ của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cái biên 1 ms nhìn thấy được</span><span class="lz-d">30,002s so với ngưỡng 30s không phải một phỏng đoán bạn nghĩ ra được. Nó chỉ hiển nhiên khi cả hai con số cùng xuất hiện trong một danh sách, mà đó chính là thứ correlation tạo ra.</span></div>
</div>

<h3>Cách chữa suy ra từ bằng chứng, không từ linh cảm</h3>
<pre><code>Vì bạn THẤY ĐƯỢC 30,002s so với ngưỡng 30s, cách chữa là cụ
thể chứ không phải phỏng đoán:

  · Cho lời gọi LLM một ngưỡng thời gian riêng, THẤP HƠN của
    nginx: 25s, để mã của bạn quyết định hết giờ nghĩa là gì
    và trả về được một thông điệp lỗi tử tế.

  · Ghi một dòng warn khi lời gọi ra ngoài vượt 20s. Sự cố
    thành một đồ thị trước khi nó thành một bản báo cáo.

  · ĐỪNG nâng proxy_read_timeout lên. Một người dùng chờ 30
    giây để lưu một ghi chú thì đã bỏ đi rồi; thay đổi đúng là
    đừng làm embedding một cách đồng bộ — mà đó chính là lý do
    HÀNG ĐỢI embed tồn tại trong kho này.

So với cách chữa bạn đã đem lên từ bước 6: "thêm retry quanh
chỗ lưu ghi chú", thứ sẽ biến một cú hỏng 30 giây thành ba.</code></pre>

<h3>Tính sổ cho sòng phẳng</h3>
<pre><code>Chi phí của ba thay đổi:
  · requestContext.ts 12 dòng            một lần
  · một từ trong middleware sẵn có       một lần
  · một dòng trong emit()                một lần
  · hai dòng trong nginx.conf            một lần
  · 677 ns mỗi request                   đã đo, bài 3.2
  · ~20 byte mỗi dòng log                trường requestId

Lợi ích, đo trên một sự cố:
  · sáu bước và ~25 phút → một truy vấn và ~40 giây
  · một chẩn đoán ĐÚNG thay vì một chẩn đoán sai nghe hợp lý

20 byte mỗi dòng là chi phí thường xuyên duy nhất, và nó chính
là 20 byte đã làm cho chẩn đoán kia khả thi.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — correlation làm cho việc dựng lại trọn vẹn một phiên của một con người trở nên dễ đến mức tầm thường, và đó là một NĂNG LỰC, không phải một tính năng.</strong> Một khi mọi dòng đều mang một id ghép được, một truy vấn duy nhất trả về mọi thứ người dùng đã làm: họ mở gì, họ gõ gì vào ô tìm kiếm, họ đọc ghi chú nào và nán lại bao lâu. Điều đó cực kỳ hữu ích cho việc gỡ lỗi và nó cũng đúng hình dạng của một sự cố quyền riêng tư — một kỹ sư rảnh tay tra hoạt động của người yêu cũ, một nhân viên hỗ trợ kéo lịch sử của một người nổi tiếng, một bản xuất log bị lấy cắp mà giờ là một hồ sơ hành vi chứ không còn là một đống thông điệp lỗi. <strong>Biện pháp kỹ thuật của bài 1.2 (đừng log dữ liệu cá nhân) là thứ giữ cho chuyện này ở mức tương xứng</strong>, còn biện pháp tổ chức là: quyền xem log đã ghép phải là một đặc quyền có ghi vết truy cập, không phải mặc định cho mọi người có tài khoản Grafana.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout</span><span class="lc-sub">Cái mặc định 30 giây đã sinh ra mã 502 trong sự cố này, và vì sao ngưỡng thời gian của ứng dụng phải nằm DƯỚI nó chứ không phải trên.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — Gỡ rối hiệu quả</span><span class="lc-sub">Phương pháp giả thuyết-và-chia-đôi mà lần gỡ thứ hai đi theo, và vì sao dữ liệu đã ghép mới làm cho việc chia đôi khả thi.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra chương 3',
      slug: 'obs-3-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về request id, AsyncLocalStorage, ranh giới dịch vụ và traceparent.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 3 · Quiz</span><h2>Six questions on correlation</h2><p class="lead">Two of these describe a bug that produces WRONG data rather than missing data. Those are the ones worth getting right, because logs that are confidently wrong are worse than logs that are absent.</p></div><div class="ml-vi"><span class="eyebrow">Chương 3 · Kiểm tra</span><h2>Sáu câu về correlation</h2><p class="lead">Hai câu trong đây mô tả một lỗi sinh ra dữ liệu SAI chứ không phải dữ liệu THIẾU. Đó là hai câu đáng làm cho đúng, vì log sai một cách tự tin còn tệ hơn log không có.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'This repo sets req.id and returns X-Request-ID to the client. Why can a user\'s screenshot of that header still not be searched?|||Kho này đặt req.id và trả X-Request-ID cho client. Vì sao ảnh chụp cái header đó của người dùng vẫn không tìm được?',
            options: [
              'Because req.id is written once at src/index.ts:225 and read zero times — no logger call includes it, not even errorHandler.ts, which logs path and method. The id is generated, returned, and discarded.|||Vì req.id được ghi một lần ở src/index.ts:225 và không được đọc lần nào — không lời gọi logger nào kèm nó, kể cả errorHandler.ts vốn chỉ log path và method. Cái id được sinh ra, trả về, rồi vứt đi.',
              'Because nanoid ids are not unique enough to search for|||Vì id do nanoid sinh ra không đủ duy nhất để tìm kiếm',
              'Because Loki cannot index a header value|||Vì Loki không đánh chỉ mục được giá trị của một header',
              'Because the id changes on every retry, so it never matches|||Vì cái id đổi ở mỗi lần thử lại nên không bao giờ khớp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is a module-level `let currentId` worse than having no correlation at all?|||Vì sao một biến `let currentId` ở cấp module còn tệ hơn là không có correlation gì cả?',
            options: [
              'Because Node handles requests concurrently: request B overwrites the variable while A awaits the database, so A\'s next log line carries B\'s id. It appears to work in development where requests never overlap, and in production it produces lines that look normal and point at the wrong request.|||Vì Node xử lý nhiều request đồng thời: request B ghi đè cái biến trong lúc A đang await cơ sở dữ liệu, nên dòng log kế tiếp của A mang id của B. Nó có vẻ chạy được lúc phát triển khi request không bao giờ chồng lấn, và trên production nó sinh ra những dòng trông bình thường mà trỏ vào sai request.',
              'Because module-level variables are slower than AsyncLocalStorage|||Vì biến cấp module chậm hơn AsyncLocalStorage',
              'Because TypeScript cannot type a mutable module-level variable|||Vì TypeScript không gán kiểu được cho biến cấp module thay đổi được',
              'It is not worse — it is the standard pattern for single-process apps|||Nó không tệ hơn — đó là mẫu chuẩn cho ứng dụng một tiến trình',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured on Node 22, AsyncLocalStorage added 677 ns per request and getStore() was unmeasurable. What does that imply for the design?|||Đo trên Node 22, AsyncLocalStorage cộng thêm 677 ns mỗi request và getStore() thì không đo được. Điều đó gợi ý gì cho thiết kế?',
            options: [
              'The cost is entirely in run(), so call run() once per request in middleware and getStore() freely wherever you need the id — including inside emit(), so all 370 existing logger calls gain the field without being touched. At 500 rps the total is 0.034% of one core.|||Chi phí nằm trọn ở run(), nên hãy gọi run() một lần mỗi request trong middleware và gọi getStore() thoải mái ở bất cứ đâu cần id — kể cả bên trong emit(), để cả 370 lời gọi logger sẵn có đều có thêm trường đó mà không phải đụng vào. Ở 500 rps tổng cộng là 0,034% của một nhân.',
              'It is too expensive for a request path and should be used only in background jobs|||Nó quá đắt cho đường request và chỉ nên dùng trong việc chạy nền',
              'getStore() should be called once and the result passed down as a parameter|||Nên gọi getStore() một lần rồi truyền kết quả xuống dưới qua tham số',
              'run() should be called in each service so the context is fresher|||Nên gọi run() trong từng service để ngữ cảnh mới hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You register `emitter.on(\'done\', () => logger.info(\'finished\'))` inside a request handler. What goes wrong?|||Bạn đăng ký `emitter.on(\'done\', () => logger.info(\'finished\'))` bên trong một handler request. Chuyện gì hỏng?',
            options: [
              'The listener captures request A\'s context at registration time and keeps it forever, so every later firing logs A\'s id regardless of which request actually triggered it. Missing context is visible in your logs; borrowed context is not — the line looks perfectly normal.|||Cái listener chộp lấy ngữ cảnh của request A ngay lúc đăng ký và giữ nó mãi mãi, nên mọi lần kích hoạt sau này đều log id của A bất kể request nào thật sự kích hoạt. Ngữ cảnh THIẾU thì nhìn thấy trong log; ngữ cảnh MƯỢN thì không — dòng log trông hoàn toàn bình thường.',
              'The listener loses the context entirely and logs no id|||Cái listener mất sạch ngữ cảnh và không log id nào',
              'Node throws because AsyncLocalStorage does not support event emitters|||Node ném lỗi vì AsyncLocalStorage không hỗ trợ event emitter',
              'Nothing — event listeners always see the current request\'s context|||Không gì cả — listener sự kiện luôn thấy ngữ cảnh của request hiện tại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'nginx.conf forwards four headers but grep for X-Request-ID returns 0. What is the consequence?|||nginx.conf chuyển tiếp bốn header nhưng grep X-Request-ID trả về 0. Hệ quả là gì?',
            options: [
              'The middleware\'s "honour an inbound id" branch is dead code in production — Express mints a fresh id every time. Meanwhile nginx already computes its own $request_id and logs neither, so an nginx 502 and the backend error that caused it share no field but a timestamp and cannot be joined.|||Cái nhánh "tôn trọng id đến từ ngoài" của middleware là mã chết trên production — Express đúc một id mới mỗi lần. Trong khi đó nginx vốn đã tính sẵn $request_id của nó và không log cái nào cả, nên một lỗi 502 của nginx và cái lỗi backend gây ra nó không chung trường nào ngoài dấu thời gian và không ghép được.',
              'Nothing — Express generating its own id is equivalent|||Không gì cả — Express tự sinh id là tương đương',
              'nginx will reject requests that carry an X-Request-ID header|||nginx sẽ từ chối request nào mang header X-Request-ID',
              'The id is still forwarded because proxy_pass copies all headers|||Cái id vẫn được chuyển tiếp vì proxy_pass chép mọi header',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A job is enqueued during a request. Should the worker reuse the request id?|||Một công việc được xếp hàng trong lúc có request. Worker có nên dùng lại id của request không?',
            options: [
              'No. The job gets its own id and carries the request id in a separate parentRequestId field. A job can be retried, can run hours later, and can be one of hundreds in a batch — reusing the request id merges all of that into one timeline, while two fields make both queries possible.|||Không. Công việc có id riêng và mang id của request trong một trường parentRequestId tách biệt. Một công việc có thể bị thử lại, có thể chạy sau đó hàng giờ, và có thể là một trong hàng trăm cái của một lô — dùng lại id request sẽ trộn tất cả vào một dòng thời gian, còn hai trường thì làm cả hai truy vấn đều khả thi.',
              'Yes, and AsyncLocalStorage will propagate it automatically to the worker|||Có, và AsyncLocalStorage sẽ tự truyền nó sang worker',
              'Yes — reusing it is the only way to link the job to its request|||Có — dùng lại là cách duy nhất nối công việc với request của nó',
              'It does not matter, since queue jobs are not logged|||Không quan trọng, vì công việc trong hàng đợi không được log',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
