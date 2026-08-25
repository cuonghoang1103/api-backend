/**
 * Redis — Chương 6: Làm bộ đệm cho đúng.
 * Bốn khuôn đọc/ghi · đẩy khoá cũ · giẫm đạp · nhất quán với CSDL · đo bộ đệm · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 6 — Caching properly: invalidation, stampedes and stale data|||Chương 6 — Làm bộ đệm cho đúng: đẩy khoá cũ, giẫm đạp và dữ liệu ôi',
  description: 'Đặt một lệnh GET trước cơ sở dữ liệu thì dễ. Phần khó là bốn câu hỏi đến sau: khi dữ liệu đổi thì xoá cái gì, khi mười nghìn yêu cầu cùng trượt một khoá thì chuyện gì xảy ra, làm sao để bộ đệm và cơ sở dữ liệu không lệch nhau vĩnh viễn, và làm sao biết bộ đệm của bạn có thật sự giúp gì không.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — The four caching patterns, and which one you have|||6.1 — Bốn khuôn làm bộ đệm, và bạn đang dùng khuôn nào',
      slug: 'rd-6-1-bon-khuon',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cache-aside viết ra đầy đủ với bốn chi tiết ai cũng bỏ sót, read-through với write-through với write-behind, vì sao gần như mọi người dùng cache-aside kể cả khi họ không biết tên nó, và cái giá thật của mỗi khuôn khi có sự cố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The four caching patterns, and which one you have</h2>
<p class="lead">Almost every cache in the world is one of four shapes, and almost every cache in the world is the first one. Knowing which you have matters because the failure modes are completely different: one of them serves stale data forever, one of them loses writes on a crash, and one of them turns a Redis outage into a total outage.</p>

<h3>Cache-aside (lazy loading) — the one you have</h3>
<pre><code>async function getProduct(id) {
  const key = &#96;product:\${id}&#96;;

  const hit = await redis.get(key);              <span class="tok-comment">// 1. look in the cache</span>
  if (hit !== null) return JSON.parse(hit);      <span class="tok-comment">//    → hit, done</span>

  const row = await db.product.findUnique({ where: { id } });   <span class="tok-comment">// 2. miss → go to the DB</span>
  if (!row) return null;

  await redis.set(key, JSON.stringify(row), { EX: 300 });       <span class="tok-comment">// 3. fill the cache</span>
  return row;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The application owns the cache</span><span class="lz-t">Redis knows nothing about your database</span><span class="lz-d">There is no integration, no plugin, no sync. Your code decides what to store, when, and for how long — which is why this pattern works with every database and every language, and why every mistake in it is yours.</span></div>
  <div class="lz-step"><span class="lz-k">Only requested data is cached</span><span class="lz-t">lazy: nothing is loaded until someone asks</span><span class="lz-d">Memory holds exactly your working set, automatically. A cold start is slow and then it warms up — which is fine, unless a deploy restarts everything at 9am (see the stampede in Lesson 6.3).</span></div>
  <div class="lz-step"><span class="lz-k">Redis going down degrades, not breaks</span><span class="lz-t">a miss and a dead Redis look the same</span><span class="lz-d">This is the pattern's best property — <em>if</em> you wrote the error handling. A <code>GET</code> that throws must be caught and treated as a miss; if it propagates, a Redis blip becomes a 500 and you have built a hard dependency on a cache.</span></div>
  <div class="lz-step"><span class="lz-k">Data is stale by up to the TTL</span><span class="lz-t">300 seconds, in the code above</span><span class="lz-d">Nothing tells the cache that row 42 changed. That is the whole subject of Lesson 6.2, and choosing the TTL is choosing how wrong you are willing to be.</span></div>
</div>
<div class="callout warn"><strong>The four details that snippet is missing, and every real implementation needs.</strong> <strong>One:</strong> a <code>try/catch</code> around both Redis calls, so an unreachable cache is a miss and not a 500. <strong>Two:</strong> negative caching — if the row does not exist, that <code>null</code> is not cached, so a bot hammering <code>/product/999999</code> hits the database on every single request (Lesson 6.5). <strong>Three:</strong> jitter on the TTL, because a thousand keys written in the same second expire in the same second (Lesson 6.3). <strong>Four:</strong> nothing stops ten thousand concurrent misses from all querying the database at once. The five lines are the idea; the production version is about thirty.</div>

<h3>The other three</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Read-through — the cache fetches for you</span><span class="lz-lnote">Your code only ever talks to the cache; on a miss the <em>cache</em> loads from the database and returns it. Cleaner call sites and one place to fix a bug, and it needs a cache layer that knows how to load — a library, a framework, or a wrapper you write. Plain Redis does not do this; something in front of it does. The catch: the cache is now on the critical path for every read, so it cannot degrade to "just skip it".</span></div>
  <div class="lz-layer"><span class="lz-lname">Write-through — write to cache and DB together</span><span class="lz-lnote">Every write goes to both, synchronously, before returning. The cache is never stale and reads after a write are always correct. You pay for it on every write — two round trips instead of one, and a write that fails halfway leaves you deciding which of the two is the truth. Good when reads vastly outnumber writes and staleness is genuinely unacceptable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Write-behind (write-back) — write to cache, flush later</span><span class="lz-lnote">The write returns as soon as Redis has it; a background worker persists to the database seconds later. Extremely fast writes, and the only pattern here that can <strong>lose committed data</strong> — if Redis dies with unflushed writes, they are gone, and no amount of RDB/AOF tuning makes that safe (Chapter 9). Legitimate for metrics, view counts and telemetry. Not for anything a user would notice missing.</span></div>
</div>
<pre><code><span class="tok-comment"># The same read, priced. DB row fetch vs Redis GET, measured locally.</span>
time psql -c "SELECT * FROM products WHERE id = 4201" &gt;/dev/null
time redis-cli GET product:4201 &gt;/dev/null
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses"</code></pre>
<div class="out">real	0m0.021s
real	0m0.003s
keyspace_hits:184203
keyspace_misses:9117</div>

<h3>Choosing, honestly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Default to cache-aside</span><span class="v">It is the only one that works with no infrastructure, degrades safely, and is understood by everyone who will read your code. Start here and stay here unless you have a specific reason.</span></div>
  <div class="kv"><span class="k">Read-through when call sites multiply</span><span class="v">When twelve places fetch a product and eleven of them forgot the TTL, wrap it. The win is consistency of policy, not performance.</span></div>
  <div class="kv"><span class="k">Write-through when stale is unacceptable</span><span class="v">Prices, permissions, account balances — anywhere a five-minute-old answer is a support ticket. And accept that your write path now depends on Redis being up.</span></div>
  <div class="kv"><span class="k">Write-behind only for data you can lose</span><span class="v">View counts, "last seen", analytics. Write it down explicitly: "if Redis dies we lose up to N seconds of this". If that sentence is unacceptable to anyone, this is the wrong pattern.</span></div>
  <div class="kv"><span class="k">Cache-warming is a fifth thing, not a pattern</span><span class="v">Pre-loading hot keys after a deploy is a job you run, not a shape you choose. It composes with any of the four, and it is the honest fix for cold-start latency.</span></div>
</div>
<div class="pitfall"><strong>Pitfall:</strong> caching the wrong layer. It is tempting to cache the database row, because that is the expensive part — but if every request then re-runs the same permission checks, the same joins-in-application-code, the same serialisation and the same template render, you have cached the cheapest 20% of the work. Measure where the milliseconds actually go before you choose the layer: a 21 ms query inside a 180 ms request is not your problem. Often the right cache is one level up — the assembled DTO, the rendered fragment, the full JSON response — where one <code>GET</code> replaces the query <em>and</em> everything built on top of it. The counter-argument is real too: the higher you cache, the more keys you have (one per user, per locale, per permission set) and the more ways there are to invalidate them wrongly. The rule of thumb: cache the highest layer whose output does not depend on who is asking, and go no higher.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Caching with Redis</span><span class="lc-sub">The official overview of the patterns, with the trade-offs stated plainly. Short, and a good sanity check against what your framework is doing on your behalf.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/caching/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Caching best practices</span><span class="lc-sub">AWS's vendor-neutral write-up of lazy loading vs write-through, TTL selection and cache warming. Useful precisely because it is not Redis-specific.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write cache-aside properly</span><span class="lc-sub">Graded exercises: take the five-line version and add the four missing details, then identify which pattern three real code samples are using and what each one loses when Redis restarts.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Cache-aside is what you have and what you should default to: the application owns the cache, only requested data is stored, and a dead Redis degrades to a slow request — <em>provided</em> you catch the error and treat it as a miss. The five-line version everyone writes is missing four things: error handling, negative caching, TTL jitter and stampede protection, and the next four lessons are those four things. And write-behind is the one pattern that can lose committed data, so use it only where you can say out loud "if Redis dies we lose the last few seconds of this" and nobody objects.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Bốn khuôn làm bộ đệm, và bạn đang dùng khuôn nào</h2>
<p class="lead">Gần như mọi bộ đệm trên đời đều thuộc một trong bốn hình dáng, và gần như mọi bộ đệm trên đời đều là cái đầu tiên. Biết mình đang dùng cái nào là chuyện quan trọng vì các kiểu hỏng của chúng khác nhau hoàn toàn: một cái phục vụ dữ liệu ôi thiu mãi mãi, một cái mất dữ liệu đã ghi khi máy sập, và một cái biến sự cố của Redis thành sự cố toàn hệ thống.</p>

<h3>Cache-aside (nạp lười) — cái bạn đang dùng</h3>
<pre><code>async function getProduct(id) {
  const key = &#96;product:\${id}&#96;;

  const hit = await redis.get(key);              <span class="tok-comment">// 1. tìm trong bộ đệm</span>
  if (hit !== null) return JSON.parse(hit);      <span class="tok-comment">//    → trúng, xong</span>

  const row = await db.product.findUnique({ where: { id } });   <span class="tok-comment">// 2. trượt → xuống CSDL</span>
  if (!row) return null;

  await redis.set(key, JSON.stringify(row), { EX: 300 });       <span class="tok-comment">// 3. nạp vào bộ đệm</span>
  return row;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Ứng dụng sở hữu bộ đệm</span><span class="lz-t">Redis không biết gì về cơ sở dữ liệu của bạn</span><span class="lz-d">Không có tích hợp, không plugin, không đồng bộ. Mã của bạn quyết định lưu cái gì, lúc nào, và trong bao lâu — đó là lý do khuôn này chạy với mọi cơ sở dữ liệu và mọi ngôn ngữ, và cũng là lý do mọi sai lầm trong đó đều là của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Chỉ dữ liệu được yêu cầu mới vào bộ đệm</span><span class="lz-t">lười: không nạp gì cho tới khi có người hỏi</span><span class="lz-d">Bộ nhớ giữ đúng tập dữ liệu đang làm việc của bạn, một cách tự động. Khởi động nguội thì chậm rồi nó ấm lên — điều đó ổn, trừ khi một lần deploy khởi động lại mọi thứ lúc 9 giờ sáng (xem phần giẫm đạp ở Bài 6.3).</span></div>
  <div class="lz-step"><span class="lz-k">Redis chết thì suy giảm, không phải gãy</span><span class="lz-t">một lần trượt và một Redis chết trông giống nhau</span><span class="lz-d">Đây là tính chất tốt nhất của khuôn này — <em>nếu</em> bạn có viết phần xử lý lỗi. Một lệnh <code>GET</code> ném ra ngoại lệ thì phải được bắt lại và coi như trượt; nếu để nó lan lên, một cú chớp của Redis thành lỗi 500 và bạn vừa dựng ra một phụ thuộc cứng vào bộ đệm.</span></div>
  <div class="lz-step"><span class="lz-k">Dữ liệu ôi tối đa bằng TTL</span><span class="lz-t">300 giây, trong đoạn mã trên</span><span class="lz-d">Không có gì báo cho bộ đệm biết dòng số 42 đã đổi. Đó chính là toàn bộ chủ đề của Bài 6.2, và chọn TTL là chọn mức độ sai mà bạn sẵn lòng chịu.</span></div>
</div>
<div class="callout warn"><strong>Bốn chi tiết mà đoạn mã đó còn thiếu, và mọi bản cài đặt thật đều cần.</strong> <strong>Một:</strong> một <code>try/catch</code> quanh cả hai lời gọi Redis, để một bộ đệm không với tới được là một lần trượt chứ không phải lỗi 500. <strong>Hai:</strong> đệm cả kết quả rỗng — nếu dòng đó không tồn tại thì cái <code>null</code> ấy không được đệm, nên một con bot nện vào <code>/product/999999</code> sẽ đánh xuống cơ sở dữ liệu ở từng lượt yêu cầu một (Bài 6.5). <strong>Ba:</strong> rắc nhiễu vào TTL, vì một nghìn khoá ghi trong cùng một giây sẽ hết hạn trong cùng một giây (Bài 6.3). <strong>Bốn:</strong> không có gì ngăn mười nghìn lần trượt đồng thời cùng lúc truy vấn xuống cơ sở dữ liệu. Năm dòng kia là ý tưởng; bản chạy được ở production dài khoảng ba mươi dòng.</div>

<h3>Ba khuôn còn lại</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Read-through — bộ đệm tự đi lấy hộ bạn</span><span class="lz-lnote">Mã của bạn chỉ nói chuyện với bộ đệm; khi trượt thì <em>bộ đệm</em> nạp từ cơ sở dữ liệu rồi trả về. Chỗ gọi gọn hơn và chỉ một nơi để sửa lỗi, đổi lại nó cần một tầng bộ đệm biết cách nạp — một thư viện, một framework, hoặc một lớp bọc bạn tự viết. Redis trần không làm việc này; thứ đứng trước nó mới làm. Cái bẫy: giờ bộ đệm nằm trên đường đi tối quan trọng của mọi lượt đọc, nên nó không thể suy giảm kiểu "thôi bỏ qua".</span></div>
  <div class="lz-layer"><span class="lz-lname">Write-through — ghi vào bộ đệm và CSDL cùng lúc</span><span class="lz-lnote">Mỗi lần ghi đều đi vào cả hai, đồng bộ, trước khi trả về. Bộ đệm không bao giờ ôi và lượt đọc ngay sau lượt ghi luôn đúng. Bạn trả giá ở mỗi lần ghi — hai vòng đi-về thay vì một, và một lần ghi hỏng giữa chừng để lại cho bạn câu hỏi bên nào mới là sự thật. Tốt khi lượt đọc áp đảo lượt ghi và sự ôi thiu thật sự không chấp nhận được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Write-behind (write-back) — ghi vào bộ đệm, đẩy xuống sau</span><span class="lz-lnote">Lệnh ghi trả về ngay khi Redis nhận được; một worker chạy nền ghi xuống cơ sở dữ liệu vài giây sau. Ghi cực nhanh, và là khuôn duy nhất ở đây có thể <strong>làm mất dữ liệu đã ghi nhận</strong> — nếu Redis chết khi còn lượt ghi chưa đẩy xuống thì chúng mất luôn, và không mức tinh chỉnh RDB/AOF nào làm chuyện đó an toàn được (Chương 9). Chính đáng cho số liệu đo, lượt xem và dữ liệu đo đạc. Không dành cho bất cứ thứ gì mà người dùng sẽ nhận ra là thiếu.</span></div>
</div>
<pre><code><span class="tok-comment"># Cùng một lượt đọc, có bảng giá. Lấy một dòng CSDL với một lệnh GET, đo tại chỗ.</span>
time psql -c "SELECT * FROM products WHERE id = 4201" &gt;/dev/null
time redis-cli GET product:4201 &gt;/dev/null
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses"</code></pre>
<div class="out">real	0m0.021s
real	0m0.003s
keyspace_hits:184203
keyspace_misses:9117</div>

<h3>Chọn cho thành thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mặc định hãy chọn cache-aside</span><span class="v">Nó là cái duy nhất chạy được mà không cần hạ tầng gì, suy giảm một cách an toàn, và ai đọc mã của bạn cũng hiểu. Hãy bắt đầu ở đây và ở lại đây trừ khi có lý do cụ thể.</span></div>
  <div class="kv"><span class="k">Read-through khi chỗ gọi sinh sôi</span><span class="v">Khi mười hai nơi cùng đi lấy một sản phẩm và mười một nơi quên đặt TTL, hãy bọc nó lại. Cái được là sự nhất quán về chính sách, không phải hiệu năng.</span></div>
  <div class="kv"><span class="k">Write-through khi ôi thiu là không chấp nhận được</span><span class="v">Giá cả, quyền hạn, số dư tài khoản — bất cứ chỗ nào mà một câu trả lời cũ năm phút là một phiếu hỗ trợ. Và hãy chấp nhận rằng đường ghi của bạn giờ phụ thuộc vào việc Redis còn sống.</span></div>
  <div class="kv"><span class="k">Write-behind chỉ cho dữ liệu bạn mất được</span><span class="v">Lượt xem, "lần thấy cuối", số liệu phân tích. Hãy viết ra rõ ràng: "nếu Redis chết ta mất tối đa N giây dữ liệu này". Nếu câu đó không chấp nhận được với bất kỳ ai thì đây là khuôn sai.</span></div>
  <div class="kv"><span class="k">Làm ấm bộ đệm là thứ thứ năm, không phải một khuôn</span><span class="v">Nạp sẵn các khoá nóng sau một lần deploy là một việc bạn chạy, không phải một hình dáng bạn chọn. Nó ghép được với bất cứ cái nào trong bốn khuôn, và là cách chữa thành thật cho độ trễ lúc khởi động nguội.</span></div>
</div>
<div class="pitfall"><strong>Cái bẫy:</strong> đệm nhầm tầng. Rất dễ nghĩ tới việc đệm cái dòng dữ liệu, vì đó là phần đắt — nhưng nếu sau đó mỗi lượt yêu cầu vẫn chạy lại đúng những phép kiểm quyền ấy, đúng những phép nối-bằng-mã-ứng-dụng ấy, đúng lượt tuần tự hoá và lượt dựng khuôn ấy, thì bạn vừa đệm mất 20% rẻ nhất của công việc. Hãy đo xem mili giây thật sự đi đâu trước khi chọn tầng: một truy vấn 21 ms nằm trong một yêu cầu 180 ms không phải vấn đề của bạn. Cái bộ đệm đúng thường nằm cao hơn một tầng — cái DTO đã lắp xong, mảnh giao diện đã dựng, cả câu trả lời JSON — nơi mà một lệnh <code>GET</code> thay được cho truy vấn <em>và</em> mọi thứ xây trên nó. Lý lẽ ngược lại cũng có thật: bạn đệm càng cao thì càng nhiều khoá (một khoá cho mỗi người dùng, mỗi ngôn ngữ, mỗi bộ quyền) và càng nhiều cách để đẩy chúng đi sai. Quy tắc ngón tay cái: hãy đệm ở tầng cao nhất mà đầu ra của nó không phụ thuộc vào ai đang hỏi, và đừng đi cao hơn nữa.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Caching with Redis</span><span class="lc-sub">Bản tổng quan chính thức về các khuôn mẫu, với những đánh đổi nói thẳng ra. Ngắn, và là một phép thử tỉnh táo tốt để đối chiếu xem framework của bạn đang làm gì thay bạn.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/caching/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Caching best practices</span><span class="lc-sub">Bản viết trung lập nhà cung cấp của AWS về nạp lười với write-through, cách chọn TTL và làm ấm bộ đệm. Hữu ích đúng vì nó không riêng cho Redis.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: viết cache-aside cho đúng</span><span class="lc-sub">Bài chấm điểm: lấy bản năm dòng rồi thêm vào bốn chi tiết còn thiếu, sau đó chỉ ra ba đoạn mã thật đang dùng khuôn nào và mỗi cái mất gì khi Redis khởi động lại.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cache-aside là cái bạn đang có và là cái bạn nên chọn mặc định: ứng dụng sở hữu bộ đệm, chỉ dữ liệu được yêu cầu mới được lưu, và một Redis chết chỉ làm yêu cầu chậm đi — <em>với điều kiện</em> bạn bắt lỗi và coi nó như một lần trượt. Bản năm dòng ai cũng viết còn thiếu bốn thứ: xử lý lỗi, đệm kết quả rỗng, rắc nhiễu vào TTL và chống giẫm đạp, và bốn bài tiếp theo chính là bốn thứ đó. Và write-behind là khuôn duy nhất có thể làm mất dữ liệu đã ghi nhận, nên chỉ dùng nó ở nơi bạn nói to được câu "nếu Redis chết ta mất mấy giây cuối của thứ này" mà không ai phản đối.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Invalidation: five strategies, ranked|||6.2 — Đẩy khoá cũ: năm chiến lược, xếp hạng',
      slug: 'rd-6-2-day-khoa-cu',
      type: 'LESSON',
      description: 'Chỉ dùng TTL, xoá tường minh khi ghi, khoá có phiên bản, đẩy theo nhãn bằng set, và đổi tiền tố cả không gian tên; cộng bài toán khó thật sự là đệm danh sách, và CLIENT TRACKING của Redis 6 đẩy thông báo vô hiệu về tận thư viện khách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Invalidation: five strategies, ranked</h2>
<p class="lead">Phil Karlton's line about cache invalidation being one of the two hard problems is quoted so often that people forget it is literally true. The hard part is not deleting a key — it is knowing <em>which</em> keys a write invalidated, and that question gets harder every time you add a cache that is derived from another one.</p>

<h3>1 · TTL only — the one you should try first</h3>
<pre><code>redis-cli SET product:4201 '{"price":129900}' EX 300
redis-cli TTL product:4201
<span class="tok-comment"># The database changes. Nothing tells Redis. In ≤300s the key expires</span>
<span class="tok-comment"># and the next read reloads it. That is the entire strategy.</span></code></pre>
<div class="out">OK
(integer) 300</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Correct eventually, by construction</span><span class="v">There is no invalidation bug possible, because there is no invalidation code. Every key is at most TTL seconds wrong, and then it is right. That is a genuinely strong property.</span></div>
  <div class="kv"><span class="k">The TTL is a business decision</span><span class="v">"How stale can a product price be?" is a question for the person who answers support tickets, not for you. Sixty seconds is invisible to users; an hour is a complaint.</span></div>
  <div class="kv"><span class="k">It fails when writes must be visible now</span><span class="v">A user edits their own profile and reloads. If they see the old bio for five minutes, they will edit it again, and again. Self-visible writes need strategy 2.</span></div>
  <div class="kv"><span class="k">Always add jitter</span><span class="v"><code>EX 300</code> on a thousand keys written in the same second means a thousand keys expiring in the same second. <code>EX (300 + random(0,60))</code> costs nothing and prevents Lesson 6.3.</span></div>
  <div class="kv"><span class="k">Short TTL is not a stampede fix</span><span class="v">It reduces staleness and <em>increases</em> load — a 10-second TTL on a hot key means the database is hit six times a minute per key, forever. Short TTLs make the herd more frequent, not smaller.</span></div>
</div>

<h3>2 · Delete on write — the obvious one, with two subtleties</h3>
<pre><code><span class="tok-comment">// In the same transaction boundary as the DB write</span>
await db.product.update({ where: { id }, data });
await redis.unlink(&#96;product:\${id}&#96;);        <span class="tok-comment">// UNLINK, not DEL</span></code></pre>
<div class="callout"><strong>Delete, do not update.</strong> Writing the new value into the cache looks more efficient and creates a race: two concurrent writers can interleave so that the <em>older</em> value lands last and then sits there for the full TTL. Deleting is idempotent and self-correcting — whoever reads next reloads the current truth. And prefer <code>UNLINK</code> over <code>DEL</code>: <code>DEL</code> frees the memory synchronously, so deleting a 200 MB key blocks the server for hundreds of milliseconds, while <code>UNLINK</code> unlinks it from the keyspace immediately and frees it on a background thread (Lesson 2.3). For a small string the two are identical; make <code>UNLINK</code> the habit and you never have to think about which case you are in.</div>
<div class="callout warn"><strong>The ordering question — and it has a right answer.</strong> Delete-then-write is wrong: between the delete and the DB commit, a concurrent reader can miss, read the <em>old</em> row, and write it back into the cache, where it will sit until the TTL. Write-then-delete is much better and still not perfect: if the delete fails or the process dies between the two, the cache keeps the old value until it expires. Neither ordering is airtight — this is why strategy 1's TTL should <em>always</em> be there as a backstop even when you delete explicitly. Lesson 6.4 works through the full race.</div>

<h3>3 · Versioned keys — invalidate without deleting</h3>
<pre><code>redis-cli SET product:4201:v 7
redis-cli SET "product:4201:v7" '{"price":129900}' EX 3600
<span class="tok-comment"># On write: bump the version. The old key is orphaned and expires on its own.</span>
redis-cli INCR product:4201:v
redis-cli GET product:4201:v
redis-cli EXISTS "product:4201:v7"      <span class="tok-comment"># still there, but nobody will ask for it</span></code></pre>
<div class="out">OK
OK
(integer) 8
"8"
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Reads get the version first</span><span class="lz-t">GET product:4201:v → then GET product:4201:v8</span><span class="lz-d">Two round trips, or one <code>MULTI</code>. The version key is tiny and permanent; the data keys carry the TTL and clean themselves up.</span></div>
  <div class="lz-step"><span class="lz-k">Invalidation is one INCR</span><span class="lz-t">atomic, safe from any number of writers</span><span class="lz-d">No delete race, no partial failure leaving stale data reachable — the old key is simply unreachable the instant the counter moves. This is the strategy's real advantage.</span></div>
  <div class="lz-step"><span class="lz-k">It invalidates whole groups cheaply</span><span class="lz-t">one version key per category, per tenant, per locale</span><span class="lz-d"><code>INCR tenant:88:v</code> invalidates every cached thing for that tenant at once, without knowing a single key name. That is the case where this strategy is unbeatable.</span></div>
  <div class="lz-step"><span class="lz-k">The cost: orphans until they expire</span><span class="lz-t">v7 sits in memory holding its own TTL</span><span class="lz-d">You are trading memory for correctness. Keep the data TTL short enough that orphans do not accumulate, and never use this pattern on keys with no TTL at all.</span></div>
</div>

<h3>4 · Tags — when one write invalidates many keys</h3>
<pre><code><span class="tok-comment"># Every cached page records which entities it depends on</span>
redis-cli SET page:home '&lt;html&gt;…&lt;/html&gt;' EX 600
redis-cli SADD tag:product:4201 page:home page:category:5 page:search:redis
redis-cli EXPIRE tag:product:4201 900        <span class="tok-comment"># longer than the page TTL</span>
<span class="tok-comment"># Product 4201 changes → drop everything that mentioned it</span>
redis-cli SMEMBERS tag:product:4201
redis-cli UNLINK $(redis-cli SMEMBERS tag:product:4201 | tr '\\n' ' ')
redis-cli UNLINK tag:product:4201</code></pre>
<div class="out">1) "page:home"
2) "page:category:5"
3) "page:search:redis"
(integer) 3
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">This is what CDNs call surrogate keys</span><span class="v">Same idea, same shape. A cached artefact declares its dependencies; a change to a dependency drops every artefact that declared it.</span></div>
  <div class="kv"><span class="k">The tag set must outlive its members</span><span class="v">Give the tag a longer TTL than the pages it points at. A tag that expires first leaves pages nothing can invalidate, which is the failure mode this whole strategy exists to prevent.</span></div>
  <div class="kv"><span class="k">Tag sets need a bound like any set</span><span class="v">A popular product tagged by ten thousand cached pages is a ten-thousand-member set, and <code>SMEMBERS</code> on it is O(N) (Lesson 4.2). Bound it, or accept the cost knowingly.</span></div>
  <div class="kv"><span class="k">Do the delete in one command</span><span class="v"><code>UNLINK</code> takes many keys. Do not loop; one command with N arguments beats N commands, and it is atomic (Lesson 1.4).</span></div>
  <div class="kv"><span class="k">Version keys are usually simpler</span><span class="v">If the grouping is coarse — everything for a tenant, everything in a category — strategy 3 does the same job with one <code>INCR</code> and no bookkeeping. Reach for tags when the dependency graph is genuinely irregular.</span></div>
</div>

<h3>5 · Namespace generation — the nuclear option, done safely</h3>
<pre><code>redis-cli SET cache:gen 12
<span class="tok-comment"># every key: cache:12:product:4201 — bumping gen orphans the entire cache</span>
redis-cli INCR cache:gen
<span class="tok-comment"># NEVER do this instead:</span>
<span class="tok-comment">#   redis-cli FLUSHDB      ← wipes sessions, rate limits, queues, everything</span>
<span class="tok-comment">#   redis-cli KEYS "cache:*" | xargs redis-cli DEL   ← KEYS blocks the server</span>
redis-cli SCAN 0 MATCH "cache:11:*" COUNT 500    <span class="tok-comment"># sweep old gen lazily, if you must</span></code></pre>
<div class="out">OK
(integer) 13
1) "3072"
2) 1) "cache:11:product:9"
   2) "cache:11:product:41"</div>
<div class="callout ok"><strong>This is the safe version of "clear the cache" after a deploy that changed a serialisation format.</strong> One <code>INCR</code> makes every existing cached value unreachable in O(1), with no scan, no blocking, and — critically — without touching the sessions, rate-limit counters and job queues that share the instance. The old generation's keys age out on their own TTL, or you sweep them with <code>SCAN</code> during a quiet hour. Compare with the two commands people actually run at 2am: <code>FLUSHDB</code>, which also logs out every user, and <code>KEYS cache:*</code>, which blocks a single-threaded server for as long as it takes to walk millions of keys (Lesson 2.3).</div>

<h3>The genuinely hard case: derived and list caches</h3>
<div class="pitfall"><strong>Pitfall:</strong> caching a list and invalidating only the items in it. <code>product:4201</code> is easy — one entity, one key, one delete. But you also cached <code>category:5:page:1</code>, <code>search:redis:page:1</code>, the homepage, the sitemap and an aggregate count, and <em>every one of those changes when any single product changes</em>. Delete the product key and the listing pages keep serving the old price for their full TTL, which users read as "the site is broken" rather than "the cache is stale". There is no clean answer, only three honest ones. <strong>Short TTLs on derived caches</strong> — 30–60 seconds on listings, longer on entities — is the least clever and works. <strong>Tags</strong> (strategy 4) express the dependency exactly and cost you the bookkeeping to maintain it. <strong>A generation counter per collection</strong> (<code>INCR category:5:gen</code> on any product write in that category) is the middle ground: coarse, one command, no per-key tracking. What does not work is trying to be precise by hand — a dependency graph maintained by remembering to update it is a dependency graph that is already wrong.</div>

<h3>Bonus: let Redis tell the client</h3>
<pre><code><span class="tok-comment"># RESP3 client-side caching: the server pushes invalidation messages</span>
redis-cli -3 CLIENT TRACKING ON
redis-cli -3 GET product:4201        <span class="tok-comment"># this client now "owns" a local copy</span>
<span class="tok-comment"># …another client writes:</span>
redis-cli SET product:4201 '{"price":99900}'
<span class="tok-comment"># the first client receives an invalidation push for that key</span>
redis-cli CLIENT TRACKINGINFO</code></pre>
<div class="out">OK
"{\\"price\\":129900}"
OK
 1) "flags"
 2) 1) "on"
 3) "redirect"
 4) (integer) 0
 5) "prefixes"
 6) (empty array)</div>
<div class="callout"><strong>Redis 6 added a second cache layer inside your application process, kept honest by the server.</strong> With <code>CLIENT TRACKING ON</code>, Redis remembers which keys a connection has read and pushes an invalidation message when any of them change, so the client library can keep an in-memory copy that is safe to serve — turning a 3 ms network round trip into a 0 ms local lookup for hot keys. It is real, it works, and the reason it is a footnote rather than a chapter is that it needs RESP3, a client library that implements it, and careful thought about memory in your app process. If your client supports it (node-redis, Lettuce, redis-py all do to varying degrees), it is the cheapest latency win available on a read-heavy service.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/client-side-caching/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">Client-side caching in Redis</span><span class="lc-sub">How tracking works, default vs broadcast mode, prefix filtering, and the memory questions to answer before turning it on. The best-written page in the Redis docs.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/unlink/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">UNLINK vs DEL</span><span class="lc-sub">Why one blocks and one does not, when Redis decides a key is big enough to free asynchronously, and why <code>UNLINK</code> should simply be your default.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: invalidate five ways</span><span class="lc-sub">Graded exercises: implement versioned keys, build a tag index and drop it in one command, replace a <code>FLUSHDB</code> with a generation bump, and find the ordering bug in a write-then-invalidate handler.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Try TTL alone first — it has no invalidation bugs because it has no invalidation code, and it should stay as a backstop under every other strategy. When you do invalidate, <em>delete</em> rather than update (deleting is idempotent and self-correcting), use <code>UNLINK</code> rather than <code>DEL</code>, and write to the database <em>before</em> invalidating. And the hard case is never the entity — it is the listing, the search page and the aggregate that also changed, which is what versioned keys, tags and generation counters exist for. A hand-maintained dependency graph is already wrong.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Đẩy khoá cũ: năm chiến lược, xếp hạng</h2>
<p class="lead">Câu của Phil Karlton rằng đẩy khoá bộ đệm là một trong hai bài toán khó được trích nhiều tới mức người ta quên mất nó đúng theo nghĩa đen. Phần khó không phải là xoá một cái khoá — mà là biết một lượt ghi đã làm <em>những</em> khoá nào trở nên vô hiệu, và câu hỏi ấy khó lên mỗi lần bạn thêm một bộ đệm được suy ra từ một bộ đệm khác.</p>

<h3>1 · Chỉ dùng TTL — cái bạn nên thử trước tiên</h3>
<pre><code>redis-cli SET product:4201 '{"price":129900}' EX 300
redis-cli TTL product:4201
<span class="tok-comment"># Cơ sở dữ liệu thay đổi. Không gì báo cho Redis. Trong vòng ≤300 giây khoá</span>
<span class="tok-comment"># hết hạn và lượt đọc tiếp theo nạp lại. Đó là toàn bộ chiến lược.</span></code></pre>
<div class="out">OK
(integer) 300</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng dần, ngay từ cách dựng</span><span class="v">Không thể có lỗi đẩy khoá nào, vì không có mã đẩy khoá nào. Mỗi khoá sai nhiều nhất là TTL giây, rồi nó đúng. Đó là một tính chất thật sự mạnh.</span></div>
  <div class="kv"><span class="k">TTL là một quyết định kinh doanh</span><span class="v">"Giá sản phẩm được phép cũ tới đâu?" là câu hỏi dành cho người trả lời phiếu hỗ trợ, không dành cho bạn. Sáu mươi giây thì người dùng không nhận ra; một tiếng thì thành lời phàn nàn.</span></div>
  <div class="kv"><span class="k">Nó hỏng khi lượt ghi phải hiện ra ngay</span><span class="v">Một người sửa hồ sơ của chính mình rồi tải lại trang. Nếu họ thấy tiểu sử cũ suốt năm phút, họ sẽ sửa lại, rồi sửa nữa. Lượt ghi mà chính người ghi phải thấy thì cần chiến lược 2.</span></div>
  <div class="kv"><span class="k">Luôn rắc thêm nhiễu</span><span class="v"><code>EX 300</code> trên một nghìn khoá ghi trong cùng một giây nghĩa là một nghìn khoá hết hạn trong cùng một giây. <code>EX (300 + random(0,60))</code> không tốn gì và ngăn được Bài 6.3.</span></div>
  <div class="kv"><span class="k">TTL ngắn không phải cách chữa giẫm đạp</span><span class="v">Nó giảm độ ôi và <em>tăng</em> tải — TTL 10 giây trên một khoá nóng nghĩa là cơ sở dữ liệu bị đánh sáu lần mỗi phút cho mỗi khoá, mãi mãi. TTL ngắn làm đàn giẫm đạp tới thường xuyên hơn, chứ không nhỏ đi.</span></div>
</div>

<h3>2 · Xoá khi ghi — cái hiển nhiên, kèm hai chỗ tinh tế</h3>
<pre><code><span class="tok-comment">// Trong cùng ranh giới giao dịch với lượt ghi CSDL</span>
await db.product.update({ where: { id }, data });
await redis.unlink(&#96;product:\${id}&#96;);        <span class="tok-comment">// UNLINK, không phải DEL</span></code></pre>
<div class="callout"><strong>Hãy xoá, đừng cập nhật.</strong> Ghi giá trị mới vào bộ đệm trông có vẻ hiệu quả hơn và tạo ra một cuộc đua: hai bên ghi đồng thời có thể xen kẽ sao cho giá trị <em>cũ hơn</em> lại rơi xuống sau cùng rồi nằm đó suốt cả TTL. Xoá thì gọi bao nhiêu lần cũng ra một kết quả và tự sửa được — ai đọc tiếp theo sẽ nạp lại sự thật hiện tại. Và hãy ưu tiên <code>UNLINK</code> hơn <code>DEL</code>: <code>DEL</code> giải phóng bộ nhớ một cách đồng bộ, nên xoá một khoá 200 MB sẽ chặn máy chủ hàng trăm mili giây, trong khi <code>UNLINK</code> gỡ nó khỏi không gian khoá ngay lập tức và giải phóng ở một luồng nền (Bài 2.3). Với một chuỗi nhỏ thì hai lệnh y hệt nhau; hãy biến <code>UNLINK</code> thành thói quen là bạn không bao giờ phải nghĩ mình đang ở trường hợp nào.</div>
<div class="callout warn"><strong>Câu hỏi về thứ tự — và nó có câu trả lời đúng.</strong> Xoá-rồi-ghi là sai: giữa lúc xoá và lúc giao dịch CSDL kết thúc, một bên đọc đồng thời có thể trượt, đọc ra dòng <em>cũ</em>, rồi ghi ngược nó vào bộ đệm, nơi nó nằm lì cho tới hết TTL. Ghi-rồi-xoá thì tốt hơn nhiều và vẫn chưa hoàn hảo: nếu lệnh xoá hỏng hoặc tiến trình chết giữa hai bước, bộ đệm giữ giá trị cũ tới khi hết hạn. Không thứ tự nào kín hoàn toàn — đó là lý do TTL của chiến lược 1 <em>luôn luôn</em> phải có mặt làm lưới đỡ kể cả khi bạn đã xoá tường minh. Bài 6.4 mổ xẻ trọn vẹn cuộc đua này.</div>

<h3>3 · Khoá có phiên bản — vô hiệu hoá mà không cần xoá</h3>
<pre><code>redis-cli SET product:4201:v 7
redis-cli SET "product:4201:v7" '{"price":129900}' EX 3600
<span class="tok-comment"># Khi ghi: tăng phiên bản. Khoá cũ thành mồ côi và tự hết hạn.</span>
redis-cli INCR product:4201:v
redis-cli GET product:4201:v
redis-cli EXISTS "product:4201:v7"      <span class="tok-comment"># vẫn còn đó, nhưng sẽ không ai hỏi tới</span></code></pre>
<div class="out">OK
OK
(integer) 8
"8"
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lượt đọc lấy phiên bản trước</span><span class="lz-t">GET product:4201:v → rồi GET product:4201:v8</span><span class="lz-d">Hai vòng đi-về, hoặc một <code>MULTI</code>. Khoá phiên bản thì tí hon và vĩnh viễn; các khoá dữ liệu mang TTL và tự dọn mình.</span></div>
  <div class="lz-step"><span class="lz-k">Vô hiệu hoá gói trong một lệnh INCR</span><span class="lz-t">nguyên tử, an toàn với bao nhiêu bên ghi cũng được</span><span class="lz-d">Không có đua khi xoá, không có hỏng nửa chừng để lại dữ liệu ôi mà vẫn với tới được — khoá cũ đơn giản là không thể với tới ngay khoảnh khắc bộ đếm nhích lên. Đây là lợi thế thật sự của chiến lược này.</span></div>
  <div class="lz-step"><span class="lz-k">Nó vô hiệu hoá cả nhóm với giá rẻ</span><span class="lz-t">mỗi hạng mục, mỗi khách thuê, mỗi ngôn ngữ một khoá phiên bản</span><span class="lz-d"><code>INCR tenant:88:v</code> vô hiệu hoá mọi thứ đã đệm của khách thuê đó cùng lúc, mà không cần biết một cái tên khoá nào. Đó là trường hợp chiến lược này vô địch.</span></div>
  <div class="lz-step"><span class="lz-k">Cái giá: khoá mồ côi cho tới khi hết hạn</span><span class="lz-t">v7 nằm trong bộ nhớ ôm TTL của riêng nó</span><span class="lz-d">Bạn đang đổi bộ nhớ lấy tính đúng đắn. Hãy giữ TTL của dữ liệu đủ ngắn để khoá mồ côi không chất đống, và đừng bao giờ dùng khuôn này trên những khoá hoàn toàn không có TTL.</span></div>
</div>

<h3>4 · Nhãn — khi một lượt ghi vô hiệu hoá nhiều khoá</h3>
<pre><code><span class="tok-comment"># Mỗi trang đã đệm ghi lại nó phụ thuộc vào những thực thể nào</span>
redis-cli SET page:home '&lt;html&gt;…&lt;/html&gt;' EX 600
redis-cli SADD tag:product:4201 page:home page:category:5 page:search:redis
redis-cli EXPIRE tag:product:4201 900        <span class="tok-comment"># dài hơn TTL của trang</span>
<span class="tok-comment"># Sản phẩm 4201 đổi → bỏ mọi thứ có nhắc tới nó</span>
redis-cli SMEMBERS tag:product:4201
redis-cli UNLINK $(redis-cli SMEMBERS tag:product:4201 | tr '\\n' ' ')
redis-cli UNLINK tag:product:4201</code></pre>
<div class="out">1) "page:home"
2) "page:category:5"
3) "page:search:redis"
(integer) 3
(integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đây chính là thứ CDN gọi là surrogate key</span><span class="v">Cùng ý tưởng, cùng hình dáng. Một sản phẩm đã đệm khai báo các phụ thuộc của nó; một thay đổi ở phụ thuộc sẽ bỏ mọi sản phẩm đã khai báo nó.</span></div>
  <div class="kv"><span class="k">Tập nhãn phải sống lâu hơn các thành viên của nó</span><span class="v">Hãy cho nhãn một TTL dài hơn các trang mà nó trỏ tới. Một cái nhãn hết hạn trước sẽ để lại những trang mà không gì vô hiệu hoá được, đúng cái kiểu hỏng mà cả chiến lược này sinh ra để ngăn.</span></div>
  <div class="kv"><span class="k">Tập nhãn cần một cái trần như mọi set khác</span><span class="v">Một sản phẩm nổi tiếng được mười nghìn trang đã đệm gắn nhãn là một set mười nghìn phần tử, và <code>SMEMBERS</code> lên nó là O(N) (Bài 4.2). Hãy chặn nó lại, hoặc chấp nhận cái giá một cách có ý thức.</span></div>
  <div class="kv"><span class="k">Xoá gói trong một lệnh</span><span class="v"><code>UNLINK</code> nhận nhiều khoá. Đừng lặp; một lệnh với N tham số thắng N lệnh, và nó nguyên tử (Bài 1.4).</span></div>
  <div class="kv"><span class="k">Khoá phiên bản thường đơn giản hơn</span><span class="v">Nếu phép gom nhóm là thô — mọi thứ của một khách thuê, mọi thứ trong một hạng mục — thì chiến lược 3 làm đúng việc đó bằng một lệnh <code>INCR</code> và không phải ghi sổ gì. Hãy với tay lấy nhãn khi đồ thị phụ thuộc thật sự bất quy tắc.</span></div>
</div>

<h3>5 · Đổi thế hệ không gian tên — quả bom hạt nhân, dùng cho an toàn</h3>
<pre><code>redis-cli SET cache:gen 12
<span class="tok-comment"># mọi khoá: cache:12:product:4201 — tăng gen là cả bộ đệm thành mồ côi</span>
redis-cli INCR cache:gen
<span class="tok-comment"># ĐỪNG BAO GIỜ làm thế này thay vào đó:</span>
<span class="tok-comment">#   redis-cli FLUSHDB      ← xoá sạch phiên, giới hạn tần suất, hàng đợi, mọi thứ</span>
<span class="tok-comment">#   redis-cli KEYS "cache:*" | xargs redis-cli DEL   ← KEYS chặn cả máy chủ</span>
redis-cli SCAN 0 MATCH "cache:11:*" COUNT 500    <span class="tok-comment"># quét dọn thế hệ cũ từ từ, nếu buộc phải</span></code></pre>
<div class="out">OK
(integer) 13
1) "3072"
2) 1) "cache:11:product:9"
   2) "cache:11:product:41"</div>
<div class="callout ok"><strong>Đây là bản an toàn của câu "xoá bộ đệm đi" sau một lần deploy đổi định dạng tuần tự hoá.</strong> Một lệnh <code>INCR</code> làm mọi giá trị đã đệm không thể với tới được, trong O(1), không quét, không chặn, và — điều tối quan trọng — không đụng tới các phiên đăng nhập, bộ đếm giới hạn tần suất và hàng đợi việc đang dùng chung máy đó. Các khoá của thế hệ cũ tự già đi theo TTL của chúng, hoặc bạn quét dọn bằng <code>SCAN</code> vào một giờ vắng. So với hai lệnh mà người ta thật sự gõ lúc 2 giờ sáng: <code>FLUSHDB</code>, vốn đăng xuất luôn mọi người dùng, và <code>KEYS cache:*</code>, vốn chặn một máy chủ đơn luồng đúng bằng thời gian đi hết hàng triệu khoá (Bài 2.3).</div>

<h3>Trường hợp khó thật: bộ đệm suy ra và bộ đệm danh sách</h3>
<div class="pitfall"><strong>Cái bẫy:</strong> đệm một danh sách rồi chỉ vô hiệu hoá các mục nằm trong đó. <code>product:4201</code> thì dễ — một thực thể, một khoá, một lệnh xoá. Nhưng bạn cũng đã đệm <code>category:5:page:1</code>, <code>search:redis:page:1</code>, trang chủ, sitemap và một con số tổng, và <em>mỗi cái trong số đó đều đổi khi bất kỳ sản phẩm nào đổi</em>. Xoá khoá sản phẩm đi thì các trang danh sách vẫn phục vụ giá cũ suốt cả TTL của chúng, và người dùng đọc chuyện đó thành "trang web hỏng rồi" chứ không phải "bộ đệm hơi cũ". Không có câu trả lời sạch sẽ, chỉ có ba câu trả lời thành thật. <strong>TTL ngắn cho các bộ đệm suy ra</strong> — 30–60 giây cho danh sách, dài hơn cho thực thể — là cách ít khôn ngoan nhất và nó chạy được. <strong>Nhãn</strong> (chiến lược 4) diễn đạt phụ thuộc một cách chính xác và bắt bạn trả phần ghi sổ để duy trì nó. <strong>Một bộ đếm thế hệ cho mỗi tập hợp</strong> (<code>INCR category:5:gen</code> ở bất kỳ lượt ghi sản phẩm nào trong hạng mục đó) là chỗ ở giữa: thô, một lệnh, không phải theo dõi từng khoá. Cái không chạy được là cố tỏ ra chính xác bằng tay — một đồ thị phụ thuộc được duy trì bằng cách nhớ cập nhật nó là một đồ thị phụ thuộc đã sai sẵn rồi.</div>

<h3>Món thêm: để Redis báo cho thư viện khách</h3>
<pre><code><span class="tok-comment"># Đệm phía khách qua RESP3: máy chủ đẩy thông báo vô hiệu về</span>
redis-cli -3 CLIENT TRACKING ON
redis-cli -3 GET product:4201        <span class="tok-comment"># khách này giờ "sở hữu" một bản sao tại chỗ</span>
<span class="tok-comment"># …một khách khác ghi:</span>
redis-cli SET product:4201 '{"price":99900}'
<span class="tok-comment"># khách đầu tiên nhận được một thông báo vô hiệu cho khoá đó</span>
redis-cli CLIENT TRACKINGINFO</code></pre>
<div class="out">OK
"{\\"price\\":129900}"
OK
 1) "flags"
 2) 1) "on"
 3) "redirect"
 4) (integer) 0
 5) "prefixes"
 6) (empty array)</div>
<div class="callout"><strong>Redis 6 thêm một tầng bộ đệm thứ hai nằm ngay trong tiến trình ứng dụng của bạn, được máy chủ giữ cho thành thật.</strong> Với <code>CLIENT TRACKING ON</code>, Redis nhớ một kết nối đã đọc những khoá nào và đẩy một thông báo vô hiệu về khi bất kỳ khoá nào trong số đó thay đổi, nhờ vậy thư viện khách giữ được một bản sao trong bộ nhớ mà phục vụ vẫn an toàn — biến một vòng đi-về mạng 3 ms thành một phép tra tại chỗ 0 ms cho các khoá nóng. Nó có thật, nó chạy được, và lý do nó chỉ là một ghi chú cuối bài chứ không phải cả một chương là vì nó cần RESP3, cần một thư viện khách có cài đặt nó, và cần suy nghĩ cẩn thận về bộ nhớ trong tiến trình ứng dụng của bạn. Nếu thư viện khách của bạn hỗ trợ (node-redis, Lettuce, redis-py đều có ở các mức khác nhau) thì đây là phần thắng độ trễ rẻ nhất mà một dịch vụ nặng đọc có thể lấy được.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/client-side-caching/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">Client-side caching in Redis</span><span class="lc-sub">Cơ chế theo dõi chạy thế nào, chế độ mặc định với chế độ phát rộng, lọc theo tiền tố, và những câu hỏi về bộ nhớ cần trả lời trước khi bật nó. Trang viết hay nhất trong tài liệu Redis.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/unlink/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">UNLINK với DEL</span><span class="lc-sub">Vì sao một cái chặn còn một cái không, khi nào Redis quyết định một khoá đủ lớn để giải phóng bất đồng bộ, và vì sao <code>UNLINK</code> đơn giản là nên thành mặc định của bạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đẩy khoá cũ theo năm cách</span><span class="lc-sub">Bài chấm điểm: cài đặt khoá có phiên bản, dựng một chỉ mục nhãn rồi bỏ nó trong một lệnh, thay một lệnh <code>FLUSHDB</code> bằng một lần tăng thế hệ, và tìm ra lỗi thứ tự trong một bộ xử lý ghi-rồi-vô-hiệu-hoá.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy thử chỉ dùng TTL trước — nó không có lỗi đẩy khoá vì nó không có mã đẩy khoá, và nó nên nằm lại làm lưới đỡ dưới mọi chiến lược khác. Khi bạn thật sự vô hiệu hoá, hãy <em>xoá</em> chứ đừng cập nhật (xoá thì gọi bao nhiêu lần cũng ra một kết quả và tự sửa được), hãy dùng <code>UNLINK</code> chứ đừng dùng <code>DEL</code>, và hãy ghi xuống cơ sở dữ liệu <em>trước</em> rồi mới vô hiệu hoá. Và trường hợp khó không bao giờ là cái thực thể — mà là danh sách, trang tìm kiếm và con số tổng cũng vừa đổi theo, đó chính là lý do khoá có phiên bản, nhãn và bộ đếm thế hệ tồn tại. Một đồ thị phụ thuộc duy trì bằng tay là một đồ thị đã sai sẵn.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — The stampede: when a cache miss takes down the database|||6.3 — Giẫm đạp: khi một lần trượt bộ đệm hạ gục cơ sở dữ liệu',
      slug: 'rd-6-3-giam-dap',
      type: 'LESSON',
      description: 'Ba nguyên nhân khác nhau bị gọi chung một tên, đo thật một cú giẫm đạp, và bốn cách chữa: rắc nhiễu TTL, khoá một-lượt-duy-nhất bằng SET NX, tính lại sớm theo xác suất, và phục vụ đồ ôi rồi làm mới ngầm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>The stampede: when a cache miss takes down the database</h2>
<p class="lead">A cache that is working perfectly can destroy your database in the instant it stops working. The failure is not gradual: at 09:00:00 the cache is serving 40,000 requests a second at 3 ms, and at 09:00:01 all 40,000 of them are queries. Three different problems get called "stampede" and they need three different fixes.</p>

<h3>Watching one happen</h3>
<pre><code><span class="tok-comment"># One hot key, 200 concurrent readers, cache-aside with no protection</span>
redis-cli SET hot:homepage '{"data":"…"}' EX 5 &gt;/dev/null
node bench-stampede.js --clients 200 --seconds 20 | tail -6</code></pre>
<div class="out">t=00s  cache hits 39812  db queries 1     p99 3ms
t=05s  cache hits 39104  db queries 187   p99 412ms      ← TTL expired
t=06s  cache hits 39990  db queries 0     p99 3ms
t=10s  cache hits 38221  db queries 194   p99 501ms      ← again
t=15s  cache hits 37109  db queries 200   p99 1204ms     ← DB pool exhausted
totals: 194236 hits, 582 db queries for 4 distinct recomputes</div>
<div class="callout warn"><strong>582 database queries to compute four values.</strong> Every one of those 200 clients checked the cache in the same millisecond, every one of them missed, and every one of them dutifully went to the database — which is exactly what cache-aside says to do. Nothing here is a bug. The pattern has no notion that 199 of those queries are redundant, and at scale that redundancy is the outage: the connection pool fills, queries queue, latency climbs, and the requests that are queuing are <em>also</em> holding the cache-fill they were going to write.</div>

<h3>Three causes, three fixes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Synchronised expiry — a thousand keys, one deadline</span><span class="lz-lnote">A deploy, a warm-up script or a bulk import writes ten thousand keys in the same second with <code>EX 3600</code>. An hour later they all expire in the same second. Nothing is hot, no single key is a problem, and yet the database gets ten thousand simultaneous queries. <strong>Fix: jitter.</strong> One line.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · One hot key — N concurrent misses on the same value</span><span class="lz-lnote">The homepage, the pricing table, the feature-flag blob. Only one key expired, but two hundred requests were in flight when it did, and all of them recompute the identical value. <strong>Fix: single-flight</strong> — a lock, or probabilistic early recompute, or serving stale while one worker refreshes.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Cold cache — the whole thing is empty at once</span><span class="lz-lnote">Redis restarted, a <code>FLUSHDB</code> ran, you deployed a new key prefix, or a failover promoted an empty replica. Now <em>every</em> key misses simultaneously and no per-key trick helps. <strong>Fix: warming</strong> — pre-load the top N keys before taking traffic, and never let a cold instance receive full load unannounced.</span></div>
</div>

<h3>Fix A — jitter, and why it is not optional</h3>
<pre><code>const BASE = 300, JITTER = 60;
const ttl = BASE + Math.floor(Math.random() * JITTER);   <span class="tok-comment">// 300–359s</span>
await redis.set(key, value, { EX: ttl });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Spread the deadline, not the load</span><span class="v">Ten thousand keys expiring across sixty seconds is 166 recomputes a second — absorbable. The same ten thousand in one second is not.</span></div>
  <div class="kv"><span class="k">10–20% of the base TTL is enough</span><span class="v">Enough to break the synchronisation, small enough that nobody has to reason about "how stale can this be" differently.</span></div>
  <div class="kv"><span class="k">It fixes cause 1 and nothing else</span><span class="v">Jitter does not help one hot key at all — that key has one deadline no matter how you randomise it. Do not stop here.</span></div>
  <div class="kv"><span class="k">Put it in the wrapper</span><span class="v">If <code>setCache()</code> jitters and nothing else calls <code>SET</code> directly, it is applied everywhere by construction. If every call site has to remember, half of them will not.</span></div>
  <div class="kv"><span class="k">Jitter up, not down</span><span class="v">Randomising <em>downward</em> from your maximum means you sometimes cache for less time than intended and increase load. Pick the minimum acceptable TTL as the base and add.</span></div>
</div>

<h3>Fix B — single-flight with a lock</h3>
<pre><code>async function getWithLock(key, loader, ttl = 300) {
  const hit = await redis.get(key);
  if (hit !== null) return JSON.parse(hit);

  const lockKey = &#96;lock:\${key}&#96;;
  const token = crypto.randomUUID();
  <span class="tok-comment">// NX = only if absent, EX = the lock can never outlive its holder</span>
  const got = await redis.set(lockKey, token, { NX: true, EX: 10 });

  if (!got) {
    <span class="tok-comment">// someone else is computing it — wait briefly, then read again</span>
    await sleep(50);
    const second = await redis.get(key);
    if (second !== null) return JSON.parse(second);
    return loader();                       <span class="tok-comment">// fall through rather than hang</span>
  }

  try {
    const value = await loader();
    await redis.set(key, JSON.stringify(value), { EX: ttl + jitter() });
    return value;
  } finally {
    <span class="tok-comment">// Release ONLY if we still hold it — see the warning below</span>
    await redis.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      { keys: [lockKey], arguments: [token] });
  }
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SET NX EX is the lock</span><span class="lz-t">one command, atomic, self-expiring</span><span class="lz-d">Exactly one caller gets <code>OK</code>; everyone else gets <code>nil</code>. The <code>EX</code> is not optional — without it, a process that dies while holding the lock blocks every future reader forever.</span></div>
  <div class="lz-step"><span class="lz-k">The token is not decoration</span><span class="lz-t">a plain DEL can release someone else's lock</span><span class="lz-d">If your work takes longer than the 10-second TTL, the lock expires, another worker takes it, and your <code>finally</code> block deletes <em>their</em> lock. Now two workers are inside the critical section and you have a lock that does not lock. Check-then-delete must be atomic, which is why this is a Lua script (Chapter 7).</span></div>
  <div class="lz-step"><span class="lz-k">Losers must not block forever</span><span class="lz-t">wait briefly, re-check, then just do the work</span><span class="lz-d">A waiter that loops until the lock frees turns a slow loader into a pile-up of parked requests. Waiting 50 ms and then falling through costs you a few duplicate queries in the worst case and bounds your latency in all cases.</span></div>
  <div class="lz-step"><span class="lz-k">This is not a distributed lock</span><span class="lz-t">and it does not need to be</span><span class="lz-d">Correctness here means "usually one query instead of two hundred", not "exactly one, guaranteed". A few duplicate recomputes are harmless. If you need real mutual exclusion for correctness — money, inventory — that is a different and much harder problem (Chapter 7).</span></div>
</div>

<h3>Fix C — probabilistic early recompute</h3>
<pre><code><span class="tok-comment">// Store the value WITH how long it took to compute and when it expires</span>
const raw = await redis.get(key);
if (raw) {
  const { value, delta, expiry } = JSON.parse(raw);   <span class="tok-comment">// delta = compute ms</span>
  const now = Date.now();
  <span class="tok-comment">// XFetch: -delta*beta*ln(random) is a small positive number,</span>
  <span class="tok-comment">// so we "pretend" now is slightly later. Bigger delta → refresh earlier.</span>
  const early = now - delta * BETA * Math.log(Math.random());
  if (early &lt; expiry) return value;                    <span class="tok-comment">// still fresh enough</span>
}
<span class="tok-comment">// fell through: recompute BEFORE the key actually expires</span></code></pre>
<div class="callout ok"><strong>The elegant one: nobody waits, and the herd never forms.</strong> Each reader independently rolls a die that gets more likely to say "refresh now" as the expiry approaches, weighted by how expensive the value was to compute. The overwhelming majority of readers get the cached value with zero extra work; one unlucky reader refreshes it slightly early, while the old value is still there to serve everyone else. There is no lock, no waiting, no coordination, and no moment when the key is absent. It comes from the 2015 paper "Optimal Probabilistic Cache Stampede Prevention", <code>beta</code> defaults to 1, and raising it above 1 makes refreshes happen earlier. The cost is that you must store <code>delta</code> and the absolute expiry alongside the value, so the cache entry is a small envelope rather than the raw payload.</div>

<h3>Fix D — serve stale, refresh behind</h3>
<pre><code><span class="tok-comment"># Two TTLs: a logical one you enforce, a physical one Redis enforces</span>
redis-cli SET page:home '{"v":"…","staleAt":1755949300}' EX 3600
<span class="tok-comment"># Reader: past staleAt but the key still exists →</span>
<span class="tok-comment">#   1. return the stale value immediately (nobody waits)</span>
<span class="tok-comment">#   2. try to take the refresh lock; if you get it, recompute in the background</span>
redis-cli SET lock:page:home 1 NX EX 30</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Latency becomes constant</span><span class="v">No user ever waits for a recompute, because there is always something to serve. This is the pattern behind HTTP's <code>stale-while-revalidate</code>, and it is the best user experience of the four.</span></div>
  <div class="kv"><span class="k">Two deadlines, not one</span><span class="v">The logical <code>staleAt</code> says "refresh me"; the physical <code>EX</code> says "I am too old to serve at all". Keep the physical one well above the logical one — that gap is your safety margin when the loader is slow or broken.</span></div>
  <div class="kv"><span class="k">Users can see old data — decide if that is OK</span><span class="v">Fine for a homepage or a listing. Not fine for a balance or a permission check. This is a product decision, not an engineering one.</span></div>
  <div class="kv"><span class="k">Background refresh needs a real background</span><span class="v">A fire-and-forget promise in a request handler can be killed when the response ends, or on a serverless platform when the invocation freezes. Use a job queue if the runtime does not guarantee it finishes.</span></div>
  <div class="kv"><span class="k">Combines well with C</span><span class="v">Probabilistic early refresh decides <em>when</em> to refresh; stale-while-revalidate decides <em>who waits</em> (nobody). Together they are what a mature cache layer looks like.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> cache penetration — the sibling problem nobody protects against. A stampede is many requests for a value that <em>exists</em>. Penetration is many requests for a value that does not: a scraper walking <code>/product/1</code> through <code>/product/9999999</code>, or a bug sending <code>userId=undefined</code>. Every one of those misses, every one queries the database, and every one finds nothing — so nothing is ever cached and the "cache hit rate" looks fine because the requests never reach the point of being counted. Every fix in this lesson is useless here, because the problem is not concurrency. <strong>Cache the negative result</strong>: <code>SET product:999999 "__null__" EX 30</code>, with a short TTL because a row that does not exist today may exist tomorrow, and a sentinel your code recognises so an empty string is not confused with a missing key. For genuinely adversarial traffic across a huge ID space, add a Bloom filter in front (Redis Stack has <code>BF.EXISTS</code>, or keep one in application memory) so you can answer "definitely not in the database" without a query at all. And check your <code>keyspace_misses</code> (Lesson 6.5): a miss rate that does not fall as traffic rises is penetration, not a cold cache.</div>

<a class="link-card" href="https://en.wikipedia.org/wiki/Cache_stampede" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Cache stampede</span><span class="lc-sub">The problem stated cleanly, with locking, external recomputation and probabilistic early expiration compared — and a link to the original XFetch paper the third fix comes from.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">SET NX EX and cache locking</span><span class="lc-sub">Redis's own guidance on the lock-with-a-TTL idiom, why the release must be conditional, and where the pattern's guarantees end.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: survive the herd</span><span class="lc-sub">Graded exercises: reproduce a stampede with 200 clients, fix it four ways and measure each, then find the bug in a lock release that uses a plain <code>DEL</code>.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Three different problems share the name: synchronised expiry (fix with jitter, one line), one hot key with concurrent misses (fix with single-flight), and a cold cache (fix by warming before taking traffic) — and jitter, which everyone reaches for first, does nothing for the second and third. A lock must have a TTL <em>and</em> a token, because releasing with a plain <code>DEL</code> can delete someone else's lock and leave two workers inside the critical section. And the best-feeling fix is serving stale while one worker refreshes behind it: nobody ever waits, at the price of a product decision about how old is too old.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Giẫm đạp: khi một lần trượt bộ đệm hạ gục cơ sở dữ liệu</h2>
<p class="lead">Một bộ đệm đang chạy hoàn hảo có thể phá nát cơ sở dữ liệu của bạn ngay khoảnh khắc nó ngừng chạy. Kiểu hỏng này không từ từ: lúc 09:00:00 bộ đệm phục vụ 40.000 yêu cầu mỗi giây ở mức 3 ms, và lúc 09:00:01 cả 40.000 cái đó đều là truy vấn. Ba vấn đề khác nhau cùng bị gọi là "giẫm đạp" và chúng cần ba cách chữa khác nhau.</p>

<h3>Xem một cú giẫm đạp diễn ra</h3>
<pre><code><span class="tok-comment"># Một khoá nóng, 200 bên đọc đồng thời, cache-aside không có bảo vệ gì</span>
redis-cli SET hot:homepage '{"data":"…"}' EX 5 &gt;/dev/null
node bench-stampede.js --clients 200 --seconds 20 | tail -6</code></pre>
<div class="out">t=00s  cache hits 39812  db queries 1     p99 3ms
t=05s  cache hits 39104  db queries 187   p99 412ms      ← TTL hết hạn
t=06s  cache hits 39990  db queries 0     p99 3ms
t=10s  cache hits 38221  db queries 194   p99 501ms      ← lại nữa
t=15s  cache hits 37109  db queries 200   p99 1204ms     ← cạn gáo kết nối CSDL
totals: 194236 hits, 582 db queries for 4 distinct recomputes</div>
<div class="callout warn"><strong>582 truy vấn cơ sở dữ liệu để tính ra bốn giá trị.</strong> Cả 200 khách đó đều kiểm bộ đệm trong cùng một mili giây, đều trượt, và đều ngoan ngoãn đi xuống cơ sở dữ liệu — vốn đúng là điều cache-aside bảo phải làm. Không có gì ở đây là lỗi cả. Cái khuôn này không có khái niệm rằng 199 trong số các truy vấn đó là thừa, và ở quy mô lớn thì phần thừa ấy chính là sự cố: gáo kết nối đầy lên, truy vấn xếp hàng, độ trễ leo dốc, và những yêu cầu đang xếp hàng ấy <em>đồng thời</em> đang ôm luôn cái phần nạp bộ đệm mà chúng định ghi.</div>

<h3>Ba nguyên nhân, ba cách chữa</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Hết hạn đồng loạt — một nghìn khoá, một cái hạn</span><span class="lz-lnote">Một lần deploy, một script làm ấm hay một lần nhập hàng loạt ghi mười nghìn khoá trong cùng một giây với <code>EX 3600</code>. Một tiếng sau chúng cùng hết hạn trong cùng một giây. Chẳng có gì nóng cả, chẳng khoá đơn lẻ nào là vấn đề, vậy mà cơ sở dữ liệu nhận mười nghìn truy vấn đồng thời. <strong>Chữa: rắc nhiễu.</strong> Một dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Một khoá nóng — N lần trượt đồng thời trên cùng một giá trị</span><span class="lz-lnote">Trang chủ, bảng giá, khối cờ tính năng. Chỉ một khoá hết hạn, nhưng có hai trăm yêu cầu đang bay lúc đó, và tất cả đều tính lại đúng một giá trị y hệt nhau. <strong>Chữa: một-lượt-duy-nhất</strong> — một cái khoá, hoặc tính lại sớm theo xác suất, hoặc phục vụ đồ ôi trong lúc một worker làm mới.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Bộ đệm nguội — cả cái bộ đệm rỗng cùng lúc</span><span class="lz-lnote">Redis vừa khởi động lại, một lệnh <code>FLUSHDB</code> vừa chạy, bạn vừa deploy một tiền tố khoá mới, hoặc một lần chuyển đổi vừa đưa một bản sao rỗng lên làm bản chính. Giờ <em>mọi</em> khoá đều trượt đồng thời và không mẹo theo-từng-khoá nào giúp được. <strong>Chữa: làm ấm</strong> — nạp sẵn N khoá đầu bảng trước khi nhận lưu lượng, và đừng bao giờ để một máy nguội nhận tải đầy mà không báo trước.</span></div>
</div>

<h3>Cách A — rắc nhiễu, và vì sao nó không phải tuỳ chọn</h3>
<pre><code>const BASE = 300, JITTER = 60;
const ttl = BASE + Math.floor(Math.random() * JITTER);   <span class="tok-comment">// 300–359 giây</span>
await redis.set(key, value, { EX: ttl });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Trải cái hạn ra, không phải trải tải</span><span class="v">Mười nghìn khoá hết hạn rải trong sáu mươi giây là 166 lượt tính lại mỗi giây — hấp thụ được. Cũng mười nghìn cái đó trong một giây thì không.</span></div>
  <div class="kv"><span class="k">10–20% của TTL gốc là đủ</span><span class="v">Đủ để phá vỡ sự đồng bộ, đủ nhỏ để không ai phải nghĩ khác đi về câu "cái này được ôi tới mức nào".</span></div>
  <div class="kv"><span class="k">Nó chữa nguyên nhân 1 và không chữa gì khác</span><span class="v">Rắc nhiễu không giúp gì cho một khoá nóng cả — khoá đó có đúng một cái hạn dù bạn ngẫu nhiên hoá kiểu gì. Đừng dừng ở đây.</span></div>
  <div class="kv"><span class="k">Đặt nó vào lớp bọc</span><span class="v">Nếu <code>setCache()</code> tự rắc nhiễu và không chỗ nào khác gọi thẳng <code>SET</code> thì nó được áp ở mọi nơi ngay từ cách dựng. Nếu mỗi chỗ gọi phải tự nhớ thì một nửa sẽ quên.</span></div>
  <div class="kv"><span class="k">Rắc nhiễu lên trên, đừng xuống dưới</span><span class="v">Ngẫu nhiên hoá <em>xuống</em> từ mức tối đa nghĩa là đôi khi bạn đệm ngắn hơn dự định và làm tăng tải. Hãy lấy TTL tối thiểu chấp nhận được làm gốc rồi cộng thêm.</span></div>
</div>

<h3>Cách B — một-lượt-duy-nhất bằng khoá</h3>
<pre><code>async function getWithLock(key, loader, ttl = 300) {
  const hit = await redis.get(key);
  if (hit !== null) return JSON.parse(hit);

  const lockKey = &#96;lock:\${key}&#96;;
  const token = crypto.randomUUID();
  <span class="tok-comment">// NX = chỉ khi chưa có, EX = khoá không thể sống lâu hơn kẻ đang giữ nó</span>
  const got = await redis.set(lockKey, token, { NX: true, EX: 10 });

  if (!got) {
    <span class="tok-comment">// người khác đang tính — chờ một chút, rồi đọc lại</span>
    await sleep(50);
    const second = await redis.get(key);
    if (second !== null) return JSON.parse(second);
    return loader();                       <span class="tok-comment">// đi thẳng chứ đừng treo</span>
  }

  try {
    const value = await loader();
    await redis.set(key, JSON.stringify(value), { EX: ttl + jitter() });
    return value;
  } finally {
    <span class="tok-comment">// CHỈ nhả khi ta vẫn còn đang giữ nó — xem cảnh báo bên dưới</span>
    await redis.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      { keys: [lockKey], arguments: [token] });
  }
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SET NX EX chính là cái khoá</span><span class="lz-t">một lệnh, nguyên tử, tự hết hạn</span><span class="lz-d">Đúng một bên gọi nhận được <code>OK</code>; mọi bên khác nhận <code>nil</code>. Phần <code>EX</code> không phải tuỳ chọn — thiếu nó thì một tiến trình chết trong lúc đang giữ khoá sẽ chặn mọi bên đọc trong tương lai, mãi mãi.</span></div>
  <div class="lz-step"><span class="lz-k">Cái mã thông báo không phải để trang trí</span><span class="lz-t">một lệnh DEL trơn có thể nhả khoá của người khác</span><span class="lz-d">Nếu công việc của bạn lâu hơn TTL 10 giây thì khoá hết hạn, một worker khác lấy nó, và khối <code>finally</code> của bạn xoá mất khoá <em>của họ</em>. Giờ hai worker cùng nằm trong vùng tới hạn và bạn có một cái khoá không khoá gì cả. Phép kiểm-rồi-xoá phải nguyên tử, đó là lý do chỗ này là một script Lua (Chương 7).</span></div>
  <div class="lz-step"><span class="lz-k">Kẻ thua không được chờ mãi</span><span class="lz-t">chờ chút, kiểm lại, rồi cứ làm việc luôn</span><span class="lz-d">Một bên chờ mà lặp cho tới khi khoá được nhả sẽ biến một hàm nạp chậm thành một đống yêu cầu bị đỗ lại. Chờ 50 ms rồi đi thẳng thì tệ nhất là tốn vài truy vấn trùng lặp, và bù lại nó chặn trên độ trễ của bạn trong mọi trường hợp.</span></div>
  <div class="lz-step"><span class="lz-k">Đây không phải khoá phân tán</span><span class="lz-t">và nó không cần phải là thế</span><span class="lz-d">Đúng đắn ở đây nghĩa là "thường thì một truy vấn thay vì hai trăm", chứ không phải "đúng một, có bảo đảm". Vài lượt tính lại trùng nhau thì vô hại. Nếu bạn cần loại trừ lẫn nhau thật sự để giữ tính đúng đắn — tiền bạc, tồn kho — thì đó là một bài toán khác và khó hơn nhiều (Chương 7).</span></div>
</div>

<h3>Cách C — tính lại sớm theo xác suất</h3>
<pre><code><span class="tok-comment">// Lưu giá trị KÈM thời gian tính ra nó và mốc nó hết hạn</span>
const raw = await redis.get(key);
if (raw) {
  const { value, delta, expiry } = JSON.parse(raw);   <span class="tok-comment">// delta = số ms để tính</span>
  const now = Date.now();
  <span class="tok-comment">// XFetch: -delta*beta*ln(random) là một số dương nhỏ,</span>
  <span class="tok-comment">// nên ta "giả vờ" bây giờ muộn hơn thật một chút. delta lớn → làm mới sớm hơn.</span>
  const early = now - delta * BETA * Math.log(Math.random());
  if (early &lt; expiry) return value;                    <span class="tok-comment">// vẫn còn đủ tươi</span>
}
<span class="tok-comment">// rơi xuống đây: tính lại TRƯỚC KHI khoá thật sự hết hạn</span></code></pre>
<div class="callout ok"><strong>Cách thanh lịch: không ai phải chờ, và đàn giẫm đạp không bao giờ hình thành.</strong> Mỗi bên đọc tự gieo một con xúc xắc mà xác suất nói "làm mới ngay" tăng dần khi mốc hết hạn tới gần, có trọng số theo việc tính ra giá trị đó đắt tới đâu. Tuyệt đại đa số bên đọc nhận giá trị đã đệm mà không tốn thêm việc gì; đúng một bên đọc xui xẻo làm mới nó sớm hơn một chút, trong lúc giá trị cũ vẫn còn đó để phục vụ mọi người khác. Không khoá, không chờ, không phối hợp, và không có khoảnh khắc nào cái khoá vắng mặt. Nó đến từ bài báo năm 2015 "Optimal Probabilistic Cache Stampede Prevention", <code>beta</code> mặc định là 1, và nâng nó trên 1 làm các lượt làm mới xảy ra sớm hơn. Cái giá là bạn phải lưu <code>delta</code> và mốc hết hạn tuyệt đối cạnh giá trị, nên một mục trong bộ đệm là một cái phong bì nhỏ chứ không còn là dữ liệu thô.</div>

<h3>Cách D — phục vụ đồ ôi, làm mới phía sau</h3>
<pre><code><span class="tok-comment"># Hai cái TTL: một cái logic do bạn ép, một cái vật lý do Redis ép</span>
redis-cli SET page:home '{"v":"…","staleAt":1755949300}' EX 3600
<span class="tok-comment"># Bên đọc: đã quá staleAt nhưng khoá vẫn còn →</span>
<span class="tok-comment">#   1. trả về giá trị ôi ngay lập tức (không ai phải chờ)</span>
<span class="tok-comment">#   2. thử giành khoá làm mới; giành được thì tính lại ở nền</span>
redis-cli SET lock:page:home 1 NX EX 30</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Độ trễ trở thành hằng số</span><span class="v">Không người dùng nào phải chờ một lượt tính lại, vì luôn có thứ gì đó để phục vụ. Đây là khuôn nằm sau <code>stale-while-revalidate</code> của HTTP, và là trải nghiệm người dùng tốt nhất trong bốn cách.</span></div>
  <div class="kv"><span class="k">Hai cái hạn, không phải một</span><span class="v">Cái <code>staleAt</code> logic nói "làm mới tôi đi"; cái <code>EX</code> vật lý nói "tôi già quá rồi, đừng phục vụ nữa". Hãy giữ cái vật lý cao hơn hẳn cái logic — khoảng cách đó là biên an toàn của bạn khi hàm nạp chậm hoặc hỏng.</span></div>
  <div class="kv"><span class="k">Người dùng có thể thấy dữ liệu cũ — hãy quyết xem có ổn không</span><span class="v">Ổn với trang chủ hay một trang danh sách. Không ổn với số dư hay một phép kiểm quyền. Đây là quyết định về sản phẩm, không phải về kỹ thuật.</span></div>
  <div class="kv"><span class="k">Làm mới ở nền cần một cái nền thật</span><span class="v">Một promise bắn-rồi-quên trong bộ xử lý yêu cầu có thể bị giết khi câu trả lời kết thúc, hoặc trên nền serverless khi lượt gọi bị đóng băng. Hãy dùng một hàng đợi việc nếu môi trường chạy không bảo đảm nó chạy xong.</span></div>
  <div class="kv"><span class="k">Ghép rất hợp với cách C</span><span class="v">Tính lại sớm theo xác suất quyết định <em>khi nào</em> làm mới; phục vụ-đồ-ôi-rồi-làm-mới quyết định <em>ai phải chờ</em> (không ai cả). Ghép lại thì đó là hình dáng của một tầng bộ đệm trưởng thành.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> xuyên thủng bộ đệm — bài toán anh em mà chẳng ai phòng. Giẫm đạp là nhiều yêu cầu cho một giá trị <em>có tồn tại</em>. Xuyên thủng là nhiều yêu cầu cho một giá trị không tồn tại: một con bot đi từ <code>/product/1</code> tới <code>/product/9999999</code>, hoặc một lỗi gửi lên <code>userId=undefined</code>. Cái nào cũng trượt, cái nào cũng truy vấn cơ sở dữ liệu, và cái nào cũng chẳng tìm thấy gì — nên chẳng có gì được đệm cả, còn "tỉ lệ trúng bộ đệm" thì nhìn vẫn đẹp vì những yêu cầu đó không bao giờ đi tới chỗ được đếm. Mọi cách chữa trong bài này đều vô dụng ở đây, vì vấn đề không phải là tính đồng thời. <strong>Hãy đệm cả kết quả rỗng</strong>: <code>SET product:999999 "__null__" EX 30</code>, với TTL ngắn vì một dòng không tồn tại hôm nay có thể tồn tại ngày mai, và với một giá trị canh mà mã của bạn nhận ra được để không nhầm chuỗi rỗng với khoá vắng mặt. Với lưu lượng thật sự thù địch trải trên một không gian mã khổng lồ, hãy đặt thêm một bộ lọc Bloom ở phía trước (Redis Stack có <code>BF.EXISTS</code>, hoặc giữ một cái trong bộ nhớ ứng dụng) để bạn trả lời được "chắc chắn không có trong cơ sở dữ liệu" mà không cần truy vấn nào. Và hãy nhìn <code>keyspace_misses</code> của bạn (Bài 6.5): một tỉ lệ trượt không giảm khi lưu lượng tăng là xuyên thủng, không phải bộ đệm nguội.</div>

<a class="link-card" href="https://en.wikipedia.org/wiki/Cache_stampede" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Cache stampede</span><span class="lc-sub">Bài toán được phát biểu rành mạch, có so sánh giữa khoá, tính lại từ bên ngoài và hết hạn sớm theo xác suất — kèm liên kết tới bài báo XFetch gốc mà cách chữa thứ ba lấy ra từ đó.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">SET NX EX và khoá cho bộ đệm</span><span class="lc-sub">Hướng dẫn của chính Redis về lối viết khoá-kèm-TTL, vì sao phép nhả phải có điều kiện, và những bảo đảm của khuôn này kết thúc ở đâu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: sống sót qua đàn giẫm đạp</span><span class="lc-sub">Bài chấm điểm: tái hiện một cú giẫm đạp với 200 khách, chữa nó bằng bốn cách rồi đo từng cách, sau đó tìm lỗi trong một phép nhả khoá dùng <code>DEL</code> trơn.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Ba vấn đề khác nhau dùng chung cái tên: hết hạn đồng loạt (chữa bằng rắc nhiễu, một dòng), một khoá nóng bị trượt đồng thời (chữa bằng một-lượt-duy-nhất), và bộ đệm nguội (chữa bằng làm ấm trước khi nhận lưu lượng) — và rắc nhiễu, thứ ai cũng với tay lấy đầu tiên, chẳng làm được gì cho hai cái sau. Một cái khoá phải có TTL <em>và</em> một mã thông báo, vì nhả bằng <code>DEL</code> trơn có thể xoá mất khoá của người khác và để hai worker cùng nằm trong vùng tới hạn. Và cách chữa cho cảm giác tốt nhất là phục vụ đồ ôi trong lúc một worker làm mới phía sau: không ai phải chờ, với cái giá là một quyết định về sản phẩm rằng cũ tới đâu thì là quá cũ.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Consistency: the cache and the database disagree|||6.4 — Nhất quán: khi bộ đệm và cơ sở dữ liệu nói khác nhau',
      slug: 'rd-6-4-nhat-quan',
      type: 'LESSON',
      description: 'Bốn thứ tự ghi có thể chọn và lần vết cuộc đua của từng cái, vì sao ghi-CSDL-rồi-xoá-bộ-đệm thắng mà vẫn chưa kín, xoá hai lần có trễ, đọc-thấy-cái-mình-vừa-ghi, và vì sao câu trả lời công nghiệp là bắt thay đổi từ nhật ký giao dịch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Consistency: the cache and the database disagree</h2>
<p class="lead">You have two stores and no transaction spanning them. Every write therefore has a window — between touching the first and touching the second — in which a concurrent reader can observe a state that is not consistent with either. You cannot close that window. What you can do is choose which ordering makes it small, rare and self-healing instead of large, common and permanent.</p>

<h3>Four orderings, ranked worst to best</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Worst — update the cache, then the database</span><span class="lz-lnote">If the database write fails, the cache now holds a value that was never committed anywhere. Your cache is not stale, it is <em>fictional</em>, and it will serve that fiction until the TTL. Never do this.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Bad — delete the cache, then update the database</span><span class="lz-lnote">The window between the delete and the commit is wide open, and any reader that misses in that window reads the <em>old</em> row and writes it back. The stale value is now freshly cached with a full TTL. This is the ordering that feels natural ("clear it first!") and is the one that reliably bites.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠ Tempting — update the database, then update the cache</span><span class="lz-lnote">No fiction, but two concurrent writers can interleave so the older value lands in the cache last: A writes DB(1), B writes DB(2), B writes cache(2), A writes cache(1). The database says 2, the cache says 1, for a full TTL. Writing values into a cache is always a race; deleting never is.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ Best — update the database, then delete the cache</span><span class="lz-lnote">Cache-aside with invalidation. Delete is idempotent, so concurrent writers cannot order themselves wrongly; whoever reads next reloads the committed truth. This is what you should write, and it still has one rare race — below.</span></div>
</div>
<pre><code><span class="tok-comment">// The ordering to write. Note: DB first, delete second, and the delete</span>
<span class="tok-comment">// is best-effort — the TTL is what makes it safe if this line never runs.</span>
await db.$transaction(async (tx) =&gt; {
  await tx.product.update({ where: { id }, data });
});
await redis.unlink(&#96;product:\${id}&#96;).catch(logAndContinue);</code></pre>

<h3>The race that survives the best ordering</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">T0 · Reader R misses</span><span class="lz-t">GET product:42 → nil</span><span class="lz-d">The key expired a moment ago. R is about to go to the database. Nothing is wrong yet.</span></div>
  <div class="lz-step"><span class="lz-k">T1 · R reads the old row</span><span class="lz-t">SELECT … → price = 129900</span><span class="lz-d">R now holds a value in a local variable. It is correct <em>as of T1</em>. R is then slow — GC pause, a network hiccup, a busy event loop.</span></div>
  <div class="lz-step"><span class="lz-k">T2 · Writer W commits and deletes</span><span class="lz-t">UPDATE … price = 99900 · UNLINK product:42</span><span class="lz-d">W does everything right, in the right order. It deletes a key that does not currently exist, which succeeds and does nothing.</span></div>
  <div class="lz-step"><span class="lz-k">T3 · R finally writes its stale value</span><span class="lz-t">SET product:42 129900 EX 300</span><span class="lz-d">The cache now holds a price the database has not had since T2, and it will hold it for the full TTL. No error, no log line, no alert. This is the window, and it is the only one the best ordering leaves open.</span></div>
</div>
<div class="callout"><strong>How worried to be: it needs a reader to be slower than an entire write transaction, in a window that opens only on a miss.</strong> In practice that is rare — the reader has to stall between its SELECT and its SET for longer than W takes to commit and delete. It is not <em>never</em>: a GC pause, a slow serialisation step, or an oversubscribed container will do it. And the consequence is bounded by the TTL, which is precisely why Lesson 6.2 insists the TTL stays as a backstop even when you invalidate explicitly. For most applications, "rare and bounded by 300 seconds" is the right amount of wrong. When it is not, you have three real options, below.</div>

<h3>Three ways to close it further</h3>
<pre><code><span class="tok-comment">// 1 · Delayed double delete — cheap, covers the T3 write-back</span>
await db.product.update({ where: { id }, data });
await redis.unlink(key);
setTimeout(() =&gt; redis.unlink(key).catch(noop), 500);   <span class="tok-comment">// again, after the window</span>

<span class="tok-comment">// 2 · Set a short TTL instead of deleting — bounds the damage explicitly</span>
await redis.expire(key, 5);        <span class="tok-comment">// a late write-back can only live 5s</span>

<span class="tok-comment">// 3 · Version the value and refuse to go backwards (needs Lua, Chapter 7)</span>
<span class="tok-comment">//    store {v: rowVersion, data}; on write, only overwrite if v is newer</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Delayed double delete</span><span class="v">The second delete happens after any in-flight reader would have written back. Crude, effective, and it needs a real background mechanism — a <code>setTimeout</code> dies with the process, so use a job queue if it matters.</span></div>
  <div class="kv"><span class="k">Short TTL after a write</span><span class="v">Instead of deleting, <code>EXPIRE key 5</code>. Any stale value written into that window can only survive five seconds. Simple, no background work, and it costs you a guaranteed miss shortly after every write.</span></div>
  <div class="kv"><span class="k">Version guards</span><span class="v">Store the row's <code>updatedAt</code> or version alongside the value, and make the cache-fill refuse to overwrite a newer entry with an older one. Correct, and it requires Lua because compare-and-set is not one Redis command (Chapter 7).</span></div>
  <div class="kv"><span class="k"><code>MULTI</code> does not help here</span><span class="v">A Redis transaction makes Redis commands atomic <em>with each other</em>. It knows nothing about your database, so it cannot make "commit the row and delete the key" atomic. There is no distributed transaction available to you (Chapter 7).</span></div>
  <div class="kv"><span class="k">Do not reach for two-phase commit</span><span class="v">You could build one. It would make every write slower, add a coordinator that can itself fail, and buy you a guarantee that a 300-second TTL was already giving you approximately. This is the wrong hill.</span></div>
</div>

<h3>Read-your-writes: the bug users actually report</h3>
<pre><code><span class="tok-comment">// User edits their bio and the next page load shows the OLD bio.</span>
<span class="tok-comment">// The invalidation worked; the read went to a REPLICA that has not</span>
<span class="tok-comment">// caught up, and cached that stale row for 300 seconds.</span>

<span class="tok-comment">// Fix: after a write, pin this user's reads to the primary briefly</span>
await redis.set(&#96;pin:\${userId}&#96;, '1', { EX: 10 });

<span class="tok-comment">// …in the read path</span>
const pinned = await redis.exists(&#96;pin:\${userId}&#96;);
const row = pinned
  ? await dbPrimary.user.findUnique({ where: { id: userId } })
  : await dbReplica.user.findUnique({ where: { id: userId } });
if (!pinned) await redis.set(key, JSON.stringify(row), { EX: ttl });</code></pre>
<div class="callout warn"><strong>Replica lag turns a correct invalidation into a permanently stale cache.</strong> The sequence is: write to the primary → delete the cache key → the very next read misses → it queries a read replica that is 40 ms behind → it gets the pre-write row → it caches that for the full TTL. Every step behaved correctly and the outcome is wrong for five minutes. This is the single most common "the cache is broken" report on any system with read replicas, and the invalidation code is never the culprit. Two fixes: pin a user's reads to the primary for a few seconds after their own write (above), or do not fill the cache from a replica at all — reads served from a replica are returned but not cached. And note that Redis replicas have exactly the same property (Chapter 11), so a read-scaled Redis reintroduces the problem one layer up.</div>

<h3>The industrial answer: let the database tell you</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Read the write-ahead log</span><span class="lz-t">Postgres logical replication · MySQL binlog</span><span class="lz-d">The database already writes an ordered, durable record of every committed change. Debezium and similar tools turn that into a stream of change events — which is a stream of exactly the invalidations you need, derived from the commit itself rather than from your application remembering.</span></div>
  <div class="lz-step"><span class="lz-k">Invalidation stops being your code's job</span><span class="lz-t">a consumer maps change events → UNLINK</span><span class="lz-d">Every write path is covered automatically: the admin panel, the migration script, the manual <code>psql</code> session at 2am, the third-party integration. All the places that <em>forgot</em> to invalidate are the whole point.</span></div>
  <div class="lz-step"><span class="lz-k">The race narrows to the log lag</span><span class="lz-t">typically milliseconds, and strictly ordered</span><span class="lz-d">The event cannot arrive before the commit, because it is derived from the commit. That eliminates the "cache the pre-write row" family of races entirely — you are no longer racing, you are following.</span></div>
  <div class="lz-step"><span class="lz-k">The cost is a pipeline to operate</span><span class="lz-t">Kafka or Redpanda, a connector, a consumer, monitoring</span><span class="lz-d">Which is why this is the right answer at a certain size and the wrong answer below it. If a stale price for 300 seconds is survivable, a TTL plus write-then-delete is the correct engineering decision, and this is over-building.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> chasing perfect consistency between a cache and a database, and building something worse than the staleness you were avoiding. Every mechanism above adds failure modes: the delayed second delete needs a background job that can be lost, the version guard needs a script that must stay in sync with your schema, the CDC pipeline is a distributed system with its own outages, lag and on-call rotation. Meanwhile the honest question — "what actually happens if this value is wrong for sixty seconds?" — usually has the answer "nothing anyone notices", and the correct design is a short TTL, write-then-delete, and moving on. Save the machinery for the specific fields that genuinely cannot be stale — a price, a permission, a balance — and let everything else be eventually consistent on purpose. Decide it per field, write the decision down, and be suspicious of anyone (including yourself) who wants strong consistency out of a cache. If you truly need it, the answer is not to cache that field.</div>

<a class="link-card" href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Two Hard Things</span><span class="lc-sub">Fowler's short note on the Karlton quote, and a good reminder of why "just invalidate it correctly" is not the trivial instruction it sounds like.</span></span>
</a>
<a class="link-card" href="https://debezium.io/documentation/reference/stable/tutorial.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Debezium: change data capture</span><span class="lc-sub">The tutorial for turning a Postgres or MySQL commit log into a change event stream. Read it to understand the shape even if you decide not to run it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the stale read</span><span class="lc-sub">Graded exercises: trace all four orderings against a concurrent reader, fix a handler that deletes before it commits, and diagnose a "cache is broken" report whose real cause is replica lag.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Write the database first and <em>delete</em> the cache second — deleting is idempotent so concurrent writers cannot order themselves wrongly, while writing values into a cache always can. That ordering still leaves one rare race, where a slow reader writes back a pre-write value, which is exactly why the TTL must stay as a backstop under every explicit invalidation. And when a "the cache is broken" report arrives on a system with read replicas, suspect replica lag before your invalidation code: a read that misses, queries a lagging replica and caches the pre-write row is correct at every step and wrong for the whole TTL.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Nhất quán: khi bộ đệm và cơ sở dữ liệu nói khác nhau</h2>
<p class="lead">Bạn có hai kho lưu và không có giao dịch nào trải qua cả hai. Vì thế mỗi lượt ghi đều có một cửa sổ — nằm giữa lúc chạm vào cái thứ nhất và lúc chạm vào cái thứ hai — mà trong đó một bên đọc đồng thời có thể quan sát thấy một trạng thái không khớp với bên nào cả. Bạn không đóng được cửa sổ ấy. Thứ bạn làm được là chọn cái thứ tự khiến nó nhỏ, hiếm và tự lành, thay vì lớn, thường xuyên và vĩnh viễn.</p>

<h3>Bốn thứ tự, xếp từ tệ nhất tới tốt nhất</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Tệ nhất — cập nhật bộ đệm, rồi mới tới cơ sở dữ liệu</span><span class="lz-lnote">Nếu lượt ghi xuống cơ sở dữ liệu hỏng thì bộ đệm giờ giữ một giá trị chưa từng được ghi nhận ở đâu cả. Bộ đệm của bạn không phải là ôi, nó là <em>bịa</em>, và nó sẽ phục vụ điều bịa đó cho tới hết TTL. Đừng bao giờ làm thế này.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Dở — xoá bộ đệm, rồi mới cập nhật cơ sở dữ liệu</span><span class="lz-lnote">Cửa sổ giữa lúc xoá và lúc giao dịch kết thúc mở toang, và bất cứ bên đọc nào trượt trong cửa sổ đó sẽ đọc ra dòng <em>cũ</em> rồi ghi nó ngược trở lại. Giá trị ôi giờ vừa được đệm tươi mới với trọn một TTL. Đây là thứ tự nghe rất tự nhiên ("xoá nó trước đã!") và là thứ tự cắn bạn một cách đều đặn.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠ Hấp dẫn — cập nhật cơ sở dữ liệu, rồi cập nhật bộ đệm</span><span class="lz-lnote">Không bịa, nhưng hai bên ghi đồng thời có thể xen kẽ sao cho giá trị cũ hơn rơi vào bộ đệm sau cùng: A ghi CSDL(1), B ghi CSDL(2), B ghi đệm(2), A ghi đệm(1). Cơ sở dữ liệu nói 2, bộ đệm nói 1, suốt trọn một TTL. Ghi giá trị vào bộ đệm luôn là một cuộc đua; xoá thì không bao giờ.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ Tốt nhất — cập nhật cơ sở dữ liệu, rồi xoá bộ đệm</span><span class="lz-lnote">Cache-aside kèm vô hiệu hoá. Xoá thì gọi bao nhiêu lần cũng ra một kết quả, nên các bên ghi đồng thời không thể tự xếp sai thứ tự; ai đọc tiếp theo sẽ nạp lại sự thật đã ghi nhận. Đây là thứ bạn nên viết, và nó vẫn còn đúng một cuộc đua hiếm — ngay dưới đây.</span></div>
</div>
<pre><code><span class="tok-comment">// Thứ tự nên viết. Lưu ý: CSDL trước, xoá sau, và phép xoá là</span>
<span class="tok-comment">// cố-gắng-hết-sức — chính TTL mới là thứ giữ an toàn nếu dòng này không chạy.</span>
await db.$transaction(async (tx) =&gt; {
  await tx.product.update({ where: { id }, data });
});
await redis.unlink(&#96;product:\${id}&#96;).catch(logAndContinue);</code></pre>

<h3>Cuộc đua sống sót qua cả thứ tự tốt nhất</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">T0 · Bên đọc R trượt</span><span class="lz-t">GET product:42 → nil</span><span class="lz-d">Khoá vừa hết hạn một khoảnh khắc trước. R sắp đi xuống cơ sở dữ liệu. Chưa có gì sai cả.</span></div>
  <div class="lz-step"><span class="lz-k">T1 · R đọc ra dòng cũ</span><span class="lz-t">SELECT … → price = 129900</span><span class="lz-d">R giờ đang giữ một giá trị trong biến cục bộ. Nó đúng <em>tính tới thời điểm T1</em>. Rồi R chậm lại — một nhịp dọn rác, một cú vấp mạng, một vòng lặp sự kiện đang bận.</span></div>
  <div class="lz-step"><span class="lz-k">T2 · Bên ghi W ghi nhận và xoá</span><span class="lz-t">UPDATE … price = 99900 · UNLINK product:42</span><span class="lz-d">W làm mọi thứ đúng, theo đúng thứ tự. Nó xoá một khoá hiện không tồn tại, lệnh thành công và chẳng làm gì cả.</span></div>
  <div class="lz-step"><span class="lz-k">T3 · R cuối cùng cũng ghi giá trị ôi của nó</span><span class="lz-t">SET product:42 129900 EX 300</span><span class="lz-d">Bộ đệm giờ giữ một cái giá mà cơ sở dữ liệu không còn dùng kể từ T2, và nó sẽ giữ suốt trọn TTL. Không lỗi, không dòng nhật ký, không cảnh báo. Đây là cái cửa sổ, và là cửa sổ duy nhất mà thứ tự tốt nhất còn để hở.</span></div>
</div>
<div class="callout"><strong>Lo tới mức nào: nó đòi một bên đọc phải chậm hơn cả một giao dịch ghi trọn vẹn, trong một cửa sổ chỉ mở ra khi có trượt.</strong> Trong thực tế chuyện đó hiếm — bên đọc phải khựng lại giữa lệnh SELECT và lệnh SET của nó lâu hơn thời gian W ghi nhận rồi xoá. Nhưng không phải <em>không bao giờ</em>: một nhịp dọn rác, một bước tuần tự hoá chậm, hay một container bị nhồi quá tải là đủ. Và hậu quả bị chặn trên bởi TTL, đó chính xác là lý do Bài 6.2 nhất quyết bắt giữ TTL làm lưới đỡ kể cả khi bạn đã vô hiệu hoá tường minh. Với phần lớn ứng dụng thì "hiếm và bị chặn trong 300 giây" là mức sai vừa phải. Khi nó không vừa phải, bạn có ba lựa chọn thật, ngay dưới.</div>

<h3>Ba cách thu hẹp nó thêm</h3>
<pre><code><span class="tok-comment">// 1 · Xoá hai lần có trễ — rẻ, phủ được lượt ghi ngược ở T3</span>
await db.product.update({ where: { id }, data });
await redis.unlink(key);
setTimeout(() =&gt; redis.unlink(key).catch(noop), 500);   <span class="tok-comment">// lại lần nữa, sau cửa sổ</span>

<span class="tok-comment">// 2 · Đặt TTL ngắn thay vì xoá — chặn thiệt hại một cách tường minh</span>
await redis.expire(key, 5);        <span class="tok-comment">// một lượt ghi ngược muộn chỉ sống được 5 giây</span>

<span class="tok-comment">// 3 · Gắn phiên bản vào giá trị và từ chối đi lùi (cần Lua, Chương 7)</span>
<span class="tok-comment">//    lưu {v: rowVersion, data}; khi ghi, chỉ đè nếu v mới hơn</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá hai lần có trễ</span><span class="v">Lần xoá thứ hai xảy ra sau khi mọi bên đọc đang bay lẽ ra đã ghi ngược xong. Thô thiển, hiệu quả, và nó cần một cơ chế chạy nền thật — một <code>setTimeout</code> chết theo tiến trình, nên hãy dùng hàng đợi việc nếu chuyện đó quan trọng.</span></div>
  <div class="kv"><span class="k">TTL ngắn sau một lượt ghi</span><span class="v">Thay vì xoá thì <code>EXPIRE key 5</code>. Bất cứ giá trị ôi nào lọt vào cửa sổ đó chỉ sống được năm giây. Đơn giản, không cần việc chạy nền, và cái giá là một lần trượt chắc chắn ngay sau mỗi lượt ghi.</span></div>
  <div class="kv"><span class="k">Chốt bằng phiên bản</span><span class="v">Lưu <code>updatedAt</code> hay số phiên bản của dòng cạnh giá trị, và bắt lượt nạp bộ đệm từ chối đè một mục mới hơn bằng một mục cũ hơn. Đúng đắn, và cần Lua vì so-sánh-rồi-đặt không phải một lệnh Redis (Chương 7).</span></div>
  <div class="kv"><span class="k"><code>MULTI</code> không giúp gì ở đây</span><span class="v">Một giao dịch Redis làm cho các lệnh Redis nguyên tử <em>với nhau</em>. Nó không biết gì về cơ sở dữ liệu của bạn, nên nó không thể làm cho "ghi nhận dòng và xoá khoá" thành nguyên tử. Bạn không có sẵn giao dịch phân tán nào (Chương 7).</span></div>
  <div class="kv"><span class="k">Đừng với tay lấy two-phase commit</span><span class="v">Bạn dựng được một cái. Nó sẽ làm mọi lượt ghi chậm đi, thêm một bộ điều phối mà bản thân nó cũng hỏng được, và mua về cho bạn một bảo đảm mà một cái TTL 300 giây vốn đã cho bạn xấp xỉ như vậy. Đây là ngọn đồi sai.</span></div>
</div>

<h3>Đọc-thấy-cái-mình-vừa-ghi: cái lỗi người dùng thật sự báo</h3>
<pre><code><span class="tok-comment">// Người dùng sửa tiểu sử và lượt tải trang tiếp theo hiện tiểu sử CŨ.</span>
<span class="tok-comment">// Phép vô hiệu hoá đã chạy đúng; lượt đọc đi vào một BẢN SAO chưa</span>
<span class="tok-comment">// bắt kịp, và đã đệm cái dòng ôi đó suốt 300 giây.</span>

<span class="tok-comment">// Chữa: sau một lượt ghi, ghim lượt đọc của người này vào bản chính một lát</span>
await redis.set(&#96;pin:\${userId}&#96;, '1', { EX: 10 });

<span class="tok-comment">// …trong nhánh đọc</span>
const pinned = await redis.exists(&#96;pin:\${userId}&#96;);
const row = pinned
  ? await dbPrimary.user.findUnique({ where: { id: userId } })
  : await dbReplica.user.findUnique({ where: { id: userId } });
if (!pinned) await redis.set(key, JSON.stringify(row), { EX: ttl });</code></pre>
<div class="callout warn"><strong>Độ trễ của bản sao biến một phép vô hiệu hoá đúng đắn thành một bộ đệm ôi vĩnh viễn.</strong> Trình tự là: ghi xuống bản chính → xoá khoá bộ đệm → ngay lượt đọc kế tiếp trượt → nó truy vấn một bản sao đọc đang chậm 40 ms → nó lấy về dòng trước-khi-ghi → nó đệm cái đó suốt trọn TTL. Mọi bước đều cư xử đúng và kết quả thì sai suốt năm phút. Đây là phiếu báo "bộ đệm hỏng rồi" phổ biến nhất trên mọi hệ thống có bản sao đọc, và mã vô hiệu hoá không bao giờ là thủ phạm. Hai cách chữa: ghim lượt đọc của một người vào bản chính trong vài giây sau lượt ghi của chính họ (ở trên), hoặc đừng nạp bộ đệm từ bản sao chút nào — lượt đọc phục vụ từ bản sao thì trả về nhưng không đệm. Và lưu ý rằng bản sao Redis cũng có đúng tính chất đó (Chương 11), nên một Redis được mở rộng để đọc sẽ dựng lại chính bài toán này ở tầng trên.</div>

<h3>Câu trả lời công nghiệp: để cơ sở dữ liệu tự báo cho bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đọc nhật ký ghi-trước</span><span class="lz-t">Postgres logical replication · MySQL binlog</span><span class="lz-d">Cơ sở dữ liệu vốn đã ghi ra một bản ghi có thứ tự và bền vững cho mọi thay đổi đã ghi nhận. Debezium và các công cụ tương tự biến nó thành một dòng sự kiện thay đổi — vốn chính là dòng các phép vô hiệu hoá bạn cần, suy ra từ chính lần ghi nhận chứ không phải từ việc ứng dụng của bạn nhớ ra.</span></div>
  <div class="lz-step"><span class="lz-k">Vô hiệu hoá thôi là việc của mã bạn</span><span class="lz-t">một bên tiêu thụ ánh xạ sự kiện thay đổi → UNLINK</span><span class="lz-d">Mọi nhánh ghi đều được phủ tự động: trang quản trị, script di trú, phiên <code>psql</code> gõ tay lúc 2 giờ sáng, phần tích hợp của bên thứ ba. Chính những chỗ <em>quên</em> vô hiệu hoá mới là điểm mấu chốt.</span></div>
  <div class="lz-step"><span class="lz-k">Cuộc đua thu hẹp về đúng độ trễ của nhật ký</span><span class="lz-t">thường là mili giây, và có thứ tự chặt</span><span class="lz-d">Sự kiện không thể tới trước lần ghi nhận, vì nó được suy ra từ chính lần ghi nhận đó. Điều này loại bỏ hoàn toàn cả họ cuộc đua kiểu "đệm dòng trước-khi-ghi" — bạn không còn đua nữa, bạn đang đi theo sau.</span></div>
  <div class="lz-step"><span class="lz-k">Cái giá là một đường ống phải vận hành</span><span class="lz-t">Kafka hoặc Redpanda, một connector, một bên tiêu thụ, giám sát</span><span class="lz-d">Đó là lý do đây là câu trả lời đúng ở một quy mô nhất định và là câu trả lời sai ở dưới quy mô đó. Nếu một cái giá ôi 300 giây là sống được thì TTL cộng ghi-rồi-xoá mới là quyết định kỹ thuật đúng, còn cái này là xây quá tay.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> chạy theo sự nhất quán hoàn hảo giữa bộ đệm và cơ sở dữ liệu, rồi dựng ra thứ còn tệ hơn cái ôi thiu bạn đang né. Mọi cơ chế ở trên đều thêm kiểu hỏng: lần xoá thứ hai có trễ cần một việc chạy nền mà việc đó mất được, cái chốt phiên bản cần một script phải luôn đồng bộ với lược đồ của bạn, đường ống CDC là một hệ phân tán có sự cố riêng, độ trễ riêng và ca trực riêng. Trong khi đó câu hỏi thành thật — "nếu giá trị này sai trong sáu mươi giây thì thật sự xảy ra chuyện gì?" — thường có đáp án là "chẳng ai nhận ra", và thiết kế đúng là một TTL ngắn, ghi-rồi-xoá, rồi đi làm việc khác. Hãy để dành bộ máy đó cho đúng những trường thật sự không được ôi — một cái giá, một cái quyền, một số dư — và để mọi thứ còn lại nhất quán dần một cách có chủ ý. Hãy quyết theo từng trường, viết quyết định đó ra giấy, và hãy nghi ngờ bất cứ ai (kể cả chính bạn) muốn có nhất quán mạnh từ một cái bộ đệm. Nếu bạn thật sự cần nó thì câu trả lời là đừng đệm trường đó.</div>

<a class="link-card" href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Two Hard Things</span><span class="lc-sub">Ghi chú ngắn của Fowler về câu nói của Karlton, và một lời nhắc tốt vì sao "cứ vô hiệu hoá cho đúng là được" không phải chỉ dẫn tầm thường như nó nghe.</span></span>
</a>
<a class="link-card" href="https://debezium.io/documentation/reference/stable/tutorial.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Debezium: bắt thay đổi dữ liệu</span><span class="lc-sub">Bài hướng dẫn biến nhật ký ghi nhận của Postgres hay MySQL thành một dòng sự kiện thay đổi. Hãy đọc để hiểu hình dáng của nó kể cả khi bạn quyết định không chạy nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tìm ra lượt đọc ôi</span><span class="lc-sub">Bài chấm điểm: lần vết cả bốn thứ tự với một bên đọc đồng thời, sửa một bộ xử lý xoá trước khi ghi nhận, và chẩn đoán một phiếu báo "bộ đệm hỏng" mà nguyên nhân thật là độ trễ bản sao.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy ghi cơ sở dữ liệu trước và <em>xoá</em> bộ đệm sau — xoá thì gọi bao nhiêu lần cũng ra một kết quả nên các bên ghi đồng thời không thể tự xếp sai thứ tự, trong khi ghi giá trị vào bộ đệm thì luôn có thể. Thứ tự đó vẫn để hở đúng một cuộc đua hiếm, nơi một bên đọc chậm ghi ngược một giá trị trước-khi-ghi, và đó chính xác là lý do TTL phải nằm lại làm lưới đỡ dưới mọi phép vô hiệu hoá tường minh. Và khi một phiếu báo "bộ đệm hỏng" tới trên một hệ thống có bản sao đọc, hãy nghi độ trễ bản sao trước khi nghi mã vô hiệu hoá của bạn: một lượt đọc bị trượt, truy vấn một bản sao đang chậm rồi đệm dòng trước-khi-ghi là đúng ở mọi bước và sai suốt trọn TTL.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Measuring a cache: is it even helping?|||6.5 — Đo bộ đệm: nó có giúp gì không đã?',
      slug: 'rd-6-5-do-bo-dem',
      type: 'LESSON',
      description: 'keyspace_hits với keyspace_misses và điểm mù chí mạng của chúng, vì sao tỉ lệ trúng 99% có thể tệ hơn 60%, đo bằng số việc tiết kiệm được chứ không bằng tỉ lệ, SLOWLOG với commandstats với --latency, và bốn thứ đáng đặt cảnh báo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Measuring a cache: is it even helping?</h2>
<p class="lead">Almost every team measures cache hit ratio, and almost every team draws the wrong conclusion from it. A 99% hit ratio can mean your cache is useless and a 60% one can mean it is carrying the entire service. The number that matters is not the ratio — it is the work you avoided.</p>

<h3>What Redis will tell you</h3>
<pre><code>redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses|expired_keys|evicted_keys"
redis-cli INFO keyspace
redis-cli INFO commandstats | head -6
redis-cli --stat -i 2</code></pre>
<div class="out">keyspace_hits:8412903
keyspace_misses:391208
expired_keys:1204471
evicted_keys:0
# Keyspace
db0:keys=184203,expires=182991,avg_ttl=241833
cmdstat_get:calls=8804111,usec=17608222,usec_per_call=2.00,rejected_calls=0,failed_calls=0
cmdstat_set:calls=391208,usec=1173624,usec_per_call=3.00,rejected_calls=0,failed_calls=0
cmdstat_hgetall:calls=94,usec=112800,usec_per_call=1200.00,rejected_calls=0,failed_calls=0
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
184203     412.44M  48      3       8804111 (+0)        1204
184203     413.01M  48      3       8812204 (+8093)     1204</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hit ratio = hits / (hits + misses)</span><span class="v">Here 8412903 / 8804111 = <strong>95.6%</strong>. Both counters are cumulative since the server started, so a single reading tells you the lifetime average, not what is happening now. Sample twice and subtract.</span></div>
  <div class="kv"><span class="k">They are instance-wide, and that is the blind spot</span><span class="v">These counters do not distinguish your product cache from your session store from your rate limiter. Sessions almost always hit, so a healthy-looking 95% can be sessions hiding a product cache running at 20%. Redis cannot break this down for you.</span></div>
  <div class="kv"><span class="k"><code>evicted_keys</code> above zero is a red flag</span><span class="v">It means <code>maxmemory</code> was reached and Redis threw away keys that had not expired (Chapter 9). A cache that evicts is a cache that is too small — or one holding things that should not be in it.</span></div>
  <div class="kv"><span class="k"><code>expires</code> vs <code>keys</code> in INFO keyspace</span><span class="v">182991 of 184203 keys have a TTL. The 1212 that do not are the ones worth investigating — every key without a TTL is a key that will be there forever unless something deletes it (Lesson 2.2).</span></div>
  <div class="kv"><span class="k"><code>usec_per_call</code> finds the expensive command</span><span class="v"><code>HGETALL</code> at 1200 µs against <code>GET</code> at 2 µs. Ninety-four calls that each block the server for 1.2 ms — that is the line that tells you where your p99 comes from (Lesson 5.1).</span></div>
</div>

<h3>Why the ratio lies</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">99% hit ratio, useless cache</span><span class="lz-t">you cached a 0.4 ms query</span><span class="lz-d">A million hits saving 0.4 ms each is 400 seconds of database time avoided — spread over a day, on a database that was never the bottleneck. Meanwhile you added a network hop, a serialisation step, an invalidation bug surface and an operational dependency. The ratio is excellent and the cache should be deleted.</span></div>
  <div class="lz-step"><span class="lz-k">60% hit ratio, essential cache</span><span class="lz-t">you cached a 900 ms aggregate</span><span class="lz-d">Six hundred thousand hits saving 900 ms each is 150 hours of database time avoided. The 40% miss rate looks bad on a dashboard and the cache is single-handedly keeping the service up. Ratios do not carry units.</span></div>
  <div class="lz-step"><span class="lz-k">The number to compute</span><span class="lz-t">work avoided = hits × cost per miss</span><span class="lz-d">Measure the cost of a miss once — the real end-to-end cost, query plus serialisation plus whatever else — multiply by hits per day, and you have a number in seconds that you can compare against the cost of running and maintaining the cache. That is the whole analysis.</span></div>
  <div class="lz-step"><span class="lz-k">And the shape of the misses</span><span class="lz-t">falling · flat · rising</span><span class="lz-d">A miss rate that falls as traffic rises is a healthy cold start. Flat means a working set larger than your memory, or TTLs that are too short. Rising with traffic means penetration — requests for keys that do not exist (Lesson 6.3).</span></div>
</div>

<h3>Per-cache numbers only exist if you count them</h3>
<pre><code><span class="tok-comment">// Redis cannot break hits down by prefix. Your code can.</span>
async function cached(name, key, loader, ttl) {
  const t0 = performance.now();
  let hit = true;
  let raw;
  try { raw = await redis.get(key); } catch { raw = null; hit = false; }

  if (raw === null) {
    hit = false;
    const value = await loader();
    metrics.histogram('cache.miss.ms', performance.now() - t0, { cache: name });
    redis.set(key, JSON.stringify(value), { EX: ttl + jitter() }).catch(noop);
    metrics.increment('cache.miss', { cache: name });
    return value;
  }

  metrics.increment('cache.hit', { cache: name });
  metrics.histogram('cache.hit.ms', performance.now() - t0, { cache: name });
  return JSON.parse(raw);
}</code></pre>
<div class="callout ok"><strong>Two counters and two histograms per cache, and you can finally answer the question.</strong> <code>cache.hit</code> and <code>cache.miss</code> tagged by cache name give you a per-cache ratio that instance-wide counters cannot. The two histograms give you the cost of a miss and the cost of a hit — and their difference, multiplied by the hit count, is the work avoided. This is about fifteen lines and it turns "the cache is fine, 95%" into "the product cache runs at 34%, each miss costs 210 ms, and it saves us four hours of database time a day". One of those sentences supports a decision.</div>

<h3>Latency: where the milliseconds actually went</h3>
<pre><code>redis-cli --latency -i 5                      <span class="tok-comment"># round-trip, sampled continuously</span>
redis-cli --latency-history -i 10             <span class="tok-comment"># same, one line per interval</span>
redis-cli CONFIG SET slowlog-log-slower-than 5000    <span class="tok-comment"># µs → log anything over 5ms</span>
redis-cli SLOWLOG GET 2
redis-cli SLOWLOG LEN
redis-cli LATENCY RESET; redis-cli LATENCY LATEST</code></pre>
<div class="out">min: 0, max: 14, avg: 0.21 (4881 samples)
min: 0, max: 3, avg: 0.19 (48 samples) -- 10.01 seconds range
min: 0, max: 214, avg: 0.94 (47 samples) -- 10.00 seconds range
OK
1) 1) (integer) 41
   2) (integer) 1755949214
   3) (integer) 214882
   4) 1) "KEYS"
      2) "session:*"
   5) "10.1.4.22:53114"
   6) ""
2) 1) (integer) 40
   2) (integer) 1755948903
   3) (integer) 18204
   4) 1) "HGETALL"
      2) "bighash"
(integer) 2
1) 1) "command"
   2) (integer) 1755949214
   3) (integer) 214
   4) (integer) 214</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--latency</code> measures the round trip, not the command</span><span class="v">It sends <code>PING</code> in a loop. A high number means the <em>server</em> is busy — someone else's slow command is delaying your fast one, which is the whole story of a single-threaded server (Lesson 1.1).</span></div>
  <div class="kv"><span class="k"><code>SLOWLOG</code> is in microseconds</span><span class="v">The 214882 above is 215 milliseconds, and the command was <code>KEYS session:*</code> from 10.1.4.22 — that one line names both the problem and the machine to go fix (Lesson 2.3).</span></div>
  <div class="kv"><span class="k">The slowlog is in memory and small</span><span class="v">128 entries by default, gone on restart. It is a diagnostic you read during an incident, not a metric you trend. If you want history, scrape it.</span></div>
  <div class="kv"><span class="k"><code>LATENCY LATEST</code> tracks spike events</span><span class="v">Requires <code>latency-monitor-threshold</code> to be set. It records the worst latency <em>per event type</em> — fork, expire-cycle, command — which is how you distinguish "a slow command" from "the RDB fork stalled us" (Chapter 9).</span></div>
  <div class="kv"><span class="k">Never leave <code>MONITOR</code> running</span><span class="v">It streams every command to your terminal and costs the server real throughput. Useful for ten seconds of debugging on a dev box; a performance incident on production.</span></div>
</div>

<h3>What to alert on</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Miss rate rising against flat traffic</span><span class="lz-lnote">The single most informative cache alert. It means TTLs got shorter, the working set grew past memory, an invalidation started firing too often, or someone is walking your ID space (Lesson 6.3). A raw ratio threshold produces noise; the <em>derivative</em> produces signal.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · <code>evicted_keys</code> greater than zero</span><span class="lz-lnote">Not a warning, a fact: Redis is deleting keys you did not tell it to. Either the instance is undersized or something without a TTL is growing inside it (Chapter 9). Alert on the counter moving at all, not on a rate.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · <code>--latency</code> p99 above a few milliseconds</span><span class="lz-lnote">On a healthy instance this is well under 1 ms. Anything sustained above ~5 ms means a slow command is blocking the loop, and <code>SLOWLOG</code> will name it. This is the alert that catches the <code>KEYS</code> someone added last Tuesday.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>blocked_clients</code> dropping to zero</span><span class="lz-lnote">Only if you use blocking commands: it is your worker count, visible (Lesson 4.1). Twenty is healthy, zero means the consumers are dead, and nothing else in your monitoring will tell you that.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> optimising the hit ratio instead of the outcome. The ratio is trivially improvable and every way of improving it can make things worse. Lengthen the TTL and the ratio rises while staleness rises with it. Cache more key patterns and the ratio rises while memory fills and eviction starts throwing away the keys that actually mattered. Stop caching the rarely-requested things and the ratio rises beautifully — because you removed the misses, not because you added hits. The ratio is a denominator you control, which makes it a target you can hit without helping anyone; Goodhart's law applies to it exactly. Measure the two things that cannot be gamed: <strong>work avoided</strong> (hits × the real cost of a miss) and <strong>the latency your users see</strong>. If p99 request latency did not move when you added the cache, the cache is not helping, and no hit ratio changes that.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/info/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">INFO: every field explained</span><span class="lc-sub">The reference for all the sections — stats, keyspace, commandstats, memory, replication. Worth one careful read, because most of what you would build a dashboard from is already in here.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Redis latency monitoring</span><span class="lc-sub">The latency monitor framework, the event types it tracks, and how to read <code>LATENCY DOCTOR</code>. The companion "latency troubleshooting" page is the best incident checklist Redis publishes.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: measure a real cache</span><span class="lc-sub">Graded exercises: compute a hit ratio from two INFO samples, instrument a cache wrapper per-name, read a slowlog entry to name the offending client, and decide from the numbers whether a given cache should exist at all.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>keyspace_hits</code>/<code>keyspace_misses</code> are cumulative and instance-wide, so a single reading is a lifetime average and a healthy-looking 95% is often sessions hiding a product cache at 20% — per-cache numbers exist only if your code counts them. Hit ratio has no units and is trivially gameable; the number that supports a decision is work avoided, which is hits multiplied by the real cost of a miss. And when latency spikes, <code>--latency</code> tells you the server is busy and <code>SLOWLOG</code> tells you which command and which client made it busy — usually a <code>KEYS</code> or an <code>HGETALL</code> that was fine when the data was small.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Đo bộ đệm: nó có giúp gì không đã?</h2>
<p class="lead">Gần như đội nào cũng đo tỉ lệ trúng bộ đệm, và gần như đội nào cũng rút ra kết luận sai từ nó. Tỉ lệ trúng 99% có thể nghĩa là bộ đệm của bạn vô dụng, còn 60% có thể nghĩa là nó đang gánh cả dịch vụ. Con số quan trọng không phải cái tỉ lệ — mà là khối lượng công việc bạn đã tránh được.</p>

<h3>Redis nói cho bạn biết những gì</h3>
<pre><code>redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses|expired_keys|evicted_keys"
redis-cli INFO keyspace
redis-cli INFO commandstats | head -6
redis-cli --stat -i 2</code></pre>
<div class="out">keyspace_hits:8412903
keyspace_misses:391208
expired_keys:1204471
evicted_keys:0
# Keyspace
db0:keys=184203,expires=182991,avg_ttl=241833
cmdstat_get:calls=8804111,usec=17608222,usec_per_call=2.00,rejected_calls=0,failed_calls=0
cmdstat_set:calls=391208,usec=1173624,usec_per_call=3.00,rejected_calls=0,failed_calls=0
cmdstat_hgetall:calls=94,usec=112800,usec_per_call=1200.00,rejected_calls=0,failed_calls=0
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
184203     412.44M  48      3       8804111 (+0)        1204
184203     413.01M  48      3       8812204 (+8093)     1204</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tỉ lệ trúng = hits / (hits + misses)</span><span class="v">Ở đây 8412903 / 8804111 = <strong>95,6%</strong>. Cả hai bộ đếm đều cộng dồn kể từ lúc máy chủ khởi động, nên một lần đọc chỉ cho bạn trung bình cả đời, không phải chuyện đang xảy ra lúc này. Hãy lấy mẫu hai lần rồi trừ.</span></div>
  <div class="kv"><span class="k">Chúng tính cho cả máy, và đó là điểm mù</span><span class="v">Những bộ đếm này không phân biệt bộ đệm sản phẩm với kho phiên với bộ giới hạn tần suất. Phiên thì gần như luôn trúng, nên một con số 95% trông khoẻ mạnh có thể là phiên đang che giấu một bộ đệm sản phẩm chạy ở 20%. Redis không tách hộ bạn được.</span></div>
  <div class="kv"><span class="k"><code>evicted_keys</code> lớn hơn 0 là một lá cờ đỏ</span><span class="v">Nó nghĩa là đã chạm <code>maxmemory</code> và Redis vứt bỏ những khoá chưa hết hạn (Chương 9). Một bộ đệm phải đẩy khoá đi là một bộ đệm quá nhỏ — hoặc đang chứa những thứ lẽ ra không nên nằm trong đó.</span></div>
  <div class="kv"><span class="k"><code>expires</code> so với <code>keys</code> trong INFO keyspace</span><span class="v">182991 trên 184203 khoá có TTL. 1212 cái không có mới là những cái đáng đi tìm hiểu — mỗi khoá không TTL là một khoá sẽ nằm đó mãi mãi trừ khi có thứ gì đó xoá nó (Bài 2.2).</span></div>
  <div class="kv"><span class="k"><code>usec_per_call</code> tìm ra lệnh đắt</span><span class="v"><code>HGETALL</code> ở mức 1200 µs so với <code>GET</code> ở mức 2 µs. Chín mươi bốn lời gọi mà mỗi cái chặn máy chủ 1,2 ms — đó là dòng nói cho bạn biết p99 của bạn từ đâu ra (Bài 5.1).</span></div>
</div>

<h3>Vì sao cái tỉ lệ nói dối</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trúng 99%, bộ đệm vô dụng</span><span class="lz-t">bạn đệm một truy vấn 0,4 ms</span><span class="lz-d">Một triệu lượt trúng tiết kiệm 0,4 ms mỗi lượt là 400 giây thời gian cơ sở dữ liệu tránh được — trải trên cả một ngày, trên một cơ sở dữ liệu vốn chưa bao giờ là nút thắt cổ chai. Trong khi đó bạn thêm vào một chặng mạng, một bước tuần tự hoá, một bề mặt lỗi vô hiệu hoá và một phụ thuộc vận hành. Tỉ lệ thì xuất sắc và cái bộ đệm nên bị xoá đi.</span></div>
  <div class="lz-step"><span class="lz-k">Trúng 60%, bộ đệm sống còn</span><span class="lz-t">bạn đệm một phép tổng hợp 900 ms</span><span class="lz-d">Sáu trăm nghìn lượt trúng tiết kiệm 900 ms mỗi lượt là 150 giờ thời gian cơ sở dữ liệu tránh được. Tỉ lệ trượt 40% trông xấu trên bảng điều khiển và cái bộ đệm đang một mình giữ cho dịch vụ sống. Tỉ lệ thì không mang đơn vị.</span></div>
  <div class="lz-step"><span class="lz-k">Con số cần tính</span><span class="lz-t">việc tránh được = số lượt trúng × giá của một lượt trượt</span><span class="lz-d">Hãy đo giá của một lượt trượt một lần — giá thật đầu-tới-cuối, gồm truy vấn cộng tuần tự hoá cộng bất cứ thứ gì khác — nhân với số lượt trúng mỗi ngày, và bạn có một con số tính bằng giây để so với chi phí vận hành và bảo trì cái bộ đệm. Đó là toàn bộ phép phân tích.</span></div>
  <div class="lz-step"><span class="lz-k">Và hình dáng của các lượt trượt</span><span class="lz-t">đang giảm · phẳng · đang tăng</span><span class="lz-d">Tỉ lệ trượt giảm khi lưu lượng tăng là một lần khởi động nguội lành mạnh. Phẳng nghĩa là tập dữ liệu đang làm việc lớn hơn bộ nhớ của bạn, hoặc TTL quá ngắn. Tăng theo lưu lượng nghĩa là xuyên thủng — những yêu cầu tìm khoá không tồn tại (Bài 6.3).</span></div>
</div>

<h3>Số liệu theo từng bộ đệm chỉ tồn tại nếu bạn tự đếm</h3>
<pre><code><span class="tok-comment">// Redis không tách được lượt trúng theo tiền tố. Mã của bạn thì được.</span>
async function cached(name, key, loader, ttl) {
  const t0 = performance.now();
  let hit = true;
  let raw;
  try { raw = await redis.get(key); } catch { raw = null; hit = false; }

  if (raw === null) {
    hit = false;
    const value = await loader();
    metrics.histogram('cache.miss.ms', performance.now() - t0, { cache: name });
    redis.set(key, JSON.stringify(value), { EX: ttl + jitter() }).catch(noop);
    metrics.increment('cache.miss', { cache: name });
    return value;
  }

  metrics.increment('cache.hit', { cache: name });
  metrics.histogram('cache.hit.ms', performance.now() - t0, { cache: name });
  return JSON.parse(raw);
}</code></pre>
<div class="callout ok"><strong>Hai bộ đếm và hai biểu đồ tần suất cho mỗi bộ đệm, và cuối cùng bạn trả lời được câu hỏi.</strong> <code>cache.hit</code> và <code>cache.miss</code> gắn nhãn theo tên bộ đệm cho bạn một tỉ lệ theo từng bộ đệm mà các bộ đếm toàn máy không cho được. Hai biểu đồ tần suất cho bạn giá của một lượt trượt và giá của một lượt trúng — và hiệu của chúng, nhân với số lượt trúng, chính là khối việc tránh được. Chỗ này khoảng mười lăm dòng và nó biến "bộ đệm ổn mà, 95%" thành "bộ đệm sản phẩm chạy ở 34%, mỗi lượt trượt tốn 210 ms, và nó tiết kiệm cho ta bốn giờ thời gian cơ sở dữ liệu mỗi ngày". Một trong hai câu đó chống đỡ được cho một quyết định.</div>

<h3>Độ trễ: mili giây thật sự đã đi đâu</h3>
<pre><code>redis-cli --latency -i 5                      <span class="tok-comment"># vòng đi-về, lấy mẫu liên tục</span>
redis-cli --latency-history -i 10             <span class="tok-comment"># cũng vậy, mỗi khoảng một dòng</span>
redis-cli CONFIG SET slowlog-log-slower-than 5000    <span class="tok-comment"># µs → ghi lại mọi thứ trên 5ms</span>
redis-cli SLOWLOG GET 2
redis-cli SLOWLOG LEN
redis-cli LATENCY RESET; redis-cli LATENCY LATEST</code></pre>
<div class="out">min: 0, max: 14, avg: 0.21 (4881 samples)
min: 0, max: 3, avg: 0.19 (48 samples) -- 10.01 seconds range
min: 0, max: 214, avg: 0.94 (47 samples) -- 10.00 seconds range
OK
1) 1) (integer) 41
   2) (integer) 1755949214
   3) (integer) 214882
   4) 1) "KEYS"
      2) "session:*"
   5) "10.1.4.22:53114"
   6) ""
2) 1) (integer) 40
   2) (integer) 1755948903
   3) (integer) 18204
   4) 1) "HGETALL"
      2) "bighash"
(integer) 2
1) 1) "command"
   2) (integer) 1755949214
   3) (integer) 214
   4) (integer) 214</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--latency</code> đo vòng đi-về, không đo lệnh</span><span class="v">Nó gửi <code>PING</code> trong một vòng lặp. Con số cao nghĩa là <em>máy chủ</em> đang bận — lệnh chậm của người khác đang làm trễ lệnh nhanh của bạn, đó là toàn bộ câu chuyện của một máy chủ đơn luồng (Bài 1.1).</span></div>
  <div class="kv"><span class="k"><code>SLOWLOG</code> tính bằng micro giây</span><span class="v">Con số 214882 ở trên là 215 mili giây, và lệnh đó là <code>KEYS session:*</code> từ 10.1.4.22 — đúng một dòng ấy chỉ ra cả vấn đề lẫn cái máy cần đi sửa (Bài 2.3).</span></div>
  <div class="kv"><span class="k">Slowlog nằm trong bộ nhớ và nhỏ</span><span class="v">Mặc định 128 mục, mất khi khởi động lại. Nó là thứ để đọc trong lúc có sự cố, không phải một chỉ số để vẽ đồ thị theo thời gian. Muốn có lịch sử thì phải đi thu gom nó.</span></div>
  <div class="kv"><span class="k"><code>LATENCY LATEST</code> theo dõi các sự kiện vọt lên</span><span class="v">Cần đặt <code>latency-monitor-threshold</code>. Nó ghi lại độ trễ tệ nhất <em>theo từng loại sự kiện</em> — fork, chu kỳ hết hạn, lệnh — đó là cách bạn phân biệt "một lệnh chậm" với "cú fork ghi RDB làm ta khựng lại" (Chương 9).</span></div>
  <div class="kv"><span class="k">Đừng bao giờ để <code>MONITOR</code> chạy dai</span><span class="v">Nó đổ mọi lệnh về cửa sổ của bạn và ngốn thông lượng thật của máy chủ. Hữu ích cho mười giây gỡ lỗi trên máy phát triển; là một sự cố hiệu năng trên production.</span></div>
</div>

<h3>Nên đặt cảnh báo cho cái gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Tỉ lệ trượt tăng trong khi lưu lượng phẳng</span><span class="lz-lnote">Cảnh báo bộ đệm cho nhiều thông tin nhất. Nó nghĩa là TTL bị rút ngắn, tập đang làm việc phình quá bộ nhớ, một phép vô hiệu hoá bắt đầu nổ quá thường xuyên, hoặc có ai đó đang đi bộ qua không gian mã của bạn (Bài 6.3). Đặt ngưỡng lên tỉ lệ thô thì sinh nhiễu; đặt lên <em>đạo hàm</em> thì sinh tín hiệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · <code>evicted_keys</code> lớn hơn 0</span><span class="lz-lnote">Không phải một lời cảnh báo, mà là một sự thật: Redis đang xoá những khoá bạn không bảo nó xoá. Hoặc là máy quá nhỏ, hoặc là có thứ gì đó không có TTL đang phình lên bên trong (Chương 9). Hãy đặt cảnh báo khi bộ đếm nhích lên chút nào, đừng đặt theo tốc độ.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · p99 của <code>--latency</code> trên vài mili giây</span><span class="lz-lnote">Trên một máy khoẻ mạnh thì con số này thấp hơn 1 ms rất nhiều. Bất cứ mức nào duy trì trên ~5 ms đều nghĩa là một lệnh chậm đang chặn vòng lặp, và <code>SLOWLOG</code> sẽ gọi tên nó ra. Đây là cảnh báo bắt được cái lệnh <code>KEYS</code> mà ai đó thêm vào hôm thứ Ba tuần trước.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>blocked_clients</code> tụt về 0</span><span class="lz-lnote">Chỉ khi bạn dùng lệnh chặn: nó chính là số worker của bạn, nhìn thấy được (Bài 4.1). Hai chục là khoẻ, số 0 nghĩa là các bên tiêu thụ đã chết, và không thứ gì khác trong hệ giám sát của bạn nói cho bạn biết chuyện đó.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> tối ưu cái tỉ lệ trúng thay vì tối ưu kết quả. Cái tỉ lệ dễ cải thiện tới mức tầm thường và mọi cách cải thiện nó đều có thể làm mọi thứ tệ đi. Kéo dài TTL thì tỉ lệ tăng và độ ôi tăng theo. Đệm thêm nhiều mẫu khoá nữa thì tỉ lệ tăng còn bộ nhớ đầy lên và việc đẩy khoá bắt đầu vứt đi đúng những khoá thật sự quan trọng. Thôi đệm những thứ hiếm được hỏi thì tỉ lệ tăng đẹp lộng lẫy — vì bạn vừa gỡ bỏ các lượt trượt, chứ không phải vì bạn thêm được lượt trúng nào. Cái tỉ lệ là một mẫu số do bạn kiểm soát, điều đó biến nó thành một cái đích mà bạn bắn trúng được mà chẳng giúp ai; định luật Goodhart áp vào đây chính xác. Hãy đo hai thứ không gian lận được: <strong>khối việc tránh được</strong> (số lượt trúng × giá thật của một lượt trượt) và <strong>độ trễ mà người dùng của bạn thấy</strong>. Nếu p99 độ trễ yêu cầu không nhúc nhích khi bạn thêm bộ đệm vào thì cái bộ đệm không giúp gì cả, và không tỉ lệ trúng nào đổi được điều đó.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/info/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">INFO: giải thích từng trường</span><span class="lc-sub">Tài liệu tra cứu cho mọi mục — stats, keyspace, commandstats, memory, replication. Đáng đọc kỹ một lượt, vì phần lớn thứ bạn định dựng bảng điều khiển từ đó vốn đã nằm sẵn ở đây.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency-monitor/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Redis latency monitoring</span><span class="lc-sub">Khung theo dõi độ trễ, các loại sự kiện nó ghi lại, và cách đọc <code>LATENCY DOCTOR</code>. Trang "latency troubleshooting" đi kèm là danh mục kiểm tra sự cố hay nhất Redis công bố.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đo một bộ đệm thật</span><span class="lc-sub">Bài chấm điểm: tính tỉ lệ trúng từ hai lần lấy mẫu INFO, gắn đo đạc vào một lớp bọc bộ đệm theo tên, đọc một mục slowlog để gọi tên cái máy khách gây chuyện, và từ các con số mà quyết định xem một bộ đệm cho trước có nên tồn tại hay không.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>keyspace_hits</code>/<code>keyspace_misses</code> là cộng dồn và tính cho cả máy, nên một lần đọc là trung bình cả đời và một con số 95% trông khoẻ mạnh thường là phiên đang che giấu một bộ đệm sản phẩm chạy ở 20% — số liệu theo từng bộ đệm chỉ tồn tại nếu mã của bạn tự đếm. Tỉ lệ trúng không mang đơn vị và dễ gian lận tới mức tầm thường; con số chống đỡ được cho một quyết định là khối việc tránh được, tức số lượt trúng nhân với giá thật của một lượt trượt. Và khi độ trễ vọt lên, <code>--latency</code> nói cho bạn biết máy chủ đang bận còn <code>SLOWLOG</code> nói cho bạn biết lệnh nào và máy khách nào làm nó bận — thường là một lệnh <code>KEYS</code> hay một <code>HGETALL</code> vốn vẫn ổn hồi dữ liệu còn nhỏ.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Quiz: caching|||6.6 — Trắc nghiệm: làm bộ đệm',
      slug: 'rd-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về suy giảm khi Redis chết, xoá thay vì cập nhật, thứ tự ghi đúng, rắc nhiễu chữa được nguyên nhân nào, nhả khoá không có mã thông báo, độ trễ bản sao, và vì sao tỉ lệ trúng nói dối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the chapter where most production incidents in this course actually live. Four of them are about things that are correct at every individual step and wrong as a whole.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: why you delete rather than update (6.2), which stampede cause jitter actually fixes (6.3), why a lock release needs a token (6.3), and how replica lag produces a permanently stale cache from a correct invalidation (6.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về cái chương mà phần lớn sự cố production trong khoá này thật sự nằm ở đó. Bốn câu nói về những thứ đúng ở từng bước riêng lẻ và sai khi gộp lại thành một.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: vì sao bạn xoá chứ không cập nhật (6.2), rắc nhiễu thật ra chữa được nguyên nhân giẫm đạp nào (6.3), vì sao phép nhả khoá cần mã thông báo (6.3), và độ trễ bản sao sinh ra một bộ đệm ôi vĩnh viễn từ một phép vô hiệu hoá đúng đắn ra sao (6.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Cache-aside is often described as "degrades safely when Redis is down". Under what condition is that actually true?|||Cache-aside thường được mô tả là "suy giảm an toàn khi Redis chết". Điều đó thật sự đúng với điều kiện nào?',
            options: [
              'Always — Redis client libraries return null instead of throwing when the server is unreachable|||Luôn đúng — thư viện khách Redis trả về null thay vì ném lỗi khi không với tới máy chủ',
              'Only when Redis is configured with a replica, so the client fails over transparently|||Chỉ khi Redis được cấu hình có bản sao, để thư viện khách tự chuyển đổi trong suốt',
              'Only when the TTL has not yet expired, since an expired key behaves like an outage|||Chỉ khi TTL chưa hết hạn, vì một khoá đã hết hạn cư xử giống một sự cố',
              'Only if you wrapped the Redis calls in try/catch and treat an error as a cache miss — otherwise the error propagates and a Redis blip becomes a 500|||Chỉ khi bạn bọc các lời gọi Redis trong try/catch và coi lỗi như một lần trượt bộ đệm — nếu không thì lỗi lan lên và một cú chớp của Redis thành lỗi 500',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'On a write, why should you DELETE the cache key rather than write the new value into it?|||Khi có lượt ghi, vì sao bạn nên XOÁ khoá bộ đệm thay vì ghi giá trị mới vào đó?',
            options: [
              'Because writing values races: two concurrent writers can interleave so the OLDER value lands in the cache last, and it then sits there for a full TTL. Deleting is idempotent, so whoever reads next reloads the committed truth|||Vì ghi giá trị vào là một cuộc đua: hai bên ghi đồng thời có thể xen kẽ khiến giá trị CŨ hơn rơi vào bộ đệm sau cùng, rồi nó nằm đó suốt trọn TTL. Xoá thì gọi bao nhiêu lần cũng ra một kết quả, nên ai đọc tiếp theo sẽ nạp lại sự thật đã ghi nhận',
              'Because SET is significantly slower than DEL on large values|||Vì SET chậm hơn hẳn DEL trên các giá trị lớn',
              'Because writing a value resets the TTL, and Redis forbids extending a TTL twice|||Vì ghi một giá trị sẽ đặt lại TTL, và Redis cấm kéo dài TTL hai lần',
              'Because a written value does not fire keyspace notifications, so subscribers miss the change|||Vì một giá trị được ghi vào không kích hoạt thông báo không gian khoá, nên các bên đăng ký bỏ lỡ thay đổi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A handler deletes the cache key first and then commits the database write. What goes wrong?|||Một bộ xử lý xoá khoá bộ đệm trước rồi mới ghi nhận lượt ghi vào cơ sở dữ liệu. Hỏng ở đâu?',
            options: [
              'Nothing — clearing first is the safest order because the cache is never ahead of the database|||Không hỏng gì — xoá trước là thứ tự an toàn nhất vì bộ đệm không bao giờ đi trước cơ sở dữ liệu',
              'The DELETE fails because the key is still locked by the pending transaction|||Lệnh DELETE thất bại vì khoá vẫn đang bị giao dịch chưa xong khoá lại',
              'The window between the delete and the commit is wide open: a concurrent reader misses, reads the OLD row and writes it back into the cache, where it sits for a full TTL|||Cửa sổ giữa lúc xoá và lúc ghi nhận mở toang: một bên đọc đồng thời trượt, đọc ra dòng CŨ rồi ghi nó ngược vào bộ đệm, nơi nó nằm suốt trọn TTL',
              'The cache ends up holding a value that was never committed anywhere|||Bộ đệm rốt cuộc giữ một giá trị chưa từng được ghi nhận ở đâu cả',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Your homepage cache key expires and 200 concurrent requests all query the database. You add TTL jitter. What happens?|||Khoá bộ đệm trang chủ của bạn hết hạn và 200 yêu cầu đồng thời cùng truy vấn cơ sở dữ liệu. Bạn thêm rắc nhiễu vào TTL. Chuyện gì xảy ra?',
            options: [
              'The stampede is fixed — the 200 requests now expire at 200 different moments|||Cú giẫm đạp được chữa — 200 yêu cầu giờ hết hạn ở 200 khoảnh khắc khác nhau',
              'Nothing changes: jitter spreads the deadlines of MANY keys, but this is ONE key with one deadline. It fixes synchronised expiry, not concurrent misses on a hot key — that needs single-flight|||Không đổi gì cả: rắc nhiễu trải các hạn của NHIỀU khoá, nhưng đây là MỘT khoá với một cái hạn. Nó chữa hết-hạn-đồng-loạt, không chữa trượt-đồng-thời trên một khoá nóng — cái đó cần một-lượt-duy-nhất',
              'The stampede gets worse, because jitter increases the average TTL|||Cú giẫm đạp tệ hơn, vì rắc nhiễu làm tăng TTL trung bình',
              'It fixes it only if the jitter exceeds the database query time|||Nó chỉ chữa được nếu lượng nhiễu lớn hơn thời gian truy vấn cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A worker takes a lock with `SET lock:k <token> NX EX 10` and releases it in a `finally` block with a plain `DEL lock:k`. What is the bug?|||Một worker giành khoá bằng `SET lock:k <token> NX EX 10` rồi nhả nó trong khối `finally` bằng một lệnh `DEL lock:k` trơn. Lỗi ở đâu?',
            options: [
              'If the work takes longer than 10 seconds the lock expires, another worker takes it, and the first worker’s DEL deletes THEIR lock — so two workers end up inside the critical section|||Nếu công việc lâu hơn 10 giây thì khoá hết hạn, một worker khác giành được nó, và lệnh DEL của worker đầu xoá mất khoá CỦA HỌ — nên hai worker cùng nằm trong vùng tới hạn',
              'DEL is asynchronous, so the lock may linger after the finally block runs|||DEL là bất đồng bộ, nên cái khoá có thể nán lại sau khi khối finally chạy',
              'NX and EX cannot be combined in a single SET, so the lock never has a TTL|||NX và EX không kết hợp được trong một lệnh SET, nên cái khoá không bao giờ có TTL',
              'The token is never read, so SET NX has no effect and every worker acquires the lock|||Mã thông báo không bao giờ được đọc, nên SET NX không có tác dụng và mọi worker đều giành được khoá',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does probabilistic early recompute (XFetch) buy you that a lock does not?|||Tính lại sớm theo xác suất (XFetch) mang lại cho bạn thứ gì mà một cái khoá không có?',
            options: [
              'Stronger guarantees — exactly one recompute is mathematically certain|||Bảo đảm mạnh hơn — đúng một lượt tính lại là chắc chắn về mặt toán học',
              'Lower memory, because it does not need to store the value at all|||Ít bộ nhớ hơn, vì nó không cần lưu giá trị chút nào',
              'It removes the need for a TTL, since the value refreshes itself indefinitely|||Nó gỡ bỏ nhu cầu có TTL, vì giá trị tự làm mới mãi mãi',
              'There is never a moment when the key is absent: one unlucky reader refreshes slightly EARLY while the old value is still there to serve everyone else, so no reader ever waits and no herd forms|||Không bao giờ có khoảnh khắc nào cái khoá vắng mặt: một bên đọc xui xẻo làm mới SỚM hơn một chút trong lúc giá trị cũ vẫn còn đó để phục vụ mọi người khác, nên không bên đọc nào phải chờ và đàn giẫm đạp không hình thành',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A user edits their bio. Your code writes to the primary, then UNLINKs the cache key correctly. The next page load still shows the old bio, for five minutes. What happened?|||Một người dùng sửa tiểu sử. Mã của bạn ghi vào bản chính, rồi UNLINK khoá bộ đệm một cách đúng đắn. Lượt tải trang tiếp theo vẫn hiện tiểu sử cũ, suốt năm phút. Chuyện gì đã xảy ra?',
            options: [
              'UNLINK is asynchronous, so the key was still being served while it was freed in the background|||UNLINK là bất đồng bộ, nên khoá vẫn còn được phục vụ trong lúc nó được giải phóng ở nền',
              'The invalidation worked; the next read MISSED and then queried a read replica that had not caught up yet, so it cached the pre-write row for the full TTL|||Phép vô hiệu hoá đã chạy đúng; lượt đọc tiếp theo TRƯỢT rồi truy vấn một bản sao đọc chưa bắt kịp, nên nó đệm dòng trước-khi-ghi suốt trọn TTL',
              'The write never committed, because UNLINK rolled back the transaction|||Lượt ghi chưa bao giờ được ghi nhận, vì UNLINK đã quay lui giao dịch',
              'Redis served the value from its own replica, which had not received the deletion yet|||Redis phục vụ giá trị từ bản sao của chính nó, vốn chưa nhận được lệnh xoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Cache A has a 99% hit ratio on a 0.4 ms query. Cache B has a 60% hit ratio on a 900 ms aggregate. Which is more valuable, and what is the right metric?|||Bộ đệm A có tỉ lệ trúng 99% trên một truy vấn 0,4 ms. Bộ đệm B có tỉ lệ trúng 60% trên một phép tổng hợp 900 ms. Cái nào giá trị hơn, và chỉ số đúng là gì?',
            options: [
              'A, because a 99% ratio means almost no load reaches the database at all|||A, vì tỉ lệ 99% nghĩa là gần như không có tải nào đi tới cơ sở dữ liệu',
              'They are equivalent — ratio is normalised, so it is comparable across caches by design|||Chúng tương đương — tỉ lệ đã được chuẩn hoá nên vốn dĩ so sánh được giữa các bộ đệm',
              'B, by a large margin. Ratio has no units; the metric is work avoided = hits × the real cost of a miss, and B avoids orders of magnitude more database time than A|||B, hơn rất xa. Tỉ lệ thì không mang đơn vị; chỉ số đúng là khối việc tránh được = số lượt trúng × giá thật của một lượt trượt, và B tránh được nhiều thời gian cơ sở dữ liệu hơn A tới mấy bậc',
              'B, because a 60% ratio proves the working set is larger than memory, which is always healthier|||B, vì tỉ lệ 60% chứng minh tập đang làm việc lớn hơn bộ nhớ, điều đó luôn lành mạnh hơn',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
