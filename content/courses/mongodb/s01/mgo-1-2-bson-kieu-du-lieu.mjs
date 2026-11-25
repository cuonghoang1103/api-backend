/**
 * 1.2 — Kiểu BSON: Date, Decimal128, int với double và bẫy tiền (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s01-2-bson'] (MongoDB 8.0.38, mongosh 2.14.3 trong mgo-lab; kịch bản demo/s01/s01-2-bson.txt).
 * Sự cố thật có nguồn (GET kiểm 24/11/2026): chỉ số Sở giao dịch chứng khoán Vancouver 1982–1983 (Wikipedia, dẫn WSJ 08/11/1983),
 * Patriot ở Dhahran 25/02/1991 (Wikipedia MIM-104 Patriot). Không trùng khoá khác (postgresql dạy NUMERIC phía SQL — liên kết).
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '1.2 — BSON types: Date, Decimal128, int vs double and the money trap|||1.2 — Kiểu BSON: Date, Decimal128, int với double và bẫy tiền',
  slug: 'mgo-1-2-bson-kieu-du-lieu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mỗi giá trị BSON mang một kiểu: một trường "giá" có thể là int, double, decimal hay chuỗi tuỳ ai ghi. Chạy thật 0,1 + 0,2 trong double và Decimal128, cộng 0,1 một triệu lần; vì sao 150000 thành int còn 149999,5 thành double; Long vượt 2^53 trong JavaScript; Date luôn là UTC và báo cáo "ngày 14/10" lệch 6 với 9 đơn; ngày lưu thành chuỗi làm truy vấn trượt; thứ tự so sánh giữa các kiểu; JSON làm rơi kiểu, EJSON giữ kiểu. Sự cố thật: chỉ số Vancouver mất một nửa giá trị vì làm tròn (1982–1983).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>BSON types: Date, Decimal128, int vs double and the money trap</h2>
<p class="lead">MongoDB does not have columns, but it absolutely has types — every single value carries one. The catch: the type is decided by <em>whoever writes the value</em>, so the same field can hold an int in one document, a double in another and a string in a third. This lesson shows the types you will use every day, the bugs that come from mixing them, and the two rules that prevent most of those bugs: <strong>money is Decimal128</strong> and <strong>time is Date in UTC</strong>.</p>

<h3>An everyday picture: a shop till and a calculator</h3>
<p>A shop counts money with a <strong>till</strong>: coins and notes, exact to the last đồng. A pocket calculator in scientific mode works with approximations: it can show 0.1 + 0.2 = 0.30000000000000004 if you look at enough digits. Both are useful — nobody wants a till to compute the trajectory of a rocket — but you never let the calculator keep the shop's books. In BSON, <code>double</code> is the calculator and <code>decimal</code> (Decimal128) is the till.</p>

<h3>The types you will actually use</h3>
<table>
<thead><tr><th>BSON type</th><th><code>$type</code> alias</th><th>mongosh / Node.js</th><th>Use for</th></tr></thead>
<tbody>
<tr><td>Double (64-bit float)</td><td><code>double</code></td><td><code>5.5</code>, <code>Double(5)</code></td><td>measurements, ratings, coordinates — never money</td></tr>
<tr><td>32-bit integer</td><td><code>int</code></td><td><code>5</code>, <code>Int32(5)</code></td><td>counts, quantities</td></tr>
<tr><td>64-bit integer</td><td><code>long</code></td><td><code>Long('5')</code></td><td>big counters, ids from other systems</td></tr>
<tr><td>Decimal128</td><td><code>decimal</code></td><td><code>Decimal128('19.90')</code></td><td>money, any exact decimal</td></tr>
<tr><td>String (UTF-8)</td><td><code>string</code></td><td><code>'5'</code></td><td>text, codes</td></tr>
<tr><td>Date</td><td><code>date</code></td><td><code>new Date(…)</code></td><td>moments in time (milliseconds since 1970, UTC)</td></tr>
<tr><td>ObjectId · Boolean · Null · Array · Object · Binary</td><td><code>objectId</code>, <code>bool</code>, <code>null</code>, <code>array</code>, <code>object</code>, <code>binData</code></td><td></td><td>ids, flags, lists, nested data, bytes (hashes, small files)</td></tr>
</tbody></table>

<h3>Who decides the type? The client</h3>
<p>Insert one document with the "same" number written eight ways, then ask the server what type each field has:</p>
${lenh('s01-2-bson', 1)}
${lenh('s01-2-bson', 2)}
<p>Look at <code>c: 5.0</code>: you wrote a decimal point, yet it is stored as <code>int</code>. JavaScript has only one number type, so mongosh and the Node.js driver look at the value: a whole number that fits in 32 bits becomes <code>int</code>, anything else becomes <code>double</code>. To force a type you must say so: <code>Double(5)</code>, <code>Long('5')</code>, <code>Decimal128('5')</code>. Java and Spring decide from the Java type (<code>int</code>, <code>long</code>, <code>double</code>, <code>BigDecimal</code>) — Lesson 8.4 checks what Spring Data really writes for <code>BigDecimal</code>.</p>
<p>Numeric types compare <em>by value</em> across types, but a string is never equal to a number:</p>
${lenh('s01-2-bson', 3)}
${lenh('s01-2-bson', 4)}
${lenh('s01-2-bson', 5)}
<p>The first query matches: 5 as int, long, double and decimal are all "5". The last two return nothing: <code>'5'</code> is a string, and a query with a number only looks at numbers. MongoDB calls this <strong>type bracketing</strong> — <code>$gt: 3</code> does not compare strings at all. This is the bug where a form sends <code>"price": "150000"</code> as text and the product vanishes from every price filter.</p>

<h3>The money trap — run it</h3>
${lenh('s01-2-bson', 0)}
<p>Not a JavaScript bug: every language that uses IEEE 754 binary floating point gives this answer, because 0.1 has no exact binary representation — just as 1/3 has no exact decimal one. Now the same sums inside MongoDB, double versus Decimal128:</p>
${lenh('s01-2-bson', 6)}
${lenh('s01-2-bson', 7)}
${lenh('s01-2-bson', 8)}
<p>Decimal128 stores the number in base 10 (34 significant digits), so 0.1 + 0.2 is exactly 0.3 and an equality filter on the total works. The double total is off by 0.00000000000000004 — harmless once, but errors accumulate. Add 0.1 one million times:</p>
${lenh('s01-2-bson', 9)}
<p>The result is off by 0.0000013. For a shop summing millions of small amounts — commissions, VAT, exchange rates, loyalty points — that is how a reconciliation report ends up a few đồng wrong and an accountant spends a day looking for them. CT Shop stores every price and total as Decimal128, and its revenue sum stays exact and stays decimal:</p>
${lenh('s01-2-bson', 10)}

<div class="callout danger">
<p><strong>⚠️ Real incident — the Vancouver Stock Exchange index (1982–1983).</strong> The exchange launched a new index in January 1982 at 1000. It was recomputed after every trade — about 3,000 times a day — and each time the result was <em>truncated</em> to three decimal places. Each truncation lost less than 0.001, but they never cancelled out: the index drifted down about 25 points a month. In November 1983 it stood at 524.811 while the market had not fallen; after the calculation was fixed over the weekend of 25–28 November it reopened at 1098.892. Nobody hacked anything. A tiny rounding rule, repeated millions of times, halved a published number. The same arithmetic is what happens to a double money field summed every night.</p>
<p>A second, tragic example from the same family: on 25 February 1991 a Patriot missile battery at Dhahran failed to intercept an incoming missile; 28 soldiers died. The system had been running for 100 hours and its internal clock — advanced by a value of 0.1 s that cannot be stored exactly in binary — had drifted by about one third of a second. Rounding errors are not academic.</p>
</div>
${nguon('📰', 'Vancouver Stock Exchange — Wikipedia', 'Index history: truncation, 524.811 → 1098.892 in November 1983 (cites WSJ, 8 Nov 1983)', 'https://en.wikipedia.org/wiki/Vancouver_Stock_Exchange')}
${nguon('📰', 'MIM-104 Patriot — Wikipedia', 'Dhahran, 25 February 1991: clock drift after 100 hours of operation', 'https://en.wikipedia.org/wiki/MIM-104_Patriot')}

<h3>Mixed types in one field — the quiet bug</h3>
<p>A back-office form saves prices as plain JavaScript numbers. Three products later:</p>
${lenh('s01-2-bson', 11)}
${lenh('s01-2-bson', 12)}
${lenh('s01-2-bson', 13)}
<p>One field, two types. 150000 became <code>int</code>; 149999.5 became <code>double</code>; and 3,000,000,000 is too big for 32 bits, so it also became <code>double</code>. A report that filters <code>{ price: { $type: 'int' } }</code>, a Java class that maps <code>price</code> to <code>Integer</code>, or an index-based sort with a validator expecting one type will each break in a different way. <strong>Decide one type per field and enforce it</strong> with <code>bsonType</code> in a validator (Lesson 1.3).</p>

<h4>64-bit integers and JavaScript</h4>
${lenh('s01-2-bson', 14)}
<p>A JavaScript number is a double, exact only up to 2^53 (9,007,199,254,740,992). Above that, <code>9007199254740993</code> silently becomes <code>…992</code>. <code>Long</code> keeps all 64 bits. This matters when you store ids from other systems (Snowflake ids from Twitter/Discord-style systems, bank transaction numbers): store them as <code>Long</code> or as strings, and never pass them through a plain JS number. Sending a <code>Long</code> straight through <code>JSON.stringify</code> is also wrong — see the last demo of this lesson.</p>

<h3>Dates: one instant, always UTC</h3>
<p>A BSON <code>Date</code> is a 64-bit count of milliseconds since 1 January 1970 UTC. It has <strong>no time zone</strong>. The shell displays it in UTC:</p>
${lenh('s01-2-bson', 15)}
<p>8:00 in Hanoi (+07:00) is stored as 01:00 UTC. Same instant, different wall clock. Now the order <code>_id: 1</code>, shown in UTC and in Vietnam time:</p>
${lenh('s01-2-bson', 16)}
<p>The order was placed at 03:54 on 14 October in Vietnam, but its UTC date is still 13 October. Ask "how many orders on 14 October?" with boundaries in UTC and in Vietnam time:</p>
${lenh('s01-2-bson', 17)}
${lenh('s01-2-bson', 18)}
<p>6 versus 9. Both queries are "correct"; they answer different questions. The bug in real projects is writing the first one when the business means the second — the daily sales report of a Vietnamese shop must use <code>+07:00</code> boundaries (or <code>timezone: 'Asia/Ho_Chi_Minh'</code> in aggregation, Chapter 5). Rule: <strong>store UTC, convert at the edges</strong> (in the query boundaries and in the UI), and always name the time zone.</p>

<h4>Dates stored as strings</h4>
<p>An API receives <code>"2026-11-24"</code> from a form and stores it as is. Another code path stores a real Date:</p>
${lenh('s01-2-bson', 19)}
${lenh('s01-2-bson', 20)}
${lenh('s01-2-bson', 21)}
<p>The date range query skips the string document completely — type bracketing again. Sorting puts the string <em>before</em> the date, because BSON sorts by type first: <strong>Null &lt; Numbers &lt; String &lt; Object &lt; Array &lt; BinData &lt; ObjectId &lt; Boolean &lt; Date &lt; Timestamp &lt; Regex</strong>. You do not need to memorise the list; you need to remember that mixed types in one field make sorting and range queries lie to you.</p>
${nguon('📘', 'Comparison/Sort Order — MongoDB Docs', 'The full order in which BSON types compare and sort', 'https://www.mongodb.com/docs/manual/reference/bson-type-comparison-order/')}

<h3>JSON loses types, Extended JSON keeps them</h3>
<p>Your REST API speaks JSON, which only knows strings, numbers, booleans, null, arrays and objects. Converting BSON to JSON drops type information:</p>
${lenh('s01-2-bson', 23)}
${lenh('s01-2-bson', 22)}
<p>Plain <code>JSON.stringify</code> turns a Date into a string (so a client that sends it back produces the string-date bug above) and turns a <code>Long</code> into its internal object <code>{"high":0,"low":5,…}</code> — a bug you will see in real API responses. <strong>Extended JSON</strong> (EJSON) wraps each typed value in a <code>$</code>-key (<code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>) so it survives a round trip; <code>mongoexport</code> and <code>mongoimport</code> use it (Chapter 10). For public APIs, convert explicitly: Date → ISO string, Decimal128 → string, Long → string, and parse back on input.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "I'll store money as an integer number of đồng, that's exact".</strong> It is exact — as long as every writer uses whole đồng and nobody divides. VAT at 8%, a 15% discount, a price in USD with cents, or a JavaScript writer producing <code>149999.5</code> breaks it (you just saw the int/double split). Storing minor units as integers is a valid design used by payment systems, but it is a discipline the whole team must keep; <code>Decimal128</code> is the default you cannot get wrong by accident.</p>
</div>

<h3>💼 At work: the report is off by 3 đồng</h3>
<p>Accounting compares your monthly revenue aggregation with the payment gateway's report: yours is 3 đồng higher. Your checklist: (1) <code>db.orders.aggregate([{ $group: { _id: { $type: '$total' }, n: { $sum: 1 } } }])</code> — are all totals <code>decimal</code>? A handful of <code>double</code> written by an old script is the usual culprit; (2) check the day boundaries — are you summing UTC days while the gateway uses Vietnam days? (3) check status filters (Lesson 0.1's <code>stauts</code> documents). Fix the data with a one-time migration (<code>$toDecimal</code>, Chapter 2), then add a validator so it cannot come back.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you store money in MongoDB?"</strong> — Decimal128 (exact base-10), or integer minor units with a strict team rule; never double. Validate the type with <code>bsonType: 'decimal'</code>.</li>
<li><strong>"Why does 0.1 + 0.2 not equal 0.3?"</strong> — Binary floating point cannot represent 0.1 exactly; the error is tiny but accumulates (Vancouver index, 1982–1983).</li>
<li><strong>"How are dates stored? How do you build a daily report for Vietnam?"</strong> — As UTC milliseconds without a zone. Query with +07:00 boundaries or group with <code>timezone: 'Asia/Ho_Chi_Minh'</code>.</li>
<li><strong>"A query on price returns fewer products than expected. Ideas?"</strong> — Mixed types: some prices stored as strings. Check with <code>$type</code>, migrate, add a validator.</li>
<li><strong>"What is Extended JSON for?"</strong> — Representing BSON types in JSON (<code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>) so export/import does not lose them.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>In <code>ch1.prices</code>, insert <code>{ _id: 1, p: 19.9 }</code> and <code>{ _id: 2, p: Decimal128('19.9') }</code>. Multiply each by 3 with <code>$multiply</code> in an aggregation and compare the results.</li>
<li>Count CT Shop orders created in October 2026 <em>in Vietnam time</em>.</li>
<li>Find every document in <code>ch1.gia</code> whose <code>price</code> is not <code>decimal</code>, then write one <code>updateMany</code> that converts them (hint: an update with a pipeline <code>[{ $set: { price: { $toDecimal: '$price' } } }]</code>).</li>
<li>Your Node.js API returns <code>{"views":{"low":5,"high":0,"unsigned":false}}</code>. What happened and how do you fix it?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.prices.aggregate([{ $project: { x: { $multiply: ['$p', 3] } } }])</code> — the double gives <code>59.699999999999996</code>, the decimal <code>Decimal128('59.7')</code>. 2. <code>db.orders.countDocuments({ createdAt: { $gte: new Date('2026-10-01T00:00:00+07:00'), $lt: new Date('2026-11-01T00:00:00+07:00') } })</code>. 3. <code>db.gia.find({ price: { $not: { $type: 'decimal' } } })</code>, then <code>db.gia.updateMany({ price: { $not: { $type: 'decimal' } } }, [{ $set: { price: { $toDecimal: '$price' } } }])</code>. 4. The field is a BSON Long and the code handed a <code>Long</code> object to <code>JSON.stringify</code>, which serialised its internals. The Node.js driver returns <code>Long</code> objects when <code>promoteLongs</code> is turned off or the value does not fit in 2^53 (mongosh always shows <code>Long</code>). Convert before responding: <code>.toString()</code> for ids, <code>.toNumber()</code> only if the value is guaranteed below 2^53.</p>
</details>
<p><strong>Done when:</strong> you can explain the 6 vs 9 result and why CT Shop uses Decimal128 for <code>total</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Double', '64-bit binary floating point. Fast, approximate. Never for money.'],
  ['Decimal128', '128-bit base-10 number, 34 significant digits. Exact decimals — use for money.'],
  ['Int32 / Int64 (Long)', 'Whole numbers. JS numbers are exact only up to 2^53, so 64-bit values need <code>Long</code>.'],
  ['Date', 'Milliseconds since 1970 in UTC; no time zone stored.'],
  ['Type bracketing', 'Comparison operators only match values of the same type family: <code>$gt: 3</code> never matches a string.'],
  ['Extended JSON (EJSON)', 'JSON with <code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>… wrappers that keep BSON types.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Every BSON value has a type chosen by the writer; JS writers produce int for whole numbers and double otherwise.</li>
<li>Money: Decimal128. Double drifts (0.1 + 0.2, a million additions, the Vancouver index).</li>
<li>Dates are UTC instants; a Vietnamese daily report needs +07:00 boundaries (6 vs 9 orders on 14/10).</li>
<li>Mixed types in one field break filters and sorts silently; enforce one type with a validator.</li>
<li>JSON drops types (Date → string, Long → object); EJSON keeps them; APIs should convert explicitly.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Kiểu BSON: Date, Decimal128, int với double và bẫy tiền</h2>
<p class="lead">MongoDB không có cột, nhưng chắc chắn có kiểu — mỗi giá trị đều mang một kiểu. Chỗ hiểm: kiểu do <em>người ghi giá trị</em> quyết định, nên cùng một trường có thể là int ở tài liệu này, double ở tài liệu kia và chuỗi ở tài liệu thứ ba. Bài này cho bạn thấy các kiểu dùng hằng ngày, các lỗi sinh ra khi trộn kiểu, và hai luật chặn được phần lớn các lỗi đó: <strong>tiền là Decimal128</strong> và <strong>thời gian là Date theo UTC</strong>.</p>

<h3>Hình ảnh đời thường: két tiền và máy tính bỏ túi</h3>
<p>Cửa hàng đếm tiền bằng <strong>két</strong>: tiền xu, tiền giấy, chính xác tới từng đồng. Máy tính bỏ túi ở chế độ khoa học thì làm việc với số gần đúng: nhìn đủ nhiều chữ số, nó có thể hiện 0,1 + 0,2 = 0,30000000000000004. Cả hai đều có ích — chẳng ai bắt két tiền tính quỹ đạo tên lửa — nhưng bạn không bao giờ để máy tính bỏ túi giữ sổ sách cửa hàng. Trong BSON, <code>double</code> là máy tính bỏ túi, còn <code>decimal</code> (Decimal128) là két tiền.</p>

<h3>Những kiểu bạn thật sự sẽ dùng</h3>
<table>
<thead><tr><th>Kiểu BSON</th><th>Tên trong <code>$type</code></th><th>mongosh / Node.js</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td>Double (số thực 64 bit)</td><td><code>double</code></td><td><code>5.5</code>, <code>Double(5)</code></td><td>số đo, điểm đánh giá, toạ độ — không bao giờ cho tiền</td></tr>
<tr><td>Số nguyên 32 bit</td><td><code>int</code></td><td><code>5</code>, <code>Int32(5)</code></td><td>số đếm, số lượng</td></tr>
<tr><td>Số nguyên 64 bit</td><td><code>long</code></td><td><code>Long('5')</code></td><td>bộ đếm lớn, id từ hệ thống khác</td></tr>
<tr><td>Decimal128</td><td><code>decimal</code></td><td><code>Decimal128('19.90')</code></td><td>tiền, mọi số thập phân cần chính xác</td></tr>
<tr><td>Chuỗi (UTF-8)</td><td><code>string</code></td><td><code>'5'</code></td><td>văn bản, mã</td></tr>
<tr><td>Date</td><td><code>date</code></td><td><code>new Date(…)</code></td><td>thời điểm (mili giây kể từ 1970, UTC)</td></tr>
<tr><td>ObjectId · Boolean · Null · Mảng · Object · Nhị phân</td><td><code>objectId</code>, <code>bool</code>, <code>null</code>, <code>array</code>, <code>object</code>, <code>binData</code></td><td></td><td>id, cờ đúng/sai, danh sách, dữ liệu lồng, chuỗi byte (băm, tệp nhỏ)</td></tr>
</tbody></table>

<h3>Ai quyết định kiểu? Phía client</h3>
<p>Chèn một tài liệu với "cùng" một con số viết theo tám cách, rồi hỏi máy chủ mỗi trường có kiểu gì:</p>
${lenh('s01-2-bson', 1)}
${lenh('s01-2-bson', 2)}
<p>Nhìn <code>c: 5.0</code>: bạn viết dấu chấm thập phân, vậy mà nó được lưu thành <code>int</code>. JavaScript chỉ có một kiểu số, nên mongosh và driver Node.js nhìn vào giá trị: số nguyên vừa 32 bit thành <code>int</code>, còn lại thành <code>double</code>. Muốn ép kiểu thì phải nói rõ: <code>Double(5)</code>, <code>Long('5')</code>, <code>Decimal128('5')</code>. Java và Spring quyết định theo kiểu Java (<code>int</code>, <code>long</code>, <code>double</code>, <code>BigDecimal</code>) — Bài 8.4 kiểm xem Spring Data thật ra ghi gì cho <code>BigDecimal</code>.</p>
<p>Các kiểu số so sánh <em>theo giá trị</em> với nhau, nhưng chuỗi không bao giờ bằng số:</p>
${lenh('s01-2-bson', 3)}
${lenh('s01-2-bson', 4)}
${lenh('s01-2-bson', 5)}
<p>Truy vấn đầu khớp: 5 dạng int, long, double và decimal đều là "5". Hai truy vấn sau rỗng: <code>'5'</code> là chuỗi, mà truy vấn bằng số chỉ nhìn các giá trị số. MongoDB gọi đây là <strong>type bracketing</strong> (so sánh theo nhóm kiểu) — <code>$gt: 3</code> hoàn toàn không so với chuỗi. Đây chính là lỗi khi một biểu mẫu gửi <code>"price": "150000"</code> dạng chữ và sản phẩm biến khỏi mọi bộ lọc theo giá.</p>

<h3>Bẫy tiền — chạy thử</h3>
${lenh('s01-2-bson', 0)}
<p>Đây không phải lỗi của JavaScript: mọi ngôn ngữ dùng số thực nhị phân IEEE 754 đều ra kết quả này, vì 0,1 không biểu diễn chính xác được trong hệ nhị phân — giống như 1/3 không viết chính xác được trong hệ thập phân. Giờ làm cùng phép cộng ngay trong MongoDB, double so với Decimal128:</p>
${lenh('s01-2-bson', 6)}
${lenh('s01-2-bson', 7)}
${lenh('s01-2-bson', 8)}
<p>Decimal128 lưu số theo cơ số 10 (34 chữ số có nghĩa), nên 0,1 + 0,2 đúng bằng 0,3 và bộ lọc so bằng trên tổng hoạt động đúng. Tổng kiểu double lệch 0,00000000000000004 — một lần thì vô hại, nhưng sai số cộng dồn. Cộng 0,1 một triệu lần:</p>
${lenh('s01-2-bson', 9)}
<p>Kết quả lệch 0,0000013. Với một cửa hàng cộng hàng triệu khoản nhỏ — hoa hồng, thuế VAT, tỉ giá, điểm thưởng — đó là cách báo cáo đối soát lệch vài đồng và kế toán mất cả ngày đi tìm. CT Shop lưu mọi giá và tổng tiền bằng Decimal128, nên tổng doanh thu vẫn chính xác và vẫn là số thập phân:</p>
${lenh('s01-2-bson', 10)}

<div class="callout danger">
<p><strong>⚠️ Sự cố thật — chỉ số Sở giao dịch chứng khoán Vancouver (1982–1983).</strong> Sở ra mắt một chỉ số mới vào tháng 1/1982 ở mức 1000. Chỉ số được tính lại sau mỗi giao dịch — khoảng 3.000 lần mỗi ngày — và mỗi lần kết quả bị <em>cắt bớt</em> còn ba chữ số thập phân. Mỗi lần cắt mất chưa tới 0,001, nhưng chúng không bao giờ bù trừ nhau: chỉ số trôi xuống khoảng 25 điểm mỗi tháng. Tháng 11/1983 nó còn 524,811 trong khi thị trường không hề giảm; sau khi cách tính được sửa vào cuối tuần 25–28/11, chỉ số mở cửa lại ở 1098,892. Chẳng ai tấn công gì cả. Một luật làm tròn nhỏ xíu, lặp lại hàng triệu lần, đã làm một con số công bố mất một nửa. Đó cũng chính là phép tính xảy ra với một trường tiền kiểu double được cộng mỗi đêm.</p>
<p>Một ví dụ bi thảm cùng họ: ngày 25/02/1991, một khẩu đội tên lửa Patriot ở Dhahran không đánh chặn được một tên lửa đang lao tới; 28 binh sĩ thiệt mạng. Hệ thống đã chạy liên tục 100 giờ và đồng hồ bên trong — được cộng mỗi nhịp một giá trị 0,1 giây không lưu chính xác được trong hệ nhị phân — đã trôi khoảng một phần ba giây. Sai số làm tròn không phải chuyện sách vở.</p>
</div>
${nguon('📰', 'Vancouver Stock Exchange — Wikipedia', 'Lịch sử chỉ số: cắt bớt chữ số, 524,811 → 1098,892 tháng 11/1983 (dẫn WSJ 08/11/1983)', 'https://en.wikipedia.org/wiki/Vancouver_Stock_Exchange')}
${nguon('📰', 'MIM-104 Patriot — Wikipedia', 'Dhahran 25/02/1991: đồng hồ trôi sau 100 giờ hoạt động', 'https://en.wikipedia.org/wiki/MIM-104_Patriot')}

<h3>Trộn kiểu trong một trường — lỗi âm thầm</h3>
<p>Một biểu mẫu quản trị lưu giá dạng số JavaScript thường. Ba sản phẩm sau:</p>
${lenh('s01-2-bson', 11)}
${lenh('s01-2-bson', 12)}
${lenh('s01-2-bson', 13)}
<p>Một trường, hai kiểu. 150000 thành <code>int</code>; 149999,5 thành <code>double</code>; còn 3.000.000.000 vượt 32 bit nên cũng thành <code>double</code>. Một báo cáo lọc <code>{ price: { $type: 'int' } }</code>, một lớp Java ánh xạ <code>price</code> sang <code>Integer</code>, hay một validator chờ đúng một kiểu — mỗi chỗ hỏng theo một kiểu khác nhau. <strong>Chốt một kiểu cho mỗi trường và ép nó</strong> bằng <code>bsonType</code> trong validator (Bài 1.3).</p>

<h4>Số nguyên 64 bit và JavaScript</h4>
${lenh('s01-2-bson', 14)}
<p>Số JavaScript là double, chỉ chính xác tới 2^53 (9.007.199.254.740.992). Vượt qua đó, <code>9007199254740993</code> lặng lẽ thành <code>…992</code>. <code>Long</code> giữ đủ 64 bit. Điều này quan trọng khi bạn lưu id từ hệ thống khác (id kiểu Snowflake như của Twitter hay Discord, mã giao dịch ngân hàng): hãy lưu thành <code>Long</code> hoặc chuỗi, và đừng bao giờ cho chúng đi qua một số JS thường. Đưa thẳng một <code>Long</code> qua <code>JSON.stringify</code> cũng sai — xem demo cuối bài.</p>

<h3>Ngày giờ: một thời điểm, luôn là UTC</h3>
<p>Một <code>Date</code> BSON là số mili giây 64 bit kể từ 00:00 ngày 1/1/1970 theo UTC. Nó <strong>không lưu múi giờ</strong>. Vỏ lệnh hiển thị theo UTC:</p>
${lenh('s01-2-bson', 15)}
<p>8 giờ sáng ở Hà Nội (+07:00) được lưu thành 01:00 UTC. Cùng một thời điểm, khác mặt đồng hồ. Giờ xem đơn <code>_id: 1</code>, hiện theo UTC và theo giờ Việt Nam:</p>
${lenh('s01-2-bson', 16)}
<p>Đơn được đặt lúc 03:54 sáng 14/10 theo giờ Việt Nam, nhưng ngày UTC của nó vẫn là 13/10. Hỏi "ngày 14/10 có bao nhiêu đơn?" với ranh giới theo UTC và theo giờ Việt Nam:</p>
${lenh('s01-2-bson', 17)}
${lenh('s01-2-bson', 18)}
<p>6 so với 9. Cả hai truy vấn đều "đúng"; chúng trả lời hai câu hỏi khác nhau. Lỗi ở dự án thật là viết câu thứ nhất trong khi nghiệp vụ muốn câu thứ hai — báo cáo doanh số theo ngày của một cửa hàng Việt Nam phải dùng ranh giới <code>+07:00</code> (hoặc <code>timezone: 'Asia/Ho_Chi_Minh'</code> trong aggregation, Chương 5). Luật: <strong>lưu UTC, đổi ở hai đầu</strong> (ở ranh giới truy vấn và ở giao diện), và luôn ghi rõ múi giờ.</p>

<h4>Ngày lưu thành chuỗi</h4>
<p>Một API nhận <code>"2026-11-24"</code> từ biểu mẫu và lưu nguyên như vậy. Một nhánh mã khác lưu Date thật:</p>
${lenh('s01-2-bson', 19)}
${lenh('s01-2-bson', 20)}
${lenh('s01-2-bson', 21)}
<p>Truy vấn theo khoảng ngày bỏ qua hẳn tài liệu chuỗi — lại là so sánh theo nhóm kiểu. Sắp xếp đặt chuỗi <em>trước</em> ngày, vì BSON sắp theo kiểu trước: <strong>Null &lt; Số &lt; Chuỗi &lt; Object &lt; Mảng &lt; Nhị phân &lt; ObjectId &lt; Boolean &lt; Date &lt; Timestamp &lt; Regex</strong>. Bạn không cần thuộc danh sách; bạn cần nhớ rằng trộn kiểu trong một trường làm sắp xếp và truy vấn theo khoảng nói dối bạn.</p>
${nguon('📘', 'Comparison/Sort Order — MongoDB Docs', 'Thứ tự đầy đủ các kiểu BSON khi so sánh và sắp xếp', 'https://www.mongodb.com/docs/manual/reference/bson-type-comparison-order/')}

<h3>JSON làm rơi kiểu, Extended JSON giữ kiểu</h3>
<p>API REST của bạn nói JSON, mà JSON chỉ biết chuỗi, số, true/false, null, mảng và object. Chuyển BSON sang JSON là mất thông tin kiểu:</p>
${lenh('s01-2-bson', 23)}
${lenh('s01-2-bson', 22)}
<p><code>JSON.stringify</code> thường biến Date thành chuỗi (nên client gửi ngược lại sẽ tạo đúng lỗi ngày-dạng-chuỗi ở trên) và biến <code>Long</code> thành object nội bộ <code>{"high":0,"low":5,…}</code> — lỗi bạn sẽ gặp trong phản hồi API thật. <strong>Extended JSON</strong> (EJSON) bọc mỗi giá trị có kiểu trong một khoá <code>$</code> (<code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>) để nó sống sót qua một vòng đi về; <code>mongoexport</code> và <code>mongoimport</code> dùng định dạng này (Chương 10). Với API công khai, hãy đổi tường minh: Date → chuỗi ISO, Decimal128 → chuỗi, Long → chuỗi, và phân tích ngược lại khi nhận vào.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "mình lưu tiền thành số nguyên đồng là chính xác rồi".</strong> Chính xác — miễn là mọi nơi ghi đều dùng đồng chẵn và không ai chia. VAT 8%, giảm giá 15%, giá USD có xu, hay một chỗ ghi bằng JavaScript tạo ra <code>149999.5</code> là vỡ (bạn vừa thấy trường bị tách làm int/double). Lưu đơn vị nhỏ nhất bằng số nguyên là thiết kế đúng mà hệ thống thanh toán vẫn dùng, nhưng đó là kỷ luật cả đội phải giữ; <code>Decimal128</code> là mặc định không thể vô tình làm sai.</p>
</div>

<h3>💼 Đi làm: báo cáo lệch 3 đồng</h3>
<p>Kế toán so aggregation doanh thu tháng của bạn với báo cáo của cổng thanh toán: của bạn cao hơn 3 đồng. Danh sách kiểm: (1) <code>db.orders.aggregate([{ $group: { _id: { $type: '$total' }, n: { $sum: 1 } } }])</code> — mọi tổng tiền đã là <code>decimal</code> chưa? Vài tài liệu <code>double</code> do một script cũ ghi là thủ phạm quen thuộc; (2) kiểm ranh giới ngày — bạn đang cộng theo ngày UTC trong khi cổng thanh toán dùng ngày Việt Nam? (3) kiểm bộ lọc trạng thái (các tài liệu <code>stauts</code> của Bài 0.1). Sửa dữ liệu bằng một lượt chuyển đổi (<code>$toDecimal</code>, Chương 2), rồi thêm validator để nó không quay lại.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"Bạn lưu tiền trong MongoDB thế nào?"</strong> — Decimal128 (cơ số 10, chính xác), hoặc số nguyên đơn vị nhỏ nhất với luật đội chặt chẽ; không bao giờ double. Kiểm kiểu bằng <code>bsonType: 'decimal'</code>.</li>
<li><strong>"Vì sao 0,1 + 0,2 không bằng 0,3?"</strong> — Số thực nhị phân không biểu diễn chính xác 0,1; sai số nhỏ nhưng cộng dồn (chỉ số Vancouver 1982–1983).</li>
<li><strong>"Ngày giờ lưu thế nào? Làm báo cáo theo ngày cho Việt Nam ra sao?"</strong> — Lưu mili giây UTC, không có múi giờ. Truy vấn với ranh giới +07:00 hoặc gom nhóm với <code>timezone: 'Asia/Ho_Chi_Minh'</code>.</li>
<li><strong>"Truy vấn theo giá trả về ít sản phẩm hơn mong đợi. Bạn nghĩ tới gì?"</strong> — Trộn kiểu: vài giá lưu thành chuỗi. Kiểm bằng <code>$type</code>, chuyển đổi dữ liệu, thêm validator.</li>
<li><strong>"Extended JSON để làm gì?"</strong> — Biểu diễn kiểu BSON trong JSON (<code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>) để xuất/nhập không mất kiểu.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>ch1.prices</code>, chèn <code>{ _id: 1, p: 19.9 }</code> và <code>{ _id: 2, p: Decimal128('19.9') }</code>. Nhân mỗi giá trị với 3 bằng <code>$multiply</code> trong một aggregation rồi so kết quả.</li>
<li>Đếm số đơn CT Shop tạo trong tháng 10/2026 <em>theo giờ Việt Nam</em>.</li>
<li>Tìm mọi tài liệu trong <code>ch1.gia</code> có <code>price</code> không phải <code>decimal</code>, rồi viết một lệnh <code>updateMany</code> chuyển chúng (gợi ý: cập nhật bằng pipeline <code>[{ $set: { price: { $toDecimal: '$price' } } }]</code>).</li>
<li>API Node.js của bạn trả về <code>{"views":{"low":5,"high":0,"unsigned":false}}</code>. Chuyện gì đã xảy ra và sửa thế nào?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>db.prices.aggregate([{ $project: { x: { $multiply: ['$p', 3] } } }])</code> — double cho <code>59.699999999999996</code>, decimal cho <code>Decimal128('59.7')</code>. 2. <code>db.orders.countDocuments({ createdAt: { $gte: new Date('2026-10-01T00:00:00+07:00'), $lt: new Date('2026-11-01T00:00:00+07:00') } })</code>. 3. <code>db.gia.find({ price: { $not: { $type: 'decimal' } } })</code>, rồi <code>db.gia.updateMany({ price: { $not: { $type: 'decimal' } } }, [{ $set: { price: { $toDecimal: '$price' } } }])</code>. 4. Trường là BSON Long và mã đã đưa một object <code>Long</code> cho <code>JSON.stringify</code>, nên nó in ra phần ruột. Driver Node.js trả object <code>Long</code> khi tắt <code>promoteLongs</code> hoặc khi giá trị vượt 2^53 (mongosh thì luôn hiện <code>Long</code>). Đổi trước khi trả về: <code>.toString()</code> cho id, <code>.toNumber()</code> chỉ khi chắc chắn giá trị dưới 2^53.</p>
</details>
<p><strong>Xong khi:</strong> bạn giải thích được kết quả 6 so với 9 và vì sao CT Shop dùng Decimal128 cho <code>total</code>.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Double', 'Số thực nhị phân 64 bit. Nhanh, gần đúng. Không bao giờ dùng cho tiền.'],
  ['Decimal128', 'Số cơ số 10 dài 128 bit, 34 chữ số có nghĩa. Thập phân chính xác — dùng cho tiền.'],
  ['Int32 / Int64 (Long)', 'Số nguyên. Số JS chỉ chính xác tới 2^53, nên giá trị 64 bit cần <code>Long</code>.'],
  ['Date', 'Số mili giây kể từ 1970 theo UTC; không lưu múi giờ.'],
  ['Type bracketing', 'Toán tử so sánh chỉ khớp giá trị cùng nhóm kiểu: <code>$gt: 3</code> không bao giờ khớp chuỗi.'],
  ['Extended JSON (EJSON)', 'JSON có lớp bọc <code>$date</code>, <code>$numberDecimal</code>, <code>$numberLong</code>… để giữ kiểu BSON.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi giá trị BSON có kiểu do người ghi chọn; nơi ghi bằng JS tạo int cho số nguyên và double cho số còn lại.</li>
<li>Tiền: Decimal128. Double trôi dần (0,1 + 0,2, một triệu lần cộng, chỉ số Vancouver).</li>
<li>Date là thời điểm UTC; báo cáo theo ngày cho Việt Nam cần ranh giới +07:00 (6 so với 9 đơn ngày 14/10).</li>
<li>Trộn kiểu trong một trường làm hỏng lọc và sắp xếp một cách âm thầm; ép một kiểu bằng validator.</li>
<li>JSON làm rơi kiểu (Date → chuỗi, Long → object); EJSON giữ kiểu; API nên đổi tường minh.</li>
</ul>
</div>
`,
};
