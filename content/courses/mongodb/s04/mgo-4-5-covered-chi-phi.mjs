/**
 * 4.5 — Truy vấn được phủ, cái giá của index và index thừa (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-5-phu'] (MongoDB 8.0.38, ch4.don + collection tạm c1/c5 xoá cuối kịch bản).
 * Số đối chiếu (tất định): KH01234 23 đơn; lấy cả tài liệu FETCH 23 docs; chiếu có _id vẫn FETCH; bỏ _id ⇒ PROJECTION_COVERED 0 docs;
 * thêm trường ngoài index ⇒ FETCH; COUNT_SCAN 14 đơn 0 docs; multikey không phủ (23 docs); $indexStats 3 index dùng / 3 index 0 lượt;
 * index { khach } thắng nhưng thừa cạnh { khach, ngay, tong }. ms đổi theo lần chạy (phủ nhanh hơn ~1/3 khi dữ liệu nóng; sửa trường
 * nằm trong 5 index chậm ~1,7× so với 1 index; sửa trường không index: như nhau).
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '4.5 — Covered queries, index cost and unused indexes|||4.5 — Truy vấn được phủ, cái giá của index và index thừa',
  slug: 'mgo-4-5-covered-chi-phi',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Truy vấn trả lời được chỉ bằng index — PROJECTION_COVERED, 0 tài liệu đọc — và ba thứ phá mất nó (_id trong phép chiếu, một trường ngoài index, trường mảng); đếm bằng COUNT_SCAN. Cái giá đo thật: sửa một trường nằm trong 5 index chậm hơn rõ so với 1 index, còn sửa trường không có index thì không; index chiếm RAM như dữ liệu. $indexStats để tìm index 0 lượt dùng, index trùng tiền tố, và quy trình gỡ index an toàn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Covered queries, index cost and unused indexes</h2>
<p class="lead">Every plan so far ended with FETCH: find keys in the index, then read the documents. If the index already contains every field the query needs, the second step is unnecessary — the query is <em>covered</em>. In this lesson you build a covered query, see the three small mistakes that silently break it, and then look at the other side of the ledger: what indexes cost, and how to find the ones that cost without paying back.</p>

<h3>An everyday picture: the receipt and the warehouse</h3>
<p>A customer asks "what did I buy and how much was it?". If the cashier's printed receipt list already shows date and total, the cashier answers from the list. If the customer also asks "which colour was it?", someone has to walk to the warehouse and open the box. A covered query answers from the list; FETCH is the walk to the warehouse.</p>

<h3>From FETCH to PROJECTION_COVERED</h3>
<p>The customer history screen shows date and total. Index <code>{ khach: 1, ngay: -1, tong: 1 }</code>, four versions of the same query:</p>
${lenh('s04-5-phu', 0)}
<ul>
<li><strong>Whole documents</strong>: FETCH 23 documents — of course.</li>
<li><strong>Projection <code>{ ngay, tong }</code></strong>: still FETCH 23. Why? <code>_id</code> is included by default in every projection, and <code>_id</code> is not in this index.</li>
<li><strong>Projection <code>{ _id: 0, ngay, tong }</code></strong>: <code>PROJECTION_COVERED ← IXSCAN</code>, <strong>0 documents examined</strong>. Everything was read from the index keys.</li>
<li><strong>Add one field that is not in the index</strong> (<code>tinh</code>): back to FETCH 23.</li>
</ul>
<p>Counting can be covered too — the server counts index keys without touching documents:</p>
${lenh('s04-5-phu', 1)}
<p><code>COUNT_SCAN</code>: 14 orders counted, 0 documents read. This is why "number of orders this year" on a profile page is cheap with the right index, and expensive with <code>countDocuments</code> over a COLLSCAN.</p>

<h3>How much faster is it?</h3>
${lenh('s04-5-phu', 2)}
<p>Two thousand customer pages, warm cache: the covered version was roughly a third faster. That is the honest number on a machine where all data is already in RAM — reading a document from cache is cheap. The gain becomes much larger when the documents are <em>not</em> in memory (a big collection whose working set exceeds RAM, Lesson 3.5): every FETCH may then be a disk read, while the index pages are small and stay cached. Covered queries are a tool for hot, frequent queries on large collections, not a goal for every query.</p>

<h3>Arrays cannot be covered</h3>
${lenh('s04-5-phu', 3)}
<p>Even with an index on <code>{ khach, items.sp }</code> and a projection of only <code>items.sp</code>, the plan reads all 23 documents. A multikey index stores one array element per key, so it cannot rebuild the array to return it. Other things that prevent covering: a field inside an embedded document that is matched as a whole, and projections that need computed values.</p>
${nguon('📘', 'Query Optimization: Covered Query — MongoDB Docs', 'Conditions for a covered query, PROJECTION_COVERED, multikey restriction', 'https://www.mongodb.com/docs/manual/core/query-optimization/')}

<h3>The cost of an index, measured on updates</h3>
<p>Lesson 4.1 measured inserts. Updates are more subtle: an update pays for an index only if it changes a field <em>in</em> that index. Two copies of 50,000 orders: <code>c1</code> has <code>khach</code> in one index, <code>c5</code> has <code>khach</code> in five. Change <code>khach</code> in all 50,000 documents, then change an unindexed field <code>ghiChu</code>:</p>
${lenh('s04-5-phu', 4)}
<p>Changing <code>khach</code>: clearly slower on <code>c5</code> (about 1.7 times here) — each of the five indexes has to delete the old key and insert the new one. Changing <code>ghiChu</code>: the same on both — no index contains it, so no index is touched. Practical rules: an index on a field that changes constantly (a counter, <code>lastSeenAt</code>, a status that moves every minute) costs on every one of those writes; an index on a field written once (customer code, creation date) costs almost nothing after the insert.</p>
${lenh('s04-5-phu', 5)}
<p>The other cost is memory. <code>c5</code> carries four times more index than <code>c1</code> for the same 9.9 MB of data; the million orders carry 81 MB of indexes next to 164 MB of data. WiredTiger keeps hot index pages in the cache with the data (Lesson 1.4). If data + indexes in regular use no longer fit in RAM, latency becomes unpredictable — Discord's story in Lesson 3.5 began exactly there. A useful habit: compare <code>db.collection.totalIndexSize()</code> of your biggest collections with the cache size.</p>

<h3>$indexStats: which indexes are actually used?</h3>
${lenh('s04-5-phu', 6)}
<p><code>$indexStats</code> reports, per index, how many operations used it since the server started (<code>accesses.ops</code>, and <code>accesses.since</code> for the starting time). Here three indexes were used (the 150,000 on <code>_id_</code> are the update filters) and three have 0 — candidates for removal. Read these numbers carefully: they reset at every restart and are per member of a replica set (a secondary used for reports has its own), and a monthly report that runs on the 1st will show 0 on the 20th. Look at a period long enough to include every job.</p>
${nguon('📘', '$indexStats — MongoDB Docs', 'accesses.ops and accesses.since per index, per member', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/indexStats/')}

<h3>Redundant prefixes</h3>
${lenh('s04-5-phu', 7)}
<p><code>{ khach: 1 }</code> next to <code>{ khach: 1, ngay: -1, tong: 1 }</code>: the planner even picked the small one for this query, and the compound index could have served it just as well (Lesson 4.3, prefixes). The single-field index is pure extra cost on every insert, and it adds one more candidate to every planner race (Lesson 4.2). Drop it. The same goes for an index that is the exact reverse direction of another single-field index.</p>

<h3>A safe procedure for removing an index</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · evidence</span><span class="lz-t">$indexStats on every member over a full business cycle</span><span class="lz-d">or: it is a prefix of another index</span></div>
  <div class="lz-step"><span class="lz-k">2 · search the code</span><span class="lz-t">hint() by name? reports, batch jobs, other services</span><span class="lz-d">a hint on a dropped index is an error</span></div>
  <div class="lz-step"><span class="lz-k">3 · hideIndex</span><span class="lz-t">invisible to the planner, still maintained</span><span class="lz-d">watch latency + slow log for days</span></div>
  <div class="lz-step"><span class="lz-k">4 · dropIndex</span><span class="lz-t">in a migration script, reviewed</span><span class="lz-d">keep the createIndex line to restore</span></div>
</div>

<p>PostgreSQL's equivalents are Index Only Scan (covered) and <code>pg_stat_user_indexes.idx_scan</code> (usage):</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-9-2-to-hop-covering', title: 'PostgreSQL 9.2 — Composite indexes & covering', sub: 'INCLUDE columns and Index Only Scan' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — "the projection is small, so the query is covered".</strong> A projection reduces what is sent over the network; it does not decide whether documents are read. The two most common reasons a "covered" query still fetches are the default <code>_id</code> and one extra field someone added to the API response months later. If a query is meant to be covered, put that in a test: assert that explain shows <code>totalDocsExamined: 0</code>.</p>
</div>

<h3>💼 At work: the index review before a release</h3>
<p>Before a release that adds a feature, a backend lead in an outsourcing team typically asks for three lines per collection touched: indexes added (with the query each one serves), indexes made redundant, and the size of indexes compared with the server's RAM. After the release, <code>$indexStats</code> from production confirms the new index is used. Projects that skip this end up, two years later, with fifteen indexes per collection, half unused, and writes twice as slow as necessary — and nobody dares to drop any of them. The hide-then-drop procedure is how you fix that without fear.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is a covered query?"</strong> — All filtered and returned fields are in one index and <code>_id</code> is excluded (or indexed); explain shows PROJECTION_COVERED and 0 documents examined.</li>
<li><strong>"Does every index slow down every update?"</strong> — No: an update pays for an index only if it changes a field in that index; inserts and deletes pay for all indexes.</li>
<li><strong>"How do you find unused indexes?"</strong> — <code>$indexStats</code> on each member over a full cycle, plus prefix redundancy; hide before dropping.</li>
<li><strong>"Why do indexes matter for RAM?"</strong> — Hot index pages live in the WiredTiger cache with data; when the working set exceeds RAM, reads go to disk.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Make <code>db.don.find({ trangThai: 'NEW', tinh: 'Huế' }, …).sort({ ngay: -1 })</code> covered for a screen that shows <code>_id</code>, date and total. Which index, and what projection?</li>
<li>Run <code>db.don.aggregate([{ $indexStats: {} }])</code> on your lab after this chapter's experiments. Which indexes would you hide first, and what would you check before dropping them?</li>
<li>Measure: insert 20,000 orders into a collection with only <code>_id</code>, then with a TTL index on <code>ngay</code> and a unique index on <code>{ khach: 1, ngay: 1 }</code>. Explain the difference you see.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>{ trangThai: 1, tinh: 1, ngay: -1, tong: 1, _id: 1 }</code> with projection <code>{ ngay: 1, tong: 1 }</code> (<code>_id</code> is returned by default and is now in the index). E, E, S, then the extra returned fields. Explain: PROJECTION_COVERED, 0 documents.</p>
<p>2. Every index with <code>accesses.ops</code> 0, and single-field indexes that are prefixes of compound ones. Before dropping: the same numbers on every member over a full business cycle (month-end jobs!), a search of all code for <code>hint</code> and for queries on those fields, then <code>hideIndex</code> and a few days of watching.</p>
<p>3. Slower with the two indexes: each insert adds two more keys, and the unique index must also check for an existing key before inserting. The TTL index additionally makes the background thread scan for expired documents every 60 seconds — and here, with dates in 2025–2026 and <code>expireAfterSeconds</code> small, it would start deleting your test data. Choose the value deliberately.</p>
</details>
<p><strong>Done when:</strong> you can make a query covered on purpose, prove it with explain, and name the indexes in your project you would remove and why.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Covered query', 'A query answered from index keys only: PROJECTION_COVERED, totalDocsExamined 0.'],
  ['PROJECTION_COVERED', 'The stage that builds results from index keys without FETCH.'],
  ['COUNT_SCAN', 'Counts index keys in a range without reading documents.'],
  ['Write amplification', 'One logical write causing several physical writes — one per affected index.'],
  ['$indexStats', 'Per-index usage counters since start-up, per member.'],
  ['Redundant index', 'An index whose job is already done by another, e.g. a prefix of a compound index.'],
  ['totalIndexSize()', 'Bytes of all indexes of a collection; compare with RAM / cache size.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Covered = filter and returned fields all in one index, <code>_id</code> excluded: 0 documents read.</li>
<li><code>_id</code> by default, one extra field, or an array field breaks covering.</li>
<li>Counting with the right index is a COUNT_SCAN, 0 documents.</li>
<li>Updates pay only for indexes containing the changed field (≈1.7× for 5 indexes vs 1 here); inserts pay for all.</li>
<li>Indexes compete with data for RAM; check sizes against the cache.</li>
<li>Find unused and redundant indexes with <code>$indexStats</code> and prefixes; hide, watch, then drop.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Truy vấn được phủ, cái giá của index và index thừa</h2>
<p class="lead">Mọi kế hoạch từ đầu chương đều kết thúc bằng FETCH: tìm khoá trong index, rồi đọc tài liệu. Nếu index đã chứa sẵn mọi trường truy vấn cần, bước thứ hai là thừa — truy vấn được <em>phủ</em> (covered). Trong bài này bạn dựng một truy vấn được phủ, thấy ba lỗi nhỏ âm thầm phá mất nó, rồi nhìn sang mặt bên kia của sổ sách: index tốn những gì, và làm sao tìm những index chỉ tốn mà không đem lại gì.</p>

<h3>Hình ảnh đời thường: tờ hoá đơn và cái kho</h3>
<p>Khách hỏi "tôi đã mua gì, hết bao nhiêu?". Nếu danh sách hoá đơn in sẵn của thu ngân đã có ngày và tổng tiền, thu ngân trả lời ngay từ danh sách. Nếu khách hỏi thêm "món đó màu gì?", phải có người đi xuống kho mở hộp. Truy vấn được phủ trả lời từ danh sách; FETCH là chuyến đi xuống kho.</p>

<h3>Từ FETCH tới PROJECTION_COVERED</h3>
<p>Màn hình lịch sử của khách hiện ngày và tổng tiền. Index <code>{ khach: 1, ngay: -1, tong: 1 }</code>, bốn phiên bản của cùng một truy vấn:</p>
${lenh('s04-5-phu', 0)}
<ul>
<li><strong>Lấy cả tài liệu</strong>: FETCH 23 tài liệu — dĩ nhiên.</li>
<li><strong>Chiếu <code>{ ngay, tong }</code></strong>: vẫn FETCH 23. Vì sao? <code>_id</code> mặc định có mặt trong mọi phép chiếu, mà <code>_id</code> không nằm trong index này.</li>
<li><strong>Chiếu <code>{ _id: 0, ngay, tong }</code></strong>: <code>PROJECTION_COVERED ← IXSCAN</code>, <strong>đọc 0 tài liệu</strong>. Mọi thứ được đọc từ khoá index.</li>
<li><strong>Thêm một trường không nằm trong index</strong> (<code>tinh</code>): quay về FETCH 23.</li>
</ul>
<p>Đếm cũng được phủ — máy chủ đếm khoá index mà không đụng tới tài liệu:</p>
${lenh('s04-5-phu', 1)}
<p><code>COUNT_SCAN</code>: đếm được 14 đơn, đọc 0 tài liệu. Vì thế "số đơn trong năm nay" trên trang hồ sơ thì rẻ khi có đúng index, và đắt khi <code>countDocuments</code> chạy trên một COLLSCAN.</p>

<h3>Nhanh hơn bao nhiêu?</h3>
${lenh('s04-5-phu', 2)}
<p>Hai nghìn trang khách, cache đã nóng: bản được phủ nhanh hơn chừng một phần ba. Đó là con số trung thực trên một máy mà dữ liệu đã nằm hết trong RAM — đọc tài liệu từ cache thì rẻ. Mức lợi lớn hơn nhiều khi tài liệu <em>không</em> nằm trong bộ nhớ (collection lớn có working set vượt RAM, Bài 3.5): khi đó mỗi FETCH có thể là một lần đọc đĩa, còn trang index nhỏ và ở lại trong cache. Truy vấn được phủ là công cụ cho các truy vấn nóng, chạy thường xuyên trên collection lớn, không phải mục tiêu cho mọi truy vấn.</p>

<h3>Mảng không phủ được</h3>
${lenh('s04-5-phu', 3)}
<p>Kể cả có index trên <code>{ khach, items.sp }</code> và chỉ chiếu <code>items.sp</code>, kế hoạch vẫn đọc cả 23 tài liệu. Index multikey mỗi khoá chỉ lưu một phần tử mảng, nên không dựng lại được mảng để trả về. Những thứ khác cũng ngăn việc phủ: một trường trong tài liệu nhúng mà được so khớp nguyên khối, và phép chiếu cần giá trị tính toán.</p>
${nguon('📘', 'Query Optimization: Covered Query — MongoDB Docs', 'Điều kiện để truy vấn được phủ, PROJECTION_COVERED, giới hạn multikey', 'https://www.mongodb.com/docs/manual/core/query-optimization/')}

<h3>Cái giá của index, đo trên lệnh cập nhật</h3>
<p>Bài 4.1 đã đo lệnh chèn. Lệnh cập nhật tinh tế hơn: nó chỉ trả giá cho một index nếu nó đổi một trường <em>nằm trong</em> index đó. Hai bản sao 50.000 đơn: <code>c1</code> có <code>khach</code> nằm trong một index, <code>c5</code> có <code>khach</code> nằm trong năm index. Đổi <code>khach</code> ở cả 50.000 tài liệu, rồi đổi một trường không có index là <code>ghiChu</code>:</p>
${lenh('s04-5-phu', 4)}
<p>Đổi <code>khach</code>: <code>c5</code> chậm hơn rõ (ở đây chừng 1,7 lần) — mỗi index trong năm cái phải xoá khoá cũ và chèn khoá mới. Đổi <code>ghiChu</code>: hai bên như nhau — không index nào chứa nó, nên không index nào bị đụng tới. Luật thực tế: index trên trường đổi liên tục (bộ đếm, <code>lastSeenAt</code>, trạng thái đổi từng phút) tốn ở mỗi lệnh ghi đó; index trên trường ghi một lần (mã khách, ngày tạo) gần như không tốn gì sau lệnh chèn.</p>
${lenh('s04-5-phu', 5)}
<p>Cái giá còn lại là bộ nhớ. <code>c5</code> mang lượng index gấp bốn <code>c1</code> cho cùng 9,9 MB dữ liệu; một triệu đơn mang 81 MB index bên cạnh 164 MB dữ liệu. WiredTiger giữ các trang index nóng trong cache cùng dữ liệu (Bài 1.4). Nếu dữ liệu + index thường dùng không còn vừa RAM, độ trễ trở nên khó lường — câu chuyện Discord ở Bài 3.5 bắt đầu đúng từ đó. Một thói quen có ích: so <code>db.collection.totalIndexSize()</code> của các collection lớn nhất với cỡ cache.</p>

<h3>$indexStats: index nào thực sự được dùng?</h3>
${lenh('s04-5-phu', 6)}
<p><code>$indexStats</code> báo cho từng index số thao tác đã dùng nó từ khi máy chủ khởi động (<code>accesses.ops</code>, và <code>accesses.since</code> là thời điểm bắt đầu đếm). Ở đây ba index được dùng (150.000 lượt trên <code>_id_</code> là bộ lọc của các lệnh cập nhật) và ba index có 0 — ứng viên để gỡ. Đọc các con số này cho cẩn thận: chúng đặt lại về 0 mỗi lần khởi động lại và tính riêng cho từng thành viên của replica set (một secondary dùng cho báo cáo có số riêng của nó), và một báo cáo hằng tháng chạy ngày mùng 1 thì tới ngày 20 sẽ hiện 0. Hãy nhìn một khoảng thời gian đủ dài để bao hết mọi công việc định kỳ.</p>
${nguon('📘', '$indexStats — MongoDB Docs', 'accesses.ops và accesses.since cho từng index, từng thành viên', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/indexStats/')}

<h3>Tiền tố thừa</h3>
${lenh('s04-5-phu', 7)}
<p><code>{ khach: 1 }</code> bên cạnh <code>{ khach: 1, ngay: -1, tong: 1 }</code>: bộ lập kế hoạch còn chọn cái nhỏ cho truy vấn này, trong khi index phức hợp phục vụ cũng tốt y như vậy (Bài 4.3, tiền tố). Index một trường là chi phí thừa ở mọi lệnh chèn, và nó thêm một ứng viên vào mọi cuộc đua của bộ lập kế hoạch (Bài 4.2). Hãy xoá nó. Tương tự với một index chỉ là chiều ngược lại của một index một trường khác.</p>

<h3>Quy trình gỡ index an toàn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · bằng chứng</span><span class="lz-t">$indexStats trên mọi thành viên qua trọn một chu kỳ nghiệp vụ</span><span class="lz-d">hoặc: nó là tiền tố của index khác</span></div>
  <div class="lz-step"><span class="lz-k">2 · tìm trong mã</span><span class="lz-t">hint() theo tên? báo cáo, việc chạy lô, dịch vụ khác</span><span class="lz-d">hint vào index đã xoá là lỗi</span></div>
  <div class="lz-step"><span class="lz-k">3 · hideIndex</span><span class="lz-t">vô hình với bộ lập kế hoạch, vẫn được cập nhật</span><span class="lz-d">theo dõi độ trễ + log chậm vài ngày</span></div>
  <div class="lz-step"><span class="lz-k">4 · dropIndex</span><span class="lz-t">trong kịch bản migration có review</span><span class="lz-d">giữ dòng createIndex để khôi phục</span></div>
</div>

<p>Bản tương đương của PostgreSQL là Index Only Scan (được phủ) và <code>pg_stat_user_indexes.idx_scan</code> (mức sử dụng):</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-9-2-to-hop-covering', title: 'PostgreSQL 9.2 — Chỉ mục tổ hợp và covering', sub: 'Cột INCLUDE và Index Only Scan' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "phép chiếu nhỏ, vậy truy vấn được phủ".</strong> Phép chiếu giảm thứ được gửi qua mạng; nó không quyết định có đọc tài liệu hay không. Hai lý do hay gặp nhất khiến một truy vấn "được phủ" vẫn FETCH là <code>_id</code> mặc định và một trường thêm mà ai đó gắn vào phản hồi API vài tháng sau. Nếu một truy vấn cần được phủ, hãy viết thành test: khẳng định explain cho <code>totalDocsExamined: 0</code>.</p>
</div>

<h3>💼 Đi làm: duyệt index trước mỗi bản phát hành</h3>
<p>Trước một bản phát hành có thêm tính năng, trưởng nhóm backend ở một công ty outsourcing thường yêu cầu ba dòng cho mỗi collection bị đụng tới: index thêm vào (kèm truy vấn mỗi cái phục vụ), index trở nên thừa, và cỡ index so với RAM của máy chủ. Sau khi phát hành, <code>$indexStats</code> lấy từ production xác nhận index mới có được dùng. Dự án nào bỏ qua bước này, hai năm sau sẽ có mười lăm index mỗi collection, một nửa không dùng, lệnh ghi chậm gấp đôi mức cần thiết — và chẳng ai dám xoá cái nào. Quy trình ẩn-rồi-xoá là cách sửa chuyện đó mà không phải sợ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Truy vấn được phủ là gì?"</strong> — Mọi trường lọc và trả về đều nằm trong một index và <code>_id</code> bị loại (hoặc có trong index); explain cho PROJECTION_COVERED và đọc 0 tài liệu.</li>
<li><strong>"Index nào cũng làm chậm mọi lệnh cập nhật?"</strong> — Không: lệnh cập nhật chỉ trả giá cho index nếu nó đổi một trường trong index đó; lệnh chèn và xoá thì trả cho mọi index.</li>
<li><strong>"Bạn tìm index không dùng thế nào?"</strong> — <code>$indexStats</code> trên từng thành viên qua trọn một chu kỳ, cộng tiền tố thừa; ẩn trước khi xoá.</li>
<li><strong>"Vì sao index quan trọng với RAM?"</strong> — Trang index nóng nằm trong cache WiredTiger cùng dữ liệu; khi working set vượt RAM, lệnh đọc phải xuống đĩa.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Làm cho <code>db.don.find({ trangThai: 'NEW', tinh: 'Huế' }, …).sort({ ngay: -1 })</code> được phủ cho một màn hình hiện <code>_id</code>, ngày và tổng tiền. Index nào, phép chiếu nào?</li>
<li>Chạy <code>db.don.aggregate([{ $indexStats: {} }])</code> trên lab của bạn sau các thí nghiệm của chương. Bạn sẽ ẩn index nào trước, và phải kiểm gì trước khi xoá chúng?</li>
<li>Đo: chèn 20.000 đơn vào một collection chỉ có <code>_id</code>, rồi vào một collection có thêm index TTL trên <code>ngay</code> và index unique trên <code>{ khach: 1, ngay: 1 }</code>. Giải thích chênh lệch bạn thấy.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>{ trangThai: 1, tinh: 1, ngay: -1, tong: 1, _id: 1 }</code> với phép chiếu <code>{ ngay: 1, tong: 1 }</code> (<code>_id</code> được trả về mặc định và giờ đã nằm trong index). E, E, S, rồi các trường trả về thêm. Explain: PROJECTION_COVERED, 0 tài liệu.</p>
<p>2. Mọi index có <code>accesses.ops</code> bằng 0, và các index một trường là tiền tố của index phức hợp. Trước khi xoá: cùng các con số đó trên mọi thành viên qua trọn một chu kỳ nghiệp vụ (việc cuối tháng!), tìm khắp mã xem có <code>hint</code> và có truy vấn trên các trường đó không, rồi <code>hideIndex</code> và theo dõi vài ngày.</p>
<p>3. Chậm hơn khi có hai index: mỗi lệnh chèn thêm hai khoá, và index unique còn phải kiểm khoá đã tồn tại chưa trước khi chèn. Index TTL còn khiến luồng nền quét tài liệu hết hạn mỗi 60 giây — và ở đây, với ngày trong 2025–2026 và <code>expireAfterSeconds</code> nhỏ, nó sẽ bắt đầu xoá dữ liệu thử của bạn. Hãy chọn giá trị có chủ đích.</p>
</details>
<p><strong>Xong khi:</strong> bạn chủ động làm được một truy vấn được phủ, chứng minh bằng explain, và gọi tên được các index trong dự án của bạn mà bạn sẽ gỡ, kèm lý do.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Truy vấn được phủ (covered)', 'Truy vấn được trả lời chỉ bằng khoá index: PROJECTION_COVERED, totalDocsExamined 0.'],
  ['PROJECTION_COVERED', 'Tầng dựng kết quả từ khoá index mà không cần FETCH.'],
  ['COUNT_SCAN', 'Đếm khoá index trong một khoảng mà không đọc tài liệu.'],
  ['Khuếch đại ghi (write amplification)', 'Một lệnh ghi logic gây ra nhiều lần ghi vật lý — mỗi index bị ảnh hưởng một lần.'],
  ['$indexStats', 'Bộ đếm lượt dùng của từng index từ khi khởi động, tính theo từng thành viên.'],
  ['Index thừa', 'Index mà việc của nó đã có index khác làm, ví dụ tiền tố của một index phức hợp.'],
  ['totalIndexSize()', 'Số byte của mọi index của một collection; so với RAM / cỡ cache.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Được phủ = trường lọc và trường trả về đều trong một index, loại <code>_id</code>: đọc 0 tài liệu.</li>
<li><code>_id</code> mặc định, một trường thêm, hay một trường mảng là phá mất việc phủ.</li>
<li>Đếm có đúng index là COUNT_SCAN, 0 tài liệu.</li>
<li>Lệnh cập nhật chỉ trả giá cho index chứa trường bị đổi (ở đây 5 index ≈ 1,7× so với 1); lệnh chèn trả cho tất cả.</li>
<li>Index tranh RAM với dữ liệu; hãy so cỡ index với cache.</li>
<li>Tìm index không dùng và index thừa bằng <code>$indexStats</code> và tiền tố; ẩn, theo dõi, rồi mới xoá.</li>
</ul>
</div>
`,
};
