/**
 * 1.5 — Lab Chương 1: mô hình hoá danh mục có kiểm hợp lệ (soạn 24/11/2026, agent mgo).
 * Lời giải chạy thật: ../_ma.mjs OUT['s01-5-lab'] (MongoDB 8.0.38, kịch bản demo/s01/s01-5-lab.txt) — che trong <details>.
 * Gắn với dự án xuyên khoá: mốc 1 (mgo-moc-1) yêu cầu validator trên collection chính — lab này là bản tập dượt.
 */
import { lenh, loiGiai, kv } from '../_chung.mjs';

const GIAI_EN = `
<p><strong>1. The collection with its validator.</strong> Each <code>oneOf</code> branch pins the <code>category</code> to one value, so exactly one branch can match:</p>
${lenh('s01-5-lab', 0)}
<p><strong>2. Three valid products.</strong> Note <code>Decimal128('…')</code> for prices; <code>12</code>, <code>464</code>, <code>16</code> become int automatically:</p>
${lenh('s01-5-lab', 1)}
<p><strong>3. Five invalid documents, all rejected:</strong></p>
${lenh('s01-5-lab', 2)}
<p>Reasons, in order: (1) book without <code>pages</code> — the book branch's <code>required</code> fails, no branch matches ⇒ <code>oneOf</code>; (2) <code>price: 15000000</code> is int, not decimal ⇒ <code>properties</code> (the laptop branch itself is fine); (3) <code>'Shirt'</code> is not in the enum ⇒ <code>properties</code>, and no branch matches ⇒ <code>oneOf</code>; (4) pattern of <code>_id</code> and <code>stock: -1</code> ⇒ <code>properties</code>, empty <code>variants</code> fails <code>minItems</code> ⇒ <code>oneOf</code>; (5) <code>'accessory'</code> not in the enum and no branch ⇒ both. Only the three valid documents remain:</p>
${lenh('s01-5-lab', 3)}
<p><strong>4. Sizes:</strong> <code>db.catalog.aggregate([{ $project: { s: { $bsonSize: '$$ROOT' } } }])</code>. Our run: book 134 bytes, laptop 142, shirt 142. The book has more fields but they are flat; the laptop and the shirt pay for nesting — every embedded document or array carries its own 4-byte length and terminator, and an array stores its indexes <code>"0"</code>, <code>"1"</code>… as field names. Field names are repeated in every BSON document, which is why long field names cost space at scale.</p>
<p><strong>5. A deliberate non-rule:</strong> for example "we do not enforce that <code>variants[].size</code> is in S/M/L/XL, because the shop will add kids' sizes next month; the admin UI validates it instead".</p>
`;

const GIAI_VI = `
<p><strong>1. Collection kèm validator.</strong> Mỗi nhánh <code>oneOf</code> ghim <code>category</code> vào một giá trị, nên đúng một nhánh có thể khớp:</p>
${lenh('s01-5-lab', 0)}
<p><strong>2. Ba sản phẩm hợp lệ.</strong> Để ý <code>Decimal128('…')</code> cho giá; <code>12</code>, <code>464</code>, <code>16</code> tự thành int:</p>
${lenh('s01-5-lab', 1)}
<p><strong>3. Năm tài liệu sai, đều bị từ chối:</strong></p>
${lenh('s01-5-lab', 2)}
<p>Lý do theo thứ tự: (1) sách thiếu <code>pages</code> — <code>required</code> của nhánh sách trượt, không nhánh nào khớp ⇒ <code>oneOf</code>; (2) <code>price: 15000000</code> là int, không phải decimal ⇒ <code>properties</code> (bản thân nhánh laptop thì ổn); (3) <code>'Shirt'</code> không có trong enum ⇒ <code>properties</code>, và không nhánh nào khớp ⇒ <code>oneOf</code>; (4) pattern của <code>_id</code> và <code>stock: -1</code> ⇒ <code>properties</code>, <code>variants</code> rỗng trượt <code>minItems</code> ⇒ <code>oneOf</code>; (5) <code>'accessory'</code> không có trong enum và không có nhánh ⇒ cả hai. Chỉ ba tài liệu hợp lệ còn lại:</p>
${lenh('s01-5-lab', 3)}
<p><strong>4. Kích thước:</strong> <code>db.catalog.aggregate([{ $project: { s: { $bsonSize: '$$ROOT' } } }])</code>. Lần chạy của ta: sách 134 byte, laptop 142, áo 142. Sách nhiều trường hơn nhưng phẳng; laptop và áo trả giá cho phần lồng — mỗi tài liệu nhúng hay mảng mang 4 byte độ dài và byte kết thúc riêng, còn mảng lưu chỉ số <code>"0"</code>, <code>"1"</code>… làm tên trường. Tên trường lặp lại trong mọi tài liệu BSON, nên tên trường dài tốn chỗ khi dữ liệu lớn.</p>
<p><strong>5. Một luật cố ý không ép:</strong> ví dụ "không ép <code>variants[].size</code> thuộc S/M/L/XL, vì tháng sau cửa hàng thêm cỡ trẻ em; giao diện quản trị kiểm thay".</p>
`;

export default {
  title: '1.5 — Lab: model a catalog with validation|||1.5 — Lab: mô hình hoá danh mục có kiểm hợp lệ',
  slug: 'mgo-1-5-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 60–90 phút: dựng collection danh mục cho ba loại hàng có thuộc tính khác nhau (sách, laptop, áo), chọn _id và kiểu BSON đúng, viết $jsonSchema với oneOf để mỗi loại có luật riêng, chứng minh 5 tài liệu sai bị từ chối kèm lý do, đo kích thước tài liệu. Rubric 10 điểm; lời giải chạy thật được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab</span>
<h2>Lab: model a catalog with validation</h2>
<p class="lead">You will build the product catalogue of a small shop the way a careful team would on day one: deliberate ids, correct BSON types, and a validator that gives each kind of product its own rules. Everything you need was taught in Lessons 1.1–1.3. Budget 60–90 minutes; do not open the solution until your version runs.</p>

<h3>The brief</h3>
<p>The shop sells three kinds of products. All products share <code>_id</code>, <code>name</code>, <code>category</code>, <code>price</code> and <code>stock</code>. Each kind has its own attributes:</p>
<table>
<thead><tr><th>Category</th><th>Extra fields (required)</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>book</code></td><td><code>author</code> (string), <code>pages</code> (int ≥ 1)</td><td>Clean Code — Robert C. Martin, 464 pages</td></tr>
<tr><td><code>laptop</code></td><td><code>specs</code> (object with at least <code>ramGB</code> int)</td><td>Laptop Lập Trình 15 — 16 GB RAM, 512 GB SSD</td></tr>
<tr><td><code>shirt</code></td><td><code>variants</code> (non-empty array)</td><td>Áo thun CT — size M, 20 in stock</td></tr>
</tbody></table>
<p>Rules for every product: <code>_id</code> looks like <code>SP001</code> (SP + 3 digits); <code>name</code> 2–120 characters; <code>category</code> is exactly one of the three values; <code>price</code> is money; <code>stock</code> is a whole number ≥ 0.</p>

<h3>Tasks</h3>
<ol>
<li>In a new database <code>lab1</code>, create the collection <code>catalog</code> with a <code>$jsonSchema</code> validator implementing <em>all</em> rules above. Hint: common rules go in the top-level <code>properties</code>/<code>required</code>; per-category rules go in <code>oneOf</code> — a list of sub-schemas of which <strong>exactly one</strong> must match.</li>
<li>Insert the three example products with correct types (think: which type for <code>price</code>? for <code>pages</code>?).</li>
<li>Write a small helper that tries to insert a document and returns either an "accepted" marker or the list of failed rule names from <code>errInfo</code> (the solution prints NHẬN / TỪ CHỐI — Vietnamese for accepted / rejected). Prove that these five documents are all rejected, and explain each reason in one line:
<ul>
<li>a book without <code>pages</code>;</li>
<li>a laptop whose <code>price</code> is a plain JavaScript number;</li>
<li>a shirt with category <code>'Shirt'</code> (capital S);</li>
<li>a shirt with <code>_id: 'sp007'</code>, <code>stock: -1</code> and an empty <code>variants</code> array;</li>
<li>a product with category <code>'accessory'</code>.</li>
</ul></li>
<li>Measure each of your three valid documents with <code>$bsonSize</code>. Which is the largest and why?</li>
<li>Write a <code>README.md</code> section (5–10 lines): your id choice, your type choices, and one rule you decided <em>not</em> to enforce in the database and why.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Validator exists and the three valid examples insert without <code>bypassDocumentValidation</code></td><td>2</td></tr>
<tr><td>Types correct: <code>price</code> Decimal128, <code>stock</code>/<code>pages</code>/<code>ramGB</code> int — enforced with <code>bsonType</code></td><td>2</td></tr>
<tr><td>Per-category rules with <code>oneOf</code> (a book cannot pass with laptop fields)</td><td>2</td></tr>
<tr><td>All five invalid documents rejected, each with a correct one-line reason</td><td>2</td></tr>
<tr><td>Sizes measured with <code>$bsonSize</code>; README explains ids, types and one deliberate non-rule</td><td>2</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> <code>price: 150000</code> (int) accepted because the schema says <code>bsonType: 'number'</code>; forgetting that <code>oneOf</code> fails when <em>two</em> branches match (make the category enum part of each branch); using <code>additionalProperties: false</code> without listing <code>_id</code>.</p>

<h3>Solution</h3>
${loiGiai('Open only after your version runs — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 1 of the course project asks for exactly this on your own topic: three collections, hand-written sample documents with correct types, and a validator on the main collection that rejects a missing field and a misspelled status, with the real error in your README. Do it now while the lesson is fresh.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['oneOf', '<code>$jsonSchema</code> keyword: exactly one of the listed sub-schemas must match.'],
  ['Polymorphic collection', 'One collection holding several shapes of the same entity (book, laptop, shirt) — the case the document model handles well.'],
  ['errInfo', 'The detailed explanation MongoDB attaches to a "Document failed validation" error.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab</span>
<h2>Lab: mô hình hoá danh mục có kiểm hợp lệ</h2>
<p class="lead">Bạn sẽ dựng danh mục sản phẩm của một cửa hàng nhỏ theo cách một đội cẩn thận làm ngay ngày đầu: id có chủ đích, kiểu BSON đúng, và một validator cho mỗi loại hàng luật riêng. Mọi thứ cần dùng đã học ở Bài 1.1–1.3. Dành 60–90 phút; đừng mở lời giải trước khi bản của bạn chạy được.</p>

<h3>Đề bài</h3>
<p>Cửa hàng bán ba loại hàng. Mọi sản phẩm có chung <code>_id</code>, <code>name</code>, <code>category</code>, <code>price</code> và <code>stock</code>. Mỗi loại có thuộc tính riêng:</p>
<table>
<thead><tr><th>Loại</th><th>Trường thêm (bắt buộc)</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>book</code></td><td><code>author</code> (chuỗi), <code>pages</code> (int ≥ 1)</td><td>Clean Code — Robert C. Martin, 464 trang</td></tr>
<tr><td><code>laptop</code></td><td><code>specs</code> (object có ít nhất <code>ramGB</code> kiểu int)</td><td>Laptop Lập Trình 15 — RAM 16 GB, SSD 512 GB</td></tr>
<tr><td><code>shirt</code></td><td><code>variants</code> (mảng không rỗng)</td><td>Áo thun CT — cỡ M, còn 20 chiếc</td></tr>
</tbody></table>
<p>Luật cho mọi sản phẩm: <code>_id</code> có dạng <code>SP001</code> (SP + 3 chữ số); <code>name</code> dài 2–120 ký tự; <code>category</code> đúng một trong ba giá trị; <code>price</code> là tiền; <code>stock</code> là số nguyên ≥ 0.</p>

<h3>Nhiệm vụ</h3>
<ol>
<li>Trong database mới <code>lab1</code>, tạo collection <code>catalog</code> với validator <code>$jsonSchema</code> thể hiện <em>mọi</em> luật ở trên. Gợi ý: luật chung đặt ở <code>properties</code>/<code>required</code> cấp ngoài; luật theo từng loại đặt trong <code>oneOf</code> — một danh sách schema con mà <strong>đúng một</strong> cái phải khớp.</li>
<li>Chèn ba sản phẩm ví dụ với kiểu đúng (nghĩ xem: <code>price</code> kiểu gì? <code>pages</code> kiểu gì?).</li>
<li>Viết một hàm nhỏ thử chèn một tài liệu và trả về <code>'NHẬN'</code> hoặc danh sách tên luật bị phạm lấy từ <code>errInfo</code>. Chứng minh cả năm tài liệu sau đều bị từ chối, và giải thích mỗi lý do trong một dòng:
<ul>
<li>một cuốn sách thiếu <code>pages</code>;</li>
<li>một laptop có <code>price</code> là số JavaScript thường;</li>
<li>một chiếc áo có category <code>'Shirt'</code> (chữ S hoa);</li>
<li>một chiếc áo có <code>_id: 'sp007'</code>, <code>stock: -1</code> và mảng <code>variants</code> rỗng;</li>
<li>một sản phẩm có category <code>'accessory'</code>.</li>
</ul></li>
<li>Đo kích thước ba tài liệu hợp lệ bằng <code>$bsonSize</code>. Tài liệu nào lớn nhất, vì sao?</li>
<li>Viết một mục <code>README.md</code> (5–10 dòng): cách chọn id, cách chọn kiểu, và một luật bạn quyết định <em>không</em> ép trong cơ sở dữ liệu, kèm lý do.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Có validator, ba ví dụ hợp lệ chèn được mà không cần <code>bypassDocumentValidation</code></td><td>2</td></tr>
<tr><td>Kiểu đúng: <code>price</code> Decimal128, <code>stock</code>/<code>pages</code>/<code>ramGB</code> int — ép bằng <code>bsonType</code></td><td>2</td></tr>
<tr><td>Luật theo từng loại bằng <code>oneOf</code> (sách không qua được nếu mang trường của laptop)</td><td>2</td></tr>
<tr><td>Cả năm tài liệu sai bị từ chối, mỗi cái có lý do một dòng đúng</td><td>2</td></tr>
<tr><td>Đo kích thước bằng <code>$bsonSize</code>; README giải thích id, kiểu và một luật cố ý không ép</td><td>2</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ điểm:</strong> <code>price: 150000</code> (int) lọt vì schema ghi <code>bsonType: 'number'</code>; quên rằng <code>oneOf</code> thất bại khi <em>hai</em> nhánh cùng khớp (hãy đưa enum của category vào từng nhánh); dùng <code>additionalProperties: false</code> mà không liệt kê <code>_id</code>.</p>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi bản của bạn chạy được — lời giải đầy đủ, chạy trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 1 của dự án xuyên khoá yêu cầu đúng điều này trên đề tài của bạn: ba collection, tài liệu mẫu viết tay với kiểu đúng, và một validator trên collection chính từ chối tài liệu thiếu trường và trạng thái gõ sai, kèm lỗi thật trong README. Làm ngay khi bài còn nóng.</p>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['oneOf', 'Từ khoá <code>$jsonSchema</code>: đúng một trong các schema con liệt kê phải khớp.'],
  ['Collection đa hình', 'Một collection chứa nhiều hình dạng của cùng một thực thể (sách, laptop, áo) — chỗ mô hình tài liệu xử lý tốt.'],
  ['errInfo', 'Phần giải thích chi tiết MongoDB gắn vào lỗi "Document failed validation".'],
])}
</div>
`,
};
