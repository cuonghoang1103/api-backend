/**
 * 7.4 — Sharding: mongos, config server, chunk và balancer (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-4-sharding'] — cụm shard ../_demo/shard/compose.yaml (mgo-cfg, mgo-s1/s2, sau thêm mgo-s3, mgo-mongos; MongoDB 8.0.38),
 * dữ liệu tất định ../_demo/shard/don-shard.js (LCG 20261124: 20% đơn của 50 khách sỉ, vung HN/HCM/DN, ngày tăng mỗi phút một đơn).
 * Số tất định: hashed ⇒ 2 range, 0 đơn; 10.000 đơn ordered:true ~15 s vs ordered:false ~0,1 s vs chưa shard ~0,1 s (ms đổi, tỉ lệ ~100×+);
 * 200.000 đơn hashed ⇒ sh1=105307 sh2=94693; khachId=42 SINGLE_SHARD, $in/khoảng/vung ⇒ mọi shard; vung=HN mỗi shard xét toàn bộ tài liệu của nó (66612 kết quả);
 * range theo ngay ⇒ gần như hết về sh1, balancer dời 17 range ⇒ 103678/96322; thêm sh3 ⇒ ~72k/72k/56k sau ~30 s; đếm vẫn 200000.
 * Kiểm trùng: lý thuyết phân mảnh/consistent hashing/rebalance ở distributed-systems 4.1–4.3, quyết định API cho sharding ở api-design 9.3,
 * phân mảnh phía PostgreSQL ở postgresql 15.4 ⇒ liên kết. Sự cố thật: Foursquare 10/2010 (bài hậu kiểm của Eliot Horowitz, mongodb-user 08/10/2010).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's07-4-sharding';

const COMPOSE = `services:
  cfg:      # config server: the map "which range lives on which shard" (a replica set; here one member)
    command: ["mongod", "--configsvr", "--replSet", "cfg", "--port", "27019", "--bind_ip_all"]
  s1:       # shard 1 — in production a 3-member replica set (Lesson 7.1); here one member to fit a laptop
    command: ["mongod", "--shardsvr", "--replSet", "sh1", "--port", "27018", "--bind_ip_all"]
  s2:
    command: ["mongod", "--shardsvr", "--replSet", "sh2", "--port", "27018", "--bind_ip_all"]
  s3:       # profile "them": started later to watch the balancer move data onto it
    profiles: [them]
    command: ["mongod", "--shardsvr", "--replSet", "sh3", "--port", "27018", "--bind_ip_all"]
  mongos:   # the router — applications connect ONLY here
    command: ["mongos", "--configdb", "cfg/cfg:27019", "--bind_ip_all"]
    depends_on: { cfg: { condition: service_healthy }, s1: { condition: service_healthy }, s2: { condition: service_healthy } }
# (full file: _demo/shard/compose.yaml — each member initiates its own replica set in its healthcheck)`;

const GIAI_EN = `<p>1. <code>{ khachId: 42, ngay: … }</code> → one shard (the hashed key is in the filter with equality). <code>{ khachId: { $in: [7, 8] } }</code> → at most two shards — mongos hashes each value, so it may be one or two. <code>{ vung: 'DN' }</code> → every shard (no shard key). <code>{ khachId: { $gt: 4990 } }</code> → every shard: a hashed key keeps no order, so a range of ids is spread everywhere. The last two are the ones to watch at 50 shards.</p>
<p>2. Use <code>ordered: false</code> and make every document carry its own unique key (an order number), so a retried batch cannot create duplicates. Ordered inserts on a sharded collection force mongos to send consecutive runs of documents that target the same shard; with a hashed key consecutive documents alternate, so one batch of 10,000 becomes thousands of round trips. If order truly matters (rare for inserts), insert in batches grouped by shard key value.</p>
<p>3. At ~50 GB on a 64 GB machine you are where Foursquare was in 2010: working set about to exceed RAM. First check whether you need sharding at all — old orders can be archived (Lesson 10.1), indexes trimmed (Lesson 4.5), the machine upgraded. If you do shard, do it now while there is headroom: the balancer moves data while serving traffic, and that migration itself needs CPU, disk and RAM. Alert on the size of each shard, not the cluster total.</p>`;

const GIAI_VI = `<p>1. <code>{ khachId: 42, ngay: … }</code> → một shard (khoá băm có trong bộ lọc dạng bằng). <code>{ khachId: { $in: [7, 8] } }</code> → nhiều nhất hai shard — mongos băm từng giá trị, nên có thể một hoặc hai. <code>{ vung: 'DN' }</code> → mọi shard (không có shard key). <code>{ khachId: { $gt: 4990 } }</code> → mọi shard: khoá băm không giữ thứ tự, nên một khoảng mã khách rải khắp nơi. Hai câu cuối là thứ phải canh khi có 50 shard.</p>
<p>2. Dùng <code>ordered: false</code> và cho mỗi tài liệu mang khoá duy nhất của nó (một mã đơn), để lô bị gửi lại không sinh bản trùng. Chèn có thứ tự trên collection đã shard buộc mongos gửi từng đoạn tài liệu liên tiếp cùng nhắm một shard; với khoá băm, các tài liệu liên tiếp nhảy qua lại giữa các shard, nên một lô 10.000 thành hàng nghìn lượt gọi. Nếu thứ tự thật sự quan trọng (hiếm khi với lệnh chèn), hãy gom lô theo giá trị shard key.</p>
<p>3. Khoảng 50 GB trên máy 64 GB là đúng chỗ Foursquare đứng năm 2010: working set sắp vượt RAM. Trước hết kiểm xem có thật cần sharding không — đơn cũ có thể lưu trữ ra chỗ khác (Bài 10.1), bớt index (Bài 4.5), nâng máy. Nếu shard thì làm ngay khi còn dư sức: balancer dời dữ liệu trong lúc vẫn phục vụ, và chính việc dời đó cũng cần CPU, đĩa và RAM. Cảnh báo theo dung lượng từng shard, không phải tổng cụm.</p>`;

export default {
  title: '7.4 — Sharding: mongos, config servers, chunks and the balancer|||7.4 — Sharding: mongos, config server, chunk và balancer',
  slug: 'mgo-7-4-sharding',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Khi nào thật sự cần sharding (và khi nào KHÔNG). Dựng cụm shard thật bằng Compose: config server, hai shard, mongos; shard theo hashed; bẫy insertMany ordered:true chậm hơn trăm lần trên collection đã shard; truy vấn nhắm một shard vs phát tán mọi shard (đo bằng explain); shard theo khoảng ngày — mọi đơn dồn một shard rồi balancer dời 17 range; thêm shard thứ ba khi đang chạy. Sự cố Foursquare 2010: một shard vượt RAM, thêm shard không cứu kịp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Sharding: mongos, config servers, chunks and the balancer</h2>
<p class="lead">A replica set copies the <em>same</em> data to every member: it survives failures, but every member still has to hold everything and the one primary still takes every write. <strong>Sharding</strong> splits a collection's documents across several replica sets — <strong>shards</strong> — so each holds and writes only part of it. This lesson builds a real sharded cluster, loads 200,000 orders, measures which queries hit one shard and which hit all of them, and watches the balancer move data when a shard is added. It also shows a trap that makes bulk inserts a hundred times slower.</p>

<h3>An everyday picture: a library with branches</h3>
<p>One library cannot hold every book any more, so the city opens branches and splits the collection by the first letter of the title: A–H in branch 1, I–P in branch 2, Q–Z in branch 3. A help desk at the entrance has a catalogue card saying which letters are where. You never walk around branches yourself — you ask the desk. A question with the title ("<em>Dế Mèn</em>") goes to one branch; a question without it ("every book published in 2020") makes the desk phone every branch and wait for the slowest. When branch 1 gets too full, staff carry a shelf of books to the new branch 4 and update the card — while the library stays open. That is mongos (the desk), the config servers (the card), shards (branches), the <strong>shard key</strong> (the letter) and the <strong>balancer</strong> (the staff with the trolley).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">application</span><span class="lz-lnote">connects to mongos only — never to a shard directly</span></div>
  <div class="lz-layer"><span class="lz-lname">mongos (router)</span><span class="lz-lnote">stateless; caches the routing table; sends each operation to one shard or to all of them; merges results</span></div>
  <div class="lz-layer"><span class="lz-lname">config servers</span><span class="lz-lnote">a replica set holding metadata: which range of shard-key values lives on which shard</span></div>
  <div class="lz-layer"><span class="lz-lname">shards sh1, sh2, sh3…</span><span class="lz-lnote">each one a replica set (Lessons 7.1–7.3) holding part of the documents</span></div>
</div>

<h3>Do you actually need it?</h3>
<p>Sharding is the most expensive tool in this course: more machines (each shard is a replica set, plus three config servers, plus mongos), every query has to be thought through against the shard key, and the shard key is hard to change later (Lesson 7.5). Reasons that justify it: the <strong>working set</strong> — data and indexes used every day — no longer fits in the RAM of the largest machine you can afford; one primary cannot absorb the write rate; the data is several terabytes and a resync or a restore of one replica set would take days; or the law requires data of some customers to live in a given region. Before that, the cheaper fixes in this course usually go a long way: right indexes (Chapter 4), a schema without unbounded arrays (Chapter 3), archiving old data, a bigger machine.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-4-1-cach-chia', title: 'Distributed Systems 4.1 — Range vs hash partitioning', sub: 'The general theory behind this lesson: range queries, hot spots, hashing' })}

<h3>Build a sharded cluster with Compose</h3>
${ma('yaml', COMPOSE)}
${lenh(K, 0)}
<p>Five containers became healthy: a config server, two shards and mongos. The shards exist, but the cluster does not know about them yet — you register each shard by its replica-set name and one member:</p>
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>Data is moved in <strong>ranges</strong> (historically called chunks) of shard-key values. The default range size is 128 MB; the lab lowers it to 1 MB so that a few tens of megabytes are enough to watch the balancer work. Do not do that in production — tiny ranges mean many migrations and a huge routing table.</p>

<h3>Shard a collection by a hashed key</h3>
${lenh(K, 4)}
${lenh(K, 5)}
<p><code>{ khachId: 'hashed' }</code> means: hash the customer id, and split the space of hash values. An empty hashed collection is pre-split, one range per shard, so writes spread from the first document.</p>

<h3>Trap: insertMany is a hundred times slower</h3>
${lenh(K, 6)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>insertMany</code> on a sharded collection with the default <code>ordered: true</code>.</strong> The same 10,000 orders: about 15 seconds ordered, about a tenth of a second unordered — the unordered insert is as fast as on an unsharded collection. Ordered means "stop at the first error and never apply a later document before an earlier one". mongos can only keep that promise by sending <em>consecutive runs</em> of documents that go to the same shard, waiting for each run before the next. With a hashed key, consecutive documents land on random shards, so the batch is cut into thousands of tiny runs — in the shard's log each insert carried only a handful of documents — each one a round trip with a majority write. Bulk loads, imports and migrations on sharded collections: <code>{ ordered: false }</code>, with a unique key on every document so a retry is safe.</p>
</div>
${lenh(K, 7)}
${lenh(K, 8)}
<p>200,000 orders in about two seconds, split roughly 53 / 47. Hashing spreads <em>keys</em>, not load: the 50 wholesale customers who place 20% of the orders still land on one shard each — Lesson 7.5 measures that.</p>

<h3>Targeted queries and scatter-gather</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>Four queries, two behaviours:</p>
<ul>
<li><strong><code>khachId = 42</code> → SINGLE_SHARD.</strong> mongos hashes 42, looks up the range, asks one shard. This is the query sharding is built for.</li>
<li><strong><code>$in</code> of three ids → both shards</strong> (each value hashed separately; here they fell on both), <strong>a range of ids → both shards</strong> (a hash does not keep order), <strong>no shard key (<code>vung</code>) → both shards.</strong> This is <em>scatter-gather</em>: every shard runs the query, mongos waits for the slowest and merges. With executionStats you see each shard examine every one of its documents (there is no index on <code>vung</code>), and mongos merge 66,612 results.</li>
</ul>
<p>With two shards scatter-gather costs little. With 50 shards one slow shard — a long garbage collection, a busy disk — makes <em>every</em> broadcast query slow, and the total work is 50 times larger. The shard key decides which of your queries are cheap: choose it from the queries you run most, not from the data.</p>
${nguon('📘', 'Sharded Cluster Query Routing — MongoDB Docs', 'Targeted operations vs broadcast (scatter/gather); mongos merges results; queries without the shard key ask every shard', 'https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/')}

<h3>A range key, and the balancer at work</h3>
<p>Now shard a second collection by <em>range</em> on the order date, and load 200,000 orders with increasing dates:</p>
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>A new range-sharded collection starts as one range on one shard — so almost every order landed on sh1 (the balancer had already moved one range while the load was running). Then the balancer did its job: in about thirty seconds it split the big range and moved 17 ranges to sh2, oldest dates first (the first move starts at MinKey, the smallest possible value), until the difference between shards fell under three times the range size. Since MongoDB 7.0 the balancer compares <em>data size</em> per shard, not the number of chunks.</p>
${nguon('📘', 'Sharded Cluster Balancer — MongoDB Docs', 'Balanced when the data difference between shards is under 3× the range size (128 MB default ⇒ 384 MB); balancer window; migrations', 'https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/')}

<h3>Add a shard while the cluster runs</h3>
${lenh(K, 14)}
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<p>Within about thirty seconds both collections spread over three shards, and a count through mongos stays exactly 200,000 throughout: a document that has been copied to sh3 but not yet deleted from sh1 is an <em>orphan</em> on sh1, and the shard filters it out of query results. Growing a sharded cluster is a routine operation — <em>if</em> you do it before the existing shards are at their limit, because moving data costs CPU, disk and memory on the very shard that is already overloaded.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "connect the app to a shard, it's faster".</strong> A shard only has part of the data, and during a migration it also has orphans. Reads sent directly to a shard return wrong counts; writes sent directly bypass the routing table. Applications connect to mongos only; tools that must touch a shard (backup, repair) know what they are doing.</p>
</div>

<h3>🔎 A real incident: Foursquare, October 2010</h3>
<p>In 2010 Foursquare stored check-ins in MongoDB, split by user id over two shards, each a 66 GB EC2 machine — the whole data set had to stay in RAM to be fast. Two months later the data had not grown evenly: some users check in far more than others, and one shard reached 67 GB while the other was at 50 GB. On Monday the bigger shard passed its RAM, queries started hitting the disk, a backlog formed and the site went down. The team added a third shard and started migrating — but moving 5% of the data did not free memory: check-ins were about 300 bytes, many per 4 KB page, so removing some only made pages emptier. The site went down again the next day; an offline compaction with <code>repairDatabase()</code> took about four hours. 10gen's write-up, posted with Foursquare's permission, ends with the lesson that still applies: once you are at capacity it is hard to add capacity without downtime; if an alert had fired 12 hours earlier, they could have added a shard live. (Storage has changed since — WiredTiger compresses and caches differently from the 2010 engine — but the rule "grow before the limit, watch every shard" has not.)</p>
${nguon('🔬', 'Foursquare outage post mortem — Eliot Horowitz, mongodb-user, 08/10/2010', 'Two shards on 66 GB machines, uneven growth by user id, a shard over RAM, migration did not free memory, 4-hour repairDatabase', 'https://groups.google.com/g/mongodb-user/c/UoqU8ofp134')}

<h3>💼 At work: "we sharded on day one"</h3>
<p>On a project you join, the previous team sharded every collection "to be ready for scale" while the data was 20 GB. The symptoms: the admin screens are slow because their filters (date, status) never include the shard key, so every query is scatter-gather; the cloud bill is three times the size of one decent replica set; every developer has to know which queries are targeted. The honest assessment you can bring: measure with <code>explain()</code> which screens broadcast; list the top queries; compare with a single replica set on a bigger machine. MongoDB 8.0 added <code>unshardCollection</code> and <code>moveCollection</code>, so undoing an unnecessary shard key is no longer a full export and import — but it is still a migration that needs a plan and a rehearsal.</p>
${nguon('📘', 'unshardCollection — MongoDB Docs', 'New in 8.0: turn a sharded collection back into an unsharded one; moveCollection moves an unsharded collection to another shard', 'https://www.mongodb.com/docs/manual/reference/command/unshardCollection/')}
${lienKet({ cta: 'Open lesson', khoa: 'api-design', bai: 'api-9-3-sharding', title: 'API Design 9.3 — Sharding and the API', sub: 'IDs, pagination and filters decided years earlier decide how painful sharding is' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-15-4-phan-manh', title: 'PostgreSQL 15.4 — Partitioning and sharding', sub: 'The same problem from the PostgreSQL side: declarative partitioning, Citus-style distribution' })}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What are the components of a sharded cluster?"</strong> — Shards (each a replica set), config servers (a replica set holding the routing metadata), and mongos routers the application connects to.</li>
<li><strong>"What is a scatter-gather query and why does it matter?"</strong> — A query without the shard key goes to every shard; latency follows the slowest shard and total work grows with the number of shards.</li>
<li><strong>"What does the balancer do?"</strong> — Moves ranges of shard-key values between shards until data size per shard is within a threshold (3× range size), while the cluster serves traffic.</li>
<li><strong>"When would you not shard?"</strong> — When the working set fits one machine's RAM and the write rate fits one primary; fix indexes, schema and hardware first.</li>
<li><strong>"Why is a bulk insert slow on a sharded collection?"</strong> — Ordered inserts force mongos to send consecutive same-shard runs; use ordered: false with unique keys.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>On <code>don_hash</code> (hashed on <code>khachId</code>), predict and then check with <code>explain()</code> how many shards each query reaches: <code>{ khachId: 42, ngay: … }</code>, <code>{ khachId: { $in: [7, 8] } }</code>, <code>{ vung: 'DN' }</code>, <code>{ khachId: { $gt: 4990 } }</code>.</li>
<li>Your import job inserts 2 million products into a sharded collection with <code>insertMany(batch)</code> and takes six hours. What do you change, and what do you add so a retried batch does not create duplicates?</li>
<li>A replica set holds 50 GB of orders on a 64 GB machine and grows 2 GB a month. The team asks: "shard now or later?" Write your answer in five lines.</li>
</ol>
${loiGiai('Suggested answers', GIAI_EN)}
<p><strong>Done when:</strong> you have seen a query go to one shard and another go to all of them, watched the balancer move ranges, and can explain why an ordered insert is slow on a sharded collection.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Sharding', 'Splitting a collection\'s documents across several replica sets (shards) by a shard key.'],
  ['Shard', 'One replica set holding part of the sharded data.'],
  ['mongos', 'The stateless router applications connect to; it targets shards and merges results.'],
  ['Config servers', 'A replica set storing cluster metadata: shards, ranges and which shard owns each.'],
  ['Range (chunk)', 'A contiguous interval of shard-key values owned by one shard; default range size 128 MB.'],
  ['Balancer', 'Background process that moves ranges until data size per shard is within 3× range size.'],
  ['Targeted / scatter-gather', 'A query sent to the shard(s) owning its shard-key values / to every shard.'],
  ['Orphan document', 'A copy left on the old shard during or after a migration; filtered out of results.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Shard when the working set or write rate outgrows one replica set — not before; it multiplies cost and complexity.</li>
<li>Applications talk to mongos; config servers hold the map; each shard is a replica set.</li>
<li>Queries with the shard key hit one shard; without it they hit all — the shard key decides which queries are cheap.</li>
<li>Bulk inserts on sharded collections: ordered: false, unique key per document.</li>
<li>The balancer moves data live, but it needs headroom: grow before a shard reaches its limit (Foursquare 2010).</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Sharding: mongos, config server, chunk và balancer</h2>
<p class="lead">Replica set chép <em>cùng một</em> dữ liệu sang mọi thành viên: sống qua sự cố, nhưng mỗi thành viên vẫn phải giữ mọi thứ và một primary vẫn nhận mọi lần ghi. <strong>Sharding</strong> chia tài liệu của một collection ra nhiều replica set — các <strong>shard</strong> — để mỗi shard chỉ giữ và ghi một phần. Bài này dựng một cụm shard thật, nạp 200.000 đơn hàng, đo xem truy vấn nào chạm một shard và truy vấn nào chạm tất cả, rồi nhìn balancer dời dữ liệu khi thêm shard. Bài cũng chỉ ra một cái bẫy làm lệnh chèn hàng loạt chậm đi cả trăm lần.</p>

<h3>Hình ảnh đời thường: thư viện có nhiều chi nhánh</h3>
<p>Một thư viện không chứa nổi mọi cuốn sách nữa, nên thành phố mở chi nhánh và chia kho sách theo chữ cái đầu của tên sách: A–H ở chi nhánh 1, I–P ở chi nhánh 2, Q–Z ở chi nhánh 3. Quầy hướng dẫn ở cửa có một tấm thẻ ghi chữ nào ở đâu. Bạn không tự đi lục từng chi nhánh — bạn hỏi quầy. Câu hỏi có tên sách ("<em>Dế Mèn</em>") đi tới một chi nhánh; câu hỏi không có ("mọi cuốn xuất bản năm 2020") buộc quầy gọi điện mọi chi nhánh và chờ nơi chậm nhất. Khi chi nhánh 1 quá đầy, nhân viên đẩy một kệ sách sang chi nhánh 4 mới và sửa tấm thẻ — trong lúc thư viện vẫn mở cửa. Đó là mongos (quầy), config server (tấm thẻ), shard (chi nhánh), <strong>shard key</strong> (chữ cái) và <strong>balancer</strong> (nhân viên đẩy xe).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ứng dụng</span><span class="lz-lnote">chỉ nối tới mongos — không bao giờ nối thẳng vào một shard</span></div>
  <div class="lz-layer"><span class="lz-lname">mongos (bộ định tuyến)</span><span class="lz-lnote">không giữ trạng thái; nhớ đệm bảng định tuyến; gửi mỗi thao tác tới một shard hoặc tất cả; gộp kết quả</span></div>
  <div class="lz-layer"><span class="lz-lname">config server</span><span class="lz-lnote">một replica set giữ siêu dữ liệu: khoảng giá trị shard key nào nằm ở shard nào</span></div>
  <div class="lz-layer"><span class="lz-lname">shard sh1, sh2, sh3…</span><span class="lz-lnote">mỗi shard là một replica set (Bài 7.1–7.3) giữ một phần tài liệu</span></div>
</div>

<h3>Bạn có thật sự cần nó không?</h3>
<p>Sharding là công cụ đắt nhất trong khoá này: thêm nhiều máy (mỗi shard là một replica set, cộng ba config server, cộng mongos), mọi truy vấn phải được cân nhắc theo shard key, và shard key khó đổi về sau (Bài 7.5). Lý do đáng để làm: <strong>working set</strong> — dữ liệu và index dùng hằng ngày — không còn vừa RAM của máy lớn nhất bạn chi trả được; một primary không gánh nổi tốc độ ghi; dữ liệu nhiều terabyte và đồng bộ lại hay khôi phục một replica set sẽ mất nhiều ngày; hoặc luật yêu cầu dữ liệu của một số khách nằm ở một vùng nhất định. Trước đó, các cách rẻ hơn trong khoá này thường đi được rất xa: index đúng (Chương 4), schema không có mảng vô hạn (Chương 3), lưu trữ dữ liệu cũ ra chỗ khác, máy to hơn.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-4-1-cach-chia', title: 'Hệ thống phân tán 4.1 — Chia theo khoảng và chia theo băm', sub: 'Lý thuyết chung đứng sau bài này: truy vấn theo khoảng, điểm nóng, băm' })}

<h3>Dựng cụm shard bằng Compose</h3>
${ma('yaml', COMPOSE)}
${lenh(K, 0)}
<p>Năm container healthy: một config server, hai shard và mongos. Các shard đã có, nhưng cụm chưa biết tới chúng — bạn đăng ký từng shard bằng tên replica set và một thành viên:</p>
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>Dữ liệu được dời theo từng <strong>range</strong> (trước đây gọi là chunk) giá trị shard key. Cỡ range mặc định là 128 MB; lab hạ xuống 1 MB để chỉ vài chục megabyte đã đủ thấy balancer làm việc. Đừng làm vậy ở production — range bé tí nghĩa là rất nhiều lần dời và bảng định tuyến khổng lồ.</p>

<h3>Shard một collection theo khoá băm</h3>
${lenh(K, 4)}
${lenh(K, 5)}
<p><code>{ khachId: 'hashed' }</code> nghĩa là: băm mã khách, rồi chia không gian giá trị băm. Collection băm còn trống được chia sẵn, mỗi shard một range, nên lệnh ghi được rải ngay từ tài liệu đầu tiên.</p>

<h3>Bẫy: insertMany chậm hơn cả trăm lần</h3>
${lenh(K, 6)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>insertMany</code> trên collection đã shard với <code>ordered: true</code> mặc định.</strong> Cùng 10.000 đơn: có thứ tự mất khoảng 15 giây, không thứ tự khoảng một phần mười giây — bằng tốc độ trên collection chưa shard. Có thứ tự nghĩa là "dừng ở lỗi đầu tiên và không bao giờ áp dụng tài liệu sau trước tài liệu trước". mongos chỉ giữ được lời hứa đó bằng cách gửi từng <em>đoạn liên tiếp</em> các tài liệu cùng tới một shard, chờ xong đoạn này mới gửi đoạn sau. Với khoá băm, các tài liệu liên tiếp rơi vào shard ngẫu nhiên, nên lô bị cắt thành hàng nghìn đoạn bé — trong log của shard mỗi lệnh chèn chỉ mang vài tài liệu — mỗi đoạn là một lượt gọi với lần ghi majority. Nạp hàng loạt, nhập dữ liệu, chuyển đổi trên collection đã shard: <code>{ ordered: false }</code>, kèm khoá duy nhất trên mọi tài liệu để thử lại an toàn.</p>
</div>
${lenh(K, 7)}
${lenh(K, 8)}
<p>200.000 đơn trong khoảng hai giây, chia chừng 53 / 47. Băm rải <em>khoá</em>, không rải tải: 50 khách sỉ đặt 20% số đơn vẫn mỗi người nằm trọn một shard — Bài 7.5 đo chuyện đó.</p>

<h3>Truy vấn nhắm đích và phát tán</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>Bốn truy vấn, hai kiểu hành xử:</p>
<ul>
<li><strong><code>khachId = 42</code> → SINGLE_SHARD.</strong> mongos băm 42, tra range, hỏi một shard. Đây là loại truy vấn sharding sinh ra để phục vụ.</li>
<li><strong><code>$in</code> ba mã → cả hai shard</strong> (mỗi giá trị băm riêng; ở đây rơi vào cả hai), <strong>một khoảng mã → cả hai shard</strong> (băm không giữ thứ tự), <strong>không có shard key (<code>vung</code>) → cả hai shard.</strong> Đây là <em>scatter-gather</em> (phát tán rồi gom): mọi shard chạy truy vấn, mongos chờ shard chậm nhất rồi gộp. Với executionStats bạn thấy mỗi shard xét toàn bộ tài liệu của nó (không có index trên <code>vung</code>), và mongos gộp 66.612 kết quả.</li>
</ul>
<p>Với hai shard, phát tán tốn chẳng bao nhiêu. Với 50 shard, một shard chậm — một lần dọn rác dài, một ổ đĩa bận — làm <em>mọi</em> truy vấn phát tán chậm theo, và tổng khối lượng việc lớn gấp 50. Shard key quyết định truy vấn nào của bạn rẻ: hãy chọn nó từ những truy vấn bạn chạy nhiều nhất, không phải từ dữ liệu.</p>
${nguon('📘', 'Sharded Cluster Query Routing — MongoDB Docs', 'Thao tác nhắm đích vs phát tán (scatter/gather); mongos gộp kết quả; truy vấn không có shard key hỏi mọi shard', 'https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/')}

<h3>Khoá theo khoảng, và balancer làm việc</h3>
<p>Giờ shard collection thứ hai theo <em>khoảng</em> ngày đặt, và nạp 200.000 đơn có ngày tăng dần:</p>
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>Collection mới shard theo khoảng khởi đầu là một range trên một shard — nên gần như mọi đơn rơi vào sh1 (balancer đã kịp dời một range ngay trong lúc nạp). Rồi balancer làm việc của nó: trong khoảng ba mươi giây, nó cắt range lớn và dời 17 range sang sh2, ngày cũ trước (lần dời đầu bắt đầu từ MinKey, giá trị nhỏ nhất có thể), tới khi chênh lệch giữa các shard nhỏ hơn ba lần cỡ range. Từ MongoDB 7.0 balancer so <em>dung lượng dữ liệu</em> mỗi shard, không so số chunk.</p>
${nguon('📘', 'Sharded Cluster Balancer — MongoDB Docs', 'Cân bằng khi chênh lệch dữ liệu giữa các shard dưới 3× cỡ range (128 MB mặc định ⇒ 384 MB); cửa sổ balancer; dời dữ liệu', 'https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/')}

<h3>Thêm shard khi cụm đang chạy</h3>
${lenh(K, 14)}
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<p>Trong khoảng ba mươi giây cả hai collection rải ra ba shard, và đếm qua mongos vẫn đúng 200.000 suốt quá trình: tài liệu đã chép sang sh3 mà chưa xoá khỏi sh1 là một <em>tài liệu mồ côi</em> (orphan) trên sh1, và shard lọc nó khỏi kết quả truy vấn. Mở rộng cụm shard là việc thường ngày — <em>nếu</em> bạn làm trước khi các shard hiện có chạm giới hạn, vì dời dữ liệu tốn CPU, đĩa và bộ nhớ trên chính shard đang quá tải.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nối ứng dụng thẳng vào shard cho nhanh".</strong> Một shard chỉ có một phần dữ liệu, và trong lúc dời còn có tài liệu mồ côi. Lệnh đọc gửi thẳng vào shard trả số đếm sai; lệnh ghi gửi thẳng bỏ qua bảng định tuyến. Ứng dụng chỉ nối tới mongos; công cụ nào phải chạm vào shard (sao lưu, sửa chữa) thì phải biết rõ mình đang làm gì.</p>
</div>

<h3>🔎 Sự cố thật: Foursquare, tháng 10/2010</h3>
<p>Năm 2010 Foursquare lưu lượt check-in trong MongoDB, chia theo mã người dùng ra hai shard, mỗi shard một máy EC2 66 GB RAM — toàn bộ dữ liệu phải nằm trong RAM mới đủ nhanh. Hai tháng sau dữ liệu không tăng đều: có người check-in nhiều hơn hẳn người khác, một shard lên 67 GB trong khi shard kia ở 50 GB. Sáng thứ Hai shard lớn vượt RAM, truy vấn bắt đầu đụng đĩa, việc dồn ứ lại và trang web sập. Đội kỹ thuật thêm shard thứ ba và bắt đầu dời dữ liệu — nhưng dời 5% dữ liệu không giải phóng được bộ nhớ: mỗi check-in chỉ khoảng 300 byte, nhiều cái chung một trang 4 KB, nên lấy bớt đi chỉ làm các trang thưa hơn. Hôm sau trang web sập lần nữa; một lần nén lại ngoại tuyến bằng <code>repairDatabase()</code> mất khoảng bốn giờ. Bài viết của 10gen, đăng với sự đồng ý của Foursquare, kết bằng bài học vẫn còn nguyên: khi đã chạm trần thì rất khó thêm sức chứa mà không phải ngừng dịch vụ; nếu có cảnh báo sớm 12 giờ, họ đã thêm được shard mà không sập. (Bộ lưu trữ ngày nay đã khác — WiredTiger nén và đệm khác engine năm 2010 — nhưng luật "mở rộng trước khi chạm trần, canh từng shard" thì không đổi.)</p>
${nguon('🔬', 'Foursquare outage post mortem — Eliot Horowitz, mongodb-user, 08/10/2010', 'Hai shard trên máy 66 GB, tăng không đều theo mã người dùng, một shard vượt RAM, dời dữ liệu không giải phóng bộ nhớ, repairDatabase 4 giờ', 'https://groups.google.com/g/mongodb-user/c/UoqU8ofp134')}

<h3>💼 Đi làm: "bọn anh shard từ ngày đầu"</h3>
<p>Ở một dự án bạn mới vào, đội trước đã shard mọi collection "cho sẵn sàng mở rộng" khi dữ liệu mới 20 GB. Triệu chứng: các màn hình quản trị chậm vì bộ lọc của chúng (ngày, trạng thái) không bao giờ có shard key, nên truy vấn nào cũng phát tán; hoá đơn đám mây gấp ba một replica set tử tế; lập trình viên nào cũng phải biết truy vấn nào nhắm đích. Đánh giá trung thực bạn có thể mang tới: đo bằng <code>explain()</code> xem màn nào phát tán; liệt kê các truy vấn hay chạy nhất; so với một replica set trên máy lớn hơn. MongoDB 8.0 thêm <code>unshardCollection</code> và <code>moveCollection</code>, nên gỡ một shard key không cần thiết không còn là xuất rồi nhập lại toàn bộ — nhưng vẫn là một lần chuyển đổi cần kế hoạch và diễn tập.</p>
${nguon('📘', 'unshardCollection — MongoDB Docs', 'Mới ở 8.0: đưa collection đã shard về chưa shard; moveCollection dời collection chưa shard sang shard khác', 'https://www.mongodb.com/docs/manual/reference/command/unshardCollection/')}
${lienKet({ cta: 'Mở bài', khoa: 'api-design', bai: 'api-9-3-sharding', title: 'Thiết kế API 9.3 — Sharding và API', sub: 'Định danh, phân trang và bộ lọc quyết định từ nhiều năm trước quyết định sharding đau tới đâu' })}
${lienKet({ cta: 'Mở bài', khoa: 'postgresql', bai: 'postgresql-15-4-phan-manh', title: 'PostgreSQL 15.4 — Phân vùng và phân mảnh', sub: 'Cùng bài toán từ phía PostgreSQL: phân vùng khai báo, phân tán kiểu Citus' })}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Cụm shard gồm những thành phần nào?"</strong> — Các shard (mỗi cái là một replica set), config server (một replica set giữ siêu dữ liệu định tuyến), và mongos để ứng dụng nối vào.</li>
<li><strong>"Truy vấn scatter-gather là gì và vì sao quan trọng?"</strong> — Truy vấn không có shard key đi tới mọi shard; độ trễ theo shard chậm nhất và tổng việc tăng theo số shard.</li>
<li><strong>"Balancer làm gì?"</strong> — Dời các range giá trị shard key giữa các shard tới khi dung lượng mỗi shard chênh nhau dưới ngưỡng (3× cỡ range), trong lúc cụm vẫn phục vụ.</li>
<li><strong>"Khi nào bạn không shard?"</strong> — Khi working set vừa RAM một máy và tốc độ ghi vừa một primary; sửa index, schema và phần cứng trước.</li>
<li><strong>"Vì sao chèn hàng loạt chậm trên collection đã shard?"</strong> — Chèn có thứ tự buộc mongos gửi từng đoạn liên tiếp cùng shard; dùng ordered: false kèm khoá duy nhất.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Trên <code>don_hash</code> (băm theo <code>khachId</code>), đoán rồi kiểm bằng <code>explain()</code> mỗi truy vấn chạm bao nhiêu shard: <code>{ khachId: 42, ngay: … }</code>, <code>{ khachId: { $in: [7, 8] } }</code>, <code>{ vung: 'DN' }</code>, <code>{ khachId: { $gt: 4990 } }</code>.</li>
<li>Tác vụ nhập dữ liệu của bạn chèn 2 triệu sản phẩm vào collection đã shard bằng <code>insertMany(lo)</code> và mất sáu giờ. Bạn đổi gì, và thêm gì để lô bị gửi lại không sinh bản trùng?</li>
<li>Một replica set giữ 50 GB đơn hàng trên máy 64 GB và tăng 2 GB mỗi tháng. Đội hỏi: "shard bây giờ hay để sau?" Viết câu trả lời trong năm dòng.</li>
</ol>
${loiGiai('Gợi ý đáp án', GIAI_VI)}
<p><strong>Xong khi:</strong> bạn đã thấy một truy vấn đi tới một shard và một truy vấn khác đi tới tất cả, nhìn balancer dời range, và giải thích được vì sao chèn có thứ tự chậm trên collection đã shard.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Sharding', 'Chia tài liệu của một collection ra nhiều replica set (shard) theo một shard key.'],
  ['Shard', 'Một replica set giữ một phần dữ liệu đã shard.'],
  ['mongos', 'Bộ định tuyến không giữ trạng thái mà ứng dụng nối vào; nó nhắm shard và gộp kết quả.'],
  ['Config server', 'Replica set lưu siêu dữ liệu của cụm: các shard, các range và shard nào sở hữu range nào.'],
  ['Range (chunk)', 'Một khoảng liên tục giá trị shard key thuộc một shard; cỡ mặc định 128 MB.'],
  ['Balancer', 'Tiến trình nền dời range tới khi dung lượng mỗi shard chênh nhau dưới 3× cỡ range.'],
  ['Nhắm đích / phát tán', 'Truy vấn gửi tới shard sở hữu giá trị shard key của nó / tới mọi shard.'],
  ['Tài liệu mồ côi', 'Bản còn sót trên shard cũ trong hoặc sau lần dời; bị lọc khỏi kết quả.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Shard khi working set hoặc tốc độ ghi vượt một replica set — không sớm hơn; nó nhân chi phí và độ phức tạp.</li>
<li>Ứng dụng nói chuyện với mongos; config server giữ bản đồ; mỗi shard là một replica set.</li>
<li>Truy vấn có shard key chạm một shard; không có thì chạm tất cả — shard key quyết định truy vấn nào rẻ.</li>
<li>Chèn hàng loạt trên collection đã shard: ordered: false, mỗi tài liệu một khoá duy nhất.</li>
<li>Balancer dời dữ liệu khi đang chạy, nhưng cần dư sức: mở rộng trước khi một shard chạm trần (Foursquare 2010).</li>
</ul>
</div>
`,
};
