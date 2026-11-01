/**
 * DBI202 · 5.2 Kiểu dữ liệu & những lựa chọn trả giá về sau — NVARCHAR/DECIMAL/DATE/DATETIME2/BIT/IDENTITY trên SQL Server
 * thật (hai đề chạy trên máy: kiểu và IDENTITY là phần riêng SQL Server), NULL trong phép tính (chấm trong trình duyệt).
 */
import { mod, de, cs, q, kq, kqAn, ma, tsql, ck, tn } from './_chung.mjs';

const KIEU_DUNG = `CREATE TABLE Product (
    productID   INT IDENTITY(1,1) NOT NULL PRIMARY KEY,         -- surrogate key, numbered by SQL Server
    sku         VARCHAR(20)    NOT NULL UNIQUE,                 -- ASCII code: VARCHAR is enough
    productName NVARCHAR(100)  NOT NULL,                        -- Vietnamese text: NVARCHAR
    price       DECIMAL(12,0)  NOT NULL CHECK (price > 0),      -- money: exact DECIMAL, never FLOAT
    releaseDate DATE           NULL,                            -- a day, no time
    createdAt   DATETIME2(0)   NOT NULL DEFAULT SYSDATETIME(),  -- a timestamp
    isActive    BIT            NOT NULL DEFAULT 1               -- a yes/no flag
);
INSERT INTO Product (sku, productName, price, releaseDate) VALUES ('CT-0001', N'Bút bi Thiên Long', 5000, '2025-01-02');`;

const COL = (ten, kieu, them = '') => `EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.Product') AND c.name = N'${ten}' AND t.name = N'${kieu}'${them})`;

export default mod('dbi202-kieu-du-lieu', '5.2 Data types & the choices that hurt later', [
  tsql({
    t: 'Pick the right SQL Server type for every column', k: 'MEDIUM', p: 15,
    kn: ['NVARCHAR', 'DECIMAL', 'DATE / DATETIME2', 'BIT', 'IDENTITY', 'DEFAULT'], tag: ['data-types', 'identity', 'ddl'],
    lyDo: ['This exercise is about SQL Server\'s own types (NVARCHAR, DATETIME2, BIT, IDENTITY) and defaults like SYSDATETIME(); the in-browser grader runs PostgreSQL and would have to translate them — so it is checked on a real SQL Server with sys.columns.', 'Bài này nói về chính các kiểu của SQL Server (NVARCHAR, DATETIME2, BIT, IDENTITY) và giá trị mặc định như SYSDATETIME(); máy chấm trình duyệt chạy PostgreSQL nên sẽ phải dịch chúng — vì vậy bài được kiểm trên SQL Server thật bằng sys.columns.'],
    en: '<p>Create <code>Product</code> for a shop and insert one product. Choose the types as lesson 5.2 teaches:</p><ul><li><code>productID</code> — an integer numbered automatically from 1 (surrogate primary key);</li><li><code>sku</code> — an ASCII code up to 20 characters, required, unique;</li><li><code>productName</code> — Vietnamese text up to 100 characters, required;</li><li><code>price</code> — money in VND, no decimals, exact, &gt; 0;</li><li><code>releaseDate</code> — a calendar day, optional;</li><li><code>createdAt</code> — a timestamp to the second, required, defaulting to the current time;</li><li><code>isActive</code> — yes/no, required, defaulting to yes.</li></ul><p>Then insert <code>(sku CT-0001, Bút bi Thiên Long, 5000, released 2025-01-02)</code> giving ONLY those four columns.</p>',
    vi: '<p>Tạo bảng <code>Product</code> cho một cửa hàng và thêm một sản phẩm. Chọn kiểu như bài 5.2 dạy (danh sách cột ở bản tiếng Anh): khoá thay thế tự đánh số từ 1, mã ASCII ≤ 20 ký tự duy nhất, tên tiếng Việt ≤ 100 ký tự, giá VND không lẻ chính xác &gt; 0, ngày phát hành tuỳ chọn, mốc thời gian tạo tới giây mặc định là lúc hiện tại, cờ có/không mặc định là có.</p><p>Rồi thêm <code>(sku CT-0001, Bút bi Thiên Long, 5000, phát hành 2025-01-02)</code> CHỈ ghi bốn cột đó.</p>',
    yc: [['Types: INT IDENTITY(1,1), VARCHAR(20), NVARCHAR(100), DECIMAL(12,0), DATE, DATETIME2(0), BIT.', 'Kiểu: INT IDENTITY(1,1), VARCHAR(20), NVARCHAR(100), DECIMAL(12,0), DATE, DATETIME2(0), BIT.'], ["Defaults: SYSDATETIME() for createdAt, 1 for isActive. Vietnamese literal with N''.", "Mặc định: SYSDATETIME() cho createdAt, 1 cho isActive. Chuỗi tiếng Việt với N''."]],
    setup: `-- (no sample tables — you create Product yourself)`,
    khoi: `-- CREATE TABLE Product ( ... );
-- INSERT INTO Product (sku, productName, price, releaseDate) VALUES (...);
`,
    giai: KIEU_DUNG,
    kiem: [
      ck(['productID is INT IDENTITY(1,1) and the primary key', 'productID là INT IDENTITY(1,1) và là khoá chính'], `SET @ok = IIF(${COL('productID', 'int', ' AND c.is_identity = 1')}
  AND (SELECT CAST(seed_value AS INT) FROM sys.identity_columns WHERE object_id = OBJECT_ID(N'dbo.Product')) = 1
  AND EXISTS (SELECT 1 FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.is_primary_key = 1 AND c.name = N'productID'), 1, 0);
SET @info = N'expected productID INT IDENTITY(1,1) PRIMARY KEY';`),
      ck(['Text types: sku VARCHAR(20) UNIQUE, productName NVARCHAR(100)', 'Kiểu chữ: sku VARCHAR(20) UNIQUE, productName NVARCHAR(100)'], `SET @ok = IIF(${COL('sku', 'varchar', ' AND c.max_length = 20 AND c.is_nullable = 0')} AND ${COL('productName', 'nvarchar', ' AND c.max_length = 200 AND c.is_nullable = 0')}
  AND EXISTS (SELECT 1 FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.is_unique = 1 AND i.is_primary_key = 0 AND c.name = N'sku'), 1, 0);
SET @info = N'expected sku VARCHAR(20) NOT NULL UNIQUE and productName NVARCHAR(100) NOT NULL (Vietnamese text needs NVARCHAR)';`),
      ck(['Money and dates: price DECIMAL(12,0), releaseDate DATE, createdAt DATETIME2(0)', 'Tiền và ngày: price DECIMAL(12,0), releaseDate DATE, createdAt DATETIME2(0)'], `SET @ok = IIF(${COL('price', 'decimal', ' AND c.precision = 12 AND c.scale = 0')} AND ${COL('releaseDate', 'date')} AND ${COL('createdAt', 'datetime2', ' AND c.scale = 0')}, 1, 0);
SET @info = N'price must be DECIMAL(12,0) (not FLOAT/MONEY), releaseDate DATE, createdAt DATETIME2(0)';`),
      ck(['Defaults work: createdAt is now, isActive is 1 (BIT)', 'Mặc định chạy: createdAt là lúc này, isActive là 1 (BIT)'], `DECLARE @c DATETIME2(0), @a BIT;
SELECT @c = createdAt, @a = isActive FROM dbo.Product WHERE sku = 'CT-0001';
SET @ok = IIF(${COL('isActive', 'bit')} AND @a = 1 AND ABS(DATEDIFF(MINUTE, @c, SYSDATETIME())) < 60, 1, 0);
SET @info = CONCAT(N'createdAt = ', COALESCE(CONVERT(NVARCHAR(30), @c, 120), N'NULL'), N', isActive = ', COALESCE(CAST(@a AS NVARCHAR(5)), N'NULL'), N' — expected now and 1');`),
      ck(['The row was inserted correctly (Vietnamese text intact, id 1)', 'Dòng được thêm đúng (chữ Việt nguyên vẹn, id 1)'], `SET @ok = IIF(EXISTS (SELECT 1 FROM dbo.Product WHERE productID = 1 AND sku = 'CT-0001' AND productName = N'Bút bi Thiên Long' COLLATE Latin1_General_BIN2 AND price = 5000 AND releaseDate = '2025-01-02'), 1, 0);
SET @info = (SELECT TOP (1) CONCAT(N'found: ', productID, N' | ', productName, N' | ', price) FROM dbo.Product);`),
      ck(['Rules: price 0 and a duplicate sku are rejected', 'Luật: giá 0 và sku trùng bị từ chối'], `DECLARE @n INT = 0;
BEGIN TRAN;
BEGIN TRY INSERT INTO dbo.Product (sku, productName, price) VALUES ('CT-0002', N'X', 0); END TRY BEGIN CATCH SET @n += 1; END CATCH;
BEGIN TRY INSERT INTO dbo.Product (sku, productName, price) VALUES ('CT-0001', N'Y', 100); END TRY BEGIN CATCH SET @n += 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@n = 2, 1, 0); SET @info = CONCAT(@n, N' of 2 bad rows were rejected');`),
    ],
    saiTay: [
      KIEU_DUNG.replace('DECIMAL(12,0)  NOT NULL CHECK', 'FLOAT          NOT NULL CHECK'),
      KIEU_DUNG.replace('productName NVARCHAR(100)', 'productName VARCHAR(100) ').replace("N'Bút bi Thiên Long'", "'Bút bi Thiên Long'"),
      KIEU_DUNG.replace('createdAt   DATETIME2(0)   NOT NULL DEFAULT SYSDATETIME(),', 'createdAt   VARCHAR(30)    NULL,'),
      KIEU_DUNG.replace('productID   INT IDENTITY(1,1) NOT NULL PRIMARY KEY,', 'productID   INT NOT NULL PRIMARY KEY,').replace("INSERT INTO Product (sku, productName, price, releaseDate) VALUES ('CT-0001',", "INSERT INTO Product (productID, sku, productName, price, releaseDate) VALUES (1, 'CT-0001',"),
    ],
    gy: [['Text a person reads ⇒ NVARCHAR; a code ⇒ VARCHAR/CHAR; money ⇒ DECIMAL; a day ⇒ DATE; a moment ⇒ DATETIME2.', 'Chữ người đọc ⇒ NVARCHAR; mã ⇒ VARCHAR/CHAR; tiền ⇒ DECIMAL; một ngày ⇒ DATE; một thời điểm ⇒ DATETIME2.'], ['productID INT IDENTITY(1,1) PRIMARY KEY, then leave productID out of the INSERT.', 'productID INT IDENTITY(1,1) PRIMARY KEY, rồi bỏ productID khỏi INSERT.']],
    lhg: [['price FLOAT — 0.1 + 0.2 = 0.30000000000000004; sums of money drift.', 'price FLOAT — 0.1 + 0.2 = 0.30000000000000004; tổng tiền bị lệch.'], ["productName VARCHAR with a non-N literal — 'Bút bi Thiên Long' arrives with '?' instead of letters.", "productName VARCHAR với chuỗi không có N — 'Bút bi Thiên Long' tới nơi có '?' thay chữ."]],
    gt: ['<p>NVARCHAR(100) shows as max_length 200 in sys.columns (2 bytes per character). The type is a constraint you cannot undo cheaply: changing it later means rewriting every row.</p>', '<p>NVARCHAR(100) hiện max_length 200 trong sys.columns (2 byte mỗi ký tự). Kiểu là một ràng buộc khó gỡ: đổi về sau là phải viết lại mọi dòng.</p>'],
    tn: [tn('IDENTITY', 'cột tự đánh số'), tn('DECIMAL(p,s)', 'số thập phân chính xác'), tn('DATETIME2', 'ngày giờ (SQL Server)')],
  }),
  tsql({
    t: 'IDENTITY: seed, increment and gaps that are not bugs', k: 'MEDIUM', p: 12,
    kn: ['IDENTITY(seed, increment)', 'SCOPE_IDENTITY()', 'gaps after rollback'], tag: ['identity', 'ddl'],
    lyDo: ['IDENTITY and SCOPE_IDENTITY() are SQL Server features (PostgreSQL spells auto-numbering differently), and the "gap after a rolled-back INSERT" behaviour must be seen on the real engine.', 'IDENTITY và SCOPE_IDENTITY() là tính năng của SQL Server (PostgreSQL viết tự đánh số khác), và hành vi "hụt số sau INSERT bị huỷ" phải xem trên máy thật.'],
    en: '<p>Invoices are numbered from 1000 in steps of 10. Create <code>Invoice(invoiceNo INT IDENTITY(1000,10) PRIMARY KEY, customer NVARCHAR(50) NOT NULL, amount DECIMAL(12,0) NOT NULL)</code>, then in <code>solution.sql</code>:</p><ol><li>insert an invoice for <i>An</i> (amount 500000);</li><li>start a transaction, insert an invoice for <i>Bình</i> (300000) and ROLL IT BACK;</li><li>insert an invoice for <i>Chi</i> (200000).</li></ol><p>Predict the numbers before you run — the self-check verifies them.</p>',
    vi: '<p>Hoá đơn đánh số từ 1000, bước 10. Tạo <code>Invoice(invoiceNo INT IDENTITY(1000,10) PRIMARY KEY, customer NVARCHAR(50) NOT NULL, amount DECIMAL(12,0) NOT NULL)</code>, rồi trong <code>solution.sql</code>: (1) thêm hoá đơn của <i>An</i> (500000); (2) mở giao dịch, thêm hoá đơn của <i>Bình</i> (300000) rồi ROLLBACK; (3) thêm hoá đơn của <i>Chi</i> (200000).</p><p>Đoán trước các số rồi mới chạy — tệp tự kiểm sẽ kiểm chúng.</p>',
    yc: [['Never write invoiceNo in an INSERT.', 'Không bao giờ ghi invoiceNo trong INSERT.'], ['BEGIN TRAN … INSERT … ROLLBACK for Bình.', 'BEGIN TRAN … INSERT … ROLLBACK cho Bình.']],
    setup: `-- (no sample tables)`,
    khoi: `-- CREATE TABLE Invoice ( ... IDENTITY(1000,10) ... );
-- INSERT ... An
-- BEGIN TRAN; INSERT ... Bình; ROLLBACK;
-- INSERT ... Chi
`,
    giai: `CREATE TABLE Invoice (
    invoiceNo INT IDENTITY(1000,10) NOT NULL PRIMARY KEY,
    customer  NVARCHAR(50)  NOT NULL,
    amount    DECIMAL(12,0) NOT NULL
);
GO
INSERT INTO Invoice (customer, amount) VALUES (N'An', 500000);       -- 1000
BEGIN TRAN;
    INSERT INTO Invoice (customer, amount) VALUES (N'Bình', 300000); -- takes 1010 …
ROLLBACK;                                                            -- … and 1010 is gone for good
INSERT INTO Invoice (customer, amount) VALUES (N'Chi', 200000);      -- 1020, not 1010`,
    kiem: [
      ck(['invoiceNo is IDENTITY(1000, 10)', 'invoiceNo là IDENTITY(1000, 10)'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.identity_columns WHERE object_id = OBJECT_ID(N'dbo.Invoice') AND name = N'invoiceNo' AND CAST(seed_value AS INT) = 1000 AND CAST(increment_value AS INT) = 10), 1, 0);
SET @info = N'expected invoiceNo INT IDENTITY(1000,10)';`),
      ck(['Exactly two invoices: An and Chi (Bình was rolled back)', 'Đúng hai hoá đơn: An và Chi (Bình đã bị huỷ)'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.Invoice) = 2 AND EXISTS (SELECT 1 FROM dbo.Invoice WHERE customer = N'An') AND EXISTS (SELECT 1 FROM dbo.Invoice WHERE customer = N'Chi') AND NOT EXISTS (SELECT 1 FROM dbo.Invoice WHERE customer = N'Bình'), 1, 0);
SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM dbo.Invoice));`),
      ck(['An got 1000 and Chi got 1020 — the gap 1010 is normal', 'An nhận 1000 và Chi nhận 1020 — khoảng hụt 1010 là bình thường'], `SET @ok = IIF(EXISTS (SELECT 1 FROM dbo.Invoice WHERE customer = N'An' AND invoiceNo = 1000) AND EXISTS (SELECT 1 FROM dbo.Invoice WHERE customer = N'Chi' AND invoiceNo = 1020), 1, 0);
SET @info = (SELECT STRING_AGG(CONCAT(customer, N'=', invoiceNo), N', ') FROM dbo.Invoice);`),
      ck(['An explicit invoiceNo is rejected without IDENTITY_INSERT', 'Ghi tay invoiceNo bị từ chối khi chưa bật IDENTITY_INSERT'], `BEGIN TRAN;
BEGIN TRY INSERT INTO dbo.Invoice (invoiceNo, customer, amount) VALUES (5000, N'X', 1); SET @info = N'the explicit id was accepted — is invoiceNo really an IDENTITY column?'; END TRY
BEGIN CATCH SET @ok = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [
      `CREATE TABLE Invoice (invoiceNo INT IDENTITY(1,1) NOT NULL PRIMARY KEY, customer NVARCHAR(50) NOT NULL, amount DECIMAL(12,0) NOT NULL);
GO
INSERT INTO Invoice (customer, amount) VALUES (N'An', 500000);
BEGIN TRAN; INSERT INTO Invoice (customer, amount) VALUES (N'Bình', 300000); ROLLBACK;
INSERT INTO Invoice (customer, amount) VALUES (N'Chi', 200000);`,
      `CREATE TABLE Invoice (invoiceNo INT IDENTITY(1000,10) NOT NULL PRIMARY KEY, customer NVARCHAR(50) NOT NULL, amount DECIMAL(12,0) NOT NULL);
GO
INSERT INTO Invoice (customer, amount) VALUES (N'An', 500000);
INSERT INTO Invoice (customer, amount) VALUES (N'Bình', 300000);
INSERT INTO Invoice (customer, amount) VALUES (N'Chi', 200000);`,
    ],
    gy: [['The rolled-back INSERT still consumed its number — IDENTITY is not transactional.', 'INSERT bị huỷ vẫn đã tiêu một số — IDENTITY không thuộc giao dịch.'], ['After the script: SELECT * FROM Invoice shows 1000 and 1020.', 'Sau script: SELECT * FROM Invoice cho 1000 và 1020.']],
    lhg: [['Expecting Chi to get 1010 — gaps after rollbacks and failed inserts are by design.', 'Tưởng Chi nhận 1010 — hụt số sau rollback và INSERT lỗi là thiết kế có chủ ý.'], ['Using MAX(invoiceNo) + 10 as "the next number" — wrong under concurrency and after gaps.', 'Dùng MAX(invoiceNo) + 10 làm "số tiếp theo" — sai khi đồng thời và khi có khoảng hụt.']],
    gt: ['<p>Never treat IDENTITY values as a count or as a gap-free public sequence. Read the value you just inserted with <code>SCOPE_IDENTITY()</code> (not @@IDENTITY, which a trigger can change).</p>', '<p>Đừng coi giá trị IDENTITY là số đếm hay dãy công khai không hụt. Đọc giá trị vừa chèn bằng <code>SCOPE_IDENTITY()</code> (không dùng @@IDENTITY, vì trigger có thể làm nó đổi).</p>'],
    tn: [tn('IDENTITY(seed, increment)', 'tự đánh số (giá trị đầu, bước)'), tn('SCOPE_IDENTITY()', 'số vừa cấp trong phạm vi hiện tại')],
  }),
  de({
    csdl: `CREATE TABLE Payroll (empID INT NOT NULL PRIMARY KEY, empName NVARCHAR(40) NOT NULL, salary DECIMAL(12,0) NOT NULL, bonus DECIMAL(12,0) NULL);
INSERT INTO Payroll VALUES (1, N'An', 15000000, 2000000), (2, N'Bình', 12000000, NULL), (3, N'Chi', 18000000, 0), (4, N'Dũng', 9000000, NULL);`,
    tenCsdl: 'Payroll', ld: { en: '<p><b>Table</b> (tab <code>Payroll.sql</code>): <code>Payroll(empID, empName, salary, bonus)</code> — bonus is NULL when not decided yet.</p>', vi: '<p><b>Bảng</b> (tab <code>Payroll.sql</code>): <code>Payroll(empID, empName, salary, bonus)</code> — bonus là NULL khi chưa quyết.</p>' },
    t: 'NULL in arithmetic: total pay with an unknown bonus', k: 'EASY', p: 6,
    kn: ['NULL arithmetic', 'COALESCE'], tag: ['null', 'coalesce'],
    en: '<p>For every employee compute <code>totalPay = salary + bonus</code>, treating a bonus that is not decided yet as 0.</p>',
    vi: '<p>Với mọi nhân viên tính <code>totalPay = salary + bonus</code>, coi thưởng chưa quyết là 0.</p>',
    yc: [['Columns: <code>empID, totalPay</code>.', 'Cột: <code>empID, totalPay</code>.'], ['Use COALESCE (ISNULL is SQL Server only). Row order does not matter.', 'Dùng COALESCE (ISNULL chỉ có ở SQL Server). Thứ tự dòng không quan trọng.']],
    giai: `SELECT empID, salary + COALESCE(bonus, 0) AS totalPay    -- 5 + NULL = NULL, so replace NULL first
FROM Payroll;`,
    kiem: [kq(['Total pay per employee', 'Tổng lương mỗi người']), kqAn(['Another undecided bonus', 'Thêm một thưởng chưa quyết'], `INSERT INTO Payroll VALUES (5, N'Em', 11000000, NULL)`), ma(['Uses COALESCE', 'Dùng COALESCE'], '\\bCOALESCE\\s*\\(')],
    sai: [`SELECT empID, salary + bonus AS totalPay FROM Payroll`, `SELECT empID, salary + bonus AS totalPay FROM Payroll WHERE bonus IS NOT NULL`],
    gy: [['Any arithmetic with NULL gives NULL.', 'Mọi phép tính với NULL đều ra NULL.'], ['COALESCE(bonus, 0) returns 0 when bonus is NULL.', 'COALESCE(bonus, 0) trả 0 khi bonus là NULL.']],
    lhg: [['salary + bonus — Bình and Dũng get a NULL total.', 'salary + bonus — Bình và Dũng có tổng NULL.'], ['Filtering the NULL bonuses away — those employees disappear.', 'Lọc bỏ thưởng NULL — các nhân viên đó biến mất.']],
    gt: ['<p>NULL is "unknown", not 0 — the database refuses to guess. You decide the business meaning (here: no bonus yet = 0) with COALESCE.</p>', '<p>NULL là "chưa biết", không phải 0 — CSDL không đoán thay bạn. Bạn quyết ý nghĩa nghiệp vụ (ở đây: chưa có thưởng = 0) bằng COALESCE.</p>'],
    tn: [tn('COALESCE', 'giá trị thay NULL')],
  }),
  cs({
    t: 'Choose the type: five design decisions', k: 'EASY', p: 7,
    kn: ['CHAR vs VARCHAR', 'FLOAT vs DECIMAL', 'DATE in VARCHAR', 'surrogate vs natural key'], tag: ['data-types'],
    en: '<p>Lesson 5.2 in five decisions.</p>', vi: '<p>Bài 5.2 trong năm quyết định.</p>',
    cau: [
      q('c1', ['A province code that is always 2 letters (HN, SG, DN):', 'Mã tỉnh luôn đúng 2 chữ (HN, SG, DN):'], ['CHAR(2)', 'NVARCHAR(MAX)', 'FLOAT', 'DATETIME'], ['Fixed-length ASCII code ⇒ CHAR(n).', 'Mã ASCII độ dài cố định ⇒ CHAR(n).']),
      q('c2', ['A bank balance in VND with cents of accuracy needed for audits:', 'Số dư ngân hàng (VND) cần chính xác tuyệt đối để kiểm toán:'], ['DECIMAL(18,2)', 'FLOAT', 'REAL', 'VARCHAR(20)'], ['Binary floats cannot store 0.1 exactly — never for money.', 'Số thực nhị phân không lưu đúng 0.1 — không bao giờ dùng cho tiền.']),
      q('c3', ["Storing dates as VARCHAR like '10/01/2026' causes…", "Lưu ngày dạng VARCHAR như '10/01/2026' gây ra…"], ['alphabetical sorting and locale-dependent meaning', 'nothing, it is the same as DATE', 'faster range queries', 'automatic time zones'], ["'10/01' < '2/01' as text; and 10/01 is October or January depending on the locale.", "'10/01' < '2/01' khi là chữ; và 10/01 là tháng 10 hay tháng 1 tuỳ ngôn ngữ."]),
      q('c4', ['Common practice for a Student table:', 'Cách làm phổ biến cho bảng Student:'], ['surrogate INT IDENTITY primary key + UNIQUE on the student code', 'the full name as primary key, since names rarely repeat', 'no key at all, because every row is unique anyway', 'a FLOAT key so new ids can be inserted in between'], ['Surrogate keys are narrow and never change; the natural key stays protected by UNIQUE.', 'Khoá thay thế hẹp và không đổi; khoá tự nhiên vẫn được UNIQUE bảo vệ.']),
      q('c5', ["An NVARCHAR(50) column uses at most how many bytes of data?", "Cột NVARCHAR(50) dùng tối đa bao nhiêu byte dữ liệu?"], ['100', '50', '25', '200'], ['2 bytes per character (UTF-16) ⇒ sys.columns shows max_length 100.', '2 byte mỗi ký tự (UTF-16) ⇒ sys.columns hiện max_length 100.']),
    ],
    gy: [['Ask what the value IS: a code, money, a day, a moment, a name?', 'Hỏi giá trị LÀ gì: mã, tiền, một ngày, một thời điểm, một cái tên?'], ['Narrow types = more rows per 8 KB page = fewer reads.', 'Kiểu hẹp = nhiều dòng hơn mỗi trang 8 KB = ít lần đọc hơn.']],
    lhg: [['FLOAT for money.', 'FLOAT cho tiền.'], ['NVARCHAR(MAX) "just in case" — cannot be indexed normally and wastes pages.', 'NVARCHAR(MAX) "cho chắc" — không đánh chỉ mục bình thường được và tốn trang.']],
    tn: [tn('surrogate key', 'khoá thay thế'), tn('natural key', 'khoá tự nhiên')],
  }),
]);
