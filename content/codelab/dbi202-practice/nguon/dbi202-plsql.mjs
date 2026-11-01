/**
 * DBI202 · 7.1 View, procedure, function & trigger — tổng quan: chọn đúng loại đối tượng, một view (chấm trong trình duyệt),
 * một procedure bọc view có tham số (SQL Server thật).
 */
import { mod, de, cs, q, bang1, sau, ma, tsql, ck, FUH, TN, tn } from './_chung.mjs';

const VIEW = `CREATE VIEW vEmployeeContacts AS
SELECT e.empSSN, e.empName, e.empAddress, d.depNum, d.depName      -- no salary, no birth date
FROM tblEmployee e
JOIN tblDepartment d ON d.depNum = e.depNum;`;

export default mod('dbi202-plsql', '7.1 Views, stored procedures, functions & triggers', [
  cs({
    t: 'Which programmable object fits the requirement?', k: 'EASY', p: 7, loai: 'table',
    kn: ['view', 'stored procedure', 'function', 'trigger', 'cursor'], tag: ['tsql', 'design'],
    en: '<p>Lesson 7.1 lists five kinds of logic you can store in the database. Pick the right one for each requirement.</p>',
    vi: '<p>Bài 7.1 liệt kê năm loại logic lưu được trong CSDL. Chọn đúng loại cho mỗi yêu cầu.</p>',
    bang: [bang1('b1', ['Requirement → object', 'Yêu cầu → đối tượng'],
      [{ ma: 'yc', ten: 'Requirement / Yêu cầu' }, { ma: 'dt', ten: 'Object / Đối tượng', luaChon: ['view', 'stored procedure', 'scalar function', 'trigger', 'cursor'] }],
      [{ o: { yc: 'Receptionists may see names and departments but never salaries.' }, a: { dt: 'view' } },
        { o: { yc: 'Enrol a student: insert the enrolment AND decrease the free seats, all or nothing.' }, a: { dt: 'stored procedure' } },
        { o: { yc: 'Show each employee\'s age in a SELECT list.' }, a: { dt: 'scalar function' } },
        { o: { yc: 'Every salary change must be logged automatically, whoever changes it.' }, a: { dt: 'trigger' } },
        { o: { yc: 'For each department in turn, call an existing procedure that e-mails its report.' }, a: { dt: 'cursor' } }],
      ['Hide columns ⇒ view. Several writes as one unit ⇒ procedure. A value in an expression ⇒ function. React automatically to INSERT/UPDATE/DELETE ⇒ trigger. A side effect per row that has no set-based form ⇒ cursor (rarely).', 'Che cột ⇒ view. Nhiều lệnh ghi thành một khối ⇒ procedure. Một giá trị trong biểu thức ⇒ hàm. Tự phản ứng với INSERT/UPDATE/DELETE ⇒ trigger. Tác vụ từng dòng không có dạng theo tập ⇒ cursor (hiếm).'])],
    gy: [['"Automatically, whoever changes it" ⇒ trigger.', '"Tự động, bất kể ai sửa" ⇒ trigger.'], ['"Used inside a query" ⇒ function or view.', '"Dùng trong truy vấn" ⇒ hàm hoặc view.']],
    lhg: [['Using a procedure for the salary log — an application that forgets to call it bypasses the log.', 'Dùng procedure cho nhật ký lương — ứng dụng quên gọi là lọt nhật ký.'], ['Using a cursor where one UPDATE would do.', 'Dùng cursor khi một câu UPDATE là đủ.']],
    tn: [tn('programmable object', 'đối tượng lập trình được')],
  }),
  de({
    t: 'A view that hides the salary', k: 'EASY', p: 7,
    kn: ['CREATE VIEW', 'column hiding'], tag: ['view', 'fuhcompany'],
    en: '<p>Create <code>vEmployeeContacts</code> showing <code>empSSN, empName, empAddress, depNum, depName</code> of every employee — no salary, no birth date.</p>',
    vi: '<p>Tạo <code>vEmployeeContacts</code> hiện <code>empSSN, empName, empAddress, depNum, depName</code> của mọi nhân viên — không lương, không ngày sinh.</p>',
    yc: [['CREATE VIEW vEmployeeContacts AS SELECT … (no ORDER BY inside a view).', 'CREATE VIEW vEmployeeContacts AS SELECT … (không ORDER BY trong view).'], ['The checks query the view.', 'Các kiểm truy vấn view.']],
    giai: VIEW,
    kiem: [
      sau(['The view returns every employee with the department name', 'View trả mọi nhân viên kèm tên phòng'], 'SELECT empSSN, empName, empAddress, depNum, depName FROM vEmployeeContacts'),
      sau(['The view has exactly these five columns', 'View có đúng năm cột này'], "SELECT lower(column_name) AS col FROM information_schema.columns WHERE lower(table_name) = 'vemployeecontacts'"),
      sau(['Hidden: a new hire appears through the view', 'Ẩn: nhân viên mới hiện qua view'], 'SELECT COUNT(*) AS n FROM vEmployeeContacts', { an: true, themCsdl: "INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050110, N'Mới', 4)" }),
    ],
    sai: ['CREATE VIEW vEmployeeContacts AS SELECT e.*, d.depName FROM tblEmployee e JOIN tblDepartment d ON d.depNum = e.depNum;', 'CREATE VIEW vEmployeeContacts AS SELECT e.empSSN, e.empName, e.empAddress, d.depNum, d.depName FROM tblEmployee e JOIN tblDepartment d ON d.depNum = e.depNum WHERE e.depNum = 1;'],
    gy: [['A view is a stored SELECT; its column list is the security boundary.', 'View là một câu SELECT được lưu; danh sách cột của nó là ranh giới bảo mật.'], ['Join tblDepartment for depName.', 'Nối tblDepartment để lấy depName.']],
    lhg: [['SELECT e.* — the salary is visible again.', 'SELECT e.* — lương lại hiện ra.'], ['A WHERE that keeps only one department.', 'Một WHERE chỉ giữ một phòng.']],
    gt: ['<p>Grant SELECT on the view (not on the table) to the receptionists\' role and the salary column is out of their reach (⭐ CS.7).</p>', '<p>Cấp quyền SELECT trên view (không phải trên bảng) cho vai trò lễ tân là cột lương nằm ngoài tầm với của họ (⭐ CS.7).</p>'],
    tn: [TN.view],
  }),
  tsql({
    t: 'A procedure with a parameter on top of the view', k: 'EASY', p: 10,
    kn: ['stored procedure', 'result set', 'parameter'], tag: ['tsql', 'procedure', 'view', 'fuhcompany'],
    en: '<p>The view <code>vEmployeeContacts</code> already exists (setup). Write <code>prContactsOfDepartment @depNum INT</code> that returns the rows of the view for one department, ordered by empSSN. An unknown department returns no rows (not an error).</p>',
    vi: '<p>View <code>vEmployeeContacts</code> đã có sẵn (setup). Viết <code>prContactsOfDepartment @depNum INT</code> trả các dòng của view cho một phòng, sắp theo empSSN. Phòng không tồn tại trả không dòng nào (không lỗi).</p>',
    yc: [['CREATE OR ALTER PROCEDURE … AS BEGIN SELECT … FROM vEmployeeContacts WHERE depNum = @depNum ORDER BY empSSN; END', 'CREATE OR ALTER PROCEDURE … AS BEGIN SELECT … FROM vEmployeeContacts WHERE depNum = @depNum ORDER BY empSSN; END'], ['Return the five columns of the view, in the view\'s order.', 'Trả năm cột của view theo đúng thứ tự của view.']],
    setup: `${FUH}\nGO\n${VIEW}`,
    khoi: `-- CREATE OR ALTER PROCEDURE prContactsOfDepartment @depNum INT AS
-- BEGIN ... END
`,
    giai: `CREATE OR ALTER PROCEDURE prContactsOfDepartment
    @depNum INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT empSSN, empName, empAddress, depNum, depName
    FROM vEmployeeContacts
    WHERE depNum = @depNum
    ORDER BY empSSN;              -- ORDER BY belongs in the query that returns the rows, not in the view
END`,
    kiem: [
      ck(['Department 2 returns its 4 employees', 'Phòng 2 trả 4 nhân viên của nó'], `DECLARE @o TABLE (empSSN DECIMAL(18,0), empName NVARCHAR(50), empAddress NVARCHAR(100), depNum INT, depName NVARCHAR(50));
INSERT INTO @o EXEC dbo.prContactsOfDepartment 2;
SET @ok = IIF((SELECT COUNT(*) FROM @o) = 4 AND NOT EXISTS (SELECT 1 FROM @o WHERE depNum <> 2), 1, 0); SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM @o));`),
      ck(['An unknown department returns no rows', 'Phòng không tồn tại trả không dòng'], `DECLARE @o TABLE (empSSN DECIMAL(18,0), empName NVARCHAR(50), empAddress NVARCHAR(100), depNum INT, depName NVARCHAR(50));
INSERT INTO @o EXEC dbo.prContactsOfDepartment 42;
SET @ok = IIF((SELECT COUNT(*) FROM @o) = 0, 1, 0); SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM @o));`),
      ck(['The parameter is really used (department 5 → 2 rows)', 'Tham số thật sự được dùng (phòng 5 → 2 dòng)'], `DECLARE @o TABLE (empSSN DECIMAL(18,0), empName NVARCHAR(50), empAddress NVARCHAR(100), depNum INT, depName NVARCHAR(50));
INSERT INTO @o EXEC dbo.prContactsOfDepartment 5;
SET @ok = IIF((SELECT COUNT(*) FROM @o) = 2, 1, 0); SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM @o));`),
    ],
    saiTay: [`CREATE OR ALTER PROCEDURE prContactsOfDepartment @depNum INT AS
BEGIN
    SELECT empSSN, empName, empAddress, depNum, depName FROM vEmployeeContacts ORDER BY empSSN;
END`],
    gy: [['A procedure can return a result set simply by ending with a SELECT.', 'Procedure trả tập kết quả chỉ bằng một câu SELECT ở cuối.'], ['Filter with the parameter: WHERE depNum = @depNum.', 'Lọc bằng tham số: WHERE depNum = @depNum.']],
    lhg: [['Forgetting the WHERE — every department is returned.', 'Quên WHERE — trả mọi phòng.'], ['Putting ORDER BY inside the view — SQL Server rejects it without TOP.', 'Đặt ORDER BY trong view — SQL Server từ chối nếu không có TOP.']],
    gt: ['<p>The view hides columns; the procedure adds a parameter and an order. Applications call EXEC prContactsOfDepartment 2 and never touch the base table.</p>', '<p>View che cột; procedure thêm tham số và thứ tự. Ứng dụng gọi EXEC prContactsOfDepartment 2 và không bao giờ đụng bảng gốc.</p>'],
    tn: [tn('stored procedure', 'thủ tục lưu sẵn')],
  }),
  cs({
    t: 'Logic in the database: good and bad reasons', k: 'MEDIUM', p: 6,
    kn: ['programmability trade-offs'], tag: ['tsql', 'design'],
    en: '<p>Lesson 7.1 and its ★ note.</p>', vi: '<p>Bài 7.1 và ghi chú ★.</p>',
    cau: [
      q('c1', ['Main advantage of a trigger over application code for an audit log:', 'Ưu điểm chính của trigger so với mã ứng dụng cho nhật ký kiểm toán:'], ['it runs for every change, from every application and every SSMS window', 'it is faster to write than any other code', 'it never needs testing', 'it works without a transaction'], ['Rules inside the DBMS cannot be bypassed by a forgetful client.', 'Luật trong DBMS không bị một ứng dụng đãng trí bỏ qua.']),
      q('c2', ['A trigger written as "SELECT @id = id FROM inserted" breaks when…', 'Trigger viết "SELECT @id = id FROM inserted" hỏng khi…'], ['one statement changes several rows', 'the table has a primary key', 'the trigger is AFTER', 'the column is NVARCHAR'], ['Triggers fire once per statement; inserted can hold many rows.', 'Trigger chạy mỗi câu lệnh một lần; inserted có thể nhiều dòng.']),
      q('c3', ['How can a read-only view over a join be made updatable?', 'Làm sao cho một view nối nhiều bảng (chỉ đọc) cập nhật được?'], ['an INSTEAD OF trigger on the view', 'an AFTER trigger on the view', 'a cursor on the view', 'a scalar function'], ['INSTEAD OF replaces the INSERT/UPDATE/DELETE with your own statements on the base tables.', 'INSTEAD OF thay câu INSERT/UPDATE/DELETE bằng các câu lệnh của bạn trên bảng gốc.']),
      q('c4', ['Why use cursors sparingly?', 'Vì sao nên hạn chế cursor?'], ['row-by-row processing is far slower than one set-based statement', 'cursors cannot read NVARCHAR columns', 'cursors are not allowed in procedures', 'cursors always lock the whole database'], ['The engine is optimised for sets; a loop pays the per-row overhead thousands of times.', 'Bộ máy tối ưu cho xử lý theo tập; vòng lặp trả chi phí từng dòng hàng nghìn lần.']),
    ],
    gy: [['Ask "who must not be able to skip this rule?"', 'Hỏi "ai không được phép bỏ qua luật này?"'], ['Think in sets: inserted/deleted are tables.', 'Nghĩ theo tập: inserted/deleted là các bảng.']],
    lhg: [['Writing single-row triggers.', 'Viết trigger chỉ cho một dòng.'], ['Reaching for a cursor first.', 'Nghĩ tới cursor đầu tiên.']],
    tn: [tn('INSTEAD OF trigger', 'trigger thay thế')],
  }),
]);
