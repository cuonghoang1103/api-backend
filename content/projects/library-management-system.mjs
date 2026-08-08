/**
 * Case-study INT602 — Library Management System.
 * Semester 6 internship project #2. Mirrors the Academy course of the same
 * slug: /projects/<slug> is the "why", /courses/<slug> is the "how".
 *
 * Its place in the Semester 6 through-line: same race as INT601, but UNIQUE
 * is the WRONG constraint here (a copy is lent hundreds of times), so the
 * invariant moves to a PARTIAL unique index scoped to open loans.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./library-management-system.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./library-management-system.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'library-management-system',
  title: 'Library Management System (Đồ án thực tập #2)',
  titleEn: 'Library Management System (Internship Project #2)',
  description:
    'Đồ án thứ hai Kỳ 6: quản lý thư viện bằng Spring Boot 3 + React + PostgreSQL. Cùng cuộc đua với đồ án #1 nhưng UNIQUE là ràng buộc SAI — một cuốn sách được mượn hàng trăm lần. Bất biến đúng là "tối đa một phiếu ĐANG MỞ mỗi bản sao", và Postgres giải nó bằng chỉ mục UNIQUE bộ phận.',
  descriptionEn:
    'The second Semester 6 project: a library system in Spring Boot 3 + React + PostgreSQL. Same race as project #1, but UNIQUE is the WRONG constraint — a copy is lent hundreds of times. The correct invariant is "at most one OPEN loan per copy", and Postgres expresses it with a partial unique index.',
  techStack: [
    'Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Spring Security', 'PostgreSQL',
    'Postgres Full-Text Search', 'React', 'Vite', 'JWT', 'BCrypt', 'JUnit 5', 'Docker Compose',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/library-management-system.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- ĐẦU SÁCH và BẢN SAO VẬT LÝ là hai khái niệm khác nhau.
-- Gộp chúng lại là không quản được thư viện có 5 cuốn cùng tên.

CREATE TABLE books (
  id              BIGSERIAL PRIMARY KEY,
  isbn            VARCHAR(20) UNIQUE NOT NULL,   -- định danh ĐẦU SÁCH
  title           TEXT NOT NULL,
  author          TEXT NOT NULL,
  published_year  INT,
  -- Cột sinh tự động: không thể quên cập nhật vì DB tự tính.
  -- 'simple' chứ không 'english': bộ cắt gốc tiếng Anh làm hỏng
  -- tên riêng và tiếng Việt.
  search_vector   tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')),  'A') ||
    setweight(to_tsvector('simple', coalesce(author, '')), 'B')
  ) STORED
);
CREATE INDEX idx_books_search ON books USING GIN (search_vector);

CREATE TABLE copies (
  id        BIGSERIAL PRIMARY KEY,
  book_id   BIGINT NOT NULL REFERENCES books(id),
  barcode   VARCHAR(32) UNIQUE NOT NULL,  -- mã dán trên GÁY cuốn cụ thể
  status    VARCHAR(16) NOT NULL DEFAULT 'AVAILABLE',
  version   INT NOT NULL DEFAULT 0        -- khoá lạc quan
);

CREATE TABLE loans (
  id           BIGSERIAL PRIMARY KEY,
  copy_id      BIGINT NOT NULL REFERENCES copies(id),
  member_id    BIGINT NOT NULL REFERENCES users(id),
  borrowed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at       TIMESTAMPTZ NOT NULL,
  -- NULL = phiếu ĐANG MỞ. Đây là ĐỊNH NGHĨA của "đang mượn";
  -- đừng thêm cột isReturned bên cạnh — hai nguồn sự thật sẽ lệch.
  returned_at  TIMESTAMPTZ,
  renew_count  INT NOT NULL DEFAULT 0
);

-- BẤT BIẾN CỦA CẢ HỆ THỐNG, phát biểu một lần ở tầng lưu trữ:
-- tối đa MỘT phiếu đang mở cho mỗi bản sao. Sách đã trả rơi khỏi
-- chỉ mục, nên lịch sử mượn không giới hạn.
CREATE UNIQUE INDEX uq_active_loan
  ON loans (copy_id)
  WHERE returned_at IS NULL;

-- "Phiếu của tôi, mới nhất trước" + danh sách quá hạn.
CREATE INDEX idx_loan_member ON loans (member_id, borrowed_at DESC);
CREATE INDEX idx_loan_overdue ON loans (due_at) WHERE returned_at IS NULL;`,
  schemaCodeEn: `-- A TITLE and a PHYSICAL COPY are two different concepts.
-- Collapse them and you cannot track a library owning 5 of one book.

CREATE TABLE books (
  id              BIGSERIAL PRIMARY KEY,
  isbn            VARCHAR(20) UNIQUE NOT NULL,   -- identifies the TITLE
  title           TEXT NOT NULL,
  author          TEXT NOT NULL,
  published_year  INT,
  -- A generated column: impossible to forget to refresh, the DB computes it.
  -- 'simple' rather than 'english': the English stemmer mangles proper
  -- nouns and Vietnamese text.
  search_vector   tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')),  'A') ||
    setweight(to_tsvector('simple', coalesce(author, '')), 'B')
  ) STORED
);
CREATE INDEX idx_books_search ON books USING GIN (search_vector);

CREATE TABLE copies (
  id        BIGSERIAL PRIMARY KEY,
  book_id   BIGINT NOT NULL REFERENCES books(id),
  barcode   VARCHAR(32) UNIQUE NOT NULL,  -- the sticker on THIS physical book
  status    VARCHAR(16) NOT NULL DEFAULT 'AVAILABLE',
  version   INT NOT NULL DEFAULT 0        -- optimistic lock
);

CREATE TABLE loans (
  id           BIGSERIAL PRIMARY KEY,
  copy_id      BIGINT NOT NULL REFERENCES copies(id),
  member_id    BIGINT NOT NULL REFERENCES users(id),
  borrowed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at       TIMESTAMPTZ NOT NULL,
  -- NULL = the loan is OPEN. This is the DEFINITION of "on loan";
  -- do not add an isReturned column next to it — two truths will drift.
  returned_at  TIMESTAMPTZ,
  renew_count  INT NOT NULL DEFAULT 0
);

-- THE SYSTEM INVARIANT, stated once at the storage layer:
-- at most ONE open loan per copy. Returned loans drop out of the
-- index, so loan history is unbounded.
CREATE UNIQUE INDEX uq_active_loan
  ON loans (copy_id)
  WHERE returned_at IS NULL;

-- "My loans, newest first" + the overdue list.
CREATE INDEX idx_loan_member ON loans (member_id, borrowed_at DESC);
CREATE INDEX idx_loan_overdue ON loans (due_at) WHERE returned_at IS NULL;`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Tách đầu sách khỏi bản sao vật lý',
      titleEn: 'Separating the title from the physical copy',
      description:
        'Thư viện mua 5 cuốn Clean Code: ba đang mượn, hai trên kệ. Một bảng book duy nhất không biểu diễn được điều đó — bạn buộc phải nhân bản ISBN, tác giả, mô tả 5 lần. Tách BOOK (đầu sách, ISBN) khỏi COPY (bản sao, mã vạch trên gáy) là quyết định mô hình hoá quan trọng nhất của đồ án.',
      descriptionEn:
        'The library buys 5 copies of Clean Code: three on loan, two on the shelf. A single book table cannot express that — you end up duplicating the ISBN, author and blurb five times. Splitting BOOK (title, ISBN) from COPY (physical item, barcode) is this project\'s most important modelling decision.',
    },
    {
      phase: 'DATABASE',
      title: 'Chỉ mục UNIQUE bộ phận — bất biến đúng, phạm vi đúng',
      titleEn: 'A partial unique index — right invariant, right scope',
      description:
        'UNIQUE(copy_id) cấm luôn việc mượn lại cuốn sách đã trả. Bất biến thật là "tối đa một phiếu ĐANG MỞ mỗi bản sao", và mệnh đề WHERE returned_at IS NULL biến nó thành một dòng SQL. Chỉ mục cũng nhỏ hơn hàng chục lần: 50.000 phiếu nhưng chỉ 900 phiếu đang mở thì chỉ mục chỉ chứa 900 mục.',
      descriptionEn:
        'UNIQUE(copy_id) bans re-borrowing a returned book. The real invariant is "at most one OPEN loan per copy", and a WHERE returned_at IS NULL clause turns it into one line of SQL. The index is also far smaller: 50,000 loans with 900 open means 900 index entries.',
      codeBlock:
        '-- Chỉ hàng returned_at IS NULL tham gia tính duy nhất.\n'
        + '-- Sách trả rồi rơi khỏi chỉ mục ⇒ lịch sử mượn không giới hạn.\n'
        + 'CREATE UNIQUE INDEX uq_active_loan\n'
        + '  ON loans (copy_id)\n'
        + '  WHERE returned_at IS NULL;\n\n'
        + '-- CHECK không làm được: CHECK chỉ nhìn MỘT hàng,\n'
        + '-- còn tính duy nhất là quan hệ GIỮA các hàng.',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Lõi cho mượn: cùng khuôn ba lớp, đổi lớp thứ ba',
      titleEn: 'The lending core: same three-layer shape, third layer swapped',
      description:
        'Kiểm nhanh → @Version trên COPY → chỉ mục bộ phận trên LOAN. Hình dạng giải pháp giữ nguyên so với đồ án #1; thứ thay đổi là ràng buộc nào phát biểu đúng bất biến của nghiệp vụ này. Nhận ra khuôn lặp lại được đó chính là thứ khiến đồ án #3 đến #8 dễ hơn hẳn.',
      descriptionEn:
        'Fast-path check → @Version on COPY → partial index on LOAN. The solution shape is unchanged from project #1; what changes is which constraint correctly states this domain\'s invariant. Recognising that repeatable shape is exactly what makes projects #3 through #8 much easier.',
      codeBlock:
        'try {\n'
        + '  return loans.saveAndFlush(loan);   // uq_active_loan là chốt chặn cuối\n'
        + '} catch (DataIntegrityViolationException | OptimisticLockException e) {\n'
        + '  throw new ConflictException("Bản sao này đang có người mượn");  // 409\n'
        + '}',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Trả sách: hai hàng phải đổi cùng nhau',
      titleEn: 'Returning: two rows must change together',
      description:
        'Đặt returned_at và trả copies.status về AVAILABLE phải nằm trong MỘT transaction. Tách ra là sinh "sách ma": phiếu đã đóng nhưng bản sao kẹt ở BORROWED vĩnh viễn, và không ai phát hiện cho tới khi có người muốn mượn cuốn đó.',
      descriptionEn:
        'Setting returned_at and putting copies.status back to AVAILABLE must happen in ONE transaction. Split them and you create "ghost books": the loan is closed but the copy is stuck at BORROWED forever, and nobody notices until someone tries to borrow it.',
    },
    {
      phase: 'BACKEND',
      title: 'Quá hạn là trạng thái SUY RA, không phải cột',
      titleEn: 'Overdue is a DERIVED state, not a column',
      description:
        'Thêm status=\'OVERDUE\' là tự nhận nghĩa vụ chạy một job cập nhật mỗi đêm, và job đó sẽ có ngày không chạy. Quá hạn tính được bất cứ lúc nào: due_at < now() AND returned_at IS NULL. Quy tắc chung: trạng thái tính được từ dữ liệu sẵn có thì đừng lưu thành cột.',
      descriptionEn:
        'Adding status=\'OVERDUE\' signs you up to run a nightly job forever, and one night it will not run. Overdue is computable at any moment: due_at < now() AND returned_at IS NULL. The general rule: if a state is derivable from data you already store, do not store it.',
      codeBlock:
        '-- Danh sách quá hạn, luôn đúng, không cần job nào\n'
        + 'SELECT l.*, u.full_name, b.title\n'
        + '  FROM loans l\n'
        + '  JOIN users u ON u.id = l.member_id\n'
        + '  JOIN copies c ON c.id = l.copy_id\n'
        + '  JOIN books  b ON b.id = c.book_id\n'
        + ' WHERE l.returned_at IS NULL\n'
        + '   AND l.due_at < now()\n'
        + ' ORDER BY l.due_at;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Tìm sách bằng full-text search của Postgres',
      titleEn: 'Searching with Postgres full-text search',
      description:
        'LIKE %...% khớp chuỗi con chứ không khớp từ, và quét toàn bảng. tsvector + chỉ mục GIN cho phép khớp theo từ và xếp hạng theo độ liên quan. Dùng websearch_to_tsquery để người dùng gõ được cú pháp kiểu Google mà truy vấn không sập khi họ gõ dấu ngoặc lẻ.',
      descriptionEn:
        'LIKE %...% matches substrings rather than words, and scans the whole table. tsvector plus a GIN index gives word matching and relevance ranking. Use websearch_to_tsquery so users can type Google-style syntax without an unclosed quote breaking the query.',
      codeBlock:
        'SELECT b.*, ts_rank(b.search_vector, q) AS rank\n'
        + "  FROM books b, websearch_to_tsquery('simple', :keyword) q\n"
        + ' WHERE b.search_vector @@ q\n'
        + ' ORDER BY rank DESC, b.title\n'
        + ' LIMIT 20;',
      codeLang: 'sql',
    },
    {
      phase: 'TESTING',
      title: 'Test chứng minh cả hai hướng',
      titleEn: 'Tests that prove both directions',
      description:
        'Hướng một: 20 luồng mượn cùng bản sao → đúng 1 thành công. Hướng hai, quan trọng không kém: mượn → trả → mượn lại 50 lần đều thành công. Bài test thứ hai là thứ bắt được lỗi dùng UNIQUE thường thay vì chỉ mục bộ phận — lỗi mà bài test đồng thời hoàn toàn không thấy.',
      descriptionEn:
        'Direction one: 20 threads borrow the same copy → exactly 1 succeeds. Direction two, just as important: borrow → return → borrow again, fifty times, all succeeding. That second test is what catches using a plain UNIQUE instead of a partial index — a bug the concurrency test cannot see at all.',
    },
    {
      phase: 'DEVOPS',
      title: 'Docker Compose và dữ liệu mẫu đủ để demo',
      titleEn: 'Docker Compose and seed data worth demoing',
      description:
        'db + api + web, healthcheck cho Postgres. Chi tiết hay bị bỏ: nạp sẵn vài trăm đầu sách và nhiều bản sao cho cùng một ISBN — không có dữ liệu đó thì cả tính năng tìm kiếm lẫn mô hình đầu sách/bản sao đều không demo được cho người chấm thấy.',
      descriptionEn:
        'db + api + web with a Postgres healthcheck. The detail people skip: seed a few hundred titles and several copies of one ISBN — without that data neither the search nor the title/copy model can be demonstrated to a grader.',
    },
  ],

  features: [
    { title: 'Danh mục đầu sách và bản sao', titleEn: 'Catalogue of titles and copies', description: 'Thủ thư nhập đầu sách theo ISBN rồi thêm N bản sao, mỗi bản sao một mã vạch riêng.', descriptionEn: 'The librarian catalogues a title by ISBN, then adds N copies, each with its own barcode.', status: 'PLANNED' },
    { title: 'Cho mượn không trùng bản sao', titleEn: 'Lending with no double-lend', description: 'Kiểm nhanh + @Version + chỉ mục UNIQUE bộ phận trên phiếu đang mở.', descriptionEn: 'Fast-path check + @Version + a partial unique index over open loans.', status: 'PLANNED' },
    { title: 'Trả sách nguyên tử', titleEn: 'Atomic returns', description: 'Đóng phiếu và giải phóng bản sao trong cùng một transaction, không sinh sách ma.', descriptionEn: 'Closing the loan and freeing the copy in one transaction — no ghost books.', status: 'PLANNED' },
    { title: 'Gia hạn có giới hạn', titleEn: 'Bounded renewals', description: 'Tối đa 2 lần, và chỉ khi phiếu chưa quá hạn — quy tắc nằm ở service, có test riêng.', descriptionEn: 'Max two, and only while not overdue — the rule lives in the service with its own test.', status: 'PLANNED' },
    { title: 'Danh sách quá hạn luôn đúng', titleEn: 'An always-correct overdue list', description: 'Suy ra từ due_at và returned_at, không phụ thuộc job nền nào.', descriptionEn: 'Derived from due_at and returned_at, with no dependency on a background job.', status: 'PLANNED' },
    { title: 'Tìm kiếm toàn văn có xếp hạng', titleEn: 'Ranked full-text search', description: 'tsvector + GIN, trọng số tiêu đề cao hơn tác giả, cú pháp kiểu Google.', descriptionEn: 'tsvector + GIN, title weighted above author, Google-style query syntax.', status: 'PLANNED' },
    { title: 'Lịch sử mượn theo từng bản sao', titleEn: 'Per-copy loan history', description: 'Một bản sao giữ được hàng trăm phiếu đã đóng mà không đụng ràng buộc nào.', descriptionEn: 'One copy accumulates hundreds of closed loans without hitting any constraint.', status: 'PLANNED' },
    { title: 'Phí quá hạn tách riêng khỏi lõi', titleEn: 'Fee rules isolated from the core', description: 'Quy tắc tính phí là nghiệp vụ thuần, viết riêng và test riêng, không lẫn vào luồng trả sách.', descriptionEn: 'Fee calculation is pure business logic, written and tested separately from the return flow.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT602 trên Academy — bản dạy từng bước', titleEn: 'INT602 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/library-management-system', type: 'LINK', description: '10 mục, 24 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '10 sections, 24 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'PostgreSQL — Partial Indexes', titleEn: 'PostgreSQL — Partial Indexes', url: 'https://www.postgresql.org/docs/current/indexes-partial.html', type: 'DOC', description: 'Mục 11.8. Đọc ví dụ "enforce uniqueness over a subset of rows" — chính là bài này.', descriptionEn: 'Section 11.8. Read the "enforce uniqueness over a subset of rows" example — that is this project.' },
    { title: 'PostgreSQL — Full Text Search', titleEn: 'PostgreSQL — Full Text Search', url: 'https://www.postgresql.org/docs/current/textsearch.html', type: 'DOC', description: 'tsvector, tsquery, trọng số setweight và ts_rank.', descriptionEn: 'tsvector, tsquery, setweight weighting and ts_rank.' },
    { title: 'Spring Data JPA — Optimistic Locking', titleEn: 'Spring Data JPA — Optimistic Locking', url: 'https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html', type: 'DOC', description: 'Cách @Version sinh mệnh đề WHERE version = ?.', descriptionEn: 'How @Version generates the WHERE version = ? predicate.' },
    { title: 'Testcontainers cho Java', titleEn: 'Testcontainers for Java', url: 'https://java.testcontainers.org/modules/databases/postgres/', type: 'LINK', description: 'Bắt buộc ở đồ án này: H2 KHÔNG có chỉ mục bộ phận lẫn tsvector, test sẽ nói dối.', descriptionEn: 'Mandatory here: H2 has neither partial indexes nor tsvector, so tests would lie to you.' },
    { title: 'Use The Index, Luke — Partial Indexes', titleEn: 'Use The Index, Luke — Partial Indexes', url: 'https://use-the-index-luke.com/sql/where-clause/partial-and-filtered-indexes', type: 'LINK', description: 'Giải thích trực quan vì sao chỉ mục bộ phận vừa nhỏ vừa nhanh hơn.', descriptionEn: 'A visual explanation of why partial indexes are both smaller and faster.' },
  ],

  coreKnowledge: [
    { vi: 'Chỉ mục UNIQUE bộ phận: phát biểu bất biến chỉ trên tập con các hàng', en: 'Partial unique indexes: stating an invariant over a subset of rows' },
    { vi: 'Vì sao CHECK không thay được UNIQUE (một hàng so với quan hệ giữa các hàng)', en: 'Why CHECK cannot replace UNIQUE (one row versus a relationship between rows)' },
    { vi: 'Phân biệt thực thể khái niệm (đầu sách) và thực thể vật lý (bản sao)', en: 'Distinguishing a conceptual entity (title) from a physical one (copy)' },
    { vi: 'Cột NULL mang ngữ nghĩa: returned_at IS NULL là ĐỊNH NGHĨA của "đang mượn"', en: 'A meaningful NULL: returned_at IS NULL is the DEFINITION of "on loan"' },
    { vi: 'Trạng thái suy ra và trạng thái lưu trữ — khi nào chọn cái nào', en: 'Derived versus stored state — when to choose which' },
    { vi: 'Postgres full-text search: tsvector, GIN, trọng số và xếp hạng liên quan', en: 'Postgres full-text search: tsvector, GIN, weighting and relevance ranking' },
    { vi: 'Vì sao chọn bộ phân tích simple thay vì english cho dữ liệu tiếng Việt', en: 'Why the simple analyser beats english for Vietnamese data' },
    { vi: 'Giao dịch bao trọn một thao tác nghiệp vụ, không phải một câu SQL', en: 'A transaction wraps a business operation, not a single SQL statement' },
    { vi: 'Testcontainers: vì sao test trên H2 nói dối khi schema dùng tính năng riêng của Postgres', en: 'Testcontainers: why H2-based tests lie when the schema uses Postgres-only features' },
    { vi: 'Tách quy tắc nghiệp vụ (phí, gia hạn) khỏi luồng ghi dữ liệu để test được riêng', en: 'Separating business rules (fees, renewals) from the write path so they can be tested alone' },
  ],

  portfolioBonus: [
    { vi: 'Đoạn EXPLAIN ANALYZE trong README cho thấy GIN index được dùng thật', en: 'An EXPLAIN ANALYZE snippet in the README proving the GIN index is really used' },
    { vi: 'Test "mượn–trả–mượn lại 50 lần" như bằng chứng chỉ mục bộ phận đúng', en: 'A "borrow–return–borrow again, 50 times" test as proof the partial index is right' },
    { vi: 'Nhập dữ liệu thật từ Open Library API để có vài nghìn đầu sách', en: 'Import real data from the Open Library API for a few thousand titles' },
    { vi: 'Quét mã vạch bằng camera trên trang thủ thư', en: 'Barcode scanning through the camera on the librarian screen' },
    { vi: 'Báo cáo: sách mượn nhiều nhất, thành viên quá hạn nhiều nhất, tồn kho theo đầu sách', en: 'Reports: most-borrowed titles, worst offenders, stock per title' },
    { vi: 'Testcontainers thay H2 để test chạy trên đúng Postgres của production', en: 'Testcontainers instead of H2 so tests run on the same Postgres as production' },
  ],

  completionOutcomes: [
    { vi: 'Chọn được ràng buộc đúng cho một bất biến, thay vì mặc định dùng UNIQUE', en: 'Pick the right constraint for an invariant instead of defaulting to UNIQUE' },
    { vi: 'Nhận ra khi nào một trạng thái nên suy ra và khi nào nên lưu', en: 'Recognise when a state should be derived and when it should be stored' },
    { vi: 'Mô hình hoá được cặp thực thể khái niệm/vật lý mà không nhân bản dữ liệu', en: 'Model a conceptual/physical entity pair without duplicating data' },
    { vi: 'Dựng tìm kiếm toàn văn có xếp hạng bằng Postgres, không cần thêm dịch vụ nào', en: 'Build ranked full-text search on Postgres alone, with no extra service' },
    { vi: 'Viết bài test bắt được lỗi mà bài test đồng thời không thấy', en: 'Write the test that catches the bug a concurrency test cannot see' },
  ],

  bodyMdx,
  bodyMdxEn,
};
