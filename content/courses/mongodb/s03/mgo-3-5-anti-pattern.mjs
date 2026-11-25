/**
 * 3.5 — Anti-pattern làm sập production (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s03-5-anti'] (MongoDB 8.0.38: mgo-lab database ch3a + container phụ mgo-phinh (cache 0,25 GB, --network none),
 * mgo-nhieu (--ulimit nofile=1024), mgo-nhieu2 (nofile=64000) — đều xoá cuối kịch bản demo/s03/s03-5-anti.txt).
 * Số đối chiếu: mảng bình luận 4 KB tới lượt 4166 thì lỗi 10334 (16 MiB), thời gian 500 lượt $push tăng dần theo cỡ tài liệu;
 * tài liệu phình 586 MB vs 0,4 MB, 10 trang đọc vào cache hàng trăm MB vs ~0; 1024 tệp mở ⇒ mongod sập (mã 139, WiredTiger errno 24, fassert) khi
 * tạo vài trăm collection; nofile 64000: 3000 collection = 6011 tệp .wt, ~6028 fd, 12020 data handle; 8 index thừa: index ×8,6, chèn chậm hơn, $indexStats 0 lượt.
 * ms đổi theo lần chạy ⇒ lời chỉ nêu xu hướng.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '3.5 — Anti-patterns that take production down|||3.5 — Anti-pattern làm sập production',
  slug: 'mgo-3-5-anti-pattern',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Năm anti-pattern MongoDB tự liệt kê, mỗi cái gây hỏng thật trên máy lab: mảng không giới hạn (mỗi lần $push chậm dần rồi lỗi 16 MiB ở bình luận thứ 4166), tài liệu phình (trang danh sách kéo hàng trăm MB vào cache 256 MB), quá nhiều collection (mongod SẬP vì hết tệp mở — WiredTiger errno 24 — và 3000 collection = 6011 tệp), index thừa (chèn chậm, index ×8,6, $indexStats 0 lượt dùng), $lookup khắp nơi; câu chuyện Discord 2015 khi dữ liệu và index không còn vừa RAM.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Anti-patterns that take production down</h2>
<p class="lead">A bad schema rarely fails on day one. It works in the demo, passes the tests, ships — and degrades as data grows, until one day a write fails or the server falls over. MongoDB's documentation lists the common culprits as <em>schema design anti-patterns</em>. In this lesson you will trigger each one on purpose, in throw-away containers, and watch exactly how it breaks — including a <code>mongod</code> that crashes.</p>

<h3>An everyday picture: the notebook, the backpack, the drawer cabinet</h3>
<p>A class keeps one shared notebook for everyone's notes — every time someone adds a line, the whole notebook is photocopied for everyone (unbounded array: each update rewrites the whole document). A student who carries every textbook every day just to read one page has a bloated backpack (bloated documents). An office that opens a new drawer for every single customer runs out of drawers and keys long before it runs out of customers (too many collections). And a library index card for every possible way to search a book — most never used — makes every new book slow to shelve (unnecessary indexes).</p>
${nguon('📘', 'Schema Design Anti-Patterns — MongoDB Docs', 'Unbounded arrays, too many collections, unnecessary indexes, bloated documents, $lookup', 'https://www.mongodb.com/docs/manual/data-modeling/design-antipatterns/')}

<h3>1 · Unbounded arrays</h3>
<p>A "viral post" document collects 4 KB comments in an array. Measure the time of every 500 pushes and the document size, until something gives:</p>
${lenh('s03-5-anti', 0)}
${lenh('s03-5-anti', 1)}
<p>Two failures in one run. First the slowdown: the batches near 15 MB take several times longer than the first batch (the exact milliseconds wobble from run to run, the trend does not), because WiredTiger does not edit documents in place — every update writes a new version of the <em>whole</em> document (Lesson 1.4), so pushing comment 4,000 costs about 15 MB of work, while pushing comment 10 cost a few KB. Then the hard stop: at comment 4,166 the update fails with error 10334, "Resulting document after update is larger than 16777216" — the 16 MiB limit of Lesson 1.1. From that moment, nobody can comment on the post. This is how one-to-squillions data embedded as an array dies (Lesson 3.2). The fix: comments in their own collection with <code>postId</code>, plus a subset of the newest few in the post (Lesson 3.3) and a counter.</p>

<h3>2 · Bloated documents</h3>
<p>A product list page needs name and price. Each product document, however, also carries a 100 KB description (and in real projects, base64 images). Run it on a server whose cache is small compared with the data — 0.25 GB, the situation of every production server whose data is larger than RAM:</p>
${lenh('s03-5-anti', 2)}
${lenh('s03-5-anti', 3)}
<p>The page asks for two small fields, but WiredTiger caches whole documents: listing ten pages of the bloated collection pulled hundreds of megabytes into a 256 MB cache — and on the second pass it had to read them again, because they had already been evicted. The lean collection read under half a megabyte the first time and almost nothing afterwards (it stayed in cache). Projection reduces what travels over the network; it does not reduce what the server reads. The fix: split rarely read, large fields into a separate collection (<code>productDetails</code>, one-to-one by <code>_id</code>) read only by the detail page, and store files in object storage, keeping only the URL.</p>
${lenh('s03-5-anti', 4)}

<h3>3 · Too many collections</h3>
<p>A "multi-tenant" design creates one collection per customer (<code>khach_0</code>, <code>khach_1</code>, …). Each collection is a WiredTiger file, and each index another file. On this lab machine Docker gives a container 1,024 open files by default — a common Linux default. Create collections until something gives:</p>
${lenh('s03-5-anti', 5)}
${lenh('s03-5-anti', 6)}
${lenh('s03-5-anti', 7)}
<p>The server did not reject the request — it <strong>crashed</strong>. WiredTiger could not open another file (errno 24, "Too many open files"), MongoDB treats a storage error it cannot recover from as fatal (<code>fassert</code>) and aborts, and the container exits with code 139. Every application connected to this database lost it, not only the one creating collections. The log also shows the warning the server printed at start-up — "Soft rlimits for open file descriptors too low" — which nobody reads until after the outage. MongoDB's production notes recommend at least 64,000 open files; with that limit the same 3,000 collections succeed, and you can see what they cost:</p>
${lenh('s03-5-anti', 8)}
${lenh('s03-5-anti', 9)}
<p>3,000 empty collections = 6,011 data files, about 6,000 open file descriptors and 12,020 data handles inside the server, and around a minute just to create them (55–72 seconds across our runs). Every one of those files is checkpointed, every handle takes memory, start-up and backups slow down. The MongoDB docs list "reduce number of collections" for exactly this reason. The fix for multi-tenancy is usually <em>one</em> collection with a <code>tenantId</code> field, leading every index (<code>{ tenantId: 1, … }</code>) — with a database per tenant only when isolation is a hard requirement and tenants are few.</p>
${nguon('📘', 'UNIX ulimit Settings — MongoDB Docs', 'Recommended 64000 open files; start-up warning below that', 'https://www.mongodb.com/docs/manual/reference/ulimit/')}
${lenh('s03-5-anti', 10)}

<h3>4 · Unnecessary indexes</h3>
<p>Every index speeds up some reads and slows down every write, because each insert and each update of an indexed field must update the index too. Insert the same 20,000 documents into a collection with only <code>_id</code> and one with eight more indexes:</p>
${lenh('s03-5-anti', 11)}
${lenh('s03-5-anti', 12)}
<p>The eight extra indexes made the inserts measurably slower and the index storage about 8.6 times larger (4.47 MB vs 0.52 MB) — and that index storage wants to live in RAM, competing with your data. <code>$indexStats</code> shows how many times each index has been used since the server started: here every one is 0. On a production server that has been running for weeks, an index with 0 uses is a candidate for removal (hide it first with <code>hideIndex</code> to check nothing slows down — Chapter 4).</p>

<h3>5 · $lookup everywhere</h3>
<p>You measured this one in Lesson 3.1: building the order page with <code>$lookup</code> was slower than reading one embedded document, on every single page view. A schema translated table-by-table from SQL ends up with <code>$lookup</code> in every API. The MongoDB docs' advice is the rule of this chapter: data read together should be stored together; keep <code>$lookup</code> for occasional and analytical queries.</p>

<h3>🔥 A real story: Discord, 2015</h3>
<p>Discord's engineering blog (January 2017, "How Discord Stores Billions of Messages") describes its first message store. Discord was built in under two months in early 2015; everything lived in a single MongoDB replica set, and messages were in one collection with a single compound index on <code>channel_id</code> and <code>created_at</code>. Around November 2015 they reached 100 million stored messages and "the data and the index could no longer fit in RAM and latencies started to become unpredictable". Their reads were random across channels and the read/write ratio was about 50/50. They moved messages to Cassandra.</p>
<p>The lesson is not "MongoDB cannot store messages". It is the bloated-document lesson at the scale of a whole collection: the <strong>working set</strong> (the data and indexes the application touches regularly) had grown beyond memory, so most reads went to disk. They had also decided early not to use MongoDB sharding (Chapter 7). Notice what they did right: they "planned everything for easy migration" from day one, and they understood their read/write pattern before choosing the next database — the same workload-first thinking as Lesson 3.1.</p>
${nguon('📝', 'How Discord Stores Billions of Messages — Discord blog (2017)', 'MongoDB replica set, 100 M messages by Nov 2015, data + index exceeded RAM', 'https://discord.com/blog/how-discord-stores-billions-of-messages')}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">unbounded array</span><span class="lz-t">slower each push, then error 10334 at 16 MiB</span><span class="lz-d">child collection + subset + counter</span></div>
  <div class="lz-step"><span class="lz-k">bloated documents</span><span class="lz-t">cache filled by fields nobody reads</span><span class="lz-d">split cold large fields one-to-one; files in object storage</span></div>
  <div class="lz-step"><span class="lz-k">too many collections</span><span class="lz-t">file handles exhausted ⇒ mongod crash</span><span class="lz-d">one collection + tenantId; ulimit ≥ 64000</span></div>
  <div class="lz-step"><span class="lz-k">unnecessary indexes</span><span class="lz-t">slower writes, RAM spent on unused indexes</span><span class="lz-d">$indexStats, hide then drop</span></div>
  <div class="lz-step"><span class="lz-k">$lookup everywhere</span><span class="lz-t">every read pays for a join</span><span class="lz-d">reshape documents around the hot reads</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — testing the schema with demo-sized data.</strong> Every anti-pattern in this lesson is invisible with 50 documents: the array is small, the cache holds everything, 20 collections are fine, unused indexes cost nothing. Before a design review, generate data at the size you expect in a year (the lab seeds here take seconds) and look at document sizes, cache reads and file counts. "It works on my machine" with 50 rows is not evidence.</p>
</div>

<h3>💼 At work: the outage review</h3>
<p>Outages caused by a schema usually end in a post-mortem meeting with a timeline: "03:12 writes to <code>posts</code> fail with 10334", "03:40 hot-fix: comments moved to a new collection". As a junior, the most useful thing you can bring is the reproduction — a script like this lesson's that triggers the failure in a throw-away container, so the team can test the fix. And add the matching check to the design document template: "every array has an upper bound", "no collection per tenant", "ulimit verified".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What happens when a document reaches 16 MB?"</strong> — The write that would exceed it fails (error 10334); before that, every update of the growing document gets slower because the whole document is rewritten.</li>
<li><strong>"Why is one collection per customer a bad idea?"</strong> — Each collection and index is a file; thousands exhaust file handles (the server can crash), memory and checkpoint time. Use a tenant field leading the indexes.</li>
<li><strong>"How do you find unused indexes?"</strong> — <code>$indexStats</code> (<code>accesses.ops</code> since start-up), then <code>hideIndex</code> before dropping.</li>
<li><strong>"What is the working set and why does it matter?"</strong> — The data and indexes accessed regularly; when it exceeds RAM, reads go to disk and latency becomes unpredictable (Discord 2015).</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Redesign the viral post: comments in their own collection, the post with the 3 newest comments and a counter. Insert 5,000 comments and show the post stays under 2 KB.</li>
<li>Split <code>phinh</code> into <code>sp</code> (name, price, cat) and <code>spChiTiet</code> (<code>_id</code>, description). Re-run the cache measurement on the list page. (Start your own throw-away container with <code>--wiredTigerCacheSizeGB 0.25</code>, as in the lesson.)</li>
<li>In your own lab, run <code>docker exec mgo-lab bash -c 'grep "open files" /proc/1/limits'</code>. If the soft limit is below 64,000, add <code>ulimits: { nofile: { soft: 64000, hard: 64000 } }</code> to the service in <code>compose.yaml</code> and check again.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.cmt.createIndex({ postId: 1, at: -1 })</code>; for each comment: <code>db.cmt.insertOne({ postId: 1, at: new Date(), text })</code> and <code>db.post.updateOne({ _id: 1 }, { $push: { moi: { $each: [{ text: text.slice(0, 200), at }], $position: 0, $slice: 3 } }, $inc: { soBinhLuan: 1 } })</code>. Only the 3 newest (shortened) comments live in the post; <code>$bsonSize</code> stays constant however many comments arrive.</p>
<p>2. The list page now reads only <code>sp</code>, a fraction of a megabyte; <code>bytes read into cache</code> grows by almost nothing on the second pass. The detail page reads <code>spChiTiet</code> by <code>_id</code> — one document, one extra query only on that page.</p>
<p>3. On Docker Desktop (Mac/Windows) the limit is usually already high; on Linux hosts it is often 1,024 for the soft limit. After <code>docker compose -p mgo up -d</code> the line shows 64000. The start-up warning "Soft rlimits for open file descriptors too low" disappears from <code>docker logs mgo-lab</code>.</p>
</details>
<p><strong>Done when:</strong> for each of the five anti-patterns you can describe the symptom you would see in production and the redesign.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Anti-pattern', 'A design that works at small scale and fails or degrades as data grows.'],
  ['Unbounded array', 'An array with no upper limit; every push rewrites a growing document until the 16 MiB limit stops writes.'],
  ['Bloated document', 'A document carrying large fields that the frequent reads do not need, wasting cache and I/O.'],
  ['Working set', 'The data and indexes the application accesses regularly; it should fit in RAM.'],
  ['ulimit / nofile', 'The operating system limit on open files per process; MongoDB recommends ≥ 64,000.'],
  ['$indexStats', 'Aggregation stage reporting how often each index has been used since start-up.'],
  ['Multi-tenant', 'One system serving many customers (tenants); usually one collection with a tenantId, not one collection each.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Unbounded array: pushes got slower as the document grew, then comment 4,166 failed at 16 MiB.</li>
<li>Bloated documents: two fields requested, hundreds of MB pulled through a 256 MB cache.</li>
<li>Too many collections: with 1,024 open files, mongod crashed (errno 24, fassert); 3,000 collections = 6,011 files.</li>
<li>Unnecessary indexes: 8.6× index size, slower inserts, 0 uses in <code>$indexStats</code>.</li>
<li>Discord 2015: data + index outgrew RAM at 100 M messages — the working set decides performance.</li>
<li>Test schemas with realistic data volume before the design review.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Anti-pattern làm sập production</h2>
<p class="lead">Một schema tồi hiếm khi hỏng ngay ngày đầu. Nó chạy tốt khi demo, qua được test, được đưa lên — rồi xuống cấp dần khi dữ liệu lớn lên, cho tới một ngày một lệnh ghi thất bại hay máy chủ đổ gục. Tài liệu của MongoDB liệt kê các thủ phạm hay gặp dưới tên <em>anti-pattern thiết kế schema</em>. Trong bài này bạn sẽ cố ý kích hoạt từng cái, trong các container dùng xong bỏ, và xem chính xác nó hỏng thế nào — kể cả một <code>mongod</code> bị sập.</p>

<h3>Hình ảnh đời thường: cuốn sổ chung, cái balo, tủ ngăn kéo</h3>
<p>Một lớp giữ một cuốn sổ chung để mọi người ghi chú — mỗi lần ai đó thêm một dòng, cả cuốn sổ lại được photo cho mọi người (mảng không giới hạn: mỗi lần cập nhật ghi lại cả tài liệu). Một bạn ngày nào cũng mang hết sách giáo khoa chỉ để đọc một trang thì có cái balo phình to (tài liệu phình). Một văn phòng mở một ngăn kéo mới cho mỗi khách hàng thì hết ngăn kéo và chìa khoá từ lâu trước khi hết khách (quá nhiều collection). Còn thư viện làm thẻ tra cứu cho mọi cách tìm sách có thể nghĩ ra — phần lớn chẳng ai dùng — thì mỗi cuốn sách mới đều xếp lên kệ thật chậm (index thừa).</p>
${nguon('📘', 'Schema Design Anti-Patterns — MongoDB Docs', 'Mảng không giới hạn, quá nhiều collection, index thừa, tài liệu phình, $lookup', 'https://www.mongodb.com/docs/manual/data-modeling/design-antipatterns/')}

<h3>1 · Mảng không giới hạn</h3>
<p>Một tài liệu "bài viết viral" gom các bình luận 4 KB trong một mảng. Đo thời gian mỗi 500 lượt push và cỡ tài liệu, cho tới khi có thứ gì đó gãy:</p>
${lenh('s03-5-anti', 0)}
${lenh('s03-5-anti', 1)}
<p>Hai kiểu hỏng trong một lần chạy. Trước hết là chậm dần: các lô gần mốc 15 MB tốn thời gian gấp vài lần lô đầu tiên (số mili giây chính xác dao động theo lần chạy, xu hướng thì không), vì WiredTiger không sửa tài liệu tại chỗ — mỗi lần cập nhật ghi một phiên bản mới của <em>cả</em> tài liệu (Bài 1.4), nên push bình luận thứ 4.000 tốn khoảng 15 MB công sức, trong khi bình luận thứ 10 chỉ tốn vài KB. Rồi tới điểm dừng cứng: ở bình luận thứ 4.166, lệnh cập nhật lỗi 10334, "Resulting document after update is larger than 16777216" — giới hạn 16 MiB của Bài 1.1. Từ khoảnh khắc đó, không ai bình luận được vào bài viết nữa. Đây là cách dữ liệu một–vô số nhúng thành mảng chết đi (Bài 3.2). Cách sửa: bình luận nằm ở collection riêng có <code>postId</code>, cộng một subset vài bình luận mới nhất trong bài viết (Bài 3.3) và một bộ đếm.</p>

<h3>2 · Tài liệu phình</h3>
<p>Trang danh sách sản phẩm cần tên và giá. Nhưng mỗi tài liệu sản phẩm còn mang theo 100 KB mô tả (và ở dự án thật, cả ảnh base64). Chạy nó trên một máy chủ có cache nhỏ so với dữ liệu — 0,25 GB, đúng hoàn cảnh của mọi máy chủ production có dữ liệu lớn hơn RAM:</p>
${lenh('s03-5-anti', 2)}
${lenh('s03-5-anti', 3)}
<p>Trang chỉ hỏi hai trường nhỏ, nhưng WiredTiger cache nguyên tài liệu: liệt kê mười trang của collection phình đã kéo hàng trăm megabyte vào một cache 256 MB — và ở lượt thứ hai nó phải đọc lại lần nữa, vì chúng đã bị đẩy ra khỏi cache. Collection gọn đọc chưa tới nửa megabyte ở lần đầu và gần như không đọc gì ở các lần sau (nó nằm yên trong cache). Projection giảm thứ đi qua mạng; nó không giảm thứ máy chủ phải đọc. Cách sửa: tách các trường lớn, ít đọc sang collection riêng (<code>productDetails</code>, một–một theo <code>_id</code>) chỉ trang chi tiết mới đọc, và cất tệp ở object storage, chỉ giữ URL.</p>
${lenh('s03-5-anti', 4)}

<h3>3 · Quá nhiều collection</h3>
<p>Một thiết kế "nhiều khách thuê" (multi-tenant) tạo mỗi khách hàng một collection (<code>khach_0</code>, <code>khach_1</code>, …). Mỗi collection là một tệp WiredTiger, mỗi index là một tệp nữa. Trên máy lab này, Docker mặc định cho mỗi container 1.024 tệp mở — một giá trị mặc định phổ biến trên Linux. Tạo collection cho tới khi có thứ gì đó gãy:</p>
${lenh('s03-5-anti', 5)}
${lenh('s03-5-anti', 6)}
${lenh('s03-5-anti', 7)}
<p>Máy chủ không từ chối yêu cầu — nó <strong>sập</strong>. WiredTiger không mở được thêm tệp (errno 24, "Too many open files"), MongoDB coi một lỗi lưu trữ không cứu được là lỗi chết người (<code>fassert</code>) và tự huỷ, còn container thoát với mã 139. Mọi ứng dụng đang nối tới cơ sở dữ liệu này đều mất nó, không riêng ứng dụng đang tạo collection. Nhật ký còn cho thấy cảnh báo máy chủ đã in lúc khởi động — "Soft rlimits for open file descriptors too low" — thứ chẳng ai đọc cho tới sau sự cố. Hướng dẫn production của MongoDB khuyên tối thiểu 64.000 tệp mở; với giới hạn đó, cùng 3.000 collection tạo thành công, và bạn thấy được chúng tốn gì:</p>
${lenh('s03-5-anti', 8)}
${lenh('s03-5-anti', 9)}
<p>3.000 collection rỗng = 6.011 tệp dữ liệu, khoảng 6.000 bộ mô tả tệp đang mở và 12.020 data handle bên trong máy chủ, và khoảng một phút chỉ để tạo chúng (55–72 giây qua các lần chạy của bài). Tệp nào cũng được checkpoint, handle nào cũng tốn bộ nhớ, khởi động và sao lưu chậm đi. Tài liệu MongoDB ghi "reduce number of collections" chính vì lý do này. Cách sửa cho bài toán nhiều khách thuê thường là <em>một</em> collection có trường <code>tenantId</code> đứng đầu mọi index (<code>{ tenantId: 1, … }</code>) — chỉ dùng mỗi khách một database khi cách ly là yêu cầu bắt buộc và số khách ít.</p>
${nguon('📘', 'UNIX ulimit Settings — MongoDB Docs', 'Khuyến nghị 64000 tệp mở; thấp hơn thì có cảnh báo lúc khởi động', 'https://www.mongodb.com/docs/manual/reference/ulimit/')}
${lenh('s03-5-anti', 10)}

<h3>4 · Index thừa</h3>
<p>Mỗi index làm nhanh vài lần đọc và làm chậm mọi lần ghi, vì mỗi lần chèn và mỗi lần sửa một trường có index đều phải cập nhật cả index. Chèn cùng 20.000 tài liệu vào một collection chỉ có <code>_id</code> và một collection có thêm tám index:</p>
${lenh('s03-5-anti', 11)}
${lenh('s03-5-anti', 12)}
<p>Tám index thừa làm lệnh chèn chậm đi thấy rõ và dung lượng index lớn hơn khoảng 8,6 lần (4,47 MB so với 0,52 MB) — mà dung lượng index thì muốn nằm trong RAM, tranh chỗ với dữ liệu của bạn. <code>$indexStats</code> cho biết mỗi index đã được dùng bao nhiêu lần từ khi máy chủ khởi động: ở đây cái nào cũng là 0. Trên một máy chủ production đã chạy vài tuần, index có 0 lượt dùng là ứng viên để gỡ (ẩn nó trước bằng <code>hideIndex</code> để chắc không có gì chậm đi — Chương 4).</p>

<h3>5 · $lookup ở khắp nơi</h3>
<p>Bạn đã đo cái này ở Bài 3.1: dựng trang đơn hàng bằng <code>$lookup</code> chậm hơn đọc một tài liệu nhúng, ở từng lượt xem trang. Một schema dịch từng bảng từ SQL sang cuối cùng sẽ có <code>$lookup</code> trong mọi API. Lời khuyên của tài liệu MongoDB chính là luật của chương này: dữ liệu đọc cùng nhau thì cất cùng nhau; để dành <code>$lookup</code> cho truy vấn thỉnh thoảng và truy vấn phân tích.</p>

<h3>🔥 Chuyện có thật: Discord, 2015</h3>
<p>Blog kỹ thuật của Discord (tháng 1/2017, "How Discord Stores Billions of Messages") kể lại kho tin nhắn đầu tiên của họ. Discord được dựng trong chưa đầy hai tháng đầu năm 2015; mọi thứ nằm trong một replica set MongoDB duy nhất, và tin nhắn ở một collection với một index ghép duy nhất trên <code>channel_id</code> và <code>created_at</code>. Khoảng tháng 11/2015 họ chạm mốc 100 triệu tin nhắn được lưu và "dữ liệu cùng index không còn vừa RAM, độ trễ bắt đầu thất thường". Các lần đọc của họ rải ngẫu nhiên khắp các kênh và tỉ lệ đọc/ghi khoảng 50/50. Họ chuyển tin nhắn sang Cassandra.</p>
<p>Bài học không phải "MongoDB không lưu được tin nhắn". Đó là bài học tài liệu phình ở quy mô cả một collection: <strong>working set</strong> (dữ liệu và index mà ứng dụng thường xuyên chạm tới) đã lớn hơn bộ nhớ, nên phần lớn lần đọc phải xuống đĩa. Họ cũng đã quyết định từ sớm là không dùng sharding của MongoDB (Chương 7). Để ý điều họ làm đúng: họ "lên kế hoạch mọi thứ để dễ chuyển đổi" ngay từ ngày đầu, và họ hiểu rõ cách đọc/ghi của mình trước khi chọn cơ sở dữ liệu tiếp theo — cũng là lối nghĩ đặt tải công việc lên trước như Bài 3.1.</p>
${nguon('📝', 'How Discord Stores Billions of Messages — blog Discord (2017)', 'Replica set MongoDB, 100 triệu tin nhắn vào 11/2015, dữ liệu + index vượt RAM', 'https://discord.com/blog/how-discord-stores-billions-of-messages')}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">mảng không giới hạn</span><span class="lz-t">mỗi lần push chậm hơn, rồi lỗi 10334 ở 16 MiB</span><span class="lz-d">collection con + subset + bộ đếm</span></div>
  <div class="lz-step"><span class="lz-k">tài liệu phình</span><span class="lz-t">cache đầy những trường chẳng ai đọc</span><span class="lz-d">tách trường lớn ít đọc theo quan hệ một–một; tệp để ở object storage</span></div>
  <div class="lz-step"><span class="lz-k">quá nhiều collection</span><span class="lz-t">cạn tệp mở ⇒ mongod sập</span><span class="lz-d">một collection + tenantId; ulimit ≥ 64000</span></div>
  <div class="lz-step"><span class="lz-k">index thừa</span><span class="lz-t">ghi chậm hơn, RAM tốn cho index không dùng</span><span class="lz-d">$indexStats, ẩn rồi mới xoá</span></div>
  <div class="lz-step"><span class="lz-k">$lookup khắp nơi</span><span class="lz-t">lần đọc nào cũng trả giá một phép join</span><span class="lz-d">nặn lại tài liệu quanh các lần đọc nóng</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thử schema bằng dữ liệu cỡ demo.</strong> Mọi anti-pattern trong bài này đều vô hình với 50 tài liệu: mảng còn nhỏ, cache chứa được hết, 20 collection chẳng sao, index thừa chẳng tốn gì. Trước buổi review thiết kế, hãy sinh dữ liệu đúng cỡ bạn dự kiến sau một năm (bộ nạp ở lab này chạy trong vài giây) và xem cỡ tài liệu, lượng đọc vào cache, số tệp. "Máy em chạy được" với 50 dòng không phải bằng chứng.</p>
</div>

<h3>💼 Đi làm: buổi rút kinh nghiệm sau sự cố</h3>
<p>Sự cố do schema thường kết thúc bằng một buổi post-mortem với dòng thời gian: "03:12 ghi vào <code>posts</code> lỗi 10334", "03:40 vá nóng: bình luận chuyển sang collection mới". Là người mới, thứ có ích nhất bạn mang tới được là bản tái hiện — một kịch bản như của bài này, kích hoạt lỗi trong container dùng xong bỏ, để cả đội thử được cách sửa. Và thêm phép kiểm tương ứng vào mẫu tài liệu thiết kế: "mọi mảng có giới hạn trên", "không mỗi khách một collection", "đã kiểm ulimit".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Chuyện gì xảy ra khi một tài liệu chạm 16 MB?"</strong> — Lệnh ghi làm nó vượt giới hạn sẽ thất bại (lỗi 10334); trước đó, mỗi lần cập nhật tài liệu đang phình đều chậm dần vì cả tài liệu được ghi lại.</li>
<li><strong>"Sao mỗi khách một collection lại là ý tồi?"</strong> — Mỗi collection và mỗi index là một tệp; hàng nghìn cái làm cạn tệp mở (máy chủ có thể sập), tốn bộ nhớ và thời gian checkpoint. Dùng một trường tenant đứng đầu các index.</li>
<li><strong>"Tìm index không dùng thế nào?"</strong> — <code>$indexStats</code> (<code>accesses.ops</code> từ lúc khởi động), rồi <code>hideIndex</code> trước khi xoá.</li>
<li><strong>"Working set là gì, sao nó quan trọng?"</strong> — Dữ liệu và index được truy cập thường xuyên; khi nó vượt RAM, lần đọc phải xuống đĩa và độ trễ trở nên thất thường (Discord 2015).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Thiết kế lại bài viết viral: bình luận ở collection riêng, bài viết giữ 3 bình luận mới nhất và một bộ đếm. Chèn 5.000 bình luận và cho thấy bài viết vẫn dưới 2 KB.</li>
<li>Tách <code>phinh</code> thành <code>sp</code> (name, price, cat) và <code>spChiTiet</code> (<code>_id</code>, mô tả). Chạy lại phép đo cache ở trang danh sách. (Tự dựng một container dùng xong bỏ với <code>--wiredTigerCacheSizeGB 0.25</code>, như trong bài.)</li>
<li>Trên lab của bạn, chạy <code>docker exec mgo-lab bash -c 'grep "open files" /proc/1/limits'</code>. Nếu giới hạn mềm dưới 64.000, thêm <code>ulimits: { nofile: { soft: 64000, hard: 64000 } }</code> vào service trong <code>compose.yaml</code> rồi kiểm lại.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>db.cmt.createIndex({ postId: 1, at: -1 })</code>; với mỗi bình luận: <code>db.cmt.insertOne({ postId: 1, at: new Date(), text })</code> và <code>db.post.updateOne({ _id: 1 }, { $push: { moi: { $each: [{ text: text.slice(0, 200), at }], $position: 0, $slice: 3 } }, $inc: { soBinhLuan: 1 } })</code>. Chỉ 3 bình luận mới nhất (đã cắt ngắn) nằm trong bài viết; <code>$bsonSize</code> không đổi dù có bao nhiêu bình luận tới.</p>
<p>2. Trang danh sách giờ chỉ đọc <code>sp</code>, chưa tới một megabyte; <code>bytes read into cache</code> gần như không tăng ở lượt thứ hai. Trang chi tiết đọc <code>spChiTiet</code> theo <code>_id</code> — một tài liệu, thêm một truy vấn chỉ ở trang đó.</p>
<p>3. Trên Docker Desktop (Mac/Windows) giới hạn thường đã cao sẵn; trên máy chủ Linux giới hạn mềm hay là 1.024. Sau <code>docker compose -p mgo up -d</code>, dòng đó hiện 64000. Cảnh báo khởi động "Soft rlimits for open file descriptors too low" biến mất khỏi <code>docker logs mgo-lab</code>.</p>
</details>
<p><strong>Xong khi:</strong> với mỗi anti-pattern trong năm cái, bạn mô tả được triệu chứng sẽ thấy trên production và cách thiết kế lại.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Anti-pattern', 'Thiết kế chạy được ở quy mô nhỏ nhưng hỏng hoặc xuống cấp khi dữ liệu lớn lên.'],
  ['Mảng không giới hạn', 'Mảng không có giới hạn trên; mỗi lần push ghi lại một tài liệu ngày càng lớn cho tới khi giới hạn 16 MiB chặn mọi lệnh ghi.'],
  ['Tài liệu phình', 'Tài liệu mang theo các trường lớn mà những lần đọc thường xuyên không cần, phí cache và I/O.'],
  ['Working set', 'Dữ liệu và index ứng dụng truy cập thường xuyên; nên vừa trong RAM.'],
  ['ulimit / nofile', 'Giới hạn của hệ điều hành về số tệp mở mỗi tiến trình; MongoDB khuyên ≥ 64.000.'],
  ['$indexStats', 'Stage aggregation báo mỗi index đã được dùng bao nhiêu lần từ lúc khởi động.'],
  ['Multi-tenant (nhiều khách thuê)', 'Một hệ thống phục vụ nhiều khách hàng; thường là một collection có tenantId, không phải mỗi khách một collection.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mảng không giới hạn: lệnh push chậm dần khi tài liệu lớn lên, rồi bình luận thứ 4.166 lỗi ở 16 MiB.</li>
<li>Tài liệu phình: hỏi hai trường, hàng trăm MB bị kéo qua một cache 256 MB.</li>
<li>Quá nhiều collection: với 1.024 tệp mở, mongod sập (errno 24, fassert); 3.000 collection = 6.011 tệp.</li>
<li>Index thừa: dung lượng index ×8,6, chèn chậm hơn, <code>$indexStats</code> 0 lượt dùng.</li>
<li>Discord 2015: dữ liệu + index vượt RAM ở mốc 100 triệu tin nhắn — working set quyết định hiệu năng.</li>
<li>Thử schema bằng khối lượng dữ liệu thực tế trước buổi review thiết kế.</li>
</ul>
</div>
`,
};
