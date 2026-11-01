/**
 * DBI202 · 8.4 Thực hành Chương 8 — giao dịch chuyển thưởng có TRY…CATCH (SQL Server), chọn và chứng minh chỉ mục (SQL Server),
 * thứ tự cột chỉ mục ghép, view WITH CHECK OPTION (trình duyệt), chỉ mục một phần và materialized view (PostgreSQL thật).
 */
import { mod, de, cs, q, sau, chan, duoc, ma, tsql, ck, tn } from './_chung.mjs';

const THUONG = `CREATE TABLE dbo.NhanVienThuong (
  maNV   INT NOT NULL CONSTRAINT pk_nvthuong PRIMARY KEY,
  ten    NVARCHAR(50) NOT NULL,
  thuong DECIMAL(10,0) NOT NULL CONSTRAINT ck_nvthuong_thuong CHECK (thuong >= 0)
);
INSERT INTO dbo.NhanVienThuong VALUES (1, N'An', 2000), (2, N'Bình', 500);`;
const CHUYEN = `CREATE OR ALTER PROCEDURE psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0), @ketQua NVARCHAR(300) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE dbo.NhanVienThuong SET thuong = thuong - @soTien WHERE maNV = @tuNV;
            IF @@ROWCOUNT = 0 THROW 50001, N'Source employee not found', 1;
            UPDATE dbo.NhanVienThuong SET thuong = thuong + @soTien WHERE maNV = @denNV;
            IF @@ROWCOUNT = 0 THROW 50002, N'Destination employee not found', 1;
        COMMIT TRANSACTION;
        SET @ketQua = N'OK';
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;          -- committable or doomed: roll back either way
        SET @ketQua = CONCAT(N'FAILED: ', ERROR_MESSAGE());
    END CATCH
END`;
const DEMO = `CREATE TABLE dbo.NhanVienDemo (id INT NOT NULL CONSTRAINT pk_nvdemo PRIMARY KEY, luong DECIMAL(10,0) NOT NULL, phong INT NOT NULL);
GO
WITH n AS (SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn FROM sys.all_columns a CROSS JOIN sys.all_columns b)
INSERT INTO dbo.NhanVienDemo (id, luong, phong) SELECT rn, 5000000 + (rn % 20000) * 1000, rn % 10 FROM n;`;
const IDX = `CREATE NONCLUSTERED INDEX idx_nvdemo_luong ON dbo.NhanVienDemo (luong);   -- filters AND sorts on luong`;
const PG_EMP = `CREATE TABLE employee (emp_id INT PRIMARY KEY, emp_name VARCHAR(50) NOT NULL, dep_num INT NOT NULL, salary NUMERIC(10,0) NOT NULL);
INSERT INTO employee VALUES (1, 'Quang', 1, 150000), (2, 'Ha', 1, 90000), (3, 'Viet Anh', 1, 60000), (4, 'Lan Anh', 1, 45000),
  (5, 'Bao', 2, 95000), (6, 'Duy An', 2, 55000), (7, 'Han', 2, 72000), (8, 'Mai', 3, 88000), (9, 'Nam', 3, 40000);`;
const PG_LD = { en: '<p><b>PostgreSQL table</b> (tab <code>employee.sql</code>): <code>employee(emp_id, emp_name, dep_num, salary)</code> — 9 rows, departments 1–3. This exercise is graded on <b>real PostgreSQL</b> (lesson 8.4 marks it "PostgreSQL only").</p>', vi: '<p><b>Bảng PostgreSQL</b> (tab <code>employee.sql</code>): <code>employee(emp_id, emp_name, dep_num, salary)</code> — 9 dòng, phòng 1–3. Bài này chấm trên <b>PostgreSQL thật</b> (bài 8.4 ghi "chỉ PostgreSQL").</p>' };
/** Đề chấm bằng PostgreSQL nguyên bản (loại 'sql-pg'): dựng như de() rồi đổi loại máy chấm và chú thích tab dữ liệu. */
const pgDe = (o) => {
  const x = de({ ...o, csdl: PG_EMP, tenCsdl: 'employee', ld: PG_LD, tag: ['postgresql', ...(o.tag || [])], khoi: '-- PostgreSQL ONLY: write your PostgreSQL statement(s) below (this exercise runs on real PostgreSQL, not in SQL Server mode).\n-- CHỈ PostgreSQL: viết (các) câu PostgreSQL bên dưới (bài này chạy trên PostgreSQL thật, không ở chế độ SQL Server).\n\n' });
  const doi = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, k.endsWith('employee.sql') ? v.replace("-- Written in SQL Server syntax, like the PE's DBscript.sql — runs as-is in SSMS.", '-- Plain PostgreSQL: run it as-is in psql.') : v]));
  const { phuongNgu: _p, ...tests } = x.tests; void _p;
  return { ...x, khoiDau: doi(x.khoiDau), loiGiai: doi(x.loiGiai), tests: { ...tests, loai: 'sql-pg' } };
};

export default mod('dbi202-on-ch8', '8.4 Practice: transactions, indexes & views', [
  tsql({
    t: 'Exercise 1 — a bonus-transfer transaction with TRY…CATCH and XACT_STATE()', k: 'MEDIUM', p: 15,
    kn: ['TRY … CATCH', 'XACT_STATE()', '@@ROWCOUNT'], tag: ['tsql', 'transaction'],
    en: '<p>Write <code>psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0), @ketQua NVARCHAR(300) OUTPUT</code>: move a bonus from one employee to another in one transaction. Prove three cases: success (@ketQua = <b>OK</b>), a transfer that would make a bonus negative (CHECK fails), and an unknown destination — in both failures nothing may change and @ketQua starts with <b>FAILED</b>.</p>',
    vi: '<p>Viết <code>psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0), @ketQua NVARCHAR(300) OUTPUT</code>: chuyển tiền thưởng từ người này sang người kia trong một giao dịch. Chứng minh ba trường hợp: thành công (@ketQua = <b>OK</b>), chuyển làm thưởng âm (CHECK lỗi), và người nhận không tồn tại — cả hai trường hợp lỗi không được đổi gì và @ketQua bắt đầu bằng <b>FAILED</b>.</p>',
    yc: [['IF @@ROWCOUNT = 0 THROW … after each UPDATE (an UPDATE of 0 rows is not an error).', 'IF @@ROWCOUNT = 0 THROW … sau mỗi UPDATE (UPDATE 0 dòng không phải lỗi).'], ['In CATCH: IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION.', 'Trong CATCH: IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION.']],
    setup: THUONG,
    khoi: `-- CREATE OR ALTER PROCEDURE psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0), @ketQua NVARCHAR(300) OUTPUT AS
-- BEGIN ... END
`,
    giai: CHUYEN,
    kiem: [
      ck(['Case A: 500 from An to Bình succeeds', 'Trường hợp A: chuyển 500 từ An sang Bình thành công'], `DECLARE @k NVARCHAR(300); BEGIN TRAN; EXEC dbo.psm_ChuyenThuong 1, 2, 500, @k OUTPUT;
SET @ok = IIF(@k = N'OK' AND (SELECT thuong FROM dbo.NhanVienThuong WHERE maNV = 1) = 1500 AND (SELECT thuong FROM dbo.NhanVienThuong WHERE maNV = 2) = 1000, 1, 0);
SET @info = CONCAT(N'@ketQua = ', @k); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['Case B: a negative bonus is refused, nothing changes', 'Trường hợp B: thưởng âm bị từ chối, không đổi gì'], `DECLARE @k NVARCHAR(300); EXEC dbo.psm_ChuyenThuong 1, 2, 99999, @k OUTPUT;
SET @ok = IIF(@k LIKE N'FAILED%' AND (SELECT SUM(thuong) FROM dbo.NhanVienThuong) = 2500 AND (SELECT thuong FROM dbo.NhanVienThuong WHERE maNV = 1) = 2000, 1, 0); SET @info = CONCAT(N'@ketQua = ', @k);`),
      ck(['Case C: unknown destination — An gets her 300 back', 'Trường hợp C: người nhận không tồn tại — An được hoàn 300'], `DECLARE @k NVARCHAR(300); EXEC dbo.psm_ChuyenThuong 1, 99, 300, @k OUTPUT;
SET @ok = IIF(@k LIKE N'FAILED%' AND (SELECT thuong FROM dbo.NhanVienThuong WHERE maNV = 1) = 2000 AND @@TRANCOUNT = 0, 1, 0);
SET @info = CONCAT(N'@ketQua = ', @k, N' · An = ', (SELECT thuong FROM dbo.NhanVienThuong WHERE maNV = 1));
UPDATE dbo.NhanVienThuong SET thuong = 2000 WHERE maNV = 1;`),
    ],
    saiTay: [CHUYEN.replace("            IF @@ROWCOUNT = 0 THROW 50002, N'Destination employee not found', 1;\n", ''), CHUYEN.replace('        BEGIN TRANSACTION;\n', '').replace('        COMMIT TRANSACTION;\n', '').replace('        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;          -- committable or doomed: roll back either way\n', '')],
    gy: [['Case C is the subtle one: the FIRST UPDATE has already run when the destination turns out to be missing.', 'Trường hợp C là cái khó: câu UPDATE ĐẦU đã chạy khi phát hiện người nhận không tồn tại.'], ['XACT_STATE(): 1 = committable, −1 = doomed, 0 = none — roll back when it is not 0.', 'XACT_STATE(): 1 = commit được, −1 = hỏng, 0 = không có — huỷ khi khác 0.']],
    lhg: [['No @@ROWCOUNT check — case C "succeeds" and 300 disappears.', 'Không kiểm @@ROWCOUNT — trường hợp C "thành công" và 300 biến mất.'], ['No transaction — case C leaves An 300 poorer.', 'Không có giao dịch — trường hợp C làm An mất 300.']],
    gt: ['<p>This is the PE pattern for "a transaction that must be all or nothing": TRY { BEGIN TRAN … COMMIT } CATCH { rollback if XACT_STATE() &lt;&gt; 0 }.</p>', '<p>Đây là mẫu PE cho "một giao dịch phải tất cả hoặc không": TRY { BEGIN TRAN … COMMIT } CATCH { huỷ nếu XACT_STATE() &lt;&gt; 0 }.</p>'],
    tn: [tn('XACT_STATE()', 'trạng thái giao dịch hiện tại')],
  }),
  tsql({
    t: 'Exercise 2 — choose and prove an index', k: 'MEDIUM', p: 12,
    kn: ['index selection', 'seek + ordered output'], tag: ['tsql', 'index'],
    lyDo: ['The proof is on a 30,000-row SQL Server table: the index structure (sys.indexes) and the plan you read in SSMS.', 'Bằng chứng nằm trên bảng SQL Server 30.000 dòng: cấu trúc chỉ mục (sys.indexes) và kế hoạch bạn đọc trong SSMS.'],
    en: '<p>The setup builds <code>dbo.NhanVienDemo(id PK, luong, phong)</code> with 30,000 rows. The query is <code>SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong</code>. Create ONE index named <code>idx_nvdemo_luong</code> that serves both the filter and the sort. Then compare the plans before/after (SET STATISTICS PROFILE ON or Ctrl+M).</p>',
    vi: '<p>setup dựng <code>dbo.NhanVienDemo(id PK, luong, phong)</code> 30.000 dòng. Truy vấn là <code>SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong</code>. Tạo MỘT chỉ mục tên <code>idx_nvdemo_luong</code> phục vụ cả lọc lẫn sắp. Rồi so kế hoạch trước/sau (SET STATISTICS PROFILE ON hoặc Ctrl+M).</p>',
    yc: [['The key must lead with luong (id is carried automatically as the clustered key).', 'Khoá phải bắt đầu bằng luong (id tự có vì là khoá clustered).']],
    setup: DEMO,
    khoi: `-- CREATE NONCLUSTERED INDEX idx_nvdemo_luong ON dbo.NhanVienDemo (...);
`,
    giai: IDX,
    kiem: [
      ck(['idx_nvdemo_luong exists and leads with luong', 'idx_nvdemo_luong tồn tại và bắt đầu bằng luong'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
  WHERE i.object_id = OBJECT_ID(N'dbo.NhanVienDemo') AND i.name = N'idx_nvdemo_luong' AND c.name = N'luong' AND ic.key_ordinal = 1), 1, 0);
SET @info = N'expected an index idx_nvdemo_luong whose first key column is luong';`),
      ck(['It is a nonclustered index (the table keeps its clustered primary key)', 'Là chỉ mục nonclustered (bảng giữ khoá chính clustered)'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.NhanVienDemo') AND name = N'idx_nvdemo_luong' AND type_desc = N'NONCLUSTERED') AND EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.NhanVienDemo') AND name = N'pk_nvdemo' AND type_desc = N'CLUSTERED'), 1, 0);
SET @info = N'keep pk_nvdemo clustered; idx_nvdemo_luong nonclustered';`),
      ck(['The query returns the right 999 rows, sorted', 'Truy vấn trả đúng 999 dòng, đã sắp'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.NhanVienDemo WITH (INDEX(idx_nvdemo_luong)) WHERE luong > 24000000) = 1 * (SELECT COUNT(*) FROM dbo.NhanVienDemo WHERE luong > 24000000), 1, 0); SET @info = N'the index must be usable by the query (forced with an INDEX hint)';`),
    ],
    saiTay: ['CREATE NONCLUSTERED INDEX idx_nvdemo_luong ON dbo.NhanVienDemo (phong);', 'CREATE NONCLUSTERED INDEX idx_nvdemo_luong ON dbo.NhanVienDemo (phong, luong);'],
    gy: [['The predicate and the ORDER BY both use luong ⇒ one index on luong serves both: seek to 24,000,001 and read in order.', 'Điều kiện và ORDER BY đều dùng luong ⇒ một chỉ mục trên luong phục vụ cả hai: seek tới 24.000.001 rồi đọc theo thứ tự.'], ['No Sort operator should remain in the plan.', 'Kế hoạch không còn toán tử Sort.']],
    lhg: [['Indexing phong — unrelated to the query.', 'Đánh chỉ mục phong — không liên quan truy vấn.'], ['(phong, luong) — luong is not the leading column, the range cannot seek.', '(phong, luong) — luong không đứng đầu, khoảng không seek được.']],
    gt: ['<p>Before: Clustered Index Scan + Sort over 30,000 rows. After: Index Seek on idx_nvdemo_luong returning ~999 rows already in order.</p>', '<p>Trước: Clustered Index Scan + Sort trên 30.000 dòng. Sau: Index Seek trên idx_nvdemo_luong trả ~999 dòng đã đúng thứ tự.</p>'],
    tn: [tn('index seek', 'tìm theo chỉ mục')],
  }),
  cs({
    t: 'Exercise 3 — composite index: does column order matter?', k: 'MEDIUM', p: 6,
    kn: ['composite index order'], tag: ['index', 'composite'],
    en: '<p>Index <code>ix ON tblEmployee (depNum, empSalary)</code>.</p>', vi: '<p>Chỉ mục <code>ix ON tblEmployee (depNum, empSalary)</code>.</p>',
    cau: [
      q('c1', ['WHERE depNum = 2 AND empSalary > 60000 can…', 'WHERE depNum = 2 AND empSalary > 60000 có thể…'], ['seek on depNum = 2 and the salary range inside it', 'only scan', 'seek on empSalary only', 'seek on depNum only, then sort'], ['Equality on the first column, range on the second: the ideal shape.', 'So bằng ở cột đầu, khoảng ở cột hai: dạng lý tưởng.']),
      q('c2', ['WHERE empSalary > 60000 (no depNum) can…', 'WHERE empSalary > 60000 (không có depNum) có thể…'], ['not seek: depNum, the leading column, is missing', 'seek on empSalary', 'seek on both columns', 'use the index only for sorting'], ['Leftmost-prefix rule.', 'Luật tiền tố trái.']),
      q('c3', ['WHERE depNum = 2 ORDER BY empSalary needs a Sort operator?', 'WHERE depNum = 2 ORDER BY empSalary có cần toán tử Sort?'], ['No — inside depNum = 2 the index is already ordered by empSalary', 'Yes — ORDER BY always adds a Sort operator', 'Only when the ORDER BY is DESC, never for ASC', 'Only on PostgreSQL; SQL Server never sorts'], ['Equality prefix + next column = output already sorted.', 'Tiền tố so bằng + cột kế tiếp = kết quả đã sắp sẵn.']),
      q('c4', ['Would (empSalary, depNum) be better for these queries?', '(empSalary, depNum) có tốt hơn cho các truy vấn này?'], ['No — the equality column (depNum) should lead, the range column follow', 'Yes — numeric columns first always seek faster', 'They are identical: column order never matters', 'Yes, because salaries are unique per employee'], ['A range on the leading column stops the seek from using the second column.', 'Khoảng trên cột đầu làm seek không dùng được cột thứ hai.']),
    ],
    gy: [['Equality columns first, then range/sort columns.', 'Cột so bằng trước, rồi cột khoảng/sắp.'], ['A query must mention the leading column to seek.', 'Truy vấn phải nhắc cột đầu mới seek được.']],
    lhg: [['Putting the range column first.', 'Đặt cột khoảng lên đầu.'], ['Expecting a seek without the leading column.', 'Mong seek khi thiếu cột đầu.']],
    tn: [tn('composite index', 'chỉ mục ghép')],
  }),
  de({
    t: 'Exercise 4 — a view WITH CHECK OPTION: senior staff only', k: 'MEDIUM', p: 9,
    kn: ['CREATE VIEW', 'WITH CHECK OPTION', 'updatable view'], tag: ['view', 'check-option', 'fuhcompany'],
    en: '<p>Create <code>vSeniorStaff</code> = <code>empSSN, empName, empSalary, depNum</code> of employees earning at least 60,000, <b>WITH CHECK OPTION</b>: through the view nobody can insert or update a row so that it would fall out of the view.</p>',
    vi: '<p>Tạo <code>vSeniorStaff</code> = <code>empSSN, empName, empSalary, depNum</code> của nhân viên lương từ 60.000, <b>WITH CHECK OPTION</b>: qua view không ai chèn hay sửa một dòng sao cho nó rơi ra khỏi view.</p>',
    yc: [['CREATE VIEW vSeniorStaff AS SELECT … WHERE empSalary &gt;= 60000 WITH CHECK OPTION;', 'CREATE VIEW vSeniorStaff AS SELECT … WHERE empSalary &gt;= 60000 WITH CHECK OPTION;']],
    giai: `CREATE VIEW vSeniorStaff AS
SELECT empSSN, empName, empSalary, depNum
FROM tblEmployee
WHERE empSalary >= 60000
WITH CHECK OPTION;              -- writes through the view must keep the row inside the view`,
    kiem: [
      sau(['The view shows the senior staff', 'View hiện các nhân viên lâu năm'], 'SELECT empSSN, empSalary FROM vSeniorStaff'),
      duoc(['A raise through the view is accepted', 'Tăng lương qua view được nhận'], 'UPDATE vSeniorStaff SET empSalary = empSalary + 1000 WHERE empSSN = 30121050003'),
      chan(['Cutting a salary to 40,000 through the view is refused', 'Hạ lương xuống 40.000 qua view bị từ chối'], 'UPDATE vSeniorStaff SET empSalary = 40000 WHERE empSSN = 30121050003', '44000'),
      chan(['Inserting a junior through the view is refused', 'Chèn nhân viên lương thấp qua view bị từ chối'], "INSERT INTO vSeniorStaff (empSSN, empName, empSalary, depNum) VALUES (30121050700, N'Junior', 30000, 1)", '44000'),
    ],
    sai: ['CREATE VIEW vSeniorStaff AS SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSalary >= 60000;', 'CREATE VIEW vSeniorStaff AS SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSalary > 60000 WITH CHECK OPTION;'],
    gy: [['WITH CHECK OPTION goes at the very end of CREATE VIEW.', 'WITH CHECK OPTION đặt ở cuối cùng của CREATE VIEW.'], ['"At least 60,000" ⇒ &gt;= — Võ Việt Anh earns exactly 60,000.', '"Từ 60.000" ⇒ &gt;= — Võ Việt Anh lương đúng 60.000.']],
    lhg: [['Without CHECK OPTION the update succeeds and the row silently disappears from the view.', 'Không có CHECK OPTION thì câu sửa thành công và dòng lặng lẽ biến khỏi view.'], ['&gt; 60000 — Võ Việt Anh is not in the view.', '&gt; 60000 — Võ Việt Anh không có trong view.']],
    gt: ['<p>SQL Server reports Msg 550 for a CHECK OPTION violation (PostgreSQL: SQLSTATE 44000).</p>', '<p>SQL Server báo Msg 550 khi vi phạm CHECK OPTION (PostgreSQL: SQLSTATE 44000).</p>'],
    tn: [tn('WITH CHECK OPTION', 'tuỳ chọn kiểm tra của view')],
  }),
  pgDe({
    t: 'Exercise 6 — a partial index (PostgreSQL only)', k: 'MEDIUM', p: 8,
    kn: ['partial index', 'CREATE INDEX … WHERE'], tag: ['index', 'partial-index'],
    en: '<p>Department 1 is searched by name all day, the others almost never. On PostgreSQL create <code>idx_employee_dep1_name</code> on <code>employee(emp_name)</code> that indexes <b>only the rows of department 1</b> — smaller and cheaper to maintain than a full index. (SQL Server\'s closest equivalent is a filtered index: CREATE INDEX … WHERE dep_num = 1.)</p>',
    vi: '<p>Phòng 1 bị tìm theo tên cả ngày, các phòng khác gần như không. Trên PostgreSQL tạo <code>idx_employee_dep1_name</code> trên <code>employee(emp_name)</code> chỉ đánh chỉ mục <b>các dòng của phòng 1</b> — nhỏ hơn và rẻ hơn khi bảo trì so với chỉ mục đầy đủ. (Tương đương gần nhất của SQL Server là filtered index: CREATE INDEX … WHERE dep_num = 1.)</p>',
    yc: [['CREATE INDEX idx_employee_dep1_name ON employee (emp_name) WHERE dep_num = 1;', 'CREATE INDEX idx_employee_dep1_name ON employee (emp_name) WHERE dep_num = 1;'], ['A query can use it only if its WHERE implies dep_num = 1.', 'Truy vấn chỉ dùng được nó nếu WHERE của truy vấn kéo theo dep_num = 1.']],
    giai: `CREATE INDEX idx_employee_dep1_name ON employee (emp_name) WHERE dep_num = 1;   -- only department-1 rows are indexed`,
    kiem: [
      sau(['The index is partial (WHERE dep_num = 1) on emp_name', 'Chỉ mục là một phần (WHERE dep_num = 1) trên emp_name'], "SELECT indexname, replace(indexdef, ' ', '') AS def FROM pg_indexes WHERE indexname = 'idx_employee_dep1_name'"),
      duoc(['Rows of other departments can still be written (they are just not indexed)', 'Vẫn ghi được dòng của phòng khác (chỉ là không được đánh chỉ mục)'], "INSERT INTO employee VALUES (10, 'Moi', 2, 50000), (11, 'Moi 2', 1, 51000)"),
      ma(['Has a WHERE clause on the index', 'Chỉ mục có mệnh đề WHERE'], '\\bCREATE\\s+INDEX\\b[\\s\\S]*\\bWHERE\\b'),
    ],
    sai: ['CREATE INDEX idx_employee_dep1_name ON employee (emp_name);', 'CREATE INDEX idx_employee_dep1_name ON employee (emp_name) WHERE dep_num = 2;'],
    gy: [['A partial index adds a WHERE to CREATE INDEX.', 'Chỉ mục một phần thêm WHERE vào CREATE INDEX.'], ['The query must repeat the condition (WHERE dep_num = 1 AND emp_name = …) for the planner to pick it.', 'Truy vấn phải lặp lại điều kiện (WHERE dep_num = 1 AND emp_name = …) thì bộ lập kế hoạch mới chọn nó.']],
    lhg: [['A full index on emp_name — works, but indexes every department.', 'Chỉ mục đầy đủ trên emp_name — chạy được nhưng đánh mọi phòng.'], ['The wrong department in the WHERE.', 'Sai phòng trong WHERE.']],
    gt: ['<p>Partial indexes shine for "hot" subsets: active orders, unpaid invoices, rows not soft-deleted.</p>', '<p>Chỉ mục một phần toả sáng với tập con "nóng": đơn đang mở, hoá đơn chưa trả, dòng chưa xoá mềm.</p>'],
    tn: [tn('partial index', 'chỉ mục một phần')],
  }),
  pgDe({
    t: 'Exercise 7 — a materialized view (PostgreSQL only)', k: 'MEDIUM', p: 9,
    kn: ['materialized view', 'REFRESH MATERIALIZED VIEW'], tag: ['view', 'materialized-view'],
    en: '<p>The payroll report per department is read hundreds of times a day but the data changes once a month. Create <code>mv_dept_payroll(dep_num, headcount, payroll)</code> as a <b>materialized view</b> — the result is stored and only recomputed by <code>REFRESH MATERIALIZED VIEW</code>.</p>',
    vi: '<p>Báo cáo quỹ lương theo phòng được đọc hàng trăm lần mỗi ngày nhưng dữ liệu chỉ đổi mỗi tháng một lần. Tạo <code>mv_dept_payroll(dep_num, headcount, payroll)</code> dạng <b>materialized view</b> — kết quả được lưu và chỉ tính lại khi <code>REFRESH MATERIALIZED VIEW</code>.</p>',
    yc: [['CREATE MATERIALIZED VIEW mv_dept_payroll AS SELECT dep_num, count(*) AS headcount, sum(salary) AS payroll FROM employee GROUP BY dep_num;', 'CREATE MATERIALIZED VIEW mv_dept_payroll AS SELECT dep_num, count(*) AS headcount, sum(salary) AS payroll FROM employee GROUP BY dep_num;']],
    giai: `CREATE MATERIALIZED VIEW mv_dept_payroll AS
SELECT dep_num, count(*) AS headcount, sum(salary) AS payroll
FROM employee
GROUP BY dep_num;`,
    kiem: [
      sau(['The stored result', 'Kết quả được lưu'], 'SELECT dep_num, headcount, payroll FROM mv_dept_payroll'),
      sau(['After a hire it is stale until REFRESH, then up to date', 'Sau khi tuyển người, nó cũ tới khi REFRESH, rồi cập nhật'], "INSERT INTO employee VALUES (10, 'Moi', 3, 50000); SELECT (SELECT headcount FROM mv_dept_payroll WHERE dep_num = 3) AS before_refresh; REFRESH MATERIALIZED VIEW mv_dept_payroll; SELECT dep_num, headcount, payroll FROM mv_dept_payroll"),
      sau(['It really is a materialized view', 'Nó thật sự là materialized view'], "SELECT matviewname FROM pg_matviews WHERE matviewname = 'mv_dept_payroll'"),
    ],
    sai: ['CREATE VIEW mv_dept_payroll AS SELECT dep_num, count(*) AS headcount, sum(salary) AS payroll FROM employee GROUP BY dep_num;', 'CREATE MATERIALIZED VIEW mv_dept_payroll AS SELECT dep_num, count(*) AS headcount, sum(salary) AS payroll FROM employee WHERE salary > 50000 GROUP BY dep_num;'],
    gy: [['CREATE MATERIALIZED VIEW name AS SELECT …', 'CREATE MATERIALIZED VIEW tên AS SELECT …'], ['It does not follow the base table automatically — REFRESH it after changes.', 'Nó không tự theo bảng gốc — REFRESH sau khi dữ liệu đổi.']],
    lhg: [['A plain VIEW — recomputed on every read (it is not in pg_matviews).', 'VIEW thường — tính lại mỗi lần đọc (không có trong pg_matviews).'], ['Filtering employees — the payroll must include everyone.', 'Lọc nhân viên — quỹ lương phải tính mọi người.']],
    gt: ['<p>SQL Server\'s counterpart is an indexed view (CREATE VIEW … WITH SCHEMABINDING + a unique clustered index), which SQL Server keeps up to date automatically on every write.</p>', '<p>Tương đương của SQL Server là indexed view (CREATE VIEW … WITH SCHEMABINDING + chỉ mục clustered duy nhất), được SQL Server tự cập nhật mỗi lần ghi.</p>'],
    tn: [tn('materialized view', 'view vật chất hoá')],
  }),
]);
