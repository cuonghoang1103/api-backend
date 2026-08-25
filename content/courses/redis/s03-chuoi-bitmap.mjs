/**
 * Redis — Chương 3: chuỗi, bộ đếm, bitmap và HyperLogLog.
 * Chuỗi & mã hoá · bộ đếm nguyên tử · bitmap · HyperLogLog · giới hạn tần suất · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 3 — Strings, counters, bitmaps, HyperLogLog|||Chương 3 — Chuỗi, bộ đếm, bitmap, HyperLogLog',
  description: 'Kiểu dữ liệu đơn giản nhất của Redis hoá ra là bốn kiểu đội lốt một: một chuỗi byte, một bộ đếm nguyên tử, một mảng bit, và một bộ ước lượng số phần tử duy nhất tốn 12KB cho một tỷ mục. Chương này đo cả bốn.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Strings, and their three encodings|||3.1 — Chuỗi, và ba cách mã hoá của nó',
      slug: 'rd-3-1-chuoi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'int, embstr và raw — ba cách Redis lưu một chuỗi và ngưỡng giữa chúng; SET với đủ tuỳ chọn; GETRANGE và SETRANGE; APPEND cấp phát thêm ra sao; và vì sao đừng cất một khối JSON 4MB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Strings, and their three encodings</h2>
<p class="lead">A Redis string is a byte sequence up to 512MB — text, JSON, a JPEG, a serialised protobuf, a counter. It is the type people reach for first and the one they understand least, because the same command stores your value in three completely different ways depending on what it looks like.</p>

<h3>Three encodings, and where the thresholds are</h3>
<pre><code>redis-cli SET a 42;              redis-cli OBJECT ENCODING a
redis-cli SET b "short text";    redis-cli OBJECT ENCODING b
redis-cli SET c "$(head -c 50 /dev/zero | tr '\\0' 'x')"; redis-cli OBJECT ENCODING c
redis-cli APPEND b "!";          redis-cli OBJECT ENCODING b
redis-cli MEMORY USAGE a; redis-cli MEMORY USAGE b</code></pre>
<div class="out">"int"
"embstr"
"raw"
(integer) 11
"raw"
(integer) 56
(integer) 64</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">int</span><span class="lz-lnote">A value that parses as a 64-bit integer is stored as one — no string at all. Values 0–9999 are <em>shared objects</em>: a million keys all holding <code>42</code> point at the same allocation, which is why <code>OBJECT REFCOUNT</code> returns 2147483647 for them.</span></div>
  <div class="lz-layer"><span class="lz-lname">embstr · up to 44 bytes</span><span class="lz-lnote">The <code>robj</code> header and the string data are allocated together in one 64-byte block. One allocation, one cache line, and it cannot be modified in place.</span></div>
  <div class="lz-layer"><span class="lz-lname">raw · over 44 bytes</span><span class="lz-lnote">Two allocations: the object and a separate SDS buffer. Modifiable in place, which is what makes <code>APPEND</code> and <code>SETRANGE</code> cheap on large strings.</span></div>
  <div class="lz-layer"><span class="lz-lname">The conversion is one-way</span><span class="lz-lnote">Any modification promotes <code>embstr</code> to <code>raw</code> and it never converts back — note the 11-byte string above is <code>raw</code> after a single <code>APPEND</code>. Redis does not spend time downgrading.</span></div>
</div>
<div class="callout"><strong>44 bytes is not arbitrary.</strong> A jemalloc size class is 64 bytes; the <code>robj</code> header is 16 and the SDS header for a short string is 3, plus a null terminator — leaving 44 for the data. Everything about Redis's memory behaviour is this kind of allocator arithmetic, and it is why "just add one more field" sometimes doubles a key's cost (Chapter 5).</div>

<h3>SET, with everything it can do</h3>
<pre><code>redis-cli SET k v EX 60          <span class="tok-comment"># with a TTL</span>
redis-cli SET k v NX             <span class="tok-comment"># only if absent — this is a lock (Chapter 7)</span>
redis-cli SET k v XX             <span class="tok-comment"># only if present</span>
redis-cli SET k v KEEPTTL        <span class="tok-comment"># keep the existing TTL (Lesson 2.2)</span>
redis-cli SET k newv GET         <span class="tok-comment"># 6.2+: set, and return the OLD value</span>
redis-cli SET k v IDLE 0 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">OK
(nil)
OK
OK
"v"
(error) ERR syntax error</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> returns nil on failure</span><span class="v">Not an error — <code>SET lock:x token NX EX 30</code> returning <code>nil</code> means someone else holds it. This one line is a distributed lock, and Chapter 7 covers why releasing it correctly is harder than acquiring it.</span></div>
  <div class="kv"><span class="k"><code>GET</code> makes SET atomic-swap</span><span class="v">Set the new value and receive the old one in a single operation. Replaces <code>GETSET</code>, and unlike <code>GETSET</code> it composes with <code>EX</code> and <code>KEEPTTL</code>.</span></div>
  <div class="kv"><span class="k"><code>SETNX</code> and <code>SETEX</code> are legacy</span><span class="v">They still work; <code>SET … NX EX</code> does both atomically and is the form to use. The historical reason matters: before <code>SET</code> gained options, doing both meant two commands and a race.</span></div>
  <div class="kv"><span class="k"><code>MSET</code> is atomic; <code>MSETNX</code> is all-or-nothing</span><span class="v"><code>MSETNX</code> sets every key only if <em>none</em> of them exists. Rarely what you want, but worth knowing it is not per-key.</span></div>
  <div class="kv"><span class="k">Unknown options are errors</span><span class="v">Redis rejects an unrecognised option rather than ignoring it — which is why a typo fails loudly instead of silently doing the wrong thing.</span></div>
</div>

<h3>Reading and writing part of a string</h3>
<pre><code>redis-cli SET log:2026-08-22 "GET /home 200 GET /api 401 POST /login 200"
redis-cli GETRANGE log:2026-08-22 0 12
redis-cli GETRANGE log:2026-08-22 -8 -1
redis-cli SETRANGE log:2026-08-22 10 "404"
redis-cli GETRANGE log:2026-08-22 0 20
redis-cli STRLEN log:2026-08-22</code></pre>
<div class="out">"GET /home 20"
"login 200"
(integer) 42
"GET /home 404 GET /ap"
(integer) 42</div>
<pre><code><span class="tok-comment"># SETRANGE past the end zero-pads — a fixed-width record store in one key</span>
redis-cli DEL rec &gt;/dev/null
redis-cli SETRANGE rec 10 "hello"
redis-cli STRLEN rec
redis-cli --no-raw GETRANGE rec 0 14</code></pre>
<div class="out">(integer) 15
(integer) 15
"\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00hello"</div>
<div class="callout warn"><strong><code>SETRANGE</code> at a large offset allocates the whole string immediately.</strong> <code>SETRANGE k 100000000 "x"</code> creates a 100MB key filled with zero bytes, in one blocking allocation. That is occasionally what you want — it is how you preallocate a bitmap — and it is a memory-exhaustion vector if the offset comes from user input. Bound the offset before you use it.</div>

<h3>APPEND, and the growth it hides</h3>
<pre><code>redis-cli DEL buf &gt;/dev/null
for i in $(seq 1 5); do redis-cli APPEND buf "0123456789" &gt;/dev/null; done
redis-cli STRLEN buf
redis-cli MEMORY USAGE buf
for i in $(seq 1 100); do redis-cli APPEND buf "0123456789" &gt;/dev/null; done
redis-cli STRLEN buf
redis-cli MEMORY USAGE buf</code></pre>
<div class="out">(integer) 50
(integer) 120
(integer) 1050
(integer) 2104</div>
<p>1,050 bytes of data occupying 2,104. SDS over-allocates on append — doubling up to 1MB, then adding 1MB at a time — so that repeated appends are amortised O(1) instead of O(N) copies. The cost is up to 2× memory on a string you built incrementally. If you know the final size, <code>SETRANGE</code> once; if you built it with <code>APPEND</code> and it is now stable, rewriting it with <code>SET</code> reclaims the slack.</p>

<h3>What belongs in a string, and what does not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✅ A cached rendered fragment</span><span class="lz-t">HTML, a JSON response, a signed token</span><span class="lz-d">Read whole, written whole, never partially updated. This is the string's ideal case and it is very common.</span></div>
  <div class="lz-step"><span class="lz-k">✅ A counter or a flag</span><span class="lz-t">INCR, and the int encoding</span><span class="lz-d">Free memory for small values thanks to shared integers, and atomic without any coordination (Lesson 3.2).</span></div>
  <div class="lz-step"><span class="lz-k">⚠️ A serialised object you update</span><span class="lz-t">read 4KB, parse, change one field, write 4KB</span><span class="lz-d">Works, and wastes bandwidth and CPU on every update — plus it is a lost-update race between two writers. A hash does this properly (Chapter 5).</span></div>
  <div class="lz-step"><span class="lz-k">❌ A multi-megabyte blob</span><span class="lz-t">an image, a large export, a whole table</span><span class="lz-d">Every read copies it into an output buffer and the single thread holds the lock while it does. A 4MB value read a thousand times a second is 4GB/s of memcpy. Put it in object storage and cache the URL.</span></div>
</div>
<pre><code>redis-cli SET big "$(head -c 4194304 /dev/urandom | base64 | head -c 4194304)"
redis-cli STRLEN big
redis-cli --latency -i 2 &amp;
for i in $(seq 1 200); do redis-cli GET big &gt;/dev/null; done
wait</code></pre>
<div class="out">(integer) 4194304
min: 0, max: 31, avg: 4.18 (412 samples)</div>
<p>Average latency for every other client went from 0.09ms to 4.18ms, with a 31ms worst case — caused by nothing but two hundred reads of one large value. This is the single-threaded rule from Lesson 1.1 showing up as a data-modelling decision.</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/strings/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Redis strings</span><span class="lc-sub">Every string command with its complexity, the 512MB limit, and worked examples for counters and caching. The starting point for the whole type.</span></span>
</a>
<a class="link-card" href="https://github.com/antirez/sds" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">SDS — Simple Dynamic Strings</span><span class="lc-sub">The string library Redis is built on. The README explains the header variants and the over-allocation strategy that produced the 2× above — short and genuinely interesting.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: strings and encodings</span><span class="lc-sub">Graded exercises: predict the encoding for six values, measure the memory difference across the 44-byte boundary, and explain why a string built with <code>APPEND</code> uses twice its length.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> storing a serialised object as a string and updating one field. The pattern is <code>GET user:1042</code>, <code>JSON.parse</code>, change <code>lastSeen</code>, <code>JSON.stringify</code>, <code>SET user:1042</code> — and it has two distinct problems that both stay invisible under light load. It moves the whole object across the network twice for a change of eight bytes, which on a 4KB object at a thousand updates per second is 8MB/s of traffic for 8KB of actual change. And it is a lost-update race: two requests that read the same version and write back will each overwrite the other's field, silently, with no error anywhere. A hash fixes both — <code>HSET user:1042 lastSeen 1787…</code> touches one field atomically and sends twenty bytes. Keep strings for values you read and write whole; the moment you find yourself parsing to change part of one, the type is wrong.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A string has three encodings — <code>int</code> (with shared objects for 0–9999), <code>embstr</code> up to 44 bytes, and <code>raw</code> above that — and any modification promotes to <code>raw</code> permanently. <code>SET</code> with <code>NX</code>, <code>XX</code>, <code>GET</code> and <code>KEEPTTL</code> replaces four legacy commands and composes atomically. And a multi-megabyte value is a latency problem, not a memory problem: every read copies it while the single thread is held, so 200 reads of a 4MB string took average latency from 0.09ms to 4.18ms for everybody.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Chuỗi, và ba cách mã hoá của nó</h2>
<p class="lead">Một chuỗi Redis là một dãy byte tối đa 512MB — văn bản, JSON, một tấm JPEG, một protobuf đã tuần tự hoá, một bộ đếm. Đó là kiểu người ta với tay lấy đầu tiên và cũng là kiểu người ta hiểu ít nhất, vì cùng một câu lệnh lưu giá trị của bạn theo BA cách hoàn toàn khác nhau tuỳ theo nó trông thế nào.</p>

<h3>Ba cách mã hoá, và các ngưỡng nằm ở đâu</h3>
<pre><code>redis-cli SET a 42;              redis-cli OBJECT ENCODING a
redis-cli SET b "short text";    redis-cli OBJECT ENCODING b
redis-cli SET c "$(head -c 50 /dev/zero | tr '\\0' 'x')"; redis-cli OBJECT ENCODING c
redis-cli APPEND b "!";          redis-cli OBJECT ENCODING b
redis-cli MEMORY USAGE a; redis-cli MEMORY USAGE b</code></pre>
<div class="out">"int"
"embstr"
"raw"
(integer) 11
"raw"
(integer) 56
(integer) 64</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">int</span><span class="lz-lnote">Một giá trị phân tích được thành số nguyên 64 bit thì được lưu ĐÚNG NHƯ VẬY — không có chuỗi nào cả. Các giá trị 0–9999 là <em>ĐỐI TƯỢNG DÙNG CHUNG</em>: một triệu khoá cùng giữ số <code>42</code> đều trỏ vào cùng một vùng cấp phát, và đó là lý do <code>OBJECT REFCOUNT</code> trả về 2147483647 cho chúng.</span></div>
  <div class="lz-layer"><span class="lz-lname">embstr · tới 44 byte</span><span class="lz-lnote">Phần đầu <code>robj</code> và dữ liệu chuỗi được cấp phát CÙNG NHAU trong một khối 64 byte. Một lần cấp phát, một dòng cache, và nó không sửa được tại chỗ.</span></div>
  <div class="lz-layer"><span class="lz-lname">raw · trên 44 byte</span><span class="lz-lnote">Hai lần cấp phát: đối tượng và một bộ đệm SDS riêng. Sửa được tại chỗ, và đó là thứ khiến <code>APPEND</code> với <code>SETRANGE</code> rẻ trên chuỗi lớn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chuyển đổi là MỘT CHIỀU</span><span class="lz-lnote">Mọi phép sửa đổi đều nâng <code>embstr</code> lên <code>raw</code> và nó không bao giờ quay lại — để ý cái chuỗi 11 byte ở trên đã thành <code>raw</code> chỉ sau một lệnh <code>APPEND</code>. Redis không bỏ thời gian để hạ cấp.</span></div>
</div>
<div class="callout"><strong>Con số 44 byte không phải tuỳ tiện.</strong> Một lớp kích thước của jemalloc là 64 byte; phần đầu <code>robj</code> chiếm 16 và phần đầu SDS cho chuỗi ngắn chiếm 3, cộng một ký tự kết thúc null — còn lại 44 cho dữ liệu. Mọi hành vi bộ nhớ của Redis đều là kiểu số học của bộ cấp phát như thế này, và đó là lý do "thêm một trường nữa thôi mà" đôi khi làm chi phí của một khoá tăng gấp đôi (Chương 5).</div>

<h3>SET, với mọi thứ nó làm được</h3>
<pre><code>redis-cli SET k v EX 60          <span class="tok-comment"># kèm TTL</span>
redis-cli SET k v NX             <span class="tok-comment"># chỉ khi chưa có — đây là một cái khoá (Chương 7)</span>
redis-cli SET k v XX             <span class="tok-comment"># chỉ khi đã có</span>
redis-cli SET k v KEEPTTL        <span class="tok-comment"># giữ TTL đang có (Bài 2.2)</span>
redis-cli SET k newv GET         <span class="tok-comment"># 6.2+: đặt, và trả về giá trị CŨ</span>
redis-cli SET k v IDLE 0 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">OK
(nil)
OK
OK
"v"
(error) ERR syntax error</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>NX</code> trả nil khi thất bại</span><span class="v">Không phải một lỗi — lệnh <code>SET lock:x token NX EX 30</code> trả <code>nil</code> nghĩa là người khác đang giữ nó. Riêng một dòng này là một cái khoá phân tán, và Chương 7 nói vì sao NHẢ nó cho đúng khó hơn giành lấy nó.</span></div>
  <div class="kv"><span class="k"><code>GET</code> biến SET thành hoán đổi nguyên tử</span><span class="v">Đặt giá trị mới và nhận về giá trị cũ trong một thao tác. Thay thế <code>GETSET</code>, và khác <code>GETSET</code>, nó ghép được với <code>EX</code> và <code>KEEPTTL</code>.</span></div>
  <div class="kv"><span class="k"><code>SETNX</code> và <code>SETEX</code> là đời cũ</span><span class="v">Chúng vẫn chạy; <code>SET … NX EX</code> làm cả hai một cách nguyên tử và là dạng nên dùng. Lý do lịch sử cũng đáng biết: trước khi <code>SET</code> có các tuỳ chọn, làm cả hai nghĩa là hai câu lệnh và một cuộc đua.</span></div>
  <div class="kv"><span class="k"><code>MSET</code> nguyên tử; <code>MSETNX</code> là được-tất-hoặc-không-gì</span><span class="v"><code>MSETNX</code> chỉ đặt mọi khoá nếu KHÔNG khoá nào trong số đó tồn tại. Hiếm khi là thứ bạn muốn, nhưng đáng biết rằng nó không xét theo từng khoá.</span></div>
  <div class="kv"><span class="k">Tuỳ chọn lạ là LỖI</span><span class="v">Redis từ chối một tuỳ chọn không nhận ra chứ không phớt lờ nó — và đó là lý do một lỗi gõ thì hỏng TO TIẾNG thay vì lặng lẽ làm sai.</span></div>
</div>

<h3>Đọc và ghi một PHẦN của chuỗi</h3>
<pre><code>redis-cli SET log:2026-08-22 "GET /home 200 GET /api 401 POST /login 200"
redis-cli GETRANGE log:2026-08-22 0 12
redis-cli GETRANGE log:2026-08-22 -8 -1
redis-cli SETRANGE log:2026-08-22 10 "404"
redis-cli GETRANGE log:2026-08-22 0 20
redis-cli STRLEN log:2026-08-22</code></pre>
<div class="out">"GET /home 20"
"login 200"
(integer) 42
"GET /home 404 GET /ap"
(integer) 42</div>
<pre><code><span class="tok-comment"># SETRANGE vượt quá cuối chuỗi sẽ đệm byte 0 — một kho bản ghi cố định trong một khoá</span>
redis-cli DEL rec &gt;/dev/null
redis-cli SETRANGE rec 10 "hello"
redis-cli STRLEN rec
redis-cli --no-raw GETRANGE rec 0 14</code></pre>
<div class="out">(integer) 15
(integer) 15
"\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00hello"</div>
<div class="callout warn"><strong><code>SETRANGE</code> ở một vị trí lớn sẽ cấp phát NGAY toàn bộ chuỗi.</strong> Lệnh <code>SETRANGE k 100000000 "x"</code> tạo ra một cái khoá 100MB toàn byte 0, trong một lần cấp phát gây chặn. Đôi khi đó đúng là thứ bạn muốn — đây là cách bạn cấp phát trước một bitmap — và nó là một lối tấn công vét cạn bộ nhớ nếu cái vị trí đó đến từ đầu vào người dùng. Hãy chặn giới hạn cho vị trí trước khi dùng.</div>

<h3>APPEND, và phần phình ra mà nó giấu</h3>
<pre><code>redis-cli DEL buf &gt;/dev/null
for i in $(seq 1 5); do redis-cli APPEND buf "0123456789" &gt;/dev/null; done
redis-cli STRLEN buf
redis-cli MEMORY USAGE buf
for i in $(seq 1 100); do redis-cli APPEND buf "0123456789" &gt;/dev/null; done
redis-cli STRLEN buf
redis-cli MEMORY USAGE buf</code></pre>
<div class="out">(integer) 50
(integer) 120
(integer) 1050
(integer) 2104</div>
<p>1.050 byte dữ liệu chiếm 2.104. SDS cấp phát DƯ khi nối thêm — nhân đôi cho tới 1MB, rồi thêm từng 1MB một — để những lần nối liên tiếp được khấu hao thành O(1) thay vì O(N) lần sao chép. Cái giá là tới 2× bộ nhớ trên một chuỗi bạn dựng dần. Nếu bạn biết trước kích thước cuối cùng thì dùng <code>SETRANGE</code> một lần; nếu bạn đã dựng nó bằng <code>APPEND</code> và giờ nó ổn định rồi thì ghi lại bằng <code>SET</code> sẽ thu hồi phần dư.</p>

<h3>Cái gì thuộc về một chuỗi, và cái gì thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✅ Một mảnh nội dung đã kết xuất và cache lại</span><span class="lz-t">HTML, một phản hồi JSON, một token đã ký</span><span class="lz-d">Đọc trọn, ghi trọn, không bao giờ cập nhật một phần. Đây là trường hợp lý tưởng của chuỗi và nó rất phổ biến.</span></div>
  <div class="lz-step"><span class="lz-k">✅ Một bộ đếm hay một cờ</span><span class="lz-t">INCR, và cách mã hoá int</span><span class="lz-d">Bộ nhớ miễn phí cho giá trị nhỏ nhờ số nguyên dùng chung, và nguyên tử mà không cần phối hợp gì (Bài 3.2).</span></div>
  <div class="lz-step"><span class="lz-k">⚠️ Một đối tượng đã tuần tự hoá mà bạn CẬP NHẬT</span><span class="lz-t">đọc 4KB, phân tích, đổi một trường, ghi 4KB</span><span class="lz-d">Chạy được, và phí băng thông với CPU ở mọi lần cập nhật — cộng thêm nó là một cuộc đua mất-cập-nhật giữa hai bên ghi. Một cái hash làm việc này cho tử tế (Chương 5).</span></div>
  <div class="lz-step"><span class="lz-k">❌ Một khối dữ liệu vài megabyte</span><span class="lz-t">một tấm ảnh, một bản xuất lớn, cả một cái bảng</span><span class="lz-d">Mọi lệnh đọc đều chép nó vào một bộ đệm ra và cái luồng duy nhất bị giữ trong lúc đó. Một giá trị 4MB được đọc một nghìn lần mỗi giây là 4GB/s memcpy. Hãy đặt nó vào lưu trữ đối tượng rồi cache cái URL.</span></div>
</div>
<pre><code>redis-cli SET big "$(head -c 4194304 /dev/urandom | base64 | head -c 4194304)"
redis-cli STRLEN big
redis-cli --latency -i 2 &amp;
for i in $(seq 1 200); do redis-cli GET big &gt;/dev/null; done
wait</code></pre>
<div class="out">(integer) 4194304
min: 0, max: 31, avg: 4.18 (412 samples)</div>
<p>Độ trễ trung bình của MỌI client khác đi từ 0,09ms lên 4,18ms, với trường hợp tệ nhất là 31ms — gây ra bởi không gì khác ngoài hai trăm lần đọc MỘT giá trị lớn. Đây là cái luật một luồng ở Bài 1.1 hiện ra thành một quyết định MÔ HÌNH HOÁ DỮ LIỆU.</p>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/strings/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Chuỗi trong Redis</span><span class="lc-sub">Mọi câu lệnh chuỗi kèm độ phức tạp, giới hạn 512MB, và ví dụ đã làm sẵn cho bộ đếm với cache. Điểm khởi đầu cho cả kiểu dữ liệu này.</span></span>
</a>
<a class="link-card" href="https://github.com/antirez/sds" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">SDS — Simple Dynamic Strings</span><span class="lc-sub">Thư viện chuỗi mà Redis được dựng trên. Phần README giải thích các biến thể phần đầu và chiến lược cấp phát dư đã sinh ra con số 2× ở trên — ngắn và thật sự thú vị.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chuỗi và cách mã hoá</span><span class="lc-sub">Bài chấm điểm: đoán cách mã hoá cho sáu giá trị, đo khác biệt bộ nhớ quanh ranh giới 44 byte, và giải thích vì sao một chuỗi dựng bằng <code>APPEND</code> tốn gấp đôi độ dài của nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cất một đối tượng đã tuần tự hoá dưới dạng chuỗi rồi cập nhật MỘT trường. Cái mẫu là <code>GET user:1042</code>, <code>JSON.parse</code>, đổi <code>lastSeen</code>, <code>JSON.stringify</code>, <code>SET user:1042</code> — và nó có hai vấn đề riêng biệt mà cả hai đều vô hình khi tải nhẹ. Nó chuyển cả đối tượng qua mạng HAI lần chỉ để đổi tám byte, mà trên một đối tượng 4KB với một nghìn lần cập nhật mỗi giây là 8MB/s lưu lượng cho 8KB thay đổi thật. Và nó là một cuộc đua MẤT CẬP NHẬT: hai request đọc cùng một phiên bản rồi ghi ngược lại sẽ đè lên trường của nhau, trong im lặng, không có lỗi ở đâu cả. Một cái hash chữa cả hai — <code>HSET user:1042 lastSeen 1787…</code> chạm vào một trường một cách nguyên tử và gửi đi hai mươi byte. Hãy giữ chuỗi cho những giá trị bạn đọc trọn và ghi trọn; ngay khoảnh khắc bạn thấy mình phải phân tích để đổi một PHẦN của nó, thì kiểu dữ liệu đó đã sai.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một chuỗi có ba cách mã hoá — <code>int</code> (kèm đối tượng dùng chung cho 0–9999), <code>embstr</code> tới 44 byte, và <code>raw</code> trên mức đó — và mọi phép sửa đổi đều nâng lên <code>raw</code> vĩnh viễn. <code>SET</code> với <code>NX</code>, <code>XX</code>, <code>GET</code> và <code>KEEPTTL</code> thay thế bốn câu lệnh đời cũ và ghép được với nhau một cách nguyên tử. Và một giá trị vài megabyte là một vấn đề ĐỘ TRỄ chứ không phải vấn đề bộ nhớ: mọi lệnh đọc đều chép nó trong lúc cái luồng duy nhất bị giữ, nên 200 lần đọc một chuỗi 4MB đã đẩy độ trễ trung bình của TẤT CẢ MỌI NGƯỜI từ 0,09ms lên 4,18ms.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Counters that cannot go wrong|||3.2 — Bộ đếm không thể sai',
      slug: 'rd-3-2-bo-dem',
      type: 'LESSON',
      description: 'Vì sao INCR là nguyên tử và một vòng đọc-sửa-ghi thì không, cả họ INCR, số thực và cái bẫy IEEE754, đếm theo cửa sổ thời gian, và làm thế nào để một bộ đếm không sống mãi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Counters that cannot go wrong</h2>
<p class="lead">Counting is the operation most likely to be quietly wrong in a distributed system, and the one Redis makes trivially correct. The reason is Lesson 1.1: one thread executing one command at a time means read-modify-write is a single indivisible step, with no locks, no transactions and no possibility of a lost update.</p>

<h3>The bug INCR does not have</h3>
<pre><code><span class="tok-comment">// ❌ Read-modify-write in the application: two processes, one lost increment</span>
const n = Number(await redis.get('views')) || 0;   <span class="tok-comment">// both read 100</span>
await redis.set('views', n + 1);                   <span class="tok-comment">// both write 101</span>

<span class="tok-comment">// ✅ One command, executed by one thread, indivisibly</span>
await redis.incr('views');                         <span class="tok-comment">// 101, then 102</span></code></pre>
<pre><code><span class="tok-comment"># Prove it: 50 parallel shells, 200 increments each</span>
redis-cli SET views 0
for i in $(seq 1 50); do
  ( for j in $(seq 1 200); do echo "INCR views"; done | redis-cli --pipe &gt;/dev/null ) &amp;
done; wait
redis-cli GET views</code></pre>
<div class="out">OK
"10000"</div>
<div class="callout ok"><strong>Exactly 10,000, every time you run it.</strong> No coordination, no retry loop, no <code>SELECT … FOR UPDATE</code>. The same experiment with the read-modify-write version loses several hundred increments and loses a different number each run — which is precisely what makes that bug so hard to notice: the count is <em>plausible</em>, just wrong.</div>

<h3>The whole family</h3>
<pre><code>redis-cli SET n 100
redis-cli INCR n; redis-cli DECR n
redis-cli INCRBY n 25; redis-cli DECRBY n 10
redis-cli INCRBYFLOAT n 0.5
redis-cli HSET stats views 0 &gt;/dev/null; redis-cli HINCRBY stats views 3
redis-cli ZADD board 0 alice &gt;/dev/null; redis-cli ZINCRBY board 10 alice
redis-cli SET s "abc"; redis-cli INCR s</code></pre>
<div class="out">(integer) 101
(integer) 100
(integer) 125
(integer) 115
"115.5"
(integer) 3
"10"
(error) ERR value is not an integer or out of range</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Missing key means zero</span><span class="v"><code>INCR</code> on a key that does not exist creates it at 1. No initialisation step, no "if not exists" — which is what makes counters a one-liner.</span></div>
  <div class="kv"><span class="k">64-bit signed, and it errors on overflow</span><span class="v">Range is ±9.2×10<sup>18</sup>. Exceeding it returns <code>increment or decrement would overflow</code> rather than wrapping — a good default, and one you will never hit in practice.</span></div>
  <div class="kv"><span class="k">Non-numeric is an error, not a coercion</span><span class="v"><code>INCR</code> on <code>"abc"</code> fails loudly. Redis never guesses, which means a <code>WRONGTYPE</code>-adjacent bug surfaces immediately.</span></div>
  <div class="kv"><span class="k">The <code>H</code> and <code>Z</code> variants</span><span class="v"><code>HINCRBY</code> on a hash field and <code>ZINCRBY</code> on a sorted-set score are equally atomic — which is how you keep many related counters in one key (Chapter 5) or a live leaderboard (Chapter 4).</span></div>
  <div class="kv"><span class="k">Counters keep the <code>int</code> encoding</span><span class="v">A counter under 10,000 is a shared object costing no allocation at all; above that it is an 8-byte integer inside the <code>robj</code>. Counters are the cheapest thing in Redis.</span></div>
</div>

<h3>Floats, and the trap in them</h3>
<pre><code>redis-cli SET bal 0
redis-cli INCRBYFLOAT bal 0.1
redis-cli INCRBYFLOAT bal 0.2
redis-cli GET bal
redis-cli INCRBYFLOAT bal -0.30000000000000004
redis-cli GET bal</code></pre>
<div class="out">"0.1"
"0.3"
"0.3"
"0"
"0"</div>
<div class="callout warn"><strong>Redis prints <code>0.3</code>, which is friendlier than JavaScript's <code>0.30000000000000004</code> — and it is the same long double underneath.</strong> Redis formats with 17 significant digits and strips trailing zeros, so the representation error is usually hidden rather than absent. For money, that is not good enough: store integer minor units (<code>INCRBY bal_cents 30</code>) and format for display. <code>INCRBYFLOAT</code> is right for averages, rates and scores where a rounding error in the eighteenth digit does not matter, and wrong for anything anybody will reconcile against a bank statement.</div>

<h3>Counting per time window</h3>
<pre><code><span class="tok-comment"># One key per bucket, and the TTL does the cleanup</span>
now=$(date +%s); minute=$(( now / 60 )); hour=$(( now / 3600 ))
redis-cli INCR "views:m:$minute"; redis-cli EXPIRE "views:m:$minute" 3600
redis-cli INCR "views:h:$hour";   redis-cli EXPIRE "views:h:$hour"   604800
redis-cli INCR "views:d:$(date +%F)"

<span class="tok-comment"># Reading a range of buckets is one MGET</span>
redis-cli MGET "views:m:$((minute-2))" "views:m:$((minute-1))" "views:m:$minute"</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 1
(integer) 1
1) "412"
2) "388"
3) "1"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Put the bucket in the key</span><span class="lz-t">views:m:29783364</span><span class="lz-d">Integer-divide the timestamp by the window size. No arithmetic at read time, and buckets never collide.</span></div>
  <div class="lz-step"><span class="lz-k">Set the TTL on creation</span><span class="lz-t">EXPIRE right after the first INCR</span><span class="lz-d">Otherwise you accumulate one key per minute forever. <code>EXPIRE</code> on every increment is also fine and costs nothing — it just resets the window.</span></div>
  <div class="lz-step"><span class="lz-k">Read many buckets with MGET</span><span class="lz-t">one round trip for an hour of minutes</span><span class="lz-d">Sixty keys in one command (Lesson 1.4). Missing buckets come back as <code>nil</code>, which is correctly zero.</span></div>
  <div class="lz-step"><span class="lz-k">Or one hash per day</span><span class="lz-t">HINCRBY views:2026-08-22 &lt;minute&gt; 1</span><span class="lz-d">1,440 fields in one key instead of 1,440 keys — dramatically less overhead, one TTL to manage, and <code>HGETALL</code> returns the whole day (Chapter 5).</span></div>
</div>
<pre><code><span class="tok-comment">// The two-command version, pipelined so it costs one round trip</span>
export async function bump(metric, ttl = 3600) {
  const bucket = Math.floor(Date.now() / 60000);
  const key = &#96;views:\${metric}:m:\${bucket}&#96;;
  const p = redis.multi();
  p.incr(key);
  p.expire(key, ttl, 'NX');       <span class="tok-comment">// 7.0+: only set the TTL once</span>
  const [count] = await p.exec();
  return count;
}</code></pre>

<h3>Counters that live forever, and how to avoid them</h3>
<pre><code>redis-cli --scan --pattern 'views:m:*' | wc -l
redis-cli INFO keyspace</code></pre>
<div class="out">128394
db0:keys=142811,expires=14417,avg_ttl=1841203</div>
<div class="kv-grid">
  <div class="kv"><span class="k">128,394 keys, 14,417 with a TTL</span><span class="v">The gap is the leak: the <code>EXPIRE</code> ran on some and not others, almost always because the code sets it only when the counter is created and the creation path changed.</span></div>
  <div class="kv"><span class="k">Use <code>EXPIRE … NX</code></span><span class="v">Redis 7.0+ sets the TTL only if there is not one already. Call it on every increment: idempotent, one command, and no key can be missed.</span></div>
  <div class="kv"><span class="k">Or collapse into a hash</span><span class="v">One key per day with a field per minute has exactly one TTL, which cannot be partially applied.</span></div>
  <div class="kv"><span class="k">Watch the ratio, not the count</span><span class="v"><code>keys</code> versus <code>expires</code> in <code>INFO keyspace</code> is the metric that catches this class of leak early — the same diagnostic as Lesson 2.2.</span></div>
  <div class="kv"><span class="k">Aggregate old buckets away</span><span class="v">A nightly job that sums minute buckets into a day total and unlinks the minutes keeps the keyspace flat while preserving history.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/incr/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">INCR</span><span class="lc-sub">The command page includes a full rate-limiter pattern and a discussion of why the atomicity matters — one of the better worked examples in the documentation.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/incrbyfloat/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">INCRBYFLOAT</span><span class="lc-sub">The long-double representation, the 17-digit formatting rule, and the explicit note that it is not suitable for exact decimal arithmetic.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a counter</span><span class="lc-sub">Graded exercises: reproduce the lost-update race and fix it with <code>INCR</code>, build minute/hour/day buckets with correct TTLs, and explain why <code>INCRBYFLOAT</code> is wrong for a balance.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> setting the TTL on a counter only when it is first created. The code reads sensibly — if <code>INCR</code> returns 1 this is a new key, so set the expiry — and it is subtly broken in two ways. If the process dies between the <code>INCR</code> and the <code>EXPIRE</code>, that key is immortal forever, and nothing will ever try again because the counter is no longer 1. And if a second writer increments in the window between them, neither sees the return value 1 and neither sets a TTL. Both cases leave a small permanent residue that accumulates for months and shows up as a growing gap between <code>keys</code> and <code>expires</code> in <code>INFO keyspace</code>. Use <code>EXPIRE key ttl NX</code> on <em>every</em> increment (Redis 7.0+): it is idempotent, costs nothing, and cannot be skipped by a crash or a race. On older versions, pipeline an unconditional <code>EXPIRE</code> alongside the <code>INCR</code> — resetting the window is almost always acceptable for a counter that is being written to.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>INCR</code> is atomic because one thread executes one command at a time — 10,000 parallel increments give exactly 10,000, while the read-modify-write version loses a different number every run. <code>INCRBYFLOAT</code> uses a long double and prints prettily; for money use integer minor units. And put the time bucket in the key name and set the TTL with <code>EXPIRE … NX</code> on every increment, or watch <code>keys</code> versus <code>expires</code> drift apart forever.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bộ đếm không thể sai</h2>
<p class="lead">Đếm là thao tác dễ bị sai một cách âm thầm nhất trong một hệ phân tán, và cũng là thao tác mà Redis làm cho đúng một cách hiển nhiên. Lý do nằm ở Bài 1.1: một luồng thực thi một câu lệnh tại một thời điểm nghĩa là đọc-sửa-ghi trở thành MỘT bước không chia cắt được, không khoá, không giao dịch, và không có khả năng mất cập nhật.</p>

<h3>Cái lỗi mà INCR không có</h3>
<pre><code><span class="tok-comment">// ❌ Đọc-sửa-ghi trong ứng dụng: hai tiến trình, mất một lượt tăng</span>
const n = Number(await redis.get('views')) || 0;   <span class="tok-comment">// cả hai cùng đọc ra 100</span>
await redis.set('views', n + 1);                   <span class="tok-comment">// cả hai cùng ghi 101</span>

<span class="tok-comment">// ✅ Một câu lệnh, một luồng thực thi, không chia cắt được</span>
await redis.incr('views');                         <span class="tok-comment">// 101, rồi 102</span></code></pre>
<pre><code><span class="tok-comment"># Chứng minh: 50 shell chạy song song, mỗi cái 200 lượt tăng</span>
redis-cli SET views 0
for i in $(seq 1 50); do
  ( for j in $(seq 1 200); do echo "INCR views"; done | redis-cli --pipe &gt;/dev/null ) &amp;
done; wait
redis-cli GET views</code></pre>
<div class="out">OK
"10000"</div>
<div class="callout ok"><strong>Đúng 10.000, ở mọi lần bạn chạy lại.</strong> Không phối hợp, không vòng thử lại, không <code>SELECT … FOR UPDATE</code>. Cũng thí nghiệm đó với phiên bản đọc-sửa-ghi thì mất vài trăm lượt tăng và mất một con số KHÁC NHAU ở mỗi lần chạy — và chính điều đó khiến cái lỗi này khó nhận ra đến thế: con số vẫn <em>NGHE HỢP LÝ</em>, chỉ là sai.</div>

<h3>Cả họ nhà INCR</h3>
<pre><code>redis-cli SET n 100
redis-cli INCR n; redis-cli DECR n
redis-cli INCRBY n 25; redis-cli DECRBY n 10
redis-cli INCRBYFLOAT n 0.5
redis-cli HSET stats views 0 &gt;/dev/null; redis-cli HINCRBY stats views 3
redis-cli ZADD board 0 alice &gt;/dev/null; redis-cli ZINCRBY board 10 alice
redis-cli SET s "abc"; redis-cli INCR s</code></pre>
<div class="out">(integer) 101
(integer) 100
(integer) 125
(integer) 115
"115.5"
(integer) 3
"10"
(error) ERR value is not an integer or out of range</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá thiếu nghĩa là số không</span><span class="v"><code>INCR</code> trên một khoá không tồn tại sẽ tạo nó với giá trị 1. Không có bước khởi tạo, không có "nếu chưa có thì" — và đó là thứ khiến bộ đếm gọn trong một dòng.</span></div>
  <div class="kv"><span class="k">64 bit có dấu, và nó BÁO LỖI khi tràn</span><span class="v">Khoảng là ±9,2×10<sup>18</sup>. Vượt qua thì trả về <code>increment or decrement would overflow</code> chứ không quay vòng — một mặc định tốt, và là thứ trong thực tế bạn sẽ không bao giờ chạm tới.</span></div>
  <div class="kv"><span class="k">Không phải số thì LỖI, không ép kiểu</span><span class="v"><code>INCR</code> trên <code>"abc"</code> hỏng to tiếng. Redis không bao giờ đoán, nghĩa là một cái lỗi cùng họ với <code>WRONGTYPE</code> lộ ra ngay lập tức.</span></div>
  <div class="kv"><span class="k">Các biến thể <code>H</code> và <code>Z</code></span><span class="v"><code>HINCRBY</code> trên một trường hash và <code>ZINCRBY</code> trên điểm số của sorted set đều nguyên tử y như vậy — và đó là cách bạn giữ nhiều bộ đếm liên quan trong MỘT khoá (Chương 5) hoặc một bảng xếp hạng sống (Chương 4).</span></div>
  <div class="kv"><span class="k">Bộ đếm giữ cách mã hoá <code>int</code></span><span class="v">Một bộ đếm dưới 10.000 là một đối tượng dùng chung chẳng tốn cấp phát nào cả; trên mức đó nó là một số nguyên 8 byte nằm trong <code>robj</code>. Bộ đếm là thứ rẻ nhất trong Redis.</span></div>
</div>

<h3>Số thực, và cái bẫy trong đó</h3>
<pre><code>redis-cli SET bal 0
redis-cli INCRBYFLOAT bal 0.1
redis-cli INCRBYFLOAT bal 0.2
redis-cli GET bal
redis-cli INCRBYFLOAT bal -0.30000000000000004
redis-cli GET bal</code></pre>
<div class="out">"0.1"
"0.3"
"0.3"
"0"
"0"</div>
<div class="callout warn"><strong>Redis in ra <code>0.3</code>, thân thiện hơn con số <code>0.30000000000000004</code> của JavaScript — và bên dưới vẫn là cùng một số thực dài.</strong> Redis định dạng với 17 chữ số có nghĩa rồi cắt các số 0 ở đuôi, nên sai số biểu diễn thường bị GIẤU đi chứ không phải không có. Với TIỀN thì như thế là chưa đủ tốt: hãy lưu số nguyên theo đơn vị nhỏ nhất (<code>INCRBY bal_cents 30</code>) rồi định dạng lúc hiển thị. <code>INCRBYFLOAT</code> đúng cho giá trị trung bình, tỷ lệ và điểm số nơi một sai số làm tròn ở chữ số thứ mười tám không quan trọng, và SAI cho bất cứ thứ gì mà ai đó sẽ đối chiếu với một sao kê ngân hàng.</div>

<h3>Đếm theo cửa sổ thời gian</h3>
<pre><code><span class="tok-comment"># Mỗi ô một khoá, và TTL lo phần dọn dẹp</span>
now=$(date +%s); minute=$(( now / 60 )); hour=$(( now / 3600 ))
redis-cli INCR "views:m:$minute"; redis-cli EXPIRE "views:m:$minute" 3600
redis-cli INCR "views:h:$hour";   redis-cli EXPIRE "views:h:$hour"   604800
redis-cli INCR "views:d:$(date +%F)"

<span class="tok-comment"># Đọc một dải ô chỉ tốn một lệnh MGET</span>
redis-cli MGET "views:m:$((minute-2))" "views:m:$((minute-1))" "views:m:$minute"</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 1
(integer) 1
(integer) 1
1) "412"
2) "388"
3) "1"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đặt cái ô vào TÊN KHOÁ</span><span class="lz-t">views:m:29783364</span><span class="lz-d">Chia nguyên mốc thời gian cho độ dài cửa sổ. Không phải tính toán gì lúc đọc, và các ô không bao giờ đụng nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Đặt TTL ngay khi tạo</span><span class="lz-t">EXPIRE ngay sau lệnh INCR đầu tiên</span><span class="lz-d">Không thì bạn tích lại mỗi phút một khoá, mãi mãi. Gọi <code>EXPIRE</code> ở MỌI lượt tăng cũng ổn và chẳng tốn gì — nó chỉ đặt lại cửa sổ.</span></div>
  <div class="lz-step"><span class="lz-k">Đọc nhiều ô bằng MGET</span><span class="lz-t">một vòng mạng cho cả một giờ tính theo phút</span><span class="lz-d">Sáu mươi khoá trong một câu lệnh (Bài 1.4). Những ô thiếu về dưới dạng <code>nil</code>, và đó đúng là số không.</span></div>
  <div class="lz-step"><span class="lz-k">Hoặc mỗi ngày một hash</span><span class="lz-t">HINCRBY views:2026-08-22 &lt;phút&gt; 1</span><span class="lz-d">1.440 trường trong một khoá thay vì 1.440 khoá — chi phí phụ ít hơn hẳn, chỉ một TTL phải quản, và <code>HGETALL</code> trả về cả ngày (Chương 5).</span></div>
</div>
<pre><code><span class="tok-comment">// Bản hai câu lệnh, đóng pipeline nên chỉ tốn một vòng mạng</span>
export async function bump(metric, ttl = 3600) {
  const bucket = Math.floor(Date.now() / 60000);
  const key = &#96;views:\${metric}:m:\${bucket}&#96;;
  const p = redis.multi();
  p.incr(key);
  p.expire(key, ttl, 'NX');       <span class="tok-comment">// 7.0+: chỉ đặt TTL một lần</span>
  const [count] = await p.exec();
  return count;
}</code></pre>

<h3>Những bộ đếm sống mãi, và cách tránh</h3>
<pre><code>redis-cli --scan --pattern 'views:m:*' | wc -l
redis-cli INFO keyspace</code></pre>
<div class="out">128394
db0:keys=142811,expires=14417,avg_ttl=1841203</div>
<div class="kv-grid">
  <div class="kv"><span class="k">128.394 khoá, 14.417 cái có TTL</span><span class="v">Khoảng chênh đó chính là chỗ rò: lệnh <code>EXPIRE</code> chạy trên một số cái và không chạy trên số còn lại, gần như luôn vì mã chỉ đặt nó khi bộ đếm được TẠO RA và đường tạo đã thay đổi.</span></div>
  <div class="kv"><span class="k">Hãy dùng <code>EXPIRE … NX</code></span><span class="v">Redis 7.0+ chỉ đặt TTL nếu chưa có sẵn. Hãy gọi nó ở MỌI lượt tăng: bất biến khi lặp lại, một câu lệnh, và không khoá nào có thể bị bỏ sót.</span></div>
  <div class="kv"><span class="k">Hoặc gom lại thành một hash</span><span class="v">Mỗi ngày một khoá với mỗi phút một trường thì có ĐÚNG một TTL, và nó không thể bị áp một phần.</span></div>
  <div class="kv"><span class="k">Hãy canh TỶ LỆ, đừng canh con số</span><span class="v"><code>keys</code> so với <code>expires</code> trong <code>INFO keyspace</code> là chỉ số bắt được nhóm rò rỉ này từ sớm — cùng phép chẩn đoán ở Bài 2.2.</span></div>
  <div class="kv"><span class="k">Gộp bỏ những ô cũ</span><span class="v">Một việc chạy đêm gộp các ô phút thành tổng theo ngày rồi unlink các ô phút sẽ giữ không gian khoá nằm ngang mà vẫn giữ được lịch sử.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/incr/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">INCR</span><span class="lc-sub">Trang câu lệnh này có sẵn một mẫu giới hạn tần suất đầy đủ và một phần bàn về vì sao tính nguyên tử lại quan trọng — một trong những ví dụ được làm kỹ nhất trong tài liệu.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/incrbyfloat/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">INCRBYFLOAT</span><span class="lc-sub">Cách biểu diễn long double, luật định dạng 17 chữ số, và ghi chú tường minh rằng nó KHÔNG phù hợp cho số học thập phân chính xác.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một bộ đếm</span><span class="lc-sub">Bài chấm điểm: tái hiện cuộc đua mất-cập-nhật rồi chữa bằng <code>INCR</code>, dựng các ô phút/giờ/ngày với TTL đúng, và giải thích vì sao <code>INCRBYFLOAT</code> sai cho một số dư tài khoản.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chỉ đặt TTL cho một bộ đếm khi nó được TẠO RA lần đầu. Đoạn mã đọc lên rất hợp lý — nếu <code>INCR</code> trả về 1 thì đây là khoá mới, vậy đặt thời hạn — và nó hỏng một cách tinh vi theo HAI cách. Nếu tiến trình chết giữa lệnh <code>INCR</code> và lệnh <code>EXPIRE</code> thì cái khoá đó bất tử vĩnh viễn, và sẽ không bao giờ có gì thử lại vì bộ đếm không còn bằng 1 nữa. Và nếu một bên ghi thứ hai tăng bộ đếm đúng vào khoảng giữa hai lệnh đó thì không bên nào thấy giá trị trả về 1 và không bên nào đặt TTL. Cả hai trường hợp đều để lại một chút cặn vĩnh viễn, tích lại trong nhiều tháng và hiện ra thành khoảng chênh ngày càng lớn giữa <code>keys</code> với <code>expires</code> trong <code>INFO keyspace</code>. Hãy dùng <code>EXPIRE key ttl NX</code> ở MỌI lượt tăng (Redis 7.0+): nó bất biến khi lặp lại, không tốn gì, và không thể bị bỏ qua bởi một cú sập hay một cuộc đua. Trên bản cũ hơn, hãy đóng pipeline một lệnh <code>EXPIRE</code> vô điều kiện cạnh lệnh <code>INCR</code> — đặt lại cửa sổ gần như luôn chấp nhận được với một bộ đếm đang được ghi vào.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>INCR</code> nguyên tử vì một luồng thực thi một câu lệnh tại một thời điểm — 10.000 lượt tăng song song cho ra đúng 10.000, trong khi bản đọc-sửa-ghi mất một con số khác nhau ở mỗi lần chạy. <code>INCRBYFLOAT</code> dùng long double và in ra rất đẹp mắt; với tiền thì hãy dùng số nguyên theo đơn vị nhỏ nhất. Và hãy đặt cái ô thời gian vào TÊN KHOÁ rồi đặt TTL bằng <code>EXPIRE … NX</code> ở mọi lượt tăng, không thì hãy nhìn <code>keys</code> với <code>expires</code> tách xa nhau mãi mãi.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Bitmaps: a million users in 128KB|||3.3 — Bitmap: một triệu người dùng trong 128KB',
      slug: 'rd-3-3-bitmap',
      type: 'LESSON',
      description: 'SETBIT và GETBIT, BITCOUNT với dải bit, BITOP để giao và hợp, đo thật 128KB cho một triệu người dùng, giữ chân theo ngày, và giới hạn khiến bitmap sai lựa chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Bitmaps: a million users in 128KB</h2>
<p class="lead">A bitmap is not a separate type — it is a plain string, addressed one bit at a time. That framing matters, because it means every string command still applies, and it means the memory cost is exactly what you would calculate by hand: one bit per user, 125KB per million.</p>

<h3>The basic operations</h3>
<pre><code>redis-cli SETBIT active:2026-08-22 1042 1
redis-cli SETBIT active:2026-08-22 2091 1
redis-cli SETBIT active:2026-08-22 7 1
redis-cli GETBIT active:2026-08-22 1042
redis-cli GETBIT active:2026-08-22 9999
redis-cli BITCOUNT active:2026-08-22
redis-cli STRLEN active:2026-08-22</code></pre>
<div class="out">(integer) 0
(integer) 0
(integer) 0
(integer) 1
(integer) 0
(integer) 3
(integer) 262</div>
<div class="callout"><strong>262 bytes to record that three specific users were active, because the highest bit set was 2091.</strong> The string is allocated up to the largest offset you touch — setting bit 2091 allocates ⌈2092/8⌉ = 262 bytes, all zero except three bits. That is the whole cost model: <em>memory is proportional to the largest ID, not to the number of set bits</em>, which is the fact that decides whether a bitmap fits your problem.</div>

<h3>The real measurement</h3>
<pre><code><span class="tok-comment"># One million users, every one of them active</span>
python3 -c "
for i in range(1_000_000):
    print(f'SETBIT active:full {i} 1')
" | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN active:full
redis-cli MEMORY USAGE active:full
redis-cli BITCOUNT active:full</code></pre>
<div class="out">(integer) 125000
(integer) 125080
(integer) 1000000</div>
<pre><code><span class="tok-comment"># The same information as a set, for comparison</span>
python3 -c "
for i in range(1_000_000):
    print(f'SADD active:set {i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli MEMORY USAGE active:set
redis-cli SCARD active:set</code></pre>
<div class="out">(integer) 41943160
(integer) 1000000</div>
<div class="callout ok"><strong>125KB versus 42MB — a factor of 335 for exactly the same information.</strong> That is not a micro-optimisation; it is the difference between keeping a year of daily activity in memory (365 × 125KB = 45MB) and not being able to. The catch is in the previous section: this only holds because the IDs are dense and start at zero. A bitmap keyed by a sparse ID space is catastrophically worse than a set.</div>

<h3>Counting, and counting ranges</h3>
<pre><code>redis-cli BITCOUNT active:2026-08-22
redis-cli BITCOUNT active:2026-08-22 0 99          <span class="tok-comment"># bytes 0–99</span>
redis-cli BITCOUNT active:2026-08-22 0 999 BIT     <span class="tok-comment"># 7.0+: BITS 0–999</span>
redis-cli BITPOS active:2026-08-22 1               <span class="tok-comment"># first set bit</span>
redis-cli BITPOS active:2026-08-22 0 100           <span class="tok-comment"># first clear bit from byte 100</span></code></pre>
<div class="out">(integer) 3
(integer) 2
(integer) 2
(integer) 7
(integer) 800</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>BITCOUNT</code> is O(N)</span><span class="v">It walks the whole string — but the constant is tiny because it uses a population-count instruction. Counting a million bits takes microseconds; counting a billion does not.</span></div>
  <div class="kv"><span class="k">Ranges default to BYTES</span><span class="v">A long-standing surprise: <code>BITCOUNT k 0 99</code> means bytes, i.e. bits 0–799. Redis 7.0 added an explicit <code>BIT</code> suffix, and using it removes an easy off-by-eight.</span></div>
  <div class="kv"><span class="k"><code>BITPOS</code> for the first 0 or 1</span><span class="v">Useful for ID allocation: a bitmap of taken slots plus <code>BITPOS k 0</code> gives you the lowest free one in O(N) with a very small constant.</span></div>
  <div class="kv"><span class="k">Negative indices work</span><span class="v"><code>BITCOUNT k -100 -1</code> counts the last hundred bytes, the same convention as <code>GETRANGE</code>.</span></div>
  <div class="kv"><span class="k"><code>BITFIELD</code> for packed integers</span><span class="v">Treats the string as an array of arbitrary-width integers — <code>BITFIELD k INCRBY u8 100 1</code> increments an 8-bit counter at bit offset 100, with configurable overflow behaviour. Niche, and unbeatable when it fits.</span></div>
</div>

<h3>Set operations across days</h3>
<pre><code>redis-cli SETBIT active:2026-08-20 1042 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-21 1042 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-21 2091 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-22 1042 1 &gt;/dev/null

redis-cli BITOP AND retained:3d active:2026-08-20 active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT retained:3d
redis-cli BITOP OR  any:3d active:2026-08-20 active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT any:3d
redis-cli BITOP XOR churn active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT churn</code></pre>
<div class="out">(integer) 262
(integer) 1
(integer) 262
(integer) 2
(integer) 262
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">AND · retention</span><span class="lz-t">"active every day this week"</span><span class="lz-d">Seven <code>BITCOUNT</code>-able answers from seven daily bitmaps, in one command. The classic cohort-retention query, and it is microseconds rather than a table scan.</span></div>
  <div class="lz-step"><span class="lz-k">OR · reach</span><span class="lz-t">"active at least once this month"</span><span class="lz-d">Monthly actives from thirty daily bitmaps, computed on demand and cached. No de-duplication step, because a bit is already unique per user.</span></div>
  <div class="lz-step"><span class="lz-k">XOR · change</span><span class="lz-t">"active on exactly one of these two days"</span><span class="lz-d">Combined with <code>AND</code> and <code>NOT</code> this gives you arrived-today and left-today without touching a database.</span></div>
  <div class="lz-step"><span class="lz-k">The cost</span><span class="lz-t">O(N) on the longest input, and it BLOCKS</span><span class="lz-d">Thirty <code>OR</code>s of a 125KB bitmap is fast; thirty <code>OR</code>s of a 100MB bitmap is a stall (Lesson 1.1). Store the result and compute it on a schedule, not per request.</span></div>
</div>
<pre><code><span class="tok-comment">// Daily active, retention and a rolling 30-day, in eight lines</span>
export const markActive = (userId) =&gt;
  redis.setBit(&#96;active:\${today()}&#96;, userId, 1);

export async function monthlyActive() {
  const days = last30Days().map((d) =&gt; &#96;active:\${d}&#96;);
  await redis.bitOp('OR', 'active:mau', ...days);
  await redis.expire('active:mau', 3600);
  return redis.bitCount('active:mau');
}</code></pre>

<h3>When a bitmap is the wrong choice</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Sparse or non-numeric IDs</span><span class="v">A UUID has no bit offset. An integer ID starting at 1,000,000,000 allocates 125MB to record one user. Bitmaps need dense integers from zero — map your IDs first, or use a set.</span></div>
  <div class="kv"><span class="k">❌ When you need the members back</span><span class="v"><code>BITCOUNT</code> tells you <em>how many</em>; getting <em>who</em> means scanning every bit. A set answers both, at 42× the memory.</span></div>
  <div class="kv"><span class="k">❌ More than one bit of state per user</span><span class="v">Active/inactive is one bit. Active/trial/paid/churned needs <code>BITFIELD</code> with a width, or a different structure entirely.</span></div>
  <div class="kv"><span class="k">✅ Dense IDs, boolean state, count-only queries</span><span class="v">Daily actives, feature flags per user, seen/unseen, A/B group membership. This is a narrow shape and it is extremely common.</span></div>
  <div class="kv"><span class="k">✅ When 42MB versus 125KB decides it</span><span class="v">The ratio is what makes bitmaps worth the constraints. Below a few thousand users, use a set and move on — the memory saving is not worth the ID mapping.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/bitmaps/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Redis bitmaps</span><span class="lc-sub">The full command set with the worked daily-actives example, and the explicit note that a bitmap is a string so every string command applies.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/bitfield/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">BITFIELD</span><span class="lc-sub">Packed integers of arbitrary width inside one string, with <code>WRAP</code>, <code>SAT</code> and <code>FAIL</code> overflow modes. Genuinely useful for dense per-user counters, and almost nobody knows it exists.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build daily actives</span><span class="lc-sub">Graded exercises: measure a bitmap against a set for a million users, compute three-day retention with <code>BITOP AND</code>, and explain why a bitmap keyed by UUID is a mistake.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using a bitmap with sparse or large user IDs. The memory model catches people out because it is the opposite of every other Redis type: cost is driven by the <em>largest</em> offset you ever set, not by how many you set. A single <code>SETBIT active 4000000000 1</code> — an entirely plausible ID from a database sequence or a Snowflake generator — allocates 500MB in one blocking operation to record one user, and it will do it again for every day you keep. Two habits keep you safe: maintain a dense internal index (a Redis <code>HINCRBY</code> counter that assigns each user a sequential bit position on first sight, stored in a hash) and bound the offset explicitly before every <code>SETBIT</code> so that a bad ID fails loudly instead of allocating half a gigabyte. If your IDs are UUIDs, a bitmap is simply the wrong structure — use a set, or a HyperLogLog if you only need the count.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A bitmap is a plain string addressed by bit, and a million dense user IDs cost 125KB versus 42MB for a set — a factor of 335. Memory is driven by the <em>largest</em> offset you set, not the number of bits, so sparse or huge IDs make it catastrophically worse than a set. And <code>BITOP AND</code>/<code>OR</code>/<code>XOR</code> across daily bitmaps gives you retention, monthly actives and churn in one command each — but they are O(N) and blocking, so compute them on a schedule rather than per request.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Bitmap: một triệu người dùng trong 128KB</h2>
<p class="lead">Bitmap KHÔNG phải một kiểu riêng — nó là một chuỗi thường, được địa chỉ hoá theo từng bit. Cách nhìn đó quan trọng, vì nó nghĩa là mọi câu lệnh chuỗi vẫn áp dụng được, và nó nghĩa là chi phí bộ nhớ đúng bằng thứ bạn tự tính ra được: một bit cho một người dùng, 125KB cho một triệu.</p>

<h3>Các thao tác cơ bản</h3>
<pre><code>redis-cli SETBIT active:2026-08-22 1042 1
redis-cli SETBIT active:2026-08-22 2091 1
redis-cli SETBIT active:2026-08-22 7 1
redis-cli GETBIT active:2026-08-22 1042
redis-cli GETBIT active:2026-08-22 9999
redis-cli BITCOUNT active:2026-08-22
redis-cli STRLEN active:2026-08-22</code></pre>
<div class="out">(integer) 0
(integer) 0
(integer) 0
(integer) 1
(integer) 0
(integer) 3
(integer) 262</div>
<div class="callout"><strong>262 byte để ghi lại rằng BA người dùng cụ thể đã hoạt động, bởi vì bit cao nhất được bật là 2091.</strong> Chuỗi được cấp phát tới tận vị trí lớn nhất bạn chạm vào — đặt bit 2091 sẽ cấp phát ⌈2092/8⌉ = 262 byte, toàn số 0 trừ ba bit. Đó là toàn bộ mô hình chi phí: <em>bộ nhớ tỷ lệ với ID LỚN NHẤT, không tỷ lệ với số bit được bật</em>, và đó là sự thật quyết định xem bitmap có hợp với bài toán của bạn không.</div>

<h3>Con số đo thật</h3>
<pre><code><span class="tok-comment"># Một triệu người dùng, tất cả đều hoạt động</span>
python3 -c "
for i in range(1_000_000):
    print(f'SETBIT active:full {i} 1')
" | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN active:full
redis-cli MEMORY USAGE active:full
redis-cli BITCOUNT active:full</code></pre>
<div class="out">(integer) 125000
(integer) 125080
(integer) 1000000</div>
<pre><code><span class="tok-comment"># Cũng thông tin đó nhưng lưu bằng một cái set, để so sánh</span>
python3 -c "
for i in range(1_000_000):
    print(f'SADD active:set {i}')
" | redis-cli --pipe &gt;/dev/null
redis-cli MEMORY USAGE active:set
redis-cli SCARD active:set</code></pre>
<div class="out">(integer) 41943160
(integer) 1000000</div>
<div class="callout ok"><strong>125KB so với 42MB — chênh 335 lần cho đúng cùng một thông tin.</strong> Đó không phải một phép tối ưu vặt; đó là khác biệt giữa việc giữ được cả một năm hoạt động theo ngày trong bộ nhớ (365 × 125KB = 45MB) và việc không giữ nổi. Cái điều kiện đi kèm nằm ở phần trước: chuyện này chỉ đúng vì các ID DÀY ĐẶC và bắt đầu từ 0. Một bitmap đánh khoá theo một không gian ID thưa thớt thì tệ hơn một cái set một cách thảm hoạ.</div>

<h3>Đếm, và đếm theo dải</h3>
<pre><code>redis-cli BITCOUNT active:2026-08-22
redis-cli BITCOUNT active:2026-08-22 0 99          <span class="tok-comment"># byte 0–99</span>
redis-cli BITCOUNT active:2026-08-22 0 999 BIT     <span class="tok-comment"># 7.0+: BIT 0–999</span>
redis-cli BITPOS active:2026-08-22 1               <span class="tok-comment"># bit 1 đầu tiên</span>
redis-cli BITPOS active:2026-08-22 0 100           <span class="tok-comment"># bit 0 đầu tiên tính từ byte 100</span></code></pre>
<div class="out">(integer) 3
(integer) 2
(integer) 2
(integer) 7
(integer) 800</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>BITCOUNT</code> là O(N)</span><span class="v">Nó đi hết cả chuỗi — nhưng hằng số rất nhỏ vì nó dùng một chỉ thị đếm bit của bộ xử lý. Đếm một triệu bit tốn vài micro giây; đếm một tỷ bit thì không.</span></div>
  <div class="kv"><span class="k">Dải mặc định tính theo BYTE</span><span class="v">Một bất ngờ tồn tại từ lâu: <code>BITCOUNT k 0 99</code> nghĩa là BYTE, tức bit 0–799. Redis 7.0 thêm hậu tố <code>BIT</code> tường minh, và dùng nó là gỡ được một lỗi lệch-tám dễ mắc.</span></div>
  <div class="kv"><span class="k"><code>BITPOS</code> tìm bit 0 hoặc 1 đầu tiên</span><span class="v">Hữu ích để cấp phát ID: một bitmap các chỗ đã lấy cộng <code>BITPOS k 0</code> cho bạn chỗ trống thấp nhất trong O(N) với hằng số rất nhỏ.</span></div>
  <div class="kv"><span class="k">Chỉ số âm dùng được</span><span class="v"><code>BITCOUNT k -100 -1</code> đếm một trăm byte cuối, cùng quy ước với <code>GETRANGE</code>.</span></div>
  <div class="kv"><span class="k"><code>BITFIELD</code> cho số nguyên đóng gói</span><span class="v">Coi chuỗi như một mảng các số nguyên độ rộng tuỳ ý — <code>BITFIELD k INCRBY u8 100 1</code> tăng một bộ đếm 8 bit ở vị trí bit 100, với hành vi tràn cấu hình được. Ngách, và không thứ gì thắng nổi khi nó vừa vặn.</span></div>
</div>

<h3>Phép toán tập hợp qua nhiều ngày</h3>
<pre><code>redis-cli SETBIT active:2026-08-20 1042 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-21 1042 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-21 2091 1 &gt;/dev/null
redis-cli SETBIT active:2026-08-22 1042 1 &gt;/dev/null

redis-cli BITOP AND retained:3d active:2026-08-20 active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT retained:3d
redis-cli BITOP OR  any:3d active:2026-08-20 active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT any:3d
redis-cli BITOP XOR churn active:2026-08-21 active:2026-08-22
redis-cli BITCOUNT churn</code></pre>
<div class="out">(integer) 262
(integer) 1
(integer) 262
(integer) 2
(integer) 262
(integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">AND · giữ chân</span><span class="lz-t">"hoạt động MỌI ngày trong tuần này"</span><span class="lz-d">Bảy câu trả lời <code>BITCOUNT</code> được từ bảy bitmap theo ngày, trong MỘT câu lệnh. Truy vấn giữ chân theo nhóm kinh điển, và nó tốn vài micro giây chứ không phải một lượt quét bảng.</span></div>
  <div class="lz-step"><span class="lz-k">OR · độ phủ</span><span class="lz-t">"hoạt động ít nhất một lần trong tháng"</span><span class="lz-d">Người dùng hoạt động hằng tháng từ ba mươi bitmap ngày, tính khi cần rồi cache lại. Không có bước khử trùng lặp, vì một bit vốn đã là duy nhất cho mỗi người dùng.</span></div>
  <div class="lz-step"><span class="lz-k">XOR · thay đổi</span><span class="lz-t">"hoạt động ĐÚNG một trong hai ngày này"</span><span class="lz-d">Ghép với <code>AND</code> và <code>NOT</code> là bạn có được ai mới đến hôm nay và ai vừa rời đi mà không phải chạm vào cơ sở dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">Cái giá</span><span class="lz-t">O(N) theo đầu vào dài nhất, và nó CHẶN</span><span class="lz-d">Ba mươi phép <code>OR</code> trên bitmap 125KB thì nhanh; ba mươi phép <code>OR</code> trên bitmap 100MB là một cú đứng hình (Bài 1.1). Hãy lưu kết quả lại và tính theo lịch, đừng tính theo từng request.</span></div>
</div>
<pre><code><span class="tok-comment">// Hoạt động theo ngày, giữ chân và cửa sổ trượt 30 ngày, trong tám dòng</span>
export const markActive = (userId) =&gt;
  redis.setBit(&#96;active:\${today()}&#96;, userId, 1);

export async function monthlyActive() {
  const days = last30Days().map((d) =&gt; &#96;active:\${d}&#96;);
  await redis.bitOp('OR', 'active:mau', ...days);
  await redis.expire('active:mau', 3600);
  return redis.bitCount('active:mau');
}</code></pre>

<h3>Khi nào bitmap là lựa chọn SAI</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ ID thưa thớt hoặc không phải số</span><span class="v">Một UUID không có vị trí bit nào cả. Một ID số nguyên bắt đầu từ 1.000.000.000 sẽ cấp phát 125MB để ghi lại MỘT người dùng. Bitmap cần số nguyên dày đặc bắt đầu từ 0 — hãy ánh xạ ID của bạn trước, hoặc dùng một cái set.</span></div>
  <div class="kv"><span class="k">❌ Khi bạn cần lấy lại DANH SÁCH thành viên</span><span class="v"><code>BITCOUNT</code> cho bạn biết <em>BAO NHIÊU</em>; muốn biết <em>AI</em> thì phải quét từng bit. Một cái set trả lời được cả hai, với 42 lần bộ nhớ.</span></div>
  <div class="kv"><span class="k">❌ Nhiều hơn một bit trạng thái cho mỗi người dùng</span><span class="v">Hoạt động/không hoạt động là một bit. Hoạt động/dùng thử/trả tiền/đã rời cần <code>BITFIELD</code> với một độ rộng, hoặc một cấu trúc hoàn toàn khác.</span></div>
  <div class="kv"><span class="k">✅ ID dày đặc, trạng thái luận lý, truy vấn chỉ cần ĐẾM</span><span class="v">Hoạt động theo ngày, cờ tính năng cho từng người dùng, đã xem/chưa xem, thuộc nhóm A/B nào. Đây là một hình dạng hẹp và nó cực kỳ phổ biến.</span></div>
  <div class="kv"><span class="k">✅ Khi 42MB so với 125KB là thứ quyết định</span><span class="v">Chính cái tỷ lệ đó khiến bitmap đáng để chịu các ràng buộc. Dưới vài nghìn người dùng thì cứ dùng set rồi đi tiếp — phần tiết kiệm bộ nhớ không bõ công ánh xạ ID.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/bitmaps/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Bitmap trong Redis</span><span class="lc-sub">Bộ câu lệnh đầy đủ với ví dụ hoạt-động-theo-ngày đã làm sẵn, và ghi chú tường minh rằng bitmap LÀ một chuỗi nên mọi câu lệnh chuỗi đều áp dụng được.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/bitfield/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">BITFIELD</span><span class="lc-sub">Số nguyên đóng gói với độ rộng tuỳ ý bên trong một chuỗi, kèm các chế độ tràn <code>WRAP</code>, <code>SAT</code> và <code>FAIL</code>. Thật sự hữu ích cho bộ đếm dày đặc theo người dùng, và gần như không ai biết nó tồn tại.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng bảng hoạt động theo ngày</span><span class="lc-sub">Bài chấm điểm: đo một bitmap so với một set cho một triệu người dùng, tính giữ chân ba ngày bằng <code>BITOP AND</code>, và giải thích vì sao một bitmap đánh khoá theo UUID là sai lầm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng bitmap với ID người dùng thưa thớt hoặc lớn. Mô hình bộ nhớ làm người ta vấp vì nó NGƯỢC với mọi kiểu dữ liệu khác của Redis: chi phí bị chi phối bởi vị trí LỚN NHẤT bạn từng đặt, không phải bởi số lượng bạn đặt. Một lệnh <code>SETBIT active 4000000000 1</code> duy nhất — một ID hoàn toàn hợp lý từ một chuỗi số của cơ sở dữ liệu hay một bộ sinh Snowflake — sẽ cấp phát 500MB trong MỘT thao tác gây chặn để ghi lại MỘT người dùng, và nó sẽ làm lại chuyện đó ở mỗi ngày bạn giữ. Hai thói quen giữ bạn an toàn: duy trì một chỉ mục nội bộ dày đặc (một bộ đếm <code>HINCRBY</code> của Redis gán cho mỗi người dùng một vị trí bit tuần tự ở lần đầu nhìn thấy, cất trong một hash) và chặn giới hạn vị trí một cách tường minh trước MỌI lệnh <code>SETBIT</code> để một ID xấu hỏng TO TIẾNG thay vì cấp phát nửa gigabyte. Nếu ID của bạn là UUID thì bitmap đơn giản là cấu trúc SAI — hãy dùng một cái set, hoặc một HyperLogLog nếu bạn chỉ cần con số đếm.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Bitmap là một chuỗi thường được địa chỉ hoá theo bit, và một triệu ID người dùng dày đặc tốn 125KB so với 42MB của một cái set — chênh 335 lần. Bộ nhớ bị chi phối bởi vị trí LỚN NHẤT bạn đặt chứ không phải số bit, nên ID thưa thớt hay khổng lồ khiến nó tệ hơn một cái set một cách thảm hoạ. Và <code>BITOP AND</code>/<code>OR</code>/<code>XOR</code> qua các bitmap theo ngày cho bạn giữ chân, người dùng hằng tháng và tỷ lệ rời bỏ, mỗi thứ một câu lệnh — nhưng chúng là O(N) và có tính chặn, nên hãy tính theo lịch chứ đừng tính theo từng request.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — HyperLogLog: a billion uniques in 12KB|||3.4 — HyperLogLog: một tỷ mục duy nhất trong 12KB',
      slug: 'rd-3-4-hyperloglog',
      type: 'LESSON',
      description: 'Ý tưởng đằng sau HyperLogLog nói cho người không học toán, ba câu lệnh, đo thật sai số 0,81%, hợp nhất qua nhiều ngày, mã hoá thưa với dày, và khi nào sai số là không chấp nhận được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>HyperLogLog: a billion uniques in 12KB</h2>
<p class="lead">Counting distinct things normally costs memory proportional to how many distinct things there are — a set of a million IDs is 42MB. HyperLogLog counts them in a fixed 12KB regardless of whether you add a thousand items or a billion, with about 0.81% error. It is the closest thing in Redis to magic, and the idea behind it is genuinely simple.</p>

<h3>The intuition, without the mathematics</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Hash each item</span><span class="lz-t">the same item always hashes the same way</span><span class="lz-d">This is why duplicates cost nothing: adding the same user twice produces the same hash and changes nothing. No membership list is kept.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Count leading zeros</span><span class="lz-t">a random hash starts with k zeros with probability 1/2ᵏ</span><span class="lz-d">Seeing a hash that starts with 10 zeros is a one-in-1024 event — so if you have seen one, you have probably seen about 1024 distinct items.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Keep only the maximum</span><span class="lz-t">one small number, not the items</span><span class="lz-d">The entire "memory" of a billion items is the longest run of leading zeros you have observed. That is why the size is constant.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Average over 16,384 buckets</span><span class="lz-t">one estimate is noisy; 16,384 are not</span><span class="lz-d">Split the hash: some bits pick a bucket, the rest are counted. Averaging the buckets harmonically gives the 0.81% standard error — and 16,384 buckets × 6 bits is the 12KB.</span></div>
</div>

<h3>Three commands, and that is all of it</h3>
<pre><code>redis-cli PFADD visitors:2026-08-22 user:1042 user:2091 user:1042
redis-cli PFCOUNT visitors:2026-08-22
redis-cli PFADD visitors:2026-08-21 user:1042 user:7788
redis-cli PFMERGE visitors:2days visitors:2026-08-22 visitors:2026-08-21
redis-cli PFCOUNT visitors:2days
redis-cli PFCOUNT visitors:2026-08-22 visitors:2026-08-21   <span class="tok-comment"># merge on the fly</span></code></pre>
<div class="out">(integer) 1
(integer) 2
(integer) 1
OK
(integer) 3
(integer) 3</div>
<div class="callout ok"><strong><code>user:1042</code> was added on both days and counted once in the union.</strong> That is the property that makes HyperLogLog worth having: unions deduplicate correctly across any number of sets, which is exactly the operation that is expensive with real sets and impossible with plain counters. <code>PFCOUNT</code> with several keys computes the union without storing it.</div>

<h3>The measurement: how wrong is it?</h3>
<pre><code>redis-cli DEL hll s &gt;/dev/null
python3 -c "
for i in range(1_000_000):
    print(f'PFADD hll u:{i}')
    print(f'SADD  s   u:{i}')
" | redis-cli --pipe &gt;/dev/null

redis-cli PFCOUNT hll; redis-cli SCARD s
redis-cli MEMORY USAGE hll; redis-cli MEMORY USAGE s
redis-cli STRLEN hll</code></pre>
<div class="out">(integer) 1004128
(integer) 1000000
(integer) 12352
(integer) 41943160
(integer) 12304</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1,004,128 versus 1,000,000</span><span class="v">0.41% high — comfortably inside the 0.81% standard error. Run it again with different data and it will be wrong by a different amount, in a different direction.</span></div>
  <div class="kv"><span class="k">12KB versus 42MB</span><span class="v">A factor of 3,400. And unlike the bitmap in Lesson 3.3, this holds for <em>any</em> item — UUIDs, emails, URLs, IP addresses. There is no ID density requirement because everything is hashed.</span></div>
  <div class="kv"><span class="k">The error does not grow</span><span class="v">0.81% at a thousand items and 0.81% at a billion. The absolute error grows; the relative error does not. That is the whole point.</span></div>
  <div class="kv"><span class="k">Small cardinalities are exact-ish</span><span class="v">Below a few hundred, Redis uses a sparse encoding and a different estimator, and the count is usually exactly right. The error is a large-N property.</span></div>
  <div class="kv"><span class="k">It is deterministic</span><span class="v">The same items in any order give the same count, always. "Approximate" does not mean "random" — it means biased in a way you can bound.</span></div>
</div>

<h3>Sparse and dense encodings</h3>
<pre><code>redis-cli DEL h &gt;/dev/null
redis-cli PFADD h a b c &gt;/dev/null; redis-cli STRLEN h; redis-cli MEMORY USAGE h
for i in $(seq 1 200); do echo "PFADD h item:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN h
for i in $(seq 1 5000); do echo "PFADD h item:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN h; redis-cli PFCOUNT h
redis-cli CONFIG GET hll-sparse-max-bytes</code></pre>
<div class="out">(integer) 26
(integer) 72
(integer) 202
(integer) 12304
(integer) 5019
1) "hll-sparse-max-bytes"
2) "3000"</div>
<p>A HyperLogLog with three items is 26 bytes, not 12KB. Redis starts with a sparse run-length encoding and converts to the dense 12,304-byte form once the sparse representation exceeds <code>hll-sparse-max-bytes</code>. So a million <em>separate</em> HyperLogLogs, most of them nearly empty, is not a million × 12KB — which makes per-page or per-article unique counters entirely practical.</p>

<h3>The pattern it is built for</h3>
<pre><code><span class="tok-comment">// Unique visitors per page per day, then any rollup you like</span>
export const seen = (page, userId) =&gt;
  redis.pfAdd(&#96;uv:\${page}:\${today()}&#96;, userId);

export const uniquesToday = (page) =&gt;
  redis.pfCount(&#96;uv:\${page}:\${today()}&#96;);

export const uniquesThisMonth = (page) =&gt;
  redis.pfCount(last30Days().map((d) =&gt; &#96;uv:\${page}:\${d}&#96;));

export const uniquesAcrossSite = (pages) =&gt;
  redis.pfCount(pages.map((p) =&gt; &#96;uv:\${p}:\${today()}&#96;));</code></pre>
<div class="out">monthly uniques for /blog: 184219  (12KB × 30 keys = 360KB total)
sitewide uniques today:    412884  (union of 1,284 page HLLs, 41ms)</div>
<div class="callout"><strong>Any rollup is a union, and a union is free.</strong> Daily, weekly, monthly, per-page, sitewide, per-country — all of them are <code>PFCOUNT</code> over a list of keys, with no pre-aggregation and no separate counters to keep in sync. Doing the same thing with sets means storing every user ID in every bucket you might ever want to query, which is where the 42MB becomes 42MB × the number of dimensions.</div>

<h3>When the error is unacceptable</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Anything anyone bills on</span><span class="v">"You had 1,004,128 unique visitors" when the real number is 1,000,000 is fine for a dashboard and fraud for an invoice. Approximate counting and money do not mix.</span></div>
  <div class="kv"><span class="k">❌ Small numbers people will check</span><span class="v">A count of 47 that displays as 47 is fine — but you cannot promise that, and the first time it shows 46 next to a list of 47 names, trust is gone.</span></div>
  <div class="kv"><span class="k">❌ When you need membership</span><span class="v">There is no <code>PFISMEMBER</code>, and there never will be — the structure does not store members. If you need "has this user seen it?", you need a set or a bitmap.</span></div>
  <div class="kv"><span class="k">❌ When you need to remove</span><span class="v">No delete. A HyperLogLog only grows. Use daily keys with TTLs and union them, rather than one long-lived key you wish you could prune.</span></div>
  <div class="kv"><span class="k">✅ Analytics at scale</span><span class="v">Unique visitors, unique searches, distinct IPs, reach. Anything where "about 1.2 million" is the right answer and 42MB per dimension is not.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Redis HyperLogLog</span><span class="lc-sub">The three commands, the error bound, and the note that a HLL is a string — so you can <code>GET</code> it, ship it elsewhere and <code>SET</code> it back.</span></span>
</a>
<a class="link-card" href="http://antirez.com/news/75" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">antirez — Redis new data structure: the HyperLogLog</span><span class="lc-sub">The announcement post, and the clearest explanation of the intuition and the sparse encoding by the person who implemented it. Worth reading even if you never use it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: count uniques</span><span class="lc-sub">Graded exercises: measure a HyperLogLog against a set at a million items, build per-page daily uniques with monthly rollups, and decide between HLL, set and bitmap for five scenarios.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using a HyperLogLog for a number that will be displayed next to a list. Unique viewers on a video, distinct participants in a room, members who reacted to a post — all of them are tempting HLL cases because the count is what you show, and all of them break the moment somebody expands the list. The count says 46, the list has 47 names, and now every number on the page is suspect. The rule is about who consumes the number rather than how large it is: if a human will ever compare it against something enumerable, or if it appears on an invoice, it must be exact — a set, or a database <code>COUNT DISTINCT</code>. HyperLogLog belongs where the number is the <em>only</em> artefact and nobody can check it against a list: unique visitors, distinct search terms, reach across a campaign. If you are unsure, ask whether being 0.8% wrong would ever be noticed. If the answer is "yes, by one person, once", use a set.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A HyperLogLog counts distinct items in a fixed 12KB with about 0.81% relative error, regardless of whether you add a thousand or a billion — 3,400× smaller than the equivalent set, and it works with any item because everything is hashed. <code>PFCOUNT</code> over several keys computes the union for free, which makes daily/weekly/monthly/per-page rollups a single command with no pre-aggregation. And there is no membership test and no delete: it is for numbers nobody can check against a list.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>HyperLogLog: một tỷ mục duy nhất trong 12KB</h2>
<p class="lead">Đếm số thứ KHÁC NHAU bình thường tốn bộ nhớ tỷ lệ với số thứ khác nhau đó — một cái set chứa một triệu ID là 42MB. HyperLogLog đếm chúng trong 12KB CỐ ĐỊNH bất kể bạn thêm một nghìn mục hay một tỷ mục, với sai số khoảng 0,81%. Đó là thứ gần với phép màu nhất trong Redis, và ý tưởng đằng sau nó thật sự đơn giản.</p>

<h3>Trực giác, không cần toán</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Băm mỗi mục</span><span class="lz-t">cùng một mục luôn băm ra cùng một kết quả</span><span class="lz-d">Đây là lý do trùng lặp không tốn gì: thêm cùng một người dùng hai lần cho ra cùng một mã băm và chẳng đổi gì. Không có danh sách thành viên nào được giữ.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đếm số bit 0 ở đầu</span><span class="lz-t">một mã băm ngẫu nhiên bắt đầu bằng k số 0 với xác suất 1/2ᵏ</span><span class="lz-d">Thấy một mã băm bắt đầu bằng 10 số 0 là một sự kiện một-trên-1024 — nên nếu bạn đã thấy một cái như vậy thì bạn nhiều khả năng đã thấy khoảng 1024 mục khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Chỉ giữ giá trị LỚN NHẤT</span><span class="lz-t">một con số nhỏ, không phải các mục</span><span class="lz-d">Toàn bộ "ký ức" về một tỷ mục là chuỗi số 0 ở đầu DÀI NHẤT mà bạn từng quan sát được. Đó là lý do kích thước là hằng số.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Lấy trung bình trên 16.384 ô</span><span class="lz-t">một ước lượng thì nhiễu; 16.384 cái thì không</span><span class="lz-d">Chia mã băm ra: vài bit chọn một cái ô, phần còn lại được đếm. Lấy trung bình điều hoà các ô cho ra sai số chuẩn 0,81% — và 16.384 ô × 6 bit chính là 12KB.</span></div>
</div>

<h3>Ba câu lệnh, và chỉ có thế</h3>
<pre><code>redis-cli PFADD visitors:2026-08-22 user:1042 user:2091 user:1042
redis-cli PFCOUNT visitors:2026-08-22
redis-cli PFADD visitors:2026-08-21 user:1042 user:7788
redis-cli PFMERGE visitors:2days visitors:2026-08-22 visitors:2026-08-21
redis-cli PFCOUNT visitors:2days
redis-cli PFCOUNT visitors:2026-08-22 visitors:2026-08-21   <span class="tok-comment"># hợp nhất ngay tại chỗ</span></code></pre>
<div class="out">(integer) 1
(integer) 2
(integer) 1
OK
(integer) 3
(integer) 3</div>
<div class="callout ok"><strong><code>user:1042</code> được thêm ở cả hai ngày và chỉ được đếm MỘT lần trong phép hợp.</strong> Đó chính là tính chất khiến HyperLogLog đáng có: phép hợp khử trùng lặp ĐÚNG qua bao nhiêu tập hợp cũng được, và đó đúng là thao tác tốn kém với set thật và bất khả với bộ đếm thường. <code>PFCOUNT</code> với nhiều khoá tính phép hợp mà không phải lưu nó lại.</div>

<h3>Đo thật: nó sai bao nhiêu?</h3>
<pre><code>redis-cli DEL hll s &gt;/dev/null
python3 -c "
for i in range(1_000_000):
    print(f'PFADD hll u:{i}')
    print(f'SADD  s   u:{i}')
" | redis-cli --pipe &gt;/dev/null

redis-cli PFCOUNT hll; redis-cli SCARD s
redis-cli MEMORY USAGE hll; redis-cli MEMORY USAGE s
redis-cli STRLEN hll</code></pre>
<div class="out">(integer) 1004128
(integer) 1000000
(integer) 12352
(integer) 41943160
(integer) 12304</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1.004.128 so với 1.000.000</span><span class="v">Cao hơn 0,41% — nằm gọn trong sai số chuẩn 0,81%. Chạy lại với dữ liệu khác thì nó sẽ sai một lượng khác, theo một hướng khác.</span></div>
  <div class="kv"><span class="k">12KB so với 42MB</span><span class="v">Chênh 3.400 lần. Và khác với bitmap ở Bài 3.3, chuyện này đúng với <em>MỌI</em> loại mục — UUID, email, URL, địa chỉ IP. Không có yêu cầu nào về mật độ ID vì mọi thứ đều được băm.</span></div>
  <div class="kv"><span class="k">Sai số KHÔNG tăng lên</span><span class="v">0,81% ở một nghìn mục và 0,81% ở một tỷ mục. Sai số TUYỆT ĐỐI thì tăng; sai số TƯƠNG ĐỐI thì không. Đó là toàn bộ điểm mấu chốt.</span></div>
  <div class="kv"><span class="k">Số lượng nhỏ thì gần như chính xác</span><span class="v">Dưới vài trăm, Redis dùng một cách mã hoá THƯA và một bộ ước lượng khác, và con số thường đúng chính xác. Sai số là một tính chất của N lớn.</span></div>
  <div class="kv"><span class="k">Nó có tính tất định</span><span class="v">Cùng những mục đó theo thứ tự bất kỳ đều cho cùng một con số, luôn luôn. "Xấp xỉ" không có nghĩa là "ngẫu nhiên" — nó có nghĩa là lệch theo một cách mà bạn chặn được cận.</span></div>
</div>

<h3>Mã hoá thưa và mã hoá dày</h3>
<pre><code>redis-cli DEL h &gt;/dev/null
redis-cli PFADD h a b c &gt;/dev/null; redis-cli STRLEN h; redis-cli MEMORY USAGE h
for i in $(seq 1 200); do echo "PFADD h item:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN h
for i in $(seq 1 5000); do echo "PFADD h item:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli STRLEN h; redis-cli PFCOUNT h
redis-cli CONFIG GET hll-sparse-max-bytes</code></pre>
<div class="out">(integer) 26
(integer) 72
(integer) 202
(integer) 12304
(integer) 5019
1) "hll-sparse-max-bytes"
2) "3000"</div>
<p>Một HyperLogLog chứa ba mục là 26 byte, không phải 12KB. Redis khởi đầu bằng một cách mã hoá thưa theo độ dài lặp rồi chuyển sang dạng dày 12.304 byte một khi biểu diễn thưa vượt <code>hll-sparse-max-bytes</code>. Nên một triệu HyperLogLog RIÊNG BIỆT, phần lớn gần như rỗng, KHÔNG phải là một triệu × 12KB — và điều đó khiến bộ đếm duy nhất theo từng trang hay từng bài viết hoàn toàn khả thi.</p>

<h3>Cái mẫu mà nó được sinh ra để phục vụ</h3>
<pre><code><span class="tok-comment">// Khách truy cập duy nhất theo trang theo ngày, rồi gộp kiểu gì tuỳ bạn</span>
export const seen = (page, userId) =&gt;
  redis.pfAdd(&#96;uv:\${page}:\${today()}&#96;, userId);

export const uniquesToday = (page) =&gt;
  redis.pfCount(&#96;uv:\${page}:\${today()}&#96;);

export const uniquesThisMonth = (page) =&gt;
  redis.pfCount(last30Days().map((d) =&gt; &#96;uv:\${page}:\${d}&#96;));

export const uniquesAcrossSite = (pages) =&gt;
  redis.pfCount(pages.map((p) =&gt; &#96;uv:\${p}:\${today()}&#96;));</code></pre>
<div class="out">monthly uniques for /blog: 184219  (12KB × 30 keys = 360KB total)
sitewide uniques today:    412884  (union of 1,284 page HLLs, 41ms)</div>
<div class="callout"><strong>Mọi phép gộp đều là một phép HỢP, và phép hợp thì miễn phí.</strong> Theo ngày, theo tuần, theo tháng, theo trang, toàn trang web, theo quốc gia — tất cả đều là một lệnh <code>PFCOUNT</code> trên một danh sách khoá, không cần gộp trước và không có bộ đếm riêng nào phải giữ đồng bộ. Làm cùng chuyện đó bằng set nghĩa là lưu MỌI ID người dùng trong MỌI ô mà bạn có thể sẽ muốn truy vấn, và đó là chỗ 42MB trở thành 42MB × số chiều.</div>

<h3>Khi sai số là không chấp nhận được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Bất cứ thứ gì có người xuất hoá đơn dựa trên nó</span><span class="v">"Bạn có 1.004.128 khách truy cập duy nhất" trong khi con số thật là 1.000.000 thì ổn cho một bảng điều khiển và là gian lận trên một hoá đơn. Đếm xấp xỉ và tiền bạc không đi chung với nhau.</span></div>
  <div class="kv"><span class="k">❌ Những con số nhỏ mà người ta sẽ kiểm lại</span><span class="v">Một con số 47 hiện ra là 47 thì ổn — nhưng bạn không hứa được điều đó, và lần đầu tiên nó hiện 46 bên cạnh một danh sách 47 cái tên thì niềm tin đi mất.</span></div>
  <div class="kv"><span class="k">❌ Khi bạn cần kiểm THÀNH VIÊN</span><span class="v">Không có <code>PFISMEMBER</code>, và sẽ không bao giờ có — cấu trúc này không lưu thành viên. Nếu bạn cần "người dùng này đã xem chưa?" thì bạn cần một set hoặc một bitmap.</span></div>
  <div class="kv"><span class="k">❌ Khi bạn cần XOÁ BỚT</span><span class="v">Không có phép xoá. Một HyperLogLog chỉ có LỚN LÊN. Hãy dùng khoá theo ngày kèm TTL rồi hợp chúng lại, thay vì một khoá sống lâu mà bạn ước gì tỉa bớt được.</span></div>
  <div class="kv"><span class="k">✅ Phân tích ở quy mô lớn</span><span class="v">Khách truy cập duy nhất, lượt tìm kiếm duy nhất, số IP khác nhau, độ phủ. Mọi thứ mà "khoảng 1,2 triệu" là câu trả lời đúng và 42MB cho mỗi chiều thì không.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">HyperLogLog trong Redis</span><span class="lc-sub">Ba câu lệnh, cận sai số, và ghi chú rằng một HLL LÀ một chuỗi — nên bạn <code>GET</code> nó được, chuyển đi nơi khác rồi <code>SET</code> ngược lại.</span></span>
</a>
<a class="link-card" href="http://antirez.com/news/75" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">antirez — Cấu trúc dữ liệu mới của Redis: HyperLogLog</span><span class="lc-sub">Bài công bố, và là giải thích rõ nhất về trực giác cùng cách mã hoá thưa, do chính người cài đặt nó viết. Đáng đọc kể cả khi bạn không bao giờ dùng nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đếm mục duy nhất</span><span class="lc-sub">Bài chấm điểm: đo một HyperLogLog so với một set ở mức một triệu mục, dựng bộ đếm duy nhất theo trang theo ngày kèm gộp theo tháng, và chọn giữa HLL, set và bitmap cho năm tình huống.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng HyperLogLog cho một con số sẽ được hiển thị NGAY CẠNH một danh sách. Số người xem duy nhất một video, số người tham gia khác nhau trong một phòng, số thành viên đã thả cảm xúc vào một bài viết — tất cả đều là những trường hợp HLL nghe rất hấp dẫn vì con số chính là thứ bạn hiển thị, và tất cả đều vỡ ngay khoảnh khắc có ai đó bung cái danh sách ra. Con số nói 46, danh sách có 47 cái tên, và giờ mọi con số trên trang đều đáng ngờ. Cái luật nằm ở chỗ AI tiêu thụ con số đó chứ không nằm ở việc nó lớn cỡ nào: nếu có lúc nào đó một con người sẽ so nó với một thứ đếm được, hoặc nếu nó xuất hiện trên một hoá đơn, thì nó phải CHÍNH XÁC — một cái set, hoặc một lệnh <code>COUNT DISTINCT</code> trong cơ sở dữ liệu. HyperLogLog thuộc về những chỗ mà con số là hiện vật DUY NHẤT và không ai đối chiếu nó với một danh sách được: khách truy cập duy nhất, từ khoá tìm kiếm khác nhau, độ phủ của một chiến dịch. Nếu bạn không chắc, hãy tự hỏi liệu việc sai 0,8% có bao giờ bị phát hiện không. Nếu câu trả lời là "có, bởi một người, một lần", hãy dùng set.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một HyperLogLog đếm số mục khác nhau trong 12KB cố định với sai số tương đối khoảng 0,81%, bất kể bạn thêm một nghìn hay một tỷ — nhỏ hơn cái set tương đương 3.400 lần, và nó chạy với mọi loại mục vì mọi thứ đều được băm. <code>PFCOUNT</code> trên nhiều khoá tính phép hợp miễn phí, và điều đó biến việc gộp theo ngày/tuần/tháng/trang thành MỘT câu lệnh mà không cần gộp trước. Và nó không có phép kiểm thành viên và không có phép xoá: nó dành cho những con số mà không ai đối chiếu được với một danh sách.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Rate limiting, four ways|||3.5 — Giới hạn tần suất, bốn cách',
      slug: 'rd-3-5-gioi-han-tan-suat',
      type: 'LESSON',
      description: 'Bốn thuật toán từ đơn giản tới đúng: cửa sổ cố định, cửa sổ trượt xấp xỉ, cửa sổ trượt bằng log, và gáo token; cái bẫy ranh giới cửa sổ, và chọn khoá cho đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Rate limiting, four ways</h2>
<p class="lead">Rate limiting is the archetypal Redis problem: it needs to be atomic, fast, shared across every instance of your application, and it needs to forget old data on its own. Four algorithms are worth knowing, and they trade accuracy against cost in a way that makes the choice genuinely situational.</p>

<h3>1 · Fixed window — two commands, one flaw</h3>
<pre><code><span class="tok-comment">// Simplest possible: a counter per window, with a TTL</span>
export async function fixedWindow(id, limit = 100, windowSec = 60) {
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const key = &#96;rl:\${id}:\${bucket}&#96;;
  const p = redis.multi();
  p.incr(key);
  p.expire(key, windowSec, 'NX');
  const [count] = await p.exec();
  return { allowed: count &lt;= limit, count, resetIn: windowSec };
}</code></pre>
<pre><code>for i in $(seq 1 5); do redis-cli INCR "rl:ip1:29783364"; done
redis-cli TTL "rl:ip1:29783364"</code></pre>
<div class="out">(integer) 1
(integer) 2
(integer) 3
(integer) 4
(integer) 5
(integer) 55</div>
<div class="callout warn"><strong>The boundary problem: a limit of 100 per minute allows 200 requests in two seconds.</strong> A client sends 100 at 11:59:59 and 100 more at 12:00:01 — two different windows, both within their limit, and your backend just took twice the intended peak. Every fixed-window limiter has this, and whether it matters depends entirely on what you are protecting: for an API quota it is fine, for a login endpoint or an expensive AI call it is not.</div>

<h3>2 · Sliding window, approximated — the practical default</h3>
<pre><code><span class="tok-comment">// Weight the previous window by how much of it is still in view</span>
export async function slidingApprox(id, limit = 100, windowMs = 60_000) {
  const now = Date.now();
  const cur = Math.floor(now / windowMs);
  const elapsed = (now % windowMs) / windowMs;          <span class="tok-comment">// 0.0 … 1.0</span>

  const p = redis.multi();
  p.incr(&#96;rl:\${id}:\${cur}&#96;);
  p.expire(&#96;rl:\${id}:\${cur}&#96;, Math.ceil(windowMs / 500), 'NX');
  p.get(&#96;rl:\${id}:\${cur - 1}&#96;);
  const [count, , prev] = await p.exec();

  const weighted = count + Number(prev || 0) * (1 - elapsed);
  return { allowed: weighted &lt;= limit, weighted: Math.round(weighted) };
}</code></pre>
<div class="out">t=11:59:59  prev=100 cur=1   elapsed=0.98  weighted=3    → allowed
t=12:00:01  prev=100 cur=1   elapsed=0.02  weighted=99   → allowed
t=12:00:02  prev=100 cur=2   elapsed=0.03  weighted=99   → allowed
t=12:00:03  prev=100 cur=3   elapsed=0.05  weighted=98   → DENIED at 101</div>
<div class="callout ok"><strong>Two counters and one multiplication, and the boundary burst is gone.</strong> Immediately after a window rolls over, the previous window still counts almost fully; by the end of the new window it counts for nothing. The approximation assumes requests were spread evenly through the previous window, which is wrong in detail and close enough in practice — Cloudflare published measurements showing under 0.003% error at scale. This is what most production limiters should use.</div>

<h3>3 · Sliding window log — exact, and it costs</h3>
<pre><code>redis-cli ZADD rl:log:ip1 1787001841204 "1787001841204-a1"
redis-cli ZADD rl:log:ip1 1787001842118 "1787001842118-b2"
redis-cli ZREMRANGEBYSCORE rl:log:ip1 0 $(( $(date +%s%3N) - 60000 ))
redis-cli ZCARD rl:log:ip1
redis-cli EXPIRE rl:log:ip1 60</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 0
(integer) 2
(integer) 1</div>
<pre><code><span class="tok-comment">// One Lua script so the trim, count and add are one atomic step (Chapter 7)</span>
const SLIDING_LOG = &#96;
  local now, window, limit = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, now - window)
  local used = redis.call('ZCARD', KEYS[1])
  if used &lt; limit then
    redis.call('ZADD', KEYS[1], now, now .. '-' .. ARGV[4])
    redis.call('PEXPIRE', KEYS[1], window)
    return {1, limit - used - 1}
  end
  return {0, 0}
&#96;;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Exactly correct</span><span class="v">Every request is a member scored by its timestamp, so "how many in the last 60 seconds" is precisely answerable at any instant. No boundary effect at all.</span></div>
  <div class="kv"><span class="k">Memory is O(limit) per client</span><span class="v">A limit of 1,000/minute stores 1,000 members per key. Ten thousand active clients is ten million members — this is the cost, and it is the reason this is not the default.</span></div>
  <div class="kv"><span class="k">Two O(log N) operations</span><span class="v"><code>ZREMRANGEBYSCORE</code> plus <code>ZADD</code>. Fast, but three commands where the approximate version needs two, and one of them is a range delete.</span></div>
  <div class="kv"><span class="k">Use it for expensive things</span><span class="v">Login attempts, password resets, AI generation, outbound email. Anywhere a small number of extra requests is genuinely costly and the client count is bounded.</span></div>
  <div class="kv"><span class="k">It must be one script</span><span class="v">Trim-count-add across three round trips is a race: two requests can both read <code>used = 99</code> and both proceed. Chapter 7 covers why Lua is the fix.</span></div>
</div>

<h3>4 · Token bucket — the one that allows bursts on purpose</h3>
<pre><code><span class="tok-comment">// Refill continuously, spend one token per request. Bursts are a feature here.</span>
const TOKEN_BUCKET = &#96;
  local rate, cap, now, cost = tonumber(ARGV[1]), tonumber(ARGV[2]),
                               tonumber(ARGV[3]), tonumber(ARGV[4])
  local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
  local tokens = tonumber(b[1]) or cap
  local ts     = tonumber(b[2]) or now

  tokens = math.min(cap, tokens + (now - ts) * rate / 1000)
  if tokens &lt; cost then
    return {0, math.floor(tokens), math.ceil((cost - tokens) * 1000 / rate)}
  end
  redis.call('HSET', KEYS[1], 'tokens', tokens - cost, 'ts', now)
  redis.call('PEXPIRE', KEYS[1], math.ceil(cap * 1000 / rate) * 2)
  return {1, math.floor(tokens - cost), 0}
&#96;;</code></pre>
<div class="out">burst of 20 after idle:  allowed=20  tokens_left=0   retry_after=0ms
21st immediately:        allowed=0   tokens_left=0   retry_after=200ms
after 2s idle:           allowed=10  tokens_left=0   (refilled at 5/s)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Two numbers per client</span><span class="lz-t">tokens remaining, and when we last looked</span><span class="lz-d">One small hash, constant memory regardless of the rate — unlike the sliding log, which grows with the limit.</span></div>
  <div class="lz-step"><span class="lz-k">Refill is computed, not scheduled</span><span class="lz-t">tokens += elapsed × rate, capped</span><span class="lz-d">No background job and no timer. The bucket is only ever updated when someone asks, which is why an idle client costs nothing.</span></div>
  <div class="lz-step"><span class="lz-k">Bursts are deliberate</span><span class="lz-t">capacity 20, rate 5/s</span><span class="lz-d">An idle client may fire 20 at once, then settles to 5/s. That is usually what you want for a public API: forgiving of a page that makes twenty parallel calls, firm about sustained load.</span></div>
  <div class="lz-step"><span class="lz-k">It tells the client when to come back</span><span class="lz-t">retry_after in milliseconds</span><span class="lz-d">A <code>429</code> with a correct <code>Retry-After</code> turns a hammering client into a polite one. Neither window algorithm gives you this number as naturally.</span></div>
</div>

<h3>Choosing the key, which matters more than the algorithm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">By user ID</span><span class="v">The fairest, and only available after authentication. Combine with an IP limit for the endpoints that create accounts, or one person registers ten thousand of them.</span></div>
  <div class="kv"><span class="k">By IP</span><span class="v">Available always, and blunt: one office or one mobile carrier NAT is thousands of people behind one address. Never the only control on something that matters.</span></div>
  <div class="kv"><span class="k">By API key</span><span class="v">The right unit for a public API, and the one you can put in a pricing tier. Key it by the tier so the limit changes without a deploy.</span></div>
  <div class="kv"><span class="k">By endpoint, too</span><span class="v"><code>rl:\${userId}:\${route}</code>. A limit of 100/min across every endpoint means a cheap poll can starve an expensive one. Separate the buckets that have different costs.</span></div>
  <div class="kv"><span class="k">Trust the proxy header correctly</span><span class="v"><code>X-Forwarded-For</code> is client-supplied unless your proxy overwrites it. Take the correct hop, and set <code>trust proxy</code> deliberately (Docker course, Lesson 10.5) — otherwise every attacker gets an unlimited number of buckets.</span></div>
</div>
<pre><code><span class="tok-comment">// The response headers that make a limiter usable by clients</span>
res.set({
  'RateLimit-Limit':     String(limit),
  'RateLimit-Remaining': String(Math.max(0, limit - used)),
  'RateLimit-Reset':     String(resetSeconds),
});
if (!allowed) return res.status(429).set('Retry-After', String(retryAfter)).json({
  error: 'rate_limited', retryAfter,
});</code></pre>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/patterns/rate-limiter/" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Redis — rate limiter patterns</span><span class="lc-sub">The official patterns for the counter and sliding approaches, including the <code>MULTI</code> version and why the naive two-command form races.</span></span>
</a>
<a class="link-card" href="https://blog.cloudflare.com/counting-things-a-lot-of-different-things/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Cloudflare — the approximated sliding window</span><span class="lc-sub">The measurements behind the weighted-previous-window algorithm, with real error rates at scale. The reason that approximation is trusted in production.</span></span>
</a>
<a class="link-card" href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">RateLimit header fields for HTTP</span><span class="lc-sub">The IETF draft standardising <code>RateLimit-Limit</code>, <code>-Remaining</code> and <code>-Reset</code>. Following it means clients and SDKs handle your limits without custom code.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a rate limiter</span><span class="lc-sub">Graded exercises: reproduce the 2× boundary burst, fix it with the weighted window, implement a token bucket in Lua, and choose the right key for five endpoints.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> checking the limit and then incrementing it, in two separate commands. The code reads exactly the way you would describe the logic — read the count, if it is under the limit allow the request and add one — and it is a race that appears only under the load it is meant to protect against. Two requests arriving in the same millisecond both read 99, both decide they are allowed, and both increment to 101; with fifty concurrent workers a limit of 100 lets through 140. The fix is to make the increment <em>be</em> the check: <code>INCR</code> first, compare the returned value against the limit, and reject if it is over — the counter runs slightly high for rejected requests, which is harmless and self-correcting when the window expires. Anything more complex than that (a sliding log, a token bucket) needs the whole read-decide-write sequence inside a single Lua script, because Lua is the only way to make several commands one atomic step (Chapter 7).</div>
<p class="note-ct"><strong>Three things to remember.</strong> A fixed window is two commands and lets through 2× the limit at a boundary; weighting the previous window fixes that for two counters and a multiplication, and is the right default. Exact algorithms — a sorted-set log or a token bucket — cost more and must live inside one Lua script, because a check-then-increment across two round trips is a race under exactly the load you are limiting. And choose the key deliberately: per user <em>and</em> per endpoint, with IP as a blunt fallback, since a single global bucket lets a cheap call starve an expensive one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Giới hạn tần suất, bốn cách</h2>
<p class="lead">Giới hạn tần suất là bài toán Redis mẫu mực: nó cần nguyên tử, nhanh, dùng chung qua mọi instance của ứng dụng, và nó cần tự quên dữ liệu cũ. Có bốn thuật toán đáng biết, và chúng đánh đổi độ chính xác với chi phí theo cách khiến lựa chọn thật sự phụ thuộc tình huống.</p>

<h3>1 · Cửa sổ cố định — hai câu lệnh, một khiếm khuyết</h3>
<pre><code><span class="tok-comment">// Đơn giản nhất có thể: mỗi cửa sổ một bộ đếm, kèm TTL</span>
export async function fixedWindow(id, limit = 100, windowSec = 60) {
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const key = &#96;rl:\${id}:\${bucket}&#96;;
  const p = redis.multi();
  p.incr(key);
  p.expire(key, windowSec, 'NX');
  const [count] = await p.exec();
  return { allowed: count &lt;= limit, count, resetIn: windowSec };
}</code></pre>
<pre><code>for i in $(seq 1 5); do redis-cli INCR "rl:ip1:29783364"; done
redis-cli TTL "rl:ip1:29783364"</code></pre>
<div class="out">(integer) 1
(integer) 2
(integer) 3
(integer) 4
(integer) 5
(integer) 55</div>
<div class="callout warn"><strong>Vấn đề ranh giới: một giới hạn 100 mỗi phút cho phép 200 yêu cầu trong hai giây.</strong> Một client gửi 100 lúc 11:59:59 và 100 nữa lúc 12:00:01 — hai cửa sổ khác nhau, cả hai đều trong giới hạn, và backend của bạn vừa nhận gấp đôi đỉnh dự kiến. MỌI bộ giới hạn cửa sổ cố định đều có chuyện này, và nó có quan trọng hay không phụ thuộc hoàn toàn vào việc bạn đang bảo vệ cái gì: với một hạn ngạch API thì ổn, với một điểm cuối đăng nhập hay một lời gọi AI đắt tiền thì không.</div>

<h3>2 · Cửa sổ trượt, xấp xỉ — mặc định thực dụng</h3>
<pre><code><span class="tok-comment">// Đánh trọng số cho cửa sổ trước theo phần còn nằm trong tầm nhìn</span>
export async function slidingApprox(id, limit = 100, windowMs = 60_000) {
  const now = Date.now();
  const cur = Math.floor(now / windowMs);
  const elapsed = (now % windowMs) / windowMs;          <span class="tok-comment">// 0.0 … 1.0</span>

  const p = redis.multi();
  p.incr(&#96;rl:\${id}:\${cur}&#96;);
  p.expire(&#96;rl:\${id}:\${cur}&#96;, Math.ceil(windowMs / 500), 'NX');
  p.get(&#96;rl:\${id}:\${cur - 1}&#96;);
  const [count, , prev] = await p.exec();

  const weighted = count + Number(prev || 0) * (1 - elapsed);
  return { allowed: weighted &lt;= limit, weighted: Math.round(weighted) };
}</code></pre>
<div class="out">t=11:59:59  prev=100 cur=1   elapsed=0.98  weighted=3    → allowed
t=12:00:01  prev=100 cur=1   elapsed=0.02  weighted=99   → allowed
t=12:00:02  prev=100 cur=2   elapsed=0.03  weighted=99   → allowed
t=12:00:03  prev=100 cur=3   elapsed=0.05  weighted=98   → DENIED at 101</div>
<div class="callout ok"><strong>Hai bộ đếm và một phép nhân, và cú bùng nổ ở ranh giới biến mất.</strong> Ngay sau khi một cửa sổ lăn qua, cửa sổ trước vẫn được tính gần như trọn vẹn; tới cuối cửa sổ mới thì nó không còn được tính chút nào. Phép xấp xỉ giả định các yêu cầu được rải đều qua cửa sổ trước, điều đó sai ở chi tiết và đủ gần trong thực tế — Cloudflare đã công bố số đo cho thấy sai số dưới 0,003% ở quy mô lớn. Đây là thứ mà phần lớn bộ giới hạn trên production nên dùng.</div>

<h3>3 · Nhật ký cửa sổ trượt — chính xác, và có giá</h3>
<pre><code>redis-cli ZADD rl:log:ip1 1787001841204 "1787001841204-a1"
redis-cli ZADD rl:log:ip1 1787001842118 "1787001842118-b2"
redis-cli ZREMRANGEBYSCORE rl:log:ip1 0 $(( $(date +%s%3N) - 60000 ))
redis-cli ZCARD rl:log:ip1
redis-cli EXPIRE rl:log:ip1 60</code></pre>
<div class="out">(integer) 1
(integer) 1
(integer) 0
(integer) 2
(integer) 1</div>
<pre><code><span class="tok-comment">// Một script Lua để việc cắt, đếm và thêm thành MỘT bước nguyên tử (Chương 7)</span>
const SLIDING_LOG = &#96;
  local now, window, limit = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, now - window)
  local used = redis.call('ZCARD', KEYS[1])
  if used &lt; limit then
    redis.call('ZADD', KEYS[1], now, now .. '-' .. ARGV[4])
    redis.call('PEXPIRE', KEYS[1], window)
    return {1, limit - used - 1}
  end
  return {0, 0}
&#96;;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Chính xác tuyệt đối</span><span class="v">Mỗi yêu cầu là một thành viên được chấm điểm bằng mốc thời gian của nó, nên câu "bao nhiêu yêu cầu trong 60 giây qua" trả lời được chính xác ở bất kỳ khoảnh khắc nào. Hoàn toàn không có hiệu ứng ranh giới.</span></div>
  <div class="kv"><span class="k">Bộ nhớ là O(giới hạn) cho mỗi client</span><span class="v">Một giới hạn 1.000/phút lưu 1.000 thành viên mỗi khoá. Mười nghìn client đang hoạt động là mười triệu thành viên — đây là cái giá, và là lý do đây không phải mặc định.</span></div>
  <div class="kv"><span class="k">Hai thao tác O(log N)</span><span class="v"><code>ZREMRANGEBYSCORE</code> cộng <code>ZADD</code>. Nhanh, nhưng là ba câu lệnh trong khi bản xấp xỉ chỉ cần hai, và một trong số đó là xoá theo dải.</span></div>
  <div class="kv"><span class="k">Hãy dùng nó cho những thứ ĐẮT</span><span class="v">Lượt đăng nhập, đặt lại mật khẩu, sinh nội dung bằng AI, gửi email ra ngoài. Bất cứ đâu mà một số ít yêu cầu thừa thật sự tốn kém và số lượng client thì có giới hạn.</span></div>
  <div class="kv"><span class="k">Nó BẮT BUỘC phải nằm trong một script</span><span class="v">Cắt-đếm-thêm qua ba vòng mạng là một cuộc đua: hai yêu cầu đều đọc ra <code>used = 99</code> rồi cả hai cùng đi tiếp. Chương 7 nói vì sao Lua là cách chữa.</span></div>
</div>

<h3>4 · Gáo token — cái CỐ Ý cho phép bùng nổ</h3>
<pre><code><span class="tok-comment">// Đổ đầy liên tục, tiêu một token cho mỗi yêu cầu. Bùng nổ ở đây là TÍNH NĂNG.</span>
const TOKEN_BUCKET = &#96;
  local rate, cap, now, cost = tonumber(ARGV[1]), tonumber(ARGV[2]),
                               tonumber(ARGV[3]), tonumber(ARGV[4])
  local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
  local tokens = tonumber(b[1]) or cap
  local ts     = tonumber(b[2]) or now

  tokens = math.min(cap, tokens + (now - ts) * rate / 1000)
  if tokens &lt; cost then
    return {0, math.floor(tokens), math.ceil((cost - tokens) * 1000 / rate)}
  end
  redis.call('HSET', KEYS[1], 'tokens', tokens - cost, 'ts', now)
  redis.call('PEXPIRE', KEYS[1], math.ceil(cap * 1000 / rate) * 2)
  return {1, math.floor(tokens - cost), 0}
&#96;;</code></pre>
<div class="out">burst of 20 after idle:  allowed=20  tokens_left=0   retry_after=0ms
21st immediately:        allowed=0   tokens_left=0   retry_after=200ms
after 2s idle:           allowed=10  tokens_left=0   (refilled at 5/s)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Hai con số cho mỗi client</span><span class="lz-t">số token còn lại, và lần cuối ta nhìn vào là khi nào</span><span class="lz-d">Một cái hash nhỏ, bộ nhớ hằng số bất kể tốc độ — khác với nhật ký cửa sổ trượt vốn phình theo giới hạn.</span></div>
  <div class="lz-step"><span class="lz-k">Việc đổ đầy được TÍNH RA, không được lên lịch</span><span class="lz-t">tokens += thời gian trôi × tốc độ, có trần</span><span class="lz-d">Không việc chạy nền và không hẹn giờ. Cái gáo chỉ được cập nhật khi có ai đó hỏi tới, và đó là lý do một client nhàn rỗi chẳng tốn gì.</span></div>
  <div class="lz-step"><span class="lz-k">Bùng nổ là CÓ CHỦ ĐÍCH</span><span class="lz-t">sức chứa 20, tốc độ 5/s</span><span class="lz-d">Một client nhàn rỗi có thể bắn 20 phát một lúc, rồi ổn định về 5/s. Đó thường là thứ bạn muốn cho một API công khai: rộng lượng với một trang gọi hai mươi lời gọi song song, cứng rắn với tải kéo dài.</span></div>
  <div class="lz-step"><span class="lz-k">Nó nói cho client biết khi nào quay lại</span><span class="lz-t">retry_after tính bằng mili giây</span><span class="lz-d">Một mã <code>429</code> kèm <code>Retry-After</code> đúng sẽ biến một client đang nện thành một client lịch sự. Không thuật toán cửa sổ nào cho bạn con số này một cách tự nhiên như vậy.</span></div>
</div>

<h3>Chọn khoá, thứ quan trọng hơn cả thuật toán</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Theo ID người dùng</span><span class="v">Công bằng nhất, và chỉ có sau khi xác thực. Hãy ghép với một giới hạn theo IP cho những điểm cuối tạo tài khoản, không thì một người đăng ký mười nghìn cái.</span></div>
  <div class="kv"><span class="k">Theo IP</span><span class="v">Luôn có sẵn, và cùn: một văn phòng hay một NAT của nhà mạng di động là hàng nghìn người sau một địa chỉ. Đừng bao giờ để nó là biện pháp DUY NHẤT cho thứ gì quan trọng.</span></div>
  <div class="kv"><span class="k">Theo khoá API</span><span class="v">Đơn vị đúng cho một API công khai, và là cái bạn đưa được vào một bậc giá. Hãy đánh khoá theo bậc để đổi giới hạn mà không phải deploy.</span></div>
  <div class="kv"><span class="k">Theo cả ĐIỂM CUỐI nữa</span><span class="v"><code>rl:\${userId}:\${route}</code>. Một giới hạn 100/phút dùng chung cho mọi điểm cuối nghĩa là một lời gọi thăm dò rẻ tiền có thể bỏ đói một lời gọi đắt tiền. Hãy tách các gáo có chi phí khác nhau.</span></div>
  <div class="kv"><span class="k">Tin header của proxy cho đúng</span><span class="v"><code>X-Forwarded-For</code> là do client cung cấp, trừ khi proxy của bạn ghi đè nó. Hãy lấy đúng chặng, và đặt <code>trust proxy</code> một cách có chủ đích (khoá Docker, Bài 10.5) — không thì mọi kẻ tấn công đều có vô hạn số gáo.</span></div>
</div>
<pre><code><span class="tok-comment">// Những header phản hồi khiến một bộ giới hạn dùng được với client</span>
res.set({
  'RateLimit-Limit':     String(limit),
  'RateLimit-Remaining': String(Math.max(0, limit - used)),
  'RateLimit-Reset':     String(resetSeconds),
});
if (!allowed) return res.status(429).set('Retry-After', String(retryAfter)).json({
  error: 'rate_limited', retryAfter,
});</code></pre>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/patterns/rate-limiter/" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Redis — các mẫu giới hạn tần suất</span><span class="lc-sub">Các mẫu chính thức cho cách bộ đếm và cách cửa sổ trượt, gồm cả bản dùng <code>MULTI</code> và vì sao dạng ngây thơ hai câu lệnh lại có cuộc đua.</span></span>
</a>
<a class="link-card" href="https://blog.cloudflare.com/counting-things-a-lot-of-different-things/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Cloudflare — cửa sổ trượt xấp xỉ</span><span class="lc-sub">Những phép đo đằng sau thuật toán đánh trọng số cửa sổ trước, kèm tỷ lệ sai số thật ở quy mô lớn. Lý do phép xấp xỉ đó được tin dùng trên production.</span></span>
</a>
<a class="link-card" href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Các trường header RateLimit cho HTTP</span><span class="lc-sub">Bản dự thảo của IETF chuẩn hoá <code>RateLimit-Limit</code>, <code>-Remaining</code> và <code>-Reset</code>. Theo nó nghĩa là client và SDK xử lý được giới hạn của bạn mà không cần mã riêng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một bộ giới hạn tần suất</span><span class="lc-sub">Bài chấm điểm: tái hiện cú bùng nổ gấp 2 lần ở ranh giới, chữa bằng cửa sổ có trọng số, cài một gáo token bằng Lua, và chọn đúng khoá cho năm điểm cuối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> KIỂM giới hạn rồi mới TĂNG nó, bằng hai câu lệnh riêng. Đoạn mã đọc lên đúng y cách bạn mô tả lô-gíc — đọc con số, nếu nó dưới giới hạn thì cho phép rồi cộng một — và nó là một cuộc đua chỉ lộ ra dưới đúng cái tải mà nó sinh ra để chống. Hai yêu cầu tới trong cùng một mili giây đều đọc ra 99, đều quyết định là được phép, và đều tăng lên 101; với năm mươi worker chạy song song thì một giới hạn 100 cho lọt 140. Cách chữa là làm cho lệnh TĂNG CHÍNH LÀ phép kiểm: gọi <code>INCR</code> trước, so giá trị trả về với giới hạn, rồi từ chối nếu vượt — bộ đếm sẽ chạy hơi cao đối với những yêu cầu bị từ chối, chuyện đó vô hại và tự sửa khi cửa sổ hết hạn. Bất cứ thứ gì phức tạp hơn thế (một nhật ký trượt, một gáo token) đều cần cả chuỗi đọc-quyết-ghi nằm trong MỘT script Lua duy nhất, vì Lua là cách duy nhất khiến nhiều câu lệnh trở thành một bước nguyên tử (Chương 7).</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cửa sổ cố định gọn trong hai câu lệnh và cho lọt gấp 2 lần giới hạn ở một ranh giới; đánh trọng số cho cửa sổ trước chữa được chuyện đó với hai bộ đếm và một phép nhân, và đó là mặc định đúng. Những thuật toán chính xác — một nhật ký sorted set hay một gáo token — tốn hơn và BẮT BUỘC phải nằm trong một script Lua, vì kiểm-rồi-tăng qua hai vòng mạng là một cuộc đua dưới đúng cái tải bạn đang giới hạn. Và hãy chọn khoá một cách có chủ đích: theo người dùng <em>VÀ</em> theo điểm cuối, với IP làm phương án dự phòng thô, vì một cái gáo toàn cục duy nhất sẽ để một lời gọi rẻ bỏ đói một lời gọi đắt.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: strings, counters and probabilistic types|||3.6 — Trắc nghiệm: chuỗi, bộ đếm và kiểu xác suất',
      slug: 'rd-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về ba cách mã hoá chuỗi, INCR nguyên tử, INCRBYFLOAT với tiền, mô hình chi phí của bitmap, sai số HyperLogLog, và cuộc đua kiểm-rồi-tăng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the simplest type and the two that hide inside it. Three of these are memory-model questions, and getting them wrong is how a 125KB structure becomes 500MB.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: what drives a bitmap's memory (3.3), when HyperLogLog's error is unacceptable (3.4), and why check-then-increment is a race (3.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về kiểu dữ liệu đơn giản nhất và hai kiểu nấp bên trong nó. Ba câu trong đây là câu hỏi về mô hình bộ nhớ, và trả lời sai chúng là cách một cấu trúc 125KB biến thành 500MB.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: cái gì chi phối bộ nhớ của một bitmap (3.3), khi nào sai số của HyperLogLog là không chấp nhận được (3.4), và vì sao kiểm-rồi-tăng là một cuộc đua (3.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You `SET k 42`. What does `OBJECT ENCODING k` report, and why does it matter?|||Bạn chạy `SET k 42`. `OBJECT ENCODING k` báo gì, và vì sao chuyện đó quan trọng?',
            options: [
              'embstr — short strings are embedded with the object header|||embstr — chuỗi ngắn được nhúng cùng phần đầu đối tượng',
              'raw — every SET creates a separate SDS buffer|||raw — mọi lệnh SET đều tạo một bộ đệm SDS riêng',
              'int — and values 0–9999 are SHARED objects, so a million keys holding 42 all point at one allocation|||int — và các giá trị 0–9999 là đối tượng DÙNG CHUNG, nên một triệu khoá cùng giữ số 42 đều trỏ vào một vùng cấp phát',
              'string — Redis has only one string encoding|||string — Redis chỉ có một cách mã hoá chuỗi duy nhất',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Two processes run `GET views` → 100, then `SET views 101`. What is wrong, and what is the fix?|||Hai tiến trình chạy `GET views` → 100, rồi `SET views 101`. Sai ở đâu, và cách chữa là gì?',
            options: [
              'Nothing is wrong; Redis serialises the two SETs|||Không có gì sai; Redis tuần tự hoá hai lệnh SET đó',
              'One increment is lost — read-modify-write in the application is a race; INCR is a single indivisible command, so 10,000 parallel increments give exactly 10,000|||Mất một lượt tăng — đọc-sửa-ghi trong ứng dụng là một cuộc đua; INCR là MỘT câu lệnh không chia cắt được, nên 10.000 lượt tăng song song cho đúng 10.000',
              'The fix is to wrap both commands in MULTI/EXEC|||Cách chữa là bọc cả hai câu lệnh trong MULTI/EXEC',
              'The fix is a WATCH on the key before reading|||Cách chữa là đặt WATCH lên cái khoá trước khi đọc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is `INCRBYFLOAT` wrong for tracking a user account balance?|||Vì sao `INCRBYFLOAT` sai khi dùng để theo dõi số dư tài khoản của người dùng?',
            options: [
              'It is not atomic across processes|||Nó không nguyên tử giữa các tiến trình',
              'It uses a long double, so representation error is hidden by 17-digit formatting rather than absent — store integer minor units and format for display|||Nó dùng long double, nên sai số biểu diễn bị giấu đi bởi cách định dạng 17 chữ số chứ không phải không có — hãy lưu số nguyên theo đơn vị nhỏ nhất rồi định dạng lúc hiển thị',
              'It cannot handle negative increments|||Nó không xử lý được lượng tăng âm',
              'It clears the key\'s TTL|||Nó xoá TTL của khoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run `SETBIT active 4000000000 1` on an empty key. What happens?|||Bạn chạy `SETBIT active 4000000000 1` trên một khoá rỗng. Chuyện gì xảy ra?',
            options: [
              'One bit is set and the key uses a few bytes|||Một bit được bật và cái khoá dùng vài byte',
              'Redis rejects the offset as too large|||Redis từ chối vì vị trí quá lớn',
              'The key is stored sparsely, like a HyperLogLog|||Khoá được lưu thưa, giống một HyperLogLog',
              'It allocates 500MB in one blocking operation — a bitmap\'s memory is driven by the LARGEST offset ever set, not the number of set bits|||Nó cấp phát 500MB trong một thao tác gây chặn — bộ nhớ của bitmap bị chi phối bởi vị trí LỚN NHẤT từng được đặt, không phải số bit được bật',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A million distinct users: a set costs 42MB. What does a HyperLogLog cost, and what do you give up?|||Một triệu người dùng khác nhau: một cái set tốn 42MB. Một HyperLogLog tốn bao nhiêu, và bạn từ bỏ điều gì?',
            options: [
              '12KB, with ~0.81% relative error — and you give up membership testing and deletion entirely; there is no PFISMEMBER|||12KB, với sai số tương đối ~0,81% — và bạn từ bỏ hoàn toàn việc kiểm thành viên với việc xoá; không có PFISMEMBER',
              '12KB, exact, but you cannot merge two of them|||12KB, chính xác, nhưng bạn không hợp được hai cái với nhau',
              '4MB, with no error, but reads are slower|||4MB, không sai số, nhưng đọc chậm hơn',
              '12KB, and the error grows with the number of items|||12KB, và sai số TĂNG theo số lượng mục',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these is the WRONG use for a HyperLogLog?|||Cái nào sau đây là cách dùng SAI cho một HyperLogLog?',
            options: [
              'Unique visitors per page per day|||Số khách truy cập duy nhất theo trang theo ngày',
              'Distinct search terms this month|||Số từ khoá tìm kiếm khác nhau trong tháng',
              'The number of people who reacted to a post, displayed next to their names|||Số người đã thả cảm xúc vào một bài viết, hiển thị ngay cạnh tên của họ',
              'Distinct IP addresses seen by an edge node|||Số địa chỉ IP khác nhau mà một nút biên nhìn thấy',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A fixed-window limiter allows 100 requests per minute. How many can a client send in two seconds?|||Một bộ giới hạn cửa sổ cố định cho phép 100 yêu cầu mỗi phút. Một client gửi được bao nhiêu trong hai giây?',
            options: [
              '100 — the window is enforced continuously|||100 — cửa sổ được áp dụng liên tục',
              'About 3 — 100 divided across 60 seconds|||Khoảng 3 — 100 chia đều cho 60 giây',
              '200 — 100 at the end of one window and 100 at the start of the next; weighting the previous window by elapsed time fixes it|||200 — 100 ở cuối một cửa sổ và 100 ở đầu cửa sổ kế; đánh trọng số cửa sổ trước theo thời gian đã trôi sẽ chữa được',
              '101 — the limiter allows one extra before rejecting|||101 — bộ giới hạn cho thừa một cái trước khi từ chối',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Your limiter does `GET count`, compares to the limit, then `INCR count`. Under load a limit of 100 lets through 140. Why?|||Bộ giới hạn của bạn chạy `GET count`, so với giới hạn, rồi `INCR count`. Khi có tải, một giới hạn 100 cho lọt 140. Vì sao?',
            options: [
              'Two concurrent requests both read 99 and both proceed — make the INCR BE the check (increment first, compare the returned value), or put the whole sequence in one Lua script|||Hai yêu cầu đồng thời cùng đọc ra 99 rồi cùng đi tiếp — hãy làm cho lệnh INCR CHÍNH LÀ phép kiểm (tăng trước, so giá trị trả về), hoặc đặt cả chuỗi vào một script Lua',
              'The TTL expired between the two commands|||TTL hết hạn giữa hai câu lệnh',
              'GET returns a stale value from a replica|||GET trả về một giá trị cũ từ một bản sao',
              'INCR is not atomic when the key has a TTL|||INCR không nguyên tử khi cái khoá có TTL',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
