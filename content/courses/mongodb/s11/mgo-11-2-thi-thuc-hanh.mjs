/**
 * 11.2 — Đề thi thực hành có giờ (kiểu PE) — soạn 25/11/2026 (tiếp quản agent mgo, chạy demo trên máy nhà, mgo-lab MongoDB 8.0.38).
 * Output thật: ../_ma.mjs OUT['s11-2-pe'] (kịch bản scratchpad/mgo/demo/s11/s11-2-pe.txt). Khối: 0 nạp · 1–2 tài liệu mẫu · 3 chấm bài ngây thơ (4,65)
 *   · 4–10 soi từng bẫy · 11 chấm lời giải (10/10).
 * Tệp đề (đọc NGUYÊN VĂN từ ../_demo/pe11/ lúc nạp module — không chép tay): nap.js, cham.sh, cham.js, dong.js, loi-giai/q1–q6.js, bai-lam-ngay-tho/q1–q6.js.
 * Thứ tự tiến trình ở bài thử đồng thời Q5 và số vé "đặt được" mỗi tiến trình đổi theo từng lượt chạy; số ghế bán trùng của bài ngây thơ dao động ~30.
 */
import fs from 'node:fs';
import { lenh, ma, kv, loiGiai, lienKet, nguon } from '../_chung.mjs';

const K = 's11-2-pe';
const tep = (p) => fs.readFileSync(new URL('../_demo/pe11/' + p, import.meta.url), 'utf8').trimEnd();
const LG = (q) => ma('js', tep('loi-giai/' + q + '.js'));
const NT = (q) => ma('js', tep('bai-lam-ngay-tho/' + q + '.js'));

const DE_EN = `
<table>
<tr><th>Q</th><th>Points</th><th>Task (file in your folder)</th></tr>
<tr><td>Q1</td><td>1.5</td><td><code>q1.js</code> — add a <code>$jsonSchema</code> validator to <code>ve</code> (tickets). Required: <code>khachId</code>, <code>suatId</code>, <code>ghe</code>, <code>tong</code>, <code>trangThai</code>, <code>taoLuc</code>. <code>ghe</code> is an array of 1–8 seat codes; <code>tong</code> is money (Decimal128, ≥ 0); <code>trangThai</code> is <code>DA_THANH_TOAN</code> or <code>HUY</code>; <code>taoLuc</code> is a date. Existing tickets must stay valid.</td></tr>
<tr><td>Q2</td><td>2</td><td><code>q2.js</code> — three functions that <strong>return</strong> results (do not print):<br>
<code>q2a(db)</code>: films whose genres include <em>both</em> "Hành động" and "Khoa học viễn tưởng" (other genres allowed, any order) with <code>diemImdb</code> ≥ 7; fields <code>_id, ten, diemImdb</code>; sorted by score descending, then <code>_id</code> ascending. (0.75)<br>
<code>q2b(db)</code>: the <code>_id</code> list (ascending) of showtimes in cinemas located in Hà Nội on <strong>5 December 2026, Vietnam time</strong>. (0.75)<br>
<code>q2c(db, sau)</code>: keyset pagination of customer <code>K0042</code>'s tickets, newest first (<code>taoLuc</code> descending, ties by <code>_id</code> descending), 5 per page; <code>sau</code> is <code>null</code> for the first page or the last ticket of the previous page. Walking every page must return every ticket exactly once. (0.5)</td></tr>
<tr><td>Q3</td><td>1.5</td><td><code>q3.js</code> — create the index for the screen "showtimes of film X at cinema Y from time T": <code>find({ phimId, rapId, batDau: { $gte: T } }).sort({ batDau: 1 })</code>. Graded by explain: IXSCAN, no SORT, keys examined = documents examined = returned. At most 2 new indexes.</td></tr>
<tr><td>Q4</td><td>2</td><td><code>q4.js</code> — <code>q4a(db)</code>: revenue of paid tickets per cinema per <strong>month of the showtime, Vietnam time</strong>: <code>[{ rap, thang: "2026-11", doanhThu, soVe }]</code> sorted by <code>rap</code>, then <code>thang</code>. (1) · <code>q4b(db)</code>: top 5 films by <strong>seats</strong> sold on paid tickets: <code>[{ phimId, ten, soGhe }]</code>, ties by <code>phimId</code> ascending. (1)</td></tr>
<tr><td>Q5</td><td>2</td><td><code>q5.js</code> — <code>datGhe(db, suatId, dsGhe, khachId)</code> books several seats of one showtime: <strong>all or none</strong>, never two tickets for one seat, even when many people click at the same moment. On success the seats become <code>DAT</code> with <code>datBoi = khachId</code> and one ticket is inserted (<code>tong</code> = ticket price per seat, +20,000 for each VIP seat); return <code>{ ok: true, veId }</code>, otherwise <code>{ ok: false, lyDo }</code>.</td></tr>
<tr><td>Q6</td><td>1</td><td><code>q6.js</code> — computed pattern: give <em>every</em> showtime a field <code>soGheTrong</code> = number of seats still <code>TRONG</code>, with one command that runs on the server (no loop in the shell).</td></tr>
</table>`;

const DE_VI = `
<table>
<tr><th>Câu</th><th>Điểm</th><th>Yêu cầu (tệp trong thư mục bài làm)</th></tr>
<tr><td>Q1</td><td>1,5</td><td><code>q1.js</code> — thêm validator <code>$jsonSchema</code> cho <code>ve</code> (vé). Bắt buộc có: <code>khachId</code>, <code>suatId</code>, <code>ghe</code>, <code>tong</code>, <code>trangThai</code>, <code>taoLuc</code>. <code>ghe</code> là mảng 1–8 mã ghế; <code>tong</code> là tiền (Decimal128, ≥ 0); <code>trangThai</code> là <code>DA_THANH_TOAN</code> hoặc <code>HUY</code>; <code>taoLuc</code> là ngày giờ. Vé đang có phải vẫn hợp lệ.</td></tr>
<tr><td>Q2</td><td>2</td><td><code>q2.js</code> — ba hàm <strong>trả về</strong> kết quả (không in ra):<br>
<code>q2a(db)</code>: phim có thể loại gồm <em>cả hai</em> "Hành động" và "Khoa học viễn tưởng" (có thể thêm thể loại khác, thứ tự nào cũng được) và <code>diemImdb</code> ≥ 7; lấy <code>_id, ten, diemImdb</code>; sắp điểm giảm dần, trùng thì <code>_id</code> tăng dần. (0,75)<br>
<code>q2b(db)</code>: danh sách <code>_id</code> (tăng dần) các suất chiếu ở rạp đặt tại Hà Nội trong <strong>ngày 05/12/2026 theo giờ Việt Nam</strong>. (0,75)<br>
<code>q2c(db, sau)</code>: phân trang keyset vé của khách <code>K0042</code>, mới nhất trước (<code>taoLuc</code> giảm dần, trùng thì <code>_id</code> giảm dần), 5 vé một trang; <code>sau</code> là <code>null</code> cho trang đầu hoặc vé cuối của trang trước. Đi hết các trang phải ra mỗi vé đúng một lần. (0,5)</td></tr>
<tr><td>Q3</td><td>1,5</td><td><code>q3.js</code> — tạo index cho màn hình "lịch chiếu phim X ở rạp Y từ thời điểm T": <code>find({ phimId, rapId, batDau: { $gte: T } }).sort({ batDau: 1 })</code>. Chấm bằng explain: IXSCAN, không SORT, số khoá quét = số tài liệu quét = số trả về. Tối đa 2 index mới.</td></tr>
<tr><td>Q4</td><td>2</td><td><code>q4.js</code> — <code>q4a(db)</code>: doanh thu vé đã thanh toán theo rạp theo <strong>tháng của suất chiếu, giờ Việt Nam</strong>: <code>[{ rap, thang: "2026-11", doanhThu, soVe }]</code> sắp theo <code>rap</code> rồi <code>thang</code>. (1) · <code>q4b(db)</code>: 5 phim bán nhiều <strong>ghế</strong> nhất trên vé đã thanh toán: <code>[{ phimId, ten, soGhe }]</code>, trùng thì <code>phimId</code> tăng dần. (1)</td></tr>
<tr><td>Q5</td><td>2</td><td><code>q5.js</code> — <code>datGhe(db, suatId, dsGhe, khachId)</code> đặt nhiều ghế của một suất: <strong>tất cả hoặc không ghế nào</strong>, không bao giờ hai vé cho một ghế, kể cả khi nhiều người bấm cùng lúc. Thành công thì các ghế thành <code>DAT</code> với <code>datBoi = khachId</code> và thêm đúng một vé (<code>tong</code> = giá vé mỗi ghế, ghế VIP cộng 20.000); trả <code>{ ok: true, veId }</code>, ngược lại <code>{ ok: false, lyDo }</code>.</td></tr>
<tr><td>Q6</td><td>1</td><td><code>q6.js</code> — computed pattern: cho <em>mọi</em> suất chiếu thêm trường <code>soGheTrong</code> = số ghế còn <code>TRONG</code>, bằng một lệnh chạy trên máy chủ (không lặp trong shell).</td></tr>
</table>`;

export default {
  title: '11.2 — Timed practical exam (PE style)|||11.2 — Đề thi thực hành có giờ (kiểu PE)',
  slug: 'mgo-11-2-thi-thuc-hanh',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đề thi thực hành 180 phút kiểu PE, chấm tự động: dữ liệu rạp chiếu phim CT Cinema tất định (6 rạp, 40 phim, 600 suất có 80 ghế nhúng, 2.734 vé), 6 câu 10 điểm — validator, ba truy vấn (mảng $all, ngày theo giờ Việt Nam, keyset có trùng taoLuc), index ESR chấm bằng explain, báo cáo theo tháng giờ Việt Nam, đặt ghế nguyên tử có bắn đồng thời 4 tiến trình, computed pattern. Bài làm "ngây thơ" thật được 4,65/10 (30 ghế bán hai lần, sót 5 vé khi phân trang, 850.000 đ doanh thu lệch tháng); lời giải 10/10, che sẵn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2 · Practical exam</span>
<h2>Timed practical exam (PE style): CT Cinema in 180 minutes</h2>
<p class="lead">At FPT University a PE is short and unforgiving: fixed time, data given, a script grades your files and "almost right" scores zero for that item. This exam works the same way, on a domain you have not seen in the course — a cinema chain — so it tests whether the ideas transfer, not whether you remember CT Shop. Six questions, 10 points, pass at 5. Do it under real conditions once before you read the solution.</p>
<p>Think of a driving test on a closed course. The examiner does not care how confident you looked; they check a list — did the wheel cross the line at this cone, yes or no. The grader here is that examiner: it reloads the data before every question, runs your function, and compares the result with the right answer.</p>

<h3>Rules</h3>
<ul>
<li>180 minutes. MongoDB documentation allowed; no AI assistant, no copying from the earlier labs' solution files (you may re-read lessons).</li>
<li>Hand in one folder <code>pe11/bai-lam/</code> with <code>q1.js</code> … <code>q6.js</code>. Function names and return shapes exactly as written. Functions <strong>return</strong>; nothing is graded from printed output.</li>
<li>Every question is graded on freshly loaded data, so a mistake in Q5 cannot cost you Q6. A file that fails to load scores 0 for that question.</li>
</ul>

<h3>Setup and data</h3>
<p>You need the lab of Lesson 0.2 (<code>mgo-lab</code>, replica set — Q5 may use a transaction). Work in <code>_demo/</code>. The loader is deterministic: same data on every machine, which is why the grader can hold only fingerprints of the right answers.</p>
${lenh(K, 0)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rap (6)</span><span class="lz-t">_id R1–R6, ten, thanhPho</span><span class="lz-d">3 in Hà Nội, 2 in TP.HCM, 1 in Đà Nẵng</span></div>
  <div class="lz-step"><span class="lz-k">phim (40)</span><span class="lz-t">_id P001–P040, ten, theLoai [ ], thoiLuong, phatHanh, diemImdb</span><span class="lz-d">genres are an array</span></div>
  <div class="lz-step"><span class="lz-k">suat (600)</span><span class="lz-t">phimId, rapId, batDau (Date, UTC), giaVe (Decimal128), ghe [80]</span><span class="lz-d">seats EMBEDDED: A–F normal, G–H VIP; ~12% late-night shows after midnight</span></div>
  <div class="lz-step"><span class="lz-k">ve (2,734)</span><span class="lz-t">khachId, suatId, rapId, phimId, ghe [ ], tong, trangThai, taoLuc</span><span class="lz-d">extended reference: rapId/phimId copied from the showtime; taoLuc rounded to the hour</span></div>
</div>
${lenh(K, 1)}
${lenh(K, 2)}
<p>Notice what the documents tell you before you write anything: <code>batDau</code> of S0002 is <code>2026-12-04T17:15Z</code> — in Hà Nội that is 00:15 on 5 December. Prices are <code>Decimal128</code>. A seat is a sub-document with its own state, so "is G1 free?" is a question about <em>one element</em> of an array.</p>

<h3>The questions (10 points)</h3>
${DE_EN}

<h3>Suggested time budget</h3>
<table>
<tr><th>Minutes</th><th>What</th></tr>
<tr><td>0–15</td><td>Load the data, read three documents of each collection, note dates, types, arrays</td></tr>
<tr><td>15–40</td><td>Q1 and Q6 (short, certain points)</td></tr>
<tr><td>40–90</td><td>Q2 and Q3 — test each with your own expected numbers before moving on</td></tr>
<tr><td>90–135</td><td>Q4</td></tr>
<tr><td>135–170</td><td>Q5, then fire it concurrently yourself (four <code>docker exec … &amp;</code> as in Lesson 2.5)</td></tr>
<tr><td>170–180</td><td>Run the grader on your folder, fix file names</td></tr>
</table>

<h3>How it is graded</h3>
<p><code>./pe11/cham.sh pe11/bai-lam</code> reloads the data before each question, loads your file into mongosh and checks the result. For Q2/Q4 it normalises your output (for example <code>doanhThu</code> as a string) and compares its md5 with the fingerprint of the right answer. For Q5 it first runs two sequential cases, then starts four mongosh processes that wait for a shared start time and race through 40 showtimes booking overlapping seat pairs (<code>A1+A2</code> against <code>A2+A3</code>), and finally counts seats sold to more than one ticket.</p>
<details><summary>Show the grader (cham.sh)</summary>
${ma('bash', tep('cham.sh'))}
</details>
<details><summary>Show the grader checks (cham.js) — fingerprints only, no answers</summary>
${ma('js', tep('cham.js'))}
</details>
<details><summary>Show the concurrent test (dong.js)</summary>
${ma('js', tep('dong.js'))}
</details>
<details><summary>Show the data loader (nap.js)</summary>
${ma('js', tep('nap.js'))}
</details>

<h3>What a failing submission looks like</h3>
<p>Below is a real run on a "naive" submission written the way many students write under time pressure — every function runs, nothing crashes, and it scores 4.65. Read the grader output first; the analysis of each lost point is in the solution below, so try the exam before opening it.</p>
${lenh(K, 3)}

<div class="pitfall co-tieu-de">
<p><strong>Trap — "it ran without errors".</strong> Every naive function returned something plausible: 1 showtime, 30 tickets, 13 report rows, 65 tickets sold. In a PE, and in production, the dangerous bug is the one that returns a believable wrong answer. Before you move on from a question, check one number you can compute independently (count the tickets of K0042; count showtimes of one day by hand).</p>
</div>

<h3>Solution</h3>
${loiGiai('Show the analysis of the 4.65 submission (open after your attempt)', `
<p><strong>Q1 — 0.9 of 1.5.</strong> The naive validator forgot <code>taoLuc</code> in <code>required</code>, had no <code>maxItems</code>, and allowed <code>double</code> for money. Each missing rule is a probe that got through. A validator is only as strong as the rules you wrote — list the requirements and turn each one into a rule.</p>
${NT('q1')}
<p><strong>Q2b — the Vietnam-time day.</strong> <code>ISODate("2026-12-05")</code> is midnight <em>UTC</em>, which is 07:00 in Hà Nội. The naive range lost S0002 (00:15 on 5/12 in Hà Nội, stored as 4/12 17:15Z) and included S0003 (00:45 on 6/12 in Hà Nội):</p>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p><strong>Q2c — ties in the cursor.</strong> K0042 has 35 tickets, six bought in the same hour. Paging with only <code>taoLuc: { $lt: last }</code> jumps over the rest of a tie group at a page boundary: the walk returned 30 tickets, 5 vanished. The cursor must be the full sort key: <code>(taoLuc, _id)</code>.</p>
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
<p><strong>Q3 — 1 of 1.5.</strong> <code>{ phimId: 1, batDau: 1 }</code> avoids the SORT but scans every future showtime of P007 at <em>all</em> cinemas (9 keys for 4 results). ESR puts both equality fields first: <code>{ phimId: 1, rapId: 1, batDau: 1 }</code> ⇒ 4 keys, 4 documents, 4 returned.</p>
<p><strong>Q4a — the month of a late-night show.</strong> <code>$dateToString</code> without <code>timezone</code> groups in UTC. The 00:30 show on 1 December (Vietnam) is 30 November in UTC, so its 4 tickets — 850,000 đ — moved to the wrong month, and one cinema got a "2026-10" row that does not exist in Vietnam time (13 rows instead of 12):</p>
${lenh(K, 10)}
<p><strong>Q5 — 1 of 2.</strong> The sequential cases pass: check, then write. Under concurrency two processes both read "free" before either writes, and both write — 30 seats ended up on two tickets. The check and the write must be one atomic operation on the showtime document (Lesson 2.5, 6.1).</p>
${NT('q5')}
<p><strong>Q6 — 0.</strong> <code>$size: "$ghe"</code> counts all 80 seats, not the free ones: 594 of 600 showtimes wrong (the other 6 happened to have no bookings).</p>
`)}
${loiGiai('Show the solution files q1–q6', `
${LG('q1')}
<p>Every requirement is one rule; <code>uniqueItems</code> and the seat-code pattern are extra safety, not required. Use <code>collMod</code> on an existing collection; existing tickets satisfy it, so <code>validationLevel: "strict"</code> is safe.</p>
${LG('q2')}
<p>Write dates with an explicit offset (<code>+07:00</code>) — the code then says what it means. In q2c the <code>$or</code> is exactly "after this position in (taoLuc desc, _id desc) order"; an index on <code>{ khachId: 1, taoLuc: -1, _id: -1 }</code> would make every page an index range.</p>
${LG('q3')}
${LG('q4')}
<p><code>$lookup</code> fetches only <code>batDau</code> (pipeline with <code>$project</code>); the month is computed with <code>timezone: "Asia/Ho_Chi_Minh"</code>. <code>$sum</code> of Decimal128 stays Decimal128 — no rounding.</p>
${LG('q5')}
<p>The filter of <code>findOneAndUpdate</code> matches only if <em>every</em> requested seat is <code>TRONG</code> (<code>$all</code> of <code>$elemMatch</code>), and the update marks them in the same operation, so two buyers can never both win. The transaction keeps seat state and the ticket together: if the insert fails, the seats go back to free. <code>withTransaction</code> retries the write conflicts that concurrent buyers cause.</p>
${LG('q6')}
`)}
${loiGiai('Show the grader run on the solution: 10/10', `${lenh(K, 11)}
<p>In this run process 1 won 24 showtimes and processes 2 and 3 the rest; who wins changes every run, the result does not: 40 showtimes, 40 tickets, 0 seats sold twice.</p>`)}

<h3>On the job</h3>
<p>In an outsourcing project the client's QA team often writes acceptance tests exactly like this grader — fixed data, expected results, a concurrency test for the money path — and your sprint is accepted or rejected by the script. Teams that pass reliably do two things this exam rewards: they read the data before coding (types, time zones, arrays), and they write their own small check before handing in.</p>

<h3>Defence questions</h3>
<ol>
<li>Your Q5 uses a transaction. Would the conditional <code>findOneAndUpdate</code> alone already prevent double-booking? What does the transaction add?</li>
<li>The cinema adds a "hold seat for 10 minutes" feature. Which fields and which index do you add, and how do held seats expire?</li>
<li>Q4a runs every night on 10 million tickets. What would you change — <code>$lookup</code>, an extended reference of <code>batDau</code> in <code>ve</code>, or a <code>$merge</code> into a monthly collection?</li>
<li>Why does the grader reload data before each question, and what does that teach you about your own tests?</li>
</ol>
${loiGiai('Show short answers', `<ol>
<li>Yes — the single-document conditional update is atomic, so the seat state alone is correct. The transaction makes seat state and the ticket insert one unit: without it, a crash between the two leaves seats DAT with no ticket.</li>
<li>Seat state <code>GIU</code> with <code>giuDen</code> (expiry time) and <code>giuBoi</code>; booking accepts <code>TRONG</code> or an expired hold in the same conditional filter. Expiry happens lazily in that filter (no job needed); a TTL index cannot remove an array element.</li>
<li>Copy <code>batDau</code> into the ticket (it never changes after sale) — the report then needs no join and an index on <code>{ trangThai, rapId, batDau }</code> can serve the match; for a dashboard, <code>$merge</code> monthly totals incrementally.</li>
<li>Tests that depend on the order they run in hide bugs and create false failures. Each test should set up the state it needs.</li>
</ol>`)}

<h3>Key terms</h3>
${kv([
  ['PE (practical exam)', 'Timed exam graded on what your code returns, by script'],
  ['Deterministic data', 'Generated with a fixed seed, identical on every machine — lets the grader store only fingerprints'],
  ['Late-night show', 'A showtime after midnight Vietnam time: stored the previous day in UTC'],
  ['Tie group', 'Documents with equal sort key; a cursor on that key alone skips part of the group'],
  ['Check-then-act', 'Read a condition, then write in a separate step — a race under concurrency'],
  ['Computed pattern', 'Store a value derived from the document (free seat count) so reads do not recompute it'],
])}

<h3>Summary</h3>
<ul>
<li>Read the data first: dates are UTC, money is Decimal128, seats are array elements.</li>
<li>Day and month boundaries in Vietnam need <code>+07:00</code> or <code>timezone: "Asia/Ho_Chi_Minh"</code>.</li>
<li>Keyset cursors use the whole sort key, including the tie-breaker.</li>
<li>ESR: equality fields first, then sort, then range — grade yourself with keys = docs = returned.</li>
<li>Check and write in one operation; prove it with concurrent processes, not with one happy path.</li>
</ul>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-2-5-xoa-nguyen-tu', title: 'MongoDB course · 2.5 — Atomic updates and oversell', sub: 'the four-process race this exam reuses for Q5' })}
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-4-3-compound-esr', title: 'MongoDB course · 4.3 — Compound indexes and ESR', sub: 'why the index for Q3 has three fields in that order' })}
${nguon('📘', 'MongoDB Docs — $dateToString', 'timezone accepts an Olson name such as Asia/Ho_Chi_Minh or an offset', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateToString/')}
${nguon('📘', 'MongoDB Docs — $elemMatch (query)', 'all conditions must match the same array element', 'https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2 · Thi thực hành</span>
<h2>Đề thi thực hành có giờ (kiểu PE): CT Cinema trong 180 phút</h2>
<p class="lead">Ở Đại học FPT, bài PE ngắn và không khoan nhượng: giờ cố định, dữ liệu cho sẵn, một script chấm tệp của bạn và "gần đúng" là 0 điểm cho ý đó. Đề này làm y như thế, trên một miền dữ liệu chưa xuất hiện trong khoá — một chuỗi rạp chiếu phim — để kiểm xem ý tưởng có chuyển sang bài toán mới được không, chứ không kiểm bạn nhớ CT Shop. Sáu câu, 10 điểm, đạt từ 5. Hãy làm một lần trong điều kiện thật trước khi đọc lời giải.</p>
<p>Hãy nghĩ tới bài thi sa hình lái xe. Giám khảo không quan tâm bạn trông tự tin thế nào; họ dò một danh sách: bánh xe có đè vạch ở cọc này không, có hay không. Máy chấm ở đây chính là giám khảo đó: nó nạp lại dữ liệu trước mỗi câu, gọi hàm của bạn, rồi so kết quả với đáp án đúng.</p>

<h3>Quy chế</h3>
<ul>
<li>180 phút. Được xem tài liệu MongoDB; không dùng trợ lý AI, không chép từ tệp lời giải của các lab trước (được đọc lại bài học).</li>
<li>Nộp một thư mục <code>pe11/bai-lam/</code> gồm <code>q1.js</code> … <code>q6.js</code>. Tên hàm và hình dạng kết quả đúng như đề. Hàm phải <strong>trả về</strong>; không chấm thứ được in ra màn hình.</li>
<li>Mỗi câu chấm trên dữ liệu vừa nạp lại, nên sai ở Q5 không kéo Q6 sai theo. Tệp không nạp được thì câu đó 0 điểm.</li>
</ul>

<h3>Chuẩn bị và dữ liệu</h3>
<p>Cần lab của Bài 0.2 (<code>mgo-lab</code>, replica set — Q5 có thể dùng transaction). Làm việc trong <code>_demo/</code>. Bộ nạp là tất định: máy nào cũng ra đúng một bộ dữ liệu, nhờ vậy máy chấm chỉ cần giữ vân tay của đáp án.</p>
${lenh(K, 0)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rap (6)</span><span class="lz-t">_id R1–R6, ten, thanhPho</span><span class="lz-d">3 rạp Hà Nội, 2 rạp TP.HCM, 1 rạp Đà Nẵng</span></div>
  <div class="lz-step"><span class="lz-k">phim (40)</span><span class="lz-t">_id P001–P040, ten, theLoai [ ], thoiLuong, phatHanh, diemImdb</span><span class="lz-d">thể loại là một mảng</span></div>
  <div class="lz-step"><span class="lz-k">suat (600)</span><span class="lz-t">phimId, rapId, batDau (Date, UTC), giaVe (Decimal128), ghe [80]</span><span class="lz-d">ghế NHÚNG: hàng A–F thường, G–H VIP; ~12% suất khuya sau nửa đêm</span></div>
  <div class="lz-step"><span class="lz-k">ve (2.734)</span><span class="lz-t">khachId, suatId, rapId, phimId, ghe [ ], tong, trangThai, taoLuc</span><span class="lz-d">extended reference: rapId/phimId chép từ suất; taoLuc làm tròn tới giờ</span></div>
</div>
${lenh(K, 1)}
${lenh(K, 2)}
<p>Hãy để ý những gì tài liệu nói với bạn trước khi viết dòng nào: <code>batDau</code> của S0002 là <code>2026-12-04T17:15Z</code> — ở Hà Nội đó là 00:15 ngày 05/12. Giá là <code>Decimal128</code>. Mỗi ghế là một tài liệu con có trạng thái riêng, nên câu hỏi "G1 còn trống không?" là câu hỏi về <em>một phần tử</em> của mảng.</p>

<h3>Đề bài (10 điểm)</h3>
${DE_VI}

<h3>Gợi ý chia thời gian</h3>
<table>
<tr><th>Phút</th><th>Làm gì</th></tr>
<tr><td>0–15</td><td>Nạp dữ liệu, đọc ba tài liệu mỗi collection, ghi lại ngày giờ, kiểu, mảng</td></tr>
<tr><td>15–40</td><td>Q1 và Q6 (ngắn, chắc điểm)</td></tr>
<tr><td>40–90</td><td>Q2 và Q3 — tự kiểm từng hàm bằng con số bạn tự tính trước khi sang câu khác</td></tr>
<tr><td>90–135</td><td>Q4</td></tr>
<tr><td>135–170</td><td>Q5, rồi tự bắn đồng thời (bốn lệnh <code>docker exec … &amp;</code> như Bài 2.5)</td></tr>
<tr><td>170–180</td><td>Chạy máy chấm trên thư mục của bạn, sửa tên tệp</td></tr>
</table>

<h3>Chấm thế nào</h3>
<p><code>./pe11/cham.sh pe11/bai-lam</code> nạp lại dữ liệu trước mỗi câu, nạp tệp của bạn vào mongosh rồi kiểm kết quả. Với Q2/Q4, nó chuẩn hoá kết quả của bạn (ví dụ <code>doanhThu</code> thành chuỗi) rồi so mã md5 với vân tay của đáp án. Với Q5, nó chạy hai trường hợp tuần tự, rồi mở bốn tiến trình mongosh cùng chờ một mốc xuất phát chung và đua qua 40 suất, đặt các cặp ghế chồng nhau (<code>A1+A2</code> đấu <code>A2+A3</code>), cuối cùng đếm số ghế bị bán cho hơn một vé.</p>
<details><summary>Xem máy chấm (cham.sh)</summary>
${ma('bash', tep('cham.sh'))}
</details>
<details><summary>Xem các phép kiểm (cham.js) — chỉ có vân tay, không có đáp án</summary>
${ma('js', tep('cham.js'))}
</details>
<details><summary>Xem bài thử đồng thời (dong.js)</summary>
${ma('js', tep('dong.js'))}
</details>
<details><summary>Xem bộ nạp dữ liệu (nap.js)</summary>
${ma('js', tep('nap.js'))}
</details>

<h3>Một bài làm trượt trông thế nào</h3>
<p>Dưới đây là lượt chấm thật một bài làm "ngây thơ", viết đúng kiểu nhiều bạn viết khi bị ép giờ — hàm nào cũng chạy, không gì sập, và được 4,65 điểm. Đọc output của máy chấm trước; phân tích từng điểm bị mất nằm trong lời giải bên dưới, nên hãy làm đề trước khi mở.</p>
${lenh(K, 3)}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chạy không báo lỗi".</strong> Hàm ngây thơ nào cũng trả về thứ trông hợp lý: 1 suất, 30 vé, 13 dòng báo cáo, 65 vé bán được. Trong bài PE, và cả trên production, lỗi nguy hiểm là lỗi trả về một đáp án sai mà nghe rất thật. Trước khi bỏ một câu, hãy kiểm một con số bạn tính được bằng cách khác (đếm vé của K0042; đếm tay số suất của một ngày).</p>
</div>

<h3>Lời giải</h3>
${loiGiai('Xem phân tích bài 4,65 điểm (mở sau khi đã tự làm)', `
<p><strong>Q1 — 0,9 trên 1,5.</strong> Validator ngây thơ quên <code>taoLuc</code> trong <code>required</code>, không có <code>maxItems</code>, và cho phép <code>double</code> cho tiền. Mỗi luật thiếu là một phép thử lọt qua. Validator chỉ chặt bằng đúng những luật bạn đã viết — hãy liệt kê yêu cầu rồi biến mỗi yêu cầu thành một luật.</p>
${NT('q1')}
<p><strong>Q2b — ngày theo giờ Việt Nam.</strong> <code>ISODate("2026-12-05")</code> là nửa đêm <em>UTC</em>, tức 07:00 ở Hà Nội. Khoảng ngây thơ đánh rơi S0002 (00:15 ngày 05/12 ở Hà Nội, lưu là 04/12 17:15Z) và lại lấy nhầm S0003 (00:45 ngày 06/12 ở Hà Nội):</p>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p><strong>Q2c — trùng giá trị ở con trỏ.</strong> K0042 có 35 vé, sáu vé mua trong cùng một giờ. Phân trang chỉ bằng <code>taoLuc: { $lt: vé cuối }</code> sẽ nhảy qua phần còn lại của nhóm trùng nằm ở ranh giới trang: đi hết trang chỉ ra 30 vé, mất 5. Con trỏ phải là trọn khoá sắp xếp: <code>(taoLuc, _id)</code>.</p>
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
<p><strong>Q3 — 1 trên 1,5.</strong> <code>{ phimId: 1, batDau: 1 }</code> tránh được SORT nhưng quét mọi suất sắp tới của P007 ở <em>tất cả</em> các rạp (9 khoá cho 4 kết quả). ESR đặt cả hai trường bằng lên trước: <code>{ phimId: 1, rapId: 1, batDau: 1 }</code> ⇒ 4 khoá, 4 tài liệu, trả 4.</p>
<p><strong>Q4a — tháng của một suất khuya.</strong> <code>$dateToString</code> không có <code>timezone</code> thì gom theo UTC. Suất 00:30 ngày 01/12 (giờ Việt Nam) là ngày 30/11 theo UTC, nên 4 vé của nó — 850.000 đ — sang nhầm tháng, và một rạp có thêm dòng "2026-10" vốn không tồn tại theo giờ Việt Nam (13 dòng thay vì 12):</p>
${lenh(K, 10)}
<p><strong>Q5 — 1 trên 2.</strong> Hai trường hợp tuần tự qua được: kiểm rồi ghi. Khi đồng thời, hai tiến trình cùng đọc thấy "trống" trước khi bên nào kịp ghi, rồi cả hai cùng ghi — 30 ghế nằm trên hai vé. Kiểm và ghi phải là một thao tác nguyên tử trên tài liệu suất chiếu (Bài 2.5, 6.1).</p>
${NT('q5')}
<p><strong>Q6 — 0.</strong> <code>$size: "$ghe"</code> đếm cả 80 ghế, không phải ghế trống: sai 594 trên 600 suất (6 suất còn lại tình cờ chưa ai đặt).</p>
`)}
${loiGiai('Xem lời giải q1–q6', `
${LG('q1')}
<p>Mỗi yêu cầu là một luật; <code>uniqueItems</code> và mẫu mã ghế là an toàn thêm, đề không bắt. Dùng <code>collMod</code> cho collection đã có; vé hiện có đều thoả nên <code>validationLevel: "strict"</code> là an toàn.</p>
${LG('q2')}
<p>Viết ngày giờ kèm độ lệch rõ ràng (<code>+07:00</code>) — đọc mã là biết ý. Ở q2c, <code>$or</code> đúng nghĩa "đứng sau vị trí này theo thứ tự (taoLuc giảm, _id giảm)"; thêm index <code>{ khachId: 1, taoLuc: -1, _id: -1 }</code> thì mỗi trang là một đoạn quét index.</p>
${LG('q3')}
${LG('q4')}
<p><code>$lookup</code> chỉ lấy <code>batDau</code> (pipeline có <code>$project</code>); tháng tính với <code>timezone: "Asia/Ho_Chi_Minh"</code>. <code>$sum</code> các Decimal128 vẫn là Decimal128 — không làm tròn.</p>
${LG('q5')}
<p>Bộ lọc của <code>findOneAndUpdate</code> chỉ khớp khi <em>mọi</em> ghế cần đặt đang <code>TRONG</code> (<code>$all</code> các <code>$elemMatch</code>), và lệnh cập nhật đánh dấu chúng trong cùng thao tác đó, nên hai người mua không bao giờ cùng thắng. Transaction giữ trạng thái ghế và vé đi cùng nhau: insert vé hỏng thì ghế trở lại trống. <code>withTransaction</code> tự thử lại các xung đột ghi do người mua đồng thời gây ra.</p>
${LG('q6')}
`)}
${loiGiai('Xem lượt chấm lời giải: 10/10', `${lenh(K, 11)}
<p>Ở lượt này tiến trình 1 thắng 24 suất, tiến trình 2 và 3 chia phần còn lại; ai thắng đổi theo mỗi lượt chạy, kết quả thì không: 40 suất, 40 vé, 0 ghế bán hai lần.</p>`)}

<h3>Khi đi làm</h3>
<p>Trong dự án outsourcing, đội QA của khách thường viết bài kiểm nghiệm thu y như máy chấm này — dữ liệu cố định, kết quả mong đợi, một bài thử đồng thời cho luồng dính tới tiền — và sprint của bạn được nhận hay bị trả lại là do script đó. Đội nào qua đều đặn thường làm hai việc mà đề này thưởng điểm: đọc dữ liệu trước khi viết mã (kiểu, múi giờ, mảng), và tự viết một phép kiểm nhỏ trước khi nộp.</p>

<h3>Câu hỏi bảo vệ</h3>
<ol>
<li>Q5 của bạn dùng transaction. Riêng lệnh <code>findOneAndUpdate</code> có điều kiện đã chặn được bán trùng ghế chưa? Transaction thêm được gì?</li>
<li>Rạp thêm tính năng "giữ ghế 10 phút". Bạn thêm trường nào, index nào, và ghế giữ hết hạn bằng cách nào?</li>
<li>Q4a chạy mỗi đêm trên 10 triệu vé. Bạn đổi gì — <code>$lookup</code>, chép <code>batDau</code> vào <code>ve</code> (extended reference), hay <code>$merge</code> vào một collection theo tháng?</li>
<li>Vì sao máy chấm nạp lại dữ liệu trước mỗi câu, và điều đó dạy gì về test của chính bạn?</li>
</ol>
${loiGiai('Xem đáp án ngắn', `<ol>
<li>Có — lệnh cập nhật có điều kiện trên một tài liệu là nguyên tử, nên riêng trạng thái ghế đã đúng. Transaction gộp trạng thái ghế và việc thêm vé thành một khối: không có nó, sập giữa hai bước sẽ để ghế DAT mà không có vé.</li>
<li>Trạng thái ghế <code>GIU</code> kèm <code>giuDen</code> (giờ hết hạn) và <code>giuBoi</code>; lệnh đặt chấp nhận <code>TRONG</code> hoặc ghế giữ đã hết hạn ngay trong bộ lọc có điều kiện. Hết hạn xử lý "lười" trong bộ lọc đó (không cần job); index TTL không xoá được một phần tử mảng.</li>
<li>Chép <code>batDau</code> vào vé (nó không đổi sau khi bán) — báo cáo không cần nối nữa, và index <code>{ trangThai, rapId, batDau }</code> phục vụ được stage $match; với bảng điều khiển thì <code>$merge</code> tổng theo tháng dần dần.</li>
<li>Test phụ thuộc thứ tự chạy sẽ che lỗi và gây báo hỏng giả. Mỗi test phải tự dựng trạng thái nó cần.</li>
</ol>`)}

<h3>Thuật ngữ</h3>
${kv([
  ['PE (thi thực hành)', 'Bài thi có giờ, chấm bằng script theo thứ mã của bạn trả về'],
  ['Dữ liệu tất định', 'Sinh bằng hạt giống cố định, máy nào cũng giống hệt — máy chấm chỉ cần giữ vân tay'],
  ['Suất khuya', 'Suất sau nửa đêm giờ Việt Nam: theo UTC được lưu vào ngày hôm trước'],
  ['Nhóm trùng', 'Các tài liệu bằng nhau ở khoá sắp xếp; con trỏ chỉ dùng khoá đó sẽ nhảy qua một phần nhóm'],
  ['Kiểm rồi ghi', 'Đọc điều kiện, rồi ghi ở bước riêng — gặp đồng thời là tranh chấp'],
  ['Computed pattern', 'Lưu sẵn giá trị suy ra từ tài liệu (số ghế trống) để lúc đọc khỏi tính lại'],
])}

<h3>Tóm tắt</h3>
<ul>
<li>Đọc dữ liệu trước: ngày giờ là UTC, tiền là Decimal128, ghế là phần tử mảng.</li>
<li>Ranh giới ngày, tháng theo giờ Việt Nam cần <code>+07:00</code> hoặc <code>timezone: "Asia/Ho_Chi_Minh"</code>.</li>
<li>Con trỏ keyset dùng trọn khoá sắp xếp, gồm cả trường phá hoà.</li>
<li>ESR: trường bằng trước, rồi sắp xếp, rồi khoảng — tự chấm bằng khoá = tài liệu = số trả về.</li>
<li>Kiểm và ghi trong một thao tác; chứng minh bằng các tiến trình đồng thời, không phải bằng một lượt chạy suôn sẻ.</li>
</ul>
${lienKet({ khoa: 'mongodb', bai: 'mgo-2-5-xoa-nguyen-tu', title: 'Khoá MongoDB · 2.5 — Cập nhật nguyên tử và bán vượt tồn kho', sub: 'cuộc đua bốn tiến trình mà Q5 dùng lại' })}
${lienKet({ khoa: 'mongodb', bai: 'mgo-4-3-compound-esr', title: 'Khoá MongoDB · 4.3 — Index phức hợp và ESR', sub: 'vì sao index của Q3 có ba trường theo đúng thứ tự đó' })}
${nguon('📘', 'MongoDB Docs — $dateToString', 'timezone nhận tên Olson như Asia/Ho_Chi_Minh hoặc độ lệch giờ', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateToString/')}
${nguon('📘', 'MongoDB Docs — $elemMatch (truy vấn)', 'mọi điều kiện phải khớp trên cùng một phần tử mảng', 'https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/')}
</div>
`,
};
