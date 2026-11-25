/**
 * 2.1 — Chèn: insertOne, insertMany, ordered và trùng khoá (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-1-ins'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-1-ins.txt;
 * ví dụ Node ở ../_demo/node/nhan-doi.mjs — driver mongodb 7.9.1, Node 22).
 * Đo thật: insertOne × 2000 với w:majority ≈ 8× chậm hơn w:1, insertMany nhanh hơn vài trăm lần (số ms đổi theo máy ⇒ lời chỉ nói tỉ lệ).
 * Không trùng: SDN302 3.1 dạy CRUD mức môn — liên kết; bài này đi sâu vào kết quả ghi, lỗi lô và write concern.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.1 — Inserting: insertOne, insertMany, ordered and duplicate keys|||2.1 — Chèn: insertOne, insertMany, ordered và trùng khoá',
  slug: 'mgo-2-1-insert',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Chèn dữ liệu như người đi làm: đọc kết quả ghi (acknowledged, insertedId), insertMany có thứ tự và không thứ tự khi gặp trùng khoá E11000 (đếm chính xác bao nhiêu tài liệu đã vào), chỉ mục unique cho email và bẫy chữ hoa, w:0 nuốt lỗi, bẫy driver Node gắn _id vào object rồi dùng lại, và đo thật vì sao chèn từng cái chậm hơn chèn lô hàng trăm lần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Inserting: insertOne, insertMany, ordered and duplicate keys</h2>
<p class="lead">Writing data looks like the easy part — <code>insertOne</code> and you are done. In real systems most data bugs start at the insert: a double-clicked "Register" button that creates two accounts, an import job that stops half-way and nobody knows which rows went in, a loop that inserts the same object twice. This lesson teaches you to read every field of a write result, to handle duplicate keys deliberately, and to measure why batching matters.</p>

<h3>An everyday picture: posting letters at the post office</h3>
<p>You hand the clerk a stack of 100 letters. Two questions matter. First: <em>did you get a receipt?</em> — a stamped receipt means the post office accepted them; no receipt means you are hoping. Second: <em>if letter 37 has a bad address, does the clerk stop at 37, or post the other 99 and hand back 37?</em> MongoDB asks you to choose both: the receipt is the <strong>write concern</strong>, and "stop or continue" is <strong>ordered</strong>. And handing the clerk one stack is much faster than queueing 100 times with one letter each.</p>

<h3>Step 1 — read the write result</h3>
${lenh('s02-1-ins', 0)}
<p><code>acknowledged: true</code> means the server confirmed the write according to the write concern in force (we look at it below). <code>insertedId</code> is the <code>_id</code> the document received — here an <code>ObjectId</code> generated <strong>by the client</strong> (mongosh / the driver), not by the server: that is why your code knows the id immediately, without a second query. If you supply <code>_id</code> yourself, it is used as-is:</p>
${lenh('s02-1-ins', 1)}
<p><code>insertedIds</code> maps the <em>position in your array</em> (<code>'0'</code>, <code>'1'</code>…) to the id. Remember that mapping — when a batch fails, errors are reported by position too.</p>

<h3>Step 2 — a batch with a duplicate: ordered (the default)</h3>
<p>A marketing script inserts four coupon codes; <code>GIAM10</code> appears twice by mistake:</p>
${lenh('s02-1-ins', 2)}
${lenh('s02-1-ins', 3)}
<p><strong>E11000</strong> is the error code you will see most often in your career with MongoDB: a unique index (here the built-in one on <code>_id</code>) already contains that key. With <code>ordered: true</code> — the default — MongoDB inserts in order and <strong>stops at the first error</strong>. The two documents before the duplicate are in; <code>FREESHIP</code>, after it, is not. There is no rollback: <code>insertMany</code> is not a transaction (that is Chapter 6). The error message alone does not tell you how far it got, so read the error object:</p>
${lenh('s02-1-ins', 4)}
<p>Same five documents, two modes:</p>
<ul>
<li><strong><code>ordered: true</code></strong>: 2 inserted, failure at index 2, everything after it skipped — including the perfectly valid <code>FREESHIP</code>.</li>
<li><strong><code>ordered: false</code></strong>: 3 inserted, failures at indexes 2 and 4. The server tries <em>every</em> document (and may execute them in any order, in parallel), then reports all failures.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ordered: true</span><span class="lz-t">stop at the first error</span><span class="lz-d">Use when later documents depend on earlier ones (insert parent, then children), or when you prefer "fix and re-run from position N".</span></div>
  <div class="lz-step"><span class="lz-k">ordered: false</span><span class="lz-t">try all, report all</span><span class="lz-d">Use for imports and idempotent re-runs: duplicates of rows already loaded are expected and harmless; the rest go in. Usually faster.</span></div>
  <div class="lz-step"><span class="lz-k">either way</span><span class="lz-t">no rollback</span><span class="lz-d">Documents already written stay written. Need all-or-nothing? Transaction (Lesson 6.2) — or design the import to be safely re-runnable.</span></div>
</div>
<p>The re-runnable import is the pattern professionals use: give each row a <strong>natural, deterministic <code>_id</code></strong> (the coupon code, the invoice number from the source system, a hash of the source row), insert with <code>ordered: false</code>, and treat E11000 as "already there". Run the job twice and you get the same result — that property is called <em>idempotent</em>.</p>

<h3>Step 3 — unique fields other than _id</h3>
<p>Only <code>_id</code> is unique by default. "Email must be unique" is a rule you have to tell the database with a <strong>unique index</strong> (indexes in depth: Chapter 4):</p>
${lenh('s02-1-ins', 5)}
${lenh('s02-1-ins', 6)}
${lenh('s02-1-ins', 7)}
<p>The double-click is stopped by the database, not by luck. Your API should catch error code <code>11000</code> and answer <strong>409 Conflict</strong> ("email already registered") instead of 500. The error even tells you which index and which value (<code>keyValue</code> in the driver) — use the index name to choose the message.</p>
${lenh('s02-1-ins', 8)}
<p>But <code>An@Example.com</code> went in — a unique index compares bytes, so different case means a different key, and now "the same person" has two accounts. Two fixes: normalise before writing (<code>email.trim().toLowerCase()</code> in your code — the usual choice), or build the index with a case-insensitive <strong>collation</strong> (Lesson 2.6). Do the first even if you also do the second.</p>

<h3>Step 4 — the write that lies: w:0</h3>
${lenh('s02-1-ins', 9)}
${lenh('s02-1-ins', 10)}
<p>This insert broke the unique index on <code>email</code>, yet mongosh shows no error — only <code>acknowledged: false</code>. With <code>w: 0</code> the client sends the write and does not wait for any answer, so it never learns that the server rejected it. The count is still 2. "Fire and forget" is occasionally acceptable for throw-away metrics; for anything a user would miss, never. If you inherit a project and see <code>w: 0</code> or <code>writeConcern: { w: 0 }</code> in a connection string or options, ask why.</p>
${lenh('s02-1-ins', 12)}
<p>Our lab is a replica set, and since MongoDB 5.0 the default write concern is <code>w: 'majority'</code>: the server answers only after a majority of the replica-set members (here: the only member) has the write <em>and</em> has it in the journal on disk. That is the strong receipt. Chapter 6 covers <code>w</code>, <code>j</code> and <code>wtimeout</code> properly; for now remember the price, which you will measure in Step 6.</p>

<h3>Step 5 — a Node.js trap: the driver writes _id into YOUR object</h3>
<p>mongosh copies the document before inserting, so you cannot see this in the shell. The Node.js driver does not copy — it <strong>adds <code>_id</code> to the object you passed</strong>. Reuse that object in a loop and the second insert carries the same id:</p>
${lenh('s02-1-ins', 11)}
<p>Exactly the bug in a logging helper that builds one template object and inserts it for every event: one log line survives, every other one fails with E11000 (and if the helper swallows errors, they vanish silently). Fix: insert a fresh object each time — <code>insertOne({ ...mau })</code> — or build the object inside the loop. The script is <code>_demo/node/nhan-doi.mjs</code> in this course's lab files (run <code>npm install</code> in <code>_demo/node</code> first, with the lab container up).</p>

<h3>Step 6 — measure: one by one, or in a batch?</h3>
${lenh('s02-1-ins', 13)}
${lenh('s02-1-ins', 14)}
<p>Your milliseconds will differ, but the shape will not. Inserting 2,000 documents one call at a time with the default <code>w:'majority'</code> took seconds; the same with <code>w: 1</code> (acknowledged by the primary's memory, without waiting for the journal) was roughly 8 times faster; one <code>insertMany</code> of 2,000 took a few dozen milliseconds — hundreds of times faster. Every <code>insertOne</code> pays a full round trip plus, under <code>majority</code>, a wait for the journal to reach disk. A batch pays once. Note what we did <em>not</em> do: we did not switch to <code>w: 1</code> to "go faster" — we batched. Weakening durability is a business decision (Lesson 6.3); batching is free.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">2000 × insertOne</span><span class="lz-t">2000 round trips + 2000 journal waits</span><span class="lz-d">Seconds. What a naive import loop does.</span></div>
  <div class="lz-step"><span class="lz-k">insertMany(2000)</span><span class="lz-t">a few messages, one wait</span><span class="lz-d">Milliseconds. The driver splits huge arrays into messages of at most 100,000 operations / 48 MB automatically.</span></div>
  <div class="lz-step"><span class="lz-k">very large imports</span><span class="lz-t">batches of 1,000–10,000</span><span class="lz-d">Keeps memory flat in your app and lets you log progress ("batch 37 done") so a failure is easy to resume.</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "insertMany failed, so nothing was inserted".</strong> Wrong in both modes. Ordered stops at the first error but keeps what came before it; unordered keeps everything that succeeded. If your retry logic re-sends the whole batch, every earlier document now fails with E11000 — or, if your ids are random <code>ObjectId</code>s generated fresh on each retry, gets inserted <em>twice</em>. Make batches idempotent with deterministic ids, use <code>ordered: false</code>, and read <code>e.result.insertedCount</code> and <code>e.writeErrors[].index</code>.</p>
</div>

${nguon('📘', 'db.collection.insertMany() — MongoDB Docs', 'ordered, error handling, batching limits', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/')}
${nguon('📘', 'Insert Documents — Node.js driver', 'How the driver adds _id to the documents you pass', 'https://www.mongodb.com/docs/drivers/node/current/crud/insert/')}
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — MongoDB CRUD', sub: 'The course-level introduction; this chapter goes deeper' })}

<h3>💼 At work: the nightly import from the partner's system</h3>
<p>A typical outsourcing task: "every night, import the partner's product CSV (50,000 rows) into MongoDB". The version that passes code review: read the file in batches of 5,000; map each row to a document whose <code>_id</code> is the partner's SKU; <code>insertMany(batch, { ordered: false })</code> for new rows — or, if rows can change, <code>bulkWrite</code> of <code>replaceOne … upsert: true</code> (Lesson 2.5); count <code>insertedCount</code> and the E11000 errors separately; log a one-line summary per batch; exit non-zero only for errors other than 11000. When the job crashes at row 31,000, you just run it again.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is E11000?"</strong> — Duplicate key on a unique index (<code>_id</code> or one you created). Handle it: map to HTTP 409, or treat as "already imported".</li>
<li><strong>"insertMany fails on document 3 of 5 — what is in the collection?"</strong> — Ordered: exactly the documents before the failing index. Unordered: all that did not fail. No rollback in either case.</li>
<li><strong>"How do you make an import safe to re-run?"</strong> — Deterministic <code>_id</code> from the source, unordered batches, ignore E11000 (or upsert).</li>
<li><strong>"Why is inserting in a loop slow?"</strong> — One network round trip and one durability wait per document; batch with <code>insertMany</code>/<code>bulkWrite</code>.</li>
<li><strong>"Who generates the ObjectId?"</strong> — Normally the driver, on the client; that is why <code>insertedId</code> is known without a second query.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>In <code>ch2</code>, insert 10 documents with <code>_id</code> 1–10 using <code>insertMany</code>. Then insert <code>[{ _id: 11 }, { _id: 5 }, { _id: 12 }, { _id: 7 }, { _id: 13 }]</code> twice — once ordered, once unordered (drop the extra documents between runs). Predict <code>insertedCount</code> and the failing indexes before running.</li>
<li>Create a unique index on <code>users.phone</code> and insert two users <em>without</em> a phone. What happens, and why? (Hint: a missing field is indexed as <code>null</code>.) How would you allow many users without a phone? (Hint: search the docs for "partial index" — we use it in Chapter 4.)</li>
<li>In <code>_demo/node</code>, change <code>nhan-doi.mjs</code> so all three inserts succeed, without changing <code>mau</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Ordered: <code>insertedCount = 1</code> (only <code>11</code>), failure at index 1. Unordered: <code>insertedCount = 3</code> (11, 12, 13), failures at indexes 1 and 3.</p>
<p>2. The second insert fails with E11000 <code>dup key: { phone: null }</code>: both documents lack <code>phone</code>, and a normal unique index stores a missing field as <code>null</code>, so the second <code>null</code> is a duplicate. Fix: <code>createIndex({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: 'string' } } })</code> — only documents that have a string phone are indexed, so uniqueness applies only to them.</p>
<p>3. <code>await col.insertOne({ ...mau })</code> — each call gets a fresh copy, the driver writes <code>_id</code> into the copy, <code>mau</code> stays untouched.</p>
</details>
<p><strong>Done when:</strong> you can predict, before running, exactly which documents a failed batch leaves behind.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['insertedId / insertedIds', 'The <code>_id</code>(s) of the new document(s); for <code>insertMany</code> keyed by array position.'],
  ['E11000', 'Duplicate key error: a unique index already contains this key. Error code 11000.'],
  ['ordered', '<code>true</code> (default): stop at the first error. <code>false</code>: attempt every document, report all errors.'],
  ['Unique index', 'An index that rejects a second document with the same key; <code>_id</code> always has one.'],
  ['Write concern', 'How much confirmation the client waits for: <code>w: 0</code> none, <code>w: 1</code> primary, <code>w: \'majority\'</code> (default on replica sets) majority + journal.'],
  ['Idempotent', 'Running the operation twice gives the same result as once — the goal for imports and retries.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Read the result: <code>acknowledged</code>, <code>insertedId(s)</code>; errors carry <code>insertedCount</code> and the failing indexes.</li>
<li>Batches are never rolled back: ordered stops at the first error and keeps what came before; unordered keeps every success.</li>
<li>Uniqueness beyond <code>_id</code> needs a unique index; normalise case first; map E11000 to 409.</li>
<li><code>w: 0</code> hides errors. The default on a replica set is <code>majority</code> — durable, and worth batching for.</li>
<li>The Node driver mutates the object you insert; insert fresh copies.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Chèn: insertOne, insertMany, ordered và trùng khoá</h2>
<p class="lead">Ghi dữ liệu trông như phần dễ nhất — gọi <code>insertOne</code> là xong. Trong hệ thống thật, phần lớn lỗi dữ liệu bắt đầu từ chính lệnh chèn: nút "Đăng ký" bị bấm hai lần tạo ra hai tài khoản, một job nhập dữ liệu dừng giữa chừng mà không ai biết dòng nào đã vào, một vòng lặp chèn cùng một object hai lần. Bài này dạy bạn đọc từng trường của kết quả ghi, xử lý trùng khoá một cách có chủ đích, và đo xem vì sao chèn theo lô lại quan trọng.</p>

<h3>Hình ảnh đời thường: gửi thư ở bưu điện</h3>
<p>Bạn đưa cho nhân viên bưu điện một xấp 100 lá thư. Có hai câu hỏi quan trọng. Thứ nhất: <em>bạn có nhận được biên nhận không?</em> — biên nhận có đóng dấu nghĩa là bưu điện đã nhận thư; không có biên nhận nghĩa là bạn đang hy vọng. Thứ hai: <em>nếu lá thứ 37 ghi sai địa chỉ, nhân viên dừng ở lá 37, hay gửi 99 lá kia rồi trả lại lá 37?</em> MongoDB bắt bạn chọn cả hai: biên nhận là <strong>write concern</strong>, còn "dừng hay đi tiếp" là <strong>ordered</strong>. Và đưa nhân viên một xấp thì nhanh hơn rất nhiều so với xếp hàng 100 lần, mỗi lần một lá.</p>

<h3>Bước 1 — đọc kết quả ghi</h3>
${lenh('s02-1-ins', 0)}
<p><code>acknowledged: true</code> nghĩa là máy chủ đã xác nhận lệnh ghi theo write concern đang áp dụng (xem ở dưới). <code>insertedId</code> là <code>_id</code> mà tài liệu nhận được — ở đây là một <code>ObjectId</code> do <strong>phía client</strong> (mongosh / driver) sinh ra, không phải máy chủ: vì thế mã của bạn biết id ngay lập tức, không cần truy vấn lần hai. Nếu bạn tự đưa <code>_id</code>, nó được dùng nguyên như vậy:</p>
${lenh('s02-1-ins', 1)}
<p><code>insertedIds</code> ánh xạ <em>vị trí trong mảng của bạn</em> (<code>'0'</code>, <code>'1'</code>…) sang id. Hãy nhớ cách ánh xạ này — khi một lô bị lỗi, lỗi cũng được báo theo vị trí.</p>

<h3>Bước 2 — một lô có bản trùng: ordered (mặc định)</h3>
<p>Một script marketing chèn bốn mã giảm giá; <code>GIAM10</code> lỡ xuất hiện hai lần:</p>
${lenh('s02-1-ins', 2)}
${lenh('s02-1-ins', 3)}
<p><strong>E11000</strong> là mã lỗi bạn sẽ gặp nhiều nhất trong cả sự nghiệp làm với MongoDB: một chỉ mục unique (ở đây là chỉ mục có sẵn trên <code>_id</code>) đã chứa khoá đó. Với <code>ordered: true</code> — mặc định — MongoDB chèn theo thứ tự và <strong>dừng ở lỗi đầu tiên</strong>. Hai tài liệu đứng trước bản trùng đã vào; <code>FREESHIP</code> đứng sau thì không. Không có rollback: <code>insertMany</code> không phải transaction (đó là Chương 6). Riêng thông báo lỗi không cho biết lệnh đã đi được tới đâu, nên hãy đọc object lỗi:</p>
${lenh('s02-1-ins', 4)}
<p>Cùng năm tài liệu, hai chế độ:</p>
<ul>
<li><strong><code>ordered: true</code></strong>: chèn được 2, lỗi ở chỉ số 2, mọi thứ phía sau bị bỏ qua — kể cả <code>FREESHIP</code> hoàn toàn hợp lệ.</li>
<li><strong><code>ordered: false</code></strong>: chèn được 3, lỗi ở chỉ số 2 và 4. Máy chủ thử <em>mọi</em> tài liệu (và có thể thực thi theo thứ tự bất kỳ, song song), rồi báo tất cả lỗi.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ordered: true</span><span class="lz-t">dừng ở lỗi đầu tiên</span><span class="lz-d">Dùng khi tài liệu sau phụ thuộc tài liệu trước (chèn cha rồi mới chèn con), hoặc khi bạn muốn "sửa rồi chạy lại từ vị trí N".</span></div>
  <div class="lz-step"><span class="lz-k">ordered: false</span><span class="lz-t">thử hết, báo hết</span><span class="lz-d">Dùng cho nhập dữ liệu và chạy lại an toàn: bản trùng của dòng đã nạp là điều được chờ đợi và vô hại; phần còn lại vẫn vào. Thường nhanh hơn.</span></div>
  <div class="lz-step"><span class="lz-k">chế độ nào cũng vậy</span><span class="lz-t">không rollback</span><span class="lz-d">Tài liệu đã ghi thì vẫn ở đó. Cần "tất cả hoặc không gì"? Transaction (Bài 6.2) — hoặc thiết kế job nhập để chạy lại được an toàn.</span></div>
</div>
<p>Job nhập chạy lại được là pattern dân chuyên nghiệp dùng: cho mỗi dòng một <strong><code>_id</code> tự nhiên, tất định</strong> (mã giảm giá, số hoá đơn từ hệ thống nguồn, hash của dòng nguồn), chèn với <code>ordered: false</code>, và coi E11000 là "đã có rồi". Chạy job hai lần cho cùng một kết quả — tính chất đó gọi là <em>idempotent</em> (bất biến khi lặp).</p>

<h3>Bước 3 — trường unique ngoài _id</h3>
<p>Mặc định chỉ <code>_id</code> là unique. "Email không được trùng" là luật bạn phải nói cho cơ sở dữ liệu biết bằng một <strong>chỉ mục unique</strong> (chỉ mục chi tiết: Chương 4):</p>
${lenh('s02-1-ins', 5)}
${lenh('s02-1-ins', 6)}
${lenh('s02-1-ins', 7)}
<p>Cú bấm đúp bị cơ sở dữ liệu chặn lại, không phải nhờ may mắn. API của bạn nên bắt mã lỗi <code>11000</code> và trả <strong>409 Conflict</strong> ("email đã được đăng ký") thay vì 500. Lỗi còn cho biết chỉ mục nào và giá trị nào (<code>keyValue</code> trong driver) — dùng tên chỉ mục để chọn thông báo.</p>
${lenh('s02-1-ins', 8)}
<p>Nhưng <code>An@Example.com</code> lại vào được — chỉ mục unique so sánh theo byte, nên khác chữ hoa là khác khoá, và giờ "cùng một người" có hai tài khoản. Hai cách sửa: chuẩn hoá trước khi ghi (<code>email.trim().toLowerCase()</code> trong mã — cách thường dùng), hoặc dựng chỉ mục với <strong>collation</strong> không phân biệt hoa thường (Bài 2.6). Hãy làm cách thứ nhất kể cả khi đã làm cách thứ hai.</p>

<h3>Bước 4 — lệnh ghi nói dối: w:0</h3>
${lenh('s02-1-ins', 9)}
${lenh('s02-1-ins', 10)}
<p>Lệnh chèn này vi phạm chỉ mục unique trên <code>email</code>, vậy mà mongosh không báo lỗi gì — chỉ có <code>acknowledged: false</code>. Với <code>w: 0</code>, client gửi lệnh ghi đi và không chờ bất kỳ câu trả lời nào, nên không bao giờ biết máy chủ đã từ chối. Số đếm vẫn là 2. "Bắn rồi quên" thỉnh thoảng chấp nhận được cho số liệu đo vứt đi được; với thứ người dùng sẽ tiếc nếu mất, đừng bao giờ. Nếu bạn nhận một dự án cũ và thấy <code>w: 0</code> hay <code>writeConcern: { w: 0 }</code> trong chuỗi kết nối hoặc tuỳ chọn, hãy hỏi vì sao.</p>
${lenh('s02-1-ins', 12)}
<p>Lab của ta là một replica set, và từ MongoDB 5.0 write concern mặc định là <code>w: 'majority'</code>: máy chủ chỉ trả lời sau khi đa số thành viên replica set (ở đây: thành viên duy nhất) đã có lệnh ghi <em>và</em> đã ghi nó vào journal trên đĩa. Đó là biên nhận chắc chắn. Chương 6 dạy kỹ <code>w</code>, <code>j</code> và <code>wtimeout</code>; giờ chỉ cần nhớ cái giá phải trả, bạn sẽ đo nó ở Bước 6.</p>

<h3>Bước 5 — bẫy Node.js: driver ghi _id vào CHÍNH object của bạn</h3>
<p>mongosh chép tài liệu ra bản khác trước khi chèn, nên trong vỏ lệnh bạn không thấy được điều này. Driver Node.js thì không chép — nó <strong>thêm <code>_id</code> vào chính object bạn truyền vào</strong>. Dùng lại object đó trong vòng lặp thì lần chèn thứ hai mang đúng id cũ:</p>
${lenh('s02-1-ins', 11)}
<p>Đúng là lỗi của một hàm ghi log dựng một object mẫu rồi chèn nó cho mọi sự kiện: một dòng log sống sót, mọi dòng khác lỗi E11000 (và nếu hàm nuốt lỗi thì chúng biến mất không dấu vết). Cách sửa: mỗi lần chèn một object mới — <code>insertOne({ ...mau })</code> — hoặc dựng object bên trong vòng lặp. Script là <code>_demo/node/nhan-doi.mjs</code> trong bộ tệp lab của khoá (chạy <code>npm install</code> trong <code>_demo/node</code> trước, khi container lab đang chạy).</p>

<h3>Bước 6 — đo: từng cái một, hay cả lô?</h3>
${lenh('s02-1-ins', 13)}
${lenh('s02-1-ins', 14)}
<p>Số mili giây của bạn sẽ khác, nhưng hình dạng thì không. Chèn 2.000 tài liệu, mỗi lần gọi một cái với <code>w:'majority'</code> mặc định, mất vài giây; cũng vậy với <code>w: 1</code> (primary xác nhận khi đã có trong bộ nhớ, không chờ journal) nhanh hơn khoảng 8 lần; một lệnh <code>insertMany</code> 2.000 tài liệu chỉ mất vài chục mili giây — nhanh hơn hàng trăm lần. Mỗi <code>insertOne</code> trả trọn một vòng đi–về mạng, cộng thêm, dưới <code>majority</code>, thời gian chờ journal xuống đĩa. Một lô chỉ trả một lần. Để ý điều ta <em>không</em> làm: ta không chuyển sang <code>w: 1</code> cho "nhanh hơn" — ta gom lô. Hạ độ bền dữ liệu là quyết định kinh doanh (Bài 6.3); gom lô thì miễn phí.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">2000 × insertOne</span><span class="lz-t">2000 vòng đi–về + 2000 lần chờ journal</span><span class="lz-d">Tính bằng giây. Đúng thứ một vòng lặp nhập dữ liệu ngây thơ làm.</span></div>
  <div class="lz-step"><span class="lz-k">insertMany(2000)</span><span class="lz-t">vài thông điệp, một lần chờ</span><span class="lz-d">Tính bằng mili giây. Driver tự chia mảng khổng lồ thành các thông điệp tối đa 100.000 thao tác / 48 MB.</span></div>
  <div class="lz-step"><span class="lz-k">nhập rất lớn</span><span class="lz-t">lô 1.000–10.000</span><span class="lz-d">Giữ bộ nhớ ứng dụng ổn định và cho phép ghi tiến độ ("xong lô 37") để khi lỗi thì dễ chạy tiếp.</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "insertMany lỗi, vậy là chưa có gì được chèn".</strong> Sai ở cả hai chế độ. Ordered dừng ở lỗi đầu tiên nhưng giữ những gì đứng trước; unordered giữ mọi tài liệu thành công. Nếu logic thử lại của bạn gửi lại cả lô, mọi tài liệu phía trước giờ đều lỗi E11000 — hoặc, nếu id là <code>ObjectId</code> ngẫu nhiên sinh mới mỗi lần thử lại, chúng bị chèn <em>hai lần</em>. Hãy làm lô idempotent bằng id tất định, dùng <code>ordered: false</code>, và đọc <code>e.result.insertedCount</code> cùng <code>e.writeErrors[].index</code>.</p>
</div>

${nguon('📘', 'db.collection.insertMany() — MongoDB Docs', 'ordered, xử lý lỗi, giới hạn chia lô', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/')}
${nguon('📘', 'Insert Documents — Node.js driver', 'Driver thêm _id vào chính tài liệu bạn truyền vào', 'https://www.mongodb.com/docs/drivers/node/current/crud/insert/')}
${lienKet({ cta: 'Mở bài', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — CRUD MongoDB', sub: 'Phần nhập môn mức môn học; chương này đi sâu hơn' })}

<h3>💼 Đi làm: job nhập dữ liệu ban đêm từ hệ thống đối tác</h3>
<p>Một việc outsourcing điển hình: "mỗi đêm, nhập tệp CSV sản phẩm của đối tác (50.000 dòng) vào MongoDB". Phiên bản qua được code review: đọc tệp theo lô 5.000 dòng; ánh xạ mỗi dòng thành một tài liệu có <code>_id</code> là SKU của đối tác; <code>insertMany(lo, { ordered: false })</code> cho dòng mới — hoặc, nếu dòng có thể thay đổi, <code>bulkWrite</code> gồm các <code>replaceOne … upsert: true</code> (Bài 2.5); đếm riêng <code>insertedCount</code> và các lỗi E11000; ghi một dòng tổng kết cho mỗi lô; chỉ thoát với mã khác 0 khi có lỗi khác 11000. Khi job chết ở dòng 31.000, bạn chỉ việc chạy lại.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"E11000 là gì?"</strong> — Trùng khoá trên một chỉ mục unique (<code>_id</code> hoặc chỉ mục bạn tạo). Xử lý nó: đổi thành HTTP 409, hoặc coi là "đã nhập rồi".</li>
<li><strong>"insertMany lỗi ở tài liệu thứ 3 trong 5 — collection có gì?"</strong> — Ordered: những tài liệu đứng trước chỉ số bị lỗi. Unordered: mọi tài liệu không lỗi. Cả hai đều không rollback.</li>
<li><strong>"Làm sao để job nhập chạy lại được an toàn?"</strong> — <code>_id</code> tất định từ nguồn, lô unordered, bỏ qua E11000 (hoặc dùng upsert).</li>
<li><strong>"Vì sao chèn trong vòng lặp lại chậm?"</strong> — Mỗi tài liệu một vòng đi–về mạng và một lần chờ độ bền; hãy gom lô bằng <code>insertMany</code>/<code>bulkWrite</code>.</li>
<li><strong>"Ai sinh ObjectId?"</strong> — Thường là driver, ở phía client; vì thế <code>insertedId</code> có ngay mà không cần truy vấn lần hai.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>ch2</code>, chèn 10 tài liệu có <code>_id</code> từ 1 tới 10 bằng <code>insertMany</code>. Sau đó chèn <code>[{ _id: 11 }, { _id: 5 }, { _id: 12 }, { _id: 7 }, { _id: 13 }]</code> hai lần — một lần ordered, một lần unordered (xoá các tài liệu thừa giữa hai lần chạy). Đoán <code>insertedCount</code> và các chỉ số lỗi trước khi chạy.</li>
<li>Tạo chỉ mục unique trên <code>users.phone</code> rồi chèn hai người dùng <em>không có</em> số điện thoại. Chuyện gì xảy ra, vì sao? (Gợi ý: trường vắng mặt được đưa vào chỉ mục dưới dạng <code>null</code>.) Làm sao cho phép nhiều người không có số điện thoại? (Gợi ý: tìm "partial index" trong docs — ta dùng nó ở Chương 4.)</li>
<li>Trong <code>_demo/node</code>, sửa <code>nhan-doi.mjs</code> để cả ba lần chèn đều thành công, mà không sửa <code>mau</code>.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. Ordered: <code>insertedCount = 1</code> (chỉ <code>11</code>), lỗi ở chỉ số 1. Unordered: <code>insertedCount = 3</code> (11, 12, 13), lỗi ở chỉ số 1 và 3.</p>
<p>2. Lần chèn thứ hai lỗi E11000 <code>dup key: { phone: null }</code>: cả hai tài liệu đều thiếu <code>phone</code>, và chỉ mục unique thường lưu trường vắng mặt là <code>null</code>, nên <code>null</code> thứ hai bị coi là trùng. Cách sửa: <code>createIndex({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: 'string' } } })</code> — chỉ tài liệu có số điện thoại dạng chuỗi mới vào chỉ mục, nên luật unique chỉ áp cho chúng.</p>
<p>3. <code>await col.insertOne({ ...mau })</code> — mỗi lần gọi nhận một bản sao mới, driver ghi <code>_id</code> vào bản sao, <code>mau</code> giữ nguyên.</p>
</details>
<p><strong>Xong khi:</strong> bạn đoán được, trước khi chạy, chính xác những tài liệu nào còn lại sau một lô bị lỗi.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['insertedId / insertedIds', '<code>_id</code> của (các) tài liệu mới; với <code>insertMany</code> thì theo vị trí trong mảng.'],
  ['E11000', 'Lỗi trùng khoá: một chỉ mục unique đã chứa khoá này. Mã lỗi 11000.'],
  ['ordered', '<code>true</code> (mặc định): dừng ở lỗi đầu tiên. <code>false</code>: thử mọi tài liệu, báo mọi lỗi.'],
  ['Chỉ mục unique', 'Chỉ mục từ chối tài liệu thứ hai có cùng khoá; <code>_id</code> luôn có một chỉ mục như vậy.'],
  ['Write concern', 'Mức xác nhận client chờ: <code>w: 0</code> không chờ, <code>w: 1</code> primary, <code>w: \'majority\'</code> (mặc định trên replica set) đa số + journal.'],
  ['Idempotent', 'Chạy thao tác hai lần cho cùng kết quả như một lần — mục tiêu cho job nhập và thử lại.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc kết quả: <code>acknowledged</code>, <code>insertedId(s)</code>; lỗi mang theo <code>insertedCount</code> và các chỉ số bị lỗi.</li>
<li>Lô không bao giờ bị rollback: ordered dừng ở lỗi đầu và giữ phần trước; unordered giữ mọi phần thành công.</li>
<li>Unique ngoài <code>_id</code> cần chỉ mục unique; chuẩn hoá chữ hoa trước; đổi E11000 thành 409.</li>
<li><code>w: 0</code> che giấu lỗi. Mặc định trên replica set là <code>majority</code> — bền, và đáng để gom lô.</li>
<li>Driver Node sửa chính object bạn chèn; hãy chèn bản sao mới.</li>
</ul>
</div>
`,
};
