/**
 * 8.4 — Spring Data MongoDB sau phần cơ bản: transaction, Decimal128, ghi lô và auditing (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s08-4-spring'] (Spring Boot 4.1.2, Spring Data MongoDB 5.1.2, driver Java 5.8.1, JDK 25; MongoDB 8.0.38;
 * mã _demo/spring/, chạy bằng spring/chay.sh; kịch bản demo/s08/s08-4-spring.txt).
 * Khối: 0 BigDecimal mặc định · 1 big-decimal=string · 2 @Transactional không có MongoTransactionManager · 3 có bean · 4 auditing + @Version · 5 ghi lô · 6 chi phí write concern mỗi lệnh.
 * Số tất định: decimal ⇒ $type "decimal", sắp đúng, count(>100000) = 1; string ⇒ sắp sai (450000 < 99000), count = 3; không TM ⇒ đơn D2 mồ côi; có TM ⇒ D1, D3;
 * OptimisticLockingFailureException; save() với version null ⇒ insert ⇒ DuplicateKeyException; saveAll tài liệu đã có ⇒ 20000 update, bulkOps ⇒ 1 update.
 * Số dao động: saveAll sửa 20.000 ≈ 100–145 s vs bulkOps ≈ 1 s; w:majority và w:1 j:true ≈ 5–8 ms/lệnh vs w:1 ≈ 0,4 ms.
 * Kiểm trùng: spring-boot Ch20 (sb-20-1…20-5) dạy starter, @Document, repository, MongoTemplate, save() mất cập nhật, explain, aggregation, Testcontainers
 * ⇒ chỉ liên kết; bài này chỉ dạy bốn chủ đề "sau phần cơ bản".
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's08-4-spring';

const SP = `// _demo/spring/src/main/java/com/cuongthai/mgo/SanPham.java
@Document("spSpring")
public class SanPham {
  @Id public String id;
  public String ten;
  public BigDecimal gia;                    // tiền: BigDecimal ở Java, Decimal128 ở MongoDB (nếu cấu hình đúng)
  @Version public Long version;             // khoá lạc quan; null ⇒ Spring coi là tài liệu MỚI
  @CreatedDate public Instant taoLuc;       // cần @EnableMongoAuditing
  @LastModifiedDate public Instant suaLuc;
}`;

const SV = `// _demo/spring/.../DatHangService.java — ghi đơn rồi trừ kho; hết hàng ⇒ ném lỗi
@Transactional
public void datHang(String maDon, String sp, int sl) {
  mongo.insert(new DonHang(maDon, sp, sl));
  var r = mongo.updateFirst(Query.query(Criteria.where("_id").is(sp).and("ton").gte(sl)),
                            new Update().inc("ton", -sl), "khoSpring");
  if (r.getModifiedCount() == 0) throw new IllegalStateException("hết hàng " + sp);
}

// _demo/spring/.../CauHinh.java — chỉ khi có bean này @Transactional mới bao MongoDB
@Bean MongoTransactionManager transactionManager(MongoDatabaseFactory f) { return new MongoTransactionManager(f); }`;

const BULK = `// Trích App.java — sửa giá 20.000 sản phẩm hai cách
var tatCa = repo.findAll();
tatCa.forEach(s -> s.gia = s.gia.add(BigDecimal.ONE));
repo.saveAll(tatCa);                                          // ✘ mỗi tài liệu một lệnh update (thay cả tài liệu, kiểm version)

var ops = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, SanPham.class);
for (int i = 0; i < 20000; i++)
  ops.updateOne(Query.query(Criteria.where("_id").is("SP" + i)),
                new Update().inc("gia", BigDecimal.ONE).inc("version", 1));
ops.execute();                                                // ✔ một lệnh update chở 20.000 thao tác`;

export default {
  title: '8.4 — Spring Data MongoDB beyond the basics: transactions, Decimal128, bulk and auditing|||8.4 — Spring Data MongoDB sau phần cơ bản: transaction, Decimal128, ghi lô và auditing',
  slug: 'mgo-8-4-spring-data',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Phần cơ bản (starter, @Document, repository, MongoTemplate, explain, aggregation, Testcontainers) đã ở spring-boot Chương 20 — bài này đo bốn chủ đề sau đó trên Spring Boot 4.1.2 + Spring Data MongoDB 5.1.2: @Transactional KHÔNG làm gì với MongoDB nếu thiếu bean MongoTransactionManager (đơn mồ côi, không lỗi); BigDecimal lưu thành Decimal128 ở 5.x nhưng một thuộc tính hay bản cũ lưu thành chuỗi ⇒ sắp xếp và so sánh giá sai (450.000 < 99.000); saveAll trên tài liệu đã có gửi 20.000 lệnh và mất cỡ hai phút vì mỗi lệnh chờ journal, BulkOperations gửi một lệnh trong khoảng một giây; auditing @CreatedDate/@LastModifiedDate, @Version chặn ghi đè bằng OptimisticLockingFailureException, và bẫy tài liệu ghi bằng bulkOps thiếu version khiến save() tưởng là tài liệu mới.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Spring Data MongoDB beyond the basics: transactions, Decimal128, bulk and auditing</h2>
<p class="lead">The Spring Boot course already teaches Spring Data MongoDB from zero — the starter, <code>spring.mongodb.uri</code>, <code>@Document</code> records, repositories, <code>MongoTemplate</code>, the lost update of <code>save()</code>, explain, aggregation and Testcontainers. Read those lessons first. This lesson picks up where they stop, with four topics that decide whether a Spring + MongoDB backend is correct under load: transactions, money, bulk writes and auditing. Every result below was produced by the small application in <code>_demo/spring/</code> (Spring Boot 4.1.2, Spring Data MongoDB 5.1.2, Java driver 5.8.1) against the lab.</p>
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-20-2-spring-data-mongo', title: 'Spring Boot 20.2 — Spring Data MongoDB', sub: 'Starter, @Document, repository, MongoTemplate, save() replaces the whole document' })}
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-20-3-mongo-query-index', title: 'Spring Boot 20.3 — Queries, indexes, aggregation, paging', sub: 'explain() from Spring, @Indexed vs explicit indexes, keyset paging' })}

<h3>An everyday picture: a bank teller's stamp</h3>
<p>A bank branch has a rule: "every transfer must be stamped by the supervisor". The rule is printed on the wall — but if the branch never hired a supervisor, tellers keep processing transfers without the stamp, and nobody notices until an audit. <code>@Transactional</code> is the rule on the wall. The <code>MongoTransactionManager</code> bean is the supervisor. Spring Boot auto-configures a transaction manager for JPA, but not for MongoDB: without the bean, the annotation applies to nothing.</p>

<h3>The application</h3>
${ma('java', SP)}
<p>Run any experiment with <code>spring/chay.sh &lt;decimal|tx|bulk|audit&gt;</code>; the script runs the compiled classes with the libraries Maven downloaded (the header of <code>chay.sh</code> shows the one-time build command).</p>

<h3>1. @Transactional needs a MongoTransactionManager</h3>
${ma('java', SV)}
<p>Three orders on a stock of 3 — the same scenario as Lesson 8.3, now in Java:</p>
${lenh(K, 2)}
${lenh(K, 3)}
<p>Without the bean, D2 threw "hết hàng" and Spring reported the exception — but its order <strong>stayed in the database</strong>: no transaction ever started, each <code>MongoTemplate</code> call auto-committed. No warning at startup, no error at runtime. With the bean (enabled here by <code>--mgo.tx=true</code>), the same code rolled D2 back. Two more conditions: the server must be a replica set or sharded cluster (Lesson 6.2 — the lab is), and collections must exist before the transaction on older servers, so create them at startup. And notice what Spring does <em>not</em> do: retry. Under contention the server aborts transactions with <code>WriteConflict</code> labelled <code>TransientTransactionError</code>; the driver's <code>withTransaction</code> (and Mongoose, Lesson 8.3) retries them, Spring's <code>@Transactional</code> just throws. The lab of this chapter measures what that means under 40 concurrent orders.</p>
${nguon('📘', 'Sessions & Transactions — Spring Data MongoDB', 'MongoTransactionManager is the gateway to the well known Spring transaction support; it binds a ClientSession to the thread', 'https://docs.spring.io/spring-data/mongodb/reference/mongodb/client-session-transactions.html')}
<div class="pitfall co-tieu-de">
<p><strong>Trap — the transaction that is not there, in a test that passes.</strong> Integration tests usually check the happy path: an order is created, stock goes down — green with or without a transaction manager. Write the failure test explicitly: force the second step to fail and assert that the first step's document does <em>not</em> exist. That single test catches the missing bean, a missing <code>@Transactional</code>, and self-invocation (calling a <code>@Transactional</code> method from another method of the same class bypasses the Spring proxy).</p>
</div>

<h3>2. BigDecimal: Decimal128 or a string?</h3>
${lenh(K, 0)}
${lenh(K, 1)}
<p>With Spring Data MongoDB 5.1 the default stored <code>BigDecimal</code> as BSON <code>decimal</code> (Decimal128): sorting by price gives 25,000.50 &lt; 99,000 &lt; 450,000 and <code>gia &gt; 100000</code> finds one product. The second run uses one property, <code>spring.data.mongodb.representation.big-decimal=string</code> — the representation older Spring Data versions used, and the one the Spring Data reference still describes on its mapping page (<em>"BigDecimal, which is represented as String instead of Decimal128"</em>). Now the prices are strings: sorting compares characters, so "450000" &lt; "99000", and <code>gia &gt; 100000</code> returns <strong>all three</strong> products, because comparing a string with a decimal follows BSON type order (Lesson 1.2), not numeric value. No exception anywhere — just wrong reports and wrong filters.</p>
${nguon('📘', 'Object Mapping — Spring Data MongoDB', '@Field(targetType=…) can come in handy … like for BigDecimal, which is represented as String instead of Decimal128', 'https://docs.spring.io/spring-data/mongodb/reference/mongodb/mapping/mapping.html')}
<div class="pitfall co-tieu-de">
<p><strong>Trap — two representations in one collection.</strong> A project upgraded from an older Spring Boot, or with an old service still writing, ends up with some prices as strings and some as Decimal128. Queries silently match only one kind. Before relying on the default, check your data: <code>db.products.aggregate([{ $group: { _id: { $type: '$gia' }, n: { $sum: 1 } } }])</code>. Make the choice explicit in configuration (the property above, or <code>@Field(targetType = FieldType.DECIMAL128)</code> on the field), migrate old documents with an update pipeline using <code>$toDecimal</code>, and add a <code>$jsonSchema</code> rule <code>bsonType: 'decimal'</code> so nothing can write a string again.</p>
</div>

<h3>3. Bulk writes: one command instead of twenty thousand</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">repo.saveAll(20.000 existing)</span><span class="lz-t">20,000 commands</span><span class="lz-d">each: conditional replace on _id + version → wait for journal (w: majority) → reply</span></div>
  <div class="lz-step"><span class="lz-k">bulkOps … execute()</span><span class="lz-t">1 command</span><span class="lz-d">20,000 updateOne in one bulk write → one write-concern wait for the whole batch</span></div>
  <div class="lz-step"><span class="lz-k">updateMulti(query, update)</span><span class="lz-t">1 command, 1 operation</span><span class="lz-d">when the same update fits every document (e.g. +1 to all prices)</span></div>
</div>
${ma('java', BULK)}
${lenh(K, 5)}
<p>Inserting 20,000 <em>new</em> products was fast in all three ways — Spring and the driver batch new documents into one <code>insert</code> command. Updating them was not: <code>repo.saveAll()</code> on existing entities sent <strong>20,000 separate update commands</strong> and took around two minutes; one <code>BulkOperations</code> batch sent a single command and took about a second. Why is each separate command so expensive? The last block measures it directly in mongosh:</p>
${lenh(K, 6)}
<p>With the default write concern <code>majority</code>, each command waits until its write is in the journal on disk (on a one-node replica set, majority means "this node, journaled") — several milliseconds per command; <code>w: 1, j: true</code> costs the same, <code>w: 1</code> alone only a fraction of a millisecond. A bulk command pays that wait once for the whole batch. So: for jobs that touch many documents — price updates, imports, recalculations — use <code>bulkOps</code> (or <code>updateMulti</code> when one update fits all), not a loop of <code>save()</code>. Do not "fix" it by lowering the write concern; that trades speed for the rollback of Lesson 6.3.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — bulkOps skips the entity lifecycle.</strong> Look at <code>SP0</code> after the bulk insert: auditing filled the dates, but there is <strong>no <code>version</code> field</strong>. When the application later loads it and calls <code>repo.save()</code>, Spring sees <code>version == null</code>, decides the entity is new and sends an <code>insert</code> — <code>DuplicateKeyException</code>. If you write through bulk operations or raw templates, set every field the entity lifecycle would set (version 0, defaults), or the next <code>save()</code> fails.</p>
</div>

<h3>4. Auditing and @Version</h3>
${lenh(K, 4)}
<p><code>@EnableMongoAuditing</code> filled <code>taoLuc</code> and <code>suaLuc</code> on the first save and updated only <code>suaLuc</code> on the second — no manual timestamps scattered over services (add <code>@CreatedBy</code> with an <code>AuditorAware</code> bean to record who). <code>@Version</code> made the stale copy fail: tab 1 saved version 0 → 1, tab 2 still held version 0 and got <code>OptimisticLockingFailureException</code> instead of silently overwriting the new price with the old one. This is the fix for the lost update that the Spring Boot course measured with <code>save()</code>; map the exception to HTTP 409. The last line is the same trap as above from the other side: a new object with an existing <code>_id</code> and no version is an insert, not an update.</p>
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Optimistic and pessimistic locking', sub: '@Version and OptimisticLockException on the JPA side' })}

<h3>💼 At work: "the nightly price job takes four hours"</h3>
<p>A retail client's Spring service recalculates prices every night: <code>findAll()</code>, change each product in Java, <code>saveAll()</code>. With 2 million products and a replica set across two zones, each update waits for majority acknowledgement over the network — hours, and the job overlaps morning traffic. Your fix: stream with a cursor (<code>mongo.stream(query, SanPham.class)</code>) instead of <code>findAll()</code>, accumulate <code>updateOne</code> operations in <code>bulkOps</code> of 1,000–5,000, execute each batch, and make the job idempotent with a marker field (Lesson 6.1) so a crash can resume. Measure before and after on a staging copy and put both numbers in the ticket.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Does @Transactional work with MongoDB out of the box in Spring Boot?"</strong> — No; you must declare a MongoTransactionManager bean, and the server must be a replica set or sharded cluster.</li>
<li><strong>"Does Spring retry a MongoDB transaction on WriteConflict?"</strong> — No; catch errors labelled TransientTransactionError and retry the whole transactional method, with a limit.</li>
<li><strong>"How do you store money in MongoDB from Java?"</strong> — BigDecimal mapped to Decimal128, configured explicitly; never double, and check old data for string values.</li>
<li><strong>"How do you update 100,000 documents efficiently?"</strong> — updateMulti if one update fits, otherwise BulkOperations in batches; not a save() loop — each command pays the write-concern wait.</li>
<li><strong>"How does @Version work in Spring Data MongoDB?"</strong> — save() filters on the version it loaded and increments it; no match ⇒ OptimisticLockingFailureException; a null version means insert.</li>
</ul>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>Add a failure test for <code>DatHangService</code>: stock 1, order 2, assert that <code>donSpring</code> is empty afterwards. Run it with and without the <code>MongoTransactionManager</code> bean.</li>
<li>Write a migration (mongosh) that converts every string <code>gia</code> in <code>spSpring</code> to Decimal128, run it after <code>chay.sh decimal --spring.data.mongodb.representation.big-decimal=string</code>, and check with <code>$type</code>.</li>
<li>Change the bulk experiment to execute the 20,000 updates in batches of 2,000. How many commands does the driver send, and how does the time compare?</li>
<li>Explain why <code>repo.saveAll()</code> of 20,000 <em>new</em> products sent only one insert but 20,000 <em>existing</em> products sent 20,000 updates. What does Spring need to do for each existing entity that it cannot do in one insert?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Without the bean the test fails (one order D… remains, as in block 2); with the bean it passes. Keep this test forever — it protects against someone removing the bean or calling the method from inside the same class.</p>
<p>2. <code>db.spSpring.updateMany({ gia: { $type: 'string' } }, [{ $set: { gia: { $toDecimal: '$gia' } } }])</code>, then <code>db.spSpring.aggregate([{ $group: { _id: { $type: '$gia' }, n: { $sum: 1 } } }])</code> shows only <code>decimal</code>. Run it before switching the application back to the default.</p>
<p>3. Ten commands of 2,000 operations each (each <code>execute()</code> is one bulk write; the driver splits a batch further only above 100,000 operations or 48 MB). The time stays in the same order of magnitude as one batch — the cost is per command, and ten is still tiny compared with 20,000.</p>
<p>4. For an existing entity with <code>@Version</code>, save() must replace that document <em>only if</em> its version still matches and fail otherwise — a per-document conditional replace with its own result, which cannot be expressed as one insert. New entities need no condition, so they can be inserted in one batch.</p>
</details>
<p><strong>Done when:</strong> your Spring service has a transaction manager and a failure test, money is Decimal128 by explicit configuration, and no batch job updates documents in a save() loop.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['MongoTransactionManager', 'Spring PlatformTransactionManager for MongoDB; without this bean @Transactional does not cover MongoDB operations.'],
  ['TransientTransactionError', 'Error label on aborted transactions (e.g. WriteConflict) meaning "retry the whole transaction"; Spring does not retry by itself.'],
  ['BigDecimal representation', 'How Spring Data stores BigDecimal: Decimal128 (BSON decimal) or string; set it explicitly.'],
  ['BulkOperations', 'MongoTemplate API that sends many insert/update/delete operations in one bulk write command.'],
  ['Write-concern wait', 'Time each acknowledged write waits for journal/majority; paid per command, so batching amortises it.'],
  ['Auditing', '@CreatedDate, @LastModifiedDate, @CreatedBy filled automatically with @EnableMongoAuditing.'],
  ['@Version', 'Optimistic locking field; stale save ⇒ OptimisticLockingFailureException; null version ⇒ treated as new (insert).'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Declare a MongoTransactionManager bean, keep a failure test, and retry TransientTransactionError yourself.</li>
<li>Money: BigDecimal ⇄ Decimal128, configured explicitly; string prices sort and compare wrongly without any error.</li>
<li>Many updates: bulkOps or updateMulti — saveAll on existing entities is one command per document, each paying the write-concern wait.</li>
<li>Bulk and raw writes skip the entity lifecycle — set version and defaults yourself.</li>
<li>Auditing fills timestamps; @Version turns silent overwrites into OptimisticLockingFailureException (409).</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Spring Data MongoDB sau phần cơ bản: transaction, Decimal128, ghi lô và auditing</h2>
<p class="lead">Khoá Spring Boot đã dạy Spring Data MongoDB từ số 0 — starter, <code>spring.mongodb.uri</code>, record <code>@Document</code>, repository, <code>MongoTemplate</code>, chuyện mất cập nhật của <code>save()</code>, explain, aggregation và Testcontainers. Hãy đọc các bài đó trước. Bài này đi tiếp từ chỗ chúng dừng, với bốn chủ đề quyết định backend Spring + MongoDB có đúng khi chịu tải hay không: transaction, tiền, ghi lô và auditing. Mọi kết quả dưới đây sinh ra từ ứng dụng nhỏ trong <code>_demo/spring/</code> (Spring Boot 4.1.2, Spring Data MongoDB 5.1.2, driver Java 5.8.1) chạy với lab.</p>
${lienKet({ khoa: 'spring-boot', bai: 'sb-20-2-spring-data-mongo', title: 'Spring Boot 20.2 — Spring Data MongoDB', sub: 'Starter, @Document, repository, MongoTemplate, save() thay cả tài liệu' })}
${lienKet({ khoa: 'spring-boot', bai: 'sb-20-3-mongo-query-index', title: 'Spring Boot 20.3 — Truy vấn, index, aggregation, phân trang', sub: 'explain() từ Spring, @Indexed so với index tường minh, phân trang keyset' })}

<h3>Hình ảnh đời thường: con dấu của kiểm soát viên ngân hàng</h3>
<p>Một chi nhánh ngân hàng có luật: "mọi lệnh chuyển tiền phải có dấu của kiểm soát viên". Luật in trên tường — nhưng nếu chi nhánh chưa từng tuyển kiểm soát viên, giao dịch viên vẫn xử lý lệnh chuyển không có dấu, và không ai để ý cho tới đợt kiểm toán. <code>@Transactional</code> là luật trên tường. Bean <code>MongoTransactionManager</code> là kiểm soát viên. Spring Boot tự cấu hình trình quản lý transaction cho JPA, nhưng không cho MongoDB: thiếu bean thì chú thích không áp vào đâu cả.</p>

<h3>Ứng dụng</h3>
${ma('java', SP)}
<p>Chạy thí nghiệm nào cũng bằng <code>spring/chay.sh &lt;decimal|tx|bulk|audit&gt;</code>; script chạy các lớp đã biên dịch với thư viện Maven đã tải (đầu tệp <code>chay.sh</code> ghi lệnh dựng một lần).</p>

<h3>1. @Transactional cần MongoTransactionManager</h3>
${ma('java', SV)}
<p>Ba đơn trên tồn kho 3 — cùng kịch bản với Bài 8.3, giờ bằng Java:</p>
${lenh(K, 2)}
${lenh(K, 3)}
<p>Thiếu bean, D2 ném "hết hàng" và Spring báo ngoại lệ — nhưng đơn của nó <strong>vẫn nằm trong database</strong>: chẳng có transaction nào bắt đầu, mỗi lệnh <code>MongoTemplate</code> tự commit. Không cảnh báo lúc khởi động, không lỗi lúc chạy. Có bean (ở đây bật bằng <code>--mgo.tx=true</code>), cùng đoạn mã đó hoàn tác D2. Thêm hai điều kiện: máy chủ phải là replica set hoặc cụm shard (Bài 6.2 — lab là replica set), và với máy chủ đời cũ collection phải có sẵn trước transaction, nên hãy tạo chúng lúc khởi động. Và để ý điều Spring <em>không</em> làm: thử lại. Khi tranh chấp, máy chủ hủy transaction với <code>WriteConflict</code> mang nhãn <code>TransientTransactionError</code>; <code>withTransaction</code> của driver (và Mongoose, Bài 8.3) tự thử lại, còn <code>@Transactional</code> của Spring chỉ ném lỗi. Lab của chương này đo xem điều đó nghĩa là gì với 40 đơn đồng thời.</p>
${nguon('📘', 'Sessions & Transactions — Spring Data MongoDB', 'MongoTransactionManager là cửa vào cơ chế transaction của Spring; nó gắn một ClientSession vào luồng đang chạy', 'https://docs.spring.io/spring-data/mongodb/reference/mongodb/client-session-transactions.html')}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — transaction không tồn tại, trong một bài test vẫn xanh.</strong> Test tích hợp thường kiểm đường đẹp: tạo đơn, kho giảm — xanh dù có hay không trình quản lý transaction. Hãy viết rõ bài test thất bại: ép bước thứ hai hỏng và khẳng định tài liệu của bước một <em>không</em> tồn tại. Chỉ một bài test đó bắt được thiếu bean, thiếu <code>@Transactional</code>, và lỗi tự gọi (gọi một phương thức <code>@Transactional</code> từ phương thức khác cùng lớp là đi vòng qua proxy của Spring).</p>
</div>

<h3>2. BigDecimal: Decimal128 hay chuỗi?</h3>
${lenh(K, 0)}
${lenh(K, 1)}
<p>Với Spring Data MongoDB 5.1, mặc định lưu <code>BigDecimal</code> thành BSON <code>decimal</code> (Decimal128): sắp theo giá ra 25.000,50 &lt; 99.000 &lt; 450.000 và <code>gia &gt; 100000</code> tìm được một sản phẩm. Lần chạy thứ hai dùng một thuộc tính, <code>spring.data.mongodb.representation.big-decimal=string</code> — cách biểu diễn các bản Spring Data cũ dùng, và cũng là cách trang mapping của tài liệu Spring Data vẫn mô tả (<em>"BigDecimal, which is represented as String instead of Decimal128"</em>). Giờ giá là chuỗi: sắp xếp so từng ký tự nên "450000" &lt; "99000", còn <code>gia &gt; 100000</code> trả <strong>cả ba</strong> sản phẩm, vì so chuỗi với số thập phân đi theo thứ tự kiểu BSON (Bài 1.2), không theo giá trị số. Không có ngoại lệ nào — chỉ có báo cáo sai và bộ lọc sai.</p>
${nguon('📘', 'Object Mapping — Spring Data MongoDB', '@Field(targetType=…) hữu ích … như với BigDecimal, vốn được biểu diễn thành String thay vì Decimal128', 'https://docs.spring.io/spring-data/mongodb/reference/mongodb/mapping/mapping.html')}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — hai cách biểu diễn trong một collection.</strong> Dự án nâng cấp từ Spring Boot cũ, hoặc còn một dịch vụ cũ đang ghi, sẽ có giá chỗ là chuỗi chỗ là Decimal128. Truy vấn lặng lẽ chỉ khớp một loại. Trước khi tin vào mặc định, kiểm dữ liệu của bạn: <code>db.products.aggregate([{ $group: { _id: { $type: '$gia' }, n: { $sum: 1 } } }])</code>. Ghi rõ lựa chọn trong cấu hình (thuộc tính ở trên, hoặc <code>@Field(targetType = FieldType.DECIMAL128)</code> trên trường), di trú tài liệu cũ bằng update pipeline dùng <code>$toDecimal</code>, và thêm luật <code>$jsonSchema</code> <code>bsonType: 'decimal'</code> để không gì ghi chuỗi được nữa.</p>
</div>

<h3>3. Ghi lô: một lệnh thay vì hai mươi nghìn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">repo.saveAll(20.000 đã có)</span><span class="lz-t">20.000 lệnh</span><span class="lz-d">mỗi lệnh: thay có điều kiện theo _id + version → chờ journal (w: majority) → trả lời</span></div>
  <div class="lz-step"><span class="lz-k">bulkOps … execute()</span><span class="lz-t">1 lệnh</span><span class="lz-d">20.000 updateOne trong một lệnh ghi lô → một lần chờ write concern cho cả lô</span></div>
  <div class="lz-step"><span class="lz-k">updateMulti(query, update)</span><span class="lz-t">1 lệnh, 1 thao tác</span><span class="lz-d">khi cùng một lệnh cập nhật áp được cho mọi tài liệu (vd +1 cho mọi giá)</span></div>
</div>
${ma('java', BULK)}
${lenh(K, 5)}
<p>Chèn 20.000 sản phẩm <em>mới</em> thì cả ba cách đều nhanh — Spring và driver gom tài liệu mới vào một lệnh <code>insert</code>. Sửa chúng thì không: <code>repo.saveAll()</code> trên entity đã có gửi <strong>20.000 lệnh update riêng</strong> và mất cỡ hai phút; một lô <code>BulkOperations</code> gửi một lệnh và mất khoảng một giây. Vì sao mỗi lệnh riêng lại đắt thế? Khối cuối đo trực tiếp trong mongosh:</p>
${lenh(K, 6)}
<p>Với write concern mặc định <code>majority</code>, mỗi lệnh chờ tới khi lần ghi nằm trong journal trên đĩa (với replica set một máy, majority nghĩa là "máy này, đã ghi journal") — vài mili giây mỗi lệnh; <code>w: 1, j: true</code> tốn tương đương, còn chỉ <code>w: 1</code> thì chưa tới một mili giây. Lệnh ghi lô trả khoản chờ đó một lần cho cả lô. Vậy: với job đụng nhiều tài liệu — cập nhật giá, nhập dữ liệu, tính lại — dùng <code>bulkOps</code> (hoặc <code>updateMulti</code> khi một lệnh cập nhật áp được cho tất cả), không dùng vòng <code>save()</code>. Đừng "chữa" bằng cách hạ write concern; đó là đổi tốc độ lấy rollback của Bài 6.3.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — bulkOps bỏ qua vòng đời entity.</strong> Nhìn <code>SP0</code> sau lần chèn lô: auditing đã điền ngày, nhưng <strong>không có trường <code>version</code></strong>. Khi ứng dụng sau đó nạp nó và gọi <code>repo.save()</code>, Spring thấy <code>version == null</code>, kết luận entity là mới và gửi <code>insert</code> — <code>DuplicateKeyException</code>. Nếu ghi bằng bulk operations hay template thô, hãy đặt mọi trường mà vòng đời entity sẽ đặt (version 0, giá trị mặc định), nếu không lần <code>save()</code> kế tiếp sẽ hỏng.</p>
</div>

<h3>4. Auditing và @Version</h3>
${lenh(K, 4)}
<p><code>@EnableMongoAuditing</code> điền <code>taoLuc</code> và <code>suaLuc</code> ở lần save đầu và chỉ cập nhật <code>suaLuc</code> ở lần thứ hai — không còn mốc thời gian viết tay rải rác trong các service (thêm <code>@CreatedBy</code> cùng bean <code>AuditorAware</code> để ghi ai làm). <code>@Version</code> làm bản sao cũ hỏng: tab 1 lưu version 0 → 1, tab 2 vẫn giữ version 0 nên nhận <code>OptimisticLockingFailureException</code> thay vì lặng lẽ đè giá mới bằng giá cũ. Đây là cách sửa vụ mất cập nhật mà khoá Spring Boot đã đo với <code>save()</code>; ánh xạ ngoại lệ này thành HTTP 409. Dòng cuối là cùng cái bẫy ở trên nhìn từ phía kia: một object mới với <code>_id</code> đã có và không có version là lệnh chèn, không phải cập nhật.</p>
${lienKet({ khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Khoá lạc quan và bi quan', sub: '@Version và OptimisticLockException phía JPA' })}

<h3>💼 Đi làm: "job tính giá đêm chạy bốn tiếng"</h3>
<p>Dịch vụ Spring của một khách bán lẻ tính lại giá mỗi đêm: <code>findAll()</code>, sửa từng sản phẩm bằng Java, <code>saveAll()</code>. Với 2 triệu sản phẩm và replica set trải hai vùng, mỗi lệnh cập nhật chờ xác nhận majority qua mạng — hàng giờ, và job chồng lên lưu lượng buổi sáng. Cách sửa của bạn: đọc bằng con trỏ (<code>mongo.stream(query, SanPham.class)</code>) thay vì <code>findAll()</code>, gom các thao tác <code>updateOne</code> vào <code>bulkOps</code> 1.000–5.000 cái, thực thi từng lô, và làm job lũy đẳng bằng trường đánh dấu (Bài 6.1) để sự cố giữa chừng chạy tiếp được. Đo trước và sau trên bản sao staging và ghi cả hai con số vào ticket.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"@Transactional có chạy với MongoDB ngay khi dùng Spring Boot không?"</strong> — Không; phải khai báo bean MongoTransactionManager, và máy chủ phải là replica set hoặc cụm shard.</li>
<li><strong>"Spring có tự thử lại transaction MongoDB khi WriteConflict không?"</strong> — Không; bắt lỗi mang nhãn TransientTransactionError và chạy lại cả phương thức transaction, có giới hạn số lần.</li>
<li><strong>"Lưu tiền vào MongoDB từ Java thế nào?"</strong> — BigDecimal ánh xạ sang Decimal128, cấu hình rõ ràng; không bao giờ double, và kiểm dữ liệu cũ xem có giá trị chuỗi không.</li>
<li><strong>"Cập nhật 100.000 tài liệu hiệu quả thế nào?"</strong> — updateMulti nếu một lệnh áp được cho tất cả, không thì BulkOperations theo lô; không dùng vòng save() — mỗi lệnh trả khoản chờ write concern.</li>
<li><strong>"@Version chạy thế nào trong Spring Data MongoDB?"</strong> — save() lọc theo version đã nạp và tăng nó; không khớp ⇒ OptimisticLockingFailureException; version null nghĩa là chèn mới.</li>
</ul>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm bài test thất bại cho <code>DatHangService</code>: tồn 1, đặt 2, khẳng định <code>donSpring</code> rỗng sau đó. Chạy khi có và khi không có bean <code>MongoTransactionManager</code>.</li>
<li>Viết bước di trú (mongosh) đổi mọi <code>gia</code> dạng chuỗi trong <code>spSpring</code> thành Decimal128, chạy sau <code>chay.sh decimal --spring.data.mongodb.representation.big-decimal=string</code>, và kiểm bằng <code>$type</code>.</li>
<li>Sửa thí nghiệm ghi lô để thực thi 20.000 lệnh cập nhật theo lô 2.000. Driver gửi bao nhiêu lệnh, thời gian so thế nào?</li>
<li>Giải thích vì sao <code>repo.saveAll()</code> 20.000 sản phẩm <em>mới</em> chỉ gửi một lệnh insert mà 20.000 sản phẩm <em>đã có</em> lại gửi 20.000 lệnh update. Với mỗi entity đã có, Spring cần làm gì mà một lệnh insert không làm được?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Thiếu bean thì test đỏ (còn lại một đơn, như khối 2); có bean thì xanh. Giữ bài test này mãi — nó bảo vệ khỏi việc ai đó xoá bean hay gọi phương thức từ bên trong cùng lớp.</p>
<p>2. <code>db.spSpring.updateMany({ gia: { $type: 'string' } }, [{ $set: { gia: { $toDecimal: '$gia' } } }])</code>, rồi <code>db.spSpring.aggregate([{ $group: { _id: { $type: '$gia' }, n: { $sum: 1 } } }])</code> chỉ còn <code>decimal</code>. Chạy nó trước khi đưa ứng dụng về mặc định.</p>
<p>3. Mười lệnh, mỗi lệnh 2.000 thao tác (mỗi <code>execute()</code> là một lệnh ghi lô; driver chỉ chia nhỏ thêm khi lô vượt 100.000 thao tác hoặc 48 MB). Thời gian vẫn cùng cỡ với một lô — chi phí tính theo lệnh, và mười vẫn là quá ít so với 20.000.</p>
<p>4. Với entity đã có và có <code>@Version</code>, save() phải thay tài liệu đó <em>chỉ khi</em> version còn khớp và báo hỏng nếu không — một lệnh thay có điều kiện cho từng tài liệu với kết quả riêng, không gói được vào một lệnh insert. Entity mới không cần điều kiện, nên chèn được theo một lô.</p>
</details>
<p><strong>Xong khi:</strong> dịch vụ Spring của bạn có trình quản lý transaction và bài test thất bại, tiền là Decimal128 do cấu hình ghi rõ, và không job nào cập nhật tài liệu bằng vòng save().</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['MongoTransactionManager', 'PlatformTransactionManager của Spring cho MongoDB; thiếu bean này @Transactional không bao các thao tác MongoDB.'],
  ['TransientTransactionError', 'Nhãn lỗi trên transaction bị hủy (vd WriteConflict) nghĩa là "chạy lại cả transaction"; Spring không tự thử lại.'],
  ['Cách biểu diễn BigDecimal', 'Spring Data lưu BigDecimal thế nào: Decimal128 (BSON decimal) hay chuỗi; hãy ghi rõ.'],
  ['BulkOperations', 'API của MongoTemplate gửi nhiều thao tác insert/update/delete trong một lệnh ghi lô.'],
  ['Khoản chờ write concern', 'Thời gian mỗi lần ghi có xác nhận chờ journal/majority; tính theo lệnh, nên gom lô sẽ chia nhỏ nó.'],
  ['Auditing', '@CreatedDate, @LastModifiedDate, @CreatedBy được điền tự động khi có @EnableMongoAuditing.'],
  ['@Version', 'Trường khoá lạc quan; save bản cũ ⇒ OptimisticLockingFailureException; version null ⇒ coi là mới (chèn).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Khai báo bean MongoTransactionManager, giữ một bài test thất bại, và tự thử lại TransientTransactionError.</li>
<li>Tiền: BigDecimal ⇄ Decimal128, cấu hình rõ ràng; giá dạng chuỗi sắp và so sai mà không báo lỗi.</li>
<li>Nhiều cập nhật: bulkOps hoặc updateMulti — saveAll trên entity đã có là một lệnh mỗi tài liệu, lệnh nào cũng trả khoản chờ write concern.</li>
<li>Ghi lô và ghi thô bỏ qua vòng đời entity — tự đặt version và giá trị mặc định.</li>
<li>Auditing điền mốc thời gian; @Version biến việc đè lặng lẽ thành OptimisticLockingFailureException (409).</li>
</ul>
</div>
`,
};
