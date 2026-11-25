/**
 * 10.3 — Hiệu năng: working set, cache, pool kết nối và gom ghi (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-3-hieu-nang'] (demo/s10/s10-3-hieu-nang.txt) + OUT['s10-3b-gom-ghi'] (demo/s10/s10-3b-gom-ghi.txt).
 * s10-3 khối: 0 cache mặc định mgo-lab (512 MiB vì container 2 GB) · 1 đĩa thật chứa Docker (nvme0n1) · 2 mgo-ws: RAM 768 MB, cache 0,25 GB, direct_io, trần 1.500 lần đọc/s
 * · 3 _demo/ws-nap.js 600.000 tài liệu ~874 MiB · 4 cỡ TB 1.527 byte · 5 cache rỗng sau khởi động lại · 6 ba lượt nóng 5% vs rải đều (_demo/node/tai.mjs --viec id --vung)
 * · 7 luồng ứng dụng tự đọc đĩa: ~46.000 trang, chờ tổng ~160 s · 8 mgo-ws0: 3 GB, cache 1,5 GB · 9 ba lượt rải đều: lượt 1 nguội, lượt 2–3 ≈ nóng.
 * Ghi chú đo: trên btrfs, direct_io vẫn có thể đi qua page cache của Linux ⇒ giới hạn RAM container 768 MB để page cache không chứa nổi dữ liệu (lượt chạy với 2 GB cho số dao động).
 * s10-3b khối: 0 write concern mặc định {w:"majority"} + writeConcernMajorityJournalDefault · 1 _demo/node/gom-ghi.mjs: 10.000 đơn bằng 5 cách + update từng cái vs bulkWrite + ordered.
 * Liên kết chéo: performance-load-testing perf-8-4-pool (cỡ pool), Bài 8.1 (pool driver), Bài 6.x/7.2 (write concern, rollback).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-3-hieu-nang';
const G = 's10-3b-gom-ghi';

const CACHE_CT = `Cỡ WiredTiger cache mặc định = max(50% × (RAM − 1 GB), 256 MB)
  máy 31 GB, không giới hạn  ⇒ ~15 GB
  container --memory 2g       ⇒ 50% × (2 − 1) = 0,5 GB   (mongod đọc giới hạn cgroup)
  --wiredTigerCacheSizeGB 0.25 ⇒ đặt tay
Phần RAM còn lại KHÔNG bỏ phí: page cache của Linux giữ tệp dữ liệu đã nén, kết nối (~1 MB mỗi cái), sắp xếp/aggregation trong bộ nhớ.`;

export default {
  title: '10.3 — Performance: working set, cache, connection pools and write batching|||10.3 — Hiệu năng: working set, cache, pool kết nối và gom ghi',
  slug: 'mgo-10-3-hieu-nang',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai thứ quyết định hiệu năng MongoDB nhiều hơn mọi tham số, đo thật: (1) working set so với bộ nhớ — 874 MiB dữ liệu trên một máy 768 MB, cache 0,25 GB, đĩa trần 1.500 lần đọc/giây: đọc dồn vào 5% "nóng" ~7.000 lần/s p99 ~4 ms, đọc rải đều chỉ ~1.850 lần/s p99 ~73 ms, ba lượt như một; cho cache 1,5 GB thì rải đều cũng về ~7.500/s; (2) số lần đi–về khi ghi — 10.000 đơn bằng insertOne tuần tự mất ~63 giây (mặc định w:"majority" chờ journal xuống đĩa mỗi lần), insertMany một lô chỉ ~40 ms, bulkWrite 10.000 cập nhật ~0,4 s so với ~94 s từng lệnh; ordered với ordered:false khi có lỗi giữa lô. Kèm cỡ cache mặc định và pool kết nối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Performance: working set, cache, connection pools and write batching</h2>
<p class="lead">Chapter 4 made single queries fast with indexes. This lesson is about the two things that decide performance once the indexes are right: <strong>does the data your queries touch fit in memory</strong> (the working set), and <strong>how many round trips</strong> your application makes. Both are measured here — and both produce differences of 10× to 1,000×, far more than any configuration flag.</p>

<h3>An everyday picture</h3>
<p>A librarian keeps the 50 most-borrowed books on the desk and the rest in the basement. If readers mostly ask for those 50, she answers in seconds — even if the basement holds a million books. If every reader asks for a random book, she walks to the basement every time, however fast she walks. The desk is the cache; the books people actually ask for are the working set. And if a reader returns ten books, handing them over one at a time — waiting for a receipt each time — takes ten times longer than handing over the stack.</p>

<h3>1. How big is the cache?</h3>
${lenh(K, 0)}
${ma('text', CACHE_CT)}
<p>The WiredTiger cache holds uncompressed pages of collections and indexes. By default it takes half of (RAM − 1 GB). Inside a container, mongod reads the cgroup memory limit — which is why our lab, limited to 2 GB, has a 512 MiB cache. The rest of the RAM is not wasted: Linux keeps the compressed data files in its page cache, and every connection and in-memory sort needs memory too. Don't give the cache 90% of RAM "for speed".</p>

<h3>2. An experiment: data larger than memory</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">WiredTiger cache</span><span class="lz-t">uncompressed pages, ~µs</span><span class="lz-d">hit ⇒ the hot 5% case</span></div>
  <div class="lz-step"><span class="lz-k">Linux page cache</span><span class="lz-t">compressed files in the rest of RAM</span><span class="lz-d">hides the disk if the files fit — why RAM is limited here</span></div>
  <div class="lz-step"><span class="lz-k">Disk</span><span class="lz-t">one read per missing page</span><span class="lz-d">capped at 1,500 reads/s ⇒ the spread case</span></div>
</div>
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
<p>A deliberately small machine: 768 MB of RAM, a 0.25 GB cache, and the disk limited by Docker to 1,500 reads per second — like a small cloud disk with an IOPS cap. 600,000 documents of ~1.5 KB of poorly compressible text: about 874 MiB, more than the whole machine's memory. (One honest detail: on this host's btrfs filesystem, <code>direct_io</code> still lets reads go through the Linux page cache; limiting the container's RAM is what makes the page cache too small to hide the disk.)</p>
${lenh(K, 6)}
<p>Each round runs two 8-second tests with 8 workers reading documents by <code>_id</code>: one only asks for the first 5% of documents ("hot" data — about 44 MiB, it fits in the cache), the other asks for any document. Same data, same machine, same query:</p>
<ul>
<li><strong>Hot 5%:</strong> about 7,000 reads/s, p99 about 4 ms, every round.</li>
<li><strong>Spread over everything:</strong> about 1,850 reads/s, p99 about 73 ms — every round, because there is nothing to warm up: most reads miss the cache and wait for the throttled disk.</li>
</ul>
${lenh(K, 7)}
<p>The counter you saw in Lesson 10.2 tells the story: application threads read tens of thousands of pages from disk themselves and spent a total of about 160 seconds waiting. That is time your users spent waiting.</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>The control: same disk limit, same data, but a 3 GB machine with a 1.5 GB cache — the whole dataset fits. The first round is slow (a cold cache after restart has to read everything once); rounds 2 and 3 run at about 7,500 reads/s with p99 about 4.5 ms — the same as the hot 5%. <strong>What has to fit in memory is the working set, not the total data.</strong> Two consequences: (1) design so that the working set stays small — recent orders hot, old orders cold (the bucket and archive patterns of Chapter 3, TTL, time series); (2) after a restart or failover the cache is cold, so the first minutes are slow — plan for it, and don't benchmark the first run.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — sizing by "the database is 50 GB, so we need 64 GB of RAM".</strong> If 95% of reads touch last month's 3 GB, a much smaller machine is fine; if a report scans everything every hour, even 64 GB may not be — the scan evicts the hot data. Measure the working set (cache "pages read into cache" rate, application-thread eviction) under real load instead of guessing from total size.</p>
</div>

<h3>3. Write batching: count the round trips</h3>
${lenh(G, 0)}
${lenh(G, 1)}
<p>Ten thousand orders, from Node to the lab over localhost. Read the first two lines carefully. One <code>insertOne</code> at a time takes about <strong>6 ms per order — about 160 per second</strong>. With <code>w: 1</code> it is 25 times faster. The difference is the default write concern: since MongoDB 5.0 it is <code>{ w: "majority" }</code>, and with <code>writeConcernMajorityJournalDefault: true</code> each write waits until it is in the on-disk journal of a majority. That wait is what makes an acknowledged write survive a crash (Lessons 6.3 and 7.2) — <strong>do not "fix" it by lowering the write concern</strong>; a write acknowledged with w:1 can be rolled back after a failover.</p>
<p>Fix it by sending fewer, bigger requests. 50 inserts in parallel already share the waits (about 3,500/s). <code>insertMany</code> in batches of 100 makes 100 round trips instead of 10,000 (about 13,000/s). One batch of 10,000: about 40 ms. Updates behave the same: 10,000 <code>updateOne</code> calls took about 94 seconds; one <code>bulkWrite</code> with the same 10,000 operations about 0.4 seconds — over 200×. The durability is the same; only the number of times you wait for the disk changed.</p>
<p>Two rules when batching. Keep batches moderate (hundreds to a few thousand) so a single request stays well under the 48 MB message limit and doesn't hold resources for long. And choose <code>ordered</code> deliberately: by default a batch stops at the first error (the duplicate <code>_id</code> 500 stopped it after 500 documents); with <code>ordered: false</code> it writes everything it can (999) and reports the errors. Imports usually want <code>ordered: false</code> plus a list of failures.</p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-8-1-driver-node', title: 'Lesson 8.1 — The Node.js driver and the pool', sub: 'maxPoolSize, one MongoClient per process' })}

<h3>4. Connection pools: neither too small nor too large</h3>
<p>Lesson 10.4 measured the other side: 4 concurrent workers pushed about 3,500 requests/s, 64 workers only 2,360/s with ten times the latency. A pool smaller than the useful concurrency makes requests wait for a connection; a pool much larger than what the server can run (CPUs, execution tickets) just moves the queue into the server and multiplies memory (each connection costs about 1 MB on mongod). Start from the driver default (100 in Node), measure under load, and remember that ten app instances × 100 connections is 1,000 connections to the same primary.</p>
${lienKet({ cta: 'Open lesson', khoa: 'performance-load-testing', bai: 'perf-8-4-pool', title: 'Performance course · 8.4 — Connection pool sizing by measurement', sub: 'the curve, measured, and how to choose' })}
${nguon('📘', 'MongoDB Docs — WiredTiger Storage Engine', 'cache size default: 50% of (RAM − 1 GB) or 256 MB; containers and cgroup limits', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
${nguon('📘', 'MongoDB Docs — Bulk Write Operations', 'ordered vs unordered, bulkWrite, insertMany', 'https://www.mongodb.com/docs/manual/core/bulk-write-operations/')}
${nguon('📘', 'MongoDB Docs — Default MongoDB Read Concerns/Write Concerns', 'implicit default write concern { w: "majority" }', 'https://www.mongodb.com/docs/manual/reference/mongodb-defaults/')}

<h3>🕵️ Attacker's view</h3>
<p>A working set that barely fits is fragile on purpose-built inputs too: an endpoint that lets a user page through "all orders" with a large skip, or export everything, can push the hot data out of the cache for every other user. Limit page sizes, use range-based pagination (Lesson 2.6), and put heavy exports behind authentication, rate limits and off-peak jobs.</p>

<h3>💼 On the job</h3>
<p>Two classic OJT tickets. "The nightly import of 200,000 products takes 40 minutes" — look for a loop of <code>save()</code>/<code>insertOne</code>; replace with <code>bulkWrite</code> in batches of 1,000 with <code>ordered: false</code> and you will typically report a 50–200× speed-up with the numbers above. "The app is slow every Monday morning" — look for a weekly report scanning a big collection and pushing the working set out of cache; move it to a secondary or pre-aggregate.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"What is the working set and why does it matter?"</strong> — The data and indexes your workload actually touches; if it fits in the cache, reads come from memory; if not, latency is dominated by disk. Measured: 7,000 vs 1,850 reads/s, p99 4 vs 73 ms.</li>
<li><strong>"How big is the WiredTiger cache by default, and in a container?"</strong> — max(50% × (RAM − 1 GB), 256 MB), with RAM taken from the cgroup limit in a container.</li>
<li><strong>"Inserting 10,000 documents one by one is slow. Why, and what do you do?"</strong> — Each acknowledged write waits for a round trip and, with the default majority write concern, a journal flush; batch with insertMany/bulkWrite instead of weakening the write concern.</li>
<li><strong>"ordered vs unordered bulk writes?"</strong> — Ordered stops at the first error and preserves order; unordered continues and reports all errors (and can be faster).</li>
</ol>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Compute the default cache for a 16 GB VM and for a container with <code>--memory 4g</code>.</li>
<li>In <code>gom-ghi.mjs</code>, the 50-parallel <code>insertOne</code> run sends the same 10,000 requests as the sequential run but is about 20× faster. Why, given that each one still waits for the journal?</li>
<li>Rewrite this importer: <code>for (const p of products) await col.updateOne({ sku: p.sku }, { $set: p }, { upsert: true })</code>.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. 16 GB: 50% × 15 GB = 7.5 GB. Container 4 GB: 50% × 3 GB = 1.5 GB.</p>
<p>2. The journal is flushed in groups: concurrent writes that arrive while one flush is in progress are made durable by the next flush together. Sequential code pays a full wait per write; parallel writes share the waits — batching does the same more cheaply, with one request.</p>
<p>3. <code>for (let i = 0; i &lt; products.length; i += 1000) await col.bulkWrite(products.slice(i, i + 1000).map((p) =&gt; ({ updateOne: { filter: { sku: p.sku }, update: { $set: p }, upsert: true } })), { ordered: false });</code> — plus a unique index on <code>sku</code> so concurrent upserts can't create duplicates, and logging of <code>writeErrors</code>.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Working set', 'The data and index pages a workload actually touches in a period.'],
  ['WiredTiger cache', 'In-memory cache of uncompressed pages; default max(50% × (RAM − 1 GB), 256 MB).'],
  ['Cold / warm cache', 'Empty after restart, so the first reads go to disk / holding the working set.'],
  ['Round trip', 'One request–response between application and server; each costs network time plus the write-concern wait.'],
  ['insertMany / bulkWrite', 'Send many writes in one request; ordered (stop at first error) or unordered.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Keep the working set in memory: hot vs spread reads differ several-fold in throughput and ~18× in p99 on the same data.</li>
<li>The default cache depends on RAM (and the container limit); the rest of RAM is used too.</li>
<li>Batch writes instead of lowering the write concern: one batch vs one-by-one was over 1,000× faster for inserts.</li>
<li>Pools: start from the default, measure; more connections than the server can run only add queueing.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Hiệu năng: working set, cache, pool kết nối và gom ghi</h2>
<p class="lead">Chương 4 làm từng truy vấn nhanh bằng index. Bài này nói về hai thứ quyết định hiệu năng khi index đã đúng: <strong>dữ liệu mà truy vấn chạm tới có vừa bộ nhớ không</strong> (working set), và <strong>ứng dụng đi–về với máy chủ bao nhiêu lần</strong>. Cả hai đều được đo ở đây, và cả hai tạo ra chênh lệch từ 10 tới hơn 1.000 lần, lớn hơn nhiều so với bất kỳ tham số cấu hình nào.</p>

<h3>Hình ảnh đời thường</h3>
<p>Cô thủ thư để 50 cuốn sách được mượn nhiều nhất trên bàn, còn lại cất dưới tầng hầm. Nếu bạn đọc chủ yếu hỏi 50 cuốn đó, cô trả lời trong vài giây, dù tầng hầm chứa cả triệu cuốn. Nếu bạn đọc nào cũng hỏi một cuốn ngẫu nhiên, lần nào cô cũng phải xuống hầm, đi nhanh cỡ nào cũng vậy. Cái bàn là cache; những cuốn người ta thật sự hỏi là working set. Còn nếu một bạn đọc trả mười cuốn, đưa từng cuốn một và chờ biên nhận mỗi lần thì lâu gấp mười lần so với đưa cả chồng.</p>

<h3>1. Cache lớn cỡ nào?</h3>
${lenh(K, 0)}
${ma('text', CACHE_CT)}
<p>WiredTiger cache giữ các trang đã giải nén của collection và index. Mặc định nó lấy một nửa của (RAM − 1 GB). Trong container, mongod đọc giới hạn bộ nhớ của cgroup, vì thế lab của ta, giới hạn 2 GB, có cache 512 MiB. Phần RAM còn lại không bị bỏ phí: Linux giữ các tệp dữ liệu đã nén trong page cache, và mỗi kết nối, mỗi lần sắp xếp trong bộ nhớ cũng cần RAM. Đừng cho cache 90% RAM "cho nhanh".</p>

<h3>2. Thí nghiệm: dữ liệu lớn hơn bộ nhớ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">WiredTiger cache</span><span class="lz-t">trang đã giải nén, cỡ micro giây</span><span class="lz-d">trúng ⇒ trường hợp 5% nóng</span></div>
  <div class="lz-step"><span class="lz-k">Page cache của Linux</span><span class="lz-t">tệp đã nén trong phần RAM còn lại</span><span class="lz-d">che được ổ đĩa nếu tệp vừa — vì thế ở đây phải giới hạn RAM</span></div>
  <div class="lz-step"><span class="lz-k">Ổ đĩa</span><span class="lz-t">mỗi trang thiếu là một lần đọc</span><span class="lz-d">trần 1.500 lần đọc/s ⇒ trường hợp rải đều</span></div>
</div>
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
<p>Một máy cố tình nhỏ: RAM 768 MB, cache 0,25 GB, và ổ đĩa bị Docker giới hạn 1.500 lần đọc mỗi giây, giống một ổ đĩa đám mây nhỏ có trần IOPS. 600.000 tài liệu, mỗi cái ~1,5 KB chữ khó nén: khoảng 874 MiB, lớn hơn toàn bộ bộ nhớ của máy. (Một chi tiết trung thực: trên hệ thống tệp btrfs của máy này, <code>direct_io</code> vẫn để lượt đọc đi qua page cache của Linux; chính việc giới hạn RAM của container làm page cache quá nhỏ, không che được ổ đĩa nữa.)</p>
${lenh(K, 6)}
<p>Mỗi lượt chạy hai phép đo 8 giây với 8 luồng đọc tài liệu theo <code>_id</code>: một phép chỉ hỏi 5% tài liệu đầu (dữ liệu "nóng", khoảng 44 MiB, vừa cache), phép kia hỏi bất kỳ tài liệu nào. Cùng dữ liệu, cùng máy, cùng truy vấn:</p>
<ul>
<li><strong>5% nóng:</strong> khoảng 7.000 lần đọc/s, p99 khoảng 4 ms, lượt nào cũng vậy.</li>
<li><strong>Rải đều khắp nơi:</strong> khoảng 1.850 lần đọc/s, p99 khoảng 73 ms, lượt nào cũng vậy, vì chẳng có gì để "làm nóng": phần lớn lượt đọc trượt cache và phải chờ ổ đĩa bị giới hạn.</li>
</ul>
${lenh(K, 7)}
<p>Bộ đếm bạn đã gặp ở Bài 10.2 kể lại câu chuyện: các luồng của ứng dụng đã tự đọc hàng chục nghìn trang từ đĩa và tổng cộng chờ khoảng 160 giây. Đó là thời gian người dùng của bạn phải chờ.</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>Phép đối chứng: cùng giới hạn đĩa, cùng dữ liệu, nhưng máy 3 GB với cache 1,5 GB, cả bộ dữ liệu vừa vào. Lượt đầu chậm (cache nguội sau khởi động phải đọc mọi thứ một lần); lượt 2 và 3 chạy khoảng 7.500 lần đọc/s, p99 khoảng 4,5 ms, ngang với 5% nóng. <strong>Thứ phải vừa bộ nhớ là working set, không phải tổng dữ liệu.</strong> Hai hệ quả: (1) thiết kế sao cho working set nhỏ: đơn gần đây thì nóng, đơn cũ thì nguội (mẫu bucket và lưu trữ của Chương 3, TTL, time series); (2) sau khi khởi động lại hay chuyển dự phòng, cache nguội nên vài phút đầu chậm: hãy tính trước, và đừng lấy lượt đo đầu tiên làm kết quả.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tính cỡ máy kiểu "database 50 GB nên cần 64 GB RAM".</strong> Nếu 95% lượt đọc chỉ chạm vào 3 GB của tháng trước, một máy nhỏ hơn nhiều vẫn ổn. Nếu mỗi giờ có một báo cáo quét toàn bộ, thì 64 GB có khi cũng không đủ: lượt quét đẩy dữ liệu nóng ra khỏi cache. Hãy đo working set (tốc độ "pages read into cache", luồng ứng dụng phải tự dọn) dưới tải thật thay vì đoán từ tổng dung lượng.</p>
</div>

<h3>3. Gom ghi: đếm số lần đi–về</h3>
${lenh(G, 0)}
${lenh(G, 1)}
<p>Mười nghìn đơn, từ Node tới lab qua localhost. Đọc kỹ hai dòng đầu. Mỗi lần một <code>insertOne</code> mất khoảng <strong>6 ms mỗi đơn, tức khoảng 160 đơn mỗi giây</strong>. Với <code>w: 1</code> thì nhanh gấp 25 lần. Chênh lệch nằm ở write concern mặc định: từ MongoDB 5.0 nó là <code>{ w: "majority" }</code>, và với <code>writeConcernMajorityJournalDefault: true</code>, mỗi lần ghi phải chờ tới khi nó nằm trong journal trên đĩa của đa số thành viên. Chính lần chờ đó giúp một lần ghi đã được xác nhận sống sót qua sự cố (Bài 6.3 và 7.2). <strong>Đừng "sửa" bằng cách hạ write concern</strong>: một lần ghi xác nhận với w:1 có thể bị rollback sau khi chuyển dự phòng.</p>
<p>Hãy sửa bằng cách gửi ít request hơn mà mỗi cái to hơn. 50 lần insert song song đã chia nhau các lần chờ (khoảng 3.500/s). <code>insertMany</code> theo lô 100 đi–về 100 lần thay vì 10.000 (khoảng 13.000/s). Một lô 10.000: khoảng 40 ms. Cập nhật cũng vậy: 10.000 lần gọi <code>updateOne</code> mất khoảng 94 giây; một <code>bulkWrite</code> với đúng 10.000 thao tác đó mất khoảng 0,4 giây, nhanh hơn 200 lần. Độ bền vẫn như cũ; chỉ có số lần chờ đĩa là thay đổi.</p>
<p>Hai luật khi gom lô. Giữ cỡ lô vừa phải (vài trăm tới vài nghìn) để mỗi request còn xa giới hạn thông điệp 48 MB và không giữ tài nguyên quá lâu. Và chọn <code>ordered</code> có chủ ý: mặc định một lô dừng ở lỗi đầu tiên (<code>_id</code> 500 trùng làm nó dừng sau 500 tài liệu); với <code>ordered: false</code> nó ghi mọi thứ ghi được (999) rồi báo các lỗi. Việc nhập dữ liệu thường muốn <code>ordered: false</code> kèm danh sách lỗi.</p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-8-1-driver-node', title: 'Bài 8.1 — Driver Node.js và pool', sub: 'maxPoolSize, mỗi tiến trình một MongoClient' })}

<h3>4. Pool kết nối: không quá nhỏ, không quá lớn</h3>
<p>Bài 10.4 đo phía còn lại: 4 luồng đồng thời đẩy được khoảng 3.500 request/s, 64 luồng chỉ 2.360/s với độ trễ gấp mười. Pool nhỏ hơn mức đồng thời có ích thì request phải chờ kết nối; pool lớn hơn nhiều so với mức máy chủ chạy được (CPU, vé thực thi) chỉ chuyển hàng đợi vào trong máy chủ và nhân bộ nhớ lên (mỗi kết nối tốn khoảng 1 MB trên mongod). Bắt đầu từ mặc định của driver (100 với Node), đo dưới tải, và nhớ rằng mười instance ứng dụng × 100 kết nối là 1.000 kết nối vào cùng một primary.</p>
${lienKet({ khoa: 'performance-load-testing', bai: 'perf-8-4-pool', title: 'Khoá Performance · 8.4 — Chọn cỡ connection pool bằng phép đo', sub: 'đường cong, đo thật, và cách chọn' })}
${nguon('📘', 'MongoDB Docs — WiredTiger Storage Engine', 'cỡ cache mặc định: 50% của (RAM − 1 GB) hoặc 256 MB; container và giới hạn cgroup', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
${nguon('📘', 'MongoDB Docs — Bulk Write Operations', 'ordered và unordered, bulkWrite, insertMany', 'https://www.mongodb.com/docs/manual/core/bulk-write-operations/')}
${nguon('📘', 'MongoDB Docs — Default MongoDB Read Concerns/Write Concerns', 'write concern mặc định ngầm { w: "majority" }', 'https://www.mongodb.com/docs/manual/reference/mongodb-defaults/')}

<h3>🕵️ Góc hacker</h3>
<p>Một working set vừa khít cũng mong manh trước những đầu vào cố ý: một endpoint cho người dùng lật trang "mọi đơn hàng" với skip lớn, hay xuất toàn bộ dữ liệu, có thể đẩy dữ liệu nóng ra khỏi cache của mọi người dùng khác. Hãy giới hạn cỡ trang, phân trang theo khoảng (Bài 2.6), và đặt các lần xuất nặng sau xác thực, giới hạn tốc độ và tác vụ chạy giờ thấp điểm.</p>

<h3>💼 Đi làm</h3>
<p>Hai ticket OJT kinh điển. "Lần nhập 200.000 sản phẩm mỗi đêm mất 40 phút": hãy tìm một vòng lặp <code>save()</code>/<code>insertOne</code>, thay bằng <code>bulkWrite</code> theo lô 1.000 với <code>ordered: false</code>, và thường bạn sẽ báo cáo nhanh hơn 50–200 lần với số liệu như trên. "Sáng thứ Hai nào ứng dụng cũng chậm": hãy tìm một báo cáo hằng tuần quét collection lớn, đẩy working set ra khỏi cache; chuyển nó sang secondary hoặc tính sẵn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Working set là gì, vì sao quan trọng?"</strong> — Phần dữ liệu và index mà tải thật sự chạm tới; vừa cache thì đọc từ bộ nhớ, không vừa thì độ trễ do ổ đĩa quyết định. Đo thật: 7.000 với 1.850 lần đọc/s, p99 4 với 73 ms.</li>
<li><strong>"WiredTiger cache mặc định lớn cỡ nào, trong container thì sao?"</strong> — max(50% × (RAM − 1 GB), 256 MB), trong container thì RAM lấy theo giới hạn cgroup.</li>
<li><strong>"Insert 10.000 tài liệu từng cái một thì chậm. Vì sao, làm gì?"</strong> — Mỗi lần ghi được xác nhận phải chờ một lần đi–về và, với write concern majority mặc định, một lần đẩy journal xuống đĩa; gom lô bằng insertMany/bulkWrite thay vì hạ write concern.</li>
<li><strong>"Bulk write ordered khác unordered thế nào?"</strong> — Ordered dừng ở lỗi đầu tiên và giữ thứ tự; unordered chạy tiếp và báo mọi lỗi (và có thể nhanh hơn).</li>
</ol>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Tính cache mặc định cho một VM 16 GB và cho một container <code>--memory 4g</code>.</li>
<li>Trong <code>gom-ghi.mjs</code>, lượt 50 <code>insertOne</code> song song gửi đúng 10.000 request như lượt tuần tự mà nhanh hơn khoảng 20 lần. Vì sao, khi mỗi request vẫn chờ journal?</li>
<li>Viết lại đoạn nhập dữ liệu này: <code>for (const p of products) await col.updateOne({ sku: p.sku }, { $set: p }, { upsert: true })</code>.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. 16 GB: 50% × 15 GB = 7,5 GB. Container 4 GB: 50% × 3 GB = 1,5 GB.</p>
<p>2. Journal được đẩy xuống đĩa theo nhóm: các lần ghi đồng thời tới trong lúc một lần đẩy đang chạy sẽ cùng được lần đẩy kế tiếp làm bền. Mã tuần tự trả trọn một lần chờ cho mỗi lần ghi; ghi song song chia nhau các lần chờ. Gom lô làm cùng việc đó rẻ hơn, chỉ bằng một request.</p>
<p>3. <code>for (let i = 0; i &lt; products.length; i += 1000) await col.bulkWrite(products.slice(i, i + 1000).map((p) =&gt; ({ updateOne: { filter: { sku: p.sku }, update: { $set: p }, upsert: true } })), { ordered: false });</code> — cộng một index unique trên <code>sku</code> để các upsert đồng thời không tạo bản trùng, và ghi log <code>writeErrors</code>.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Working set', 'Các trang dữ liệu và index mà tải thật sự chạm tới trong một khoảng thời gian.'],
  ['WiredTiger cache', 'Bộ đệm trong bộ nhớ chứa trang đã giải nén; mặc định max(50% × (RAM − 1 GB), 256 MB).'],
  ['Cache nguội / ấm', 'Rỗng sau khởi động lại nên lượt đọc đầu phải xuống đĩa / đang giữ working set.'],
  ['Lần đi–về (round trip)', 'Một cặp request–response giữa ứng dụng và máy chủ; mỗi lần tốn thời gian mạng cộng thời gian chờ write concern.'],
  ['insertMany / bulkWrite', 'Gửi nhiều lần ghi trong một request; ordered (dừng ở lỗi đầu) hoặc unordered.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Giữ working set trong bộ nhớ: đọc nóng và đọc rải đều trên cùng dữ liệu chênh vài lần về thông lượng và ~18 lần về p99.</li>
<li>Cache mặc định phụ thuộc RAM (và giới hạn container); phần RAM còn lại cũng được dùng.</li>
<li>Gom ghi thay vì hạ write concern: một lô so với từng cái nhanh hơn trên 1.000 lần khi insert.</li>
<li>Pool: bắt đầu từ mặc định, đo; nhiều kết nối hơn mức máy chủ chạy được chỉ thêm xếp hàng.</li>
</ul>
</div>
`,
};
