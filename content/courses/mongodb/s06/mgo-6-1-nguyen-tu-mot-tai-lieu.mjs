/**
 * 6.1 — Nguyên tử trong một tài liệu và cập nhật đồng thời (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s06-1-nguyen-tu'] (MongoDB 8.0.38, mgo-lab; kịch bản demo/s06/s06-1-nguyen-tu.txt tự nạp lại CT Shop, ghi ở ch6).
 * Số tất định: SP017 Áo thun CT size M tồn 7 ⇒ giữ 2 còn 5, giữ 50 ⇒ matchedCount 0; 4 tiến trình × 2000 $inc ⇒ n = 8000 (writeConflicts tăng hàng nghìn — số đổi);
 * GIO-VER luôn 200 món / v 200 / tong 1.900.000; GIO-THO < 200 món (số đổi); chuyển không transaction: hàng nghìn lần đọc thấy tổng ≠ 2.000.000 (số đổi), cuối cùng vẫn 1.000.000/1.000.000;
 * updateMany 300.000 tài liệu + maxTimeMS 40 ⇒ MaxTimeMSExpired, một phần đã cộng; chạy lại ⇒ có tài liệu bị cộng HAI lần; bản có dấu đợt ⇒ đúng 300.000 tài liệu diem 1.
 * Kiểm trùng: bộ đếm nguyên tử, giữ hàng một mã, 4 tiến trình mất cập nhật đã ở Bài 2.4/2.5 (chỉ nhắc lại, không dạy lại); khoá lạc quan phía Spring/JPA ở spring-boot 7.5;
 * lost update phía PostgreSQL ở postgresql 11.4 ⇒ liên kết chéo.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's06-1-nguyen-tu';

const VER = `// Trích _demo/gio-ver.js — khoá lạc quan bằng trường v
for (;;) {
  const h = db.gio.findOne({ _id: 'GIO-VER' });             // 1. đọc, nhớ v
  const it = [...h.items, mon];                              // 2. tính ở ứng dụng (luật giá phức tạp)
  const r = db.gio.updateOne(
    { _id: 'GIO-VER', v: h.v },                              // 3. chỉ ghi nếu chưa ai sửa từ lúc đọc
    { $set: { items: it, tong: tinhTong(it) }, $inc: { v: 1 } });
  if (r.matchedCount === 1) break;                           // thắng
  thuLai++;                                                  // thua ⇒ đọc lại, làm lại
}`;

const API = `// Trích _demo/node/gio-409.mjs — PUT /gio/:id (node:http, không cần Express)
const { v, items } = JSON.parse(body);                     // client gửi lại v nó đã đọc
const r = await gio.updateOne({ _id: id, v }, { $set: { items, tong: tinhTong(items) }, $inc: { v: 1 } });
if (r.matchedCount === 0) {
  res.statusCode = 409;
  return res.end(JSON.stringify({ loi: 'Giỏ đã đổi ở nơi khác, tải lại rồi thử lại' }));
}
res.end(JSON.stringify({ v: v + 1 }));`;

export default {
  title: '6.1 — Single-document atomicity and concurrent updates|||6.1 — Nguyên tử trong một tài liệu và cập nhật đồng thời',
  slug: 'mgo-6-1-nguyen-tu-mot-tai-lieu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Chính xác thì cái gì là nguyên tử trong MongoDB: một lệnh ghi trên một tài liệu — mọi trường, mọi mảng lồng — và không hơn. Giữ hàng cho một biến thể áo và ghi phiếu giữ chỗ trong cùng một lệnh; máy chủ tự thử lại hàng nghìn xung đột ghi mà bạn không thấy; khoá lạc quan bằng trường version khi luật nghiệp vụ không viết được thành một lệnh (đo thật 4 tiến trình: bản ngây thơ mất món, bản có version đủ 200); bẫy updateMany bị ngắt giữa chừng để lại một nửa và chạy lại thì cộng hai lần; bẫy hai lệnh cho hai tài liệu — người đọc thấy tiền "bốc hơi".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Single-document atomicity and concurrent updates</h2>
<p class="lead">Chapter 2 already used the most important tool of this chapter: a conditional update such as "subtract one from stock <em>if</em> stock ≥ 1" is checked and applied in one step, so four processes cannot oversell (Lesson 2.5). This lesson makes the rule precise — <strong>exactly what</strong> MongoDB guarantees to be atomic, <strong>where the guarantee stops</strong>, and what to do when your business rule cannot be written as one update. The next lesson then crosses the line with multi-document transactions.</p>

<h3>An everyday picture: one sign-up sheet</h3>
<p>A tutoring class keeps one paper sign-up sheet on the teacher's desk. Whoever holds the pen writes a whole line — name, phone, seat number — and only then passes the pen on. Nobody ever sees half a line. That is a <em>single document</em>: one write changes it completely or not at all, and readers see the line before or after, never in between. Now suppose seats are on one sheet and payments on another sheet in a different room. Writing your seat and then walking to the other room to record your payment are two separate acts: someone reading both sheets in between sees a seat that nobody has paid for — and if you trip on the stairs, the payment is never recorded. MongoDB works the same way.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">one update · one document</span><span class="lz-t">atomic</span><span class="lz-d">every field, nested object and array element changed by that update — all or nothing; readers see before or after</span></div>
  <div class="lz-step"><span class="lz-k">one updateMany · many documents</span><span class="lz-t">each document atomic, the command is NOT</span><span class="lz-d">interrupted halfway ⇒ some documents changed, others not; other readers see the mix while it runs</span></div>
  <div class="lz-step"><span class="lz-k">several commands</span><span class="lz-t">no guarantee at all between them</span><span class="lz-d">unless you put them in a transaction (Lesson 6.2) — or redesign so the data that changes together lives in one document (Chapter 3)</span></div>
</div>
${nguon('📘', 'Atomicity and Transactions — MongoDB Docs', 'A write operation is atomic on the level of a single document, even if it modifies multiple embedded documents', 'https://www.mongodb.com/docs/manual/core/write-operations-atomicity/')}

<h3>Everything in one document, in one step</h3>
<p>Because the guarantee covers the <em>whole</em> document, a good schema puts the data that must change together inside one document. A shirt with its size variants (Chapter 1) is such a document. Reserving two shirts in size M must do three things: check that M has at least 2, subtract 2 from M, and record the reservation so it can expire later. All three fit in one update:</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>The filter <code>$elemMatch: { size: 'M', stock: { $gte: 2 } }</code> is the check; <code>'variants.$.stock'</code> (the positional operator, Lesson 2.4) is the element that matched; <code>$inc</code> on <code>giuChoTong</code> and <code>$push</code> on <code>giuCho</code> change two more fields. No other client can ever see M at 5 without the reservation, or the reservation without the stock change. When the check fails, nothing changes and the result says so:</p>
${lenh(K, 3)}
<p><code>matchedCount: 0</code> is your "out of stock" signal — the application must read it. Code that ignores the result and answers "reserved!" is the most common bug around conditional updates.</p>

<h3>What the server does when two writers hit the same document</h3>
<p>WiredTiger uses <em>document-level</em> concurrency: two updates to different documents run in parallel; two updates to the same document conflict, and one of them must wait and retry. Outside a transaction the server does that retry for you, silently. Four processes each increment one counter 2,000 times:</p>
${lenh(K, 4)}
<p>The counter is exactly 8,000 — no lost update — while the server's <code>writeConflicts</code> metric went up by thousands: thousands of times an update collided, was thrown away inside the engine and re-run. You never saw an error. Remember this number for Lesson 6.2: inside a transaction the server <em>cannot</em> retry for you, and the same collision comes back to your code as a <code>WriteConflict</code> error.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a hot document is a queue.</strong> "No lost updates" does not mean "free". Every write to one document is serialized; thousands of conflicts are thousands of wasted attempts. A single global counter, a single "shop wallet" that every order credits, a single "views" field on a viral post — these become the bottleneck long before the server is busy. Spread the load (one counter document per shard of time or per bucket, summed by aggregation — Lesson 3.4) when one document receives hundreds of writes per second.</p>
</div>

<h3>When one update cannot express the rule: optimistic locking</h3>
<p><code>$inc</code> with a condition covers counters and stock. But some rules are computed by application code: a cart total with a discount when the cart has 10 items or more, a price from a rules engine, a document validated by a library. The code must <em>read</em> the document, compute, and <em>write it back</em>. Between the read and the write, someone else can change the document — and the write-back silently erases their change. That is the lost update you already saw in Lesson 2.4.</p>
<p>The standard fix is <strong>optimistic locking</strong>: store a version number <code>v</code>; write only if <code>v</code> is still the value you read, and increment it in the same update. If someone got there first, your filter matches nothing; you read again and redo the computation:</p>
${ma('js', VER)}
<p>Four processes add 50 items each to two carts at the same time — <code>GIO-THO</code> written back blindly, <code>GIO-VER</code> with the version check:</p>
${lenh(K, 5)}
<p>The blind cart has fewer than 200 items: some processes wrote back a cart they had read before another process's item arrived, and that item vanished — the total is wrong too. The versioned cart has exactly 200 items, <code>v = 200</code> and the right total; the price was a handful of retries per process. "Optimistic" means betting that conflicts are rare and paying only when they happen — the right bet for carts, profiles and settings, where two people rarely edit the same document at the same moment.</p>
<p>In an API, the version travels to the client and back. The client sends the <code>v</code> it loaded; a mismatch becomes HTTP 409 Conflict ("this was changed elsewhere, reload"). The lab file <code>_demo/node/gio-409.mjs</code> runs a tiny server on 127.0.0.1:47099:</p>
${ma('js', API)}
<p>Two tabs load the cart (<code>v = 0</code>) and save at the same moment:</p>
${lenh('s06-1b-api', 0)}
<p>One tab wins and the cart becomes <code>v = 1</code>; the other gets 409 and must reload — nothing is silently overwritten. Which tab wins depends on timing.</p>
<p>Libraries have this built in: Mongoose's <code>optimisticConcurrency</code> schema option (Chapter 8) and Spring Data's <code>@Version</code>.</p>
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Optimistic and pessimistic locking', sub: '@Version, OptimisticLockException and retry on the Java side' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Row locks, lost updates and deadlocks', sub: 'The same lost update in SQL, and SELECT … FOR UPDATE (MongoDB has no row lock you can hold)' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — an unbounded retry loop.</strong> The loop above retries forever. Under heavy contention (a flash sale, a buggy client re-sending), it spins. Production code retries a few times with a short random delay and then gives up with 409 or 503. And never retry by re-applying the <em>old</em> computed value — re-read first, or you are back to the blind write.</p>
</div>

<h3>updateMany is not all-or-nothing</h3>
<p>"Add 1 point to every student" on 300,000 documents. Each document is updated atomically, but the command as a whole is not: if it is interrupted — a time limit, a failover, a killed operation, a lost connection — the documents already updated stay updated. Here a 40 ms time limit plays the role of the interruption:</p>
${lenh(K, 7)}
<p>A few thousand students got their point; everyone else did not, and there is no undo. The natural reaction — "it failed, run it again" — is worse:</p>
${lenh(K, 8)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — re-running a non-idempotent multi-update.</strong> Now there are students with 2 points: the first run had already given them one, and <code>$inc</code> gave them another. With money, that is paying a bonus twice. Any multi-document write that may be retried must be <em>idempotent</em>: running it twice must equal running it once. The fix is to mark each document as processed in the same atomic update and to filter on the mark:</p>
${lenh(K, 9)}
<p>Each run picks up only documents without the mark <code>dot: 'cong-T11'</code>. Interrupted runs simply leave work for the next run; the loop ends when a run modifies nothing. Result: exactly 300,000 students with 1 point. This pattern — <em>marker field + filter on it</em> — is how batch jobs (monthly interest, bulk price changes, migrations in Lesson 3.4) survive crashes without transactions.</p>
</div>

<h3>Two documents, two commands: what a reader sees</h3>
<p>Moving money between two accounts stored as two documents takes two updates. Here one process moves 1,000 đ back and forth 3,000 times while another process reads both balances 3,000 times and checks that the total is still 2,000,000 đ:</p>
${lenh(K, 6)}
<p>The final balances are right — every transfer completed. But roughly half of the reads saw a total of 1,999,000 đ: the moment after the money left one account and before it arrived in the other. In a report, a reconciliation job or an admin dashboard, that is "money disappeared". And if the application crashed between the two commands, the money would disappear for good. Two ways out: design so the change touches one document (for example, a ledger document per transfer holding both legs, with balances computed by aggregation), or wrap the two commands in a transaction — the next lesson, where the same reader will see the wrong total <strong>zero</strong> times.</p>

<h3>💼 At work: "the cart loses items when I use two tabs"</h3>
<p>A classic ticket on an outsourcing project: a customer adds an item on the phone and another on the laptop, and one disappears. You open the code and find <code>const cart = await Cart.findById(id); cart.items.push(item); await cart.save();</code> — read, modify, write the whole document, no version check. Your fix in the pull request: either a single atomic update (<code>$push</code> the item, recompute the total in the same update with an update pipeline, Lesson 2.4) or optimistic locking with a version and a 409 for the client. In the PR description, include a reproduction: a script that runs two concurrent requests and shows the lost item before the fix and not after. Reviewers trust a reproduction far more than "should be fixed".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is atomic in MongoDB without a transaction?"</strong> — One write operation on one document, including all embedded documents and arrays it modifies. Not a multi-document command, not several commands.</li>
<li><strong>"How do you prevent overselling?"</strong> — Put the check in the filter of the same update: <code>{ _id, stock: { $gte: qty } }</code> with <code>$inc: { stock: -qty }</code>, then read <code>modifiedCount</code>.</li>
<li><strong>"What is optimistic locking and when would you use it?"</strong> — A version field checked in the update filter and incremented by the update; on mismatch, re-read and retry or return 409. For read-compute-write logic with rare conflicts.</li>
<li><strong>"updateMany failed halfway. What state is the data in?"</strong> — Partially updated. Make the job idempotent (marker field + filter) and rerun until nothing is modified; or use a transaction if all-or-nothing is required and the size allows.</li>
<li><strong>"Does MongoDB have row locks like SELECT FOR UPDATE?"</strong> — No lock you can hold across commands outside a transaction; concurrent writes to one document are serialized and retried by the engine. Inside a transaction, the first writer wins and the second gets a WriteConflict.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write one update that reserves 1 shirt of size L <em>and</em> 1 of size XL of <code>SP017</code> only if <em>both</em> sizes have stock. (Hint: two <code>$elemMatch</code> conditions in <code>$and</code>, and <code>arrayFilters</code>.) What happens if L has stock and XL does not?</li>
<li>Change <code>_demo/gio-ver.js</code> so a process gives up after 3 failed attempts and counts how many items it could not add. Run 4 processes again. Is the versioned cart still correct (items = 200 − given up)?</li>
<li>A nightly job adds monthly interest (<code>$mul: { du: 1.004 }</code>) to 100,000 accounts and may crash. Make it safe to rerun.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.sp.updateOne({ _id: 'SP017', $and: [{ variants: { $elemMatch: { size: 'L', stock: { $gte: 1 } } } }, { variants: { $elemMatch: { size: 'XL', stock: { $gte: 1 } } } }] }, { $inc: { 'variants.$[l].stock': -1, 'variants.$[xl].stock': -1 } }, { arrayFilters: [{ 'l.size': 'L' }, { 'xl.size': 'XL' }] })</code>. If XL is out of stock the filter does not match, <code>matchedCount</code> is 0, and <strong>neither</strong> size changes — the whole check-and-write is one atomic step on one document.</p>
<p>2. Wrap the inner loop in <code>for (let lan = 0; lan &lt; 3; lan++)</code> and count misses. The cart stays correct: items = 200 − misses, <code>v</code> = items, total consistent with items. Giving up is safe; writing a stale value is not.</p>
<p>3. Filter on a marker and set it in the same update: <code>updateMany({ laiThang: { $ne: '2026-11' } }, [{ $set: { du: { $multiply: ['$du', 1.004] }, laiThang: '2026-11' } }])</code> — rerun until <code>modifiedCount</code> is 0. (Use Decimal128 for real money, Lesson 1.2.)</p>
</details>
<p><strong>Done when:</strong> for every write in your code you can say whether it touches one document or several, and what a reader or a crash in the middle would see.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Single-document atomicity', 'One write on one document is all-or-nothing and isolated: readers see the document before or after it.'],
  ['Conditional update', 'An update whose filter contains the business check (stock ≥ qty, v = 7); matchedCount 0 means the check failed.'],
  ['Write conflict', 'Two concurrent writes to the same document; outside a transaction the engine retries silently (metrics.operation.writeConflicts).'],
  ['Lost update', 'Read-modify-write overwrites a change made by someone else between the read and the write.'],
  ['Optimistic locking', 'Version field checked in the filter and incremented in the update; mismatch ⇒ retry or HTTP 409.'],
  ['Idempotent', 'Running an operation twice has the same effect as once — required for anything that may be retried.'],
  ['Hot document', 'One document receiving many concurrent writes; its writes are serialized and become a bottleneck.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Atomic = one write, one document (all its fields and arrays). Nothing larger, without a transaction.</li>
<li>Put the check in the filter of the same update and read <code>matchedCount</code>/<code>modifiedCount</code>.</li>
<li>The engine silently retries write conflicts outside transactions — correct, but a hot document is a queue.</li>
<li>Read-compute-write needs optimistic locking: version in the filter, increment in the update, bounded retries.</li>
<li><code>updateMany</code> can stop halfway; make batch jobs idempotent with a marker field before you rerun them.</li>
<li>Two documents changed by two commands are visible half-done to readers and can be left half-done by a crash.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Nguyên tử trong một tài liệu và cập nhật đồng thời</h2>
<p class="lead">Chương 2 đã dùng công cụ quan trọng nhất của chương này: một lệnh cập nhật có điều kiện kiểu "trừ một ở kho <em>nếu</em> kho ≥ 1" được kiểm và ghi trong một bước, nên bốn tiến trình không thể bán quá (Bài 2.5). Bài này nói cho chính xác: <strong>đúng cái gì</strong> MongoDB bảo đảm nguyên tử, <strong>bảo đảm dừng ở đâu</strong>, và làm gì khi luật nghiệp vụ không viết được thành một lệnh. Bài sau mới bước qua ranh giới đó bằng transaction nhiều tài liệu.</p>

<h3>Hình ảnh đời thường: một tờ đăng ký</h3>
<p>Một lớp học thêm để một tờ giấy đăng ký trên bàn giáo viên. Ai cầm bút thì viết trọn một dòng — tên, số điện thoại, số ghế — rồi mới chuyển bút. Không ai thấy nửa dòng. Đó là <em>một tài liệu</em>: một lần ghi đổi nó trọn vẹn hoặc không đổi gì, người đọc thấy dòng trước hoặc sau khi viết, không bao giờ ở giữa. Giờ giả sử ghế ghi ở một tờ, tiền học ghi ở một tờ khác trong phòng khác. Ghi ghế rồi đi sang phòng kia ghi tiền là hai việc tách rời: ai đọc cả hai tờ vào lúc giữa sẽ thấy một ghế chưa ai trả tiền — và nếu bạn vấp ngã ở cầu thang, tiền không bao giờ được ghi. MongoDB cũng y như vậy.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">một lệnh · một tài liệu</span><span class="lz-t">nguyên tử</span><span class="lz-d">mọi trường, object lồng, phần tử mảng mà lệnh đó đổi — được hết hoặc không gì; người đọc thấy trước hoặc sau</span></div>
  <div class="lz-step"><span class="lz-k">một updateMany · nhiều tài liệu</span><span class="lz-t">từng tài liệu nguyên tử, cả lệnh thì KHÔNG</span><span class="lz-d">bị ngắt giữa chừng ⇒ một số tài liệu đã đổi, số khác chưa; người khác đọc thấy lẫn lộn trong lúc chạy</span></div>
  <div class="lz-step"><span class="lz-k">nhiều lệnh</span><span class="lz-t">giữa chúng không có bảo đảm gì</span><span class="lz-d">trừ khi đặt trong transaction (Bài 6.2) — hoặc thiết kế lại để dữ liệu cùng đổi nằm trong một tài liệu (Chương 3)</span></div>
</div>
${nguon('📘', 'Atomicity and Transactions — MongoDB Docs', 'Một thao tác ghi là nguyên tử ở mức một tài liệu, kể cả khi nó sửa nhiều tài liệu nhúng', 'https://www.mongodb.com/docs/manual/core/write-operations-atomicity/')}

<h3>Mọi thứ trong một tài liệu, trong một bước</h3>
<p>Vì bảo đảm phủ <em>cả</em> tài liệu, một schema tốt đặt dữ liệu phải đổi cùng nhau vào một tài liệu. Chiếc áo cùng các biến thể size (Chương 1) là tài liệu như thế. Giữ hai áo size M phải làm ba việc: kiểm M còn ít nhất 2, trừ 2 ở M, và ghi lại phiếu giữ chỗ để sau này hết hạn. Cả ba nằm gọn trong một lệnh:</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>Bộ lọc <code>$elemMatch: { size: 'M', stock: { $gte: 2 } }</code> là phần kiểm; <code>'variants.$.stock'</code> (toán tử vị trí, Bài 2.4) là phần tử vừa khớp; <code>$inc</code> ở <code>giuChoTong</code> và <code>$push</code> ở <code>giuCho</code> đổi thêm hai trường. Không client nào có thể thấy M còn 5 mà chưa có phiếu giữ, hay có phiếu mà kho chưa trừ. Khi kiểm không qua, không gì đổi và kết quả nói rõ:</p>
${lenh(K, 3)}
<p><code>matchedCount: 0</code> chính là tín hiệu "hết hàng" — ứng dụng phải đọc nó. Mã bỏ qua kết quả rồi trả lời "đã giữ hàng!" là lỗi hay gặp nhất quanh lệnh có điều kiện.</p>

<h3>Máy chủ làm gì khi hai người cùng ghi một tài liệu</h3>
<p>WiredTiger xử lý đồng thời ở <em>mức tài liệu</em>: hai lệnh sửa hai tài liệu khác nhau chạy song song; hai lệnh sửa cùng một tài liệu thì xung đột, một lệnh phải chờ và chạy lại. Ngoài transaction, máy chủ tự chạy lại giúp bạn, lặng lẽ. Bốn tiến trình, mỗi tiến trình cộng một bộ đếm 2.000 lần:</p>
${lenh(K, 4)}
<p>Bộ đếm đúng 8.000 — không mất lượt nào — trong khi chỉ số <code>writeConflicts</code> của máy chủ tăng hàng nghìn: hàng nghìn lần một lệnh va chạm, bị bỏ bên trong engine và chạy lại. Bạn không thấy lỗi nào. Nhớ con số này cho Bài 6.2: trong transaction máy chủ <em>không thể</em> chạy lại hộ bạn, và đúng va chạm đó quay về mã của bạn dưới dạng lỗi <code>WriteConflict</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một tài liệu "nóng" là một hàng đợi.</strong> "Không mất cập nhật" không có nghĩa là "miễn phí". Mọi lệnh ghi vào một tài liệu bị xếp hàng; hàng nghìn xung đột là hàng nghìn lần làm phí. Một bộ đếm toàn cục duy nhất, một "ví của shop" mà mọi đơn đều cộng vào, một trường "lượt xem" của bài đăng đang lan truyền — chúng thành nút thắt từ rất lâu trước khi máy chủ bận. Hãy chia tải (mỗi khoảng thời gian hoặc mỗi nhóm một tài liệu đếm, cộng lại bằng aggregation — Bài 3.4) khi một tài liệu nhận hàng trăm lệnh ghi mỗi giây.</p>
</div>

<h3>Khi một lệnh không diễn đạt được luật: khoá lạc quan</h3>
<p><code>$inc</code> có điều kiện lo được bộ đếm và tồn kho. Nhưng có những luật do mã ứng dụng tính: tổng giỏ hàng có giảm giá khi giỏ từ 10 món, giá lấy từ một bộ luật, tài liệu được kiểm bằng một thư viện. Mã phải <em>đọc</em> tài liệu, tính, rồi <em>ghi lại</em>. Giữa lúc đọc và lúc ghi, người khác có thể sửa tài liệu — và lần ghi lại lặng lẽ xoá mất thay đổi của họ. Đó là lost update bạn đã thấy ở Bài 2.4.</p>
<p>Cách sửa chuẩn là <strong>khoá lạc quan</strong> (optimistic locking): lưu một số phiên bản <code>v</code>; chỉ ghi nếu <code>v</code> vẫn bằng giá trị bạn đã đọc, và tăng nó trong cùng lệnh. Nếu ai đó tới trước, bộ lọc không khớp gì; bạn đọc lại và tính lại:</p>
${ma('js', VER)}
<p>Bốn tiến trình cùng lúc thêm mỗi tiến trình 50 món vào hai giỏ — <code>GIO-THO</code> ghi lại mù quáng, <code>GIO-VER</code> có kiểm phiên bản:</p>
${lenh(K, 5)}
<p>Giỏ ghi mù có ít hơn 200 món: vài tiến trình đã ghi lại một giỏ mà nó đọc trước khi món của tiến trình khác tới, và món đó biến mất — tổng tiền cũng sai theo. Giỏ có phiên bản đủ đúng 200 món, <code>v = 200</code> và tổng đúng; cái giá là vài lần thử lại mỗi tiến trình. "Lạc quan" nghĩa là đặt cược rằng xung đột hiếm và chỉ trả giá khi nó xảy ra — đúng cho giỏ hàng, hồ sơ, cài đặt, nơi hai người hiếm khi sửa cùng một tài liệu cùng một lúc.</p>
<p>Trong API, phiên bản đi tới client và quay về. Client gửi lại <code>v</code> nó đã tải; lệch thì thành HTTP 409 Conflict ("dữ liệu đã đổi ở nơi khác, hãy tải lại"). Tệp lab <code>_demo/node/gio-409.mjs</code> chạy một máy chủ nhỏ ở 127.0.0.1:47099:</p>
${ma('js', API)}
<p>Hai tab cùng tải giỏ (<code>v = 0</code>) rồi lưu cùng một lúc:</p>
${lenh('s06-1b-api', 0)}
<p>Một tab thắng và giỏ thành <code>v = 1</code>; tab kia nhận 409 và phải tải lại — không gì bị ghi đè lặng lẽ. Tab nào thắng là tuỳ thời điểm.</p>
<p>Thư viện có sẵn cơ chế này: tuỳ chọn schema <code>optimisticConcurrency</code> của Mongoose (Chương 8) và <code>@Version</code> của Spring Data.</p>
${lienKet({ cta: 'Mở bài', khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Khoá lạc quan và bi quan', sub: '@Version, OptimisticLockException và thử lại phía Java' })}
${lienKet({ cta: 'Mở bài', khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá dòng, lost update và deadlock', sub: 'Cùng lost update trong SQL, và SELECT … FOR UPDATE (MongoDB không có khoá dòng để bạn giữ)' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — vòng thử lại không giới hạn.</strong> Vòng lặp ở trên thử mãi. Khi tranh chấp nặng (đợt flash sale, một client lỗi gửi đi gửi lại), nó quay tròn. Mã chạy thật chỉ thử vài lần với độ trễ ngẫu nhiên ngắn rồi bỏ cuộc bằng 409 hoặc 503. Và đừng bao giờ thử lại bằng cách ghi lại giá trị <em>cũ</em> đã tính — phải đọc lại trước, không thì bạn quay về đúng lần ghi mù.</p>
</div>

<h3>updateMany không phải được-hết-hoặc-không-gì</h3>
<p>"Cộng 1 điểm cho mọi học sinh" trên 300.000 tài liệu. Mỗi tài liệu được sửa nguyên tử, nhưng cả lệnh thì không: nếu bị ngắt — hết thời gian, chuyển dự phòng, lệnh bị huỷ, mất kết nối — các tài liệu đã sửa vẫn giữ nguyên đã sửa. Ở đây giới hạn 40 ms đóng vai cú ngắt:</p>
${lenh(K, 7)}
<p>Vài nghìn học sinh được cộng điểm; số còn lại thì không, và không có nút hoàn tác. Phản xạ tự nhiên — "lỗi rồi, chạy lại thôi" — còn tệ hơn:</p>
${lenh(K, 8)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chạy lại một lệnh sửa nhiều tài liệu không idempotent.</strong> Giờ có học sinh được 2 điểm: lần chạy đầu đã cộng cho họ một, và <code>$inc</code> cộng thêm một nữa. Với tiền, đó là trả thưởng hai lần. Mọi lệnh ghi nhiều tài liệu có thể bị chạy lại đều phải <em>idempotent</em>: chạy hai lần bằng chạy một lần. Cách sửa: đánh dấu từng tài liệu đã xử lý ngay trong cùng lệnh nguyên tử, và lọc theo dấu đó:</p>
${lenh(K, 9)}
<p>Mỗi lượt chỉ nhặt các tài liệu chưa có dấu <code>dot: 'cong-T11'</code>. Lượt bị ngắt chỉ để lại việc cho lượt sau; vòng lặp kết thúc khi một lượt không sửa gì. Kết quả: đúng 300.000 học sinh có 1 điểm. Mẫu này — <em>trường đánh dấu + lọc theo nó</em> — là cách các tác vụ chạy lô (lãi hằng tháng, đổi giá hàng loạt, di trú schema ở Bài 3.4) sống sót qua sự cố mà không cần transaction.</p>
</div>

<h3>Hai tài liệu, hai lệnh: người đọc thấy gì</h3>
<p>Chuyển tiền giữa hai tài khoản lưu ở hai tài liệu cần hai lệnh. Ở đây một tiến trình chuyển 1.000 đ qua lại 3.000 lần, trong khi một tiến trình khác đọc số dư hai tài khoản 3.000 lần và kiểm tổng có còn 2.000.000 đ không:</p>
${lenh(K, 6)}
<p>Số dư cuối cùng đúng — mọi lần chuyển đều xong. Nhưng khoảng một nửa số lần đọc thấy tổng chỉ còn 1.999.000 đ: khoảnh khắc sau khi tiền rời một tài khoản và trước khi tới tài khoản kia. Trong một báo cáo, một tác vụ đối soát hay một trang quản trị, đó là "tiền bốc hơi". Và nếu ứng dụng sập giữa hai lệnh, tiền bốc hơi luôn. Có hai lối ra: thiết kế để thay đổi chỉ chạm một tài liệu (ví dụ mỗi lần chuyển là một tài liệu sổ cái chứa cả hai vế, số dư tính bằng aggregation), hoặc bọc hai lệnh trong transaction — bài sau, nơi đúng người đọc này sẽ thấy tổng sai <strong>không</strong> lần nào.</p>

<h3>💼 Đi làm: "giỏ hàng mất món khi tôi dùng hai tab"</h3>
<p>Một ticket kinh điển ở dự án outsourcing: khách thêm một món trên điện thoại, một món trên laptop, và một món biến mất. Bạn mở mã và thấy <code>const cart = await Cart.findById(id); cart.items.push(item); await cart.save();</code> — đọc, sửa, ghi cả tài liệu, không kiểm phiên bản. Cách sửa trong pull request: hoặc một lệnh nguyên tử (<code>$push</code> món, tính lại tổng ngay trong cùng lệnh bằng update pipeline, Bài 2.4), hoặc khoá lạc quan với phiên bản và 409 cho client. Trong mô tả PR, kèm một bản tái hiện: một script bắn hai request đồng thời, cho thấy mất món trước khi sửa và không mất sau khi sửa. Người review tin bản tái hiện hơn nhiều so với câu "chắc là hết lỗi".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Không có transaction thì cái gì là nguyên tử trong MongoDB?"</strong> — Một thao tác ghi trên một tài liệu, kể cả mọi tài liệu nhúng và mảng mà nó sửa. Không phải lệnh nhiều tài liệu, không phải nhiều lệnh.</li>
<li><strong>"Chống bán quá số tồn thế nào?"</strong> — Đặt phần kiểm vào bộ lọc của chính lệnh cập nhật: <code>{ _id, stock: { $gte: qty } }</code> với <code>$inc: { stock: -qty }</code>, rồi đọc <code>modifiedCount</code>.</li>
<li><strong>"Khoá lạc quan là gì, dùng khi nào?"</strong> — Một trường phiên bản được kiểm trong bộ lọc và tăng trong lệnh; lệch thì đọc lại và thử lại hoặc trả 409. Dùng cho logic đọc–tính–ghi mà xung đột hiếm.</li>
<li><strong>"updateMany hỏng giữa chừng. Dữ liệu đang ở trạng thái nào?"</strong> — Đã sửa một phần. Làm tác vụ idempotent (trường đánh dấu + lọc) rồi chạy lại tới khi không còn gì để sửa; hoặc dùng transaction nếu cần được-hết-hoặc-không và kích thước cho phép.</li>
<li><strong>"MongoDB có khoá dòng kiểu SELECT FOR UPDATE không?"</strong> — Ngoài transaction không có khoá nào để bạn giữ qua nhiều lệnh; các lệnh ghi đồng thời vào một tài liệu được engine xếp hàng và chạy lại. Trong transaction, người ghi trước thắng, người sau nhận WriteConflict.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một lệnh giữ 1 áo size L <em>và</em> 1 áo size XL của <code>SP017</code>, chỉ khi <em>cả hai</em> size còn hàng. (Gợi ý: hai điều kiện <code>$elemMatch</code> trong <code>$and</code>, và <code>arrayFilters</code>.) Chuyện gì xảy ra nếu L còn mà XL hết?</li>
<li>Sửa <code>_demo/gio-ver.js</code> để mỗi tiến trình bỏ cuộc sau 3 lần thất bại và đếm số món không thêm được. Chạy lại 4 tiến trình. Giỏ có phiên bản còn đúng không (số món = 200 − số bỏ cuộc)?</li>
<li>Một tác vụ đêm cộng lãi tháng (<code>$mul: { du: 1.004 }</code>) cho 100.000 tài khoản và có thể sập giữa chừng. Làm nó chạy lại an toàn.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>db.sp.updateOne({ _id: 'SP017', $and: [{ variants: { $elemMatch: { size: 'L', stock: { $gte: 1 } } } }, { variants: { $elemMatch: { size: 'XL', stock: { $gte: 1 } } } }] }, { $inc: { 'variants.$[l].stock': -1, 'variants.$[xl].stock': -1 } }, { arrayFilters: [{ 'l.size': 'L' }, { 'xl.size': 'XL' }] })</code>. Nếu XL hết hàng, bộ lọc không khớp, <code>matchedCount</code> bằng 0 và <strong>không size nào</strong> đổi — cả bước kiểm-và-ghi là một bước nguyên tử trên một tài liệu.</p>
<p>2. Bọc vòng trong bằng <code>for (let lan = 0; lan &lt; 3; lan++)</code> và đếm lần trượt. Giỏ vẫn đúng: số món = 200 − số trượt, <code>v</code> = số món, tổng khớp với món. Bỏ cuộc thì an toàn; ghi giá trị cũ mới không an toàn.</p>
<p>3. Lọc theo dấu và đặt dấu trong cùng lệnh: <code>updateMany({ laiThang: { $ne: '2026-11' } }, [{ $set: { du: { $multiply: ['$du', 1.004] }, laiThang: '2026-11' } }])</code> — chạy lại tới khi <code>modifiedCount</code> bằng 0. (Tiền thật thì dùng Decimal128, Bài 1.2.)</p>
</details>
<p><strong>Xong khi:</strong> với mỗi lệnh ghi trong mã của bạn, bạn nói được nó chạm một hay nhiều tài liệu, và một người đọc hoặc một sự cố ở giữa sẽ thấy gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Nguyên tử mức tài liệu', 'Một lần ghi trên một tài liệu là được-hết-hoặc-không và cô lập: người đọc thấy tài liệu trước hoặc sau.'],
  ['Cập nhật có điều kiện', 'Lệnh cập nhật có phần kiểm nghiệp vụ trong bộ lọc (tồn ≥ số lượng, v = 7); matchedCount 0 nghĩa là kiểm không qua.'],
  ['Xung đột ghi (write conflict)', 'Hai lệnh ghi đồng thời vào cùng tài liệu; ngoài transaction engine tự chạy lại (metrics.operation.writeConflicts).'],
  ['Mất cập nhật (lost update)', 'Đọc–sửa–ghi đè mất thay đổi của người khác xảy ra giữa lúc đọc và lúc ghi.'],
  ['Khoá lạc quan', 'Trường phiên bản kiểm trong bộ lọc, tăng trong lệnh; lệch ⇒ thử lại hoặc HTTP 409.'],
  ['Idempotent', 'Chạy hai lần có tác dụng như chạy một lần — bắt buộc với mọi thứ có thể bị chạy lại.'],
  ['Tài liệu nóng', 'Một tài liệu nhận nhiều lệnh ghi đồng thời; các lệnh bị xếp hàng và thành nút thắt.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Nguyên tử = một lệnh ghi, một tài liệu (mọi trường và mảng của nó). Không có gì lớn hơn nếu không có transaction.</li>
<li>Đặt phần kiểm vào bộ lọc của chính lệnh cập nhật và đọc <code>matchedCount</code>/<code>modifiedCount</code>.</li>
<li>Ngoài transaction, engine tự chạy lại xung đột ghi — đúng, nhưng tài liệu nóng là một hàng đợi.</li>
<li>Đọc–tính–ghi cần khoá lạc quan: phiên bản trong bộ lọc, tăng trong lệnh, số lần thử có giới hạn.</li>
<li><code>updateMany</code> có thể dừng giữa chừng; làm tác vụ lô idempotent bằng trường đánh dấu trước khi chạy lại.</li>
<li>Hai tài liệu đổi bằng hai lệnh thì người đọc thấy được trạng thái làm dở, và sự cố có thể để lại trạng thái làm dở.</li>
</ul>
</div>
`,
};
