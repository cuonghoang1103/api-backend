/**
 * 3.1 — Nhúng hay tham chiếu? Thiết kế theo cách ứng dụng đọc (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s03-1-nhung'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s03/s03-1-nhung.txt — tự nạp lại CT Shop,
 * tạo database ch3). Số đối chiếu: 4000 vs 2000 lượt gọi; 91/91 đơn lệch nếu tính theo giá mới; đổi email = sửa 13 đơn (KH0042);
 * cỡ đơn TB 425 byte, lớn nhất 610. Thời gian ms đổi theo lần chạy ⇒ lời chỉ nêu thứ tự nhanh/chậm.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '3.1 — Embed or reference? Design for how the app reads|||3.1 — Nhúng hay tham chiếu? Thiết kế theo cách ứng dụng đọc',
  slug: 'mgo-3-1-nhung-hay-tham-chieu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Quyết định đầu tiên và quan trọng nhất khi thiết kế MongoDB: dữ liệu nằm chung một tài liệu hay tách collection rồi tham chiếu. Đo thật ba cách dựng trang chi tiết đơn (hai truy vấn, $lookup, nhúng sẵn), nhúng như ảnh chụp lịch sử (đổi giá không làm sai 91 đơn cũ), cái giá khi chép dữ liệu hay đổi (một lần đổi email = sửa 13 đơn), bảng câu hỏi quyết định, so với chuẩn hoá SQL và bẫy "thiết kế MongoDB như thiết kế bảng".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Embed or reference? Design for how the app reads</h2>
<p class="lead">In SQL you normalise first and worry about queries later: one fact in one place, joins put things back together. MongoDB turns the order around. You start from the <em>screens and API calls</em> the application serves, and you shape documents so the frequent ones need one read. Every relationship then becomes one question: do these pieces live in the same document (embed) or in different collections, linked by an id (reference)? This lesson measures both on CT Shop and gives you a checklist you can defend in a design review.</p>

<h3>An everyday picture: the printed receipt and the table number</h3>
<p>At a phở shop, the kitchen ticket says "table 7: two large bowls" — a <em>reference</em>. The cashier has to look up table 7 to know who is sitting there, and if the customer moves table the ticket follows automatically. The printed receipt you take home is different: it copies the dish names, prices and the total <em>at that moment</em> — an <em>embedded snapshot</em>. If the shop raises the price tomorrow, your receipt must not change. Both are correct; they answer different questions. Schema design is deciding, for every piece of data, whether the application needs a ticket or a receipt.</p>

<h3>The rule MongoDB itself states</h3>
<p>The MongoDB data-modeling docs put it in one sentence: <strong>data that is accessed together should be stored together</strong>. The blog post that gave the community its vocabulary — "6 Rules of Thumb for MongoDB Schema Design" (MongoDB blog, June 2014, updated 2022) — opens with "favor embedding unless there is a compelling reason not to", and immediately lists the compelling reasons: the object must be accessed on its own, the array would grow without bound, or the copied data changes often. Everything in this chapter is an expansion of those three exceptions.</p>
${nguon('📘', 'Data Modeling — MongoDB Docs', 'Embedded vs referenced data, "stored together", schema design process', 'https://www.mongodb.com/docs/manual/data-modeling/')}
${nguon('📝', '6 Rules of Thumb for MongoDB Schema Design — MongoDB blog (2014)', 'One-to-few / many / squillions and the six rules', 'https://www.mongodb.com/company/blog/mongodb/6-rules-of-thumb-for-mongodb-schema-design')}

<h3>Start from the workload, not from the entities</h3>
<p>Before drawing any document, write the table a senior engineer will ask for: the operations, how often each runs, and what each must return. For CT Shop:</p>
<table>
<thead><tr><th>Operation</th><th>Frequency (estimate)</th><th>Needs</th></tr></thead>
<tbody>
<tr><td>Order detail page</td><td>very high (every customer, every order)</td><td>order + lines + customer name</td></tr>
<tr><td>Product page</td><td>very high</td><td>product + latest reviews + rating</td></tr>
<tr><td>Place an order</td><td>medium</td><td>stock of each product, write one order</td></tr>
<tr><td>Change product price</td><td>low (a few per day)</td><td>one product</td></tr>
<tr><td>Customer changes e-mail</td><td>very low</td><td>one customer</td></tr>
<tr><td>Monthly revenue report</td><td>once a month</td><td>all orders of the month</td></tr>
</tbody></table>
<p>The reads dominate, and the order page is the hottest read. That single fact decides most of the design: an order document should contain everything the order page shows.</p>

<h3>Measured: three ways to build the order page</h3>
<p>The order page needs the order and the customer's name. CT Shop orders store only <code>customerId</code>. First, look at what we have, then build a copy where the customer's id and name are embedded (an aggregation with <code>$lookup</code> + <code>$out</code> — Chapter 5 explains the stages):</p>
${lenh('s03-1-nhung', 0)}
${lenh('s03-1-nhung', 1)}
<p>Now render all 2,000 order pages three ways: (A) two queries per page — order, then customer; (B) one aggregation with <code>$lookup</code>; (C) one <code>findOne</code> on the embedded copy:</p>
${lenh('s03-1-nhung', 2)}
<p>Read the round trips first: A needs 4,000 calls, B and C need 2,000. Then the time: C is the fastest, B pays for the join on the server, A pays for twice the round trips. The milliseconds change on every run (and are tiny here because mongosh runs <em>inside</em> the database container). In production the application talks to the database over a network: at a typical 0.5–1 ms round trip inside a data centre, A's extra 2,000 calls alone add one to two seconds of pure waiting for these 2,000 pages — before the database does any work. Round trips, not CPU, are what you design away.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A · reference + 2 queries</span><span class="lz-t">2 round trips per page</span><span class="lz-d">simple, always current data; latency × 2</span></div>
  <div class="lz-step"><span class="lz-k">B · reference + $lookup</span><span class="lz-t">1 round trip, join on server</span><span class="lz-d">current data; server does extra work on every read</span></div>
  <div class="lz-step"><span class="lz-k">C · embedded copy</span><span class="lz-t">1 round trip, 1 document</span><span class="lz-d">fastest read; the copy must be kept correct (or be a snapshot on purpose)</span></div>
</div>

<h3>Embedding as a snapshot: the receipt must not change</h3>
<p>The CT Shop seed already embeds the product name and price in each order line. That is not laziness — it is a business rule. Watch what happens when the price of SP002 goes up 20%:</p>
${lenh('s03-1-nhung', 3)}
${lenh('s03-1-nhung', 4)}
${lenh('s03-1-nhung', 5)}
<p>Order 1 still says 19,008,000 — what the customer actually paid. Now imagine the "pure reference" design, where order lines keep only <code>productId</code> and the price is looked up from <code>products</code> when the order is displayed:</p>
${lenh('s03-1-nhung', 6)}
<p>All 91 orders that contain SP002 would show a total that is not what was charged. Invoices, accounting exports and refunds would all be wrong. For historical facts (price at purchase, shipping address at purchase, tax rate at purchase), embedding a copy is the <em>correct</em> model, in MongoDB and in SQL alike — a relational <code>order_lines</code> table also stores <code>unit_price</code> instead of joining to the current price.</p>

<h3>When the copy hurts: data that keeps changing</h3>
<p>The opposite case. Suppose someone embeds the customer's e-mail in every order "so the order page does not need a lookup". The customer changes e-mail:</p>
${lenh('s03-1-nhung', 7)}
${lenh('s03-1-nhung', 8)}
${lenh('s03-1-nhung', 9)}
<p>One logical change became 13 document writes for KH0042 and would be 20 for KH0066 — and nothing guarantees they all happen: a crash between the first <code>updateOne</code> and the <code>updateMany</code> leaves the old address in some orders. Rule five of the 2014 post says exactly this: <strong>consider the read-to-write ratio</strong>. A field read on every page and changed once a year (customer name for display) is a good copy; a field that changes often, or whose staleness is harmful (e-mail used to send invoices), should be referenced and read from the source. Ask also: <em>does the order page even need it?</em> The invoice e-mail is needed by the mail job, not by the page.</p>

<h3>How big will the document get?</h3>
${lenh('s03-1-nhung', 10)}
<p>An embedded order averages 425 bytes and the largest is 610 — far from the 16 MB limit of Lesson 1.1, and small enough that thousands fit in the WiredTiger cache. Measure this with <code>$bsonSize</code> for every design you propose; Lesson 3.5 shows what happens when a document grows without limit.</p>

<h3>The decision checklist</h3>
<p>Ask these questions for every relationship, in this order. Write the answers down — they are the "why" column of your design document (project milestone 3).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Read together?</span><span class="lz-t">shown on the same screen / returned by the same API</span><span class="lz-d">yes ⇒ lean to embed · no ⇒ lean to reference</span></div>
  <div class="lz-step"><span class="lz-k">2 · Accessed on its own?</span><span class="lz-t">has its own page, own search, own permissions</span><span class="lz-d">yes ⇒ it needs its own collection (it may still be partly copied)</span></div>
  <div class="lz-step"><span class="lz-k">3 · How many?</span><span class="lz-t">few · hundreds · unbounded</span><span class="lz-d">few ⇒ embed array · hundreds ⇒ think · unbounded ⇒ never an array in the parent (3.2)</span></div>
  <div class="lz-step"><span class="lz-k">4 · Does the copied data change?</span><span class="lz-t">how often, and is stale data harmful?</span><span class="lz-d">rarely + harmless ⇒ copy with a refresh rule · often ⇒ reference</span></div>
  <div class="lz-step"><span class="lz-k">5 · Is it a historical fact?</span><span class="lz-t">price, address, tax at that moment</span><span class="lz-d">yes ⇒ embed a snapshot and never "refresh" it</span></div>
  <div class="lz-step"><span class="lz-k">6 · How big does the document get?</span><span class="lz-t">$bsonSize of the largest realistic case</span><span class="lz-d">kilobytes ⇒ fine · megabytes ⇒ split (3.3 subset, 3.5)</span></div>
</div>

<h3>Compared with SQL normalisation</h3>
<p>Normal forms (Lesson 3.4 of the PostgreSQL course) protect against update anomalies by storing each fact once. MongoDB does not reject that idea — the e-mail example above <em>is</em> an update anomaly. The difference is the default. SQL starts normalised and denormalises when measurements demand it (materialised views, cached columns). MongoDB starts from the access pattern and copies data on purpose, with a written rule for every copy. A good MongoDB schema still has one <em>source of truth</em> per fact; the copies are labelled as snapshots or caches.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-3-4-alter-chuan-hoa', title: 'PostgreSQL 3.4 — Evolving a schema & normalization', sub: 'Normal forms and update anomalies, from the relational side' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — MongoDB documents vs JSONB', sub: 'The same orders in both systems, the cost of copies measured' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — translating the ER diagram table by table.</strong> A team migrating from SQL creates one collection per table (<code>orders</code>, <code>order_lines</code>, <code>customers</code>, <code>products</code>) and rebuilds every page with three <code>$lookup</code> stages. They get MongoDB's weaknesses (no foreign keys, no join optimiser of PostgreSQL's quality) without its strength (one read per page). The opposite trap is just as common: "MongoDB means embed everything", until one document holds a customer, all orders and every review. Neither table-by-table nor all-in-one — start from the workload table, answer the six questions, measure the size.</p>
</div>

<h3>🕵️ Security angle: what you embed, you may leak</h3>
<p>Copying is also a data-exposure decision. A classic mistake is to embed the <em>whole</em> user document as the "author" of every post or order — including <code>passwordHash</code>, phone and address — and to return the stored document straight from the API. OWASP lists this class of bug as <strong>API3:2023 Broken Object Property Level Authorization</strong> (formerly "excessive data exposure"): the API returns properties the caller must not see, and the front end merely hides them. With embedding the leak multiplies: the hash is now copied into thousands of documents, in every backup, and survives the user's password change. Copy the minimum (<code>_id</code> and display name), and project fields explicitly in every API response. Chapter 9 returns to this.</p>
${nguon('🛡️', 'OWASP API Security Top 10 — API3:2023', 'Broken Object Property Level Authorization (excessive data exposure)', 'https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/')}

<h3>💼 At work: "here is our ER diagram, please move it to MongoDB"</h3>
<p>A typical outsourcing request: the client sends an ER diagram with 40 tables and asks the team to "port it to MongoDB". Converting tables to collections is the wrong first step. What a senior on the team does is ask for the <em>screens and API list</em> with expected traffic, then build the workload table above. In the review meeting, the conversation is about rows of that table ("the order page is 80% of reads, so the order document carries customer name and line snapshots"), not about entities. As an intern, bringing that table to your first design meeting is the fastest way to be taken seriously.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"When do you embed and when do you reference?"</strong> — Embed what is read together and bounded; reference what is accessed on its own, unbounded, or frequently changing. Always start from the access patterns.</li>
<li><strong>"Isn't duplicating data in MongoDB dangerous?"</strong> — Only when the copy is mutable and unmanaged. Snapshots (price at purchase) must be copies; caches (display name) need a refresh rule; frequently changing data is referenced.</li>
<li><strong>"Why not just use $lookup everywhere?"</strong> — It works, but every read pays for the join; if a page always needs the data, shaping the document to contain it is cheaper. $lookup is for occasional or analytical joins.</li>
<li><strong>"How do you know your documents won't get too big?"</strong> — State an upper bound for each array, and measure the largest realistic document with <code>$bsonSize</code>.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write the workload table for a feature you know well (for example a class timetable app: student view, teacher view, admin edits). Mark the top two reads.</li>
<li>In <code>ch3</code>, the order page also wants the product <em>category</em> on each line (Lesson 2.3 needed it). Decide: copy into each line, or look up? Apply the six questions and write one sentence per question.</li>
<li>Measure: add the category to every line of <code>ordersEmb</code> with an aggregation, then compare average and maximum <code>$bsonSize</code> before and after.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Example: "student views today's timetable" (thousands per day, needs class, room, teacher name) and "teacher views class list" (hundreds per day). Admin edits: a few per week. ⇒ The timetable entry embeds room and teacher display name; teacher profile stays referenced.</p>
<p>2. Read together: yes (reports, promotions). Accessed alone: the category is part of the product, which has its own collection — fine, we copy only the name. How many: one per line. Changes: almost never, and "category at purchase" is a reasonable historical fact. ⇒ Copy as a snapshot.</p>
<p>3. <code>db.ordersEmb.aggregate([{ $unwind: '$items' }, { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'p' } }, { $set: { 'items.category': { $first: '$p.category' } } }, { $unset: 'p' }, { $group: { _id: '$_id', doc: { $first: '$$ROOT' }, items: { $push: '$items' } } }, { $replaceWith: { $mergeObjects: ['$doc', { items: '$items' }] } }, { $out: 'ordersCat' }])</code>, then the <code>$bsonSize</code> aggregation of this lesson on <code>ordersCat</code>. Expect a few dozen bytes more per order — a cheap price for removing a join from every report.</p>
</details>
<p><strong>Done when:</strong> for any relationship you can say "embed" or "reference" and give the reason in one sentence that mentions a query.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Embedding', 'Storing related data inside the same document (sub-document or array). One read returns it.'],
  ['Referencing', 'Storing an id that points to a document in another collection; the application or $lookup resolves it.'],
  ['Access pattern / workload', 'The list of operations the application performs, with frequency and needed fields — the input of MongoDB schema design.'],
  ['Snapshot copy', 'A copy that records a fact at a moment (price at purchase); it must never be refreshed.'],
  ['Cache copy', 'A copy kept for read speed (display name); needs a written refresh rule.'],
  ['Read-to-write ratio', 'How often a field is read compared with how often it changes; high ratio ⇒ good candidate for copying.'],
  ['Round trip', 'One request–response between application and database; the main cost designing documents removes.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>MongoDB design starts from the workload table; "data accessed together is stored together".</li>
<li>Measured on 2,000 order pages: two queries = 4,000 round trips, $lookup and embedding = 2,000; the embedded read is fastest.</li>
<li>Historical facts must be embedded snapshots: referencing current prices would make all 91 SP002 orders wrong.</li>
<li>Copies of changing data multiply writes (13 orders for one e-mail change) and can go stale — reference them or define a refresh rule.</li>
<li>Six questions: read together? accessed alone? how many? does it change? historical? how big?</li>
<li>Copy the minimum: embedded data is returned, backed up and leaked together with its parent.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Nhúng hay tham chiếu? Thiết kế theo cách ứng dụng đọc</h2>
<p class="lead">Trong SQL, bạn chuẩn hoá trước rồi mới lo truy vấn sau: mỗi sự thật nằm ở một chỗ, phép join ghép chúng lại. MongoDB đảo ngược thứ tự đó. Bạn bắt đầu từ <em>các màn hình và lời gọi API</em> mà ứng dụng phục vụ, rồi nặn tài liệu sao cho những thao tác hay dùng chỉ cần một lần đọc. Khi đó mọi quan hệ quy về một câu hỏi: các mảnh dữ liệu này nằm chung một tài liệu (nhúng) hay ở các collection khác nhau, nối bằng id (tham chiếu)? Bài này đo cả hai cách trên CT Shop và đưa cho bạn một bảng câu hỏi để bảo vệ được thiết kế trong buổi review.</p>

<h3>Hình ảnh đời thường: tờ hoá đơn in sẵn và số bàn</h3>
<p>Ở quán phở, phiếu gửi bếp ghi "bàn 7: hai tô lớn" — đó là một <em>tham chiếu</em>. Thu ngân phải tra bàn 7 mới biết ai đang ngồi, và nếu khách đổi bàn thì phiếu tự đi theo. Tờ hoá đơn bạn mang về thì khác: nó chép tên món, giá và tổng tiền <em>tại thời điểm đó</em> — một <em>ảnh chụp nhúng</em>. Mai quán tăng giá thì hoá đơn của bạn cũng không được đổi theo. Cả hai đều đúng; chúng trả lời những câu hỏi khác nhau. Thiết kế schema là quyết định, với từng mảnh dữ liệu, ứng dụng cần một tờ phiếu hay một tờ hoá đơn.</p>

<h3>Luật do chính MongoDB phát biểu</h3>
<p>Tài liệu mô hình hoá dữ liệu của MongoDB gói lại trong một câu: <strong>dữ liệu được truy cập cùng nhau thì nên được cất cùng nhau</strong>. Bài blog đã cho cộng đồng bộ từ vựng này — "6 Rules of Thumb for MongoDB Schema Design" (blog MongoDB, tháng 6/2014, cập nhật 2022) — mở đầu bằng "ưu tiên nhúng, trừ khi có lý do thuyết phục để không nhúng", rồi liệt kê ngay các lý do thuyết phục: đối tượng cần được truy cập riêng, mảng sẽ phình không giới hạn, hoặc dữ liệu được chép hay thay đổi. Mọi thứ trong chương này là phần mở rộng của ba ngoại lệ đó.</p>
${nguon('📘', 'Data Modeling — MongoDB Docs', 'Dữ liệu nhúng và tham chiếu, "cất cùng nhau", quy trình thiết kế schema', 'https://www.mongodb.com/docs/manual/data-modeling/')}
${nguon('📝', '6 Rules of Thumb for MongoDB Schema Design — blog MongoDB (2014)', 'Một–vài / nhiều / vô số và sáu luật', 'https://www.mongodb.com/company/blog/mongodb/6-rules-of-thumb-for-mongodb-schema-design')}

<h3>Bắt đầu từ tải công việc, không phải từ thực thể</h3>
<p>Trước khi vẽ bất kỳ tài liệu nào, hãy viết cái bảng mà một kỹ sư có kinh nghiệm sẽ đòi xem: các thao tác, mỗi thao tác chạy bao lâu một lần, và mỗi thao tác phải trả về gì. Với CT Shop:</p>
<table>
<thead><tr><th>Thao tác</th><th>Tần suất (ước lượng)</th><th>Cần gì</th></tr></thead>
<tbody>
<tr><td>Trang chi tiết đơn</td><td>rất cao (mọi khách, mọi đơn)</td><td>đơn + các dòng + tên khách</td></tr>
<tr><td>Trang sản phẩm</td><td>rất cao</td><td>sản phẩm + đánh giá mới nhất + điểm</td></tr>
<tr><td>Đặt hàng</td><td>vừa</td><td>tồn kho từng sản phẩm, ghi một đơn</td></tr>
<tr><td>Đổi giá sản phẩm</td><td>thấp (vài lần mỗi ngày)</td><td>một sản phẩm</td></tr>
<tr><td>Khách đổi email</td><td>rất thấp</td><td>một khách</td></tr>
<tr><td>Báo cáo doanh thu tháng</td><td>mỗi tháng một lần</td><td>mọi đơn trong tháng</td></tr>
</tbody></table>
<p>Thao tác đọc áp đảo, và trang đơn hàng là thao tác đọc nóng nhất. Chỉ một sự thật đó đã quyết định phần lớn thiết kế: tài liệu đơn hàng nên chứa mọi thứ mà trang đơn hàng hiển thị.</p>

<h3>Đo thật: ba cách dựng trang đơn hàng</h3>
<p>Trang đơn hàng cần đơn và tên khách. Đơn của CT Shop chỉ lưu <code>customerId</code>. Trước hết xem ta đang có gì, rồi dựng một bản sao trong đó id và tên khách được nhúng vào (một aggregation dùng <code>$lookup</code> + <code>$out</code> — Chương 5 giải thích từng stage):</p>
${lenh('s03-1-nhung', 0)}
${lenh('s03-1-nhung', 1)}
<p>Giờ dựng cả 2.000 trang đơn theo ba cách: (A) hai truy vấn mỗi trang — đơn, rồi khách; (B) một aggregation có <code>$lookup</code>; (C) một <code>findOne</code> trên bản đã nhúng:</p>
${lenh('s03-1-nhung', 2)}
<p>Đọc số lượt gọi trước: A cần 4.000 lượt, B và C cần 2.000. Rồi tới thời gian: C nhanh nhất, B trả giá cho phép join trên máy chủ, A trả giá cho số lượt gọi gấp đôi. Số mili giây đổi theo mỗi lần chạy (và ở đây rất nhỏ vì mongosh chạy <em>ngay trong</em> container cơ sở dữ liệu). Ở production, ứng dụng nói chuyện với cơ sở dữ liệu qua mạng: với độ trễ thường gặp 0,5–1 ms mỗi lượt trong một trung tâm dữ liệu, riêng 2.000 lượt gọi thừa của A đã thêm một tới hai giây chờ suông cho 2.000 trang này — trước khi cơ sở dữ liệu làm bất cứ việc gì. Thứ bạn thiết kế để loại bỏ là số lượt gọi, không phải CPU.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A · tham chiếu + 2 truy vấn</span><span class="lz-t">2 lượt gọi mỗi trang</span><span class="lz-d">đơn giản, dữ liệu luôn mới; độ trễ × 2</span></div>
  <div class="lz-step"><span class="lz-k">B · tham chiếu + $lookup</span><span class="lz-t">1 lượt gọi, join trên máy chủ</span><span class="lz-d">dữ liệu mới; máy chủ làm thêm việc ở mỗi lần đọc</span></div>
  <div class="lz-step"><span class="lz-k">C · bản chép nhúng</span><span class="lz-t">1 lượt gọi, 1 tài liệu</span><span class="lz-d">đọc nhanh nhất; bản chép phải được giữ đúng (hoặc cố ý là ảnh chụp)</span></div>
</div>

<h3>Nhúng như một ảnh chụp: hoá đơn không được đổi</h3>
<p>Bộ dữ liệu CT Shop đã nhúng sẵn tên và giá sản phẩm vào mỗi dòng đơn. Đó không phải lười — đó là luật nghiệp vụ. Xem điều gì xảy ra khi giá SP002 tăng 20%:</p>
${lenh('s03-1-nhung', 3)}
${lenh('s03-1-nhung', 4)}
${lenh('s03-1-nhung', 5)}
<p>Đơn 1 vẫn ghi 19.008.000 — đúng số tiền khách đã trả. Giờ hãy tưởng tượng thiết kế "tham chiếu thuần", trong đó dòng đơn chỉ giữ <code>productId</code> còn giá thì tra từ <code>products</code> lúc hiển thị đơn:</p>
${lenh('s03-1-nhung', 6)}
<p>Cả 91 đơn có SP002 sẽ hiện tổng tiền khác với số đã thu. Hoá đơn, tệp xuất kế toán và hoàn tiền đều sai theo. Với sự thật lịch sử (giá lúc mua, địa chỉ giao lúc mua, thuế suất lúc mua), nhúng một bản chép mới là mô hình <em>đúng</em>, ở MongoDB cũng như ở SQL — bảng <code>order_lines</code> trong cơ sở dữ liệu quan hệ cũng lưu <code>unit_price</code> thay vì join sang giá hiện tại.</p>

<h3>Khi bản chép gây hại: dữ liệu cứ thay đổi</h3>
<p>Trường hợp ngược lại. Giả sử ai đó nhúng email khách vào mọi đơn "để trang đơn hàng khỏi phải tra". Khách đổi email:</p>
${lenh('s03-1-nhung', 7)}
${lenh('s03-1-nhung', 8)}
${lenh('s03-1-nhung', 9)}
<p>Một thay đổi về mặt logic thành 13 lần ghi tài liệu với KH0042, và sẽ là 20 với KH0066 — mà chẳng có gì đảm bảo tất cả đều diễn ra: tiến trình chết giữa <code>updateOne</code> đầu tiên và <code>updateMany</code> là còn địa chỉ cũ nằm trong một số đơn. Luật thứ năm của bài viết năm 2014 nói đúng điều này: <strong>hãy xét tỉ lệ đọc trên ghi</strong>. Một trường được đọc ở mọi trang và mỗi năm đổi một lần (tên khách để hiển thị) là bản chép tốt; một trường đổi thường xuyên, hoặc cũ đi là có hại (email dùng để gửi hoá đơn), nên được tham chiếu và đọc từ nguồn. Hỏi thêm: <em>trang đơn hàng có thật cần nó không?</em> Email gửi hoá đơn là thứ tác vụ gửi thư cần, không phải trang đơn hàng.</p>

<h3>Tài liệu sẽ lớn tới đâu?</h3>
${lenh('s03-1-nhung', 10)}
<p>Một đơn đã nhúng trung bình 425 byte, đơn lớn nhất 610 byte — còn rất xa giới hạn 16 MB của Bài 1.1, và đủ nhỏ để hàng nghìn đơn nằm vừa trong cache WiredTiger. Hãy đo bằng <code>$bsonSize</code> cho mọi thiết kế bạn đề xuất; Bài 3.5 cho thấy chuyện gì xảy ra khi một tài liệu phình không giới hạn.</p>

<h3>Bảng câu hỏi quyết định</h3>
<p>Hỏi những câu này với mọi quan hệ, theo đúng thứ tự. Viết câu trả lời ra — chúng chính là cột "vì sao" trong tài liệu thiết kế của bạn (mốc 3 của dự án).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đọc cùng nhau?</span><span class="lz-t">hiện trên cùng màn hình / trả về bởi cùng một API</span><span class="lz-d">có ⇒ nghiêng về nhúng · không ⇒ nghiêng về tham chiếu</span></div>
  <div class="lz-step"><span class="lz-k">2 · Được truy cập riêng?</span><span class="lz-t">có trang riêng, tìm kiếm riêng, quyền riêng</span><span class="lz-d">có ⇒ cần collection riêng (vẫn có thể chép một phần)</span></div>
  <div class="lz-step"><span class="lz-k">3 · Bao nhiêu?</span><span class="lz-t">vài · hàng trăm · không giới hạn</span><span class="lz-d">vài ⇒ mảng nhúng · hàng trăm ⇒ cân nhắc · không giới hạn ⇒ không bao giờ là mảng trong cha (3.2)</span></div>
  <div class="lz-step"><span class="lz-k">4 · Dữ liệu chép có đổi không?</span><span class="lz-t">bao lâu một lần, và dữ liệu cũ có gây hại không?</span><span class="lz-d">hiếm + vô hại ⇒ chép kèm luật làm mới · thường xuyên ⇒ tham chiếu</span></div>
  <div class="lz-step"><span class="lz-k">5 · Là sự thật lịch sử?</span><span class="lz-t">giá, địa chỉ, thuế tại thời điểm đó</span><span class="lz-d">có ⇒ nhúng ảnh chụp và không bao giờ "làm mới"</span></div>
  <div class="lz-step"><span class="lz-k">6 · Tài liệu lớn tới đâu?</span><span class="lz-t">$bsonSize của trường hợp lớn nhất có thật</span><span class="lz-d">vài KB ⇒ ổn · vài MB ⇒ tách ra (3.3 subset, 3.5)</span></div>
</div>

<h3>So với chuẩn hoá trong SQL</h3>
<p>Các dạng chuẩn (Bài 3.4 của khoá PostgreSQL) chống dị thường cập nhật bằng cách lưu mỗi sự thật đúng một lần. MongoDB không bác bỏ ý đó — ví dụ email ở trên <em>chính là</em> một dị thường cập nhật. Khác nhau ở điểm xuất phát. SQL bắt đầu từ chuẩn hoá và chỉ phi chuẩn hoá khi số đo đòi hỏi (materialized view, cột cache). MongoDB bắt đầu từ cách truy cập và chép dữ liệu có chủ đích, kèm một luật viết rõ cho mỗi bản chép. Một schema MongoDB tốt vẫn có đúng một <em>nguồn sự thật</em> cho mỗi dữ kiện; các bản chép được dán nhãn là ảnh chụp hay cache.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-3-4-alter-chuan-hoa', title: 'PostgreSQL 3.4 — Tiến hoá lược đồ & chuẩn hoá', sub: 'Dạng chuẩn và dị thường cập nhật, nhìn từ phía quan hệ' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — Document MongoDB và JSONB của PostgreSQL', sub: 'Cùng bộ đơn hàng ở cả hai hệ, đo cái giá của bản chép' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dịch sơ đồ ER từng bảng một.</strong> Một nhóm chuyển từ SQL sang tạo mỗi bảng một collection (<code>orders</code>, <code>order_lines</code>, <code>customers</code>, <code>products</code>) rồi dựng lại mọi trang bằng ba stage <code>$lookup</code>. Họ nhận đủ điểm yếu của MongoDB (không có khoá ngoại, không có bộ tối ưu join tầm cỡ PostgreSQL) mà không có điểm mạnh của nó (một lần đọc mỗi trang). Cái bẫy ngược lại cũng phổ biến không kém: "MongoDB nghĩa là nhúng hết", cho tới khi một tài liệu ôm cả khách, mọi đơn và mọi đánh giá. Không dịch từng bảng, cũng không gom tất cả vào một — hãy bắt đầu từ bảng tải công việc, trả lời sáu câu hỏi, đo kích thước.</p>
</div>

<h3>🕵️ Góc bảo mật: nhúng gì thì có thể lộ nấy</h3>
<p>Chép dữ liệu cũng là một quyết định về phơi bày dữ liệu. Một lỗi kinh điển là nhúng <em>nguyên</em> tài liệu người dùng làm "tác giả" của mọi bài viết hay đơn hàng — kèm cả <code>passwordHash</code>, số điện thoại, địa chỉ — rồi trả thẳng tài liệu đã lưu ra API. OWASP xếp loại lỗi này là <strong>API3:2023 Broken Object Property Level Authorization</strong> (trước đây gọi là "excessive data exposure"): API trả về các thuộc tính mà bên gọi không được thấy, giao diện chỉ giấu chúng đi. Với việc nhúng, chỗ rò còn nhân lên: chuỗi băm giờ được chép vào hàng nghìn tài liệu, nằm trong mọi bản sao lưu, và vẫn còn đó sau khi người dùng đổi mật khẩu. Hãy chép tối thiểu (<code>_id</code> và tên hiển thị), và chiếu trường tường minh trong mọi phản hồi API. Chương 9 sẽ quay lại chuyện này.</p>
${nguon('🛡️', 'OWASP API Security Top 10 — API3:2023', 'Broken Object Property Level Authorization (phơi bày dữ liệu quá mức)', 'https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/')}

<h3>💼 Đi làm: "đây là sơ đồ ER, chuyển giúp sang MongoDB"</h3>
<p>Một yêu cầu outsourcing điển hình: khách hàng gửi sơ đồ ER 40 bảng và nhờ đội "chuyển sang MongoDB". Đổi bảng thành collection là bước đầu tiên sai. Người có kinh nghiệm trong đội sẽ xin <em>danh sách màn hình và API</em> kèm lưu lượng dự kiến, rồi dựng bảng tải công việc như ở trên. Trong buổi review, câu chuyện xoay quanh từng dòng của bảng đó ("trang đơn hàng chiếm 80% lượt đọc, nên tài liệu đơn mang theo tên khách và ảnh chụp các dòng"), chứ không xoay quanh thực thể. Là thực tập sinh, mang cái bảng đó tới buổi thiết kế đầu tiên là cách nhanh nhất để được nhìn nhận nghiêm túc.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Khi nào nhúng, khi nào tham chiếu?"</strong> — Nhúng thứ được đọc cùng nhau và có giới hạn; tham chiếu thứ được truy cập riêng, không giới hạn, hoặc hay thay đổi. Luôn bắt đầu từ cách truy cập.</li>
<li><strong>"Chép trùng dữ liệu trong MongoDB không nguy hiểm sao?"</strong> — Chỉ nguy hiểm khi bản chép thay đổi được mà không ai quản. Ảnh chụp (giá lúc mua) bắt buộc phải là bản chép; cache (tên hiển thị) cần luật làm mới; dữ liệu đổi thường xuyên thì tham chiếu.</li>
<li><strong>"Sao không dùng $lookup ở khắp nơi cho xong?"</strong> — Được, nhưng mỗi lần đọc đều trả giá cho phép join; nếu một trang luôn cần dữ liệu đó thì nặn tài liệu chứa sẵn nó rẻ hơn. $lookup dành cho phép join thỉnh thoảng hoặc phân tích.</li>
<li><strong>"Sao bạn biết tài liệu sẽ không quá lớn?"</strong> — Ghi rõ giới hạn trên cho mỗi mảng, và đo tài liệu lớn nhất có thật bằng <code>$bsonSize</code>.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết bảng tải công việc cho một tính năng bạn biết rõ (ví dụ ứng dụng thời khoá biểu: màn sinh viên, màn giảng viên, quản trị sửa lịch). Đánh dấu hai thao tác đọc nhiều nhất.</li>
<li>Trong <code>ch3</code>, trang đơn hàng còn muốn có <em>loại hàng</em> (category) ở mỗi dòng (Bài 2.3 từng cần nó). Quyết định: chép vào từng dòng, hay tra? Áp dụng sáu câu hỏi và viết một câu cho mỗi câu hỏi.</li>
<li>Đo: thêm category vào mọi dòng của <code>ordersEmb</code> bằng một aggregation, rồi so <code>$bsonSize</code> trung bình và lớn nhất trước và sau.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. Ví dụ: "sinh viên xem lịch hôm nay" (hàng nghìn lượt mỗi ngày, cần lớp, phòng, tên giảng viên) và "giảng viên xem danh sách lớp" (hàng trăm lượt mỗi ngày). Quản trị sửa lịch: vài lần mỗi tuần. ⇒ Mục lịch nhúng phòng và tên hiển thị của giảng viên; hồ sơ giảng viên vẫn tham chiếu.</p>
<p>2. Đọc cùng nhau: có (báo cáo, khuyến mãi). Truy cập riêng: category thuộc sản phẩm, vốn có collection riêng — không sao, ta chỉ chép cái tên. Bao nhiêu: một cho mỗi dòng. Thay đổi: gần như không bao giờ, và "loại hàng lúc mua" là một sự thật lịch sử hợp lý. ⇒ Chép như ảnh chụp.</p>
<p>3. <code>db.ordersEmb.aggregate([{ $unwind: '$items' }, { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'p' } }, { $set: { 'items.category': { $first: '$p.category' } } }, { $unset: 'p' }, { $group: { _id: '$_id', doc: { $first: '$$ROOT' }, items: { $push: '$items' } } }, { $replaceWith: { $mergeObjects: ['$doc', { items: '$items' }] } }, { $out: 'ordersCat' }])</code>, rồi chạy aggregation <code>$bsonSize</code> của bài này trên <code>ordersCat</code>. Mỗi đơn chỉ nặng thêm vài chục byte — cái giá rẻ để bỏ một phép join khỏi mọi báo cáo.</p>
</details>
<p><strong>Xong khi:</strong> với bất kỳ quan hệ nào, bạn nói được "nhúng" hay "tham chiếu" và đưa ra lý do trong một câu có nhắc tới một truy vấn.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Nhúng (embedding)', 'Cất dữ liệu liên quan ngay trong cùng tài liệu (tài liệu con hoặc mảng). Một lần đọc trả về đủ.'],
  ['Tham chiếu (referencing)', 'Lưu một id trỏ tới tài liệu ở collection khác; ứng dụng hoặc $lookup phân giải nó.'],
  ['Cách truy cập / tải công việc (workload)', 'Danh sách thao tác ứng dụng thực hiện, kèm tần suất và các trường cần — đầu vào của thiết kế schema MongoDB.'],
  ['Bản chép ảnh chụp', 'Bản chép ghi lại một sự thật tại một thời điểm (giá lúc mua); không bao giờ được làm mới.'],
  ['Bản chép cache', 'Bản chép giữ để đọc nhanh (tên hiển thị); cần một luật làm mới viết rõ.'],
  ['Tỉ lệ đọc/ghi', 'Một trường được đọc thường xuyên thế nào so với tần suất nó thay đổi; tỉ lệ cao ⇒ ứng viên tốt để chép.'],
  ['Lượt gọi (round trip)', 'Một lần hỏi–đáp giữa ứng dụng và cơ sở dữ liệu; thứ chính mà việc nặn tài liệu loại bỏ.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Thiết kế MongoDB bắt đầu từ bảng tải công việc; "truy cập cùng nhau thì cất cùng nhau".</li>
<li>Đo trên 2.000 trang đơn: hai truy vấn = 4.000 lượt gọi, $lookup và nhúng = 2.000; đọc bản nhúng nhanh nhất.</li>
<li>Sự thật lịch sử phải là ảnh chụp nhúng: tham chiếu giá hiện tại sẽ làm sai cả 91 đơn có SP002.</li>
<li>Chép dữ liệu hay đổi làm số lần ghi nhân lên (13 đơn cho một lần đổi email) và có thể cũ đi — hãy tham chiếu, hoặc định ra luật làm mới.</li>
<li>Sáu câu hỏi: đọc cùng nhau? truy cập riêng? bao nhiêu? có đổi không? là lịch sử? lớn tới đâu?</li>
<li>Chép tối thiểu: dữ liệu nhúng bị trả về, sao lưu và rò rỉ cùng với tài liệu cha.</li>
</ul>
</div>
`,
};
