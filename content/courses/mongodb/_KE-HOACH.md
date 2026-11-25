# Kế hoạch soạn khoá `mongodb` — MongoDB chuyên sâu

Khung dựng 24/11/2026 (agent `mgo`, P1 bảng khoảng trống kho 20/11). Tệp khoá: `content/courses/mongodb.mjs` (prefix bài `mgo-`,
12 phần = Mục 0 + 11 chương, 89 bài gồm 10 bài mốc dự án + 1 bài bảo vệ). Category `databases`, level `INTERMEDIATE`.
Ảnh bìa CHƯA sinh: `scripts/course-cover.mjs --slug mongodb --icon mongodb --color 47A248 --title "MongoDB" --subtitle "Schema → Sharding"`.

**Cách soạn một chương:** tạo `mongodb/sNN-<ten>.mjs` xuất `{ lessons: [...] }` (bài tách ở `mongodb/sNN/<slug>.mjs`), import vào
`mongodb.mjs` và thêm vào `thay(KHUNG, [S00, …])`. GIỮ slug bài + title chương của khung (seeder neo). Bài mốc `mgo-moc-N` và bài
`mgo-bao-ve-du-an` sinh từ `mongodb/_du-an.mjs` — KHÔNG viết tay trong tệp chương.
Mẫu bài: `mongodb/s00/*.mjs` (song ngữ ml-en/ml-vi, liên tưởng đời thường, output thật bằng `lenh()`/`ra()`, ≥1 sơ đồ lz-*, ≥1
`.pitfall`, 🎤 phỏng vấn, 🧪 thực hành có lời giải che, 🗂 thuật ngữ `kv()`, 📌 tóm tắt, thẻ nguồn đã GET kiểm).

## 1. Output thật — quy trình
- Lab: `mongodb/_demo/compose.yaml` (mongo:8.0 → 8.0.38, replica set 1 thành viên `rs0`, cổng 127.0.0.1:47017, container `mgo-lab`)
  + `mongodb/_demo/ctshop-seed.js` (tất định LCG 20261124: 200 khách, 60 sản phẩm 5 loại, 2.000 đơn; số đối chiếu PAID = 903).
- Kịch bản demo: `~/vbg-dp/scratchpad/mgo/demo/sNN/<key>.txt` (cú pháp trong đầu `chay.py`: `$` shell, `>` mongosh, `>>`/`|` nối
  dòng, `@db`, `@ct`, `@an`). Chạy: `python3 -I chay.py sNN/*.txt && node gen-ma.mjs` ⇒ `mongodb/_ma.mjs` (SINH, OUT[key]).
- Chạy lại MỌI kịch bản của các chương đã soạn cùng lúc theo thứ tự tên (s00-lab nạp lại dữ liệu đầu tiên) — kịch bản sau có
  thể sửa dữ liệu (vd s00-uu đổi đơn 2 sang SHIPPED). Chương mới nên tự nạp lại dữ liệu ở kịch bản đầu của chương.
- Container phụ đặt tên `mgo-*`, cổng 4701x, chỉ 127.0.0.1 hoặc `--network none`; client "bên ngoài" dùng `docker run --network host`
  (đừng tạo mạng docker khi khoá khác đang chụp). Dọn: `docker compose -p mgo down -v`.

## 2. Kiểm trùng (đã soát 24/11) ⇒ liên kết chéo, không viết lại
| Nội dung đã có | Ở đâu | Khoá này làm gì |
|---|---|---|
| CRUD + bẫy truy vấn mức môn, Mongoose mức môn | Academy SDN302 `sdn302-3-1-mongodb-crud`, `sdn302-3-2-mongoose` | Dạy lại từ số 0 sâu hơn (Ch2, Ch8); thẻ liên kết |
| Aggregation nhập môn, index checklist production | SDN302 `sdn302-8-1-nestjs-hono`, `sdn302-8-2-production` | Ch4–5 sâu (ESR, explain, window, $merge) |
| MongoDB vs JSONB cùng bài toán; chọn hệ nào | postgresql `postgresql-17-3-mongodb-vs-jsonb`, `-17-4-chon-he-nao`; 13.1–13.2 JSONB/GIN | 0.1 đứng góc MongoDB (đơn mồ côi + trường gõ sai, chạy hai bên), liên kết 17.3/17.4 |
| Spring Data MongoDB cơ bản (@Document, repository, MongoTemplate, explain, aggregation, Mongo cạnh PostgreSQL) | spring-boot `sb-20-1`…`sb-20-5`, `sb-moc-21` | Ch8 chỉ MỘT bài `mgo-8-4-spring-data` "sau phần cơ bản" (transaction, Decimal128, bulk, auditing) |
| NoSQL injection | web-security `sec-1-2-nosql` — còn KHUNG | Dạy đủ ở 9.3; đề xuất web-security 1.2 liên kết sang |
| Node.js dùng PostgreSQL, Redis cache | nodejs, redis | Ch8 Node driver/Mongoose; nhắc Redis trước MongoDB ở Ch10 |

## 3. Bảng phủ chủ đề → bài
| Chủ đề bắt buộc (lời giao) | Bài |
|---|---|
| Mở đầu 6 ý (là gì + lịch sử · khác lân cận · nền · học xong làm gì · hệ thống lớn có nguồn · học kèm) | 0-8 (1,2,5), 0-9 (3,4,6), 0.1 |
| So PostgreSQL: khi nào chọn, khi nào KHÔNG | 0.1 (chạy thật hai bên), liên kết pg 17.3/17.4 |
| Mô hình tài liệu, BSON | 1.1–1.4 |
| Embed vs reference, pattern, anti-pattern | 3.1–3.5 (XONG), lab 3.6 |
| CRUD + query nâng cao | 2.1–2.6 |
| Index compound, ESR, explain | 4.1–4.6 (XONG), lab 4.7 |
| Aggregation pipeline | 5.1–5.5 (XONG), lab 5.6 |
| Transaction, read/write concern | 6.1–6.4 (XONG), lab 6.5 |
| Replica set + sharding chạy thật Compose | 7.1–7.5 (XONG), lab 7.6 |
| Mongoose + Spring Data MongoDB | 8.1–8.4 |
| Bảo mật, NoSQL injection, tống tiền 2017 (+ CVE-2025-14847) | 0-9 (tái hiện), 9.1–9.4 |
| Backup/restore | 10.1, lab 10 |
| Hiệu năng + đo tải | 10.3–10.4 |
| Dự án cuối khoá | `_du-an.mjs` (5 đề tài, 10 mốc, bảo vệ), Ch11 |

## 4. Nguồn đã GET kiểm (24/11/2026)
Wikipedia MongoDB / MongoDB Inc. (10gen 2007, phát hành 11/02/2009, đổi tên 27/08/2013, IPO 20/10/2017, SSPL từ 4.0.4 08/11/2018,
transaction 4.0 06/2018, WiredTiger 2014, Atlas 2016, Jepsen 4.2.6 05/2020) · SEC 10-K FY2026 (65.200+ khách, 100+ nước, 2.463,8 triệu
USD) · Stack Overflow Survey 2025 (MongoDB 24%, PostgreSQL 55,6%) · Discord blog 2017 · KrebsOnSecurity 01/2017 (52.000+ mở, ≥29.000
bị xoá, Verizon 2016) · MongoDB Docs IP binding · NVD CVE-2025-14847 (vá 8.0.17) · Docker Docs "Docker and ufw".
Thêm 24/11 (Ch2): MongoDB Docs insertMany, Node driver insert (driver gắn _id vào object), query operators, query-for-null, query-arrays, $elemMatch,
update operators, positional-filtered, update-with-pipeline, findOneAndUpdate, bulkWrite, collation, cursor.sort · Sakurity (Egor Homakov) "Hacking Starbucks
 for unlimited coffee" 21/05/2015 (race condition thẻ quà) · The Register 04/03/2014 Flexcoin (895 BTC, $610.000) — KHÔNG dùng vì nguồn phân tích
nguyên nhân hackingdistributed.com không tải được (000; archive.org 429).
Thêm 24/11 (Ch3): MongoDB Docs data-modeling, design-patterns (+ bucket, schema-versioning), design-antipatterns (+ unbounded-arrays, reduce-collections,
bloated-documents, reduce-lookup-operations), model-tree-structures, ulimit (khuyến nghị 64000, cảnh báo khởi động), $bsonSize · blog MongoDB "6 Rules of Thumb"
(11/06/2014, cập nhật 2022 — trang không ghi tác giả ⇒ bài không nêu tên) · "Building with Patterns: A Summary" · Discord blog 13/01/2017 (Vishnevskiy; MongoDB 1 replica set,
index channel_id+created_at, 11/2015 100 triệu tin, dữ liệu+index vượt RAM) · OWASP API3:2023.
Thêm 24/11 (Ch4): MongoDB Docs indexes, index-creation, query-plans (multi-planner, trạng thái Missing/Inactive/Active, explain bỏ qua plan cache,
DDL xoá cache), explain-results, equality-sort-range-guideline, index-multikey, index-text (+ text-index-properties: không phân biệt dấu), index-wildcard,
index-partial, index-ttl (tác vụ nền 60 s), index-hidden, query-optimization (covered), $indexStats, manage-the-database-profiler, db.currentOp,
cursor.maxTimeMS, cluster-parameters/defaultMaxTimeMS (mới ở 8.0), privilege-actions (bypassDefaultMaxTimeMS), $regex (PCRE2 từ 6.1, prefix expression)
· Cloudflare blog "Details of the Cloudflare outage on July 2, 2019" (13:42 UTC, regex WAF `.*(?:.*=.*)`, PCRE quay lui, CPU gần 100%, 27 phút).
KHÔNG dùng: post-mortem Stack Exchange 20/07/2016 (stackstatus.tumblr.com 000, stackstatus.net 403).
KHÔNG lấy được: bài Guardian "Bye bye Mongo, Hello Postgres" (403 + archive rỗng) ⇒ không dùng.

## 5. Tiến độ
- 24/11: khung + `_du-an.mjs` + Mục 0 SOẠN CHI TIẾT (0-8, 0-9 có `dangKyDuAn`, 0.1, 0.2, 0.3 quiz 10 câu). Kiểm: content-check 0 lỗi,
  kiemDuAn 0 lỗi 0 cảnh báo, Mục 0 TB ~28k ký tự/bài, 8 sơ đồ, mỗi bài ≥1 bẫy.
- 24/11 (phiên 2): Chương 1 SOẠN CHI TIẾT — `s01-tai-lieu-bson.mjs` + `s01/` (1.1–1.4, lab 1.5 rubric 10 điểm, quiz 1.6 10 câu).
  Demo `demo/s01/s01-{1-tl,2-bson,3-val,4-wt,5-lab}.txt` (s01-1-tl tự nạp lại CT Shop); tệp lab mới `_demo/schema-don.js`, `_demo/nen-thu.js`.
  Đo thật đáng nhớ: lồng 180 tầng nhận / 181 từ chối (docs ghi 100); $push 1 MB lần 16 vượt 16 MiB; 0.1 cộng 1e6 lần = 100000.00000133288;
  đơn ngày 14/10 theo UTC 6 / theo +07:00 9; cache 15.445 MB (máy 31.915 MB) / 512 MB (container 2 GB); log 7,90 MB → snappy 1,72 / zstd 0,87;
  kill -9 sau j:true giữ đủ 2 đơn; `errorAndLog` KHÔNG có ở 8.0. Nguồn mới GET kiểm: MongoDB Docs (limits, bson-types, comparison order,
  schema-validation + validation level, wiredtiger, journaling, ObjectId), Wikipedia Vancouver Stock Exchange + MIM-104 Patriot.
  Kiểm: content-check 0 lỗi, lang-check Ch1 sạch, depth TB 29,6k/bài, 8 sơ đồ, 8 bẫy.
  `_chung.mjs`: lenh() nay nhận tên db có chữ số (`ch1>`, `lab1>`).
- 24/11 (phiên 3): Chương 2 SOẠN CHI TIẾT — `s02-crud-truy-van.mjs` + `s02/` (2.1–2.6, lab 2.7 rubric 10 điểm có chứng minh tranh chấp,
  quiz 2.8 10 câu). Demo `demo/s02/s02-{1-ins,2-q,3-arr,4-upd,5-atom,6-sort,7-lab}.txt` (s02-1-ins tự nạp lại CT Shop; tập ghi ở ch2/lab2).
  Tệp lab mới: `_demo/node/` (package.json + nhan-doi.mjs, driver mongodb 7.9.1 — node_modules KHÔNG kéo về), `_demo/doc-sua-ghi.js`,
  `_demo/giu-cho.js`, `_demo/lab2-giai.js` (chép nguyên vào GIAI_MA của 2.7 — sửa tệp thì chép lại), `_demo/lab2-tranh.js`.
  Đo thật đáng nhớ: insertMany ordered dừng ở chỉ số 2 (2 vào) / unordered 3 vào; w:0 nuốt E11000; driver Node gắn _id vào object ⇒ dùng lại
  object lỗi E11000; insertOne×2000 w:majority ≈ 8× chậm hơn w:1, insertMany nhanh hơn hàng trăm lần; số so với chuỗi ⇒ 0 im lặng;
  khoá trùng trong object 1525 vs 74; $ne PAID 1098 gồm đơn thiếu status; dấu chấm 357 vs $elemMatch 204; 4 tiến trình đọc-sửa-ghi mất
  hàng trăm lượt (số đổi mỗi lần) vs $inc 2000; bán ngây thơ > 5 vs nguyên tử đúng 5; skip 199.980 quét 200.000 khoá vs keyset 20;
  collation vi strength 1 bỏ dấu thanh nhưng giữ ă/â (en gộp hết). Số đổi theo lần chạy (ms, lost update, oversell) ⇒ lời không nêu số.
  Kiểm: content-check 0 lỗi (89 bài), lang-check Ch2 sạch, depth Ch2 263k/9 bài, 16 sơ đồ, mỗi bài dạy 1 bẫy/ngôn ngữ; mọi lời giải thực hành
  đã chạy thật.
- 24/11 (phiên 4): Chương 3 SOẠN CHI TIẾT — `s03-thiet-ke-schema.mjs` + `s03/` (3.1–3.5, lab 3.6 rubric 10 điểm + câu bảo vệ, quiz 3.7 10 câu).
  Demo `demo/s03/s03-{1-nhung,2-qh,3-p1,4-p2,5-anti,6-lab}.txt` (s03-1 tự nạp lại CT Shop; ghi ở ch3/ch3a/lab3; PHẢI chạy theo thứ tự 1→5 vì
  s03-3 dùng reviews/ordersEmb của s03-1/2). s03-5 dựng + xoá container phụ mgo-phinh (cache 0,25 GB), mgo-nhieu (nofile 1024 — CỐ Ý cho sập),
  mgo-nhieu2 (nofile 64000); chạy ~6 phút ⇒ run_in_background. Tệp lab mới `_demo/lab3-giai.js` (chép nguyên vào GIAI_MA của 3.6 bằng
  thay chuỗi; sửa tệp thì chép lại). Đo thật đáng nhớ: trang đơn 2 truy vấn 4000 lượt gọi vs $lookup/nhúng 2000; tham chiếu giá ⇒ 91/91 đơn
  lệch; email chép ⇒ 13 lần ghi; mảng 1591 id = 27.564 byte, $in quét 2766 khoá; attrs 1 index phục vụ 4 bộ lọc keys = n; subset 385 byte vs
  nhúng hết 103.593; bucket 1440 → 24 tài liệu, index ~40× nhỏ hơn; outlier 1000 + 3 tài liệu tràn; versioning 4 lô sửa 199;
  $push 4 KB lỗi 10334 ở lượt 4166; mongod nofile 1024 SẬP (errno 24, fassert, mã 139) sau ~450–500 collection; 3000 collection = 6011 tệp .wt;
  8 index thừa ×8,6 dung lượng index, $indexStats 0.
  Phát hiện: Docker máy nhà cho container nofile mềm 1024 ⇒ `mgo-lab` CŨNG SẬP khi tạo 3000 collection (lần chạy đầu) — compose của lab
  CHƯA có ulimits (sửa sẽ đổi output s00-lab); bài 3.5 hướng dẫn người học tự thêm `ulimits: nofile 64000`. Đề xuất: khi chạy lại Mục 0 thì thêm
  ulimits vào compose.yaml luôn.
  Kiểm: content-check 0 lỗi (89 bài), lang-check Ch3 sạch, depth Ch3 240k/7 bài TB 34,3k, 14 sơ đồ, 10 bẫy, 30 nguồn; mọi lời giải đã chạy thật.
- 24/11 (phiên 5): Chương 4 SOẠN CHI TIẾT — `s04-index-explain.mjs` + `s04/` (4.1–4.6, lab 4.7 rubric 10 điểm, quiz 4.8 10 câu).
  Demo `demo/s04/s04-{1-idx,2-exp,3-esr,4-dac,5-phu,6-cham,7-lab}.txt` — s04-1 nạp lại CT Shop + 1.000.000 đơn (`_demo/don-trieu.js`, LCG 20261124,
  ~21 s, 164,4 MB) vào ch4; PHẢI chạy 1→7 (dùng chung ch4.don); s04-4 dùng ch4x + ctshop.products; s04-6 dựng/xoá container phụ `mgo-maxt` (--auth).
  Cả chương chạy ~3,5 phút ⇒ run_in_background. Tệp lab mới: `_demo/don-trieu.js`, `_demo/lab4-do.js` (công cụ đo; chép nguyên vào DO_MA của 4.7),
  `_demo/lab4-giai.js` (lời giải; chép nguyên vào GIAI_MA của 4.7 — sửa tệp thì chép lại bằng thay @@DO@@/@@GIAI@@ hoặc tay).
  Đo thật đáng nhớ: KH01234 COLLSCAN 1.000.000 tài liệu / IXSCAN 23-23-23, nhanh hơn cả trăm lần; _id_ 29 MB > khach_1 10,7 MB > tong_1 6,2 MB (nén tiền tố);
  6 index ⇒ chèn ~2× chậm; explain NEW+Huế 9909→1669 + SORT, đua thử 101 vs 88 sau 10011 works, DELIVERED chọn index khác; ESR 42 khoá vs ERS 125.575
  vs RES 145.272; trang 500 ESR 20.216; sort 263,6 MB tràn đĩa 3 lần / allowDiskUse(false) lỗi; ngoại lệ tong ≥ 19,99 tr: ERS 136 vs ESR 30.122 (planner
  tự chọn ERS); multikey 2.000.224 khoá; text 'vietnamese' bị từ chối, 'none' + tìm không dấu vẫn khớp; partial chỉ dùng khi truy vấn có daXoa:false;
  TTL ~60 s, chuỗi không xoá; hidden 23→1.000.000→23; covered 0 tài liệu (_id phá); sửa trường trong 5 index ~1,7×, trường không index như nhau;
  profiler/slow log/currentOp+killOp $where; **defaultMaxTimeMS bị BỎ QUA trên lab không xác thực** (quyền bypassDefaultMaxTimeMS), có hiệu lực với user
  readWrite trên mgo-maxt --auth; notablescan; regex /0123/ quét 1.000.000 khoá; đoạn lõi regex Cloudflare chạy vài ms trên PCRE2 (không tái hiện bùng nổ —
  bài nói rõ). Kiểm: content-check 0 lỗi (89 bài, 1.192.703 ký tự), lang-check Ch4 sạch, depth Ch4 276k/8 bài TB 34,5k, 10 sơ đồ, 12 bẫy, 46 nguồn;
  mọi đáp án thực hành đã chạy thật (2 chỗ đoán sai đã sửa theo số đo: cỡ tong_1, số khoá Q1 bài 4.3).
- 24/11 (phiên 6): Chương 5 SOẠN CHI TIẾT — `s05-aggregation.mjs` + `s05/` (5.1–5.5, lab 5.6 rubric 10 điểm + câu bảo vệ, quiz 5.7 10 câu).
  Demo `demo/s05/s05-{1-co-ban,2-lookup,3-bieu-thuc,4-window,5-toi-uu,6-lab}.txt` — s05-1 nạp lại CT Shop + 1.000.000 đơn ch4; PHẢI chạy 1→6 (~1,5 phút).
  s05-5 dựng/xoá container phụ `mgo-js` (--noscripting, --network none). Tệp lab mới: `_demo/ke-pipeline.js` (đọc explain pipeline), `_demo/lab5-giai.js`
  (chép nguyên vào GIAI_MA của 5.6 bằng thay @@GIAI@@ — sửa tệp thì chép lại). Kiểm trùng: SDN302 8.1 (aggregation nhập môn), spring-boot 20.3, postgresql 6.2/8.2/8.3/
  10.2/12.4/2.3 ⇒ chỉ liên kết chéo. Đo thật đáng nhớ: 2000 → 903 → 6; quên $ ⇒ một nhóm 903; '$totl' ⇒ 0; $avg 3768/8 = 471; unwind 4969 dòng, cộng total sau unwind
  36,9 → 110,9 tỉ; unwind bỏ mảng rỗng/thiếu (4 → 3); EQ_LOOKUP NestedLoopJoin 20 khách vài giây (200 khách ~44 s) / IndexedLoopJoin vài ms, 385 khoá; HashJoin bảng vùng;
  quanh Tết UTC 1480/1429 vs VN 1051/1434/424, quý 1 không timezone đẻ "tháng 12" 378; $dateAdd 29/02/2012 + 1 năm = 28/02/2013, $dateFromParts 29/02/2013 = 01/03;
  $bucket thiếu default ⇒ lỗi "$switch could not find a matching branch"; $concat với trường vắng = null; rank 1-2-2-4-5 / dense 1-2-2-3-4; thiếu sortBy ⇒ lỗi;
  **$densify bước tháng trên mốc 17:00 UTC trôi về ngày 28 (tháng giả + trùng)** ⇒ khoá $dateFromParts; bộ tối ưu kéo $match sau $set lên đầu + phủ index (9909 khoá, 0 tài liệu),
  tách $match trộn, đẩy $match theo khoá nhóm xuống trước $group; trường tính ⇒ COLLSCAN 1.000.000, viết lại bằng khoảng ngày ⇒ COUNT_SCAN 4840; allowDiskUse:false lỗi;
  tràn 181,7 MB ($$ROOT) / 36,6 MB (2 trường) / 0 (đếm); BSONObjectTooLarge 21,8 MB; $merge 287 ngày chạy lại 287; on không unique ⇒ Location51183; $out giữ index;
  pipeline từ client: $lookup lộ passwordHash, $merge hạ SP001 9.504.000 → 1.000 (khôi phục ngay), $function chạy JS, --noscripting chặn; **$merge từng phần giữ dòng cũ
  cho ngày mà mọi đơn đã bị xoá** ⇒ R5 lab xoá dòng không được làm mới. Sự cố thật (GET kiểm): Azure 29/02/2012 (blog Azure), Reinhart–Rogoff/Herndon–Ash–Pollin 04/2013 (Wikipedia).
  Kiểm: content-check 0 lỗi (89 bài, 1.480.478 ký tự), lang-check Ch5 sạch, depth Ch5 298k/8 bài; mọi đáp án thực hành đã chạy thật (2 chỗ sửa theo số đo ở 5.5).
- 24/11 (phiên 7): Chương 6 SOẠN CHI TIẾT — `s06-transaction.mjs` + `s06/` (6.1–6.4, lab 6.5 rubric 10 điểm + câu bảo vệ, quiz 6.6 10 câu).
  Demo `demo/s06/s06-{1-nguyen-tu,1b-api,2-tx,2b-standalone,3-wc,4-rc,5-lab}.txt` — PHẢI chạy theo thứ tự tên (~5 phút ⇒ chạy nền); s06-1 nạp lại CT Shop
  (ghi ở ch6); s06-2b dựng/xoá container phụ `mgo-sa` (standalone); s06-3 dựng cụm `mgo-rs3` (BA mongod 27018/27019/27020 trong MỘT container --network none,
  `_demo/rs3.sh up|down|treo|chay|ngung-chep|chep-tiep|cho-primary`, enableTestCommands=1 chỉ để dùng failpoint stopReplProducer) và s06-4 dùng tiếp rồi xoá.
  `chay.py` mới nhận `@db m1=<chuỗi kết nối>` (dấu nhắc ngắn, nối chuỗi dài). Tệp lab mới: `_demo/gio-ver.js`, `chuyen-tho.js`, `chuyen-tx.js`, `rs3.sh`;
  `_demo/node/gio-409.mjs`, `tx-dat-hang.mjs`, `tx-quen-session.mjs`, `nhan-qua.mjs`, `lab6-thu.mjs`, `lab6-ngay-tho.mjs`, `lab6-giai.mjs` (ba tệp lab6 chép
  nguyên vào 6.5 bằng `scratchpad/mgo/tmp/dung-lab6.py` từ `tmp/lab6-khung.mjs` — sửa tệp thì chạy lại script đó).
  Đo thật đáng nhớ: giữ 2 áo M + phiếu giữ trong một lệnh (7 → 5, giữ 50 ⇒ matched 0); 4×2000 $inc = 8000 đúng, writeConflicts +hàng nghìn (engine tự thử lại);
  giỏ ghi mù < 200 món vs giỏ version đúng 200/v 200; HTTP 409 cho tab thua; updateMany 300.000 + maxTimeMS 40 ⇒ một phần, chạy lại ⇒ diem 2, dấu đợt ⇒ đúng 300.000;
  chuyển không transaction ⇒ ~một nửa lần đọc thấy tổng 1.999.000, có transaction ⇒ 0; WriteConflict + TransientTransactionError ngay, lệnh thường bị chặn chờ;
  lifetime 3 s ⇒ NoSuchTransaction; 40 đơn ⇒ 30/10, callback ~260–280 lần; quên session ⇒ ví 100.000 nhưng nhật ký −50.000 còn + tự chặn; 1.000.000 tài liệu
  một transaction ~10 s; chi phí: w:1 transaction ~1,5–2× chậm hơn, w:majority ngang (có lần nhanh hơn); standalone ⇒ mongosh "does not support retryable writes",
  lệnh thô ⇒ IllegalOperation 20. rs3: w:majority chậm nhiều lần w:1, j:false không nhanh hơn, w:3 nhanh hơn majority; ngừng chép ⇒ wtimeout WriteConcernFailed 64
  nhưng D-MAJ vẫn trên primary; bầu lại ~10–12 s; ROLLBACK 4 tài liệu (3 w:1 + D-MAJ) ra removed.*.bson; local 200/majority 100/secondary 100/snapshot 100;
  linearizable hết giờ trên primary cô lập; causal session chờ secondary thay vì trả cũ, chép tiếp ⇒ 301. Lab 6.5: ngây thơ 0/5 bất biến, lời giải 5/5, callback
  hàng nghìn lần (ví SHOP nóng).
  Phát hiện: SIGSTOP secondary KHÔNG giả lập được đứt mạng (oplog đã nằm trong bộ đệm socket) ⇒ dùng failpoint; primary mất đa số tự step down sau ~10 s
  (w:1 chỉ nhận được trong cửa sổ đó). Nguồn mới GET kiểm: Docs write-operations-atomicity, transactions, transactions-production-consideration,
  mongodb-defaults, write-concern, replica-set-rollbacks, read-concern (+ linearizable, snapshot), read-preference (+ staleness: tối thiểu 90 s),
  causal-consistency-read-write-concerns; Jepsen MongoDB 4.2.6 (2020); aphyr "Call me maybe: MongoDB" (18/05/2013: 6000 ghi, 5700 xác nhận, mất 2381).
  Ghi chú: docs hiện tại của MongoDB là 9.0 — lab vẫn ghim 8.0 (đổi sẽ lệch output mọi chương).
  Kiểm: content-check 0 lỗi (89 bài, 1.696.298 ký tự), lang-check Ch6 sạch, depth Ch6 227k/7 bài, 12 sơ đồ; mọi đáp án thực hành đã chạy thật.
  ⚠ Chương 7: rollback w:1 ĐÃ dạy ở 6.3 ⇒ 7.2 tập trung thời gian bầu lại + ứng dụng/driver thấy gì (retryable writes, lỗi NotWritablePrimary), liên kết 6.3;
  cắt mạng THẬT giữa ba container (Compose) — cẩn thận "mạng docker đổi khi chụp" của agent khác.
- 24/11 (phiên 8): Chương 7 SOẠN CHI TIẾT — `s07-replica-sharding.mjs` + `s07/` (7.1–7.5, lab 7.6 rubric 10 điểm + câu bảo vệ, quiz 7.7 10 câu).
  Demo `demo/s07/s07-{1-rs,2-failover,3-thanh-vien,4-sharding,5-shard-key,6-lab}.txt`, chạy bằng `demo/chay-s07.sh [tệp…]` — script GIỮ CẢ HAI khe khoá nặng
  (`demo/hai-khe.sh`) vì Compose tạo/xoá mạng docker (memory docker-net-khi-chup), cả chương ~25 phút. s07-1 dựng cụm rs1, s07-2/3 dùng tiếp (s07-2 tự `up` ẩn nếu
  chưa có), s07-3 xoá cụm; s07-4 dựng cụm shard, s07-5 dùng tiếp rồi xoá; s07-6 dựng lại rs1 rồi xoá. Lượt chốt: s07-4/5 lượt 1, s07-1/3 lượt 2, s07-2/6 lượt 3.
  Tệp lab mới: `_demo/rs/compose.yaml` (mgo-r1..r4 + service app node:22-alpine; mạng mgo-rs-net + mạng ứng dụng mgo-rs-ud 10.247.71.0/24, r1 IP cố định,
  app extra_hosts r1 ⇒ cắt r1 khỏi mgo-rs-net mà app vẫn tới r1 = split-brain thật), `_demo/rs/hon-loan.sh` (giet/tat/nhuong/cat-mang/cat-het/noi-*/bat/
  cho-primary/on-dinh/la/trang-thai), `_demo/shard/compose.yaml` (mgo-cfg, mgo-s1..s3, mgo-mongos; healthcheck tự rs.initiate), `_demo/shard/don-shard.js`,
  `_demo/node/ghi-lien-tuc.mjs`, `lab7.mjs` + `lab7-ngay-tho.mjs` + `lab7-giai.mjs` (ba tệp chép nguyên vào 7.6 bằng `scratchpad/mgo/tmp/dung-lab7.py` từ `tmp/lab7-khung.mjs`).
  Đo thật đáng nhớ: nối từ máy chủ bằng replicaSet=rs1 ⇒ ENOTFOUND r1; oplog $inc ⇒ "u: ton 9", updateMany 3 ⇒ 3 mục, insertMany ⇒ applyOps; độ trễ hiện 20 s sau 6 s
  đóng băng (đo giữa mốc oplog); giết primary ⇒ cụm bầu ~10–11 s, ứng dụng 10–21 s không ghi; một lượt có retryWrites vẫn lọt lỗi mạng mà đơn ĐÃ ghi; stepDown vài chục ms;
  docker stop ⇒ mã 137 (Docker giết sau 10 s, mongod quiesce 15 s); cắt mạng im lặng ⇒ một lệnh treo ~32 s, socketTimeoutMS=3000 vẫn ~33 s (kẹt connectTimeoutMS 30 s),
  thêm connectTimeoutMS=3000 ⇒ ~21 s; driver Node 7.9.1 cảnh báo timeoutMS "has no effect"; thành viên trễ còn phiếu ⇒ majority hết giờ khi mất r2; PSA: addArb bị từ chối
  tới khi setDefaultRWConcern, mất secondary ⇒ w:1 chạy, majority hết giờ, commit point đứng; insertMany ordered:true trên collection hashed ~15 s vs ordered:false ~0,1 s;
  range theo ngày ⇒ 17 range dời trong ~30 s; thêm sh3 ⇒ cân lại ~30 s; khoá tăng dần ⇒ +20000 vào một shard; vung 3 giá trị ⇒ 3 range JUMBO "indivisible";
  reshard 120k đơn ~36 s (lab hạ ngưỡng 5 phút ⇒ 5 s); zone ⇒ đúng từng vùng, truy vấn chạm thêm shard giữ range kề (trả 0). Lab: ngây thơ báo thành công 1423 đơn,
  0 lỗi, MẤT 478 (= 478 tài liệu trong rollback); lời giải 0/0/0 cả split-brain lẫn giết primary.
  Nguồn mới GET kiểm: Docs replica-set-oplog, -elections, -delayed-member, -arbiter, retryable-writes, connection-string-options, shutdown (quiesce 15 s),
  sharded-cluster-query-router, sharding-balancer-administration (3× range size), analyzeShardKey, sharding-reshard-a-collection (2 s chặn ghi), zone-sharding,
  unshardCollection (8.0); Foursquare outage post mortem (Eliot Horowitz, mongodb-user 08/10/2010); GitLab postmortem 31/01/2017 (~300 GB, snapshot ~6 giờ).
  Kiểm: content-check 0 lỗi (89 bài, 1.960.530 ký tự), lang-check Ch7 sạch, depth Ch7 275k/8 bài, 8 sơ đồ; mọi đáp án thực hành bám output thật.
  ⚠ Chương 8 (driver Node + Mongoose + Spring Data): dùng lại cụm rs/compose.yaml và ghi-lien-tuc.mjs cho phần pool/timeout; 8.1 KHÔNG dạy lại timeout failover (đã ở 7.2).
- 24/11 (phiên 9): Chương 8 SOẠN CHI TIẾT — `s08-ung-dung.mjs` + `s08/` (8.1–8.4, lab 8.5 rubric 10 điểm + câu bảo vệ, quiz 8.6 10 câu).
  Demo `demo/s08/s08-{1-driver,2-mongoose,3-mg-prod,4-spring,5-lab}.txt`, chạy `python3 -I chay.py s08/*.txt && node gen-ma.mjs` (~6 phút; mgo-lab phải đang chạy).
  Chạy trên máy: Node 22 + mongodb 7.9.1 + mongoose 9.13.0 + express 5.3 (`_demo/node`, package.json đã thêm mongoose/express); Mongoose 8.8.2 CÓ LỖI chỉ trong
  `_demo/cve-2024-53900/` (npm install riêng); Spring Boot 4.1.2 + Spring Data MongoDB 5.1.2 + driver Java 5.8.1 + JDK 25 (`_demo/spring/`: pom.xml, src/, chay.sh,
  chay-lab8.sh; `target/` dựng bằng javac, `target/lib` là symlink tới ~/.rtq-mgo/spring-lib — KHÔNG kéo target/ và node_modules/). Lab 8.5 dựng bằng tmp/dung-lab8.py.
  Đo thật đáng nhớ: URI không directConnection ⇒ 3 s rồi ECONNREFUSED localhost:27017; client mỗi request ⇒ 600 kết nối/300 request, chậm ~10×; pool 10 vs 50 bằng nhau vì
  ~10–14 vé đọc (queues.execution.read); trần 409 = (1024/2)×0,8 ⇒ 5×100 truy vấn: ~70 MongoNetworkError, log "too many open connections"; lô đầu 101, getMore 16 MiB
  (27.566 dòng), batchSize 1000 ⇒ 200 getMore; projection nhỏ ⇒ 1 lô 199.899 dòng heap tăng; ObjectId chuỗi ⇒ null; isValid("123456789012") false ở bson 7; Decimal128+1 =
  "199000.501"; Long 2^53+1 JSON {high,low}. Mongoose: updateOne lọt min/enum; strictQuery:true đếm tất cả, 'throw' ⇒ StrictModeError; lean ~2×; populate 2 find, N+1 2001
  find, $lookup 2.000 đơn CHẬM hơn populate (trang 20 đơn thì nhanh nhất); quên session ⇒ đơn mồ côi, transactionAsyncLocalStorage vá; syncIndexes xoá index DBA;
  bufferCommands 10 s; CVE-2024-53900 trên 8.8.2: $where sleep ⇒ 1,5 s, dò email; npm audit 8.8.2 = 9 cảnh báo, 9.13 = 0. Spring: thiếu MongoTransactionManager ⇒ đơn mồ
  côi; BigDecimal mặc định Decimal128 ở 5.1 (thuộc tính big-decimal=string ⇒ sắp sai, count 3); saveAll sửa 20.000 = 20.000 update ~100–145 s vs bulkOps 1 lệnh ~1 s
  (w:majority ≈ w:1 j:true ≈ 5–8 ms/lệnh, w:1 ~0,4 ms); bulkOps insert KHÔNG đặt version ⇒ save() sau đó insert ⇒ DuplicateKeyException. Lab: ngây thơ 3/14 (bán 23–38 đơn
  trên tồn 10), Express 14/14, Spring không thử lại 13/14 (36×500 WriteConflict), Spring có thử lại 14/14 (~160–200 lần thử lại).
  Nguồn mới GET kiểm: NVD API CVE-2024-53900 (02/12/2024, 9.1) + CVE-2025-23061 (15/01/2025); Mongoose docs validation, migrating_to_7, transactions (8.4 ALS), connections,
  Model.syncIndexes; Node driver connection-pools (maxPoolSize 100); MongoDB docs wiredtiger (vé động từ 7.0), configuration-options (maxIncomingConnections); Spring Data
  MongoDB client-session-transactions, mapping (trang vẫn ghi BigDecimal ⇒ String — khác hành vi 5.1 đo được, bài nói rõ).
  Kiểm: content-check 0 lỗi (89 bài, 2.188.799 ký tự), lang-check Ch8 sạch, depth Ch8 239k/7 bài, 8 sơ đồ; mọi đáp án thực hành đã chạy thật.
- 24/11 (phiên 10): Chương 9 SOẠN CHI TIẾT — `s09-bao-mat.mjs` + `s09/` (9.1–9.4, lab 9.5 rubric 10 điểm + câu bảo vệ, quiz 9.6 10 câu).
  Demo `demo/s09/s09-{1-lo,2-auth,3-tiem,4-ma-hoa,5-lab}.txt`, chạy `python3 -I chay.py s09/*.txt && node gen-ma.mjs` (~4 phút; mgo-lab phải đang chạy; s09-1 nạp lại CT Shop, ghi ở ch9/ch9_pii/ch9_kms/lab9).
  Container phụ tự dựng/xoá: mgo-mo-cong (chỉ create), mgo-mac-dinh, mgo-nen, mgo-cung, mgo-cu (ảnh mongo:8.0.16 CÓ SẴN trên máy — chỉ để tu-kiem bắt lỗi CVE, --network none),
  mgo-auth 47023, mgo-tro 47027, mgo-tls 47028, mgo-vet, mgo-lab9 47093; Node: API lỗi 47024, API vá 47025, proxy nghe lén 47026, lab9 47091/47092.
  Tệp lab mới: `_demo/tu-kiem.js`, `_demo/tls/tao-chung-chi.sh` (ca.key/ca.pem/may-chu.* SINH mỗi lượt — KHÔNG kéo), `_demo/csfle/` (package.json, lock, ma-hoa.mjs;
  mongodb-client-encryption 7.2.2 — KHÔNG kéo node_modules), `_demo/node/s09-*.mjs`, `lab9-{du-lieu,ngay-tho,giai,thu}.mjs`, `_demo/lab9-may-chu.sh`; 9.5 dựng bằng `tmp/dung-lab9.py` từ `tmp/lab9-khung.mjs`.
  Đo thật đáng nhớ: ảnh mongo chính thức tự chạy --bind_ip_all; -p không IP ⇒ HostIp ""; networkMessageCompressors snappy,zstd ⇒ client chỉ xin zlib không được nén; tu-kiem: lab 5 LỖI,
  mgo-cung 5 OK, 8.0.16 LỖI CVE; localhost exception: qua cổng Docker bị từ chối, trong container tạo được đúng 1 user; readWrite drop được collection + createIndex, vai trò
  find/insert/update/remove chặn drop; authSource sai = sai mật khẩu ở client, log phân biệt UserNotFound/storedKey mismatch; mật khẩu "@:/" ⇒ "Unable to parse c:d with URL";
  {"$ne":null}/$regex ⇒ token admin, oracle mã đặt lại 200/404, đổi mật khẩu admin; Express 5 simple parser chặn email[$ne], extended mở lại; regex (a+)+$: 2 ms ⇒ ~0,4–0,5 s
  sau 200 tên "aaaa…!" (mongosh: ×4 mỗi 2 ký tự tới n≈16 rồi chững ~2 ms/tài liệu); sanitizeFilter ⇒ $eq + CastError; tệp .wt chứa email/sđt rõ; proxy thấy insert + 0901000001 khi
  không TLS (mật khẩu 0 lần, thấy tên user + SCRAM), TLS ⇒ không chữ nào; mongod 8.0 đòi --tlsCAFile (SERVER-72839) và có CA thì đòi chứng chỉ client trừ khi
  --tlsAllowConnectionsWithoutCertificates; CSFLE: Binary subtype 6 (82/98 byte), Deterministic giống/Random khác, CMK khác ⇒ HMAC validation failure, xoá DEK ⇒ không đọc được;
  Community không có --auditDestination; profiler filter ghi user/client/appName (capped 1 MiB). Lab: ngây thơ 2/15, lời giải 15/15.
  Sự cố thật có nguồn (GET kiểm 24/11): CVE-2025-14847 (NVD: 19/12/2025, CVSS 3.1 7,5 / 4.0 8,7, CISA KEV 29/12/2025, SSVC active) — CHỈ PHÒNG THỦ, không mô tả khai thác;
  Rocket.Chat CVE-2021-22911 (NVD 27/05/2021, 3.11–3.13, CVSS 9.8) + Sonar blog Paul Gerste 18/05/2021. KHÔNG dùng: Ars Technica "Meow" 2020 (403), Nghị định 13/2023 72 giờ
  (thuvienphapluat 403, có thể đã bị luật 2025 thay ⇒ bài chỉ nói chung "luật dữ liệu cá nhân có thể buộc thông báo").
  Kiểm: content-check 0 lỗi (89 bài, 2.422.958 ký tự), lang-check Ch9 sạch, depth Ch9 240k/6 bài, 10 sơ đồ; đáp án thực hành 9.4 câu 2 đã chạy thật.
- Tiếp theo: Chương 10 (vận hành: sao lưu --oplog + PITR "xoá nhầm 14:03", giám sát, hiệu năng, đo tải p50/p95/p99, change stream/time series/GridFS, nâng cấp/FCV; dùng lại
  mgo-lab; 9.4 đã nói "mongodump là BSON rõ ⇒ mã hoá bản sao lưu" — 10.1 nối tiếp) HOẶC Pha B video (chưa làm tập nào; tồn 0-1…0-4 … 8-1…8-4, 9-1…9-4).
- 24/11 (phiên 11, 11:40–14:25): Chương 10 — DỪNG GIỮA CHỪNG vì máy nhà quá tải (load ~115, `docker ps` treo > 60 s, RAM 30/31 GB do `next build` 13 GB của
  agent khác) và đĩa còn 11 GB (< 12 GB ⇒ luật DỪNG). CHƯA viết tệp bài web nào của Ch10 (s10-*.mjs chưa có; mongodb.mjs chưa import S10). Đã làm:
  * Kiểm trùng: khoá `mongodb` chưa có ở repo/prod. Liên kết chéo (slug đã thấy trên prod): postgresql-15-1-pg-dump, -15-2-wal-pitr, -14-4-giam-sat;
    perf-1-1-do-tre, perf-1-5-coordinated-omission, perf-2-2-mo-dong, perf-8-4-pool; obs-4-5-thu-thap-cai-gi, obs-9-1-loi-hua-danh-thuc. Chưa kiểm slug object-storage.
  * Tệp lab MỚI trong `_demo/`: ghi-don.js, sao-luu.sh (CU=1 = cron cũ chỉ --db ctshop), kiem-khoi-phuc.sh, suc-khoe.js, cache-dem.js, ws-nap.js, ts-nap.js,
    lab10-su-co.{js,sh}, lab10-cham.sh, lab10-ngay-tho.sh, lab10-giai.sh; `_demo/node/`: tai.mjs (máy đo tải mô hình mở/đóng, --bac, --vung, --nhan), giu-ket-noi.mjs, theo-doi.mjs.
  * Kịch bản demo `demo/s10/`: s10-1-sao-luu (XONG, out/ có), s10-2-giam-sat (XONG, out/ có), s10-3-hieu-nang (out/ có; đã sửa vòng đối chứng thành 3 lượt
    — CHẠY LẠI để out khớp), s10-4-do-tai (viết xong, lượt chạy bị treo cùng docker ⇒ CHẠY LẠI). s10-5 (change stream/time series/GridFS) và s10-6 (FCV)
    CHƯA viết kịch bản — đã thử tay, ghi số dưới đây để viết kịch bản nhanh. Chưa chạy gen-ma.mjs.
  * Đo thật đáng nhớ (thử tay hoặc từ out/): deleteMany 953 đơn ⇒ oplog 96 mục applyOps × 10 thao tác 'd' (batched deletes); PITR 2000 → 2050 (oplogLimit = ts
    applyOps đầu) → máy chính 2070 đơn/973 PAID, không mất đơn; mongorestore lần 2 không --drop: "0 restored, 2260 failed"; --oplog + --db ⇒ "only supported on full dumps";
    --oplogReplay + --nsInclude ⇒ "cannot use --oplogReplay with includes specified"; kiem-khoi-phuc: tệp cắt cụt ⇒ "error demultiplexing archive" mã 1 (nhưng đã nạp 828 đơn!),
    tệp rỗng ⇒ "Failed: EOF", cron cũ --db ⇒ "no oplog file to replay"; archive không gzip grep ra email, gzip ⇒ 0 (KHÔNG phải mã hoá), openssl khoá sai ⇒ bad decrypt;
    fsyncLock: insert chờ ~4,3 s, snapshot 301M khởi động lại đủ 2000 đơn, không có đơn ghi lúc khoá. Giám sát: serverStatus 60 mục; oplog 997 MB chỉ còn cửa sổ 1,5–1,7 giờ
    (nạp 1 triệu đơn nhiều lần); **mongostat 100.20.1 hiện repl "SLV" cho PRIMARY trên 8.0 (serverStatus().repl không còn trường ismaster)**; $currentOp idleConnections nhóm
    theo appName ⇒ bao-cao-dem 156 kết nối từ 172.25.0.1; exporter Percona 0.47 lượt quét 1: 48 dòng, lượt 2: 6584 dòng; tên chỉ số "pages evicted by application threads"
    KHÔNG có ở 8.0 (dùng "application thread time evicting (usecs)"); FTDC diagnostic.data 2,0M. Hiệu năng: cache 0,25 GB + direct_io=[data] + --device-read-iops
    /dev/nvme0n1:1500, 600k × 1527 byte (874 MiB): nóng 5% 6.300–9.600/s p99 3,5–5,5 ms, rải đều 1.740–1.910/s p99 50–77 ms, luồng ứng dụng chờ đĩa 155,7 s;
    KHÔNG giới hạn IOPS/direct_io thì nóng ≈ rải đều (~8.000/s) vì page cache Linux đỡ; quét báo cáo song song: lượt không hại, lượt p99 10 → 26 ms (nhiễu). Đo tải
    (mgo-tai --cpus 2, 1M đơn, index khach+ngay): 500/1000/2000/s p99 4,5/5,2/18,8 ms; 4000/s thông lượng kẹt ~2.900/s p99 3 s; 8000/s p50 10 s; đóng 4 luồng ~3.800/s;
    pause 2 s: đóng p99 4,48 ms max 2058 / mở 1000/s p95 1798 p99 2047. Change stream: resume token nhận đủ 2 đơn ghi lúc tắt, delete bị lọc, customers không lọt;
    standalone ⇒ Location40573. Time series 432.000 số đo: 440 bucket, trên đĩa 0,6 vs 9,8 MiB, index 0,1 vs 11,5 MiB, explain CLUSTERED_IXSCAN + UNPACK_TS_BUCKET
    totalDocsExamined 30 (docs 9.0: bỏ namespace system.buckets). GridFS 5.000.000 byte = 20 chunk 261120 byte, sha256 khớp; insert 17 MB ⇒ BSONObjectTooLarge.
    FCV: 6.0 → 8.0 nhảy cóc ⇒ "Wrong mongod version … Invalid featureCompatibilityVersion document"; 7.0 trên FCV 6.0 chạy; setFCV đòi confirm:true (Location7369100);
    8.0 cho hạ FCV về 7.0 (ok:1); binary 7.0 trên dữ liệu đó khởi động được với 3 tài liệu NHƯNG docs: "Binary downgrades are not supported for Community" ⇒ bài nói cả hai.
    Lab 10.7: lab10-su-co.sh 3000 đơn, 1120 bị xoá, pha b 60 sửa trượt; ngây thơ (restore --drop) 2740/3160 thiếu 160 sai 260; lab10-giai.sh 3160/3160 ĐẠT (~16 s).
  * Nguồn GET kiểm 24/11: Docs mongodump (--oplog), mongorestore (--oplogLimit "newer than or equal"), core/backups (fsyncLock), 8.0-upgrade-replica-set
    (secondary trước, rs.stepDown), 8.0-downgrade (Community không hạ binary), timeseries-collections, changestreams (replica set, resumeAfter), gridfs (16 MiB);
    Atlas pricing (M0 512 MB miễn phí); GitLab postmortem 31/01/2017 (pg_dump 9.2 vs CSDL 9.6 lỗi, email cron bị DMARC chặn, ~300 GB bị xoá, snapshot LVM ~6 giờ,
    ~5.000 project, 5.000 bình luận, 700 tài khoản mới mất).
  * DỌN CÒN NỢ (docker treo nên chưa làm được): `docker rm -f mgo-tai mgo-tai-node mgo-nc mgo-xuat mgo-kp mgo-kp2 mgo-kt mgo-ws mgo-ws-node mgo-ws0 mgo-ws0-node`
    (cái nào còn), `docker volume rm mgo-nc-data`, `docker rmi mongo:6.0 mongo:7.0 percona/mongodb_exporter:0.47` (mình kéo hôm nay, ~1,5 GB), `rm -rf /tmp/mgo-sl /tmp/mgo-lab10
    /tmp/mgo-token.json /tmp/mgo-td1.txt /tmp/mgo-kt.log`. mgo-lab để chạy (hoặc `docker stop mgo-lab`).
  * Phiên sau: dọn nợ ⇒ df ≥ 12 GB ⇒ viết kịch bản s10-5, s10-6, s10-7-lab ⇒ chạy cả s10/*.txt theo thứ tự (khi máy bớt tải; số ms dao động — lời chỉ nêu khoảng/tỉ lệ)
    ⇒ gen-ma ⇒ viết 8 bài s10/ (10.1–10.6, lab 10.7 nhúng lab10-*.sh, quiz 10.8) + s10-van-hanh.mjs + import S10 vào mongodb.mjs ⇒ content-check ⇒ WEB-SAN-SANG.
- 24/11 (phiên 12, 15:20–16:50): Chương 10 XONG (web). Dọn nợ phiên 11 (mgo-tai, mgo-tai-node, mgo-nc + volume; ảnh mongo:6.0/7.0/exporter 0.47 xoá SAU khi dùng cho s10-2/s10-6).
  * LUẬT RAM: mọi docker run/create trong s10/*.txt + lab10-giai.sh + kiem-khoi-phuc.sh + rs3.sh có --memory/--memory-swap/--cpus; compose.yaml thêm mem_limit 2g + cpus 2
    ⇒ cache mgo-lab giờ 512 MiB (trước ~15 GB). Ngoại lệ có lý do: mgo-ws 768m (để page cache không che đĩa), mgo-ws0 3g (đối chứng cache 1,5 GB).
  * Kịch bản mới: s10-5-change-stream, s10-6-nang-cap, s10-7-lab, s10-3b-gom-ghi (+ _demo/node/gom-ghi.mjs). Cả s10/*.txt chạy 2 lượt theo thứ tự; s10-3 chạy lại với 768m; s10-5 lại sau khi hạ ngưỡng xoá.
  * _chung.mjs: lenh() nhận dấu nhắc có gạch dưới (ctshop_kp>, ctshop_anh>) — chỉ s10-1 có, chương trước không đổi chỉ số.
  * Phát hiện đưa vào bài: btrfs làm direct_io vẫn đi qua page cache (giới hạn RAM mới đo được working set); insertOne mặc định 159/s vì w:majority + journal, w:1 4.070/s,
    insertMany 1 lô ~270.000/s, bulkWrite 10k update 0,4 s vs 94 s; exporter 0.47 mongodb_oplog_stats_start = _end = bây giờ (cửa sổ tính ra 0); time series 8.0: updateMany số đo
    lỗi 72, update metaField được (43.200), deleteMany số đo được, unique lỗi; mongod 6.0 → 8.0 nhảy cóc thoát mã 62; FCV 8.0 trên binary 7.0: "expected '6.0' or '6.3' or '7.0'".
  * Bài: 10.1–10.8 trong s10/, s10-van-hanh.mjs, import S10. Kiểm: content-check 0 lỗi (89 bài, 2,73 triệu ký tự), lang-check 0 bài Ch10 lẫn tiếng Việt, depth Ch10 ~323k/9 bài, 14 sơ đồ.
    Mọi đáp án thực hành có số đã chạy thật (10.1 hỏng 1 byte, 10.2 trễ nhân bản rs3 + oplog exporter, 10.3 bulkWrite upsert, 10.5 bucket 440→441, 10.6 FCV cao hơn binary).
  * Nguồn GET kiểm 24/11 (thêm): lifecycles (6.0 EOL 31/07/2025…9.0 09/2026), pricing Atlas (Free 512 MB, Flex $0.011/h ≤ $30, M10 $0.08/h ~$56.94), timeseries-limitations, Debezium MongoDB, ulimit.
  * Phiên sau: Chương 11 (đề dự án, PE, phỏng vấn — lưu ý _du-an.mjs đã có mốc) HOẶC Pha B video (47+ tập chưa làm; chưa xếp giọng id nào). mgo-lab đã docker stop.
- 25/11 (phiên 13, agent Mac tiếp quản — gói Claude máy nhà hết; demo vẫn chạy trên máy nhà, mgo-lab 8.0.38): Chương 11 XONG (web). `s11-du-an-phong-van.mjs` + `s11/`
  (11.1 hồ sơ nộp + yêu cầu phi chức năng có số + SO-DO.md + rubric 100 điểm quy đổi rubric bảo vệ; 11.2 đề PE CT Cinema 180 phút chấm tự động; 11.3 40 câu phỏng vấn
  + 5 demo một phút + 2 bài thiết kế + STAR; 11.4 thi cuối khoá QUIZ 30 câu, passingScore 70). Import S11 trong mongodb.mjs.
  * Tệp mới _demo/: kiem-du-an.js (tự kiểm CHỈ ĐỌC: validator, hình dạng, cỡ, $indexStats, explain truy vấn chính, replica set, write concern, auth/bindIp/TLS),
    truy-van-ctshop.js, pe11/ (nap.js tất định LCG 20261125; cham.sh + cham.js chỉ giữ md5 đáp án; dong.js 4 tiến trình chờ mốc T0; loi-giai/ 10/10; bai-lam-ngay-tho/ 4,65).
    Bài 11.1/11.2 đọc tệp _demo bằng fs lúc nạp module (không chép tay) ⇒ sửa nap.js là PHẢI tính lại băm (chạy cham.js với GHI_DAP=1) + chạy lại kịch bản.
  * Kịch bản: máy nhà ~/vbg-dp/scratchpad/mgo/demo/s11/s11-{1-tu-kiem,2-pe,3-phong-van}.txt; output gộp vào _ma.mjs bằng cách THÊM 3 khoá (không sinh lại cả tệp,
    vì bản Mac đã thay bí mật giả bằng chỗ giữ chỗ lúc gom 25/11).
  * Phát hiện đưa vào bài: explain KHÔNG tính vào $indexStats (index mới báo "chưa dùng" tới khi có find thật); w:3 trên 1 máy ⇒ MongoWriteConcernError nhưng tài liệu vẫn ghi (đếm 1);
    "ghe.ma"+"ghe.trangThai" 594 suất vs $elemMatch 34; mảng viết sẵn 1 phim vs $all 5; con trỏ keyset thiếu _id đi hết trang ra 30/35 vé; tháng UTC dời 4 vé 850.000 đ
    của suất 00:30 01/12 sang tháng 11 + đẻ dòng R6 2026-10; kiểm-rồi-ghi bán trùng ~30 ghế/40 suất; biến tên `tls` trong script mongosh đụng module tls có sẵn ([object Object]).
  * Nguồn GET kiểm 25/11: FTC 12/04/2018 (Uber 2016 — khoá truy cập đăng lên trang chia sẻ mã, 25M+22M+600k, trả 100.000 USD, công bố 11/2017).
  * Kiểm: content-check 0 lỗi (89 bài, 2,93 triệu ký tự); lang-check 0 bài nặng; depth đạt mọi sàn. Video Pha B chưa làm. mgo-lab đã docker stop, pe11 đã drop.
