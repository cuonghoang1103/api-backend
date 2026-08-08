/**
 * Case-study INT604 — Helpdesk / IT Ticketing API.
 * Semester 6 internship project #4, API-only.
 *
 * Its place in the through-line: the first invariant the SCHEMA cannot state,
 * because the legal new value depends on the OLD value. So the guard moves
 * into the WHERE clause of the UPDATE itself — compare-and-set in SQL — and
 * the row count returned by that UPDATE becomes the business result.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./helpdesk-ticketing-api.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./helpdesk-ticketing-api.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'helpdesk-ticketing-api',
  title: 'Helpdesk Ticketing API (Đồ án thực tập #4)',
  titleEn: 'Helpdesk Ticketing API (Internship Project #4)',
  description:
    'Đồ án #4 Kỳ 6, Spring Boot 3 + PostgreSQL, không frontend. Lần đầu gặp một bất biến mà schema KHÔNG nói được: giá trị mới hợp lệ phụ thuộc vào giá trị cũ. Lời giải là đưa phép kiểm vào chính mệnh đề WHERE của câu UPDATE — bản SQL của so-sánh-rồi-hoán-đổi — kèm máy trạng thái viết dưới dạng dữ liệu và nhật ký chuyển trạng thái chỉ-ghi-thêm.',
  descriptionEn:
    'Semester 6 project #4, Spring Boot 3 + PostgreSQL, no front end. The first invariant the schema CANNOT state, because the legal new value depends on the old one. The answer is to move the check into the UPDATE\'s own WHERE clause — compare-and-set in SQL — alongside a state machine held as data and an append-only transition log.',
  techStack: [
    'Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Spring Security', 'PostgreSQL',
    'JWT', 'BCrypt', 'JUnit 5', 'Testcontainers', 'springdoc-openapi', 'Docker Compose',
  ],
  role: 'Backend (một người)',
  roleEn: 'Backend (solo)',
  duration: '3 tuần',
  durationEn: '3 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/helpdesk-ticketing-api.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Bất biến của đồ án này KHÔNG nằm được trong ràng buộc: "OPEN được
-- chuyển sang ASSIGNED" là luật về CẶP (cũ, mới), mà CHECK chỉ nhìn
-- thấy hàng SAU khi ghi. Nên nó nằm trong WHERE của câu UPDATE.

CREATE TABLE tickets (
  id                 BIGSERIAL PRIMARY KEY,
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  priority           VARCHAR(8)  NOT NULL,   -- LOW MEDIUM HIGH URGENT
  status             VARCHAR(16) NOT NULL DEFAULT 'OPEN',
  requester_id       BIGINT NOT NULL REFERENCES users(id),
  assigned_agent_id  BIGINT REFERENCES users(id),   -- NULL = còn ở hàng chờ
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- CHỐT lúc tạo từ bảng SLA. Tính lại lúc đọc là đổi mức ưu tiên của
  -- ticket cũ sẽ VIẾT LẠI LỊCH SỬ: ticket từng trễ hạn thành đúng hạn.
  due_at             TIMESTAMPTZ NOT NULL,
  resolved_at        TIMESTAMPTZ
);

-- Hàng chờ: "ticket còn OPEN, ưu tiên cao trước". Chỉ mục bộ phận vì
-- hàng chờ luôn nhỏ trong khi bảng tickets lớn dần mãi.
CREATE INDEX idx_ticket_queue ON tickets (priority, created_at)
  WHERE status = 'OPEN';
CREATE INDEX idx_ticket_agent ON tickets (assigned_agent_id, created_at DESC);

-- Bảng CHỈ GHI THÊM: không UPDATE, không DELETE. Đây là thứ duy nhất
-- trả lời được "ai đóng ticket này" và "thời gian phản hồi đầu tiên
-- là bao lâu" — cột status một mình không trả lời được.
CREATE TABLE ticket_events (
  id           BIGSERIAL PRIMARY KEY,
  ticket_id    BIGINT NOT NULL REFERENCES tickets(id),
  actor_id     BIGINT NOT NULL REFERENCES users(id),
  from_status  VARCHAR(16) NOT NULL,
  to_status    VARCHAR(16) NOT NULL,
  at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  note         TEXT
);
CREATE INDEX idx_event_ticket ON ticket_events (ticket_id, at);`,
  schemaCodeEn: `-- This project's invariant CANNOT live in a constraint: "OPEN may move to
-- ASSIGNED" is a rule about the PAIR (old, new), and a CHECK only sees the
-- row AFTER the write. So it lives in the UPDATE's WHERE clause instead.

CREATE TABLE tickets (
  id                 BIGSERIAL PRIMARY KEY,
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  priority           VARCHAR(8)  NOT NULL,   -- LOW MEDIUM HIGH URGENT
  status             VARCHAR(16) NOT NULL DEFAULT 'OPEN',
  requester_id       BIGINT NOT NULL REFERENCES users(id),
  assigned_agent_id  BIGINT REFERENCES users(id),   -- NULL = still queued
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- FROZEN at creation from the SLA table. Recomputing it at read time means
  -- changing an old ticket's priority REWRITES HISTORY: a late ticket
  -- silently becomes on time.
  due_at             TIMESTAMPTZ NOT NULL,
  resolved_at        TIMESTAMPTZ
);

-- The queue: "still OPEN, highest priority first". A partial index, because
-- the queue stays small while the tickets table grows forever.
CREATE INDEX idx_ticket_queue ON tickets (priority, created_at)
  WHERE status = 'OPEN';
CREATE INDEX idx_ticket_agent ON tickets (assigned_agent_id, created_at DESC);

-- APPEND-ONLY table: never UPDATEd, never DELETEd. It is the only thing that
-- can answer "who closed this ticket" and "what is our first response time" —
-- the status column alone cannot.
CREATE TABLE ticket_events (
  id           BIGSERIAL PRIMARY KEY,
  ticket_id    BIGINT NOT NULL REFERENCES tickets(id),
  actor_id     BIGINT NOT NULL REFERENCES users(id),
  from_status  VARCHAR(16) NOT NULL,
  to_status    VARCHAR(16) NOT NULL,
  at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  note         TEXT
);
CREATE INDEX idx_event_ticket ON ticket_events (ticket_id, at);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Máy trạng thái viết dưới dạng dữ liệu, không phải chuỗi if',
      titleEn: 'The state machine as data, not a chain of ifs',
      description:
        'Một Map<TicketStatus, Set<TicketStatus>> là nguồn sự thật duy nhất về các bước chuyển hợp lệ. Nó đọc được trong mười dòng, test được một mình không cần database, và sinh được endpoint GET /tickets/{id}/transitions để client không phải chép luật lần thứ hai. Trạng thái kết thúc phải có Set.of() TƯỜNG MINH, không phải một dòng bị quên.',
      descriptionEn:
        'A Map<TicketStatus, Set<TicketStatus>> is the single source of truth for legal transitions. It reads in ten lines, tests alone without a database, and generates a GET /tickets/{id}/transitions endpoint so the client never copies the rules. A terminal state needs an EXPLICIT Set.of(), not a forgotten entry.',
      codeBlock:
        'static final Map<TicketStatus, Set<TicketStatus>> NEXT = Map.of(\n'
        + '  OPEN,        Set.of(ASSIGNED),\n'
        + '  ASSIGNED,    Set.of(IN_PROGRESS, OPEN),\n'
        + '  IN_PROGRESS, Set.of(RESOLVED),\n'
        + '  RESOLVED,    Set.of(CLOSED, IN_PROGRESS),\n'
        + '  CLOSED,      Set.of()      // kết thúc — TƯỜNG MINH\n'
        + ');',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Nhận việc nguyên tử: phép kiểm nằm trong WHERE',
      titleEn: 'Atomic claiming: the check lives in the WHERE',
      description:
        'Không có hàng thứ hai để đặt UNIQUE lên — cả hai nhân viên chỉ đang sửa cùng một hàng tickets. Lời giải là để cơ sở dữ liệu đánh giá điều kiện và ghi trong MỘT bước: UPDATE ... WHERE id=? AND status=\'OPEN\'. Con số dòng bị sửa CHÍNH LÀ kết quả nghiệp vụ: 1 là thắng, 0 là 409.',
      descriptionEn:
        'There is no second row to hang a UNIQUE on — both agents are updating the same tickets row. The fix is to let the database evaluate the condition and write in ONE step: UPDATE ... WHERE id=? AND status=\'OPEN\'. The affected-row count IS the business result: 1 means you won, 0 means 409.',
      codeBlock:
        '@Modifying\n'
        + '@Query("update Ticket t set t.assignedAgent.id = :agentId, '
        + "t.status = 'ASSIGNED' \" +\n"
        + '       "where t.id = :id and t.status = \'OPEN\'")\n'
        + 'int claimIfOpen(@Param("id") Long id, @Param("agentId") Long agentId);\n\n'
        + 'int rows = tickets.claimIfOpen(id, agentId);\n'
        + 'if (rows == 0) throw new ConflictException("Ticket đã có người nhận");',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Nhật ký chuyển trạng thái chỉ-ghi-thêm',
      titleEn: 'An append-only transition log',
      description:
        'Mỗi lần đổi trạng thái sinh một hàng ticket_events, không bao giờ sửa hay xoá. Nó cho ba thứ cột status không cho: trách nhiệm giải trình (ai đóng, lúc nào), số đo thật (thời gian phản hồi đầu tiên = OPEN → ASSIGNED), và gỡ lỗi quy trình (ticket mở lại ba lần là vấn đề khác hẳn).',
      descriptionEn:
        'Every status change writes one ticket_events row, never updated, never deleted. It buys three things the status column cannot: accountability (who closed it, when), real metrics (first response time = OPEN → ASSIGNED), and process debugging (a ticket re-opened three times is a different problem entirely).',
    },
    {
      phase: 'BACKEND',
      title: 'SLA: bảng dữ liệu, và dueAt chốt lúc tạo',
      titleEn: 'SLA: a data table, and dueAt frozen at creation',
      description:
        'Map<Priority, Duration> thay cho chuỗi if. Quan trọng hơn: dueAt được tính MỘT LẦN lúc tạo rồi lưu lại. Tính lại lúc đọc là quản lý đổi mức ưu tiên của ticket cũ sẽ viết lại lịch sử — ticket từng trễ hạn bỗng thành đúng hạn, và báo cáo SLA mất hết ý nghĩa.',
      descriptionEn:
        'A Map<Priority, Duration> replaces the if chain. More importantly: dueAt is computed ONCE at creation and stored. Recompute it at read time and a manager changing an old ticket\'s priority rewrites history — a late ticket becomes on time and the SLA report becomes meaningless.',
      codeBlock:
        'static final Map<Priority, Duration> SLA = Map.of(\n'
        + '  URGENT, Duration.ofHours(4),\n'
        + '  HIGH,   Duration.ofHours(24),\n'
        + '  MEDIUM, Duration.ofDays(3),\n'
        + '  LOW,    Duration.ofDays(7)\n'
        + ');\n'
        + 'ticket.setDueAt(Instant.now().plus(SLA.get(ticket.getPriority())));',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Báo cáo bằng GROUP BY, và vì sao dùng trung vị',
      titleEn: 'Reporting with GROUP BY, and why the median',
      description:
        'COUNT(*) FILTER (WHERE ...) đếm có điều kiện trong cùng một lần quét thay vì chạy hai truy vấn rồi ghép. Và dùng PERCENTILE_CONT(0.5) chứ không AVG: một ticket bị bỏ quên ba tháng kéo trung bình lên và làm cả báo cáo vô nghĩa. Với số đo thời gian phục vụ, trung vị và phân vị 95 luôn nói thật hơn trung bình.',
      descriptionEn:
        'COUNT(*) FILTER (WHERE ...) counts conditionally in a single scan instead of running two queries and stitching them. And use PERCENTILE_CONT(0.5) rather than AVG: one ticket forgotten for three months drags the mean up and voids the report. For service-time metrics the median and p95 always tell more truth than the mean.',
      codeBlock:
        'SELECT u.full_name,\n'
        + '       COUNT(*) AS total,\n'
        + '       COUNT(*) FILTER (WHERE t.resolved_at <= t.due_at) AS on_time,\n'
        + '       PERCENTILE_CONT(0.5) WITHIN GROUP (\n'
        + '         ORDER BY EXTRACT(EPOCH FROM (t.resolved_at - t.created_at))/3600\n'
        + '       ) AS median_hours\n'
        + '  FROM tickets t JOIN users u ON u.id = t.assigned_agent_id\n'
        + ' WHERE t.resolved_at IS NOT NULL\n'
        + ' GROUP BY u.id, u.full_name;',
      codeLang: 'sql',
    },
    {
      phase: 'SECURITY',
      title: 'Ba vai trò, và quyền sở hữu tách khỏi vai trò',
      titleEn: 'Three roles, with ownership separate from role',
      description:
        'Vai trò trả lời "được làm loại việc gì", quyền sở hữu trả lời "được đụng vào bản ghi nào". Nhân viên hỗ trợ có quyền đổi trạng thái ticket, nhưng chỉ ticket đang giao cho chính mình — kiểm một trong hai là chưa đủ. Bình luận nội bộ phải lọc ở TẦNG TRUY VẤN, không phải ẩn ở tầng hiển thị.',
      descriptionEn:
        'A role answers "what kind of action may you take"; ownership answers "which record may you touch". An agent may change ticket status, but only on tickets assigned to them — checking one without the other is not enough. Internal comments must be filtered in the QUERY, not hidden in the view.',
    },
    {
      phase: 'TESTING',
      title: 'Test luật một mình, test tranh chấp riêng',
      titleEn: 'Test the rules alone, test contention separately',
      description:
        'Hai loại test khác hẳn nhau. Loại một: duyệt MỌI cặp (from, to) trong enum và khẳng định đúng những cặp trong NEXT là hợp lệ — chạy trong mili giây, không cần database. Loại hai: 20 luồng cùng nhận một ticket, khẳng định 1 thắng 19 nhận 409. Thêm một test khẳng định NEXT phủ hết giá trị enum, để thêm trạng thái mới mà quên là test đỏ ngay.',
      descriptionEn:
        'Two very different kinds of test. One: walk EVERY (from, to) pair in the enum and assert exactly the pairs in NEXT are legal — milliseconds, no database. Two: 20 threads claiming one ticket, asserting 1 winner and 19 conflicts. Add a test asserting NEXT covers every enum value, so adding a status without updating it turns red immediately.',
    },
    {
      phase: 'DEVOPS',
      title: 'Testcontainers, OpenAPI và dữ liệu đủ lớn để báo cáo có nghĩa',
      titleEn: 'Testcontainers, OpenAPI, and data big enough for reports to mean something',
      description:
        'PERCENTILE_CONT và COUNT(*) FILTER là cú pháp riêng của Postgres — test trên H2 sẽ nói dối. Nạp sẵn 100.000 ticket giả lập: không có dữ liệu đó thì cả endpoint báo cáo lẫn chỉ mục bộ phận đều không chứng minh được gì, và EXPLAIN trên bảng 50 dòng luôn cho kết quả vô nghĩa.',
      descriptionEn:
        'PERCENTILE_CONT and COUNT(*) FILTER are Postgres-specific — H2-based tests would lie. Seed 100,000 tickets: without that volume neither the reporting endpoint nor the partial index proves anything, and EXPLAIN on a 50-row table is always meaningless.',
    },
  ],

  features: [
    { title: 'Tạo ticket có mức ưu tiên và hạn xử lý', titleEn: 'File tickets with priority and an SLA due date', description: 'dueAt tính từ bảng SLA lúc tạo rồi chốt lại, không tính lại lúc đọc.', descriptionEn: 'dueAt is derived from the SLA table at creation and then frozen, never recomputed.', status: 'PLANNED' },
    { title: 'Hàng chờ chung cho nhân viên hỗ trợ', titleEn: 'A shared agent queue', description: 'Ticket còn OPEN, sắp theo mức ưu tiên rồi tới thời điểm tạo, đọc qua chỉ mục bộ phận.', descriptionEn: 'Still-OPEN tickets sorted by priority then age, served from a partial index.', status: 'PLANNED' },
    { title: 'Nhận việc nguyên tử', titleEn: 'Atomic claiming', description: 'UPDATE ... WHERE status=\'OPEN\'; số dòng bị sửa chính là kết quả nghiệp vụ.', descriptionEn: 'UPDATE ... WHERE status=\'OPEN\'; the affected-row count is the business result.', status: 'PLANNED' },
    { title: 'Máy trạng thái được thực thi thật', titleEn: 'A genuinely enforced state machine', description: 'Bảng NEXT là dữ liệu; bước không hợp lệ trả 409 kèm tên bước bị từ chối.', descriptionEn: 'The NEXT table is data; an illegal step returns 409 naming the rejected transition.', status: 'PLANNED' },
    { title: 'Endpoint trả về các bước hợp lệ hiện tại', titleEn: 'An endpoint returning the currently legal steps', description: 'GET /tickets/{id}/transitions để client không phải chép luật lần thứ hai.', descriptionEn: 'GET /tickets/{id}/transitions so the client never copies the rules.', status: 'PLANNED' },
    { title: 'Nhật ký chuyển trạng thái đầy đủ', titleEn: 'A complete transition log', description: 'Bảng chỉ-ghi-thêm ghi ai đổi gì lúc nào, nền tảng cho mọi số đo về thời gian.', descriptionEn: 'An append-only table recording who changed what when — the basis of every timing metric.', status: 'PLANNED' },
    { title: 'Bình luận nội bộ tách khỏi trao đổi với người báo', titleEn: 'Internal notes separated from the requester thread', description: 'Cờ internal lọc ở tầng truy vấn, không phải ẩn ở giao diện.', descriptionEn: 'The internal flag is filtered in the query, not hidden in the UI.', status: 'PLANNED' },
    { title: 'Báo cáo hiệu suất theo nhân viên', titleEn: 'Per-agent performance reporting', description: 'Khối lượng, tỉ lệ đúng hạn, thời gian xử lý trung vị — tất cả bằng một câu GROUP BY.', descriptionEn: 'Volume, on-time rate and median resolution time — all in one GROUP BY.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT604 trên Academy — bản dạy từng bước', titleEn: 'INT604 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/helpdesk-ticketing-api', type: 'LINK', description: '9 mục, 21 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 21 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'PostgreSQL — Aggregate Expressions (FILTER)', titleEn: 'PostgreSQL — Aggregate Expressions (FILTER)', url: 'https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES', type: 'DOC', description: 'COUNT(*) FILTER (WHERE ...) — đếm có điều kiện trong một lần quét.', descriptionEn: 'COUNT(*) FILTER (WHERE ...) — conditional counting in a single scan.' },
    { title: 'PostgreSQL — Ordered-Set Aggregates', titleEn: 'PostgreSQL — Ordered-Set Aggregates', url: 'https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE', type: 'DOC', description: 'PERCENTILE_CONT để tính trung vị và phân vị 95.', descriptionEn: 'PERCENTILE_CONT for medians and 95th percentiles.' },
    { title: 'Spring Data JPA — @Modifying queries', titleEn: 'Spring Data JPA — @Modifying queries', url: 'https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.modifying-queries', type: 'DOC', description: 'Cách viết UPDATE có điều kiện và đọc số dòng bị ảnh hưởng.', descriptionEn: 'How to write a conditional UPDATE and read the affected-row count.' },
    { title: 'Compare-and-swap', titleEn: 'Compare-and-swap', url: 'https://en.wikipedia.org/wiki/Compare-and-swap', type: 'LINK', description: 'Nguyên thuỷ CPU mà UPDATE ... WHERE status=\'OPEN\' là bản SQL của nó.', descriptionEn: 'The CPU primitive that UPDATE ... WHERE status=\'OPEN\' is the SQL form of.' },
    { title: 'Google SRE Book — Monitoring Distributed Systems', titleEn: 'Google SRE Book — Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/', type: 'LINK', description: 'Mục "The Four Golden Signals" giải thích vì sao đo bằng phân vị chứ không trung bình.', descriptionEn: 'The "Four Golden Signals" section on why you measure with percentiles, not means.' },
  ],

  coreKnowledge: [
    { vi: 'Bất biến phụ thuộc trạng thái cũ: vì sao CHECK và UNIQUE đều bó tay', en: 'Invariants that depend on the previous state: why CHECK and UNIQUE cannot help' },
    { vi: 'Kiểm-và-đặt trong SQL, và số dòng bị sửa như một kết quả nghiệp vụ', en: 'Test-and-set in SQL, and the affected-row count as a business result' },
    { vi: 'Máy trạng thái viết dưới dạng dữ liệu: đọc được, test được, sinh được tài liệu', en: 'State machines as data: readable, testable, and documentation-generating' },
    { vi: 'Trạng thái kết thúc phải có tập chuyển rỗng TƯỜNG MINH', en: 'Terminal states need an EXPLICIT empty transition set' },
    { vi: 'Bảng chỉ-ghi-thêm và ba thứ nó cho mà cột trạng thái không cho', en: 'Append-only tables and the three things they buy over a status column' },
    { vi: 'Cam kết chốt tại thời điểm: dueAt, giá, điều khoản', en: 'Commitments frozen at a point in time: due dates, prices, terms' },
    { vi: 'COUNT(*) FILTER: đếm nhiều điều kiện trong một lần quét', en: 'COUNT(*) FILTER: several conditional counts in a single scan' },
    { vi: 'Vì sao trung vị và phân vị 95 nói thật hơn trung bình với số đo thời gian', en: 'Why the median and p95 beat the mean for timing metrics' },
    { vi: 'Chỉ mục bộ phận cho hàng chờ: bảng lớn dần nhưng hàng chờ luôn nhỏ', en: 'Partial indexes for queues: the table grows forever, the queue stays small' },
    { vi: 'Phân quyền hai chiều: vai trò (làm loại gì) và quyền sở hữu (đụng bản ghi nào)', en: 'Two-axis authorisation: role (what kind of action) and ownership (which record)' },
  ],

  portfolioBonus: [
    { vi: 'Sơ đồ máy trạng thái trong README sinh thẳng từ Map NEXT', en: 'A state-machine diagram in the README generated straight from the NEXT map' },
    { vi: 'Bảng đo thời gian phản hồi đầu tiên tính từ nhật ký chuyển trạng thái', en: 'A first-response-time table computed from the transition log' },
    { vi: 'Nạp 100.000 ticket giả lập kèm EXPLAIN ANALYZE chứng minh chỉ mục có tác dụng', en: '100,000 seeded tickets with EXPLAIN ANALYZE proving the indexes matter' },
    { vi: 'Webhook hoặc email khi ticket sắp tới hạn SLA', en: 'A webhook or email when a ticket approaches its SLA deadline' },
    { vi: 'Endpoint xuất CSV cho báo cáo, phát trực tiếp không giữ hết trong bộ nhớ', en: 'A CSV export endpoint that streams rather than buffering everything in memory' },
    { vi: 'Kiểm thử kiến trúc (ArchUnit) chặn controller gọi thẳng repository', en: 'An architecture test (ArchUnit) preventing controllers from calling repositories directly' },
  ],

  completionOutcomes: [
    { vi: 'Nhận ra khi nào bất biến không đặt được vào schema, và chuyển nó vào WHERE', en: 'Recognise when an invariant cannot live in the schema, and move it into the WHERE' },
    { vi: 'Thiết kế máy trạng thái mà người mới đọc mười dòng là hiểu toàn bộ quy trình', en: 'Design a state machine a newcomer understands in ten lines' },
    { vi: 'Dựng nhật ký sự kiện đủ để trả lời câu hỏi kiểm toán lẫn câu hỏi số đo', en: 'Build an event log that answers both audit and metrics questions' },
    { vi: 'Viết truy vấn báo cáo chạy được trên dữ liệu thật thay vì đếm bằng vòng lặp', en: 'Write reporting queries that survive real data instead of counting in a loop' },
    { vi: 'Chọn đúng thống kê để mô tả hiệu năng, thay vì mặc định dùng trung bình', en: 'Choose the right statistic to describe performance instead of defaulting to the mean' },
  ],

  bodyMdx,
  bodyMdxEn,
};
