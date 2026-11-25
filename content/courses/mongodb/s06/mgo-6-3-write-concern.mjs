/**
 * 6.3 — Write concern: "đã lưu" thật sự nghĩa là gì (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s06-3-wc'] — replica set BA thành viên trong MỘT container phụ mgo-rs3 (--network none, ba mongod 27018/27019/27020,
 * _demo/rs3.sh; enableTestCommands=1 chỉ để dùng failpoint stopReplProducer trong lab). MongoDB 8.0.38.
 * Số tất định: mặc định { w: 'majority', wtimeout: 0 }; w:1 nhanh nhất, w:"majority" chậm nhiều lần, j:false không nhanh hơn, w:3 nhanh hơn majority (ms đổi ⇒ lời nêu thứ tự);
 * secondary ngừng chép ⇒ w:1 nhận 3 đơn, majority wtimeout 2000 ⇒ WriteConcernFailed 64 nhưng D-MAJ VẪN nằm trên primary; secondary chỉ thấy D0;
 * primary bị cô lập ⇒ 27019 lên primary sau ~10–12 s; D-MOI ghi majority; primary cũ quay lại ⇒ rollback 4 tài liệu (D-W1-1..3 + D-MAJ) ra removed.*.bson, cụm còn D0 D-MOI.
 * Thực hành 2 đã chạy thật: ngừng chép chỉ 27020 ⇒ majority ok, w:3 WriteConcernFailed.
 * Phát hiện lab: SIGSTOP secondary KHÔNG giả lập được đứt mạng — oplog đã nằm sẵn trong bộ đệm socket, secondary chạy tiếp vẫn nhận đủ ⇒ dùng failpoint.
 * Kiểm trùng: cụm ba container thật + thời gian bầu lại + ứng dụng thấy gì khi failover dạy ở Chương 7 (7.1/7.2) — bài này chỉ dựng tối thiểu để thấy write concern.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's06-3-wc';

export default {
  title: '6.3 — Write concern: what "saved" really means|||6.3 — Write concern: "đã lưu" thật sự nghĩa là gì',
  slug: 'mgo-6-3-write-concern',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Khi MongoDB trả "acknowledged: true", dữ liệu đang nằm ở đâu? Dựng replica set ba thành viên trong một container, đo w:1, w:"majority", j:false, w:3; giả lập đứt mạng: w:1 vẫn nhận, w:"majority" báo WriteConcernFailed nhưng tài liệu VẪN được ghi; rồi chuyển dự phòng thật — primary cũ quay lại và ROLLBACK bốn đơn đã "lưu" ra tệp removed.bson. Mặc định từ 5.0, bẫy arbiter, wtimeout nghĩa là "không biết", retryable writes, Jepsen 2013.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Write concern: what "saved" really means</h2>
<p class="lead">Every write returns <code>acknowledged: true</code> — but acknowledged by whom, and kept where? In memory of one server, in its journal on disk, or on most of the servers of the cluster? The <strong>write concern</strong> is the question you ask the database before it answers "saved". This lesson builds a three-member replica set, cuts a primary off from its secondaries, and watches four "saved" orders disappear in a rollback — then shows which write concern would have kept them.</p>

<h3>An everyday picture: sending a document at the post office</h3>
<p>You hand an important document to a counter clerk. "Received" can mean different things. The clerk has it in hand (it is in memory: if the office burns tonight, it is gone). The clerk has written it in the register book (it is on disk: it survives a power cut). Copies have reached two of the three branch offices (it survives losing a whole office). Each answer takes longer than the one before, and each protects against a worse disaster. MongoDB lets you choose, per write: <code>w: 1</code> is the clerk's hand, <code>j: true</code> the register book, <code>w: "majority"</code> the copies in most branches.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">w: 0</span><span class="lz-lnote">no answer at all — the client does not even learn about errors (Lesson 2.1: duplicate keys silently lost)</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 1</span><span class="lz-lnote">the primary applied it in memory — lost if the primary dies or is cut off before the secondaries copy it</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 1, j: true</span><span class="lz-lnote">the primary wrote it to its journal — survives a crash of that machine (Lesson 1.4), not a failover</span></div>
  <div class="lz-layer"><span class="lz-lname">w: "majority"</span><span class="lz-lnote">a majority of voting members have it durably — survives failover; never rolled back</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 3 / w: &lt;n&gt;</span><span class="lz-lnote">exactly n members applied it — stronger in count, but blocks if any one is down</span></div>
</div>

<h3>A three-member replica set in one container</h3>
<p>Write concern only becomes interesting with more than one server. The lab script <code>_demo/rs3.sh</code> starts three <code>mongod</code> processes (ports 27018, 27019, 27020) inside one container with no network, and joins them into replica set <code>rs3</code>; 27018 has a higher priority so it is the usual primary. In the output, <code>rs&gt;</code> is mongosh connected to the whole replica set (the driver finds the primary itself), <code>m2&gt;</code> is mongosh connected directly to member 27019. A real three-container cluster with Docker Compose is Chapter 7.</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>The default write concern is <code>w: "majority"</code> — the implicit default since MongoDB 5.0. Before 5.0 it was <code>w: 1</code>, and a lot of code, blog posts and Stack Overflow answers still assume that.</p>
${nguon('📘', 'Default MongoDB Read Concerns/Write Concerns — MongoDB Docs', 'Implicit default write concern w: "majority"; the arbiter edge case that falls back to w: 1', 'https://www.mongodb.com/docs/manual/reference/mongodb-defaults/')}

<h3>What each level costs</h3>
<p>300 inserts one by one, with four write concerns:</p>
${lenh(K, 3)}
<p>The exact milliseconds depend on the machine, but the order is stable across runs: <code>w: 1</code> is fastest; <code>w: "majority"</code> is several times slower, because each insert waits until two members have it <em>in their journals</em>; adding <code>j: false</code> does not make it faster here — the majority commit point of the replica set still follows journaled data (<code>writeConcernMajorityJournalDefault</code> is true by default). <code>w: 3</code> — all three members, but only in memory — is faster than majority. "Stronger" is not one line: count of copies and durability of each copy are two different axes.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "w: 1 is faster, let's use it for performance".</strong> The difference you just measured is the price of not losing the write when the primary fails. Batch writes (<code>insertMany</code>, <code>bulkWrite</code>) or transactions pay the wait once per batch (Lesson 6.2) — that is the right way to go faster, not weakening durability. Keep <code>w: 1</code> for data you can afford to lose: metrics samples, click logs, caches.</p>
</div>

<h3>Cut the primary off: what w:1 and w:"majority" say</h3>
<p>Now the secondaries stop copying from the primary — a network problem between them, simulated with a lab-only failpoint (see the note below). The primary still accepts writes:</p>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Three orders written with <code>w: 1</code>: "acknowledged". One order written with <code>w: "majority"</code> and a 2-second <code>wtimeout</code>: <code>WriteConcernFailed</code>, code 64, "waiting for replication timed out". And yet the primary holds <em>all four</em>, including <code>D-MAJ</code>; the secondary <code>m2</code> has only <code>D0</code>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a write concern timeout is not a failure to write.</strong> <code>wtimeout</code> means "I did not get enough confirmations in time", not "nothing was written". The write was applied on the primary and may survive — or, as you are about to see, may be rolled back. The honest meaning is <em>unknown</em>. Code that treats it as "failed, show an error, let the user try again" creates duplicates; code that treats it as "saved" may lose data. The safe handling: retry with the <em>same</em> identifier (an <code>_id</code> or a unique order number), so a retry either inserts once or hits E11000 and tells you it is already there (Lesson 6.5 builds exactly this).</p>
</div>
<p><em>Lab note.</em> Why a failpoint and not simply pausing the secondaries with <code>SIGSTOP</code>? It was tried first: the primary had already pushed the new oplog entries into the paused processes' socket buffers, so when they resumed they had everything and nothing was lost. A paused process is not a broken network. The failpoint <code>stopReplProducer</code> really stops the secondaries from fetching; it exists only when the server is started with <code>enableTestCommands=1</code>, which you must never do in production. Chapter 7 cuts a real network between containers.</p>

<h3>Failover, and the rollback</h3>
<p>Now the isolated primary itself hangs (paused), the secondaries can talk to each other again, and they hold an election:</p>
${lenh(K, 9)}
${lenh(K, 10)}
<p>About ten seconds without a primary — the election timeout — then 27019 is the new primary. Its data is what <em>it</em> had: <code>D0</code>. The application keeps working and writes <code>D-MOI</code> with majority. Now the old primary comes back:</p>
${lenh(K, 11)}
${lenh(K, 12)}
<p>The old primary discovered that its history had diverged from the majority's: it had four writes that no one else had. It <strong>rolled them back</strong> — undid them so that it matches the majority — and saved them to <code>rollback/&lt;collection-uuid&gt;/removed.&lt;time&gt;.bson</code>. Then it caught up, and because of its higher priority it became primary again. The cluster has <code>D0 D-MOI</code>. Four orders whose writes had returned "acknowledged" (three) or "unknown" (one) are gone from the database; they exist only in a BSON file on one server's disk, which nobody will look at unless someone knows to.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · partition</span><span class="lz-t">primary 27018 keeps accepting w:1 writes</span><span class="lz-d">secondaries do not receive them</span></div>
  <div class="lz-step"><span class="lz-k">2 · election</span><span class="lz-t">27019 + 27020 are a majority, elect 27019</span><span class="lz-d">its oplog does not contain the four writes</span></div>
  <div class="lz-step"><span class="lz-k">3 · new writes</span><span class="lz-t">D-MOI committed by the majority</span><span class="lz-d">history has now diverged</span></div>
  <div class="lz-step"><span class="lz-k">4 · rollback</span><span class="lz-t">old primary undoes what the majority never had</span><span class="lz-d">writes saved to removed.*.bson for manual recovery</span></div>
</div>
<p>The rule that follows: <strong>a write acknowledged with <code>w: "majority"</code> is never rolled back.</strong> A majority already has it, so any new primary — which must be elected by a majority — has it too. That is why majority is the default, and why it costs what you measured.</p>
${nguon('📘', 'Rollbacks During Replica Set Failover — MongoDB Docs', 'When rollback happens, the rollback/<uuid>/removed.<time>.bson files, avoiding rollback with w: "majority"', 'https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/')}
${nguon('📘', 'Write Concern — MongoDB Docs', 'w, j, wtimeout; acknowledgment behavior; writeConcernMajorityJournalDefault', 'https://www.mongodb.com/docs/manual/reference/write-concern/')}

<h3>🔎 A real report: "Call me maybe: MongoDB" (Jepsen, 2013)</h3>
<p>In May 2013 Kyle Kingsbury partitioned a five-node MongoDB 2.4 cluster while a client wrote 6,000 documents. With the defaults of the time — clients did not even check whether writes succeeded — 5,700 writes were acknowledged and only 3,319 survived: <strong>2,381 acknowledged writes lost</strong>, 42%. With <code>WriteConcern.MAJORITY</code> the cluster paused writes during the partition instead, and losses dropped to 2 (caused by a bug that was later fixed). The report pushed the ecosystem toward acknowledged writes by default, and in 2021 MongoDB 5.0 finally made majority the default. What the lab just reproduced in one container is the same mechanism, on purpose and in slow motion.</p>
${nguon('🔬', 'Jepsen: MongoDB — Call me maybe (aphyr.com, 2013-05-18)', '6000 writes, 5700 acknowledged, 2381 acknowledged writes lost with the old defaults; majority much safer', 'https://aphyr.com/posts/284-call-me-maybe-mongodb')}

<h3>Two more things you need</h3>
<p><strong>The arbiter trap.</strong> An arbiter is a member that votes but holds no data. In a primary–secondary–arbiter (PSA) set, the voting majority is 2 but only 2 members hold data; MongoDB then lowers the implicit default to <code>w: 1</code>, and a majority write would block whenever the one secondary is down. Many cheap production setups are PSA without anyone knowing what that does to durability (Lesson 7.3).</p>
<p><strong>Retryable writes.</strong> Drivers default to <code>retryWrites=true</code>: if a single write fails with a network error or because the primary stepped down, the driver retries it <em>once</em> on the new primary, and the server recognises the retry so it is not applied twice. It covers the failover blip; it does not cover a write concern timeout, and it does not make <code>w: 1</code> safe against rollback.</p>

<h3>💼 At work: the orders that vanished after the "small incident"</h3>
<p>A real-shaped story on an outsourcing project: the hosting provider restarts a network switch at night; MongoDB fails over in a few seconds; the morning reconciliation finds dozens of orders that customers have confirmation emails for but the database does not. The connection string had <code>w=1</code> "for performance", set years ago. Your tasks in the post-mortem: find the <code>rollback/</code> files on the old primary and restore the orders with <code>bsondump</code>/<code>mongorestore</code> after checking each one; change the write concern back to majority (or remove the override so the default applies); make order creation idempotent with a unique order number, so a timeout can be retried safely; and add an alert on the "rollback" log message. If the team says "majority is too slow", show them the batch numbers from Lesson 6.2.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-5-4-isolation', title: 'Distributed Systems 5.4 — Isolation levels vs consistency models', sub: 'Where write concern and replication fit among consistency guarantees' })}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What does w: majority guarantee?"</strong> — A majority of voting members have the write durably (journaled by default); it will not be rolled back after a failover.</li>
<li><strong>"What is a rollback in MongoDB?"</strong> — A former primary undoing writes the majority never received, after a failover; they go to rollback BSON files for manual recovery.</li>
<li><strong>"A write returned a write concern timeout. Was it written?"</strong> — Unknown: applied on the primary, maybe not replicated, may survive or be rolled back. Retry idempotently with the same key.</li>
<li><strong>"What is the default write concern?"</strong> — w: "majority" since 5.0 (w: 1 before), except PSA sets with an arbiter where it falls back to w: 1.</li>
<li><strong>"Why not w: 3 instead of majority?"</strong> — It blocks as soon as one member is down, and in-memory acknowledgment is not the same as durable; majority tolerates a minority failure.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>A replica set has 5 data-bearing voting members. How many must acknowledge <code>w: "majority"</code>? How many can be down while majority writes still succeed?</li>
<li>Start the lab set (<code>bash rs3.sh up</code>), stop replication on <em>one</em> secondary only (<code>bash rs3.sh ngung-chep 27020</code>). Predict, then test: does <code>w: "majority"</code> with <code>wtimeout: 2000</code> succeed? Does <code>w: 3</code>? Clean up with <code>bash rs3.sh down</code>.</li>
<li>Your service creates orders with <code>insertOne</code> and the default write concern. Write the handling for a <code>WriteConcernFailed</code> error so the customer is never charged twice and no order is lost.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Majority of 5 = 3. Two members can be down (or partitioned away) and majority writes still succeed; with three down, majority writes wait (and time out if <code>wtimeout</code> is set).</p>
<p>2. Run for real on the lab: <code>w: "majority"</code> succeeds — the primary plus 27019 are 2 of 3. <code>w: 3</code> fails with <code>WriteConcernFailed</code> "waiting for replication timed out" after 2 seconds — 27020 never confirms.</p>
<p>3. Give each order a client-generated unique number (or <code>_id</code>) with a unique index. On <code>WriteConcernFailed</code> (or a network error), retry the same insert with the same number: either it inserts now, or it returns E11000 — meaning the first attempt is there — and you read it back and return it. Charge the card only after the order is confirmed, keyed by the same number so the payment gateway can deduplicate too.</p>
</details>
<p><strong>Done when:</strong> you can tell, for each write concern, which failure makes the write disappear — and you have seen a rollback file with your own eyes.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Write concern', 'How many members (w) and how durably (j) a write must be stored before the server acknowledges it.'],
  ['w: "majority"', 'Acknowledged once a majority of voting members have it durably; never rolled back. Default since 5.0.'],
  ['j (journal)', 'Acknowledge only after the write is in the on-disk journal.'],
  ['wtimeout', 'Time limit for waiting on the write concern; expiry ⇒ WriteConcernFailed, outcome unknown.'],
  ['Rollback', 'A former primary undoing writes that the new majority never had; saved to rollback/*.bson.'],
  ['Election', 'Members choose a new primary when the current one is unreachable (about 10 s election timeout by default).'],
  ['Arbiter', 'A voting member without data; in PSA sets it lowers the implicit default write concern to w: 1.'],
  ['Retryable writes', 'Driver retries a single write once after a network error or failover; the server deduplicates it.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>"acknowledged" means "as stored as the write concern asked" — nothing more.</li>
<li>w: 1 is fast and can be rolled back after a failover; w: "majority" is slower and is never rolled back.</li>
<li>A write concern timeout means unknown: the write may be on the primary. Retry with the same unique key.</li>
<li>Rollback files sit on the old primary; someone must know to look for them.</li>
<li>Default is majority since 5.0 — except with an arbiter, and except where old code overrides it with w=1.</li>
<li>Go faster with batches and transactions, not by weakening durability for data you cannot lose.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Write concern: "đã lưu" thật sự nghĩa là gì</h2>
<p class="lead">Lệnh ghi nào cũng trả về <code>acknowledged: true</code> — nhưng ai xác nhận, và giữ ở đâu? Trong bộ nhớ của một máy, trong journal trên đĩa của nó, hay trên đa số các máy của cụm? <strong>Write concern</strong> là câu hỏi bạn đặt cho database trước khi nó trả lời "đã lưu". Bài này dựng một replica set ba thành viên, cắt primary khỏi các secondary, và nhìn bốn đơn hàng "đã lưu" biến mất trong một lần rollback — rồi chỉ ra write concern nào lẽ ra đã giữ được chúng.</p>

<h3>Hình ảnh đời thường: gửi hồ sơ ở bưu điện</h3>
<p>Bạn đưa một bộ hồ sơ quan trọng cho nhân viên ở quầy. "Đã nhận" có thể mang nhiều nghĩa. Nhân viên đang cầm trên tay (nằm trong bộ nhớ: đêm nay bưu cục cháy là mất). Nhân viên đã ghi vào sổ nhận (nằm trên đĩa: mất điện vẫn còn). Bản sao đã tới hai trong ba chi nhánh (mất cả một bưu cục vẫn còn). Mỗi câu trả lời lâu hơn câu trước, và mỗi câu chống được một tai hoạ tệ hơn. MongoDB cho bạn chọn theo từng lần ghi: <code>w: 1</code> là bàn tay nhân viên, <code>j: true</code> là cuốn sổ, <code>w: "majority"</code> là bản sao ở đa số chi nhánh.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">w: 0</span><span class="lz-lnote">không trả lời gì — client thậm chí không biết có lỗi (Bài 2.1: trùng khoá mất lặng lẽ)</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 1</span><span class="lz-lnote">primary đã áp dụng trong bộ nhớ — mất nếu primary chết hoặc bị cô lập trước khi secondary chép</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 1, j: true</span><span class="lz-lnote">primary đã ghi vào journal — sống qua sự cố của máy đó (Bài 1.4), không sống qua chuyển dự phòng</span></div>
  <div class="lz-layer"><span class="lz-lname">w: "majority"</span><span class="lz-lnote">đa số thành viên bỏ phiếu đã có bản bền vững — sống qua chuyển dự phòng; không bao giờ bị rollback</span></div>
  <div class="lz-layer"><span class="lz-lname">w: 3 / w: &lt;n&gt;</span><span class="lz-lnote">đúng n thành viên đã áp dụng — mạnh hơn về số lượng, nhưng chặn lại nếu chỉ một máy hỏng</span></div>
</div>

<h3>Replica set ba thành viên trong một container</h3>
<p>Write concern chỉ trở nên thú vị khi có hơn một máy chủ. Script lab <code>_demo/rs3.sh</code> chạy ba tiến trình <code>mongod</code> (cổng 27018, 27019, 27020) trong một container không có mạng, và ghép chúng thành replica set <code>rs3</code>; 27018 có độ ưu tiên cao hơn nên thường là primary. Trong output, <code>rs&gt;</code> là mongosh nối vào cả replica set (driver tự tìm primary), <code>m2&gt;</code> là mongosh nối thẳng vào thành viên 27019. Cụm ba container thật bằng Docker Compose ở Chương 7.</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>Write concern mặc định là <code>w: "majority"</code> — mặc định ngầm từ MongoDB 5.0. Trước 5.0 nó là <code>w: 1</code>, và rất nhiều mã, bài blog, câu trả lời Stack Overflow vẫn mặc nhiên coi như vậy.</p>
${nguon('📘', 'Default MongoDB Read Concerns/Write Concerns — MongoDB Docs', 'Write concern mặc định ngầm w: "majority"; trường hợp biên có arbiter thì lùi về w: 1', 'https://www.mongodb.com/docs/manual/reference/mongodb-defaults/')}

<h3>Mỗi mức tốn bao nhiêu</h3>
<p>Chèn lần lượt 300 tài liệu, với bốn write concern:</p>
${lenh(K, 3)}
<p>Số mili giây cụ thể tuỳ máy, nhưng thứ tự thì ổn định qua các lần chạy: <code>w: 1</code> nhanh nhất; <code>w: "majority"</code> chậm hơn nhiều lần, vì mỗi lần chèn chờ tới khi hai thành viên có nó <em>trong journal</em>; thêm <code>j: false</code> ở đây không nhanh hơn — điểm commit đa số của replica set vẫn đi theo dữ liệu đã ghi journal (<code>writeConcernMajorityJournalDefault</code> mặc định là true). <code>w: 3</code> — cả ba thành viên, nhưng chỉ trong bộ nhớ — lại nhanh hơn majority. "Mạnh hơn" không phải một đường thẳng: số bản sao và độ bền của từng bản là hai trục khác nhau.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "w: 1 nhanh hơn, dùng cho hiệu năng".</strong> Khoảng chênh bạn vừa đo là cái giá để không mất lần ghi khi primary hỏng. Ghi theo lô (<code>insertMany</code>, <code>bulkWrite</code>) hay transaction chỉ trả phần chờ một lần cho cả lô (Bài 6.2) — đó mới là cách đúng để nhanh hơn, chứ không phải làm yếu độ bền. Chỉ giữ <code>w: 1</code> cho dữ liệu mất được: mẫu số liệu đo, log lượt bấm, cache.</p>
</div>

<h3>Cắt primary ra: w:1 và w:"majority" nói gì</h3>
<p>Giờ các secondary ngừng chép từ primary — một sự cố mạng giữa chúng, giả lập bằng một failpoint chỉ dùng trong lab (xem ghi chú bên dưới). Primary vẫn nhận ghi:</p>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Ba đơn ghi bằng <code>w: 1</code>: "acknowledged". Một đơn ghi bằng <code>w: "majority"</code> với <code>wtimeout</code> 2 giây: <code>WriteConcernFailed</code>, mã 64, "waiting for replication timed out". Thế nhưng primary đang giữ <em>cả bốn</em>, kể cả <code>D-MAJ</code>; secondary <code>m2</code> chỉ có <code>D0</code>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — hết thời gian chờ write concern không có nghĩa là không ghi.</strong> <code>wtimeout</code> nghĩa là "tôi không nhận đủ xác nhận kịp lúc", không phải "chưa ghi gì". Lần ghi đã được áp dụng trên primary và có thể sống — hoặc, như bạn sắp thấy, có thể bị rollback. Nghĩa trung thực của nó là <em>không biết</em>. Mã coi nó là "thất bại, báo lỗi, để người dùng thử lại" sẽ sinh bản trùng; mã coi nó là "đã lưu" có thể mất dữ liệu. Cách xử lý an toàn: thử lại với <em>cùng</em> mã định danh (một <code>_id</code> hoặc số đơn duy nhất), để lần thử lại hoặc chèn đúng một lần, hoặc gặp E11000 và cho bạn biết nó đã có (Bài 6.5 dựng đúng điều này).</p>
</div>
<p><em>Ghi chú lab.</em> Vì sao dùng failpoint mà không đơn giản tạm dừng các secondary bằng <code>SIGSTOP</code>? Cách đó đã được thử trước: primary đã đẩy sẵn các mục oplog mới vào bộ đệm socket của các tiến trình đang bị dừng, nên khi chạy tiếp chúng có đủ mọi thứ và không gì bị mất. Một tiến trình bị dừng không phải là mạng bị đứt. Failpoint <code>stopReplProducer</code> thật sự chặn secondary kéo dữ liệu; nó chỉ có khi máy chủ khởi động với <code>enableTestCommands=1</code>, thứ bạn không bao giờ được bật ở production. Chương 7 cắt mạng thật giữa các container.</p>

<h3>Chuyển dự phòng, và lần rollback</h3>
<p>Giờ chính primary đang bị cô lập bị treo (tạm dừng), các secondary lại nói chuyện được với nhau, và chúng tổ chức bầu chọn:</p>
${lenh(K, 9)}
${lenh(K, 10)}
<p>Khoảng mười giây không có primary — đúng thời gian chờ bầu chọn — rồi 27019 thành primary mới. Dữ liệu của nó là những gì <em>nó</em> có: <code>D0</code>. Ứng dụng vẫn chạy tiếp và ghi <code>D-MOI</code> với majority. Giờ primary cũ quay lại:</p>
${lenh(K, 11)}
${lenh(K, 12)}
<p>Primary cũ phát hiện lịch sử của nó đã rẽ nhánh khỏi lịch sử của đa số: nó có bốn lần ghi mà không ai khác có. Nó <strong>rollback</strong> chúng — hoàn tác để khớp với đa số — và cất chúng vào <code>rollback/&lt;uuid-collection&gt;/removed.&lt;thời-điểm&gt;.bson</code>. Rồi nó đuổi kịp, và nhờ độ ưu tiên cao hơn nó lại thành primary. Cụm còn <code>D0 D-MOI</code>. Bốn đơn mà lệnh ghi đã trả "acknowledged" (ba đơn) hoặc "không biết" (một đơn) đã biến khỏi database; chúng chỉ còn trong một tệp BSON trên đĩa của một máy, thứ không ai nhìn tới trừ khi có người biết mà tìm.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · đứt mạng</span><span class="lz-t">primary 27018 vẫn nhận ghi w:1</span><span class="lz-d">secondary không nhận được</span></div>
  <div class="lz-step"><span class="lz-k">2 · bầu chọn</span><span class="lz-t">27019 + 27020 là đa số, bầu 27019</span><span class="lz-d">oplog của nó không có bốn lần ghi kia</span></div>
  <div class="lz-step"><span class="lz-k">3 · ghi mới</span><span class="lz-t">D-MOI được đa số commit</span><span class="lz-d">lịch sử giờ đã rẽ nhánh</span></div>
  <div class="lz-step"><span class="lz-k">4 · rollback</span><span class="lz-t">primary cũ hoàn tác những gì đa số chưa từng có</span><span class="lz-d">các lần ghi cất vào removed.*.bson để khôi phục bằng tay</span></div>
</div>
<p>Luật rút ra: <strong>một lần ghi được xác nhận với <code>w: "majority"</code> không bao giờ bị rollback.</strong> Đa số đã có nó, nên mọi primary mới — vốn phải được đa số bầu — cũng có nó. Đó là lý do majority là mặc định, và vì sao nó tốn đúng như bạn đã đo.</p>
${nguon('📘', 'Rollbacks During Replica Set Failover — MongoDB Docs', 'Khi nào rollback xảy ra, tệp rollback/<uuid>/removed.<time>.bson, tránh rollback bằng w: "majority"', 'https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/')}
${nguon('📘', 'Write Concern — MongoDB Docs', 'w, j, wtimeout; hành vi xác nhận; writeConcernMajorityJournalDefault', 'https://www.mongodb.com/docs/manual/reference/write-concern/')}

<h3>🔎 Một báo cáo thật: "Call me maybe: MongoDB" (Jepsen, 2013)</h3>
<p>Tháng 5/2013, Kyle Kingsbury cắt mạng một cụm MongoDB 2.4 năm máy trong lúc một client ghi 6.000 tài liệu. Với mặc định thời đó — client còn không kiểm lần ghi có thành công không — 5.700 lần ghi được xác nhận nhưng chỉ 3.319 còn sống: <strong>mất 2.381 lần ghi đã xác nhận</strong>, 42%. Với <code>WriteConcern.MAJORITY</code>, cụm tạm ngừng nhận ghi trong lúc đứt mạng, và số mất giảm còn 2 (do một lỗi sau này đã được sửa). Báo cáo đó đẩy cả hệ sinh thái sang ghi có xác nhận làm mặc định, và năm 2021 MongoDB 5.0 cuối cùng đặt majority làm mặc định. Thứ lab vừa tái hiện trong một container chính là cơ chế đó, cố ý và quay chậm.</p>
${nguon('🔬', 'Jepsen: MongoDB — Call me maybe (aphyr.com, 18/05/2013)', '6000 lần ghi, 5700 được xác nhận, mất 2381 lần ghi đã xác nhận với mặc định cũ; majority an toàn hơn nhiều', 'https://aphyr.com/posts/284-call-me-maybe-mongodb')}

<h3>Thêm hai điều bạn cần</h3>
<p><strong>Bẫy arbiter.</strong> Arbiter là thành viên có quyền bầu nhưng không giữ dữ liệu. Trong bộ primary–secondary–arbiter (PSA), đa số phiếu là 2 nhưng chỉ có 2 thành viên giữ dữ liệu; MongoDB khi đó hạ mặc định ngầm xuống <code>w: 1</code>, và lần ghi majority sẽ bị chặn mỗi khi secondary duy nhất hỏng. Nhiều hệ thống production giá rẻ là PSA mà không ai biết điều đó làm gì với độ bền (Bài 7.3).</p>
<p><strong>Retryable writes.</strong> Driver mặc định <code>retryWrites=true</code>: nếu một lệnh ghi đơn thất bại vì lỗi mạng hoặc vì primary vừa step down, driver thử lại <em>một lần</em> trên primary mới, và máy chủ nhận ra lần thử lại nên không áp dụng hai lần. Nó che được cú chập lúc chuyển dự phòng; nó không che hết thời gian chờ write concern, và không làm <code>w: 1</code> an toàn trước rollback.</p>

<h3>💼 Đi làm: những đơn hàng biến mất sau "sự cố nhỏ"</h3>
<p>Một câu chuyện rất giống thật ở dự án outsourcing: nhà cung cấp hosting khởi động lại một switch mạng lúc nửa đêm; MongoDB chuyển dự phòng trong vài giây; buổi đối soát sáng hôm sau thấy hàng chục đơn mà khách có email xác nhận nhưng database thì không. Chuỗi kết nối có <code>w=1</code> "cho nhanh", đặt từ nhiều năm trước. Việc của bạn trong buổi phân tích sự cố: tìm các tệp <code>rollback/</code> trên primary cũ và khôi phục đơn bằng <code>bsondump</code>/<code>mongorestore</code> sau khi kiểm từng đơn; đổi write concern về majority (hoặc bỏ phần ghi đè để mặc định có hiệu lực); làm việc tạo đơn idempotent bằng số đơn duy nhất, để hết thời gian chờ có thể thử lại an toàn; và thêm cảnh báo cho dòng log "rollback". Nếu nhóm nói "majority chậm quá", hãy cho họ xem số đo theo lô ở Bài 6.2.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-5-4-isolation', title: 'Hệ phân tán 5.4 — Mức cô lập và mô hình nhất quán', sub: 'Write concern và nhân bản nằm ở đâu giữa các bảo đảm nhất quán' })}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"w: majority bảo đảm điều gì?"</strong> — Đa số thành viên bỏ phiếu đã có lần ghi một cách bền vững (mặc định đã ghi journal); nó sẽ không bị rollback sau chuyển dự phòng.</li>
<li><strong>"Rollback trong MongoDB là gì?"</strong> — Primary cũ hoàn tác những lần ghi mà đa số chưa từng nhận, sau một lần chuyển dự phòng; chúng được cất vào tệp BSON rollback để khôi phục bằng tay.</li>
<li><strong>"Một lần ghi trả về hết thời gian chờ write concern. Nó đã được ghi chưa?"</strong> — Không biết: đã áp dụng trên primary, có thể chưa nhân bản, có thể sống hoặc bị rollback. Thử lại idempotent với cùng khoá.</li>
<li><strong>"Write concern mặc định là gì?"</strong> — w: "majority" từ 5.0 (trước đó là w: 1), trừ bộ PSA có arbiter thì lùi về w: 1.</li>
<li><strong>"Sao không dùng w: 3 thay cho majority?"</strong> — Nó chặn ngay khi một thành viên hỏng, và xác nhận trong bộ nhớ không giống bền vững; majority chịu được thiểu số hỏng.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Một replica set có 5 thành viên giữ dữ liệu và có quyền bầu. Cần bao nhiêu thành viên xác nhận cho <code>w: "majority"</code>? Bao nhiêu máy có thể hỏng mà ghi majority vẫn thành công?</li>
<li>Bật bộ lab (<code>bash rs3.sh up</code>), chỉ ngừng chép ở <em>một</em> secondary (<code>bash rs3.sh ngung-chep 27020</code>). Đoán trước, rồi thử: <code>w: "majority"</code> với <code>wtimeout: 2000</code> có thành công không? <code>w: 3</code> thì sao? Dọn bằng <code>bash rs3.sh down</code>.</li>
<li>Dịch vụ của bạn tạo đơn bằng <code>insertOne</code> với write concern mặc định. Viết cách xử lý lỗi <code>WriteConcernFailed</code> để khách không bao giờ bị trừ tiền hai lần và không đơn nào bị mất.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Đa số của 5 là 3. Hai thành viên có thể hỏng (hoặc bị cắt mạng) mà ghi majority vẫn thành công; ba máy hỏng thì ghi majority phải chờ (và hết hạn nếu có đặt <code>wtimeout</code>).</p>
<p>2. Đã chạy thật trên lab: <code>w: "majority"</code> thành công — primary cùng 27019 là 2 trên 3. <code>w: 3</code> thất bại với <code>WriteConcernFailed</code> "waiting for replication timed out" sau 2 giây — 27020 không bao giờ xác nhận.</p>
<p>3. Cho mỗi đơn một số duy nhất do client sinh (hoặc <code>_id</code>) có index unique. Gặp <code>WriteConcernFailed</code> (hay lỗi mạng) thì thử lại đúng lệnh chèn với đúng số đó: hoặc lần này chèn được, hoặc nó trả E11000 — nghĩa là lần đầu đã có — và bạn đọc lại rồi trả về. Chỉ trừ tiền thẻ sau khi đơn đã được xác nhận, dùng chính số đó làm khoá để cổng thanh toán cũng lọc được trùng.</p>
</details>
<p><strong>Xong khi:</strong> với mỗi write concern, bạn nói được sự cố nào làm lần ghi biến mất — và bạn đã tận mắt thấy một tệp rollback.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Write concern', 'Một lần ghi phải được lưu ở bao nhiêu thành viên (w) và bền tới mức nào (j) trước khi máy chủ xác nhận.'],
  ['w: "majority"', 'Xác nhận khi đa số thành viên bỏ phiếu đã có bản bền vững; không bao giờ bị rollback. Mặc định từ 5.0.'],
  ['j (journal)', 'Chỉ xác nhận sau khi lần ghi đã nằm trong journal trên đĩa.'],
  ['wtimeout', 'Giới hạn thời gian chờ write concern; hết hạn ⇒ WriteConcernFailed, kết quả không biết.'],
  ['Rollback', 'Primary cũ hoàn tác những lần ghi mà đa số mới chưa từng có; cất vào rollback/*.bson.'],
  ['Bầu chọn (election)', 'Các thành viên chọn primary mới khi primary hiện tại không liên lạc được (mặc định chờ khoảng 10 s).'],
  ['Arbiter', 'Thành viên bỏ phiếu nhưng không có dữ liệu; trong bộ PSA nó hạ write concern mặc định ngầm xuống w: 1.'],
  ['Retryable writes', 'Driver thử lại một lệnh ghi đơn một lần sau lỗi mạng hay chuyển dự phòng; máy chủ lọc bản trùng.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>"acknowledged" nghĩa là "đã lưu đúng mức write concern yêu cầu" — không hơn.</li>
<li>w: 1 nhanh và có thể bị rollback sau chuyển dự phòng; w: "majority" chậm hơn và không bao giờ bị rollback.</li>
<li>Hết thời gian chờ write concern nghĩa là không biết: lần ghi có thể đang nằm trên primary. Thử lại với cùng khoá duy nhất.</li>
<li>Tệp rollback nằm trên primary cũ; phải có người biết mà tìm.</li>
<li>Mặc định là majority từ 5.0 — trừ khi có arbiter, và trừ chỗ mã cũ ghi đè bằng w=1.</li>
<li>Nhanh hơn bằng ghi theo lô và transaction, chứ đừng làm yếu độ bền cho dữ liệu không được mất.</li>
</ul>
</div>
`,
};
