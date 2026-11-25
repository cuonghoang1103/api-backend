/**
 * 3.4 — Pattern II: bucket, outlier, polymorphic, schema versioning, cây (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s03-4-p2'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s03/s03-4-p2.txt, database ch3).
 * Số đối chiếu: 100.800 số đo lẻ vs 1.680 bucket vs time series; trung bình ngày 03/11 cùng 25.006, đọc 1440 vs 24 tài liệu;
 * outlier: SP010 nhúng 1000 + 3 tài liệu tràn (1000/1000/500), 14.825 byte; SP011 25 người; polymorphic: 2 lần lỗi 121;
 * versioning: 52 có phone / 148 không, di chuyển 4 lô sửa 199 (1 đã sửa lười); cây: 2 con, 2 cháu, đường dẫn 3, breadcrumb, $graphLookup độ sâu 0–2, dời nhánh sửa 2.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '3.4 — Patterns II: bucket, outlier, polymorphic, schema versioning, tree|||3.4 — Pattern II: bucket, outlier, polymorphic, schema versioning, cây',
  slug: 'mgo-3-4-pattern-2',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Năm pattern cho dữ liệu "khó": bucket (100.800 số đo cảm biến gom thành 1.680 tài liệu theo giờ, so với time series collection), outlier (một sản phẩm có 3.500 người mua trong khi số khác vài chục — nhúng 1000 rồi tràn), polymorphic (một collection nhiều hình dạng, validator theo từng loại), schema versioning (đổi phone thành phones không dừng hệ thống: đọc hai phiên bản, sửa lười, di chuyển theo lô), và bốn cách lưu cây danh mục (cha, tổ tiên, đường dẫn, $graphLookup).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Patterns II: bucket, outlier, polymorphic, schema versioning, tree</h2>
<p class="lead">The patterns of Lesson 3.3 decide <em>what to copy</em>. The five here handle data that does not fit the simple rules: millions of tiny measurements, one record a thousand times bigger than the rest, documents of different kinds side by side, a schema that has to change while the system keeps running, and hierarchies. Each one is run on real data below.</p>

<h3>An everyday picture</h3>
<p>An electricity meter reader does not file one sheet of paper per minute — they write one line per month with the total (bucket). A school class list fits on one page, except for the one class of 400 students in a lecture hall, which gets extra pages stapled on (outlier). A hospital's "patients" folder contains children, adults and newborns, each with different forms, in one drawer (polymorphic). When the ID card format changed, nobody had to replace every card on the same day — old and new cards were both valid while people renewed (schema versioning). And the library's catalogue is a tree: Science › Computing › Databases.</p>

<h3>Bucket: group many small measurements</h3>
<p>Ten temperature sensors, one reading per minute, for one week: 100,800 readings. Store them three ways — one document per reading (<code>doLe</code>), one document per sensor per hour holding 60 readings plus pre-computed <code>n, tong, min, max</code> (<code>doGom</code>), and MongoDB's built-in time series collection (<code>doTs</code>, Chapter 10):</p>
${lenh('s03-4-p2', 0)}
${lenh('s03-4-p2', 1)}
<p>The bucketed collection stores 60 times fewer documents, its index is about forty times smaller, and its storage is less than half — the field names <code>sensor</code> and <code>ts</code> are no longer repeated in every reading, and one index entry covers an hour instead of a minute. The time series collection goes further, because MongoDB does the bucketing <em>and</em> column-style compression for you. The query side:</p>
${lenh('s03-4-p2', 2)}
<p>Same average, 1,440 documents read versus 24 — and the bucket answer did not even look inside the readings, only at the pre-computed <code>tong</code> and <code>n</code> (bucket + computed together). Bucket when you write many small, time-ordered items and read them by range; choose the bucket size from the most common query (here: per hour, read per day). In MongoDB 5.0+ prefer a time series collection for pure measurements; hand-made buckets remain useful when each bucket also carries business data (an hour of a parking lot's entries with the cashier on duty).</p>
${nguon('📘', 'Group Data with the Bucket Pattern — MongoDB Docs', 'Grouping time-series-like data, bucket size, pre-computed fields', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/group-data/bucket-pattern/')}

<h3>Outlier: design for the normal case, handle the exception</h3>
<p>A book page lists its buyers ("people who bought this"). Most books have tens of buyers; one bestseller has thousands. Designing every book around the bestseller (a separate collection, an extra query on every page) penalises 99% of pages. The outlier pattern embeds up to a limit and overflows the rest into extra documents, flagged with <code>hasExtras</code>:</p>
${lenh('s03-4-p2', 3)}
${lenh('s03-4-p2', 4)}
<p>The update filter <code>'buyers.999': { $exists: false }</code> — "there is no element at index 999 yet" — makes the bound check and the push one atomic operation (Lesson 2.3's array-size trick, used as a guard). SP011 with 25 buyers is one small document as before. SP010 keeps 1,000 buyers inside (14,825 bytes) and 2,500 more in three overflow documents of at most 1,000 each, created by <code>upsert</code> when the last one is full. The page reads one document; only when <code>hasExtras</code> is true and the user clicks "see all" does it read the overflow.</p>

<h3>Polymorphic: one collection, several shapes, each one checked</h3>
<p>CT Shop already stores laptops, books, shirts, accessories and courses in one <code>products</code> collection — the catalogue, the search and the cart treat them all as "products", so they belong together. The risk is that "anything goes". A validator can express "if laptop then it must have <code>specs.ramGB</code>; if book then <code>author</code> and <code>pages</code>":</p>
${lenh('s03-4-p2', 5)}
${lenh('s03-4-p2', 6)}
${lenh('s03-4-p2', 7)}
<p>The <code>$or: [{ category: { $ne: 'laptop' } }, { 'specs.ramGB': … }]</code> form reads as "not a laptop, or a laptop with RAM" — the database-side version of an <code>if</code>. Keep a field that names the shape (<code>category</code>, often called the discriminator) in every document and index it. Mongoose has this built in as <em>discriminators</em> (Chapter 8).</p>

<h3>Schema versioning: change the shape without stopping the system</h3>
<p>Requirement: a customer can have several phone numbers with a type. v1 has <code>phone: '09…'</code>; v2 has <code>phones: [{ loai, so }]</code> and <code>schemaVersion: 2</code>. You cannot rewrite 200 (or 200 million) documents in the instant you deploy, so the application must read both shapes for a while:</p>
${lenh('s03-4-p2', 8)}
${lenh('s03-4-p2', 9)}
<p>The steps, in the order they ship:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · read both</span><span class="lz-t">docKhach() turns v1 into v2 in memory</span><span class="lz-d">deploy this first; nothing in the database changes yet</span></div>
  <div class="lz-step"><span class="lz-k">2 · write v2</span><span class="lz-t">every save writes the new shape</span><span class="lz-d">lazy migration: KH0001 became v2 when its phone was edited</span></div>
  <div class="lz-step"><span class="lz-k">3 · migrate in batches</span><span class="lz-t">50 at a time, filter schemaVersion ≠ 2</span><span class="lz-d">4 batches fixed 199 — the lazily migrated one was skipped, and a concurrent save is never overwritten</span></div>
  <div class="lz-step"><span class="lz-k">4 · remove v1 code</span><span class="lz-t">after a count of v1 = 0</span><span class="lz-d">then tighten the validator to require phones</span></div>
</div>
<p>The <code>schemaVersion: { $ne: 2 }</code> in the <code>replaceOne</code> filter matters: if the application saved the customer between the batch's read and its write, the filter no longer matches and the batch does not overwrite newer data with an older conversion. This is the same conditional-update idea as Lesson 2.5.</p>
${nguon('📘', 'Schema Versioning — MongoDB Docs', 'schemaVersion field, application handles both versions', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/data-versioning/schema-versioning/')}

<h3>Trees: four ways to store a category hierarchy</h3>
<p>CT Shop's menu: Điện tử › Máy tính › Laptop › Laptop gaming, Điện tử › Phụ kiện › Chuột, Sách › Sách cơ sở dữ liệu. Each node below stores three representations at once, to compare them: <code>cha</code> (parent reference), <code>toTien</code> (array of ancestors) and <code>duong</code> (materialised path).</p>
${lenh('s03-4-p2', 10)}
${lenh('s03-4-p2', 11)}
${lenh('s03-4-p2', 12)}
${lenh('s03-4-p2', 13)}
${lenh('s03-4-p2', 14)}
${lenh('s03-4-p2', 15)}
<table>
<thead><tr><th>Model</th><th>Children</th><th>All descendants</th><th>Breadcrumb</th><th>Move a subtree</th></tr></thead>
<tbody>
<tr><td>Parent reference <code>cha</code></td><td>one indexed query</td><td><code>$graphLookup</code> (recursive)</td><td>one query per level</td><td>1 update</td></tr>
<tr><td>Ancestors array <code>toTien</code></td><td>with <code>cha</code></td><td>one indexed query</td><td>one <code>$in</code> query</td><td>update every descendant</td></tr>
<tr><td>Materialised path <code>duong</code></td><td>regex on prefix</td><td>prefix regex (uses the index)</td><td>parse the string</td><td>rewrite every descendant</td></tr>
<tr><td>Child references (array of children)</td><td>in the node</td><td>recursive</td><td>hard</td><td>2 updates</td></tr>
</tbody></table>
<p>Menus and categories are read constantly and moved rarely ⇒ parent reference + ancestors array is the usual choice: children, descendants and breadcrumbs are all single indexed reads. Moving "Máy tính" under "Sách" had to rewrite the ancestor array of its two descendants (and the node itself) — fine for a menu, wrong for a structure that is reorganised every minute (then keep only <code>cha</code> and use <code>$graphLookup</code>). An anchored, case-sensitive prefix regex such as <code>/^,dien-tu,may-tinh,/</code> can use the index on <code>duong</code>; an unanchored one cannot.</p>
${nguon('📘', 'Model Tree Structures — MongoDB Docs', 'Parent references, child references, array of ancestors, materialized paths, nested sets', 'https://www.mongodb.com/docs/manual/tutorial/model-tree-structures/')}

<div class="pitfall co-tieu-de">
<p><strong>Trap — the migration script that "runs once on deploy".</strong> A team ships v2 and, in the same deploy, a script that converts all documents with one <code>updateMany</code>. During the minutes it runs, old application instances (rolling deploy) still write v1 documents, and the new instances crash on documents the script has not reached. Versioning is a sequence of deploys, not one: read both → write new → migrate in batches with a conditional filter → remove old code. Each step must be safe to run while the previous version of the application is still live.</p>
</div>

<h3>💼 At work: the IoT client and the 30-million-row collection</h3>
<p>A common OJT-level task on an outsourcing team: "the dashboard of the smart-farm project is slow". The collection has one document per sensor reading — tens of millions — and the dashboard draws daily charts. The fix that gets approved is not a bigger server: it is a migration to hourly buckets (or a time series collection) with pre-computed min/max/sum, done in batches with versioning so the farm devices never stop sending. The measurement you bring: documents read per chart before and after (the 1,440 → 24 of this lesson).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How would you store IoT readings in MongoDB?"</strong> — Bucket per device per time window with pre-computed aggregates, or a time series collection; never one tiny document per reading without a reason.</li>
<li><strong>"One customer has 100× more data than the others. What do you do?"</strong> — Outlier pattern: design for the typical case, overflow the exception into extra documents with a flag.</li>
<li><strong>"How do you change a schema in production without downtime?"</strong> — Schema version field, application reads both versions, writes the new one, batch migration with a conditional filter, then remove the old path.</li>
<li><strong>"How do you store a category tree?"</strong> — Parent reference plus ancestors array for read-heavy trees; parent reference + <code>$graphLookup</code> when the tree changes often.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Change the bucket to one document per sensor per <em>day</em>. How many documents? Is the per-day average query faster or slower to write? What about a "last 10 minutes" chart?</li>
<li>Add <code>accessory</code> to the polymorphic validator: an accessory must have <code>warrantyMonths</code> as an int in [0, 36].</li>
<li>Write <code>docKhach</code> for a v3 where <code>phones</code> also gets a <code>chinh: true</code> flag on the first number. Make it accept v1, v2 and v3.</li>
<li>With the ancestors model, write the query "all products in Máy tính and below", assuming each product stores <code>categoryId</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. 10 × 7 = 70 documents of 1,440 readings each. Per-day average reads one document. A "last 10 minutes" chart now loads a whole day (1,440 readings) to show 10 — bucket size follows the most common query, and a dashboard usually needs both: hourly buckets, or a time series collection.</p>
<p>2. Add <code>{ $or: [{ category: { $ne: 'accessory' } }, { warrantyMonths: { $type: 'int', $gte: 0, $lte: 36 } }] }</code> to the <code>$and</code> and <code>{ category: { $in: [..., 'accessory'] } }</code>; apply with <code>collMod</code> (Lesson 1.3).</p>
<p>3. <code>function docKhach(d) { if (d.schemaVersion === 3) return d; const v2 = d.schemaVersion === 2 ? d : { ...d, phones: d.phone ? [{ loai: 'di động', so: d.phone }] : [] }; delete v2.phone; return { ...v2, schemaVersion: 3, phones: v2.phones.map((p, i) => ({ ...p, chinh: i === 0 })) }; }</code></p>
<p>4. <code>const ids = db.dm.find({ $or: [{ _id: 'may-tinh' }, { toTien: 'may-tinh' }] }).toArray().map((d) =&gt; d._id); db.products.find({ categoryId: { $in: ids } })</code> — two indexed queries. (Or store the ancestor list in each product too — an extended reference.)</p>
</details>
<p><strong>Done when:</strong> given a new kind of data you can say which of the nine patterns of Lessons 3.3–3.4 applies, or why none does.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Bucket pattern', 'Group many small, ordered items (readings, events) into one document per key and time window, with pre-computed summaries.'],
  ['Time series collection', 'MongoDB 5.0+ collection type that buckets and compresses measurements automatically (Chapter 10).'],
  ['Outlier pattern', 'Design for the typical document; overflow the rare huge one into extra documents marked with a flag.'],
  ['Polymorphic pattern', 'Documents of different shapes in one collection because they are queried together; a discriminator field names the shape.'],
  ['Schema versioning', 'A version field plus code that reads every live version, so the schema can change without downtime.'],
  ['Lazy migration', 'Converting a document to the new shape when it is next written.'],
  ['Array of ancestors', 'Tree model where each node stores the ids of all its ancestors, in order.'],
  ['Materialised path', 'Tree model where each node stores its full path as a string, queried by prefix.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Bucket: 100,800 readings → 1,680 hourly documents; the daily average read 24 documents instead of 1,440.</li>
<li>Outlier: embed up to a bound (atomic guard <code>'arr.999': { $exists: false }</code>), overflow the rest, flag with <code>hasExtras</code>.</li>
<li>Polymorphic: one collection for things queried together, with a validator that checks each shape.</li>
<li>Schema versioning is a sequence: read both, write new, migrate in conditional batches, remove old code.</li>
<li>Trees: parent + ancestors for read-heavy hierarchies; <code>$graphLookup</code> when the tree changes often.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Pattern II: bucket, outlier, polymorphic, schema versioning, cây</h2>
<p class="lead">Các pattern của Bài 3.3 quyết định <em>chép cái gì</em>. Năm pattern ở đây xử lý thứ dữ liệu không khớp với luật đơn giản: hàng triệu số đo nhỏ xíu, một bản ghi lớn gấp nghìn lần phần còn lại, các tài liệu khác loại nằm cạnh nhau, một schema phải đổi trong khi hệ thống vẫn chạy, và các cấu trúc phân cấp. Mỗi pattern đều chạy trên dữ liệu thật dưới đây.</p>

<h3>Hình ảnh đời thường</h3>
<p>Người ghi số điện không lập mỗi phút một tờ giấy — họ ghi mỗi tháng một dòng với tổng số (bucket). Danh sách một lớp học vừa một trang giấy, trừ đúng một lớp 400 sinh viên học ở giảng đường, được ghim thêm trang (outlier). Tủ "bệnh nhân" của bệnh viện chứa cả trẻ em, người lớn và trẻ sơ sinh, mỗi loại một kiểu phiếu, trong cùng một ngăn (polymorphic). Khi mẫu căn cước đổi, chẳng ai phải thay mọi thẻ trong cùng một ngày — thẻ cũ và thẻ mới cùng hợp lệ trong lúc mọi người làm lại dần (schema versioning). Còn danh mục thư viện là một cái cây: Khoa học › Máy tính › Cơ sở dữ liệu.</p>

<h3>Bucket: gom nhiều số đo nhỏ</h3>
<p>Mười cảm biến nhiệt độ, mỗi phút một số đo, trong một tuần: 100.800 số đo. Lưu theo ba cách — mỗi số đo một tài liệu (<code>doLe</code>), mỗi cảm biến mỗi giờ một tài liệu chứa 60 số đo kèm <code>n, tong, min, max</code> tính sẵn (<code>doGom</code>), và time series collection có sẵn của MongoDB (<code>doTs</code>, Chương 10):</p>
${lenh('s03-4-p2', 0)}
${lenh('s03-4-p2', 1)}
<p>Collection đã gom có số tài liệu ít hơn 60 lần, index nhỏ hơn khoảng bốn mươi lần, và dung lượng lưu chưa tới một nửa — tên trường <code>sensor</code> và <code>ts</code> không còn lặp lại ở mỗi số đo, và một mục index phủ cả một giờ thay vì một phút. Time series collection còn đi xa hơn, vì MongoDB tự gom <em>và</em> nén kiểu theo cột cho bạn. Phía truy vấn:</p>
${lenh('s03-4-p2', 2)}
<p>Cùng một trung bình, đọc 1.440 tài liệu so với 24 — và bản bucket còn chẳng cần nhìn vào từng số đo, chỉ cần <code>tong</code> và <code>n</code> tính sẵn (bucket kết hợp computed). Dùng bucket khi bạn ghi nhiều mục nhỏ theo thời gian và đọc chúng theo khoảng; chọn cỡ bucket theo truy vấn hay gặp nhất (ở đây: gom theo giờ, đọc theo ngày). Từ MongoDB 5.0, với số đo thuần hãy ưu tiên time series collection; bucket tự làm vẫn có ích khi mỗi bucket còn mang dữ liệu nghiệp vụ (một giờ xe ra vào bãi kèm thu ngân trực ca).</p>
${nguon('📘', 'Group Data with the Bucket Pattern — MongoDB Docs', 'Gom dữ liệu dạng chuỗi thời gian, cỡ bucket, trường tính sẵn', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/group-data/bucket-pattern/')}

<h3>Outlier: thiết kế cho trường hợp thường, xử lý ngoại lệ riêng</h3>
<p>Trang sách liệt kê người đã mua ("những người đã mua cuốn này"). Phần lớn sách có vài chục người mua; một cuốn bán chạy có hàng nghìn. Thiết kế mọi cuốn sách theo cuốn bán chạy (collection riêng, thêm một truy vấn ở mọi trang) là phạt 99% số trang. Pattern outlier nhúng tới một giới hạn, phần dư tràn sang tài liệu phụ, đánh dấu bằng <code>hasExtras</code>:</p>
${lenh('s03-4-p2', 3)}
${lenh('s03-4-p2', 4)}
<p>Bộ lọc cập nhật <code>'buyers.999': { $exists: false }</code> — "chưa có phần tử ở chỉ số 999" — biến việc kiểm giới hạn và lệnh push thành một thao tác nguyên tử (mẹo kích thước mảng của Bài 2.3, dùng làm chốt chặn). SP011 với 25 người mua vẫn là một tài liệu nhỏ như cũ. SP010 giữ 1.000 người mua bên trong (14.825 byte) và 2.500 người nữa trong ba tài liệu tràn, mỗi cái tối đa 1.000, được tạo bằng <code>upsert</code> khi cái cuối đã đầy. Trang chỉ đọc một tài liệu; chỉ khi <code>hasExtras</code> là true và người dùng bấm "xem tất cả" mới đọc phần tràn.</p>

<h3>Polymorphic: một collection, nhiều hình dạng, cái nào cũng được kiểm</h3>
<p>CT Shop vốn đã lưu laptop, sách, áo, phụ kiện và khoá học trong một collection <code>products</code> — danh mục, tìm kiếm và giỏ hàng coi tất cả là "sản phẩm", nên chúng thuộc về nhau. Rủi ro là "cái gì cũng được". Một validator diễn đạt được "nếu là laptop thì phải có <code>specs.ramGB</code>; nếu là sách thì phải có <code>author</code> và <code>pages</code>":</p>
${lenh('s03-4-p2', 5)}
${lenh('s03-4-p2', 6)}
${lenh('s03-4-p2', 7)}
<p>Dạng <code>$or: [{ category: { $ne: 'laptop' } }, { 'specs.ramGB': … }]</code> đọc là "không phải laptop, hoặc là laptop có RAM" — phiên bản phía cơ sở dữ liệu của một câu <code>if</code>. Hãy giữ ở mọi tài liệu một trường gọi tên hình dạng (<code>category</code>, thường gọi là discriminator) và đánh index cho nó. Mongoose có sẵn tính năng này dưới tên <em>discriminator</em> (Chương 8).</p>

<h3>Schema versioning: đổi hình dạng mà không dừng hệ thống</h3>
<p>Yêu cầu: một khách có thể có nhiều số điện thoại kèm loại. Bản v1 có <code>phone: '09…'</code>; bản v2 có <code>phones: [{ loai, so }]</code> và <code>schemaVersion: 2</code>. Bạn không thể viết lại 200 (hay 200 triệu) tài liệu ngay khoảnh khắc triển khai, nên ứng dụng phải đọc được cả hai hình dạng trong một thời gian:</p>
${lenh('s03-4-p2', 8)}
${lenh('s03-4-p2', 9)}
<p>Các bước, theo đúng thứ tự đưa lên:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · đọc cả hai</span><span class="lz-t">docKhach() đổi v1 thành v2 trong bộ nhớ</span><span class="lz-d">triển khai bước này trước; cơ sở dữ liệu chưa đổi gì</span></div>
  <div class="lz-step"><span class="lz-k">2 · ghi v2</span><span class="lz-t">mỗi lần lưu đều ghi hình dạng mới</span><span class="lz-d">di chuyển lười: KH0001 thành v2 khi số điện thoại của nó được sửa</span></div>
  <div class="lz-step"><span class="lz-k">3 · di chuyển theo lô</span><span class="lz-t">mỗi lần 50, lọc schemaVersion ≠ 2</span><span class="lz-d">4 lô sửa 199 — bản đã di chuyển lười được bỏ qua, và lần lưu đồng thời không bao giờ bị ghi đè</span></div>
  <div class="lz-step"><span class="lz-k">4 · gỡ mã v1</span><span class="lz-t">sau khi đếm v1 = 0</span><span class="lz-d">rồi siết validator để bắt buộc có phones</span></div>
</div>
<p>Điều kiện <code>schemaVersion: { $ne: 2 }</code> trong bộ lọc của <code>replaceOne</code> rất quan trọng: nếu ứng dụng lưu khách đó giữa lúc lô đọc và lúc lô ghi, bộ lọc không còn khớp và lô không ghi đè dữ liệu mới bằng một bản chuyển đổi cũ hơn. Đây chính là ý tưởng cập nhật có điều kiện của Bài 2.5.</p>
${nguon('📘', 'Schema Versioning — MongoDB Docs', 'Trường schemaVersion, ứng dụng xử lý cả hai phiên bản', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/data-versioning/schema-versioning/')}

<h3>Cây: bốn cách lưu một danh mục phân cấp</h3>
<p>Menu của CT Shop: Điện tử › Máy tính › Laptop › Laptop gaming, Điện tử › Phụ kiện › Chuột, Sách › Sách cơ sở dữ liệu. Mỗi nút dưới đây lưu cùng lúc ba cách biểu diễn để so sánh: <code>cha</code> (tham chiếu cha), <code>toTien</code> (mảng tổ tiên) và <code>duong</code> (đường dẫn vật chất hoá — materialized path).</p>
${lenh('s03-4-p2', 10)}
${lenh('s03-4-p2', 11)}
${lenh('s03-4-p2', 12)}
${lenh('s03-4-p2', 13)}
${lenh('s03-4-p2', 14)}
${lenh('s03-4-p2', 15)}
<table>
<thead><tr><th>Mô hình</th><th>Các con</th><th>Mọi hậu duệ</th><th>Breadcrumb</th><th>Dời một nhánh</th></tr></thead>
<tbody>
<tr><td>Tham chiếu cha <code>cha</code></td><td>một truy vấn có index</td><td><code>$graphLookup</code> (đệ quy)</td><td>mỗi tầng một truy vấn</td><td>1 lệnh cập nhật</td></tr>
<tr><td>Mảng tổ tiên <code>toTien</code></td><td>kết hợp <code>cha</code></td><td>một truy vấn có index</td><td>một truy vấn <code>$in</code></td><td>sửa mọi hậu duệ</td></tr>
<tr><td>Đường dẫn <code>duong</code></td><td>regex theo tiền tố</td><td>regex tiền tố (dùng được index)</td><td>tách chuỗi</td><td>viết lại mọi hậu duệ</td></tr>
<tr><td>Tham chiếu con (mảng các con)</td><td>nằm sẵn trong nút</td><td>đệ quy</td><td>khó</td><td>2 lệnh cập nhật</td></tr>
</tbody></table>
<p>Menu và danh mục được đọc liên tục và hiếm khi dời ⇒ tham chiếu cha + mảng tổ tiên là lựa chọn thường gặp: các con, mọi hậu duệ và breadcrumb đều là một lần đọc có index. Dời "Máy tính" sang dưới "Sách" phải viết lại mảng tổ tiên của hai hậu duệ (và của chính nút đó) — ổn với một menu, sai với một cấu trúc bị sắp xếp lại mỗi phút (khi đó chỉ giữ <code>cha</code> và dùng <code>$graphLookup</code>). Một regex tiền tố có neo đầu, phân biệt hoa thường như <code>/^,dien-tu,may-tinh,/</code> dùng được index trên <code>duong</code>; regex không neo đầu thì không.</p>
${nguon('📘', 'Model Tree Structures — MongoDB Docs', 'Tham chiếu cha, tham chiếu con, mảng tổ tiên, đường dẫn, nested set', 'https://www.mongodb.com/docs/manual/tutorial/model-tree-structures/')}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — kịch bản di chuyển "chạy một lần lúc triển khai".</strong> Một đội đưa v2 lên và, trong cùng đợt triển khai, chạy một kịch bản chuyển đổi mọi tài liệu bằng một lệnh <code>updateMany</code>. Trong mấy phút nó chạy, các bản ứng dụng cũ (triển khai cuốn chiếu) vẫn ghi tài liệu v1, còn các bản mới thì sập vì gặp tài liệu kịch bản chưa kịp chạm tới. Versioning là một chuỗi đợt triển khai, không phải một: đọc cả hai → ghi bản mới → di chuyển theo lô với bộ lọc có điều kiện → gỡ mã cũ. Mỗi bước phải an toàn khi phiên bản ứng dụng trước đó vẫn đang chạy.</p>
</div>

<h3>💼 Đi làm: khách hàng IoT và collection 30 triệu dòng</h3>
<p>Một việc mức OJT hay gặp trong đội outsourcing: "dashboard của dự án nông trại thông minh chạy chậm". Collection có mỗi số đo cảm biến một tài liệu — hàng chục triệu — và dashboard vẽ biểu đồ theo ngày. Cách sửa được duyệt không phải máy chủ to hơn: đó là di chuyển sang bucket theo giờ (hoặc time series collection) với min/max/tổng tính sẵn, làm theo lô có versioning để thiết bị ở nông trại không bao giờ ngừng gửi. Số đo bạn mang theo: số tài liệu phải đọc cho mỗi biểu đồ trước và sau (con số 1.440 → 24 của bài này).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Bạn lưu số đo IoT trong MongoDB thế nào?"</strong> — Bucket theo thiết bị theo khung thời gian kèm số tổng hợp tính sẵn, hoặc time series collection; không bao giờ mỗi số đo một tài liệu tí hon mà không có lý do.</li>
<li><strong>"Một khách có dữ liệu nhiều gấp 100 lần những người khác. Bạn làm gì?"</strong> — Pattern outlier: thiết kế cho trường hợp điển hình, cho ngoại lệ tràn sang tài liệu phụ kèm cờ đánh dấu.</li>
<li><strong>"Đổi schema trên production không có thời gian chết thế nào?"</strong> — Trường phiên bản schema, ứng dụng đọc cả hai phiên bản, ghi bản mới, di chuyển theo lô với bộ lọc có điều kiện, rồi gỡ nhánh cũ.</li>
<li><strong>"Lưu cây danh mục thế nào?"</strong> — Tham chiếu cha cộng mảng tổ tiên cho cây đọc nhiều; tham chiếu cha + <code>$graphLookup</code> khi cây hay đổi.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Đổi bucket thành mỗi cảm biến mỗi <em>ngày</em> một tài liệu. Bao nhiêu tài liệu? Truy vấn trung bình ngày viết nhanh hơn hay chậm hơn? Còn biểu đồ "10 phút gần nhất" thì sao?</li>
<li>Thêm <code>accessory</code> vào validator polymorphic: phụ kiện phải có <code>warrantyMonths</code> kiểu int trong [0, 36].</li>
<li>Viết <code>docKhach</code> cho bản v3, trong đó <code>phones</code> còn có cờ <code>chinh: true</code> ở số đầu tiên. Cho nó nhận v1, v2 và v3.</li>
<li>Với mô hình tổ tiên, viết truy vấn "mọi sản phẩm thuộc Máy tính và các nhánh dưới", giả sử mỗi sản phẩm lưu <code>categoryId</code>.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. 10 × 7 = 70 tài liệu, mỗi cái 1.440 số đo. Trung bình ngày chỉ đọc một tài liệu. Biểu đồ "10 phút gần nhất" giờ phải tải cả một ngày (1.440 số đo) để hiện 10 — cỡ bucket đi theo truy vấn hay gặp nhất, và dashboard thường cần cả hai: bucket theo giờ, hoặc time series collection.</p>
<p>2. Thêm <code>{ $or: [{ category: { $ne: 'accessory' } }, { warrantyMonths: { $type: 'int', $gte: 0, $lte: 36 } }] }</code> vào <code>$and</code> và <code>{ category: { $in: [..., 'accessory'] } }</code>; áp dụng bằng <code>collMod</code> (Bài 1.3).</p>
<p>3. <code>function docKhach(d) { if (d.schemaVersion === 3) return d; const v2 = d.schemaVersion === 2 ? d : { ...d, phones: d.phone ? [{ loai: 'di động', so: d.phone }] : [] }; delete v2.phone; return { ...v2, schemaVersion: 3, phones: v2.phones.map((p, i) => ({ ...p, chinh: i === 0 })) }; }</code></p>
<p>4. <code>const ids = db.dm.find({ $or: [{ _id: 'may-tinh' }, { toTien: 'may-tinh' }] }).toArray().map((d) =&gt; d._id); db.products.find({ categoryId: { $in: ids } })</code> — hai truy vấn có index. (Hoặc lưu luôn danh sách tổ tiên trong mỗi sản phẩm — một extended reference.)</p>
</details>
<p><strong>Xong khi:</strong> gặp một loại dữ liệu mới, bạn nói được pattern nào trong chín pattern của Bài 3.3–3.4 áp dụng được, hoặc vì sao không cái nào hợp.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Pattern bucket', 'Gom nhiều mục nhỏ có thứ tự (số đo, sự kiện) thành một tài liệu cho mỗi khoá và khung thời gian, kèm số tổng hợp tính sẵn.'],
  ['Time series collection', 'Kiểu collection từ MongoDB 5.0 tự gom và nén số đo (Chương 10).'],
  ['Pattern outlier', 'Thiết kế cho tài liệu điển hình; cho cái khổng lồ hiếm hoi tràn sang tài liệu phụ có cờ đánh dấu.'],
  ['Pattern polymorphic', 'Tài liệu nhiều hình dạng trong một collection vì chúng được truy vấn cùng nhau; một trường discriminator gọi tên hình dạng.'],
  ['Schema versioning', 'Một trường phiên bản cộng mã đọc được mọi phiên bản còn sống, để schema đổi được mà không có thời gian chết.'],
  ['Di chuyển lười (lazy migration)', 'Chuyển một tài liệu sang hình dạng mới vào lần kế tiếp nó được ghi.'],
  ['Mảng tổ tiên', 'Mô hình cây trong đó mỗi nút lưu id của mọi tổ tiên, theo thứ tự.'],
  ['Đường dẫn vật chất hoá (materialized path)', 'Mô hình cây trong đó mỗi nút lưu cả đường dẫn dưới dạng chuỗi, truy vấn theo tiền tố.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bucket: 100.800 số đo → 1.680 tài liệu theo giờ; trung bình ngày đọc 24 tài liệu thay vì 1.440.</li>
<li>Outlier: nhúng tới giới hạn (chốt nguyên tử <code>'arr.999': { $exists: false }</code>), phần dư tràn ra, đánh dấu bằng <code>hasExtras</code>.</li>
<li>Polymorphic: một collection cho những thứ được truy vấn cùng nhau, kèm validator kiểm từng hình dạng.</li>
<li>Schema versioning là một chuỗi: đọc cả hai, ghi bản mới, di chuyển theo lô có điều kiện, gỡ mã cũ.</li>
<li>Cây: cha + tổ tiên cho phân cấp đọc nhiều; <code>$graphLookup</code> khi cây hay đổi.</li>
</ul>
</div>
`,
};
