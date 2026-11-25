/**
 * 2.2 — Tìm: toán tử so sánh, logic và projection (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s02-2-q'] (MongoDB 8.0.38 trong mgo-lab; kịch bản demo/s02/s02-2-q.txt; CT Shop nạp lại ở s02-1).
 * Bước ẩn trong kịch bản (@an): chèn đơn 9101 KHÔNG có status; đặt KH0002.phone = null — rồi dọn lại cuối kịch bản.
 * Số đối chiếu: PAID 903 (như Mục 0), $in PAID/SHIPPED 1425, khoá trùng trong object 1525 vs đúng 74.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.2 — Finding: comparison and logical operators, projection|||2.2 — Tìm: toán tử so sánh, logic và projection',
  slug: 'mgo-2-2-truy-van',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mọi toán tử tìm kiếm hay dùng khi đi làm, chạy thật trên 2.000 đơn CT Shop: $eq $gt $gte $in, khoảng ngày theo UTC, so sánh số với chuỗi (0 kết quả im lặng), bẫy hai khoá trùng tên trong object JavaScript (1525 thay vì 74), $or $nor, $ne và $nin khớp cả tài liệu thiếu trường, null khớp cả trường vắng mặt, $exists/$type, projection gồm/loại, $regex và dấu tiếng Việt, $expr so sánh trong cùng tài liệu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Finding: comparison and logical operators, projection</h2>
<p class="lead">A MongoDB query is a document that describes the documents you want. That sounds simple, and for <code>{ status: 'PAID' }</code> it is. But a query document is also a JavaScript object, compared with BSON type rules, with special meanings for <code>null</code> and missing fields — and each of those details has produced a real "the report is wrong" ticket somewhere. You will run every operator on the 2,000 CT Shop orders and see the numbers yourself.</p>

<h3>An everyday picture: asking the librarian</h3>
<p>"Books by Martin Kleppmann, published after 2015, not in the reference section." A good librarian hears three conditions joined by AND, a comparison (after 2015) and a negation (not reference). A MongoDB filter is exactly that sentence written as a document. The traps come from the librarian being very literal: ask for "books whose section is not reference" and you also get the books that have <em>no section label at all</em>.</p>

<h3>Equality, projection and counting</h3>
${lenh('s02-2-q', 0)}
<p>The second argument is the <strong>projection</strong>: <code>{ items: 0 }</code> means "everything except items". On a list page you almost never need the embedded line items — leaving them out shrinks what travels over the network. Counting:</p>
${lenh('s02-2-q', 1)}
${lenh('s02-2-q', 2)}
<p>903 is the same paid-order count you saw in Section 0. <code>$in</code> is "equal to any of" — 1,425 orders are PAID or SHIPPED. Prefer <code>$in</code> over an <code>$or</code> of equalities on the same field: shorter, and the planner handles it as one index range (Chapter 4).</p>

<h3>Comparisons follow BSON types — numbers yes, strings no</h3>
${lenh('s02-2-q', 3)}
${lenh('s02-2-q', 4)}
${lenh('s02-2-q', 5)}
<p>Orders of at least 20 million VND: 549. A plain number <code>20000000</code> gives the same 549 — numeric types (int, long, double, Decimal128) compare with each other by value. But the string <code>'20000000'</code> gives <strong>0, with no error</strong>: comparison operators only match values of the same BSON type <em>bracket</em>, and a string is never "greater than or equal to" a number in a query. This is exactly what happens when a query parameter from a URL (<code>?min=20000000</code> — always a string) goes into the filter without conversion. Convert and validate inputs at the API boundary.</p>
${lenh('s02-2-q', 6)}
<p>A date range: <code>$gte</code> the first instant, <code>$lt</code> the first instant <em>after</em> — the half-open interval never double-counts midnight and never misses 23:59:59.999. Remember from Lesson 1.2 that these instants are UTC; "October in Vietnam" starts at <code>2026-09-30T17:00:00Z</code>.</p>

<h3>The trap that looks like a range</h3>
${lenh('s02-2-q', 7)}
<p>The intention: orders between 20 and 25 million. The object literal has the key <code>total</code> <strong>twice</strong>, and in JavaScript (and in JSON parsers, and in Python dicts) the second one silently replaces the first. The filter MongoDB received was only <code>total &lt; 25,000,000</code> — 1,525 orders instead of the right answer:</p>
${lenh('s02-2-q', 8)}
<p>Put both operators in <strong>one</strong> sub-document. The same accident happens when code builds a filter step by step: <code>filter.total = { $gte: min }</code>, then later <code>filter.total = { $lt: max }</code>. Linters (ESLint <code>no-dupe-keys</code>) catch the literal version; only tests catch the step-by-step version.</p>

<h3>Logical operators</h3>
<p>Fields listed side by side are an implicit AND. You need explicit operators for OR and for "none of":</p>
${lenh('s02-2-q', 9)}
${lenh('s02-2-q', 10)}
<p><code>$nor</code> = "matches none of these": 575 orders are neither PAID nor SHIPPED (2,000 − 1,425). You need explicit <code>$and</code> in only one situation: two conditions on the <em>same operator key</em>, e.g. two <code>$or</code> groups — <code>{ $and: [{ $or: [...] }, { $or: [...] }] }</code> — because, as you just saw, an object cannot hold the key <code>$or</code> twice.</p>

<h3>$ne and $nin also match documents that do not have the field</h3>
<p>Now a buggy code path inserts order 9101 <em>without</em> a <code>status</code> field (a hidden step in the demo). Watch the "not" operators:</p>
${lenh('s02-2-q', 11)}
${lenh('s02-2-q', 12)}
${lenh('s02-2-q', 13)}
<p>"Not PAID" is 1,098 = 2,001 − 903: the status-less order counts as "not PAID". And "status not in PAID/SHIPPED/PENDING" — which you meant as "cancelled orders" — includes 9101. A refund job that runs on <code>$nin: ['PAID', 'SHIPPED', 'PENDING']</code> would happily process a broken order. Say what you mean positively (<code>{ status: 'CANCELLED' }</code>), or add <code>$exists: true</code>.</p>

<h3>null, missing, $exists and $type</h3>
${lenh('s02-2-q', 14)}
${lenh('s02-2-q', 15)}
<p>52 of 200 customers have a phone; <code>{ phone: null }</code> matches the other 148 — <strong><code>null</code> in a query matches both "the field is null" and "the field is missing"</strong>. Now set one customer's phone to an explicit <code>null</code> (another hidden step) and ask three different questions:</p>
${lenh('s02-2-q', 16)}
${lenh('s02-2-q', 17)}
${lenh('s02-2-q', 18)}
<p>149 null-or-missing, 148 missing, 1 explicitly null. Choose the question you mean. Many teams pick one convention — "absent means unknown, never store null" — and enforce it with the validator from Lesson 1.3. <code>$type</code> is also your tool for auditing types after an import:</p>
${lenh('s02-2-q', 19)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">{ f: null }</span><span class="lz-t">null OR missing</span><span class="lz-d">The broad one — usually not what a report wants.</span></div>
  <div class="lz-step"><span class="lz-k">{ f: { $exists: false } }</span><span class="lz-t">missing only</span><span class="lz-d">"Never filled in". <code>$exists: true</code> = present, including null.</span></div>
  <div class="lz-step"><span class="lz-k">{ f: { $type: 'null' } }</span><span class="lz-t">explicitly null only</span><span class="lz-d">"Filled in as null" — often a sign of a different code path.</span></div>
</div>

<h3>Projection: include or exclude, not both</h3>
${lenh('s02-2-q', 20)}
${lenh('s02-2-q', 21)}
<p>A projection is either an <em>inclusion</em> list (<code>1</code>s) or an <em>exclusion</em> list (<code>0</code>s). The only field you may exclude from an inclusion projection is <code>_id</code>, which is included unless you say <code>_id: 0</code>. Since MongoDB 4.4 a projection can also compute fields with aggregation expressions:</p>
${lenh('s02-2-q', 22)}
<p>Nested fields use dot notation (<code>'shipTo.city'</code>) and come back nested. Projection is not just tidiness: for an API that lists orders, sending 200 bytes instead of 2 KB per row is the cheapest performance win you will ever make.</p>

<h3>Regular expressions and Vietnamese</h3>
${lenh('s02-2-q', 23)}
${lenh('s02-2-q', 24)}
<p>The <code>i</code> flag ignores case, but <strong>not diacritics</strong>: <code>/nguyen/i</code> finds nobody named "Nguyễn". Users type without accents all the time. Real search needs either a field you fill with the accent-stripped, lower-cased name (<code>nameSearch: 'nguyen gia linh'</code>, kept in sync on every write) or a search engine (MongoDB Atlas Search, Elasticsearch). Also note: a regex is only efficient when anchored at the start (<code>/^…/</code>) and case-sensitive, so it can use an index range; <code>/…/i</code> scans (Chapter 4 measures this). And never put raw user input into a <code>RegExp</code> — escape it, or a user can send <code>.*</code> or a catastrophically slow pattern (Chapter 9).</p>

<h3>Comparing two fields of the same document: $expr</h3>
${lenh('s02-2-q', 25)}
<p>Ordinary query operators compare a field to a constant. To compare a field with another field, or with a computed value (here, the array length ≥ 4), wrap an aggregation expression in <code>$expr</code>. The price: <code>$expr</code> generally cannot use an index the way <code>{ f: value }</code> can, so keep it for small or already-filtered sets. For "has at least 4 items", Lesson 2.3 shows a cheaper form.</p>

<h3>Cursors: find returns a cursor, not an array</h3>
${lenh('s02-2-q', 26)}
<p><code>find()</code> returns a <strong>cursor</strong>: the server sends the first batch (101 documents, or up to 16 MiB) and the rest on demand as you iterate. In mongosh you type <code>it</code> for the next page; in code you iterate (<code>for await (const d of cursor)</code>) or call <code>toArray()</code>. <code>toArray()</code> on an unbounded query loads everything into memory — an API with <code>find({}).toArray()</code> works with 2,000 test orders and falls over with 2 million. Always pair list endpoints with a <code>limit</code> (and pagination, Lesson 2.6).</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting the shape of the filter that came from the client.</strong> If your API does <code>db.orders.find(req.body.filter)</code> or even <code>find({ customerId: req.query.c })</code> with Express's query parser, a client can send <code>{ "$ne": null }</code> instead of a string, and "orders of customer X" becomes "all orders". That is NoSQL injection — the subject of Lesson 9.3. For now: build the filter yourself from validated, typed values; never pass client objects through.</p>
</div>

${nguon('📘', 'Query and Projection Operators — MongoDB Docs', 'Full list of comparison, logical, element and evaluation operators', 'https://www.mongodb.com/docs/manual/reference/operator/query/')}
${nguon('📘', 'Query for Null or Missing Fields', 'null vs $exists vs $type: "null" with examples', 'https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/')}
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — MongoDB CRUD', sub: 'Course-level introduction to find and its traps' })}

<h3>💼 At work: "the dashboard and the finance report disagree"</h3>
<p>A real-shaped ticket from a shop like CT Shop: the dashboard shows 1,098 "unpaid" orders, finance counts 1,097. The dashboard uses <code>{ status: { $ne: 'PAID' } }</code>; finance counts PENDING + SHIPPED + CANCELLED explicitly. The one-order difference is a document without <code>status</code>. Your fix has three parts: find the bad documents with <code>{ status: { $exists: false } }</code> and repair them; change the dashboard to positive conditions; add a validator that requires <code>status</code> (Lesson 1.3). Writing that up clearly in the ticket — cause, data fix, code fix, prevention — is what gets an intern trusted with bigger work.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you write a range query?"</strong> — Both operators in one sub-document: <code>{ total: { $gte: a, $lt: b } }</code>; half-open intervals for dates.</li>
<li><strong>"What does <code>{ phone: null }</code> match?"</strong> — Documents where phone is null <em>or</em> missing. Use <code>$exists</code> or <code>$type: 'null'</code> to separate them.</li>
<li><strong>"Difference between $nin and $not?"</strong> — <code>$nin</code> is "not equal to any of these values" (matches missing fields); <code>$not</code> negates another operator expression, e.g. <code>{ price: { $not: { $gt: 100 } } }</code> (also matches missing). Both are poor at using indexes.</li>
<li><strong>"How do you compare two fields?"</strong> — <code>$expr</code> with an aggregation expression; mind that it usually cannot use an index.</li>
<li><strong>"What does find return?"</strong> — A cursor that fetches in batches; <code>toArray</code> loads all into memory.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Count CT Shop orders created in September 2026 <em>Vietnam time</em> that are CANCELLED.</li>
<li>List the <code>_id</code>, <code>name</code> and <code>price</code> of products that are books or courses priced under 300,000 VND, without <code>_id</code>… no — keep <code>_id</code> and drop everything else. Write it with <code>$in</code>, then with <code>$or</code>, and check both give the same count.</li>
<li>Customers in Hà Nội or Đà Nẵng who have a phone number: how many?</li>
<li>Write a filter that is <em>wrong</em> because of a duplicated key, and a unit test (in plain mongosh: a count comparison) that would catch it.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.orders.countDocuments({ status: 'CANCELLED', createdAt: { $gte: ISODate('2026-08-31T17:00:00Z'), $lt: ISODate('2026-09-30T17:00:00Z') } })</code> — the month starts at 00:00 on 01/09 in UTC+7, which is 17:00 on 31/08 UTC.</p>
<p>2. <code>db.products.find({ category: { $in: ['book', 'course'] }, price: { $lt: Decimal128('300000') } }, { name: 1, price: 1 })</code> and <code>db.products.countDocuments({ $or: [{ category: 'book' }, { category: 'course' }], price: { $lt: Decimal128('300000') } })</code> — same count.</p>
<p>3. <code>db.customers.countDocuments({ city: { $in: ['Hà Nội', 'Đà Nẵng'] }, phone: { $exists: true } })</code> (add <code>$type: 'string'</code> if explicit nulls may exist).</p>
<p>4. For example compare <code>countDocuments(buildFilter(a, b))</code> with the sum of counts of three disjoint ranges that must add up to the total; or simply assert <code>Object.keys(filter.total).length === 2</code> in your unit test of the filter builder.</p>
</details>
<p><strong>Done when:</strong> you can explain why 1,098 ≠ 1,097 in the ticket above without looking.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Filter (query document)', 'A document describing matching documents; fields side by side are ANDed.'],
  ['$in / $nin', 'Equal to any / none of the listed values; <code>$nin</code> also matches documents missing the field.'],
  ['$or / $nor / $and', 'Logical OR, "none of", explicit AND (needed only when an operator key would repeat).'],
  ['$exists / $type', 'Presence of a field / its BSON type; separate "missing" from "null".'],
  ['Projection', 'Second argument of <code>find</code>: include list or exclude list (plus <code>_id: 0</code>), or computed fields.'],
  ['$expr', 'Use an aggregation expression inside a query — compare fields, compute values.'],
  ['Cursor', 'Server-side result iterated in batches; <code>toArray()</code> materialises it in memory.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Numbers of any numeric type compare by value; strings never match numeric comparisons — 0 results, no error.</li>
<li>One field, two conditions ⇒ one sub-document. Duplicate keys in an object silently drop a condition.</li>
<li><code>$ne</code>/<code>$nin</code> and <code>{ f: null }</code> include documents without the field; prefer positive conditions.</li>
<li>Project only what you need; <code>$regex</code> does not ignore Vietnamese diacritics.</li>
<li><code>find</code> is a cursor: always limit list endpoints; build filters from validated values only.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Tìm: toán tử so sánh, logic và projection</h2>
<p class="lead">Một truy vấn MongoDB là một tài liệu mô tả những tài liệu bạn muốn lấy. Nghe đơn giản, và với <code>{ status: 'PAID' }</code> thì đúng là đơn giản. Nhưng tài liệu truy vấn cũng là một object JavaScript, được so sánh theo luật kiểu BSON, với ý nghĩa đặc biệt cho <code>null</code> và trường vắng mặt — và mỗi chi tiết đó đều đã sinh ra một ticket "báo cáo bị sai" thật ở đâu đó. Bạn sẽ chạy từng toán tử trên 2.000 đơn CT Shop và tự nhìn thấy các con số.</p>

<h3>Hình ảnh đời thường: hỏi cô thủ thư</h3>
<p>"Sách của Martin Kleppmann, xuất bản sau 2015, không thuộc khu tra cứu." Một cô thủ thư giỏi nghe ra ba điều kiện nối bằng VÀ, một phép so sánh (sau 2015) và một phép phủ định (không phải tra cứu). Bộ lọc MongoDB chính là câu đó viết dưới dạng tài liệu. Bẫy đến từ chỗ cô thủ thư hiểu theo nghĩa đen tuyệt đối: hỏi "sách có khu khác tra cứu" thì bạn nhận luôn cả những cuốn <em>không dán nhãn khu nào</em>.</p>

<h3>So bằng, projection và đếm</h3>
${lenh('s02-2-q', 0)}
<p>Đối số thứ hai là <strong>projection</strong> (phép chiếu): <code>{ items: 0 }</code> nghĩa là "mọi thứ trừ items". Ở trang danh sách bạn gần như không bao giờ cần các dòng món hàng nhúng bên trong — bỏ chúng đi làm giảm lượng dữ liệu chạy qua mạng. Đếm:</p>
${lenh('s02-2-q', 1)}
${lenh('s02-2-q', 2)}
<p>903 đúng là số đơn đã trả tiền bạn thấy ở Mục 0. <code>$in</code> là "bằng một trong các giá trị" — 1.425 đơn đang PAID hoặc SHIPPED. Hãy ưu tiên <code>$in</code> hơn một <code>$or</code> gồm các phép so bằng trên cùng một trường: ngắn hơn, và bộ lập kế hoạch xử lý nó như một khoảng chỉ mục (Chương 4).</p>

<h3>So sánh theo kiểu BSON — số thì được, chuỗi thì không</h3>
${lenh('s02-2-q', 3)}
${lenh('s02-2-q', 4)}
${lenh('s02-2-q', 5)}
<p>Đơn từ 20 triệu đồng trở lên: 549. Số thường <code>20000000</code> cho cùng 549 — các kiểu số (int, long, double, Decimal128) so với nhau theo giá trị. Nhưng chuỗi <code>'20000000'</code> cho <strong>0, không báo lỗi</strong>: toán tử so sánh chỉ khớp giá trị cùng <em>nhóm</em> kiểu BSON, và trong truy vấn một chuỗi không bao giờ "lớn hơn hoặc bằng" một số. Đây đúng là chuyện xảy ra khi tham số từ URL (<code>?min=20000000</code> — luôn là chuỗi) đi thẳng vào bộ lọc mà không chuyển kiểu. Hãy chuyển kiểu và kiểm đầu vào ngay ở biên API.</p>
${lenh('s02-2-q', 6)}
<p>Một khoảng ngày: <code>$gte</code> thời điểm đầu tiên, <code>$lt</code> thời điểm đầu tiên <em>sau</em> khoảng — khoảng nửa mở không bao giờ đếm trùng nửa đêm và không bao giờ sót 23:59:59.999. Nhớ lại Bài 1.2: các thời điểm này là UTC; "tháng 10 ở Việt Nam" bắt đầu lúc <code>2026-09-30T17:00:00Z</code>.</p>

<h3>Cái bẫy trông như một khoảng</h3>
${lenh('s02-2-q', 7)}
<p>Ý định: các đơn từ 20 tới 25 triệu. Object literal có khoá <code>total</code> <strong>hai lần</strong>, và trong JavaScript (cả bộ đọc JSON, cả dict Python) khoá thứ hai lặng lẽ thay khoá thứ nhất. Bộ lọc MongoDB nhận được chỉ còn <code>total &lt; 25.000.000</code> — 1.525 đơn thay vì đáp án đúng:</p>
${lenh('s02-2-q', 8)}
<p>Hãy đặt cả hai toán tử trong <strong>một</strong> tài liệu con. Tai nạn tương tự xảy ra khi mã dựng bộ lọc từng bước: <code>filter.total = { $gte: min }</code>, rồi sau đó <code>filter.total = { $lt: max }</code>. Linter (ESLint <code>no-dupe-keys</code>) bắt được dạng literal; chỉ có test mới bắt được dạng từng bước.</p>

<h3>Toán tử logic</h3>
<p>Các trường đặt cạnh nhau là VÀ ngầm định. Bạn cần toán tử tường minh cho HOẶC và cho "không cái nào":</p>
${lenh('s02-2-q', 9)}
${lenh('s02-2-q', 10)}
<p><code>$nor</code> = "không khớp cái nào trong số này": 575 đơn không PAID cũng không SHIPPED (2.000 − 1.425). Bạn chỉ cần <code>$and</code> tường minh trong một tình huống: hai điều kiện dùng <em>cùng một khoá toán tử</em>, ví dụ hai nhóm <code>$or</code> — <code>{ $and: [{ $or: [...] }, { $or: [...] }] }</code> — vì như bạn vừa thấy, một object không thể chứa khoá <code>$or</code> hai lần.</p>

<h3>$ne và $nin khớp cả tài liệu không có trường đó</h3>
<p>Giờ một nhánh mã lỗi chèn đơn 9101 <em>không có</em> trường <code>status</code> (một bước ẩn trong demo). Hãy xem các toán tử "không":</p>
${lenh('s02-2-q', 11)}
${lenh('s02-2-q', 12)}
${lenh('s02-2-q', 13)}
<p>"Không PAID" là 1.098 = 2.001 − 903: đơn không có status bị tính là "không PAID". Còn "status không thuộc PAID/SHIPPED/PENDING" — mà bạn định hiểu là "đơn đã huỷ" — lại chứa cả 9101. Một job hoàn tiền chạy theo <code>$nin: ['PAID', 'SHIPPED', 'PENDING']</code> sẽ vui vẻ xử lý một đơn hỏng. Hãy nói điều bạn muốn bằng điều kiện khẳng định (<code>{ status: 'CANCELLED' }</code>), hoặc thêm <code>$exists: true</code>.</p>

<h3>null, vắng mặt, $exists và $type</h3>
${lenh('s02-2-q', 14)}
${lenh('s02-2-q', 15)}
<p>52 trên 200 khách có số điện thoại; <code>{ phone: null }</code> khớp 148 người còn lại — <strong><code>null</code> trong truy vấn khớp cả "trường bằng null" lẫn "trường vắng mặt"</strong>. Giờ đặt số điện thoại của một khách thành <code>null</code> tường minh (thêm một bước ẩn) rồi hỏi ba câu khác nhau:</p>
${lenh('s02-2-q', 16)}
${lenh('s02-2-q', 17)}
${lenh('s02-2-q', 18)}
<p>149 null-hoặc-vắng, 148 vắng, 1 null tường minh. Hãy chọn đúng câu hỏi bạn muốn hỏi. Nhiều nhóm chọn một quy ước — "vắng mặt nghĩa là chưa biết, không bao giờ lưu null" — và ép nó bằng validator ở Bài 1.3. <code>$type</code> cũng là công cụ để soát kiểu sau một đợt nhập dữ liệu:</p>
${lenh('s02-2-q', 19)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">{ f: null }</span><span class="lz-t">null HOẶC vắng</span><span class="lz-d">Câu rộng — thường không phải thứ báo cáo cần.</span></div>
  <div class="lz-step"><span class="lz-k">{ f: { $exists: false } }</span><span class="lz-t">chỉ vắng</span><span class="lz-d">"Chưa từng điền". <code>$exists: true</code> = có mặt, kể cả null.</span></div>
  <div class="lz-step"><span class="lz-k">{ f: { $type: 'null' } }</span><span class="lz-t">chỉ null tường minh</span><span class="lz-d">"Đã điền là null" — thường là dấu hiệu của một nhánh mã khác.</span></div>
</div>

<h3>Projection: gồm hoặc loại, không trộn</h3>
${lenh('s02-2-q', 20)}
${lenh('s02-2-q', 21)}
<p>Projection hoặc là danh sách <em>gồm</em> (các số <code>1</code>), hoặc là danh sách <em>loại</em> (các số <code>0</code>). Trường duy nhất được loại khỏi projection kiểu gồm là <code>_id</code>, vốn luôn được trả về trừ khi bạn ghi <code>_id: 0</code>. Từ MongoDB 4.4, projection còn tính được trường mới bằng biểu thức aggregation:</p>
${lenh('s02-2-q', 22)}
<p>Trường lồng dùng dấu chấm (<code>'shipTo.city'</code>) và được trả về đúng dạng lồng. Projection không chỉ cho gọn: với một API liệt kê đơn hàng, gửi 200 byte thay vì 2 KB mỗi dòng là chiến thắng hiệu năng rẻ nhất bạn từng có.</p>

<h3>Biểu thức chính quy và tiếng Việt</h3>
${lenh('s02-2-q', 23)}
${lenh('s02-2-q', 24)}
<p>Cờ <code>i</code> bỏ qua hoa thường, nhưng <strong>không bỏ qua dấu</strong>: <code>/nguyen/i</code> không tìm thấy ai tên "Nguyễn". Người dùng gõ không dấu suốt. Tìm kiếm thật cần hoặc một trường bạn điền tên đã bỏ dấu, viết thường (<code>nameSearch: 'nguyen gia linh'</code>, cập nhật đồng bộ ở mọi lần ghi), hoặc một bộ máy tìm kiếm (MongoDB Atlas Search, Elasticsearch). Để ý thêm: regex chỉ hiệu quả khi neo ở đầu (<code>/^…/</code>) và phân biệt hoa thường, khi đó nó dùng được một khoảng chỉ mục; <code>/…/i</code> thì quét (Chương 4 đo điều này). Và đừng bao giờ đưa nguyên đầu vào của người dùng vào <code>RegExp</code> — hãy thoát ký tự, kẻo người dùng gửi <code>.*</code> hoặc một mẫu chậm thảm hoạ (Chương 9).</p>

<h3>So hai trường trong cùng tài liệu: $expr</h3>
${lenh('s02-2-q', 25)}
<p>Toán tử truy vấn thường so một trường với một hằng. Để so một trường với trường khác, hoặc với một giá trị tính ra (ở đây là độ dài mảng ≥ 4), hãy bọc biểu thức aggregation trong <code>$expr</code>. Cái giá: <code>$expr</code> nói chung không dùng chỉ mục được như <code>{ f: giá_trị }</code>, nên chỉ dùng cho tập nhỏ hoặc tập đã lọc trước. Với "có ít nhất 4 món", Bài 2.3 chỉ ra một cách rẻ hơn.</p>

<h3>Cursor: find trả về cursor, không phải mảng</h3>
${lenh('s02-2-q', 26)}
<p><code>find()</code> trả về một <strong>cursor</strong> (con trỏ kết quả): máy chủ gửi lô đầu (101 tài liệu, hoặc tới 16 MiB) và phần còn lại khi bạn duyệt tới. Trong mongosh bạn gõ <code>it</code> để xem trang tiếp; trong mã bạn duyệt (<code>for await (const d of cursor)</code>) hoặc gọi <code>toArray()</code>. <code>toArray()</code> trên một truy vấn không giới hạn sẽ nạp tất cả vào bộ nhớ — một API có <code>find({}).toArray()</code> chạy ổn với 2.000 đơn thử và gục ngã với 2 triệu. Luôn đi kèm <code>limit</code> cho các endpoint liệt kê (và phân trang, Bài 2.6).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin vào hình dạng của bộ lọc đến từ client.</strong> Nếu API của bạn làm <code>db.orders.find(req.body.filter)</code>, hay thậm chí <code>find({ customerId: req.query.c })</code> với bộ đọc query của Express, client có thể gửi <code>{ "$ne": null }</code> thay cho một chuỗi, và "đơn của khách X" thành "mọi đơn". Đó là NoSQL injection — chủ đề của Bài 9.3. Giờ thì nhớ: tự dựng bộ lọc từ các giá trị đã kiểm, đã đúng kiểu; đừng bao giờ chuyển thẳng object của client vào.</p>
</div>

${nguon('📘', 'Query and Projection Operators — MongoDB Docs', 'Danh sách đầy đủ toán tử so sánh, logic, phần tử, đánh giá', 'https://www.mongodb.com/docs/manual/reference/operator/query/')}
${nguon('📘', 'Query for Null or Missing Fields', 'null với $exists với $type: "null", có ví dụ', 'https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/')}
${lienKet({ cta: 'Mở bài', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — CRUD MongoDB', sub: 'Nhập môn find và các bẫy ở mức môn học' })}

<h3>💼 Đi làm: "dashboard và báo cáo tài chính lệch nhau"</h3>
<p>Một ticket mang đúng hình dạng đời thật ở một cửa hàng như CT Shop: dashboard hiện 1.098 đơn "chưa trả tiền", phòng tài chính đếm 1.097. Dashboard dùng <code>{ status: { $ne: 'PAID' } }</code>; tài chính đếm tường minh PENDING + SHIPPED + CANCELLED. Lệch một đơn chính là tài liệu không có <code>status</code>. Cách sửa của bạn gồm ba phần: tìm tài liệu hỏng bằng <code>{ status: { $exists: false } }</code> và sửa chúng; đổi dashboard sang điều kiện khẳng định; thêm validator bắt buộc có <code>status</code> (Bài 1.3). Viết rõ ràng điều đó trong ticket — nguyên nhân, sửa dữ liệu, sửa mã, phòng ngừa — là thứ giúp một thực tập sinh được giao việc lớn hơn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Viết truy vấn khoảng thế nào?"</strong> — Cả hai toán tử trong một tài liệu con: <code>{ total: { $gte: a, $lt: b } }</code>; khoảng nửa mở cho ngày giờ.</li>
<li><strong>"<code>{ phone: null }</code> khớp những gì?"</strong> — Tài liệu có phone bằng null <em>hoặc</em> không có phone. Dùng <code>$exists</code> hoặc <code>$type: 'null'</code> để tách.</li>
<li><strong>"$nin khác $not thế nào?"</strong> — <code>$nin</code> là "không bằng giá trị nào trong danh sách" (khớp cả trường vắng); <code>$not</code> phủ định một biểu thức toán tử khác, ví dụ <code>{ price: { $not: { $gt: 100 } } }</code> (cũng khớp trường vắng). Cả hai đều dùng chỉ mục kém.</li>
<li><strong>"So hai trường với nhau thế nào?"</strong> — <code>$expr</code> với biểu thức aggregation; lưu ý thường không dùng được chỉ mục.</li>
<li><strong>"find trả về gì?"</strong> — Một cursor lấy dữ liệu theo lô; <code>toArray</code> nạp tất cả vào bộ nhớ.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm các đơn CT Shop tạo trong tháng 9/2026 <em>theo giờ Việt Nam</em> mà đang CANCELLED.</li>
<li>Liệt kê <code>_id</code>, <code>name</code> và <code>price</code> của sản phẩm là sách hoặc khoá học có giá dưới 300.000 đồng, giữ <code>_id</code> và bỏ mọi trường khác. Viết bằng <code>$in</code>, rồi bằng <code>$or</code>, và kiểm hai cách cho cùng số lượng.</li>
<li>Khách ở Hà Nội hoặc Đà Nẵng có số điện thoại: bao nhiêu người?</li>
<li>Viết một bộ lọc <em>sai</em> vì trùng khoá, và một bài test (chỉ cần mongosh: so sánh số đếm) có thể bắt được lỗi đó.</li>
</ol>
<details><summary>Gợi ý lời giải</summary>
<p>1. <code>db.orders.countDocuments({ status: 'CANCELLED', createdAt: { $gte: ISODate('2026-08-31T17:00:00Z'), $lt: ISODate('2026-09-30T17:00:00Z') } })</code> — tháng bắt đầu lúc 00:00 ngày 01/09 theo UTC+7, tức 17:00 ngày 31/08 theo UTC.</p>
<p>2. <code>db.products.find({ category: { $in: ['book', 'course'] }, price: { $lt: Decimal128('300000') } }, { name: 1, price: 1 })</code> và <code>db.products.countDocuments({ $or: [{ category: 'book' }, { category: 'course' }], price: { $lt: Decimal128('300000') } })</code> — cùng số lượng.</p>
<p>3. <code>db.customers.countDocuments({ city: { $in: ['Hà Nội', 'Đà Nẵng'] }, phone: { $exists: true } })</code> (thêm <code>$type: 'string'</code> nếu có thể có null tường minh).</p>
<p>4. Ví dụ so <code>countDocuments(dungBoLoc(a, b))</code> với tổng số đếm của ba khoảng rời nhau phải cộng lại bằng toàn bộ; hoặc đơn giản khẳng định <code>Object.keys(filter.total).length === 2</code> trong unit test của hàm dựng bộ lọc.</p>
</details>
<p><strong>Xong khi:</strong> bạn giải thích được vì sao 1.098 ≠ 1.097 trong ticket ở trên mà không cần nhìn lại.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Bộ lọc (filter)', 'Tài liệu mô tả các tài liệu cần khớp; các trường đặt cạnh nhau được nối bằng VÀ.'],
  ['$in / $nin', 'Bằng một / không bằng giá trị nào trong danh sách; <code>$nin</code> khớp cả tài liệu thiếu trường.'],
  ['$or / $nor / $and', 'HOẶC, "không cái nào", VÀ tường minh (chỉ cần khi một khoá toán tử bị lặp).'],
  ['$exists / $type', 'Trường có mặt hay không / kiểu BSON của nó; tách "vắng mặt" khỏi "null".'],
  ['Projection', 'Đối số thứ hai của <code>find</code>: danh sách gồm hoặc danh sách loại (cộng <code>_id: 0</code>), hoặc trường tính toán.'],
  ['$expr', 'Dùng biểu thức aggregation trong truy vấn — so sánh các trường, tính giá trị.'],
  ['Cursor', 'Kết quả phía máy chủ được duyệt theo lô; <code>toArray()</code> nạp hết vào bộ nhớ.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi kiểu số so với nhau theo giá trị; chuỗi không bao giờ khớp phép so sánh số — 0 kết quả, không lỗi.</li>
<li>Một trường, hai điều kiện ⇒ một tài liệu con. Khoá trùng trong object lặng lẽ đánh rơi một điều kiện.</li>
<li><code>$ne</code>/<code>$nin</code> và <code>{ f: null }</code> gồm cả tài liệu thiếu trường; ưu tiên điều kiện khẳng định.</li>
<li>Chỉ chiếu những gì cần; <code>$regex</code> không bỏ qua dấu tiếng Việt.</li>
<li><code>find</code> là cursor: luôn giới hạn endpoint liệt kê; chỉ dựng bộ lọc từ giá trị đã kiểm.</li>
</ul>
</div>
`,
};
