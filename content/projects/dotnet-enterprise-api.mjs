/**
 * Extra project (.NET) — .NET Enterprise API (ASP.NET Core).
 *
 * Fills the .NET gap and, with it, a domain the rest of the roadmap never
 * touches: internal software for large organisations. The priorities invert —
 * the goal stops being "make it work well" and becomes "make it readable by
 * somebody else in five years".
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./dotnet-enterprise-api.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./dotnet-enterprise-api.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'dotnet-enterprise-api',
  title: '.NET Enterprise API (ASP.NET Core)',
  titleEn: '.NET Enterprise API (ASP.NET Core)',
  description:
    'API doanh nghiệp bằng ASP.NET Core: kiến trúc nhiều tầng, tránh các bẫy kinh điển của tầng ánh xạ dữ liệu, đánh phiên bản không phá vỡ bên đang dùng. Mảng phần mềm nội bộ doanh nghiệp có hệ thống sống mười năm và người viết đã nghỉ từ lâu — nên mục tiêu không còn là làm nó chạy tốt mà là làm nó ĐỌC ĐƯỢC sau năm năm.',
  descriptionEn:
    'An enterprise API in ASP.NET Core: layered architecture, avoiding the classic ORM traps, and versioning that never breaks callers. Enterprise internal software lives ten years with its authors long gone — so the goal stops being making it work well and becomes making it READABLE in five years.',
  techStack: [
    'C#', '.NET 9', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server / PostgreSQL',
    'MediatR', 'Serilog', 'OpenTelemetry', 'xUnit', 'Testcontainers', 'Docker',
  ],
  role: 'Backend doanh nghiệp (một người)',
  roleEn: 'Enterprise backend (solo)',
  duration: '6–8 tuần',
  durationEn: '6–8 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'INTERMEDIATE',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// ── BẪY 1: .Result VÀ BẾ TẮC — lỗi KHÔNG xuất hiện trên máy bạn ──────
// Bế tắc chỉ xảy ra khi có bộ điều phối buộc phần tiếp theo chạy trên đúng
// luồng đang bị chặn. ASP.NET Core hiện đại KHÔNG có bộ điều phối đó, nên mã
// dưới có vẻ chạy được — cho tới khi ai đó gọi cùng đoạn ấy từ ngữ cảnh khác
// (thư viện cũ, dịch vụ Windows, tiện ích Office). Rồi nó treo, KHÔNG ngoại lệ.

// ❌ public IActionResult Get(int id)
//        => Ok(_service.GetCustomerAsync(id).Result);   // hoặc .Wait()

// ✓ Bất đồng bộ SUỐT CHUỖI, từ điểm vào tới tận truy vấn database.
public async Task<IActionResult> Get(int id, CancellationToken ct)
{
    // CancellationToken: khách đóng trình duyệt giữa lúc truy vấn nặng đang
    // chạy mà không truyền mã huỷ xuống thì database VẪN LÀM VIỆC cho một
    // kết quả không ai còn cần. Ở tải cao đây là lãng phí đáng kể.
    var customer = await _service.GetCustomerAsync(id, ct);
    return Ok(customer);
}

// ── BẪY 2: TẦNG ÁNH XẠ, BA CÁCH HỎNG — KHÔNG cái nào báo lỗi ─────────
//   truy vấn nhân lên : lấy 100 đơn rồi đọc order.Customer.Name
//                       ⇒ 1 + 100 truy vấn. Chữa: nạp kèm.
//   theo dõi thay đổi : lấy 10.000 dòng để xuất báo cáo ⇒ giữ BẢN SAO mọi
//                       dòng để so sánh ⇒ gấp đôi bộ nhớ dù không sửa gì.
//                       Chữa: đánh dấu truy vấn chỉ đọc.
//   lọc sai phía      : điều kiện dùng hàm không dịch được sang SQL ⇒ KÉO
//                       CẢ BẢNG về rồi mới lọc. Chạy trên 100 dòng, sập trên
//                       10 triệu. Chữa: bật ném lỗi khi đánh giá phía client.
//
// Điểm chung: chúng chỉ chậm dần và chỉ lộ ra khi dữ liệu đã lớn — tức là ở
// môi trường THẬT. Cách phòng chung: bật ghi nhật ký truy vấn lúc phát triển
// và THỈNH THOẢNG NHÌN VÀO ĐÓ.

CREATE TABLE orders (
    id            INT           PRIMARY KEY,
    customer_id   INT           NOT NULL REFERENCES customers(id),
    -- decimal, KHÔNG dùng double — đúng như bài Banking System đã chỉ ra.
    total_amount  DECIMAL(19,4) NOT NULL,
    currency      CHAR(3)       NOT NULL,
    status        VARCHAR(20)   NOT NULL,
    -- KHOÁ LẠC QUAN: hai nhân viên mở cùng một đơn, cùng sửa, người lưu sau
    -- GHI ĐÈ thay đổi của người trước mà KHÔNG AI BIẾT. Cột phiên bản khiến
    -- lần lưu thứ hai bị TỪ CHỐI và người dùng được hỏi.
    row_version   ROWVERSION    NOT NULL
);

CREATE TABLE customers (
    id           INT          PRIMARY KEY,
    -- Khoá của hệ thống cũ. KHÔNG được đổi — bạn không sở hữu nó.
    external_ref VARCHAR(64)  NOT NULL UNIQUE,
    name         NVARCHAR(200) NOT NULL,
    -- ⚠️ BẢN GHI CÓ HIỆU LỰC THEO THỜI GIAN. Doanh nghiệp thường cần biết dữ
    -- liệu TẠI MỘT THỜI ĐIỂM trong quá khứ: "địa chỉ khách này LÚC KÝ HỢP
    -- ĐỒNG là gì?" Ghi đè bản ghi làm mất khả năng trả lời câu đó VĨNH VIỄN.
    -- Đây là nguyên tắc chỉ-ghi-thêm ở hình thức thứ TÁM, và lần này lý do là
    -- YÊU CẦU NGHIỆP VỤ chứ không phải hiệu năng hay đồng bộ.
    valid_from   DATETIME2    NOT NULL,
    valid_to     DATETIME2    NULL
);

-- Chính là mẫu hình outbox từ Event-Driven Microservices. Nó có mặt ở đây vì
-- hệ thống doanh nghiệp gần như LUÔN phải báo cho hệ thống khác, và bài toán
-- ghi hai nơi KHÔNG đổi dù bạn có dùng microservices hay không.
CREATE TABLE outbox_messages (
    id           BIGINT      PRIMARY KEY,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type   VARCHAR(64) NOT NULL,
    payload      NVARCHAR(MAX) NOT NULL,
    published_at DATETIME2   NULL      -- NULL = chưa gửi
);

-- Bên gọi API của bạn là hệ thống của phòng ban khác hoặc công ty khác, có
-- lịch phát hành riêng — có khi mỗi quý một lần. Không có bảng này thì mọi
-- quyết định NGỪNG HỖ TRỢ phiên bản cũ đều là ĐOÁN.
CREATE TABLE api_call_log (
    id          BIGINT      PRIMARY KEY,
    client_id   VARCHAR(64) NOT NULL,
    api_version VARCHAR(16) NOT NULL,
    status_code INT         NOT NULL,
    duration_ms INT         NOT NULL
);`,

  schemaCodeEn: `// ── TRAP 1: .Result AND DEADLOCKS — a bug that does NOT appear locally ─
// The deadlock needs a synchronisation context forcing the continuation onto
// the very thread being blocked. Modern ASP.NET Core HAS NO such context, so
// the code below appears to work — until somebody calls it from a different
// context (an older library, a Windows service, an Office add-in). Then it
// hangs with NO exception.

// ❌ public IActionResult Get(int id)
//        => Ok(_service.GetCustomerAsync(id).Result);   // or .Wait()

// ✓ Async ALL THE WAY, from the entry point down to the database query.
public async Task<IActionResult> Get(int id, CancellationToken ct)
{
    // CancellationToken: a customer closes their browser mid-way through a
    // heavy query, and without propagating cancellation the database KEEPS
    // WORKING on a result nobody needs. Under load that is real waste.
    var customer = await _service.GetCustomerAsync(id, ct);
    return Ok(customer);
}

// ── TRAP 2: THE ORM, THREE FAILURES — NONE of which raise an error ────
//   query multiplication : fetch 100 orders then read order.Customer.Name
//                          ⇒ 1 + 100 queries. Fix: eager loading.
//   change tracking      : fetch 10,000 rows for a report ⇒ keeps a COPY of
//                          every row for comparison ⇒ double the memory
//                          though you edit nothing. Fix: read-only queries.
//   wrong-side filtering : a predicate using an untranslatable method ⇒ PULLS
//                          THE WHOLE TABLE into memory then filters. Works on
//                          100 rows, collapses on 10 million. Fix: throw on
//                          client-side evaluation.
//
// What they share: they merely get slower and only surface once data is large
// — meaning in PRODUCTION. The shared defence: enable query logging in
// development and LOOK AT IT OCCASIONALLY.

CREATE TABLE orders (
    id            INT           PRIMARY KEY,
    customer_id   INT           NOT NULL REFERENCES customers(id),
    -- decimal, NEVER double — exactly as the Banking System study showed.
    total_amount  DECIMAL(19,4) NOT NULL,
    currency      CHAR(3)       NOT NULL,
    status        VARCHAR(20)   NOT NULL,
    -- OPTIMISTIC LOCKING: two staff members open one order, both edit, and
    -- the second to save OVERWRITES the first's changes with NOBODY NOTICING.
    -- A version column makes the second save FAIL so the user can be asked.
    row_version   ROWVERSION    NOT NULL
);

CREATE TABLE customers (
    id           INT          PRIMARY KEY,
    -- The legacy system's key. It MUST NOT change — you do not own it.
    external_ref VARCHAR(64)  NOT NULL UNIQUE,
    name         NVARCHAR(200) NOT NULL,
    -- ⚠️ TEMPORALLY VALID RECORDS. Businesses routinely need data AS AT a
    -- past moment: "what was this customer's address WHEN THE CONTRACT WAS
    -- SIGNED?" Overwriting destroys the ability to answer that PERMANENTLY.
    -- This is append-only in its EIGHTH guise, and this time the reason is a
    -- BUSINESS REQUIREMENT rather than performance or convergence.
    valid_from   DATETIME2    NOT NULL,
    valid_to     DATETIME2    NULL
);

-- The outbox pattern from Event-Driven Microservices. It appears here because
-- enterprise systems nearly ALWAYS must inform other systems, and the
-- dual-write problem does NOT change whether or not you use microservices.
CREATE TABLE outbox_messages (
    id           BIGINT      PRIMARY KEY,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type   VARCHAR(64) NOT NULL,
    payload      NVARCHAR(MAX) NOT NULL,
    published_at DATETIME2   NULL      -- NULL = not yet sent
);

-- Your API's callers are another department's or another company's systems
-- with their own release calendars — sometimes quarterly. Without this table,
-- every DEPRECATION decision is GUESSWORK.
CREATE TABLE api_call_log (
    id          BIGINT      PRIMARY KEY,
    client_id   VARCHAR(64) NOT NULL,
    api_version VARCHAR(16) NOT NULL,
    status_code INT         NOT NULL,
    duration_ms INT         NOT NULL
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Đổi thứ tự ưu tiên: viết cho người kế nhiệm',
      titleEn: 'Reorder the priorities: write for whoever inherits it',
      description:
        'Hệ thống doanh nghiệp sống mười năm hoặc hơn, người viết ban đầu đã nghỉ từ lâu, phải tích hợp với những thứ không thể thay đổi, và sai thì có hậu quả pháp lý. Trong phần lớn lộ trình này mục tiêu là làm hệ thống chạy tốt; ở đây mục tiêu là làm hệ thống mà người khác ĐỌC ĐƯỢC sau năm năm. Điều đó đổi hẳn cách chọn giữa gọn gàng và tường minh.',
      descriptionEn:
        'Enterprise systems live a decade or more, their original authors long gone, integrating with things that cannot change, where mistakes carry legal consequences. Through most of this roadmap the goal was making systems work well; here it is making systems somebody else can READ in five years. That changes every choice between clever and explicit.',
    },
    {
      phase: 'BACKEND',
      title: 'Bất đồng bộ suốt chuỗi, và truyền mã huỷ xuống tận truy vấn',
      titleEn: 'Async all the way, with cancellation propagated to the query',
      description:
        '.Result và .Wait() là lỗi kinh điển KHÔNG xuất hiện trên máy bạn: bế tắc cần một bộ điều phối mà ASP.NET Core hiện đại không có, nên mã có vẻ chạy được cho tới khi ai đó gọi từ ngữ cảnh khác rồi nó treo không ngoại lệ. Kèm theo là CancellationToken: khách đóng trình duyệt mà không truyền mã huỷ xuống thì database vẫn làm việc cho kết quả không ai cần.',
      descriptionEn:
        '.Result and .Wait() are the classic failure that does NOT appear locally: the deadlock needs a synchronisation context modern ASP.NET Core lacks, so the code seems fine until somebody calls it from another context and it hangs with no exception. Alongside it, CancellationToken: without propagation, the database keeps working on results nobody needs.',
    },
    {
      phase: 'BACKEND',
      title: 'Ba bẫy của tầng ánh xạ, và cách phòng chung cho cả ba',
      titleEn: 'Three ORM traps, and the one defence covering all of them',
      description:
        'Truy vấn nhân lên do nạp muộn, theo dõi thay đổi trên truy vấn chỉ đọc, và điều kiện lọc bị đánh giá ở phía client kéo cả bảng về bộ nhớ. Điểm chung: KHÔNG cái nào báo lỗi — chúng chỉ chậm dần và chỉ lộ ra khi dữ liệu đã lớn, tức là ở môi trường thật. Cách phòng chung là bật ghi nhật ký truy vấn lúc phát triển và thỉnh thoảng nhìn vào đó.',
      descriptionEn:
        'Query multiplication from lazy loading, change tracking on read-only queries, and predicates evaluated client-side pulling whole tables into memory. What they share: NONE raises an error — they merely get slower and only surface once data is large, meaning in production. The shared defence is enabling query logging in development and actually looking at it.',
    },
    {
      phase: 'BACKEND',
      title: 'Ranh giới tầng có thật, kiểm bằng một câu hỏi',
      titleEn: 'Real layer boundaries, tested by one question',
      description:
        'Kiến trúc nhiều tầng đáng bị chê khi các tầng chỉ chuyển tiếp lời gọi. Phép thử để biết ranh giới có thật hay chỉ là thư mục: tầng miền có kiểm thử được mà KHÔNG khởi động gì không — không database, không máy chủ, không tệp cấu hình? Nếu phải khởi động thứ gì thì phụ thuộc đã rò ngược. Giá trị thật là quy tắc nghiệp vụ không dính vào khung ứng dụng bạn sẽ đổi trong mười năm tới.',
      descriptionEn:
        'Layered architecture deserves criticism when layers merely forward calls. The test for whether boundaries are real or just folders: can the domain layer be tested WITHOUT starting anything — no database, no server, no config? If something must start, dependencies have leaked backwards. The real value is business rules not entangled with the framework you will replace within ten years.',
    },
    {
      phase: 'BACKEND',
      title: 'Khoá lạc quan và bản ghi có hiệu lực theo thời gian',
      titleEn: 'Optimistic locking and temporally valid records',
      description:
        'Hai nhân viên mở cùng một đơn hàng, cùng sửa, người lưu sau ghi đè thay đổi của người trước mà không ai biết — cột phiên bản dòng khiến lần lưu thứ hai bị từ chối. Và doanh nghiệp thường cần biết dữ liệu tại một thời điểm quá khứ ("địa chỉ khách này lúc ký hợp đồng là gì"), nên ghi đè bản ghi làm mất khả năng trả lời câu đó vĩnh viễn — đây là chỉ-ghi-thêm ở hình thức thứ tám, lần này vì yêu cầu nghiệp vụ.',
      descriptionEn:
        'Two staff open one order, both edit, and the second to save overwrites the first with nobody noticing — a row version column makes the second save fail. And businesses routinely need data as at a past moment ("what was this address when the contract was signed"), so overwriting destroys that ability permanently — append-only in its eighth guise, this time for a business reason.',
    },
    {
      phase: 'BACKEND',
      title: 'Outbox: bài toán ghi hai nơi không cần microservices mới có',
      titleEn: 'The outbox: dual writes are not a microservices-only problem',
      description:
        'Hệ thống doanh nghiệp gần như luôn phải báo cho hệ thống khác — hệ thống kế toán, đối tác, cơ quan quản lý. Ghi database rồi mới gửi sự kiện thì tiến trình chết ở giữa sẽ để lại đơn hàng mà không ai biết. Mẫu hình outbox từ bài Event-Driven Microservices áp dụng nguyên vẹn ở đây, và điều đó cho thấy nó là hệ quả của RANH GIỚI MẠNG chứ không phải của kiến trúc microservices.',
      descriptionEn:
        'Enterprise systems nearly always must inform others — accounting systems, partners, regulators. Writing to the database then publishing means a process death in between leaves an order nobody knows about. The outbox pattern from the microservices study applies unchanged here, which shows it is a consequence of NETWORK BOUNDARIES rather than of microservice architecture.',
    },
    {
      phase: 'BACKEND',
      title: 'Đánh phiên bản: đo ai còn dùng trước khi ngừng hỗ trợ',
      titleEn: 'Versioning: measure who still uses it before deprecating',
      description:
        'Bên gọi API của bạn là hệ thống phòng ban khác hoặc công ty khác, có lịch phát hành riêng, có khi mỗi quý một lần — một khi đã công bố thì không được phá vỡ. Thêm trường bắt buộc, đổi tên trường, thu hẹp kiểu đều phá vỡ; và gây tranh cãi nhất là SỬA MỘT LỖI cũng có thể phá vỡ vì có người đã xây trên hành vi sai đó. Không có nhật ký gọi theo phiên bản thì mọi quyết định ngừng hỗ trợ đều là đoán.',
      descriptionEn:
        'Your API\'s callers are other departments or companies with their own release calendars, sometimes quarterly — once published, you may not break it. Adding required fields, renaming fields and narrowing types all break; and most contentiously, FIXING A BUG can break too, because somebody built on that behaviour. Without per-version call logs, every deprecation decision is guesswork.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng các phép kiểm đặc trưng của hệ thống sống lâu',
      titleEn: 'Verify with the checks that matter for long-lived systems',
      description:
        'grep toàn bộ mã nguồn không còn .Result hay .Wait() nào. Bật ném lỗi khi đánh giá phía client và yêu cầu toàn bộ kiểm thử vẫn xanh. Chạy kiểm thử tầng miền mà không khởi động database nào. Hai phiên cùng sửa một đơn thì người lưu sau bị từ chối. Và giết tiến trình ngay sau khi lưu đơn hàng — sự kiện vẫn phải được gửi sau khi khởi động lại.',
      descriptionEn:
        'Grep the codebase for any remaining .Result or .Wait(). Enable throwing on client-side evaluation and require the whole suite to stay green. Run domain tests without starting a database. Two sessions editing one order must refuse the second save. And kill the process right after saving an order — the event must still publish after restart.',
    },
  ],

  features: [
    { title: 'Kiến trúc nhiều tầng có ranh giới thật', titleEn: 'Layered architecture with real boundaries', description: 'Tầng miền kiểm thử được mà không khởi động database hay máy chủ.', descriptionEn: 'The domain layer is testable without starting a database or server.', status: 'PLANNED' },
    { title: 'Bất đồng bộ suốt chuỗi có mã huỷ', titleEn: 'Async all the way with cancellation', description: 'Không chặn ở đâu, và huỷ truyền xuống tận truy vấn database.', descriptionEn: 'Nothing blocks, and cancellation reaches the database query.', status: 'PLANNED' },
    { title: 'Truy cập dữ liệu tránh ba bẫy kinh điển', titleEn: 'Data access avoiding the three classic traps', description: 'Nạp kèm, truy vấn chỉ đọc, và ném lỗi khi đánh giá phía client.', descriptionEn: 'Eager loading, read-only queries, and throwing on client-side evaluation.', status: 'PLANNED' },
    { title: 'Khoá lạc quan cho sửa đồng thời', titleEn: 'Optimistic locking for concurrent edits', description: 'Người lưu sau bị từ chối kèm thông báo rõ, không ghi đè âm thầm.', descriptionEn: 'The second writer is refused with a clear message, never silently overwritten.', status: 'PLANNED' },
    { title: 'Bản ghi có hiệu lực theo thời gian', titleEn: 'Temporally valid records', description: 'Trả lời được "dữ liệu lúc đó là gì" — yêu cầu nghiệp vụ, không phải tính năng thêm.', descriptionEn: 'Answering "what was it then" — a business requirement, not an add-on.', status: 'PLANNED' },
    { title: 'Nhật ký kiểm toán đầy đủ', titleEn: 'A complete audit trail', description: 'Mọi thay đổi truy được ai, khi nào, đổi trường nào từ gì sang gì.', descriptionEn: 'Every change traces to who, when, which field, and from what to what.', status: 'PLANNED' },
    { title: 'Outbox cho tích hợp hệ thống ngoài', titleEn: 'An outbox for external integration', description: 'Sự kiện nằm cùng giao dịch với dữ liệu, không mất khi tiến trình chết.', descriptionEn: 'Events share the data transaction and survive a process death.', status: 'PLANNED' },
    { title: 'Đánh phiên bản API có đo lường sử dụng', titleEn: 'API versioning with usage measurement', description: 'Biết còn ai dùng phiên bản cũ trước khi quyết định ngừng hỗ trợ.', descriptionEn: 'Knowing who remains on old versions before deciding to deprecate.', status: 'PLANNED' },
    { title: 'Nhật ký có cấu trúc và chỉ số vận hành', titleEn: 'Structured logging and operational metrics', description: 'Truy vấn được lúc có sự cố, kèm mã tương quan xuyên hệ thống.', descriptionEn: 'Queryable during incidents, with a correlation id across systems.', status: 'PLANNED' },
  ],

  resources: [
    { title: '.NET — Async guidance and common pitfalls', titleEn: '.NET — Async guidance and common pitfalls', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/async-scenarios', type: 'LINK', description: 'Gồm cả lý do vì sao .Result gây bế tắc và vì sao lỗi đó không lộ ra lúc thử.', descriptionEn: 'Including why .Result deadlocks and why the bug hides during testing.' },
    { title: 'EF Core — Performance and query diagnostics', titleEn: 'EF Core — Performance and query diagnostics', url: 'https://learn.microsoft.com/en-us/ef/core/performance/', type: 'LINK', description: 'Nạp kèm, truy vấn chỉ đọc, và cách bật ném lỗi khi đánh giá phía client.', descriptionEn: 'Eager loading, no-tracking queries, and enabling throws on client-side evaluation.' },
    { title: 'Microsoft — Modern web app architecture (eShop reference)', titleEn: 'Microsoft — Modern web app architecture (eShop reference)', url: 'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/', type: 'LINK', description: 'Kiến trúc nhiều tầng có ví dụ chạy được, đọc để thấy ranh giới thật trông thế nào.', descriptionEn: 'Layered architecture with a working example, showing what real boundaries look like.' },
    { title: 'Microsoft — API versioning', titleEn: 'Microsoft — API versioning', url: 'https://learn.microsoft.com/en-us/aspnet/core/web-api/advanced/versioning', type: 'LINK', description: 'Các chiến lược đánh phiên bản và cách chọn theo kiểu bên gọi mà bạn có.', descriptionEn: 'Versioning strategies and choosing by the kind of callers you actually have.' },
    { title: 'Temporal tables in SQL Server', titleEn: 'Temporal tables in SQL Server', url: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables', type: 'LINK', description: 'Hỗ trợ sẵn cho bản ghi có hiệu lực theo thời gian — đỡ phải tự dựng.', descriptionEn: 'Built-in support for temporally valid records, saving you from rolling your own.' },
  ],

  coreKnowledge: [
    { vi: 'Bất đồng bộ suốt chuỗi và vì sao chặn luồng gây bế tắc', en: 'Async all the way, and why blocking causes deadlocks' },
    { vi: 'Tầng ánh xạ đối tượng–quan hệ: chỗ nó im lặng làm điều bạn không muốn', en: 'ORMs: where they silently do what you did not intend' },
    { vi: 'Kiến trúc theo tầng và phép thử ranh giới có thật hay không', en: 'Layered architecture and the test for whether boundaries are real' },
    { vi: 'Đồng thời ở tầng ứng dụng: khoá lạc quan', en: 'Application-level concurrency: optimistic locking' },
    { vi: 'Dữ liệu có chiều thời gian và câu hỏi "lúc đó là gì"', en: 'Temporal data and the "what was it then" question' },
    { vi: 'Đánh phiên bản API và quản lý vòng đời hợp đồng', en: 'API versioning and contract lifecycle management' },
    { vi: 'Khả năng kiểm toán như yêu cầu bắt buộc của miền nghiệp vụ', en: 'Auditability as a mandatory domain requirement' },
    { vi: 'Viết mã cho hệ thống sống mười năm và cho người kế nhiệm', en: 'Writing for ten-year systems and for whoever inherits them' },
  ],

  portfolioBonus: [
    { vi: 'Số đo truy vấn trước và sau khi sửa bẫy truy vấn nhân lên', en: 'Query counts before and after fixing query multiplication' },
    { vi: 'Kiểm thử tầng miền chạy trong vài giây mà không cần hạ tầng nào', en: 'Domain tests running in seconds with no infrastructure at all' },
    { vi: 'Video hai phiên cùng sửa một bản ghi và người sau bị từ chối', en: 'A video of two sessions editing one record with the second refused' },
    { vi: 'Bảng phân loại thay đổi API: cái nào phá vỡ, cái nào không, vì sao', en: 'A table classifying API changes: breaking, non-breaking, and why' },
    { vi: 'Truy vấn dữ liệu ở một mốc quá khứ, so với bản ghi hiện tại', en: 'A query of data as at a past date, compared with the current record' },
  ],

  completionOutcomes: [
    { vi: 'Viết được hệ thống mà người khác tiếp quản được sau nhiều năm', en: 'Write systems somebody else can take over years later' },
    { vi: 'Nhận ra các lỗi hiệu năng không báo lỗi mà chỉ chậm dần', en: 'Recognise performance bugs that raise no error and merely degrade' },
    { vi: 'Thiết kế hợp đồng API tồn tại lâu hơn phiên bản hiện tại', en: 'Design API contracts that outlive their current version' },
    { vi: 'Làm việc trong miền có yêu cầu kiểm toán và ràng buộc quy định', en: 'Work in domains with audit requirements and regulatory constraints' },
    { vi: 'Chọn tường minh thay vì gọn gàng khi hệ thống sống lâu', en: 'Choose explicit over clever when a system will live a long time' },
  ],

  bodyMdx,
  bodyMdxEn,
};
