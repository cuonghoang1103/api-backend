/**
 * 3.3 — Pattern I: attribute, extended reference, subset, computed (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s03-3-p1'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s03/s03-3-p1.txt, database ch3 — chạy SAU s03-1, s03-2).
 * Số đối chiếu: 14 tên trường khác nhau; attrs + 1 index ⇒ 4 truy vấn khác thuộc tính đều IXSCAN, keys = nReturned (6/15/4/1); 2 index;
 * extended reference không index 2000 tài liệu / có index 20; đổi tên 14 đơn chưa giao; nhúng hết 1591 đánh giá = 103.593 byte vs subset 3 = 385 byte;
 * computed: đếm 1596 ⇒ chèn lách 1597/1596 ⇒ đối soát sửa. ms đổi theo lần chạy ⇒ lời chỉ nêu tỉ lệ.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '3.3 — Patterns I: attribute, extended reference, subset, computed|||3.3 — Pattern I: attribute, extended reference, subset, computed',
  slug: 'mgo-3-3-pattern-1',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bốn pattern thiết kế dùng hằng ngày, mỗi cái đo thật trên CT Shop: attribute (14 kiểu trường khác nhau gom vào mảng k/v, một index phục vụ mọi thuộc tính), extended reference (chép tên khách vào đơn, luật làm mới, index cho lệnh đồng bộ: 2000 → 20 tài liệu), subset (3 đánh giá mới nhất trong sản phẩm bằng $push $slice: 385 byte thay vì 103 KB), computed (giữ sẵn điểm trung bình bằng $inc, đối soát bắt lệch khi có đường ghi lách).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Patterns I: attribute, extended reference, subset, computed</h2>
<p class="lead">Lessons 3.1 and 3.2 gave you the two basic moves — embed or reference. Real schemas combine them in a small number of recurring shapes that MongoDB documents as <em>schema design patterns</em>. Knowing their names matters at work: "use an extended reference with a nightly refresh" is a whole design decision in one sentence. This lesson covers the four you will use in almost every project, each measured on CT Shop.</p>

<h3>An everyday picture: the product label, the address book, the shop window, the scoreboard</h3>
<p>A supermarket label lists only the attributes that product has — "volume" for milk, "size" for shoes — in one standard box (attribute). Your phone's contact list copies a friend's name and photo from their profile so the call screen shows them instantly (extended reference). A shop window shows three bestsellers; the rest are inside (subset). A football scoreboard shows "2 – 1" without recounting every goal when someone asks (computed). Four patterns, all about putting the <em>right part</em> of the data where the read needs it.</p>
${nguon('📘', 'Schema Design Patterns — MongoDB Docs', 'Computed values, group data, polymorphic data, versioning, archive, single collection', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/')}
${nguon('📝', 'Building with Patterns: A Summary — MongoDB blog', 'The original pattern catalogue with use cases', 'https://www.mongodb.com/blog/post/building-with-patterns-a-summary')}

<h3>Attribute pattern: many optional fields, one index</h3>
<p>CT Shop products have a different set of attributes per category:</p>
${lenh('s03-3-p1', 0)}
${lenh('s03-3-p1', 1)}
<p>Fourteen distinct field names across 60 products, and the list grows with every new category. The shop wants filters: "RAM ≥ 16 GB", "course ≥ 40 hours", "24-month warranty", "author is Martin Fowler". With one field per attribute you need one index per attribute you filter on — and a new index every time marketing invents a new filter. The attribute pattern moves the variable attributes into one array of key–value pairs:</p>
${lenh('s03-3-p1', 2)}
<p>Now one compound index on <code>{ 'attrs.k': 1, 'attrs.v': 1 }</code> serves <em>every</em> attribute, present and future:</p>
${lenh('s03-3-p1', 3)}
${lenh('s03-3-p1', 4)}
<p>Four different attributes, four <code>IXSCAN</code>s, and <code>keys</code> equals <code>n</code> each time — the index jumps straight to the matching entries. Two indexes in total (<code>_id</code> and <code>attrs</code>). Two details are essential: the query must use <code>$elemMatch</code> so <code>k</code> and <code>v</code> belong to the same pair (the two-element trap of Lesson 2.3), and values keep their types (16 is a number, so <code>$gte: 16</code> works; storing "16" would break range queries — Lesson 2.2).</p>
<p>The cost: documents are less readable, and validation per attribute becomes harder. Use the pattern for the <em>variable, filterable</em> part only; fields every product has (<code>name</code>, <code>price</code>, <code>category</code>) stay as normal fields.</p>

<h3>Extended reference: copy the few fields the read needs</h3>
<p>Lesson 3.1 built <code>ordersEmb</code>, where each order carries <code>customer: { _id, name }</code>. That is an extended reference: a normal reference (<code>_id</code>) extended with the fields the hot read displays. The pattern is only complete when you write down <strong>the refresh rule</strong>. For CT Shop:</p>
<ul>
<li>Orders already delivered keep the name at purchase time (it is printed on the invoice — snapshot).</li>
<li>Open orders (PENDING, PAID) are updated when the customer renames, so the delivery label is right.</li>
</ul>
<p>The rule needs an index, or every rename scans all orders:</p>
${lenh('s03-3-p1', 5)}
${lenh('s03-3-p1', 6)}
${lenh('s03-3-p1', 7)}
<p>2,000 documents examined without the index, 20 with it; the rename touched exactly the 14 open orders of KH0066. Put the refresh in the same service method that renames the customer, and test it. If the copied field changes often, or the business cannot tolerate a stale copy for even a second, it is not a candidate for this pattern (Lesson 3.1, question 4).</p>

<h3>Subset: the hot part inside, the rest outside</h3>
<p>The product page shows the three latest reviews. Embedding all reviews would be the one-to-many mistake of Lesson 3.2 — how big would SP002 be?</p>
${lenh('s03-3-p1', 8)}
<p>103,593 bytes of reviews in a document the page reads thousands of times a day, to show three of them. The subset pattern keeps <em>only</em> the hot part in the parent and the full set in its own collection. <code>$push</code> with <code>$position: 0</code> and <code>$slice: 3</code> keeps the embedded list newest-first and bounded in a single atomic update:</p>
${lenh('s03-3-p1', 9)}
<p>Four reviews written, the embedded list holds the newest three, the product is 385 bytes. The "see all reviews" page reads the <code>reviews</code> collection with the index from Lesson 3.2. Two writes per review (insert + update) is the price; if the second write fails, the subset is merely a little stale — the source of truth is <code>reviews</code>, and the next review fixes the window.</p>

<h3>Computed: pay at write time, not at every read</h3>
<p>The product page also shows the average rating. Computing it on every page view means aggregating 1,591 reviews each time. Measure both:</p>
${lenh('s03-3-p1', 10)}
<p>Reading the stored value is several times faster than recomputing — and the gap grows with the number of reviews, while the stored read stays one document. (Exact milliseconds change per run.) The computed pattern keeps <code>rating: { tong, n }</code> in the product and updates it with <code>$inc</code> in the same code path that inserts a review. Store the sum and the count, not the average: <code>$inc</code> on two numbers is atomic and never drifts through rounding; the average is <code>tong / n</code> when displayed.</p>
${lenh('s03-3-p1', 11)}

<h3>Every computed value needs a reconciliation</h3>
<p>The weakness of the pattern is any write path that forgets the <code>$inc</code>: a CSV import, an admin script, a second microservice. Simulate one, then run the check that every team with computed fields should schedule:</p>
${lenh('s03-3-p1', 12)}
${lenh('s03-3-p1', 13)}
${lenh('s03-3-p1', 14)}
<p>The reconciliation (recount from the source, compare with the stored value) finds SP002 one review off; recomputing with <code>$merge</code> fixes it. Run it nightly, alert when it finds anything — a non-empty result means some code path is bypassing the rule, and that is the bug to fix.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">attribute</span><span class="lz-t">many optional, filterable fields</span><span class="lz-d">array of {k, v} + one index on (k, v); query with $elemMatch</span></div>
  <div class="lz-step"><span class="lz-k">extended reference</span><span class="lz-t">a read needs a few fields of another entity</span><span class="lz-d">copy _id + those fields; written refresh rule + index for the refresh</span></div>
  <div class="lz-step"><span class="lz-k">subset</span><span class="lz-t">a read needs the newest/top N of a large set</span><span class="lz-d">$push + $position + $slice in the parent; full set in its own collection</span></div>
  <div class="lz-step"><span class="lz-k">computed</span><span class="lz-t">a value is read far more often than its inputs change</span><span class="lz-d">store sum + count, update with $inc; nightly reconciliation</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — storing the average and updating it with arithmetic in the application.</strong> <code>newAvg = (oldAvg * n + stars) / (n + 1)</code>, read-modify-write from Node. Two reviews arriving at once both read the same <code>oldAvg</code> and one is lost (the lost update of Lesson 2.4); rounding errors accumulate over thousands of reviews. Store the inputs (<code>tong</code>, <code>n</code>), change them with <code>$inc</code> on the server, and derive the average when reading.</p>
</div>

<h3>💼 At work: the filter screen that kept needing indexes</h3>
<p>A familiar story on e-commerce projects: every sprint, the client adds a new product filter ("screen size", "battery", "material"), and every sprint the team adds an index — until a collection has 30 indexes, inserts are slow (Lesson 3.5 measures this) and nobody knows which ones are used. Proposing the attribute pattern is a concrete, explainable improvement: one index, no migration for future filters. Bring the measurement — "four different filters, all <code>IXSCAN</code>, keys = results" — to the meeting.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you index products whose attributes differ by category?"</strong> — Attribute pattern: <code>attrs: [{ k, v }]</code> with a compound index on <code>attrs.k, attrs.v</code>, queried with <code>$elemMatch</code>.</li>
<li><strong>"What is an extended reference and what is its risk?"</strong> — A reference plus copied fields for a hot read; the risk is stale copies, handled with a written refresh rule and an index for it.</li>
<li><strong>"How do you show the latest N comments without loading all of them?"</strong> — Subset pattern: <code>$push</code> with <code>$each</code>, <code>$position: 0</code>, <code>$slice: N</code> in the parent; full list in a separate collection.</li>
<li><strong>"How do you keep a running average correct under concurrency?"</strong> — Store sum and count, <code>$inc</code> both atomically, compute the average on read, reconcile periodically.</li>
</ul>

<h3>🧪 Practice (35 minutes)</h3>
<div class="callout ok"><ol>
<li>Add the shirt variants' colours to <code>productsAttr.attrs</code> (one pair per distinct colour, key <code>color</code>) and find all products available in black, using the existing index.</li>
<li>Write the refresh rule for copying the product <em>name</em> into order lines: when does it change, which orders are refreshed, which never are?</li>
<li>Extend <code>themDanhGia</code> so it maintains both the subset and the computed rating in <em>one</em> update on the product, then run the reconciliation and show it returns <code>[]</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.productsAttr.find({ category: 'shirt' }).forEach((p) => db.productsAttr.updateOne({ _id: p._id }, { $addToSet: { attrs: { $each: [...new Set(p.variants.map((v) => v.color))].map((c) => ({ k: 'color', v: c })) } } }))</code>, then <code>db.productsAttr.find({ attrs: { $elemMatch: { k: 'color', v: 'đen' } } }, { name: 1 })</code>. <code>explain</code> shows <code>IXSCAN</code> on <code>attrs.k_1_attrs.v_1</code> — no new index needed.</p>
<p>2. Product names in order lines are part of the invoice ⇒ snapshot: never refreshed for delivered orders. A typo fix in the catalogue may refresh <em>open</em> orders only, by <code>items.productId</code> (index on <code>items.productId</code> needed). Write it in the design document.</p>
<p>3. <code>db.productsAttr.updateOne({ _id: productId }, { $push: { topReviews: { $each: [r], $position: 0, $slice: 3 } }, $inc: { 'rating.tong': stars, 'rating.n': 1 } })</code> — one atomic update on one document (Lesson 2.5) keeps both in step; only the <code>reviews</code> insert is a separate write.</p>
</details>
<p><strong>Done when:</strong> you can name the pattern behind each copied or derived field in your project and point to its refresh or reconciliation rule.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Attribute pattern', 'Variable attributes stored as an array of {k, v} pairs, served by one compound index.'],
  ['Extended reference', 'A reference plus a few copied fields needed by a frequent read; needs a refresh rule.'],
  ['Subset pattern', 'Only the hot part of a large related set (newest/top N) is embedded; the full set lives in its own collection.'],
  ['Computed pattern', 'A derived value (sum, count, total) stored and updated at write time instead of computed on every read.'],
  ['Reconciliation', 'A periodic job that recomputes derived values from the source of truth and reports or fixes differences.'],
  ['$slice in $push', 'Keeps an array bounded during the update: <code>$push: { arr: { $each: [x], $position: 0, $slice: N } }</code>.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Attribute: 14 kinds of fields became one <code>attrs</code> array; one index served four different filters with keys = results.</li>
<li>Extended reference: copy only what the hot read shows; the refresh rule needs its own index (2,000 → 20 documents examined).</li>
<li>Subset: three newest reviews inside the product = 385 bytes instead of 103 KB; <code>$slice</code> keeps it bounded atomically.</li>
<li>Computed: store sum and count, <code>$inc</code> them; reads become one small document.</li>
<li>Every copy or computed value has a source of truth and a scheduled reconciliation.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Pattern I: attribute, extended reference, subset, computed</h2>
<p class="lead">Bài 3.1 và 3.2 cho bạn hai nước đi cơ bản — nhúng hay tham chiếu. Schema thật kết hợp chúng thành một số ít hình dạng lặp đi lặp lại mà MongoDB gọi là <em>pattern thiết kế schema</em>. Biết tên chúng rất có ích khi đi làm: "dùng extended reference, làm mới mỗi đêm" là cả một quyết định thiết kế gói trong một câu. Bài này đi qua bốn pattern bạn sẽ dùng trong gần như mọi dự án, mỗi cái đều đo trên CT Shop.</p>

<h3>Hình ảnh đời thường: nhãn hàng, danh bạ, tủ kính, bảng tỉ số</h3>
<p>Nhãn hàng trong siêu thị chỉ ghi những thuộc tính sản phẩm đó có — "dung tích" cho sữa, "cỡ" cho giày — trong một ô chuẩn (attribute). Danh bạ điện thoại chép tên và ảnh bạn bè từ hồ sơ của họ để màn hình cuộc gọi hiện ngay (extended reference). Tủ kính cửa hàng bày ba món bán chạy; phần còn lại ở trong kho (subset). Bảng tỉ số bóng đá hiện "2 – 1" mà không phải đếm lại từng bàn thắng mỗi khi có người hỏi (computed). Bốn pattern, đều xoay quanh việc đặt <em>đúng phần</em> dữ liệu vào chỗ mà lần đọc cần.</p>
${nguon('📘', 'Schema Design Patterns — MongoDB Docs', 'Computed values, group data, polymorphic data, versioning, archive, single collection', 'https://www.mongodb.com/docs/manual/data-modeling/design-patterns/')}
${nguon('📝', 'Building with Patterns: A Summary — blog MongoDB', 'Danh mục pattern gốc kèm ca sử dụng', 'https://www.mongodb.com/blog/post/building-with-patterns-a-summary')}

<h3>Pattern attribute: nhiều trường tuỳ chọn, một index</h3>
<p>Sản phẩm CT Shop có bộ thuộc tính khác nhau theo từng loại:</p>
${lenh('s03-3-p1', 0)}
${lenh('s03-3-p1', 1)}
<p>Mười bốn tên trường khác nhau trên 60 sản phẩm, và danh sách dài thêm mỗi khi có loại hàng mới. Cửa hàng muốn có bộ lọc: "RAM ≥ 16 GB", "khoá học ≥ 40 giờ", "bảo hành 24 tháng", "tác giả là Martin Fowler". Nếu mỗi thuộc tính một trường, bạn cần mỗi thuộc tính một index — và thêm index mới mỗi lần bộ phận marketing nghĩ ra bộ lọc mới. Pattern attribute dời các thuộc tính biến đổi vào một mảng cặp khoá–giá trị:</p>
${lenh('s03-3-p1', 2)}
<p>Giờ một index ghép trên <code>{ 'attrs.k': 1, 'attrs.v': 1 }</code> phục vụ <em>mọi</em> thuộc tính, hiện tại lẫn tương lai:</p>
${lenh('s03-3-p1', 3)}
${lenh('s03-3-p1', 4)}
<p>Bốn thuộc tính khác nhau, bốn lần <code>IXSCAN</code>, và lần nào <code>keys</code> cũng bằng <code>n</code> — index nhảy thẳng tới các mục khớp. Tổng cộng chỉ hai index (<code>_id</code> và <code>attrs</code>). Có hai chi tiết bắt buộc: truy vấn phải dùng <code>$elemMatch</code> để <code>k</code> và <code>v</code> thuộc cùng một cặp (bẫy hai phần tử của Bài 2.3), và giá trị giữ nguyên kiểu (16 là số, nên <code>$gte: 16</code> chạy được; lưu "16" sẽ làm hỏng truy vấn khoảng — Bài 2.2).</p>
<p>Cái giá: tài liệu khó đọc hơn, và kiểm hợp lệ theo từng thuộc tính khó hơn. Chỉ dùng pattern cho phần <em>biến đổi, cần lọc</em>; các trường mọi sản phẩm đều có (<code>name</code>, <code>price</code>, <code>category</code>) vẫn để là trường thường.</p>

<h3>Extended reference: chép vài trường mà lần đọc cần</h3>
<p>Bài 3.1 đã dựng <code>ordersEmb</code>, trong đó mỗi đơn mang <code>customer: { _id, name }</code>. Đó là một extended reference: một tham chiếu thường (<code>_id</code>) được mở rộng thêm các trường mà lần đọc nóng hiển thị. Pattern chỉ hoàn chỉnh khi bạn viết ra <strong>luật làm mới</strong>. Với CT Shop:</p>
<ul>
<li>Đơn đã giao giữ tên lúc mua (nó được in trên hoá đơn — ảnh chụp).</li>
<li>Đơn đang mở (PENDING, PAID) được cập nhật khi khách đổi tên, để nhãn giao hàng đúng.</li>
</ul>
<p>Luật đó cần một index, nếu không mỗi lần đổi tên lại quét mọi đơn:</p>
${lenh('s03-3-p1', 5)}
${lenh('s03-3-p1', 6)}
${lenh('s03-3-p1', 7)}
<p>Không có index phải xét 2.000 tài liệu, có index chỉ 20; lệnh đổi tên chạm đúng 14 đơn đang mở của KH0066. Đặt bước làm mới ngay trong hàm dịch vụ đổi tên khách, và viết test cho nó. Nếu trường được chép đổi thường xuyên, hoặc nghiệp vụ không chịu được bản chép cũ dù chỉ một giây, thì nó không hợp với pattern này (Bài 3.1, câu hỏi 4).</p>

<h3>Subset: phần nóng ở trong, phần còn lại ở ngoài</h3>
<p>Trang sản phẩm hiện ba đánh giá mới nhất. Nhúng mọi đánh giá sẽ là sai lầm một–nhiều của Bài 3.2 — SP002 khi đó nặng bao nhiêu?</p>
${lenh('s03-3-p1', 8)}
<p>103.593 byte đánh giá trong một tài liệu mà trang đọc hàng nghìn lần mỗi ngày, chỉ để hiện ba cái. Pattern subset chỉ giữ phần nóng trong cha, còn trọn bộ ở collection riêng. <code>$push</code> kèm <code>$position: 0</code> và <code>$slice: 3</code> giữ danh sách nhúng theo thứ tự mới nhất trước và có giới hạn, chỉ trong một lệnh cập nhật nguyên tử:</p>
${lenh('s03-3-p1', 9)}
<p>Ghi bốn đánh giá, danh sách nhúng giữ ba cái mới nhất, sản phẩm nặng 385 byte. Trang "xem mọi đánh giá" đọc collection <code>reviews</code> bằng index của Bài 3.2. Cái giá là hai lần ghi cho mỗi đánh giá (chèn + cập nhật); nếu lần ghi thứ hai thất bại, subset chỉ hơi cũ — nguồn sự thật là <code>reviews</code>, và đánh giá kế tiếp sẽ sửa lại cửa sổ.</p>

<h3>Computed: trả giá lúc ghi, đừng trả ở mỗi lần đọc</h3>
<p>Trang sản phẩm còn hiện điểm trung bình. Tính nó ở mỗi lượt xem nghĩa là aggregate 1.591 đánh giá mỗi lần. Đo cả hai:</p>
${lenh('s03-3-p1', 10)}
<p>Đọc giá trị giữ sẵn nhanh hơn tính lại vài lần — và khoảng cách tăng theo số đánh giá, trong khi lần đọc giữ sẵn vẫn chỉ là một tài liệu. (Số mili giây chính xác đổi theo lần chạy.) Pattern computed giữ <code>rating: { tong, n }</code> trong sản phẩm và cập nhật bằng <code>$inc</code> ngay trong nhánh mã chèn đánh giá. Hãy lưu tổng và số lượng, đừng lưu trung bình: <code>$inc</code> trên hai con số là nguyên tử và không bao giờ trôi vì làm tròn; trung bình là <code>tong / n</code> lúc hiển thị.</p>
${lenh('s03-3-p1', 11)}

<h3>Mọi giá trị computed đều cần đối soát</h3>
<p>Điểm yếu của pattern là bất kỳ đường ghi nào quên <code>$inc</code>: một lần nhập CSV, một kịch bản quản trị, một microservice thứ hai. Giả lập một đường như vậy, rồi chạy phép kiểm mà mọi đội có trường computed nên đặt lịch:</p>
${lenh('s03-3-p1', 12)}
${lenh('s03-3-p1', 13)}
${lenh('s03-3-p1', 14)}
<p>Phép đối soát (đếm lại từ nguồn, so với giá trị giữ sẵn) phát hiện SP002 lệch một đánh giá; tính lại bằng <code>$merge</code> là sửa xong. Chạy nó mỗi đêm, báo động khi nó tìm thấy gì đó — kết quả khác rỗng nghĩa là có nhánh mã đang lách luật, và đó mới là lỗi cần sửa.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">attribute</span><span class="lz-t">nhiều trường tuỳ chọn, cần lọc</span><span class="lz-d">mảng {k, v} + một index trên (k, v); truy vấn bằng $elemMatch</span></div>
  <div class="lz-step"><span class="lz-k">extended reference</span><span class="lz-t">một lần đọc cần vài trường của thực thể khác</span><span class="lz-d">chép _id + các trường đó; luật làm mới viết rõ + index cho lệnh làm mới</span></div>
  <div class="lz-step"><span class="lz-k">subset</span><span class="lz-t">một lần đọc cần N cái mới nhất/tốt nhất của một tập lớn</span><span class="lz-d">$push + $position + $slice trong cha; trọn bộ ở collection riêng</span></div>
  <div class="lz-step"><span class="lz-k">computed</span><span class="lz-t">một giá trị được đọc thường xuyên hơn hẳn tần suất đầu vào đổi</span><span class="lz-d">lưu tổng + số lượng, cập nhật bằng $inc; đối soát mỗi đêm</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — lưu điểm trung bình rồi cập nhật bằng phép tính trong ứng dụng.</strong> <code>newAvg = (oldAvg * n + stars) / (n + 1)</code>, đọc–sửa–ghi từ Node. Hai đánh giá tới cùng lúc cùng đọc một <code>oldAvg</code> và một cái bị mất (lost update của Bài 2.4); sai số làm tròn tích tụ qua hàng nghìn đánh giá. Hãy lưu đầu vào (<code>tong</code>, <code>n</code>), đổi chúng bằng <code>$inc</code> trên máy chủ, và suy ra trung bình lúc đọc.</p>
</div>

<h3>💼 Đi làm: màn hình lọc cứ đòi thêm index</h3>
<p>Một câu chuyện quen thuộc ở dự án thương mại điện tử: sprint nào khách hàng cũng thêm một bộ lọc sản phẩm mới ("kích thước màn hình", "pin", "chất liệu"), và sprint nào đội cũng thêm một index — tới khi một collection có 30 index, lệnh chèn chậm (Bài 3.5 đo điều này) và chẳng ai biết index nào còn được dùng. Đề xuất pattern attribute là một cải tiến cụ thể, giải thích được: một index, không cần migration cho bộ lọc tương lai. Mang số đo tới buổi họp — "bốn bộ lọc khác nhau, đều <code>IXSCAN</code>, keys = số kết quả".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Đánh index thế nào cho sản phẩm có thuộc tính khác nhau theo loại?"</strong> — Pattern attribute: <code>attrs: [{ k, v }]</code> với index ghép trên <code>attrs.k, attrs.v</code>, truy vấn bằng <code>$elemMatch</code>.</li>
<li><strong>"Extended reference là gì và rủi ro của nó?"</strong> — Một tham chiếu cộng các trường chép cho lần đọc nóng; rủi ro là bản chép cũ, xử lý bằng luật làm mới viết rõ và một index cho nó.</li>
<li><strong>"Hiện N bình luận mới nhất mà không tải hết thế nào?"</strong> — Pattern subset: <code>$push</code> với <code>$each</code>, <code>$position: 0</code>, <code>$slice: N</code> trong cha; trọn danh sách ở collection riêng.</li>
<li><strong>"Giữ điểm trung bình chạy luôn đúng khi có ghi đồng thời thế nào?"</strong> — Lưu tổng và số lượng, <code>$inc</code> cả hai một cách nguyên tử, tính trung bình lúc đọc, đối soát định kỳ.</li>
</ul>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm màu của các biến thể áo vào <code>productsAttr.attrs</code> (mỗi màu khác nhau một cặp, khoá <code>color</code>) và tìm mọi sản phẩm có màu đen, dùng index sẵn có.</li>
<li>Viết luật làm mới cho việc chép <em>tên</em> sản phẩm vào dòng đơn: khi nào nó đổi, đơn nào được làm mới, đơn nào không bao giờ?</li>
<li>Mở rộng <code>themDanhGia</code> để nó giữ cả subset lẫn điểm computed trong <em>một</em> lệnh cập nhật sản phẩm, rồi chạy phép đối soát và cho thấy nó trả về <code>[]</code>.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>db.productsAttr.find({ category: 'shirt' }).forEach((p) => db.productsAttr.updateOne({ _id: p._id }, { $addToSet: { attrs: { $each: [...new Set(p.variants.map((v) => v.color))].map((c) => ({ k: 'color', v: c })) } } }))</code>, rồi <code>db.productsAttr.find({ attrs: { $elemMatch: { k: 'color', v: 'đen' } } }, { name: 1 })</code>. <code>explain</code> cho thấy <code>IXSCAN</code> trên <code>attrs.k_1_attrs.v_1</code> — không cần index mới.</p>
<p>2. Tên sản phẩm trong dòng đơn là một phần của hoá đơn ⇒ ảnh chụp: không bao giờ làm mới với đơn đã giao. Sửa lỗi chính tả trong danh mục chỉ được làm mới các đơn <em>đang mở</em>, theo <code>items.productId</code> (cần index trên <code>items.productId</code>). Ghi nó vào tài liệu thiết kế.</p>
<p>3. <code>db.productsAttr.updateOne({ _id: productId }, { $push: { topReviews: { $each: [r], $position: 0, $slice: 3 } }, $inc: { 'rating.tong': stars, 'rating.n': 1 } })</code> — một lệnh cập nhật nguyên tử trên một tài liệu (Bài 2.5) giữ cả hai khớp nhau; chỉ lệnh chèn vào <code>reviews</code> là lần ghi riêng.</p>
</details>
<p><strong>Xong khi:</strong> bạn gọi được tên pattern đứng sau mỗi trường được chép hay suy ra trong dự án, và chỉ ra luật làm mới hoặc luật đối soát của nó.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Pattern attribute', 'Thuộc tính biến đổi lưu thành mảng cặp {k, v}, phục vụ bằng một index ghép.'],
  ['Extended reference', 'Một tham chiếu cộng vài trường chép mà một lần đọc thường xuyên cần; cần luật làm mới.'],
  ['Pattern subset', 'Chỉ phần nóng của một tập liên quan lớn (N cái mới nhất/tốt nhất) được nhúng; trọn bộ ở collection riêng.'],
  ['Pattern computed', 'Một giá trị suy ra (tổng, số lượng, tổng tiền) được lưu và cập nhật lúc ghi thay vì tính ở mỗi lần đọc.'],
  ['Đối soát (reconciliation)', 'Tác vụ định kỳ tính lại giá trị suy ra từ nguồn sự thật, báo hoặc sửa chỗ lệch.'],
  ['$slice trong $push', 'Giữ mảng có giới hạn ngay trong lệnh cập nhật: <code>$push: { arr: { $each: [x], $position: 0, $slice: N } }</code>.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Attribute: 14 kiểu trường thành một mảng <code>attrs</code>; một index phục vụ bốn bộ lọc khác nhau với keys = số kết quả.</li>
<li>Extended reference: chỉ chép thứ lần đọc nóng hiển thị; luật làm mới cần index riêng (2.000 → 20 tài liệu phải xét).</li>
<li>Subset: ba đánh giá mới nhất trong sản phẩm = 385 byte thay vì 103 KB; <code>$slice</code> giữ giới hạn một cách nguyên tử.</li>
<li>Computed: lưu tổng và số lượng, <code>$inc</code> chúng; lần đọc chỉ còn một tài liệu nhỏ.</li>
<li>Mọi bản chép hay giá trị computed đều có một nguồn sự thật và một lịch đối soát.</li>
</ul>
</div>
`,
};
