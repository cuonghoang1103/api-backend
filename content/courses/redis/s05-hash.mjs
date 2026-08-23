/**
 * Redis — Chương 5: Hash và cách mô hình hoá một đối tượng.
 * Lệnh cơ bản · mã hoá và bộ nhớ · hash với JSON với khoá rời · TTL theo trường (7.4) · thực tế · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 5 — Hashes, and how to model an object|||Chương 5 — Hash và cách mô hình hoá một đối tượng',
  description: 'Một hash là một đối tượng bạn cập nhật được từng trường mà không phải đọc rồi ghi lại cả cái. Bài này đi từ năm lệnh cơ bản tới mẹo mã hoá cho phép nhét mười triệu đối tượng vào chưa tới 1 GB, tới HEXPIRE của Redis 7.4 — TTL cho từng trường, thứ mà suốt mười lăm năm Redis không có.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Hashes: an object you can edit one field at a time|||5.1 — Hash: một đối tượng sửa được từng trường',
      slug: 'rd-5-1-hash',
      type: 'LESSON',
      isFreePreview: true,
      description: 'HSET với HGET, HMGET thay cho HGETALL, HINCRBY nguyên tử trên một trường, HRANDFIELD, HSCAN, và vì sao "đọc cả đối tượng rồi ghi lại" là một lần ghi bị mất đang chờ xảy ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Hashes: an object you can edit one field at a time</h2>
<p class="lead">A hash is a map from field names to string values, stored under one key. That is the boring description. The interesting one: it is the only Redis type that lets two different processes update two different properties of the same object at the same time without either one destroying the other's work.</p>

<h3>The commands</h3>
<pre><code>redis-cli HSET user:1042 name "Cuong" email "c@example.com" plan free logins 0
redis-cli HGET user:1042 name
redis-cli HMGET user:1042 name plan missing
redis-cli HGETALL user:1042
redis-cli HDEL user:1042 email
redis-cli HEXISTS user:1042 email
redis-cli HLEN user:1042
redis-cli HSETNX user:1042 plan pro       <span class="tok-comment"># already set → no-op</span>
redis-cli HINCRBY user:1042 logins 1
redis-cli HSTRLEN user:1042 name</code></pre>
<div class="out">(integer) 4
"Cuong"
1) "Cuong"
2) "free"
3) (nil)
1) "name"
2) "Cuong"
3) "email"
4) "c@example.com"
5) "plan"
6) "free"
7) "logins"
8) "0"
(integer) 1
(integer) 0
(integer) 3
(integer) 0
(integer) 1
(integer) 5</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>HSET</code> takes many pairs</span><span class="v">One command, one atomic write. <code>HMSET</code> still works but has been deprecated since 4.0 — <code>HSET</code> does the same thing and returns the number of <em>new</em> fields.</span></div>
  <div class="kv"><span class="k"><code>HMGET</code> is what you want, not <code>HGETALL</code></span><span class="v">Ask for the three fields the page needs. <code>HGETALL</code> on a 200-field hash transfers 200 fields to render two of them, every request.</span></div>
  <div class="kv"><span class="k"><code>HINCRBY</code> and <code>HINCRBYFLOAT</code></span><span class="v">Atomic arithmetic on one field, exactly like <code>INCR</code> on a string (Lesson 3.2). This is how a counter lives inside an object instead of beside it.</span></div>
  <div class="kv"><span class="k"><code>HSETNX</code> sets only if absent</span><span class="v">A one-command "initialise this field if nobody has yet", with no read and no race.</span></div>
  <div class="kv"><span class="k">Missing field vs missing key</span><span class="v">Both return <code>nil</code>. <code>HGET nosuchkey f</code> and <code>HGET user:1042 nosuchfield</code> are indistinguishable in the reply — use <code>EXISTS</code> or <code>HLEN</code> when the difference matters.</span></div>
</div>

<h3>Why this beats a JSON string</h3>
<pre><code><span class="tok-comment">// The JSON-in-a-string approach — read, modify, write</span>
const raw  = await redis.get('user:1042');
const user = JSON.parse(raw);
user.plan  = 'pro';
await redis.set('user:1042', JSON.stringify(user));

<span class="tok-comment">// The hash approach — one field, one command</span>
await redis.hSet('user:1042', 'plan', 'pro');</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The lost update</span><span class="lz-t">two writers, one survivor</span><span class="lz-d">Request A reads the user to change <code>plan</code>. Request B reads the same user to change <code>email</code>. A writes, then B writes — and B's copy never had the new plan, so the upgrade silently vanishes. With <code>HSET</code> both writes touch different fields and both survive.</span></div>
  <div class="lz-step"><span class="lz-k">The bandwidth</span><span class="lz-t">4 KB in, 4 KB out, to change 3 bytes</span><span class="lz-d">A JSON blob is read and rewritten whole on every change. On a hot object at 5,000 writes/second that is 40 MB/s of network for nothing.</span></div>
  <div class="lz-step"><span class="lz-k">The parse cost</span><span class="lz-t">JSON.parse on every read, in your process</span><span class="lz-d">Not Redis's problem — yours. A hash returns fields already split; the client hands you an object with no parsing at all.</span></div>
  <div class="lz-step"><span class="lz-k">When JSON does win</span><span class="lz-t">nested structures and whole-object reads</span><span class="lz-d">A hash is flat: values are strings, not arrays or objects. If your document is genuinely nested and you always read all of it, a JSON string is simpler and smaller. Lesson 5.3 measures both.</span></div>
</div>
<div class="callout ok"><strong>The atomic-field property is the whole point.</strong> A shopping cart where two tabs add different items, a user record where a background job updates <code>last_seen</code> while the profile page updates <code>bio</code>, a counter that increments while a config field changes — all of these are correct by construction with a hash, and all of them are a race with read-modify-write on a JSON string. You can fix the JSON version with <code>WATCH</code> and a retry loop (Chapter 7), but the hash version does not need fixing.</div>

<h3>HGETALL is a loaded gun on a big hash</h3>
<pre><code>redis-cli DEL bighash &gt;/dev/null
python3 -c "
for i in range(500_000): print(f'HSET bighash field:{i} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli HLEN bighash
time redis-cli HGETALL bighash &gt;/dev/null
time redis-cli HMGET bighash field:1 field:2 field:3 &gt;/dev/null
redis-cli HSCAN bighash 0 COUNT 10 | head -5
redis-cli HSCAN bighash 0 NOVALUES COUNT 5      <span class="tok-comment"># 7.4+: field names only</span></code></pre>
<div class="out">(integer) 500000
real	0m1.226s
real	0m0.003s
"3670016"
"field:246054"
"value:246054"
"field:96263"
"value:96263"
1) "0"
2) 1) "field:127838"
   2) "field:453279"
   3) "field:308821"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1.2 seconds of total server stall</span><span class="v">Single-threaded (Lesson 1.1). Every other client waits. And the reply itself is a million strings that Redis must build in memory before sending — output-buffer pressure on top of CPU.</span></div>
  <div class="kv"><span class="k"><code>HMGET</code> is 400× faster here</span><span class="v">Because it does exactly what you asked. The habit worth building: never write <code>HGETALL</code> without knowing the field count is bounded by design.</span></div>
  <div class="kv"><span class="k"><code>HSCAN</code> for iteration</span><span class="v">Same cursor contract as <code>SCAN</code> (Lesson 2.3). It returns field and value interleaved in one flat array — a detail that trips up everyone the first time.</span></div>
  <div class="kv"><span class="k"><code>HSCAN … NOVALUES</code></span><span class="v">Redis 7.4+. Returns only the field names, which halves the reply when you are iterating to find keys rather than to read data.</span></div>
  <div class="kv"><span class="k"><code>HRANDFIELD</code> for sampling</span><span class="v">Same signed-count rule as <code>SRANDMEMBER</code> (Lesson 4.2): positive for distinct, negative for with-replacement, and <code>WITHVALUES</code> to get both halves.</span></div>
</div>

<h3>Fields are strings, and that has consequences</h3>
<pre><code>redis-cli HSET cfg enabled true count 42 ratio 0.5 nothing ""
redis-cli HGET cfg enabled
redis-cli HGET cfg count
redis-cli HINCRBY cfg enabled 1
redis-cli HGET cfg nothing
redis-cli HEXISTS cfg nothing</code></pre>
<div class="out">(integer) 4
"true"
"42"
(error) ERR hash value is not an integer
""
(integer) 1</div>
<div class="pitfall"><strong>Pitfall:</strong> everything comes back as a string, so <code>"false"</code>, <code>"0"</code> and <code>""</code> are all truthy strings in most languages, and the boolean you carefully stored comes back as text that <code>if (user.enabled)</code> happily accepts. Redis has no schema and no types beyond "string" — the conversion is entirely your side, and it is the single most common source of "the flag is off but the feature is on" bugs. Two habits fix it: never store a raw boolean, store <code>1</code>/<code>0</code> and coerce with <code>=== '1'</code>; and put the parsing in one function that maps a raw hash to your object type, so it exists in exactly one place. The empty string is its own trap — an empty field <em>exists</em> (<code>HEXISTS</code> returns 1) but reads as falsy, so "unset" and "set to empty" need different representations if you care about the difference. And note the error above: <code>HINCRBY</code> refuses to do arithmetic on <code>"true"</code>, which is the one place Redis does check.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/hashes/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis hashes</span><span class="lc-sub">Every H-command with its complexity, the encoding thresholds, and the official object-modelling examples. Short page, worth reading top to bottom.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/hscan/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">HSCAN</span><span class="lc-sub">The cursor contract, the interleaved field/value reply format, the <code>NOVALUES</code> option added in 7.4, and the guarantees you do and do not get while the hash is being written.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: model a user with a hash</span><span class="lc-sub">Graded exercises: replace a read-modify-write JSON update with <code>HSET</code>, replace an <code>HGETALL</code> with the right <code>HMGET</code>, and write the parse function that turns a raw hash into a typed object.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A hash lets two writers update two fields of the same object concurrently without losing either write — that is the property a JSON string cannot give you without a transaction. <code>HGETALL</code> is O(N) and blocks the server, so ask for the fields you need with <code>HMGET</code> and iterate with <code>HSCAN</code>; the only safe <code>HGETALL</code> is one on a hash whose field count is bounded by design. And every value is a string on the way out, so booleans, numbers and "unset vs empty" are your problem — put the coercion in one function and use it everywhere.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hash: một đối tượng sửa được từng trường</h2>
<p class="lead">Hash là một ánh xạ từ tên trường sang giá trị chuỗi, lưu dưới một khoá. Đó là cách mô tả nhạt nhẽo. Còn cách thú vị: nó là kiểu dữ liệu duy nhất của Redis cho phép hai tiến trình khác nhau cập nhật hai thuộc tính khác nhau của cùng một đối tượng cùng lúc mà không bên nào phá huỷ công của bên kia.</p>

<h3>Các lệnh</h3>
<pre><code>redis-cli HSET user:1042 name "Cuong" email "c@example.com" plan free logins 0
redis-cli HGET user:1042 name
redis-cli HMGET user:1042 name plan missing
redis-cli HGETALL user:1042
redis-cli HDEL user:1042 email
redis-cli HEXISTS user:1042 email
redis-cli HLEN user:1042
redis-cli HSETNX user:1042 plan pro       <span class="tok-comment"># đã đặt rồi → không làm gì</span>
redis-cli HINCRBY user:1042 logins 1
redis-cli HSTRLEN user:1042 name</code></pre>
<div class="out">(integer) 4
"Cuong"
1) "Cuong"
2) "free"
3) (nil)
1) "name"
2) "Cuong"
3) "email"
4) "c@example.com"
5) "plan"
6) "free"
7) "logins"
8) "0"
(integer) 1
(integer) 0
(integer) 3
(integer) 0
(integer) 1
(integer) 5</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>HSET</code> nhận nhiều cặp</span><span class="v">Một lệnh, một lần ghi nguyên tử. <code>HMSET</code> vẫn chạy nhưng đã bị đánh dấu lỗi thời từ bản 4.0 — <code>HSET</code> làm đúng việc đó và trả về số trường <em>mới</em>.</span></div>
  <div class="kv"><span class="k"><code>HMGET</code> mới là thứ bạn cần, không phải <code>HGETALL</code></span><span class="v">Hãy hỏi đúng ba trường mà trang cần. <code>HGETALL</code> trên một hash 200 trường sẽ chuyển 200 trường về để vẽ ra hai cái, ở mỗi lượt yêu cầu.</span></div>
  <div class="kv"><span class="k"><code>HINCRBY</code> và <code>HINCRBYFLOAT</code></span><span class="v">Phép toán nguyên tử trên một trường, hệt như <code>INCR</code> trên chuỗi (Bài 3.2). Đây là cách một bộ đếm sống bên trong đối tượng thay vì nằm cạnh nó.</span></div>
  <div class="kv"><span class="k"><code>HSETNX</code> chỉ đặt khi chưa có</span><span class="v">Một lệnh duy nhất cho việc "khởi tạo trường này nếu chưa ai làm", không phải đọc và không có đua.</span></div>
  <div class="kv"><span class="k">Thiếu trường với thiếu khoá</span><span class="v">Cả hai đều trả <code>nil</code>. <code>HGET nosuchkey f</code> và <code>HGET user:1042 nosuchfield</code> không phân biệt được trong câu trả lời — hãy dùng <code>EXISTS</code> hoặc <code>HLEN</code> khi cái khác biệt đó quan trọng.</span></div>
</div>

<h3>Vì sao cách này hơn một chuỗi JSON</h3>
<pre><code><span class="tok-comment">// Cách nhét JSON vào chuỗi — đọc, sửa, ghi</span>
const raw  = await redis.get('user:1042');
const user = JSON.parse(raw);
user.plan  = 'pro';
await redis.set('user:1042', JSON.stringify(user));

<span class="tok-comment">// Cách dùng hash — một trường, một lệnh</span>
await redis.hSet('user:1042', 'plan', 'pro');</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lần ghi bị mất</span><span class="lz-t">hai người ghi, một người sống sót</span><span class="lz-d">Yêu cầu A đọc người dùng để đổi <code>plan</code>. Yêu cầu B đọc đúng người dùng đó để đổi <code>email</code>. A ghi trước, rồi B ghi — và bản sao của B chưa hề có gói mới, nên lần nâng cấp âm thầm biến mất. Với <code>HSET</code> thì hai lệnh ghi chạm vào hai trường khác nhau và cả hai đều sống.</span></div>
  <div class="lz-step"><span class="lz-k">Băng thông</span><span class="lz-t">4 KB vào, 4 KB ra, để đổi 3 byte</span><span class="lz-d">Một khối JSON bị đọc và ghi lại nguyên vẹn ở mỗi lần đổi. Trên một đối tượng nóng ở mức 5.000 lượt ghi/giây thì đó là 40 MB/giây đường truyền đổi lấy con số không.</span></div>
  <div class="lz-step"><span class="lz-k">Chi phí phân tích cú pháp</span><span class="lz-t">JSON.parse ở mỗi lượt đọc, trong tiến trình của bạn</span><span class="lz-d">Không phải vấn đề của Redis — của bạn. Hash trả về các trường đã tách sẵn; thư viện khách đưa cho bạn một đối tượng mà không phải phân tích gì cả.</span></div>
  <div class="lz-step"><span class="lz-k">Khi nào JSON thắng</span><span class="lz-t">cấu trúc lồng nhau và luôn đọc nguyên đối tượng</span><span class="lz-d">Hash thì phẳng: giá trị là chuỗi, không phải mảng hay đối tượng. Nếu tài liệu của bạn lồng nhau thật và bạn luôn đọc trọn vẹn nó, một chuỗi JSON đơn giản hơn và nhỏ hơn. Bài 5.3 đo cả hai.</span></div>
</div>
<div class="callout ok"><strong>Tính nguyên tử theo từng trường chính là toàn bộ vấn đề.</strong> Một giỏ hàng mà hai tab thêm hai món khác nhau, một bản ghi người dùng mà một việc chạy nền cập nhật <code>last_seen</code> trong lúc trang hồ sơ cập nhật <code>bio</code>, một bộ đếm tăng lên trong lúc một trường cấu hình đổi giá trị — tất cả những cái đó đều đúng ngay từ cách dựng khi dùng hash, và tất cả đều là một cuộc đua khi dùng đọc-sửa-ghi trên chuỗi JSON. Bạn có thể vá bản JSON bằng <code>WATCH</code> và một vòng lặp thử lại (Chương 7), nhưng bản hash thì không cần vá.</div>

<h3>HGETALL là khẩu súng đã lên đạn trên một hash lớn</h3>
<pre><code>redis-cli DEL bighash &gt;/dev/null
python3 -c "
for i in range(500_000): print(f'HSET bighash field:{i} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli HLEN bighash
time redis-cli HGETALL bighash &gt;/dev/null
time redis-cli HMGET bighash field:1 field:2 field:3 &gt;/dev/null
redis-cli HSCAN bighash 0 COUNT 10 | head -5
redis-cli HSCAN bighash 0 NOVALUES COUNT 5      <span class="tok-comment"># 7.4+: chỉ tên trường</span></code></pre>
<div class="out">(integer) 500000
real	0m1.226s
real	0m0.003s
"3670016"
"field:246054"
"value:246054"
"field:96263"
"value:96263"
1) "0"
2) 1) "field:127838"
   2) "field:453279"
   3) "field:308821"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1,2 giây treo toàn máy chủ</span><span class="v">Đơn luồng (Bài 1.1). Mọi khách khác nằm chờ. Và bản thân câu trả lời là một triệu chuỗi mà Redis phải dựng trong bộ nhớ trước khi gửi đi — áp lực bộ đệm đầu ra chồng lên áp lực CPU.</span></div>
  <div class="kv"><span class="k"><code>HMGET</code> nhanh gấp 400 lần ở đây</span><span class="v">Vì nó làm đúng cái bạn yêu cầu. Thói quen đáng rèn: đừng bao giờ viết <code>HGETALL</code> khi chưa biết chắc số trường bị chặn trên ngay từ thiết kế.</span></div>
  <div class="kv"><span class="k"><code>HSCAN</code> để duyệt</span><span class="v">Cùng giao kèo con trỏ với <code>SCAN</code> (Bài 2.3). Nó trả về trường và giá trị đan xen trong một mảng phẳng — chi tiết vấp chân mọi người ở lần đầu.</span></div>
  <div class="kv"><span class="k"><code>HSCAN … NOVALUES</code></span><span class="v">Redis 7.4+. Chỉ trả về tên trường, cắt đôi câu trả lời khi bạn duyệt để tìm khoá chứ không phải để đọc dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>HRANDFIELD</code> để lấy mẫu</span><span class="v">Cùng luật dấu của con số như <code>SRANDMEMBER</code> (Bài 4.2): dương thì khác nhau, âm thì cho lặp lại, và <code>WITHVALUES</code> để lấy cả hai nửa.</span></div>
</div>

<h3>Trường là chuỗi, và điều đó có hệ quả</h3>
<pre><code>redis-cli HSET cfg enabled true count 42 ratio 0.5 nothing ""
redis-cli HGET cfg enabled
redis-cli HGET cfg count
redis-cli HINCRBY cfg enabled 1
redis-cli HGET cfg nothing
redis-cli HEXISTS cfg nothing</code></pre>
<div class="out">(integer) 4
"true"
"42"
(error) ERR hash value is not an integer
""
(integer) 1</div>
<div class="pitfall"><strong>Cái bẫy:</strong> mọi thứ trả về đều là chuỗi, nên <code>"false"</code>, <code>"0"</code> và <code>""</code> đều là chuỗi mang giá trị đúng trong hầu hết ngôn ngữ, và cái boolean bạn cẩn thận lưu vào quay về dưới dạng chữ mà <code>if (user.enabled)</code> vui vẻ chấp nhận. Redis không có lược đồ và không có kiểu nào ngoài "chuỗi" — việc chuyển đổi hoàn toàn thuộc về phía bạn, và nó là nguồn phổ biến nhất của loại lỗi "cờ đang tắt mà tính năng vẫn bật". Hai thói quen chữa được: đừng bao giờ lưu boolean thô, hãy lưu <code>1</code>/<code>0</code> rồi ép kiểu bằng <code>=== '1'</code>; và đặt phần phân tích vào đúng một hàm ánh xạ hash thô sang kiểu đối tượng của bạn, để nó tồn tại ở đúng một chỗ. Chuỗi rỗng là cái bẫy riêng của nó — một trường rỗng vẫn <em>tồn tại</em> (<code>HEXISTS</code> trả về 1) nhưng đọc ra là giá trị sai, nên "chưa đặt" và "đặt thành rỗng" cần hai cách biểu diễn khác nhau nếu bạn quan tâm tới khác biệt ấy. Và để ý cái lỗi ở trên: <code>HINCRBY</code> từ chối làm toán trên <code>"true"</code>, đó là chỗ duy nhất Redis chịu kiểm tra.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/hashes/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis hashes</span><span class="lc-sub">Mọi lệnh H kèm độ phức tạp, các ngưỡng mã hoá, và ví dụ chính thức về mô hình hoá đối tượng. Trang ngắn, đáng đọc từ đầu tới cuối.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/hscan/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">HSCAN</span><span class="lc-sub">Giao kèo con trỏ, dạng câu trả lời đan xen trường/giá trị, tuỳ chọn <code>NOVALUES</code> thêm vào ở bản 7.4, và những bảo đảm bạn có và không có trong lúc hash đang bị ghi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: mô hình hoá một người dùng bằng hash</span><span class="lc-sub">Bài chấm điểm: thay một lượt cập nhật JSON đọc-sửa-ghi bằng <code>HSET</code>, thay một <code>HGETALL</code> bằng đúng lệnh <code>HMGET</code>, và viết hàm phân tích biến một hash thô thành một đối tượng có kiểu.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hash cho phép hai người ghi cùng cập nhật hai trường của cùng một đối tượng mà không mất lần ghi nào — đó là tính chất mà một chuỗi JSON không cho bạn được nếu không có giao dịch. <code>HGETALL</code> là O(N) và chặn máy chủ, nên hãy xin đúng những trường bạn cần bằng <code>HMGET</code> và duyệt bằng <code>HSCAN</code>; <code>HGETALL</code> chỉ an toàn trên một hash mà số trường bị chặn trên ngay từ thiết kế. Và mọi giá trị đều là chuỗi trên đường ra, nên boolean, số và chuyện "chưa đặt hay rỗng" là việc của bạn — hãy đặt phần ép kiểu vào một hàm duy nhất rồi dùng nó ở mọi nơi.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Encoding and memory: the trick that saves gigabytes|||5.2 — Mã hoá và bộ nhớ: cái mẹo tiết kiệm hàng gigabyte',
      slug: 'rd-5-2-ma-hoa-bo-nho',
      type: 'LESSON',
      description: 'listpack với hashtable, hai ngưỡng quyết định cái nào, phép đo thật một triệu đối tượng lưu hai kiểu chênh nhau 3,4 lần, mẹo chia gáo của Instagram, và cái giá bạn phải trả để đổi lấy chỗ tiết kiệm ấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Encoding and memory: the trick that saves gigabytes</h2>
<p class="lead">Redis stores a small hash completely differently from a large one, and the gap between the two is the single largest memory optimisation available to you. It is also the one that people find by accident, three months in, when the instance runs out of RAM.</p>

<h3>Two encodings, two thresholds</h3>
<pre><code>redis-cli DEL h1 h2 h3 &gt;/dev/null
redis-cli HSET h1 a 1 b 2 c 3 &gt;/dev/null
python3 -c "
for i in range(200): print(f'HSET h2 f{i} {i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli HSET h3 big "$(python3 -c 'print("x"*100)')" &gt;/dev/null
for k in h1 h2 h3; do
  printf "%-4s %-10s %s\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done
redis-cli CONFIG GET hash-max-listpack-entries
redis-cli CONFIG GET hash-max-listpack-value</code></pre>
<div class="out">h1   listpack   96
h2   hashtable  15408
h3   hashtable  200
1) "hash-max-listpack-entries"
2) "128"
1) "hash-max-listpack-value"
2) "64"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">listpack — the small case</span><span class="lz-lnote">One flat, contiguous block: field, value, field, value, with length prefixes. No pointers, no hash table, no per-field allocation. Lookups scan linearly, which on 128 entries inside one cache-friendly block is fast. Memory is roughly <strong>the size of your data plus a few bytes per entry</strong>.</span></div>
  <div class="lz-layer"><span class="lz-lname">hashtable — the general case</span><span class="lz-lnote">A real dict: buckets, a <code>dictEntry</code> per field, an <code>robj</code> per value, an SDS header per string. True O(1) lookups, and roughly <strong>60–100 bytes of overhead per field</strong> before your data. That is why h3 above, holding one 100-byte value, costs 200 bytes.</span></div>
  <div class="lz-layer"><span class="lz-lname">Either threshold flips it</span><span class="lz-lnote">More than <code>hash-max-listpack-entries</code> fields (128), <em>or</em> any single field name or value longer than <code>hash-max-listpack-value</code> (64 bytes). h3 has one field and still converted, because its value is 100 bytes. And like sets and sorted sets, the conversion is one-way: deleting fields back down does not convert it back.</span></div>
</div>

<h3>The measurement that changes how you model things</h3>
<pre><code><span class="tok-comment"># A million objects, stored as a million top-level keys</span>
redis-cli FLUSHDB &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'SET obj:{i} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory_human

<span class="tok-comment"># The same million objects, bucketed 100 per hash</span>
redis-cli FLUSHDB &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'HSET obj:{i//100} {i%100} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory_human
redis-cli DBSIZE
redis-cli OBJECT ENCODING obj:0</code></pre>
<div class="out">used_memory_human:89.31M
used_memory_human:26.44M
(integer) 10000
"listpack"</div>
<div class="callout ok"><strong>3.4× less memory for exactly the same data.</strong> This is the trick Instagram published in 2011 and it still works, for the same reason it worked then: a top-level key costs you a <code>dictEntry</code> in the global keyspace dict, an <code>robj</code>, an SDS header, an expires-dict slot and an allocator rounding — around 90 bytes before the value. A field inside a listpack hash costs a length prefix. Ten thousand keys instead of a million means ten thousand of that overhead instead of a million. The bigger your objects, the smaller the relative win; the tinier your values, the more of your RAM is pure bookkeeping and the more this matters.</div>
<pre><code><span class="tok-comment">// The bucketing is two lines, and it is the whole implementation</span>
const BUCKET = 100;
const keyFor   = (id) =&gt; &#96;obj:\${Math.floor(id / BUCKET)}&#96;;
const fieldFor = (id) =&gt; String(id % BUCKET);

await redis.hSet(keyFor(id), fieldFor(id), value);
const v = await redis.hGet(keyFor(id), fieldFor(id));

<span class="tok-comment">// Pick BUCKET so it stays under hash-max-listpack-entries (128).</span>
<span class="tok-comment">// 100 leaves headroom; 128 exactly is one bad assumption away from 60x memory.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The bucket must stay under the threshold</span><span class="v">One field over 128 and that bucket becomes a hashtable, silently, and its memory jumps ~5×. Choose 100, not 128, and never let the bucket size be derived from something that can grow.</span></div>
  <div class="kv"><span class="k">Values must stay under 64 bytes too</span><span class="v">The value threshold is the one people forget. A bucket of 100 short IDs is a listpack; add one field holding a 200-character URL and the whole bucket converts. If your values are long, this trick does not apply.</span></div>
  <div class="kv"><span class="k">Lookups become O(bucket), not O(1)</span><span class="v">A linear scan of 100 entries in one contiguous block. Measurably slower than a hash lookup, and still microseconds — the trade is almost always worth it, but it is a trade.</span></div>
  <div class="kv"><span class="k">You lose per-object TTL — mostly</span><span class="v">Until Redis 7.4 a field could not expire on its own; the whole bucket expired together. <code>HEXPIRE</code> changed that, and Lesson 5.4 is entirely about it.</span></div>
  <div class="kv"><span class="k">You lose per-object anything else</span><span class="v">No <code>OBJECT ENCODING</code> per object, no per-object <code>MEMORY USAGE</code>, no <code>SCAN MATCH obj:12345</code>. Debugging gets harder in exchange for the RAM.</span></div>
</div>

<h3>Finding out what your memory is actually doing</h3>
<pre><code>redis-cli --bigkeys                    <span class="tok-comment"># biggest key per type, one pass, safe</span>
redis-cli --memkeys                    <span class="tok-comment"># by MEMORY USAGE instead of element count</span>
redis-cli MEMORY USAGE obj:0
redis-cli MEMORY USAGE obj:0 SAMPLES 0     <span class="tok-comment"># exact, not sampled</span>
redis-cli MEMORY DOCTOR
redis-cli INFO memory | grep -E "used_memory_human|used_memory_rss_human|mem_fragmentation_ratio"</code></pre>
<div class="out">[00.00%] Biggest hash found so far '"obj:4821"' with 100 fields
-------- summary -------
Sampled 10000 keys in the keyspace!
Total key length in bytes is 78894 (avg len 7.89)

Biggest   hash found '"obj:4821"' has 100 fields

10000 hashes with 1000000 fields (100.00% of keys, avg size 100.00)
1264
1264
Sam, I detected a few issues in this Redis instance memory implants:

 * High allocator fragmentation: This instance has an allocator external fragmentation greater than 1.1.
used_memory_human:26.44M
used_memory_rss_human:39.77M
mem_fragmentation_ratio:1.53</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--bigkeys</code> is safe on production</span><span class="v">It uses <code>SCAN</code> under the hood, not <code>KEYS</code> (Lesson 2.3). It reports the biggest key <em>per type</em> by element count — which is not the same as by memory.</span></div>
  <div class="kv"><span class="k"><code>--memkeys</code> asks the better question</span><span class="v">Ranks by <code>MEMORY USAGE</code>. A 50-field hash holding 1 MB values beats a 500,000-field hash of tiny ints, and only <code>--memkeys</code> tells you that.</span></div>
  <div class="kv"><span class="k"><code>MEMORY USAGE</code> is sampled by default</span><span class="v">It samples 5 nested values and extrapolates. <code>SAMPLES 0</code> makes it exact — and O(N), so do not run that on a huge key in production.</span></div>
  <div class="kv"><span class="k"><code>mem_fragmentation_ratio</code> above 1.5</span><span class="v">RSS well above <code>used_memory</code> means the allocator is holding memory Redis is not using. Often normal after a big delete; persistent high values are what <code>activedefrag</code> exists for (Chapter 9).</span></div>
  <div class="kv"><span class="k">Overhead you cannot see per-key</span><span class="v"><code>INFO memory</code> also reports <code>used_memory_overhead</code> — replication buffers, client output buffers, the keyspace dict itself. On an instance with millions of tiny keys, this is often the biggest line.</span></div>
</div>
<div class="pitfall"><strong>Pitfall:</strong> "fixing" the memory problem by raising <code>hash-max-listpack-entries</code> to 10,000. It works, briefly, and then a lookup that used to be a hash probe becomes a linear scan of ten thousand entries in a single-threaded server — and now every <code>HGET</code> is an O(10,000) operation that blocks everyone (Lesson 1.1). Redis picked 128 because that is roughly where the linear scan stops being cheaper than the pointer chase, and the number is not arbitrary. Raising it to 256 or 512 with short values is defensible and occasionally useful; raising it into the thousands trades a memory problem you can see for a latency problem you cannot. The right fix is almost always the opposite direction: fewer, better-shaped keys — bucketing (above), shorter field names, and integer values where possible, since Redis shares integer objects 0–9999 (Lesson 3.1).</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Redis memory optimization</span><span class="lc-sub">The official page, including the small-hash trick with the original reasoning. It is old, still accurate, and the source for most of what everyone else has written about this.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/memory-usage/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">MEMORY USAGE and MEMORY DOCTOR</span><span class="lc-sub">What the sampling actually does, why <code>SAMPLES 0</code> is exact but expensive, and how to read <code>MEMORY STATS</code> when the totals do not add up.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: shrink an instance</span><span class="lc-sub">Graded exercises: measure a million keys two ways, implement the bucketing helpers, find the one value length that silently converts a bucket, and read a <code>--memkeys</code> report to name the real culprit.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A hash is a listpack until it has more than 128 fields <em>or</em> any field/value longer than 64 bytes, and after that it is a hashtable costing 60–100 bytes per field forever — the conversion never reverses. Bucketing many small objects into fewer hashes cut a real million-object dataset from 89 MB to 26 MB, because you stop paying top-level key overhead a million times. And measure before you optimise: <code>--memkeys</code> ranks by actual memory, <code>MEMORY USAGE</code> is sampled unless you say <code>SAMPLES 0</code>, and raising the listpack thresholds to force the win converts a visible memory problem into an invisible latency one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mã hoá và bộ nhớ: cái mẹo tiết kiệm hàng gigabyte</h2>
<p class="lead">Redis lưu một hash nhỏ theo cách hoàn toàn khác với một hash lớn, và khoảng cách giữa hai cách ấy là phép tối ưu bộ nhớ lớn nhất mà bạn có trong tay. Nó cũng là thứ người ta tình cờ tìm ra, sau ba tháng, đúng lúc máy hết RAM.</p>

<h3>Hai kiểu mã hoá, hai cái ngưỡng</h3>
<pre><code>redis-cli DEL h1 h2 h3 &gt;/dev/null
redis-cli HSET h1 a 1 b 2 c 3 &gt;/dev/null
python3 -c "
for i in range(200): print(f'HSET h2 f{i} {i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli HSET h3 big "$(python3 -c 'print("x"*100)')" &gt;/dev/null
for k in h1 h2 h3; do
  printf "%-4s %-10s %s\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done
redis-cli CONFIG GET hash-max-listpack-entries
redis-cli CONFIG GET hash-max-listpack-value</code></pre>
<div class="out">h1   listpack   96
h2   hashtable  15408
h3   hashtable  200
1) "hash-max-listpack-entries"
2) "128"
1) "hash-max-listpack-value"
2) "64"</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">listpack — trường hợp nhỏ</span><span class="lz-lnote">Một khối phẳng, liền mạch: trường, giá trị, trường, giá trị, kèm tiền tố độ dài. Không con trỏ, không bảng băm, không cấp phát riêng cho từng trường. Tra cứu là quét tuyến tính, mà trên 128 mục nằm gọn trong một khối thân thiện với cache thì nhanh. Bộ nhớ xấp xỉ <strong>bằng kích thước dữ liệu của bạn cộng vài byte mỗi mục</strong>.</span></div>
  <div class="lz-layer"><span class="lz-lname">hashtable — trường hợp tổng quát</span><span class="lz-lnote">Một cái dict thật: các gáo, một <code>dictEntry</code> cho mỗi trường, một <code>robj</code> cho mỗi giá trị, một phần đầu SDS cho mỗi chuỗi. Tra cứu O(1) thật, và tốn khoảng <strong>60–100 byte chi phí phụ mỗi trường</strong> trước khi tính dữ liệu. Đó là vì sao h3 ở trên, chỉ giữ một giá trị 100 byte, lại tốn 200 byte.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ cần một trong hai ngưỡng là lật</span><span class="lz-lnote">Nhiều hơn <code>hash-max-listpack-entries</code> trường (128), <em>hoặc</em> có bất kỳ tên trường hay giá trị nào dài hơn <code>hash-max-listpack-value</code> (64 byte). h3 chỉ có một trường mà vẫn chuyển kiểu, vì giá trị của nó dài 100 byte. Và giống set với sorted set, việc chuyển kiểu là một chiều: xoá bớt trường không làm nó quay lại.</span></div>
</div>

<h3>Phép đo làm thay đổi cách bạn mô hình hoá mọi thứ</h3>
<pre><code><span class="tok-comment"># Một triệu đối tượng, lưu thành một triệu khoá cấp cao nhất</span>
redis-cli FLUSHDB &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'SET obj:{i} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory_human

<span class="tok-comment"># Đúng một triệu đối tượng đó, gom 100 cái vào mỗi hash</span>
redis-cli FLUSHDB &gt;/dev/null
python3 -c "
for i in range(1_000_000): print(f'HSET obj:{i//100} {i%100} value:{i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory_human
redis-cli DBSIZE
redis-cli OBJECT ENCODING obj:0</code></pre>
<div class="out">used_memory_human:89.31M
used_memory_human:26.44M
(integer) 10000
"listpack"</div>
<div class="callout ok"><strong>Ít hơn 3,4 lần bộ nhớ cho đúng cùng một mớ dữ liệu.</strong> Đây là mẹo Instagram công bố năm 2011 và nó vẫn chạy, vì đúng lý do nó chạy khi ấy: một khoá cấp cao nhất bắt bạn trả một <code>dictEntry</code> trong dict không gian khoá toàn cục, một <code>robj</code>, một phần đầu SDS, một chỗ trong dict hạn dùng và một lần làm tròn của bộ cấp phát — khoảng 90 byte trước khi tính giá trị. Một trường nằm trong hash listpack chỉ tốn một tiền tố độ dài. Mười nghìn khoá thay vì một triệu nghĩa là mười nghìn lần chi phí ấy thay vì một triệu lần. Đối tượng của bạn càng lớn thì phần thắng tương đối càng nhỏ; giá trị của bạn càng tí hon thì càng nhiều RAM của bạn là sổ sách thuần tuý và chuyện này càng quan trọng.</div>
<pre><code><span class="tok-comment">// Phép chia gáo gói trong hai dòng, và đó là toàn bộ phần cài đặt</span>
const BUCKET = 100;
const keyFor   = (id) =&gt; &#96;obj:\${Math.floor(id / BUCKET)}&#96;;
const fieldFor = (id) =&gt; String(id % BUCKET);

await redis.hSet(keyFor(id), fieldFor(id), value);
const v = await redis.hGet(keyFor(id), fieldFor(id));

<span class="tok-comment">// Chọn BUCKET sao cho nó luôn dưới hash-max-listpack-entries (128).</span>
<span class="tok-comment">// 100 còn chừa chỗ; đúng 128 thì chỉ cách một giả định sai là gấp 60 lần bộ nhớ.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Gáo phải luôn nằm dưới ngưỡng</span><span class="v">Dư một trường quá 128 là cái gáo đó thành hashtable, âm thầm, và bộ nhớ của nó nhảy lên ~5 lần. Hãy chọn 100 chứ đừng chọn 128, và đừng bao giờ để kích thước gáo được suy ra từ thứ có thể lớn lên.</span></div>
  <div class="kv"><span class="k">Giá trị cũng phải dưới 64 byte</span><span class="v">Ngưỡng giá trị mới là cái người ta hay quên. Một gáo 100 mã ngắn là listpack; thêm một trường giữ một URL 200 ký tự là cả cái gáo chuyển kiểu. Nếu giá trị của bạn dài thì mẹo này không áp dụng được.</span></div>
  <div class="kv"><span class="k">Tra cứu thành O(kích thước gáo), không còn O(1)</span><span class="v">Một lượt quét tuyến tính 100 mục trong một khối liền mạch. Chậm hơn một phép tra bảng băm ở mức đo được, và vẫn ở cỡ micro giây — cuộc đổi chác này gần như luôn đáng, nhưng nó là một cuộc đổi chác.</span></div>
  <div class="kv"><span class="k">Bạn mất TTL theo từng đối tượng — phần lớn là vậy</span><span class="v">Cho tới bản Redis 7.4 thì một trường không thể tự hết hạn; cả cái gáo hết hạn cùng nhau. <code>HEXPIRE</code> đã thay đổi điều đó, và Bài 5.4 dành trọn cho nó.</span></div>
  <div class="kv"><span class="k">Bạn mất mọi thứ khác theo từng đối tượng</span><span class="v">Không có <code>OBJECT ENCODING</code> cho từng đối tượng, không có <code>MEMORY USAGE</code> cho từng đối tượng, không có <code>SCAN MATCH obj:12345</code>. Việc gỡ lỗi khó lên để đổi lấy RAM.</span></div>
</div>

<h3>Tìm ra bộ nhớ của bạn thật sự đang làm gì</h3>
<pre><code>redis-cli --bigkeys                    <span class="tok-comment"># khoá lớn nhất theo từng kiểu, một lượt, an toàn</span>
redis-cli --memkeys                    <span class="tok-comment"># theo MEMORY USAGE thay vì theo số phần tử</span>
redis-cli MEMORY USAGE obj:0
redis-cli MEMORY USAGE obj:0 SAMPLES 0     <span class="tok-comment"># chính xác, không lấy mẫu</span>
redis-cli MEMORY DOCTOR
redis-cli INFO memory | grep -E "used_memory_human|used_memory_rss_human|mem_fragmentation_ratio"</code></pre>
<div class="out">[00.00%] Biggest hash found so far '"obj:4821"' with 100 fields
-------- summary -------
Sampled 10000 keys in the keyspace!
Total key length in bytes is 78894 (avg len 7.89)

Biggest   hash found '"obj:4821"' has 100 fields

10000 hashes with 1000000 fields (100.00% of keys, avg size 100.00)
1264
1264
Sam, I detected a few issues in this Redis instance memory implants:

 * High allocator fragmentation: This instance has an allocator external fragmentation greater than 1.1.
used_memory_human:26.44M
used_memory_rss_human:39.77M
mem_fragmentation_ratio:1.53</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--bigkeys</code> an toàn trên production</span><span class="v">Bên dưới nó dùng <code>SCAN</code>, không phải <code>KEYS</code> (Bài 2.3). Nó báo khoá lớn nhất <em>theo từng kiểu</em> tính theo số phần tử — vốn không giống với tính theo bộ nhớ.</span></div>
  <div class="kv"><span class="k"><code>--memkeys</code> hỏi câu hỏi đúng hơn</span><span class="v">Xếp hạng theo <code>MEMORY USAGE</code>. Một hash 50 trường giữ các giá trị 1 MB thắng một hash 500.000 trường toàn số nguyên tí hon, và chỉ <code>--memkeys</code> nói cho bạn biết điều đó.</span></div>
  <div class="kv"><span class="k"><code>MEMORY USAGE</code> mặc định là lấy mẫu</span><span class="v">Nó lấy mẫu 5 giá trị lồng bên trong rồi ngoại suy. <code>SAMPLES 0</code> làm nó chính xác — và thành O(N), nên đừng chạy vậy trên một khoá khổng lồ ở production.</span></div>
  <div class="kv"><span class="k"><code>mem_fragmentation_ratio</code> trên 1,5</span><span class="v">RSS cao hơn hẳn <code>used_memory</code> nghĩa là bộ cấp phát đang ôm phần bộ nhớ mà Redis không dùng. Thường là bình thường sau một lượt xoá lớn; giá trị cao dai dẳng chính là thứ mà <code>activedefrag</code> sinh ra để trị (Chương 9).</span></div>
  <div class="kv"><span class="k">Chi phí phụ bạn không thấy được theo từng khoá</span><span class="v"><code>INFO memory</code> còn báo <code>used_memory_overhead</code> — bộ đệm nhân bản, bộ đệm đầu ra của khách, và chính cái dict không gian khoá. Trên một máy có hàng triệu khoá tí hon thì đây thường là dòng lớn nhất.</span></div>
</div>
<div class="pitfall"><strong>Cái bẫy:</strong> "chữa" vấn đề bộ nhớ bằng cách nâng <code>hash-max-listpack-entries</code> lên 10.000. Nó chạy được, trong chốc lát, rồi một phép tra cứu vốn là một lần dò bảng băm trở thành một lượt quét tuyến tính mười nghìn mục trên một máy chủ đơn luồng — và giờ mỗi lệnh <code>HGET</code> là một phép O(10.000) chặn tất cả mọi người (Bài 1.1). Redis chọn 128 vì đó xấp xỉ chỗ mà lượt quét tuyến tính hết rẻ hơn việc đuổi theo con trỏ, và con số đó không phải tuỳ tiện. Nâng lên 256 hay 512 với giá trị ngắn thì bảo vệ được và đôi khi có ích; nâng lên hàng nghìn là đổi một vấn đề bộ nhớ bạn nhìn thấy lấy một vấn đề độ trễ bạn không nhìn thấy. Cách chữa đúng gần như luôn theo hướng ngược lại: ít khoá hơn và khoá có hình dáng tốt hơn — chia gáo (ở trên), tên trường ngắn hơn, và giá trị dạng số nguyên khi có thể, vì Redis dùng chung đối tượng số nguyên 0–9999 (Bài 3.1).</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Redis memory optimization</span><span class="lc-sub">Trang chính thức, gồm cả mẹo hash nhỏ kèm lập luận gốc. Nó cũ, vẫn chính xác, và là nguồn của phần lớn những gì người khác đã viết về chuyện này.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/memory-usage/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">MEMORY USAGE và MEMORY DOCTOR</span><span class="lc-sub">Phép lấy mẫu thật sự làm gì, vì sao <code>SAMPLES 0</code> chính xác nhưng đắt, và cách đọc <code>MEMORY STATS</code> khi các con số tổng không khớp nhau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm nhỏ một máy Redis</span><span class="lc-sub">Bài chấm điểm: đo một triệu khoá theo hai cách, cài đặt cặp hàm chia gáo, tìm ra đúng một độ dài giá trị âm thầm chuyển kiểu cả gáo, và đọc một báo cáo <code>--memkeys</code> để chỉ đúng thủ phạm thật.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một hash là listpack cho tới khi nó có hơn 128 trường <em>hoặc</em> có trường/giá trị nào dài hơn 64 byte, sau đó nó là hashtable tốn 60–100 byte mỗi trường mãi mãi — việc chuyển kiểu không bao giờ đảo ngược. Gom nhiều đối tượng nhỏ vào ít hash hơn đã cắt một tập dữ liệu một triệu đối tượng thật từ 89 MB xuống 26 MB, vì bạn thôi trả chi phí khoá cấp cao nhất một triệu lần. Và hãy đo trước khi tối ưu: <code>--memkeys</code> xếp hạng theo bộ nhớ thật, <code>MEMORY USAGE</code> là lấy mẫu trừ khi bạn nói <code>SAMPLES 0</code>, và nâng ngưỡng listpack lên để ép lấy phần thắng chỉ biến một vấn đề bộ nhớ nhìn thấy được thành một vấn đề độ trễ vô hình.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Modelling an object: hash, JSON or separate keys|||5.3 — Mô hình hoá một đối tượng: hash, JSON hay khoá rời',
      slug: 'rd-5-3-mo-hinh-doi-tuong',
      type: 'LESSON',
      description: 'Cùng một đối tượng dựng bốn kiểu rồi đo bộ nhớ với độ trễ, vấn đề làm phẳng dữ liệu lồng nhau, khi nào khoá rời thắng, RedisJSON là module chứ không phải Redis, và luật đặt tên khoá giữ mọi thứ tìm lại được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Modelling an object: hash, JSON or separate keys</h2>
<p class="lead">"Store a user in Redis" has four reasonable answers and they are not interchangeable. The choice is decided by three questions — do you read the whole object or part of it, do you write the whole object or part of it, and do the parts have different lifetimes — and getting it wrong costs you either memory, correctness, or both.</p>

<h3>The same user, four ways, measured</h3>
<pre><code>redis-cli FLUSHDB &gt;/dev/null
<span class="tok-comment"># A — JSON in one string key</span>
redis-cli SET u:json '{"id":1042,"name":"Cuong","email":"c@example.com","plan":"pro","bio":"Backend engineer in Hanoi","logins":37}'
<span class="tok-comment"># B — one hash</span>
redis-cli HSET u:hash id 1042 name Cuong email c@example.com plan pro bio "Backend engineer in Hanoi" logins 37 &gt;/dev/null
<span class="tok-comment"># C — one key per field</span>
for f in id:1042 name:Cuong email:c@example.com plan:pro logins:37; do
  redis-cli SET "u:split:\${f%%:*}" "\${f#*:}" &gt;/dev/null
done
for k in u:json u:hash u:split:name; do
  printf "%-14s %-10s %s\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done
redis-cli MEMORY USAGE u:hash SAMPLES 0</code></pre>
<div class="out">u:json         embstr     168
u:hash         listpack   224
u:split:name   embstr     56
224</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A · JSON string — 168 bytes</span><span class="v">The smallest, because it is one key and one allocation. Reading it is one <code>GET</code>; changing one field is <code>GET</code> + parse + serialise + <code>SET</code>, and two concurrent writers lose one update (Lesson 5.1).</span></div>
  <div class="kv"><span class="k">B · Hash — 224 bytes</span><span class="v">33% more, and you get atomic per-field writes, <code>HINCRBY</code> on <code>logins</code>, and <code>HMGET</code> that transfers only what the page needs. In almost every case this is the right default.</span></div>
  <div class="kv"><span class="k">C · Separate keys — 56 bytes × 5 = 280</span><span class="v">The most memory (five key overheads instead of one) and the most round trips, unless you pipeline. It buys exactly one thing: independent TTLs per field.</span></div>
  <div class="kv"><span class="k">D · RedisJSON — a module, not Redis</span><span class="v"><code>JSON.SET</code>/<code>JSON.GET</code> with real nesting and JSONPath. Excellent, and unavailable unless you run Redis Stack or install the module — which rules it out on most managed hosting.</span></div>
  <div class="kv"><span class="k">The numbers move with object size</span><span class="v">At six short fields the differences are noise. At sixty fields the hash wins on transfer and the JSON string wins on storage; at values over 64 bytes the hash converts to <code>hashtable</code> and the gap inverts (Lesson 5.2). Measure your real objects.</span></div>
</div>

<h3>Decide with three questions</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · How do you read it?</span><span class="lz-t">whole object → JSON · a few fields → hash</span><span class="lz-d">If every read is "give me the entire user", a JSON string is one <code>GET</code>, one allocation and one parse — hard to beat. If a page needs <code>name</code> and <code>avatar</code> out of forty fields, <code>HMGET</code> transfers two fields and JSON transfers forty.</span></div>
  <div class="lz-step"><span class="lz-k">2 · How do you write it?</span><span class="lz-t">any partial write → hash, always</span><span class="lz-d">This is the question that usually decides it. One background job touching <code>last_seen</code> while a request touches <code>bio</code> is a lost update on a JSON string and a non-event on a hash. Concurrency is not a scale problem you can defer — two tabs is enough.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Do the parts have different lifetimes?</span><span class="lz-t">yes → separate keys, or HEXPIRE on 7.4</span><span class="lz-d">A session token that expires in 30 minutes cannot live in the same key as a profile that never expires — before 7.4, TTL belonged to the whole key. Lesson 5.4 covers what changed.</span></div>
  <div class="lz-step"><span class="lz-k">The tie-break: is it nested?</span><span class="lz-t">deeply nested → JSON or RedisJSON</span><span class="lz-d">A hash is flat. Nesting means flattening field names (<code>address.city</code>) or storing sub-objects as JSON strings inside fields, and both are workable but neither is nice. Genuinely tree-shaped data is a JSON string's home turf.</span></div>
</div>

<h3>The flattening problem, and the two honest workarounds</h3>
<pre><code><span class="tok-comment"># Option 1 — dotted field names, flat hash</span>
redis-cli HSET u:1042 name Cuong address.city Hanoi address.zip 100000 prefs.theme dark
redis-cli HMGET u:1042 address.city prefs.theme
redis-cli HSCAN u:1042 0 MATCH "address.*" NOVALUES

<span class="tok-comment"># Option 2 — a JSON string inside one field</span>
redis-cli HSET u:1042 name Cuong address '{"city":"Hanoi","zip":"100000"}'
redis-cli HGET u:1042 address</code></pre>
<div class="out">(integer) 4
1) "Hanoi"
2) "dark"
1) "0"
2) 1) "address.city"
   2) "address.zip"
"{\\"city\\":\\"Hanoi\\",\\"zip\\":\\"100000\\"}"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dotted names keep atomicity</span><span class="v"><code>HSET u:1042 address.city Danang</code> is still a single-field atomic write. You keep everything a hash is good at, at the cost of field names that are a convention rather than a structure.</span></div>
  <div class="kv"><span class="k">Dotted names are searchable-ish</span><span class="v"><code>HSCAN … MATCH "address.*"</code> gets you a sub-object back. Not fast on a big hash, but useful, and impossible with option 2.</span></div>
  <div class="kv"><span class="k">A JSON field re-creates the lost update</span><span class="v">Option 2 gives you nesting back and hands you exactly the read-modify-write race you used a hash to avoid — but scoped to that one sub-object, which is often an acceptable trade.</span></div>
  <div class="kv"><span class="k">Arrays are where hashes give up</span><span class="v">There is no good flat representation of a list of things. <code>tags.0</code>, <code>tags.1</code> works and is miserable to maintain. A separate set or list key, referenced by ID, is the honest answer.</span></div>
  <div class="kv"><span class="k">Field names cost memory too</span><span class="v">Every field name is stored in full, in every hash. <code>address.city</code> across a million users is 12 MB of the string "address.city". On huge datasets, short field names (<code>ac</code>) with a mapping in code is a real optimisation — and a real readability cost.</span></div>
</div>
<div class="callout warn"><strong>Do not split one object across many keys "for flexibility".</strong> <code>u:1042:name</code>, <code>u:1042:email</code>, <code>u:1042:plan</code> looks tidy and costs you five key overheads, five round trips (or a pipeline you must remember to write), no atomic multi-field write, and a <code>DEL</code> that has to name every field or leak the ones it forgot. There is exactly one reason to do this — genuinely different TTLs per field on Redis older than 7.4 — and if that is not your reason, use a hash.</div>

<h3>Naming keys so you can still find things in a year</h3>
<pre><code>redis-cli HSET user:1042 name Cuong &gt;/dev/null            <span class="tok-comment"># type:id</span>
redis-cli HSET user:1042:prefs theme dark &gt;/dev/null      <span class="tok-comment"># type:id:aspect</span>
redis-cli SADD user:1042:roles admin editor &gt;/dev/null    <span class="tok-comment"># related collection</span>
redis-cli ZADD leaderboard:2026-08 1500 user:1042 &gt;/dev/null
redis-cli SCAN 0 MATCH "user:1042*" COUNT 100
redis-cli MEMORY USAGE user:1042</code></pre>
<div class="out">1) "0"
2) 1) "user:1042"
   2) "user:1042:prefs"
   3) "user:1042:roles"
120</div>
<div class="pitfall"><strong>Pitfall:</strong> a key naming scheme invented per-feature rather than agreed once. Six months in you have <code>user:1042</code>, <code>users/1043</code>, <code>u_1044</code> and <code>USER:1045:v2</code> in the same instance, and now nothing can be swept, migrated or debugged by pattern — <code>SCAN MATCH</code> only helps if the pattern is real. Agree three rules on day one and put them in the README: <strong>colon-separated segments</strong> (<code>type:id:aspect</code>), <strong>singular lowercase type names</strong>, and <strong>the ID always in the same position</strong>. Two more that pay for themselves: put a version segment in anything whose shape might change (<code>user:v2:1042</code>) so a format migration is a new prefix rather than a rewrite in place, and prefix every key that belongs to a background job or an experiment (<code>tmp:</code>, <code>job:</code>) so it is obvious what is safe to delete when the instance fills up at 2am. And remember that keys share one namespace across the whole database — <code>SELECT</code> (Lesson 2.5) is not isolation, and it does not exist in Cluster at all (Chapter 11).</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">The Redis keyspace</span><span class="lc-sub">The official guidance on key naming, key length trade-offs, and what the keyspace actually is. Short, and the conventions here are worth adopting verbatim.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/json/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">RedisJSON</span><span class="lc-sub">Real nested documents with JSONPath, atomic sub-document updates and partial reads. Read the first paragraph carefully: it needs the module, so check what your host actually runs before designing around it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: model four real objects</span><span class="lc-sub">Graded exercises: a session, a shopping cart, a nested product with variants and a user profile — pick a representation for each, justify it with the three questions, and measure the one you chose.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Answer three questions and the model chooses itself: partial <em>writes</em> mean a hash, whole-object reads with no partial writes make a JSON string smaller and simpler, and genuinely different lifetimes per field mean separate keys or <code>HEXPIRE</code>. Nesting is where hashes lose — flatten with dotted field names to keep atomicity, or store a sub-object as a JSON field and accept the read-modify-write race inside it. And agree a key naming scheme on day one, because <code>SCAN MATCH</code>, migrations and 2am cleanups all depend on the pattern being real.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Mô hình hoá một đối tượng: hash, JSON hay khoá rời</h2>
<p class="lead">"Lưu một người dùng vào Redis" có bốn câu trả lời hợp lý và chúng không thay thế được cho nhau. Lựa chọn được quyết bởi ba câu hỏi — bạn đọc nguyên đối tượng hay chỉ một phần, bạn ghi nguyên đối tượng hay chỉ một phần, và các phần có tuổi thọ khác nhau không — và chọn sai thì bạn mất bộ nhớ, mất tính đúng đắn, hoặc mất cả hai.</p>

<h3>Cùng một người dùng, bốn kiểu, có đo</h3>
<pre><code>redis-cli FLUSHDB &gt;/dev/null
<span class="tok-comment"># A — JSON trong một khoá chuỗi</span>
redis-cli SET u:json '{"id":1042,"name":"Cuong","email":"c@example.com","plan":"pro","bio":"Backend engineer in Hanoi","logins":37}'
<span class="tok-comment"># B — một hash</span>
redis-cli HSET u:hash id 1042 name Cuong email c@example.com plan pro bio "Backend engineer in Hanoi" logins 37 &gt;/dev/null
<span class="tok-comment"># C — mỗi trường một khoá</span>
for f in id:1042 name:Cuong email:c@example.com plan:pro logins:37; do
  redis-cli SET "u:split:\${f%%:*}" "\${f#*:}" &gt;/dev/null
done
for k in u:json u:hash u:split:name; do
  printf "%-14s %-10s %s\\n" "$k" "$(redis-cli OBJECT ENCODING $k)" "$(redis-cli MEMORY USAGE $k)"
done
redis-cli MEMORY USAGE u:hash SAMPLES 0</code></pre>
<div class="out">u:json         embstr     168
u:hash         listpack   224
u:split:name   embstr     56
224</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A · Chuỗi JSON — 168 byte</span><span class="v">Nhỏ nhất, vì nó là một khoá và một lần cấp phát. Đọc nó là một lệnh <code>GET</code>; đổi một trường là <code>GET</code> + phân tích + tuần tự hoá + <code>SET</code>, và hai người ghi cùng lúc thì mất một lần cập nhật (Bài 5.1).</span></div>
  <div class="kv"><span class="k">B · Hash — 224 byte</span><span class="v">Nhiều hơn 33%, đổi lại bạn có ghi nguyên tử theo từng trường, <code>HINCRBY</code> trên <code>logins</code>, và <code>HMGET</code> chỉ chuyển đúng thứ trang cần. Trong gần như mọi trường hợp thì đây là mặc định đúng.</span></div>
  <div class="kv"><span class="k">C · Khoá rời — 56 byte × 5 = 280</span><span class="v">Tốn bộ nhớ nhất (năm lần chi phí khoá thay vì một) và nhiều vòng đi-về nhất, trừ khi bạn dùng pipeline. Nó mua về đúng một thứ: TTL độc lập cho từng trường.</span></div>
  <div class="kv"><span class="k">D · RedisJSON — một module, không phải Redis</span><span class="v"><code>JSON.SET</code>/<code>JSON.GET</code> với lồng nhau thật và JSONPath. Tuyệt vời, và không có sẵn trừ khi bạn chạy Redis Stack hoặc cài module — điều này loại nó ra khỏi phần lớn dịch vụ lưu trữ có quản lý.</span></div>
  <div class="kv"><span class="k">Các con số dịch chuyển theo kích thước đối tượng</span><span class="v">Ở sáu trường ngắn thì khác biệt chỉ là nhiễu. Ở sáu mươi trường thì hash thắng về lượng chuyển và chuỗi JSON thắng về chỗ lưu; khi giá trị vượt 64 byte thì hash chuyển sang <code>hashtable</code> và khoảng cách đảo chiều (Bài 5.2). Hãy đo trên đối tượng thật của bạn.</span></div>
</div>

<h3>Quyết bằng ba câu hỏi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn đọc nó kiểu gì?</span><span class="lz-t">nguyên đối tượng → JSON · vài trường → hash</span><span class="lz-d">Nếu mọi lượt đọc đều là "cho tôi trọn người dùng" thì chuỗi JSON là một <code>GET</code>, một lần cấp phát và một lần phân tích — khó thắng nổi. Nếu một trang cần <code>name</code> với <code>avatar</code> trong bốn mươi trường thì <code>HMGET</code> chuyển hai trường còn JSON chuyển bốn mươi.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Bạn ghi nó kiểu gì?</span><span class="lz-t">có ghi một phần → hash, luôn luôn</span><span class="lz-d">Đây thường là câu quyết định. Một việc chạy nền chạm vào <code>last_seen</code> trong lúc một yêu cầu chạm vào <code>bio</code> là một lần ghi bị mất trên chuỗi JSON và là chuyện không có gì trên hash. Tính đồng thời không phải vấn đề quy mô để hoãn lại — hai cái tab là đủ.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Các phần có tuổi thọ khác nhau không?</span><span class="lz-t">có → khoá rời, hoặc HEXPIRE trên 7.4</span><span class="lz-d">Một mã phiên hết hạn sau 30 phút không thể sống chung khoá với một hồ sơ không bao giờ hết hạn — trước bản 7.4, TTL thuộc về cả cái khoá. Bài 5.4 nói về thứ đã đổi.</span></div>
  <div class="lz-step"><span class="lz-k">Phân định cuối: nó có lồng nhau không?</span><span class="lz-t">lồng sâu → JSON hoặc RedisJSON</span><span class="lz-d">Hash thì phẳng. Lồng nhau nghĩa là làm phẳng tên trường (<code>address.city</code>) hoặc lưu đối tượng con dạng chuỗi JSON bên trong trường, cả hai đều làm được nhưng chẳng cái nào đẹp. Dữ liệu thật sự có hình cây là sân nhà của chuỗi JSON.</span></div>
</div>

<h3>Vấn đề làm phẳng, và hai cách vòng tránh thành thật</h3>
<pre><code><span class="tok-comment"># Cách 1 — tên trường có dấu chấm, hash phẳng</span>
redis-cli HSET u:1042 name Cuong address.city Hanoi address.zip 100000 prefs.theme dark
redis-cli HMGET u:1042 address.city prefs.theme
redis-cli HSCAN u:1042 0 MATCH "address.*" NOVALUES

<span class="tok-comment"># Cách 2 — một chuỗi JSON nằm trong một trường</span>
redis-cli HSET u:1042 name Cuong address '{"city":"Hanoi","zip":"100000"}'
redis-cli HGET u:1042 address</code></pre>
<div class="out">(integer) 4
1) "Hanoi"
2) "dark"
1) "0"
2) 1) "address.city"
   2) "address.zip"
"{\\"city\\":\\"Hanoi\\",\\"zip\\":\\"100000\\"}"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên có dấu chấm vẫn giữ tính nguyên tử</span><span class="v"><code>HSET u:1042 address.city Danang</code> vẫn là một lần ghi nguyên tử lên một trường. Bạn giữ được mọi thứ hash giỏi, với cái giá là tên trường trở thành một quy ước chứ không phải một cấu trúc.</span></div>
  <div class="kv"><span class="k">Tên có dấu chấm thì tạm tìm kiếm được</span><span class="v"><code>HSCAN … MATCH "address.*"</code> lấy về cho bạn một đối tượng con. Không nhanh trên hash lớn, nhưng có ích, và không làm được với cách 2.</span></div>
  <div class="kv"><span class="k">Một trường JSON dựng lại đúng lần ghi bị mất</span><span class="v">Cách 2 trả lại cho bạn khả năng lồng nhau và trao lại đúng cuộc đua đọc-sửa-ghi mà bạn dùng hash để tránh — nhưng thu hẹp trong đúng một đối tượng con, và đó thường là cuộc đổi chác chấp nhận được.</span></div>
  <div class="kv"><span class="k">Mảng là chỗ hash bó tay</span><span class="v">Không có cách biểu diễn phẳng nào tử tế cho một danh sách. <code>tags.0</code>, <code>tags.1</code> thì chạy được và bảo trì thì khổ sở. Một khoá set hay list riêng, tham chiếu bằng mã, mới là câu trả lời thành thật.</span></div>
  <div class="kv"><span class="k">Tên trường cũng tốn bộ nhớ</span><span class="v">Mỗi tên trường được lưu đầy đủ, trong từng hash. <code>address.city</code> trên một triệu người dùng là 12 MB của riêng chuỗi "address.city". Trên tập dữ liệu khổng lồ thì tên trường ngắn (<code>ac</code>) kèm một bảng ánh xạ trong mã là một phép tối ưu thật — và một cái giá về khả năng đọc hiểu cũng thật.</span></div>
</div>
<div class="callout warn"><strong>Đừng xé một đối tượng ra nhiều khoá "cho linh hoạt".</strong> <code>u:1042:name</code>, <code>u:1042:email</code>, <code>u:1042:plan</code> trông thì gọn gàng và bắt bạn trả năm lần chi phí khoá, năm vòng đi-về (hoặc một pipeline mà bạn phải nhớ viết), không có phép ghi nhiều trường nguyên tử, và một lệnh <code>DEL</code> phải kể tên từng trường nếu không muốn rò rỉ những cái nó quên. Có đúng một lý do để làm vậy — các trường thật sự có TTL khác nhau trên bản Redis cũ hơn 7.4 — và nếu đó không phải lý do của bạn thì hãy dùng hash.</div>

<h3>Đặt tên khoá sao cho một năm sau vẫn tìm ra</h3>
<pre><code>redis-cli HSET user:1042 name Cuong &gt;/dev/null            <span class="tok-comment"># kiểu:mã</span>
redis-cli HSET user:1042:prefs theme dark &gt;/dev/null      <span class="tok-comment"># kiểu:mã:khía_cạnh</span>
redis-cli SADD user:1042:roles admin editor &gt;/dev/null    <span class="tok-comment"># tập hợp liên quan</span>
redis-cli ZADD leaderboard:2026-08 1500 user:1042 &gt;/dev/null
redis-cli SCAN 0 MATCH "user:1042*" COUNT 100
redis-cli MEMORY USAGE user:1042</code></pre>
<div class="out">1) "0"
2) 1) "user:1042"
   2) "user:1042:prefs"
   3) "user:1042:roles"
120</div>
<div class="pitfall"><strong>Cái bẫy:</strong> một lược đồ đặt tên khoá được nghĩ ra theo từng tính năng thay vì thống nhất một lần. Sáu tháng sau bạn có <code>user:1042</code>, <code>users/1043</code>, <code>u_1044</code> và <code>USER:1045:v2</code> trong cùng một máy, và giờ chẳng thứ gì quét dọn, di trú hay gỡ lỗi được theo mẫu — <code>SCAN MATCH</code> chỉ giúp được nếu cái mẫu có thật. Hãy thống nhất ba luật ngay ngày đầu và ghi vào README: <strong>các đoạn ngăn bằng dấu hai chấm</strong> (<code>kiểu:mã:khía_cạnh</code>), <strong>tên kiểu viết thường số ít</strong>, và <strong>mã luôn nằm ở cùng một vị trí</strong>. Hai luật nữa cũng đáng đồng tiền: đặt một đoạn phiên bản vào bất cứ thứ gì có thể đổi hình dáng (<code>user:v2:1042</code>) để một lần di trú định dạng chỉ là một tiền tố mới chứ không phải viết đè tại chỗ, và gắn tiền tố cho mọi khoá thuộc về một việc chạy nền hay một thử nghiệm (<code>tmp:</code>, <code>job:</code>) để lúc 2 giờ sáng máy đầy bộ nhớ thì nhìn là biết ngay xoá cái gì an toàn. Và nhớ rằng các khoá dùng chung một không gian tên trên toàn cơ sở dữ liệu — <code>SELECT</code> (Bài 2.5) không phải là sự cô lập, và trong Cluster nó không tồn tại luôn (Chương 11).</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/using-commands/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">The Redis keyspace</span><span class="lc-sub">Hướng dẫn chính thức về đặt tên khoá, sự đánh đổi ở độ dài khoá, và không gian khoá thật ra là cái gì. Ngắn, và các quy ước trong đó đáng chép nguyên về dùng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/json/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">RedisJSON</span><span class="lc-sub">Tài liệu lồng nhau thật với JSONPath, cập nhật nguyên tử vào tài liệu con và đọc từng phần. Hãy đọc kỹ đoạn đầu: nó cần module, nên kiểm xem nhà cung cấp của bạn thật sự chạy gì trước khi thiết kế xoay quanh nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: mô hình hoá bốn đối tượng thật</span><span class="lc-sub">Bài chấm điểm: một phiên đăng nhập, một giỏ hàng, một sản phẩm lồng nhau có biến thể và một hồ sơ người dùng — chọn cách biểu diễn cho từng cái, biện minh bằng ba câu hỏi, rồi đo cái bạn đã chọn.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Trả lời ba câu hỏi là mô hình tự chọn lấy nó: có <em>ghi</em> một phần thì dùng hash, đọc nguyên đối tượng mà không ghi một phần thì chuỗi JSON nhỏ hơn và đơn giản hơn, còn các trường thật sự có tuổi thọ khác nhau thì dùng khoá rời hoặc <code>HEXPIRE</code>. Lồng nhau là chỗ hash thua — hãy làm phẳng bằng tên trường có dấu chấm để giữ tính nguyên tử, hoặc lưu đối tượng con thành một trường JSON và chấp nhận cuộc đua đọc-sửa-ghi bên trong nó. Và hãy thống nhất lược đồ đặt tên khoá ngay ngày đầu, vì <code>SCAN MATCH</code>, các lần di trú và những đợt dọn dẹp lúc 2 giờ sáng đều phụ thuộc vào việc cái mẫu ấy có thật.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — HEXPIRE: field-level TTL, finally|||5.4 — HEXPIRE: TTL cho từng trường, cuối cùng cũng có',
      slug: 'rd-5-4-hexpire',
      type: 'LESSON',
      description: 'Mười lăm năm TTL chỉ thuộc về cả khoá, và thứ Redis 7.4 mở ra: HEXPIRE với HTTL với HPERSIST, năm mã trả về phải đọc, mã hoá listpackex, chuyện gì xảy ra khi trường cuối cùng hết hạn, và bốn bài toán trước đây phải xé khoá ra mới giải được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>HEXPIRE: field-level TTL, finally</h2>
<p class="lead">For fifteen years, TTL in Redis belonged to the key and only to the key. If two things inside one object needed to expire at different times, you split them into different keys and paid for it — in memory, in round trips, and in the atomicity you gave up. Redis 7.4 ended that, and it quietly changes what a hash is good for.</p>

<h3>What the world looked like before</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The rule</span><span class="lz-t">EXPIRE takes a key, never a field</span><span class="lz-d">A hash either expired whole or not at all. Touch one field and the key's TTL was untouched; the whole object still died at the same instant.</span></div>
  <div class="lz-step"><span class="lz-k">The workaround</span><span class="lz-t">one key per expiring thing</span><span class="lz-d">A session with a 30-minute token and a permanent user reference became <code>sess:abc:token</code> and <code>sess:abc:user</code> — two keys, two overheads, two round trips, and no atomic write across them.</span></div>
  <div class="lz-step"><span class="lz-k">The other workaround</span><span class="lz-t">a companion sorted set and a sweeper</span><span class="lz-d">Score = expiry time, member = field name, plus a cron that reads what is due and <code>HDEL</code>s it. Correct, and now you maintain two structures and a background job to express "this field lasts an hour".</span></div>
  <div class="lz-step"><span class="lz-k">The cost that was never obvious</span><span class="lz-t">the bucketing trick lost its TTL</span><span class="lz-d">Lesson 5.2's 3.4× memory win required putting many objects in one hash — which meant they all had to expire together. That single constraint is what ruled the trick out for caches, and it is exactly what 7.4 removed.</span></div>
</div>

<h3>The commands</h3>
<pre><code>redis-cli DEL sess:abc &gt;/dev/null
redis-cli HSET sess:abc token "t_9f2a" user 1042 csrf "c_11b8" theme dark
redis-cli HEXPIRE sess:abc 1800 FIELDS 1 token
redis-cli HEXPIRE sess:abc 600  FIELDS 1 csrf
redis-cli HTTL    sess:abc FIELDS 3 token csrf theme
redis-cli HPERSIST sess:abc FIELDS 1 csrf
redis-cli HTTL    sess:abc FIELDS 1 csrf
redis-cli HEXPIREAT sess:abc 1755960000 FIELDS 1 token
redis-cli HEXPIRETIME sess:abc FIELDS 1 token
redis-cli OBJECT ENCODING sess:abc</code></pre>
<div class="out">(integer) 4
1) (integer) 1
1) (integer) 1
1) (integer) 1800
2) (integer) 600
3) (integer) -1
1) (integer) 1
1) (integer) -1
1) (integer) 1
1) (integer) 1755960000
"listpackex"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The <code>FIELDS numfields …</code> clause is mandatory</span><span class="v">Even for one field. <code>HEXPIRE key 60 FIELDS 1 token</code>, not <code>HEXPIRE key 60 token</code>. The count must match the number of field names or you get an error — a design that reads badly and parses unambiguously.</span></div>
  <div class="kv"><span class="k">Six commands, three pairs</span><span class="v"><code>HEXPIRE</code>/<code>HPEXPIRE</code> (relative, seconds/ms), <code>HEXPIREAT</code>/<code>HPEXPIREAT</code> (absolute unix time), <code>HTTL</code>/<code>HPTTL</code> (remaining). Plus <code>HEXPIRETIME</code>/<code>HPEXPIRETIME</code> for the absolute deadline and <code>HPERSIST</code> to remove a TTL.</span></div>
  <div class="kv"><span class="k">Conditions: <code>NX XX GT LT</code></span><span class="v">The same flags as <code>EXPIRE</code> (Lesson 2.2). <code>HEXPIRE k 60 XX GT FIELDS 1 f</code> extends a TTL only if the field already has one and the new one is longer — the safe way to refresh without accidentally granting immortality.</span></div>
  <div class="kv"><span class="k">A new encoding: <code>listpackex</code></span><span class="v">Redis 7.4 added a listpack variant that stores a TTL beside each entry, so small hashes with field TTLs stay cheap. Above the usual thresholds it becomes a <code>hashtable</code> with a companion structure.</span></div>
  <div class="kv"><span class="k"><code>HGETEX</code> and <code>HGETDEL</code> came later</span><span class="v">Redis 8.0 added read-and-expire and read-and-delete in one command. Useful, and check your server version before reaching for them — 7.4 has the eight above and not these.</span></div>
</div>

<h3>Read the return codes, they are the API</h3>
<pre><code>redis-cli HEXPIRE sess:abc 60 FIELDS 1 nosuchfield     <span class="tok-comment"># field missing</span>
redis-cli HEXPIRE nosuchkey 60 FIELDS 1 f              <span class="tok-comment"># key missing</span>
redis-cli HEXPIRE sess:abc 0 FIELDS 1 theme            <span class="tok-comment"># 0 seconds</span>
redis-cli HEXISTS sess:abc theme
redis-cli HEXPIRE sess:abc 60 NX FIELDS 1 token        <span class="tok-comment"># token already has a TTL</span>
redis-cli HTTL sess:abc FIELDS 1 user                  <span class="tok-comment"># exists, no TTL</span></code></pre>
<div class="out">1) (integer) -2
(error) ERR no such key
1) (integer) 2
(integer) 0
1) (integer) 0
1) (integer) -1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-2 · no such field</span><span class="lz-lnote">The field is not in the hash. Note the asymmetry above: a missing <em>field</em> is a quiet <code>-2</code> in the array, while a missing <em>key</em> is a hard error — which surprises everyone once and then never again.</span></div>
  <div class="lz-layer"><span class="lz-lname">-1 · exists, no TTL</span><span class="lz-lnote">Returned by <code>HTTL</code>/<code>HPERSIST</code> for a field that lives forever. Distinguishing <code>-1</code> from <code>-2</code> is how you tell "no expiry" from "not there", and treating both as falsy is the classic bug.</span></div>
  <div class="lz-layer"><span class="lz-lname">0 · condition not met</span><span class="lz-lnote">Your <code>NX</code>/<code>XX</code>/<code>GT</code>/<code>LT</code> guard refused the change. Not an error and not a failure — it is the guard doing its job, and code that ignores it silently believes it set a TTL it did not set.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · set · and 2 · deleted now</span><span class="lz-lnote"><code>1</code> means the TTL was applied. <code>2</code> means the deadline was zero or already past, so the field was deleted immediately rather than scheduled — the same behaviour as <code>EXPIRE key 0</code>, and a handy way to conditionally delete.</span></div>
</div>

<h3>What happens when the last field goes</h3>
<pre><code>redis-cli DEL tiny &gt;/dev/null
redis-cli HSET tiny only "value" &gt;/dev/null
redis-cli HPEXPIRE tiny 200 FIELDS 1 only
redis-cli EXISTS tiny
sleep 0.5
redis-cli EXISTS tiny
redis-cli TYPE tiny
<span class="tok-comment"># keyspace notifications fire for the field expiry AND the key deletion</span>
redis-cli CONFIG SET notify-keyspace-events KEAg &gt;/dev/null
redis-cli --timeout 2 PSUBSCRIBE '__keyevent@0__:*' &amp;</code></pre>
<div class="out">1) (integer) 1
(integer) 1
(integer) 0
none
pmessage __keyevent@0__:* __keyevent@0__:hexpired only
pmessage __keyevent@0__:* __keyevent@0__:del tiny</div>
<div class="callout ok"><strong>An empty hash cannot exist, so the key disappears with its last field.</strong> That is not new behaviour — <code>HDEL</code> has always deleted a hash that runs out of fields — but it is worth internalising here, because it means a hash whose every field has a TTL <em>is</em> a self-deleting key, with no <code>EXPIRE</code> on the key itself. And 7.4 added a new notification event, <code>hexpired</code>, carrying the field name, so a listener can react to a single field expiring rather than only to the whole key vanishing (Lesson 2.4).</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Expiry is lazy plus active, same as keys</span><span class="v">A field can be past its deadline and still occupy memory until something reads it or the active cycle finds it (Lesson 2.2). <code>HLEN</code> does not count expired-but-not-yet-collected fields, so the number you see is honest even if the memory is not yet back.</span></div>
  <div class="kv"><span class="k">Replicas do not expire fields themselves</span><span class="v">Exactly like key TTLs: the primary decides, and propagates an explicit <code>HDEL</code>. A replica will not serve a logically-expired field, but it waits to be told before removing it (Chapter 11).</span></div>
  <div class="kv"><span class="k">Field TTLs survive persistence</span><span class="v">RDB and AOF both carry them, and the RDB format was versioned for it — which means an RDB written by 7.4 with field TTLs cannot be read by an older Redis. Check that before a downgrade (Chapter 9).</span></div>
  <div class="kv"><span class="k">Deleting the key deletes the TTLs</span><span class="v">Obvious, and worth stating: <code>DEL</code>, <code>RENAME</code> onto the key, or an eviction under <code>maxmemory</code> take the field deadlines with them.</span></div>
  <div class="kv"><span class="k"><code>HPERSIST</code>, not <code>HEXPIRE … -1</code></span><span class="v">A negative TTL is not "remove the expiry" — <code>HEXPIRE</code> with a past deadline deletes the field. Use <code>HPERSIST</code> to make a field permanent again.</span></div>
</div>

<h3>Four things this makes possible</h3>
<pre><code><span class="tok-comment"># 1 · A session where only the token expires</span>
redis-cli HSET sess:abc user 1042 token t_9f2a &gt;/dev/null
redis-cli HEXPIRE sess:abc 1800 FIELDS 1 token &gt;/dev/null

<span class="tok-comment"># 2 · Bucketed cache — 100 objects per key, each with its OWN lifetime</span>
redis-cli HSET cache:42 item:4201 '{"v":1}' &gt;/dev/null
redis-cli HEXPIRE cache:42 300 FIELDS 1 item:4201 &gt;/dev/null

<span class="tok-comment"># 3 · Rate-limit buckets that clean themselves, no cron</span>
redis-cli HINCRBY rl:user:1042 "min:29281583" 1
redis-cli HEXPIRE rl:user:1042 120 NX FIELDS 1 "min:29281583"

<span class="tok-comment"># 4 · Feature flags with an automatic expiry date</span>
redis-cli HSET flags new-editor 1 &gt;/dev/null
redis-cli HEXPIREAT flags 1756512000 FIELDS 1 new-editor</code></pre>
<div class="out">(integer) 1
1) (integer) 1
1) (integer) 1
1) (integer) 1</div>
<div class="pitfall"><strong>Pitfall:</strong> writing code against <code>HEXPIRE</code> without checking the server version. It landed in <strong>7.4</strong>, which is recent enough that a great many production instances — and a great many managed Redis offerings, which lag upstream by a year or more — do not have it. On an older server the command is not "unsupported", it is <code>ERR unknown command</code>, at runtime, in the path that was supposed to expire a session token; and because the write before it succeeded, you now have a field that lives forever and nothing that says so. Check with <code>redis-cli INFO server | grep redis_version</code> on <em>every</em> environment, not just your laptop, and gate the feature explicitly rather than letting it fail open. The same caution applies to a downgrade: an RDB carrying field TTLs will not load on an older Redis, so a rollback plan has to account for it. And if you are on Cluster, confirm your specific deployment supports it before designing a cache around per-field lifetimes — this is exactly the sort of feature where "Redis supports it" and "my Redis supports it" are different sentences.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/hexpire/" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">HEXPIRE</span><span class="lc-sub">The reference: the mandatory <code>FIELDS</code> clause, all five return codes, the <code>NX</code>/<code>XX</code>/<code>GT</code>/<code>LT</code> conditions, and links across to the seven sibling commands.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/hashes/#field-expiration" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Hash field expiration</span><span class="lc-sub">The narrative version: why it was added, how it interacts with persistence, replication and eviction, and the <code>listpackex</code> encoding it introduced.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: expire one field at a time</span><span class="lc-sub">Graded exercises: build a session where only the token expires, add per-object TTLs to a bucketed cache, distinguish all five return codes, and write the version check that stops this failing open.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Redis 7.4 made TTL a property of a field, not just a key — <code>HEXPIRE</code> and its seven siblings, all requiring the odd-looking mandatory <code>FIELDS numfields …</code> clause. The return codes <em>are</em> the API: <code>-2</code> no such field, <code>-1</code> no TTL, <code>0</code> your condition refused it, <code>1</code> set, <code>2</code> deleted on the spot — and code that treats <code>-1</code> and <code>-2</code> as the same thing is wrong in the interesting case. And the biggest thing this unlocks is Lesson 5.2's bucketing trick for caches: you can finally have many objects in one hash and give each its own lifetime, which was the one constraint that ruled it out.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>HEXPIRE: TTL cho từng trường, cuối cùng cũng có</h2>
<p class="lead">Suốt mười lăm năm, TTL trong Redis thuộc về cái khoá và chỉ thuộc về cái khoá. Nếu hai thứ nằm trong một đối tượng cần hết hạn ở hai thời điểm khác nhau, bạn xé chúng ra hai khoá và trả giá cho việc đó — bằng bộ nhớ, bằng vòng đi-về, và bằng tính nguyên tử bạn đã từ bỏ. Redis 7.4 chấm dứt chuyện đó, và nó lặng lẽ thay đổi việc hash dùng để làm gì.</p>

<h3>Thế giới trước đây trông ra sao</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luật</span><span class="lz-t">EXPIRE nhận một khoá, không bao giờ nhận một trường</span><span class="lz-d">Một hash hoặc hết hạn nguyên cái, hoặc không hết hạn gì cả. Chạm vào một trường thì TTL của khoá vẫn nguyên; cả đối tượng vẫn chết ở đúng khoảnh khắc cũ.</span></div>
  <div class="lz-step"><span class="lz-k">Cách vòng tránh</span><span class="lz-t">mỗi thứ cần hết hạn một khoá</span><span class="lz-d">Một phiên có mã thông báo sống 30 phút và một tham chiếu người dùng vĩnh viễn thành <code>sess:abc:token</code> với <code>sess:abc:user</code> — hai khoá, hai lần chi phí, hai vòng đi-về, và không có phép ghi nguyên tử nào trải qua cả hai.</span></div>
  <div class="lz-step"><span class="lz-k">Cách vòng tránh còn lại</span><span class="lz-t">một sorted set đi kèm và một tiến trình quét</span><span class="lz-d">Điểm = thời điểm hết hạn, phần tử = tên trường, cộng một cron đọc xem cái gì tới hạn rồi <code>HDEL</code> nó. Đúng đắn, và giờ bạn nuôi hai cấu trúc với một việc chạy nền chỉ để diễn đạt "trường này sống một giờ".</span></div>
  <div class="lz-step"><span class="lz-k">Cái giá chưa bao giờ hiển hiện</span><span class="lz-t">mẹo chia gáo mất luôn TTL</span><span class="lz-d">Phần thắng 3,4 lần bộ nhớ ở Bài 5.2 đòi phải đặt nhiều đối tượng vào một hash — tức là tất cả phải hết hạn cùng nhau. Đúng một ràng buộc đó đã loại mẹo này khỏi các bộ đệm, và đó chính là thứ 7.4 gỡ bỏ.</span></div>
</div>

<h3>Các lệnh</h3>
<pre><code>redis-cli DEL sess:abc &gt;/dev/null
redis-cli HSET sess:abc token "t_9f2a" user 1042 csrf "c_11b8" theme dark
redis-cli HEXPIRE sess:abc 1800 FIELDS 1 token
redis-cli HEXPIRE sess:abc 600  FIELDS 1 csrf
redis-cli HTTL    sess:abc FIELDS 3 token csrf theme
redis-cli HPERSIST sess:abc FIELDS 1 csrf
redis-cli HTTL    sess:abc FIELDS 1 csrf
redis-cli HEXPIREAT sess:abc 1755960000 FIELDS 1 token
redis-cli HEXPIRETIME sess:abc FIELDS 1 token
redis-cli OBJECT ENCODING sess:abc</code></pre>
<div class="out">(integer) 4
1) (integer) 1
1) (integer) 1
1) (integer) 1800
2) (integer) 600
3) (integer) -1
1) (integer) 1
1) (integer) -1
1) (integer) 1
1) (integer) 1755960000
"listpackex"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mệnh đề <code>FIELDS numfields …</code> là bắt buộc</span><span class="v">Kể cả với một trường. <code>HEXPIRE key 60 FIELDS 1 token</code>, chứ không phải <code>HEXPIRE key 60 token</code>. Con số phải khớp số tên trường nếu không bạn nhận lỗi — một thiết kế đọc thì dở mà phân tích cú pháp thì không nhập nhằng.</span></div>
  <div class="kv"><span class="k">Sáu lệnh, ba cặp</span><span class="v"><code>HEXPIRE</code>/<code>HPEXPIRE</code> (tương đối, giây/mili giây), <code>HEXPIREAT</code>/<code>HPEXPIREAT</code> (mốc unix tuyệt đối), <code>HTTL</code>/<code>HPTTL</code> (còn lại bao lâu). Cộng thêm <code>HEXPIRETIME</code>/<code>HPEXPIRETIME</code> cho hạn tuyệt đối và <code>HPERSIST</code> để gỡ một TTL.</span></div>
  <div class="kv"><span class="k">Điều kiện: <code>NX XX GT LT</code></span><span class="v">Đúng những cờ của <code>EXPIRE</code> (Bài 2.2). <code>HEXPIRE k 60 XX GT FIELDS 1 f</code> chỉ kéo dài TTL nếu trường đó đã có TTL và cái mới dài hơn — cách an toàn để làm mới mà không vô tình ban cho nó sự bất tử.</span></div>
  <div class="kv"><span class="k">Một kiểu mã hoá mới: <code>listpackex</code></span><span class="v">Redis 7.4 thêm một biến thể listpack lưu TTL ngay cạnh mỗi mục, nên hash nhỏ có TTL theo trường vẫn rẻ. Vượt các ngưỡng thường lệ thì nó thành <code>hashtable</code> kèm một cấu trúc đi cùng.</span></div>
  <div class="kv"><span class="k"><code>HGETEX</code> và <code>HGETDEL</code> tới sau</span><span class="v">Redis 8.0 thêm phép đọc-rồi-đặt-hạn và đọc-rồi-xoá gói trong một lệnh. Hữu ích, và hãy kiểm phiên bản máy chủ trước khi với tay lấy chúng — bản 7.4 có tám lệnh ở trên và không có hai cái này.</span></div>
</div>

<h3>Hãy đọc các mã trả về, chúng chính là giao diện</h3>
<pre><code>redis-cli HEXPIRE sess:abc 60 FIELDS 1 nosuchfield     <span class="tok-comment"># thiếu trường</span>
redis-cli HEXPIRE nosuchkey 60 FIELDS 1 f              <span class="tok-comment"># thiếu khoá</span>
redis-cli HEXPIRE sess:abc 0 FIELDS 1 theme            <span class="tok-comment"># 0 giây</span>
redis-cli HEXISTS sess:abc theme
redis-cli HEXPIRE sess:abc 60 NX FIELDS 1 token        <span class="tok-comment"># token đã có TTL rồi</span>
redis-cli HTTL sess:abc FIELDS 1 user                  <span class="tok-comment"># có tồn tại, không có TTL</span></code></pre>
<div class="out">1) (integer) -2
(error) ERR no such key
1) (integer) 2
(integer) 0
1) (integer) 0
1) (integer) -1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-2 · không có trường đó</span><span class="lz-lnote">Trường không nằm trong hash. Để ý chỗ bất đối xứng ở trên: thiếu một <em>trường</em> là một con <code>-2</code> lặng lẽ trong mảng, còn thiếu một <em>khoá</em> là một lỗi cứng — chuyện làm ai cũng ngạc nhiên đúng một lần rồi thôi.</span></div>
  <div class="lz-layer"><span class="lz-lname">-1 · có tồn tại, không có TTL</span><span class="lz-lnote">Do <code>HTTL</code>/<code>HPERSIST</code> trả về cho một trường sống mãi. Phân biệt <code>-1</code> với <code>-2</code> chính là cách bạn tách "không hết hạn" khỏi "không có mặt", và coi cả hai đều là giá trị sai là cái lỗi kinh điển.</span></div>
  <div class="lz-layer"><span class="lz-lname">0 · điều kiện không thoả</span><span class="lz-lnote">Cái chốt <code>NX</code>/<code>XX</code>/<code>GT</code>/<code>LT</code> của bạn đã từ chối thay đổi. Không phải lỗi và không phải thất bại — đó là cái chốt đang làm việc của nó, và mã bỏ qua nó sẽ âm thầm tin rằng mình đã đặt một TTL mà nó chưa hề đặt.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · đã đặt · và 2 · đã xoá ngay</span><span class="lz-lnote"><code>1</code> nghĩa là TTL đã được áp. <code>2</code> nghĩa là hạn bằng 0 hoặc đã qua, nên trường bị xoá ngay lập tức chứ không phải được hẹn — cùng cách cư xử với <code>EXPIRE key 0</code>, và là một cách xoá có điều kiện khá tiện.</span></div>
</div>

<h3>Chuyện gì xảy ra khi trường cuối cùng ra đi</h3>
<pre><code>redis-cli DEL tiny &gt;/dev/null
redis-cli HSET tiny only "value" &gt;/dev/null
redis-cli HPEXPIRE tiny 200 FIELDS 1 only
redis-cli EXISTS tiny
sleep 0.5
redis-cli EXISTS tiny
redis-cli TYPE tiny
<span class="tok-comment"># thông báo không gian khoá nổ CẢ cho trường hết hạn LẪN cho khoá bị xoá</span>
redis-cli CONFIG SET notify-keyspace-events KEAg &gt;/dev/null
redis-cli --timeout 2 PSUBSCRIBE '__keyevent@0__:*' &amp;</code></pre>
<div class="out">1) (integer) 1
(integer) 1
(integer) 0
none
pmessage __keyevent@0__:* __keyevent@0__:hexpired only
pmessage __keyevent@0__:* __keyevent@0__:del tiny</div>
<div class="callout ok"><strong>Một hash rỗng không thể tồn tại, nên cái khoá biến mất cùng trường cuối cùng của nó.</strong> Đây không phải hành vi mới — <code>HDEL</code> xưa nay vẫn xoá một hash khi nó cạn trường — nhưng ở đây nó đáng được ngấm vào người, vì nó nghĩa là một hash mà mọi trường đều có TTL <em>chính là</em> một khoá tự xoá, mà không cần <code>EXPIRE</code> nào trên bản thân cái khoá. Và 7.4 thêm một loại thông báo mới, <code>hexpired</code>, mang theo tên trường, nên một bên nghe có thể phản ứng với việc một trường đơn lẻ hết hạn chứ không chỉ với việc cả khoá biến mất (Bài 2.4).</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hết hạn là lười cộng chủ động, y như với khoá</span><span class="v">Một trường có thể đã quá hạn mà vẫn chiếm bộ nhớ cho tới khi có gì đó đọc nó hoặc chu kỳ chủ động tìm thấy nó (Bài 2.2). <code>HLEN</code> không đếm những trường đã hết hạn mà chưa được thu dọn, nên con số bạn thấy là thành thật kể cả khi bộ nhớ chưa về.</span></div>
  <div class="kv"><span class="k">Bản sao không tự cho trường hết hạn</span><span class="v">Hệt như TTL của khoá: bản chính quyết định, và lan truyền một lệnh <code>HDEL</code> tường minh. Một bản sao sẽ không phục vụ một trường đã hết hạn về mặt logic, nhưng nó chờ được báo mới gỡ đi (Chương 11).</span></div>
  <div class="kv"><span class="k">TTL của trường sống sót qua phép lưu lâu dài</span><span class="v">Cả RDB lẫn AOF đều mang nó theo, và định dạng RDB đã được nâng phiên bản vì nó — nghĩa là một tệp RDB do 7.4 ghi ra có TTL theo trường thì Redis cũ hơn không đọc được. Hãy kiểm chuyện đó trước khi hạ phiên bản (Chương 9).</span></div>
  <div class="kv"><span class="k">Xoá khoá là xoá luôn các TTL</span><span class="v">Hiển nhiên, và đáng nói ra: <code>DEL</code>, một lệnh <code>RENAME</code> đè lên khoá, hay một lần đẩy khoá dưới <code>maxmemory</code> đều mang theo mọi hạn của các trường.</span></div>
  <div class="kv"><span class="k"><code>HPERSIST</code>, không phải <code>HEXPIRE … -1</code></span><span class="v">Một TTL âm không có nghĩa "gỡ hạn" — <code>HEXPIRE</code> với hạn đã qua sẽ xoá trường. Hãy dùng <code>HPERSIST</code> để cho một trường vĩnh viễn trở lại.</span></div>
</div>

<h3>Bốn thứ chuyện này làm cho khả thi</h3>
<pre><code><span class="tok-comment"># 1 · Một phiên mà chỉ mã thông báo hết hạn</span>
redis-cli HSET sess:abc user 1042 token t_9f2a &gt;/dev/null
redis-cli HEXPIRE sess:abc 1800 FIELDS 1 token &gt;/dev/null

<span class="tok-comment"># 2 · Bộ đệm chia gáo — 100 đối tượng một khoá, mỗi cái một tuổi thọ RIÊNG</span>
redis-cli HSET cache:42 item:4201 '{"v":1}' &gt;/dev/null
redis-cli HEXPIRE cache:42 300 FIELDS 1 item:4201 &gt;/dev/null

<span class="tok-comment"># 3 · Gáo giới hạn tần suất tự dọn dẹp, không cần cron</span>
redis-cli HINCRBY rl:user:1042 "min:29281583" 1
redis-cli HEXPIRE rl:user:1042 120 NX FIELDS 1 "min:29281583"

<span class="tok-comment"># 4 · Cờ tính năng có sẵn ngày hết hạn</span>
redis-cli HSET flags new-editor 1 &gt;/dev/null
redis-cli HEXPIREAT flags 1756512000 FIELDS 1 new-editor</code></pre>
<div class="out">(integer) 1
1) (integer) 1
1) (integer) 1
1) (integer) 1</div>
<div class="pitfall"><strong>Cái bẫy:</strong> viết mã dựa vào <code>HEXPIRE</code> mà không kiểm phiên bản máy chủ. Nó xuất hiện ở bản <strong>7.4</strong>, đủ mới để rất nhiều máy production — và rất nhiều dịch vụ Redis có quản lý, vốn chậm hơn bản gốc cả năm trở lên — chưa có nó. Trên máy chủ cũ thì lệnh này không phải "chưa hỗ trợ", nó là <code>ERR unknown command</code>, lúc chạy thật, ngay trong nhánh đáng lẽ phải cho một mã phiên hết hạn; và vì lệnh ghi ngay trước đó đã thành công, giờ bạn có một trường sống mãi mãi mà chẳng có gì báo cho biết. Hãy kiểm bằng <code>redis-cli INFO server | grep redis_version</code> trên <em>mọi</em> môi trường, không chỉ trên máy của bạn, và hãy chốt tính năng lại một cách tường minh thay vì để nó hỏng theo kiểu mở toang. Cẩn trọng y hệt khi hạ phiên bản: một tệp RDB mang TTL theo trường sẽ không nạp được trên Redis cũ hơn, nên kế hoạch quay lui phải tính tới nó. Và nếu bạn đang chạy Cluster, hãy xác nhận đúng bản triển khai của mình có hỗ trợ không trước khi thiết kế một bộ đệm xoay quanh tuổi thọ theo từng trường — đây đúng là loại tính năng mà "Redis có hỗ trợ" và "Redis của tôi có hỗ trợ" là hai câu khác nhau.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/hexpire/" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">HEXPIRE</span><span class="lc-sub">Tài liệu tra cứu: mệnh đề <code>FIELDS</code> bắt buộc, cả năm mã trả về, các điều kiện <code>NX</code>/<code>XX</code>/<code>GT</code>/<code>LT</code>, và liên kết sang bảy lệnh anh em.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/hashes/#field-expiration" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Hash field expiration</span><span class="lc-sub">Bản kể chuyện: vì sao nó được thêm vào, nó tương tác thế nào với lưu lâu dài, nhân bản và đẩy khoá, cùng kiểu mã hoá <code>listpackex</code> mà nó mang tới.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: cho từng trường hết hạn</span><span class="lc-sub">Bài chấm điểm: dựng một phiên mà chỉ mã thông báo hết hạn, thêm TTL theo từng đối tượng vào một bộ đệm chia gáo, phân biệt cả năm mã trả về, và viết phép kiểm phiên bản chặn không cho chuyện này hỏng theo kiểu mở toang.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Redis 7.4 biến TTL thành thuộc tính của một trường, không chỉ của một khoá — <code>HEXPIRE</code> cùng bảy lệnh anh em, tất cả đều đòi cái mệnh đề <code>FIELDS numfields …</code> trông kỳ quặc nhưng bắt buộc. Các mã trả về <em>chính là</em> giao diện: <code>-2</code> không có trường đó, <code>-1</code> không có TTL, <code>0</code> điều kiện của bạn đã từ chối, <code>1</code> đã đặt, <code>2</code> xoá ngay tại chỗ — và mã coi <code>-1</code> với <code>-2</code> là một thứ thì sai đúng ở trường hợp thú vị nhất. Và thứ lớn nhất chuyện này mở khoá là mẹo chia gáo của Bài 5.2 dành cho bộ đệm: cuối cùng bạn cũng có thể nhét nhiều đối tượng vào một hash mà vẫn cho mỗi cái một tuổi thọ riêng, vốn là ràng buộc duy nhất đã loại nó ra.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Hashes in practice: sessions, carts, counters, config|||5.5 — Hash trong thực tế: phiên, giỏ hàng, bộ đếm, cấu hình',
      slug: 'rd-5-5-hash-thuc-te',
      type: 'LESSON',
      description: 'Kho phiên đăng nhập có hạn trượt và thu hồi được ngay, giỏ hàng mà hai tab không giẫm lên nhau, bộ đếm phân tích một hash mỗi ngày, và cấu hình nóng tự nạp lại — bốn thứ chạy thật, kèm mã Node.js đầy đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Hashes in practice: sessions, carts, counters, config</h2>
<p class="lead">Four things almost every backend needs, all of them a hash, all of them with one detail that separates the version that works from the version that works until it doesn't. Here they are written out.</p>

<h3>1 · A session store you can actually revoke</h3>
<pre><code>const SESSION_TTL = 60 * 30;   <span class="tok-comment">// 30 minutes</span>

async function createSession(userId, meta) {
  const sid = crypto.randomUUID();
  const key = &#96;sess:\${sid}&#96;;
  await redis.multi()
    .hSet(key, {
      user: String(userId),
      ip: meta.ip,
      ua: meta.userAgent.slice(0, 120),
      createdAt: String(Date.now()),
    })
    .expire(key, SESSION_TTL)
    .sAdd(&#96;user:\${userId}:sessions&#96;, sid)      <span class="tok-comment">// so we can revoke ALL of them</span>
    .exec();
  return sid;
}

async function readSession(sid) {
  const key = &#96;sess:\${sid}&#96;;
  <span class="tok-comment">// One round trip: read what we need AND slide the window</span>
  const [fields] = await redis.multi()
    .hmGet(key, ['user', 'ip'])
    .expire(key, SESSION_TTL)                  <span class="tok-comment">// sliding expiry</span>
    .exec();
  if (!fields?.[0]) return null;
  return { userId: Number(fields[0]), ip: fields[1] };
}

async function revokeAll(userId) {
  const sids = await redis.sMembers(&#96;user:\${userId}:sessions&#96;);
  if (sids.length) await redis.del(sids.map((s) =&gt; &#96;sess:\${s}&#96;));
  await redis.del(&#96;user:\${userId}:sessions&#96;);
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Sliding expiry is one extra command</span><span class="v"><code>EXPIRE</code> in the same <code>MULTI</code> as the read. Without it a session dies 30 minutes after login regardless of activity, which users experience as "it logged me out while I was typing".</span></div>
  <div class="kv"><span class="k">The reverse index is what makes revocation possible</span><span class="v"><code>user:1042:sessions</code> is the answer to "log this account out everywhere" and to "show me my active devices". Without it you would have to <code>SCAN</code> the whole keyspace to find one user's sessions.</span></div>
  <div class="kv"><span class="k">Give the reverse index a TTL too</span><span class="v">Sessions expire; the set of their IDs does not. Either <code>EXPIRE</code> the set to the longest possible session, or clean stale IDs on read — otherwise it grows forever (Lesson 4.2).</span></div>
  <div class="kv"><span class="k">Why not a signed JWT with no server state</span><span class="v">Because a JWT cannot be revoked before it expires. The moment you add a revocation list you have server state again — and then you may as well have the hash, which also lets you store and update session data.</span></div>
  <div class="kv"><span class="k">On 7.4, the token can expire alone</span><span class="v"><code>HEXPIRE sess:abc 900 FIELDS 1 token</code> keeps the session record alive while forcing a token refresh. Two lifetimes in one key (Lesson 5.4).</span></div>
</div>

<h3>2 · A shopping cart two tabs cannot corrupt</h3>
<pre><code>redis-cli DEL cart:1042 &gt;/dev/null
redis-cli HINCRBY cart:1042 sku:1001 2
redis-cli HINCRBY cart:1042 sku:1002 1
redis-cli HINCRBY cart:1042 sku:1001 -1       <span class="tok-comment"># decrement</span>
redis-cli HINCRBY cart:1042 sku:1002 -5       <span class="tok-comment"># goes negative! see below</span>
redis-cli HGETALL cart:1042
redis-cli EXPIRE cart:1042 604800             <span class="tok-comment"># abandoned carts die in a week</span></code></pre>
<div class="out">(integer) 2
(integer) 1
(integer) 1
(integer) -4
1) "sku:1001"
2) "1"
3) "sku:1002"
4) "-4"
(integer) 1</div>
<div class="callout warn"><strong><code>HINCRBY</code> will happily take a quantity below zero.</strong> Redis has no constraints — no <code>CHECK (qty &gt; 0)</code>, no triggers, nothing. A "remove one" button pressed five times on a cart holding one item leaves you with <code>-4</code>, and the checkout page will cheerfully price it. The fix is not to validate before incrementing (that is a read-then-write race — two tabs both read 1, both decrement, both think they are fine). It is to clamp <em>after</em>, atomically: a two-command <code>MULTI</code> that increments and then deletes the field if the result is ≤ 0 does not work either, because you cannot branch inside <code>MULTI</code>. This is the first problem in this course that genuinely needs Lua — five lines that increment, check and <code>HDEL</code> in one server-side step (Chapter 7).</div>

<h3>3 · Analytics counters: one hash per day</h3>
<pre><code><span class="tok-comment"># One key per day; one field per dimension. Bounded by design.</span>
redis-cli HINCRBY stats:2026-08-23 pageviews 1
redis-cli HINCRBY stats:2026-08-23 signups 1
redis-cli HINCRBY stats:2026-08-23 "country:VN" 1
redis-cli HINCRBY stats:2026-08-23 "path:/courses" 1
redis-cli HINCRBYFLOAT stats:2026-08-23 revenue 149.50
redis-cli EXPIRE stats:2026-08-23 7776000       <span class="tok-comment"># 90 days</span>
redis-cli HGETALL stats:2026-08-23
redis-cli OBJECT ENCODING stats:2026-08-23</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 1
"149.5"
(integer) 1
1) "pageviews"
2) "1"
3) "signups"
4) "1"
5) "country:VN"
6) "1"
7) "path:/courses"
8) "1"
9) "revenue"
10) "149.5"
"listpack"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Why a hash and not N string keys</span><span class="lz-t">one key, one TTL, one HGETALL</span><span class="lz-d">Forty counters as forty keys means forty <code>EXPIRE</code> calls and forty key overheads. As one hash it is one <code>EXPIRE</code>, one listpack, and a dashboard query that is a single command.</span></div>
  <div class="lz-step"><span class="lz-k">This is the one safe HGETALL</span><span class="lz-t">because the field count is bounded by design</span><span class="lz-d">You control the dimension list; it cannot grow with traffic. Contrast with <code>path:*</code> as a dimension on a site with user-generated URLs — that one <em>does</em> grow with traffic, and it is how a "small stats hash" becomes 400,000 fields.</span></div>
  <div class="lz-step"><span class="lz-k">The TTL is the whole retention policy</span><span class="lz-t">EXPIRE at write time, 90 days</span><span class="lz-d">No cleanup job, no partition drop, no cron. Set it when the key is created (use <code>EXPIRE … NX</code> so a later write cannot reset the window) and the data ages out on its own.</span></div>
  <div class="lz-step"><span class="lz-k">Redis is not your analytics database</span><span class="lz-t">it is the write buffer in front of one</span><span class="lz-d">This absorbs a thousand increments a second without touching Postgres. A nightly job reads the day's hash, writes one row, and the hash expires. Redis holds hot counters; the warehouse holds history.</span></div>
</div>

<h3>4 · Configuration that reloads without a deploy</h3>
<pre><code><span class="tok-comment">// Read once at boot, then keep it fresh via keyspace notifications</span>
let config = {};

async function loadConfig() {
  const raw = await redis.hGetAll('config:app');   <span class="tok-comment">// bounded: ~20 fields</span>
  config = {
    maxUploadMb: Number(raw.maxUploadMb ?? 25),
    signupsOpen: raw.signupsOpen === '1',           <span class="tok-comment">// NEVER trust "true"</span>
    bannerText: raw.bannerText ?? '',
  };
}

await loadConfig();

<span class="tok-comment">// CONFIG SET notify-keyspace-events KHh  — K=keyspace, H=hash, h=hset</span>
const sub = redis.duplicate();
await sub.connect();
await sub.pSubscribe('__keyspace@0__:config:app', () =&gt; loadConfig());</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Coerce every value, once, in one place</span><span class="v"><code>raw.signupsOpen === '1'</code>. The string <code>"false"</code> is truthy in JavaScript, and a config flag that is on when it should be off is the bug that takes longest to believe (Lesson 5.1).</span></div>
  <div class="kv"><span class="k">Defaults belong in code, not in Redis</span><span class="v"><code>?? 25</code> means the app boots correctly against an empty Redis. A config system that requires Redis to be populated before the app starts is a config system that will take you down one day.</span></div>
  <div class="kv"><span class="k">Notifications are fire-and-forget</span><span class="v">Pub/Sub delivers at most once and only to connected subscribers (Chapter 8). If your process was reconnecting when the change fired, it never hears about it — so also reload on a timer, every 30 seconds, as a floor.</span></div>
  <div class="kv"><span class="k">The subscriber needs its own connection</span><span class="v">A connection in subscribe mode cannot run normal commands. <code>redis.duplicate()</code> is the idiom, and forgetting it is the classic "why is my client throwing on every GET" (Lesson 1.5).</span></div>
  <div class="kv"><span class="k">Never put secrets here</span><span class="v">Redis config is readable by anything with the connection, dumps into RDB files, and appears in <code>MONITOR</code>. API keys belong in the environment; this is for behaviour, not credentials (Chapter 10).</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> the unbounded dimension. All four patterns above are safe because something real bounds them — a session key expires, a cart expires, the stats hash has a fixed dimension list, the config hash has twenty fields you wrote by hand. Add one dimension whose values come from users — <code>path:</code> on a site with arbitrary URLs, <code>referrer:</code>, <code>query:</code>, <code>userAgent:</code> — and the hash grows with traffic instead of with your feature set. It crosses 128 fields within an hour and converts to a hashtable (Lesson 5.2), the "safe" <code>HGETALL</code> your dashboard runs every 10 seconds becomes O(400,000) and blocks the server (Lesson 5.1), and none of this shows up in testing because your test data has six paths. Before you add a dimension, ask what its cardinality is at a million requests — and if the answer is "unbounded", the answer is a sorted set with <code>ZREMRANGEBYRANK</code> keeping the top 100 (Lesson 4.4), not another hash field.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/patterns/twitter-clone/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Design and implementation of a simple Twitter clone</span><span class="lc-sub">The classic Redis tutorial: sessions, users, feeds and follows modelled entirely in Redis primitives. Old, still one of the best explanations of how these pieces fit together.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Caching and session storage patterns</span><span class="lc-sub">Redis's own guidance on session stores and cache shapes, including the TTL and revocation questions this lesson leans on.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build all four</span><span class="lc-sub">Graded exercises: a session store with sliding expiry and working revocation, a cart that cannot go negative, a stats hash whose dimensions are bounded, and a config loader that survives a missed notification.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A session is a hash plus a reverse index — the hash holds the data and slides its own TTL on every read; the <code>user:N:sessions</code> set is the only thing that makes "log out everywhere" possible. <code>HINCRBY</code> has no constraints, so a cart quantity will go negative and no read-then-validate can stop it — that is the first problem in this course that genuinely needs Lua. And every one of these patterns is safe only because something bounds it: an expiring key, a fixed dimension list, twenty hand-written config fields. Add one user-supplied dimension and the "safe" <code>HGETALL</code> becomes an outage.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Hash trong thực tế: phiên, giỏ hàng, bộ đếm, cấu hình</h2>
<p class="lead">Bốn thứ mà gần như backend nào cũng cần, cả bốn đều là hash, cả bốn đều có một chi tiết tách bản chạy được khỏi bản chạy được cho tới lúc không chạy nữa. Đây là chúng, viết ra đầy đủ.</p>

<h3>1 · Một kho phiên mà bạn thu hồi được thật</h3>
<pre><code>const SESSION_TTL = 60 * 30;   <span class="tok-comment">// 30 phút</span>

async function createSession(userId, meta) {
  const sid = crypto.randomUUID();
  const key = &#96;sess:\${sid}&#96;;
  await redis.multi()
    .hSet(key, {
      user: String(userId),
      ip: meta.ip,
      ua: meta.userAgent.slice(0, 120),
      createdAt: String(Date.now()),
    })
    .expire(key, SESSION_TTL)
    .sAdd(&#96;user:\${userId}:sessions&#96;, sid)      <span class="tok-comment">// để còn thu hồi TẤT CẢ</span>
    .exec();
  return sid;
}

async function readSession(sid) {
  const key = &#96;sess:\${sid}&#96;;
  <span class="tok-comment">// Một vòng đi-về: đọc thứ cần VÀ đẩy cửa sổ hạn dùng đi</span>
  const [fields] = await redis.multi()
    .hmGet(key, ['user', 'ip'])
    .expire(key, SESSION_TTL)                  <span class="tok-comment">// hạn trượt</span>
    .exec();
  if (!fields?.[0]) return null;
  return { userId: Number(fields[0]), ip: fields[1] };
}

async function revokeAll(userId) {
  const sids = await redis.sMembers(&#96;user:\${userId}:sessions&#96;);
  if (sids.length) await redis.del(sids.map((s) =&gt; &#96;sess:\${s}&#96;));
  await redis.del(&#96;user:\${userId}:sessions&#96;);
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hạn trượt chỉ thêm đúng một lệnh</span><span class="v"><code>EXPIRE</code> nằm trong cùng <code>MULTI</code> với lượt đọc. Không có nó thì một phiên chết đúng 30 phút sau khi đăng nhập bất kể người dùng đang làm gì, và họ trải nghiệm điều đó dưới dạng "nó đăng xuất tôi giữa lúc đang gõ".</span></div>
  <div class="kv"><span class="k">Chỉ mục ngược là thứ làm cho việc thu hồi khả thi</span><span class="v"><code>user:1042:sessions</code> là câu trả lời cho "đăng xuất tài khoản này ở mọi nơi" và cho "cho tôi xem các thiết bị đang hoạt động". Không có nó thì bạn phải <code>SCAN</code> cả không gian khoá để tìm phiên của một người.</span></div>
  <div class="kv"><span class="k">Cho chỉ mục ngược một TTL nữa</span><span class="v">Phiên thì hết hạn; cái tập chứa mã của chúng thì không. Hoặc <code>EXPIRE</code> cái tập theo phiên dài nhất có thể, hoặc dọn mã cũ lúc đọc — nếu không nó phình mãi (Bài 4.2).</span></div>
  <div class="kv"><span class="k">Vì sao không dùng JWT ký sẵn không cần trạng thái máy chủ</span><span class="v">Vì một JWT không thể bị thu hồi trước khi nó hết hạn. Ngay khi bạn thêm một danh sách thu hồi là bạn lại có trạng thái ở máy chủ — và lúc đó thà dùng luôn hash, thứ còn cho bạn lưu và cập nhật dữ liệu phiên.</span></div>
  <div class="kv"><span class="k">Trên 7.4, mã thông báo hết hạn được một mình</span><span class="v"><code>HEXPIRE sess:abc 900 FIELDS 1 token</code> giữ bản ghi phiên sống trong khi ép làm mới mã. Hai tuổi thọ trong một khoá (Bài 5.4).</span></div>
</div>

<h3>2 · Một giỏ hàng mà hai tab không phá được</h3>
<pre><code>redis-cli DEL cart:1042 &gt;/dev/null
redis-cli HINCRBY cart:1042 sku:1001 2
redis-cli HINCRBY cart:1042 sku:1002 1
redis-cli HINCRBY cart:1042 sku:1001 -1       <span class="tok-comment"># giảm đi</span>
redis-cli HINCRBY cart:1042 sku:1002 -5       <span class="tok-comment"># xuống âm! xem bên dưới</span>
redis-cli HGETALL cart:1042
redis-cli EXPIRE cart:1042 604800             <span class="tok-comment"># giỏ bỏ quên chết sau một tuần</span></code></pre>
<div class="out">(integer) 2
(integer) 1
(integer) 1
(integer) -4
1) "sku:1001"
2) "1"
3) "sku:1002"
4) "-4"
(integer) 1</div>
<div class="callout warn"><strong><code>HINCRBY</code> vui vẻ nhận một số lượng dưới 0.</strong> Redis không có ràng buộc nào — không <code>CHECK (qty &gt; 0)</code>, không trigger, không gì cả. Một nút "bớt một" bị bấm năm lần trên giỏ đang có một món để lại cho bạn con <code>-4</code>, và trang thanh toán sẽ vui vẻ tính tiền cho nó. Cách chữa không phải là kiểm tra trước khi tăng (đó là một cuộc đua đọc-rồi-ghi — hai tab cùng đọc ra 1, cùng giảm đi, cùng nghĩ mình ổn). Mà là kẹp lại <em>sau khi</em> tăng, một cách nguyên tử: một <code>MULTI</code> hai lệnh vừa tăng vừa xoá trường nếu kết quả ≤ 0 cũng không xong, vì trong <code>MULTI</code> bạn không rẽ nhánh được. Đây là bài toán đầu tiên trong khoá này thật sự cần tới Lua — năm dòng vừa tăng, vừa kiểm, vừa <code>HDEL</code> trong đúng một bước phía máy chủ (Chương 7).</div>

<h3>3 · Bộ đếm phân tích: mỗi ngày một hash</h3>
<pre><code><span class="tok-comment"># Mỗi ngày một khoá; mỗi chiều một trường. Bị chặn ngay từ thiết kế.</span>
redis-cli HINCRBY stats:2026-08-23 pageviews 1
redis-cli HINCRBY stats:2026-08-23 signups 1
redis-cli HINCRBY stats:2026-08-23 "country:VN" 1
redis-cli HINCRBY stats:2026-08-23 "path:/courses" 1
redis-cli HINCRBYFLOAT stats:2026-08-23 revenue 149.50
redis-cli EXPIRE stats:2026-08-23 7776000       <span class="tok-comment"># 90 ngày</span>
redis-cli HGETALL stats:2026-08-23
redis-cli OBJECT ENCODING stats:2026-08-23</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 1
"149.5"
(integer) 1
1) "pageviews"
2) "1"
3) "signups"
4) "1"
5) "country:VN"
6) "1"
7) "path:/courses"
8) "1"
9) "revenue"
10) "149.5"
"listpack"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vì sao là một hash chứ không phải N khoá chuỗi</span><span class="lz-t">một khoá, một TTL, một HGETALL</span><span class="lz-d">Bốn mươi bộ đếm thành bốn mươi khoá nghĩa là bốn mươi lệnh <code>EXPIRE</code> và bốn mươi lần chi phí khoá. Gộp thành một hash thì là một <code>EXPIRE</code>, một listpack, và một truy vấn bảng điều khiển gói trong một lệnh duy nhất.</span></div>
  <div class="lz-step"><span class="lz-k">Đây là lần <code>HGETALL</code> an toàn duy nhất</span><span class="lz-t">vì số trường bị chặn ngay từ thiết kế</span><span class="lz-d">Bạn kiểm soát danh sách chiều; nó không thể lớn lên theo lưu lượng. Đối lại là lấy <code>path:*</code> làm một chiều trên một trang có URL do người dùng sinh ra — cái đó thì <em>có</em> lớn lên theo lưu lượng, và đó là cách một "hash thống kê nho nhỏ" thành 400.000 trường.</span></div>
  <div class="lz-step"><span class="lz-k">TTL chính là toàn bộ chính sách lưu trữ</span><span class="lz-t">EXPIRE ngay lúc ghi, 90 ngày</span><span class="lz-d">Không việc dọn dẹp, không cắt phân vùng, không cron. Hãy đặt nó lúc khoá được tạo (dùng <code>EXPIRE … NX</code> để một lượt ghi sau không đặt lại cửa sổ) và dữ liệu tự già đi rồi tự biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">Redis không phải kho phân tích của bạn</span><span class="lz-t">nó là bộ đệm ghi đứng trước một cái kho</span><span class="lz-d">Chỗ này hút một nghìn lượt tăng mỗi giây mà không đụng tới Postgres. Một việc chạy đêm đọc hash của ngày, ghi ra một dòng, rồi cái hash hết hạn. Redis giữ bộ đếm nóng; nhà kho giữ lịch sử.</span></div>
</div>

<h3>4 · Cấu hình nạp lại được mà không cần deploy</h3>
<pre><code><span class="tok-comment">// Đọc một lần lúc khởi động, rồi giữ tươi bằng thông báo không gian khoá</span>
let config = {};

async function loadConfig() {
  const raw = await redis.hGetAll('config:app');   <span class="tok-comment">// bị chặn: ~20 trường</span>
  config = {
    maxUploadMb: Number(raw.maxUploadMb ?? 25),
    signupsOpen: raw.signupsOpen === '1',           <span class="tok-comment">// ĐỪNG BAO GIỜ tin "true"</span>
    bannerText: raw.bannerText ?? '',
  };
}

await loadConfig();

<span class="tok-comment">// CONFIG SET notify-keyspace-events KHh  — K=không gian khoá, H=hash, h=hset</span>
const sub = redis.duplicate();
await sub.connect();
await sub.pSubscribe('__keyspace@0__:config:app', () =&gt; loadConfig());</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ép kiểu mọi giá trị, một lần, ở một chỗ</span><span class="v"><code>raw.signupsOpen === '1'</code>. Chuỗi <code>"false"</code> mang giá trị đúng trong JavaScript, và một cờ cấu hình đang bật trong khi đáng lẽ phải tắt là cái lỗi mà người ta mất lâu nhất mới chịu tin (Bài 5.1).</span></div>
  <div class="kv"><span class="k">Giá trị mặc định thuộc về mã, không thuộc về Redis</span><span class="v"><code>?? 25</code> nghĩa là ứng dụng khởi động đúng đắn trên một Redis rỗng. Một hệ cấu hình đòi Redis phải có dữ liệu sẵn trước khi ứng dụng chạy là một hệ cấu hình sẽ hạ gục bạn vào một ngày nào đó.</span></div>
  <div class="kv"><span class="k">Thông báo là bắn-rồi-quên</span><span class="v">Pub/Sub giao nhiều nhất một lần và chỉ giao cho những bên đang kết nối (Chương 8). Nếu tiến trình của bạn đang kết nối lại lúc thay đổi nổ ra thì nó không bao giờ nghe thấy — nên hãy nạp lại thêm theo hẹn giờ, mỗi 30 giây, làm sàn.</span></div>
  <div class="kv"><span class="k">Bên nghe cần kết nối riêng của nó</span><span class="v">Một kết nối đang ở chế độ đăng ký thì không chạy lệnh thường được. <code>redis.duplicate()</code> là cách viết chuẩn, và quên nó chính là cái "sao mọi lệnh GET của tôi đều ném lỗi" kinh điển (Bài 1.5).</span></div>
  <div class="kv"><span class="k">Đừng bao giờ đặt bí mật ở đây</span><span class="v">Cấu hình Redis đọc được bởi bất cứ thứ gì có kết nối, đổ vào tệp RDB, và hiện ra trong <code>MONITOR</code>. Khoá API thuộc về biến môi trường; chỗ này dành cho hành vi, không dành cho thông tin xác thực (Chương 10).</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> cái chiều không có trần. Cả bốn khuôn ở trên đều an toàn vì có một thứ có thật chặn chúng lại — khoá phiên hết hạn, giỏ hàng hết hạn, hash thống kê có danh sách chiều cố định, hash cấu hình có hai mươi trường do bạn tự tay viết. Thêm đúng một chiều mà giá trị đến từ người dùng — <code>path:</code> trên một trang có URL tuỳ ý, <code>referrer:</code>, <code>query:</code>, <code>userAgent:</code> — là cái hash lớn lên theo lưu lượng chứ không còn theo bộ tính năng của bạn. Nó vượt 128 trường trong vòng một tiếng và chuyển sang hashtable (Bài 5.2), cái <code>HGETALL</code> "an toàn" mà bảng điều khiển của bạn chạy 10 giây một lần thành O(400.000) và chặn cả máy chủ (Bài 5.1), và chẳng có thứ nào lộ ra lúc thử nghiệm vì dữ liệu thử của bạn chỉ có sáu đường dẫn. Trước khi thêm một chiều, hãy hỏi lực lượng của nó là bao nhiêu ở mức một triệu lượt yêu cầu — và nếu câu trả lời là "không có trần" thì đáp án là một sorted set với <code>ZREMRANGEBYRANK</code> giữ lại top 100 (Bài 4.4), chứ không phải thêm một trường hash nữa.</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/clients/patterns/twitter-clone/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Design and implementation of a simple Twitter clone</span><span class="lc-sub">Bài hướng dẫn kinh điển của Redis: phiên, người dùng, dòng tin và theo dõi, mô hình hoá trọn vẹn bằng các thành phần cơ bản của Redis. Cũ, và vẫn là một trong những lời giải thích hay nhất về cách các mảnh ghép này khớp vào nhau.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/caching/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Caching and session storage patterns</span><span class="lc-sub">Hướng dẫn của chính Redis về kho phiên và các hình dáng bộ đệm, gồm cả những câu hỏi về TTL và thu hồi mà bài này dựa vào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng cả bốn</span><span class="lc-sub">Bài chấm điểm: một kho phiên có hạn trượt và thu hồi chạy thật, một giỏ hàng không thể xuống âm, một hash thống kê có chiều bị chặn, và một bộ nạp cấu hình sống sót qua một thông báo bị lỡ.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một phiên là một hash cộng một chỉ mục ngược — hash giữ dữ liệu và tự đẩy TTL của mình ở mỗi lượt đọc; cái tập <code>user:N:sessions</code> là thứ duy nhất làm cho "đăng xuất mọi nơi" khả thi. <code>HINCRBY</code> không có ràng buộc nào, nên số lượng trong giỏ sẽ xuống âm và không phép đọc-rồi-kiểm nào ngăn được — đó là bài toán đầu tiên trong khoá này thật sự cần Lua. Và mọi khuôn ở đây chỉ an toàn vì có thứ gì đó chặn chúng lại: một khoá biết hết hạn, một danh sách chiều cố định, hai mươi trường cấu hình viết tay. Thêm một chiều do người dùng cung cấp là cái <code>HGETALL</code> "an toàn" biến thành một sự cố.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Quiz: hashes and object modelling|||5.6 — Trắc nghiệm: hash và mô hình hoá đối tượng',
      slug: 'rd-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về lần ghi bị mất, HGETALL trên hash lớn, hai ngưỡng listpack, mẹo chia gáo và cái giá của nó, các mã trả về của HEXPIRE, và chiều không có trần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the type most people reach for last and should reach for first. Three of them are about the difference between a hash that works in staging and a hash that works at a million objects.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: what a hash prevents that a JSON string does not (5.1), the two thresholds that flip the encoding (5.2), what bucketing costs you (5.2), and what <code>-1</code> means versus <code>-2</code> (5.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về kiểu dữ liệu mà phần lớn người ta với tay lấy sau cùng, trong khi đáng lẽ phải lấy đầu tiên. Ba câu trong đó nói về khác biệt giữa một hash chạy tốt ở môi trường thử và một hash chạy tốt ở mức một triệu đối tượng.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: hash ngăn được điều gì mà chuỗi JSON không ngăn được (5.1), hai ngưỡng lật kiểu mã hoá (5.2), chia gáo lấy đi của bạn cái gì (5.2), và <code>-1</code> khác <code>-2</code> ra sao (5.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A background job updates `last_seen` while a request updates `bio` on the same user, at the same moment. What goes wrong if the user is a JSON string, and why does a hash not have the problem?|||Một việc chạy nền cập nhật `last_seen` trong lúc một yêu cầu cập nhật `bio` trên cùng một người dùng, ở cùng khoảnh khắc. Nếu người dùng là một chuỗi JSON thì hỏng ở đâu, và vì sao hash không dính?',
            options: [
              'Nothing goes wrong — Redis serialises all writes, so both updates are applied in order|||Không hỏng gì — Redis xếp mọi lệnh ghi theo thứ tự, nên cả hai lần cập nhật đều được áp',
              'Both sides read the whole object, modify their field and write it back; whoever writes second overwrites the other field with its stale copy, so one update silently vanishes|||Cả hai bên đọc nguyên đối tượng, sửa trường của mình rồi ghi lại; bên ghi sau đè lên trường của bên kia bằng bản cũ của nó, nên một lần cập nhật âm thầm biến mất',
              'Redis rejects the second SET with a WRONGTYPE error, so the loser knows it lost|||Redis từ chối lệnh SET thứ hai bằng lỗi WRONGTYPE, nên bên thua biết là mình đã thua',
              'The JSON string becomes corrupted, mixing bytes from both writes|||Chuỗi JSON bị hỏng, trộn lẫn byte của cả hai lần ghi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A hash has one field whose value is 100 bytes long. `OBJECT ENCODING` reports `hashtable`. Why, given the field count is 1?|||Một hash có đúng một trường mà giá trị dài 100 byte. `OBJECT ENCODING` báo `hashtable`. Vì sao, khi số trường chỉ là 1?',
            options: [
              'Because a hash with an odd number of fields cannot use listpack|||Vì một hash có số trường lẻ thì không dùng được listpack',
              'Because listpack is only used for hashes created with a single HSET call|||Vì listpack chỉ dùng cho hash được tạo bằng đúng một lời gọi HSET',
              'Because the value contains no digits, so it cannot be packed|||Vì giá trị không chứa chữ số nào nên không đóng gói được',
              'Because EITHER threshold flips it: more than hash-max-listpack-entries fields (128), OR any single field name or value longer than hash-max-listpack-value (64 bytes)|||Vì CHỈ CẦN một trong hai ngưỡng là lật: nhiều hơn hash-max-listpack-entries trường (128), HOẶC có tên trường hay giá trị nào dài hơn hash-max-listpack-value (64 byte)',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Storing a million small objects as a million top-level keys used 89 MB; bucketing them 100-per-hash used 26 MB. Where did the saving come from?|||Lưu một triệu đối tượng nhỏ thành một triệu khoá cấp cao nhất tốn 89 MB; gom chúng 100 cái một hash thì tốn 26 MB. Chỗ tiết kiệm đến từ đâu?',
            options: [
              'From paying top-level key overhead (a keyspace dictEntry, an robj, an SDS header, an expires slot, allocator rounding — roughly 90 bytes) ten thousand times instead of a million times|||Từ việc chỉ trả chi phí khoá cấp cao nhất (một dictEntry trong không gian khoá, một robj, một phần đầu SDS, một chỗ trong dict hạn dùng, một lần làm tròn cấp phát — khoảng 90 byte) mười nghìn lần thay vì một triệu lần',
              'From Redis compressing the hash values with LZF once they exceed 64 bytes|||Từ việc Redis nén giá trị hash bằng LZF khi chúng vượt 64 byte',
              'From the values being deduplicated — identical values are stored once and shared|||Từ việc các giá trị được khử trùng — giá trị giống nhau chỉ lưu một lần rồi dùng chung',
              'From fewer TCP round trips, which reduces the client output buffer|||Từ việc ít vòng đi-về TCP hơn, làm giảm bộ đệm đầu ra của khách',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You bucket a million objects 100-per-hash. What do you actually give up in exchange for the memory?|||Bạn gom một triệu đối tượng 100 cái một hash. Đổi lấy chỗ bộ nhớ đó, bạn thật sự mất gì?',
            options: [
              'Atomic writes — two fields of the same bucket cannot be written safely at once|||Phép ghi nguyên tử — hai trường của cùng một gáo không thể được ghi an toàn cùng lúc',
              'Durability — bucketed hashes are excluded from RDB and AOF|||Tính bền vững — hash chia gáo bị loại khỏi RDB và AOF',
              'O(1) lookups (a bucket is a linear scan), per-object TTL before Redis 7.4, and per-object introspection: no OBJECT ENCODING, MEMORY USAGE or SCAN MATCH for a single object|||Tra cứu O(1) (một gáo là một lượt quét tuyến tính), TTL theo từng đối tượng trên Redis trước 7.4, và khả năng soi từng đối tượng: không có OBJECT ENCODING, MEMORY USAGE hay SCAN MATCH cho một đối tượng đơn lẻ',
              'Nothing meaningful — bucketing is strictly better, which is why Redis does not do it automatically|||Không mất gì đáng kể — chia gáo tốt hơn hẳn, đó là lý do Redis không tự làm việc đó',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: '`HTTL sess:abc FIELDS 2 user token` returns `[-1, -2]`. What does that tell you?|||`HTTL sess:abc FIELDS 2 user token` trả về `[-1, -2]`. Điều đó nói cho bạn biết gì?',
            options: [
              'Both fields are expired and awaiting collection|||Cả hai trường đã hết hạn và đang chờ được thu dọn',
              'Both fields have invalid TTLs and should be re-set|||Cả hai trường có TTL không hợp lệ và cần được đặt lại',
              'The command failed; negative values are error codes for the whole call|||Lệnh thất bại; giá trị âm là mã lỗi cho cả lời gọi',
              '`user` exists but has no TTL (-1), and `token` does not exist in the hash at all (-2) — two different facts that code often collapses into one|||`user` có tồn tại nhưng không có TTL (-1), còn `token` không hề có trong hash (-2) — hai sự thật khác nhau mà mã hay gộp làm một',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'You ship `HEXPIRE sess:abc 1800 FIELDS 1 token` and it works locally. Production runs Redis 7.2. What happens?|||Bạn đưa `HEXPIRE sess:abc 1800 FIELDS 1 token` lên và nó chạy tốt ở máy bạn. Production đang chạy Redis 7.2. Chuyện gì xảy ra?',
            options: [
              'The command returns `ERR unknown command` at runtime — HEXPIRE landed in 7.4 — and because the HSET before it succeeded, you now have a session token that never expires and nothing saying so|||Lệnh trả về `ERR unknown command` lúc chạy thật — HEXPIRE xuất hiện ở bản 7.4 — và vì lệnh HSET ngay trước đó đã thành công, giờ bạn có một mã phiên không bao giờ hết hạn mà chẳng có gì báo cho biết',
              'Redis silently falls back to setting a TTL on the whole key, which is close enough|||Redis âm thầm lùi về đặt TTL cho cả khoá, thế cũng gần đúng rồi',
              'The client library emulates it by scheduling an HDEL, so behaviour is identical|||Thư viện khách giả lập nó bằng cách hẹn một lệnh HDEL, nên hành vi y hệt',
              'Nothing — HEXPIRE has existed since Redis 4.0 and 7.2 supports it fine|||Không sao cả — HEXPIRE có từ bản Redis 4.0 và 7.2 hỗ trợ tốt',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You store a feature flag with `HSET config:app signupsOpen false` and read it as `if (raw.signupsOpen)`. What happens?|||Bạn lưu một cờ tính năng bằng `HSET config:app signupsOpen false` rồi đọc nó bằng `if (raw.signupsOpen)`. Chuyện gì xảy ra?',
            options: [
              'Redis stores it as a boolean and the read returns false correctly|||Redis lưu nó dạng boolean và lượt đọc trả về false đúng đắn',
              'HSET rejects the value because Redis has no boolean type|||HSET từ chối giá trị đó vì Redis không có kiểu boolean',
              'Every hash value comes back as a string, so you get the string "false" — which is truthy in JavaScript, and the feature is on when it should be off|||Mọi giá trị hash đều trả về dạng chuỗi, nên bạn nhận chuỗi "false" — vốn mang giá trị đúng trong JavaScript, và tính năng đang bật trong khi đáng lẽ phải tắt',
              'The read returns nil because "false" is stored as an empty string|||Lượt đọc trả về nil vì "false" được lưu thành chuỗi rỗng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Your daily stats hash has 12 hand-picked dimensions and a dashboard that runs HGETALL every 10 seconds. Someone adds a `path:<url>` dimension on a site with user-generated URLs. What breaks, and when?|||Hash thống kê theo ngày của bạn có 12 chiều chọn tay và một bảng điều khiển chạy HGETALL mỗi 10 giây. Ai đó thêm một chiều `path:<url>` trên trang có URL do người dùng sinh ra. Cái gì hỏng, và hỏng khi nào?',
            options: [
              'Nothing — HGETALL is O(N) but N is the number of distinct paths, which browsers cache anyway|||Không gì cả — HGETALL là O(N) nhưng N là số đường dẫn khác nhau, mà trình duyệt vốn đã lưu đệm rồi',
              'The hash grows with traffic instead of with your feature set: it passes 128 fields within an hour and converts to hashtable, and the "safe" HGETALL becomes an O(400,000) command that blocks the single-threaded server every 10 seconds|||Hash lớn lên theo lưu lượng thay vì theo bộ tính năng: nó vượt 128 trường trong vòng một tiếng và chuyển sang hashtable, còn cái HGETALL "an toàn" thành một lệnh O(400.000) chặn máy chủ đơn luồng mỗi 10 giây',
              'Redis refuses new fields once the hash exceeds hash-max-listpack-entries|||Redis từ chối trường mới khi hash vượt hash-max-listpack-entries',
              'The TTL stops working, because a hashtable-encoded hash cannot carry an expiry|||TTL ngừng hoạt động, vì một hash mã hoá kiểu hashtable không mang được hạn dùng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
