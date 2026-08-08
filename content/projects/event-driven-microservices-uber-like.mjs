/**
 * Case-study 3.5 — Event-Driven Microservices (Uber-like).
 *
 * The first project WITHOUT a single database, so "write both or neither"
 * stops being a SQL keyword. Three patterns carry the whole study: the
 * transactional outbox (7th appearance of the atomicity through-line), sagas
 * with business-level compensation, and idempotent consumers — all of which
 * matter inside a monolith too, the moment it calls anything over a network.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./event-driven-microservices-uber-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./event-driven-microservices-uber-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'event-driven-microservices-uber-like',
  title: 'Event-Driven Microservices (Uber-like)',
  titleEn: 'Event-Driven Microservices (Uber-like)',
  description:
    'Hệ thống gọi xe gồm sáu dịch vụ, sáu database riêng, nối với nhau bằng Kafka. Dự án đầu tiên KHÔNG còn một database duy nhất — nên "ghi hai thứ hoặc không ghi gì cả" không còn là một từ khoá SQL, mà là outbox, saga và bên nhận xử lý lặp lại được.',
  descriptionEn:
    'A ride-hailing system of six services with six private databases, joined by Kafka. The first project WITHOUT a single database — so "write both or neither" stops being a SQL keyword and becomes the outbox, sagas, and idempotent consumers.',
  techStack: [
    'Go', 'Gin', 'Node.js', 'TypeScript', 'Java', 'Spring Boot', 'Python', 'FastAPI',
    'Apache Kafka', 'PostgreSQL', 'Redis', 'WebSocket', 'OpenTelemetry', 'Docker', 'Kubernetes',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '8–10 tuần',
  durationEn: '8–10 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'ADVANCED',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- BẢNG QUAN TRỌNG NHẤT của cả dự án. Nó tồn tại để vá một khe hở
-- không vá được bằng cách nào khác: ghi database xong rồi mới bắn sự kiện
-- thì tiến trình chết ở giữa sẽ để lại chuyến đi mà KHÔNG AI biết là có.
--
-- Mẹo: đừng bắn sự kiện — ghi Ý ĐỊNH bắn vào chính database đó,
-- trong CÙNG một giao dịch với dữ liệu nghiệp vụ.

CREATE TABLE outbox (
    id             BIGSERIAL   PRIMARY KEY,
    aggregate_type VARCHAR(32) NOT NULL,   -- 'ride'
    -- Cũng chính là KHOÁ PHÂN VÙNG khi đẩy lên Kafka. Kafka chỉ đảm bảo
    -- thứ tự TRONG một phân vùng, nên mọi sự kiện của một chuyến phải
    -- cùng khoá, nếu không bên nhận thấy huỷ trước khi thấy tạo.
    aggregate_id   TEXT        NOT NULL,
    event_type     VARCHAR(64) NOT NULL,   -- 'ride.requested'
    payload        JSONB       NOT NULL,
    published_at   TIMESTAMPTZ,            -- NULL = chưa bắn
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chỉ mục MỘT PHẦN: chỉ đánh chỉ mục các dòng chưa bắn. Bảng này có thể
-- rất lớn nhưng phần cần quét luôn nhỏ.
CREATE INDEX outbox_unpublished_idx
    ON outbox (created_at) WHERE published_at IS NULL;

-- "Đúng một lần" KHÔNG TỒN TẠI: không có cách nào phân biệt "chưa làm"
-- với "đã làm nhưng lời xác nhận bị mất". Nên hệ thống chạy trên
-- giao ít nhất một lần + bên nhận tự nhận ra việc đã làm rồi.
CREATE TABLE processed_events (
    event_id     TEXT        PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rides (
    id         TEXT        PRIMARY KEY,
    user_id    TEXT        NOT NULL,
    driver_id  TEXT,
    pickup     geography(Point, 4326) NOT NULL,
    dropoff    geography(Point, 4326) NOT NULL,
    -- Trạng thái của SAGA. Khác giao dịch database ở chỗ: các trạng thái
    -- trung gian là THẬT và người dùng nhìn thấy chúng.
    status     VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    price      NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
    id     TEXT        PRIMARY KEY,
    -- Ghép tài xế là thao tác TRANH CHẤP: hai yêu cầu cùng lúc có thể
    -- chọn cùng một người. Cách chữa quen thuộc:
    --   UPDATE drivers SET status='ASSIGNED'
    --    WHERE id=$1 AND status='AVAILABLE'
    -- rồi kiểm số dòng bị ảnh hưởng. Bằng 0 nghĩa là có người nhanh hơn.
    status VARCHAR(16) NOT NULL DEFAULT 'OFFLINE',
    rating REAL        NOT NULL DEFAULT 5.0
);

-- Vị trí tài xế KHÔNG nằm ở Postgres mà ở Redis, dạng GEO, có thời hạn
-- 30 giây. Không đặt thời hạn thì bạn sẽ ghép khách với một chiếc xe
-- đã tắt máy từ lâu.`,

  schemaCodeEn: `-- THE MOST IMPORTANT TABLE in this project. It exists to close a gap that
-- nothing else can close: writing to the database and then emitting an event
-- means a process death in between leaves a ride NOBODY knows about.
--
-- The trick: do not emit an event — write the INTENT to emit into the same
-- database, in the SAME transaction as the business data.

CREATE TABLE outbox (
    id             BIGSERIAL   PRIMARY KEY,
    aggregate_type VARCHAR(32) NOT NULL,   -- 'ride'
    -- Also the PARTITION KEY when pushed to Kafka. Kafka only guarantees
    -- ordering WITHIN a partition, so all events for one ride must share a
    -- key, or consumers see the cancellation before the creation.
    aggregate_id   TEXT        NOT NULL,
    event_type     VARCHAR(64) NOT NULL,   -- 'ride.requested'
    payload        JSONB       NOT NULL,
    published_at   TIMESTAMPTZ,            -- NULL = not yet emitted
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A PARTIAL index: only unpublished rows are indexed. The table may grow
-- large while the part that gets scanned stays small.
CREATE INDEX outbox_unpublished_idx
    ON outbox (created_at) WHERE published_at IS NULL;

-- "Exactly once" DOES NOT EXIST: there is no way to distinguish "not done"
-- from "done, but the acknowledgement was lost". So systems run on
-- at-least-once delivery plus consumers that recognise their own work.
CREATE TABLE processed_events (
    event_id     TEXT        PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rides (
    id         TEXT        PRIMARY KEY,
    user_id    TEXT        NOT NULL,
    driver_id  TEXT,
    pickup     geography(Point, 4326) NOT NULL,
    dropoff    geography(Point, 4326) NOT NULL,
    -- SAGA state. Unlike a database transaction, the intermediate states
    -- here are REAL and users can see them.
    status     VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    price      NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
    id     TEXT        PRIMARY KEY,
    -- Matching is CONTENDED: two concurrent requests can pick the same
    -- person. The familiar remedy:
    --   UPDATE drivers SET status='ASSIGNED'
    --    WHERE id=$1 AND status='AVAILABLE'
    -- then check rows affected. Zero means somebody was faster.
    status VARCHAR(16) NOT NULL DEFAULT 'OFFLINE',
    rating REAL        NOT NULL DEFAULT 5.0
);

-- Driver positions do NOT live in Postgres but in Redis GEO structures with
-- a 30-second TTL. Without expiry you will match riders to a car whose
-- engine has been off for an hour.`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Biết vì sao KHÔNG nên chia nhỏ, rồi mới chia nhỏ để học',
      titleEn: 'Understand why NOT to split, then split anyway to learn',
      description:
        'Microservices không phải bậc thang tiếp theo sau khi giỏi hơn — nó là một đánh đổi, và với phần lớn hệ thống thì đánh đổi đó lỗ. Gọi hàm thành gọi mạng, JOIN thành hai lời gọi rồi tự ghép, một giao dịch thành saga tự viết. Vẫn nên làm dự án này, vì ba mẫu hình outbox / saga / xử lý lặp lại được cần thiết KỂ CẢ trong một khối duy nhất — ranh giới mạng mới là thứ sinh ra chúng.',
      descriptionEn:
        'Microservices are not the next rung up from getting better — they are a trade, and for most systems that trade loses. Function calls become network calls, JOINs become two calls joined in memory, one transaction becomes a hand-written saga. Build it anyway, because outbox / saga / idempotency are needed EVEN inside a monolith — network boundaries create them, not microservices.',
    },
    {
      phase: 'BACKEND',
      title: 'Outbox: kéo sự kiện vào trong giao dịch',
      titleEn: 'Outbox: pull the event inside the transaction',
      description:
        'Ghi database xong rồi bắn sự kiện có một khe hở không vá được: tiến trình chết ở giữa thì chuyến đi tồn tại mà không ai biết, khách chờ mãi một chiếc xe không bao giờ được gọi. Đảo thứ tự cũng hỏng theo chiều ngược lại. Lời giải là ghi Ý ĐỊNH bắn vào cùng database, cùng giao dịch, rồi một tiến trình riêng đọc và đẩy lên Kafka. Đây là lần thứ BẢY nguyên tắc "thực thi ở nơi có tính nguyên tử" xuất hiện.',
      descriptionEn:
        'Writing then emitting leaves an unpatchable gap: die in between and the ride exists while nobody knows, leaving the rider waiting for a car never requested. Reversing the order fails the other way. The answer is writing the INTENT to emit into the same database in the same transaction, with a separate relay pushing to Kafka. This is the SEVENTH appearance of "enforce where atomicity lives".',
      codeBlock:
        'tx, _ := db.Begin(ctx)\n'
        + 'defer tx.Rollback(ctx)\n'
        + '\n'
        + 'tx.Exec(ctx, `INSERT INTO rides (id, user_id, pickup, dropoff, status)\n'
        + "              VALUES ($1, $2, $3, $4, 'REQUESTED')`, ...)\n"
        + '\n'
        + 'tx.Exec(ctx, `INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload)\n'
        + "              VALUES ('ride', $1, 'ride.requested', $2)`, rideID, payload)\n"
        + '\n'
        + 'tx.Commit(ctx)   // cả hai cùng thành công, hoặc cả hai cùng không',
      codeLang: 'go',
    },
    {
      phase: 'BACKEND',
      title: 'Chấp nhận giao ít nhất một lần, làm bên nhận lặp lại được',
      titleEn: 'Accept at-least-once, make consumers idempotent',
      description:
        '"Đúng một lần" không tồn tại: không cách nào phân biệt "chưa làm" với "đã làm nhưng lời xác nhận bị mất". Đó là giới hạn cơ bản, không phải khiếm khuyết công cụ. Bên nhận tự nhận ra việc đã làm bằng bảng đã-xử-lý khoá theo ID sự kiện — và tác dụng phụ PHẢI nằm cùng giao dịch với dấu đã-xử-lý, tách ra là tạo lại đúng khe hở mà outbox sinh ra để vá.',
      descriptionEn:
        '"Exactly once" does not exist: nothing distinguishes "not done" from "done, acknowledgement lost". That is a fundamental limit, not a tool defect. Consumers recognise their own work via a processed-events table keyed by event id — and the side effect MUST share that transaction, or you rebuild the very gap the outbox closed.',
      codeBlock:
        'ct, err := tx.Exec(ctx,\n'
        + '    `INSERT INTO processed_events (event_id) VALUES ($1)\n'
        + '     ON CONFLICT (event_id) DO NOTHING`, ev.ID)\n'
        + 'if ct.RowsAffected() == 0 {\n'
        + '    return nil   // đã xử lý rồi — đây là đường đi BÌNH THƯỜNG\n'
        + '}\n'
        + '\n'
        + '// Tác dụng phụ CÙNG giao dịch với dấu đã-xử-lý.\n'
        + "tx.Exec(ctx, `UPDATE rides SET status = 'PAID' WHERE id = $1`, ev.RideID)\n"
        + 'return tx.Commit(ctx)',
      codeLang: 'go',
    },
    {
      phase: 'BACKEND',
      title: 'Khoá phân vùng quyết định cả thứ tự lẫn phân bố tải',
      titleEn: 'The partition key decides both ordering and load distribution',
      description:
        'Kafka chỉ đảm bảo thứ tự TRONG một phân vùng. Khoá ngẫu nhiên nghĩa là bên nhận có thể thấy ride.cancelled trước ride.requested. Khoá phải là định danh thực thể. Nhưng chọn khoá cũng là chọn cách tải phân bố: lấy city_id làm khoá thì thành phố lớn nhất thành nút thắt, mọi phân vùng khác rảnh.',
      descriptionEn:
        'Kafka only guarantees ordering WITHIN a partition. A random key means consumers can see ride.cancelled before ride.requested. The key must be the entity id. But choosing a key also chooses load distribution: key by city_id and your largest city becomes the bottleneck while every other partition idles.',
    },
    {
      phase: 'BACKEND',
      title: 'Saga: bù trừ là quyết định nghiệp vụ, không phải rollback',
      titleEn: 'Sagas: compensation is a business decision, not a rollback',
      description:
        'Chuyến đi ĐÃ XẢY RA trong thế giới thật — không thể hoàn tác. Thẻ bị từ chối thì bù trừ không phải xoá chuyến mà là ghi nợ và chặn đặt chuyến mới. Rollback xoá dấu vết, bù trừ tạo sự kiện mới ngược chiều và cả hai đều nằm trong lịch sử. Xếp các bước không hoàn tác được (gửi email) về CUỐI chuỗi, và nhớ rằng trạng thái trung gian là thật nên giao diện phải hiển thị được chúng.',
      descriptionEn:
        'The trip ALREADY HAPPENED in the real world — it cannot be undone. A declined card is compensated not by deleting the ride but by recording a debt and blocking new ones. Rollback erases evidence; compensation emits an opposing event and both stay in history. Push irreversible steps (sending email) to the END of the chain, and remember intermediate states are real, so the UI must show them.',
    },
    {
      phase: 'BACKEND',
      title: 'Ghép tài xế bằng ô không gian, nhớ 8 ô láng giềng',
      titleEn: 'Spatial matching by cell, including the 8 neighbours',
      description:
        'Quét 50.000 tài xế cho mỗi yêu cầu là không dùng được. Chia mặt đất thành ô sao cho hai điểm gần nhau có tiền tố chuỗi giống nhau, rồi chỉ xét ~50 ứng viên. Chi tiết hầu hết cách viết tự phát bỏ sót: phải thêm 8 ô láng giềng, vì khách đứng sát mép ô thì tài xế cách 100m có thể nằm ở ô bên cạnh với tiền tố hoàn toàn khác.',
      descriptionEn:
        'Scanning 50,000 drivers per request is unusable. Divide the earth into cells such that nearby points share a string prefix, then consider ~50 candidates. The detail most hand-rolled versions miss: include the 8 neighbouring cells, because a rider near a boundary may have a driver 100m away in an adjacent cell with a completely different prefix.',
      codeBlock:
        'res, _ := rdb.GeoSearchLocation(ctx, "drivers:available", &redis.GeoSearchLocationQuery{\n'
        + '    GeoSearchQuery: redis.GeoSearchQuery{\n'
        + '        Longitude: pickupLng, Latitude: pickupLat,\n'
        + '        Radius: 3, RadiusUnit: "km", Sort: "ASC", Count: 20,\n'
        + '    },\n'
        + '    WithDist: true,\n'
        + '}).Result()\n'
        + '\n'
        + '// Lọc bằng khoảng cách, XẾP HẠNG bằng thời gian di chuyển ước tính:\n'
        + '// tài xế cách 500m bên kia sông có thể mất 15 phút mới tới.',
      codeLang: 'go',
    },
    {
      phase: 'BACKEND',
      title: 'Truy vết phân tán, thư chết và ngắt mạch — cài TRƯỚC',
      titleEn: 'Tracing, dead letters and circuit breakers — install FIRST',
      description:
        'Một yêu cầu chạm sáu dịch vụ và sáu file log; "vì sao chuyến này chậm 8 giây" không trả lời được bằng cách đọc log. Sinh mã truy vết ở cổng API và truyền qua mọi lời gọi lẫn mọi sự kiện. Cài trước khi viết dịch vụ THỨ HAI — thêm vào sau nghĩa là sửa mọi handler đã viết, và thường không bao giờ được làm. Kèm theo: hàng đợi thư chết, ngắt mạch, và tách kiểm tra sống khỏi kiểm tra sẵn sàng.',
      descriptionEn:
        'One request touches six services and six log files; "why did this take 8 seconds" cannot be answered by reading logs. Generate a trace id at the gateway and propagate it through every call and event. Install it before writing the SECOND service — adding it later means editing every handler already written, and it usually never happens. Alongside: a dead letter queue, circuit breakers, and separate liveness/readiness checks.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách giết tiến trình đúng chỗ hiểm',
      titleEn: 'Verify by killing processes at exactly the wrong moment',
      description:
        'Giết dịch vụ chuyến đi bằng kill -9 NGAY SAU lệnh COMMIT — khởi động lại xong sự kiện vẫn phải được bắn. Bắn lại cùng một sự kiện thanh toán 10 lần — khách bị trừ đúng một lần. Tắt hẳn dịch vụ thanh toán — đặt chuyến vẫn phải hoạt động. Đếm số dòng chưa bắn trong outbox lúc tải cao — phải về 0 chứ không tăng dần.',
      descriptionEn:
        'kill -9 the ride service IMMEDIATELY after COMMIT — after restart the event must still emit. Replay the same payment event 10 times — the rider is charged once. Stop the payment service entirely — requesting rides must still work. Count unpublished outbox rows under load — they must return to zero, not climb.',
    },
  ],

  features: [
    { title: 'Sáu dịch vụ, sáu database riêng', titleEn: 'Six services, six private databases', description: 'Không dịch vụ nào đọc thẳng database của dịch vụ khác.', descriptionEn: 'No service reads another service\'s database directly.', status: 'PLANNED' },
    { title: 'Outbox giao dịch cho mọi sự kiện', titleEn: 'A transactional outbox for every event', description: 'Sự kiện nằm cùng giao dịch với dữ liệu, tiến trình phát đọc và đẩy.', descriptionEn: 'Events share the data transaction; a relay reads and publishes them.', status: 'PLANNED' },
    { title: 'Bên nhận xử lý lặp lại được', titleEn: 'Idempotent consumers', description: 'Bảng đã-xử-lý khoá theo ID sự kiện, cùng giao dịch với tác dụng phụ.', descriptionEn: 'A processed-events table keyed by event id, sharing the effect\'s transaction.', status: 'PLANNED' },
    { title: 'Saga chuyến đi có bù trừ', titleEn: 'A ride saga with compensation', description: 'Thanh toán hỏng thì ghi nợ, không xoá chuyến đã xảy ra thật.', descriptionEn: 'A failed charge records a debt rather than voiding a trip that really happened.', status: 'PLANNED' },
    { title: 'Ghép tài xế theo không gian', titleEn: 'Spatial driver matching', description: 'Redis GEO cộng 8 ô láng giềng, xếp hạng theo thời gian di chuyển.', descriptionEn: 'Redis GEO plus the 8 neighbouring cells, ranked by travel time.', status: 'PLANNED' },
    { title: 'Theo dõi vị trí thời gian thực', titleEn: 'Real-time location tracking', description: 'WebSocket, vị trí có thời hạn 30 giây để không ghép nhầm xe đã tắt.', descriptionEn: 'WebSocket with 30-second position TTLs so offline cars are never matched.', status: 'PLANNED' },
    { title: 'Giá động theo khu vực', titleEn: 'Per-area dynamic pricing', description: 'Tỉ lệ yêu cầu trên tài xế rảnh từng ô, cập nhật mỗi phút.', descriptionEn: 'Requests per available driver per cell, refreshed each minute.', status: 'PLANNED' },
    { title: 'Truy vết phân tán đầu-cuối', titleEn: 'End-to-end distributed tracing', description: 'Một mã truy vết đi qua sáu dịch vụ, xem được thời gian từng chặng.', descriptionEn: 'One trace id across six services with per-hop timings.', status: 'PLANNED' },
    { title: 'Thư chết và ngắt mạch', titleEn: 'Dead letter queues and circuit breakers', description: 'Sự kiện hỏng không lặp vô hạn, dịch vụ chậm không kéo sập phần còn lại.', descriptionEn: 'Poisoned events stop looping; a slow service cannot drag down the rest.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Pattern: Transactional outbox', titleEn: 'Pattern: Transactional outbox', url: 'https://microservices.io/patterns/data/transactional-outbox.html', type: 'LINK', description: 'Mô tả chuẩn của mẫu hình quan trọng nhất trong bài này.', descriptionEn: 'The canonical description of the most important pattern in this study.' },
    { title: 'Pattern: Saga', titleEn: 'Pattern: Saga', url: 'https://microservices.io/patterns/data/saga.html', type: 'LINK', description: 'Vì sao giao dịch phân tán không dùng được và bù trừ thay thế nó ra sao.', descriptionEn: 'Why distributed transactions are impractical and how compensation replaces them.' },
    { title: 'Kafka — Design', titleEn: 'Kafka — Design', url: 'https://kafka.apache.org/documentation/#design', type: 'LINK', description: 'Phân vùng, đảm bảo thứ tự, nhóm tiêu thụ — đọc phần này trước khi dùng.', descriptionEn: 'Partitions, ordering guarantees and consumer groups — read this before using it.' },
    { title: 'Debezium', titleEn: 'Debezium', url: 'https://debezium.io/', type: 'LINK', description: 'Đọc nhật ký thay đổi của database để phát sự kiện — cách hiện thực outbox không cần tự viết tiến trình phát.', descriptionEn: 'Reading the database change log to emit events — an outbox implementation without writing your own relay.' },
    { title: 'OpenTelemetry', titleEn: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/', type: 'LINK', description: 'Chuẩn truy vết phân tán, và cách truyền ngữ cảnh qua cả lời gọi lẫn sự kiện.', descriptionEn: 'The distributed tracing standard, and how to propagate context through calls and events alike.' },
  ],

  coreKnowledge: [
    { vi: 'Bài toán ghi hai nơi và vì sao nó không có lời giải bằng cách sắp lại thứ tự', en: 'The dual-write problem, and why reordering the writes never solves it' },
    { vi: 'Outbox giao dịch: đưa việc giao tiếp vào trong ranh giới nguyên tử', en: 'The transactional outbox: pulling communication inside the atomic boundary' },
    { vi: 'Ngữ nghĩa giao hàng: ít nhất một lần, nhiều nhất một lần, và vì sao "đúng một lần" là ảo tưởng', en: 'Delivery semantics: at-least-once, at-most-once, and why "exactly once" is an illusion' },
    { vi: 'Xử lý lặp lại được: thiết kế bên nhận để giao trùng không gây hậu quả', en: 'Idempotency: designing consumers so redelivery causes no harm' },
    { vi: 'Saga và bù trừ: khi hoàn tác là một quyết định nghiệp vụ', en: 'Sagas and compensation: when undoing is a business decision' },
    { vi: 'Phân vùng và thứ tự trong hệ thống nhắn tin phân tán', en: 'Partitioning and ordering in distributed messaging' },
    { vi: 'Chỉ mục không gian: geohash, ô láng giềng, và lọc trước khi tính chính xác', en: 'Spatial indexing: geohashes, neighbour cells, and shortlisting before exact computation' },
    { vi: 'Khả năng quan sát: truy vết, thư chết, ngắt mạch, và tách kiểm tra sức khoẻ', en: 'Observability: tracing, dead letters, circuit breakers, and split health checks' },
  ],

  portfolioBonus: [
    { vi: 'Video giết tiến trình ngay sau COMMIT rồi cho thấy sự kiện vẫn tới đích', en: 'A video killing the process right after COMMIT and showing the event still arrives' },
    { vi: 'Ảnh chụp truy vết một yêu cầu đi qua đủ sáu dịch vụ kèm thời gian từng chặng', en: 'A trace screenshot of one request across all six services with per-hop timings' },
    { vi: 'Mục README giải thích vì sao KHÔNG nên dùng microservices cho hệ thống nhỏ', en: 'A README section arguing why NOT to use microservices for a small system' },
    { vi: 'Kịch bản hỗn loạn: tắt ngẫu nhiên một dịch vụ và ghi lại hệ thống tự phục hồi', en: 'A chaos scenario: randomly kill a service and record the system healing itself' },
    { vi: 'Biểu đồ số dòng outbox chưa bắn theo thời gian dưới tải cao', en: 'A chart of unpublished outbox rows over time under load' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu vì sao ranh giới mạng đổi hoàn toàn cách viết mã, không chỉ thêm độ trễ', en: 'Understand why a network boundary changes how you write code, not just latency' },
    { vi: 'Thiết kế được hệ thống chịu được việc chết giữa chừng ở bất kỳ điểm nào', en: 'Design systems that survive a process dying at any point' },
    { vi: 'Biết chọn giữa nhất quán mạnh và nhất quán cuối theo yêu cầu nghiệp vụ', en: 'Choose between strong and eventual consistency based on business requirements' },
    { vi: 'Đánh giá được khi nào chia nhỏ hệ thống là đúng và khi nào là tự làm khổ mình', en: 'Judge when splitting a system is right and when it is self-inflicted pain' },
    { vi: 'Vận hành được hệ thống nhiều thành phần: quan sát, phục hồi, cô lập lỗi', en: 'Operate a multi-component system: observe it, recover it, contain its failures' },
  ],

  bodyMdx,
  bodyMdxEn,
};
