import type { Chapter } from './types';

/**
 * Chương 7 — sửa dữ liệu và transaction.
 *
 * Chương duy nhất trong tám chương nền mà làm sai thì MẤT DỮ LIỆU THẬT, nên nó
 * mở đầu bằng quy tắc an toàn (chạy SELECT trước khi chạy DELETE) chứ không
 * phải bằng cú pháp. Widget `txn-sim` để người học tự thấy điều mà đọc chữ
 * không thấy được: dữ liệu chưa COMMIT thì người khác KHÔNG nhìn thấy.
 */
export const CH07: Chapter = {
  no: 7,
  slug: 'insert-update-delete-transaction',
  title: 'Thêm, sửa, xoá & Transaction',
  icon: '✍️',
  tagline: 'Chương đầu tiên mà gõ sai một chữ là mất dữ liệu thật',
  minutes: 50,
  goals: [
    'Viết INSERT / UPDATE / DELETE an toàn, luôn kèm WHERE',
    'Lấy lại dòng vừa tạo bằng RETURNING mà không cần query thêm lần nữa',
    'Dùng UPSERT (ON CONFLICT) để "có thì sửa, chưa có thì thêm"',
    'Giải thích ACID bằng ví dụ chuyển tiền',
    'Dùng BEGIN / COMMIT / ROLLBACK và biết dữ liệu chưa commit thì ai thấy được',
  ],
  labModuleId: 865,
  labModuleName: 'Modifying Data & Transactions',
  labCount: 10,
  labPicks: [
    { slug: 'insert-multiple-rows-with-returning', title: 'Insert Multiple Rows with RETURNING', vi: 'Thêm nhiều dòng kèm RETURNING' },
    { slug: 'upsert-with-on-conflict', title: 'Upsert with ON CONFLICT', vi: 'Upsert bằng ON CONFLICT' },
    { slug: 'a-transaction-all-or-nothing', title: 'A Transaction: All or Nothing', vi: 'Transaction: được cả hoặc không gì cả' },
    { slug: 'capstone-a-safe-stock-and-order-transaction', title: 'Capstone: A Safe Stock-and-Order Transaction', vi: 'Tổng hợp: transaction trừ kho an toàn' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'note',
      tone: 'danger',
      title: 'Đọc dòng này trước khi đọc bất cứ dòng nào khác',
      text:
        '`UPDATE` và `DELETE` **không có nút hoàn tác**. Quên `WHERE` một lần là sửa hoặc xoá toàn bộ bảng. '
        + 'Quy tắc bất di bất dịch: viết `SELECT` với đúng điều kiện đó trước, nhìn kết quả, '
        + 'rồi mới đổi chữ `SELECT *` thành `DELETE` / `UPDATE`.',
    },

    { kind: 'h', text: 'INSERT — thêm dòng' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- Một dòng
INSERT INTO products (name, slug, price, stock)
VALUES ('Bàn phím cơ', 'ban-phim-co', 1200000, 14);

-- Nhiều dòng cùng lúc — nhanh hơn hẳn chạy nhiều câu riêng lẻ
INSERT INTO products (name, slug, price, stock)
VALUES ('Chuột không dây', 'chuot-khong-day', 350000, 40),
       ('Tai nghe',        'tai-nghe',        890000, 27),
       ('Webcam',          'webcam',         1450000,  8);`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Luôn liệt kê tên cột',
      text:
        '`INSERT INTO products VALUES (…)` không ghi tên cột thì phụ thuộc vào **thứ tự cột trong bảng**. '
        + 'Hôm nào có người thêm một cột vào giữa, mọi câu INSERT kiểu đó hỏng cùng lúc — mà thường là hỏng âm thầm, '
        + 'ghi giá vào cột số lượng chẳng hạn.',
    },

    { kind: 'h', text: 'RETURNING — lấy lại dòng vừa ghi' },
    {
      kind: 'code',
      lang: 'sql',
      code: `INSERT INTO products (name, slug, price)
VALUES ('Màn hình 27"', 'man-hinh-27', 5900000)
RETURNING id, name, created_at;`,
    },
    {
      kind: 'p',
      text:
        'Vì `id` do database sinh ra, nếu không có `RETURNING` bạn phải chạy thêm một câu `SELECT` để biết nó. '
        + '`RETURNING` dùng được với cả `UPDATE` và `DELETE` — rất tiện để ghi nhật ký thứ vừa bị xoá.',
    },
    {
      kind: 'mssql',
      text: 'Lấy lại dòng vừa ghi:',
      pg: "INSERT INTO products (...) VALUES (...) RETURNING id, name;",
      ms: "INSERT INTO products (...) OUTPUT INSERTED.id, INSERTED.name VALUES (...);\n-- hoặc lấy id vừa sinh: SELECT SCOPE_IDENTITY();",
    },

    { kind: 'h', text: 'UPDATE — sửa dòng' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- ① Kiểm tra trước: câu này sẽ đụng vào những dòng nào?
SELECT id, name, price FROM products WHERE category = 'phu-kien';

-- ② Yên tâm rồi thì mới sửa
UPDATE products
SET price      = price * 1.1,      -- dùng được giá trị hiện tại của chính cột đó
    updated_at = now()
WHERE category = 'phu-kien'
RETURNING id, name, price;`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Không có WHERE nghĩa là TẤT CẢ',
      text:
        '`UPDATE products SET price = 0;` sẽ đặt giá 0 cho **mọi sản phẩm**, không hỏi lại, không cảnh báo. '
        + 'Nhiều công cụ (DBeaver, TablePlus) có chế độ chặn UPDATE/DELETE thiếu WHERE — hãy bật nó lên.',
    },

    { kind: 'h', text: 'DELETE — xoá dòng' },
    {
      kind: 'code',
      lang: 'sql',
      code: `DELETE FROM products
WHERE stock = 0 AND is_active = false
RETURNING id, name;`,
    },
    {
      kind: 'table',
      head: ['Lệnh', 'Làm gì', 'Hoàn tác được?', 'Kích hoạt trigger?'],
      rows: [
        ['`DELETE FROM t WHERE …`', 'Xoá dòng thoả điều kiện', '✅ Nếu trong transaction', '✅ Có'],
        ['`DELETE FROM t`', 'Xoá mọi dòng, từng dòng một', '✅ Nếu trong transaction', '✅ Có'],
        ['`TRUNCATE t`', 'Xoá sạch bảng tức thì', '✅ Trong Postgres, nếu ở trong transaction', '❌ Không'],
        ['`DROP TABLE t`', 'Xoá luôn cả cấu trúc bảng', '✅ Trong Postgres, nếu ở trong transaction', '—'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Một điểm PostgreSQL hơn hẳn MySQL',
      text:
        'Trong Postgres, lệnh thay đổi cấu trúc (DDL) như `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE` '
        + '**nằm trong transaction được**. Nghĩa là một migration chạy dở nửa chừng bị lỗi sẽ hoàn nguyên sạch sẽ. '
        + 'MySQL thì tự động commit trước mỗi lệnh DDL, nên migration hỏng để lại schema nửa vời. '
        + 'SQL Server cũng hỗ trợ DDL trong transaction giống Postgres.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Xoá mềm — cách nhiều hệ thống thật dùng',
      text:
        'Thay vì `DELETE`, thêm cột `deleted_at timestamptz` và `UPDATE` nó thành `now()`. '
        + 'Dữ liệu vẫn còn để đối chiếu, khôi phục được, và không làm gãy khoá ngoại của bảng khác. '
        + 'Đổi lại: mọi câu query từ đó phải nhớ thêm `WHERE deleted_at IS NULL` — hãy bọc bằng view (chương 13) cho khỏi quên.',
    },

    { kind: 'h', text: 'UPSERT — có thì sửa, chưa có thì thêm' },
    {
      kind: 'code',
      lang: 'sql',
      code: `INSERT INTO products (slug, name, price)
VALUES ('ban-phim-co', 'Bàn phím cơ 2026', 1350000)
ON CONFLICT (slug)                 -- khi đụng ràng buộc UNIQUE trên cột slug
DO UPDATE SET name       = EXCLUDED.name,
              price      = EXCLUDED.price,
              updated_at = now()
RETURNING id, slug, price;

-- Muốn bỏ qua thay vì cập nhật:
INSERT INTO products (slug, name, price)
VALUES ('ban-phim-co', 'Bàn phím cơ', 1200000)
ON CONFLICT (slug) DO NOTHING;`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: '`EXCLUDED` là gì',
      text:
        'Là bảng ảo chứa **dòng bạn vừa định thêm vào nhưng bị từ chối**. '
        + 'Nên `EXCLUDED.price` chính là giá mới trong câu `VALUES`, còn `products.price` là giá cũ đang nằm trong bảng.',
    },
    {
      kind: 'mssql',
      text: 'Upsert — đây là chỗ hai hệ khác nhau nhiều nhất về cú pháp:',
      pg: 'INSERT … ON CONFLICT (slug) DO UPDATE SET …',
      ms: 'MERGE INTO products AS t\nUSING (VALUES (…)) AS s(slug, name)\n  ON t.slug = s.slug\nWHEN MATCHED THEN UPDATE SET …\nWHEN NOT MATCHED THEN INSERT (…) VALUES (…);',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'MERGE của SQL Server có tiếng là hay lỗi',
      text:
        'Nhiều chuyên gia SQL Server khuyên tránh `MERGE` vì lịch sử lỗi cạnh tranh của nó. '
        + '`ON CONFLICT` của Postgres đơn giản và an toàn hơn nhiều — đây là một trong những chỗ Postgres dễ chịu hơn thật sự.',
    },

    { kind: 'h', text: 'Transaction — được cả hoặc không được gì' },
    {
      kind: 'p',
      text:
        'Bài toán kinh điển: chuyển 1 triệu từ tài khoản A sang B. Đó là **hai** câu UPDATE. '
        + 'Nếu mất điện đúng giữa hai câu, A mất tiền mà B không nhận được. Transaction sinh ra để chuyện đó không xảy ra.',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `BEGIN;

UPDATE accounts SET balance = balance - 1000000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000000 WHERE id = 2;

COMMIT;    -- ghi nhận cả hai
-- ROLLBACK;  -- hoặc huỷ cả hai, như chưa từng chạy`,
    },
    {
      kind: 'p',
      text:
        'Điều quan trọng nhất mà đọc chữ không thấy được: giữa `BEGIN` và `COMMIT`, '
        + 'thay đổi của bạn **chỉ mình bạn nhìn thấy**. Bấm thử hai phiên chạy song song:',
    },
    {
      kind: 'widget',
      name: 'txn-sim',
      title: 'Hai phiên cùng lúc: ai thấy gì',
      hint: 'Chạy từng bước ở phiên A và quan sát phiên B thấy giá trị nào.',
    },
    {
      kind: 'figure',
      name: 'txn-timeline',
      title: 'Dòng thời gian của một transaction',
      caption: 'Trước COMMIT, thay đổi chỉ tồn tại trong phiên của bạn. ROLLBACK xoá sạch như chưa từng có.',
    },

    { kind: 'h', text: 'ACID — bốn lời hứa của database' },
    {
      kind: 'figure',
      name: 'acid',
      title: 'Bốn chữ cái ACID qua ví dụ chuyển tiền',
      caption: 'Mỗi chữ trả lời một câu hỏi "nếu chuyện xấu xảy ra thì sao?".',
    },
    {
      kind: 'table',
      head: ['Chữ', 'Tên', 'Nghĩa thực tế'],
      rows: [
        ['**A**', 'Atomicity — Nguyên tử', 'Cả nhóm lệnh làm hết, hoặc không làm gì. Không có nửa vời.'],
        ['**C**', 'Consistency — Nhất quán', 'Sau transaction, mọi ràng buộc (khoá ngoại, CHECK, UNIQUE) vẫn đúng.'],
        ['**I**', 'Isolation — Cô lập', 'Hai transaction chạy cùng lúc không giẫm lên nhau.'],
        ['**D**', 'Durability — Bền vững', 'Đã COMMIT thì mất điện cũng không mất — nhờ ghi nhật ký WAL trước.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Điều này ảnh hưởng gì tới code Node.js của bạn',
      text:
        'Mỗi câu SQL chạy đơn lẻ đã tự nằm trong một transaction ngầm rồi (`autocommit`). '
        + 'Bạn chỉ cần `BEGIN`/`COMMIT` thủ công khi **nhiều câu phải cùng thành công hoặc cùng thất bại** — '
        + 'tạo đơn hàng đồng thời trừ kho, chẳng hạn. Với Prisma thì đó là `prisma.$transaction([...])`.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Mẫu thực tế: đặt hàng và trừ kho phải cùng sống hoặc cùng chết',
      code: `BEGIN;

-- Khoá dòng sản phẩm lại để người khác không trừ kho cùng lúc (chương 18)
SELECT stock FROM products WHERE id = 42 FOR UPDATE;

UPDATE products SET stock = stock - 1
WHERE id = 42 AND stock >= 1;
-- Nếu câu trên không đụng dòng nào (hết hàng) thì tầng ứng dụng gọi ROLLBACK

INSERT INTO orders (customer_id, total) VALUES (7, 1200000);

COMMIT;`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Transaction nên ngắn',
      text:
        'Transaction mở lâu sẽ giữ khoá lâu, chặn người khác, và làm autovacuum không dọn được dữ liệu cũ. '
        + '**Đừng bao giờ gọi API bên ngoài hay chờ người dùng bấm nút khi đang mở transaction.** '
        + 'Mở → làm nhanh → đóng.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'SAVEPOINT — điểm lùi trong một transaction dài',
      code: `BEGIN;
INSERT INTO orders (customer_id, total) VALUES (7, 1200000);

SAVEPOINT truoc_khi_them_qua_tang;
INSERT INTO order_items (order_id, product_id, quantity) VALUES (99, 5, 1);
-- Lỡ tay sai riêng phần quà tặng:
ROLLBACK TO SAVEPOINT truoc_khi_them_qua_tang;   -- đơn hàng ở trên VẪN CÒN

COMMIT;`,
    },

    {
      kind: 'quiz',
      q: 'Bạn chạy `BEGIN; UPDATE products SET price = 0 WHERE id = 1;` rồi chưa COMMIT. Lúc này một phiên khác chạy `SELECT price FROM products WHERE id = 1`. Họ thấy gì?',
      options: [
        'Thấy giá 0 — thay đổi có hiệu lực ngay',
        'Thấy giá CŨ — thay đổi chưa commit thì người khác không nhìn thấy',
        'Câu SELECT của họ bị treo tới khi bạn COMMIT',
        'Báo lỗi vì dòng đang bị khoá',
      ],
      answer: 1,
      explain:
        'Đây là chữ I (Isolation). Ở mức mặc định Read Committed, phiên khác vẫn đọc được giá cũ và KHÔNG bị chặn — '
        + 'Postgres giữ nhiều phiên bản của cùng một dòng (MVCC). Chỉ khi họ định GHI vào dòng đó thì mới phải chờ.',
    },
    {
      kind: 'quiz',
      q: 'Bạn muốn "nếu slug đã có thì cập nhật giá, chưa có thì thêm mới". Cách nào gọn nhất trong PostgreSQL?',
      options: [
        'SELECT trước rồi tuỳ kết quả mà INSERT hay UPDATE',
        '`INSERT … ON CONFLICT (slug) DO UPDATE SET …`',
        '`MERGE INTO …`',
        '`REPLACE INTO …`',
      ],
      answer: 1,
      explain:
        'Cách A có lỗi cạnh tranh: giữa lúc SELECT và lúc INSERT, một phiên khác có thể chèn vào trước. '
        + '`ON CONFLICT` là thao tác nguyên tử. `MERGE` là của SQL Server, `REPLACE` là của MySQL.',
    },
    {
      kind: 'quiz',
      q: 'Chữ D trong ACID (Durability) được bảo đảm bằng cách nào?',
      options: [
        'Ghi thẳng dữ liệu vào file bảng trước khi trả về',
        'Ghi vào nhật ký WAL trước, ép xuống đĩa, rồi mới báo COMMIT thành công',
        'Giữ mọi thứ trong RAM và sao lưu mỗi giờ',
        'Nhân bản sang server thứ hai',
      ],
      answer: 1,
      explain:
        'WAL (Write-Ahead Log) là ghi nhật ký trước. Nhờ nó, mất điện ngay sau COMMIT thì lúc khởi động lại '
        + 'PostgreSQL đọc WAL và dựng lại đúng trạng thái đã cam kết. Chương 19 nói kỹ.',
    },
    {
      kind: 'try',
      text:
        'Bài Capstone "A Safe Stock-and-Order Transaction" bên Code Lab yêu cầu bạn tự viết đúng mẫu trừ kho ở trên. '
        + 'Đó là bài tổng kết cho cả tám chương nền — làm được là bạn đã đủ vốn đọc và sửa code SQL trong dự án thật.',
    },
  ],
  flash: [
    { q: 'Quy tắc an toàn trước khi UPDATE/DELETE?', a: 'Chạy SELECT với đúng điều kiện đó trước, nhìn kết quả, rồi mới đổi thành UPDATE/DELETE.' },
    { q: 'RETURNING dùng để làm gì?', a: 'Lấy lại dòng vừa INSERT/UPDATE/DELETE ngay trong một câu, khỏi phải SELECT thêm lần nữa.' },
    { q: 'Upsert trong Postgres viết thế nào?', a: '`INSERT … ON CONFLICT (cột_unique) DO UPDATE SET … `. `EXCLUDED` là dòng vừa định chèn.' },
    { q: 'ACID là gì?', a: 'Atomicity (cả hoặc không) · Consistency (ràng buộc vẫn đúng) · Isolation (không giẫm nhau) · Durability (COMMIT rồi thì bền).' },
    { q: 'Trước COMMIT, ai nhìn thấy thay đổi của bạn?', a: 'Chỉ mình phiên của bạn. Phiên khác vẫn đọc giá trị cũ nhờ MVCC, và không bị chặn khi chỉ đọc.' },
    { q: 'Vì sao transaction phải ngắn?', a: 'Giữ khoá lâu sẽ chặn người khác và cản autovacuum. Không bao giờ gọi API ngoài hay chờ người dùng trong transaction.' },
  ],
};
