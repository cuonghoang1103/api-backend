/**
 * 7.5 — Chọn shard key: số giá trị, tần suất, khoá tăng dần (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-5-shard-key'] — cụm ba shard của Bài 7.4 (MongoDB 8.0.38), dữ liệu ../_demo/shard/don-shard.js.
 * Số tất định: analyzeShardKey vung 3 giá trị / ngay tăng dần (monotonic) / khachId 5000 / {khachId, ngay} 200000 không tăng dần;
 * 20.000 đơn mới: shard theo ngay ⇒ +20000 vào MỘT shard, hashed ⇒ rải ba shard; shard theo vung ⇒ ba range JUMBO dồn hết sh1, HCM=60135 không cắt được
 * (CannotSplit "chunk is indivisible"); reshardCollection → {vung, khachId} ~36 s (lab hạ reshardingMinimumOperationDurationMillis 300000 → 5000) ⇒ ~40k mỗi shard;
 * zone BAC/NAM/TRUNG ⇒ sau ~80 s đúng HN=39842 sh1, HCM=60135 sh2, DN=20023 sh3; truy vấn vung=HN chạm thêm shard giữ range kề (trả 0).
 * Kiểm trùng: consistent hashing / rebalance ở distributed-systems 4.2–4.3 ⇒ liên kết.
 */
import { lenh, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's07-5-shard-key';

const GIAI_EN = `<p>1. <code>{ sellerId: 1 }</code> alone: medium cardinality, but the flash sale makes one value carry most writes — one shard, one jumbo range. <code>{ createdAt: 1 }</code>: monotonic — every new order on the last range. <code>{ _id: 'hashed' }</code>: perfect write spread, but "orders of seller X this week" becomes scatter-gather. A good compromise: <code>{ sellerId: 1, _id: 1 }</code> (or <code>{ sellerId: 'hashed', ... }</code> if sellers are fine-grained): queries by seller stay targeted, and one big seller's orders can still be split into many ranges by the second field. Check it with <code>analyzeShardKey</code> on a copy of real data before deciding.</p>
<p>2. Low cardinality: three values can never be more than three ranges, so a fourth shard gets nothing and the HCM range cannot be split or moved (jumbo). Fix: <code>refineCollectionShardKey</code> to add a suffix (<code>{ vung: 1, khachId: 1 }</code>) — cheap, keeps existing ranges — or <code>reshardCollection</code> to a completely new key, which rewrites the whole collection (36 s for 120,000 orders in the lab; hours for terabytes, and it needs free disk for a full copy).</p>
<p>3. Shard key <code>{ vung: 1, khachId: 1 }</code>, zones <code>BAC</code>/<code>NAM</code> on shards located in each region, <code>updateZoneKeyRange</code> for each region's key range. Queries that include <code>vung</code> stay in the region; the balancer keeps the documents there; a customer who moves region needs their documents' <code>vung</code> updated (a shard-key change, allowed since 4.2 inside a transaction or retryable write).</p>`;

const GIAI_VI = `<p>1. Chỉ <code>{ sellerId: 1 }</code>: số giá trị vừa phải, nhưng đợt flash sale làm một giá trị gánh gần hết lệnh ghi — một shard, một range jumbo. <code>{ createdAt: 1 }</code>: tăng dần — mọi đơn mới vào range cuối. <code>{ _id: 'hashed' }</code>: rải ghi hoàn hảo, nhưng "đơn của người bán X tuần này" thành phát tán. Thoả hiệp tốt: <code>{ sellerId: 1, _id: 1 }</code> (hoặc <code>{ sellerId: 'hashed', ... }</code> nếu người bán chia nhỏ được): truy vấn theo người bán vẫn nhắm đích, và đơn của một người bán lớn vẫn cắt được thành nhiều range nhờ trường thứ hai. Kiểm bằng <code>analyzeShardKey</code> trên bản sao dữ liệu thật trước khi quyết.</p>
<p>2. Ít giá trị: ba giá trị không bao giờ thành nhiều hơn ba range, nên shard thứ tư chẳng nhận được gì và range HCM không cắt cũng không dời được (jumbo). Sửa: <code>refineCollectionShardKey</code> để thêm trường đuôi (<code>{ vung: 1, khachId: 1 }</code>) — rẻ, giữ các range cũ — hoặc <code>reshardCollection</code> sang khoá mới hẳn, viết lại toàn bộ collection (36 s cho 120.000 đơn ở lab; hàng giờ cho nhiều terabyte, và cần đĩa trống đủ một bản sao đầy đủ).</p>
<p>3. Shard key <code>{ vung: 1, khachId: 1 }</code>, zone <code>BAC</code>/<code>NAM</code> trên các shard đặt ở từng vùng, <code>updateZoneKeyRange</code> cho khoảng khoá của mỗi vùng. Truy vấn có <code>vung</code> ở lại trong vùng; balancer giữ tài liệu ở đó; khách chuyển vùng thì phải cập nhật <code>vung</code> trong tài liệu của họ (đổi giá trị shard key, được phép từ 4.2 trong transaction hoặc lệnh ghi retryable).</p>`;

export default {
  title: '7.5 — Choosing a shard key: cardinality, frequency, monotonic keys|||7.5 — Chọn shard key: số giá trị, tần suất, khoá tăng dần',
  slug: 'mgo-7-5-shard-key',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Shard key quyết định cả cụm chạy tốt hay tệ. Đo bốn ứng viên bằng analyzeShardKey (MongoDB 7.0+); khoá tăng dần dồn 20.000 đơn mới vào MỘT shard còn khoá băm rải đều; khoá ba giá trị sinh range JUMBO không cắt, không dời được; đổi shard key khi đang chạy bằng reshardCollection; zone giữ dữ liệu miền Bắc/Nam/Trung trên đúng shard của miền đó — và vì sao truy vấn vẫn chạm thêm một shard trả 0 tài liệu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Choosing a shard key: cardinality, frequency, monotonic keys</h2>
<p class="lead">Every property of a sharded cluster — how evenly it fills, which queries are cheap, whether adding a shard helps — follows from one decision: the <strong>shard key</strong>. Lesson 7.4 used two keys without asking whether they were good. This lesson measures candidates with <code>analyzeShardKey</code>, then shows the three classic mistakes in action — a key that always grows, a key with too few values, a key with one very popular value — and the two tools for fixing a bad choice while the cluster runs.</p>

<h3>An everyday picture: sorting post into pigeonholes</h3>
<p>A post office sorts letters into pigeonholes, one per clerk. Sort by <em>province</em> and there are only 63 holes, the Hồ Chí Minh City hole overflows and nobody can split it. Sort by <em>date received</em> and every new letter goes into today's hole: one clerk works, the others watch. Sort by <em>a hash of the address</em> and the letters spread perfectly — but "all letters for my street" means checking every hole. A good sorting key has many possible values, no single value that is too common, and does not pile new items in one place — and it matches the question people ask most.</p>

<h3>Measure before you choose: analyzeShardKey</h3>
<p>Since MongoDB 7.0, <code>analyzeShardKey</code> computes the characteristics of a candidate key on existing data (it needs an index that starts with the key). Four candidates for the orders:</p>
${lenh(K, 0)}
<table>
<thead><tr><th>Candidate</th><th>Cardinality</th><th>Frequency</th><th>Monotonic</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td><code>vung</code></td><td>3</td><td>one value holds most orders</td><td>no</td><td>never more than 3 ranges — jumbo</td></tr>
<tr><td><code>ngay</code></td><td>every order</td><td>tiny</td><td><strong>yes</strong></td><td>all new writes on one shard</td></tr>
<tr><td><code>khachId</code></td><td>5,000</td><td>a wholesale customer holds hundreds</td><td>no</td><td>usable; hot customers limit it</td></tr>
<tr><td><code>khachId, ngay</code></td><td>every order</td><td>tiny</td><td>no</td><td>targets per-customer queries, splits big customers</td></tr>
</tbody>
</table>
<p>The numbers are estimates computed by the server (with <code>readWriteDistribution: true</code> and <code>configureQueryAnalyzer</code> it can also sample your real queries and report how many would be targeted). Three properties, three questions: how many distinct values can the key take (<strong>cardinality</strong>), how often does the most common value appear (<strong>frequency</strong>), and do new values always grow (<strong>monotonicity</strong>)? And a fourth that no command can answer for you: do your most frequent queries contain it?</p>
${nguon('📘', 'analyzeShardKey — MongoDB Docs', 'New in 7.0: cardinality, frequency, monotonicity of a candidate key; optional read/write distribution from sampled queries', 'https://www.mongodb.com/docs/manual/reference/command/analyzeShardKey/')}

<h3>Mistake 1: a key that always grows</h3>
${lenh(K, 1)}
<p>Twenty thousand new orders. Sharded by <code>ngay</code> (range), all 20,000 went to <em>one</em> shard — the one owning the range up to MaxKey — because every new date is larger than every old one. The other two shards received nothing; the balancer will move ranges later, after the fact, costing extra I/O. Sharded by a hash, the same orders split across the three shards. The same happens with <code>ObjectId</code> <code>_id</code> (it starts with a timestamp), auto-increment counters and timestamps: as range keys they create a <strong>hot shard</strong> that takes all inserts. Either hash them, or put a non-monotonic field first (<code>{ khachId: 1, ngay: 1 }</code>).</p>

<h3>Mistake 2: a key with too few values</h3>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>Three values, three ranges — all flagged <strong>JUMBO</strong> and all still on sh1 after forty seconds of balancing: a range larger than the range size that cannot be split cannot be moved either. MongoDB refuses to split "between" two documents with the same key value: "chunk is indivisible". The HCM range holds 60,135 orders, half the collection, and it will grow on one shard forever. Adding shards does not help — there is nothing to give them.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "status" or "type" as a shard key.</strong> Fields with a handful of values (status, country, category, boolean flags) look natural because many queries filter on them. As the <em>first</em> field of a shard key they cap the number of useful ranges at the number of values. If you need them for targeting, put them first and add a high-cardinality field after them.</p>
</div>

<h3>Fix while running: reshardCollection</h3>
<p>Since 5.0 you can change the shard key of a live collection. MongoDB copies every document into a new collection partitioned by the new key, keeps applying writes made meanwhile, then switches over in a short critical section. It has a minimum duration of five minutes by default so that it does not start and finish while the cluster is busy; the lab lowers it to five seconds:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
<p>About 36 seconds for 120,000 orders, and the collection is now split about 40,000 per shard. On a real collection of hundreds of gigabytes this is hours, it needs free disk for a full second copy on each recipient shard, and writes are blocked for up to two seconds at the end. If you only need to <em>add</em> fields at the end of the key, <code>refineCollectionShardKey</code> (4.4+) is much cheaper: it changes metadata, and the existing ranges stay valid.</p>
${nguon('📘', 'Reshard a Collection — MongoDB Docs', 'reshardCollection (5.0+): copies data by the new key, applies ongoing writes, short write-blocking critical section; disk and duration requirements', 'https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/')}

<h3>Zones: keep data in its region</h3>
<p>A shard key that starts with the region allows <strong>zones</strong>: tag each shard with a zone and assign key ranges to zones; the balancer then keeps each range on a shard of its zone. Uses: data residency (customers' data stays in the country where the law requires it), latency (Northern customers on servers in Hà Nội), or tiering (old orders on cheaper hardware).</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>About eighty seconds later the distribution matches the regions exactly: sh1 holds the 39,842 HN orders, sh2 the 60,135 HCM orders, sh3 the 20,023 DN orders.</p>
${lenh(K, 10)}
${lenh(K, 11)}
<p>One surprise worth understanding: the HN query is still sent to two shards, and sh3 returns 0 documents. The zone range for HN ends exactly at <code>{ vung: 'HN', khachId: MaxKey }</code>, and the next range — the empty space after HN, which belongs to no zone — sits on sh3. The query's bounds include that boundary point, so mongos asks sh3 too. Routing follows <em>ranges in the routing table</em>, not where documents happen to be. Here it costs one empty round trip; it is a reminder to read <code>explain()</code> instead of assuming.</p>
${nguon('📘', 'Zones — MongoDB Docs', 'Associate shards with zones and shard-key ranges with zones; the balancer keeps ranges on shards of their zone', 'https://www.mongodb.com/docs/manual/core/zone-sharding/')}

<h3>A checklist for choosing</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · queries</span><span class="lz-t">list the 5 most frequent queries and writes</span><span class="lz-d">the key should appear in most of them</span></div>
  <div class="lz-step"><span class="lz-k">2 · cardinality</span><span class="lz-t">far more values than shards you will ever have</span><span class="lz-d">add a second field if the first has few values</span></div>
  <div class="lz-step"><span class="lz-k">3 · frequency</span><span class="lz-t">no single value with a large share of documents</span><span class="lz-d">hot customers, default values, null</span></div>
  <div class="lz-step"><span class="lz-k">4 · monotonic</span><span class="lz-t">increasing values ⇒ hash them, or not first</span><span class="lz-d">ObjectId, timestamps, counters</span></div>
  <div class="lz-step"><span class="lz-k">5 · measure</span><span class="lz-t">analyzeShardKey on real data</span><span class="lz-d">then explain() your top queries on a staging cluster</span></div>
</div>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-4-2-consistent-hashing', title: 'Distributed Systems 4.2 — Consistent hashing and virtual nodes', sub: 'How other systems spread keys over nodes, and why adding a node moves only part of the data' })}

<h3>💼 At work: the flash sale and the seller key</h3>
<p>A marketplace shards orders by <code>sellerId</code> because every seller dashboard filters by seller. It works for a year. Then one big seller runs a midnight flash sale: 80% of all orders for two hours have the same <code>sellerId</code>, so they all go to one shard, and that seller's range grows past the range size and becomes jumbo — the balancer cannot move it. The other shards are idle while one burns. The post-incident change: <code>refineCollectionShardKey</code> to <code>{ sellerId: 1, _id: 1 }</code> so a big seller's orders can be split into many ranges, and a pre-split plus a zone for known big sellers before the next campaign. In an OJT team, the useful habit is to ask "what happens on our biggest day?" when someone proposes a shard key — not only "is it in our queries?".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What makes a good shard key?"</strong> — High cardinality, low frequency of any single value, not monotonically increasing (or hashed), and present in the most frequent queries.</li>
<li><strong>"Why is an ObjectId _id a bad range shard key?"</strong> — It grows with time, so every insert goes to the last range on one shard; hash it or lead with another field.</li>
<li><strong>"What is a jumbo chunk?"</strong> — A range bigger than the range size that cannot be split (one key value) and therefore cannot be migrated.</li>
<li><strong>"Can you change a shard key?"</strong> — Yes: refineCollectionShardKey adds suffix fields (4.4+), reshardCollection rewrites with a new key (5.0+, costly), unshardCollection (8.0+).</li>
<li><strong>"Hashed or ranged?"</strong> — Hashed spreads writes and breaks range queries; ranged keeps range queries targeted and risks hot spots.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>A marketplace with 20,000 sellers; the busiest queries are "orders of seller X, newest first" and "order by id"; one seller runs flash sales with 80% of traffic for two hours. Evaluate <code>{ sellerId: 1 }</code>, <code>{ createdAt: 1 }</code>, <code>{ _id: 'hashed' }</code>, and propose a key.</li>
<li>Explain from the lab output why <code>don_vung</code> sharded on <code>{ vung: 1 }</code> stayed entirely on sh1, and give two ways to fix it, with their costs.</li>
<li>The law requires Vietnamese customers' data to stay on servers in Vietnam, Singapore customers' data in Singapore. Design the shard key and zones.</li>
</ol>
${loiGiai('Suggested answers', GIAI_EN)}
<p><strong>Done when:</strong> you can predict, before running it, where 20,000 new orders will land for a given shard key — and you have changed a shard key on a live collection.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Shard key', 'The field(s) that decide which range — and therefore which shard — a document belongs to.'],
  ['Cardinality', 'How many distinct values the key can take; caps the number of useful ranges.'],
  ['Frequency', 'How often the most common value appears; a very common value makes one range hot and jumbo.'],
  ['Monotonic key', 'A key whose new values always increase (ObjectId, time); as a range key it creates a hot shard.'],
  ['Jumbo range', 'A range over the range size that cannot be split, and so cannot be moved by the balancer.'],
  ['analyzeShardKey', '7.0+ command measuring cardinality, frequency, monotonicity and (optionally) query targeting of a candidate key.'],
  ['reshardCollection / refine', 'Rewrite a collection under a new shard key (5.0+) / add suffix fields to the key cheaply (4.4+).'],
  ['Zone', 'A tag on shards plus key ranges assigned to it; the balancer keeps those ranges on those shards.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Choose the shard key from your most frequent queries, then check cardinality, frequency and monotonicity.</li>
<li>Monotonic range keys send all new writes to one shard; hash them or lead with another field.</li>
<li>Few values ⇒ few ranges ⇒ jumbo; add a high-cardinality suffix.</li>
<li>Bad choices can be fixed live (refine, reshard) but resharding rewrites everything — measure first with analyzeShardKey.</li>
<li>Zones keep data in a region; routing follows ranges, so read explain().</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Chọn shard key: số giá trị, tần suất, khoá tăng dần</h2>
<p class="lead">Mọi đặc tính của một cụm shard — đầy có đều không, truy vấn nào rẻ, thêm shard có giúp gì không — đều xuất phát từ một quyết định: <strong>shard key</strong>. Bài 7.4 đã dùng hai khoá mà không hỏi chúng có tốt không. Bài này đo các ứng viên bằng <code>analyzeShardKey</code>, rồi cho thấy ba lỗi kinh điển khi chạy thật — khoá luôn tăng, khoá quá ít giá trị, khoá có một giá trị quá phổ biến — và hai công cụ để sửa lựa chọn sai trong lúc cụm vẫn chạy.</p>

<h3>Hình ảnh đời thường: chia thư vào các ngăn</h3>
<p>Bưu cục chia thư vào các ngăn, mỗi nhân viên một ngăn. Chia theo <em>tỉnh</em> thì chỉ có 63 ngăn, ngăn TP.HCM tràn và không ai tách nó ra được. Chia theo <em>ngày nhận</em> thì mọi thư mới vào ngăn hôm nay: một người làm, những người khác ngồi nhìn. Chia theo <em>mã băm của địa chỉ</em> thì thư rải đều hoàn hảo — nhưng "mọi thư của phố tôi" nghĩa là phải lục mọi ngăn. Khoá chia tốt có rất nhiều giá trị, không giá trị nào quá phổ biến, không dồn đồ mới về một chỗ — và khớp với câu hỏi người ta hỏi nhiều nhất.</p>

<h3>Đo trước khi chọn: analyzeShardKey</h3>
<p>Từ MongoDB 7.0, <code>analyzeShardKey</code> tính các đặc tính của một khoá ứng viên trên dữ liệu đang có (cần một index bắt đầu bằng khoá đó). Bốn ứng viên cho đơn hàng:</p>
${lenh(K, 0)}
<table>
<thead><tr><th>Ứng viên</th><th>Số giá trị</th><th>Tần suất</th><th>Tăng dần</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td><code>vung</code></td><td>3</td><td>một giá trị chiếm phần lớn số đơn</td><td>không</td><td>không bao giờ quá 3 range — jumbo</td></tr>
<tr><td><code>ngay</code></td><td>mỗi đơn một giá trị</td><td>rất nhỏ</td><td><strong>có</strong></td><td>mọi lệnh ghi mới vào một shard</td></tr>
<tr><td><code>khachId</code></td><td>5.000</td><td>một khách sỉ chiếm hàng trăm đơn</td><td>không</td><td>dùng được; khách nóng là giới hạn</td></tr>
<tr><td><code>khachId, ngay</code></td><td>mỗi đơn một giá trị</td><td>rất nhỏ</td><td>không</td><td>nhắm đích truy vấn theo khách, cắt được khách lớn</td></tr>
</tbody>
</table>
<p>Các con số là ước lượng do máy chủ tính (với <code>readWriteDistribution: true</code> và <code>configureQueryAnalyzer</code> nó còn lấy mẫu truy vấn thật của bạn và báo bao nhiêu phần trăm sẽ được nhắm đích). Ba đặc tính, ba câu hỏi: khoá có bao nhiêu giá trị khác nhau (<strong>cardinality</strong> — số giá trị), giá trị phổ biến nhất xuất hiện bao nhiêu (<strong>frequency</strong> — tần suất), và giá trị mới có luôn tăng không (<strong>monotonicity</strong> — tăng dần)? Và câu thứ tư không lệnh nào trả lời hộ bạn: các truy vấn chạy nhiều nhất có chứa nó không?</p>
${nguon('📘', 'analyzeShardKey — MongoDB Docs', 'Mới ở 7.0: số giá trị, tần suất, tính tăng dần của khoá ứng viên; tuỳ chọn phân bố đọc/ghi từ truy vấn lấy mẫu', 'https://www.mongodb.com/docs/manual/reference/command/analyzeShardKey/')}

<h3>Lỗi 1: khoá luôn tăng</h3>
${lenh(K, 1)}
<p>Hai mươi nghìn đơn mới. Shard theo <code>ngay</code> (khoảng): cả 20.000 vào <em>một</em> shard — shard giữ range kéo tới MaxKey — vì mọi ngày mới đều lớn hơn mọi ngày cũ. Hai shard kia không nhận gì; balancer sẽ dời range sau, khi việc đã rồi, tốn thêm I/O. Shard theo khoá băm, cùng số đơn đó chia ra ba shard. Chuyện y hệt xảy ra với <code>_id</code> kiểu <code>ObjectId</code> (nó bắt đầu bằng mốc thời gian), bộ đếm tự tăng và mốc thời gian: làm khoá khoảng, chúng tạo ra một <strong>shard nóng</strong> gánh mọi lệnh chèn. Hoặc băm chúng, hoặc đặt một trường không tăng dần lên đầu (<code>{ khachId: 1, ngay: 1 }</code>).</p>

<h3>Lỗi 2: khoá quá ít giá trị</h3>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>Ba giá trị, ba range — cả ba bị gắn <strong>JUMBO</strong> và cả ba vẫn nằm ở sh1 sau bốn mươi giây cân bằng: range lớn hơn cỡ range mà không cắt được thì cũng không dời được. MongoDB từ chối cắt "ở giữa" hai tài liệu có cùng giá trị khoá: "chunk is indivisible". Range HCM giữ 60.135 đơn, một nửa collection, và sẽ mãi lớn lên trên một shard. Thêm shard cũng vô ích — chẳng có gì để chia cho chúng.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — lấy "trạng thái" hay "loại" làm shard key.</strong> Các trường chỉ có vài giá trị (trạng thái, quốc gia, danh mục, cờ đúng/sai) trông rất tự nhiên vì nhiều truy vấn lọc theo chúng. Đứng <em>đầu</em> shard key, chúng giới hạn số range hữu ích bằng đúng số giá trị. Nếu cần chúng để nhắm đích, đặt chúng đầu và thêm một trường nhiều giá trị phía sau.</p>
</div>

<h3>Sửa khi đang chạy: reshardCollection</h3>
<p>Từ 5.0 bạn đổi được shard key của collection đang chạy. MongoDB chép mọi tài liệu sang một collection mới chia theo khoá mới, liên tục áp dụng các lệnh ghi phát sinh, rồi chuyển sang trong một đoạn khoá ngắn. Mặc định nó chạy tối thiểu năm phút để không bắt đầu và kết thúc ngay giữa lúc cụm bận; lab hạ xuống năm giây:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
<p>Khoảng 36 giây cho 120.000 đơn, và collection giờ chia chừng 40.000 mỗi shard. Với collection thật hàng trăm gigabyte, việc này mất nhiều giờ, cần đĩa trống cho cả một bản sao thứ hai trên mỗi shard nhận, và lệnh ghi bị chặn tới hai giây ở cuối. Nếu chỉ cần <em>thêm</em> trường vào cuối khoá, <code>refineCollectionShardKey</code> (4.4+) rẻ hơn nhiều: nó chỉ đổi siêu dữ liệu, các range cũ vẫn dùng được.</p>
${nguon('📘', 'Reshard a Collection — MongoDB Docs', 'reshardCollection (5.0+): chép dữ liệu theo khoá mới, áp dụng lệnh ghi phát sinh, đoạn khoá ghi ngắn; yêu cầu về đĩa và thời gian', 'https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/')}

<h3>Zone: giữ dữ liệu ở vùng của nó</h3>
<p>Shard key bắt đầu bằng vùng cho phép dùng <strong>zone</strong>: gắn mỗi shard một zone và giao các khoảng khoá cho zone; balancer khi đó giữ mỗi khoảng trên một shard thuộc zone của nó. Dùng cho: dữ liệu phải nằm trong nước (dữ liệu khách ở lại quốc gia mà luật yêu cầu), độ trễ (khách miền Bắc trên máy chủ ở Hà Nội), hay phân tầng (đơn cũ trên phần cứng rẻ hơn).</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>Khoảng tám mươi giây sau phân bố khớp đúng từng vùng: sh1 giữ 39.842 đơn HN, sh2 giữ 60.135 đơn HCM, sh3 giữ 20.023 đơn DN.</p>
${lenh(K, 10)}
${lenh(K, 11)}
<p>Một điều bất ngờ đáng hiểu: truy vấn HN vẫn được gửi tới hai shard, và sh3 trả 0 tài liệu. Khoảng zone của HN kết thúc đúng ở <code>{ vung: 'HN', khachId: MaxKey }</code>, và range kế tiếp — khoảng trống sau HN, không thuộc zone nào — nằm ở sh3. Cận của truy vấn bao cả điểm biên đó, nên mongos hỏi cả sh3. Định tuyến đi theo <em>các range trong bảng định tuyến</em>, không theo chỗ tài liệu đang nằm. Ở đây chỉ tốn một lượt gọi rỗng; nó nhắc bạn đọc <code>explain()</code> thay vì đoán.</p>
${nguon('📘', 'Zones — MongoDB Docs', 'Gắn shard với zone và khoảng shard key với zone; balancer giữ khoảng trên shard thuộc zone của nó', 'https://www.mongodb.com/docs/manual/core/zone-sharding/')}

<h3>Danh sách kiểm khi chọn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · truy vấn</span><span class="lz-t">liệt kê 5 truy vấn và lệnh ghi chạy nhiều nhất</span><span class="lz-d">khoá nên có mặt trong phần lớn chúng</span></div>
  <div class="lz-step"><span class="lz-k">2 · số giá trị</span><span class="lz-t">nhiều hơn hẳn số shard bạn sẽ có</span><span class="lz-d">thêm trường thứ hai nếu trường đầu ít giá trị</span></div>
  <div class="lz-step"><span class="lz-k">3 · tần suất</span><span class="lz-t">không giá trị nào chiếm phần lớn tài liệu</span><span class="lz-d">khách nóng, giá trị mặc định, null</span></div>
  <div class="lz-step"><span class="lz-k">4 · tăng dần</span><span class="lz-t">giá trị tăng dần ⇒ băm, hoặc đừng để đầu</span><span class="lz-d">ObjectId, mốc thời gian, bộ đếm</span></div>
  <div class="lz-step"><span class="lz-k">5 · đo</span><span class="lz-t">analyzeShardKey trên dữ liệu thật</span><span class="lz-d">rồi explain() các truy vấn chính trên cụm staging</span></div>
</div>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-4-2-consistent-hashing', title: 'Hệ thống phân tán 4.2 — Băm nhất quán và nút ảo', sub: 'Các hệ khác rải khoá lên nút thế nào, và vì sao thêm nút chỉ dời một phần dữ liệu' })}

<h3>💼 Đi làm: đợt flash sale và khoá theo người bán</h3>
<p>Một sàn thương mại điện tử shard đơn hàng theo <code>sellerId</code> vì mọi dashboard người bán đều lọc theo người bán. Chạy ổn một năm. Rồi một người bán lớn chạy flash sale lúc nửa đêm: 80% đơn trong hai giờ có cùng <code>sellerId</code>, nên tất cả vào một shard, và range của người bán đó lớn quá cỡ range, thành jumbo — balancer không dời được. Các shard khác ngồi chơi trong khi một shard cháy. Thay đổi sau sự cố: <code>refineCollectionShardKey</code> thành <code>{ sellerId: 1, _id: 1 }</code> để đơn của người bán lớn cắt được thành nhiều range, cộng chia sẵn range và một zone cho các người bán lớn đã biết trước đợt khuyến mãi kế tiếp. Trong một nhóm OJT, thói quen có ích là hỏi "ngày đông nhất của mình thì sao?" mỗi khi ai đó đề xuất shard key — không chỉ "nó có trong truy vấn không?".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Shard key tốt là thế nào?"</strong> — Nhiều giá trị, không giá trị nào quá phổ biến, không tăng dần (hoặc đã băm), và có mặt trong các truy vấn chạy nhiều nhất.</li>
<li><strong>"Vì sao _id kiểu ObjectId là shard key khoảng tồi?"</strong> — Nó tăng theo thời gian, nên mọi lệnh chèn vào range cuối trên một shard; băm nó hoặc để trường khác đứng đầu.</li>
<li><strong>"Jumbo chunk là gì?"</strong> — Range lớn hơn cỡ range mà không cắt được (chỉ một giá trị khoá) nên không dời được.</li>
<li><strong>"Đổi shard key được không?"</strong> — Được: refineCollectionShardKey thêm trường đuôi (4.4+), reshardCollection viết lại theo khoá mới (5.0+, tốn kém), unshardCollection (8.0+).</li>
<li><strong>"Băm hay khoảng?"</strong> — Băm rải lệnh ghi và phá truy vấn theo khoảng; khoảng giữ truy vấn khoảng nhắm đích và có nguy cơ điểm nóng.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Một sàn có 20.000 người bán; truy vấn đông nhất là "đơn của người bán X, mới nhất trước" và "đơn theo mã"; một người bán chạy flash sale chiếm 80% lưu lượng trong hai giờ. Đánh giá <code>{ sellerId: 1 }</code>, <code>{ createdAt: 1 }</code>, <code>{ _id: 'hashed' }</code>, và đề xuất một khoá.</li>
<li>Giải thích từ output của lab vì sao <code>don_vung</code> shard theo <code>{ vung: 1 }</code> nằm trọn ở sh1, và nêu hai cách sửa kèm chi phí.</li>
<li>Luật yêu cầu dữ liệu khách Việt Nam nằm trên máy chủ ở Việt Nam, khách Singapore ở Singapore. Thiết kế shard key và zone.</li>
</ol>
${loiGiai('Gợi ý đáp án', GIAI_VI)}
<p><strong>Xong khi:</strong> bạn đoán được, trước khi chạy, 20.000 đơn mới sẽ rơi vào đâu với một shard key cho trước — và bạn đã đổi shard key của một collection đang chạy.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Shard key', 'Trường (hoặc các trường) quyết định tài liệu thuộc range nào — và do đó thuộc shard nào.'],
  ['Số giá trị (cardinality)', 'Khoá nhận được bao nhiêu giá trị khác nhau; giới hạn số range hữu ích.'],
  ['Tần suất (frequency)', 'Giá trị phổ biến nhất xuất hiện bao nhiêu; giá trị quá phổ biến làm một range nóng và jumbo.'],
  ['Khoá tăng dần', 'Khoá mà giá trị mới luôn lớn hơn (ObjectId, thời gian); làm khoá khoảng sẽ tạo shard nóng.'],
  ['Range jumbo', 'Range vượt cỡ range mà không cắt được, nên balancer không dời được.'],
  ['analyzeShardKey', 'Lệnh 7.0+ đo số giá trị, tần suất, tính tăng dần và (tuỳ chọn) mức nhắm đích truy vấn của khoá ứng viên.'],
  ['reshardCollection / refine', 'Viết lại collection theo shard key mới (5.0+) / thêm trường đuôi vào khoá một cách rẻ (4.4+).'],
  ['Zone', 'Nhãn gắn trên shard cộng các khoảng khoá giao cho nhãn đó; balancer giữ các khoảng đó trên các shard đó.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn shard key từ các truy vấn chạy nhiều nhất, rồi kiểm số giá trị, tần suất và tính tăng dần.</li>
<li>Khoá khoảng tăng dần đẩy mọi lệnh ghi mới vào một shard; băm nó hoặc để trường khác đứng đầu.</li>
<li>Ít giá trị ⇒ ít range ⇒ jumbo; thêm một trường đuôi nhiều giá trị.</li>
<li>Lựa chọn sai sửa được khi đang chạy (refine, reshard) nhưng reshard viết lại tất cả — đo trước bằng analyzeShardKey.</li>
<li>Zone giữ dữ liệu ở đúng vùng; định tuyến theo range, nên hãy đọc explain().</li>
</ul>
</div>
`,
};
