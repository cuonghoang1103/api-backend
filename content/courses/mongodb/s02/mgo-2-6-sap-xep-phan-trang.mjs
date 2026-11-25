/**
 * 2.6 — Sắp xếp, collation tiếng Việt và phân trang keyset (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-6-sort'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-6-sort.txt; ch2.big 200.000 tài liệu).
 * Đo thật: skip 199.980 quét 200.000 khoá chỉ mục để trả 20 tài liệu; keyset quét đúng 20. Số ms đổi theo máy ⇒ lời dựa trên số khoá.
 * Collation 'vi' strength 1 bỏ dấu thanh (án, àn) nhưng GIỮ ă/â là chữ riêng; 'en' strength 1 gộp hết.
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '2.6 — Sorting, Vietnamese collation and keyset pagination|||2.6 — Sắp xếp, collation tiếng Việt và phân trang keyset',
  slug: 'mgo-2-6-sap-xep-phan-trang',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Sắp xếp đúng cho người Việt và phân trang không chậm dần: so sánh theo byte đẩy họ Đặng, Đỗ xuống cuối, collation locale vi sửa thứ tự; strength 2 bỏ qua hoa thường, strength 1 bỏ dấu thanh nhưng giữ ă/â (khác hẳn locale en); đo thật skip 199.980 phải quét 200.000 khoá để trả 20 tài liệu trong khi keyset quét đúng 20; sắp theo trường không duy nhất làm trang lệch và cách thêm _id phá hoà; con trỏ keyset hai trường.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Sorting, Vietnamese collation and keyset pagination</h2>
<p class="lead">Every list screen in every app you will build sorts and paginates. Two things go wrong in Vietnamese projects specifically: names come out in an order no Vietnamese reader accepts, and "page 5,000" of an admin table takes seconds while page 1 is instant. This lesson fixes both — with collation, and with keyset pagination measured against <code>skip</code> on 200,000 documents.</p>

<h3>An everyday picture: the class register and the phone book</h3>
<p>A Vietnamese teacher reads the register in the order of the alphabet she learned: A, Ă, Â, B, C, D, Đ, E… "Đặng" comes right after the D names, not after "Vũ". A computer comparing bytes does not know that alphabet — it only knows that the code of <code>Đ</code> is larger than the code of <code>V</code>. And for pagination, think of a phone book: to find page 5,000, <code>skip</code> counts every entry from the beginning; a bookmark ("continue after Nguyễn Văn Nam") opens the right page directly.</p>

<h3>Byte order versus Vietnamese order</h3>
${lenh('s02-6-sort', 0)}
<p>The ten family names of CT Shop's 200 customers in default order: Bùi, Hoàng, Lê, Nguyễn, Ngô… Vũ, and then <strong>Đặng, Đỗ at the very end</strong>. By default MongoDB compares strings by their UTF-8 bytes; <code>Đ</code> (U+0110) sorts after every unaccented Latin letter. Also note "Nguyễn" before "Ngô": the bytes of <code>u</code> come before those of <code>ô</code>. Now with a Vietnamese <strong>collation</strong>:</p>
${lenh('s02-6-sort', 1)}
<p>Bùi, Đặng, Đỗ, Hoàng… Ngô, Nguyễn — the order of the Vietnamese alphabet (Đ right after D; "Ngô" before "Nguyễn" because in the Vietnamese alphabet <em>ô</em> comes before <em>u</em>: o, ô, ơ, p, q, r, s, t, u). A collation is a set of language rules for comparing strings — order of letters, whether case and accents matter. It comes from ICU, the same library browsers and Java use.</p>

<h3>Collation strength: case, accents and the Vietnamese letters ă, â</h3>
<p>The second use of collation is <em>matching</em>. Six spellings of "an" plus a control value:</p>
${lenh('s02-6-sort', 2)}
${lenh('s02-6-sort', 3)}
${lenh('s02-6-sort', 4)}
${lenh('s02-6-sort', 5)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">no collation</span><span class="lz-t">byte-exact</span><span class="lz-d">Only <code>an</code>.</span></div>
  <div class="lz-step"><span class="lz-k">vi, strength 2</span><span class="lz-t">ignore case</span><span class="lz-d"><code>an</code>, <code>An</code>, <code>AN</code> — the usual choice for usernames and emails.</span></div>
  <div class="lz-step"><span class="lz-k">vi, strength 1</span><span class="lz-t">ignore case and tone marks</span><span class="lz-d">adds <code>án</code>, <code>àn</code> — but <strong>not</strong> <code>Ân</code>, <code>ăn</code>: in Vietnamese, ă and â are different letters, not "a with an accent".</span></div>
  <div class="lz-step"><span class="lz-k">en, strength 1</span><span class="lz-t">ignore everything</span><span class="lz-d">all seven — "ăn" (eat) equals "an" (safe). Wrong for Vietnamese search.</span></div>
</div>
<p>This is a detail most tutorials miss because they test with English. For a search box where users type without accents ("nguyen" to find "Nguyễn"), even <code>vi</code> strength 1 is not enough — <code>ê</code> is its own letter too. That is why Lesson 2.2 recommended a separate accent-stripped search field. Use collation for <strong>sorting</strong> (strength 3, the default) and for <strong>case-insensitive equality</strong> (strength 2).</p>
<p>A collation can be set per query (as above), per index, or as the collection default (<code>createCollection('customers', { collation: { locale: 'vi' } })</code>). An index is only used by a query with the <em>same</em> collation — a frequent cause of "my index is not used" in Chapter 4. And a unique index with <code>{ locale: 'vi', strength: 2 }</code> is the database-side fix for the <code>An@Example.com</code> duplicate in Lesson 2.1.</p>

<h3>skip is not free: measuring on 200,000 documents</h3>
${lenh('s02-6-sort', 7)}
${lenh('s02-6-sort', 8)}
<p>The <code>explain('executionStats')</code> output (Chapter 4 reads it in depth) tells us how much work the server did. Every row returns 20 documents. Page 1: 20 index keys examined. <code>skip(1000)</code>: 1,020. <code>skip(100000)</code>: 100,020. The last page, <code>skip(199980)</code>: <strong>200,000 index keys walked to return 20 documents</strong>. <code>skip</code> does not jump; the server walks past every skipped entry. The time column grows with it (your milliseconds will differ). An admin table with "go to last page", or a crawler that pages through everything with <code>?page=N</code>, makes the database do work proportional to N on every request — O(N²) for the whole crawl.</p>
${lenh('s02-6-sort', 9)}
<p>Same last page, written as "the 20 documents after <code>_id</code> 199,960": 20 keys examined, 20 returned — exactly as cheap as page 1. This is <strong>keyset pagination</strong> (also called cursor-based or seek pagination): instead of a page number, the client sends the sort key of the last item it received, and the query asks for items after it.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">skip/limit</span><span class="lz-t">?page=N</span><span class="lz-d">Cost grows with N. Can jump to any page. Inserts between requests shift pages (duplicates, gaps).</span></div>
  <div class="lz-step"><span class="lz-k">keyset</span><span class="lz-t">?after=&lt;last sort key&gt;</span><span class="lz-d">Constant cost with an index on the sort key. Stable under inserts. No "jump to page 731" — only next/previous.</span></div>
  <div class="lz-step"><span class="lz-k">rule of thumb</span><span class="lz-t">feeds, APIs, infinite scroll, exports ⇒ keyset</span><span class="lz-d">Small admin tables with page numbers ⇒ skip is fine, but cap the maximum page.</span></div>
</div>

<h3>Sorting on a value that is not unique</h3>
${lenh('s02-6-sort', 6)}
<p>256 different totals are shared by more than one order. Sort by <code>total</code>, <code>createdAt</code> or <code>status</code> and ties are normal. MongoDB does not promise any order among tied documents, and the order can change between two executions of the same query. See it with ten comments, six of which were posted in the same second:</p>
${lenh('s02-6-sort', 10)}
${lenh('s02-6-sort', 11)}
<p>Page 2 returned 4, 2, 5, 1 — the tied comments in an arbitrary order. With skip-based pages, nothing guarantees that page 3 continues where page 2 stopped: a comment can appear on two pages or on none. The cure is a <strong>tie-breaker</strong>: add a unique field (normally <code>_id</code>) as the last sort key, so the order is total:</p>
${lenh('s02-6-sort', 12)}
${lenh('s02-6-sort', 13)}
<p>For keyset pagination on a non-unique key the cursor has two parts: the last <code>luc</code> <em>and</em> the last <code>_id</code>. "After" means: an earlier time, <em>or</em> the same time with a smaller <code>_id</code> — the <code>$or</code> above. Page 2 is now 6, 5, 4, 3: deterministic, no duplicates, no gaps. The index that makes it fast is <code>{ luc: -1, _id: -1 }</code> (Chapter 4). This is the exact function the chapter lab asks you to write for "orders of a customer, newest first".</p>

<h3>Sorting needs memory — or an index</h3>
<p>When no index provides the order, the server sorts in memory and has a limit (100 MB per sort stage); beyond it the sort spills to disk (allowed by default since 6.0) and gets much slower. A <code>sort</code> + <code>limit</code> without an index still reads every matching document to find the top 20. In Chapter 4 you will read <code>SORT</code> versus an index scan in <code>explain</code> and design the index for a sort — the "S" of the ESR rule.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — keyset cursors that clients can forge.</strong> If the "after" cursor is a raw JSON object the client sends back (<code>?after={"luc":…,"_id":…}</code>), it becomes a way to inject operators (<code>{"$gt": ""}</code>) into your filter. Encode the cursor yourself (base64 of the two values), decode it on the server, validate the types (a date, an integer id), and build the filter from those values only — the same rule as Lesson 2.2.</p>
</div>

${nguon('📘', 'Collation — MongoDB Docs', 'locale, strength, caseLevel; collation on queries and indexes', 'https://www.mongodb.com/docs/manual/reference/collation/')}
${nguon('📘', 'cursor.sort() — MongoDB Docs', 'Sort consistency: include a unique field to get a consistent order', 'https://www.mongodb.com/docs/manual/reference/method/cursor.sort/')}

<h3>💼 At work: the export that never finished</h3>
<p>A client asks for "export all orders to CSV". The first version loops <code>?page=1…N</code> over the existing API with <code>skip</code>. With 3 million orders it runs for hours, the database CPU sits at 100 % and other users complain — each page re-walks everything before it. The fix you propose in the code review: one keyset loop on <code>_id</code> (<code>find({ _id: { $gt: last } }).sort({ _id: 1 }).limit(5000)</code>), streaming rows into the file, logging the last id every batch so a crash can resume. It finishes in minutes. Being able to show the <code>totalKeysExamined</code> numbers from this lesson is what convinces the team.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Why is skip slow for deep pages?"</strong> — The server walks past every skipped entry; cost grows linearly with the offset.</li>
<li><strong>"What is keyset (cursor) pagination?"</strong> — Filter on the last seen sort key instead of skipping; constant cost with an index; next/previous only.</li>
<li><strong>"How do you paginate by a non-unique field?"</strong> — Add <code>_id</code> as a tie-breaker in the sort and in the cursor: (value, _id).</li>
<li><strong>"How do you sort Vietnamese names correctly?"</strong> — Collation <code>{ locale: 'vi' }</code>, on the query or as the collection/index default.</li>
<li><strong>"Case-insensitive unique email?"</strong> — Normalise to lower case; optionally a unique index with collation strength 2.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>List the 10 most expensive CT Shop products, ties broken by name in Vietnamese order.</li>
<li>Implement keyset pagination over <code>ctshop.orders</code> sorted by <code>total</code> descending (non-unique!), page size 50. Loop through all pages and prove the total count is 2,000 with no duplicates.</li>
<li>Create a collection <code>ch2.nguoiDung</code> with default collation <code>{ locale: 'vi', strength: 2 }</code> and a unique index on <code>email</code>. Show that <code>An@Example.com</code> is now rejected after <code>an@example.com</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.products.find({}, { name: 1, price: 1 }).sort({ price: -1, name: 1 }).collation({ locale: 'vi' }).limit(10)</code>.</p>
<p>2. Sort <code>{ total: -1, _id: -1 }</code>; first page without a filter; then filter <code>{ $or: [{ total: { $lt: t } }, { total: t, _id: { $lt: id } }] }</code> with <code>t</code>, <code>id</code> from the last order of the previous page. Collect ids in a <code>Set</code>; at the end <code>set.size === 2000</code> and the number of collected ids is 2,000 too. (Fetch 51 to know whether another page exists — as in the lab solution.)</p>
<p>3. <code>db.createCollection('nguoiDung', { collation: { locale: 'vi', strength: 2 } }); db.nguoiDung.createIndex({ email: 1 }, { unique: true })</code> — the index inherits the collection collation. The second insert fails with E11000.</p>
</details>
<p><strong>Done when:</strong> your loop in exercise 2 prints 2,000 and 0 duplicates.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Collation', 'Language-specific rules for comparing strings (ICU): letter order, case and accent sensitivity.'],
  ['strength', '1: base letters only; 2: + accents (case ignored); 3 (default): + case.'],
  ['skip/limit pagination', 'Page N = skip (N−1)×size; the server walks every skipped entry.'],
  ['Keyset pagination', 'Next page = items after the last seen sort key; constant cost with a matching index.'],
  ['Tie-breaker', 'A unique field (usually <code>_id</code>) added to the sort so the order is total and stable.'],
  ['totalKeysExamined', '<code>explain</code> counter: index entries the server read — the honest measure of work.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Default string order is by bytes: Đặng after Vũ. Use <code>collation({ locale: 'vi' })</code> for Vietnamese.</li>
<li>Strength 2 ignores case; <code>vi</code> strength 1 ignores tone marks but keeps ă, â, ê, ô, ơ, ư, đ as letters.</li>
<li>skip 199,980 walked 200,000 keys to return 20; keyset walked 20. Use keyset for APIs, feeds and exports.</li>
<li>Always end a sort with a unique tie-breaker; the keyset cursor then has two parts.</li>
<li>Encode and validate cursors; never accept a raw filter object from the client.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Sắp xếp, collation tiếng Việt và phân trang keyset</h2>
<p class="lead">Mọi màn hình danh sách trong mọi ứng dụng bạn sẽ làm đều sắp xếp và phân trang. Có hai thứ hỏng riêng ở các dự án Việt Nam: tên người hiện ra theo một thứ tự mà không người Việt nào chấp nhận, và "trang 5.000" của bảng quản trị mất vài giây trong khi trang 1 thì tức thì. Bài này sửa cả hai — bằng collation, và bằng phân trang keyset được đo so với <code>skip</code> trên 200.000 tài liệu.</p>

<h3>Hình ảnh đời thường: sổ điểm danh và danh bạ điện thoại</h3>
<p>Cô giáo người Việt đọc sổ điểm danh theo bảng chữ cái cô đã học: A, Ă, Â, B, C, D, Đ, E… "Đặng" đứng ngay sau các tên vần D, không phải sau "Vũ". Máy tính so sánh theo byte không biết bảng chữ cái đó — nó chỉ biết mã của <code>Đ</code> lớn hơn mã của <code>V</code>. Còn với phân trang, hãy nghĩ tới cuốn danh bạ: để tới trang 5.000, <code>skip</code> đếm từng mục từ đầu; một chiếc kẹp sách ("tiếp sau Nguyễn Văn Nam") mở thẳng đúng trang.</p>

<h3>Thứ tự byte so với thứ tự tiếng Việt</h3>
${lenh('s02-6-sort', 0)}
<p>Mười họ của 200 khách CT Shop theo thứ tự mặc định: Bùi, Hoàng, Lê, Nguyễn, Ngô… Vũ, rồi <strong>Đặng, Đỗ ở tận cuối</strong>. Mặc định MongoDB so chuỗi theo byte UTF-8; <code>Đ</code> (U+0110) đứng sau mọi chữ Latin không dấu. Để ý thêm "Nguyễn" đứng trước "Ngô": byte của <code>u</code> nhỏ hơn byte của <code>ô</code>. Giờ thử với một <strong>collation</strong> tiếng Việt:</p>
${lenh('s02-6-sort', 1)}
<p>Bùi, Đặng, Đỗ, Hoàng… Ngô, Nguyễn — đúng thứ tự bảng chữ cái tiếng Việt (Đ ngay sau D; "Ngô" trước "Nguyễn" vì trong bảng chữ cái tiếng Việt <em>ô</em> đứng trước <em>u</em>: o, ô, ơ, p, q, r, s, t, u). Collation là bộ luật ngôn ngữ để so sánh chuỗi — thứ tự chữ cái, có tính hoa thường và dấu hay không. Nó đến từ ICU, cùng thư viện mà trình duyệt và Java dùng.</p>

<h3>Độ mạnh collation: hoa thường, dấu thanh và các chữ ă, â</h3>
<p>Công dụng thứ hai của collation là <em>so khớp</em>. Sáu cách viết "an" cộng một giá trị đối chứng:</p>
${lenh('s02-6-sort', 2)}
${lenh('s02-6-sort', 3)}
${lenh('s02-6-sort', 4)}
${lenh('s02-6-sort', 5)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">không collation</span><span class="lz-t">khớp đúng từng byte</span><span class="lz-d">Chỉ <code>an</code>.</span></div>
  <div class="lz-step"><span class="lz-k">vi, strength 2</span><span class="lz-t">bỏ qua hoa thường</span><span class="lz-d"><code>an</code>, <code>An</code>, <code>AN</code> — lựa chọn thường dùng cho tên đăng nhập và email.</span></div>
  <div class="lz-step"><span class="lz-k">vi, strength 1</span><span class="lz-t">bỏ qua hoa thường và dấu thanh</span><span class="lz-d">thêm <code>án</code>, <code>àn</code> — nhưng <strong>không</strong> có <code>Ân</code>, <code>ăn</code>: trong tiếng Việt, ă và â là chữ cái khác, không phải "a có dấu".</span></div>
  <div class="lz-step"><span class="lz-k">en, strength 1</span><span class="lz-t">bỏ qua tất cả</span><span class="lz-d">cả bảy — "ăn" bằng "an". Sai cho tìm kiếm tiếng Việt.</span></div>
</div>
<p>Đây là chi tiết đa số bài hướng dẫn bỏ sót vì họ thử bằng tiếng Anh. Với ô tìm kiếm mà người dùng gõ không dấu ("nguyen" để tìm "Nguyễn"), ngay cả <code>vi</code> strength 1 cũng không đủ — <code>ê</code> cũng là một chữ cái riêng. Vì thế Bài 2.2 khuyên dùng một trường tìm kiếm riêng đã bỏ dấu. Hãy dùng collation cho <strong>sắp xếp</strong> (strength 3, mặc định) và cho <strong>so bằng không phân biệt hoa thường</strong> (strength 2).</p>
<p>Collation có thể đặt cho từng truy vấn (như trên), cho từng chỉ mục, hoặc làm mặc định của collection (<code>createCollection('customers', { collation: { locale: 'vi' } })</code>). Một chỉ mục chỉ được dùng bởi truy vấn có <em>cùng</em> collation — nguyên nhân hay gặp của "chỉ mục của tôi không được dùng" ở Chương 4. Và một chỉ mục unique với <code>{ locale: 'vi', strength: 2 }</code> là cách sửa phía cơ sở dữ liệu cho bản trùng <code>An@Example.com</code> ở Bài 2.1.</p>

<h3>skip không miễn phí: đo trên 200.000 tài liệu</h3>
${lenh('s02-6-sort', 7)}
${lenh('s02-6-sort', 8)}
<p>Kết quả <code>explain('executionStats')</code> (Chương 4 đọc kỹ) cho biết máy chủ đã làm bao nhiêu việc. Dòng nào cũng trả 20 tài liệu. Trang 1: 20 khoá chỉ mục được quét. <code>skip(1000)</code>: 1.020. <code>skip(100000)</code>: 100.020. Trang cuối, <code>skip(199980)</code>: <strong>đi qua 200.000 khoá chỉ mục để trả về 20 tài liệu</strong>. <code>skip</code> không nhảy cóc; máy chủ đi qua từng mục bị bỏ. Cột thời gian tăng theo (số mili giây của bạn sẽ khác). Một bảng quản trị có nút "tới trang cuối", hay một con bot duyệt hết dữ liệu bằng <code>?page=N</code>, bắt cơ sở dữ liệu làm lượng việc tỉ lệ với N ở mỗi request — O(N²) cho cả lượt duyệt.</p>
${lenh('s02-6-sort', 9)}
<p>Cùng trang cuối, viết thành "20 tài liệu sau <code>_id</code> 199.960": quét 20 khoá, trả 20 — rẻ đúng bằng trang 1. Đây là <strong>phân trang keyset</strong> (còn gọi là phân trang theo con trỏ, hay seek pagination): thay vì số trang, client gửi khoá sắp xếp của mục cuối cùng nó đã nhận, và truy vấn hỏi các mục đứng sau nó.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">skip/limit</span><span class="lz-t">?page=N</span><span class="lz-d">Chi phí tăng theo N. Nhảy được tới trang bất kỳ. Dữ liệu chèn thêm giữa các request làm trang bị xô (trùng, sót).</span></div>
  <div class="lz-step"><span class="lz-k">keyset</span><span class="lz-t">?after=&lt;khoá sắp xếp cuối&gt;</span><span class="lz-d">Chi phí không đổi khi có chỉ mục trên khoá sắp xếp. Ổn định khi có dữ liệu chèn thêm. Không "nhảy tới trang 731" — chỉ trang sau/trang trước.</span></div>
  <div class="lz-step"><span class="lz-k">quy tắc nhanh</span><span class="lz-t">feed, API, cuộn vô hạn, xuất dữ liệu ⇒ keyset</span><span class="lz-d">Bảng quản trị nhỏ có số trang ⇒ skip vẫn ổn, nhưng hãy chặn trang tối đa.</span></div>
</div>

<h3>Sắp theo một giá trị không duy nhất</h3>
${lenh('s02-6-sort', 6)}
<p>256 mức tổng tiền khác nhau được chia sẻ bởi nhiều hơn một đơn. Sắp theo <code>total</code>, <code>createdAt</code> hay <code>status</code> thì hoà là chuyện bình thường. MongoDB không hứa thứ tự nào giữa các tài liệu hoà nhau, và thứ tự đó có thể đổi giữa hai lần chạy cùng một truy vấn. Xem với mười bình luận, sáu cái trong số đó được đăng trong cùng một giây:</p>
${lenh('s02-6-sort', 10)}
${lenh('s02-6-sort', 11)}
<p>Trang 2 trả về 4, 2, 5, 1 — các bình luận hoà nhau theo một thứ tự tuỳ ý. Với phân trang bằng skip, không gì bảo đảm trang 3 tiếp đúng chỗ trang 2 dừng: một bình luận có thể hiện ở hai trang hoặc không ở trang nào. Cách chữa là một <strong>khoá phá hoà</strong> (tie-breaker): thêm một trường duy nhất (thường là <code>_id</code>) làm khoá sắp xếp cuối cùng, để thứ tự trở thành toàn phần:</p>
${lenh('s02-6-sort', 12)}
${lenh('s02-6-sort', 13)}
<p>Với phân trang keyset trên khoá không duy nhất, con trỏ có hai phần: <code>luc</code> cuối <em>và</em> <code>_id</code> cuối. "Sau" nghĩa là: thời điểm sớm hơn, <em>hoặc</em> cùng thời điểm nhưng <code>_id</code> nhỏ hơn — chính là <code>$or</code> ở trên. Trang 2 giờ là 6, 5, 4, 3: tất định, không trùng, không sót. Chỉ mục làm nó nhanh là <code>{ luc: -1, _id: -1 }</code> (Chương 4). Đây đúng là hàm mà lab chương này yêu cầu bạn viết cho "đơn của một khách, mới nhất trước".</p>

<h3>Sắp xếp cần bộ nhớ — hoặc một chỉ mục</h3>
<p>Khi không có chỉ mục nào cho sẵn thứ tự, máy chủ sắp trong bộ nhớ và có giới hạn (100 MB cho mỗi bước sắp xếp); vượt quá thì việc sắp tràn xuống đĩa (được phép mặc định từ 6.0) và chậm đi rất nhiều. Một <code>sort</code> + <code>limit</code> không có chỉ mục vẫn phải đọc mọi tài liệu khớp để tìm ra 20 cái đứng đầu. Ở Chương 4 bạn sẽ đọc <code>SORT</code> so với quét chỉ mục trong <code>explain</code> và thiết kế chỉ mục cho phép sắp — chữ "S" của luật ESR.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — con trỏ keyset mà client làm giả được.</strong> Nếu con trỏ "after" là một object JSON thô do client gửi lại (<code>?after={"luc":…,"_id":…}</code>), nó trở thành đường để chèn toán tử (<code>{"$gt": ""}</code>) vào bộ lọc của bạn. Hãy tự mã hoá con trỏ (base64 của hai giá trị), giải mã ở máy chủ, kiểm kiểu (một ngày giờ, một id số nguyên), và chỉ dựng bộ lọc từ các giá trị đó — cùng luật như Bài 2.2.</p>
</div>

${nguon('📘', 'Collation — MongoDB Docs', 'locale, strength, caseLevel; collation trên truy vấn và chỉ mục', 'https://www.mongodb.com/docs/manual/reference/collation/')}
${nguon('📘', 'cursor.sort() — MongoDB Docs', 'Sort consistency: thêm một trường duy nhất để thứ tự nhất quán', 'https://www.mongodb.com/docs/manual/reference/method/cursor.sort/')}

<h3>💼 Đi làm: job xuất dữ liệu chạy mãi không xong</h3>
<p>Khách hàng yêu cầu "xuất toàn bộ đơn hàng ra CSV". Phiên bản đầu lặp <code>?page=1…N</code> trên API sẵn có dùng <code>skip</code>. Với 3 triệu đơn nó chạy hàng giờ, CPU cơ sở dữ liệu đứng ở 100 % và người dùng khác kêu ca — mỗi trang lại đi qua toàn bộ phần trước nó. Cách sửa bạn đề xuất trong code review: một vòng lặp keyset trên <code>_id</code> (<code>find({ _id: { $gt: cuoi } }).sort({ _id: 1 }).limit(5000)</code>), ghi dần từng dòng ra tệp, ghi log id cuối sau mỗi lô để nếu sập thì chạy tiếp được. Nó xong trong vài phút. Việc đưa ra được các con số <code>totalKeysExamined</code> của bài này là thứ thuyết phục cả nhóm.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Vì sao skip chậm ở các trang sâu?"</strong> — Máy chủ đi qua từng mục bị bỏ; chi phí tăng tuyến tính theo độ lệch.</li>
<li><strong>"Phân trang keyset (con trỏ) là gì?"</strong> — Lọc theo khoá sắp xếp cuối đã thấy thay vì bỏ qua; chi phí không đổi khi có chỉ mục; chỉ có trang sau/trang trước.</li>
<li><strong>"Phân trang theo một trường không duy nhất thế nào?"</strong> — Thêm <code>_id</code> làm khoá phá hoà trong sort và trong con trỏ: (giá trị, _id).</li>
<li><strong>"Sắp tên tiếng Việt cho đúng thế nào?"</strong> — Collation <code>{ locale: 'vi' }</code>, trên truy vấn hoặc làm mặc định của collection/chỉ mục.</li>
<li><strong>"Email unique không phân biệt hoa thường?"</strong> — Chuẩn hoá về chữ thường; có thể thêm chỉ mục unique với collation strength 2.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê 10 sản phẩm đắt nhất của CT Shop, hoà thì phá theo tên theo thứ tự tiếng Việt.</li>
<li>Cài phân trang keyset trên <code>ctshop.orders</code> sắp theo <code>total</code> giảm dần (không duy nhất!), mỗi trang 50. Duyệt hết các trang và chứng minh tổng số là 2.000, không trùng.</li>
<li>Tạo collection <code>ch2.nguoiDung</code> với collation mặc định <code>{ locale: 'vi', strength: 2 }</code> và chỉ mục unique trên <code>email</code>. Chỉ ra rằng giờ <code>An@Example.com</code> bị từ chối sau khi đã có <code>an@example.com</code>.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>db.products.find({}, { name: 1, price: 1 }).sort({ price: -1, name: 1 }).collation({ locale: 'vi' }).limit(10)</code>.</p>
<p>2. Sắp <code>{ total: -1, _id: -1 }</code>; trang đầu không có bộ lọc; các trang sau lọc <code>{ $or: [{ total: { $lt: t } }, { total: t, _id: { $lt: id } }] }</code> với <code>t</code>, <code>id</code> lấy từ đơn cuối của trang trước. Gom id vào một <code>Set</code>; cuối cùng <code>set.size === 2000</code> và số id đã gom cũng là 2.000. (Lấy 51 để biết còn trang sau hay không — như lời giải lab.)</p>
<p>3. <code>db.createCollection('nguoiDung', { collation: { locale: 'vi', strength: 2 } }); db.nguoiDung.createIndex({ email: 1 }, { unique: true })</code> — chỉ mục thừa hưởng collation của collection. Lần chèn thứ hai lỗi E11000.</p>
</details>
<p><strong>Xong khi:</strong> vòng lặp ở bài 2 in ra 2.000 và 0 bản trùng.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Collation', 'Bộ luật so sánh chuỗi theo ngôn ngữ (ICU): thứ tự chữ cái, có tính hoa thường và dấu hay không.'],
  ['strength', '1: chỉ chữ gốc; 2: + dấu (bỏ qua hoa thường); 3 (mặc định): + hoa thường.'],
  ['Phân trang skip/limit', 'Trang N = skip (N−1)×cỡ trang; máy chủ đi qua mọi mục bị bỏ.'],
  ['Phân trang keyset', 'Trang sau = các mục đứng sau khoá sắp xếp cuối đã thấy; chi phí không đổi khi có chỉ mục phù hợp.'],
  ['Khoá phá hoà', 'Một trường duy nhất (thường là <code>_id</code>) thêm vào sort để thứ tự là toàn phần và ổn định.'],
  ['totalKeysExamined', 'Bộ đếm trong <code>explain</code>: số mục chỉ mục máy chủ đã đọc — thước đo trung thực của lượng việc.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự chuỗi mặc định theo byte: Đặng đứng sau Vũ. Dùng <code>collation({ locale: 'vi' })</code> cho tiếng Việt.</li>
<li>Strength 2 bỏ qua hoa thường; <code>vi</code> strength 1 bỏ dấu thanh nhưng giữ ă, â, ê, ô, ơ, ư, đ là chữ cái riêng.</li>
<li>skip 199.980 đi qua 200.000 khoá để trả 20; keyset đi qua 20. Dùng keyset cho API, feed và xuất dữ liệu.</li>
<li>Luôn kết thúc sort bằng một khoá phá hoà duy nhất; khi đó con trỏ keyset có hai phần.</li>
<li>Mã hoá và kiểm con trỏ; đừng bao giờ nhận object bộ lọc thô từ client.</li>
</ul>
</div>
`,
};
