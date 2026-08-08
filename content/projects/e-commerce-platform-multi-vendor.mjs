/**
 * Case-study 2.1 — E-Commerce Platform (Multi-vendor).
 *
 * First project on the roadmap where a bug loses real money, so every decision
 * answers one question: if the process dies right now, is the system still
 * correct? Covers overselling, the order state machine, webhook idempotency,
 * and a double-entry ledger.
 *
 * Switches the language stack to Java + Spring Boot deliberately — it is the
 * dominant stack in commerce and finance, and Spring's transaction handling is
 * worth learning properly.
 *
 * Slug preserved from the existing production row.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./e-commerce-platform-multi-vendor.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./e-commerce-platform-multi-vendor.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'e-commerce-platform-multi-vendor',
  title: 'E-Commerce Platform (Multi-vendor)',
  titleEn: 'E-Commerce Platform (Multi-vendor)',
  description:
    'Sàn thương mại nhiều nhà bán trên Spring Boot — dự án đầu tiên mà một lỗi làm mất tiền thật. Chống bán quá số hàng, cỗ máy trạng thái đơn hàng, webhook thanh toán bình phương, sổ cái ghi kép bằng BigDecimal, và một đơn tách thành nhiều đơn con theo nhà bán.',
  descriptionEn:
    'A multi-vendor marketplace on Spring Boot — the first project where a bug loses real money. Oversell prevention, an order state machine, idempotent payment webhooks, a BigDecimal double-entry ledger, and one order split into per-vendor sub-orders.',
  techStack: [
    'Java 21', 'Spring Boot 3.4', 'Spring Data JPA', 'PostgreSQL', 'Redis',
    'Elasticsearch', 'Flyway', 'Stripe / VNPay', 'Docker', 'Next.js 15', 'JUnit 5',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- TIỀN LUÔN LÀ NUMERIC, KHÔNG BAO GIỜ LÀ float/double.
-- double không biểu diễn chính xác được 0.1; sai số một phần tỉ
-- mỗi giao dịch, nhân lên một triệu giao dịch là con số kế toán
-- không đối soát được.

CREATE TABLE orders (
    id               BIGSERIAL PRIMARY KEY,
    buyer_id         BIGINT      NOT NULL REFERENCES users(id),
    status           VARCHAR(24) NOT NULL,   -- cỗ máy trạng thái
    total_amount     NUMERIC(19,4) NOT NULL,
    -- Khách bấm "Đặt hàng" hai lần / mạng chập chờn gửi lại:
    -- ràng buộc UNIQUE chặn đơn trùng ở tầng database, không
    -- phải bằng một câu if trong service.
    idempotency_key  VARCHAR(64) NOT NULL UNIQUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Một đơn (giao dịch TIỀN) tách khỏi nhiều đơn con (đơn GIAO HÀNG).
-- Khách thấy một hoá đơn; mỗi nhà bán giao độc lập; hoàn tiền một
-- nhà bán không đụng tới hai nhà bán còn lại.
CREATE TABLE sub_orders (
    id                BIGSERIAL PRIMARY KEY,
    order_id          BIGINT      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id         BIGINT      NOT NULL REFERENCES vendors(id),
    status            VARCHAR(24) NOT NULL,
    subtotal          NUMERIC(19,4) NOT NULL,
    commission_amount NUMERIC(19,4) NOT NULL
);

-- Sổ cái GHI KÉP, chỉ THÊM dòng, không bao giờ UPDATE.
-- SUM(debit) - SUM(credit) trên toàn bảng LUÔN bằng 0. Lệch 0 là
-- có lỗi, và biết chính xác lỗi ở bút toán nào — thứ mà một cột
-- "balance" không bao giờ cho biết.
CREATE TABLE ledger_entries (
    id           BIGSERIAL PRIMARY KEY,
    sub_order_id BIGINT      NOT NULL REFERENCES sub_orders(id),
    account      VARCHAR(32) NOT NULL,   -- buyer|vendor|platform|gateway
    debit        NUMERIC(19,4) NOT NULL DEFAULT 0,
    credit       NUMERIC(19,4) NOT NULL DEFAULT 0,
    reference    VARCHAR(128),           -- id giao dịch ở cổng
    occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (debit >= 0 AND credit >= 0),
    CHECK (NOT (debit > 0 AND credit > 0))
);

CREATE TABLE variants (
    id         BIGSERIAL PRIMARY KEY,
    product_id BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku        VARCHAR(64)  NOT NULL UNIQUE,
    price      NUMERIC(19,4) NOT NULL,
    stock      INTEGER      NOT NULL DEFAULT 0,
    reserved   INTEGER      NOT NULL DEFAULT 0,
    -- Chốt chặn CUỐI CÙNG chống bán âm. Ngay cả khi mọi tầng code
    -- phía trên đều sai, database vẫn từ chối.
    CHECK (stock >= 0 AND reserved >= 0)
);

-- Chống webhook xử lý lặp: cổng thanh toán CÓ CHỦ Ý gửi lại khi
-- không nhận được 200. Ràng buộc UNIQUE không thể bị race, còn
-- "kiểm tra rồi ghi" thì có.
CREATE TABLE processed_events (
    event_id     VARCHAR(128) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaCodeEn: `-- MONEY IS ALWAYS NUMERIC, NEVER float/double.
-- double cannot represent 0.1 exactly; a billionth of error per
-- transaction, multiplied across a million transactions, becomes a
-- number accounting cannot reconcile.

CREATE TABLE orders (
    id               BIGSERIAL PRIMARY KEY,
    buyer_id         BIGINT      NOT NULL REFERENCES users(id),
    status           VARCHAR(24) NOT NULL,   -- state machine
    total_amount     NUMERIC(19,4) NOT NULL,
    -- Buyer double-clicks "Place order" / a flaky network retries:
    -- a UNIQUE constraint blocks the duplicate at the database
    -- layer, not with an if statement in a service.
    idempotency_key  VARCHAR(64) NOT NULL UNIQUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One order (the MONEY transaction) separate from many sub-orders
-- (the SHIPMENTS). The buyer sees one invoice; each vendor ships
-- independently; refunding one vendor leaves the other two alone.
CREATE TABLE sub_orders (
    id                BIGSERIAL PRIMARY KEY,
    order_id          BIGINT      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id         BIGINT      NOT NULL REFERENCES vendors(id),
    status            VARCHAR(24) NOT NULL,
    subtotal          NUMERIC(19,4) NOT NULL,
    commission_amount NUMERIC(19,4) NOT NULL
);

-- DOUBLE-ENTRY ledger: APPEND only, never UPDATE.
-- SUM(debit) - SUM(credit) across the table is ALWAYS zero. A
-- non-zero total means a bug, and points at the exact entry —
-- something a "balance" column can never tell you.
CREATE TABLE ledger_entries (
    id           BIGSERIAL PRIMARY KEY,
    sub_order_id BIGINT      NOT NULL REFERENCES sub_orders(id),
    account      VARCHAR(32) NOT NULL,   -- buyer|vendor|platform|gateway
    debit        NUMERIC(19,4) NOT NULL DEFAULT 0,
    credit       NUMERIC(19,4) NOT NULL DEFAULT 0,
    reference    VARCHAR(128),           -- gateway transaction id
    occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (debit >= 0 AND credit >= 0),
    CHECK (NOT (debit > 0 AND credit > 0))
);

CREATE TABLE variants (
    id         BIGSERIAL PRIMARY KEY,
    product_id BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku        VARCHAR(64)  NOT NULL UNIQUE,
    price      NUMERIC(19,4) NOT NULL,
    stock      INTEGER      NOT NULL DEFAULT 0,
    reserved   INTEGER      NOT NULL DEFAULT 0,
    -- The LAST line of defence against negative stock. Even if every
    -- layer of application code is wrong, the database still refuses.
    CHECK (stock >= 0 AND reserved >= 0)
);

-- Webhook deduplication: payment gateways retry DELIBERATELY when
-- they do not get a 200. A UNIQUE constraint cannot be raced;
-- "check then write" can.
CREATE TABLE processed_events (
    event_id     VARCHAR(128) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Đổi sang Java + Spring Boot, và vì sao đúng lúc này',
      titleEn: 'Switching to Java + Spring Boot, and why here',
      description:
        'Không phải đổi cho khác lạ: đây là stack thống trị mảng tài chính và thương mại điện tử ở các công ty lớn, và hệ sinh thái giao dịch của Spring (@Transactional, khoá JPA, quản lý isolation) là thứ đáng học nghiêm túc ở đúng dự án mà giao dịch quyết định tính đúng đắn.',
      descriptionEn:
        'Not variety for its own sake: this is the dominant stack in finance and commerce at large companies, and Spring\'s transaction ecosystem (@Transactional, JPA locking, isolation management) is worth learning properly in exactly the project where transactions decide correctness.',
    },
    {
      phase: 'DATABASE',
      title: 'Bán quá số hàng: đưa điều kiện vào cùng câu lệnh ghi',
      titleEn: 'Overselling: put the condition in the write statement',
      description:
        'Hai khách cùng mua món cuối: cả hai đọc stock = 1, cả hai thấy điều kiện đúng, cả hai ghi 0 — bán hai cái cho một món. Ba cách sửa với ba đánh đổi khác nhau: UPDATE có điều kiện (đơn giản nhất), khoá bi quan (đúng nhưng tuần tự hoá flash sale), giữ chỗ Redis (nhanh nhất, đổi lấy nhất quán cuối cùng).',
      descriptionEn:
        'Two buyers take the last unit: both read stock = 1, both pass the check, both write 0 — two sold, one existed. Three fixes with three different trade-offs: a conditional UPDATE (simplest), pessimistic locking (correct but serialises a flash sale), Redis reservations (fastest, at the cost of eventual consistency).',
      codeBlock:
        '// Điều kiện nằm TRONG câu lệnh ghi, nên database tự khoá dòng.\n'
        + '// Trả về 0 dòng = không đủ hàng. Không đọc trước, không có\n'
        + '// khoảng trống cho hai request cùng lọt.\n'
        + '@Modifying\n'
        + '@Query("""\n'
        + '    UPDATE Variant v\n'
        + '       SET v.stock = v.stock - :qty\n'
        + '     WHERE v.id = :id\n'
        + '       AND v.stock >= :qty\n'
        + '    """)\n'
        + 'int decreaseStock(@Param("id") Long id, @Param("qty") int qty);',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Cỗ máy trạng thái đơn hàng, kiểm ở đúng một chỗ',
      titleEn: 'The order state machine, validated in exactly one place',
      description:
        'Đơn hàng không phải một cột status muốn gán gì thì gán. Bảng chuyển tiếp hợp lệ khai báo rõ, kiểm trong service chứ không rải rác ở controller — vì quy tắc lặp ở năm nơi sẽ bị bỏ sót ở một nơi khi thêm trạng thái mới. Và tiền chỉ chuyển cho nhà bán khi hết hạn trả hàng, không phải lúc khách thanh toán.',
      descriptionEn:
        'An order is not a status column you assign freely. An explicit transition table, validated in the service rather than scattered across controllers — a rule duplicated in five places will be missed in one when a status is added. And vendors are paid when the return window closes, not when the buyer pays.',
      codeBlock:
        '// Thiếu bảng này, một bug sẽ đưa đơn từ REFUNDED ngược về PAID,\n'
        + '// và bạn phát hiện vào lúc đối soát cuối tháng — nếu may mắn.\n'
        + 'private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED = Map.of(\n'
        + '    PENDING_PAYMENT, EnumSet.of(PAID, CANCELLED, EXPIRED),\n'
        + '    PAID,            EnumSet.of(PREPARING, REFUNDING),\n'
        + '    DELIVERED,       EnumSet.of(RETURN_REQUESTED, COMPLETED),\n'
        + '    REFUNDING,       EnumSet.of(REFUNDED)\n'
        + ');',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Webhook thanh toán: chữ ký, chống lặp, một giao dịch',
      titleEn: 'Payment webhooks: signature, dedup, one transaction',
      description:
        'Cổng thanh toán CÓ CHỦ Ý gửi lại webhook khi không nhận được 200. Ba bước bắt buộc: xác thực chữ ký trước mọi thứ (thiếu nó, ai biết URL cũng "thanh toán" được mọi đơn bằng curl), chống lặp bằng ràng buộc UNIQUE chứ không phải câu if, và gói toàn bộ trong một giao dịch để chết giữa chừng thì cuộn lại sạch.',
      descriptionEn:
        'Gateways retry webhooks DELIBERATELY when they do not receive a 200. Three mandatory steps: verify the signature first (without it, anyone who knows the URL can "pay" for every order with curl), deduplicate with a UNIQUE constraint rather than an if, and wrap everything in one transaction so a crash rolls back cleanly.',
      codeBlock:
        '// Hai webhook tới cùng lúc trên hai tiến trình: cả hai cùng\n'
        + '// kiểm "đã xử lý chưa", cả hai cùng thấy "chưa", cả hai cùng\n'
        + '// cộng tiền. Ràng buộc UNIQUE thì KHÔNG THỂ lọt.\n'
        + 'try {\n'
        + '    processedEventRepository.save(new ProcessedEvent(payload.eventId()));\n'
        + '} catch (DataIntegrityViolationException dup) {\n'
        + '    return;   // trả 200 để cổng ngừng gửi lại\n'
        + '}',
      codeLang: 'java',
    },
    {
      phase: 'DATABASE',
      title: 'Sổ cái ghi kép: BigDecimal, chỉ thêm dòng, tổng luôn bằng 0',
      titleEn: 'Double-entry ledger: BigDecimal, append-only, always sums to zero',
      description:
        'double không biểu diễn chính xác 0.1 — sai số một phần tỉ mỗi giao dịch, nhân lên một triệu giao dịch thành con số kế toán không đối soát được. Và tiền không nên là một cột balance cộng trừ: mỗi đồng dịch chuyển tạo hai dòng (nợ/có), tổng toàn bảng luôn bằng 0, lệch là biết ngay lỗi ở bút toán nào.',
      descriptionEn:
        'double cannot represent 0.1 exactly — a billionth per transaction, multiplied by a million, becomes unreconcilable. And money should not be a balance column: every movement writes two rows (debit/credit), the table always sums to zero, and a non-zero total points straight at the faulty entry.',
    },
    {
      phase: 'BACKEND',
      title: 'Một đơn nhiều nhà bán: tách giao dịch tiền khỏi đơn giao hàng',
      titleEn: 'One order, many vendors: split money from fulfilment',
      description:
        'Khách trả tiền một lần nhưng ba nhà bán giao độc lập. Order giữ giao dịch tiền, SubOrder giữ trạng thái giao hàng theo từng nhà bán. Nhờ đó hoàn tiền một phần trở nên tự nhiên: SubOrder của nhà bán A chuyển sang REFUNDING trong khi hai đơn còn lại đi tiếp bình thường.',
      descriptionEn:
        'The buyer pays once but three vendors ship independently. Order holds the money transaction, SubOrder holds per-vendor fulfilment state. Partial refunds then fall out naturally: vendor A\'s SubOrder moves to REFUNDING while the other two continue normally.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng 200 người mua đồng thời và webhook gửi lại 10 lần',
      titleEn: 'Verify with 200 concurrent buyers and 10 webhook replays',
      description:
        'Ba phép thử quyết định: 200 request đồng thời cho món cuối cùng phải cho đúng 1 đơn thành công; gửi lại một webhook 10 lần thì số dư chỉ tăng một lần; và SUM(debit) - SUM(credit) trên sổ cái phải bằng đúng 0 sau mọi kịch bản.',
      descriptionEn:
        'Three decisive checks: 200 concurrent requests for the last unit must yield exactly 1 success; replaying one webhook 10 times must move the balance once; and SUM(debit) - SUM(credit) over the ledger must be exactly zero after every scenario.',
    },
  ],

  features: [
    { title: 'Nhiều nhà bán, mỗi nhà một bảng điều khiển', titleEn: 'Multiple vendors with their own dashboards', description: 'Gian hàng, sản phẩm, đơn hàng và doanh thu tách biệt theo nhà bán.', descriptionEn: 'Storefront, products, orders and revenue scoped per vendor.', status: 'PLANNED' },
    { title: 'Sản phẩm có biến thể và tồn kho riêng', titleEn: 'Products with variants and per-variant stock', description: 'Màu, kích cỡ, SKU riêng; tồn kho trừ bằng UPDATE có điều kiện.', descriptionEn: 'Colour, size, distinct SKUs; stock decremented by conditional UPDATE.', status: 'PLANNED' },
    { title: 'Giữ chỗ tồn kho có hạn 15 phút', titleEn: '15-minute stock reservations', description: 'Bỏ giỏ thì job nền trả tồn kho về, không để hàng kẹt vĩnh viễn.', descriptionEn: 'Abandoned carts release stock via a background job instead of holding it forever.', status: 'PLANNED' },
    { title: 'Thanh toán qua cổng thật, webhook bình phương', titleEn: 'Real gateway payments with idempotent webhooks', description: 'Xác thực chữ ký, chống lặp bằng ràng buộc UNIQUE, xử lý trong một giao dịch.', descriptionEn: 'Signature verification, UNIQUE-constraint deduplication, one transaction.', status: 'PLANNED' },
    { title: 'Một đơn tách thành nhiều đơn con theo nhà bán', titleEn: 'One order split into per-vendor sub-orders', description: 'Khách thấy một hoá đơn, mỗi nhà bán giao độc lập.', descriptionEn: 'One invoice for the buyer, independent fulfilment per vendor.', status: 'PLANNED' },
    { title: 'Sổ cái ghi kép và đối soát', titleEn: 'Double-entry ledger and reconciliation', description: 'Chỉ thêm dòng; tổng nợ trừ có luôn bằng 0, lệch là phát hiện ngay.', descriptionEn: 'Append-only; debits minus credits always zero, so drift is detected immediately.', status: 'PLANNED' },
    { title: 'Hoàn tiền toàn phần và một phần', titleEn: 'Full and partial refunds', description: 'Hoàn theo từng đơn con, không ảnh hưởng các nhà bán khác.', descriptionEn: 'Refund per sub-order without touching the other vendors.', status: 'PLANNED' },
    { title: 'Chuyển tiền nhà bán sau khi hết hạn trả hàng', titleEn: 'Vendor payout after the return window', description: 'Chuyển sớm thì khi khách trả hàng phải đi đòi lại tiền từ nhà bán.', descriptionEn: 'Paying earlier means chasing vendors for money back when a buyer returns an item.', status: 'PLANNED' },
    { title: 'Tìm kiếm sản phẩm bằng Elasticsearch', titleEn: 'Product search on Elasticsearch', description: 'Lọc theo thuộc tính, khoảng giá, và xếp hạng theo độ liên quan.', descriptionEn: 'Attribute and price-range filtering with relevance ranking.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Spring — Transaction Management', titleEn: 'Spring — Transaction Management', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction.html', type: 'LINK', description: 'Đọc kỹ mục propagation và isolation — hai thứ quyết định tính đúng đắn ở đây.', descriptionEn: 'Focus on propagation and isolation — the two things that decide correctness here.' },
    { title: 'Stripe — Webhooks best practices', titleEn: 'Stripe — Webhooks best practices', url: 'https://docs.stripe.com/webhooks', type: 'LINK', description: 'Phần "Handle duplicate events" giải thích vì sao gửi lại là thiết kế chứ không phải lỗi.', descriptionEn: 'The "Handle duplicate events" section explains why retries are by design, not a bug.' },
    { title: 'Martin Fowler — Accounting Patterns', titleEn: 'Martin Fowler — Accounting Patterns', url: 'https://martinfowler.com/eaaDev/AccountingNarrative.html', type: 'LINK', description: 'Vì sao sổ cái ghi kép chống được cả lỗi lập trình lẫn lỗi vận hành.', descriptionEn: 'Why a double-entry ledger catches both programming and operational errors.' },
    { title: 'PostgreSQL — Explicit Locking', titleEn: 'PostgreSQL — Explicit Locking', url: 'https://www.postgresql.org/docs/current/explicit-locking.html', type: 'LINK', description: 'SELECT FOR UPDATE và các mức khoá — đọc trước khi chọn khoá bi quan.', descriptionEn: 'SELECT FOR UPDATE and lock levels — read before reaching for pessimistic locking.' },
    { title: 'OWASP — Business Logic Vulnerabilities', titleEn: 'OWASP — Business Logic Vulnerabilities', url: 'https://owasp.org/www-community/vulnerabilities/Business_logic_vulnerability', type: 'LINK', description: 'Loại lỗ hổng mà quét tự động không tìm ra: giá âm, số lượng âm, đổi trạng thái sai.', descriptionEn: 'The class of holes scanners never find: negative prices, negative quantities, illegal state jumps.' },
  ],

  coreKnowledge: [
    { vi: 'Giao dịch cơ sở dữ liệu: propagation, isolation, và khi nào cần khoá', en: 'Database transactions: propagation, isolation, and when locking is needed' },
    { vi: 'Điều kiện tranh chấp trong hệ thống nhiều người dùng, và ba cách chặn khác nhau', en: 'Race conditions in multi-user systems, and three different ways to block them' },
    { vi: 'Tính bình phương (idempotency): vì sao mọi webhook đều phải chịu được chạy lại', en: 'Idempotency: why every webhook must survive being replayed' },
    { vi: 'Cỗ máy trạng thái: mô hình hoá vòng đời nghiệp vụ thay vì một cột tự do', en: 'State machines: modelling a business lifecycle instead of a free-form column' },
    { vi: 'Sổ cái ghi kép, và vì sao BigDecimal là bắt buộc với tiền', en: 'Double-entry bookkeeping, and why BigDecimal is mandatory for money' },
    { vi: 'Nhất quán tức thời và nhất quán cuối cùng — chọn cái nào cho tồn kho', en: 'Strong versus eventual consistency — which one inventory needs' },
    { vi: 'Tách giao dịch tiền khỏi quy trình giao hàng ở tầng mô hình dữ liệu', en: 'Separating the money transaction from the fulfilment process in the data model' },
    { vi: 'Ràng buộc CHECK ở database làm chốt chặn cuối cùng khi code sai', en: 'Database CHECK constraints as the last line of defence when code is wrong' },
    { vi: 'JPA/Hibernate: lazy loading, N+1 query, và cách phát hiện chúng', en: 'JPA/Hibernate: lazy loading, N+1 queries, and how to detect them' },
    { vi: 'Kiểm thử đồng thời: viết test thật sự chạy song song để bắt race condition', en: 'Concurrency testing: writing tests that genuinely run in parallel to catch races' },
  ],

  portfolioBonus: [
    { vi: 'Bài test đồng thời 200 luồng chứng minh không bán quá số hàng, commit trong repo', en: 'A 200-thread concurrency test proving no overselling, committed in the repo' },
    { vi: 'Sơ đồ trạng thái đơn hàng đính kèm README, khớp đúng bảng ALLOWED trong code', en: 'The order state diagram in the README, matching the ALLOWED table in code' },
    { vi: 'Script đối soát sổ cái chạy hằng đêm, báo động khi tổng khác 0', en: 'A nightly ledger reconciliation script that alerts when the total is non-zero' },
    { vi: 'Môi trường sandbox thanh toán chạy được, người xem tự đặt thử đơn hàng', en: 'A working payment sandbox so a visitor can place a test order themselves' },
    { vi: 'Tài liệu mô tả rõ tiền đi đường nào, từ khách tới nhà bán, qua từng bút toán', en: 'Documentation tracing the money path from buyer to vendor, entry by entry' },
    { vi: 'Kiểm thử tải flash sale bằng k6, kèm số liệu trước và sau khi tối ưu', en: 'A k6 flash-sale load test with before/after numbers' },
  ],

  completionOutcomes: [
    { vi: 'Viết code xử lý tiền mà không mất tiền khi có lỗi hoặc khi tiến trình chết', en: 'Write money-handling code that stays correct through errors and crashes' },
    { vi: 'Nhận ra race condition khi đọc code, trước khi nó lên production', en: 'Recognise race conditions while reading code, before they reach production' },
    { vi: 'Thiết kế API bình phương cho mọi tích hợp bên thứ ba', en: 'Design idempotent APIs for every third-party integration' },
    { vi: 'Mô hình hoá quy trình nghiệp vụ phức tạp bằng cỗ máy trạng thái tường minh', en: 'Model complex business processes with an explicit state machine' },
    { vi: 'Giải thích được đánh đổi giữa khoá bi quan, khoá lạc quan và giữ chỗ tạm', en: 'Explain the trade-offs between pessimistic locking, optimistic locking and reservations' },
    { vi: 'Đối soát tài chính và chứng minh hệ thống không làm mất một đồng nào', en: 'Reconcile finances and prove the system has not lost a single unit of currency' },
  ],

  bodyMdx,
  bodyMdxEn,
};
