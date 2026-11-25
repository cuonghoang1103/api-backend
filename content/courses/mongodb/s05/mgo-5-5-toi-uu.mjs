/**
 * 5.5 — Tối ưu pipeline, giới hạn 100 MB, $merge và $out (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-5-toi-uu'] (MongoDB 8.0.38; ch4.don index { trangThai, ngay } + ctshop; container phụ mgo-js --noscripting --network none, xoá ngay).
 * Công cụ phát cho người học: ../_demo/ke-pipeline.js (đọc explain của pipeline).
 * Số đối chiếu (tất định): $match sau $set được kéo lên ⇒ PROJECTION_COVERED ← IXSCAN 9909 khoá 0 tài liệu; $match trên trường tính ⇒ COLLSCAN 1.000.000;
 * $match trộn ⇒ tách, phần trangThai dùng index; viết lại bằng khoảng ngày ⇒ COUNT_SCAN 4840 khoá; $match trên khoá nhóm sau $group ⇒ đẩy xuống (IXSCAN 9909),
 * trên giá trị tích luỹ ⇒ COLLSCAN 1.000.000; $sort+$limit ⇒ 5 khoá 5 tài liệu; allowDiskUse:false ⇒ "Exceeded memory limit for $group"; 104857600 byte;
 * tràn 5 lần 181.731.964 byte / 231.683 bản ghi; push 2 trường 36.599.820 byte; chỉ đếm 0; 16 MB ⇒ BSONObjectTooLarge 21.811.123; $merge 287 ngày, chạy lại 287;
 * thêm đơn 14/10 ⇒ 5→6 đơn, 16.568.000→26.072.000; $merge on không unique ⇒ Location51183; $out giữ index soDon_-1, mất tài liệu cũ; view donMoi 299;
 * pipeline từ người dùng: $lookup lộ passwordHash 2 user, $merge hạ SP001 9.504.000 → 1.000 (đã khôi phục), $function chạy JS; --noscripting chặn; danh sách trắng chặn $lookup và $expr.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's05-5-toi-uu';

export default {
  title: '5.5 — Optimizing pipelines, the 100 MB limit, $merge and $out|||5.5 — Tối ưu pipeline, giới hạn 100 MB, $merge và $out',
  slug: 'mgo-5-5-toi-uu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đọc explain của pipeline bằng công cụ ke-pipeline.js trên một triệu đơn: bộ tối ưu tự kéo $match lên đầu và còn phủ bằng index, nhưng $match trên trường tính ra quét cả triệu tài liệu; $match sau $group được đẩy xuống khi lọc theo khoá nhóm; $sort+$limit đọc đúng 5 khoá. Giới hạn 100 MB mỗi stage (lỗi khi cấm tràn đĩa, 181 MB tràn khi $push cả tài liệu) và 16 MB mỗi tài liệu kết quả. View vật chất hoá bằng $merge chạy lại an toàn, cập nhật một ngày; $out thay cả collection; view thường. Góc hacker: API nhận nguyên pipeline từ trình duyệt bị lộ mật khẩu băm, bị hạ giá sản phẩm bằng $merge, chạy JavaScript bằng $function — và cách chặn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Optimizing pipelines, the 100 MB limit, $merge and $out</h2>
<p class="lead">The pipelines of this chapter ran in milliseconds on 2,000 orders. On a production collection the same pipeline can read every document, run out of memory, or return a document too large to send. This lesson shows how to see what the server will really do with a pipeline, what the optimizer fixes for you and what it cannot, the two size limits, and how to stop recomputing the same report on every request — by storing it with <code>$merge</code>. It ends with the most dangerous pipeline of all: one written by your user.</p>

<h3>An everyday picture: the kitchen of a busy restaurant</h3>
<p>A good kitchen does not peel every potato in the store before reading the orders: it reads the orders first, takes only what is needed, then cooks. It has a counter of limited size; when too many plates are waiting, some go to a side table (slower, but nothing is lost) — unless the manager forbade side tables, in which case the kitchen stops. Each plate also has a maximum size: you cannot serve the whole buffet on one plate. And the soup of the day is cooked once in the morning and served all day, rather than cooked again for each customer. Read the orders first (<code>$match</code> early, with an index), the counter (100 MB per stage), the side table (spilling to disk), the plate (16 MB per document), the soup (a materialized view with <code>$merge</code>).</p>

<h3>A tool to read pipeline plans</h3>
<p>The explain of a pipeline is long and its shape changes depending on how much was pushed down to the query engine. The chapter's tool <code>_demo/ke-pipeline.js</code> prints the useful part: stages left after optimization, the access plan (read bottom-up as in Lesson 4.2), the index, and the counters:</p>
${lenh(K, 0)}
<p>The million orders of <code>ch4.don</code> have one index here: <code>{ trangThai: 1, ngay: 1 }</code>.</p>

<h3>What the optimizer fixes for you</h3>
<p><strong>1. A $match placed late is moved to the front.</strong> The pipeline below computes <code>nam</code> first and filters on <code>trangThai</code> second:</p>
${lenh(K, 1)}
<p>The plan starts with IXSCAN on the index: the server saw that the <code>$match</code> does not depend on <code>nam</code> and moved it before <code>$set</code>. Better still, it computed that the rest of the pipeline only needs <code>ngay</code>, which is in the index — <code>PROJECTION_COVERED</code>, 0 documents read (Lesson 4.5).</p>
<p><strong>2. But not a $match on a computed field.</strong> Filter on <code>nam</code> itself:</p>
${lenh(K, 2)}
<p>COLLSCAN, 1,000,000 documents: <code>nam</code> exists only after <code>$set</code> has run on every document. Mix both conditions and the optimizer <em>splits</em> the <code>$match</code> — the <code>trangThai</code> part moves to the index, the <code>nam</code> part stays behind <code>$set</code>:</p>
${lenh(K, 3)}
<p>The real fix is to write the condition on the stored field. "Year 2026 in Vietnam time" is a date range; the index serves both fields and the count runs on index keys only:</p>
${lenh(K, 4)}
<p>4,840 keys, <code>COUNT_SCAN</code>, 0 documents. The rule from Chapter 4 holds inside pipelines: an index helps only a condition on the indexed field itself, not on an expression computed from it.</p>
<p><strong>3. A $match after $group on the grouping key is pushed down.</strong> Filtering groups by their key is the same as filtering documents before grouping, and MongoDB 8.0 does that rewrite. Filtering on an accumulated value cannot be moved:</p>
${lenh(K, 5)}
<p><code>_id: 'NEW'</code> after grouping by <code>trangThai</code>: IXSCAN, 9,909 keys. <code>n &lt; 20000</code>: the server must count every group first — COLLSCAN of a million. Do not rely on rewrites you have not seen in explain: put the filter first yourself when you can.</p>
<p><strong>4. $sort + $limit becomes a top-k on the index.</strong></p>
${lenh(K, 6)}
<p>5 keys, 5 documents. With an index matching the sort, the server reads the first five entries and stops; without one, <code>$sort</code> followed by <code>$limit</code> still keeps only the top k in memory instead of sorting everything.</p>
${nguon('📘', 'Aggregation Pipeline Optimization — MongoDB Docs', 'Projection, $match reordering and splitting, $sort + $limit coalescence, $lookup + $unwind', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/')}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">filter first</span><span class="lz-t">$match on stored fields, at the start</span><span class="lz-d">only the start of a pipeline can use an index</span></div>
  <div class="lz-step"><span class="lz-k">shrink early</span><span class="lz-t">$project/$group before heavy stages</span><span class="lz-d">fewer bytes per document, fewer documents</span></div>
  <div class="lz-step"><span class="lz-k">join late</span><span class="lz-t">$lookup after $limit, on an indexed foreignField</span><span class="lz-d">Lesson 5.2</span></div>
  <div class="lz-step"><span class="lz-k">verify</span><span class="lz-t">explain every pipeline that runs on a hot path</span><span class="lz-d">rewrites you have not seen do not exist</span></div>
</div>

<h3>The 100 MB limit per stage</h3>
<p>Blocking stages — <code>$group</code>, <code>$sort</code>, <code>$bucket</code>, <code>$setWindowFields</code> — must hold their state in memory: 100 MB per stage. "All orders of each customer" on a million orders exceeds it. If the query forbids using disk:</p>
${lenh(K, 7)}
<p>Since MongoDB 6.0 the server parameter <code>allowDiskUseByDefault</code> is true, so the same pipeline without the option succeeds by writing to temporary files — explain shows how much:</p>
${lenh(K, 8)}
<p>Five spills, 181 MB written and read back. Spilling is correct but slow, and on a busy server the disk is shared with everything else. The cheapest fix is to carry less: <code>$$ROOT</code> pushes whole documents; pushing only the two fields the report needs, or only counting, changes the numbers completely:</p>
${lenh(K, 9)}
<p>181.7 MB → 36.6 MB → 0. Ask "what does the next stage really need?" before every <code>$group</code>.</p>

<h3>The 16 MB limit per document</h3>
<p>The output of a pipeline is a cursor of documents, so the total can be any size — but each single document is limited to 16 MB like any BSON document (Lesson 1.1). Grouping everything into one document hits that ceiling:</p>
${lenh(K, 10)}
<p><code>BSONObjectTooLarge</code> at 21.8 MB. The usual culprits are <code>$group: { _id: null, …, $push }</code>, a <code>$lookup</code> whose joined array is unbounded (Lesson 5.2), and a <code>$facet</code> returning lists. Return many small documents, or limit the arrays (<code>$slice</code>, <code>$topN</code>).</p>
${nguon('📘', 'Aggregation Pipeline Limits — MongoDB Docs', '16 MB result documents, 100 MB per stage, allowDiskUseByDefault, 1000 stages', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline-limits/')}

<h3>Materialized views with $merge: compute once, read many times</h3>
<p>A daily revenue chart over a year runs the same aggregation on every page view. Instead, store its result in a collection and refresh it on a schedule. <code>$merge</code> writes the pipeline output into a collection, document by document, matching on <code>_id</code> (or another unique field):</p>
${lenh(K, 11)}
<p>287 days with sales. Run the same pipeline a second time: still 287 — with <code>whenMatched: 'replace'</code> each day's document is replaced, not duplicated. A job that is safe to run twice is the first thing a reviewer looks for: jobs <em>will</em> be rerun after a failure. The real advantage is incremental refresh — recompute only the days that may have changed. A new order on 14 October (Vietnam time), then a <code>$merge</code> for that one day:</p>
${lenh(K, 12)}
<p>The 14 October row went from 5 to 6 orders; the other 286 rows were not touched. A nightly job typically recomputes "yesterday and today" so late changes (a cancelled order) are picked up. One catch, measured in the lab (Lesson 5.6): <code>$merge</code> only writes days that still have orders, so a day whose last order was cancelled keeps its old row — the job must also remove rows it did not rewrite.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — $merge on a field without a unique index.</strong> Matching on anything other than <code>_id</code> requires a unique index on that field in the target collection — otherwise the server cannot guarantee one match:</p>
${lenh(K, 13)}
<p>Create <code>{ ma: 1 }</code> unique on the target first, or make your key the <code>_id</code> as above.</p>
</div>
<p><code>$out</code> is the blunt tool: it replaces the whole target collection with the pipeline's output (atomically when it finishes), keeping the target's indexes:</p>
${lenh(K, 14)}
<p>The old document is gone, the index <code>soDon_-1</code> remains. Use <code>$out</code> for a full rebuild (a nightly export), <code>$merge</code> for incremental updates and for writing into a collection other code also writes to.</p>
<p>And a standard <em>view</em> stores nothing — it is a saved pipeline that runs every time you read it:</p>
${lenh(K, 15)}
<p>A view is useful to hide fields from a user who may only read the view, or to give a reporting tool a simple name. It is not faster than running the pipeline yourself; if you need speed, materialize with <code>$merge</code>.</p>
${nguon('📘', '$merge (aggregation) — MongoDB Docs', 'into, on (unique index required), whenMatched, whenNotMatched; on-demand materialized views', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/')}
${nguon('📘', 'Views — MongoDB Docs', 'Standard views vs on-demand materialized views', 'https://www.mongodb.com/docs/manual/core/views/')}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-12-4-materialized-view', title: 'PostgreSQL 12.4 — Materialized views', sub: 'REFRESH MATERIALIZED VIEW (CONCURRENTLY) — the SQL counterpart of $merge' })}

<h3>🕵️ Hacker corner: the "custom report" API that accepts a pipeline</h3>
<p>Some admin panels and BI integrations offer "advanced reports": the browser sends a JSON pipeline, the server appends it to its own <code>$match</code> and runs it. It looks harmless — the server already filters to PAID orders. Here is what a user of that API can send. First, a <code>$lookup</code> into a collection the API never meant to expose:</p>
${lenh(K, 16)}
<p>Every user's email and password hash, through a "sales report". The hashes are fake here; in a real system they would go straight to an offline cracking rig. Second, the pipeline can <em>write</em>:</p>
${lenh(K, 17)}
<p>One request, and the 9.5-million-đồng laptop costs 1,000 đồng in the catalogue (the script restored the price right after). Third, if server-side JavaScript is enabled — it is by default — the pipeline can run code on the database server:</p>
${lenh(K, 18)}
<p>The defences, in order of strength:</p>
<ol>
<li><strong>Do not accept stages from clients.</strong> Accept <em>parameters</em> (date range, city, page) and build the pipeline in your code. This is the same lesson as SQL injection: data, not code (OWASP A03).</li>
<li><strong>Least privilege for the reporting connection.</strong> A user with only <code>find</code> on <code>orders</code> cannot <code>$lookup</code> into <code>users</code> or <code>$merge</code> into <code>products</code> — the server checks privileges for every collection a pipeline touches (Chapter 9 builds these roles).</li>
<li><strong>Turn off server-side JavaScript</strong> when you do not use it — <code>--noscripting</code> or <code>security.javascriptEnabled: false</code>:</li>
</ol>
${lenh(K, 19)}
<ol start="4">
<li><strong>If you must accept stages</strong> (an internal BI tool), use an allowlist of stages, a scan for forbidden operators at any depth, a length limit, a forced <code>$limit</code> and <code>maxTimeMS</code>:</li>
</ol>
${lenh(K, 20)}
<p>The legitimate report passes; the <code>$lookup</code> is rejected; and the <code>$function</code> hidden inside a <code>$match</code> through <code>$expr</code> is found by the deep scan. An allowlist is the last line, not the first: an operator you forgot to forbid is a hole. Chapter 9 continues with operator injection through query strings (<code>?status[$ne]=…</code>).</p>
${nguon('🛡️', 'OWASP Top 10 2021 — A03 Injection', 'User-supplied data interpreted as commands or queries, including NoSQL', 'https://owasp.org/Top10/A03_2021-Injection/')}
${nguon('📘', 'Server-side JavaScript — MongoDB Docs', '$where, $function, $accumulator; disabling with --noscripting / security.javascriptEnabled', 'https://www.mongodb.com/docs/manual/core/server-side-javascript/')}

<h3>💼 At work: the dashboard that slowed down the shop</h3>
<p>A pattern seen on many projects: the admin dashboard runs five aggregations over all orders on every page load, the marketing team keeps it open on a wall screen that refreshes every minute, and checkout latency doubles at 9 a.m. The fix you can propose in one pull request: run the heavy pipelines on a schedule with <code>$merge</code> into small summary collections (and, from Chapter 7, read them from a secondary), give the dashboard endpoints <code>maxTimeMS</code>, and use a dedicated read-only database user for reporting. Bring the explain of each pipeline before and after — keys/docs examined and whether it spills.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you know a pipeline uses an index?"</strong> — explain: the first stage's plan shows IXSCAN; only a $match/$sort at the start (or one the optimizer moved there) can use an index.</li>
<li><strong>"What is the 100 MB limit and what happens when you hit it?"</strong> — Memory per blocking stage; with allowDiskUse (default true since 6.0) it spills to disk, otherwise the query fails. Reduce the data carried.</li>
<li><strong>"$out vs $merge?"</strong> — $out replaces the whole collection; $merge inserts/replaces/merges per document, supports incremental refresh, needs a unique index on its <code>on</code> fields.</li>
<li><strong>"A view or a materialized view?"</strong> — A view is computed on every read; a materialized view is stored and refreshed on a schedule — fast reads, possibly stale.</li>
<li><strong>"Is it safe to accept a pipeline from the client?"</strong> — No: $lookup reads other collections, $merge/$out write, $function runs code. Accept parameters; least-privilege user; disable server-side JS.</li>
</ul>

<h3>🧪 Practice (35 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the monthly report of Lesson 5.4 and run it through <code>ke()</code> on <code>ctshop.orders</code> without an index, then with <code>{ status: 1, createdAt: 1 }</code>. What changes in the plan and the counters?</li>
<li>Write a <code>$merge</code> job that maintains <code>topKhachThang</code>: for each month (Vietnam time), the 10 best customers with their rank. Make it safe to run twice, and incremental for the current month only.</li>
<li>Rewrite <code>[{ $set: { thang: { $month: '$ngay' } } }, { $match: { thang: 3, trangThai: 'PAID' } }, { $count: 'n' }]</code> on <code>ch4.don</code> so that it reads only the index keys it needs. Prove it with <code>ke()</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Without the index: COLLSCAN of 2,000 documents. With it: IXSCAN on <code>status_1_createdAt_1</code> with keys ≈ the 1,425 sold orders of 2026 — the <code>$in</code> on status is an equality, the date range comes after it (ESR, Lesson 4.3). On 2,000 documents the time difference is small; the counters are what scale.</p>
<p>2. Pipeline: <code>$match</code> sold orders in the month range → <code>$group</code> by <code>{ thang, kh }</code> → <code>$setWindowFields</code> partitioned by month with <code>$rank</code> → <code>$match: { hang: { $lte: 10 } }</code> → <code>$merge: { into: 'topKhachThang', whenMatched: 'replace' }</code>. The <code>_id</code> from <code>$group</code> is already <code>{ thang, kh }</code>, so it is deterministic and the job is safe twice (100 rows after the first run, still 100 after the second, on the lab data). Caveat to mention: a customer who drops out of the top 10 keeps an old row — delete the month's rows before merging, or <code>$merge</code> into a per-month document holding the array of 10.</p>
<p>3. "Month 3" is not a single range across years, so write one range per year: <code>{ trangThai: 'PAID', $or: [{ ngay: { $gte: ISODate('2025-03-01'), $lt: ISODate('2025-04-01') } }, { ngay: { $gte: ISODate('2026-03-01'), $lt: ISODate('2026-04-01') } }] }</code> (add Vietnam-time boundaries if the business means Vietnam time). <code>ke()</code>: OR of two IXSCAN, 22,240 keys for 22,240 orders, 0 documents. The original is not a disaster thanks to the optimizer — it moves the <code>trangThai</code> part to the index and covers <code>ngay</code> — but it still reads all 250,324 PAID keys to keep 22,240: eleven times more work.</p>
</details>
<p><strong>Done when:</strong> for every pipeline on a hot path you can show its explain, say whether it spills, and say whether its result should be stored instead of recomputed.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Pipeline optimization', 'Rewrites the server applies: moving/splitting $match, projection pushdown, $sort+$limit, $lookup+$unwind.'],
  ['Blocking stage', 'A stage that needs all input before output: $group, $sort, $bucket, $setWindowFields.'],
  ['allowDiskUse', 'Lets blocking stages spill to temporary files over 100 MB; default true since 6.0.'],
  ['Spill', 'Writing part of a stage\'s state to disk; visible in explain as usedDisk, spills, spilledBytes.'],
  ['BSONObjectTooLarge', 'Error when one result document exceeds 16 MB.'],
  ['$merge', 'Writes results into a collection per document (insert/replace/merge/keep/fail); base of materialized views.'],
  ['$out', 'Replaces an entire collection with the results, keeping its indexes.'],
  ['View', 'A saved pipeline evaluated on every read; stores nothing.'],
  ['--noscripting', 'Disables server-side JavaScript ($where, $function, $accumulator).'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Read every hot pipeline with explain; only the start can use an index.</li>
<li>The optimizer moves and splits <code>$match</code>, but cannot index a computed field — write conditions on stored fields.</li>
<li>100 MB per blocking stage: spill (slow) or fail; carry fewer fields (181.7 → 36.6 → 0 MB).</li>
<li>16 MB per result document: avoid giant <code>$push</code>, unbounded joins and list facets.</li>
<li>Store repeated reports with <code>$merge</code> (idempotent, incremental); <code>$out</code> rebuilds; a view recomputes.</li>
<li>Never run a client-written pipeline: parameters only, least privilege, no server-side JavaScript.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Tối ưu pipeline, giới hạn 100 MB, $merge và $out</h2>
<p class="lead">Các pipeline trong chương này chạy trong vài mili giây trên 2.000 đơn. Trên một collection production, cùng pipeline đó có thể đọc mọi tài liệu, hết bộ nhớ, hoặc trả về một tài liệu quá lớn để gửi đi. Bài này chỉ cách nhìn máy chủ thực sự sẽ làm gì với một pipeline, bộ tối ưu sửa giúp bạn những gì và không sửa được gì, hai giới hạn kích thước, và cách thôi tính lại cùng một báo cáo ở mỗi request — bằng cách lưu nó lại với <code>$merge</code>. Bài kết thúc bằng pipeline nguy hiểm nhất: pipeline do chính người dùng của bạn viết.</p>

<h3>Hình ảnh đời thường: bếp của một nhà hàng đông khách</h3>
<p>Một bếp giỏi không gọt hết khoai trong kho rồi mới đọc phiếu gọi món: nó đọc phiếu trước, chỉ lấy thứ cần, rồi mới nấu. Bếp có một mặt quầy cỡ giới hạn; khi có quá nhiều đĩa đang chờ, một số được đặt sang bàn phụ (chậm hơn, nhưng không mất gì) — trừ khi quản lý cấm dùng bàn phụ, lúc đó bếp phải dừng. Mỗi đĩa cũng có cỡ tối đa: không thể bày cả bàn buffet lên một đĩa. Và món canh trong ngày được nấu một lần buổi sáng rồi múc cả ngày, thay vì nấu lại cho từng khách. Đọc phiếu trước (<code>$match</code> sớm, có index), mặt quầy (100 MB mỗi stage), bàn phụ (tràn ra đĩa), cái đĩa (16 MB mỗi tài liệu), nồi canh (view vật chất hoá bằng <code>$merge</code>).</p>

<h3>Công cụ đọc kế hoạch của pipeline</h3>
<p>Explain của một pipeline dài, và hình dạng của nó đổi tuỳ phần nào đã được đẩy xuống tầng truy vấn. Công cụ của chương <code>_demo/ke-pipeline.js</code> in ra phần có ích: các stage còn lại sau tối ưu, kế hoạch truy cập (đọc từ dưới lên như Bài 4.2), index, và các bộ đếm:</p>
${lenh(K, 0)}
<p>Một triệu đơn của <code>ch4.don</code> ở đây có một index: <code>{ trangThai: 1, ngay: 1 }</code>.</p>

<h3>Những gì bộ tối ưu sửa giúp bạn</h3>
<p><strong>1. Một $match đặt muộn được kéo lên đầu.</strong> Pipeline dưới đây tính <code>nam</code> trước rồi mới lọc theo <code>trangThai</code>:</p>
${lenh(K, 1)}
<p>Kế hoạch bắt đầu bằng IXSCAN trên index: máy chủ thấy <code>$match</code> không phụ thuộc vào <code>nam</code> nên dời nó lên trước <code>$set</code>. Hay hơn nữa, nó tính ra phần còn lại của pipeline chỉ cần <code>ngay</code>, mà <code>ngay</code> nằm trong index — <code>PROJECTION_COVERED</code>, đọc 0 tài liệu (Bài 4.5).</p>
<p><strong>2. Nhưng không với $match trên trường tính ra.</strong> Lọc trên chính <code>nam</code>:</p>
${lenh(K, 2)}
<p>COLLSCAN, 1.000.000 tài liệu: <code>nam</code> chỉ tồn tại sau khi <code>$set</code> đã chạy trên mọi tài liệu. Trộn cả hai điều kiện thì bộ tối ưu <em>tách</em> <code>$match</code> ra — phần <code>trangThai</code> lên dùng index, phần <code>nam</code> ở lại sau <code>$set</code>:</p>
${lenh(K, 3)}
<p>Cách sửa thật là viết điều kiện trên trường đã lưu. "Năm 2026 theo giờ Việt Nam" là một khoảng ngày; index phục vụ cả hai trường và phép đếm chạy chỉ trên khoá index:</p>
${lenh(K, 4)}
<p>4.840 khoá, <code>COUNT_SCAN</code>, 0 tài liệu. Luật của Chương 4 vẫn đúng bên trong pipeline: index chỉ giúp điều kiện trên chính trường được index, không giúp biểu thức tính ra từ trường đó.</p>
<p><strong>3. $match sau $group trên khoá nhóm được đẩy xuống.</strong> Lọc nhóm theo khoá của nó cũng giống lọc tài liệu trước khi gom, và MongoDB 8.0 có viết lại như vậy. Lọc trên giá trị tích luỹ thì không dời được:</p>
${lenh(K, 5)}
<p><code>_id: 'NEW'</code> sau khi gom theo <code>trangThai</code>: IXSCAN, 9.909 khoá. <code>n &lt; 20000</code>: máy chủ phải đếm mọi nhóm trước — COLLSCAN một triệu. Đừng dựa vào những phép viết lại mà bạn chưa thấy trong explain: đặt bộ lọc lên đầu bằng tay khi có thể.</p>
<p><strong>4. $sort + $limit thành top-k trên index.</strong></p>
${lenh(K, 6)}
<p>5 khoá, 5 tài liệu. Có index khớp phép sắp, máy chủ đọc năm mục đầu rồi dừng; không có index, <code>$sort</code> theo sau là <code>$limit</code> vẫn chỉ giữ top k trong bộ nhớ thay vì sắp xếp hết.</p>
${nguon('📘', 'Aggregation Pipeline Optimization — MongoDB Docs', 'Đẩy phép chiếu, dời và tách $match, gộp $sort + $limit, $lookup + $unwind', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/')}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">lọc trước</span><span class="lz-t">$match trên trường đã lưu, ở đầu pipeline</span><span class="lz-d">chỉ phần đầu pipeline dùng được index</span></div>
  <div class="lz-step"><span class="lz-k">thu nhỏ sớm</span><span class="lz-t">$project/$group trước các stage nặng</span><span class="lz-d">ít byte mỗi tài liệu hơn, ít tài liệu hơn</span></div>
  <div class="lz-step"><span class="lz-k">nối muộn</span><span class="lz-t">$lookup sau $limit, trên foreignField có index</span><span class="lz-d">Bài 5.2</span></div>
  <div class="lz-step"><span class="lz-k">kiểm chứng</span><span class="lz-t">explain mọi pipeline chạy trên đường nóng</span><span class="lz-d">phép viết lại bạn chưa thấy thì coi như không có</span></div>
</div>

<h3>Giới hạn 100 MB mỗi stage</h3>
<p>Các stage chặn — <code>$group</code>, <code>$sort</code>, <code>$bucket</code>, <code>$setWindowFields</code> — phải giữ trạng thái trong bộ nhớ: 100 MB mỗi stage. "Mọi đơn của từng khách" trên một triệu đơn vượt mức đó. Nếu truy vấn cấm dùng đĩa:</p>
${lenh(K, 7)}
<p>Từ MongoDB 6.0, tham số máy chủ <code>allowDiskUseByDefault</code> là true, nên cùng pipeline đó không kèm tuỳ chọn vẫn chạy được nhờ ghi ra tệp tạm — explain cho thấy ghi bao nhiêu:</p>
${lenh(K, 8)}
<p>Tràn năm lần, 181 MB ghi ra rồi đọc lại. Tràn đĩa là đúng nhưng chậm, và trên một máy chủ bận thì đĩa phải chia cho mọi thứ khác. Cách sửa rẻ nhất là mang theo ít hơn: <code>$$ROOT</code> đẩy cả tài liệu; chỉ đẩy hai trường báo cáo cần, hoặc chỉ đếm, làm con số đổi hẳn:</p>
${lenh(K, 9)}
<p>181,7 MB → 36,6 MB → 0. Hãy hỏi "stage sau thực sự cần gì?" trước mỗi <code>$group</code>.</p>

<h3>Giới hạn 16 MB mỗi tài liệu</h3>
<p>Output của pipeline là một con trỏ gồm nhiều tài liệu, nên tổng thể lớn bao nhiêu cũng được — nhưng mỗi tài liệu đơn lẻ giới hạn 16 MB như mọi tài liệu BSON (Bài 1.1). Gom mọi thứ vào một tài liệu là chạm trần:</p>
${lenh(K, 10)}
<p><code>BSONObjectTooLarge</code> ở 21,8 MB. Thủ phạm hay gặp là <code>$group: { _id: null, …, $push }</code>, một <code>$lookup</code> có mảng nối không giới hạn (Bài 5.2), và một <code>$facet</code> trả về danh sách. Hãy trả về nhiều tài liệu nhỏ, hoặc giới hạn mảng (<code>$slice</code>, <code>$topN</code>).</p>
${nguon('📘', 'Aggregation Pipeline Limits — MongoDB Docs', 'Tài liệu kết quả 16 MB, 100 MB mỗi stage, allowDiskUseByDefault, 1000 stage', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline-limits/')}

<h3>View vật chất hoá bằng $merge: tính một lần, đọc nhiều lần</h3>
<p>Biểu đồ doanh thu theo ngày suốt một năm chạy cùng một phép aggregation ở mỗi lượt xem trang. Thay vào đó, lưu kết quả vào một collection và làm mới nó theo lịch. <code>$merge</code> ghi output của pipeline vào một collection, từng tài liệu một, so khớp theo <code>_id</code> (hoặc một trường unique khác):</p>
${lenh(K, 11)}
<p>287 ngày có bán hàng. Chạy lại đúng pipeline đó lần hai: vẫn 287 — với <code>whenMatched: 'replace'</code> tài liệu của mỗi ngày được thay, không bị nhân đôi. Một việc chạy lại hai lần vẫn an toàn là thứ đầu tiên người review tìm: việc chạy lô <em>sẽ</em> bị chạy lại sau một lần lỗi. Lợi thế thật là làm mới từng phần — chỉ tính lại những ngày có thể đã đổi. Một đơn mới ngày 14/10 (giờ Việt Nam), rồi một <code>$merge</code> cho riêng ngày đó:</p>
${lenh(K, 12)}
<p>Dòng ngày 14/10 đi từ 5 lên 6 đơn; 286 dòng còn lại không bị đụng tới. Một việc chạy đêm thường tính lại "hôm qua và hôm nay" để bắt được các thay đổi muộn (một đơn bị huỷ). Có một điểm vướng, đo thật trong lab (Bài 5.6): <code>$merge</code> chỉ ghi những ngày còn đơn, nên một ngày mà đơn cuối cùng bị huỷ vẫn giữ dòng cũ — việc chạy đêm phải xoá cả những dòng nó không ghi lại.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — $merge on một trường không có index unique.</strong> So khớp trên bất kỳ trường nào khác <code>_id</code> đòi một index unique trên trường đó ở collection đích — nếu không, máy chủ không đảm bảo được chỉ khớp một tài liệu:</p>
${lenh(K, 13)}
<p>Tạo <code>{ ma: 1 }</code> unique ở collection đích trước, hoặc cho khoá của bạn làm <code>_id</code> như ở trên.</p>
</div>
<p><code>$out</code> là công cụ thô: nó thay toàn bộ collection đích bằng output của pipeline (một cách nguyên tử khi chạy xong), và giữ lại index của collection đích:</p>
${lenh(K, 14)}
<p>Tài liệu cũ mất, index <code>soDon_-1</code> còn. Dùng <code>$out</code> để dựng lại toàn bộ (một bản xuất hằng đêm), dùng <code>$merge</code> để cập nhật từng phần và để ghi vào một collection mà mã khác cũng đang ghi.</p>
<p>Còn một <em>view</em> thường thì không lưu gì — nó là một pipeline đã lưu, chạy lại mỗi lần bạn đọc:</p>
${lenh(K, 15)}
<p>View có ích để giấu bớt trường với một người dùng chỉ được đọc view, hoặc cho công cụ báo cáo một cái tên đơn giản. Nó không nhanh hơn tự chạy pipeline; cần tốc độ thì vật chất hoá bằng <code>$merge</code>.</p>
${nguon('📘', '$merge (aggregation) — MongoDB Docs', 'into, on (cần index unique), whenMatched, whenNotMatched; view vật chất hoá theo yêu cầu', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/')}
${nguon('📘', 'Views — MongoDB Docs', 'View thường so với view vật chất hoá theo yêu cầu', 'https://www.mongodb.com/docs/manual/core/views/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-12-4-materialized-view', title: 'PostgreSQL 12.4 — Materialized view', sub: 'REFRESH MATERIALIZED VIEW (CONCURRENTLY) — bản SQL của $merge' })}

<h3>🕵️ Góc hacker: API "báo cáo tuỳ biến" nhận nguyên pipeline</h3>
<p>Một số trang quản trị và tích hợp BI có "báo cáo nâng cao": trình duyệt gửi một pipeline JSON, máy chủ nối nó vào sau <code>$match</code> của mình rồi chạy. Trông thì vô hại — máy chủ đã lọc sẵn đơn PAID rồi. Đây là những gì một người dùng của API đó có thể gửi. Trước hết, một <code>$lookup</code> sang collection mà API không hề định cho xem:</p>
${lenh(K, 16)}
<p>Email và mật khẩu băm của mọi người dùng, đi qua một "báo cáo doanh số". Ở đây mã băm là giả; trong hệ thống thật chúng sẽ đi thẳng tới một dàn máy bẻ mật khẩu ngoại tuyến. Thứ hai, pipeline có thể <em>ghi</em>:</p>
${lenh(K, 17)}
<p>Một request, và chiếc laptop 9,5 triệu đồng chỉ còn 1.000 đồng trong danh mục (kịch bản đã trả lại giá ngay sau đó). Thứ ba, nếu JavaScript phía máy chủ đang bật — mặc định là bật — pipeline có thể chạy mã trên máy chủ cơ sở dữ liệu:</p>
${lenh(K, 18)}
<p>Các lớp phòng thủ, theo thứ tự mạnh dần:</p>
<ol>
<li><strong>Đừng nhận stage từ client.</strong> Nhận <em>tham số</em> (khoảng ngày, thành phố, trang) và tự dựng pipeline trong mã của bạn. Đây cùng bài học với SQL injection: dữ liệu, không phải mã (OWASP A03).</li>
<li><strong>Quyền tối thiểu cho kết nối báo cáo.</strong> Một user chỉ có <code>find</code> trên <code>orders</code> không thể <code>$lookup</code> sang <code>users</code> hay <code>$merge</code> vào <code>products</code> — máy chủ kiểm quyền với mọi collection mà pipeline đụng tới (Chương 9 dựng các role này).</li>
<li><strong>Tắt JavaScript phía máy chủ</strong> khi không dùng — <code>--noscripting</code> hoặc <code>security.javascriptEnabled: false</code>:</li>
</ol>
${lenh(K, 19)}
<ol start="4">
<li><strong>Nếu buộc phải nhận stage</strong> (một công cụ BI nội bộ), dùng danh sách trắng các stage, quét toán tử cấm ở mọi độ sâu, giới hạn độ dài, ép thêm <code>$limit</code> và <code>maxTimeMS</code>:</li>
</ol>
${lenh(K, 20)}
<p>Báo cáo hợp lệ đi qua; <code>$lookup</code> bị từ chối; còn <code>$function</code> giấu trong một <code>$match</code> qua <code>$expr</code> bị phép quét sâu tìm ra. Danh sách trắng là tuyến cuối, không phải tuyến đầu: một toán tử bạn quên cấm là một lỗ hổng. Chương 9 đi tiếp với chèn toán tử qua chuỗi truy vấn (<code>?status[$ne]=…</code>).</p>
${nguon('🛡️', 'OWASP Top 10 2021 — A03 Injection', 'Dữ liệu người dùng bị hiểu thành lệnh hoặc truy vấn, kể cả NoSQL', 'https://owasp.org/Top10/A03_2021-Injection/')}
${nguon('📘', 'Server-side JavaScript — MongoDB Docs', '$where, $function, $accumulator; tắt bằng --noscripting / security.javascriptEnabled', 'https://www.mongodb.com/docs/manual/core/server-side-javascript/')}

<h3>💼 Đi làm: bảng điều khiển làm chậm cả cửa hàng</h3>
<p>Một mẫu gặp ở nhiều dự án: bảng điều khiển quản trị chạy năm phép aggregation trên mọi đơn ở mỗi lần tải trang, đội marketing để nó mở trên màn hình treo tường tự làm mới mỗi phút, và độ trễ thanh toán tăng gấp đôi lúc 9 giờ sáng. Cách sửa bạn đề xuất được trong một pull request: chạy các pipeline nặng theo lịch với <code>$merge</code> vào các collection tổng hợp nhỏ (và, từ Chương 7, đọc chúng từ một secondary), đặt <code>maxTimeMS</code> cho các endpoint của bảng điều khiển, và dùng một user cơ sở dữ liệu chỉ-đọc riêng cho báo cáo. Đem explain của từng pipeline trước và sau — số khoá/tài liệu đã xem và có tràn đĩa không.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Làm sao biết pipeline có dùng index?"</strong> — explain: kế hoạch của stage đầu cho IXSCAN; chỉ $match/$sort ở đầu (hoặc được bộ tối ưu dời lên đầu) mới dùng được index.</li>
<li><strong>"Giới hạn 100 MB là gì, chạm vào thì sao?"</strong> — Bộ nhớ cho mỗi stage chặn; có allowDiskUse (mặc định true từ 6.0) thì tràn ra đĩa, không thì truy vấn thất bại. Giảm lượng dữ liệu mang theo.</li>
<li><strong>"$out khác $merge thế nào?"</strong> — $out thay cả collection; $merge chèn/thay/trộn từng tài liệu, hỗ trợ làm mới từng phần, cần index unique trên các trường <code>on</code>.</li>
<li><strong>"View hay view vật chất hoá?"</strong> — View tính lại mỗi lần đọc; view vật chất hoá được lưu và làm mới theo lịch — đọc nhanh, có thể cũ.</li>
<li><strong>"Nhận pipeline từ client có an toàn không?"</strong> — Không: $lookup đọc collection khác, $merge/$out ghi, $function chạy mã. Nhận tham số; user quyền tối thiểu; tắt JavaScript phía máy chủ.</li>
</ul>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy báo cáo theo tháng của Bài 5.4 và chạy qua <code>ke()</code> trên <code>ctshop.orders</code> khi chưa có index, rồi khi có <code>{ status: 1, createdAt: 1 }</code>. Kế hoạch và các bộ đếm đổi thế nào?</li>
<li>Viết một việc <code>$merge</code> duy trì <code>topKhachThang</code>: với mỗi tháng (giờ Việt Nam), 10 khách tốt nhất kèm hạng. Làm cho nó chạy hai lần vẫn an toàn, và chỉ làm mới tháng hiện tại.</li>
<li>Viết lại <code>[{ $set: { thang: { $month: '$ngay' } } }, { $match: { thang: 3, trangThai: 'PAID' } }, { $count: 'n' }]</code> trên <code>ch4.don</code> sao cho nó chỉ đọc đúng những khoá index cần thiết. Chứng minh bằng <code>ke()</code>.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Không index: COLLSCAN 2.000 tài liệu. Có index: IXSCAN trên <code>status_1_createdAt_1</code> với số khoá ≈ 1.425 đơn đã bán trong năm 2026 — <code>$in</code> trên status là phép bằng, khoảng ngày đứng sau nó (ESR, Bài 4.3). Trên 2.000 tài liệu thì thời gian chênh ít; các bộ đếm mới là thứ tăng theo quy mô.</p>
<p>2. Pipeline: <code>$match</code> đơn đã bán trong khoảng tháng → <code>$group</code> theo <code>{ thang, kh }</code> → <code>$setWindowFields</code> phân vùng theo tháng với <code>$rank</code> → <code>$match: { hang: { $lte: 10 } }</code> → <code>$merge: { into: 'topKhachThang', whenMatched: 'replace' }</code>. <code>_id</code> do <code>$group</code> sinh ra đã là <code>{ thang, kh }</code>, nên nó tất định và việc chạy hai lần vẫn an toàn (trên dữ liệu lab: 100 dòng sau lần đầu, vẫn 100 sau lần hai). Điểm cần nói rõ: một khách rơi khỏi top 10 vẫn còn dòng cũ — xoá các dòng của tháng trước khi merge, hoặc <code>$merge</code> vào một tài liệu mỗi tháng chứa mảng 10 người.</p>
<p>3. "Tháng 3" không phải một khoảng duy nhất qua nhiều năm, nên viết mỗi năm một khoảng: <code>{ trangThai: 'PAID', $or: [{ ngay: { $gte: ISODate('2025-03-01'), $lt: ISODate('2025-04-01') } }, { ngay: { $gte: ISODate('2026-03-01'), $lt: ISODate('2026-04-01') } }] }</code> (đổi sang mốc giờ Việt Nam nếu nghiệp vụ tính theo giờ Việt Nam). <code>ke()</code>: OR của hai IXSCAN, 22.240 khoá cho 22.240 đơn, 0 tài liệu. Bản gốc không đến nỗi thảm hoạ nhờ bộ tối ưu — nó dời phần <code>trangThai</code> lên index và phủ <code>ngay</code> — nhưng vẫn đọc cả 250.324 khoá PAID để giữ lại 22.240: tốn gấp mười một lần.</p>
</details>
<p><strong>Xong khi:</strong> với mọi pipeline trên đường nóng, bạn đưa ra được explain của nó, nói được nó có tràn đĩa không, và nói được kết quả của nó có nên được lưu lại thay vì tính lại không.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Tối ưu pipeline', 'Các phép viết lại máy chủ áp dụng: dời/tách $match, đẩy phép chiếu, $sort+$limit, $lookup+$unwind.'],
  ['Stage chặn (blocking)', 'Stage cần toàn bộ đầu vào trước khi cho ra: $group, $sort, $bucket, $setWindowFields.'],
  ['allowDiskUse', 'Cho stage chặn tràn ra tệp tạm khi quá 100 MB; mặc định true từ 6.0.'],
  ['Tràn đĩa (spill)', 'Ghi một phần trạng thái của stage ra đĩa; thấy trong explain qua usedDisk, spills, spilledBytes.'],
  ['BSONObjectTooLarge', 'Lỗi khi một tài liệu kết quả vượt 16 MB.'],
  ['$merge', 'Ghi kết quả vào một collection theo từng tài liệu (insert/replace/merge/keep/fail); nền của view vật chất hoá.'],
  ['$out', 'Thay toàn bộ một collection bằng kết quả, giữ index của nó.'],
  ['View', 'Pipeline đã lưu, tính lại ở mỗi lần đọc; không lưu dữ liệu.'],
  ['--noscripting', 'Tắt JavaScript phía máy chủ ($where, $function, $accumulator).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc explain của mọi pipeline nóng; chỉ phần đầu dùng được index.</li>
<li>Bộ tối ưu dời và tách <code>$match</code>, nhưng không index được trường tính ra — viết điều kiện trên trường đã lưu.</li>
<li>100 MB mỗi stage chặn: tràn đĩa (chậm) hoặc thất bại; mang ít trường hơn (181,7 → 36,6 → 0 MB).</li>
<li>16 MB mỗi tài liệu kết quả: tránh <code>$push</code> khổng lồ, phép nối không giới hạn và facet trả danh sách.</li>
<li>Lưu báo cáo lặp lại bằng <code>$merge</code> (chạy lại an toàn, làm mới từng phần); <code>$out</code> dựng lại; view thì tính lại.</li>
<li>Đừng bao giờ chạy pipeline do client viết: chỉ nhận tham số, quyền tối thiểu, không JavaScript phía máy chủ.</li>
</ul>
</div>
`,
};
