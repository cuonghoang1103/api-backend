/**
 * 0.1 — MongoDB hay PostgreSQL? Khi nào chọn MongoDB, và khi nào KHÔNG (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s00-uu'] (điểm mạnh trên CT Shop) và OUT['s00-nhuoc'] (MongoDB 8.0 nhận đơn mồ côi + trường gõ sai;
 * PostgreSQL 16 trong container mgo-pg --network none từ chối cả hai).
 * KHÔNG trùng: postgresql-17-3 (cùng bộ đơn hàng làm hai phía, đo cái giá của bản chép), postgresql-17-4 (cây quyết định chung
 * cho bốn hệ), sb-20-1 (góc Spring). Bài này đứng ở góc MongoDB: chỗ nó tự nhiên, chỗ nó im lặng nhận dữ liệu sai — rồi liên kết.
 */
import { lenh, lienKet, kv } from '../_chung.mjs';

export default {
  title: '0.1 — MongoDB or PostgreSQL? When to choose MongoDB, and when not to|||0.1 — MongoDB hay PostgreSQL? Khi nào chọn MongoDB, và khi nào KHÔNG',
  slug: 'mgo-0-1-mongo-hay-postgres',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Câu hỏi của mọi buổi họp khởi động dự án. Chạy thật ba chỗ MongoDB tự nhiên (dữ liệu nhiều hình dạng, truy vấn trong mảng, cập nhật nguyên tử cả khối) và hai chỗ nó im lặng nhận dữ liệu sai (đơn hàng của khách không tồn tại, trường gõ sai tên) trong khi PostgreSQL từ chối; bảng quyết định; khi nào KHÔNG chọn MongoDB; trả lời câu "dùng Mongo cho nhanh, khỏi thiết kế".',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>MongoDB or PostgreSQL? When to choose MongoDB, and when not to</h2>
<p class="lead">At the start of almost every student project and many real ones, someone says: "Let's use MongoDB, it's faster and we don't have to design the database." Both halves of that sentence are wrong, and by the end of this lesson you will be able to explain why — with output you ran yourself. You will also see the cases where MongoDB really is the better tool.</p>

<h3>An everyday picture: a wardrobe versus a filing cabinet</h3>
<p>A <strong>wardrobe with boxes</strong>: each box holds one complete outfit — shirt, trousers, belt — ready to grab. Boxes can be different sizes; a winter box has a scarf, a summer box does not. Grabbing one outfit is instant. But if you decide every blue shirt should be replaced, you must open every box.</p>
<p>A <strong>filing cabinet</strong>: one drawer of shirts, one of trousers, one of belts, and a card for each outfit saying "shirt #12 + trousers #4". Assembling an outfit takes a few steps; replacing all blue shirts is one drawer. And the cabinet refuses a card pointing to "shirt #99" if no such shirt exists.</p>
<p>MongoDB is the wardrobe. PostgreSQL is the filing cabinet. Neither is "faster" in general: each is fast at what its shape makes cheap.</p>

<h3>Where MongoDB is natural — run it</h3>
<p><strong>1. Data with many shapes in one collection.</strong> The CT Shop catalogue has five kinds of product, and each kind has different attributes:</p>
${lenh('s00-uu', 0)}
${lenh('s00-uu', 1)}
${lenh('s00-uu', 2)}
<p>A book has <code>author</code>, <code>pages</code>, <code>tags</code>; an accessory has <code>warrantyMonths</code> and <code>wireless</code>. In SQL you would choose between a wide table full of NULLs, one table per kind, or an "attribute–value" table that is painful to query. (PostgreSQL's answer is a JSONB column — a valid choice, compared in PostgreSQL 17.3.)</p>
<p><strong>2. Querying inside arrays.</strong> Each shirt stores its sizes as an array of variants. "Which shirts have size M with at least 20 in stock?" — and return only the matching variant:</p>
${lenh('s00-uu', 3)}
<p><strong>3. Updating a whole aggregate atomically.</strong> Changing an order's status <em>and</em> appending to its history is one write to one document — atomic without any transaction, and the condition <code>status: 'PAID'</code> guarantees we do not ship an order that was cancelled a millisecond earlier:</p>
${lenh('s00-uu', 4)}
<p>That is the real strength of the document model: <strong>the unit you read and write together is stored together</strong> (domain-driven design calls it an <em>aggregate</em>). Add built-in replication and sharding (Chapter 7) and you have the honest case for MongoDB.</p>

<h3>Where MongoDB silently accepts wrong data — run it on both sides</h3>
<p>Now two classic bugs. An order for a customer that does not exist (<code>KH9999</code>), and an order where a developer typed <code>stauts</code> instead of <code>status</code>:</p>
${lenh('s00-nhuoc', 0)}
${lenh('s00-nhuoc', 1)}
<p>Both accepted. Now the business counts paid orders, and lists what we just inserted:</p>
${lenh('s00-nhuoc', 2)}
${lenh('s00-nhuoc', 3)}
<p>The count went from 903 to 904, not 905: order 9002 is invisible to every query that uses <code>status</code>, and its <code>total</code> is a plain number while all others are <code>Decimal128</code>. Nobody got an error. Weeks later the revenue report is off and nobody knows why. The same two inserts in PostgreSQL 16:</p>
${lenh('s00-nhuoc', 4)}
<p>PostgreSQL refuses both, at write time, with a precise message. That is what <strong>foreign keys</strong> and a <strong>fixed schema</strong> buy you. In MongoDB you can get part of it back with <code>$jsonSchema</code> validation (Lesson 1.3 catches the <code>stauts</code> typo) — but there are <strong>no foreign keys</strong>, ever: referential integrity is your application's job.</p>

<h3>So — when to choose MongoDB</h3>
<ul>
<li>The data is naturally <strong>aggregates read as a whole</strong>: an order with its lines, a blog post with its comments (if bounded), a user profile with preferences, a device with its latest readings.</li>
<li><strong>Shapes vary</strong> per record and change often: product catalogues, CMS content, form builders, event payloads from many sources.</li>
<li><strong>Write volume or data size will outgrow one machine</strong>, and you want sharding built in rather than assembled.</li>
<li>The team already runs MongoDB well (backups, monitoring) — operational experience is a real factor.</li>
</ul>
<h3>…and when NOT to</h3>
<ul>
<li><strong>Money and ledgers</strong>: balances, payments, stock movements that must reconcile — you want constraints, foreign keys and SQL's mature transaction tooling. MongoDB can do transactions, but nothing stops a bug from writing an orphan.</li>
<li><strong>Highly connected data</strong> queried in many directions: students–classes–teachers–rooms–schedules, permissions. Every "join" in MongoDB is a <code>$lookup</code> or a second query.</li>
<li><strong>Ad-hoc reporting and BI</strong> by people who know SQL, across many entities.</li>
<li><strong>"So we don't have to design the database"</strong>: the worst reason. MongoDB needs <em>more</em> design up front, because the schema follows your queries (Chapter 3). Skipping design gives you the <code>stauts</code> bug at scale.</li>
<li>A small app where PostgreSQL + one JSONB column already covers the "flexible" part — one database to run is cheaper than two.</li>
</ul>

<h3>Three questions before naming any product</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · What is read together?</span><span class="lz-t">list the screens and the data each one shows</span><span class="lz-d">Data shown together on most screens is a candidate document. Pieces combined differently on every screen point to tables.</span></div>
  <div class="lz-step"><span class="lz-k">2 · What is shared?</span><span class="lz-t">data referenced by many records</span><span class="lz-d">A customer name copied into orders is fine if a stale copy is acceptable; a balance shared by many transactions is not.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Who enforces the rules?</span><span class="lz-t">the database, or your code?</span><span class="lz-d">If a wrong reference costs money or breaks the law, you want the database to refuse it — that is PostgreSQL territory.</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "a $jsonSchema validator is the same as a foreign key".</strong> A validator checks the <em>shape</em> of one document (field names, types, required fields). It cannot look into another collection, so <code>customerId: 'KH9999'</code> passes any validator. Integrity across collections stays your job.</p>
</div>
<h3>Decision table</h3>
<table>
<thead><tr><th>Question</th><th>Leans MongoDB</th><th>Leans PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Is the main unit read as one whole?</td><td>Yes — order + lines, post + comments</td><td>No — pieces are combined differently on each screen</td></tr>
<tr><td>Do records of one kind have very different fields?</td><td>Yes, and they change often</td><td>Mostly the same columns</td></tr>
<tr><td>Is the same data shared by many records?</td><td>Rarely, or a copy is acceptable</td><td>Often, and must stay consistent everywhere</td></tr>
<tr><td>Must the database itself reject invalid references?</td><td>App can enforce it</td><td>Yes — money, inventory, legal records</td></tr>
<tr><td>Who writes reports?</td><td>Developers, known queries</td><td>Analysts, ad-hoc SQL</td></tr>
<tr><td>Will one server be too small?</td><td>Likely — sharding built in</td><td>Not for years — one good server goes far</td></tr>
</tbody></table>
<p>Most real systems use <strong>both</strong>: cuongthai.com itself runs on PostgreSQL because courses, users and payments are connected relational data; a feature like a high-volume event or activity log is the kind of part where a document store would fit. The PostgreSQL course has a full decision tree for four database families — read it next.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-17-4-chon-he-nao', title: 'PostgreSQL 17.4 — Which system?', sub: 'Six questions, a decision tree, two real case studies' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — MongoDB documents vs JSONB', sub: 'Same orders, both databases, the cost of copies measured' })}

<h3>💼 At work: "just use Mongo, no need to design"</h3>
<p>Your team lead on an internship says it in the kickoff. Do not argue about brands. Ask three questions instead: "Which screens read which data together? Which data is shared and must stay consistent? Who will write reports?" Then propose: "MongoDB for the catalogue (varied shapes), PostgreSQL for orders and payments — or, if we want one database, PostgreSQL with JSONB for the catalogue attributes." Whatever is chosen, insist on a validator (Lesson 1.3) and a written list of queries (Chapter 3). That is what a senior would say.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Is MongoDB faster than PostgreSQL?"</strong> — The question is wrong. Reading one aggregate stored together is one lookup in MongoDB; combining many related entities is usually cheaper in PostgreSQL. Measure with your access pattern.</li>
<li><strong>"How do you keep referential integrity in MongoDB?"</strong> — Design so references are rare (embed what belongs together); validate references in the application or a transaction; run periodic orphan-check aggregations; use <code>$jsonSchema</code> for shape.</li>
<li><strong>"Name a case where you would NOT use MongoDB."</strong> — A ledger of payments, or highly connected data with ad-hoc reporting. Give the reason: constraints and joins.</li>
<li><strong>"What does schemaless mean?"</strong> — Not "no schema": the schema lives in your code and queries instead of the database. MongoDB calls it a <em>flexible schema</em>, and can enforce one with validation.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>For each system, decide MongoDB, PostgreSQL or both, and write one reason using the decision table: (a) a university course-registration system; (b) an IoT platform receiving readings from 10,000 sensors every 10 seconds; (c) a recipe website where each recipe has different sections; (d) a wallet app for top-ups and transfers.</li>
<li>Explain in two sentences why the count stayed at 904 instead of 905 in the demo above.</li>
<li>Write one question you would ask a team lead who says "use Mongo so we don't have to design".</li>
</ol>
<details><summary>Suggested answers</summary>
<p>(a) PostgreSQL — highly connected (students, classes, schedules), constraints matter. (b) MongoDB (time series collections, Lesson 10.5) or a time-series database — huge write volume, simple shape, sharding. (c) MongoDB — varied shapes read as one whole; PostgreSQL + JSONB also fine. (d) PostgreSQL — money, must reconcile, foreign keys. Question 2: order 9002 has <code>stauts</code>, so <code>{ status: 'PAID' }</code> does not match it; MongoDB accepted the unknown field because no validator was defined.</p>
</details>
<p><strong>Done when:</strong> each of your four answers cites a row of the decision table.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Aggregate', 'A cluster of data read and changed as one unit (an order with its lines) — the natural size of a MongoDB document.'],
  ['Foreign key', 'A SQL constraint that rejects a reference to a row that does not exist. MongoDB has none.'],
  ['Orphan', 'A record pointing to something that does not exist, like an order for customer KH9999.'],
  ['Flexible schema', 'Documents in one collection may have different fields; validation is optional.'],
  ['Referential integrity', 'Every reference points to something real — enforced by SQL, by your code in MongoDB.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>MongoDB is natural for aggregates read as a whole, varied shapes, queries inside arrays, and built-in sharding.</li>
<li>It silently accepts orphans and typo fields; PostgreSQL rejects both at write time. Validation fixes typos, nothing gives you foreign keys.</li>
<li>Avoid MongoDB for ledgers, highly connected data and ad-hoc SQL reporting; never choose it "to skip design".</li>
<li>Real systems often use both — decide per part, with the decision table.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>MongoDB hay PostgreSQL? Khi nào chọn MongoDB, và khi nào KHÔNG</h2>
<p class="lead">Lúc khởi động gần như mọi đồ án sinh viên, và không ít dự án thật, sẽ có người nói: "Dùng MongoDB đi, nhanh hơn mà khỏi phải thiết kế database." Cả hai nửa câu đó đều sai, và cuối bài này bạn giải thích được vì sao — bằng output chính bạn chạy. Bạn cũng sẽ thấy những trường hợp MongoDB thật sự là công cụ tốt hơn.</p>

<h3>Hình ảnh đời thường: tủ quần áo và tủ hồ sơ</h3>
<p>Một <strong>tủ quần áo xếp theo hộp</strong>: mỗi hộp đựng trọn một bộ — áo, quần, thắt lưng — lấy là mặc. Hộp to nhỏ khác nhau; hộp mùa đông có khăn, hộp mùa hè thì không. Lấy một bộ thì tức thì. Nhưng nếu bạn muốn thay mọi chiếc áo xanh, bạn phải mở từng hộp.</p>
<p>Một <strong>tủ hồ sơ</strong>: một ngăn áo, một ngăn quần, một ngăn thắt lưng, và mỗi bộ đồ là một tấm thẻ ghi "áo số 12 + quần số 4". Ghép một bộ mất vài bước; thay mọi áo xanh chỉ cần một ngăn. Và tủ hồ sơ từ chối tấm thẻ ghi "áo số 99" nếu không có chiếc áo nào như thế.</p>
<p>MongoDB là tủ quần áo. PostgreSQL là tủ hồ sơ. Không bên nào "nhanh hơn" nói chung: mỗi bên nhanh ở việc mà hình dạng của nó làm cho rẻ.</p>

<h3>Chỗ MongoDB tự nhiên — chạy thử</h3>
<p><strong>1. Dữ liệu nhiều hình dạng trong một collection.</strong> Danh mục CT Shop có năm loại sản phẩm, và mỗi loại có thuộc tính khác nhau:</p>
${lenh('s00-uu', 0)}
${lenh('s00-uu', 1)}
${lenh('s00-uu', 2)}
<p>Sách có <code>author</code>, <code>pages</code>, <code>tags</code>; phụ kiện có <code>warrantyMonths</code> và <code>wireless</code>. Trong SQL bạn phải chọn giữa một bảng rộng đầy NULL, mỗi loại một bảng, hoặc một bảng "thuộc tính – giá trị" truy vấn rất cực. (Câu trả lời của PostgreSQL là cột JSONB — một lựa chọn đúng, được so ở PostgreSQL 17.3.)</p>
<p><strong>2. Truy vấn bên trong mảng.</strong> Mỗi mẫu áo cất các cỡ thành một mảng biến thể. "Áo nào có cỡ M còn từ 20 chiếc trở lên?" — và chỉ trả về đúng biến thể khớp:</p>
${lenh('s00-uu', 3)}
<p><strong>3. Cập nhật nguyên tử cả một khối.</strong> Đổi trạng thái đơn <em>và</em> nối thêm vào lịch sử của nó là một lần ghi vào một tài liệu — nguyên tử mà không cần transaction, và điều kiện <code>status: 'PAID'</code> bảo đảm ta không giao một đơn vừa bị huỷ trước đó một phần nghìn giây:</p>
${lenh('s00-uu', 4)}
<p>Đó là sức mạnh thật của mô hình tài liệu: <strong>đơn vị bạn đọc và ghi cùng nhau thì được cất cùng nhau</strong> (thiết kế hướng miền gọi nó là <em>aggregate</em>). Cộng thêm nhân bản và sharding có sẵn (Chương 7), bạn có lý lẽ trung thực để chọn MongoDB.</p>

<h3>Chỗ MongoDB im lặng nhận dữ liệu sai — chạy cả hai phía</h3>
<p>Giờ là hai lỗi kinh điển. Một đơn hàng của khách không tồn tại (<code>KH9999</code>), và một đơn mà lập trình viên gõ <code>stauts</code> thay vì <code>status</code>:</p>
${lenh('s00-nhuoc', 0)}
${lenh('s00-nhuoc', 1)}
<p>Cả hai đều được nhận. Giờ phòng kinh doanh đếm số đơn đã trả tiền, rồi liệt kê hai đơn ta vừa chèn:</p>
${lenh('s00-nhuoc', 2)}
${lenh('s00-nhuoc', 3)}
<p>Con số đi từ 903 lên 904, không phải 905: đơn 9002 vô hình với mọi truy vấn dùng <code>status</code>, và <code>total</code> của nó là số thường trong khi mọi đơn khác là <code>Decimal128</code>. Không ai nhận được lỗi nào. Vài tuần sau báo cáo doanh thu lệch và không ai biết vì sao. Cũng hai lệnh chèn đó trên PostgreSQL 16:</p>
${lenh('s00-nhuoc', 4)}
<p>PostgreSQL từ chối cả hai, ngay lúc ghi, kèm thông báo chính xác. Đó là thứ <strong>khoá ngoại</strong> và <strong>schema cố định</strong> mua cho bạn. Trong MongoDB bạn lấy lại được một phần bằng kiểm hợp lệ <code>$jsonSchema</code> (Bài 1.3 bắt được lỗi gõ <code>stauts</code>) — nhưng <strong>không bao giờ có khoá ngoại</strong>: giữ toàn vẹn tham chiếu là việc của ứng dụng.</p>

<h3>Vậy — khi nào chọn MongoDB</h3>
<ul>
<li>Dữ liệu tự nhiên là <strong>những khối được đọc trọn một lần</strong>: đơn hàng kèm các dòng, bài viết kèm bình luận (nếu có giới hạn), hồ sơ người dùng kèm tuỳ chọn, thiết bị kèm các số đo mới nhất.</li>
<li><strong>Hình dạng khác nhau</strong> theo từng bản ghi và hay đổi: danh mục sản phẩm, nội dung CMS, trình tạo biểu mẫu, dữ liệu sự kiện từ nhiều nguồn.</li>
<li><strong>Lượng ghi hoặc kích thước dữ liệu sẽ vượt một máy</strong>, và bạn muốn sharding có sẵn thay vì tự lắp.</li>
<li>Đội đã vận hành MongoDB tốt (sao lưu, giám sát) — kinh nghiệm vận hành là yếu tố thật.</li>
</ul>
<h3>…và khi nào KHÔNG</h3>
<ul>
<li><strong>Tiền và sổ cái</strong>: số dư, thanh toán, xuất nhập kho phải khớp từng đồng — bạn cần ràng buộc, khoá ngoại và bộ công cụ transaction trưởng thành của SQL. MongoDB làm được transaction, nhưng không gì ngăn một lỗi lập trình ghi ra bản ghi mồ côi.</li>
<li><strong>Dữ liệu liên kết chằng chịt</strong> truy vấn theo nhiều hướng: sinh viên – lớp – giảng viên – phòng – lịch học, phân quyền. Mỗi lần "nối" trong MongoDB là một <code>$lookup</code> hoặc thêm một truy vấn.</li>
<li><strong>Báo cáo tuỳ ý và BI</strong> do người biết SQL viết, trải qua nhiều thực thể.</li>
<li><strong>"Để khỏi phải thiết kế database"</strong>: lý do tệ nhất. MongoDB cần thiết kế <em>nhiều hơn</em> từ đầu, vì schema đi theo truy vấn của bạn (Chương 3). Bỏ qua thiết kế là nhận lỗi <code>stauts</code> ở quy mô lớn.</li>
<li>Ứng dụng nhỏ mà PostgreSQL cộng một cột JSONB đã phủ được phần "linh hoạt" — vận hành một cơ sở dữ liệu rẻ hơn hai.</li>
</ul>

<h3>Ba câu hỏi trước khi gọi tên hãng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cái gì được đọc cùng nhau?</span><span class="lz-t">liệt kê các màn hình và dữ liệu mỗi màn hiện</span><span class="lz-d">Dữ liệu hiện cùng nhau ở phần lớn màn hình là ứng viên cho một tài liệu. Các mảnh ghép theo kiểu khác nhau ở mỗi màn hình thì nghiêng về bảng.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cái gì dùng chung?</span><span class="lz-t">dữ liệu được nhiều bản ghi tham chiếu</span><span class="lz-d">Tên khách chép vào đơn hàng thì ổn nếu bản chép cũ chấp nhận được; số dư dùng chung bởi nhiều giao dịch thì không.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Ai ép luật?</span><span class="lz-t">cơ sở dữ liệu, hay mã của bạn?</span><span class="lz-d">Nếu một tham chiếu sai làm mất tiền hay phạm luật, bạn muốn chính cơ sở dữ liệu từ chối nó — đó là đất của PostgreSQL.</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "validator $jsonSchema cũng như khoá ngoại".</strong> Validator chỉ kiểm <em>hình dạng</em> của một tài liệu (tên trường, kiểu, trường bắt buộc). Nó không nhìn sang collection khác được, nên <code>customerId: 'KH9999'</code> qua mọi validator. Toàn vẹn giữa các collection vẫn là việc của bạn.</p>
</div>
<h3>Bảng quyết định</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Nghiêng về MongoDB</th><th>Nghiêng về PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Đơn vị chính có được đọc trọn một khối không?</td><td>Có — đơn + dòng, bài viết + bình luận</td><td>Không — mỗi màn hình ghép các mảnh theo kiểu khác</td></tr>
<tr><td>Bản ghi cùng loại có trường rất khác nhau không?</td><td>Có, và hay đổi</td><td>Gần như cùng các cột</td></tr>
<tr><td>Cùng một dữ liệu có được nhiều bản ghi dùng chung không?</td><td>Hiếm, hoặc chép một bản là chấp nhận được</td><td>Thường xuyên, và phải nhất quán mọi nơi</td></tr>
<tr><td>Chính cơ sở dữ liệu có phải từ chối tham chiếu sai không?</td><td>Ứng dụng tự lo được</td><td>Có — tiền, tồn kho, hồ sơ pháp lý</td></tr>
<tr><td>Ai viết báo cáo?</td><td>Lập trình viên, truy vấn biết trước</td><td>Người phân tích, SQL tuỳ ý</td></tr>
<tr><td>Một máy chủ có sắp không đủ không?</td><td>Có thể — sharding có sẵn</td><td>Vài năm nữa cũng chưa — một máy tốt đi rất xa</td></tr>
</tbody></table>
<p>Phần lớn hệ thống thật dùng <strong>cả hai</strong>: chính cuongthai.com chạy PostgreSQL vì khoá học, người dùng và thanh toán là dữ liệu quan hệ nối nhau; một tính năng như nhật ký sự kiện hay nhật ký hoạt động lượng ghi lớn là loại phần mà kho tài liệu sẽ hợp. Khoá PostgreSQL có cây quyết định đầy đủ cho bốn họ cơ sở dữ liệu — đọc tiếp ở đó.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-4-chon-he-nao', title: 'PostgreSQL 17.4 — Chọn hệ nào?', sub: 'Sáu câu hỏi, cây quyết định, hai ca thực tế' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — Document MongoDB và JSONB của PostgreSQL', sub: 'Cùng bộ đơn hàng, cả hai cơ sở dữ liệu, đo cái giá của bản chép' })}

<h3>💼 Đi làm: "cứ dùng Mongo, khỏi thiết kế"</h3>
<p>Trưởng nhóm lúc bạn thực tập nói câu đó trong buổi khởi động. Đừng cãi nhau về tên hãng. Hãy hỏi ba câu: "Màn hình nào đọc dữ liệu nào cùng nhau? Dữ liệu nào dùng chung và phải nhất quán? Ai sẽ viết báo cáo?" Rồi đề xuất: "MongoDB cho danh mục (hình dạng đa dạng), PostgreSQL cho đơn hàng và thanh toán — hoặc nếu muốn một cơ sở dữ liệu thôi, PostgreSQL với JSONB cho phần thuộc tính danh mục." Chọn gì thì chọn, hãy đòi có bộ kiểm hợp lệ (Bài 1.3) và một danh sách truy vấn viết ra giấy (Chương 3). Đó là điều một người có kinh nghiệm sẽ nói.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"MongoDB có nhanh hơn PostgreSQL không?"</strong> — Câu hỏi sai từ gốc. Đọc một khối cất chung là một lần tra trong MongoDB; ghép nhiều thực thể liên quan thường rẻ hơn ở PostgreSQL. Đo bằng chính kiểu truy cập của bạn.</li>
<li><strong>"Bạn giữ toàn vẹn tham chiếu trong MongoDB thế nào?"</strong> — Thiết kế để tham chiếu hiếm (nhúng những gì thuộc về nhau); kiểm tham chiếu trong ứng dụng hoặc trong transaction; chạy định kỳ aggregation tìm bản ghi mồ côi; dùng <code>$jsonSchema</code> cho hình dạng.</li>
<li><strong>"Kể một trường hợp bạn KHÔNG dùng MongoDB."</strong> — Sổ cái thanh toán, hoặc dữ liệu liên kết chằng chịt cần báo cáo tuỳ ý. Nêu lý do: ràng buộc và JOIN.</li>
<li><strong>"Schemaless nghĩa là gì?"</strong> — Không phải "không có schema": schema nằm trong mã và truy vấn của bạn thay vì trong cơ sở dữ liệu. MongoDB gọi là <em>schema linh hoạt</em>, và ép được một schema bằng kiểm hợp lệ.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Với mỗi hệ thống, chọn MongoDB, PostgreSQL hay cả hai, viết một lý do dựa vào bảng quyết định: (a) hệ thống đăng ký môn học của trường; (b) nền tảng IoT nhận số đo từ 10.000 cảm biến mỗi 10 giây; (c) trang công thức nấu ăn, mỗi công thức có các phần khác nhau; (d) ví điện tử nạp tiền và chuyển tiền.</li>
<li>Giải thích trong hai câu vì sao trong demo ở trên con số dừng ở 904 chứ không phải 905.</li>
<li>Viết một câu hỏi bạn sẽ hỏi trưởng nhóm khi họ nói "dùng Mongo để khỏi thiết kế".</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>(a) PostgreSQL — liên kết chằng chịt (sinh viên, lớp, lịch), ràng buộc quan trọng. (b) MongoDB (time series collection, Bài 10.5) hoặc một CSDL chuỗi thời gian — lượng ghi khổng lồ, hình dạng đơn giản, cần sharding. (c) MongoDB — hình dạng đa dạng, đọc trọn một khối; PostgreSQL + JSONB cũng ổn. (d) PostgreSQL — tiền, phải khớp, khoá ngoại. Câu 2: đơn 9002 có trường <code>stauts</code>, nên <code>{ status: 'PAID' }</code> không khớp nó; MongoDB nhận trường lạ vì chưa có bộ kiểm hợp lệ nào.</p>
</details>
<p><strong>Xong khi:</strong> cả bốn câu trả lời của bạn đều dẫn ra một dòng của bảng quyết định.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Aggregate (khối dữ liệu)', 'Cụm dữ liệu được đọc và đổi như một đơn vị (đơn hàng kèm các dòng) — kích thước tự nhiên của một tài liệu MongoDB.'],
  ['Khoá ngoại (foreign key)', 'Ràng buộc SQL từ chối tham chiếu tới dòng không tồn tại. MongoDB không có.'],
  ['Bản ghi mồ côi (orphan)', 'Bản ghi trỏ tới thứ không tồn tại, như đơn hàng của khách KH9999.'],
  ['Schema linh hoạt', 'Các tài liệu trong một collection có thể có trường khác nhau; kiểm hợp lệ là tuỳ chọn.'],
  ['Toàn vẹn tham chiếu', 'Mọi tham chiếu trỏ tới thứ có thật — SQL tự ép, MongoDB thì mã của bạn phải lo.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>MongoDB tự nhiên cho các khối đọc trọn, hình dạng đa dạng, truy vấn trong mảng, và sharding có sẵn.</li>
<li>Nó im lặng nhận bản ghi mồ côi và trường gõ sai; PostgreSQL từ chối cả hai lúc ghi. Kiểm hợp lệ sửa được lỗi gõ, không gì cho bạn khoá ngoại.</li>
<li>Tránh MongoDB cho sổ cái, dữ liệu liên kết chằng chịt và báo cáo SQL tuỳ ý; đừng bao giờ chọn nó "để khỏi thiết kế".</li>
<li>Hệ thống thật thường dùng cả hai — quyết định theo từng phần, bằng bảng quyết định.</li>
</ul>
</div>
`,
};
