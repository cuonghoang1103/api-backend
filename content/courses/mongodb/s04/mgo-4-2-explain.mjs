/**
 * 4.2 — Đọc explain("executionStats") (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-2-exp'] (MongoDB 8.0.38, ch4.don 1.000.000 đơn của s04-1; index khach_1, trangThai_1, tinh_1_ngay_-1).
 * Số đối chiếu (tất định): NEW + Huế: IXSCAN trangThai_1 9909 khoá → FETCH 9909 → lọc tinh còn 1669 → SORT; kế hoạch thua tinh_1_ngay_-1;
 * thử: trangThai_1 trả 101 / tinh_1_ngay_-1 trả 88 sau 10011 works; DELIVERED + Huế chọn tinh_1_ngay_-1 (167223 khoá, 92095 đơn);
 * hint index thua cho NEW: 167223 khoá. ms đổi theo lần chạy.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '4.2 — Reading explain("executionStats")|||4.2 — Đọc explain("executionStats")',
  slug: 'mgo-4-2-explain',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đọc explain từ dưới lên như đọc một dây chuyền: IXSCAN 9.909 khoá → FETCH 9.909 tài liệu → lọc tỉnh còn 1.669 → SORT trong bộ nhớ. Ba mức queryPlanner / executionStats / allPlansExecution; bộ lập kế hoạch cho các index "đua thử" rồi chọn kẻ thắng; plan cache theo hình dạng truy vấn (trạng thái Inactive/Active, explain không dùng cache); cùng hình dạng mà giá trị khác (NEW 1% với DELIVERED 55%) thì kế hoạch khác; hint để so sánh chứ không để sửa lâu dài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Reading explain("executionStats")</h2>
<p class="lead">In Lesson 4.1 you kept five numbers from explain. A real explain output is a hundred lines of nested JSON, and the people who are good at performance work are simply the ones who can read it quickly. This lesson teaches you to read it like a production line — from the bottom stage up — and to understand how MongoDB chose that plan in the first place.</p>

<h3>An everyday picture: a navigation app choosing a route</h3>
<p>Ask a map app for a route and it considers several roads, estimates them, and shows you one, with the alternatives greyed out. <code>explain()</code> is that screen for a query: the <em>winning plan</em> (the route chosen), the <em>rejected plans</em> (the grey ones), and — with <code>executionStats</code> — what actually happened on the trip: how many streets you drove through (keys examined), how many houses you stopped at (documents examined), how many deliveries you made (documents returned).</p>

<p>Setup for this lesson: the million orders of Lesson 4.1 with three single-purpose indexes — <code>khach_1</code>, <code>trangThai_1</code> and <code>tinh_1_ngay_-1</code>. The query is the support screen "new orders from Huế, newest first".</p>

<h3>Level 1 — queryPlanner: the plan, without running it</h3>
${lenh('s04-2-exp', 0)}
<p>Read the tree from the <strong>innermost stage outwards</strong> — data flows upwards:</p>
<ol>
<li><strong>IXSCAN</strong> on <code>trangThai_1</code> with bounds <code>["NEW", "NEW"]</code>: walk only the NEW keys.</li>
<li><strong>FETCH</strong> with <code>filter: { tinh: { $eq: 'Huế' } }</code>: load each document and drop those not in Huế. A <code>filter</code> on a FETCH stage means "this condition was <em>not</em> answered by the index; it is checked document by document".</li>
<li><strong>SORT</strong>: sort the survivors by <code>ngay</code> in memory, because nothing in <code>trangThai_1</code> gives date order.</li>
</ol>
<p><code>parsedQuery</code> shows how MongoDB normalised your filter (an implicit <code>$and</code> of two <code>$eq</code>), and one plan was rejected. <code>queryPlanner</code> alone is cheap and safe to run on production: it does not execute the query.</p>

<h3>Level 2 — executionStats: what each stage really did</h3>
${lenh('s04-2-exp', 1)}
<p>Now with real counters per stage. Follow the numbers upwards: IXSCAN produced 9,909 keys → FETCH read 9,909 documents and passed on 1,669 (the Huế ones) → SORT returned 1,669. <code>works</code> is the number of small work units each stage performed; SORT has more works than results because it first has to consume all its input — a SORT stage is <strong>blocking</strong>: it returns nothing until its child is exhausted.</p>
<p>The diagnosis is in two ratios:</p>
<ul>
<li><code>totalDocsExamined / nReturned</code> = 9,909 / 1,669 ≈ 6: the server read six documents for every one it returned. The index narrowed the search by status but not by province.</li>
<li>a <strong>SORT</strong> stage: the result had to be sorted in memory.</li>
</ul>
<p>Both point to the same fix — one compound index covering status, province and date in the right order — which is exactly Lesson 4.3. The healthy target for a selective query: keys ≈ docs ≈ nReturned and no SORT stage.</p>

<h3>Level 3 — allPlansExecution: the race between candidate plans</h3>
<p>How did MongoDB choose <code>trangThai_1</code> over <code>tinh_1_ngay_-1</code>? It does not have statistics like a SQL optimiser. The classic multi-planner <strong>runs every candidate plan for a short trial</strong>, interleaved, and the plan that produces the most results for the least work wins:</p>
${lenh('s04-2-exp', 2)}
<p>Both candidates did 10,011 work units in the trial. <code>trangThai_1</code> had read all 9,909 NEW keys, finished its sort and produced 101 results (a full first batch); <code>tinh_1_ngay_-1</code> — walking Huế orders already in date order — had found only 88 that were NEW. The first wins. Notice the trial cost: in the worst case every candidate index does real work before one is chosen. That is one more reason not to keep many overlapping indexes.</p>
${nguon('📘', 'Query Plans — MongoDB Docs', 'Multi-planner trial, plan cache states (Missing / Inactive / Active), flushes', 'https://www.mongodb.com/docs/manual/core/query-plans/')}

<h3>The plan cache: plans are remembered by query shape</h3>
<p>Racing plans on every request would be wasteful, so the winner is cached per <strong>plan cache query shape</strong>: the filter fields and operators, the sort and the projection — <em>not</em> the values. NEW/Huế and PAID/Huế have the same shape. Run the query three times (twice NEW, once PAID), then look at the cache:</p>
${lenh('s04-2-exp', 3)}
<p>One entry: <code>planCacheKey</code> identifies the shape, the cached plan uses <code>trangThai_1</code>, two candidate plans were evaluated, and the entry is <code>isActive: false</code>. The documentation describes three states: <em>Missing</em> → the first run plans and creates an <em>Inactive</em> placeholder with its work value; a later run that needs no more work than that turns it <em>Active</em>, and only an active entry is used without replanning; a run that needs more work (here, the PAID query, which returns many more orders) leaves it inactive and raises its work value. The cache is lost on restart and cleared for a collection on any index change (create, drop, <em>hide</em>). One detail matters for your experiments: <strong>explain ignores the plan cache</strong> and does not write to it — that is why the demo ran the queries normally before reading <code>$planCacheStats</code>.</p>

<h3>Same shape, different values, different best plan</h3>
${lenh('s04-2-exp', 4)}
<p>For NEW (1% of orders) the status index is selective: 9,909 keys. For DELIVERED (55%) the status index would be terrible — 550,000 keys — so the planner picked the province index instead: 167,223 keys, 92,095 returned. This is the classic plan cache danger in every database: a plan that is perfect for a rare value is cached and then reused for a common one, or the other way round. MongoDB mitigates it (the planner keeps evaluating an active entry, and one that no longer meets its recorded work goes back to Inactive, so the shape is planned again), but the real fix is again an index that is good for every value — the compound index of Lesson 4.3.</p>

<h3>hint(): forcing a plan — to compare, not to fix</h3>
${lenh('s04-2-exp', 5)}
<p>Forcing the losing index for the NEW query costs 167,223 keys instead of 9,909: the planner was right. <code>hint()</code> is a measuring tool — "what would this other index do?" — and an emergency brake. As a permanent fix in application code it is fragile: rename or drop that index and every request with the hint fails with an error, and the hint keeps forcing yesterday's best plan after the data has changed.</p>

<h3>explain works for aggregate, count, update, delete too</h3>
${lenh('s04-2-exp', 6)}
<p>A <code>$match</code> (and <code>$sort</code>) at the <em>start</em> of a pipeline is pushed into the query layer and uses indexes just like <code>find</code>. Chapter 5 relies on this. You can also explain <code>count</code>, <code>distinct</code>, <code>updateOne/updateMany</code>, <code>deleteMany</code> — an update without an index is a COLLSCAN that also takes write locks on every match, which is worse than a slow read.</p>

<h3>A reading checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · bottom stage</span><span class="lz-t">COLLSCAN or IXSCAN? which index, which bounds?</span><span class="lz-d">bounds [MinKey, MaxKey] = whole index</span></div>
  <div class="lz-step"><span class="lz-k">2 · filters</span><span class="lz-t">a filter on FETCH = condition not covered by the index</span><span class="lz-d">candidate for a compound index</span></div>
  <div class="lz-step"><span class="lz-k">3 · SORT stage?</span><span class="lz-t">in-memory, blocking, 100 MB limit</span><span class="lz-d">index that matches the sort</span></div>
  <div class="lz-step"><span class="lz-k">4 · ratios</span><span class="lz-t">keys : docs : nReturned</span><span class="lz-d">aim for ≈ 1 : 1 : 1</span></div>
  <div class="lz-step"><span class="lz-k">5 · rejectedPlans</span><span class="lz-t">which indexes competed?</span><span class="lz-d">overlapping indexes cost trial work</span></div>
</div>
${nguon('📘', 'Explain Results — MongoDB Docs', 'queryPlanner, executionStats, allPlansExecution fields', 'https://www.mongodb.com/docs/manual/reference/explain-results/')}
<p>PostgreSQL's <code>EXPLAIN ANALYZE</code> is read the same way (bottom-up, actual rows per node); the big difference is that PostgreSQL estimates with table statistics while MongoDB races candidates:</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Reading a plan', sub: 'EXPLAIN vs EXPLAIN ANALYZE, read bottom-up' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — "it says IXSCAN, so it is fine".</strong> The first explain of this lesson used an index and was still poor: six documents read per document returned and an in-memory sort. An IXSCAN with bounds <code>[MinKey, MaxKey]</code> walks the whole index and can be slower than a COLLSCAN. Always read the counters and look for SORT and FETCH filters, not just the stage name.</p>
</div>

<h3>💼 At work: explain in a pull request</h3>
<p>Teams that take performance seriously ask for the explain of every new query in the pull request description: the query, the index it relies on, and the three counters on realistic data. In Spring Data you can get it with <code>mongoTemplate.getCollection(...).find(filter).explain()</code>; in Node with <code>collection.find(filter).explain('executionStats')</code>. A reviewer can then reject "COLLSCAN on orders" before it reaches production — much cheaper than finding it in the slow query log (Lesson 4.6).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you read an explain plan?"</strong> — From the innermost stage up; check the access stage and bounds, filters on FETCH, a SORT stage, and keys/docs examined against nReturned.</li>
<li><strong>"How does MongoDB choose between two indexes?"</strong> — The multi-planner runs the candidates for a short trial and picks the one that returns most results for least work; the winner is cached per query shape.</li>
<li><strong>"What is a query shape?"</strong> — Filter fields and operators, sort and projection, without the values; same shape ⇒ same cached plan.</li>
<li><strong>"When would you use hint()?"</strong> — To compare plans while tuning, or as a temporary emergency measure; not as a permanent fix.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>For <code>db.don.find({ khach: 'KH00077', trangThai: 'PAID' })</code> with the three indexes of this lesson: which index wins, is there a filter on FETCH, and what are the three counters?</li>
<li>Run <code>db.don.find({ tinh: 'Huế' }).sort({ ngay: -1 }).limit(5).explain('executionStats')</code>. Is there a SORT stage? Why not?</li>
<li>Run the NEW/Huế query twice normally, then <code>$planCacheStats</code>. Then <code>db.don.hideIndex('trangThai_1')</code> and look at <code>$planCacheStats</code> again. What happened, and why? (Unhide afterwards.)</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>khach_1</code>: IXSCAN on KH00077 (17 keys), FETCH with <code>filter: { trangThai: { $eq: 'PAID' } }</code> (17 documents read), 4 returned. A customer code is far more selective than a status, so the planner picks it; the status check happens per document, which is fine for 17 documents.</p>
<p>2. No SORT: <code>tinh_1_ngay_-1</code> is already ordered by date inside each province, so the plan is LIMIT ← FETCH ← IXSCAN and it stops after 5 keys.</p>
<p>3. The entry disappears: hiding an index is a DDL event and clears the collection's plan cache (documented under "Plan Cache Flushes"). After <code>unhideIndex</code> the next queries plan again.</p>
</details>
<p><strong>Done when:</strong> you can take any explain output and say in one sentence what is wrong with the plan, or that nothing is.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['explain verbosity', 'queryPlanner (plan only), executionStats (run the winner, counters), allPlansExecution (also the trial of every candidate).'],
  ['winningPlan / rejectedPlans', 'The chosen plan tree and the candidate plans that lost.'],
  ['Stage', 'One step of the plan: COLLSCAN, IXSCAN, FETCH, SORT, LIMIT, PROJECTION_*, SORT_MERGE, COUNT_SCAN…'],
  ['works', 'Units of work performed by a stage; compares effort between stages and plans.'],
  ['Blocking stage', 'A stage that must consume all input before returning anything — SORT.'],
  ['Multi-planner', 'MongoDB\'s classic plan selection: race candidates for a short trial, keep the most productive.'],
  ['Plan cache query shape', 'Filter fields/operators + sort + projection without values; key of the plan cache.'],
  ['hint()', 'Forces a specific index; for comparison and emergencies.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Read explain bottom-up: IXSCAN 9,909 keys → FETCH filter Huế → 1,669 → SORT in memory.</li>
<li>Diagnose with ratios (docs/nReturned ≈ 6 here) and the presence of SORT and FETCH filters.</li>
<li>The multi-planner races candidate indexes; the winner is cached per query shape (Inactive → Active).</li>
<li>explain ignores the plan cache; index changes clear it.</li>
<li>NEW and DELIVERED have the same shape but different best plans — design an index good for every value.</li>
<li><code>hint()</code> to compare; not as a permanent fix.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Đọc explain("executionStats")</h2>
<p class="lead">Ở Bài 4.1 bạn giữ lại năm con số của explain. Một output explain thật dài cả trăm dòng JSON lồng nhau, và những người giỏi tối ưu hiệu năng đơn giản là những người đọc nó nhanh. Bài này dạy bạn đọc nó như đọc một dây chuyền sản xuất — từ tầng dưới cùng đi lên — và hiểu MongoDB đã chọn kế hoạch đó ra sao.</p>

<h3>Hình ảnh đời thường: ứng dụng bản đồ chọn đường</h3>
<p>Hỏi ứng dụng bản đồ một lộ trình, nó cân nhắc vài con đường, ước lượng từng đường, rồi chỉ cho bạn một, các đường còn lại tô xám. <code>explain()</code> chính là màn hình đó cho một truy vấn: <em>kế hoạch thắng</em> (đường được chọn), <em>kế hoạch bị loại</em> (các đường xám), và — với <code>executionStats</code> — điều thật sự xảy ra trên chuyến đi: bạn đã đi qua bao nhiêu con phố (số khoá đã xét), dừng ở bao nhiêu nhà (số tài liệu đã xét), giao được bao nhiêu kiện (số tài liệu trả về).</p>

<p>Chuẩn bị cho bài: một triệu đơn của Bài 4.1 với ba index đơn mục đích — <code>khach_1</code>, <code>trangThai_1</code> và <code>tinh_1_ngay_-1</code>. Truy vấn là màn hình hỗ trợ "đơn mới ở Huế, mới nhất trước".</p>

<h3>Mức 1 — queryPlanner: kế hoạch, chưa chạy</h3>
${lenh('s04-2-exp', 0)}
<p>Đọc cây từ <strong>tầng trong cùng ra ngoài</strong> — dữ liệu chảy từ dưới lên:</p>
<ol>
<li><strong>IXSCAN</strong> trên <code>trangThai_1</code> với khoảng <code>["NEW", "NEW"]</code>: chỉ đi qua các khoá NEW.</li>
<li><strong>FETCH</strong> kèm <code>filter: { tinh: { $eq: 'Huế' } }</code>: nạp từng tài liệu và bỏ những đơn không ở Huế. Một <code>filter</code> nằm trên tầng FETCH nghĩa là "điều kiện này index <em>không</em> trả lời được; phải kiểm từng tài liệu một".</li>
<li><strong>SORT</strong>: sắp các đơn còn lại theo <code>ngay</code> trong bộ nhớ, vì <code>trangThai_1</code> không cho sẵn thứ tự ngày.</li>
</ol>
<p><code>parsedQuery</code> cho thấy MongoDB chuẩn hoá bộ lọc của bạn thế nào (một <code>$and</code> ngầm của hai <code>$eq</code>), và có một kế hoạch bị loại. Riêng <code>queryPlanner</code> thì rẻ và an toàn để chạy trên production: nó không thực thi truy vấn.</p>

<h3>Mức 2 — executionStats: mỗi tầng thực sự đã làm gì</h3>
${lenh('s04-2-exp', 1)}
<p>Giờ có bộ đếm thật cho từng tầng. Lần theo các con số từ dưới lên: IXSCAN cho ra 9.909 khoá → FETCH đọc 9.909 tài liệu và chuyển tiếp 1.669 (các đơn ở Huế) → SORT trả 1.669. <code>works</code> là số đơn vị công việc nhỏ mỗi tầng đã làm; SORT có nhiều works hơn số kết quả vì nó phải nuốt hết đầu vào trước — tầng SORT là tầng <strong>chặn</strong> (blocking): nó không trả gì cho tới khi tầng con cạn.</p>
<p>Chẩn đoán nằm ở hai chỗ:</p>
<ul>
<li><code>totalDocsExamined / nReturned</code> = 9.909 / 1.669 ≈ 6: máy chủ đọc sáu tài liệu cho mỗi tài liệu trả về. Index thu hẹp được theo trạng thái nhưng không theo tỉnh.</li>
<li>có tầng <strong>SORT</strong>: kết quả phải sắp xếp trong bộ nhớ.</li>
</ul>
<p>Cả hai chỉ về cùng một cách sửa — một index phức hợp gồm trạng thái, tỉnh và ngày theo đúng thứ tự — chính là Bài 4.3. Mục tiêu lành mạnh cho một truy vấn chọn lọc: số khoá ≈ số tài liệu ≈ nReturned và không có tầng SORT.</p>

<h3>Mức 3 — allPlansExecution: cuộc đua giữa các kế hoạch ứng viên</h3>
<p>MongoDB đã chọn <code>trangThai_1</code> thay vì <code>tinh_1_ngay_-1</code> thế nào? Nó không có thống kê như bộ tối ưu của SQL. Bộ lập kế hoạch đa phương án (multi-planner) kiểu cổ điển <strong>cho mọi kế hoạch ứng viên chạy thử một lúc ngắn</strong>, xen kẽ nhau, và kế hoạch cho ra nhiều kết quả nhất với ít công nhất sẽ thắng:</p>
${lenh('s04-2-exp', 2)}
<p>Cả hai ứng viên đều làm 10.011 đơn vị công việc trong lượt thử. <code>trangThai_1</code> đã đọc hết 9.909 khoá NEW, sắp xong và cho ra 101 kết quả (đủ một lô đầu tiên); <code>tinh_1_ngay_-1</code> — đi qua các đơn ở Huế vốn đã theo thứ tự ngày — mới tìm được 88 đơn NEW. Kế hoạch đầu thắng. Để ý cái giá của lượt thử: trong trường hợp xấu nhất, mọi index ứng viên đều phải làm việc thật trước khi chọn được một. Thêm một lý do để không giữ nhiều index chồng chéo.</p>
${nguon('📘', 'Query Plans — MongoDB Docs', 'Lượt thử của multi-planner, trạng thái plan cache (Missing / Inactive / Active), khi nào bị xoá', 'https://www.mongodb.com/docs/manual/core/query-plans/')}

<h3>Plan cache: kế hoạch được nhớ theo hình dạng truy vấn</h3>
<p>Đua kế hoạch ở mỗi lượt gọi thì phí, nên kẻ thắng được lưu theo <strong>hình dạng truy vấn của plan cache</strong>: các trường và toán tử trong bộ lọc, phần sắp xếp và phần chiếu — <em>không</em> tính giá trị. NEW/Huế và PAID/Huế có cùng hình dạng. Chạy truy vấn ba lần (hai lần NEW, một lần PAID), rồi xem cache:</p>
${lenh('s04-2-exp', 3)}
<p>Một mục: <code>planCacheKey</code> định danh hình dạng, kế hoạch lưu dùng <code>trangThai_1</code>, đã đánh giá hai kế hoạch ứng viên, và mục đang <code>isActive: false</code>. Tài liệu mô tả ba trạng thái: <em>Missing</em> → lần chạy đầu lập kế hoạch và tạo một mục giữ chỗ <em>Inactive</em> kèm giá trị công việc của nó; một lần chạy sau tốn không hơn mức đó sẽ chuyển nó thành <em>Active</em>, và chỉ mục active mới được dùng mà không lập kế hoạch lại; một lần chạy tốn hơn (ở đây là truy vấn PAID, trả nhiều đơn hơn hẳn) thì để nó tiếp tục inactive và nâng giá trị công việc lên. Cache mất khi khởi động lại và bị xoá cho collection mỗi khi index thay đổi (tạo, xoá, <em>ẩn</em>). Một chi tiết quan trọng khi bạn thử nghiệm: <strong>explain bỏ qua plan cache</strong> và không ghi vào nó — vì thế bản demo chạy truy vấn bình thường trước rồi mới đọc <code>$planCacheStats</code>.</p>

<h3>Cùng hình dạng, giá trị khác, kế hoạch tốt nhất khác</h3>
${lenh('s04-2-exp', 4)}
<p>Với NEW (1% số đơn), index trạng thái chọn lọc tốt: 9.909 khoá. Với DELIVERED (55%), index trạng thái sẽ rất tệ — 550.000 khoá — nên bộ lập kế hoạch chọn index tỉnh: 167.223 khoá, trả 92.095 đơn. Đây là mối nguy kinh điển của plan cache ở mọi cơ sở dữ liệu: một kế hoạch hoàn hảo cho giá trị hiếm được lưu rồi dùng lại cho giá trị phổ biến, hoặc ngược lại. MongoDB có cách giảm nhẹ (bộ lập kế hoạch tiếp tục đánh giá mục active, mục nào không còn đạt mức công việc đã ghi thì quay về Inactive, và hình dạng đó được lập kế hoạch lại), nhưng cách sửa thật vẫn là một index tốt cho mọi giá trị — index phức hợp của Bài 4.3.</p>

<h3>hint(): ép một kế hoạch — để so sánh, không phải để sửa</h3>
${lenh('s04-2-exp', 5)}
<p>Ép index thua cuộc cho truy vấn NEW tốn 167.223 khoá thay vì 9.909: bộ lập kế hoạch đã đúng. <code>hint()</code> là dụng cụ đo — "index kia sẽ làm gì?" — và là phanh khẩn cấp. Làm cách sửa vĩnh viễn trong mã ứng dụng thì nó mong manh: đổi tên hay xoá index đó là mọi lượt gọi có hint đều lỗi, và hint cứ ép kế hoạch tốt nhất của hôm qua dù dữ liệu đã đổi.</p>

<h3>explain dùng được cho cả aggregate, count, update, delete</h3>
${lenh('s04-2-exp', 6)}
<p>Một <code>$match</code> (và <code>$sort</code>) ở <em>đầu</em> pipeline được đẩy xuống tầng truy vấn và dùng index y như <code>find</code>. Chương 5 dựa vào điều này. Bạn cũng explain được <code>count</code>, <code>distinct</code>, <code>updateOne/updateMany</code>, <code>deleteMany</code> — một lệnh cập nhật không có index là một COLLSCAN còn giữ khoá ghi trên mọi tài liệu khớp, tệ hơn một lệnh đọc chậm.</p>

<h3>Danh sách đọc explain</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · tầng dưới cùng</span><span class="lz-t">COLLSCAN hay IXSCAN? index nào, khoảng nào?</span><span class="lz-d">khoảng [MinKey, MaxKey] = cả index</span></div>
  <div class="lz-step"><span class="lz-k">2 · filter</span><span class="lz-t">filter trên FETCH = điều kiện index không phủ</span><span class="lz-d">ứng viên cho index phức hợp</span></div>
  <div class="lz-step"><span class="lz-k">3 · có SORT?</span><span class="lz-t">trong bộ nhớ, chặn, giới hạn 100 MB</span><span class="lz-d">index khớp với sort</span></div>
  <div class="lz-step"><span class="lz-k">4 · tỉ lệ</span><span class="lz-t">khoá : tài liệu : nReturned</span><span class="lz-d">nhắm ≈ 1 : 1 : 1</span></div>
  <div class="lz-step"><span class="lz-k">5 · rejectedPlans</span><span class="lz-t">index nào đã tranh nhau?</span><span class="lz-d">index chồng chéo tốn công thử</span></div>
</div>
${nguon('📘', 'Explain Results — MongoDB Docs', 'Các trường của queryPlanner, executionStats, allPlansExecution', 'https://www.mongodb.com/docs/manual/reference/explain-results/')}
<p><code>EXPLAIN ANALYZE</code> của PostgreSQL đọc cùng một cách (từ dưới lên, số dòng thật ở mỗi nút); khác biệt lớn là PostgreSQL ước lượng bằng thống kê của bảng, còn MongoDB cho các ứng viên đua thử:</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Đọc kế hoạch truy vấn', sub: 'EXPLAIN với EXPLAIN ANALYZE, đọc từ dưới lên' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nó ghi IXSCAN, vậy là ổn".</strong> Explain đầu tiên của bài này có dùng index mà vẫn kém: đọc sáu tài liệu cho mỗi tài liệu trả về, cộng một lần sắp xếp trong bộ nhớ. Một IXSCAN có khoảng <code>[MinKey, MaxKey]</code> đi qua cả index và có thể chậm hơn COLLSCAN. Luôn đọc các bộ đếm và tìm tầng SORT cùng filter trên FETCH, đừng chỉ nhìn tên tầng.</p>
</div>

<h3>💼 Đi làm: explain trong pull request</h3>
<p>Những nhóm nghiêm túc với hiệu năng yêu cầu explain của mọi truy vấn mới ngay trong mô tả pull request: truy vấn, index nó dựa vào, và ba bộ đếm trên dữ liệu sát thực tế. Trong Spring Data bạn lấy được bằng <code>mongoTemplate.getCollection(...).find(filter).explain()</code>; trong Node bằng <code>collection.find(filter).explain('executionStats')</code>. Người review khi đó gạt được "COLLSCAN trên orders" trước khi nó lên production — rẻ hơn nhiều so với phát hiện nó trong log truy vấn chậm (Bài 4.6).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Bạn đọc một explain plan thế nào?"</strong> — Từ tầng trong cùng đi lên; xem tầng truy cập và khoảng, filter trên FETCH, có tầng SORT không, và số khoá/tài liệu đã xét so với nReturned.</li>
<li><strong>"MongoDB chọn giữa hai index thế nào?"</strong> — Multi-planner cho các ứng viên chạy thử một lúc ngắn và chọn cái trả nhiều kết quả nhất với ít công nhất; kẻ thắng được lưu theo hình dạng truy vấn.</li>
<li><strong>"Hình dạng truy vấn là gì?"</strong> — Các trường và toán tử của bộ lọc, phần sắp xếp và phần chiếu, không tính giá trị; cùng hình dạng ⇒ cùng kế hoạch trong cache.</li>
<li><strong>"Khi nào bạn dùng hint()?"</strong> — Để so sánh kế hoạch khi tối ưu, hoặc tạm thời khi khẩn cấp; không làm cách sửa vĩnh viễn.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Với <code>db.don.find({ khach: 'KH00077', trangThai: 'PAID' })</code> và ba index của bài: index nào thắng, có filter trên FETCH không, và ba bộ đếm là bao nhiêu?</li>
<li>Chạy <code>db.don.find({ tinh: 'Huế' }).sort({ ngay: -1 }).limit(5).explain('executionStats')</code>. Có tầng SORT không? Vì sao không?</li>
<li>Chạy truy vấn NEW/Huế hai lần bình thường, rồi <code>$planCacheStats</code>. Sau đó <code>db.don.hideIndex('trangThai_1')</code> và xem lại <code>$planCacheStats</code>. Chuyện gì xảy ra, vì sao? (Xong thì bỏ ẩn.)</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>khach_1</code>: IXSCAN trên KH00077 (17 khoá), FETCH kèm <code>filter: { trangThai: { $eq: 'PAID' } }</code> (đọc 17 tài liệu), trả 4 đơn. Mã khách chọn lọc hơn trạng thái rất nhiều nên bộ lập kế hoạch chọn nó; phần kiểm trạng thái làm theo từng tài liệu, với 17 tài liệu thì ổn.</p>
<p>2. Không có SORT: <code>tinh_1_ngay_-1</code> đã xếp theo ngày bên trong mỗi tỉnh, nên kế hoạch là LIMIT ← FETCH ← IXSCAN và dừng sau 5 khoá.</p>
<p>3. Mục cache biến mất: ẩn index là một sự kiện DDL và xoá plan cache của collection (ghi trong mục "Plan Cache Flushes" của tài liệu). Sau <code>unhideIndex</code>, các truy vấn kế tiếp lập kế hoạch lại.</p>
</details>
<p><strong>Xong khi:</strong> bạn cầm bất kỳ output explain nào và nói được trong một câu kế hoạch đó hỏng ở đâu, hoặc không hỏng gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Mức chi tiết của explain', 'queryPlanner (chỉ kế hoạch), executionStats (chạy kẻ thắng, có bộ đếm), allPlansExecution (thêm lượt thử của mọi ứng viên).'],
  ['winningPlan / rejectedPlans', 'Cây kế hoạch được chọn và các kế hoạch ứng viên thua cuộc.'],
  ['Tầng (stage)', 'Một bước của kế hoạch: COLLSCAN, IXSCAN, FETCH, SORT, LIMIT, PROJECTION_*, SORT_MERGE, COUNT_SCAN…'],
  ['works', 'Số đơn vị công việc một tầng đã làm; dùng so mức tốn công giữa các tầng và các kế hoạch.'],
  ['Tầng chặn (blocking)', 'Tầng phải nuốt hết đầu vào rồi mới trả gì đó — SORT.'],
  ['Multi-planner', 'Cách chọn kế hoạch cổ điển của MongoDB: cho ứng viên đua thử một lúc ngắn, giữ kế hoạch năng suất nhất.'],
  ['Hình dạng truy vấn (query shape)', 'Trường/toán tử của bộ lọc + sắp xếp + chiếu, không tính giá trị; là khoá của plan cache.'],
  ['hint()', 'Ép dùng một index cụ thể; để so sánh và khi khẩn cấp.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc explain từ dưới lên: IXSCAN 9.909 khoá → FETCH lọc Huế → 1.669 → SORT trong bộ nhớ.</li>
<li>Chẩn đoán bằng tỉ lệ (ở đây số tài liệu / nReturned ≈ 6) và việc có tầng SORT hay filter trên FETCH.</li>
<li>Multi-planner cho các index ứng viên đua thử; kẻ thắng được lưu theo hình dạng truy vấn (Inactive → Active).</li>
<li>explain bỏ qua plan cache; đổi index là cache bị xoá.</li>
<li>NEW và DELIVERED cùng hình dạng nhưng kế hoạch tốt nhất khác nhau — hãy thiết kế index tốt cho mọi giá trị.</li>
<li><code>hint()</code> để so sánh; không làm cách sửa vĩnh viễn.</li>
</ul>
</div>
`,
};
