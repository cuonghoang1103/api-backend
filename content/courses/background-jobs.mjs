/**
 * Hàng đợi & Background Jobs — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn
 * sau theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'background-jobs',
    title: 'Queues & Background Jobs',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/background-jobs.png?v=1',
    shortDescription: 'Move slow and unreliable work out of the request: queues, workers, retries, scheduled jobs and events with BullMQ on Redis — plus the failure modes (duplicates, poison messages, lost jobs) you only meet in production.|||Đưa việc chậm và dễ hỏng ra khỏi request: hàng đợi, worker, thử lại, việc định kỳ và sự kiện với BullMQ trên Redis — cùng những kiểu hỏng (trùng lặp, thông điệp độc, mất job) mà chỉ production mới gặp.',
    description: 'Khoá hàng đợi và việc chạy nền cho lập trình viên Node.js. Vì sao không làm mọi thứ trong request; hàng đợi hoạt động thế nào; BullMQ trên Redis từ cơ bản tới nâng cao (retry, backoff, ưu tiên, trễ, lặp lịch, luồng cha–con, rate limit); thiết kế job idempotent; xử lý lỗi và dead-letter; việc định kỳ (cron) an toàn khi chạy nhiều máy; sự kiện và outbox; so sánh RabbitMQ, SQS, Kafka; giám sát hàng đợi; chạy worker trong Docker/Compose; và dự án cuối khoá gửi email, xử lý ảnh, nhắc lịch.',
    whatYouLearn: 'Tách việc chậm ra worker; cấu hình retry/backoff hợp lý; viết job chạy lại an toàn; xử lý job hỏng mãi; lên lịch việc định kỳ không chạy trùng; dùng outbox để không mất sự kiện; chọn đúng công cụ hàng đợi; giám sát và mở rộng worker.',
    requirements: 'Node.js + TypeScript cơ bản, Redis cơ bản. Nên học trước khoá Node.js, Redis và Docker.',
    documentsNote: 'Tài liệu chính: docs.bullmq.io • redis.io/docs • rabbitmq.com/docs • microservices.io (transactional outbox) • AWS SQS docs.',
  },
  sections: khung('job', [
    ['Section 0 — Why background work', 'Mục 0 — Vì sao cần việc chạy nền', 'Request phải nhanh; việc chậm đi đâu.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What queues and background jobs are, and why every real app has them', 'Bắt đầu tại đây (1/2) — Hàng đợi và việc chạy nền là gì, vì sao app thật nào cũng có', 'Hàng đợi bằng hình ảnh đời thường · Lịch sử message queue · Gửi email, xử lý ảnh, nhắc lịch · Câu hỏi phỏng vấn'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Life without a queue: timeouts, lost emails, duplicate charges', 'Bắt đầu tại đây (2/2) — Khi không có hàng đợi: timeout, mất email, trừ tiền hai lần', 'Sự cố thật có nguồn · Tình huống đồ án · Lộ trình học'],
      ['mo-hinh', 'Producer, queue, consumer: the model', 'Producer, hàng đợi, consumer: mô hình', 'Tách thời gian · Đệm tải · Đảm bảo giao hàng'],
      ['cai-dat', 'Setting up Redis and BullMQ', 'Cài Redis và BullMQ', 'Redis trong Docker · Queue + Worker đầu tiên · Bảng điều khiển'],
    ]],
    ['Chapter 1 — BullMQ fundamentals', 'Chương 1 — BullMQ căn bản', 'Queue, Worker, Job và vòng đời của một job.', [
      ['vong-doi', 'The life of a job', 'Vòng đời một job', 'waiting → active → completed/failed · Xem trong Redis'],
      ['worker', 'Workers and concurrency', 'Worker và số việc song song', 'concurrency · Nhiều process · Tắt êm (graceful shutdown)'],
      ['du-lieu', 'Job data and results', 'Dữ liệu và kết quả của job', 'Chỉ gửi ID không gửi cả object · Giới hạn kích thước · Kết quả trả về'],
      ['tuy-chon', 'Delays, priorities and job options', 'Trễ, ưu tiên và tuỳ chọn job', 'delay · priority · removeOnComplete · jobId tự đặt'],
    ]],
    ['Chapter 2 — Failure: retries and dead letters', 'Chương 2 — Thất bại: thử lại và hàng đợi chết', 'Mọi thứ sẽ hỏng; làm sao hỏng cho đẹp.', [
      ['retry', 'Retries and backoff', 'Thử lại và lùi dần', 'attempts · exponential backoff · Lỗi tạm thời vs vĩnh viễn'],
      ['doc', 'Poison messages and dead-letter handling', 'Thông điệp độc và xử lý job chết', 'Job hỏng mãi · Chuyển sang hàng đợi lỗi · Chạy lại bằng tay'],
      ['stalled', 'Stalled jobs and crashed workers', 'Job treo và worker sập', 'Lock · Stalled check · Job chạy lại lần hai'],
      ['timeout', 'Timeouts and cancellation', 'Timeout và huỷ job', 'Job chạy quá lâu · AbortSignal · Dọn dở dang'],
    ]],
    ['Chapter 3 — Idempotency and exactly-once myths', 'Chương 3 — Idempotency và huyền thoại "đúng một lần"', 'At-least-once nghĩa là phải chịu được trùng.', [
      ['at-least-once', 'At-least-once delivery, explained', 'Giao ít nhất một lần, giải thích', 'Vì sao "đúng một lần" gần như không có · Hệ quả'],
      ['idempotent', 'Writing idempotent jobs', 'Viết job idempotent', 'Khoá duy nhất · Kiểm đã làm chưa · Ràng buộc CSDL'],
      ['dedup', 'Deduplication in BullMQ', 'Chống trùng trong BullMQ', 'jobId · deduplication option · Debounce'],
      ['thu-tu', 'Ordering and concurrency conflicts', 'Thứ tự và xung đột đồng thời', 'Khi thứ tự quan trọng · Group theo khoá · Khoá lạc quan'],
    ]],
    ['Chapter 4 — Scheduled and recurring work', 'Chương 4 — Việc định kỳ và lặp lại', 'Cron chạy đúng một lần dù có nhiều máy.', [
      ['cron', 'Cron in a multi-instance world', 'Cron khi chạy nhiều máy', 'node-cron chạy trùng · Leader duy nhất · Job scheduler của BullMQ'],
      ['lap-lich', 'Repeatable jobs and job schedulers', 'Job lặp lại và job scheduler', 'Cú pháp cron · Múi giờ · Bỏ lỡ lần chạy'],
      ['nhac-lich', 'Reminders and delayed notifications', 'Nhắc lịch và thông báo trễ', 'Nhắc hẹn khám 24h trước · Huỷ khi đổi lịch'],
      ['bao-tri', 'Maintenance jobs: cleanup, reports, backups', 'Việc bảo trì: dọn dẹp, báo cáo, sao lưu', 'Dọn dữ liệu cũ · Báo cáo đêm · Trỏ khoá Deploy VPS'],
    ]],
    ['Chapter 5 — Flows, rate limits and priorities', 'Chương 5 — Luồng việc, giới hạn tần suất và ưu tiên', 'Việc nhiều bước và gọi API bên ngoài có giới hạn.', [
      ['flow', 'Parent–child flows', 'Luồng cha–con', 'FlowProducer · Chờ con xong · Gom kết quả'],
      ['rate-limit', 'Rate-limited queues for third-party APIs', 'Hàng đợi giới hạn tần suất cho API bên thứ ba', 'limiter · 429 · Gửi email theo hạn mức'],
      ['uu-tien', 'Fairness and priorities between users', 'Công bằng và ưu tiên giữa người dùng', 'Một người dùng chiếm hàng đợi · Hàng đợi riêng'],
      ['batch', 'Batching work', 'Gom việc theo lô', 'Gửi 1000 thông báo · Chia lô · Tiến độ'],
    ]],
    ['Chapter 6 — Events and the outbox pattern', 'Chương 6 — Sự kiện và mẫu outbox', 'Không mất sự kiện khi CSDL và hàng đợi lệch nhau.', [
      ['dual-write', 'The dual-write problem', 'Vấn đề ghi hai nơi', 'Lưu CSDL xong mà đẩy hàng đợi hỏng · Và ngược lại'],
      ['outbox', 'Transactional outbox with Postgres', 'Transactional outbox với Postgres', 'Bảng outbox · Relay · Prisma transaction'],
      ['pubsub', 'Pub/sub and event-driven design', 'Pub/sub và thiết kế hướng sự kiện', 'Redis pub/sub vs stream · Nhiều consumer'],
      ['saga', 'Multi-step business processes (sagas)', 'Quy trình nghiệp vụ nhiều bước (saga)', 'Bù trừ khi hỏng giữa chừng · Ví dụ đặt lịch + thanh toán'],
    ]],
    ['Chapter 7 — Other queue systems', 'Chương 7 — Các hệ thống hàng đợi khác', 'RabbitMQ, SQS, Kafka: khi nào dùng cái gì.', [
      ['rabbitmq', 'RabbitMQ: exchanges, queues, acks', 'RabbitMQ: exchange, queue, ack', 'Chạy trong Docker · Routing · Ack/nack'],
      ['sqs', 'Cloud queues: SQS and friends', 'Hàng đợi trên cloud: SQS và họ hàng', 'Visibility timeout · FIFO · DLQ'],
      ['kafka', 'Kafka: a log, not a queue', 'Kafka: một nhật ký, không phải hàng đợi', 'Partition · Consumer group · Khi nào đáng'],
      ['chon', 'Choosing for your project', 'Chọn cho dự án của bạn', 'Bảng so sánh · Đồ án SV thì BullMQ là đủ'],
    ]],
    ['Chapter 8 — Operating queues in production', 'Chương 8 — Vận hành hàng đợi trên production', 'Giám sát, mở rộng và chạy worker trong Docker.', [
      ['giam-sat', 'Monitoring: depth, latency, failures', 'Giám sát: độ dài hàng đợi, độ trễ, lỗi', 'Bull Board · Chỉ số · Cảnh báo'],
      ['docker', 'Running workers with Docker Compose', 'Chạy worker bằng Docker Compose', 'Service worker riêng · Scale · Tắt êm · Trỏ khoá Docker'],
      ['mo-rong', 'Scaling workers and Redis', 'Mở rộng worker và Redis', 'Thêm worker · Bộ nhớ Redis · maxmemory-policy noeviction'],
      ['deploy', 'Deploying without losing jobs', 'Deploy mà không mất job', 'Tắt worker cũ êm · Đổi dạng dữ liệu job · Phiên bản job'],
    ]],
    ['Chapter 9 — Testing and debugging async systems', 'Chương 9 — Test và gỡ lỗi hệ bất đồng bộ', 'Test job và tìm lỗi khi mọi thứ xảy ra "sau".', [
      ['test', 'Testing jobs and workers', 'Test job và worker', 'Test logic tách khỏi hàng đợi · Test tích hợp với Redis thật · Trỏ khoá Testing'],
      ['trace', 'Tracing a request through the queue', 'Lần theo một request qua hàng đợi', 'Correlation ID · Log có cấu trúc'],
      ['su-co', 'Classic incidents and how to diagnose them', 'Sự cố kinh điển và cách chẩn đoán', 'Hàng đợi phình · Job trùng · Redis đầy'],
      ['phong-van', 'Interview questions on queues', 'Câu hỏi phỏng vấn về hàng đợi', 'Câu hay gặp và ý trả lời'],
    ]],
    ['Chapter 10 — Capstone: notifications for a booking app', 'Chương 10 — Dự án cuối khoá: thông báo cho app đặt lịch', 'Email xác nhận, nhắc lịch, xử lý ảnh và báo cáo đêm.', [
      ['thiet-ke', 'Designing the queues', 'Thiết kế các hàng đợi', 'Việc nào vào hàng đợi nào · Ưu tiên · Retry'],
      ['xay-dung', 'Building producers and workers', 'Dựng producer và worker', 'Email qua Mailpit · Resize ảnh · Outbox'],
      ['van-hanh', 'Operating it', 'Vận hành', 'Compose · Giám sát · Diễn tập sự cố'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án'],
    ]],
  ]),
};
