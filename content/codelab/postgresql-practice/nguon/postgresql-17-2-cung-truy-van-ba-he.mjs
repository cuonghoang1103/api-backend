/**
 * PostgreSQL · 17.2 — Cùng truy vấn, ba hệ SQL. Chạy được trên PGlite: dịch báo cáo T-SQL và MySQL sang PostgreSQL (CT Shop),
 * và tự thấy hành vi "upsert đốt số identity" của PostgreSQL (id 1 rồi 4, khác MERGE của SQL Server). Hành vi phụ thuộc hệ
 * khác (DDL trong giao dịch, mức cô lập mặc định, đọc gặp ghi chưa commit) ⇒ bảng tra, đã đo trong bài.
 */
import { mod, pg, cs, bang1, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const THANG = `SELECT to_char(o.created_at, 'YYYY-MM') AS month,
       sum(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped')
GROUP BY month                                   -- PostgreSQL may group by the alias
ORDER BY month
LIMIT 3;`;
const HIEU = `SELECT attrs->>'brand' AS brand, count(*) AS products
FROM product
GROUP BY brand
ORDER BY products DESC, brand
LIMIT 3;`;
const TAG = `CREATE TABLE tag (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text NOT NULL UNIQUE, hits int NOT NULL DEFAULT 1);`;
const UPSERT = `INSERT INTO tag (name) VALUES ('sql');
INSERT INTO tag (name) VALUES ('sql') ON CONFLICT (name) DO UPDATE SET hits = tag.hits + 1;
INSERT INTO tag (name) VALUES ('sql') ON CONFLICT (name) DO UPDATE SET hits = tag.hits + 1;
INSERT INTO tag (name) VALUES ('json') ON CONFLICT (name) DO UPDATE SET hits = tag.hits + 1;
SELECT id, name, hits FROM tag ORDER BY id;`;

export default mod('postgresql-17-2-cung-truy-van-ba-he', '17.2 Same report on three SQL servers — and where they disagree', [
  pg({
    t: 'Translate a SQL Server report', k: 'EASY', p: 8, kn: ['TOP → LIMIT', "FORMAT(…,'yyyy-MM') → to_char(…,'YYYY-MM')", 'GROUP BY an alias'], tag: ['comparison', 'translation', 'ctshop'],
    en: `<p>Rewrite this T-SQL for PostgreSQL (CT Shop):</p>${pre(`SELECT TOP 3 FORMAT(o.created_at, 'yyyy-MM') AS month,
       SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped')
GROUP BY FORMAT(o.created_at, 'yyyy-MM')      -- SQL Server cannot GROUP BY the alias
ORDER BY month;`)}`,
    vi: `<p>Viết lại câu T-SQL này cho PostgreSQL (CT Shop):</p>${pre(`SELECT TOP 3 FORMAT(o.created_at, 'yyyy-MM') AS month,
       SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped')
GROUP BY FORMAT(o.created_at, 'yyyy-MM')      -- SQL Server không GROUP BY theo bí danh được
ORDER BY month;`)}`,
    yc: [["<code>to_char(o.created_at, 'YYYY-MM')</code>.", "<code>to_char(o.created_at, 'YYYY-MM')</code>."], ['TOP 3 → LIMIT 3 at the end; GROUP BY the alias or the same expression.', 'TOP 3 → LIMIT 3 ở cuối; GROUP BY theo bí danh hoặc cùng biểu thức.']],
    giai: THANG,
    kiem: [
      kq(['Revenue of August–October 2026', 'Doanh thu tháng 8–10/2026'], T),
      kqAn(['An order shipped in July appears', 'Xuất hiện một đơn đã giao tháng 7'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'shipped', '2026-07-20 10:00+07'); INSERT INTO order_item (order_id, product_id, qty, unit_price) VALUES (15, 1, 2, 5000)", T),
      ma(['Uses LIMIT', 'Dùng LIMIT'], '\\bLIMIT\\s+3\\b'),
    ],
    sai: ["SELECT to_char(o.created_at, 'YYYY-MM') AS month, sum(oi.qty * oi.unit_price) AS revenue FROM orders o JOIN order_item oi ON oi.order_id = o.id WHERE o.status IN ('paid', 'shipped') GROUP BY o.created_at ORDER BY month LIMIT 3", "SELECT to_char(o.created_at, 'YYYY-MM') AS month, sum(oi.qty * oi.unit_price) AS revenue FROM orders o JOIN order_item oi ON oi.order_id = o.id GROUP BY month ORDER BY month LIMIT 3"],
    gy: [["In to_char, MM (or mm) is the month and MI is minutes — unlike .NET, where mm means minutes.", "Trong to_char, MM (hay mm) là tháng còn MI là phút — khác .NET, nơi mm nghĩa là phút."], ['created_at is timestamptz: the month is taken in the session time zone (Asia/Ho_Chi_Minh here).', 'created_at là timestamptz: tháng lấy theo múi giờ của phiên (ở đây Asia/Ho_Chi_Minh).']],
    lhg: [['GROUP BY o.created_at — one group per order instead of per month.', 'GROUP BY o.created_at — mỗi đơn một nhóm thay vì mỗi tháng một nhóm.'], ['Dropping the WHERE while translating.', 'Làm rơi WHERE trong lúc dịch.']],
    gt: ['<p>The lesson ran the same report on all three servers and got identical numbers; only the spelling differs (TOP/LIMIT, FORMAT/DATE_FORMAT/to_char, GROUP BY alias).</p>', '<p>Bài học chạy cùng báo cáo trên cả ba máy chủ và được số liệu giống hệt; chỉ cách viết khác (TOP/LIMIT, FORMAT/DATE_FORMAT/to_char, GROUP BY bí danh).</p>'],
    tn: [tn('T-SQL', 'phương ngữ SQL của SQL Server')],
  }),

  pg({
    t: 'Translate a MySQL JSON report', k: 'EASY', p: 6, kn: ["MySQL attrs->>'$.brand' → PostgreSQL attrs->>'brand'", 'jsonb'], tag: ['comparison', 'translation', 'jsonb', 'ctshop'],
    en: `<p>Rewrite this MySQL query for PostgreSQL (product.attrs is jsonb):</p>${pre(`SELECT attrs->>'$.brand' AS brand, COUNT(*) AS products
FROM product
GROUP BY brand
ORDER BY products DESC, brand
LIMIT 3;`)}`,
    vi: `<p>Viết lại câu MySQL này cho PostgreSQL (product.attrs là jsonb):</p>${pre(`SELECT attrs->>'$.brand' AS brand, COUNT(*) AS products
FROM product
GROUP BY brand
ORDER BY products DESC, brand
LIMIT 3;`)}`,
    yc: [["MySQL's <code>-&gt;&gt;</code> takes a JSON path ('$.brand'); PostgreSQL's takes a key ('brand').", "<code>-&gt;&gt;</code> của MySQL nhận đường dẫn JSON ('$.brand'); của PostgreSQL nhận tên khoá ('brand')."], ['The rest is identical.', 'Phần còn lại giống hệt.']],
    giai: HIEU,
    kiem: [
      kq(['The three biggest brands', 'Ba thương hiệu nhiều nhất'], T),
      kqAn(['Three more Deli products', 'Thêm ba sản phẩm Deli'], `INSERT INTO product (sku, name, category_id, price, attrs) VALUES ('CT1007', 'Máy tính Deli D1', 10, 150000, '{"brand": "Deli"}'), ('CT1008', 'Máy tính Deli D2', 10, 160000, '{"brand": "Deli"}'), ('CT1009', 'Máy tính Deli D3', 10, 170000, '{"brand": "Deli"}')`, T),
      ma(["Reads the key with ->> 'brand'", "Đọc khoá bằng ->> 'brand'"], "->>\\s*'brand'"),
    ],
    sai: ["SELECT attrs->>'$.brand' AS brand, count(*) AS products FROM product GROUP BY brand ORDER BY products DESC, brand LIMIT 3", "SELECT attrs->'brand' AS brand, count(*) AS products FROM product GROUP BY brand ORDER BY products DESC LIMIT 3"],
    gy: [["In PostgreSQL, attrs->>'$.brand' looks for a key literally named \"$.brand\" and returns NULL.", "Trong PostgreSQL, attrs->>'$.brand' tìm một khoá có tên đúng là \"$.brand\" và trả NULL."], ['A JSON path exists too: <code>jsonb_path_query_first(attrs, \'$.brand\')</code>.', 'Đường dẫn JSON cũng có: <code>jsonb_path_query_first(attrs, \'$.brand\')</code>.']],
    lhg: [["Leaving '$.brand' — the query runs and groups everything under NULL.", "Để nguyên '$.brand' — truy vấn vẫn chạy và gộp tất cả vào NULL."], ['Dropping the tie-breaker — equal counts come back in any order.', 'Bỏ khoá phá hoà — các số đếm bằng nhau trả về theo thứ tự tuỳ ý.']],
    gt: ['<p>JSON is where storage really differs: SQL Server keeps text plus functions, MySQL a validated binary JSON type with path syntax, PostgreSQL jsonb with operators and GIN indexes (Chapter 13). Translating means changing the operators, not the report.</p>', '<p>JSON là nơi cách lưu thật sự khác nhau: SQL Server giữ chữ kèm hàm, MySQL có kiểu JSON nhị phân với cú pháp đường dẫn, PostgreSQL có jsonb với toán tử và chỉ mục GIN (Chương 13). Dịch nghĩa là đổi toán tử, không đổi báo cáo.</p>'],
    tn: [tn('JSON path', 'đường dẫn JSON')],
  }),

  pg({
    csdl: TAG, tenCsdl: 'tags', ld: { en: `<h4>Table</h4>${pre(TAG)}`, vi: `<h4>Bảng</h4>${pre(TAG)}` },
    t: 'See it yourself: an upsert burns identity numbers', k: 'MEDIUM', p: 8, kn: ['INSERT … ON CONFLICT DO UPDATE', 'identity gaps', 'EXCLUDED'], tag: ['comparison', 'upsert'],
    en: '<p>Reproduce test 3 of the lesson with PostgreSQL\'s upsert: insert <code>sql</code>; upsert <code>sql</code> twice (each turns into <code>hits = hits + 1</code>); upsert <code>json</code>; then <code>SELECT id, name, hits FROM tag ORDER BY id</code>. Use <code>INSERT … ON CONFLICT (name) DO UPDATE</code> for the three upserts.</p>',
    vi: '<p>Tái hiện phép thử 3 của bài bằng upsert của PostgreSQL: chèn <code>sql</code>; upsert <code>sql</code> hai lần (mỗi lần thành <code>hits = hits + 1</code>); upsert <code>json</code>; rồi <code>SELECT id, name, hits FROM tag ORDER BY id</code>. Dùng <code>INSERT … ON CONFLICT (name) DO UPDATE</code> cho ba lần upsert.</p>',
    yc: [['Predict json\'s id before running.', 'Đoán id của json trước khi chạy.'], ['<code>tag.hits</code> is the existing row; <code>EXCLUDED</code> the row you tried to insert.', '<code>tag.hits</code> là dòng đang có; <code>EXCLUDED</code> là dòng bạn định chèn.']],
    giai: UPSERT,
    kiem: [
      kq(['json gets id 4, not 2', 'json nhận id 4, không phải 2'], T),
      ma(['Uses ON CONFLICT', 'Dùng ON CONFLICT'], 'ON\\s+CONFLICT'),
      kqAn(['With a tag created earlier by someone else', 'Với một thẻ do người khác tạo trước'], "INSERT INTO tag (name) VALUES ('go')", T),
    ],
    sai: [
      "INSERT INTO tag (name) VALUES ('sql'); UPDATE tag SET hits = hits + 1 WHERE name = 'sql'; UPDATE tag SET hits = hits + 1 WHERE name = 'sql'; INSERT INTO tag (name) VALUES ('json'); SELECT id, name, hits FROM tag ORDER BY id;",
      "INSERT INTO tag (name) VALUES ('sql'); INSERT INTO tag (name) VALUES ('sql') ON CONFLICT (name) DO NOTHING; INSERT INTO tag (name) VALUES ('sql') ON CONFLICT (name) DO NOTHING; INSERT INTO tag (name) VALUES ('json') ON CONFLICT (name) DO NOTHING; SELECT id, name, hits FROM tag ORDER BY id;",
    ],
    gy: [['ON CONFLICT takes the next identity value BEFORE discovering the conflict.', 'ON CONFLICT lấy giá trị identity kế tiếp TRƯỚC khi phát hiện xung đột.'], ['MySQL\'s ON DUPLICATE KEY does the same; SQL Server\'s MERGE does not.', 'ON DUPLICATE KEY của MySQL cũng vậy; MERGE của SQL Server thì không.']],
    lhg: [['Relying on gapless ids (invoice numbers!) — use a separate counter with a lock for that.', 'Dựa vào id liền mạch (số hoá đơn!) — hãy dùng bộ đếm riêng có khoá cho việc đó.'], ['DO NOTHING when the task needs a counter.', 'DO NOTHING khi đề cần bộ đếm.']],
    gt: ['<p>The two upserts of "sql" each consumed a number (2 and 3) before turning into updates, so "json" got 4. Same on MySQL; SQL Server\'s MERGE gave 2. A rolled-back insert burns a number too — identities are unique, not gapless.</p>', '<p>Hai lần upsert "sql" mỗi lần tiêu một số (2 và 3) trước khi thành lệnh cập nhật, nên "json" nhận 4. MySQL cũng vậy; MERGE của SQL Server cho 2. Lệnh chèn bị huỷ cũng đốt một số — identity là duy nhất, không phải liền mạch.</p>'],
    tn: [tn('upsert', 'chèn hoặc cập nhật'), tn('gapless', 'liền mạch, không lỗ hổng')],
  }),

  cs({
    t: 'Behaviour cheat sheet: where the servers disagree', k: 'MEDIUM', p: 8, kn: ['DDL in a transaction', 'default isolation', 'MVCC vs locking reads'], tag: ['comparison'], loai: 'table',
    en: '<p>Fill in the behaviour measured in lesson 17.2 (SQL Server 2022, MySQL 8.4, PostgreSQL 17, default settings).</p>', vi: '<p>Điền hành vi đã đo trong bài 17.2 (SQL Server 2022, MySQL 8.4, PostgreSQL 17, thiết lập mặc định).</p>',
    bang: [bang1('b1', ['Behaviour → system', 'Hành vi → hệ'], [{ ma: 'b', ten: 'Behaviour / Hành vi' }, { ma: 'ss', ten: 'SQL Server', luaChon: ['yes', 'no'] }, { ma: 'my', ten: 'MySQL', luaChon: ['yes', 'no'] }, { ma: 'pg', ten: 'PostgreSQL', luaChon: ['yes', 'no'] }], [
      { o: { b: 'ROLLBACK undoes a CREATE TABLE made inside the transaction / ROLLBACK huỷ được CREATE TABLE làm trong giao dịch' }, a: { ss: 'yes', my: 'no', pg: 'yes' } },
      { o: { b: 'A reader waits for an uncommitted writer of the same row / Người đọc phải chờ người ghi chưa commit trên cùng dòng' }, a: { ss: 'yes', my: 'no', pg: 'no' } },
      { o: { b: 'Default isolation is REPEATABLE READ / Mức cô lập mặc định là REPEATABLE READ' }, a: { ss: 'no', my: 'yes', pg: 'no' } },
      { o: { b: "'abc' = 'ABC' is true by default / 'abc' = 'ABC' mặc định là đúng" }, a: { ss: 'yes', my: 'yes', pg: 'no' } },
      { o: { b: 'An upsert that becomes an update still consumes an auto number / Upsert thành cập nhật vẫn tiêu một số tự tăng' }, a: { ss: 'no', my: 'yes', pg: 'yes' } },
    ], ['MySQL commits implicitly around DDL. SQL Server\'s default READ COMMITTED uses locks (unless READ_COMMITTED_SNAPSHOT), MySQL and PostgreSQL use MVCC. Case-insensitive default collations on SQL Server and MySQL; PostgreSQL compares exactly. These are the differences that pass every syntax test and break months later.', 'MySQL tự commit quanh DDL. READ COMMITTED mặc định của SQL Server dùng khoá (trừ khi bật READ_COMMITTED_SNAPSHOT), MySQL và PostgreSQL dùng MVCC. Collation mặc định không phân biệt hoa thường ở SQL Server và MySQL; PostgreSQL so chính xác. Đây là những khác biệt qua mọi phép thử cú pháp rồi gây hỏng nhiều tháng sau.'])],
    gy: [['Syntax errors appear on day one; behaviour differences months later.', 'Lỗi cú pháp lộ ngay ngày đầu; khác biệt hành vi lộ sau nhiều tháng.'], ['MVCC: readers never wait for writers.', 'MVCC: người đọc không bao giờ chờ người ghi.']],
    lhg: [['Assuming a failed MySQL migration rolls back its DDL.', 'Tưởng migration MySQL hỏng sẽ huỷ được DDL của nó.'], ['Porting case-insensitive searches to PostgreSQL without ILIKE or a citext/collation decision.', 'Chuyển tìm kiếm không phân biệt hoa thường sang PostgreSQL mà không dùng ILIKE hay quyết định citext/collation.']],
    tn: [tn('MVCC', 'điều khiển đồng thời nhiều phiên bản'), tn('implicit commit', 'commit ngầm')],
  }),
]);
