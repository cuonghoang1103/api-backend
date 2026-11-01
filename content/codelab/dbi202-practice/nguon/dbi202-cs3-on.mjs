/**
 * DBI202 · ⭐ CS.3 — bài tập chỉ mục chuyên sâu: chiều cao cây theo độ rộng khoá (đo bằng INDEXPROPERTY, chạy trên SQL Server),
 * một chỉ mục cho ba truy vấn, ba điều kiện SARGable, chỉ mục lọc + chỉ mục khoá ngoại (trình duyệt), và chẩn đoán trọn 6 bước
 * một truy vấn chậm trên bảng 50.000 đơn (SQL Server, đo số trang đọc bằng sys.dm_exec_procedure_stats).
 */
import { mod, de, kq, kqAn, sau, duoc, ma, tsql, ck, hinhChiMuc, tn } from './_chung.mjs';
import { DH, LUOC_DO_DH } from './_du-lieu.mjs';

const GIAI_CAY = `CREATE TABLE dbo.KhoaHep  (ma INT       NOT NULL PRIMARY KEY);   -- 4-byte key
CREATE TABLE dbo.KhoaRong (ma CHAR(200) NOT NULL PRIMARY KEY);   -- 200-byte key, same numbers as text
GO
WITH n AS (
    SELECT TOP (200000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
    FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.KhoaHep (ma) SELECT rn FROM n;
INSERT INTO dbo.KhoaRong (ma) SELECT CAST(ma AS CHAR(200)) FROM dbo.KhoaHep;
GO
CREATE OR ALTER VIEW dbo.vTreeDepth AS
SELECT OBJECT_NAME(i.object_id)                            AS bang,
       INDEXPROPERTY(i.object_id, i.name, 'IndexDepth')    AS so_tang
FROM sys.indexes i
WHERE i.object_id IN (OBJECT_ID(N'dbo.KhoaHep'), OBJECT_ID(N'dbo.KhoaRong')) AND i.index_id = 1;`;

const DON_50K = `CREATE TABLE dbo.DonHang (
    id          INT           NOT NULL CONSTRAINT pk_donhang PRIMARY KEY,
    maDon       VARCHAR(12)   NOT NULL,
    khachHangId INT           NOT NULL,
    ngayDat     DATE          NOT NULL,
    trangThai   VARCHAR(10)   NOT NULL,
    tongTien    DECIMAL(12,0) NOT NULL,
    ghiChu      CHAR(60)      NOT NULL
);
GO
-- the lesson's 50,000 orders: every customer (1…5000) has 10 orders spread over 2023–2025
WITH n AS (
    SELECT TOP (50000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS g
    FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.DonHang (id, maDon, khachHangId, ngayDat, trangThai, tongTien, ghiChu)
SELECT g, CONCAT('DH', g), 1 + (g * 7919) % 5000, DATEADD(DAY, g % 1096, '2023-01-01'),
       CASE WHEN g % 100 = 0 THEN 'CHO' WHEN g % 10 = 0 THEN 'HUY' ELSE 'XONG' END,
       10000 * (1 + g % 500), ''
FROM n;`;

const GIAI_CHAN_DOAN = `-- Step 4: equality column, then range/sort column, then INCLUDE what the SELECT needs (id = clustered key, carried for free)
CREATE INDEX ix_kh_ngay ON dbo.DonHang (khachHangId, ngayDat) INCLUDE (maDon, tongTien);
GO
-- Step 3: the year as a half-open range, so ngayDat stays bare (SARGable)
CREATE OR ALTER PROCEDURE dbo.prDonHangTrongNam @kh INT, @nam INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, maDon, ngayDat, tongTien
    FROM dbo.DonHang
    WHERE khachHangId = @kh
      AND ngayDat >= DATEFROMPARTS(@nam, 1, 1)
      AND ngayDat <  DATEFROMPARTS(@nam + 1, 1, 1)
    ORDER BY ngayDat DESC;
END`;

const SO_SANH = (kh, nam) => `DECLARE @t TABLE (n INT IDENTITY(1,1), id INT, maDon VARCHAR(12), ngayDat DATE, tongTien DECIMAL(12,0));
INSERT INTO @t (id, maDon, ngayDat, tongTien) EXEC dbo.prDonHangTrongNam ${kh}, ${nam};
DECLARE @ref TABLE (id INT, maDon VARCHAR(12), ngayDat DATE, tongTien DECIMAL(12,0));
INSERT INTO @ref SELECT id, maDon, ngayDat, tongTien FROM dbo.DonHang WHERE khachHangId = ${kh} AND YEAR(ngayDat) = ${nam};
SET @ok = IIF(NOT EXISTS (SELECT id, maDon, ngayDat, tongTien FROM @t EXCEPT SELECT * FROM @ref) AND NOT EXISTS (SELECT * FROM @ref EXCEPT SELECT id, maDon, ngayDat, tongTien FROM @t)
  AND (SELECT COUNT(*) FROM @t) = (SELECT COUNT(*) FROM @ref)
  AND NOT EXISTS (SELECT 1 FROM @t a JOIN @t b ON b.n = a.n + 1 WHERE b.ngayDat > a.ngayDat), 1, 0);
SET @info = CONCAT(N'returned ', (SELECT COUNT(*) FROM @t), N' rows, expected ', (SELECT COUNT(*) FROM @ref), N', newest first');`;

export default mod('dbi202-cs3-on', '⭐ CS.3 Exercises: indexes in depth', [
  tsql({
    t: 'Exercise 1 — how tall is the tree? A 4-byte key vs a 200-byte key', k: 'MEDIUM', p: 15,
    kn: ['tree height', 'key width', 'INDEXPROPERTY IndexDepth'], tag: ['advanced', 'index'],
    lyDo: ['Tree depth is a property of SQL Server\'s own B+tree pages (INDEXPROPERTY … \'IndexDepth\'); the browser grader has neither these pages nor this function.', 'Độ sâu cây là thuộc tính của trang B+tree của chính SQL Server (INDEXPROPERTY … \'IndexDepth\'); máy chấm trình duyệt không có các trang này lẫn hàm này.'],
    en: `<p>Estimate first: two tables of 200,000 rows each. <code>KhoaHep(ma INT PRIMARY KEY)</code> and <code>KhoaRong(ma CHAR(200) PRIMARY KEY)</code> holding the same numbers as text. How many levels does each clustered index have?</p>
<p>Then build both tables (one set-based INSERT each), and the view <code>dbo.vTreeDepth(bang, so_tang)</code> that reads the depth of each clustered index with <code>INDEXPROPERTY(object_id, index_name, 'IndexDepth')</code>.</p>`,
    vi: `<p>Ước lượng trước: hai bảng mỗi bảng 200.000 dòng. <code>KhoaHep(ma INT PRIMARY KEY)</code> và <code>KhoaRong(ma CHAR(200) PRIMARY KEY)</code> chứa cùng các số dưới dạng chữ. Mỗi chỉ mục cụm có bao nhiêu tầng?</p>
<p>Rồi dựng hai bảng (mỗi bảng một câu INSERT theo tập) và view <code>dbo.vTreeDepth(bang, so_tang)</code> đọc độ sâu của từng chỉ mục cụm bằng <code>INDEXPROPERTY(object_id, tên_chỉ_mục, 'IndexDepth')</code>.</p>`,
    yc: [['Both tables have exactly 200,000 rows, ma = 1…200000.', 'Cả hai bảng có đúng 200.000 dòng, ma = 1…200000.'], ['vTreeDepth: one row per table, the depth of index_id = 1.', 'vTreeDepth: mỗi bảng một dòng, độ sâu của index_id = 1.']],
    setup: `-- Nothing to prepare: you build both tables in solution.sql (about 10 seconds).
SELECT 1 AS ready;`,
    khoi: `-- CREATE TABLE dbo.KhoaHep (...), dbo.KhoaRong (...)
-- INSERT 200000 rows into each
-- CREATE OR ALTER VIEW dbo.vTreeDepth AS ...`,
    giai: GIAI_CAY,
    kiem: [
      ck(['Both tables hold 200,000 rows with the right key types', 'Hai bảng có 200.000 dòng với đúng kiểu khoá'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.KhoaHep) = 200000 AND (SELECT COUNT(*) FROM dbo.KhoaRong) = 200000
  AND EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.KhoaHep') AND c.name = 'ma' AND t.name = 'int')
  AND EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.KhoaRong') AND c.name = 'ma' AND t.name = 'char' AND c.max_length = 200)
  AND EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.KhoaRong') AND index_id = 1), 1, 0);
SET @info = CONCAT(N'KhoaHep ', (SELECT COUNT(*) FROM dbo.KhoaHep), N' rows, KhoaRong ', (SELECT COUNT(*) FROM dbo.KhoaRong), N' rows');`),
      ck(['vTreeDepth: the INT key is 2 levels deep', 'vTreeDepth: khoá INT sâu 2 tầng'], `SET @ok = IIF((SELECT so_tang FROM dbo.vTreeDepth WHERE bang = N'KhoaHep') = 2, 1, 0);
SET @info = CONCAT(N'KhoaHep depth = ', (SELECT TOP (1) so_tang FROM dbo.vTreeDepth WHERE bang = N'KhoaHep'));`),
      ck(['vTreeDepth: the CHAR(200) key is 4 levels deep', 'vTreeDepth: khoá CHAR(200) sâu 4 tầng'], `SET @ok = IIF((SELECT so_tang FROM dbo.vTreeDepth WHERE bang = N'KhoaRong') = 4, 1, 0);
SET @info = CONCAT(N'KhoaRong depth = ', (SELECT TOP (1) so_tang FROM dbo.vTreeDepth WHERE bang = N'KhoaRong'));`),
    ],
    saiTay: [
      GIAI_CAY.replace('ma CHAR(200) NOT NULL PRIMARY KEY', 'ma VARCHAR(200) NOT NULL PRIMARY KEY').replace('CAST(ma AS CHAR(200))', 'CAST(ma AS VARCHAR(200))'),
      GIAI_CAY.replace('TOP (200000)', 'TOP (20000)'),
      GIAI_CAY.replace("INDEXPROPERTY(i.object_id, i.name, 'IndexDepth')", "INDEXPROPERTY(i.object_id, i.name, 'IndexFillFactor')"),
    ],
    gy: [['INT rows ≈ 11 bytes ⇒ ~600 per page ⇒ ~330 leaves ⇒ one root above them.', 'Dòng INT ≈ 11 byte ⇒ ~600 mỗi trang ⇒ ~330 lá ⇒ một gốc ở trên.'], ['CHAR(200) entries ≈ 207 bytes ⇒ ~38 per page at every level ⇒ 5,264 → 277 → 14 → 1 (measured).', 'Mục CHAR(200) ≈ 207 byte ⇒ ~38 mỗi trang ở mọi tầng ⇒ 5.264 → 277 → 14 → 1 (đo thật).']],
    lhg: [['VARCHAR(200) holding "1", "2"… — the keys are short, so the tree is short too: width is what is stored, not what is declared.', 'VARCHAR(200) chứa "1", "2"… — khoá ngắn nên cây cũng thấp: độ rộng là thứ được lưu, không phải thứ được khai.'], ['Expecting depth to grow like log₂(rows).', 'Tưởng độ sâu tăng như log₂(số dòng).']],
    gt: ['<p>Same rows, twice the reads per seek (4 vs 2) — and every nonclustered index on KhoaRong would also carry the 200-byte key. That is the practical reason behind "keep the clustered key narrow".</p>', '<p>Cùng số dòng, mỗi lần seek đọc gấp đôi (4 so với 2) — và mọi chỉ mục nonclustered trên KhoaRong còn mang theo khoá 200 byte. Đó là lý do thực tế của lời khuyên "giữ khoá cụm hẹp".</p>'],
    tn: [tn('index depth', 'độ sâu chỉ mục'), tn('narrow key', 'khoá hẹp')],
  }),
  de({
    csdl: DH, tenCsdl: 'DonHang', ld: LUOC_DO_DH,
    t: 'Exercise 2 — one index for three queries', k: 'MEDIUM', p: 10,
    kn: ['composite index', 'leftmost prefix', 'INCLUDE'], tag: ['advanced', 'index'],
    en: `<p>The "customer orders" screen sends three queries, always for one customer, all selecting <code>ngayDat, tongTien</code>:</p>
<ul><li><code>WHERE khachHangId = @kh AND trangThai = 'XONG'</code></li><li><code>WHERE khachHangId = @kh ORDER BY ngayDat DESC</code></li><li><code>WHERE khachHangId = @kh AND ngayDat &gt;= '2025-01-01'</code></li></ul>
<p>Create ONE index <code>ix_dh_kh_ngay</code> that makes all three an Index Seek with no Key Lookup and no Sort.</p>`,
    vi: `<p>Màn hình "đơn của khách" gửi ba truy vấn, luôn cho một khách, đều lấy <code>ngayDat, tongTien</code>:</p>
<ul><li><code>WHERE khachHangId = @kh AND trangThai = 'XONG'</code></li><li><code>WHERE khachHangId = @kh ORDER BY ngayDat DESC</code></li><li><code>WHERE khachHangId = @kh AND ngayDat &gt;= '2025-01-01'</code></li></ul>
<p>Tạo MỘT chỉ mục <code>ix_dh_kh_ngay</code> để cả ba đều là Index Seek, không Key Lookup, không Sort.</p>`,
    yc: [['CREATE INDEX ix_dh_kh_ngay ON DonHang (…) INCLUDE (…);', 'CREATE INDEX ix_dh_kh_ngay ON DonHang (…) INCLUDE (…);'], ['Key columns in the right order; columns that are only filtered loosely or selected go to INCLUDE.', 'Cột khoá đúng thứ tự; cột chỉ lọc thô hoặc chỉ được chọn thì vào INCLUDE.']],
    giai: `CREATE INDEX ix_dh_kh_ngay ON DonHang (khachHangId, ngayDat)   -- = column first, then the range/sort column
INCLUDE (trangThai, tongTien);                                   -- filtered loosely / only selected: leaf only`,
    kiem: [
      sau(['Keys (khachHangId, ngayDat), INCLUDE (tongTien, trangThai)', 'Khoá (khachHangId, ngayDat), INCLUDE (tongTien, trangThai)'], hinhChiMuc('ix_dh_kh_ngay')),
      ma(['A single CREATE INDEX', 'Một câu CREATE INDEX'], '\\bCREATE\\s+INDEX\\b'),
      duoc(['The three screen queries still run, and new orders can be written', 'Ba truy vấn của màn hình vẫn chạy, và vẫn ghi được đơn mới'], "SELECT ngayDat, tongTien FROM DonHang WHERE khachHangId = 42 AND trangThai = 'XONG'; SELECT ngayDat, tongTien FROM DonHang WHERE khachHangId = 42 ORDER BY ngayDat DESC; SELECT ngayDat, tongTien FROM DonHang WHERE khachHangId = 42 AND ngayDat >= '2025-01-01'; INSERT INTO DonHang VALUES (30, 'DH3000', 42, '2026-02-01', 'CHO', 100000)"),
    ],
    sai: [
      'CREATE INDEX ix_dh_kh_ngay ON DonHang (ngayDat, khachHangId) INCLUDE (trangThai, tongTien);',
      'CREATE INDEX ix_dh_kh_ngay ON DonHang (khachHangId, ngayDat);',
      'CREATE INDEX ix_dh_kh_ngay ON DonHang (khachHangId, trangThai, ngayDat) INCLUDE (tongTien);',
      'CREATE INDEX ix_dh_kh_ngay ON DonHang (khachHangId, ngayDat) INCLUDE (tongTien);',
    ],
    gy: [['khachHangId is the only column all three compare with = ⇒ first.', 'khachHangId là cột duy nhất cả ba so bằng ⇒ đứng đầu.'], ['ngayDat is sorted/ranged ⇒ second; trangThai (3 values) and tongTien ⇒ INCLUDE.', 'ngayDat được sắp/lọc khoảng ⇒ thứ hai; trangThai (3 giá trị) và tongTien ⇒ INCLUDE.']],
    lhg: [['(khachHangId, trangThai, ngayDat): query 2 then needs a Sort across the three statuses.', '(khachHangId, trangThai, ngayDat): truy vấn 2 khi đó phải Sort qua ba trạng thái.'], ['Forgetting trangThai in INCLUDE: query 1 needs a Key Lookup per row to check it.', 'Quên trangThai trong INCLUDE: truy vấn 1 cần Key Lookup mỗi dòng để kiểm nó.']],
    gt: ['<p>One well-ordered composite index often beats three single-column ones: fewer indexes to maintain on every write, and each query gets a seek + ordered output.</p>', '<p>Một chỉ mục ghép đúng thứ tự thường hơn ba chỉ mục một cột: ít chỉ mục phải duy trì mỗi lần ghi, và mỗi truy vấn được seek + kết quả có thứ tự.</p>'],
    tn: [tn('composite index', 'chỉ mục ghép')],
  }),
  de({
    csdl: DH, tenCsdl: 'DonHang', ld: LUOC_DO_DH,
    t: 'Exercise 3 — make three conditions SARGable (and prove nothing changed)', k: 'MEDIUM', p: 10,
    kn: ['SARGable', 'CONVERT', 'LEFT', 'arithmetic on a column'], tag: ['advanced', 'index', 'sargable'],
    en: `<p>Indexes exist on <code>ngayDat</code>, <code>maDon</code> and <code>tongTien</code>, yet these counts all scan:</p>
<pre>SELECT (SELECT COUNT(*) FROM DonHang WHERE CONVERT(VARCHAR(10), ngayDat, 23) = '2024-03-15') AS ngay_15_3,
       (SELECT COUNT(*) FROM DonHang WHERE LEFT(maDon, 6) = 'DH4242')                      AS ma_4242,
       (SELECT COUNT(*) FROM DonHang WHERE tongTien * 1.1 &gt; 5445000)                       AS sau_thue_lon;</pre>
<p>Rewrite each condition with the bare column, same three counts. (<code>ngayDat</code> is a DATE.)</p>`,
    vi: `<p>Có chỉ mục trên <code>ngayDat</code>, <code>maDon</code> và <code>tongTien</code>, nhưng các phép đếm này đều quét:</p>
<pre>SELECT (SELECT COUNT(*) FROM DonHang WHERE CONVERT(VARCHAR(10), ngayDat, 23) = '2024-03-15') AS ngay_15_3,
       (SELECT COUNT(*) FROM DonHang WHERE LEFT(maDon, 6) = 'DH4242')                      AS ma_4242,
       (SELECT COUNT(*) FROM DonHang WHERE tongTien * 1.1 &gt; 5445000)                       AS sau_thue_lon;</pre>
<p>Viết lại từng điều kiện với cột trần, cùng ba con số. (<code>ngayDat</code> kiểu DATE.)</p>`,
    yc: [['Columns ngay_15_3, ma_4242, sau_thue_lon.', 'Các cột ngay_15_3, ma_4242, sau_thue_lon.'], ['No CONVERT, LEFT or arithmetic on the column.', 'Không CONVERT, LEFT hay phép tính trên cột.']],
    giai: `SELECT
  (SELECT COUNT(*) FROM DonHang WHERE ngayDat = '2024-03-15')    AS ngay_15_3,      -- a DATE needs no conversion
  (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH4242%')      AS ma_4242,        -- prefix LIKE
  (SELECT COUNT(*) FROM DonHang WHERE tongTien > 4950000)        AS sau_thue_lon;   -- 5445000 / 1.1 = 4950000`,
    kiem: [
      kq(['The three counts', 'Ba con số']),
      kqAn(['Edge cases around each boundary', 'Ca biên quanh từng ngưỡng'], "INSERT INTO DonHang VALUES (21, 'DH4242Z', 7, '2024-03-15', 'XONG', 4950001), (22, 'ZDH4242', 7, '2024-03-16', 'XONG', 4950000), (23, 'DH424', 7, '2024-03-14', 'CHO', 4949999)"),
      ma(['No CONVERT() on the column', 'Không CONVERT() trên cột'], '\\b(CONVERT|CAST|FORMAT)\\s*\\(', true),
      ma(['No LEFT()/SUBSTRING()', 'Không LEFT()/SUBSTRING()'], '\\b(LEFT|SUBSTRING)\\s*\\(', true),
      ma(['No arithmetic on tongTien', 'Không phép tính trên tongTien'], 'tongTien\\s*[-+*/]', true),
    ],
    sai: [
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat = '2024-03-15') AS ngay_15_3, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH4242%') AS ma_4242, (SELECT COUNT(*) FROM DonHang WHERE tongTien >= 4950000) AS sau_thue_lon;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat = '2024-03-15') AS ngay_15_3, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE '%DH4242%') AS ma_4242, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 4950000) AS sau_thue_lon;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat > '2024-03-14' AND ngayDat <= '2024-03-16') AS ngay_15_3, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH4242%') AS ma_4242, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 4950000) AS sau_thue_lon;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat = '2024-03-15') AS ngay_15_3, (SELECT COUNT(*) FROM DonHang WHERE maDon = 'DH4242') AS ma_4242, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 4950000) AS sau_thue_lon;`,
    ],
    gy: [['Divide the constant, not the column: 5445000 / 1.1 = 4950000, keep the strict >.', 'Chia hằng, không chia cột: 5445000 / 1.1 = 4950000, giữ dấu > chặt.'], ['LEFT(s, 6) = \'DH4242\' ⇔ s LIKE \'DH4242%\'.', 'LEFT(s, 6) = \'DH4242\' ⇔ s LIKE \'DH4242%\'.']],
    lhg: [['>= instead of > — an order of exactly 4,950,000 becomes 5,445,000 after tax, which is NOT greater.', '>= thay vì > — đơn đúng 4.950.000 sau thuế là 5.445.000, KHÔNG lớn hơn.'], ['maDon = \'DH4242\' — loses DH42420, DH42421…', 'maDon = \'DH4242\' — mất DH42420, DH42421…']],
    gt: ['<p>On a DATETIME column the first rewrite would be a half-open range (>= \'2024-03-15\' AND < \'2024-03-16\'). Each rewrite is an exact equivalence — the hidden check adds rows exactly on every boundary to prove it.</p>', '<p>Với cột DATETIME, cách viết lại đầu sẽ là khoảng nửa mở (>= \'2024-03-15\' AND < \'2024-03-16\'). Mỗi cách viết lại là tương đương chính xác — kiểm ẩn thêm dòng đúng trên từng ngưỡng để chứng minh.</p>'],
    tn: [tn('SARGable', 'dùng được cho tìm kiếm theo chỉ mục')],
  }),
  de({
    csdl: DH, tenCsdl: 'DonHang', ld: LUOC_DO_DH,
    t: 'Exercise 4 — a filtered index for "pending orders" and the missing foreign-key index', k: 'MEDIUM', p: 10,
    kn: ['filtered index', 'partial index', 'foreign-key index'], tag: ['advanced', 'index'],
    en: `<p>Two small indexes, two real complaints:</p>
<ol><li>The admin screen runs <code>SELECT id, ngayDat FROM DonHang WHERE trangThai = 'CHO' ORDER BY ngayDat DESC</code> (newest 20). Only 1% of orders are pending. Create the smallest index <code>ix_dh_cho</code> that removes both the scan and the sort.</li>
<li>Deleting a customer's orders is slow because <code>ChiTietDon.donHangId</code> (a foreign key) has no index. Create <code>ix_ctd_donhang</code>.</li></ol>`,
    vi: `<p>Hai chỉ mục nhỏ, hai lời phàn nàn thật:</p>
<ol><li>Màn hình admin chạy <code>SELECT id, ngayDat FROM DonHang WHERE trangThai = 'CHO' ORDER BY ngayDat DESC</code> (20 đơn mới nhất). Chỉ 1% đơn đang chờ. Tạo chỉ mục nhỏ nhất <code>ix_dh_cho</code> bỏ được cả quét lẫn sắp.</li>
<li>Xoá đơn của một khách chậm vì <code>ChiTietDon.donHangId</code> (khoá ngoại) không có chỉ mục. Tạo <code>ix_ctd_donhang</code>.</li></ol>`,
    yc: [['Two CREATE INDEX statements.', 'Hai câu CREATE INDEX.'], ['The first one indexes ONLY the pending rows (CREATE INDEX … WHERE …).', 'Câu đầu chỉ đánh chỉ mục các dòng đang chờ (CREATE INDEX … WHERE …).']],
    giai: `CREATE INDEX ix_dh_cho ON DonHang (ngayDat DESC) WHERE trangThai = 'CHO';   -- filtered (SQL Server) = partial (PostgreSQL)
CREATE INDEX ix_ctd_donhang ON ChiTietDon (donHangId);                      -- FKs are never indexed for you`,
    kiem: [
      sau(['ix_dh_cho: key ngayDat, only the CHO rows', 'ix_dh_cho: khoá ngayDat, chỉ dòng CHO'], hinhChiMuc('ix_dh_cho')),
      sau(['ix_ctd_donhang on ChiTietDon(donHangId)', 'ix_ctd_donhang trên ChiTietDon(donHangId)'], hinhChiMuc('ix_ctd_donhang')),
      ma(['The pending-orders index has a WHERE filter', 'Chỉ mục đơn chờ có điều kiện WHERE'], '\\bCREATE\\s+INDEX\\s+ix_dh_cho\\b[^;]*\\bWHERE\\b'),
      duoc(['Orders and order lines can still be written', 'Vẫn ghi được đơn và dòng đơn'], "INSERT INTO DonHang VALUES (30, 'DH3000', 42, '2026-02-01', 'CHO', 100000); INSERT INTO ChiTietDon VALUES (7, 30, 'BUT', 1)"),
    ],
    sai: [
      "CREATE INDEX ix_dh_cho ON DonHang (trangThai, ngayDat); CREATE INDEX ix_ctd_donhang ON ChiTietDon (donHangId);",
      "CREATE INDEX ix_dh_cho ON DonHang (ngayDat DESC) WHERE trangThai = 'XONG'; CREATE INDEX ix_ctd_donhang ON ChiTietDon (donHangId);",
      "CREATE INDEX ix_dh_cho ON DonHang (ngayDat DESC) WHERE trangThai = 'CHO'; CREATE INDEX ix_ctd_donhang ON ChiTietDon (sanPham);",
    ],
    gy: [['The filter goes after the column list: CREATE INDEX … ON t (c) WHERE …', 'Điều kiện lọc đứng sau danh sách cột: CREATE INDEX … ON t (c) WHERE …'], ['Index the child column of every foreign key you join or delete through.', 'Đánh chỉ mục cột con của mọi khoá ngoại bạn nối hoặc xoá qua.']],
    lhg: [['(trangThai, ngayDat) for all rows — works, but 100× bigger than needed.', '(trangThai, ngayDat) cho mọi dòng — chạy được nhưng to gấp 100 lần cần thiết.'], ['Believing the FOREIGN KEY constraint already created an index.', 'Tin rằng ràng buộc FOREIGN KEY đã tạo sẵn chỉ mục.']],
    gt: ['<p>Measured in the lesson: the filtered index serves the screen in a couple of pages; the FK index took deleting customer 42 from 4,680 pages to 20. Remember the trap: the query must use the literal \'CHO\', not a parameter, for the filtered index to be chosen.</p>', '<p>Đo trong bài: chỉ mục lọc phục vụ màn hình với vài trang; chỉ mục khoá ngoại đưa việc xoá khách 42 từ 4.680 trang xuống 20. Nhớ bẫy: truy vấn phải dùng hằng \'CHO\', không phải tham số, thì chỉ mục lọc mới được chọn.</p>'],
    tn: [tn('partial index', 'chỉ mục một phần'), tn('foreign-key index', 'chỉ mục khoá ngoại')],
  }),
  tsql({
    t: 'Exercise 5 — diagnose a slow query in six steps (50,000 orders)', k: 'HARD', p: 25,
    kn: ['6-step diagnosis', 'SARGable', 'composite + INCLUDE', 'sys.dm_exec_procedure_stats'], tag: ['advanced', 'index', 'performance'],
    lyDo: ['The point is the page count on a 50,000-row table: only a real SQL Server can show that the plan changed (here measured with sys.dm_exec_procedure_stats.last_logical_reads).', 'Điểm mấu chốt là số trang trên bảng 50.000 dòng: chỉ SQL Server thật mới cho thấy kế hoạch đã đổi (ở đây đo bằng sys.dm_exec_procedure_stats.last_logical_reads).'],
    en: `<p>"Your orders this year" is slow. The app sends <code>SELECT id, maDon, ngayDat, tongTien FROM dbo.DonHang WHERE khachHangId = 42 AND YEAR(ngayDat) = 2025 ORDER BY ngayDat DESC</code> on 50,000 orders that have only a primary key (661 logical reads, Sort + Clustered Index Scan).</p>
<ol><li>Create <code>ix_kh_ngay</code> so that this query becomes one Index Seek with no lookup and no sort.</li>
<li>Create <code>dbo.prDonHangTrongNam @kh INT, @nam INT</code> returning the same rows, newest first, with a SARGable year condition.</li></ol>
<p>check.sql compares your procedure with the original query for three customers and reads its logical reads from <code>sys.dm_exec_procedure_stats</code>: it must read at most 30 pages (the original reads 661).</p>`,
    vi: `<p>Trang "đơn của bạn năm nay" chậm. App gửi <code>SELECT id, maDon, ngayDat, tongTien FROM dbo.DonHang WHERE khachHangId = 42 AND YEAR(ngayDat) = 2025 ORDER BY ngayDat DESC</code> trên 50.000 đơn chỉ có khoá chính (661 logical reads, Sort + Clustered Index Scan).</p>
<ol><li>Tạo <code>ix_kh_ngay</code> để truy vấn này thành một Index Seek, không tra ngược, không sắp.</li>
<li>Tạo <code>dbo.prDonHangTrongNam @kh INT, @nam INT</code> trả đúng các dòng đó, mới nhất trước, với điều kiện năm SARGable.</li></ol>
<p>check.sql so procedure của bạn với truy vấn gốc cho ba khách và đọc logical reads của nó từ <code>sys.dm_exec_procedure_stats</code>: tối đa 30 trang (câu gốc đọc 661).</p>`,
    yc: [['Index: equality column, then range/sort column, INCLUDE what the SELECT needs.', 'Chỉ mục: cột so bằng, rồi cột khoảng/sắp, INCLUDE thứ SELECT cần.'], ['Procedure: no YEAR()/DATEPART()/CONVERT() on ngayDat — use DATEFROMPARTS(@nam, 1, 1) and DATEFROMPARTS(@nam + 1, 1, 1).', 'Procedure: không YEAR()/DATEPART()/CONVERT() trên ngayDat — dùng DATEFROMPARTS(@nam, 1, 1) và DATEFROMPARTS(@nam + 1, 1, 1).']],
    setup: DON_50K,
    khoi: `-- Step 4: CREATE INDEX ix_kh_ngay ON dbo.DonHang (...) INCLUDE (...);
GO
-- Step 3: CREATE OR ALTER PROCEDURE dbo.prDonHangTrongNam @kh INT, @nam INT AS ...`,
    giai: GIAI_CHAN_DOAN,
    kiem: [
      ck(['ix_kh_ngay: keys (khachHangId, ngayDat), INCLUDE maDon and tongTien', 'ix_kh_ngay: khoá (khachHangId, ngayDat), INCLUDE maDon và tongTien'], `DECLARE @k NVARCHAR(200) = (SELECT STRING_AGG(c.name, N',') WITHIN GROUP (ORDER BY ic.key_ordinal) FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.DonHang') AND i.name = N'ix_kh_ngay' AND ic.is_included_column = 0);
DECLARE @inc NVARCHAR(200) = (SELECT STRING_AGG(c.name, N',') WITHIN GROUP (ORDER BY c.name) FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.DonHang') AND i.name = N'ix_kh_ngay' AND ic.is_included_column = 1);
SET @ok = IIF(@k = N'khachHangId,ngayDat' AND @inc LIKE N'%maDon%' AND @inc LIKE N'%tongTien%', 1, 0);
SET @info = CONCAT(N'keys = ', COALESCE(@k, N'(no index)'), N' · include = ', COALESCE(@inc, N'(none)'));`),
      ck(['Customer 42, year 2025: same rows as the original, newest first', 'Khách 42, năm 2025: cùng các dòng như câu gốc, mới nhất trước'], SO_SANH(42, 2025)),
      ck(['Customer 7, year 2024 and customer 4999, year 2023: same rows', 'Khách 7 năm 2024 và khách 4999 năm 2023: cùng các dòng'], SO_SANH(7, 2024).replace("SET @info", `IF @ok = 1 BEGIN DELETE FROM @t; DELETE FROM @ref; INSERT INTO @t (id, maDon, ngayDat, tongTien) EXEC dbo.prDonHangTrongNam 4999, 2023; INSERT INTO @ref SELECT id, maDon, ngayDat, tongTien FROM dbo.DonHang WHERE khachHangId = 4999 AND YEAR(ngayDat) = 2023; SET @ok = IIF(NOT EXISTS (SELECT id, maDon, ngayDat, tongTien FROM @t EXCEPT SELECT * FROM @ref) AND (SELECT COUNT(*) FROM @t) = (SELECT COUNT(*) FROM @ref), 1, 0); END;\nSET @info`)),
      ck(['The year condition is SARGable (no YEAR/DATEPART/CONVERT in the procedure)', 'Điều kiện năm SARGable (không YEAR/DATEPART/CONVERT trong procedure)'], `DECLARE @d NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.prDonHangTrongNam'));
SET @ok = IIF(@d IS NOT NULL AND @d NOT LIKE N'%YEAR(%' AND @d NOT LIKE N'%YEAR (%' AND @d NOT LIKE N'%DATEPART%' AND @d NOT LIKE N'%CONVERT(%' AND @d NOT LIKE N'%FORMAT(%', 1, 0);
SET @info = IIF(@d IS NULL, N'procedure not found', N'a function still wraps the column');`),
      ck(['Measured: one call reads at most 30 pages (sys.dm_exec_procedure_stats)', 'Đo thật: một lần gọi đọc tối đa 30 trang (sys.dm_exec_procedure_stats)'], `DECLARE @x TABLE (id INT, maDon VARCHAR(12), ngayDat DATE, tongTien DECIMAL(12,0));
INSERT INTO @x EXEC dbo.prDonHangTrongNam 42, 2025;   -- first call may include compilation work
INSERT INTO @x EXEC dbo.prDonHangTrongNam 42, 2025;   -- measure this one
DECLARE @r BIGINT = (SELECT TOP (1) last_logical_reads FROM sys.dm_exec_procedure_stats WHERE database_id = DB_ID() AND object_id = OBJECT_ID(N'dbo.prDonHangTrongNam') ORDER BY last_execution_time DESC);
SET @ok = IIF(@r IS NOT NULL AND @r <= 30, 1, 0);
SET @info = CONCAT(N'last_logical_reads = ', COALESCE(CAST(@r AS NVARCHAR(20)), N'(no stats: procedure missing?)'), N' (the original query reads 661)');`),
    ],
    saiTay: [
      GIAI_CHAN_DOAN.replace(`      AND ngayDat >= DATEFROMPARTS(@nam, 1, 1)
      AND ngayDat <  DATEFROMPARTS(@nam + 1, 1, 1)`, '      AND YEAR(ngayDat) = @nam'),
      GIAI_CHAN_DOAN.replace('CREATE INDEX ix_kh_ngay ON dbo.DonHang (khachHangId, ngayDat) INCLUDE (maDon, tongTien);', 'CREATE INDEX ix_kh_ngay ON dbo.DonHang (ngayDat, khachHangId) INCLUDE (maDon, tongTien);'),
      GIAI_CHAN_DOAN.replace('AND ngayDat <  DATEFROMPARTS(@nam + 1, 1, 1)', 'AND ngayDat <= DATEFROMPARTS(@nam, 12, 30)'),
      GIAI_CHAN_DOAN.replace('ORDER BY ngayDat DESC;', 'ORDER BY ngayDat;'),
    ],
    gy: [['Steps: measure → read the plan → make conditions SARGable → design the index → measure again → weigh the cost.', 'Các bước: đo → đọc kế hoạch → làm điều kiện SARGable → thiết kế chỉ mục → đo lại → cân chi phí.'], ['id is the clustered key: every nonclustered index carries it for free, no need to INCLUDE it.', 'id là khoá cụm: mọi chỉ mục nonclustered mang nó miễn phí, không cần INCLUDE.']],
    lhg: [['Adding the index but keeping YEAR(): it still seeks on the customer (only 10 orders each here) — and breaks the day a customer has 10,000 orders.', 'Thêm chỉ mục nhưng giữ YEAR(): vẫn seek theo khách (ở đây mỗi khách 10 đơn) — và hỏng vào ngày một khách có 10.000 đơn.'], ['Ending the range at 12-30 or with <= 12-31 on a DATETIME — the half-open range has no such edge cases.', 'Kết thúc khoảng ở 12-30 hoặc <= 12-31 trên DATETIME — khoảng nửa mở không có các ca biên đó.']],
    gt: ['<p>Before: 661 logical reads, Sort + Clustered Index Scan. After: one Index Seek, ORDERED BACKWARD — measured through the procedure: 12 logical reads instead of 661. If an index on khachHangId alone existed, it is now redundant (this one\'s leftmost prefix does its job) — drop it in step 6.</p>', '<p>Trước: 661 logical reads, Sort + Clustered Index Scan. Sau: một Index Seek, ORDERED BACKWARD — đo qua procedure: 12 logical reads thay vì 661. Nếu đã có chỉ mục chỉ trên khachHangId thì giờ nó thừa (tiền tố trái của chỉ mục này làm thay) — bỏ nó ở bước 6.</p>'],
    tn: [tn('logical reads', 'số trang đọc logic'), tn('ORDERED BACKWARD', 'đọc ngược thứ tự chỉ mục')],
  }),
]);
