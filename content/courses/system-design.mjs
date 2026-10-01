/**
 * System Design thực chiến — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới (quan trọng — có hai khoá cũ đã chạm system design):
 * - api-design Ch8 (con số độ trễ, 1 server, scale dọc/ngang, SLO), Ch9 (cache, replica, sharding, SQL vs NoSQL),
 *   Ch11 (khung trả lời 45 phút + URL shortener, feed/chat, đặt lịch MỨC PHỎNG VẤN).
 * - interview-prep Ch7.3 (system design cho junior — kỳ vọng vòng phỏng vấn).
 * ⇒ Khoá này KHÔNG dạy lại khung phỏng vấn. Nó THIẾT KẾ THẬT: con số đo được, schema, API, sơ đồ, chi phí, sự cố,
 *   và dựng một phần chạy được. Case study trùng tên với api-design (URL shortener, feed, chat) đi sâu hơn hẳn
 *   (sinh mã phân tán, hot key, fan-out lai, thứ tự tin nhắn, lưu trữ nhiều năm) — mỗi case có dòng "Nếu đã học api-design Ch11".
 * - distributed-systems (anh em) dạy lý thuyết; performance-load-testing (Nhóm B) dạy đo tải — khoá này trỏ sang, không dạy lại.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'cs-fundamentals', name: 'Nền tảng khoa học máy tính', icon: 'Cpu', sortOrder: 9 },
  course: {
    slug: 'system-design',
    title: 'System Design in Practice',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/system-design.png?v=4',
    shortDescription: 'Real system design, not interview theatre: grow one server to millions of users, then design classic systems end to end — URL shortener, feed, chat, rate limiter, payments, ticket booking — with numbers, schemas and costs.|||System design thật, không diễn phỏng vấn: nâng một máy chủ lên hàng triệu người dùng, rồi thiết kế trọn các hệ kinh điển — rút gọn link, feed, chat, rate limiter, thanh toán, đặt vé chống trùng — kèm con số, schema và chi phí.',
    description: 'Khoá thiết kế hệ thống cho người đã làm backend và muốn đi xa hơn "vẽ hộp trong 45 phút". Phần 1 nâng một hệ thống giống cuongthai.com từ một VPS lên hàng triệu người dùng, mỗi bước có con số và lý do: tách CSDL, cache, CDN, stateless + load balancer, replica, hàng đợi, phân mảnh, nhiều vùng. Phần 2 là các khối xây dựng (CSDL, cache, hàng đợi, lưu trữ đối tượng, tìm kiếm, realtime, định danh) được chọn theo đánh đổi. Phần 3 là các case study kinh điển thiết kế tới mức schema, API, luồng dữ liệu, điểm hỏng, chi phí và cách vận hành: rút gọn link, rate limiter, news feed, chat, thông báo, thanh toán/ví, đặt vé chống double-booking, tìm kiếm & gợi ý, lưu trữ và phát video, bảng xếp hạng. Phần cuối: viết tài liệu thiết kế (design doc/ADR) và dựng lại kiến trúc LabFlow AI cho quy mô lớn.',
    whatYouLearn: 'Ước lượng tải, dung lượng và chi phí từ yêu cầu; biết bước nâng cấp nào đáng làm ở quy mô nào (và cái nào là lãng phí); chọn CSDL, cache, hàng đợi, lưu trữ theo đánh đổi có số liệu; thiết kế chi tiết mười hệ kinh điển tới schema và API; xử lý hot key, thundering herd, double-booking, fan-out; viết design doc và ADR như ở công ty; bảo vệ thiết kế đồ án trước hội đồng hoặc nhà tuyển dụng.',
    requirements: 'Đã dựng và deploy ít nhất một ứng dụng web có CSDL. Nên học trước API Design & System Design (api-design), PostgreSQL, Redis, Queues & Background Jobs; học song song hoặc sau Hệ thống phân tán để hiểu phần lý thuyết.',
    documentsNote: 'Tài liệu chính: "Designing Data-Intensive Applications" (Martin Kleppmann) • "System Design Interview" tập 1–2 (Alex Xu) — dùng làm danh mục case, không học theo khung phỏng vấn • github.com/donnemartin/system-design-primer • Blog kỹ thuật chính thức: Discord, Stripe, Uber, Netflix, Cloudflare, Meta Engineering • "Site Reliability Engineering" (Google, sre.google/books) • highscalability.com (lưu trữ).',
  },
  sections: khung('sysd', [
    ['Section 0 — What system design really is', 'Mục 0 — System design thật ra là gì', 'Không phải vẽ hộp — là ra quyết định có số liệu và chịu trách nhiệm với nó.', [
      ['bat-dau-tai-day', 'Start here (1/2) — System design in everyday words, its history, and launches that collapsed', 'Bắt đầu tại đây (1/2) — System design bằng lời đời thường, lịch sử, và những lần ra mắt sập', 'Như thiết kế một bếp ăn từ 10 lên 10.000 suất/ngày · Từ mainframe → client-server → web 3 tầng → cloud (AWS 2006) → microservices · HealthCare.gov ra mắt 10/2013 gần như không dùng được · Ticketmaster bán vé tour Taylor Swift 11/2022 quá tải · "Fail whale" của Twitter những năm đầu · Điểm chung: thiết kế không khớp tải thật'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how it differs from interview prep', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và khác gì luyện phỏng vấn', 'Nếu đã học api-design Ch11 và interview-prep Ch7: đó là khung trả lời 45 phút — khoá này thiết kế tới schema, chi phí, sự cố và dựng thử · Viết design doc, bảo vệ đồ án, lên senior · Lộ trình: api-design → distributed-systems → khoá này · Cách học: mỗi case một tài liệu thiết kế nộp được'],
      ['cai-dat', 'Your toolbox: diagrams, estimation sheets and a local stack', 'Bộ đồ nghề: sơ đồ, bảng ước lượng và một stack chạy trên máy', 'Excalidraw, draw.io, Mermaid, mô hình C4 · Bảng tính ước lượng dùng lại · Docker Compose: nginx, Express/Spring Boot, PostgreSQL, Redis, MinIO (giả R2) · k6 để thử tải nhẹ (trỏ performance-load-testing)'],
      ['yeu-cau', 'From vague idea to requirements: functional, non-functional, SLOs', 'Từ ý tưởng mơ hồ tới yêu cầu: chức năng, phi chức năng, SLO', 'Người dùng là ai, bao nhiêu, ở đâu · Độ trễ p99, sẵn sàng, bền dữ liệu · Ràng buộc: tiền, đội, thời gian · Yêu cầu không nói ra'],
    ]],
    ['Chapter 1 — Estimation and cost', 'Chương 1 — Ước lượng và chi phí', 'Số liệu trước, sơ đồ sau.', [
      ['uoc-luong', 'Back-of-the-envelope with real measurements', 'Ước lượng nhanh bằng số đo thật', 'Nếu đã học api-design Ch8.1: bảng độ trễ — ở đây là đo lại trên VPS của mình · DAU → QPS trung bình và đỉnh · Dung lượng 5 năm'],
      ['nut-that', 'Finding the bottleneck: CPU, memory, disk, network, connections', 'Tìm nút thắt: CPU, bộ nhớ, đĩa, mạng, kết nối', 'Định luật Little · Pool kết nối PostgreSQL là nút thắt đầu tiên · Đo một endpoint thật'],
      ['chi-phi', 'Cost modelling: VPS vs cloud vs managed services', 'Mô hình chi phí: VPS, cloud và dịch vụ managed', 'Tiền máy, băng thông ra (egress), lưu trữ · R2 không tính egress vs S3 · Chi phí LLM theo lượt · Bảng chi phí/1.000 người dùng'],
      ['slo-budget', 'SLOs, error budgets and designing for failure', 'SLO, ngân sách lỗi và thiết kế cho hỏng hóc', '99,9% = 43 phút/tháng · Phụ thuộc nối tiếp nhân xác suất · Degrade có chủ đích · Trỏ incident-response'],
    ]],
    ['Chapter 2 — From one server to a million users', 'Chương 2 — Từ một máy chủ tới một triệu người dùng', 'Mỗi bước nâng cấp: khi nào cần, làm gì, trả giá gì.', [
      ['mot-may', 'Stage 1: everything on one VPS', 'Giai đoạn 1: mọi thứ trên một VPS', 'Kiến trúc cuongthai.com hiện tại: Cloudflare → nginx → Docker (Next.js, Express, PostgreSQL, Redis) · Một máy đi được bao xa · Điểm hỏng đơn · Sao lưu là bước bắt buộc đầu tiên'],
      ['tach-cdn', 'Stage 2: split the database, add CDN and object storage', 'Giai đoạn 2: tách CSDL, thêm CDN và lưu trữ đối tượng', 'Managed PostgreSQL hay tự vận hành · Ảnh/video lên R2 + CDN · Build ở máy khác để máy chủ chỉ chạy'],
      ['stateless-lb', 'Stage 3: stateless app servers behind a load balancer', 'Giai đoạn 3: app server không trạng thái sau load balancer', 'Phiên ra Redis/JWT · File upload không ghi đĩa cục bộ · Deploy cuốn chiếu không rơi request · Cron chỉ chạy một nơi'],
      ['cache-replica-queue', 'Stage 4: caching, read replicas and queues', 'Giai đoạn 4: cache, bản sao đọc và hàng đợi', 'Cache nhiều tầng có số hit rate · Replica và đọc-sau-ghi · Việc chậm ra hàng đợi · Cái giá: nhất quán cuối cùng'],
      ['shard-multiregion', 'Stage 5: sharding, multi-region and cells', 'Giai đoạn 5: phân mảnh, nhiều vùng và kiến trúc cell', 'Khi nào thật sự cần shard · Active-passive vs active-active · Cell-based architecture giới hạn vùng ảnh hưởng · Đa số sản phẩm không bao giờ tới đây'],
    ]],
    ['Chapter 3 — Building blocks and their trade-offs', 'Chương 3 — Các khối xây dựng và đánh đổi', 'Chọn công cụ bằng đặc tính, không bằng độ nổi tiếng.', [
      ['csdl', 'Choosing a database: relational, document, key-value, wide-column, time-series', 'Chọn CSDL: quan hệ, tài liệu, khoá-giá trị, cột rộng, chuỗi thời gian', 'Nếu đã học api-design Ch9.4 — ở đây là tiêu chí chọn theo mẫu truy cập · PostgreSQL làm được bao nhiêu việc · Cassandra/DynamoDB/TimescaleDB/ClickHouse khi nào'],
      ['cache', 'Cache patterns: aside, read/write-through, write-behind; stampede and hot keys', 'Mẫu cache: aside, read/write-through, write-behind; giẫm đạp và hot key', 'Trỏ redis Ch6 · Request coalescing · Cache cục bộ + Redis · Vô hiệu hoá theo sự kiện'],
      ['hang-doi', 'Queues vs logs vs pub/sub', 'Hàng đợi, nhật ký và pub/sub', 'BullMQ vs Kafka vs Redis Streams theo tải · Backpressure · Trỏ background-jobs, kafka'],
      ['luu-tru', 'Object storage, blobs and presigned URLs', 'Lưu trữ đối tượng, blob và presigned URL', 'R2/S3 · Upload thẳng từ trình duyệt · Vòng đời và dọn file mồ côi · Trỏ object-storage'],
      ['dinh-danh', 'ID generation: UUIDv7, Snowflake, ULID, sequences', 'Sinh định danh: UUIDv7, Snowflake, ULID, sequence', 'Có thứ tự thời gian hay không · Chỉ mục B-tree và UUID ngẫu nhiên · Snowflake của Twitter (2010) · Không lộ số lượng qua ID'],
    ]],
    ['Chapter 4 — Case study: URL shortener at scale', 'Chương 4 — Case study: rút gọn link ở quy mô lớn', 'Nếu đã học api-design Ch11.2: bản phỏng vấn — ở đây là bản chạy thật với thống kê click và chống lạm dụng.', [
      ['yeu-cau-uoc-luong', 'Requirements, estimates and API', 'Yêu cầu, ước lượng và API', 'Tỉ lệ đọc/ghi 100:1 · Link tuỳ chỉnh, hết hạn · 301 vs 302 và hệ quả với thống kê'],
      ['sinh-ma', 'Generating short codes without collisions across servers', 'Sinh mã ngắn không trùng trên nhiều máy chủ', 'Base62 của ID · Cấp dải ID trước · Băm + xử lý trùng · Mã đoán được là lỗ hổng'],
      ['doc-nhanh', 'Serving redirects fast: cache, edge and hot links', 'Chuyển hướng nhanh: cache, biên và link nóng', 'Redirect ở Cloudflare Worker · Hot key khi một link lan truyền · Cache âm cho link không tồn tại'],
      ['thong-ke-chong-lam-dung', 'Click analytics and abuse prevention', 'Thống kê click và chống lạm dụng', 'Ghi sự kiện bất đồng bộ → ClickHouse (trỏ data-engineering) · Chặn link lừa đảo · Rate limit tạo link'],
    ]],
    ['Chapter 5 — Case study: a distributed rate limiter', 'Chương 5 — Case study: rate limiter phân tán', 'Nếu đã học api-design Ch5.3: thuật toán — ở đây là thiết kế một dịch vụ giới hạn cho nhiều máy chủ.', [
      ['thuat-toan', 'Algorithms compared with numbers', 'So sánh thuật toán bằng số liệu', 'Fixed window, sliding log, sliding window counter, token bucket, GCRA · Bộ nhớ và độ chính xác'],
      ['redis-lua', 'Atomic limits in Redis with Lua', 'Giới hạn nguyên tử trong Redis bằng Lua', 'Race khi đọc-rồi-ghi · Script Lua · Đồng hồ lấy từ đâu'],
      ['phan-tan', 'Multi-node and multi-region limits', 'Giới hạn nhiều nút và nhiều vùng', 'Đếm cục bộ + đồng bộ định kỳ · Chấp nhận vượt nhẹ · Fail-open hay fail-closed khi Redis chết'],
      ['dat-dau', 'Where to enforce: edge, gateway, app', 'Chặn ở đâu: biên, gateway, ứng dụng', 'Cloudflare vs nginx vs middleware · IP thật sau proxy (bài học 429 của cuongthai.com) · Trỏ ddos-protection cho tấn công'],
    ]],
    ['Chapter 6 — Case study: news feed and notifications', 'Chương 6 — Case study: news feed và thông báo', 'Nếu đã học api-design Ch11.3: fan-out ở mức ý tưởng — ở đây là fan-out lai, xếp hạng và hệ thông báo đa kênh.', [
      ['mo-hinh-feed', 'Data model and the fan-out decision', 'Mô hình dữ liệu và quyết định fan-out', 'Fan-out khi ghi vs khi đọc · Người nổi tiếng triệu follower · Fan-out lai theo ngưỡng'],
      ['luu-feed', 'Storing and paginating feeds', 'Lưu và phân trang feed', 'Timeline trong Redis sorted set · Cursor theo thời gian + ID · Feed cho người dùng không hoạt động lâu'],
      ['xep-hang', 'Ranking: from chronological to scored', 'Xếp hạng: từ theo thời gian tới chấm điểm', 'Tín hiệu tương tác · Tính điểm offline vs online · Chống spam lên đầu feed'],
      ['thong-bao', 'A notification system: in-app, push, email, batching', 'Hệ thông báo: trong app, push, email, gom lô', 'Tuỳ chọn người dùng · Khử trùng · Giờ yên lặng · Hàng đợi ưu tiên · Trỏ email-infrastructure'],
    ]],
    ['Chapter 7 — Case study: chat and presence', 'Chương 7 — Case study: chat và trạng thái online', 'Nếu đã học api-design Ch11.3: chat ở mức sơ đồ — ở đây là thứ tự tin nhắn, đồng bộ nhiều thiết bị, lưu trữ nhiều năm.', [
      ['ket-noi', 'Connection layer: WebSocket gateways at scale', 'Tầng kết nối: gateway WebSocket ở quy mô lớn', 'Định tuyến tin nhắn tới đúng gateway · Pub/sub giữa các gateway · Deploy không cắt kết nối · Trỏ socket-io'],
      ['thu-tu', 'Message ordering, delivery receipts and sync across devices', 'Thứ tự tin nhắn, xác nhận đã nhận và đồng bộ nhiều thiết bị', 'Sequence theo cuộc trò chuyện · Gửi lại có idempotency key · Con trỏ đã đọc · Offline rồi online lại'],
      ['luu-tru', 'Storing billions of messages', 'Lưu hàng tỉ tin nhắn', 'Phân mảnh theo cuộc trò chuyện · Hành trình lưu trữ tin nhắn của Discord (MongoDB → Cassandra → ScyllaDB, theo blog chính thức) · Tin nhắn cũ sang kho rẻ'],
      ['presence-nhom', 'Presence, typing indicators and group chats', 'Trạng thái online, đang gõ và nhóm chat', 'Heartbeat + TTL · Fan-out cho nhóm lớn · Giới hạn thành viên · Mã hoá đầu-cuối nhập môn'],
    ]],
    ['Chapter 8 — Case study: payments and wallets', 'Chương 8 — Case study: thanh toán và ví', 'Tiền không được mất, không được nhân đôi.', [
      ['so-cai', 'Double-entry ledger design', 'Thiết kế sổ cái bút toán kép', 'Mỗi giao dịch hai dòng cân bằng · Không UPDATE số dư — cộng từ bút toán · Ví điểm 1:1 của cuongthai.com làm lại cho đúng'],
      ['luong-thanh-toan', 'Payment state machines and external providers', 'Máy trạng thái thanh toán và cổng bên ngoài', 'pending → succeeded/failed/expired · Webhook đến trước redirect · Trỏ online-payments cho VNPay/MoMo/Stripe'],
      ['nhat-quan', 'Idempotency, reconciliation and exactly-once money movement', 'Idempotency, đối soát và chuyển tiền đúng một lần', 'Idempotency key đầu-cuối · Đối soát hằng ngày với sao kê · Trỏ distributed-systems Ch8–9'],
      ['kiem-toan', 'Audit trails, limits and fraud hooks', 'Nhật ký kiểm toán, hạn mức và móc chống gian lận', 'Bảng chỉ ghi thêm · Hạn mức theo ngày · Điểm rủi ro trước khi duyệt'],
    ]],
    ['Chapter 9 — Case study: ticket booking without double-booking', 'Chương 9 — Case study: đặt vé chống double-booking', 'Nếu đã học api-design Ch11.4: đặt lịch và khoá — ở đây là mở bán vé với hàng trăm nghìn người cùng bấm.', [
      ['bai-toan', 'The problem: inventory, holds and the flash-sale spike', 'Bài toán: tồn kho, giữ chỗ và cú sốc mở bán', 'Case Ticketmaster 2022 · Ghế có số vs vé không số · Giữ chỗ có hạn'],
      ['chong-trung', 'Preventing double-booking: constraints, locks, conditional updates', 'Chống bán trùng: ràng buộc, khoá, cập nhật có điều kiện', 'UNIQUE constraint là tuyến cuối · SELECT … FOR UPDATE SKIP LOCKED · UPDATE … WHERE available > 0 · Exclusion constraint cho khoảng thời gian'],
      ['hang-cho', 'Virtual waiting rooms and admission control', 'Phòng chờ ảo và kiểm soát lượt vào', 'Token vào hàng · Chống bot · Cloudflare Waiting Room · Công bằng vs thông lượng'],
      ['thanh-toan-giu-cho', 'Hold → pay → confirm, with timeouts and compensation', 'Giữ chỗ → thanh toán → xác nhận, có hết hạn và bù trừ', 'Saga nhỏ · Thanh toán thành công sau khi chỗ hết hạn · Hoàn tiền tự động · Đặt phòng lab/thiết bị trong LabFlow'],
    ]],
    ['Chapter 10 — Case study: search, recommendations and leaderboards', 'Chương 10 — Case study: tìm kiếm, gợi ý và bảng xếp hạng', 'Đọc nhiều, tính nặng, trả lời nhanh.', [
      ['tim-kiem', 'Search and typeahead as a system', 'Tìm kiếm và gợi ý gõ như một hệ thống', 'Đồng bộ chỉ mục từ CSDL · Typeahead bằng trie/edge n-gram · Trỏ search-elasticsearch'],
      ['goi-y', 'Recommendations: offline pipelines and online serving', 'Gợi ý: pipeline offline và phục vụ online', 'Tính trước, lưu, phục vụ · Vector search cho "bài học tương tự" · Trỏ rag-vector-search'],
      ['bang-xep-hang', 'Real-time leaderboards and counters', 'Bảng xếp hạng và bộ đếm thời gian thực', 'Sorted set · Đếm lượt xem gần đúng (HyperLogLog) · Bộ đếm gom lô trước khi ghi CSDL'],
    ]],
    ['Chapter 11 — Case study: media upload and video streaming', 'Chương 11 — Case study: tải lên media và phát video', 'Byte lớn, băng thông lớn, chi phí lớn.', [
      ['upload', 'Resumable uploads straight to object storage', 'Tải lên nối tiếp được thẳng vào lưu trữ đối tượng', 'Multipart presigned · tus · Quét và kiểm định dạng · Trỏ media-processing'],
      ['xu-ly', 'Transcoding pipelines', 'Pipeline chuyển mã', 'Hàng đợi việc nặng · Máy GPU ở nhà vs cloud · Trạng thái xử lý hiển thị cho người dùng'],
      ['phat', 'Adaptive streaming: HLS/DASH and CDN costs', 'Phát thích ứng: HLS/DASH và chi phí CDN', 'Nhiều mức chất lượng · Segment và manifest · Egress miễn phí của R2 thay đổi bài toán chi phí'],
    ]],
    ['Chapter 12 — Design docs, reviews and evolving architecture', 'Chương 12 — Tài liệu thiết kế, review và tiến hoá kiến trúc', 'Thiết kế ở công ty trông như thế nào.', [
      ['design-doc', 'Writing a design doc people actually read', 'Viết design doc người ta thật sự đọc', 'Bối cảnh, mục tiêu, phi mục tiêu · Phương án đã loại và vì sao · Kế hoạch triển khai và rollback'],
      ['adr', 'ADRs from the system designer’s seat (full method → Software Architecture)', 'ADR nhìn từ ghế người thiết kế hệ thống (bài bản → khoá Software Architecture)', 'Ghi lại "vì sao" bên cạnh design doc · Ví dụ: vì sao cuongthai.com build ở máy nhà và không push-to-deploy · Mẫu Nygard, vòng đời ADR, C4, arc42 → /courses/software-architecture Ch2'],
      ['monolith-micro', 'Modular monolith vs microservices, honestly', 'Modular monolith và microservices, nói thật', 'Chi phí vận hành microservices · Tách theo ranh giới dữ liệu · Strangler fig · Phần lớn đội nhỏ nên giữ monolith'],
      ['review-migration', 'Design reviews and large migrations', 'Review thiết kế và di chuyển lớn', 'Câu hỏi reviewer hay hỏi · Dual-write → backfill → chuyển đọc → tắt cũ · Feature flag'],
    ]],
    ['Chapter 13 — Capstone: design LabFlow AI for scale', 'Chương 13 — Dự án cuối khoá: thiết kế LabFlow AI cho quy mô lớn', 'Từ đồ án (Spring Boot + React + PostgreSQL + AIoT) lên hệ phục vụ nhiều trường, có design doc và một phần dựng thật.', [
      ['yeu-cau', 'Requirements and estimates for 50 universities', 'Yêu cầu và ước lượng cho 50 trường', 'Người dùng, thiết bị IoT gửi số liệu, đặt lịch phòng lab · SLO và chi phí mục tiêu'],
      ['kien-truc', 'Architecture: services, data, events, IoT ingestion', 'Kiến trúc: dịch vụ, dữ liệu, sự kiện, thu nhận IoT', 'MQTT → hàng đợi → kho chuỗi thời gian · Đặt lịch chống trùng · Cache, CDN, R2 · Nhiều tenant'],
      ['dung-thu', 'Build a vertical slice on Docker + VPS + Cloudflare', 'Dựng một lát cắt dọc trên Docker + VPS + Cloudflare', 'Đặt lịch + thu nhận cảm biến chạy thật · Thử tải bằng k6 · Đo so với ước lượng'],
      ['bao-ve', 'Design doc, review and defending it', 'Design doc, review và bảo vệ', 'Nộp design doc + 3 ADR · Phản biện chéo · Trình bày trước hội đồng/nhà tuyển dụng'],
    ]],
  ]),
};
