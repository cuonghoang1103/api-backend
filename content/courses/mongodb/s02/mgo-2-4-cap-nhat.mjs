/**
 * 2.4 — Cập nhật: toán tử, upsert, arrayFilters và cập nhật bằng pipeline (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-4-upd'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-4-upd.txt; bản sao sản phẩm ở ch2.sp).
 * Demo "mất cập nhật": ../_demo/doc-sua-ghi.js chạy 4 tiến trình song song — số đọc-sửa-ghi THAY ĐỔI mỗi lần chạy (đã thấy 1174, 1121),
 * $inc luôn 2000 ⇒ lời không nêu con số cụ thể của bản đọc-sửa-ghi.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '2.4 — Updating: operators, upsert, arrayFilters and pipeline updates|||2.4 — Cập nhật: toán tử, upsert, arrayFilters và cập nhật bằng pipeline',
  slug: 'mgo-2-4-cap-nhat',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Sửa dữ liệu tại chỗ trên máy chủ thay vì đọc về sửa rồi ghi đè: matchedCount với modifiedCount, bẫy replaceOne xoá sạch các trường, $set $inc $unset $currentDate, $push kèm $each/$sort/$slice giữ 3 đánh giá mới nhất, $addToSet và $pull, toán tử vị trí $, $[] và $[x] với arrayFilters, upsert với $setOnInsert, cập nhật bằng pipeline tính lại tổng đơn, và demo 4 tiến trình song song làm mất hàng trăm lượt cập nhật khi đọc-sửa-ghi so với $inc luôn đúng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Updating: operators, upsert, arrayFilters and pipeline updates</h2>
<p class="lead">The beginner's update is "load the document into the app, change it, save it back". It works on your laptop and loses data in production, because between your read and your write someone else changed the same document. MongoDB's answer is <strong>update operators</strong>: you describe <em>the change</em>, and the server applies it to the current version, atomically, in one step. This lesson covers every operator you will use at work — and ends with four processes racing on one counter so you can watch the beginner's version lose updates.</p>

<h3>An everyday picture: the shared notebook</h3>
<p>The class keeps a shared notebook of who owes money for the class fund. Version A: you copy the page, go home, recalculate, and bring back a fresh page to replace the old one — meanwhile your friend did the same with another change, and whichever page arrives last wins. Version B: you write a line in the notebook itself, "Lan: +20k". Every line is applied to whatever is already there; nothing is lost. Update operators are version B.</p>

<h3>Reading the update result</h3>
<p>We work on a copy of the shirts and books in <code>ch2.sp</code>, so CT Shop stays clean.</p>
${lenh('s02-4-upd', 0)}
${lenh('s02-4-upd', 1)}
${lenh('s02-4-upd', 2)}
<p>Three results, three meanings. <code>matchedCount</code> = how many documents the filter found; <code>modifiedCount</code> = how many actually changed. Setting the same value again: matched 1, modified 0 — MongoDB does not rewrite an unchanged document. Unknown id: matched 0. In an API, <code>matchedCount === 0</code> is your <strong>404</strong>; do not confuse it with "modified 0", which is a perfectly good idempotent update.</p>

<h3>The trap: replacing instead of updating</h3>
${lenh('s02-4-upd', 3)}
${lenh('s02-4-upd', 4)}
${lenh('s02-4-upd', 5)}
<p>mongosh and the modern drivers refuse an <code>updateOne</code> without operators — older drivers and some ORMs did not, and treated the second argument as a <em>replacement</em>. <code>replaceOne</code> does that on purpose: the whole document becomes <code>{ price }</code>. Name, category, stock and variants of SP017 are gone. A PATCH endpoint that does <code>replaceOne({ _id }, req.body)</code> with a body of one field wipes the product. Use <code>$set</code> with exactly the fields you mean to change; use <code>replaceOne</code> only when you hold the complete new version (for example in an import keyed by the source id).</p>

<h3>Field operators</h3>
${lenh('s02-4-upd', 6)}
${lenh('s02-4-upd', 7)}
<p>One update, several operators, all applied atomically to one document: <code>$inc</code> adds (negative to subtract) to the total stock <em>and</em> to the stock of variant 0 (path <code>'variants.0.stock'</code>); <code>$currentDate</code> sets <code>updatedAt</code> to the <strong>server's</strong> clock (better than <code>new Date()</code> from twenty app servers with slightly different clocks); <code>$unset</code> removes a field. Others you will meet: <code>$min</code>/<code>$max</code> (only change if smaller/larger — "lowest price ever seen"), <code>$mul</code>, <code>$rename</code>. You cannot use two operators on the same path in one update (<code>$set</code> and <code>$inc</code> on <code>stock</code> ⇒ conflict error).</p>

<h3>Array operators: add, add-if-absent, remove, keep the latest N</h3>
${lenh('s02-4-upd', 8)}
<p><code>$addToSet</code> twice: the tag appears once. Then <code>$push</code> adds it again regardless — now the array has a duplicate. Use <code>$addToSet</code> for sets (tags, roles, user ids who liked a post), <code>$push</code> for sequences (events, messages).</p>
${lenh('s02-4-upd', 9)}
<p><code>$pull</code> removes <strong>every</strong> element equal to the value (both copies went). It also accepts a condition: <code>{ $pull: { variants: { stock: 0 } } }</code> removes all sold-out variants.</p>
${lenh('s02-4-upd', 10)}
<p>Six reviews pushed one by one with modifiers: <code>$each</code> (a list to push), <code>$sort: { luc: -1 }</code> (newest first) and <code>$slice: 3</code> (keep only the first 3). The array never grows beyond three — the newest reviews of 04, 05 and 06/11. This is the standard way to embed "the latest N" (latest comments on a post, last 5 logins) without hitting the 16 MB limit of Lesson 1.1; the full history lives in its own collection (the subset pattern, Lesson 3.3).</p>

<h3>Updating elements inside arrays: $, $[] and $[x]</h3>
${lenh('s02-4-upd', 11)}
<p><code>'variants.$.stock'</code> — the <strong>positional operator</strong> <code>$</code> stands for "the first element that matched the filter" (<code>'variants.size': 'L'</code>). Size L of SP020 went from 4 to 14. The filter must contain the array condition, otherwise <code>$</code> has nothing to point at.</p>
${lenh('s02-4-upd', 12)}
<p><code>$[]</code> means "every element" — all four variants got <code>dangBan: true</code>.</p>
${lenh('s02-4-upd', 13)}
<p><code>$[v]</code> with <code>arrayFilters</code> means "every element that satisfies the filter on <code>v</code>": across all shirts, every variant with stock under 5 is marked <code>sapHet</code> (SP018 size S, now 0; SP020 size XL, 1). One command, many documents, many elements each — before MongoDB 3.6 this needed a loop in the app. <code>arrayFilters</code> also works on nested arrays (<code>'a.$[i].b.$[j]'</code>).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">'arr.$.f'</span><span class="lz-t">first element matched by the query</span><span class="lz-d">"Increase stock of the L variant." Filter must mention the array.</span></div>
  <div class="lz-step"><span class="lz-k">'arr.$[].f'</span><span class="lz-t">all elements</span><span class="lz-d">"Mark every variant as on sale."</span></div>
  <div class="lz-step"><span class="lz-k">'arr.$[x].f' + arrayFilters</span><span class="lz-t">all elements matching x</span><span class="lz-d">"Flag every variant with stock &lt; 5." The most useful of the three.</span></div>
</div>

<h3>Upsert: update, or insert if missing</h3>
${lenh('s02-4-upd', 14)}
${lenh('s02-4-upd', 15)}
<p>First call: nothing matched, so MongoDB inserted a document built from the filter (<code>_id: 'SP100'</code>), the <code>$set</code> fields and the <code>$setOnInsert</code> fields (<code>upsertedCount: 1</code>). Second call: matched, so only <code>$set</code> applied — <code>createdAt</code> kept its first value, not 2099. <code>$setOnInsert</code> is how you write "create with defaults, otherwise just update" in one atomic command — ideal for sync jobs and "save settings". Upsert on a filter that is <em>not</em> a unique key can race: two simultaneous upserts may both insert. Upsert on <code>_id</code> or on a field with a unique index (the loser gets E11000 and simply retries).</p>

<h3>Updates that compute from the document: pipeline updates</h3>
${lenh('s02-4-upd', 16)}
<p>Since MongoDB 4.2 the second argument can be an <strong>aggregation pipeline</strong> (an array). Stage 1 changes the quantity of SP017 to 3 with <code>$map</code>; stage 2 recalculates <code>total</code> from the new items with <code>$reduce</code> — 199,000 × 3 + 278,400 = 875,400. Classic operators cannot do this: <code>$set</code> cannot read another field of the document. With a pipeline the server computes the new total from the current items, atomically, so the total can never disagree with the items it was computed from. (The expression operators — <code>$map</code>, <code>$reduce</code>, <code>$cond</code> — are taught properly in Chapter 5.)</p>

<h3>Why it matters: four processes, one counter</h3>
<p>The lab file <code>_demo/doc-sua-ghi.js</code> runs a loop 500 times: once the beginner's way (read <code>n</code>, then <code>$set: { n: n + 1 }</code>) and once with <code>$inc</code>. We start <strong>four copies at the same time</strong> — 2,000 increments each way:</p>
${lenh('s02-4-upd', 17)}
<p><code>$inc</code>: exactly 2,000. Read-modify-write: hundreds of increments lost — your number will differ from ours on every run, which is exactly what makes this bug so hard to reproduce. Two processes read <code>n = 41</code>, both write <code>42</code>; one increment vanished. This is the <strong>lost update</strong>. Every view counter, like count, wallet balance or stock level written the beginner's way has it, and it only shows under load — never in your local test.</p>
<p>Three correct tools, in order of preference: (1) an <strong>update operator</strong> (<code>$inc</code>, <code>$push</code>, pipeline update) that needs no read at all; (2) a <strong>conditional update</strong> that includes the expected old state in the filter — "decrease stock only if stock ≥ 2", or optimistic locking with a version field (<code>{ _id, version: 7 }</code> → <code>$set …, $inc: { version: 1 }</code>; <code>matchedCount 0</code> ⇒ someone else won, reload and retry) — Lesson 2.5; (3) a <strong>transaction</strong> when several documents must change together — Chapter 6.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>doc.save()</code> in an ORM is read-modify-write.</strong> Mongoose's <code>findById</code> → change → <code>save()</code> sends only changed paths with <code>$set</code>, which is better than a replacement — but it still writes the <em>value you computed</em> from an old read: <code>doc.views = doc.views + 1; await doc.save()</code> loses updates exactly like the demo. Spring Data's <code>repository.save(entity)</code> replaces the whole document unless you use <code>@Version</code>. For counters and balances, write the update operator yourself (<code>updateOne(…, { $inc })</code>) — Chapter 8 shows both libraries doing it right.</p>
</div>

${nguon('📘', 'Update Operators — MongoDB Docs', 'Field, array and modifier operators', 'https://www.mongodb.com/docs/manual/reference/operator/update/')}
${nguon('📘', 'Filtered positional operator $[identifier]', 'arrayFilters with examples, nested arrays', 'https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/')}
${nguon('📘', 'Updates with Aggregation Pipeline', 'Compute new values from the current document (4.2+)', 'https://www.mongodb.com/docs/manual/tutorial/update-documents-with-aggregation-pipeline/')}

<h3>💼 At work: the PATCH endpoint</h3>
<p>You are asked to implement <code>PATCH /products/:id</code>. The version that passes review: (1) whitelist the fields a client may change (<code>name</code>, <code>price</code>, <code>stock</code>) and validate their types — never spread <code>req.body</code> into <code>$set</code>, or a client can set <code>role</code>, <code>price</code> to a string, or inject operators; (2) build <code>{ $set: {...}, $currentDate: { updatedAt: true } }</code>; (3) <code>updateOne({ _id })</code>; (4) <code>matchedCount === 0</code> ⇒ 404; (5) if the product page has an "edit" form that may be stale, require the <code>version</code> the client loaded and include it in the filter ⇒ 409 Conflict when someone else saved first. Five lines of care that prevent the classic data-loss tickets.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"matchedCount vs modifiedCount?"</strong> — Found by the filter vs actually changed; same value ⇒ matched 1, modified 0.</li>
<li><strong>"How do you safely increment a counter from many servers?"</strong> — <code>$inc</code> — atomic on the server; never read-then-<code>$set</code>.</li>
<li><strong>"$push vs $addToSet?"</strong> — Sequence vs set (no duplicates). <code>$push</code> with <code>$slice</code> keeps a bounded array.</li>
<li><strong>"How do you update one element of an array?"</strong> — <code>$</code> (first matched), <code>$[]</code> (all), <code>$[x]</code> with <code>arrayFilters</code> (matching ones).</li>
<li><strong>"What is $setOnInsert for?"</strong> — Fields written only when an upsert inserts — defaults like <code>createdAt</code>.</li>
<li><strong>"How do you set a field from another field?"</strong> — A pipeline update (array as the second argument).</li>
</ul>

<h3>🧪 Practice (35 minutes)</h3>
<div class="callout ok"><ol>
<li>In <code>ch2.sp</code>, mark every shirt variant whose stock is 0 as <code>hetHang: true</code> and every other variant as <code>hetHang: false</code>, with two update commands.</li>
<li>Add a field <code>tongTonBienThe</code> to every shirt: the sum of its variants' stock — in one command.</li>
<li>Implement optimistic locking for product SP009: add <code>version: 1</code>; write an update that changes the price only if <code>version</code> is still 1 and increments it; run it twice and explain both results.</li>
<li>Modify <code>_demo/doc-sua-ghi.js</code> so the read-modify-write version becomes correct <em>without</em> using <code>$inc</code>. (Hint: make the write conditional on the value you read, and retry.)</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.sp.updateMany({ category: 'shirt' }, { $set: { 'variants.$[a].hetHang': true } }, { arrayFilters: [{ 'a.stock': 0 }] })</code> then the same with <code>'variants.$[b].hetHang': false</code> and <code>arrayFilters: [{ 'b.stock': { $gt: 0 } }]</code>.</p>
<p>2. <code>db.sp.updateMany({ category: 'shirt' }, [{ $set: { tongTonBienThe: { $sum: '$variants.stock' } } }])</code> — in a pipeline, <code>'$variants.stock'</code> is the array of all variant stocks and <code>$sum</code> adds them.</p>
<p>3. <code>db.sp.updateOne({ _id: 'SP009' }, { $set: { version: 1 } })</code>, then <code>db.sp.updateOne({ _id: 'SP009', version: 1 }, { $set: { price: Decimal128('259000') }, $inc: { version: 1 } })</code>. First run: matched 1, modified 1. Second run: matched 0 — the version is now 2; in an API you answer 409 and the client reloads.</p>
<p>4. <code>for (let i = 0; i &lt; 500; ) { const cu = db.dem.findOne({ _id: 'luotXem' }).n; const r = db.dem.updateOne({ _id: 'luotXem', n: cu }, { $set: { n: cu + 1 } }); if (r.modifiedCount === 1) i++ }</code> — compare-and-set: the write only succeeds if nobody changed <code>n</code> since the read; otherwise read again. Correct, but slower under contention than <code>$inc</code>.</p>
</details>
<p><strong>Done when:</strong> your answer to 4 reaches exactly 2,000 with four parallel processes.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Update operator', 'Describes a change applied by the server: <code>$set</code>, <code>$inc</code>, <code>$unset</code>, <code>$push</code>, <code>$pull</code>, <code>$addToSet</code>…'],
  ['matchedCount / modifiedCount', 'Documents found by the filter / documents actually changed.'],
  ['replaceOne', 'Replaces the whole document (except <code>_id</code>) with the given one.'],
  ['$ / $[] / $[x]', 'Positional operators: first matched element / all elements / elements matching <code>arrayFilters</code>.'],
  ['Upsert', 'Update if found, insert otherwise; <code>$setOnInsert</code> fields only on insert.'],
  ['Pipeline update', 'An update whose second argument is an aggregation pipeline — can compute from the current document.'],
  ['Lost update', 'Two read-modify-write cycles overlap and one write overwrites the other\'s change.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Describe the change, let the server apply it: update operators are atomic on a single document.</li>
<li><code>matchedCount 0</code> = not found (404); <code>modifiedCount 0</code> may just mean "already so".</li>
<li><code>replaceOne</code> (and operator-less updates in old drivers) wipe fields — PATCH with <code>$set</code> of whitelisted fields.</li>
<li>Arrays: <code>$addToSet</code>, <code>$pull</code>, <code>$push</code> + <code>$each/$sort/$slice</code>; elements: <code>$</code>, <code>$[]</code>, <code>$[x]</code> + <code>arrayFilters</code>.</li>
<li>Read-modify-write loses updates under concurrency (seen live); use <code>$inc</code>, conditional updates or transactions.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Cập nhật: toán tử, upsert, arrayFilters và cập nhật bằng pipeline</h2>
<p class="lead">Lệnh cập nhật của người mới là "nạp tài liệu vào ứng dụng, sửa, rồi lưu lại". Nó chạy được trên laptop và làm mất dữ liệu trên production, vì giữa lúc bạn đọc và lúc bạn ghi, một người khác đã sửa cùng tài liệu đó. Câu trả lời của MongoDB là <strong>toán tử cập nhật</strong>: bạn mô tả <em>sự thay đổi</em>, máy chủ áp nó lên phiên bản hiện tại, một cách nguyên tử, trong một bước. Bài này đi qua mọi toán tử bạn sẽ dùng khi đi làm — và kết thúc bằng bốn tiến trình tranh nhau một bộ đếm để bạn tận mắt thấy cách làm của người mới đánh mất cập nhật.</p>

<h3>Hình ảnh đời thường: cuốn sổ dùng chung</h3>
<p>Lớp giữ một cuốn sổ chung ghi ai còn nợ quỹ lớp. Cách A: bạn chép trang sổ, mang về nhà, tính lại, rồi mang một trang mới tới thay trang cũ — trong lúc đó bạn của bạn cũng làm y như vậy với một thay đổi khác, và trang nào tới sau cùng thì thắng. Cách B: bạn viết thẳng một dòng vào sổ, "Lan: +20 nghìn". Mỗi dòng được áp lên những gì đã có sẵn; không mất gì cả. Toán tử cập nhật chính là cách B.</p>

<h3>Đọc kết quả cập nhật</h3>
<p>Ta làm trên bản sao áo và sách trong <code>ch2.sp</code>, để CT Shop vẫn sạch.</p>
${lenh('s02-4-upd', 0)}
${lenh('s02-4-upd', 1)}
${lenh('s02-4-upd', 2)}
<p>Ba kết quả, ba ý nghĩa. <code>matchedCount</code> = bộ lọc tìm thấy bao nhiêu tài liệu; <code>modifiedCount</code> = bao nhiêu tài liệu thật sự thay đổi. Đặt lại đúng giá trị cũ: matched 1, modified 0 — MongoDB không ghi lại một tài liệu không đổi. Id không tồn tại: matched 0. Trong API, <code>matchedCount === 0</code> chính là <strong>404</strong>; đừng nhầm nó với "modified 0", vốn là một lệnh cập nhật idempotent hoàn toàn bình thường.</p>

<h3>Bẫy: thay thế thay vì cập nhật</h3>
${lenh('s02-4-upd', 3)}
${lenh('s02-4-upd', 4)}
${lenh('s02-4-upd', 5)}
<p>mongosh và các driver hiện đại từ chối một <code>updateOne</code> không có toán tử — các driver cũ và một số ORM thì không, và coi đối số thứ hai là <em>bản thay thế</em>. <code>replaceOne</code> làm đúng điều đó một cách có chủ đích: cả tài liệu trở thành <code>{ price }</code>. Tên, loại, tồn kho và biến thể của SP017 đã biến mất. Một endpoint PATCH làm <code>replaceOne({ _id }, req.body)</code> với body chỉ có một trường sẽ xoá sạch sản phẩm. Hãy dùng <code>$set</code> với đúng các trường bạn định sửa; chỉ dùng <code>replaceOne</code> khi bạn đang giữ phiên bản mới đầy đủ (ví dụ trong job nhập theo id của nguồn).</p>

<h3>Toán tử trên trường</h3>
${lenh('s02-4-upd', 6)}
${lenh('s02-4-upd', 7)}
<p>Một lệnh cập nhật, nhiều toán tử, tất cả áp nguyên tử lên một tài liệu: <code>$inc</code> cộng thêm (số âm để trừ) vào tổng tồn kho <em>và</em> vào tồn kho của biến thể 0 (đường dẫn <code>'variants.0.stock'</code>); <code>$currentDate</code> đặt <code>updatedAt</code> theo đồng hồ của <strong>máy chủ</strong> (tốt hơn <code>new Date()</code> từ hai mươi máy chủ ứng dụng có đồng hồ lệch nhau chút ít); <code>$unset</code> xoá một trường. Các toán tử khác bạn sẽ gặp: <code>$min</code>/<code>$max</code> (chỉ đổi nếu nhỏ hơn/lớn hơn — "giá thấp nhất từng thấy"), <code>$mul</code>, <code>$rename</code>. Bạn không thể dùng hai toán tử trên cùng một đường dẫn trong một lệnh (<code>$set</code> và <code>$inc</code> trên <code>stock</code> ⇒ lỗi xung đột).</p>

<h3>Toán tử mảng: thêm, thêm nếu chưa có, gỡ, giữ N mục mới nhất</h3>
${lenh('s02-4-upd', 8)}
<p><code>$addToSet</code> hai lần: thẻ chỉ xuất hiện một lần. Rồi <code>$push</code> thêm nó vào bất chấp — giờ mảng có một bản trùng. Dùng <code>$addToSet</code> cho tập hợp (thẻ, vai trò, id người đã thích bài viết), <code>$push</code> cho chuỗi tuần tự (sự kiện, tin nhắn).</p>
${lenh('s02-4-upd', 9)}
<p><code>$pull</code> gỡ <strong>mọi</strong> phần tử bằng giá trị đó (cả hai bản đều mất). Nó cũng nhận điều kiện: <code>{ $pull: { variants: { stock: 0 } } }</code> gỡ mọi biến thể đã hết hàng.</p>
${lenh('s02-4-upd', 10)}
<p>Sáu đánh giá được đẩy vào lần lượt kèm các bổ ngữ: <code>$each</code> (danh sách cần đẩy), <code>$sort: { luc: -1 }</code> (mới nhất trước) và <code>$slice: 3</code> (chỉ giữ 3 phần tử đầu). Mảng không bao giờ dài quá ba — các đánh giá mới nhất ngày 04, 05 và 06/11. Đây là cách chuẩn để nhúng "N mục mới nhất" (bình luận mới nhất của bài viết, 5 lần đăng nhập gần nhất) mà không chạm giới hạn 16 MB ở Bài 1.1; lịch sử đầy đủ nằm ở collection riêng (subset pattern, Bài 3.3).</p>

<h3>Cập nhật phần tử bên trong mảng: $, $[] và $[x]</h3>
${lenh('s02-4-upd', 11)}
<p><code>'variants.$.stock'</code> — <strong>toán tử vị trí</strong> <code>$</code> đại diện cho "phần tử đầu tiên khớp bộ lọc" (<code>'variants.size': 'L'</code>). Cỡ L của SP020 đi từ 4 lên 14. Bộ lọc phải chứa điều kiện trên mảng, nếu không <code>$</code> chẳng có gì để trỏ vào.</p>
${lenh('s02-4-upd', 12)}
<p><code>$[]</code> nghĩa là "mọi phần tử" — cả bốn biến thể đều nhận <code>dangBan: true</code>.</p>
${lenh('s02-4-upd', 13)}
<p><code>$[v]</code> kèm <code>arrayFilters</code> nghĩa là "mọi phần tử thoả bộ lọc trên <code>v</code>": trên mọi áo, mọi biến thể tồn dưới 5 được đánh dấu <code>sapHet</code> (SP018 cỡ S, giờ còn 0; SP020 cỡ XL, còn 1). Một lệnh, nhiều tài liệu, mỗi tài liệu nhiều phần tử — trước MongoDB 3.6 việc này cần một vòng lặp trong ứng dụng. <code>arrayFilters</code> cũng chạy được với mảng lồng (<code>'a.$[i].b.$[j]'</code>).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">'arr.$.f'</span><span class="lz-t">phần tử đầu tiên khớp truy vấn</span><span class="lz-d">"Tăng tồn kho biến thể cỡ L." Bộ lọc phải nhắc tới mảng.</span></div>
  <div class="lz-step"><span class="lz-k">'arr.$[].f'</span><span class="lz-t">mọi phần tử</span><span class="lz-d">"Đánh dấu mọi biến thể đang bán."</span></div>
  <div class="lz-step"><span class="lz-k">'arr.$[x].f' + arrayFilters</span><span class="lz-t">mọi phần tử khớp x</span><span class="lz-d">"Gắn cờ mọi biến thể tồn &lt; 5." Hữu ích nhất trong ba dạng.</span></div>
</div>

<h3>Upsert: cập nhật, hoặc chèn nếu chưa có</h3>
${lenh('s02-4-upd', 14)}
${lenh('s02-4-upd', 15)}
<p>Lần gọi đầu: không khớp gì, nên MongoDB chèn một tài liệu dựng từ bộ lọc (<code>_id: 'SP100'</code>), các trường của <code>$set</code> và các trường của <code>$setOnInsert</code> (<code>upsertedCount: 1</code>). Lần gọi thứ hai: có khớp, nên chỉ <code>$set</code> được áp — <code>createdAt</code> giữ giá trị đầu tiên, không phải năm 2099. <code>$setOnInsert</code> là cách viết "tạo mới kèm giá trị mặc định, nếu đã có thì chỉ cập nhật" trong một lệnh nguyên tử — rất hợp cho job đồng bộ và "lưu cài đặt". Upsert trên một bộ lọc <em>không</em> phải khoá unique có thể bị tranh chấp: hai upsert cùng lúc có thể cùng chèn. Hãy upsert trên <code>_id</code> hoặc trên trường có chỉ mục unique (bên thua nhận E11000 và chỉ việc thử lại).</p>

<h3>Cập nhật tính từ chính tài liệu: cập nhật bằng pipeline</h3>
${lenh('s02-4-upd', 16)}
<p>Từ MongoDB 4.2, đối số thứ hai có thể là một <strong>aggregation pipeline</strong> (một mảng). Bước 1 đổi số lượng SP017 thành 3 bằng <code>$map</code>; bước 2 tính lại <code>total</code> từ các món mới bằng <code>$reduce</code> — 199.000 × 3 + 278.400 = 875.400. Toán tử cổ điển không làm được điều này: <code>$set</code> không đọc được trường khác của tài liệu. Với pipeline, máy chủ tính tổng mới từ các món hiện tại, một cách nguyên tử, nên tổng tiền không bao giờ lệch khỏi chính các món nó được tính từ đó. (Các toán tử biểu thức — <code>$map</code>, <code>$reduce</code>, <code>$cond</code> — được dạy kỹ ở Chương 5.)</p>

<h3>Vì sao quan trọng: bốn tiến trình, một bộ đếm</h3>
<p>Tệp lab <code>_demo/doc-sua-ghi.js</code> chạy một vòng lặp 500 lần: một lần theo cách người mới (đọc <code>n</code>, rồi <code>$set: { n: n + 1 }</code>) và một lần bằng <code>$inc</code>. Ta khởi động <strong>bốn bản cùng lúc</strong> — mỗi cách 2.000 lượt tăng:</p>
${lenh('s02-4-upd', 17)}
<p><code>$inc</code>: đúng 2.000. Đọc-sửa-ghi: mất hàng trăm lượt tăng — con số của bạn sẽ khác của chúng tôi ở mỗi lần chạy, và chính điều đó làm lỗi này rất khó tái hiện. Hai tiến trình cùng đọc <code>n = 41</code>, cùng ghi <code>42</code>; một lượt tăng biến mất. Đây là <strong>lost update</strong> (mất cập nhật). Mọi bộ đếm lượt xem, lượt thích, số dư ví hay tồn kho viết theo cách của người mới đều mắc lỗi này, và nó chỉ lộ ra khi có tải — không bao giờ trong bài test trên máy bạn.</p>
<p>Ba công cụ đúng, theo thứ tự nên dùng: (1) một <strong>toán tử cập nhật</strong> (<code>$inc</code>, <code>$push</code>, cập nhật bằng pipeline) không cần đọc gì cả; (2) một <strong>cập nhật có điều kiện</strong> đưa trạng thái cũ mong đợi vào bộ lọc — "chỉ giảm tồn kho nếu tồn ≥ 2", hoặc khoá lạc quan bằng trường phiên bản (<code>{ _id, version: 7 }</code> → <code>$set …, $inc: { version: 1 }</code>; <code>matchedCount 0</code> ⇒ người khác đã thắng, nạp lại và thử lại) — Bài 2.5; (3) một <strong>transaction</strong> khi nhiều tài liệu phải đổi cùng nhau — Chương 6.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>doc.save()</code> trong ORM là đọc-sửa-ghi.</strong> <code>findById</code> → sửa → <code>save()</code> của Mongoose chỉ gửi các đường dẫn đã đổi bằng <code>$set</code>, tốt hơn thay thế cả tài liệu — nhưng nó vẫn ghi <em>giá trị bạn tính ra</em> từ một lần đọc cũ: <code>doc.views = doc.views + 1; await doc.save()</code> mất cập nhật y như demo. <code>repository.save(entity)</code> của Spring Data thay cả tài liệu, trừ khi bạn dùng <code>@Version</code>. Với bộ đếm và số dư, hãy tự viết toán tử cập nhật (<code>updateOne(…, { $inc })</code>) — Chương 8 cho thấy cả hai thư viện làm đúng việc này.</p>
</div>

${nguon('📘', 'Update Operators — MongoDB Docs', 'Toán tử trên trường, trên mảng và bổ ngữ', 'https://www.mongodb.com/docs/manual/reference/operator/update/')}
${nguon('📘', 'Filtered positional operator $[identifier]', 'arrayFilters có ví dụ, mảng lồng', 'https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/')}
${nguon('📘', 'Updates with Aggregation Pipeline', 'Tính giá trị mới từ tài liệu hiện tại (4.2+)', 'https://www.mongodb.com/docs/manual/tutorial/update-documents-with-aggregation-pipeline/')}

<h3>💼 Đi làm: endpoint PATCH</h3>
<p>Bạn được giao làm <code>PATCH /products/:id</code>. Phiên bản qua được review: (1) liệt kê trắng các trường client được phép sửa (<code>name</code>, <code>price</code>, <code>stock</code>) và kiểm kiểu của chúng — đừng bao giờ rải <code>req.body</code> vào <code>$set</code>, kẻo client đặt được <code>role</code>, đặt <code>price</code> thành chuỗi, hoặc chèn toán tử; (2) dựng <code>{ $set: {...}, $currentDate: { updatedAt: true } }</code>; (3) <code>updateOne({ _id })</code>; (4) <code>matchedCount === 0</code> ⇒ 404; (5) nếu trang sản phẩm có biểu mẫu "sửa" có thể đã cũ, hãy đòi <code>version</code> mà client đã nạp và đưa nó vào bộ lọc ⇒ 409 Conflict khi người khác lưu trước. Năm dòng cẩn thận ngăn được các ticket mất dữ liệu kinh điển.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"matchedCount khác modifiedCount thế nào?"</strong> — Bộ lọc tìm thấy so với thật sự đã đổi; cùng giá trị ⇒ matched 1, modified 0.</li>
<li><strong>"Tăng bộ đếm an toàn từ nhiều máy chủ thế nào?"</strong> — <code>$inc</code> — nguyên tử trên máy chủ; đừng bao giờ đọc rồi <code>$set</code>.</li>
<li><strong>"$push khác $addToSet?"</strong> — Chuỗi tuần tự so với tập hợp (không trùng). <code>$push</code> kèm <code>$slice</code> giữ mảng có giới hạn.</li>
<li><strong>"Cập nhật một phần tử của mảng thế nào?"</strong> — <code>$</code> (phần tử khớp đầu tiên), <code>$[]</code> (tất cả), <code>$[x]</code> kèm <code>arrayFilters</code> (những phần tử khớp).</li>
<li><strong>"$setOnInsert để làm gì?"</strong> — Các trường chỉ được ghi khi upsert chèn mới — giá trị mặc định như <code>createdAt</code>.</li>
<li><strong>"Đặt một trường theo giá trị trường khác thế nào?"</strong> — Cập nhật bằng pipeline (mảng làm đối số thứ hai).</li>
</ul>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>ch2.sp</code>, đánh dấu mọi biến thể áo có tồn bằng 0 là <code>hetHang: true</code> và mọi biến thể khác là <code>hetHang: false</code>, bằng hai lệnh cập nhật.</li>
<li>Thêm trường <code>tongTonBienThe</code> cho mọi áo: tổng tồn kho của các biến thể — trong một lệnh.</li>
<li>Cài khoá lạc quan cho sản phẩm SP009: thêm <code>version: 1</code>; viết một lệnh cập nhật chỉ đổi giá khi <code>version</code> vẫn là 1 và tăng nó lên; chạy hai lần và giải thích cả hai kết quả.</li>
<li>Sửa <code>_demo/doc-sua-ghi.js</code> để bản đọc-sửa-ghi trở nên đúng <em>mà không</em> dùng <code>$inc</code>. (Gợi ý: cho lệnh ghi có điều kiện theo giá trị bạn đã đọc, và thử lại.)</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>db.sp.updateMany({ category: 'shirt' }, { $set: { 'variants.$[a].hetHang': true } }, { arrayFilters: [{ 'a.stock': 0 }] })</code> rồi lệnh tương tự với <code>'variants.$[b].hetHang': false</code> và <code>arrayFilters: [{ 'b.stock': { $gt: 0 } }]</code>.</p>
<p>2. <code>db.sp.updateMany({ category: 'shirt' }, [{ $set: { tongTonBienThe: { $sum: '$variants.stock' } } }])</code> — trong pipeline, <code>'$variants.stock'</code> là mảng tồn kho của mọi biến thể và <code>$sum</code> cộng chúng lại.</p>
<p>3. <code>db.sp.updateOne({ _id: 'SP009' }, { $set: { version: 1 } })</code>, rồi <code>db.sp.updateOne({ _id: 'SP009', version: 1 }, { $set: { price: Decimal128('259000') }, $inc: { version: 1 } })</code>. Lần chạy đầu: matched 1, modified 1. Lần thứ hai: matched 0 — version giờ là 2; trong API bạn trả 409 và client nạp lại.</p>
<p>4. <code>for (let i = 0; i &lt; 500; ) { const cu = db.dem.findOne({ _id: 'luotXem' }).n; const r = db.dem.updateOne({ _id: 'luotXem', n: cu }, { $set: { n: cu + 1 } }); if (r.modifiedCount === 1) i++ }</code> — so-sánh-rồi-đặt (compare-and-set): lệnh ghi chỉ thành công nếu chưa ai đổi <code>n</code> kể từ lúc đọc; nếu không thì đọc lại. Đúng, nhưng khi tranh chấp nhiều thì chậm hơn <code>$inc</code>.</p>
</details>
<p><strong>Xong khi:</strong> lời giải câu 4 của bạn đạt đúng 2.000 với bốn tiến trình song song.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Toán tử cập nhật', 'Mô tả một thay đổi do máy chủ áp: <code>$set</code>, <code>$inc</code>, <code>$unset</code>, <code>$push</code>, <code>$pull</code>, <code>$addToSet</code>…'],
  ['matchedCount / modifiedCount', 'Số tài liệu bộ lọc tìm thấy / số tài liệu thật sự đã đổi.'],
  ['replaceOne', 'Thay cả tài liệu (trừ <code>_id</code>) bằng tài liệu được đưa vào.'],
  ['$ / $[] / $[x]', 'Toán tử vị trí: phần tử khớp đầu tiên / mọi phần tử / các phần tử khớp <code>arrayFilters</code>.'],
  ['Upsert', 'Có thì cập nhật, chưa có thì chèn; trường trong <code>$setOnInsert</code> chỉ ghi khi chèn.'],
  ['Cập nhật bằng pipeline', 'Lệnh cập nhật có đối số thứ hai là aggregation pipeline — tính được từ tài liệu hiện tại.'],
  ['Lost update', 'Hai chu trình đọc-sửa-ghi chồng lên nhau và lệnh ghi này đè mất thay đổi của lệnh kia.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mô tả sự thay đổi, để máy chủ áp: toán tử cập nhật là nguyên tử trên một tài liệu.</li>
<li><code>matchedCount 0</code> = không tìm thấy (404); <code>modifiedCount 0</code> có thể chỉ là "vốn đã như vậy".</li>
<li><code>replaceOne</code> (và lệnh cập nhật không toán tử ở driver cũ) xoá sạch trường — PATCH bằng <code>$set</code> trên các trường đã liệt kê trắng.</li>
<li>Mảng: <code>$addToSet</code>, <code>$pull</code>, <code>$push</code> + <code>$each/$sort/$slice</code>; phần tử: <code>$</code>, <code>$[]</code>, <code>$[x]</code> + <code>arrayFilters</code>.</li>
<li>Đọc-sửa-ghi mất cập nhật khi chạy đồng thời (đã thấy tận mắt); dùng <code>$inc</code>, cập nhật có điều kiện hoặc transaction.</li>
</ul>
</div>
`,
};
