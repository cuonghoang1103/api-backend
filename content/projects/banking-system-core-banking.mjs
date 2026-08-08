/**
 * Case-study 4.1 — Banking System (Core Banking).
 *
 * The first project where being wrong is not fixable by editing code. Three
 * lessons carry it: never floating point for money, double-entry as a
 * self-checking invariant (SUM of signed entries = 0, always), and write skew
 * — the concurrency bug that looks correct and that REPEATABLE READ permits.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./banking-system-core-banking.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./banking-system-core-banking.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'banking-system-core-banking',
  title: 'Banking System (Core Banking)',
  titleEn: 'Banking System (Core Banking)',
  description:
    'Sổ cái ghi kép, bất biến, tự kiểm tra được. Mọi dự án trước có chung một đặc điểm: sai thì sửa lại được. Ở đây cộng nhầm một dòng là tiền của người thật biến mất. Ngành ngân hàng đã giải bài này từ thế kỷ 15 — và lời giải đó vẫn là thứ tốt nhất chúng ta có.',
  descriptionEn:
    'An immutable, self-checking double-entry ledger. Every earlier project shares one property: if it is wrong, you can fix it. Here one mis-added row means a real person\'s money disappears. Banking solved this in the 15th century — and that solution is still the best we have.',
  techStack: [
    'Java 21', 'Spring Boot', 'PostgreSQL', 'NUMERIC / integer minor units',
    'SERIALIZABLE isolation', 'Kafka', 'Redis', 'Next.js 15', 'Docker',
  ],
  role: 'Backend / hệ thống tài chính (một người)',
  roleEn: 'Backend / financial systems (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- QUY TẮC SỐ MỘT: KHÔNG BAO GIỜ dùng số thực cho tiền.
--   >>> 0.1 + 0.2
--   0.30000000000000004
-- Không phải lỗi ngôn ngữ: số thực biểu diễn theo cơ số 2, và 0,1 hệ 10
-- là số TUẦN HOÀN VÔ HẠN trong hệ 2 — hệt như 1/3 = 0,333… trong hệ 10.
-- Nó bị cắt bớt, phần cắt tích luỹ dần. Một giao dịch thì không ai thấy;
-- mười triệu giao dịch một ngày thì thành con số phải giải trình.

CREATE TABLE ledger_entries (
    id             BIGSERIAL   PRIMARY KEY,
    transaction_id TEXT        NOT NULL REFERENCES transactions(id),
    account_id     TEXT        NOT NULL REFERENCES accounts(id),
    direction      VARCHAR(6)  NOT NULL CHECK (direction IN ('DEBIT','CREDIT')),
    -- SỐ NGUYÊN theo đơn vị nhỏ nhất: 15.000 VNĐ lưu là 1500000 (xu).
    -- Không có phần thập phân thì không có gì để làm tròn sai.
    amount_minor   BIGINT      NOT NULL CHECK (amount_minor > 0),
    -- Đơn vị tiền tệ PHẢI đi cùng số tiền, luôn luôn. Cộng 100 USD với
    -- 100 JPY không phải 200 của bất cứ thứ gì.
    currency       CHAR(3)     NOT NULL,
    -- Sửa sai = GHI THÊM bút toán đảo. KHÔNG BAO GIỜ UPDATE hay DELETE:
    -- kiểm toán viên phải thấy ĐÃ CÓ giao dịch và nó đã bị hoàn, chứ
    -- không phải thấy một sổ sạch bong.
    reverses_entry_id BIGINT   REFERENCES ledger_entries(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BẤT BIẾN TỰ KIỂM — phép kiểm rẻ nhất và mạnh nhất của cả hệ thống.
-- Chạy mỗi giờ. Khác 0 nghĩa là có lỗi ở đâu đó, và bạn biết NGAY
-- thay vì biết khi khách hàng gọi điện.
--   SELECT SUM(CASE direction WHEN 'CREDIT' THEN amount_minor
--                             ELSE -amount_minor END)
--     FROM ledger_entries;          -- PHẢI bằng 0, không ngoại lệ

CREATE TABLE accounts (
    id            TEXT        PRIMARY KEY,
    customer_id   TEXT        NOT NULL,
    currency      CHAR(3)     NOT NULL,
    type          VARCHAR(16) NOT NULL,
    status        VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    -- ⚠️ ĐIỂM CHỐT, KHÔNG phải nguồn sự thật. Nguồn sự thật luôn là tổng
    -- các bút toán. Hai cái lệch nhau thì SỔ CÁI ĐÚNG và điểm chốt sai,
    -- không bao giờ ngược lại. Ghi rõ ở đây vì sáu tháng sau sẽ có người
    -- viết mã tin vào cột này.
    balance_minor BIGINT      NOT NULL DEFAULT 0,
    -- Mạng lưới an toàn CUỐI CÙNG, dùng KÈM khoá chứ không thay khoá.
    CONSTRAINT balance_non_negative CHECK (balance_minor >= 0)
);

CREATE TABLE idempotency_keys (
    -- Do CLIENT sinh và GIỮ NGUYÊN khi thử lại.
    key            TEXT        PRIMARY KEY,
    -- Cùng khoá mà nội dung KHÁC = lỗi phía client, KHÔNG phải lần thử lại.
    -- Không có cột này thì client dùng lại khoá cũ cho một lệnh chuyển tiền
    -- KHÁC sẽ nhận kết quả cũ và tin rằng lệnh mới đã thành công —
    -- tiền không đi đâu cả mà cả hai bên đều tưởng nó đã đi.
    request_hash   VARCHAR(64) NOT NULL,
    transaction_id TEXT,
    status         VARCHAR(16) NOT NULL,
    expires_at     TIMESTAMPTZ NOT NULL
);

CREATE TABLE holds (
    id           TEXT        PRIMARY KEY,
    account_id   TEXT        NOT NULL REFERENCES accounts(id),
    amount_minor BIGINT      NOT NULL,
    -- Khách quẹt thẻ ở cây xăng, hệ thống giữ tạm, giao dịch thật không
    -- bao giờ tới. Không có hạn thì tiền khách kẹt VÔ THỜI HẠN — loại lỗi
    -- khiến khách rời đi và cơ quan quản lý gửi thư.
    expires_at   TIMESTAMPTZ NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'ACTIVE'
);

-- ⚠️ SAI LỆCH GHI — lỗi khó thấy nhất, và mã trông HOÀN TOÀN ĐÚNG.
-- Tài khoản có 100, hai lệnh rút 80 chạy cùng lúc. Mỗi lệnh đọc thấy 100,
-- kết luận 80 ≤ 100, cho phép. Kết quả: rút 160 từ tài khoản có 100.
-- Cả hai KHÔNG sửa cùng một dòng — chúng CHÈN hai dòng mới khác nhau —
-- nên không có xung đột ghi để database phát hiện, và kể cả REPEATABLE
-- READ của Postgres CŨNG CHO QUA.
-- Chữa: SERIALIZABLE (nhớ xử lý huỷ + thử lại), hoặc SELECT ... FOR UPDATE.`,

  schemaCodeEn: `-- RULE ONE: NEVER use floating point for money.
--   >>> 0.1 + 0.2
--   0.30000000000000004
-- Not a language defect: floats are base 2, and 0.1 in base 10 is an
-- INFINITELY REPEATING fraction in base 2 — exactly as 1/3 = 0.333… in
-- base 10. It gets truncated and the truncation accumulates. On one
-- transaction nobody notices; across ten million a day it becomes a
-- figure you must explain to a regulator.

CREATE TABLE ledger_entries (
    id             BIGSERIAL   PRIMARY KEY,
    transaction_id TEXT        NOT NULL REFERENCES transactions(id),
    account_id     TEXT        NOT NULL REFERENCES accounts(id),
    direction      VARCHAR(6)  NOT NULL CHECK (direction IN ('DEBIT','CREDIT')),
    -- INTEGER minor units: £150.00 is stored as 15000 (pence).
    -- With no decimal part there is nothing to round incorrectly.
    amount_minor   BIGINT      NOT NULL CHECK (amount_minor > 0),
    -- Currency MUST travel with the amount, always. Adding 100 USD to
    -- 100 JPY is not 200 of anything.
    currency       CHAR(3)     NOT NULL,
    -- Corrections are APPENDED as reversing entries. NEVER UPDATE or
    -- DELETE: an auditor must see that a transaction HAPPENED and was
    -- reversed, not a suspiciously clean set of books.
    reverses_entry_id BIGINT   REFERENCES ledger_entries(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- THE SELF-CHECKING INVARIANT — the cheapest, strongest check in the
-- system. Run it hourly. Non-zero means a fault somewhere, and you learn
-- IMMEDIATELY rather than when a customer telephones.
--   SELECT SUM(CASE direction WHEN 'CREDIT' THEN amount_minor
--                             ELSE -amount_minor END)
--     FROM ledger_entries;          -- MUST be zero, without exception

CREATE TABLE accounts (
    id            TEXT        PRIMARY KEY,
    customer_id   TEXT        NOT NULL,
    currency      CHAR(3)     NOT NULL,
    type          VARCHAR(16) NOT NULL,
    status        VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    -- ⚠️ A CHECKPOINT, NOT the source of truth. The source of truth is
    -- always the sum of entries. If they diverge, THE LEDGER IS RIGHT and
    -- the checkpoint is wrong — never the reverse. Stated here because in
    -- six months somebody will write code trusting this column.
    balance_minor BIGINT      NOT NULL DEFAULT 0,
    -- The LAST safety net, used ALONGSIDE locking rather than instead of it.
    CONSTRAINT balance_non_negative CHECK (balance_minor >= 0)
);

CREATE TABLE idempotency_keys (
    -- CLIENT-generated and KEPT IDENTICAL across retries.
    key            TEXT        PRIMARY KEY,
    -- Same key with a DIFFERENT body = a client bug, NOT a retry. Without
    -- this column, a client reusing an old key for a DIFFERENT transfer
    -- receives the old result and believes the new transfer succeeded —
    -- no money moved, and both sides think it did.
    request_hash   VARCHAR(64) NOT NULL,
    transaction_id TEXT,
    status         VARCHAR(16) NOT NULL,
    expires_at     TIMESTAMPTZ NOT NULL
);

CREATE TABLE holds (
    id           TEXT        PRIMARY KEY,
    account_id   TEXT        NOT NULL REFERENCES accounts(id),
    amount_minor BIGINT      NOT NULL,
    -- A customer taps their card at a fuel pump, funds are held, and the
    -- real transaction never arrives. Without expiry their money is
    -- trapped INDEFINITELY — the kind of failure that loses customers and
    -- attracts regulatory letters.
    expires_at   TIMESTAMPTZ NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'ACTIVE'
);

-- ⚠️ WRITE SKEW — the hardest bug to see, and the code looks ENTIRELY
-- CORRECT. An account holds 100; two withdrawals of 80 run concurrently.
-- Each reads 100, concludes 80 ≤ 100, proceeds. Result: 160 withdrawn
-- from an account holding 100. Neither transaction modified the same row
-- — they INSERTED two different new rows — so there is no write conflict
-- for the database to detect, and even Postgres REPEATABLE READ PERMITS IT.
-- Fix: SERIALIZABLE (remember to handle aborts + retry), or FOR UPDATE.`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Bỏ số thực khỏi mọi chỗ liên quan tới tiền',
      titleEn: 'Remove floating point from anything touching money',
      description:
        '0.1 + 0.2 không bằng 0.3, và đó không phải lỗi ngôn ngữ mà là hệ quả của biểu diễn cơ số 2. Sai số phần nghìn xu trên một giao dịch trở thành con số phải giải trình trên mười triệu giao dịch. Dùng số nguyên theo đơn vị nhỏ nhất hoặc NUMERIC. Và đơn vị tiền tệ phải đi kèm số tiền — kiểu dữ liệu nên khiến việc cộng USD với JPY KHÔNG BIÊN DỊCH ĐƯỢC.',
      descriptionEn:
        '0.1 + 0.2 is not 0.3, and that is not a language defect but a consequence of base-2 representation. A thousandth-of-a-cent error per transaction becomes a figure you explain to a regulator across ten million. Use integer minor units or NUMERIC. And currency must travel with the amount — your types should make adding USD to JPY FAIL TO COMPILE.',
    },
    {
      phase: 'DESIGN',
      title: 'Ghi kép: số dư là thứ TÍNH RA, không phải thứ lưu',
      titleEn: 'Double entry: a balance is COMPUTED, not stored',
      description:
        'UPDATE balance chạy được nhưng sai về thiết kế ba lần: không có lịch sử, không có bất biến tự kiểm, và không trả lời được câu "tiền này từ đâu tới" mà cơ quan quản lý chắc chắn sẽ hỏi. Ghi kép lưu các BÚT TOÁN cân nhau, và cho ra một bất biến toàn hệ thống: tổng mọi bút toán có dấu LUÔN bằng 0. Sức mạnh của nó không phải ngăn lỗi mà là làm lỗi TRỞ NÊN PHÁT HIỆN ĐƯỢC.',
      descriptionEn:
        'UPDATE balance works but is wrong by design three times: no history, no self-checking invariant, and no answer to "where did this money come from" which a regulator will certainly ask. Double entry stores BALANCED entries and yields a system-wide invariant: the sum of all signed entries is ALWAYS zero. Its power is not preventing errors but making them DETECTABLE.',
      codeBlock:
        "-- Phép kiểm rẻ nhất và mạnh nhất của cả hệ thống. Chạy mỗi giờ.\n"
        + "SELECT SUM(CASE direction WHEN 'CREDIT' THEN amount_minor\n"
        + '                          ELSE -amount_minor END)\n'
        + '  FROM ledger_entries;   -- PHẢI bằng 0, không ngoại lệ',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Sổ cái bất biến: sửa sai bằng bút toán đảo',
      titleEn: 'An immutable ledger: correct by reversal',
      description:
        'Bút toán đã ghi thì không bao giờ UPDATE hay DELETE. Đây là lần thứ TƯ nguyên tắc chỉ-ghi-thêm xuất hiện trong lộ trình — sau bia mộ CRDT, phân đoạn bất biến của công cụ tìm kiếm, và nhật ký của message broker — nhưng lý do ở đây khác hẳn: không phải hiệu năng hay đồng bộ mà là TRÁCH NHIỆM GIẢI TRÌNH. Cùng một cấu trúc, ba động cơ khác nhau.',
      descriptionEn:
        'A posted entry is never UPDATEd or DELETEd. This is the FOURTH appearance of append-only in this roadmap — after CRDT tombstones, immutable search segments, and the broker log — but the reason differs entirely: not performance or convergence but ACCOUNTABILITY. The same structure, three different motives.',
    },
    {
      phase: 'BACKEND',
      title: 'Sai lệch ghi: chỗ REPEATABLE READ không cứu bạn',
      titleEn: 'Write skew: where REPEATABLE READ does not save you',
      description:
        'Tài khoản có 100, hai lệnh rút 80 cùng lúc, mỗi lệnh đọc thấy 100 và cho phép — rút được 160. Nguy hiểm ở chỗ cả hai KHÔNG sửa cùng một dòng mà chèn hai dòng mới, nên không có xung đột ghi để database phát hiện và kể cả REPEATABLE READ cũng cho qua. Lỗi này không xuất hiện khi thử tay, chỉ xuất hiện dưới tải. Chữa bằng SERIALIZABLE có xử lý huỷ và thử lại, hoặc FOR UPDATE, cộng ràng buộc CHECK làm mạng lưới cuối.',
      descriptionEn:
        'An account holds 100, two withdrawals of 80 run concurrently, each reads 100 and proceeds — 160 withdrawn. The danger is that neither modified the same row; they inserted two new ones, so there is no write conflict to detect and even REPEATABLE READ permits it. It never appears in manual testing and only surfaces under load. Fix with SERIALIZABLE plus abort handling and retries, or FOR UPDATE, with a CHECK constraint as the final net.',
    },
    {
      phase: 'BACKEND',
      title: 'Khoá lặp lại do client sinh, và so mã băm nội dung',
      titleEn: 'Client-generated idempotency keys, with request hashing',
      description:
        'Mạng chập chờn thì client thử lại và tiền có thể chuyển hai lần. Client phải sinh khoá và giữ nguyên khi thử lại. Nhánh quan trọng nhất là so mã băm nội dung: cùng khoá mà nội dung khác là LỖI PHÍA CLIENT chứ không phải lần thử lại — trả về lỗi, tuyệt đối không xử lý và cũng không trả kết quả cũ, vì đó có thể là hai lệnh chuyển tiền hoàn toàn khác nhau.',
      descriptionEn:
        'A flaky network means the client retries and money can move twice. The client must generate the key and keep it stable across retries. The most important branch is the request-hash comparison: the same key with a different body is a CLIENT BUG, not a retry — return an error, never process it and never replay the old result, because it may be two entirely different transfers.',
      codeBlock:
        '# Cùng khoá nhưng nội dung KHÁC: lỗi client, không phải thử lại.\n'
        + 'if existing.request_hash != hash_request(req):\n'
        + '    raise IdempotencyKeyReused()      # 422 — KHÔNG trả kết quả cũ\n'
        + '\n'
        + "if existing.status == 'IN_PROGRESS':\n"
        + '    raise RequestInFlight()           # 409, client chờ rồi hỏi lại\n'
        + 'return load_result(existing.transaction_id)',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Sàng lọc TRƯỚC khi ghi bút toán, không phải sau',
      titleEn: 'Screen BEFORE writing entries, never after',
      description:
        'Tiền đã đi ra ngoài thì không gọi về được, nên sàng lọc chống rửa tiền và danh sách cấm phải chạy trước bước ghi bút toán. Chuyển liên ngân hàng cần một trạng thái chờ bên ngoài riêng, có thời hạn, và có bước đảo — vì một phần giao dịch nằm ngoài tầm kiểm soát của bạn, có khi hàng ngày. Đây chính là saga, nhưng bước bù trừ là một bút toán có hiệu lực pháp lý.',
      descriptionEn:
        'Money that has left cannot be recalled, so anti-money-laundering and sanctions screening must run before entries are written. Interbank transfers need their own external-pending state with a deadline and a reversal path — because part of the transaction sits outside your control, sometimes for days. This is a saga, except the compensating step is a reversing entry with legal weight.',
    },
    {
      phase: 'BACKEND',
      title: 'Điểm chốt số dư và đối soát hằng đêm',
      titleEn: 'Balance checkpoints with nightly reconciliation',
      description:
        'Tính số dư từ bút toán đầu tiên là đúng nhưng chậm dần theo năm. Chốt định kỳ rồi cộng phần phát sinh sau đó. Nhưng phải có công việc nền hằng đêm TÍNH LẠI TỪ ĐẦU và so với điểm chốt — lệch nhau là báo động ngay, đừng đợi khách hàng phát hiện hộ. Và nhớ: sổ cái đúng, điểm chốt sai, không bao giờ ngược lại.',
      descriptionEn:
        'Computing balances from the first entry is correct but degrades year over year. Checkpoint periodically and add what has happened since. But a nightly job must RECOMPUTE FROM SCRATCH and compare — any divergence raises an alarm immediately, rather than waiting for a customer to find it. And remember: the ledger is right, the checkpoint is wrong, never the reverse.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng bất biến và bằng tải đồng thời',
      titleEn: 'Verify by invariant and by concurrent load',
      description:
        'Tổng bút toán có dấu trên toàn sổ cái phải đúng bằng 0. Bắn 100 lệnh rút 80 đồng thời trên tài khoản có 100 — đúng MỘT lệnh thành công. Gửi cùng khoá lặp lại 50 lần — đúng một giao dịch. Nạp 1 triệu giao dịch với số lẻ 0,01 và 0,02 — tổng khớp tuyệt đối, không lệch một xu. Và thử UPDATE một dòng bút toán: database phải từ chối.',
      descriptionEn:
        'The signed-entry sum across the whole ledger must be exactly zero. Fire 100 concurrent withdrawals of 80 against an account holding 100 — exactly ONE succeeds. Send the same idempotency key 50 times — exactly one transaction. Load 1 million transactions with awkward amounts 0.01 and 0.02 — totals match exactly, not a penny out. And attempt to UPDATE a ledger row: the database must refuse.',
    },
  ],

  features: [
    { title: 'Sổ cái ghi kép bất biến', titleEn: 'An immutable double-entry ledger', description: 'Bút toán chỉ ghi thêm, sửa sai bằng bút toán đảo, tổng luôn bằng 0.', descriptionEn: 'Append-only entries, corrections by reversal, totals always zero.', status: 'PLANNED' },
    { title: 'Tiền tính bằng số nguyên đơn vị nhỏ nhất', titleEn: 'Money as integer minor units', description: 'Không số thực ở bất kỳ đâu, đơn vị tiền tệ luôn đi kèm số tiền.', descriptionEn: 'No floating point anywhere, currency always travelling with the amount.', status: 'PLANNED' },
    { title: 'Chuyển khoản nội bộ và liên ngân hàng', titleEn: 'Internal and interbank transfers', description: 'Trạng thái chờ bên ngoài riêng, có thời hạn và bước đảo.', descriptionEn: 'A dedicated external-pending state with deadlines and a reversal path.', status: 'PLANNED' },
    { title: 'Khoá lặp lại do client sinh', titleEn: 'Client-generated idempotency keys', description: 'So mã băm nội dung để khoá dùng lại cho lệnh khác bị từ chối.', descriptionEn: 'Request hashing so a key reused for a different transfer is refused.', status: 'PLANNED' },
    { title: 'Giữ tiền tạm có hạn tự nhả', titleEn: 'Authorisation holds with auto-release', description: 'Giao dịch thật không tới thì tiền khách không bị kẹt vĩnh viễn.', descriptionEn: 'When the real transaction never arrives, funds are not trapped forever.', status: 'PLANNED' },
    { title: 'Sàng lọc gian lận trước khi ghi bút toán', titleEn: 'Fraud screening before entries are posted', description: 'Chặn trước khi tiền rời tài khoản — sàng lọc sau là vô nghĩa.', descriptionEn: 'Block before money leaves — screening afterwards is meaningless.', status: 'PLANNED' },
    { title: 'Đối soát hằng đêm', titleEn: 'Nightly reconciliation', description: 'Tính lại số dư từ đầu và so với điểm chốt, lệch là báo động.', descriptionEn: 'Recompute balances from scratch against checkpoints; divergence alarms.', status: 'PLANNED' },
    { title: 'Nhật ký kiểm toán đầy đủ', titleEn: 'A complete audit trail', description: 'Mọi thay đổi số dư truy được tới ai làm và lệnh nào gây ra.', descriptionEn: 'Every balance change traces to who did it and which request caused it.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Martin Fowler — Accounting Patterns', titleEn: 'Martin Fowler — Accounting Patterns', url: 'https://martinfowler.com/eaaDev/AccountingNarrative.html', type: 'LINK', description: 'Ghi kép trình bày cho lập trình viên: tài khoản, bút toán, và vì sao số dư là kết quả tính.', descriptionEn: 'Double entry explained for programmers: accounts, entries, and why balances are derived.' },
    { title: 'A Critique of ANSI SQL Isolation Levels (Berenson et al.)', titleEn: 'A Critique of ANSI SQL Isolation Levels (Berenson et al.)', url: 'https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-95-51.pdf', type: 'PDF', description: 'Bài báo đặt tên cho sai lệch ghi và chỉ ra vì sao các mức cách ly tiêu chuẩn không đủ.', descriptionEn: 'The paper that named write skew and showed why the standard isolation levels fall short.' },
    { title: 'PostgreSQL — Transaction Isolation', titleEn: 'PostgreSQL — Transaction Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', type: 'LINK', description: 'Postgres nói rõ REPEATABLE READ cho phép sai lệch ghi và SERIALIZABLE bắt nó thế nào.', descriptionEn: 'Postgres states plainly that REPEATABLE READ allows write skew and how SERIALIZABLE catches it.' },
    { title: 'Stripe — Idempotent requests', titleEn: 'Stripe — Idempotent requests', url: 'https://docs.stripe.com/api/idempotent_requests', type: 'LINK', description: 'Cách một hệ thống thanh toán thật thiết kế khoá lặp lại, kể cả phần so nội dung yêu cầu.', descriptionEn: 'How a real payments system designs idempotency keys, including request comparison.' },
    { title: 'IEEE 754 and why 0.1 + 0.2 != 0.3', titleEn: 'IEEE 754 and why 0.1 + 0.2 != 0.3', url: 'https://docs.python.org/3/tutorial/floatingpoint.html', type: 'LINK', description: 'Giải thích ngắn gọn vì sao số thực không dùng được cho tiền — đọc một lần rồi nhớ mãi.', descriptionEn: 'A concise explanation of why floats cannot hold money — read once, remember forever.' },
  ],

  coreKnowledge: [
    { vi: 'Biểu diễn số của máy tính và vì sao số thực không dùng được cho tiền', en: 'Machine number representation and why floats cannot hold money' },
    { vi: 'Ghi kép: bất biến tự kiểm mạnh nhất mà một hệ thống tài chính có thể có', en: 'Double entry: the strongest self-checking invariant a financial system can have' },
    { vi: 'Mức cách ly giao dịch và các dị thường mà mỗi mức cho qua', en: 'Transaction isolation levels and the anomalies each one permits' },
    { vi: 'Sai lệch ghi: lỗi đồng thời mà mã trông hoàn toàn đúng', en: 'Write skew: the concurrency bug where the code looks entirely correct' },
    { vi: 'Tính lặp lại được có sự tham gia của client, và so nội dung yêu cầu', en: 'Client-participating idempotency, and comparing request bodies' },
    { vi: 'Dữ liệu chỉ ghi thêm vì lý do trách nhiệm giải trình, không phải hiệu năng', en: 'Append-only data for accountability rather than performance' },
    { vi: 'Nguồn sự thật và điểm chốt: khi nào phi chuẩn hoá là an toàn', en: 'Source of truth versus checkpoints: when denormalisation is safe' },
    { vi: 'Thiết kế cho kiểm toán: hệ thống phải giải thích được chính nó', en: 'Designing for audit: systems that can explain themselves' },
  ],

  portfolioBonus: [
    { vi: 'Phép kiểm bất biến chạy tự động, in ra tổng sổ cái sau mỗi lần chạy thử', en: 'An automated invariant check printing the ledger total after every test run' },
    { vi: 'Thí nghiệm sai lệch ghi: cùng mã, chạy ở ba mức cách ly, ba kết quả', en: 'A write-skew experiment: the same code at three isolation levels, three outcomes' },
    { vi: 'Kịch bản tải 100 lệnh rút đồng thời kèm ảnh chụp số dư cuối', en: 'A load scenario of 100 concurrent withdrawals with the final balance captured' },
    { vi: 'Video hoàn một giao dịch và chỉ ra sổ cái giữ CẢ HAI bút toán', en: 'A video reversing a transaction showing the ledger keeps BOTH entries' },
    { vi: 'Mục README về mô hình dữ liệu tiền tệ: vì sao số nguyên, vì sao kèm đơn vị', en: 'A README on the money model: why integers, and why currency travels with amounts' },
  ],

  completionOutcomes: [
    { vi: 'Viết được hệ thống mà sai sót có hậu quả không đảo ngược', en: 'Build systems where mistakes have irreversible consequences' },
    { vi: 'Hiểu mức cách ly đủ sâu để chọn đúng, không chỉ để nhắc tên', en: 'Understand isolation levels well enough to choose correctly, not merely name them' },
    { vi: 'Thiết kế bất biến tự kiểm thay vì trông chờ vào việc viết mã cẩn thận', en: 'Design self-checking invariants instead of relying on careful coding' },
    { vi: 'Coi khả năng kiểm toán là yêu cầu kiến trúc, không phải tính năng thêm vào', en: 'Treat auditability as an architectural requirement, not a bolt-on feature' },
    { vi: 'Làm việc được trong lĩnh vực có ràng buộc pháp lý và quy định', en: 'Work in domains with legal and regulatory constraints' },
  ],

  bodyMdx,
  bodyMdxEn,
};
