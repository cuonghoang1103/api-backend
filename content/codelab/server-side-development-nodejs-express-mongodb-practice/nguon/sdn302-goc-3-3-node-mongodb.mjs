/** SDN302 · Slot 3.3 (slide gốc) — NodeJS with MongoDB: toán tử, so khớp REGEX (buổi 14 của syllabus), sort, skip/limit, updateMany + $inc,
 *  và một bộ câu hỏi bảng "truy vấn → kết quả" — kết quả lấy từ lần chạy THẬT trên MongoDB 7 (09/11/2026). */
import { doiDau, KHOA, bai, cs, q, qn, tn, bang1 } from './_sdn.mjs';

const J = String.raw;
const SEED = `db.products.insertMany([
  { ProductID: 1, Name: 'Laptop', price: 25000 }, { ProductID: 2, Name: 'TV', price: 40000 },
  { ProductID: 3, Name: 'Router', price: 2000 }, { ProductID: 4, Name: 'Scanner', price: 5000 },
  { ProductID: 5, Name: 'Printer', price: 9000 }]);
const names = (a) => Array.from(a).map((d) => d.Name);`;
const KQ = ['Router', 'Printer', 'TV', 'none', 'Router, Scanner, Printer', 'Router, Scanner, Printer, Laptop, TV', 'TV, Scanner, Router, Printer, Laptop', 'Laptop, Printer, Router, Scanner, TV', 'TV, Laptop, Printer, Scanner, Router'];

/* ── 1 ── truy vấn của slide 24–38 */
const E1 = bai({
  ten: 'The queries of the slides: operators, regex, sort, skip and limit', kho: 'MEDIUM', phut: 20, lib: ['mongosh'],
  en: J`<p>The collection <code>db.products</code> holds the five products of the slides (Laptop 25000, TV 40000, Router 2000, Scanner 5000, Printer 9000). Write these functions; each returns the <b>array of matching documents</b> (use <code>db.products.find(...)</code>, which here returns an array-like cursor):</p>
<ul><li><code>expensive()</code> — price greater than 10000;</li>
<li><code>midRange()</code> — 1000 &lt; price &lt; 10000, written with <code>$and</code> as on slide 25;</li>
<li><code>startsWith(letter)</code> — <code>Name</code> starts with the given letter (a <b>regex</b> built from the argument);</li>
<li><code>endsWithEr()</code> — <code>Name</code> ends with <code>er</code>;</li>
<li><code>page(n, size)</code> — products sorted by price ascending, page <code>n</code> (1-based) of <code>size</code> items: <code>sort</code>, then <code>skip</code>, then <code>limit</code>.</li></ul>
<p>And <code>raiseEr()</code> — add 125 to the price of every product whose name ends with <code>er</code> (<code>updateMany</code> + <code>$inc</code>) and return its <code>modifiedCount</code>.</p>`,
  vi: J`<p>Collection <code>db.products</code> chứa năm sản phẩm của slide (Laptop 25000, TV 40000, Router 2000, Scanner 5000, Printer 9000). Viết các hàm sau; mỗi hàm trả <b>mảng tài liệu khớp</b> (dùng <code>db.products.find(...)</code>, ở đây trả về cursor dạng mảng):</p>
<ul><li><code>expensive()</code> — giá lớn hơn 10000;</li>
<li><code>midRange()</code> — 1000 &lt; giá &lt; 10000, viết bằng <code>$and</code> như slide 25;</li>
<li><code>startsWith(letter)</code> — <code>Name</code> bắt đầu bằng chữ cái truyền vào (<b>regex</b> dựng từ đối số);</li>
<li><code>endsWithEr()</code> — <code>Name</code> kết thúc bằng <code>er</code>;</li>
<li><code>page(n, size)</code> — sản phẩm xếp theo giá tăng dần, trang <code>n</code> (đếm từ 1), mỗi trang <code>size</code> món: <code>sort</code>, rồi <code>skip</code>, rồi <code>limit</code>.</li></ul>
<p>Và <code>raiseEr()</code> — cộng 125 vào giá mọi sản phẩm có tên kết thúc bằng <code>er</code> (<code>updateMany</code> + <code>$inc</code>) rồi trả <code>modifiedCount</code>.</p>`,
  yc: [
    ['Comparison operators <code>$gt</code>, <code>$lt</code>; <code>$and</code> takes an array.', 'Toán tử so sánh <code>$gt</code>, <code>$lt</code>; <code>$and</code> nhận một mảng.'],
    ['Regex anchors: <code>^</code> = start, <code>$</code> = end. <code>new RegExp(\'^\' + letter)</code> or <code>{ $regex: \'^\' + letter }</code>.', 'Mốc của regex: <code>^</code> = đầu, <code>$</code> = cuối. <code>new RegExp(\'^\' + letter)</code> hoặc <code>{ $regex: \'^\' + letter }</code>.'],
    ['Pagination: <code>skip((n - 1) * size)</code>.', 'Phân trang: <code>skip((n - 1) * size)</code>.'],
  ],
  viDu: [['names(endsWithEr())', '["Router","Scanner","Printer"]', 'Same as the real run on MongoDB 7.', 'Giống lần chạy thật trên MongoDB 7.'], ['names(page(2, 2))', '["Printer","Laptop"]', 'Sorted by price: Router, Scanner | Printer, Laptop | TV.', 'Xếp theo giá: Router, Scanner | Printer, Laptop | TV.']],
  goiY: [
    ['<code>/er$/</code> and <code>{ $regex: \'er$\' }</code> mean the same.', '<code>/er$/</code> và <code>{ $regex: \'er$\' }</code> cùng nghĩa.'],
    ['Page 1 skips 0 items.', 'Trang 1 bỏ qua 0 món.'],
  ],
  loi: [
    ['<code>/er/</code> without <code>$</code>: also matches names that merely contain "er".', '<code>/er/</code> thiếu <code>$</code>: khớp cả tên chỉ chứa "er" ở giữa.'],
    ['<code>skip(n * size)</code>: page 1 skips the first page.', '<code>skip(n * size)</code>: trang 1 bỏ mất trang đầu.'],
    ['<code>updateMany(filter, { price: 125 })</code> without <code>$inc</code>: refused ("Update document requires atomic operators").', '<code>updateMany(filter, { price: 125 })</code> thiếu <code>$inc</code>: bị từ chối ("Update document requires atomic operators").'],
  ],
  gt: [
    'Every query of Slot 3.3 is a filter object: operators (<code>$gt</code>, <code>$lt</code>, <code>$and</code>), a regex for text patterns, then cursor steps. In real MongoDB <code>skip</code> is always applied before <code>limit</code>; writing them in that order also reads correctly.',
    'Mọi truy vấn của Slot 3.3 là một object bộ lọc: toán tử (<code>$gt</code>, <code>$lt</code>, <code>$and</code>), regex cho mẫu chữ, rồi các bước của cursor. Trong MongoDB thật <code>skip</code> luôn áp trước <code>limit</code>; viết theo đúng thứ tự đó cũng dễ đọc hơn.',
  ],
  kn: ['MongoDB operators', 'regex', 'pagination'],
  tns: [tn('regex', 'biểu thức chính quy'), tn('cursor', 'con trỏ kết quả'), tn('pagination', 'phân trang')],
  dau: J`function expensive() { return db.products.find({ price: { $gte: 10000 } }); }
function midRange() { return db.products.find({ price: { $gt: 1000 } }); }
function startsWith(letter) { return db.products.find({ Name: letter }); }
function endsWithEr() { return db.products.find({ Name: /er/ }); }
function page(n, size) { return db.products.find({}).limit(size).skip(n * size); }
function raiseEr() { return db.products.updateMany({ Name: /er$/ }, { price: 125 }).modifiedCount; }
`,
  giai: J`// Slot 3.3 — every query is a filter object + cursor steps
function expensive() {
  return db.products.find({ price: { $gt: 10000 } });
}
function midRange() {
  return db.products.find({ $and: [{ price: { $gt: 1000 } }, { price: { $lt: 10000 } }] });
}
function startsWith(letter) {
  return db.products.find({ Name: new RegExp('^' + letter) });   // ^ = start of the string
}
function endsWithEr() {
  return db.products.find({ Name: /er$/ });                       // $ = end of the string
}
function page(n, size) {
  return db.products.find({}).sort({ price: 1 }).skip((n - 1) * size).limit(size);
}
function raiseEr() {
  const r = db.products.updateMany({ Name: /er$/ }, { $inc: { price: 125 } });
  return r.modifiedCount;
}
`,
  chuanBi: SEED,
  cases: [
    { goi: `names(expensive())`, moTa: ['price > 10000 → Laptop, TV', 'giá > 10000 → Laptop, TV'] },
    { goi: `names(midRange())`, moTa: ['$and: 1000 < price < 10000', '$and: 1000 < giá < 10000'] },
    { goi: `names(startsWith('P'))`, moTa: ['Starts with P → Printer', 'Bắt đầu bằng P → Printer'] },
    { goi: `names(endsWithEr())`, moTa: ['Ends with er → Router, Scanner, Printer', 'Kết thúc bằng er → Router, Scanner, Printer'] },
    { goi: `names(page(1, 2))`, moTa: ['Page 1 of 2 → the two cheapest', 'Trang 1 cỡ 2 → hai món rẻ nhất'] },
    { goi: `names(page(2, 2))`, an: true },
    { goi: `names(page(3, 2))`, an: true },
    { goi: `names(startsWith('T'))`, an: true },
    { goi: `[raiseEr(), db.products.find({ Name: /er$/ }).map((d) => d.price)]`, an: true },
  ],
});

/* ── 2 ── bảng truy vấn → kết quả (chạy thật) */
const E2 = cs({
  ten: 'Predict the result: the real outputs of Slot 3.3', kho: 'EASY', phut: 10, loai: 'table',
  en: 'For each query on the five products, write the names returned, in order, separated by ", " (or <code>none</code>). All answers come from a real run on MongoDB 7.', vi: 'Với mỗi truy vấn trên năm sản phẩm, ghi các tên được trả về, đúng thứ tự, cách nhau ", " (hoặc <code>none</code>). Mọi đáp án lấy từ lần chạy thật trên MongoDB 7.',
  bang: [bang1('b1', ['Query → names', 'Truy vấn → tên'],
    [{ ma: 'q', ten: 'Query' }, { ma: 'r', ten: 'Result', luaChon: KQ }],
    [
      { o: { q: 'find({ Name: /Ro/ })' }, a: { r: 'Router' } },
      { o: { q: 'find({ Name: { $regex: "^P" } })' }, a: { r: 'Printer' } },
      { o: { q: 'find({}).sort({ price: 1 })' }, a: { r: 'Router, Scanner, Printer, Laptop, TV' } },
      { o: { q: 'find({}).sort({ Name: -1 })' }, a: { r: 'TV, Scanner, Router, Printer, Laptop' } },
      { o: { q: 'find({ Name: /tv/ })' }, a: { r: 'none' } },
      { o: { q: 'find({ Name: /tv/i })' }, a: { r: 'TV' } },
    ],
    ['Regex is case-sensitive unless you add <code>i</code>; string sort compares character codes, so "TV" &gt; "Scanner".', 'Regex phân biệt hoa thường trừ khi thêm <code>i</code>; sắp xếp chuỗi so mã ký tự, nên "TV" &gt; "Scanner".'])],
  goiY: [['Uppercase letters come before lowercase ones, and A &lt; Z.', 'Chữ hoa đứng trước chữ thường, và A &lt; Z.'], ['No <code>i</code> flag = exact case.', 'Không có cờ <code>i</code> = đúng hoa thường.']],
  loi: [['Forgetting that /tv/ does not match "TV".', 'Quên rằng /tv/ không khớp "TV".'], ['Reading -1 as ascending.', 'Đọc -1 thành tăng dần.']],
  kn: ['regex', 'sort'],
});

/* ── 3 ── câu hỏi về driver */
const E3 = cs({
  ten: 'The mongodb driver from Node: connection, await and $lookup', kho: 'EASY', phut: 8,
  en: 'Questions on slides 5–18 and 39–44 of Slot 3.3.', vi: 'Câu hỏi về slide 5–18 và 39–44 của Slot 3.3.',
  cau: [
    q('d1', ['<code>const result = col.insertMany(docs); console.log(result.insertedCount);</code> prints…', '<code>const result = col.insertMany(docs); console.log(result.insertedCount);</code> in ra…'],
      ['undefined — result is still a Promise (no await)', 'the number of documents that were inserted', '0, because nothing is inserted until close()', 'a TypeError is thrown before printing'],
      ['Checked for real: "undefined new document(s) created…". Add await.', 'Đã chạy thật: "undefined new document(s) created…". Thêm await.']),
    q('d2', ['Which connection string does MongoDB Atlas give you?', 'MongoDB Atlas đưa bạn dạng chuỗi kết nối nào?'],
      ['mongodb+srv://user:pwd@cluster0.xxxx.mongodb.net/…', 'mongodb://127.0.0.1:27017/myDatabase', 'https://cluster0.xxxx.mongodb.net:27017/api', 'atlas://user:pwd@cluster0.xxxx/myDatabase'],
      ['SRV format: the hosts are looked up in DNS.', 'Dạng SRV: danh sách máy được tra trong DNS.']),
    qn('d3', ['The four keys of a <code>$lookup</code> stage? (choose all)', 'Bốn khoá của bước <code>$lookup</code>? (chọn hết)'],
      ['from', 'localField', 'foreignField', 'as', 'join', 'on'], [0, 1, 2, 3],
      ['$lookup = left outer join: from, localField, foreignField, as.', '$lookup = left outer join: from, localField, foreignField, as.']),
    q('d4', ['<code>find({ numPurchased: { $gte: 10 } }).limit(1).skip(1)</code> on real MongoDB returns…', '<code>find({ numPurchased: { $gte: 10 } }).limit(1).skip(1)</code> trên MongoDB thật trả…'],
      ['the second matching document', 'nothing (limit 1 then skip 1)', 'the first matching document', 'an error: wrong order'],
      ['MongoDB applies skip before limit whatever the order — real run: order 202.', 'MongoDB áp skip trước limit dù viết thứ tự nào — chạy thật: đơn 202.']),
  ],
  goiY: [['Every driver method returns a Promise.', 'Mọi hàm của driver đều trả Promise.'], ['Atlas = SRV.', 'Atlas = SRV.']],
  loi: [['Missing await.', 'Thiếu await.'], ['Thinking limit/skip run in written order on the server.', 'Tưởng limit/skip chạy đúng thứ tự viết trên server.']],
  kn: ['mongodb driver'],
});

export default doiDau({
  slug: 'sdn302-goc-3-3-node-mongodb',
  ten: 'Slot 3.3 NodeJS with MongoDB (official slides)',
  khoa: KHOA,
  baiHoc: 'sdn302-goc-3-3-node-mongodb',
  de: [E2, E1, E3],
});
