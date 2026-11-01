/**
 * DBI202 · 8.B Slide trường Chương 7 (22–41) — chỉ mục (seek/scan, INCLUDE phủ truy vấn, khi nào chỉ mục vô dụng), view
 * (SELECT * bị "đóng băng", view cập nhật được), tối ưu truy vấn (SARGable).
 */
import { mod, de, cs, q, kq, kqAn, sau, ma, tsql, ck, FUH, tn } from './_chung.mjs';

const STUDENT = `CREATE TABLE dbo.Student (
    id     INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
    name   NVARCHAR(50) NOT NULL,
    salary DECIMAL(10,0) NOT NULL,
    city   NVARCHAR(30) NOT NULL
);
GO
WITH n AS (SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn FROM sys.all_columns a CROSS JOIN sys.all_columns b)
INSERT INTO dbo.Student (id, name, salary, city)
SELECT rn, CONCAT(N'Student', rn), 5000000 + rn, CASE rn % 3 WHEN 0 THEN N'Hà Nội' WHEN 1 THEN N'Đà Nẵng' ELSE N'Huế' END FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;`;
const IDX = `CREATE NONCLUSTERED INDEX idx_student_name_covering
    ON dbo.Student (name)          -- the column the WHERE searches on: the KEY
    INCLUDE (salary);              -- the extra column the SELECT needs: carried in the leaf level`;
const IDXCOLS = `SELECT c.name AS col, ic.key_ordinal, ic.is_included_column
FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = OBJECT_ID(N'dbo.Student') AND i.name = N'idx_student_name_covering'`;

export default mod('dbi202-slide-dbi8-2', '8.B Indexes, views & query optimization (slides 22–41)', [
  tsql({
    t: 'A covering index: key + INCLUDE, so the query never touches the table', k: 'MEDIUM', p: 14,
    kn: ['nonclustered index', 'INCLUDE', 'covering index', 'key lookup'], tag: ['tsql', 'index', 'slide'],
    lyDo: ['NONCLUSTERED and INCLUDE are SQL Server index options, and the proof is the index structure in sys.index_columns (and the plan in SSMS).', 'NONCLUSTERED và INCLUDE là tuỳ chọn chỉ mục của SQL Server, và bằng chứng là cấu trúc chỉ mục trong sys.index_columns (và kế hoạch trong SSMS).'],
    en: '<p>Slides 24–25: the setup builds a 30,000-row <code>Student(id PK, name, salary, city)</code>. The hot query is <code>SELECT id, name, salary FROM dbo.Student WHERE name = N\'Mary\'</code>. Create <code>idx_student_name_covering</code> so the query is answered <b>from the index alone</b>: key on <code>name</code>, <code>salary</code> carried with INCLUDE (id comes for free: it is the clustered key).</p><p>Then look at the plan yourself (Ctrl+M in SSMS): Index Seek, no Key Lookup.</p>',
    vi: '<p>Slide 24–25: setup dựng bảng <code>Student(id PK, name, salary, city)</code> 30.000 dòng. Truy vấn nóng là <code>SELECT id, name, salary FROM dbo.Student WHERE name = N\'Mary\'</code>. Tạo <code>idx_student_name_covering</code> để truy vấn được trả lời <b>chỉ từ chỉ mục</b>: khoá trên <code>name</code>, <code>salary</code> mang theo bằng INCLUDE (id có sẵn: nó là khoá clustered).</p><p>Rồi tự xem kế hoạch (Ctrl+M trong SSMS): Index Seek, không có Key Lookup.</p>',
    yc: [['CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (name) INCLUDE (salary);', 'CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (name) INCLUDE (salary);'], ['Do not put salary in the key (it is not searched on) and do not index city.', 'Đừng đưa salary vào khoá (không tìm theo nó) và đừng đánh chỉ mục city.']],
    setup: STUDENT,
    khoi: `-- CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (...) INCLUDE (...);
`,
    giai: IDX,
    kiem: [
      ck(['The index exists and is nonclustered', 'Chỉ mục tồn tại và là nonclustered'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Student') AND name = N'idx_student_name_covering' AND type_desc = N'NONCLUSTERED'), 1, 0); SET @info = N'expected a NONCLUSTERED index named idx_student_name_covering';`),
      ck(['Key = name only', 'Khoá = chỉ name'], `SET @ok = IIF((SELECT COUNT(*) FROM (${IDXCOLS}) x WHERE x.is_included_column = 0) = 1 AND EXISTS (SELECT 1 FROM (${IDXCOLS}) x WHERE x.col = N'name' AND x.key_ordinal = 1), 1, 0);
SET @info = N'the key must be (name) — salary is not searched on';`),
      ck(['salary is an INCLUDEd column', 'salary là cột INCLUDE'], `SET @ok = IIF(EXISTS (SELECT 1 FROM (${IDXCOLS}) x WHERE x.col = N'salary' AND x.is_included_column = 1) AND NOT EXISTS (SELECT 1 FROM (${IDXCOLS}) x WHERE x.col = N'city'), 1, 0);
SET @info = N'INCLUDE (salary), nothing else';`),
    ],
    saiTay: ['CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (name);', 'CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (name, salary);', 'CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student (name) INCLUDE (salary, city);'],
    gy: [['Key columns = what WHERE / JOIN / ORDER BY search on; INCLUDE = what SELECT merely returns.', 'Cột khoá = thứ WHERE / JOIN / ORDER BY tìm theo; INCLUDE = thứ SELECT chỉ trả ra.'], ['Without INCLUDE: Index Seek + Key Lookup back to the table for salary.', 'Không INCLUDE: Index Seek + Key Lookup quay lại bảng lấy salary.']],
    lhg: [['Index on (name) only — every hit pays a Key Lookup for salary.', 'Chỉ mục chỉ (name) — mỗi dòng tìm được trả thêm một Key Lookup lấy salary.'], ['salary in the key — a wider key, more expensive to maintain, no benefit for this query.', 'salary trong khoá — khoá rộng hơn, tốn bảo trì hơn, không lợi gì cho truy vấn này.']],
    gt: ['<p>Clustered key columns (here id) are automatically present in every nonclustered index, which is why the index covers SELECT id, name, salary.</p>', '<p>Cột khoá clustered (ở đây id) tự có mặt trong mọi chỉ mục nonclustered, vì vậy chỉ mục phủ được SELECT id, name, salary.</p>'],
    tn: [tn('covering index', 'chỉ mục phủ'), tn('Key Lookup', 'tra ngược về bảng')],
  }),
  de({
    t: 'SARGable rewrite: let the index be used', k: 'MEDIUM', p: 8,
    kn: ['SARGable predicate', 'function on a column'], tag: ['index', 'sargable', 'fuhcompany', 'slide'],
    en: '<p>Slide 25: an index on empSalary is useless for <code>WHERE empSalary * 12 &gt; 1200000</code> — the column is wrapped in an expression. Rewrite the query so the column stands alone on one side, with the same result: employees whose yearly salary exceeds 1,200,000.</p>',
    vi: '<p>Slide 25: chỉ mục trên empSalary vô dụng với <code>WHERE empSalary * 12 &gt; 1200000</code> — cột bị bọc trong biểu thức. Viết lại để cột đứng một mình ở một vế, cùng kết quả: nhân viên có lương năm trên 1.200.000.</p>',
    yc: [['Columns: <code>empSSN, empName, empSalary</code>.', 'Cột: <code>empSSN, empName, empSalary</code>.'], ['No arithmetic or function on empSalary in the WHERE. Row order does not matter.', 'Không phép tính hay hàm nào trên empSalary trong WHERE. Thứ tự dòng không quan trọng.']],
    giai: `SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary > 100000;        -- 1,200,000 / 12: the arithmetic moves to the constant side`,
    kiem: [kq(['Yearly salary above 1,200,000', 'Lương năm trên 1.200.000']), kqAn(['A boundary salary of exactly 100,000', 'Một lương đúng biên 100.000'], "INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050600, N'Biên', 100000, 1), (30121050601, N'Trên', 100001, 1)"), ma(['empSalary stands alone (no * on it)', 'empSalary đứng một mình (không có * trên nó)'], 'empSalary\\s*[*/+-]|[*/+-]\\s*empSalary\\b', true)],
    sai: [`SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary * 12 > 1200000`, `SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary >= 100000`],
    gy: [['Move the arithmetic to the constant: x * 12 &gt; 1,200,000 ⇔ x &gt; 100,000.', 'Chuyển phép tính sang vế hằng: x * 12 &gt; 1.200.000 ⇔ x &gt; 100.000.'], ['Keep the comparison strict (&gt;) — exactly 100,000 a month is exactly 1,200,000 a year.', 'Giữ so sánh ngặt (&gt;) — đúng 100.000/tháng là đúng 1.200.000/năm.']],
    lhg: [['Leaving empSalary * 12 in the WHERE — correct result, but a full scan on a big table.', 'Để empSalary * 12 trong WHERE — kết quả đúng nhưng quét toàn bảng trên bảng lớn.'], ['&gt;= 100000 — includes the boundary employee (hidden check).', '&gt;= 100000 — lấy cả người đúng biên (kiểm ẩn).']],
    gt: ['<p>SARGable = Search ARGument ABLE: column op constant. The same rule turns YEAR(d) = 2026 into d &gt;= \'2026-01-01\' AND d &lt; \'2027-01-01\' and UPPER(name) = \'MARY\' into name = \'Mary\' (on a case-insensitive collation).</p>', '<p>SARGable = có thể làm đối số tìm kiếm: cột phép-so hằng. Cùng luật biến YEAR(d) = 2026 thành d &gt;= \'2026-01-01\' AND d &lt; \'2027-01-01\' và UPPER(name) = \'MARY\' thành name = \'Mary\' (với collation không phân biệt hoa thường).</p>'],
    tn: [tn('SARGable', 'dùng được chỉ mục')],
  }),
  cs({
    t: 'Seek, scan, and the views of slides 28–41', k: 'MEDIUM', p: 8,
    kn: ['index seek vs scan', 'SELECT * in a view', 'updatable view'], tag: ['index', 'view', 'slide'],
    en: '<p>Indexes and views on SQL Server.</p>', vi: '<p>Chỉ mục và view trên SQL Server.</p>',
    cau: [
      q('c1', ["With an index on name, which predicate CANNOT use an Index Seek?", "Có chỉ mục trên name, điều kiện nào KHÔNG dùng được Index Seek?"], ["name LIKE N'%ary'", "name = N'Mary'", "name LIKE N'Ma%'", "name BETWEEN N'M' AND N'N'"], ['A leading % means "could start with anything": the B-tree order cannot help; a prefix (Ma%) can.', '% ở đầu nghĩa là "bắt đầu bằng gì cũng được": thứ tự cây B không giúp được; tiền tố (Ma%) thì được.']),
      q('c2', ['A view is created as SELECT * FROM tblEmployee. Later a column is added to tblEmployee. The view…', 'View tạo bằng SELECT * FROM tblEmployee. Sau đó thêm cột vào tblEmployee. View…'], ['does not show the new column until sp_refreshview (the column list was fixed at CREATE time)', 'shows the new column automatically on the next SELECT', 'is dropped automatically because its definition changed', 'becomes read-only until it is created again'], ['SELECT * is expanded when the view is created — one more reason to list columns explicitly.', 'SELECT * được mở rộng lúc tạo view — thêm một lý do để liệt kê cột tường minh.']),
      q('c3', ['Through a single-table view without DISTINCT/GROUP BY, can you UPDATE a column that is a plain rename of a base column?', 'Qua view một bảng không DISTINCT/GROUP BY, có UPDATE được cột chỉ là đổi tên của cột gốc?'], ['Yes — SQL Server traces it to exactly one base column', 'No — renamed columns are always read-only', 'Only with WITH CHECK OPTION', 'Only for NVARCHAR columns'], ['A computed column (YEAR(GETDATE()) - YEAR(birth)) cannot be updated; a renamed one can.', 'Cột tính toán (YEAR(GETDATE()) - YEAR(birth)) không cập nhật được; cột đổi tên thì được.']),
      q('c4', ['An UPDATE through a view joining two tables changes columns of BOTH tables. Result?', 'Một UPDATE qua view nối hai bảng đổi cột của CẢ HAI bảng. Kết quả?'], ['error 4405: the modification affects multiple base tables', 'both tables are updated', 'only the first table is updated', 'the view is converted to a table'], ['One UPDATE through a view may touch only one base table (or use an INSTEAD OF trigger).', 'Một UPDATE qua view chỉ được đụng một bảng gốc (hoặc dùng trigger INSTEAD OF).']),
      q('c5', ['The cost of adding indexes is mainly…', 'Cái giá của việc thêm chỉ mục chủ yếu là…'], ['slower INSERT/UPDATE/DELETE and more storage', 'slower SELECT statements on that table', 'losing the primary key of the table', 'no cost at all, indexes are free'], ['Every write must also maintain every index on the table.', 'Mỗi lần ghi phải cập nhật mọi chỉ mục của bảng.']),
    ],
    gy: [['Seek = jump into the B-tree by a known prefix; scan = read everything.', 'Seek = nhảy vào cây B theo tiền tố đã biết; scan = đọc hết.'], ['Views store a query, resolved at creation for SELECT *.', 'View lưu một truy vấn; SELECT * được giải lúc tạo.']],
    lhg: [["Thinking LIKE N'%ary' can seek.", "Tưởng LIKE N'%ary' dùng được seek."], ['Thinking views always reflect new columns.', 'Tưởng view luôn thấy cột mới.']],
    tn: [tn('Index Seek / Index Scan', 'tìm theo chỉ mục / quét chỉ mục')],
  }),
]);
