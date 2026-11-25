/**
 * 1.1 — Tài liệu, collection, database — và _id (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s01-1-tl'] (MongoDB 8.0.38 trong container mgo-lab; kịch bản scratchpad/mgo/demo/s01/s01-1-tl.txt).
 * KHÔNG trùng: SDN302 3.1 dạy CRUD mức môn học (liên kết); bài này dạy cấu trúc dữ liệu bên dưới: tầng database/collection/tài liệu,
 * BSON đo bằng byte, ObjectId mang thời gian, các giới hạn (16 MB, độ sâu lồng, tên trường có dấu chấm) — chạy thật từng giới hạn.
 * Chú ý: ObjectId của lệnh insertOne đầu tiên đổi mỗi lần chạy lại; mọi con số khác trong lời là tất định.
 */
import { lenh, lienKet, nguon, kv } from '../_chung.mjs';

export default {
  title: '1.1 — Documents, collections, databases — and _id|||1.1 — Tài liệu, collection, database — và _id',
  slug: 'mgo-1-1-tai-lieu-collection',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bốn tầng của MongoDB (máy chủ → database → collection → tài liệu) bằng hình ảnh kho hồ sơ; collection tự sinh khi ghi lần đầu; BSON khác JSON thế nào (đo bằng byte); ObjectId mang sẵn thời điểm tạo và vì sao không được coi là bí mật; tự chọn _id; ba lỗi _id chạy thật; giới hạn 16 MB chạm thật bằng mảng phình to; độ sâu lồng; tên trường có dấu chấm làm truy vấn trượt im lặng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Documents, collections, databases — and _id</h2>
<p class="lead">In Section 0 you inserted and queried documents without asking what they really are. This lesson opens the box: the four layers of a MongoDB server, what a document is on disk, why every document has an <code>_id</code> and what that id secretly tells the world, and the hard limits you will hit in real projects — each one triggered on your own lab.</p>

<h3>An everyday picture: an archive room</h3>
<p>Picture the archive room of a ward office. The <strong>building</strong> is the MongoDB server (<code>mongod</code>). Inside are several <strong>rooms</strong> — one for household registrations, one for land records: those are <strong>databases</strong>. Each room has <strong>cabinets</strong> labelled "births", "marriages": those are <strong>collections</strong>. Each cabinet holds <strong>folders</strong>: those are <strong>documents</strong>. Every folder has a <strong>file number</strong> stamped on the cover, unique in that cabinet: that is <code>_id</code>.</p>
<p>Two things about this archive are unusual. Folders in one cabinet do not have to contain the same forms — one birth folder might include a hospital certificate, another not. And a cabinet appears the moment you put the first folder in it; nobody has to build it first.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mongod (the server)</span><span class="lz-lnote">one process, one port (27017 inside the container, 47017 on your host); holds many databases</span></div>
  <div class="lz-layer"><span class="lz-lname">database — ctshop</span><span class="lz-lnote">a namespace with its own users, permissions and files; <code>use ctshop</code> switches to it</span></div>
  <div class="lz-layer"><span class="lz-lname">collection — orders</span><span class="lz-lnote">a group of documents, roughly a SQL table without fixed columns; indexes live here</span></div>
  <div class="lz-layer"><span class="lz-lname">document — { _id: 1, customerId: 'KH0084', items: [ … ] }</span><span class="lz-lnote">one BSON record, the unit of atomic writes, at most 16 MB</span></div>
  <div class="lz-layer"><span class="lz-lname">field — items.0.price</span><span class="lz-lnote">a name → value pair; values can be arrays and nested documents</span></div>
</div>

<h3>Collections are created by the first write</h3>
<p>Start with an empty database <code>ch1</code>. There are no collections. Insert one document into <code>notes</code> — a collection that does not exist yet:</p>
${lenh('s01-1-tl', 0)}
${lenh('s01-1-tl', 1)}
${lenh('s01-1-tl', 2)}
<p>The insert succeeded and the collection appeared. Convenient — and also the reason a typo like <code>db.oders.insertOne(…)</code> silently creates a second collection called <code>oders</code> instead of failing. In SQL, <code>INSERT INTO oders</code> fails with "relation does not exist". In MongoDB you discover it when the order is "missing". (Lesson 1.3 shows how to make the database stricter; <code>db.createCollection()</code> with a validator is how teams create collections on purpose.)</p>

<h3>What a document looks like — and where _id came from</h3>
${lenh('s01-1-tl', 3)}
<p>You did not provide <code>_id</code>, so the shell (more precisely: the driver) generated an <strong>ObjectId</strong> and added it before sending. Your value will differ — it depends on the time you run it. Every document in every collection must have an <code>_id</code>, unique within that collection, backed by an index that exists automatically and cannot be dropped.</p>

<h4>An ObjectId is 12 bytes, and the first 4 are a timestamp</h4>
<p>An ObjectId is 12 bytes, shown as 24 hex characters: a <strong>4-byte timestamp</strong> (seconds since 1970), a <strong>5-byte random value</strong> generated once per process, and a <strong>3-byte counter</strong>. Decode a fixed one:</p>
${lenh('s01-1-tl', 4)}
<p>The first 8 hex characters <code>69240c40</code> are the number 1763970112 — seconds since 1 January 1970 — which is 24 November 2025, 07:41:52 UTC. Two consequences you will use at work:</p>
<ul>
<li><strong>Sorting by <code>_id</code> is roughly sorting by creation time</strong> — handy for "newest first" without a <code>createdAt</code> field (roughly: ids made in the same second on different machines are not strictly ordered).</li>
<li><strong>An ObjectId leaks when something was created.</strong> If your API exposes <code>/invoices/69240c40a1b2…</code>, anyone can read the creation time, and ids made close together share most of their bytes. Never treat an ObjectId as a secret or a capability: a password-reset link must use a random token, not the user's <code>_id</code>.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">bytes 1–4</span><span class="lz-t">timestamp</span><span class="lz-d">seconds since 1970, big-endian — readable by anyone with <code>getTimestamp()</code></span></div>
  <div class="lz-step"><span class="lz-k">bytes 5–9</span><span class="lz-t">random value</span><span class="lz-d">chosen once per client process — the same for every id that process generates</span></div>
  <div class="lz-step"><span class="lz-k">bytes 10–12</span><span class="lz-t">counter</span><span class="lz-d">starts at a random value, +1 per id — ids from one process in one second differ only here</span></div>
</div>

<h4>You may choose _id yourself — with three rules</h4>
<p>CT Shop uses natural ids: customers are <code>KH0001</code>, products <code>SP001</code>, orders are integers. That is fine when the value is stable and unique. Three rules, each enforced by the server:</p>
${lenh('s01-1-tl', 5)}
${lenh('s01-1-tl', 6)}
${lenh('s01-1-tl', 7)}
<ol>
<li><strong>Unique</strong> in the collection — <code>E11000 duplicate key</code> is the error you will meet most often in your career; read it as "the unique index named <code>_id_</code> refused".</li>
<li><strong>Not an array</strong> (any other type is allowed, even an embedded document such as <code>{ shop: 'HN', no: 17 }</code>).</li>
<li><strong>Immutable</strong> — to "change" an id you insert a copy with the new id and delete the old document.</li>
</ol>
<p>Rule 3 is why you should only use a natural key if it will never change. A phone number or an email as <code>_id</code> is a trap: people change them. A student code or an invoice number is usually safe.</p>

<h3>A real document from CT Shop</h3>
${lenh('s01-1-tl', 8)}
<p>Read it like a folder: the order number, the customer's code (a reference to another collection), a status, <strong>an array of embedded documents</strong> (the lines — each with a copy of the product name and the price at purchase time), the total, the shipping address as a nested document, and a date. Everything needed to show "order #1" on one screen lives in one place — the idea from Lesson 0.1.</p>

<h3>BSON: the format on the wire and on disk</h3>
<p>MongoDB shows documents as JSON-like text, but stores and transmits them as <strong>BSON</strong> ("Binary JSON"): a binary format where each field is <em>type byte + name + value</em>, and each document starts with its total length. Compare sizes:</p>
${lenh('s01-1-tl', 10)}
<p>Here BSON is <em>bigger</em> than the JSON text (37 bytes vs 31 characters): it stores a 4-byte total length, a type byte for each field, a terminating zero after each name, and a 4-byte length before each string. BSON is not designed to be small; it is designed to be <strong>fast to scan</strong>: the server can skip over a field without parsing it because the length is written in front, and numbers are stored as real binary numbers rather than text. It also has types JSON lacks — dates, 64-bit integers, decimals, binary data, ObjectId (Lesson 1.2).</p>
<p>How big are CT Shop orders? Measure every document with <code>$bsonSize</code>:</p>
${lenh('s01-1-tl', 9)}
<p>Between 219 and 576 bytes, about 390 on average. Remember that order of magnitude — when you design schemas in Chapter 3, "how big will this document grow?" is the first question.</p>

<h3>The 16 MB limit — hit it for real</h3>
<p>A single BSON document can be at most <strong>16 MiB</strong> (16,777,216 bytes — the <code>maxBsonObjectSize</code> you saw in Lesson 0.2). Nobody inserts a 16 MB document on purpose. You reach it the realistic way: an array that keeps growing. Here a "log" array receives a 1 MB entry at a time:</p>
${lenh('s01-1-tl', 11)}
<p>Fifteen pushes worked; the sixteenth was refused — the result would exceed 16,777,216 bytes. In production the document is usually a chat room with every message embedded, a product with every review, a device with every reading. It works for months, then a write fails <em>for that one popular document only</em>, at the worst moment. The cure is a design choice (the <strong>unbounded array anti-pattern</strong>, Chapter 3): bounded arrays embed, unbounded ones go to their own collection. Files larger than 16 MB belong in GridFS or object storage (Chapter 10), not in a document.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "it is far from 16 MB, so it is fine".</strong> Performance suffers long before the limit: every read of the document loads it whole into the cache, and every update rewrites it. A 2 MB document read on every page view is a problem at 2 MB. Lesson 3.5 measures this.</p>
</div>

<h4>Nesting depth: the documentation says 100, the server says 180</h4>
${lenh('s01-1-tl', 12)}
<p>The MongoDB documentation lists a nesting limit of 100 levels for BSON documents, but MongoDB 8.0 accepted 180 levels in our test and refused at 181 with a precise message. Treat the documented 100 as the contract (drivers and other tools may enforce it) and the real lesson as: <strong>if your design needs more than 3–4 levels, it is probably wrong</strong> — deep nesting is hard to query, index and update.</p>

<h4>Field names: dots and dollars</h4>
<p>Since MongoDB 5.0 a field name may contain <code>.</code> and start with <code>$</code>. Allowed does not mean wise:</p>
${lenh('s01-1-tl', 13)}
${lenh('s01-1-tl', 14)}
${lenh('s01-1-tl', 15)}
<p>The document has a top-level field literally named <code>"gia.vnd"</code> with 120000, and a nested <code>gia.vnd</code> with 99000. The query <code>{ 'gia.vnd': 120000 }</code> uses dot notation, which means "inside <code>gia</code>, field <code>vnd</code>" — so it looks at 99000 and returns nothing. Reaching the dotted field needs <code>$getField</code> inside <code>$expr</code>, which cannot use a normal index. This happens in real life when you store JSON from outside (a webhook, a config, a map keyed by domain names like <code>"cuongthai.com"</code>). Rule: <strong>never use user data or domain names as field names</strong>; store them as values — <code>[{ domain: 'cuongthai.com', hits: 5 }]</code> — which is also the <em>attribute pattern</em> of Lesson 3.3.</p>

<h3>Names: databases and collections</h3>
<ul>
<li>Database names are case-sensitive in storage but two names differing only by case cannot coexist (<code>CTShop</code> and <code>ctshop</code> conflict). Use lowercase.</li>
<li>Avoid <code>/\\. "$*&lt;&gt;:|?</code> in database names; keep collection names simple: <code>orders</code>, <code>order_events</code>. Names starting with <code>system.</code> are reserved.</li>
<li>Pick one convention for field names and stick to it — the Node.js and Spring world uses <code>camelCase</code> (<code>customerId</code>), and Lesson 1.3 makes the database enforce your choice.</li>
</ul>

<h3>Limits at a glance</h3>
<table>
<thead><tr><th>Limit</th><th>Value</th><th>What it means for design</th></tr></thead>
<tbody>
<tr><td>Document size</td><td>16 MiB (16,777,216 bytes)</td><td>Bound your arrays; files go to GridFS / object storage</td></tr>
<tr><td>Nesting depth</td><td>100 documented (8.0 enforced 180 in our test)</td><td>Keep it to 3–4 levels</td></tr>
<tr><td><code>_id</code></td><td>unique, immutable, not an array</td><td>Natural keys only if they never change</td></tr>
<tr><td>Field names</td><td><code>.</code> and leading <code>$</code> allowed since 5.0</td><td>Do not use data as field names</td></tr>
</tbody></table>
${nguon('📘', 'MongoDB Limits and Thresholds', 'Official list: BSON size, nesting depth, naming restrictions', 'https://www.mongodb.com/docs/manual/reference/limits/')}
${nguon('📘', 'ObjectId() — mongosh method', 'Structure of the 12 bytes, getTimestamp()', 'https://www.mongodb.com/docs/manual/reference/method/ObjectId/')}
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — MongoDB CRUD', sub: 'If you study SDN302: the exam-level CRUD with common traps' })}

<h3>💼 At work: "the order disappeared"</h3>
<p>A tester on your outsourcing team reports: "I placed an order, the API said 201 Created, but the order list is empty." You check the code and find <code>db.collection('order')</code> in the create handler and <code>db.collection('orders')</code> in the list handler. MongoDB happily created a collection <code>order</code>. Your fix has three parts: (1) one constant for every collection name in the code; (2) a startup check that lists collections and warns about unexpected ones (<code>db.getCollectionNames()</code>); (3) create collections explicitly with validators (Lesson 1.3) — in a strict setup you can even forbid the application user from creating collections (Chapter 9 roles).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is the maximum document size and what do you do when you need more?"</strong> — 16 MiB. If a document grows toward it, the schema is wrong: split unbounded arrays into their own collection (bucket or reference); store files in GridFS or object storage.</li>
<li><strong>"What is inside an ObjectId?"</strong> — 4-byte timestamp, 5-byte per-process random value, 3-byte counter. So ids are roughly time-ordered and reveal creation time — not suitable as secrets.</li>
<li><strong>"Can you change a document's _id?"</strong> — No, it is immutable. Insert a copy with the new id and delete the old one, ideally in a transaction if other documents reference it.</li>
<li><strong>"JSON vs BSON?"</strong> — BSON is binary, length-prefixed for fast traversal, and typed (Date, Int64, Decimal128, ObjectId, binary). It is not necessarily smaller than JSON.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>In database <code>ch1</code>, insert three documents into <code>students</code> with <code>_id</code> set to student codes (<code>SE190001</code>…). Try to insert a fourth with a duplicate code and copy the exact error message.</li>
<li>Generate a new ObjectId with <code>ObjectId()</code> and decode its time with <code>getTimestamp()</code>. Compare with your clock: why is the hour different from Vietnam time?</li>
<li>Use <code>$bsonSize</code> to find the <em>largest</em> order in <code>ctshop.orders</code> (its <code>_id</code> and size).</li>
<li>Explain in one sentence why <code>{ 'gia.vnd': 120000 }</code> returned nothing in the demo.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>MongoServerError: E11000 duplicate key error collection: ch1.students index: _id_ dup key: { _id: "SE190001" }</code>. 2. <code>getTimestamp()</code> shows UTC; Vietnam is UTC+7, so the hour is 7 lower. 3. <code>db.orders.aggregate([{ $project: { s: { $bsonSize: '$$ROOT' } } }, { $sort: { s: -1 } }, { $limit: 1 }])</code> — the size is 576 bytes. 4. Dot notation means "field <code>vnd</code> inside <code>gia</code>", so it compares the nested 99000, not the top-level field literally named <code>gia.vnd</code>.</p>
</details>
<p><strong>Done when:</strong> you can say, without looking, the 16 MiB limit, the three <code>_id</code> rules and what the first 4 bytes of an ObjectId are.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Document', 'One BSON record — the unit you read and write atomically. Up to 16 MiB.'],
  ['Collection', 'A group of documents in a database; created on first write; holds indexes and an optional validator.'],
  ['Database', 'A namespace of collections with its own users and permissions.'],
  ['_id', 'Required primary key of every document: unique per collection, immutable, not an array, always indexed.'],
  ['ObjectId', '12-byte default id: 4-byte timestamp + 5-byte random + 3-byte counter.'],
  ['BSON', 'Binary, typed, length-prefixed format MongoDB uses on the wire and on disk.'],
  ['Dot notation', '<code>a.b</code> in a query means field <code>b</code> inside embedded document <code>a</code> (or inside array elements).'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Four layers: server → database → collection → document. Collections appear on the first write — so a typo in a collection name creates a new collection.</li>
<li><code>_id</code> is mandatory, unique, immutable and never an array; the default ObjectId reveals its creation time.</li>
<li>BSON is typed and fast to traverse, not necessarily small; CT Shop orders are 219–576 bytes.</li>
<li>16 MiB per document is a hard limit you reach through growing arrays; design to stay far below it.</li>
<li>Do not put data (domain names, user keys) into field names — dot notation will not find them.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Tài liệu, collection, database — và _id</h2>
<p class="lead">Ở Mục 0 bạn đã chèn và truy vấn tài liệu mà chưa hỏi chúng thực ra là gì. Bài này mở hộp ra xem: bốn tầng của một máy chủ MongoDB, một tài liệu trông thế nào khi nằm trên đĩa, vì sao tài liệu nào cũng có <code>_id</code> và cái id ấy âm thầm tiết lộ gì cho cả thế giới, cùng các giới hạn cứng bạn sẽ chạm khi làm dự án thật — mỗi giới hạn đều được kích hoạt ngay trên lab của bạn.</p>

<h3>Hình ảnh đời thường: phòng lưu trữ hồ sơ</h3>
<p>Hãy hình dung phòng lưu trữ của một UBND phường. <strong>Toà nhà</strong> là máy chủ MongoDB (<code>mongod</code>). Bên trong có nhiều <strong>phòng</strong> — phòng hộ tịch, phòng địa chính: đó là các <strong>database</strong>. Mỗi phòng có các <strong>tủ</strong> dán nhãn "khai sinh", "kết hôn": đó là các <strong>collection</strong>. Mỗi tủ chứa các <strong>tập hồ sơ</strong>: đó là các <strong>tài liệu (document)</strong>. Mỗi tập hồ sơ có một <strong>số hồ sơ</strong> đóng dấu trên bìa, không trùng trong tủ đó: đó là <code>_id</code>.</p>
<p>Phòng lưu trữ này có hai điểm lạ. Các tập hồ sơ trong cùng một tủ không bắt buộc có cùng loại giấy tờ — tập khai sinh này có giấy chứng sinh của bệnh viện, tập kia không. Và một cái tủ xuất hiện ngay khi bạn bỏ tập hồ sơ đầu tiên vào; không ai phải đóng tủ trước.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mongod (máy chủ)</span><span class="lz-lnote">một tiến trình, một cổng (27017 trong container, 47017 trên máy bạn); chứa nhiều database</span></div>
  <div class="lz-layer"><span class="lz-lname">database — ctshop</span><span class="lz-lnote">một không gian tên có người dùng, quyền và tệp riêng; <code>use ctshop</code> để chuyển sang</span></div>
  <div class="lz-layer"><span class="lz-lname">collection — orders</span><span class="lz-lnote">một nhóm tài liệu, gần giống bảng SQL nhưng không có cột cố định; index nằm ở tầng này</span></div>
  <div class="lz-layer"><span class="lz-lname">tài liệu — { _id: 1, customerId: 'KH0084', items: [ … ] }</span><span class="lz-lnote">một bản ghi BSON, đơn vị ghi nguyên tử, tối đa 16 MB</span></div>
  <div class="lz-layer"><span class="lz-lname">trường — items.0.price</span><span class="lz-lnote">một cặp tên → giá trị; giá trị có thể là mảng và tài liệu lồng</span></div>
</div>

<h3>Collection được tạo bởi lần ghi đầu tiên</h3>
<p>Bắt đầu với database rỗng <code>ch1</code>. Chưa có collection nào. Chèn một tài liệu vào <code>notes</code> — một collection chưa tồn tại:</p>
${lenh('s01-1-tl', 0)}
${lenh('s01-1-tl', 1)}
${lenh('s01-1-tl', 2)}
<p>Lệnh chèn thành công và collection tự xuất hiện. Tiện — và cũng chính là lý do một lỗi gõ như <code>db.oders.insertOne(…)</code> lặng lẽ tạo collection thứ hai tên <code>oders</code> thay vì báo lỗi. Trong SQL, <code>INSERT INTO oders</code> báo "relation does not exist". Trong MongoDB bạn chỉ phát hiện ra khi đơn hàng "biến mất". (Bài 1.3 chỉ cách làm cơ sở dữ liệu chặt hơn; đội làm thật tạo collection có chủ đích bằng <code>db.createCollection()</code> kèm validator.)</p>

<h3>Một tài liệu trông thế nào — và _id ở đâu ra</h3>
${lenh('s01-1-tl', 3)}
<p>Bạn không đưa <code>_id</code>, nên vỏ lệnh (chính xác hơn: driver) tự sinh một <strong>ObjectId</strong> và gắn vào trước khi gửi đi. Giá trị của bạn sẽ khác — nó phụ thuộc thời điểm bạn chạy. Mọi tài liệu trong mọi collection đều phải có <code>_id</code>, không trùng trong collection đó, được đỡ bởi một index tự có sẵn và không xoá được.</p>

<h4>ObjectId dài 12 byte, và 4 byte đầu là thời gian</h4>
<p>Một ObjectId gồm 12 byte, hiện thành 24 ký tự hex: <strong>4 byte thời gian</strong> (số giây kể từ 1970), <strong>5 byte ngẫu nhiên</strong> sinh một lần cho mỗi tiến trình, và <strong>3 byte bộ đếm</strong>. Giải mã một id cố định:</p>
${lenh('s01-1-tl', 4)}
<p>8 ký tự hex đầu <code>69240c40</code> là số 1763970112 — số giây kể từ ngày 1/1/1970 — tức 07:41:52 UTC ngày 24/11/2025. Hai hệ quả bạn sẽ dùng khi đi làm:</p>
<ul>
<li><strong>Sắp theo <code>_id</code> gần như là sắp theo thời điểm tạo</strong> — tiện cho "mới nhất trước" khi không có trường <code>createdAt</code> (gần như thôi: các id sinh cùng một giây trên các máy khác nhau không theo thứ tự chặt).</li>
<li><strong>ObjectId để lộ thời điểm tạo.</strong> Nếu API của bạn có đường <code>/invoices/69240c40a1b2…</code>, ai cũng đọc được lúc hoá đơn được tạo, và các id sinh gần nhau giống nhau phần lớn số byte. Đừng bao giờ coi ObjectId là bí mật hay "chìa khoá": liên kết đặt lại mật khẩu phải dùng token ngẫu nhiên, không dùng <code>_id</code> của người dùng.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">byte 1–4</span><span class="lz-t">thời gian</span><span class="lz-d">số giây kể từ 1970 — ai có <code>getTimestamp()</code> cũng đọc được</span></div>
  <div class="lz-step"><span class="lz-k">byte 5–9</span><span class="lz-t">giá trị ngẫu nhiên</span><span class="lz-d">chọn một lần cho mỗi tiến trình client — giống nhau ở mọi id tiến trình đó sinh ra</span></div>
  <div class="lz-step"><span class="lz-k">byte 10–12</span><span class="lz-t">bộ đếm</span><span class="lz-d">bắt đầu từ số ngẫu nhiên, mỗi id cộng 1 — các id của một tiến trình trong cùng một giây chỉ khác nhau ở đây</span></div>
</div>

<h4>Bạn được tự chọn _id — với ba luật</h4>
<p>CT Shop dùng khoá tự nhiên: khách là <code>KH0001</code>, sản phẩm <code>SP001</code>, đơn hàng là số nguyên. Như vậy ổn khi giá trị ổn định và không trùng. Ba luật, máy chủ tự ép từng luật:</p>
${lenh('s01-1-tl', 5)}
${lenh('s01-1-tl', 6)}
${lenh('s01-1-tl', 7)}
<ol>
<li><strong>Không trùng</strong> trong collection — <code>E11000 duplicate key</code> là lỗi bạn sẽ gặp nhiều nhất trong nghề; hãy đọc nó là "index không trùng tên <code>_id_</code> đã từ chối".</li>
<li><strong>Không phải mảng</strong> (mọi kiểu khác đều được, kể cả một tài liệu lồng như <code>{ shop: 'HN', no: 17 }</code>).</li>
<li><strong>Không sửa được</strong> — muốn "đổi" id thì chèn một bản sao với id mới rồi xoá tài liệu cũ.</li>
</ol>
<p>Luật 3 là lý do chỉ dùng khoá tự nhiên khi nó không bao giờ đổi. Số điện thoại hay email làm <code>_id</code> là cái bẫy: người ta đổi số, đổi email. Mã số sinh viên hay số hoá đơn thường an toàn.</p>

<h3>Một tài liệu thật của CT Shop</h3>
${lenh('s01-1-tl', 8)}
<p>Đọc nó như một tập hồ sơ: số đơn, mã khách (tham chiếu sang collection khác), trạng thái, <strong>một mảng các tài liệu nhúng</strong> (các dòng hàng — mỗi dòng chép tên sản phẩm và giá lúc mua), tổng tiền, địa chỉ giao dạng tài liệu lồng, và ngày tạo. Mọi thứ cần để hiện "đơn số 1" trên một màn hình nằm chung một chỗ — đúng ý của Bài 0.1.</p>

<h3>BSON: định dạng trên đường truyền và trên đĩa</h3>
<p>MongoDB hiện tài liệu dưới dạng chữ giống JSON, nhưng lưu và truyền chúng bằng <strong>BSON</strong> ("JSON nhị phân"): một định dạng nhị phân, mỗi trường là <em>byte kiểu + tên + giá trị</em>, và mỗi tài liệu mở đầu bằng tổng độ dài của nó. So kích thước:</p>
${lenh('s01-1-tl', 10)}
<p>Ở đây BSON <em>lớn hơn</em> chữ JSON (37 byte so với 31 ký tự): nó cất 4 byte tổng độ dài, một byte kiểu cho mỗi trường, một byte 0 kết thúc sau mỗi tên, và 4 byte độ dài trước mỗi chuỗi. BSON không được thiết kế để nhỏ; nó được thiết kế để <strong>quét nhanh</strong>: máy chủ nhảy qua một trường mà không cần phân tích vì độ dài ghi sẵn ở trước, còn số được lưu thành số nhị phân thật thay vì chữ. Nó cũng có những kiểu JSON không có — ngày giờ, số nguyên 64 bit, số thập phân, dữ liệu nhị phân, ObjectId (Bài 1.2).</p>
<p>Đơn hàng CT Shop lớn cỡ nào? Đo từng tài liệu bằng <code>$bsonSize</code>:</p>
${lenh('s01-1-tl', 9)}
<p>Từ 219 tới 576 byte, trung bình khoảng 390. Nhớ cỡ số đó — khi thiết kế schema ở Chương 3, câu hỏi đầu tiên luôn là "tài liệu này sẽ phình tới đâu?".</p>

<h3>Giới hạn 16 MB — chạm thật</h3>
<p>Một tài liệu BSON tối đa <strong>16 MiB</strong> (16.777.216 byte — chính là <code>maxBsonObjectSize</code> bạn thấy ở Bài 0.2). Chẳng ai cố ý chèn một tài liệu 16 MB. Bạn chạm tới nó theo con đường rất đời: một mảng cứ lớn mãi. Ở đây mảng "log" mỗi lần nhận thêm một mục 1 MB:</p>
${lenh('s01-1-tl', 11)}
<p>Mười lăm lần push thành công; lần thứ mười sáu bị từ chối — kết quả sẽ vượt 16.777.216 byte. Ngoài đời, tài liệu đó thường là một phòng chat nhúng mọi tin nhắn, một sản phẩm nhúng mọi đánh giá, một thiết bị nhúng mọi số đo. Nó chạy êm vài tháng, rồi một lệnh ghi thất bại <em>chỉ với đúng tài liệu nổi tiếng nhất</em>, vào lúc tệ nhất. Cách chữa là một quyết định thiết kế (<strong>anti-pattern mảng không giới hạn</strong>, Chương 3): mảng có giới hạn thì nhúng, mảng không giới hạn thì tách ra collection riêng. Tệp lớn hơn 16 MB thuộc về GridFS hoặc kho đối tượng (Chương 10), không nằm trong tài liệu.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "còn xa mới tới 16 MB, vậy là ổn".</strong> Hiệu năng tụt từ rất lâu trước giới hạn: mỗi lần đọc, cả tài liệu được nạp nguyên vào bộ đệm, mỗi lần sửa, cả tài liệu được ghi lại. Một tài liệu 2 MB bị đọc ở mỗi lượt xem trang đã là vấn đề ngay ở mức 2 MB. Bài 3.5 sẽ đo điều này.</p>
</div>

<h4>Độ sâu lồng: tài liệu nói 100, máy chủ nói 180</h4>
${lenh('s01-1-tl', 12)}
<p>Tài liệu chính thức của MongoDB ghi giới hạn lồng 100 tầng cho tài liệu BSON, nhưng MongoDB 8.0 nhận 180 tầng trong phép thử của ta và từ chối ở tầng 181 kèm thông báo rõ ràng. Hãy coi con số 100 trong tài liệu là cam kết (driver và công cụ khác có thể ép con số đó), còn bài học thật là: <strong>thiết kế mà cần quá 3–4 tầng thì nhiều khả năng đã sai</strong> — lồng sâu thì khó truy vấn, khó đánh index, khó cập nhật.</p>

<h4>Tên trường: dấu chấm và dấu đô la</h4>
<p>Từ MongoDB 5.0, tên trường được chứa <code>.</code> và được bắt đầu bằng <code>$</code>. Được phép không có nghĩa là nên:</p>
${lenh('s01-1-tl', 13)}
${lenh('s01-1-tl', 14)}
${lenh('s01-1-tl', 15)}
<p>Tài liệu có một trường cấp ngoài cùng tên đúng là <code>"gia.vnd"</code> mang 120000, và một trường lồng <code>gia.vnd</code> mang 99000. Truy vấn <code>{ 'gia.vnd': 120000 }</code> dùng ký pháp dấu chấm, nghĩa là "trong <code>gia</code>, lấy trường <code>vnd</code>" — nên nó nhìn vào 99000 và trả về rỗng. Muốn với tới trường có dấu chấm phải dùng <code>$getField</code> bên trong <code>$expr</code>, mà cách đó không dùng được index thường. Chuyện này xảy ra thật khi bạn lưu JSON từ bên ngoài (một webhook, một tệp cấu hình, một map có khoá là tên miền như <code>"cuongthai.com"</code>). Luật: <strong>đừng bao giờ dùng dữ liệu người dùng hay tên miền làm tên trường</strong>; hãy cất chúng thành giá trị — <code>[{ domain: 'cuongthai.com', hits: 5 }]</code> — đó cũng chính là <em>attribute pattern</em> của Bài 3.3.</p>

<h3>Đặt tên database và collection</h3>
<ul>
<li>Tên database phân biệt hoa thường khi lưu, nhưng hai tên chỉ khác hoa thường không cùng tồn tại được (<code>CTShop</code> và <code>ctshop</code> xung đột). Hãy dùng chữ thường.</li>
<li>Tránh <code>/\\. "$*&lt;&gt;:|?</code> trong tên database; đặt tên collection đơn giản: <code>orders</code>, <code>order_events</code>. Tên bắt đầu bằng <code>system.</code> là tên dành riêng.</li>
<li>Chọn một quy ước cho tên trường và giữ nó — thế giới Node.js và Spring dùng <code>camelCase</code> (<code>customerId</code>), và Bài 1.3 bắt chính cơ sở dữ liệu ép lựa chọn đó.</li>
</ul>

<h3>Bảng giới hạn</h3>
<table>
<thead><tr><th>Giới hạn</th><th>Giá trị</th><th>Ý nghĩa với thiết kế</th></tr></thead>
<tbody>
<tr><td>Kích thước tài liệu</td><td>16 MiB (16.777.216 byte)</td><td>Giới hạn độ dài mảng; tệp thì đưa sang GridFS / kho đối tượng</td></tr>
<tr><td>Độ sâu lồng</td><td>100 theo tài liệu (8.0 ép ở 180 trong phép thử của ta)</td><td>Giữ trong 3–4 tầng</td></tr>
<tr><td><code>_id</code></td><td>không trùng, không sửa được, không phải mảng</td><td>Chỉ dùng khoá tự nhiên khi nó không bao giờ đổi</td></tr>
<tr><td>Tên trường</td><td>được chứa <code>.</code> và mở đầu bằng <code>$</code> từ 5.0</td><td>Đừng dùng dữ liệu làm tên trường</td></tr>
</tbody></table>
${nguon('📘', 'MongoDB Limits and Thresholds', 'Danh sách chính thức: cỡ BSON, độ sâu lồng, luật đặt tên', 'https://www.mongodb.com/docs/manual/reference/limits/')}
${nguon('📘', 'ObjectId() — phương thức mongosh', 'Cấu trúc 12 byte, getTimestamp()', 'https://www.mongodb.com/docs/manual/reference/method/ObjectId/')}
${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — CRUD MongoDB', sub: 'Nếu bạn học SDN302: CRUD mức đề thi kèm các bẫy hay gặp' })}

<h3>💼 Đi làm: "đơn hàng biến mất"</h3>
<p>Tester trong đội outsourcing báo: "Em đặt đơn, API trả 201 Created, nhưng danh sách đơn trống trơn." Bạn mở mã và thấy <code>db.collection('order')</code> trong hàm tạo đơn, còn <code>db.collection('orders')</code> trong hàm liệt kê. MongoDB vui vẻ tạo collection <code>order</code>. Cách sửa có ba phần: (1) một hằng số cho mỗi tên collection trong mã; (2) lúc khởi động liệt kê collection và cảnh báo khi thấy tên lạ (<code>db.getCollectionNames()</code>); (3) tạo collection có chủ đích kèm validator (Bài 1.3) — ở cấu hình chặt, bạn còn cấm được tài khoản ứng dụng tự tạo collection (vai trò ở Chương 9).</p>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"Tài liệu tối đa bao nhiêu và cần hơn thì làm gì?"</strong> — 16 MiB. Nếu tài liệu phình dần tới đó thì schema sai: tách mảng không giới hạn ra collection riêng (bucket hoặc tham chiếu); tệp thì để GridFS hoặc kho đối tượng.</li>
<li><strong>"Bên trong ObjectId có gì?"</strong> — 4 byte thời gian, 5 byte ngẫu nhiên theo tiến trình, 3 byte bộ đếm. Vì vậy id gần như theo thứ tự thời gian và để lộ thời điểm tạo — không dùng làm bí mật được.</li>
<li><strong>"Sửa _id của một tài liệu được không?"</strong> — Không, nó bất biến. Chèn bản sao với id mới rồi xoá bản cũ, tốt nhất trong một transaction nếu tài liệu khác đang tham chiếu tới nó.</li>
<li><strong>"JSON khác BSON thế nào?"</strong> — BSON là nhị phân, có tiền tố độ dài để duyệt nhanh, và có kiểu (Date, Int64, Decimal128, ObjectId, nhị phân). Nó không nhất thiết nhỏ hơn JSON.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong database <code>ch1</code>, chèn ba tài liệu vào <code>students</code> với <code>_id</code> là mã sinh viên (<code>SE190001</code>…). Thử chèn tài liệu thứ tư trùng mã và chép nguyên văn thông báo lỗi.</li>
<li>Sinh một ObjectId mới bằng <code>ObjectId()</code> và giải mã thời gian bằng <code>getTimestamp()</code>. So với đồng hồ của bạn: vì sao giờ khác giờ Việt Nam?</li>
<li>Dùng <code>$bsonSize</code> tìm đơn hàng <em>lớn nhất</em> trong <code>ctshop.orders</code> (cho biết <code>_id</code> và kích thước).</li>
<li>Giải thích trong một câu vì sao <code>{ 'gia.vnd': 120000 }</code> trả về rỗng trong demo.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>MongoServerError: E11000 duplicate key error collection: ch1.students index: _id_ dup key: { _id: "SE190001" }</code>. 2. <code>getTimestamp()</code> hiện giờ UTC; Việt Nam là UTC+7 nên giờ thấp hơn 7. 3. <code>db.orders.aggregate([{ $project: { s: { $bsonSize: '$$ROOT' } } }, { $sort: { s: -1 } }, { $limit: 1 }])</code> — kích thước 576 byte. 4. Ký pháp dấu chấm nghĩa là "trường <code>vnd</code> bên trong <code>gia</code>", nên nó so con số lồng 99000, không phải trường cấp ngoài có tên đúng là <code>gia.vnd</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn nói được mà không nhìn: giới hạn 16 MiB, ba luật của <code>_id</code>, và 4 byte đầu của ObjectId là gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Tài liệu (document)', 'Một bản ghi BSON — đơn vị bạn đọc và ghi nguyên tử. Tối đa 16 MiB.'],
  ['Collection', 'Nhóm tài liệu trong một database; tự tạo ở lần ghi đầu; chứa index và validator (tuỳ chọn).'],
  ['Database', 'Không gian tên chứa các collection, có người dùng và quyền riêng.'],
  ['_id', 'Khoá chính bắt buộc của mọi tài liệu: không trùng trong collection, bất biến, không phải mảng, luôn có index.'],
  ['ObjectId', 'Id mặc định 12 byte: 4 byte thời gian + 5 byte ngẫu nhiên + 3 byte bộ đếm.'],
  ['BSON', 'Định dạng nhị phân, có kiểu, có tiền tố độ dài mà MongoDB dùng trên đường truyền và trên đĩa.'],
  ['Ký pháp dấu chấm', '<code>a.b</code> trong truy vấn nghĩa là trường <code>b</code> bên trong tài liệu lồng <code>a</code> (hoặc bên trong các phần tử mảng).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn tầng: máy chủ → database → collection → tài liệu. Collection xuất hiện ở lần ghi đầu — nên gõ sai tên collection là tạo ra collection mới.</li>
<li><code>_id</code> bắt buộc, không trùng, bất biến và không bao giờ là mảng; ObjectId mặc định để lộ thời điểm tạo.</li>
<li>BSON có kiểu và duyệt nhanh, không nhất thiết nhỏ; đơn CT Shop nặng 219–576 byte.</li>
<li>16 MiB mỗi tài liệu là giới hạn cứng bạn chạm tới qua mảng phình dần; hãy thiết kế để luôn ở xa nó.</li>
<li>Đừng đưa dữ liệu (tên miền, khoá người dùng) vào tên trường — ký pháp dấu chấm sẽ không tìm thấy.</li>
</ul>
</div>
`,
};
