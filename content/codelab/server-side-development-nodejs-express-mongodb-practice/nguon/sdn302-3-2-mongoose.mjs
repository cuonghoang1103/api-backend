/** SDN302 · 3.2 — Mongoose: schema + model, validation (required/min/enum/match…), CRUD bất đồng bộ (await, { new, runValidators }), populate + select, Query ≠ dữ liệu. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const USER = J`const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },   // never returned unless asked with select('+password')
});
const User = mongoose.model('User', userSchema);`;

/* ── 1 ── schema of the lesson */
const E1 = bai({
  ten: 'The lesson\'s productSchema: required, min, a reference and timestamps', kho: 'EASY', phut: 12, lib: ['mongoose'],
  en: J`<p>Define the schema of the lesson and compile it into a model named <code>Product</code>:</p>
<ul><li><code>name</code> — String, required;</li>
<li><code>price</code> — Number, required, at least 0;</li>
<li><code>author</code> — an ObjectId that references the <code>User</code> model;</li>
<li>option <code>{ timestamps: true }</code> so every product gets <code>createdAt</code> / <code>updatedAt</code>.</li></ul>
<p>The validation rules then run automatically on <code>save()</code> / <code>create()</code>: invalid data is rejected <b>before</b> it reaches MongoDB. (The <code>User</code> model is given.)</p>`,
  vi: J`<p>Định nghĩa schema của bài và biên dịch thành model tên <code>Product</code>:</p>
<ul><li><code>name</code> — String, bắt buộc;</li>
<li><code>price</code> — Number, bắt buộc, tối thiểu 0;</li>
<li><code>author</code> — một ObjectId tham chiếu model <code>User</code>;</li>
<li>tuỳ chọn <code>{ timestamps: true }</code> để sản phẩm nào cũng có <code>createdAt</code> / <code>updatedAt</code>.</li></ul>
<p>Khi đó luật kiểm tra tự chạy lúc <code>save()</code> / <code>create()</code>: dữ liệu sai bị từ chối <b>trước</b> khi tới MongoDB. (Model <code>User</code> cho sẵn.)</p>`,
  yc: [
    ['<code>new mongoose.Schema({ … }, { timestamps: true })</code> then <code>mongoose.model(\'Product\', productSchema)</code>.', '<code>new mongoose.Schema({ … }, { timestamps: true })</code> rồi <code>mongoose.model(\'Product\', productSchema)</code>.'],
    ['A reference is <code>{ type: mongoose.Schema.Types.ObjectId, ref: \'User\' }</code>.', 'Tham chiếu là <code>{ type: mongoose.Schema.Types.ObjectId, ref: \'User\' }</code>.'],
    ['Keep the variable name <code>Product</code>.', 'Giữ tên biến <code>Product</code>.'],
  ],
  viDu: [['await Product.create({ name: \'Book\', price: -1 })', 'rejects ValidationError: "Product validation failed: price: Path `price` (-1) is less than minimum allowed value (0)."', 'The min rule.', 'Luật min.'], ['await Product.create({ name: \'Book\', price: 25 })', '{ _id, name: "Book", price: 25, createdAt, updatedAt, __v: 0 }', 'timestamps added the two dates.', 'timestamps thêm hai ngày giờ.']],
  goiY: [
    ['Copy the lesson\'s schema block — then check each rule against the list above.', 'Chép khối schema của bài — rồi đối chiếu từng luật với danh sách trên.'],
    ['<code>price: { type: Number, required: true, min: 0 }</code>', '<code>price: { type: Number, required: true, min: 0 }</code>'],
  ],
  loi: [
    ['<code>ref: \'user\'</code> (lower case): the ref must be the exact MODEL name, <code>\'User\'</code>; populate then fails with MissingSchemaError.', '<code>ref: \'user\'</code> (chữ thường): ref phải đúng TÊN MODEL, <code>\'User\'</code>; populate sẽ hỏng với MissingSchemaError.'],
    ['Putting <code>timestamps: true</code> inside the field definitions instead of the second argument.', 'Đặt <code>timestamps: true</code> trong định nghĩa field thay vì đối số thứ hai.'],
    ['<code>min: 1</code> — a free product (price 0) becomes impossible; read the rule carefully.', '<code>min: 1</code> — sản phẩm miễn phí (giá 0) thành không thể; đọc kỹ luật.'],
  ],
  gt: [
    'A schema is the shape and the rules; a model is the class that talks to the collection (<code>products</code>, pluralised from <code>Product</code>). Validation runs in Node before the insert, so the error message names the path and the rule — perfect for a 400 answer. Casting also happens: <code>price: "25"</code> becomes 25, <code>price: "abc"</code> becomes a CastError inside the ValidationError.',
    'Schema là hình dạng và luật; model là lớp nói chuyện với collection (<code>products</code>, số nhiều của <code>Product</code>). Kiểm tra chạy trong Node trước khi chèn, nên thông báo lỗi nêu đường dẫn và luật — rất hợp cho câu trả lời 400. Ép kiểu cũng xảy ra: <code>price: "25"</code> thành 25, <code>price: "abc"</code> thành một CastError bên trong ValidationError.',
  ],
  kn: ['mongoose schema', 'validation', 'ref'],
  tns: [tn('schema', 'lược đồ'), tn('model', 'mô hình', 'lớp làm việc với một collection'), tn('ODM', 'Object Data Modeling')],
  dau: J`const mongoose = require('mongoose');
${USER}

const productSchema = new mongoose.Schema({
  name: String,
  price: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId },
});

const Product = mongoose.model('Product', productSchema);
`,
  giai: J`const mongoose = require('mongoose');
${USER}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },                       // 0 is allowed, -1 is not
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },          // ref = the MODEL name
}, { timestamps: true });                                                 // options: 2nd argument

const Product = mongoose.model('Product', productSchema);
`,
  chuanBi: `const err = (p) => p.then(() => 'saved', (e) => ({ name: e.name, paths: Object.keys(e.errors || {}).sort(), message: e.message }));`,
  cases: [
    { goi: `await err(Product.create({}))`, moTa: ['{} → ValidationError on name and price', '{} → ValidationError ở name và price'] },
    { goi: `await err(Product.create({ name: 'Book', price: -1 }))`, moTa: ['price -1 → the min message', 'price -1 → thông báo min'] },
    { goi: `await (async () => { const p = await Product.create({ name: 'Book', price: 0 }); return [p.price, p.createdAt instanceof Date, p.updatedAt instanceof Date]; })()`, moTa: ['price 0 is valid, timestamps are set', 'price 0 hợp lệ, có timestamps'] },
    { goi: `Product.schema.path('author').options.ref`, moTa: ['author references the User model', 'author tham chiếu model User'] },
    { goi: `await err(Product.create({ name: 'Book', price: 'abc' }))`, an: true },
    { goi: `await (async () => { const u = await User.create({ name: 'An', email: 'an@x.com' }); const p = await Product.create({ name: 'Pen', price: '2', author: u._id }); return __json(await Product.findById(p._id).populate('author', 'name')); })()`, an: true, moTa: ['A string price is cast, and the author can be populated', 'Giá dạng chuỗi được ép kiểu, và author populate được'] },
  ],
});

/* ── 2 ── validation rules */
const E2 = bai({
  ten: 'Validation rules: enum, match, minlength, default, lowercase, custom messages', kho: 'MEDIUM', phut: 18, lib: ['mongoose'],
  en: J`<p>MongoDB itself accepts anything (lesson 3.1). Put the rules in the schema instead. Define <code>User</code> with:</p>
<table><thead><tr><th>Field</th><th>Rules</th></tr></thead><tbody>
<tr><td><code>name</code></td><td>String, required, trimmed, 2–50 characters</td></tr>
<tr><td><code>email</code></td><td>String, required, unique, stored <b>lower-case</b> and trimmed, must match <code>/^\S+@\S+\.\S+$/</code> with the message <code>Invalid email</code></td></tr>
<tr><td><code>role</code></td><td>String, one of <code>user</code>, <code>admin</code>; default <code>user</code></td></tr>
<tr><td><code>age</code></td><td>Number, at least 13 with the message <code>You must be at least 13</code> (optional field)</td></tr>
</tbody></table>`,
  vi: J`<p>MongoDB tự nó nhận mọi thứ (bài 3.1). Hãy đặt luật vào schema. Định nghĩa <code>User</code> với:</p>
<table><thead><tr><th>Field</th><th>Luật</th></tr></thead><tbody>
<tr><td><code>name</code></td><td>String, bắt buộc, cắt khoảng trắng, 2–50 ký tự</td></tr>
<tr><td><code>email</code></td><td>String, bắt buộc, duy nhất, lưu <b>chữ thường</b> và cắt khoảng trắng, phải khớp <code>/^\S+@\S+\.\S+$/</code> với thông báo <code>Invalid email</code></td></tr>
<tr><td><code>role</code></td><td>String, một trong <code>user</code>, <code>admin</code>; mặc định <code>user</code></td></tr>
<tr><td><code>age</code></td><td>Number, tối thiểu 13 với thông báo <code>You must be at least 13</code> (field không bắt buộc)</td></tr>
</tbody></table>`,
  yc: [
    ['A custom message: <code>match: [/regex/, \'Invalid email\']</code>, <code>min: [13, \'You must be at least 13\']</code>.', 'Thông báo tự đặt: <code>match: [/regex/, \'Invalid email\']</code>, <code>min: [13, \'You must be at least 13\']</code>.'],
    ['<code>enum: [\'user\', \'admin\']</code> and <code>default: \'user\'</code>.', '<code>enum: [\'user\', \'admin\']</code> và <code>default: \'user\'</code>.'],
    ['<code>lowercase: true, trim: true</code> transform the value before it is validated and saved.', '<code>lowercase: true, trim: true</code> biến đổi giá trị trước khi kiểm tra và lưu.'],
  ],
  viDu: [['await User.create({ name: \' An \', email: \' AN@FPT.EDU.VN \' })', '{ name: "An", email: "an@fpt.edu.vn", role: "user", … }', 'Trimmed, lower-cased, default role.', 'Đã cắt, đã chữ thường, role mặc định.'], ['await User.create({ name: \'A\', email: \'x\', role: \'boss\', age: 10 })', 'ValidationError on name, email, role, age', 'Four rules broken at once.', 'Phạm bốn luật cùng lúc.']],
  goiY: [
    ['<code>email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\\S+@\\S+\\.\\S+$/, \'Invalid email\'] }</code>', '<code>email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\\S+@\\S+\\.\\S+$/, \'Invalid email\'] }</code>'],
    ['<code>unique</code> is not a validator: it creates a unique INDEX, so a duplicate is refused by MongoDB with an E11000 error (not a ValidationError).', '<code>unique</code> không phải validator: nó tạo một INDEX duy nhất, nên bản trùng bị MongoDB từ chối với lỗi E11000 (không phải ValidationError).'],
  ],
  loi: [
    ['<code>min: 2</code> on a String — <code>min</code>/<code>max</code> are for numbers (and dates); string length is <code>minlength</code>/<code>maxlength</code> (Mongoose 8 also accepts <code>minLength</code>).', '<code>min: 2</code> trên String — <code>min</code>/<code>max</code> dành cho số (và ngày); độ dài chuỗi là <code>minlength</code>/<code>maxlength</code> (Mongoose 8 cũng nhận <code>minLength</code>).'],
    ['Expecting <code>unique: true</code> to give a friendly ValidationError — it gives a MongoServerError with <code>code: 11000</code>, which the controller must turn into 409.', 'Mong <code>unique: true</code> cho ValidationError dễ đọc — nó cho MongoServerError với <code>code: 11000</code>, controller phải đổi thành 409.'],
    ['A regex without anchors (<code>/\\S+@\\S+/</code>) accepts <code>"a@b c@d"</code>.', 'Regex không có neo (<code>/\\S+@\\S+/</code>) nhận cả <code>"a@b c@d"</code>.'],
  ],
  gt: [
    'Each option is a rule Mongoose checks on save, in Node, with a precise message per path — <code>err.errors.email.message</code> is "Invalid email" because you wrote it. Transformations (trim, lowercase) run first, so <code>" AN@FPT.EDU.VN "</code> is stored as one canonical email and the unique index really prevents duplicates. Uniqueness itself is enforced by MongoDB, so it surfaces as E11000.',
    'Mỗi tuỳ chọn là một luật Mongoose kiểm khi lưu, trong Node, với thông báo chính xác theo từng đường — <code>err.errors.email.message</code> là "Invalid email" vì bạn viết như vậy. Các biến đổi (trim, lowercase) chạy trước, nên <code>" AN@FPT.EDU.VN "</code> được lưu thành một email chuẩn và index duy nhất thật sự chặn được trùng. Bản thân tính duy nhất do MongoDB thực thi, nên nó lộ ra dưới dạng E11000.',
  ],
  kn: ['validators', 'unique index'],
  tns: [tn('validator', 'bộ kiểm tra'), tn('enum', 'tập giá trị cho phép'), tn('E11000', 'lỗi trùng khoá duy nhất')],
  dau: J`const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  age: Number,
});
const User = mongoose.model('User', userSchema);
`,
  giai: J`const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: {
    type: String, required: true, unique: true,      // unique ⇒ a MongoDB index (E11000 on duplicates)
    lowercase: true, trim: true,                      // transformations run BEFORE validation
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],       // [rule, custom message]
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  age: { type: Number, min: [13, 'You must be at least 13'] },   // optional: only checked when present
});
const User = mongoose.model('User', userSchema);
`,
  chuanBi: `const err = (p) => p.then((d) => ({ saved: __pick(__json(d), 'name email role age') }), (e) => ({ name: e.name, code: e.code || null, errors: Object.fromEntries(Object.entries(e.errors || {}).map(([k, v]) => [k, v.message])) }));`,
  cases: [
    { goi: `await err(User.create({ name: ' An ', email: ' AN@FPT.EDU.VN ' }))`, moTa: ['Trimmed, lower-cased email, default role "user"', 'Đã cắt, email chữ thường, role mặc định "user"'] },
    { goi: `await err(User.create({ name: 'A', email: 'x', role: 'boss', age: 10 }))`, moTa: ['Four broken rules, four messages', 'Bốn luật bị phạm, bốn thông báo'] },
    { goi: `(await User.create({ name: 'An', email: 'an@x.com' }), await err(User.create({ name: 'Bao', email: 'AN@x.com' })))`, moTa: ['Same email with other letter case → E11000 (code 11000)', 'Cùng email khác hoa thường → E11000 (code 11000)'] },
    { goi: `await err(User.create({ name: 'Admin', email: 'root@x.com', role: 'admin', age: 13 }))`, an: true },
    { goi: `await err(User.create({ name: 'x'.repeat(51), email: 'a@b c@d' }))`, an: true },
    { goi: `await err(User.create({ email: 'n@x.com' }))`, an: true },
  ],
});

/* ── 3 ── async CRUD */
const E3 = bai({
  ten: 'Async CRUD with Mongoose: await everything, { new: true, runValidators: true }', kho: 'MEDIUM', phut: 18, lib: ['mongoose'],
  en: J`<p>Write a small service over the <code>Product</code> model (given):</p>
<ul><li><code>createProduct(data)</code> — create and return the document;</li>
<li><code>listProducts(minPrice = 0)</code> — products with <code>price ≥ minPrice</code>, cheapest first;</li>
<li><code>updatePrice(id, price)</code> — set the price and return the <b>updated</b> document, applying the schema rules (a negative price must be refused); <code>null</code> if there is no such product;</li>
<li><code>deleteProduct(id)</code> — return <code>true</code> if a product was deleted, <code>false</code> otherwise.</li></ul>`,
  vi: J`<p>Viết một service nhỏ trên model <code>Product</code> (cho sẵn):</p>
<ul><li><code>createProduct(data)</code> — tạo và trả document;</li>
<li><code>listProducts(minPrice = 0)</code> — sản phẩm có <code>price ≥ minPrice</code>, rẻ nhất trước;</li>
<li><code>updatePrice(id, price)</code> — đặt giá và trả document <b>đã cập nhật</b>, áp luật schema (giá âm phải bị từ chối); <code>null</code> nếu không có sản phẩm đó;</li>
<li><code>deleteProduct(id)</code> — trả <code>true</code> nếu đã xoá một sản phẩm, ngược lại <code>false</code>.</li></ul>`,
  yc: [
    ['Every Mongoose call is asynchronous: make the functions <code>async</code> and <code>await</code> each query.', 'Mọi lời gọi Mongoose là bất đồng bộ: cho các hàm là <code>async</code> và <code>await</code> từng truy vấn.'],
    ['<code>findByIdAndUpdate</code> returns the document <b>before</b> the update unless you pass <code>{ new: true }</code>, and skips validators unless you pass <code>{ runValidators: true }</code>.', '<code>findByIdAndUpdate</code> trả document <b>trước</b> khi cập nhật trừ khi bạn truyền <code>{ new: true }</code>, và bỏ qua validator trừ khi bạn truyền <code>{ runValidators: true }</code>.'],
    ['<code>findByIdAndDelete</code> resolves with the deleted document or <code>null</code>.', '<code>findByIdAndDelete</code> resolve với document đã xoá hoặc <code>null</code>.'],
  ],
  viDu: [['await updatePrice(book._id, 30)', '{ … price: 30 … }', 'The NEW document, thanks to { new: true }.', 'Document MỚI, nhờ { new: true }.'], ['await updatePrice(book._id, -5)', 'rejects ValidationError: "Validation failed: price: … less than minimum allowed value (0)."', 'runValidators made the min rule run on the update.', 'runValidators làm luật min chạy cả khi cập nhật.']],
  goiY: [
    ['<code>return Product.find({ price: { $gte: minPrice } }).sort({ price: 1 });</code> inside an async function (or await it).', '<code>return Product.find({ price: { $gte: minPrice } }).sort({ price: 1 });</code> trong hàm async (hoặc await nó).'],
    ['<code>await Product.findByIdAndUpdate(id, { price }, { new: true, runValidators: true })</code>', '<code>await Product.findByIdAndUpdate(id, { price }, { new: true, runValidators: true })</code>'],
    ['<code>const deleted = await Product.findByIdAndDelete(id); return deleted !== null;</code>', '<code>const deleted = await Product.findByIdAndDelete(id); return deleted !== null;</code>'],
  ],
  loi: [
    ['No <code>{ new: true }</code>: the API answers with the OLD price and the client thinks the update failed.', 'Không có <code>{ new: true }</code>: API trả giá CŨ và client tưởng cập nhật thất bại.'],
    ['No <code>runValidators</code>: <code>price: -5</code> is saved even though the schema says <code>min: 0</code> — validators run on save/create, not on updates by default.', 'Không có <code>runValidators</code>: <code>price: -5</code> vẫn được lưu dù schema ghi <code>min: 0</code> — validator mặc định chạy khi save/create, không chạy khi cập nhật.'],
    ['<code>return !!Product.findByIdAndDelete(id)</code> without await: a Query object is always truthy, so it returns true even for a missing id — and nothing is deleted, because the query never runs.', '<code>return !!Product.findByIdAndDelete(id)</code> không await: đối tượng Query luôn truthy nên trả true cả với id không có — và chẳng xoá gì, vì truy vấn không bao giờ chạy.'],
  ],
  gt: [
    'A Mongoose method returns a Query — a plan that runs when you <code>await</code> it (or call <code>.exec()</code>). The two options of <code>findByIdAndUpdate</code> fix its two surprising defaults: return the new version, and validate the change. Deleting answers with the removed document, so <code>!== null</code> is an honest "was there something to delete?".',
    'Phương thức Mongoose trả một Query — một kế hoạch chỉ chạy khi bạn <code>await</code> nó (hoặc gọi <code>.exec()</code>). Hai tuỳ chọn của <code>findByIdAndUpdate</code> sửa hai mặc định gây bất ngờ: trả bản mới, và kiểm tra thay đổi. Xoá thì trả document đã bị xoá, nên <code>!== null</code> là câu trả lời thật thà cho "có gì để xoá không?".',
  ],
  kn: ['async/await', 'findByIdAndUpdate options'],
  tns: [tn('Query', 'truy vấn (chưa chạy)'), tn('runValidators', 'chạy validator khi cập nhật')],
  dau: J`const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true }));

async function createProduct(data) {
  return Product.create(data);
}
function listProducts(minPrice = 0) {
  return Product.find({ price: { $gte: minPrice } });
}
async function updatePrice(id, price) {
  return Product.findByIdAndUpdate(id, { price });
}
function deleteProduct(id) {
  return !!Product.findByIdAndDelete(id);
}
`,
  giai: J`const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true }));

async function createProduct(data) {
  return await Product.create(data);                      // validation runs here (create = new + save)
}

async function listProducts(minPrice = 0) {
  return await Product.find({ price: { $gte: minPrice } }).sort({ price: 1 });
}

async function updatePrice(id, price) {
  // new: true ⇒ the UPDATED document · runValidators: true ⇒ min: 0 is enforced on updates too
  return await Product.findByIdAndUpdate(id, { price }, { new: true, runValidators: true });
}

async function deleteProduct(id) {
  const deleted = await Product.findByIdAndDelete(id);    // the removed document, or null
  return deleted !== null;
}
`,
  chuanBi: `const book = await Product.create({ name: 'Book', price: 25 }); await Product.create({ name: 'Pen', price: 2 }); await Product.create({ name: 'Lamp', price: 40 }); const names = (list) => list.map((p) => p.name + ':' + p.price);`,
  cases: [
    { goi: `names(await listProducts(5))`, moTa: ['listProducts(5) → cheapest first', 'listProducts(5) → rẻ nhất trước'] },
    { goi: `(await updatePrice(book._id, 30)).price`, moTa: ['updatePrice returns the NEW price', 'updatePrice trả giá MỚI'] },
    { goi: `await updatePrice(book._id, -5).then(() => 'saved', (e) => e.name + ': ' + e.message)`, moTa: ['A negative price is refused (runValidators)', 'Giá âm bị từ chối (runValidators)'] },
    { goi: `[await deleteProduct(book._id), await deleteProduct(book._id), (await listProducts()).length]`, moTa: ['deleteProduct → true, then false', 'deleteProduct → true, rồi false'] },
    { goi: `[await updatePrice(new mongoose.Types.ObjectId(), 9), names(await listProducts())]`, an: true },
    { goi: `(await createProduct({ name: 'Ruler', price: 3 }), names(await listProducts(0)))`, an: true },
    { goi: `await createProduct({ price: 1 }).then(() => 'saved', (e) => e.name)`, an: true },
  ],
});

/* ── 4 ── populate */
const E4 = bai({
  ten: 'Populate — Mongoose\'s answer to JOIN (and select only what you need)', kho: 'MEDIUM', phut: 18, lib: ['mongoose'],
  en: J`<p>Comments reference their user and their post by id. Write <code>getCommentsForPost(postId)</code> that returns the comments of that post, <b>oldest first</b>, with <code>user</code> replaced by the user's <code>{ _id, name }</code> only — never the email or the password hash.</p>
<p>Then write <code>getUserPublic(id)</code>: the user without <code>password</code> (the schema already hides it with <code>select: false</code>) and without <code>email</code>.</p>`,
  vi: J`<p>Bình luận tham chiếu người dùng và bài viết của nó bằng id. Viết <code>getCommentsForPost(postId)</code> trả các bình luận của bài đó, <b>cũ nhất trước</b>, với <code>user</code> được thay bằng <code>{ _id, name }</code> của người dùng — tuyệt đối không email hay mã băm mật khẩu.</p>
<p>Rồi viết <code>getUserPublic(id)</code>: người dùng không có <code>password</code> (schema đã giấu bằng <code>select: false</code>) và không có <code>email</code>.</p>`,
  yc: [
    ['<code>Comment.find({ post: postId }).sort({ createdAt: 1 }).populate(\'user\', \'name\')</code> — the 2nd argument selects the populated fields.', '<code>Comment.find({ post: postId }).sort({ createdAt: 1 }).populate(\'user\', \'name\')</code> — đối số thứ 2 chọn field được populate.'],
    ['<code>User.findById(id).select(\'-email\')</code> excludes a field.', '<code>User.findById(id).select(\'-email\')</code> loại một field.'],
    ['Return the documents (the grader serialises them like <code>res.json</code> would).', 'Trả các document (máy chấm tuần tự hoá như <code>res.json</code>).'],
  ],
  viDu: [['await getCommentsForPost(post._id)', '[{ text: "Great post", user: { _id, name: "An" }, post, … }, …]', 'Each user id became a small user object.', 'Mỗi id người dùng thành một đối tượng người dùng nhỏ.'], ['await getUserPublic(an._id)', '{ _id, name: "An", __v: 0 }', 'No email, no password.', 'Không email, không mật khẩu.']],
  goiY: [
    ['Without the second argument, <code>populate(\'user\')</code> copies EVERY field of the user except the ones with <code>select: false</code> — the email leaks.', 'Không có đối số thứ hai, <code>populate(\'user\')</code> chép MỌI field của người dùng trừ những field <code>select: false</code> — email bị lộ.'],
    ['<code>createdAt</code> exists because the Comment schema has <code>{ timestamps: true }</code>.', '<code>createdAt</code> có vì schema Comment có <code>{ timestamps: true }</code>.'],
  ],
  loi: [
    ['<code>populate(\'users\')</code> — the path is the FIELD name in the Comment schema (<code>user</code>), not the collection name.', '<code>populate(\'users\')</code> — đường là TÊN FIELD trong schema Comment (<code>user</code>), không phải tên collection.'],
    ['Looping and calling <code>User.findById</code> for each comment (N+1 queries) — populate does it in one extra query.', 'Lặp và gọi <code>User.findById</code> cho từng bình luận (N+1 truy vấn) — populate làm bằng một truy vấn phụ.'],
    ['Deleting the email in JavaScript after the query — easy to forget in the next endpoint; select at the query.', 'Xoá email bằng JavaScript sau truy vấn — dễ quên ở endpoint sau; hãy chọn ngay trong truy vấn.'],
  ],
  gt: [
    'MongoDB has no JOIN; populate runs a second query (<code>User.find({ _id: { $in: ids } })</code>) and swaps each id for its document. Its select argument decides exactly which fields cross the wire — the ★ habit of the lesson: performance and security in one argument. <code>select(\'-email\')</code> does the same for the main query.',
    'MongoDB không có JOIN; populate chạy truy vấn thứ hai (<code>User.find({ _id: { $in: ids } })</code>) và đổi mỗi id thành document của nó. Đối số select quyết định chính xác field nào đi qua mạng — thói quen ★ của bài: hiệu năng và bảo mật trong một đối số. <code>select(\'-email\')</code> làm điều tương tự cho truy vấn chính.',
  ],
  kn: ['populate', 'select'],
  tns: [tn('populate', 'điền tham chiếu', 'thay id bằng document'), tn('over-fetching', 'lấy thừa dữ liệu')],
  dau: J`const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = mongoose.model('User', new Schema({ name: String, email: String, password: { type: String, select: false } }));
const Post = mongoose.model('Post', new Schema({ title: String, author: { type: Schema.Types.ObjectId, ref: 'User' } }));
const Comment = mongoose.model('Comment', new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }));

async function getCommentsForPost(postId) {
  return Comment.find({ post: postId }).populate('user');
}
async function getUserPublic(id) {
  return User.findById(id);
}
`,
  giai: J`const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = mongoose.model('User', new Schema({ name: String, email: String, password: { type: String, select: false } }));
const Post = mongoose.model('Post', new Schema({ title: String, author: { type: Schema.Types.ObjectId, ref: 'User' } }));
const Comment = mongoose.model('Comment', new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }));

async function getCommentsForPost(postId) {
  return await Comment.find({ post: postId })
    .sort({ createdAt: 1 })             // oldest first
    .populate('user', 'name');          // replace the id with { _id, name } — nothing else crosses the wire
}

async function getUserPublic(id) {
  return await User.findById(id).select('-email');   // password is already hidden by select: false
}
`,
  chuanBi: `const an = await User.create({ name: 'An', email: 'an@x.com', password: 'hash-an' }); const binh = await User.create({ name: 'Binh', email: 'binh@x.com', password: 'hash-binh' });
const post = await Post.create({ title: 'Hello', author: an._id }); const other = await Post.create({ title: 'Other', author: binh._id });
await Comment.create({ text: 'First!', user: binh._id, post: post._id }); await __sleep(10); await Comment.create({ text: 'Off topic', user: an._id, post: other._id }); await __sleep(10); await Comment.create({ text: 'Thanks', user: an._id, post: post._id });`,
  cases: [
    { goi: `__json(await getCommentsForPost(post._id)).map((c) => ({ text: c.text, user: c.user }))`, moTa: ['Comments of the post, oldest first, user = { _id, name }', 'Bình luận của bài, cũ nhất trước, user = { _id, name }'] },
    { goi: `JSON.stringify(await getCommentsForPost(post._id)).includes('@x.com')`, moTa: ['No email leaks through populate', 'Không email nào lộ qua populate'] },
    { goi: `__json(await getUserPublic(an._id))`, moTa: ['getUserPublic → no email, no password', 'getUserPublic → không email, không mật khẩu'] },
    { goi: `[__json(await getCommentsForPost(other._id)).map((c) => c.user.name), __json(await getCommentsForPost(new mongoose.Types.ObjectId()))]`, an: true },
    { goi: `JSON.stringify(await getCommentsForPost(post._id)).includes('hash-')`, an: true },
  ],
});

/* ── 5 ── query vs data + post page */
const E5 = bai({
  ten: 'A post page: Query ≠ data, two populates and a count', kho: 'HARD', phut: 25, lib: ['mongoose'],
  en: J`<p>The starter of <code>getPostPage(id)</code> has the bug of the lesson's warning: it reads a Mongoose result <b>before awaiting</b> it. Fix it and complete it. It must resolve with</p>
<pre>{ post: { _id, title, author: { _id, name } },
  comments: [{ _id, text, user: { _id, name } }, …],   // oldest first
  count: 2 }</pre>
<p>or <code>null</code> when the post does not exist. A malformed id (<code>"abc"</code>) must also resolve with <code>null</code> instead of throwing a CastError.</p>`,
  vi: J`<p>Code khởi đầu của <code>getPostPage(id)</code> mắc đúng lỗi trong cảnh báo của bài: đọc kết quả Mongoose <b>trước khi await</b>. Sửa và làm cho đủ. Nó phải resolve với</p>
<pre>{ post: { _id, title, author: { _id, name } },
  comments: [{ _id, text, user: { _id, name } }, …],   // cũ nhất trước
  count: 2 }</pre>
<p>hoặc <code>null</code> khi không có bài đó. Id dị dạng (<code>"abc"</code>) cũng phải resolve <code>null</code> thay vì ném CastError.</p>`,
  yc: [
    ['Check the id first with <code>mongoose.isValidObjectId(id)</code>.', 'Kiểm id trước bằng <code>mongoose.isValidObjectId(id)</code>.'],
    ['Select only the fields shown above: <code>.select(\'title author\')</code>, <code>.select(\'text user\')</code>, and populate with <code>\'name\'</code>.', 'Chỉ chọn các field như trên: <code>.select(\'title author\')</code>, <code>.select(\'text user\')</code>, và populate với <code>\'name\'</code>.'],
    ['The post and its comments are independent queries: run them together with <code>Promise.all</code>.', 'Bài viết và bình luận là hai truy vấn độc lập: chạy cùng lúc bằng <code>Promise.all</code>.'],
  ],
  viDu: [['await getPostPage(post._id)', '{"post":{"_id":"…","title":"Hello","author":{"_id":"…","name":"An"}},"comments":[…2 items…],"count":2}', 'count is comments.length — after awaiting.', 'count là comments.length — sau khi await.'], ['await getPostPage(\'abc\')', 'null', 'Not a valid ObjectId: no query at all.', 'Không phải ObjectId hợp lệ: không truy vấn gì.']],
  goiY: [
    ['<code>const comments = Comment.find(…)</code> is a Query; <code>comments.length</code> is <code>undefined</code>. You need <code>await</code>.', '<code>const comments = Comment.find(…)</code> là một Query; <code>comments.length</code> là <code>undefined</code>. Cần <code>await</code>.'],
    ['<code>const [post, comments] = await Promise.all([Post.findById(id).select(…).populate(…), Comment.find({ post: id }).sort(…).select(…).populate(…)]);</code>', '<code>const [post, comments] = await Promise.all([Post.findById(id).select(…).populate(…), Comment.find({ post: id }).sort(…).select(…).populate(…)]);</code>'],
  ],
  loi: [
    ['Reading <code>.length</code> of a Query: <code>count</code> comes out <code>undefined</code> and JSON drops it.', 'Đọc <code>.length</code> của Query: <code>count</code> ra <code>undefined</code> và JSON bỏ mất nó.'],
    ['Letting <code>findById(\'abc\')</code> reject with CastError — the API answers 500 instead of 404.', 'Để <code>findById(\'abc\')</code> reject với CastError — API trả 500 thay vì 404.'],
    ['Awaiting the two queries one after the other: correct but twice as slow on a real database.', 'Await hai truy vấn lần lượt: đúng nhưng chậm gấp đôi trên CSDL thật.'],
  ],
  gt: [
    'A Query is thenable — it has <code>.then()</code> — but it is a plan, not data; awaiting runs it. Validating the id before querying avoids a CastError and maps "malformed" and "missing" to the same 404 later. Two populates, each with a field list, shape exactly the JSON the page needs, and <code>Promise.all</code> overlaps the two round trips.',
    'Query là thenable — nó có <code>.then()</code> — nhưng là kế hoạch, không phải dữ liệu; await mới chạy nó. Kiểm id trước khi truy vấn tránh CastError và sau này quy "dị dạng" lẫn "không có" về cùng một 404. Hai populate, mỗi cái kèm danh sách field, nặn đúng JSON trang cần, còn <code>Promise.all</code> chồng hai lượt khứ hồi lên nhau.',
  ],
  kn: ['Query objects', 'populate', 'isValidObjectId'],
  tns: [tn('thenable', 'đối tượng có .then()'), tn('CastError', 'lỗi ép kiểu')],
  dau: J`const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = mongoose.model('User', new Schema({ name: String, email: String }));
const Post = mongoose.model('Post', new Schema({ title: String, body: String, author: { type: Schema.Types.ObjectId, ref: 'User' } }));
const Comment = mongoose.model('Comment', new Schema({
  text: String, user: { type: Schema.Types.ObjectId, ref: 'User' }, post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }));

async function getPostPage(id) {
  const post = await Post.findById(id).populate('author');
  const comments = Comment.find({ post: id }).populate('user');
  return { post, comments, count: comments.length };
}
`,
  giai: J`const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = mongoose.model('User', new Schema({ name: String, email: String }));
const Post = mongoose.model('Post', new Schema({ title: String, body: String, author: { type: Schema.Types.ObjectId, ref: 'User' } }));
const Comment = mongoose.model('Comment', new Schema({
  text: String, user: { type: Schema.Types.ObjectId, ref: 'User' }, post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }));

async function getPostPage(id) {
  if (!mongoose.isValidObjectId(id)) return null;           // "abc" would be a CastError
  // two independent queries ⇒ run them at the same time; AWAIT turns each Query into data
  const [post, comments] = await Promise.all([
    Post.findById(id).select('title author').populate('author', 'name'),
    Comment.find({ post: id }).sort({ createdAt: 1 }).select('text user').populate('user', 'name'),
  ]);
  if (!post) return null;
  return { post, comments, count: comments.length };        // comments is an ARRAY now
}
`,
  chuanBi: `const an = await User.create({ name: 'An', email: 'an@x.com' }); const binh = await User.create({ name: 'Binh', email: 'binh@x.com' });
const post = await Post.create({ title: 'Hello', body: 'long text', author: an._id });
await Comment.create({ text: 'First!', user: binh._id, post: post._id }); await __sleep(5); await Comment.create({ text: 'Thanks', user: an._id, post: post._id });`,
  cases: [
    { goi: `__json(await getPostPage(post._id))`, moTa: ['The full page: post + author name, 2 comments + user names, count 2', 'Trang đầy đủ: bài + tên tác giả, 2 bình luận + tên người dùng, count 2'] },
    { goi: `await getPostPage('abc')`, moTa: ['A malformed id → null (no CastError)', 'Id dị dạng → null (không CastError)'] },
    { goi: `await getPostPage(new mongoose.Types.ObjectId())`, moTa: ['An unknown id → null', 'Id không có → null'] },
    { goi: `await (async () => { const p2 = await Post.create({ title: 'Empty', author: binh._id }); return __json(await getPostPage(String(p2._id))); })()`, an: true },
    { goi: `JSON.stringify(await getPostPage(post._id)).includes('long text') || JSON.stringify(await getPostPage(post._id)).includes('@x.com')`, an: true },
  ],
});

/* ── 6 ── choice */
const E6 = cs({
  ten: 'Mongoose concepts: ODM, Query objects, populate, select: false', kho: 'EASY', phut: 8,
  en: 'Questions on the ideas of the lesson (behaviour checked against Mongoose 8 + MongoDB 7 on 08/11/2026).',
  vi: 'Câu hỏi về các ý của bài (hành vi đã đối chiếu Mongoose 8 + MongoDB 7 ngày 08/11/2026).',
  cau: [
    q('m1', ['What does Mongoose add on top of the MongoDB driver?', 'Mongoose thêm gì lên trên driver MongoDB?'],
      ['Schemas, validation, casting, middleware hooks and population of references', 'A query language that replaces MongoDB filters', 'Joins executed inside the MongoDB server', 'Automatic SQL tables for each collection'],
      ['Mongoose is an ODM: it gives flexible documents a defined shape, enforced in Node before writes.', 'Mongoose là ODM: nó cho document linh hoạt một hình dạng xác định, thực thi trong Node trước khi ghi.']),
    q('m2', ['<code>const p = Product.find(); console.log(p.length);</code> prints…', '<code>const p = Product.find(); console.log(p.length);</code> in ra…'],
      ['<code>undefined</code> — p is a Query (a plan), not an array', '<code>0</code> — the collection is empty until awaited', 'the number of products', 'a <code>TypeError</code>'],
      ['Awaiting (or <code>.exec()</code>) runs the query and gives the array.', 'Await (hoặc <code>.exec()</code>) mới chạy truy vấn và cho mảng.']),
    q('m3', ['<code>await Product.findById(id).populate(\'author\')</code> — what is in <code>product.author</code> afterwards?', '<code>await Product.findById(id).populate(\'author\')</code> — sau đó <code>product.author</code> chứa gì?'],
      ['The User document it referenced (or <code>null</code> if that user no longer exists)', 'Still the ObjectId, now marked as "populated"', 'An array of every user', 'The string name of the author'],
      ['populate swaps the id for the document; a dangling reference becomes null.', 'populate đổi id thành document; tham chiếu treo thành null.']),
    q('m4', ['A schema says <code>password: { type: String, select: false }</code>. When does a query return it?', 'Schema ghi <code>password: { type: String, select: false }</code>. Khi nào truy vấn trả nó?'],
      ['Only when asked for: <code>.select(\'+password\')</code>', 'Never — a select: false field is not even stored', 'Always — but res.json removes the field later', 'Only when the query ends with <code>.lean()</code>'],
      ['It is stored, just excluded by default — so a forgotten <code>select</code> cannot leak it.', 'Nó vẫn được lưu, chỉ là mặc định bị loại — nên quên <code>select</code> cũng không lộ.']),
    qn('m5', ['Which calls run the schema validators by default? (choose all)', 'Lời gọi nào mặc định chạy validator của schema? (chọn hết)'],
      ['<code>Product.create(data)</code>', '<code>doc.save()</code>', '<code>Product.findByIdAndUpdate(id, data)</code>', '<code>Product.updateOne(filter, data)</code>'],
      [0, 1],
      ['Update queries skip validators unless <code>{ runValidators: true }</code>.', 'Truy vấn cập nhật bỏ qua validator trừ khi có <code>{ runValidators: true }</code>.']),
  ],
  goiY: [['Query = plan.', 'Query = kế hoạch.'], ['Updates have different defaults.', 'Cập nhật có mặc định khác.']],
  loi: [['Thinking updates validate by default.', 'Tưởng cập nhật mặc định có kiểm tra.'], ['Thinking select: false means not stored.', 'Tưởng select: false là không lưu.']],
  tns: [tn('ODM', 'Object Data Modeling'), tn('select: false', 'ẩn mặc định')],
  kn: ['mongoose'],
});

export default doiDau({
  slug: 'sdn302-3-2-mongoose',
  ten: '3.2 Mongoose: schemas, models & population',
  khoa: KHOA,
  baiHoc: 'sdn302-3-2-mongoose',
  de: [E1, E6, E2, E3, E4, E5],
});
