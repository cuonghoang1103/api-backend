/**
 * 4.3 — Index phức hợp và luật ESR (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-3-esr'] (MongoDB 8.0.38, ch4.don 1.000.000 đơn).
 * Số đối chiếu (tất định): PAID & tong ≥ 10 triệu = 125575 đơn; trang đầu 20 đơn: E-R-S 125575 khoá + SORT, E-S-R 42 khoá không SORT,
 * R-E-S 145272 khoá; trang 500: ERS 125575 / ESR 20216 khoá; sort cả collection 263,6 MB > 100 MB ⇒ tràn đĩa 3 lần, allowDiskUse(false) ⇒
 * QueryExceededMemoryLimitNoDiskUseAllowed; tiền tố: chỉ trangThai 9909, trangThai+ngay 438, chỉ ngay COLLSCAN; $in ⇒ SORT_MERGE 21 khoá;
 * ngoại lệ tong ≥ 19,99 triệu: ERS 136 khoá vs ESR 30122, planner chọn ERS. ms đổi theo lần chạy.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '4.3 — Compound indexes and the ESR rule|||4.3 — Index phức hợp và luật ESR',
  slug: 'mgo-4-3-compound-esr',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Cùng ba trường, ba thứ tự index, kết quả khác nhau cả nghìn lần: màn hình "đơn đã thanh toán từ 10 triệu, mới nhất trước" với index Equality–Sort–Range chỉ xét 42 khoá, với Equality–Range–Sort xét 125.575 khoá rồi sắp, với Range đứng đầu xét 145.272. Tiền tố của index, chiều sắp xếp, $in và SORT_MERGE, giới hạn 100 MB của sắp xếp trong bộ nhớ (tràn đĩa thật), và khi nào ESR không còn đúng (khoảng rất chọn lọc: 136 khoá với 30.122).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Compound indexes and the ESR rule</h2>
<p class="lead">Real screens filter on several fields and sort on another one. A compound index can serve all of that in one walk — but only if its fields are in the right order. In this lesson the same three fields in three different orders give results that differ by a factor of three thousand, and you will learn the rule that picks the right order nearly every time: Equality, Sort, Range.</p>

<h3>An everyday picture: a phone book sorted by city, then surname, then first name</h3>
<p>A paper phone book sorted by (city, surname, first name) makes "everyone named Nguyễn in Huế" easy: open at Huế, then at Nguyễn, read a contiguous block. "Everyone named An in any city" is hopeless: first names are sorted only <em>inside</em> each (city, surname) block, so you would have to read the whole book. A compound index is that book. Its order decides which questions are cheap.</p>

<h3>The screen: paid orders of 10 million VND or more, newest first</h3>
<p>The accountant's screen: status = PAID (<strong>E</strong>quality), total ≥ 10,000,000 (<strong>R</strong>ange), sorted by date descending (<strong>S</strong>ort), 20 per page.</p>
${lenh('s04-3-esr', 0)}
<p>125,575 orders match. Create three compound indexes on the same three fields in different orders and force each one with <code>hint()</code>, then let the planner choose:</p>
${lenh('s04-3-esr', 1)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">E–R–S { trangThai, tong, ngay }</span><span class="lz-t">125,575 keys + SORT</span><span class="lz-d">range first breaks date order</span></div>
  <div class="lz-step"><span class="lz-k">E–S–R { trangThai, ngay, tong }</span><span class="lz-t">42 keys, no SORT</span><span class="lz-d">walk PAID by date, check tong in the key, stop at 20</span></div>
  <div class="lz-step"><span class="lz-k">R–E–S { tong, trangThai, ngay }</span><span class="lz-t">145,272 keys + SORT</span><span class="lz-d">range on the first field: one block per total value</span></div>
</div>
<p>Why the difference? With <strong>E–S–R</strong> the index contains, for PAID, every order <em>already sorted by date</em>, each key carrying its <code>tong</code>. The server walks from the newest PAID key, checks <code>tong ≥ 10,000,000</code> inside the key itself (no document read), and stops as soon as it has 20 matches: 42 keys, 20 documents, no SORT stage, about 0 ms. With <strong>E–R–S</strong> the PAID block is sorted by total first, so the date order is scattered across 125,575 keys: all of them must be read and sorted before the first 20 are known (MongoDB 8.0 at least sorts the <em>keys</em> before fetching, so only 20 documents are read — but 125,575 keys are still examined). With the range first (<strong>R–E–S</strong>) it is worse again: the index is split into thousands of total values, each with its own status and date block. And the planner, left alone, picked E–S–R.</p>
${nguon('📘', 'The ESR (Equality, Sort, Range) Guideline — MongoDB Docs', 'Order compound index fields: equality, then sort, then range', 'https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/')}

<h3>The rule, and why it works</h3>
<ul>
<li><strong>Equality first</strong>: exact matches (<code>status = PAID</code>) cut the index down to one contiguous block. Several equality fields can be in any order among themselves.</li>
<li><strong>Sort next</strong>: inside that block, the keys are then already in the order you need, so there is no in-memory sort and a <code>limit</code> can stop early.</li>
<li><strong>Range last</strong>: <code>$gt</code>, <code>$lt</code>, <code>$gte</code>, <code>$ne</code>, regexes — checked on the keys being walked. Put a range before the sort field and the sort order is destroyed.</li>
</ul>

<h3>Deep pages: ESR still has to walk</h3>
${lenh('s04-3-esr', 2)}
<p>Page 500 (<code>skip(9980)</code>) costs ESR 20,216 keys — it must walk past everything before the page — but still no sort; ERS stays at 125,575 keys plus a sort. Lesson 2.6 showed the full fix for deep pages: keyset pagination (<code>ngay &lt; last seen</code>), which turns every page into a "first page".</p>

<h3>What a SORT without an index costs: 100 MB, then disk</h3>
${lenh('s04-3-esr', 3)}
${lenh('s04-3-esr', 4)}
<p>Sorting the whole collection by a key no index provides: 263.6 MB of data to sort, a memory limit of 100 MB per sort, so the server <strong>spilled</strong> to temporary files on disk three times (<code>usedDisk: true</code>). Since MongoDB 6.0 <code>allowDiskUse</code> is on by default, so the query still succeeds — slowly, and using disk space. Turn it off and the same query fails with <code>QueryExceededMemoryLimitNoDiskUseAllowed</code>, which is what you will see in older drivers' code or with <code>allowDiskUseByDefault</code> disabled. An in-memory sort over a large set is a red flag even when it "works".</p>

<h3>Prefixes: which queries can one compound index serve?</h3>
${lenh('s04-3-esr', 5)}
<p>An index <code>{ trangThai, ngay, tong }</code> is sorted first by status. It can serve any query on a <strong>prefix</strong> — <code>trangThai</code> alone (9,909 keys for NEW), or <code>trangThai</code> + <code>ngay</code> (438 keys) — but not a query on <code>ngay</code> alone: dates are sorted only inside each status block, so that query was a COLLSCAN of 1,000,000 documents, exactly the phone book problem. A query on <code>trangThai</code> + <code>tong</code> (skipping the middle field) can still use the index — bounds on status, <code>tong</code> checked on every key of the status block (9,910 keys for NEW, no document matched so 0 documents read). Practical consequence: an index <code>{ a: 1 }</code> is redundant when <code>{ a: 1, b: 1 }</code> exists; drop it (Lesson 4.5).</p>

<h3>Sort direction</h3>
${lenh('s04-3-esr', 6)}
<p>A single index can be walked forwards or backwards, so <code>{ trangThai: 1, ngay: -1 }</code> serves <code>sort({ ngay: -1 })</code> and <code>sort({ ngay: 1 })</code> after an equality on status, and <code>sort({ trangThai: -1, ngay: 1 })</code> (the exact reverse). It cannot serve <code>sort({ trangThai: 1, ngay: 1 })</code>: that would need status ascending with dates ascending — neither direction of the index gives it, so the plan became SORT ← COLLSCAN. Direction only matters for sorts on several fields; for one field, <code>1</code> or <code>-1</code> is the same.</p>

<h3>$in is several equalities: SORT_MERGE</h3>
${lenh('s04-3-esr', 7)}
<p>"NEW or SHIPPED, newest first": the server walks the NEW block and the SHIPPED block — each already in date order — and <strong>merges</strong> them like two sorted lists, reading 21 keys for 20 results. That is why ESR treats <code>$in</code> as equality when it precedes the sort field (with a long <code>$in</code> list, the merge has many branches; measure).</p>

<h3>When ESR is not the best: a very selective range</h3>
${lenh('s04-3-esr', 8)}
<p>Change the range to totals ≥ 19,990,000 — only a handful of PAID orders. Now E–R–S reads just 136 keys (the narrow range) and sorts a few dozen in memory, while E–S–R has to walk 30,122 PAID keys by date before it finds 20 that large. The planner, racing both (Lesson 4.2), picked E–R–S by itself. ESR is a guideline for the typical case — a range that matches many documents — not a law. When one range is far more selective than everything else, measure both orders on realistic data.</p>

<p>PostgreSQL has the same rules for composite B-tree indexes (leftmost prefix, sort order, equality before range):</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-9-2-to-hop-covering', title: 'PostgreSQL 9.2 — Composite indexes & covering', sub: 'Which columns, in which order' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — ordering index fields "by importance" or in the order of the WHERE clause.</strong> A developer writes <code>find({ tong: { $gte: X }, trangThai: 'PAID' }).sort({ ngay: -1 })</code> and creates <code>{ tong: 1, trangThai: 1, ngay: -1 }</code> because "tong comes first in the query". That is R–E–S: 145,272 keys and a sort instead of 42 keys. The order of fields in the <em>query object</em> means nothing to MongoDB; the order of fields in the <em>index</em> means everything. Classify each field as E, S or R, then write the index.</p>
</div>

<h3>💼 At work: one index per screen, not per field</h3>
<p>In code review you will see an entity with <code>@Indexed</code> on five separate fields. Five single-field indexes do not combine well — MongoDB can intersect indexes in rare cases, but in practice it picks one and filters the rest by reading documents (Lesson 4.2). The professional approach is to list the top screens and API queries (the workload table from Chapter 3), classify each one's fields as E/S/R, and create one compound index per query family, reusing prefixes so that two queries share an index where they can. In Spring Data that is <code>@CompoundIndex(def = "{'trangThai': 1, 'ngay': -1, 'tong': 1}")</code>; in Mongoose, <code>schema.index({ trangThai: 1, ngay: -1, tong: 1 })</code> (Chapter 8).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you order the fields of a compound index?"</strong> — ESR: equality fields first, then the sort field, then range fields — and verify with explain.</li>
<li><strong>"Why does a range before the sort field hurt?"</strong> — After a range, keys are ordered by the range field, so the sort order is lost; the server must read all matches and sort in memory.</li>
<li><strong>"Can { a: 1, b: 1 } serve a query on b?"</strong> — Not efficiently: b is only sorted within each a. It serves a, and a + b.</li>
<li><strong>"What happens when a sort exceeds memory?"</strong> — It is limited to 100 MB; with allowDiskUse (default since 6.0) it spills to disk, otherwise the query fails.</li>
<li><strong>"Is ESR always right?"</strong> — No; with a very selective range, E–R–S can examine fewer keys. Measure.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Design the index for "orders of customer X with status PAID, newest first, totals above 1 million". Classify each field as E, S or R, create the index and show keys/docs/nReturned for KH01234.</li>
<li>Your team has indexes <code>{ khach: 1 }</code>, <code>{ khach: 1, ngay: -1 }</code> and <code>{ trangThai: 1 }</code>. The queries are: orders of a customer by date; orders of a customer; NEW orders of a province by date. Which indexes do you keep, drop or create?</li>
<li>Predict, then check: does <code>{ trangThai: 1, ngay: -1, tong: 1 }</code> avoid a SORT for <code>find({ trangThai: 'PAID' }).sort({ ngay: -1, tong: 1 })</code>? And for <code>.sort({ ngay: -1, tong: -1 })</code>?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. khach = E, trangThai = E, ngay = S, tong = R ⇒ <code>{ khach: 1, trangThai: 1, ngay: -1, tong: 1 }</code>. Explain shows IXSCAN with bounds on khach and trangThai, no SORT: 3 keys, 2 documents, 2 returned for KH01234 (the third key failed the <code>tong</code> check inside the index).</p>
<p>2. Drop <code>{ khach: 1 }</code> (a prefix of <code>{ khach: 1, ngay: -1 }</code>, which serves both customer queries). Replace <code>{ trangThai: 1 }</code> with <code>{ trangThai: 1, tinh: 1, ngay: -1 }</code> (E, E, S), which also still serves status-only queries as a prefix.</p>
<p>3. Yes for <code>{ ngay: -1, tong: 1 }</code>: the index order after the equality. No for <code>{ ngay: -1, tong: -1 }</code>: that is neither the index order nor its exact reverse (which would be <code>{ ngay: 1, tong: -1 }</code>), so explain shows a SORT stage.</p>
</details>
<p><strong>Done when:</strong> for any query you can write its E, S and R fields and the index that serves it — and name the case where you would measure ERS too.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Compound index', 'An index on several fields, sorted by the first, then the second inside it, and so on.'],
  ['ESR', 'Equality–Sort–Range: the usual order of fields in a compound index.'],
  ['Index prefix', 'The leading fields of a compound index; the index can serve queries on any prefix.'],
  ['In-memory sort', 'A SORT stage: blocking, limited to 100 MB, spills to disk with allowDiskUse.'],
  ['allowDiskUse', 'Lets a large sort or aggregation write temporary files; on by default since MongoDB 6.0.'],
  ['SORT_MERGE', 'Merges several sorted index ranges (e.g. one per $in value) without a full sort.'],
  ['Selective range', 'A range condition that matches few documents; can make Equality–Range–Sort cheaper.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Same fields, three orders: E–S–R 42 keys, E–R–S 125,575 keys + sort, R–E–S 145,272 keys + sort.</li>
<li>Equality narrows to a block, Sort gives the order inside it, Range is checked on the keys walked.</li>
<li>A compound index serves its prefixes; <code>{ a }</code> is redundant next to <code>{ a, b }</code>.</li>
<li>A sort without an index is limited to 100 MB and spills to disk (263.6 MB ⇒ 3 spills).</li>
<li><code>$in</code> before the sort field ⇒ SORT_MERGE, still no full sort.</li>
<li>Very selective range ⇒ E–R–S can win (136 vs 30,122 keys): measure.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Index phức hợp và luật ESR</h2>
<p class="lead">Màn hình thật lọc trên nhiều trường và sắp xếp theo một trường khác. Một index phức hợp phục vụ được tất cả trong một lượt đi — nhưng chỉ khi các trường của nó đúng thứ tự. Trong bài này, cùng ba trường với ba thứ tự khác nhau cho kết quả chênh nhau tới ba nghìn lần, và bạn sẽ học luật chọn đúng thứ tự trong hầu hết trường hợp: Equality, Sort, Range.</p>

<h3>Hình ảnh đời thường: danh bạ xếp theo thành phố, rồi họ, rồi tên</h3>
<p>Một cuốn danh bạ giấy xếp theo (thành phố, họ, tên) làm việc "mọi người họ Nguyễn ở Huế" trở nên dễ: mở tới Huế, rồi tới Nguyễn, đọc một khối liền nhau. "Mọi người tên An ở bất kỳ thành phố nào" thì vô vọng: tên chỉ được xếp <em>bên trong</em> mỗi khối (thành phố, họ), nên bạn phải đọc cả cuốn. Index phức hợp chính là cuốn danh bạ đó. Thứ tự của nó quyết định câu hỏi nào rẻ.</p>

<h3>Màn hình: đơn đã thanh toán từ 10 triệu đồng, mới nhất trước</h3>
<p>Màn hình của kế toán: trạng thái = PAID (<strong>E</strong>quality — bằng), tổng ≥ 10.000.000 (<strong>R</strong>ange — khoảng), sắp theo ngày giảm dần (<strong>S</strong>ort — sắp xếp), 20 đơn mỗi trang.</p>
${lenh('s04-3-esr', 0)}
<p>Có 125.575 đơn khớp. Tạo ba index phức hợp trên cùng ba trường theo ba thứ tự khác nhau, ép từng cái bằng <code>hint()</code>, rồi để bộ lập kế hoạch tự chọn:</p>
${lenh('s04-3-esr', 1)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">E–R–S { trangThai, tong, ngay }</span><span class="lz-t">125.575 khoá + SORT</span><span class="lz-d">khoảng đứng trước làm vỡ thứ tự ngày</span></div>
  <div class="lz-step"><span class="lz-k">E–S–R { trangThai, ngay, tong }</span><span class="lz-t">42 khoá, không SORT</span><span class="lz-d">đi qua PAID theo ngày, kiểm tong ngay trong khoá, dừng ở 20</span></div>
  <div class="lz-step"><span class="lz-k">R–E–S { tong, trangThai, ngay }</span><span class="lz-t">145.272 khoá + SORT</span><span class="lz-d">khoảng ở trường đầu: mỗi giá trị tổng một khối</span></div>
</div>
<p>Vì sao chênh như vậy? Với <strong>E–S–R</strong>, index chứa mọi đơn PAID <em>đã xếp sẵn theo ngày</em>, mỗi khoá mang theo <code>tong</code> của nó. Máy chủ đi từ khoá PAID mới nhất, kiểm <code>tong ≥ 10.000.000</code> ngay trên khoá (không đọc tài liệu), và dừng ngay khi đủ 20 đơn khớp: 42 khoá, 20 tài liệu, không có tầng SORT, chừng 0 ms. Với <strong>E–R–S</strong>, khối PAID được xếp theo tổng trước, nên thứ tự ngày bị rải khắp 125.575 khoá: phải đọc hết và sắp xếp rồi mới biết 20 đơn đầu (MongoDB 8.0 ít ra còn sắp các <em>khoá</em> trước khi FETCH, nên chỉ đọc 20 tài liệu — nhưng vẫn phải xét 125.575 khoá). Khi khoảng đứng đầu (<strong>R–E–S</strong>) thì còn tệ hơn: index bị chia thành hàng nghìn giá trị tổng, mỗi giá trị một khối trạng thái và ngày riêng. Còn bộ lập kế hoạch, khi để tự do, đã chọn E–S–R.</p>
${nguon('📘', 'The ESR (Equality, Sort, Range) Guideline — MongoDB Docs', 'Xếp trường của index phức hợp: bằng, rồi sắp xếp, rồi khoảng', 'https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/')}

<h3>Luật, và vì sao nó đúng</h3>
<ul>
<li><strong>Equality trước</strong>: so khớp chính xác (<code>trạng thái = PAID</code>) cắt index xuống còn một khối liền nhau. Nhiều trường bằng thì giữa chúng với nhau xếp thế nào cũng được.</li>
<li><strong>Sort kế tiếp</strong>: bên trong khối đó, các khoá đã theo đúng thứ tự bạn cần, nên không phải sắp trong bộ nhớ và <code>limit</code> dừng sớm được.</li>
<li><strong>Range cuối cùng</strong>: <code>$gt</code>, <code>$lt</code>, <code>$gte</code>, <code>$ne</code>, regex — được kiểm trên các khoá đang đi qua. Đặt khoảng trước trường sắp xếp là thứ tự sắp xếp bị phá.</li>
</ul>

<h3>Trang sâu: ESR vẫn phải đi bộ</h3>
${lenh('s04-3-esr', 2)}
<p>Trang 500 (<code>skip(9980)</code>) tốn ESR 20.216 khoá — nó phải đi qua mọi thứ trước trang đó — nhưng vẫn không phải sắp xếp; ERS vẫn 125.575 khoá cộng một lần sắp. Bài 2.6 đã chỉ cách sửa trọn vẹn cho trang sâu: phân trang keyset (<code>ngay &lt; giá trị cuối đã thấy</code>), biến trang nào cũng thành "trang đầu".</p>

<h3>SORT không có index tốn gì: 100 MB, rồi tới đĩa</h3>
${lenh('s04-3-esr', 3)}
${lenh('s04-3-esr', 4)}
<p>Sắp cả collection theo một khoá không index nào cung cấp: 263,6 MB dữ liệu cần sắp, giới hạn bộ nhớ 100 MB cho mỗi lần sắp, nên máy chủ đã <strong>tràn</strong> ra tệp tạm trên đĩa ba lần (<code>usedDisk: true</code>). Từ MongoDB 6.0, <code>allowDiskUse</code> bật sẵn, nên truy vấn vẫn chạy xong — chậm, và tốn chỗ đĩa. Tắt nó đi thì cùng truy vấn lỗi <code>QueryExceededMemoryLimitNoDiskUseAllowed</code>, đúng thứ bạn sẽ gặp trong mã dùng driver cũ hoặc khi <code>allowDiskUseByDefault</code> bị tắt. Một lần sắp trong bộ nhớ trên tập lớn là cờ đỏ kể cả khi nó "vẫn chạy".</p>

<h3>Tiền tố: một index phức hợp phục vụ được truy vấn nào?</h3>
${lenh('s04-3-esr', 5)}
<p>Index <code>{ trangThai, ngay, tong }</code> xếp trước hết theo trạng thái. Nó phục vụ mọi truy vấn trên một <strong>tiền tố</strong> — riêng <code>trangThai</code> (9.909 khoá cho NEW), hay <code>trangThai</code> + <code>ngay</code> (438 khoá) — nhưng không phục vụ truy vấn chỉ theo <code>ngay</code>: ngày chỉ được xếp bên trong từng khối trạng thái, nên truy vấn đó thành COLLSCAN 1.000.000 tài liệu, đúng bài toán danh bạ. Truy vấn trên <code>trangThai</code> + <code>tong</code> (bỏ qua trường giữa) vẫn dùng được index — khoảng trên trạng thái, <code>tong</code> kiểm trên mọi khoá của khối trạng thái (9.910 khoá cho NEW, không đơn nào khớp nên đọc 0 tài liệu). Hệ quả thực tế: index <code>{ a: 1 }</code> là thừa khi đã có <code>{ a: 1, b: 1 }</code>; hãy xoá nó (Bài 4.5).</p>

<h3>Chiều sắp xếp</h3>
${lenh('s04-3-esr', 6)}
<p>Một index đi xuôi hay đi ngược đều được, nên <code>{ trangThai: 1, ngay: -1 }</code> phục vụ <code>sort({ ngay: -1 })</code> và <code>sort({ ngay: 1 })</code> sau điều kiện bằng trên trạng thái, và cả <code>sort({ trangThai: -1, ngay: 1 })</code> (đảo ngược đúng y). Nó không phục vụ được <code>sort({ trangThai: 1, ngay: 1 })</code>: cái đó cần trạng thái tăng dần cùng ngày tăng dần — chiều nào của index cũng không cho ra, nên kế hoạch thành SORT ← COLLSCAN. Chiều chỉ quan trọng khi sắp theo nhiều trường; với một trường, <code>1</code> hay <code>-1</code> như nhau.</p>

<h3>$in là nhiều điều kiện bằng: SORT_MERGE</h3>
${lenh('s04-3-esr', 7)}
<p>"NEW hoặc SHIPPED, mới nhất trước": máy chủ đi qua khối NEW và khối SHIPPED — mỗi khối đã theo thứ tự ngày — rồi <strong>trộn</strong> chúng như trộn hai danh sách đã sắp, đọc 21 khoá cho 20 kết quả. Vì thế ESR coi <code>$in</code> là điều kiện bằng khi nó đứng trước trường sắp xếp (danh sách <code>$in</code> dài thì phép trộn có nhiều nhánh; hãy đo).</p>

<h3>Khi ESR không phải tốt nhất: khoảng rất chọn lọc</h3>
${lenh('s04-3-esr', 8)}
<p>Đổi khoảng thành tổng ≥ 19.990.000 — chỉ lèo tèo vài đơn PAID. Giờ E–R–S chỉ đọc 136 khoá (khoảng hẹp) rồi sắp vài chục đơn trong bộ nhớ, còn E–S–R phải đi qua 30.122 khoá PAID theo ngày mới tìm đủ 20 đơn lớn như vậy. Bộ lập kế hoạch, cho cả hai đua thử (Bài 4.2), tự chọn E–R–S. ESR là hướng dẫn cho trường hợp thường gặp — khoảng khớp nhiều tài liệu — chứ không phải định luật. Khi một khoảng chọn lọc hơn hẳn mọi điều kiện khác, hãy đo cả hai thứ tự trên dữ liệu sát thực tế.</p>

<p>PostgreSQL có cùng các luật cho index B-tree nhiều cột (tiền tố bên trái, thứ tự sắp xếp, điều kiện bằng trước khoảng):</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-9-2-to-hop-covering', title: 'PostgreSQL 9.2 — Chỉ mục tổ hợp và covering', sub: 'Cột nào, theo thứ tự nào' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xếp trường của index "theo độ quan trọng" hoặc theo thứ tự trong câu truy vấn.</strong> Một bạn viết <code>find({ tong: { $gte: X }, trangThai: 'PAID' }).sort({ ngay: -1 })</code> rồi tạo <code>{ tong: 1, trangThai: 1, ngay: -1 }</code> vì "tong đứng đầu trong truy vấn". Đó là R–E–S: 145.272 khoá và một lần sắp thay vì 42 khoá. Thứ tự trường trong <em>object truy vấn</em> chẳng có nghĩa gì với MongoDB; thứ tự trường trong <em>index</em> thì quyết định tất cả. Hãy xếp mỗi trường vào E, S hay R, rồi mới viết index.</p>
</div>

<h3>💼 Đi làm: mỗi màn hình một index, không phải mỗi trường một index</h3>
<p>Khi review mã bạn sẽ gặp một entity gắn <code>@Indexed</code> trên năm trường riêng lẻ. Năm index một trường không kết hợp tốt với nhau — MongoDB giao được các index trong vài trường hợp hiếm, nhưng thực tế nó chọn một cái và lọc phần còn lại bằng cách đọc tài liệu (Bài 4.2). Cách làm chuyên nghiệp là liệt kê các màn hình và truy vấn API chính (bảng tải công việc từ Chương 3), xếp trường của từng truy vấn vào E/S/R, rồi tạo mỗi họ truy vấn một index phức hợp, dùng lại tiền tố để hai truy vấn chung một index khi được. Trong Spring Data đó là <code>@CompoundIndex(def = "{'trangThai': 1, 'ngay': -1, 'tong': 1}")</code>; trong Mongoose là <code>schema.index({ trangThai: 1, ngay: -1, tong: 1 })</code> (Chương 8).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Bạn xếp các trường của index phức hợp thế nào?"</strong> — ESR: trường bằng trước, rồi trường sắp xếp, rồi trường khoảng — và kiểm lại bằng explain.</li>
<li><strong>"Vì sao khoảng đứng trước trường sắp xếp lại hại?"</strong> — Sau một khoảng, khoá xếp theo trường khoảng, nên thứ tự sắp xếp mất; máy chủ phải đọc hết kết quả khớp rồi sắp trong bộ nhớ.</li>
<li><strong>"{ a: 1, b: 1 } có phục vụ truy vấn trên b không?"</strong> — Không hiệu quả: b chỉ được xếp bên trong từng a. Nó phục vụ a, và a + b.</li>
<li><strong>"Khi sắp xếp vượt bộ nhớ thì sao?"</strong> — Giới hạn 100 MB; có allowDiskUse (mặc định từ 6.0) thì tràn xuống đĩa, không thì truy vấn lỗi.</li>
<li><strong>"ESR lúc nào cũng đúng?"</strong> — Không; với khoảng rất chọn lọc, E–R–S có thể xét ít khoá hơn. Hãy đo.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Thiết kế index cho "đơn của khách X có trạng thái PAID, mới nhất trước, tổng trên 1 triệu". Xếp mỗi trường vào E, S hay R, tạo index và đưa ra số khoá/tài liệu/nReturned cho KH01234.</li>
<li>Nhóm bạn đang có các index <code>{ khach: 1 }</code>, <code>{ khach: 1, ngay: -1 }</code> và <code>{ trangThai: 1 }</code>. Các truy vấn là: đơn của một khách theo ngày; đơn của một khách; đơn NEW của một tỉnh theo ngày. Bạn giữ, xoá hay tạo index nào?</li>
<li>Đoán trước, rồi kiểm: <code>{ trangThai: 1, ngay: -1, tong: 1 }</code> có tránh được SORT cho <code>find({ trangThai: 'PAID' }).sort({ ngay: -1, tong: 1 })</code> không? Còn với <code>.sort({ ngay: -1, tong: -1 })</code>?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. khach = E, trangThai = E, ngay = S, tong = R ⇒ <code>{ khach: 1, trangThai: 1, ngay: -1, tong: 1 }</code>. Explain cho IXSCAN có khoảng trên khach và trangThai, không có SORT: 3 khoá, 2 tài liệu, trả 2 cho KH01234 (khoá thứ ba trượt điều kiện <code>tong</code> ngay trong index).</p>
<p>2. Xoá <code>{ khach: 1 }</code> (là tiền tố của <code>{ khach: 1, ngay: -1 }</code>, cái này phục vụ được cả hai truy vấn theo khách). Thay <code>{ trangThai: 1 }</code> bằng <code>{ trangThai: 1, tinh: 1, ngay: -1 }</code> (E, E, S), cái này vẫn phục vụ truy vấn chỉ theo trạng thái nhờ tiền tố.</p>
<p>3. Có với <code>{ ngay: -1, tong: 1 }</code>: đúng thứ tự của index sau điều kiện bằng. Không với <code>{ ngay: -1, tong: -1 }</code>: đó không phải thứ tự của index cũng không phải đảo ngược đúng y của nó (đảo ngược sẽ là <code>{ ngay: 1, tong: -1 }</code>), nên explain có tầng SORT.</p>
</details>
<p><strong>Xong khi:</strong> với bất kỳ truy vấn nào bạn viết ra được các trường E, S, R và index phục vụ nó — và gọi tên được trường hợp bạn sẽ đo cả ERS.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Index phức hợp (compound)', 'Index trên nhiều trường, xếp theo trường đầu, rồi trường thứ hai bên trong nó, và cứ thế.'],
  ['ESR', 'Equality–Sort–Range: thứ tự trường thường dùng của index phức hợp.'],
  ['Tiền tố index', 'Các trường đứng đầu của index phức hợp; index phục vụ được truy vấn trên mọi tiền tố.'],
  ['Sắp xếp trong bộ nhớ', 'Tầng SORT: chặn, giới hạn 100 MB, tràn xuống đĩa khi có allowDiskUse.'],
  ['allowDiskUse', 'Cho phép phép sắp hay aggregation lớn ghi tệp tạm; bật sẵn từ MongoDB 6.0.'],
  ['SORT_MERGE', 'Trộn nhiều khoảng index đã sắp (ví dụ mỗi giá trị $in một khoảng) mà không phải sắp lại toàn bộ.'],
  ['Khoảng chọn lọc', 'Điều kiện khoảng khớp rất ít tài liệu; có thể làm Equality–Range–Sort rẻ hơn.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng trường, ba thứ tự: E–S–R 42 khoá, E–R–S 125.575 khoá + sắp, R–E–S 145.272 khoá + sắp.</li>
<li>Equality thu về một khối, Sort cho thứ tự bên trong khối, Range được kiểm trên các khoá đi qua.</li>
<li>Index phức hợp phục vụ các tiền tố của nó; <code>{ a }</code> là thừa khi có <code>{ a, b }</code>.</li>
<li>Sắp xếp không có index bị giới hạn 100 MB và tràn xuống đĩa (263,6 MB ⇒ tràn 3 lần).</li>
<li><code>$in</code> trước trường sắp xếp ⇒ SORT_MERGE, vẫn không phải sắp lại toàn bộ.</li>
<li>Khoảng rất chọn lọc ⇒ E–R–S có thể thắng (136 với 30.122 khoá): hãy đo.</li>
</ul>
</div>
`,
};
