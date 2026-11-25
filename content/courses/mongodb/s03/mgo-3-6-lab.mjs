/**
 * 3.6 — Lab Chương 3: thiết kế schema CT Shop từ user story (soạn 24/11/2026, agent mgo).
 * Lời giải chạy thật: ../_ma.mjs OUT['s03-6-lab'] (MongoDB 8.0.38, kịch bản demo/s03/s03-6-lab.txt, database lab3) — che trong <details>.
 * Mã lời giải = ../_demo/lab3-giai.js (chép nguyên vào GIAI_MA dưới đây khi soạn; sửa tệp thì chép lại).
 * Gắn với dự án xuyên khoá: mốc 3 (mgo-moc-3) yêu cầu tài liệu thiết kế schema của đề tài — lab này là bản tập dượt.
 */
import { lenh, ma, loiGiai, kv } from '../_chung.mjs';

const GIAI_MA = `// LỜI GIẢI Lab Chương 3 (khoá MongoDB — cuongthai.com/courses/mongodb). Làm thiết kế của bạn TRƯỚC rồi mới mở tệp này.
// Dùng trong mongosh:  use lab3  rồi  load('/demo/lab3-giai.js')  — tệp chỉ ĐỊNH NGHĨA hàm, không đụng dữ liệu.
// Lần đầu gọi dungLab3() để xoá database hiện tại rồi dựng collection + validator + index + dữ liệu mẫu.
// Mỗi user story ⇒ một quyết định nhúng/tham chiếu + pattern, ghi ở chú thích ngay trên mã.
function dungLab3() {
  db.dropDatabase();

  // US1 + US5 — Trang sản phẩm: một lần đọc. Thuộc tính biến đổi ⇒ attribute; 3 đánh giá mới nhất ⇒ subset; điểm ⇒ computed;
  // tồn theo kho: một–vài (≤ 10 kho) ⇒ nhúng, giới hạn bằng validator.
  db.createCollection('products', { validator: { $jsonSchema: {
    required: ['name', 'price', 'category'],
    properties: {
      price: { bsonType: 'decimal' },
      attrs: { bsonType: 'array', items: { bsonType: 'object', required: ['k', 'v'] } },
      topReviews: { bsonType: 'array', maxItems: 3 },
      kho: { bsonType: 'array', maxItems: 10, items: { bsonType: 'object', required: ['ma', 'ton'], properties: { ton: { bsonType: 'int', minimum: 0 } } } },
    } } } });
  db.products.createIndex({ 'attrs.k': 1, 'attrs.v': 1 });
  db.products.createIndex({ category: 1, price: 1 });

  // Đánh giá: một–nhiều ⇒ collection riêng, con trỏ về cha + index theo trang "mọi đánh giá".
  db.reviews.createIndex({ productId: 1, at: -1 });
  db.createCollection('customers', { validator: { $jsonSchema: { properties: {
    wishlist: { bsonType: 'array', maxItems: 50, items: { bsonType: 'object', required: ['productId', 'at'] } } } } } });
  db.createCollection('orders', { validator: { $jsonSchema: { required: ['customer', 'items', 'status'], properties: {
    items: { bsonType: 'array', minItems: 1, maxItems: 100 },
    history: { bsonType: 'array', maxItems: 20 } } } } });
  db.orders.createIndex({ 'customer._id': 1, createdAt: -1 });
  db.coupons.insertOne({ _id: 'GIAM50K', toiDa: 2, daDung: 0 });
  db.couponUses.createIndex({ code: 1, customerId: 1 }, { unique: true });
  db.dailyRevenue.createIndex({ ngay: 1 }, { unique: true });
  db.products.insertMany([
    { _id: 'SP002', name: 'Laptop Lập Trình 15', category: 'laptop', price: Decimal128('19008000'),
      attrs: [{ k: 'ramGB', v: 16 }, { k: 'ssdGB', v: 512 }, { k: 'cpu', v: 'i7' }], topReviews: [], rating: { tong: 0, n: 0 },
      kho: [{ ma: 'HN', ton: 3 }, { ma: 'DN', ton: 1 }, { ma: 'HCM', ton: 5 }] },
    { _id: 'SP009', name: 'Clean Code', category: 'book', price: Decimal128('278400'),
      attrs: [{ k: 'author', v: 'Robert C. Martin' }, { k: 'pages', v: 464 }], topReviews: [], rating: { tong: 0, n: 0 }, kho: [{ ma: 'HCM', ton: 40 }] },
  ]);
  db.customers.insertMany([{ _id: 'KH0042', name: 'Ngô Hải Chi', wishlist: [] }, { _id: 'KH0066', name: 'Bùi Ngọc Linh', wishlist: [] }]);
  return 'lab3: đã dựng ' + db.getCollectionNames().sort().join(', ');
}

// US5 — Trừ tồn ở một kho: điều kiện $elemMatch ⇒ không bao giờ âm (Bài 2.5); validator ton ≥ 0 là lớp chặn cuối.
function truKho(productId, ma, sl) {
  return db.products.updateOne({ _id: productId, kho: { $elemMatch: { ma, ton: { $gte: sl } } } }, { $inc: { 'kho.$.ton': -sl } }).modifiedCount;
}

function themDanhGia(productId, customerId, stars, text) {
  const at = new Date();
  db.reviews.insertOne({ productId, customerId, stars, text, at });
  // Subset + computed trong MỘT lệnh cập nhật nguyên tử trên sản phẩm.
  return db.products.updateOne({ _id: productId }, {
    $push: { topReviews: { $each: [{ stars, text: text.slice(0, 200), at }], $position: 0, $slice: 3 } },
    $inc: { 'rating.tong': stars, 'rating.n': 1 } }).modifiedCount;
}

// US2 — Wishlist: một–vài có giới hạn (≤ 50) và chỉ khách đó đọc ⇒ nhúng mảng productId trong khách (KHÔNG chép giá: giá phải là giá hiện tại).
function thich(customerId, productId) {
  // $ne trong bộ lọc ⇒ thêm hai lần cùng sản phẩm không tạo bản trùng (giống $addToSet nhưng giữ được trường at).
  return db.customers.updateOne({ _id: customerId, 'wishlist.productId': { $ne: productId } },
    { $push: { wishlist: { productId, at: new Date() } } }).modifiedCount;
}
function trangWishlist(customerId) {
  const kh = db.customers.findOne({ _id: customerId }, { wishlist: 1 });
  const ids = (kh?.wishlist ?? []).map((w) => w.productId);
  return db.products.find({ _id: { $in: ids } }, { name: 1, price: 1 }).toArray();   // ≤ 50 id ⇒ $in nhỏ, có giới hạn
}

// US3 — Đơn: dòng hàng + giá = ẢNH CHỤP; khách = extended reference { _id, name } (đơn mở được làm mới khi đổi tên);
// lịch sử trạng thái: một–vài (≤ 20 lần chuyển) ⇒ nhúng.
function doiTrangThai(orderId, tu, sang, ai) {
  // Điều kiện status: tu ⇒ hai người cùng đổi một đơn thì chỉ một người thắng (Bài 2.5).
  return db.orders.updateOne({ _id: orderId, status: tu },
    { $set: { status: sang }, $push: { history: { tu, sang, ai, at: new Date() } } }).modifiedCount;
}

// US4 — Mã giảm giá: mỗi khách dùng một lần ⇒ collection nối couponUses + index duy nhất; tổng lượt ⇒ cập nhật có điều kiện.
function dungMa(code, customerId) {
  try { db.couponUses.insertOne({ code, customerId, at: new Date() }); }
  catch (e) { if (e.code === 11000) return 'đã dùng rồi'; throw e; }
  const r = db.coupons.updateOne({ _id: code, $expr: { $lt: ['$daDung', '$toiDa'] } }, { $inc: { daDung: 1 } });
  if (r.modifiedCount === 0) { db.couponUses.deleteOne({ code, customerId }); return 'hết lượt'; }   // hoàn lại lượt giữ chỗ
  return 'ok';
}

// US6 — Doanh thu theo ngày: computed + bucket (một tài liệu mỗi ngày), cập nhật bằng $inc khi đơn được trả tiền.
function ghiDoanhThu(order) {
  const ngay = order.createdAt.toISOString().slice(0, 10);   // UTC; báo cáo theo giờ VN thì đổi múi giờ trước (Bài 1.2)
  db.dailyRevenue.updateOne({ ngay }, { $inc: { tong: order.total, soDon: 1 } }, { upsert: true });
}`;

const GIAI_EN = `
<p><strong>The design, one line per user story</strong> (the "why" column is what the defence committee asks for):</p>
<table>
<thead><tr><th>Story</th><th>Decision</th><th>Pattern / guarantee</th></tr></thead>
<tbody>
<tr><td>US1 product page</td><td>one <code>products</code> document: attrs, 3 newest reviews, rating sum + count</td><td>attribute + subset + computed; reviews in their own collection (one-to-many)</td></tr>
<tr><td>US2 wishlist ≤ 50</td><td>array of <code>{ productId, at }</code> inside the customer, <em>no price copy</em></td><td>one-to-few, <code>maxItems: 50</code>; current price read with a bounded <code>$in</code></td></tr>
<tr><td>US3 status history</td><td>embedded <code>history</code> array in the order, ≤ 20</td><td>one-to-few; state-guarded update (<code>status: tu</code>) so two transitions cannot both win</td></tr>
<tr><td>US4 coupon once per customer, N in total</td><td>link collection <code>couponUses</code> + counter in <code>coupons</code></td><td>unique index <code>{ code, customerId }</code>; conditional <code>$inc</code> with <code>$expr</code>; compensation on "sold out"</td></tr>
<tr><td>US5 stock per warehouse</td><td>embedded <code>kho: [{ ma, ton }]</code>, ≤ 10</td><td>one-to-few; <code>$elemMatch</code> condition + positional <code>$</code>; validator <code>ton ≥ 0</code> as last line of defence</td></tr>
<tr><td>US6 daily revenue</td><td>one <code>dailyRevenue</code> document per day</td><td>bucket + computed; <code>upsert</code> with <code>$inc</code>, unique index on <code>ngay</code></td></tr>
</tbody></table>
<p><strong>The whole solution file</strong> (<code>_demo/lab3-giai.js</code>; <code>load()</code> only defines functions, <code>dungLab3()</code> rebuilds the database):</p>
${ma('javascript', GIAI_MA)}
<p><strong>Build, then US1</strong> — four reviews; the product page is one read with the three newest reviews and the rating 18 / 4:</p>
${lenh('s03-6-lab', 0)}
${lenh('s03-6-lab', 1)}
<p><strong>US5</strong> — taking 2 from Đà Nẵng (stock 1) is refused by the condition (0 modified), taking 2 from HCM works (5 → 3). A buggy update without the condition is stopped by the validator (121):</p>
${lenh('s03-6-lab', 2)}
${lenh('s03-6-lab', 3)}
<p><strong>US2</strong> — liking SP002 twice adds it once (<code>[1, 0, …]</code>); after filling the list to 50, the 51st like is rejected by the validator (121). The page shows current prices:</p>
${lenh('s03-6-lab', 4)}
<p><strong>US3</strong> — PENDING → PAID succeeds; a simultaneous "cancel" that still believes the order is PENDING gets 0; PAID → SHIPPED succeeds. The history records who did what:</p>
${lenh('s03-6-lab', 5)}
<p><strong>US4</strong> — limit 2 uses: KH0042 ok, KH0042 again "already used" (E11000 on the link collection), KH0066 ok, KH0001 "sold out" — and its reserved row was removed, so 2 uses and 2 rows:</p>
${lenh('s03-6-lab', 6)}
<p><strong>US6</strong> — two paid orders on 24/11 (UTC) in one daily document:</p>
${lenh('s03-6-lab', 7)}
<p><strong>Sizes</strong> — the largest product document is under 500 bytes and bounded by its validator (3 reviews, 10 warehouses, attrs):</p>
${lenh('s03-6-lab', 8)}
<p><strong>What this design does not protect against</strong> (write it in the README): the review insert and the product update are two writes — a crash between them leaves the rating one short until the nightly reconciliation (Lesson 3.3); the coupon reservation and the counter are two writes too (Chapter 6 makes them one transaction). Revenue days are UTC days — a Vietnamese report must convert first (Lesson 1.2).</p>
`;

const GIAI_VI = `
<p><strong>Thiết kế, mỗi user story một dòng</strong> (cột "vì sao" là thứ hội đồng bảo vệ sẽ hỏi):</p>
<table>
<thead><tr><th>Story</th><th>Quyết định</th><th>Pattern / bảo đảm</th></tr></thead>
<tbody>
<tr><td>US1 trang sản phẩm</td><td>một tài liệu <code>products</code>: attrs, 3 đánh giá mới nhất, tổng + số lượng điểm</td><td>attribute + subset + computed; đánh giá ở collection riêng (một–nhiều)</td></tr>
<tr><td>US2 wishlist ≤ 50</td><td>mảng <code>{ productId, at }</code> trong khách, <em>không chép giá</em></td><td>một–vài, <code>maxItems: 50</code>; giá hiện tại đọc bằng một <code>$in</code> có giới hạn</td></tr>
<tr><td>US3 lịch sử trạng thái</td><td>mảng <code>history</code> nhúng trong đơn, ≤ 20</td><td>một–vài; cập nhật có chốt trạng thái (<code>status: tu</code>) để hai lần chuyển không cùng thắng</td></tr>
<tr><td>US4 mã giảm giá mỗi khách một lần, tổng N lần</td><td>collection nối <code>couponUses</code> + bộ đếm trong <code>coupons</code></td><td>index duy nhất <code>{ code, customerId }</code>; <code>$inc</code> có điều kiện bằng <code>$expr</code>; hoàn lại khi "hết lượt"</td></tr>
<tr><td>US5 tồn theo kho</td><td>nhúng <code>kho: [{ ma, ton }]</code>, ≤ 10</td><td>một–vài; điều kiện <code>$elemMatch</code> + toán tử vị trí <code>$</code>; validator <code>ton ≥ 0</code> là lớp chặn cuối</td></tr>
<tr><td>US6 doanh thu theo ngày</td><td>mỗi ngày một tài liệu <code>dailyRevenue</code></td><td>bucket + computed; <code>upsert</code> kèm <code>$inc</code>, index duy nhất trên <code>ngay</code></td></tr>
</tbody></table>
<p><strong>Toàn bộ tệp lời giải</strong> (<code>_demo/lab3-giai.js</code>; <code>load()</code> chỉ định nghĩa hàm, <code>dungLab3()</code> dựng lại database):</p>
${ma('javascript', GIAI_MA)}
<p><strong>Dựng, rồi US1</strong> — bốn đánh giá; trang sản phẩm là một lần đọc có ba đánh giá mới nhất và điểm 18 / 4:</p>
${lenh('s03-6-lab', 0)}
${lenh('s03-6-lab', 1)}
<p><strong>US5</strong> — lấy 2 từ kho Đà Nẵng (còn 1) bị điều kiện từ chối (0 tài liệu sửa), lấy 2 từ kho HCM thì được (5 → 3). Một lệnh cập nhật lỗi không có điều kiện bị validator chặn (121):</p>
${lenh('s03-6-lab', 2)}
${lenh('s03-6-lab', 3)}
<p><strong>US2</strong> — thích SP002 hai lần chỉ thêm một lần (<code>[1, 0, …]</code>); sau khi lấp danh sách tới 50, lượt thích thứ 51 bị validator từ chối (121). Trang hiện giá hiện tại:</p>
${lenh('s03-6-lab', 4)}
<p><strong>US3</strong> — PENDING → PAID thành công; một lệnh "huỷ" đồng thời vẫn tưởng đơn đang PENDING nhận 0; PAID → SHIPPED thành công. Lịch sử ghi rõ ai làm gì:</p>
${lenh('s03-6-lab', 5)}
<p><strong>US4</strong> — giới hạn 2 lượt: KH0042 được, KH0042 lần nữa "đã dùng rồi" (E11000 trên collection nối), KH0066 được, KH0001 "hết lượt" — và dòng giữ chỗ của nó đã bị gỡ, nên còn 2 lượt và 2 dòng:</p>
${lenh('s03-6-lab', 6)}
<p><strong>US6</strong> — hai đơn đã trả tiền ngày 24/11 (UTC) nằm trong một tài liệu ngày:</p>
${lenh('s03-6-lab', 7)}
<p><strong>Kích thước</strong> — tài liệu sản phẩm lớn nhất dưới 500 byte và bị validator giới hạn (3 đánh giá, 10 kho, attrs):</p>
${lenh('s03-6-lab', 8)}
<p><strong>Những gì thiết kế này không bảo vệ được</strong> (ghi vào README): chèn đánh giá và cập nhật sản phẩm là hai lần ghi — sập giữa chừng thì điểm thiếu một lượt cho tới lần đối soát đêm (Bài 3.3); giữ chỗ mã giảm giá và bộ đếm cũng là hai lần ghi (Chương 6 gộp chúng thành một transaction). Ngày doanh thu là ngày UTC — báo cáo giờ Việt Nam phải đổi trước (Bài 1.2).</p>
`;

export default {
  title: '3.6 — Lab: design the CT Shop schema from user stories|||3.6 — Lab: thiết kế schema CT Shop từ user story',
  slug: 'mgo-3-6-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 120 phút: từ sáu user story của CT Shop (trang sản phẩm một lần đọc, wishlist tối đa 50, lịch sử trạng thái đơn, mã giảm giá mỗi khách một lần, tồn theo kho, doanh thu theo ngày) viết tài liệu thiết kế có bảng tải công việc và cột "vì sao", dựng collection + validator + index, cài sáu hàm và chứng minh từng bảo đảm bằng lệnh chạy thật — rubric 10 điểm, câu hỏi bảo vệ thiết kế, lời giải chạy thật được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab</span>
<h2>Lab: design the CT Shop schema from user stories</h2>
<p class="lead">In a real project nobody hands you collections — you get user stories. Here are six for CT Shop. Your job is the full design cycle of this chapter: workload table, one decision per relationship with its reason, validators that enforce every bound, the functions that keep copies and counters correct, and a proof for each guarantee. Then defend it as you would in a design review.</p>

<h3>The user stories</h3>
<ol>
<li><strong>US1 — Product page.</strong> As a shopper I see name, price, the attributes of that kind of product, the 3 newest reviews and the average rating — fast (this page is 60% of traffic).</li>
<li><strong>US2 — Wishlist.</strong> As a customer I can save up to 50 products and see them with their <em>current</em> price.</li>
<li><strong>US3 — Order status history.</strong> As support staff I see every status change of an order: from, to, who, when. Two staff must not be able to apply conflicting changes.</li>
<li><strong>US4 — Coupons.</strong> A coupon can be used N times in total and at most once per customer.</li>
<li><strong>US5 — Stock per warehouse.</strong> Each product has stock in up to 10 warehouses; an order takes stock from one warehouse and must never make it negative.</li>
<li><strong>US6 — Daily revenue.</strong> The owner's dashboard shows revenue per day for the last year, instantly.</li>
</ol>

<h3>Tasks</h3>
<ol>
<li><strong>Design document</strong> (<code>THIET-KE.md</code>): the workload table (operation, frequency, fields), then one row per relationship — few/many/squillions, upper bound, embed/reference, pattern, the index that serves it, and <em>why</em>.</li>
<li><strong>Build script</strong> in a database <code>lab3</code>: collections with validators that enforce every bound you wrote (<code>maxItems</code>, <code>minimum</code>…), and the indexes.</li>
<li><strong>Six functions</strong>, one per story: add a review (US1), like a product + wishlist page (US2), change order status (US3), use a coupon (US4), take stock (US5), record revenue (US6).</li>
<li><strong>Proof per story</strong>: run the case that must succeed and the case that must be refused (double like, 51st like, conflicting status change, second use of a coupon, coupon sold out, negative stock).</li>
<li><strong>Size check</strong>: <code>$bsonSize</code> of your largest document, and the bound that keeps it there.</li>
<li><strong>README</strong>: two failures your design does not handle yet.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Workload table + a reason for every relationship decision that mentions a query or a bound</td><td>2</td></tr>
<tr><td>Product page in one read: attribute + subset + computed (sum and count, not average) maintained with atomic operators</td><td>2</td></tr>
<tr><td>Every array has a bound enforced by a validator; wishlist does not copy the price</td><td>2</td></tr>
<tr><td>Coupon: unique index on the link collection + conditional counter + compensation; status: state-guarded update; stock: <code>$elemMatch</code> condition</td><td>3</td></tr>
<tr><td>Proofs shown for success and refusal of each story; README names two unhandled failures</td><td>1</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> <code>reviews: [...]</code> embedded without bound (−2, Lesson 3.5); average stored and recomputed in the application (−1, lost updates); wishlist copying <code>price</code> (−1, stale price shown as current); coupon check with <code>findOne</code> then <code>insertOne</code> (−2, two requests at once both pass); status changed with <code>$set</code> only (−1, conflicting changes both "succeed").</p>

<h3>Defend your design (questions a reviewer will ask)</h3>
<ul>
<li>"Why is the wishlist embedded but reviews are not?" — bound (50 vs unbounded) and who reads it.</li>
<li>"What happens if the process dies after inserting the review but before updating the product?"</li>
<li>"A customer clicks 'use coupon' twice in 10 ms. Walk me through both requests."</li>
<li>"Which index serves the 'all reviews' page? Show me the explain."</li>
<li>"Revenue of 24/11 in Vietnam time — is your daily document right?"</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your design runs — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 3 of the course project (<code>mgo-moc-3</code>) is exactly this document for your own topic: a table of top queries with frequency, every relationship with cardinality and reason, at least two named patterns, and a stated bound for every array — and the seed and queries of milestones 1–2 updated to the new design. Use this lab's table as the template.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['User story', 'A requirement written from a user\'s point of view; the raw input for the workload table.'],
  ['Design document', 'Workload table + one justified decision per relationship + indexes + known failure modes.'],
  ['Compensation', 'Undoing an earlier write by hand when a later one fails (remove the coupon reservation).'],
  ['State-guarded update', 'An update whose filter contains the expected current state, so only one transition can win.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab</span>
<h2>Lab: thiết kế schema CT Shop từ user story</h2>
<p class="lead">Trong dự án thật, chẳng ai đưa sẵn collection cho bạn — bạn nhận user story. Đây là sáu story của CT Shop. Việc của bạn là trọn vòng thiết kế của chương này: bảng tải công việc, mỗi quan hệ một quyết định kèm lý do, validator ép mọi giới hạn, các hàm giữ bản chép và bộ đếm luôn đúng, và một bằng chứng cho mỗi bảo đảm. Rồi bảo vệ nó như trong một buổi review thiết kế.</p>

<h3>Các user story</h3>
<ol>
<li><strong>US1 — Trang sản phẩm.</strong> Là người mua, tôi thấy tên, giá, các thuộc tính của loại hàng đó, 3 đánh giá mới nhất và điểm trung bình — thật nhanh (trang này chiếm 60% lưu lượng).</li>
<li><strong>US2 — Wishlist.</strong> Là khách hàng, tôi lưu được tối đa 50 sản phẩm và xem chúng kèm giá <em>hiện tại</em>.</li>
<li><strong>US3 — Lịch sử trạng thái đơn.</strong> Là nhân viên hỗ trợ, tôi thấy mọi lần đổi trạng thái của một đơn: từ, sang, ai, lúc nào. Hai nhân viên không được áp hai thay đổi mâu thuẫn nhau.</li>
<li><strong>US4 — Mã giảm giá.</strong> Một mã dùng được tổng cộng N lần và mỗi khách tối đa một lần.</li>
<li><strong>US5 — Tồn theo kho.</strong> Mỗi sản phẩm có tồn ở tối đa 10 kho; một đơn lấy hàng từ một kho và không bao giờ được làm tồn âm.</li>
<li><strong>US6 — Doanh thu theo ngày.</strong> Dashboard của chủ shop hiện doanh thu từng ngày trong năm qua, tức thì.</li>
</ol>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Tài liệu thiết kế</strong> (<code>THIET-KE.md</code>): bảng tải công việc (thao tác, tần suất, trường cần), rồi mỗi quan hệ một dòng — vài/nhiều/vô số, giới hạn trên, nhúng/tham chiếu, pattern, index phục vụ nó, và <em>vì sao</em>.</li>
<li><strong>Kịch bản dựng</strong> trong database <code>lab3</code>: collection kèm validator ép mọi giới hạn bạn đã viết (<code>maxItems</code>, <code>minimum</code>…), và các index.</li>
<li><strong>Sáu hàm</strong>, mỗi story một hàm: thêm đánh giá (US1), thích sản phẩm + trang wishlist (US2), đổi trạng thái đơn (US3), dùng mã giảm giá (US4), lấy hàng khỏi kho (US5), ghi doanh thu (US6).</li>
<li><strong>Bằng chứng cho mỗi story</strong>: chạy trường hợp phải thành công và trường hợp phải bị từ chối (thích hai lần, lượt thích thứ 51, đổi trạng thái mâu thuẫn, dùng mã lần hai, mã hết lượt, tồn âm).</li>
<li><strong>Kiểm kích thước</strong>: <code>$bsonSize</code> của tài liệu lớn nhất, và giới hạn giữ nó ở mức đó.</li>
<li><strong>README</strong>: hai kiểu hỏng mà thiết kế của bạn chưa xử lý.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Bảng tải công việc + lý do cho mọi quyết định quan hệ, có nhắc tới một truy vấn hoặc một giới hạn</td><td>2</td></tr>
<tr><td>Trang sản phẩm một lần đọc: attribute + subset + computed (tổng và số lượng, không lưu trung bình) giữ bằng toán tử nguyên tử</td><td>2</td></tr>
<tr><td>Mọi mảng có giới hạn được validator ép; wishlist không chép giá</td><td>2</td></tr>
<tr><td>Mã giảm giá: index duy nhất trên collection nối + bộ đếm có điều kiện + hoàn lại; trạng thái: cập nhật có chốt trạng thái; tồn kho: điều kiện <code>$elemMatch</code></td><td>3</td></tr>
<tr><td>Có bằng chứng thành công và từ chối cho từng story; README nêu hai kiểu hỏng chưa xử lý</td><td>1</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ:</strong> nhúng <code>reviews: [...]</code> không giới hạn (−2, Bài 3.5); lưu điểm trung bình rồi tính lại trong ứng dụng (−1, mất cập nhật); wishlist chép <code>price</code> (−1, giá cũ hiện như giá hiện tại); kiểm mã giảm giá bằng <code>findOne</code> rồi <code>insertOne</code> (−2, hai yêu cầu cùng lúc đều lọt); đổi trạng thái chỉ bằng <code>$set</code> (−1, hai thay đổi mâu thuẫn đều "thành công").</p>

<h3>Bảo vệ thiết kế (câu người review sẽ hỏi)</h3>
<ul>
<li>"Vì sao wishlist được nhúng còn đánh giá thì không?" — giới hạn (50 so với không giới hạn) và ai là người đọc.</li>
<li>"Chuyện gì xảy ra nếu tiến trình chết sau khi chèn đánh giá nhưng trước khi cập nhật sản phẩm?"</li>
<li>"Một khách bấm 'dùng mã' hai lần trong 10 ms. Kể tôi nghe từng bước của cả hai yêu cầu."</li>
<li>"Index nào phục vụ trang 'mọi đánh giá'? Cho tôi xem explain."</li>
<li>"Doanh thu ngày 24/11 theo giờ Việt Nam — tài liệu ngày của bạn có đúng không?"</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi thiết kế của bạn đã chạy — lời giải đầy đủ, chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 3 của dự án xuyên khoá (<code>mgo-moc-3</code>) chính là tài liệu này cho đề tài của bạn: bảng truy vấn chính kèm tần suất, mọi quan hệ kèm số lượng và lý do, ít nhất hai pattern có tên, và giới hạn ghi rõ cho mọi mảng — cùng bộ nạp và truy vấn của mốc 1–2 được cập nhật theo thiết kế mới. Dùng bảng của lab này làm mẫu.</p>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['User story', 'Yêu cầu viết từ góc nhìn người dùng; đầu vào thô cho bảng tải công việc.'],
  ['Tài liệu thiết kế', 'Bảng tải công việc + mỗi quan hệ một quyết định có lý do + index + các kiểu hỏng đã biết.'],
  ['Hoàn lại (compensation)', 'Gỡ thủ công một lần ghi trước khi lần ghi sau thất bại (xoá dòng giữ chỗ mã giảm giá).'],
  ['Cập nhật có chốt trạng thái', 'Lệnh cập nhật có trạng thái hiện tại mong đợi trong bộ lọc, nên chỉ một lần chuyển trạng thái thắng.'],
])}
</div>
`,
};
