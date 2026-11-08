/** SDN302 · 3.1 — NoSQL, MongoDB & CRUD: tài liệu/collection, bốn lệnh CRUD kiểu mongosh, toán tử lọc, toán tử cập nhật, nhúng hay tham chiếu, cái bẫy "không có schema". */
import { doiDau, KHOA, bai, cs, q, qn, bang1, tn } from './_sdn.mjs';

const J = String.raw;
const GHI = J`// db is a mongosh-like shell over an in-memory MongoDB (lib/mongosh.js):
//   db.products.insertOne(doc) · find(filter, projection) · updateOne(filter, update) · deleteOne(filter) and more
// find() returns the matching documents (you can chain .sort({ price: 1 }) and .limit(n)).`;
const SEED = `db.products.insertMany([
  { name: 'Clean Code', price: 25, tags: ['tech', 'programming'], stock: 3, author: { name: 'Martin' } },
  { name: 'Pen', price: 2, tags: ['office'], stock: 0, onSale: true },
  { name: 'Notebook', price: 5, tags: ['office', 'paper'], stock: 12 },
  { name: 'Refactoring', price: 40, tags: ['tech'], stock: 0, author: { name: 'Fowler' } },
  { name: 'C++ Primer', price: 55, tags: ['tech', 'programming'], stock: 1, author: { name: 'Lippman' } },
]);`;

/* ── 1 ── */
const T = ['Collection', 'Document', 'Field', 'Embed a sub-document or reference + populate', '_id'];
const E1 = cs({
  ten: 'Relational vs document: translate the vocabulary', kho: 'EASY', phut: 6, loai: 'table',
  en: 'The mental switch of the lesson. For each relational (SQL) idea, choose its MongoDB counterpart.',
  vi: 'Cú chuyển tư duy của bài. Với mỗi khái niệm quan hệ (SQL), chọn khái niệm tương ứng của MongoDB.',
  bang: [bang1('v1', ['SQL → MongoDB', 'SQL → MongoDB'],
    [{ ma: 'sql', ten: 'Relational (SQL)' }, { ma: 'mg', ten: 'MongoDB', luaChon: T }],
    [
      { o: { sql: 'Table' }, a: { mg: 'Collection' } },
      { o: { sql: 'Row' }, a: { mg: 'Document' } },
      { o: { sql: 'Column' }, a: { mg: 'Field' } },
      { o: { sql: 'JOIN across tables' }, a: { mg: 'Embed a sub-document or reference + populate' } },
      { o: { sql: 'Primary key (id INT IDENTITY)' }, a: { mg: '_id' } },
    ],
    ['A collection holds documents; a document has fields; there is no JOIN — either the data lives inside the document (embedded) or it is referenced by id and filled in later (Mongoose populate, Chapter 3.2). Every document gets an <code>_id</code> (an ObjectId unless you set one).', 'Collection chứa document; document có field; không có JOIN — hoặc dữ liệu nằm trong document (nhúng) hoặc được tham chiếu bằng id rồi điền sau (populate của Mongoose, Chương 3.2). Mỗi document có <code>_id</code> (ObjectId nếu bạn không tự đặt).'])],
  goiY: [['A row is one record; a document is one record too.', 'Một hàng là một bản ghi; một document cũng là một bản ghi.'], ['Think about what replaces a foreign key.', 'Nghĩ xem cái gì thay khoá ngoại.']],
  loi: [['Mapping a table to a document.', 'Ánh xạ bảng thành document.'], ['Thinking MongoDB has JOIN.', 'Tưởng MongoDB có JOIN.']],
  tns: [tn('collection', 'tập hợp'), tn('document', 'tài liệu'), tn('embed', 'nhúng')],
  kn: ['document model'],
});

/* ── 2 ── CRUD */
const E2 = bai({
  ten: 'The four CRUD operations, mongosh style', kho: 'MEDIUM', phut: 15, lib: ['mongosh'],
  en: J`<p>Write the four functions of the lesson against <code>db.products</code> (it already contains 5 products):</p>
<ul><li><code>createBook(name, price)</code> — insert <code>{ name, price, tags: [] }</code>; return the new <code>_id</code>;</li>
<li><code>findCheaperThan(max)</code> — products with <code>price &lt; max</code>, cheapest first, showing <b>only</b> <code>name</code> and <code>price</code> (no <code>_id</code>);</li>
<li><code>setPrice(name, price)</code> — change the price of the product with that name; return how many documents were modified;</li>
<li><code>removeByName(name)</code> — delete one product by name; return how many were deleted.</li></ul>`,
  vi: J`<p>Viết bốn hàm của bài trên <code>db.products</code> (đã có sẵn 5 sản phẩm):</p>
<ul><li><code>createBook(name, price)</code> — thêm <code>{ name, price, tags: [] }</code>; trả <code>_id</code> mới;</li>
<li><code>findCheaperThan(max)</code> — sản phẩm có <code>price &lt; max</code>, rẻ nhất trước, <b>chỉ</b> hiện <code>name</code> và <code>price</code> (không <code>_id</code>);</li>
<li><code>setPrice(name, price)</code> — đổi giá sản phẩm có tên đó; trả số document đã sửa;</li>
<li><code>removeByName(name)</code> — xoá một sản phẩm theo tên; trả số đã xoá.</li></ul>`,
  yc: [
    ['<code>insertOne</code> returns <code>{ acknowledged, insertedId }</code>.', '<code>insertOne</code> trả <code>{ acknowledged, insertedId }</code>.'],
    ['Comparison operators live inside the field: <code>{ price: { $lt: max } }</code>.', 'Toán tử so sánh nằm trong field: <code>{ price: { $lt: max } }</code>.'],
    ['Projection is the 2nd argument of <code>find</code>: <code>{ name: 1, price: 1, _id: 0 }</code>.', 'Phép chiếu là đối số thứ 2 của <code>find</code>: <code>{ name: 1, price: 1, _id: 0 }</code>.'],
    ['<code>updateOne</code> needs an update operator: <code>{ $set: { price } }</code>.', '<code>updateOne</code> cần toán tử cập nhật: <code>{ $set: { price } }</code>.'],
  ],
  viDu: [['findCheaperThan(10)', '[{"name":"Pen","price":2},{"name":"Notebook","price":5}]', 'Sorted with .sort({ price: 1 }).', 'Sắp bằng .sort({ price: 1 }).'], ['setPrice(\'Pen\', 3)', '1', 'modifiedCount of the update result.', 'modifiedCount của kết quả cập nhật.']],
  goiY: [
    ['<code>return db.products.insertOne({ name, price, tags: [] }).insertedId;</code>', '<code>return db.products.insertOne({ name, price, tags: [] }).insertedId;</code>'],
    ['<code>db.products.find({ price: { $lt: max } }, { name: 1, price: 1, _id: 0 }).sort({ price: 1 })</code>', '<code>db.products.find({ price: { $lt: max } }, { name: 1, price: 1, _id: 0 }).sort({ price: 1 })</code>'],
  ],
  loi: [
    ['<code>updateOne({ name }, { price })</code> without <code>$set</code>: the driver refuses ("Update document requires atomic operators").', '<code>updateOne({ name }, { price })</code> thiếu <code>$set</code>: driver từ chối ("Update document requires atomic operators").'],
    ['Forgetting <code>_id: 0</code>: <code>_id</code> is included by default in every projection.', 'Quên <code>_id: 0</code>: <code>_id</code> mặc định luôn có trong mọi phép chiếu.'],
    ['Returning the whole result object instead of <code>modifiedCount</code> / <code>deletedCount</code>.', 'Trả cả đối tượng kết quả thay vì <code>modifiedCount</code> / <code>deletedCount</code>.'],
  ],
  gt: [
    'Each CRUD call takes a FILTER that selects documents and (for updates) an UPDATE made of operators. The answers are "write results" — counters that tell you what actually happened: setting a price to the value it already has gives <code>modifiedCount: 0</code>, and deleting a name that is not there gives <code>deletedCount: 0</code> — no error, just a zero to check.',
    'Mỗi lệnh CRUD nhận một BỘ LỌC chọn document và (với cập nhật) một BẢN CẬP NHẬT gồm các toán tử. Câu trả lời là "kết quả ghi" — các bộ đếm cho biết chuyện gì thực sự đã xảy ra: đặt giá bằng đúng giá đang có cho <code>modifiedCount: 0</code>, xoá một tên không có cho <code>deletedCount: 0</code> — không lỗi, chỉ là số 0 để kiểm.',
  ],
  kn: ['CRUD', 'mongosh'],
  tns: [tn('filter', 'bộ lọc'), tn('projection', 'phép chiếu', 'chọn field trả về'), tn('write result', 'kết quả ghi')],
  dau: J`${GHI}

function createBook(name, price) {
  return db.products.insertOne({ name, price });
}

function findCheaperThan(max) {
  return db.products.find({ price: max });
}

function setPrice(name, price) {
  return db.products.updateOne({ name }, { $set: { price } });
}

function removeByName(name) {
  return db.products.deleteOne({ name }).deletedCount;
}
`,
  giai: J`${GHI}

// C — insertOne returns { acknowledged, insertedId }
function createBook(name, price) {
  return db.products.insertOne({ name, price, tags: [] }).insertedId;
}

// R — filter with an operator, project only two fields, sort cheapest first
function findCheaperThan(max) {
  return db.products
    .find({ price: { $lt: max } }, { name: 1, price: 1, _id: 0 })   // _id is shown unless you say 0
    .sort({ price: 1 });
}

// U — an update needs an operator ($set); the result tells what really changed
function setPrice(name, price) {
  return db.products.updateOne({ name }, { $set: { price } }).modifiedCount;
}

// D
function removeByName(name) {
  return db.products.deleteOne({ name }).deletedCount;
}
`,
  chuanBi: SEED,
  cases: [
    { goi: `findCheaperThan(10)`, moTa: ['findCheaperThan(10) → Pen, Notebook (name + price only)', 'findCheaperThan(10) → Pen, Notebook (chỉ name + price)'] },
    { goi: `(() => { const id = createBook('Dune', 12); return [typeof id === 'object' && String(id).length === 24, db.products.findOne({ _id: id }, { _id: 0 })]; })()`, moTa: ['createBook returns the new _id and stores tags: []', 'createBook trả _id mới và lưu tags: []'] },
    { goi: `[setPrice('Pen', 3), db.products.findOne({ name: 'Pen' }).price]`, moTa: ['setPrice → 1 and the price changed', 'setPrice → 1 và giá đã đổi'] },
    { goi: `[removeByName('Pen'), removeByName('Pen'), db.products.countDocuments({})]`, moTa: ['removeByName deletes one, then 0', 'removeByName xoá một, rồi 0'] },
    { goi: `[setPrice('Notebook', 5), setPrice('Ghost', 9)]`, an: true, moTa: ['Same value or no match → 0 modified', 'Cùng giá trị hoặc không khớp → 0 đã sửa'] },
    { goi: `findCheaperThan(41)`, an: true },
    { goi: `(createBook('Zero', 0), findCheaperThan(3))`, an: true },
  ],
});

/* ── 3 ── filters */
const E3 = bai({
  ten: 'Query operators: write the filters', kho: 'MEDIUM', phut: 18, lib: ['mongosh'],
  en: J`<p>Each function returns a <b>filter object</b> (it does not query). The grader runs <code>db.products.find(yourFilter)</code> and compares the names found.</p>
<ul><li><code>byTag(tag)</code> — products whose <code>tags</code> array contains <code>tag</code>;</li>
<li><code>priceBetween(min, max)</code> — <code>min ≤ price ≤ max</code>;</li>
<li><code>nameContains(text)</code> — name contains <code>text</code>, case-insensitive. The text is typed by a user, so <code>"C++"</code> must be searched literally (escape regex special characters);</li>
<li><code>availableOrOnSale()</code> — <code>stock &gt; 0</code> OR <code>onSale</code> is <code>true</code>;</li>
<li><code>byAuthor(name)</code> — the embedded <code>author.name</code> equals <code>name</code>.</li></ul>`,
  vi: J`<p>Mỗi hàm trả về một <b>đối tượng lọc</b> (không truy vấn). Máy chấm chạy <code>db.products.find(boLocCuaBan)</code> và so tên tìm được.</p>
<ul><li><code>byTag(tag)</code> — sản phẩm có mảng <code>tags</code> chứa <code>tag</code>;</li>
<li><code>priceBetween(min, max)</code> — <code>min ≤ price ≤ max</code>;</li>
<li><code>nameContains(text)</code> — tên chứa <code>text</code>, không phân biệt hoa thường. Chữ do người dùng gõ nên <code>"C++"</code> phải được tìm nguyên văn (escape ký tự đặc biệt của regex);</li>
<li><code>availableOrOnSale()</code> — <code>stock &gt; 0</code> HOẶC <code>onSale</code> là <code>true</code>;</li>
<li><code>byAuthor(name)</code> — <code>author.name</code> nhúng bằng <code>name</code>.</li></ul>`,
  yc: [
    ['An array field matches a single value if ANY element equals it: <code>{ tags: tag }</code>.', 'Field mảng khớp một giá trị nếu BẤT KỲ phần tử nào bằng nó: <code>{ tags: tag }</code>.'],
    ['Two conditions on one field go in ONE object: <code>{ price: { $gte: min, $lte: max } }</code>.', 'Hai điều kiện trên một field nằm trong MỘT đối tượng: <code>{ price: { $gte: min, $lte: max } }</code>.'],
    ['Nested fields use a quoted dotted path: <code>{ \'author.name\': name }</code>.', 'Field lồng dùng đường có dấu chấm trong ngoặc: <code>{ \'author.name\': name }</code>.'],
  ],
  viDu: [['db.products.find(byTag(\'office\'))', 'Pen, Notebook', 'Array contains "office".', 'Mảng chứa "office".'], ['db.products.find(nameContains(\'c++\'))', 'C++ Primer', '"+" is a regex symbol: escape it.', '"+" là ký hiệu regex: phải escape.']],
  goiY: [
    ['<code>{ name: { $regex: escaped, $options: \'i\' } }</code> with <code>const escaped = text.replace(/[.*+?^@{}()|[\\]\\\\]/g, \'\\\\$&\');</code>', '<code>{ name: { $regex: escaped, $options: \'i\' } }</code> với <code>const escaped = text.replace(/[.*+?^@{}()|[\\]\\\\]/g, \'\\\\$&\');</code>'],
    ['<code>{ $or: [{ stock: { $gt: 0 } }, { onSale: true }] }</code>', '<code>{ $or: [{ stock: { $gt: 0 } }, { onSale: true }] }</code>'],
  ],
  loi: [
    ['<code>{ price: { $gte: min }, price: { $lte: max } }</code> — a JS object cannot hold the same key twice: the second one silently replaces the first.', '<code>{ price: { $gte: min }, price: { $lte: max } }</code> — đối tượng JS không giữ được cùng một khoá hai lần: khoá sau lặng lẽ đè khoá trước.'],
    ['<code>{ author: { name } }</code> matches only documents whose WHOLE author object is exactly <code>{ name }</code> — use the dotted path.', '<code>{ author: { name } }</code> chỉ khớp document có CẢ đối tượng author đúng bằng <code>{ name }</code> — dùng đường có dấu chấm.'],
    ['Passing user text straight into <code>$regex</code>: <code>"C++"</code> is an invalid pattern, and <code>".*"</code> matches everything.', 'Đưa thẳng chữ người dùng vào <code>$regex</code>: <code>"C++"</code> là mẫu không hợp lệ, còn <code>".*"</code> khớp tất cả.'],
  ],
  gt: [
    'MongoDB filters are documents too: field → value means equality (with arrays meaning "contains"), field → <code>{ $op: … }</code> means a comparison, and <code>$or</code> takes a list of filters. Dotted paths reach into embedded documents — which is the payoff of embedding <code>author</code>: no join needed to filter on it. Escaping user input before it becomes a regex keeps the search literal and safe.',
    'Bộ lọc MongoDB cũng là document: field → giá trị là so bằng (với mảng nghĩa là "chứa"), field → <code>{ $op: … }</code> là phép so sánh, còn <code>$or</code> nhận một danh sách bộ lọc. Đường có dấu chấm đi vào document nhúng — đó là cái lợi của việc nhúng <code>author</code>: lọc theo nó không cần join. Escape chữ người dùng trước khi thành regex giữ phép tìm đúng nguyên văn và an toàn.',
  ],
  kn: ['query operators', '$regex', '$or'],
  tns: [tn('dot notation', 'ký pháp dấu chấm', '\'author.name\''), tn('escape', 'thoát ký tự', 'làm ký tự đặc biệt mất nghĩa đặc biệt')],
  dau: J`${GHI}

function byTag(tag) { return { tags: [tag] }; }
function priceBetween(min, max) { return { price: { $gte: min }, price: { $lte: max } }; }
function nameContains(text) { return { name: { $regex: text } }; }
function availableOrOnSale() { return { stock: { $gt: 0 }, onSale: true }; }
function byAuthor(name) { return { author: { name } }; }
`,
  giai: J`${GHI}

// an array field matches a scalar when ANY element equals it
function byTag(tag) { return { tags: tag }; }

// two conditions on the same field ⇒ one object (a duplicate key would overwrite the first)
function priceBetween(min, max) { return { price: { $gte: min, $lte: max } }; }

// user text ⇒ escape regex symbols, then match case-insensitively
function nameContains(text) {
  const escaped = text.replace(/[.*+?^@{}()|[\]\\]/g, '\\$&');
  return { name: { $regex: escaped, $options: 'i' } };
}

// OR needs $or with a list of filters (plain keys are always AND)
function availableOrOnSale() { return { $or: [{ stock: { $gt: 0 } }, { onSale: true }] }; }

// reach into the embedded document with a dotted path
function byAuthor(name) { return { 'author.name': name }; }
`,
  chuanBi: `${SEED} const names = (f) => db.products.find(f).map((p) => p.name);`,
  cases: [
    { goi: `names(byTag('office'))`, moTa: ['byTag(\'office\') → Pen, Notebook', 'byTag(\'office\') → Pen, Notebook'] },
    { goi: `names(priceBetween(5, 40))`, moTa: ['priceBetween(5, 40) → both bounds included', 'priceBetween(5, 40) → gồm cả hai biên'] },
    { goi: `names(nameContains('c++'))`, moTa: ['nameContains(\'c++\') → C++ Primer', 'nameContains(\'c++\') → C++ Primer'] },
    { goi: `names(availableOrOnSale())`, moTa: ['availableOrOnSale() → in stock OR on sale', 'availableOrOnSale() → còn hàng HOẶC đang giảm giá'] },
    { goi: `names(byAuthor('Fowler'))`, moTa: ['byAuthor(\'Fowler\') → Refactoring', 'byAuthor(\'Fowler\') → Refactoring'] },
    { goi: `[names(nameContains('NOTE')), names(nameContains('.*')), names(byTag('tech'))]`, an: true },
    { goi: `[names(priceBetween(0, 2)), names(priceBetween(56, 99))]`, an: true },
    { goi: `(db.products.insertOne({ name: 'Old Pen', price: 1, stock: 0, author: { name: 'Fowler', year: 1999 } }), names(byAuthor('Fowler')))`, an: true },
  ],
});

/* ── 4 ── update operators */
const E4 = bai({
  ten: 'Update operators: $inc, $addToSet, $pull and updateMany', kho: 'MEDIUM', phut: 15, lib: ['mongosh'],
  en: J`<p>Change documents <b>in place</b> with update operators — never by reading, editing in JavaScript and writing the whole document back. Each function returns the <code>modifiedCount</code>.</p>
<ul><li><code>restock(name, n)</code> — add <code>n</code> to <code>stock</code>;</li>
<li><code>addTag(name, tag)</code> — add <code>tag</code> to <code>tags</code> only if it is not there yet;</li>
<li><code>removeTag(name, tag)</code> — remove <code>tag</code> from <code>tags</code>;</li>
<li><code>markSoldOut()</code> — every product with <code>stock: 0</code> gets <code>status: 'sold-out'</code> (one call, all matching documents).</li></ul>`,
  vi: J`<p>Sửa document <b>tại chỗ</b> bằng toán tử cập nhật — đừng đọc ra, sửa bằng JavaScript rồi ghi đè cả document. Mỗi hàm trả <code>modifiedCount</code>.</p>
<ul><li><code>restock(name, n)</code> — cộng <code>n</code> vào <code>stock</code>;</li>
<li><code>addTag(name, tag)</code> — thêm <code>tag</code> vào <code>tags</code> chỉ khi chưa có;</li>
<li><code>removeTag(name, tag)</code> — bỏ <code>tag</code> khỏi <code>tags</code>;</li>
<li><code>markSoldOut()</code> — mọi sản phẩm <code>stock: 0</code> nhận <code>status: 'sold-out'</code> (một lệnh, mọi document khớp).</li></ul>`,
  yc: [
    ['<code>$inc</code> adds atomically — two requests restocking at once cannot lose an update.', '<code>$inc</code> cộng nguyên tử — hai request cùng nhập hàng không làm mất lần nào.'],
    ['<code>$addToSet</code> vs <code>$push</code>: the first refuses duplicates.', '<code>$addToSet</code> vs <code>$push</code>: cái đầu từ chối trùng.'],
    ['<code>updateOne</code> touches the first match only; <code>updateMany</code> touches all.', '<code>updateOne</code> chỉ chạm bản khớp đầu tiên; <code>updateMany</code> chạm tất cả.'],
  ],
  viDu: [['restock(\'Pen\', 5)', '1   // Pen.stock: 0 → 5', 'One document modified.', 'Một document đã sửa.'], ['addTag(\'Notebook\', \'office\')', '0', '"office" is already there: nothing changes.', '"office" đã có: không có gì đổi.']],
  goiY: [
    ['<code>db.products.updateOne({ name }, { $inc: { stock: n } }).modifiedCount</code>', '<code>db.products.updateOne({ name }, { $inc: { stock: n } }).modifiedCount</code>'],
    ['<code>db.products.updateMany({ stock: 0 }, { $set: { status: \'sold-out\' } })</code>', '<code>db.products.updateMany({ stock: 0 }, { $set: { status: \'sold-out\' } })</code>'],
  ],
  loi: [
    ['Read-modify-write: <code>const p = db.products.findOne({ name }); db.products.updateOne({ name }, { $set: { stock: p.stock + n } })</code> — two concurrent requests both read 0 and both write 5.', 'Đọc-sửa-ghi: <code>const p = db.products.findOne({ name }); db.products.updateOne({ name }, { $set: { stock: p.stock + n } })</code> — hai request đồng thời cùng đọc 0 và cùng ghi 5.'],
    ['<code>$push</code> for tags: "office" ends up twice.', '<code>$push</code> cho tags: "office" xuất hiện hai lần.'],
    ['<code>updateOne({ stock: 0 }, …)</code> for "every product": only the first sold-out product changes.', '<code>updateOne({ stock: 0 }, …)</code> cho "mọi sản phẩm": chỉ sản phẩm hết hàng đầu tiên đổi.'],
  ],
  gt: [
    'Update operators describe the CHANGE, and the database applies it to the current value atomically — that is why <code>$inc</code> is safe under concurrency while read-modify-write is not. <code>$addToSet</code> and <code>$pull</code> manage arrays without loading them, and <code>modifiedCount</code> honestly reports 0 when the change was a no-op.',
    'Toán tử cập nhật mô tả SỰ THAY ĐỔI, và CSDL áp nó lên giá trị hiện tại một cách nguyên tử — vì vậy <code>$inc</code> an toàn khi đồng thời còn đọc-sửa-ghi thì không. <code>$addToSet</code> và <code>$pull</code> quản mảng mà không cần nạp nó ra, và <code>modifiedCount</code> báo thật là 0 khi thay đổi không làm gì.',
  ],
  kn: ['update operators', 'atomic updates'],
  tns: [tn('atomic', 'nguyên tử', 'không bị chen ngang giữa chừng'), tn('$addToSet', 'thêm nếu chưa có')],
  dau: J`${GHI}

function restock(name, n) {
  const p = db.products.findOne({ name });
  return db.products.updateOne({ name }, { $set: { stock: p.stock + n } }).modifiedCount;
}
function addTag(name, tag) { return db.products.updateOne({ name }, { $push: { tags: tag } }).modifiedCount; }
function removeTag(name, tag) { return db.products.updateOne({ name }, { $pull: { tags: tag } }).modifiedCount; }
function markSoldOut() { return db.products.updateOne({ stock: 0 }, { $set: { status: 'sold-out' } }).modifiedCount; }
`,
  giai: J`${GHI}

// $inc: the database adds to the CURRENT value — safe when two requests run at once
function restock(name, n) {
  return db.products.updateOne({ name }, { $inc: { stock: n } }).modifiedCount;
}
// $addToSet: push only if the value is not in the array yet
function addTag(name, tag) {
  return db.products.updateOne({ name }, { $addToSet: { tags: tag } }).modifiedCount;
}
// $pull: remove every element equal to tag
function removeTag(name, tag) {
  return db.products.updateOne({ name }, { $pull: { tags: tag } }).modifiedCount;
}
// updateMany: ALL matching documents, in one round trip
function markSoldOut() {
  return db.products.updateMany({ stock: 0 }, { $set: { status: 'sold-out' } }).modifiedCount;
}
`,
  chuanBi: `${SEED} const one = (name) => db.products.findOne({ name }, { _id: 0, name: 1, stock: 1, tags: 1, status: 1 });`,
  cases: [
    { goi: `[restock('Pen', 5), one('Pen')]`, moTa: ['restock adds to stock', 'restock cộng vào stock'] },
    { goi: `[addTag('Notebook', 'office'), addTag('Notebook', 'school'), one('Notebook')]`, moTa: ['addTag refuses a duplicate', 'addTag từ chối bản trùng'] },
    { goi: `[removeTag('Clean Code', 'tech'), one('Clean Code')]`, moTa: ['removeTag pulls the tag', 'removeTag gỡ tag'] },
    { goi: `[markSoldOut(), db.products.find({ status: 'sold-out' }).map((p) => p.name)]`, moTa: ['markSoldOut updates EVERY product with stock 0', 'markSoldOut sửa MỌI sản phẩm stock 0'] },
    { goi: `[restock('Ghost', 1), removeTag('Pen', 'nope'), markSoldOut(), markSoldOut()]`, an: true },
    { goi: `(db.products.updateOne({ name: 'Pen' }, { $unset: { stock: 1 } }), [restock('Pen', 2), one('Pen')])`, an: true },
  ],
});

/* ── 5 ── clean data */
const E5 = bai({
  ten: 'The no-schema trap: find and repair inconsistent documents', kho: 'HARD', phut: 25, lib: ['mongosh'],
  en: J`<p>The warning of the lesson came true: without a schema, <code>db.products</code> filled up with inconsistent documents. Some have the price as a <b>string</b> (<code>"25"</code>), some have a typo'd field <code>prise</code> instead of <code>price</code>, some have no <code>tags</code> at all. Write <code>cleanProducts()</code> that repairs the collection with update operators and returns</p>
<pre>{ renamed, converted, tagged }   // how many documents each step modified</pre>
<ol><li><b>renamed</b>: documents that have <code>prise</code> get it renamed to <code>price</code> (<code>$rename</code>);</li>
<li><b>converted</b>: documents whose <code>price</code> is a string get <code>Number(price)</code> (find them with <code>{ price: { $type: 'string' } }</code>, then update each by <code>_id</code>);</li>
<li><b>tagged</b>: documents without a <code>tags</code> field get <code>tags: []</code> (<code>$exists: false</code>).</li></ol>
<p>Order matters: rename first, so a typo'd string price is converted too.</p>`,
  vi: J`<p>Lời cảnh báo của bài thành sự thật: không có schema, <code>db.products</code> đầy những document không nhất quán. Có cái giá là <b>chuỗi</b> (<code>"25"</code>), có cái gõ nhầm field <code>prise</code> thay vì <code>price</code>, có cái không có <code>tags</code>. Viết <code>cleanProducts()</code> sửa collection bằng toán tử cập nhật và trả</p>
<pre>{ renamed, converted, tagged }   // số document mỗi bước đã sửa</pre>
<ol><li><b>renamed</b>: document có <code>prise</code> được đổi tên thành <code>price</code> (<code>$rename</code>);</li>
<li><b>converted</b>: document có <code>price</code> là chuỗi nhận <code>Number(price)</code> (tìm bằng <code>{ price: { $type: 'string' } }</code>, rồi sửa từng cái theo <code>_id</code>);</li>
<li><b>tagged</b>: document không có field <code>tags</code> nhận <code>tags: []</code> (<code>$exists: false</code>).</li></ol>
<p>Thứ tự quan trọng: đổi tên trước, để giá chuỗi bị gõ nhầm tên cũng được đổi kiểu.</p>`,
  yc: [
    ['Step 1 and 3 are one <code>updateMany</code> each.', 'Bước 1 và 3 mỗi bước là một <code>updateMany</code>.'],
    ['Step 2 needs the old value, so loop over the found documents and <code>updateOne({ _id: d._id }, { $set: { price: Number(d.price) } })</code>.', 'Bước 2 cần giá trị cũ, nên lặp qua document tìm được và <code>updateOne({ _id: d._id }, { $set: { price: Number(d.price) } })</code>.'],
    ['Count what was MODIFIED (sum the <code>modifiedCount</code>s), not what was found.', 'Đếm cái ĐÃ SỬA (cộng các <code>modifiedCount</code>), không đếm cái tìm thấy.'],
  ],
  viDu: [['cleanProducts()  // on the sample data', '{"renamed":2,"converted":3,"tagged":2}', 'One of the renamed documents also had a string price.', 'Một document vừa đổi tên cũng có giá dạng chuỗi.'], ['cleanProducts()  // a second time', '{"renamed":0,"converted":0,"tagged":0}', 'Repairing twice is harmless.', 'Sửa lần hai vô hại.']],
  goiY: [
    ['<code>db.products.updateMany({ prise: { $exists: true } }, { $rename: { prise: \'price\' } }).modifiedCount</code>', '<code>db.products.updateMany({ prise: { $exists: true } }, { $rename: { prise: \'price\' } }).modifiedCount</code>'],
    ['<code>for (const d of db.products.find({ price: { $type: \'string\' } })) converted += db.products.updateOne(…).modifiedCount;</code>', '<code>for (const d of db.products.find({ price: { $type: \'string\' } })) converted += db.products.updateOne(…).modifiedCount;</code>'],
  ],
  loi: [
    ['Converting before renaming: <code>{ prise: "12" }</code> is renamed afterwards and stays a string.', 'Đổi kiểu trước khi đổi tên: <code>{ prise: "12" }</code> được đổi tên sau đó và vẫn là chuỗi.'],
    ['<code>{ tags: null }</code> to find missing tags — it also matches documents where tags is explicitly null, and you would count differently; the task says "no tags field": <code>$exists: false</code>.', '<code>{ tags: null }</code> để tìm tags thiếu — nó khớp cả document có tags bằng null tường minh, và bạn sẽ đếm khác; đề nói "không có field tags": <code>$exists: false</code>.'],
    ['Replacing whole documents with <code>insertOne</code> after deleting them — the <code>_id</code>s change and every reference to them breaks.', 'Thay cả document bằng <code>insertOne</code> sau khi xoá — <code>_id</code> đổi và mọi tham chiếu tới chúng gãy.'],
  ],
  gt: [
    'MongoDB accepted every bad document because the database has no schema — exactly the trap of the lesson. Repairing is a data migration: rename the field, fix the types, add defaults. <code>$type</code> and <code>$exists</code> find the broken shapes; operators fix them in place and keep every <code>_id</code>. The real fix comes next lesson: a Mongoose schema that refuses these documents in the first place.',
    'MongoDB nhận mọi document xấu vì CSDL không có schema — đúng cái bẫy của bài. Sửa chữa là một cuộc di trú dữ liệu: đổi tên field, sửa kiểu, thêm mặc định. <code>$type</code> và <code>$exists</code> tìm các hình dạng hỏng; toán tử sửa chúng tại chỗ và giữ mọi <code>_id</code>. Cách sửa thật đến ở bài sau: một schema Mongoose từ chối các document này ngay từ đầu.',
  ],
  kn: ['data migration', '$type', '$rename'],
  tns: [tn('data migration', 'di trú dữ liệu'), tn('$exists', 'kiểm field có tồn tại không')],
  dau: J`${GHI}

function cleanProducts() {
  let converted = 0;
  for (const d of db.products.find({ price: { $type: 'string' } })) {
    converted += db.products.updateOne({ _id: d._id }, { $set: { price: Number(d.price) } }).modifiedCount;
  }
  const renamed = db.products.updateMany({ prise: { $exists: true } }, { $rename: { prise: 'price' } }).modifiedCount;
  return { renamed, converted, tagged: 0 };
}
`,
  giai: J`${GHI}

function cleanProducts() {
  // 1) fix the field NAME first, so the type fix below sees every price
  const renamed = db.products
    .updateMany({ prise: { $exists: true } }, { $rename: { prise: 'price' } })
    .modifiedCount;

  // 2) fix the TYPE: needs the old value, so update document by document (by _id)
  let converted = 0;
  for (const d of db.products.find({ price: { $type: 'string' } })) {
    converted += db.products.updateOne({ _id: d._id }, { $set: { price: Number(d.price) } }).modifiedCount;
  }

  // 3) add the missing DEFAULT
  const tagged = db.products
    .updateMany({ tags: { $exists: false } }, { $set: { tags: [] } })
    .modifiedCount;

  return { renamed, converted, tagged };
}
`,
  chuanBi: `db.products.insertMany([
    { name: 'Clean Code', price: '25', tags: ['tech'] },
    { name: 'Pen', prise: 2, tags: ['office'] },
    { name: 'Notebook', prise: '12' },
    { name: 'Refactoring', price: 40 },
    { name: 'Ruler', price: '3.5', tags: [] },
  ]); const view = () => db.products.find({}, { _id: 0 });`,
  cases: [
    { goi: `cleanProducts()`, moTa: ['Counts on the sample data', 'Số đếm trên dữ liệu mẫu'] },
    { goi: `(cleanProducts(), view())`, moTa: ['After cleaning: numeric prices, no prise, tags everywhere', 'Sau khi sửa: giá là số, hết prise, đâu cũng có tags'] },
    { goi: `(cleanProducts(), cleanProducts())`, moTa: ['Running it twice changes nothing', 'Chạy hai lần không đổi gì'] },
    { goi: `(db.products.insertOne({ name: 'Glue', prise: '7', price: undefined }), cleanProducts())`, an: true },
    { goi: `(db.products.deleteMany({}), db.products.insertOne({ name: 'Ok', price: 1, tags: [] }), cleanProducts())`, an: true },
  ],
});

/* ── 6 ── choice */
const E6 = cs({
  ten: 'Embed or reference? The key modelling decision', kho: 'EASY', phut: 8,
  en: 'The ★ rule of the lesson: "data that is read together, stored together" — but shared or unbounded data is referenced.',
  vi: 'Luật ★ của bài: "dữ liệu đọc cùng nhau thì lưu cùng nhau" — còn dữ liệu dùng chung hoặc lớn không giới hạn thì tham chiếu.',
  cau: [
    q('e1', ['A product has 2–5 tags that are always shown with it.', 'Một sản phẩm có 2–5 tag luôn được hiện cùng nó.'],
      ['Embed: an array of strings inside the product', 'Reference: a Tag collection and an array of tag ids', 'A separate collection per tag', 'Store tags in the user document'],
      ['Small, bounded, read together — the textbook case for embedding.', 'Nhỏ, có giới hạn, đọc cùng nhau — trường hợp kinh điển để nhúng.']),
    q('e2', ['A user places thousands of orders over the years.', 'Một người dùng đặt hàng nghìn đơn qua nhiều năm.'],
      ['Reference: each order stores the user id', 'Embed every order in an array inside the user document', 'Embed the user inside every order and delete the users collection', 'Store orders as a comma-separated string on the user'],
      ['An unbounded array would make the user document grow forever (MongoDB caps a document at 16 MB) and every read of the user would drag the orders along.', 'Mảng không giới hạn làm document người dùng to mãi (MongoDB giới hạn một document 16 MB) và mỗi lần đọc người dùng lại kéo theo đơn hàng.']),
    q('e3', ['The author\'s name appears on 500 posts and the author can change it.', 'Tên tác giả xuất hiện trên 500 bài viết và tác giả có thể đổi tên.'],
      ['Reference the user from each post (populate when reading)', 'Embed the full author document in every post', 'Copy the name into every post and never allow renaming', 'Create one collection per author'],
      ['Shared data that changes: with a reference, renaming is one update instead of 500.', 'Dữ liệu dùng chung lại hay đổi: tham chiếu thì đổi tên là một lần cập nhật thay vì 500.']),
    q('e4', ['<code>db.products.insertOne({ nmae: \'Pen\', price: \'two\' })</code> on a plain MongoDB collection. What happens?', '<code>db.products.insertOne({ nmae: \'Pen\', price: \'two\' })</code> trên collection MongoDB thường. Chuyện gì xảy ra?'],
      ['It is inserted as is — MongoDB itself checks no field names or types', 'MongoDB rejects it: unknown field nmae', 'MongoDB converts "two" to 2', 'It is inserted without the price field'],
      ['That flexibility is the trap; Mongoose schemas (lesson 3.2) are the guard.', 'Sự linh hoạt đó là cái bẫy; schema Mongoose (bài 3.2) là người gác.']),
  ],
  goiY: [['Ask: bounded? read together? shared? changes?', 'Hỏi: có giới hạn? đọc cùng? dùng chung? hay đổi?'], ['16 MB per document.', '16 MB mỗi document.']],
  loi: [['Embedding unbounded lists.', 'Nhúng danh sách không giới hạn.'], ['Believing MongoDB validates fields.', 'Tin rằng MongoDB kiểm tra field.']],
  tns: [tn('embed', 'nhúng'), tn('reference', 'tham chiếu')],
  kn: ['data modelling'],
});

export default doiDau({
  slug: 'sdn302-3-1-mongodb-crud',
  ten: '3.1 NoSQL, MongoDB & CRUD',
  khoa: KHOA,
  baiHoc: 'sdn302-3-1-mongodb-crud',
  de: [E1, E6, E2, E3, E4, E5],
});
