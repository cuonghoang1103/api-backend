/**
 * 5.2 — $unwind và $lookup: nối, và cái giá của nó (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-2-lookup'] (MongoDB 8.0.38; ctshop + ch4.don; collection tạm ch5.donThu, ch4.k20, ctshop.vung xoá cuối kịch bản).
 * Số đối chiếu (tất định): 2000 đơn → 4969 dòng sau $unwind; SP003 Laptop Đồ Hoạ 16 doanh thu 5.094.144.000; tổng đúng 36.926.959.600 vs cộng sau
 * unwind 110.864.794.000; donThu 4 tài liệu → 3 dòng (mảng rỗng + thiếu trường bị bỏ) / preserve 5 dòng; top khách KH0192 Ngô Thu Hà 440.514.800;
 * đơn/khách min 3 max 20 TB 10; 20 khách × ch4.don: NestedLoopJoin hàng nghìn ms → IndexedLoopJoin vài ms, 385 khoá = 385 đơn; vung: HashJoin Bắc 77/Nam 51/Trung 72.
 * Sự cố thật (GET kiểm 24/11): Reinhart–Rogoff "Growth in a Time of Debt", phê bình Herndon–Ash–Pollin 04/2013 (Wikipedia).
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's05-2-lookup';

export default {
  title: '5.2 — $unwind and $lookup: joins, and what they cost|||5.2 — $unwind và $lookup: nối, và cái giá của nó',
  slug: 'mgo-5-2-unwind-lookup',
  type: 'LESSON',
  isFreePreview: false,
  description: '$unwind trải mảng thành nhiều dòng (2000 đơn → 4969 dòng món hàng) để báo cáo theo sản phẩm; hai bẫy đo thật: cộng tổng đơn sau khi trải bị nhân ba (36,9 → 110,9 tỉ), và $unwind mặc định làm mất tài liệu có mảng rỗng/thiếu trường. $lookup nối sang collection khác: gom + cắt trước rồi mới nối, $lookup có pipeline (2 đơn gần nhất mỗi khách), và cái giá: 20 khách nối vào 1 triệu đơn không index (NestedLoopJoin, hàng nghìn ms) so với có index (IndexedLoopJoin, vài ms), HashJoin cho bảng nhỏ. Sự cố thật Reinhart–Rogoff 2013.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>$unwind and $lookup: joins, and what they cost</h2>
<p class="lead">Lesson 5.1 grouped whole orders. But many business questions are about what is <em>inside</em> an order — "which product sells best?" — or need data from <em>another</em> collection — "show the customer's name". The first needs <code>$unwind</code>, which turns one document with an array into one document per element. The second needs <code>$lookup</code>, MongoDB's join. Both are easy to write and both have a way of producing wrong totals or slow pages. This lesson measures each.</p>

<h3>An everyday picture: the shopping bag and the receipt book</h3>
<p>One shopping bag holds several items. To count how many of each item the shop sold this month, the cashier takes every item out of every bag and lines them up — one line per item. That is <code>$unwind</code>. Now, if the cashier also writes the <em>bag's</em> total on every line and then adds the lines up, a bag with three items is counted three times. And a bag that came back empty simply does not appear on the table at all. For the second question — "who bought it?" — the cashier looks up the customer card in the filing cabinet. Looking up five cards is quick; looking up a card for every one of a million receipts, in a cabinet with no alphabetical order, takes all day. That is <code>$lookup</code> without an index.</p>

<h3>$unwind: one document per array element</h3>
${lenh(K, 0)}
<p>2,000 orders become 4,969 documents: each copy is the whole order with <code>items</code> replaced by one element. Now "sales per product" is an ordinary <code>$group</code> on <code>items.productId</code>:</p>
${lenh(K, 1)}
<p>Revenue per item is <code>$multiply: ['$items.price', '$items.qty']</code>, using the price saved in the order at purchase time (Lesson 3.1) — not today's catalogue price. The high-end laptops lead; Laptop Đồ Hoạ 16 brings 5.09 billion đồng from 134 units.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap 1 — adding order-level fields after $unwind.</strong> After unwinding, every element carries a copy of <code>total</code>. Summing it counts each order once per item:</p>
${lenh(K, 2)}
<p>36.9 billion is the real revenue; 110.9 billion is three times larger and looks like a great year. The rule: after <code>$unwind</code>, sum only element fields (<code>items.qty</code>, <code>items.price × qty</code>). If you need order-level totals too, compute them before the <code>$unwind</code>, or group back by <code>_id</code> first.</p>
<p><strong>Trap 2 — $unwind silently drops documents.</strong> By default, a document whose array is empty, <code>null</code> or missing produces <em>no</em> output:</p>
${lenh(K, 3)}
<p>Four orders in, three lines out — orders 2 and 3 have vanished (and a non-array value like <code>'C'</code> is treated as a one-element array). In a report "orders per customer" built with <code>$unwind</code>, the customers whose orders have no items disappear from the list. The fix is explicit:</p>
${lenh(K, 4)}
<p><code>preserveNullAndEmptyArrays: true</code> keeps them; <code>includeArrayIndex</code> records the position of each element (useful for "the first item of the order"). Decide which behaviour the report needs, and write it.</p>
</div>
${nguon('📘', '$unwind (aggregation) — MongoDB Docs', 'preserveNullAndEmptyArrays, includeArrayIndex, behaviour with non-array values', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/')}

<h3>⚠️ A real case: a spreadsheet that changed policy (2010–2013)</h3>
<p>In 2010, economists Carmen Reinhart and Kenneth Rogoff published "Growth in a Time of Debt", reporting that countries with public debt above 90% of GDP had sharply lower growth. The paper was widely cited in arguments for austerity after the 2008 crisis. In April 2013, Thomas Herndon, Michael Ash and Robert Pollin of the University of Massachusetts Amherst, working from the authors' own Excel spreadsheet, reported "coding errors, selective exclusion of available data, and unconventional weighting of summary statistics"; with their corrections, average growth above 90% debt was 2.2%, not −0.1%. No formula raised an error — rows were simply not included in an average. That is exactly the failure mode of this lesson: a report that silently leaves out documents (<code>$unwind</code> on empty arrays, a <code>$match</code> that is too strict) or counts some twice. The defence is the same as theirs should have been: a reconciliation check against a number computed another way.</p>
${nguon('📰', 'Growth in a Time of Debt — Wikipedia', 'The 2010 paper, the April 2013 Herndon–Ash–Pollin critique, 2.2% vs −0.1%', 'https://en.wikipedia.org/wiki/Growth_in_a_Time_of_Debt')}

<h3>$lookup: joining another collection</h3>
<p>The top customers by revenue — with their names, which live in <code>customers</code>:</p>
${lenh(K, 5)}
<p>Look at the order of the stages: <code>$group</code>, <code>$sort</code>, <code>$limit: 5</code>, and only then <code>$lookup</code>. The join runs five times, not 1,425 times. <code>$lookup</code> with <code>localField</code>/<code>foreignField</code> adds an <em>array</em> (<code>kh</code>) of every matching document — an array because there may be zero, one or many matches. The <code>$unwind</code> right after it turns the single match into an embedded document; MongoDB recognises the pair <code>$lookup + $unwind</code> and merges them internally, so no big array is built.</p>
<p>When you need only part of the joined documents — sorted, limited, projected — give <code>$lookup</code> a <code>pipeline</code>. Since 5.0 it can be combined with <code>localField</code>/<code>foreignField</code>. The two latest orders of each customer, three fields only:</p>
${lenh(K, 6)}
<p>And zero matches give an empty array, which <code>$size</code> turns into a count — "how many orders does each customer have?":</p>
${lenh(K, 7)}
<p>Every CT Shop customer has between 3 and 20 orders, 10 on average. A customer with no order would have <code>n: 0</code> — unlike <code>$unwind</code>, <code>$lookup</code> never drops the input document.</p>
${nguon('📘', '$lookup (aggregation) — MongoDB Docs', 'Equality match, pipeline and let, concise syntax since 5.0, sharded collections', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/')}

<h3>The cost of $lookup, measured</h3>
<p>For each input document, <code>$lookup</code> must find the matching documents in the other collection. How it does that is shown in <code>explain</code> as the <code>EQ_LOOKUP</code> stage's <code>strategy</code>. Twenty customer codes joined to the million orders of Chapter 4, first with no index on <code>khach</code>:</p>
${lenh(K, 8)}
<p><code>NestedLoopJoin</code>: for each of the 20 customers, scan the foreign collection. Twenty full passes over a million documents — several seconds for 385 matching orders. Add the index on the foreign field and run the same pipeline:</p>
${lenh(K, 9)}
${lenh(K, 10)}
<p><code>IndexedLoopJoin</code>: 385 index keys read for 385 orders found, a few milliseconds — hundreds of times faster. The rule is the one from Chapter 4, applied to the <em>other</em> collection: the <code>foreignField</code> of every <code>$lookup</code> in production needs an index (<code>_id</code> already has one).</p>
<p>There is a third strategy. When the foreign collection is small and has no usable index, the server reads it once, builds a hash table in memory and probes it for each input document:</p>
${lenh(K, 11)}
<p><code>HashJoin</code> for a six-row lookup table of regions. It is fine for small reference data; for a big foreign collection it would need a lot of memory (and spill to disk), so it is not a substitute for the index.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">NestedLoopJoin</span><span class="lz-t">scan the foreign collection for every input document</span><span class="lz-d">no index on foreignField — avoid on big collections</span></div>
  <div class="lz-step"><span class="lz-k">IndexedLoopJoin</span><span class="lz-t">an index lookup per input document</span><span class="lz-d">the normal case in production</span></div>
  <div class="lz-step"><span class="lz-k">HashJoin</span><span class="lz-t">read the foreign side once into a hash table</span><span class="lz-d">small foreign collection, no index, disk use allowed</span></div>
</div>

<h3>When $lookup is the wrong tool</h3>
<p><code>$lookup</code> exists so that you can answer a question you did not design for. If the same join runs on every page view, you are paying for it on every request — Chapter 3's question returns: should the data be embedded or copied (extended reference, Lesson 3.3)? A practical rule from teams that run MongoDB at scale: occasional joins in reports, admin screens and nightly jobs are normal; a <code>$lookup</code> in the hottest API call is a schema review item. Also keep in mind that each joined array lives inside one output document, so the 16 MB document limit applies to it (Lesson 5.5). Two related stages exist for rarer cases: <code>$unionWith</code> appends the documents of another collection (UNION ALL), and <code>$graphLookup</code> follows references recursively (category trees, Lesson 3.4).</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-10-2-chien-luoc-join', title: 'PostgreSQL 10.2 — Join strategies', sub: 'Nested loop, hash join and merge join — the same ideas in a relational planner' })}

<h3>💼 At work: the slow admin page</h3>
<p>A common OJT ticket: "the admin order list takes 8 seconds". The pipeline does <code>$lookup</code> from orders into customers <em>before</em> <code>$sort</code> and <code>$limit</code>, so it joins every order in the database to show twenty. Two changes fix it: move <code>$sort</code> + <code>$limit</code> (and <code>$skip</code> or keyset paging) before the <code>$lookup</code>, and check that <code>foreignField</code> is indexed. Bring the before/after explain (strategy and time) to the pull request — reviewers trust numbers, not "should be faster".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What does $unwind do, and what can go wrong?"</strong> — One output document per array element. It multiplies order-level fields (double counting) and, by default, drops documents with empty or missing arrays.</li>
<li><strong>"How do you make $lookup fast?"</strong> — Index the foreignField; reduce the input first ($match, $group, $limit before the join); project only needed fields with a lookup pipeline.</li>
<li><strong>"What join strategies does MongoDB use?"</strong> — Nested loop (no index), indexed loop (index on the foreign field), hash join (small foreign collection); visible in explain as EQ_LOOKUP strategy.</li>
<li><strong>"Why does $lookup return an array?"</strong> — Because the number of matches can be zero, one or many; $unwind or $first turns a single match into a field.</li>
<li><strong>"If you need $lookup on every request, what do you reconsider?"</strong> — The schema: embedding or copying the needed fields (extended reference) instead of joining at read time.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Finish the exercise of Lesson 5.1: revenue (PAID + SHIPPED) per product <strong>category</strong>. Do it with <code>$unwind</code> + <code>$group</code> by product first, then <code>$lookup</code> on 60 products — not one lookup per order line. Why is that order better?</li>
<li>Count orders per customer with <code>$unwind</code> on a join result instead of <code>$size</code>. Then insert a customer with no orders and compare both versions.</li>
<li>On <code>ch4.don</code>, measure <code>$lookup</code> from 200 customer codes with and without the <code>khach</code> index. Report the strategy and time of each.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>[{ $match: { status: { $in: ['PAID', 'SHIPPED'] } } }, { $unwind: '$items' }, { $group: { _id: '$items.productId', dt: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } }, { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'p' } }, { $group: { _id: { $first: '$p.category' }, dt: { $sum: '$dt' } } }, { $sort: { dt: -1 } }]</code>. Laptops come first by far. Grouping by product first reduces about 3,500 item lines to at most 60 documents, so the join runs at most 60 times instead of once per line.</p>
<p>2. <code>$lookup</code> then <code>$unwind: '$d'</code> then <code>$group</code> with <code>$sum: 1</code>: the customer without orders disappears (empty array dropped). With <code>$size</code> they appear with 0 — or use <code>preserveNullAndEmptyArrays: true</code> and count only non-null elements.</p>
<p>3. Without the index: NestedLoopJoin, time grows roughly linearly with the number of input customers (ten times more customers, about ten times longer — on the machine used to write this course, about 44 seconds). With the index: IndexedLoopJoin, 17 ms. Your times depend on the machine; the ratio is what matters.</p>
</details>
<p><strong>Done when:</strong> you can say for any pipeline with <code>$unwind</code> which fields may be summed, and for any <code>$lookup</code> which strategy it will use and why.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['$unwind', 'Outputs one document per element of an array field; drops empty/missing arrays unless preserveNullAndEmptyArrays.'],
  ['Double counting', 'Summing a parent-level field after $unwind, which repeats it once per element.'],
  ['$lookup', 'Left outer join to another collection in the same database; adds an array of matches.'],
  ['Lookup pipeline', 'A sub-pipeline run on the matched documents (filter, sort, limit, project).'],
  ['EQ_LOOKUP', 'The explain stage for an equality $lookup run by the slot-based engine; shows the strategy.'],
  ['NestedLoopJoin / IndexedLoopJoin / HashJoin', 'Scan per input / index lookup per input / one-time hash table of the foreign side.'],
  ['$unionWith', 'Appends documents from another collection to the stream (like UNION ALL).'],
])}
<h3>📌 Summary</h3>
<ul>
<li><code>$unwind</code> turns 2,000 orders into 4,969 item lines — sum item fields only; order totals become three times too big.</li>
<li><code>$unwind</code> drops empty or missing arrays by default; decide explicitly.</li>
<li><code>$lookup</code> adds an array of matches; reduce the input before joining.</li>
<li>Index every foreignField: NestedLoopJoin takes seconds where IndexedLoopJoin takes milliseconds.</li>
<li>A join on every request is a schema question, not only a performance one.</li>
<li>Reconcile report totals with a number computed another way — reports fail silently.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>$unwind và $lookup: nối, và cái giá của nó</h2>
<p class="lead">Bài 5.1 gom cả đơn hàng. Nhưng nhiều câu hỏi nghiệp vụ lại nói về thứ nằm <em>bên trong</em> đơn — "sản phẩm nào bán chạy nhất?" — hoặc cần dữ liệu ở một collection <em>khác</em> — "hiện tên khách". Câu đầu cần <code>$unwind</code>, thứ biến một tài liệu có mảng thành mỗi phần tử một tài liệu. Câu sau cần <code>$lookup</code>, phép nối của MongoDB. Cả hai đều dễ viết, và cả hai đều có cách cho ra tổng sai hoặc trang chậm. Bài này đo từng thứ.</p>

<h3>Hình ảnh đời thường: túi hàng và sổ hoá đơn</h3>
<p>Một túi hàng chứa nhiều món. Để đếm tháng này cửa hàng bán mỗi món bao nhiêu, thu ngân lấy từng món ra khỏi từng túi và xếp thành hàng — mỗi món một dòng. Đó là <code>$unwind</code>. Giờ nếu thu ngân còn ghi tổng tiền của <em>cả túi</em> lên mọi dòng rồi cộng các dòng lại, một túi ba món bị tính ba lần. Còn một túi trả về rỗng thì chẳng xuất hiện trên bàn chút nào. Với câu hỏi thứ hai — "ai đã mua?" — thu ngân tra thẻ khách trong tủ hồ sơ. Tra năm thẻ thì nhanh; tra một thẻ cho mỗi tờ trong một triệu hoá đơn, ở một cái tủ không xếp theo vần, thì mất cả ngày. Đó là <code>$lookup</code> không có index.</p>

<h3>$unwind: mỗi phần tử mảng một tài liệu</h3>
${lenh(K, 0)}
<p>2.000 đơn thành 4.969 tài liệu: mỗi bản sao là cả đơn hàng với <code>items</code> được thay bằng một phần tử. Giờ "doanh số theo sản phẩm" chỉ là một <code>$group</code> bình thường trên <code>items.productId</code>:</p>
${lenh(K, 1)}
<p>Doanh thu mỗi món là <code>$multiply: ['$items.price', '$items.qty']</code>, dùng giá đã lưu trong đơn lúc mua (Bài 3.1) — không phải giá danh mục hôm nay. Các mẫu laptop cao cấp dẫn đầu; Laptop Đồ Hoạ 16 đem về 5,09 tỉ đồng từ 134 máy.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy 1 — cộng trường cấp đơn sau khi $unwind.</strong> Sau khi trải, mỗi phần tử mang một bản sao của <code>total</code>. Cộng nó là tính mỗi đơn một lần cho mỗi món:</p>
${lenh(K, 2)}
<p>36,9 tỉ là doanh thu thật; 110,9 tỉ lớn gấp ba và trông như một năm làm ăn tuyệt vời. Luật: sau <code>$unwind</code>, chỉ cộng trường của phần tử (<code>items.qty</code>, <code>items.price × qty</code>). Nếu cần cả tổng cấp đơn, hãy tính nó trước <code>$unwind</code>, hoặc gom ngược lại theo <code>_id</code> trước.</p>
<p><strong>Bẫy 2 — $unwind lặng lẽ bỏ tài liệu.</strong> Mặc định, một tài liệu có mảng rỗng, <code>null</code> hoặc thiếu trường sẽ <em>không</em> cho ra dòng nào:</p>
${lenh(K, 3)}
<p>Bốn đơn vào, ba dòng ra — đơn 2 và đơn 3 đã biến mất (còn giá trị không phải mảng như <code>'C'</code> được coi là mảng một phần tử). Trong báo cáo "số đơn theo khách" dựng bằng <code>$unwind</code>, những khách có đơn không món nào biến khỏi danh sách. Cách sửa phải viết rõ ra:</p>
${lenh(K, 4)}
<p><code>preserveNullAndEmptyArrays: true</code> giữ chúng lại; <code>includeArrayIndex</code> ghi vị trí của từng phần tử (có ích cho "món đầu tiên của đơn"). Hãy quyết định báo cáo cần hành vi nào, và viết nó ra.</p>
</div>
${nguon('📘', '$unwind (aggregation) — MongoDB Docs', 'preserveNullAndEmptyArrays, includeArrayIndex, hành vi với giá trị không phải mảng', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/')}

<h3>⚠️ Chuyện có thật: một bảng tính đã đổi cả chính sách (2010–2013)</h3>
<p>Năm 2010, hai nhà kinh tế Carmen Reinhart và Kenneth Rogoff công bố "Growth in a Time of Debt", cho rằng các nước có nợ công trên 90% GDP tăng trưởng thấp hẳn. Bài báo được trích dẫn rộng rãi trong các lập luận ủng hộ thắt lưng buộc bụng sau khủng hoảng 2008. Tháng 4/2013, Thomas Herndon, Michael Ash và Robert Pollin ở Đại học Massachusetts Amherst, làm việc trên chính bảng tính Excel của tác giả, báo cáo "lỗi mã hoá, loại bỏ có chọn lọc dữ liệu sẵn có, và cách lấy trọng số bất thường"; sau khi sửa, tăng trưởng trung bình khi nợ trên 90% là 2,2%, không phải −0,1%. Không công thức nào báo lỗi — đơn giản là có những dòng không được tính vào trung bình. Đó đúng là kiểu hỏng của bài này: một báo cáo lặng lẽ bỏ sót tài liệu (<code>$unwind</code> trên mảng rỗng, một <code>$match</code> quá chặt) hoặc tính trùng. Cách phòng cũng như điều lẽ ra họ phải làm: một bước đối soát với con số tính bằng cách khác.</p>
${nguon('📰', 'Growth in a Time of Debt — Wikipedia', 'Bài báo 2010, phê bình của Herndon–Ash–Pollin tháng 4/2013, 2,2% so với −0,1%', 'https://en.wikipedia.org/wiki/Growth_in_a_Time_of_Debt')}

<h3>$lookup: nối sang collection khác</h3>
<p>Những khách mua nhiều nhất — kèm tên, mà tên thì nằm ở <code>customers</code>:</p>
${lenh(K, 5)}
<p>Nhìn thứ tự các stage: <code>$group</code>, <code>$sort</code>, <code>$limit: 5</code>, rồi mới tới <code>$lookup</code>. Phép nối chạy năm lần, không phải 1.425 lần. <code>$lookup</code> dùng <code>localField</code>/<code>foreignField</code> thêm vào một <em>mảng</em> (<code>kh</code>) gồm mọi tài liệu khớp — là mảng vì số tài liệu khớp có thể là không, một hay nhiều. <code>$unwind</code> ngay sau nó biến kết quả khớp duy nhất thành một tài liệu nhúng; MongoDB nhận ra cặp <code>$lookup + $unwind</code> và gộp chúng bên trong, nên không phải dựng mảng lớn.</p>
<p>Khi chỉ cần một phần của tài liệu được nối — có sắp xếp, có giới hạn, có chiếu trường — hãy đưa cho <code>$lookup</code> một <code>pipeline</code>. Từ 5.0 có thể dùng nó cùng <code>localField</code>/<code>foreignField</code>. Hai đơn gần nhất của mỗi khách, chỉ ba trường:</p>
${lenh(K, 6)}
<p>Còn không khớp thì ra mảng rỗng, và <code>$size</code> biến nó thành phép đếm — "mỗi khách có bao nhiêu đơn?":</p>
${lenh(K, 7)}
<p>Mọi khách của CT Shop có từ 3 tới 20 đơn, trung bình 10. Một khách chưa có đơn nào sẽ có <code>n: 0</code> — khác với <code>$unwind</code>, <code>$lookup</code> không bao giờ bỏ tài liệu đầu vào.</p>
${nguon('📘', '$lookup (aggregation) — MongoDB Docs', 'So khớp bằng, pipeline và let, cú pháp gọn từ 5.0, collection phân mảnh', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/')}

<h3>Cái giá của $lookup, đo thật</h3>
<p>Với mỗi tài liệu đầu vào, <code>$lookup</code> phải tìm các tài liệu khớp ở collection kia. Nó làm việc đó bằng cách nào thì <code>explain</code> cho thấy ở trường <code>strategy</code> của stage <code>EQ_LOOKUP</code>. Hai mươi mã khách nối vào một triệu đơn của Chương 4, lần đầu chưa có index trên <code>khach</code>:</p>
${lenh(K, 8)}
<p><code>NestedLoopJoin</code>: với mỗi khách trong 20 khách, quét collection kia. Hai mươi lượt quét trọn một triệu tài liệu — vài giây cho 385 đơn khớp. Thêm index trên trường được nối rồi chạy lại đúng pipeline đó:</p>
${lenh(K, 9)}
${lenh(K, 10)}
<p><code>IndexedLoopJoin</code>: đọc 385 khoá index cho 385 đơn tìm được, vài mili giây — nhanh hơn hàng trăm lần. Đây là luật của Chương 4, áp dụng cho collection <em>bên kia</em>: <code>foreignField</code> của mọi <code>$lookup</code> chạy trên production đều cần index (<code>_id</code> thì có sẵn).</p>
<p>Còn một chiến lược thứ ba. Khi collection bên kia nhỏ và không có index dùng được, máy chủ đọc nó một lần, dựng một bảng băm trong bộ nhớ rồi dò bảng đó cho từng tài liệu đầu vào:</p>
${lenh(K, 11)}
<p><code>HashJoin</code> cho một bảng tra vùng miền sáu dòng. Với dữ liệu tham chiếu nhỏ thì ổn; với collection bên kia lớn, nó cần rất nhiều bộ nhớ (và tràn ra đĩa), nên nó không thay được index.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">NestedLoopJoin</span><span class="lz-t">quét collection bên kia cho mỗi tài liệu đầu vào</span><span class="lz-d">không có index trên foreignField — tránh với collection lớn</span></div>
  <div class="lz-step"><span class="lz-k">IndexedLoopJoin</span><span class="lz-t">mỗi tài liệu đầu vào một lần tra index</span><span class="lz-d">trường hợp bình thường trên production</span></div>
  <div class="lz-step"><span class="lz-k">HashJoin</span><span class="lz-t">đọc phía bên kia một lần vào bảng băm</span><span class="lz-d">collection bên kia nhỏ, không index, cho phép dùng đĩa</span></div>
</div>

<h3>Khi nào $lookup là công cụ sai</h3>
<p><code>$lookup</code> có mặt để bạn trả lời được câu hỏi mà lúc thiết kế chưa tính tới. Nếu cùng một phép nối chạy ở mỗi lượt xem trang, bạn trả giá cho nó ở mọi request — câu hỏi của Chương 3 quay lại: dữ liệu nên được nhúng hay chép sang (extended reference, Bài 3.3)? Một luật thực tế từ các đội chạy MongoDB quy mô lớn: nối thỉnh thoảng trong báo cáo, màn hình quản trị và việc chạy đêm là bình thường; một <code>$lookup</code> trong API nóng nhất là việc phải đem ra duyệt schema. Cũng nhớ rằng mỗi mảng được nối nằm trong một tài liệu kết quả, nên giới hạn 16 MB mỗi tài liệu áp lên nó (Bài 5.5). Có hai stage liên quan cho các trường hợp hiếm hơn: <code>$unionWith</code> nối thêm tài liệu của một collection khác vào dòng chảy (UNION ALL), và <code>$graphLookup</code> đi theo tham chiếu một cách đệ quy (cây danh mục, Bài 3.4).</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-2-chien-luoc-join', title: 'PostgreSQL 10.2 — Chiến lược join', sub: 'Nested loop, hash join và merge join — cùng các ý đó trong bộ lập kế hoạch quan hệ' })}

<h3>💼 Đi làm: trang quản trị chậm</h3>
<p>Một ticket OJT hay gặp: "danh sách đơn ở trang quản trị mất 8 giây". Pipeline làm <code>$lookup</code> từ đơn sang khách <em>trước</em> <code>$sort</code> và <code>$limit</code>, nên nó nối mọi đơn trong cơ sở dữ liệu chỉ để hiện hai mươi đơn. Hai thay đổi là sửa xong: đưa <code>$sort</code> + <code>$limit</code> (và <code>$skip</code> hoặc phân trang keyset) lên trước <code>$lookup</code>, và kiểm <code>foreignField</code> đã có index. Đem explain trước/sau (chiến lược và thời gian) vào pull request — người review tin con số, không tin "chắc sẽ nhanh hơn".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"$unwind làm gì, và có thể hỏng ở đâu?"</strong> — Mỗi phần tử mảng một tài liệu ra. Nó nhân bản trường cấp đơn (tính trùng) và, mặc định, bỏ tài liệu có mảng rỗng hoặc thiếu.</li>
<li><strong>"Làm sao cho $lookup nhanh?"</strong> — Index trên foreignField; giảm đầu vào trước ($match, $group, $limit trước phép nối); chỉ chiếu trường cần bằng pipeline của lookup.</li>
<li><strong>"MongoDB dùng những chiến lược nối nào?"</strong> — Nested loop (không index), indexed loop (index trên trường bên kia), hash join (collection bên kia nhỏ); xem trong explain ở strategy của EQ_LOOKUP.</li>
<li><strong>"Vì sao $lookup trả về mảng?"</strong> — Vì số tài liệu khớp có thể là không, một hay nhiều; $unwind hoặc $first biến một kết quả khớp thành một trường.</li>
<li><strong>"Nếu request nào cũng cần $lookup, bạn xem lại gì?"</strong> — Schema: nhúng hoặc chép trường cần (extended reference) thay vì nối lúc đọc.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Làm nốt bài của Bài 5.1: doanh thu (PAID + SHIPPED) theo <strong>danh mục</strong> sản phẩm. Làm bằng <code>$unwind</code> + <code>$group</code> theo sản phẩm trước, rồi mới <code>$lookup</code> trên 60 sản phẩm — không phải mỗi dòng món một lần nối. Vì sao thứ tự đó tốt hơn?</li>
<li>Đếm đơn theo khách bằng <code>$unwind</code> trên kết quả nối thay vì <code>$size</code>. Rồi chèn một khách chưa có đơn nào và so hai phiên bản.</li>
<li>Trên <code>ch4.don</code>, đo <code>$lookup</code> từ 200 mã khách khi có và không có index <code>khach</code>. Báo chiến lược và thời gian của từng lần.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>[{ $match: { status: { $in: ['PAID', 'SHIPPED'] } } }, { $unwind: '$items' }, { $group: { _id: '$items.productId', dt: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } }, { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'p' } }, { $group: { _id: { $first: '$p.category' }, dt: { $sum: '$dt' } } }, { $sort: { dt: -1 } }]</code>. Laptop đứng đầu bỏ xa. Gom theo sản phẩm trước làm khoảng 3.500 dòng món còn tối đa 60 tài liệu, nên phép nối chạy nhiều nhất 60 lần thay vì mỗi dòng một lần.</p>
<p>2. <code>$lookup</code> rồi <code>$unwind: '$d'</code> rồi <code>$group</code> với <code>$sum: 1</code>: khách chưa có đơn biến mất (mảng rỗng bị bỏ). Với <code>$size</code> thì khách đó hiện ra với 0 — hoặc dùng <code>preserveNullAndEmptyArrays: true</code> và chỉ đếm phần tử khác null.</p>
<p>3. Không index: NestedLoopJoin, thời gian tăng gần tuyến tính theo số khách đầu vào (khách nhiều gấp mười, lâu chừng gấp mười — trên máy dùng để soạn khoá này, chừng 44 giây). Có index: IndexedLoopJoin, 17 ms. Thời gian của bạn tuỳ máy; tỉ lệ mới là điều quan trọng.</p>
</details>
<p><strong>Xong khi:</strong> với bất kỳ pipeline nào có <code>$unwind</code>, bạn nói được trường nào được phép cộng, và với bất kỳ <code>$lookup</code> nào, nó sẽ dùng chiến lược gì và vì sao.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['$unwind', 'Trả mỗi phần tử của trường mảng một tài liệu; bỏ mảng rỗng/thiếu trừ khi có preserveNullAndEmptyArrays.'],
  ['Tính trùng (double counting)', 'Cộng trường cấp cha sau $unwind, khiến nó lặp lại một lần cho mỗi phần tử.'],
  ['$lookup', 'Left outer join sang collection khác trong cùng database; thêm một mảng các tài liệu khớp.'],
  ['Pipeline của lookup', 'Pipeline con chạy trên các tài liệu khớp (lọc, sắp, giới hạn, chiếu).'],
  ['EQ_LOOKUP', 'Stage trong explain cho $lookup so khớp bằng do engine slot-based chạy; hiện chiến lược.'],
  ['NestedLoopJoin / IndexedLoopJoin / HashJoin', 'Quét cho mỗi đầu vào / tra index cho mỗi đầu vào / bảng băm dựng một lần từ phía bên kia.'],
  ['$unionWith', 'Nối thêm tài liệu từ collection khác vào dòng chảy (như UNION ALL).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li><code>$unwind</code> biến 2.000 đơn thành 4.969 dòng món — chỉ cộng trường của món; tổng đơn sẽ lớn gấp ba.</li>
<li><code>$unwind</code> mặc định bỏ mảng rỗng hoặc thiếu; hãy quyết định rõ ràng.</li>
<li><code>$lookup</code> thêm một mảng tài liệu khớp; giảm đầu vào trước khi nối.</li>
<li>Index mọi foreignField: NestedLoopJoin mất vài giây trong khi IndexedLoopJoin mất vài mili giây.</li>
<li>Nối ở mọi request là câu hỏi về schema, không chỉ về hiệu năng.</li>
<li>Đối soát tổng của báo cáo với con số tính bằng cách khác — báo cáo hỏng một cách im lặng.</li>
</ul>
</div>
`,
};
