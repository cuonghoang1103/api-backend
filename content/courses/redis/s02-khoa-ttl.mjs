/**
 * Redis — Chương 2: khoá, TTL và hết hạn.
 * Thiết kế tên khoá · cơ chế hết hạn · tìm và xoá an toàn · thông báo không gian khoá · linh tinh · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 2 — Keys, TTL and expiration|||Chương 2 — Khoá, TTL và hết hạn',
  description: 'Không gian khoá là một cuốn từ điển phẳng, và cách bạn đặt tên trong đó quyết định mọi thứ về sau. Chương này nói về thiết kế tên khoá, TTL thật sự hoạt động ra sao (nó KHÔNG đúng giờ), tìm và xoá khoá mà không làm đứng máy chủ, và thông báo không gian khoá.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Designing key names|||2.1 — Thiết kế tên khoá',
      slug: 'rd-2-1-dat-ten-khoa',
      type: 'LESSON',
      description: 'Quy ước dấu hai chấm và vì sao nó quan trọng, một khoá tốn bao nhiêu bộ nhớ thật, ba luật đặt tên, tiền tố phiên bản cho lúc đổi schema, và cách WRONGTYPE xảy ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Designing key names</h2>
<p class="lead">Redis has no schema, no tables and no migrations. The key name <em>is</em> the schema — it encodes what the value means, who owns it, and how you will find it again. That makes key naming the one design decision in Redis that is genuinely expensive to change later, because there is no <code>ALTER TABLE</code> for a keyspace.</p>

<h3>The convention, and what it is for</h3>
<pre><code>redis-cli MSET \\
  'user:1042:profile'      '{"name":"Cường"}' \\
  'user:1042:sessions'     '3' \\
  'post:77:likes:count'    '284' \\
  'cache:v2:feed:home:p1'  '[…]' \\
  'ratelimit:ip:1.2.3.4:60' '9'
redis-cli --scan --pattern 'user:1042:*'</code></pre>
<div class="out">OK
user:1042:profile
user:1042:sessions</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Colons mean nothing to Redis</span><span class="v">The keyspace is one flat dictionary and <code>user:1042:profile</code> is a single 19-byte string. The structure is entirely for humans and for glob patterns.</span></div>
  <div class="kv"><span class="k">Most specific last</span><span class="v"><code>user:1042:sessions</code>, not <code>sessions:user:1042</code>. Prefixes are what <code>SCAN --pattern</code> matches efficiently, so put the thing you will want to enumerate at the front.</span></div>
  <div class="kv"><span class="k">One namespace per concern</span><span class="v"><code>cache:</code>, <code>session:</code>, <code>ratelimit:</code>, <code>queue:</code>, <code>lock:</code>. This is how you answer "what can I safely flush?" and how you set per-namespace TTL policy.</span></div>
  <div class="kv"><span class="k">Lower case, no spaces</span><span class="v">Legal, but a key with a space or a newline is miserable in a shell, in a log line and in a <code>SCAN</code> pattern. Keep it boring.</span></div>
  <div class="kv"><span class="k">Write it down once</span><span class="v">A short table of key patterns in your README costs ten minutes and prevents two features silently sharing a key. That collision is the source of nearly every <code>WRONGTYPE</code>.</span></div>
</div>

<h3>What a key actually costs</h3>
<pre><code>redis-cli FLUSHDB
redis-cli INFO memory | grep used_memory:
for i in $(seq 1 100000); do echo "SET u:$i 1"; done | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory:
redis-cli MEMORY USAGE u:1</code></pre>
<div class="out">used_memory:1073664
used_memory:9418432
(integer) 56</div>
<pre><code><span class="tok-comment"># The same 100,000 values, but with long descriptive key names</span>
redis-cli FLUSHDB &gt;/dev/null
for i in $(seq 1 100000); do echo "SET application:cache:user:profile:data:$i 1"; done \\
  | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory:
redis-cli MEMORY USAGE application:cache:user:profile:data:1</code></pre>
<div class="out">used_memory:14204288
(integer) 96</div>
<div class="callout"><strong>83 bytes of overhead per key, plus the key name itself.</strong> Long names cost 4.8MB extra across 100,000 keys — real, but rarely the thing that matters. What <em>does</em> matter is the fixed overhead: 100,000 tiny keys cost 8.3MB regardless of their values, because each one carries a dict entry, a <code>robj</code>, an SDS header and allocator padding. If you have millions of tiny keys, the fix is not shorter names — it is fewer keys, by grouping them into hashes (Chapter 5).</div>

<h3>Three rules that survive contact with production</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · The prefix says what may be deleted</span><span class="lz-t">cache: is disposable, session: is not</span><span class="lz-d">When you need to reclaim memory or drop stale data at 3am, the ability to say "everything under <code>cache:</code> can go" is worth more than any clever scheme. Encode disposability in the prefix.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Version anything whose shape can change</span><span class="lz-t">cache:v2:feed:home</span><span class="lz-d">Change the serialisation format and bump to <code>v3</code>: old keys are ignored and expire on their own, new keys are written fresh, and there is no migration and no moment where both formats are being read.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Never put unbounded user input in a key</span><span class="lz-t">search:\${query} is a memory leak</span><span class="lz-d">Every distinct query creates a key that lives until it expires. Hash the input, cap the length, and always set a TTL — an attacker with a loop otherwise fills your memory for free.</span></div>
</div>
<pre><code><span class="tok-comment">// The versioned-prefix pattern, which makes format changes free</span>
const CACHE_VERSION = 'v3';                    <span class="tok-comment">// bump when the shape changes</span>
const feedKey = (userId, page) =&gt;
  &#96;cache:\${CACHE_VERSION}:feed:\${userId}:p\${page}&#96;;

<span class="tok-comment">// Bounded keys from unbounded input</span>
import { createHash } from 'crypto';
const searchKey = (q) =&gt;
  &#96;cache:v1:search:\${createHash('sha256').update(q).digest('hex').slice(0, 16)}&#96;;</code></pre>

<h3>How WRONGTYPE actually happens</h3>
<pre><code>redis-cli SET user:1042 "a string"
redis-cli HSET user:1042 name "Cường"
redis-cli TYPE user:1042
redis-cli DEL user:1042 &gt;/dev/null
redis-cli HSET user:1042 name "Cường"
redis-cli TYPE user:1042</code></pre>
<div class="out">OK
(error) WRONGTYPE Operation against a key holding the wrong kind of value
string
(integer) 1
hash</div>
<p>Two features both decided <code>user:1042</code> was a reasonable key: one stored a JSON string, the other wanted a hash. Neither is wrong in isolation, and the error appears only when both run. The fix is not defensive code — it is a naming convention where the shape is visible in the name: <code>user:1042:json</code> and <code>user:1042:h</code>, or better, distinct namespaces per feature.</p>

<h3>Key length, and where it stops mattering</h3>
<pre><code>redis-cli SET "$(head -c 300 /dev/urandom | base64 | tr -d '\\n')" v
redis-cli DBSIZE
redis-cli --scan | awk '{print length($0)}' | sort -rn | head -3
redis-cli MEMORY USAGE "$(redis-cli --scan | awk '{print length($0), $0}' | sort -rn | head -1 | cut -d' ' -f2-)"</code></pre>
<div class="out">OK
100001
400
44
44
(integer) 464</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The limit is 512MB</span><span class="v">A key can technically be as large as a value. This is never useful and always a bug — a 400-byte key is already unusual.</span></div>
  <div class="kv"><span class="k">Long keys cost twice</span><span class="v">Once in memory per key, and once on the wire per command. A 200-byte key sent a million times a day is 200MB of network for nothing.</span></div>
  <div class="kv"><span class="k">Do not over-optimise</span><span class="v"><code>u:1042:p</code> saves twelve bytes and costs every future reader ten seconds of confusion. Readable names win until you have millions of keys and a measurement showing otherwise.</span></div>
  <div class="kv"><span class="k">Hash long identifiers</span><span class="v">A 300-character URL as a key becomes a 16-character hash. Same uniqueness in practice, bounded length, and it makes logs readable.</span></div>
  <div class="kv"><span class="k">Cluster: mind the hash tag</span><span class="v">In Redis Cluster the slot is computed from the whole key, or from the part inside <code>{}</code> if present. <code>user:{1042}:profile</code> and <code>user:{1042}:sessions</code> land on the same node — which is what makes multi-key operations possible (Chapter 11).</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Redis keyspace</span><span class="lc-sub">The official notes on key naming, the length limits, and the recommendation to use a schema-like convention. Short, and it is where the colon convention comes from.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/key-specs/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Key specifications</span><span class="lc-sub">How Redis itself declares which arguments of a command are keys — the machinery behind cluster routing and ACL key patterns. Useful once you reach Chapters 10 and 11.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: design a keyspace</span><span class="lc-sub">Graded exercises: name the keys for a six-feature application, reproduce a <code>WRONGTYPE</code> collision and fix it by naming, and measure the memory cost of 100,000 keys with long versus short names.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> building keys from unbounded user input — <code>cache:search:{query}</code>, <code>cache:url:{full-url}</code>, <code>ratelimit:ua:{user-agent}</code>. Each distinct input creates a key that persists until it expires, so a crawler, a fuzzer or an ordinary user with a search box will steadily fill your memory with keys that will never be read again. With <code>maxmemory-policy noeviction</code> the instance eventually starts refusing writes; with an eviction policy it starts evicting the keys you actually wanted. Two habits prevent it entirely: hash the input to a fixed length so one key cannot be enormous, and set a TTL on <em>every</em> key derived from user input, without exception. If you cannot name a TTL for a key, that is a strong signal it should not be keyed on user input at all.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The key name is the schema, and it is the one thing in Redis that is expensive to change — write down your patterns before you have a million keys. Encode disposability in the prefix (<code>cache:</code> can be dropped, <code>session:</code> cannot) and a version in anything whose shape may change, so a format migration is a bumped constant rather than a script. And every key built from user input needs a hashed, bounded name <em>and</em> a TTL, or it is a memory leak with a friendly interface.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Thiết kế tên khoá</h2>
<p class="lead">Redis không có schema, không có bảng và không có migration. Tên khoá CHÍNH LÀ schema — nó mã hoá việc giá trị đó nghĩa là gì, ai sở hữu nó, và bạn sẽ tìm lại nó bằng cách nào. Điều đó khiến việc đặt tên khoá là quyết định thiết kế duy nhất trong Redis mà đổi về sau thì thật sự tốn kém, vì không có <code>ALTER TABLE</code> nào cho một không gian khoá.</p>

<h3>Quy ước, và nó dùng để làm gì</h3>
<pre><code>redis-cli MSET \\
  'user:1042:profile'      '{"name":"Cường"}' \\
  'user:1042:sessions'     '3' \\
  'post:77:likes:count'    '284' \\
  'cache:v2:feed:home:p1'  '[…]' \\
  'ratelimit:ip:1.2.3.4:60' '9'
redis-cli --scan --pattern 'user:1042:*'</code></pre>
<div class="out">OK
user:1042:profile
user:1042:sessions</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dấu hai chấm chẳng có nghĩa gì với Redis</span><span class="v">Không gian khoá là MỘT cuốn từ điển phẳng và <code>user:1042:profile</code> là một chuỗi 19 byte duy nhất. Cái cấu trúc đó hoàn toàn dành cho con người và cho các mẫu glob.</span></div>
  <div class="kv"><span class="k">Cụ thể nhất để sau cùng</span><span class="v"><code>user:1042:sessions</code>, không phải <code>sessions:user:1042</code>. Tiền tố là thứ <code>SCAN --pattern</code> khớp hiệu quả, nên hãy đặt thứ bạn sẽ muốn liệt kê lên phía trước.</span></div>
  <div class="kv"><span class="k">Mỗi mối quan tâm một không gian tên</span><span class="v"><code>cache:</code>, <code>session:</code>, <code>ratelimit:</code>, <code>queue:</code>, <code>lock:</code>. Đây là cách bạn trả lời câu "cái gì xoá được an toàn?" và là cách bạn đặt chính sách TTL theo từng không gian tên.</span></div>
  <div class="kv"><span class="k">Chữ thường, không khoảng trắng</span><span class="v">Hợp lệ, nhưng một cái khoá có khoảng trắng hay ký tự xuống dòng là cực hình trong shell, trong một dòng log và trong một mẫu <code>SCAN</code>. Cứ giữ cho nhàm chán.</span></div>
  <div class="kv"><span class="k">Viết nó ra một lần</span><span class="v">Một bảng ngắn liệt kê các mẫu khoá trong README của bạn tốn mười phút và ngăn được chuyện hai tính năng lặng lẽ dùng chung một cái khoá. Cú đụng độ đó là nguồn gốc của gần như mọi lỗi <code>WRONGTYPE</code>.</span></div>
</div>

<h3>Một cái khoá thật ra tốn bao nhiêu</h3>
<pre><code>redis-cli FLUSHDB
redis-cli INFO memory | grep used_memory:
for i in $(seq 1 100000); do echo "SET u:$i 1"; done | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory:
redis-cli MEMORY USAGE u:1</code></pre>
<div class="out">used_memory:1073664
used_memory:9418432
(integer) 56</div>
<pre><code><span class="tok-comment"># Cũng 100.000 giá trị đó, nhưng với tên khoá dài mang tính mô tả</span>
redis-cli FLUSHDB &gt;/dev/null
for i in $(seq 1 100000); do echo "SET application:cache:user:profile:data:$i 1"; done \\
  | redis-cli --pipe &gt;/dev/null
redis-cli INFO memory | grep used_memory:
redis-cli MEMORY USAGE application:cache:user:profile:data:1</code></pre>
<div class="out">used_memory:14204288
(integer) 96</div>
<div class="callout"><strong>83 byte chi phí phụ trên mỗi khoá, cộng với chính cái tên khoá.</strong> Tên dài tốn thêm 4,8MB trên 100.000 khoá — có thật, nhưng hiếm khi là thứ quan trọng. Thứ THẬT SỰ quan trọng là chi phí cố định: 100.000 khoá tí hon tốn 8,3MB bất kể giá trị của chúng, vì mỗi cái mang theo một mục từ điển, một <code>robj</code>, một phần đầu SDS và phần đệm của bộ cấp phát. Nếu bạn có hàng triệu khoá tí hon thì cách chữa không phải là tên ngắn hơn — mà là ÍT KHOÁ HƠN, bằng cách gom chúng vào các hash (Chương 5).</div>

<h3>Ba luật sống sót được khi va vào production</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Tiền tố nói rõ cái gì xoá được</span><span class="lz-t">cache: là vứt được, session: thì không</span><span class="lz-d">Khi bạn cần lấy lại bộ nhớ hoặc vứt dữ liệu cũ lúc 3 giờ sáng, khả năng nói "mọi thứ dưới <code>cache:</code> đều đi được" đáng giá hơn mọi cơ chế thông minh nào. Hãy mã hoá tính vứt-được vào tiền tố.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đánh phiên bản cho mọi thứ có thể đổi hình dạng</span><span class="lz-t">cache:v2:feed:home</span><span class="lz-d">Đổi định dạng tuần tự hoá rồi nâng lên <code>v3</code>: khoá cũ bị bỏ qua và tự hết hạn, khoá mới được ghi mới tinh, và không có migration nào cũng không có khoảnh khắc nào cả hai định dạng cùng bị đọc.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Đừng bao giờ nhét đầu vào không giới hạn của người dùng vào khoá</span><span class="lz-t">search:\${query} là một chỗ rò bộ nhớ</span><span class="lz-d">Mỗi truy vấn khác nhau tạo một khoá sống tới khi hết hạn. Hãy băm đầu vào, chặn độ dài, và LUÔN đặt TTL — nếu không thì một kẻ tấn công với một vòng lặp sẽ làm đầy bộ nhớ của bạn miễn phí.</span></div>
</div>
<pre><code><span class="tok-comment">// Mẫu tiền tố có phiên bản, thứ khiến đổi định dạng thành miễn phí</span>
const CACHE_VERSION = 'v3';                    <span class="tok-comment">// nâng lên khi hình dạng đổi</span>
const feedKey = (userId, page) =&gt;
  &#96;cache:\${CACHE_VERSION}:feed:\${userId}:p\${page}&#96;;

<span class="tok-comment">// Khoá có giới hạn từ đầu vào không giới hạn</span>
import { createHash } from 'crypto';
const searchKey = (q) =&gt;
  &#96;cache:v1:search:\${createHash('sha256').update(q).digest('hex').slice(0, 16)}&#96;;</code></pre>

<h3>WRONGTYPE thật ra xảy ra thế nào</h3>
<pre><code>redis-cli SET user:1042 "a string"
redis-cli HSET user:1042 name "Cường"
redis-cli TYPE user:1042
redis-cli DEL user:1042 &gt;/dev/null
redis-cli HSET user:1042 name "Cường"
redis-cli TYPE user:1042</code></pre>
<div class="out">OK
(error) WRONGTYPE Operation against a key holding the wrong kind of value
string
(integer) 1
hash</div>
<p>Hai tính năng cùng thấy <code>user:1042</code> là một cái khoá hợp lý: một cái cất một chuỗi JSON, cái kia muốn một hash. Không cái nào sai khi đứng riêng, và cái lỗi chỉ xuất hiện khi cả hai cùng chạy. Cách chữa không phải là viết mã phòng thủ — mà là một quy ước đặt tên trong đó HÌNH DẠNG nhìn thấy được ngay trong tên: <code>user:1042:json</code> và <code>user:1042:h</code>, hoặc tốt hơn là các không gian tên riêng cho từng tính năng.</p>

<h3>Độ dài khoá, và chỗ nó thôi quan trọng</h3>
<pre><code>redis-cli SET "$(head -c 300 /dev/urandom | base64 | tr -d '\\n')" v
redis-cli DBSIZE
redis-cli --scan | awk '{print length($0)}' | sort -rn | head -3
redis-cli MEMORY USAGE "$(redis-cli --scan | awk '{print length($0), $0}' | sort -rn | head -1 | cut -d' ' -f2-)"</code></pre>
<div class="out">OK
100001
400
44
44
(integer) 464</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giới hạn là 512MB</span><span class="v">Về mặt kỹ thuật một cái khoá to bằng một giá trị cũng được. Chuyện này không bao giờ hữu ích và luôn là một cái lỗi — một cái khoá 400 byte đã là bất thường rồi.</span></div>
  <div class="kv"><span class="k">Khoá dài tốn hai lần</span><span class="v">Một lần trong bộ nhớ cho mỗi khoá, và một lần trên dây cho mỗi câu lệnh. Một cái khoá 200 byte được gửi một triệu lần mỗi ngày là 200MB băng thông cho không có gì.</span></div>
  <div class="kv"><span class="k">Đừng tối ưu quá tay</span><span class="v"><code>u:1042:p</code> tiết kiệm mười hai byte và bắt mọi người đọc sau này tốn mười giây rối trí. Tên dễ đọc thắng cho tới khi bạn có hàng triệu khoá VÀ có một phép đo nói ngược lại.</span></div>
  <div class="kv"><span class="k">Băm những định danh dài</span><span class="v">Một URL 300 ký tự làm khoá thì thành một mã băm 16 ký tự. Trong thực tế vẫn duy nhất y như vậy, độ dài có giới hạn, và log thì đọc được.</span></div>
  <div class="kv"><span class="k">Cluster: để ý hash tag</span><span class="v">Trong Redis Cluster, slot được tính từ toàn bộ khoá, hoặc từ phần nằm trong <code>{}</code> nếu có. <code>user:{1042}:profile</code> và <code>user:{1042}:sessions</code> rơi vào cùng một nút — và đó là thứ khiến các thao tác nhiều khoá khả thi (Chương 11).</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Không gian khoá Redis</span><span class="lc-sub">Ghi chú chính thức về đặt tên khoá, các giới hạn độ dài, và khuyến nghị dùng một quy ước giống schema. Ngắn, và đây là chỗ quy ước dấu hai chấm ra đời.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/key-specs/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Đặc tả khoá</span><span class="lc-sub">Cách chính Redis khai báo tham số nào của một câu lệnh là khoá — bộ máy nằm sau việc định tuyến cluster và các mẫu khoá của ACL. Hữu ích khi bạn tới Chương 10 và 11.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: thiết kế một không gian khoá</span><span class="lc-sub">Bài chấm điểm: đặt tên khoá cho một ứng dụng sáu tính năng, tái hiện một cú đụng độ <code>WRONGTYPE</code> rồi chữa bằng cách đặt tên, và đo chi phí bộ nhớ của 100.000 khoá với tên dài so với tên ngắn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dựng khoá từ đầu vào không giới hạn của người dùng — <code>cache:search:{query}</code>, <code>cache:url:{full-url}</code>, <code>ratelimit:ua:{user-agent}</code>. Mỗi đầu vào khác nhau tạo ra một cái khoá tồn tại tới khi nó hết hạn, nên một con bot thu thập dữ liệu, một bộ fuzz hay một người dùng bình thường với một ô tìm kiếm sẽ đều đặn làm đầy bộ nhớ của bạn bằng những khoá không bao giờ được đọc lại. Với <code>maxmemory-policy noeviction</code> thì instance đó rốt cuộc bắt đầu từ chối lệnh ghi; với một chính sách đẩy khoá thì nó bắt đầu đẩy đi đúng những khoá bạn cần. Hai thói quen ngăn được hoàn toàn: BĂM đầu vào về một độ dài cố định để một cái khoá không thể khổng lồ, và đặt TTL trên MỌI khoá dẫn xuất từ đầu vào người dùng, không ngoại lệ. Nếu bạn không gọi tên được một TTL cho một cái khoá thì đó là dấu hiệu mạnh rằng nó không nên được đặt khoá theo đầu vào người dùng chút nào.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Tên khoá CHÍNH LÀ schema, và nó là thứ duy nhất trong Redis mà đổi về sau thì tốn kém — hãy viết ra các mẫu của bạn TRƯỚC khi có một triệu khoá. Hãy mã hoá tính vứt-được vào tiền tố (<code>cache:</code> bỏ được, <code>session:</code> thì không) và một số phiên bản vào mọi thứ có thể đổi hình dạng, để một lần đổi định dạng chỉ là nâng một hằng số chứ không phải chạy một script. Và mọi khoá dựng từ đầu vào người dùng đều cần một cái tên đã băm, có giới hạn, <em>và</em> một TTL, không thì nó là một chỗ rò bộ nhớ với giao diện thân thiện.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — How expiration really works|||2.2 — Hết hạn thật sự hoạt động ra sao',
      slug: 'rd-2-2-het-han',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sáu câu lệnh đặt TTL, hết hạn lười với hết hạn chủ động, một khoá nán lại bao lâu sau TTL, vì sao bản sao không tự xoá, những câu lệnh âm thầm xoá TTL, và TTL cho từng trường hash ở 7.4.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>How expiration really works</h2>
<p class="lead">Almost everyone assumes a key with <code>EX 60</code> disappears exactly sixty seconds later. It does not — it becomes <em>logically</em> expired at sixty seconds and is physically removed at some later, unpredictable moment. That distinction is invisible until you are counting keys, measuring memory, or wondering why a replica still holds something the primary does not.</p>

<h3>The six ways to set a TTL</h3>
<pre><code>redis-cli SET s:1 v EX 60                <span class="tok-comment"># seconds</span>
redis-cli SET s:2 v PX 60000             <span class="tok-comment"># milliseconds</span>
redis-cli SET s:3 v EXAT 1787000000      <span class="tok-comment"># absolute unix time, seconds</span>
redis-cli EXPIRE s:4 60                  <span class="tok-comment"># on an existing key</span>
redis-cli PEXPIREAT s:5 1787000000000    <span class="tok-comment"># absolute, milliseconds</span>
redis-cli SET s:6 v KEEPTTL              <span class="tok-comment"># overwrite value, keep the existing TTL</span>
redis-cli TTL s:1; redis-cli PTTL s:1; redis-cli EXPIRETIME s:1</code></pre>
<div class="out">(integer) 58
(integer) 57841
(integer) 1786998412</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SET</code> without <code>KEEPTTL</code> clears the TTL</span><span class="v">This is the trap. <code>SET session:x '{...}'</code> on a key that had 300 seconds left leaves it immortal. Use <code>KEEPTTL</code>, or always re-specify <code>EX</code>.</span></div>
  <div class="kv"><span class="k"><code>EXPIRE</code> options (7.0+)</span><span class="v"><code>NX</code> only if no TTL, <code>XX</code> only if there is one, <code>GT</code>/<code>LT</code> only if greater/less than the current. <code>EXPIRE k 3600 GT</code> extends a session without ever shortening it.</span></div>
  <div class="kv"><span class="k">Absolute versus relative</span><span class="v"><code>EXAT</code> pins an exact moment, which is what you want for "expires at midnight" — no drift if the key is rewritten. <code>EX</code> restarts the countdown each time.</span></div>
  <div class="kv"><span class="k"><code>PERSIST</code> removes it</span><span class="v">Returns 1 if a TTL was removed, 0 if there was none. The explicit way to make a key immortal.</span></div>
  <div class="kv"><span class="k">TTL survives most writes</span><span class="v"><code>INCR</code>, <code>APPEND</code>, <code>LPUSH</code>, <code>HSET</code>, <code>SADD</code> and every other in-place modification keep the TTL. Only commands that <em>replace</em> the key clear it.</span></div>
</div>

<h3>The commands that silently clear a TTL</h3>
<pre><code>redis-cli SET k v EX 100; redis-cli TTL k
redis-cli SET k other;    redis-cli TTL k
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli GETSET k new; redis-cli TTL k
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli INCR counter &gt;/dev/null
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli APPEND k "!" &gt;/dev/null; redis-cli TTL k</code></pre>
<div class="out">(integer) 100
(integer) -1
"v"
(integer) -1
(integer) 100</div>
<div class="callout warn"><strong><code>SET</code> and <code>GETSET</code> clear the TTL; <code>APPEND</code> keeps it.</strong> The rule is whether the command conceptually creates a new value or modifies the existing one — and it is not always obvious which category a command falls into. This is the mechanism behind the most common Redis memory leak: a session store that refreshes sessions with a plain <code>SET</code>, so every active user's session becomes permanent, and the keyspace grows forever while <code>expires</code> in <code>INFO keyspace</code> quietly falls behind the key count.</div>

<h3>Lazy and active expiration</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lazy: on access</span><span class="lz-t">every read checks the TTL first</span><span class="lz-d">Touch an expired key and Redis deletes it and answers as though it were absent. Costs nothing when nobody looks — and means a key nobody reads can sit in memory long past its TTL.</span></div>
  <div class="lz-step"><span class="lz-k">Active: sampled, 10× per second</span><span class="lz-t">20 random keys from the expires dict</span><span class="lz-d">If more than 25% of the sample was expired, do it again immediately. Probabilistic, and deliberately capped so it cannot monopolise the single thread.</span></div>
  <div class="lz-step"><span class="lz-k">The guarantee that results</span><span class="lz-t">at most ~25% of keys are expired-but-present, statistically</span><span class="lz-d">Not a hard bound and not a deadline. If a million keys expire at the same instant, they are removed over the following seconds, not immediately.</span></div>
  <div class="lz-step"><span class="lz-k">Under memory pressure</span><span class="lz-t">eviction handles what expiration has not</span><span class="lz-d">With <code>maxmemory</code> set and a <code>volatile-*</code> policy, keys with a TTL are candidates for eviction — which can remove them well <em>before</em> their TTL (Chapter 9).</span></div>
</div>
<pre><code><span class="tok-comment"># Write 200,000 keys that all expire at the same moment, then watch them go</span>
for i in $(seq 1 200000); do echo "SET t:$i v EX 5"; done | redis-cli --pipe &gt;/dev/null
sleep 5
for i in 0 1 2 3 5 8; do
  printf '%2ds  keys=%-8s expired=%s\\n' "$i" \\
    "$(redis-cli DBSIZE)" "$(redis-cli INFO stats | grep -oP 'expired_keys:\\K\\d+')"
  sleep 1
done</code></pre>
<div class="out"> 0s  keys=200000   expired=0
 1s  keys=183441   expired=16559
 2s  keys=141208   expired=58792
 3s  keys=96117    expired=103883
 5s  keys=21440    expired=178560
 8s  keys=0        expired=200000</div>
<div class="callout ok"><strong>Eight seconds to remove 200,000 keys that all expired at second five.</strong> Nothing is wrong — this is active expiration doing exactly what it is designed to do, deliberately spreading the work so the single thread stays responsive. The operational consequence is that <code>DBSIZE</code> and <code>used_memory</code> lag reality after a mass expiry, so a memory graph that stays flat for a few seconds after a TTL wave is normal rather than alarming.</div>

<h3>Replicas do not expire keys themselves</h3>
<pre><code><span class="tok-comment"># On the replica, reading a logically expired key</span>
redis-cli -p 6380 DBSIZE
redis-cli -p 6380 GET t:5
redis-cli -p 6380 DBSIZE
redis-cli -p 6380 INFO stats | grep expired_keys</code></pre>
<div class="out">(integer) 1284
(nil)
(integer) 1284
expired_keys:0</div>
<p>The replica returned <code>nil</code> — correct — but the key is still counted and <code>expired_keys</code> is zero. A replica never deletes on its own: it waits for the primary to send an explicit <code>DEL</code>. That is what keeps a read on the primary and the same read on a replica from disagreeing, and it is why a replica's <code>DBSIZE</code> can legitimately exceed the primary's for a while. Do not treat that gap as replication lag.</p>

<h3>Per-field TTL on hashes, new in 7.4</h3>
<pre><code>redis-cli HSET cart:1042 item:1 2 item:2 1 item:3 5
redis-cli HEXPIRE cart:1042 30 FIELDS 1 item:1
redis-cli HTTL   cart:1042 FIELDS 3 item:1 item:2 item:3
redis-cli HPERSIST cart:1042 FIELDS 1 item:1</code></pre>
<div class="out">1) (integer) 1
1) (integer) 29
2) (integer) -1
3) (integer) -1
1) (integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What it solves</span><span class="v">Before 7.4, a TTL applied to the whole key — so "expire this one cart item" meant one key per item, and the per-key overhead from Lesson 2.1 multiplied.</span></div>
  <div class="kv"><span class="k">Return codes</span><span class="v"><code>-2</code> no such field, <code>-1</code> field exists with no TTL, a positive number is seconds. Same convention as <code>TTL</code>, applied per field.</span></div>
  <div class="kv"><span class="k">The key disappears when empty</span><span class="v">If every field expires, the hash key is deleted like any other empty collection. That is usually what you want, and occasionally a surprise.</span></div>
  <div class="kv"><span class="k">Requires 7.4</span><span class="v">On 7.0–7.2 the workaround is separate keys or a sorted set scored by expiry time that you sweep yourself.</span></div>
  <div class="kv"><span class="k">Encoding note</span><span class="v">A hash with field TTLs uses a different internal encoding, so <code>OBJECT ENCODING</code> reports <code>listpackex</code> instead of <code>listpack</code>. Slightly more memory per field; still far less than one key each.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/expire/" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">EXPIRE, and how expiration works</span><span class="lc-sub">The command page contains the best description of lazy versus active expiration, the sampling algorithm, and the exact replica semantics. Worth reading in full once.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/hexpire/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">HEXPIRE and hash field expiration</span><span class="lc-sub">The 7.4 family: <code>HEXPIRE</code>, <code>HPEXPIRE</code>, <code>HEXPIREAT</code>, <code>HTTL</code>, <code>HPERSIST</code>, <code>HGETEX</code>. Covers the return codes and the interaction with keyspace notifications.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: TTL behaviour</span><span class="lc-sub">Graded exercises: predict the TTL after six different write commands, watch 200,000 keys expire over several seconds, and explain why a replica's <code>DBSIZE</code> is higher than the primary's.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> refreshing a session with a plain <code>SET</code>. The code reads naturally — load the session, update <code>lastSeen</code>, write it back — and it removes the TTL every single time, so each active user's session key becomes permanent. Nothing breaks that day. What you see weeks later is memory climbing steadily with no obvious cause, and in <code>INFO keyspace</code> a <code>keys</code> count that keeps growing while <code>expires</code> stays flat: that divergence is the diagnostic, and it is worth graphing. There are three correct forms and you should pick one deliberately: <code>SET key value KEEPTTL</code> to preserve the remaining time, <code>SET key value EX 1800</code> to restart the window (usually what a session actually wants), or <code>EXPIRE key 1800 GT</code> to extend without ever shortening. The same trap exists with <code>GETSET</code> and with any <code>RENAME</code> onto an existing key.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A key with a TTL is removed lazily on access or by a sampled background job — not on time — so <code>DBSIZE</code> and memory lag a mass expiry by seconds, which is normal. <code>SET</code> and <code>GETSET</code> clear the TTL while <code>INCR</code>, <code>APPEND</code>, <code>HSET</code> and friends preserve it; watch <code>keys</code> versus <code>expires</code> in <code>INFO keyspace</code> to catch the leak. And a replica never expires anything itself — it waits for a <code>DEL</code> from the primary, which is why its key count can legitimately be higher.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Hết hạn thật sự hoạt động ra sao</h2>
<p class="lead">Gần như ai cũng cho rằng một cái khoá đặt <code>EX 60</code> sẽ biến mất đúng sáu mươi giây sau. Không phải vậy — nó trở nên hết hạn về mặt <em>LÔ-GÍC</em> ở giây thứ sáu mươi và bị gỡ đi về mặt VẬT LÝ vào một khoảnh khắc muộn hơn, không đoán trước được. Phân biệt đó vô hình cho tới lúc bạn ngồi đếm khoá, đo bộ nhớ, hoặc thắc mắc vì sao một bản sao vẫn giữ thứ mà máy chính đã bỏ.</p>

<h3>Sáu cách đặt TTL</h3>
<pre><code>redis-cli SET s:1 v EX 60                <span class="tok-comment"># giây</span>
redis-cli SET s:2 v PX 60000             <span class="tok-comment"># mili giây</span>
redis-cli SET s:3 v EXAT 1787000000      <span class="tok-comment"># mốc unix tuyệt đối, tính bằng giây</span>
redis-cli EXPIRE s:4 60                  <span class="tok-comment"># trên một khoá đã có</span>
redis-cli PEXPIREAT s:5 1787000000000    <span class="tok-comment"># tuyệt đối, mili giây</span>
redis-cli SET s:6 v KEEPTTL              <span class="tok-comment"># ghi đè giá trị, GIỮ nguyên TTL đang có</span>
redis-cli TTL s:1; redis-cli PTTL s:1; redis-cli EXPIRETIME s:1</code></pre>
<div class="out">(integer) 58
(integer) 57841
(integer) 1786998412</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>SET</code> không kèm <code>KEEPTTL</code> sẽ XOÁ TTL</span><span class="v">Đây là cái bẫy. Lệnh <code>SET session:x '{...}'</code> trên một khoá còn 300 giây sẽ khiến nó trở thành bất tử. Hãy dùng <code>KEEPTTL</code>, hoặc luôn ghi lại <code>EX</code>.</span></div>
  <div class="kv"><span class="k">Tuỳ chọn của <code>EXPIRE</code> (7.0+)</span><span class="v"><code>NX</code> chỉ khi chưa có TTL, <code>XX</code> chỉ khi đã có, <code>GT</code>/<code>LT</code> chỉ khi lớn hơn/nhỏ hơn giá trị hiện tại. <code>EXPIRE k 3600 GT</code> gia hạn một phiên mà không bao giờ rút ngắn nó.</span></div>
  <div class="kv"><span class="k">Tuyệt đối so với tương đối</span><span class="v"><code>EXAT</code> ghim một khoảnh khắc chính xác, và đó là thứ bạn cần cho "hết hạn lúc nửa đêm" — không trôi dạt khi khoá bị ghi lại. <code>EX</code> thì khởi động lại bộ đếm ngược mỗi lần.</span></div>
  <div class="kv"><span class="k"><code>PERSIST</code> gỡ nó ra</span><span class="v">Trả 1 nếu có một TTL bị gỡ, 0 nếu vốn không có. Đây là cách tường minh để làm một khoá bất tử.</span></div>
  <div class="kv"><span class="k">TTL sống sót qua phần lớn lệnh ghi</span><span class="v"><code>INCR</code>, <code>APPEND</code>, <code>LPUSH</code>, <code>HSET</code>, <code>SADD</code> và mọi phép sửa đổi tại chỗ khác đều GIỮ TTL. Chỉ những câu lệnh <em>THAY THẾ</em> cả cái khoá mới xoá nó.</span></div>
</div>

<h3>Những câu lệnh âm thầm xoá TTL</h3>
<pre><code>redis-cli SET k v EX 100; redis-cli TTL k
redis-cli SET k other;    redis-cli TTL k
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli GETSET k new; redis-cli TTL k
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli INCR counter &gt;/dev/null
redis-cli SET k v EX 100 &gt;/dev/null; redis-cli APPEND k "!" &gt;/dev/null; redis-cli TTL k</code></pre>
<div class="out">(integer) 100
(integer) -1
"v"
(integer) -1
(integer) 100</div>
<div class="callout warn"><strong><code>SET</code> và <code>GETSET</code> xoá TTL; <code>APPEND</code> thì giữ.</strong> Cái luật nằm ở chỗ câu lệnh đó về mặt khái niệm là TẠO RA một giá trị mới hay SỬA giá trị đang có — và không phải lúc nào cũng hiển nhiên một câu lệnh rơi vào nhóm nào. Đây chính là cơ chế đằng sau chỗ rò bộ nhớ phổ biến nhất của Redis: một kho phiên đăng nhập làm mới phiên bằng một lệnh <code>SET</code> trơn, nên phiên của mọi người dùng đang hoạt động trở thành vĩnh viễn, và không gian khoá phình ra mãi trong khi con số <code>expires</code> trong <code>INFO keyspace</code> lặng lẽ tụt lại sau số khoá.</div>

<h3>Hết hạn lười và hết hạn chủ động</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lười: khi có người truy cập</span><span class="lz-t">mọi lệnh đọc đều kiểm TTL trước</span><span class="lz-d">Chạm vào một khoá đã hết hạn thì Redis xoá nó rồi trả lời như thể nó vắng mặt. Không tốn gì khi không ai ngó tới — và điều đó nghĩa là một khoá không ai đọc có thể nằm trong bộ nhớ rất lâu sau TTL của nó.</span></div>
  <div class="lz-step"><span class="lz-k">Chủ động: lấy mẫu, 10 lần mỗi giây</span><span class="lz-t">20 khoá ngẫu nhiên từ từ điển expires</span><span class="lz-d">Nếu hơn 25% mẫu đã hết hạn thì làm lại ngay lập tức. Mang tính xác suất, và bị chặn trần một cách có chủ đích để nó không độc chiếm được cái luồng duy nhất.</span></div>
  <div class="lz-step"><span class="lz-k">Cái bảo đảm rút ra được</span><span class="lz-t">về mặt thống kê, tối đa ~25% số khoá là đã-hết-hạn-mà-còn-đó</span><span class="lz-d">Không phải một cận cứng và không phải một cái hạn chót. Nếu một triệu khoá cùng hết hạn tại một thời điểm thì chúng được gỡ đi trong vài giây sau đó, không phải ngay lập tức.</span></div>
  <div class="lz-step"><span class="lz-k">Khi bộ nhớ căng</span><span class="lz-t">việc đẩy khoá lo nốt phần hết hạn chưa lo</span><span class="lz-d">Với <code>maxmemory</code> đã đặt và một chính sách <code>volatile-*</code>, những khoá có TTL trở thành ứng viên bị đẩy đi — thứ có thể gỡ chúng đi rất lâu TRƯỚC TTL của chúng (Chương 9).</span></div>
</div>
<pre><code><span class="tok-comment"># Ghi 200.000 khoá cùng hết hạn tại một thời điểm, rồi nhìn chúng biến đi</span>
for i in $(seq 1 200000); do echo "SET t:$i v EX 5"; done | redis-cli --pipe &gt;/dev/null
sleep 5
for i in 0 1 2 3 5 8; do
  printf '%2ds  keys=%-8s expired=%s\\n' "$i" \\
    "$(redis-cli DBSIZE)" "$(redis-cli INFO stats | grep -oP 'expired_keys:\\K\\d+')"
  sleep 1
done</code></pre>
<div class="out"> 0s  keys=200000   expired=0
 1s  keys=183441   expired=16559
 2s  keys=141208   expired=58792
 3s  keys=96117    expired=103883
 5s  keys=21440    expired=178560
 8s  keys=0        expired=200000</div>
<div class="callout ok"><strong>Tám giây để gỡ 200.000 khoá vốn đều hết hạn ở giây thứ năm.</strong> Không có gì sai cả — đây là hết hạn chủ động đang làm đúng thứ nó được thiết kế để làm, cố ý rải công việc ra để cái luồng duy nhất vẫn đáp ứng được. Hệ quả vận hành là <code>DBSIZE</code> và <code>used_memory</code> tụt lại sau thực tế sau một đợt hết hạn hàng loạt, nên một biểu đồ bộ nhớ nằm ngang vài giây sau một làn sóng TTL là chuyện bình thường chứ không đáng báo động.</div>

<h3>Bản sao KHÔNG tự làm hết hạn khoá</h3>
<pre><code><span class="tok-comment"># Trên bản sao, đọc một khoá đã hết hạn về mặt lô-gíc</span>
redis-cli -p 6380 DBSIZE
redis-cli -p 6380 GET t:5
redis-cli -p 6380 DBSIZE
redis-cli -p 6380 INFO stats | grep expired_keys</code></pre>
<div class="out">(integer) 1284
(nil)
(integer) 1284
expired_keys:0</div>
<p>Bản sao trả về <code>nil</code> — đúng — nhưng cái khoá vẫn được đếm và <code>expired_keys</code> bằng không. Một bản sao không bao giờ tự xoá: nó CHỜ máy chính gửi một lệnh <code>DEL</code> tường minh. Đó là thứ giữ cho một lệnh đọc trên máy chính và cũng lệnh đọc đó trên bản sao không bao giờ nói khác nhau, và đó là lý do <code>DBSIZE</code> của một bản sao có thể vượt của máy chính một cách chính đáng trong một lúc. Đừng coi khoảng chênh đó là độ trễ nhân bản.</p>

<h3>TTL cho từng trường hash, mới ở 7.4</h3>
<pre><code>redis-cli HSET cart:1042 item:1 2 item:2 1 item:3 5
redis-cli HEXPIRE cart:1042 30 FIELDS 1 item:1
redis-cli HTTL   cart:1042 FIELDS 3 item:1 item:2 item:3
redis-cli HPERSIST cart:1042 FIELDS 1 item:1</code></pre>
<div class="out">1) (integer) 1
1) (integer) 29
2) (integer) -1
3) (integer) -1
1) (integer) 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó giải quyết gì</span><span class="v">Trước 7.4, TTL áp cho CẢ CÁI KHOÁ — nên "cho riêng món này trong giỏ hết hạn" nghĩa là mỗi món một khoá, và chi phí trên mỗi khoá ở Bài 2.1 được nhân lên.</span></div>
  <div class="kv"><span class="k">Mã trả về</span><span class="v"><code>-2</code> không có trường đó, <code>-1</code> trường tồn tại và không có TTL, số dương là số giây. Cùng quy ước với <code>TTL</code>, áp cho từng trường.</span></div>
  <div class="kv"><span class="k">Khoá biến mất khi rỗng</span><span class="v">Nếu mọi trường đều hết hạn thì khoá hash bị xoá như mọi tập hợp rỗng khác. Đó thường là điều bạn muốn, và thỉnh thoảng là một bất ngờ.</span></div>
  <div class="kv"><span class="k">Cần 7.4</span><span class="v">Trên 7.0–7.2, cách đi vòng là dùng các khoá riêng hoặc một sorted set chấm điểm theo thời điểm hết hạn rồi bạn tự quét dọn.</span></div>
  <div class="kv"><span class="k">Ghi chú về mã hoá</span><span class="v">Một hash có TTL theo trường dùng một cách mã hoá nội bộ khác, nên <code>OBJECT ENCODING</code> báo <code>listpackex</code> thay vì <code>listpack</code>. Tốn thêm chút bộ nhớ mỗi trường; vẫn ít hơn hẳn so với mỗi trường một khoá.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/expire/" target="_blank" rel="noopener">
  <span class="lc-ico">⏳</span>
  <span class="lc-body"><span class="lc-title">EXPIRE, và cơ chế hết hạn</span><span class="lc-sub">Trang câu lệnh này chứa mô tả tốt nhất về hết hạn lười so với chủ động, thuật toán lấy mẫu, và ngữ nghĩa chính xác ở phía bản sao. Đáng đọc trọn vẹn một lần.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/hexpire/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">HEXPIRE và hết hạn theo trường hash</span><span class="lc-sub">Bộ lệnh của 7.4: <code>HEXPIRE</code>, <code>HPEXPIRE</code>, <code>HEXPIREAT</code>, <code>HTTL</code>, <code>HPERSIST</code>, <code>HGETEX</code>. Bao gồm mã trả về và tương tác với thông báo không gian khoá.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: hành vi của TTL</span><span class="lc-sub">Bài chấm điểm: đoán TTL sau sáu câu lệnh ghi khác nhau, xem 200.000 khoá hết hạn trải qua vài giây, và giải thích vì sao <code>DBSIZE</code> của một bản sao cao hơn của máy chính.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> làm mới một phiên đăng nhập bằng một lệnh <code>SET</code> trơn. Đoạn mã đọc lên rất tự nhiên — nạp phiên, cập nhật <code>lastSeen</code>, ghi ngược lại — và nó XOÁ TTL ở từng lần một, nên khoá phiên của mỗi người dùng đang hoạt động trở thành vĩnh viễn. Hôm đó chẳng có gì hỏng. Thứ bạn thấy vài tuần sau là bộ nhớ leo lên đều đặn không rõ nguyên nhân, và trong <code>INFO keyspace</code> là một con số <code>keys</code> cứ tăng trong khi <code>expires</code> nằm im: chính khoảng phân kỳ đó là phép chẩn đoán, và nó đáng được vẽ lên biểu đồ. Có ba dạng đúng và bạn nên chọn một cách có chủ đích: <code>SET key value KEEPTTL</code> để giữ nguyên thời gian còn lại, <code>SET key value EX 1800</code> để khởi động lại cửa sổ (thường là thứ một phiên đăng nhập thật sự cần), hoặc <code>EXPIRE key 1800 GT</code> để gia hạn mà không bao giờ rút ngắn. Cùng cái bẫy đó tồn tại với <code>GETSET</code> và với mọi lệnh <code>RENAME</code> đè lên một khoá đã có.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một khoá có TTL bị gỡ đi một cách LƯỜI khi có người truy cập hoặc bởi một việc nền lấy mẫu — không phải đúng giờ — nên <code>DBSIZE</code> với bộ nhớ tụt lại sau một đợt hết hạn hàng loạt vài giây, và đó là bình thường. <code>SET</code> với <code>GETSET</code> xoá TTL còn <code>INCR</code>, <code>APPEND</code>, <code>HSET</code> và đồng bọn thì giữ; hãy canh <code>keys</code> so với <code>expires</code> trong <code>INFO keyspace</code> để bắt chỗ rò. Và một bản sao không bao giờ tự làm hết hạn thứ gì — nó chờ một lệnh <code>DEL</code> từ máy chính, và đó là lý do số khoá của nó có thể cao hơn một cách chính đáng.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Finding and deleting keys safely|||2.3 — Tìm và xoá khoá một cách an toàn',
      slug: 'rd-2-3-scan-unlink',
      type: 'LESSON',
      description: 'SCAN bảo đảm gì và KHÔNG bảo đảm gì, COUNT với TYPE, các biến thể HSCAN/SSCAN/ZSCAN, DEL khác UNLINK, xoá theo mẫu cho đúng, và vì sao FLUSHALL ASYNC vẫn nguy hiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Finding and deleting keys safely</h2>
<p class="lead">Two operations that look trivial and take down production instances: listing keys and deleting them. Both have a safe form and a dangerous one, the dangerous ones are the obvious ones, and the difference between them is entirely about how long the single thread is held.</p>

<h3>SCAN, and what it actually guarantees</h3>
<pre><code>redis-cli SCAN 0 MATCH 'user:*' COUNT 100
redis-cli SCAN 4096 MATCH 'user:*' COUNT 100</code></pre>
<div class="out">1) "4096"
2) 1) "user:1042:profile"
   2) "user:1042:sessions"
1) "0"
2) 1) "user:2091:profile"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A cursor, not an offset</span><span class="v">The number is an internal position in the hash table, encoded so it survives rehashing. Start at 0, stop when it returns 0. Do not interpret it, store it long-term, or expect it to increase.</span></div>
  <div class="kv"><span class="k">Guaranteed: keys present throughout</span><span class="v">A key that exists from the start of the iteration to the end is returned <em>at least once</em>. That is the only strong guarantee, and it is enough for almost every use.</span></div>
  <div class="kv"><span class="k">Not guaranteed: no duplicates</span><span class="v">The same key can appear in two batches. Deduplicate with a <code>Set</code> if it matters — for a delete loop it usually does not, since deleting twice is harmless.</span></div>
  <div class="kv"><span class="k">Not guaranteed: keys added mid-scan</span><span class="v">A key created after you started may or may not appear. <code>SCAN</code> is a view of a moving target, not a snapshot.</span></div>
  <div class="kv"><span class="k"><code>MATCH</code> filters after fetching</span><span class="v">The pattern is applied to the batch <em>after</em> it is read, so <code>MATCH 'rare:*'</code> can return zero keys many times in a row while still doing work. An empty batch does not mean you are finished — only a cursor of 0 does.</span></div>
</div>
<pre><code><span class="tok-comment"># COUNT is a hint about work per call, not the number of results</span>
redis-cli --no-raw SCAN 0 COUNT 10   | head -1
redis-cli --no-raw SCAN 0 COUNT 1000 | head -1
redis-cli SCAN 0 TYPE hash COUNT 1000 | tail -2</code></pre>
<div class="out">1) "17408"
1) "9216"
1) "user:1042"
2) "cart:1042"</div>
<div class="callout ok"><strong><code>COUNT</code> controls how much work each call does, and 100–1000 is the useful range.</strong> Too low and you make thousands of round trips; too high and each call is a long blocking operation, which defeats the point of <code>SCAN</code> entirely. <code>TYPE</code> (6.0+) filters server-side and is genuinely useful — it is how you find every hash without pulling back and testing the whole keyspace.</div>

<h3>The collection variants</h3>
<pre><code>redis-cli HSCAN user:1042 0 COUNT 10
redis-cli SSCAN post:77:likes 0 MATCH '10*'
redis-cli ZSCAN leaderboard 0 COUNT 5
redis-cli HSCAN user:1042 0 NOVALUES        <span class="tok-comment"># 7.4: field names only</span></code></pre>
<div class="out">1) "0"
2) 1) "name"
   2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
   3) "plan"
   4) "pro"
1) "0"
2) 1) "1042"
1) "0"
2) 1) "alice"
   2) "1520"
1) "0"
2) 1) "name"
   2) "plan"</div>
<p>These are the safe replacements for <code>HGETALL</code>, <code>SMEMBERS</code> and <code>ZRANGE 0 -1</code> on a collection you did not size yourself. A hash with two million fields will block the server for a noticeable time under <code>HGETALL</code>; <code>HSCAN</code> walks it in bites. The <code>NOVALUES</code> option in 7.4 halves the traffic when you only need field names.</p>

<h3>DEL versus UNLINK</h3>
<pre><code><span class="tok-comment"># Build one enormous set, then time both ways of removing it</span>
for i in $(seq 1 5000000); do echo "SADD big m:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli SCARD big
redis-cli MEMORY USAGE big

time redis-cli DEL big
<span class="tok-comment"># …rebuild, then:</span>
time redis-cli UNLINK big</code></pre>
<div class="out">(integer) 5000000
(integer) 412184088
(integer) 1
real	0m0.412s
(integer) 1
real	0m0.002s</div>
<div class="callout warn"><strong>412 milliseconds of total server freeze, versus 2.</strong> <code>DEL</code> frees every element inline on the main thread; <code>UNLINK</code> removes the key from the keyspace immediately and hands the memory to a background thread. During those 412ms every other client waited — a healthcheck timeout, a connection pool exhaustion, and an alert, all from deleting one key. <strong>Use <code>UNLINK</code> as your default</strong>; it behaves identically for small keys (Redis frees those inline anyway, since a background hop would cost more than the work).</div>
<pre><code>redis-cli CONFIG GET lazyfree-lazy-user-del
redis-cli CONFIG SET lazyfree-lazy-user-del yes    <span class="tok-comment"># make DEL behave like UNLINK</span>
redis-cli CONFIG GET lazyfree-lazy-expire
redis-cli CONFIG GET lazyfree-lazy-eviction</code></pre>
<div class="out">1) "lazyfree-lazy-user-del"
2) "no"
OK
1) "lazyfree-lazy-expire"
2) "no"
1) "lazyfree-lazy-eviction"
2) "no"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>lazyfree-lazy-user-del</code></span><span class="v">Makes every <code>DEL</code> behave like <code>UNLINK</code>. Turn it on — it removes an entire class of latency spike caused by code you did not write.</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-expire</code></span><span class="v">Frees expired keys in the background. Matters when large collections expire, which otherwise blocks at the moment of expiry rather than at your command.</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-eviction</code></span><span class="v">Same, for keys evicted under memory pressure — precisely when you can least afford a stall (Chapter 9).</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-server-del</code></span><span class="v">For implicit deletions, such as a <code>RENAME</code> overwriting a large destination key. Easy to forget and the same class of problem.</span></div>
  <div class="kv"><span class="k">All four default to <code>no</code></span><span class="v">For historical compatibility. Turning all four on is one of the cheapest latency improvements available, and there is no meaningful downside on a modern kernel.</span></div>
</div>

<h3>Deleting by pattern, correctly</h3>
<pre><code><span class="tok-comment"># ❌ The one everybody writes, and the one that freezes the server</span>
redis-cli DEL $(redis-cli KEYS 'cache:v2:*')

<span class="tok-comment"># ✅ Scan and unlink in batches</span>
redis-cli --scan --pattern 'cache:v2:*' | xargs -L 500 redis-cli UNLINK

<span class="tok-comment"># ✅ Or without shelling out, from the application</span>
let cursor = '0';
do {
  const [next, keys] = await redis.scan(cursor, 'MATCH', 'cache:v2:*', 'COUNT', 500);
  if (keys.length) await redis.unlink(...keys);
  cursor = next;
} while (cursor !== '0');</code></pre>
<div class="out">(integer) 500
(integer) 500
(integer) 184</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Better: give them a TTL instead</span><span class="lz-t">nothing to delete if it expires itself</span><span class="lz-d">Most pattern deletions are cleaning up cache entries that should have had a TTL. Fix the write path and the delete problem disappears permanently.</span></div>
  <div class="lz-step"><span class="lz-k">Better: bump a version prefix</span><span class="lz-t">cache:v2: → cache:v3:</span><span class="lz-d">Instant, atomic and free (Lesson 2.1). The old keys expire on their own; you never scan anything.</span></div>
  <div class="lz-step"><span class="lz-k">Acceptable: SCAN + UNLINK in batches</span><span class="lz-t">for a one-off cleanup</span><span class="lz-d">Slow in total, invisible to everyone else. Correct when you genuinely must remove keys that have no TTL.</span></div>
  <div class="lz-step"><span class="lz-k">Never: KEYS piped into DEL</span><span class="lz-t">two blocking operations back to back</span><span class="lz-d"><code>KEYS</code> walks the whole keyspace, then <code>DEL</code> frees everything inline. On a large instance this is a multi-second outage, twice.</span></div>
</div>

<h3>FLUSHDB, FLUSHALL, and their ASYNC forms</h3>
<pre><code>redis-cli DBSIZE
time redis-cli FLUSHDB ASYNC
redis-cli DBSIZE
redis-cli INFO memory | grep -E 'used_memory_human|lazyfree_pending'</code></pre>
<div class="out">(integer) 1284419
OK
real	0m0.004s
(integer) 0
used_memory_human:398.21M
lazyfreed_objects:0</div>
<div class="callout warn"><strong><code>ASYNC</code> makes the freeze go away; it does not make the command safe.</strong> The keyspace is empty in four milliseconds and the memory is reclaimed in the background — but the data is just as gone. There is no confirmation prompt, no undo, and no way to distinguish "I meant this database" from "I was on the wrong host". Note also that <code>used_memory</code> is still 398MB immediately afterwards, because the background thread has not finished; a memory graph that does not drop instantly after a flush is expected. In production, restrict both commands by ACL (Chapter 10) — that is the only reliable protection.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/scan/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">SCAN</span><span class="lc-sub">The complete guarantees, the cursor algorithm and why it survives rehashing, plus <code>MATCH</code>, <code>COUNT</code>, <code>TYPE</code> and the collection variants. The reverse-binary cursor trick is genuinely clever and worth reading.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/unlink/" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">UNLINK and lazy freeing</span><span class="lc-sub">How the background free thread works and when Redis decides an object is big enough to be worth handing off. Explains why <code>UNLINK</code> on a small key is not slower than <code>DEL</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: scan and delete safely</span><span class="lc-sub">Graded exercises: write a correct <code>SCAN</code> loop that terminates, measure <code>DEL</code> against <code>UNLINK</code> on a five-million-element set, and rewrite three dangerous cleanup scripts.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> writing a <code>SCAN</code> loop that stops on an empty batch. The code looks reasonable — scan, get keys, if there are none we must be done — and it is wrong, because <code>MATCH</code> filters <em>after</em> the batch is fetched. Scanning a million keys for <code>MATCH 'lock:*'</code> will return empty batches for most of the iteration while the cursor is still marching through the hash table, so a loop with <code>while (keys.length)</code> exits after the first batch and silently processes a fraction of the keyspace. The termination condition is the cursor and only the cursor: loop until <code>SCAN</code> returns <code>"0"</code>. The same mistake in reverse is a loop that never terminates because it stores the cursor as a number and drops a large value's precision — cursors are 64-bit and must be treated as opaque strings in JavaScript.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>SCAN</code> guarantees only that keys present for the whole iteration appear at least once — duplicates happen, and an empty batch means nothing because <code>MATCH</code> filters after fetching. Terminate on a cursor of <code>"0"</code>, never on an empty result. And make <code>UNLINK</code> your default over <code>DEL</code>: deleting one five-million-element set froze the server for 412ms, versus 2ms — then turn on all four <code>lazyfree-*</code> settings so the same protection applies to expiry, eviction and code you did not write.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Tìm và xoá khoá một cách an toàn</h2>
<p class="lead">Hai thao tác trông tầm thường mà đánh sập được instance production: liệt kê khoá và xoá khoá. Cả hai đều có một dạng AN TOÀN và một dạng NGUY HIỂM, những cái nguy hiểm lại chính là những cái hiển nhiên, và khác biệt giữa chúng hoàn toàn nằm ở chuyện cái luồng duy nhất bị giữ bao lâu.</p>

<h3>SCAN, và nó thật sự bảo đảm gì</h3>
<pre><code>redis-cli SCAN 0 MATCH 'user:*' COUNT 100
redis-cli SCAN 4096 MATCH 'user:*' COUNT 100</code></pre>
<div class="out">1) "4096"
2) 1) "user:1042:profile"
   2) "user:1042:sessions"
1) "0"
2) 1) "user:2091:profile"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một CON TRỎ, không phải một vị trí offset</span><span class="v">Con số đó là một vị trí nội bộ trong bảng băm, mã hoá sao cho nó sống sót qua việc băm lại. Bắt đầu ở 0, dừng khi nó trả về 0. Đừng diễn giải nó, đừng lưu nó lâu dài, và đừng trông đợi nó tăng dần.</span></div>
  <div class="kv"><span class="k">Được bảo đảm: khoá có mặt suốt lượt duyệt</span><span class="v">Một khoá tồn tại từ lúc bắt đầu tới lúc kết thúc lượt duyệt sẽ được trả về <em>ÍT NHẤT MỘT LẦN</em>. Đó là bảo đảm mạnh DUY NHẤT, và nó đủ cho gần như mọi tình huống.</span></div>
  <div class="kv"><span class="k">Không bảo đảm: không trùng lặp</span><span class="v">Cùng một khoá có thể xuất hiện ở hai mẻ. Hãy khử trùng lặp bằng một <code>Set</code> nếu điều đó quan trọng — với một vòng lặp xoá thì thường là không, vì xoá hai lần cũng vô hại.</span></div>
  <div class="kv"><span class="k">Không bảo đảm: khoá thêm vào giữa chừng</span><span class="v">Một khoá tạo ra sau khi bạn bắt đầu thì có thể xuất hiện hoặc không. <code>SCAN</code> là một góc nhìn vào một mục tiêu đang động, không phải một ảnh chụp.</span></div>
  <div class="kv"><span class="k"><code>MATCH</code> lọc SAU khi đã lấy về</span><span class="v">Mẫu được áp lên mẻ dữ liệu <em>SAU</em> khi nó được đọc, nên <code>MATCH 'rare:*'</code> có thể trả về không khoá nào nhiều lần liên tiếp trong khi vẫn đang làm việc. Một mẻ RỖNG không có nghĩa là bạn đã xong — chỉ con trỏ bằng 0 mới có nghĩa đó.</span></div>
</div>
<pre><code><span class="tok-comment"># COUNT là gợi ý về khối lượng công việc mỗi lời gọi, không phải số kết quả</span>
redis-cli --no-raw SCAN 0 COUNT 10   | head -1
redis-cli --no-raw SCAN 0 COUNT 1000 | head -1
redis-cli SCAN 0 TYPE hash COUNT 1000 | tail -2</code></pre>
<div class="out">1) "17408"
1) "9216"
1) "user:1042"
2) "cart:1042"</div>
<div class="callout ok"><strong><code>COUNT</code> điều khiển mỗi lời gọi làm bao nhiêu việc, và 100–1000 là khoảng hữu dụng.</strong> Quá thấp thì bạn tạo ra hàng nghìn vòng mạng; quá cao thì mỗi lời gọi là một thao tác chặn kéo dài, thứ phá hỏng hoàn toàn ý nghĩa của <code>SCAN</code>. Tuỳ chọn <code>TYPE</code> (6.0+) lọc ở phía máy chủ và thật sự hữu ích — đó là cách bạn tìm mọi hash mà không phải kéo về rồi kiểm cả không gian khoá.</div>

<h3>Các biến thể cho tập hợp</h3>
<pre><code>redis-cli HSCAN user:1042 0 COUNT 10
redis-cli SSCAN post:77:likes 0 MATCH '10*'
redis-cli ZSCAN leaderboard 0 COUNT 5
redis-cli HSCAN user:1042 0 NOVALUES        <span class="tok-comment"># 7.4: chỉ lấy tên trường</span></code></pre>
<div class="out">1) "0"
2) 1) "name"
   2) "C\\xc6\\xb0\\xe1\\xbb\\x9dng"
   3) "plan"
   4) "pro"
1) "0"
2) 1) "1042"
1) "0"
2) 1) "alice"
   2) "1520"
1) "0"
2) 1) "name"
   2) "plan"</div>
<p>Đây là những thứ thay thế AN TOÀN cho <code>HGETALL</code>, <code>SMEMBERS</code> và <code>ZRANGE 0 -1</code> trên một tập hợp mà bạn không tự định kích thước. Một hash hai triệu trường sẽ chặn máy chủ một khoảng thời gian thấy rõ dưới <code>HGETALL</code>; <code>HSCAN</code> đi qua nó theo từng miếng. Tuỳ chọn <code>NOVALUES</code> ở 7.4 giảm một nửa lưu lượng khi bạn chỉ cần tên trường.</p>

<h3>DEL so với UNLINK</h3>
<pre><code><span class="tok-comment"># Dựng một cái set khổng lồ, rồi bấm giờ cả hai cách gỡ nó đi</span>
for i in $(seq 1 5000000); do echo "SADD big m:$i"; done | redis-cli --pipe &gt;/dev/null
redis-cli SCARD big
redis-cli MEMORY USAGE big

time redis-cli DEL big
<span class="tok-comment"># …dựng lại, rồi:</span>
time redis-cli UNLINK big</code></pre>
<div class="out">(integer) 5000000
(integer) 412184088
(integer) 1
real	0m0.412s
(integer) 1
real	0m0.002s</div>
<div class="callout warn"><strong>412 mili giây đông cứng toàn bộ máy chủ, so với 2.</strong> <code>DEL</code> giải phóng từng phần tử ngay tại chỗ trên luồng chính; <code>UNLINK</code> gỡ cái khoá khỏi không gian khoá ngay lập tức rồi giao bộ nhớ cho một luồng nền. Trong 412ms đó mọi client khác đều phải chờ — một healthcheck hết giờ, một bể kết nối cạn, và một cái cảnh báo, tất cả chỉ từ việc xoá MỘT cái khoá. <strong>Hãy lấy <code>UNLINK</code> làm mặc định</strong>; nó hành xử y hệt với khoá nhỏ (Redis đằng nào cũng giải phóng những cái đó ngay tại chỗ, vì một cú nhảy sang luồng nền còn tốn hơn chính công việc).</div>
<pre><code>redis-cli CONFIG GET lazyfree-lazy-user-del
redis-cli CONFIG SET lazyfree-lazy-user-del yes    <span class="tok-comment"># cho DEL hành xử như UNLINK</span>
redis-cli CONFIG GET lazyfree-lazy-expire
redis-cli CONFIG GET lazyfree-lazy-eviction</code></pre>
<div class="out">1) "lazyfree-lazy-user-del"
2) "no"
OK
1) "lazyfree-lazy-expire"
2) "no"
1) "lazyfree-lazy-eviction"
2) "no"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>lazyfree-lazy-user-del</code></span><span class="v">Làm cho MỌI lệnh <code>DEL</code> hành xử như <code>UNLINK</code>. Hãy bật nó — nó xoá bỏ nguyên một nhóm cú vọt độ trễ gây ra bởi mã mà không phải bạn viết.</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-expire</code></span><span class="v">Giải phóng các khoá hết hạn ở luồng nền. Quan trọng khi các tập hợp lớn hết hạn, vì nếu không nó sẽ chặn ngay tại khoảnh khắc hết hạn chứ không phải tại câu lệnh của bạn.</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-eviction</code></span><span class="v">Tương tự, cho những khoá bị đẩy đi khi bộ nhớ căng — đúng lúc bạn ít có khả năng chịu nổi một cú đứng hình nhất (Chương 9).</span></div>
  <div class="kv"><span class="k"><code>lazyfree-lazy-server-del</code></span><span class="v">Cho những lần xoá ngầm, ví dụ một lệnh <code>RENAME</code> đè lên một khoá đích lớn. Dễ quên và cùng một nhóm vấn đề.</span></div>
  <div class="kv"><span class="k">Cả bốn mặc định là <code>no</code></span><span class="v">Vì tương thích lịch sử. Bật cả bốn là một trong những cải thiện độ trễ rẻ nhất bạn có, và trên một nhân đời mới thì không có mặt trái đáng kể nào.</span></div>
</div>

<h3>Xoá theo mẫu, cho đúng</h3>
<pre><code><span class="tok-comment"># ❌ Cái ai cũng viết, và cũng là cái làm đông cứng máy chủ</span>
redis-cli DEL $(redis-cli KEYS 'cache:v2:*')

<span class="tok-comment"># ✅ Quét rồi unlink theo từng mẻ</span>
redis-cli --scan --pattern 'cache:v2:*' | xargs -L 500 redis-cli UNLINK

<span class="tok-comment"># ✅ Hoặc không cần shell, làm từ trong ứng dụng</span>
let cursor = '0';
do {
  const [next, keys] = await redis.scan(cursor, 'MATCH', 'cache:v2:*', 'COUNT', 500);
  if (keys.length) await redis.unlink(...keys);
  cursor = next;
} while (cursor !== '0');</code></pre>
<div class="out">(integer) 500
(integer) 500
(integer) 184</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tốt hơn: cho chúng một TTL ngay từ đầu</span><span class="lz-t">chẳng có gì để xoá nếu nó tự hết hạn</span><span class="lz-d">Phần lớn các lần xoá theo mẫu là đang dọn những mục cache lẽ ra đã phải có TTL. Hãy sửa đường GHI và bài toán xoá biến mất vĩnh viễn.</span></div>
  <div class="lz-step"><span class="lz-k">Tốt hơn: nâng tiền tố phiên bản</span><span class="lz-t">cache:v2: → cache:v3:</span><span class="lz-d">Tức thì, nguyên tử và miễn phí (Bài 2.1). Khoá cũ tự hết hạn; bạn không phải quét gì cả.</span></div>
  <div class="lz-step"><span class="lz-k">Chấp nhận được: SCAN + UNLINK theo mẻ</span><span class="lz-t">cho một lần dọn dẹp duy nhất</span><span class="lz-d">Tổng thời gian chậm, nhưng vô hình với mọi người khác. Đúng khi bạn thật sự buộc phải gỡ những khoá không có TTL.</span></div>
  <div class="lz-step"><span class="lz-k">Không bao giờ: KEYS đút vào DEL</span><span class="lz-t">hai thao tác chặn nối đuôi nhau</span><span class="lz-d"><code>KEYS</code> đi hết không gian khoá, rồi <code>DEL</code> giải phóng tất cả ngay tại chỗ. Trên một instance lớn thì đây là một sự cố kéo dài mấy giây, HAI lần.</span></div>
</div>

<h3>FLUSHDB, FLUSHALL, và dạng ASYNC của chúng</h3>
<pre><code>redis-cli DBSIZE
time redis-cli FLUSHDB ASYNC
redis-cli DBSIZE
redis-cli INFO memory | grep -E 'used_memory_human|lazyfree_pending'</code></pre>
<div class="out">(integer) 1284419
OK
real	0m0.004s
(integer) 0
used_memory_human:398.21M
lazyfreed_objects:0</div>
<div class="callout warn"><strong><code>ASYNC</code> làm cú đông cứng biến mất; nó KHÔNG làm câu lệnh trở nên an toàn.</strong> Không gian khoá rỗng trong bốn mili giây và bộ nhớ được thu hồi ở luồng nền — nhưng dữ liệu thì mất y như vậy. Không có hộp xác nhận, không hoàn tác, và không có cách nào phân biệt "tôi cố ý xoá cơ sở dữ liệu này" với "tôi đang đứng nhầm máy chủ". Cũng để ý là <code>used_memory</code> ngay sau đó vẫn là 398MB, vì luồng nền chưa xong; một biểu đồ bộ nhớ không tụt ngay sau một lần flush là chuyện dự đoán được. Trên production, hãy hạn chế cả hai câu lệnh bằng ACL (Chương 10) — đó là biện pháp bảo vệ đáng tin duy nhất.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/scan/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">SCAN</span><span class="lc-sub">Toàn bộ các bảo đảm, thuật toán con trỏ và vì sao nó sống sót qua việc băm lại, cộng với <code>MATCH</code>, <code>COUNT</code>, <code>TYPE</code> và các biến thể cho tập hợp. Mẹo con trỏ nhị phân đảo ngược thật sự thông minh và đáng đọc.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/unlink/" target="_blank" rel="noopener">
  <span class="lc-ico">🧵</span>
  <span class="lc-body"><span class="lc-title">UNLINK và giải phóng lười</span><span class="lc-sub">Luồng giải phóng nền hoạt động ra sao và khi nào Redis quyết định một đối tượng đủ lớn để đáng giao đi. Giải thích vì sao <code>UNLINK</code> trên một khoá nhỏ không chậm hơn <code>DEL</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: quét và xoá an toàn</span><span class="lc-sub">Bài chấm điểm: viết một vòng lặp <code>SCAN</code> đúng và biết dừng, đo <code>DEL</code> so với <code>UNLINK</code> trên một set năm triệu phần tử, và viết lại ba script dọn dẹp nguy hiểm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> viết một vòng lặp <code>SCAN</code> dừng lại khi gặp một mẻ RỖNG. Đoạn mã trông có vẻ hợp lý — quét, lấy khoá, nếu không có cái nào thì chắc là xong — và nó SAI, vì <code>MATCH</code> lọc <em>SAU</em> khi mẻ dữ liệu đã được lấy về. Quét một triệu khoá với <code>MATCH 'lock:*'</code> sẽ trả về những mẻ rỗng suốt phần lớn lượt duyệt trong khi con trỏ vẫn đang đi qua bảng băm, nên một vòng lặp với <code>while (keys.length)</code> sẽ thoát ngay sau mẻ đầu tiên và lặng lẽ xử lý được một phần nhỏ của không gian khoá. Điều kiện dừng là CON TRỎ và chỉ con trỏ: hãy lặp cho tới khi <code>SCAN</code> trả về <code>"0"</code>. Sai lầm ngược lại là một vòng lặp không bao giờ dừng vì nó lưu con trỏ dưới dạng SỐ rồi làm mất độ chính xác với một giá trị lớn — con trỏ là 64 bit và trong JavaScript phải được xử lý như một chuỗi mờ.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>SCAN</code> chỉ bảo đảm rằng những khoá có mặt suốt lượt duyệt sẽ xuất hiện ít nhất một lần — trùng lặp là chuyện có thật, và một mẻ rỗng chẳng nói lên điều gì vì <code>MATCH</code> lọc sau khi lấy về. Hãy dừng khi con trỏ bằng <code>"0"</code>, đừng bao giờ dừng vì kết quả rỗng. Và hãy lấy <code>UNLINK</code> làm mặc định thay cho <code>DEL</code>: xoá một cái set năm triệu phần tử làm đông cứng máy chủ 412ms, so với 2ms — rồi bật cả bốn thiết lập <code>lazyfree-*</code> để cùng lớp bảo vệ đó áp cho việc hết hạn, việc đẩy khoá, và cả mã không phải bạn viết.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Keyspace notifications|||2.4 — Thông báo không gian khoá',
      slug: 'rd-2-4-thong-bao',
      type: 'LESSON',
      description: 'Bật thông báo, hai kênh keyspace với keyevent, bảng cờ đầy đủ, sự kiện expired đến MUỘN, ba việc chúng làm tốt, và ba lý do đừng xây hệ thống quan trọng lên trên chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Keyspace notifications</h2>
<p class="lead">Redis can publish an event every time a key is written, deleted or expires. It is a genuinely useful feature for cache invalidation and cleanup — and it is built on Pub/Sub, which means it inherits Pub/Sub's fire-and-forget delivery. Knowing exactly what it does and does not promise is the difference between a nice optimisation and a data-loss bug.</p>

<h3>Turning it on</h3>
<pre><code>redis-cli CONFIG GET notify-keyspace-events
redis-cli CONFIG SET notify-keyspace-events 'KEA'    <span class="tok-comment"># everything — for exploring</span>
redis-cli CONFIG SET notify-keyspace-events 'Ex'     <span class="tok-comment"># keyevent + expired only</span>
redis-cli CONFIG GET notify-keyspace-events</code></pre>
<div class="out">1) "notify-keyspace-events"
2) ""
OK
OK
1) "notify-keyspace-events"
2) "Ex"</div>
<div class="callout"><strong>It is off by default, and that is deliberate.</strong> Every event is a Pub/Sub publish, so a write-heavy instance with <code>KEA</code> can spend real CPU generating messages nobody is listening to. Enable only the classes you actually consume — <code>Ex</code> for expiry, <code>Kg$</code> for generic and string keyspace events — and never <code>KEA</code> on production.</div>

<h3>The two channels, and how they differ</h3>
<pre><code><span class="tok-comment"># Terminal 1</span>
redis-cli PSUBSCRIBE '__key*@0__:*'

<span class="tok-comment"># Terminal 2</span>
redis-cli SET user:1042 v EX 2</code></pre>
<div class="out">pmessage  __key*@0__:*  __keyspace@0__:user:1042  set
pmessage  __key*@0__:*  __keyevent@0__:set         user:1042
pmessage  __key*@0__:*  __keyspace@0__:user:1042  expired
pmessage  __key*@0__:*  __keyevent@0__:expired     user:1042</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">__keyspace@&lt;db&gt;__:&lt;key&gt;</span><span class="lz-lnote">Channel names the <strong>key</strong>, payload is the <strong>event</strong>. Subscribe when you care about one key or one prefix: <code>PSUBSCRIBE '__keyspace@0__:session:*'</code> tells you everything that happens to sessions.</span></div>
  <div class="lz-layer"><span class="lz-lname">__keyevent@&lt;db&gt;__:&lt;event&gt;</span><span class="lz-lnote">Channel names the <strong>event</strong>, payload is the <strong>key</strong>. Subscribe when you care about one kind of change everywhere: <code>SUBSCRIBE '__keyevent@0__:expired'</code> is every expiry in the database.</span></div>
  <div class="lz-layer"><span class="lz-lname">The database number is in the channel</span><span class="lz-lnote"><code>@0</code> is database 0. If your application uses <code>SELECT 3</code>, subscribe to <code>__keyevent@3__:…</code> or you will hear nothing and spend an hour wondering why.</span></div>
  <div class="lz-layer"><span class="lz-lname">Both fire for the same operation</span><span class="lz-lnote">Enabling both classes doubles the messages. Pick the one that matches your access pattern; enabling both is usually a mistake rather than a belt and braces.</span></div>
</div>

<h3>The flags, in full</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>K</code> / <code>E</code></span><span class="v">Keyspace events / keyevent events. <strong>At least one is required</strong> — a flag string with only <code>x</code> produces nothing at all, which is the most common configuration mistake.</span></div>
  <div class="kv"><span class="k"><code>g</code></span><span class="v">Generic commands: <code>DEL</code>, <code>EXPIRE</code>, <code>RENAME</code>, <code>PERSIST</code>, <code>RESTORE</code>. The type-agnostic ones.</span></div>
  <div class="kv"><span class="k"><code>$</code> <code>l</code> <code>s</code> <code>h</code> <code>z</code> <code>t</code> <code>d</code></span><span class="v">String, list, set, hash, sorted set, stream, module key events. Enable only the types you watch.</span></div>
  <div class="kv"><span class="k"><code>x</code> / <code>g</code>-adjacent: <code>e</code></span><span class="v"><code>x</code> is <em>expired</em> (the TTL fired), <code>e</code> is <em>evicted</em> (removed under memory pressure). These are different events and confusing them hides a real problem — Chapter 9.</span></div>
  <div class="kv"><span class="k"><code>n</code> and <code>t</code>, newer</span><span class="v"><code>n</code> is new-key creation (6.2+), <code>t</code> is stream events. <code>n</code> is useful for building an index of what exists without polling.</span></div>
  <div class="kv"><span class="k"><code>A</code></span><span class="v">Shorthand for <code>g$lshzxet</code> — everything except <code>m</code> (key miss) and <code>n</code>. Convenient for exploration; never what you want in production.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch only expiry, from the application</span>
await sub.pSubscribe('__keyevent@0__:expired', (key) =&gt; {
  if (key.startsWith('session:')) onSessionExpired(key.slice(8));
});

<span class="tok-comment"># And confirm the server is actually configured to send them</span>
redis-cli CONFIG GET notify-keyspace-events</code></pre>
<div class="out">1) "notify-keyspace-events"
2) "Ex"</div>

<h3>The expired event is late, and that is by design</h3>
<pre><code>redis-cli CONFIG SET notify-keyspace-events Ex
(redis-cli PSUBSCRIBE '__keyevent@0__:expired' &amp; ) &gt; /tmp/ev.log
redis-cli SET late:1 v EX 1
sleep 1; date +%s.%N
sleep 4; grep -c late /tmp/ev.log</code></pre>
<div class="out">OK
1787001841.204812
1</div>
<div class="callout warn"><strong>The event fires when the key is actually deleted, not when its TTL elapses.</strong> Because expiration is lazy plus sampled (Lesson 2.2), a key nobody touches can sit expired for seconds before the active cycle finds it — and the notification arrives then. Building "do X exactly when this session ends" on the expired event gives you "do X somewhere between zero and several seconds after the session ends, on a busy server maybe longer". If the timing matters, use a sorted set scored by expiry time and poll it (Chapter 4), which gives you control over the delay.</div>

<h3>Three things it is genuinely good for</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cache invalidation across processes</span><span class="lz-t">one writer, many local caches</span><span class="lz-d">An API instance updates a key; every other instance hears the event and drops its in-process copy. RESP3 client-side caching (Lesson 1.3) is a more robust version of the same idea.</span></div>
  <div class="lz-step"><span class="lz-k">Cleanup triggered by expiry</span><span class="lz-t">session expired → close the websocket</span><span class="lz-d">Perfect when the cleanup is idempotent and the timing is loose. Not acceptable when missing the event means an orphaned resource forever.</span></div>
  <div class="lz-step"><span class="lz-k">Development visibility</span><span class="lz-t">PSUBSCRIBE '__key*@0__:*' with KEA</span><span class="lz-d">Genuinely the fastest way to understand what your application is doing to Redis. Turn it on locally, watch for a minute, turn it off.</span></div>
  <div class="lz-step"><span class="lz-k">Not for: anything that must not be missed</span><span class="lz-t">billing, audit, "exactly once"</span><span class="lz-d">Notifications are Pub/Sub. A disconnected subscriber misses everything sent while it was away, permanently and silently. Use a Stream (Chapter 8).</span></div>
</div>

<h3>Three reasons not to build on them</h3>
<pre><code><span class="tok-comment"># 1 · Delivery is at-most-once. Disconnect, and the messages are gone.</span>
redis-cli CLIENT KILL TYPE pubsub
redis-cli SET gone:1 v EX 1
sleep 3
<span class="tok-comment"># the subscriber reconnects — and never learns gone:1 expired</span>

<span class="tok-comment"># 2 · A slow subscriber is dropped silently (Lesson 1.2)</span>
redis-cli CONFIG GET client-output-buffer-limit | tail -1

<span class="tok-comment"># 3 · Replicas historically did not emit expired events at all</span>
redis-cli -p 6380 CONFIG GET notify-keyspace-events</code></pre>
<div class="out">(integer) 1
normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60
1) "notify-keyspace-events"
2) "Ex"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">No delivery guarantee</span><span class="v">Fire and forget. No acknowledgement, no replay, no history. A subscriber that restarts during a deploy loses every event in that window and has no way to know.</span></div>
  <div class="kv"><span class="k">No ordering guarantee across keys</span><span class="v">Events for one key arrive in order; events for different keys have no relative ordering you can rely on.</span></div>
  <div class="kv"><span class="k">The payload is only a name</span><span class="v">You get the key name, never the value — and by the time you read the key it may have changed again, or in the case of <code>expired</code>, be gone. Design for that.</span></div>
  <div class="kv"><span class="k">Cost scales with writes</span><span class="v">Every matching write publishes a message, whether or not anyone is subscribed. On a hot instance this is measurable, which is why the flags are per-class.</span></div>
  <div class="kv"><span class="k">The alternative</span><span class="v">A Stream you write to explicitly (Chapter 8): persistent, replayable, with consumer groups and acknowledgements. More work, and the right choice whenever missing an event is a bug rather than an inconvenience.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace-notifications/" target="_blank" rel="noopener">
  <span class="lc-ico">🔔</span>
  <span class="lc-body"><span class="lc-title">Keyspace notifications</span><span class="lc-sub">The complete flag table, every event name per type, and the official warning about delivery semantics. The list of event names is worth skimming — several are more useful than they sound.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace-notifications/#timing-of-expired-events" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">Timing of expired events</span><span class="lc-sub">The official statement that the event fires on deletion rather than on TTL elapse, and what that means for a replica. Short and worth reading before you rely on the timing.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: watch the keyspace</span><span class="lc-sub">Graded exercises: configure the right flags for three use cases, explain why a flag string of <code>x</code> alone produces nothing, and decide between notifications and a Stream for four scenarios.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using the <code>expired</code> event to release a resource — closing a websocket, refunding a held inventory item, removing a user from a room. It works perfectly in testing, where you have one subscriber that never disconnects, and it fails in production in two ways at once. First, the event fires when Redis <em>deletes</em> the key, which can be seconds after the TTL elapsed — so the resource is held longer than intended. Second and worse, Pub/Sub is at-most-once: every deploy restarts your subscriber, and every event published during those few seconds is gone forever, leaving resources held permanently with nothing in any log to explain it. The pattern that survives contact with production is to treat the notification as a <em>hint</em> and add a sweep: a periodic job that scans for resources whose expiry has passed and cleans them up regardless. The notification makes it fast; the sweep makes it correct.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Notifications are off by default and the flag string needs <code>K</code> or <code>E</code> plus a class — <code>x</code> alone silently produces nothing. The <code>expired</code> event fires when the key is actually deleted, not when the TTL elapses, so it can be seconds late. And delivery is at-most-once Pub/Sub: a subscriber that reconnects has permanently missed everything sent while it was away, so anything that must not be missed belongs in a Stream, or needs a periodic sweep behind it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Thông báo không gian khoá</h2>
<p class="lead">Redis có thể phát ra một sự kiện mỗi khi một khoá được ghi, bị xoá hoặc hết hạn. Đó là một tính năng thật sự hữu ích cho việc vô hiệu hoá cache và dọn dẹp — và nó được xây trên Pub/Sub, nghĩa là nó thừa hưởng kiểu giao hàng bắn-rồi-quên của Pub/Sub. Biết chính xác nó hứa gì và KHÔNG hứa gì là khác biệt giữa một phép tối ưu dễ chịu và một cái lỗi mất dữ liệu.</p>

<h3>Bật nó lên</h3>
<pre><code>redis-cli CONFIG GET notify-keyspace-events
redis-cli CONFIG SET notify-keyspace-events 'KEA'    <span class="tok-comment"># mọi thứ — để khám phá</span>
redis-cli CONFIG SET notify-keyspace-events 'Ex'     <span class="tok-comment"># chỉ keyevent + expired</span>
redis-cli CONFIG GET notify-keyspace-events</code></pre>
<div class="out">1) "notify-keyspace-events"
2) ""
OK
OK
1) "notify-keyspace-events"
2) "Ex"</div>
<div class="callout"><strong>Mặc định nó TẮT, và đó là có chủ đích.</strong> Mỗi sự kiện là một lần publish qua Pub/Sub, nên một instance ghi nhiều với cờ <code>KEA</code> có thể tốn CPU thật để sinh ra những tin nhắn không ai nghe. Hãy chỉ bật đúng những lớp bạn thật sự tiêu thụ — <code>Ex</code> cho hết hạn, <code>Kg$</code> cho sự kiện keyspace loại chung và loại chuỗi — và đừng bao giờ dùng <code>KEA</code> trên production.</div>

<h3>Hai kênh, và chúng khác nhau ra sao</h3>
<pre><code><span class="tok-comment"># Cửa sổ 1</span>
redis-cli PSUBSCRIBE '__key*@0__:*'

<span class="tok-comment"># Cửa sổ 2</span>
redis-cli SET user:1042 v EX 2</code></pre>
<div class="out">pmessage  __key*@0__:*  __keyspace@0__:user:1042  set
pmessage  __key*@0__:*  __keyevent@0__:set         user:1042
pmessage  __key*@0__:*  __keyspace@0__:user:1042  expired
pmessage  __key*@0__:*  __keyevent@0__:expired     user:1042</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">__keyspace@&lt;db&gt;__:&lt;khoá&gt;</span><span class="lz-lnote">Tên kênh là <strong>KHOÁ</strong>, nội dung là <strong>SỰ KIỆN</strong>. Hãy đăng ký khi bạn quan tâm tới một khoá hay một tiền tố: <code>PSUBSCRIBE '__keyspace@0__:session:*'</code> cho bạn biết mọi chuyện xảy ra với các phiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">__keyevent@&lt;db&gt;__:&lt;sự kiện&gt;</span><span class="lz-lnote">Tên kênh là <strong>SỰ KIỆN</strong>, nội dung là <strong>KHOÁ</strong>. Hãy đăng ký khi bạn quan tâm tới một LOẠI thay đổi ở khắp nơi: <code>SUBSCRIBE '__keyevent@0__:expired'</code> là mọi lần hết hạn trong cơ sở dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Số cơ sở dữ liệu nằm trong tên kênh</span><span class="lz-lnote"><code>@0</code> là cơ sở dữ liệu 0. Nếu ứng dụng của bạn dùng <code>SELECT 3</code> thì hãy đăng ký <code>__keyevent@3__:…</code>, không thì bạn sẽ chẳng nghe thấy gì và mất một tiếng ngồi thắc mắc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cả hai đều bắn cho cùng một thao tác</span><span class="lz-lnote">Bật cả hai lớp là nhân đôi số tin nhắn. Hãy chọn cái khớp với kiểu truy cập của bạn; bật cả hai thường là một sai lầm chứ không phải một lớp bảo hiểm kép.</span></div>
</div>

<h3>Bảng cờ, đầy đủ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>K</code> / <code>E</code></span><span class="v">Sự kiện keyspace / sự kiện keyevent. <strong>Bắt buộc phải có ít nhất một</strong> — một chuỗi cờ chỉ có <code>x</code> sẽ không sinh ra gì cả, và đó là lỗi cấu hình phổ biến nhất.</span></div>
  <div class="kv"><span class="k"><code>g</code></span><span class="v">Câu lệnh chung: <code>DEL</code>, <code>EXPIRE</code>, <code>RENAME</code>, <code>PERSIST</code>, <code>RESTORE</code>. Những cái không phụ thuộc kiểu dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>$</code> <code>l</code> <code>s</code> <code>h</code> <code>z</code> <code>t</code> <code>d</code></span><span class="v">Sự kiện khoá kiểu chuỗi, list, set, hash, sorted set, stream, module. Hãy chỉ bật những kiểu bạn theo dõi.</span></div>
  <div class="kv"><span class="k"><code>x</code> so với <code>e</code></span><span class="v"><code>x</code> là <em>expired</em> (TTL đã nổ), <code>e</code> là <em>evicted</em> (bị gỡ đi vì bộ nhớ căng). Đây là hai sự kiện KHÁC NHAU và lẫn lộn chúng sẽ che mất một vấn đề có thật — Chương 9.</span></div>
  <div class="kv"><span class="k"><code>n</code> và <code>t</code>, mới hơn</span><span class="v"><code>n</code> là sự kiện tạo khoá mới (6.2+), <code>t</code> là sự kiện stream. <code>n</code> hữu ích để dựng một chỉ mục về những gì đang tồn tại mà không phải thăm dò liên tục.</span></div>
  <div class="kv"><span class="k"><code>A</code></span><span class="v">Viết tắt cho <code>g$lshzxet</code> — mọi thứ trừ <code>m</code> (khoá trượt) và <code>n</code>. Tiện để khám phá; không bao giờ là thứ bạn muốn trên production.</span></div>
</div>
<pre><code><span class="tok-comment"># Chỉ theo dõi việc hết hạn, từ trong ứng dụng</span>
await sub.pSubscribe('__keyevent@0__:expired', (key) =&gt; {
  if (key.startsWith('session:')) onSessionExpired(key.slice(8));
});

<span class="tok-comment"># Và xác nhận máy chủ thật sự được cấu hình để gửi chúng</span>
redis-cli CONFIG GET notify-keyspace-events</code></pre>
<div class="out">1) "notify-keyspace-events"
2) "Ex"</div>

<h3>Sự kiện expired tới MUỘN, và đó là do thiết kế</h3>
<pre><code>redis-cli CONFIG SET notify-keyspace-events Ex
(redis-cli PSUBSCRIBE '__keyevent@0__:expired' &amp; ) &gt; /tmp/ev.log
redis-cli SET late:1 v EX 1
sleep 1; date +%s.%N
sleep 4; grep -c late /tmp/ev.log</code></pre>
<div class="out">OK
1787001841.204812
1</div>
<div class="callout warn"><strong>Sự kiện nổ khi khoá thật sự BỊ XOÁ, không phải khi TTL của nó trôi qua.</strong> Vì hết hạn là lười cộng lấy mẫu (Bài 2.2), một cái khoá không ai chạm tới có thể nằm ở trạng thái đã hết hạn hàng giây trước khi chu kỳ chủ động tìm thấy nó — và thông báo tới vào lúc đó. Xây "làm X đúng lúc phiên này kết thúc" lên trên sự kiện expired sẽ cho bạn "làm X vào đâu đó từ không tới vài giây sau khi phiên kết thúc, trên máy chủ bận thì có thể lâu hơn". Nếu thời điểm quan trọng, hãy dùng một sorted set chấm điểm theo thời điểm hết hạn rồi tự thăm dò nó (Chương 4), cách đó cho bạn quyền kiểm soát độ trễ.</div>

<h3>Ba việc nó thật sự làm tốt</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vô hiệu hoá cache giữa các tiến trình</span><span class="lz-t">một bên ghi, nhiều cache cục bộ</span><span class="lz-d">Một instance API cập nhật một khoá; mọi instance khác nghe thấy sự kiện rồi vứt bản sao trong tiến trình của mình. Cache phía client của RESP3 (Bài 1.3) là một phiên bản vững chắc hơn của cùng ý tưởng.</span></div>
  <div class="lz-step"><span class="lz-k">Dọn dẹp kích hoạt bởi hết hạn</span><span class="lz-t">phiên hết hạn → đóng websocket</span><span class="lz-d">Hoàn hảo khi việc dọn dẹp là bất biến khi lặp lại và thời điểm thì lỏng lẻo. Không chấp nhận được khi bỏ lỡ sự kiện nghĩa là một tài nguyên bị bỏ rơi vĩnh viễn.</span></div>
  <div class="lz-step"><span class="lz-k">Nhìn thấy được lúc phát triển</span><span class="lz-t">PSUBSCRIBE '__key*@0__:*' với cờ KEA</span><span class="lz-d">Thật sự là cách nhanh nhất để hiểu ứng dụng của bạn đang làm gì với Redis. Bật ở máy cục bộ, xem một phút, rồi tắt.</span></div>
  <div class="lz-step"><span class="lz-k">Không dùng cho: bất cứ thứ gì không được phép bỏ lỡ</span><span class="lz-t">tính tiền, kiểm toán, "đúng một lần"</span><span class="lz-d">Thông báo là Pub/Sub. Một bên đăng ký bị ngắt kết nối sẽ bỏ lỡ mọi thứ gửi trong lúc nó vắng mặt, vĩnh viễn và trong im lặng. Hãy dùng một Stream (Chương 8).</span></div>
</div>

<h3>Ba lý do đừng xây lên trên chúng</h3>
<pre><code><span class="tok-comment"># 1 · Giao hàng là NHIỀU NHẤT MỘT LẦN. Mất kết nối là tin nhắn đi luôn.</span>
redis-cli CLIENT KILL TYPE pubsub
redis-cli SET gone:1 v EX 1
sleep 3
<span class="tok-comment"># bên đăng ký kết nối lại — và không bao giờ biết gone:1 đã hết hạn</span>

<span class="tok-comment"># 2 · Một bên đăng ký chậm bị vứt trong im lặng (Bài 1.2)</span>
redis-cli CONFIG GET client-output-buffer-limit | tail -1

<span class="tok-comment"># 3 · Về mặt lịch sử, bản sao hoàn toàn không phát sự kiện expired</span>
redis-cli -p 6380 CONFIG GET notify-keyspace-events</code></pre>
<div class="out">(integer) 1
normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60
1) "notify-keyspace-events"
2) "Ex"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có bảo đảm giao hàng</span><span class="v">Bắn rồi quên. Không xác nhận, không phát lại, không lịch sử. Một bên đăng ký khởi động lại giữa một lượt deploy sẽ mất mọi sự kiện trong khoảng đó và không có cách nào biết được.</span></div>
  <div class="kv"><span class="k">Không có bảo đảm thứ tự giữa các khoá</span><span class="v">Sự kiện của MỘT khoá tới theo thứ tự; sự kiện của các khoá khác nhau thì không có thứ tự tương đối nào bạn dựa vào được.</span></div>
  <div class="kv"><span class="k">Nội dung chỉ là một cái TÊN</span><span class="v">Bạn nhận được tên khoá, không bao giờ nhận được giá trị — và tới lúc bạn đọc cái khoá đó thì nó có thể đã đổi lần nữa, hoặc trong trường hợp <code>expired</code>, đã biến mất. Hãy thiết kế cho tình huống đó.</span></div>
  <div class="kv"><span class="k">Chi phí tăng theo số lệnh ghi</span><span class="v">Mọi lệnh ghi khớp đều publish một tin nhắn, bất kể có ai đăng ký hay không. Trên một instance nóng thì con số này đo được, và đó là lý do các cờ được chia theo lớp.</span></div>
  <div class="kv"><span class="k">Phương án thay thế</span><span class="v">Một Stream mà bạn tự ghi vào một cách tường minh (Chương 8): lưu lâu dài, phát lại được, có nhóm tiêu thụ và có xác nhận. Tốn công hơn, và là lựa chọn ĐÚNG mỗi khi bỏ lỡ một sự kiện là một cái LỖI chứ không phải một sự bất tiện.</span></div>
</div>

<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace-notifications/" target="_blank" rel="noopener">
  <span class="lc-ico">🔔</span>
  <span class="lc-body"><span class="lc-title">Thông báo không gian khoá</span><span class="lc-sub">Bảng cờ đầy đủ, mọi tên sự kiện cho từng kiểu, và cảnh báo chính thức về ngữ nghĩa giao hàng. Danh sách tên sự kiện đáng lướt qua — vài cái hữu ích hơn nghe tưởng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use/keyspace-notifications/#timing-of-expired-events" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">Thời điểm của sự kiện expired</span><span class="lc-sub">Tuyên bố chính thức rằng sự kiện nổ lúc XOÁ chứ không phải lúc TTL trôi qua, và điều đó nghĩa là gì với một bản sao. Ngắn và đáng đọc trước khi bạn dựa vào thời điểm của nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: theo dõi không gian khoá</span><span class="lc-sub">Bài chấm điểm: cấu hình đúng cờ cho ba tình huống, giải thích vì sao một chuỗi cờ chỉ có <code>x</code> chẳng sinh ra gì, và chọn giữa thông báo với Stream cho bốn kịch bản.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng sự kiện <code>expired</code> để nhả một tài nguyên — đóng một websocket, hoàn lại một món hàng đang giữ trong kho, gỡ một người dùng khỏi một phòng. Nó chạy hoàn hảo khi kiểm thử, nơi bạn có một bên đăng ký không bao giờ mất kết nối, và nó hỏng trên production theo HAI cách cùng lúc. Thứ nhất, sự kiện nổ khi Redis <em>XOÁ</em> khoá, thứ có thể diễn ra hàng giây sau khi TTL trôi qua — nên tài nguyên bị giữ lâu hơn dự định. Thứ hai và tệ hơn, Pub/Sub là nhiều-nhất-một-lần: mỗi lượt deploy đều khởi động lại bên đăng ký của bạn, và mọi sự kiện phát ra trong vài giây đó đi mất vĩnh viễn, để lại những tài nguyên bị giữ mãi mãi mà không có dòng log nào giải thích. Cái mẫu sống sót được khi va vào production là coi thông báo như một <em>GỢI Ý</em> rồi thêm một lượt quét dọn: một việc định kỳ rà tìm những tài nguyên đã quá hạn rồi dọn chúng bất kể có nhận được sự kiện hay không. Thông báo làm cho nó NHANH; lượt quét làm cho nó ĐÚNG.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Thông báo mặc định tắt và chuỗi cờ cần có <code>K</code> hoặc <code>E</code> cộng với một lớp — chỉ mình <code>x</code> thì lặng lẽ chẳng sinh ra gì. Sự kiện <code>expired</code> nổ khi khoá thật sự bị xoá chứ không phải khi TTL trôi qua, nên nó có thể muộn hàng giây. Và giao hàng là Pub/Sub kiểu nhiều-nhất-một-lần: một bên đăng ký kết nối lại đã VĨNH VIỄN bỏ lỡ mọi thứ gửi trong lúc nó vắng, nên bất cứ thứ gì không được phép bỏ lỡ đều thuộc về một Stream, hoặc cần một lượt quét dọn định kỳ đứng sau.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Databases, and the rest of the key commands|||2.5 — Cơ sở dữ liệu, và những câu lệnh khoá còn lại',
      slug: 'rd-2-5-db-lenh-khoa',
      type: 'LESSON',
      description: 'Mười sáu cơ sở dữ liệu và vì sao đừng dùng chúng, COPY/RENAME/MOVE, DUMP với RESTORE để chuyển khoá giữa các máy, OBJECT FREQ/IDLETIME, RANDOMKEY, và bộ đồ nghề tìm khoá to.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Databases, and the rest of the key commands</h2>
<p class="lead">A handful of commands that do not fit anywhere else, and one feature — numbered databases — that looks like namespacing and is not. This is also where the tools for answering "what is actually in here, and what is eating my memory?" live.</p>

<h3>Sixteen databases, and why you should ignore them</h3>
<pre><code>redis-cli CONFIG GET databases
redis-cli -n 0 SET shared:key "in db 0"
redis-cli -n 3 GET shared:key
redis-cli -n 3 SET shared:key "in db 3"
redis-cli INFO keyspace</code></pre>
<div class="out">1) "databases"
2) "16"
OK
(nil)
OK
db0:keys=142,expires=8,avg_ttl=0
db3:keys=1,expires=0,avg_ttl=0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">They are not namespaces</span><span class="v">They share one process, one thread, one memory limit, one AOF, one replication stream. Nothing is isolated except the key names. A slow command in db3 blocks db0.</span></div>
  <div class="kv"><span class="k">Redis Cluster only has db0</span><span class="v">The moment you consider clustering, every <code>SELECT</code> in your code becomes a migration. This alone is a good reason never to start using them.</span></div>
  <div class="kv"><span class="k"><code>SELECT</code> is per-connection state</span><span class="v">With a pooled or shared client, a stray <code>SELECT</code> leaves that connection pointing at the wrong database for every subsequent command. A genuinely nasty class of bug.</span></div>
  <div class="kv"><span class="k">The legitimate uses</span><span class="v">Tests that need a scratch database to flush, and running two unrelated small applications on one instance in development. Both are development conveniences.</span></div>
  <div class="kv"><span class="k">Do this instead</span><span class="v">Key prefixes (Lesson 2.1). They work in Cluster, they survive connection reuse, they are visible in every log line, and <code>SCAN --pattern</code> handles them.</span></div>
</div>

<h3>Moving a key</h3>
<pre><code>redis-cli SET a "value"
redis-cli COPY a b
redis-cli COPY a c REPLACE
redis-cli RENAME a a2
redis-cli RENAMENX b a2
redis-cli MOVE c 3
redis-cli EXISTS a a2 b c</code></pre>
<div class="out">(integer) 1
(integer) 1
OK
(integer) 0
(integer) 1
(integer) 2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">COPY (6.2+)</span><span class="lz-t">duplicate a key, optionally into another db</span><span class="lz-d"><code>COPY src dst DB 3 REPLACE</code>. Preserves the TTL. The safe way to snapshot a key before an experiment.</span></div>
  <div class="lz-step"><span class="lz-k">RENAME</span><span class="lz-t">overwrites the destination silently</span><span class="lz-d">And if the destination was a huge collection, that implicit delete blocks — which is what <code>lazyfree-lazy-server-del</code> from Lesson 2.3 exists for. <code>RENAMENX</code> refuses instead, returning 0.</span></div>
  <div class="lz-step"><span class="lz-k">MOVE</span><span class="lz-t">to another database, atomically</span><span class="lz-d">Only meaningful if you use numbered databases, so mostly a curiosity. Fails if the key already exists at the destination.</span></div>
  <div class="lz-step"><span class="lz-k">All of them keep the TTL</span><span class="lz-t">unlike SET</span><span class="lz-d">A pleasant asymmetry with Lesson 2.2: these commands move the key <em>and</em> its expiry, because they move the object rather than replacing the value.</span></div>
</div>

<h3>DUMP and RESTORE: moving a key between servers</h3>
<pre><code>redis-cli SET user:1042 '{"name":"Cường"}' EX 3600
redis-cli --no-raw DUMP user:1042
redis-cli -p 6380 RESTORE user:1042 3600000 "\\x00\\x11{\\"name\\":\\"C\\xc6\\xb0\\xe1\\xbb\\x9dng\\"}\\x0b\\x00\\x8e\\x1a\\x99\\x42\\x7f\\x2c\\x1d\\x4a"
redis-cli -p 6380 TTL user:1042</code></pre>
<div class="out">"\\x00\\x11{\\"name\\":\\"C\\xc6\\xb0\\xe1\\xbb\\x9dng\\"}\\x0b\\x00\\x8e\\x1a\\x99\\x42\\x7f\\x2c\\x1d\\x4a"
OK
(integer) 3599</div>
<div class="callout"><strong><code>DUMP</code> produces the key's RDB-encoded value plus a version and a CRC64 checksum.</strong> <code>RESTORE</code> verifies both, so a value dumped from Redis 7 will be refused by Redis 6 rather than silently corrupting anything. The pair is how <code>MIGRATE</code> works internally, and it is a legitimate way to move a specific key between instances — including into a different <code>maxmemory-policy</code> or a different cluster — without dumping the whole dataset.</div>
<pre><code><span class="tok-comment"># MIGRATE does DUMP + RESTORE + DEL, atomically, in one command</span>
redis-cli MIGRATE 127.0.0.1 6380 user:1042 0 5000 COPY REPLACE
redis-cli MIGRATE 127.0.0.1 6380 "" 0 5000 KEYS k1 k2 k3</code></pre>
<div class="out">OK
OK</div>

<h3>What is actually in here?</h3>
<pre><code>redis-cli DBSIZE
redis-cli RANDOMKEY
redis-cli TYPE user:1042
redis-cli OBJECT ENCODING user:1042
redis-cli OBJECT REFCOUNT counter:42
redis-cli OBJECT IDLETIME user:1042
redis-cli MEMORY USAGE user:1042 SAMPLES 0</code></pre>
<div class="out">(integer) 142
"cache:v2:feed:home:p1"
hash
listpack
(integer) 2147483647
(integer) 41
(integer) 312</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>OBJECT REFCOUNT</code> = 2147483647</span><span class="v">A shared integer. Redis preallocates the integers 0–9999 and reuses them, so <code>SET counter 42</code> stores a pointer to the shared object 42 rather than allocating anything. That maximum refcount means "shared, never freed".</span></div>
  <div class="kv"><span class="k"><code>OBJECT IDLETIME</code></span><span class="v">Seconds since last access. Only meaningful with an LRU policy; with LFU you get <code>OBJECT FREQ</code> instead, a logarithmic access counter (Chapter 9).</span></div>
  <div class="kv"><span class="k"><code>MEMORY USAGE key SAMPLES 0</code></span><span class="v">Exact rather than sampled. On a collection with a million elements the default sampling is an estimate; <code>SAMPLES 0</code> walks everything and is correspondingly slow.</span></div>
  <div class="kv"><span class="k"><code>RANDOMKEY</code></span><span class="v">O(1) and genuinely useful for sampling a keyspace you know nothing about — run it twenty times and you learn the shape of the data without <code>SCAN</code>.</span></div>
  <div class="kv"><span class="k"><code>OBJECT ENCODING</code></span><span class="v">The one to check when memory surprises you. <code>listpack</code> versus <code>hashtable</code>, <code>intset</code> versus <code>hashtable</code>, <code>embstr</code> versus <code>raw</code> — each pair is a large memory difference (Chapters 3 and 5).</span></div>
</div>

<h3>Finding the keys that are eating your memory</h3>
<pre><code>redis-cli --bigkeys 2&gt;/dev/null | tail -12</code></pre>
<div class="out">-------- summary -------
Sampled 1284419 keys in the keyspace!
Total key length in bytes is 28257218 (avg len 22.00)

Biggest   string found 'cache:v2:feed:home:p1' has 4194304 bytes
Biggest     list found 'queue:emails' has 184219 items
Biggest      set found 'online:users' has 2841192 members
Biggest     hash found 'user:1042' has 41 fields
Biggest     zset found 'leaderboard:global' has 1284419 members

0 lists with 184219 items (00.00% of keys, avg size 184219.00)
841 hashs with 34412 fields (00.07% of keys, avg size 40.92)
1 zsets with 1284419 members (00.00% of keys, avg size 1284419.00)</div>
<div class="callout ok"><strong><code>--bigkeys</code> uses <code>SCAN</code> internally, so it is safe to run on production.</strong> It samples rather than measuring exactly, which is the right trade: you want to know that <code>online:users</code> has 2.8 million members, not its exact byte count. Its companions are <code>--memkeys</code> (sorts by memory rather than element count, which is what you usually want) and <code>--hotkeys</code> (requires an LFU policy, and shows what is actually being read). Between them they answer nearly every "why is this instance using 12GB?" question.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/object-encoding/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">OBJECT ENCODING</span><span class="lc-sub">Every encoding Redis uses, the config thresholds that trigger a conversion, and what each costs. The reference for Chapters 3 and 5.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/dump/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">DUMP, RESTORE and MIGRATE</span><span class="lc-sub">The serialisation format, the version and checksum checks, and the <code>MIGRATE</code> options for moving many keys at once. How cluster resharding moves data.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/#scan-and-key-analysis" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">redis-cli --bigkeys, --memkeys, --hotkeys</span><span class="lc-sub">How each sampling mode works and what it can and cannot tell you. Safe on production, and the first thing to run when memory is unexplained.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: explore a keyspace</span><span class="lc-sub">Graded exercises: find the three largest keys in an unfamiliar instance, explain why <code>OBJECT REFCOUNT</code> returns 2147483647 for a small integer, and move one key to another server with its TTL intact.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using numbered databases as namespaces because they look like the obvious tool for it. Everything works in development, where each application has its own database and the separation feels clean. Three problems arrive later, all at once. <code>SELECT</code> is connection state, so with a shared or pooled client one forgotten <code>SELECT</code> leaves that connection pointing at db3 for every subsequent command in the process — and the symptom is data appearing in the wrong place, intermittently, depending on which pooled connection served the request. Redis Cluster supports only database 0, so the day you outgrow one node, every <code>SELECT</code> in the codebase is a migration. And nothing is actually isolated: one memory limit, one thread, one <code>maxmemory-policy</code>, so a runaway in db3 evicts keys in db0. Key prefixes give you the separation you actually wanted, work everywhere, and show up in your logs.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Numbered databases are not namespaces — one thread, one memory limit, no Cluster support, and <code>SELECT</code> is per-connection state that leaks through a shared client. Use key prefixes instead. <code>COPY</code>, <code>RENAME</code> and <code>MOVE</code> preserve the TTL because they move the object rather than replacing the value, unlike <code>SET</code>. And when memory is unexplained, <code>redis-cli --bigkeys</code> and <code>--memkeys</code> answer it safely on production because they are built on <code>SCAN</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Cơ sở dữ liệu, và những câu lệnh khoá còn lại</h2>
<p class="lead">Một nhúm câu lệnh không thuộc về chỗ nào khác, và một tính năng — cơ sở dữ liệu đánh số — trông như không gian tên mà không phải. Đây cũng là chỗ những công cụ trả lời câu "trong này thật ra có gì, và cái gì đang ăn bộ nhớ của tôi?" trú ngụ.</p>

<h3>Mười sáu cơ sở dữ liệu, và vì sao bạn nên bỏ qua chúng</h3>
<pre><code>redis-cli CONFIG GET databases
redis-cli -n 0 SET shared:key "in db 0"
redis-cli -n 3 GET shared:key
redis-cli -n 3 SET shared:key "in db 3"
redis-cli INFO keyspace</code></pre>
<div class="out">1) "databases"
2) "16"
OK
(nil)
OK
db0:keys=142,expires=8,avg_ttl=0
db3:keys=1,expires=0,avg_ttl=0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chúng KHÔNG phải không gian tên</span><span class="v">Chúng dùng chung một tiến trình, một luồng, một hạn mức bộ nhớ, một AOF, một luồng nhân bản. Không có gì được cách ly ngoài tên khoá. Một câu lệnh chậm ở db3 chặn cả db0.</span></div>
  <div class="kv"><span class="k">Redis Cluster chỉ có db0</span><span class="v">Ngay khoảnh khắc bạn cân nhắc dùng cluster, mọi lệnh <code>SELECT</code> trong mã của bạn trở thành một cuộc di chuyển. Riêng điều này đã là lý do tốt để đừng bao giờ bắt đầu dùng chúng.</span></div>
  <div class="kv"><span class="k"><code>SELECT</code> là trạng thái của TỪNG KẾT NỐI</span><span class="v">Với một client dùng chung hay có bể, một lệnh <code>SELECT</code> lạc sẽ để kết nối đó trỏ vào nhầm cơ sở dữ liệu cho MỌI câu lệnh về sau. Một nhóm lỗi thật sự khó chịu.</span></div>
  <div class="kv"><span class="k">Những chỗ dùng chính đáng</span><span class="v">Bài kiểm thử cần một cơ sở dữ liệu nháp để xoá sạch, và chạy hai ứng dụng nhỏ không liên quan trên một instance lúc phát triển. Cả hai đều là tiện lợi lúc phát triển.</span></div>
  <div class="kv"><span class="k">Hãy làm cái này thay thế</span><span class="v">Tiền tố khoá (Bài 2.1). Chúng chạy trong Cluster, chúng sống sót qua việc dùng lại kết nối, chúng nhìn thấy được trong mọi dòng log, và <code>SCAN --pattern</code> xử lý được.</span></div>
</div>

<h3>Chuyển một cái khoá</h3>
<pre><code>redis-cli SET a "value"
redis-cli COPY a b
redis-cli COPY a c REPLACE
redis-cli RENAME a a2
redis-cli RENAMENX b a2
redis-cli MOVE c 3
redis-cli EXISTS a a2 b c</code></pre>
<div class="out">(integer) 1
(integer) 1
OK
(integer) 0
(integer) 1
(integer) 2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">COPY (6.2+)</span><span class="lz-t">nhân bản một khoá, tuỳ chọn sang cơ sở dữ liệu khác</span><span class="lz-d"><code>COPY src dst DB 3 REPLACE</code>. Giữ nguyên TTL. Cách an toàn để chụp lại một cái khoá trước khi thử nghiệm.</span></div>
  <div class="lz-step"><span class="lz-k">RENAME</span><span class="lz-t">ghi đè lên đích trong im lặng</span><span class="lz-d">Và nếu cái đích vốn là một tập hợp khổng lồ thì lần xoá ngầm đó gây CHẶN — đây chính là thứ mà <code>lazyfree-lazy-server-del</code> ở Bài 2.3 sinh ra để lo. <code>RENAMENX</code> thì từ chối thay vì ghi đè, trả về 0.</span></div>
  <div class="lz-step"><span class="lz-k">MOVE</span><span class="lz-t">sang cơ sở dữ liệu khác, một cách nguyên tử</span><span class="lz-d">Chỉ có nghĩa nếu bạn dùng cơ sở dữ liệu đánh số, nên phần lớn là một thứ để biết cho vui. Thất bại nếu khoá đã tồn tại ở đích.</span></div>
  <div class="lz-step"><span class="lz-k">Cả ba đều GIỮ TTL</span><span class="lz-t">khác với SET</span><span class="lz-d">Một sự bất đối xứng dễ chịu so với Bài 2.2: những câu lệnh này chuyển cái KHOÁ <em>cùng với</em> thời hạn của nó, vì chúng chuyển ĐỐI TƯỢNG chứ không thay thế giá trị.</span></div>
</div>

<h3>DUMP và RESTORE: chuyển một khoá giữa hai máy chủ</h3>
<pre><code>redis-cli SET user:1042 '{"name":"Cường"}' EX 3600
redis-cli --no-raw DUMP user:1042
redis-cli -p 6380 RESTORE user:1042 3600000 "\\x00\\x11{\\"name\\":\\"C\\xc6\\xb0\\xe1\\xbb\\x9dng\\"}\\x0b\\x00\\x8e\\x1a\\x99\\x42\\x7f\\x2c\\x1d\\x4a"
redis-cli -p 6380 TTL user:1042</code></pre>
<div class="out">"\\x00\\x11{\\"name\\":\\"C\\xc6\\xb0\\xe1\\xbb\\x9dng\\"}\\x0b\\x00\\x8e\\x1a\\x99\\x42\\x7f\\x2c\\x1d\\x4a"
OK
(integer) 3599</div>
<div class="callout"><strong><code>DUMP</code> sinh ra giá trị của khoá đã mã hoá theo định dạng RDB cộng một số phiên bản và một tổng kiểm CRC64.</strong> <code>RESTORE</code> kiểm cả hai, nên một giá trị đổ ra từ Redis 7 sẽ bị Redis 6 TỪ CHỐI chứ không lặng lẽ làm hỏng gì. Cặp này chính là cách <code>MIGRATE</code> hoạt động bên trong, và nó là một cách chính đáng để chuyển một cái khoá cụ thể giữa các instance — kể cả sang một <code>maxmemory-policy</code> khác hay một cluster khác — mà không phải đổ cả tập dữ liệu.</div>
<pre><code><span class="tok-comment"># MIGRATE làm DUMP + RESTORE + DEL, nguyên tử, trong một câu lệnh</span>
redis-cli MIGRATE 127.0.0.1 6380 user:1042 0 5000 COPY REPLACE
redis-cli MIGRATE 127.0.0.1 6380 "" 0 5000 KEYS k1 k2 k3</code></pre>
<div class="out">OK
OK</div>

<h3>Trong này thật ra có gì?</h3>
<pre><code>redis-cli DBSIZE
redis-cli RANDOMKEY
redis-cli TYPE user:1042
redis-cli OBJECT ENCODING user:1042
redis-cli OBJECT REFCOUNT counter:42
redis-cli OBJECT IDLETIME user:1042
redis-cli MEMORY USAGE user:1042 SAMPLES 0</code></pre>
<div class="out">(integer) 142
"cache:v2:feed:home:p1"
hash
listpack
(integer) 2147483647
(integer) 41
(integer) 312</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>OBJECT REFCOUNT</code> = 2147483647</span><span class="v">Một số nguyên DÙNG CHUNG. Redis cấp phát sẵn các số nguyên 0–9999 rồi dùng lại, nên <code>SET counter 42</code> lưu một con trỏ tới đối tượng chung số 42 chứ không cấp phát gì. Con số refcount tối đa đó nghĩa là "dùng chung, không bao giờ giải phóng".</span></div>
  <div class="kv"><span class="k"><code>OBJECT IDLETIME</code></span><span class="v">Số giây kể từ lần truy cập gần nhất. Chỉ có nghĩa với chính sách LRU; với LFU thì bạn nhận <code>OBJECT FREQ</code> thay thế, một bộ đếm truy cập theo thang lô-ga-rit (Chương 9).</span></div>
  <div class="kv"><span class="k"><code>MEMORY USAGE key SAMPLES 0</code></span><span class="v">Chính xác thay vì lấy mẫu. Trên một tập hợp một triệu phần tử thì việc lấy mẫu mặc định chỉ là ước lượng; <code>SAMPLES 0</code> đi hết mọi thứ và chậm tương ứng.</span></div>
  <div class="kv"><span class="k"><code>RANDOMKEY</code></span><span class="v">O(1) và thật sự hữu ích để lấy mẫu một không gian khoá mà bạn chưa biết gì — chạy nó hai mươi lần là bạn nắm được hình dạng dữ liệu mà không cần <code>SCAN</code>.</span></div>
  <div class="kv"><span class="k"><code>OBJECT ENCODING</code></span><span class="v">Cái cần kiểm khi bộ nhớ làm bạn bất ngờ. <code>listpack</code> so với <code>hashtable</code>, <code>intset</code> so với <code>hashtable</code>, <code>embstr</code> so với <code>raw</code> — mỗi cặp là một khác biệt bộ nhớ lớn (Chương 3 và 5).</span></div>
</div>

<h3>Tìm những cái khoá đang ăn bộ nhớ của bạn</h3>
<pre><code>redis-cli --bigkeys 2&gt;/dev/null | tail -12</code></pre>
<div class="out">-------- summary -------
Sampled 1284419 keys in the keyspace!
Total key length in bytes is 28257218 (avg len 22.00)

Biggest   string found 'cache:v2:feed:home:p1' has 4194304 bytes
Biggest     list found 'queue:emails' has 184219 items
Biggest      set found 'online:users' has 2841192 members
Biggest     hash found 'user:1042' has 41 fields
Biggest     zset found 'leaderboard:global' has 1284419 members

0 lists with 184219 items (00.00% of keys, avg size 184219.00)
841 hashs with 34412 fields (00.07% of keys, avg size 40.92)
1 zsets with 1284419 members (00.00% of keys, avg size 1284419.00)</div>
<div class="callout ok"><strong><code>--bigkeys</code> dùng <code>SCAN</code> ở bên trong, nên chạy nó trên production là an toàn.</strong> Nó LẤY MẪU chứ không đo chính xác, và đó là sự đánh đổi đúng: bạn cần biết rằng <code>online:users</code> có 2,8 triệu thành viên, chứ không cần số byte chính xác của nó. Hai người anh em của nó là <code>--memkeys</code> (sắp theo BỘ NHỚ thay vì theo số phần tử, và đó thường mới là thứ bạn cần) và <code>--hotkeys</code> (đòi chính sách LFU, và cho thấy cái gì thật sự đang được đọc). Cùng nhau chúng trả lời gần như mọi câu hỏi kiểu "vì sao instance này dùng 12GB?".</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/object-encoding/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">OBJECT ENCODING</span><span class="lc-sub">Mọi cách mã hoá Redis dùng, các ngưỡng cấu hình gây ra chuyển đổi, và cái giá của từng cái. Trang tra cứu cho Chương 3 và 5.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/dump/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">DUMP, RESTORE và MIGRATE</span><span class="lc-sub">Định dạng tuần tự hoá, các phép kiểm phiên bản với tổng kiểm, và các tuỳ chọn của <code>MIGRATE</code> để chuyển nhiều khoá một lúc. Cách cluster chia lại dữ liệu.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/tools/cli/#scan-and-key-analysis" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">redis-cli --bigkeys, --memkeys, --hotkeys</span><span class="lc-sub">Từng chế độ lấy mẫu hoạt động ra sao và nó nói được gì với không nói được gì. An toàn trên production, và là thứ đầu tiên nên chạy khi bộ nhớ không giải thích được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: khám phá một không gian khoá</span><span class="lc-sub">Bài chấm điểm: tìm ba khoá lớn nhất trong một instance lạ, giải thích vì sao <code>OBJECT REFCOUNT</code> trả về 2147483647 cho một số nguyên nhỏ, và chuyển một cái khoá sang máy chủ khác mà giữ nguyên TTL.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng cơ sở dữ liệu đánh số làm không gian tên vì chúng trông đúng là công cụ hiển nhiên cho việc đó. Mọi thứ chạy tốt lúc phát triển, nơi mỗi ứng dụng có cơ sở dữ liệu riêng và sự phân tách cảm giác gọn gàng. Ba vấn đề tới về sau, và tới cùng lúc. <code>SELECT</code> là trạng thái của KẾT NỐI, nên với một client dùng chung hoặc có bể, một lệnh <code>SELECT</code> bị quên sẽ để kết nối đó trỏ vào db3 cho mọi câu lệnh về sau trong tiến trình — và triệu chứng là dữ liệu xuất hiện ở nhầm chỗ, lúc có lúc không, tuỳ theo kết nối nào trong bể phục vụ request đó. Redis Cluster chỉ hỗ trợ cơ sở dữ liệu 0, nên cái ngày bạn vượt quá một nút, mọi lệnh <code>SELECT</code> trong mã nguồn đều là một cuộc di chuyển. Và thật ra chẳng có gì được cách ly cả: một hạn mức bộ nhớ, một luồng, một <code>maxmemory-policy</code>, nên một thứ chạy loạn ở db3 sẽ đẩy mất khoá ở db0. Tiền tố khoá cho bạn đúng sự phân tách bạn thật sự muốn, chạy ở mọi nơi, và hiện ra trong log của bạn.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cơ sở dữ liệu đánh số KHÔNG phải không gian tên — một luồng, một hạn mức bộ nhớ, không hỗ trợ Cluster, và <code>SELECT</code> là trạng thái theo kết nối rò rỉ qua một client dùng chung. Hãy dùng tiền tố khoá thay thế. <code>COPY</code>, <code>RENAME</code> và <code>MOVE</code> giữ nguyên TTL vì chúng chuyển ĐỐI TƯỢNG chứ không thay thế giá trị, khác với <code>SET</code>. Và khi bộ nhớ không giải thích được, <code>redis-cli --bigkeys</code> với <code>--memkeys</code> trả lời được một cách an toàn ngay trên production vì chúng dựng trên <code>SCAN</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: keys and expiration|||2.6 — Trắc nghiệm: khoá và hết hạn',
      slug: 'rd-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về đặt tên khoá, SET xoá TTL, hết hạn không đúng giờ, bản sao không tự xoá, điều kiện dừng của SCAN, DEL với UNLINK, và vì sao cơ sở dữ liệu đánh số không phải không gian tên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the keyspace. Three of these describe bugs that are invisible for weeks and then present as "memory keeps growing" or "the cleanup script only deleted some of them".</p>
<div class="callout ok">Aim for 7/8. The three that matter most: which write commands clear a TTL (2.2), what actually terminates a <code>SCAN</code> loop (2.3), and why <code>UNLINK</code> should be your default (2.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về không gian khoá. Ba trong số này mô tả những cái lỗi vô hình suốt nhiều tuần rồi hiện ra thành "bộ nhớ cứ tăng" hoặc "script dọn dẹp chỉ xoá được một phần".</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: câu lệnh ghi nào xoá TTL (2.2), cái gì thật sự làm một vòng lặp <code>SCAN</code> dừng lại (2.3), và vì sao <code>UNLINK</code> nên là mặc định của bạn (2.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A key has 250 seconds of TTL left. You run `SET key newvalue`. What is the TTL afterwards?|||Một cái khoá còn 250 giây TTL. Bạn chạy `SET key newvalue`. Sau đó TTL là bao nhiêu?',
            options: [
              '250 — SET only changes the value|||250 — SET chỉ đổi giá trị',
              '-1 — a plain SET REPLACES the key and clears the TTL; use KEEPTTL, re-specify EX, or EXPIRE … GT. This is the classic session-store memory leak|||-1 — một lệnh SET trơn THAY THẾ cả cái khoá và xoá TTL; hãy dùng KEEPTTL, ghi lại EX, hoặc EXPIRE … GT. Đây là chỗ rò bộ nhớ kinh điển của kho phiên đăng nhập',
              '-2 — the key is deleted and recreated|||-2 — khoá bị xoá rồi tạo lại',
              '0 — the TTL is reset to zero and the key expires immediately|||0 — TTL bị đặt về không và khoá hết hạn ngay',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which of these commands PRESERVES an existing TTL?|||Câu lệnh nào sau đây GIỮ NGUYÊN một TTL đang có?',
            options: [
              'GETSET|||GETSET',
              'SET without KEEPTTL|||SET không kèm KEEPTTL',
              'APPEND — it modifies the value in place rather than replacing the key, as do INCR, HSET, LPUSH and SADD|||APPEND — nó sửa giá trị TẠI CHỖ chứ không thay thế cái khoá, giống như INCR, HSET, LPUSH và SADD',
              'RENAME onto an existing key|||RENAME đè lên một khoá đã có',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: '200,000 keys all have `EX 5`. Five seconds pass. What does DBSIZE show?|||200.000 khoá đều đặt `EX 5`. Năm giây trôi qua. DBSIZE hiện ra gì?',
            options: [
              'Still close to 200,000, dropping to zero over the next few seconds — expiration is lazy plus sampled, deliberately spread so the single thread stays responsive|||Vẫn gần 200.000, rồi tụt về không trong vài giây sau đó — hết hạn là lười cộng lấy mẫu, cố ý rải ra để cái luồng duy nhất còn đáp ứng được',
              '0 — expired keys are removed on schedule|||0 — khoá hết hạn được gỡ đi đúng giờ',
              '0, but memory stays allocated|||0, nhưng bộ nhớ vẫn còn được cấp phát',
              '200,000 forever until something reads them|||200.000 mãi mãi cho tới khi có thứ gì đọc chúng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A replica reports a higher DBSIZE than its primary. Is something wrong?|||Một bản sao báo DBSIZE cao hơn máy chính của nó. Có gì sai không?',
            options: [
              'Yes — replication has broken and needs a full resync|||Có — nhân bản đã hỏng và cần đồng bộ lại toàn phần',
              'Yes — the replica is accepting writes|||Có — bản sao đang nhận lệnh ghi',
              'Yes — this always indicates replication lag|||Có — chuyện này luôn cho thấy độ trễ nhân bản',
              'No — a replica never expires keys itself; it waits for an explicit DEL from the primary, so that reads on both never disagree|||Không — một bản sao KHÔNG BAO GIỜ tự làm hết hạn khoá; nó chờ một lệnh DEL tường minh từ máy chính, để lệnh đọc trên hai bên không bao giờ nói khác nhau',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Your SCAN loop is `while (keys.length) { ... }` with `MATCH lock:*`. What goes wrong?|||Vòng lặp SCAN của bạn là `while (keys.length) { ... }` với `MATCH lock:*`. Sai ở đâu?',
            options: [
              'It exits after the first empty batch and misses most of the keyspace — MATCH filters AFTER fetching, so empty batches are normal mid-iteration; terminate on a cursor of "0"|||Nó thoát ngay sau mẻ rỗng đầu tiên và bỏ sót phần lớn không gian khoá — MATCH lọc SAU khi lấy về, nên mẻ rỗng ở giữa lượt duyệt là bình thường; hãy dừng khi con trỏ bằng "0"',
              'It loops forever because MATCH never returns zero keys|||Nó lặp mãi mãi vì MATCH không bao giờ trả về không khoá nào',
              'It returns duplicates and double-deletes|||Nó trả về trùng lặp và xoá hai lần',
              'Nothing — this is the documented pattern|||Không sai gì — đây là mẫu được ghi trong tài liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should UNLINK be your default instead of DEL?|||Vì sao UNLINK nên là mặc định của bạn thay cho DEL?',
            options: [
              'UNLINK is atomic and DEL is not|||UNLINK nguyên tử còn DEL thì không',
              'DEL frees every element inline on the main thread — deleting one 5M-element set froze the server for 412ms versus 2ms; UNLINK hands the memory to a background thread and behaves identically on small keys|||DEL giải phóng từng phần tử ngay tại chỗ trên luồng chính — xoá một set 5 triệu phần tử làm đông cứng máy chủ 412ms so với 2ms; UNLINK giao bộ nhớ cho một luồng nền và hành xử y hệt với khoá nhỏ',
              'UNLINK works in Cluster and DEL does not|||UNLINK chạy trong Cluster còn DEL thì không',
              'DEL is deprecated in Redis 7|||DEL đã bị loại bỏ ở Redis 7',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You enable keyspace notifications with `notify-keyspace-events x` and subscribe. Nothing arrives. Why?|||Bạn bật thông báo không gian khoá bằng `notify-keyspace-events x` rồi đăng ký. Chẳng có gì tới. Vì sao?',
            options: [
              'Expired events are only sent on replicas|||Sự kiện expired chỉ được gửi trên bản sao',
              'You must restart Redis for the setting to apply|||Bạn phải khởi động lại Redis thì thiết lập mới có hiệu lực',
              'The flag string needs K or E as well — a class alone produces nothing, and the channel also carries the database number, so @0 must match your SELECT|||Chuỗi cờ còn cần thêm K hoặc E — chỉ một lớp thôi thì chẳng sinh ra gì, và tên kênh còn mang số cơ sở dữ liệu, nên @0 phải khớp với lệnh SELECT của bạn',
              'x is not a valid flag|||x không phải một cờ hợp lệ',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why are numbered databases (SELECT 3) a poor substitute for key prefixes?|||Vì sao cơ sở dữ liệu đánh số (SELECT 3) là thứ thay thế tồi cho tiền tố khoá?',
            options: [
              'They are slower to read from|||Đọc từ chúng chậm hơn',
              'They cannot hold more than 10,000 keys each|||Mỗi cái không chứa được quá 10.000 khoá',
              'They require a separate connection each|||Mỗi cái đòi một kết nối riêng',
              'Nothing is isolated — one thread, one memory limit, one policy — SELECT is per-connection state that leaks through a shared client, and Redis Cluster supports only db0|||Không có gì được cách ly — một luồng, một hạn mức bộ nhớ, một chính sách — SELECT là trạng thái theo kết nối rò rỉ qua một client dùng chung, và Redis Cluster chỉ hỗ trợ db0',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
  ],
};
