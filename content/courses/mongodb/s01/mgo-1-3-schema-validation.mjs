/**
 * 1.3 — Schema linh hoạt không phải không có schema: kiểm bằng $jsonSchema (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s01-3-val'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s01/s01-3-val.txt; schema ở ../_demo/schema-don.js).
 * Kiểm thật: validationAction 'errorAndLog' KHÔNG có ở 8.0 (collMod báo "not a valid value") ⇒ bài chỉ dạy error/warn.
 * Không trùng: SDN302 3.2 dạy validate của Mongoose (phía ứng dụng) — liên kết; Ch8 khoá này nối hai lớp kiểm.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.3 — Flexible schema is not no schema: $jsonSchema validation|||1.3 — Schema linh hoạt không phải không có schema: kiểm bằng $jsonSchema',
  slug: 'mgo-1-3-schema-validation',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bắt chính MongoDB từ chối tài liệu sai: viết $jsonSchema cho đơn hàng CT Shop (bắt buộc, enum, pattern, bsonType, mảng con), đọc thông báo lỗi chi tiết của 8.0, tìm tài liệu bẩn sẵn có bằng $nor, đưa validator vào collection đang chạy theo quy trình warn → dọn → error, validationLevel strict/moderate, bẫy additionalProperties và _id, bypassDocumentValidation; validator không thay được khoá ngoại; tiến hoá schema an toàn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Flexible schema is not no schema: $jsonSchema validation</h2>
<p class="lead">In Lesson 0.1 MongoDB happily accepted an order with <code>stauts</code> instead of <code>status</code>, and the paid-order count quietly went wrong. Every application has a schema — the only question is whether it lives in one place the database enforces, or scattered across every piece of code that writes. In this lesson you make MongoDB itself reject bad documents, and you learn to add that protection to a collection that already holds years of messy data without breaking production.</p>

<h3>An everyday picture: the form at the counter</h3>
<p>At a ward office counter, the clerk checks your form before filing it: required boxes filled, date in the right format, the "marital status" box one of four allowed answers. The clerk does <em>not</em> phone the hospital to check that your birth certificate is real — that is a different kind of check. A MongoDB validator is that clerk: it checks the <strong>shape of each document</strong> as it is written, nothing more. It never looks at other collections.</p>

<h3>Step 1 — the dirty data we start with</h3>
<p>Three orders arrive from three buggy code paths: a customer that does not exist, a typo field with a plain-number total, and a lowercase status with an empty item list, a negative total and a date stored as a string:</p>
${lenh('s01-3-val', 0)}
<p>All accepted — there is no validator yet. Now write down the rules we actually believe about an order:</p>
${lenh('s01-3-val', 1)}
<p>Read it top to bottom: the document is an object; five fields are <strong>required</strong>; <code>customerId</code> is a string matching <code>KH</code> + 4 digits; <code>status</code> is one of four exact values; <code>items</code> is a non-empty array whose elements need <code>productId</code>, a decimal <code>price</code> and an int <code>qty</code> ≥ 1; <code>total</code> is a non-negative decimal; <code>createdAt</code> is a real Date. Keywords you will use most: <code>bsonType</code>, <code>required</code>, <code>properties</code>, <code>enum</code>, <code>pattern</code>, <code>minimum</code>/<code>maximum</code>, <code>minLength</code>/<code>maxLength</code>, <code>items</code>, <code>minItems</code>, <code>additionalProperties</code>, <code>oneOf</code>.</p>

<h3>Step 2 — find the documents that break the rules, before enforcing them</h3>
<p>A <code>$jsonSchema</code> is also a query operator. <code>$nor: [schema]</code> means "documents that do <em>not</em> match":</p>
${lenh('s01-3-val', 2)}
<p>Two offenders out of 2,003: 9002 (typo field, int total) and 9003 (four problems). Notice who is <strong>not</strong> in the list: 9001, the order for customer <code>KH9999</code> who does not exist. <code>KH9999</code> matches the pattern perfectly. A validator checks shape, never existence in another collection — that is still your application's job (or a periodic orphan check, Chapter 5).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Measure</span><span class="lz-t">find({ $nor: [schema] })</span><span class="lz-d">How many existing documents would fail? Fix the schema if it is wrong, not only the data.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Warn</span><span class="lz-t">validationAction: 'warn'</span><span class="lz-d">Writes still succeed, failures are logged — you discover which code paths write bad data, in production, safely.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Clean</span><span class="lz-t">migrate or delete offenders</span><span class="lz-d">Fix the code paths found in the log, then the data.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Enforce</span><span class="lz-t">validationAction: 'error'</span><span class="lz-d">Bad writes now fail with a precise error. Keep the schema in Git next to the code.</span></div>
</div>

<h3>Step 3 — attach the validator in "warn" mode</h3>
${lenh('s01-3-val', 3)}
<p><code>collMod</code> changes the options of an existing collection. Two settings matter:</p>
<ul>
<li><strong><code>validationAction</code></strong>: <code>error</code> (reject the write — the default) or <code>warn</code> (accept it and write a warning to the server log).</li>
<li><strong><code>validationLevel</code></strong>: <code>strict</code> (check every insert and update — default), <code>moderate</code> (check inserts and updates of documents that are <em>already valid</em>; leave existing invalid documents alone so legacy data can still be edited), or <code>off</code>.</li>
</ul>
<p>Now a buggy service writes another order, and the write succeeds — but look at the server log:</p>
${lenh('s01-3-val', 4)}
${lenh('s01-3-val', 5)}
<p>The log line names the document and the exact rule (<code>items</code> violates <code>minItems</code>). Leave "warn" on for a few days in a real system, collect the log lines, and you have the list of code paths to fix. (MongoDB 8.0 has only <code>error</code> and <code>warn</code>; we checked — <code>errorAndLog</code> is rejected as "not a valid value" on 8.0.)</p>

<h3>Step 4 — clean up and enforce</h3>
${lenh('s01-3-val', 6)}
${lenh('s01-3-val', 7)}
<p>Now the exact insert that slipped through in Lesson 0.1:</p>
${lenh('s01-3-val', 8)}
<p>Rejected, and MongoDB 8.0 tells you <em>everything</em> that is wrong in one error: <code>total</code> has <code>consideredType: 'int'</code> where <code>decimal</code> was specified, and <code>status</code> is in <code>missingProperties</code>. Return that <code>errInfo</code> in your API logs and debugging takes seconds. A correct order still goes in, and even an update is checked:</p>
${lenh('s01-3-val', 9)}
${lenh('s01-3-val', 10)}
<p>Order 1 was valid, so under <code>moderate</code> its update is checked — and <code>'Paid'</code> is not in the enum. Meanwhile:</p>
${lenh('s01-3-val', 11)}
${lenh('s01-3-val', 12)}
${lenh('s01-3-val', 13)}
<p>Two lessons in three lines. The orphan 9001 is still there — no validator will ever catch it. And order 9007 with a typo field <code>stats</code> was <strong>accepted</strong>: our schema says what must be present, not what must be absent. A typo of an <em>optional</em> field is invisible unless you forbid unknown fields.</p>

<h3>Forbidding unknown fields: the _id trap</h3>
<p><code>additionalProperties: false</code> rejects any field not listed in <code>properties</code>. Try it on a tiny product collection:</p>
${lenh('s01-3-val', 14)}
${lenh('s01-3-val', 15)}
<p>Rejected because of <code>_id</code> — the driver added it, and it is not listed. Every strict schema must list <code>_id</code> in <code>properties</code> (e.g. <code>_id: { bsonType: 'objectId' }</code>). Strictness has a cost: every new field now needs a schema change before the code can write it. A common middle ground: <code>additionalProperties: false</code> for the core collections where typos cost money (orders, payments), open schemas for flexible ones (product attributes, event payloads).</p>

<h3>The back door: bypassDocumentValidation</h3>
${lenh('s01-3-val', 16)}
<p>A write can skip validation with <code>bypassDocumentValidation: true</code> — useful for a one-time migration of legacy data. That is also why your application's database user must <strong>not</strong> have the <code>bypassDocumentValidation</code> privilege (or <code>dbAdmin</code>): in Chapter 9 you build a least-privilege role where this command fails. Same for <code>collMod</code>: whoever can run it can switch the validator off.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "we validate in Mongoose / in the DTO, so the database doesn't need it".</strong> Application-side validation only protects writes that go through that code. A migration script, a second microservice in Go, an admin fixing data in Compass, an <code>updateMany</code> run by a colleague at 2 a.m. — none of them pass through your Mongoose schema, and Mongoose's <code>updateOne</code> does not even run validators unless <code>runValidators: true</code>. Validate in the app for friendly messages; validate in the database as the last line of defence.</p>
</div>

<h3>Evolving the schema without downtime</h3>
<p>Requirements change: CT Shop adds <code>channel</code> (<code>'web' | 'app' | 'store'</code>) to every order. A safe sequence:</p>
<ol>
<li>Add <code>channel</code> to <code>properties</code> with its <code>enum</code>, but <strong>not</strong> to <code>required</code>. Deploy code that writes it.</li>
<li>Backfill old documents: <code>updateMany({ channel: { $exists: false } }, { $set: { channel: 'web' } })</code> in batches.</li>
<li>Check <code>countDocuments({ channel: { $exists: false } })</code> is 0, then add <code>channel</code> to <code>required</code>.</li>
<li>Keep every version of the schema in Git as a migration file (like <code>_demo/schema-don.js</code>) and apply it in CI — the same discipline as SQL migrations. For larger reshapes, a <code>schemaVersion</code> field lets old and new shapes coexist (schema versioning pattern, Lesson 3.4).</li>
</ol>
${nguon('📘', 'Schema Validation — MongoDB Docs', '$jsonSchema keywords, validation level and action, bypass', 'https://www.mongodb.com/docs/manual/core/schema-validation/')}
${nguon('📘', 'Specify Validation Level for Existing Documents', 'strict vs moderate with examples', 'https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/')}
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose', sub: 'Application-side schemas and validators — the layer above this one' })}

<h3>💼 At work: adding a validator to a three-year-old collection</h3>
<p>Your OJT task: "add validation to <code>orders</code>, we keep getting junk". Do not run <code>collMod … validationAction: 'error'</code> on Friday afternoon — every legacy code path that writes a slightly different shape will start failing in production. Do it the way you just did: measure with <code>$nor</code>, deploy in <code>warn</code>, read the logs for a week, fix writers and data, then switch to <code>error</code> with <code>moderate</code> level so old documents can still be edited. Write this plan in the ticket; reviewers look for exactly this.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"MongoDB is schemaless, so how do you keep data clean?"</strong> — Flexible, not schemaless: <code>$jsonSchema</code> validators enforce required fields, types, enums and patterns in the database; the application validates too.</li>
<li><strong>"strict vs moderate?"</strong> — strict checks every write; moderate skips updates to documents that were already invalid, so legacy data stays editable while new data is protected.</li>
<li><strong>"How would you introduce validation to an existing production collection?"</strong> — Find violators with <code>$nor</code>, deploy with action warn, fix writers and data, then switch to error.</li>
<li><strong>"Can a validator enforce that customerId exists?"</strong> — No. Validators see one document only. Use application checks, transactions, or periodic orphan detection.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Create <code>ch1.customers</code> with a validator: required <code>_id</code> (pattern <code>^KH[0-9]{4}$</code>), <code>name</code> (string, 2–100 chars), <code>email</code> (string matching a simple email pattern), optional <code>phone</code> (pattern <code>^0[0-9]{9}$</code>). Insert one valid and three invalid documents; read each <code>errInfo</code>.</li>
<li>Run your schema as a query against <code>ctshop.customers</code> with <code>$nor</code>. How many of the 200 seed customers would fail? Why?</li>
<li>Make a typo of an optional field (<code>phnoe</code>) fail too. What else must you add to <code>properties</code>?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.createCollection('customers', { validator: { $jsonSchema: { bsonType: 'object', required: ['_id', 'name', 'email'], properties: { _id: { bsonType: 'string', pattern: '^KH[0-9]{4}$' }, name: { bsonType: 'string', minLength: 2, maxLength: 100 }, email: { bsonType: 'string', pattern: '^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$' }, phone: { bsonType: 'string', pattern: '^0[0-9]{9}$' } } } } })</code>. 2. Zero — but only if your schema allows the extra fields <code>city</code> and <code>createdAt</code>; with <code>additionalProperties: false</code> and those fields not listed, all 200 fail. That is exactly why you measure first. 3. <code>additionalProperties: false</code> plus every real field (<code>_id</code>, <code>city</code>, <code>createdAt</code>, …) in <code>properties</code>.</p>
</details>
<p><strong>Done when:</strong> you can explain why 9001 passed the validator and 9007 was accepted.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Validator', 'A query (usually <code>$jsonSchema</code>) every write must satisfy; set on a collection with <code>createCollection</code> or <code>collMod</code>.'],
  ['$jsonSchema', 'JSON Schema draft 4 dialect with <code>bsonType</code> for BSON types.'],
  ['validationAction', '<code>error</code> rejects invalid writes; <code>warn</code> accepts and logs them.'],
  ['validationLevel', '<code>strict</code> checks all writes; <code>moderate</code> skips updates to already-invalid documents; <code>off</code> disables.'],
  ['additionalProperties', '<code>false</code> rejects fields not listed in <code>properties</code> — list <code>_id</code> too.'],
  ['bypassDocumentValidation', 'Write option that skips the validator; needs a privilege your app user should not have.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>A validator is the database checking each document's shape: required fields, types, enums, patterns, ranges, arrays.</li>
<li>MongoDB 8.0 explains every failed rule in <code>errInfo</code> — log it.</li>
<li>Introduce validation safely: <code>$nor</code> to measure, <code>warn</code>, clean, then <code>error</code>; <code>moderate</code> protects new data without blocking legacy edits.</li>
<li>Validators cannot check other collections (9001 passed) and do not catch typos of optional fields unless you forbid unknown fields.</li>
<li>App-side validation is for friendly errors; database validation is the last line of defence.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Schema linh hoạt không phải không có schema: kiểm bằng $jsonSchema</h2>
<p class="lead">Ở Bài 0.1, MongoDB vui vẻ nhận một đơn hàng có <code>stauts</code> thay cho <code>status</code>, và số đơn đã trả tiền lặng lẽ sai. Ứng dụng nào cũng có schema — câu hỏi duy nhất là nó nằm ở một chỗ do cơ sở dữ liệu ép, hay rải rác trong mọi đoạn mã có ghi dữ liệu. Trong bài này bạn bắt chính MongoDB từ chối tài liệu sai, và học cách gắn lớp bảo vệ đó vào một collection đã chứa dữ liệu lộn xộn nhiều năm mà không làm sập hệ thống đang chạy.</p>

<h3>Hình ảnh đời thường: tờ khai ở quầy một cửa</h3>
<p>Ở quầy một cửa của phường, cán bộ kiểm tờ khai của bạn trước khi nhận: ô bắt buộc đã điền, ngày đúng định dạng, ô "tình trạng hôn nhân" là một trong bốn câu trả lời cho phép. Cán bộ <em>không</em> gọi điện cho bệnh viện để xác minh giấy khai sinh có thật không — đó là một kiểu kiểm khác. Validator của MongoDB chính là cán bộ đó: nó kiểm <strong>hình dạng của từng tài liệu</strong> lúc ghi, không hơn. Nó không bao giờ nhìn sang collection khác.</p>

<h3>Bước 1 — dữ liệu bẩn ban đầu</h3>
<p>Ba đơn hàng tới từ ba nhánh mã có lỗi: một khách không tồn tại, một trường gõ sai kèm tổng tiền là số thường, và một trạng thái viết thường kèm danh sách món rỗng, tổng tiền âm và ngày lưu thành chuỗi:</p>
${lenh('s01-3-val', 0)}
<p>Cả ba đều được nhận — chưa có validator nào. Giờ viết ra những luật mà ta thật sự tin về một đơn hàng:</p>
${lenh('s01-3-val', 1)}
<p>Đọc từ trên xuống: tài liệu là object; năm trường <strong>bắt buộc</strong>; <code>customerId</code> là chuỗi khớp <code>KH</code> + 4 chữ số; <code>status</code> là một trong bốn giá trị chính xác; <code>items</code> là mảng không rỗng, mỗi phần tử cần <code>productId</code>, <code>price</code> kiểu decimal và <code>qty</code> kiểu int ≥ 1; <code>total</code> là decimal không âm; <code>createdAt</code> là Date thật. Những từ khoá bạn sẽ dùng nhiều nhất: <code>bsonType</code>, <code>required</code>, <code>properties</code>, <code>enum</code>, <code>pattern</code>, <code>minimum</code>/<code>maximum</code>, <code>minLength</code>/<code>maxLength</code>, <code>items</code>, <code>minItems</code>, <code>additionalProperties</code>, <code>oneOf</code>.</p>

<h3>Bước 2 — tìm tài liệu phạm luật trước khi ép luật</h3>
<p>Một <code>$jsonSchema</code> cũng là một toán tử truy vấn. <code>$nor: [schema]</code> nghĩa là "các tài liệu <em>không</em> khớp":</p>
${lenh('s01-3-val', 2)}
<p>Hai tài liệu phạm luật trên 2.003: 9002 (trường gõ sai, tổng tiền int) và 9003 (bốn lỗi). Để ý ai <strong>không</strong> có trong danh sách: 9001, đơn của khách <code>KH9999</code> không tồn tại. <code>KH9999</code> khớp pattern hoàn hảo. Validator kiểm hình dạng, không bao giờ kiểm sự tồn tại ở collection khác — đó vẫn là việc của ứng dụng (hoặc một lượt dò bản ghi mồ côi định kỳ, Chương 5).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đo</span><span class="lz-t">find({ $nor: [schema] })</span><span class="lz-d">Bao nhiêu tài liệu đang có sẽ trượt? Sai ở schema thì sửa schema, không chỉ sửa dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cảnh báo</span><span class="lz-t">validationAction: 'warn'</span><span class="lz-d">Lệnh ghi vẫn thành công, lỗi được ghi log — bạn tìm ra nhánh mã nào ghi dữ liệu xấu, ngay trên hệ thống thật, một cách an toàn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Dọn</span><span class="lz-t">chuyển đổi hoặc xoá tài liệu phạm luật</span><span class="lz-d">Sửa các nhánh mã tìm thấy trong log, rồi tới dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Ép</span><span class="lz-t">validationAction: 'error'</span><span class="lz-d">Lệnh ghi sai giờ thất bại kèm lỗi rõ ràng. Giữ schema trong Git cạnh mã nguồn.</span></div>
</div>

<h3>Bước 3 — gắn validator ở chế độ "warn"</h3>
${lenh('s01-3-val', 3)}
<p><code>collMod</code> đổi tuỳ chọn của một collection đang có. Hai thiết lập quan trọng:</p>
<ul>
<li><strong><code>validationAction</code></strong>: <code>error</code> (từ chối lệnh ghi — mặc định) hoặc <code>warn</code> (nhận và ghi một cảnh báo vào log máy chủ).</li>
<li><strong><code>validationLevel</code></strong>: <code>strict</code> (kiểm mọi lệnh chèn và sửa — mặc định), <code>moderate</code> (kiểm lệnh chèn và lệnh sửa tài liệu <em>đang hợp lệ</em>; để yên tài liệu cũ đang sai cho dữ liệu cũ vẫn sửa được), hoặc <code>off</code>.</li>
</ul>
<p>Giờ một dịch vụ có lỗi ghi thêm một đơn, và lệnh ghi thành công — nhưng hãy xem log máy chủ:</p>
${lenh('s01-3-val', 4)}
${lenh('s01-3-val', 5)}
<p>Dòng log chỉ đúng tài liệu và đúng luật bị phạm (<code>items</code> vi phạm <code>minItems</code>). Ở hệ thống thật, để "warn" vài ngày, gom các dòng log, và bạn có danh sách nhánh mã cần sửa. (MongoDB 8.0 chỉ có <code>error</code> và <code>warn</code>; ta đã thử — <code>errorAndLog</code> bị 8.0 từ chối là "not a valid value".)</p>

<h3>Bước 4 — dọn rồi ép</h3>
${lenh('s01-3-val', 6)}
${lenh('s01-3-val', 7)}
<p>Giờ đúng lệnh chèn đã lọt qua ở Bài 0.1:</p>
${lenh('s01-3-val', 8)}
<p>Bị từ chối, và MongoDB 8.0 kể <em>mọi</em> chỗ sai trong một lỗi: <code>total</code> có <code>consideredType: 'int'</code> trong khi luật ghi <code>decimal</code>, còn <code>status</code> nằm trong <code>missingProperties</code>. Ghi <code>errInfo</code> đó vào log API và việc gỡ lỗi chỉ mất vài giây. Một đơn đúng vẫn vào được, và cả lệnh sửa cũng bị kiểm:</p>
${lenh('s01-3-val', 9)}
${lenh('s01-3-val', 10)}
<p>Đơn 1 đang hợp lệ, nên dưới <code>moderate</code> lệnh sửa của nó bị kiểm — và <code>'Paid'</code> không có trong enum. Trong khi đó:</p>
${lenh('s01-3-val', 11)}
${lenh('s01-3-val', 12)}
${lenh('s01-3-val', 13)}
<p>Hai bài học trong ba dòng. Đơn mồ côi 9001 vẫn nằm đó — không validator nào bắt được nó. Và đơn 9007 có trường gõ sai <code>stats</code> lại được <strong>nhận</strong>: schema của ta nói cái gì phải có, chứ không nói cái gì không được có. Gõ sai tên một trường <em>không bắt buộc</em> sẽ vô hình, trừ khi bạn cấm trường lạ.</p>

<h3>Cấm trường lạ: bẫy _id</h3>
<p><code>additionalProperties: false</code> từ chối mọi trường không có trong <code>properties</code>. Thử trên một collection sản phẩm tí hon:</p>
${lenh('s01-3-val', 14)}
${lenh('s01-3-val', 15)}
<p>Bị từ chối vì <code>_id</code> — driver tự thêm nó, mà nó không có trong danh sách. Schema chặt nào cũng phải liệt kê <code>_id</code> trong <code>properties</code> (ví dụ <code>_id: { bsonType: 'objectId' }</code>). Chặt cũng có giá: mỗi trường mới giờ cần đổi schema trước khi mã được ghi nó. Cách dung hoà phổ biến: <code>additionalProperties: false</code> cho các collection lõi nơi gõ sai là mất tiền (đơn hàng, thanh toán), schema mở cho các collection linh hoạt (thuộc tính sản phẩm, dữ liệu sự kiện).</p>

<h3>Cửa sau: bypassDocumentValidation</h3>
${lenh('s01-3-val', 16)}
<p>Một lệnh ghi có thể bỏ qua kiểm hợp lệ bằng <code>bypassDocumentValidation: true</code> — có ích cho một lượt chuyển dữ liệu cũ. Cũng vì thế mà tài khoản cơ sở dữ liệu của ứng dụng <strong>không được</strong> có quyền <code>bypassDocumentValidation</code> (hay vai trò <code>dbAdmin</code>): ở Chương 9 bạn dựng một vai trò quyền tối thiểu mà lệnh này thất bại. <code>collMod</code> cũng vậy: ai chạy được nó thì tắt được validator.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "bọn mình kiểm ở Mongoose / ở DTO rồi, database không cần".</strong> Kiểm phía ứng dụng chỉ bảo vệ những lệnh ghi đi qua đúng đoạn mã đó. Một script chuyển dữ liệu, một microservice thứ hai viết bằng Go, một người quản trị sửa dữ liệu bằng Compass, một lệnh <code>updateMany</code> đồng nghiệp chạy lúc 2 giờ sáng — không cái nào đi qua schema Mongoose của bạn, và <code>updateOne</code> của Mongoose thậm chí không chạy validator nếu không có <code>runValidators: true</code>. Kiểm ở ứng dụng để báo lỗi thân thiện; kiểm ở cơ sở dữ liệu làm hàng rào cuối cùng.</p>
</div>

<h3>Tiến hoá schema mà không phải dừng hệ thống</h3>
<p>Yêu cầu thay đổi: CT Shop thêm <code>channel</code> (<code>'web' | 'app' | 'store'</code>) vào mọi đơn. Trình tự an toàn:</p>
<ol>
<li>Thêm <code>channel</code> vào <code>properties</code> kèm <code>enum</code>, nhưng <strong>chưa</strong> đưa vào <code>required</code>. Triển khai mã có ghi trường này.</li>
<li>Bù dữ liệu cũ: <code>updateMany({ channel: { $exists: false } }, { $set: { channel: 'web' } })</code> theo từng lô.</li>
<li>Kiểm <code>countDocuments({ channel: { $exists: false } })</code> bằng 0, rồi mới thêm <code>channel</code> vào <code>required</code>.</li>
<li>Giữ mọi phiên bản schema trong Git thành tệp migration (như <code>_demo/schema-don.js</code>) và áp trong CI — cùng kỷ luật với migration SQL. Với thay đổi hình dạng lớn hơn, một trường <code>schemaVersion</code> cho phép hình dạng cũ và mới cùng tồn tại (schema versioning pattern, Bài 3.4).</li>
</ol>
${nguon('📘', 'Schema Validation — MongoDB Docs', 'Từ khoá $jsonSchema, mức và hành động kiểm, bypass', 'https://www.mongodb.com/docs/manual/core/schema-validation/')}
${nguon('📘', 'Specify Validation Level for Existing Documents', 'strict và moderate kèm ví dụ', 'https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/')}
${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-2-mongoose', title: 'SDN302 3.2 — Mongoose', sub: 'Schema và validator phía ứng dụng — lớp nằm trên lớp của bài này' })}

<h3>💼 Đi làm: gắn validator cho một collection ba năm tuổi</h3>
<p>Việc OJT của bạn: "thêm kiểm hợp lệ cho <code>orders</code>, dữ liệu rác cứ vào hoài". Đừng chạy <code>collMod … validationAction: 'error'</code> vào chiều thứ Sáu — mọi nhánh mã cũ ghi hình dạng hơi khác sẽ bắt đầu lỗi trên hệ thống thật. Làm đúng như bạn vừa làm: đo bằng <code>$nor</code>, triển khai ở <code>warn</code>, đọc log một tuần, sửa nơi ghi và dữ liệu, rồi chuyển sang <code>error</code> với mức <code>moderate</code> để tài liệu cũ vẫn sửa được. Ghi kế hoạch này vào ticket; người review tìm đúng điều này.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"MongoDB không có schema, vậy giữ dữ liệu sạch kiểu gì?"</strong> — Schema linh hoạt chứ không phải không có schema: validator <code>$jsonSchema</code> ép trường bắt buộc, kiểu, enum và pattern ngay trong cơ sở dữ liệu; ứng dụng cũng kiểm.</li>
<li><strong>"strict khác moderate thế nào?"</strong> — strict kiểm mọi lệnh ghi; moderate bỏ qua lệnh sửa tài liệu vốn đã sai, nên dữ liệu cũ vẫn sửa được còn dữ liệu mới được bảo vệ.</li>
<li><strong>"Bạn đưa kiểm hợp lệ vào một collection đang chạy thật thế nào?"</strong> — Tìm tài liệu phạm luật bằng <code>$nor</code>, triển khai với action warn, sửa nơi ghi và dữ liệu, rồi chuyển sang error.</li>
<li><strong>"Validator có ép được customerId phải tồn tại không?"</strong> — Không. Validator chỉ thấy một tài liệu. Dùng kiểm ở ứng dụng, transaction, hoặc dò bản ghi mồ côi định kỳ.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo <code>ch1.customers</code> với validator: bắt buộc <code>_id</code> (pattern <code>^KH[0-9]{4}$</code>), <code>name</code> (chuỗi 2–100 ký tự), <code>email</code> (chuỗi khớp một pattern email đơn giản), <code>phone</code> tuỳ chọn (pattern <code>^0[0-9]{9}$</code>). Chèn một tài liệu đúng và ba tài liệu sai; đọc từng <code>errInfo</code>.</li>
<li>Chạy schema của bạn như một truy vấn trên <code>ctshop.customers</code> bằng <code>$nor</code>. Bao nhiêu trong 200 khách mẫu sẽ trượt? Vì sao?</li>
<li>Làm cho lỗi gõ tên một trường tuỳ chọn (<code>phnoe</code>) cũng bị từ chối. Bạn phải thêm gì vào <code>properties</code>?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>db.createCollection('customers', { validator: { $jsonSchema: { bsonType: 'object', required: ['_id', 'name', 'email'], properties: { _id: { bsonType: 'string', pattern: '^KH[0-9]{4}$' }, name: { bsonType: 'string', minLength: 2, maxLength: 100 }, email: { bsonType: 'string', pattern: '^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$' }, phone: { bsonType: 'string', pattern: '^0[0-9]{9}$' } } } } })</code>. 2. Không khách nào — nhưng chỉ khi schema của bạn để mở các trường thêm <code>city</code> và <code>createdAt</code>; nếu có <code>additionalProperties: false</code> mà không liệt kê hai trường đó, cả 200 đều trượt. Đó chính là lý do phải đo trước. 3. <code>additionalProperties: false</code> cùng mọi trường thật (<code>_id</code>, <code>city</code>, <code>createdAt</code>, …) trong <code>properties</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn giải thích được vì sao 9001 qua được validator và vì sao 9007 được nhận.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Validator', 'Một truy vấn (thường là <code>$jsonSchema</code>) mà mọi lệnh ghi phải thoả; gắn vào collection bằng <code>createCollection</code> hoặc <code>collMod</code>.'],
  ['$jsonSchema', 'Phương ngữ JSON Schema draft 4, thêm <code>bsonType</code> cho kiểu BSON.'],
  ['validationAction', '<code>error</code> từ chối lệnh ghi sai; <code>warn</code> nhận và ghi log.'],
  ['validationLevel', '<code>strict</code> kiểm mọi lệnh ghi; <code>moderate</code> bỏ qua lệnh sửa tài liệu vốn đã sai; <code>off</code> tắt.'],
  ['additionalProperties', '<code>false</code> từ chối trường không liệt kê trong <code>properties</code> — nhớ liệt kê cả <code>_id</code>.'],
  ['bypassDocumentValidation', 'Tuỳ chọn ghi bỏ qua validator; cần một quyền mà tài khoản ứng dụng không nên có.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Validator là cơ sở dữ liệu tự kiểm hình dạng từng tài liệu: trường bắt buộc, kiểu, enum, pattern, khoảng giá trị, mảng.</li>
<li>MongoDB 8.0 giải thích mọi luật bị phạm trong <code>errInfo</code> — hãy ghi log nó.</li>
<li>Đưa kiểm hợp lệ vào an toàn: <code>$nor</code> để đo, <code>warn</code>, dọn, rồi <code>error</code>; <code>moderate</code> bảo vệ dữ liệu mới mà không chặn việc sửa dữ liệu cũ.</li>
<li>Validator không nhìn được collection khác (9001 lọt) và không bắt lỗi gõ tên trường tuỳ chọn trừ khi bạn cấm trường lạ.</li>
<li>Kiểm phía ứng dụng để báo lỗi thân thiện; kiểm ở cơ sở dữ liệu là hàng rào cuối cùng.</li>
</ul>
</div>
`,
};
