/**
 * Observability — Chương 7 — Lỗi: trụ cột có tên người gắn kèm.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 7 — Errors: the pillar with a name attached|||Chương 7 — Lỗi: trụ cột có tên người gắn kèm',
  slug: 'obs-ch7-loi',
  description: 'Lỗi so với log so với chỉ số, cách gom nhóm, PII, sentry.service.ts của kho này, release và sourcemap.',
  sortOrder: 8,
  lessons: [
    {
      title: '7.1 — An error is not a log line|||7.1 — Một lỗi không phải một dòng log',
      slug: 'obs-7-1-loi-khong-phai-log',
      type: 'VIDEO',
      description: 'Ba trụ cột nói "có gì đó hỏng". Trụ cột thứ tư nói "hỏng chỗ này, dòng này, ai bị, và đã bao nhiêu lần".',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>An error is not a log line</h2>
<p class="lead">Lesson 0.2 called this the fourth pillar that everybody forgets. Here is why it is separate: an error-tracking system does one thing the other three cannot, and it is not storage or search — it is <em>grouping</em>. Ten thousand occurrences of one bug become one row you can assign, silence, and mark fixed.</p>

<h3>The same failure through four lenses</h3>
<pre><code>A TypeError in the notes service, 4,120 times in a day.

METRIC   errors_total{route="/notes",code="500"} rate: 0.05/s
         → Something is failing. How often. Nothing else.
         → Cost: a few bytes. Answers "is it getting worse?"

LOG      4,120 lines, each with a stack trace
         → The full detail, 4,120 times over. To know it is
           ONE bug you must read two and notice they match.
         → Cost: 4,120 × ~2KB with stacks = 8 MB.

TRACE    ~41 traces at 1% sampling, showing where it happened
         → Where in the request. Not which line of code.

ERROR    ONE issue. "TypeError: Cannot read property 'id' of
TRACKING undefined — notes.service.ts:212". 4,120 events.
         First seen 3 days ago. Regressed in v1.44.2.
         Affecting 312 users. Assigned to nobody.
         → Cost: one row. Answers "what do I fix, and is it new?"</code></pre>
<p>Note what the fourth row has that none of the others do: a <strong>first seen</strong>, a <strong>count of distinct users</strong>, and an <strong>owner</strong>. Those turn a stream of events into a work item.</p>

<h3>Grouping is the whole product</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A fingerprint is computed from the stack trace</span><span class="lz-d">Usually the top few in-app frames plus the exception type. Two events with the same fingerprint are the same issue, regardless of when or to whom.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Occurrences collapse into one row</span><span class="lz-d">Ten thousand events, one line in the list. This is why a Sentry dashboard is readable after an outage and a log search is not.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The row has state you control</span><span class="lz-d">Resolved, ignored, assigned. And &quot;resolved&quot; is not a note to yourself — it means <em>alert me again if this reappears</em>, which is the regression detection you cannot get from logs.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">New versus recurring becomes a first-class distinction</span><span class="lz-d">&quot;First seen 4 minutes ago, 40 events&quot; and &quot;first seen 8 months ago, 90,000 events&quot; deserve completely different responses. Nothing in a log stream tells them apart.</span></div>
</div>

<h3>What this repository already does right</h3>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts — the comment is the lesson
// Report to Sentry — but only for 5xx errors. Client errors (4xx)
// are not bugs and would just spam the dashboard.
if (statusCode &gt;= 500) {
  captureException(err, {
    url: req.originalUrl, method: req.method, statusCode, code: err.code,
  });
}</code></pre>
<p>That distinction is the most important line in the file, and it is the one most projects get wrong. A 400 from a malformed request, a 401 from an expired token, a 404 for a deleted note — these are the system <em>working</em>. Sending them to error tracking produces a dashboard with ten thousand &quot;errors&quot; a day, none actionable, which trains everyone to ignore it. After that the tool is worse than not having it, because now there is a place people believe is being watched.</p>

<h3>The same file, mapping Prisma errors</h3>
<pre><code class="language-typescript">// Map well-known Prisma errors (code &#96;Pxxxx&#96;) to a proper 4xx with a
// safe message, so an uncaught Prisma error surfaces as e.g. 409/404
// instead of a raw 500 that leaks table/column/query internals.
if (!err.statusCode &amp;&amp; typeof err.code === 'string' &amp;&amp; /^P\\d{4}$/.test(err.code)) {
  if (err.code === 'P2002')      { statusCode = 409; message = 'Giá trị đã tồn tại'; }
  else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
  else                           { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }
}</code></pre>
<pre><code>This does two jobs at once, and the second is the interesting one:

  1. Security: a raw Prisma error message names your tables and
     columns. Returning it to a client is free reconnaissance.

  2. Signal quality: a unique-constraint violation (P2002) is a
     user typing an email that already exists. Before this
     mapping it was a 500, therefore a Sentry event, therefore
     noise. After it, it is a 409 and Sentry never hears about it.

Every classification decision you make in an error handler is
also a decision about what your error tracker will contain.</code></pre>

<h3>The line that is still missing</h3>
<pre><code class="language-typescript">logger.error('Express error handler', {
  error: err.message, stack: err.stack, name: err.name,
  code: err.code, path: req.path, method: req.method,
  // ...no requestId, no traceId
});</code></pre>
<p>Chapter 3 established that <code>req.id</code> is written once and read zero times. This is the log line where that costs the most: it is the most important error line in the application, and it cannot be joined to the request that produced it, nor to the Sentry event, nor to the trace. Lesson 7.4 wires all three together — it is four lines.</p>

<h3>When an error is NOT an error</h3>
<pre><code>Do not report to error tracking:

  · 4xx of any kind. Validation, auth, not-found. Already
    handled above.
  · A client disconnecting mid-response (ECONNRESET,
    ERR_STREAM_PREMATURE_CLOSE). Users close tabs.
  · A cancelled request (AbortError). You cancelled it.
  · A retry that later succeeded. Report the FINAL outcome,
    not each attempt — otherwise a flaky dependency with
    three retries triples your error count.
  · A known upstream 503 you already handle with a fallback,
    like the LLM gateway falling back to a Claude model
    (which this repo does deliberately). Count it as a
    metric; do not page anyone.

DO report:

  · Any unhandled exception or unhandled rejection. These
    are, by definition, situations you did not anticipate.
  · Any 5xx.
  · Any invariant violation — "this should be impossible" —
    even when you recovered from it.</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>catch (err) { logger.error(...) }</code> and then continuing is how bugs become permanent.</strong> The pattern looks responsible: nothing crashes, something is written down. But the error never reaches your error tracker, so it has no first-seen date, no user count, and no owner — and the log line it produces is one of thousands nobody greps for. <strong>The specific harm is that the bug now has no way of ever being noticed: the system appears healthy, the metric shows no 5xx because you swallowed it, and the only evidence is a line in a file that expires in fourteen days.</strong> If you genuinely can continue, the catch block should say so and count it: <code>metrics.recoverableErrors.inc({ kind: 'thumbnail_failed' })</code>, plus a log line, plus a comment explaining why proceeding is correct. If you cannot articulate why continuing is safe, you are not recovering — you are hiding.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/product/issues/grouping-and-fingerprints/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Sentry — grouping and fingerprints</span><span class="lc-sub">Exactly how the fingerprint is computed from a stack trace, and how to override it when the default groups too much or too little.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#event-unhandledrejection" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Node.js — unhandledRejection and uncaughtException</span><span class="lc-sub">The two process events that catch what your try/catch missed, and why Node 22 terminates on an unhandled rejection by default.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Một lỗi không phải một dòng log</h2>
<p class="lead">Bài 0.2 gọi đây là trụ cột thứ tư mà ai cũng quên. Đây là lý do nó tách riêng: một hệ thống theo dõi lỗi làm được một việc mà ba cái kia không làm được, và việc đó không phải lưu trữ hay tìm kiếm — nó là <em>GOM NHÓM</em>. Mười nghìn lần xảy ra của một lỗi trở thành một dòng bạn giao được cho người, tắt tiếng được, và đánh dấu đã sửa được.</p>

<h3>Cùng một cú hỏng nhìn qua bốn lăng kính</h3>
<pre><code>Một TypeError trong service ghi chú, 4.120 lần trong một ngày.

CHỈ SỐ   errors_total{route="/notes",code="500"} rate: 0,05/s
         → Có gì đó đang hỏng. Bao nhiêu lần. Không gì khác.
         → Chi phí: vài byte. Trả lời "nó có tệ thêm không?"

LOG      4.120 dòng, mỗi dòng một stack trace
         → Trọn chi tiết, lặp lại 4.120 lần. Muốn biết đó là MỘT
           lỗi thì phải đọc hai dòng và nhận ra chúng khớp nhau.
         → Chi phí: 4.120 × ~2KB kèm stack = 8 MB.

TRACE    ~41 trace ở mức lấy mẫu 1%, cho thấy nó hỏng ở đâu
         → Ở đâu trong request. Không phải ở dòng mã nào.

THEO DÕI MỘT vấn đề. "TypeError: Cannot read property 'id' of
LỖI      undefined — notes.service.ts:212". 4.120 sự kiện.
         Thấy lần đầu 3 ngày trước. Tái phát ở v1.44.2.
         Ảnh hưởng 312 người dùng. Chưa giao cho ai.
         → Chi phí: một dòng. Trả lời "tôi sửa gì, và nó có mới không?"</code></pre>
<p>Hãy để ý hàng thứ tư có những thứ mà không hàng nào khác có: một <strong>lần đầu thấy</strong>, một <strong>số người dùng bị ảnh hưởng</strong>, và một <strong>người chịu trách nhiệm</strong>. Những thứ đó biến một dòng sự kiện thành một đầu việc.</p>

<h3>Gom nhóm chính là toàn bộ sản phẩm</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một dấu vân tay được tính từ stack trace</span><span class="lz-d">Thường là vài khung trong-ứng-dụng ở trên cùng cộng loại ngoại lệ. Hai sự kiện cùng vân tay là cùng một vấn đề, bất kể xảy ra lúc nào và với ai.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Các lần xảy ra gộp lại thành một dòng</span><span class="lz-d">Mười nghìn sự kiện, một dòng trong danh sách. Đây là lý do một bảng Sentry vẫn đọc được sau một sự cố còn một cuộc tìm kiếm log thì không.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái dòng ấy có trạng thái do bạn điều khiển</span><span class="lz-d">Đã giải quyết, bỏ qua, đã giao. Và &quot;đã giải quyết&quot; không phải một ghi chú cho chính mình — nó nghĩa là <em>báo lại cho tôi nếu cái này quay lại</em>, và đó là việc phát hiện tái phát mà bạn không lấy được từ log.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">MỚI so với TÁI PHÁT trở thành một phân biệt hạng nhất</span><span class="lz-d">&quot;Thấy lần đầu 4 phút trước, 40 sự kiện&quot; và &quot;thấy lần đầu 8 tháng trước, 90.000 sự kiện&quot; xứng đáng nhận hai phản ứng hoàn toàn khác nhau. Chẳng có gì trong một dòng log phân biệt được chúng.</span></div>
</div>

<h3>Kho này đã làm đúng điều gì</h3>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts — chính dòng chú thích là bài học
// Report to Sentry — but only for 5xx errors. Client errors (4xx)
// are not bugs and would just spam the dashboard.
if (statusCode &gt;= 500) {
  captureException(err, {
    url: req.originalUrl, method: req.method, statusCode, code: err.code,
  });
}</code></pre>
<p>Sự phân biệt đó là dòng quan trọng nhất trong file, và nó là cái mà phần lớn dự án làm sai. Một lỗi 400 từ một request sai định dạng, một lỗi 401 từ một token hết hạn, một lỗi 404 cho một ghi chú đã xoá — đó là hệ thống đang <em>CHẠY ĐÚNG</em>. Gửi chúng vào hệ thống theo dõi lỗi thì tạo ra một bảng có mười nghìn &quot;lỗi&quot; mỗi ngày, không cái nào hành động được, và điều đó huấn luyện mọi người lờ nó đi. Sau đó thì cái công cụ ấy còn tệ hơn là không có, vì giờ có một chỗ mà người ta TIN là đang được canh chừng.</p>

<h3>Cũng trong file đó, phần ánh xạ lỗi Prisma</h3>
<pre><code class="language-typescript">// Map well-known Prisma errors (code &#96;Pxxxx&#96;) to a proper 4xx with a
// safe message, so an uncaught Prisma error surfaces as e.g. 409/404
// instead of a raw 500 that leaks table/column/query internals.
if (!err.statusCode &amp;&amp; typeof err.code === 'string' &amp;&amp; /^P\\d{4}$/.test(err.code)) {
  if (err.code === 'P2002')      { statusCode = 409; message = 'Giá trị đã tồn tại'; }
  else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
  else                           { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }
}</code></pre>
<pre><code>Đoạn này làm hai việc cùng lúc, và việc thứ hai mới thú vị:

  1. Bảo mật: một thông điệp lỗi Prisma thô gọi tên bảng và cột
     của bạn. Trả nó về cho client là biếu không tin do thám.

  2. CHẤT LƯỢNG TÍN HIỆU: một lần vi phạm ràng buộc duy nhất
     (P2002) là một người dùng gõ vào một email đã tồn tại. Trước
     phép ánh xạ này nó là một lỗi 500, do đó là một sự kiện
     Sentry, do đó là tiếng ồn. Sau đó, nó là một 409 và Sentry
     không bao giờ nghe thấy nó.

Mọi quyết định phân loại bạn đưa ra trong một bộ xử lỗi đồng thời
cũng là một quyết định về việc trình theo dõi lỗi của bạn sẽ chứa gì.</code></pre>

<h3>Cái dòng vẫn còn thiếu</h3>
<pre><code class="language-typescript">logger.error('Express error handler', {
  error: err.message, stack: err.stack, name: err.name,
  code: err.code, path: req.path, method: req.method,
  // ...không có requestId, không có traceId
});</code></pre>
<p>Chương 3 đã xác lập rằng <code>req.id</code> được ghi một lần và đọc không lần nào. Đây là dòng log mà điều đó tốn kém nhất: nó là dòng lỗi quan trọng nhất trong ứng dụng, và nó không ghép được với request đã sinh ra nó, cũng không ghép được với sự kiện Sentry, cũng không ghép được với trace. Bài 7.4 nối cả ba lại với nhau — hết bốn dòng.</p>

<h3>Khi nào một lỗi KHÔNG phải một lỗi</h3>
<pre><code>Đừng báo vào hệ thống theo dõi lỗi:

  · Bất cứ 4xx nào. Kiểm tra dữ liệu, xác thực, không tìm thấy.
    Đã xử lý ở trên.
  · Client ngắt kết nối giữa chừng (ECONNRESET,
    ERR_STREAM_PREMATURE_CLOSE). Người dùng đóng tab thôi.
  · Một request bị huỷ (AbortError). Chính bạn huỷ nó.
  · Một lần thử lại mà sau đó thành công. Hãy báo KẾT QUẢ CUỐI,
    không báo từng lần thử — không thì một phụ thuộc chập chờn
    với ba lần thử lại nhân ba số lỗi của bạn.
  · Một lỗi 503 đã biết từ thượng nguồn mà bạn vốn đã xử lý bằng
    một đường lùi, như cổng LLM lùi về một model Claude (kho này
    làm thế một cách có chủ ý). Hãy đếm nó thành một chỉ số;
    đừng gọi ai dậy.

HÃY báo:

  · Mọi ngoại lệ không bắt được hay promise bị từ chối không xử
    lý. Theo định nghĩa, đó là những tình huống bạn không lường trước.
  · Mọi lỗi 5xx.
  · Mọi vi phạm bất biến — "chuyện này lẽ ra không thể xảy ra" —
    kể cả khi bạn đã phục hồi được.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>catch (err) { logger.error(...) }</code> rồi chạy tiếp là cách một lỗi trở thành vĩnh viễn.</strong> Cái mẫu ấy trông có trách nhiệm: không có gì sập, có cái gì đó được ghi lại. Nhưng cái lỗi ấy không bao giờ tới được trình theo dõi lỗi của bạn, nên nó không có ngày thấy-lần-đầu, không có số người dùng, và không có người chịu trách nhiệm — còn cái dòng log nó tạo ra là một trong hàng nghìn dòng chẳng ai grep tới. <strong>Cái hại cụ thể là cái lỗi ấy giờ không còn cách nào để từng được ai nhận ra: hệ thống trông có vẻ khoẻ, chỉ số không hiện 5xx nào vì bạn đã nuốt nó, và bằng chứng duy nhất là một dòng trong một file hết hạn sau mười bốn ngày.</strong> Nếu bạn thật sự chạy tiếp được thì khối catch nên nói ra điều đó và ĐẾM nó: <code>metrics.recoverableErrors.inc({ kind: 'thumbnail_failed' })</code>, cộng một dòng log, cộng một chú thích giải thích vì sao chạy tiếp là đúng. Nếu bạn không diễn đạt được vì sao chạy tiếp là an toàn thì bạn không đang phục hồi — bạn đang giấu.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/product/issues/grouping-and-fingerprints/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Sentry — gom nhóm và dấu vân tay</span><span class="lc-sub">Vân tay được tính chính xác thế nào từ một stack trace, và cách ghi đè nó khi mặc định gom quá nhiều hoặc quá ít.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/process.html#event-unhandledrejection" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Node.js — unhandledRejection và uncaughtException</span><span class="lc-sub">Hai sự kiện của tiến trình bắt được thứ mà try/catch của bạn bỏ sót, và vì sao Node 22 mặc định kết thúc tiến trình khi có promise bị từ chối không xử lý.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '7.2 — Grouping: when one bug becomes ten thousand issues|||7.2 — Gom nhóm: khi một lỗi biến thành mười nghìn vấn đề',
      slug: 'obs-7-2-gom-nhom',
      type: 'VIDEO',
      description: 'Nội suy giá trị vào message làm vỡ vân tay. Hai kiểu vỡ, và cách chữa từng kiểu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Grouping: when one bug becomes ten thousand issues</h2>
<p class="lead">Lesson 7.1 said grouping is the whole product. So the way an error tracker fails is by grouping wrongly — and it fails in two opposite directions, both of which make the tool useless while it continues to look like it is working.</p>

<h3>Failure 1: over-splitting — one bug, thousands of rows</h3>
<pre><code class="language-typescript">// The single most common cause, and it looks like good practice
throw new Error(&#96;Note \${noteId} not found for user \${userId}&#96;);</code></pre>
<pre><code>Every distinct pair of ids produces a distinct message, which
produces a distinct fingerprint, which produces a distinct issue:

  Note abc123 not found for user u_8f3a   1 event
  Note def456 not found for user u_2b1c   1 event
  Note ghi789 not found for user u_9d4e   1 event
  ... 4,117 more

Consequences, all of them quiet:

  · No issue ever crosses an alert threshold, because every
    issue has exactly one event. A bug affecting 4,120 users
    generates no alert at all.
  · "Resolve" is meaningless — you resolve one, and the next
    occurrence creates a new issue rather than reopening it.
  · The issue list is unreadable, so people stop opening it.
  · You hit your event quota in an afternoon.</code></pre>
<pre><code class="language-typescript">// The fix: a STABLE message, with the variable data as context
throw new AppError('Note not found', 404, { noteId, userId });

// Sentry sees one issue, "Note not found", with 4,120 events,
// and each event carries its own noteId and userId in the
// structured context — searchable, but not part of the grouping.

// Note this is the same rule as lesson 1.2's stable log messages:
// the message identifies WHAT happened; the fields say WHICH one.</code></pre>

<h3>Failure 2: over-merging — many bugs, one row</h3>
<pre><code>A shared error path collapses unrelated failures:

  async function handleRequest(fn) {
    try { return await fn(); }
    catch (e) { throw new Error('Request failed'); }   // ⚠️
  }

Every failure in the application now has the same message and
the same top stack frame — this wrapper. Sentry sees ONE issue
called "Request failed" with 90,000 events, spanning a database
outage, a null dereference and an expired API key.

Symptoms of over-merging:

  · One issue with an implausibly large event count
  · Its stack traces all top out in the same helper
  · Resolving it is meaningless because it is never really
    fixed — some component of it is always failing

Fix: preserve the original error.

  catch (e) { throw new Error('Request failed', { cause: e }); }

The &#96;cause&#96; option is standard since ES2022 and Sentry reads it,
producing a chain of exceptions and fingerprinting on the
INNERMOST one — which is the actual bug.</code></pre>

<h3>How the fingerprint is actually computed</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Take the exception type and the stack trace</span><span class="lz-d"><code>TypeError</code> plus the frames. Different exception types never group together, even from the same line.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Keep only in-app frames</span><span class="lz-d">Frames from <code>node_modules</code> are marked not-in-app and excluded, so the same bug reached through two different library paths still groups. This is why <code>node_modules</code> classification matters more than it sounds.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">If there is no usable stack, fall back to the message</span><span class="lz-d">And this is where failure 1 lives. A minified or missing stack means the message becomes the fingerprint, so interpolated ids split it instantly.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hash it</span><span class="lz-d">Same hash, same issue. A stack that changes because you moved a function down two lines produces a <em>new</em> issue — an annoyance worth knowing about before you wonder why an old bug &quot;reappeared&quot; after a refactor.</span></div>
</div>

<h3>Taking control when the default is wrong</h3>
<pre><code class="language-typescript">// Force a group: all gateway timeouts are ONE issue, regardless
// of which model, endpoint or stack frame produced them.
Sentry.withScope((scope) =&gt; {
  scope.setFingerprint(['llm-gateway-timeout']);
  scope.setContext('gateway', { model, endpoint, ms });
  Sentry.captureException(err);
});</code></pre>
<pre><code class="language-typescript">// Force a SPLIT: one issue per failing host, because "fetch failed"
// from R2 and from modelapi.vn are genuinely different problems.
Sentry.withScope((scope) =&gt; {
  scope.setFingerprint(['{{ default }}', new URL(url).host]);
  Sentry.captureException(err);
});
// '{{ default }}' means "the normal fingerprint, PLUS this" —
// so you refine the grouping rather than replacing it.</code></pre>
<pre><code>When to override, and it is rarer than it feels:

  ✅ A whole CLASS of failures you always treat identically
     (all gateway timeouts, all R2 5xx). Group them.
  ✅ A generic error whose real distinction is a field, not
     a stack (fetch failed → split by host).
  ❌ "The grouping looks wrong." Usually the message has
     interpolated data. Fix the message; the grouping
     follows.</code></pre>

<h3>The quota question nobody asks until it bites</h3>
<pre><code>Error trackers bill per EVENT, not per issue. So a bug in a
retry loop is a billing incident as well as an outage:

  1 bug × 3 retries × 500 rps × 60s = 90,000 events per minute

Sentry's client-side rate limiting is the defence, and it is
off by default:

  Sentry.init({
    dsn: config.sentryDsn,
    // Drop everything past N events per hour, client-side,
    // before it costs anything.
    beforeSend(event) {
      if (rateLimiter.exceeded()) return null;   // null = drop
      return event;
    },
  });

Also worth setting: &#96;maxValueLength&#96; (truncates giant strings)
and &#96;normalizeDepth&#96; (stops a deep object graph becoming a
megabyte of JSON per event).</code></pre>

<div class="pitfall">
<p><strong>Trap — a refactor that moves code creates &quot;new&quot; issues for bugs that are years old, and the alert that fires reads as a fresh regression.</strong> Because the fingerprint includes stack frames, renaming a function, extracting a helper, or shifting a file by a few lines can change it — so a long-standing error you had triaged and ignored reappears as first-seen-today, at the top of the issue list, with a &quot;new issue&quot; alert attached. The specific harm is misdirected effort: <strong>the alert arrives just after a deploy, so it looks like the deploy caused it, and the natural response is to investigate a diff that has nothing to do with the bug.</strong> Before treating any post-deploy &quot;new&quot; issue as a regression, search the resolved and ignored issues for the same message and file — and for errors you intend to track across refactors, pin the fingerprint explicitly.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/guides/node/usage/sdk-fingerprinting/" target="_blank" rel="noopener">
  <span class="lc-ico">👆</span>
  <span class="lc-body"><span class="lc-title">Sentry — SDK fingerprinting</span><span class="lc-sub">setFingerprint, the {{ default }} placeholder, and the server-side grouping rules for when you cannot change the code.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause" target="_blank" rel="noopener">
  <span class="lc-ico">⛓️</span>
  <span class="lc-body"><span class="lc-title">Error.cause</span><span class="lc-sub">The ES2022 option that preserves the original error when you wrap it — the one-line fix for over-merging.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Gom nhóm: khi một lỗi biến thành mười nghìn vấn đề</h2>
<p class="lead">Bài 7.1 nói gom nhóm chính là toàn bộ sản phẩm. Vậy nên cách một trình theo dõi lỗi hỏng là gom nhóm SAI — và nó hỏng theo hai hướng ngược nhau, cả hai đều làm cái công cụ thành vô dụng trong khi nó vẫn tiếp tục trông như đang chạy tốt.</p>

<h3>Hỏng kiểu 1: chẻ quá nhỏ — một lỗi, hàng nghìn dòng</h3>
<pre><code class="language-typescript">// Nguyên nhân phổ biến nhất, và nó trông như một thói quen tốt
throw new Error(&#96;Note \${noteId} not found for user \${userId}&#96;);</code></pre>
<pre><code>Mỗi cặp id khác nhau sinh ra một thông điệp khác nhau, sinh ra
một dấu vân tay khác nhau, sinh ra một vấn đề khác nhau:

  Note abc123 not found for user u_8f3a   1 sự kiện
  Note def456 not found for user u_2b1c   1 sự kiện
  Note ghi789 not found for user u_9d4e   1 sự kiện
  ... 4.117 cái nữa

Hệ quả, và tất cả đều lặng lẽ:

  · Không vấn đề nào từng vượt được một ngưỡng cảnh báo, vì mỗi
    vấn đề có đúng một sự kiện. Một lỗi ảnh hưởng 4.120 người
    dùng chẳng sinh ra cảnh báo nào cả.
  · "Đã giải quyết" trở nên vô nghĩa — bạn giải quyết một cái,
    và lần xảy ra kế tiếp tạo ra một vấn đề MỚI chứ không mở lại
    cái cũ.
  · Danh sách vấn đề không đọc nổi, nên người ta thôi mở nó ra.
  · Bạn cháy hạn mức sự kiện trong một buổi chiều.</code></pre>
<pre><code class="language-typescript">// Cách chữa: một thông điệp ỔN ĐỊNH, với dữ liệu biến thiên làm ngữ cảnh
throw new AppError('Note not found', 404, { noteId, userId });

// Sentry thấy MỘT vấn đề, "Note not found", với 4.120 sự kiện,
// và mỗi sự kiện mang noteId và userId của riêng nó trong phần
// ngữ cảnh có cấu trúc — tìm kiếm được, nhưng không tham gia vào
// việc gom nhóm.

// Để ý đây là đúng cái luật thông-điệp-log-ổn-định ở bài 1.2:
// thông điệp định danh chuyện GÌ đã xảy ra; các trường nói CÁI NÀO.</code></pre>

<h3>Hỏng kiểu 2: gộp quá to — nhiều lỗi, một dòng</h3>
<pre><code>Một đường xử lỗi dùng chung gộp phăng những cú hỏng chẳng liên quan:

  async function handleRequest(fn) {
    try { return await fn(); }
    catch (e) { throw new Error('Request failed'); }   // ⚠️
  }

Mọi cú hỏng trong ứng dụng giờ có cùng một thông điệp và cùng một
khung stack trên cùng — chính cái hàm bọc này. Sentry thấy MỘT vấn
đề tên "Request failed" với 90.000 sự kiện, trải từ một sự cố cơ sở
dữ liệu tới một lần truy cập null tới một khoá API hết hạn.

Triệu chứng của gộp quá to:

  · Một vấn đề có số sự kiện lớn tới mức khó tin
  · Mọi stack trace của nó đều kết ở cùng một hàm trợ giúp
  · Giải quyết nó là vô nghĩa vì nó không bao giờ thật sự được
    sửa — luôn có một thành phần nào đó của nó đang hỏng

Cách chữa: giữ lại lỗi gốc.

  catch (e) { throw new Error('Request failed', { cause: e }); }

Tuỳ chọn &#96;cause&#96; là chuẩn từ ES2022 và Sentry có đọc nó, tạo ra
một chuỗi ngoại lệ và lấy vân tay theo cái TRONG CÙNG — mà đó mới
là cái lỗi thật.</code></pre>

<h3>Dấu vân tay thật ra được tính thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lấy loại ngoại lệ và stack trace</span><span class="lz-d"><code>TypeError</code> cộng các khung. Các loại ngoại lệ khác nhau không bao giờ gom chung, kể cả khi cùng một dòng mã.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chỉ giữ các khung trong-ứng-dụng</span><span class="lz-d">Khung từ <code>node_modules</code> bị đánh dấu là không-trong-ứng-dụng và bị loại bỏ, nên cùng một lỗi đi tới qua hai đường thư viện khác nhau vẫn gom chung được. Đây là lý do việc phân loại <code>node_modules</code> quan trọng hơn vẻ ngoài của nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Không có stack dùng được thì lùi về thông điệp</span><span class="lz-d">Và đây là chỗ hỏng kiểu 1 sống. Một stack bị rút gọn hoặc thiếu nghĩa là thông điệp trở thành vân tay, nên id nội suy chẻ nó ra ngay tức khắc.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Băm nó ra</span><span class="lz-d">Cùng giá trị băm, cùng vấn đề. Một stack đổi vì bạn dời một hàm xuống hai dòng sẽ sinh ra một vấn đề <em>MỚI</em> — một sự phiền toái đáng biết trước khi bạn ngồi thắc mắc vì sao một lỗi cũ &quot;quay lại&quot; sau một lần tái cấu trúc.</span></div>
</div>

<h3>Giành quyền điều khiển khi mặc định sai</h3>
<pre><code class="language-typescript">// Ép GOM: mọi lần cổng hết giờ là MỘT vấn đề, bất kể model,
// endpoint hay khung stack nào sinh ra chúng.
Sentry.withScope((scope) =&gt; {
  scope.setFingerprint(['llm-gateway-timeout']);
  scope.setContext('gateway', { model, endpoint, ms });
  Sentry.captureException(err);
});</code></pre>
<pre><code class="language-typescript">// Ép CHẺ: mỗi host hỏng một vấn đề, vì "fetch failed" từ R2 và
// từ modelapi.vn thật sự là hai vấn đề khác nhau.
Sentry.withScope((scope) =&gt; {
  scope.setFingerprint(['{{ default }}', new URL(url).host]);
  Sentry.captureException(err);
});
// '{{ default }}' nghĩa là "cái vân tay bình thường, CỘNG cái này" —
// nên bạn tinh chỉnh cách gom nhóm chứ không thay thế nó.</code></pre>
<pre><code>Khi nào nên ghi đè, và nó hiếm hơn cảm giác của bạn:

  ✅ Cả một LỚP cú hỏng mà bạn luôn xử lý y hệt nhau (mọi lần
     cổng hết giờ, mọi 5xx của R2). Hãy gom chúng lại.
  ✅ Một lỗi chung chung mà sự phân biệt thật nằm ở một trường
     chứ không ở stack (fetch failed → chẻ theo host).
  ❌ "Cách gom nhóm trông sai." Thường là thông điệp có dữ liệu
     nội suy. Hãy chữa cái thông điệp; cách gom nhóm sẽ theo sau.</code></pre>

<h3>Câu hỏi hạn mức không ai hỏi cho tới lúc bị cắn</h3>
<pre><code>Trình theo dõi lỗi tính tiền theo SỰ KIỆN, không theo vấn đề. Nên
một cái lỗi nằm trong vòng lặp thử lại vừa là một sự cố vừa là một
sự cố hoá đơn:

  1 lỗi × 3 lần thử lại × 500 rps × 60s = 90.000 sự kiện mỗi phút

Việc giới hạn tốc độ ở phía client là lớp phòng thủ, và mặc định
nó TẮT:

  Sentry.init({
    dsn: config.sentryDsn,
    // Vứt mọi thứ vượt quá N sự kiện mỗi giờ, ngay ở phía client,
    // trước khi nó tốn đồng nào.
    beforeSend(event) {
      if (rateLimiter.exceeded()) return null;   // null = vứt
      return event;
    },
  });

Cũng đáng đặt: &#96;maxValueLength&#96; (cắt cụt chuỗi khổng lồ) và
&#96;normalizeDepth&#96; (chặn một đồ thị object sâu biến thành một
megabyte JSON cho mỗi sự kiện).</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một lần tái cấu trúc dời mã đi sẽ tạo ra những vấn đề &quot;MỚI&quot; cho những lỗi đã nhiều năm tuổi, và cái cảnh báo nổ ra đọc lên như một cú tái phát tươi mới.</strong> Vì dấu vân tay bao gồm các khung stack, việc đổi tên một hàm, tách ra một hàm trợ giúp, hay dịch một file đi vài dòng đều có thể làm nó đổi — nên một lỗi cũ kỹ mà bạn đã phân loại và lờ đi lại xuất hiện với ngày thấy-lần-đầu là hôm nay, ở đầu danh sách vấn đề, kèm một cảnh báo &quot;vấn đề mới&quot;. Cái hại cụ thể là công sức bị chỉ sai hướng: <strong>cảnh báo tới ngay sau một lần deploy, nên nó trông như lần deploy gây ra, và phản ứng tự nhiên là đi điều tra một cái diff chẳng liên quan gì tới cái lỗi ấy.</strong> Trước khi coi bất cứ vấn đề &quot;mới&quot; nào sau deploy là một cú tái phát, hãy tìm trong danh sách đã-giải-quyết và đã-bỏ-qua xem có cùng thông điệp và cùng file không — và với những lỗi bạn muốn theo dõi xuyên các lần tái cấu trúc, hãy ghim vân tay một cách tường minh.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/guides/node/usage/sdk-fingerprinting/" target="_blank" rel="noopener">
  <span class="lc-ico">👆</span>
  <span class="lc-body"><span class="lc-title">Sentry — lấy vân tay ở SDK</span><span class="lc-sub">setFingerprint, chỗ giữ {{ default }}, và các luật gom nhóm phía máy chủ cho khi bạn không sửa được mã.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause" target="_blank" rel="noopener">
  <span class="lc-ico">⛓️</span>
  <span class="lc-body"><span class="lc-title">Error.cause</span><span class="lc-sub">Tuỳ chọn của ES2022 giữ lại lỗi gốc khi bạn bọc nó — cách chữa một dòng cho việc gộp quá to.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '7.3 — PII in error reports, and what this repo does about it|||7.3 — Dữ liệu cá nhân trong báo cáo lỗi, và kho này làm gì với nó',
      slug: 'obs-7-3-pii',
      type: 'VIDEO',
      description: 'sendDefaultPii: false, beforeSend cắt cookie và header — và ba đường rò mà những thứ đó KHÔNG bịt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>PII in error reports, and what this repo does about it</h2>
<p class="lead">An error report is the richest payload your application ever sends to a third party: a stack trace, local state, the request that caused it. Lesson 1.2 established the discipline for logs. Error tracking needs it more, because the data leaves your infrastructure entirely — and because the SDK's defaults are chosen for debugging convenience, not for you.</p>

<h3>What an unconfigured SDK sends</h3>
<pre><code>By default, @sentry/node with sendDefaultPii: true attaches:

  · The full request URL, INCLUDING the query string
    → /api/v1/ai/stream?token=eyJhbGciOi...  (this repo has
      SSE endpoints that accept a JWT this way — src/index.ts
      redacts it for morgan, but Sentry is a separate path)
  · All request headers
    → Cookie: backend_token=eyJ...   Authorization: Bearer ...
  · The client IP address
  · The request body, for some integrations
  · Local variables in stack frames, on some platforms

So one unhandled exception on an authenticated route can put a
working session token into a third-party system, where it sits
for 90 days and is visible to everyone on the team.</code></pre>

<h3>What this repository configures</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts — the header comment states the goal
// - **Privacy first**: we strip cookies, authorization headers,
//   and request bodies before sending them to Sentry. PII like
//   passwords, JWTs, and email addresses is never included.

Sentry.init({
  dsn: config.sentryDsn,
  environment: config.sentryEnvironment,
  release: config.sentryRelease || undefined,
  tracesSampleRate: config.sentryTracesSampleRate,   // 10%, not the 1.0 default
  sendDefaultPii: false,                             // ← the important line
  beforeSendTransaction(event) {
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
    }
    return event;
  },
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>sendDefaultPii: false</code> is the whole defence</span><span class="lz-d">One boolean removes IP, cookies, headers and user identifiers from every event. Everything else is belt-and-braces on top of it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Defence in depth, deliberately</span><span class="lz-d">The <code>beforeSend</code> hooks delete cookies and auth headers <em>again</em>, so a future SDK upgrade that changes the default cannot silently start leaking.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">No-op when the DSN is absent</span><span class="lz-d">The SDK is never touched without a DSN, so local development and CI cannot accidentally send anything anywhere. Worth copying.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">10% trace sampling, chosen against the 1.0 default</span><span class="lz-d">Chapter 6's arithmetic applied to a vendor's meter — and the comment says why, which is what makes it maintainable.</span></div>
</div>

<h3>Three leaks that none of this stops</h3>
<pre><code>LEAK 1 — the error MESSAGE itself.

  throw new Error(&#96;No user with email \${email}&#96;);

  The message is the one field no redaction touches, because
  it is the thing being reported. And it is also the field
  people most naturally interpolate into. Same fix as lesson
  7.2: stable message, data in context.

LEAK 2 — the URL, when ids are in the path.

  /api/v1/users/nguyenvancuong@gmail.com/notes

  sendDefaultPii: false does not strip the path. If your
  routes take an email or a phone number as a parameter, it
  is in every event. Redact in beforeSend:

    event.request.url = event.request.url.replace(
      /[\\w.+-]+@[\\w-]+\\.[\\w.]+/g, '[email]');

LEAK 3 — additional context you attach yourself.

  captureException(err, { url, method, statusCode, code });

  This repo's captureException takes a context object, and
  whatever a caller puts in it is sent verbatim. The
  redaction above operates on event.request, not on your
  custom context. Every call site is a place to get this
  wrong, which is why lesson 1.2's "decide by what the field
  CAN contain" rule applies here too.</code></pre>

<h3>The user identifier: the deliberate exception</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts:129
export function setUser(userId: string | number | null): void {
  if (!userId) Sentry.setUser(null);
  else Sentry.setUser({ id: String(userId) });
}</code></pre>
<pre><code>An opaque internal id, and nothing else — no email, no name,
no IP. That is the right shape, and it buys something real:

  "312 users affected"     ← needs a user id to count
  "only this one user"     ← tells you it is data-specific
  "everyone since 14:03"   ← tells you it is a deploy

Without any user identity, an error tracker cannot distinguish
"one user retrying 4,120 times" from "4,120 users hit once",
and those demand opposite responses.

The trade-off is real and worth stating: an internal id is
still a pseudonymous identifier under GDPR. It is defensible
because it is minimal and because you can honour a deletion
request by deleting events for that id — which you cannot do
if the identity is smeared across free-text messages.</code></pre>

<h3>Verify rather than assume</h3>
<pre><code class="language-bash"># The only reliable check: cause a real error and read the event.
# 1. Trigger a 500 on an authenticated route in staging
# 2. Open the event in Sentry
# 3. Read, in order:
#      · the exception MESSAGE      ← leak 1
#      · request.url                ← leak 2
#      · request.headers            ← should be stripped
#      · every "Additional Data" /
#        custom context block       ← leak 3
#      · breadcrumbs                ← often forgotten; HTTP
#                                     breadcrumbs carry URLs

# Configuration says what SHOULD happen. Only the event says
# what DID. This is the same lesson as the deploy smoke-test:
# check the checker before you trust it.</code></pre>

<div class="pitfall">
<p><strong>Trap — breadcrumbs are collected automatically and are not covered by the <code>beforeSend</code> hooks above.</strong> Sentry records the last ~100 things that happened before an error — HTTP requests, console output, database queries — and attaches them to the event. The redaction in this repo operates on <code>event.request</code>, which is the request that failed; the breadcrumb trail is a separate array carrying the URLs, methods and often the response bodies of everything <em>leading up to</em> it. <strong>So an error on a harmless endpoint can ship the query string of the authenticated call three steps earlier, including a token that <code>event.request</code> would have had stripped.</strong> Console breadcrumbs are worse still: they capture <code>console.log</code> output verbatim, so any debugging line anyone ever left in becomes part of your error payloads. Set <code>beforeBreadcrumb</code> to filter them, or disable the console and HTTP breadcrumb integrations entirely.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/guides/node/data-management/sensitive-data/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Sentry — scrubbing sensitive data</span><span class="lc-sub">sendDefaultPii, beforeSend, beforeBreadcrumb and the server-side scrubbing rules, with the exact list of what each one covers.</span></span>
</a>
<a class="link-card dl" href="https://docs.sentry.io/product/data-management-settings/scrubbing/server-side-scrubbing/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Sentry — server-side scrubbing</span><span class="lc-sub">The second layer, applied at ingest, which catches leaks from SDKs and versions you do not control.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Dữ liệu cá nhân trong báo cáo lỗi, và kho này làm gì với nó</h2>
<p class="lead">Một báo cáo lỗi là gói dữ liệu giàu có nhất mà ứng dụng của bạn từng gửi cho một bên thứ ba: một stack trace, trạng thái cục bộ, và cái request đã gây ra nó. Bài 1.2 đã xác lập kỷ luật cho log. Theo dõi lỗi cần nó nhiều hơn, vì dữ liệu rời khỏi hạ tầng của bạn hoàn toàn — và vì các mặc định của SDK được chọn cho sự tiện lợi khi gỡ lỗi, không phải cho bạn.</p>

<h3>Một SDK không cấu hình sẽ gửi đi những gì</h3>
<pre><code>Mặc định, @sentry/node với sendDefaultPii: true đính kèm:

  · Trọn URL của request, KỂ CẢ chuỗi truy vấn
    → /api/v1/ai/stream?token=eyJhbGciOi...  (kho này có các
      endpoint SSE nhận JWT theo kiểu đó — src/index.ts có che
      nó cho morgan, nhưng Sentry là một đường riêng)
  · Mọi header của request
    → Cookie: backend_token=eyJ...   Authorization: Bearer ...
  · Địa chỉ IP của client
  · Phần thân request, với vài bộ tích hợp
  · Biến cục bộ trong các khung stack, trên vài nền tảng

Nên một ngoại lệ không bắt được trên một route đã xác thực có
thể đưa một token phiên còn dùng được vào một hệ thống của bên
thứ ba, nơi nó nằm đó 90 ngày và ai trong nhóm cũng xem được.</code></pre>

<h3>Kho này cấu hình những gì</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts — chú thích đầu file nêu rõ mục tiêu
// - **Privacy first**: we strip cookies, authorization headers,
//   and request bodies before sending them to Sentry. PII like
//   passwords, JWTs, and email addresses is never included.

Sentry.init({
  dsn: config.sentryDsn,
  environment: config.sentryEnvironment,
  release: config.sentryRelease || undefined,
  tracesSampleRate: config.sentryTracesSampleRate,   // 10%, không phải mặc định 1.0
  sendDefaultPii: false,                             // ← dòng quan trọng
  beforeSendTransaction(event) {
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
    }
    return event;
  },
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>sendDefaultPii: false</code> là toàn bộ lớp phòng thủ</span><span class="lz-d">Một giá trị luận lý gỡ bỏ IP, cookie, header và định danh người dùng khỏi mọi sự kiện. Mọi thứ khác là thắt lưng cộng dây đeo quần chồng lên nó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phòng thủ nhiều lớp, một cách có chủ ý</span><span class="lz-d">Các móc <code>beforeSend</code> xoá cookie và header xác thực <em>một lần nữa</em>, nên một lần nâng cấp SDK trong tương lai làm đổi mặc định cũng không thể âm thầm bắt đầu rò rỉ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Không làm gì cả khi vắng DSN</span><span class="lz-d">SDK không bao giờ bị đụng tới khi không có DSN, nên môi trường phát triển và CI không thể vô tình gửi gì đi đâu. Đáng chép lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Lấy mẫu trace 10%, chọn để chống lại mặc định 1.0</span><span class="lz-d">Phép tính ở chương 6 áp dụng lên đồng hồ tính tiền của một nhà cung cấp — và dòng chú thích nói rõ vì sao, đó là thứ làm nó bảo trì được.</span></div>
</div>

<h3>Ba đường rò mà không có gì trong đó bịt được</h3>
<pre><code>RÒ 1 — chính cái THÔNG ĐIỆP lỗi.

  throw new Error(&#96;No user with email \${email}&#96;);

  Thông điệp là trường duy nhất mà không phép che nào đụng tới,
  vì nó chính là cái thứ đang được báo cáo. Và nó cũng là trường
  mà người ta hay nội suy vào nhất một cách tự nhiên. Cách chữa
  vẫn như bài 7.2: thông điệp ổn định, dữ liệu nằm ở ngữ cảnh.

RÒ 2 — cái URL, khi id nằm trong đường dẫn.

  /api/v1/users/nguyenvancuong@gmail.com/notes

  sendDefaultPii: false KHÔNG cắt phần đường dẫn. Nếu route của
  bạn nhận email hay số điện thoại làm tham số, nó nằm trong mọi
  sự kiện. Hãy che trong beforeSend:

    event.request.url = event.request.url.replace(
      /[\\w.+-]+@[\\w-]+\\.[\\w.]+/g, '[email]');

RÒ 3 — phần ngữ cảnh phụ mà chính bạn đính kèm.

  captureException(err, { url, method, statusCode, code });

  Hàm captureException của kho này nhận một object ngữ cảnh, và
  bất cứ thứ gì người gọi nhét vào đó đều được gửi nguyên văn.
  Phép che ở trên thao tác trên event.request, không thao tác
  trên ngữ cảnh tự đặt của bạn. Mỗi chỗ gọi là một chỗ để làm
  sai điều này, và đó là lý do cái luật "quyết theo việc trường
  ấy CÓ THỂ chứa gì" của bài 1.2 cũng áp dụng ở đây.</code></pre>

<h3>Định danh người dùng: ngoại lệ có chủ ý</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts:129
export function setUser(userId: string | number | null): void {
  if (!userId) Sentry.setUser(null);
  else Sentry.setUser({ id: String(userId) });
}</code></pre>
<pre><code>Một id nội bộ mờ đục, và không gì khác — không email, không tên,
không IP. Đó là hình dạng đúng, và nó mua được một thứ có thật:

  "312 người dùng bị ảnh hưởng"  ← cần một id người dùng để đếm
  "chỉ một người dùng này thôi"  ← nói cho bạn nó đặc thù dữ liệu
  "mọi người kể từ 14:03"        ← nói cho bạn đó là một lần deploy

Không có định danh người dùng nào thì một trình theo dõi lỗi
không phân biệt được "một người dùng thử lại 4.120 lần" với
"4.120 người dùng bị trúng một lần", mà hai cái đó đòi hỏi hai
phản ứng ngược nhau.

Sự đánh đổi là có thật và đáng nói rõ: một id nội bộ vẫn là một
định danh giả danh theo GDPR. Nó bảo vệ được vì nó tối thiểu và
vì bạn đáp ứng được một yêu cầu xoá bằng cách xoá các sự kiện
của cái id đó — thứ bạn KHÔNG làm được nếu danh tính bị bôi trét
khắp các thông điệp văn bản tự do.</code></pre>

<h3>Hãy kiểm chứ đừng giả định</h3>
<pre><code class="language-bash"># Phép kiểm đáng tin duy nhất: gây một lỗi thật rồi đọc sự kiện.
# 1. Kích một lỗi 500 trên một route đã xác thực ở môi trường thử
# 2. Mở sự kiện đó trong Sentry
# 3. Đọc, theo thứ tự:
#      · THÔNG ĐIỆP ngoại lệ         ← rò 1
#      · request.url                 ← rò 2
#      · request.headers             ← lẽ ra phải bị cắt
#      · mọi khối "Additional Data" /
#        ngữ cảnh tự đặt             ← rò 3
#      · breadcrumb                  ← hay bị quên; breadcrumb
#                                      HTTP có mang URL

# Cấu hình nói cái gì LẼ RA xảy ra. Chỉ có sự kiện mới nói cái gì
# ĐÃ xảy ra. Đây vẫn là bài học của phép kiểm khói lúc deploy:
# hãy kiểm bộ kiểm trước khi tin nó.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — breadcrumb được thu thập tự động và KHÔNG nằm trong phạm vi của các móc <code>beforeSend</code> ở trên.</strong> Sentry ghi lại khoảng 100 việc gần nhất đã xảy ra trước một lỗi — các request HTTP, đầu ra console, truy vấn cơ sở dữ liệu — rồi đính chúng vào sự kiện. Phép che trong kho này thao tác trên <code>event.request</code>, tức là cái request đã hỏng; còn cái vệt breadcrumb là một mảng riêng mang theo URL, method và thường cả phần thân phản hồi của mọi thứ <em>DẪN TỚI</em> nó. <strong>Nên một lỗi trên một endpoint vô hại vẫn có thể chuyển đi chuỗi truy vấn của lời gọi đã xác thực ba bước trước đó, kể cả một token mà <code>event.request</code> lẽ ra đã cắt bỏ.</strong> Breadcrumb của console còn tệ hơn: nó chộp đầu ra <code>console.log</code> nguyên văn, nên bất cứ dòng gỡ lỗi nào ai đó từng để quên lại cũng thành một phần trong gói dữ liệu lỗi của bạn. Hãy đặt <code>beforeBreadcrumb</code> để lọc chúng, hoặc tắt hẳn bộ tích hợp breadcrumb cho console và HTTP.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/guides/node/data-management/sensitive-data/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Sentry — cọ rửa dữ liệu nhạy cảm</span><span class="lc-sub">sendDefaultPii, beforeSend, beforeBreadcrumb và các luật cọ rửa phía máy chủ, kèm danh sách chính xác từng cái phủ được gì.</span></span>
</a>
<a class="link-card dl" href="https://docs.sentry.io/product/data-management-settings/scrubbing/server-side-scrubbing/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Sentry — cọ rửa phía máy chủ</span><span class="lc-sub">Lớp thứ hai, áp dụng lúc nạp vào, bắt được các đường rò từ những SDK và phiên bản bạn không kiểm soát.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '7.4 — Releases, source maps, and joining the four pillars|||7.4 — Bản phát hành, source map, và nối bốn trụ cột lại',
      slug: 'obs-7-4-release-va-noi-lai',
      type: 'VIDEO',
      description: 'Không có release thì "lần deploy nào gây ra?" là một phỏng đoán. Bốn dòng nối lỗi với log, trace và request.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Releases, source maps, and joining the four pillars</h2>
<p class="lead">Chapters 1 through 7 built four systems. This lesson is the four lines that make them one system — plus the release marker without which the single most common incident question, &quot;was it the deploy?&quot;, cannot be answered.</p>

<h3>The release is a version string, and it does four jobs</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts already reads it
Sentry.init({
  release: config.sentryRelease || undefined,
  environment: config.sentryEnvironment,
});</code></pre>
<pre><code class="language-dockerfile"># Dockerfile — where the value has to come from
ARG GIT_SHA
ENV SENTRY_RELEASE=$GIT_SHA</code></pre>
<pre><code class="language-bash"># deploy-nha.sh — one flag on the build
docker build --build-arg GIT_SHA="$(git rev-parse --short HEAD)" ...</code></pre>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Job 1</span><span class="lz-t">Regression detection</span><span class="lz-d">An issue marked resolved that reappears in a <em>later</em> release is a regression, and Sentry says so. Without a release it is just a reopened issue with no indication of what changed.</span></div>
  <div class="lz-node"><span class="lz-k">Job 2</span><span class="lz-t">&quot;First seen in&quot;</span><span class="lz-d">The single most useful field on an issue page. It converts &quot;when did this start&quot; into a commit range, which converts into a diff.</span></div>
  <div class="lz-node"><span class="lz-k">Job 3</span><span class="lz-t">Suspect commits</span><span class="lz-d">Given a release and the stack trace's file and line, Sentry can name the commit that last touched that line. Sometimes wrong; free when it is right.</span></div>
  <div class="lz-node"><span class="lz-k">Job 4</span><span class="lz-t">Source-map association</span><span class="lz-d">Maps are uploaded per release. Without a release, an unreadable stack cannot be resolved, because nothing knows which build produced it.</span></div>
</div>

<h3>Source maps: only the frontend needs them, and it needs them badly</h3>
<pre><code>The backend runs compiled TypeScript with inline maps and
readable stacks. The FRONTEND is minified:

  Without maps:
    TypeError: Cannot read property 'map' of undefined
      at t (main-4f3a2b1c.js:1:48291)
      at n (main-4f3a2b1c.js:1:12043)

  With maps:
    TypeError: Cannot read property 'map' of undefined
      at NoteList (src/components/notes/NoteList.tsx:42:18)
      at renderWithHooks (react-dom.js:14985:18)

The first one is unactionable. It is not "hard to debug" —
there is no information in it at all.</code></pre>
<pre><code class="language-bash"># Upload maps at BUILD time, then delete them before shipping.
npx @sentry/cli sourcemaps inject ./frontend/.next
npx @sentry/cli sourcemaps upload ./frontend/.next \\
  --release "$GIT_SHA"

# ⚠️ Then remove them from the image. A public .map file lets
# anyone reconstruct your entire frontend source.
find ./frontend/.next -name '*.map' -delete</code></pre>

<h3>The four lines that join everything</h3>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts — the current log call
logger.error('Express error handler', {
  error: err.message, stack: err.stack, name: err.name,
  code: err.code, path: req.path, method: req.method,
});

// ...with chapter 3's context, and Sentry's event id back
const ctx = currentContext();
Sentry.withScope((scope) =&gt; {
  scope.setTag('request_id', ctx?.requestId ?? 'unknown');   // 1
  scope.setTag('trace_id',   ctx?.traceId   ?? 'unknown');   // 2
  const eventId = Sentry.captureException(err);
  logger.error('Express error handler', {
    error: err.message, stack: err.stack, name: err.name,
    code: err.code, path: req.path, method: req.method,
    requestId: ctx?.requestId,                                // 3
    sentryEventId: eventId,                                   // 4
  });
});</code></pre>
<pre><code>What those four lines buy, in both directions:

  From a Sentry issue → the logs
    The request_id tag is searchable. Copy it, paste into
    Loki, get every line of that request — including the
    ones before the error that explain it.

  From a log line → the Sentry issue
    sentryEventId in the log links straight to the event
    with its stack, breadcrumbs and user count.

  From a Sentry issue → the trace
    trace_id opens the waterfall. Chapter 6's shapes, on
    the exact request that failed.

  From a user's screenshot → all three
    X-Request-ID (lesson 3.1) is the request_id tag.

That is the whole system, closed. Four pillars, one key.</code></pre>

<h3>Returning the key to the user</h3>
<pre><code class="language-typescript">// The error response already returns a code. Add the request id.
res.status(statusCode).json({
  success: false,
  message,                       // generic on 5xx — lesson 7.1
  code: err.code,
  requestId: ctx?.requestId,     // ← safe to expose, and useful
});</code></pre>
<pre><code>Why this is worth doing:

  · A user reporting a bug can quote it. "Error, ref
    V1StGXR8_Z5j" turns a support conversation into an
    exact lookup.
  · It is NOT sensitive: a random 12-character id reveals
    nothing about your system.
  · It is already in the X-Request-ID response header —
    putting it in the body just makes it visible to a human
    reading an error dialog rather than a developer reading
    devtools.

Front-end: render it small and grey under the error message.
It costs nothing and it converts your worst support tickets
into your fastest ones.</code></pre>

<div class="pitfall">
<p><strong>Trap — a release string that is not unique per build makes every field above lie, quietly.</strong> Using <code>package.json</code>'s version, or a branch name, or <code>latest</code>, means several different builds share one release identifier — so &quot;first seen in v1.4.0&quot; covers a fortnight of deploys, regression detection cannot fire because the version never changed, and source maps uploaded for a later build overwrite the earlier ones so old stack traces resolve to the <em>wrong lines</em>. That last one is the worst, because it does not fail: it produces a file and line number that look perfectly plausible and point somewhere unrelated, and you will read that code carefully before doubting it. <strong>Use the git SHA. It is unique by construction, it maps to a diff, and <code>git rev-parse --short HEAD</code> is already available at build time in <code>deploy-nha.sh</code>.</strong></p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/product/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Sentry — releases</span><span class="lc-sub">Regression detection, suspect commits, and the release-health metrics that come free once the version string is unique.</span></span>
</a>
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/sourcemaps/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Sentry — source maps</span><span class="lc-sub">The inject-and-upload flow used above, debug ids, and how to verify a map actually resolved rather than silently failing.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Bản phát hành, source map, và nối bốn trụ cột lại</h2>
<p class="lead">Chương 1 tới 7 đã dựng ra bốn hệ thống. Bài này là bốn dòng biến chúng thành MỘT hệ thống — cộng với cái dấu bản phát hành mà thiếu nó thì câu hỏi phổ biến nhất trong mọi sự cố, &quot;có phải do lần deploy không?&quot;, không trả lời được.</p>

<h3>Bản phát hành là một chuỗi phiên bản, và nó làm bốn việc</h3>
<pre><code class="language-typescript">// src/services/sentry.service.ts vốn đã đọc nó
Sentry.init({
  release: config.sentryRelease || undefined,
  environment: config.sentryEnvironment,
});</code></pre>
<pre><code class="language-dockerfile"># Dockerfile — chỗ cái giá trị đó phải đến từ
ARG GIT_SHA
ENV SENTRY_RELEASE=$GIT_SHA</code></pre>
<pre><code class="language-bash"># deploy-nha.sh — một cái cờ trên lệnh build
docker build --build-arg GIT_SHA="$(git rev-parse --short HEAD)" ...</code></pre>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Việc 1</span><span class="lz-t">Phát hiện tái phát</span><span class="lz-d">Một vấn đề đã đánh dấu giải quyết mà xuất hiện lại ở một bản phát hành <em>SAU</em> là một cú tái phát, và Sentry nói rõ thế. Không có bản phát hành thì nó chỉ là một vấn đề mở lại, không kèm chút manh mối nào về việc gì đã đổi.</span></div>
  <div class="lz-node"><span class="lz-k">Việc 2</span><span class="lz-t">&quot;Thấy lần đầu ở&quot;</span><span class="lz-d">Trường hữu ích nhất trên trang một vấn đề. Nó biến &quot;cái này bắt đầu khi nào&quot; thành một dải commit, rồi biến thành một cái diff.</span></div>
  <div class="lz-node"><span class="lz-k">Việc 3</span><span class="lz-t">Commit tình nghi</span><span class="lz-d">Cho một bản phát hành và file với dòng trong stack trace, Sentry gọi tên được cái commit gần nhất đụng vào dòng đó. Đôi khi sai; miễn phí khi đúng.</span></div>
  <div class="lz-node"><span class="lz-k">Việc 4</span><span class="lz-t">Gắn source map</span><span class="lz-d">Map được tải lên theo từng bản phát hành. Không có bản phát hành thì một stack không đọc được sẽ không giải mã được, vì chẳng có gì biết bản dựng nào đã sinh ra nó.</span></div>
</div>

<h3>Source map: chỉ frontend cần, và nó cần ghê gớm</h3>
<pre><code>Backend chạy TypeScript đã biên dịch với map nội tuyến và stack
đọc được. FRONTEND thì đã bị rút gọn:

  Không có map:
    TypeError: Cannot read property 'map' of undefined
      at t (main-4f3a2b1c.js:1:48291)
      at n (main-4f3a2b1c.js:1:12043)

  Có map:
    TypeError: Cannot read property 'map' of undefined
      at NoteList (src/components/notes/NoteList.tsx:42:18)
      at renderWithHooks (react-dom.js:14985:18)

Cái đầu tiên không hành động được. Nó không phải "khó gỡ" —
trong nó không có một chút thông tin nào cả.</code></pre>
<pre><code class="language-bash"># Tải map lên lúc DỰNG, rồi xoá chúng trước khi đem đi.
npx @sentry/cli sourcemaps inject ./frontend/.next
npx @sentry/cli sourcemaps upload ./frontend/.next \\
  --release "$GIT_SHA"

# ⚠️ Rồi gỡ chúng khỏi ảnh. Một file .map công khai cho phép bất
# cứ ai dựng lại toàn bộ mã nguồn frontend của bạn.
find ./frontend/.next -name '*.map' -delete</code></pre>

<h3>Bốn dòng nối mọi thứ lại</h3>
<pre><code class="language-typescript">// src/middleware/errorHandler.ts — lời gọi log hiện tại
logger.error('Express error handler', {
  error: err.message, stack: err.stack, name: err.name,
  code: err.code, path: req.path, method: req.method,
});

// ...với ngữ cảnh của chương 3, và id sự kiện của Sentry trả về
const ctx = currentContext();
Sentry.withScope((scope) =&gt; {
  scope.setTag('request_id', ctx?.requestId ?? 'unknown');   // 1
  scope.setTag('trace_id',   ctx?.traceId   ?? 'unknown');   // 2
  const eventId = Sentry.captureException(err);
  logger.error('Express error handler', {
    error: err.message, stack: err.stack, name: err.name,
    code: err.code, path: req.path, method: req.method,
    requestId: ctx?.requestId,                                // 3
    sentryEventId: eventId,                                   // 4
  });
});</code></pre>
<pre><code>Bốn dòng đó mua được gì, theo cả hai chiều:

  Từ một vấn đề Sentry → tới log
    Cái tag request_id tìm kiếm được. Chép nó, dán vào Loki, có
    mọi dòng của request đó — kể cả những dòng TRƯỚC cái lỗi,
    tức là những dòng giải thích nó.

  Từ một dòng log → tới vấn đề Sentry
    sentryEventId trong log dẫn thẳng tới sự kiện với stack,
    breadcrumb và số người dùng bị ảnh hưởng của nó.

  Từ một vấn đề Sentry → tới trace
    trace_id mở ra biểu đồ thác. Các hình dạng ở chương 6, trên
    đúng cái request đã hỏng.

  Từ ảnh chụp màn hình của người dùng → tới cả ba
    X-Request-ID (bài 3.1) chính là cái tag request_id.

Đó là toàn bộ hệ thống, đã khép kín. Bốn trụ cột, một cái khoá.</code></pre>

<h3>Trả cái khoá đó về cho người dùng</h3>
<pre><code class="language-typescript">// Phản hồi lỗi vốn đã trả về một code. Hãy thêm request id vào.
res.status(statusCode).json({
  success: false,
  message,                       // chung chung với 5xx — bài 7.1
  code: err.code,
  requestId: ctx?.requestId,     // ← phơi ra được, và hữu ích
});</code></pre>
<pre><code>Vì sao chuyện này đáng làm:

  · Một người dùng báo lỗi trích dẫn được nó. "Lỗi, mã
    V1StGXR8_Z5j" biến một cuộc trò chuyện hỗ trợ thành một
    phép tra chính xác.
  · Nó KHÔNG nhạy cảm: một id ngẫu nhiên 12 ký tự chẳng tiết lộ
    gì về hệ thống của bạn.
  · Nó vốn đã nằm trong header phản hồi X-Request-ID — đưa nó
    vào phần thân chỉ là làm nó nhìn thấy được với một CON
    NGƯỜI đang đọc hộp thoại lỗi, thay vì với một lập trình
    viên đang mở devtools.

Frontend: hiển thị nó nhỏ và xám, dưới thông điệp lỗi. Nó chẳng
tốn gì và nó biến những phiếu hỗ trợ tệ nhất của bạn thành những
phiếu nhanh nhất.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một chuỗi bản phát hành không duy nhất cho mỗi bản dựng làm mọi trường ở trên nói dối, một cách lặng lẽ.</strong> Dùng phiên bản trong <code>package.json</code>, hay một tên nhánh, hay <code>latest</code>, nghĩa là nhiều bản dựng khác nhau dùng chung một định danh phát hành — nên &quot;thấy lần đầu ở v1.4.0&quot; phủ trọn hai tuần deploy, việc phát hiện tái phát không nổ được vì phiên bản chưa bao giờ đổi, và source map tải lên cho một bản dựng sau sẽ ghi đè lên bản trước nên các stack trace cũ giải mã ra <em>SAI DÒNG</em>. Cái cuối cùng là tệ nhất, vì nó không hỏng: nó sinh ra một tên file và một số dòng trông hoàn toàn hợp lý mà trỏ vào một chỗ chẳng liên quan, và bạn sẽ đọc đoạn mã đó rất kỹ trước khi nghi ngờ nó. <strong>Hãy dùng git SHA. Nó duy nhất theo đúng thiết kế, nó ánh xạ tới một cái diff, và <code>git rev-parse --short HEAD</code> vốn đã có sẵn lúc dựng trong <code>deploy-nha.sh</code>.</strong></p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.sentry.io/product/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Sentry — bản phát hành</span><span class="lc-sub">Phát hiện tái phát, commit tình nghi, và các chỉ số sức khoẻ bản phát hành có được miễn phí một khi chuỗi phiên bản là duy nhất.</span></span>
</a>
<a class="link-card dl" href="https://docs.sentry.io/platforms/javascript/sourcemaps/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Sentry — source map</span><span class="lc-sub">Luồng inject-rồi-upload dùng ở trên, debug id, và cách kiểm xem một cái map có thật sự giải mã được hay là đã âm thầm hỏng.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '7.5 — Running it without a vendor, and the CI test that is deliberately off|||7.5 — Chạy nó không cần nhà cung cấp, và bài kiểm CI cố ý tắt',
      slug: 'obs-7-5-khong-can-nha-cung-cap',
      type: 'VIDEO',
      description: 'GlitchTip là Sentry tự dựng. Và một ca thật trong kho này: một bài kiểm CI bị tắt CÓ CHỦ Ý, và vì sao đó là quyết định đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Running it without a vendor, and the CI test that is deliberately off</h2>
<p class="lead">Two things close this chapter. First: error tracking does not require a subscription — the protocol is open and there is a self-hostable server that speaks it. Second, and more useful: a worked example from this repository of an observability check that was <em>switched off on purpose</em>, and why that was the right call.</p>

<h3>The DSN is just a URL</h3>
<pre><code>SENTRY_DSN=https://&lt;key&gt;@o123456.ingest.sentry.io/7891011
                     ▲                              ▲
                     public key            project id

The SDK POSTs an "envelope" to that host. Point it somewhere
else and the SDK neither knows nor cares:

SENTRY_DSN=https://&lt;key&gt;@glitchtip.cuongthai.com/1

GlitchTip implements the same ingest API and the same issue
model — grouping, releases, first-seen, resolve, regressions.
It is a Django app plus Postgres plus Redis.</code></pre>
<pre><code class="language-yaml"># docker-compose.yml — the honest resource cost
glitchtip:
  image: glitchtip/glitchtip
  environment:
    DATABASE_URL: postgres://...        # ⚠️ its OWN database
    SECRET_KEY: \${GLITCHTIP_SECRET}
    GLITCHTIP_MAX_EVENT_LIFE_DAYS: 30
  deploy:
    resources:
      limits: { memory: 512M }

glitchtip-worker:
  image: glitchtip/glitchtip
  command: ./bin/run-celery-with-beat.sh
  deploy:
    resources:
      limits: { memory: 512M }</code></pre>

<h3>The decision, for this VPS specifically</h3>
<pre><code>Self-hosting costs, measured against what this VPS has:

  · ~1 GB RAM across two containers, on a box that already
    runs Postgres (2G), Redis, backend, frontend, TTS,
    coturn and nginx
  · A second Postgres database to back up and migrate
  · Event storage on the SAME DISK that had the disk-full
    outage — the one vps-cleanup-weekly.yml exists to prevent

  And the failure mode is specific and bad: your error
  tracker dies during the incident that would have filled
  its disk. It is exactly when you need it that it is most
  likely to be down.

Self-host when:
  ✅ Data residency is a requirement you cannot negotiate
  ✅ Event volume makes a hosted plan genuinely expensive
  ✅ It runs on DIFFERENT hardware from the thing it watches

Use hosted when:
  ✅ You have one small VPS
  ✅ The free tier covers you — Sentry's is 5k events/month,
     and with lesson 7.1's "5xx only" rule this repo would
     use a fraction of that
  ✅ You would rather spend the RAM on Postgres

For this repository: hosted, free tier. The rule about not
running your monitoring on the machine it monitors is not
a preference.</code></pre>

<h3>The worked example: a test that is off on purpose</h3>
<p>This repository has a CI job called <code>CV critique fabrication test</code>. It feeds a CV with no metrics to the AI and fails if a <code>suggestedFix</code> asserts a number without setting <code>needsUserInput</code> — a check against the model inventing statistics about a real person's career. It is currently dormant, and the project documentation is explicit that it must not be &quot;fixed&quot;.</p>
<pre><code>The chain of reasoning, which is worth reading as a whole:

  1. The check needs an AI key. The repo secret was REMOVED.
  2. It was removed because the account ran out of credit.
  3. So re-adding a key trades HTTP 403 for an out-of-credit
     error. CI is red either way.
  4. With the secret absent, the step SKIPs and exits 0.
     CI is green.
  5. Therefore: leave it removed until someone tops up the
     account. Re-adding the key makes things worse.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The disabling was a decision, not a drift</span><span class="lz-d">Somebody reasoned about it and wrote the reasoning down, including the counterfactual: what re-enabling would actually produce.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The cost is stated plainly</span><span class="lz-d">&quot;Nothing watches for the AI inventing metrics in CV critiques any more.&quot; Not minimised, not hidden in a comment — written where the next person will read it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The manual fallback is documented</span><span class="lz-d"><code>npm run eval:cv-fabrication</code>, with an explicit note that it prints SKIPPED today because there is no local key either.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Re-arming is a recipe, not a research task</span><span class="lz-d">The exact secret name, which key to put in it, and the code path that reads it — <code>keyForProvider()</code> → <code>gatewayKey()</code> → three env var names. No code change needed.</span></div>
</div>

<h3>Why this belongs in an observability course</h3>
<pre><code>A disabled check is a form of blindness. There are two kinds,
and they look identical from outside:

  DOCUMENTED    "This is off. Here is why, here is what it
                cost us, here is how to turn it back on."
                → a decision, revisitable

  UNDOCUMENTED  the alert that has been muted for eight
                months, the dashboard nobody opens, the
                Sentry project with 40,000 unread issues
                → indistinguishable from working, until an
                  incident proves otherwise

Every observability system decays toward the second kind by
default, because muting is easy and un-muting requires
someone to notice. The only defence is the habit above:
when you turn something off, write down what you gave up.

The GREEN CI in this repo is honest green — it means "the
checks that are running, passed", and the checks that are
not running are named. That is a much stronger property
than a green tick usually carries.</code></pre>

<h3>The pattern, generalised</h3>
<pre><code class="language-markdown">&lt;!-- Whenever you disable a check, alert, or dashboard --&gt;

## &lt;name&gt; is deliberately off (date)

WHY:      the actual cause, not "it was noisy"
COST:     what is no longer being watched, stated plainly
FALLBACK: how to run it by hand, and whether that works today
RE-ARM:   the exact steps, and the condition that should
          trigger someone to take them

&lt;!-- If you cannot fill in COST, you do not understand what
     the check was for, and you should not be disabling it. --&gt;</code></pre>

<div class="pitfall">
<p><strong>Trap — the most dangerous state for an error tracker is &quot;configured, running, and unread&quot;.</strong> A project with no DSN is a known gap: everyone understands that errors are not being tracked. A project with 40,000 unresolved issues, an inbox nobody has opened since March, and alerts routed to a Slack channel that was archived — that is worse, because it produces a <em>false belief</em>. People stop adding logging because &quot;Sentry will catch it&quot;, incident reviews record &quot;we should have seen this in Sentry&quot; without asking whether anyone would have, and the tool's existence actively displaces the habits that would have covered for it. <strong>An error tracker with a triage habit is worth more than one with better configuration.</strong> If nobody has resolved an issue in a month, the honest move is to declare it dormant in writing — using the template above — rather than leaving it running as decoration.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://glitchtip.com/documentation/install" target="_blank" rel="noopener">
  <span class="lc-ico">🐛</span>
  <span class="lc-body"><span class="lc-title">GlitchTip — self-hosted installation</span><span class="lc-sub">The compose file, the environment variables including event retention, and the real resource requirements behind this lesson's numbers.</span></span>
</a>
<a class="link-card dl" href="https://develop.sentry.dev/sdk/data-model/envelopes/" target="_blank" rel="noopener">
  <span class="lc-ico">✉️</span>
  <span class="lc-body"><span class="lc-title">The Sentry envelope protocol</span><span class="lc-sub">The open wire format that makes a DSN just a URL, and lets any compatible server receive events from the official SDKs.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Chạy nó không cần nhà cung cấp, và bài kiểm CI cố ý tắt</h2>
<p class="lead">Hai điều khép lại chương này. Thứ nhất: theo dõi lỗi không đòi hỏi một gói thuê bao — giao thức là mở và có một máy chủ tự dựng được nói cùng thứ tiếng đó. Thứ hai, và hữu ích hơn: một ví dụ làm sẵn từ chính kho này về một phép kiểm quan sát bị <em>TẮT CÓ CHỦ Ý</em>, và vì sao đó là quyết định đúng.</p>

<h3>DSN chỉ là một cái URL</h3>
<pre><code>SENTRY_DSN=https://&lt;key&gt;@o123456.ingest.sentry.io/7891011
                     ▲                              ▲
                     khoá công khai          id dự án

SDK gửi POST một "phong bì" tới cái host đó. Trỏ nó sang chỗ
khác thì SDK không biết mà cũng chẳng quan tâm:

SENTRY_DSN=https://&lt;key&gt;@glitchtip.cuongthai.com/1

GlitchTip cài đặt đúng cái API nạp vào đó và đúng cái mô hình
vấn đề đó — gom nhóm, bản phát hành, thấy-lần-đầu, giải quyết,
tái phát. Nó là một ứng dụng Django cộng Postgres cộng Redis.</code></pre>
<pre><code class="language-yaml"># docker-compose.yml — cái giá tài nguyên nói cho thật
glitchtip:
  image: glitchtip/glitchtip
  environment:
    DATABASE_URL: postgres://...        # ⚠️ cơ sở dữ liệu RIÊNG của nó
    SECRET_KEY: \${GLITCHTIP_SECRET}
    GLITCHTIP_MAX_EVENT_LIFE_DAYS: 30
  deploy:
    resources:
      limits: { memory: 512M }

glitchtip-worker:
  image: glitchtip/glitchtip
  command: ./bin/run-celery-with-beat.sh
  deploy:
    resources:
      limits: { memory: 512M }</code></pre>

<h3>Quyết định, riêng cho cái VPS này</h3>
<pre><code>Chi phí tự dựng, đo bên cạnh thứ cái VPS này đang có:

  · ~1 GB RAM cho hai container, trên một cái máy vốn đã chạy
    Postgres (2G), Redis, backend, frontend, TTS, coturn và nginx
  · Một cơ sở dữ liệu Postgres thứ hai phải sao lưu và di trú
  · Lưu sự kiện trên ĐÚNG CÁI ĐĨA từng có sự cố đầy đĩa — cái
    đĩa mà vps-cleanup-weekly.yml tồn tại để bảo vệ

  Và kiểu hỏng thì rất cụ thể và rất tệ: trình theo dõi lỗi của
  bạn chết trong đúng cái sự cố lẽ ra đã làm đầy đĩa của nó. Đúng
  lúc bạn cần nó nhất là lúc nó dễ chết nhất.

Hãy tự dựng khi:
  ✅ Nơi lưu dữ liệu là một yêu cầu không thương lượng được
  ✅ Lượng sự kiện làm cho một gói dịch vụ thật sự đắt
  ✅ Nó chạy trên PHẦN CỨNG KHÁC với cái nó đang canh chừng

Hãy dùng dịch vụ khi:
  ✅ Bạn có một cái VPS nhỏ
  ✅ Gói miễn phí đủ dùng — của Sentry là 5k sự kiện/tháng, và
     với luật "chỉ 5xx" ở bài 7.1 thì kho này chỉ dùng một phần
     nhỏ của con số đó
  ✅ Bạn thà dành chỗ RAM ấy cho Postgres

Với kho này: dùng dịch vụ, gói miễn phí. Cái luật đừng-chạy-hệ-
thống-theo-dõi-trên-chính-cái-máy-nó-theo-dõi không phải một sở
thích.</code></pre>

<h3>Ví dụ làm sẵn: một bài kiểm tắt CÓ CHỦ Ý</h3>
<p>Kho này có một việc CI tên <code>CV critique fabrication test</code>. Nó đưa vào một bản CV không có con số nào rồi bắt lỗi nếu một <code>suggestedFix</code> khẳng định một con số mà không đặt <code>needsUserInput</code> — một phép kiểm chống lại việc mô hình bịa ra thống kê về sự nghiệp của một con người có thật. Hiện nó đang ngủ, và tài liệu dự án nói thẳng rằng không được &quot;sửa&quot; nó.</p>
<pre><code>Chuỗi lập luận, đáng đọc trọn vẹn:

  1. Phép kiểm cần một khoá AI. Bí mật của kho đã bị GỠ BỎ.
  2. Nó bị gỡ vì tài khoản đã hết tín dụng.
  3. Nên thêm lại một cái khoá chỉ là đổi HTTP 403 lấy một lỗi
     hết-tín-dụng. CI đỏ theo cả hai đường.
  4. Với bí mật vắng mặt, bước đó BỎ QUA và thoát với mã 0.
     CI xanh.
  5. Do đó: cứ để nó bị gỡ cho tới khi có người nạp tiền vào tài
     khoản. Thêm lại cái khoá chỉ làm mọi thứ tệ hơn.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Việc tắt đi là một QUYẾT ĐỊNH, không phải một sự trôi dạt</span><span class="lz-d">Có người đã lập luận về nó và viết cái lập luận ấy xuống, kể cả trường hợp giả định: bật lại thì thật ra sẽ tạo ra cái gì.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cái giá được nêu thẳng</span><span class="lz-d">&quot;Không còn gì canh chừng việc AI bịa số liệu trong phần nhận xét CV nữa.&quot; Không giảm nhẹ, không giấu trong một dòng chú thích — viết ở chỗ người kế tiếp sẽ đọc.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đường lùi thủ công được ghi lại</span><span class="lz-d"><code>npm run eval:cv-fabrication</code>, kèm một ghi chú tường minh rằng hôm nay nó in ra SKIPPED vì ở máy cũng không có khoá.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bật lại là một CÔNG THỨC, không phải một đề tài nghiên cứu</span><span class="lz-d">Tên bí mật chính xác, khoá nào nên bỏ vào đó, và cái nhánh mã đọc nó — <code>keyForProvider()</code> → <code>gatewayKey()</code> → ba cái tên biến môi trường. Không cần sửa mã.</span></div>
</div>

<h3>Vì sao chuyện này thuộc về một khoá học quan sát</h3>
<pre><code>Một phép kiểm bị tắt là một dạng mù. Có hai kiểu, và nhìn từ
bên ngoài chúng giống hệt nhau:

  CÓ GHI LẠI     "Cái này tắt. Đây là lý do, đây là cái nó lấy
                 mất của chúng ta, đây là cách bật lại."
                 → một quyết định, xem lại được

  KHÔNG GHI LẠI  cái cảnh báo bị tắt tiếng tám tháng nay, cái
                 bảng theo dõi không ai mở, cái dự án Sentry
                 với 40.000 vấn đề chưa đọc
                 → không phân biệt được với "đang chạy tốt", cho
                   tới khi một sự cố chứng minh ngược lại

Mọi hệ thống quan sát đều mặc định suy tàn về phía kiểu thứ hai,
vì tắt tiếng thì dễ còn bật lại thì cần có người để ý. Lớp phòng
thủ duy nhất là cái thói quen ở trên: khi bạn tắt một thứ gì, hãy
viết xuống thứ bạn đã từ bỏ.

Cái CI XANH trong kho này là màu xanh TRUNG THỰC — nó nghĩa là
"những phép kiểm đang chạy thì đã qua", và những phép kiểm không
chạy thì được gọi tên. Đó là một tính chất mạnh hơn nhiều so với
những gì một dấu tích xanh thường mang.</code></pre>

<h3>Cái mẫu, tổng quát hoá</h3>
<pre><code class="language-markdown">&lt;!-- Mỗi khi bạn tắt một phép kiểm, một cảnh báo, hay một bảng --&gt;

## &lt;tên&gt; bị tắt có chủ ý (ngày)

VÌ SAO:    nguyên nhân thật, không phải "nó ồn quá"
CÁI GIÁ:   cái gì không còn được canh chừng nữa, nêu thẳng
ĐƯỜNG LÙI: chạy tay thế nào, và hôm nay cách đó có chạy được không
BẬT LẠI:   các bước chính xác, và điều kiện gì nên khiến ai đó
           đi thực hiện chúng

&lt;!-- Nếu bạn không điền được ô CÁI GIÁ thì bạn chưa hiểu phép
     kiểm ấy để làm gì, và bạn không nên tắt nó. --&gt;</code></pre>

<div class="pitfall">
<p><strong>Bẫy — trạng thái nguy hiểm nhất của một trình theo dõi lỗi là &quot;đã cấu hình, đang chạy, và không ai đọc&quot;.</strong> Một dự án không có DSN là một khoảng trống ĐÃ BIẾT: ai cũng hiểu rằng lỗi đang không được theo dõi. Một dự án với 40.000 vấn đề chưa giải quyết, một hộp thư chưa ai mở từ tháng Ba, và các cảnh báo định tuyến tới một kênh Slack đã lưu trữ — cái đó tệ hơn, vì nó tạo ra một <em>NIỀM TIN SAI</em>. Người ta thôi thêm log vì &quot;Sentry sẽ bắt được thôi&quot;, các cuộc rà soát sự cố ghi lại &quot;lẽ ra ta phải thấy cái này trong Sentry&quot; mà không hỏi xem có ai thật sự sẽ thấy không, và chính sự tồn tại của cái công cụ ấy chủ động đẩy lùi những thói quen lẽ ra đã bù đắp được cho nó. <strong>Một trình theo dõi lỗi có thói quen phân loại thì giá trị hơn một cái có cấu hình tốt hơn.</strong> Nếu một tháng nay chưa ai giải quyết một vấn đề nào, nước đi trung thực là tuyên bố nó đang ngủ, bằng văn bản — theo đúng cái mẫu ở trên — thay vì để nó chạy như một món trang trí.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://glitchtip.com/documentation/install" target="_blank" rel="noopener">
  <span class="lc-ico">🐛</span>
  <span class="lc-body"><span class="lc-title">GlitchTip — cài đặt tự dựng</span><span class="lc-sub">File compose, các biến môi trường kể cả thời hạn lưu sự kiện, và yêu cầu tài nguyên thật đằng sau những con số của bài này.</span></span>
</a>
<a class="link-card dl" href="https://develop.sentry.dev/sdk/data-model/envelopes/" target="_blank" rel="noopener">
  <span class="lc-ico">✉️</span>
  <span class="lc-body"><span class="lc-title">Giao thức phong bì của Sentry</span><span class="lc-sub">Định dạng đường truyền mở làm cho một DSN chỉ là một cái URL, và cho phép mọi máy chủ tương thích nhận sự kiện từ các SDK chính thức.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra chương 7',
      slug: 'obs-7-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về gom nhóm, 4xx so với 5xx, PII, bản phát hành và việc tắt một phép kiểm cho đúng cách.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 7 · Quiz</span><h2>Six questions on error tracking</h2><p class="lead">Four of these are about a system that keeps working while producing nothing useful — the characteristic failure of this pillar.</p></div><div class="ml-vi"><span class="eyebrow">Chương 7 · Kiểm tra</span><h2>Sáu câu về theo dõi lỗi</h2><p class="lead">Bốn câu trong đây nói về một hệ thống vẫn chạy trong khi chẳng sinh ra thứ gì hữu ích — kiểu hỏng đặc trưng của trụ cột này.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What does an error tracker do that logs, metrics and traces cannot?|||Một trình theo dõi lỗi làm được gì mà log, chỉ số và trace không làm được?',
            options: [
              'Grouping: it collapses ten thousand occurrences into one row with a first-seen date, a distinct-user count, and an owner — turning a stream of events into a work item with state (resolved, ignored, assigned) that also detects regressions.|||Gom nhóm: nó gộp mười nghìn lần xảy ra thành một dòng có ngày thấy-lần-đầu, số người dùng bị ảnh hưởng, và một người chịu trách nhiệm — biến một dòng sự kiện thành một đầu việc có trạng thái (đã giải quyết, bỏ qua, đã giao) mà còn phát hiện được tái phát.',
              'It stores stack traces, which logs cannot hold|||Nó lưu stack trace, thứ log không chứa được',
              'It is the only pillar that can alert|||Nó là trụ cột duy nhất cảnh báo được',
              'It measures error rate more accurately than metrics|||Nó đo tỉ lệ lỗi chính xác hơn chỉ số',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo reports only 5xx to Sentry. What would reporting 4xx cost?|||Kho này chỉ báo 5xx cho Sentry. Báo cả 4xx thì tốn gì?',
            options: [
              'A dashboard with thousands of daily "errors", none actionable — validation failures, expired tokens, deleted notes are the system working. That trains everyone to ignore it, at which point the tool is worse than absent, because there is now a place people believe is being watched.|||Một cái bảng có hàng nghìn "lỗi" mỗi ngày, không cái nào hành động được — dữ liệu không hợp lệ, token hết hạn, ghi chú đã xoá đều là hệ thống đang CHẠY ĐÚNG. Điều đó huấn luyện mọi người lờ nó đi, và tới lúc ấy cái công cụ còn tệ hơn là không có, vì giờ có một chỗ mà người ta TIN là đang được canh chừng.',
              'Only extra quota cost; the signal quality is unchanged|||Chỉ tốn thêm hạn mức; chất lượng tín hiệu không đổi',
              'Nothing — 4xx are errors and belong in an error tracker|||Không gì cả — 4xx là lỗi và thuộc về một trình theo dõi lỗi',
              'Slower ingestion, which delays 5xx alerts|||Nạp vào chậm hơn, làm trễ cảnh báo 5xx',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does &#96;throw new Error(&#96;Note \${id} not found for user \${uid}&#96;)&#96; break error tracking?|||Vì sao &#96;throw new Error(&#96;Note \${id} not found for user \${uid}&#96;)&#96; làm hỏng việc theo dõi lỗi?',
            options: [
              'Every distinct pair of ids produces a distinct message, hence a distinct fingerprint, hence a separate issue with exactly one event — so no issue ever crosses an alert threshold, "resolve" cannot work, and a bug affecting 4,120 users generates no alert at all. Use a stable message with the ids as structured context.|||Mỗi cặp id khác nhau sinh ra một thông điệp khác nhau, do đó một vân tay khác nhau, do đó một vấn đề riêng chỉ có đúng một sự kiện — nên không vấn đề nào từng vượt được ngưỡng cảnh báo, "đã giải quyết" không hoạt động được, và một lỗi ảnh hưởng 4.120 người dùng chẳng sinh ra cảnh báo nào. Hãy dùng một thông điệp ổn định với các id làm ngữ cảnh có cấu trúc.',
              'Template literals are not supported in Error messages|||Template literal không được hỗ trợ trong thông điệp Error',
              'It over-merges: all not-found errors become one issue|||Nó gộp quá to: mọi lỗi không-tìm-thấy thành một vấn đề',
              'It is fine — the fingerprint uses the stack, not the message|||Không sao cả — vân tay dùng stack chứ không dùng thông điệp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo sets sendDefaultPii:false and strips cookies and auth headers. What still leaks?|||Kho này đặt sendDefaultPii:false và cắt cookie với header xác thực. Cái gì vẫn rò?',
            options: [
              'Three things: the exception message itself (no redaction touches it, and it is what people interpolate into), the URL path when it carries an email or phone, and any custom context a caller passes to captureException. Breadcrumbs are a fourth — they are a separate array the beforeSend hooks do not cover, and console breadcrumbs capture console.log output verbatim.|||Ba thứ: chính cái thông điệp ngoại lệ (không phép che nào đụng tới, mà nó lại là chỗ người ta hay nội suy vào), phần đường dẫn URL khi nó mang email hay số điện thoại, và bất cứ ngữ cảnh tự đặt nào người gọi truyền vào captureException. Breadcrumb là thứ tư — chúng là một mảng riêng mà các móc beforeSend không phủ tới, và breadcrumb của console chộp đầu ra console.log nguyên văn.',
              'Nothing — sendDefaultPii:false covers every field|||Không gì cả — sendDefaultPii:false phủ mọi trường',
              'Only the client IP, which Sentry adds server-side|||Chỉ có IP client, thứ Sentry thêm vào ở phía máy chủ',
              'The stack trace, which always contains local variables|||Stack trace, thứ luôn chứa biến cục bộ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must the release string be the git SHA rather than package.json\'s version?|||Vì sao chuỗi bản phát hành phải là git SHA chứ không phải phiên bản trong package.json?',
            options: [
              'Because it must be unique per build. A shared version means "first seen in v1.4.0" covers a fortnight of deploys, regression detection cannot fire since the version never changed, and — worst — source maps from a later build overwrite the earlier ones, so old stack traces resolve to plausible-looking but wrong lines.|||Vì nó phải DUY NHẤT cho mỗi bản dựng. Một phiên bản dùng chung nghĩa là "thấy lần đầu ở v1.4.0" phủ trọn hai tuần deploy, việc phát hiện tái phát không nổ được vì phiên bản chưa bao giờ đổi, và — tệ nhất — source map của một bản dựng sau ghi đè lên bản trước, nên các stack trace cũ giải mã ra những dòng trông hợp lý mà SAI.',
              'Because Sentry rejects non-hexadecimal release names|||Vì Sentry từ chối tên bản phát hành không phải hệ mười sáu',
              'Because semantic versions cannot be sorted chronologically|||Vì phiên bản ngữ nghĩa không sắp xếp theo thời gian được',
              'It does not matter, as long as it changes sometimes|||Không quan trọng, miễn là thỉnh thoảng nó có đổi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo\'s CV fabrication CI test is deliberately dormant. What makes that acceptable?|||Bài kiểm CI về việc bịa số liệu CV của kho này đang ngủ có chủ ý. Điều gì làm cho việc đó chấp nhận được?',
            options: [
              'It is documented as a decision: the reason (the AI account is out of credit, so a key would trade 403 for an out-of-credit error and leave CI red either way), the cost stated plainly (nothing watches for invented metrics any more), the manual fallback, and the exact re-arming steps. A disabled check that is written down is revisitable; an undisclosed one is indistinguishable from working.|||Nó được ghi lại như một QUYẾT ĐỊNH: lý do (tài khoản AI hết tín dụng, nên một cái khoá chỉ đổi 403 lấy lỗi hết-tín-dụng và CI đỏ theo cả hai đường), cái giá nêu thẳng (không còn gì canh chừng việc bịa số liệu nữa), đường lùi thủ công, và các bước bật lại chính xác. Một phép kiểm bị tắt mà có ghi lại thì xem lại được; một cái không nói ra thì không phân biệt được với "đang chạy tốt".',
              'CI is green, which is the only thing that matters|||CI xanh, và đó là điều duy nhất quan trọng',
              'The test was never useful, so nothing was lost|||Bài kiểm đó vốn chưa từng hữu ích, nên chẳng mất gì',
              'AI outputs cannot be tested reliably in CI|||Đầu ra của AI không kiểm thử tin cậy được trong CI',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
