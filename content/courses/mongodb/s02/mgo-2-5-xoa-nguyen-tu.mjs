/**
 * 2.5 — Xoá, findOneAndUpdate và bulkWrite (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-5-atom'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-5-atom.txt; ../_demo/giu-cho.js chạy 4 tiến trình).
 * Số bán của bản "ngây thơ" THAY ĐỔI mỗi lần chạy (luôn > 5 ở các lần chạy khi soạn) ⇒ lời chỉ nói "nhiều hơn 5".
 * Sự cố thật (GET kiểm 24/11/2026): Egor Homakov, "Hacking Starbucks for unlimited coffee", Sakurity 21/05/2015 — race condition chuyển tiền thẻ quà.
 * Không dùng Flexcoin 2014: chỉ kiểm được The Register (895 BTC, $610.000, đóng cửa) — nguồn phân tích nguyên nhân (hackingdistributed) không tải được (000/429).
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '2.5 — Deleting, findOneAndUpdate and bulkWrite|||2.5 — Xoá, findOneAndUpdate và bulkWrite',
  slug: 'mgo-2-5-xoa-nguyen-tu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Các thao tác "một bước" mà hệ thống thật dựa vào: deleteOne/deleteMany và bẫy gõ sai tên trường xoá 0 tài liệu, bộ đếm số hoá đơn bằng findOneAndUpdate, giữ chỗ hàng tồn bằng cập nhật có điều kiện (demo 4 tiến trình: cách ngây thơ bán quá số hàng, cách nguyên tử đúng 5), hàng đợi việc nhiều worker không ai nhận trùng, bulkWrite có thứ tự và không thứ tự, xoá mềm — kèm sự cố thật: lỗi race condition thẻ quà Starbucks 2015.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Deleting, findOneAndUpdate and bulkWrite</h2>
<p class="lead">Lesson 2.4 showed that a single update on a single document is atomic. This lesson turns that fact into the patterns real systems are built on: invoice numbers that never repeat, stock that never goes below zero when a hundred people click "Buy" at once, a job queue where no two workers take the same job, and batches of mixed writes. You will run four processes against the same five items and watch the naive version sell more than it has.</p>

<h3>An everyday picture: the last concert tickets</h3>
<p>Five tickets left. Two box-office clerks each look at the screen — "5 left" — and each sells a customer 5 tickets. Ten tickets sold, five exist. The fix is not "look more carefully"; it is to make <em>checking</em> and <em>taking</em> one indivisible action: "give me 5 tickets <strong>if</strong> at least 5 remain". In MongoDB that sentence is one <code>updateOne</code> with the condition in the filter.</p>

<h3>Deleting — and the delete that silently does nothing</h3>
<p>We work on a copy of the accessories in <code>ch2.sp</code>.</p>
${lenh('s02-5-atom', 0)}
${lenh('s02-5-atom', 1)}
${lenh('s02-5-atom', 2)}
${lenh('s02-5-atom', 3)}
<p><code>deleteOne</code> removes the first match (which one is not defined unless the filter is unique — delete by <code>_id</code>); <code>deleteMany</code> removes all matches. The third command has a typo, <code>categry</code>: no document has that field, so <strong>nothing matched and nothing was deleted, with no error</strong>. A cleanup job with a typo "succeeds" every night and the disk fills up. Always log and check <code>deletedCount</code>. The opposite typo is worse: <code>deleteMany({})</code> — an empty filter — deletes everything. Before any manual <code>deleteMany</code> in production, run the same filter with <code>countDocuments</code> first and read the number out loud.</p>
<p>To empty a whole collection, <code>drop()</code> is much faster than <code>deleteMany({})</code> (it removes the files instead of deleting document by document) — but it also drops indexes and validators. Deleting does not shrink the data files immediately: WiredTiger reuses the freed space (Lesson 1.4).</p>

<h3>findOneAndUpdate: change and get the result in one step</h3>
<p>Invoices need consecutive numbers: 1, 2, 3… — never two invoices with the same number, even with ten app servers. A counter document and <code>$inc</code> do it; <code>findOneAndUpdate</code> also returns the document, so you get the number you reserved:</p>
${lenh('s02-5-atom', 4)}
${lenh('s02-5-atom', 5)}
<p><code>upsert: true</code> creates the counter on first use; <code>returnDocument: 'after'</code> returns the value <em>after</em> the increment. Without it you get the document <em>before</em> the change — the last call above returned <code>seq: 3</code> although it just reserved 4. Forgetting this option is a classic off-by-one that gives two invoices the same printed number. Two notes: a counter is a single hot document, fine for hundreds of writes per second, not for tens of thousands; and if the invoice insert fails after you reserved a number, that number is skipped — acceptable for most systems, legally not for some invoice formats (then use a transaction, Lesson 6.2).</p>

<h3>Reserving stock: the conditional update</h3>
<p>The lab file <code>_demo/giu-cho.js</code> tries to buy one unit five times, in two ways: <em>naive</em> (read stock; if ≥ 1, write stock − 1) and <em>atomic</em> (<code>updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } })</code> and check <code>modifiedCount</code>). Each product starts with 5 units; four processes run at the same time — 20 purchase attempts for 5 units:</p>
${lenh('s02-5-atom', 6)}
<p>Both show stock 0 — but the naive one recorded <strong>more than 5 sales</strong> (the exact number changes every run). Several processes read "stock 1", all decided "OK, there is one left", all sold it. The atomic version sold exactly 5: the filter <code>stock: { $gte: 1 }</code> and the decrement are evaluated together on the server, under the document lock, so the sixth attempt simply matches nothing.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">naive</span><span class="lz-t">findOne → if (stock ≥ 1) → $set stock − 1</span><span class="lz-d">Check and write are two steps; anything can happen between them. Oversells under load.</span></div>
  <div class="lz-step"><span class="lz-k">atomic</span><span class="lz-t">updateOne({ stock: { $gte: q } }, { $inc: { stock: −q } })</span><span class="lz-d">The condition is part of the write. <code>modifiedCount 0</code> ⇒ "out of stock", answer 409.</span></div>
  <div class="lz-step"><span class="lz-k">several documents</span><span class="lz-t">reserve each, compensate on failure — or a transaction</span><span class="lz-d">An order with 3 products: the Chapter 2 lab does compensation; Chapter 6 does it with a transaction.</span></div>
</div>

<h3>A job queue where no job is taken twice</h3>
${lenh('s02-5-atom', 7)}
${lenh('s02-5-atom', 8)}
${lenh('s02-5-atom', 9)}
<p>Each worker asks: "find the oldest waiting job <em>and</em> mark it as mine". Because find and update are one atomic operation, two workers can never receive the same job — worker C gets <code>null</code> (nothing left) instead of a duplicate. Add a <code>leaseUntil</code> date so jobs of a crashed worker become available again, and you have a reliable small queue without extra infrastructure. (For high throughput use a real queue or log — Redis Streams in the <code>redis</code> course, Kafka in the <code>kafka</code> course.) <code>findOneAndDelete</code> is the variant that removes the job as it takes it; use it only if losing a job on a worker crash is acceptable.</p>

<h3>bulkWrite: many different writes, one round trip</h3>
${lenh('s02-5-atom', 10)}
<p>One <code>bulkWrite</code> with four operations — update, insert, upsert, delete — and a duplicate <code>_id</code> at index 1. Ordered (default): operation 0 applied, 1 failed, 2 and 3 skipped — SP022 is still there with its old price. Unordered: everything except index 1 applied — SP023 upserted, SP022 deleted. Same rules as <code>insertMany</code> in Lesson 2.1: no rollback, read <code>writeErrors[].index</code>. <code>bulkWrite</code> is the tool for sync jobs ("apply these 5,000 changes from the partner") and for the "return stock for each item of a cancelled order" step in this chapter's lab.</p>

<h3>Soft delete</h3>
${lenh('s02-5-atom', 11)}
${lenh('s02-5-atom', 12)}
<p>Instead of removing a comment, set <code>xoaLuc</code> (deleted at) and <code>xoaBoi</code> (deleted by); every normal query adds <code>xoaLuc: null</code>. You keep an audit trail and an "undo", and you can still purge old soft-deleted documents with a TTL index later (Chapter 4). The cost: <em>every</em> query must remember the condition — one forgotten filter shows deleted content — and unique indexes must be partial (only over non-deleted documents) or a deleted user's email blocks re-registration. Teams usually hide the condition in one repository function rather than trusting everyone to add it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "it's only a small window, it will never happen".</strong> The naive stock check has a window of a few milliseconds between read and write. At 3 requests per minute it never happens; during a flash sale with hundreds of requests per second it happens many times a second, and attackers can make it happen on purpose by sending many requests at once (next section). If the correctness of an operation depends on "nobody else acts between my read and my write", make it one atomic operation or put it in a transaction.</p>
</div>

<h3>🛡️ Real incident: Starbucks gift cards, 2015 — a race condition that printed money</h3>
<p>In May 2015 security researcher Egor Homakov (Sakurity) published how he got "unlimited" money on Starbucks gift cards. starbucks.com let users transfer balance between their own cards. The transfer checked the source card's balance and then moved the money — two steps. Homakov sent the same "transfer $5 from card 1 to card 2" request from two browser sessions <em>at the same moment</em>. After a few tries both requests passed the balance check before either had subtracted: card 1 (balance $5) sent $5 twice, and his two $5 cards now held $20 in total. He spent the extra in a Starbucks shop to prove it was real money, topped the card up to repay it, and reported the bug — which, he writes, was hard to get anyone at the company to listen to.</p>
<p>That is exactly the naive stock check you just ran, with money instead of T-shirts. The fix is the same: the balance condition must be part of the write (<code>updateOne({ _id: card1, balance: { $gte: 5 } }, { $inc: { balance: -5 } })</code>), and a transfer that touches two documents needs a transaction (Chapter 6). His note that developers often use "poor protections like limiting the number of requests per IP… or making a random delay" is worth remembering: rate limits and delays make the bug rarer, not gone.</p>
${nguon('🛡️', 'Egor Homakov — Hacking Starbucks for unlimited coffee (Sakurity, 05/2015)', 'Race condition in gift-card balance transfers, with the exploit sequence', 'https://sakurity.com/blog/2015/05/21/starbucks.html')}
${nguon('📘', 'db.collection.findOneAndUpdate() — MongoDB Docs', 'returnDocument, upsert, sort, projection', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/')}
${nguon('📘', 'db.collection.bulkWrite() — MongoDB Docs', 'Operation types, ordered vs unordered, error handling', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/')}

<h3>💼 At work: flash sale at 12:00</h3>
<p>The client's marketing team plans a flash sale: 200 phones at half price, 12:00 sharp. Your lead asks you to review the "buy" endpoint. You look for exactly three things: (1) the stock decrement is a conditional update (<code>stock: { $gte: qty }</code> in the filter) and the endpoint answers 409 when <code>modifiedCount</code> is 0 — no "read then check" anywhere; (2) the order number comes from an atomic counter with <code>returnDocument: 'after'</code>; (3) a failure after the stock was reserved (payment service down) puts the stock back — with compensation or a transaction. Then you prove it: a script with 50 parallel buyers against a test product with stock 10, asserting exactly 10 orders. That script, attached to the pull request, is worth more than any explanation.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you prevent overselling?"</strong> — Conditional atomic update: stock condition in the filter, <code>$inc</code> negative, check <code>modifiedCount</code>; transaction for multi-document orders.</li>
<li><strong>"How do you generate sequential ids in MongoDB?"</strong> — Counter document + <code>findOneAndUpdate</code> with <code>$inc</code>, <code>upsert</code>, <code>returnDocument: 'after'</code>; know it is a hot spot and may leave gaps.</li>
<li><strong>"findOneAndUpdate vs updateOne?"</strong> — Same atomic change; findOneAndUpdate also returns the document (before or after).</li>
<li><strong>"How would you build a simple job queue on MongoDB?"</strong> — findOneAndUpdate on <code>status: 'waiting'</code>, sorted by creation time, set worker + lease; re-queue expired leases.</li>
<li><strong>"Soft delete pros and cons?"</strong> — Audit and undo vs every query and unique index must account for deleted documents.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Change <code>_demo/giu-cho.js</code> so each purchase takes <strong>2</strong> units, starting stock 5. How many sales can the atomic version make? What is the final stock? Run it to check.</li>
<li>Add a lease to the job queue: when a worker takes a job, set <code>leaseUntil</code> to now + 30 seconds. Write the query a worker uses so it can also take jobs whose lease has expired.</li>
<li>Write a <code>bulkWrite</code> that, for an imported list of <code>{ sku, price }</code>, updates the price of existing products and creates missing ones with <code>stock: 0</code> — without touching the stock of existing products.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Filter <code>stock: { $gte: 2 }</code>, update <code>$inc: { stock: -2 }</code>: exactly 2 sales, final stock 1 — the third request finds stock 1 &lt; 2 and matches nothing.</p>
<p>2. <code>db.viec.findOneAndUpdate({ $or: [{ trangThai: 'CHO' }, { trangThai: 'DANG_LAM', leaseUntil: { $lt: new Date() } }] }, { $set: { trangThai: 'DANG_LAM', nguoiLam: 'worker-A', leaseUntil: new Date(Date.now() + 30000) } }, { sort: { taoLuc: 1 }, returnDocument: 'after' })</code>. A worker that finishes sets <code>trangThai: 'XONG'</code> with a filter on its own name, so a worker whose lease expired cannot mark someone else's job as done.</p>
<p>3. <code>db.sp.bulkWrite(list.map(({ sku, price }) => ({ updateOne: { filter: { _id: sku }, update: { $set: { price: Decimal128(String(price)) }, $setOnInsert: { stock: 0 } }, upsert: true } })), { ordered: false })</code>.</p>
</details>
<p><strong>Done when:</strong> you can explain, using the words "filter" and "atomic", why the atomic version can never sell a sixth unit.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['deletedCount', 'How many documents a delete removed — check it; a typo gives 0 without an error.'],
  ['findOneAndUpdate', 'Atomic update that also returns the document, before (default) or after (<code>returnDocument: \'after\'</code>).'],
  ['Conditional update', 'The precondition (stock ≥ q, version = 7) is in the filter, so check and write are one atomic step.'],
  ['Race condition', 'The result depends on the timing of concurrent requests; "check then act" in two steps is the typical cause.'],
  ['bulkWrite', 'Many insert/update/replace/delete operations in one command; ordered or unordered, no rollback.'],
  ['Soft delete', 'Mark as deleted (<code>deletedAt</code>) instead of removing; every query must filter it.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Check <code>deletedCount</code>; count before a manual <code>deleteMany</code>; <code>drop</code> to empty a collection.</li>
<li><code>findOneAndUpdate</code> + <code>$inc</code> + <code>returnDocument: 'after'</code> = unique sequential numbers.</li>
<li>Put the precondition in the filter: the atomic version sold exactly 5, the naive one more than it had.</li>
<li><code>findOneAndUpdate</code> also gives a safe job queue; <code>bulkWrite</code> batches mixed writes.</li>
<li>Race conditions are real attacks (Starbucks 2015), not theory; rate limits do not fix them.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Xoá, findOneAndUpdate và bulkWrite</h2>
<p class="lead">Bài 2.4 cho thấy một lệnh cập nhật trên một tài liệu là nguyên tử. Bài này biến sự thật đó thành các pattern mà hệ thống thật dựa vào: số hoá đơn không bao giờ lặp, tồn kho không bao giờ âm khi cả trăm người cùng bấm "Mua", hàng đợi việc mà không hai worker nào nhận trùng một việc, và các lô ghi hỗn hợp. Bạn sẽ chạy bốn tiến trình tranh nhau cùng năm món hàng và xem bản ngây thơ bán nhiều hơn số mình có.</p>

<h3>Hình ảnh đời thường: những vé ca nhạc cuối cùng</h3>
<p>Còn năm vé. Hai nhân viên phòng vé cùng nhìn màn hình — "còn 5" — và mỗi người bán cho một khách 5 vé. Đã bán mười vé, chỉ có năm vé tồn tại. Cách sửa không phải "nhìn kỹ hơn"; mà là biến việc <em>kiểm</em> và việc <em>lấy</em> thành một hành động không thể chia cắt: "đưa tôi 5 vé <strong>nếu</strong> còn ít nhất 5". Trong MongoDB, câu đó là một lệnh <code>updateOne</code> có điều kiện nằm trong bộ lọc.</p>

<h3>Xoá — và lệnh xoá lặng lẽ không làm gì</h3>
<p>Ta làm trên bản sao các phụ kiện trong <code>ch2.sp</code>.</p>
${lenh('s02-5-atom', 0)}
${lenh('s02-5-atom', 1)}
${lenh('s02-5-atom', 2)}
${lenh('s02-5-atom', 3)}
<p><code>deleteOne</code> xoá tài liệu khớp đầu tiên (là cái nào thì không xác định, trừ khi bộ lọc là duy nhất — hãy xoá theo <code>_id</code>); <code>deleteMany</code> xoá mọi tài liệu khớp. Lệnh thứ ba gõ sai, <code>categry</code>: không tài liệu nào có trường đó, nên <strong>không khớp gì và không xoá gì, cũng không báo lỗi</strong>. Một job dọn dẹp gõ sai sẽ "thành công" mỗi đêm còn ổ đĩa thì đầy dần. Luôn ghi log và kiểm <code>deletedCount</code>. Lỗi gõ ngược lại còn tệ hơn: <code>deleteMany({})</code> — bộ lọc rỗng — xoá tất cả. Trước mọi lệnh <code>deleteMany</code> chạy tay trên production, hãy chạy đúng bộ lọc đó với <code>countDocuments</code> trước và đọc to con số lên.</p>
<p>Để làm rỗng cả collection, <code>drop()</code> nhanh hơn nhiều so với <code>deleteMany({})</code> (nó xoá tệp thay vì xoá từng tài liệu) — nhưng nó cũng xoá luôn chỉ mục và validator. Xoá không làm tệp dữ liệu co lại ngay: WiredTiger tái dùng chỗ trống được giải phóng (Bài 1.4).</p>

<h3>findOneAndUpdate: sửa và lấy kết quả trong một bước</h3>
<p>Hoá đơn cần số liên tiếp: 1, 2, 3… — không bao giờ hai hoá đơn trùng số, kể cả khi có mười máy chủ ứng dụng. Một tài liệu đếm và <code>$inc</code> làm được việc đó; <code>findOneAndUpdate</code> còn trả về tài liệu, nên bạn biết con số mình vừa giữ:</p>
${lenh('s02-5-atom', 4)}
${lenh('s02-5-atom', 5)}
<p><code>upsert: true</code> tạo bộ đếm ở lần dùng đầu tiên; <code>returnDocument: 'after'</code> trả về giá trị <em>sau</em> khi tăng. Không có nó, bạn nhận tài liệu <em>trước</em> khi đổi — lần gọi cuối ở trên trả về <code>seq: 3</code> dù nó vừa giữ số 4. Quên tuỳ chọn này là lỗi lệch một kinh điển khiến hai hoá đơn in ra cùng một số. Hai lưu ý: bộ đếm là một tài liệu "nóng" duy nhất, ổn cho vài trăm lượt ghi mỗi giây, không ổn cho hàng chục nghìn; và nếu lệnh chèn hoá đơn lỗi sau khi bạn đã giữ số, số đó bị bỏ trống — chấp nhận được với đa số hệ thống, nhưng về mặt pháp lý thì không với một số mẫu hoá đơn (khi đó dùng transaction, Bài 6.2).</p>

<h3>Giữ chỗ hàng tồn: cập nhật có điều kiện</h3>
<p>Tệp lab <code>_demo/giu-cho.js</code> thử mua một chiếc năm lần, theo hai cách: <em>ngây thơ</em> (đọc tồn kho; nếu ≥ 1 thì ghi tồn − 1) và <em>nguyên tử</em> (<code>updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } })</code> rồi kiểm <code>modifiedCount</code>). Mỗi sản phẩm bắt đầu với 5 chiếc; bốn tiến trình chạy cùng lúc — 20 lượt mua cho 5 chiếc:</p>
${lenh('s02-5-atom', 6)}
<p>Cả hai đều còn tồn 0 — nhưng bản ngây thơ ghi nhận <strong>hơn 5 lượt bán</strong> (con số cụ thể đổi theo mỗi lần chạy). Nhiều tiến trình cùng đọc được "tồn 1", tất cả cùng kết luận "OK, còn một chiếc", tất cả cùng bán nó. Bản nguyên tử bán đúng 5: bộ lọc <code>stock: { $gte: 1 }</code> và phép trừ được máy chủ đánh giá cùng nhau, dưới khoá của tài liệu, nên lượt mua thứ sáu đơn giản là không khớp gì.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ngây thơ</span><span class="lz-t">findOne → if (stock ≥ 1) → $set stock − 1</span><span class="lz-d">Kiểm và ghi là hai bước; giữa chúng chuyện gì cũng có thể xảy ra. Bán quá khi có tải.</span></div>
  <div class="lz-step"><span class="lz-k">nguyên tử</span><span class="lz-t">updateOne({ stock: { $gte: q } }, { $inc: { stock: −q } })</span><span class="lz-d">Điều kiện là một phần của lệnh ghi. <code>modifiedCount 0</code> ⇒ "hết hàng", trả 409.</span></div>
  <div class="lz-step"><span class="lz-k">nhiều tài liệu</span><span class="lz-t">giữ từng món, lỗi thì hoàn lại — hoặc transaction</span><span class="lz-d">Một đơn có 3 sản phẩm: lab Chương 2 làm bằng hoàn lại; Chương 6 làm bằng transaction.</span></div>
</div>

<h3>Hàng đợi việc không ai nhận trùng</h3>
${lenh('s02-5-atom', 7)}
${lenh('s02-5-atom', 8)}
${lenh('s02-5-atom', 9)}
<p>Mỗi worker hỏi: "tìm việc đang chờ cũ nhất <em>và</em> đánh dấu nó là của tôi". Vì tìm và cập nhật là một thao tác nguyên tử, hai worker không bao giờ nhận cùng một việc — worker C nhận <code>null</code> (hết việc) thay vì một việc trùng. Thêm một mốc <code>leaseUntil</code> để việc của worker bị sập được trả lại hàng đợi, và bạn có một hàng đợi nhỏ đáng tin cậy mà không cần thêm hạ tầng. (Khi cần thông lượng cao, hãy dùng hàng đợi hoặc log thật — Redis Streams ở khoá <code>redis</code>, Kafka ở khoá <code>kafka</code>.) <code>findOneAndDelete</code> là biến thể xoá việc ngay khi lấy; chỉ dùng nếu mất việc khi worker sập là chấp nhận được.</p>

<h3>bulkWrite: nhiều lệnh ghi khác loại, một vòng đi–về</h3>
${lenh('s02-5-atom', 10)}
<p>Một <code>bulkWrite</code> gồm bốn thao tác — cập nhật, chèn, upsert, xoá — với một <code>_id</code> trùng ở chỉ số 1. Có thứ tự (mặc định): thao tác 0 được áp, 1 lỗi, 2 và 3 bị bỏ qua — SP022 vẫn còn với giá cũ. Không thứ tự: mọi thứ trừ chỉ số 1 được áp — SP023 được upsert, SP022 bị xoá. Cùng luật như <code>insertMany</code> ở Bài 2.1: không rollback, đọc <code>writeErrors[].index</code>. <code>bulkWrite</code> là công cụ cho job đồng bộ ("áp 5.000 thay đổi này từ đối tác") và cho bước "trả hàng về kho cho từng món của đơn bị huỷ" trong lab chương này.</p>

<h3>Xoá mềm</h3>
${lenh('s02-5-atom', 11)}
${lenh('s02-5-atom', 12)}
<p>Thay vì gỡ một bình luận, hãy đặt <code>xoaLuc</code> (thời điểm xoá) và <code>xoaBoi</code> (người xoá); mọi truy vấn thông thường thêm <code>xoaLuc: null</code>. Bạn giữ được dấu vết kiểm toán và khả năng "hoàn tác", và sau này vẫn dọn được các tài liệu xoá mềm đã cũ bằng chỉ mục TTL (Chương 4). Cái giá: <em>mọi</em> truy vấn phải nhớ điều kiện đó — quên một bộ lọc là hiện nội dung đã xoá — và chỉ mục unique phải là partial (chỉ trên tài liệu chưa xoá), kẻo email của người dùng đã xoá chặn việc đăng ký lại. Các nhóm thường giấu điều kiện vào một hàm repository duy nhất thay vì tin rằng ai cũng nhớ thêm nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "khe hở có tí xíu, sẽ chẳng bao giờ xảy ra đâu".</strong> Phép kiểm tồn kho ngây thơ có một khe hở vài mili giây giữa đọc và ghi. Với 3 request mỗi phút thì không bao giờ xảy ra; trong một đợt flash sale vài trăm request mỗi giây thì nó xảy ra nhiều lần mỗi giây, và kẻ tấn công có thể cố tình gây ra bằng cách gửi nhiều request cùng lúc (mục tiếp theo). Nếu tính đúng của một thao tác phụ thuộc vào "không ai làm gì giữa lúc tôi đọc và lúc tôi ghi", hãy biến nó thành một thao tác nguyên tử hoặc đặt nó trong transaction.</p>
</div>

<h3>🛡️ Sự cố thật: thẻ quà Starbucks, 2015 — race condition in ra tiền</h3>
<p>Tháng 5/2015, nhà nghiên cứu bảo mật Egor Homakov (Sakurity) công bố cách anh có được tiền "vô hạn" trên thẻ quà Starbucks. starbucks.com cho người dùng chuyển số dư giữa các thẻ của chính mình. Lệnh chuyển kiểm số dư thẻ nguồn rồi mới chuyển tiền — hai bước. Homakov gửi cùng một request "chuyển 5 đô từ thẻ 1 sang thẻ 2" từ hai phiên trình duyệt <em>cùng một lúc</em>. Sau vài lần thử, cả hai request đều qua được bước kiểm số dư trước khi request nào kịp trừ tiền: thẻ 1 (số dư 5 đô) chuyển 5 đô hai lần, và hai thẻ 5 đô của anh giờ có tổng cộng 20 đô. Anh tiêu phần dư ở một cửa hàng Starbucks để chứng minh đó là tiền thật, nạp thêm tiền vào thẻ để trả lại, rồi báo lỗi — mà theo anh viết, rất khó tìm được ai ở công ty chịu lắng nghe.</p>
<p>Đó chính là phép kiểm tồn kho ngây thơ bạn vừa chạy, chỉ là tiền thay cho áo thun. Cách sửa cũng vậy: điều kiện số dư phải là một phần của lệnh ghi (<code>updateOne({ _id: the1, balance: { $gte: 5 } }, { $inc: { balance: -5 } })</code>), và một lệnh chuyển chạm vào hai tài liệu cần transaction (Chương 6). Nhận xét của anh rằng lập trình viên hay dùng "những biện pháp bảo vệ kém như giới hạn số request theo IP… hay thêm độ trễ ngẫu nhiên" rất đáng nhớ: giới hạn tốc độ và độ trễ làm lỗi hiếm đi, không làm nó biến mất.</p>
${nguon('🛡️', 'Egor Homakov — Hacking Starbucks for unlimited coffee (Sakurity, 05/2015)', 'Race condition khi chuyển số dư thẻ quà, kèm trình tự khai thác', 'https://sakurity.com/blog/2015/05/21/starbucks.html')}
${nguon('📘', 'db.collection.findOneAndUpdate() — MongoDB Docs', 'returnDocument, upsert, sort, projection', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/')}
${nguon('📘', 'db.collection.bulkWrite() — MongoDB Docs', 'Các loại thao tác, có thứ tự và không thứ tự, xử lý lỗi', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/')}

<h3>💼 Đi làm: flash sale lúc 12:00</h3>
<p>Đội marketing của khách hàng lên kế hoạch flash sale: 200 điện thoại giảm nửa giá, đúng 12:00. Trưởng nhóm nhờ bạn review endpoint "mua". Bạn tìm đúng ba điều: (1) phép trừ tồn kho là cập nhật có điều kiện (<code>stock: { $gte: qty }</code> trong bộ lọc) và endpoint trả 409 khi <code>modifiedCount</code> bằng 0 — không có "đọc rồi kiểm" ở bất cứ đâu; (2) số đơn lấy từ bộ đếm nguyên tử với <code>returnDocument: 'after'</code>; (3) lỗi xảy ra sau khi đã giữ hàng (dịch vụ thanh toán sập) thì trả hàng lại kho — bằng hoàn lại hoặc transaction. Rồi bạn chứng minh: một script với 50 người mua song song nhắm vào một sản phẩm thử có tồn 10, khẳng định đúng 10 đơn. Script đó, đính kèm vào pull request, đáng giá hơn mọi lời giải thích.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Chống bán quá số hàng thế nào?"</strong> — Cập nhật nguyên tử có điều kiện: điều kiện tồn kho trong bộ lọc, <code>$inc</code> số âm, kiểm <code>modifiedCount</code>; transaction cho đơn nhiều tài liệu.</li>
<li><strong>"Sinh id tuần tự trong MongoDB thế nào?"</strong> — Tài liệu đếm + <code>findOneAndUpdate</code> với <code>$inc</code>, <code>upsert</code>, <code>returnDocument: 'after'</code>; biết rằng nó là điểm nóng và có thể để lại khoảng trống.</li>
<li><strong>"findOneAndUpdate khác updateOne?"</strong> — Cùng một thay đổi nguyên tử; findOneAndUpdate còn trả về tài liệu (trước hoặc sau).</li>
<li><strong>"Dựng một hàng đợi việc đơn giản trên MongoDB thế nào?"</strong> — findOneAndUpdate trên <code>status: 'waiting'</code>, sắp theo thời điểm tạo, đặt worker + lease; đưa lại các lease đã hết hạn vào hàng đợi.</li>
<li><strong>"Xoá mềm được gì, mất gì?"</strong> — Có kiểm toán và hoàn tác, đổi lại mọi truy vấn và chỉ mục unique phải tính tới tài liệu đã xoá.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Sửa <code>_demo/giu-cho.js</code> để mỗi lượt mua lấy <strong>2</strong> chiếc, tồn ban đầu 5. Bản nguyên tử bán được bao nhiêu lượt? Tồn cuối là bao nhiêu? Chạy để kiểm.</li>
<li>Thêm lease cho hàng đợi việc: khi worker nhận việc, đặt <code>leaseUntil</code> = bây giờ + 30 giây. Viết truy vấn worker dùng để nhận được cả những việc có lease đã hết hạn.</li>
<li>Viết một <code>bulkWrite</code>, với danh sách <code>{ sku, price }</code> nhập vào, cập nhật giá cho sản phẩm đã có và tạo sản phẩm chưa có với <code>stock: 0</code> — mà không đụng tới tồn kho của sản phẩm đã có.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. Bộ lọc <code>stock: { $gte: 2 }</code>, cập nhật <code>$inc: { stock: -2 }</code>: đúng 2 lượt bán, tồn cuối 1 — request thứ ba thấy tồn 1 &lt; 2 và không khớp gì.</p>
<p>2. <code>db.viec.findOneAndUpdate({ $or: [{ trangThai: 'CHO' }, { trangThai: 'DANG_LAM', leaseUntil: { $lt: new Date() } }] }, { $set: { trangThai: 'DANG_LAM', nguoiLam: 'worker-A', leaseUntil: new Date(Date.now() + 30000) } }, { sort: { taoLuc: 1 }, returnDocument: 'after' })</code>. Worker làm xong thì đặt <code>trangThai: 'XONG'</code> với bộ lọc theo chính tên mình, để worker có lease đã hết hạn không đánh dấu xong được việc của người khác.</p>
<p>3. <code>db.sp.bulkWrite(list.map(({ sku, price }) => ({ updateOne: { filter: { _id: sku }, update: { $set: { price: Decimal128(String(price)) }, $setOnInsert: { stock: 0 } }, upsert: true } })), { ordered: false })</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn giải thích được, bằng các từ "bộ lọc" và "nguyên tử", vì sao bản nguyên tử không bao giờ bán được chiếc thứ sáu.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['deletedCount', 'Số tài liệu lệnh xoá đã gỡ — hãy kiểm nó; gõ sai cho ra 0 mà không báo lỗi.'],
  ['findOneAndUpdate', 'Cập nhật nguyên tử đồng thời trả về tài liệu, trước (mặc định) hoặc sau (<code>returnDocument: \'after\'</code>).'],
  ['Cập nhật có điều kiện', 'Điều kiện tiên quyết (tồn ≥ q, version = 7) nằm trong bộ lọc, nên kiểm và ghi là một bước nguyên tử.'],
  ['Race condition', 'Kết quả phụ thuộc thời điểm của các request đồng thời; "kiểm rồi làm" tách hai bước là nguyên nhân điển hình.'],
  ['bulkWrite', 'Nhiều thao tác chèn/cập nhật/thay thế/xoá trong một lệnh; có thứ tự hoặc không, không rollback.'],
  ['Xoá mềm', 'Đánh dấu đã xoá (<code>deletedAt</code>) thay vì gỡ; mọi truy vấn phải lọc theo nó.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm <code>deletedCount</code>; đếm trước khi <code>deleteMany</code> bằng tay; dùng <code>drop</code> để làm rỗng collection.</li>
<li><code>findOneAndUpdate</code> + <code>$inc</code> + <code>returnDocument: 'after'</code> = số tuần tự không trùng.</li>
<li>Đưa điều kiện tiên quyết vào bộ lọc: bản nguyên tử bán đúng 5, bản ngây thơ bán nhiều hơn số đang có.</li>
<li><code>findOneAndUpdate</code> còn cho một hàng đợi việc an toàn; <code>bulkWrite</code> gom các lệnh ghi khác loại.</li>
<li>Race condition là kiểu tấn công có thật (Starbucks 2015), không phải lý thuyết; giới hạn tốc độ không sửa được nó.</li>
</ul>
</div>
`,
};
