/**
 * DBI202 · ⭐ CS.2 — bài tập "đoán trước rồi đo": số dòng mỗi trang đo thật bằng DMV (chạy trên SQL Server của người học), seek vs
 * quét, trần 8060 byte, nhật ký của DELETE, thống kê cũ, plan cache. Số trong đề đã đo thật trên SQL Server (Azure SQL Edge).
 */
import { mod, cs, q, bang1, tsql, ck, tn } from './_chung.mjs';

const GIAI1 = `CREATE TABLE dbo.SanPham (            -- a heap: no PRIMARY KEY, no index
    ma  INT       NOT NULL,
    ten CHAR(100) NOT NULL,
    gia INT       NOT NULL
);
GO
-- 1000 rows in ONE set-based INSERT (no WHILE loop): a numbers CTE over a system view
WITH n AS (
    SELECT TOP (1000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
    FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.SanPham (ma, ten, gia)
SELECT rn, CONCAT('SP', rn), 1000 * rn FROM n;
GO
CREATE OR ALTER VIEW dbo.vPageStats AS
SELECT CAST(avg_record_size_in_bytes AS INT) AS byte_moi_dong,
       page_count                            AS so_trang
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID(N'dbo.SanPham'), NULL, NULL, 'DETAILED');`;

export default mod('dbi202-cs2-on', '⭐ CS.2 Exercises: inside a DBMS', [
  tsql({
    t: 'Exercise 1 — 1,000 rows, predicted pages, then proved with a DMV', k: 'MEDIUM', p: 15,
    kn: ['rows per page', 'set-based INSERT', 'sys.dm_db_index_physical_stats'], tag: ['advanced', 'internals', 'storage'],
    lyDo: ['The browser grader is PostgreSQL in WASM: it has no SQL Server pages, no sys.all_columns and no sys.dm_db_index_physical_stats, so the page count can only be measured on a real SQL Server.', 'Máy chấm trình duyệt là PostgreSQL trong WASM: không có trang SQL Server, không có sys.all_columns hay sys.dm_db_index_physical_stats, nên số trang chỉ đo được trên SQL Server thật.'],
    en: `<p>Predict first, on paper: table <code>SanPham(ma INT, ten CHAR(100), gia INT)</code>, all NOT NULL, a heap, 1,000 rows. Bytes per row? Rows per page? Pages? (Slides 10–12: data + 7 bytes per row, + 2-byte slot, 8096 usable bytes.)</p>
<p>Then prove it on your SQL Server:</p>
<ol><li>Create <code>dbo.SanPham</code> as a heap (no key, no index).</li>
<li>Insert exactly 1,000 rows, <code>ma</code> = 1…1000, <code>ten</code> = 'SP' + ma, <code>gia</code> = 1000 × ma, with <b>one set-based INSERT</b> (no loop).</li>
<li>Create the view <code>dbo.vPageStats(byte_moi_dong, so_trang)</code> that reads <code>sys.dm_db_index_physical_stats</code> for that table.</li></ol>
<p>check.sql verifies the rows and that your view reports exactly what the formula predicts.</p>`,
    vi: `<p>Đoán trước, trên giấy: bảng <code>SanPham(ma INT, ten CHAR(100), gia INT)</code>, mọi cột NOT NULL, là heap, 1.000 dòng. Byte mỗi dòng? Dòng mỗi trang? Số trang? (Slide 10–12: dữ liệu + 7 byte mỗi dòng, + 2 byte slot, 8096 byte dùng được.)</p>
<p>Rồi chứng minh trên SQL Server của bạn:</p>
<ol><li>Tạo <code>dbo.SanPham</code> dạng heap (không khoá, không chỉ mục).</li>
<li>Chèn đúng 1.000 dòng, <code>ma</code> = 1…1000, <code>ten</code> = 'SP' + ma, <code>gia</code> = 1000 × ma, bằng <b>một câu INSERT theo tập</b> (không vòng lặp).</li>
<li>Tạo view <code>dbo.vPageStats(byte_moi_dong, so_trang)</code> đọc <code>sys.dm_db_index_physical_stats</code> cho bảng đó.</li></ol>
<p>check.sql kiểm các dòng và việc view báo đúng số mà công thức dự đoán.</p>`,
    yc: [['A numbers CTE: SELECT TOP (1000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) FROM sys.all_columns a CROSS JOIN sys.all_columns b.', 'CTE sinh số: SELECT TOP (1000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) FROM sys.all_columns a CROSS JOIN sys.all_columns b.'], ["Use the 'DETAILED' mode of the DMV so that avg_record_size_in_bytes is filled.", "Dùng chế độ 'DETAILED' của DMV để avg_record_size_in_bytes có giá trị."]],
    setup: `-- Nothing to prepare: you create dbo.SanPham yourself in solution.sql.
SELECT 1 AS ready;`,
    khoi: `-- 1) CREATE TABLE dbo.SanPham (...)   -- a heap
-- 2) one set-based INSERT of 1000 rows
-- 3) CREATE OR ALTER VIEW dbo.vPageStats AS ...`,
    giai: GIAI1,
    kiem: [
      ck(['1,000 rows, ma = 1…1000, gia = 1000 × ma', '1.000 dòng, ma = 1…1000, gia = 1000 × ma'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.SanPham) = 1000 AND (SELECT COUNT(DISTINCT ma) FROM dbo.SanPham) = 1000 AND (SELECT MIN(ma) FROM dbo.SanPham) = 1 AND (SELECT MAX(ma) FROM dbo.SanPham) = 1000 AND NOT EXISTS (SELECT 1 FROM dbo.SanPham WHERE gia <> 1000 * ma OR RTRIM(ten) <> CONCAT('SP', ma)), 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM dbo.SanPham));`),
      ck(['The table is a heap with the three NOT NULL columns of the task', 'Bảng là heap với ba cột NOT NULL như đề'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.SanPham') AND index_id = 0) AND (SELECT COUNT(*) FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.SanPham')) = 1
  AND (SELECT COUNT(*) FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.SanPham') AND c.is_nullable = 0 AND ((c.name = 'ma' AND t.name = 'int') OR (c.name = 'ten' AND t.name = 'char' AND c.max_length = 100) OR (c.name = 'gia' AND t.name = 'int'))) = 3
  AND (SELECT COUNT(*) FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.SanPham')) = 3, 1, 0);
SET @info = N'expected a heap (ma INT, ten CHAR(100), gia INT), all NOT NULL';`),
      ck(['vPageStats reports 115 bytes per row', 'vPageStats báo 115 byte mỗi dòng'], `SET @ok = IIF((SELECT byte_moi_dong FROM dbo.vPageStats) = 115, 1, 0);
SET @info = CONCAT(N'byte_moi_dong = ', (SELECT TOP (1) byte_moi_dong FROM dbo.vPageStats), N' (4 + 100 + 4 + 7)');`),
      ck(['vPageStats reports 15 pages = ceiling(1000 / 69)', 'vPageStats báo 15 trang = làm tròn lên 1000 / 69'], `SET @ok = IIF((SELECT so_trang FROM dbo.vPageStats) = 15, 1, 0);
SET @info = CONCAT(N'so_trang = ', (SELECT TOP (1) so_trang FROM dbo.vPageStats));`),
    ],
    saiTay: [
      GIAI1.replace('ten CHAR(100) NOT NULL', 'ten VARCHAR(100) NOT NULL'),
      GIAI1.replace('SELECT TOP (1000)', 'SELECT TOP (999)'),
      GIAI1.replace("CAST(avg_record_size_in_bytes AS INT) AS byte_moi_dong", 'CAST(record_count AS INT) AS byte_moi_dong'),
      GIAI1.replace('    ma  INT       NOT NULL,\n', '    ma  INT       NOT NULL PRIMARY KEY,\n'),
    ],
    gy: [['4 + 100 + 4 + 7 = 115; 8096 / 117 = 69; 1000 / 69 → 15.', '4 + 100 + 4 + 7 = 115; 8096 / 117 = 69; 1000 / 69 → 15.'], ['TOP (n) + ROW_NUMBER() over a cross join of a system view is the classic loop-free number generator.', 'TOP (n) + ROW_NUMBER() trên phép nối chéo một view hệ thống là cách sinh số kinh điển không cần vòng lặp.']],
    lhg: [['VARCHAR(100) holding "SP1"… — rows become tiny and the page count drops: the formula is for fixed-length columns.', 'VARCHAR(100) chứa "SP1"… — dòng rất nhỏ và số trang giảm: công thức dành cho cột cố định.'], ['A WHILE loop of 1,000 single INSERTs — works, but it is 1,000 statements and 1,000 log flushes.', 'Vòng WHILE 1.000 câu INSERT lẻ — chạy được, nhưng là 1.000 câu lệnh và 1.000 lần ghi nhật ký.']],
    gt: ['<p>The prediction and the DMV agree to the byte. On PostgreSQL the same table takes 18 pages: a 24-byte tuple header, 1 byte of length for char(100), 3 bytes of alignment padding and a 4-byte line pointer per row.</p>', '<p>Dự đoán và DMV khớp tới từng byte. Trên PostgreSQL cùng bảng tốn 18 trang: đầu tuple 24 byte, 1 byte độ dài cho char(100), 3 byte đệm căn lề và con trỏ dòng 4 byte mỗi dòng.</p>'],
    tn: [tn('heap', 'bảng heap (không chỉ mục cụm)'), tn('set-based', 'xử lý theo tập'), tn('DMV (dynamic management view)', 'view quản trị động')],
  }),
  cs({
    t: 'Exercise 2 — seek by key vs scan: predict the pages read', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['index seek', 'clustered index scan', 'logical reads'], tag: ['advanced', 'internals', 'performance'],
    en: '<p><code>SanPham(ma INT PRIMARY KEY, ten CHAR(100), gia INT)</code> now has 10,000 rows (69 rows per page ⇒ 145 leaf pages + 1 root, a 2-level clustered index). Predict what <code>SET STATISTICS IO</code> printed.</p>',
    vi: '<p><code>SanPham(ma INT PRIMARY KEY, ten CHAR(100), gia INT)</code> giờ có 10.000 dòng (69 dòng mỗi trang ⇒ 145 trang lá + 1 gốc, chỉ mục cụm 2 tầng). Đoán <code>SET STATISTICS IO</code> đã in gì.</p>',
    bang: [bang1('b1', ['Query → plan → logical reads', 'Truy vấn → kế hoạch → logical reads'],
      [{ ma: 'tv', ten: 'Query / Truy vấn' }, { ma: 'kh', ten: 'Plan', luaChon: ['Clustered Index Seek', 'Clustered Index Scan'] }, { ma: 'lr', ten: 'Logical reads', luaChon: ['2', '147', '10000', '1'] }],
      [{ o: { tv: 'SELECT gia FROM SanPham WHERE ma = 5000' }, a: { kh: 'Clustered Index Seek', lr: '2' } },
        { o: { tv: "SELECT gia FROM SanPham WHERE ten = 'SP5000'" }, a: { kh: 'Clustered Index Scan', lr: '147' } }],
      ['Seek = root + one leaf = 2 pages. No index on ten ⇒ every leaf page (145) plus 2 more pages touched on the way = 147. Same single row returned, 73× more pages.', 'Seek = gốc + một lá = 2 trang. Không có chỉ mục trên ten ⇒ mọi trang lá (145) cộng 2 trang chạm trên đường đi = 147. Cùng một dòng trả về, nhiều gấp 73 lần trang.'])],
    gy: [['A 2-level tree means a seek reads 2 pages.', 'Cây 2 tầng nghĩa là seek đọc 2 trang.'], ['No usable index ⇒ read every leaf page.', 'Không có chỉ mục dùng được ⇒ đọc mọi trang lá.']],
    lhg: [['Answering 10,000 — reads are counted in pages, not rows.', 'Trả lời 10.000 — số đọc tính theo trang, không theo dòng.'], ['"It returns one row, so it is cheap."', '"Nó trả một dòng nên rẻ."']],
    tn: [tn('index seek', 'tìm theo chỉ mục'), tn('index scan', 'quét chỉ mục')],
  }),
  cs({
    t: 'Exercise 3 — which CREATE TABLE breaks the 8060-byte rule?', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['8060-byte row limit', 'NCHAR', 'ROW_OVERFLOW_DATA', 'TOAST'], tag: ['advanced', 'internals', 'storage'],
    en: '<p>Three designs, all columns NOT NULL. What happens on SQL Server, and on PostgreSQL (with the equivalent types)?</p>',
    vi: '<p>Ba thiết kế, mọi cột NOT NULL. Chuyện gì xảy ra trên SQL Server, và trên PostgreSQL (với kiểu tương đương)?</p>',
    bang: [bang1('b1', ['Design → SQL Server → PostgreSQL', 'Thiết kế → SQL Server → PostgreSQL'],
      [{ ma: 'tk', ten: 'Design / Thiết kế' },
        { ma: 'ss', ten: 'SQL Server', luaChon: ['created, the row fits (8007 bytes)', 'Msg 1701: minimum row size 8107 > 8060', 'created; long values overflow off-row'] },
        { ma: 'pg', ten: 'PostgreSQL', luaChon: ['created (long values go to TOAST)', 'refused at CREATE time'] }],
      [{ o: { tk: 'x CHAR(4000), y CHAR(4000)' }, a: { ss: 'created, the row fits (8007 bytes)', pg: 'created (long values go to TOAST)' } },
        { o: { tk: 'x NCHAR(4000), y CHAR(100)' }, a: { ss: 'Msg 1701: minimum row size 8107 > 8060', pg: 'created (long values go to TOAST)' } },
        { o: { tk: 'x NVARCHAR(4000), y NVARCHAR(4000)' }, a: { ss: 'created; long values overflow off-row', pg: 'created (long values go to TOAST)' } }],
      ['NCHAR is 2 bytes per character: 8000 + 100 + 7 = 8107. Variable-length columns may total more than 8060 (ROW_OVERFLOW_DATA). PostgreSQL has no fixed in-row limit at CREATE time.', 'NCHAR tốn 2 byte mỗi ký tự: 8000 + 100 + 7 = 8107. Cột độ dài thay đổi được phép tổng vượt 8060 (ROW_OVERFLOW_DATA). PostgreSQL không có trần trong dòng cố định lúc CREATE.'])],
    gy: [['Add 7 bytes of overhead to fixed-length totals.', 'Cộng 7 byte phụ phí vào tổng cột cố định.'], ['N = 2 bytes per character.', 'N = 2 byte mỗi ký tự.']],
    lhg: [['Thinking CHAR(4000) + CHAR(4000) fails — 8007 still fits.', 'Tưởng CHAR(4000) + CHAR(4000) lỗi — 8007 vẫn vừa.'], ['Thinking NVARCHAR(4000) × 2 fails — variable-length columns may overflow.', 'Tưởng NVARCHAR(4000) × 2 lỗi — cột thay đổi được tràn.']],
    tn: [tn('row size limit', 'giới hạn kích thước dòng')],
  }),
  cs({
    t: 'Exercise 4 — the log, the statistics and the plan cache: predict, then explain', k: 'HARD', p: 9,
    kn: ['transaction log', 'ROLLBACK', 'MVCC', 'statistics', 'plan cache'], tag: ['advanced', 'internals'],
    en: '<p>Three experiments from the lesson, each run for real. Predict the outcome.</p>', vi: '<p>Ba thí nghiệm của bài, đều đã chạy thật. Đoán kết quả.</p>',
    cau: [
      q('c1', ['SQL Server: BEGIN TRAN; DELETE the 3 students with id <= 3 (of 4). Log records of this transaction before ROLLBACK?', 'SQL Server: BEGIN TRAN; DELETE 3 sinh viên có id <= 3 (trên 4). Bản ghi nhật ký của giao dịch trước ROLLBACK?'], ['1 LOP_BEGIN_XACT + 3 LOP_DELETE_ROWS', '1 LOP_BEGIN_XACT + 1 LOP_DELETE_ROWS for the batch', 'none until COMMIT is reached', '3 LOP_DELETE_ROWS + 1 LOP_COMMIT_XACT'], ['One log record per deleted row, each with enough of the row to put it back. ROLLBACK reads them backwards ⇒ 4 rows again.', 'Mỗi dòng xoá một bản ghi nhật ký, đủ để đặt dòng lại. ROLLBACK đọc ngược chúng ⇒ lại 4 dòng.']),
      q('c2', ['PostgreSQL: the same DELETE, then ROLLBACK. What does PostgreSQL have to undo?', 'PostgreSQL: cùng câu DELETE rồi ROLLBACK. PostgreSQL phải hoàn tác gì?'], ['nothing: the rows only got xmax stamped, and the aborted xid is ignored', 'it re-inserts the 3 rows from the WAL', 'it restores the page from the last checkpoint', 'it must run VACUUM FULL before readers continue'], ['MVCC keeps old versions in place; an aborted transaction\'s stamps are simply ignored.', 'MVCC giữ phiên bản cũ tại chỗ; dấu của giao dịch bị huỷ đơn giản là bị bỏ qua.']),
      q('c3', ['Statistics saw 1,000 rows of status A; then 5,000 rows of B arrive (auto-update off). WHERE status = \'B\' is planned as…', 'Thống kê thấy 1.000 dòng trạng thái A; rồi 5.000 dòng B đến (tắt tự cập nhật). WHERE status = \'B\' được lập kế hoạch là…'], ['index seek + 5,000 key lookups: the estimate was only 77 rows', 'clustered index scan, the right plan for 5 rows out of 6', 'a hash join between the index and the table', 'a parallel scan, since the table just grew'], ['After UPDATE STATISTICS … WITH FULLSCAN the estimate becomes 5000 and the plan switches to a scan.', 'Sau UPDATE STATISTICS … WITH FULLSCAN ước lượng thành 5000 và kế hoạch chuyển sang quét.']),
      q('c4', ['The same query runs 3× with literals (4000, 6000, 9000) and 3× via sp_executesql with @g. Plans in the cache?', 'Cùng truy vấn chạy 3 lần với hằng (4000, 6000, 9000) và 3 lần qua sp_executesql với @g. Số kế hoạch trong cache?'], ['3 ad hoc plans used once each + 1 prepared plan used 3 times', '1 shared plan reused by all six executions', '6 plans, one per execution, each used once', '2 plans, one ad hoc and one prepared, 3 uses each'], ['Different text = different plan. A parameterized statement compiles once and is reused.', 'Văn bản khác = kế hoạch khác. Câu tham số hoá biên dịch một lần và được dùng lại.']),
    ],
    gy: [['SQL Server undoes from the log; PostgreSQL just ignores aborted versions.', 'SQL Server hoàn tác từ nhật ký; PostgreSQL chỉ bỏ qua phiên bản bị huỷ.'], ['Estimated vs actual rows off by 10× ⇒ statistics.', 'Ước lượng lệch thực tế 10× ⇒ thống kê.']],
    lhg: [['Thinking log records are written only at COMMIT.', 'Tưởng bản ghi nhật ký chỉ được ghi lúc COMMIT.'], ['Thinking SQL Server auto-parameterizes every literal query.', 'Tưởng SQL Server tự tham số hoá mọi truy vấn có hằng.']],
    tn: [tn('rollback', 'hoàn tác'), tn('ad hoc query', 'truy vấn tuỳ biến')],
  }),
]);
