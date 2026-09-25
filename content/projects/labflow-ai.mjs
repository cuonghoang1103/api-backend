/**
 * LabFlow AI — đồ án tốt nghiệp (SWP391 → SEP490), tự code tay, Claude chỉ là mentor.
 *
 * Trang tổng quan để tra cứu khi code: kiến trúc, cấu trúc repo, setup, ERD,
 * state machine, luồng, API, 46 màn hình theo vai, lộ trình 20 tuần.
 * Bảng màn hình + tuần trong labflow-ai.md sinh từ scripts/labflow-seed/labflow-v2.json
 * (cùng nguồn với dự án LF trên CT Work) — đổi kế hoạch thì sinh lại, đừng sửa tay.
 *
 * Ghim đầu /projects bằng `pinOrder: 1`. Chưa có bản EN cho thân bài
 * (người đọc EN thấy nhãn "Vietnamese only"), siêu dữ liệu đã có EN.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(new URL('./labflow-ai.md', import.meta.url), 'utf8');

const MEDIA = 'https://media.cuongthai.com/images/projects';

export default {
  slug: 'labflow-ai',
  title: 'LabFlow AI — Đồ án tốt nghiệp',
  titleEn: 'LabFlow AI — Graduation Project',
  description:
    'Hệ thống đặt phòng lab & mượn thiết bị không bao giờ trùng lịch: QR check-in, waitlist, bảo trì, báo cáo — rồi cảm biến IoT trên ESP32 và trợ lý AI trả lời có trích dẫn. Spring Boot + React + PostgreSQL, tự code tay trong 20 tuần.',
  descriptionEn:
    'A lab & equipment booking system that never double-books: QR check-in, waitlist, maintenance, reports — then ESP32 IoT usage metering and an AI assistant that answers with citations. Spring Boot + React + PostgreSQL, hand-built over 20 weeks.',
  techStack: [
    'Java 21', 'Spring Boot 3', 'Spring Security', 'Spring Data JPA', 'PostgreSQL 16', 'Flyway',
    'React', 'TypeScript', 'Testcontainers', 'Docker Compose', 'MailTrap', 'ESP32', 'MQTT', 'pgvector',
  ],
  role: 'Tự làm toàn bộ (đóng 5 vai C1–C5)',
  roleEn: 'Solo (playing 5 roles C1–C5)',
  duration: '20 tuần · 05/10/2026 → 21/02/2027',
  durationEn: '20 weeks · Oct 2026 → Feb 2027',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'ADVANCED',
  thumbnailUrl: `${MEDIA}/labflow-ai.webp`,
  images: [`${MEDIA}/labflow-ai-architecture.webp`, `${MEDIA}/labflow-ai-roadmap.webp`],
  projectUrl: null,
  githubUrl: null,
  startDate: '2026-10-05',
  endDate: '2027-02-21',
  isFeatured: true,
  isPublished: true,
  pinOrder: 1,
  bodyMdx,

  schemaLang: 'sql',
  schemaCode: `-- Lõi chống đặt trùng: DATABASE từ chối, không phải một câu if trong code.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE reservations (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id),
    status          VARCHAR(20)  NOT NULL,          -- PENDING, CONFIRMED, CHECKED_IN, ...
    period          TSTZRANGE    NOT NULL,          -- nửa mở [start, end): 9–11h và 11–13h KHÔNG trùng
    purpose         VARCHAR(255) NOT NULL,
    -- Bấm "Đặt" hai lần / mạng gửi lại: lần hai không tạo bản ghi mới.
    idempotency_key VARCHAR(64)  NOT NULL UNIQUE,
    version         INT          NOT NULL DEFAULT 0, -- optimistic lock khi đổi trạng thái
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CHECK (NOT isempty(period))
);

-- Mỗi reservation giữ một lab HOẶC một thiết bị. period chép từ reservation
-- vì exclusion constraint chỉ nhìn được cột trong CÙNG một bảng.
CREATE TABLE reservation_items (
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT    NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    lab_id         INT       REFERENCES labs(id),
    equipment_id   BIGINT    REFERENCES equipment(id),
    period         TSTZRANGE NOT NULL,
    active         BOOLEAN   NOT NULL DEFAULT true,   -- false khi huỷ / no-show → slot được giải phóng
    CHECK ((lab_id IS NULL) <> (equipment_id IS NULL)),

    -- Hai dòng ĐANG HIỆU LỰC cùng lab mà khoảng giờ chồng nhau (&&) thì không thể cùng tồn tại.
    -- Request thua nhận lỗi 23P01 (exclusion_violation) → API trả 409 + gợi ý waitlist.
    EXCLUDE USING gist (lab_id WITH =, period WITH &&) WHERE (active AND lab_id IS NOT NULL),
    EXCLUDE USING gist (equipment_id WITH =, period WITH &&) WHERE (active AND equipment_id IS NOT NULL)
);

-- QR dùng đúng một lần: UPDATE ... WHERE used_at IS NULL, lần quét thứ hai cập nhật 0 dòng.
CREATE TABLE qr_tokens (
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT      NOT NULL UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    token_hash     VARCHAR(128) NOT NULL UNIQUE,     -- chỉ lưu băm, không lưu token gốc
    expires_at     TIMESTAMPTZ NOT NULL,
    used_at        TIMESTAMPTZ
);

-- Audit chỉ ghi thêm. Không ai (kể cả Admin) sửa hay xoá được qua ứng dụng.
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    actor_id    BIGINT       REFERENCES users(id),
    entity      VARCHAR(40)  NOT NULL,
    entity_id   BIGINT       NOT NULL,
    action      VARCHAR(40)  NOT NULL,
    before_data JSONB,
    after_data  JSONB,
    at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);`,

  milestones: [
    { phase: 'SETUP', date: '2026-10-11', title: 'Tuần 1 — skeleton chạy được', titleEn: 'Week 1 — a running skeleton',
      description: 'Spring Boot + PostgreSQL trong Docker Compose + Flyway V1 + một API có test + CI GitHub Actions. Gửi 7 câu Q&A cho giảng viên (stack, MaxLOC, non-UI, AI…).',
      descriptionEn: 'Spring Boot + PostgreSQL in Docker Compose + Flyway V1 + one tested API + GitHub Actions CI. Send the 7 Q&A questions to the lecturer.' },
    { phase: 'DATABASE', date: '2026-10-17', title: 'G0 — spike chống đặt trùng', titleEn: 'G0 — double-booking spike',
      description: 'Domain model, ERD 3NF, SRS v0.1 và một spike chứng minh: hai request cùng slot → đúng một CONFIRMED, còn lại 409.',
      descriptionEn: 'Domain model, 3NF ERD, SRS v0.1 and a spike proving two concurrent requests for one slot yield exactly one CONFIRMED.' },
    { phase: 'DESIGN', date: '2026-10-25', title: 'SWP-M1 (15%) — Requirement Analysis & Design', titleEn: 'SWP-M1 (15%) — Requirement Analysis & Design',
      description: 'SRS §1 + SDS §1–2, wireframe được giảng viên duyệt, WF0 (register/login/logout/forgot password) + layout chung chạy trên main, tag iter1.',
      descriptionEn: 'SRS §1 + SDS §1–2, approved wireframes, WF0 + shared layout running on main, tag iter1.' },
    { phase: 'BACKEND', date: '2026-11-07', title: 'G1 — booking core', titleEn: 'G1 — booking core',
      description: 'Đặt, huỷ, đổi lịch an toàn; concurrency suite 2/10/50 request xanh trên PostgreSQL thật.',
      descriptionEn: 'Safe create/cancel/reschedule; the 2/10/50-request concurrency suite green on real PostgreSQL.' },
    { phase: 'BACKEND', date: '2026-11-29', title: 'SWP-M2 (20%) — WF1 & WF2', titleEn: 'SWP-M2 (20%) — WF1 & WF2',
      description: 'CRUD master data + waitlist, QR check-in, mượn/trả, bảo trì với state machine; ST26 Round 1; tag iter2.',
      descriptionEn: 'Master-data CRUD + waitlist, QR check-in, loans and maintenance with state machines; ST26 round 1; tag iter2.' },
    { phase: 'TESTING', date: '2026-12-12', title: 'SWP-M3 (25%) — hệ thống đầy đủ + kiểm thử', titleEn: 'SWP-M3 (25%) — full system & testing',
      description: 'Dashboard & báo cáo, deploy + dữ liệu demo, UAT, ST26 đủ 3 vòng, Final Release Document, tag iter3.',
      descriptionEn: 'Dashboards & reports, deployment + demo data, UAT, three ST26 rounds, Final Release Document, tag iter3.' },
    { phase: 'LAUNCH', date: '2026-12-19', title: 'SWP-Final (40%) — bảo vệ trước hội đồng', titleEn: 'SWP-Final (40%) — defence',
      description: 'Slide Template7, demo 3 luồng có failure path, mỗi vai trả lời về màn của mình. Ngày thật xác nhận với bộ môn.',
      descriptionEn: 'Template7 slides, three demo flows with failure paths, each role answers for its own screens. Date to be confirmed.' },
    { phase: 'AI', date: '2026-12-26', title: 'SEP-M4 — IoT đo mức sử dụng', titleEn: 'SEP-M4 — IoT usage metering',
      description: 'ESP32 + cảm biến dòng → MQTT → usage session → tự check-in / no-show; simulator 20–50 thiết bị, không trùng dữ liệu khi mất mạng.',
      descriptionEn: 'ESP32 + current sensor → MQTT → usage sessions → auto check-in / no-show; 20–50 simulated devices, no duplicates on reconnect.' },
    { phase: 'AI', date: '2027-01-23', title: 'SEP-M5 — trợ lý AI có trích dẫn + vision + cổng an toàn', titleEn: 'SEP-M5 — cited AI assistant + vision + safety gate',
      description: 'RAG trên pgvector có trích dẫn và no-answer policy; nhận diện linh kiện có eval set; chưa qua quiz SOP thì không đặt được thiết bị nguy hiểm.',
      descriptionEn: 'pgvector RAG with citations and a no-answer policy; component vision with an eval set; hazardous equipment gated behind an SOP quiz.' },
    { phase: 'LAUNCH', date: '2027-02-20', title: 'SEP-M6 — bản tham chiếu SEP490', titleEn: 'SEP-M6 — SEP490 reference release',
      description: 'Evidence pack, số liệu truy nguyên được, demo lặp lại được, kế hoạch xây lại với nhóm thật; tag v2.0-sep490-reference.',
      descriptionEn: 'Evidence pack, traceable numbers, repeatable demo, a restart plan for a real team; tag v2.0-sep490-reference.' },
  ],

  features: [
    { status: 'PLANNED', title: 'Đặt lab / thiết bị không bao giờ trùng lịch', titleEn: 'Booking that never double-books',
      description: 'Exclusion constraint trên tstzrange + idempotency key; kiểm chứng bằng 50 request đồng thời.', descriptionEn: 'tstzrange exclusion constraint + idempotency key; verified with 50 concurrent requests.' },
    { status: 'PLANNED', title: 'Waitlist FIFO có giữ chỗ và hết hạn', titleEn: 'FIFO waitlist with holds and expiry',
      description: 'Job promotion idempotent — chạy hai lần không đôn hai người.', descriptionEn: 'Idempotent promotion job — running twice never promotes twice.' },
    { status: 'PLANNED', title: 'QR check-in ký HMAC, dùng một lần', titleEn: 'Single-use HMAC-signed QR check-in',
      description: 'Có hạn, gắn reservation + người dùng; quét lại bị từ chối và ghi audit. Job no-show tự giải phóng slot.', descriptionEn: 'Expiring, bound to reservation + user; replays rejected and audited. No-show job frees the slot.' },
    { status: 'PLANNED', title: 'Mượn / trả thiết bị theo state machine', titleEn: 'State-machine equipment loans',
      description: 'RESERVED → CHECKED_OUT → RETURNED, cùng OVERDUE / DAMAGED / LOST; job quá hạn gửi nhắc.', descriptionEn: 'RESERVED → CHECKED_OUT → RETURNED plus OVERDUE / DAMAGED / LOST; overdue reminders.' },
    { status: 'PLANNED', title: 'Bảo trì khoá thiết bị khỏi đặt/mượn', titleEn: 'Maintenance locks equipment out of booking',
      description: 'Kanban OPEN → … → CLOSED + REOPEN; người sửa không tự verify được.', descriptionEn: 'Kanban OPEN → … → CLOSED + REOPEN; fixers cannot verify their own tickets.' },
    { status: 'PLANNED', title: 'RBAC ở backend + audit chỉ ghi thêm', titleEn: 'Backend RBAC + append-only audit',
      description: 'Route + method + quyền sở hữu dữ liệu; mọi thay đổi quan trọng có before/after.', descriptionEn: 'Route + method + ownership checks; every important change keeps before/after.' },
    { status: 'PLANNED', title: 'Dashboard & báo cáo utilization, export CSV', titleEn: 'Utilization dashboards & CSV export',
      description: 'Số liệu đối soát được với SQL nguồn.', descriptionEn: 'Numbers reconcilable against source SQL.' },
    { status: 'PLANNED', title: 'v2 — IoT đo mức sử dụng thật (ESP32)', titleEn: 'v2 — real IoT usage metering (ESP32)',
      description: 'Phiên sử dụng từ dòng điện thật thay cho ước đoán.', descriptionEn: 'Usage sessions from real current draw instead of guesses.' },
    { status: 'PLANNED', title: 'v2 — trợ lý "Ask the lab" có trích dẫn', titleEn: 'v2 — cited "Ask the lab" assistant',
      description: 'Quét QR trên thiết bị mở đúng ngữ cảnh; không có trong tài liệu thì nói không biết; AI chết thì lõi vẫn chạy.', descriptionEn: 'Device QR opens the right context; says "not in the docs" when it should; core runs when AI is down.' },
  ],

  resources: [
    { type: 'LINK', title: 'Dự án LF trên CT Work — kế hoạch 20 tuần', titleEn: 'LF project on CT Work — the 20-week plan',
      url: 'https://cuongthai.com/work', description: 'Không gian "LabFlow Studio": board, backlog 46 Req, bộ lọc "Chuẩn bị bảo vệ".', descriptionEn: 'Workspace "LabFlow Studio": board, 46-Req backlog, defence filter.' },
    { type: 'DOC', title: 'Spring Boot Reference', url: 'https://docs.spring.io/spring-boot/', description: 'Cấu hình, JPA, Security, testing.', descriptionEn: 'Configuration, JPA, Security, testing.' },
    { type: 'DOC', title: 'PostgreSQL — Range types & exclusion constraints', titleEn: 'PostgreSQL — Range types & exclusion constraints',
      url: 'https://www.postgresql.org/docs/current/rangetypes.html', description: 'Nền tảng của việc chống đặt trùng.', descriptionEn: 'The foundation of double-booking prevention.' },
    { type: 'DOC', title: 'Testcontainers for Java', url: 'https://java.testcontainers.org/', description: 'Chạy PostgreSQL thật trong test.', descriptionEn: 'Real PostgreSQL inside tests.' },
    { type: 'DOC', title: 'Flyway documentation', url: 'https://documentation.red-gate.com/flyway', description: 'Migration có thứ tự, chạy lại được trên DB sạch.', descriptionEn: 'Ordered, replayable migrations.' },
  ],

  coreKnowledge: [
    { vi: 'Transaction, isolation level và vì sao "kiểm rồi mới ghi" có race condition', en: 'Transactions, isolation levels, and why check-then-insert races' },
    { vi: 'Range type + exclusion constraint của PostgreSQL; khoảng thời gian nửa mở', en: 'PostgreSQL range types, exclusion constraints, half-open intervals' },
    { vi: 'State machine cho nghiệp vụ: transition sai trả 409 ở backend', en: 'Business state machines: illegal transitions return 409 in the backend' },
    { vi: 'Idempotency: nút bấm hai lần, job chạy lại, webhook gửi lại', en: 'Idempotency: double clicks, rerun jobs, replayed deliveries' },
    { vi: 'Spring Security: JWT, RBAC, kiểm quyền sở hữu dữ liệu', en: 'Spring Security: JWT, RBAC, data ownership checks' },
    { vi: 'Kiểm thử tích hợp với database thật (Testcontainers)', en: 'Integration testing against a real database (Testcontainers)' },
    { vi: 'Quy trình SWP391: Req/Task/Q&A/Defect/Leakage, 3 iteration, LOC theo màn hình', en: 'SWP391 process: Req/Task/Q&A/Defect/Leakage, three iterations, per-screen LOC' },
  ],
  portfolioBonus: [
    { vi: 'Test 50 request đồng thời chứng minh không đặt trùng, chạy trong CI', en: 'A 50-concurrent-request test proving no double booking, in CI' },
    { vi: 'Bốn state machine trong SDS khớp đúng bảng chuyển trạng thái trong code', en: 'Four SDS state machines matching the transition tables in code' },
    { vi: 'Phần cứng thật: ESP32 + cảm biến dòng, có sơ đồ mạch và tính toán linh kiện', en: 'Real hardware: ESP32 + current sensor, with circuit diagram and component maths' },
    { vi: 'Bộ đánh giá AI tái lập: groundedness, citation, no-answer, prompt injection', en: 'A reproducible AI eval suite: groundedness, citations, no-answer, prompt injection' },
  ],
  completionOutcomes: [
    { vi: 'Tự thiết kế và code một hệ thống giao dịch nhiều người dùng đúng khi đồng thời', en: 'Design and hand-build a multi-user transactional system that stays correct under concurrency' },
    { vi: 'Giải thích được mọi tầng từ nút bấm tới ràng buộc trong database trước hội đồng', en: 'Explain every layer from button to database constraint in front of a panel' },
    { vi: 'Có một đồ án thật đủ sâu để làm nền SEP490 và phỏng vấn', en: 'Own a project deep enough to carry SEP490 and interviews' },
  ],
};
