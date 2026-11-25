/**
 * 2.3 — Mảng và tài liệu lồng: dấu chấm và $elemMatch (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-3-arr'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-3-arr.txt).
 * Số đối chiếu: điều kiện rời trên items 357 đơn vs $elemMatch 204; biến thể áo cỡ M tồn < 10: 3 sản phẩm vs đúng 1 (SP017).
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '2.3 — Arrays and embedded documents: dot notation and $elemMatch|||2.3 — Mảng và tài liệu lồng: dấu chấm và $elemMatch',
  slug: 'mgo-2-3-mang-long',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Truy vấn dữ liệu nhúng — điểm mạnh của mô hình tài liệu và nguồn lỗi báo cáo hay gặp nhất: dấu chấm vào tài liệu lồng và mảng, điều kiện rơi vào HAI phần tử khác nhau (357 đơn thay vì 204) và cách sửa bằng $elemMatch, $all, $size và mẹo "items.3", projection $ và $elemMatch, so khớp nguyên tài liệu nhúng phụ thuộc thứ tự trường, mảng số với khoảng giá trị.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Arrays and embedded documents: dot notation and $elemMatch</h2>
<p class="lead">In Chapter 1 you put the line items <em>inside</em> each order — one read returns the whole order. The price of that design is that you must query inside arrays correctly. MongoDB's array rules are generous ("does any element match?"), and that generosity produces the most common wrong report in MongoDB projects: conditions that are satisfied by <em>two different elements</em>. You will see it happen on real data, then fix it.</p>

<h3>An everyday picture: the shopping receipt</h3>
<p>Your manager asks: "how many receipts contain an item that costs at least 10 million <em>and</em> was bought in quantity 3 or more?" — think bulk laptop purchases. A receipt with one laptop at 19 million (×1) and a pack of cables at 610 thousand (×3) has "something ≥ 10 million" and "something ×3" — but not <em>one line</em> that is both. A human reading the receipt sees this instantly. A query has to be told.</p>

<h3>Dot notation into arrays</h3>
${lenh('s02-3-arr', 0)}
${lenh('s02-3-arr', 1)}
<p><code>'items.productId'</code> reaches into every element of the array: "orders where <em>some</em> item has productId SP001" — 71 orders. No unwinding, no join: this is the everyday power of embedding. The same notation reaches nested documents (<code>'shipTo.city'</code>) and they can be combined (<code>'items.price'</code>).</p>

<h3>The two-element trap</h3>
${lenh('s02-3-arr', 2)}
${lenh('s02-3-arr', 3)}
<p>357 versus 204. With two separate dot conditions, MongoDB checks each one independently: "some item has qty ≥ 3" AND "some item has price ≥ 10 million" — <em>not necessarily the same item</em>. <code>$elemMatch</code> says "one element must satisfy all of these together". Find a document that is counted by the first query but not the second:</p>
${lenh('s02-3-arr', 4)}
<p>Order 1: the cheap course is the item with <code>qty: 3</code>, the laptops are the items over 10 million. 153 orders like this (357 − 204) would wrongly appear in a "bulk laptop purchases" report. The rule to remember:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">one condition</span><span class="lz-t">dot notation is fine</span><span class="lz-d"><code>{ 'items.productId': 'SP001' }</code> — "some element has…"</span></div>
  <div class="lz-step"><span class="lz-k">≥ 2 conditions on the same element</span><span class="lz-t">use $elemMatch</span><span class="lz-d"><code>{ items: { $elemMatch: { qty: { $gte: 3 }, price: { $gte: … } } } }</code></span></div>
  <div class="lz-step"><span class="lz-k">conditions on different elements on purpose</span><span class="lz-t">dot notation, and say so</span><span class="lz-d">"orders that contain a laptop and also something bought ×3" — rare; write a comment.</span></div>
</div>
<p>The same trap on product variants — shirts with a size M variant that is low on stock (&lt; 10):</p>
${lenh('s02-3-arr', 13)}
${lenh('s02-3-arr', 14)}
<p>Three shirts with dot notation; only SP017 actually has a size M with fewer than 10 left (SP018 matched because its size S has 2, SP020 because its L and XL are low). A restocking email based on the first query orders the wrong sizes.</p>

<h3>Arrays of plain values: tags</h3>
${lenh('s02-3-arr', 5)}
${lenh('s02-3-arr', 6)}
${lenh('s02-3-arr', 7)}
<p>Equality against an array field means "the array contains this value". <code>$all</code> means "contains all of these, in any order". (And equality with an array literal — <code>{ tags: ['database', 'beginner'] }</code> — means "the array is exactly this, in this order": almost never what you want.)</p>

<h3>Array size</h3>
${lenh('s02-3-arr', 8)}
${lenh('s02-3-arr', 9)}
${lenh('s02-3-arr', 10)}
<p><code>$size</code> only takes an exact number. For "at least 4 items", ask whether the element at index 3 exists: <code>{ 'items.3': { $exists: true } }</code> — same answer as the <code>$expr</code> version of Lesson 2.2 (484), but a plain query operator. If you filter or sort by array length often, store it: keep <code>itemCount</code> up to date in the same update that changes <code>items</code> (Lesson 2.4) and index it.</p>

<h3>Returning only the matching elements</h3>
${lenh('s02-3-arr', 11)}
<p>The positional projection <code>'items.$'</code> returns only the <em>first</em> element that matched the query — here the SP001 line of each order, not all four lines. For a condition on the element written in the projection itself, use <code>$elemMatch</code> in the projection:</p>
${lenh('s02-3-arr', 12)}
<p>Shirts with their first variant under 5 in stock: SP018 shows its size S, SP020 its size L; SP017 and SP019 have none, so the field is simply absent. Both forms return at most one element. To return <em>all</em> matching elements, use <code>$filter</code> in an aggregation (Chapter 5).</p>

<h3>Embedded documents: compare fields, not whole documents</h3>
${lenh('s02-3-arr', 15)}
${lenh('s02-3-arr', 16)}
<p>Both give 267 here — but they mean different things. <code>{ shipTo: { city: 'Huế' } }</code> asks for the embedded document to be <em>exactly</em> <code>{ city: 'Huế' }</code>: same fields, same values, <strong>same order</strong>. Add a <code>district</code> to the address next month and this query silently drops to 0. See the order rule with two addresses that differ only in field order:</p>
${lenh('s02-3-arr', 17)}
${lenh('s02-3-arr', 18)}
<p>Exact match finds only document 1; dot notation finds both. Documents written by different code paths (or by different languages: a Java <code>HashMap</code> does not keep order, a JavaScript object does) end up with different field orders. Query embedded documents with dot notation, always.</p>

<h3>Arrays of numbers and ranges</h3>
${lenh('s02-3-arr', 19)}
${lenh('s02-3-arr', 20)}
<p>"Scores between 5 and 7" with two conditions: document <code>a</code> (<code>[3, 9]</code>) matches, because 9 &gt; 5 and 3 &lt; 7 — two different elements again. <code>d</code> matches too: <code>diem</code> is a plain number 6 there — the operators do not care whether the field is an array. <code>$elemMatch</code> requires one element in the range and only matches arrays. The "any element" rule also means a scalar query matches arrays:</p>
${lenh('s02-3-arr', 21)}
${lenh('s02-3-arr', 22)}
<p>The same field holding a number in one document and an array in another is legal in MongoDB and a constant source of surprises. If a field is an array, make it an array everywhere (validator: <code>bsonType: 'array'</code>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — writing the report query by "adding one more condition".</strong> The report starts as <code>{ 'items.productId': 'SP001' }</code>. A week later someone adds <code>'items.qty': { $gte: 3 }</code> to mean "bought 3 or more of SP001". It now means "contains SP001, and contains something bought ×3". The numbers look plausible, nobody notices. Whenever a query has two conditions under the same array path, stop and decide: same element (<code>$elemMatch</code>) or not.</p>
</div>

${nguon('📘', 'Query an Array — MongoDB Docs', 'Element match, $all, $size, arrays of documents', 'https://www.mongodb.com/docs/manual/tutorial/query-arrays/')}
${nguon('📘', '$elemMatch (query) — MongoDB Docs', 'Single-element semantics, with examples', 'https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/')}

<h3>💼 At work: the promotion that paid out twice as much</h3>
<p>A real-shaped story: marketing runs "buy 3 or more of any laptop, get a free mouse". The developer writes the eligibility query with dot notation: <code>{ 'items.category': 'laptop', 'items.qty': { $gte: 3 } }</code>. Customers who bought one laptop and three USB cables get a free mouse; the warehouse ships nearly twice the expected number. In the post-mortem, the fix is one word — <code>$elemMatch</code> — and the lesson is the test that was missing: a fixture order with the laptop and the ×3 item on <em>different</em> lines, expected <em>not</em> to qualify. Write that fixture whenever you write an array query.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Difference between <code>{ 'a.x': 1, 'a.y': 2 }</code> and <code>{ a: { $elemMatch: { x: 1, y: 2 } } }</code>?"</strong> — The first can be satisfied by two different elements; the second needs one element with both.</li>
<li><strong>"How do you find documents whose array has at least N elements?"</strong> — <code>{ 'arr.(N-1)': { $exists: true } }</code>, or keep a counter field; <code>$size</code> is exact-only.</li>
<li><strong>"Why not match an embedded document directly?"</strong> — Exact match depends on all fields and their order; dot notation is robust.</li>
<li><strong>"How do you return only the matching array elements?"</strong> — <code>$</code> or <code>$elemMatch</code> projection (first match), <code>$filter</code> in aggregation (all matches).</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Orders that contain at least one book bought ×2 or more. (Hint: the order items do not have a category — the product id ranges do. Look at <code>db.products.find({ category: 'book' }, { _id: 1 })</code> and use <code>$in</code> inside <code>$elemMatch</code>.)</li>
<li>Show, for order 7, only the items priced at least 700,000 — with the positional projection, then with an <code>$elemMatch</code> projection. Why do both show only one item when two qualify?</li>
<li>Write a fixture-based check for the "bulk laptop" report: insert into <code>ch2</code> two orders — one that must qualify, one that must not — and show that only <code>$elemMatch</code> separates them.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>const sach = db.products.distinct('_id', { category: 'book' }); db.orders.countDocuments({ items: { $elemMatch: { productId: { $in: sach }, qty: { $gte: 2 } } } })</code>. (Copying the category into each order line at purchase time would make this simpler — a schema decision for Chapter 3.)</p>
<p>2. <code>db.orders.find({ _id: 7, 'items.price': { $gte: Decimal128('700000') } }, { 'items.$': 1 })</code> and <code>db.orders.find({ _id: 7 }, { items: { $elemMatch: { price: { $gte: Decimal128('700000') } } } })</code> — both return only the first matching element (the 900,000 course); SP051 at 790,000 qualifies too. Use <code>$filter</code> (Chapter 5) for all of them.</p>
<p>3. Order A: one item <code>{ price: 15000000, qty: 3 }</code>. Order B: <code>{ price: 15000000, qty: 1 }</code> and <code>{ price: 500000, qty: 3 }</code>. Dot-notation query returns both; <code>$elemMatch</code> returns only A.</p>
</details>
<p><strong>Done when:</strong> you can look at any array query and say, without running it, whether two elements could satisfy it.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Dot notation', '<code>\'a.b\'</code> reaches into embedded documents and into every element of arrays.'],
  ['$elemMatch', 'One array element must satisfy all the listed conditions (query); return the first such element (projection).'],
  ['$all', 'The array contains every listed value, in any order.'],
  ['$size', 'The array has exactly N elements (no ranges).'],
  ['Positional projection $', '<code>\'arr.$\'</code>: return only the first element that matched the query.'],
  ['Exact embedded match', '<code>{ f: { … } }</code>: the whole embedded document must be identical, field order included.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Conditions on an array are checked per condition: two conditions can be met by two different elements.</li>
<li>Same element ⇒ <code>$elemMatch</code>. On CT Shop: 357 wrong vs 204 right.</li>
<li><code>$size</code> is exact; use <code>'arr.N': { $exists: true }</code> for "at least N+1".</li>
<li>Query embedded documents with dot notation, never with whole-document equality.</li>
<li>Keep a field's type consistent (array everywhere or nowhere); test array queries with a "two different lines" fixture.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Mảng và tài liệu lồng: dấu chấm và $elemMatch</h2>
<p class="lead">Ở Chương 1 bạn đặt các dòng món hàng <em>bên trong</em> mỗi đơn — một lần đọc trả về trọn đơn hàng. Cái giá của thiết kế đó là bạn phải truy vấn bên trong mảng cho đúng. Luật về mảng của MongoDB rất "hào phóng" ("có phần tử nào khớp không?"), và chính sự hào phóng đó sinh ra báo cáo sai phổ biến nhất trong các dự án MongoDB: điều kiện được thoả bởi <em>hai phần tử khác nhau</em>. Bạn sẽ thấy nó xảy ra trên dữ liệu thật, rồi sửa nó.</p>

<h3>Hình ảnh đời thường: tờ hoá đơn siêu thị</h3>
<p>Sếp hỏi bạn: "có bao nhiêu hoá đơn chứa một món giá từ 10 triệu trở lên <em>và</em> mua số lượng từ 3 trở lên?" — tức là mua laptop số lượng lớn. Một hoá đơn có một laptop 19 triệu (×1) và một gói cáp 610 nghìn (×3) thì có "món ≥ 10 triệu" và có "món ×3" — nhưng không có <em>một dòng</em> nào thoả cả hai. Người đọc hoá đơn nhìn là thấy ngay. Truy vấn thì phải được dặn.</p>

<h3>Dấu chấm đi vào mảng</h3>
${lenh('s02-3-arr', 0)}
${lenh('s02-3-arr', 1)}
<p><code>'items.productId'</code> đi vào từng phần tử của mảng: "các đơn có <em>một món nào đó</em> mang productId SP001" — 71 đơn. Không cần trải mảng, không cần join: đây là sức mạnh thường ngày của việc nhúng. Cùng cách viết đó đi vào tài liệu lồng (<code>'shipTo.city'</code>) và có thể kết hợp với nhau (<code>'items.price'</code>).</p>

<h3>Bẫy hai phần tử</h3>
${lenh('s02-3-arr', 2)}
${lenh('s02-3-arr', 3)}
<p>357 so với 204. Với hai điều kiện dấu chấm rời nhau, MongoDB kiểm từng điều kiện độc lập: "có món nào đó qty ≥ 3" VÀ "có món nào đó giá ≥ 10 triệu" — <em>không nhất thiết cùng một món</em>. <code>$elemMatch</code> nói "một phần tử phải thoả tất cả những điều này cùng lúc". Tìm một tài liệu được truy vấn thứ nhất đếm nhưng truy vấn thứ hai thì không:</p>
${lenh('s02-3-arr', 4)}
<p>Đơn 1: khoá học rẻ tiền là món có <code>qty: 3</code>, các laptop là món trên 10 triệu. 153 đơn kiểu này (357 − 204) sẽ xuất hiện sai trong báo cáo "mua laptop số lượng lớn". Luật cần nhớ:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">một điều kiện</span><span class="lz-t">dấu chấm là đủ</span><span class="lz-d"><code>{ 'items.productId': 'SP001' }</code> — "có phần tử nào đó…"</span></div>
  <div class="lz-step"><span class="lz-k">≥ 2 điều kiện trên cùng phần tử</span><span class="lz-t">dùng $elemMatch</span><span class="lz-d"><code>{ items: { $elemMatch: { qty: { $gte: 3 }, price: { $gte: … } } } }</code></span></div>
  <div class="lz-step"><span class="lz-k">cố ý điều kiện trên các phần tử khác nhau</span><span class="lz-t">dấu chấm, và ghi chú rõ</span><span class="lz-d">"đơn có laptop và có thêm món nào đó mua ×3" — hiếm; hãy viết chú thích.</span></div>
</div>
<p>Cùng cái bẫy đó trên biến thể sản phẩm — áo có biến thể cỡ M sắp hết hàng (&lt; 10):</p>
${lenh('s02-3-arr', 13)}
${lenh('s02-3-arr', 14)}
<p>Ba áo với dấu chấm; chỉ SP017 thật sự có cỡ M còn dưới 10 chiếc (SP018 khớp vì cỡ S còn 2, SP020 vì cỡ L và XL còn ít). Một email nhập hàng dựa trên truy vấn thứ nhất sẽ đặt sai cỡ.</p>

<h3>Mảng giá trị đơn: tags</h3>
${lenh('s02-3-arr', 5)}
${lenh('s02-3-arr', 6)}
${lenh('s02-3-arr', 7)}
<p>So bằng với một trường mảng nghĩa là "mảng chứa giá trị này". <code>$all</code> nghĩa là "chứa tất cả các giá trị này, thứ tự nào cũng được". (Còn so bằng với một mảng literal — <code>{ tags: ['database', 'beginner'] }</code> — nghĩa là "mảng đúng y như thế này, đúng thứ tự này": hầu như không bao giờ là điều bạn muốn.)</p>

<h3>Kích thước mảng</h3>
${lenh('s02-3-arr', 8)}
${lenh('s02-3-arr', 9)}
${lenh('s02-3-arr', 10)}
<p><code>$size</code> chỉ nhận một con số chính xác. Với "ít nhất 4 món", hãy hỏi phần tử ở chỉ số 3 có tồn tại không: <code>{ 'items.3': { $exists: true } }</code> — cùng đáp án với bản <code>$expr</code> ở Bài 2.2 (484), nhưng là toán tử truy vấn thường. Nếu bạn hay lọc hoặc sắp theo độ dài mảng, hãy lưu nó: giữ <code>itemCount</code> luôn đúng trong cùng lệnh cập nhật làm thay đổi <code>items</code> (Bài 2.4) và đánh chỉ mục cho nó.</p>

<h3>Chỉ trả về phần tử khớp</h3>
${lenh('s02-3-arr', 11)}
<p>Projection vị trí <code>'items.$'</code> chỉ trả về phần tử <em>đầu tiên</em> khớp truy vấn — ở đây là dòng SP001 của mỗi đơn, không phải cả bốn dòng. Với điều kiện viết ngay trong projection, dùng <code>$elemMatch</code> trong projection:</p>
${lenh('s02-3-arr', 12)}
<p>Các áo kèm biến thể đầu tiên còn dưới 5 chiếc: SP018 hiện cỡ S, SP020 hiện cỡ L; SP017 và SP019 không có, nên trường đó đơn giản là vắng mặt. Cả hai dạng trả về nhiều nhất một phần tử. Muốn trả về <em>mọi</em> phần tử khớp, dùng <code>$filter</code> trong aggregation (Chương 5).</p>

<h3>Tài liệu nhúng: so từng trường, đừng so cả tài liệu</h3>
${lenh('s02-3-arr', 15)}
${lenh('s02-3-arr', 16)}
<p>Ở đây cả hai cùng cho 267 — nhưng nghĩa khác nhau. <code>{ shipTo: { city: 'Huế' } }</code> đòi tài liệu nhúng phải <em>đúng y</em> <code>{ city: 'Huế' }</code>: cùng các trường, cùng giá trị, <strong>cùng thứ tự</strong>. Tháng sau thêm <code>district</code> vào địa chỉ là truy vấn này lặng lẽ tụt về 0. Xem luật thứ tự với hai địa chỉ chỉ khác nhau ở thứ tự trường:</p>
${lenh('s02-3-arr', 17)}
${lenh('s02-3-arr', 18)}
<p>So khớp nguyên tài liệu chỉ thấy tài liệu 1; dấu chấm thấy cả hai. Tài liệu do các nhánh mã khác nhau ghi (hoặc các ngôn ngữ khác nhau: <code>HashMap</code> của Java không giữ thứ tự, object JavaScript thì giữ) sẽ có thứ tự trường khác nhau. Luôn truy vấn tài liệu nhúng bằng dấu chấm.</p>

<h3>Mảng số và khoảng giá trị</h3>
${lenh('s02-3-arr', 19)}
${lenh('s02-3-arr', 20)}
<p>"Điểm trong khoảng 5 tới 7" bằng hai điều kiện: tài liệu <code>a</code> (<code>[3, 9]</code>) khớp, vì 9 &gt; 5 và 3 &lt; 7 — lại là hai phần tử khác nhau. <code>d</code> cũng khớp: ở đó <code>diem</code> là số 6 thường — toán tử không quan tâm trường có phải mảng hay không. <code>$elemMatch</code> đòi một phần tử nằm trong khoảng và chỉ khớp mảng. Luật "phần tử nào đó" cũng có nghĩa truy vấn giá trị đơn khớp được mảng:</p>
${lenh('s02-3-arr', 21)}
${lenh('s02-3-arr', 22)}
<p>Cùng một trường chứa số ở tài liệu này và mảng ở tài liệu kia là hợp lệ trong MongoDB, và là nguồn bất ngờ triền miên. Nếu một trường là mảng, hãy để nó là mảng ở mọi nơi (validator: <code>bsonType: 'array'</code>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — viết truy vấn báo cáo bằng cách "thêm một điều kiện nữa".</strong> Báo cáo khởi đầu là <code>{ 'items.productId': 'SP001' }</code>. Một tuần sau ai đó thêm <code>'items.qty': { $gte: 3 }</code> với ý "mua SP001 từ 3 chiếc trở lên". Giờ nó lại có nghĩa "có SP001, và có món nào đó mua ×3". Con số trông hợp lý, không ai để ý. Mỗi khi một truy vấn có hai điều kiện dưới cùng một đường dẫn mảng, hãy dừng lại và quyết định: cùng phần tử (<code>$elemMatch</code>) hay không.</p>
</div>

${nguon('📘', 'Query an Array — MongoDB Docs', 'Khớp phần tử, $all, $size, mảng tài liệu', 'https://www.mongodb.com/docs/manual/tutorial/query-arrays/')}
${nguon('📘', '$elemMatch (query) — MongoDB Docs', 'Ngữ nghĩa một phần tử, có ví dụ', 'https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/')}

<h3>💼 Đi làm: khuyến mãi phát quà gấp đôi dự kiến</h3>
<p>Một câu chuyện mang dáng đời thật: marketing chạy chương trình "mua từ 3 laptop bất kỳ, tặng chuột". Lập trình viên viết truy vấn xét điều kiện bằng dấu chấm: <code>{ 'items.category': 'laptop', 'items.qty': { $gte: 3 } }</code>. Khách mua một laptop và ba sợi cáp USB cũng được tặng chuột; kho gửi đi gần gấp đôi số dự kiến. Trong buổi rút kinh nghiệm, cách sửa chỉ là một từ — <code>$elemMatch</code> — còn bài học là bài test bị thiếu: một đơn mẫu có laptop và món ×3 nằm ở <em>hai dòng khác nhau</em>, được kỳ vọng là <em>không</em> đủ điều kiện. Hãy viết đơn mẫu đó mỗi khi bạn viết truy vấn trên mảng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"<code>{ 'a.x': 1, 'a.y': 2 }</code> khác <code>{ a: { $elemMatch: { x: 1, y: 2 } } }</code> thế nào?"</strong> — Cái đầu có thể được thoả bởi hai phần tử khác nhau; cái sau cần một phần tử có cả hai.</li>
<li><strong>"Tìm tài liệu có mảng ít nhất N phần tử thế nào?"</strong> — <code>{ 'arr.(N-1)': { $exists: true } }</code>, hoặc giữ một trường đếm; <code>$size</code> chỉ so đúng bằng.</li>
<li><strong>"Sao không so khớp nguyên tài liệu nhúng?"</strong> — So khớp nguyên phụ thuộc mọi trường và thứ tự của chúng; dấu chấm thì bền vững.</li>
<li><strong>"Chỉ trả về phần tử mảng khớp thế nào?"</strong> — Projection <code>$</code> hoặc <code>$elemMatch</code> (phần tử khớp đầu tiên), <code>$filter</code> trong aggregation (mọi phần tử khớp).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Các đơn có ít nhất một cuốn sách mua từ 2 cuốn trở lên. (Gợi ý: dòng món trong đơn không có category — nhưng mã sản phẩm thì có. Xem <code>db.products.find({ category: 'book' }, { _id: 1 })</code> và dùng <code>$in</code> bên trong <code>$elemMatch</code>.)</li>
<li>Với đơn 7, chỉ hiện các món giá từ 700.000 trở lên — bằng projection vị trí, rồi bằng projection <code>$elemMatch</code>. Vì sao cả hai chỉ hiện một món trong khi có hai món đạt?</li>
<li>Viết một phép kiểm dựa trên dữ liệu mẫu cho báo cáo "mua laptop số lượng lớn": chèn vào <code>ch2</code> hai đơn — một đơn phải đạt, một đơn phải không đạt — và chỉ ra rằng chỉ <code>$elemMatch</code> tách được chúng.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>const sach = db.products.distinct('_id', { category: 'book' }); db.orders.countDocuments({ items: { $elemMatch: { productId: { $in: sach }, qty: { $gte: 2 } } } })</code>. (Chép category vào mỗi dòng đơn lúc mua sẽ làm việc này đơn giản hơn — một quyết định schema cho Chương 3.)</p>
<p>2. <code>db.orders.find({ _id: 7, 'items.price': { $gte: Decimal128('700000') } }, { 'items.$': 1 })</code> và <code>db.orders.find({ _id: 7 }, { items: { $elemMatch: { price: { $gte: Decimal128('700000') } } } })</code> — cả hai chỉ trả về phần tử khớp đầu tiên (khoá học 900.000); SP051 giá 790.000 cũng đạt. Dùng <code>$filter</code> (Chương 5) để lấy tất cả.</p>
<p>3. Đơn A: một món <code>{ price: 15000000, qty: 3 }</code>. Đơn B: <code>{ price: 15000000, qty: 1 }</code> và <code>{ price: 500000, qty: 3 }</code>. Truy vấn dấu chấm trả về cả hai; <code>$elemMatch</code> chỉ trả về A.</p>
</details>
<p><strong>Xong khi:</strong> nhìn bất kỳ truy vấn mảng nào, bạn nói được mà không cần chạy rằng hai phần tử có thể cùng thoả nó hay không.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Dấu chấm (dot notation)', '<code>\'a.b\'</code> đi vào tài liệu nhúng và vào từng phần tử của mảng.'],
  ['$elemMatch', 'Một phần tử mảng phải thoả mọi điều kiện liệt kê (truy vấn); trả về phần tử đầu tiên như vậy (projection).'],
  ['$all', 'Mảng chứa mọi giá trị liệt kê, thứ tự nào cũng được.'],
  ['$size', 'Mảng có đúng N phần tử (không nhận khoảng).'],
  ['Projection vị trí $', '<code>\'arr.$\'</code>: chỉ trả về phần tử đầu tiên khớp truy vấn.'],
  ['So khớp nguyên tài liệu nhúng', '<code>{ f: { … } }</code>: cả tài liệu nhúng phải giống hệt, kể cả thứ tự trường.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Điều kiện trên mảng được kiểm theo từng điều kiện: hai điều kiện có thể được thoả bởi hai phần tử khác nhau.</li>
<li>Cùng phần tử ⇒ <code>$elemMatch</code>. Trên CT Shop: 357 sai so với 204 đúng.</li>
<li><code>$size</code> chỉ so đúng bằng; dùng <code>'arr.N': { $exists: true }</code> cho "ít nhất N+1".</li>
<li>Truy vấn tài liệu nhúng bằng dấu chấm, đừng bao giờ so bằng nguyên tài liệu.</li>
<li>Giữ kiểu của một trường nhất quán (mảng ở mọi nơi hoặc không ở đâu); test truy vấn mảng bằng đơn mẫu "hai dòng khác nhau".</li>
</ul>
</div>
`,
};
