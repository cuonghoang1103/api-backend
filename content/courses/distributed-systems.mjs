/**
 * Hệ thống phân tán — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: đây là LÝ THUYẾT + CƠ CHẾ (đồng hồ, nhân bản, đồng thuận, mô hình nhất quán, giao dịch phân tán).
 * - api-design Ch9 (bản sao đọc, sharding mức API), Ch10 (outbox mức API) — chỉ nhắc, đi sâu cơ chế.
 * - background-jobs Ch3 (idempotency, "đúng một lần" trong hàng đợi) và Ch6 (outbox) — bài "Nếu đã học …".
 * - kafka Ch4 (giao nhận trong Kafka), redis Ch11 (Sentinel/Cluster), postgresql Ch15 (streaming replication) — trỏ sang.
 * - system-design (khoá anh em, Nhóm C) dùng các khái niệm này để THIẾT KẾ sản phẩm; khoá này không làm case study sản phẩm.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'cs-fundamentals', name: 'Nền tảng khoa học máy tính', icon: 'Cpu', sortOrder: 9 },
  course: {
    slug: 'distributed-systems',
    title: 'Distributed Systems',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/distributed-systems.png?v=1',
    shortDescription: 'Distributed systems from first principles: failure models, clocks and ordering, replication, partitioning, CAP and PACELC, consistency models, Raft and Paxos, distributed transactions, idempotency and exactly-once — with real outages and hands-on labs.|||Hệ thống phân tán từ nguyên lý: mô hình lỗi, đồng hồ và thứ tự, nhân bản, phân mảnh, CAP và PACELC, mô hình nhất quán, Raft và Paxos, giao dịch phân tán, idempotency và exactly-once — kèm sự cố thật và lab tự tay làm.',
    description: 'Khoá hệ thống phân tán cho lập trình viên đã làm backend và muốn hiểu vì sao "nhiều máy" khó hơn "một máy" gấp bội. Tám ngộ nhận về mạng; mô hình lỗi (crash, omission, Byzantine); thời gian và đồng hồ (NTP, Lamport, vector clock, HLC); nhân bản leader/follower, multi-leader, leaderless; phân mảnh và consistent hashing; CAP, PACELC và các mô hình nhất quán (linearizable, sequential, causal, eventual, read-your-writes); đồng thuận với Raft (tự cài) và Paxos; khoá phân tán và fencing token; giao dịch phân tán (2PC, saga, outbox); idempotency và exactly-once; CRDT; sự cố thật (split-brain, phân vùng mạng) và kiểm thử kiểu Jepsen. Dự án cuối: cài một kho khoá-giá trị nhân bản bằng Raft và làm nó sống sót qua phân vùng mạng.',
    whatYouLearn: 'Nhận ra lỗi phân tán trong hệ thống của mình trước khi người dùng thấy; lập luận về thứ tự sự kiện bằng đồng hồ logic; chọn chiến lược nhân bản và mức nhất quán có lý do; giải thích và tự cài Raft; dùng khoá phân tán an toàn (fencing); thiết kế saga/outbox và consumer idempotent; hiểu exactly-once thật sự nghĩa là gì; đọc báo cáo Jepsen; trả lời câu hỏi phân tán ở mức senior.',
    requirements: 'Đã viết backend (Node.js hoặc Java/Spring Boot) có CSDL, biết Docker. Nên học trước Hệ điều hành cho lập trình viên, Mạng máy tính cho lập trình viên, PostgreSQL và Queues & Background Jobs. Lab dùng Go hoặc Java (có hướng dẫn cả hai).',
    documentsNote: 'Tài liệu chính: "Designing Data-Intensive Applications" (Martin Kleppmann) • "Distributed Systems" (van Steen & Tanenbaum, bản miễn phí tại distributed-systems.net) • raft.github.io và bài báo "In Search of an Understandable Consensus Algorithm" (Ongaro & Ousterhout, 2014) • Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System" (1978) • MIT 6.5840 (pdos.csail.mit.edu/6.824) • jepsen.io/analyses • aphyr.com.',
  },
  sections: khung('dist', [
    ['Section 0 — Why many machines are hard', 'Mục 0 — Vì sao nhiều máy lại khó', 'Hệ phân tán là gì, lịch sử, và phòng lab mô phỏng lỗi mạng.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Distributed systems in everyday words, their history, and outages that made headlines', 'Bắt đầu tại đây (1/2) — Hệ phân tán bằng lời đời thường, lịch sử, và các sự cố lên báo', 'Nhóm bạn hẹn nhau qua tin nhắn bị trễ · Lamport 1978 → FLP 1985 → Paxos (công bố 1998) → CAP (Brewer 2000) → Dynamo 2007 → Raft 2014 · GitHub 21/10/2018: 43 giây mất kết nối giữa hai trung tâm dữ liệu dẫn tới hơn 24 giờ dịch vụ suy giảm · AWS us-east-1 04/2011: bão nhân bản lại EBS · Máy tính của bạn đã là hệ phân tán (điện thoại ↔ server ↔ CDN)'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Thiết kế và gỡ lỗi hệ nhiều dịch vụ không mất/trùng dữ liệu · Nền cho backend senior, SRE, kỹ sư hạ tầng, CSDL · Lộ trình: operating-systems + networking-for-developers → khoá này → system-design · Đọc DDIA song song · Mỗi chương một lab làm hỏng có chủ đích'],
      ['cai-dat', 'Your lab: multi-node clusters with Docker and network fault injection', 'Phòng lab: cụm nhiều nút bằng Docker và tiêm lỗi mạng', 'Compose 3–5 nút · tc netem (trễ, mất gói) · iptables/Toxiproxy cắt mạng · Pumba · Ghi log có mốc thời gian để đọc lại'],
      ['nga-nhan', 'The eight fallacies of distributed computing', 'Tám ngộ nhận về tính toán phân tán', 'Peter Deutsch và đồng nghiệp ở Sun (1994, thêm câu thứ 8 sau) · Mạng tin cậy, độ trễ bằng 0… · Mỗi ngộ nhận một lỗi thật trong code API'],
    ]],
    ['Chapter 1 — Failure models and timeouts', 'Chương 1 — Mô hình lỗi và timeout', 'Cái gì có thể hỏng, và làm sao biết nó đã hỏng.', [
      ['mo-hinh-loi', 'Crash, omission, timing and Byzantine failures', 'Lỗi dừng, lỗi bỏ sót, lỗi thời gian và lỗi Byzantine', 'Fail-stop vs fail-recover · Byzantine ở blockchain vs trung tâm dữ liệu · Chọn mô hình cho hệ của mình'],
      ['mang-khong-tin-cay', 'Unreliable networks: you cannot tell slow from dead', 'Mạng không tin cậy: không phân biệt được chậm và chết', 'Request mất, reply mất, nút treo GC · Timeout là đoán · Phát hiện lỗi phi-accrual'],
      ['partial-failure', 'Partial failure and cascading failure', 'Hỏng một phần và hỏng dây chuyền', 'Retry storm · Circuit breaker, bulkhead · Nếu đã học api-design Ch5: retry/backoff — ở đây là lý do toán học'],
      ['flp', 'The FLP impossibility result, informally', 'Định lý bất khả FLP, nói bằng lời', 'Fischer, Lynch, Paterson 1985 · Không đồng thuận chắc chắn trong mạng bất đồng bộ nếu có một nút có thể chết · Vì sao hệ thật vẫn dùng timeout'],
    ]],
    ['Chapter 2 — Time, clocks and ordering', 'Chương 2 — Thời gian, đồng hồ và thứ tự', 'Không có "bây giờ" chung cho mọi máy.', [
      ['dong-ho-vat-ly', 'Physical clocks, NTP and clock skew', 'Đồng hồ vật lý, NTP và lệch giờ', 'Đồng hồ thạch anh trôi · NTP và chrony · Monotonic vs wall clock trong code · Giây nhuận · Bài học: container UTC, máy chủ giờ địa phương'],
      ['lamport', 'Happened-before and Lamport clocks', 'Quan hệ xảy-ra-trước và đồng hồ Lamport', 'Bài báo Lamport 1978 · Bộ đếm logic · Thứ tự toàn phần có phá vỡ hoà'],
      ['vector-clock', 'Vector clocks and detecting concurrency', 'Vector clock và phát hiện ghi đồng thời', 'So sánh vector · Dynamo/Riak dùng để giữ nhiều phiên bản · Kích thước phình'],
      ['hlc-truetime', 'Hybrid logical clocks and Google TrueTime', 'Đồng hồ lai (HLC) và TrueTime của Google', 'HLC trong CockroachDB · Spanner (2012) chờ hết khoảng bất định · Vì sao bạn không có TrueTime'],
      ['last-write-wins', 'Last-write-wins and lost updates', 'Ghi sau thắng và cập nhật bị mất', 'LWW theo timestamp làm mất dữ liệu âm thầm · Ví dụ hai thiết bị sửa cùng ghi chú · Cách thay thế'],
    ]],
    ['Chapter 3 — Replication', 'Chương 3 — Nhân bản', 'Giữ nhiều bản sao dữ liệu mà không để chúng cãi nhau.', [
      ['leader-follower', 'Single-leader replication', 'Nhân bản một leader', 'Đồng bộ vs bất đồng bộ · Độ trễ nhân bản và read-your-writes · Nếu đã học postgresql Ch15: dựng streaming replica — ở đây là lý thuyết chung'],
      ['failover', 'Failover and split-brain', 'Chuyển đổi dự phòng và split-brain', 'Bầu leader mới · Hai leader cùng nhận ghi · Case GitHub 2018 (MySQL + Orchestrator) · Redis Sentinel và quorum (trỏ redis Ch11)'],
      ['multi-leader', 'Multi-leader replication and conflict resolution', 'Nhân bản nhiều leader và giải xung đột', 'Nhiều trung tâm dữ liệu · App offline-first · Chiến lược: LWW, gộp, hỏi người dùng'],
      ['leaderless', 'Leaderless replication: quorums, read repair, hinted handoff', 'Nhân bản không leader: quorum, sửa khi đọc, hinted handoff', 'N, W, R và W + R > N · Sloppy quorum · Dynamo, Cassandra · Anti-entropy bằng Merkle tree'],
      ['crdt', 'CRDTs: data types that merge themselves', 'CRDT: kiểu dữ liệu tự gộp', 'G-Counter, OR-Set · Soạn thảo cộng tác (Yjs, Automerge) · Khi nào CRDT hợp cho Notes của cuongthai.com'],
    ]],
    ['Chapter 4 — Partitioning', 'Chương 4 — Phân mảnh', 'Chia dữ liệu lên nhiều máy.', [
      ['cach-chia', 'Range vs hash partitioning', 'Chia theo khoảng và chia theo băm', 'Truy vấn theo khoảng · Điểm nóng · Nếu đã học api-design Ch9: sharding ở mức quyết định — ở đây là cơ chế'],
      ['consistent-hashing', 'Consistent hashing and virtual nodes', 'Băm nhất quán và nút ảo', 'Vòng băm · Thêm nút chỉ dời một phần khoá · Rendezvous hashing · Redis Cluster dùng hash slot'],
      ['rebalance-routing', 'Rebalancing and request routing', 'Chia lại và định tuyến request', 'Số partition cố định vs động · Ai biết khoá nằm đâu (client, proxy, coordinator) · ZooKeeper/etcd làm sổ đăng ký'],
      ['secondary-index', 'Secondary indexes across partitions', 'Chỉ mục phụ trên nhiều mảnh', 'Chỉ mục cục bộ (scatter-gather) vs toàn cục · Chi phí ghi · Ví dụ tìm kiếm theo email'],
    ]],
    ['Chapter 5 — CAP, PACELC and consistency models', 'Chương 5 — CAP, PACELC và mô hình nhất quán', 'Nhất quán nghĩa là gì — chính xác.', [
      ['cap', 'CAP, stated correctly', 'CAP, phát biểu cho đúng', 'Brewer 2000, chứng minh Gilbert & Lynch 2002 · Chỉ nói về lúc có phân vùng · Vì sao "chọn 2 trong 3" là cách nói sai'],
      ['pacelc', 'PACELC: latency vs consistency when there is no partition', 'PACELC: độ trễ và nhất quán khi mạng bình thường', 'Abadi 2010/2012 · Phân loại DynamoDB, Cassandra, Spanner, PostgreSQL có replica'],
      ['mo-hinh', 'Linearizability, sequential, causal and eventual consistency', 'Linearizable, tuần tự, nhân quả và nhất quán cuối cùng', 'Ví dụ bằng dòng thời gian · Session guarantees: read-your-writes, monotonic reads · Chọn mức cho từng tính năng'],
      ['isolation', 'Isolation levels vs consistency models', 'Mức cô lập giao dịch và mô hình nhất quán', 'Serializable vs linearizable · Snapshot isolation và write skew · Trỏ postgresql Ch11'],
    ]],
    ['Chapter 6 — Consensus', 'Chương 6 — Đồng thuận', 'Nhiều máy cùng đồng ý một giá trị dù có máy chết.', [
      ['bai-toan', 'The consensus problem and replicated state machines', 'Bài toán đồng thuận và máy trạng thái nhân bản', 'Log nhân bản · Bầu leader, khoá, cấu hình · Quorum đa số'],
      ['paxos', 'Paxos, explained without pain', 'Paxos, giải thích không đau đầu', 'Lamport — viết cuối thập niên 1980, công bố 1998 · Proposer, acceptor · Multi-Paxos · Vì sao khó cài đúng'],
      ['raft', 'Raft: leader election, log replication, safety', 'Raft: bầu leader, nhân bản log, tính an toàn', 'Term, vote, heartbeat · Commit index · Mô phỏng tại raft.github.io · Thay đổi thành viên'],
      ['raft-lab', 'Lab: implement Raft leader election and log replication', 'Lab: tự cài bầu leader và nhân bản log của Raft', 'Go hoặc Java · Kiểm bằng cắt mạng ngẫu nhiên · Theo khung MIT 6.5840'],
      ['etcd-zk', 'etcd, ZooKeeper and consensus in the wild', 'etcd, ZooKeeper và đồng thuận ngoài đời', 'etcd dưới Kubernetes · ZooKeeper (ZAB) → Kafka KRaft · Khi nào dùng dịch vụ đồng thuận thay vì tự làm'],
    ]],
    ['Chapter 7 — Coordination: locks, leases and leader election', 'Chương 7 — Phối hợp: khoá, lease và bầu leader', 'Chỉ một máy được làm việc này — thật sự chỉ một.', [
      ['khoa-phan-tan', 'Distributed locks and why they are dangerous', 'Khoá phân tán và vì sao chúng nguy hiểm', 'Khoá hết hạn khi tiến trình đang treo GC · Tranh luận Redlock (Kleppmann vs antirez, 2016) · Khi nào khoá của PostgreSQL (advisory lock) là đủ'],
      ['fencing', 'Fencing tokens', 'Fencing token', 'Số tăng dần kèm mỗi lần cấp khoá · Tài nguyên từ chối token cũ · Cài thử với PostgreSQL'],
      ['lease-leader', 'Leases and leader election in practice', 'Lease và bầu leader trong thực tế', 'Lease trong etcd · Một cron chỉ chạy trên một máy · Leader election cho worker BullMQ/Spring @Scheduled'],
    ]],
    ['Chapter 8 — Distributed transactions', 'Chương 8 — Giao dịch phân tán', 'Ghi vào nhiều nơi mà không để lệch.', [
      ['dual-write', 'The dual-write problem', 'Bài toán ghi kép', 'Ghi CSDL rồi gửi sự kiện: một trong hai hỏng · Ví dụ đặt hàng + trừ kho + gửi email'],
      ['2pc', 'Two-phase commit and its blocking problem', 'Two-phase commit và vấn đề chặn', 'Coordinator và participant · Coordinator chết giữa chừng · XA · PREPARE TRANSACTION trong PostgreSQL'],
      ['saga', 'Sagas: orchestration vs choreography', 'Saga: điều phối và vũ đạo', 'Bước bù trừ · Trạng thái trung gian nhìn thấy được · Temporal/Camunda nhập môn'],
      ['outbox-cdc', 'Transactional outbox, inbox and CDC', 'Outbox, inbox và CDC', 'Nếu đã học background-jobs Ch6 và kafka Ch7: outbox + Debezium — ở đây là chứng minh vì sao nó đúng · Inbox chống trùng phía nhận'],
    ]],
    ['Chapter 9 — Idempotency and exactly-once', 'Chương 9 — Idempotency và exactly-once', 'Làm một việc đúng một lần trong thế giới gửi lại.', [
      ['giao-nhan', 'Delivery semantics end to end', 'Ngữ nghĩa giao nhận từ đầu tới cuối', 'At-most/at-least/exactly-once · Nếu đã học background-jobs Ch3 và kafka Ch4 — ở đây là góc nhìn toàn hệ thống · Exactly-once = at-least-once + idempotent'],
      ['idempotency-key', 'Idempotency keys across services', 'Idempotency key xuyên dịch vụ', 'Truyền khoá qua các bước · Lưu kết quả · Hết hạn khoá · Trỏ online-payments cho webhook thanh toán'],
      ['dedup', 'Deduplication, ordering and sequence numbers', 'Khử trùng, thứ tự và số thứ tự', 'Bảng đã xử lý · Sequence theo thực thể · Xử lý sự kiện đến sai thứ tự'],
    ]],
    ['Chapter 10 — Real failures and testing distributed systems', 'Chương 10 — Sự cố thật và kiểm thử hệ phân tán', 'Học từ cái đã hỏng, và tự làm hỏng trước.', [
      ['postmortem', 'Reading public postmortems', 'Đọc báo cáo sự cố công khai', 'GitHub 2018 · AWS us-east-1 2011 · Cách đọc: dòng thời gian, nguyên nhân gốc, hành động · Kho danh sách postmortem công khai'],
      ['jepsen', 'Jepsen: what it tests and how to read a report', 'Jepsen: nó kiểm gì và đọc báo cáo thế nào', 'Kyle Kingsbury (từ 2013) · Lịch sử thao tác + kiểm linearizability · Các CSDL từng bị phát hiện mất dữ liệu đã ghi nhận · Đọc một phân tích trên jepsen.io'],
      ['chaos', 'Chaos engineering and fault injection', 'Chaos engineering và tiêm lỗi', 'Chaos Monkey của Netflix (đầu thập niên 2010) · Giả thuyết → tiêm lỗi → quan sát · Trỏ incident-response cho phần ứng phó'],
      ['kiem-thu', 'Deterministic simulation and property-based testing', 'Mô phỏng tất định và kiểm thử theo tính chất', 'Ý tưởng mô phỏng tất định (FoundationDB) · Kiểm thử theo tính chất cho máy trạng thái · Model checking với TLA+ nhập môn'],
    ]],
    ['Chapter 11 — Distributed systems in interviews', 'Chương 11 — Hệ phân tán trong phỏng vấn', 'Câu hỏi mức senior và cách trả lời bằng đánh đổi.', [
      ['cau-hoi', 'Classic questions and model answers', 'Câu hỏi kinh điển và ý trả lời', 'CAP thật sự nói gì · Raft bầu leader thế nào · Làm sao chống trừ tiền hai lần · Khoá phân tán có an toàn không'],
      ['thao-luan', 'Discussing trade-offs like a senior engineer', 'Bàn đánh đổi như kỹ sư senior', 'Nêu mô hình lỗi trước · Đặt tên mức nhất quán · Nói rõ cái giá · Trỏ system-design để áp vào sản phẩm'],
      ['doc-them', 'Papers and courses to read next', 'Bài báo và khoá học nên đọc tiếp', 'Dynamo, Spanner, Bigtable, Raft, Chubby · MIT 6.5840 · Blog của Kleppmann và Jepsen'],
    ]],
    ['Chapter 12 — Capstone: a Raft-replicated key-value store', 'Chương 12 — Dự án cuối khoá: kho khoá-giá trị nhân bản bằng Raft', 'Tự cài, triển khai bằng Docker trên VPS và làm nó sống qua phân vùng mạng.', [
      ['thiet-ke', 'Design: API, log, snapshots and client semantics', 'Thiết kế: API, log, snapshot và ngữ nghĩa phía client', 'GET/PUT/CAS · Client retry với request id · Linearizable read qua leader'],
      ['xay-dung', 'Build: Raft core, state machine, persistence', 'Dựng: lõi Raft, máy trạng thái, lưu bền', 'Ghi log + fsync · Snapshot · Khởi động lại nút'],
      ['trien-khai', 'Deploy: 3–5 nodes with Docker, metrics and dashboards', 'Triển khai: 3–5 nút bằng Docker, metric và dashboard', 'Compose trên VPS/máy nhà · Prometheus + Grafana · Theo dõi term, commit index, leader'],
      ['pha', 'Break it: partitions, clock skew, crashes — and a mini Jepsen', 'Phá: phân vùng, lệch đồng hồ, sập nút — và một Jepsen thu nhỏ', 'Kịch bản lỗi tự động · Ghi lịch sử và kiểm linearizability (Porcupine/Knossos) · Sửa lỗi tìm được'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án Raft trong phỏng vấn'],
    ]],
  ]),
};
