/**
 * 6.2 — Transaction nhiều tài liệu: session, thử lại và giới hạn (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s06-2-tx'] + OUT['s06-2b-standalone'] (MongoDB 8.0.38, mgo-lab replica set 1 thành viên; Node 22 + driver mongodb 7.9.1;
 * container phụ mgo-sa standalone, xoá ngay). Số tất định: A 700.000 / B 1.300.000 sau chuyển 300.000, chuyển 900.000 bị huỷ, nhật ký 1 dòng;
 * trong/ngoài transaction 699.999/700.000; transaction thứ hai WriteConflict + TransientTransactionError; lệnh thường chờ tới hết maxTimeMS 1500;
 * commit sau 8 s với transactionLifetimeLimitSeconds 3 ⇒ NoSuchTransaction; đọc tổng 3000 lần 0 lần lệch; 40 đơn ⇒ 30 ok / 10 hết hàng, kho 0/0,
 * callback chạy hàng trăm lần (số đổi); quên session ⇒ ví 100.000 nhưng nhật ký −50.000 còn lại, lệnh quên session MaxTimeMSExpired;
 * 1.000.000 tài liệu một transaction chạy được (~10 s); standalone ⇒ mongosh báo "does not support retryable writes", lệnh thô ⇒ IllegalOperation 20. Thời gian (ms) đổi theo lần chạy ⇒ lời chỉ nêu tỉ lệ (w:1: transaction ~1,5–2× chậm hơn; w:majority: ngang nhau, lần chạy đầu 4660 vs 3163 ms transaction nhanh hơn).
 * Kiểm trùng: giao dịch/MVCC phía PostgreSQL ở postgresql 11.1/11.2, @Transactional ở spring-boot 6.5, outbox ở spring-boot 14.4 ⇒ liên kết chéo.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's06-2-tx';

const DAT = `// Trích _demo/node/tx-dat-hang.mjs — một đơn = trừ 2 mã hàng + chèn đơn, trong MỘT transaction
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    lanChay++;                                            // đếm số lần callback chạy
    for (const sp of ['K1', 'K2']) {
      const r = await db.collection('kho').updateOne(
        { _id: sp, ton: { $gte: 1 } }, { $inc: { ton: -1 } }, { session });   // ← { session } ở MỌI lệnh
      if (r.modifiedCount !== 1) throw new Error('HET_HANG ' + sp);         // ném ⇒ abort, không thử lại
    }
    await db.collection('donTx').insertOne({ khach, sp: ['K1', 'K2'] }, { session });
  });
} finally {
  await session.endSession();
}`;

const QUEN = `// Trích _demo/node/tx-quen-session.mjs
await session.withTransaction(async () => {
  await db.collection('vi').updateOne({ _id: 'AN' }, { $inc: { du: -50000 } }, { session });
  await db.collection('nhatKy').insertOne({ vi: 'AN', tien: -50000, ghiChu: 'trừ tiền đơn D1' }); // ← quên { session }
  throw new Error('cổng thanh toán từ chối');             // lỗi nghiệp vụ ⇒ transaction bị huỷ
});`;

export default {
  title: '6.2 — Multi-document transactions: sessions, retries and limits|||6.2 — Transaction nhiều tài liệu: session, thử lại và giới hạn',
  slug: 'mgo-6-2-transaction',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Transaction trong MongoDB chạy thật trên replica set: session, withTransaction, huỷ khi lỗi nghiệp vụ, cô lập (bên ngoài chỉ thấy sau commit), người ghi trước thắng — người sau nhận WriteConflict có nhãn TransientTransactionError, lệnh thường thì bị chặn chờ; giới hạn 60 giây; đo chi phí so với hai lệnh rời; 40 đơn đồng thời qua driver Node: 30 thành công, 10 hết hàng, callback chạy lại hàng trăm lần (bẫy hiệu ứng phụ); bẫy quên truyền session; lỗi standalone; Jepsen 2020; khi nào KHÔNG cần transaction.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Multi-document transactions: sessions, retries and limits</h2>
<p class="lead">Lesson 6.1 ended with money "disappearing" between two updates. Since version 4.0 (replica sets, 2018) and 4.2 (sharded clusters), MongoDB can make several operations on several documents and collections behave as one: all committed together, or none. This lesson runs transactions for real — the happy path, the failures you will meet (conflicts, time limits, retries, a forgotten <code>session</code>), what they cost — and ends with the question that matters most: when you should <em>not</em> use one.</p>

<h3>An everyday picture: buying a flat at the notary office</h3>
<p>Buying a flat in Vietnam means a stack of papers — the contract, the payment receipt, the transfer of the land-use certificate. You sign them one by one at the notary's desk, but nothing is valid until the notary stamps the file at the end. If one paper is missing, the whole file is cancelled; the seller never ends up with the money but without the flat. And while you sit there signing, anyone checking the register still sees the old owner. That is a transaction: many writes, invisible from outside until <em>commit</em> (the stamp); <em>abort</em> throws the whole file away.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">startSession</span><span class="lz-t">a session ties operations together</span><span class="lz-d">transactions need a replica set or sharded cluster — the lab is replica set rs0 for this reason (Lesson 0.2)</span></div>
  <div class="lz-step"><span class="lz-k">startTransaction</span><span class="lz-t">reads see one snapshot; writes stay private</span><span class="lz-d">every operation must carry the session — or it runs outside</span></div>
  <div class="lz-step"><span class="lz-k">commitTransaction</span><span class="lz-t">all writes become visible at once</span><span class="lz-d">waits for the write concern (w: "majority" by default) — Lesson 6.3</span></div>
  <div class="lz-step"><span class="lz-k">abortTransaction</span><span class="lz-t">every write is discarded</span><span class="lz-d">explicit, or automatic on error, conflict, or the 60-second limit</span></div>
</div>

<h3>The transfer, done properly</h3>
<p>In mongosh, <code>session.withTransaction(fn)</code> starts a transaction, runs <code>fn</code>, commits, and aborts if <code>fn</code> throws. Every collection used inside must come from <code>session.getDatabase(…)</code>:</p>
${lenh(K, 0)}
<p>The 300,000 đ transfer moved money and wrote one journal line, together. The 900,000 đ transfer failed the balance check; the function threw, and the transaction was aborted — no balance changed and no journal line was written, even though the code never "undid" anything. Notice the check is still a conditional update (<code>du: { $gte: tien }</code>, Lesson 6.1): a transaction makes several writes all-or-nothing, but it does not replace checking.</p>

<h3>Isolation and conflicts: first writer wins</h3>
<p>Now the inside view. One session changes A and does not commit yet; we look from inside, from outside, from a second transaction, and from a plain command:</p>
${lenh(K, 1)}
<p>Four facts in one run:</p>
<ul>
<li><strong>Inside sees its own write</strong> (699,999); <strong>outside sees the last committed value</strong> (700,000). No dirty reads.</li>
<li><strong>A second transaction writing the same document fails immediately</strong> with <code>WriteConflict</code> and the label <code>TransientTransactionError</code>. MongoDB does not queue transactions behind each other like PostgreSQL's row locks do; the first writer wins and the second must start over. The label means "the whole transaction may succeed if you retry it from the beginning".</li>
<li><strong>A plain write outside any transaction waits</strong> for the transaction to finish — here until its 1.5 s time limit expired. A long-running transaction blocks ordinary traffic on the documents it touched.</li>
<li>After commit, outside sees 699,999.</li>
</ul>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-11-2-mvcc', title: 'PostgreSQL 11.2 — MVCC: why readers never block writers', sub: 'The same snapshot idea; compare: PostgreSQL waits on a row lock, MongoDB returns WriteConflict' })}

<h3>Retries: what withTransaction does for you</h3>
<p>Two error labels drive all transaction retry logic: <code>TransientTransactionError</code> (retry the <em>whole</em> transaction: conflicts, a primary that stepped down, a network blip) and <code>UnknownTransactionCommitResult</code> (the commit was sent but the answer was lost — retry <em>only the commit</em>, which is safe). The drivers' <code>withTransaction</code> handles both for up to 120 seconds. Forty customers order at once in Node.js; each order takes one unit of K1 and one of K2 (30 units each) and inserts the order, in one transaction:</p>
${ma('js', DAT)}
${lenh(K, 5)}
<p>Exactly 30 orders succeeded, 10 were refused, stock ended at 0 and 0, 30 orders in the database — correct under heavy contention. But look at the counter: the callback ran <strong>hundreds of times</strong> for 30 commits. Every time two orders collided on K1, the loser was aborted and <code>withTransaction</code> ran its callback again from the start.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — side effects inside the callback.</strong> Whatever you put in the callback runs as many times as the driver retries. Send an email, call the payment gateway, publish to a queue, increment an in-memory counter there — and the customer gets nine emails for one order, or is charged twice. Keep the callback to database operations only. Do side effects <em>after</em> the commit, or write an "outbox" document inside the transaction and let a separate worker send it.</p>
</div>
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-14-4-outbox', title: 'Spring Boot 14.4 — The transactional outbox', sub: 'Write the event in the same transaction, publish it after commit' })}

<h3>The most common bug: forgetting the session</h3>
<p>In the Node.js driver, an operation is part of a transaction only if you pass <code>{ session }</code>. Forget it on one line and that line runs outside — immediately committed, never rolled back:</p>
${ma('js', QUEN)}
${lenh(K, 6)}
<p>The transaction was aborted, so the wallet still has 100,000 đ — but the journal says 50,000 đ were taken. The books no longer match, and no error was raised. The second half of the run is nastier: an operation without the session touching a document the transaction has already written is an <em>outsider</em>, so it waits for the transaction… which is waiting for it. It hung until its own time limit. Without <code>maxTimeMS</code> it would have hung until the transaction's 60-second limit killed the transaction.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>{ session }</code> on every line, every time.</strong> Code review rule: inside a transaction callback, every database call has <code>{ session }</code>. Helper functions called from the callback must take the session as a parameter. Mongoose and Spring hide this in different ways (Chapter 8) — and both have their own versions of this bug.</p>
</div>

<h3>Limits: 60 seconds, and what "large" costs</h3>
<p>A transaction holds an old snapshot and its uncommitted writes in the WiredTiger cache. To protect the server, a transaction older than <code>transactionLifetimeLimitSeconds</code> (default 60) is aborted by a background task. The lab shortens it to 3 seconds and "forgets" to commit for 8:</p>
${lenh(K, 2)}
<p>The commit fails with <code>NoSuchTransaction</code> — the transaction no longer exists — and B is unchanged. This is what happens to code that opens a transaction, then calls an external API, waits for a user to confirm, or loops over a slow file. Rule: open the transaction late, do only database work inside, commit quickly.</p>
${nguon('📘', 'Production Considerations (transactions) — MongoDB Docs', 'Runtime limit 60 s (transactionLifetimeLimitSeconds), many oplog entries instead of one 16 MB entry, cache pressure, locks', 'https://www.mongodb.com/docs/manual/core/transactions-production-consideration/')}
<p>Size is not a hard limit since 4.2: one transaction can write a lot.</p>
${lenh(K, 7)}
<p>A million documents (about 230 MB) committed in one transaction in about 10 seconds. It works — and it is a bad idea in production: for those seconds the cache holds all of it, the oplog gets a burst, secondaries lag, and any conflict means redoing everything. Large batch jobs should use the idempotent marker pattern from Lesson 6.1, in chunks.</p>

<h3>What a transaction costs</h3>
<p>The same 1,000 transfers, four ways — two separate updates or one transaction, with the default write concern <code>w: "majority"</code> and with <code>w: 1</code>:</p>
${lenh(K, 4)}
<p>Read the numbers in pairs. With <code>w: 1</code> the transaction is clearly slower than two separate updates: sessions, snapshots and commit bookkeeping are real work. With the default <code>w: "majority"</code> the gap disappears: the transaction costs about the same as the two separate updates — and on a quiet machine it can even be faster (one earlier run of this lab: 4.7 s separate vs 3.2 s transaction). The reason: each separate update waits for its own durable acknowledgement, while the transaction waits <strong>once</strong>, at commit, and that wait dominates. The lesson is not "transactions are fast"; it is that most of the cost of a write is waiting for durability (Lesson 6.3), and a transaction groups the waiting.</p>
<p>And correctness — the reader from Lesson 6.1 against transactional transfers:</p>
${lenh(K, 3)}
<p>Zero wrong totals out of 3,000 reads: commit makes both legs visible at the same instant.</p>

<h3>Where transactions do not work: a standalone server</h3>
<p>Many developers run MongoDB locally as a single <code>mongod</code> without <code>--replSet</code>. Transactions fail there:</p>
${lenh('s06-2b-standalone', 0)}
<p>The message talks about "retryable writes", which is confusing: the driver rewrites the server's answer. Send the raw command a driver sends when it opens a transaction, and you see what the server really said:</p>
${lenh('s06-2b-standalone', 1)}
<p>Code 20, "Transaction numbers are only allowed on a replica set member or mongos" — one of the most searched MongoDB errors; you will meet both wordings. The fix is a one-member replica set — exactly the lab's <code>compose.yaml</code>. Test environments (Testcontainers, CI) must also be replica sets, or transaction code is never really tested.</p>

<h3>🔎 A real report: Jepsen and MongoDB 4.2.6 (2020)</h3>
<p>In May 2020 Jepsen (Kyle Kingsbury) tested transactions in MongoDB 4.2.6 and found that "even at the strongest levels of read and write concern, it failed to preserve snapshot isolation", observing read skew, cyclic information flow and duplicate writes. Weak defaults meant transactions "could lose writes and allow dirty reads", and the <code>snapshot</code> read concern did not guarantee a snapshot unless paired with write concern <code>majority</code>. MongoDB identified a bug in the transaction retry mechanism; a fix was scheduled for 4.2.8. Two lessons outlive the bug. First: databases have bugs, and independent testing finds them — read release notes, stay on a supported version. Second: do not rely on defaults for transactions that matter; state <code>readConcern: { level: 'snapshot' }</code> and <code>writeConcern: { w: 'majority' }</code> explicitly (the lab solution in Lesson 6.5 does).</p>
${nguon('🔬', 'Jepsen: MongoDB 4.2.6 (2020)', 'Read skew, cyclic information flow, duplicate writes; weak defaults; snapshot needs write concern majority', 'https://jepsen.io/analyses/mongodb-4.2.6')}

<h3>When NOT to use a transaction</h3>
<p>The MongoDB manual says it plainly: transactions "should not be a replacement for effective schema design". Before writing <code>withTransaction</code>, ask:</p>
<ul>
<li><strong>Can the data that changes together live in one document?</strong> An order with its items, a shirt with its variants and reservations — one atomic update, no transaction (Lesson 6.1, Chapter 3).</li>
<li><strong>Is it a counter or a stock level?</strong> A conditional <code>$inc</code> is enough.</li>
<li><strong>Is it a batch job?</strong> Idempotent chunks with a marker field survive crashes better than one giant transaction.</li>
<li><strong>Does nearly every feature need multi-document transactions across many collections?</strong> Your data is relational. That is a strong sign PostgreSQL is the better primary database (Lesson 0.1).</li>
</ul>
<p>Good uses: money moving between two accounts, an order that must reserve several separate inventory documents and insert the order, a status change plus an audit/outbox record that must never disagree.</p>
${nguon('📘', 'Transactions — MongoDB Docs', 'Sessions, callback API vs core API, error labels, "not a replacement for effective schema design"', 'https://www.mongodb.com/docs/manual/core/transactions/')}

<h3>💼 At work: "Transaction numbers are only allowed…" on the first day</h3>
<p>On a Spring Boot or NestJS project, the first transaction you add works on the shared dev server and fails on your laptop with error code 20 — your local MongoDB is standalone. Fix your <code>docker-compose</code> (one-member replica set, Lesson 0.2) instead of commenting out <code>@Transactional</code>. In Spring Data MongoDB, <code>@Transactional</code> does nothing until a <code>MongoTransactionManager</code> bean exists — another silent failure (Lesson 8.4). And in code review, look for the three bugs of this lesson: a missing <code>session</code>, side effects inside the callback, and slow work (HTTP calls, file reads) inside the transaction.</p>
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-6-5-transaction', title: 'Spring Boot 6.5 — Transactions with @Transactional', sub: 'The Spring side of transactions (shown with JPA/PostgreSQL)' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-11-1-giao-dich', title: 'PostgreSQL 11.1 — Transactions: all of it, or none of it', sub: 'ACID from the SQL side — compare what MongoDB gives by default' })}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Does MongoDB support ACID transactions?"</strong> — Yes, multi-document since 4.0 (replica sets) and 4.2 (sharded). Single-document operations were always atomic. They need a replica set and a session.</li>
<li><strong>"What happens when two transactions write the same document?"</strong> — The second gets WriteConflict with TransientTransactionError immediately; it must retry the whole transaction. Non-transactional writes wait.</li>
<li><strong>"TransientTransactionError vs UnknownTransactionCommitResult?"</strong> — Retry the whole transaction vs retry only the commit. withTransaction handles both.</li>
<li><strong>"Why must the callback be free of side effects?"</strong> — It can run many times; the run counted hundreds of executions for 30 commits.</li>
<li><strong>"When would you avoid a transaction?"</strong> — When the schema can keep the changing data in one document, for counters, for big batch jobs, and when you notice the model is really relational.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>node node/tx-dat-hang.mjs</code> three times and write down the callback count. Then change it to 400 customers and 300 units. Does the ratio of runs to commits go up or down? Why?</li>
<li>In <code>tx-dat-hang.mjs</code>, move <code>lanChay++</code> to <em>after</em> <code>withTransaction</code> returns. What does the counter mean now? Which of the two places is right for "send confirmation email"?</li>
<li>Rewrite the transfer in mongosh with the <em>core</em> API (<code>startTransaction</code> / <code>commitTransaction</code> / <code>abortTransaction</code>) and your own retry loop on <code>TransientTransactionError</code>, at most 5 attempts.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. The count changes from run to run (timing). With 10× more customers on the same two documents, more transactions overlap, so the ratio of runs to commits goes <em>up</em>: two hot documents are a queue (Lesson 6.1). Spreading stock over several documents, or reserving in one atomic update when stock lives in one document, reduces conflicts.</p>
<p>2. After <code>withTransaction</code> returns without throwing, the counter counts commits — exactly 30. That is the place for the email (or better, an outbox record written inside the transaction and sent by a worker).</p>
<p>3. <code>for (let lan = 1; lan &lt;= 5; lan++) { s.startTransaction({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } }); try { …updates with T… ; s.commitTransaction(); break; } catch (e) { try { s.abortTransaction() } catch {} if (!(e.errorLabels || []).includes('TransientTransactionError') || lan === 5) throw e; } }</code>. A complete version also retries <code>commitTransaction</code> alone on <code>UnknownTransactionCommitResult</code> — which is why <code>withTransaction</code> exists.</p>
</details>
<p><strong>Done when:</strong> you can explain the four lines of the isolation demo, and you can spot a missing <code>session</code> in someone else's code.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Session', 'A client-side context that ties operations together; required for transactions and causal consistency.'],
  ['Transaction', 'Several operations on several documents that commit together or not at all; writes invisible outside until commit.'],
  ['withTransaction', 'Driver helper: start, run callback, commit; retries on TransientTransactionError / UnknownTransactionCommitResult up to 120 s.'],
  ['WriteConflict', 'Two transactions wrote the same document; the later one must restart.'],
  ['TransientTransactionError', 'Error label: retrying the whole transaction may succeed.'],
  ['UnknownTransactionCommitResult', 'Error label: commit outcome unknown; retry only the commit.'],
  ['transactionLifetimeLimitSeconds', 'Server parameter (default 60): older transactions are aborted.'],
  ['Outbox', 'A document written in the transaction describing a side effect, performed by a worker after commit.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Transactions need a replica set and a session; every operation inside must carry the session.</li>
<li>Outside sees nothing until commit; abort discards everything — including after a thrown business error.</li>
<li>First writer wins: a second transaction gets WriteConflict at once; plain writes wait.</li>
<li>withTransaction retries the callback — keep side effects out of it, do them after commit or via an outbox.</li>
<li>60-second limit: no external calls or user waits inside a transaction; huge transactions work but hurt.</li>
<li>Most write cost is waiting for durability; a transaction waits once. It still never replaces good schema design.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Transaction nhiều tài liệu: session, thử lại và giới hạn</h2>
<p class="lead">Bài 6.1 kết thúc với tiền "bốc hơi" giữa hai lệnh cập nhật. Từ bản 4.0 (replica set, 2018) và 4.2 (cụm sharding), MongoDB có thể làm cho nhiều thao tác trên nhiều tài liệu và collection hành xử như một: commit cùng nhau, hoặc không gì cả. Bài này chạy transaction thật — đường suôn sẻ, các lỗi bạn sẽ gặp (xung đột, giới hạn thời gian, thử lại, quên <code>session</code>), cái giá phải trả — và kết thúc bằng câu hỏi quan trọng nhất: khi nào <em>không</em> nên dùng.</p>

<h3>Hình ảnh đời thường: mua căn hộ ở phòng công chứng</h3>
<p>Mua một căn hộ ở Việt Nam là cả một xấp giấy — hợp đồng, biên nhận tiền, hồ sơ sang tên sổ hồng. Bạn ký từng tờ ở bàn công chứng viên, nhưng chưa tờ nào có hiệu lực cho tới khi công chứng viên đóng dấu cả bộ ở cuối. Thiếu một tờ thì cả bộ bị huỷ; người bán không bao giờ rơi vào cảnh đã nhận tiền mà chưa giao nhà, hay ngược lại. Và trong lúc bạn ngồi ký, ai tra sổ vẫn thấy chủ cũ. Đó là transaction: nhiều lần ghi, bên ngoài không thấy cho tới khi <em>commit</em> (đóng dấu); <em>abort</em> thì vứt cả bộ hồ sơ.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">startSession</span><span class="lz-t">session buộc các thao tác lại với nhau</span><span class="lz-d">transaction cần replica set hoặc cụm sharding — lab là replica set rs0 chính vì lý do này (Bài 0.2)</span></div>
  <div class="lz-step"><span class="lz-k">startTransaction</span><span class="lz-t">lệnh đọc thấy một ảnh chụp; lệnh ghi giữ riêng</span><span class="lz-d">mọi thao tác phải mang theo session — không thì nó chạy bên ngoài</span></div>
  <div class="lz-step"><span class="lz-k">commitTransaction</span><span class="lz-t">mọi lần ghi hiện ra cùng một lúc</span><span class="lz-d">chờ write concern (mặc định w: "majority") — Bài 6.3</span></div>
  <div class="lz-step"><span class="lz-k">abortTransaction</span><span class="lz-t">mọi lần ghi bị bỏ</span><span class="lz-d">gọi tay, hoặc tự động khi lỗi, xung đột, hay quá giới hạn 60 giây</span></div>
</div>

<h3>Chuyển tiền, làm cho đúng</h3>
<p>Trong mongosh, <code>session.withTransaction(fn)</code> mở transaction, chạy <code>fn</code>, commit, và huỷ nếu <code>fn</code> ném lỗi. Mọi collection dùng bên trong phải lấy từ <code>session.getDatabase(…)</code>:</p>
${lenh(K, 0)}
<p>Lần chuyển 300.000 đ đã chuyển tiền và ghi một dòng nhật ký, cùng nhau. Lần chuyển 900.000 đ không qua phần kiểm số dư; hàm ném lỗi, transaction bị huỷ — không số dư nào đổi, không dòng nhật ký nào được ghi, dù mã chẳng hề "hoàn tác" gì. Để ý phần kiểm vẫn là một lệnh cập nhật có điều kiện (<code>du: { $gte: tien }</code>, Bài 6.1): transaction làm nhiều lần ghi thành được-hết-hoặc-không, nhưng nó không thay cho việc kiểm.</p>

<h3>Cô lập và xung đột: người ghi trước thắng</h3>
<p>Giờ nhìn từ bên trong. Một session sửa A và chưa commit; ta nhìn từ bên trong, từ bên ngoài, từ một transaction thứ hai, và từ một lệnh thường:</p>
${lenh(K, 1)}
<p>Bốn sự thật trong một lần chạy:</p>
<ul>
<li><strong>Bên trong thấy lần ghi của chính nó</strong> (699.999); <strong>bên ngoài thấy giá trị đã commit gần nhất</strong> (700.000). Không có đọc bẩn.</li>
<li><strong>Transaction thứ hai ghi cùng tài liệu thất bại ngay lập tức</strong> với <code>WriteConflict</code> và nhãn <code>TransientTransactionError</code>. MongoDB không xếp các transaction chờ nhau như khoá dòng của PostgreSQL; người ghi trước thắng, người sau phải làm lại từ đầu. Nhãn này nghĩa là "cả transaction có thể thành công nếu bạn chạy lại từ đầu".</li>
<li><strong>Một lệnh ghi thường ngoài transaction thì chờ</strong> transaction kết thúc — ở đây chờ tới khi hết giới hạn 1,5 giây của chính nó. Một transaction chạy lâu sẽ chặn lưu lượng bình thường trên các tài liệu nó đã chạm.</li>
<li>Sau commit, bên ngoài thấy 699.999.</li>
</ul>
${lienKet({ cta: 'Mở bài', khoa: 'postgresql', bai: 'postgresql-11-2-mvcc', title: 'PostgreSQL 11.2 — MVCC: vì sao người đọc không chặn người ghi', sub: 'Cùng ý tưởng ảnh chụp; so sánh: PostgreSQL chờ khoá dòng, MongoDB trả WriteConflict' })}

<h3>Thử lại: withTransaction làm gì giúp bạn</h3>
<p>Hai nhãn lỗi điều khiển mọi logic thử lại của transaction: <code>TransientTransactionError</code> (chạy lại <em>cả</em> transaction: xung đột, primary vừa step down, mạng chập chờn) và <code>UnknownTransactionCommitResult</code> (lệnh commit đã gửi nhưng mất câu trả lời — chỉ thử lại <em>riêng lệnh commit</em>, việc này an toàn). Hàm <code>withTransaction</code> của driver lo cả hai trong tối đa 120 giây. Bốn mươi khách cùng đặt hàng bằng Node.js; mỗi đơn lấy một K1 và một K2 (mỗi mã 30 cái) rồi chèn đơn, trong một transaction:</p>
${ma('js', DAT)}
${lenh(K, 5)}
<p>Đúng 30 đơn thành công, 10 đơn bị từ chối, kho về 0 và 0, 30 đơn trong database — đúng dù tranh chấp nặng. Nhưng nhìn bộ đếm: callback đã chạy <strong>hàng trăm lần</strong> cho 30 lần commit. Mỗi lần hai đơn va nhau ở K1, đơn thua bị huỷ và <code>withTransaction</code> chạy lại callback từ đầu.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — hiệu ứng phụ bên trong callback.</strong> Thứ gì bạn đặt trong callback sẽ chạy bằng số lần driver thử lại. Gửi email, gọi cổng thanh toán, đẩy vào hàng đợi, tăng một bộ đếm trong bộ nhớ ở đó — và khách nhận chín email cho một đơn, hoặc bị trừ tiền hai lần. Chỉ để thao tác database trong callback. Làm hiệu ứng phụ <em>sau</em> commit, hoặc ghi một tài liệu "outbox" ngay trong transaction rồi để một worker riêng gửi đi.</p>
</div>
${lienKet({ cta: 'Mở bài', khoa: 'spring-boot', bai: 'sb-14-4-outbox', title: 'Spring Boot 14.4 — Mẫu transactional outbox', sub: 'Ghi sự kiện trong cùng transaction, phát đi sau commit' })}

<h3>Lỗi hay gặp nhất: quên session</h3>
<p>Trong driver Node.js, một thao tác chỉ thuộc transaction nếu bạn truyền <code>{ session }</code>. Quên ở một dòng là dòng đó chạy bên ngoài — commit ngay, không bao giờ bị huỷ:</p>
${ma('js', QUEN)}
${lenh(K, 6)}
<p>Transaction bị huỷ nên ví vẫn còn 100.000 đ — nhưng nhật ký ghi đã trừ 50.000 đ. Sổ sách không còn khớp, và không có lỗi nào được báo. Nửa sau lần chạy còn khó chịu hơn: một thao tác không có session chạm vào tài liệu mà transaction đã ghi là <em>người ngoài</em>, nên nó chờ transaction… trong khi transaction lại đang chờ nó. Nó treo tới hết giới hạn thời gian của chính nó. Không có <code>maxTimeMS</code> thì nó treo tới khi giới hạn 60 giây giết transaction.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>{ session }</code> ở mọi dòng, mọi lúc.</strong> Luật review mã: trong callback của transaction, mọi lời gọi database đều có <code>{ session }</code>. Hàm phụ được gọi từ callback phải nhận session làm tham số. Mongoose và Spring giấu chuyện này theo những cách khác nhau (Chương 8) — và cả hai đều có phiên bản riêng của lỗi này.</p>
</div>

<h3>Giới hạn: 60 giây, và "lớn" tốn gì</h3>
<p>Một transaction giữ một ảnh chụp cũ và các lần ghi chưa commit trong cache WiredTiger. Để bảo vệ máy chủ, transaction sống lâu hơn <code>transactionLifetimeLimitSeconds</code> (mặc định 60) bị một tác vụ nền huỷ. Lab rút xuống 3 giây và "quên" commit trong 8 giây:</p>
${lenh(K, 2)}
<p>Lệnh commit thất bại với <code>NoSuchTransaction</code> — transaction không còn tồn tại — và B không đổi. Đây là điều xảy ra với mã mở transaction rồi gọi một API bên ngoài, chờ người dùng xác nhận, hay lặp qua một tệp chậm. Luật: mở transaction muộn, bên trong chỉ làm việc với database, commit nhanh.</p>
${nguon('📘', 'Production Considerations (transactions) — MongoDB Docs', 'Giới hạn chạy 60 s (transactionLifetimeLimitSeconds), nhiều mục oplog thay vì một mục 16 MB, áp lực cache, khoá', 'https://www.mongodb.com/docs/manual/core/transactions-production-consideration/')}
<p>Kích thước không còn là giới hạn cứng từ bản 4.2: một transaction ghi được rất nhiều.</p>
${lenh(K, 7)}
<p>Một triệu tài liệu (khoảng 230 MB) commit trong một transaction mất chừng 10 giây. Chạy được — và là ý tồi khi chạy thật: trong mấy giây đó cache giữ toàn bộ, oplog nhận một đợt dồn, các secondary bị trễ, và chỉ một xung đột là phải làm lại tất cả. Tác vụ lô lớn nên dùng mẫu trường đánh dấu idempotent ở Bài 6.1, theo từng phần.</p>

<h3>Transaction tốn bao nhiêu</h3>
<p>Cùng 1.000 lần chuyển, bốn cách — hai lệnh rời hoặc một transaction, với write concern mặc định <code>w: "majority"</code> và với <code>w: 1</code>:</p>
${lenh(K, 4)}
<p>Đọc số theo từng cặp. Với <code>w: 1</code>, transaction chậm hơn rõ so với hai lệnh rời: session, ảnh chụp và sổ sách của commit là việc thật. Với <code>w: "majority"</code> mặc định thì khoảng chênh biến mất: transaction tốn ngang hai lệnh rời — và trên máy rảnh còn có thể nhanh hơn (một lần chạy trước của chính lab này: 4,7 giây lệnh rời so với 3,2 giây transaction). Lý do: mỗi lệnh rời chờ xác nhận bền vững của riêng nó, còn transaction chỉ chờ <strong>một lần</strong>, lúc commit, và phần chờ đó chiếm phần lớn thời gian. Bài học không phải "transaction nhanh"; mà là phần lớn chi phí của một lần ghi là chờ cho bền (Bài 6.3), và transaction gom các lần chờ lại.</p>
<p>Còn tính đúng — người đọc của Bài 6.1 đối đầu với các lần chuyển có transaction:</p>
${lenh(K, 3)}
<p>Không lần nào trong 3.000 lần đọc thấy tổng sai: commit làm cả hai vế hiện ra cùng một khoảnh khắc.</p>

<h3>Nơi transaction không chạy: máy chủ standalone</h3>
<p>Nhiều lập trình viên chạy MongoDB ở máy mình bằng một <code>mongod</code> đơn lẻ không có <code>--replSet</code>. Transaction hỏng ở đó:</p>
${lenh('s06-2b-standalone', 0)}
<p>Thông báo nói về "retryable writes", dễ gây rối: driver đã viết lại câu trả lời của máy chủ. Gửi câu lệnh thô mà driver gửi khi mở transaction, bạn sẽ thấy máy chủ thật sự nói gì:</p>
${lenh('s06-2b-standalone', 1)}
<p>Mã 20, "Transaction numbers are only allowed on a replica set member or mongos" — một trong những lỗi MongoDB được tìm nhiều nhất; bạn sẽ gặp cả hai cách diễn đạt. Cách sửa là replica set một thành viên — đúng như <code>compose.yaml</code> của lab. Môi trường thử (Testcontainers, CI) cũng phải là replica set, nếu không mã transaction chưa bao giờ được thử thật.</p>

<h3>🔎 Một báo cáo thật: Jepsen và MongoDB 4.2.6 (2020)</h3>
<p>Tháng 5/2020, Jepsen (Kyle Kingsbury) thử transaction của MongoDB 4.2.6 và kết luận rằng "ngay cả ở mức read concern và write concern mạnh nhất, nó không giữ được snapshot isolation", ghi nhận read skew, dòng thông tin vòng tròn và ghi trùng. Mặc định yếu khiến transaction "có thể mất lần ghi và cho phép đọc bẩn", và read concern <code>snapshot</code> không bảo đảm ảnh chụp trừ khi đi cùng write concern <code>majority</code>. MongoDB tìm ra một lỗi trong cơ chế thử lại transaction; bản vá được lên lịch cho 4.2.8. Hai bài học sống lâu hơn con lỗi. Một: database có lỗi, và kiểm thử độc lập tìm ra chúng — hãy đọc ghi chú phát hành, ở trên phiên bản còn được hỗ trợ. Hai: đừng dựa vào mặc định cho transaction quan trọng; ghi rõ <code>readConcern: { level: 'snapshot' }</code> và <code>writeConcern: { w: 'majority' }</code> (lời giải lab ở Bài 6.5 làm vậy).</p>
${nguon('🔬', 'Jepsen: MongoDB 4.2.6 (2020)', 'Read skew, dòng thông tin vòng tròn, ghi trùng; mặc định yếu; snapshot cần write concern majority', 'https://jepsen.io/analyses/mongodb-4.2.6')}

<h3>Khi nào KHÔNG dùng transaction</h3>
<p>Tài liệu MongoDB nói thẳng: transaction "không nên thay thế cho thiết kế schema hiệu quả". Trước khi viết <code>withTransaction</code>, hãy hỏi:</p>
<ul>
<li><strong>Dữ liệu cùng đổi có nằm trong một tài liệu được không?</strong> Đơn hàng cùng các món, áo cùng các biến thể và phiếu giữ — một lệnh nguyên tử, không cần transaction (Bài 6.1, Chương 3).</li>
<li><strong>Có phải bộ đếm hay mức tồn kho?</strong> Một <code>$inc</code> có điều kiện là đủ.</li>
<li><strong>Có phải tác vụ lô?</strong> Các phần idempotent có trường đánh dấu sống qua sự cố tốt hơn một transaction khổng lồ.</li>
<li><strong>Gần như mọi tính năng đều cần transaction nhiều tài liệu qua nhiều collection?</strong> Dữ liệu của bạn mang tính quan hệ. Đó là dấu hiệu mạnh rằng PostgreSQL hợp làm database chính hơn (Bài 0.1).</li>
</ul>
<p>Chỗ dùng đúng: tiền chuyển giữa hai tài khoản, một đơn phải giữ hàng ở nhiều tài liệu kho riêng rồi chèn đơn, một lần đổi trạng thái cùng bản ghi kiểm toán/outbox không bao giờ được lệch nhau.</p>
${nguon('📘', 'Transactions — MongoDB Docs', 'Session, callback API và core API, nhãn lỗi, "không thay thế thiết kế schema hiệu quả"', 'https://www.mongodb.com/docs/manual/core/transactions/')}

<h3>💼 Đi làm: "Transaction numbers are only allowed…" ngay ngày đầu</h3>
<p>Ở một dự án Spring Boot hay NestJS, transaction đầu tiên bạn thêm chạy được trên máy chủ dev chung nhưng hỏng trên laptop với mã lỗi 20 — MongoDB ở máy bạn là standalone. Sửa <code>docker-compose</code> (replica set một thành viên, Bài 0.2) thay vì comment <code>@Transactional</code> đi. Trong Spring Data MongoDB, <code>@Transactional</code> không làm gì cho tới khi có bean <code>MongoTransactionManager</code> — một lỗi im lặng nữa (Bài 8.4). Và khi review mã, hãy tìm ba lỗi của bài này: thiếu <code>session</code>, hiệu ứng phụ trong callback, và việc chậm (gọi HTTP, đọc tệp) bên trong transaction.</p>
${lienKet({ cta: 'Mở bài', khoa: 'spring-boot', bai: 'sb-6-5-transaction', title: 'Spring Boot 6.5 — Giao dịch với @Transactional', sub: 'Phía Spring của transaction (minh hoạ bằng JPA/PostgreSQL)' })}
${lienKet({ cta: 'Mở bài', khoa: 'postgresql', bai: 'postgresql-11-1-giao-dich', title: 'PostgreSQL 11.1 — Giao dịch: được hết, hoặc không gì cả', sub: 'ACID từ phía SQL — so với những gì MongoDB cho mặc định' })}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"MongoDB có transaction ACID không?"</strong> — Có, nhiều tài liệu từ 4.0 (replica set) và 4.2 (sharding). Thao tác một tài liệu thì luôn nguyên tử. Cần replica set và session.</li>
<li><strong>"Hai transaction cùng ghi một tài liệu thì sao?"</strong> — Cái sau nhận WriteConflict kèm TransientTransactionError ngay lập tức; phải chạy lại cả transaction. Lệnh ghi không thuộc transaction thì chờ.</li>
<li><strong>"TransientTransactionError khác UnknownTransactionCommitResult thế nào?"</strong> — Chạy lại cả transaction, so với chỉ thử lại commit. withTransaction lo cả hai.</li>
<li><strong>"Vì sao callback không được có hiệu ứng phụ?"</strong> — Nó có thể chạy nhiều lần; lần đo đếm được hàng trăm lần chạy cho 30 lần commit.</li>
<li><strong>"Khi nào bạn tránh transaction?"</strong> — Khi schema giữ được dữ liệu đổi cùng nhau trong một tài liệu, với bộ đếm, với tác vụ lô lớn, và khi nhận ra mô hình thực chất là quan hệ.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>node node/tx-dat-hang.mjs</code> ba lần và ghi lại số lần callback chạy. Rồi đổi thành 400 khách và 300 cái mỗi mã. Tỉ lệ số lần chạy trên số commit tăng hay giảm? Vì sao?</li>
<li>Trong <code>tx-dat-hang.mjs</code>, chuyển <code>lanChay++</code> ra <em>sau</em> khi <code>withTransaction</code> trả về. Bộ đếm giờ mang nghĩa gì? Chỗ nào trong hai chỗ là đúng cho việc "gửi email xác nhận"?</li>
<li>Viết lại việc chuyển tiền trong mongosh bằng API <em>lõi</em> (<code>startTransaction</code> / <code>commitTransaction</code> / <code>abortTransaction</code>) với vòng thử lại của riêng bạn khi gặp <code>TransientTransactionError</code>, tối đa 5 lần.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Số lần chạy đổi theo từng lần (phụ thuộc thời điểm). Gấp 10 lần khách trên cùng hai tài liệu thì nhiều transaction chồng nhau hơn, nên tỉ lệ số lần chạy trên số commit <em>tăng</em>: hai tài liệu nóng là một hàng đợi (Bài 6.1). Chia tồn kho ra nhiều tài liệu, hoặc giữ hàng bằng một lệnh nguyên tử khi tồn kho nằm trong một tài liệu, sẽ giảm xung đột.</p>
<p>2. Sau khi <code>withTransaction</code> trả về mà không ném lỗi, bộ đếm đếm số commit — đúng 30. Đó là chỗ để gửi email (hoặc tốt hơn, ghi một bản outbox trong transaction rồi để worker gửi).</p>
<p>3. <code>for (let lan = 1; lan &lt;= 5; lan++) { s.startTransaction({ readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } }); try { …các lệnh với T… ; s.commitTransaction(); break; } catch (e) { try { s.abortTransaction() } catch {} if (!(e.errorLabels || []).includes('TransientTransactionError') || lan === 5) throw e; } }</code>. Bản đầy đủ còn thử lại riêng <code>commitTransaction</code> khi gặp <code>UnknownTransactionCommitResult</code> — chính vì thế mới có <code>withTransaction</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn giải thích được bốn dòng của demo cô lập, và nhận ra được chỗ thiếu <code>session</code> trong mã của người khác.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Session', 'Ngữ cảnh phía client buộc các thao tác lại với nhau; bắt buộc cho transaction và nhất quán nhân quả.'],
  ['Transaction', 'Nhiều thao tác trên nhiều tài liệu commit cùng nhau hoặc không gì cả; bên ngoài không thấy lần ghi cho tới khi commit.'],
  ['withTransaction', 'Hàm tiện ích của driver: mở, chạy callback, commit; thử lại khi gặp TransientTransactionError / UnknownTransactionCommitResult trong tối đa 120 s.'],
  ['WriteConflict', 'Hai transaction ghi cùng một tài liệu; cái sau phải làm lại.'],
  ['TransientTransactionError', 'Nhãn lỗi: chạy lại cả transaction có thể thành công.'],
  ['UnknownTransactionCommitResult', 'Nhãn lỗi: không biết commit ra sao; chỉ thử lại commit.'],
  ['transactionLifetimeLimitSeconds', 'Tham số máy chủ (mặc định 60): transaction lâu hơn bị huỷ.'],
  ['Outbox', 'Tài liệu ghi trong transaction mô tả một hiệu ứng phụ, được worker thực hiện sau commit.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Transaction cần replica set và session; mọi thao tác bên trong phải mang theo session.</li>
<li>Bên ngoài không thấy gì cho tới commit; abort bỏ hết — kể cả sau khi ném một lỗi nghiệp vụ.</li>
<li>Người ghi trước thắng: transaction thứ hai nhận WriteConflict ngay; lệnh ghi thường thì chờ.</li>
<li>withTransaction chạy lại callback — để hiệu ứng phụ ra ngoài, làm sau commit hoặc qua outbox.</li>
<li>Giới hạn 60 giây: không gọi bên ngoài hay chờ người dùng trong transaction; transaction khổng lồ chạy được nhưng gây hại.</li>
<li>Phần lớn chi phí ghi là chờ cho bền; transaction chỉ chờ một lần. Nó vẫn không bao giờ thay được thiết kế schema tốt.</li>
</ul>
</div>
`,
};
