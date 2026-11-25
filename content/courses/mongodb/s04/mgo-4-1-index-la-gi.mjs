/**
 * 4.1 — Index hoạt động thế nào: COLLSCAN với IXSCAN, đo thật (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-1-idx'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s04/s04-1-idx.txt nạp lại CT Shop + 1.000.000 đơn
 * tất định bằng ../_demo/don-trieu.js vào database ch4).
 * Số đối chiếu (tất định): 1.000.000 đơn, 164,4 MB, 172 byte/đơn; khách KH01234 có 23 đơn; COLLSCAN xét 1.000.000 tài liệu, IXSCAN xét 23 khoá
 * + 23 tài liệu. ms đổi theo lần chạy (máy đang chạy việc khác) ⇒ lời chỉ nêu bậc độ lớn / tỉ lệ.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '4.1 — How an index works: COLLSCAN vs IXSCAN, measured|||4.1 — Index hoạt động thế nào: COLLSCAN với IXSCAN, đo thật',
  slug: 'mgo-4-1-index-la-gi',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một triệu đơn hàng tất định, một truy vấn "đơn của khách KH01234": không index thì MongoDB đọc cả 1.000.000 tài liệu để trả 23; có index thì đọc đúng 23 khoá + 23 tài liệu, nhanh hơn cả trăm lần. Index B-tree bên trong trông thế nào (khoá đã sắp xếp + RecordId), vì sao index _id to hơn index khách, và cái giá: mỗi index làm chậm mọi lệnh ghi (đo thật 1 index với 6 index).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>How an index works: COLLSCAN vs IXSCAN, measured</h2>
<p class="lead">Chapter 3 decided the shape of your documents. This chapter decides how fast you can find them. With 50 test documents every query is instant, so nobody notices a missing index — until the collection holds a million documents and the order history page takes a third of a second per request, on every request. In this lesson you load one million orders, run the same query with and without an index, and look at exactly what the server did differently.</p>

<h3>An everyday picture: the phone book and the index at the back of a textbook</h3>
<p>Looking for every page that mentions "transaction" in a 600-page textbook without an index means reading all 600 pages. The index at the back is a <em>separate, sorted list</em>: "transaction … 212, 340, 341". You find the word in seconds because the list is in alphabetical order, then you jump straight to the pages. Two things follow, and both are true of database indexes: the index costs paper (storage), and every time the author adds a page, the index has to be updated too (slower writes).</p>

<h3>One million orders</h3>
<p>The lab file <code>_demo/don-trieu.js</code> generates 1,000,000 orders deterministically (same seed, same data on your machine) into the database <code>ch4</code>, collection <code>don</code>: customer code (<code>khach</code>, 50,000 customers), status (<code>trangThai</code>, skewed like real shops — 55% delivered, 1% new), province, total in VND, date over 2025–2026 and 1–3 line items. It takes well under a minute.</p>
${lenh('s04-1-idx', 0)}
${lenh('s04-1-idx', 1)}
${lenh('s04-1-idx', 2)}
<p>164 MB of data, 172 bytes per order, and only one index: <code>_id_</code>, which MongoDB always creates.</p>

<h3>Without an index: COLLSCAN</h3>
<p>The order history page asks for every order of one customer. Ask the server how it ran the query with <code>explain("executionStats")</code> (Lesson 4.2 reads it in detail; here we keep five numbers):</p>
${lenh('s04-1-idx', 3)}
<p><strong>COLLSCAN</strong> — collection scan: the server read all 1,000,000 documents (<code>totalDocsExamined</code>) to return 23 (<code>nReturned</code>). It had no choice: nothing tells it where KH01234's orders are, so it must look at every one. Hundreds of milliseconds for 23 rows, and the cost grows with the collection — at 10 million orders it is ten times worse, while the answer is still 23 rows.</p>

<h3>With an index: IXSCAN + FETCH</h3>
${lenh('s04-1-idx', 4)}
${lenh('s04-1-idx', 5)}
<p>Now the plan is two stages: <strong>IXSCAN</strong> walked the index <code>khach_1</code> only inside the bounds <code>["KH01234", "KH01234"]</code> and found 23 keys; <strong>FETCH</strong> used the record address stored with each key to read exactly those 23 documents. 23 keys, 23 documents, 23 returned — the ideal ratio, 1 : 1 : 1. Run it for many customers to see the difference without explain overhead:</p>
${lenh('s04-1-idx', 6)}
<p>The same twenty questions, more than a hundred times faster with the index (the exact factor changes from run to run on a busy machine; the order of magnitude does not). Creating the index itself took around a second for a million documents — a one-time cost.</p>

<h3>Inside: a B-tree of sorted keys</h3>
<p>A MongoDB index (in WiredTiger) is a <strong>B-tree</strong>: a balanced tree of pages. The leaf pages hold every key <em>in sorted order</em>, each with a <strong>RecordId</strong> — the address of the document in the collection's own file. The upper pages hold only separators that say "keys from KH01200 to KH01299 are below this branch". Finding a key means reading one page per level, and because each page holds hundreds of keys, a million keys need only three or four levels.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">root page</span><span class="lz-t">… KH00000 | KH25000 | KH50000</span><span class="lz-d">pick the branch for KH01234</span></div>
  <div class="lz-step"><span class="lz-k">internal page</span><span class="lz-t">… KH01000 | KH01200 | KH01300 …</span><span class="lz-d">one more step down</span></div>
  <div class="lz-step"><span class="lz-k">leaf page</span><span class="lz-t">(KH01234, rid 51) (KH01234, rid 913) … 23 entries</span><span class="lz-d">keys sorted, each with a RecordId</span></div>
  <div class="lz-step"><span class="lz-k">FETCH</span><span class="lz-t">read the 23 documents by RecordId</span><span class="lz-d">from the collection file</span></div>
</div>
<p>Because the leaves are sorted, an index also gives you <em>order</em> for free. Reading the collection through the index returns documents in key order:</p>
${lenh('s04-1-idx', 7)}
<p>That property is the key to Lesson 4.3: an index that matches your <code>sort()</code> means the server never has to sort in memory. Sorted leaves also make range queries cheap (<code>{ khach: { $gte: 'KH01000', $lt: 'KH02000' } }</code> walks one contiguous slice) — and prefix regexes too (Lesson 4.6).</p>
${lenh('s04-1-idx', 8)}
<p>The <code>_id</code> index is bigger than <code>khach_1</code> although both have a million entries. WiredTiger compresses index pages with <em>prefix compression</em>: consecutive keys that share a beginning ("KH0123…") are stored once. The 50,000 customer codes repeat 20 times each and share long prefixes; the integer <code>_id</code>s are all different. Keep this in mind when you guess index size: it depends on the values, not only on the count.</p>

<h3>The price: every write maintains every index</h3>
<p>An index is a second data structure the server must keep exactly in sync. Each insert adds one key to <em>every</em> index; each update of an indexed field removes the old key and inserts the new one. Insert the same 100,000 orders into a collection with only <code>_id</code> and one with five more indexes:</p>
${lenh('s04-1-idx', 9)}
${lenh('s04-1-idx', 10)}
<p>The five extra indexes made the same inserts clearly slower (the ratio wobbles between runs; it is always there) and the index storage several times larger — storage that wants to live in RAM next to your data (Lesson 1.4: the cache holds index pages too). That is why the answer to "should I index this field?" is never "index everything": index the fields your <em>frequent</em> queries filter and sort on, and nothing else. Lesson 4.5 shows how to find indexes nobody uses.</p>
${nguon('📘', 'Indexes — MongoDB Docs', 'B-tree indexes, default _id index, index use and cost', 'https://www.mongodb.com/docs/manual/indexes/')}
${nguon('📘', 'Index Builds on Populated Collections — MongoDB Docs', 'How createIndex works while the collection is in use', 'https://www.mongodb.com/docs/manual/core/index-creation/')}

<h3>Building an index on a live collection</h3>
<p>Since MongoDB 4.2 an index build holds an exclusive lock only briefly at the beginning and the end; in between, reads and writes continue. It is still heavy work: it scans the whole collection and sorts the keys (here a second; on a 500 GB collection, hours, with extra disk and memory use). On a replica set the build runs on the members at the same time, and the primary commits the index only when the <em>commit quorum</em> (by default every voting, data-bearing member) has finished. In a company you will hear "build indexes outside peak hours" and "create the index before deploying the code that needs it" — both come from these facts.</p>

<p>If you have taken the PostgreSQL course, the ideas are the same — B-tree, sequential scan vs index scan, write cost — and only the names differ (Seq Scan ≈ COLLSCAN, Index Scan ≈ IXSCAN + FETCH):</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — What an index is', sub: 'B-tree, Seq Scan vs Index Scan in PostgreSQL' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — judging an index by milliseconds on a small or warm dataset.</strong> On 2,000 orders a COLLSCAN takes 1 ms, so "it is fast enough" — and the same code takes 300 ms at a million. Milliseconds also lie on a busy laptop and after a query has warmed the cache. Look at the numbers that do not depend on the machine: <code>totalDocsExamined</code> and <code>totalKeysExamined</code> against <code>nReturned</code>. A query that examines 1,000,000 documents to return 23 is broken at any speed.</p>
</div>

<h3>💼 At work: the "page is slow" ticket</h3>
<p>A typical outsourcing ticket: "Customer order history takes 2–3 seconds since last month". The data grew; the code did not change. The first thing a senior will ask you is "what does explain say?" — not "did you add caching?". Copy the query from the log, run <code>explain("executionStats")</code> on a copy of production data, and paste the five numbers into the ticket: plan, keys, docs, returned, time. If it says COLLSCAN with 1,000,000 docs for 23 rows, the fix is an index plus a migration script that creates it — and the ticket has its proof before and after.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is the difference between COLLSCAN and IXSCAN?"</strong> — COLLSCAN reads every document; IXSCAN walks a sorted index within bounds, then FETCH reads only matching documents by RecordId.</li>
<li><strong>"What data structure is a MongoDB index?"</strong> — A B-tree (in WiredTiger) of sorted keys with record addresses; few levels even for millions of keys.</li>
<li><strong>"Why not index every field?"</strong> — Every index slows every insert and every update of its fields, takes disk and RAM; unused indexes are pure cost.</li>
<li><strong>"How do you know an index is used?"</strong> — <code>explain("executionStats")</code>: IXSCAN with the index name, keys and docs examined close to nReturned.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>db.don.find({ tinh: 'Huế', trangThai: 'NEW' }).explain('executionStats')</code>. Write down plan, docs examined, returned. Create an index on <code>tinh</code> alone and run it again. Then drop it and create one on <code>trangThai</code> alone. Which helps more, and why?</li>
<li>Find the orders with <code>_id</code> between 500,000 and 500,100. Which index is used, and how many keys are examined?</li>
<li>Measure how long <code>createIndex({ tong: 1 })</code> takes, then the size of that index compared with <code>khach_1</code>. Explain the difference.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Without index: COLLSCAN, 1,000,000 docs, 1,669 returned. With <code>{ tinh: 1 }</code>: IXSCAN over a sixth of the collection (167,223 keys and docs) — only 6 provinces, so each value matches many orders (low <em>selectivity</em>). With <code>{ trangThai: 1 }</code>: NEW is 1% of orders, so 9,909 keys and docs — much better. An index helps in proportion to how much it narrows the search; Lesson 4.3 combines both fields.</p>
<p>2. <code>_id_</code>, IXSCAN with bounds <code>[500000, 500100]</code>: 101 keys, 101 docs, 101 returned. Every collection already has this index.</p>
<p>3. One to two seconds. In our run <code>tong_1</code> was about 6 MB, <em>smaller</em> than <code>khach_1</code> (about 11 MB) and much smaller than <code>_id_</code> (about 29 MB) — all three have a million entries. Totals are small integers with only ~20,000 distinct values, each repeated about 50 times, so many neighbouring keys are identical and compress well; customer codes are 7-character strings; every <code>_id</code> is different. Size follows key length and repetition. Drop it afterwards: <code>db.don.dropIndex('tong_1')</code>.</p>
</details>
<p><strong>Done when:</strong> you can read the five numbers of an explain and say whether an index is missing.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Index', 'A separate sorted structure of key values with record addresses, kept in sync with the collection on every write.'],
  ['COLLSCAN', 'Collection scan: the plan reads every document.'],
  ['IXSCAN', 'Index scan: the plan walks the index within bounds.'],
  ['FETCH', 'Reads the full document for each index entry, by RecordId.'],
  ['B-tree', 'Balanced tree of pages; sorted keys in the leaves; a few levels for millions of keys.'],
  ['RecordId', 'The internal address of a document in the collection\'s storage file.'],
  ['Index bounds', 'The key ranges the IXSCAN reads, e.g. ["KH01234", "KH01234"].'],
  ['Selectivity', 'How much a condition narrows the result; a field with few distinct values is not selective.'],
  ['Prefix compression', 'WiredTiger stores the shared beginning of consecutive keys once, so index size depends on the values.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Without an index: COLLSCAN examined 1,000,000 documents to return 23.</li>
<li>With <code>{ khach: 1 }</code>: IXSCAN + FETCH, 23 keys, 23 docs, 23 returned; more than a hundred times faster.</li>
<li>An index is a B-tree of sorted keys + RecordIds — it also provides sort order and cheap ranges.</li>
<li>Every index slows writes and takes disk and RAM; index what frequent queries need.</li>
<li>Judge with keys / docs examined vs nReturned, not with milliseconds on small data.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Index hoạt động thế nào: COLLSCAN với IXSCAN, đo thật</h2>
<p class="lead">Chương 3 quyết định hình dạng tài liệu của bạn. Chương này quyết định bạn tìm ra chúng nhanh tới đâu. Với 50 tài liệu thử thì truy vấn nào cũng tức thì, nên chẳng ai thấy thiếu index — cho tới khi collection có một triệu tài liệu và trang lịch sử đơn tốn một phần ba giây cho mỗi lượt gọi, lượt nào cũng thế. Trong bài này bạn nạp một triệu đơn hàng, chạy cùng một truy vấn khi có và khi không có index, rồi xem chính xác máy chủ đã làm khác đi những gì.</p>

<h3>Hình ảnh đời thường: danh bạ điện thoại và phần tra cứu cuối sách</h3>
<p>Tìm mọi trang nhắc tới "giao dịch" trong một cuốn giáo trình 600 trang mà không có phần tra cứu thì phải đọc cả 600 trang. Phần tra cứu cuối sách là một <em>danh sách riêng, đã sắp xếp</em>: "giao dịch … 212, 340, 341". Bạn tìm ra từ đó trong vài giây vì danh sách xếp theo vần, rồi lật thẳng tới các trang. Từ đó có hai hệ quả, và cả hai đều đúng với index của cơ sở dữ liệu: phần tra cứu tốn giấy (dung lượng), và mỗi lần tác giả thêm một trang thì phần tra cứu cũng phải sửa theo (ghi chậm hơn).</p>

<h3>Một triệu đơn hàng</h3>
<p>Tệp lab <code>_demo/don-trieu.js</code> sinh 1.000.000 đơn hàng một cách tất định (cùng hạt giống, máy bạn ra đúng dữ liệu này) vào database <code>ch4</code>, collection <code>don</code>: mã khách (<code>khach</code>, 50.000 khách), trạng thái (<code>trangThai</code>, lệch như cửa hàng thật — 55% đã giao, 1% mới), tỉnh, tổng tiền VND, ngày trong 2025–2026 và 1–3 món hàng. Chạy chưa tới một phút.</p>
${lenh('s04-1-idx', 0)}
${lenh('s04-1-idx', 1)}
${lenh('s04-1-idx', 2)}
<p>164 MB dữ liệu, 172 byte mỗi đơn, và chỉ một index: <code>_id_</code>, thứ MongoDB luôn tự tạo.</p>

<h3>Không có index: COLLSCAN</h3>
<p>Trang lịch sử đơn hỏi mọi đơn của một khách. Hỏi máy chủ xem nó đã chạy truy vấn thế nào bằng <code>explain("executionStats")</code> (Bài 4.2 đọc kỹ; ở đây ta giữ năm con số):</p>
${lenh('s04-1-idx', 3)}
<p><strong>COLLSCAN</strong> — quét cả collection: máy chủ đọc cả 1.000.000 tài liệu (<code>totalDocsExamined</code>) để trả về 23 (<code>nReturned</code>). Nó không có lựa chọn nào khác: chẳng có gì cho nó biết đơn của KH01234 nằm ở đâu, nên phải nhìn từng đơn một. Hàng trăm mili giây cho 23 dòng, và cái giá tăng theo cỡ collection — tới 10 triệu đơn thì tệ gấp mười, trong khi câu trả lời vẫn là 23 dòng.</p>

<h3>Có index: IXSCAN + FETCH</h3>
${lenh('s04-1-idx', 4)}
${lenh('s04-1-idx', 5)}
<p>Giờ kế hoạch có hai tầng: <strong>IXSCAN</strong> đi trên index <code>khach_1</code> chỉ trong khoảng <code>["KH01234", "KH01234"]</code> và tìm thấy 23 khoá; <strong>FETCH</strong> dùng địa chỉ bản ghi lưu kèm mỗi khoá để đọc đúng 23 tài liệu đó. 23 khoá, 23 tài liệu, trả 23 — tỉ lệ lý tưởng, 1 : 1 : 1. Chạy cho nhiều khách để thấy khác biệt mà không vướng phần tốn của explain:</p>
${lenh('s04-1-idx', 6)}
<p>Cùng hai mươi câu hỏi, có index thì nhanh hơn cả trăm lần (hệ số chính xác đổi theo lần chạy trên một máy đang bận; bậc độ lớn thì không). Bản thân việc tạo index cho một triệu tài liệu tốn chừng một giây — chi phí trả một lần.</p>

<h3>Bên trong: một B-tree của các khoá đã sắp</h3>
<p>Index của MongoDB (trong WiredTiger) là một <strong>B-tree</strong>: cây cân bằng gồm các trang. Trang lá chứa mọi khoá <em>theo thứ tự đã sắp</em>, mỗi khoá kèm một <strong>RecordId</strong> — địa chỉ của tài liệu trong tệp riêng của collection. Các trang phía trên chỉ chứa vạch phân cách kiểu "khoá từ KH01200 tới KH01299 nằm dưới nhánh này". Tìm một khoá là đọc mỗi tầng một trang, và vì mỗi trang chứa hàng trăm khoá nên một triệu khoá chỉ cần ba bốn tầng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">trang gốc</span><span class="lz-t">… KH00000 | KH25000 | KH50000</span><span class="lz-d">chọn nhánh chứa KH01234</span></div>
  <div class="lz-step"><span class="lz-k">trang giữa</span><span class="lz-t">… KH01000 | KH01200 | KH01300 …</span><span class="lz-d">xuống thêm một bậc</span></div>
  <div class="lz-step"><span class="lz-k">trang lá</span><span class="lz-t">(KH01234, rid 51) (KH01234, rid 913) … 23 mục</span><span class="lz-d">khoá đã sắp, mỗi khoá một RecordId</span></div>
  <div class="lz-step"><span class="lz-k">FETCH</span><span class="lz-t">đọc 23 tài liệu theo RecordId</span><span class="lz-d">từ tệp của collection</span></div>
</div>
<p>Vì trang lá đã sắp xếp, index cho bạn luôn cả <em>thứ tự</em> mà không tốn gì thêm. Đọc collection qua index thì tài liệu ra theo thứ tự khoá:</p>
${lenh('s04-1-idx', 7)}
<p>Tính chất đó là chìa khoá của Bài 4.3: index khớp với <code>sort()</code> nghĩa là máy chủ không bao giờ phải sắp xếp trong bộ nhớ. Trang lá đã sắp cũng làm truy vấn theo khoảng rẻ (<code>{ khach: { $gte: 'KH01000', $lt: 'KH02000' } }</code> đi qua một lát liền nhau) — và cả regex có neo đầu chuỗi (Bài 4.6).</p>
${lenh('s04-1-idx', 8)}
<p>Index <code>_id</code> to hơn <code>khach_1</code> dù cả hai đều có một triệu mục. WiredTiger nén trang index bằng <em>nén tiền tố</em>: các khoá liền nhau có chung phần đầu ("KH0123…") chỉ lưu phần chung một lần. 50.000 mã khách mỗi mã lặp 20 lần và chung tiền tố dài; còn các <code>_id</code> số nguyên thì cái nào cũng khác. Nhớ điều này khi đoán cỡ index: nó phụ thuộc vào giá trị, không chỉ vào số lượng.</p>

<h3>Cái giá: mỗi lệnh ghi phải sửa mọi index</h3>
<p>Index là một cấu trúc dữ liệu thứ hai mà máy chủ phải giữ khớp tuyệt đối. Mỗi lệnh chèn thêm một khoá vào <em>mọi</em> index; mỗi lệnh cập nhật trường có index phải xoá khoá cũ rồi chèn khoá mới. Chèn cùng 100.000 đơn vào một collection chỉ có <code>_id</code> và một collection có thêm năm index:</p>
${lenh('s04-1-idx', 9)}
${lenh('s04-1-idx', 10)}
<p>Năm index thêm làm cùng các lệnh chèn chậm đi rõ rệt (tỉ lệ dao động giữa các lần chạy; lúc nào cũng có) và dung lượng index lớn gấp mấy lần — dung lượng muốn nằm trong RAM cạnh dữ liệu của bạn (Bài 1.4: cache giữ cả trang index). Vì thế câu trả lời cho "có nên đánh index trường này?" không bao giờ là "đánh hết": hãy đánh index những trường mà truy vấn <em>hay chạy</em> dùng để lọc và sắp xếp, ngoài ra thì thôi. Bài 4.5 chỉ cách tìm index không ai dùng.</p>
${nguon('📘', 'Indexes — MongoDB Docs', 'Index B-tree, index _id mặc định, cách dùng và cái giá của index', 'https://www.mongodb.com/docs/manual/indexes/')}
${nguon('📘', 'Index Builds on Populated Collections — MongoDB Docs', 'createIndex chạy thế nào khi collection đang được dùng', 'https://www.mongodb.com/docs/manual/core/index-creation/')}

<h3>Tạo index trên collection đang chạy</h3>
<p>Từ MongoDB 4.2, việc dựng index chỉ giữ khoá độc quyền trong thoáng chốc ở đầu và cuối; ở giữa, đọc và ghi vẫn tiếp tục. Dù vậy nó vẫn là việc nặng: quét cả collection và sắp xếp các khoá (ở đây một giây; với collection 500 GB là hàng giờ, tốn thêm đĩa và bộ nhớ). Trên replica set, việc dựng chạy cùng lúc trên các thành viên, và primary chỉ chốt index khi <em>commit quorum</em> (mặc định là mọi thành viên có quyền bầu và có dữ liệu) đã xong. Ở công ty bạn sẽ nghe "dựng index ngoài giờ cao điểm" và "tạo index trước khi triển khai mã cần nó" — cả hai đều xuất phát từ những điều này.</p>

<p>Nếu bạn đã học khoá PostgreSQL thì ý tưởng giống hệt — B-tree, quét tuần tự với quét index, cái giá khi ghi — chỉ khác tên gọi (Seq Scan ≈ COLLSCAN, Index Scan ≈ IXSCAN + FETCH):</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — Chỉ mục là gì', sub: 'B-tree, Seq Scan với Index Scan trong PostgreSQL' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đánh giá index bằng mili giây trên dữ liệu nhỏ hoặc đã nóng.</strong> Với 2.000 đơn, COLLSCAN tốn 1 ms, nên "vậy là đủ nhanh" — và cùng đoạn mã đó tốn 300 ms khi có một triệu đơn. Mili giây còn đánh lừa trên một máy laptop đang bận và sau khi truy vấn đã làm nóng cache. Hãy nhìn những con số không phụ thuộc vào máy: <code>totalDocsExamined</code> và <code>totalKeysExamined</code> so với <code>nReturned</code>. Một truy vấn xét 1.000.000 tài liệu để trả 23 là hỏng, dù nó chạy nhanh tới đâu.</p>
</div>

<h3>💼 Đi làm: phiếu "trang chạy chậm"</h3>
<p>Một phiếu điển hình ở công ty outsourcing: "Lịch sử đơn của khách mất 2–3 giây từ tháng trước". Dữ liệu lớn lên; mã thì không đổi. Điều đầu tiên một anh chị senior hỏi bạn là "explain nói gì?" — chứ không phải "em thêm cache chưa?". Chép truy vấn từ log, chạy <code>explain("executionStats")</code> trên bản sao dữ liệu production, rồi dán năm con số vào phiếu: kế hoạch, số khoá, số tài liệu, số trả về, thời gian. Nếu nó ghi COLLSCAN với 1.000.000 tài liệu cho 23 dòng, cách sửa là một index cộng kịch bản migration tạo index đó — và phiếu có bằng chứng trước và sau.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"COLLSCAN khác IXSCAN thế nào?"</strong> — COLLSCAN đọc mọi tài liệu; IXSCAN đi trên index đã sắp trong một khoảng, rồi FETCH chỉ đọc tài liệu khớp theo RecordId.</li>
<li><strong>"Index của MongoDB là cấu trúc dữ liệu gì?"</strong> — Một B-tree (trong WiredTiger) gồm khoá đã sắp kèm địa chỉ bản ghi; ít tầng kể cả với hàng triệu khoá.</li>
<li><strong>"Sao không đánh index mọi trường?"</strong> — Mỗi index làm chậm mọi lệnh chèn và mọi lệnh cập nhật trường của nó, tốn đĩa và RAM; index không dùng là chi phí thuần.</li>
<li><strong>"Làm sao biết index được dùng?"</strong> — <code>explain("executionStats")</code>: IXSCAN kèm tên index, số khoá và tài liệu đã xét gần bằng nReturned.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>db.don.find({ tinh: 'Huế', trangThai: 'NEW' }).explain('executionStats')</code>. Ghi lại kế hoạch, số tài liệu đã xét, số trả về. Tạo index chỉ trên <code>tinh</code> rồi chạy lại. Rồi xoá nó và tạo index chỉ trên <code>trangThai</code>. Cái nào giúp nhiều hơn, vì sao?</li>
<li>Tìm các đơn có <code>_id</code> từ 500.000 tới 500.100. Index nào được dùng, và xét bao nhiêu khoá?</li>
<li>Đo thời gian <code>createIndex({ tong: 1 })</code>, rồi so cỡ index đó với <code>khach_1</code>. Giải thích chênh lệch.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Không index: COLLSCAN, 1.000.000 tài liệu, trả 1.669. Với <code>{ tinh: 1 }</code>: IXSCAN qua một phần sáu collection (167.223 khoá và tài liệu) — chỉ có 6 tỉnh, nên mỗi giá trị khớp rất nhiều đơn (<em>độ chọn lọc</em> thấp). Với <code>{ trangThai: 1 }</code>: NEW chỉ chiếm 1% số đơn, nên 9.909 khoá và tài liệu — tốt hơn hẳn. Index giúp tỉ lệ với mức nó thu hẹp được vùng tìm; Bài 4.3 kết hợp cả hai trường.</p>
<p>2. <code>_id_</code>, IXSCAN trong khoảng <code>[500000, 500100]</code>: 101 khoá, 101 tài liệu, trả 101. Collection nào cũng có sẵn index này.</p>
<p>3. Một tới hai giây. Ở lần chạy của chúng tôi <code>tong_1</code> chừng 6 MB, <em>nhỏ hơn</em> <code>khach_1</code> (chừng 11 MB) và nhỏ hơn hẳn <code>_id_</code> (chừng 29 MB) — cả ba đều có một triệu mục. Tổng tiền là số nguyên nhỏ chỉ có ~20.000 giá trị khác nhau, mỗi giá trị lặp chừng 50 lần, nên nhiều khoá kề nhau giống hệt và nén tốt; mã khách là chuỗi 7 ký tự; còn <code>_id</code> thì cái nào cũng khác. Cỡ index đi theo độ dài khoá và mức lặp lại. Xong thì xoá: <code>db.don.dropIndex('tong_1')</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn đọc được năm con số của một explain và nói được có thiếu index hay không.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Index', 'Cấu trúc riêng chứa các giá trị khoá đã sắp kèm địa chỉ bản ghi, được giữ khớp với collection ở mọi lệnh ghi.'],
  ['COLLSCAN', 'Quét cả collection: kế hoạch đọc mọi tài liệu.'],
  ['IXSCAN', 'Quét index: kế hoạch đi trên index trong một khoảng.'],
  ['FETCH', 'Đọc tài liệu đầy đủ cho mỗi mục index, theo RecordId.'],
  ['B-tree', 'Cây cân bằng gồm các trang; khoá đã sắp nằm ở trang lá; vài tầng cho hàng triệu khoá.'],
  ['RecordId', 'Địa chỉ nội bộ của một tài liệu trong tệp lưu trữ của collection.'],
  ['Index bounds', 'Các khoảng khoá mà IXSCAN đọc, ví dụ ["KH01234", "KH01234"].'],
  ['Độ chọn lọc (selectivity)', 'Mức một điều kiện thu hẹp kết quả; trường có ít giá trị khác nhau thì chọn lọc kém.'],
  ['Nén tiền tố', 'WiredTiger lưu phần đầu chung của các khoá liền nhau một lần, nên cỡ index phụ thuộc vào giá trị.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có index: COLLSCAN xét 1.000.000 tài liệu để trả 23.</li>
<li>Có <code>{ khach: 1 }</code>: IXSCAN + FETCH, 23 khoá, 23 tài liệu, trả 23; nhanh hơn cả trăm lần.</li>
<li>Index là B-tree gồm khoá đã sắp + RecordId — cho luôn thứ tự sắp xếp và truy vấn khoảng rẻ.</li>
<li>Mỗi index làm chậm lệnh ghi, tốn đĩa và RAM; chỉ đánh index thứ truy vấn hay chạy cần.</li>
<li>Đánh giá bằng số khoá / tài liệu đã xét so với nReturned, không bằng mili giây trên dữ liệu nhỏ.</li>
</ul>
</div>
`,
};
