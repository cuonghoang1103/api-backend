/**
 * Apache Kafka — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo yêu cầu người dùng
 * ("bổ sung vào courses cái khung, tên khoá học, ảnh bìa trước — làm sau cùng cũng được"): công khai như
 * các khoá khung khác (bài chưa soạn hiện "Đang soạn"). Soạn chi tiết SAU CÙNG — sau DBI202 và phần ⭐ Chuyên
 * sâu của DBI202/CSD201 — theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 * Ảnh bìa: scripts/covers/kafka.png (course-cover-offline.mjs, logo simple-icons apachekafka).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'kafka',
    title: 'Apache Kafka',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/kafka.png?v=1',
    shortDescription: 'Event streaming from zero: what a distributed log is, topics, partitions, consumer groups, delivery guarantees, Kafka Connect and Streams, Docker, Spring Boot and Node.js — plus the production failures behind interview questions.|||Event streaming từ con số 0: nhật ký phân tán là gì, topic, partition, consumer group, đảm bảo giao nhận, Kafka Connect và Streams, Docker, Spring Boot và Node.js — cùng các sự cố production đứng sau câu hỏi phỏng vấn.',
    description: 'Khoá Kafka cho lập trình viên backend đã biết một ngôn ngữ server (Java/Spring hoặc Node.js), SQL và Docker. Vì sao hệ thống lớn cần một nhật ký sự kiện; lịch sử Kafka từ LinkedIn tới Apache; kiến trúc broker, topic, partition, offset, replication; producer và consumer từ cơ bản tới nâng cao (key, acks, batching, idempotence, transaction, rebalance); at-most/at-least/exactly-once; schema và Schema Registry; Kafka Connect và CDC từ PostgreSQL; Kafka Streams; vận hành (KRaft, giám sát, retention, compaction, bảo mật); so sánh RabbitMQ/Redis Streams/Pulsar; và dự án cuối khoá: hệ thống đặt hàng hướng sự kiện nhiều dịch vụ.',
    whatYouLearn: 'Giải thích Kafka bằng ngôn ngữ đời thường; chạy cụm Kafka bằng Docker Compose; viết producer/consumer bằng Java (Spring Boot) và Node.js; chọn khoá partition và số partition; xử lý rebalance, trùng lặp và thứ tự; đạt exactly-once khi cần; dùng Connect để đồng bộ CSDL; giám sát consumer lag; trả lời câu hỏi phỏng vấn Kafka có cơ sở.',
    requirements: 'Một ngôn ngữ backend (Java/Spring Boot hoặc Node.js), SQL cơ bản, Docker cơ bản. Nên học trước khoá Docker, PostgreSQL và Queues & Background Jobs.',
    documentsNote: 'Tài liệu chính: kafka.apache.org/documentation • developer.confluent.io • "Kafka: The Definitive Guide" (O’Reilly, 2nd ed.) • "Designing Data-Intensive Applications" (Kleppmann) • spring.io/projects/spring-kafka • kafka.js.org.',
  },
  sections: khung('kafka', [
    ['Section 0 — Why Kafka exists', 'Mục 0 — Vì sao có Kafka', 'Kafka là gì, sinh ra để giải bài toán nào, và ai cần nó.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What Kafka is, in everyday words, and where it came from', 'Bắt đầu tại đây (1/2) — Kafka là gì bằng lời đời thường, và nó từ đâu ra', 'Cuốn sổ chỉ ghi thêm · LinkedIn 2011 → Apache → Confluent · Ai dùng: Uber, Netflix, ngân hàng, Shopee · Câu hỏi phỏng vấn mở đầu'],
      ['bat-dau-khi-nao-can', 'Start here (2/2) — When you need Kafka and when you do not', 'Bắt đầu tại đây (2/2) — Khi nào cần Kafka và khi nào không', 'Gọi API trực tiếp vỡ ra sao khi hệ thống lớn · Sự cố thật có nguồn · Đồ án sinh viên thường KHÔNG cần · Lộ trình học'],
      ['mo-hinh', 'Messaging models: queue, pub/sub, log', 'Các mô hình nhắn tin: hàng đợi, pub/sub, nhật ký', 'So với BullMQ/RabbitMQ · Đọc lại được · Nhiều nhóm đọc độc lập'],
      ['cai-dat', 'Running Kafka locally with Docker Compose', 'Chạy Kafka trên máy bằng Docker Compose', 'KRaft một node · kafka-topics / console producer / consumer · Kafka UI'],
    ]],
    ['Chapter 1 — Core concepts', 'Chương 1 — Khái niệm cốt lõi', 'Broker, topic, partition, offset — nền của mọi thứ.', [
      ['topic-partition', 'Topics, partitions and offsets', 'Topic, partition và offset', 'Nhật ký chỉ ghi thêm · Thứ tự trong một partition · Offset là vị trí đọc'],
      ['broker-cluster', 'Brokers, clusters and the controller', 'Broker, cụm và controller', 'Một cụm nhiều broker · Leader/follower · KRaft thay ZooKeeper'],
      ['replication', 'Replication and in-sync replicas', 'Nhân bản và ISR', 'replication.factor · min.insync.replicas · Mất một broker thì sao'],
      ['luu-tru', 'How Kafka stores data on disk', 'Kafka lưu dữ liệu trên đĩa thế nào', 'Segment · Index · Vì sao ghi tuần tự lại nhanh · Page cache'],
    ]],
    ['Chapter 2 — Producers', 'Chương 2 — Producer', 'Ghi sự kiện vào Kafka đúng cách.', [
      ['producer-co-ban', 'Your first producer (Java and Node.js)', 'Producer đầu tiên (Java và Node.js)', 'Serializer · send đồng bộ/bất đồng bộ · Callback'],
      ['key-partition', 'Keys and partitioning', 'Key và cách chia partition', 'Cùng key cùng partition · Giữ thứ tự theo đơn hàng · Key lệch (hot partition)'],
      ['acks-retry', 'acks, retries and durability', 'acks, thử lại và độ bền', 'acks=0/1/all · retries · delivery.timeout.ms'],
      ['idempotent-batch', 'Idempotent producer, batching and compression', 'Producer idempotent, gom lô và nén', 'enable.idempotence · linger.ms · batch.size · lz4/zstd'],
    ]],
    ['Chapter 3 — Consumers and consumer groups', 'Chương 3 — Consumer và consumer group', 'Đọc sự kiện, chia việc và không mất/không trùng.', [
      ['consumer-co-ban', 'Your first consumer', 'Consumer đầu tiên', 'poll loop · Deserializer · auto.offset.reset'],
      ['consumer-group', 'Consumer groups and partition assignment', 'Consumer group và phân chia partition', 'Mỗi partition một consumer trong nhóm · Thêm consumer để scale · Nhiều nhóm đọc độc lập'],
      ['commit-offset', 'Committing offsets', 'Commit offset', 'Tự động vs thủ công · Commit trước hay sau khi xử lý · Mất vs trùng'],
      ['rebalance', 'Rebalancing and its pitfalls', 'Rebalance và những cái bẫy', 'Cooperative sticky · max.poll.interval.ms · Consumer bị đá khỏi nhóm'],
    ]],
    ['Chapter 4 — Delivery guarantees', 'Chương 4 — Đảm bảo giao nhận', 'At-most-once, at-least-once, exactly-once — thật sự nghĩa là gì.', [
      ['ba-muc', 'The three delivery semantics', 'Ba mức ngữ nghĩa giao nhận', 'Ví dụ trừ tiền · Trùng lặp là mặc định · Vì sao "exactly once" khó'],
      ['idempotent-consumer', 'Idempotent consumers', 'Consumer idempotent', 'Khoá chống trùng · Bảng đã xử lý · UPSERT trong PostgreSQL'],
      ['transaction', 'Kafka transactions and exactly-once', 'Transaction của Kafka và exactly-once', 'read-process-write · isolation.level=read_committed · Giới hạn'],
      ['thu-tu-dlq', 'Ordering, retries and dead-letter topics', 'Thứ tự, thử lại và dead-letter topic', 'Thử lại mà không phá thứ tự · Retry topic · DLQ'],
    ]],
    ['Chapter 5 — Designing topics and events', 'Chương 5 — Thiết kế topic và sự kiện', 'Đặt tên, chọn số partition, định dạng dữ liệu.', [
      ['thiet-ke-su-kien', 'Designing event payloads', 'Thiết kế nội dung sự kiện', 'Sự kiện vs lệnh · Fat vs thin event · Trường bắt buộc'],
      ['so-partition', 'How many partitions, and naming conventions', 'Bao nhiêu partition, và quy ước đặt tên', 'Tính theo thông lượng · Không giảm được · Tên topic theo miền'],
      ['schema', 'Schemas: JSON, Avro, Protobuf and Schema Registry', 'Schema: JSON, Avro, Protobuf và Schema Registry', 'Tiến hoá schema · Tương thích xuôi/ngược · Registry'],
      ['retention-compaction', 'Retention and log compaction', 'Thời gian lưu và log compaction', 'retention.ms/bytes · Compacted topic làm bảng trạng thái · Tombstone'],
    ]],
    ['Chapter 6 — Kafka with Spring Boot and Node.js', 'Chương 6 — Kafka với Spring Boot và Node.js', 'Nối Kafka vào ứng dụng thật.', [
      ['spring-kafka', 'Spring for Apache Kafka', 'Spring for Apache Kafka', 'KafkaTemplate · @KafkaListener · Cấu hình YAML'],
      ['spring-loi', 'Error handling and retries in Spring', 'Xử lý lỗi và thử lại trong Spring', 'DefaultErrorHandler · @RetryableTopic · DLT'],
      ['node-kafkajs', 'Node.js with KafkaJS', 'Node.js với KafkaJS', 'Producer/consumer · Tắt êm · TypeScript'],
      ['test', 'Testing with Testcontainers', 'Test với Testcontainers', 'Kafka thật trong test · Kiểm consumer · Trỏ khoá Testing'],
    ]],
    ['Chapter 7 — Kafka Connect and change data capture', 'Chương 7 — Kafka Connect và CDC', 'Đồng bộ CSDL và hệ thống khác mà không tự viết code.', [
      ['connect', 'Kafka Connect: sources and sinks', 'Kafka Connect: nguồn và đích', 'Worker · Connector · Chế độ phân tán'],
      ['cdc-debezium', 'Change data capture from PostgreSQL with Debezium', 'CDC từ PostgreSQL bằng Debezium', 'WAL logical decoding · Mỗi thay đổi thành một sự kiện · Trỏ khoá PostgreSQL'],
      ['outbox', 'The outbox pattern with CDC', 'Mẫu outbox với CDC', 'Ghi CSDL và phát sự kiện không lệch nhau · Trỏ khoá Queues & Background Jobs'],
      ['sink', 'Sinks: search, warehouse, cache', 'Đích: tìm kiếm, kho dữ liệu, cache', 'Elasticsearch · S3 · Redis'],
    ]],
    ['Chapter 8 — Stream processing', 'Chương 8 — Xử lý luồng', 'Tính toán liên tục trên dòng sự kiện.', [
      ['kafka-streams', 'Kafka Streams basics', 'Kafka Streams cơ bản', 'KStream vs KTable · Topology · Stateless/stateful'],
      ['window-join', 'Windows, aggregations and joins', 'Cửa sổ thời gian, gom nhóm và join', 'Tumbling/hopping/session · Đếm theo phút · Join luồng với bảng'],
      ['ksqldb-flink', 'ksqlDB and Apache Flink at a glance', 'Lướt qua ksqlDB và Apache Flink', 'SQL trên luồng · Khi nào cần Flink'],
      ['event-sourcing', 'Event sourcing and CQRS', 'Event sourcing và CQRS', 'Trạng thái là tổng các sự kiện · Mô hình đọc riêng · Khi nào không nên'],
    ]],
    ['Chapter 9 — Operating Kafka in production', 'Chương 9 — Vận hành Kafka trên production', 'Giám sát, bảo mật, mở rộng và sự cố.', [
      ['giam-sat', 'Monitoring: consumer lag, throughput, under-replicated partitions', 'Giám sát: consumer lag, thông lượng, partition thiếu bản sao', 'Prometheus + Grafana · Cảnh báo lag · Trỏ khoá Observability'],
      ['bao-mat', 'Security: TLS, SASL and ACLs', 'Bảo mật: TLS, SASL và ACL', 'Mã hoá đường truyền · Xác thực · Phân quyền theo topic'],
      ['mo-rong', 'Scaling, rebalancing partitions and upgrades', 'Mở rộng, chia lại partition và nâng cấp', 'Thêm broker · Reassign · Nâng cấp cuốn chiếu'],
      ['managed', 'Managed Kafka: Confluent Cloud, MSK, Redpanda', 'Kafka dịch vụ: Confluent Cloud, MSK, Redpanda', 'Tự vận hành vs thuê · Chi phí · Trỏ khoá Cloud AWS'],
    ]],
    ['Chapter 10 — Kafka compared, and interviews', 'Chương 10 — So sánh Kafka, và phỏng vấn', 'Chọn đúng công cụ và trả lời có cơ sở.', [
      ['so-sanh', 'Kafka vs RabbitMQ vs Redis Streams vs Pulsar vs SQS', 'Kafka vs RabbitMQ vs Redis Streams vs Pulsar vs SQS', 'Bảng so sánh · Mô hình dữ liệu · Chi phí vận hành'],
      ['su-co', 'Classic production incidents', 'Sự cố production kinh điển', 'Lag phình · Rebalance liên hồi · Mất dữ liệu vì acks=1 · Partition nóng'],
      ['system-design', 'Kafka in system design interviews', 'Kafka trong phỏng vấn thiết kế hệ thống', 'Thiết kế thông báo, feed, đặt xe · Khi nào vẽ Kafka vào sơ đồ'],
      ['phong-van', 'Interview questions on Kafka', 'Câu hỏi phỏng vấn về Kafka', '40 câu hay gặp và ý trả lời · Trỏ trang /projects Kafka-like'],
    ]],
    ['Chapter 11 — Capstone: an event-driven order system', 'Chương 11 — Dự án cuối khoá: hệ thống đặt hàng hướng sự kiện', 'Nhiều dịch vụ nói chuyện qua Kafka, chạy thật bằng Docker Compose.', [
      ['thiet-ke', 'Designing services, topics and events', 'Thiết kế dịch vụ, topic và sự kiện', 'Đơn hàng · Kho · Thanh toán · Thông báo · Sơ đồ luồng'],
      ['xay-dung', 'Building the services (Spring Boot + Node.js)', 'Dựng các dịch vụ (Spring Boot + Node.js)', 'Producer/consumer idempotent · Outbox + Debezium · Saga bù trừ'],
      ['van-hanh', 'Running, monitoring and breaking it on purpose', 'Chạy, giám sát và cố tình làm hỏng', 'Compose cả cụm · Grafana lag · Tắt broker giữa chừng'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án trong phỏng vấn'],
    ]],
  ]),
};
