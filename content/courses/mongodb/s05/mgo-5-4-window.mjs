/**
 * 5.4 — Hàm cửa sổ với $setWindowFields (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-4-window'] (MongoDB 8.0.38; ctshop + ch4.don; ch5.diem tạm, xoá cuối kịch bản).
 * Số đối chiếu (tất định): doanh thu PAID+SHIPPED 2026 theo tháng giờ VN: 01 2300,8 tr … 10 2491,3 tr, luỹ kế 26718,2 tr, tăng trưởng 02 +34,6% / 03 −42%;
 * top 2 mỗi thành phố (Cần Thơ KH0066 384.710.400 / KH0191 319.656.000…); điểm 9-8-8-7-6 ⇒ rank 1-2-2-4-5, denseRank 1-2-2-3-4, documentNumber 1…5;
 * thiếu sortBy ⇒ "Document-based bounds require a sortBy"; TB trượt 7 ngày 05/03 cửa sổ 5 ngày (đầu dải) / 07/03 trở đi 7 ngày;
 * $densify tháng trên mốc 17:00 UTC ⇒ trôi sang ngày 28 (tháng giả + tháng trùng) / sửa bằng $dateFromParts ⇒ 10 tháng đúng (KH0001: 2,1,1,0,0,2,3,0,1,0);
 * khoảng quay lại KH0001 9 lần TB 28,2 ngày, KH0002 15 lần 16,5 ngày; tỉ trọng Đà Nẵng 23,2%.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's05-4-window';

export default {
  title: '5.4 — Window functions with $setWindowFields|||5.4 — Hàm cửa sổ với $setWindowFields',
  slug: 'mgo-5-4-window',
  type: 'LESSON',
  isFreePreview: false,
  description: '$setWindowFields tính trên một "cửa sổ" các tài liệu lân cận mà không gộp chúng lại như $group: luỹ kế doanh thu từ đầu năm và tăng trưởng so với tháng trước ($shift), xếp hạng khách trong từng thành phố (partitionBy), $rank/$denseRank/$documentNumber khi hoà điểm, trung bình trượt 7 ngày theo range thời gian, $densify + $fill cho tháng trống — kèm bẫy đo thật: $densify bước tháng trên mốc giờ Việt Nam trôi sang ngày 28 và đẻ tháng trùng; khoảng cách giữa hai đơn của một khách; tỉ trọng trên toàn bộ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Window functions with $setWindowFields</h2>
<p class="lead"><code>$group</code> answers questions about groups and throws away the individual documents. Many report questions need both: "revenue of <em>this</em> month <em>and</em> the total so far this year", "this customer's revenue <em>and</em> their rank in the city", "today's orders <em>and</em> the average of the last seven days". That is what window functions do: for each document, compute a value over a <em>window</em> of neighbouring documents, and keep every document. MongoDB added them in 5.0 as <code>$setWindowFields</code>.</p>

<h3>An everyday picture: the class grade book</h3>
<p>A teacher's grade book lists every student. Next to each student, the teacher can write "rank in the class" — computed over the whole class but written on each row. Or, for the monthly test scores of one student, "average of the last three tests" — a window that slides down the page. Nothing is removed from the book: each row gets an extra number computed from its neighbours. Split the book by class (10A1, 10A2…) and rank within each: that is <code>partitionBy</code>. Order the rows by score: that is <code>sortBy</code>. Choose how many neighbours count: that is the <code>window</code>.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">partitionBy</span><span class="lz-t">split documents into independent groups</span><span class="lz-d">by city, by customer — or none: one partition</span></div>
  <div class="lz-step"><span class="lz-k">sortBy</span><span class="lz-t">order inside each partition</span><span class="lz-d">required for ranks, $shift and document windows</span></div>
  <div class="lz-step"><span class="lz-k">window</span><span class="lz-t">which neighbours each value is computed over</span><span class="lz-d">documents: [-2, 0] · range: [-6, 0] days · unbounded</span></div>
  <div class="lz-step"><span class="lz-k">output</span><span class="lz-t">new fields added to every document</span><span class="lz-d">$sum $avg $rank $shift $count…</span></div>
</div>

<h3>Running total and month-over-month growth</h3>
<p>Monthly revenue of 2026 (paid + shipped, Vietnam time — Lesson 5.3), then a window over the twelve monthly documents:</p>
${lenh(K, 0)}
<p><code>luyKe</code> uses the window <code>documents: ['unbounded', 'current']</code> — from the first document of the partition up to this one: a running total, 26.7 billion by October. <code>$shift</code> with <code>by: -1</code> reads a field from the previous document; it is <code>null</code> for January, which the <code>$cond</code> keeps as <code>null</code> instead of dividing by nothing. February grew 34.6%, March fell 42%. The order of stages matters: <code>$group</code> first (one document per month), window second.</p>
${nguon('📘', '$setWindowFields (aggregation) — MongoDB Docs', 'partitionBy, sortBy, documents and range windows, window operators', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/setWindowFields/')}

<h3>Ranking inside each partition</h3>
<p>"The two best customers of each city" — a question that is awkward with <code>$group</code> alone:</p>
${lenh(K, 1)}
<p><code>partitionBy: '$_id.city'</code> restarts the ranking in each city; <code>sortBy: { dt: -1 }</code> ranks by revenue; <code>$match: { hang: { $lte: 2 } }</code> keeps the top two. Unlike <code>$topN</code> (Lesson 5.1), the rank is a field you can show ("you are number 2 in Cần Thơ") and filter on.</p>

<h3>Ties: $rank, $denseRank, $documentNumber</h3>
${lenh(K, 2)}
<p>Bình and Chi have the same score. <code>$rank</code> gives both 2 and skips 3 (Olympic ranking: two silver medals, no bronze); <code>$denseRank</code> gives both 2 and continues with 3; <code>$documentNumber</code> numbers rows 1 to 5 and breaks the tie arbitrarily — fine for pagination, unfair for prizes. Choose deliberately, and add a second sort field if ties must be broken in a defined way.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a window without an order.</strong> A running total only means something along an order. Forget <code>sortBy</code> and MongoDB refuses instead of guessing:</p>
${lenh(K, 3)}
<p>That error is a gift. The silent version of this bug is a <code>sortBy</code> on the wrong field (for example the string <code>'2026-10'</code> sorts correctly, but <code>'10/2026'</code> would put October before February). Sort windows by dates or by ISO-formatted keys.</p>
</div>

<h3>Moving average over time: range windows</h3>
<p>Daily orders in early March from the million-order collection, with a seven-day moving average. A <code>range</code> window with <code>unit: 'day'</code> means "documents whose <code>sortBy</code> value is between six days before and this one" — by time, not by position:</p>
${lenh(K, 4)}
<p>Look at <code>soNgayTrongCuaSo</code>: on 5 and 6 March the window holds only 5 and 6 days, because the data starts on 1 March. A dashboard should either hide those first days or say "average of available days". The difference between the two window kinds matters when days are missing: <code>documents: [-6, 0]</code> is "the last seven <em>rows</em>", which can cover two weeks if days are absent; <code>range: [-6, 0], unit: 'day'</code> is always "the last seven <em>calendar days</em>".</p>

<h3>Filling gaps: $densify and $fill</h3>
<p>A chart of one customer's orders per month needs a point for months with no order, otherwise the line jumps from March to June. <code>$densify</code> inserts the missing values of a field at a fixed step, <code>$fill</code> fills the other fields. First attempt, with months truncated in Vietnam time:</p>
${lenh(K, 5)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — $densify has no time zone.</strong> The month keys are 17:00 UTC on the last day of the previous month (midnight in Vietnam). <code>$densify</code> adds one month at a time in UTC, starting from 31 December 17:00: 31 January, then 28 February (there is no 31 February), then 28 March, 28 April… The generated keys drift to the 28th and no longer equal the real keys (31 May, 30 June). The result has fake empty months <em>and</em> real months side by side. No error, a broken chart. The fix: make the key the first day of the month as a calendar date — built from the Vietnam-time year and month, stored at 00:00 UTC — so that stepping by one month never drifts:</p>
${lenh(K, 6)}
<p>Ten months, January to October, the empty ones filled with 0, total 10 orders — matching the customer's real order count.</p>
</div>
${nguon('📘', '$densify (aggregation) — MongoDB Docs', 'field, step, unit, bounds; no timezone option', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/densify/')}

<h3>Two more patterns you will need</h3>
<p><strong>Time between events.</strong> <code>$shift</code> inside a partition per customer gives the previous order's date; <code>$dateDiff</code> turns the pair into days. How long do customers take to come back?</p>
${lenh(K, 7)}
<p>KH0001 came back 9 times, on average every 28.2 days; KH0002 every 16.5 days. This "inter-purchase time" is a standard input for loyalty and churn reports ("send a reminder if a customer has not ordered in twice their usual gap").</p>
<p><strong>Share of a total.</strong> A window with no <code>sortBy</code> and no bounds covers the whole partition — here the whole result — so every document can see the grand total:</p>
${lenh(K, 8)}
<p>Đà Nẵng brings 23.2% of revenue. This replaces the old pattern of running a second query for the total. Other window operators worth knowing by name: <code>$expMovingAvg</code> (exponential moving average), <code>$derivative</code> and <code>$integral</code> (rates for sensor data), <code>$locf</code> (carry the last value forward), <code>$minN</code>/<code>$maxN</code>.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-8-3-lag-running-total', title: 'PostgreSQL 8.3 — LAG and running totals', sub: 'The same ideas as OVER (PARTITION BY … ORDER BY …) in SQL' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-8-2-ranking', title: 'PostgreSQL 8.2 — Ranking', sub: 'RANK, DENSE_RANK, ROW_NUMBER — the SQL names of $rank, $denseRank, $documentNumber' })}

<h3>💼 At work: the sales leaderboard</h3>
<p>A typical feature on a Vietnamese e-commerce or edtech project: a monthly leaderboard (top sellers per region, top learners per class) with "your rank" on each user's page. Before window functions, teams computed ranks in application code over the whole list — slow, and wrong with ties. With <code>$setWindowFields</code> the ranking is one stage; with a nightly <code>$merge</code> (Lesson 5.5) it becomes a small collection that the page reads by user id. The decisions a reviewer will ask you to write down: the partition (region? class?), the tie rule (<code>$rank</code> or <code>$denseRank</code>, and the second sort field), and the time zone of "this month".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"$group vs $setWindowFields?"</strong> — $group collapses each group to one document; $setWindowFields keeps every document and adds values computed over a window.</li>
<li><strong>"Documents window vs range window?"</strong> — Position (last N rows) vs value distance (last N days); they differ when values are missing.</li>
<li><strong>"$rank vs $denseRank vs $documentNumber?"</strong> — 1-2-2-4 vs 1-2-2-3 vs 1-2-3-4.</li>
<li><strong>"How do you compute month-over-month growth?"</strong> — Group per month, then $shift by −1 sorted by month; handle the first month's null.</li>
<li><strong>"A chart has gaps for months without data. Fix?"</strong> — $densify + $fill, with a key that does not drift (calendar month key, not a UTC instant of local midnight).</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>For each product category, monthly revenue of 2026 and the running total <em>per category</em> (Vietnam time). Which window field restarts the running total?</li>
<li>Rank all 200 customers by number of orders with <code>$denseRank</code>. How many different ranks are there? Why is that number smaller than 200?</li>
<li>On <code>ch4.don</code>, daily order count for February 2026 (Vietnam time) with a 7-day moving average using <code>documents: [-6, 0]</code> and using <code>range</code>. Delete all orders of one day in a copy of the data and compare the two averages on the following days.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>$unwind</code> items → <code>$lookup</code> products for the category (or group by product first, Lesson 5.2) → <code>$group</code> by <code>{ cat, thang }</code> → <code>$setWindowFields: { partitionBy: '$_id.cat', sortBy: { '_id.thang': 1 }, output: { luyKe: { $sum: '$dt', window: { documents: ['unbounded', 'current'] } } } }</code>. <code>partitionBy</code> restarts it.</p>
<p>2. <code>$group</code> by <code>customerId</code> with <code>$sum: 1</code>, then <code>$setWindowFields: { sortBy: { n: -1 }, output: { r: { $denseRank: {} } } }</code>, then count distinct <code>r</code>. Order counts range only from 3 to 20, so there are at most 18 different values (the lab data has exactly 18) — many customers share a rank.</p>
<p>3. With one day missing, the <code>documents</code> window for the next six days reaches one day further back (it still takes seven rows), so it covers eight calendar days; the <code>range</code> window covers seven calendar days and averages six values. The <code>range</code> version is the honest "last 7 days"; if the missing day really had 0 orders, <code>$densify</code> + <code>$fill</code> with 0 first.</p>
</details>
<p><strong>Done when:</strong> for any "compare with neighbours" question you can name the partition, the order, the window and the operator before writing the stage.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Window function', 'A value computed for each document over a set of neighbouring documents, without collapsing them.'],
  ['$setWindowFields', 'The stage that adds window-computed fields (MongoDB 5.0+).'],
  ['partitionBy / sortBy', 'Independent groups / order inside each group.'],
  ['documents window', 'Bounds by position: [-6, 0] = this row and the six before it; "unbounded" = to the edge.'],
  ['range window', 'Bounds by sortBy value distance, with unit for dates: [-6, 0] days.'],
  ['$shift', 'Value of a field N documents before/after in the sorted partition (LAG/LEAD).'],
  ['$rank / $denseRank / $documentNumber', 'Rank with gaps / without gaps / row number.'],
  ['$densify / $fill', 'Insert missing steps of a field / fill other fields of inserted documents.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Window functions add a value to every document, computed over its neighbours; $group collapses.</li>
<li>Running total = <code>$sum</code> with <code>['unbounded', 'current']</code>; growth = <code>$shift</code> by −1.</li>
<li><code>partitionBy</code> restarts per group; ranks need <code>sortBy</code> and a deliberate tie rule.</li>
<li>Documents windows count rows, range windows count time — they differ when days are missing.</li>
<li><code>$densify</code> has no time zone: step on calendar keys, or months drift to the 28th.</li>
<li>A window over the whole partition gives each document the grand total — shares in one pass.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Hàm cửa sổ với $setWindowFields</h2>
<p class="lead"><code>$group</code> trả lời câu hỏi về nhóm và bỏ đi từng tài liệu riêng lẻ. Nhiều câu hỏi báo cáo cần cả hai: "doanh thu của <em>tháng này</em> <em>và</em> tổng từ đầu năm tới giờ", "doanh thu của khách này <em>và</em> hạng của họ trong thành phố", "số đơn hôm nay <em>và</em> trung bình bảy ngày qua". Đó là việc của hàm cửa sổ (window function): với mỗi tài liệu, tính một giá trị trên một <em>cửa sổ</em> gồm các tài liệu lân cận, và giữ lại mọi tài liệu. MongoDB thêm chúng từ bản 5.0 dưới tên <code>$setWindowFields</code>.</p>

<h3>Hình ảnh đời thường: sổ điểm của lớp</h3>
<p>Sổ điểm của giáo viên liệt kê mọi học sinh. Cạnh mỗi em, cô có thể ghi "hạng trong lớp" — tính trên cả lớp nhưng ghi ở từng dòng. Hoặc, với điểm kiểm tra hằng tháng của một em, ghi "trung bình ba bài gần nhất" — một cửa sổ trượt dần xuống trang. Không gì bị xoá khỏi sổ: mỗi dòng có thêm một con số tính từ các dòng bên cạnh. Tách sổ theo lớp (10A1, 10A2…) rồi xếp hạng trong từng lớp: đó là <code>partitionBy</code>. Xếp các dòng theo điểm: đó là <code>sortBy</code>. Chọn bao nhiêu dòng bên cạnh được tính: đó là <code>window</code>.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">partitionBy</span><span class="lz-t">chia tài liệu thành các nhóm độc lập</span><span class="lz-d">theo thành phố, theo khách — hoặc không chia: một phân vùng</span></div>
  <div class="lz-step"><span class="lz-k">sortBy</span><span class="lz-t">thứ tự bên trong mỗi phân vùng</span><span class="lz-d">bắt buộc cho xếp hạng, $shift và cửa sổ theo tài liệu</span></div>
  <div class="lz-step"><span class="lz-k">window</span><span class="lz-t">mỗi giá trị được tính trên những tài liệu lân cận nào</span><span class="lz-d">documents: [-2, 0] · range: [-6, 0] ngày · unbounded</span></div>
  <div class="lz-step"><span class="lz-k">output</span><span class="lz-t">trường mới thêm vào mọi tài liệu</span><span class="lz-d">$sum $avg $rank $shift $count…</span></div>
</div>

<h3>Luỹ kế và tăng trưởng so với tháng trước</h3>
<p>Doanh thu từng tháng năm 2026 (đã trả + đang giao, giờ Việt Nam — Bài 5.3), rồi một cửa sổ chạy trên mười hai tài liệu tháng:</p>
${lenh(K, 0)}
<p><code>luyKe</code> dùng cửa sổ <code>documents: ['unbounded', 'current']</code> — từ tài liệu đầu tiên của phân vùng tới tài liệu này: một tổng luỹ kế, 26,7 tỉ tính tới tháng 10. <code>$shift</code> với <code>by: -1</code> đọc một trường của tài liệu đứng trước; với tháng 1 nó là <code>null</code>, và <code>$cond</code> giữ nó là <code>null</code> thay vì chia cho không có gì. Tháng 2 tăng 34,6%, tháng 3 giảm 42%. Thứ tự stage quan trọng: <code>$group</code> trước (mỗi tháng một tài liệu), cửa sổ sau.</p>
${nguon('📘', '$setWindowFields (aggregation) — MongoDB Docs', 'partitionBy, sortBy, cửa sổ documents và range, các toán tử cửa sổ', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/setWindowFields/')}

<h3>Xếp hạng trong từng phân vùng</h3>
<p>"Hai khách tốt nhất của mỗi thành phố" — câu hỏi khá vụng về nếu chỉ có <code>$group</code>:</p>
${lenh(K, 1)}
<p><code>partitionBy: '$_id.city'</code> bắt đầu lại việc xếp hạng ở mỗi thành phố; <code>sortBy: { dt: -1 }</code> xếp theo doanh thu; <code>$match: { hang: { $lte: 2 } }</code> giữ hai người đứng đầu. Khác với <code>$topN</code> (Bài 5.1), hạng ở đây là một trường mà bạn hiện ra được ("bạn đứng thứ 2 ở Cần Thơ") và lọc được.</p>

<h3>Hoà điểm: $rank, $denseRank, $documentNumber</h3>
${lenh(K, 2)}
<p>Bình và Chi bằng điểm nhau. <code>$rank</code> cho cả hai hạng 2 và bỏ qua hạng 3 (kiểu xếp hạng Olympic: hai huy chương bạc, không có đồng); <code>$denseRank</code> cho cả hai hạng 2 và đi tiếp hạng 3; <code>$documentNumber</code> đánh số dòng từ 1 tới 5 và phá hoà tuỳ ý — ổn cho phân trang, không công bằng khi trao giải. Hãy chọn có chủ đích, và thêm một trường sắp xếp thứ hai nếu cần phá hoà theo một luật rõ ràng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — cửa sổ không có thứ tự.</strong> Tổng luỹ kế chỉ có nghĩa khi đi theo một thứ tự. Quên <code>sortBy</code> thì MongoDB từ chối chứ không đoán:</p>
${lenh(K, 3)}
<p>Lỗi đó là một món quà. Phiên bản im lặng của lỗi này là <code>sortBy</code> trên nhầm trường (ví dụ chuỗi <code>'2026-10'</code> sắp đúng, còn <code>'10/2026'</code> sẽ đặt tháng 10 trước tháng 2). Hãy sắp cửa sổ theo ngày hoặc theo khoá định dạng ISO.</p>
</div>

<h3>Trung bình trượt theo thời gian: cửa sổ range</h3>
<p>Số đơn mỗi ngày đầu tháng 3 trong collection một triệu đơn, kèm trung bình trượt bảy ngày. Cửa sổ <code>range</code> với <code>unit: 'day'</code> nghĩa là "các tài liệu có giá trị <code>sortBy</code> nằm từ sáu ngày trước tới ngày này" — theo thời gian, không theo vị trí:</p>
${lenh(K, 4)}
<p>Nhìn <code>soNgayTrongCuaSo</code>: ngày 5 và 6/3 cửa sổ chỉ có 5 và 6 ngày, vì dữ liệu bắt đầu từ 1/3. Bảng điều khiển nên hoặc ẩn mấy ngày đầu, hoặc ghi rõ "trung bình của những ngày đang có". Khác biệt giữa hai loại cửa sổ trở nên quan trọng khi thiếu ngày: <code>documents: [-6, 0]</code> là "bảy <em>dòng</em> gần nhất", có thể trải dài hai tuần nếu vắng ngày; <code>range: [-6, 0], unit: 'day'</code> luôn là "bảy <em>ngày lịch</em> gần nhất".</p>

<h3>Lấp chỗ trống: $densify và $fill</h3>
<p>Biểu đồ số đơn mỗi tháng của một khách cần có điểm cho những tháng không có đơn, nếu không đường biểu diễn nhảy cóc từ tháng 3 sang tháng 6. <code>$densify</code> chèn các giá trị còn thiếu của một trường theo một bước cố định, <code>$fill</code> điền các trường còn lại. Lần thử đầu, với tháng được cắt theo giờ Việt Nam:</p>
${lenh(K, 5)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — $densify không có múi giờ.</strong> Khoá tháng là 17:00 UTC ngày cuối tháng trước (nửa đêm ở Việt Nam). <code>$densify</code> cộng từng tháng một theo UTC, bắt đầu từ 17:00 ngày 31/12: ra 31/1, rồi 28/2 (không có ngày 31/2), rồi 28/3, 28/4… Các khoá sinh ra trôi về ngày 28 và không còn bằng các khoá thật (31/5, 30/6). Kết quả vừa có tháng trống giả, <em>vừa</em> có tháng thật nằm cạnh nhau. Không lỗi, biểu đồ hỏng. Cách sửa: cho khoá là ngày đầu tháng theo lịch — dựng từ năm và tháng tính theo giờ Việt Nam, lưu ở 00:00 UTC — để bước từng tháng không bao giờ bị trôi:</p>
${lenh(K, 6)}
<p>Mười tháng, từ tháng 1 tới tháng 10, tháng trống điền 0, tổng 10 đơn — khớp với số đơn thật của khách.</p>
</div>
${nguon('📘', '$densify (aggregation) — MongoDB Docs', 'field, step, unit, bounds; không có tuỳ chọn timezone', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/densify/')}

<h3>Thêm hai mẫu bạn sẽ cần</h3>
<p><strong>Khoảng thời gian giữa các sự kiện.</strong> <code>$shift</code> trong phân vùng theo từng khách cho ra ngày của đơn trước; <code>$dateDiff</code> biến cặp đó thành số ngày. Khách mất bao lâu mới quay lại?</p>
${lenh(K, 7)}
<p>KH0001 quay lại 9 lần, trung bình mỗi 28,2 ngày; KH0002 mỗi 16,5 ngày. "Khoảng cách giữa hai lần mua" này là đầu vào chuẩn cho báo cáo khách trung thành và khách rời bỏ ("gửi lời nhắc nếu khách chưa đặt đơn sau gấp đôi khoảng cách thường lệ của họ").</p>
<p><strong>Tỉ trọng trong tổng.</strong> Cửa sổ không có <code>sortBy</code> và không có biên bao trùm cả phân vùng — ở đây là cả kết quả — nên tài liệu nào cũng thấy được tổng chung:</p>
${lenh(K, 8)}
<p>Đà Nẵng mang về 23,2% doanh thu. Cách này thay cho mẫu cũ là chạy thêm một truy vấn thứ hai để lấy tổng. Những toán tử cửa sổ khác nên biết tên: <code>$expMovingAvg</code> (trung bình trượt hàm mũ), <code>$derivative</code> và <code>$integral</code> (tốc độ cho dữ liệu cảm biến), <code>$locf</code> (mang giá trị cuối cùng đi tiếp), <code>$minN</code>/<code>$maxN</code>.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-8-3-lag-running-total', title: 'PostgreSQL 8.3 — LAG và tổng luỹ kế', sub: 'Cùng các ý đó dưới dạng OVER (PARTITION BY … ORDER BY …) trong SQL' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-8-2-ranking', title: 'PostgreSQL 8.2 — Xếp hạng', sub: 'RANK, DENSE_RANK, ROW_NUMBER — tên SQL của $rank, $denseRank, $documentNumber' })}

<h3>💼 Đi làm: bảng xếp hạng doanh số</h3>
<p>Một tính năng hay gặp ở dự án thương mại điện tử hay edtech Việt Nam: bảng xếp hạng hằng tháng (người bán giỏi nhất mỗi vùng, học viên chăm nhất mỗi lớp) kèm "hạng của bạn" trên trang của từng người dùng. Trước khi có hàm cửa sổ, các đội tính hạng trong mã ứng dụng trên cả danh sách — chậm, và sai khi hoà điểm. Với <code>$setWindowFields</code>, việc xếp hạng là một stage; kèm một <code>$merge</code> chạy đêm (Bài 5.5) nó thành một collection nhỏ mà trang đọc theo id người dùng. Những quyết định mà người review sẽ bắt bạn ghi ra: phân vùng (theo vùng? theo lớp?), luật hoà (<code>$rank</code> hay <code>$denseRank</code>, và trường sắp xếp thứ hai), và múi giờ của "tháng này".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"$group khác $setWindowFields thế nào?"</strong> — $group gập mỗi nhóm thành một tài liệu; $setWindowFields giữ mọi tài liệu và thêm giá trị tính trên một cửa sổ.</li>
<li><strong>"Cửa sổ documents khác cửa sổ range thế nào?"</strong> — Theo vị trí (N dòng gần nhất) so với theo khoảng cách giá trị (N ngày gần nhất); khác nhau khi thiếu giá trị.</li>
<li><strong>"$rank, $denseRank, $documentNumber khác nhau ra sao?"</strong> — 1-2-2-4 so với 1-2-2-3 so với 1-2-3-4.</li>
<li><strong>"Tính tăng trưởng so với tháng trước thế nào?"</strong> — Gom theo tháng, rồi $shift −1 sắp theo tháng; xử lý null của tháng đầu.</li>
<li><strong>"Biểu đồ thủng ở những tháng không có dữ liệu. Sửa sao?"</strong> — $densify + $fill, với khoá không bị trôi (khoá tháng theo lịch, không phải thời điểm UTC của nửa đêm giờ địa phương).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Với mỗi danh mục sản phẩm, doanh thu từng tháng năm 2026 và tổng luỹ kế <em>theo danh mục</em> (giờ Việt Nam). Trường nào của cửa sổ làm tổng luỹ kế bắt đầu lại?</li>
<li>Xếp hạng cả 200 khách theo số đơn bằng <code>$denseRank</code>. Có bao nhiêu hạng khác nhau? Vì sao con số đó nhỏ hơn 200?</li>
<li>Trên <code>ch4.don</code>, số đơn mỗi ngày tháng 2/2026 (giờ Việt Nam) kèm trung bình trượt 7 ngày, một lần dùng <code>documents: [-6, 0]</code> và một lần dùng <code>range</code>. Xoá mọi đơn của một ngày trong một bản sao dữ liệu và so hai trung bình ở những ngày sau đó.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>$unwind</code> items → <code>$lookup</code> sang products lấy danh mục (hoặc gom theo sản phẩm trước, Bài 5.2) → <code>$group</code> theo <code>{ cat, thang }</code> → <code>$setWindowFields: { partitionBy: '$_id.cat', sortBy: { '_id.thang': 1 }, output: { luyKe: { $sum: '$dt', window: { documents: ['unbounded', 'current'] } } } }</code>. <code>partitionBy</code> làm nó bắt đầu lại.</p>
<p>2. <code>$group</code> theo <code>customerId</code> với <code>$sum: 1</code>, rồi <code>$setWindowFields: { sortBy: { n: -1 }, output: { r: { $denseRank: {} } } }</code>, rồi đếm các giá trị <code>r</code> khác nhau. Số đơn chỉ chạy từ 3 tới 20, nên có nhiều nhất 18 giá trị khác nhau (dữ liệu lab có đúng 18) — nhiều khách chung một hạng.</p>
<p>3. Khi thiếu một ngày, cửa sổ <code>documents</code> của sáu ngày sau đó với xa thêm một ngày về trước (nó vẫn lấy bảy dòng), nên trải trên tám ngày lịch; cửa sổ <code>range</code> trải trên bảy ngày lịch và lấy trung bình sáu giá trị. Bản <code>range</code> mới là "7 ngày gần nhất" trung thực; nếu ngày bị thiếu thật sự có 0 đơn, hãy <code>$densify</code> + <code>$fill</code> bằng 0 trước.</p>
</details>
<p><strong>Xong khi:</strong> với mọi câu hỏi kiểu "so với các tài liệu lân cận", bạn gọi tên được phân vùng, thứ tự, cửa sổ và toán tử trước khi viết stage.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Hàm cửa sổ (window function)', 'Giá trị tính cho từng tài liệu trên một tập tài liệu lân cận, không gập chúng lại.'],
  ['$setWindowFields', 'Stage thêm các trường tính bằng cửa sổ (MongoDB 5.0+).'],
  ['partitionBy / sortBy', 'Các nhóm độc lập / thứ tự bên trong mỗi nhóm.'],
  ['Cửa sổ documents', 'Biên theo vị trí: [-6, 0] = dòng này và sáu dòng trước; "unbounded" = tới mép.'],
  ['Cửa sổ range', 'Biên theo khoảng cách giá trị sortBy, có unit cho ngày tháng: [-6, 0] ngày.'],
  ['$shift', 'Giá trị của một trường ở tài liệu đứng trước/sau N vị trí trong phân vùng đã sắp (LAG/LEAD).'],
  ['$rank / $denseRank / $documentNumber', 'Hạng có nhảy số / không nhảy số / số thứ tự dòng.'],
  ['$densify / $fill', 'Chèn các bước còn thiếu của một trường / điền các trường khác của tài liệu được chèn.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Hàm cửa sổ thêm một giá trị vào mọi tài liệu, tính trên các tài liệu lân cận; $group thì gập lại.</li>
<li>Luỹ kế = <code>$sum</code> với <code>['unbounded', 'current']</code>; tăng trưởng = <code>$shift</code> −1.</li>
<li><code>partitionBy</code> bắt đầu lại theo nhóm; xếp hạng cần <code>sortBy</code> và một luật hoà có chủ đích.</li>
<li>Cửa sổ documents đếm dòng, cửa sổ range đếm thời gian — khác nhau khi thiếu ngày.</li>
<li><code>$densify</code> không có múi giờ: bước trên khoá theo lịch, nếu không các tháng trôi về ngày 28.</li>
<li>Cửa sổ trên cả phân vùng cho mỗi tài liệu thấy tổng chung — tính tỉ trọng trong một lượt.</li>
</ul>
</div>
`,
};
