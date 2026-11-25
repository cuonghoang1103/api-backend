/**
 * 4.4 — Multikey, text, wildcard, partial, sparse, TTL, unique, hidden (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-4-dac'] (MongoDB 8.0.38; ch4.don + ctshop.products + database ch4x dọn cuối kịch bản).
 * Số đối chiếu (tất định): items.sp SP042 3982 đơn, 2.000.224 món ⇒ index multikey 12,6 MB vs _id 28,9 MB; CannotIndexParallelArrays;
 * default_language 'vietnamese' bị từ chối; text 'máy tính' [3,1], cụm "máy tính xách" [1], 'lap trinh' (không dấu) [4,1], 'lập -sách' [1];
 * wildcard specs.$** phục vụ specs.ramGB/specs.cpu, không phục vụ author; unique: E11000 khi dựng, null trùng; partial unique cho daXoa:false;
 * partial chỉ dùng khi truy vấn có điều kiện daXoa:false; TTL xoá sau ~60 s (luồng TTL 60 s), chuỗi không phải Date thì không xoá;
 * hidden: 23 → 1.000.000 → 23 tài liệu; collation vi strength 2: không collation COLLSCAN 1, cùng collation IXSCAN 2.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '4.4 — Multikey, text, wildcard, partial, sparse, TTL, unique, hidden|||4.4 — Multikey, text, wildcard, partial, sparse, TTL, unique, hidden',
  slug: 'mgo-4-4-index-dac-biet',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Các loại index ngoài B-tree một trường, mỗi loại một phép thử thật: multikey (2.000.224 khoá cho 1.000.000 đơn, không index được hai mảng song song), text (tiếng Việt không có trong danh sách ngôn ngữ ⇒ "none", tìm không dấu vẫn khớp), wildcard cho thuộc tính đổi theo loại hàng, unique (trường vắng = null bị trùng), partial unique cho xoá mềm, TTL tự xoá phiên đăng nhập sau ~60 giây, hidden để thử "nếu xoá index thì sao" và collation phải khớp mới dùng được index.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Multikey, text, wildcard, partial, sparse, TTL, unique, hidden</h2>
<p class="lead">So far every index was a plain B-tree on scalar fields. Real schemas have arrays, free text, attributes that differ per product, emails that must be unique except for deleted accounts, and sessions that must disappear after an hour. MongoDB has an index option for each of these — and each one has a rule that surprises people the first time. This lesson runs every one of them and shows the surprise.</p>

<h3>An everyday picture: the different indexes of one library</h3>
<p>A library keeps an author catalogue (one card per author — a book with three authors has three cards: <em>multikey</em>), a keyword catalogue (<em>text</em>), a catalogue of only the rare books (<em>partial</em>), a list of reserved books that are put back on the shelf automatically after 24 hours (<em>TTL</em>), a rule that no two members have the same card number (<em>unique</em>), and a catalogue drawer the librarian covers with a cloth for a week to see whether anyone misses it before throwing it out (<em>hidden</em>).</p>

<h3>Multikey: an index on an array field</h3>
<p>Index a field that contains an array and MongoDB creates one key <em>per element</em>. Orders have 1–3 line items; find orders containing product SP042:</p>
${lenh('s04-4-dac', 0)}
${lenh('s04-4-dac', 1)}
<p><code>isMultiKey: true</code>, <code>multiKeyPaths</code> shows the array is <code>items</code>, and the query reads exactly the 3,982 matching orders. One million orders gave 2,000,224 keys — one per line item — yet the index is smaller than <code>_id_</code> because 500 product codes repeat a lot (prefix compression, Lesson 4.1). You never declare an index "multikey": it becomes multikey as soon as one document has an array in that field. Two limits to know:</p>
${lenh('s04-4-dac', 2)}
<p>A compound index may contain at most <strong>one</strong> array field per document: indexing <code>{ tacGia, the }</code> when both are arrays would need every combination (authors × tags) and is refused with <code>CannotIndexParallelArrays</code>. The second limit is that a multikey index cannot <em>cover</em> a query on the array field (Lesson 4.5).</p>
${nguon('📘', 'Multikey Indexes — MongoDB Docs', 'One key per array element, compound limits, bounds', 'https://www.mongodb.com/docs/manual/core/index-multikey/')}

<h3>Text: searching words inside strings</h3>
${lenh('s04-4-dac', 3)}
<p>A text index splits strings into words, can remove stop words and reduce words to their stem — for the languages it knows. Vietnamese is not one of them: <code>default_language: 'vietnamese'</code> is rejected. Use <code>'none'</code>: words are only split on spaces and punctuation, nothing is removed or stemmed.</p>
${lenh('s04-4-dac', 4)}
${lenh('s04-4-dac', 5)}
<ul>
<li><code>'máy tính'</code> is two words joined by OR: any document with "máy" <em>or</em> "tính" (3 and 1).</li>
<li><code>'"máy tính xách"'</code> in double quotes is a phrase: only document 1.</li>
<li><code>'lap trinh'</code> without accents still found "lập trình": text indexes (version 3) are <strong>diacritic-insensitive</strong> — a bonus for Vietnamese users who type without accents. (For general queries you still need a normalised field or collation, Lesson 2.6.)</li>
<li><code>'lập -sách'</code>: the minus excludes a word — "lập" but not "sách" ⇒ only 1.</li>
</ul>
${lenh('s04-4-dac', 6)}
<p><code>$meta: 'textScore'</code> ranks by relevance: the product with all four words first. A collection can have only <strong>one</strong> text index (it may cover several fields). For a real shop search box — typo tolerance, autocomplete, Vietnamese analysers — teams use a search engine (Atlas Search, Elasticsearch/OpenSearch); a text index is good for simple keyword search inside the database.</p>
${nguon('📘', 'Text Indexes — MongoDB Docs', 'Supported languages, "none", phrases, negation, textScore, one per collection', 'https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/')}

<h3>Wildcard: one index for attributes that differ per product</h3>
<p>In CT Shop, laptops have <code>specs.ramGB</code> and <code>specs.cpu</code>, books have <code>author</code>; new attributes appear with each new kind of product (Lesson 3.3's attribute pattern solves this with <code>{ k, v }</code> pairs). A wildcard index indexes every sub-field under a path, whatever its name:</p>
${lenh('s04-4-dac', 7)}
<p><code>specs.$**</code> served both <code>specs.ramGB</code> and <code>specs.cpu</code> without naming them; <code>author</code> is outside <code>specs</code>, so that query was a COLLSCAN. Wildcard indexes are convenient but not free: every sub-field of every document is a key, and they cannot serve a sort on several fields the way a compound index does. Prefer the attribute pattern + a compound index when you control the schema; use wildcard for truly unpredictable fields.</p>
${nguon('📘', 'Wildcard Indexes — MongoDB Docs', 'Index all sub-fields under a path; restrictions', 'https://www.mongodb.com/docs/manual/core/indexes/index-types/index-wildcard/')}

<h3>Unique: two surprises</h3>
${lenh('s04-4-dac', 8)}
${lenh('s04-4-dac', 9)}
<p>First surprise: creating a unique index on a collection that already contains duplicates fails (E11000 with the offending value) — in a real migration you must find and resolve duplicates first (Lesson 5 shows the <code>$group</code> that finds them). Second surprise: a document <em>without</em> the field is indexed as <code>null</code>, so the second customer without email collides with the first: <code>dup key: { email: null }</code>. That is exactly what breaks "email is optional but unique when present".</p>

<h3>Sparse and partial: index only some documents</h3>
<p>A <strong>sparse</strong> index skips documents that do not have the field — fixing the "optional but unique" case. A <strong>partial</strong> index is the general version: it indexes only documents matching a filter expression you choose. The classic use is soft delete (Lesson 2.5): an email must be unique among <em>active</em> accounts, but a deleted account must not block someone re-registering with it.</p>
${lenh('s04-4-dac', 10)}
<p>The deleted <code>a@x.vn</code> (<code>daXoa: true</code>) is not in the index, so an active <code>a@x.vn</code> was accepted; a second active one was refused. The catch:</p>
${lenh('s04-4-dac', 11)}
<p>The planner uses a partial index only when the query <em>implies</em> its filter. "Find a@x.vn" without <code>daXoa: false</code> might need deleted accounts too, which are not in the index, so it was a COLLSCAN. Write the filter condition into every query that should use it (a repository method <code>findActiveByEmail</code> is a good place). MongoDB's docs recommend partial over sparse for new designs: it does the same and more.</p>
${nguon('📘', 'Partial Indexes — MongoDB Docs', 'partialFilterExpression, query coverage, comparison with sparse', 'https://www.mongodb.com/docs/manual/core/index-partial/')}

<h3>TTL: documents that delete themselves</h3>
${lenh('s04-4-dac', 12)}
<p>A TTL index (<code>expireAfterSeconds</code>) on a Date field lets a background thread delete documents whose date + N seconds has passed. With <code>expireAfterSeconds: 0</code> the field itself is the expiry time — natural for sessions and one-time codes. Three facts from the run: the expired session was not deleted immediately but within about a minute, because the TTL thread runs every <strong>60 seconds</strong> (and may lag further under load); the session expiring in an hour stayed; the document whose <code>hetHan</code> is a string was <strong>never</strong> deleted — TTL only acts on BSON Dates (Lesson 1.2's type trap again). So a TTL index is cleanup, not security: an OTP check must still compare <code>hetHan &gt; now</code> in the query.</p>
${nguon('📘', 'TTL Indexes — MongoDB Docs', '60-second background task, Date fields only, expireAfterSeconds', 'https://www.mongodb.com/docs/manual/core/index-ttl/')}

<h3>Hidden: test a drop without dropping</h3>
${lenh('s04-4-dac', 13)}
<p>A hidden index is invisible to the planner but still maintained on every write. Hiding <code>khach_1</code> turned the 23-document query into a 1,000,000-document COLLSCAN; unhiding brought it back immediately — no rebuild, which on a big collection would take minutes or hours. That is the safe procedure for removing an index you believe unused: hide it, watch latency and the slow query log for a few days, then drop it (or unhide in seconds if something breaks). Hiding clears the plan cache for the collection (Lesson 4.2).</p>
${nguon('📘', 'Hidden Indexes — MongoDB Docs', 'hideIndex / unhideIndex, still maintained, evaluate before dropping', 'https://www.mongodb.com/docs/manual/core/index-hidden/')}

<h3>Collation must match</h3>
${lenh('s04-4-dac', 14)}
<p>An index created with a Vietnamese collation (strength 2: ignore case, keep accents) stores keys compared by that collation. A query without the same collation compares strings binary-wise, so it cannot use the index: COLLSCAN, 1 match ("đỗ an" exactly). With the same collation: IXSCAN, 2 matches ("Đỗ An" and "đỗ an"; "Do An" differs by accents). If your API uses collation for search (Lesson 2.6), create the index with the identical collation, or set it as the collection default.</p>

<h3>Also in the toolbox (not measured here)</h3>
<ul>
<li><strong>2dsphere</strong> — geospatial queries (<code>$near</code>, <code>$geoWithin</code>) on GeoJSON points: "shops within 5 km".</li>
<li><strong>hashed</strong> — indexes a hash of the value; used as a shard key to spread writes evenly (Chapter 7).</li>
<li><strong>Clustered collections</strong> and <strong>time series</strong> collections store documents ordered by a key or by time (Chapter 10).</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "unique email" that blocks users forever.</strong> A team adds <code>{ email: 1 }, { unique: true }</code> and soft-deletes accounts with <code>daXoa: true</code>. A customer deletes their account and later cannot sign up again: "email already exists". Or registration without email is allowed, and the second such user gets a 500 error from <code>dup key: { email: null }</code>. Both are fixed by the same partial index — and both are found in testing only if you test deleted and missing values.</p>
</div>

<h3>💼 At work: TTL for data retention</h3>
<p>Personal-data rules (Vietnam's Decree 13/2023 on personal data protection, GDPR for EU customers) and plain cost push teams to keep logs, sessions, verification codes and tracking events only as long as needed. A TTL index is the simplest retention mechanism: <code>createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 })</code> keeps 90 days. Write the retention period in the design document, and remember that deleting millions of expired documents is real write load — on a large collection, add the TTL index outside peak hours and watch the first deletions.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is a multikey index? Any limits?"</strong> — One key per array element; at most one array field per document in a compound index; cannot cover queries on the array.</li>
<li><strong>"How do you make an optional field unique?"</strong> — A partial unique index (e.g. <code>{ email: { $exists: true } }</code> or <code>{ daXoa: false }</code>), not a plain unique index, because missing values count as null.</li>
<li><strong>"How exact is TTL deletion?"</strong> — Not exact: a background task every 60 seconds; only Date fields; never rely on it for security.</li>
<li><strong>"How would you safely remove an index?"</strong> — Check <code>$indexStats</code>, hide it, watch, then drop.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>In a collection <code>otp</code>, store one-time codes that expire 5 minutes after creation. Write the index, the insert and the <em>verify</em> query, so that an expired code is refused even if the TTL thread has not deleted it yet.</li>
<li>Customers may have no phone number, but phone numbers that exist must be unique. Create the index and prove both rules with two inserts each.</li>
<li>Explain <code>db.don.find({ 'items.sp': 'SP042' }, { _id: 0, 'items.sp': 1 })</code> with the multikey index. Is it covered? Why?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.otp.createIndex({ hetHan: 1 }, { expireAfterSeconds: 0 })</code>; insert <code>{ sdt, ma, hetHan: new Date(Date.now() + 5 * 60e3) }</code>; verify with <code>db.otp.findOneAndDelete({ sdt, ma, hetHan: { $gt: new Date() } })</code> — the date condition refuses an expired code, and the delete makes the code single-use.</p>
<p>2. <code>db.kh.createIndex({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true } } })</code>. Two customers without phone: both accepted. Two with the same phone: the second gets E11000. (A <code>sparse: true, unique: true</code> index also works for this exact case.)</p>
<p>3. No: the plan has a FETCH. A multikey index stores one element per key and cannot rebuild the array, so MongoDB must read the document to return <code>items</code>. Covered queries need non-array fields (Lesson 4.5).</p>
</details>
<p><strong>Done when:</strong> for each special index you can name the problem it solves and the rule that surprises people.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Multikey index', 'Index on an array field: one key per element; created automatically when an array appears.'],
  ['Parallel arrays', 'Two array fields in one compound index for the same document — not allowed.'],
  ['Text index', 'Word index for $text search; one per collection; language "none" for Vietnamese.'],
  ['Wildcard index', 'Indexes every sub-field under a path (e.g. specs.$**).'],
  ['Unique index', 'Refuses duplicate keys; a missing field counts as null.'],
  ['Sparse index', 'Skips documents that do not contain the field.'],
  ['Partial index', 'Indexes only documents matching partialFilterExpression; used only when the query implies the filter.'],
  ['TTL index', 'Deletes documents after a Date + expireAfterSeconds; background task every 60 s.'],
  ['Hidden index', 'Maintained but ignored by the planner; test before dropping.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Multikey: 2,000,224 keys for a million orders; no two parallel arrays in one compound index.</li>
<li>Text: Vietnamese ⇒ "none"; OR of words, phrases in quotes, minus to exclude, accents ignored.</li>
<li>Wildcard serves unknown sub-fields under one path.</li>
<li>Unique: duplicates block the build; missing = null. Partial unique solves optional and soft-deleted values — if queries include the filter.</li>
<li>TTL deletes within about a minute, Dates only — still check expiry in queries.</li>
<li>Hide before dropping; collation of query and index must match.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Multikey, text, wildcard, partial, sparse, TTL, unique, hidden</h2>
<p class="lead">Tới giờ index nào cũng là B-tree thường trên các trường đơn giá trị. Schema thật có mảng, có văn bản tự do, có thuộc tính đổi theo từng loại sản phẩm, có email phải duy nhất trừ tài khoản đã xoá, có phiên đăng nhập phải biến mất sau một giờ. MongoDB có một tuỳ chọn index cho từng thứ — và mỗi thứ có một luật làm người ta bất ngờ ở lần đầu. Bài này chạy từng loại và chỉ ra chỗ bất ngờ đó.</p>

<h3>Hình ảnh đời thường: các loại thẻ tra cứu của một thư viện</h3>
<p>Một thư viện giữ tủ thẻ theo tác giả (mỗi tác giả một thẻ — cuốn sách có ba tác giả có ba thẻ: <em>multikey</em>), tủ thẻ theo từ khoá (<em>text</em>), tủ thẻ chỉ dành cho sách quý (<em>partial</em>), danh sách sách đặt giữ tự trả về kệ sau 24 giờ (<em>TTL</em>), luật không hai bạn đọc nào trùng số thẻ (<em>unique</em>), và một ngăn tủ thủ thư lấy khăn phủ lên một tuần xem có ai cần tới không rồi mới vứt (<em>hidden</em>).</p>

<h3>Multikey: index trên trường mảng</h3>
<p>Đánh index một trường chứa mảng thì MongoDB tạo một khoá <em>cho mỗi phần tử</em>. Đơn có 1–3 món hàng; tìm các đơn có sản phẩm SP042:</p>
${lenh('s04-4-dac', 0)}
${lenh('s04-4-dac', 1)}
<p><code>isMultiKey: true</code>, <code>multiKeyPaths</code> cho thấy mảng là <code>items</code>, và truy vấn đọc đúng 3.982 đơn khớp. Một triệu đơn cho ra 2.000.224 khoá — mỗi món hàng một khoá — vậy mà index vẫn nhỏ hơn <code>_id_</code> vì 500 mã sản phẩm lặp lại rất nhiều (nén tiền tố, Bài 4.1). Bạn không bao giờ khai báo index là "multikey": nó tự thành multikey ngay khi có một tài liệu chứa mảng ở trường đó. Có hai giới hạn cần biết:</p>
${lenh('s04-4-dac', 2)}
<p>Một index phức hợp chỉ được chứa tối đa <strong>một</strong> trường mảng trong mỗi tài liệu: đánh index <code>{ tacGia, the }</code> khi cả hai đều là mảng sẽ cần mọi tổ hợp (tác giả × thẻ) và bị từ chối với <code>CannotIndexParallelArrays</code>. Giới hạn thứ hai là index multikey không <em>phủ</em> được truy vấn trên trường mảng (Bài 4.5).</p>
${nguon('📘', 'Multikey Indexes — MongoDB Docs', 'Mỗi phần tử mảng một khoá, giới hạn khi phức hợp, khoảng', 'https://www.mongodb.com/docs/manual/core/index-multikey/')}

<h3>Text: tìm từ bên trong chuỗi</h3>
${lenh('s04-4-dac', 3)}
<p>Index text tách chuỗi thành từ, có thể bỏ từ dừng và rút từ về gốc — với những ngôn ngữ nó biết. Tiếng Việt không nằm trong số đó: <code>default_language: 'vietnamese'</code> bị từ chối. Hãy dùng <code>'none'</code>: chỉ tách từ theo dấu cách và dấu câu, không bỏ gì, không rút gốc gì.</p>
${lenh('s04-4-dac', 4)}
${lenh('s04-4-dac', 5)}
<ul>
<li><code>'máy tính'</code> là hai từ nối bằng OR: tài liệu nào có "máy" <em>hoặc</em> "tính" (3 và 1).</li>
<li><code>'"máy tính xách"'</code> trong ngoặc kép là một cụm: chỉ tài liệu 1.</li>
<li><code>'lap trinh'</code> không dấu vẫn tìm ra "lập trình": index text (phiên bản 3) <strong>không phân biệt dấu</strong> — điểm cộng cho người dùng Việt hay gõ không dấu. (Với truy vấn thường bạn vẫn cần trường chuẩn hoá hoặc collation, Bài 2.6.)</li>
<li><code>'lập -sách'</code>: dấu trừ loại một từ — có "lập" nhưng không có "sách" ⇒ chỉ còn 1.</li>
</ul>
${lenh('s04-4-dac', 6)}
<p><code>$meta: 'textScore'</code> xếp theo độ liên quan: sản phẩm có đủ bốn từ đứng đầu. Mỗi collection chỉ có <strong>một</strong> index text (nó có thể gồm nhiều trường). Với ô tìm kiếm thật của cửa hàng — chịu lỗi gõ, gợi ý khi đang gõ, bộ phân tích tiếng Việt — các nhóm dùng công cụ tìm kiếm riêng (Atlas Search, Elasticsearch/OpenSearch); index text hợp cho tìm từ khoá đơn giản ngay trong cơ sở dữ liệu.</p>
${nguon('📘', 'Text Indexes — MongoDB Docs', 'Ngôn ngữ hỗ trợ, "none", cụm từ, loại từ, textScore, mỗi collection một index', 'https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/')}

<h3>Wildcard: một index cho thuộc tính đổi theo sản phẩm</h3>
<p>Trong CT Shop, laptop có <code>specs.ramGB</code> và <code>specs.cpu</code>, sách có <code>author</code>; mỗi loại hàng mới lại kèm thuộc tính mới (pattern attribute của Bài 3.3 giải bài này bằng cặp <code>{ k, v }</code>). Index wildcard đánh index mọi trường con dưới một đường dẫn, tên gì cũng được:</p>
${lenh('s04-4-dac', 7)}
<p><code>specs.$**</code> phục vụ cả <code>specs.ramGB</code> lẫn <code>specs.cpu</code> mà không cần gọi tên chúng; <code>author</code> nằm ngoài <code>specs</code>, nên truy vấn đó là COLLSCAN. Index wildcard tiện nhưng không miễn phí: mọi trường con của mọi tài liệu đều thành khoá, và nó không phục vụ được phép sắp theo nhiều trường như index phức hợp. Khi bạn làm chủ schema thì ưu tiên pattern attribute + index phức hợp; dùng wildcard cho các trường thật sự không đoán trước được.</p>
${nguon('📘', 'Wildcard Indexes — MongoDB Docs', 'Đánh index mọi trường con dưới một đường dẫn; các giới hạn', 'https://www.mongodb.com/docs/manual/core/indexes/index-types/index-wildcard/')}

<h3>Unique: hai chỗ bất ngờ</h3>
${lenh('s04-4-dac', 8)}
${lenh('s04-4-dac', 9)}
<p>Bất ngờ thứ nhất: tạo index unique trên collection đã có bản trùng thì thất bại (E11000 kèm giá trị gây trùng) — trong một đợt migration thật bạn phải tìm và xử lý bản trùng trước (Chương 5 có <code>$group</code> để tìm chúng). Bất ngờ thứ hai: tài liệu <em>không có</em> trường đó được đánh index như <code>null</code>, nên khách thứ hai không có email đụng khách thứ nhất: <code>dup key: { email: null }</code>. Đó chính là thứ làm hỏng yêu cầu "email không bắt buộc nhưng có thì phải duy nhất".</p>

<h3>Sparse và partial: chỉ đánh index một phần tài liệu</h3>
<p>Index <strong>sparse</strong> bỏ qua tài liệu không có trường — sửa được ca "không bắt buộc nhưng duy nhất". Index <strong>partial</strong> là bản tổng quát: chỉ đánh index tài liệu khớp một biểu thức lọc do bạn chọn. Cách dùng kinh điển là xoá mềm (Bài 2.5): email phải duy nhất giữa các tài khoản <em>đang hoạt động</em>, nhưng tài khoản đã xoá không được chặn người khác đăng ký lại bằng email đó.</p>
${lenh('s04-4-dac', 10)}
<p><code>a@x.vn</code> đã xoá (<code>daXoa: true</code>) không nằm trong index, nên một <code>a@x.vn</code> đang hoạt động được nhận; cái hoạt động thứ hai bị từ chối. Điểm mắc:</p>
${lenh('s04-4-dac', 11)}
<p>Bộ lập kế hoạch chỉ dùng index partial khi truy vấn <em>bao hàm</em> bộ lọc của nó. "Tìm a@x.vn" mà không có <code>daXoa: false</code> có thể cần cả tài khoản đã xoá, vốn không nằm trong index, nên nó thành COLLSCAN. Hãy viết điều kiện lọc vào mọi truy vấn cần dùng index đó (một hàm repository <code>findActiveByEmail</code> là chỗ hợp lý). Tài liệu MongoDB khuyên dùng partial thay cho sparse trong thiết kế mới: nó làm được việc của sparse và hơn thế.</p>
${nguon('📘', 'Partial Indexes — MongoDB Docs', 'partialFilterExpression, khi nào truy vấn dùng được, so với sparse', 'https://www.mongodb.com/docs/manual/core/index-partial/')}

<h3>TTL: tài liệu tự xoá</h3>
${lenh('s04-4-dac', 12)}
<p>Index TTL (<code>expireAfterSeconds</code>) trên một trường Date cho một luồng nền xoá các tài liệu đã quá ngày đó + N giây. Với <code>expireAfterSeconds: 0</code>, chính trường đó là thời điểm hết hạn — tự nhiên cho phiên đăng nhập và mã dùng một lần. Ba điều từ lần chạy: phiên đã hết hạn không bị xoá ngay mà trong vòng chừng một phút, vì luồng TTL chạy mỗi <strong>60 giây</strong> (và có thể trễ hơn khi máy bận); phiên còn một giờ mới hết hạn thì ở lại; tài liệu có <code>hetHan</code> là chuỗi thì <strong>không bao giờ</strong> bị xoá — TTL chỉ tác động lên kiểu Date của BSON (lại cái bẫy kiểu dữ liệu của Bài 1.2). Vậy index TTL là việc dọn dẹp, không phải bảo mật: kiểm tra OTP vẫn phải so <code>hetHan &gt; bây giờ</code> trong truy vấn.</p>
${nguon('📘', 'TTL Indexes — MongoDB Docs', 'Tác vụ nền 60 giây, chỉ trường Date, expireAfterSeconds', 'https://www.mongodb.com/docs/manual/core/index-ttl/')}

<h3>Hidden: thử xoá mà không xoá</h3>
${lenh('s04-4-dac', 13)}
<p>Index ẩn thì vô hình với bộ lập kế hoạch nhưng vẫn được cập nhật ở mọi lệnh ghi. Ẩn <code>khach_1</code> biến truy vấn 23 tài liệu thành một COLLSCAN 1.000.000 tài liệu; bỏ ẩn là dùng lại ngay — không phải dựng lại, việc mà trên collection lớn tốn hàng phút tới hàng giờ. Đó là quy trình an toàn để gỡ một index bạn tin là không ai dùng: ẩn nó, theo dõi độ trễ và log truy vấn chậm vài ngày, rồi mới xoá (hoặc bỏ ẩn trong vài giây nếu có gì hỏng). Ẩn index cũng xoá plan cache của collection (Bài 4.2).</p>
${nguon('📘', 'Hidden Indexes — MongoDB Docs', 'hideIndex / unhideIndex, vẫn được cập nhật, đánh giá trước khi xoá', 'https://www.mongodb.com/docs/manual/core/index-hidden/')}

<h3>Collation phải khớp</h3>
${lenh('s04-4-dac', 14)}
<p>Index tạo với collation tiếng Việt (strength 2: bỏ qua hoa thường, giữ dấu) lưu khoá so sánh theo collation đó. Truy vấn không có cùng collation thì so chuỗi theo từng byte, nên không dùng được index: COLLSCAN, khớp 1 (đúng "đỗ an"). Có cùng collation: IXSCAN, khớp 2 ("Đỗ An" và "đỗ an"; "Do An" khác dấu). Nếu API của bạn dùng collation để tìm kiếm (Bài 2.6), hãy tạo index với collation y hệt, hoặc đặt nó làm mặc định của collection.</p>

<h3>Còn trong hộp đồ nghề (bài này không đo)</h3>
<ul>
<li><strong>2dsphere</strong> — truy vấn địa lý (<code>$near</code>, <code>$geoWithin</code>) trên điểm GeoJSON: "cửa hàng trong bán kính 5 km".</li>
<li><strong>hashed</strong> — đánh index giá trị băm; dùng làm shard key để rải đều lệnh ghi (Chương 7).</li>
<li><strong>Clustered collection</strong> và <strong>time series</strong> collection lưu tài liệu theo thứ tự một khoá hoặc theo thời gian (Chương 10).</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "email duy nhất" chặn người dùng mãi mãi.</strong> Một nhóm thêm <code>{ email: 1 }, { unique: true }</code> và xoá mềm tài khoản bằng <code>daXoa: true</code>. Một khách xoá tài khoản, sau đó không đăng ký lại được: "email đã tồn tại". Hoặc cho phép đăng ký không cần email, và người thứ hai như vậy nhận lỗi 500 từ <code>dup key: { email: null }</code>. Cả hai đều sửa bằng cùng một index partial — và cả hai chỉ lộ ra khi kiểm thử nếu bạn thử với giá trị đã xoá và giá trị vắng mặt.</p>
</div>

<h3>💼 Đi làm: TTL để giữ dữ liệu đúng hạn</h3>
<p>Quy định về dữ liệu cá nhân (Nghị định 13/2023 của Việt Nam về bảo vệ dữ liệu cá nhân, GDPR với khách hàng châu Âu) và chuyện chi phí đơn thuần buộc các nhóm chỉ giữ log, phiên đăng nhập, mã xác minh và sự kiện theo dõi trong thời gian cần thiết. Index TTL là cơ chế giữ hạn đơn giản nhất: <code>createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 })</code> giữ 90 ngày. Hãy ghi thời hạn lưu vào tài liệu thiết kế, và nhớ rằng xoá hàng triệu tài liệu hết hạn là tải ghi thật — trên collection lớn, hãy thêm index TTL ngoài giờ cao điểm và theo dõi các đợt xoá đầu tiên.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Index multikey là gì? Có giới hạn gì?"</strong> — Mỗi phần tử mảng một khoá; index phức hợp chỉ tối đa một trường mảng trong mỗi tài liệu; không phủ được truy vấn trên trường mảng.</li>
<li><strong>"Làm sao để một trường không bắt buộc mà vẫn duy nhất?"</strong> — Dùng index unique partial (ví dụ <code>{ email: { $exists: true } }</code> hay <code>{ daXoa: false }</code>), không dùng unique thường, vì giá trị vắng bị tính là null.</li>
<li><strong>"TTL xoá chính xác tới đâu?"</strong> — Không chính xác: tác vụ nền mỗi 60 giây; chỉ trường Date; đừng bao giờ dựa vào nó cho bảo mật.</li>
<li><strong>"Bạn gỡ một index an toàn thế nào?"</strong> — Xem <code>$indexStats</code>, ẩn nó, theo dõi, rồi mới xoá.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trong collection <code>otp</code>, lưu mã dùng một lần hết hạn 5 phút sau khi tạo. Viết index, lệnh chèn và truy vấn <em>xác minh</em>, sao cho mã hết hạn bị từ chối kể cả khi luồng TTL chưa kịp xoá.</li>
<li>Khách có thể không có số điện thoại, nhưng số nào đã có thì phải duy nhất. Tạo index và chứng minh cả hai luật, mỗi luật bằng hai lệnh chèn.</li>
<li>Explain <code>db.don.find({ 'items.sp': 'SP042' }, { _id: 0, 'items.sp': 1 })</code> với index multikey. Có được phủ không? Vì sao?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>db.otp.createIndex({ hetHan: 1 }, { expireAfterSeconds: 0 })</code>; chèn <code>{ sdt, ma, hetHan: new Date(Date.now() + 5 * 60e3) }</code>; xác minh bằng <code>db.otp.findOneAndDelete({ sdt, ma, hetHan: { $gt: new Date() } })</code> — điều kiện ngày từ chối mã hết hạn, còn lệnh xoá làm mã chỉ dùng được một lần.</p>
<p>2. <code>db.kh.createIndex({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true } } })</code>. Hai khách không có số: cả hai được nhận. Hai khách cùng số: người thứ hai nhận E11000. (Index <code>sparse: true, unique: true</code> cũng dùng được cho đúng ca này.)</p>
<p>3. Không: kế hoạch có FETCH. Index multikey mỗi khoá lưu một phần tử và không dựng lại được mảng, nên MongoDB phải đọc tài liệu để trả về <code>items</code>. Truy vấn được phủ cần các trường không phải mảng (Bài 4.5).</p>
</details>
<p><strong>Xong khi:</strong> với mỗi loại index đặc biệt bạn nói được bài toán nó giải và cái luật làm người ta bất ngờ.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Index multikey', 'Index trên trường mảng: mỗi phần tử một khoá; tự thành multikey khi xuất hiện mảng.'],
  ['Mảng song song (parallel arrays)', 'Hai trường mảng trong cùng một index phức hợp cho cùng một tài liệu — không được phép.'],
  ['Index text', 'Index từ cho tìm kiếm $text; mỗi collection một cái; ngôn ngữ "none" cho tiếng Việt.'],
  ['Index wildcard', 'Đánh index mọi trường con dưới một đường dẫn (ví dụ specs.$**).'],
  ['Index unique', 'Từ chối khoá trùng; trường vắng mặt bị tính là null.'],
  ['Index sparse', 'Bỏ qua tài liệu không chứa trường đó.'],
  ['Index partial', 'Chỉ đánh index tài liệu khớp partialFilterExpression; chỉ được dùng khi truy vấn bao hàm bộ lọc đó.'],
  ['Index TTL', 'Xoá tài liệu sau một Date + expireAfterSeconds; tác vụ nền mỗi 60 giây.'],
  ['Index hidden', 'Vẫn được cập nhật nhưng bộ lập kế hoạch bỏ qua; dùng để thử trước khi xoá.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Multikey: 2.000.224 khoá cho một triệu đơn; không được hai mảng song song trong một index phức hợp.</li>
<li>Text: tiếng Việt ⇒ "none"; các từ nối bằng OR, cụm trong ngoặc kép, dấu trừ để loại, bỏ qua dấu.</li>
<li>Wildcard phục vụ các trường con không biết trước dưới một đường dẫn.</li>
<li>Unique: có bản trùng thì không dựng được; vắng mặt = null. Partial unique giải bài giá trị không bắt buộc và đã xoá mềm — nếu truy vấn có điều kiện lọc.</li>
<li>TTL xoá trong vòng chừng một phút, chỉ với Date — vẫn phải kiểm hạn trong truy vấn.</li>
<li>Ẩn trước khi xoá; collation của truy vấn và index phải khớp.</li>
</ul>
</div>
`,
};
