/**
 * MongoDB chuyên sâu — khoá học CuongThai (Courses, Cơ sở dữ liệu). KHUNG dựng 24/11/2026 (agent mgo, P1 trong bảng khoảng
 * trống kho 20/11: "MongoDB chuyên sâu ~8 chương"). Bài chưa soạn hiện "Đang soạn". Kế hoạch soạn (bảng phủ, kiểm trùng,
 * môi trường lab, nguồn, thứ tự): content/courses/mongodb/_KE-HOACH.md.
 *
 * KHÔNG TRÙNG khoá cũ — chỗ đã dạy thì liên kết chéo, ở đây dạy sâu hơn từ góc MongoDB:
 *   Academy SDN302 Ch3 (CRUD + Mongoose mức môn học, bẫy PE), 8.1 (aggregation nhập môn), 8.2 (index mức production checklist)
 *   · postgresql 13.1–13.2 (JSONB + GIN), 17.3 (MongoDB vs JSONB cùng một bài toán), 17.4 (chọn hệ nào)
 *   · spring-boot Ch20 (sb-20-1…20-5: @Document, MongoRepository, MongoTemplate, explain, aggregation cơ bản, Mongo cạnh PostgreSQL)
 *     ⇒ Chương 8 ở đây chỉ một bài Spring Data "sau phần cơ bản" · web-security 1.2 (NoSQL injection) còn KHUNG ⇒ dạy đủ ở 9.3
 *   · nodejs (dùng PostgreSQL làm CSDL chính; Ch12 Redis) · redis (cache trước MongoDB) · system-design · web-security.
 * Mọi lệnh + output CHẠY THẬT (MongoDB 8.0 trong Docker, container mgo-*): ./mongodb/_ma.mjs (SINH, không sửa tay).
 * Ảnh bìa: CHƯA sinh — điều phối chạy scripts/course-cover.mjs --slug mongodb --icon mongodb --color 47A248
 *   --title "MongoDB" --subtitle "Schema → Sharding" (đường thumbnailUrl dưới đây đặt sẵn theo quy ước).
 */
import { khung } from './_chung/khung.mjs';
// Bài đã soạn chi tiết: mỗi tệp chương xuất { lessons: [...] }; bài nào có ở đây thì THAY bài khung cùng slug
// (giữ nguyên thứ tự + tiêu đề chương của khung — seeder neo bằng chúng). Bài chưa soạn vẫn hiện "Đang soạn".
import S00 from './mongodb/s00-bat-dau.mjs';
import S01 from './mongodb/s01-tai-lieu-bson.mjs';
import S02 from './mongodb/s02-crud-truy-van.mjs';
import S03 from './mongodb/s03-thiet-ke-schema.mjs';
import S04 from './mongodb/s04-index-explain.mjs';
import S05 from './mongodb/s05-aggregation.mjs';
import S06 from './mongodb/s06-transaction.mjs';
import S07 from './mongodb/s07-replica-sharding.mjs';
import S08 from './mongodb/s08-ung-dung.mjs';
import S09 from './mongodb/s09-bao-mat.mjs';
import S10 from './mongodb/s10-van-hanh.mjs';
import S11 from './mongodb/s11-du-an-phong-van.mjs';
// Dự án xuyên suốt khoá (docs/du-an-hop-dong.md v1): duAn + bài mốc mgo-moc-N (trước quiz chương) + bài mgo-bao-ve-du-an.
import duAn, { baiMoc, baiBaoVe, MOC_THEO_CHUONG } from './mongodb/_du-an.mjs';

function thay(sections, chuong) {
  const moi = new Map(chuong.flatMap((c) => c.lessons).map((l) => [l.slug, l]));
  const conLai = new Set(moi.keys());
  const kq = sections.map((sec) => ({ ...sec, lessons: sec.lessons.map((l) => { conLai.delete(l.slug); return moi.get(l.slug) ?? l; }) }));
  if (conLai.size) throw new Error(`mongodb: bài soạn không khớp slug khung: ${[...conLai].join(', ')}`);
  return kq;
}

const KHUNG = khung('mgo', [
  ['Section 0 — Start here', 'Mục 0 — Bắt đầu tại đây', 'MongoDB là gì, ra đời thế nào, ai dùng; khi nào chọn MongoDB thay PostgreSQL và khi nào KHÔNG; dựng lab MongoDB 8.0 bằng Docker với bộ dữ liệu CT Shop; đăng ký đề tài dự án xuyên khoá.', [
    ['bat-dau-tai-day', 'Start here (1/2) — What MongoDB is, where it came from, and who runs it', 'Bắt đầu tại đây (1/2) — MongoDB là gì, ra đời thế nào, và ai đang chạy nó', 'Tài liệu thay cho hàng · 10gen 2007 → mã nguồn mở 2009 → MongoDB Inc. 2013 → SSPL 2018 · Ai dùng (có nguồn) · Nếm thử ba câu lệnh'],
    ['bat-dau-hoc-the-nao', 'Start here (2/2) — What you need first, what you can do after, and a real disaster', 'Bắt đầu tại đây (2/2) — Cần biết gì trước, học xong làm được gì, và một thảm hoạ thật', 'Nền cần trước · Làn sóng tống tiền 2017 tái hiện trên máy bạn · Học kèm khoá nào · Lộ trình và nhịp học'],
    ['mongo-hay-postgres', 'MongoDB or PostgreSQL? When to choose MongoDB, and when not to', 'MongoDB hay PostgreSQL? Khi nào chọn MongoDB, và khi nào KHÔNG', 'Dữ liệu nhiều hình dạng · Một đơn = một tài liệu · Không khoá ngoại, không bắt lỗi gõ tên trường (chạy thật hai bên) · Bảng quyết định'],
    ['moi-truong-lab', 'Your lab: MongoDB 8.0 in Docker, mongosh and the CT Shop dataset', 'Môi trường lab: MongoDB 8.0 trong Docker, mongosh và bộ dữ liệu CT Shop', 'compose.yaml một thành viên replica set · Chỉ mở 127.0.0.1 · mongosh và Compass · Nạp dữ liệu tất định'],
    ['quiz', 'Section 0 quiz', 'Kiểm tra Mục 0', '10 câu: lịch sử, khi nào chọn Mongo, an toàn lab'],
  ]],
  ['Chapter 1 — The document model and BSON', 'Chương 1 — Mô hình tài liệu và BSON', 'Tài liệu, collection, database và _id; kiểu BSON và bẫy tiền tệ; giới hạn 16 MB; schema linh hoạt nhưng có kiểm; bên trong WiredTiger.', [
    ['tai-lieu-collection', 'Documents, collections, databases — and _id', 'Tài liệu, collection, database — và _id', 'JSON vs BSON · ObjectId mang thời gian · _id tự chọn · Giới hạn 16 MB, độ sâu 100, tên trường'],
    ['bson-kieu-du-lieu', 'BSON types: Date, Decimal128, int vs double and the money trap', 'Kiểu BSON: Date, Decimal128, int với double và bẫy tiền', '0.1 + 0.2 trong double · Decimal128 cho tiền · Date là UTC · $type và so sánh khác kiểu'],
    ['schema-validation', 'Flexible schema is not no schema: $jsonSchema validation', 'Schema linh hoạt không phải không có schema: kiểm bằng $jsonSchema', 'validator · validationLevel/Action · Bắt lỗi gõ tên trường · Tiến hoá schema an toàn'],
    ['wiredtiger', 'Inside the server: WiredTiger, cache, journal and compression', 'Bên trong máy chủ: WiredTiger, bộ đệm, journal và nén', 'Khoá mức tài liệu · Cache 50% RAM − 1 GB · Checkpoint 60 s + journal · snappy/zstd'],
    ['lab', 'Lab: model a catalog with validation', 'Lab: mô hình hoá danh mục có kiểm hợp lệ', 'Đề + rubric · Lời giải che'],
    ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu có giải thích'],
  ]],
  ['Chapter 2 — CRUD and advanced queries', 'Chương 2 — CRUD và truy vấn nâng cao', 'Ghi, đọc, sửa, xoá đúng cách và mọi toán tử truy vấn hay dùng khi đi làm.', [
    ['insert', 'Inserting: insertOne, insertMany, ordered and duplicate keys', 'Chèn: insertOne, insertMany, ordered và trùng khoá', 'Kết quả ghi · ordered:false · E11000 · Chèn lô'],
    ['truy-van', 'Finding: comparison and logical operators, projection', 'Tìm: toán tử so sánh, logic và projection', '$eq $gt $in $nin · $and $or $not $nor · $exists $type · Chiếu trường'],
    ['mang-long', 'Arrays and embedded documents: dot notation and $elemMatch', 'Mảng và tài liệu lồng: dấu chấm và $elemMatch', 'Khớp phần tử · $all $size · Toán tử vị trí $ · Bẫy điều kiện rơi vào hai phần tử khác nhau'],
    ['cap-nhat', 'Updating: operators, upsert, arrayFilters and pipeline updates', 'Cập nhật: toán tử, upsert, arrayFilters và cập nhật bằng pipeline', '$set $inc $unset $push $addToSet $pull · $[] $[x] · upsert · Thay cả tài liệu (bẫy)'],
    ['xoa-nguyen-tu', 'Deleting, findOneAndUpdate and bulkWrite', 'Xoá, findOneAndUpdate và bulkWrite', 'Bộ đếm nguyên tử · Giữ chỗ hàng tồn · bulkWrite có thứ tự/không · Xoá mềm'],
    ['sap-xep-phan-trang', 'Sorting, Vietnamese collation and keyset pagination', 'Sắp xếp, collation tiếng Việt và phân trang keyset', 'Collation vi · skip tốn kém thế nào (đo thật) · Phân trang theo con trỏ'],
    ['lab', 'Lab: the CT Shop order API queries', 'Lab: bộ truy vấn API đơn hàng CT Shop', 'Đề + rubric · Lời giải che'],
    ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu có giải thích'],
  ]],
  ['Chapter 3 — Schema design', 'Chương 3 — Thiết kế schema', 'Nhúng hay tham chiếu theo cách ứng dụng đọc dữ liệu, các pattern chuẩn và các anti-pattern làm sập hệ thống.', [
    ['nhung-hay-tham-chieu', 'Embed or reference? Design for how the app reads', 'Nhúng hay tham chiếu? Thiết kế theo cách ứng dụng đọc', 'Cùng đọc thì để cùng nhau · Bảng câu hỏi quyết định · So với chuẩn hoá SQL'],
    ['quan-he', 'One-to-few, one-to-many, one-to-squillions, many-to-many', 'Một–vài, một–nhiều, một–vô số, nhiều–nhiều', 'Mảng con trỏ hai chiều · Tham chiếu ngược · Khi nào cần collection nối'],
    ['pattern-1', 'Patterns I: attribute, extended reference, subset, computed', 'Pattern I: attribute, extended reference, subset, computed', 'Chép một phần dữ liệu có chủ đích · Giữ đồng bộ bản chép · Đo cỡ tài liệu'],
    ['pattern-2', 'Patterns II: bucket, outlier, polymorphic, schema versioning, tree', 'Pattern II: bucket, outlier, polymorphic, schema versioning, cây', 'Gom dữ liệu thời gian · Ngoại lệ "người nổi tiếng" · Đổi schema không dừng hệ thống'],
    ['anti-pattern', 'Anti-patterns that take production down', 'Anti-pattern làm sập production', 'Mảng không giới hạn · Tài liệu phình · Quá nhiều collection · $lookup khắp nơi · Câu chuyện Discord 2015'],
    ['lab', 'Lab: design the CT Shop schema from user stories', 'Lab: thiết kế schema CT Shop từ user story', 'Đề + rubric · Bảo vệ thiết kế'],
    ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu có giải thích'],
  ]],
  ['Chapter 4 — Indexes and explain', 'Chương 4 — Index và explain', 'Index B-tree, compound theo luật ESR, các loại index đặc biệt, đọc explain và tìm truy vấn chậm — đo thật trên dữ liệu lớn.', [
    ['index-la-gi', 'How an index works: COLLSCAN vs IXSCAN, measured', 'Index hoạt động thế nào: COLLSCAN với IXSCAN, đo thật', 'B-tree · Một triệu tài liệu · Thời gian trước/sau · Chi phí ghi'],
    ['explain', 'Reading explain("executionStats")', 'Đọc explain("executionStats")', 'winningPlan · totalKeysExamined/totalDocsExamined/nReturned · Kế hoạch bị loại · Plan cache'],
    ['compound-esr', 'Compound indexes and the ESR rule', 'Index phức hợp và luật ESR', 'Thứ tự trường · Tiền tố · Equality–Sort–Range · Sắp xếp trong bộ nhớ'],
    ['index-dac-biet', 'Multikey, text, wildcard, partial, sparse, TTL, unique, hidden', 'Multikey, text, wildcard, partial, sparse, TTL, unique, hidden', 'Index trên mảng · Index một phần · TTL tự xoá · Ẩn index trước khi xoá'],
    ['covered-chi-phi', 'Covered queries, index cost and unused indexes', 'Truy vấn được phủ, cái giá của index và index thừa', 'PROJECTION_COVERED · $indexStats · Ghi chậm đi bao nhiêu (đo)'],
    ['truy-van-cham', 'Finding slow queries: profiler, slow query log, currentOp', 'Tìm truy vấn chậm: profiler, log truy vấn chậm, currentOp', 'slowms · system.profile · killOp · Quy trình điều tra'],
    ['lab', 'Lab: make five slow CT Shop queries fast', 'Lab: làm nhanh năm truy vấn chậm của CT Shop', 'Đề + rubric · Số đo trước/sau'],
    ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu có giải thích'],
  ]],
  ['Chapter 5 — The aggregation pipeline', 'Chương 5 — Aggregation pipeline', 'Báo cáo và biến đổi dữ liệu ngay trong MongoDB: các stage, $lookup, biểu thức, window function và tối ưu pipeline.', [
    ['pipeline-co-ban', 'Pipeline basics: $match, $project, $group, $sort', 'Pipeline cơ bản: $match, $project, $group, $sort', 'Dây chuyền xử lý · Bộ tích luỹ · So với GROUP BY'],
    ['unwind-lookup', '$unwind and $lookup: joins, and what they cost', '$unwind và $lookup: nối, và cái giá của nó', 'Trải mảng · $lookup có pipeline · Index phía được nối · Đo'],
    ['bieu-thuc', 'Expressions: $cond, dates, $facet and $bucket', 'Biểu thức: $cond, ngày tháng, $facet và $bucket', '$dateTrunc theo múi giờ Việt Nam · Nhiều báo cáo một lượt · Chia khoảng'],
    ['window', 'Window functions with $setWindowFields', 'Hàm cửa sổ với $setWindowFields', 'Luỹ kế · Xếp hạng · Trung bình trượt'],
    ['toi-uu', 'Optimizing pipelines, the 100 MB limit, $merge and $out', 'Tối ưu pipeline, giới hạn 100 MB, $merge và $out', 'Thứ tự stage · explain pipeline · allowDiskUse · View vật chất hoá'],
    ['lab', 'Lab: the CT Shop sales dashboard', 'Lab: bảng điều khiển doanh số CT Shop', 'Đề + rubric · Lời giải che'],
    ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu có giải thích'],
  ]],
  ['Chapter 6 — Transactions and consistency', 'Chương 6 — Transaction và tính nhất quán', 'Nguyên tử trong một tài liệu, transaction nhiều tài liệu, write concern, read concern, read preference — "đã lưu" thật sự nghĩa là gì.', [
    ['nguyen-tu-mot-tai-lieu', 'Single-document atomicity and concurrent updates', 'Nguyên tử trong một tài liệu và cập nhật đồng thời', 'Trừ kho không âm bằng một lệnh · Lost update · Khoá lạc quan bằng version'],
    ['transaction', 'Multi-document transactions: sessions, retries and limits', 'Transaction nhiều tài liệu: session, thử lại và giới hạn', 'withTransaction · TransientTransactionError · 60 giây · Khi nào KHÔNG cần'],
    ['write-concern', 'Write concern: what "saved" really means', 'Write concern: "đã lưu" thật sự nghĩa là gì', 'w:1 · w:"majority" · j:true · wtimeout · Mất dữ liệu khi chuyển dự phòng'],
    ['read-concern', 'Read concern, read preference and causal consistency', 'Read concern, read preference và nhất quán nhân quả', 'local/majority/snapshot/linearizable · Đọc từ secondary thấy dữ liệu cũ · Jepsen 2020'],
    ['lab', 'Lab: transfers and stock reservations that never go negative', 'Lab: chuyển tiền và giữ hàng không bao giờ âm', 'Đề + rubric · Bắn đồng thời'],
    ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu có giải thích'],
  ]],
  ['Chapter 7 — Replica sets and sharding', 'Chương 7 — Replica set và sharding', 'Chạy thật cụm ba máy và cụm shard bằng Docker Compose: oplog, bầu chọn, chuyển dự phòng, shard key, balancer.', [
    ['replica-set', 'Replica sets: oplog, elections and a three-node cluster', 'Replica set: oplog, bầu chọn và cụm ba máy', 'Docker Compose ba thành viên · Đọc oplog · Độ trễ nhân bản'],
    ['failover', 'Failover for real: kill the primary, rollback and majority', 'Chuyển dự phòng thật: giết primary, rollback và majority', 'Thời gian bầu lại · Ứng dụng thấy gì · Ghi w:1 bị rollback'],
    ['thanh-vien', 'Member types: hidden, delayed, arbiter traps, priority', 'Loại thành viên: hidden, delayed, bẫy arbiter, priority', 'Bản trễ một giờ cứu xoá nhầm · Vì sao tránh arbiter · Đặt máy khác vùng'],
    ['sharding', 'Sharding: mongos, config servers, chunks and the balancer', 'Sharding: mongos, config server, chunk và balancer', 'Khi nào thật sự cần · Dựng cụm shard bằng Compose · Chia dữ liệu'],
    ['shard-key', 'Choosing a shard key: cardinality, frequency, monotonic keys', 'Chọn shard key: số giá trị, tần suất, khoá tăng dần', 'Hashed vs range · Truy vấn nhắm đích vs phát tán · Reshard · Zone'],
    ['lab', 'Lab: survive a node failure without losing an order', 'Lab: sống sót khi mất một máy mà không mất đơn hàng', 'Đề + rubric · Kịch bản sự cố'],
    ['quiz', 'Chapter 7 quiz', 'Kiểm tra Chương 7', '10 câu có giải thích'],
  ]],
  ['Chapter 8 — From applications: Node.js, Mongoose and Spring Data MongoDB', 'Chương 8 — Từ ứng dụng: Node.js, Mongoose và Spring Data MongoDB', 'Driver chính thức, Mongoose cho Node.js và Spring Data MongoDB cho Java — dùng đúng và tránh các bẫy hiệu năng.', [
    ['driver-node', 'The official Node.js driver: connection strings and the pool', 'Driver Node.js chính thức: chuỗi kết nối và pool', 'MongoClient một lần · maxPoolSize · directConnection · Timeout'],
    ['mongoose', 'Mongoose: schemas, validation, middleware, lean and populate', 'Mongoose: schema, kiểm hợp lệ, middleware, lean và populate', 'populate vs $lookup (đo) · lean nhanh bao nhiêu · strictQuery'],
    ['mongoose-nang-cao', 'Mongoose in production: transactions, discriminators, indexes', 'Mongoose khi chạy thật: transaction, discriminator, index', 'autoIndex tắt ở production · N+1 populate · Lỗi trùng khoá thành 409'],
    ['spring-data', 'Spring Data MongoDB beyond the basics: transactions, Decimal128, bulk and auditing', 'Spring Data MongoDB sau phần cơ bản: transaction, Decimal128, ghi lô và auditing', 'Phần cơ bản đã ở spring-boot Ch20 (liên kết) · @Transactional cần replica set · BigDecimal ⇄ Decimal128 · BulkOperations · Auditing + version'],
    ['lab', 'Lab: one API, two stacks (Express + Spring Boot)', 'Lab: một API, hai nền tảng (Express + Spring Boot)', 'Đề + rubric · Kiểm bằng cùng bộ test'],
    ['quiz', 'Chapter 8 quiz', 'Kiểm tra Chương 8', '10 câu có giải thích'],
  ]],
  ['Chapter 9 — Security', 'Chương 9 — Bảo mật', 'Từ làn sóng tống tiền 2017 tới NoSQL injection: xác thực, phân quyền, mạng, mã hoá và kiểm toán — tấn công thật rồi vá.', [
    ['su-co-that', 'Real incidents: the 2017 ransom wave and CVE-2025-14847', 'Sự cố thật: làn sóng tống tiền 2017 và CVE-2025-14847', 'Shodan tìm máy mở · Kẻ tấn công làm gì từng bước · Lộ bộ nhớ qua zlib · Vá và kiểm phiên bản'],
    ['xac-thuc-phan-quyen', 'Authentication, users, roles and least privilege', 'Xác thực, người dùng, vai trò và quyền tối thiểu', 'SCRAM · Vai trò có sẵn và tự định nghĩa · Mỗi ứng dụng một tài khoản · bindIp + TLS'],
    ['nosql-injection', 'NoSQL injection: operator injection, $where and regex DoS', 'NoSQL injection: chèn toán tử, $where và regex DoS', 'Đăng nhập bằng {"$ne": null} (tấn công thật trên lab) · sanitizeFilter · Kiểm kiểu đầu vào'],
    ['ma-hoa-kiem-toan', 'Encryption, field-level encryption and auditing', 'Mã hoá, mã hoá theo trường và kiểm toán', 'TLS · Mã hoá lúc lưu · CSFLE và Queryable Encryption · Ghi vết ai làm gì'],
    ['lab', 'Lab: break into a vulnerable API, then fix it', 'Lab: đột nhập một API có lỗ hổng rồi vá', 'Đề + rubric · Danh sách kiểm bảo mật'],
    ['quiz', 'Chapter 9 quiz', 'Kiểm tra Chương 9', '10 câu có giải thích'],
  ]],
  ['Chapter 10 — Operations: backup, monitoring, performance and load testing', 'Chương 10 — Vận hành: sao lưu, giám sát, hiệu năng và đo tải', 'Sao lưu và khôi phục tới từng thời điểm, giám sát, bộ nhớ đệm và working set, đo tải thật, change stream và time series.', [
    ['sao-luu', 'Backup and restore: mongodump, --oplog and point-in-time recovery', 'Sao lưu và khôi phục: mongodump, --oplog và khôi phục tới thời điểm', 'Bản sao lưu chưa thử khôi phục = không có · Xoá nhầm lúc 14:03 · Snapshot'],
    ['giam-sat', 'Monitoring: serverStatus, mongostat, mongotop and what to alert on', 'Giám sát: serverStatus, mongostat, mongotop và cảnh báo cái gì', 'Kết nối · Cache · Replication lag · Hàng đợi'],
    ['hieu-nang', 'Performance: working set, cache, connection pools and write batching', 'Hiệu năng: working set, cache, pool kết nối và gom ghi', 'Dữ liệu vượt RAM (đo) · Pool quá nhỏ/quá lớn · Ghi theo lô'],
    ['do-tai', 'Load testing MongoDB: measure p50, p95, p99', 'Đo tải MongoDB: đo p50, p95, p99', 'Công cụ đo tự viết · Tăng dần tải · Đọc điểm gãy'],
    ['change-stream-time-series', 'Change streams, time series collections and GridFS', 'Change stream, time series collection và GridFS', 'Đẩy thay đổi thời gian thực · Resume token · Dữ liệu cảm biến · Khi nào KHÔNG dùng GridFS'],
    ['nang-cap-atlas', 'Upgrades, FCV, and Atlas vs running it yourself', 'Nâng cấp, FCV, và Atlas với tự vận hành', 'Nâng cấp cuốn chiếu · featureCompatibilityVersion · Chi phí thật của tự vận hành'],
    ['lab', 'Lab: the 14:03 accidental delete — restore with zero order loss', 'Lab: xoá nhầm lúc 14:03 — khôi phục không mất đơn nào', 'Đề + rubric · Viết postmortem'],
    ['quiz', 'Chapter 10 quiz', 'Kiểm tra Chương 10', '10 câu có giải thích'],
  ]],
  ['Chapter 11 — Final project and interview', 'Chương 11 — Dự án cuối khoá và phỏng vấn', 'Hoàn thiện và bảo vệ dự án, đề thi thực hành có giờ, ngân hàng câu hỏi phỏng vấn MongoDB.', [
    ['de-bai', 'Final project brief and rubric', 'Đề dự án cuối khoá và rubric', 'Yêu cầu chức năng + phi chức năng · Số đo phải nộp · Rubric'],
    ['thi-thuc-hanh', 'Timed practical exam (PE style)', 'Đề thi thực hành có giờ (kiểu PE)', 'Ba giờ · Dữ liệu cho sẵn · Chấm tự động'],
    ['phong-van', 'The MongoDB interview question bank', 'Ngân hàng câu hỏi phỏng vấn MongoDB', '40 câu phỏng vấn có đáp án mẫu · Câu hỏi thiết kế trên bảng · Kể một sự cố bằng STAR'],
    ['thi-cuoi-khoa', 'Final exam', 'Thi cuối khoá', '30 câu trắc nghiệm tổng hợp'],
  ]],
]);

function ganDuAn(sections) {
  const kq = sections.map((sec, i) => {
    const so = MOC_THEO_CHUONG[i];
    if (!so) return sec;
    const lessons = [...sec.lessons];
    const iQuiz = lessons.findIndex((l) => l.slug.endsWith('-quiz'));
    lessons.splice(iQuiz >= 0 ? iQuiz : lessons.length, 0, baiMoc(so));
    return { ...sec, lessons };
  });
  const cuoi = kq[kq.length - 1];
  kq[kq.length - 1] = { ...cuoi, lessons: [...cuoi.lessons, baiBaoVe()] };
  return kq;
}

export default {
  category: { slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 },
  course: {
    slug: 'mongodb',
    title: 'MongoDB',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/mongodb.png?v=4',
    shortDescription: 'MongoDB in depth: when to choose it over PostgreSQL and when not to, schema design patterns, indexes and explain, aggregation, transactions, replica sets and sharding run for real, Mongoose and Spring Data, security and backups.|||MongoDB chuyên sâu: khi nào chọn thay PostgreSQL và khi nào không, thiết kế schema, index và explain, aggregation, transaction, replica set và sharding chạy thật, Mongoose và Spring Data, bảo mật và sao lưu.',
    description: 'Khoá MongoDB từ số 0 tới mức thiết kế, tối ưu và vận hành được MongoDB trong dự án thật, do CuongThai tự biên soạn. 12 phần: mô hình tài liệu và BSON, CRUD và truy vấn nâng cao, thiết kế schema theo cách ứng dụng đọc (pattern và anti-pattern), index với luật ESR và explain, aggregation pipeline, transaction cùng write/read concern, replica set và sharding dựng thật bằng Docker Compose, dùng MongoDB từ Node.js (driver, Mongoose) và Java (Spring Data MongoDB), bảo mật từ làn sóng tống tiền 2017 tới NoSQL injection, sao lưu khôi phục tới thời điểm, giám sát và đo tải, và dự án cuối khoá có bảo vệ. Mọi lệnh là output MongoDB 8.0 chạy thật.',
    whatYouLearn: 'Biết khi nào MongoDB là lựa chọn đúng và khi nào PostgreSQL tốt hơn, nói được lý do có số đo; thiết kế schema theo truy vấn (nhúng hay tham chiếu, pattern bucket/subset/extended reference…); viết truy vấn và aggregation cho báo cáo thật; đặt index theo luật ESR và đọc explain để chứng minh nó được dùng; dùng transaction đúng chỗ và hiểu write concern majority cứu dữ liệu ra sao; dựng replica set ba máy, chịu được mất primary, dựng cụm shard và chọn shard key; dùng Mongoose và Spring Data MongoDB không dính N+1; chặn NoSQL injection và cấu hình bảo mật; sao lưu và khôi phục tới từng thời điểm; đo tải và tìm truy vấn chậm; trả lời câu hỏi phỏng vấn MongoDB có cơ sở.',
    requirements: 'Biết dùng terminal và Docker cơ bản; đọc được JavaScript (mongosh là vỏ JavaScript). SQL cơ bản giúp so sánh nhưng không bắt buộc. Chương 8 cần Node.js (Express) hoặc Java (Spring Boot) cơ bản.',
    documentsNote: 'Tài liệu chính: mongodb.com/docs/manual • "MongoDB: The Definitive Guide" 3rd ed. (O’Reilly) • MongoDB University (learn.mongodb.com) • mongoosejs.com/docs • docs.spring.io/spring-data/mongodb • jepsen.io/analyses (MongoDB 3.4, 4.2.6) • "Designing Data-Intensive Applications" (Kleppmann).',
  },
  sections: ganDuAn(thay(KHUNG, [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11])),
  duAn,
};
