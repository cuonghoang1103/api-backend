/**
 * Redis — Chương 7: Tính nguyên tử — MULTI, WATCH, Lua và Function.
 * MULTI/EXEC · WATCH và CAS · script Lua · Redis Functions · khoá phân tán · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 7 — Atomicity: MULTI, WATCH, Lua and Functions|||Chương 7 — Tính nguyên tử: MULTI, WATCH, Lua và Function',
  description: 'Mỗi lệnh Redis đã nguyên tử sẵn. Chương này nói về chuyện khó hơn: làm cho MỘT NHÓM lệnh trở nên nguyên tử, khi bạn cần đọc một giá trị rồi quyết định dựa trên nó. Bốn công cụ, mỗi cái mạnh hơn và đắt hơn cái trước, cộng bài toán khoá phân tán mà ai cũng làm sai.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — MULTI/EXEC: a queue, not a transaction|||7.1 — MULTI/EXEC: một hàng đợi, không phải một giao dịch',
      slug: 'rd-7-1-multi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Redis xếp hàng lệnh rồi chạy cả khối không xen kẽ, nhưng KHÔNG có quay lui, KHÔNG đọc được kết quả giữa chừng, và có hai loại lỗi cư xử khác hẳn nhau. Cộng DISCARD, cộng vì sao pipeline không phải giao dịch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>MULTI/EXEC: a queue, not a transaction</h2>
<p class="lead">Redis calls it a transaction and the word brings expectations from SQL that are mostly wrong. What <code>MULTI</code> actually gives you is one guarantee — no other client's command runs in the middle of your block — and it explicitly does <em>not</em> give you rollback. Knowing exactly where the line is drawn is the whole lesson.</p>

<h3>What it does</h3>
<pre><code>redis-cli -x eval "return 1" 0 &gt;/dev/null 2&gt;&amp;1
redis-cli MULTI
redis-cli EXEC
<span class="tok-comment"># …but redis-cli runs each line on a fresh connection, so use one session:</span>
redis-cli &lt;&lt;'EOF'
MULTI
SET account:a 100
SET account:b 50
INCRBY account:a -30
INCRBY account:b 30
EXEC
GET account:a
GET account:b
EOF</code></pre>
<div class="out">OK
(error) ERR EXEC without MULTI
OK
QUEUED
QUEUED
QUEUED
QUEUED
1) OK
2) OK
3) (integer) 70
4) (integer) 80
"70"
"80"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · MULTI opens the block</span><span class="lz-t">the connection enters queuing mode</span><span class="lz-d">From here every command you send is answered with <code>QUEUED</code> instead of being executed. Redis is buffering them on your connection — nothing has touched the data yet.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Commands queue, they do not run</span><span class="lz-t">QUEUED, QUEUED, QUEUED</span><span class="lz-d">This is the detail that surprises people: you cannot read a value inside the block and branch on it, because there is no value yet. Everything you might want to know has to be known <em>before</em> <code>MULTI</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3 · EXEC runs the whole queue</span><span class="lz-t">as one uninterrupted unit</span><span class="lz-d">Redis is single-threaded (Lesson 1.1), so once <code>EXEC</code> starts, the entire queue executes with nothing interleaved. That isolation is real and it is what you came for.</span></div>
  <div class="lz-step"><span class="lz-k">4 · You get an array of replies</span><span class="lz-t">one element per queued command, in order</span><span class="lz-d">All the answers arrive together, after the fact. If command 3 told you something you needed for command 4, it is too late — that is what Lua is for (Lesson 7.3).</span></div>
</div>

<h3>What it does not do: rollback</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SET counter "not-a-number"
MULTI
INCR counter
SET marker "written"
EXEC
GET counter
GET marker
EOF</code></pre>
<div class="out">OK
OK
QUEUED
QUEUED
1) (error) ERR value is not an integer or out of range
2) OK
"not-a-number"
"written"</div>
<div class="callout warn"><strong>Command 1 failed, command 2 ran anyway, and nothing was undone.</strong> There is no rollback in Redis — none, not partial, not optional. <code>EXEC</code> executes every queued command and reports each result independently; a failure in the middle is simply an error at that index in the array. If your logic requires "either all of these happen or none of them do", <code>MULTI</code> does not give it to you and no configuration flag will. The official position is that these errors are programming bugs — you queued <code>INCR</code> against a string — and should be caught in testing, not handled at runtime. It is a defensible position and it is still the thing people are most surprised by.</div>

<h3>Two kinds of error, two completely different outcomes</h3>
<pre><code><span class="tok-comment"># A · Syntax error at QUEUE time → the whole block is aborted</span>
redis-cli &lt;&lt;'EOF'
MULTI
SET ok 1
NOSUCHCOMMAND foo
EXEC
GET ok
EOF</code></pre>
<div class="out">OK
QUEUED
(error) ERR unknown command 'NOSUCHCOMMAND', with args beginning with: 'foo',
(error) EXECABORT Transaction discarded because of previous errors.
(nil)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Queue-time errors abort everything</span><span class="v">An unknown command or wrong arity is detected while queuing. Redis flags the connection, and <code>EXEC</code> refuses with <code>EXECABORT</code> — nothing runs. This is the safe failure.</span></div>
  <div class="kv"><span class="k">Runtime errors do not abort anything</span><span class="v">A type error (<code>INCR</code> on a string, <code>LPUSH</code> on a hash) cannot be detected until execution. That command fails, the rest still run, and you get a partial result. This is the dangerous failure.</span></div>
  <div class="kv"><span class="k">Check every element of the reply</span><span class="v">Many client libraries return the array and only throw on <code>EXECABORT</code>. A runtime error at index 3 becomes an <code>Error</code> object sitting quietly inside the array your code is mapping over.</span></div>
  <div class="kv"><span class="k"><code>DISCARD</code> cancels a queued block</span><span class="v">Sent instead of <code>EXEC</code>, it throws the queue away and returns the connection to normal. Useful when your application logic decides mid-build that it does not want to proceed.</span></div>
  <div class="kv"><span class="k">Since 7.0, arity is checked at queue time too</span><span class="v">Older versions let some malformed commands through to <code>EXEC</code>. Do not rely on version-specific behaviour here — validate before you queue.</span></div>
</div>

<h3>MULTI vs pipelining: related, not the same</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Pipelining is a network optimisation</span><span class="lz-lnote">Send N commands without waiting for each reply, then read N replies (Lesson 1.4). It saves round trips and nothing else. Other clients' commands <em>can</em> interleave with yours between them. Use it whenever you have several independent commands.</span></div>
  <div class="lz-layer"><span class="lz-lname">MULTI is an isolation guarantee</span><span class="lz-lnote">Nothing runs between your commands. It costs a little (the queue, the extra round trips for <code>MULTI</code> and <code>EXEC</code>) and buys exactly that. Use it when interleaving would be a correctness bug.</span></div>
  <div class="lz-layer"><span class="lz-lname">You almost always want both</span><span class="lz-lnote">Every real client library pipelines the whole <code>MULTI … EXEC</code> block automatically, so it costs one round trip in total. When you write <code>redis.multi().set(…).expire(…).exec()</code>, you are getting isolation <em>and</em> the network saving at once.</span></div>
</div>
<pre><code><span class="tok-comment">// Isolation matters here: the key must never exist without its TTL</span>
await redis.multi()
  .hSet(&#96;sess:\${sid}&#96;, { user: String(uid) })
  .expire(&#96;sess:\${sid}&#96;, 1800)
  .exec();

<span class="tok-comment">// Isolation does not matter here — a plain pipeline is enough</span>
const [views, likes, comments] = await Promise.all([
  redis.get(&#96;views:\${id}&#96;),
  redis.get(&#96;likes:\${id}&#96;),
  redis.get(&#96;comments:\${id}&#96;),
]);</code></pre>

<h3>The limit that sends you to Lua</h3>
<pre><code><span class="tok-comment"># Try to write: "decrement stock, but only if it is above zero"</span>
redis-cli &lt;&lt;'EOF'
SET stock 1
MULTI
GET stock          # ← returns QUEUED, not "1". You cannot see the value.
DECR stock         # ← so you cannot decide whether to run this
EXEC
GET stock
EOF</code></pre>
<div class="out">OK
OK
QUEUED
QUEUED
1) "1"
2) (integer) 0
"0"</div>
<div class="pitfall"><strong>Pitfall:</strong> believing <code>MULTI</code> can express a conditional. It cannot, and the reason is structural rather than a missing feature: the commands are queued before any of them run, so there is no point at which your application can see a value and choose what to send next. Reading the value <em>before</em> <code>MULTI</code> does not help either — that read happens outside the block, so another client can change it between your read and your <code>EXEC</code>, which is exactly the race you were trying to avoid. Redis gives you two ways out and they are the next two lessons. <code>WATCH</code> (Lesson 7.2) makes <code>EXEC</code> fail if the value changed since you read it, so you can retry — optimistic concurrency, no lock, and it works well when contention is low. Lua (Lesson 7.3) moves the whole read-decide-write sequence into the server, where it runs as one atomic unit with real branching. When you find yourself wanting <code>if</code> inside <code>MULTI</code>, you have found the boundary of what <code>MULTI</code> is, and the answer is one of those two — never a read-then-<code>MULTI</code> that hopes nobody interfered.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/transactions/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis transactions</span><span class="lc-sub">The official page, including the explicit section on why Redis does not support rollback and what the designers think you should do instead. Read the whole thing once.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/exec/" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">EXEC, DISCARD and the reply shape</span><span class="lc-sub">What <code>EXEC</code> returns in each failure mode, when it replies <code>nil</code>, and how <code>EXECABORT</code> differs from a per-command error inside the array.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: transactions and their limits</span><span class="lc-sub">Graded exercises: predict the output of four <code>MULTI</code> blocks including both error kinds, fix a handler that ignores per-command errors, and identify which of six operations actually need isolation.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>MULTI</code> gives you exactly one guarantee — no other client's command interleaves with your block — and explicitly no rollback: a runtime error at index 3 fails that command and lets the rest run. There are two error kinds with opposite outcomes: a queue-time error (unknown command, bad arity) aborts everything with <code>EXECABORT</code>, while a runtime error (wrong type) leaves you with a partial result you must find by checking every element of the reply array. And commands queue before any of them run, so you cannot read a value inside the block and branch on it — the moment you want <code>if</code>, you need <code>WATCH</code> or Lua.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>MULTI/EXEC: một hàng đợi, không phải một giao dịch</h2>
<p class="lead">Redis gọi nó là giao dịch và cái từ đó mang theo những kỳ vọng từ SQL mà phần lớn là sai. Thứ <code>MULTI</code> thật sự cho bạn là đúng một bảo đảm — không lệnh nào của khách khác chạy xen vào giữa khối của bạn — và nó tường minh <em>không</em> cho bạn phép quay lui. Biết chính xác cái ranh giới được kẻ ở đâu chính là toàn bộ bài này.</p>

<h3>Nó làm được gì</h3>
<pre><code>redis-cli -x eval "return 1" 0 &gt;/dev/null 2&gt;&amp;1
redis-cli MULTI
redis-cli EXEC
<span class="tok-comment"># …nhưng redis-cli chạy mỗi dòng trên một kết nối mới, nên hãy dùng một phiên:</span>
redis-cli &lt;&lt;'EOF'
MULTI
SET account:a 100
SET account:b 50
INCRBY account:a -30
INCRBY account:b 30
EXEC
GET account:a
GET account:b
EOF</code></pre>
<div class="out">OK
(error) ERR EXEC without MULTI
OK
QUEUED
QUEUED
QUEUED
QUEUED
1) OK
2) OK
3) (integer) 70
4) (integer) 80
"70"
"80"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · MULTI mở khối</span><span class="lz-t">kết nối bước vào chế độ xếp hàng</span><span class="lz-d">Từ đây trở đi mọi lệnh bạn gửi lên đều được trả lời bằng <code>QUEUED</code> thay vì được thực thi. Redis đang gom chúng lại trên kết nối của bạn — chưa có gì chạm vào dữ liệu cả.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Lệnh xếp hàng, chúng không chạy</span><span class="lz-t">QUEUED, QUEUED, QUEUED</span><span class="lz-d">Đây là chi tiết làm người ta bất ngờ: bạn không thể đọc một giá trị bên trong khối rồi rẽ nhánh theo nó, vì chưa có giá trị nào cả. Mọi thứ bạn có thể muốn biết đều phải biết <em>trước</em> lệnh <code>MULTI</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3 · EXEC chạy cả hàng đợi</span><span class="lz-t">như một khối liền không đứt quãng</span><span class="lz-d">Redis đơn luồng (Bài 1.1), nên khi <code>EXEC</code> đã bắt đầu thì cả hàng đợi chạy mà không có gì xen vào. Sự cô lập đó là có thật và chính nó là thứ bạn tới đây để lấy.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bạn nhận một mảng câu trả lời</span><span class="lz-t">mỗi lệnh đã xếp hàng một phần tử, đúng thứ tự</span><span class="lz-d">Mọi câu trả lời về cùng lúc, sau khi mọi chuyện đã rồi. Nếu lệnh thứ 3 nói cho bạn một điều bạn cần cho lệnh thứ 4 thì đã quá muộn — đó là việc của Lua (Bài 7.3).</span></div>
</div>

<h3>Nó không làm được gì: quay lui</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SET counter "not-a-number"
MULTI
INCR counter
SET marker "written"
EXEC
GET counter
GET marker
EOF</code></pre>
<div class="out">OK
OK
QUEUED
QUEUED
1) (error) ERR value is not an integer or out of range
2) OK
"not-a-number"
"written"</div>
<div class="callout warn"><strong>Lệnh 1 hỏng, lệnh 2 vẫn chạy, và không có gì được hoàn tác.</strong> Redis không có phép quay lui — không hề, không quay lui một phần, không phải tuỳ chọn. <code>EXEC</code> thực thi mọi lệnh đã xếp hàng và báo cáo từng kết quả một cách độc lập; một lỗi ở giữa chỉ đơn giản là một lỗi ở đúng vị trí đó trong mảng. Nếu logic của bạn đòi "hoặc tất cả xảy ra hoặc không cái nào xảy ra" thì <code>MULTI</code> không cho bạn thứ đó và không cờ cấu hình nào cho được. Lập trường chính thức là những lỗi này là lỗi lập trình — bạn xếp hàng lệnh <code>INCR</code> lên một chuỗi — và đáng lẽ phải bị bắt khi kiểm thử, chứ không phải xử lý lúc chạy. Đó là một lập trường bảo vệ được và nó vẫn là thứ làm người ta bất ngờ nhất.</div>

<h3>Hai loại lỗi, hai kết cục khác nhau hoàn toàn</h3>
<pre><code><span class="tok-comment"># A · Lỗi cú pháp lúc XẾP HÀNG → cả khối bị huỷ</span>
redis-cli &lt;&lt;'EOF'
MULTI
SET ok 1
NOSUCHCOMMAND foo
EXEC
GET ok
EOF</code></pre>
<div class="out">OK
QUEUED
(error) ERR unknown command 'NOSUCHCOMMAND', with args beginning with: 'foo',
(error) EXECABORT Transaction discarded because of previous errors.
(nil)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Lỗi lúc xếp hàng huỷ tất cả</span><span class="v">Một lệnh không tồn tại hay sai số tham số bị phát hiện ngay khi xếp hàng. Redis đánh dấu kết nối, và <code>EXEC</code> từ chối bằng <code>EXECABORT</code> — không gì chạy cả. Đây là kiểu hỏng an toàn.</span></div>
  <div class="kv"><span class="k">Lỗi lúc chạy không huỷ gì cả</span><span class="v">Một lỗi kiểu (<code>INCR</code> lên chuỗi, <code>LPUSH</code> lên hash) không thể phát hiện cho tới lúc thực thi. Lệnh đó hỏng, phần còn lại vẫn chạy, và bạn nhận một kết quả nửa vời. Đây mới là kiểu hỏng nguy hiểm.</span></div>
  <div class="kv"><span class="k">Hãy kiểm mọi phần tử của câu trả lời</span><span class="v">Nhiều thư viện khách trả về cái mảng và chỉ ném lỗi khi gặp <code>EXECABORT</code>. Một lỗi lúc chạy ở vị trí thứ 3 sẽ thành một đối tượng <code>Error</code> nằm im lìm bên trong cái mảng mà mã của bạn đang duyệt qua.</span></div>
  <div class="kv"><span class="k"><code>DISCARD</code> huỷ một khối đã xếp hàng</span><span class="v">Gửi lên thay cho <code>EXEC</code>, nó vứt cả hàng đợi đi và đưa kết nối về bình thường. Có ích khi logic ứng dụng của bạn quyết định giữa chừng là không muốn đi tiếp.</span></div>
  <div class="kv"><span class="k">Từ bản 7.0, số tham số cũng được kiểm lúc xếp hàng</span><span class="v">Các bản cũ hơn để lọt vài lệnh dị dạng tới tận <code>EXEC</code>. Đừng dựa vào hành vi riêng theo phiên bản ở đây — hãy kiểm tra trước khi xếp hàng.</span></div>
</div>

<h3>MULTI với pipeline: liên quan, không giống nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Pipeline là một phép tối ưu mạng</span><span class="lz-lnote">Gửi N lệnh mà không chờ từng câu trả lời, rồi đọc N câu trả lời (Bài 1.4). Nó tiết kiệm vòng đi-về và không gì khác. Lệnh của các khách khác <em>có thể</em> xen vào giữa các lệnh của bạn. Hãy dùng nó bất cứ khi nào bạn có vài lệnh độc lập với nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">MULTI là một bảo đảm về cô lập</span><span class="lz-lnote">Không gì chạy xen giữa các lệnh của bạn. Nó tốn một chút (cái hàng đợi, thêm vòng đi-về cho <code>MULTI</code> và <code>EXEC</code>) và mua về đúng điều đó. Hãy dùng nó khi việc xen kẽ sẽ là một lỗi về tính đúng đắn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bạn gần như luôn muốn cả hai</span><span class="lz-lnote">Mọi thư viện khách thật đều tự động pipeline cả khối <code>MULTI … EXEC</code>, nên tổng cộng nó tốn một vòng đi-về. Khi bạn viết <code>redis.multi().set(…).expire(…).exec()</code> là bạn đang lấy được cả sự cô lập <em>lẫn</em> phần tiết kiệm mạng cùng lúc.</span></div>
</div>
<pre><code><span class="tok-comment">// Cô lập quan trọng ở đây: khoá không bao giờ được tồn tại mà thiếu TTL</span>
await redis.multi()
  .hSet(&#96;sess:\${sid}&#96;, { user: String(uid) })
  .expire(&#96;sess:\${sid}&#96;, 1800)
  .exec();

<span class="tok-comment">// Cô lập không quan trọng ở đây — một pipeline thường là đủ</span>
const [views, likes, comments] = await Promise.all([
  redis.get(&#96;views:\${id}&#96;),
  redis.get(&#96;likes:\${id}&#96;),
  redis.get(&#96;comments:\${id}&#96;),
]);</code></pre>

<h3>Cái giới hạn đẩy bạn sang Lua</h3>
<pre><code><span class="tok-comment"># Thử viết: "giảm tồn kho, nhưng chỉ khi nó còn trên 0"</span>
redis-cli &lt;&lt;'EOF'
SET stock 1
MULTI
GET stock          # ← trả về QUEUED, không phải "1". Bạn không thấy giá trị.
DECR stock         # ← nên bạn không quyết được có chạy dòng này không
EXEC
GET stock
EOF</code></pre>
<div class="out">OK
OK
QUEUED
QUEUED
1) "1"
2) (integer) 0
"0"</div>
<div class="pitfall"><strong>Cái bẫy:</strong> tin rằng <code>MULTI</code> diễn đạt được một điều kiện. Nó không làm được, và lý do nằm ở cấu trúc chứ không phải một tính năng còn thiếu: các lệnh được xếp hàng trước khi bất kỳ cái nào chạy, nên không có thời điểm nào mà ứng dụng của bạn nhìn thấy được một giá trị rồi chọn gửi lệnh gì tiếp theo. Đọc giá trị <em>trước</em> lệnh <code>MULTI</code> cũng không cứu được — lượt đọc đó nằm ngoài khối, nên một khách khác đổi được nó trong khoảng giữa lượt đọc và lệnh <code>EXEC</code> của bạn, đúng cái cuộc đua bạn đang cố tránh. Redis cho bạn hai lối ra và đó là hai bài tiếp theo. <code>WATCH</code> (Bài 7.2) làm cho <code>EXEC</code> thất bại nếu giá trị đã đổi kể từ lúc bạn đọc, để bạn thử lại — kiểm soát đồng thời lạc quan, không khoá, và chạy tốt khi tranh chấp thấp. Lua (Bài 7.3) chuyển cả chuỗi đọc-quyết-ghi vào bên trong máy chủ, nơi nó chạy như một khối nguyên tử duy nhất và có rẽ nhánh thật. Khi bạn thấy mình muốn có <code>if</code> bên trong <code>MULTI</code> là bạn vừa chạm tới ranh giới của <code>MULTI</code>, và đáp án là một trong hai thứ ấy — không bao giờ là một lượt đọc rồi <code>MULTI</code> mà hy vọng chẳng ai xen vào.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/transactions/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis transactions</span><span class="lc-sub">Trang chính thức, gồm cả mục nói thẳng vì sao Redis không hỗ trợ quay lui và những người thiết kế nghĩ bạn nên làm gì thay vào đó. Hãy đọc trọn một lượt.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/exec/" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">EXEC, DISCARD và hình dáng câu trả lời</span><span class="lc-sub"><code>EXEC</code> trả về gì trong từng kiểu hỏng, khi nào nó trả <code>nil</code>, và <code>EXECABORT</code> khác thế nào với một lỗi từng lệnh nằm bên trong mảng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: giao dịch và giới hạn của nó</span><span class="lc-sub">Bài chấm điểm: đoán đầu ra của bốn khối <code>MULTI</code> gồm cả hai loại lỗi, sửa một bộ xử lý bỏ qua lỗi của từng lệnh, và chỉ ra trong sáu phép thì phép nào thật sự cần cô lập.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>MULTI</code> cho bạn đúng một bảo đảm — không lệnh nào của khách khác xen vào khối của bạn — và tường minh không có quay lui: một lỗi lúc chạy ở vị trí thứ 3 làm hỏng lệnh đó và để phần còn lại chạy tiếp. Có hai loại lỗi với kết cục ngược nhau: lỗi lúc xếp hàng (lệnh lạ, sai số tham số) huỷ tất cả bằng <code>EXECABORT</code>, còn lỗi lúc chạy (sai kiểu) để lại cho bạn một kết quả nửa vời mà bạn phải tự tìm bằng cách kiểm mọi phần tử của mảng trả về. Và các lệnh được xếp hàng trước khi bất kỳ cái nào chạy, nên bạn không thể đọc một giá trị trong khối rồi rẽ nhánh theo nó — ngay khoảnh khắc bạn muốn <code>if</code> là bạn cần <code>WATCH</code> hoặc Lua.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — WATCH: optimistic concurrency without a lock|||7.2 — WATCH: kiểm soát đồng thời lạc quan mà không cần khoá',
      slug: 'rd-7-2-watch',
      type: 'LESSON',
      description: 'WATCH biến EXEC thành so-sánh-rồi-đặt: nếu khoá được canh đã đổi thì cả khối bị huỷ và bạn thử lại. Vòng lặp thử lại đúng cách, cái gì tính là "đã đổi", vì sao khoá tự hết hạn lại không tính, và điểm mà nó suy sụp khi tranh chấp cao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>WATCH: optimistic concurrency without a lock</h2>
<p class="lead"><code>WATCH</code> is Redis's answer to the problem <code>MULTI</code> cannot solve: read a value, decide something, write based on it, and be sure nobody changed it in between. It does not lock. It watches — and if the value moved, <code>EXEC</code> refuses to run and hands the problem back to you.</p>

<h3>The mechanism</h3>
<pre><code><span class="tok-comment"># Session 1</span>
redis-cli &lt;&lt;'EOF'
SET stock 5
WATCH stock
GET stock
MULTI
DECR stock
EXEC
EOF</code></pre>
<div class="out">OK
OK
"5"
OK
QUEUED
1) (integer) 4</div>
<pre><code><span class="tok-comment"># Now the same thing, with another client interfering between WATCH and EXEC</span>
redis-cli SET stock 5 &gt;/dev/null
(redis-cli &lt;&lt;'EOF'
WATCH stock
GET stock
MULTI
DECR stock
EOF
sleep 1
redis-cli EXEC) &amp;
sleep 0.3
redis-cli SET stock 99          <span class="tok-comment"># ← interference</span>
wait</code></pre>
<div class="out">OK
"5"
OK
QUEUED
OK
(nil)</div>
<div class="callout"><strong><code>EXEC</code> returned <code>nil</code>, and that is the entire feature.</strong> A nil reply from <code>EXEC</code> — distinct from an empty array — means "one of the keys you were watching changed, so I did not run your block". Nothing was written. Your job is to notice that nil, go back to the top, read the current value and try again. This is compare-and-swap: optimistic, lock-free, and it costs nothing at all when there is no contention, because in the common case nothing interfered and <code>EXEC</code> just runs.</div>

<h3>The retry loop, written properly</h3>
<pre><code>async function decrementIfPositive(key, maxRetries = 5) {
  for (let attempt = 0; attempt &lt; maxRetries; attempt++) {
    await redis.watch(key);                       <span class="tok-comment">// 1. start watching</span>

    const current = Number(await redis.get(key)); <span class="tok-comment">// 2. read</span>
    if (current &lt;= 0) {
      await redis.unwatch();                      <span class="tok-comment">// 3. decided not to write</span>
      return { ok: false, reason: 'out-of-stock' };
    }

    const result = await redis                    <span class="tok-comment">// 4. write, guarded</span>
      .multi()
      .decr(key)
      .exec();

    if (result !== null) return { ok: true, left: result[0] };

    <span class="tok-comment">// 5. EXEC returned nil → someone changed it. Back off and retry.</span>
    await sleep(Math.random() * 10 * (attempt + 1));
  }
  throw new Error('too much contention on ' + key);
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">WATCH before you read</span><span class="lz-t">not after</span><span class="lz-d">The watch has to be armed before the read, or there is a window between reading and watching in which a change goes unnoticed. This is the ordering bug that makes a <code>WATCH</code> loop look correct and behave like no protection at all.</span></div>
  <div class="lz-step"><span class="lz-k">UNWATCH when you decide not to write</span><span class="lz-t">or the watch leaks onto the connection</span><span class="lz-d">A watch lives on the connection until <code>EXEC</code>, <code>DISCARD</code> or <code>UNWATCH</code> clears it. With a connection pool, an abandoned watch travels to whoever borrows the connection next and makes <em>their</em> unrelated transaction fail mysteriously.</span></div>
  <div class="lz-step"><span class="lz-k">Distinguish nil from an empty array</span><span class="lz-t">nil = aborted · [] = ran, nothing queued</span><span class="lz-d">Client libraries differ here: some return <code>null</code>, some throw a <code>WatchError</code>, some give you an empty array. Find out which yours does and write the check deliberately — treating "aborted" as "succeeded with no results" is a silent data-loss bug.</span></div>
  <div class="lz-step"><span class="lz-k">Bound the retries and back off</span><span class="lz-t">random jitter, growing with attempt</span><span class="lz-d">Unbounded retries turn contention into a livelock where every client keeps aborting every other one. A small randomised backoff breaks the synchronisation, and a hard cap turns an infinite loop into an error you can see.</span></div>
</div>

<h3>What counts as "changed"</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SET k "same"
WATCH k
SET k "same"          # ← writing the SAME value still counts as a change
MULTI
GET k
EXEC
EOF</code></pre>
<div class="out">OK
OK
OK
OK
QUEUED
(nil)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Any write touches it, even a no-op write</span><span class="v"><code>SET k "same"</code> aborts the transaction. Redis tracks that the key was <em>modified</em>, not that its value differs. This causes surprising aborts when something rewrites a key on a timer.</span></div>
  <div class="kv"><span class="k">Natural expiry does not count</span><span class="v">Since Redis 6.0.9, a watched key expiring on its own does <em>not</em> abort <code>EXEC</code>. An explicit <code>DEL</code> or <code>UNLINK</code> does. The distinction exists because otherwise every transaction watching a TTL'd key would abort at random.</span></div>
  <div class="kv"><span class="k">The watch is per-connection</span><span class="v">Not per-client-object, not global. Two connections watching the same key do not interact. In a pool, "which connection am I on" becomes a correctness question — most libraries handle this, but check.</span></div>
  <div class="kv"><span class="k"><code>EXEC</code> and <code>DISCARD</code> always clear all watches</span><span class="v">Even a failed <code>EXEC</code>. So a retry must call <code>WATCH</code> again from the top; re-running only the <code>MULTI</code> part watches nothing and silently loses the protection.</span></div>
  <div class="kv"><span class="k">You can watch several keys</span><span class="v"><code>WATCH a b c</code> aborts if <em>any</em> of them changes. Useful for a transfer between two accounts — and in Cluster, all of them must live in the same hash slot (Chapter 11).</span></div>
</div>

<h3>A real one: transfer between two balances</h3>
<pre><code>async function transfer(from, to, amount) {
  for (let i = 0; i &lt; 5; i++) {
    await redis.watch([from, to]);
    const [a, b] = (await redis.mGet([from, to])).map(Number);

    if (a &lt; amount) { await redis.unwatch(); return { ok: false, reason: 'insufficient' }; }

    const res = await redis.multi()
      .set(from, String(a - amount))
      .set(to, String(b + amount))
      .exec();

    if (res !== null) return { ok: true };
    await sleep(Math.random() * 10 * (i + 1));
  }
  return { ok: false, reason: 'contention' };
}</code></pre>
<div class="callout ok"><strong>Note what this buys and what it costs.</strong> It buys correctness: no interleaving can produce a state where money was created or destroyed, because if either balance moved between the read and the write, the whole block is discarded and recomputed from fresh values. It costs two extra round trips per attempt (<code>WATCH</code> and the read) and a retry loop you have to get right. Compare with the Lua version in Lesson 7.3, which is one round trip, no retries, and no possibility of an abort — at the price of writing the logic in a different language and shipping it to the server.</div>

<h3>Where optimistic concurrency stops working</h3>
<pre><code><span class="tok-comment"># 50 clients all decrementing the same key with WATCH, 1000 ops each</span>
node bench-watch.js --clients 50 --ops 1000 | tail -5
<span class="tok-comment"># The same workload as a single Lua script</span>
node bench-lua.js --clients 50 --ops 1000 | tail -3</code></pre>
<div class="out">WATCH: 50000 successful ops, 214883 EXEC attempts (4.3x amplification)
WATCH: retries p50=2 p99=41 · 12 gave up after 5 attempts
WATCH: wall 38.2s · 1309 ops/s
LUA:   50000 successful ops, 50000 script calls (1.0x)
LUA:   wall 4.1s · 12195 ops/s</div>
<div class="pitfall"><strong>Pitfall:</strong> using <code>WATCH</code> on a hot key. Optimistic concurrency assumes conflicts are rare — that is the entire bet, and it is a good bet for a user's own shopping cart, a per-account balance, a per-document edit. It is a terrible bet for one global counter, one inventory row on a flash sale, or one leaderboard entry during a tournament final, because every client aborts every other client and the system spends its time retrying rather than working. The measurement above is what that looks like: 4.3× more <code>EXEC</code> calls than successful operations, a p99 of 41 retries, twelve clients that gave up entirely, and nine times the wall-clock of the Lua version. The failure is also <em>unfair</em> — a slow client retries forever while fast ones keep winning, so the worst-affected user is the one on the worst connection. Three ways out: move the operation into a Lua script or a Function so it cannot conflict (Lessons 7.3 and 7.4), find a single atomic command that already does the job (<code>INCR</code>, <code>ZADD GT</code>, <code>SETNX</code> — Lesson 4.3), or shard the hot key into N counters you sum on read. And if you are reaching for <code>WATCH</code> at all, check the single-command option first: half the transactions people write are an <code>INCR</code> in disguise.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👁️</span>
  <span class="lc-body"><span class="lc-title">WATCH</span><span class="lc-sub">The command reference, including the exact rules for what invalidates a watch and the note about expired keys not aborting since 6.0.9.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/transactions/#optimistic-locking-using-check-and-set" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Optimistic locking using check-and-set</span><span class="lc-sub">The official worked example of the retry loop, with the reasoning about why this is check-and-set and where the pattern's guarantees end.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a CAS loop</span><span class="lc-sub">Graded exercises: write a bounded retry loop with backoff, find the ordering bug in a loop that reads before it watches, fix a handler that leaks a watch onto a pooled connection, and measure retry amplification under contention.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>WATCH</code> turns <code>EXEC</code> into compare-and-swap: a <code>nil</code> reply means a watched key changed and nothing ran, so the retry loop — <code>WATCH</code>, read, decide, <code>MULTI</code>, <code>EXEC</code>, check for nil — is the pattern, and it must re-watch from the top on every attempt. Watch before you read, <code>UNWATCH</code> when you decide not to write (an abandoned watch travels with a pooled connection and breaks someone else's transaction), and bound your retries with jitter or contention becomes livelock. And optimistic concurrency is a bet that conflicts are rare — on a genuinely hot key it collapses into retry amplification, and the answer is a single atomic command, a Lua script, or sharding the key.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>WATCH: kiểm soát đồng thời lạc quan mà không cần khoá</h2>
<p class="lead"><code>WATCH</code> là câu trả lời của Redis cho bài toán mà <code>MULTI</code> không giải được: đọc một giá trị, quyết định điều gì đó, ghi dựa trên nó, và chắc chắn rằng không ai đổi nó ở khoảng giữa. Nó không khoá. Nó canh — và nếu giá trị nhúc nhích thì <code>EXEC</code> từ chối chạy rồi trả bài toán về cho bạn.</p>

<h3>Cơ chế</h3>
<pre><code><span class="tok-comment"># Phiên 1</span>
redis-cli &lt;&lt;'EOF'
SET stock 5
WATCH stock
GET stock
MULTI
DECR stock
EXEC
EOF</code></pre>
<div class="out">OK
OK
"5"
OK
QUEUED
1) (integer) 4</div>
<pre><code><span class="tok-comment"># Giờ vẫn thế, nhưng có khách khác xen vào giữa WATCH và EXEC</span>
redis-cli SET stock 5 &gt;/dev/null
(redis-cli &lt;&lt;'EOF'
WATCH stock
GET stock
MULTI
DECR stock
EOF
sleep 1
redis-cli EXEC) &amp;
sleep 0.3
redis-cli SET stock 99          <span class="tok-comment"># ← xen vào</span>
wait</code></pre>
<div class="out">OK
"5"
OK
QUEUED
OK
(nil)</div>
<div class="callout"><strong><code>EXEC</code> trả về <code>nil</code>, và đó là toàn bộ tính năng.</strong> Một câu trả lời nil từ <code>EXEC</code> — khác với một mảng rỗng — nghĩa là "một trong những khoá anh đang canh đã đổi, nên tôi không chạy khối của anh". Không có gì được ghi. Việc của bạn là nhận ra cái nil đó, quay lên đầu, đọc giá trị hiện tại và thử lại. Đây là so-sánh-rồi-tráo: lạc quan, không khoá, và nó chẳng tốn gì cả khi không có tranh chấp, vì trong trường hợp thường gặp thì không ai xen vào và <code>EXEC</code> cứ thế chạy.</div>

<h3>Vòng lặp thử lại, viết cho đúng</h3>
<pre><code>async function decrementIfPositive(key, maxRetries = 5) {
  for (let attempt = 0; attempt &lt; maxRetries; attempt++) {
    await redis.watch(key);                       <span class="tok-comment">// 1. bắt đầu canh</span>

    const current = Number(await redis.get(key)); <span class="tok-comment">// 2. đọc</span>
    if (current &lt;= 0) {
      await redis.unwatch();                      <span class="tok-comment">// 3. quyết định không ghi</span>
      return { ok: false, reason: 'out-of-stock' };
    }

    const result = await redis                    <span class="tok-comment">// 4. ghi, có canh gác</span>
      .multi()
      .decr(key)
      .exec();

    if (result !== null) return { ok: true, left: result[0] };

    <span class="tok-comment">// 5. EXEC trả nil → ai đó đã đổi nó. Lùi lại một nhịp rồi thử lại.</span>
    await sleep(Math.random() * 10 * (attempt + 1));
  }
  throw new Error('too much contention on ' + key);
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">WATCH trước khi đọc</span><span class="lz-t">không phải sau</span><span class="lz-d">Phép canh phải được lên nòng trước lượt đọc, nếu không thì có một cửa sổ giữa lúc đọc và lúc canh mà một thay đổi lọt qua không bị phát hiện. Đây là lỗi thứ tự làm cho một vòng lặp <code>WATCH</code> trông thì đúng mà cư xử như chẳng bảo vệ gì.</span></div>
  <div class="lz-step"><span class="lz-k">UNWATCH khi bạn quyết định không ghi</span><span class="lz-t">nếu không, phép canh rò rỉ lại trên kết nối</span><span class="lz-d">Một phép canh sống trên kết nối cho tới khi <code>EXEC</code>, <code>DISCARD</code> hoặc <code>UNWATCH</code> dọn nó đi. Với một gáo kết nối, một phép canh bị bỏ rơi sẽ đi theo tới người mượn kết nối kế tiếp và làm giao dịch chẳng liên quan gì <em>của họ</em> thất bại một cách khó hiểu.</span></div>
  <div class="lz-step"><span class="lz-k">Phân biệt nil với mảng rỗng</span><span class="lz-t">nil = bị huỷ · [] = đã chạy, không xếp hàng gì</span><span class="lz-d">Các thư viện khách khác nhau ở chỗ này: cái trả <code>null</code>, cái ném <code>WatchError</code>, cái đưa bạn một mảng rỗng. Hãy tìm hiểu thư viện của bạn làm gì rồi viết phép kiểm một cách có chủ ý — coi "bị huỷ" là "thành công không có kết quả nào" là một lỗi mất dữ liệu âm thầm.</span></div>
  <div class="lz-step"><span class="lz-k">Chặn số lần thử lại và lùi dần</span><span class="lz-t">nhiễu ngẫu nhiên, tăng theo lần thử</span><span class="lz-d">Thử lại không giới hạn biến tranh chấp thành một cái khoá sống nơi mọi khách cứ liên tục huỷ lẫn nhau. Một nhịp lùi ngẫu nhiên nho nhỏ phá vỡ sự đồng bộ, và một cái trần cứng biến vòng lặp vô hạn thành một lỗi bạn nhìn thấy được.</span></div>
</div>

<h3>Cái gì tính là "đã đổi"</h3>
<pre><code>redis-cli &lt;&lt;'EOF'
SET k "same"
WATCH k
SET k "same"          # ← ghi CÙNG một giá trị vẫn tính là đã đổi
MULTI
GET k
EXEC
EOF</code></pre>
<div class="out">OK
OK
OK
OK
QUEUED
(nil)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi lượt ghi đều chạm vào nó, kể cả lượt ghi vô nghĩa</span><span class="v"><code>SET k "same"</code> huỷ giao dịch. Redis theo dõi việc khoá <em>bị sửa</em>, không theo dõi việc giá trị có khác đi hay không. Điều này gây ra những lần huỷ bất ngờ khi có thứ gì đó ghi đè một khoá theo hẹn giờ.</span></div>
  <div class="kv"><span class="k">Hết hạn tự nhiên thì không tính</span><span class="v">Từ Redis 6.0.9, một khoá đang được canh mà tự hết hạn thì <em>không</em> huỷ <code>EXEC</code>. Một lệnh <code>DEL</code> hay <code>UNLINK</code> tường minh thì có. Sự phân biệt này tồn tại vì nếu không thì mọi giao dịch canh một khoá có TTL đều sẽ bị huỷ một cách ngẫu nhiên.</span></div>
  <div class="kv"><span class="k">Phép canh là theo từng kết nối</span><span class="v">Không phải theo đối tượng khách, không phải toàn cục. Hai kết nối cùng canh một khoá thì không tương tác với nhau. Trong một gáo kết nối thì "tôi đang ở kết nối nào" trở thành một câu hỏi về tính đúng đắn — phần lớn thư viện lo được, nhưng hãy kiểm.</span></div>
  <div class="kv"><span class="k"><code>EXEC</code> và <code>DISCARD</code> luôn dọn hết mọi phép canh</span><span class="v">Kể cả một lệnh <code>EXEC</code> thất bại. Nên một lần thử lại phải gọi <code>WATCH</code> lại từ đầu; chạy lại mỗi phần <code>MULTI</code> thì chẳng canh gì cả và âm thầm mất luôn sự bảo vệ.</span></div>
  <div class="kv"><span class="k">Bạn canh được nhiều khoá</span><span class="v"><code>WATCH a b c</code> huỷ nếu <em>bất kỳ</em> cái nào đổi. Có ích cho một lần chuyển khoản giữa hai tài khoản — và trong Cluster thì tất cả chúng phải nằm trong cùng một ô băm (Chương 11).</span></div>
</div>

<h3>Một ví dụ thật: chuyển tiền giữa hai số dư</h3>
<pre><code>async function transfer(from, to, amount) {
  for (let i = 0; i &lt; 5; i++) {
    await redis.watch([from, to]);
    const [a, b] = (await redis.mGet([from, to])).map(Number);

    if (a &lt; amount) { await redis.unwatch(); return { ok: false, reason: 'insufficient' }; }

    const res = await redis.multi()
      .set(from, String(a - amount))
      .set(to, String(b + amount))
      .exec();

    if (res !== null) return { ok: true };
    await sleep(Math.random() * 10 * (i + 1));
  }
  return { ok: false, reason: 'contention' };
}</code></pre>
<div class="callout ok"><strong>Hãy để ý nó mua về cái gì và tốn cái gì.</strong> Nó mua về tính đúng đắn: không cách xen kẽ nào tạo ra được một trạng thái mà tiền bị sinh ra hay biến mất, vì nếu một trong hai số dư nhúc nhích giữa lượt đọc và lượt ghi thì cả khối bị vứt đi và tính lại từ những giá trị tươi. Nó tốn thêm hai vòng đi-về cho mỗi lần thử (<code>WATCH</code> và lượt đọc) cùng một vòng lặp thử lại mà bạn phải viết cho đúng. Hãy so với bản Lua ở Bài 7.3: một vòng đi-về, không thử lại, và không có khả năng bị huỷ — với cái giá là viết logic bằng một ngôn ngữ khác rồi gửi nó lên máy chủ.</div>

<h3>Chỗ mà kiểm soát đồng thời lạc quan ngừng chạy được</h3>
<pre><code><span class="tok-comment"># 50 khách cùng giảm một khoá bằng WATCH, mỗi khách 1000 phép</span>
node bench-watch.js --clients 50 --ops 1000 | tail -5
<span class="tok-comment"># Cùng khối lượng đó nhưng gói trong một script Lua</span>
node bench-lua.js --clients 50 --ops 1000 | tail -3</code></pre>
<div class="out">WATCH: 50000 successful ops, 214883 EXEC attempts (4.3x amplification)
WATCH: retries p50=2 p99=41 · 12 gave up after 5 attempts
WATCH: wall 38.2s · 1309 ops/s
LUA:   50000 successful ops, 50000 script calls (1.0x)
LUA:   wall 4.1s · 12195 ops/s</div>
<div class="pitfall"><strong>Cái bẫy:</strong> dùng <code>WATCH</code> trên một khoá nóng. Kiểm soát đồng thời lạc quan giả định rằng xung đột là hiếm — đó là toàn bộ ván cược, và nó là ván cược tốt cho giỏ hàng riêng của một người, một số dư theo từng tài khoản, một lượt sửa theo từng tài liệu. Nó là ván cược tệ hại cho một bộ đếm toàn cục duy nhất, một dòng tồn kho trong đợt bán chớp nhoáng, hay một mục bảng xếp hạng trong trận chung kết giải đấu, vì mọi khách đều huỷ mọi khách khác và hệ thống dành thời gian để thử lại thay vì để làm việc. Phép đo ở trên chính là hình dáng của chuyện đó: số lời gọi <code>EXEC</code> nhiều gấp 4,3 lần số phép thành công, p99 là 41 lần thử lại, mười hai khách bỏ cuộc hẳn, và thời gian thực gấp chín lần bản Lua. Kiểu hỏng này còn <em>bất công</em> nữa — một khách chậm cứ thử lại mãi trong khi những khách nhanh liên tục thắng, nên người bị ảnh hưởng nặng nhất lại là người có đường truyền tệ nhất. Ba lối ra: chuyển phép đó vào một script Lua hay một Function để nó không thể xung đột (Bài 7.3 và 7.4), tìm một lệnh nguyên tử duy nhất vốn đã làm đúng việc đó (<code>INCR</code>, <code>ZADD GT</code>, <code>SETNX</code> — Bài 4.3), hoặc chia cái khoá nóng thành N bộ đếm rồi cộng lại lúc đọc. Và nếu bạn đang định với tay lấy <code>WATCH</code> thì hãy kiểm phương án một-lệnh trước: một nửa số giao dịch người ta viết ra thật ra là một lệnh <code>INCR</code> đội lốt.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👁️</span>
  <span class="lc-body"><span class="lc-title">WATCH</span><span class="lc-sub">Tài liệu tra cứu của lệnh, gồm cả luật chính xác về cái gì làm mất hiệu lực một phép canh và ghi chú về việc khoá hết hạn không huỷ giao dịch kể từ bản 6.0.9.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/transactions/#optimistic-locking-using-check-and-set" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Optimistic locking using check-and-set</span><span class="lc-sub">Ví dụ chính thức chạy đủ của vòng lặp thử lại, kèm lập luận vì sao đây là so-sánh-rồi-đặt và những bảo đảm của khuôn này kết thúc ở đâu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một vòng lặp CAS</span><span class="lc-sub">Bài chấm điểm: viết một vòng lặp thử lại có trần và có nhịp lùi, tìm lỗi thứ tự trong một vòng lặp đọc trước khi canh, sửa một bộ xử lý làm rò rỉ phép canh lên một kết nối dùng chung, và đo mức khuếch đại thử lại khi có tranh chấp.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>WATCH</code> biến <code>EXEC</code> thành so-sánh-rồi-tráo: một câu trả lời <code>nil</code> nghĩa là một khoá được canh đã đổi và không có gì chạy cả, nên vòng lặp thử lại — <code>WATCH</code>, đọc, quyết, <code>MULTI</code>, <code>EXEC</code>, kiểm nil — chính là cái khuôn, và nó phải canh lại từ đầu ở mỗi lần thử. Hãy canh trước khi đọc, hãy <code>UNWATCH</code> khi bạn quyết định không ghi (một phép canh bị bỏ rơi đi theo kết nối dùng chung và phá hỏng giao dịch của người khác), và hãy chặn số lần thử lại kèm nhiễu, nếu không tranh chấp sẽ thành khoá sống. Và kiểm soát đồng thời lạc quan là một ván cược rằng xung đột hiếm — trên một khoá thật sự nóng thì nó sụp thành khuếch đại thử lại, và đáp án là một lệnh nguyên tử duy nhất, một script Lua, hoặc chia nhỏ cái khoá.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Lua: moving the logic into the server|||7.3 — Lua: chuyển logic vào bên trong máy chủ',
      slug: 'rd-7-3-lua',
      type: 'LESSON',
      description: 'EVAL với EVALSHA, vì sao KEYS và ARGV là hai thứ khác nhau, năm luật chuyển đổi kiểu Lua↔Redis mà ai cũng vấp, redis.call với pcall, script chặn cả máy chủ nên phải ngắn, và ba script thật đáng chép về dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Lua: moving the logic into the server</h2>
<p class="lead">A Lua script runs inside Redis, as one atomic unit, with the full command set available and real control flow. It is the answer to every "read a value, decide, then write" problem that <code>MULTI</code> cannot express and <code>WATCH</code> handles badly. It is also a loaded gun, because while your script runs, the entire server runs nothing else.</p>

<h3>The shape of a script</h3>
<pre><code>redis-cli SET stock 5
redis-cli EVAL "
  local current = tonumber(redis.call('GET', KEYS[1]) or 0)
  if current &lt;= 0 then
    return {err = 'OUT_OF_STOCK'}
  end
  redis.call('DECR', KEYS[1])
  return current - 1
" 1 stock
redis-cli SET stock 0 &gt;/dev/null
redis-cli EVAL "
  local current = tonumber(redis.call('GET', KEYS[1]) or 0)
  if current &lt;= 0 then return {err = 'OUT_OF_STOCK'} end
  redis.call('DECR', KEYS[1])
  return current - 1
" 1 stock</code></pre>
<div class="out">OK
(integer) 4
(error) OUT_OF_STOCK</div>
<div class="callout ok"><strong>Read, branch, write — one round trip, one atomic unit, no retries, no possibility of interleaving.</strong> This is the thing <code>MULTI</code> structurally cannot do (Lesson 7.1) and the thing <code>WATCH</code> does at the cost of a retry loop that amplifies under contention (Lesson 7.2). Redis is single-threaded, so from the moment <code>EVAL</code> starts until it returns, nothing else touches the data. The whole script <em>is</em> the critical section, for free.</div>

<h3>KEYS and ARGV are not the same thing</h3>
<pre><code>redis-cli EVAL "return {KEYS[1], KEYS[2], ARGV[1], ARGV[2]}" 2 k1 k2 a1 a2
<span class="tok-comment"># The 2 says: the first TWO arguments are keys, the rest are values</span>
redis-cli EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey myvalue
redis-cli GET mykey</code></pre>
<div class="out">1) "k1"
2) "k2"
3) "a1"
4) "a2"
OK
"myvalue"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Every key the script touches must be in KEYS</span><span class="v">Not a style rule — a routing requirement. In Cluster, Redis decides which node runs the script from the declared keys (Chapter 11). A key smuggled in through <code>ARGV</code> and used in a <code>redis.call</code> will be looked up on the wrong node.</span></div>
  <div class="kv"><span class="k">Both are 1-indexed</span><span class="v">Lua tables start at 1, not 0. <code>KEYS[0]</code> is nil and the resulting error message will not mention indexing.</span></div>
  <div class="kv"><span class="k">Everything arrives as a string</span><span class="v"><code>ARGV[1]</code> is <code>"5"</code>, not <code>5</code>. Use <code>tonumber()</code> before comparing or arithmetic, every time — <code>"10" &lt; "9"</code> is true in a string comparison.</span></div>
  <div class="kv"><span class="k">Never build key names inside the script</span><span class="v"><code>redis.call('GET', 'user:' .. ARGV[1])</code> works on a single node and breaks in Cluster, silently, in production, months later. Pass the finished key in <code>KEYS</code>.</span></div>
  <div class="kv"><span class="k">Never interpolate user input into script text</span><span class="v">Building the script string from user data is injection, exactly like SQL. The script body should be a constant; everything variable goes through <code>KEYS</code> and <code>ARGV</code>.</span></div>
</div>

<h3>The five type-conversion rules that bite</h3>
<pre><code>redis-cli EVAL "return 3.7" 0                       <span class="tok-comment"># float → truncated int</span>
redis-cli EVAL "return true" 0                      <span class="tok-comment"># true → 1</span>
redis-cli EVAL "return false" 0                     <span class="tok-comment"># false → nil</span>
redis-cli EVAL "return {1, 2, nil, 4}" 0            <span class="tok-comment"># table stops at nil</span>
redis-cli EVAL "return {ok = 'CUSTOM'}" 0           <span class="tok-comment"># status reply</span>
redis-cli EVAL "return tostring(3.7)" 0             <span class="tok-comment"># the fix: send it as a string</span>
redis-cli EVAL "return redis.call('GET', KEYS[1])" 1 nosuchkey</code></pre>
<div class="out">(integer) 3
(integer) 1
(nil)
1) (integer) 1
2) (integer) 2
CUSTOM
"3.7"
(nil)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Numbers lose their decimals</span><span class="lz-lnote">Lua numbers are doubles; the Redis protocol integer type is not. <code>return 3.7</code> gives you <code>3</code>, silently. Any script computing a price, a ratio or an average must <code>return tostring(x)</code> and let the caller parse it.</span></div>
  <div class="lz-layer"><span class="lz-lname">false becomes nil, and nil is indistinguishable from "missing"</span><span class="lz-lnote">A script returning <code>false</code> and a script returning nothing look identical to the caller. If you need a real boolean, return <code>1</code> and <code>0</code>. This is the single most common Lua-script bug.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tables truncate at the first nil</span><span class="lz-lnote"><code>{1, 2, nil, 4}</code> returns two elements. Lua arrays are not sparse in any useful sense, so a table built in a loop that skips an index silently loses everything after the gap. Build with <code>table.insert</code> or a running counter, never with computed indices that might skip.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>{err = …}</code> and <code>{ok = …}</code> are protocol replies</span><span class="lz-lnote">Returning a table with an <code>err</code> field produces a real Redis error the client will throw on; <code>ok</code> produces a status reply like <code>OK</code>. This is how a script signals a business failure ("out of stock") distinctly from a value.</span></div>
  <div class="lz-layer"><span class="lz-lname">A missing key comes back as Lua <code>false</code></span><span class="lz-lnote">Not <code>nil</code>. <code>redis.call('GET', k)</code> on an absent key returns <code>false</code>, which is falsy in Lua — so <code>tonumber(redis.call('GET', k) or 0)</code> is the idiom, and forgetting the <code>or 0</code> gives you <code>tonumber(false)</code>, which is nil, which then fails to compare.</span></div>
</div>

<h3>call vs pcall, and SCRIPT LOAD</h3>
<pre><code><span class="tok-comment"># redis.call aborts the whole script on error; pcall returns an error table</span>
redis-cli SET str "hello" &gt;/dev/null
redis-cli EVAL "redis.call('INCR', KEYS[1]); return 'never reached'" 1 str
redis-cli EVAL "
  local ok = redis.pcall('INCR', KEYS[1])
  if ok.err then return 'handled: ' .. ok.err end
  return ok
" 1 str

<span class="tok-comment"># Ship scripts by SHA, not by body</span>
SHA=$(redis-cli SCRIPT LOAD "return redis.call('GET', KEYS[1])")
echo "$SHA"
redis-cli EVALSHA "$SHA" 1 mykey
redis-cli SCRIPT EXISTS "$SHA"</code></pre>
<div class="out">(error) ERR value is not an integer or out of range script: 6c8a…, on @user_script:1.
"handled: ERR value is not an integer or out of range"
c1e5c0e9a1a94e5bd1e0b1ba64ee0cbbb84d4064
"myvalue"
1) (integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>redis.call</code> is what you want by default</span><span class="v">An unexpected error aborts the script and surfaces to the client. Since writes already made are <em>not</em> rolled back (there is no rollback anywhere in Redis), design scripts so the risky read happens before any write.</span></div>
  <div class="kv"><span class="k"><code>redis.pcall</code> for errors you expect</span><span class="v">It returns a table with an <code>err</code> field instead of aborting, so you can branch. Use it when a failure is a normal outcome, not when it means your script is wrong.</span></div>
  <div class="kv"><span class="k"><code>EVALSHA</code> saves the bandwidth</span><span class="v">A 2 KB script sent on every call is 2 KB on every call. <code>SCRIPT LOAD</code> once, then send the 40-character SHA. Every serious client library does this for you.</span></div>
  <div class="kv"><span class="k">Handle <code>NOSCRIPT</code></span><span class="v">The script cache is in memory and is emptied by a restart, a failover, or <code>SCRIPT FLUSH</code>. The correct pattern is: try <code>EVALSHA</code>, and on a <code>NOSCRIPT</code> error fall back to <code>EVAL</code> with the body — which also reloads it.</span></div>
  <div class="kv"><span class="k">Scripts replicate by effects</span><span class="v">Since Redis 5, replicas receive the <em>commands the script performed</em>, not the script itself. That is why <code>redis.call('TIME')</code> and randomness are safe now — the replica never re-runs your logic (Chapter 11).</span></div>
</div>

<h3>Three scripts worth stealing</h3>
<pre><code><span class="tok-comment">-- 1 · Clamped decrement: the cart bug from Lesson 5.5, finally fixable</span>
local n = redis.call('HINCRBY', KEYS[1], ARGV[1], tonumber(ARGV[2]))
if n &lt;= 0 then
  redis.call('HDEL', KEYS[1], ARGV[1])
  return 0
end
return n

<span class="tok-comment">-- 2 · Token bucket rate limiter: refill and consume, atomically</span>
local cap    = tonumber(ARGV[1])
local rate   = tonumber(ARGV[2])         <span class="tok-comment">-- tokens per second</span>
local now    = tonumber(ARGV[3])         <span class="tok-comment">-- ms, from the caller</span>
local want   = tonumber(ARGV[4])
local b      = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(b[1]) or cap
local ts     = tonumber(b[2]) or now
tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)
if tokens &lt; want then
  redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'ts', tostring(now))
  redis.call('EXPIRE', KEYS[1], 3600)
  return {0, tostring(tokens)}
end
tokens = tokens - want
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'ts', tostring(now))
redis.call('EXPIRE', KEYS[1], 3600)
return {1, tostring(tokens)}

<span class="tok-comment">-- 3 · Release a lock only if we still hold it (Lesson 6.3)</span>
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0</code></pre>
<div class="callout"><strong>Notice what all three have in common: they are short, they take the current time from the caller rather than reading it, and they return strings for anything with a decimal.</strong> Passing <code>now</code> in as <code>ARGV[3]</code> instead of calling <code>redis.call('TIME')</code> is not about determinism any more — effects replication made that safe — it is about testability, because a script you can hand a fixed timestamp is a script you can unit-test. And every fractional value goes out via <code>tostring</code>, because the truncation rule above would quietly turn 4.8 tokens into 4.</div>

<h3>The script that will not stop</h3>
<pre><code>redis-cli CONFIG GET busy-reply-threshold
redis-cli EVAL "while true do end" 0 &amp;
sleep 6
redis-cli GET anything                <span class="tok-comment"># everyone else is now blocked</span>
redis-cli SCRIPT KILL
redis-cli GET anything</code></pre>
<div class="out">1) "busy-reply-threshold"
2) "5000"
(error) BUSY Redis is busy running a script. You can only call SCRIPT KILL or SHUTDOWN NOSAVE.
OK
(nil)</div>
<div class="pitfall"><strong>Pitfall:</strong> a script that loops over a large collection. Because the script <em>is</em> the critical section, every millisecond it runs is a millisecond in which the whole server serves nobody (Lesson 1.1). A script doing <code>SMEMBERS</code> on a two-million-member set and looping over the results is a two-second global stall, and it is not a bug in Lua — it is exactly what you asked for. After <code>busy-reply-threshold</code> milliseconds (5 s by default) Redis starts replying <code>BUSY</code> to everyone else, which is a courtesy, not a rescue: your script is still running. <code>SCRIPT KILL</code> then works <em>only</em> if the script has not performed a write yet — once it has, killing it would leave a partially-applied change with no rollback, so Redis refuses and your only option is <code>SHUTDOWN NOSAVE</code>, which loses everything since the last save (Chapter 9). Design accordingly: keep scripts to tens of operations, pass in the values you need rather than scanning for them, never call a blocking command, and if you need to touch a large collection, do it in the client with <code>SCAN</code> and use the script only for the small atomic decision at the end.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/eval-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Scripting with Lua</span><span class="lc-sub">The introduction: EVAL, the KEYS/ARGV contract, the script cache, effects replication and the sandbox. The conversion-rules table is the section to bookmark.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/interact/programmability/lua-api/" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">The Lua API reference</span><span class="lc-sub">Everything available inside a script: <code>redis.call</code>, <code>pcall</code>, <code>error_reply</code>, <code>status_reply</code>, <code>sha1hex</code>, <code>cjson</code>, <code>setresp</code>, and the full Lua↔Redis type table in both directions.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write four scripts</span><span class="lc-sub">Graded exercises: the clamped decrement, a token bucket, a conditional cache set that refuses to overwrite a newer version, and a lock release — plus find the type-conversion bug in three scripts that look fine.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A Lua script is a critical section you get for free — read, branch and write in one atomic unit with one round trip — which is why it beats <code>WATCH</code> on any contended key. Declare every key in <code>KEYS</code>, never build key names inside the script and never interpolate user input into the body: the first breaks Cluster routing, the last is injection. And the conversion rules are where scripts actually go wrong: floats truncate, <code>false</code> becomes nil, tables stop at the first nil, and a missing key reads as <code>false</code> — so return <code>tostring(x)</code> for anything fractional and <code>1</code>/<code>0</code> for anything boolean.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Lua: chuyển logic vào bên trong máy chủ</h2>
<p class="lead">Một script Lua chạy bên trong Redis, như một khối nguyên tử duy nhất, với trọn bộ lệnh dùng được và có luồng điều khiển thật. Nó là câu trả lời cho mọi bài toán "đọc một giá trị, quyết định, rồi ghi" mà <code>MULTI</code> không diễn đạt nổi và <code>WATCH</code> xử lý dở. Nó cũng là một khẩu súng đã lên đạn, vì trong lúc script của bạn chạy thì cả máy chủ không chạy gì khác.</p>

<h3>Hình dáng của một script</h3>
<pre><code>redis-cli SET stock 5
redis-cli EVAL "
  local current = tonumber(redis.call('GET', KEYS[1]) or 0)
  if current &lt;= 0 then
    return {err = 'OUT_OF_STOCK'}
  end
  redis.call('DECR', KEYS[1])
  return current - 1
" 1 stock
redis-cli SET stock 0 &gt;/dev/null
redis-cli EVAL "
  local current = tonumber(redis.call('GET', KEYS[1]) or 0)
  if current &lt;= 0 then return {err = 'OUT_OF_STOCK'} end
  redis.call('DECR', KEYS[1])
  return current - 1
" 1 stock</code></pre>
<div class="out">OK
(integer) 4
(error) OUT_OF_STOCK</div>
<div class="callout ok"><strong>Đọc, rẽ nhánh, ghi — một vòng đi-về, một khối nguyên tử, không thử lại, không có khả năng bị xen kẽ.</strong> Đây là thứ mà <code>MULTI</code> về mặt cấu trúc không làm được (Bài 7.1) và là thứ mà <code>WATCH</code> làm được với cái giá là một vòng lặp thử lại bị khuếch đại khi có tranh chấp (Bài 7.2). Redis đơn luồng, nên từ khoảnh khắc <code>EVAL</code> bắt đầu cho tới khi nó trả về, không gì khác chạm vào dữ liệu. Cả cái script <em>chính là</em> vùng tới hạn, miễn phí.</div>

<h3>KEYS và ARGV không phải một thứ</h3>
<pre><code>redis-cli EVAL "return {KEYS[1], KEYS[2], ARGV[1], ARGV[2]}" 2 k1 k2 a1 a2
<span class="tok-comment"># Con số 2 nói rằng: HAI tham số đầu là khoá, phần còn lại là giá trị</span>
redis-cli EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey myvalue
redis-cli GET mykey</code></pre>
<div class="out">1) "k1"
2) "k2"
3) "a1"
4) "a2"
OK
"myvalue"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi khoá script chạm vào đều phải nằm trong KEYS</span><span class="v">Không phải luật về phong cách — mà là yêu cầu định tuyến. Trong Cluster, Redis quyết định nút nào chạy script dựa trên các khoá đã khai báo (Chương 11). Một khoá lén đưa vào qua <code>ARGV</code> rồi dùng trong một lệnh <code>redis.call</code> sẽ bị tra cứu ở sai nút.</span></div>
  <div class="kv"><span class="k">Cả hai đều đánh chỉ số từ 1</span><span class="v">Bảng trong Lua bắt đầu từ 1, không phải 0. <code>KEYS[0]</code> là nil và thông báo lỗi sinh ra sẽ không nhắc gì tới chuyện đánh chỉ số.</span></div>
  <div class="kv"><span class="k">Mọi thứ tới nơi dưới dạng chuỗi</span><span class="v"><code>ARGV[1]</code> là <code>"5"</code>, không phải <code>5</code>. Hãy dùng <code>tonumber()</code> trước khi so sánh hay làm toán, lần nào cũng vậy — <code>"10" &lt; "9"</code> là đúng khi so như chuỗi.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ ghép tên khoá bên trong script</span><span class="v"><code>redis.call('GET', 'user:' .. ARGV[1])</code> chạy được trên một nút và vỡ trong Cluster, âm thầm, ở production, nhiều tháng sau. Hãy truyền cái khoá đã hoàn chỉnh qua <code>KEYS</code>.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ nhét dữ liệu người dùng vào phần chữ của script</span><span class="v">Dựng chuỗi script từ dữ liệu người dùng là tiêm mã, y hệt như với SQL. Thân script phải là một hằng số; mọi thứ biến thiên đi qua <code>KEYS</code> và <code>ARGV</code>.</span></div>
</div>

<h3>Năm luật chuyển đổi kiểu hay cắn người</h3>
<pre><code>redis-cli EVAL "return 3.7" 0                       <span class="tok-comment"># số thực → cắt cụt thành nguyên</span>
redis-cli EVAL "return true" 0                      <span class="tok-comment"># true → 1</span>
redis-cli EVAL "return false" 0                     <span class="tok-comment"># false → nil</span>
redis-cli EVAL "return {1, 2, nil, 4}" 0            <span class="tok-comment"># bảng dừng ở nil</span>
redis-cli EVAL "return {ok = 'CUSTOM'}" 0           <span class="tok-comment"># câu trả lời trạng thái</span>
redis-cli EVAL "return tostring(3.7)" 0             <span class="tok-comment"># cách chữa: gửi nó dạng chuỗi</span>
redis-cli EVAL "return redis.call('GET', KEYS[1])" 1 nosuchkey</code></pre>
<div class="out">(integer) 3
(integer) 1
(nil)
1) (integer) 1
2) (integer) 2
CUSTOM
"3.7"
(nil)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Số mất phần thập phân</span><span class="lz-lnote">Số trong Lua là double; kiểu số nguyên của giao thức Redis thì không. <code>return 3.7</code> cho bạn <code>3</code>, âm thầm. Mọi script tính giá, tỉ lệ hay trung bình đều phải <code>return tostring(x)</code> rồi để bên gọi tự phân tích.</span></div>
  <div class="lz-layer"><span class="lz-lname">false thành nil, và nil không phân biệt được với "không có"</span><span class="lz-lnote">Một script trả về <code>false</code> và một script chẳng trả về gì trông y hệt nhau từ phía bên gọi. Nếu bạn cần một boolean thật thì hãy trả về <code>1</code> và <code>0</code>. Đây là lỗi script Lua phổ biến nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bảng bị cắt ở nil đầu tiên</span><span class="lz-lnote"><code>{1, 2, nil, 4}</code> trả về hai phần tử. Mảng trong Lua không thưa theo bất kỳ nghĩa hữu ích nào, nên một bảng dựng trong vòng lặp mà nhảy cóc một chỉ số sẽ âm thầm mất tất cả những gì nằm sau cái lỗ. Hãy dựng bằng <code>table.insert</code> hoặc một biến đếm chạy, đừng bao giờ dùng chỉ số tính ra mà có thể nhảy cóc.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>{err = …}</code> và <code>{ok = …}</code> là câu trả lời cấp giao thức</span><span class="lz-lnote">Trả về một bảng có trường <code>err</code> sinh ra một lỗi Redis thật mà thư viện khách sẽ ném ra; <code>ok</code> sinh ra một câu trả lời trạng thái kiểu <code>OK</code>. Đây là cách một script báo hiệu một thất bại nghiệp vụ ("hết hàng") tách bạch với một giá trị.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một khoá không tồn tại trả về <code>false</code> của Lua</span><span class="lz-lnote">Không phải <code>nil</code>. <code>redis.call('GET', k)</code> trên một khoá vắng mặt trả về <code>false</code>, vốn mang giá trị sai trong Lua — nên <code>tonumber(redis.call('GET', k) or 0)</code> là cách viết chuẩn, và quên mất <code>or 0</code> thì bạn nhận <code>tonumber(false)</code>, vốn là nil, rồi nó hỏng ngay ở phép so sánh.</span></div>
</div>

<h3>call với pcall, và SCRIPT LOAD</h3>
<pre><code><span class="tok-comment"># redis.call huỷ cả script khi có lỗi; pcall trả về một bảng lỗi</span>
redis-cli SET str "hello" &gt;/dev/null
redis-cli EVAL "redis.call('INCR', KEYS[1]); return 'never reached'" 1 str
redis-cli EVAL "
  local ok = redis.pcall('INCR', KEYS[1])
  if ok.err then return 'handled: ' .. ok.err end
  return ok
" 1 str

<span class="tok-comment"># Hãy gửi script bằng SHA, đừng gửi bằng thân</span>
SHA=$(redis-cli SCRIPT LOAD "return redis.call('GET', KEYS[1])")
echo "$SHA"
redis-cli EVALSHA "$SHA" 1 mykey
redis-cli SCRIPT EXISTS "$SHA"</code></pre>
<div class="out">(error) ERR value is not an integer or out of range script: 6c8a…, on @user_script:1.
"handled: ERR value is not an integer or out of range"
c1e5c0e9a1a94e5bd1e0b1ba64ee0cbbb84d4064
"myvalue"
1) (integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>redis.call</code> là thứ bạn nên dùng mặc định</span><span class="v">Một lỗi bất ngờ sẽ huỷ script và nổi lên tới thư viện khách. Vì những lượt ghi đã thực hiện thì <em>không</em> được quay lui (Redis không có quay lui ở bất cứ đâu), hãy thiết kế script sao cho lượt đọc rủi ro xảy ra trước mọi lượt ghi.</span></div>
  <div class="kv"><span class="k"><code>redis.pcall</code> cho những lỗi bạn lường trước</span><span class="v">Nó trả về một bảng có trường <code>err</code> thay vì huỷ, để bạn rẽ nhánh. Hãy dùng nó khi một thất bại là kết cục bình thường, đừng dùng khi nó nghĩa là script của bạn viết sai.</span></div>
  <div class="kv"><span class="k"><code>EVALSHA</code> tiết kiệm băng thông</span><span class="v">Một script 2 KB gửi ở mỗi lời gọi là 2 KB ở mỗi lời gọi. Hãy <code>SCRIPT LOAD</code> một lần, rồi gửi chuỗi SHA 40 ký tự. Mọi thư viện khách nghiêm túc đều làm hộ bạn việc này.</span></div>
  <div class="kv"><span class="k">Hãy xử lý lỗi <code>NOSCRIPT</code></span><span class="v">Kho script nằm trong bộ nhớ và bị dọn sạch bởi một lần khởi động lại, một lần chuyển đổi, hay lệnh <code>SCRIPT FLUSH</code>. Khuôn đúng là: thử <code>EVALSHA</code>, và khi gặp lỗi <code>NOSCRIPT</code> thì lùi về <code>EVAL</code> kèm thân script — việc đó cũng nạp lại nó luôn.</span></div>
  <div class="kv"><span class="k">Script nhân bản theo hiệu ứng</span><span class="v">Từ Redis 5, bản sao nhận <em>những lệnh mà script đã thực hiện</em>, không nhận chính cái script. Đó là lý do <code>redis.call('TIME')</code> và tính ngẫu nhiên giờ đã an toàn — bản sao không bao giờ chạy lại logic của bạn (Chương 11).</span></div>
</div>

<h3>Ba script đáng chép về dùng</h3>
<pre><code><span class="tok-comment">-- 1 · Giảm có kẹp: cái lỗi giỏ hàng ở Bài 5.5, cuối cùng cũng chữa được</span>
local n = redis.call('HINCRBY', KEYS[1], ARGV[1], tonumber(ARGV[2]))
if n &lt;= 0 then
  redis.call('HDEL', KEYS[1], ARGV[1])
  return 0
end
return n

<span class="tok-comment">-- 2 · Giới hạn tần suất kiểu gáo token: nạp lại và tiêu thụ, nguyên tử</span>
local cap    = tonumber(ARGV[1])
local rate   = tonumber(ARGV[2])         <span class="tok-comment">-- token mỗi giây</span>
local now    = tonumber(ARGV[3])         <span class="tok-comment">-- ms, do bên gọi truyền vào</span>
local want   = tonumber(ARGV[4])
local b      = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(b[1]) or cap
local ts     = tonumber(b[2]) or now
tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)
if tokens &lt; want then
  redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'ts', tostring(now))
  redis.call('EXPIRE', KEYS[1], 3600)
  return {0, tostring(tokens)}
end
tokens = tokens - want
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'ts', tostring(now))
redis.call('EXPIRE', KEYS[1], 3600)
return {1, tostring(tokens)}

<span class="tok-comment">-- 3 · Nhả khoá chỉ khi ta vẫn còn giữ nó (Bài 6.3)</span>
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0</code></pre>
<div class="callout"><strong>Hãy để ý điểm chung của cả ba: chúng ngắn, chúng nhận thời gian hiện tại từ bên gọi thay vì tự đọc, và chúng trả về chuỗi cho bất cứ thứ gì có phần thập phân.</strong> Truyền <code>now</code> vào qua <code>ARGV[3]</code> thay vì gọi <code>redis.call('TIME')</code> giờ không còn là chuyện tính tất định nữa — nhân bản theo hiệu ứng đã làm chuyện đó an toàn — mà là chuyện kiểm thử được, vì một script mà bạn đưa cho được một mốc thời gian cố định là một script bạn viết được bài kiểm đơn vị. Và mọi giá trị có phần lẻ đều đi ra qua <code>tostring</code>, vì cái luật cắt cụt ở trên sẽ lặng lẽ biến 4,8 token thành 4.</div>

<h3>Cái script không chịu dừng</h3>
<pre><code>redis-cli CONFIG GET busy-reply-threshold
redis-cli EVAL "while true do end" 0 &amp;
sleep 6
redis-cli GET anything                <span class="tok-comment"># mọi người khác giờ đang bị chặn</span>
redis-cli SCRIPT KILL
redis-cli GET anything</code></pre>
<div class="out">1) "busy-reply-threshold"
2) "5000"
(error) BUSY Redis is busy running a script. You can only call SCRIPT KILL or SHUTDOWN NOSAVE.
OK
(nil)</div>
<div class="pitfall"><strong>Cái bẫy:</strong> một script lặp qua một tập hợp lớn. Vì cái script <em>chính là</em> vùng tới hạn, mỗi mili giây nó chạy là một mili giây cả máy chủ không phục vụ ai (Bài 1.1). Một script chạy <code>SMEMBERS</code> trên một set hai triệu phần tử rồi lặp qua kết quả là một cú treo toàn cục hai giây, và đó không phải lỗi của Lua — nó đúng là thứ bạn vừa yêu cầu. Sau <code>busy-reply-threshold</code> mili giây (mặc định 5 giây) thì Redis bắt đầu trả <code>BUSY</code> cho mọi người khác, đó là phép lịch sự chứ không phải sự cứu rỗi: script của bạn vẫn đang chạy. Lệnh <code>SCRIPT KILL</code> lúc đó <em>chỉ</em> chạy được nếu script chưa thực hiện lượt ghi nào — khi nó đã ghi rồi thì giết nó đi sẽ để lại một thay đổi áp dụng nửa vời mà không có quay lui, nên Redis từ chối và lựa chọn duy nhất của bạn là <code>SHUTDOWN NOSAVE</code>, vốn làm mất mọi thứ kể từ lần lưu gần nhất (Chương 9). Hãy thiết kế cho hợp: giữ script ở cỡ vài chục phép, truyền vào những giá trị bạn cần thay vì đi quét để tìm chúng, đừng bao giờ gọi một lệnh chặn, và nếu bạn cần đụng vào một tập hợp lớn thì hãy làm ở phía khách bằng <code>SCAN</code> rồi chỉ dùng script cho phần quyết định nguyên tử nho nhỏ ở cuối.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/eval-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Scripting with Lua</span><span class="lc-sub">Bài giới thiệu: EVAL, giao kèo KEYS/ARGV, kho script, nhân bản theo hiệu ứng và cái hộp cát. Bảng luật chuyển đổi là mục đáng đánh dấu lại.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/interact/programmability/lua-api/" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Tài liệu tra cứu Lua API</span><span class="lc-sub">Mọi thứ dùng được bên trong một script: <code>redis.call</code>, <code>pcall</code>, <code>error_reply</code>, <code>status_reply</code>, <code>sha1hex</code>, <code>cjson</code>, <code>setresp</code>, và bảng kiểu Lua↔Redis đầy đủ theo cả hai chiều.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: viết bốn script</span><span class="lc-sub">Bài chấm điểm: phép giảm có kẹp, một gáo token, một phép đặt bộ đệm có điều kiện từ chối đè lên phiên bản mới hơn, và một phép nhả khoá — cộng thêm tìm ra lỗi chuyển đổi kiểu trong ba script trông có vẻ ổn.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một script Lua là một vùng tới hạn bạn có được miễn phí — đọc, rẽ nhánh và ghi trong một khối nguyên tử với một vòng đi-về — đó là lý do nó thắng <code>WATCH</code> trên mọi khoá bị tranh chấp. Hãy khai báo mọi khoá trong <code>KEYS</code>, đừng bao giờ ghép tên khoá bên trong script và đừng bao giờ nhét dữ liệu người dùng vào thân script: cái đầu phá vỡ định tuyến Cluster, cái cuối là tiêm mã. Và các luật chuyển đổi mới là chỗ script thật sự hỏng: số thực bị cắt cụt, <code>false</code> thành nil, bảng dừng ở nil đầu tiên, và một khoá vắng mặt đọc ra thành <code>false</code> — nên hãy trả về <code>tostring(x)</code> cho mọi thứ có phần lẻ và <code>1</code>/<code>0</code> cho mọi thứ mang tính đúng-sai.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Redis Functions: scripts that live on the server|||7.4 — Redis Functions: script sống hẳn trên máy chủ',
      slug: 'rd-7-4-functions',
      type: 'LESSON',
      description: 'Bản 7.0 thêm thư viện hàm có tên, được lưu vào RDB, nhân bản sang bản sao và sống sót qua khởi động lại — hết quản lý SHA, hết lỗi NOSCRIPT. Cấu trúc một thư viện, FCALL với FCALL_RO, các cờ, và khi nào nên ở lại với EVAL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Redis Functions: scripts that live on the server</h2>
<p class="lead">Lua scripts have one structural weakness: they are ephemeral. The script cache is memory, so a restart, a failover or a <code>SCRIPT FLUSH</code> empties it, and every client must be ready to re-send the body. Redis 7.0 added Functions — named, versioned libraries that are part of the dataset itself.</p>

<h3>A library, not a script</h3>
<pre><code>cat &gt; /tmp/mylib.lua &lt;&lt;'LUA'
#!lua name=inventory

local function reserve(keys, args)
  local stock = tonumber(redis.call('GET', keys[1]) or 0)
  local want  = tonumber(args[1])
  if stock &lt; want then
    return {err = 'INSUFFICIENT_STOCK'}
  end
  redis.call('DECRBY', keys[1], want)
  redis.call('HINCRBY', keys[2], args[2], want)
  return stock - want
end

local function peek(keys, args)
  return redis.call('GET', keys[1])
end

redis.register_function('reserve', reserve)
redis.register_function{
  function_name = 'peek',
  callback      = peek,
  flags         = {'no-writes'},
  description   = 'Read stock without modifying it'
}
LUA
redis-cli -x FUNCTION LOAD REPLACE &lt; /tmp/mylib.lua
redis-cli SET stock:4201 10 &gt;/dev/null
redis-cli FCALL reserve 2 stock:4201 reserved:4201 3 order:88
redis-cli FCALL_RO peek 1 stock:4201
redis-cli HGETALL reserved:4201</code></pre>
<div class="out">inventory
(integer) 7
"7"
1) "order:88"
2) "3"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The shebang names the library</span><span class="lz-t">#!lua name=inventory</span><span class="lz-d">Mandatory, and it must be the first line. The name is the unit of loading, replacing and deleting — you do not manage individual functions, you manage libraries.</span></div>
  <div class="lz-step"><span class="lz-k">Callbacks take (keys, args)</span><span class="lz-t">lowercase parameters, not KEYS/ARGV globals</span><span class="lz-d">This is the one syntactic gotcha when porting an <code>EVAL</code> script: the magic globals are gone, replaced by ordinary function parameters. Same 1-indexing, same string-only contents, same Cluster rule that every key must be declared.</span></div>
  <div class="lz-step"><span class="lz-k">register_function makes it callable</span><span class="lz-t">a plain name, or a table with flags</span><span class="lz-d">A function defined but not registered is invisible — useful for shared helpers inside the library. The table form adds flags and a description that <code>FUNCTION LIST</code> will show you.</span></div>
  <div class="lz-step"><span class="lz-k">FCALL replaces EVAL</span><span class="lz-t">FCALL &lt;name&gt; &lt;numkeys&gt; keys… args…</span><span class="lz-d">Identical argument shape to <code>EVAL</code>, but the first argument is a name you chose rather than a SHA or a body. That is the whole ergonomic difference, and it is a large one.</span></div>
</div>

<h3>Why this is not just nicer syntax</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Functions are persisted and replicated</span><span class="lz-lnote">They live in the RDB file and travel to replicas. A restart, a failover, a restore from backup — the functions are still there. Compare with the script cache, which is empty on every one of those events, which is why every <code>EVALSHA</code> path needs a <code>NOSCRIPT</code> fallback (Lesson 7.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Names instead of hashes</span><span class="lz-lnote">Your application calls <code>FCALL reserve …</code>. It does not compute a SHA, cache it, or handle it going missing. Operationally this removes an entire class of "it worked until the primary failed over" bugs.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deployment becomes a separate step — deliberately</span><span class="lz-lnote">Someone must run <code>FUNCTION LOAD</code> when the library changes. That is a real operational cost and also the point: the server-side logic has a version and a deploy, instead of being smuggled in by whichever application instance happened to run first.</span></div>
  <div class="lz-layer"><span class="lz-lname">Flags let Redis reason about your code</span><span class="lz-lnote"><code>no-writes</code> makes a function callable via <code>FCALL_RO</code>, which means it can run on a read replica and during an OOM condition. Declaring it is what lets Redis route and schedule the function correctly — it is not documentation, it is a contract.</span></div>
</div>
<pre><code>redis-cli FUNCTION LIST LIBRARYNAME inventory
redis-cli FUNCTION STATS
redis-cli FCALL_RO reserve 1 stock:4201 1        <span class="tok-comment"># reserve writes → refused</span></code></pre>
<div class="out">1) 1) "library_name"
   2) "inventory"
   3) "engine"
   4) "LUA"
   5) "functions"
   6) 1) 1) "name"
         2) "reserve"
         3) "description"
         4) (nil)
         5) "flags"
         6) (empty array)
      2) 1) "name"
         2) "peek"
         3) "description"
         4) "Read stock without modifying it"
         5) "flags"
         6) 1) "no-writes"
1) "running_script"
2) (nil)
3) "engines"
4) 1) "LUA"
   2) 1) "libraries_count"
      2) (integer) 1
      3) "functions_count"
      4) (integer) 2
(error) ERR Can not execute a script with write flag using *_ro command.</div>

<h3>Operating them</h3>
<pre><code>redis-cli FUNCTION LOAD REPLACE "$(cat /tmp/mylib.lua)"    <span class="tok-comment"># update in place</span>
redis-cli FUNCTION DUMP &gt; /tmp/functions.bin                <span class="tok-comment"># back up all libraries</span>
redis-cli FUNCTION DELETE inventory                         <span class="tok-comment"># remove one library</span>
redis-cli -x FUNCTION RESTORE &lt; /tmp/functions.bin          <span class="tok-comment"># put them back</span>
redis-cli FUNCTION LIST | head -4
redis-cli FUNCTION FLUSH                                    <span class="tok-comment"># remove ALL — careful</span></code></pre>
<div class="out">inventory
OK
OK
1) 1) "library_name"
   2) "inventory"
   3) "engine"
   4) "LUA"
OK</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>LOAD</code> without <code>REPLACE</code> fails if it exists</span><span class="v">Deliberately. A deploy script should use <code>REPLACE</code>; a first-time install should not, so you find out when two things are trying to own the same library name.</span></div>
  <div class="kv"><span class="k">Loading is atomic per library</span><span class="v">If any function in the library fails to register, the whole load is rejected and the previous version stays. You never end up with half a library.</span></div>
  <div class="kv"><span class="k"><code>FUNCTION DUMP</code>/<code>RESTORE</code> is your migration path</span><span class="v">Moving to a new instance, or seeding a test environment, is a dump and a restore. <code>RESTORE</code> takes a policy — <code>APPEND</code> (default), <code>FLUSH</code>, or <code>REPLACE</code> — so decide deliberately what happens to libraries already there.</span></div>
  <div class="kv"><span class="k">Put the library in your repository</span><span class="v">It is source code that runs in production. It belongs in git, in code review, with tests, and loaded by your deploy pipeline — not pasted into <code>redis-cli</code> by whoever is on call.</span></div>
  <div class="kv"><span class="k">A running function still blocks everything</span><span class="v">Functions are not more concurrent than scripts. Every warning from Lesson 7.3 applies unchanged: keep them short, never loop over a large collection, and <code>FUNCTION STATS</code> plus <code>FUNCTION KILL</code> are your equivalents of <code>SCRIPT KILL</code>.</span></div>
</div>

<h3>Which to use</h3>
<pre><code><span class="tok-comment">// EVAL — the library handles SHA caching and NOSCRIPT for you</span>
const RESERVE = &#96;local stock = tonumber(redis.call('GET', KEYS[1]) or 0) …&#96;;
await redis.eval(RESERVE, { keys: ['stock:4201'], arguments: ['3'] });

<span class="tok-comment">// FCALL — the logic was deployed separately, the app just calls it</span>
await redis.fCall('reserve', { keys: ['stock:4201', 'reserved:4201'],
                               arguments: ['3', 'order:88'] });</code></pre>
<div class="callout ok"><strong>Use <code>EVAL</code> for a script that belongs to one application, and Functions for logic that is genuinely part of the data layer.</strong> A five-line lock release that only your service uses does not need a deploy step, a library name and a load command — <code>EVAL</code> with your client's automatic SHA handling is simpler and there is nothing wrong with it. A twenty-line inventory reservation that three services call, that must behave identically for all of them, and that must survive a failover without any of them noticing — that is a Function. The deciding question is not size, it is ownership: if more than one codebase depends on the logic being exactly right, it should have a name, a version and a deploy of its own.</div>

<div class="pitfall"><strong>Pitfall:</strong> assuming your Redis has Functions at all. They arrived in <strong>7.0</strong>, and the gap between "Redis has this" and "the Redis I am deploying to has this" is wider than usual here: managed offerings lag upstream by a year or more, and some deliberately disable server-side programmability entirely for multi-tenancy reasons — the same instances where <code>EVAL</code> is restricted will not offer <code>FUNCTION</code> either. The failure is at runtime, as <code>ERR unknown command 'FCALL'</code>, in the path you built your atomicity on. Check <code>redis-cli INFO server | grep redis_version</code> and <code>redis-cli COMMAND INFO fcall</code> on <em>every</em> environment before designing around it. There is a second, subtler version of the same trap: because functions are stored in the RDB, an instance restored from a backup taken before your library existed comes up without it, and the first <code>FCALL</code> after the restore fails. Make <code>FUNCTION LOAD REPLACE</code> a step in your deploy <em>and</em> in your restore runbook, and have the application fail loudly with a clear message rather than falling back to a non-atomic path that silently corrupts inventory.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/functions-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Functions</span><span class="lc-sub">The introduction: library structure, <code>register_function</code>, the full flag list with what each one permits, and the migration guide from <code>EVAL</code>.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/function-load/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">FUNCTION LOAD and friends</span><span class="lc-sub">The whole <code>FUNCTION</code> command family — <code>LIST</code>, <code>DUMP</code>, <code>RESTORE</code>, <code>STATS</code>, <code>KILL</code>, <code>FLUSH</code> — with the restore policies and what each returns.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: ship a function library</span><span class="lc-sub">Graded exercises: port an <code>EVAL</code> script to a library, add the <code>no-writes</code> flag and prove <code>FCALL_RO</code> accepts it, dump and restore across instances, and write the version check that fails loudly instead of silently.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Functions are Lua with a different lifecycle: named libraries that persist in the RDB, replicate to replicas and survive restarts and failovers — which removes SHA management and the entire <code>NOSCRIPT</code> fallback path. The syntax differences are small but real: a <code>#!lua name=…</code> shebang on line one, callbacks taking <code>(keys, args)</code> as parameters instead of the <code>KEYS</code>/<code>ARGV</code> globals, and <code>register_function</code> to expose them. And the choice is about ownership, not size: <code>EVAL</code> for logic one service owns, Functions for logic several services depend on — with a version check on every environment, because 7.0 is recent and managed hosts often disable programmability outright.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Redis Functions: script sống hẳn trên máy chủ</h2>
<p class="lead">Script Lua có một điểm yếu mang tính cấu trúc: chúng phù du. Kho script nằm trong bộ nhớ, nên một lần khởi động lại, một lần chuyển đổi hay một lệnh <code>SCRIPT FLUSH</code> là nó rỗng, và mọi thư viện khách phải sẵn sàng gửi lại thân script. Redis 7.0 thêm Functions — những thư viện hàm có tên, có phiên bản, và là một phần của chính tập dữ liệu.</p>

<h3>Một thư viện, không phải một script</h3>
<pre><code>cat &gt; /tmp/mylib.lua &lt;&lt;'LUA'
#!lua name=inventory

local function reserve(keys, args)
  local stock = tonumber(redis.call('GET', keys[1]) or 0)
  local want  = tonumber(args[1])
  if stock &lt; want then
    return {err = 'INSUFFICIENT_STOCK'}
  end
  redis.call('DECRBY', keys[1], want)
  redis.call('HINCRBY', keys[2], args[2], want)
  return stock - want
end

local function peek(keys, args)
  return redis.call('GET', keys[1])
end

redis.register_function('reserve', reserve)
redis.register_function{
  function_name = 'peek',
  callback      = peek,
  flags         = {'no-writes'},
  description   = 'Read stock without modifying it'
}
LUA
redis-cli -x FUNCTION LOAD REPLACE &lt; /tmp/mylib.lua
redis-cli SET stock:4201 10 &gt;/dev/null
redis-cli FCALL reserve 2 stock:4201 reserved:4201 3 order:88
redis-cli FCALL_RO peek 1 stock:4201
redis-cli HGETALL reserved:4201</code></pre>
<div class="out">inventory
(integer) 7
"7"
1) "order:88"
2) "3"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dòng shebang đặt tên cho thư viện</span><span class="lz-t">#!lua name=inventory</span><span class="lz-d">Bắt buộc, và nó phải là dòng đầu tiên. Cái tên là đơn vị để nạp, thay thế và xoá — bạn không quản lý từng hàm, bạn quản lý các thư viện.</span></div>
  <div class="lz-step"><span class="lz-k">Hàm gọi lại nhận (keys, args)</span><span class="lz-t">tham số viết thường, không phải biến toàn cục KEYS/ARGV</span><span class="lz-d">Đây là chỗ vấp cú pháp duy nhất khi chuyển một script <code>EVAL</code> sang: các biến toàn cục thần kỳ biến mất, thay bằng tham số hàm bình thường. Vẫn đánh chỉ số từ 1, vẫn chỉ chứa chuỗi, vẫn luật Cluster rằng mọi khoá phải được khai báo.</span></div>
  <div class="lz-step"><span class="lz-k">register_function làm cho nó gọi được</span><span class="lz-t">một cái tên trần, hoặc một bảng kèm cờ</span><span class="lz-d">Một hàm được định nghĩa mà không đăng ký thì vô hình — có ích cho các hàm phụ dùng chung bên trong thư viện. Dạng bảng thêm được cờ và một mô tả mà <code>FUNCTION LIST</code> sẽ hiện ra cho bạn.</span></div>
  <div class="lz-step"><span class="lz-k">FCALL thay cho EVAL</span><span class="lz-t">FCALL &lt;tên&gt; &lt;numkeys&gt; keys… args…</span><span class="lz-d">Hình dáng tham số y hệt <code>EVAL</code>, nhưng tham số đầu là một cái tên bạn chọn chứ không phải một chuỗi SHA hay một thân script. Đó là toàn bộ khác biệt về trải nghiệm sử dụng, và nó là một khác biệt lớn.</span></div>
</div>

<h3>Vì sao đây không chỉ là cú pháp đẹp hơn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Function được lưu lâu dài và được nhân bản</span><span class="lz-lnote">Chúng nằm trong tệp RDB và đi sang các bản sao. Một lần khởi động lại, một lần chuyển đổi, một lần khôi phục từ bản sao lưu — các hàm vẫn còn đó. Hãy so với kho script, vốn rỗng sau mỗi sự kiện trong số đó, đó là lý do mọi nhánh <code>EVALSHA</code> đều cần một đường lùi cho <code>NOSCRIPT</code> (Bài 7.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Tên thay cho mã băm</span><span class="lz-lnote">Ứng dụng của bạn gọi <code>FCALL reserve …</code>. Nó không phải tính SHA, không phải nhớ đệm, không phải lo chuyện nó biến mất. Về mặt vận hành, điều này gỡ bỏ cả một họ lỗi kiểu "nó vẫn chạy tốt cho tới khi bản chính chuyển đổi".</span></div>
  <div class="lz-layer"><span class="lz-lname">Triển khai thành một bước riêng — một cách có chủ ý</span><span class="lz-lnote">Phải có ai đó chạy <code>FUNCTION LOAD</code> khi thư viện đổi. Đó là một chi phí vận hành thật và cũng chính là điểm mấu chốt: phần logic phía máy chủ có phiên bản và có lần triển khai, thay vì bị lén đưa vào bởi bất kỳ máy ứng dụng nào tình cờ chạy trước.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cờ cho phép Redis suy luận về mã của bạn</span><span class="lz-lnote"><code>no-writes</code> làm cho một hàm gọi được qua <code>FCALL_RO</code>, nghĩa là nó chạy được trên bản sao đọc và cả trong tình trạng hết bộ nhớ. Việc khai báo nó chính là thứ cho phép Redis định tuyến và xếp lịch hàm đó cho đúng — nó không phải tài liệu, nó là một giao kèo.</span></div>
</div>
<pre><code>redis-cli FUNCTION LIST LIBRARYNAME inventory
redis-cli FUNCTION STATS
redis-cli FCALL_RO reserve 1 stock:4201 1        <span class="tok-comment"># reserve có ghi → bị từ chối</span></code></pre>
<div class="out">1) 1) "library_name"
   2) "inventory"
   3) "engine"
   4) "LUA"
   5) "functions"
   6) 1) 1) "name"
         2) "reserve"
         3) "description"
         4) (nil)
         5) "flags"
         6) (empty array)
      2) 1) "name"
         2) "peek"
         3) "description"
         4) "Read stock without modifying it"
         5) "flags"
         6) 1) "no-writes"
1) "running_script"
2) (nil)
3) "engines"
4) 1) "LUA"
   2) 1) "libraries_count"
      2) (integer) 1
      3) "functions_count"
      4) (integer) 2
(error) ERR Can not execute a script with write flag using *_ro command.</div>

<h3>Vận hành chúng</h3>
<pre><code>redis-cli FUNCTION LOAD REPLACE "$(cat /tmp/mylib.lua)"    <span class="tok-comment"># cập nhật tại chỗ</span>
redis-cli FUNCTION DUMP &gt; /tmp/functions.bin                <span class="tok-comment"># sao lưu mọi thư viện</span>
redis-cli FUNCTION DELETE inventory                         <span class="tok-comment"># gỡ một thư viện</span>
redis-cli -x FUNCTION RESTORE &lt; /tmp/functions.bin          <span class="tok-comment"># đưa chúng trở lại</span>
redis-cli FUNCTION LIST | head -4
redis-cli FUNCTION FLUSH                                    <span class="tok-comment"># gỡ TẤT CẢ — cẩn thận</span></code></pre>
<div class="out">inventory
OK
OK
1) 1) "library_name"
   2) "inventory"
   3) "engine"
   4) "LUA"
OK</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>LOAD</code> không kèm <code>REPLACE</code> sẽ hỏng nếu nó đã tồn tại</span><span class="v">Cố ý như vậy. Một script triển khai nên dùng <code>REPLACE</code>; một lần cài đặt đầu tiên thì không nên, để bạn phát hiện ra khi có hai thứ đang tranh nhau sở hữu cùng một tên thư viện.</span></div>
  <div class="kv"><span class="k">Việc nạp là nguyên tử theo từng thư viện</span><span class="v">Nếu bất kỳ hàm nào trong thư viện đăng ký không thành thì cả lần nạp bị từ chối và phiên bản cũ ở lại. Bạn không bao giờ rơi vào cảnh có nửa cái thư viện.</span></div>
  <div class="kv"><span class="k"><code>FUNCTION DUMP</code>/<code>RESTORE</code> là con đường di trú của bạn</span><span class="v">Chuyển sang một máy mới, hay gieo dữ liệu cho một môi trường thử, chỉ là một lần dump và một lần restore. <code>RESTORE</code> nhận một chính sách — <code>APPEND</code> (mặc định), <code>FLUSH</code>, hay <code>REPLACE</code> — nên hãy quyết định có chủ ý xem chuyện gì xảy ra với những thư viện đã có sẵn ở đó.</span></div>
  <div class="kv"><span class="k">Hãy để thư viện trong kho mã của bạn</span><span class="v">Nó là mã nguồn chạy ở production. Nó thuộc về git, thuộc về vòng duyệt mã, có bài kiểm, và được nạp bởi đường ống triển khai của bạn — chứ không phải được dán vào <code>redis-cli</code> bởi bất cứ ai đang trực.</span></div>
  <div class="kv"><span class="k">Một hàm đang chạy vẫn chặn tất cả</span><span class="v">Function không đồng thời hơn script chút nào. Mọi cảnh báo ở Bài 7.3 áp vào đây nguyên vẹn: giữ chúng ngắn, đừng bao giờ lặp qua một tập hợp lớn, và <code>FUNCTION STATS</code> cùng <code>FUNCTION KILL</code> là bản tương đương của <code>SCRIPT KILL</code>.</span></div>
</div>

<h3>Nên dùng cái nào</h3>
<pre><code><span class="tok-comment">// EVAL — thư viện khách lo hộ bạn phần nhớ đệm SHA và lỗi NOSCRIPT</span>
const RESERVE = &#96;local stock = tonumber(redis.call('GET', KEYS[1]) or 0) …&#96;;
await redis.eval(RESERVE, { keys: ['stock:4201'], arguments: ['3'] });

<span class="tok-comment">// FCALL — logic đã được triển khai riêng, ứng dụng chỉ việc gọi</span>
await redis.fCall('reserve', { keys: ['stock:4201', 'reserved:4201'],
                               arguments: ['3', 'order:88'] });</code></pre>
<div class="callout ok"><strong>Hãy dùng <code>EVAL</code> cho một script thuộc về một ứng dụng, và dùng Functions cho phần logic thật sự là một phần của tầng dữ liệu.</strong> Một phép nhả khoá năm dòng mà chỉ dịch vụ của bạn dùng thì không cần một bước triển khai, một cái tên thư viện và một lệnh nạp — <code>EVAL</code> với phần xử lý SHA tự động của thư viện khách vừa đơn giản hơn vừa chẳng có gì sai cả. Một phép giữ hàng tồn kho hai mươi dòng mà ba dịch vụ cùng gọi, phải cư xử y hệt nhau với cả ba, và phải sống sót qua một lần chuyển đổi mà không bên nào nhận ra — đó là một Function. Câu hỏi quyết định không phải là kích thước, mà là quyền sở hữu: nếu có nhiều hơn một kho mã phụ thuộc vào việc phần logic đó đúng chính xác thì nó nên có tên riêng, phiên bản riêng và lần triển khai riêng.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> mặc định rằng Redis của bạn có Functions. Chúng xuất hiện ở bản <strong>7.0</strong>, và khoảng cách giữa "Redis có thứ này" với "cái Redis mà tôi đang triển khai lên có thứ này" ở đây rộng hơn thường lệ: các dịch vụ có quản lý chậm hơn bản gốc cả năm trở lên, và một số cố tình tắt hẳn khả năng lập trình phía máy chủ vì lý do nhiều khách thuê chung — chính những máy hạn chế <code>EVAL</code> cũng sẽ không cho bạn <code>FUNCTION</code>. Kiểu hỏng nằm ở lúc chạy, dưới dạng <code>ERR unknown command 'FCALL'</code>, ngay trong nhánh mà bạn đã xây tính nguyên tử của mình lên đó. Hãy kiểm <code>redis-cli INFO server | grep redis_version</code> và <code>redis-cli COMMAND INFO fcall</code> trên <em>mọi</em> môi trường trước khi thiết kế xoay quanh nó. Còn một phiên bản thứ hai tinh vi hơn của cùng cái bẫy: vì các hàm được lưu trong RDB, một máy khôi phục từ bản sao lưu chụp trước khi thư viện của bạn tồn tại sẽ khởi động lên mà không có nó, và lệnh <code>FCALL</code> đầu tiên sau lần khôi phục ấy sẽ hỏng. Hãy đưa <code>FUNCTION LOAD REPLACE</code> thành một bước trong quy trình triển khai <em>và</em> trong sổ tay khôi phục của bạn, và hãy để ứng dụng hỏng thật to kèm một thông báo rõ ràng thay vì lùi về một đường không nguyên tử rồi âm thầm làm hỏng số liệu tồn kho.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/functions-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis Functions</span><span class="lc-sub">Bài giới thiệu: cấu trúc thư viện, <code>register_function</code>, danh sách cờ đầy đủ kèm việc mỗi cờ cho phép điều gì, và hướng dẫn chuyển từ <code>EVAL</code> sang.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/function-load/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">FUNCTION LOAD và họ hàng</span><span class="lc-sub">Trọn họ lệnh <code>FUNCTION</code> — <code>LIST</code>, <code>DUMP</code>, <code>RESTORE</code>, <code>STATS</code>, <code>KILL</code>, <code>FLUSH</code> — kèm các chính sách khôi phục và từng lệnh trả về gì.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đưa một thư viện hàm lên chạy</span><span class="lc-sub">Bài chấm điểm: chuyển một script <code>EVAL</code> thành thư viện, thêm cờ <code>no-writes</code> rồi chứng minh <code>FCALL_RO</code> chấp nhận nó, dump và restore qua các máy, và viết phép kiểm phiên bản hỏng thật to thay vì hỏng lặng lẽ.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Functions là Lua với một vòng đời khác: những thư viện có tên tồn tại lâu dài trong RDB, nhân bản sang bản sao và sống sót qua khởi động lại cùng chuyển đổi — điều đó gỡ bỏ việc quản lý SHA và trọn cái nhánh lùi cho <code>NOSCRIPT</code>. Khác biệt cú pháp thì nhỏ mà có thật: một dòng shebang <code>#!lua name=…</code> ở dòng một, hàm gọi lại nhận <code>(keys, args)</code> làm tham số thay cho các biến toàn cục <code>KEYS</code>/<code>ARGV</code>, và <code>register_function</code> để phơi chúng ra. Và lựa chọn nằm ở quyền sở hữu chứ không nằm ở kích thước: <code>EVAL</code> cho logic mà một dịch vụ sở hữu, Functions cho logic mà nhiều dịch vụ phụ thuộc vào — kèm một phép kiểm phiên bản trên mọi môi trường, vì 7.0 còn mới và các dịch vụ có quản lý thường tắt hẳn khả năng lập trình.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Distributed locks, and what they cannot promise|||7.5 — Khoá phân tán, và điều nó không thể hứa',
      slug: 'rd-7-5-khoa-phan-tan',
      type: 'LESSON',
      description: 'Khoá một máy viết cho đúng, vì sao TTL vừa bắt buộc vừa là gót chân Achilles, cuộc tranh luận Redlock nói thật, mã hàng rào là cách chữa duy nhất, và luật thực dụng: dùng khoá cho hiệu quả, đừng dùng cho tính đúng đắn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Distributed locks, and what they cannot promise</h2>
<p class="lead">"Use Redis as a distributed lock" is one of the most repeated pieces of advice in backend engineering, and one of the most misunderstood. A Redis lock is genuinely useful and genuinely cannot guarantee mutual exclusion. Both of those are true at once, and the gap between them is where the interesting failures live.</p>

<h3>First: do you need one?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Is there a single atomic command?</span><span class="lz-t">INCR · SETNX · ZADD GT · HSETNX</span><span class="lz-d">Half the locks people write are protecting an operation Redis already does atomically. "Only one winner" is <code>SET NX</code>. "Highest score wins" is <code>ZADD GT</code> (Lesson 4.3). No lock, no TTL, no failure modes.</span></div>
  <div class="lz-step"><span class="lz-k">Can it be a Lua script?</span><span class="lz-t">read, decide and write in one atomic unit</span><span class="lz-d">If everything you are protecting lives in Redis, a script (Lesson 7.3) <em>is</em> the critical section, and it cannot be interrupted, cannot expire mid-way, and cannot be held by a crashed process. Prefer this whenever it fits.</span></div>
  <div class="lz-step"><span class="lz-k">Does the real resource have its own transaction?</span><span class="lz-t">SELECT … FOR UPDATE · a unique constraint</span><span class="lz-d">If the thing being protected is a database row, the database can protect it — properly, with real serialisability. A Redis lock in front of a Postgres write is a weaker guard than the one Postgres already offers for free.</span></div>
  <div class="lz-step"><span class="lz-k">Is it about efficiency or correctness?</span><span class="lz-t">this is the question that decides everything</span><span class="lz-d">"Only one worker should send this email" — efficiency; a duplicate is annoying and survivable, and a Redis lock is perfect. "Only one worker may decrement this balance" — correctness; a duplicate is a financial incident, and a Redis lock is <em>not</em> sufficient. The rest of this lesson is why.</span></div>
</div>

<h3>The single-instance lock, written correctly</h3>
<pre><code>const RELEASE = &#96;
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0&#96;;

async function withLock(name, ttlMs, fn) {
  const key   = &#96;lock:\${name}&#96;;
  const token = crypto.randomUUID();

  <span class="tok-comment">// Acquire: NX so only one wins, PX so a dead holder cannot block forever</span>
  const got = await redis.set(key, token, { NX: true, PX: ttlMs });
  if (!got) return { acquired: false };

  try {
    return { acquired: true, value: await fn() };
  } finally {
    <span class="tok-comment">// Release: only if the token still matches — never a bare DEL</span>
    await redis.eval(RELEASE, { keys: [key], arguments: [token] });
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> gives mutual exclusion</span><span class="v">Exactly one caller gets <code>OK</code>. This part is solid — Redis is single-threaded, so there is no race in the acquire itself.</span></div>
  <div class="kv"><span class="k"><code>PX</code> prevents deadlock</span><span class="v">If the holder crashes, the lock expires and someone else can proceed. Without a TTL, one crashed process blocks the operation forever. This is mandatory — and it is also the source of every problem below.</span></div>
  <div class="kv"><span class="k">The token prevents releasing someone else's lock</span><span class="v">If your work overruns the TTL, the lock expires, another worker acquires it, and a bare <code>DEL</code> in your <code>finally</code> deletes <em>theirs</em>. Check-then-delete must be atomic, hence Lua (Lesson 7.3).</span></div>
  <div class="kv"><span class="k">Set the TTL longer than the work, not shorter</span><span class="v">And measure the work's p99, not its average. A TTL shorter than the tail is a lock that routinely expires under its holder — which is the failure that looks like a heisenbug.</span></div>
  <div class="kv"><span class="k">Decide what a failed acquire means</span><span class="v">Return immediately? Retry with backoff? Block? All three are valid and they are different products. An unbounded retry loop on a hot lock is the livelock from Lesson 7.2 in a different costume.</span></div>
</div>

<h3>The problem TTL cannot solve</h3>
<pre><code><span class="tok-comment"># Worker A                        # Worker B</span>
t=0    SET lock:x tokA NX PX 10000  <span class="tok-comment"># A holds the lock, 10s</span>
t=1    …starts work…
t=2    ─── STOP-THE-WORLD GC PAUSE, 12 SECONDS ───
t=10                               <span class="tok-comment"># lock:x expires. Nobody deleted it.</span>
t=11                                 SET lock:x tokB NX PX 10000   <span class="tok-comment"># B acquires</span>
t=12                                 …starts work…
t=14   …resumes, believes it holds the lock…
       BOTH A AND B ARE NOW IN THE CRITICAL SECTION</code></pre>
<div class="callout warn"><strong>No amount of Redis configuration fixes this, and it is not a Redis bug.</strong> A lock with a timeout assumes the holder notices time passing, and a process that is paused — by a stop-the-world garbage collection, a hypervisor suspending the VM, a container throttled to zero CPU, a machine that swapped to disk — does not notice anything. It wakes up believing it still holds a lock that expired eight seconds ago. Every distributed lock built on timeouts has this property. It is the core of Martin Kleppmann's 2016 critique "How to do distributed locking", and antirez's reply is worth reading beside it: the disagreement is less about the mechanism than about what people believe they are buying.</div>

<h3>Fencing tokens: the actual fix</h3>
<pre><code><span class="tok-comment">// Every acquire gets a monotonically increasing number</span>
const fence = await redis.incr('lock:x:fence');
const got   = await redis.set('lock:x', token, { NX: true, PX: 10000 });

<span class="tok-comment">// …and the PROTECTED RESOURCE rejects anything stale</span>
await db.$executeRaw&#96;
  UPDATE inventory SET qty = qty - 1, fence = \${fence}
  WHERE sku = \${sku} AND fence &lt; \${fence}&#96;;
<span class="tok-comment">// A resumes with fence=41, B already wrote fence=42 → A's UPDATE matches</span>
<span class="tok-comment">// zero rows and A's write is rejected. Correct even though both held "the lock".</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The token must be monotonic</span><span class="lz-lnote">An <code>INCR</code> beside the lock gives you one. Every acquire gets a strictly larger number than every previous acquire, so "who is newer" is a total order that a paused process cannot fake.</span></div>
  <div class="lz-layer"><span class="lz-lname">The resource must check it</span><span class="lz-lnote">This is the catch, and it is why fencing is rarer than it should be: the guarantee lives in the <em>protected system</em>, not in the lock. A database can do it with a <code>WHERE fence &lt; ?</code>. A file system, a payment API or a third-party webhook usually cannot, and then no lock design saves you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Once you have fencing, you barely need the lock</span><span class="lz-lnote">If the resource rejects stale writes, correctness no longer depends on mutual exclusion — the lock is back to being an efficiency optimisation that stops two workers doing the same expensive job. Which is exactly what a Redis lock is good at.</span></div>
</div>

<h3>Redlock, honestly</h3>
<pre><code><span class="tok-comment"># Redlock: acquire the same lock on N independent Redis masters (typically 5)</span>
<span class="tok-comment"># Success = a majority (3 of 5) granted it AND elapsed time &lt; TTL</span>
<span class="tok-comment"># The idea: one node failing over or restarting cannot lose your lock alone.</span>
redis-cli -p 6379 SET lock:x tok NX PX 10000
redis-cli -p 6380 SET lock:x tok NX PX 10000
redis-cli -p 6381 SET lock:x tok NX PX 10000</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What it genuinely fixes</span><span class="v">A single-instance lock is lost if that instance restarts or fails over before the lock replicates — the new primary simply does not have it, and a second worker acquires it cleanly. A majority across independent masters removes that specific hole.</span></div>
  <div class="kv"><span class="k">What it does not fix</span><span class="v">The GC pause above. Clock jumps. A process suspended mid-critical-section. Redlock still hands out a lease bounded by wall-clock time, so every timing-based failure survives intact.</span></div>
  <div class="kv"><span class="k">The cost is real</span><span class="v">Five independent Redis masters — not a primary with replicas, which defeats the point — plus a client that measures its own elapsed time and gives up correctly. That is meaningful infrastructure for a guarantee that is still not mutual exclusion.</span></div>
  <div class="kv"><span class="k">The honest recommendation</span><span class="v">If duplicates are survivable, one Redis instance with <code>SET NX PX</code> is enough and Redlock is over-engineering. If duplicates are not survivable, Redlock is not enough either — you need fencing or a real consensus system (etcd, ZooKeeper, or your database).</span></div>
  <div class="kv"><span class="k">Do not write it yourself</span><span class="v">The algorithm has subtleties — clock drift allowance, elapsed-time checks, unlocking every node on failure. Use a maintained library (<code>node-redlock</code>, Redisson) if you use it at all.</span></div>
</div>

<h3>Extending a lock you still need</h3>
<pre><code>const EXTEND = &#96;
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('PEXPIRE', KEYS[1], ARGV[2])
  end
  return 0&#96;;

<span class="tok-comment">// A watchdog that renews while the work is still running…</span>
const timer = setInterval(async () =&gt; {
  const ok = await redis.eval(EXTEND, { keys: [key], arguments: [token, '10000'] });
  if (ok === 0) abortWork('lock lost');     <span class="tok-comment">// ← the important half</span>
}, 3000);</code></pre>
<div class="callout ok"><strong>A watchdog is worth having, and the half that matters is the failure branch.</strong> Renewing every TTL/3 lets you set a short TTL — so a crashed holder is detected quickly — while long jobs still finish. But renewal can <em>fail</em>: if the extend script returns 0, your token is no longer there, which means the lock expired and someone else took it. At that instant you are the one who should stop. A watchdog that renews and ignores the result is worse than no watchdog, because it makes the holder more confident while making it no more correct.</div>

<div class="pitfall"><strong>Pitfall:</strong> using a lock where idempotency was the real answer. Locks are seductive because they promise that a dangerous operation happens once, and they cannot actually deliver that — the pause above breaks every timeout-based design, and the failure is rare enough to survive testing and reach production. The more robust move is usually to make the operation safe to run twice: a unique constraint on <code>(order_id)</code> so the second insert fails, an idempotency key on the payment call so the provider deduplicates, a <code>WHERE status = 'pending'</code> on the update so the second one matches zero rows, or the <code>SADD</code> return value as a "have I done this?" check (Lesson 4.2). Then a lock becomes what it is genuinely good at — stopping two workers from doing the same expensive job at the same time — and correctness rests on something that does not depend on any process noticing time pass. If you take one rule from this chapter: <strong>locks for efficiency, idempotency and constraints for correctness.</strong></div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/patterns/distributed-locks/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Distributed locks with Redis</span><span class="lc-sub">The official page, including the correct single-instance recipe, the full Redlock algorithm, and — to Redis's credit — a section linking directly to the criticism of it.</span></span>
</a>
<a class="link-card" href="https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">How to do distributed locking</span><span class="lc-sub">Kleppmann's critique, where fencing tokens come from, and the clearest explanation anywhere of why a timeout-based lease is not mutual exclusion. Read antirez's reply after it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: locks and their alternatives</span><span class="lc-sub">Graded exercises: write acquire/release/extend correctly, find the bug in three lock implementations, add fencing to a protected write, and rewrite two "needs a lock" operations as idempotent ones that do not.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Before writing a lock, check whether a single atomic command, a Lua script, or the database's own transaction already does the job — most locks in the wild are guarding something Redis or Postgres was already guarding. When you do write one, it is <code>SET key token NX PX ttl</code> to acquire and a Lua compare-and-delete to release, never a bare <code>DEL</code>. And the guarantee is a lease, not mutual exclusion: a paused process wakes up believing it still holds an expired lock, which no TTL, no Redlock and no configuration prevents — so use locks for efficiency and get correctness from fencing tokens, unique constraints or idempotency keys.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Khoá phân tán, và điều nó không thể hứa</h2>
<p class="lead">"Dùng Redis làm khoá phân tán" là một trong những lời khuyên được nhắc lại nhiều nhất trong nghề backend, và cũng là một trong những lời khuyên bị hiểu sai nhiều nhất. Một cái khoá Redis vừa thật sự hữu ích vừa thật sự không bảo đảm được loại trừ lẫn nhau. Cả hai điều đó đúng cùng lúc, và khoảng cách giữa chúng chính là nơi những kiểu hỏng thú vị sinh sống.</p>

<h3>Trước tiên: bạn có cần nó không?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Có lệnh nguyên tử đơn nào không?</span><span class="lz-t">INCR · SETNX · ZADD GT · HSETNX</span><span class="lz-d">Một nửa số khoá người ta viết ra là để bảo vệ một phép mà Redis vốn đã làm nguyên tử. "Chỉ một người thắng" chính là <code>SET NX</code>. "Điểm cao nhất thắng" chính là <code>ZADD GT</code> (Bài 4.3). Không khoá, không TTL, không có kiểu hỏng nào.</span></div>
  <div class="lz-step"><span class="lz-k">Có thể làm bằng một script Lua không?</span><span class="lz-t">đọc, quyết và ghi trong một khối nguyên tử</span><span class="lz-d">Nếu mọi thứ bạn đang bảo vệ đều nằm trong Redis thì một script (Bài 7.3) <em>chính là</em> vùng tới hạn, và nó không thể bị ngắt, không thể hết hạn giữa chừng, và không thể bị một tiến trình đã chết giữ mất. Hãy ưu tiên cách này bất cứ khi nào nó vừa.</span></div>
  <div class="lz-step"><span class="lz-k">Cái tài nguyên thật có giao dịch riêng không?</span><span class="lz-t">SELECT … FOR UPDATE · một ràng buộc duy nhất</span><span class="lz-d">Nếu thứ được bảo vệ là một dòng cơ sở dữ liệu thì cơ sở dữ liệu bảo vệ được nó — bảo vệ tử tế, với tính tuần tự hoá thật. Một cái khoá Redis đặt trước một lượt ghi Postgres là một hàng rào yếu hơn cái mà Postgres vốn đã cho không.</span></div>
  <div class="lz-step"><span class="lz-k">Chuyện này là về hiệu quả hay về tính đúng đắn?</span><span class="lz-t">đây là câu hỏi quyết định tất cả</span><span class="lz-d">"Chỉ một worker được gửi cái email này" — hiệu quả; một bản trùng thì phiền nhưng sống được, và một cái khoá Redis là hoàn hảo. "Chỉ một worker được phép trừ số dư này" — tính đúng đắn; một bản trùng là một sự cố tài chính, và một cái khoá Redis <em>không</em> đủ. Phần còn lại của bài này giải thích vì sao.</span></div>
</div>

<h3>Khoá một máy, viết cho đúng</h3>
<pre><code>const RELEASE = &#96;
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0&#96;;

async function withLock(name, ttlMs, fn) {
  const key   = &#96;lock:\${name}&#96;;
  const token = crypto.randomUUID();

  <span class="tok-comment">// Giành: NX để chỉ một bên thắng, PX để kẻ giữ đã chết không chặn mãi mãi</span>
  const got = await redis.set(key, token, { NX: true, PX: ttlMs });
  if (!got) return { acquired: false };

  try {
    return { acquired: true, value: await fn() };
  } finally {
    <span class="tok-comment">// Nhả: chỉ khi mã thông báo vẫn khớp — đừng bao giờ dùng DEL trơn</span>
    await redis.eval(RELEASE, { keys: [key], arguments: [token] });
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> cho bạn sự loại trừ lẫn nhau</span><span class="v">Đúng một bên gọi nhận được <code>OK</code>. Phần này thì chắc chắn — Redis đơn luồng, nên không có cuộc đua nào ở ngay bước giành khoá.</span></div>
  <div class="kv"><span class="k"><code>PX</code> ngăn bế tắc</span><span class="v">Nếu kẻ giữ khoá sập, cái khoá hết hạn và người khác đi tiếp được. Không có TTL thì một tiến trình sập chặn cả phép đó mãi mãi. Cái này là bắt buộc — và nó cũng là nguồn của mọi vấn đề ở dưới.</span></div>
  <div class="kv"><span class="k">Mã thông báo ngăn việc nhả khoá của người khác</span><span class="v">Nếu công việc của bạn chạy quá TTL thì khoá hết hạn, một worker khác giành được nó, và một lệnh <code>DEL</code> trơn trong khối <code>finally</code> của bạn xoá mất khoá <em>của họ</em>. Kiểm-rồi-xoá phải nguyên tử, nên mới cần Lua (Bài 7.3).</span></div>
  <div class="kv"><span class="k">Đặt TTL dài hơn công việc, đừng ngắn hơn</span><span class="v">Và hãy đo p99 của công việc, đừng đo trung bình. Một TTL ngắn hơn cái đuôi là một cái khoá thường xuyên hết hạn ngay dưới chân kẻ đang giữ nó — đó là kiểu hỏng trông như lỗi ma.</span></div>
  <div class="kv"><span class="k">Hãy quyết xem giành khoá thất bại nghĩa là gì</span><span class="v">Trả về ngay? Thử lại có nhịp lùi? Chờ? Cả ba đều hợp lệ và chúng là ba sản phẩm khác nhau. Một vòng lặp thử lại không giới hạn trên một cái khoá nóng chính là cái khoá sống ở Bài 7.2 mặc bộ đồ khác.</span></div>
</div>

<h3>Bài toán mà TTL không giải được</h3>
<pre><code><span class="tok-comment"># Worker A                        # Worker B</span>
t=0    SET lock:x tokA NX PX 10000  <span class="tok-comment"># A giữ khoá, 10 giây</span>
t=1    …bắt đầu làm việc…
t=2    ─── NHỊP DỌN RÁC DỪNG-CẢ-THẾ-GIỚI, 12 GIÂY ───
t=10                               <span class="tok-comment"># lock:x hết hạn. Không ai xoá nó cả.</span>
t=11                                 SET lock:x tokB NX PX 10000   <span class="tok-comment"># B giành được</span>
t=12                                 …bắt đầu làm việc…
t=14   …tỉnh lại, tin rằng mình vẫn giữ khoá…
       CẢ A LẪN B GIỜ ĐỀU NẰM TRONG VÙNG TỚI HẠN</code></pre>
<div class="callout warn"><strong>Không cấu hình Redis nào chữa được chuyện này, và nó không phải lỗi của Redis.</strong> Một cái khoá có hạn giờ giả định rằng kẻ giữ nó nhận ra thời gian đang trôi, còn một tiến trình bị tạm dừng — bởi một nhịp dọn rác dừng-cả-thế-giới, bởi một trình ảo hoá treo cái máy ảo lại, bởi một container bị bóp về 0 CPU, bởi một máy vừa tráo ra đĩa — thì chẳng nhận ra gì cả. Nó tỉnh dậy và tin rằng mình vẫn giữ một cái khoá đã hết hạn tám giây trước. Mọi khoá phân tán xây trên hạn giờ đều có tính chất này. Đó là cốt lõi bài phê bình năm 2016 của Martin Kleppmann, "How to do distributed locking", và bài đáp lại của antirez đáng đọc kèm bên cạnh: chỗ bất đồng nằm ở việc người ta tin mình đang mua cái gì, hơn là nằm ở cơ chế.</div>

<h3>Mã hàng rào: cách chữa thật sự</h3>
<pre><code><span class="tok-comment">// Mỗi lần giành khoá đều nhận một con số tăng đơn điệu</span>
const fence = await redis.incr('lock:x:fence');
const got   = await redis.set('lock:x', token, { NX: true, PX: 10000 });

<span class="tok-comment">// …và CÁI TÀI NGUYÊN ĐƯỢC BẢO VỆ từ chối mọi thứ đã cũ</span>
await db.$executeRaw&#96;
  UPDATE inventory SET qty = qty - 1, fence = \${fence}
  WHERE sku = \${sku} AND fence &lt; \${fence}&#96;;
<span class="tok-comment">// A tỉnh lại với fence=41, B đã ghi fence=42 rồi → lệnh UPDATE của A khớp</span>
<span class="tok-comment">// 0 dòng và lượt ghi của A bị từ chối. Đúng đắn dù cả hai đều "giữ khoá".</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mã hàng rào phải tăng đơn điệu</span><span class="lz-lnote">Một lệnh <code>INCR</code> đặt cạnh cái khoá là đủ. Mỗi lần giành khoá nhận một số lớn hẳn hơn mọi lần giành trước, nên "ai mới hơn" là một thứ tự toàn phần mà một tiến trình bị tạm dừng không giả mạo được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái tài nguyên phải kiểm nó</span><span class="lz-lnote">Đây là chỗ khó, và là lý do hàng rào hiếm gặp hơn mức đáng ra: bảo đảm nằm ở <em>hệ thống được bảo vệ</em>, không nằm ở cái khoá. Một cơ sở dữ liệu làm được bằng <code>WHERE fence &lt; ?</code>. Một hệ tệp, một API thanh toán hay một webhook của bên thứ ba thì thường không làm được, và lúc đó không thiết kế khoá nào cứu bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khi đã có hàng rào thì bạn gần như không cần cái khoá nữa</span><span class="lz-lnote">Nếu tài nguyên từ chối các lượt ghi đã cũ thì tính đúng đắn không còn phụ thuộc vào sự loại trừ lẫn nhau nữa — cái khoá quay về đúng vai một phép tối ưu hiệu quả, ngăn hai worker cùng làm một việc đắt đỏ. Mà đó đúng là thứ khoá Redis giỏi.</span></div>
</div>

<h3>Redlock, nói thật</h3>
<pre><code><span class="tok-comment"># Redlock: giành cùng một khoá trên N máy chủ Redis độc lập (thường là 5)</span>
<span class="tok-comment"># Thành công = đa số (3 trên 5) cấp cho VÀ thời gian trôi qua &lt; TTL</span>
<span class="tok-comment"># Ý tưởng: một nút chuyển đổi hay khởi động lại thì không làm mất khoá của bạn.</span>
redis-cli -p 6379 SET lock:x tok NX PX 10000
redis-cli -p 6380 SET lock:x tok NX PX 10000
redis-cli -p 6381 SET lock:x tok NX PX 10000</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó thật sự chữa được cái gì</span><span class="v">Một cái khoá trên một máy sẽ mất nếu máy đó khởi động lại hay chuyển đổi trước khi khoá kịp nhân bản — bản chính mới đơn giản là không có nó, và một worker thứ hai giành được nó một cách sạch sẽ. Đa số trên các bản chính độc lập gỡ bỏ đúng cái lỗ đó.</span></div>
  <div class="kv"><span class="k">Nó không chữa được cái gì</span><span class="v">Nhịp dọn rác ở trên. Đồng hồ nhảy. Một tiến trình bị treo giữa vùng tới hạn. Redlock vẫn phát ra một hợp đồng thuê bị chặn bởi thời gian đồng hồ treo tường, nên mọi kiểu hỏng dựa trên thời gian đều sống sót nguyên vẹn.</span></div>
  <div class="kv"><span class="k">Cái giá là có thật</span><span class="v">Năm máy chủ Redis chính độc lập — không phải một bản chính kèm bản sao, vì thế thì mất luôn ý nghĩa — cộng một thư viện khách biết tự đo thời gian trôi qua của chính nó và biết bỏ cuộc cho đúng. Đó là một khối hạ tầng đáng kể để đổi lấy một bảo đảm vẫn không phải là loại trừ lẫn nhau.</span></div>
  <div class="kv"><span class="k">Lời khuyên thành thật</span><span class="v">Nếu bản trùng sống được thì một máy Redis với <code>SET NX PX</code> là đủ và Redlock là làm quá. Nếu bản trùng không sống được thì Redlock cũng không đủ nốt — bạn cần hàng rào hoặc một hệ đồng thuận thật (etcd, ZooKeeper, hoặc chính cơ sở dữ liệu của bạn).</span></div>
  <div class="kv"><span class="k">Đừng tự viết nó</span><span class="v">Thuật toán có những chỗ tinh tế — mức bù cho lệch đồng hồ, phép kiểm thời gian trôi qua, việc mở khoá ở mọi nút khi thất bại. Nếu dùng thì hãy dùng một thư viện có người bảo trì (<code>node-redlock</code>, Redisson).</span></div>
</div>

<h3>Kéo dài một cái khoá bạn vẫn còn cần</h3>
<pre><code>const EXTEND = &#96;
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('PEXPIRE', KEYS[1], ARGV[2])
  end
  return 0&#96;;

<span class="tok-comment">// Một con chó canh gia hạn trong lúc công việc còn đang chạy…</span>
const timer = setInterval(async () =&gt; {
  const ok = await redis.eval(EXTEND, { keys: [key], arguments: [token, '10000'] });
  if (ok === 0) abortWork('lock lost');     <span class="tok-comment">// ← nửa quan trọng nằm ở đây</span>
}, 3000);</code></pre>
<div class="callout ok"><strong>Một con chó canh thì đáng có, và cái nửa quan trọng chính là nhánh thất bại.</strong> Gia hạn mỗi TTL/3 cho phép bạn đặt TTL ngắn — nhờ vậy một kẻ giữ khoá bị sập được phát hiện nhanh — trong khi những việc dài vẫn chạy xong. Nhưng phép gia hạn <em>có thể hỏng</em>: nếu script kéo dài trả về 0 thì mã thông báo của bạn không còn ở đó nữa, nghĩa là khoá đã hết hạn và người khác đã lấy mất. Ngay khoảnh khắc ấy bạn mới là kẻ phải dừng lại. Một con chó canh chỉ biết gia hạn mà bỏ qua kết quả thì còn tệ hơn không có con chó nào, vì nó làm kẻ giữ khoá tự tin hơn mà chẳng đúng đắn hơn chút nào.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> dùng khoá ở nơi mà đáp án thật sự là tính lặp-lại-vô-hại. Khoá thì quyến rũ vì nó hứa rằng một phép nguy hiểm chỉ xảy ra một lần, mà nó lại không thật sự giao được lời hứa ấy — nhịp tạm dừng ở trên phá vỡ mọi thiết kế dựa trên hạn giờ, và kiểu hỏng đó đủ hiếm để sống sót qua kiểm thử rồi lên tới production. Nước đi bền vững hơn thường là làm cho phép đó chạy hai lần vẫn an toàn: một ràng buộc duy nhất trên <code>(order_id)</code> để lần chèn thứ hai thất bại, một khoá chống trùng trên lời gọi thanh toán để nhà cung cấp tự khử trùng, một mệnh đề <code>WHERE status = 'pending'</code> trên lệnh cập nhật để lần thứ hai khớp 0 dòng, hoặc dùng giá trị trả về của <code>SADD</code> làm phép kiểm "tôi làm việc này chưa?" (Bài 4.2). Khi đó cái khoá trở về đúng thứ nó thật sự giỏi — ngăn hai worker cùng làm một việc đắt đỏ cùng lúc — và tính đúng đắn tựa vào một thứ không phụ thuộc vào việc tiến trình nào đó có nhận ra thời gian trôi hay không. Nếu bạn chỉ lấy một luật từ chương này: <strong>khoá là để hiệu quả, còn tính lặp-lại-vô-hại và các ràng buộc mới là để đúng đắn.</strong></div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/patterns/distributed-locks/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Distributed locks with Redis</span><span class="lc-sub">Trang chính thức, gồm công thức đúng cho khoá một máy, thuật toán Redlock đầy đủ, và — đáng ghi nhận cho Redis — một mục dẫn thẳng tới bài phê bình nó.</span></span>
</a>
<a class="link-card" href="https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">How to do distributed locking</span><span class="lc-sub">Bài phê bình của Kleppmann, nơi khái niệm mã hàng rào ra đời, và lời giải thích rõ ràng nhất ở bất cứ đâu về việc vì sao một hợp đồng thuê dựa trên hạn giờ không phải là loại trừ lẫn nhau. Hãy đọc bài đáp của antirez ngay sau đó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: khoá và những thứ thay thế nó</span><span class="lc-sub">Bài chấm điểm: viết đúng phần giành/nhả/kéo dài, tìm lỗi trong ba bản cài đặt khoá, thêm hàng rào vào một lượt ghi được bảo vệ, và viết lại hai phép "cần khoá" thành hai phép lặp-lại-vô-hại không cần khoá.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Trước khi viết một cái khoá, hãy kiểm xem một lệnh nguyên tử đơn, một script Lua, hay chính giao dịch của cơ sở dữ liệu đã làm được việc đó chưa — phần lớn khoá ngoài đời đang canh gác thứ mà Redis hoặc Postgres vốn đã canh sẵn. Khi bạn thật sự viết một cái, nó là <code>SET key token NX PX ttl</code> để giành và một phép so-sánh-rồi-xoá bằng Lua để nhả, không bao giờ là một lệnh <code>DEL</code> trơn. Và cái bảo đảm ở đây là một hợp đồng thuê, không phải loại trừ lẫn nhau: một tiến trình bị tạm dừng tỉnh dậy và tin rằng nó vẫn giữ một cái khoá đã hết hạn, điều mà không TTL nào, không Redlock nào và không cấu hình nào ngăn được — nên hãy dùng khoá cho hiệu quả và lấy tính đúng đắn từ mã hàng rào, ràng buộc duy nhất hoặc khoá chống trùng.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Quiz: atomicity|||7.6 — Trắc nghiệm: tính nguyên tử',
      slug: 'rd-7-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về việc MULTI không quay lui, hai loại lỗi, EXEC trả nil, KEYS với ARGV, luật chuyển đổi kiểu của Lua, vòng đời của Functions, và điều một khoá phân tán không hứa được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the four tools and the one problem none of them fully solves. Three of these are about guarantees people believe they have and do not.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: what <code>MULTI</code> does on a runtime error (7.1), what a nil <code>EXEC</code> means (7.2), why every key must be in <code>KEYS</code> (7.3), and why a TTL-based lock is a lease and not mutual exclusion (7.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về bốn công cụ và một bài toán mà không cái nào giải trọn. Ba câu trong đó nói về những bảo đảm mà người ta tin là mình có nhưng thật ra không có.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: <code>MULTI</code> làm gì khi gặp lỗi lúc chạy (7.1), <code>EXEC</code> trả nil nghĩa là gì (7.2), vì sao mọi khoá phải nằm trong <code>KEYS</code> (7.3), và vì sao một cái khoá dựa trên TTL là hợp đồng thuê chứ không phải loại trừ lẫn nhau (7.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Inside a MULTI block, command 2 of 4 fails at runtime with a WRONGTYPE error. What happens to commands 3 and 4?|||Trong một khối MULTI, lệnh thứ 2 trên 4 hỏng lúc chạy với lỗi WRONGTYPE. Chuyện gì xảy ra với lệnh 3 và 4?',
            options: [
              'They are skipped and everything already applied is rolled back, like a SQL transaction|||Chúng bị bỏ qua và mọi thứ đã áp dụng được quay lui, giống một giao dịch SQL',
              'They run normally. Redis has no rollback at all: EXEC executes every queued command and reports each result independently, so you get a partial result you must find by checking every element of the reply array|||Chúng chạy bình thường. Redis hoàn toàn không có quay lui: EXEC thực thi mọi lệnh đã xếp hàng và báo cáo từng kết quả độc lập, nên bạn nhận một kết quả nửa vời phải tự tìm bằng cách kiểm mọi phần tử của mảng trả về',
              'They are skipped, and EXEC returns EXECABORT|||Chúng bị bỏ qua, và EXEC trả về EXECABORT',
              'The connection is closed to prevent an inconsistent state|||Kết nối bị đóng lại để ngăn một trạng thái không nhất quán',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can you not write "GET the stock, and only DECR if it is above zero" using MULTI alone?|||Vì sao bạn không thể viết "GET tồn kho, và chỉ DECR nếu nó trên 0" chỉ bằng MULTI?',
            options: [
              'Because GET is a read command and MULTI only accepts writes|||Vì GET là lệnh đọc còn MULTI chỉ nhận lệnh ghi',
              'Because MULTI blocks are limited to a single key|||Vì khối MULTI bị giới hạn trong một khoá duy nhất',
              'Because commands are QUEUED before any of them run, so there is no point at which your application can see the value and choose what to send next — and reading before MULTI reopens the race|||Vì các lệnh được XẾP HÀNG trước khi bất kỳ cái nào chạy, nên không có thời điểm nào ứng dụng của bạn nhìn thấy giá trị rồi chọn gửi gì tiếp — và đọc trước MULTI thì mở lại đúng cuộc đua đó',
              'Because DECR is not allowed inside a transaction without WATCH|||Vì DECR không được phép nằm trong giao dịch nếu không có WATCH',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You WATCH a key, read it, MULTI, queue a write, and EXEC returns nil. What does that mean and what must your code do?|||Bạn WATCH một khoá, đọc nó, MULTI, xếp hàng một lệnh ghi, và EXEC trả về nil. Điều đó nghĩa là gì và mã của bạn phải làm gì?',
            options: [
              'The transaction succeeded but returned no values; carry on|||Giao dịch thành công nhưng không trả về giá trị nào; cứ đi tiếp',
              'The watched key changed since you watched it, so NOTHING ran — you must go back to the top, WATCH again, re-read and retry|||Khoá được canh đã đổi kể từ lúc bạn canh, nên KHÔNG có gì chạy cả — bạn phải quay lên đầu, WATCH lại, đọc lại và thử lại',
              'The connection dropped mid-transaction and the result is unknown|||Kết nối rớt giữa giao dịch và kết quả là không xác định',
              'The queued write was rejected because of a type error|||Lệnh ghi đã xếp hàng bị từ chối vì một lỗi kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Fifty clients decrement one key using a WATCH retry loop, versus the same workload as a Lua script. What does the measurement show, and why?|||Năm mươi khách cùng giảm một khoá bằng vòng lặp thử lại WATCH, so với cùng khối lượng đó gói trong một script Lua. Phép đo cho thấy gì, và vì sao?',
            options: [
              'WATCH wins, because optimistic concurrency avoids the script parsing overhead|||WATCH thắng, vì kiểm soát đồng thời lạc quan tránh được chi phí phân tích script',
              'They are equivalent, since both ultimately serialise on the single-threaded server|||Chúng tương đương, vì rốt cuộc cả hai đều bị tuần tự hoá trên máy chủ đơn luồng',
              'Lua wins by a wide margin: WATCH shows large retry amplification (about 4x the EXEC calls, p99 of 41 retries, some clients giving up), because optimistic concurrency is a bet that conflicts are rare and a hot key breaks that bet|||Lua thắng cách biệt lớn: WATCH cho thấy mức khuếch đại thử lại rất cao (khoảng gấp 4 lần số lời gọi EXEC, p99 là 41 lần thử lại, vài khách bỏ cuộc), vì kiểm soát đồng thời lạc quan là ván cược rằng xung đột hiếm và một khoá nóng phá vỡ ván cược đó',
              'Lua wins, but only because it uses fewer network round trips; the retry counts are the same|||Lua thắng, nhưng chỉ vì nó dùng ít vòng đi-về mạng hơn; số lần thử lại thì như nhau',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A Lua script does `redis.call("GET", "user:" .. ARGV[1])` instead of taking the key through KEYS. What breaks?|||Một script Lua chạy `redis.call("GET", "user:" .. ARGV[1])` thay vì nhận khoá qua KEYS. Cái gì hỏng?',
            options: [
              'It works on a single node and breaks silently in Cluster, because Redis routes the script to a node based on the DECLARED keys — a key built inside the script is looked up on the wrong node|||Nó chạy được trên một nút và vỡ âm thầm trong Cluster, vì Redis định tuyến script tới một nút dựa trên các khoá ĐÃ KHAI BÁO — một khoá ghép bên trong script sẽ bị tra cứu ở sai nút',
              'Nothing — KEYS and ARGV are interchangeable, the split is a style convention|||Không sao — KEYS và ARGV thay thế được cho nhau, việc tách ra chỉ là quy ước phong cách',
              'Lua string concatenation is not allowed inside redis.call, so the script fails to load|||Phép nối chuỗi của Lua không được phép nằm trong redis.call, nên script không nạp được',
              'The script loses atomicity, because keys not in KEYS are not locked|||Script mất tính nguyên tử, vì các khoá không nằm trong KEYS thì không được khoá lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Lua script computes an average and does `return total / count`, where the result is 4.8. What does the client receive?|||Một script Lua tính trung bình rồi chạy `return total / count`, với kết quả là 4,8. Thư viện khách nhận được gì?',
            options: [
              'The string "4.8", since Redis converts all Lua numbers to bulk strings|||Chuỗi "4.8", vì Redis chuyển mọi số Lua thành chuỗi',
              'A protocol error, because Redis has no floating-point reply type|||Một lỗi giao thức, vì Redis không có kiểu trả về dấu phẩy động',
              'The double 4.8, preserved exactly by RESP3|||Số double 4,8, được RESP3 giữ nguyên chính xác',
              'The integer 4 — Lua numbers are truncated on the way out, silently. The fix is `return tostring(total / count)` and parsing on the client|||Số nguyên 4 — số Lua bị cắt cụt trên đường ra, một cách âm thầm. Cách chữa là `return tostring(total / count)` rồi phân tích ở phía khách',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'What is the main operational advantage of a Redis Function over an EVAL script?|||Lợi thế vận hành chính của một Redis Function so với một script EVAL là gì?',
            options: [
              'Functions run in a separate thread, so they do not block the server|||Function chạy ở một luồng riêng, nên chúng không chặn máy chủ',
              'Functions persist in the RDB and replicate to replicas, so they survive restarts and failovers — which removes SHA management and the entire NOSCRIPT fallback path|||Function tồn tại lâu dài trong RDB và nhân bản sang các bản sao, nên chúng sống sót qua khởi động lại và chuyển đổi — điều đó gỡ bỏ việc quản lý SHA và trọn cái nhánh lùi cho NOSCRIPT',
              'Functions can be written in JavaScript as well as Lua|||Function viết được bằng JavaScript chứ không chỉ Lua',
              'Functions are exempt from the busy-reply-threshold, so long-running logic is safe|||Function được miễn trừ khỏi busy-reply-threshold, nên logic chạy lâu là an toàn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Worker A holds `lock:x` with a 10-second TTL, then suffers a 12-second GC pause. Worker B acquires the lock at t=11. At t=14 A resumes and continues its work. What is the right conclusion?|||Worker A giữ `lock:x` với TTL 10 giây, rồi dính một nhịp dọn rác 12 giây. Worker B giành được khoá lúc t=11. Lúc t=14, A tỉnh lại và làm tiếp công việc của nó. Kết luận đúng là gì?',
            options: [
              'A bug in the release script — A should have detected the expiry when it resumed|||Một lỗi trong script nhả khoá — A đáng lẽ phải phát hiện việc hết hạn khi tỉnh lại',
              'A Redis replication bug that Redlock across five masters would fix|||Một lỗi nhân bản của Redis mà Redlock trên năm bản chính sẽ chữa được',
              'A configuration mistake: the TTL should simply have been longer than any possible pause|||Một sai sót cấu hình: TTL đáng lẽ chỉ cần dài hơn mọi nhịp tạm dừng có thể xảy ra',
              'It is inherent: any lock with a timeout is a lease, and a paused process cannot notice time passing. No TTL, Redlock or config prevents it — correctness needs fencing tokens, unique constraints or idempotency|||Nó là bản chất: mọi cái khoá có hạn giờ đều là một hợp đồng thuê, và một tiến trình bị tạm dừng không thể nhận ra thời gian trôi. Không TTL, Redlock hay cấu hình nào ngăn được — tính đúng đắn cần mã hàng rào, ràng buộc duy nhất hoặc tính lặp-lại-vô-hại',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
  ],
};
