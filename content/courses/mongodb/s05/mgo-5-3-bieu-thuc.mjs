/**
 * 5.3 — Biểu thức: $cond, ngày tháng, $facet và $bucket (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-3-bieu-thuc'] (MongoDB 8.0.38; ch4.don + ctshop).
 * Số đối chiếu (tất định): 31/12/2025–01/01/2026 theo UTC 1480/1429, theo giờ VN 1051/1434/424; quý 1/2026 không timezone 378 (tháng 12!)/38678/34951/37853,
 * có timezone 38726/34921/38213; tuần từ thứ Hai 9792/10057; $dateAdd 29/02/2012 + 1 năm = 28/02/2013, 31/01 + 1 tháng = 28/02; $dateFromParts 29/02/2013 = 01/03/2013;
 * $dateDiff 01/01→24/11/2026 = 327 ngày; $dateFromString '2013-02-29' lỗi / onError; hạng đơn nhỏ 1141 vừa 613 lớn 246; $concat với phone vắng = null;
 * $reduce đối soát lệch 0/2000; $bucket thiếu default ⇒ lỗi "$switch could not find a matching branch"; 258/883/310/303/246; tháng 10 giờ VN: 203 đơn.
 * Sự cố thật (GET kiểm 24/11): Microsoft Azure 29/02/2012 — chứng chỉ "cộng 1 vào năm" ra 29/02/2013 không hợp lệ (blog Azure, phân tích nguyên nhân).
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's05-3-bieu-thuc';

export default {
  title: '5.3 — Expressions: $cond, dates, $facet and $bucket|||5.3 — Biểu thức: $cond, ngày tháng, $facet và $bucket',
  slug: 'mgo-5-3-bieu-thuc',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ngày lưu theo UTC nên báo cáo theo ngày phải có timezone: đếm thật quanh Tết dương lịch lệch hàng trăm đơn mỗi ngày, quý 1 không timezone còn đẻ ra "tháng 12". $dateTrunc theo tháng/tuần thứ Hai giờ Việt Nam, $dateAdd hiểu năm nhuận (sự cố Azure 29/02/2012), $dateFromString và onError. $cond/$switch xếp hạng đơn, bẫy $concat với trường vắng ra null, biểu thức mảng $reduce/$filter/$map để đối soát tổng đơn, $bucket (thiếu default là lỗi cả pipeline), $bucketAuto và $facet nhiều báo cáo một lượt đọc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Expressions: $cond, dates, $facet and $bucket</h2>
<p class="lead">Stages decide <em>what happens to the stream</em>; expressions decide <em>what is computed for each document</em>. This lesson covers the expressions that real reports cannot live without: dates in the right time zone, conditions, string building, array calculations, and the two stages that turn one pass over the data into a whole dashboard — <code>$bucket</code> and <code>$facet</code>. The date part is the most important: it is the most common source of wrong numbers in reports, in every database.</p>

<h3>An everyday picture: the night-shift shop</h3>
<p>A convenience store in Hà Nội is open all night. The owner asks "how much did we sell on 31 December?". For the owner, 31 December ends at midnight in Hà Nội. The payment system stores every receipt in UTC — seven hours behind. If the report cuts the day at UTC midnight, it adds the first seven hours of 1 January (07:00 in Hà Nội) to 31 December and moves the last seven hours of 31 December (from 17:00 UTC) out of it. Nobody made a calculation error; the day was simply cut at the wrong clock.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">31/12 17:00 UTC</span><span class="lz-t">= 1 January 00:00 in Hà Nội</span><span class="lz-d">the Vietnamese day starts here</span></div>
  <div class="lz-step"><span class="lz-k">17:00 → 24:00 UTC</span><span class="lz-t">still "31 December" for a UTC report</span><span class="lz-d">already 1 January for the shop</span></div>
  <div class="lz-step"><span class="lz-k">1/1 00:00 UTC</span><span class="lz-t">= 1 January 07:00 in Hà Nội</span><span class="lz-d">where a report without timezone cuts the day</span></div>
  <div class="lz-step"><span class="lz-k">fix</span><span class="lz-t">boundaries at 17:00 UTC + timezone in grouping</span><span class="lz-d">'Asia/Ho_Chi_Minh', never a hard-coded +7</span></div>
</div>

<h3>The time zone trap, measured</h3>
<p>MongoDB stores <code>Date</code> as milliseconds since 1970 in UTC (Lesson 1.2). Every date expression that extracts a day, month or hour — <code>$dateToString</code>, <code>$dateTrunc</code>, <code>$year</code>, <code>$month</code>, <code>$hour</code> — uses UTC unless you pass <code>timezone</code>. Orders around New Year in the million-order collection, counted per day both ways:</p>
${lenh(K, 0)}
<p>The same orders give 1,480 on 31 December by UTC but 1,051 by Vietnam time; and the Vietnam view has a third day (the last seven UTC hours of 1 January are already 2 January in Hà Nội). Every daily number in this report is off by hundreds. <code>$facet</code> (end of the lesson) ran both groupings in one pass.</p>
<p>The correct monthly report needs <em>two</em> things in Vietnam time: the <code>$match</code> boundaries and the grouping. The first quarter of 2026, filtered by Vietnam-time boundaries, then grouped with and without <code>timezone</code>:</p>
${lenh(K, 1)}
<p>Without the time zone, the report invents a December with 378 orders (the first seven hours of 1 January, Vietnam time, are still 31 December in UTC) and every month's number is shifted. With <code>timezone: 'Asia/Ho_Chi_Minh'</code>, each month starts at 17:00 UTC of the previous day — midnight in Vietnam — and the three numbers are the ones accounting will find. Note the boundaries in the <code>$match</code>: <code>2025-12-31T17:00:00Z</code> is 1 January 00:00 in Vietnam. Using a named zone (not <code>+07:00</code>) also handles countries with daylight saving correctly.</p>
<p>Weeks are a second classic: <code>$dateTrunc</code> with <code>unit: 'week'</code> starts weeks on Sunday by default. Vietnamese businesses count from Monday:</p>
${lenh(K, 2)}
${nguon('📘', '$dateTrunc (aggregation) — MongoDB Docs', 'unit, binSize, timezone, startOfWeek', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateTrunc/')}

<h3>Date arithmetic: let the server count days</h3>
${lenh(K, 3)}
<p><code>$dateAdd</code> knows the calendar: one year after 29 February 2012 is 28 February 2013, one month after 31 January is 28 February. Building a date by hand from parts does not: "29 February 2013" silently becomes 1 March. <code>$dateDiff</code> counts calendar units between two dates (327 days from New Year to today). And parsing a string that is not a valid date is an error for the whole pipeline — unless you say what to do:</p>
${lenh(K, 4)}
${lenh(K, 5)}
<p>With <code>onError</code>, one bad value in an imported file becomes a visible marker instead of stopping a nightly report.</p>

<h3>⚠️ A real case: Microsoft Azure, 29 February 2012</h3>
<p>Azure's guest agent created a transfer certificate valid for one year when a virtual machine started. According to Microsoft's root cause analysis, it "calculated the valid-to date by simply taking the current date and adding one to its year". On leap day that gave 29 February 2013 — an invalid date — certificate creation failed, and the agent terminated. The bug triggered at 00:00 UTC on 29 February (4:00 PM PST on 28 February); servers whose VMs kept failing were marked unhealthy, and Microsoft disabled service management in all clusters worldwide at 6:55 PM PST for the first time. Many customers' applications were affected for hours. The lesson is the one in the output above: never do calendar arithmetic by editing date parts; use a function that knows the calendar (<code>$dateAdd</code> here, <code>java.time</code> or a date library in application code), and test 29 February and 31st-of-the-month on purpose.</p>
${nguon('📰', 'Summary of Windows Azure Service Disruption on Feb 29th, 2012 — Microsoft Azure Blog', 'Root cause: valid-to = current date with year + 1 → 29/02/2013, timeline and impact', 'https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/')}
${nguon('📘', '$dateAdd (aggregation) — MongoDB Docs', 'Calendar-aware addition, month-end and leap-year behaviour, timezone', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateAdd/')}

<h3>Conditions: $cond and $switch</h3>
<p>Classifying orders by value for a marketing segment — large from 50 million, medium from 5 million, otherwise small — and counting how many in each class are being shipped:</p>
${lenh(K, 6)}
<p><code>$switch</code> tests the branches in order and takes the first true one, so the larger threshold must come first. <code>$cond: [condition, then, else]</code> is the two-way version; here it turns "is SHIPPED" into 1 or 0 so that <code>$sum</code> can count. Comparing <code>total</code> (Decimal128) with <code>NumberDecimal('50000000')</code> keeps the comparison exact.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — one missing field turns the whole string into null.</strong> Building a contact line from name and phone, for customers with and without a phone number:</p>
${lenh(K, 7)}
<p><code>$concat</code> returns <code>null</code> if any argument is missing or null — the customer's name disappears too. The same rule applies to most arithmetic (<code>$add</code> with a missing field is null). Wrap optional fields with <code>$ifNull: ['$phone', 'chưa có số']</code>, or give them a default in the schema (Lesson 1.3).</p>
</div>

<h3>Array expressions: compute inside a document without $unwind</h3>
<p>Lesson 5.2 unwound arrays to group across documents. To compute something <em>within</em> one document, array expressions are cheaper. Recompute every order's total from its items with <code>$reduce</code> and compare it with the stored <code>total</code> — a reconciliation that should be part of any system that stores computed values (Lesson 3.3):</p>
${lenh(K, 8)}
<p>0 differences out of 2,000. In <code>$reduce</code>, <code>$$value</code> is the running result and <code>$$this</code> the current element. <code>$filter</code> keeps elements matching a condition, <code>$map</code> transforms each element, <code>$size</code> counts:</p>
${lenh(K, 9)}

<h3>$bucket and $bucketAuto: distribution of values</h3>
<p>"How are order values distributed?" <code>$bucket</code> groups by ranges you choose. Every value must fall into a range or into <code>default</code> — otherwise the whole pipeline fails:</p>
${lenh(K, 10)}
<p>The error message mentions <code>$switch</code> because the server rewrites <code>$bucket</code> into a <code>$group</code> with a <code>$switch</code>. With all boundaries and a <code>default</code> bucket:</p>
${lenh(K, 11)}
<p>Each bucket is <code>[lower, next lower)</code>. The 246 orders from 50 million make up 21.2 of the 36.9 billion — the classic long tail that a simple average hides. When you do not know good boundaries yet, <code>$bucketAuto</code> chooses them so the buckets have roughly equal counts (quartiles here):</p>
${lenh(K, 12)}
${nguon('📘', '$bucket (aggregation) — MongoDB Docs', 'boundaries, default, output; values outside all buckets are an error', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/')}

<h3>$facet: a whole dashboard in one read</h3>
<p>A dashboard shows several tiles over the same filtered data. Instead of three queries, <code>$facet</code> runs several sub-pipelines on the same input and returns one document with one array per facet — here October 2026 in Vietnam time:</p>
${lenh(K, 13)}
<p>The <code>$match</code> before <code>$facet</code> can use an index; the sub-pipelines inside <code>$facet</code> cannot (they work on the stream), and the single output document must stay under 16 MB. So: filter first, keep each facet small (counts, top N), and do not use <code>$facet</code> to return large lists.</p>
${nguon('📘', '$facet (aggregation) — MongoDB Docs', 'Sub-pipelines on the same input, index use, output size limit', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/')}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-2-3-ngay-gio', title: 'PostgreSQL 2.3 — Dates and times', sub: 'timestamptz, AT TIME ZONE — the same time zone problem in SQL' })}

<h3>💼 At work: the report that changes at midnight</h3>
<p>A Vietnamese client's daily sales email is sent at 07:00 and "yesterday" never matches the cash register. The developer before you grouped by <code>$dateToString</code> without <code>timezone</code> and filtered with <code>new Date()</code> minus 24 hours. The fix has three parts, and a reviewer will ask for all three: compute the boundaries as midnight Vietnam time (in code or with <code>$dateTrunc</code>), pass <code>timezone</code> to every grouping expression, and add a test with an order at 23:30 and one at 00:30 Vietnam time. Put the time zone in one constant — it is a business rule, not a detail.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Dates are in UTC. How do you report by day in Vietnam?"</strong> — Match with boundaries at 00:00 Asia/Ho_Chi_Minh (17:00 UTC the day before) and group with <code>timezone</code> in <code>$dateTrunc</code>/<code>$dateToString</code>.</li>
<li><strong>"Why use $dateAdd instead of changing the year?"</strong> — Calendar edge cases: 29 February, 31st of a month. Azure 2012 failed on exactly that.</li>
<li><strong>"What happens to $concat when a field is missing?"</strong> — The result is null; use $ifNull.</li>
<li><strong>"$bucket vs $bucketAuto?"</strong> — Your boundaries (with default required for outliers) vs automatic boundaries for even counts.</li>
<li><strong>"What does $facet cost?"</strong> — One read of the input, but facets cannot use indexes and the output is one document under 16 MB.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Orders per <strong>hour of day</strong> (Vietnam time) for CT Shop. At which hour are most orders placed? Run it again without <code>timezone</code>: which hours move?</li>
<li>Add a field <code>hanGiao</code> = <code>createdAt</code> + 3 days, but for orders placed on Saturday or Sunday (Vietnam time) + 4 days. Use <code>$dateAdd</code>, <code>$dayOfWeek</code> with timezone and <code>$cond</code>.</li>
<li>One <code>$facet</code> for the product page: price distribution with <code>$bucket</code>, count per category, and the 3 cheapest products in stock.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>[{ $group: { _id: { $hour: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, n: { $sum: 1 } } }, { $sort: { n: -1 } }]</code>. Without <code>timezone</code> every bucket moves by seven hours (an order at 20:00 in Hà Nội is counted at 13:00) — the "busiest hour" is wrong even though the counts per bucket look plausible.</p>
<p>2. <code>{ $set: { hanGiao: { $dateAdd: { startDate: '$createdAt', unit: 'day', amount: { $cond: [{ $in: [{ $dayOfWeek: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, [1, 7]] }, 4, 3] } } } } }</code>. <code>$dayOfWeek</code> returns 1 for Sunday and 7 for Saturday.</p>
<p>3. <code>db.products.aggregate([{ $facet: { gia: [{ $bucket: { groupBy: '$price', boundaries: [0, 500000, 2000000, 10000000], default: 'từ 10 triệu' } }], theoDanhMuc: [{ $sortByCount: '$category' }], reNhat: [{ $match: { stock: { $gt: 0 } } }, { $sort: { price: 1 } }, { $limit: 3 }, { $project: { name: 1, price: 1 } }] } }])</code>. Without the <code>default</code>, the laptops above 10 million break the pipeline.</p>
</details>
<p><strong>Done when:</strong> every date in your reports has an explicit time zone, and you can explain each number on a dashboard built with one <code>$facet</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Expression', 'A formula evaluated per document inside a stage: $add, $cond, $dateTrunc, $concat, $reduce…'],
  ['timezone', 'Option of date expressions (Olson name like Asia/Ho_Chi_Minh, or ±HH:MM); default UTC.'],
  ['$dateTrunc', 'Rounds a date down to the start of a unit (day, week, month…) in a time zone.'],
  ['$dateAdd / $dateDiff', 'Calendar-aware addition and difference of dates.'],
  ['$cond / $switch', 'Two-way and multi-way conditional expressions.'],
  ['$ifNull', 'Returns a replacement when a value is null or missing.'],
  ['$reduce / $filter / $map', 'Fold, filter and transform the elements of an array inside one document.'],
  ['$bucket / $bucketAuto', 'Group values into given ranges (default required for outliers) / into N ranges of similar size.'],
  ['$facet', 'Runs several sub-pipelines on the same input in one stage; one output document.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Dates are UTC: put Vietnam-time boundaries in <code>$match</code> and <code>timezone</code> in every grouping expression.</li>
<li>Without it, daily numbers shift by hundreds and a quarter can grow a fake December.</li>
<li>Use <code>$dateAdd</code>/<code>$dateDiff</code> for calendar arithmetic — Azure 2012 broke on "year + 1".</li>
<li>A missing field makes <code>$concat</code> and arithmetic null; use <code>$ifNull</code>.</li>
<li>Array expressions compute inside a document without <code>$unwind</code>; use them to reconcile stored totals.</li>
<li><code>$bucket</code> needs <code>default</code> for outliers; <code>$facet</code> builds a dashboard in one read — filter before it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Biểu thức: $cond, ngày tháng, $facet và $bucket</h2>
<p class="lead">Stage quyết định <em>dòng tài liệu bị làm gì</em>; biểu thức quyết định <em>mỗi tài liệu được tính ra gì</em>. Bài này phủ những biểu thức mà báo cáo thật không thể thiếu: ngày tháng đúng múi giờ, điều kiện, ghép chuỗi, tính toán trên mảng, và hai stage biến một lượt đọc dữ liệu thành cả một bảng điều khiển — <code>$bucket</code> và <code>$facet</code>. Phần ngày tháng là quan trọng nhất: đó là nguồn số sai phổ biến nhất trong báo cáo, ở mọi cơ sở dữ liệu.</p>

<h3>Hình ảnh đời thường: cửa hàng mở xuyên đêm</h3>
<p>Một cửa hàng tiện lợi ở Hà Nội mở cửa suốt đêm. Chủ hỏi "ngày 31 tháng 12 bán được bao nhiêu?". Với chủ, ngày 31/12 kết thúc lúc nửa đêm giờ Hà Nội. Hệ thống thanh toán thì lưu mọi hoá đơn theo UTC — chậm hơn bảy tiếng. Nếu báo cáo cắt ngày ở nửa đêm UTC, nó cộng bảy tiếng đầu của ngày 1/1 (tới 07:00 giờ Hà Nội) vào ngày 31/12, và đẩy bảy tiếng cuối của ngày 31/12 (từ 17:00 UTC) ra ngoài. Không ai cộng trừ sai; chỉ là ngày bị cắt theo nhầm đồng hồ.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">31/12 17:00 UTC</span><span class="lz-t">= 00:00 ngày 1/1 ở Hà Nội</span><span class="lz-d">ngày Việt Nam bắt đầu từ đây</span></div>
  <div class="lz-step"><span class="lz-k">17:00 → 24:00 UTC</span><span class="lz-t">vẫn là "31/12" với báo cáo theo UTC</span><span class="lz-d">đã là 1/1 với cửa hàng</span></div>
  <div class="lz-step"><span class="lz-k">1/1 00:00 UTC</span><span class="lz-t">= 07:00 ngày 1/1 ở Hà Nội</span><span class="lz-d">chỗ báo cáo thiếu timezone cắt ngày</span></div>
  <div class="lz-step"><span class="lz-k">cách sửa</span><span class="lz-t">mốc lúc 17:00 UTC + timezone trong phép gom</span><span class="lz-d">'Asia/Ho_Chi_Minh', đừng viết cứng +7</span></div>
</div>

<h3>Bẫy múi giờ, đo thật</h3>
<p>MongoDB lưu <code>Date</code> là số mili giây kể từ 1970 theo UTC (Bài 1.2). Mọi biểu thức ngày tháng mà tách ra ngày, tháng hay giờ — <code>$dateToString</code>, <code>$dateTrunc</code>, <code>$year</code>, <code>$month</code>, <code>$hour</code> — đều dùng UTC trừ khi bạn truyền <code>timezone</code>. Đơn quanh Tết dương lịch trong collection một triệu đơn, đếm theo ngày bằng cả hai cách:</p>
${lenh(K, 0)}
<p>Cùng những đơn đó cho 1.480 đơn ngày 31/12 theo UTC nhưng 1.051 đơn theo giờ Việt Nam; và góc nhìn giờ Việt Nam có ngày thứ ba (bảy tiếng UTC cuối của ngày 1/1 đã là ngày 2/1 ở Hà Nội). Con số mỗi ngày trong báo cáo này lệch hàng trăm. <code>$facet</code> (cuối bài) đã chạy cả hai cách gom trong một lượt đọc.</p>
<p>Báo cáo theo tháng đúng cần <em>hai</em> thứ theo giờ Việt Nam: mốc của <code>$match</code> và phép gom. Quý 1/2026, lọc theo mốc giờ Việt Nam, rồi gom có và không có <code>timezone</code>:</p>
${lenh(K, 1)}
<p>Không có múi giờ, báo cáo bịa ra một tháng 12 có 378 đơn (bảy tiếng đầu của ngày 1/1 giờ Việt Nam vẫn là ngày 31/12 theo UTC) và số của mọi tháng đều bị xê dịch. Với <code>timezone: 'Asia/Ho_Chi_Minh'</code>, mỗi tháng bắt đầu lúc 17:00 UTC của ngày hôm trước — nửa đêm ở Việt Nam — và ba con số là đúng những gì kế toán sẽ thấy. Để ý mốc trong <code>$match</code>: <code>2025-12-31T17:00:00Z</code> là 00:00 ngày 1/1 ở Việt Nam. Dùng tên múi giờ (không dùng <code>+07:00</code>) còn xử lý đúng các nước có giờ mùa hè.</p>
<p>Tuần là cái bẫy kinh điển thứ hai: <code>$dateTrunc</code> với <code>unit: 'week'</code> mặc định bắt đầu tuần từ Chủ nhật. Doanh nghiệp Việt Nam tính từ thứ Hai:</p>
${lenh(K, 2)}
${nguon('📘', '$dateTrunc (aggregation) — MongoDB Docs', 'unit, binSize, timezone, startOfWeek', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateTrunc/')}

<h3>Cộng trừ ngày tháng: để máy chủ đếm ngày</h3>
${lenh(K, 3)}
<p><code>$dateAdd</code> hiểu lịch: một năm sau 29/02/2012 là 28/02/2013, một tháng sau 31/01 là 28/02. Tự ghép ngày từ các phần thì không: "29/02/2013" lặng lẽ thành 01/03. <code>$dateDiff</code> đếm số đơn vị lịch giữa hai ngày (327 ngày từ Tết dương lịch tới hôm nay). Còn phân tích một chuỗi không phải ngày hợp lệ là lỗi của cả pipeline — trừ khi bạn nói phải làm gì:</p>
${lenh(K, 4)}
${lenh(K, 5)}
<p>Có <code>onError</code>, một giá trị hỏng trong tệp nhập vào trở thành một dấu hiệu nhìn thấy được, thay vì làm dừng báo cáo chạy đêm.</p>

<h3>⚠️ Chuyện có thật: Microsoft Azure, ngày 29/02/2012</h3>
<p>Tác tử khách (guest agent) của Azure tạo một chứng chỉ chuyển giao có hạn một năm mỗi khi máy ảo khởi động. Theo bản phân tích nguyên nhân của Microsoft, nó "tính ngày hết hạn bằng cách lấy ngày hiện tại và cộng một vào năm". Vào ngày nhuận, kết quả là 29/02/2013 — một ngày không tồn tại — việc tạo chứng chỉ thất bại, và tác tử tự dừng. Lỗi kích hoạt lúc 00:00 UTC ngày 29/2 (4 giờ chiều 28/2 giờ Thái Bình Dương); các máy chủ có máy ảo lỗi liên tục bị đánh dấu là hỏng, và lần đầu tiên Microsoft phải tắt chức năng quản lý dịch vụ ở mọi cụm trên toàn thế giới, lúc 6 giờ 55 tối giờ Thái Bình Dương. Ứng dụng của nhiều khách hàng bị ảnh hưởng nhiều giờ liền. Bài học chính là output ở trên: đừng bao giờ cộng trừ lịch bằng cách sửa từng phần của ngày; hãy dùng hàm hiểu lịch (ở đây là <code>$dateAdd</code>, trong mã ứng dụng là <code>java.time</code> hoặc một thư viện ngày tháng), và cố ý viết test cho ngày 29/2 và ngày 31 của tháng.</p>
${nguon('📰', 'Summary of Windows Azure Service Disruption on Feb 29th, 2012 — Microsoft Azure Blog', 'Nguyên nhân: hạn = ngày hiện tại với năm + 1 → 29/02/2013, diễn biến và ảnh hưởng', 'https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/')}
${nguon('📘', '$dateAdd (aggregation) — MongoDB Docs', 'Cộng theo lịch, hành vi cuối tháng và năm nhuận, timezone', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateAdd/')}

<h3>Điều kiện: $cond và $switch</h3>
<p>Phân hạng đơn theo giá trị cho một nhóm tiếp thị — lớn từ 50 triệu, vừa từ 5 triệu, còn lại là nhỏ — và đếm mỗi hạng có bao nhiêu đơn đang giao:</p>
${lenh(K, 6)}
<p><code>$switch</code> thử các nhánh theo thứ tự và lấy nhánh đúng đầu tiên, nên ngưỡng lớn hơn phải đứng trước. <code>$cond: [điều kiện, nếu đúng, nếu sai]</code> là bản hai nhánh; ở đây nó biến "có phải SHIPPED" thành 1 hoặc 0 để <code>$sum</code> đếm được. So <code>total</code> (Decimal128) với <code>NumberDecimal('50000000')</code> giữ phép so sánh chính xác.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một trường vắng biến cả chuỗi thành null.</strong> Ghép dòng liên hệ từ tên và số điện thoại, cho khách có và không có số:</p>
${lenh(K, 7)}
<p><code>$concat</code> trả về <code>null</code> nếu bất kỳ đối số nào vắng hoặc null — tên khách cũng biến mất theo. Luật đó áp cho phần lớn phép toán (<code>$add</code> với một trường vắng là null). Hãy bọc trường không bắt buộc bằng <code>$ifNull: ['$phone', 'chưa có số']</code>, hoặc cho nó giá trị mặc định trong schema (Bài 1.3).</p>
</div>

<h3>Biểu thức mảng: tính trong một tài liệu mà không cần $unwind</h3>
<p>Bài 5.2 trải mảng ra để gom qua nhiều tài liệu. Để tính một thứ <em>bên trong</em> một tài liệu, biểu thức mảng rẻ hơn. Tính lại tổng tiền mọi đơn từ các món bằng <code>$reduce</code> rồi so với <code>total</code> đã lưu — một bước đối soát mà hệ thống nào lưu giá trị tính sẵn cũng nên có (Bài 3.3):</p>
${lenh(K, 8)}
<p>Lệch 0 trên 2.000 đơn. Trong <code>$reduce</code>, <code>$$value</code> là kết quả đang cộng dồn, <code>$$this</code> là phần tử hiện tại. <code>$filter</code> giữ phần tử khớp điều kiện, <code>$map</code> biến đổi từng phần tử, <code>$size</code> đếm:</p>
${lenh(K, 9)}

<h3>$bucket và $bucketAuto: phân bố giá trị</h3>
<p>"Giá trị đơn phân bố thế nào?" <code>$bucket</code> gom theo các khoảng do bạn chọn. Mọi giá trị phải rơi vào một khoảng hoặc vào <code>default</code> — nếu không, cả pipeline thất bại:</p>
${lenh(K, 10)}
<p>Thông báo lỗi nhắc tới <code>$switch</code> vì máy chủ viết lại <code>$bucket</code> thành một <code>$group</code> với một <code>$switch</code>. Có đủ mốc và một khoảng <code>default</code>:</p>
${lenh(K, 11)}
<p>Mỗi khoảng là <code>[mốc dưới, mốc dưới kế tiếp)</code>. 246 đơn từ 50 triệu trở lên chiếm 21,2 trong 36,9 tỉ — cái đuôi dài kinh điển mà một con số trung bình che mất. Khi chưa biết mốc nào là hợp lý, <code>$bucketAuto</code> tự chọn để các khoảng có số lượng gần bằng nhau (ở đây là tứ phân vị):</p>
${lenh(K, 12)}
${nguon('📘', '$bucket (aggregation) — MongoDB Docs', 'boundaries, default, output; giá trị nằm ngoài mọi khoảng là lỗi', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/')}

<h3>$facet: cả bảng điều khiển trong một lượt đọc</h3>
<p>Một bảng điều khiển hiện nhiều ô trên cùng một tập dữ liệu đã lọc. Thay vì ba truy vấn, <code>$facet</code> chạy nhiều pipeline con trên cùng đầu vào và trả về một tài liệu, mỗi facet một mảng — ở đây là tháng 10/2026 theo giờ Việt Nam:</p>
${lenh(K, 13)}
<p><code>$match</code> đứng trước <code>$facet</code> dùng được index; các pipeline con bên trong <code>$facet</code> thì không (chúng làm việc trên dòng chảy), và tài liệu kết quả duy nhất phải dưới 16 MB. Vậy nên: lọc trước, giữ mỗi facet nhỏ (đếm, top N), và đừng dùng <code>$facet</code> để trả về danh sách lớn.</p>
${nguon('📘', '$facet (aggregation) — MongoDB Docs', 'Pipeline con trên cùng đầu vào, dùng index, giới hạn cỡ kết quả', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-2-3-ngay-gio', title: 'PostgreSQL 2.3 — Ngày giờ', sub: 'timestamptz, AT TIME ZONE — cùng bài toán múi giờ trong SQL' })}

<h3>💼 Đi làm: báo cáo đổi số lúc nửa đêm</h3>
<p>Email doanh số hằng ngày của một khách hàng Việt Nam được gửi lúc 07:00 và "hôm qua" chẳng bao giờ khớp với máy tính tiền. Người làm trước bạn gom bằng <code>$dateToString</code> không có <code>timezone</code> và lọc bằng <code>new Date()</code> trừ 24 tiếng. Cách sửa có ba phần, và người review sẽ đòi cả ba: tính mốc là nửa đêm giờ Việt Nam (trong mã hoặc bằng <code>$dateTrunc</code>), truyền <code>timezone</code> vào mọi biểu thức gom, và thêm một test với một đơn lúc 23:30 và một đơn lúc 00:30 giờ Việt Nam. Đặt múi giờ vào một hằng số duy nhất — đó là luật nghiệp vụ, không phải chi tiết.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Ngày lưu theo UTC. Làm sao báo cáo theo ngày ở Việt Nam?"</strong> — Lọc với mốc 00:00 Asia/Ho_Chi_Minh (17:00 UTC hôm trước) và gom với <code>timezone</code> trong <code>$dateTrunc</code>/<code>$dateToString</code>.</li>
<li><strong>"Vì sao dùng $dateAdd thay vì đổi năm?"</strong> — Các trường hợp biên của lịch: 29/2, ngày 31. Azure 2012 hỏng đúng ở chỗ đó.</li>
<li><strong>"$concat ra sao khi một trường vắng?"</strong> — Kết quả là null; dùng $ifNull.</li>
<li><strong>"$bucket khác $bucketAuto thế nào?"</strong> — Mốc của bạn (bắt buộc có default cho giá trị ngoài) so với mốc tự động để số lượng đều nhau.</li>
<li><strong>"$facet tốn gì?"</strong> — Một lượt đọc đầu vào, nhưng các facet không dùng được index và kết quả là một tài liệu dưới 16 MB.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Số đơn theo <strong>giờ trong ngày</strong> (giờ Việt Nam) của CT Shop. Giờ nào có nhiều đơn nhất? Chạy lại không có <code>timezone</code>: những giờ nào bị dịch?</li>
<li>Thêm trường <code>hanGiao</code> = <code>createdAt</code> + 3 ngày, nhưng đơn đặt vào thứ Bảy hoặc Chủ nhật (giờ Việt Nam) thì + 4 ngày. Dùng <code>$dateAdd</code>, <code>$dayOfWeek</code> có timezone và <code>$cond</code>.</li>
<li>Một <code>$facet</code> cho trang sản phẩm: phân bố giá bằng <code>$bucket</code>, số sản phẩm theo danh mục, và 3 sản phẩm rẻ nhất còn hàng.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>[{ $group: { _id: { $hour: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, n: { $sum: 1 } } }, { $sort: { n: -1 } }]</code>. Không có <code>timezone</code> thì mọi khoảng đều dịch bảy tiếng (một đơn lúc 20:00 ở Hà Nội bị tính vào 13:00) — "giờ đông khách nhất" sai, dù số đếm của từng khoảng trông vẫn hợp lý.</p>
<p>2. <code>{ $set: { hanGiao: { $dateAdd: { startDate: '$createdAt', unit: 'day', amount: { $cond: [{ $in: [{ $dayOfWeek: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, [1, 7]] }, 4, 3] } } } } }</code>. <code>$dayOfWeek</code> trả 1 cho Chủ nhật và 7 cho thứ Bảy.</p>
<p>3. <code>db.products.aggregate([{ $facet: { gia: [{ $bucket: { groupBy: '$price', boundaries: [0, 500000, 2000000, 10000000], default: 'từ 10 triệu' } }], theoDanhMuc: [{ $sortByCount: '$category' }], reNhat: [{ $match: { stock: { $gt: 0 } } }, { $sort: { price: 1 } }, { $limit: 3 }, { $project: { name: 1, price: 1 } }] } }])</code>. Thiếu <code>default</code> thì các laptop trên 10 triệu làm hỏng pipeline.</p>
</details>
<p><strong>Xong khi:</strong> mọi ngày tháng trong báo cáo của bạn đều có múi giờ ghi rõ, và bạn giải thích được từng con số trên một bảng điều khiển dựng bằng một <code>$facet</code>.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Biểu thức (expression)', 'Công thức tính cho từng tài liệu bên trong một stage: $add, $cond, $dateTrunc, $concat, $reduce…'],
  ['timezone', 'Tuỳ chọn của biểu thức ngày tháng (tên Olson như Asia/Ho_Chi_Minh, hoặc ±HH:MM); mặc định UTC.'],
  ['$dateTrunc', 'Làm tròn xuống một ngày về đầu một đơn vị (ngày, tuần, tháng…) theo một múi giờ.'],
  ['$dateAdd / $dateDiff', 'Cộng và tính hiệu ngày tháng theo lịch.'],
  ['$cond / $switch', 'Biểu thức điều kiện hai nhánh và nhiều nhánh.'],
  ['$ifNull', 'Trả giá trị thay thế khi một giá trị là null hoặc vắng.'],
  ['$reduce / $filter / $map', 'Gộp, lọc và biến đổi phần tử của mảng bên trong một tài liệu.'],
  ['$bucket / $bucketAuto', 'Gom giá trị vào các khoảng cho trước (cần default cho giá trị ngoài) / vào N khoảng cỡ gần bằng nhau.'],
  ['$facet', 'Chạy nhiều pipeline con trên cùng đầu vào trong một stage; ra một tài liệu.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Ngày lưu theo UTC: đặt mốc giờ Việt Nam trong <code>$match</code> và <code>timezone</code> trong mọi biểu thức gom.</li>
<li>Thiếu nó, số mỗi ngày lệch hàng trăm và một quý có thể mọc ra tháng 12 giả.</li>
<li>Dùng <code>$dateAdd</code>/<code>$dateDiff</code> cho phép tính lịch — Azure 2012 hỏng vì "năm + 1".</li>
<li>Một trường vắng làm <code>$concat</code> và phép toán ra null; dùng <code>$ifNull</code>.</li>
<li>Biểu thức mảng tính trong một tài liệu mà không cần <code>$unwind</code>; dùng chúng để đối soát tổng đã lưu.</li>
<li><code>$bucket</code> cần <code>default</code> cho giá trị ngoài khoảng; <code>$facet</code> dựng cả bảng điều khiển trong một lượt đọc — lọc trước nó.</li>
</ul>
</div>
`,
};
