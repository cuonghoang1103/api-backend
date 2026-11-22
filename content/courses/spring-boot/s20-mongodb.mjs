/**
 * Spring Boot — Chương 20: Spring Data MongoDB (soạn 22/11/2026).
 * Phủ phần MongoDB của HSF302/SBA301. Đặt CUỐI khoá (không chèn giữa, không đánh số lại); slug khớp khung trong
 * spring-boot.mjs (sb-20-N-…). Mốc dự án 21 (sb-moc-21) được spring-boot.mjs chèn trước bài quiz.
 * Mọi output chạy thật trên máy Mac của người dùng: Spring Boot 4.1.2, Spring Data MongoDB của Boot 4.1.2,
 * MongoDB 7.0.48 (mongo:7 trong Docker Desktop 29.8), Java 21.0.9, Testcontainers 2 (starter của Boot 4.1.2).
 * Dự án mẫu: "gearreview" (đánh giá thiết bị của CLB, chỉ MongoDB) cho 20.1–20.3, và "gearloan" (cùng khung mẫu của
 * các mốc — ./_du-an-mau.mjs) cho 20.4 khi MongoDB chạy cạnh PostgreSQL.
 * Không trùng: JPA/Hibernate (Ch.6–7), sự kiện/outbox (Ch.14) — chỉ liên kết sang.
 * KHÔNG backtick trần trong content; mã mẫu đi qua java()/js()/yml()/out() của _chung.mjs.
 */
import { java, js, yml, bash, xml, sql, out, tl } from './_chung.mjs';

const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
/** t(en)('chữ EN', 'chữ VI') — chọn ngôn ngữ cho khối hiện tại. */
const t = (en) => (a, b) => (en ? a : b);

/* ═════════════ 20.1 — Document và bảng ═════════════ */
const M1_JS = js(`
db.gear.insertOne({ _id: 7, name: 'Rode VideoMic', category: 'audio' });
db.reviews.insertMany([
  { gearId: 7, author: 'An', rating: 5, text: 'Clear sound for vlogs', tags: ['audio', 'vlog'],
    replies: [{ author: 'Binh', text: 'Same here', at: new Date('2026-11-20') }] },
  { gearId: 7, author: 'Chi', rating: 2, text: 'Battery died fast', battery: { hours: 3, type: '9V' } },
]);
db.reviews.findOne({ author: 'An' }, { _id: 0 });
db.reviews.find({ tags: 'vlog' }, { _id: 0, author: 1 });                 // tìm trong mảng
db.reviews.find({ 'battery.hours': { $lt: 5 } }, { _id: 0, author: 1, battery: 1 });  // trường lồng
db.reviews.insertOne({ gearId: 999, author: 'Ghost', rating: 1 });       // thiết bị 999 không tồn tại
db.reviews.aggregate([
  { $match: { author: { $in: ['An', 'Ghost'] } } },
  { $lookup: { from: 'gear', localField: 'gearId', foreignField: '_id', as: 'gear' } },
  { $project: { _id: 0, author: 1, gearName: { $ifNull: [{ $first: '$gear.name' }, '(missing)'] } } },
]);
`);
const O1 = out(`
$ docker run -d --name ch20-mongo -p 127.0.0.1:57017:27017 mongo:7
$ docker exec ch20-mongo mongosh gearreview --quiet /m1.js
--- one document = the whole review, replies included
{
  gearId: 7, author: 'An', rating: 5, text: 'Clear sound for vlogs',
  tags: [ 'audio', 'vlog' ],
  replies: [ { author: 'Binh', text: 'Same here', at: ISODate('2026-11-20T00:00:00.000Z') } ]
}
--- query inside an array and a nested field
[ { author: 'An' } ]
[ { author: 'Chi', battery: { hours: 3, type: '9V' } } ]
--- no foreign key: a review of gear 999 that does not exist is accepted
true
--- the closest thing to JOIN: $lookup (runs at query time, no constraint)
[ { author: 'An', gearName: 'Rode VideoMic' }, { author: 'Ghost', gearName: '(missing)' } ]
`);
const O1_16MB = out(`
# đẩy mỗi lần 1 MB vào mảng replies của CÙNG một document
push #16 failed: Resulting document after update is larger than 16777216
$ mongosh --eval 'bsonsize(db.big.findOne())/1048576'
15.0 MB
`);
const S1_JSONB = sql(`
create table review_j (id serial primary key, gear_id bigint, doc jsonb);
insert into review_j (gear_id, doc) values
  (7, '{"author":"An","rating":5,"tags":["audio","vlog"],"replies":[{"author":"Binh","text":"same"}]}'),
  (7, '{"author":"Chi","rating":2,"battery":{"hours":3}}');
create index on review_j using gin (doc jsonb_path_ops);
select id, doc->>'author' as author from review_j where doc @> '{"tags":["audio"]}';
select gear_id, avg((doc->>'rating')::int) from review_j group by gear_id;
`);
const O1_JSONB = out(`
 id | author
----+--------
  1 | An
(1 row)

 gear_id |        avg
---------+--------------------
       7 | 3.5000000000000000
(1 row)
`);
const O1_MO = out(`
# cổng ghi "-p 57018:27017" (thiếu 127.0.0.1) và KHÔNG bật xác thực:
$ docker port ch20-open
27017/tcp -> 0.0.0.0:57018
27017/tcp -> [::]:57018
# từ một máy khác trong cùng mạng Wi-Fi, chỉ cần IP:
$ mongosh "mongodb://<ip-may>:57018" --eval 'db.adminCommand({listDatabases:1}).databases.map(d => d.name)'
[ 'admin', 'config', 'local' ]
# cùng image, bind 127.0.0.1 và có MONGO_INITDB_ROOT_USERNAME/PASSWORD:
$ mongosh "mongodb://host.docker.internal:57019" --eval 'db.adminCommand({listDatabases:1})'
MongoServerError: Command listDatabases requires authentication
`);
const B1_AUTH = bash(`
# học/dev: chỉ nghe trên máy mình, có mật khẩu (đặt trong biến môi trường, không ghi vào repo)
docker run -d --name ch20-mongo -p 127.0.0.1:57017:27017 \\
  -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD="$MAT_KHAU_MONGO" mongo:7
`);

const L1 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 20 · Spring Data MongoDB', 'Chương 20 · Spring Data MongoDB')}</span>
<h2>${T('20.1 — Documents vs tables: when MongoDB fits', '20.1 — Document và bảng: khi nào MongoDB hợp')}</h2>
<p class="lead">${T(
  'Everything so far lived in PostgreSQL: rows, foreign keys, transactions, constraints that refuse bad data. MongoDB stores <strong>documents</strong> — one JSON-like object per record, with arrays and nested objects inside, and no fixed columns. That is great for some data and dangerous for other data. This lesson is about telling the two apart before you write a line of Spring code, because the choice is much harder to undo than a library.',
  'Tới giờ mọi thứ đều nằm trong PostgreSQL: dòng, khoá ngoại, giao dịch, ràng buộc từ chối dữ liệu sai. MongoDB lưu <strong>document</strong> — mỗi bản ghi là một đối tượng kiểu JSON, bên trong có mảng và đối tượng lồng, không có cột cố định. Thứ đó rất hợp với một số loại dữ liệu và nguy hiểm với loại khác. Bài này dạy phân biệt hai loại đó trước khi viết dòng mã Spring nào, vì chọn sai CSDL khó gỡ hơn nhiều so với chọn sai thư viện.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'PostgreSQL is the club’s <em>ledger</em>: one sheet for members, one for gear, one for loans, and every loan line must point to a real member and a real camera — the ledger refuses a line that does not. MongoDB is a <em>drawer of folders</em>: each review is one folder holding the text, the photos’ captions and every reply stapled inside. You grab one folder and you have everything; nobody checks that the camera named on the folder still exists.',
  'PostgreSQL là <em>sổ cái</em> của CLB: một trang cho thành viên, một trang cho thiết bị, một trang cho lượt mượn, và mỗi dòng lượt mượn phải trỏ tới một thành viên và một máy ảnh có thật — sổ cái từ chối dòng nào không như vậy. MongoDB là <em>ngăn kéo hồ sơ</em>: mỗi đánh giá là một bìa hồ sơ chứa phần chữ, chú thích ảnh và mọi câu trả lời kẹp luôn bên trong. Rút một bìa là có đủ mọi thứ; không ai kiểm tra chiếc máy ảnh ghi trên bìa còn tồn tại hay không.')}</p>

<h3>${T('Two reviews, two shapes — measured', 'Hai đánh giá, hai hình dạng — đo thật')}</h3>
${M1_JS}
${O1}
<p>${T(
  'Read the output as four facts. (1) A document carries its own children: the reply is <em>embedded</em>, so one read returns the whole review. (2) Queries reach into arrays (<code>tags: \'vlog\'</code>) and nested fields (<code>battery.hours</code>) directly. (3) Chi’s review has a <code>battery</code> field An’s does not — no migration, no ALTER TABLE. (4) A review of gear 999 was accepted. There is no foreign key; <code>$lookup</code> joins at read time and simply finds nothing.',
  'Đọc output thành bốn sự thật. (1) Document mang theo con của nó: câu trả lời được <em>nhúng</em>, nên một lần đọc trả về cả bài đánh giá. (2) Truy vấn với thẳng vào mảng (<code>tags: \'vlog\'</code>) và trường lồng (<code>battery.hours</code>). (3) Bài của Chi có trường <code>battery</code> mà bài của An không có — không migration, không ALTER TABLE. (4) Một đánh giá cho thiết bị 999 vẫn được nhận. Không có khoá ngoại; <code>$lookup</code> chỉ nối lúc đọc và đơn giản là không tìm thấy gì.')}</p>

<h3>${T('Embed or reference?', 'Nhúng hay tham chiếu?')}</h3>
<table>
<thead><tr><th></th><th>${T('Embed (child inside parent)', 'Nhúng (con nằm trong cha)')}</th><th>${T('Reference (store an id)', 'Tham chiếu (lưu một id)')}</th></tr></thead>
<tbody>
<tr><td>${T('Use when', 'Dùng khi')}</td><td>${T('Read together, owned by the parent, bounded in number (replies to one review, address of an order)', 'Đọc cùng nhau, thuộc về cha, số lượng có giới hạn (trả lời của một đánh giá, địa chỉ của một đơn)')}</td><td>${T('Shared by many parents, grows without bound, changes on its own (the gear itself, the member)', 'Nhiều cha dùng chung, tăng không giới hạn, tự thay đổi riêng (chính thiết bị, thành viên)')}</td></tr>
<tr><td>${T('Cost', 'Cái giá')}</td><td>${T('Copy of data; a document is capped at 16 MB', 'Dữ liệu bị chép; một document tối đa 16 MB')}</td><td>${T('A second query or $lookup; no integrity check', 'Thêm một truy vấn hoặc $lookup; không ai kiểm toàn vẹn')}</td></tr>
</tbody>
</table>
<p>${T('The 16 MB cap is not theory. Pushing 1 MB replies into one document:', 'Trần 16 MB không phải lý thuyết. Đẩy câu trả lời 1 MB vào cùng một document:')}</p>
${O1_16MB}
<p>${T(
  'A comment thread that can grow forever must not be an embedded array; put comments in their own collection with a <code>reviewId</code>, or embed only the latest few.',
  'Một chuỗi bình luận có thể dài mãi thì không được là mảng nhúng; tách bình luận ra collection riêng có <code>reviewId</code>, hoặc chỉ nhúng vài cái mới nhất.')}</p>

<h3>${T('Before choosing MongoDB, try PostgreSQL JSONB', 'Trước khi chọn MongoDB, thử JSONB của PostgreSQL')}</h3>
<p>${T('Same two reviews, stored in the PostgreSQL you already run (lesson 6.1), with a GIN index:', 'Cùng hai đánh giá, lưu trong chính PostgreSQL bạn đang chạy (bài 6.1), có chỉ mục GIN:')}</p>
${S1_JSONB}
${O1_JSONB}
<p>${T(
  'Flexible fields, containment queries, aggregation — and you keep transactions and a real foreign key on <code>gear_id</code>. For one flexible column inside a relational app, JSONB is usually the simpler answer. MongoDB earns its place when the <em>whole</em> data set is document-shaped, very write-heavy, or must scale out across machines (sharding), or when the team already runs it.',
  'Trường linh hoạt, truy vấn chứa, aggregation — mà vẫn giữ giao dịch và một khoá ngoại thật trên <code>gear_id</code>. Với một cột linh hoạt trong app quan hệ, JSONB thường là câu trả lời đơn giản hơn. MongoDB xứng đáng khi <em>toàn bộ</em> dữ liệu có hình dạng document, ghi rất nhiều, hoặc phải trải ngang nhiều máy (sharding), hoặc khi đội vốn đã vận hành nó.')}</p>

<h3>${T('A rule of thumb you can defend in an interview', 'Một quy tắc bạn bảo vệ được khi phỏng vấn')}</h3>
<ul>
<li>${T('<strong>Money, stock, bookings, anything two people can fight over</strong> ⇒ relational: constraints and transactions are the product (the double-loan race of milestone 8 was stopped by a unique index).', '<strong>Tiền, tồn kho, đặt chỗ, thứ hai người có thể giành nhau</strong> ⇒ CSDL quan hệ: ràng buộc và giao dịch chính là sản phẩm (cuộc đua mượn đôi ở mốc 8 bị chặn bởi một unique index).')}</li>
<li>${T('<strong>Logs, events, reviews, product catalogues with varying attributes, form answers</strong> ⇒ documents fit: written once, read whole, shape varies.', '<strong>Nhật ký, sự kiện, đánh giá, danh mục sản phẩm có thuộc tính thay đổi, câu trả lời phiếu</strong> ⇒ document hợp: ghi một lần, đọc nguyên khối, hình dạng thay đổi.')}</li>
<li>${T('“Schemaless” means the schema lives in your <em>code</em> instead of the database. You still need one — Spring’s record classes become it (20.2).', '“Không schema” nghĩa là schema nằm trong <em>mã</em> thay vì trong CSDL. Bạn vẫn cần schema — record của Spring sẽ đóng vai đó (20.2).')}</li>
</ul>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — the open MongoDB.', 'Góc hacker — MongoDB mở toang.')}</strong> ${T(
  'In January 2017 attackers scanned the internet for MongoDB servers with no password, wiped tens of thousands of databases and left a ransom note collection behind. Old MongoDB versions listened on every interface by default; Docker brings the same mistake back, because <code>-p 57018:27017</code> without an IP binds to <code>0.0.0.0</code>, on every network the laptop joins:',
  'Tháng 1/2017, kẻ tấn công quét Internet tìm máy chủ MongoDB không mật khẩu, xoá sạch hàng chục nghìn CSDL và để lại một collection đòi tiền chuộc. MongoDB bản cũ mặc định nghe trên mọi giao diện mạng; Docker mang lỗi đó quay lại, vì <code>-p 57018:27017</code> không ghi IP sẽ bind vào <code>0.0.0.0</code>, trên mọi mạng mà laptop vào:')}</p>
${O1_MO}
<p>${T('Fix both halves: bind to 127.0.0.1 and turn authentication on. The password comes from an environment variable, never from the repository:', 'Vá cả hai nửa: bind vào 127.0.0.1 và bật xác thực. Mật khẩu lấy từ biến môi trường, không bao giờ nằm trong repo:')}</p>
${B1_AUTH}</div>

<h3>${T('🧪 Practice (20 minutes)', '🧪 Thực hành (20 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Start mongo:7 bound to 127.0.0.1, open mongosh with docker exec, insert three documents of your topic with different optional fields.', 'Chạy mongo:7 bind 127.0.0.1, mở mongosh bằng docker exec, chèn ba document của đề tài bạn với các trường tuỳ chọn khác nhau.')}</li>
<li>${T('Query one array field and one nested field. Insert a document that references an id that does not exist and note that it is accepted.', 'Truy vấn một trường mảng và một trường lồng. Chèn một document tham chiếu tới id không tồn tại và ghi lại rằng nó được nhận.')}</li>
<li>${T('Write two lines in your README: which data of your project you would put in MongoDB, and which must stay in PostgreSQL — and why.', 'Viết hai dòng trong README: dữ liệu nào của dự án bạn sẽ đưa vào MongoDB, dữ liệu nào phải ở lại PostgreSQL — và vì sao.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('<code>docker port</code> shows 127.0.0.1 only, and your README paragraph names at least one rule (constraint, transaction or race) that MongoDB would not enforce for you.', '<code>docker port</code> chỉ hiện 127.0.0.1, và đoạn README nêu được ít nhất một luật (ràng buộc, giao dịch hay cuộc đua) mà MongoDB sẽ không tự giữ giúp bạn.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“SQL or NoSQL for this feature?”', '“Tính năng này dùng SQL hay NoSQL?”')}</strong> — ${T('Start from the data and its rules, not from fashion: relationships and invariants ⇒ relational; self-contained, variable-shape records read whole ⇒ document. Mention JSONB as the middle ground.', 'Bắt đầu từ dữ liệu và luật của nó, không theo mốt: quan hệ và bất biến ⇒ quan hệ; bản ghi tự đủ, hình dạng thay đổi, đọc nguyên khối ⇒ document. Nhắc JSONB như lựa chọn ở giữa.')}</li>
<li><strong>${T('“Embed or reference?”', '“Nhúng hay tham chiếu?”')}</strong> — ${T('Embed what is read together, owned and bounded; reference what is shared or unbounded. The 16 MB document limit is the hard stop.', 'Nhúng thứ đọc cùng nhau, thuộc về cha và có giới hạn; tham chiếu thứ dùng chung hoặc không giới hạn. Trần 16 MB mỗi document là điểm dừng cứng.')}</li>
<li><strong>${T('“Does MongoDB have transactions?”', '“MongoDB có giao dịch không?”')}</strong> — ${T('Single-document writes are atomic; multi-document transactions exist since 4.0 but need a replica set and cost more. Designing so one document holds what must change together is the usual answer.', 'Ghi một document là nguyên tử; giao dịch nhiều document có từ bản 4.0 nhưng cần replica set và tốn hơn. Cách thường làm là thiết kế để một document chứa đủ những gì phải đổi cùng nhau.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Document</span><span class="v">${T('One record: a BSON object with nested objects and arrays.', 'Một bản ghi: đối tượng BSON có đối tượng lồng và mảng.')}</span></div>
  <div class="kv"><span class="k">Collection</span><span class="v">${T('A group of documents — the counterpart of a table, without fixed columns.', 'Nhóm document — tương ứng với bảng, nhưng không có cột cố định.')}</span></div>
  <div class="kv"><span class="k">${T('Embedding', 'Nhúng')}</span><span class="v">${T('Storing children inside the parent document.', 'Lưu con ngay trong document cha.')}</span></div>
  <div class="kv"><span class="k">$lookup</span><span class="v">${T('Aggregation stage that joins at read time; no constraint behind it.', 'Bước aggregation nối dữ liệu lúc đọc; không có ràng buộc nào đứng sau.')}</span></div>
  <div class="kv"><span class="k">JSONB</span><span class="v">${T('PostgreSQL’s binary JSON column type, indexable with GIN.', 'Kiểu cột JSON nhị phân của PostgreSQL, đánh chỉ mục được bằng GIN.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('Documents carry their children and any shape; there are no foreign keys and no JOIN-time integrity.', 'Document mang theo con và mang hình dạng tuỳ ý; không có khoá ngoại, không có toàn vẹn lúc nối.')}</li>
<li>${T('Embed what is read together and bounded; reference what is shared or grows; 16 MB is the hard limit.', 'Nhúng thứ đọc cùng nhau và có giới hạn; tham chiếu thứ dùng chung hoặc tăng mãi; 16 MB là trần cứng.')}</li>
<li>${T('Keep contested data relational; consider JSONB before adding a second database.', 'Giữ dữ liệu bị tranh chấp ở CSDL quan hệ; cân nhắc JSONB trước khi thêm CSDL thứ hai.')}</li>
<li>${T('Bind MongoDB to 127.0.0.1 and enable authentication — open instances are found and wiped.', 'Bind MongoDB vào 127.0.0.1 và bật xác thực — instance mở toang sẽ bị tìm thấy và xoá sạch.')}</li>
</ul>
${tl('https://www.mongodb.com/docs/manual/data-modeling/', '📘', 'MongoDB Manual — Data modeling', T('Embedding vs references, schema design patterns', 'Nhúng và tham chiếu, các mẫu thiết kế schema'))}
${tl('https://www.postgresql.org/docs/16/datatype-json.html', '🐘', 'PostgreSQL 16 — JSON types', T('jsonb, containment and GIN indexing', 'jsonb, phép chứa và chỉ mục GIN'))}
</div>
`; };

/* ═════════════ 20.2 — @Document, MongoRepository, MongoTemplate ═════════════ */
const C2_POM = xml(`
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
<!-- test: spring-boot-starter-data-mongodb-test + spring-boot-testcontainers + testcontainers-mongodb (bài 20.4) -->
`);
const C2_YML = yml(`
spring:
  mongodb.uri: \${MONGO_URI:mongodb://localhost:57017/gearreview}   # Boot 4: spring.mongodb.*
management.endpoint.health.show-components: always
`);
const O2_URI = out(`
# cùng app, nhưng cấu hình chép từ một tutorial Boot 3:
#   spring.data.mongodb.uri: mongodb://localhost:57017/gearreview
Started GearreviewApplication in 1.657 seconds
$ curl -s -o /dev/null -w "%{http_code} after %{time_total}s" -X POST localhost:8095/api/reviews -d '{…}'
500 after 30.139053s
$ grep -o "localhost:[0-9]*" app.log | sort | uniq -c
   8 localhost:27017
MongoTimeoutException: Timed out while waiting for a server that matches ReadPreferenceServerSelector{readPreference=primary} …
$ curl -s localhost:8095/actuator/health
{"components":{…,"mongo":{"status":"DOWN"},…},"status":"DOWN"}
`);
const C2_DOC = java(`
/** Một đánh giá thiết bị: câu trả lời NHÚNG bên trong (đọc cùng nhau, thuộc về bài đánh giá). */
@Document("reviews")
public record Review(@Id String id, long gearId, String author, int rating, String text,
                     List<String> tags, List<Reply> replies, int helpful, String editCode, Instant createdAt) {
    public record Reply(String author, String text, Instant at) {}
}

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByGearIdAndRatingGreaterThanEqualOrderByCreatedAtDesc(long gearId, int minRating);
    Page<Review> findByGearId(long gearId, Pageable page);
    List<Review> findByTagsContaining(String tag);
    long countByGearId(long gearId);
}
`);
const C2_CTRL = java(`
record CreateReview(@Positive long gearId, @NotBlank @Size(max = 40) String author, @Min(1) @Max(5) int rating,
                    @Size(max = 2000) String text, @Size(max = 5) List<@Size(max = 20) String> tags) {}

@PostMapping("/reviews")
@ResponseStatus(HttpStatus.CREATED)
Created create(@Valid @RequestBody CreateReview in) {
    var code = UUID.randomUUID().toString().substring(0, 8);   // khách không có tài khoản: mã để tự sửa bài
    var r = reviews.save(new Review(null, in.gearId(), in.author(), in.rating(), in.text(),
            in.tags() == null ? List.of() : in.tags(), List.of(), 0, code, Instant.now()));
    return new Created(r.id(), code);
}

@GetMapping("/gear/{gearId}/reviews")
List<ReviewView> byGear(@PathVariable long gearId, @RequestParam(defaultValue = "1") int min) {
    return reviews.findByGearIdAndRatingGreaterThanEqualOrderByCreatedAtDesc(gearId, min).stream().map(ReviewView::of).toList();
}
`);
const O2_CRUD = out(`
$ curl -s -X POST localhost:8095/api/reviews -H "Content-Type: application/json" -d '{"gearId":7,"author":"An","rating":5,"text":"Clear sound for vlogs","tags":["audio","vlog"]}'
{"id":"6b0301f10500ec2125f19c7a","editCode":"681ce639"}
$ curl -s -X POST localhost:8095/api/reviews -H "Content-Type: application/json" -d '{"gearId":7,"author":"","rating":9}'
{"timestamp":"2026-11-22T14:53:37.206Z","status":400,"error":"Bad Request","path":"/api/reviews"}
$ curl -s "localhost:8095/api/gear/7/reviews?min=4"
[{"id":"6b0301f10500ec2125f19c7a","gearId":7,"author":"An","rating":5,"text":"Clear sound for vlogs","tags":["audio","vlog"],"replies":[],"helpful":0,"createdAt":"2026-11-22T14:53:37.102Z"}]
$ docker exec ch20-mongo mongosh gearreview --quiet --eval 'printjson(db.reviews.findOne({author:"An"}))'
{
  _id: ObjectId('6b0301f10500ec2125f19c7a'),
  gearId: Long('7'),
  author: 'An', rating: 5, text: 'Clear sound for vlogs',
  tags: [ 'audio', 'vlog' ], replies: [], helpful: 0,
  editCode: '681ce639',
  createdAt: ISODate('2026-11-22T14:53:37.102Z'),
  _class: 'com.example.gearreview.review.Review'
}
`);
const C2_INC = java(`
/** SAI: đọc – sửa – ghi CẢ document. Hai request song song ⇒ mất phiếu. */
@PostMapping("/reviews/{id}/helpful-unsafe")
int helpfulUnsafe(@PathVariable String id) {
    var r = reviews.findById(id).orElseThrow();
    var updated = new Review(r.id(), r.gearId(), r.author(), r.rating(), r.text(), r.tags(), r.replies(),
            r.helpful() + 1, r.editCode(), r.createdAt());
    return reviews.save(updated).helpful();
}

/** ĐÚNG: một lệnh $inc nguyên tử ở phía MongoDB, chỉ chạm một trường. */
@PostMapping("/reviews/{id}/helpful")
int helpful(@PathVariable String id) {
    var r = mongo.findAndModify(query(where("_id").is(id)), new Update().inc("helpful", 1),
            FindAndModifyOptions.options().returnNew(true), Review.class);
    if (r == null) throw new NoSuchElementException("review " + id);
    return r.helpful();
}

@PostMapping("/reviews/{id}/replies")
@ResponseStatus(HttpStatus.CREATED)
void reply(@PathVariable String id, @Valid @RequestBody NewReply in) {
    var res = mongo.updateFirst(query(where("_id").is(id)),
            new Update().push("replies", new Review.Reply(in.author(), in.text(), Instant.now())), Review.class);
    if (res.getMatchedCount() == 0) throw new NoSuchElementException("review " + id);
}
`);
const O2_INC = out(`
# 50 lượt bấm "hữu ích", 10 lượt cùng lúc:
$ seq 50 | xargs -P10 -I{} curl -s -o /dev/null -X POST localhost:8095/api/reviews/$ID/helpful-unsafe
helpful = 29          # lần chạy thứ hai: 27
$ seq 50 | xargs -P10 -I{} curl -s -o /dev/null -X POST localhost:8095/api/reviews/$ID/helpful
helpful = 50
$ curl -s -o /dev/null -w "%{http_code}" -X POST localhost:8095/api/reviews/$ID/replies -d '{"author":"Binh","text":"Same here"}'
201
$ curl … /api/reviews/6b0301f10500ec2125f19c00/replies      # id không tồn tại
404
`);
const C2_INJ = java(`
/** SAI: nhận Map ⇒ giá trị có thể là một OBJECT như {"$ne": ""} ⇒ MongoDB hiểu là TOÁN TỬ. */
@PostMapping("/reviews/{id}/edit-unsafe")
Map<String, Object> editUnsafe(@PathVariable String id, @RequestBody Map<String, Object> body) {
    var res = mongo.updateFirst(query(where("_id").is(id).and("editCode").is(body.get("editCode"))),
            new Update().set("text", body.get("text")), Review.class);
    return Map.of("matched", res.getMatchedCount(), "modified", res.getModifiedCount());
}

/** SAI: ghép chuỗi vào câu truy vấn JSON. */
@GetMapping("/reviews/by-author-unsafe")
List<ReviewView> byAuthorUnsafe(@RequestParam String author) {
    return mongo.find(new BasicQuery("{ author: '" + author + "' }"), Review.class).stream().map(ReviewView::of).toList();
}
`);
const O2_INJ = out(`
$ curl -s -X POST localhost:8095/api/reviews/$ID/edit-unsafe -d '{"editCode":"wrong","text":"hacked"}'
{"modified":0,"matched":0}
$ curl -s -X POST localhost:8095/api/reviews/$ID/edit-unsafe -d '{"editCode":{"$ne":""},"text":"Worst mic ever, do not borrow"}'
{"modified":1,"matched":1}
$ mongosh --eval "db.reviews.findOne({_id:ObjectId('$ID')}).text"
Worst mic ever, do not borrow
# ghép chuỗi: author = x', author: {$ne: 'x'}, $comment: '
#   ⇒ { author: 'x', author: {$ne: 'x'}, $comment: '' }   — khoá trùng, cái SAU thắng
$ curl -s -G localhost:8095/api/reviews/by-author-unsafe --data-urlencode "author=x', author: {\$ne: 'x'}, \$comment: '"
[{…"author":"An"…},{…"author":"Chi"…}]  [200]        # mọi đánh giá của mọi người
`);
const C2_FIX = java(`
record Edit(@NotBlank String editCode, @NotBlank @Size(max = 2000) String text) {}   // editCode là String, không phải Object

@PostMapping("/reviews/{id}/edit")
Map<String, Object> edit(@PathVariable String id, @Valid @RequestBody Edit in) { … cùng câu updateFirst … }

// trong ReviewRepository — ?0 được BIND như một giá trị, không ghép chuỗi
@Query("{ 'author': ?0 }")
List<Review> byAuthor(String author);
`);
const O2_FIX = out(`
$ curl -s -w " [%{http_code}]" -X POST localhost:8095/api/reviews/$ID/edit -d '{"editCode":{"$ne":""},"text":"x"}'
{"timestamp":"…","status":400,"error":"Bad Request","path":"/api/reviews/6b0301f10500ec2125f19c7a/edit"} [400]
# log: Cannot deserialize value of type \`java.lang.String\` from Object value (token \`JsonToken.START_OBJECT\`)
$ curl -s -G localhost:8095/api/reviews/by-author --data-urlencode "author=x', author: {\$ne: 'x'}, \$comment: '"
[] [200]
`);

const L2 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 20 · Spring Data MongoDB', 'Chương 20 · Spring Data MongoDB')}</span>
<h2>${T('20.2 — @Document, MongoRepository and MongoTemplate', '20.2 — @Document, MongoRepository và MongoTemplate')}</h2>
<p class="lead">${T(
  'Spring Data MongoDB looks deliberately like Spring Data JPA (lesson 6.2): an annotated class, a repository interface, derived query methods. The similarity is a trap as much as a help — there is no persistence context, no dirty checking, no lazy loading and no transaction around your method by default. This lesson builds the “gear reviews” service of the club and measures the two places where the JPA habit breaks: a property that Boot 4 renamed, and saving a whole document when you meant to change one number.',
  'Spring Data MongoDB cố ý trông giống Spring Data JPA (bài 6.2): một class có annotation, một interface repository, các hàm truy vấn suy ra từ tên. Sự giống nhau đó vừa giúp vừa là bẫy — không có persistence context, không dirty checking, không lazy loading và mặc định không có giao dịch quanh hàm của bạn. Bài này dựng dịch vụ “đánh giá thiết bị” của CLB và đo hai chỗ mà thói quen JPA gãy: một thuộc tính Boot 4 đã đổi tên, và lưu cả document khi bạn chỉ định đổi một con số.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'Ten club members tally “helpful” votes on a shared notebook page. If each one copies the page, adds one on their copy and glues the copy back, the last glue wins and most votes vanish. If instead each one walks up and adds a stroke to the counter on the page itself, nothing is lost. <code>save()</code> is gluing back a copy; <code>$inc</code> is the stroke on the page.',
  'Mười thành viên CLB cùng đếm phiếu “hữu ích” trên một trang sổ chung. Nếu mỗi người chép trang ra, cộng một trên bản chép rồi dán đè lên, thì lần dán cuối thắng và phần lớn phiếu biến mất. Còn nếu mỗi người bước tới gạch thêm một vạch ngay trên trang, không phiếu nào mất. <code>save()</code> là dán đè bản chép; <code>$inc</code> là gạch vạch trên chính trang sổ.')}</p>

<h3>${T('Set-up: one starter, one property — the right one', 'Cài đặt: một starter, một thuộc tính — đúng cái')}</h3>
${C2_POM}
${C2_YML}
<p>${T(
  'Spring Boot 4 moved the connection settings from <code>spring.data.mongodb.*</code> to <code>spring.mongodb.*</code> (only the Spring Data repository options stayed under <code>spring.data.mongodb</code>). Almost every tutorial online still shows the old name. What happens if you copy one:',
  'Spring Boot 4 chuyển cấu hình kết nối từ <code>spring.data.mongodb.*</code> sang <code>spring.mongodb.*</code> (chỉ các tuỳ chọn repository của Spring Data ở lại <code>spring.data.mongodb</code>). Gần như mọi tutorial trên mạng vẫn ghi tên cũ. Chép theo thì chuyện này xảy ra:')}</p>
${O2_URI}
<div class="pitfall co-tieu-de"><p><strong>${T('Trap — it starts fine and fails 30 seconds later.', 'Bẫy — khởi động ngon lành, 30 giây sau mới hỏng.')}</strong> ${T(
  'The unknown property is ignored silently, the driver falls back to <code>localhost:27017</code>, and because it connects lazily the app starts green. The first request waits for the 30-second server-selection timeout and returns 500. Two habits catch it in seconds: grep the log for the host:port actually used, and check <code>/actuator/health</code> — the <code>mongo</code> component said DOWN from the first second.',
  'Thuộc tính lạ bị bỏ qua im lặng, driver lùi về <code>localhost:27017</code>, và vì kết nối lười nên app khởi động xanh. Request đầu tiên chờ hết 30 giây chọn server rồi trả 500. Hai thói quen bắt được nó trong vài giây: grep log tìm host:port thật sự được dùng, và xem <code>/actuator/health</code> — thành phần <code>mongo</code> đã báo DOWN ngay từ giây đầu.')}</p></div>

<h3>${T('A record as the document, a repository for the easy queries', 'Record làm document, repository cho truy vấn dễ')}</h3>
${C2_DOC}
${C2_CTRL}
${O2_CRUD}
<p>${T(
  'What Spring wrote, field by field: a <code>String</code> id annotated <code>@Id</code> became an <code>ObjectId</code> (12 bytes, roughly time-ordered — the first 4 bytes are the creation second). <code>long gearId</code> was stored as <code>Long</code>, so mongosh queries must use <code>Long(7)</code>, not <code>7</code>, or they compare a different BSON type. <code>_class</code> is the type hint Spring adds for polymorphism; it costs a few dozen bytes per document and can be switched off when you never store subtypes. Validation is exactly the same Bean Validation as the REST chapters — MongoDB itself checked nothing.',
  'Spring đã ghi gì, từng trường: id kiểu <code>String</code> gắn <code>@Id</code> thành <code>ObjectId</code> (12 byte, gần như theo thời gian — 4 byte đầu là giây tạo). <code>long gearId</code> được lưu thành <code>Long</code>, nên truy vấn trong mongosh phải dùng <code>Long(7)</code> chứ không phải <code>7</code>, không thì so với một kiểu BSON khác. <code>_class</code> là gợi ý kiểu Spring thêm để hỗ trợ đa hình; tốn vài chục byte mỗi document và tắt được nếu bạn không bao giờ lưu lớp con. Validation y hệt Bean Validation ở các chương REST — bản thân MongoDB không kiểm gì cả.')}</p>
<p>${T(
  'Derived queries read like JPA: <code>findByGearIdAndRatingGreaterThanEqualOrderByCreatedAtDesc</code> becomes <code>{gearId: 7, rating: {$gte: 4}}</code> sorted by <code>createdAt</code>; <code>findByTagsContaining</code> matches inside the array. When the name grows past one line, switch to <code>@Query</code> or <code>MongoTemplate</code>.',
  'Derived query đọc như JPA: <code>findByGearIdAndRatingGreaterThanEqualOrderByCreatedAtDesc</code> thành <code>{gearId: 7, rating: {$gte: 4}}</code> sắp theo <code>createdAt</code>; <code>findByTagsContaining</code> khớp bên trong mảng. Khi tên hàm dài quá một dòng, chuyển sang <code>@Query</code> hoặc <code>MongoTemplate</code>.')}</p>

<h3>${T('save() replaces the whole document — measured lost updates', 'save() thay CẢ document — đo số phiếu bị mất')}</h3>
${C2_INC}
${O2_INC}
<p>${T(
  'Fifty clicks, twenty-one or twenty-three of them gone, and a different number each run — the same race as lesson 2.4, now across HTTP requests. <code>save()</code> sends the whole document it read earlier; whoever writes last erases the others’ increments. <code>$inc</code>, <code>$set</code> and <code>$push</code> are applied atomically by the server to the current document, so they cannot lose each other’s changes. In JPA you fixed this with <code>@Version</code> (lesson 7.4); Spring Data MongoDB supports <code>@Version</code> too, but for counters and appends a targeted update is simpler and faster than retrying.',
  'Năm mươi lần bấm, mất hai mươi mốt hoặc hai mươi ba phiếu, mỗi lần chạy một số khác — đúng cuộc tranh chấp của bài 2.4, giờ là giữa các request HTTP. <code>save()</code> gửi cả document đã đọc lúc trước; ai ghi sau cùng xoá phần cộng của người khác. <code>$inc</code>, <code>$set</code> và <code>$push</code> được server áp nguyên tử lên document hiện tại, nên không thể làm mất thay đổi của nhau. Ở JPA bạn sửa bằng <code>@Version</code> (bài 7.4); Spring Data MongoDB cũng hỗ trợ <code>@Version</code>, nhưng với bộ đếm và thêm phần tử thì một lệnh cập nhật đúng chỗ đơn giản và nhanh hơn thử lại.')}</p>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — NoSQL injection.', 'Góc hacker — NoSQL injection.')}</strong> ${T(
  'Guests edit their own review with the 8-character code they got at creation. Two endpoints written the “quick” way:',
  'Khách sửa bài của chính mình bằng mã 8 ký tự nhận lúc tạo. Hai endpoint viết kiểu “cho nhanh”:')}</p>
${C2_INJ}
${O2_INJ}
<p>${T(
  'No SQL anywhere, and still an injection. In the first one the attacker did not guess a code — they sent an <em>object</em>, <code>{"$ne": ""}</code>, which Spring passed through and MongoDB read as “edit code not equal to empty”: true for every review. In the second one quotes closed the string and added a second <code>author</code> condition; the JSON parser keeps the last duplicate key, so the filter became “author is not x”. The fixes are the same idea as SQL parameters: accept typed records (Jackson refuses an object where a <code>String</code> is declared) and bind values (<code>?0</code> in <code>@Query</code>, <code>Criteria.is()</code> with a String), never concatenate:',
  'Không có SQL nào, vẫn là injection. Ở endpoint đầu, kẻ tấn công không đoán mã — họ gửi một <em>object</em>, <code>{"$ne": ""}</code>, Spring chuyển nguyên xuống và MongoDB đọc thành “mã sửa khác rỗng”: đúng với mọi bài. Ở endpoint sau, dấu nháy đóng chuỗi và thêm điều kiện <code>author</code> thứ hai; bộ đọc JSON giữ khoá trùng cuối cùng, nên bộ lọc thành “tác giả khác x”. Cách vá cùng ý với tham số SQL: nhận record có kiểu (Jackson từ chối object ở chỗ khai báo <code>String</code>) và bind giá trị (<code>?0</code> trong <code>@Query</code>, <code>Criteria.is()</code> với String), không bao giờ ghép chuỗi:')}</p>
${C2_FIX}
${O2_FIX}
<p>${T('Same habit as lesson 10.1 (mass assignment): the DTO record is the allow-list. A <code>Map&lt;String, Object&gt;</code> body is an invitation.', 'Cùng thói quen với bài 10.1 (mass assignment): record DTO chính là danh sách cho phép. Body kiểu <code>Map&lt;String, Object&gt;</code> là lời mời gọi.')}</p></div>

<h3>${T('Repository or MongoTemplate?', 'Repository hay MongoTemplate?')}</h3>
<table>
<thead><tr><th>${T('Need', 'Cần')}</th><th>${T('Use', 'Dùng')}</th></tr></thead>
<tbody>
<tr><td>${T('CRUD, simple filters, paging', 'CRUD, lọc đơn giản, phân trang')}</td><td>MongoRepository + derived query</td></tr>
<tr><td>${T('A query too long for a method name', 'Truy vấn quá dài cho tên hàm')}</td><td>@Query("{ … ?0 … }")</td></tr>
<tr><td>${T('Partial or atomic updates ($inc, $set, $push, $pull)', 'Cập nhật một phần hoặc nguyên tử ($inc, $set, $push, $pull)')}</td><td>MongoTemplate.updateFirst / findAndModify</td></tr>
<tr><td>${T('Reports: group, count, average', 'Báo cáo: nhóm, đếm, trung bình')}</td><td>${T('MongoTemplate.aggregate (lesson 20.3)', 'MongoTemplate.aggregate (bài 20.3)')}</td></tr>
</tbody>
</table>

<h3>${T('🧪 Practice (30 minutes)', '🧪 Thực hành (30 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Add the starter to a fresh project, configure <code>spring.mongodb.uri</code>, and confirm in <code>/actuator/health</code> that <code>mongo</code> is UP. Then rename it to the Boot 3 spelling once and watch what the log says.', 'Thêm starter vào một dự án mới, cấu hình <code>spring.mongodb.uri</code>, và xác nhận trong <code>/actuator/health</code> rằng <code>mongo</code> UP. Rồi đổi một lần sang cách viết Boot 3 và xem log nói gì.')}</li>
<li>${T('Model one document-shaped feature of your topic as a record with one embedded list; write two derived queries.', 'Mô hình một tính năng dạng document của đề tài thành record có một danh sách nhúng; viết hai derived query.')}</li>
<li>${T('Write a counter both ways and fire 50 parallel requests with <code>xargs -P10</code>; record both totals.', 'Viết một bộ đếm theo cả hai cách và bắn 50 request song song bằng <code>xargs -P10</code>; ghi lại cả hai tổng.')}</li>
<li>${T('Send <code>{"$ne": ""}</code> to every endpoint of yours that filters by a value from the body.', 'Gửi <code>{"$ne": ""}</code> tới mọi endpoint của bạn có lọc theo giá trị lấy từ body.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('the atomic counter shows exactly 50, and every operator payload gets 400 (typed record) or matches nothing — and SECURITY.md has one row for NoSQL injection.', 'bộ đếm nguyên tử ra đúng 50, và mọi payload toán tử đều nhận 400 (record có kiểu) hoặc không khớp gì — và SECURITY.md có một dòng cho NoSQL injection.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“MongoRepository vs MongoTemplate?”', '“MongoRepository khác MongoTemplate thế nào?”')}</strong> — ${T('Repository: generated CRUD and derived queries, quick to write. Template: full control — partial atomic updates, upserts, aggregation, bulk operations.', 'Repository: CRUD và derived query sinh sẵn, viết nhanh. Template: toàn quyền — cập nhật nguyên tử một phần, upsert, aggregation, thao tác hàng loạt.')}</li>
<li><strong>${T('“Can there be injection in MongoDB?”', '“MongoDB có bị injection không?”')}</strong> — ${T('Yes: operator injection when untyped input reaches a filter (<code>{"$ne": …}</code>, <code>$where</code>), and string-built JSON queries. Defend with typed DTOs and bound parameters.', 'Có: chèn toán tử khi dữ liệu không có kiểu đi vào bộ lọc (<code>{"$ne": …}</code>, <code>$where</code>), và truy vấn JSON ghép chuỗi. Phòng bằng DTO có kiểu và tham số bind.')}</li>
<li><strong>${T('“How do you increment a counter safely?”', '“Tăng một bộ đếm thế nào cho an toàn?”')}</strong> — ${T('A server-side <code>$inc</code> (atomic per document), or optimistic locking with <code>@Version</code> plus retry when the whole document must change.', 'Dùng <code>$inc</code> ở phía server (nguyên tử trong một document), hoặc khoá lạc quan <code>@Version</code> kèm thử lại khi phải đổi cả document.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@Document</span><span class="v">${T('Maps a class or record to a collection.', 'Ánh xạ class hoặc record vào một collection.')}</span></div>
  <div class="kv"><span class="k">ObjectId</span><span class="v">${T('12-byte default id; starts with the creation time.', 'Id mặc định 12 byte; bắt đầu bằng thời điểm tạo.')}</span></div>
  <div class="kv"><span class="k">_class</span><span class="v">${T('Type hint written by Spring Data for polymorphic reads.', 'Gợi ý kiểu do Spring Data ghi để đọc đa hình.')}</span></div>
  <div class="kv"><span class="k">$inc / $push</span><span class="v">${T('Atomic update operators applied on the server.', 'Toán tử cập nhật nguyên tử thực hiện ở server.')}</span></div>
  <div class="kv"><span class="k">${T('Operator injection', 'Chèn toán tử')}</span><span class="v">${T('Attacker sends {"$ne": …} where a plain value was expected.', 'Kẻ tấn công gửi {"$ne": …} ở chỗ đáng lẽ là giá trị thường.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('Boot 4: spring.mongodb.uri. The old spring.data.mongodb.uri is ignored and the app fails 30 s later on localhost:27017.', 'Boot 4: spring.mongodb.uri. Tên cũ spring.data.mongodb.uri bị bỏ qua và app hỏng 30 giây sau ở localhost:27017.')}</li>
<li>${T('Records work as documents; derived queries read like JPA; Bean Validation still guards the input.', 'Record dùng làm document được; derived query đọc như JPA; Bean Validation vẫn gác đầu vào.')}</li>
<li>${T('save() writes the whole document: concurrent read-modify-write lost 21 of 50 votes; $inc lost none.', 'save() ghi cả document: đọc–sửa–ghi song song mất 21/50 phiếu; $inc không mất phiếu nào.')}</li>
<li>${T('Typed DTOs and bound parameters stop NoSQL injection; Map bodies and concatenated JSON do not.', 'DTO có kiểu và tham số bind chặn NoSQL injection; body Map và JSON ghép chuỗi thì không.')}</li>
</ul>
${tl('https://docs.spring.io/spring-data/mongodb/reference/', '🍃', 'Spring Data MongoDB — Reference', T('Repositories, MongoTemplate, mapping, @Query', 'Repository, MongoTemplate, ánh xạ, @Query'))}
${tl('https://docs.spring.io/spring-boot/reference/data/nosql.html#data.nosql.mongodb', '📘', 'Spring Boot reference — MongoDB', T('spring.mongodb.* properties and auto-configuration', 'Thuộc tính spring.mongodb.* và auto-configuration'))}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html', '🛡️', 'OWASP — Injection Prevention Cheat Sheet', T('Why typed input and parameter binding beat escaping', 'Vì sao dữ liệu có kiểu và bind tham số tốt hơn thoát ký tự'))}
</div>
`; };

/* ═════════════ 20.3 — Truy vấn, chỉ mục, aggregation ═════════════ */
const C3_EXPLAIN = js(`
const q = () => db.reviews.find({ gearId: Long(42), rating: { $gte: 4 } }).sort({ createdAt: -1 }).limit(20);
q().explain('executionStats');                                   // 1. chưa có chỉ mục
db.reviews.createIndex({ gearId: 1, rating: 1, createdAt: -1 });  // 2. thứ tự "theo bộ lọc"
db.reviews.createIndex({ gearId: 1, createdAt: -1, rating: 1 });  // 3. thứ tự ESR
`);
const O3_EXPLAIN = out(`
# 200.002 đánh giá, 500 thiết bị, thiết bị 42 có 400 đánh giá
no index                           returned=20 keys=0   docs=200002 ms=46  plan: SORT <- COLLSCAN
{gearId, rating, createdAt}        returned=20 keys=160 docs=20     ms=1   plan: FETCH <- SORT <- IXSCAN(gear_rating_created)
{gearId, createdAt, rating} (ESR)  returned=20 keys=48  docs=20     ms=1   plan: LIMIT <- FETCH <- IXSCAN(gear_created_rating)
`);
const C3_IDX = java(`
/** Tạo chỉ mục TƯỜNG MINH lúc khởi động (idempotent: chỉ mục có rồi thì MongoDB bỏ qua). */
@Configuration
class IndexSetup {
    @Bean
    ApplicationRunner createIndexes(MongoTemplate mongo) {
        return args -> {
            var reviews = mongo.indexOps(Review.class);
            // ESR: Equality (gearId) → Sort (createdAt) → Range (rating)
            reviews.createIndex(new CompoundIndexDefinition(
                    new Document("gearId", 1).append("createdAt", -1).append("rating", 1)).named("gear_created_rating"));
            reviews.createIndex(new Index("author", Sort.Direction.ASC).named("author_1"));
            mongo.indexOps("review_drafts").createIndex(
                    new Index("createdAt", Sort.Direction.ASC).expire(Duration.ofSeconds(30)).named("drafts_ttl"));
        };
    }
}
`);
const O3_IDX = out(`
$ mongosh gearreview --eval 'db.reviews.getIndexes().map(i => i.name + " " + JSON.stringify(i.key)).join("\\n")'
_id_ {"_id":1}
gear_created_rating {"gearId":1,"createdAt":-1,"rating":1}
author_1 {"author":1}
`);
const O3_TTL = out(`
# bản nháp đánh giá tự xoá sau 30 giây (bài học hạ ttlMonitorSleepSecs xuống 5; mặc định 60)
14:56:38 drafts=1
14:56:43 drafts=1
…
14:57:03 drafts=1
14:57:08 drafts=0
14:57:13 drafts=0
`);
const C3_AGG = java(`
record GearScore(long gearId, double avgRating, long reviews) {}

/** Top thiết bị được đánh giá tốt trong N ngày gần đây, chỉ tính thiết bị có ít nhất min đánh giá. */
@GetMapping("/api/stats/top-gear")
List<GearScore> top(@RequestParam(defaultValue = "30") int days, @RequestParam(defaultValue = "20") int min) {
    var agg = newAggregation(
            match(where("createdAt").gte(Instant.now().minus(days, ChronoUnit.DAYS))),   // lọc TRƯỚC: dùng được chỉ mục
            group("gearId").avg("rating").as("avgRating").count().as("reviews"),
            match(where("reviews").gte(min)),                                               // như HAVING của SQL
            sort(Sort.by(Sort.Direction.DESC, "avgRating")),
            limit(5),
            project("avgRating", "reviews").and("_id").as("gearId"));
    return mongo.aggregate(agg, "reviews", GearScore.class).getMappedResults();
}
`);
const O3_AGG = out(`
$ curl -s -w "  [%{time_total}s]" "localhost:8095/api/stats/top-gear?days=30&min=20"
[{"gearId":405,"avgRating":3.0234375,"reviews":128},{"gearId":495,"avgRating":3.0234375,"reviews":128},{"gearId":315,"avgRating":3.0234375,"reviews":128},{"gearId":225,"avgRating":3.0234375,"reviews":128},{"gearId":135,"avgRating":3.0234375,"reviews":128}]  [0.120229s]
`);
const O3_PAGE = out(`
# thiết bị 42, trang 19 (20 dòng/trang)
skip(360).limit(20)                returned=20 keys=380    docs=20 ms=0   plan: LIMIT <- FETCH <- SKIP <- IXSCAN(gear_created_rating)
createdAt < last seen (keyset)     returned=20 keys=20     docs=20 ms=0   plan: LIMIT <- FETCH <- IXSCAN(gear_created_rating)
# cả collection, trang 9001
skip(180000) no filter             returned=20 keys=180020 docs=20 ms=57  plan: LIMIT <- FETCH <- SKIP <- IXSCAN(_id_)
# trần cỡ trang ở controller: Math.min(size, 50)
$ curl -s "localhost:8095/api/gear/42/reviews/page?size=1000000"
… "size":50 "totalElements":400 "totalPages":8
`);
const C3_REGEX = java(`
/** SAI: biểu thức chính quy do người dùng gửi, không neo, không thoát ký tự. */
@GetMapping("/reviews/search-unsafe")
List<ReviewView> searchUnsafe(@RequestParam String q) {
    return mongo.find(query(where("text").regex(q)).limit(20), Review.class).stream().map(ReviewView::of).toList();
}

/** ĐÚNG: tìm theo TIỀN TỐ tên tác giả, thoát mọi ký tự đặc biệt ⇒ dùng được chỉ mục author_1. */
@GetMapping("/reviews/search")
List<ReviewView> search(@RequestParam @Size(min = 2, max = 40) String q) {
    return mongo.find(query(where("author").regex("^" + Pattern.quote(q))).limit(20), Review.class)
            .stream().map(ReviewView::of).toList();
}
`);
const O3_REGEX = out(`
$ mongosh: find({author: /^Lan/}).limit(20)      keys=20     docs=20
$ mongosh: find({author: /Lan/}).limit(20)       keys=93358  docs=20         # không neo: duyệt gần nửa chỉ mục
$ mongosh: find({text: /(x+x+)+y/})              docs=200002 ms=72            # không khớp gì ⇒ đọc HẾT collection
# 200 request, 20 song song:
search-unsafe?q=(x+x+)+y   2.815 s tổng
search?q=Lan               0.751 s tổng
$ curl -s -G localhost:8095/api/reviews/search-unsafe --data-urlencode "q=.*"
[… 20 đánh giá bất kỳ …]                                                    # ".*" khớp mọi thứ
`);

const L3 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 20 · Spring Data MongoDB', 'Chương 20 · Spring Data MongoDB')}</span>
<h2>${T('20.3 — Queries, indexes and aggregation', '20.3 — Truy vấn, chỉ mục và aggregation')}</h2>
<p class="lead">${T(
  'With two documents every query is fast. With two hundred thousand, the same query either reads 48 index keys or the whole collection, and the only way to know which is <code>explain()</code>. This lesson seeds 200,002 reviews and measures: an index in the wrong field order, the ESR rule, a TTL index that deletes data by itself, an aggregation report, skip-based paging that slows down page after page, and a search box that lets users run their own regular expressions.',
  'Với hai document thì truy vấn nào cũng nhanh. Với hai trăm nghìn, cùng một truy vấn hoặc đọc 48 khoá chỉ mục, hoặc đọc cả collection, và cách duy nhất để biết là <code>explain()</code>. Bài này đổ 200.002 đánh giá rồi đo: một chỉ mục sai thứ tự trường, quy tắc ESR, chỉ mục TTL tự xoá dữ liệu, một báo cáo aggregation, phân trang bằng skip chậm dần qua từng trang, và ô tìm kiếm cho người dùng tự chạy biểu thức chính quy.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'A phone book sorted by <em>city, then surname</em> answers “Lê in Đà Nẵng” instantly. Sorted by <em>surname, then city</em>, you can still find the Lês, but then you must re-sort them by city in your head. A compound index is that book: the order of fields decides which questions it answers without extra work.',
  'Một danh bạ sắp theo <em>thành phố rồi họ</em> trả lời “họ Lê ở Đà Nẵng” ngay lập tức. Sắp theo <em>họ rồi thành phố</em> thì vẫn tìm được họ Lê, nhưng sau đó phải tự sắp lại theo thành phố trong đầu. Chỉ mục kép chính là cuốn danh bạ đó: thứ tự các trường quyết định nó trả lời được câu nào mà không phải làm thêm.')}</p>

<h3>${T('Reading explain(): three runs of one query', 'Đọc explain(): một truy vấn, ba lần chạy')}</h3>
<p>${T('“The newest 20 reviews of gear 42 with at least 4 stars” — the query behind the gear page:', '“20 đánh giá mới nhất của thiết bị 42 có từ 4 sao” — truy vấn đứng sau trang thiết bị:')}</p>
${C3_EXPLAIN}
${O3_EXPLAIN}
<ul>
<li>${T('<strong>COLLSCAN + SORT</strong>: 200,002 documents read and sorted in memory to return 20. Fine on a laptop today; a timeout when the collection is ten times bigger and twenty users open the page.', '<strong>COLLSCAN + SORT</strong>: đọc 200.002 document và sắp trong bộ nhớ để trả 20. Hôm nay trên laptop thì ổn; thành timeout khi collection lớn gấp mười và hai mươi người cùng mở trang.')}</li>
<li>${T('<strong>{gearId, rating, createdAt}</strong> matches the filter, but the rating range splits the index into one block per rating value, so results are not in date order: there is still a <code>SORT</code> stage, over 160 keys.', '<strong>{gearId, rating, createdAt}</strong> khớp bộ lọc, nhưng khoảng rating chia chỉ mục thành từng khối theo giá trị rating, nên kết quả không theo thứ tự ngày: vẫn còn bước <code>SORT</code>, trên 160 khoá.')}</li>
<li>${T('<strong>ESR — Equality, Sort, Range</strong>: <code>{gearId, createdAt, rating}</code> walks gear 42 newest-first and filters rating on the way, stopping after 20 hits — 48 keys, no SORT stage.', '<strong>ESR — Equality, Sort, Range</strong>: <code>{gearId, createdAt, rating}</code> đi dọc thiết bị 42 từ mới tới cũ, lọc rating trên đường đi, dừng khi đủ 20 — 48 khoá, không có bước SORT.')}</li>
</ul>
<p>${T('The three numbers to read every time: <code>totalDocsExamined</code> close to <code>nReturned</code>, no <code>COLLSCAN</code>, no in-memory <code>SORT</code> on a big result.', 'Ba con số phải đọc mỗi lần: <code>totalDocsExamined</code> gần bằng <code>nReturned</code>, không có <code>COLLSCAN</code>, không có <code>SORT</code> trong bộ nhớ trên tập kết quả lớn.')}</p>

<h3>${T('Indexes from Spring, explicitly', 'Tạo chỉ mục từ Spring, một cách tường minh')}</h3>
${C3_IDX}
${O3_IDX}
<p>${T(
  '<code>@Indexed</code> and <code>@CompoundIndex</code> on the document class exist too, but Spring Data only creates them when automatic index creation is switched on — it is off by default because building an index on a large production collection at start-up can stall the app. Creating them in a runner (or in a migration script run by your deploy) keeps the decision visible. Note the TTL index on <code>review_drafts</code>:',
  '<code>@Indexed</code> và <code>@CompoundIndex</code> trên class document cũng có, nhưng Spring Data chỉ tạo chúng khi bật tự tạo chỉ mục — mặc định tắt, vì dựng chỉ mục trên một collection production lớn lúc khởi động có thể làm app đứng. Tạo trong một runner (hoặc trong script migration do bước deploy chạy) giữ quyết định đó trong tầm mắt. Để ý chỉ mục TTL trên <code>review_drafts</code>:')}</p>
${O3_TTL}
<p>${T(
  'A TTL index deletes documents whose date field is older than <code>expireAfterSeconds</code>. The background monitor runs every 60 seconds, so “30 seconds” means “30 to 90 seconds”. Good for drafts, one-time codes, rate-limit buckets, idempotency keys; never rely on it for exact timing — check the date in the query too if it must be exact.',
  'Chỉ mục TTL xoá document có trường ngày cũ hơn <code>expireAfterSeconds</code>. Tiến trình nền chạy mỗi 60 giây, nên “30 giây” nghĩa là “30 tới 90 giây”. Hợp cho bản nháp, mã dùng một lần, bộ đếm giới hạn tần suất, khoá idempotency; đừng bao giờ dựa vào nó cho mốc giờ chính xác — nếu phải chính xác thì kiểm cả ngày trong truy vấn.')}</p>

<h3>${T('Aggregation: the report the SQL chapters wrote with GROUP BY', 'Aggregation: báo cáo mà các chương SQL viết bằng GROUP BY')}</h3>
${C3_AGG}
${O3_AGG}
<p>${T(
  'A pipeline is a list of stages, each receiving the previous stage’s output: <code>$match</code> = WHERE, <code>$group</code> = GROUP BY, a second <code>$match</code> = HAVING, then <code>$sort</code>, <code>$limit</code>, <code>$project</code>. Put the selective <code>$match</code> first — only the first stages can use an index; after <code>$group</code> everything is in memory. The projection renames <code>_id</code> to <code>gearId</code> so the result maps straight into a record.',
  'Pipeline là danh sách các bước, mỗi bước nhận đầu ra của bước trước: <code>$match</code> = WHERE, <code>$group</code> = GROUP BY, <code>$match</code> thứ hai = HAVING, rồi <code>$sort</code>, <code>$limit</code>, <code>$project</code>. Đặt <code>$match</code> có tính chọn lọc lên đầu — chỉ các bước đầu dùng được chỉ mục; sau <code>$group</code> mọi thứ nằm trong bộ nhớ. Bước projection đổi tên <code>_id</code> thành <code>gearId</code> để kết quả ánh xạ thẳng vào record.')}</p>

<h3>${T('Paging: skip gets slower, keyset does not', 'Phân trang: skip chậm dần, keyset thì không')}</h3>
${O3_PAGE}
<p>${T(
  '<code>skip(n)</code> still walks the n skipped keys: 380 keys for page 19, 180,020 for page 9,001 (57 ms, growing linearly). Keyset paging — “give me 20 older than the last <code>createdAt</code> I saw” — reads 20 keys on every page. Use page numbers for small admin lists and keyset (“load more”, infinite scroll) for feeds. Whatever you choose, cap the page size in the controller: <code>?size=1000000</code> is the cheapest denial-of-service there is.',
  '<code>skip(n)</code> vẫn đi qua n khoá bị bỏ: 380 khoá cho trang 19, 180.020 cho trang 9.001 (57 ms, tăng tuyến tính). Phân trang keyset — “cho tôi 20 bài cũ hơn <code>createdAt</code> cuối cùng tôi thấy” — đọc 20 khoá ở mọi trang. Dùng số trang cho danh sách quản trị nhỏ, keyset (“tải thêm”, cuộn vô tận) cho bảng tin. Chọn cách nào cũng phải đặt trần cỡ trang ở controller: <code>?size=1000000</code> là kiểu từ chối dịch vụ rẻ nhất.')}</p>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — the search box that runs the attacker’s regex.', 'Góc hacker — ô tìm kiếm chạy regex của kẻ tấn công.')}</strong> ${T(
  'Passing user input to <code>regex()</code> hands them a query language:',
  'Đưa dữ liệu người dùng thẳng vào <code>regex()</code> là trao cho họ cả một ngôn ngữ truy vấn:')}</p>
${C3_REGEX}
${O3_REGEX}
<p>${T(
  'Three problems in one line. <code>.*</code> returns everything (data the UI never meant to list). A pattern that matches nothing forces a scan of every document — 200,002 reads per request, and 200 such requests took almost four times as long as the safe search; pick a heavier pattern on longer text and one client can keep the database busy. And an unanchored regex cannot use an index efficiently (93,358 keys for <code>/Lan/</code>). The fix: decide what search means (here: author name prefix), anchor it with <code>^</code>, escape input with <code>Pattern.quote</code>, limit its length. Real full-text search needs a text index or a search engine, not regex.',
  'Ba vấn đề trong một dòng. <code>.*</code> trả về mọi thứ (dữ liệu mà giao diện không định liệt kê). Một mẫu không khớp gì buộc đọc mọi document — 200.002 lượt đọc mỗi request, và 200 request như vậy mất gần gấp bốn lần tìm kiếm an toàn; chọn mẫu nặng hơn trên chữ dài hơn thì một client giữ CSDL bận được. Và regex không neo không dùng chỉ mục hiệu quả (93.358 khoá cho <code>/Lan/</code>). Cách vá: quyết định tìm kiếm nghĩa là gì (ở đây: tiền tố tên tác giả), neo bằng <code>^</code>, thoát dữ liệu bằng <code>Pattern.quote</code>, giới hạn độ dài. Tìm kiếm toàn văn thật thì cần text index hoặc search engine, không phải regex.')}</p></div>

<h3>${T('🧪 Practice (30 minutes)', '🧪 Thực hành (30 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Seed 100,000 documents of your feature with a mongosh loop (insertMany in batches of 10,000).', 'Đổ 100.000 document của tính năng bạn bằng vòng lặp mongosh (insertMany từng lô 10.000).')}</li>
<li>${T('Pick the query your main screen runs; record <code>explain("executionStats")</code> with no index, with your first guess, and with the ESR order.', 'Chọn truy vấn mà màn hình chính chạy; ghi <code>explain("executionStats")</code> khi chưa có chỉ mục, với chỉ mục bạn đoán đầu tiên, và với thứ tự ESR.')}</li>
<li>${T('Write one aggregation report endpoint and one keyset “load more” endpoint with a page-size cap.', 'Viết một endpoint báo cáo aggregation và một endpoint “tải thêm” kiểu keyset có trần cỡ trang.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('the main query shows IXSCAN with docs examined ≤ 2 × returned and no SORT stage, and your search endpoint returns 400 or nothing for <code>.*</code>.', 'truy vấn chính hiện IXSCAN, số document đã đọc ≤ 2 × số trả về, không có bước SORT, và endpoint tìm kiếm trả 400 hoặc không gì cho <code>.*</code>.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“How do you choose the field order of a compound index?”', '“Chọn thứ tự trường của chỉ mục kép thế nào?”')}</strong> — ${T('ESR: equality fields first, then the sort field, then range fields; confirm with explain (no SORT stage, keys close to returned).', 'ESR: trường so bằng trước, rồi trường sắp xếp, rồi trường khoảng; xác nhận bằng explain (không có SORT, số khoá gần số trả về).')}</li>
<li><strong>${T('“Why is deep pagination slow?”', '“Vì sao phân trang sâu chậm?”')}</strong> — ${T('skip still traverses the skipped entries; use keyset/cursor pagination on an indexed, unique-enough sort key.', 'skip vẫn duyệt qua các mục bị bỏ; dùng phân trang keyset/cursor trên khoá sắp xếp có chỉ mục và đủ duy nhất.')}</li>
<li><strong>${T('“What is a TTL index and its caveat?”', '“TTL index là gì và có điểm gì cần lưu ý?”')}</strong> — ${T('An index that expires documents after a time; deletion runs about once a minute, so expiry is not exact.', 'Chỉ mục làm document hết hạn sau một khoảng thời gian; việc xoá chạy khoảng mỗi phút một lần, nên không chính xác tới giây.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">COLLSCAN / IXSCAN</span><span class="v">${T('Full collection scan vs index scan in explain().', 'Quét cả collection và quét chỉ mục trong explain().')}</span></div>
  <div class="kv"><span class="k">ESR</span><span class="v">${T('Equality → Sort → Range: compound index field order.', 'Equality → Sort → Range: thứ tự trường của chỉ mục kép.')}</span></div>
  <div class="kv"><span class="k">TTL index</span><span class="v">${T('Deletes documents older than expireAfterSeconds.', 'Xoá document cũ hơn expireAfterSeconds.')}</span></div>
  <div class="kv"><span class="k">Pipeline</span><span class="v">${T('Ordered aggregation stages: $match, $group, $sort, $project…', 'Chuỗi bước aggregation có thứ tự: $match, $group, $sort, $project…')}</span></div>
  <div class="kv"><span class="k">Keyset paging</span><span class="v">${T('“After the last value seen” instead of skip.', '“Sau giá trị cuối đã thấy” thay vì skip.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('explain("executionStats") is the truth: 200,002 docs read without an index, 48 keys with the ESR index.', 'explain("executionStats") là sự thật: không chỉ mục đọc 200.002 document, chỉ mục ESR đọc 48 khoá.')}</li>
<li>${T('Create indexes explicitly; TTL indexes clean up by themselves, roughly once a minute.', 'Tạo chỉ mục tường minh; chỉ mục TTL tự dọn, khoảng mỗi phút một lần.')}</li>
<li>${T('Aggregation = WHERE/GROUP BY/HAVING as stages; filter first.', 'Aggregation = WHERE/GROUP BY/HAVING dưới dạng các bước; lọc trước tiên.')}</li>
<li>${T('skip grows linearly; keyset stays flat; always cap page size.', 'skip tăng tuyến tính; keyset đứng yên; luôn đặt trần cỡ trang.')}</li>
<li>${T('Never pass raw user input to regex(): anchor, quote, limit.', 'Không bao giờ đưa dữ liệu thô vào regex(): neo, thoát, giới hạn.')}</li>
</ul>
${tl('https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/', '📘', 'MongoDB Manual — The ESR guideline', T('Equality, Sort, Range for compound indexes', 'Equality, Sort, Range cho chỉ mục kép'))}
${tl('https://www.mongodb.com/docs/manual/core/aggregation-pipeline/', '📘', 'MongoDB Manual — Aggregation pipeline', T('Stages, optimisation, limits', 'Các bước, tối ưu, giới hạn'))}
</div>
`; };

/* ═════════════ 20.4 — MongoDB bên cạnh PostgreSQL ═════════════ */
const C4_LISTENER = java(`
// LoanService (JPA, PostgreSQL) — trong @Transactional, sau khi lưu lượt mượn:
events.publishEvent(new LoanCreated(loan.getId(), gear.getId(), memberId, loan.getDueAt()));

// audit/LoanAuditListener.java — ghi MongoDB SAU khi giao dịch SQL đã commit
@Component
class LoanAuditListener {
    private final LoanEventRepository events;
    LoanAuditListener(LoanEventRepository events) { this.events = events; }

    @Async
    @TransactionalEventListener                     // mặc định AFTER_COMMIT: rollback thì không ghi
    void on(LoanCreated e) {
        events.save(new LoanEvent(null, "LOAN_CREATED", e.loanId(), Instant.now(),
                Map.of("gearId", e.gearId(), "memberId", e.memberId(), "dueAt", e.dueAt().toString())));
        log.info("audit saved for loan {} on thread {}", e.loanId(), Thread.currentThread().getName());
    }
}

@Document("loan_events")
public record LoanEvent(@Id String id, String type, long loanId, Instant at, Map<String, Object> data) {}
`);
const O4_OK = out(`
events before: 0
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $AN" -d '{"gearId":2,"days":2}'
{"id":1,"gearId":2,"gearName":"Rode VideoMic","memberId":1,"memberName":"An",…,"status":"ACTIVE"} [201]
events: 1
c.e.gearloan.audit.LoanAuditListener     : audit saved for loan 1 on thread task-1
# cùng món đó lần nữa: luật nghiệp vụ hỏng, giao dịch SQL rollback
{"detail":"Gear 2 is LOANED","instance":"/api/loans","status":409,"title":"Conflict"} [409]
events: 1
`);
const O4_DOWN = out(`
$ docker stop ch20-mongo
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $AN" -d '{"gearId":4,"days":2}'
{"id":2,"gearId":4,"gearName":"Zoom H1n",…,"status":"ACTIVE"} [201]          # thao tác chính vẫn chạy
$ curl -s localhost:8090/actuator/health
{"components":{"db":{"status":"UP"},…,"mongo":{"status":"DOWN"},…,"redis":{"status":"UP"},…},"status":"DOWN"} [503]
$ curl -s localhost:8090/actuator/health/readiness
{"status":"UP"} [200]
# 30 giây sau, trên luồng async:
[task-2] .a.i.SimpleAsyncUncaughtExceptionHandler : Unexpected exception occurred invoking async method: void com.example.gearloan.audit.LoanAuditListener.on(…LoanCreated)
MongoTimeoutException: Timed out while waiting for a server that matches WritableServerSelector
$ docker start ch20-mongo
$ mongosh gearloan --eval 'db.loan_events.find({},{_id:0,loanId:1,type:1})'
[ { type: 'LOAN_CREATED', loanId: Long('1') } ]          # lượt mượn 2 KHÔNG có sự kiện — mất hẳn
$ psql -c "select id, gear_id, member_id from loan"
  1 |       2 |         1
  2 |       4 |         1
`);
const C4_TEST = java(`
@DataMongoTest                       // chỉ dựng lát cắt MongoDB: repository + MongoTemplate, không web
@Testcontainers
class ReviewRepositoryTest {
    @Container @ServiceConnection   // Boot tự lấy URI của container ⇒ không cần spring.mongodb.uri trong test
    static MongoDBContainer mongo = new MongoDBContainer(System.getProperty("mongo.image", "mongo:7"));

    @Autowired ReviewRepository reviews;
    @Autowired MongoTemplate template;

    @Test
    void derivedQueryFiltersAndSorts() {
        reviews.saveAll(List.of(review(7, "An", 5), review(7, "Chi", 2), review(8, "Binh", 5)));
        assertThat(reviews.findByGearIdAndRatingGreaterThanEqualOrderByCreatedAtDesc(7, 4))
                .extracting(Review::author).containsExactly("An");
    }

    @Test
    void incrementIsAtomicUnderConcurrency() throws Exception {
        var id = reviews.save(review(9, "Dung", 4)).id();
        try (var pool = Executors.newFixedThreadPool(10)) {
            IntStream.range(0, 50).forEach(i -> pool.submit(() ->
                    template.updateFirst(query(where("_id").is(id)), new Update().inc("helpful", 1), Review.class)));
        }
        assertThat(reviews.findById(id).orElseThrow().helpful()).isEqualTo(50);
    }
}
`);
const O4_TEST = out(`
# start.spring.io sinh sẵn new MongoDBContainer("mongo:latest") — trên máy này:
$ mvn test -Dmongo.image=mongo:latest
22:02:52.555 [main] INFO tc.mongo:latest -- Container mongo:latest started in PT0.669986S
Caused by: java.lang.IllegalStateException: MongoDBContainer should be started first
[ERROR] Tests run: 2, Failures: 0, Errors: 2, Skipped: 0
# nguyên nhân thật, đọc log của chính container:
$ docker run -d --name ch20-m8 mongo:latest && docker logs ch20-m8
"msg":"MongoDB cannot start: Linux kernel versions 6.19.0 through 7.0.13 have a known incompatibility with this version of MongoDB. See https://jira.mongodb.org/browse/SERVER-121912 for more information."
$ docker info --format '{{.KernelVersion}}'
7.0.12-linuxkit
# ghim phiên bản:
$ mvn test
22:04:05.865 [main] INFO tc.mongo:7 -- Container mongo:7 started in PT0.932606S
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 3.261 s -- in com.example.gearreview.review.ReviewRepositoryTest
[INFO] BUILD SUCCESS
`);

const L4 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 20 · Spring Data MongoDB', 'Chương 20 · Spring Data MongoDB')}</span>
<h2>${T('20.4 — MongoDB next to PostgreSQL in one app', '20.4 — MongoDB bên cạnh PostgreSQL trong một app')}</h2>
<p class="lead">${T(
  'Real systems rarely pick one database. The club app keeps loans in PostgreSQL — they need constraints and transactions — and writes an audit trail of loan events to MongoDB, where each event type carries different data. Two databases mean two things that can fail independently, and no transaction that spans both. This lesson measures what that costs: an event written after commit, an event correctly not written after rollback, and an event silently lost when MongoDB was down. Then it pins a test container that refused to start.',
  'Hệ thống thật hiếm khi chỉ chọn một CSDL. App CLB giữ lượt mượn ở PostgreSQL — chúng cần ràng buộc và giao dịch — và ghi nhật ký sự kiện lượt mượn vào MongoDB, nơi mỗi loại sự kiện mang dữ liệu khác nhau. Hai CSDL nghĩa là hai thứ có thể hỏng độc lập, và không có giao dịch nào trùm cả hai. Bài này đo cái giá đó: một sự kiện được ghi sau commit, một sự kiện đúng ra không được ghi sau rollback, và một sự kiện mất lặng lẽ khi MongoDB sập. Sau đó ghim phiên bản một test container từng không chịu khởi động.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'The club treasurer writes a loan in the official ledger, then tells the secretary to note it in the activity diary. If the loan is cancelled before the ledger is signed, the secretary must not write anything. If the secretary is out sick when the message arrives, the ledger is still right — but the diary will have a gap unless someone keeps a list of messages to deliver later.',
  'Thủ quỹ CLB ghi lượt mượn vào sổ chính thức, rồi nhắn thư ký ghi vào nhật ký hoạt động. Nếu lượt mượn bị huỷ trước khi sổ được ký, thư ký không được ghi gì. Nếu thư ký nghỉ ốm đúng lúc tin nhắn tới, sổ chính vẫn đúng — nhưng nhật ký sẽ thủng một chỗ, trừ khi có ai giữ danh sách tin nhắn để chuyển lại sau.')}</p>

<h3>${T('Write after commit, off the request thread', 'Ghi sau commit, ngoài luồng request')}</h3>
${C4_LISTENER}
${O4_OK}
<p>${T(
  'Three design choices, each visible in the output. <code>@TransactionalEventListener</code> waits for the SQL commit, so the 409 (rolled back) produced no event — a plain <code>@EventListener</code> would have written an event for a loan that never existed (lesson 14.3 measures that). <code>@Async</code> moves the MongoDB write to <code>task-1</code>, so the HTTP response does not wait for a second database. And the document references <code>loanId</code>, <code>gearId</code>, <code>memberId</code> as plain numbers — nothing checks them, which is fine for an append-only log.',
  'Ba lựa chọn thiết kế, cái nào cũng thấy trong output. <code>@TransactionalEventListener</code> chờ SQL commit, nên lỗi 409 (đã rollback) không sinh sự kiện — một <code>@EventListener</code> thường sẽ ghi sự kiện cho một lượt mượn không hề tồn tại (bài 14.3 đo việc đó). <code>@Async</code> đẩy việc ghi MongoDB sang <code>task-1</code>, nên phản hồi HTTP không phải chờ CSDL thứ hai. Và document tham chiếu <code>loanId</code>, <code>gearId</code>, <code>memberId</code> như số thường — không ai kiểm chúng, điều đó ổn với một nhật ký chỉ ghi thêm.')}</p>

<h3>${T('Stop MongoDB: what breaks, what does not', 'Tắt MongoDB: cái gì hỏng, cái gì không')}</h3>
${O4_DOWN}
<ul>
<li>${T('<strong>The main action survived</strong> — 201, the loan is in PostgreSQL. That is the point of keeping the secondary store off the critical path.', '<strong>Thao tác chính sống sót</strong> — 201, lượt mượn nằm trong PostgreSQL. Đó là lý do giữ kho phụ ngoài đường găng.')}</li>
<li>${T('<strong>/actuator/health went DOWN with 503</strong> because one component is down. If your load balancer or Docker healthcheck used that URL, it would pull a working API out of service. Readiness, by default, only checks the app’s own readiness state and stayed UP — point probes at <code>/actuator/health/readiness</code> and add to that group only what the main path truly needs (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>).', '<strong>/actuator/health chuyển DOWN kèm 503</strong> vì một thành phần sập. Nếu load balancer hay healthcheck của Docker dùng URL đó, nó sẽ rút một API đang chạy tốt ra khỏi phục vụ. Readiness mặc định chỉ kiểm trạng thái sẵn sàng của chính app và vẫn UP — trỏ probe vào <code>/actuator/health/readiness</code> và chỉ thêm vào nhóm đó những gì đường chính thật sự cần (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>).')}</li>
<li>${T('<strong>The event for loan 2 is gone for good.</strong> The async method failed after the driver’s 30-second server-selection timeout, the exception went to the async error handler (a log line), and nothing retried. During those 30 seconds the pool thread was blocked — under load, an outage of the secondary store fills the async pool.', '<strong>Sự kiện của lượt mượn 2 mất vĩnh viễn.</strong> Hàm async hỏng sau 30 giây chờ chọn server của driver, ngoại lệ đi vào bộ xử lý lỗi async (một dòng log), và không gì thử lại. Trong 30 giây đó luồng của pool bị chặn — khi tải cao, kho phụ sập sẽ làm đầy pool async.')}</li>
</ul>
<p>${T(
  '“Eventually consistent” is only true if something eventually delivers. For an audit log that must be complete, write the event to an <strong>outbox table in the same PostgreSQL transaction</strong> and let a job copy it to MongoDB with retries (lesson 14.4). If gaps are acceptable (view counters, analytics), the listener above is enough — but say so in the README, and lower the timeout (for example <code>serverSelectionTimeoutMS</code> in the connection string) so a dead MongoDB does not hold threads for 30 seconds.',
  '“Nhất quán cuối cùng” chỉ đúng khi có thứ gì đó cuối cùng chuyển được dữ liệu. Với nhật ký kiểm toán phải đầy đủ, ghi sự kiện vào <strong>bảng outbox trong CÙNG giao dịch PostgreSQL</strong> rồi để một job chép sang MongoDB có thử lại (bài 14.4). Nếu chấp nhận được lỗ hổng (đếm lượt xem, số liệu phân tích), listener ở trên là đủ — nhưng ghi rõ điều đó trong README, và hạ timeout (ví dụ <code>serverSelectionTimeoutMS</code> trong chuỗi kết nối) để MongoDB chết không giữ luồng suốt 30 giây.')}</p>

<h3>${T('Testing with a real MongoDB — and pinning the image', 'Test với MongoDB thật — và ghim phiên bản image')}</h3>
${C4_TEST}
${O4_TEST}
<p>${T(
  '<code>@DataMongoTest</code> is the MongoDB counterpart of <code>@DataJpaTest</code> (lesson 11.4): only repositories and <code>MongoTemplate</code>, a context in under a second. <code>@ServiceConnection</code> wires the container’s URL into Boot. The failure is the valuable part: the generated test used <code>mongo:latest</code>, which today means MongoDB 8, which refuses this Docker host’s kernel. Testcontainers said “started”, the process exited a moment later, and the Spring error (“should be started first”) pointed nowhere near the cause. The container’s own first fatal log line named it. Pin the same major version you run in production, in tests and in compose alike.',
  '<code>@DataMongoTest</code> là bản MongoDB của <code>@DataJpaTest</code> (bài 11.4): chỉ repository và <code>MongoTemplate</code>, context dựng dưới một giây. <code>@ServiceConnection</code> nối URL của container vào Boot. Phần hỏng mới là phần đáng học: test sinh sẵn dùng <code>mongo:latest</code>, hôm nay là MongoDB 8, bản này từ chối kernel của máy Docker này. Testcontainers báo “started”, tiến trình thoát ngay sau đó, và lỗi của Spring (“should be started first”) chỉ đi lạc hướng. Dòng log fatal đầu tiên của chính container mới nêu đúng nguyên nhân. Ghim cùng phiên bản chính với production, ở test cũng như ở compose.')}</p>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — the audit log nobody protects.', 'Góc hacker — nhật ký kiểm toán không ai bảo vệ.')}</strong> ${T(
  'An audit trail is only useful if an attacker who got into the app cannot rewrite it. Give the application user of the audit database <code>insert</code> and <code>find</code> on <code>loan_events</code> only — no <code>update</code>, no <code>remove</code>, no <code>dropCollection</code> (a custom MongoDB role). Keep personal data out of event payloads (ids, not emails or phone numbers): logs are copied, exported and kept longer than the data they describe.',
  'Nhật ký kiểm toán chỉ có ích nếu kẻ đã lọt vào app không viết lại được nó. Cho tài khoản ứng dụng của CSDL nhật ký chỉ quyền <code>insert</code> và <code>find</code> trên <code>loan_events</code> — không <code>update</code>, không <code>remove</code>, không <code>dropCollection</code> (một role tuỳ biến của MongoDB). Giữ dữ liệu cá nhân ngoài payload sự kiện (id, không phải email hay số điện thoại): log bị chép, bị xuất và sống lâu hơn dữ liệu mà nó mô tả.')}</p></div>

<h3>${T('🧪 Practice (30 minutes)', '🧪 Thực hành (30 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Publish an event from your main action and write it to MongoDB with <code>@Async @TransactionalEventListener</code>.', 'Phát một sự kiện từ thao tác chính và ghi nó vào MongoDB bằng <code>@Async @TransactionalEventListener</code>.')}</li>
<li>${T('Prove the three cases: success ⇒ one document; rule failure ⇒ none; MongoDB stopped ⇒ main action still 201.', 'Chứng minh ba trường hợp: thành công ⇒ một document; luật hỏng ⇒ không có; tắt MongoDB ⇒ thao tác chính vẫn 201.')}</li>
<li>${T('Check <code>/actuator/health</code> and <code>/actuator/health/readiness</code> with MongoDB stopped; decide what your probes should use.', 'Xem <code>/actuator/health</code> và <code>/actuator/health/readiness</code> khi MongoDB tắt; quyết định probe của bạn nên dùng gì.')}</li>
<li>${T('Add a <code>@DataMongoTest</code> with a pinned <code>mongo:7</code> container.', 'Thêm một <code>@DataMongoTest</code> với container <code>mongo:7</code> đã ghim phiên bản.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('the three cases are pasted in your README with real output, and <code>mvn test</code> runs the MongoDB test (count it in the summary line — lesson 11 milestone).', 'ba trường hợp được dán vào README kèm output thật, và <code>mvn test</code> chạy test MongoDB (đếm nó trong dòng tổng kết — mốc chương 11).')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“How do you keep two databases consistent?”', '“Giữ hai CSDL nhất quán thế nào?”')}</strong> — ${T('No distributed transaction; write to one, then propagate after commit. If loss is unacceptable, use the transactional outbox with retries and an idempotent consumer.', 'Không dùng giao dịch phân tán; ghi vào một nơi, rồi lan truyền sau commit. Nếu không được mất, dùng transactional outbox có thử lại và consumer idempotent.')}</li>
<li><strong>${T('“What is eventual consistency?”', '“Nhất quán cuối cùng là gì?”')}</strong> — ${T('Replicas or derived stores may lag but converge — provided delivery is guaranteed. Without retries it is just inconsistency.', 'Bản sao hoặc kho dẫn xuất có thể chậm nhưng sẽ hội tụ — với điều kiện việc chuyển dữ liệu được đảm bảo. Không có thử lại thì đó chỉ là thiếu nhất quán.')}</li>
<li><strong>${T('“Liveness vs readiness?”', '“Liveness khác readiness thế nào?”')}</strong> — ${T('Liveness: restart me if I am stuck. Readiness: send me traffic only when the dependencies of the main path are ready. A secondary store being down should not fail either.', 'Liveness: khởi động lại tôi nếu tôi treo. Readiness: chỉ gửi lưu lượng khi các phụ thuộc của đường chính sẵn sàng. Kho phụ sập không nên làm hỏng cái nào.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AFTER_COMMIT</span><span class="v">${T('Listener phase: runs only if the SQL transaction committed.', 'Pha của listener: chỉ chạy khi giao dịch SQL đã commit.')}</span></div>
  <div class="kv"><span class="k">${T('Eventual consistency', 'Nhất quán cuối cùng')}</span><span class="v">${T('Derived data catches up later — if delivery is guaranteed.', 'Dữ liệu dẫn xuất bắt kịp sau — nếu việc chuyển được đảm bảo.')}</span></div>
  <div class="kv"><span class="k">Outbox</span><span class="v">${T('Events stored in the main DB transaction, delivered by a job.', 'Sự kiện lưu trong giao dịch của CSDL chính, một job chuyển đi.')}</span></div>
  <div class="kv"><span class="k">@DataMongoTest</span><span class="v">${T('Test slice with only MongoDB components.', 'Lát cắt test chỉ có thành phần MongoDB.')}</span></div>
  <div class="kv"><span class="k">@ServiceConnection</span><span class="v">${T('Lets Boot read connection details from a Testcontainers container.', 'Cho Boot đọc thông tin kết nối từ một container Testcontainers.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('Write the secondary store after commit and off the request thread; rollback ⇒ no document.', 'Ghi kho phụ sau commit và ngoài luồng request; rollback ⇒ không có document.')}</li>
<li>${T('MongoDB down: main action 201, /actuator/health 503, readiness UP, the event lost — measured.', 'MongoDB sập: thao tác chính 201, /actuator/health 503, readiness UP, sự kiện mất — đã đo.')}</li>
<li>${T('Need completeness ⇒ outbox + retries; accept gaps ⇒ document it and shorten the timeout.', 'Cần đầy đủ ⇒ outbox + thử lại; chấp nhận lỗ hổng ⇒ ghi rõ và rút ngắn timeout.')}</li>
<li>${T('Pin the MongoDB image; when a container “starts” and the test still fails, read the container’s own log.', 'Ghim image MongoDB; khi container “started” mà test vẫn hỏng, đọc log của chính container.')}</li>
</ul>
${tl('https://docs.spring.io/spring-boot/reference/testing/testcontainers.html', '🧪', 'Spring Boot — Testcontainers', T('@ServiceConnection and container lifecycle', '@ServiceConnection và vòng đời container'))}
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes', '📈', 'Spring Boot — Kubernetes probes', T('Liveness and readiness groups', 'Nhóm liveness và readiness'))}
</div>
`; };

/* ═════════════ 20.5 — Lab ═════════════ */
const L5 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 20 · Lab', 'Chương 20 · Lab')}</span>
<h2>${T('20.5 — Chapter 20 lab + interview questions', '20.5 — Lab chương 20 + câu hỏi phỏng vấn')}</h2>
<p class="lead">${T(
  'Add lab feedback to the LabFlow booking API of this course (or reviews to the sample club-gear app): after a booking is finished, the student rates the lab and leaves comments; staff see a per-lab report. Bookings stay in PostgreSQL; feedback lives in MongoDB.',
  'Thêm phần góp ý phòng lab cho LabFlow API của khoá (hoặc đánh giá cho app mẫu kho thiết bị CLB): sau khi một lượt đặt kết thúc, sinh viên chấm điểm phòng lab và để lại nhận xét; nhân viên xem báo cáo theo từng phòng. Lượt đặt vẫn ở PostgreSQL; góp ý nằm ở MongoDB.')}</p>
<h3>${T('Tasks', 'Nhiệm vụ')}</h3>
<ol>
<li>${T('<code>@Document("lab_feedback")</code> record: <code>bookingId</code>, <code>labId</code>, <code>studentId</code>, <code>rating</code> 1–5, <code>text</code>, an embedded list of <code>issues</code> (equipment, cleanliness, network…) whose fields vary by type.', 'Record <code>@Document("lab_feedback")</code>: <code>bookingId</code>, <code>labId</code>, <code>studentId</code>, <code>rating</code> 1–5, <code>text</code>, một danh sách nhúng <code>issues</code> (thiết bị, vệ sinh, mạng…) có trường khác nhau theo loại.')}</li>
<li>${T('<code>POST /api/bookings/{id}/feedback</code>: only the booking’s owner, only once, only after the booking ended — the check reads PostgreSQL, the write goes to MongoDB. A second attempt ⇒ 409 (enforce with a unique index on <code>bookingId</code>, not only in Java).', '<code>POST /api/bookings/{id}/feedback</code>: chỉ chủ lượt đặt, chỉ một lần, chỉ sau khi lượt đặt kết thúc — phần kiểm đọc PostgreSQL, phần ghi vào MongoDB. Lần thứ hai ⇒ 409 (chặn bằng unique index trên <code>bookingId</code>, không chỉ bằng Java).')}</li>
<li>${T('<code>POST /api/feedback/{id}/helpful</code> with an atomic <code>$inc</code>.', '<code>POST /api/feedback/{id}/helpful</code> bằng <code>$inc</code> nguyên tử.')}</li>
<li>${T('<code>GET /api/labs/{id}/feedback?before=…</code>: newest first, keyset paging, page size capped at 50, backed by an ESR index (paste explain()).', '<code>GET /api/labs/{id}/feedback?before=…</code>: mới nhất trước, phân trang keyset, trần cỡ trang 50, có chỉ mục ESR đỡ (dán explain()).')}</li>
<li>${T('<code>GET /api/reports/labs?days=30</code> (STAFF): aggregation — average rating, count, and the most frequent issue type per lab.', '<code>GET /api/reports/labs?days=30</code> (STAFF): aggregation — điểm trung bình, số lượng và loại sự cố gặp nhiều nhất theo từng phòng.')}</li>
<li>${T('A <code>@DataMongoTest</code> with a pinned container covering the unique index and the atomic counter; one MockMvc test sending <code>{"text": {"$ne": ""}}</code> that expects 400.', 'Một <code>@DataMongoTest</code> với container đã ghim phiên bản, phủ unique index và bộ đếm nguyên tử; một test MockMvc gửi <code>{"text": {"$ne": ""}}</code> và chờ 400.')}</li>
</ol>
<h3>${T('Rubric (10 points)', 'Rubric (10 điểm)')}</h3>
<table><thead><tr><th>${T('Criterion', 'Tiêu chí')}</th><th>${T('Points', 'Điểm')}</th></tr></thead><tbody>
<tr><td>${T('Document model justified in README (embed vs reference, why not PostgreSQL)', 'Mô hình document có giải thích trong README (nhúng hay tham chiếu, vì sao không PostgreSQL)')}</td><td>2</td></tr>
<tr><td>${T('Rules: owner, once (unique index ⇒ 409), after end', 'Luật: đúng chủ, một lần (unique index ⇒ 409), sau khi kết thúc')}</td><td>2</td></tr>
<tr><td>${T('Atomic updates; no read-modify-write save() for counters', 'Cập nhật nguyên tử; không đọc–sửa–ghi bằng save() cho bộ đếm')}</td><td>1</td></tr>
<tr><td>${T('Index + explain proof; keyset paging with a cap', 'Chỉ mục + bằng chứng explain; phân trang keyset có trần')}</td><td>2</td></tr>
<tr><td>${T('Aggregation report correct on seeded data', 'Báo cáo aggregation đúng trên dữ liệu đã đổ')}</td><td>1</td></tr>
<tr><td>${T('Tests green, including the injection case; MongoDB bound to 127.0.0.1 with auth in compose', 'Test xanh, kể cả ca injection; MongoDB bind 127.0.0.1 và có xác thực trong compose')}</td><td>2</td></tr>
</tbody></table>
<details><summary>${T('Hint for the unique index and 409', 'Gợi ý cho unique index và 409')}</summary>
<p>${T(
  'Create it with <code>new Index("bookingId", Sort.Direction.ASC).unique()</code> in your index runner. A duplicate insert throws <code>DuplicateKeyException</code> (a <code>DataIntegrityViolationException</code>), so the same <code>@ExceptionHandler</code> that turned the PostgreSQL unique violation into 409 at milestone 8 already covers it — check that it does.',
  'Tạo bằng <code>new Index("bookingId", Sort.Direction.ASC).unique()</code> trong runner tạo chỉ mục. Chèn trùng sẽ ném <code>DuplicateKeyException</code> (một <code>DataIntegrityViolationException</code>), nên chính <code>@ExceptionHandler</code> đã biến vi phạm unique của PostgreSQL thành 409 ở mốc 8 cũng phủ luôn trường hợp này — kiểm xem có đúng vậy không.')}</p>
</details>
<h3>🎤 ${T('Interview questions for this chapter', 'Câu hỏi phỏng vấn của chương')}</h3>
<ol>
<li>${T('When would you choose MongoDB over PostgreSQL — and when JSONB instead of either?', 'Khi nào chọn MongoDB thay PostgreSQL — và khi nào dùng JSONB thay cả hai?')}</li>
<li>${T('Embedding vs referencing: give one example of each from your project.', 'Nhúng và tham chiếu: cho mỗi loại một ví dụ trong dự án của bạn.')}</li>
<li>${T('Why can repository.save() lose updates, and how do $inc or @Version fix it?', 'Vì sao repository.save() có thể làm mất cập nhật, và $inc hay @Version sửa thế nào?')}</li>
<li>${T('Show a NoSQL injection payload and the code change that blocks it.', 'Đưa một payload NoSQL injection và thay đổi mã chặn được nó.')}</li>
<li>${T('Explain the ESR rule using an explain() you have read.', 'Giải thích quy tắc ESR bằng một explain() bạn đã đọc.')}</li>
<li>${T('Your app writes to PostgreSQL and MongoDB. MongoDB is down for ten minutes. What happens, and what would you change?', 'App ghi vào PostgreSQL và MongoDB. MongoDB sập mười phút. Chuyện gì xảy ra, và bạn sẽ đổi gì?')}</li>
<li>${T('What does Spring Boot 4 read for the MongoDB connection, and how would you notice a wrong property quickly?', 'Spring Boot 4 đọc cấu hình kết nối MongoDB ở đâu, và làm sao nhận ra nhanh một thuộc tính sai?')}</li>
</ol>
</div>
`; };

const QUIZ20 = [
  Q('20-1', 'A Spring Boot 4 app sets spring.data.mongodb.uri=mongodb://localhost:57017/app. The log shows connection attempts to localhost:27017. Why?|||App Spring Boot 4 đặt spring.data.mongodb.uri=mongodb://localhost:57017/app. Log cho thấy driver thử kết nối localhost:27017. Vì sao?', [
    'Port 57017 is reserved, so the driver switches to the default|||Cổng 57017 bị giữ, nên driver đổi sang mặc định',
    'Boot 4 reads spring.mongodb.uri; the old property is ignored and the driver uses its default|||Boot 4 đọc spring.mongodb.uri; thuộc tính cũ bị bỏ qua và driver dùng mặc định',
    'MongoDB redirects clients to 27017|||MongoDB chuyển hướng client về 27017',
    'The URI is missing the authSource parameter|||URI thiếu tham số authSource',
  ], 1, 'Measured in lesson 20.2: the app started, the first request failed after 30 s, the log showed localhost:27017.|||Đo ở bài 20.2: app khởi động, request đầu hỏng sau 30 giây, log ghi localhost:27017.'),
  Q('20-2', 'Fifty concurrent requests each run findById, add 1 to a counter field and call save(). What is the most likely final value?|||Năm mươi request đồng thời, mỗi cái findById, cộng 1 vào trường đếm rồi gọi save(). Giá trị cuối khả năng cao nhất là gì?', [
    'Exactly 50|||Đúng 50',
    'Less than 50, varying between runs|||Nhỏ hơn 50, mỗi lần chạy một khác',
    'More than 50|||Lớn hơn 50',
    'An exception is always thrown|||Luôn ném ngoại lệ',
  ], 1, 'save() replaces the whole document read earlier; lesson 20.2 measured 29 and 27. A server-side $inc gave 50.|||save() thay cả document đã đọc trước đó; bài 20.2 đo được 29 và 27. $inc ở server cho 50.'),
  Q('20-3', 'Which request body exploits Criteria.where("editCode").is(body.get("editCode")) when body is a Map<String, Object>?|||Body nào khai thác được Criteria.where("editCode").is(body.get("editCode")) khi body là Map<String, Object>?', [
    '{"editCode": "\' OR 1=1 --"}|||{"editCode": "\' OR 1=1 --"}',
    '{"editCode": {"$ne": ""}}|||{"editCode": {"$ne": ""}}',
    '{"editCode": null}|||{"editCode": null}',
    '{"editCode": 12345678}|||{"editCode": 12345678}',
  ], 1, 'The object is passed through and read as an operator: "not equal to empty" matches every document.|||Object được chuyển nguyên và đọc thành toán tử: "khác rỗng" khớp mọi document.'),
  Q('20-4', 'What blocks that payload most simply?|||Cách đơn giản nhất chặn payload đó là gì?', [
    'Escaping the $ character in every string|||Thoát ký tự $ trong mọi chuỗi',
    'A request record whose editCode field is declared as String|||Một record request có trường editCode khai báo kiểu String',
    'Turning off MongoDB authentication|||Tắt xác thực MongoDB',
    'Using findAll() and filtering in Java|||Dùng findAll() rồi lọc trong Java',
  ], 1, 'Jackson refuses an object where a String is declared ⇒ 400 before any query runs.|||Jackson từ chối object ở chỗ khai báo String ⇒ 400 trước khi truy vấn nào chạy.'),
  Q('20-5', 'Query: gearId equals 42, rating ≥ 4, sorted by createdAt descending. Which compound index avoids an in-memory SORT?|||Truy vấn: gearId bằng 42, rating ≥ 4, sắp theo createdAt giảm dần. Chỉ mục kép nào tránh SORT trong bộ nhớ?', [
    '{gearId: 1, rating: 1, createdAt: -1}|||{gearId: 1, rating: 1, createdAt: -1}',
    '{rating: 1, gearId: 1}|||{rating: 1, gearId: 1}',
    '{gearId: 1, createdAt: -1, rating: 1}|||{gearId: 1, createdAt: -1, rating: 1}',
    '{createdAt: -1}|||{createdAt: -1}',
  ], 2, 'ESR — Equality, Sort, Range. Lesson 20.3: 48 keys and no SORT stage vs 160 keys + SORT.|||ESR — Equality, Sort, Range. Bài 20.3: 48 khoá, không SORT, so với 160 khoá + SORT.'),
  Q('20-6', 'In explain("executionStats"), which combination signals a missing index on a large collection?|||Trong explain("executionStats"), tổ hợp nào báo hiệu thiếu chỉ mục trên collection lớn?', [
    'IXSCAN with totalDocsExamined close to nReturned|||IXSCAN với totalDocsExamined gần bằng nReturned',
    'COLLSCAN with totalDocsExamined much larger than nReturned|||COLLSCAN với totalDocsExamined lớn hơn nhiều so với nReturned',
    'LIMIT then FETCH|||LIMIT rồi FETCH',
    'executionTimeMillis = 0|||executionTimeMillis = 0',
  ], 1, 'Lesson 20.3: COLLSCAN read 200,002 documents to return 20.|||Bài 20.3: COLLSCAN đọc 200.002 document để trả 20.'),
  Q('20-7', 'A TTL index has expireAfterSeconds = 30. When is an expired document removed?|||Một chỉ mục TTL có expireAfterSeconds = 30. Document hết hạn bị xoá lúc nào?', [
    'Exactly 30 seconds after the date field|||Đúng 30 giây sau trường ngày',
    'At the next read of that document|||Ở lần đọc kế tiếp document đó',
    'Some time after 30 seconds, when the background TTL monitor runs (about every 60 s)|||Một lúc sau mốc 30 giây, khi tiến trình TTL nền chạy (khoảng mỗi 60 giây)',
    'Only when the collection is compacted|||Chỉ khi collection được nén lại',
  ], 2, 'Deletion is a background task; do not rely on it for exact timing.|||Việc xoá là tác vụ nền; đừng dựa vào nó cho mốc giờ chính xác.'),
  Q('20-8', 'Why does skip(180000).limit(20) get slow even with an index?|||Vì sao skip(180000).limit(20) chậm dù có chỉ mục?', [
    'skip disables indexes|||skip tắt chỉ mục',
    'The server still walks the 180,000 skipped index entries|||Server vẫn đi qua 180.000 mục chỉ mục bị bỏ',
    'limit forces a collection scan|||limit buộc quét cả collection',
    'MongoDB caches only the first 1,000 results|||MongoDB chỉ cache 1.000 kết quả đầu',
  ], 1, 'Lesson 20.3: 180,020 keys examined. Keyset paging examined 20.|||Bài 20.3: đọc 180.020 khoá. Phân trang keyset đọc 20.'),
  Q('20-9', 'A listener annotated @Async @TransactionalEventListener writes to MongoDB. The SQL transaction rolls back. What happens?|||Một listener gắn @Async @TransactionalEventListener ghi vào MongoDB. Giao dịch SQL rollback. Chuyện gì xảy ra?', [
    'The document is written, then deleted|||Document được ghi rồi xoá',
    'Nothing is written: the default phase is AFTER_COMMIT|||Không ghi gì: pha mặc định là AFTER_COMMIT',
    'MongoDB rolls back automatically too|||MongoDB tự rollback theo',
    'The listener throws and the HTTP response becomes 500|||Listener ném lỗi và phản hồi HTTP thành 500',
  ], 1, 'Lesson 20.4: the 409 left the event count at 1.|||Bài 20.4: lỗi 409 giữ số sự kiện ở 1.'),
  Q('20-10', 'MongoDB (used only for an audit log) is down. Which endpoint should a load balancer probe so a working API stays in service?|||MongoDB (chỉ dùng cho nhật ký kiểm toán) sập. Load balancer nên probe endpoint nào để API vẫn chạy tốt không bị rút khỏi phục vụ?', [
    '/actuator/health, because it checks every component|||/actuator/health, vì nó kiểm mọi thành phần',
    '/actuator/health/readiness, configured with only what the main path needs|||/actuator/health/readiness, cấu hình chỉ gồm những gì đường chính cần',
    '/actuator/info|||/actuator/info',
    'No probe; restart the app every hour|||Không probe; khởi động lại app mỗi giờ',
  ], 1, 'Lesson 20.4: /actuator/health returned 503 while readiness stayed UP and loans still worked.|||Bài 20.4: /actuator/health trả 503 trong khi readiness vẫn UP và việc mượn vẫn chạy.'),
];

const LESSONS = [
  { title: '20.1 — Documents vs tables: when MongoDB fits|||20.1 — Document và bảng: khi nào MongoDB hợp', slug: 'sb-20-1-mongo-vi-sao', type: 'LESSON', isFreePreview: true, description: 'Hai đánh giá khác hình dạng trong mongosh, nhúng hay tham chiếu, trần 16 MB đo thật, so với JSONB, và MongoDB mở toang ra mạng.', content: L1(true) + L1(false) },
  { title: '20.2 — @Document, MongoRepository and MongoTemplate|||20.2 — @Document, MongoRepository và MongoTemplate', slug: 'sb-20-2-spring-data-mongo', type: 'LESSON', isFreePreview: true, description: 'spring.mongodb.uri của Boot 4 (tên cũ bị bỏ qua, đo thật), record làm document, derived query, save() mất 21/50 phiếu so với $inc, và NoSQL injection.', content: L2(true) + L2(false) },
  { title: '20.3 — Queries, indexes and aggregation|||20.3 — Truy vấn, chỉ mục và aggregation', slug: 'sb-20-3-mongo-query-index', type: 'LESSON', isFreePreview: true, description: 'explain() trên 200.002 document, quy tắc ESR, chỉ mục TTL, aggregation báo cáo, skip vs keyset, và ô tìm kiếm chạy regex của kẻ tấn công.', content: L3(true) + L3(false) },
  { title: '20.4 — MongoDB next to PostgreSQL in one app|||20.4 — MongoDB bên cạnh PostgreSQL trong một app', slug: 'sb-20-4-mongo-ket-hop', type: 'LESSON', isFreePreview: true, description: 'Ghi MongoDB sau commit, rollback không ghi, tắt MongoDB: API vẫn 201 nhưng sự kiện mất và /actuator/health 503; @DataMongoTest + Testcontainers và mongo:latest từ chối kernel.', content: L4(true) + L4(false) },
  { title: '20.5 — Chapter 20 lab + interview questions|||20.5 — Lab chương 20 + câu hỏi phỏng vấn', slug: 'sb-20-5-lab-20', type: 'LESSON', isFreePreview: true, description: 'Góp ý phòng lab LabFlow bằng MongoDB cạnh PostgreSQL: luật một lần (unique index ⇒ 409), $inc, keyset + ESR, báo cáo aggregation, test injection; rubric 10 điểm, 7 câu phỏng vấn.', content: L5(true) + L5(false) },
  {
    title: '20.6 — Chapter 20 quiz|||20.6 — Kiểm tra chương 20',
    slug: 'sb-20-6-quiz',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tiếng Anh về thuộc tính kết nối Boot 4, save() mất cập nhật, NoSQL injection, ESR, explain, TTL, phân trang và ghi sau commit — đều lấy từ thứ đã chạy thật trong chương.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw running in this chapter. If you miss one, the explanation names the lesson.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong chương. Sai câu nào thì lời giải nêu đúng bài cần đọc lại.</p>
</div>
`,
    quiz: { timeLimitSeconds: 900, questions: QUIZ20 },
  },
];

export default {
  title: 'Chapter 20 — Spring Data MongoDB|||Chương 20 — Spring Data MongoDB',
  description: 'Khi nào dùng document store, @Document, MongoRepository, MongoTemplate, chỉ mục, aggregation, chạy cạnh PostgreSQL.',
  lessons: LESSONS,
};
