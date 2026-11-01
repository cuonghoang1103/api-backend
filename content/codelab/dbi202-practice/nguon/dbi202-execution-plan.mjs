/**
 * DBI202 · 8.2 Clustered và nonclustered, chỉ mục ghép (luật tiền tố trái), đọc kế hoạch thực thi — hai đề chạy trên SQL Server
 * (CLUSTERED/NONCLUSTERED và thứ tự khoá chỉ có ý nghĩa trên máy thật) + hai bộ câu hỏi.
 */
import { mod, cs, q, bang1, tsql, ck, tn } from './_chung.mjs';

const KH = `CREATE TABLE Customer (
    customerID INT           NOT NULL,
    lastName   NVARCHAR(40)  NOT NULL,
    firstName  NVARCHAR(40)  NOT NULL,
    city       NVARCHAR(30)  NOT NULL,
    CONSTRAINT pk_customer PRIMARY KEY (customerID)
);
INSERT INTO Customer VALUES (1, N'Nguyễn', N'An', N'Hà Nội'), (2, N'Trần', N'Bình', N'Huế'), (3, N'Nguyễn', N'Chi', N'Đà Nẵng');`;
const GHEP = `CREATE INDEX ix_customer_name ON Customer (lastName, firstName);   -- equality column first, then the second search column`;
const COLS = (bang, idx) => `SELECT c.name AS col, ic.key_ordinal FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.${bang}') AND i.name = N'${idx}' AND ic.is_included_column = 0`;

const DON = `CREATE TABLE Orders (                                   -- created as a HEAP: no primary key, no clustered index
    orderID    INT           NOT NULL,
    customerID INT           NOT NULL,
    orderDate  DATE          NOT NULL,
    total      DECIMAL(12,0) NOT NULL
);
INSERT INTO Orders VALUES (1, 10, '2026-10-01', 500000), (2, 11, '2026-10-01', 120000), (3, 10, '2026-10-03', 80000);`;
const CLUS = `ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY NONCLUSTERED (orderID);   -- uniqueness, without owning the physical order
CREATE CLUSTERED INDEX cix_orders_date ON Orders (orderDate, orderID);               -- the table itself is now kept in date order`;

export default mod('dbi202-execution-plan', '8.2 Clustered vs nonclustered & reading a plan', [
  tsql({
    t: 'Composite index: the column order that serves both queries', k: 'MEDIUM', p: 12,
    kn: ['composite index', 'leftmost-prefix rule'], tag: ['tsql', 'index', 'composite'],
    lyDo: ['The point is the KEY ORDER of a SQL Server index, read from sys.index_columns, and the seek you see in the SSMS plan.', 'Trọng tâm là THỨ TỰ KHOÁ của chỉ mục SQL Server, đọc từ sys.index_columns, và thao tác seek bạn thấy trong kế hoạch của SSMS.'],
    en: '<p>Two frequent queries on <code>Customer</code>: (A) <code>WHERE lastName = @l AND firstName = @f</code> and (B) <code>WHERE lastName = @l</code>. Create ONE index <code>ix_customer_name</code> that lets both use an Index Seek.</p>',
    vi: '<p>Hai truy vấn thường gặp trên <code>Customer</code>: (A) <code>WHERE lastName = @l AND firstName = @f</code> và (B) <code>WHERE lastName = @l</code>. Tạo MỘT chỉ mục <code>ix_customer_name</code> để cả hai dùng được Index Seek.</p>',
    yc: [['A two-column key; think about which column every query mentions.', 'Khoá hai cột; nghĩ xem cột nào truy vấn nào cũng nhắc tới.'], ['Then run both queries with the plan on (Ctrl+M).', 'Rồi chạy hai truy vấn với kế hoạch bật (Ctrl+M).']],
    setup: KH,
    khoi: `-- CREATE INDEX ix_customer_name ON Customer (..., ...);
`,
    giai: GHEP,
    kiem: [
      ck(['The index has exactly two key columns', 'Chỉ mục có đúng hai cột khoá'], `SET @ok = IIF((SELECT COUNT(*) FROM (${COLS('Customer', 'ix_customer_name')}) x) = 2, 1, 0); SET @info = CONCAT(N'key columns: ', (SELECT COUNT(*) FROM (${COLS('Customer', 'ix_customer_name')}) x));`),
      ck(['lastName is the FIRST key column', 'lastName là cột khoá THỨ NHẤT'], `SET @ok = IIF(EXISTS (SELECT 1 FROM (${COLS('Customer', 'ix_customer_name')}) x WHERE x.col = N'lastName' AND x.key_ordinal = 1), 1, 0); SET @info = N'query B searches lastName alone: it must be the leading column';`),
      ck(['firstName is the second key column', 'firstName là cột khoá thứ hai'], `SET @ok = IIF(EXISTS (SELECT 1 FROM (${COLS('Customer', 'ix_customer_name')}) x WHERE x.col = N'firstName' AND x.key_ordinal = 2), 1, 0); SET @info = N'expected (lastName, firstName)';`),
    ],
    saiTay: ['CREATE INDEX ix_customer_name ON Customer (firstName, lastName);', 'CREATE INDEX ix_customer_name ON Customer (lastName);'],
    gy: [['A composite index is sorted by the first column, then by the second inside equal first values — like a phone book (last name, first name).', 'Chỉ mục ghép sắp theo cột đầu, rồi theo cột hai trong cùng giá trị cột đầu — như danh bạ (họ, tên).'], ['A query that does not give the first column cannot seek: (firstName, lastName) does not help query B.', 'Truy vấn không cho cột đầu thì không seek được: (firstName, lastName) không giúp truy vấn B.']],
    lhg: [['(firstName, lastName) — query B (lastName only) scans.', '(firstName, lastName) — truy vấn B (chỉ lastName) phải quét.'], ['Only (lastName) — query A must still filter firstName after the seek (fine, but the two-column key is better).', 'Chỉ (lastName) — truy vấn A còn phải lọc firstName sau seek (được, nhưng khoá hai cột tốt hơn).']],
    gt: ['<p>Leftmost-prefix rule: an index on (a, b, c) serves a, (a, b) and (a, b, c), not b or c alone.</p>', '<p>Luật tiền tố trái: chỉ mục (a, b, c) phục vụ a, (a, b) và (a, b, c), không phục vụ riêng b hay c.</p>'],
    tn: [tn('composite index', 'chỉ mục ghép'), tn('leftmost prefix', 'tiền tố trái')],
  }),
  tsql({
    t: 'Clustered vs nonclustered: put the table in date order', k: 'HARD', p: 14,
    kn: ['clustered index', 'PRIMARY KEY NONCLUSTERED', 'heap'], tag: ['tsql', 'index', 'clustered'],
    lyDo: ['CLUSTERED / NONCLUSTERED and heaps are SQL Server storage concepts checked in sys.indexes (PostgreSQL has no clustered index in this sense).', 'CLUSTERED / NONCLUSTERED và heap là khái niệm lưu trữ của SQL Server, kiểm trong sys.indexes (PostgreSQL không có chỉ mục clustered theo nghĩa này).'],
    en: '<p><code>Orders</code> was created as a heap (no primary key). Almost every query reads a range of dates. (1) Add the primary key <code>pk_orders</code> on orderID as <b>NONCLUSTERED</b>; (2) create the clustered index <code>cix_orders_date</code> on <code>(orderDate, orderID)</code> so the rows are physically kept in date order.</p>',
    vi: '<p><code>Orders</code> được tạo dạng heap (không khoá chính). Hầu hết truy vấn đọc một khoảng ngày. (1) Thêm khoá chính <code>pk_orders</code> trên orderID dạng <b>NONCLUSTERED</b>; (2) tạo chỉ mục clustered <code>cix_orders_date</code> trên <code>(orderDate, orderID)</code> để các dòng được lưu vật lý theo thứ tự ngày.</p>',
    yc: [['ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY NONCLUSTERED (orderID);', 'ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY NONCLUSTERED (orderID);'], ['CREATE CLUSTERED INDEX cix_orders_date ON Orders (orderDate, orderID);', 'CREATE CLUSTERED INDEX cix_orders_date ON Orders (orderDate, orderID);']],
    setup: DON,
    khoi: `-- ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY ... (orderID);
-- CREATE ... INDEX cix_orders_date ON Orders (...);
`,
    giai: CLUS,
    kiem: [
      ck(['pk_orders is a NONCLUSTERED primary key on orderID', 'pk_orders là khoá chính NONCLUSTERED trên orderID'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Orders') AND name = N'pk_orders' AND is_primary_key = 1 AND type_desc = N'NONCLUSTERED'), 1, 0);
SET @info = (SELECT CONCAT(N'pk_orders is ', type_desc) FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Orders') AND name = N'pk_orders');`),
      ck(['cix_orders_date is the CLUSTERED index on (orderDate, orderID)', 'cix_orders_date là chỉ mục CLUSTERED trên (orderDate, orderID)'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Orders') AND name = N'cix_orders_date' AND type_desc = N'CLUSTERED')
  AND EXISTS (SELECT 1 FROM (${COLS('Orders', 'cix_orders_date')}) x WHERE x.col = N'orderDate' AND x.key_ordinal = 1)
  AND EXISTS (SELECT 1 FROM (${COLS('Orders', 'cix_orders_date')}) x WHERE x.col = N'orderID' AND x.key_ordinal = 2), 1, 0);
SET @info = N'expected CREATE CLUSTERED INDEX cix_orders_date ON Orders (orderDate, orderID)';`),
      ck(['The table is no longer a heap and duplicates of orderID are rejected', 'Bảng không còn là heap và orderID trùng bị từ chối'], `DECLARE @n INT = 0; BEGIN TRAN; BEGIN TRY INSERT INTO Orders VALUES (1, 12, '2026-10-05', 1); END TRY BEGIN CATCH SET @n = 1; END CATCH; IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@n = 1 AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Orders') AND type_desc = N'HEAP'), 1, 0); SET @info = N'a primary key on orderID must reject a second order 1';`),
    ],
    saiTay: ['ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY (orderID);', "ALTER TABLE Orders ADD CONSTRAINT pk_orders PRIMARY KEY NONCLUSTERED (orderID);\nCREATE NONCLUSTERED INDEX cix_orders_date ON Orders (orderDate, orderID);"],
    gy: [['A table has at most ONE clustered index — it IS the table, sorted by its key.', 'Một bảng có tối đa MỘT chỉ mục clustered — nó CHÍNH LÀ bảng, sắp theo khoá của nó.'], ['PRIMARY KEY is clustered by default on SQL Server — say NONCLUSTERED to keep the clustered slot for orderDate.', 'PRIMARY KEY mặc định là clustered trên SQL Server — ghi NONCLUSTERED để dành chỗ clustered cho orderDate.']],
    lhg: [['PRIMARY KEY without NONCLUSTERED — it takes the clustered slot, and CREATE CLUSTERED INDEX then fails ("Cannot create more than one clustered index").', 'PRIMARY KEY không ghi NONCLUSTERED — nó chiếm chỗ clustered, và CREATE CLUSTERED INDEX lỗi ("Cannot create more than one clustered index").'], ['A NONCLUSTERED index on orderDate — the table stays a heap.', 'Chỉ mục NONCLUSTERED trên orderDate — bảng vẫn là heap.']],
    gt: ['<p>Range queries on the clustered key read consecutive pages. Adding orderID makes the clustered key unique (otherwise SQL Server adds a hidden "uniquifier").</p>', '<p>Truy vấn khoảng trên khoá clustered đọc các trang liên tiếp. Thêm orderID làm khoá clustered duy nhất (nếu không SQL Server tự thêm "uniquifier" ẩn).</p>'],
    tn: [tn('clustered index', 'chỉ mục cụm'), tn('heap', 'bảng không có chỉ mục cụm')],
  }),
  cs({
    t: 'Read the plan: what does each operator mean?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['execution plan operators'], tag: ['execution-plan'],
    en: '<p>Lesson 8.2: match each operator you see in an SSMS plan (Ctrl+M) with what it means.</p>',
    vi: '<p>Bài 8.2: ghép mỗi toán tử thấy trong kế hoạch SSMS (Ctrl+M) với ý nghĩa của nó.</p>',
    bang: [bang1('b1', ['Operator → meaning', 'Toán tử → ý nghĩa'],
      [{ ma: 'op', ten: 'Operator / Toán tử' }, { ma: 'yn', ten: 'Meaning / Ý nghĩa', luaChon: ['every row of a heap is read', 'every row of the clustered index (the table) is read', 'the B-tree is entered by key to reach only matching rows', 'for each row found in a nonclustered index, fetch the missing columns from the table', 'every leaf page of a nonclustered index is read'] }],
      [{ o: { op: 'Table Scan' }, a: { yn: 'every row of a heap is read' } },
        { o: { op: 'Clustered Index Scan' }, a: { yn: 'every row of the clustered index (the table) is read' } },
        { o: { op: 'Index Seek' }, a: { yn: 'the B-tree is entered by key to reach only matching rows' } },
        { o: { op: 'Key Lookup' }, a: { yn: 'for each row found in a nonclustered index, fetch the missing columns from the table' } },
        { o: { op: 'Index Scan' }, a: { yn: 'every leaf page of a nonclustered index is read' } }],
      ['Scan = read everything; Seek = navigate by key. Key Lookup is the price of an index that does not cover the query — remove it with INCLUDE (lesson 8.B).', 'Scan = đọc hết; Seek = đi theo khoá. Key Lookup là cái giá của chỉ mục không phủ truy vấn — xoá nó bằng INCLUDE (bài 8.B).'])],
    gy: [['Heap ⇒ Table Scan; clustered table ⇒ Clustered Index Scan.', 'Heap ⇒ Table Scan; bảng clustered ⇒ Clustered Index Scan.'], ['Seek needs a usable leading key column in the predicate.', 'Seek cần cột khoá đầu dùng được trong điều kiện.']],
    lhg: [['Thinking Clustered Index Scan is cheap because it says "index" — it reads the whole table.', 'Tưởng Clustered Index Scan rẻ vì có chữ "index" — nó đọc cả bảng.'], ['Ignoring Key Lookups repeated thousands of times.', 'Bỏ qua Key Lookup lặp hàng nghìn lần.']],
    tn: [tn('execution plan', 'kế hoạch thực thi')],
  }),
  cs({
    t: 'Which queries can seek on an index (x, y, z)?', k: 'MEDIUM', p: 6,
    kn: ['leftmost-prefix rule'], tag: ['index', 'composite'],
    en: '<p>Index <code>ix ON T (x, y, z)</code>.</p>', vi: '<p>Chỉ mục <code>ix ON T (x, y, z)</code>.</p>',
    cau: [
      q('c1', ['WHERE x = 1 AND y = 2', 'WHERE x = 1 AND y = 2'], ['seek on the pair (x, y)', 'a full scan only, no seek', 'seek on y alone, x checked later', 'seek on z alone, x and y checked'], ['The leading prefix (x, y) is given.', 'Có tiền tố đầu (x, y).']),
      q('c2', ['WHERE y = 2 AND z = 3', 'WHERE y = 2 AND z = 3'], ['no seek: leading column x missing', 'seek on the pair (y, z)', 'seek on z, then y is filtered', 'seek on all three (x, y, z)'], ['Without x, the index order does not help.', 'Thiếu x thì thứ tự chỉ mục không giúp được.']),
      q('c3', ['WHERE x = 1 AND z = 3', 'WHERE x = 1 AND z = 3'], ['seek on x, then z filters those rows', 'seek on the pair (x, z) at once', 'no seek at all, a full scan', 'seek on z alone, x filtered later'], ['The prefix stops at the first missing column (y); z becomes a residual filter.', 'Tiền tố dừng ở cột đầu tiên bị thiếu (y); z thành điều kiện lọc phụ.']),
      q('c4', ['WHERE x > 5 AND y = 2', 'WHERE x > 5 AND y = 2'], ['seek on the x range; y filtered inside', 'seek on (x, y) as two equalities', 'no seek, the range kills the index', 'seek on y first, then the x range'], ['After a range on a column, the following key columns cannot narrow the seek.', 'Sau một khoảng trên một cột, các cột khoá sau không thu hẹp seek được nữa.']),
    ],
    gy: [['Read the key left to right; stop at the first column without an equality predicate.', 'Đọc khoá từ trái sang phải; dừng ở cột đầu tiên không có điều kiện bằng.'], ['Equality columns first, range column last, when you design a composite index.', 'Khi thiết kế chỉ mục ghép: cột so bằng trước, cột khoảng sau cùng.']],
    lhg: [['Assuming any subset of the columns can seek.', 'Tưởng tập con cột nào cũng seek được.'], ['Putting the range column first in a composite index.', 'Đặt cột khoảng lên đầu chỉ mục ghép.']],
    tn: [tn('residual predicate', 'điều kiện lọc phụ')],
  }),
]);
