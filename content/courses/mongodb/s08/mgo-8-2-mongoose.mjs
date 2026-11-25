/**
 * 8.2 — Mongoose: schema, kiểm hợp lệ, middleware, lean và populate (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s08-2-mongoose'] (Mongoose 9.13.0 trên driver 7.9.1, MongoDB 8.0.38; kịch bản demo/s08/s08-2-mongoose.txt).
 * Khối: 0 s08-mg-schema.mjs (create/ép kiểu/hook · updateOne lọt validator · strict/strictQuery · unique là index) · 1 s08-mg-doc.mjs (lean, populate, N+1, $lookup).
 * Số tất định: lỗi ma/gia/loai; updateOne ghi gia -5 + loai 'mu'; strictQuery:true đếm 2 thay vì 0; 'throw' ⇒ StrictModeError; 2 find (populate), 2001 find (N+1), 1 aggregate.
 * Số dao động: ms (lean ≈ 2× nhanh hơn tài liệu đầy đủ; N+1 chậm hơn hàng chục lần; $lookup trên 2.000 đơn chậm hơn populate ở lab này).
 * Kiểm trùng: SDN302 3.2 dạy schema/model/populate mức môn ⇒ liên kết, bài này chỉ dạy chỗ Mongoose KHÔNG bảo vệ bạn.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's08-2-mongoose';

const SCHEMA = `// Trích _demo/node/s08-mg-schema.mjs
const spSchema = new mongoose.Schema({
  ma:   { type: String, required: true, unique: true, match: /^SP\\d{3}$/ },
  ten:  { type: String, required: true, trim: true, maxlength: 60 },
  gia:  { type: Number, required: true, min: 0 },
  loai: { type: String, enum: ['ao', 'quan', 'giay'] },
  email: { type: String, lowercase: true },
}, { timestamps: true });                       // tự thêm createdAt / updatedAt
spSchema.pre('save', function () { this.ten = this.ten.toUpperCase(); });   // middleware "trước khi save"
const SP = mongoose.model('SanPham', spSchema, 'sanPham');                   // tham số 3: tên collection ghi rõ`;

const DOC = `// Trích _demo/node/s08-mg-doc.mjs — Don.customerId là String có ref: 'Khach'
await Don.find();                                            // tài liệu Mongoose: getter, setter, theo dõi thay đổi, save()
await Don.find().lean();                                     // object JavaScript thường — chỉ để đọc
await Don.find().populate('customerId', 'name city').lean(); // Mongoose tự gửi truy vấn thứ hai: customers { _id: { $in: [...] } }
for (const d of dons) d.khach = await Khach.findById(d.customerId).lean();  // ✘ N+1
await Don.aggregate([{ $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'khach',
  pipeline: [{ $project: { name: 1, city: 1 } }] } }, { $set: { khach: { $first: '$khach' } } }]);`;

export default {
  title: '8.2 — Mongoose: schemas, validation, middleware, lean and populate|||8.2 — Mongoose: schema, kiểm hợp lệ, middleware, lean và populate',
  slug: 'mgo-8-2-mongoose',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mongoose thêm schema, ép kiểu, kiểm hợp lệ và middleware lên trên driver — nhưng chỉ ở một số đường đi. Đo thật trên Mongoose 9.13: create/save kiểm hợp lệ và chạy hook, còn updateOne ghi được giá âm và loại không có trong enum mà không báo gì; runValidators bật lại kiểm; strict bỏ im lặng trường lạ khi ghi; strictQuery:true biến bộ lọc gõ sai tên trường thành "khớp tất cả" (deleteMany sẽ xoá sạch) — 9.x mặc định false, chế độ "throw" là an toàn nhất; unique là index chứ không phải validator; lean nhanh gần gấp đôi; populate gửi đúng 2 truy vấn, vòng lặp findById gửi 2.001; $lookup không phải lúc nào cũng nhanh hơn populate.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Mongoose: schemas, validation, middleware, lean and populate</h2>
<p class="lead">Mongoose is the most used MongoDB library for Node.js: it puts a <strong>schema</strong> in your application — types, casting, validation, defaults, middleware — on top of the driver from Lesson 8.1. The SDN302 course shows how to declare a schema and call <code>populate()</code>. This lesson is about the part tutorials skip: <em>which paths</em> through Mongoose are protected by that schema, which are not, and what each convenience costs. Everything below ran on Mongoose 9.13 against the lab.</p>
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose: structure over flexible data', sub: 'Schema, model, ref and populate at course level — read it first if Mongoose is new' })}

<h3>An everyday picture: a receptionist with a checklist</h3>
<p>A clinic puts a receptionist at the front door with a checklist: name filled in, date of birth valid, insurance number in the right format. Patients who walk through the front door are checked. But the clinic also has a side door for staff carrying files, and a window where the lab hands over results. Nothing on the checklist is applied there. Mongoose's schema is that receptionist. <code>new Model()</code> + <code>save()</code> and <code>Model.create()</code> go through the front door. Update queries, <code>insertMany</code> options, the raw collection and other services writing to the same database use side doors. MongoDB's own schema validation (Lesson 1.3) is the lock on the building itself — it applies to everybody.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">create() / save()</span><span class="lz-t">full checklist</span><span class="lz-d">cast types, defaults, validators, pre/post('save') middleware, timestamps</span></div>
  <div class="lz-step"><span class="lz-k">updateOne / findOneAndUpdate</span><span class="lz-t">casting only</span><span class="lz-d">validators OFF unless runValidators: true; save middleware does not run (query middleware does)</span></div>
  <div class="lz-step"><span class="lz-k">Model.collection / other services</span><span class="lz-t">no Mongoose at all</span><span class="lz-d">only the server's $jsonSchema validator (Lesson 1.3) can stop bad data here</span></div>
</div>

<h3>The schema we test</h3>
${ma('js', SCHEMA)}
${lenh(K, 0)}

<h3>1. The front door works</h3>
<p><code>create()</code> trimmed and upper-cased the name (the <code>pre('save')</code> hook ran once), cast the string <code>'199000'</code> to the number 199000, added <code>createdAt</code>, and silently dropped <code>mau</code>, a field not in the schema. An invalid product was rejected with one <code>ValidationError</code> listing every broken rule — <code>ma: regexp, gia: min, loai: enum</code> — before anything was sent to the server. That is what people expect from "a schema".</p>

<h3>2. The side door: update queries skip validation</h3>
<p>Then <code>updateOne({ ma: 'SP101' }, { gia: -5, loai: 'mu', ten: 'áo khoác' })</code>: the database now holds a negative price, a category that is not in the enum, and a lower-case name — and the save hook count is still 1. No error, no warning. The Mongoose documentation says it plainly: <em>"Update validators are off by default — you need to specify the runValidators option."</em> With <code>{ runValidators: true }</code> the same update is rejected. And the hook did not run because <code>pre('save')</code> is <em>document</em> middleware; updates trigger <em>query</em> middleware (<code>pre('updateOne')</code>, <code>pre('findOneAndUpdate')</code>), which receives a query, not a document.</p>
${nguon('📘', 'Validation — Mongoose docs', 'Update validators are off by default — you need to specify the runValidators option', 'https://mongoosejs.com/docs/validation.html')}
<div class="pitfall co-tieu-de">
<p><strong>Trap — "we hash the password in pre('save')".</strong> Then an admin endpoint resets a password with <code>findByIdAndUpdate(id, { password })</code> and stores it <em>in plain text</em>. Whatever must always happen — hashing, normalising an email, recomputing a total — must be done on every write path: either write all changes through <code>save()</code>, or add the same logic to query middleware, or (best for invariants) enforce it on the server with <code>$jsonSchema</code> so even a script with the raw driver cannot break it. A common team rule: set <code>mongoose.set('runValidators', true)</code> globally and review every <code>updateOne</code> in code review.</p>
</div>

<h3>3. strict and strictQuery: what happens to names that are not in the schema</h3>
<p>Two different options, often confused:</p>
<ul>
<li><strong>strict</strong> (writes, default <code>true</code>): unknown fields are <em>dropped silently</em>. <code>giamGia: 0.2</code> never reached the database. Safe against clients injecting fields like <code>isAdmin</code> — but a typo in your own code (<code>giamgia</code>) is also dropped without a word. <code>strict: 'throw'</code> turns that into an error.</li>
<li><strong>strictQuery</strong> (filters): what to do with <code>{ loia: 'ao' }</code> — a typo of <code>loai</code>. Mongoose 7+ defaults to <code>false</code>: the filter is sent as written, matches nothing, the count is 0. With <code>strictQuery: true</code> Mongoose <em>removes</em> the unknown path — the filter becomes <code>{}</code> and the count is 2: <strong>everything</strong>. Now imagine that filter in <code>deleteMany</code>. This is exactly why Mongoose 7 changed the default; <code>'throw'</code> is the safest of the three: the measured <code>deleteMany({ loia })</code> failed with <code>StrictModeError</code> and both products survived.</li>
</ul>
${nguon('📘', 'Migrating to Mongoose 7 — strictQuery', 'strictQuery is now false by default', 'https://mongoosejs.com/docs/migrating_to_7.html')}

<h3>🕵️ Hacker corner: filters from the request body</h3>
<p>Because strictQuery is false, a filter built from user input is passed to MongoDB as is: <code>User.findOne({ email: req.body.email, password: req.body.password })</code> with a body of <code>{"email": "admin@x", "password": {"$ne": null}}</code> logs in without a password — Mongoose casts <code>$ne: null</code> happily. That is NoSQL operator injection, attacked and fixed on the lab in Lesson 9.3 (with <code>sanitizeFilter</code> and type checks). The rule for now: never pass <code>req.body</code> or <code>req.query</code> objects straight into a filter; pick the fields and check that they are strings. The lab of this chapter tests exactly that with <code>"sl": {"$gt": 0}</code>.</p>

<h3>4. unique is an index, not a validator</h3>
<p>The duplicate product code failed with <code>MongoServerError code 11000</code>, not a <code>ValidationError</code>: <code>unique: true</code> only asks Mongoose to <em>create a unique index</em> (when the model initialises — Lesson 8.3 shows when that is a problem). If the index does not exist yet, or was dropped, duplicates are stored. Two consequences: handle <code>code === 11000</code> in your error middleware and answer 409 (Lesson 8.3), and never "check first" with <code>findOne</code> before inserting — between the check and the insert another request gets in (Lesson 2.5). The index is the only reliable check.</p>

<h3>5. Reading: documents, lean, populate, N+1 and $lookup</h3>
<p>Five ways to read 2,000 CT Shop orders with their customer's name and city, each run five times (median), counting the commands the driver actually sent:</p>
${ma('js', DOC)}
${lenh(K, 1)}
<ul>
<li><strong>Full Mongoose documents</strong> carry change tracking, getters, setters and methods — useful when you will modify and <code>save()</code>. For read-only API responses that work is wasted.</li>
<li><strong>.lean()</strong> returns plain objects and was about twice as fast for the same single find. Use it for every read-only endpoint. Lean objects have no virtuals, no getters and no <code>save()</code>, and Decimal128 stays a Decimal128 (Lesson 8.1).</li>
<li><strong>populate()</strong> is not a join: Mongoose collected the 200 distinct customer ids and sent <em>one</em> second query <code>{ _id: { $in: [...] } }</code> — 2 finds in total, close to the cost of the plain read.</li>
<li><strong>The N+1 loop</strong> — <code>findById</code> inside <code>for</code> — sent 2,001 finds and was many times slower, and it gets worse linearly with the page size and with network latency (here it is localhost). It often hides inside a helper or a virtual getter. Lesson 8.3 shows how to catch it.</li>
<li><strong>$lookup</strong> did everything in one aggregation — and was <em>slower</em> than populate on this data: the server performed 2,000 index lookups into <code>customers</code> (one per order, Lesson 5.2), while populate looked up 200 distinct customers once. $lookup wins when you need to filter or sort <em>by</em> the joined data, or when the client is far from the server; populate wins for "show the order list with names". Measure; do not assume.</li>
</ul>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-5-2-unwind-lookup', title: 'Lesson 5.2 — $unwind and $lookup', sub: 'NestedLoopJoin vs IndexedLoopJoin vs HashJoin measured on the server side' })}
${lienKet({ cta: 'Open lesson', khoa: 'nodejs', bai: 'nodejs-7-4-quan-he-va-n-plus-1', title: 'Node.js 7.4 — Relations and the N+1 problem', sub: 'The same N+1 with Prisma and PostgreSQL' })}

<h3>💼 At work: "the product list shows prices of −5"</h3>
<p>A bug report on a client project: some products have negative prices and the category "mu" that the frontend cannot render. The schema clearly says <code>min: 0</code> and an enum. You search the code for writes to the products collection and find an admin "quick edit" endpoint using <code>Product.findByIdAndUpdate(id, req.body)</code> — no runValidators, and worse, the whole body as the update (a client could also send <code>$set</code> keys for fields it should not touch). The fix in your PR: whitelist fields, <code>runValidators: true</code>, a server-side <code>$jsonSchema</code> with the same rules so a script cannot repeat the incident, and a data repair query that lists the broken products for the business to correct. Mention in the PR how you found every write path — <code>grep -n "update\\|insertMany\\|collection\\." src/</code> — because the reviewer will ask.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Does a Mongoose schema guarantee the data in MongoDB is valid?"</strong> — No. Only documents written through validated paths; updates skip validators by default, raw driver writes skip Mongoose entirely. Server-side $jsonSchema is the real guarantee.</li>
<li><strong>"Difference between document middleware and query middleware?"</strong> — pre('save') gets the document (this = doc) and runs on save/create; pre('updateOne') etc. get the query and run on update queries.</li>
<li><strong>"What does lean() do and when do you not use it?"</strong> — Returns plain objects without Mongoose document overhead; don't use it when you need save(), virtuals, getters or change tracking.</li>
<li><strong>"How does populate work under the hood?"</strong> — A separate query per populated path with $in over the collected ids, merged in the application; not a server-side join.</li>
<li><strong>"What is strictQuery and why did the default change?"</strong> — Whether unknown filter paths are removed; removal turned typos into match-all filters, so Mongoose 7 made it false; 'throw' is safest.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Add query middleware to the product schema so that <code>updateOne</code> and <code>findOneAndUpdate</code> also upper-case <code>ten</code> when it is being set. Verify with the same update as in the lesson.</li>
<li>Set <code>mongoose.set('runValidators', true)</code> globally and rerun <code>s08-mg-schema.mjs</code>. Which line changes? Then try <code>SP.updateOne({ ma: 'SP101' }, { $unset: { gia: 1 } })</code> — does <code>required</code> stop it?</li>
<li>Add a server-side <code>$jsonSchema</code> to <code>ch8.sanPham</code> (Lesson 1.3) with <code>gia ≥ 0</code> and the enum, then write a negative price through <code>SP.collection.updateOne</code>. What error do you get, and from whom?</li>
<li>Change <code>s08-mg-doc.mjs</code> to read only the 20 newest orders (a typical page). Compare populate, N+1 and $lookup again. Does the ranking change?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>spSchema.pre(['updateOne', 'findOneAndUpdate'], function () { const u = this.getUpdate(); const t = u.$set?.ten ?? u.ten; if (t) this.set('ten', t.toUpperCase()); });</code> — <code>this</code> is the query; read and change the update, not a document.</p>
<p>2. The "updateOne lọt" line now throws <code>ValidationError — gia</code>. <code>$unset</code> of a required field is also caught by update validators (Mongoose treats unset as setting undefined for validation), but only with runValidators on.</p>
<p>3. <code>MongoServerError: Document failed validation</code> (code 121) from the <em>server</em> — Mongoose was bypassed, the database still refused. That is the layer that protects you from every client.</p>
<p>4. Measured on the lab (sorted by createdAt, limit 20): populate ≈ 5 ms with 2 finds, N+1 ≈ 15 ms with 21 finds, $lookup ≈ 4 ms with 1 aggregate — now the fastest, because it only joins 20 orders. On localhost N+1 looks harmless; in production each of the 20 extra finds pays a real network round trip. The lesson: N+1 cost scales with page size × latency — always measure with production-like sizes.</p>
</details>
<p><strong>Done when:</strong> you can list every write path to a collection in your project and say which validations apply to each.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Schema / model', 'Mongoose description of a document shape (types, validators, defaults) and the class used to read and write it.'],
  ['Casting', 'Converting input to the schema type (\'199000\' ⇒ 199000, hex string ⇒ ObjectId); failure ⇒ CastError.'],
  ['Update validators', 'Validation of update queries; off by default, enabled with runValidators: true.'],
  ['Document vs query middleware', 'pre/post hooks on save/validate (this = document) vs on find/updateOne/… (this = query).'],
  ['strict / strictQuery', 'What to do with paths not in the schema — on writes (drop by default) and in filters (keep by default since Mongoose 7; "throw" is safest).'],
  ['lean()', 'Return plain JavaScript objects instead of Mongoose documents; faster, read-only.'],
  ['populate()', 'Fill references by running a second query with $in over the collected ids; not a server-side join.'],
  ['N+1', 'One query for a list plus one query per item; cost grows with list size × network latency.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>create()/save() validate and run save middleware; update queries only cast — validators need runValidators, hooks need query middleware.</li>
<li>Enforce real invariants on the server ($jsonSchema, unique indexes); Mongoose protects only the paths that go through it.</li>
<li>strict drops unknown fields on write; strictQuery true would turn a typo into match-all — keep false or use 'throw'.</li>
<li>unique is an index: handle E11000, never check-then-insert.</li>
<li>Use lean() for read-only endpoints; populate costs one query per path; avoid N+1 loops; measure $lookup vs populate on your data.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Mongoose: schema, kiểm hợp lệ, middleware, lean và populate</h2>
<p class="lead">Mongoose là thư viện MongoDB được dùng nhiều nhất cho Node.js: nó đặt một <strong>schema</strong> vào ứng dụng — kiểu, ép kiểu, kiểm hợp lệ, giá trị mặc định, middleware — lên trên driver của Bài 8.1. Khoá SDN302 chỉ cách khai báo schema và gọi <code>populate()</code>. Bài này nói phần mà bài hướng dẫn hay bỏ qua: <em>những đường đi nào</em> qua Mongoose được schema bảo vệ, đường nào không, và mỗi tiện ích tốn gì. Mọi thứ dưới đây chạy trên Mongoose 9.13 với lab.</p>
${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose: cấu trúc cho dữ liệu linh hoạt', sub: 'Schema, model, ref và populate ở mức môn học — đọc trước nếu bạn mới gặp Mongoose' })}

<h3>Hình ảnh đời thường: lễ tân cầm danh sách kiểm</h3>
<p>Một phòng khám đặt lễ tân ở cửa chính với danh sách kiểm: điền họ tên, ngày sinh hợp lệ, số bảo hiểm đúng định dạng. Bệnh nhân đi cửa chính thì được kiểm. Nhưng phòng khám còn cửa hông cho nhân viên ôm hồ sơ, và một ô cửa sổ nơi phòng xét nghiệm đưa kết quả vào. Danh sách kiểm không áp dụng ở đó. Schema của Mongoose chính là cô lễ tân. <code>new Model()</code> + <code>save()</code> và <code>Model.create()</code> đi cửa chính. Lệnh cập nhật, tuỳ chọn của <code>insertMany</code>, collection thô và các dịch vụ khác cùng ghi vào database thì đi cửa hông. Schema validation của chính MongoDB (Bài 1.3) mới là ổ khoá của toà nhà — áp cho tất cả mọi người.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">create() / save()</span><span class="lz-t">kiểm đủ danh sách</span><span class="lz-d">ép kiểu, mặc định, validator, middleware pre/post('save'), timestamps</span></div>
  <div class="lz-step"><span class="lz-k">updateOne / findOneAndUpdate</span><span class="lz-t">chỉ ép kiểu</span><span class="lz-d">validator TẮT trừ khi runValidators: true; middleware save không chạy (middleware truy vấn thì có)</span></div>
  <div class="lz-step"><span class="lz-k">Model.collection / dịch vụ khác</span><span class="lz-t">không có Mongoose</span><span class="lz-d">chỉ validator $jsonSchema của máy chủ (Bài 1.3) mới chặn được dữ liệu sai ở đây</span></div>
</div>

<h3>Schema dùng để thử</h3>
${ma('js', SCHEMA)}
${lenh(K, 0)}

<h3>1. Cửa chính hoạt động đúng</h3>
<p><code>create()</code> đã cắt khoảng trắng và viết hoa tên (hook <code>pre('save')</code> chạy một lần), ép chuỗi <code>'199000'</code> thành số 199000, thêm <code>createdAt</code>, và lặng lẽ bỏ <code>mau</code> — trường không có trong schema. Một sản phẩm sai bị từ chối bằng một <code>ValidationError</code> liệt kê mọi luật bị phạm — <code>ma: regexp, gia: min, loai: enum</code> — trước khi có gì gửi tới máy chủ. Đó là điều mọi người mong đợi ở "một schema".</p>

<h3>2. Cửa hông: lệnh cập nhật bỏ qua kiểm hợp lệ</h3>
<p>Rồi <code>updateOne({ ma: 'SP101' }, { gia: -5, loai: 'mu', ten: 'áo khoác' })</code>: database giờ chứa giá âm, một loại không có trong enum, và tên chữ thường — còn số lần chạy hook save vẫn là 1. Không lỗi, không cảnh báo. Tài liệu Mongoose nói thẳng: <em>"Update validators are off by default — you need to specify the runValidators option."</em> Có <code>{ runValidators: true }</code> thì cùng lệnh đó bị từ chối. Còn hook không chạy vì <code>pre('save')</code> là middleware <em>tài liệu</em>; lệnh cập nhật kích hoạt middleware <em>truy vấn</em> (<code>pre('updateOne')</code>, <code>pre('findOneAndUpdate')</code>), thứ nhận một truy vấn chứ không nhận tài liệu.</p>
${nguon('📘', 'Validation — Mongoose docs', 'Validator cho lệnh cập nhật mặc định tắt — phải đặt tuỳ chọn runValidators', 'https://mongoosejs.com/docs/validation.html')}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chúng tôi băm mật khẩu trong pre('save')".</strong> Rồi một endpoint quản trị đặt lại mật khẩu bằng <code>findByIdAndUpdate(id, { password })</code> và lưu nó <em>dạng chữ thường</em>. Thứ gì phải luôn xảy ra — băm mật khẩu, chuẩn hoá email, tính lại tổng tiền — phải được làm trên mọi đường ghi: hoặc ghi mọi thay đổi qua <code>save()</code>, hoặc thêm cùng logic vào middleware truy vấn, hoặc (tốt nhất cho bất biến) bắt buộc ở máy chủ bằng <code>$jsonSchema</code> để ngay cả script dùng driver thô cũng không phá được. Một luật nhóm hay dùng: đặt <code>mongoose.set('runValidators', true)</code> cho toàn cục và soát mọi <code>updateOne</code> khi review mã.</p>
</div>

<h3>3. strict và strictQuery: chuyện gì xảy ra với tên không có trong schema</h3>
<p>Hai tuỳ chọn khác nhau, hay bị nhầm:</p>
<ul>
<li><strong>strict</strong> (khi ghi, mặc định <code>true</code>): trường lạ bị <em>bỏ im lặng</em>. <code>giamGia: 0.2</code> không bao giờ tới database. An toàn trước client chèn trường kiểu <code>isAdmin</code> — nhưng lỗi gõ trong chính mã của bạn (<code>giamgia</code>) cũng bị bỏ không một lời. <code>strict: 'throw'</code> biến chuyện đó thành lỗi.</li>
<li><strong>strictQuery</strong> (bộ lọc): làm gì với <code>{ loia: 'ao' }</code> — gõ nhầm <code>loai</code>. Mongoose 7 trở đi mặc định <code>false</code>: bộ lọc gửi đi nguyên văn, không khớp gì, đếm ra 0. Với <code>strictQuery: true</code> Mongoose <em>gỡ</em> đường dẫn lạ — bộ lọc thành <code>{}</code> và đếm ra 2: <strong>tất cả</strong>. Giờ hãy tưởng tượng bộ lọc đó nằm trong <code>deleteMany</code>. Đây chính là lý do Mongoose 7 đổi mặc định; <code>'throw'</code> an toàn nhất trong ba: lệnh <code>deleteMany({ loia })</code> đo được hỏng với <code>StrictModeError</code> và cả hai sản phẩm còn nguyên.</li>
</ul>
${nguon('📘', 'Migrating to Mongoose 7 — strictQuery', 'strictQuery giờ mặc định là false', 'https://mongoosejs.com/docs/migrating_to_7.html')}

<h3>🕵️ Góc hacker: bộ lọc lấy từ body request</h3>
<p>Vì strictQuery là false, bộ lọc dựng từ đầu vào người dùng được chuyển nguyên cho MongoDB: <code>User.findOne({ email: req.body.email, password: req.body.password })</code> với body <code>{"email": "admin@x", "password": {"$ne": null}}</code> đăng nhập được mà không cần mật khẩu — Mongoose ép kiểu <code>$ne: null</code> vui vẻ. Đó là NoSQL injection kiểu chèn toán tử, sẽ bị tấn công rồi vá trên lab ở Bài 9.3 (với <code>sanitizeFilter</code> và kiểm kiểu). Luật lúc này: không bao giờ đưa thẳng object <code>req.body</code> hay <code>req.query</code> vào bộ lọc; nhặt từng trường và kiểm chúng là chuỗi. Lab của chương này kiểm đúng điều đó bằng <code>"sl": {"$gt": 0}</code>.</p>

<h3>4. unique là index, không phải validator</h3>
<p>Mã sản phẩm trùng hỏng với <code>MongoServerError code 11000</code>, không phải <code>ValidationError</code>: <code>unique: true</code> chỉ nhờ Mongoose <em>tạo một index duy nhất</em> (khi model khởi tạo — Bài 8.3 chỉ ra lúc nào điều đó thành vấn đề). Nếu index chưa có, hoặc đã bị xoá, bản trùng vẫn được lưu. Hai hệ quả: bắt <code>code === 11000</code> trong middleware lỗi và trả 409 (Bài 8.3), và đừng bao giờ "kiểm trước" bằng <code>findOne</code> rồi mới chèn — giữa lúc kiểm và lúc chèn một request khác đã chen vào (Bài 2.5). Index là cách kiểm duy nhất đáng tin.</p>

<h3>5. Đọc: tài liệu, lean, populate, N+1 và $lookup</h3>
<p>Năm cách đọc 2.000 đơn CT Shop kèm tên và thành phố của khách, mỗi cách chạy năm lần (lấy trung vị), đếm các lệnh driver thật sự gửi:</p>
${ma('js', DOC)}
${lenh(K, 1)}
<ul>
<li><strong>Tài liệu Mongoose đầy đủ</strong> mang theo việc theo dõi thay đổi, getter, setter và phương thức — có ích khi bạn sẽ sửa rồi <code>save()</code>. Với response API chỉ đọc thì công đó là phí.</li>
<li><strong>.lean()</strong> trả object thường và nhanh khoảng gấp đôi cho cùng một lệnh find. Dùng nó cho mọi endpoint chỉ đọc. Object lean không có virtual, getter hay <code>save()</code>, và Decimal128 vẫn là Decimal128 (Bài 8.1).</li>
<li><strong>populate()</strong> không phải phép nối: Mongoose gom 200 id khách khác nhau rồi gửi <em>một</em> truy vấn thứ hai <code>{ _id: { $in: [...] } }</code> — tổng cộng 2 lệnh find, tốn gần bằng một lần đọc thường.</li>
<li><strong>Vòng N+1</strong> — <code>findById</code> trong <code>for</code> — gửi 2.001 lệnh find và chậm gấp nhiều lần, càng tệ tuyến tính theo cỡ trang và theo độ trễ mạng (ở đây mới là localhost). Nó hay nấp trong một hàm phụ hoặc một virtual getter. Bài 8.3 chỉ cách bắt nó.</li>
<li><strong>$lookup</strong> làm hết trong một aggregation — mà lại <em>chậm hơn</em> populate trên dữ liệu này: máy chủ tra index <code>customers</code> 2.000 lần (mỗi đơn một lần, Bài 5.2), còn populate tra 200 khách khác nhau một lượt. $lookup thắng khi bạn cần lọc hoặc sắp <em>theo</em> dữ liệu được nối, hoặc khi client ở xa máy chủ; populate thắng với "hiện danh sách đơn kèm tên". Đo; đừng đoán.</li>
</ul>
${lienKet({ khoa: 'mongodb', bai: 'mgo-5-2-unwind-lookup', title: 'Bài 5.2 — $unwind và $lookup', sub: 'NestedLoopJoin, IndexedLoopJoin và HashJoin đo ở phía máy chủ' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-7-4-quan-he-va-n-plus-1', title: 'Node.js 7.4 — Quan hệ và bài toán N+1', sub: 'Cùng N+1 với Prisma và PostgreSQL' })}

<h3>💼 Đi làm: "danh sách sản phẩm hiện giá −5"</h3>
<p>Một báo lỗi ở dự án khách hàng: vài sản phẩm có giá âm và loại "mu" mà giao diện không hiển thị được. Schema ghi rõ <code>min: 0</code> và enum. Bạn tìm trong mã mọi chỗ ghi vào collection sản phẩm và thấy một endpoint "sửa nhanh" của quản trị dùng <code>Product.findByIdAndUpdate(id, req.body)</code> — không runValidators, tệ hơn là dùng cả body làm lệnh cập nhật (client còn gửi được khoá <code>$set</code> cho những trường nó không được đụng). Cách sửa trong PR: chỉ nhận các trường cho phép, <code>runValidators: true</code>, một <code>$jsonSchema</code> phía máy chủ cùng luật để không script nào lặp lại sự cố, và một truy vấn sửa dữ liệu liệt kê các sản phẩm hỏng cho bên nghiệp vụ chỉnh. Ghi trong PR cách bạn tìm ra mọi đường ghi — <code>grep -n "update\\|insertMany\\|collection\\." src/</code> — vì người review sẽ hỏi.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Schema Mongoose có bảo đảm dữ liệu trong MongoDB hợp lệ không?"</strong> — Không. Chỉ tài liệu ghi qua đường có kiểm; lệnh cập nhật mặc định bỏ validator, ghi bằng driver thô bỏ qua Mongoose hoàn toàn. $jsonSchema phía máy chủ mới là bảo đảm thật.</li>
<li><strong>"Middleware tài liệu khác middleware truy vấn thế nào?"</strong> — pre('save') nhận tài liệu (this = tài liệu) và chạy khi save/create; pre('updateOne')… nhận truy vấn và chạy với lệnh cập nhật.</li>
<li><strong>"lean() làm gì và khi nào không dùng?"</strong> — Trả object thường không có phần nặng của tài liệu Mongoose; không dùng khi cần save(), virtual, getter hay theo dõi thay đổi.</li>
<li><strong>"populate chạy bên dưới thế nào?"</strong> — Một truy vấn riêng cho mỗi đường populate, dùng $in trên các id đã gom, rồi ghép ở ứng dụng; không phải phép nối phía máy chủ.</li>
<li><strong>"strictQuery là gì và vì sao mặc định bị đổi?"</strong> — Có gỡ đường dẫn lạ khỏi bộ lọc hay không; gỡ đi biến lỗi gõ thành bộ lọc khớp tất cả, nên Mongoose 7 đặt false; 'throw' an toàn nhất.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm middleware truy vấn vào schema sản phẩm để <code>updateOne</code> và <code>findOneAndUpdate</code> cũng viết hoa <code>ten</code> khi trường này được đặt. Kiểm bằng đúng lệnh cập nhật trong bài.</li>
<li>Đặt <code>mongoose.set('runValidators', true)</code> toàn cục rồi chạy lại <code>s08-mg-schema.mjs</code>. Dòng nào đổi? Rồi thử <code>SP.updateOne({ ma: 'SP101' }, { $unset: { gia: 1 } })</code> — <code>required</code> có chặn được không?</li>
<li>Thêm <code>$jsonSchema</code> phía máy chủ cho <code>ch8.sanPham</code> (Bài 1.3) với <code>gia ≥ 0</code> và enum, rồi ghi giá âm qua <code>SP.collection.updateOne</code>. Bạn nhận lỗi gì, từ ai?</li>
<li>Sửa <code>s08-mg-doc.mjs</code> để chỉ đọc 20 đơn mới nhất (một trang điển hình). So lại populate, N+1 và $lookup. Thứ hạng có đổi không?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>spSchema.pre(['updateOne', 'findOneAndUpdate'], function () { const u = this.getUpdate(); const t = u.$set?.ten ?? u.ten; if (t) this.set('ten', t.toUpperCase()); });</code> — <code>this</code> là truy vấn; đọc và sửa lệnh cập nhật, không phải tài liệu.</p>
<p>2. Dòng "updateOne lọt" giờ ném <code>ValidationError — gia</code>. <code>$unset</code> một trường required cũng bị validator cập nhật bắt (Mongoose coi unset như đặt undefined khi kiểm), nhưng chỉ khi bật runValidators.</p>
<p>3. <code>MongoServerError: Document failed validation</code> (mã 121) từ <em>máy chủ</em> — Mongoose bị bỏ qua, database vẫn từ chối. Đó là lớp bảo vệ bạn khỏi mọi client.</p>
<p>4. Đo trên lab (sắp theo createdAt, lấy 20): populate ≈ 5 ms với 2 lệnh find, N+1 ≈ 15 ms với 21 lệnh find, $lookup ≈ 4 ms với 1 aggregate — giờ nhanh nhất, vì chỉ nối 20 đơn. Trên localhost N+1 trông vô hại; ở production mỗi lệnh find thêm trả một lượt đi về mạng thật. Bài học: chi phí N+1 tăng theo cỡ trang × độ trễ — luôn đo với kích thước giống production.</p>
</details>
<p><strong>Xong khi:</strong> bạn liệt kê được mọi đường ghi vào một collection trong dự án và nói được luật kiểm nào áp cho từng đường.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Schema / model', 'Mô tả hình dạng tài liệu của Mongoose (kiểu, validator, mặc định) và lớp dùng để đọc ghi nó.'],
  ['Ép kiểu (casting)', 'Đổi đầu vào sang kiểu của schema (\'199000\' ⇒ 199000, chuỗi hex ⇒ ObjectId); hỏng ⇒ CastError.'],
  ['Update validators', 'Kiểm hợp lệ cho lệnh cập nhật; mặc định tắt, bật bằng runValidators: true.'],
  ['Middleware tài liệu / truy vấn', 'Hook pre/post trên save/validate (this = tài liệu) so với trên find/updateOne/… (this = truy vấn).'],
  ['strict / strictQuery', 'Làm gì với đường dẫn không có trong schema — khi ghi (mặc định bỏ) và trong bộ lọc (mặc định giữ từ Mongoose 7; "throw" an toàn nhất).'],
  ['lean()', 'Trả object JavaScript thường thay vì tài liệu Mongoose; nhanh hơn, chỉ để đọc.'],
  ['populate()', 'Điền tham chiếu bằng một truy vấn thứ hai dùng $in trên các id đã gom; không phải phép nối phía máy chủ.'],
  ['N+1', 'Một truy vấn lấy danh sách cộng một truy vấn cho mỗi phần tử; chi phí tăng theo cỡ danh sách × độ trễ mạng.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>create()/save() kiểm hợp lệ và chạy middleware save; lệnh cập nhật chỉ ép kiểu — validator cần runValidators, hook cần middleware truy vấn.</li>
<li>Bắt buộc bất biến thật ở máy chủ ($jsonSchema, index duy nhất); Mongoose chỉ bảo vệ đường đi qua nó.</li>
<li>strict bỏ trường lạ khi ghi; strictQuery true biến lỗi gõ thành khớp tất cả — giữ false hoặc dùng 'throw'.</li>
<li>unique là index: xử lý E11000, đừng bao giờ kiểm rồi mới chèn.</li>
<li>Dùng lean() cho endpoint chỉ đọc; populate tốn một truy vấn mỗi đường; tránh vòng N+1; đo $lookup so với populate trên dữ liệu của bạn.</li>
</ul>
</div>
`,
};
