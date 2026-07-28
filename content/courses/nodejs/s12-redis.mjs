/**
 * Node.js — Chương 12: Redis (cache, TTL, cấu trúc dữ liệu, nguyên tử, vận hành).
 * Mọi output là đo thật: Node v22.21.0, Redis 7.4.9 (Docker, aarch64),
 * ioredis 5.11.1, node-redis 6.1.0, pg 8 + PostgreSQL trên :5433 với 500.000 ghi chú.
 * Cấu hình production lấy từ src/config/redis.ts, src/services/quota.service.ts
 * và src/index.ts của chính cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 12 — Redis: caching, TTL and atomicity|||Chương 12 — Redis: cache, TTL và tính nguyên tử',
  description: 'Vì sao một vòng đi-về đắt hơn chính công việc, cache-aside và bốn cách nó phản chủ, chọn cấu trúc dữ liệu tiết kiệm 95 lần RAM, giới hạn tần suất và khoá phân tán làm cho ĐÚNG, rồi những lệnh khiến Redis đứng hình.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — What Redis really is, and where the time goes|||12.1 — Redis thực chất là gì, và thời gian trôi đi đâu',
      slug: 'nodejs-12-1-redis-co-ban',
      type: 'VIDEO',
      description: 'Một lệnh Redis mất 0,204ms nhưng chỉ một phần rất nhỏ trong đó là công việc thật. Gộp 10.000 lệnh vào một pipeline nhanh hơn 63 lần — và phép đo đó định hình mọi thứ bạn viết sau này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>What Redis really is, and where the time goes</h2>
<p class="lead">Chapter 7 gave you a database that never forgets. This chapter gives you one that never waits. The trap is that "Redis is fast" is the least useful sentence anyone has ever said about it — it hides the single fact that determines whether your code is fast or slow: <strong>almost none of the time you spend on Redis is spent inside Redis</strong>. This lesson measures that gap and shows the two commands that close it.</p>

<h3>The shape of the thing</h3>
<p>Redis is a server that keeps its data in RAM and answers over TCP. Four properties follow, and all four matter:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">In RAM</span><span class="lz-d">reads and writes cost nanoseconds, not disk seeks. It also means the dataset must FIT in RAM, and that RAM is the resource you run out of</span></div>
  <div class="lz-layer"><span class="lz-t">Single-threaded for commands</span><span class="lz-d">one command runs at a time, start to finish. That gives you atomicity for free — and means one slow command freezes every other client (lesson 12.5)</span></div>
  <div class="lz-layer"><span class="lz-t">Data structures, not just strings</span><span class="lz-d">hashes, sets, sorted sets, bitmaps, streams. Choosing the right one is worth 95× the RAM (lesson 12.3)</span></div>
  <div class="lz-layer"><span class="lz-t">Over the network</span><span class="lz-d">every command is a round trip. This is the cost that dominates, and the one beginners never see</span></div>
</div>

<h3>Measurement 1 — the price of a round trip</h3>
<p>PING is the cheapest command Redis has. It does no work at all. Two thousand of them, one after another, on localhost — the friendliest network that exists:</p>
<div class="out">[1] 2000 PING tuần tự: 408,8ms → 0,204ms/lệnh → 4.893 lệnh/giây</div>
<p>Read that again: <strong>4.893 operations per second against a database that advertises hundreds of thousands</strong>. Nothing is wrong with Redis. The 0,204ms is the socket: write the request, let the kernel schedule it, let Redis wake up, read, reply, wake your process back up. The actual PING is a rounding error inside that number.</p>
<p>Now do real work — 10.000 SET commands, each awaited:</p>
<div class="out">[2a] 10.000 SET tuần tự (await từng lệnh): 1965,3ms → 5.088 lệnh/giây</div>
<p>Writing 10.000 keys costs the <em>same</em> as pinging 10.000 times. The work is free; the waiting is everything.</p>

<h3>Measurement 2 — pipelining, the single most important optimisation</h3>
<p>A pipeline sends many commands without waiting for each reply, then reads all replies at once. Same 10.000 SETs, four ways:</p>
<div class="out">[2a] 10.000 SET tuần tự (await từng lệnh):            1965,3ms →   5.088 lệnh/giây
[2b] 10.000 SET trong 1 pipeline:                       31,1ms → 321.960 lệnh/giây
[2c] 10.000 SET trong 1 MULTI/EXEC:                     32,6ms → 306.914 lệnh/giây
[2d] 10.000 SET Promise.all + enableAutoPipelining:     35,9ms → 278.617 lệnh/giây
[2e] 10.000 SET Promise.all KHÔNG auto-pipelining:      65,8ms → 151.897 lệnh/giây</div>
<p><strong>63× faster for the same work.</strong> Not a micro-optimisation — a different order of magnitude, available by changing three lines.</p>
<p>Line [2e] is the subtle one. <code>Promise.all</code> alone already helps a lot (5.088 → 151.897) because the commands leave your process without blocking on each other. But ioredis with <code>enableAutoPipelining: true</code> goes further: it batches everything queued within the same event-loop tick into one write to the socket. That is the flag you want on by default.</p>

<h3>Is a bigger batch always better?</h3>
<div class="out">[3] lô     1 lệnh/pipeline:  1960,1ms  (  5.102 lệnh/giây)
[3] lô    10 lệnh/pipeline:   215,3ms  ( 46.443 lệnh/giây)
[3] lô   100 lệnh/pipeline:    39,9ms  (250.595 lệnh/giây)
[3] lô  1000 lệnh/pipeline:    20,2ms  (495.899 lệnh/giây)
[3] lô 10000 lệnh/pipeline:    18,7ms  (534.799 lệnh/giây)</div>
<p>The curve flattens hard after ~100. Going from 1 to 100 buys 49×; going from 1.000 to 10.000 buys 8%. Since Redis is single-threaded, a giant pipeline is one long command batch that <em>blocks every other client</em> while it runs. <strong>Batch in chunks of 100–1.000, not "all of it".</strong></p>

<h3>MGET: pipelining that is built into the command</h3>
<div class="out">[4] 1000 GET tuần tự 200,2ms  vs  1 MGET 1000 khoá 1,6ms → nhanh hơn 127,3×</div>
<p>Whenever you are about to loop over ids and GET each one, look for the plural version first: <code>MGET</code>, <code>HMGET</code>, <code>SMEMBERS</code>, <code>ZRANGE</code>. One command, one round trip.</p>

<h3>How much does the payload size matter?</h3>
<div class="out">[5] GET giá trị     100 byte: 0,186ms/lệnh →   1 MB/giây
[5] GET giá trị    1024 byte: 0,192ms/lệnh →   5 MB/giây
[5] GET giá trị   10240 byte: 0,204ms/lệnh →  48 MB/giây
[5] GET giá trị  102400 byte: 0,370ms/lệnh → 264 MB/giây
[5] GET giá trị 1048576 byte: 1,333ms/lệnh → 750 MB/giây</div>
<p>Going from 100 bytes to 10 KB — <strong>100× more data</strong> — costs 10% more time. The round trip dominates until roughly 100 KB. This has a design consequence people get backwards: <em>fetching one 10 KB object is much cheaper than fetching a hundred 100-byte objects</em>. Grouping related data into one key is usually the right call.</p>

<h3>Choosing a client</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ioredis 5.11.1</span><span class="v">9 packages, 1,4 MB. Promise-native, <code>enableAutoPipelining</code>, first-class Cluster and Sentinel support, Lua helpers via <code>defineCommand</code></span></div>
  <div class="kv"><span class="k">node-redis 6.1.0</span><span class="v">7 packages but <strong>14 MB</strong> — <code>@redis/client</code> alone is 10 MB because it ships full typings for every command plus the Search/JSON/Bloom/TimeSeries modules. Official client, RESP3 by default</span></div>
</div>
<p>Both are fine. This chapter uses ioredis for the measurements because auto-pipelining makes the pipeline lesson demonstrable in one flag; the production code shown at the end of each lesson uses node-redis, because that is what this site actually runs.</p>

<h3>Connecting properly from Node</h3>
<pre><code class="language-javascript">// src/config/redis.js — MỘT client dùng chung cho cả tiến trình
import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;
  client = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    enableAutoPipelining: true,     // gộp lệnh trong cùng một tick — xem phép đo [2d]
    maxRetriesPerRequest: 2,        // đừng thử lại vô hạn: thà lỗi nhanh còn hơn treo request
    retryStrategy: (times) =&gt; Math.min(times * 50, 2000),
  });
  client.on('error', (err) =&gt; console.error('redis error', err.message));
  return client;
}</code></pre>
<p>Three decisions in that snippet are worth defending. <strong>One client per process</strong>, not one per request — a TCP connection is expensive to open and Redis is happy to multiplex thousands of commands over one socket. <strong>A bounded retry</strong>, because an unbounded one turns a Redis blip into a pile of hung HTTP requests. And <strong>an error listener</strong>, because in Node an <code>EventEmitter</code> that emits <code>error</code> with nobody listening crashes the process — chapter 3.4 measured exactly that.</p>

<div class="pitfall">
<p><strong>The mistake that makes Redis slower than Postgres.</strong> A route that does <code>for (const id of ids) await redis.get(&#96;user:\${id}&#96;)</code> for 200 ids pays 200 round trips = ~41ms, while a single Postgres query with <code>WHERE id = ANY($1)</code> returns the same rows in ~2ms. People then conclude "Redis is slow here" and remove it. The problem was never Redis — it was the loop. <code>MGET</code> makes the same fetch 1,6ms.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>src/config/redis.ts</code> exports a single lazy <code>getRedis()</code> that memoises the client and returns the in-flight connect promise if one is already running — so twenty concurrent first-requests open <em>one</em> connection, not twenty. Reconnect uses <code>reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000)</code>: back off gradually, never wait longer than 2 seconds. Production right now reports <code>connected_clients:4</code> for the whole backend.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-422"><span class="lc-t">Code Lab · Redis Setup and Foundation</span><span class="lc-d">Cài đặt, redis-cli, kiểu dữ liệu đầu tiên — làm tay trước khi đọc tiếp</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-429"><span class="lc-t">Code Lab · Performance, Scripting, and Production Patterns</span><span class="lc-d">Pipeline, benchmark và các khuôn mẫu production</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Redis thực chất là gì, và thời gian trôi đi đâu</h2>
<p class="lead">Chương 7 cho bạn một cơ sở dữ liệu không bao giờ quên. Chương này cho bạn một cái không bao giờ bắt chờ. Cái bẫy là câu "Redis nhanh" — câu vô dụng nhất từng có người nói về nó, vì nó che mất đúng một sự thật quyết định code của bạn nhanh hay chậm: <strong>gần như toàn bộ thời gian bạn bỏ ra cho Redis KHÔNG hề diễn ra bên trong Redis</strong>. Bài này đo khoảng cách đó và chỉ ra hai câu lệnh khép nó lại.</p>

<h3>Hình hài của thứ này</h3>
<p>Redis là một máy chủ giữ dữ liệu trong RAM và trả lời qua TCP. Từ đó suy ra bốn tính chất, và cả bốn đều quan trọng:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Nằm trong RAM</span><span class="lz-d">đọc và ghi tốn nano-giây chứ không phải một cú quay đầu đọc đĩa. Đổi lại, toàn bộ dữ liệu PHẢI vừa trong RAM, và RAM chính là thứ bạn sẽ hết</span></div>
  <div class="lz-layer"><span class="lz-t">Một luồng cho mọi lệnh</span><span class="lz-d">mỗi lúc chỉ một lệnh chạy, từ đầu tới cuối. Điều đó cho bạn tính nguyên tử miễn phí — và cũng có nghĩa MỘT lệnh chậm làm đông cứng mọi client khác (bài 12.5)</span></div>
  <div class="lz-layer"><span class="lz-t">Cấu trúc dữ liệu chứ không chỉ chuỗi</span><span class="lz-d">hash, set, sorted set, bitmap, stream. Chọn đúng kiểu đáng giá 95 lần RAM (bài 12.3)</span></div>
  <div class="lz-layer"><span class="lz-t">Đi qua mạng</span><span class="lz-d">mỗi lệnh là một vòng đi-về. Đây là chi phí chiếm ưu thế, và là thứ người mới không bao giờ nhìn thấy</span></div>
</div>

<h3>Phép đo 1 — giá của một vòng đi-về</h3>
<p>PING là lệnh rẻ nhất Redis có. Nó không làm gì cả. Hai nghìn lần PING nối tiếp nhau, trên localhost — mạng thân thiện nhất tồn tại trên đời:</p>
<div class="out">[1] 2000 PING tuần tự: 408,8ms → 0,204ms/lệnh → 4.893 lệnh/giây</div>
<p>Hãy đọc lại: <strong>4.893 thao tác mỗi giây, trên một cơ sở dữ liệu quảng cáo hàng trăm nghìn</strong>. Redis không hỏng chỗ nào cả. 0,204ms đó là cái socket: ghi request ra, để nhân hệ điều hành xếp lịch, để Redis thức dậy, đọc, trả lời, rồi đánh thức tiến trình của bạn dậy lần nữa. Bản thân lệnh PING chỉ là sai số làm tròn bên trong con số ấy.</p>
<p>Giờ làm việc thật — 10.000 lệnh SET, mỗi lệnh một <code>await</code>:</p>
<div class="out">[2a] 10.000 SET tuần tự (await từng lệnh): 1965,3ms → 5.088 lệnh/giây</div>
<p>Ghi 10.000 khoá tốn <em>đúng bằng</em> ping 10.000 lần. Công việc thì miễn phí; cái chờ đợi mới là tất cả.</p>

<h3>Phép đo 2 — pipeline, tối ưu quan trọng nhất trong chương này</h3>
<p>Pipeline gửi nhiều lệnh đi mà không chờ từng phản hồi, rồi đọc tất cả phản hồi một lượt. Vẫn 10.000 lệnh SET đó, làm theo bốn cách:</p>
<div class="out">[2a] 10.000 SET tuần tự (await từng lệnh):            1965,3ms →   5.088 lệnh/giây
[2b] 10.000 SET trong 1 pipeline:                       31,1ms → 321.960 lệnh/giây
[2c] 10.000 SET trong 1 MULTI/EXEC:                     32,6ms → 306.914 lệnh/giây
[2d] 10.000 SET Promise.all + enableAutoPipelining:     35,9ms → 278.617 lệnh/giây
[2e] 10.000 SET Promise.all KHÔNG auto-pipelining:      65,8ms → 151.897 lệnh/giây</div>
<p><strong>Nhanh hơn 63 lần cho cùng một khối lượng công việc.</strong> Đây không phải tối ưu vặt — đây là một bậc độ lớn khác hẳn, đổi lấy bằng ba dòng code.</p>
<p>Dòng [2e] mới là dòng tinh tế. Chỉ riêng <code>Promise.all</code> đã giúp rất nhiều (5.088 → 151.897) vì các lệnh rời khỏi tiến trình của bạn mà không chặn lẫn nhau. Nhưng ioredis với <code>enableAutoPipelining: true</code> đi xa hơn: nó gom mọi lệnh xếp hàng trong CÙNG một tick của event loop thành MỘT lần ghi xuống socket. Đó là cờ bạn nên bật mặc định.</p>

<h3>Lô càng to càng tốt phải không?</h3>
<div class="out">[3] lô     1 lệnh/pipeline:  1960,1ms  (  5.102 lệnh/giây)
[3] lô    10 lệnh/pipeline:   215,3ms  ( 46.443 lệnh/giây)
[3] lô   100 lệnh/pipeline:    39,9ms  (250.595 lệnh/giây)
[3] lô  1000 lệnh/pipeline:    20,2ms  (495.899 lệnh/giây)
[3] lô 10000 lệnh/pipeline:    18,7ms  (534.799 lệnh/giây)</div>
<p>Đường cong phẳng ra rất nhanh sau mốc ~100. Đi từ 1 lên 100 mua được 49 lần; đi từ 1.000 lên 10.000 chỉ mua thêm 8%. Mà vì Redis chạy một luồng, một pipeline khổng lồ là một lô lệnh dài <em>chặn mọi client khác</em> trong lúc nó chạy. <strong>Hãy chia lô 100–1.000 lệnh, đừng "gửi tất".</strong></p>

<h3>MGET: pipeline được đóng sẵn vào trong lệnh</h3>
<div class="out">[4] 1000 GET tuần tự 200,2ms  vs  1 MGET 1000 khoá 1,6ms → nhanh hơn 127,3×</div>
<p>Bất cứ khi nào bạn sắp lặp qua một danh sách id rồi GET từng cái, hãy tìm phiên bản số nhiều trước: <code>MGET</code>, <code>HMGET</code>, <code>SMEMBERS</code>, <code>ZRANGE</code>. Một lệnh, một vòng đi-về.</p>

<h3>Kích thước dữ liệu ảnh hưởng bao nhiêu?</h3>
<div class="out">[5] GET giá trị     100 byte: 0,186ms/lệnh →   1 MB/giây
[5] GET giá trị    1024 byte: 0,192ms/lệnh →   5 MB/giây
[5] GET giá trị   10240 byte: 0,204ms/lệnh →  48 MB/giây
[5] GET giá trị  102400 byte: 0,370ms/lệnh → 264 MB/giây
[5] GET giá trị 1048576 byte: 1,333ms/lệnh → 750 MB/giây</div>
<p>Từ 100 byte lên 10 KB — <strong>gấp 100 lần dữ liệu</strong> — chỉ tốn thêm 10% thời gian. Vòng đi-về vẫn chiếm ưu thế cho tới quãng 100 KB. Điều này dẫn tới một hệ quả thiết kế mà nhiều người hiểu ngược: <em>lấy MỘT đối tượng 10 KB rẻ hơn nhiều so với lấy một trăm đối tượng 100 byte</em>. Gom dữ liệu liên quan vào chung một khoá thường là lựa chọn đúng.</p>

<h3>Chọn thư viện client</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ioredis 5.11.1</span><span class="v">9 gói, 1,4 MB. Promise thuần, có <code>enableAutoPipelining</code>, hỗ trợ Cluster và Sentinel hạng nhất, khai báo Lua bằng <code>defineCommand</code></span></div>
  <div class="kv"><span class="k">node-redis 6.1.0</span><span class="v">7 gói nhưng <strong>14 MB</strong> — riêng <code>@redis/client</code> đã 10 MB vì nó đóng gói đầy đủ typing cho mọi lệnh cộng thêm các module Search/JSON/Bloom/TimeSeries. Client chính chủ, mặc định dùng RESP3</span></div>
</div>
<p>Cả hai đều tốt. Chương này dùng ioredis để đo vì cờ auto-pipelining khiến bài học về pipeline chứng minh được chỉ bằng một dòng cấu hình; còn code production trích ở cuối mỗi bài dùng node-redis, vì đó là thứ trang này thật sự đang chạy.</p>

<h3>Kết nối cho đúng từ Node</h3>
<pre><code class="language-javascript">// src/config/redis.js — MỘT client dùng chung cho cả tiến trình
import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;
  client = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    enableAutoPipelining: true,     // gộp lệnh trong cùng một tick — xem phép đo [2d]
    maxRetriesPerRequest: 2,        // đừng thử lại vô hạn: thà lỗi nhanh còn hơn treo request
    retryStrategy: (times) =&gt; Math.min(times * 50, 2000),
  });
  client.on('error', (err) =&gt; console.error('redis error', err.message));
  return client;
}</code></pre>
<p>Ba quyết định trong đoạn code đó đều đáng bảo vệ. <strong>Một client cho một tiến trình</strong>, không phải một client cho mỗi request — mở một kết nối TCP là đắt, còn Redis thì rất sẵn lòng ghép hàng nghìn lệnh trên chung một socket. <strong>Số lần thử lại có giới hạn</strong>, vì thử lại vô hạn biến một cú nấc của Redis thành cả đống request HTTP treo lơ lửng. Và <strong>phải có listener cho sự kiện error</strong>, vì trong Node một <code>EventEmitter</code> phát ra <code>error</code> mà không ai nghe sẽ làm sập tiến trình — bài 3.4 đã đo đúng chuyện đó.</p>

<div class="pitfall">
<p><strong>Lỗi khiến Redis chậm hơn cả Postgres.</strong> Một route viết <code>for (const id of ids) await redis.get(&#96;user:\${id}&#96;)</code> cho 200 id sẽ trả giá 200 vòng đi-về = ~41ms, trong khi MỘT truy vấn Postgres với <code>WHERE id = ANY($1)</code> trả về đúng ngần ấy dòng trong ~2ms. Người ta bèn kết luận "chỗ này Redis chậm" rồi gỡ Redis ra. Vấn đề chưa bao giờ nằm ở Redis — nó nằm ở cái vòng lặp. Cũng phép lấy đó, <code>MGET</code> làm trong 1,6ms.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>src/config/redis.ts</code> export đúng một hàm <code>getRedis()</code> khởi tạo lười, ghi nhớ client lại, và nếu đang có một lần connect dở dang thì trả về chính promise đó — nhờ vậy hai mươi request đầu tiên chạy song song chỉ mở <em>một</em> kết nối chứ không phải hai mươi. Chiến lược nối lại là <code>reconnectStrategy: (retries) =&gt; Math.min(retries * 50, 2000)</code>: lùi dần, nhưng không bao giờ chờ quá 2 giây. Production ngay lúc viết bài báo <code>connected_clients:4</code> cho toàn bộ backend.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-422"><span class="lc-t">Code Lab · Redis Setup and Foundation</span><span class="lc-d">Cài đặt, redis-cli, kiểu dữ liệu đầu tiên — làm tay trước khi đọc tiếp</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-429"><span class="lc-t">Code Lab · Performance, Scripting, and Production Patterns</span><span class="lc-d">Pipeline, benchmark và các khuôn mẫu production</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Cache-aside: the pattern and its four betrayals|||12.2 — Cache-aside: khuôn mẫu và bốn lần nó phản chủ',
      slug: 'nodejs-12-2-cache-aside',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-12-2-cache-aside.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-12-2-cache-aside.jpg',
        scenario: 'nodejs-cache-aside',
        durationSeconds: 16,
        caption: { en: "Cache-aside and its four betrayals", vi: "Cache-aside và bốn lần nó phản chủ" },
      },
      type: 'VIDEO',
      description: 'Cache nhanh hơn Postgres 120 lần — cho tới payload 1,2MB thì nó THUA. Tỉ lệ trúng 90% chỉ mang lại một phần nhỏ lợi ích so với 99%. Và 200 request cùng lúc biến cache thành một khẩu súng chĩa vào database.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Cache-aside: the pattern and its four betrayals</h2>
<p class="lead">Every measurement in this lesson runs against a real PostgreSQL database with <strong>500.000 notes and 5.000 users</strong> on the local instance from chapter 7. The expensive query is a leaderboard — <code>GROUP BY</code> over every row, ordered by total views. It is the shape of query that every product eventually grows, and the shape that caching exists for.</p>

<h3>The pattern, in four lines</h3>
<pre><code class="language-javascript">async function getLeaderboard() {
  const hit = await redis.get('lb:top20');          // 1. hỏi cache
  if (hit) return JSON.parse(hit);                  // 2. trúng → xong
  const rows = await db.query(SQL_HEAVY);           // 3. trượt → hỏi nguồn thật
  await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);  // 4. ghi lại, CÓ HẠN
  return rows;
}</code></pre>
<p>This is <em>cache-aside</em>: the application, not the database, owns the cache. The alternatives (read-through, write-through, write-behind) hide the cache behind a library. Cache-aside is the one to learn first because every failure mode is visible in code you wrote.</p>

<h3>Betrayal 0 — none: the case where it just works</h3>
<div class="out">[1] Postgres bảng xếp hạng (GROUP BY 500k dòng): 48,04ms  | trang chủ 20 dòng mới nhất: 0,46ms
    payload JSON: 1231 byte
[2] Redis GET + JSON.parse: 0,40ms → nhanh hơn Postgres 120,0×</div>
<p>120× on the leaderboard. Note the second number on line [1] though: the "20 newest notes" query — the one that actually renders the homepage — already runs in <strong>0,46ms</strong> because chapter 7.5 put an index on <code>created_at</code>. Caching that would buy 0,06ms and cost you an invalidation bug. <strong>Cache the aggregate, not the indexed lookup.</strong></p>
<p>And where does the 0,40ms go?</p>
<div class="out">[3] GET thô 0,26ms | JSON.parse 0,01ms | JSON.stringify 0,00ms</div>
<p>Two thirds of it is the round trip from lesson 12.1. JSON is free at this size.</p>

<h3>Betrayal 1 — the big payload, where cache LOSES</h3>
<p>Same experiment, but caching 5.000 notes including their body text:</p>
<div class="out">[4] payload 1192KB: GET 4,45ms + JSON.parse 1,93ms = 6,39ms
    cùng dữ liệu lấy thẳng Postgres: 5,38ms → cache THUA 0,8×</div>
<p>Read that carefully, because it contradicts the reason most people install Redis. Caching a 1,2 MB result made the endpoint <strong>18% slower</strong> than just asking PostgreSQL. Postgres is not slow at streaming rows; it is slow at <em>aggregating</em> them. Once the payload is large enough that transfer and <code>JSON.parse</code> dominate, the cache is just a second network hop with extra steps.</p>
<p>The rule this measurement gives you: <strong>cache things that are expensive to COMPUTE, not things that are merely large.</strong> A 1 KB leaderboard that takes 48ms to build is a perfect cache entry. A 1,2 MB list that takes 5ms to fetch is not.</p>

<h3>Betrayal 2 — the hit rate is not linear</h3>
<p>300 requests, varying what fraction hit the cache:</p>
<div class="out">[7] tỉ lệ trúng   0%: 300 request mất 14510,04ms → 48,37ms/request
[7] tỉ lệ trúng  50%: 300 request mất  7472,82ms → 24,91ms/request
[7] tỉ lệ trúng  90%: 300 request mất  1557,79ms →  5,19ms/request
[7] tỉ lệ trúng  99%: 300 request mất   128,89ms →  0,43ms/request
[7] tỉ lệ trúng 100%: 300 request mất    60,50ms →  0,20ms/request</div>
<p>A 90% hit rate sounds excellent and delivers <strong>5,19ms</strong> — twelve times worse than 99%. The arithmetic is unforgiving: at 90%, one request in ten still pays the full 48ms, and that one dominates the average. This is why "we added caching and it's still slow" is such a common report, and why the number to alert on is <em>misses per second</em>, not hit percentage.</p>

<h3>Betrayal 3 — TTL, and the SET that silently removes it</h3>
<div class="out">[5] sau    0ms: GET="xin chào" TTL=3
[5] sau 1000ms: GET="xin chào" TTL=2
[5] sau 2000ms: GET=null TTL=-2
    TTL -2 = khoá không tồn tại, -1 = tồn tại nhưng KHÔNG có hạn
[5b] khoá không đặt hạn → TTL=-1</div>
<p>Those two negative numbers are worth memorising: <strong>-2 means gone, -1 means immortal</strong>. And -1 is how a cache turns into a leak:</p>
<div class="out">[6] SET lại KHÔNG kèm EX: TTL 100 → -1 (mất hạn, khoá sống mãi) | dùng KEEPTTL → TTL 100</div>
<p>Writing a key that already had an expiry, without repeating <code>EX</code>, <strong>removes the expiry</strong>. The key now lives until Redis restarts or evicts it. One refresh path in your codebase that forgets <code>EX</code> is enough to slowly fill Redis with immortal stale entries. Use <code>KEEPTTL</code> when you mean "update the value, keep the deadline".</p>

<h3>Betrayal 4 — the stampede</h3>
<p>This is the one that takes production down. A popular key expires. Two hundred in-flight requests all miss, all query the database, all write the same value back.</p>
<div class="out">--- 200 request đồng thời, cache RỖNG (mô phỏng đúng lúc TTL vừa hết) ---
[1] cache-aside ngây thơ           200 lần hỏi Postgres |  6064,6ms cho 200 request | dữ liệu OK
[2] single-flight trong tiến trình   1 lần hỏi Postgres |    65,3ms cho 200 request | dữ liệu OK
[3] khoá phân tán SET NX             1 lần hỏi Postgres |    99,1ms cho 200 request | dữ liệu OK
[4] cache-aside ngây thơ, cache ẤM   0 lần hỏi Postgres |    14,9ms cho 200 request</div>
<p>The naive version fired <strong>200 identical expensive queries</strong> and took 6 seconds. Note that the code is <em>correct</em> — everyone got the right answer. It is correct and it is a denial-of-service attack you wrote yourself. Compare line [4]: the same code, when the cache happens to be warm, is 400× faster. Your endpoint's latency now depends on a coin flip.</p>

<h4>Fix A — single-flight (in-process)</h4>
<pre><code class="language-javascript">const inflight = new Map();

async function getLeaderboard() {
  const hit = await redis.get(KEY);
  if (hit) return JSON.parse(hit);

  if (inflight.has(KEY)) return inflight.get(KEY);   // đã có người đang nạp → bám vào

  const p = (async () =&gt; {
    const rows = await db.query(SQL_HEAVY);
    await redis.set(KEY, JSON.stringify(rows), 'EX', 60);
    return rows;
  })().finally(() =&gt; inflight.delete(KEY));

  inflight.set(KEY, p);
  return p;
}</code></pre>
<p>Twelve lines, one database query instead of 200, and <strong>93× faster</strong>. It works because the event loop is single-threaded: between <code>inflight.has</code> and <code>inflight.set</code> nothing else can run, so there is no race to worry about. The limitation is in the name: <em>in-process</em>. Four Node processes behind a load balancer means four queries, not one — which is still 50× better than 200.</p>

<h4>Fix B — a distributed lock</h4>
<p>When one query per process is still too many (a 10-second report, an expensive third-party API call), take a lock in Redis so exactly one process across the whole fleet does the work:</p>
<pre><code class="language-javascript">const got = await redis.set(&#96;\${KEY}:lock&#96;, '1', 'PX', 5000, 'NX');
if (got) {
  try { /* nạp lại và ghi vào cache */ } finally { await redis.del(&#96;\${KEY}:lock&#96;); }
} else {
  // không giành được: chờ ngắn rồi đọc lại cache
}</code></pre>
<p>It costs more (99,1ms vs 65,3ms) because the losers poll for the winner to finish. Lesson 12.4 shows why the naive <code>del</code> above is <em>wrong</em> and what to write instead.</p>

<h4>Fix C — jitter, so keys do not die together</h4>
<div class="out">[5] 50 khoá TTL cố định 60s → tất cả hết hạn trong khoảng 60–60s (cùng một giây)
    50 khoá TTL 60s + jitter 0–30s → hết hạn rải ra 60–89s</div>
<p>If a deploy warms 50 caches in the same second with the same TTL, all 50 expire in the same second sixty seconds later — a synchronised stampede across <em>different</em> keys, which no per-key lock can help with. <code>EX: 60 + Math.floor(Math.random() * 30)</code> costs nothing and removes the whole failure class.</p>

<h3>Invalidation: the part nobody enjoys</h3>
<p>There are exactly three honest strategies, and picking one is a product decision, not a technical one:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">TTL only</span><span class="v">"stale for at most 60 seconds is fine". Simplest, no invalidation code, no bugs. Correct for leaderboards, trending lists, counts</span></div>
  <div class="kv"><span class="k">Delete on write</span><span class="v"><code>DEL</code> the key inside the same code path that changes the data. Correct for user profiles. The bug is always the write path you forgot</span></div>
  <div class="kv"><span class="k">Version in the key</span><span class="v"><code>note:42:v7</code> — bump the version and every old key becomes unreachable and expires on its own. No delete, no race. Costs RAM until the old entries expire</span></div>
</div>
<p>Prefer TTL. Reach for delete-on-write only when a stale read is user-visible and embarrassing. <strong>Never</strong> write update-the-cache-in-place logic: two concurrent writers will interleave and leave the cache holding a value that was never in the database.</p>

<div class="pitfall">
<p><strong>Caching the miss.</strong> If <code>GET user:99999</code> misses and the database also returns nothing, the naive code caches nothing — so every request for a non-existent id hits the database forever. An attacker requesting random ids turns your cache into a pass-through. Cache the negative result too, with a short TTL: <code>SET user:99999 "null" EX 30</code>. And remember that <code>if (hit)</code> is false for the string <code>"null"</code>… no, it is not — <code>"null"</code> is truthy, so use <code>hit !== null</code> as the miss test, never <code>if (!hit)</code>, or an empty-string cache entry will be treated as a miss on every request.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Production Redis right now holds <strong>26 keys in 1,23 MB</strong> with <code>maxmemory 256M</code> and <code>keyspace_hits:165 / keyspace_misses:20</code> — an 89,2% hit rate. Almost nothing on this site is a cached query; the keys are all rate-limit and quota counters (<code>rl:general:&lt;ip&gt;</code>, <code>quota:&lt;userId&gt;:month:2026-07</code>). That is a deliberate and slightly uncomfortable admission: the site's expensive reads were made fast by <em>indexes</em> in chapter 7, and an index that turns 28ms into 0,129ms is a better fix than a cache, because it has no invalidation story at all. Redis earns its place here for the things a database genuinely cannot do — counters shared across processes, which is lesson 12.4.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-740"><span class="lc-t">Code Lab · Distributed Caching Strategies and Patterns</span><span class="lc-d">Cache-aside, write-through, stampede và các cách làm mới cache</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-424"><span class="lc-t">Code Lab · Expiration, TTL, and Key Management</span><span class="lc-d">EXPIRE, TTL, KEEPTTL và đặt tên khoá cho có kỷ luật</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Cache-aside: khuôn mẫu và bốn lần nó phản chủ</h2>
<p class="lead">Mọi phép đo trong bài này chạy trên một cơ sở dữ liệu PostgreSQL thật với <strong>500.000 ghi chú và 5.000 người dùng</strong>, trên đúng máy chủ cục bộ của chương 7. Truy vấn đắt tiền là một bảng xếp hạng — <code>GROUP BY</code> trên toàn bộ số dòng rồi sắp theo tổng lượt xem. Đó là dạng truy vấn mà sản phẩm nào rồi cũng mọc ra, và cũng là dạng mà cache sinh ra để phục vụ.</p>

<h3>Khuôn mẫu, gói gọn trong bốn dòng</h3>
<pre><code class="language-javascript">async function getLeaderboard() {
  const hit = await redis.get('lb:top20');          // 1. hỏi cache
  if (hit) return JSON.parse(hit);                  // 2. trúng → xong
  const rows = await db.query(SQL_HEAVY);           // 3. trượt → hỏi nguồn thật
  await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);  // 4. ghi lại, CÓ HẠN
  return rows;
}</code></pre>
<p>Đây là <em>cache-aside</em>: ứng dụng sở hữu cache, chứ không phải cơ sở dữ liệu. Các lựa chọn khác (read-through, write-through, write-behind) giấu cache sau một thư viện. Cache-aside là thứ nên học đầu tiên vì mọi kiểu hỏng của nó đều nhìn thấy được trong code do chính bạn viết.</p>

<h3>Lần phản chủ số 0 — không có: trường hợp nó chạy ngon</h3>
<div class="out">[1] Postgres bảng xếp hạng (GROUP BY 500k dòng): 48,04ms  | trang chủ 20 dòng mới nhất: 0,46ms
    payload JSON: 1231 byte
[2] Redis GET + JSON.parse: 0,40ms → nhanh hơn Postgres 120,0×</div>
<p>120 lần trên bảng xếp hạng. Nhưng hãy để ý con số thứ hai ở dòng [1]: truy vấn "20 ghi chú mới nhất" — cái thật sự dựng nên trang chủ — vốn đã chạy trong <strong>0,46ms</strong> vì bài 7.5 đã đặt chỉ mục lên <code>created_at</code>. Cache cái đó mua được 0,06ms và tặng kèm cho bạn một con bug làm mới cache. <strong>Hãy cache thứ được TỔNG HỢP, đừng cache thứ được TRA CHỈ MỤC.</strong></p>
<p>Còn 0,40ms kia trôi đi đâu?</p>
<div class="out">[3] GET thô 0,26ms | JSON.parse 0,01ms | JSON.stringify 0,00ms</div>
<p>Hai phần ba là vòng đi-về của bài 12.1. Ở kích thước này JSON gần như miễn phí.</p>

<h3>Lần phản chủ 1 — payload lớn, chỗ cache THUA</h3>
<p>Cùng thí nghiệm đó, nhưng cache 5.000 ghi chú kèm cả phần nội dung:</p>
<div class="out">[4] payload 1192KB: GET 4,45ms + JSON.parse 1,93ms = 6,39ms
    cùng dữ liệu lấy thẳng Postgres: 5,38ms → cache THUA 0,8×</div>
<p>Hãy đọc kỹ, vì nó mâu thuẫn với chính lý do phần lớn mọi người cài Redis. Cache một kết quả 1,2 MB làm endpoint <strong>chậm đi 18%</strong> so với hỏi thẳng PostgreSQL. Postgres không hề chậm ở việc tuôn dòng ra; nó chậm ở việc <em>tổng hợp</em> chúng lại. Một khi payload đủ lớn để thời gian truyền và <code>JSON.parse</code> chiếm ưu thế thì cache chỉ còn là một chặng mạng thứ hai kèm thêm mấy bước thừa.</p>
<p>Quy tắc mà phép đo này trao cho bạn: <strong>hãy cache thứ đắt để TÍNH RA, đừng cache thứ chỉ đơn giản là TO.</strong> Một bảng xếp hạng 1 KB mất 48ms để dựng là một mục cache hoàn hảo. Một danh sách 1,2 MB lấy hết 5ms thì không.</p>

<h3>Lần phản chủ 2 — tỉ lệ trúng không hề tuyến tính</h3>
<p>300 request, thay đổi tỉ lệ trúng cache:</p>
<div class="out">[7] tỉ lệ trúng   0%: 300 request mất 14510,04ms → 48,37ms/request
[7] tỉ lệ trúng  50%: 300 request mất  7472,82ms → 24,91ms/request
[7] tỉ lệ trúng  90%: 300 request mất  1557,79ms →  5,19ms/request
[7] tỉ lệ trúng  99%: 300 request mất   128,89ms →  0,43ms/request
[7] tỉ lệ trúng 100%: 300 request mất    60,50ms →  0,20ms/request</div>
<p>Tỉ lệ trúng 90% nghe thì tuyệt vời, nhưng cho ra <strong>5,19ms</strong> — tệ hơn mốc 99% tới mười hai lần. Phép tính không khoan nhượng: ở mức 90%, cứ mười request vẫn có một request trả đủ 48ms, và chính cái request đó thống trị số trung bình. Đây là lý do vì sao câu "bọn em thêm cache rồi mà vẫn chậm" phổ biến đến thế, và vì sao con số cần đặt cảnh báo là <em>số lần trượt mỗi giây</em>, chứ không phải phần trăm trúng.</p>

<h3>Lần phản chủ 3 — TTL, và lệnh SET âm thầm xoá mất nó</h3>
<div class="out">[5] sau    0ms: GET="xin chào" TTL=3
[5] sau 1000ms: GET="xin chào" TTL=2
[5] sau 2000ms: GET=null TTL=-2
    TTL -2 = khoá không tồn tại, -1 = tồn tại nhưng KHÔNG có hạn
[5b] khoá không đặt hạn → TTL=-1</div>
<p>Hai số âm đó đáng để thuộc lòng: <strong>-2 là đã biến mất, -1 là bất tử</strong>. Và -1 chính là cách một cache biến thành chỗ rò rỉ:</p>
<div class="out">[6] SET lại KHÔNG kèm EX: TTL 100 → -1 (mất hạn, khoá sống mãi) | dùng KEEPTTL → TTL 100</div>
<p>Ghi đè lên một khoá vốn đã có hạn, mà không lặp lại <code>EX</code>, sẽ <strong>xoá luôn cái hạn đó</strong>. Khoá bây giờ sống tới khi Redis khởi động lại hoặc trục xuất nó. Chỉ cần MỘT nhánh code làm mới cache trong dự án quên <code>EX</code> là đủ để Redis từ từ đầy ứ những mục cũ bất tử. Hãy dùng <code>KEEPTTL</code> khi ý bạn là "cập nhật giá trị, giữ nguyên hạn".</p>

<h3>Lần phản chủ 4 — cơn giẫm đạp (stampede)</h3>
<p>Đây là kiểu hỏng làm sập production. Một khoá đắt khách hết hạn. Hai trăm request đang bay đều trượt, đều hỏi cơ sở dữ liệu, đều ghi cùng một giá trị trở lại.</p>
<div class="out">--- 200 request đồng thời, cache RỖNG (mô phỏng đúng lúc TTL vừa hết) ---
[1] cache-aside ngây thơ           200 lần hỏi Postgres |  6064,6ms cho 200 request | dữ liệu OK
[2] single-flight trong tiến trình   1 lần hỏi Postgres |    65,3ms cho 200 request | dữ liệu OK
[3] khoá phân tán SET NX             1 lần hỏi Postgres |    99,1ms cho 200 request | dữ liệu OK
[4] cache-aside ngây thơ, cache ẤM   0 lần hỏi Postgres |    14,9ms cho 200 request</div>
<p>Bản ngây thơ bắn ra <strong>200 truy vấn đắt tiền giống hệt nhau</strong> và mất 6 giây. Để ý là code đó <em>đúng</em> — ai cũng nhận được câu trả lời chính xác. Nó vừa đúng vừa là một đòn từ chối dịch vụ do chính bạn viết ra. So với dòng [4]: cùng đoạn code ấy, khi cache tình cờ đang ấm, nhanh hơn 400 lần. Độ trễ của endpoint giờ phụ thuộc vào một cú tung đồng xu.</p>

<h4>Cách sửa A — single-flight (trong một tiến trình)</h4>
<pre><code class="language-javascript">const inflight = new Map();

async function getLeaderboard() {
  const hit = await redis.get(KEY);
  if (hit) return JSON.parse(hit);

  if (inflight.has(KEY)) return inflight.get(KEY);   // đã có người đang nạp → bám vào

  const p = (async () =&gt; {
    const rows = await db.query(SQL_HEAVY);
    await redis.set(KEY, JSON.stringify(rows), 'EX', 60);
    return rows;
  })().finally(() =&gt; inflight.delete(KEY));

  inflight.set(KEY, p);
  return p;
}</code></pre>
<p>Mười hai dòng, một truy vấn thay vì 200, và <strong>nhanh hơn 93 lần</strong>. Nó chạy được vì event loop chỉ có một luồng: giữa <code>inflight.has</code> và <code>inflight.set</code> không có gì khác chen vào được, nên chẳng có cuộc đua nào phải lo. Hạn chế nằm ngay trong cái tên: <em>trong một tiến trình</em>. Bốn tiến trình Node sau một bộ cân bằng tải nghĩa là bốn truy vấn chứ không phải một — vẫn tốt hơn 200 tới 50 lần.</p>

<h4>Cách sửa B — khoá phân tán</h4>
<p>Khi một truy vấn mỗi tiến trình vẫn là quá nhiều (một báo cáo chạy 10 giây, một lệnh gọi API bên thứ ba tính tiền), hãy giành một khoá trong Redis để đúng MỘT tiến trình trong cả cụm làm việc đó:</p>
<pre><code class="language-javascript">const got = await redis.set(&#96;\${KEY}:lock&#96;, '1', 'PX', 5000, 'NX');
if (got) {
  try { /* nạp lại và ghi vào cache */ } finally { await redis.del(&#96;\${KEY}:lock&#96;); }
} else {
  // không giành được: chờ ngắn rồi đọc lại cache
}</code></pre>
<p>Nó đắt hơn (99,1ms so với 65,3ms) vì những kẻ thua cuộc phải hỏi đi hỏi lại chờ người thắng làm xong. Bài 12.4 sẽ chỉ ra vì sao lệnh <code>del</code> ngây thơ ở trên là <em>SAI</em> và phải viết gì thay vào đó.</p>

<h4>Cách sửa C — jitter, để các khoá đừng chết chùm</h4>
<div class="out">[5] 50 khoá TTL cố định 60s → tất cả hết hạn trong khoảng 60–60s (cùng một giây)
    50 khoá TTL 60s + jitter 0–30s → hết hạn rải ra 60–89s</div>
<p>Nếu một lần deploy làm ấm 50 cache trong cùng một giây với cùng một TTL thì sáu mươi giây sau cả 50 cùng hết hạn trong cùng một giây — một cơn giẫm đạp đồng bộ trên <em>nhiều khoá khác nhau</em>, thứ mà khoá theo từng khoá không cứu được. <code>EX: 60 + Math.floor(Math.random() * 30)</code> không tốn gì cả và xoá sổ nguyên một họ lỗi.</p>

<h3>Làm mới cache: phần chẳng ai thích</h3>
<p>Chỉ có đúng ba chiến lược trung thực, và chọn cái nào là quyết định về sản phẩm chứ không phải về kỹ thuật:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ dùng TTL</span><span class="v">"cũ tối đa 60 giây thì chấp nhận được". Đơn giản nhất, không có code làm mới, không có bug. Đúng cho bảng xếp hạng, danh sách xu hướng, các con số đếm</span></div>
  <div class="kv"><span class="k">Xoá khi ghi</span><span class="v"><code>DEL</code> khoá ngay trong chính nhánh code làm thay đổi dữ liệu. Đúng cho hồ sơ người dùng. Con bug luôn luôn nằm ở nhánh ghi mà bạn quên mất</span></div>
  <div class="kv"><span class="k">Gắn phiên bản vào tên khoá</span><span class="v"><code>note:42:v7</code> — tăng số phiên bản là mọi khoá cũ trở nên không ai với tới được và tự hết hạn. Không cần xoá, không có đua. Đổi lại tốn RAM cho tới khi các mục cũ hết hạn</span></div>
</div>
<p>Hãy ưu tiên TTL. Chỉ với tới xoá-khi-ghi khi một lần đọc dữ liệu cũ hiện ra trước mắt người dùng và gây xấu hổ. <strong>Tuyệt đối đừng</strong> viết logic sửa-tại-chỗ giá trị trong cache: hai người ghi đồng thời sẽ đan xen vào nhau và để lại trong cache một giá trị chưa từng tồn tại trong cơ sở dữ liệu.</p>

<div class="pitfall">
<p><strong>Quên cache cả lần trượt.</strong> Nếu <code>GET user:99999</code> trượt và cơ sở dữ liệu cũng chẳng trả về gì, code ngây thơ sẽ không cache gì cả — thế là mọi request hỏi một id không tồn tại đều đâm thẳng vào cơ sở dữ liệu mãi mãi. Kẻ tấn công chỉ cần hỏi các id ngẫu nhiên là biến cache của bạn thành một cái ống thông. Hãy cache cả kết quả rỗng, với TTL ngắn: <code>SET user:99999 "null" EX 30</code>. Và nhớ rằng phép kiểm lần trượt phải là <code>hit !== null</code>, KHÔNG BAO GIỜ dùng <code>if (!hit)</code> — vì một mục cache là chuỗi rỗng sẽ bị coi là trượt trong mọi request.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Redis production ngay lúc này giữ <strong>26 khoá trong 1,23 MB</strong> với <code>maxmemory 256M</code> và <code>keyspace_hits:165 / keyspace_misses:20</code> — tỉ lệ trúng 89,2%. Gần như không có gì trên trang này là một truy vấn được cache; toàn bộ số khoá đó là bộ đếm giới hạn tần suất và hạn mức (<code>rl:general:&lt;ip&gt;</code>, <code>quota:&lt;userId&gt;:month:2026-07</code>). Đó là một thừa nhận có chủ ý và hơi khó chịu: những lần đọc đắt tiền của trang này được làm nhanh bằng <em>chỉ mục</em> ở chương 7, và một chỉ mục biến 28ms thành 0,129ms là cách sửa tốt hơn một cache, bởi vì nó không kèm theo bất kỳ câu chuyện làm-mới nào cả. Redis kiếm được chỗ đứng ở đây nhờ những việc mà cơ sở dữ liệu thật sự không làm được — các bộ đếm dùng chung giữa nhiều tiến trình, chính là bài 12.4.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-740"><span class="lc-t">Code Lab · Distributed Caching Strategies and Patterns</span><span class="lc-d">Cache-aside, write-through, stampede và các cách làm mới cache</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-424"><span class="lc-t">Code Lab · Expiration, TTL, and Key Management</span><span class="lc-d">EXPIRE, TTL, KEEPTTL và đặt tên khoá cho có kỷ luật</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Picking the right structure is worth 95× the RAM|||12.3 — Chọn đúng cấu trúc dữ liệu đáng giá 95 lần RAM',
      slug: 'nodejs-12-3-cau-truc-du-lieu',
      type: 'VIDEO',
      description: 'Cùng một bài toán, ba cách lưu, RAM chênh nhau 2 lần. Đếm 100.000 người dùng duy nhất: Set 3,53MB, HyperLogLog 0,04MB. Và cú nhảy đáng sợ: thêm ĐÚNG MỘT trường thứ 513 làm RAM tăng 3,6 lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Picking the right structure is worth 95× the RAM</h2>
<p class="lead">Redis is not a key-value store with strings in it. It is a small library of data structures that happen to live on a server, and the difference between knowing three of them and knowing eight is measured in gigabytes of RAM you did not have to buy. Every number below is <code>used_memory</code> read from <code>INFO</code> before and after loading exactly the same information.</p>

<h3>The same 100.000 sessions, three ways</h3>
<div class="out">--- Lưu 100000 phiên đăng nhập {userId, role, ip} bằng 3 kiểu khác nhau ---
[1] String: 100k khoá, giá trị là JSON           11,66MB  (100000 khoá, 283,41ms)
[2] Hash: 100k khoá, mỗi khoá 3 trường           10,94MB  (100000 khoá, 436,71ms)
[3] Hash gom lô: 1000 khoá × 100 trường JSON      5,93MB  (  1000 khoá, 320,26ms)
    → gom lô tiết kiệm 49% so với String, NHƯNG mất khả năng đặt TTL cho từng phiên</div>
<p>Two lessons hide in there. First, a hash with three fields is <em>not</em> meaningfully cheaper than a JSON string — the win people expect from "use hashes" is not where they think it is. Second, the real saving comes from having <strong>fewer keys</strong>: 100.000 top-level keys cost roughly 5,7 MB in key overhead alone, before any of your data. Every Redis key carries a dictionary entry, an expiry slot and an object header.</p>
<p>And the warning in that last line is the whole trade. Bucketing gives you half the RAM back and takes away <code>EXPIRE</code>, because TTL lives on keys, never on hash fields. A session store needs per-session expiry, so for sessions you pay the 11,66 MB. For something like "the last 100 events per user", bucketing is free money.</p>

<h3>The encoding cliff: one extra field, 3,6× the RAM</h3>
<p>Redis stores small collections in a compact flat layout called a <em>listpack</em> and switches to a real hash table above a configured threshold. The switch is not gradual:</p>
<div class="out">hash  128 trường: mã hoá=listpack  RAM=  2608 byte → 20,4 byte/trường
hash  512 trường: mã hoá=listpack  RAM= 10288 byte → 20,1 byte/trường
hash  513 trường: mã hoá=hashtable RAM= 37024 byte → 72,2 byte/trường
hash 1000 trường: mã hoá=hashtable RAM= 64296 byte → 64,3 byte/trường
1000 trường chẻ thành 8 hash × 125 trường: RAM=20864 byte
hash-max-listpack-entries = 512</div>
<p>Adding the <strong>513th field multiplied memory by 3,6</strong>. Nothing about your data changed; you crossed <code>hash-max-listpack-entries</code>. And look at the last line: the same 1.000 fields split into eight hashes of 125 cost 20.864 bytes instead of 64.296 — <strong>3,1× less</strong>, purely by staying under the threshold.</p>
<p>Sets have the same behaviour, with a third encoding:</p>
<div class="out">20 số nguyên : intset   96 byte
+ 1 chuỗi    : listpack 104 byte</div>
<p>A set of pure integers uses <code>intset</code>, the densest layout Redis has. Add a single non-numeric member and it converts permanently — it never converts back. Storing ids as <code>"user-42"</code> instead of <code>42</code> quietly gives up that encoding across your whole dataset.</p>
<p>Check any key yourself with <code>OBJECT ENCODING key</code> and <code>MEMORY USAGE key</code>. These two commands answer "why is Redis so big" faster than any dashboard.</p>

<h3>Counting unique things: Set vs HyperLogLog</h3>
<div class="out">--- Đếm 100000 người dùng duy nhất trong ngày ---
[4] Set: lưu đủ 100k id                           3,53MB  (     1 khoá, 44,18ms)
[5] HyperLogLog: PFADD 100k id                    0,04MB  (     1 khoá, 30,65ms)
    Set đếm CHÍNH XÁC 100000 | HLL ước lượng 100165 (lệch 0,17%)
    HLL nhỏ hơn Set 95× — đổi độ chính xác lấy RAM</div>
<p><strong>95× smaller, 0,17% wrong.</strong> A HyperLogLog is a fixed 12 KB no matter how many items you add — one million or one billion, still 12 KB. The trade is absolute: you can ask <em>how many</em> (<code>PFCOUNT</code>) and you can merge two of them (<code>PFMERGE</code>, which is how "unique visitors this week" works), but you can <strong>never</strong> ask whether a specific user is in it. If you need <code>SISMEMBER</code>, you need a Set.</p>

<h3>Membership over a dense id space: bitmaps</h3>
<div class="out">[6] Bitmap: SETBIT cho 1.000.000 user             0,15MB  (     1 khoá, 800,00ms)
    BITCOUNT = 333334 user hoạt động, tốn đúng 152,3KB</div>
<p>"Which of our million users were active today?" — <strong>152 KB</strong>, exact, with membership testable via <code>GETBIT</code>. One bit per user, indexed by numeric id. This is the structure behind every retention chart: one bitmap per day, then <code>BITOP AND</code> across seven of them gives weekly retention with no query at all. It only works when ids are dense integers — a bitmap for user id 8.000.000 allocates a megabyte even if that is your only user.</p>

<h3>Leaderboards: sorted sets</h3>
<div class="out">[7] ZSet 100000 người: lấy TOP 10 0,77ms | hỏi thứ hạng 1 người 0,32ms (hạng 94725)
    top1 = user-99729 (9972 điểm) — Redis giữ sẵn thứ tự, không cần ORDER BY</div>
<p>Compare that with lesson 12.2, where the same leaderboard from PostgreSQL cost <strong>48,04ms</strong> and could only be produced in full. A sorted set answers <em>"what rank am I?"</em> in 0,32ms — a question SQL answers with a window function over every row. When ranking is a product feature rather than a report, keep the sorted set as the source of truth and let Postgres hold the history.</p>

<h3>The full menu, and when each one is the answer</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">String</span><span class="v">cache JSON, cờ bật/tắt, bộ đếm (<code>INCR</code> chạy trên String). Mặc định, và không có gì sai khi dùng nó</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">đối tượng cần sửa TỪNG trường: <code>HINCRBY user:42 views 1</code> không phải đọc-sửa-ghi cả đối tượng</span></div>
  <div class="kv"><span class="k">List</span><span class="v">hàng đợi đơn giản (<code>LPUSH</code>/<code>BRPOP</code>), nhật ký N mục gần nhất (<code>LPUSH</code> + <code>LTRIM</code>)</span></div>
  <div class="kv"><span class="k">Set</span><span class="v">quan hệ và phép toán tập hợp: bạn chung (<code>SINTER</code>), thẻ, "đã xem chưa"</span></div>
  <div class="kv"><span class="k">Sorted Set</span><span class="v">bất cứ thứ gì có THỨ TỰ: bảng xếp hạng, hàng đợi ưu tiên, cửa sổ trượt theo thời gian (bài 12.4)</span></div>
  <div class="kv"><span class="k">Bitmap</span><span class="v">1 bit/id trên dải id dày đặc: hoạt động theo ngày, cờ tính năng theo user</span></div>
  <div class="kv"><span class="k">HyperLogLog</span><span class="v">đếm số lượng duy nhất khi con số gần đúng là đủ. 12 KB cố định, mãi mãi</span></div>
  <div class="kv"><span class="k">Stream</span><span class="v">nhật ký sự kiện chỉ ghi thêm, có consumer group và xác nhận — bài 12.5</span></div>
</div>

<h3>Naming keys like you mean it</h3>
<pre><code class="language-javascript">// Khuôn: &lt;miền&gt;:&lt;thực thể&gt;:&lt;id&gt;:&lt;thuộc tính&gt;
'sess:a3f9c1'                  // phiên đăng nhập
'user:42:profile'              // hồ sơ đã cache
'lb:notes:views:2026-07'       // bảng xếp hạng theo tháng
'rl:general:14.191.170.161'    // bộ đếm giới hạn tần suất theo IP
'quota:42:month:2026-07'       // hạn mức theo tháng — hết tháng là khoá tự chết</code></pre>
<p>Two rules make this pay off. Put the <strong>time bucket inside the key</strong> when the data is periodic — <code>quota:42:month:2026-07</code> needs no reset job, because next month is simply a different key. And keep prefixes short but never cryptic: with 100.000 keys, the prefix is stored 100.000 times, but a key nobody can decode during an incident costs far more than the bytes.</p>

<div class="pitfall">
<p><strong>The number that will surprise you at 3am.</strong> An empty Redis holding 1.000.000 tiny keys uses <strong>93,4 MB</strong> (measured in lesson 12.5). That is roughly 93 bytes of overhead per key before your values. Teams size Redis by adding up their value sizes, deploy, and hit <code>maxmemory</code> at a third of the expected key count. Size by <em>key count</em> first, value size second.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The quota service keys are <code>quota:&lt;userId&gt;:minute:&lt;YYYY-MM-DD-HH-mm&gt;</code>, <code>…:day:&lt;YYYY-MM-DD&gt;</code> and <code>…:month:&lt;YYYY-MM&gt;</code> — plain strings driven by <code>INCR</code>, with the period baked into the name. Nothing ever resets a counter; the minute key simply stops being referenced when the minute ends and expires 65 seconds later. Production currently shows <code>expired_keys:21</code> and <code>evicted_keys:0</code>: everything that left did so because its own TTL ran out, which is exactly what a healthy keyspace looks like.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-423"><span class="lc-t">Code Lab · Core Data Structures</span><span class="lc-d">String, Hash, List, Set, Sorted Set — bài tập từng lệnh</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-425"><span class="lc-t">Code Lab · Advanced Data Types and Commands</span><span class="lc-d">Bitmap, HyperLogLog, GEO và các lệnh ít gặp</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Chọn đúng cấu trúc dữ liệu đáng giá 95 lần RAM</h2>
<p class="lead">Redis không phải một kho khoá-giá trị chứa toàn chuỗi. Nó là một thư viện nhỏ các cấu trúc dữ liệu tình cờ sống trên máy chủ, và khoảng cách giữa việc biết ba cái với việc biết tám cái được đo bằng số gigabyte RAM bạn không phải bỏ tiền mua. Mọi con số dưới đây là <code>used_memory</code> đọc từ <code>INFO</code> trước và sau khi nạp đúng cùng một lượng thông tin.</p>

<h3>Cùng 100.000 phiên đăng nhập, ba cách lưu</h3>
<div class="out">--- Lưu 100000 phiên đăng nhập {userId, role, ip} bằng 3 kiểu khác nhau ---
[1] String: 100k khoá, giá trị là JSON           11,66MB  (100000 khoá, 283,41ms)
[2] Hash: 100k khoá, mỗi khoá 3 trường           10,94MB  (100000 khoá, 436,71ms)
[3] Hash gom lô: 1000 khoá × 100 trường JSON      5,93MB  (  1000 khoá, 320,26ms)
    → gom lô tiết kiệm 49% so với String, NHƯNG mất khả năng đặt TTL cho từng phiên</div>
<p>Có hai bài học nấp trong đó. Thứ nhất, một hash ba trường <em>không</em> rẻ hơn một chuỗi JSON bao nhiêu — cái lợi mà người ta trông đợi từ lời khuyên "dùng hash đi" không nằm ở chỗ họ tưởng. Thứ hai, khoản tiết kiệm thật đến từ việc có <strong>ÍT KHOÁ hơn</strong>: 100.000 khoá cấp cao nhất tốn xấp xỉ 5,7 MB chỉ riêng cho phần phụ trội của khoá, chưa tính một byte dữ liệu nào của bạn. Mỗi khoá Redis đều mang theo một ô trong từ điển, một chỗ cho hạn dùng và một phần đầu đối tượng.</p>
<p>Và lời cảnh báo ở dòng cuối chính là toàn bộ cuộc đánh đổi. Gom lô trả lại cho bạn một nửa RAM và lấy đi <code>EXPIRE</code>, vì TTL sống trên KHOÁ chứ không bao giờ sống trên trường của hash. Kho phiên đăng nhập cần hạn riêng cho từng phiên, nên với phiên thì bạn cứ trả 11,66 MB. Còn với thứ kiểu "100 sự kiện gần nhất của mỗi người dùng" thì gom lô là tiền cho không.</p>

<h3>Vách đá mã hoá: thêm một trường, RAM gấp 3,6 lần</h3>
<p>Redis lưu các tập hợp nhỏ trong một bố cục phẳng gọn gàng tên là <em>listpack</em>, và chuyển sang bảng băm thật khi vượt một ngưỡng cấu hình. Cú chuyển đó không hề từ từ:</p>
<div class="out">hash  128 trường: mã hoá=listpack  RAM=  2608 byte → 20,4 byte/trường
hash  512 trường: mã hoá=listpack  RAM= 10288 byte → 20,1 byte/trường
hash  513 trường: mã hoá=hashtable RAM= 37024 byte → 72,2 byte/trường
hash 1000 trường: mã hoá=hashtable RAM= 64296 byte → 64,3 byte/trường
1000 trường chẻ thành 8 hash × 125 trường: RAM=20864 byte
hash-max-listpack-entries = 512</div>
<p>Thêm <strong>trường thứ 513 làm bộ nhớ nhân lên 3,6 lần</strong>. Dữ liệu của bạn chẳng thay đổi gì; bạn chỉ vừa bước qua ngưỡng <code>hash-max-listpack-entries</code>. Và hãy nhìn dòng cuối: đúng 1.000 trường ấy chẻ thành tám hash mỗi cái 125 trường chỉ tốn 20.864 byte thay vì 64.296 — <strong>ít hơn 3,1 lần</strong>, thuần tuý nhờ nằm dưới ngưỡng.</p>
<p>Set cũng hành xử y hệt, với một kiểu mã hoá thứ ba:</p>
<div class="out">20 số nguyên : intset   96 byte
+ 1 chuỗi    : listpack 104 byte</div>
<p>Một set toàn số nguyên dùng <code>intset</code>, bố cục dày đặc nhất Redis có. Thêm đúng một phần tử không phải số là nó chuyển đổi vĩnh viễn — không bao giờ quay lại. Lưu id dưới dạng <code>"user-42"</code> thay vì <code>42</code> là âm thầm vứt bỏ kiểu mã hoá đó trên toàn bộ dữ liệu của bạn.</p>
<p>Bạn tự kiểm bất kỳ khoá nào bằng <code>OBJECT ENCODING khoá</code> và <code>MEMORY USAGE khoá</code>. Hai lệnh này trả lời câu "sao Redis phình to thế" nhanh hơn mọi bảng điều khiển.</p>

<h3>Đếm số lượng duy nhất: Set hay HyperLogLog</h3>
<div class="out">--- Đếm 100000 người dùng duy nhất trong ngày ---
[4] Set: lưu đủ 100k id                           3,53MB  (     1 khoá, 44,18ms)
[5] HyperLogLog: PFADD 100k id                    0,04MB  (     1 khoá, 30,65ms)
    Set đếm CHÍNH XÁC 100000 | HLL ước lượng 100165 (lệch 0,17%)
    HLL nhỏ hơn Set 95× — đổi độ chính xác lấy RAM</div>
<p><strong>Nhỏ hơn 95 lần, sai 0,17%.</strong> Một HyperLogLog luôn là 12 KB cố định bất kể bạn nhét vào bao nhiêu — một triệu hay một tỉ, vẫn 12 KB. Cuộc đánh đổi thì tuyệt đối: bạn hỏi được <em>có bao nhiêu</em> (<code>PFCOUNT</code>) và trộn được hai cái lại (<code>PFMERGE</code>, đó chính là cách tính "số người duy nhất trong tuần"), nhưng bạn <strong>không bao giờ</strong> hỏi được một người cụ thể có nằm trong đó hay không. Nếu bạn cần <code>SISMEMBER</code> thì bạn cần Set.</p>

<h3>Kiểm tra thành viên trên dải id dày đặc: bitmap</h3>
<div class="out">[6] Bitmap: SETBIT cho 1.000.000 user             0,15MB  (     1 khoá, 800,00ms)
    BITCOUNT = 333334 user hoạt động, tốn đúng 152,3KB</div>
<p>"Trong một triệu người dùng, hôm nay ai có hoạt động?" — <strong>152 KB</strong>, chính xác tuyệt đối, và kiểm tra từng người được bằng <code>GETBIT</code>. Một bit cho một người, đánh chỉ số bằng id dạng số. Đây là cấu trúc nằm sau mọi biểu đồ giữ chân người dùng: mỗi ngày một bitmap, rồi <code>BITOP AND</code> bảy cái là ra tỉ lệ giữ chân theo tuần mà không cần một truy vấn nào. Nó chỉ đúng khi id là số nguyên dày đặc — một bitmap cho user id 8.000.000 sẽ cấp phát cả megabyte dù đó là người dùng duy nhất của bạn.</p>

<h3>Bảng xếp hạng: sorted set</h3>
<div class="out">[7] ZSet 100000 người: lấy TOP 10 0,77ms | hỏi thứ hạng 1 người 0,32ms (hạng 94725)
    top1 = user-99729 (9972 điểm) — Redis giữ sẵn thứ tự, không cần ORDER BY</div>
<p>Hãy so với bài 12.2, nơi cũng bảng xếp hạng ấy lấy từ PostgreSQL tốn <strong>48,04ms</strong> và chỉ dựng được nguyên cả bảng. Một sorted set trả lời câu <em>"tôi đang hạng mấy?"</em> trong 0,32ms — câu hỏi mà SQL phải giải bằng hàm cửa sổ chạy qua mọi dòng. Khi xếp hạng là một tính năng của sản phẩm chứ không phải một bản báo cáo, hãy giữ sorted set làm nguồn sự thật và để Postgres giữ phần lịch sử.</p>

<h3>Thực đơn đầy đủ, và khi nào mỗi món là câu trả lời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">String</span><span class="v">cache JSON, cờ bật/tắt, bộ đếm (<code>INCR</code> chạy trên String). Mặc định, và dùng nó chẳng có gì sai</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">đối tượng cần sửa TỪNG trường: <code>HINCRBY user:42 views 1</code> chứ không phải đọc-sửa-ghi cả đối tượng</span></div>
  <div class="kv"><span class="k">List</span><span class="v">hàng đợi đơn giản (<code>LPUSH</code>/<code>BRPOP</code>), nhật ký N mục gần nhất (<code>LPUSH</code> + <code>LTRIM</code>)</span></div>
  <div class="kv"><span class="k">Set</span><span class="v">quan hệ và phép toán tập hợp: bạn chung (<code>SINTER</code>), thẻ, "đã xem chưa"</span></div>
  <div class="kv"><span class="k">Sorted Set</span><span class="v">bất cứ thứ gì có THỨ TỰ: bảng xếp hạng, hàng đợi ưu tiên, cửa sổ trượt theo thời gian (bài 12.4)</span></div>
  <div class="kv"><span class="k">Bitmap</span><span class="v">1 bit cho 1 id trên dải id dày đặc: hoạt động theo ngày, cờ tính năng theo người dùng</span></div>
  <div class="kv"><span class="k">HyperLogLog</span><span class="v">đếm số lượng duy nhất khi con số gần đúng là đủ. 12 KB cố định, mãi mãi</span></div>
  <div class="kv"><span class="k">Stream</span><span class="v">nhật ký sự kiện chỉ ghi thêm, có consumer group và xác nhận — bài 12.5</span></div>
</div>

<h3>Đặt tên khoá cho tử tế</h3>
<pre><code class="language-javascript">// Khuôn: &lt;miền&gt;:&lt;thực thể&gt;:&lt;id&gt;:&lt;thuộc tính&gt;
'sess:a3f9c1'                  // phiên đăng nhập
'user:42:profile'              // hồ sơ đã cache
'lb:notes:views:2026-07'       // bảng xếp hạng theo tháng
'rl:general:14.191.170.161'    // bộ đếm giới hạn tần suất theo IP
'quota:42:month:2026-07'       // hạn mức theo tháng — hết tháng là khoá tự chết</code></pre>
<p>Hai quy tắc khiến cách này sinh lời. Hãy nhét <strong>mốc thời gian vào trong tên khoá</strong> khi dữ liệu có tính chu kỳ — <code>quota:42:month:2026-07</code> chẳng cần công việc reset nào cả, vì tháng sau đơn giản là một khoá khác. Và giữ tiền tố ngắn nhưng đừng bao giờ khó hiểu: với 100.000 khoá thì tiền tố bị lưu 100.000 lần, nhưng một cái khoá không ai giải mã nổi giữa lúc sự cố còn đắt hơn nhiều so với mấy byte ấy.</p>

<div class="pitfall">
<p><strong>Con số sẽ làm bạn ngạc nhiên lúc 3 giờ sáng.</strong> Một Redis rỗng chứa 1.000.000 khoá tí hon dùng hết <strong>93,4 MB</strong> (đo ở bài 12.5). Tức là xấp xỉ 93 byte phụ trội cho mỗi khoá, trước khi tính giá trị của bạn. Các đội thường ước lượng dung lượng Redis bằng cách cộng kích thước các giá trị lại, deploy, rồi đụng trần <code>maxmemory</code> khi mới đạt một phần ba số khoá dự kiến. Hãy ước lượng theo <em>số lượng khoá</em> trước, kích thước giá trị sau.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Khoá của dịch vụ hạn mức là <code>quota:&lt;userId&gt;:minute:&lt;YYYY-MM-DD-HH-mm&gt;</code>, <code>…:day:&lt;YYYY-MM-DD&gt;</code> và <code>…:month:&lt;YYYY-MM&gt;</code> — chuỗi thuần điều khiển bằng <code>INCR</code>, với chu kỳ nướng thẳng vào tên. Không có gì reset bộ đếm cả; khoá theo phút đơn giản là hết được ai nhắc tới khi phút đó trôi qua rồi tự hết hạn sau 65 giây. Production hiện báo <code>expired_keys:21</code> và <code>evicted_keys:0</code>: mọi thứ rời đi đều vì tự hết hạn, và đó đúng là dáng vẻ của một vùng khoá khoẻ mạnh.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-423"><span class="lc-t">Code Lab · Core Data Structures</span><span class="lc-d">String, Hash, List, Set, Sorted Set — bài tập từng lệnh</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-425"><span class="lc-t">Code Lab · Advanced Data Types and Commands</span><span class="lc-d">Bitmap, HyperLogLog, GEO và các lệnh ít gặp</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Atomicity: rate limiting and locks done right|||12.4 — Tính nguyên tử: giới hạn tần suất và khoá phân tán làm cho đúng',
      slug: 'nodejs-12-4-nguyen-tu-rate-limit-lock',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-12-4-nguyen-tu-rate-limit-lock.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-12-4-nguyen-tu-rate-limit-lock.jpg',
        scenario: 'nodejs-atomic-redis',
        durationSeconds: 16,
        caption: { en: "Atomicity: rate limits and locks", vi: "Nguyên tử: giới hạn tần suất và khoá" },
      },
      type: 'VIDEO',
      description: 'GET → kiểm tra → SET cho lọt cả 500 request qua một giới hạn 100. Cửa sổ cố định cho lọt gấp đôi ở ranh giới. Và một khoá phân tán viết sai xoá nhầm khoá của người khác — có bằng chứng chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Atomicity: rate limiting and locks done right</h2>
<p class="lead">This is the lesson where Redis stops being an optimisation and becomes a <em>correctness</em> tool. Chapter 8.4 built a rate limiter that worked — as long as there was exactly one Node process. The moment you run two, an in-memory counter is two counters, and your 5-per-minute limit is 10 per minute. Redis fixes that, but only if you understand which operations are atomic and which merely look like it.</p>

<h3>The bug that starts everything</h3>
<p>Redis runs one command at a time. That makes each individual command atomic. It does <strong>not</strong> make your sequence of commands atomic, because other clients run between them. Here is the difference, measured with 500 concurrent requests against a limit of 100:</p>
<div class="out">--- 500 request SONG SONG, giới hạn 100 ---
   cho qua 100 / chặn 400 → bộ đếm cuối = 500
   cùng việc đó bằng GET → kiểm → SET (không nguyên tử): cho qua 500, bộ đếm cuối = 1 ← SAI</div>
<p><strong>Every single request passed a limit of 100</strong>, and the counter ended at 1. All 500 read the counter (0), all 500 decided they were under the limit, all 500 wrote 1. The limiter did nothing at all — and it would have looked perfectly correct in any test with one request at a time.</p>

<h3>The second bug: INCR then EXPIRE</h3>
<p>The obvious fix is <code>INCR</code>, which is atomic. But a counter needs a deadline, and that is a second command:</p>
<div class="out">   INCR xong, chưa kịp EXPIRE → TTL = -1 (khoá sống MÃI MÃI, user bị khoá vĩnh viễn)
   Lua (INCR + PEXPIRE nguyên tử) → TTL = 60s ✓</div>
<p>If the process dies, the connection drops or the request is cancelled between <code>INCR</code> and <code>EXPIRE</code>, the key exists with no expiry. It never resets. That user is rate-limited <strong>forever</strong>, and no amount of waiting fixes it. This is a real, common, extremely confusing production bug: one user, permanently 429, and nothing in the logs.</p>
<p>Two correct fixes. <code>MULTI</code>/<code>EXEC</code> queues both commands and runs them as one unit, or a Lua script does the same with the ability to branch:</p>
<pre><code class="language-lua">-- chỉ đặt hạn ở lần tăng ĐẦU TIÊN
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c</code></pre>
<p>Lua runs <em>inside</em> Redis, which means the whole script is one atomic command — nothing interleaves. It is also one round trip instead of two, which lesson 12.1 tells you is the expensive part. Use <code>EVALSHA</code> in production so the script body is sent once, not per call; ioredis does this for you via <code>defineCommand</code>.</p>

<h3>Algorithm 1 — fixed window, and the hole at the boundary</h3>
<p>Bucket by time: <code>rl:bob:1785182120</code>. Simple, one key, 56 bytes. And measurably wrong:</p>
<div class="out">--- Cửa sổ cố định 5 request / 1 giây: đo lỗ hổng ranh giới ---
   cửa sổ #1785182120: cho qua 5 | cửa sổ #1785182121: cho qua 5
   ⇒ 10 request lọt trong khoảng ~300ms, dù giới hạn ghi là 5/giây → thực tế chịu 10/giây ở ranh giới</div>
<p>Five at the end of one window, five at the start of the next: <strong>double the configured limit inside 300 milliseconds</strong>. For a login endpoint that is the difference between 5 password guesses per second and 10. Whether that matters is a judgement call — for API throttling it usually does not; for anything security-sensitive it does.</p>

<h3>Algorithm 2 — sliding window with a sorted set</h3>
<p>Store a timestamp per request in a ZSET, drop everything older than the window, count what is left:</p>
<pre><code class="language-lua">local key, nowMs, win, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, nowMs - win)   -- vứt những gì đã trôi ra ngoài cửa sổ
local n = redis.call('ZCARD', key)
if n &lt; limit then
  redis.call('ZADD', key, nowMs, ARGV[4])             -- ARGV[4] phải DUY NHẤT
  redis.call('PEXPIRE', key, win)
  return {1, n + 1}
end
return {0, n}</code></pre>
<div class="out">--- Cửa sổ trượt (ZSET) — chặn được ranh giới ---
   trước ranh giới: 5 lọt | sau ranh giới 160ms: 0 lọt → tổng 5 (đúng giới hạn 5)
   chờ đủ 1s cho cửa sổ trôi qua → request mới: CHO QUA (đang có 1 trong cửa sổ)</div>
<p>Exactly right at the boundary. The price is RAM, and it is not small:</p>
<div class="out">   RAM: cửa sổ trượt giữ 1001 phần tử = 89072 byte cho MỘT người dùng
        cửa sổ cố định 1 khoá = 56 byte | token bucket 1 hash = 96 byte</div>
<p><strong>89 KB per user versus 56 bytes.</strong> A sliding window stores one entry per request in the window, so a limit of 1.000 means 1.000 entries. With 10.000 active users that is 890 MB — more than most Redis instances have. Sliding windows are correct and they do not scale to large limits. Use them where the limit is small and correctness matters (login: 5 per 15 minutes), not for general API throttling.</p>

<h3>Algorithm 3 — token bucket, when you want to allow bursts</h3>
<div class="out">--- Token bucket 5 token, nạp 5 token/giây ---
   10 request tức thì → cho qua 5 (bùng hết bình), token còn 0.03
   chờ 600ms (nạp ~3 token) → request: CHO QUA, còn 2.04 token</div>
<p>A bucket holds N tokens and refills at a steady rate. A client that has been quiet can spend its whole bucket at once, then is throttled to the refill rate. This is what you actually want for a public API: a page that fires eight requests on load should succeed, while a script hammering you steadily should not. Two fields in a hash, 96 bytes, and it never stores per-request state.</p>
<div class="out">--- Giá mỗi lần kiểm (1000 lần, ms/lần) ---
   cửa sổ cố định (Lua INCR)    0,31ms/lần
   cửa sổ trượt (Lua ZSET)      0,27ms/lần
   token bucket (Lua HASH)      0,29ms/lần</div>
<p>All three cost the same — one round trip. <strong>Choose on memory and semantics, never on speed.</strong></p>

<h3>Distributed locks: three ways to get it wrong</h3>
<h4>Wrong 1 — a lock with no expiry</h4>
<div class="out">   worker-1 SETNX → 1 (giành được), TTL = -1
   worker-1 CRASH trước khi DEL...
   worker-2 SETNX → 0 (0 = thất bại), TTL vẫn -1 → KẸT MÃI MÃI</div>
<p>One crashed process and the lock is held forever. Always <code>SET key val PX ttl NX</code>, never <code>SETNX</code> alone.</p>

<h4>Wrong 2 — unlocking with plain DEL</h4>
<div class="out">   worker-1 giữ khoá (hạn 300ms), làm việc CHẬM mất 400ms...
   khoá tự hết hạn → worker-2 giành được: OK — GIỜ CÓ HAI worker trong vùng tới hạn
   worker-1 làm xong, gọi DEL → xoá 1 khoá — nhưng đó là khoá của WORKER-2!
   khoá còn lại: null → worker-3 bất kỳ giành được ngay</div>
<p>This is the subtle one and it is worth reading twice. Worker-1's job outran its lock TTL. The lock expired, worker-2 legitimately took it — and then worker-1 finished and deleted <em>worker-2's</em> lock. Now the critical section is wide open. One slow job cascades into unbounded concurrency.</p>

<h4>Right — a unique token plus compare-and-delete in Lua</h4>
<pre><code class="language-javascript">import crypto from 'node:crypto';

const LUA_UNLOCK = &#96;
if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end&#96;;

async function acquire(key, ttlMs) {
  const token = crypto.randomUUID();
  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
  return ok ? token : null;                 // null = người khác đang giữ
}

const release = (key, token) =&gt; redis.eval(LUA_UNLOCK, 1, key, token);</code></pre>
<div class="out">   worker-1 giành được, token = bd76d443…
   khoá hết hạn, worker-2 giành được, token = d6afad4b…
   worker-1 mở khoá bằng token của mình → xoá 0 khoá (0 = KHÔNG xoá nhầm ✓)
   khoá vẫn thuộc về worker-2: d6afad4b…
   worker-2 mở khoá → xoá 1 khoá ✓</div>
<p>The check and the delete must happen in the same atomic step — doing <code>GET</code>, comparing in JavaScript, then <code>DEL</code> reintroduces exactly the race we just fixed, because the lock can expire between the two commands.</p>

<h3>Does the lock actually do anything? Measure it.</h3>
<div class="out">--- 50 worker song song, mỗi worker cộng 1 vào bộ đếm (đọc-sửa-ghi, 5ms) ---
   KHÔNG khoá     → bộ đếm = 1 (đúng phải là 50)
   CÓ khoá        → bộ đếm = 50 ✓
   INCR nguyên tử → bộ đếm = 50 ✓ (không cần khoá — hãy ưu tiên cách này)</div>
<p>Fifty increments, forty-nine of them lost. And then the third line, which is the point of this whole section: <strong>the lock was never necessary.</strong> <code>INCR</code> gives the same correct answer with no lock, no token, no TTL tuning and no failure mode. A distributed lock is the answer when the critical section touches something <em>outside</em> Redis — a third-party API that must be called once, a file, a report that takes ten seconds. Inside Redis, reach for the atomic command or a Lua script first.</p>
<div class="out">   500 lần khoá + mở (không tranh chấp): 0,657ms/lần (2 vòng đi-về)</div>

<div class="pitfall">
<p><strong>A Redis lock is not a safety guarantee.</strong> If your job can exceed the lock TTL, two workers <em>will</em> eventually run at the same time — measurement 2 above is that happening. No amount of Lua fixes it, because the lock has already expired. Either make the work idempotent (so running it twice is harmless), or have the worker renew the lock while it runs and abort if the renewal fails. Redlock across multiple independent Redis nodes exists for this, and it is still debated; if correctness genuinely depends on mutual exclusion, use a database transaction with a unique constraint, which chapter 7.3 measured giving you P2002 at exactly the right moment.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Two layers, and they are deliberately different. The HTTP rate limiter uses <code>express-rate-limit</code> with <code>rate-limit-redis</code>, a fixed window of 2.000 requests per 15 minutes per IP, keyed on the <em>last</em> entry of <code>X-Forwarded-For</code> so the header cannot be spoofed. It is wrapped in a <code>failOpen</code> helper: if Redis is unreachable the middleware logs a warning and lets the request through, because a rate-limit outage must never become a site outage. That limit used to be 500 and was raised on 2026-07-07 after a single legitimate user with several tabs open exhausted it and locked their own IP out of the entire API — which looked exactly like a backend crash. The quota service is separate and uses <code>MULTI</code> with three <code>INCR</code> + <code>EXPIRE</code> pairs (65s, 90.000s, 35 days) for per-minute, per-day and per-month AI usage — atomic, and immune to the TTL bug at the top of this lesson.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-737"><span class="lc-t">Code Lab · Lua Scripting Mastery for Atomic Operations</span><span class="lc-d">EVAL, EVALSHA, KEYS/ARGV và các script nguyên tử hay dùng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/authentication${REF}#module-958"><span class="lc-t">Code Lab · Rate limiting</span><span class="lc-d">Giới hạn tần suất ở tầng ứng dụng — nối tiếp bài 8.4</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Tính nguyên tử: giới hạn tần suất và khoá phân tán làm cho đúng</h2>
<p class="lead">Đây là bài mà Redis thôi làm một thứ tối ưu và trở thành công cụ đảm bảo <em>tính đúng đắn</em>. Bài 8.4 đã dựng một bộ giới hạn tần suất chạy được — miễn là chỉ có đúng một tiến trình Node. Ngay khi bạn chạy hai, một bộ đếm trong bộ nhớ trở thành hai bộ đếm, và giới hạn 5 lần một phút của bạn thành 10 lần một phút. Redis sửa được chuyện đó, nhưng chỉ khi bạn hiểu thao tác nào là nguyên tử và thao tác nào chỉ trông giống thế.</p>

<h3>Con bug khởi đầu mọi chuyện</h3>
<p>Redis chạy mỗi lúc một lệnh. Điều đó khiến TỪNG lệnh riêng lẻ là nguyên tử. Nó <strong>không</strong> khiến CHUỖI lệnh của bạn nguyên tử, bởi vì các client khác chen vào giữa chúng. Đây là sự khác biệt, đo bằng 500 request đồng thời trên một giới hạn 100:</p>
<div class="out">--- 500 request SONG SONG, giới hạn 100 ---
   cho qua 100 / chặn 400 → bộ đếm cuối = 500
   cùng việc đó bằng GET → kiểm → SET (không nguyên tử): cho qua 500, bộ đếm cuối = 1 ← SAI</div>
<p><strong>Toàn bộ 500 request đều lọt qua một giới hạn 100</strong>, và bộ đếm dừng lại ở 1. Cả 500 cùng đọc bộ đếm (0), cả 500 cùng kết luận mình đang dưới hạn, cả 500 cùng ghi 1. Bộ giới hạn không làm gì hết — và nó sẽ trông hoàn toàn đúng đắn trong mọi bài test chạy từng request một.</p>

<h3>Con bug thứ hai: INCR rồi EXPIRE</h3>
<p>Cách sửa hiển nhiên là <code>INCR</code>, vốn nguyên tử. Nhưng bộ đếm cần một hạn chót, và đó là lệnh thứ hai:</p>
<div class="out">   INCR xong, chưa kịp EXPIRE → TTL = -1 (khoá sống MÃI MÃI, user bị khoá vĩnh viễn)
   Lua (INCR + PEXPIRE nguyên tử) → TTL = 60s ✓</div>
<p>Nếu tiến trình chết, kết nối rớt, hoặc request bị huỷ ở khoảng giữa <code>INCR</code> và <code>EXPIRE</code>, khoá tồn tại mà không có hạn. Nó không bao giờ reset. Người dùng đó bị giới hạn tần suất <strong>vĩnh viễn</strong>, và chờ bao lâu cũng không hết. Đây là một con bug production có thật, phổ biến, và cực kỳ khó hiểu: đúng một người dùng, 429 mãi mãi, và trong log không có gì cả.</p>
<p>Có hai cách sửa đúng. <code>MULTI</code>/<code>EXEC</code> xếp hàng cả hai lệnh rồi chạy như một khối, hoặc một script Lua làm y hệt nhưng có thêm khả năng rẽ nhánh:</p>
<pre><code class="language-lua">-- chỉ đặt hạn ở lần tăng ĐẦU TIÊN
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c</code></pre>
<p>Lua chạy <em>bên trong</em> Redis, nghĩa là cả script là MỘT lệnh nguyên tử — không gì chen vào được. Nó cũng là một vòng đi-về thay vì hai, mà bài 12.1 đã cho bạn biết đó mới là phần đắt tiền. Trong production hãy dùng <code>EVALSHA</code> để thân script chỉ gửi đi một lần chứ không gửi mỗi lần gọi; ioredis làm sẵn việc đó cho bạn qua <code>defineCommand</code>.</p>

<h3>Thuật toán 1 — cửa sổ cố định, và cái lỗ ở ranh giới</h3>
<p>Chia ô theo thời gian: <code>rl:bob:1785182120</code>. Đơn giản, một khoá, 56 byte. Và sai một cách đo được:</p>
<div class="out">--- Cửa sổ cố định 5 request / 1 giây: đo lỗ hổng ranh giới ---
   cửa sổ #1785182120: cho qua 5 | cửa sổ #1785182121: cho qua 5
   ⇒ 10 request lọt trong khoảng ~300ms, dù giới hạn ghi là 5/giây → thực tế chịu 10/giây ở ranh giới</div>
<p>Năm request ở cuối cửa sổ này, năm request ở đầu cửa sổ kế: <strong>gấp đôi giới hạn đã cấu hình, gói gọn trong 300 mili-giây</strong>. Với một endpoint đăng nhập, đó là khác biệt giữa 5 lần đoán mật khẩu mỗi giây và 10 lần. Chuyện đó có quan trọng không là một phán đoán tuỳ ngữ cảnh — với việc điều tiết API thì thường là không; với bất cứ thứ gì nhạy cảm về bảo mật thì có.</p>

<h3>Thuật toán 2 — cửa sổ trượt bằng sorted set</h3>
<p>Lưu mốc thời gian của từng request vào một ZSET, vứt bỏ mọi thứ cũ hơn cửa sổ, rồi đếm phần còn lại:</p>
<pre><code class="language-lua">local key, nowMs, win, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, nowMs - win)   -- vứt những gì đã trôi ra ngoài cửa sổ
local n = redis.call('ZCARD', key)
if n &lt; limit then
  redis.call('ZADD', key, nowMs, ARGV[4])             -- ARGV[4] phải DUY NHẤT
  redis.call('PEXPIRE', key, win)
  return {1, n + 1}
end
return {0, n}</code></pre>
<div class="out">--- Cửa sổ trượt (ZSET) — chặn được ranh giới ---
   trước ranh giới: 5 lọt | sau ranh giới 160ms: 0 lọt → tổng 5 (đúng giới hạn 5)
   chờ đủ 1s cho cửa sổ trôi qua → request mới: CHO QUA (đang có 1 trong cửa sổ)</div>
<p>Chính xác tuyệt đối ở ranh giới. Cái giá là RAM, và nó không hề nhỏ:</p>
<div class="out">   RAM: cửa sổ trượt giữ 1001 phần tử = 89072 byte cho MỘT người dùng
        cửa sổ cố định 1 khoá = 56 byte | token bucket 1 hash = 96 byte</div>
<p><strong>89 KB cho một người dùng, so với 56 byte.</strong> Cửa sổ trượt lưu một mục cho mỗi request nằm trong cửa sổ, nên giới hạn 1.000 nghĩa là 1.000 mục. Với 10.000 người dùng đang hoạt động thì đó là 890 MB — nhiều hơn dung lượng của phần lớn máy Redis. Cửa sổ trượt thì đúng, nhưng nó không co giãn nổi với các giới hạn lớn. Hãy dùng nó ở chỗ giới hạn nhỏ mà tính đúng đắn thì quan trọng (đăng nhập: 5 lần trong 15 phút), đừng dùng cho việc điều tiết API chung.</p>

<h3>Thuật toán 3 — token bucket, khi bạn muốn cho phép bùng nổ</h3>
<div class="out">--- Token bucket 5 token, nạp 5 token/giây ---
   10 request tức thì → cho qua 5 (bùng hết bình), token còn 0.03
   chờ 600ms (nạp ~3 token) → request: CHO QUA, còn 2.04 token</div>
<p>Một cái bình chứa N token và được nạp lại với tốc độ đều đặn. Client nào im lặng một lúc thì được tiêu cả bình trong một phát, sau đó bị bóp về đúng tốc độ nạp. Đây mới là thứ bạn thật sự muốn cho một API công khai: một trang bắn tám request lúc tải xong thì phải thành công, còn một script gõ đều đều vào bạn thì không. Hai trường trong một hash, 96 byte, và nó không bao giờ lưu trạng thái theo từng request.</p>
<div class="out">--- Giá mỗi lần kiểm (1000 lần, ms/lần) ---
   cửa sổ cố định (Lua INCR)    0,31ms/lần
   cửa sổ trượt (Lua ZSET)      0,27ms/lần
   token bucket (Lua HASH)      0,29ms/lần</div>
<p>Cả ba đều tốn như nhau — một vòng đi-về. <strong>Hãy chọn dựa trên bộ nhớ và ngữ nghĩa, đừng bao giờ chọn dựa trên tốc độ.</strong></p>

<h3>Khoá phân tán: ba cách làm sai</h3>
<h4>Sai 1 — khoá không có hạn</h4>
<div class="out">   worker-1 SETNX → 1 (giành được), TTL = -1
   worker-1 CRASH trước khi DEL...
   worker-2 SETNX → 0 (0 = thất bại), TTL vẫn -1 → KẸT MÃI MÃI</div>
<p>Một tiến trình chết là khoá bị giữ vĩnh viễn. Luôn dùng <code>SET khoá giá_trị PX hạn NX</code>, đừng bao giờ dùng <code>SETNX</code> trơ trọi.</p>

<h4>Sai 2 — mở khoá bằng DEL thẳng</h4>
<div class="out">   worker-1 giữ khoá (hạn 300ms), làm việc CHẬM mất 400ms...
   khoá tự hết hạn → worker-2 giành được: OK — GIỜ CÓ HAI worker trong vùng tới hạn
   worker-1 làm xong, gọi DEL → xoá 1 khoá — nhưng đó là khoá của WORKER-2!
   khoá còn lại: null → worker-3 bất kỳ giành được ngay</div>
<p>Đây là trường hợp tinh tế và đáng đọc hai lần. Công việc của worker-1 chạy lâu hơn hạn của khoá. Khoá hết hạn, worker-2 giành lấy một cách hoàn toàn chính đáng — rồi worker-1 làm xong và xoá mất khoá <em>của worker-2</em>. Giờ vùng tới hạn mở toang. Một công việc chạy chậm đổ dây chuyền thành số lượng truy cập đồng thời không giới hạn.</p>

<h4>Đúng — token duy nhất cộng với so-sánh-rồi-xoá trong Lua</h4>
<pre><code class="language-javascript">import crypto from 'node:crypto';

const LUA_UNLOCK = &#96;
if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end&#96;;

async function acquire(key, ttlMs) {
  const token = crypto.randomUUID();
  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
  return ok ? token : null;                 // null = người khác đang giữ
}

const release = (key, token) =&gt; redis.eval(LUA_UNLOCK, 1, key, token);</code></pre>
<div class="out">   worker-1 giành được, token = bd76d443…
   khoá hết hạn, worker-2 giành được, token = d6afad4b…
   worker-1 mở khoá bằng token của mình → xoá 0 khoá (0 = KHÔNG xoá nhầm ✓)
   khoá vẫn thuộc về worker-2: d6afad4b…
   worker-2 mở khoá → xoá 1 khoá ✓</div>
<p>Phép kiểm và lệnh xoá bắt buộc phải nằm trong cùng một bước nguyên tử — làm <code>GET</code>, so sánh trong JavaScript, rồi <code>DEL</code> là tái tạo lại đúng cuộc đua mà ta vừa sửa, bởi vì khoá có thể hết hạn ở khoảng giữa hai lệnh.</p>

<h3>Khoá có thật sự làm được gì không? Đo đi.</h3>
<div class="out">--- 50 worker song song, mỗi worker cộng 1 vào bộ đếm (đọc-sửa-ghi, 5ms) ---
   KHÔNG khoá     → bộ đếm = 1 (đúng phải là 50)
   CÓ khoá        → bộ đếm = 50 ✓
   INCR nguyên tử → bộ đếm = 50 ✓ (không cần khoá — hãy ưu tiên cách này)</div>
<p>Năm mươi lần cộng, bốn mươi chín lần bị mất. Rồi tới dòng thứ ba, chính là điểm mấu chốt của cả mục này: <strong>cái khoá vốn chưa bao giờ cần thiết.</strong> <code>INCR</code> cho ra cùng câu trả lời đúng mà không cần khoá, không cần token, không phải chỉnh TTL và không có kiểu hỏng nào. Khoá phân tán là câu trả lời khi vùng tới hạn động vào thứ gì đó <em>bên ngoài</em> Redis — một API bên thứ ba chỉ được gọi đúng một lần, một tệp tin, một báo cáo chạy mười giây. Còn bên trong Redis, hãy với tới lệnh nguyên tử hoặc một script Lua trước đã.</p>
<div class="out">   500 lần khoá + mở (không tranh chấp): 0,657ms/lần (2 vòng đi-về)</div>

<div class="pitfall">
<p><strong>Khoá Redis không phải một lời bảo đảm an toàn.</strong> Nếu công việc của bạn có thể chạy quá hạn của khoá thì rồi sẽ tới lúc hai worker <em>cùng</em> chạy một lúc — phép đo số 2 ở trên chính là cảnh đó đang xảy ra. Viết Lua giỏi cỡ nào cũng không sửa được, vì khoá đã hết hạn mất rồi. Hoặc là làm cho công việc idempotent (chạy hai lần cũng vô hại), hoặc là để worker gia hạn khoá trong lúc chạy và huỷ việc nếu gia hạn thất bại. Redlock trên nhiều nút Redis độc lập sinh ra để giải bài này, và nó vẫn còn đang bị tranh cãi; nếu tính đúng đắn thật sự phụ thuộc vào loại trừ tương hỗ thì hãy dùng transaction của cơ sở dữ liệu với ràng buộc duy nhất, thứ mà bài 7.3 đã đo được là ném P2002 ra đúng vào thời điểm cần thiết.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Hai tầng, và chúng khác nhau một cách có chủ ý. Bộ giới hạn tần suất HTTP dùng <code>express-rate-limit</code> cùng <code>rate-limit-redis</code>, cửa sổ cố định 2.000 request mỗi 15 phút cho mỗi IP, đánh khoá theo mục <em>CUỐI CÙNG</em> của <code>X-Forwarded-For</code> để header không thể bị giả mạo. Nó được bọc trong một hàm <code>failOpen</code>: nếu Redis không với tới được thì middleware ghi một cảnh báo rồi cho request đi tiếp, bởi vì một sự cố của bộ giới hạn tần suất tuyệt đối không được phép biến thành sự cố của cả trang. Giới hạn đó trước kia là 500 và được nâng lên vào ngày 2026-07-07 sau khi một người dùng hoàn toàn chính đáng, mở vài tab, xài hết mức và tự khoá IP của chính mình khỏi toàn bộ API — nhìn y hệt một cú sập backend. Dịch vụ hạn mức thì tách riêng và dùng <code>MULTI</code> với ba cặp <code>INCR</code> + <code>EXPIRE</code> (65 giây, 90.000 giây, 35 ngày) cho mức dùng AI theo phút, theo ngày và theo tháng — nguyên tử, và miễn nhiễm với con bug TTL ở đầu bài này.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-737"><span class="lc-t">Code Lab · Lua Scripting Mastery for Atomic Operations</span><span class="lc-d">EVAL, EVALSHA, KEYS/ARGV và các script nguyên tử hay dùng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/authentication${REF}#module-958"><span class="lc-t">Code Lab · Rate limiting</span><span class="lc-d">Giới hạn tần suất ở tầng ứng dụng — nối tiếp bài 8.4</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — Pub/Sub and Streams: the message that vanished|||12.5 — Pub/Sub và Streams: tin nhắn đã biến mất',
      slug: 'nodejs-12-5-pubsub-streams',
      simulation: {
        scenario: 'pub-sub',
        options: { style: 'pubsub' },
        caption: { en: 'Direct calls versus publishing one event', vi: 'Gọi thẳng so với công bố một sự kiện' },
      },
      type: 'VIDEO',
      description: 'PUBLISH trả về 0 và tin nhắn biến mất khỏi vũ trụ. Stream giữ lại được, chia việc cho nhiều worker và đòi lại việc bỏ dở — có XAUTOCLAIM chạy thật chứng minh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>Pub/Sub and Streams: the message that vanished</h2>
<p class="lead">Chapter 11 used Redis Pub/Sub without explaining it — the Socket.IO Redis adapter is Pub/Sub underneath, which is how two Node processes broadcast to each other's rooms. This lesson explains what you actually bought there, and why the same mechanism is completely wrong for a job queue.</p>

<h3>Pub/Sub is a broadcast, not a mailbox</h3>
<div class="out">--- 1. Pub/Sub: thuê bao offline thì mất trắng ---
   thuê bao ĐANG nghe, gửi 3 tin → nhận 3: [tin-1, tin-2, tin-3]
   thuê bao rớt, PUBLISH trả về 0 (số người nhận) — tin biến mất khỏi Redis
   nối lại rồi → nhận tiếp: [tin-1, tin-2, tin-3, tin-4] ⇒ MẤT "tin-khi-offline"</div>
<p><code>PUBLISH</code> returns the number of subscribers that received the message, and <strong>zero is not an error</strong>. The message is delivered to whoever is listening at that instant and then it is gone — not stored, not queued, not recoverable. Redis never knew you wanted it kept.</p>
<p>That makes Pub/Sub perfect for exactly one shape of problem: <em>ephemeral fan-out where a missed message is harmless</em>. Cache invalidation across processes ("key X changed, drop your local copy"), Socket.IO room broadcasts, live presence. If a subscriber was down, it will re-read from the database anyway when it comes back.</p>
<p>It makes Pub/Sub catastrophically wrong for anything where a lost message means lost work: sending an email, charging a card, generating a thumbnail.</p>

<h3>Two traps that cost an afternoon each</h3>
<div class="out">   gọi GET trên kết nối đang subscribe → LỖI: Connection in subscriber mode, only subscriber commands may be used</div>
<p>A connection that has subscribed can only run subscribe-family commands. You need <strong>two clients</strong>: one listening, one working. If you share the singleton from lesson 12.1 and call <code>subscribe</code> on it, every other Redis call in your app starts throwing.</p>
<p>The second trap I hit while writing this lesson, in the measurement above. The first run printed <code>[tin-1, tin-2, tin-3, tin-4, tin-4]</code> — <strong>tin-4 twice</strong>. The cause was mine: on reconnect I called <code>sub.on('message', handler)</code> again without removing the first handler, so both fired. In a long-lived service that re-subscribes on every reconnect, this is how one message becomes eight after a bad network week. Register the listener <em>once</em>, outside the reconnect path.</p>

<h3>Streams: the log that remembers</h3>
<div class="out">--- 3. Streams: tin nằm lại trong Redis ---
   XADD 5 job → XLEN = 5
   đọc lại từ đầu (XRANGE): 5 tin, id đầu = 1785182199789-0
   id có dạng &lt;mili-giây&gt;-&lt;số thứ tự&gt;, tự tăng, sắp xếp được</div>
<p>A stream is an append-only log. Entries stay until you delete them, ids are monotonic (<code>&lt;milliseconds&gt;-&lt;sequence&gt;</code>) and you can re-read any range at any time. That id format is quietly useful: it is a timestamp you can sort, range-scan and resume from — which is exactly the <code>?since=&lt;last id&gt;</code> pattern chapter 11.4 needed after a socket reconnect.</p>

<h3>Consumer groups: split the work, then prove nothing is lost</h3>
<div class="out">--- 4. Consumer group: 2 worker chia 5 job, không trùng ---
   worker-A nhận 3 job | worker-B nhận 2 job → tổng 5/5, KHÔNG trùng nhau
   A đã XACK 3 job; B chưa xác nhận → PENDING = 2 job
   worker-C gọi XAUTOCLAIM (idle&gt;50ms) → nhận lại 2 job bỏ dở ⇒ KHÔNG MẤT VIỆC
   sau khi C xác nhận: PENDING = 0</div>
<p>This is the whole reason streams exist. Each entry goes to exactly one consumer in the group. A delivered-but-unacknowledged entry sits in the <em>pending entries list</em>, and if the worker holding it dies, another worker reclaims it with <code>XAUTOCLAIM</code>. Compare that with the Pub/Sub measurement at the top, where a dead subscriber simply lost the message.</p>
<pre><code class="language-javascript">// worker: đọc, làm, xác nhận
await redis.xgroup('CREATE', 'jobs', 'g1', '0', 'MKSTREAM').catch(() =&gt; {});  // đã tồn tại thì bỏ qua

while (running) {
  const res = await redis.xreadgroup(
    'GROUP', 'g1', process.env.WORKER_ID,
    'COUNT', 10, 'BLOCK', 5000,      // chờ tối đa 5s, KHÔNG quay vòng bận
    'STREAMS', 'jobs', '&gt;',           // '&gt;' = chỉ những tin chưa ai nhận
  );
  if (!res) continue;                 // hết 5 giây mà không có việc

  for (const [id, fields] of res[0][1]) {
    try {
      await handle(fields);
      await redis.xack('jobs', 'g1', id);   // CHỈ xác nhận khi đã làm XONG
    } catch (err) {
      // đừng XACK: để nó nằm trong pending cho worker khác đòi lại
      logger.error('job failed', { id, err });
    }
  }
}</code></pre>
<p>Two details carry all the weight. <code>BLOCK 5000</code> means the worker sleeps inside Redis instead of polling — no busy loop, no wasted round trips. And <code>XACK</code> goes <em>after</em> the work succeeds, never before: acknowledging early converts a crash into a silently dropped job.</p>

<h3>Streams never clean up after themselves</h3>
<div class="out">50.000 tin, chưa cắt: XLEN=50000 RAM=1.17MB
XTRIM MAXLEN ~1000 : XLEN=40000 RAM=1.13MB (0,88ms) ← xấp xỉ, chỉ bỏ trọn NÚT
XTRIM MAXLEN 1000  : XLEN=1000  RAM=0.03MB (1,40ms) ← chính xác
XTRIM ~1000 LIMIT 0: XLEN=1000  RAM=0.03MB (1,18ms) ← xấp xỉ không giới hạn số nút quét
stream-node-max-entries = 100</div>
<p>Look at line two, because it surprised me. <code>MAXLEN ~1000</code> — the form every tutorial recommends — left <strong>40.000 entries</strong> and freed almost nothing. The <code>~</code> means "approximately", and by default Redis also caps how many nodes it will scan in one call, so it stops early. Either use the exact form, or pass <code>LIMIT 0</code> to let the approximate trim run to completion. Trimming is not optional: an untrimmed stream grows forever, and unlike a cache key it has no TTL to save you.</p>
<p>Prefer <code>MAXLEN</code> when you care about memory and <code>MINID</code> when you care about time (<code>XTRIM log MINID &lt;id của 7 ngày trước&gt;</code>). You can also trim on write — <code>XADD jobs MAXLEN ~ 10000 * ...</code> — which is the option that never gets forgotten in a cron job.</p>

<h3>Three ways to move a message, measured</h3>
<div class="out">--- 6. Tốc độ (pipeline 10.000 tin) ---
   PUBLISH (0 thuê bao)   27,9ms
   XADD (stream)          22,6ms
   LPUSH (list)           31,2ms
   RAM: stream 0,19MB | list 0,06MB</div>
<p>Speed is a non-argument — all three are one round trip and the pipeline dominates. Choose on semantics:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Pub/Sub</span><span class="v">rải tin cho MỌI người đang nghe, không lưu lại. Vô hiệu hoá cache giữa các tiến trình, adapter Socket.IO. Mất tin là chuyện bình thường</span></div>
  <div class="kv"><span class="k">List + BRPOP</span><span class="v">hàng đợi đơn giản nhất, một tin cho một worker. Nhẹ RAM nhất. KHÔNG có xác nhận: worker chết giữa chừng là mất việc</span></div>
  <div class="kv"><span class="k">Stream + consumer group</span><span class="v">một tin cho một worker, CÓ xác nhận và đòi lại việc bỏ dở, đọc lại được lịch sử. Đây là lựa chọn cho việc phải hoàn thành</span></div>
</div>
<p>For real background jobs, most teams should not build this by hand — BullMQ sits on top of Redis and gives you retries with backoff, delayed jobs, priorities, repeatable jobs and a dashboard. That is chapter 13. Everything here is what BullMQ is doing underneath, and knowing it is how you debug BullMQ when it misbehaves.</p>

<div class="pitfall">
<p><strong>Pub/Sub does not become reliable by adding a Redis with persistence.</strong> Persistence saves keys; a published message was never a key. Even with AOF on every write, a message published while a subscriber was disconnected is gone. If you catch yourself writing "we'll re-publish on reconnect", you have started building a stream badly — use the real one.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The Socket.IO Redis adapter measured in chapter 11 is Pub/Sub: process B publishes a room broadcast, process A's subscriber receives it and delivers to its local sockets — the 5,02ms cross-process delivery from that chapter. It is the right tool precisely because a dropped broadcast is harmless: the client treats the socket as a signal and re-fetches over REST, which is the rule chapter 11.4 arrived at after watching a reconnect lose all five buffered messages.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-735"><span class="lc-t">Code Lab · Redis Streams and Event-Driven Architecture</span><span class="lc-d">XADD, XREADGROUP, XACK, XAUTOCLAIM — dựng hàng đợi bằng tay</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-736"><span class="lc-t">Code Lab · Advanced Pub/Sub Patterns and Real-Time Features</span><span class="lc-d">Kênh theo mẫu, fan-out và các khuôn mẫu realtime</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Pub/Sub và Streams: tin nhắn đã biến mất</h2>
<p class="lead">Chương 11 đã dùng Redis Pub/Sub mà không giải thích — cái adapter Redis của Socket.IO bên dưới chính là Pub/Sub, và đó là cách hai tiến trình Node phát tin vào phòng của nhau. Bài này giải thích thứ bạn đã mua ở đó thực chất là gì, và vì sao đúng cơ chế ấy lại hoàn toàn sai cho một hàng đợi công việc.</p>

<h3>Pub/Sub là một buổi phát thanh, không phải một hòm thư</h3>
<div class="out">--- 1. Pub/Sub: thuê bao offline thì mất trắng ---
   thuê bao ĐANG nghe, gửi 3 tin → nhận 3: [tin-1, tin-2, tin-3]
   thuê bao rớt, PUBLISH trả về 0 (số người nhận) — tin biến mất khỏi Redis
   nối lại rồi → nhận tiếp: [tin-1, tin-2, tin-3, tin-4] ⇒ MẤT "tin-khi-offline"</div>
<p><code>PUBLISH</code> trả về số thuê bao đã nhận được tin, và <strong>số 0 không phải một lỗi</strong>. Tin được giao cho bất kỳ ai đang nghe vào đúng khoảnh khắc đó rồi biến mất — không lưu, không xếp hàng, không lấy lại được. Redis chưa bao giờ biết là bạn muốn giữ nó lại.</p>
<p>Điều đó khiến Pub/Sub hoàn hảo cho đúng một dạng bài toán: <em>rải tin thoáng qua mà lỡ mất một tin cũng vô hại</em>. Vô hiệu hoá cache giữa các tiến trình ("khoá X vừa đổi, hãy vứt bản sao cục bộ đi"), phát tin vào phòng của Socket.IO, hiện diện trực tuyến. Nếu một thuê bao đang chết thì lúc sống lại nó sẽ đọc lại từ cơ sở dữ liệu thôi.</p>
<p>Và điều đó khiến Pub/Sub sai một cách thảm hoạ cho bất cứ việc gì mà mất tin đồng nghĩa với mất việc: gửi email, trừ tiền thẻ, tạo ảnh thu nhỏ.</p>

<h3>Hai cái bẫy, mỗi cái tốn một buổi chiều</h3>
<div class="out">   gọi GET trên kết nối đang subscribe → LỖI: Connection in subscriber mode, only subscriber commands may be used</div>
<p>Một kết nối đã subscribe thì chỉ chạy được các lệnh thuộc họ subscribe. Bạn cần <strong>hai client</strong>: một để nghe, một để làm việc. Nếu bạn xài lại cái client dùng chung ở bài 12.1 rồi gọi <code>subscribe</code> lên nó thì mọi lệnh Redis khác trong ứng dụng bắt đầu ném lỗi.</p>
<p>Cái bẫy thứ hai thì tôi tự dính khi soạn bài này, ngay trong phép đo ở trên. Lần chạy đầu in ra <code>[tin-1, tin-2, tin-3, tin-4, tin-4]</code> — <strong>tin-4 hai lần</strong>. Nguyên nhân là do tôi: lúc nối lại tôi gọi <code>sub.on('message', handler)</code> thêm lần nữa mà không gỡ handler cũ đi, thế là cả hai cùng chạy. Trong một dịch vụ sống lâu và subscribe lại mỗi lần nối lại, đây chính là cách một tin nhắn biến thành tám tin sau một tuần mạng xấu. Hãy đăng ký listener <em>một lần</em>, nằm ngoài nhánh nối lại.</p>

<h3>Streams: cuốn nhật ký biết nhớ</h3>
<div class="out">--- 3. Streams: tin nằm lại trong Redis ---
   XADD 5 job → XLEN = 5
   đọc lại từ đầu (XRANGE): 5 tin, id đầu = 1785182199789-0
   id có dạng &lt;mili-giây&gt;-&lt;số thứ tự&gt;, tự tăng, sắp xếp được</div>
<p>Stream là một cuốn nhật ký chỉ ghi thêm. Các mục nằm lại tới khi bạn xoá, id thì tăng đơn điệu (<code>&lt;mili-giây&gt;-&lt;số thứ tự&gt;</code>) và bạn đọc lại khoảng bất kỳ vào lúc nào cũng được. Cái định dạng id ấy hữu dụng một cách lặng lẽ: nó là một mốc thời gian mà bạn sắp xếp được, quét theo khoảng được và tiếp tục từ đó được — đúng bằng khuôn mẫu <code>?since=&lt;id cuối&gt;</code> mà bài 11.4 cần tới sau mỗi lần socket nối lại.</p>

<h3>Consumer group: chia việc, rồi chứng minh không mất việc nào</h3>
<div class="out">--- 4. Consumer group: 2 worker chia 5 job, không trùng ---
   worker-A nhận 3 job | worker-B nhận 2 job → tổng 5/5, KHÔNG trùng nhau
   A đã XACK 3 job; B chưa xác nhận → PENDING = 2 job
   worker-C gọi XAUTOCLAIM (idle&gt;50ms) → nhận lại 2 job bỏ dở ⇒ KHÔNG MẤT VIỆC
   sau khi C xác nhận: PENDING = 0</div>
<p>Đây chính là toàn bộ lý do stream tồn tại. Mỗi mục đi tới đúng MỘT consumer trong nhóm. Một mục đã giao mà chưa được xác nhận sẽ nằm trong <em>danh sách mục đang chờ</em>, và nếu worker đang giữ nó chết thì worker khác đòi lại bằng <code>XAUTOCLAIM</code>. Hãy so với phép đo Pub/Sub ở đầu bài, nơi một thuê bao chết là mất trắng tin nhắn.</p>
<pre><code class="language-javascript">// worker: đọc, làm, xác nhận
await redis.xgroup('CREATE', 'jobs', 'g1', '0', 'MKSTREAM').catch(() =&gt; {});  // đã tồn tại thì bỏ qua

while (running) {
  const res = await redis.xreadgroup(
    'GROUP', 'g1', process.env.WORKER_ID,
    'COUNT', 10, 'BLOCK', 5000,      // chờ tối đa 5s, KHÔNG quay vòng bận
    'STREAMS', 'jobs', '&gt;',           // '&gt;' = chỉ những tin chưa ai nhận
  );
  if (!res) continue;                 // hết 5 giây mà không có việc

  for (const [id, fields] of res[0][1]) {
    try {
      await handle(fields);
      await redis.xack('jobs', 'g1', id);   // CHỈ xác nhận khi đã làm XONG
    } catch (err) {
      // đừng XACK: để nó nằm trong pending cho worker khác đòi lại
      logger.error('job failed', { id, err });
    }
  }
}</code></pre>
<p>Hai chi tiết gánh toàn bộ sức nặng. <code>BLOCK 5000</code> nghĩa là worker ngủ bên trong Redis thay vì hỏi đi hỏi lại — không vòng lặp bận, không lãng phí vòng đi-về. Và <code>XACK</code> phải nằm <em>sau</em> khi công việc thành công, không bao giờ nằm trước: xác nhận sớm là biến một cú sập thành một job bị âm thầm vứt bỏ.</p>

<h3>Stream không bao giờ tự dọn dẹp</h3>
<div class="out">50.000 tin, chưa cắt: XLEN=50000 RAM=1.17MB
XTRIM MAXLEN ~1000 : XLEN=40000 RAM=1.13MB (0,88ms) ← xấp xỉ, chỉ bỏ trọn NÚT
XTRIM MAXLEN 1000  : XLEN=1000  RAM=0.03MB (1,40ms) ← chính xác
XTRIM ~1000 LIMIT 0: XLEN=1000  RAM=0.03MB (1,18ms) ← xấp xỉ không giới hạn số nút quét
stream-node-max-entries = 100</div>
<p>Hãy nhìn dòng thứ hai, vì nó làm tôi bất ngờ. <code>MAXLEN ~1000</code> — đúng cái dạng mà mọi bài hướng dẫn khuyên dùng — để lại <strong>40.000 mục</strong> và giải phóng gần như không được gì. Dấu <code>~</code> nghĩa là "khoảng chừng", và mặc định Redis còn giới hạn luôn số nút nó chịu quét trong một lần gọi, nên nó dừng sớm. Hoặc là dùng dạng chính xác, hoặc là truyền thêm <code>LIMIT 0</code> để phép cắt xấp xỉ chạy tới cùng. Cắt bớt không phải chuyện tuỳ chọn: một stream không cắt sẽ phình mãi mãi, và khác với một khoá cache, nó chẳng có TTL nào cứu bạn cả.</p>
<p>Hãy ưu tiên <code>MAXLEN</code> khi bạn quan tâm tới bộ nhớ và <code>MINID</code> khi bạn quan tâm tới thời gian (<code>XTRIM log MINID &lt;id của 7 ngày trước&gt;</code>). Bạn cũng cắt được ngay lúc ghi — <code>XADD jobs MAXLEN ~ 10000 * ...</code> — đây là lựa chọn không bao giờ bị bỏ quên trong một công việc định kỳ.</p>

<h3>Ba cách chuyển một tin nhắn, đo thật</h3>
<div class="out">--- 6. Tốc độ (pipeline 10.000 tin) ---
   PUBLISH (0 thuê bao)   27,9ms
   XADD (stream)          22,6ms
   LPUSH (list)           31,2ms
   RAM: stream 0,19MB | list 0,06MB</div>
<p>Tốc độ không phải một luận điểm — cả ba đều là một vòng đi-về và pipeline mới là thứ chiếm ưu thế. Hãy chọn theo ngữ nghĩa:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Pub/Sub</span><span class="v">rải tin cho MỌI người đang nghe, không lưu lại. Vô hiệu hoá cache giữa các tiến trình, adapter Socket.IO. Mất tin là chuyện bình thường</span></div>
  <div class="kv"><span class="k">List + BRPOP</span><span class="v">hàng đợi đơn giản nhất, một tin cho một worker. Nhẹ RAM nhất. KHÔNG có xác nhận: worker chết giữa chừng là mất việc</span></div>
  <div class="kv"><span class="k">Stream + consumer group</span><span class="v">một tin cho một worker, CÓ xác nhận và đòi lại việc bỏ dở, đọc lại được lịch sử. Đây là lựa chọn cho việc bắt buộc phải hoàn thành</span></div>
</div>
<p>Với công việc nền thật sự thì phần lớn các đội không nên tự dựng bằng tay — BullMQ nằm trên Redis và cho bạn cơ chế thử lại có giãn cách, job hẹn giờ, mức ưu tiên, job lặp lại và một bảng theo dõi. Đó là chương 13. Mọi thứ ở đây chính là những gì BullMQ đang làm bên dưới, và biết chúng là cách bạn gỡ lỗi BullMQ khi nó giở chứng.</p>

<div class="pitfall">
<p><strong>Pub/Sub không trở nên đáng tin chỉ vì bạn bật persistence cho Redis.</strong> Persistence lưu các KHOÁ; còn một tin đã publish thì chưa bao giờ là một khoá. Kể cả khi bật AOF ghi mọi lệnh, một tin được phát trong lúc thuê bao đang mất kết nối vẫn biến mất. Nếu bạn thấy mình đang viết "thôi lúc nối lại thì mình publish lại", tức là bạn đã bắt đầu dựng một stream theo cách tệ — hãy dùng cái stream thật.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Cái adapter Redis của Socket.IO đo ở chương 11 chính là Pub/Sub: tiến trình B publish một lượt phát tin vào phòng, thuê bao của tiến trình A nhận được rồi giao cho các socket cục bộ của nó — đúng con số 5,02ms giao tin xuyên tiến trình của chương đó. Nó là công cụ đúng chính bởi vì một lượt phát tin bị rơi là vô hại: client coi socket là TÍN HIỆU rồi lấy lại dữ liệu qua REST, đúng quy tắc mà bài 11.4 rút ra sau khi chứng kiến một lần nối lại làm mất sạch cả năm tin nhắn.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-735"><span class="lc-t">Code Lab · Redis Streams and Event-Driven Architecture</span><span class="lc-d">XADD, XREADGROUP, XACK, XAUTOCLAIM — dựng hàng đợi bằng tay</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-736"><span class="lc-t">Code Lab · Advanced Pub/Sub Patterns and Real-Time Features</span><span class="lc-d">Kênh theo mẫu, fan-out và các khuôn mẫu realtime</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Running Redis: the commands that freeze everything|||12.6 — Vận hành Redis: những lệnh làm đứng hình tất cả',
      slug: 'nodejs-12-6-van-hanh-production',
      type: 'VIDEO',
      description: 'Một lệnh KEYS làm PING của client khác vọt lên 126,96ms. DEL một khoá lớn chặn 205,50ms, UNLINK chỉ 0,37ms. Và ba chính sách trục xuất, trong đó hai cái biến Redis thành chỉ-đọc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.6</span>
<h2>Running Redis: the commands that freeze everything</h2>
<p class="lead">Everything in this lesson follows from one sentence you already read in 12.1: <strong>Redis executes one command at a time</strong>. That is a gift when you need atomicity and a loaded gun when a single command takes 200 milliseconds, because during those 200 milliseconds every other client in your fleet is simply stopped. This lesson measures the damage from a second connection, which is the only honest way to see it.</p>

<h3>The setup: one million keys</h3>
<div class="out">   DBSIZE=1000000 trong 2262,40ms, used_memory=93,4MB</div>
<p>Ninety-three megabytes for a million tiny keys — the number from the lesson 12.3 pitfall. Now, while a second client pings every 2ms, run the command every tutorial warns about:</p>

<h3>KEYS vs SCAN, measured from the outside</h3>
<div class="out">--- 2. KEYS * trên 1 triệu khoá: đo độ trễ của NGƯỜI KHÁC ---
   KEYS trả 1000000 khoá trong 343,86ms
   trong lúc đó PING của client KHÁC: trung vị 0,46ms, TỆ NHẤT 126,96ms

--- 3. SCAN thay cho KEYS ---
   SCAN duyệt 1000000 khoá qua 1000 vòng, tổng 857,41ms (CHẬM hơn KEYS về tổng thời gian)
   nhưng PING của client khác: trung vị 0,66ms, TỆ NHẤT 6,87ms ✓</div>
<p>The honest framing matters here: <strong>SCAN is 2,5× slower overall</strong>. If you only measured the command, you would choose KEYS. But the number that decides is the other one — a PING that normally takes 0,46ms took <strong>126,96ms</strong>. Every API request touching Redis in that window paid that. One admin script with a <code>KEYS *</code> in it produces a site-wide latency spike that looks like a network problem.</p>
<p><code>SCAN</code> returns a cursor and a batch, so Redis serves other clients between rounds. It comes with one property people trip on: it guarantees every key present for the whole scan is returned <em>at least once</em>, and keys may repeat. De-duplicate if that matters.</p>
<p>The same warning applies to the family: <code>HGETALL</code> on a huge hash, <code>LRANGE 0 -1</code> on a huge list, <code>SMEMBERS</code> on a huge set. Their scanning cousins are <code>HSCAN</code>, <code>SSCAN</code>, <code>ZSCAN</code>.</p>

<h3>DEL vs UNLINK: the same blocking problem, hidden in a delete</h3>
<div class="out">--- 7. Xoá một khoá KHỔNG LỒ: DEL vs UNLINK ---
   DEL    hash 1.000.000 trường:  205,50ms | PING tệ nhất của client khác 205,30ms
   UNLINK hash 1.000.000 trường:    0,37ms | PING tệ nhất của client khác 0,56ms</div>
<p>Deleting is work — Redis has to free a million allocations — and <code>DEL</code> does it inline, blocking everyone for <strong>205ms</strong>. <code>UNLINK</code> removes the key from the keyspace immediately and frees the memory in a background thread: <strong>556× faster</strong> from the caller's point of view, and invisible to other clients. There is no downside. <strong>Use UNLINK by default.</strong></p>
<p>The same applies to <code>FLUSHALL</code>/<code>FLUSHDB</code>, which take an <code>ASYNC</code> argument for the same reason.</p>

<h3>maxmemory: what happens when Redis fills up</h3>
<p>This is the single most important configuration decision, and the default is the dangerous one.</p>
<div class="out">--- 4. Chạm trần maxmemory với chính sách noeviction ---
   ghi thêm được 1873 khoá rồi DỪNG: OOM command not allowed when used memory &gt; 'maxmemory'.
   ⇒ noeviction = Redis biến thành CHỈ ĐỌC, mọi lệnh ghi 500
   đọc vẫn chạy: GET user:1:profile = {"id":1}</div>
<p>With <code>noeviction</code> — the default — a full Redis starts rejecting every write with an OOM error while reads keep working. If Redis is your session store or your rate limiter, half your application breaks in a way that looks nothing like "out of memory": logins fail, quota checks throw, but the homepage loads fine.</p>
<div class="out">--- 5. Đổi sang allkeys-lru ---
   ghi 50000 khoá mới: KHÔNG lỗi ✓
   DBSIZE 1001873 → 889257 | evicted_keys = 162616 (Redis tự vứt khoá cũ)</div>
<p>With <code>allkeys-lru</code>, Redis throws away least-recently-used keys to make room — 162.616 of them — and never returns an error. That is what you want <em>if Redis is a cache</em>, and it carries an obligation: your application must survive any key disappearing at any moment. Which, if you followed lesson 12.2, it already does.</p>

<div class="out">--- 6. volatile-lru: khoá không TTL thì không bị vứt ---
   toàn bộ khoá KHÔNG có TTL, ghi thêm → OOM command not allowed when used memory &gt; 'maxmemory'.
   ⇒ volatile-* mà quên đặt TTL = y hệt noeviction</div>
<p><strong>This is the trap that catches experienced people.</strong> <code>volatile-lru</code> sounds safer — "only evict keys that were going to expire anyway" — and it is, right up until a code path writes keys without a TTL. Then there is nothing eligible to evict and you are back to a read-only Redis. Remember from lesson 12.2 that a plain <code>SET</code> over an existing key <em>removes</em> its TTL: that is all it takes.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">noeviction</span><span class="v">MẶC ĐỊNH. Đầy là mọi lệnh ghi lỗi. Chỉ đúng khi Redis là kho dữ liệu CHÍNH và bạn thà lỗi còn hơn mất dữ liệu</span></div>
  <div class="kv"><span class="k">allkeys-lru</span><span class="v">Vứt khoá ít được dùng gần đây nhất. Đây là lựa chọn cho một cái CACHE. Đặt kèm maxmemory và quên nó đi</span></div>
  <div class="kv"><span class="k">allkeys-lfu</span><span class="v">Vứt theo TẦN SUẤT dùng thay vì lần dùng gần nhất. Tốt hơn khi có một nhóm khoá nóng ổn định bị các lần quét một-lần đẩy ra</span></div>
  <div class="kv"><span class="k">volatile-*</span><span class="v">Chỉ vứt khoá CÓ TTL. Nghe an toàn, hỏng im lặng khi có nhánh code quên đặt TTL</span></div>
</div>

<h3>Persistence: Redis is not amnesiac, but do not rely on it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RDB (ảnh chụp)</span><span class="v">Chụp toàn bộ dữ liệu theo chu kỳ. Tệp nhỏ, khởi động lại nhanh, sao lưu tiện. Mất phần dữ liệu kể từ lần chụp cuối — có thể là vài phút</span></div>
  <div class="kv"><span class="k">AOF (nhật ký lệnh)</span><span class="v">Ghi mọi lệnh ghi vào một tệp nhật ký. <code>appendfsync everysec</code> = mất tối đa 1 giây. Tệp to hơn, khởi động lại chậm hơn</span></div>
  <div class="kv"><span class="k">Cả hai</span><span class="v">Khuyến nghị của Redis cho dữ liệu quan trọng: AOF để phục hồi, RDB để sao lưu</span></div>
  <div class="kv"><span class="k">Không gì cả</span><span class="v">Đúng cho một cache thuần. Redis khởi động lại là rỗng, ứng dụng ấm lại. Nhanh nhất, đơn giản nhất</span></div>
</div>
<p>The decision follows from one question: <em>if this Redis lost everything right now, would you lose data or just performance?</em> If the answer is "just performance", turn persistence off and stop thinking about it. If any answer is "data", you have accidentally made Redis a primary database, and it is worth asking whether that data belongs in PostgreSQL instead.</p>

<h3>The numbers to watch</h3>
<div class="out">--- 8. Số liệu cần nhìn hằng ngày ---
   SLOWLOG: keys s:* mất 21980µs
   keyspace_hits=7775 misses=1208 → tỉ lệ trúng 86,6%
   used_memory=16,5MB | mem_fragmentation_ratio=4,41
   ops/giây=394413 | tổng lệnh đã chạy=4386155</div>
<p><code>SLOWLOG GET 10</code> is the first thing to run when Redis "gets slow", and it caught the <code>KEYS</code> at 21.980 microseconds without any instrumentation on your side. Set <code>slowlog-log-slower-than</code> to 10000 (10ms) in production — anything above that on an in-memory database is a bug, not a load problem.</p>
<p><code>mem_fragmentation_ratio</code> is <code>used_memory_rss / used_memory</code>. Around 1,0–1,5 is healthy. The 4,41 above is an artefact of the test just having freed a million keys — the allocator holds the pages rather than returning them to the OS. Sustained high fragmentation on a real workload means Redis's RSS is much larger than its data, which matters when the container has a memory limit.</p>
<p>And the pair that actually tells you whether caching is working: <code>keyspace_hits</code> and <code>keyspace_misses</code>. Lesson 12.2 showed why you should alert on <em>misses per second</em> rather than the ratio.</p>

<div class="pitfall">
<p><strong>Do not run FLUSHALL, KEYS or DEBUG on production, and do not let anyone else either.</strong> Redis has a <code>rename-command</code> directive for exactly this: <code>rename-command FLUSHALL ""</code> disables it outright. Also bind Redis to a private interface, set <code>requirepass</code>, and never expose port 6379 to the internet — an unauthenticated Redis on a public IP is compromised within hours, and the standard attack writes an SSH key through <code>CONFIG SET dir</code>.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Production Redis is 7.4.9 in Docker with <code>maxmemory 256M</code> and <code>maxmemory-policy allkeys-lru</code> — configured as a cache, correctly, so a runaway key can never make writes fail. Current state: <code>used_memory 1,23M</code> against that 256M ceiling, <code>evicted_keys:0</code>, <code>expired_keys:21</code>, <code>connected_clients:4</code>, and a hit rate of 89,2%. Zero evictions with 0,5% of the ceiling used means the limit exists purely as a blast radius, not as a working constraint — which is exactly how you want a cache sized: generous enough that eviction is an emergency brake, not a daily event.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-739"><span class="lc-t">Code Lab · Observability, Monitoring, and Performance Diagnostics</span><span class="lc-d">INFO, SLOWLOG, LATENCY và cách đọc chúng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-426"><span class="lc-t">Code Lab · Redis Persistence and Backup</span><span class="lc-d">RDB, AOF, sao lưu và phục hồi</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-734"><span class="lc-t">Code Lab · Redis Security Hardening and Access Control</span><span class="lc-d">requirepass, ACL, rename-command và bịt cổng</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.6</span>
<h2>Vận hành Redis: những lệnh làm đứng hình tất cả</h2>
<p class="lead">Mọi thứ trong bài này đều suy ra từ một câu bạn đã đọc ở bài 12.1: <strong>Redis chạy mỗi lúc một lệnh</strong>. Đó là món quà khi bạn cần tính nguyên tử và là khẩu súng đã lên đạn khi một lệnh đơn lẻ mất 200 mili-giây, bởi trong suốt 200 mili-giây ấy mọi client khác trong cả cụm chỉ đơn giản là đứng yên. Bài này đo mức thiệt hại từ một kết nối thứ hai, cách duy nhất trung thực để nhìn thấy nó.</p>

<h3>Bối cảnh: một triệu khoá</h3>
<div class="out">   DBSIZE=1000000 trong 2262,40ms, used_memory=93,4MB</div>
<p>Chín mươi ba megabyte cho một triệu khoá tí hon — đúng con số ở phần cạm bẫy của bài 12.3. Bây giờ, trong lúc một client thứ hai ping mỗi 2ms, hãy chạy cái lệnh mà mọi bài hướng dẫn đều cảnh báo:</p>

<h3>KEYS so với SCAN, đo từ bên ngoài</h3>
<div class="out">--- 2. KEYS * trên 1 triệu khoá: đo độ trễ của NGƯỜI KHÁC ---
   KEYS trả 1000000 khoá trong 343,86ms
   trong lúc đó PING của client KHÁC: trung vị 0,46ms, TỆ NHẤT 126,96ms

--- 3. SCAN thay cho KEYS ---
   SCAN duyệt 1000000 khoá qua 1000 vòng, tổng 857,41ms (CHẬM hơn KEYS về tổng thời gian)
   nhưng PING của client khác: trung vị 0,66ms, TỆ NHẤT 6,87ms ✓</div>
<p>Cách trình bày trung thực rất quan trọng ở đây: <strong>SCAN chậm hơn 2,5 lần về tổng thể</strong>. Nếu bạn chỉ đo bản thân câu lệnh thì bạn sẽ chọn KEYS. Nhưng con số quyết định là con số kia — một lệnh PING bình thường mất 0,46ms đã mất tới <strong>126,96ms</strong>. Mọi request API chạm vào Redis trong khoảng thời gian đó đều phải trả cái giá ấy. Một script quản trị có <code>KEYS *</code> bên trong sinh ra một đợt vọt độ trễ trên toàn trang, nhìn y hệt sự cố mạng.</p>
<p><code>SCAN</code> trả về một con trỏ và một lô, nên Redis phục vụ các client khác ở giữa các vòng. Nó đi kèm một tính chất hay làm người ta vấp: nó bảo đảm mọi khoá tồn tại suốt quá trình quét sẽ được trả về <em>ít nhất một lần</em>, và các khoá có thể lặp lại. Hãy khử trùng lặp nếu điều đó quan trọng.</p>
<p>Cảnh báo tương tự áp dụng cho cả họ: <code>HGETALL</code> trên một hash khổng lồ, <code>LRANGE 0 -1</code> trên một list khổng lồ, <code>SMEMBERS</code> trên một set khổng lồ. Các phiên bản quét dần của chúng là <code>HSCAN</code>, <code>SSCAN</code>, <code>ZSCAN</code>.</p>

<h3>DEL so với UNLINK: cùng vấn đề chặn, nhưng giấu trong một lệnh xoá</h3>
<div class="out">--- 7. Xoá một khoá KHỔNG LỒ: DEL vs UNLINK ---
   DEL    hash 1.000.000 trường:  205,50ms | PING tệ nhất của client khác 205,30ms
   UNLINK hash 1.000.000 trường:    0,37ms | PING tệ nhất của client khác 0,56ms</div>
<p>Xoá cũng là công việc — Redis phải giải phóng một triệu vùng cấp phát — và <code>DEL</code> làm việc đó ngay tại chỗ, chặn tất cả mọi người <strong>205ms</strong>. <code>UNLINK</code> gỡ khoá khỏi vùng khoá ngay lập tức rồi giải phóng bộ nhớ trong một luồng nền: <strong>nhanh hơn 556 lần</strong> dưới góc nhìn của người gọi, và vô hình với các client khác. Không có mặt trái nào cả. <strong>Hãy dùng UNLINK làm mặc định.</strong></p>
<p>Điều tương tự áp dụng cho <code>FLUSHALL</code>/<code>FLUSHDB</code>, vốn nhận thêm tham số <code>ASYNC</code> cũng vì lý do đó.</p>

<h3>maxmemory: chuyện gì xảy ra khi Redis đầy</h3>
<p>Đây là quyết định cấu hình quan trọng nhất, và giá trị mặc định lại là giá trị nguy hiểm.</p>
<div class="out">--- 4. Chạm trần maxmemory với chính sách noeviction ---
   ghi thêm được 1873 khoá rồi DỪNG: OOM command not allowed when used memory &gt; 'maxmemory'.
   ⇒ noeviction = Redis biến thành CHỈ ĐỌC, mọi lệnh ghi 500
   đọc vẫn chạy: GET user:1:profile = {"id":1}</div>
<p>Với <code>noeviction</code> — giá trị mặc định — một Redis đầy sẽ bắt đầu từ chối mọi lệnh ghi bằng lỗi OOM trong khi các lệnh đọc vẫn chạy ngon. Nếu Redis đang là kho phiên đăng nhập hoặc bộ giới hạn tần suất của bạn thì một nửa ứng dụng hỏng theo cái cách chẳng giống "hết bộ nhớ" chút nào: đăng nhập thất bại, kiểm tra hạn mức ném lỗi, nhưng trang chủ vẫn tải bình thường.</p>
<div class="out">--- 5. Đổi sang allkeys-lru ---
   ghi 50000 khoá mới: KHÔNG lỗi ✓
   DBSIZE 1001873 → 889257 | evicted_keys = 162616 (Redis tự vứt khoá cũ)</div>
<p>Với <code>allkeys-lru</code>, Redis vứt đi những khoá ít được dùng gần đây nhất để lấy chỗ — 162.616 khoá — và không bao giờ trả về lỗi. Đó là điều bạn muốn <em>nếu Redis là một cache</em>, và nó kèm theo một nghĩa vụ: ứng dụng của bạn phải sống sót khi bất kỳ khoá nào biến mất vào bất kỳ lúc nào. Mà nếu bạn đã theo bài 12.2 thì nó vốn đã sống sót được rồi.</p>

<div class="out">--- 6. volatile-lru: khoá không TTL thì không bị vứt ---
   toàn bộ khoá KHÔNG có TTL, ghi thêm → OOM command not allowed when used memory &gt; 'maxmemory'.
   ⇒ volatile-* mà quên đặt TTL = y hệt noeviction</div>
<p><strong>Đây là cái bẫy tóm được cả những người có kinh nghiệm.</strong> <code>volatile-lru</code> nghe an toàn hơn — "chỉ vứt những khoá đằng nào cũng sắp hết hạn" — và nó đúng là an toàn hơn, cho tới khi có một nhánh code ghi khoá mà không đặt TTL. Lúc đó chẳng còn gì đủ điều kiện để vứt và bạn quay về với một Redis chỉ-đọc. Hãy nhớ lại bài 12.2: một lệnh <code>SET</code> trơ trọi lên khoá đã có sẵn sẽ <em>xoá</em> TTL của nó. Chỉ cần bấy nhiêu thôi.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">noeviction</span><span class="v">MẶC ĐỊNH. Đầy là mọi lệnh ghi lỗi. Chỉ đúng khi Redis là kho dữ liệu CHÍNH và bạn thà lỗi còn hơn mất dữ liệu</span></div>
  <div class="kv"><span class="k">allkeys-lru</span><span class="v">Vứt khoá ít được dùng gần đây nhất. Đây là lựa chọn cho một cái CACHE. Đặt kèm maxmemory rồi quên nó đi</span></div>
  <div class="kv"><span class="k">allkeys-lfu</span><span class="v">Vứt theo TẦN SUẤT dùng thay vì lần dùng gần nhất. Tốt hơn khi có một nhóm khoá nóng ổn định bị các lần quét một-lần đẩy ra ngoài</span></div>
  <div class="kv"><span class="k">volatile-*</span><span class="v">Chỉ vứt khoá CÓ TTL. Nghe an toàn, hỏng im lặng khi có nhánh code quên đặt TTL</span></div>
</div>

<h3>Persistence: Redis không đãng trí, nhưng đừng dựa vào nó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RDB (ảnh chụp)</span><span class="v">Chụp toàn bộ dữ liệu theo chu kỳ. Tệp nhỏ, khởi động lại nhanh, sao lưu tiện. Mất phần dữ liệu kể từ lần chụp cuối — có thể là vài phút</span></div>
  <div class="kv"><span class="k">AOF (nhật ký lệnh)</span><span class="v">Ghi mọi lệnh ghi vào một tệp nhật ký. <code>appendfsync everysec</code> = mất tối đa 1 giây. Tệp to hơn, khởi động lại chậm hơn</span></div>
  <div class="kv"><span class="k">Cả hai</span><span class="v">Khuyến nghị của Redis cho dữ liệu quan trọng: AOF để phục hồi, RDB để sao lưu</span></div>
  <div class="kv"><span class="k">Không gì cả</span><span class="v">Đúng cho một cache thuần. Redis khởi động lại là rỗng, ứng dụng ấm lại dần. Nhanh nhất, đơn giản nhất</span></div>
</div>
<p>Quyết định này suy ra từ đúng một câu hỏi: <em>nếu Redis này mất sạch ngay bây giờ, bạn mất DỮ LIỆU hay chỉ mất HIỆU NĂNG?</em> Nếu câu trả lời là "chỉ mất hiệu năng" thì hãy tắt persistence đi và đừng nghĩ về nó nữa. Còn nếu có chỗ nào trả lời là "mất dữ liệu" thì bạn đã vô tình biến Redis thành một cơ sở dữ liệu chính, và đáng để tự hỏi liệu dữ liệu đó có nên nằm trong PostgreSQL hay không.</p>

<h3>Những con số cần theo dõi</h3>
<div class="out">--- 8. Số liệu cần nhìn hằng ngày ---
   SLOWLOG: keys s:* mất 21980µs
   keyspace_hits=7775 misses=1208 → tỉ lệ trúng 86,6%
   used_memory=16,5MB | mem_fragmentation_ratio=4,41
   ops/giây=394413 | tổng lệnh đã chạy=4386155</div>
<p><code>SLOWLOG GET 10</code> là thứ đầu tiên cần chạy khi Redis "tự nhiên chậm", và nó đã tóm được lệnh <code>KEYS</code> ở mức 21.980 micro-giây mà bạn không phải gắn thêm bất kỳ dụng cụ đo nào. Hãy đặt <code>slowlog-log-slower-than</code> bằng 10000 (10ms) trong production — bất cứ thứ gì vượt ngưỡng đó trên một cơ sở dữ liệu nằm trong RAM đều là một con bug, không phải chuyện quá tải.</p>
<p><code>mem_fragmentation_ratio</code> là <code>used_memory_rss / used_memory</code>. Quanh mức 1,0–1,5 là khoẻ mạnh. Con số 4,41 ở trên là hệ quả của việc bài kiểm vừa giải phóng một triệu khoá — bộ cấp phát giữ lại các trang nhớ chứ không trả về cho hệ điều hành. Phân mảnh cao kéo dài trên tải thật nghĩa là RSS của Redis lớn hơn nhiều so với dữ liệu của nó, điều rất đáng lo khi container có giới hạn bộ nhớ.</p>
<p>Và cặp số thật sự cho bạn biết cache có đang hoạt động hay không: <code>keyspace_hits</code> và <code>keyspace_misses</code>. Bài 12.2 đã chỉ ra vì sao nên đặt cảnh báo trên <em>số lần trượt mỗi giây</em> chứ không phải trên tỉ lệ.</p>

<div class="pitfall">
<p><strong>Đừng chạy FLUSHALL, KEYS hay DEBUG trên production, và cũng đừng để người khác chạy.</strong> Redis có sẵn chỉ thị <code>rename-command</code> đúng cho việc này: <code>rename-command FLUSHALL ""</code> vô hiệu hoá hẳn nó. Ngoài ra hãy buộc Redis vào một giao diện mạng nội bộ, đặt <code>requirepass</code>, và đừng bao giờ phơi cổng 6379 ra Internet — một Redis không xác thực nằm trên IP công cộng sẽ bị chiếm trong vòng vài giờ, và đòn tấn công tiêu chuẩn là ghi một khoá SSH vào máy thông qua <code>CONFIG SET dir</code>.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Redis production là bản 7.4.9 chạy trong Docker với <code>maxmemory 256M</code> và <code>maxmemory-policy allkeys-lru</code> — được cấu hình đúng như một cache, nên một cái khoá phình mất kiểm soát không bao giờ làm hỏng được các lệnh ghi. Trạng thái hiện tại: <code>used_memory 1,23M</code> trên cái trần 256M ấy, <code>evicted_keys:0</code>, <code>expired_keys:21</code>, <code>connected_clients:4</code>, và tỉ lệ trúng 89,2%. Không có lần trục xuất nào trong khi mới dùng 0,5% cái trần nghĩa là giới hạn đó tồn tại thuần tuý như một vành đai an toàn chứ không phải một ràng buộc thật sự — và đó chính xác là cách bạn muốn định cỡ một cache: rộng rãi đủ để việc trục xuất là một cái phanh khẩn cấp, không phải một sự kiện diễn ra hằng ngày.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-739"><span class="lc-t">Code Lab · Observability, Monitoring, and Performance Diagnostics</span><span class="lc-d">INFO, SLOWLOG, LATENCY và cách đọc chúng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-426"><span class="lc-t">Code Lab · Redis Persistence and Backup</span><span class="lc-d">RDB, AOF, sao lưu và phục hồi</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-734"><span class="lc-t">Code Lab · Redis Security Hardening and Access Control</span><span class="lc-d">requirepass, ACL, rename-command và bịt cổng</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 12.7 ─────────────────────────── */
    {
      title: '12.7 — Quiz: Redis|||12.7 — Kiểm tra: Redis',
      slug: 'nodejs-12-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu về vòng đi-về, khi cache thua, TTL biến mất, cơn giẫm đạp, vách đá mã hoá, tính nguyên tử, khoá phân tán và chính sách trục xuất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 12.1 to 12.6 — the 63× that pipelining bought, the 1,2 MB payload where caching LOST, the 500 requests that all passed a limit of 100, the 513th hash field that tripled memory. Redis is the chapter where the intuitive answer and the measured answer disagree most often, so prefer the output block.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 12.1 tới 12.6 — con số 63 lần mà pipeline mua được, cái payload 1,2 MB nơi cache THUA, 500 request cùng lọt qua một giới hạn 100, cái trường hash thứ 513 làm bộ nhớ tăng gấp ba. Redis là chương mà câu trả lời theo trực giác và câu trả lời theo phép đo mâu thuẫn nhau nhiều nhất, nên hãy tin khối kết quả đo.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 800,
        questions: [
          {
            question: '2.000 sequential PINGs to Redis on localhost took 408,8ms — only 4.893 commands per second. Yet 10.000 SET commands in ONE pipeline took 31,1ms. Why?|||2.000 PING tuần tự tới Redis trên localhost mất 408,8ms — chỉ 4.893 lệnh/giây. Nhưng 10.000 lệnh SET trong MỘT pipeline chỉ mất 31,1ms. Vì sao?',
            options: [
              'PING is heavier than SET because it has to check server health|||PING nặng hơn SET vì nó phải kiểm tra tình trạng máy chủ',
              'The dominant cost is the ROUND TRIP (~0,2ms per command), not the work inside Redis. A pipeline pays that cost ONCE for a thousand commands|||Chi phí thống trị là VÒNG ĐI-VỀ (~0,2ms mỗi lệnh), không phải công việc bên trong Redis. Pipeline trả cái giá đó MỘT lần cho cả nghìn lệnh',
              'Redis processes a pipeline across several threads in parallel|||Pipeline được Redis xử lý bằng nhiều luồng song song',
              'SET is buffered and not really stored yet, while PING is synchronous|||SET được ghi vào bộ đệm và chưa thật sự lưu, còn PING thì đồng bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Caching a 1.231-byte leaderboard beat Postgres by 120×. But caching a 1.192KB list cost 6,39ms for GET+parse while asking Postgres directly cost 5,38ms. What is the rule?|||Cache một bảng xếp hạng 1.231 byte nhanh hơn Postgres 120 lần. Nhưng cache một danh sách 1.192KB thì GET+parse mất 6,39ms còn hỏi thẳng Postgres chỉ 5,38ms. Quy tắc rút ra là gì?',
            options: [
              'Redis is unsuitable for large data; enable compression before writing|||Redis không phù hợp cho dữ liệu lớn, phải bật nén trước khi ghi',
              'Cache what is expensive to COMPUTE (aggregates, GROUP BY), not what is merely LARGE — once transfer and JSON.parse dominate, the cache is just an extra network hop|||Hãy cache thứ đắt để TÍNH RA (tổng hợp, GROUP BY), đừng cache thứ chỉ đơn giản là TO — khi truyền và JSON.parse chiếm ưu thế thì cache chỉ là một chặng mạng thừa',
              'Split the large payload into many small keys and use MGET|||Phải chia payload lớn thành nhiều khoá nhỏ rồi dùng MGET',
              'Postgres is faster than Redis once the table is indexed, so drop the cache|||Postgres nhanh hơn Redis khi bảng đã có chỉ mục, nên bỏ cache đi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For a 48ms query, a 90% cache hit rate produced 5,19ms per request while 99% produced 0,43ms. What follows operationally?|||Với truy vấn tốn 48ms, tỉ lệ trúng cache 90% cho ra 5,19ms/request còn 99% cho ra 0,43ms/request. Hệ quả về mặt vận hành là gì?',
            options: [
              'A 90% hit rate is already good; the remaining difference is negligible|||Tỉ lệ trúng 90% đã là tốt, chênh lệch còn lại không đáng kể',
              'The benefit is NOT linear: at 90%, one request in ten still pays the full 48ms and that one dominates the average — so alert on MISSES PER SECOND, not on hit percentage|||Lợi ích KHÔNG tuyến tính: ở mức 90%, một request trong mười vẫn trả đủ 48ms và chính nó thống trị trung bình — nên hãy đặt cảnh báo trên SỐ LẦN TRƯỢT MỖI GIÂY chứ không phải trên phần trăm trúng',
              'Raise the TTL to something very long to push the hit rate to 100%|||Phải tăng TTL lên thật dài để đẩy tỉ lệ trúng lên 100%',
              'The gap is caused by Redis rehashing its hash table when hit rates are low|||Chênh lệch đó do Redis phải rehash bảng băm khi tỉ lệ trúng thấp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A key had TTL=100. After running SET key newValue (with no EX), TTL became -1. What does that mean and how do you fix it?|||Một khoá đang có TTL=100. Sau khi chạy SET khoá giá_trị_mới (KHÔNG kèm EX), TTL trở thành -1. Điều đó nghĩa là gì và sửa thế nào?',
            options: [
              'TTL=-1 means the key was deleted; you must SET it again from scratch|||TTL=-1 nghĩa là khoá đã bị xoá; phải SET lại từ đầu',
              'TTL=-1 means the key EXISTS but has NO expiry — the SET removed the deadline and the key now lives forever. Use SET … KEEPTTL to change the value while keeping the expiry|||TTL=-1 nghĩa là khoá TỒN TẠI nhưng KHÔNG còn hạn — SET đã xoá mất hạn dùng, khoá sẽ sống mãi. Dùng SET … KEEPTTL khi muốn đổi giá trị mà giữ nguyên hạn',
              'TTL=-1 is a placeholder while Redis recomputes the deadline; it corrects itself within a second|||TTL=-1 là giá trị mặc định khi Redis chưa kịp tính lại hạn, sẽ tự đúng sau 1 giây',
              'TTL=-1 means the expiry already elapsed; call PERSIST to restore it|||TTL=-1 nghĩa là hạn đã hết; phải gọi PERSIST để khôi phục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '200 concurrent requests hitting a just-expired cache: naive cache-aside queried Postgres 200 times in 6064,6ms, while single-flight queried once in 65,3ms. Why does single-flight need no lock?|||200 request đồng thời gặp cache vừa hết hạn: cache-aside ngây thơ hỏi Postgres 200 lần mất 6064,6ms, còn single-flight hỏi 1 lần mất 65,3ms. Vì sao bản single-flight KHÔNG cần khoá?',
            options: [
              'Because a JavaScript Map has an internal lock that makes it thread-safe|||Vì Map của JavaScript có khoá nội bộ đảm bảo an toàn luồng',
              'Because the event loop is SINGLE-threaded: nothing can run between inflight.has and inflight.set. The limitation is that it collapses requests within ONE process — four Node processes means four queries|||Vì event loop chỉ có MỘT luồng: giữa inflight.has và inflight.set không có gì chen vào được. Hạn chế là nó chỉ gộp trong MỘT tiến trình — bốn tiến trình Node sẽ là bốn truy vấn',
              'Because Promises automatically de-duplicate when the same key is requested repeatedly|||Vì Promise tự khử trùng lặp khi cùng một khoá được yêu cầu nhiều lần',
              'Because Redis already blocks duplicate concurrent requests internally|||Vì Redis đã chặn sẵn các request trùng nhau bằng cơ chế nội bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A hash with 512 fields costs 10.288 bytes (listpack). Adding exactly ONE more field, making 513, costs 37.024 bytes (hashtable). What is the right way to store 1.000 fields?|||Một hash 512 trường tốn 10.288 byte (listpack). Thêm ĐÚNG MỘT trường nữa thành 513 thì tốn 37.024 byte (hashtable). Cách xử lý đúng khi bạn cần lưu 1.000 trường là gì?',
            options: [
              'Raise hash-max-listpack-entries very high so every hash stays a listpack|||Nâng hash-max-listpack-entries lên thật cao để mọi hash đều dùng listpack',
              'Split into several small hashes that stay under the threshold — 8 hashes × 125 fields cost 20.864 bytes instead of 64.296, which is 3,1× less|||Chẻ thành nhiều hash nhỏ nằm dưới ngưỡng — 8 hash × 125 trường tốn 20.864 byte thay vì 64.296 byte, ít hơn 3,1 lần',
              'Switch to a String holding JSON, because Strings are always cheaper than Hashes|||Đổi sang dùng String chứa JSON vì String luôn tiết kiệm hơn Hash',
              'Compress the values client-side before HSET to stay in listpack encoding|||Bật nén ở tầng client trước khi HSET để giữ listpack',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '500 concurrent requests against a limit of 100: the Lua version let exactly 100 through with a final counter of 500. The GET → compare in JavaScript → SET version let ALL 500 through with a final counter of 1. Why?|||500 request song song trên giới hạn 100: cách dùng Lua cho qua đúng 100 và bộ đếm cuối = 500. Cách dùng GET → so sánh trong JavaScript → SET cho qua CẢ 500 và bộ đếm cuối = 1. Vì sao?',
            options: [
              'Because the SETs overwrote each other so only the last value survived, but the check itself was still correct|||Vì SET ghi đè lên nhau nên chỉ giá trị cuối cùng được giữ, nhưng phần kiểm tra vẫn đúng',
              'Redis guarantees each INDIVIDUAL command is atomic, never your SEQUENCE of commands: all 500 read 0, all 500 concluded they were under the limit, all 500 wrote 1. Lua runs inside Redis, so the whole script is one atomic command|||Redis chỉ đảm bảo TỪNG LỆNH là nguyên tử, không đảm bảo CHUỖI lệnh của bạn: cả 500 cùng đọc 0, cùng kết luận dưới hạn, cùng ghi 1. Lua chạy bên trong Redis nên cả script là một lệnh nguyên tử',
              'Because the Node client sends commands out of order, so GET and SET got swapped|||Vì client Node gửi lệnh không theo thứ tự nên GET và SET bị đảo',
              'Because MULTI was missing, so Redis silently discarded the duplicate commands|||Vì thiếu MULTI nên Redis tự huỷ các lệnh trùng lặp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'worker-1 held a lock with a 300ms TTL but its job took 400ms. The lock expired and worker-2 acquired it. worker-1 finished, called DEL, and deleted 1 key. What is wrong?|||worker-1 giữ khoá hạn 300ms nhưng làm việc mất 400ms. Khoá tự hết hạn, worker-2 giành được. worker-1 làm xong gọi DEL và xoá được 1 khoá. Vấn đề nằm ở đâu?',
            options: [
              'Nothing is wrong — worker-1 is simply cleaning up its own lock|||Không có vấn đề gì, worker-1 chỉ đang dọn dẹp khoá của chính nó',
              'worker-1 just deleted WORKER-2&#39;s lock, leaving the critical section wide open. Write a unique token into the lock and release it with a Lua compare-and-delete in the SAME atomic step|||worker-1 vừa xoá khoá của WORKER-2 nên vùng tới hạn mở toang. Phải ghi một token duy nhất vào khoá và mở khoá bằng Lua so-sánh-rồi-xoá trong CÙNG một bước nguyên tử',
              'Just raise the lock TTL to something long, such as one hour, and the bug disappears|||Phải tăng hạn khoá lên thật dài, ví dụ 1 giờ, là hết lỗi',
              'Use SETNX instead of SET … NX so the lock never expires on its own|||Phải dùng SETNX thay cho SET … NX để khoá không tự hết hạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A Redis configured with maxmemory-policy = volatile-lru filled up and started rejecting every write with OOM, exactly like noeviction. Why?|||Một Redis đặt maxmemory-policy = volatile-lru bị đầy, và mọi lệnh ghi bắt đầu trả lỗi OOM y hệt như noeviction. Nguyên nhân là gì?',
            options: [
              'volatile-lru was removed in Redis 7; you must switch to allkeys-lru|||volatile-lru đã bị loại bỏ ở Redis 7, phải đổi sang allkeys-lru',
              'volatile-* evicts ONLY keys that have a TTL — with no key carrying one, nothing is eligible. And a single plain SET over an existing key is enough to strip its TTL|||volatile-* CHỈ trục xuất khoá CÓ TTL — nếu không khoá nào có TTL thì chẳng còn gì đủ điều kiện để vứt. Và chỉ cần một lệnh SET trơ trọi lên khoá cũ là đủ xoá mất TTL của nó',
              'maxmemory was set too low, so Redis ignores the eviction policy entirely|||Vì maxmemory được đặt quá thấp nên Redis bỏ qua chính sách trục xuất',
              'Memory fragmentation makes used_memory report a wrong figure; a restart fixes it|||Vì phân mảnh bộ nhớ làm used_memory báo sai, khởi động lại là hết',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Measured on 1 million keys: KEYS * took 343,86ms and pushed ANOTHER client&#39;s PING to 126,96ms; SCAN took 857,41ms in total but its worst PING was 6,87ms. DEL on a 1-million-field hash took 205,50ms while UNLINK took 0,37ms. What is the shared principle?|||Đo trên 1 triệu khoá: KEYS * mất 343,86ms và làm PING của client KHÁC vọt lên 126,96ms; SCAN mất tổng 857,41ms nhưng PING tệ nhất chỉ 6,87ms. DEL một hash 1 triệu trường mất 205,50ms còn UNLINK mất 0,37ms. Nguyên lý chung là gì?',
            options: [
              'SCAN and UNLINK are faster in total time, so they should always be preferred|||SCAN và UNLINK nhanh hơn về tổng thời gian nên luôn phải ưu tiên chúng',
              'Redis is SINGLE-threaded, so one long command blocks EVERY other client — optimise for other people&#39;s latency, not for the total time of your own command. SCAN is 2,5× slower and still the right choice|||Redis chạy MỘT luồng nên một lệnh dài chặn MỌI client khác — hãy tối ưu theo độ trễ của người khác chứ không theo tổng thời gian của chính lệnh đó. SCAN chậm hơn 2,5 lần mà vẫn là lựa chọn đúng',
              'Redis deliberately rate-limits KEYS and DEL to protect the server|||KEYS và DEL bị Redis giới hạn tốc độ có chủ ý để bảo vệ máy chủ',
              'It is accumulated network latency; running Redis on the same host as the app removes it|||Do độ trễ mạng dồn lại, chạy Redis trên cùng máy với ứng dụng sẽ hết',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
