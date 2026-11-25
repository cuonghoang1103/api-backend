/**
 * 11.3 — Ngân hàng câu hỏi phỏng vấn MongoDB (soạn 25/11/2026, tiếp quản agent mgo; demo chạy trên máy nhà, mgo-lab MongoDB 8.0.38).
 * Output thật: ../_ma.mjs OUT['s11-3-phong-van'] (kịch bản scratchpad/mgo/demo/s11/s11-3-phong-van.txt) — năm câu "chứng minh trong một phút".
 * 40 câu chia 8 nhóm (dữ liệu CAU bên dưới, mỗi câu EN|||VI, đáp án mẫu dẫn lại số đo THẬT của các chương — ghi rõ bài).
 * Thiết kế trên bảng: hệ đặt vé xem phim (nối Bài 11.2) + bảng tin; kể sự cố bằng STAR: lab 14:03 (Bài 10.7).
 */
import { lenh, ma, kv, loiGiai, lienKet, nguon } from '../_chung.mjs';

const K = 's11-3-phong-van';
const t = (s, i) => s.split('|||')[i];

// [nhóm, [[câu, đáp án mẫu], …]] — đánh số liên tục 1–40.
const CAU = [
  ['Basics and the document model|||Nền tảng và mô hình tài liệu', [
    ['When would you choose MongoDB over PostgreSQL, and when not?|||Khi nào bạn chọn MongoDB thay PostgreSQL, và khi nào không?',
     'Choose it when the data is read as whole aggregates of varying shape (a product with category-specific attributes, an order with its lines) and you want to scale reads/writes horizontally. Prefer PostgreSQL when the core is many relations queried in many directions, when foreign keys and constraints must be enforced by the database, or for heavy ad-hoc reporting with joins. Say which one your project needed and why (Lesson 0.1).|||Chọn khi dữ liệu được đọc thành từng khối trọn vẹn có hình dạng khác nhau (sản phẩm có thuộc tính riêng theo loại, đơn hàng kèm các dòng) và cần mở rộng đọc/ghi theo chiều ngang. Ưu tiên PostgreSQL khi lõi là nhiều quan hệ được truy vấn theo nhiều hướng, khi khoá ngoại và ràng buộc phải do CSDL bảo đảm, hoặc khi báo cáo tuỳ ý nặng với nhiều phép nối. Nói rõ dự án của bạn cần cái nào và vì sao (Bài 0.1).'],
    ['What is in an ObjectId, and can you sort by it?|||ObjectId chứa gì, và có sắp xếp theo nó được không?',
     '12 bytes: a 4-byte timestamp in seconds, a 5-byte random value per process, a 3-byte counter. So it sorts roughly by creation time (demo below), but only to the second and not across machines with skewed clocks — use an explicit date field for business ordering.|||12 byte: 4 byte dấu thời gian tính bằng giây, 5 byte ngẫu nhiên mỗi tiến trình, 3 byte bộ đếm. Vì vậy nó sắp gần đúng theo thời điểm tạo (demo bên dưới), nhưng chỉ chính xác tới giây và không đáng tin giữa các máy lệch đồng hồ — thứ tự nghiệp vụ thì dùng một trường ngày giờ riêng.'],
    ['Why not store money as a JavaScript number?|||Vì sao không lưu tiền bằng số JavaScript?',
     'A number is a binary double: 0.1 + 0.2 is 0.30000000000000004 (demo below). Store Decimal128 (NumberDecimal / BigDecimal in Java) or integer minor units, and keep it Decimal128 in every collection and pipeline (Lesson 1.2).|||Số JavaScript là double nhị phân: 0.1 + 0.2 ra 0.30000000000000004 (demo bên dưới). Lưu bằng Decimal128 (NumberDecimal / BigDecimal trong Java) hoặc số nguyên theo đơn vị nhỏ nhất, và giữ Decimal128 ở mọi collection, mọi pipeline (Bài 1.2).'],
    ['"MongoDB is schemaless." Agree?|||"MongoDB không có schema." Bạn đồng ý không?',
     'The database does not force a schema, but every application has one — the question is whether it is enforced. Use $jsonSchema validators with validationAction "error", and version the schema when it changes (schema versioning pattern) (Lessons 1.3, 3.4).|||CSDL không ép schema, nhưng ứng dụng nào cũng có schema — câu hỏi là có được kiểm hay không. Dùng validator $jsonSchema với validationAction "error", và đánh phiên bản schema khi nó đổi (pattern schema versioning) (Bài 1.3, 3.4).'],
    ['What limits does a document have?|||Một tài liệu có những giới hạn nào?',
     '16 MB per document, 100 levels of nesting. In Lesson 3.5 pushing 4 KB comments into one array failed with error 10334 at push 4,166 — the limit arrives as a production error, not a warning. Design so arrays are bounded.|||16 MB mỗi tài liệu, lồng tối đa 100 cấp. Ở Bài 3.5, đẩy bình luận 4 KB vào một mảng báo lỗi 10334 ở lần đẩy thứ 4.166 — giới hạn tới dưới dạng lỗi production, không phải cảnh báo. Thiết kế sao cho mảng có giới hạn.'],
  ]],
  ['Schema design|||Thiết kế schema', [
    ['How do you decide embed vs reference?|||Bạn quyết định nhúng hay tham chiếu thế nào?',
     'From the queries: what is read together is stored together. Embed when the child is read with the parent, belongs to one parent and is bounded; reference when it is large, shared, updated independently or unbounded. Write the access pattern next to each decision (Lesson 3.1).|||Từ truy vấn: thứ được đọc cùng nhau thì lưu cùng nhau. Nhúng khi phần con được đọc kèm phần cha, chỉ thuộc một cha và có giới hạn; tham chiếu khi nó lớn, dùng chung, cập nhật độc lập hoặc không giới hạn. Ghi cách truy cập cạnh mỗi quyết định (Bài 3.1).'],
    ['What is the extended reference pattern and what does it cost?|||Extended reference pattern là gì và trả giá gì?',
     'Copy the few fields you always display (name, price at purchase) into the referencing document to avoid a join. Cost: copies can go stale — decide per field whether staleness is correct (price at purchase must NOT change) or needs an update job.|||Chép vài trường luôn hiển thị (tên, giá lúc mua) vào tài liệu tham chiếu để khỏi phải nối. Cái giá: bản chép có thể cũ đi — quyết định cho từng trường: cũ là đúng (giá lúc mua KHÔNG được đổi) hay cần job cập nhật.'],
    ['How would you store millions of sensor readings?|||Bạn lưu hàng triệu số đo cảm biến thế nào?',
     'Not one document per reading if you can avoid it: a time series collection (Lesson 10.5: 432,000 readings in 440 buckets, more than 10× smaller on disk and in indexes) or the bucket pattern by hand, plus a TTL for raw data.|||Tránh mỗi số đo một tài liệu nếu được: dùng time series collection (Bài 10.5: 432.000 số đo gói trong 440 bucket, nhỏ hơn hơn 10 lần cả trên đĩa lẫn index) hoặc tự làm bucket pattern, kèm TTL cho dữ liệu thô.'],
    ['Name two anti-patterns and their symptoms.|||Kể hai anti-pattern và triệu chứng của chúng.',
     'Unbounded arrays: documents grow until writes slow down and hit 16 MB. Massive number of collections: every collection and index is files — in Lesson 3.5 mongod with the default open-file limit crashed after roughly 450–500 collections. Others: bloated documents read for one field, $lookup on every request.|||Mảng không giới hạn: tài liệu phình tới khi ghi chậm dần rồi chạm 16 MB. Quá nhiều collection: mỗi collection và index là tệp — ở Bài 3.5, mongod với giới hạn tệp mở mặc định sập sau khoảng 450–500 collection. Còn có: tài liệu phình mà chỉ đọc một trường, $lookup ở mọi yêu cầu.'],
    ['How do you change a schema without downtime?|||Đổi schema thế nào mà không dừng hệ thống?',
     'Add a schemaVersion field; the application reads both versions and writes the new one; migrate old documents in batches in the background; tighten the validator last (validationLevel "moderate" during the migration).|||Thêm trường schemaVersion; ứng dụng đọc được cả hai phiên bản và ghi phiên bản mới; chuyển tài liệu cũ theo lô ở nền; siết validator sau cùng (validationLevel "moderate" trong lúc chuyển).'],
  ]],
  ['Indexes|||Index', [
    ['Explain the ESR rule with numbers.|||Giải thích luật ESR bằng con số.',
     'Equality fields first, then the sort field, then range fields. In Lesson 4.3 the same query examined 42 keys with an ESR index and 125,575 keys with the fields in E-R-S order. In Lesson 11.2 Q3, adding the second equality field before the range cut keys from 9 to 4.|||Trường so bằng trước, rồi trường sắp xếp, rồi trường khoảng. Ở Bài 4.3 cùng một truy vấn quét 42 khoá với index đúng ESR và 125.575 khoá khi xếp theo E-R-S. Ở Q3 Bài 11.2, đặt trường bằng thứ hai trước trường khoảng giảm số khoá quét từ 9 xuống 4.'],
    ['Which three numbers do you read first in explain("executionStats")?|||Bạn đọc ba con số nào đầu tiên trong explain("executionStats")?',
     'nReturned, totalKeysExamined, totalDocsExamined — plus the plan shape (COLLSCAN? SORT?). Healthy: keys ≈ docs ≈ returned. Docs ≫ returned means the index does not cover the filter (Lesson 4.2).|||nReturned, totalKeysExamined, totalDocsExamined — kèm hình dạng kế hoạch (có COLLSCAN? có SORT?). Khoẻ: khoá ≈ tài liệu ≈ trả về. Tài liệu ≫ trả về nghĩa là index không phủ được bộ lọc (Bài 4.2).'],
    ['What does an index cost?|||Index tốn gì?',
     'Every write updates every index, plus RAM for the working set. Lesson 4.1 measured inserts about 2× slower with six indexes, and Lesson 4.5 an update of a field present in five indexes about 1.7× slower. Drop unused ones — after hiding them for a full business cycle (Lesson 11.1).|||Mỗi lần ghi phải cập nhật mọi index, cộng thêm RAM cho working set. Bài 4.1 đo chèn chậm khoảng 2 lần khi có sáu index, và Bài 4.5 đo sửa một trường nằm trong năm index chậm khoảng 1,7 lần. Bỏ index thừa — sau khi ẩn chúng qua trọn một chu kỳ kinh doanh (Bài 11.1).'],
    ['What is a covered query?|||Truy vấn được phủ (covered query) là gì?',
     'All filtered and returned fields are in the index and _id is excluded, so MongoDB answers from the index alone (PROJECTION_COVERED, totalDocsExamined 0). Multikey indexes cannot cover array fields.|||Mọi trường dùng để lọc và trả về đều nằm trong index và loại _id ra, nên MongoDB trả lời chỉ bằng index (PROJECTION_COVERED, totalDocsExamined 0). Index multikey không phủ được trường mảng.'],
    ['A query was fast yesterday and slow today. How do you investigate?|||Hôm qua truy vấn nhanh, hôm nay chậm. Bạn điều tra thế nào?',
     'Slow-query log / profiler to get the exact shape; explain it now; check whether the plan changed (plan cache, a dropped or new index), whether data grew past the working set, and $currentOp for blocking operations. Fix with an index or query change, verify with explain, keep the before/after (Lesson 4.6).|||Log truy vấn chậm / profiler để lấy đúng hình dạng truy vấn; explain nó ngay lúc này; xem kế hoạch có đổi không (plan cache, index bị xoá hoặc mới thêm), dữ liệu có vượt working set không, và $currentOp xem có thao tác nào chặn. Sửa bằng index hoặc đổi truy vấn, kiểm lại bằng explain, giữ số trước/sau (Bài 4.6).'],
  ]],
  ['Queries and aggregation|||Truy vấn và aggregation', [
    ['Why does {"ghe.ma": "G1", "ghe.trangThai": "DAT"} return the wrong showtimes?|||Vì sao {"ghe.ma": "G1", "ghe.trangThai": "DAT"} trả về sai suất chiếu?',
     'Each condition may match a different array element: "some seat is G1" and "some seat is DAT". The demo below: 594 showtimes by dot notation, 34 with $elemMatch where G1 itself is booked.|||Mỗi điều kiện có thể khớp một phần tử mảng khác nhau: "có ghế nào là G1" và "có ghế nào DAT". Demo bên dưới: 594 suất theo dấu chấm, 34 suất với $elemMatch — nơi chính ghế G1 đã được đặt.'],
    ['Why is skip() pagination slow and what do you use instead?|||Vì sao phân trang bằng skip() chậm và bạn dùng gì thay?',
     'skip(n) still walks n index entries (Lesson 2.6 measured it). Keyset pagination: filter after the last seen sort key, including a tie-breaker — Lesson 11.2 Q2c showed a cursor without _id losing 5 of 35 tickets.|||skip(n) vẫn phải đi qua n mục index (Bài 2.6 đã đo). Phân trang keyset: lọc sau khoá sắp xếp cuối cùng đã thấy, kèm trường phá hoà — Q2c Bài 11.2 cho thấy con trỏ thiếu _id làm mất 5 trên 35 vé.'],
    ['How do you report revenue by day in Vietnam time?|||Báo cáo doanh thu theo ngày giờ Việt Nam thế nào?',
     'Dates are stored in UTC; group with $dateTrunc or $dateToString with timezone "Asia/Ho_Chi_Minh". Without it, a show at 00:30 on 1 December lands in November (Lesson 11.2: 850,000 đ in the wrong month).|||Ngày giờ lưu theo UTC; gom bằng $dateTrunc hoặc $dateToString với timezone "Asia/Ho_Chi_Minh". Thiếu nó, suất 00:30 ngày 01/12 rơi vào tháng 11 (Bài 11.2: 850.000 đ sang nhầm tháng).'],
    ['When is $lookup acceptable?|||Khi nào dùng $lookup là chấp nhận được?',
     'For reports and occasional reads, with an index on the foreign field and a pipeline that projects only what is needed. On a hot path that runs per request, prefer embedding or an extended reference. Measure it (Lesson 5.2).|||Cho báo cáo và những lần đọc thỉnh thoảng, có index ở trường được nối và pipeline chỉ lấy đúng trường cần. Trên đường nóng chạy theo từng yêu cầu thì ưu tiên nhúng hoặc extended reference. Hãy đo (Bài 5.2).'],
    ['How do you make a pipeline fast?|||Làm sao cho một pipeline nhanh?',
     '$match and $sort first so they can use an index, $project early to shrink documents, $limit as soon as possible; read explain of the pipeline; watch the 100 MB per-stage memory limit (allowDiskUse) and precompute with $merge for dashboards (Lesson 5.5).|||$match và $sort lên đầu để dùng được index, $project sớm cho tài liệu gọn lại, $limit càng sớm càng tốt; đọc explain của pipeline; để ý giới hạn 100 MB bộ nhớ mỗi stage (allowDiskUse) và tính trước bằng $merge cho bảng điều khiển (Bài 5.5).'],
  ]],
  ['Transactions and consistency|||Transaction và tính nhất quán', [
    ['Two buyers click on the last item at the same time. How do you prevent overselling?|||Hai người cùng bấm mua món cuối cùng. Chặn bán vượt thế nào?',
     'Make the check and the write one atomic operation: updateOne({ _id, stock: { $gte: q } }, { $inc: { stock: -q } }) and look at modifiedCount. Check-then-act oversold in Lesson 2.5, and double-booked 30 seats in Lesson 11.2.|||Gộp kiểm và ghi thành một thao tác nguyên tử: updateOne({ _id, stock: { $gte: q } }, { $inc: { stock: -q } }) rồi xem modifiedCount. Kiểu kiểm rồi ghi đã bán vượt ở Bài 2.5, và bán trùng 30 ghế ở Bài 11.2.'],
    ['When do you need a multi-document transaction?|||Khi nào cần transaction nhiều tài liệu?',
     'When an invariant spans documents: transfer between two accounts, reserve stock in several products and insert the order. Not for single-document updates (already atomic). Keep them short (60 s default limit), retry on TransientTransactionError — withTransaction does that (Lesson 6.2).|||Khi một bất biến trải trên nhiều tài liệu: chuyển tiền giữa hai tài khoản, giữ kho nhiều sản phẩm rồi thêm đơn. Không cần cho cập nhật một tài liệu (vốn đã nguyên tử). Giữ chúng ngắn (giới hạn mặc định 60 s), thử lại khi gặp TransientTransactionError — withTransaction làm việc đó (Bài 6.2).'],
    ['What does w:"majority" guarantee, and what does w:1 risk?|||w:"majority" bảo đảm gì, và w:1 rủi ro gì?',
     'majority: acknowledged only after most data-bearing members have the write, so it survives failover. w:1 can be acknowledged and then rolled back when the primary dies (Lesson 7.2). The demo below: w:3 on one node reports an error, yet the document was written — write concern errors do not undo.|||majority: chỉ xác nhận khi đa số thành viên mang dữ liệu đã có lần ghi, nên sống sót qua chuyển dự phòng. w:1 có thể đã xác nhận rồi bị rollback khi primary chết (Bài 7.2). Demo bên dưới: w:3 trên một máy báo lỗi, nhưng tài liệu vẫn đã được ghi — lỗi write concern không hoàn tác.'],
    ['Why can a read from a secondary return old data, and what do you do?|||Vì sao đọc từ secondary có thể ra dữ liệu cũ, và bạn làm gì?',
     'Replication is asynchronous; a secondary lags. Read your own writes from the primary, or use causally consistent sessions with majority read/write concern; use secondaries only where slightly stale data is fine (analytics) (Lesson 6.4).|||Nhân bản là bất đồng bộ; secondary bị trễ. Đọc lại thứ mình vừa ghi thì đọc từ primary, hoặc dùng session nhất quán nhân quả với read/write concern majority; chỉ dùng secondary ở chỗ dữ liệu hơi cũ vẫn ổn (phân tích) (Bài 6.4).'],
    ['What is a lost update and how do you prevent it in MongoDB?|||Lost update là gì và chặn nó trong MongoDB thế nào?',
     'Two clients read, modify in memory and write back the whole document; one overwrites the other. Prevent with update operators ($inc, $set on fields) instead of replacing, or optimistic locking with a version field in the filter (Lesson 6.1).|||Hai bên cùng đọc, sửa trong bộ nhớ rồi ghi đè cả tài liệu; bên này đè mất thay đổi của bên kia. Chặn bằng toán tử cập nhật ($inc, $set từng trường) thay vì thay cả tài liệu, hoặc khoá lạc quan bằng trường version trong bộ lọc (Bài 6.1).'],
  ]],
  ['Replication and sharding|||Nhân bản và sharding', [
    ['What happens when the primary dies?|||Primary chết thì chuyện gì xảy ra?',
     'Secondaries stop hearing heartbeats, hold an election, the most up-to-date eligible member becomes primary. In Lesson 7.2 the cluster elected in about 10–11 s; the application could not write for 10–21 s, and one write with retryWrites still surfaced a network error although it had been applied — so make writes idempotent.|||Các secondary không còn nhận nhịp tim, tổ chức bầu, thành viên đủ điều kiện có dữ liệu mới nhất thành primary. Ở Bài 7.2 cụm bầu xong trong khoảng 10–11 s; ứng dụng không ghi được trong 10–21 s, và một lần ghi có retryWrites vẫn báo lỗi mạng dù đã được ghi — vì vậy hãy làm lần ghi idempotent.'],
    ['Why avoid an arbiter?|||Vì sao nên tránh arbiter?',
     'With P-S-A, losing one data node leaves one data-bearing member: majority writes cannot be acknowledged and majority-committed point stalls (cache pressure). Prefer three data-bearing members (Lesson 7.3).|||Với P-S-A, mất một máy mang dữ liệu là chỉ còn một thành viên mang dữ liệu: ghi majority không xác nhận được và điểm commit majority đứng yên (gây áp lực cache). Ưu tiên ba thành viên mang dữ liệu (Bài 7.3).'],
    ['When do you shard?|||Khi nào bạn shard?',
     'When one replica set can no longer hold the working set or the write rate after indexing, schema and hardware are tuned — not as a first step. Sharding adds mongos, config servers, a shard key you live with, and scatter-gather for queries without it (Lesson 7.4).|||Khi một replica set không còn chứa nổi working set hoặc tốc độ ghi, sau khi đã tối ưu index, schema và phần cứng — không phải bước đầu tiên. Sharding thêm mongos, config server, một shard key phải sống chung lâu dài, và truy vấn phát tán khi không có shard key (Bài 7.4).'],
    ['What makes a good shard key?|||Shard key tốt là thế nào?',
     'High cardinality, even frequency, not monotonically increasing (or hashed), and present in most queries so they are targeted. A timestamp alone sends all inserts to one shard (Lesson 7.5).|||Nhiều giá trị khác nhau, tần suất đều, không tăng dần đơn điệu (hoặc dùng hashed), và có mặt trong phần lớn truy vấn để chúng nhắm đúng shard. Chỉ dấu thời gian thì mọi lần chèn dồn về một shard (Bài 7.5).'],
    ['What is the oplog and why does its size matter?|||Oplog là gì và vì sao cỡ của nó quan trọng?',
     'A capped collection of idempotent operations that secondaries replay. Its time window limits how long a member can be down and still catch up, and how far back point-in-time recovery can go (Lessons 7.1, 10.1).|||Một capped collection chứa các thao tác idempotent mà secondary phát lại. Cửa sổ thời gian của nó quyết định một thành viên được nghỉ bao lâu mà vẫn đuổi kịp, và khôi phục tới thời điểm lùi được bao xa (Bài 7.1, 10.1).'],
  ]],
  ['Applications and security|||Ứng dụng và bảo mật', [
    ['How many MongoClient instances should a Node.js service have?|||Một dịch vụ Node.js nên có bao nhiêu MongoClient?',
     'One per process, created at start-up and reused; it owns the connection pool. Creating a client per request exhausts connections and adds handshakes (Lesson 8.1 measured it).|||Mỗi tiến trình một cái, tạo lúc khởi động rồi dùng lại; nó giữ pool kết nối. Tạo client cho từng yêu cầu làm cạn kết nối và tốn thêm bắt tay (Bài 8.1 đã đo).'],
    ['populate() or $lookup in Mongoose?|||Trong Mongoose, dùng populate() hay $lookup?',
     'populate runs extra queries from the application (watch for N+1 inside loops); $lookup joins in the server in one round trip. Use lean() for read-only lists. Count the queries an endpoint runs (Lessons 8.2, 8.3).|||populate chạy thêm truy vấn từ phía ứng dụng (cẩn thận N+1 trong vòng lặp); $lookup nối ngay trên máy chủ trong một lượt. Dùng lean() cho danh sách chỉ đọc. Đếm số truy vấn một endpoint chạy (Bài 8.2, 8.3).'],
    ['Show me a NoSQL injection and the fix.|||Cho tôi xem một NoSQL injection và cách vá.',
     'Login with { email, password } from JSON: sending "password": { "$ne": null } matches any user (Lesson 9.3, lab). Fix: validate types (password must be a string), sanitizeFilter / reject keys starting with $, never pass request objects straight into a filter, hash passwords.|||Đăng nhập với { email, password } từ JSON: gửi "password": { "$ne": null } là khớp bất kỳ người dùng nào (Bài 9.3, lab). Vá: kiểm kiểu (password phải là chuỗi), sanitizeFilter / từ chối khoá bắt đầu bằng $, không bao giờ đưa thẳng đối tượng từ request vào bộ lọc, băm mật khẩu.'],
    ['What happened in the 2017 MongoDB ransom wave?|||Làn sóng tống tiền MongoDB năm 2017 là gì?',
     'Tens of thousands of MongoDB servers reachable from the internet without authentication were found by scanning, their data deleted and replaced by a ransom note. Lessons: auth on, bind to private interfaces, firewall, never publish 27017 (Lessons 0.9, 9.1).|||Hàng chục nghìn máy MongoDB mở ra internet mà không xác thực bị quét ra, dữ liệu bị xoá và thay bằng một lời nhắn đòi tiền chuộc. Bài học: bật xác thực, chỉ nghe trên giao diện nội bộ, có tường lửa, không bao giờ mở cổng 27017 ra ngoài (Bài 0.9, 9.1).'],
    ['Which roles does your application user have?|||Tài khoản ứng dụng có những vai trò nào?',
     'readWrite on its own database at most — often a custom role with only the actions needed. Not root, not readWriteAnyDatabase; a separate user for backups and for migrations. Remember readWrite can drop collections (Lesson 9.2).|||Nhiều nhất là readWrite trên chính database của nó — thường là vai trò tự định nghĩa chỉ gồm các hành động cần dùng. Không root, không readWriteAnyDatabase; tài khoản riêng cho sao lưu và cho migration. Nhớ rằng readWrite xoá được collection (Bài 9.2).'],
  ]],
  ['Operations|||Vận hành', [
    ['How do you know your backups work?|||Làm sao biết bản sao lưu dùng được?',
     'Restore them automatically on a scratch server and check the exit code and per-collection counts against counts saved at backup time. Lesson 10.1 showed a truncated archive that still loaded several hundred orders before failing (Lesson 10.1: kiem-khoi-phuc.sh).|||Tự động khôi phục chúng lên một máy nháp và kiểm mã thoát cùng số tài liệu từng collection so với số đã lưu lúc sao lưu. Bài 10.1 cho thấy một archive bị cắt cụt vẫn nạp được vài trăm đơn trước khi báo lỗi (Bài 10.1: kiem-khoi-phuc.sh).'],
    ['Someone ran a bad deleteMany at 14:03. Walk me through recovery.|||Có người chạy nhầm deleteMany lúc 14:03. Kể cách khôi phục.',
     'Find the first delete entry in the oplog (timestamp, not wall clock); restore the backup from last night on a scratch server and replay the oplog with --oplogLimit at that timestamp; copy back only the missing documents so writes after 14:03 survive (Lab 10.7: 3,160/3,160).|||Tìm mục xoá đầu tiên trong oplog (dấu thời gian, không phải giờ đồng hồ); khôi phục bản sao lưu đêm qua lên máy nháp và phát lại oplog với --oplogLimit đúng dấu thời gian đó; chỉ chép lại những tài liệu bị thiếu để các lần ghi sau 14:03 còn nguyên (Lab 10.7: 3.160/3.160).'],
    ['What do you monitor and alert on?|||Bạn giám sát và cảnh báo những gì?',
     'Four groups: connections, cache (dirty/used vs size, evictions), replication (lag, oplog window), queues/latency (operation latency, tickets). Alert on symptoms users feel and on things that become outages: lag, oplog window, disk, connections near the limit (Lesson 10.2).|||Bốn nhóm: kết nối, cache (dirty/used so với cỡ, eviction), nhân bản (độ trễ, cửa sổ oplog), hàng đợi/độ trễ (độ trễ thao tác, ticket). Cảnh báo theo triệu chứng người dùng thấy và những thứ sẽ thành sự cố: độ trễ nhân bản, cửa sổ oplog, đĩa, kết nối sát giới hạn (Bài 10.2).'],
    ['Your data no longer fits in RAM. What changes?|||Dữ liệu không còn vừa RAM. Điều gì thay đổi?',
     'Reads outside the working set go to disk. Lesson 10.3: hot-key reads ran at about 7,000/s with p99 ~4 ms; uniformly random reads over data larger than the cache dropped to about 1,850/s with p99 ~73 ms. Fix by shrinking the working set (indexes, projections, archiving) or adding RAM/shards.|||Lần đọc ra ngoài working set phải xuống đĩa. Bài 10.3: đọc khoá nóng đạt khoảng 7.000/s, p99 ~4 ms; đọc rải đều trên dữ liệu lớn hơn cache tụt còn khoảng 1.850/s, p99 ~73 ms. Sửa bằng cách thu nhỏ working set (index, projection, lưu trữ dữ liệu cũ) hoặc thêm RAM/shard.'],
    ['How do you load-test a database API honestly?|||Đo tải một API CSDL thế nào cho trung thực?',
     'Open model at a target rate, report p50/p95/p99 against that rate, ramp until the break point, and avoid coordinated omission — a closed-loop tester hides a 2-second stall (Lesson 10.4). Write the machine and command next to every number.|||Mô hình mở theo một tốc độ mục tiêu, báo p50/p95/p99 theo tốc độ đó, tăng dần tới điểm gãy, và tránh coordinated omission — công cụ đo vòng kín che mất một lần đứng hình 2 giây (Bài 10.4). Ghi máy đo và lệnh cạnh mọi con số.'],
  ]],
];

let n = 0;
const banCau = (i) => CAU.map(([nhom, ds]) => `<h3>${t(nhom, i)}</h3>\n<ol start="${n + 1}">\n` + ds.map(([q, a]) => { n++; return `<li><strong>${t(q, i)}</strong>\n<details><summary>${i === 0 ? 'Model answer' : 'Đáp án mẫu'}</summary><p>${t(a, i)}</p></details></li>`; }).join('\n') + '\n</ol>').join('\n');
const cauEn = banCau(0); n = 0;
const cauVi = banCau(1);

const STAR_EN = `S — Lab 10.7 (CT Shop course lab): at 14:03 a deleteMany meant for an archive collection ran on orders; 1,120 orders gone; the shop kept taking orders.
T — Restore every deleted order without losing or rolling back anything written after 14:03.
A — Found the first applyOps delete entry in the oplog and used its timestamp, not "14:03"; restored the 02:00 backup on a memory-limited scratch
    container with --network none; replayed the oplog with --oplogLimit; inserted only the orders missing in production; turned it into one script.
R — Grader: 3,160/3,160, 0 missing, 0 wrong; about 13 s end to end. The naive restore with --drop would have lost 160 orders and reverted 260.
    Follow-up: personal production accounts read-only, delete scripts print a count and ask for confirmation, quarterly PITR drill.`;
const STAR_VI = `S — Lab 10.7 (lab của khoá, CT Shop): 14:03 một lệnh deleteMany định chạy trên collection lưu trữ lại chạy trên orders; mất 1.120 đơn; cửa hàng vẫn nhận đơn.
T — Khôi phục mọi đơn bị xoá mà không làm mất hay quay lui bất cứ thứ gì đã ghi sau 14:03.
A — Tìm mục applyOps xoá đầu tiên trong oplog và dùng dấu thời gian của nó, không dùng "14:03"; khôi phục bản 02:00 lên một container nháp có giới hạn
    bộ nhớ, --network none; phát lại oplog với --oplogLimit; chỉ insert các đơn production đang thiếu; gói thành một script.
R — Máy chấm: 3.160/3.160, thiếu 0, sai 0; khoảng 13 s từ đầu tới cuối. Cách ngây thơ restore --drop sẽ làm mất 160 đơn và quay lui 260 đơn.
    Việc tiếp theo: tài khoản cá nhân trên production chỉ đọc, script xoá in số lượng và hỏi xác nhận, diễn tập PITR mỗi quý.`;

export default {
  title: '11.3 — The MongoDB interview question bank|||11.3 — Ngân hàng câu hỏi phỏng vấn MongoDB',
  slug: 'mgo-11-3-phong-van',
  type: 'LESSON',
  isFreePreview: false,
  description: '40 câu phỏng vấn MongoDB chia 8 nhóm (nền tảng, schema, index, truy vấn, transaction, nhân bản/sharding, ứng dụng/bảo mật, vận hành), đáp án mẫu che sẵn và dẫn lại số đo thật của khoá; năm câu "chứng minh trong một phút" chạy thật (ObjectId mang thời gian, 0.1 + 0.2, mảng $all vs khớp nguyên mảng 1/5, dấu chấm vs $elemMatch 594/34, w:3 báo lỗi mà vẫn ghi); hai bài thiết kế trên bảng có đáp án; kể sự cố bằng STAR từ lab 14:03.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>The MongoDB interview question bank</h2>
<p class="lead">An interviewer is not checking whether you memorised the manual. They are checking whether you have <em>run</em> MongoDB: whether your answer has a number in it, a trade-off, and a "this is what I would check first". Every model answer here points back to something you measured in this course — use your own numbers when you answer.</p>
<p>Think of a driving instructor asking "what do you do when the car skids?" A candidate who read about it says "steer into the skid". A candidate who has felt it says "ease off, look where you want to go, and it took me about a second to stop over-correcting". The second answer gets the job.</p>

<h3>How to answer</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1. What</span><span class="lz-t">one sentence definition</span><span class="lz-d">"w:majority acknowledges after most data-bearing members have it"</span></div>
  <div class="lz-step"><span class="lz-k">2. Why it matters</span><span class="lz-t">the failure it prevents, with a number</span><span class="lz-d">"w:1 writes were rolled back when I killed the primary"</span></div>
  <div class="lz-step"><span class="lz-k">3. Trade-off</span><span class="lz-t">what it costs and when you would not</span><span class="lz-d">"latency of one replication round trip"</span></div>
  <div class="lz-step"><span class="lz-k">4. Proof</span><span class="lz-t">how you would verify it live</span><span class="lz-d">explain, a concurrent test, a drill</span></div>
</div>

<h3>Prove it in one minute — five live demos</h3>
<p>Interviewers love "show me". These five take seconds in mongosh and each answers a classic question better than words.</p>
${lenh(K, 0)}
<p>(1) An ObjectId carries its creation time — the first four bytes are seconds since 1970:</p>
${lenh(K, 1)}
<p>(2) Money as double vs Decimal128:</p>
${lenh(K, 2)}
<p>(3) Querying an array with an array literal matches the <em>whole array, in that order</em>; <code>$all</code> matches "contains both". 1 film vs 5 films:</p>
${lenh(K, 3)}
<p>(4) Dot notation on an array of sub-documents lets each condition match a different seat; <code>$elemMatch</code> requires the same seat. 594 vs 34 showtimes:</p>
${lenh(K, 4)}
<p>(5) A write concern the cluster cannot satisfy returns an error — but the write already happened on the primary and is <strong>not</strong> undone:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}

<div class="pitfall co-tieu-de">
<p><strong>Trap — treating a write concern error as "not written".</strong> The demo inserted one document and got <code>MongoWriteConcernError</code>; the count is 1. If your API retries blindly on that error you create duplicates. Make writes idempotent (a natural unique key, or upsert) and treat write concern errors as "unknown outcome".</p>
</div>

<h3>The 40 questions</h3>
<p>Try each out loud before opening the model answer. Time yourself: a good answer takes 30–90 seconds.</p>
${cauEn}

<h3>Whiteboard design 1 — a cinema booking system</h3>
<p>"Design the MongoDB data model for a cinema chain: 200 cinemas, 5,000 showtimes a day, seats chosen on a map, no double-booking, a monthly revenue report." (You already built a small version in Lesson 11.2.)</p>
${loiGiai('Show a model answer', `<ul>
<li><strong>Queries first:</strong> showtimes of a film at a cinema from now (hot), seat map of one showtime (hot), book seats (critical), my tickets (paged), revenue by cinema per month (nightly).</li>
<li><strong>showtimes</strong> with seats embedded (≤ ~300 per hall — bounded) ⇒ the seat map is one read and booking is one atomic conditional update on one document. Index <code>{ filmId, cinemaId, startsAt }</code> (ESR).</li>
<li><strong>tickets</strong> separate (unbounded per customer), extended reference of cinemaId, filmId, startsAt and price at purchase. Index <code>{ customerId, createdAt: -1, _id: -1 }</code> for keyset paging.</li>
<li><strong>Holds:</strong> seat state HELD with expiry, accepted as free once expired inside the same conditional filter.</li>
<li><strong>Report:</strong> pipeline on tickets with Vietnam time zone, results <code>$merge</code>d into a monthly collection nightly.</li>
<li><strong>Scale:</strong> 5,000 showtimes/day is small; one replica set. If ever sharded: showtimes by <code>{ cinemaId, startsAt }</code> (bookings target one shard), tickets hashed by customerId.</li>
<li><strong>What I would ask:</strong> group bookings across showtimes? refunds? — they change the invariant.</li>
</ul>`)}

<h3>Whiteboard design 2 — a social feed</h3>
<p>"Users post, follow others, and see a feed of the latest posts from people they follow. Some users have 2 million followers."</p>
${loiGiai('Show a model answer', `<ul>
<li>posts collection; follows as one document per edge <code>{ follower, followee }</code> with both indexes — never a followers array in the user (unbounded: the outlier pattern problem).</li>
<li>Feed: fan-out on write into a per-user feed bucket (bucket pattern, e.g. 200 entries per document) for normal authors; fan-out on read for celebrities (outlier pattern) and merge at read time.</li>
<li>Counts (likes, followers) as computed fields updated with <code>$inc</code>, not counted on every read.</li>
<li>Paging by keyset on <code>(createdAt, _id)</code>. TTL or archiving for old feed buckets.</li>
<li>Compare out loud: in PostgreSQL the follow graph is natural; the feed buckets are where documents help.</li>
</ul>`)}

<h3>Tell an incident with STAR</h3>
<p>"Tell me about a time something went wrong" is guaranteed. If you have no work incident yet, a lab you really ran is honest and acceptable — say it was a lab. Situation, Task, Action, Result, with numbers:</p>
${ma('text', STAR_EN)}

<h3>On the job</h3>
<p>At FPT Software and most outsourcing companies the technical round is often run by the team lead of the project you would join, sometimes with a client engineer listening. They ask about what the project uses. Before the interview, read the job description for "MongoDB", "Mongoose", "Spring Data" and pick the 10 questions above that match — then rehearse those with your project open.</p>

<h3>Key terms</h3>
${kv([
  ['STAR', 'Situation, Task, Action, Result — a structure for telling an incident with numbers'],
  ['Idempotent write', 'A write that gives the same result if applied twice — safe to retry after an unknown outcome'],
  ['Fan-out on write / read', 'Copy a post into followers’ feeds when posted, or assemble the feed when read'],
  ['Outlier pattern', 'Handle the few huge cases (celebrity, viral product) differently from the many normal ones'],
])}

<h3>Summary</h3>
<ul>
<li>A strong answer: what, why with a number, trade-off, how you would prove it.</li>
<li>Have five one-minute demos ready: ObjectId time, Decimal128, $all, $elemMatch, write concern errors.</li>
<li>Design questions start from queries and bounded growth, end with what you would ask the client.</li>
<li>Tell one real incident (or lab) with STAR and numbers.</li>
</ul>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-bao-ve-du-an', title: 'MongoDB course · Finish & defend your course project', sub: 'the committee questions about your own project' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-17-4-chon-he-nao', title: 'PostgreSQL course · 17.4 — Which database to choose', sub: 'the same question from the PostgreSQL side' })}
${nguon('📘', 'MongoDB Docs — Write concern', 'w, j, wtimeout; a write concern error does not mean the write was not applied', 'https://www.mongodb.com/docs/manual/reference/write-concern/')}
${nguon('📘', 'MongoDB Docs — ObjectId', '4-byte timestamp, 5-byte random value, 3-byte counter', 'https://www.mongodb.com/docs/manual/reference/method/ObjectId/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Ngân hàng câu hỏi phỏng vấn MongoDB</h2>
<p class="lead">Người phỏng vấn không kiểm bạn có thuộc tài liệu hay không. Họ kiểm xem bạn đã thật sự <em>chạy</em> MongoDB chưa: câu trả lời có con số không, có đánh đổi không, có câu "việc đầu tiên tôi sẽ kiểm là…" không. Mọi đáp án mẫu ở đây đều dẫn về thứ bạn đã đo trong khoá — khi trả lời, hãy dùng con số của chính bạn.</p>
<p>Hãy nghĩ tới thầy dạy lái hỏi "xe bị trượt bánh thì em làm gì?". Người chỉ đọc sách nói "đánh lái theo hướng trượt". Người đã từng trải nói "nhả ga, nhìn về chỗ mình muốn tới, và em mất khoảng một giây mới thôi đánh lái quá tay". Người thứ hai được nhận.</p>

<h3>Trả lời thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1. Là gì</span><span class="lz-t">một câu định nghĩa</span><span class="lz-d">"w:majority xác nhận khi đa số thành viên mang dữ liệu đã có lần ghi"</span></div>
  <div class="lz-step"><span class="lz-k">2. Vì sao quan trọng</span><span class="lz-t">sự cố nó ngăn, kèm con số</span><span class="lz-d">"lần ghi w:1 bị rollback khi tôi giết primary"</span></div>
  <div class="lz-step"><span class="lz-k">3. Đánh đổi</span><span class="lz-t">nó tốn gì và khi nào không dùng</span><span class="lz-d">"độ trễ thêm một vòng nhân bản"</span></div>
  <div class="lz-step"><span class="lz-k">4. Chứng minh</span><span class="lz-t">bạn kiểm trực tiếp thế nào</span><span class="lz-d">explain, bài thử đồng thời, diễn tập</span></div>
</div>

<h3>Chứng minh trong một phút — năm demo chạy thật</h3>
<p>Người phỏng vấn rất thích "cho tôi xem". Năm demo này chạy vài giây trong mongosh, mỗi cái trả lời một câu kinh điển tốt hơn lời nói.</p>
${lenh(K, 0)}
<p>(1) ObjectId mang theo thời điểm tạo — bốn byte đầu là số giây tính từ 1970:</p>
${lenh(K, 1)}
<p>(2) Tiền kiểu double so với Decimal128:</p>
${lenh(K, 2)}
<p>(3) Truy vấn mảng bằng một mảng viết sẵn sẽ khớp <em>nguyên cả mảng, đúng thứ tự</em>; <code>$all</code> khớp "có chứa cả hai". 1 phim so với 5 phim:</p>
${lenh(K, 3)}
<p>(4) Dấu chấm trên mảng tài liệu con cho phép mỗi điều kiện khớp một ghế khác nhau; <code>$elemMatch</code> bắt cùng một ghế. 594 so với 34 suất:</p>
${lenh(K, 4)}
<p>(5) Write concern mà cụm không đáp ứng được sẽ báo lỗi — nhưng lần ghi đã xảy ra trên primary và <strong>không</strong> bị hoàn tác:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — coi lỗi write concern là "chưa ghi".</strong> Demo chèn một tài liệu và nhận <code>MongoWriteConcernError</code>; đếm ra 1. Nếu API của bạn cứ thấy lỗi đó là thử lại mù quáng thì sẽ sinh bản trùng. Hãy làm lần ghi idempotent (một khoá duy nhất tự nhiên, hoặc upsert) và coi lỗi write concern là "chưa rõ kết quả".</p>
</div>

<h3>40 câu hỏi</h3>
<p>Thử trả lời thành tiếng từng câu trước khi mở đáp án mẫu. Bấm giờ: một câu trả lời tốt mất 30–90 giây.</p>
${cauVi}

<h3>Thiết kế trên bảng 1 — hệ thống đặt vé xem phim</h3>
<p>"Thiết kế mô hình dữ liệu MongoDB cho một chuỗi rạp: 200 rạp, 5.000 suất chiếu mỗi ngày, chọn ghế trên sơ đồ, không bán trùng ghế, báo cáo doanh thu theo tháng." (Bạn đã làm một phiên bản nhỏ ở Bài 11.2.)</p>
${loiGiai('Xem đáp án mẫu', `<ul>
<li><strong>Truy vấn trước:</strong> lịch chiếu một phim ở một rạp từ bây giờ (nóng), sơ đồ ghế một suất (nóng), đặt ghế (then chốt), vé của tôi (phân trang), doanh thu theo rạp theo tháng (chạy đêm).</li>
<li><strong>showtimes</strong> nhúng ghế (≤ khoảng 300 ghế mỗi phòng — có giới hạn) ⇒ sơ đồ ghế là một lần đọc, đặt ghế là một lệnh cập nhật có điều kiện nguyên tử trên một tài liệu. Index <code>{ filmId, cinemaId, startsAt }</code> (ESR).</li>
<li><strong>tickets</strong> tách riêng (mỗi khách không giới hạn số vé), extended reference cinemaId, filmId, startsAt và giá lúc mua. Index <code>{ customerId, createdAt: -1, _id: -1 }</code> cho phân trang keyset.</li>
<li><strong>Giữ ghế:</strong> trạng thái HELD kèm giờ hết hạn, hết hạn thì coi như trống ngay trong bộ lọc có điều kiện.</li>
<li><strong>Báo cáo:</strong> pipeline trên tickets theo múi giờ Việt Nam, kết quả <code>$merge</code> vào collection theo tháng mỗi đêm.</li>
<li><strong>Quy mô:</strong> 5.000 suất/ngày là nhỏ; một replica set là đủ. Nếu có ngày phải shard: showtimes theo <code>{ cinemaId, startsAt }</code> (đặt vé nhắm một shard), tickets hashed theo customerId.</li>
<li><strong>Tôi sẽ hỏi lại:</strong> có đặt nhóm qua nhiều suất không? hoàn tiền thế nào? — chúng làm đổi bất biến.</li>
</ul>`)}

<h3>Thiết kế trên bảng 2 — bảng tin mạng xã hội</h3>
<p>"Người dùng đăng bài, theo dõi người khác, và xem bảng tin gồm bài mới nhất của những người họ theo dõi. Có người có 2 triệu người theo dõi."</p>
${loiGiai('Xem đáp án mẫu', `<ul>
<li>Collection posts; quan hệ theo dõi là mỗi cạnh một tài liệu <code>{ follower, followee }</code> có index cả hai chiều — không bao giờ để mảng followers trong user (không giới hạn: đúng bài toán của outlier pattern).</li>
<li>Bảng tin: fan-out lúc ghi vào bucket bảng tin của từng người (bucket pattern, ví dụ 200 mục một tài liệu) với tác giả bình thường; fan-out lúc đọc với người nổi tiếng (outlier pattern) rồi trộn khi đọc.</li>
<li>Số đếm (lượt thích, người theo dõi) là trường tính sẵn cập nhật bằng <code>$inc</code>, không đếm lại mỗi lần đọc.</li>
<li>Phân trang keyset theo <code>(createdAt, _id)</code>. TTL hoặc lưu trữ cho bucket bảng tin cũ.</li>
<li>So sánh thành tiếng: trong PostgreSQL đồ thị theo dõi là tự nhiên; bucket bảng tin mới là chỗ tài liệu có lợi.</li>
</ul>`)}

<h3>Kể một sự cố theo STAR</h3>
<p>Câu "kể về một lần mọi thứ hỏng" chắc chắn sẽ có. Nếu chưa có sự cố ở chỗ làm, một lab bạn đã chạy thật là trung thực và chấp nhận được — hãy nói rõ đó là lab. Tình huống, Nhiệm vụ, Hành động, Kết quả, kèm con số:</p>
${ma('text', STAR_VI)}

<h3>Khi đi làm</h3>
<p>Ở FPT Software và phần lớn công ty outsourcing, vòng kỹ thuật thường do trưởng nhóm của dự án bạn sẽ vào phỏng vấn, đôi khi có cả kỹ sư phía khách ngồi nghe. Họ hỏi về thứ dự án đang dùng. Trước buổi phỏng vấn, đọc mô tả công việc tìm "MongoDB", "Mongoose", "Spring Data" rồi chọn 10 câu bên trên khớp nhất — tập đúng các câu đó khi mở sẵn dự án của bạn.</p>

<h3>Thuật ngữ</h3>
${kv([
  ['STAR', 'Tình huống, Nhiệm vụ, Hành động, Kết quả — khung kể sự cố có con số'],
  ['Ghi idempotent', 'Lần ghi áp hai lần vẫn cho cùng kết quả — thử lại an toàn khi chưa rõ kết quả'],
  ['Fan-out lúc ghi / lúc đọc', 'Chép bài vào bảng tin người theo dõi khi đăng, hoặc ghép bảng tin khi đọc'],
  ['Outlier pattern', 'Xử lý riêng vài trường hợp khổng lồ (người nổi tiếng, sản phẩm gây sốt) khác với số đông bình thường'],
])}

<h3>Tóm tắt</h3>
<ul>
<li>Câu trả lời mạnh: là gì, vì sao kèm con số, đánh đổi, chứng minh thế nào.</li>
<li>Chuẩn bị sẵn năm demo một phút: thời gian trong ObjectId, Decimal128, $all, $elemMatch, lỗi write concern.</li>
<li>Câu thiết kế bắt đầu từ truy vấn và tăng trưởng có giới hạn, kết thúc bằng câu bạn sẽ hỏi lại khách.</li>
<li>Kể một sự cố thật (hoặc lab) theo STAR có con số.</li>
</ul>
${lienKet({ khoa: 'mongodb', bai: 'mgo-bao-ve-du-an', title: 'Khoá MongoDB · Hoàn thiện & bảo vệ dự án cuối khoá', sub: 'những câu hội đồng hỏi về chính dự án của bạn' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-4-chon-he-nao', title: 'Khoá PostgreSQL · 17.4 — Chọn hệ CSDL nào', sub: 'cùng câu hỏi nhìn từ phía PostgreSQL' })}
${nguon('📘', 'MongoDB Docs — Write concern', 'w, j, wtimeout; lỗi write concern không có nghĩa là lần ghi chưa được áp dụng', 'https://www.mongodb.com/docs/manual/reference/write-concern/')}
${nguon('📘', 'MongoDB Docs — ObjectId', '4 byte dấu thời gian, 5 byte ngẫu nhiên, 3 byte bộ đếm', 'https://www.mongodb.com/docs/manual/reference/method/ObjectId/')}
</div>
`,
};
