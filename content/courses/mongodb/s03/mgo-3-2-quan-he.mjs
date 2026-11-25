/**
 * 3.2 — Một–vài, một–nhiều, một–vô số, nhiều–nhiều (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s03-2-qh'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s03/s03-2-qh.txt, database ch3).
 * Số đối chiếu: địa chỉ thứ 6 bị validator chặn (121); 6.000 đánh giá, SP002 1591; index đọc đúng 3 tài liệu; mảng 1591 id = 27.564 byte,
 * $in + sort quét 2766 khoá / 1591 tài liệu; 17,4 byte/id ⇒ trần ≈ 964.821 id; mảng hai chiều lệch 1 cặp (SV1–L2); E11000 khi đăng ký trùng.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '3.2 — One-to-few, one-to-many, one-to-squillions, many-to-many|||3.2 — Một–vài, một–nhiều, một–vô số, nhiều–nhiều',
  slug: 'mgo-3-2-quan-he',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ba câu "bao nhiêu?" quyết định hình dạng mỗi quan hệ: một–vài nhúng mảng có giới hạn ghi bằng validator, một–nhiều tham chiếu từ con về cha kèm index (đọc đúng 3 tài liệu), vì sao mảng id trong cha tệ hơn (1591 id = 27 KB, $in quét 2766 khoá), một–vô số tính bằng byte, nhiều–nhiều bằng mảng hai chiều (và cách nó lệch khi ghi dở) hay bằng collection nối có index duy nhất.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>One-to-few, one-to-many, one-to-squillions, many-to-many</h2>
<p class="lead">In SQL every one-to-many relationship looks the same: a foreign key on the "many" side. In MongoDB the right shape depends on <em>how many</em>. A customer's addresses, a product's reviews and a server's log lines are all "one-to-many", and each one needs a different design. This lesson measures the options on CT Shop and ends with the case SQL handles with a join table — many-to-many.</p>

<h3>An everyday picture: a wallet, a filing cabinet, a river</h3>
<p>Your wallet holds a few cards — you carry them <em>with</em> you (embed). Your school keeps your exam papers in a filing cabinet, each folder labelled with your student id — the papers point to you, not the other way round (child references parent). A traffic camera records every car that passes, forever — nobody would try to keep that list on a card in your wallet, or even a list of the photo numbers (one-to-squillions: only the child carries the reference). Same word "has many", three different storage decisions.</p>

<h3>The cardinality question</h3>
<p>The 2014 "6 Rules of Thumb" post names three cases, and they have become standard vocabulary:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">one-to-few</span><span class="lz-t">a handful, known upper bound</span><span class="lz-d">addresses, phone numbers, shirt sizes ⇒ embed an array in the parent</span></div>
  <div class="lz-step"><span class="lz-k">one-to-many</span><span class="lz-t">hundreds to thousands</span><span class="lz-d">reviews of a product, lines of a long invoice ⇒ separate collection, child stores parent id (or a bounded array of ids)</span></div>
  <div class="lz-step"><span class="lz-k">one-to-squillions</span><span class="lz-t">unbounded, grows forever</span><span class="lz-d">log events, sensor readings, page views ⇒ child stores parent id, never anything in the parent</span></div>
</div>
<p>Rule three of the same post gives rough numbers: more than a couple of hundred on the "many" side ⇒ do not embed them; more than a few thousand ⇒ do not even keep an array of ids. Treat these as starting points and measure, as below.</p>
${nguon('📝', '6 Rules of Thumb for MongoDB Schema Design — MongoDB blog', 'One-to-few, one-to-many, one-to-squillions; rules 1–3', 'https://www.mongodb.com/company/blog/mongodb/6-rules-of-thumb-for-mongodb-schema-design')}

<h3>One-to-few: embed, and write the bound down</h3>
<p>A customer has a few delivery addresses. Embed them — the checkout page needs them all at once. But "a few" must be enforced, not hoped for. Put the limit in the validator (Lesson 1.3):</p>
${lenh('s03-2-qh', 0)}
${lenh('s03-2-qh', 1)}
<p>The validator says <code>maxItems: 5</code>: addresses three to five go in, the sixth is rejected with error 121 (Document failed validation). The API turns that into "you can save at most 5 addresses". Without the limit, a bug in a mobile client that re-adds the address on every app start would grow the array forever, silently.</p>

<h3>One-to-many: the child points to the parent</h3>
<p>Reviews are the classic one-to-many: a product page shows the latest few, but a popular product collects thousands, and each review has its own life (edit, report, moderate). Generate 6,000 reviews with one very popular product, store each review with <code>productId</code>, and index what the page queries:</p>
${lenh('s03-2-qh', 2)}
${lenh('s03-2-qh', 3)}
${lenh('s03-2-qh', 4)}
<p>SP002 has 1,591 reviews, but the page reads exactly 3 documents: the compound index <code>{ productId: 1, createdAt: -1 }</code> already stores them in "this product, newest first" order (Chapter 4 explains why the order of fields matters). This is the default shape for one-to-many in MongoDB: a separate collection, a reference to the parent, and an index that matches the access pattern.</p>

<h3>The alternative: an array of ids in the parent</h3>
<p>The other shape you will see in tutorials keeps <code>reviewIds: [ObjectId, …]</code> inside the product. Build it and measure:</p>
${lenh('s03-2-qh', 5)}
${lenh('s03-2-qh', 6)}
<p>Two problems appear. The parent grows with the children: 1,591 ids already make the product document 27,564 bytes — every product page load now reads 27 KB of ids it does not display. And the query is worse: "the latest 3 among these ids" becomes an <code>$in</code> with 1,591 values, which scans 2,766 index keys and fetches all 1,591 reviews to sort them, instead of 3. Arrays of ids are fine for a <em>bounded</em> list the parent really owns (a playlist of at most 100 songs, in an order the user chose). For "everything that points to me", put the reference in the child.</p>

<h3>One-to-squillions: do the arithmetic</h3>
${lenh('s03-2-qh', 7)}
<p>Each ObjectId in an array costs about 17 bytes (12 bytes of id plus type and array-index key). A 16 MiB document can therefore hold under a million ids — a popular page's views in a single day. For data that grows forever (page views, events, logs, readings), the parent stores <em>nothing</em> about the children; each child stores the parent id, and you index it. If the parent needs a number ("1.2 M views"), keep a counter (computed pattern, Lesson 3.3) — not the list.</p>

<h3>Many-to-many: two arrays and the half-finished write</h3>
<p>Students and classes: a student takes several classes, a class has many students. A common first design keeps an array on each side, so both "my classes" and "class list" are one read. Now the process dies between the two writes:</p>
${lenh('s03-2-qh', 8)}
${lenh('s03-2-qh', 9)}
<p>SV1 believes it is in L2; L2's list does not contain SV1. The detection query (a <code>$lookup</code> that checks every student's class against that class's list) finds the broken pair — which means you now need a nightly job to run it. Two arrays are two copies of the same fact, and Lesson 3.1 told you what copies cost. Options, from simplest:</p>
<ul>
<li><strong>Keep the array on one side only</strong>, the side whose list is bounded and read most (a student has at most ~10 classes ⇒ <code>sv.lop</code>), and answer the other direction with an index on that array (<code>db.sv.find({ lop: 'L1' })</code> with index <code>{ lop: 1 }</code>).</li>
<li><strong>Write both sides in a transaction</strong> (Chapter 6) — correct, but you pay for a transaction on every enrolment.</li>
<li><strong>A link collection</strong>, when the relationship has its own data.</li>
</ul>

<h3>The link collection: when the relationship has attributes</h3>
<p>An enrolment has its own fields — date joined, progress, grade. That is a strong sign the relationship is an entity of its own, exactly like a join table in SQL:</p>
${lenh('s03-2-qh', 10)}
${lenh('s03-2-qh', 11)}
${lenh('s03-2-qh', 12)}
<p>The unique index <code>{ sv: 1, lop: 1 }</code> makes "enrol twice" impossible (E11000, Lesson 2.1) — the guarantee that two arrays could never give you. The second index <code>{ lop: 1 }</code> serves the class list. One write per enrolment, no half-finished state. You give up "one read returns the student with all their classes" — which you can rebuild with <code>$lookup</code> or a small cached copy if a screen really needs it.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">many-to-many, small and read together</span><span class="lz-t">array of ids on ONE side + multikey index</span><span class="lz-d">product ↔ tags, user ↔ roles</span></div>
  <div class="lz-step"><span class="lz-k">many-to-many, both sides must be one read</span><span class="lz-t">arrays on both sides + transaction</span><span class="lz-d">rare; budget for the transaction and a consistency check</span></div>
  <div class="lz-step"><span class="lz-k">relationship has its own data</span><span class="lz-t">link collection + unique index</span><span class="lz-d">enrolments, memberships, order ↔ coupon usage</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "the parent should know its children".</strong> Developers coming from object-oriented code expect <code>product.reviews</code> to exist, so they keep <code>reviewIds</code> in the product and <code>$push</code> on every new review. It works in the demo with 10 reviews. In production one product goes viral: the document grows on every review (each update rewrites it — Lesson 3.5 measures this), the product page loads thousands of ids, and eventually the push fails at 16 MB. Ask "how many, at most, ever?" — if you cannot give a number, the reference belongs in the child.</p>
</div>

${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose', sub: 'ref + populate at course level; populate is the "two queries" design of Lesson 3.1' })}

<h3>💼 At work: the "followers" field</h3>
<p>A social feature request on an outsourcing project: "users can follow other users". The first pull request adds <code>followers: [userId]</code> and <code>following: [userId]</code> to the user document — both arrays, both unbounded, two copies of each edge. A reviewer who has seen this before asks three questions: what is the maximum followers count (a celebrity account: millions)? which screens read the list (a paginated "followers" page, sorted by date)? what happens when one of the two pushes fails? The design that ships is a <code>follows</code> collection <code>{ from, to, at }</code> with a unique index on <code>{ from, to }</code>, an index on <code>{ to, at: -1 }</code> for the followers page, and two counters on the user (computed pattern, next lesson).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you model one-to-many in MongoDB?"</strong> — It depends on how many: embed for a bounded few, child-references-parent with an index for many, and never anything in the parent for unbounded.</li>
<li><strong>"Why not keep an array of child ids in the parent?"</strong> — The parent grows with every child, reads carry ids they don't use, and "latest N" becomes a large <code>$in</code> plus sort; it is only good for bounded, owned lists.</li>
<li><strong>"How do you do many-to-many?"</strong> — Array of ids on the bounded side with a multikey index; or a link collection with a unique compound index when the relationship has attributes; two-sided arrays need a transaction.</li>
<li><strong>"How do you enforce 'at most 5 addresses'?"</strong> — <code>$jsonSchema</code> <code>maxItems</code> in the validator, plus a check in the API for a friendly message.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Classify each relationship as few / many / squillions and choose a shape: user ↔ login sessions; product ↔ images; order ↔ status history; shop ↔ products; IoT device ↔ readings.</li>
<li>In <code>ch3</code>, drop <code>sv.lop</code>'s twin: keep the array only on students, create an index on it, and answer "students of L1" with one query. Show with <code>explain</code> that it uses the index.</li>
<li>Add a third index to <code>dangKy</code> for "my classes, newest first" and run the query for SV1.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Sessions: many (a few per device, expire) ⇒ separate collection with TTL index (Chapter 4), <code>userId</code> in the child. Images: few (≤ 10) ⇒ embed URLs, <code>maxItems</code>. Status history: few (≤ ~10 transitions) ⇒ embed, it is part of the order. Shop ↔ products: many ⇒ <code>shopId</code> in product. Device ↔ readings: squillions ⇒ <code>deviceId</code> in each reading, bucket pattern (Lesson 3.4) or a time series collection.</p>
<p>2. <code>db.sv.createIndex({ lop: 1 }); db.sv.find({ lop: 'L1' }, { ten: 1 }).explain('executionStats').queryPlanner.winningPlan</code> — the plan shows <code>IXSCAN</code> on <code>lop_1</code> with <code>isMultiKey: true</code>.</p>
<p>3. <code>db.dangKy.createIndex({ sv: 1, vao: -1 }); db.dangKy.find({ sv: 'SV1' }).sort({ vao: -1 })</code> — L2 (20/11) then L1 (05/09). Note that the unique index <code>{ sv: 1, lop: 1 }</code> already serves "all classes of SV1", but not sorted by date.</p>
</details>
<p><strong>Done when:</strong> for each relationship in your project you can write "few/many/squillions — upper bound N — shape — index".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Cardinality', 'How many items can sit on the "many" side — the deciding input for shape.'],
  ['One-to-few', 'A small, bounded set: embed an array and enforce the bound (maxItems).'],
  ['One-to-many', 'Hundreds–thousands: separate collection, child stores parent id, indexed for the access pattern.'],
  ['One-to-squillions', 'Unbounded: the parent stores nothing about the children; counters instead of lists.'],
  ['Parent referencing', 'The child document holds the id of its parent (<code>productId</code> in a review).'],
  ['Child referencing', 'The parent holds an array of child ids; only for bounded, owned lists.'],
  ['Link collection', 'One document per relationship edge with its own fields, protected by a unique compound index.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Ask "how many, at most, ever?" for every relationship; the answer picks the shape.</li>
<li>Few ⇒ embed and enforce the bound with a validator (the sixth address was rejected).</li>
<li>Many ⇒ child points to parent + index: the product page read 3 documents out of 1,591 reviews.</li>
<li>An array of ids in the parent cost 27 KB and 2,766 scanned keys for the same page.</li>
<li>Squillions ⇒ nothing in the parent; ~17 bytes per id means under a million fit in 16 MiB.</li>
<li>Many-to-many: one-sided array, transaction for two-sided, or a link collection with a unique index when the edge has data.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Một–vài, một–nhiều, một–vô số, nhiều–nhiều</h2>
<p class="lead">Trong SQL, mọi quan hệ một–nhiều trông giống nhau: một khoá ngoại ở phía "nhiều". Trong MongoDB, hình dạng đúng phụ thuộc vào <em>bao nhiêu</em>. Địa chỉ của một khách, đánh giá của một sản phẩm và các dòng nhật ký của một máy chủ đều là "một–nhiều", nhưng mỗi cái cần một thiết kế khác nhau. Bài này đo các phương án trên CT Shop và kết thúc ở trường hợp SQL giải bằng bảng nối — nhiều–nhiều.</p>

<h3>Hình ảnh đời thường: cái ví, tủ hồ sơ, dòng sông</h3>
<p>Ví của bạn giữ vài tấm thẻ — bạn mang chúng <em>theo người</em> (nhúng). Trường giữ bài thi của bạn trong tủ hồ sơ, mỗi tập ghi mã số sinh viên của bạn — bài thi trỏ về bạn, chứ không phải ngược lại (con tham chiếu cha). Camera giao thông ghi lại mọi chiếc xe chạy qua, mãi mãi — chẳng ai định giữ danh sách đó trên một tấm thẻ trong ví bạn, kể cả chỉ là danh sách số hiệu ảnh (một–vô số: chỉ phía con mang tham chiếu). Cùng một chữ "có nhiều", ba quyết định cất giữ khác nhau.</p>

<h3>Câu hỏi về số lượng</h3>
<p>Bài "6 Rules of Thumb" năm 2014 gọi tên ba trường hợp, và chúng đã thành từ vựng chuẩn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">một–vài</span><span class="lz-t">một nhúm, biết giới hạn trên</span><span class="lz-d">địa chỉ, số điện thoại, cỡ áo ⇒ nhúng mảng trong cha</span></div>
  <div class="lz-step"><span class="lz-k">một–nhiều</span><span class="lz-t">hàng trăm tới hàng nghìn</span><span class="lz-d">đánh giá của sản phẩm, các dòng của một hoá đơn dài ⇒ collection riêng, con lưu id cha (hoặc mảng id có giới hạn)</span></div>
  <div class="lz-step"><span class="lz-k">một–vô số</span><span class="lz-t">không giới hạn, tăng mãi</span><span class="lz-d">sự kiện nhật ký, số đo cảm biến, lượt xem trang ⇒ con lưu id cha, cha tuyệt đối không giữ gì</span></div>
</div>
<p>Luật thứ ba của cùng bài viết đưa con số thô: phía "nhiều" quá vài trăm ⇒ đừng nhúng; quá vài nghìn ⇒ đến mảng id cũng đừng giữ. Hãy coi đó là điểm xuất phát rồi đo, như dưới đây.</p>
${nguon('📝', '6 Rules of Thumb for MongoDB Schema Design — blog MongoDB', 'Một–vài, một–nhiều, một–vô số; luật 1–3', 'https://www.mongodb.com/company/blog/mongodb/6-rules-of-thumb-for-mongodb-schema-design')}

<h3>Một–vài: nhúng, và ghi rõ giới hạn</h3>
<p>Một khách có vài địa chỉ giao hàng. Hãy nhúng chúng — trang thanh toán cần tất cả cùng lúc. Nhưng "vài" phải được ép buộc, không phải hy vọng. Đặt giới hạn trong validator (Bài 1.3):</p>
${lenh('s03-2-qh', 0)}
${lenh('s03-2-qh', 1)}
<p>Validator ghi <code>maxItems: 5</code>: địa chỉ thứ ba tới thứ năm vào được, địa chỉ thứ sáu bị từ chối với lỗi 121 (Document failed validation). API dịch nó thành "bạn lưu được tối đa 5 địa chỉ". Không có giới hạn, một lỗi ở ứng dụng di động thêm lại địa chỉ mỗi lần mở máy sẽ làm mảng phình mãi, trong im lặng.</p>

<h3>Một–nhiều: con trỏ về cha</h3>
<p>Đánh giá là ví dụ một–nhiều kinh điển: trang sản phẩm hiện vài cái mới nhất, nhưng một sản phẩm đắt khách gom hàng nghìn, và mỗi đánh giá có đời sống riêng (sửa, báo cáo, kiểm duyệt). Sinh 6.000 đánh giá trong đó có một sản phẩm rất nổi, lưu mỗi đánh giá kèm <code>productId</code>, và đánh index cho đúng thứ trang cần hỏi:</p>
${lenh('s03-2-qh', 2)}
${lenh('s03-2-qh', 3)}
${lenh('s03-2-qh', 4)}
<p>SP002 có 1.591 đánh giá, nhưng trang chỉ đọc đúng 3 tài liệu: index ghép <code>{ productId: 1, createdAt: -1 }</code> đã cất sẵn chúng theo thứ tự "sản phẩm này, mới nhất trước" (Chương 4 giải thích vì sao thứ tự các trường quan trọng). Đây là hình dạng mặc định của một–nhiều trong MongoDB: một collection riêng, một tham chiếu về cha, và một index khớp với cách truy cập.</p>

<h3>Phương án khác: mảng id trong cha</h3>
<p>Hình dạng còn lại bạn sẽ gặp trong các bài hướng dẫn giữ <code>reviewIds: [ObjectId, …]</code> ngay trong sản phẩm. Dựng nó rồi đo:</p>
${lenh('s03-2-qh', 5)}
${lenh('s03-2-qh', 6)}
<p>Hai vấn đề lộ ra. Cha phình theo con: 1.591 id đã làm tài liệu sản phẩm nặng 27.564 byte — mỗi lần tải trang sản phẩm giờ đọc thêm 27 KB id mà trang không hiển thị. Và truy vấn tệ hơn: "3 cái mới nhất trong số các id này" thành một <code>$in</code> với 1.591 giá trị, quét 2.766 khoá index và lấy cả 1.591 đánh giá ra để sắp xếp, thay vì 3. Mảng id chỉ ổn cho một danh sách <em>có giới hạn</em> mà cha thật sự sở hữu (một playlist tối đa 100 bài, theo thứ tự người dùng chọn). Với "mọi thứ trỏ về tôi", hãy đặt tham chiếu ở con.</p>

<h3>Một–vô số: làm phép tính</h3>
${lenh('s03-2-qh', 7)}
<p>Mỗi ObjectId trong mảng tốn khoảng 17 byte (12 byte id cộng kiểu và khoá chỉ số mảng). Vậy một tài liệu 16 MiB chứa chưa tới một triệu id — số lượt xem một ngày của một trang nổi tiếng. Với dữ liệu tăng mãi (lượt xem, sự kiện, nhật ký, số đo), cha <em>không</em> giữ gì về con; mỗi con lưu id cha, và bạn đánh index cho nó. Nếu cha cần một con số ("1,2 triệu lượt xem"), hãy giữ một bộ đếm (pattern computed, Bài 3.3) — không phải danh sách.</p>

<h3>Nhiều–nhiều: hai mảng và lần ghi dở dang</h3>
<p>Sinh viên và lớp học: một sinh viên học nhiều lớp, một lớp có nhiều sinh viên. Thiết kế đầu tiên hay gặp giữ một mảng ở mỗi bên, để cả "lớp của tôi" lẫn "danh sách lớp" đều chỉ một lần đọc. Giờ tiến trình chết giữa hai lần ghi:</p>
${lenh('s03-2-qh', 8)}
${lenh('s03-2-qh', 9)}
<p>SV1 tin rằng mình ở L2; danh sách của L2 lại không có SV1. Truy vấn dò lỗi (một <code>$lookup</code> kiểm từng lớp của mỗi sinh viên với danh sách của lớp đó) tìm ra cặp bị lệch — nghĩa là giờ bạn cần một tác vụ chạy mỗi đêm để dò. Hai mảng là hai bản chép của cùng một sự thật, và Bài 3.1 đã nói bản chép tốn gì. Các lựa chọn, từ đơn giản nhất:</p>
<ul>
<li><strong>Chỉ giữ mảng ở một bên</strong>, bên có danh sách giới hạn và được đọc nhiều nhất (một sinh viên học tối đa khoảng 10 lớp ⇒ <code>sv.lop</code>), và trả lời chiều ngược lại bằng index trên mảng đó (<code>db.sv.find({ lop: 'L1' })</code> với index <code>{ lop: 1 }</code>).</li>
<li><strong>Ghi cả hai bên trong một transaction</strong> (Chương 6) — đúng, nhưng bạn trả giá một transaction cho mỗi lần đăng ký.</li>
<li><strong>Một collection nối</strong>, khi quan hệ có dữ liệu của riêng nó.</li>
</ul>

<h3>Collection nối: khi quan hệ có thuộc tính</h3>
<p>Một lượt đăng ký có trường riêng — ngày vào lớp, tiến độ, điểm. Đó là dấu hiệu mạnh rằng quan hệ là một thực thể riêng, y như bảng nối trong SQL:</p>
${lenh('s03-2-qh', 10)}
${lenh('s03-2-qh', 11)}
${lenh('s03-2-qh', 12)}
<p>Index duy nhất <code>{ sv: 1, lop: 1 }</code> khiến "đăng ký hai lần" là bất khả (E11000, Bài 2.1) — bảo đảm mà hai mảng không bao giờ cho được. Index thứ hai <code>{ lop: 1 }</code> phục vụ danh sách lớp. Một lần ghi cho mỗi lượt đăng ký, không có trạng thái dở dang. Bạn từ bỏ "một lần đọc trả về sinh viên kèm mọi lớp" — thứ có thể dựng lại bằng <code>$lookup</code> hoặc một bản chép nhỏ nếu màn hình thật sự cần.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">nhiều–nhiều, nhỏ và đọc cùng nhau</span><span class="lz-t">mảng id ở MỘT bên + index multikey</span><span class="lz-d">sản phẩm ↔ thẻ, người dùng ↔ vai trò</span></div>
  <div class="lz-step"><span class="lz-k">nhiều–nhiều, cả hai bên phải một lần đọc</span><span class="lz-t">mảng ở hai bên + transaction</span><span class="lz-d">hiếm; tính trước chi phí transaction và phép kiểm nhất quán</span></div>
  <div class="lz-step"><span class="lz-k">quan hệ có dữ liệu riêng</span><span class="lz-t">collection nối + index duy nhất</span><span class="lz-d">đăng ký học, thành viên nhóm, đơn ↔ lượt dùng mã giảm giá</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "cha phải biết các con của mình".</strong> Lập trình viên quen mã hướng đối tượng mong có <code>product.reviews</code>, nên họ giữ <code>reviewIds</code> trong sản phẩm và <code>$push</code> mỗi khi có đánh giá mới. Chạy demo với 10 đánh giá thì ổn. Lên production, một sản phẩm nổi như cồn: tài liệu phình sau mỗi đánh giá (mỗi lần cập nhật ghi lại cả tài liệu — Bài 3.5 đo điều này), trang sản phẩm tải hàng nghìn id, rồi tới lúc lệnh push thất bại ở 16 MB. Hãy hỏi "tối đa, mãi mãi, là bao nhiêu?" — nếu không đưa ra được một con số, tham chiếu thuộc về phía con.</p>
</div>

${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose', sub: 'ref + populate mức môn học; populate chính là thiết kế "hai truy vấn" của Bài 3.1' })}

<h3>💼 Đi làm: trường "người theo dõi"</h3>
<p>Một yêu cầu tính năng mạng xã hội trong dự án outsourcing: "người dùng theo dõi được người dùng khác". Pull request đầu tiên thêm <code>followers: [userId]</code> và <code>following: [userId]</code> vào tài liệu người dùng — cả hai đều là mảng, đều không giới hạn, mỗi cạnh có hai bản chép. Người review từng gặp chuyện này sẽ hỏi ba câu: số người theo dõi tối đa là bao nhiêu (một tài khoản người nổi tiếng: hàng triệu)? màn hình nào đọc danh sách (trang "người theo dõi" phân trang, sắp theo ngày)? chuyện gì xảy ra khi một trong hai lệnh push thất bại? Thiết kế được đưa lên là một collection <code>follows</code> <code>{ from, to, at }</code> với index duy nhất trên <code>{ from, to }</code>, một index <code>{ to, at: -1 }</code> cho trang người theo dõi, và hai bộ đếm trên người dùng (pattern computed, bài sau).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Mô hình hoá một–nhiều trong MongoDB thế nào?"</strong> — Tuỳ bao nhiêu: nhúng khi là vài cái có giới hạn, con tham chiếu cha kèm index khi nhiều, và cha không giữ gì khi không giới hạn.</li>
<li><strong>"Sao không giữ mảng id con trong cha?"</strong> — Cha phình theo mỗi con, lần đọc mang theo id không dùng, và "N cái mới nhất" thành một <code>$in</code> lớn cộng sắp xếp; chỉ tốt cho danh sách có giới hạn mà cha sở hữu.</li>
<li><strong>"Làm nhiều–nhiều thế nào?"</strong> — Mảng id ở bên có giới hạn kèm index multikey; hoặc collection nối với index ghép duy nhất khi quan hệ có thuộc tính; mảng hai bên cần transaction.</li>
<li><strong>"Ép 'tối đa 5 địa chỉ' bằng cách nào?"</strong> — <code>maxItems</code> của <code>$jsonSchema</code> trong validator, cộng một phép kiểm ở API để báo lỗi dễ hiểu.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Xếp mỗi quan hệ vào vài / nhiều / vô số và chọn hình dạng: người dùng ↔ phiên đăng nhập; sản phẩm ↔ ảnh; đơn ↔ lịch sử trạng thái; cửa hàng ↔ sản phẩm; thiết bị IoT ↔ số đo.</li>
<li>Trong <code>ch3</code>, bỏ bản sinh đôi của <code>sv.lop</code>: chỉ giữ mảng ở sinh viên, tạo index trên nó, và trả lời "sinh viên của L1" bằng một truy vấn. Dùng <code>explain</code> chỉ ra nó dùng index.</li>
<li>Thêm index thứ ba cho <code>dangKy</code> phục vụ "lớp của tôi, mới nhất trước" và chạy truy vấn cho SV1.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. Phiên đăng nhập: nhiều (vài phiên mỗi thiết bị, có hạn) ⇒ collection riêng với index TTL (Chương 4), <code>userId</code> ở con. Ảnh: vài (≤ 10) ⇒ nhúng URL, <code>maxItems</code>. Lịch sử trạng thái: vài (≤ khoảng 10 lần chuyển) ⇒ nhúng, nó là một phần của đơn. Cửa hàng ↔ sản phẩm: nhiều ⇒ <code>shopId</code> trong sản phẩm. Thiết bị ↔ số đo: vô số ⇒ <code>deviceId</code> trong mỗi số đo, pattern bucket (Bài 3.4) hoặc time series collection.</p>
<p>2. <code>db.sv.createIndex({ lop: 1 }); db.sv.find({ lop: 'L1' }, { ten: 1 }).explain('executionStats').queryPlanner.winningPlan</code> — kế hoạch hiện <code>IXSCAN</code> trên <code>lop_1</code> với <code>isMultiKey: true</code>.</p>
<p>3. <code>db.dangKy.createIndex({ sv: 1, vao: -1 }); db.dangKy.find({ sv: 'SV1' }).sort({ vao: -1 })</code> — L2 (20/11) rồi L1 (05/09). Lưu ý index duy nhất <code>{ sv: 1, lop: 1 }</code> đã phục vụ được "mọi lớp của SV1", nhưng không sắp theo ngày.</p>
</details>
<p><strong>Xong khi:</strong> với mỗi quan hệ trong dự án, bạn viết được "vài/nhiều/vô số — giới hạn trên N — hình dạng — index".</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Số lượng (cardinality)', 'Phía "nhiều" có thể có bao nhiêu phần tử — đầu vào quyết định hình dạng.'],
  ['Một–vài', 'Tập nhỏ, có giới hạn: nhúng mảng và ép giới hạn (maxItems).'],
  ['Một–nhiều', 'Hàng trăm–hàng nghìn: collection riêng, con lưu id cha, đánh index theo cách truy cập.'],
  ['Một–vô số', 'Không giới hạn: cha không giữ gì về con; dùng bộ đếm thay cho danh sách.'],
  ['Tham chiếu cha (parent referencing)', 'Tài liệu con giữ id của cha (<code>productId</code> trong một đánh giá).'],
  ['Tham chiếu con (child referencing)', 'Cha giữ mảng id các con; chỉ dành cho danh sách có giới hạn mà cha sở hữu.'],
  ['Collection nối', 'Mỗi cạnh quan hệ là một tài liệu có trường riêng, được bảo vệ bằng index ghép duy nhất.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Với mọi quan hệ, hỏi "tối đa, mãi mãi, là bao nhiêu?"; câu trả lời chọn hình dạng.</li>
<li>Vài ⇒ nhúng và ép giới hạn bằng validator (địa chỉ thứ sáu bị từ chối).</li>
<li>Nhiều ⇒ con trỏ về cha + index: trang sản phẩm đọc 3 tài liệu trong 1.591 đánh giá.</li>
<li>Mảng id trong cha tốn 27 KB và 2.766 khoá bị quét cho cùng trang đó.</li>
<li>Vô số ⇒ cha không giữ gì; khoảng 17 byte mỗi id nghĩa là chưa tới một triệu id vừa 16 MiB.</li>
<li>Nhiều–nhiều: mảng một bên, transaction nếu hai bên, hoặc collection nối có index duy nhất khi cạnh có dữ liệu.</li>
</ul>
</div>
`,
};
