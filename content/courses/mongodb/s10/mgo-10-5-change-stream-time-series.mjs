/**
 * 10.5 — Change stream, time series collection và GridFS (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-5-change-stream'] (kịch bản demo/s10/s10-5-change-stream.txt; MongoDB 8.0.38, Node 22 + driver mongodb 7.x).
 * Khối: 0 một sự kiện update thô · 1 trích _demo/node/theo-doi.mjs · 2 nghe 6 s: insert/update lọt, delete + customers bị lọc · 3 hai đơn ghi lúc tắt
 * · 4 nối lại bằng resume token ⇒ nhận đủ 2 đơn · 5 delete không pre-image ⇒ null · 6–8 bật changeStreamPreAndPostImages ⇒ thấy đơn đã xoá, config.system.preimages
 * · 9 standalone ⇒ "only supported on replica sets" · 10–11 _demo/ts-nap.js 432.000 số đo · 12 dung lượng ts vs thường · 13 index {may, luc} tự tạo
 * · 14 một bucket thô (control.min/max/count, cột nén Binary) · 15 trung bình 6 giờ · 16 explain: system.buckets + $_internalUnpackBucket, đọc 31 bucket khớp 3
 * · 17 giới hạn: update số đo lỗi, update meta được, delete được, unique lỗi, TTL được · 18–20 GridFS 5.000.000 byte = 20 chunk, sha256 khớp · 21 tài liệu > 16 MiB bị từ chối.
 * Kiểm trùng: Pub/Sub + Stream ở khoá redis (rd-8-1, rd-8-2), WebSocket ở khoá nodejs (nodejs-11-1), phân mảnh theo thời gian ở postgresql-15-4 ⇒ liên kết, không giảng lại.
 * Nguồn GET kiểm 24/11/2026: MongoDB Docs changeStreams, timeseries-collections, timeseries-limitations, gridfs, limits; Debezium MongoDB connector.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-5-change-stream';

const OUTBOX = `// Gửi email "đơn đã giao" mỗi khi status đổi sang SHIPPED — không gọi email trong API, mà nghe change stream
const cs = orders.watch(
  [{ $match: { operationType: 'update', 'updateDescription.updatedFields.status': 'SHIPPED' } }],
  { resumeAfter: await doc_token_da_luu() });             // token cất trong MongoDB (collection nho_token), không phải tệp /tmp
for await (const e of cs) {
  await guiEmail(e.documentKey._id, { idempotencyKey: e._id._data });   // cùng sự kiện tới 2 lần ⇒ chỉ gửi 1 lần
  await luuToken(e._id);                                   // lưu SAU khi xử lý ⇒ "ít nhất một lần", không bao giờ "mất"
}`;

const GRIDFS_NODE = `// Node driver: GridFSBucket là luồng (stream) — không nạp cả tệp vào RAM
import { GridFSBucket } from 'mongodb';
const bucket = new GridFSBucket(db, { bucketName: 'hoaDon' });       // ⇒ hoaDon.files + hoaDon.chunks
fs.createReadStream('hd-2001.pdf').pipe(bucket.openUploadStream('hd-2001.pdf', { metadata: { donId: 2001 } }));
bucket.openDownloadStreamByName('hd-2001.pdf').pipe(res);           // Express: trả thẳng ra HTTP`;

export default {
  title: '10.5 — Change streams, time series collections and GridFS|||10.5 — Change stream, time series collection và GridFS',
  slug: 'mgo-10-5-change-stream-time-series',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ba tính năng "không phải CRUD" mà dự án thật hay cần, chạy thật trên MongoDB 8.0: change stream (sự kiện thay đổi trông thế nào, tiến trình Node nghe đơn mới, chết rồi nối lại bằng resume token mà không sót đơn nào, delete chỉ có _id cho tới khi bật pre-image, standalone không có change stream); time series collection (432.000 số đo cảm biến: 0,6 MiB so với hơn 8 MiB của collection thường, bucket nén theo cột, explain đọc system.buckets, giới hạn update/unique đo thật); GridFS (tệp 5 MB thành 20 chunk 255 KiB, lấy về khớp sha256, giới hạn 16 MiB một tài liệu) và khi nào KHÔNG dùng GridFS.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Change streams, time series collections and GridFS</h2>
<p class="lead">Three features that are not plain CRUD but show up in real projects within months: "notify the warehouse the moment an order is paid" (change streams), "store a reading from every sensor every minute" (time series collections), and "keep the invoice PDF next to the order" (GridFS). For each one we run it on the lab, look at what MongoDB actually stores, and — just as important — measure where it stops being the right tool.</p>

<h3>An everyday picture</h3>
<p>A change stream is the shop's <em>CCTV recording</em>, not a security guard shouting: it keeps a numbered tape (the oplog), you can rewind to the frame you last watched (the resume token), but the tape is overwritten after a while. A time series collection is a <em>logbook with one page per machine per few hours</em> instead of one sheet of paper per reading. GridFS is <em>cutting a long poster into A4 sheets</em> so it fits in folders made for A4 — it works, but a poster tube (object storage) is usually the better place.</p>

<h3>1. Change streams: what one event looks like</h3>
${lenh(K, 0)}
<p>A change stream is an aggregation on the <strong>oplog</strong> (Lesson 7.1) that the server exposes as a cursor. Each event has an <code>_id</code> — the <strong>resume token</strong> — plus <code>operationType</code>, <code>ns</code>, <code>documentKey</code> and, for updates, only the changed fields in <code>updateDescription</code>. By default you do <em>not</em> get the full document after an update (ask for <code>fullDocument: 'updateLookup'</code>, which costs an extra read and may show a newer version) and you never get the document before a delete unless you enable pre-images (§3).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Write</span><span class="lz-t">insert/update/delete commits on the primary</span><span class="lz-d">same write that the API waited for</span></div>
  <div class="lz-step"><span class="lz-k">Oplog</span><span class="lz-t">an entry with a timestamp is appended</span><span class="lz-d">capped size ⇒ a time window (Lesson 10.2 read about 5 h on the lab)</span></div>
  <div class="lz-step"><span class="lz-k">Change stream</span><span class="lz-t">$changeStream + your $match/$project</span><span class="lz-d">only majority-committed changes ⇒ no "ghost" events after a rollback</span></div>
  <div class="lz-step"><span class="lz-k">Your process</span><span class="lz-t">handles the event, then stores e._id</span><span class="lz-d">crash ⇒ resumeAfter the stored token</span></div>
</div>

<h3>2. A Node listener that dies and comes back</h3>
${lenh(K, 1)}
${lenh(K, 2)}
<p>The pipeline is filtered on the <em>server</em>: only <code>insert</code> and <code>update</code> on <code>ctshop.orders</code>. The delete of order 9002 and the change to customer KH0001 happened, but never reached the process. After each handled event the token is written to disk. Now the process is gone — and the shop keeps taking orders:</p>
${lenh(K, 3)}
${lenh(K, 4)}
<p>The second run reads the saved token and passes it as <code>resumeAfter</code>: the server replays the oplog from that point and the two orders written while nobody was listening arrive. Nothing was lost, and nothing earlier was repeated. Two rules make this reliable in production:</p>
<ul>
<li><strong>Save the token after handling, and make handling idempotent.</strong> If the process dies between "handled" and "saved", the event arrives again — that is <em>at-least-once</em> delivery. Use the token (or the order id + new status) as an idempotency key.</li>
<li><strong>The token is only as good as the oplog window.</strong> If the listener is down longer than the oplog keeps history, resuming fails with <code>ChangeStreamHistoryLost</code> and you must rebuild from a full read. Monitor "listener lag" against the oplog window from Lesson 10.2.</li>
</ul>
${ma('js', OUTBOX)}
<p>This is the clean answer to the <em>dual-write</em> problem: the API writes only to MongoDB; everything that must happen "because of" the write (email, search index, cache invalidation, Kafka) is driven from the stream. Debezium's MongoDB connector — used to feed Kafka from MongoDB in many companies — is built exactly on change streams.</p>
${lienKet({ cta: 'Open lesson', khoa: 'redis', bai: 'rd-8-2-stream', title: 'Redis course · 8.2 — Streams: a log that remembers', sub: 'consumer groups, ack, pending entries — compare with resume tokens here' })}
${lienKet({ cta: 'Open lesson', khoa: 'nodejs', bai: 'nodejs-11-1-websocket-co-ban', title: 'Node.js course · 11.1 — WebSocket', sub: 'push the change-stream event on to the browser' })}

<h3>3. Deletes only carry an _id — pre-images</h3>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Without pre-images, a delete event says "order 9003 was deleted" and nothing else — the document is gone, so the server cannot tell you what it contained. After <code>collMod … changeStreamPreAndPostImages: { enabled: true }</code>, MongoDB stores the old version of each changed document in <code>config.system.preimages</code> and the stream can return it as <code>fullDocumentBeforeChange</code>. That is extra writes and extra storage for every update and delete on that collection — turn it on only for collections whose listeners really need "what was it before" (audit, sync to another system), and set an expiry (<code>changeStreamOptions.preAndPostImages.expireAfterSeconds</code>) so it does not grow forever.</p>

<h3>4. No replica set, no change stream</h3>
${lenh(K, 9)}
<p>A standalone mongod has no oplog, so <code>$changeStream</code> is refused. This is why the lab has been a one-member replica set since Lesson 0.2, and why a teammate's "it works on my machine with <code>docker run mongo</code>" listener fails immediately. Atlas clusters are always replica sets.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — polling with <code>find({ updatedAt: { $gt: last } })</code> instead.</strong> It looks simpler, but it misses deletes entirely, misses updates that don't touch <code>updatedAt</code>, can skip documents written with a slightly older clock inside the same millisecond, and every poll is a query. Use polling only when you cannot get a replica set; otherwise use the stream.</p>
</div>
${nguon('📘', 'MongoDB Docs — Change Streams', 'availability (replica sets, sharded clusters), resumeAfter/startAfter, pre- and post-images, oplog window', 'https://www.mongodb.com/docs/manual/changeStreams/')}
${nguon('📘', 'Debezium — MongoDB connector', 'change data capture from MongoDB to Kafka, built on change streams', 'https://debezium.io/documentation/reference/stable/connectors/mongodb.html')}

<h3>5. Time series collections: 432,000 sensor readings</h3>
${lenh(K, 10)}
${lenh(K, 11)}
<p>Ten temperature sensors in the CT Shop warehouses, one reading per minute for 30 days — 432,000 readings — inserted into a time series collection (<code>timeField: 'luc'</code>, <code>metaField: 'may'</code>, <code>granularity: 'minutes'</code>) and, for comparison, into an ordinary collection.</p>
${lenh(K, 12)}
${lenh(K, 13)}
<p>Same data, <strong>more than 10× smaller on disk</strong> and a tiny index instead of an 11 MiB <code>_id</code> index. Two things explain it. First, MongoDB groups readings from the same sensor (<code>meta</code>) in the same time range into one <strong>bucket</strong> document — 440 buckets instead of 432,000 documents. Second, inside a bucket each field is stored as a <em>column</em> and compressed together: a column of temperatures that change by tenths of a degree compresses far better than 432,000 separate documents each repeating field names. A compound index on <code>{ may, luc }</code> is created for you.</p>
${lenh(K, 14)}
<p>Here is one bucket as it is really stored (MongoDB 8.0 still lets you read <code>system.buckets.*</code>; the 9.0 docs say this namespace is going away, so never build application code on it). <code>control.min</code>/<code>control.max</code> hold the range of every field in the bucket, <code>control.count</code> is 1,000 readings, and the <code>doC</code> column for those 1,000 readings is one 2.5 KB binary blob.</p>
${lenh(K, 15)}
${lenh(K, 16)}
<p>The query looks normal, but explain shows what happens: the server rewrote it to run on <code>system.buckets.nhiet_ts</code>, using <code>control.min.luc</code>/<code>control.max.luc</code> to skip buckets outside the day, then <code>$_internalUnpackBucket</code> turns the matching buckets back into readings. It read 31 buckets (every sensor's buckets overlapping that day — the scan walks the clustered bucket <code>_id</code>, which starts with a timestamp) and kept the 3 belonging to KHO-7. Thirty-one bucket reads for a day of one sensor is cheap; 1,440 separate documents would not be.</p>
${lenh(K, 17)}
<p>The limits are the price of buckets, and they are measured, not quoted. You cannot update a measurement (<code>doC</code>) — readings are meant to be facts; you can update fields of the <code>metaField</code> (renaming a warehouse zone touched all 43,200 readings of KHO-1), delete readings (6,633 readings above 32 °C), and let old buckets expire with <code>expireAfterSeconds</code>. No unique index — so no "one reading per sensor per minute" constraint; deduplicate at write time. Good fits: sensors, metrics, prices over time, app events. Poor fits: data you edit after the fact, or that you look up by a key other than "who + when".</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-15-4-phan-manh', title: 'PostgreSQL course · 15.4 — Partitioning', sub: 'the relational answer to "a lot of rows by time": range partitions, dropping old ones' })}
${nguon('📘', 'MongoDB Docs — Time Series Collections', 'buckets, metaField, granularity, automatic compound index, columnar compression', 'https://www.mongodb.com/docs/manual/core/timeseries-collections/')}
${nguon('📘', 'MongoDB Docs — Time Series Limitations', 'updates only on metaField, no unique/text indexes, TTL, no _id index by default', 'https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/')}

<h3>6. GridFS — and when not to use it</h3>
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
<p>One document is limited to <strong>16 MiB</strong> (§ last block below). GridFS works around that by splitting a file into chunks of 255 KiB (261,120 bytes) in <code>fs.chunks</code> plus one metadata document in <code>fs.files</code>: 5,000,000 bytes became 19 full chunks and a last chunk of 38,720 bytes. Read back with <code>mongofiles get</code>, the SHA-256 is identical. In Node it is a stream, so a 2 GB file never sits in memory:</p>
${ma('js', GRIDFS_NODE)}
${lenh(K, 21)}
<p>So when is GridFS the right choice? When files must live <em>inside</em> the database's guarantees — replicated with it, backed up with it (Lesson 10.1), covered by the same access control — and they are modest in number and size, or you need to read a byte range of a large file stored with the data. When is it not? User uploads, images and videos for a web app: they inflate the working set (Lesson 10.3) and every backup, and a CDN cannot serve them. Store them in object storage (S3, R2, MinIO) and keep only the key, size and checksum in MongoDB.</p>
${nguon('📘', 'MongoDB Docs — GridFS', 'chunks of 255 KiB, fs.files/fs.chunks, when to use GridFS vs a filesystem', 'https://www.mongodb.com/docs/manual/core/gridfs/')}
${nguon('📘', 'MongoDB Docs — Limits and Thresholds', 'BSON document size 16 MiB', 'https://www.mongodb.com/docs/manual/reference/limits/')}

<h3>🕵️ Attacker's view</h3>
<p>A change stream listener usually runs with a powerful account ("it needs to read everything") — and a stream over the whole deployment (<code>client.watch()</code>) delivers <em>every</em> write, including password hashes and personal data, to whoever holds that credential. Give each listener a role with the <code>changeStream</code> and <code>find</code> actions on the exact collections it needs (Lesson 9.2) and <code>$project</code> sensitive fields away in the pipeline. Pre-images make it worse: deleted personal data now also lives in <code>config.system.preimages</code> until it expires — remember that when someone asks for their data to be erased.</p>

<h3>💼 On the job</h3>
<p>Typical OJT ticket: "when an order is paid, update the stock service and send a Zalo/email notification; sometimes the notification is sent twice and sometimes not at all." The usual root cause is a dual write in the API (save, then call the other service; one of the two fails). The fix you can now propose with confidence: write once to MongoDB, drive side effects from a change stream with a stored resume token, make the consumer idempotent, alert when the listener's lag approaches the oplog window. For a monitoring/IoT feature, propose a time series collection with TTL instead of an ordinary collection that grows forever.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"How does a change stream survive a crash of the consumer?"</strong> — Store the resume token after processing; restart with <code>resumeAfter</code>. Delivery is at-least-once, so consumers are idempotent. Works only while the oplog still holds that point.</li>
<li><strong>"Why can't I open a change stream on my local mongod?"</strong> — It's standalone: no oplog. Run a single-member replica set.</li>
<li><strong>"How do you know what was deleted?"</strong> — Delete events only carry the <code>_id</code>; enable change stream pre-images on that collection (cost: extra storage/writes, set expiry).</li>
<li><strong>"Time series collection vs a normal collection with an index on time?"</strong> — Buckets + columnar compression: many times smaller and fewer reads for "one series over a time range"; but measurements cannot be updated, no unique indexes.</li>
<li><strong>"Would you store user avatars in GridFS?"</strong> — Usually no: object storage + CDN; MongoDB stores the key. GridFS when files must share the database's replication/backup/access control.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>Change <code>theo-doi.mjs</code> so it only reacts to orders whose status becomes <code>CANCELLED</code> and prints the customer id. Which option do you need, and why is <code>updateDescription</code> not enough?</li>
<li>Stop the listener, write 3 orders, then delete <code>/tmp/mgo-token.json</code> and start it again. How many orders arrive? What would happen in production?</li>
<li>Add 1,000 readings for a new sensor <code>KHO-11</code> and query its average per hour. How many new buckets appear?</li>
<li>A colleague proposes GridFS for product photos (60 products × 8 photos × 2 MB). Write your answer in five lines with numbers.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. Filter <code>{ operationType: 'update', 'updateDescription.updatedFields.status': 'CANCELLED' }</code> and open the stream with <code>fullDocument: 'updateLookup'</code>: the update event only contains changed fields, and <code>customerId</code> did not change.</p>
<p>2. None: without a token the stream starts "from now". In production you would have lost 3 orders' notifications — store the token durably (in MongoDB itself) and alert if it is missing rather than silently starting fresh; for a gap, re-scan by <code>createdAt</code>.</p>
<p>3. <code>db.nhiet_ts.insertMany(Array.from({ length: 1000 }, (_, i) => ({ luc: new Date(Date.UTC(2026, 10, 1) + i * 60000), may: { id: 'KHO-11', khu: 'Đà Nẵng' }, doC: 25 })))</code>; measured: bucket count 440 → 441 — one bucket holds up to 1,000 readings, and 1,000 minutes ≈ 16.7 hours gives 17 hourly averages.</p>
<p>4. ~960 photos ≈ 1.9 GB inside every backup and replica, competing for cache with orders; no CDN; restore gets slower. Better: object storage with a public/CDN URL, MongoDB keeps <code>{ key, size, sha256, width, height }</code>. GridFS only if photos must follow the database's access control.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Change stream', 'A cursor of change events built on the oplog; needs a replica set or sharded cluster.'],
  ['Resume token (_id of an event)', 'Position in the stream; resumeAfter it to continue after a crash, while the oplog still holds it.'],
  ['At-least-once / idempotent', 'An event may arrive twice after a crash; handling it twice must have the same effect as once.'],
  ['Pre-image / fullDocumentBeforeChange', 'Old version of a changed/deleted document, stored in config.system.preimages when enabled per collection.'],
  ['Time series collection, bucket', 'Collection that stores readings grouped per metaField and time range, columns compressed.'],
  ['metaField / timeField / granularity', 'Who the reading is about / when / expected interval between readings.'],
  ['GridFS, chunk', 'Convention that splits a file into 255 KiB documents in fs.chunks with metadata in fs.files.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Change streams turn the oplog into an event feed: filter on the server, store the resume token after handling, be idempotent.</li>
<li>Deletes carry only the _id unless pre-images are enabled; standalone has no change streams.</li>
<li>Time series collections: buckets + columnar compression — measured over 10× smaller; limited updates, no unique indexes, TTL built in.</li>
<li>GridFS stores big files as 255 KiB chunks; most web uploads belong in object storage instead.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Change stream, time series collection và GridFS</h2>
<p class="lead">Ba tính năng không phải CRUD thuần nhưng chỉ vài tháng là dự án thật sẽ cần. Thứ nhất: "báo kho ngay khi đơn được thanh toán" (change stream). Thứ hai: "lưu số đo của mọi cảm biến mỗi phút" (time series collection). Thứ ba: "cất tệp PDF hoá đơn cạnh đơn hàng" (GridFS). Với từng thứ, ta chạy thật trên lab, xem MongoDB thật sự lưu gì, và quan trọng không kém: đo xem tới đâu thì nó không còn là công cụ đúng.</p>

<h3>Hình ảnh đời thường</h3>
<p>Change stream giống <em>băng ghi hình camera</em> của cửa hàng, chứ không phải anh bảo vệ hét lên. Băng có đánh số khung (oplog), bạn tua lại được tới khung mình xem lần cuối (resume token), nhưng băng sẽ bị ghi đè sau một thời gian. Time series collection giống <em>sổ ghi chép mỗi máy một trang cho vài giờ</em>, thay vì mỗi lần đo một tờ giấy. GridFS giống <em>cắt tấm áp phích dài thành nhiều tờ A4</em> để vừa các tập hồ sơ khổ A4. Cách đó chạy được, nhưng thường thì một ống đựng áp phích (object storage) là chỗ hợp hơn.</p>

<h3>1. Change stream: một sự kiện trông thế nào</h3>
${lenh(K, 0)}
<p>Change stream là một aggregation chạy trên <strong>oplog</strong> (Bài 7.1), được máy chủ trả ra dưới dạng con trỏ. Mỗi sự kiện có một <code>_id</code>, chính là <strong>resume token</strong>, kèm <code>operationType</code>, <code>ns</code>, <code>documentKey</code>. Với update, <code>updateDescription</code> chỉ chứa các trường đã đổi. Mặc định bạn <em>không</em> nhận được cả tài liệu sau khi update. Muốn có thì xin <code>fullDocument: 'updateLookup'</code>; cách này tốn thêm một lần đọc và có thể trả về bản mới hơn. Còn tài liệu trước khi bị xoá thì không bao giờ có, trừ khi bật pre-image (mục 3).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Ghi</span><span class="lz-t">insert/update/delete được commit trên primary</span><span class="lz-d">chính lần ghi mà API đã chờ</span></div>
  <div class="lz-step"><span class="lz-k">Oplog</span><span class="lz-t">thêm một mục có dấu thời gian</span><span class="lz-d">dung lượng giới hạn ⇒ có cửa sổ thời gian (Bài 10.2 đọc được khoảng 5 giờ trên lab)</span></div>
  <div class="lz-step"><span class="lz-k">Change stream</span><span class="lz-t">$changeStream + $match/$project của bạn</span><span class="lz-d">chỉ thay đổi đã commit majority ⇒ không có sự kiện "ma" sau rollback</span></div>
  <div class="lz-step"><span class="lz-k">Tiến trình của bạn</span><span class="lz-t">xử lý sự kiện, rồi lưu e._id</span><span class="lz-d">chết ⇒ resumeAfter token đã lưu</span></div>
</div>

<h3>2. Tiến trình Node nghe đơn, chết rồi sống lại</h3>
${lenh(K, 1)}
${lenh(K, 2)}
<p>Pipeline được lọc ngay trên <em>máy chủ</em>: chỉ <code>insert</code> và <code>update</code> trên <code>ctshop.orders</code>. Việc xoá đơn 9002 và việc sửa khách KH0001 có xảy ra, nhưng không tới được tiến trình. Sau mỗi sự kiện xử lý xong, token được ghi xuống đĩa. Giờ tiến trình đã tắt, còn cửa hàng vẫn tiếp tục nhận đơn:</p>
${lenh(K, 3)}
${lenh(K, 4)}
<p>Lần chạy thứ hai đọc token đã lưu và truyền vào <code>resumeAfter</code>. Máy chủ phát lại oplog từ điểm đó, và hai đơn ghi lúc không ai nghe đã tới đủ. Không mất gì, cũng không lặp lại sự kiện cũ nào. Có hai luật giúp cách này chắc chắn ở production:</p>
<ul>
<li><strong>Lưu token sau khi xử lý, và làm cho việc xử lý idempotent.</strong> Nếu tiến trình chết giữa "đã xử lý" và "đã lưu", sự kiện sẽ tới lại lần nữa. Đó là giao <em>ít nhất một lần</em> (at-least-once). Hãy dùng token (hoặc mã đơn + trạng thái mới) làm khoá idempotency.</li>
<li><strong>Token chỉ dùng được trong cửa sổ oplog.</strong> Nếu tiến trình nghe tắt lâu hơn thời gian oplog còn giữ lịch sử, việc nối lại báo <code>ChangeStreamHistoryLost</code>, và bạn phải dựng lại bằng một lần đọc toàn bộ. Hãy giám sát "độ trễ của tiến trình nghe" so với cửa sổ oplog ở Bài 10.2.</li>
</ul>
${ma('js', OUTBOX)}
<p>Đây là lời giải gọn cho bài toán <em>ghi đôi</em> (dual write). API chỉ ghi vào MongoDB. Mọi việc phải xảy ra "vì" lần ghi đó (email, chỉ mục tìm kiếm, xoá cache, Kafka) đều chạy từ change stream. Connector MongoDB của Debezium, thứ nhiều công ty dùng để đổ dữ liệu từ MongoDB sang Kafka, được xây đúng trên change stream.</p>
${lienKet({ khoa: 'redis', bai: 'rd-8-2-stream', title: 'Khoá Redis · 8.2 — Stream: cuốn nhật ký biết nhớ', sub: 'consumer group, ack, mục đang chờ — so sánh với resume token ở đây' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-11-1-websocket-co-ban', title: 'Khoá Node.js · 11.1 — WebSocket', sub: 'đẩy tiếp sự kiện change stream ra trình duyệt' })}

<h3>3. Delete chỉ mang theo _id — pre-image</h3>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Không có pre-image, sự kiện delete chỉ nói "đơn 9003 đã bị xoá" và không gì hơn. Tài liệu đã mất, nên máy chủ không thể cho bạn biết bên trong nó có gì. Sau khi <code>collMod … changeStreamPreAndPostImages: { enabled: true }</code>, MongoDB cất bản cũ của mỗi tài liệu bị đổi vào <code>config.system.preimages</code>, và stream trả nó ra ở trường <code>fullDocumentBeforeChange</code>. Cái giá là thêm lần ghi và thêm chỗ lưu cho mọi update và delete trên collection đó. Chỉ bật cho collection mà tiến trình nghe thật sự cần biết "trước đó là gì" (kiểm toán, đồng bộ sang hệ thống khác). Và đặt hạn hết (<code>changeStreamOptions.preAndPostImages.expireAfterSeconds</code>) để nó không phình mãi.</p>

<h3>4. Không có replica set thì không có change stream</h3>
${lenh(K, 9)}
<p>Một mongod đơn lẻ (standalone) không có oplog, nên <code>$changeStream</code> bị từ chối. Đây là lý do lab chạy replica set một thành viên ngay từ Bài 0.2. Cũng là lý do tiến trình nghe "chạy được trên máy tôi" của đồng đội, dùng <code>docker run mongo</code> trần, hỏng ngay lập tức. Cụm Atlas thì luôn là replica set.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thay bằng cách hỏi liên tục <code>find({ updatedAt: { $gt: last } })</code>.</strong> Nhìn thì đơn giản hơn, nhưng nó bỏ sót hoàn toàn các lần xoá. Nó bỏ sót cả update không chạm vào <code>updatedAt</code>, và có thể bỏ qua tài liệu ghi với đồng hồ hơi lệch trong cùng một mili giây. Mỗi lần hỏi lại là một truy vấn. Chỉ dùng cách hỏi liên tục khi không thể có replica set; còn lại hãy dùng stream.</p>
</div>
${nguon('📘', 'MongoDB Docs — Change Streams', 'chạy ở đâu (replica set, cụm sharding), resumeAfter/startAfter, pre-image và post-image, cửa sổ oplog', 'https://www.mongodb.com/docs/manual/changeStreams/')}
${nguon('📘', 'Debezium — MongoDB connector', 'bắt thay đổi dữ liệu (CDC) từ MongoDB sang Kafka, xây trên change stream', 'https://debezium.io/documentation/reference/stable/connectors/mongodb.html')}

<h3>5. Time series collection: 432.000 số đo cảm biến</h3>
${lenh(K, 10)}
${lenh(K, 11)}
<p>Mười cảm biến nhiệt độ trong các kho của CT Shop, mỗi phút một số đo, trong 30 ngày, tức 432.000 số đo. Ta nạp chúng vào một time series collection (<code>timeField: 'luc'</code>, <code>metaField: 'may'</code>, <code>granularity: 'minutes'</code>), và để so sánh, nạp cùng dữ liệu vào một collection thường.</p>
${lenh(K, 12)}
${lenh(K, 13)}
<p>Cùng dữ liệu, nhưng trên đĩa <strong>nhỏ hơn trên 10 lần</strong>, và chỉ có một index tí hon thay vì index <code>_id</code> 11 MiB. Có hai lý do. Một, MongoDB gom các số đo của cùng một cảm biến (<code>meta</code>) trong cùng một khoảng thời gian vào một tài liệu <strong>bucket</strong>: 440 bucket thay vì 432.000 tài liệu. Hai, trong mỗi bucket, từng trường được lưu thành một <em>cột</em> và nén chung. Một cột nhiệt độ chỉ đổi vài phần mười độ thì nén tốt hơn nhiều so với 432.000 tài liệu rời, cái nào cũng lặp lại tên trường. Index ghép <code>{ may, luc }</code> được tạo sẵn cho bạn.</p>
${lenh(K, 14)}
<p>Đây là một bucket đúng như nó được lưu (MongoDB 8.0 vẫn cho đọc <code>system.buckets.*</code>; tài liệu 9.0 nói namespace này sẽ bị bỏ, nên đừng bao giờ viết mã ứng dụng dựa vào nó). <code>control.min</code>/<code>control.max</code> giữ khoảng giá trị của mọi trường trong bucket. <code>control.count</code> là 1.000 số đo. Còn cột <code>doC</code> của 1.000 số đo ấy chỉ là một khối nhị phân 2,5 KB.</p>
${lenh(K, 15)}
${lenh(K, 16)}
<p>Truy vấn trông bình thường, nhưng explain cho thấy chuyện gì xảy ra. Máy chủ đã viết lại truy vấn để chạy trên <code>system.buckets.nhiet_ts</code>, dùng <code>control.min.luc</code>/<code>control.max.luc</code> để bỏ qua các bucket nằm ngoài ngày đó. Sau đó <code>$_internalUnpackBucket</code> tháo các bucket khớp ra lại thành từng số đo. Nó đọc 31 bucket, tức mọi bucket của mọi cảm biến có giao với ngày đó, vì lượt quét đi theo <code>_id</code> của bucket, mà <code>_id</code> bắt đầu bằng dấu thời gian. Rồi nó giữ 3 bucket của KHO-7. Đọc 31 bucket cho một ngày của một cảm biến là rẻ; đọc 1.440 tài liệu rời thì không.</p>
${lenh(K, 17)}
<p>Giới hạn là cái giá của bucket, và ở đây chúng được đo, không phải chép lại. Bạn không sửa được một số đo (<code>doC</code>), vì số đo được coi là sự thật đã xảy ra. Bạn sửa được các trường của <code>metaField</code> (đổi tên khu kho chạm vào cả 43.200 số đo của KHO-1), xoá được số đo (6.633 số đo trên 32 °C), và cho bucket cũ tự hết hạn bằng <code>expireAfterSeconds</code>. Không có index unique, nên không có ràng buộc "mỗi cảm biến mỗi phút một số đo"; hãy khử trùng lặp lúc ghi. Hợp với: cảm biến, chỉ số giám sát, giá theo thời gian, sự kiện của ứng dụng. Không hợp với: dữ liệu bạn sẽ sửa về sau, hoặc dữ liệu tra theo một khoá khác "ai + lúc nào".</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-15-4-phan-manh', title: 'Khoá PostgreSQL · 15.4 — Phân mảnh: một bảng, nhiều mảnh', sub: 'cách quan hệ trả lời bài "rất nhiều dòng theo thời gian": phân mảnh theo khoảng, bỏ mảnh cũ' })}
${nguon('📘', 'MongoDB Docs — Time Series Collections', 'bucket, metaField, granularity, index ghép tự tạo, nén theo cột', 'https://www.mongodb.com/docs/manual/core/timeseries-collections/')}
${nguon('📘', 'MongoDB Docs — Time Series Limitations', 'chỉ update trên metaField, không có index unique/text, TTL, mặc định không có index _id', 'https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/')}

<h3>6. GridFS — và khi nào KHÔNG dùng</h3>
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
<p>Mỗi tài liệu bị giới hạn <strong>16 MiB</strong> (khối cuối bên dưới). GridFS lách giới hạn này bằng cách cắt tệp thành các chunk 255 KiB (261.120 byte) trong <code>fs.chunks</code>, cộng một tài liệu mô tả trong <code>fs.files</code>. 5.000.000 byte thành 19 chunk đầy và một chunk cuối 38.720 byte. Lấy về bằng <code>mongofiles get</code>, mã SHA-256 giống hệt. Trong Node, nó là một luồng (stream), nên tệp 2 GB cũng không bao giờ nằm cả trong RAM:</p>
${ma('js', GRIDFS_NODE)}
${lenh(K, 21)}
<p>Vậy khi nào GridFS là lựa chọn đúng? Khi tệp phải nằm <em>bên trong</em> các bảo đảm của database: nhân bản cùng nó, sao lưu cùng nó (Bài 10.1), cùng chung phân quyền. Và số lượng, kích thước tệp vừa phải, hoặc bạn cần đọc một đoạn byte của tệp lớn nằm cạnh dữ liệu. Khi nào không? Tệp người dùng tải lên, ảnh và video cho ứng dụng web. Chúng làm phình working set (Bài 10.3) và mọi bản sao lưu, và CDN không phục vụ được chúng. Hãy cất chúng ở object storage (S3, R2, MinIO), MongoDB chỉ giữ khoá, kích thước và checksum.</p>
${nguon('📘', 'MongoDB Docs — GridFS', 'chunk 255 KiB, fs.files/fs.chunks, khi nào dùng GridFS và khi nào dùng hệ thống tệp', 'https://www.mongodb.com/docs/manual/core/gridfs/')}
${nguon('📘', 'MongoDB Docs — Limits and Thresholds', 'kích thước tài liệu BSON 16 MiB', 'https://www.mongodb.com/docs/manual/reference/limits/')}

<h3>🕵️ Góc hacker</h3>
<p>Tiến trình nghe change stream thường chạy bằng một tài khoản quyền to ("nó cần đọc mọi thứ"). Và một stream trên cả hệ thống (<code>client.watch()</code>) giao <em>mọi</em> lần ghi, kể cả mã băm mật khẩu và dữ liệu cá nhân, cho bất kỳ ai cầm thông tin đăng nhập đó. Hãy cho mỗi tiến trình nghe một vai trò có đúng hành động <code>changeStream</code> và <code>find</code> trên đúng các collection nó cần (Bài 9.2), và dùng <code>$project</code> trong pipeline để bỏ các trường nhạy cảm. Pre-image làm chuyện tệ hơn: dữ liệu cá nhân đã xoá giờ còn nằm trong <code>config.system.preimages</code> tới khi hết hạn. Hãy nhớ điều này khi có người yêu cầu xoá dữ liệu của họ.</p>

<h3>💼 Đi làm</h3>
<p>Một ticket OJT điển hình: "khi đơn được thanh toán thì cập nhật dịch vụ kho và gửi thông báo Zalo/email; có lúc gửi hai lần, có lúc không gửi". Nguyên nhân gốc thường là ghi đôi trong API: lưu xong rồi gọi dịch vụ khác, và một trong hai bước hỏng. Giờ bạn đề xuất cách sửa được một cách tự tin. Chỉ ghi một lần vào MongoDB. Các tác dụng phụ chạy từ change stream có lưu resume token. Bên nhận phải idempotent. Cảnh báo khi độ trễ của tiến trình nghe tiến gần cửa sổ oplog. Với tính năng giám sát hay IoT, hãy đề xuất time series collection có TTL, thay vì một collection thường phình mãi.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Change stream sống sót thế nào khi bên nhận bị sập?"</strong> — Lưu resume token sau khi xử lý; khởi động lại với <code>resumeAfter</code>. Giao ít nhất một lần, nên bên nhận phải idempotent. Chỉ chạy được khi oplog còn giữ điểm đó.</li>
<li><strong>"Sao tôi không mở được change stream trên mongod ở máy mình?"</strong> — Vì nó là standalone, không có oplog. Hãy chạy replica set một thành viên.</li>
<li><strong>"Làm sao biết cái gì đã bị xoá?"</strong> — Sự kiện delete chỉ có <code>_id</code>; bật pre-image cho change stream trên collection đó (tốn thêm chỗ lưu và lần ghi, nhớ đặt hạn hết).</li>
<li><strong>"Time series collection khác gì collection thường có index theo thời gian?"</strong> — Bucket + nén theo cột: nhỏ hơn nhiều lần, ít lần đọc hơn cho "một chuỗi trong một khoảng thời gian"; nhưng không sửa được số đo, không có index unique.</li>
<li><strong>"Bạn có cất ảnh đại diện người dùng vào GridFS không?"</strong> — Thường là không: object storage + CDN, MongoDB giữ khoá. GridFS khi tệp buộc phải đi chung nhân bản, sao lưu, phân quyền của database.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Sửa <code>theo-doi.mjs</code> để chỉ phản ứng với đơn chuyển sang <code>CANCELLED</code> và in mã khách. Bạn cần tuỳ chọn nào, và vì sao <code>updateDescription</code> là không đủ?</li>
<li>Tắt tiến trình nghe, ghi 3 đơn, rồi xoá <code>/tmp/mgo-token.json</code> và chạy lại. Bao nhiêu đơn tới? Ở production thì chuyện gì sẽ xảy ra?</li>
<li>Thêm 1.000 số đo cho cảm biến mới <code>KHO-11</code> và tính trung bình theo giờ. Có bao nhiêu bucket mới xuất hiện?</li>
<li>Đồng nghiệp đề xuất dùng GridFS cho ảnh sản phẩm (60 sản phẩm × 8 ảnh × 2 MB). Viết câu trả lời của bạn trong năm dòng, có số liệu.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Lọc <code>{ operationType: 'update', 'updateDescription.updatedFields.status': 'CANCELLED' }</code> và mở stream với <code>fullDocument: 'updateLookup'</code>: sự kiện update chỉ chứa các trường đã đổi, mà <code>customerId</code> thì không đổi.</p>
<p>2. Không đơn nào: không có token thì stream bắt đầu "từ bây giờ". Ở production bạn đã mất thông báo của 3 đơn. Hãy lưu token bền vững (ngay trong MongoDB) và cảnh báo khi thiếu token thay vì lặng lẽ bắt đầu lại; với khoảng trống thì quét lại theo <code>createdAt</code>.</p>
<p>3. <code>db.nhiet_ts.insertMany(Array.from({ length: 1000 }, (_, i) => ({ luc: new Date(Date.UTC(2026, 10, 1) + i * 60000), may: { id: 'KHO-11', khu: 'Đà Nẵng' }, doC: 25 })))</code>; đo thật: số bucket 440 → 441 — một bucket giữ tối đa 1.000 số đo, và 1.000 phút ≈ 16,7 giờ cho 17 giá trị trung bình theo giờ.</p>
<p>4. Khoảng 960 ảnh ≈ 1,9 GB nằm trong mọi bản sao lưu và mọi bản nhân bản, tranh cache với đơn hàng; không có CDN; khôi phục chậm hơn. Tốt hơn: object storage có URL công khai/CDN, MongoDB giữ <code>{ key, size, sha256, width, height }</code>. Chỉ dùng GridFS nếu ảnh buộc phải theo phân quyền của database.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Change stream', 'Con trỏ các sự kiện thay đổi, xây trên oplog; cần replica set hoặc cụm sharding.'],
  ['Resume token (_id của sự kiện)', 'Vị trí trong stream; resumeAfter nó để chạy tiếp sau khi sập, miễn oplog còn giữ.'],
  ['Ít nhất một lần / idempotent', 'Sau khi sập, một sự kiện có thể tới hai lần; xử lý hai lần phải cho cùng kết quả như một lần.'],
  ['Pre-image / fullDocumentBeforeChange', 'Bản cũ của tài liệu bị đổi/xoá, cất trong config.system.preimages khi bật cho từng collection.'],
  ['Time series collection, bucket', 'Collection lưu số đo gom theo metaField và khoảng thời gian, các cột được nén.'],
  ['metaField / timeField / granularity', 'Số đo nói về ai / lúc nào / khoảng cách dự kiến giữa các lần đo.'],
  ['GridFS, chunk', 'Quy ước cắt tệp thành các tài liệu 255 KiB trong fs.chunks, mô tả trong fs.files.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Change stream biến oplog thành dòng sự kiện: lọc trên máy chủ, lưu resume token sau khi xử lý, xử lý idempotent.</li>
<li>Delete chỉ mang _id trừ khi bật pre-image; standalone không có change stream.</li>
<li>Time series collection: bucket + nén theo cột, đo được nhỏ hơn trên 10 lần; update bị giới hạn, không có index unique, có sẵn TTL.</li>
<li>GridFS cất tệp lớn thành các chunk 255 KiB; phần lớn tệp tải lên của web nên nằm ở object storage.</li>
</ul>
</div>
`,
};
