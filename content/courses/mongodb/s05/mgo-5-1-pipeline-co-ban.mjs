/**
 * 5.1 — Pipeline cơ bản: $match, $group, $sort, $project (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-1-co-ban'] (MongoDB 8.0.38; kịch bản demo/s05/s05-1-co-ban.txt tự nạp lại CT Shop + 1.000.000 đơn ch4).
 * Số đối chiếu (tất định): PAID 903 đơn, 6 thành phố; Đà Nẵng 3.658.824.000 / 179 đơn; 2000 → 903 → 6; PAID 199 khách, SHIPPED 522;
 * quên $ ⇒ một nhóm 'shipTo.city' 903; gõ sai '$totl' ⇒ 0; giá trị TB Đà Nẵng 20.537.191; sách 8/60 có pages, TB 471.
 * Liên kết chéo: SDN302 8.1 (aggregation nhập môn — không dạy lại), postgresql 6.2 (GROUP BY), spring-boot 20.3.
 */
import { lenh, ra, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's05-1-co-ban';

export default {
  title: '5.1 — Pipeline basics: $match, $project, $group, $sort|||5.1 — Pipeline cơ bản: $match, $project, $group, $sort',
  slug: 'mgo-5-1-pipeline-co-ban',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Aggregation pipeline là chuỗi stage, mỗi stage nhận tài liệu từ stage trước và trả tài liệu cho stage sau. Bài dựng báo cáo doanh thu CT Shop thật: $match lọc, $group với các bộ tích luỹ ($sum, $avg, $min, $max, $addToSet, $push, $first/$last, $topN), gom hai tầng, $project/$set/$unset, $sortByCount; xem từng trạm 2000 → 903 → 6; so với GROUP BY. Hai bẫy im lặng đo thật: quên dấu $ (gom theo chuỗi chữ) và gõ sai tên trường ($sum ra 0, không lỗi); $avg bỏ qua tài liệu thiếu trường.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Pipeline basics: $match, $project, $group, $sort</h2>
<p class="lead">Until now every question was "give me these documents". The questions a manager asks are different: "how much did we sell per city?", "which customers bring the most money?", "how many orders are still pending?". Those are answered by the <em>aggregation pipeline</em>: a list of stages, each one taking documents from the previous stage and passing new documents to the next. This lesson builds the first real CT Shop report and teaches the five stages you will use in nearly every pipeline — plus two traps that produce wrong numbers without any error.</p>

<p>If you studied SDN302, its Lesson 8.1 already showed a first pipeline ("top five customers"). Here we go further and slower: what each stage really outputs, every common accumulator, and how to check a report before trusting it.</p>
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-8-1-nestjs-hono', title: 'SDN302 8.1 — NestJS, Hono and a first aggregation', sub: 'If you study SDN302: the exam-level introduction' })}

<h3>An everyday picture: counting votes in a neighbourhood election</h3>
<p>After a neighbourhood election, the counting team works in steps. First they set aside invalid ballots. Then they sort the valid ballots into one pile per candidate. Then they count each pile. Then they write the piles on the board from highest to lowest. Nobody counts before sorting into piles, and nobody writes the board before counting. Each step takes the output of the previous one — and if the first step throws away the wrong ballots, every later number is wrong, even if the arithmetic is perfect. That is a pipeline: <code>$match</code> (valid ballots), <code>$group</code> (piles + counting), <code>$sort</code> (the board), <code>$project</code> (what is written).</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">$match</span><span class="lz-t">keep only PAID orders</span><span class="lz-d">2,000 → 903 documents</span></div>
  <div class="lz-step"><span class="lz-k">$group</span><span class="lz-t">one output document per city, with sums</span><span class="lz-d">903 → 6 documents</span></div>
  <div class="lz-step"><span class="lz-k">$sort</span><span class="lz-t">highest revenue first</span><span class="lz-d">6 → 6, reordered</span></div>
  <div class="lz-step"><span class="lz-k">result</span><span class="lz-t">a cursor of new documents</span><span class="lz-d">the collection itself is not changed</span></div>
</div>

<h3>The first report: revenue of paid orders per city</h3>
<p>The lab from Lesson 0.2 must be running. The chapter's first script reloads CT Shop and the million orders of Chapter 4 (the later lessons use both):</p>
${lenh(K, 0)}
${lenh(K, 1)}
<p>Now the question "how much paid revenue per city?":</p>
${lenh(K, 2)}
<p>Read it as the counting team would. <code>$match</code> keeps orders whose <code>status</code> is PAID — exactly the filter language of <code>find()</code> from Chapter 2. <code>$group</code> creates one output document per distinct value of <code>_id</code>; here <code>_id</code> is the expression <code>'$shipTo.city'</code> — the dollar sign means "the value of this field in the input document". Inside each group, <code>doanhThu</code> adds up <code>total</code> and <code>soDon</code> adds 1 per document. <code>$sort</code> orders the six results. Đà Nẵng comes first with 3,658,824,000 đồng from 179 orders. The sums stay <code>Decimal128</code> because <code>total</code> is Decimal128 (Lesson 1.2): no rounding errors on money.</p>

<h3>Look at every station</h3>
<p>The most useful habit with pipelines: never write the whole thing and hope. Add one stage at a time and look at what comes out. Here, counting the documents after each stage:</p>
${lenh(K, 3)}
<p>2,000 orders go in, 903 survive <code>$match</code>, 6 come out of <code>$group</code>. If you expected PAID orders to be about half and got 12, the bug is in the first stage — you know before writing the rest. In mongosh, a quick trick is to put <code>{ $limit: 3 }</code> after the stage you are checking.</p>

<h3>What $group really does, and the accumulators</h3>
<p><code>$group</code> needs an <code>_id</code> (the grouping key — a field, an expression, an object of several fields, or <code>null</code> for "everything in one group") and any number of output fields, each computed by an <em>accumulator</em>. The ones you will use most, on all four statuses at once:</p>
${lenh(K, 4)}
<ul>
<li><code>$sum: 1</code> counts documents; <code>$sum: '$total'</code> adds a field.</li>
<li><code>$avg</code>, <code>$min</code>, <code>$max</code> — average, smallest, largest. The average of Decimal128 values has many digits, so the next stage rounds it with <code>$round</code>.</li>
<li><code>$addToSet</code> collects distinct values into an array; its <code>$size</code> is a "count distinct". 903 PAID orders came from 199 different customers.</li>
<li><code>$push</code> collects every value (duplicates included) — useful, but dangerous on large groups (Lesson 5.5: 100 MB per stage, 16 MB per document).</li>
</ul>
<p>Notice the pattern: <code>$group</code> outputs only <code>_id</code> and the accumulators. Every other field of the input disappears — the counting team writes "candidate + count", not each ballot. If you need a field later, you must carry it through an accumulator.</p>
${nguon('📘', '$group (aggregation) — MongoDB Docs', 'Grouping key, accumulator operators, memory limits', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/')}

<h3>Grouping twice: a nested report</h3>
<p>"For each city, how many orders in each status?" One <code>$group</code> by the pair <code>{ city, status }</code> gives 24 flat documents. A second <code>$group</code> by city folds them back into six, and <code>$arrayToObject</code> turns the list of pairs into an object — the shape a dashboard API wants to return:</p>
${lenh(K, 5)}
<p>The first <code>$group</code> uses an <em>object</em> as <code>_id</code>; its fields are then reached as <code>'$_id.city'</code>. Grouping twice is the pipeline version of "GROUP BY city, status" followed by a pivot.</p>

<h3>$first, $last and $topN need an order</h3>
${lenh(K, 6)}
<p><code>$first</code> and <code>$last</code> take the value from the first or last document <em>that reached the group</em>. Without the <code>$sort</code> before it, "first" means whichever document the server happened to read first — today's result might not be tomorrow's. With <code>$sort: { createdAt: 1 }</code> in front, <code>donDau</code> really is the customer's first order. Since MongoDB 5.2 there is a cleaner tool when you want "the top N per group": <code>$topN</code> carries its own <code>sortBy</code>, so it cannot depend on the order of arrival:</p>
${lenh(K, 7)}

<h3>Two traps that give wrong numbers without any error</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap 1 — forgetting the dollar sign.</strong> <code>_id: 'shipTo.city'</code> (no <code>$</code>) is not a field path, it is a string constant. Every document has the same key, so there is one group:</p>
${lenh(K, 8)}
<p>903 orders in a city called "shipTo.city". The pipeline ran, returned a plausible number, and is completely wrong.</p>
<p><strong>Trap 2 — a misspelled field.</strong> MongoDB has no column list to check against (Lesson 0.1). <code>$sum</code> of a field that does not exist is 0:</p>
${lenh(K, 9)}
<p>Every city shows 0 revenue, no warning. In a real dashboard, this is the kind of bug that is noticed only when someone in accounting asks why last month was zero. The defence is the habit from above — check each stage on a few documents — plus a test that compares one report value with a value you computed another way (the lab does this).</p>
</div>

<h3>$project, $set and $unset: shaping the output</h3>
<p>After grouping, you often compute new fields from the accumulators. <code>$set</code> (alias <code>$addFields</code>) adds or replaces fields and keeps the others; <code>$project</code> keeps only what you list (or removes what you mark 0); <code>$unset</code> removes fields. Average order value per city, for orders that are paid or shipped:</p>
${lenh(K, 10)}
<p>Inside expressions, operators like <code>$divide</code>, <code>$round</code> and <code>$multiply</code> take arrays of arguments; <code>'$doanhThu'</code> refers to the field produced by the previous stage. Renaming <code>_id</code> to <code>thanhPho</code> and removing <code>_id</code> makes the output readable for the frontend. Đà Nẵng has the largest average order (about 20.5 million), Hà Nội the smallest.</p>

<h3>Shortcuts and averages over missing values</h3>
<p><code>$sortByCount</code> is <code>$group</code> by a value with a count, followed by <code>$sort</code> descending — the quickest "how many of each":</p>
${lenh(K, 11)}
<p>One more silent rule. <code>$avg</code> ignores documents where the field is missing or not a number; it does not count them as 0:</p>
${lenh(K, 12)}
<p>Sixty products, eight of them books with <code>pages</code>: the average 471 is 3,768 ÷ 8, not ÷ 60. That is usually what you want ("average pages of books"), but write it down: an average of "customer ratings" where most customers did not rate is an average over raters only.</p>

<h3>Pipeline and SQL side by side</h3>
<table>
<thead><tr><th>SQL</th><th>Pipeline</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>WHERE</code></td><td><code>$match</code> (before <code>$group</code>)</td><td>same filter language as <code>find()</code></td></tr>
<tr><td><code>GROUP BY</code> + <code>SUM/AVG/COUNT</code></td><td><code>$group</code> + accumulators</td><td><code>_id</code> is the GROUP BY key</td></tr>
<tr><td><code>HAVING</code></td><td><code>$match</code> after <code>$group</code></td><td>filters on accumulated fields</td></tr>
<tr><td><code>SELECT</code> expressions</td><td><code>$project</code> / <code>$set</code></td><td>computed fields</td></tr>
<tr><td><code>ORDER BY</code> / <code>LIMIT</code></td><td><code>$sort</code> / <code>$limit</code></td><td>order matters — Lesson 5.5</td></tr>
<tr><td><code>COUNT(DISTINCT x)</code></td><td><code>$addToSet</code> + <code>$size</code></td><td>or two <code>$group</code> stages</td></tr>
</tbody></table>
<p>The difference that matters: SQL is declarative (you describe the result, the planner chooses the order), a pipeline is a sequence you write. MongoDB's optimizer does reorder some stages (Lesson 5.5), but a pipeline in a bad order is your responsibility.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-6-2-group-by', title: 'PostgreSQL 6.2 — GROUP BY', sub: 'The same reports in SQL, with the same "one row per group" rule' })}
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-20-3-mongo-query-index', title: 'Spring Boot 20.3 — Queries, indexes and aggregation', sub: 'The same pipeline written with Spring Data MongoDB' })}
${nguon('📘', 'Aggregation Pipeline — MongoDB Docs', 'Stages, expressions, how documents flow between stages', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/')}
${nguon('📘', 'SQL to Aggregation Mapping Chart — MongoDB Docs', 'WHERE, GROUP BY, HAVING, ORDER BY and their pipeline equivalents', 'https://www.mongodb.com/docs/manual/reference/sql-aggregation-comparison/')}

<h3>💼 At work: "the dashboard number is wrong"</h3>
<p>On an outsourcing project you will get this ticket: the client's sales manager says the revenue tile does not match the accounting export. Nine times out of ten it is one of three things you now know: a filter that does not match the business definition (does "revenue" include SHIPPED? CANCELLED?), a misspelled or renamed field that sums to 0 for part of the data, or the time zone problem of Lesson 5.3. The professional way to answer is not to "fix the number": write down the definition ("revenue = PAID + SHIPPED, by order date in Vietnam time"), check each stage on a small sample, and put the definition in the API documentation so the next developer computes the same thing.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is the aggregation pipeline?"</strong> — An ordered list of stages; each stage transforms the stream of documents from the previous one. It runs in the database and returns new documents without changing the collection (unless it ends with <code>$out</code>/<code>$merge</code>).</li>
<li><strong>"What does <code>_id</code> mean in <code>$group</code>?"</strong> — The grouping key: one output document per distinct value. <code>null</code> means one group for everything; an object means several fields.</li>
<li><strong>"Where is HAVING?"</strong> — A <code>$match</code> after <code>$group</code>, filtering on accumulated fields.</li>
<li><strong>"Why can <code>$first</code> give different results on two runs?"</strong> — It depends on the order documents reach the group; without a <code>$sort</code> before it, that order is not defined. Use <code>$sort</code> or <code>$topN</code>/<code>$bottomN</code>.</li>
<li><strong>"Your report shows 0 for one month. Where do you look?"</strong> — The field names (missing fields sum to 0 silently), the filter values, then the dates.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Number of orders and revenue (PAID + SHIPPED) per <strong>category of product</strong>? Hint: you need the category of each item — try it, see what is missing, and keep the question for Lesson 5.2.</li>
<li>For each customer city, the number of distinct customers who placed at least one CANCELLED order. Write it with <code>$addToSet</code>, then with two <code>$group</code> stages. Do both give the same numbers?</li>
<li>"HAVING": cities whose PAID revenue is above 2.6 billion đồng. Which stage, and where?</li>
<li>Break the first report on purpose in three ways (missing <code>$</code>, misspelled field, <code>$sort</code> on a field that no longer exists after <code>$group</code>). For each, write what you see and how you would have caught it.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. The order items carry <code>productId</code>, <code>name</code>, <code>price</code> and <code>qty</code> — not the category. With what you know so far you cannot group by category; you need <code>$unwind</code> on <code>items</code> and <code>$lookup</code> into <code>products</code> (Lesson 5.2), or the extended reference pattern of Lesson 3.3 (copy <code>category</code> into each item when the order is created).</p>
<p>2. <code>[{ $match: { status: 'CANCELLED' } }, { $group: { _id: '$shipTo.city', kh: { $addToSet: '$customerId' } } }, { $project: { n: { $size: '$kh' } } }]</code>. With two stages: first <code>$group</code> by <code>{ city, customerId }</code>, then <code>$group</code> by <code>'$_id.city'</code> with <code>$sum: 1</code>. Same numbers. The two-stage version does not build a big array per group, so it is safer when a group can have hundreds of thousands of distinct values.</p>
<p>3. A <code>$match: { doanhThu: { $gt: NumberDecimal('2600000000') } }</code> <em>after</em> <code>$group</code>. In the lab data: Đà Nẵng, Hà Nội and Cần Thơ.</p>
<p>4. Missing <code>$</code>: one group named after the string. Misspelled field: sums of 0. <code>$sort: { total: -1 }</code> after <code>$group</code>: no error, but no sorting either — <code>total</code> does not exist in the grouped documents, so all values are missing and the order is arbitrary. Caught by: looking at the output of each stage on a few documents, and by a test comparing one value with <code>countDocuments</code> or a manual sum.</p>
</details>
<p><strong>Done when:</strong> you can write a report from a plain-language question, show the document count after each stage, and explain why each number is right.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Aggregation pipeline', 'An ordered list of stages run inside the database; each stage receives the documents produced by the previous one.'],
  ['Stage', 'One step of the pipeline: $match, $group, $sort, $project, $set, $unset, $limit, $count…'],
  ['Accumulator', 'An operator computing one value over a group: $sum, $avg, $min, $max, $addToSet, $push, $first, $last, $topN…'],
  ['Grouping key (_id)', 'The expression whose distinct values define the groups; null = one group for all.'],
  ['Field path', 'A string starting with $ (\'$shipTo.city\') meaning "the value of this field"; without $ it is a constant.'],
  ['$sortByCount', 'Shortcut for $group by a value with a count, sorted descending.'],
  ['$topN / $bottomN', 'Accumulators returning the first/last N documents of a group by their own sortBy.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>A pipeline is a sequence of stages; check the output of every stage while you build it (2,000 → 903 → 6).</li>
<li><code>$match</code> uses the filter language of <code>find()</code>; <code>$group</code> outputs only <code>_id</code> and its accumulators.</li>
<li><code>$first</code>/<code>$last</code> need a <code>$sort</code> before them; <code>$topN</code> carries its own order.</li>
<li>Forgetting <code>$</code> groups by a constant; a misspelled field sums to 0 — both without any error.</li>
<li><code>$avg</code> ignores missing values; decide whether that matches your definition.</li>
<li>Write the business definition of a number before writing the pipeline.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Pipeline cơ bản: $match, $project, $group, $sort</h2>
<p class="lead">Từ đầu khoá tới giờ mọi câu hỏi đều là "lấy cho tôi các tài liệu này". Câu hỏi của người quản lý thì khác: "mỗi thành phố bán được bao nhiêu?", "khách nào đem lại nhiều tiền nhất?", "còn bao nhiêu đơn đang chờ?". Những câu đó được trả lời bằng <em>aggregation pipeline</em>: một danh sách các stage, mỗi stage nhận tài liệu từ stage trước và đưa tài liệu mới cho stage sau. Bài này dựng báo cáo thật đầu tiên của CT Shop và dạy năm stage bạn sẽ dùng trong gần như mọi pipeline — kèm hai cái bẫy cho ra số sai mà không có lỗi nào.</p>

<p>Nếu bạn học SDN302, Bài 8.1 của môn đó đã cho xem một pipeline đầu tiên ("năm khách mua nhiều nhất"). Ở đây ta đi xa hơn và chậm hơn: mỗi stage thực sự trả ra gì, mọi bộ tích luỹ hay dùng, và cách kiểm một báo cáo trước khi tin nó.</p>
${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-8-1-nestjs-hono', title: 'SDN302 8.1 — NestJS, Hono và aggregation đầu tiên', sub: 'Nếu bạn học SDN302: phần nhập môn mức đề thi' })}

<h3>Hình ảnh đời thường: kiểm phiếu bầu tổ dân phố</h3>
<p>Sau buổi bầu tổ trưởng, tổ kiểm phiếu làm từng bước. Trước hết họ để riêng phiếu không hợp lệ. Rồi chia phiếu hợp lệ thành từng chồng theo ứng viên. Rồi đếm từng chồng. Rồi ghi lên bảng từ cao xuống thấp. Không ai đếm trước khi chia chồng, không ai ghi bảng trước khi đếm. Mỗi bước nhận kết quả của bước trước — và nếu bước đầu loại nhầm phiếu, mọi con số sau đều sai, dù cộng trừ hoàn hảo. Đó là một pipeline: <code>$match</code> (phiếu hợp lệ), <code>$group</code> (chia chồng + đếm), <code>$sort</code> (bảng kết quả), <code>$project</code> (thứ được ghi ra).</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">$match</span><span class="lz-t">chỉ giữ đơn PAID</span><span class="lz-d">2.000 → 903 tài liệu</span></div>
  <div class="lz-step"><span class="lz-k">$group</span><span class="lz-t">mỗi thành phố một tài liệu ra, kèm tổng</span><span class="lz-d">903 → 6 tài liệu</span></div>
  <div class="lz-step"><span class="lz-k">$sort</span><span class="lz-t">doanh thu cao nhất lên đầu</span><span class="lz-d">6 → 6, đổi thứ tự</span></div>
  <div class="lz-step"><span class="lz-k">kết quả</span><span class="lz-t">một con trỏ chứa tài liệu mới</span><span class="lz-d">bản thân collection không bị đổi</span></div>
</div>

<h3>Báo cáo đầu tiên: doanh thu đơn đã trả tiền theo thành phố</h3>
<p>Lab ở Bài 0.2 phải đang chạy. Kịch bản đầu của chương nạp lại CT Shop và một triệu đơn của Chương 4 (các bài sau dùng cả hai):</p>
${lenh(K, 0)}
${lenh(K, 1)}
<p>Giờ tới câu hỏi "doanh thu đã trả tiền theo từng thành phố là bao nhiêu?":</p>
${lenh(K, 2)}
<p>Đọc nó như tổ kiểm phiếu. <code>$match</code> giữ các đơn có <code>status</code> là PAID — đúng ngôn ngữ bộ lọc của <code>find()</code> ở Chương 2. <code>$group</code> tạo một tài liệu ra cho mỗi giá trị khác nhau của <code>_id</code>; ở đây <code>_id</code> là biểu thức <code>'$shipTo.city'</code> — dấu đô la nghĩa là "giá trị của trường này trong tài liệu đầu vào". Trong mỗi nhóm, <code>doanhThu</code> cộng dồn <code>total</code>, còn <code>soDon</code> cộng 1 cho mỗi tài liệu. <code>$sort</code> xếp sáu kết quả. Đà Nẵng đứng đầu với 3.658.824.000 đồng từ 179 đơn. Các tổng vẫn là <code>Decimal128</code> vì <code>total</code> là Decimal128 (Bài 1.2): không có sai số làm tròn trên tiền.</p>

<h3>Nhìn từng trạm</h3>
<p>Thói quen có ích nhất với pipeline: đừng bao giờ viết cả dây rồi cầu may. Thêm từng stage một và nhìn thứ đi ra. Ở đây là đếm tài liệu sau mỗi stage:</p>
${lenh(K, 3)}
<p>2.000 đơn đi vào, 903 đơn qua được <code>$match</code>, 6 tài liệu ra khỏi <code>$group</code>. Nếu bạn nghĩ đơn PAID chiếm khoảng một nửa mà lại ra 12, lỗi nằm ở stage đầu — bạn biết điều đó trước khi viết phần còn lại. Trong mongosh, mẹo nhanh là đặt <code>{ $limit: 3 }</code> ngay sau stage đang kiểm.</p>

<h3>$group thực sự làm gì, và các bộ tích luỹ</h3>
<p><code>$group</code> cần một <code>_id</code> (khoá gom nhóm — một trường, một biểu thức, một object gồm nhiều trường, hoặc <code>null</code> nghĩa là "tất cả vào một nhóm") và bao nhiêu trường ra cũng được, mỗi trường tính bằng một <em>bộ tích luỹ</em> (accumulator). Những cái bạn dùng nhiều nhất, trên cả bốn trạng thái cùng lúc:</p>
${lenh(K, 4)}
<ul>
<li><code>$sum: 1</code> đếm tài liệu; <code>$sum: '$total'</code> cộng một trường.</li>
<li><code>$avg</code>, <code>$min</code>, <code>$max</code> — trung bình, nhỏ nhất, lớn nhất. Trung bình của Decimal128 có rất nhiều chữ số, nên stage sau làm tròn bằng <code>$round</code>.</li>
<li><code>$addToSet</code> gom các giá trị khác nhau vào một mảng; <code>$size</code> của mảng đó là "đếm không trùng". 903 đơn PAID đến từ 199 khách khác nhau.</li>
<li><code>$push</code> gom mọi giá trị (kể cả trùng) — có ích, nhưng nguy hiểm với nhóm lớn (Bài 5.5: 100 MB mỗi stage, 16 MB mỗi tài liệu).</li>
</ul>
<p>Để ý quy luật: <code>$group</code> chỉ trả ra <code>_id</code> và các bộ tích luỹ. Mọi trường khác của đầu vào biến mất — tổ kiểm phiếu ghi "ứng viên + số phiếu", không chép từng lá phiếu. Nếu stage sau còn cần một trường, bạn phải mang nó theo qua một bộ tích luỹ.</p>
${nguon('📘', '$group (aggregation) — MongoDB Docs', 'Khoá gom nhóm, các toán tử tích luỹ, giới hạn bộ nhớ', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/')}

<h3>Gom hai lần: báo cáo lồng</h3>
<p>"Mỗi thành phố có bao nhiêu đơn ở mỗi trạng thái?" Một <code>$group</code> theo cặp <code>{ city, status }</code> cho ra 24 tài liệu phẳng. Một <code>$group</code> thứ hai theo thành phố gập chúng lại còn sáu, và <code>$arrayToObject</code> biến danh sách cặp thành một object — đúng hình dạng mà API bảng điều khiển muốn trả về:</p>
${lenh(K, 5)}
<p><code>$group</code> đầu dùng một <em>object</em> làm <code>_id</code>; các trường của nó sau đó được gọi bằng <code>'$_id.city'</code>. Gom hai lần là phiên bản pipeline của "GROUP BY city, status" rồi xoay bảng (pivot).</p>

<h3>$first, $last và $topN cần một thứ tự</h3>
${lenh(K, 6)}
<p><code>$first</code> và <code>$last</code> lấy giá trị từ tài liệu đầu tiên hoặc cuối cùng <em>đi vào nhóm</em>. Không có <code>$sort</code> ở trước, "đầu tiên" là tài liệu nào máy chủ tình cờ đọc trước — kết quả hôm nay chưa chắc giống ngày mai. Có <code>$sort: { createdAt: 1 }</code> phía trước thì <code>donDau</code> mới đúng là đơn đầu tiên của khách. Từ MongoDB 5.2 có công cụ gọn hơn khi bạn cần "N cái đứng đầu mỗi nhóm": <code>$topN</code> mang theo <code>sortBy</code> riêng, nên không phụ thuộc thứ tự tài liệu đi tới:</p>
${lenh(K, 7)}

<h3>Hai cái bẫy cho ra số sai mà không có lỗi</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy 1 — quên dấu đô la.</strong> <code>_id: 'shipTo.city'</code> (không có <code>$</code>) không phải đường dẫn trường, mà là một chuỗi hằng. Mọi tài liệu có cùng một khoá, nên chỉ có một nhóm:</p>
${lenh(K, 8)}
<p>903 đơn ở một thành phố tên là "shipTo.city". Pipeline chạy được, trả về một con số trông hợp lý, và sai hoàn toàn.</p>
<p><strong>Bẫy 2 — gõ sai tên trường.</strong> MongoDB không có danh sách cột để đối chiếu (Bài 0.1). <code>$sum</code> của một trường không tồn tại là 0:</p>
${lenh(K, 9)}
<p>Mọi thành phố hiện doanh thu 0, không cảnh báo. Trong một bảng điều khiển thật, đây là loại lỗi chỉ bị phát hiện khi ai đó bên kế toán hỏi vì sao tháng trước bằng 0. Cách phòng là thói quen ở trên — kiểm từng stage trên vài tài liệu — cộng một bài test so một giá trị của báo cáo với giá trị bạn tính bằng cách khác (lab sẽ làm việc này).</p>
</div>

<h3>$project, $set và $unset: nặn hình kết quả</h3>
<p>Sau khi gom, bạn thường tính trường mới từ các bộ tích luỹ. <code>$set</code> (tên khác <code>$addFields</code>) thêm hoặc thay trường và giữ các trường khác; <code>$project</code> chỉ giữ những gì bạn liệt kê (hoặc bỏ những gì bạn đánh 0); <code>$unset</code> xoá trường. Giá trị trung bình mỗi đơn theo thành phố, với đơn đã trả tiền hoặc đang giao:</p>
${lenh(K, 10)}
<p>Trong biểu thức, các toán tử như <code>$divide</code>, <code>$round</code> và <code>$multiply</code> nhận mảng đối số; <code>'$doanhThu'</code> là trường do stage trước sinh ra. Đổi tên <code>_id</code> thành <code>thanhPho</code> rồi xoá <code>_id</code> giúp kết quả dễ đọc cho frontend. Đà Nẵng có giá trị đơn trung bình lớn nhất (chừng 20,5 triệu), Hà Nội nhỏ nhất.</p>

<h3>Lối tắt và trung bình khi thiếu giá trị</h3>
<p><code>$sortByCount</code> là <code>$group</code> theo một giá trị kèm đếm, rồi <code>$sort</code> giảm dần — cách nhanh nhất để hỏi "mỗi loại bao nhiêu":</p>
${lenh(K, 11)}
<p>Thêm một luật im lặng. <code>$avg</code> bỏ qua tài liệu thiếu trường hoặc trường không phải số; nó không tính chúng là 0:</p>
${lenh(K, 12)}
<p>Sáu mươi sản phẩm, tám cuốn sách có <code>pages</code>: trung bình 471 là 3.768 chia 8, không phải chia 60. Thường đó là điều bạn muốn ("số trang trung bình của sách"), nhưng hãy ghi rõ: trung bình "điểm đánh giá của khách" khi phần lớn khách không chấm là trung bình trên những người đã chấm thôi.</p>

<h3>Pipeline và SQL đặt cạnh nhau</h3>
<table>
<thead><tr><th>SQL</th><th>Pipeline</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>WHERE</code></td><td><code>$match</code> (trước <code>$group</code>)</td><td>cùng ngôn ngữ bộ lọc với <code>find()</code></td></tr>
<tr><td><code>GROUP BY</code> + <code>SUM/AVG/COUNT</code></td><td><code>$group</code> + bộ tích luỹ</td><td><code>_id</code> là khoá GROUP BY</td></tr>
<tr><td><code>HAVING</code></td><td><code>$match</code> sau <code>$group</code></td><td>lọc trên trường đã tích luỹ</td></tr>
<tr><td>Biểu thức trong <code>SELECT</code></td><td><code>$project</code> / <code>$set</code></td><td>trường tính toán</td></tr>
<tr><td><code>ORDER BY</code> / <code>LIMIT</code></td><td><code>$sort</code> / <code>$limit</code></td><td>thứ tự quan trọng — Bài 5.5</td></tr>
<tr><td><code>COUNT(DISTINCT x)</code></td><td><code>$addToSet</code> + <code>$size</code></td><td>hoặc hai stage <code>$group</code></td></tr>
</tbody></table>
<p>Khác biệt đáng nhớ: SQL là khai báo (bạn tả kết quả, bộ lập kế hoạch chọn thứ tự), còn pipeline là một chuỗi do bạn viết. Bộ tối ưu của MongoDB có sắp lại một số stage (Bài 5.5), nhưng một pipeline xếp sai thứ tự là trách nhiệm của bạn.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-6-2-group-by', title: 'PostgreSQL 6.2 — GROUP BY', sub: 'Cùng các báo cáo bằng SQL, cùng luật "mỗi nhóm một dòng"' })}
${lienKet({ khoa: 'spring-boot', bai: 'sb-20-3-mongo-query-index', title: 'Spring Boot 20.3 — Truy vấn, chỉ mục và aggregation', sub: 'Cùng pipeline viết bằng Spring Data MongoDB' })}
${nguon('📘', 'Aggregation Pipeline — MongoDB Docs', 'Stage, biểu thức, tài liệu chảy giữa các stage thế nào', 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/')}
${nguon('📘', 'SQL to Aggregation Mapping Chart — MongoDB Docs', 'WHERE, GROUP BY, HAVING, ORDER BY và bản tương đương trong pipeline', 'https://www.mongodb.com/docs/manual/reference/sql-aggregation-comparison/')}

<h3>💼 Đi làm: "số trên bảng điều khiển bị sai"</h3>
<p>Ở một dự án outsourcing bạn sẽ nhận ticket này: quản lý bán hàng của khách hàng nói ô doanh thu không khớp với bản xuất của kế toán. Chín trên mười lần là một trong ba thứ bạn vừa biết: bộ lọc không khớp định nghĩa nghiệp vụ ("doanh thu" có tính SHIPPED không? CANCELLED thì sao?), một trường gõ sai hoặc đã đổi tên nên cộng ra 0 cho một phần dữ liệu, hoặc chuyện múi giờ ở Bài 5.3. Cách trả lời chuyên nghiệp không phải là "sửa cho ra số": viết định nghĩa ra ("doanh thu = PAID + SHIPPED, theo ngày đặt đơn giờ Việt Nam"), kiểm từng stage trên một mẫu nhỏ, và ghi định nghĩa vào tài liệu API để người sau tính đúng cùng một thứ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Aggregation pipeline là gì?"</strong> — Một danh sách stage có thứ tự; mỗi stage biến đổi dòng tài liệu từ stage trước. Nó chạy trong cơ sở dữ liệu và trả về tài liệu mới mà không đổi collection (trừ khi kết thúc bằng <code>$out</code>/<code>$merge</code>).</li>
<li><strong>"<code>_id</code> trong <code>$group</code> nghĩa là gì?"</strong> — Khoá gom nhóm: mỗi giá trị khác nhau một tài liệu ra. <code>null</code> là một nhóm cho tất cả; một object là gom theo nhiều trường.</li>
<li><strong>"HAVING nằm ở đâu?"</strong> — Một <code>$match</code> đặt sau <code>$group</code>, lọc trên trường đã tích luỹ.</li>
<li><strong>"Vì sao <code>$first</code> có thể cho kết quả khác nhau ở hai lần chạy?"</strong> — Nó phụ thuộc thứ tự tài liệu đi vào nhóm; không có <code>$sort</code> phía trước thì thứ tự đó không xác định. Dùng <code>$sort</code> hoặc <code>$topN</code>/<code>$bottomN</code>.</li>
<li><strong>"Báo cáo của bạn ra 0 cho một tháng. Bạn tìm ở đâu?"</strong> — Tên trường (trường vắng cộng ra 0 im lặng), giá trị bộ lọc, rồi tới ngày tháng.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Số đơn và doanh thu (PAID + SHIPPED) theo <strong>danh mục sản phẩm</strong>? Gợi ý: bạn cần danh mục của từng món — cứ thử, xem thiếu gì, và giữ câu hỏi cho Bài 5.2.</li>
<li>Với mỗi thành phố của khách, có bao nhiêu khách khác nhau từng có ít nhất một đơn CANCELLED? Viết bằng <code>$addToSet</code>, rồi bằng hai stage <code>$group</code>. Hai cách có ra cùng số không?</li>
<li>"HAVING": các thành phố có doanh thu PAID trên 2,6 tỉ đồng. Stage nào, đặt ở đâu?</li>
<li>Cố ý làm hỏng báo cáo đầu tiên theo ba cách (thiếu <code>$</code>, gõ sai tên trường, <code>$sort</code> trên một trường không còn tồn tại sau <code>$group</code>). Với mỗi cách, ghi lại bạn thấy gì và lẽ ra bạn bắt được nó bằng cách nào.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Món hàng trong đơn mang <code>productId</code>, <code>name</code>, <code>price</code> và <code>qty</code> — không có danh mục. Với những gì đã học thì chưa gom theo danh mục được; bạn cần <code>$unwind</code> trên <code>items</code> và <code>$lookup</code> sang <code>products</code> (Bài 5.2), hoặc pattern extended reference ở Bài 3.3 (chép <code>category</code> vào từng món lúc tạo đơn).</p>
<p>2. <code>[{ $match: { status: 'CANCELLED' } }, { $group: { _id: '$shipTo.city', kh: { $addToSet: '$customerId' } } }, { $project: { n: { $size: '$kh' } } }]</code>. Bản hai stage: <code>$group</code> đầu theo <code>{ city, customerId }</code>, rồi <code>$group</code> theo <code>'$_id.city'</code> với <code>$sum: 1</code>. Cùng số. Bản hai stage không dựng mảng lớn trong mỗi nhóm, nên an toàn hơn khi một nhóm có thể có hàng trăm nghìn giá trị khác nhau.</p>
<p>3. Một <code>$match: { doanhThu: { $gt: NumberDecimal('2600000000') } }</code> đặt <em>sau</em> <code>$group</code>. Trên dữ liệu lab: Đà Nẵng, Hà Nội và Cần Thơ.</p>
<p>4. Thiếu <code>$</code>: một nhóm mang tên chuỗi đó. Sai tên trường: tổng bằng 0. <code>$sort: { total: -1 }</code> sau <code>$group</code>: không lỗi, nhưng cũng không sắp xếp gì — <code>total</code> không tồn tại trong tài liệu đã gom, mọi giá trị đều vắng và thứ tự là tuỳ ý. Bắt được bằng: nhìn output từng stage trên vài tài liệu, và một bài test so một giá trị với <code>countDocuments</code> hoặc một phép cộng tay.</p>
</details>
<p><strong>Xong khi:</strong> bạn viết được một báo cáo từ một câu hỏi bằng lời thường, chỉ ra số tài liệu sau mỗi stage, và giải thích vì sao mỗi con số là đúng.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Aggregation pipeline', 'Danh sách stage có thứ tự chạy trong cơ sở dữ liệu; mỗi stage nhận tài liệu do stage trước sinh ra.'],
  ['Stage', 'Một bước của pipeline: $match, $group, $sort, $project, $set, $unset, $limit, $count…'],
  ['Bộ tích luỹ (accumulator)', 'Toán tử tính một giá trị trên cả nhóm: $sum, $avg, $min, $max, $addToSet, $push, $first, $last, $topN…'],
  ['Khoá gom nhóm (_id)', 'Biểu thức mà mỗi giá trị khác nhau của nó tạo một nhóm; null = một nhóm cho tất cả.'],
  ['Đường dẫn trường', 'Chuỗi bắt đầu bằng $ (\'$shipTo.city\') nghĩa là "giá trị của trường này"; không có $ thì là hằng.'],
  ['$sortByCount', 'Lối tắt cho $group theo một giá trị kèm đếm, sắp giảm dần.'],
  ['$topN / $bottomN', 'Bộ tích luỹ trả N tài liệu đầu/cuối của nhóm theo sortBy riêng của nó.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Pipeline là chuỗi stage; kiểm output của từng stage trong lúc dựng (2.000 → 903 → 6).</li>
<li><code>$match</code> dùng ngôn ngữ bộ lọc của <code>find()</code>; <code>$group</code> chỉ trả ra <code>_id</code> và các bộ tích luỹ.</li>
<li><code>$first</code>/<code>$last</code> cần <code>$sort</code> phía trước; <code>$topN</code> mang thứ tự riêng.</li>
<li>Quên <code>$</code> là gom theo hằng; gõ sai tên trường là tổng bằng 0 — cả hai đều không báo lỗi.</li>
<li><code>$avg</code> bỏ qua giá trị vắng; hãy quyết định điều đó có khớp định nghĩa của bạn không.</li>
<li>Viết định nghĩa nghiệp vụ của một con số trước khi viết pipeline.</li>
</ul>
</div>
`,
};
