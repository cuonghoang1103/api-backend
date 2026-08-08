/**
 * Case-study INT601 — Clinic Appointment Booking System.
 * First of the ten Semester 6 (Kỳ 6 — Thực tập) internship projects mirrored
 * from the Academy course of the same slug. The slug is deliberately IDENTICAL
 * to the Academy course slug so /projects/<slug> and /courses/<slug> are two
 * views of one project: this page is the "why" (architecture, trade-offs,
 * traps), the course is the "how" (10 sections, 22 lessons).
 *
 * Through-line of the ten: every project answers "two people tap at the same
 * instant" with a DIFFERENT mechanism. This one is optimistic locking
 * (@Version) with UNIQUE as the durable backstop.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./clinic-appointment-booking-system.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./clinic-appointment-booking-system.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'clinic-appointment-booking-system',
  title: 'Clinic Appointment Booking System (Đồ án thực tập #1)',
  titleEn: 'Clinic Appointment Booking System (Internship Project #1)',
  description:
    'Đồ án mở màn Kỳ 6: web đặt lịch khám bằng Spring Boot 3 + React + PostgreSQL. Trọng tâm không phải CRUD mà là câu hỏi mọi vòng phỏng vấn đều hỏi — hai người bấm Đặt lịch cùng một giây thì sao. Trả lời bằng ba lớp: kiểm nhanh, khoá lạc quan @Version, và ràng buộc UNIQUE làm chốt chặn cuối.',
  descriptionEn:
    'The opening Semester 6 project: a clinic appointment app in Spring Boot 3 + React + PostgreSQL. The point is not CRUD but the question every interview asks — what happens when two patients tap Book in the same second. Answered in three layers: a fast-path check, an @Version optimistic lock, and a UNIQUE constraint as the durable backstop.',
  techStack: [
    'Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Spring Security', 'PostgreSQL',
    'React', 'Vite', 'axios', 'JWT', 'BCrypt', 'JUnit 5', 'Docker Compose',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/clinic-appointment-booking-system.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Khung giờ được HIỆN THỰC HOÁ thành hàng, không suy ra từ lịch hẹn.
-- Đó là điều kiện để có thứ mà đặt ràng buộc lên.

CREATE TABLE slots (
  id          BIGSERIAL PRIMARY KEY,
  doctor_id   BIGINT NOT NULL REFERENCES doctors(id),
  start_at    TIMESTAMPTZ NOT NULL,   -- timestamptz, KHÔNG phải timestamp:
  end_at      TIMESTAMPTZ NOT NULL,   -- múi giờ là việc của tầng hiển thị
  status      VARCHAR(16) NOT NULL DEFAULT 'FREE',  -- FREE BOOKED CLOSED
  -- Cột khoá lạc quan. Hibernate thêm "AND version = ?" vào mọi UPDATE
  -- và tăng giá trị sau khi ghi. Kẻ thua cuộc sửa trúng 0 dòng.
  version     INT NOT NULL DEFAULT 0,
  CONSTRAINT slot_time_valid CHECK (end_at > start_at)
);

-- Truy vấn nóng nhất: "bác sĩ X còn khung nào trống trong ngày Y".
CREATE INDEX idx_slot_doctor_time ON slots (doctor_id, start_at)
  WHERE status = 'FREE';

CREATE TABLE appointments (
  id          BIGSERIAL PRIMARY KEY,
  -- MỘT DÒNG NÀY là bất biến của cả hệ thống, phát biểu ở tầng lưu trữ:
  -- một khung giờ có tối đa một lịch hẹn. Không phải câu if có thể quên.
  slot_id     BIGINT NOT NULL UNIQUE REFERENCES slots(id),
  patient_id  BIGINT NOT NULL REFERENCES users(id),
  status      VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- "Lịch hẹn của tôi, gần nhất trước" — đúng hình dạng truy vấn của app.
CREATE INDEX idx_appt_patient ON appointments (patient_id, created_at DESC);`,
  schemaCodeEn: `-- The slot is MATERIALISED as a row rather than derived from appointments.
-- That is what gives you something to put a constraint on.

CREATE TABLE slots (
  id          BIGSERIAL PRIMARY KEY,
  doctor_id   BIGINT NOT NULL REFERENCES doctors(id),
  start_at    TIMESTAMPTZ NOT NULL,   -- timestamptz, NOT timestamp:
  end_at      TIMESTAMPTZ NOT NULL,   -- time zones belong to the view layer
  status      VARCHAR(16) NOT NULL DEFAULT 'FREE',  -- FREE BOOKED CLOSED
  -- The optimistic-lock column. Hibernate appends "AND version = ?" to every
  -- UPDATE and bumps it after a write. The loser updates zero rows.
  version     INT NOT NULL DEFAULT 0,
  CONSTRAINT slot_time_valid CHECK (end_at > start_at)
);

-- The hottest query: "which slots does doctor X still have free on day Y".
CREATE INDEX idx_slot_doctor_time ON slots (doctor_id, start_at)
  WHERE status = 'FREE';

CREATE TABLE appointments (
  id          BIGSERIAL PRIMARY KEY,
  -- THIS ONE LINE states the system invariant at the storage layer:
  -- at most one appointment per slot. Not an if statement you can forget.
  slot_id     BIGINT NOT NULL UNIQUE REFERENCES slots(id),
  patient_id  BIGINT NOT NULL REFERENCES users(id),
  status      VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- "My appointments, newest first" — the exact shape the app queries.
CREATE INDEX idx_appt_patient ON appointments (patient_id, created_at DESC);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Mô hình hoá: vì sao khung giờ phải là một hàng',
      titleEn: 'Modelling: why the slot has to be a row',
      description:
        'Gắn lịch hẹn thẳng vào bác sĩ kèm mốc thời gian là ngõ cụt: không có gì để đặt ràng buộc lên, và việc so khoảng thời gian trong mã ứng dụng không nguyên tử. Hiện thực hoá khung giờ thành hàng có trạng thái riêng cho bạn một khoá để đặt UNIQUE lên, và cho lễ tân khả năng đóng khung giờ mà không cần ai đặt.',
      descriptionEn:
        'Hanging appointments off the doctor with a timestamp is a dead end: there is nothing to constrain, and comparing intervals in application code is not atomic. Materialising the slot as a row with its own status gives you a key to make UNIQUE, and gives the receptionist a way to close a slot nobody booked.',
    },
    {
      phase: 'BACKEND',
      title: 'Spring Boot phân lớp: controller → service → repository',
      titleEn: 'Layered Spring Boot: controller → service → repository',
      description:
        'Controller chỉ dịch HTTP sang lời gọi service và ánh xạ ngoại lệ sang mã trạng thái. Toàn bộ quy tắc nghiệp vụ — kể cả @Transactional — nằm ở service. Repository chỉ là truy vấn. Ranh giới này là thứ khiến bài test đồng thời ở Mục 6 viết được mà không cần dựng cả tầng web.',
      descriptionEn:
        'The controller only translates HTTP into a service call and maps exceptions to status codes. Every business rule — including @Transactional — lives in the service. Repositories are queries. That boundary is exactly what makes the concurrency test writable without standing up the web layer.',
    },
    {
      phase: 'SECURITY',
      title: 'JWT, BCrypt, và hai lỗ hổng kinh điển',
      titleEn: 'JWT, BCrypt, and two classic holes',
      description:
        'patientId lấy từ token đã ký, không bao giờ từ body — nếu không thì bất kỳ ai đăng nhập cũng đọc được hồ sơ người khác bằng cách sửa một con số (IDOR). Và phân quyền phải nằm ở tầng route: ẩn nút trên React chỉ là trang trí, API vẫn trả lời curl.',
      descriptionEn:
        'patientId comes from the signed token, never from the body — otherwise any logged-in user reads someone else\'s record by changing one number (IDOR). And authorisation belongs at the route layer: hiding a React button is decoration, the API still answers curl.',
      codeBlock:
        '// SAI: tin body → IDOR\n'
        + '// var patientId = req.getPatientId();\n\n'
        + '// ĐÚNG: danh tính chỉ đến từ token đã ký\n'
        + '@PostMapping("/appointments")\n'
        + 'ResponseEntity<AppointmentDto> book(@AuthenticationPrincipal JwtUser me,\n'
        + '                                    @RequestBody BookRequest req) {\n'
        + '  return ResponseEntity.status(201)\n'
        + '      .body(service.book(req.slotId(), me.id()));\n'
        + '}',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Lõi đặt lịch: ba lớp phòng thủ',
      titleEn: 'The booking core: three layers of defence',
      description:
        'Lớp 1 là câu if — rẻ và thân thiện, nhưng thua cuộc đua. Lớp 2 là @Version: Hibernate thêm "AND version = ?" vào UPDATE, kẻ thua sửa trúng 0 dòng và nhận OptimisticLockException. Lớp 3 là UNIQUE(slot_id), lớp duy nhất còn đúng kể cả khi ai đó xoá mất hai lớp trên. Ba lớp bảo vệ ở ba tầm nhìn khác nhau: phiên làm việc, transaction, và toàn bộ vòng đời của database.',
      descriptionEn:
        'Layer 1 is the if — cheap and friendly, but it loses the race. Layer 2 is @Version: Hibernate appends "AND version = ?" to the UPDATE, the loser touches zero rows and gets an OptimisticLockException. Layer 3 is UNIQUE(slot_id), the only layer that still holds if someone deletes the other two. They defend at three different scopes: a session, a transaction, and the whole lifetime of the database.',
      codeBlock:
        '-- An commit trước\n'
        + "UPDATE slots SET status='BOOKED', version=1\n"
        + ' WHERE id=42 AND version=0;        -- → 1 dòng ✅\n\n'
        + '-- Bình vẫn cầm version=0 đọc từ trước\n'
        + "UPDATE slots SET status='BOOKED', version=1\n"
        + ' WHERE id=42 AND version=0;        -- → 0 dòng!\n'
        + '-- Hibernate thấy 0 dòng → OptimisticLockException → rollback → 409',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'saveAndFlush chứ không save — lỗi chỉ lộ khi chạy thật',
      titleEn: 'saveAndFlush, not save — a bug only running reveals',
      description:
        'save() có thể hoãn câu INSERT tới lúc commit transaction. Lúc đó ngoại lệ vi phạm UNIQUE bay ra NGOÀI khối try/catch của bạn, và người dùng nhận 500 thay vì 409. Đọc mã thì hai hàm trông như nhau; chỉ bài test đồng thời mới chỉ ra khác biệt.',
      descriptionEn:
        'save() may defer the INSERT until commit. The unique-violation exception then escapes your try/catch entirely and the user gets a 500 instead of a 409. Side by side the two calls look interchangeable; only a concurrency test shows the difference.',
      codeBlock:
        'try {\n'
        + '  // ép INSERT chạy NGAY trong khối try này\n'
        + '  return appts.saveAndFlush(a);\n'
        + '} catch (DataIntegrityViolationException | OptimisticLockException e) {\n'
        + '  throw new ConflictException("Khung giờ đã có người đặt");  // → 409\n'
        + '}',
      codeLang: 'java',
    },
    {
      phase: 'FRONTEND',
      title: 'React SPA: hiển thị lịch trống và xử lý 409 tử tế',
      titleEn: 'React SPA: showing free slots and handling 409 gracefully',
      description:
        'Lưới khung giờ theo ngày, gọi axios có interceptor gắn token. Chi tiết quyết định chất lượng: khi nhận 409 thì không hiện "Lỗi hệ thống" mà nạp lại danh sách khung giờ rồi nói rõ "khung giờ vừa có người đặt" — 409 là kết quả bình thường của một hệ thống đúng, không phải sự cố.',
      descriptionEn:
        'A per-day slot grid over axios with a token interceptor. The detail that decides quality: on a 409, do not show "System error" — refetch the slot list and say plainly "that slot was just taken". A 409 is the normal outcome of a correct system, not an incident.',
    },
    {
      phase: 'TESTING',
      title: 'Bài test đồng thời có vạch xuất phát chung',
      titleEn: 'The concurrency test with a shared starting gun',
      description:
        '20 luồng cùng đặt một khung giờ, khẳng định đúng 1 thành công và 19 nhận 409. CountDownLatch là chi tiết quyết định: không có nó, luồng đầu thường xong trước khi luồng thứ hai kịp bắt đầu và bài test xanh mà không chứng minh được gì. Sau đó xoá tạm @Version rồi chạy lại — vẫn phải đúng 1 lịch hẹn, đó là bằng chứng lớp UNIQUE thật sự đang gánh.',
      descriptionEn:
        'Twenty threads book the same slot; assert exactly 1 success and 19 conflicts. The CountDownLatch is what matters: without it the first thread usually finishes before the second starts and the test goes green while proving nothing. Then temporarily remove @Version and re-run — still exactly one appointment, which proves the UNIQUE layer really carries weight.',
      codeBlock:
        'var start = new CountDownLatch(1);   // vạch xuất phát chung\n'
        + 'for (int i = 0; i < 20; i++) pool.submit(() -> {\n'
        + '  start.await();                    // 20 luồng cùng bung ra\n'
        + '  try { service.book(slotId, patientId); ok.incrementAndGet(); }\n'
        + '  catch (ConflictException e) { conflict.incrementAndGet(); }\n'
        + '  return null;\n'
        + '});\n'
        + 'start.countDown();\n\n'
        + 'assertThat(ok.get()).isEqualTo(1);\n'
        + 'assertThat(appts.countBySlotId(slotId)).isEqualTo(1);',
      codeLang: 'java',
    },
    {
      phase: 'DEVOPS',
      title: 'Docker Compose và bẫy localhost',
      titleEn: 'Docker Compose and the localhost trap',
      description:
        'Ba service: db, api, web. Bẫy kinh điển là để DATABASE_URL trỏ tới localhost — trong container, localhost là chính container đó. Host phải là TÊN SERVICE trong compose. Thêm healthcheck cho db và depends_on condition: service_healthy, nếu không api khởi động trước khi Postgres sẵn sàng và chết ngay lần chạy đầu.',
      descriptionEn:
        'Three services: db, api, web. The classic trap is pointing DATABASE_URL at localhost — inside a container, localhost is that container. The host must be the compose SERVICE NAME. Add a healthcheck on db and depends_on with condition: service_healthy, otherwise the api starts before Postgres is ready and dies on first run.',
      codeBlock:
        'services:\n'
        + '  db:\n'
        + '    image: postgres:16\n'
        + '    healthcheck:\n'
        + '      test: ["CMD-SHELL", "pg_isready -U clinic"]\n'
        + '      interval: 5s\n'
        + '      retries: 10\n'
        + '  api:\n'
        + '    build: ./api\n'
        + '    environment:\n'
        + '      # db = TÊN SERVICE, không phải localhost\n'
        + '      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/clinic\n'
        + '    depends_on:\n'
        + '      db: { condition: service_healthy }',
      codeLang: 'yaml',
    },
  ],

  features: [
    { title: 'Đăng ký / đăng nhập hai vai trò', titleEn: 'Register / sign in with two roles', description: 'BCrypt cho mật khẩu, JWT trong header Authorization, vai trò PATIENT và RECEPTIONIST tách bạch ở tầng route.', descriptionEn: 'BCrypt for passwords, JWT in the Authorization header, PATIENT and RECEPTIONIST separated at the route layer.', status: 'PLANNED' },
    { title: 'Lễ tân mở và đóng khung giờ', titleEn: 'Receptionist opens and closes slots', description: 'Tạo khung giờ theo bác sĩ và khoảng thời gian; đóng được cả khung giờ chưa ai đặt.', descriptionEn: 'Create slots per doctor and time range; close a slot even when nobody booked it.', status: 'PLANNED' },
    { title: 'Đặt lịch an toàn khi tranh chấp', titleEn: 'Race-safe booking', description: 'Ba lớp: kiểm nhanh, khoá lạc quan @Version, ràng buộc UNIQUE(slot_id). Hai người bấm cùng lúc thì đúng một người thắng.', descriptionEn: 'Three layers: fast-path check, @Version optimistic lock, UNIQUE(slot_id). Two simultaneous taps produce exactly one winner.', status: 'PLANNED' },
    { title: 'Huỷ lịch trả khung giờ về trống', titleEn: 'Cancelling releases the slot', description: 'Huỷ lịch và mở lại khung giờ là MỘT thao tác trong cùng transaction — tách ra là sinh khung giờ ma.', descriptionEn: 'Cancel and release happen as ONE operation in one transaction — splitting them creates ghost slots.', status: 'PLANNED' },
    { title: 'Bệnh nhân chỉ thấy lịch của mình', titleEn: 'Patients see only their own visits', description: 'Lọc theo patient_id lấy từ token; người không sở hữu nhận 404 chứ không phải 403.', descriptionEn: 'Filtered by the patient_id from the token; non-owners get 404 rather than 403.', status: 'PLANNED' },
    { title: 'Lịch làm việc cả phòng khám cho lễ tân', titleEn: 'Whole-clinic day view for staff', description: 'Xem theo ngày và theo bác sĩ, kèm trạng thái từng khung giờ.', descriptionEn: 'By day and by doctor, with each slot\'s status.', status: 'PLANNED' },
    { title: 'Test đồng thời 20 luồng', titleEn: '20-thread concurrency test', description: 'CountDownLatch làm vạch xuất phát chung; khẳng định 1 thành công / 19 conflict / 1 hàng trong DB.', descriptionEn: 'A CountDownLatch starting gun; asserts 1 success / 19 conflicts / 1 row in the database.', status: 'PLANNED' },
    { title: 'Docker Compose ba service', titleEn: 'Three-service Docker Compose', description: 'db + api + web, healthcheck cho Postgres, chạy được từ máy trắng không sửa tay.', descriptionEn: 'db + api + web, a Postgres healthcheck, runs on a clean machine with no manual fixes.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT601 trên Academy — bản dạy từng bước', titleEn: 'INT601 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/clinic-appointment-booking-system', type: 'LINK', description: '10 mục, 22 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '10 sections, 22 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'Spring Data JPA — Optimistic Locking', titleEn: 'Spring Data JPA — Optimistic Locking', url: 'https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html', type: 'DOC', description: 'Cách @Version hoạt động và khi nào chọn khoá bi quan thay thế.', descriptionEn: 'How @Version works and when to reach for pessimistic locking instead.' },
    { title: 'PostgreSQL — Transaction Isolation', titleEn: 'PostgreSQL — Transaction Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', type: 'DOC', description: 'Đọc mục READ COMMITTED để hiểu vì sao transaction một mình không chặn được cuộc đua.', descriptionEn: 'Read the READ COMMITTED section to see why a transaction alone does not stop the race.' },
    { title: 'OWASP — Broken Access Control', titleEn: 'OWASP — Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/', type: 'LINK', description: 'IDOR nằm ở A01. Đọc trước khi viết bất kỳ route nào nhận id trong body.', descriptionEn: 'IDOR sits under A01. Read it before writing any route that takes an id in the body.' },
    { title: 'Spring Security — Architecture', titleEn: 'Spring Security — Architecture', url: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html', type: 'DOC', description: 'Chuỗi filter và chỗ đặt bộ lọc JWT của bạn.', descriptionEn: 'The filter chain and where your JWT filter belongs in it.' },
    { title: 'Docker Compose — depends_on & healthcheck', titleEn: 'Docker Compose — depends_on & healthcheck', url: 'https://docs.docker.com/reference/compose-file/services/#depends_on', type: 'DOC', description: 'condition: service_healthy là thứ tránh cho API chết ở lần khởi động đầu.', descriptionEn: 'condition: service_healthy is what keeps the API from dying on first boot.' },
  ],

  coreKnowledge: [
    { vi: 'Vì sao @Transactional KHÔNG chặn được race condition đọc-rồi-ghi dưới READ COMMITTED', en: 'Why @Transactional does NOT stop a read-then-write race under READ COMMITTED' },
    { vi: 'Khoá lạc quan bằng cột version, và câu SQL Hibernate thật sự sinh ra', en: 'Optimistic locking on a version column, and the SQL Hibernate actually emits' },
    { vi: 'So-sánh-rồi-hoán-đổi: một quy tắc nghiệp vụ nhìn dưới dạng nguyên thuỷ CAS', en: 'Compare-and-set: seeing a business rule as a CAS primitive' },
    { vi: 'Ràng buộc UNIQUE như một lời phát biểu bất biến, không phải một mẹo tối ưu', en: 'A UNIQUE constraint as a statement of invariant, not an optimisation trick' },
    { vi: 'Hiện thực hoá khung giờ thành hàng để có thứ đặt ràng buộc lên', en: 'Materialising a slot as a row so there is something to constrain' },
    { vi: 'Spring Boot phân lớp: vì sao quy tắc nghiệp vụ phải ở service chứ không ở controller', en: 'Layered Spring Boot: why business rules belong in the service, not the controller' },
    { vi: 'JWT + BCrypt: băm khác mã hoá, và vì sao danh tính chỉ được lấy từ token', en: 'JWT + BCrypt: hashing is not encryption, and why identity comes only from the token' },
    { vi: 'IDOR và cách trả 404 thay vì 403 để không xác nhận sự tồn tại của bản ghi', en: 'IDOR, and why 404 beats 403 so you do not confirm a record exists' },
    { vi: 'Viết test đồng thời đúng cách: CountDownLatch làm vạch xuất phát chung', en: 'Writing a real concurrency test: CountDownLatch as a shared starting gun' },
    { vi: 'timestamptz và nơi đúng để đổi múi giờ (tầng hiển thị, không phải tầng lưu trữ)', en: 'timestamptz, and the right place to convert time zones (the view, not storage)' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh chụp log test đồng thời trong README: 1 thành công / 19 conflict', en: 'A screenshot of the concurrency test log in the README: 1 success / 19 conflicts' },
    { vi: 'Một đoạn 30 giây quay cảnh mở hai trình duyệt bấm Đặt cùng lúc', en: 'A 30-second clip of two browsers tapping Book at the same moment' },
    { vi: 'Tài liệu API sinh bằng springdoc-openapi, mở được ở /swagger-ui', en: 'API docs generated by springdoc-openapi, live at /swagger-ui' },
    { vi: 'GitHub Actions chạy test đồng thời trên mỗi pull request', en: 'GitHub Actions running the concurrency test on every pull request' },
    { vi: 'Một mục "Concurrency" trong README nói rõ ba lớp và cách kiểm từng lớp', en: 'A "Concurrency" section in the README naming the three layers and how each is verified' },
    { vi: 'Testcontainers thay vì H2, để test chạy trên đúng Postgres của production', en: 'Testcontainers instead of H2, so tests run on the same Postgres as production' },
  ],

  completionOutcomes: [
    { vi: 'Giải thích được vì sao transaction không đủ, bằng một sơ đồ thời gian và câu SQL thật', en: 'Explain why a transaction is not enough, with a timeline and the real SQL' },
    { vi: 'Chọn được giữa khoá lạc quan và khoá bi quan dựa trên mức độ tranh chấp', en: 'Choose between optimistic and pessimistic locking based on contention' },
    { vi: 'Viết được bài test chứng minh tính đúng đắn dưới tranh chấp, không chỉ test happy path', en: 'Write a test that proves correctness under contention, not just the happy path' },
    { vi: 'Dựng REST API Spring Boot phân lớp có xác thực và phân quyền thật', en: 'Build a layered Spring Boot REST API with real authentication and authorisation' },
    { vi: 'Đóng gói full-stack bằng Docker Compose chạy được trên máy người khác', en: 'Package a full stack in Docker Compose that runs on someone else\'s machine' },
  ],

  bodyMdx,
  bodyMdxEn,
};
