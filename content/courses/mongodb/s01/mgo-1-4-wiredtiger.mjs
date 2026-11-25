/**
 * 1.4 — Bên trong máy chủ: WiredTiger, bộ đệm, journal và nén (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s01-4-wt'] (mgo-lab trên máy 31.915 MB RAM; container phụ mgo-wt --network none --memory 2g,
 * kịch bản demo/s01/s01-4-wt.txt + ../_demo/nen-thu.js). Số uptime/checkpoint ở lệnh cuối đổi mỗi lần chạy — lời không trích số đó.
 * Nguồn GET kiểm 24/11/2026: MongoDB Docs WiredTiger (công thức 50% of (RAM - 1GB) / 256MB), Journaling; Jepsen MongoDB 4.2.6.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '1.4 — Inside the server: WiredTiger, cache, journal and compression|||1.4 — Bên trong máy chủ: WiredTiger, bộ đệm, journal và nén',
  slug: 'mgo-1-4-wiredtiger',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Điều gì xảy ra sau khi bạn bấm insert: lớp truy vấn, bộ đệm WiredTiger, journal ghi trước, checkpoint 60 giây, tệp dữ liệu nén. Đo thật: lab chiếm sẵn 15.445 MB bộ đệm vì container không giới hạn RAM, giới hạn 2 GB thì còn 512 MB; cùng 7,9 MB log nén snappy 4,59× và zstd 9,07×; giết mongod bằng kill -9 giữa chừng, khởi động lại "không sạch" mà dữ liệu j:true còn nguyên. Khoá mức tài liệu và WriteConflict.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Inside the server: WiredTiger, cache, journal and compression</h2>
<p class="lead">You do not need to read MongoDB's source to use it well, but you do need a correct picture of what happens between "insertOne returned" and "the bytes are safe on disk". That picture explains why a MongoDB container can eat half your RAM, why a crash does not lose acknowledged writes, why your 8 MB of logs takes under 1 MB on disk, and why two updates to the same document conflict while updates to different documents do not. Everything below is measured on your lab.</p>

<h3>An everyday picture: the kitchen of a busy restaurant</h3>
<p>Orders come in all evening. The chef does not walk to the cold store for every plate: the ingredients in use sit on the <strong>counter</strong> (the cache). Every order is first written on a <strong>ticket rail</strong> (the journal) — quick, in order, never rewritten. Every so often the kitchen <strong>restocks and tidies the cold store</strong> from the counter in one go (a checkpoint). If the power cuts mid-evening, the manager re-opens, looks at the last tidy state of the cold store, and replays the tickets written since then. Nothing confirmed to a customer is lost.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Your app / mongosh</span><span class="lz-lnote">sends BSON commands over TCP</span></div>
  <div class="lz-layer"><span class="lz-lname">mongod: query layer</span><span class="lz-lnote">parses, plans (picks indexes — Chapter 4), checks the validator</span></div>
  <div class="lz-layer"><span class="lz-lname">WiredTiger cache (RAM)</span><span class="lz-lnote">uncompressed pages of documents and indexes; default 50% of (RAM − 1 GB), at least 256 MB</span></div>
  <div class="lz-layer"><span class="lz-lname">Journal (write-ahead log)</span><span class="lz-lnote">every change appended here; flushed to disk at least every 100 ms, or immediately for j:true writes</span></div>
  <div class="lz-layer"><span class="lz-lname">Data files (collection-*.wt, index-*.wt)</span><span class="lz-lnote">compressed blocks; rewritten by a checkpoint every 60 s</span></div>
  <div class="lz-layer"><span class="lz-lname">OS file-system cache</span><span class="lz-lnote">the rest of RAM — holds compressed blocks, so a cache miss is often still served from memory</span></div>
</div>

<h3>The cache: why your lab already reserved 15 GB</h3>
${lenh('s01-4-wt', 0)}
${lenh('s01-4-wt', 1)}
<p>The lab container has no memory limit, so <code>mongod</code> sees the whole machine (31,915 MB here) and sets its WiredTiger cache to <strong>50% of (RAM − 1 GB)</strong> = 15,445 MB. It uses only what it needs right now (a few hundred MB for CT Shop), but under load it is <em>allowed</em> to grow to 15 GB. The rule comes from the documentation: the larger of 50% of (RAM − 1 GB) or 256 MB.</p>
<p>Now start a second server, <code>mgo-wt</code>, first with an explicit cache size, then with a 2 GB container limit:</p>
${lenh('s01-4-wt', 2)}
${lenh('s01-4-wt', 3)}
<p><code>--wiredTigerCacheSizeGB 0.25</code> gives exactly 256 MB. With <code>--memory 2g</code> and no option, MongoDB reads the container limit and computes 50% × (2,048 − 1,024) = 512 MB. Two practical rules:</p>
<ul>
<li><strong>Running several <code>mongod</code> on one machine</strong> (a replica set on a laptop in Chapter 7, or two services on a cheap VM)? Each one calculates from the <em>whole</em> RAM unless limited. Three of them each "allowed" 15 GB on a 31 GB host is how you meet the Linux OOM killer. Set a container memory limit or <code>--wiredTigerCacheSizeGB</code>.</li>
<li><strong>Do not give the cache all the RAM.</strong> The rest is used by connections (about 1 MB each), aggregation stages, and the OS file-system cache, which holds the compressed data files. Raising the cache to 90% often makes things slower.</li>
</ul>
<p>The cache holds the <strong>working set</strong>: the documents and index pages your queries touch often. When the working set fits in cache, reads are memory-speed; when it does not, every query waits for disk. "Does my working set fit in RAM?" is the first capacity question for any MongoDB deployment (Chapter 10 measures it under load).</p>

<h3>Compression: the same data, three sizes on disk</h3>
<p>WiredTiger compresses data blocks before writing them. Each collection can choose its compressor. The script <code>_demo/nen-thu.js</code> writes the same 50,000 log documents into three collections:</p>
${lenh('s01-4-wt', 4)}
<p>7.90 MB of BSON becomes 8.30 MB with no compression (block overhead), 1.72 MB with <strong>snappy</strong> (the default — fast, about 4.6× here), and 0.87 MB with <strong>zstd</strong> (about 9×, a little more CPU). Logs are very repetitive (the same user agent 50,000 times), so the ratio is high; real order data compresses less. Two facts to remember: (1) compression applies on disk, <em>not</em> in the WiredTiger cache — RAM still holds uncompressed pages; (2) you choose per collection at creation, or for the whole server with <code>--wiredTigerCollectionBlockCompressor zstd</code>. Indexes use <strong>prefix compression</strong> separately (repeated key prefixes stored once).</p>
${lenh('s01-4-wt', 5)}
<p>On disk each collection and each index is its own <code>.wt</code> file, and the journal is a separate directory of log files. That layout is why <code>cp -r /data/db</code> while <code>mongod</code> runs does not give you a valid backup (Chapter 10).</p>

<h3>Journal and checkpoints: kill the server, keep the data</h3>
<p>Every 60 seconds (<code>syncdelay</code>) WiredTiger writes a <strong>checkpoint</strong>: a consistent snapshot of all data files. Between checkpoints, changes live in the cache and in the <strong>journal</strong>, a write-ahead log that is cheap to append. With write concern <code>j: true</code>, the server acknowledges only after the journal entry is on disk. Prove it: write two orders with <code>j: true</code>, then kill the process with <code>SIGKILL</code> — no shutdown, no flushing, like a power cut:</p>
${lenh('s01-4-wt', 6)}
${lenh('s01-4-wt', 7)}
${lenh('s01-4-wt', 8)}
${lenh('s01-4-wt', 9)}
<p>The log shows two starts: the first <code>"Startup from clean shutdown?":true</code> (the fresh container), the second <code>false</code> — the server knew it had crashed, opened the last checkpoint and replayed the journal. Both orders are there. Your server's checkpoint counters:</p>
${lenh('s01-4-wt', 10)}
<p>The checkpoint generation keeps growing while the server runs (one every 60 seconds, plus extra ones forced by commands such as <code>fsync</code>). Your numbers differ from these — they depend on how long your lab has been up.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "acknowledged means it is on disk".</strong> On a standalone server with <code>j: false</code>, an acknowledged write may sit only in memory for up to 100 ms (the journal flush interval) — a crash in that window loses it. On a replica set, the default write concern is <code>w: 'majority'</code>, which also waits for the journal on a majority of members. In 2020 the Jepsen analysis of MongoDB 4.2.6 showed acknowledged writes lost or read inconsistently under weaker settings. Chapter 6 tests write and read concerns properly; for now: money writes use majority.</p>
</div>
${nguon('🔬', 'Jepsen: MongoDB 4.2.6 (2020)', 'Independent test: which read/write concern settings keep acknowledged data', 'https://jepsen.io/analyses/mongodb-4.2.6')}

<h3>Concurrency: document-level, optimistic</h3>
<p>WiredTiger lets many operations modify <em>different</em> documents of the same collection at the same time — no collection-wide lock (the old MMAPv1 engine, removed in MongoDB 4.2, locked whole collections). It uses <strong>optimistic concurrency control</strong>: two operations that try to change the <em>same</em> document at the same moment produce a <code>WriteConflict</code> internally; MongoDB retries the loser automatically for single-document writes. Inside multi-document transactions the conflict is returned to you as a transient error to retry (Chapter 6). Design consequence: a single "hot" document that every request updates — a global counter, one cart shared by everyone — becomes a queue. Spread hot writes over many documents (Chapter 3 patterns).</p>
${nguon('📘', 'WiredTiger Storage Engine — MongoDB Docs', 'Cache sizing, compression, document-level concurrency', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
${nguon('📘', 'Journaling — MongoDB Docs', 'Write-ahead log, checkpoints, flush intervals', 'https://www.mongodb.com/docs/manual/core/journaling/')}

<h3>💼 At work: "MongoDB is eating all the RAM"</h3>
<p>The ops engineer on your project messages: "the <code>mongo</code> container uses 9 GB on the 16 GB VM, and the Java service got OOM-killed last night". You now know what to check: <code>db.serverStatus().wiredTiger.cache['maximum bytes configured']</code> — on a 16 GB VM with no limit it is 7.5 GB, by design. Not a leak. Fix: give the container a memory limit or set <code>--wiredTigerCacheSizeGB</code> so mongo, the JVM heap and the OS cache all fit; then watch <code>bytes currently in the cache</code> and page-fault metrics before and after.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How much RAM does MongoDB use?"</strong> — WiredTiger cache defaults to 50% of (RAM − 1 GB), minimum 256 MB; the rest goes to connections and the OS file cache. In containers it respects the memory limit.</li>
<li><strong>"How does MongoDB survive a crash?"</strong> — Checkpoints every 60 s plus a write-ahead journal; on restart it loads the last checkpoint and replays the journal. Writes acknowledged with <code>j: true</code> or <code>w: 'majority'</code> survive.</li>
<li><strong>"What locking does MongoDB use?"</strong> — Document-level optimistic concurrency in WiredTiger; conflicts on the same document are retried.</li>
<li><strong>"snappy or zstd?"</strong> — snappy (default) is faster; zstd compresses more for a little more CPU — good for logs and archives. Compression is on disk only.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Compute the default cache size for: a laptop with 16 GB, a container limited to 4 GB, a container limited to 1 GB.</li>
<li>Run <code>db.orders.stats()</code> in <code>ctshop</code> after <code>db.adminCommand({ fsync: 1 })</code>. Compute <code>size / storageSize</code>. Why is it lower than for the log collections?</li>
<li>Recreate the orders as a zstd collection (<code>createCollection</code> with <code>storageEngine</code>, then <code>aggregate([{ $match: {} }, { $out: 'orders_zstd' }])</code> into it) and compare <code>storageSize</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. 7.5 GB; 1.5 GB; 256 MB (50% × 0 GB is below the minimum). 2. Orders are more varied than logs (different names, prices, items), so snappy finds fewer repeats — on our lab 780,302 / 380,928 ≈ 2.05×, against 4.59× for the logs. 3. <code>db.createCollection('orders_zstd', { storageEngine: { wiredTiger: { configString: 'block_compressor=zstd' } } })</code>, then <code>db.orders.aggregate([{ $match: {} }, { $out: 'orders_zstd' }])</code> — <code>$out</code> into an existing collection keeps its options. On our lab: 118,784 bytes with zstd against 380,928 with snappy — about 3.2× smaller.</p>
</details>
<p><strong>Done when:</strong> you can draw the layer diagram above from memory and say where a write goes first.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Storage engine', 'The component that stores data on disk and in memory. Default since MongoDB 3.2: WiredTiger.'],
  ['WiredTiger cache', 'RAM area holding uncompressed data and index pages; default 50% of (RAM − 1 GB), min 256 MB.'],
  ['Working set', 'Data and index pages your workload touches often — should fit in the cache.'],
  ['Journal', 'Write-ahead log; replayed after a crash. <code>j: true</code> waits until the entry is on disk.'],
  ['Checkpoint', 'Consistent snapshot of data files written every 60 s (<code>syncdelay</code>).'],
  ['Block compressor', 'snappy (default), zstd, zlib or none — per collection, on disk only.'],
  ['WriteConflict', 'Two operations changing the same document at once; retried automatically outside transactions.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>A write goes query layer → cache → journal → (later) data files via checkpoints.</li>
<li>Cache = 50% of (RAM − 1 GB): 15,445 MB on the 31 GB lab host, 512 MB in a 2 GB container. Limit it when several services share a machine.</li>
<li>Compression on disk: 7.90 MB → 1.72 MB snappy → 0.87 MB zstd for repetitive logs.</li>
<li><code>kill -9</code> after <code>j: true</code> writes: unclean restart, data intact.</li>
<li>Locking is per document; a hot document is a bottleneck by design.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Bên trong máy chủ: WiredTiger, bộ đệm, journal và nén</h2>
<p class="lead">Bạn không cần đọc mã nguồn MongoDB để dùng nó giỏi, nhưng bạn cần một bức tranh đúng về những gì xảy ra giữa lúc "insertOne trả về" và lúc "các byte đã nằm an toàn trên đĩa". Bức tranh đó giải thích vì sao một container MongoDB có thể nuốt nửa RAM của bạn, vì sao máy sập không làm mất lệnh ghi đã xác nhận, vì sao 8 MB log chỉ chiếm chưa tới 1 MB trên đĩa, và vì sao hai lệnh sửa cùng một tài liệu thì xung đột còn sửa hai tài liệu khác nhau thì không. Mọi thứ dưới đây đều đo trên lab của bạn.</p>

<h3>Hình ảnh đời thường: gian bếp của một quán đông khách</h3>
<p>Đơn tới suốt buổi tối. Đầu bếp không chạy vào kho lạnh cho từng đĩa: nguyên liệu đang dùng bày sẵn trên <strong>bàn bếp</strong> (bộ đệm). Mỗi đơn được ghi trước tiên lên <strong>thanh kẹp phiếu</strong> (journal) — nhanh, theo thứ tự, không bao giờ viết lại. Thỉnh thoảng bếp <strong>dọn và xếp lại kho lạnh</strong> từ bàn bếp một lượt (checkpoint). Nếu mất điện giữa buổi, quản lý mở lại, nhìn trạng thái gọn gàng gần nhất của kho lạnh, rồi làm lại các phiếu đã ghi từ lúc đó. Không món nào đã hứa với khách bị mất.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ứng dụng / mongosh</span><span class="lz-lnote">gửi lệnh BSON qua TCP</span></div>
  <div class="lz-layer"><span class="lz-lname">mongod: lớp truy vấn</span><span class="lz-lnote">phân tích, lập kế hoạch (chọn index — Chương 4), kiểm validator</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ đệm WiredTiger (RAM)</span><span class="lz-lnote">các trang tài liệu và index chưa nén; mặc định 50% của (RAM − 1 GB), tối thiểu 256 MB</span></div>
  <div class="lz-layer"><span class="lz-lname">Journal (nhật ký ghi trước)</span><span class="lz-lnote">mọi thay đổi được nối vào đây; đẩy xuống đĩa ít nhất mỗi 100 ms, hoặc ngay lập tức với lệnh ghi j:true</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệp dữ liệu (collection-*.wt, index-*.wt)</span><span class="lz-lnote">các khối đã nén; được checkpoint ghi lại mỗi 60 giây</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ đệm tệp của hệ điều hành</span><span class="lz-lnote">phần RAM còn lại — giữ các khối đã nén, nên trượt bộ đệm vẫn thường được phục vụ từ bộ nhớ</span></div>
</div>

<h3>Bộ đệm: vì sao lab của bạn đã giữ chỗ 15 GB</h3>
${lenh('s01-4-wt', 0)}
${lenh('s01-4-wt', 1)}
<p>Container lab không giới hạn bộ nhớ, nên <code>mongod</code> thấy cả máy (ở đây 31.915 MB) và đặt bộ đệm WiredTiger bằng <strong>50% của (RAM − 1 GB)</strong> = 15.445 MB. Nó chỉ dùng phần đang cần (vài trăm MB cho CT Shop), nhưng khi tải nặng nó <em>được phép</em> phình tới 15 GB. Luật này lấy từ tài liệu chính thức: giá trị lớn hơn giữa 50% của (RAM − 1 GB) và 256 MB.</p>
<p>Giờ bật máy chủ thứ hai, <code>mgo-wt</code>, lần đầu với cỡ bộ đệm đặt tay, lần sau với giới hạn container 2 GB:</p>
${lenh('s01-4-wt', 2)}
${lenh('s01-4-wt', 3)}
<p><code>--wiredTigerCacheSizeGB 0.25</code> cho đúng 256 MB. Với <code>--memory 2g</code> và không tuỳ chọn gì, MongoDB đọc giới hạn của container và tính 50% × (2.048 − 1.024) = 512 MB. Hai luật thực tế:</p>
<ul>
<li><strong>Chạy nhiều <code>mongod</code> trên một máy</strong> (replica set trên laptop ở Chương 7, hay hai dịch vụ trên một VM rẻ)? Mỗi tiến trình tự tính theo <em>toàn bộ</em> RAM nếu không bị giới hạn. Ba tiến trình, mỗi cái "được phép" 15 GB trên máy 31 GB, là cách bạn gặp sát thủ OOM của Linux. Hãy đặt giới hạn bộ nhớ cho container hoặc <code>--wiredTigerCacheSizeGB</code>.</li>
<li><strong>Đừng đưa hết RAM cho bộ đệm.</strong> Phần còn lại dành cho các kết nối (khoảng 1 MB mỗi kết nối), các bước aggregation, và bộ đệm tệp của hệ điều hành — nơi giữ các tệp dữ liệu đã nén. Nâng bộ đệm lên 90% thường làm mọi thứ chậm hơn.</li>
</ul>
<p>Bộ đệm giữ <strong>working set</strong> (tập dữ liệu đang làm việc): các tài liệu và trang index mà truy vấn của bạn hay chạm tới. Khi working set vừa bộ đệm, đọc nhanh như bộ nhớ; khi không vừa, truy vấn nào cũng phải chờ đĩa. "Working set của tôi có vừa RAM không?" là câu hỏi dung lượng đầu tiên của mọi hệ MongoDB (Chương 10 đo nó dưới tải).</p>

<h3>Nén: cùng dữ liệu, ba kích thước trên đĩa</h3>
<p>WiredTiger nén các khối dữ liệu trước khi ghi. Mỗi collection chọn được bộ nén riêng. Script <code>_demo/nen-thu.js</code> ghi cùng 50.000 tài liệu log vào ba collection:</p>
${lenh('s01-4-wt', 4)}
<p>7,90 MB BSON thành 8,30 MB khi không nén (phần đầu khối cộng thêm), 1,72 MB với <strong>snappy</strong> (mặc định — nhanh, khoảng 4,6 lần ở đây), và 0,87 MB với <strong>zstd</strong> (khoảng 9 lần, tốn CPU hơn một chút). Log lặp lại rất nhiều (cùng một chuỗi trình duyệt 50.000 lần), nên tỉ lệ cao; dữ liệu đơn hàng thật nén ít hơn. Hai điều cần nhớ: (1) nén chỉ áp dụng trên đĩa, <em>không</em> trong bộ đệm WiredTiger — RAM vẫn giữ trang chưa nén; (2) bạn chọn theo từng collection lúc tạo, hoặc cho cả máy chủ bằng <code>--wiredTigerCollectionBlockCompressor zstd</code>. Index dùng <strong>nén tiền tố</strong> riêng (phần đầu khoá lặp lại chỉ lưu một lần).</p>
${lenh('s01-4-wt', 5)}
<p>Trên đĩa, mỗi collection và mỗi index là một tệp <code>.wt</code> riêng, còn journal là một thư mục tệp log riêng. Cách sắp xếp đó là lý do <code>cp -r /data/db</code> khi <code>mongod</code> đang chạy không cho bạn một bản sao lưu dùng được (Chương 10).</p>

<h3>Journal và checkpoint: giết máy chủ, giữ dữ liệu</h3>
<p>Cứ 60 giây (<code>syncdelay</code>) WiredTiger ghi một <strong>checkpoint</strong>: ảnh chụp nhất quán của mọi tệp dữ liệu. Giữa hai checkpoint, thay đổi nằm trong bộ đệm và trong <strong>journal</strong>, một nhật ký ghi trước rất rẻ để nối thêm. Với write concern <code>j: true</code>, máy chủ chỉ xác nhận sau khi mục journal đã nằm trên đĩa. Chứng minh: ghi hai đơn với <code>j: true</code>, rồi giết tiến trình bằng <code>SIGKILL</code> — không tắt máy, không đẩy dữ liệu, như mất điện:</p>
${lenh('s01-4-wt', 6)}
${lenh('s01-4-wt', 7)}
${lenh('s01-4-wt', 8)}
${lenh('s01-4-wt', 9)}
<p>Log cho thấy hai lần khởi động: lần đầu <code>"Startup from clean shutdown?":true</code> (container mới), lần sau <code>false</code> — máy chủ biết nó vừa sập, mở checkpoint gần nhất và chạy lại journal. Cả hai đơn vẫn còn. Bộ đếm checkpoint của máy chủ:</p>
${lenh('s01-4-wt', 10)}
<p>Số thế hệ checkpoint cứ tăng khi máy chủ chạy (60 giây một lần, cộng thêm các lần bị ép bởi lệnh như <code>fsync</code>). Số của bạn sẽ khác số ở đây — nó phụ thuộc lab của bạn đã chạy bao lâu.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "đã xác nhận nghĩa là đã nằm trên đĩa".</strong> Trên máy chủ đơn với <code>j: false</code>, một lệnh ghi đã xác nhận có thể chỉ nằm trong bộ nhớ tới 100 ms (chu kỳ đẩy journal) — sập trong khoảng đó là mất. Trên replica set, write concern mặc định là <code>w: 'majority'</code>, chờ cả journal trên đa số thành viên. Năm 2020, bản phân tích Jepsen về MongoDB 4.2.6 cho thấy lệnh ghi đã xác nhận bị mất hoặc đọc không nhất quán khi dùng thiết lập yếu hơn. Chương 6 kiểm read concern và write concern bài bản; còn bây giờ: lệnh ghi liên quan tới tiền dùng majority.</p>
</div>
${nguon('🔬', 'Jepsen: MongoDB 4.2.6 (2020)', 'Kiểm thử độc lập: thiết lập read/write concern nào giữ được dữ liệu đã xác nhận', 'https://jepsen.io/analyses/mongodb-4.2.6')}

<h3>Đồng thời: khoá mức tài liệu, kiểu lạc quan</h3>
<p>WiredTiger cho nhiều thao tác sửa các tài liệu <em>khác nhau</em> trong cùng collection cùng lúc — không có khoá cả collection (bộ máy MMAPv1 cũ, bị gỡ ở MongoDB 4.2, khoá nguyên collection). Nó dùng <strong>kiểm soát đồng thời lạc quan</strong>: hai thao tác cùng lúc sửa <em>cùng một</em> tài liệu sinh ra một <code>WriteConflict</code> bên trong; với lệnh ghi một tài liệu, MongoDB tự thử lại cho bên thua. Trong transaction nhiều tài liệu, xung đột được trả về cho bạn thành lỗi tạm thời để thử lại (Chương 6). Hệ quả với thiết kế: một tài liệu "nóng" mà mọi request đều sửa — một bộ đếm toàn cục, một giỏ hàng chung cho mọi người — sẽ biến thành hàng đợi. Hãy rải lệnh ghi nóng ra nhiều tài liệu (các pattern ở Chương 3).</p>
${nguon('📘', 'WiredTiger Storage Engine — MongoDB Docs', 'Cỡ bộ đệm, nén, đồng thời mức tài liệu', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
${nguon('📘', 'Journaling — MongoDB Docs', 'Nhật ký ghi trước, checkpoint, chu kỳ đẩy xuống đĩa', 'https://www.mongodb.com/docs/manual/core/journaling/')}

<h3>💼 Đi làm: "MongoDB ăn hết RAM rồi"</h3>
<p>Kỹ sư vận hành của dự án nhắn: "container <code>mongo</code> dùng 9 GB trên VM 16 GB, đêm qua dịch vụ Java bị OOM giết". Giờ bạn biết cần kiểm gì: <code>db.serverStatus().wiredTiger.cache['maximum bytes configured']</code> — trên VM 16 GB không giới hạn, nó là 7,5 GB, đúng thiết kế. Không phải rò rỉ bộ nhớ. Cách sửa: đặt giới hạn bộ nhớ cho container hoặc <code>--wiredTigerCacheSizeGB</code> để mongo, heap JVM và bộ đệm hệ điều hành cùng vừa; rồi theo dõi <code>bytes currently in the cache</code> và chỉ số page fault trước và sau.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"MongoDB dùng bao nhiêu RAM?"</strong> — Bộ đệm WiredTiger mặc định 50% của (RAM − 1 GB), tối thiểu 256 MB; phần còn lại cho kết nối và bộ đệm tệp của hệ điều hành. Trong container nó tôn trọng giới hạn bộ nhớ.</li>
<li><strong>"MongoDB sống sót qua sự cố sập máy thế nào?"</strong> — Checkpoint mỗi 60 giây cộng nhật ký ghi trước; khi khởi động lại, nạp checkpoint gần nhất rồi chạy lại journal. Lệnh ghi xác nhận với <code>j: true</code> hoặc <code>w: 'majority'</code> sẽ còn.</li>
<li><strong>"MongoDB khoá ở mức nào?"</strong> — Đồng thời lạc quan mức tài liệu trong WiredTiger; xung đột trên cùng tài liệu được thử lại.</li>
<li><strong>"snappy hay zstd?"</strong> — snappy (mặc định) nhanh hơn; zstd nén mạnh hơn, tốn thêm chút CPU — hợp với log và dữ liệu lưu trữ. Nén chỉ áp dụng trên đĩa.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Tính cỡ bộ đệm mặc định cho: laptop 16 GB, container giới hạn 4 GB, container giới hạn 1 GB.</li>
<li>Chạy <code>db.orders.stats()</code> trong <code>ctshop</code> sau <code>db.adminCommand({ fsync: 1 })</code>. Tính <code>size / storageSize</code>. Vì sao thấp hơn của các collection log?</li>
<li>Tạo lại đơn hàng thành một collection nén zstd (<code>createCollection</code> có <code>storageEngine</code>, rồi <code>aggregate([{ $match: {} }, { $out: 'orders_zstd' }])</code> vào đó) và so <code>storageSize</code>.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. 7,5 GB; 1,5 GB; 256 MB (50% × 0 GB thấp hơn mức tối thiểu). 2. Đơn hàng đa dạng hơn log (tên, giá, món khác nhau), nên snappy tìm được ít đoạn lặp hơn — trên lab của ta 780.302 / 380.928 ≈ 2,05 lần, so với 4,59 lần của log. 3. <code>db.createCollection('orders_zstd', { storageEngine: { wiredTiger: { configString: 'block_compressor=zstd' } } })</code>, rồi <code>db.orders.aggregate([{ $match: {} }, { $out: 'orders_zstd' }])</code> — <code>$out</code> vào collection đã có thì giữ tuỳ chọn của nó. Trên lab của ta: 118.784 byte với zstd so với 380.928 byte với snappy — nhỏ hơn khoảng 3,2 lần.</p>
</details>
<p><strong>Xong khi:</strong> bạn vẽ lại được sơ đồ các tầng ở trên mà không nhìn, và nói được lệnh ghi đi vào đâu trước tiên.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Bộ máy lưu trữ (storage engine)', 'Thành phần cất dữ liệu trên đĩa và trong bộ nhớ. Mặc định từ MongoDB 3.2: WiredTiger.'],
  ['Bộ đệm WiredTiger', 'Vùng RAM giữ trang dữ liệu và index chưa nén; mặc định 50% của (RAM − 1 GB), tối thiểu 256 MB.'],
  ['Working set', 'Dữ liệu và trang index mà tải công việc hay chạm tới — nên vừa bộ đệm.'],
  ['Journal', 'Nhật ký ghi trước; được chạy lại sau sự cố. <code>j: true</code> chờ tới khi mục ghi nằm trên đĩa.'],
  ['Checkpoint', 'Ảnh chụp nhất quán của tệp dữ liệu, ghi mỗi 60 giây (<code>syncdelay</code>).'],
  ['Bộ nén khối', 'snappy (mặc định), zstd, zlib hoặc none — theo từng collection, chỉ trên đĩa.'],
  ['WriteConflict', 'Hai thao tác cùng lúc sửa một tài liệu; ngoài transaction được thử lại tự động.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lệnh ghi đi qua lớp truy vấn → bộ đệm → journal → (sau đó) tệp dữ liệu qua checkpoint.</li>
<li>Bộ đệm = 50% của (RAM − 1 GB): 15.445 MB trên máy lab 31 GB, 512 MB trong container 2 GB. Hãy giới hạn khi nhiều dịch vụ dùng chung máy.</li>
<li>Nén trên đĩa: 7,90 MB → 1,72 MB với snappy → 0,87 MB với zstd cho log lặp nhiều.</li>
<li><code>kill -9</code> sau các lệnh ghi <code>j: true</code>: khởi động lại không sạch, dữ liệu nguyên vẹn.</li>
<li>Khoá theo tài liệu; một tài liệu nóng là nút thắt cổ chai theo đúng thiết kế.</li>
</ul>
</div>
`,
};
