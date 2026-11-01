/**
 * DBI202 · 7.C Slide trường Chương 8 (35–51) — trigger (inserted/deleted, AFTER, chạy một lần mỗi câu lệnh) và cursor.
 */
import { mod, cs, q, bang1, tsql, ck, tuChoi, giongNhau, FUH, tn } from './_chung.mjs';

const HIEN = `CREATE OR ALTER TRIGGER trShowNewEmployees ON tblEmployee
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.empSSN, i.empName, i.depNum, d.depName        -- every inserted row, not just one
    FROM inserted i
    LEFT JOIN tblDepartment d ON d.depNum = i.depNum;
END`;
const GIO = `CREATE OR ALTER TRIGGER trMaxWeeklyHours ON tblWorksOn
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT w.empSSN
               FROM tblWorksOn w
               WHERE w.empSSN IN (SELECT empSSN FROM inserted)      -- only the employees touched by this statement
               GROUP BY w.empSSN
               HAVING SUM(w.workHours) > 60)
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50060, N'An employee cannot work more than 60 hours a week in total.', 1;
    END
END`;
const CUR = `CREATE OR ALTER PROCEDURE prBuildDeptReport
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tblDeptReport;
    DECLARE @dep INT;
    DECLARE dep_cursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT depNum FROM tblDepartment ORDER BY depNum;
    OPEN dep_cursor;
    FETCH NEXT FROM dep_cursor INTO @dep;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO tblDeptReport (depNum, headcount, payroll)
        SELECT @dep, COUNT(*), COALESCE(SUM(empSalary), 0) FROM tblEmployee WHERE depNum = @dep;
        FETCH NEXT FROM dep_cursor INTO @dep;
    END
    CLOSE dep_cursor;
    DEALLOCATE dep_cursor;
END`;
const SETUP_REPORT = `${FUH}
CREATE TABLE tblDeptReport (depNum INT NOT NULL PRIMARY KEY, headcount INT NOT NULL, payroll DECIMAL(14,0) NOT NULL);`;

export default mod('dbi202-slide-dbi9-3', '7.C Triggers, inserted/deleted & cursors (slides 35–51)', [
  tsql({
    t: 'AFTER INSERT trigger that shows the inserted rows (PE question 9 style)', k: 'MEDIUM', p: 12,
    kn: ['AFTER INSERT', 'inserted table', 'multi-row insert'], tag: ['tsql', 'trigger', 'pe-q9', 'fuhcompany', 'slide'],
    en: '<p>Create trigger <code>trShowNewEmployees</code> on tblEmployee: whenever employees are inserted, it displays <code>empSSN, empName, depNum, depName</code> of <b>every</b> inserted employee (an employee without a department shows NULL depName).</p>',
    vi: '<p>Tạo trigger <code>trShowNewEmployees</code> trên tblEmployee: mỗi khi chèn nhân viên, nó hiện <code>empSSN, empName, depNum, depName</code> của <b>mọi</b> nhân viên vừa chèn (nhân viên chưa có phòng thì depName NULL).</p>',
    yc: [['Read the new rows from the virtual table <code>inserted</code>.', 'Đọc dòng mới từ bảng ảo <code>inserted</code>.'], ['One INSERT of three rows fires the trigger ONCE with three rows in inserted.', 'Một câu INSERT ba dòng làm trigger chạy MỘT lần với ba dòng trong inserted.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER TRIGGER trShowNewEmployees ON tblEmployee
-- AFTER INSERT
-- AS
-- BEGIN ... SELECT ... FROM inserted ... END
`,
    giai: HIEN,
    kiem: [
      ck(['One insert shows one row with the department name', 'Chèn một dòng hiện một dòng kèm tên phòng'], `DECLARE @o TABLE (empSSN DECIMAL(18,0), empName NVARCHAR(50), depNum INT, depName NVARCHAR(50));
BEGIN TRAN; INSERT INTO @o EXEC (N'INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121051003, N''Eee Ggg'', 3)'); ROLLBACK;
SET @ok = IIF((SELECT COUNT(*) FROM @o) = 1 AND EXISTS (SELECT 1 FROM @o WHERE empSSN = 30121051003 AND depName = N'Phòng Kinh doanh'), 1, 0);
SET @info = CONCAT(N'rows shown: ', (SELECT COUNT(*) FROM @o));`),
      ck(['A three-row insert shows all three rows', 'Chèn ba dòng hiện đủ ba dòng'], `DECLARE @o TABLE (empSSN DECIMAL(18,0), empName NVARCHAR(50), depNum INT, depName NVARCHAR(50));
BEGIN TRAN; INSERT INTO @o EXEC (N'INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121051004, N''A'', 1), (30121051005, N''B'', 2), (30121051006, N''C'', NULL)'); ROLLBACK;
SET @ok = IIF((SELECT COUNT(*) FROM @o) = 3 AND EXISTS (SELECT 1 FROM @o WHERE empSSN = 30121051006 AND depName IS NULL), 1, 0);
SET @info = CONCAT(N'rows shown: ', (SELECT COUNT(*) FROM @o), N' (expected 3, the one without a department with NULL depName)');`),
      ck(['The trigger is AFTER INSERT on tblEmployee', 'Trigger là AFTER INSERT trên tblEmployee'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.triggers t JOIN sys.trigger_events e ON e.object_id = t.object_id WHERE t.name = N'trShowNewEmployees' AND t.parent_id = OBJECT_ID(N'dbo.tblEmployee') AND e.type_desc = N'INSERT' AND t.is_instead_of_trigger = 0), 1, 0);
SET @info = N'expected CREATE TRIGGER trShowNewEmployees ON tblEmployee AFTER INSERT';`),
    ],
    saiTay: [HIEN.replace('LEFT JOIN tblDepartment', 'JOIN tblDepartment'), `CREATE OR ALTER TRIGGER trShowNewEmployees ON tblEmployee AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @ssn DECIMAL(18,0) = (SELECT TOP (1) empSSN FROM inserted);    -- only ONE row
    SELECT e.empSSN, e.empName, e.depNum, d.depName FROM tblEmployee e LEFT JOIN tblDepartment d ON d.depNum = e.depNum WHERE e.empSSN = @ssn;
END`],
    gy: [['inserted has the same columns as tblEmployee and holds the new rows of the statement.', 'inserted có cùng cột với tblEmployee và chứa các dòng mới của câu lệnh.'], ['LEFT JOIN tblDepartment so an employee without a department is still shown.', 'LEFT JOIN tblDepartment để nhân viên chưa có phòng vẫn hiện.']],
    lhg: [['Reading one row into a variable — triggers fire once per STATEMENT, not per row.', 'Đọc một dòng vào biến — trigger chạy mỗi CÂU LỆNH một lần, không phải mỗi dòng.'], ['INNER JOIN — the new employee without a department is not shown.', 'INNER JOIN — nhân viên mới chưa có phòng không hiện.']],
    gt: ['<p>In the PE the test is a single INSERT, but markers know the multi-row trap. Never assume inserted has one row.</p>', '<p>Đề PE thử bằng một câu INSERT một dòng, nhưng người chấm biết bẫy nhiều dòng. Đừng bao giờ giả định inserted chỉ có một dòng.</p>'],
    tn: [tn('trigger', 'bẫy sự kiện (trigger)'), tn('inserted / deleted', 'bảng ảo dòng mới / dòng cũ')],
  }),
  tsql({
    t: 'A rule trigger: at most 60 hours per employee across all projects', k: 'HARD', p: 15,
    kn: ['AFTER INSERT, UPDATE', 'ROLLBACK in a trigger', 'THROW', 'set-based check'], tag: ['tsql', 'trigger', 'fuhcompany', 'slide'],
    en: '<p>A CHECK constraint sees one row; this rule spans many rows. Create <code>trMaxWeeklyHours</code> on tblWorksOn (AFTER INSERT, UPDATE): if any employee touched by the statement now works more than <b>60 hours in total</b>, roll back and raise an error. Valid statements must still work — including multi-row ones.</p>',
    vi: '<p>CHECK chỉ thấy một dòng; luật này trải nhiều dòng. Tạo <code>trMaxWeeklyHours</code> trên tblWorksOn (AFTER INSERT, UPDATE): nếu nhân viên nào bị câu lệnh đụng tới giờ làm <b>tổng cộng trên 60 giờ</b> thì huỷ và báo lỗi. Câu lệnh hợp lệ vẫn phải chạy — kể cả câu nhiều dòng.</p>',
    yc: [['Test the totals of the employees in inserted (GROUP BY … HAVING SUM(…) &gt; 60).', 'Kiểm tổng giờ của các nhân viên có trong inserted (GROUP BY … HAVING SUM(…) &gt; 60).'], ['ROLLBACK TRANSACTION, then THROW (or RAISERROR).', 'ROLLBACK TRANSACTION, rồi THROW (hoặc RAISERROR).']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER TRIGGER trMaxWeeklyHours ON tblWorksOn
-- AFTER INSERT, UPDATE
-- AS
-- BEGIN ... END
`,
    giai: GIO,
    kiem: [
      ck(['52.5 → 62.5 hours for Võ Việt Anh is rejected and rolled back', '52,5 → 62,5 giờ của Võ Việt Anh bị từ chối và huỷ'], `DECLARE @loi BIT = 0; BEGIN TRAN;
BEGIN TRY UPDATE tblWorksOn SET workHours = 40 WHERE empSSN = 30121050003 AND proNum = 1; END TRY BEGIN CATCH SET @loi = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@loi = 1 AND (SELECT workHours FROM tblWorksOn WHERE empSSN = 30121050003 AND proNum = 1) = 30, 1, 0);
SET @info = IIF(@loi = 0, N'the UPDATE was accepted', N'error raised but the value changed');`),
      ck(['A new assignment that pushes the total over 60 is rejected', 'Phân công mới đẩy tổng vượt 60 bị từ chối'], tuChoi(["INSERT INTO tblWorksOn VALUES (30121050021, 1, 25.0)"])),
      ck(['Exactly 60 hours is accepted', 'Đúng 60 giờ được nhận'], `BEGIN TRAN; INSERT INTO tblWorksOn VALUES (30121050021, 1, 20.0);
SET @ok = IIF((SELECT SUM(workHours) FROM tblWorksOn WHERE empSSN = 30121050021) = 60, 1, 0); SET @info = N'a total of exactly 60 must be allowed'; ROLLBACK;`),
      ck(['A multi-row insert where one employee goes over is rejected as a whole', 'INSERT nhiều dòng có một người vượt bị từ chối cả câu'], `DECLARE @loi BIT = 0; BEGIN TRAN;
BEGIN TRY INSERT INTO tblWorksOn VALUES (30121050037, 1, 10.0), (30121050030, 1, 25.0); END TRY BEGIN CATCH SET @loi = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@loi = 1 AND NOT EXISTS (SELECT 1 FROM tblWorksOn WHERE empSSN = 30121050037), 1, 0); SET @info = IIF(@loi = 0, N'accepted although 040 would work 65 hours', N'the valid row of the statement was kept');`),
      ck(['A valid multi-row insert passes', 'INSERT nhiều dòng hợp lệ chạy được'], `BEGIN TRAN; INSERT INTO tblWorksOn VALUES (30121050037, 1, 10.0), (30121050038, 2, 10.0);
SET @ok = IIF((SELECT COUNT(*) FROM tblWorksOn WHERE empSSN IN (30121050037, 30121050038)) = 2, 1, 0); SET @info = N'valid rows must be inserted'; ROLLBACK;`),
    ],
    saiTay: [GIO.replace('HAVING SUM(w.workHours) > 60', 'HAVING SUM(w.workHours) >= 60'), GIO.replace(`IF EXISTS (SELECT w.empSSN
               FROM tblWorksOn w
               WHERE w.empSSN IN (SELECT empSSN FROM inserted)      -- only the employees touched by this statement
               GROUP BY w.empSSN
               HAVING SUM(w.workHours) > 60)`, `IF (SELECT workHours FROM inserted) > 60`)],
    gy: [['After the statement, tblWorksOn already contains the new values — sum them for the employees found in inserted.', 'Sau câu lệnh, tblWorksOn đã chứa giá trị mới — cộng chúng cho các nhân viên có trong inserted.'], ['ROLLBACK TRANSACTION undoes the whole statement (and the caller\'s transaction).', 'ROLLBACK TRANSACTION huỷ cả câu lệnh (và giao dịch của bên gọi).']],
    lhg: [['IF (SELECT workHours FROM inserted) &gt; 60 — fails with "Subquery returned more than 1 value" on multi-row statements and ignores the other projects.', 'IF (SELECT workHours FROM inserted) &gt; 60 — lỗi "Subquery returned more than 1 value" khi nhiều dòng và bỏ qua các dự án khác.'], ['&gt;= 60 — exactly 60 hours is allowed by the rule.', '&gt;= 60 — luật cho phép đúng 60 giờ.']],
    gt: ['<p>Rules over several rows (totals, counts, comparisons with another table) need a trigger; single-row rules belong in CHECK constraints, which are cheaper and declarative.</p>', '<p>Luật trên nhiều dòng (tổng, đếm, so với bảng khác) cần trigger; luật một dòng thuộc về CHECK — rẻ hơn và mang tính khai báo.</p>'],
    tn: [tn('AFTER trigger', 'trigger sau sự kiện'), tn('ROLLBACK TRANSACTION', 'huỷ giao dịch')],
  }),
  tsql({
    t: 'A cursor, once: build a department report row by row', k: 'MEDIUM', p: 14,
    kn: ['DECLARE CURSOR', 'FETCH NEXT', '@@FETCH_STATUS', 'CLOSE / DEALLOCATE'], tag: ['tsql', 'cursor', 'fuhcompany', 'slide'],
    en: '<p>The setup creates <code>tblDeptReport(depNum, headcount, payroll)</code>. Write <code>prBuildDeptReport</code> that empties the report and then, <b>with a cursor over tblDepartment</b>, inserts one row per department: number of employees and total salary (0 for an empty department).</p>',
    vi: '<p>setup tạo bảng <code>tblDeptReport(depNum, headcount, payroll)</code>. Viết <code>prBuildDeptReport</code> xoá báo cáo cũ rồi, <b>bằng cursor duyệt tblDepartment</b>, thêm mỗi phòng một dòng: số nhân viên và tổng lương (0 với phòng rỗng).</p>',
    yc: [['DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT depNum FROM tblDepartment; OPEN; FETCH NEXT … WHILE @@FETCH_STATUS = 0 …; CLOSE; DEALLOCATE.', 'DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT depNum FROM tblDepartment; OPEN; FETCH NEXT … WHILE @@FETCH_STATUS = 0 …; CLOSE; DEALLOCATE.'], ['Running it twice must not duplicate rows.', 'Chạy hai lần không được nhân đôi dòng.']],
    setup: SETUP_REPORT,
    khoi: `-- CREATE OR ALTER PROCEDURE prBuildDeptReport AS
-- BEGIN
--     DELETE FROM tblDeptReport;
--     DECLARE ... CURSOR ...
-- END
`,
    giai: CUR,
    kiem: [
      ck(['The report has one correct row per department', 'Báo cáo có mỗi phòng một dòng đúng'], giongNhau('SELECT depNum, headcount, payroll FROM tblDeptReport', `SELECT d.depNum, COUNT(e.empSSN) AS headcount, COALESCE(SUM(e.empSalary), 0) AS payroll FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum`, 'EXEC dbo.prBuildDeptReport;')),
      ck(['Running it twice gives the same report; an empty department shows 0', 'Chạy hai lần vẫn đúng; phòng rỗng hiện 0'], giongNhau('SELECT depNum, headcount, payroll FROM tblDeptReport', `SELECT d.depNum, COUNT(e.empSSN) AS headcount, COALESCE(SUM(e.empSalary), 0) AS payroll FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum`, "INSERT INTO tblDepartment (depNum, depName) VALUES (9, N'Empty'); EXEC dbo.prBuildDeptReport; EXEC dbo.prBuildDeptReport;")),
      ck(['The procedure really uses a cursor and deallocates it', 'Procedure thật sự dùng cursor và giải phóng nó'], `DECLARE @def NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.prBuildDeptReport'));
SET @ok = IIF(@def LIKE N'%CURSOR%' AND @def LIKE N'%FETCH%' AND @def LIKE N'%DEALLOCATE%', 1, 0); SET @info = N'expected DECLARE … CURSOR, FETCH and DEALLOCATE in the procedure';`),
    ],
    saiTay: [CUR.replace('    DELETE FROM tblDeptReport;\n', ''), CUR.replace('COALESCE(SUM(empSalary), 0)', 'SUM(empSalary)').replace('payroll DECIMAL', 'payroll DECIMAL'), `CREATE OR ALTER PROCEDURE prBuildDeptReport AS
BEGIN
    DELETE FROM tblDeptReport;
    INSERT INTO tblDeptReport (depNum, headcount, payroll)
    SELECT d.depNum, COUNT(e.empSSN), COALESCE(SUM(e.empSalary), 0) FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum;
END`],
    gy: [['FETCH NEXT before the loop AND at the end of each iteration; loop WHILE @@FETCH_STATUS = 0.', 'FETCH NEXT trước vòng lặp VÀ ở cuối mỗi vòng; lặp WHILE @@FETCH_STATUS = 0.'], ['CLOSE then DEALLOCATE — or the cursor name stays taken in the session.', 'CLOSE rồi DEALLOCATE — không thì tên cursor vẫn bị chiếm trong phiên.']],
    lhg: [['Forgetting to empty the report — the second run fails on the primary key (or duplicates rows).', 'Quên xoá báo cáo cũ — lần chạy thứ hai lỗi khoá chính (hoặc nhân đôi dòng).'], ['SUM without COALESCE — an empty department gets NULL payroll and the INSERT fails on NOT NULL.', 'SUM không COALESCE — phòng rỗng có payroll NULL và INSERT lỗi NOT NULL.']],
    gt: ['<p>The same report is ONE set-based INSERT … SELECT … GROUP BY (the third sample wrong answer, rejected here only because the task asks to practise the cursor). In real work prefer the set-based form; cursors are for row-by-row side effects such as calling a procedure per row.</p>', '<p>Cùng báo cáo đó chỉ là MỘT câu INSERT … SELECT … GROUP BY (sai mẫu thứ ba — bị từ chối ở đây chỉ vì đề yêu cầu luyện cursor). Khi đi làm hãy ưu tiên cách theo tập; cursor dành cho tác vụ từng dòng như gọi một procedure cho mỗi dòng.</p>'],
    tn: [tn('cursor', 'con trỏ duyệt dòng'), tn('@@FETCH_STATUS', 'trạng thái lần FETCH gần nhất')],
  }),
  cs({
    t: 'inserted and deleted: what is in them?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['inserted', 'deleted', 'statement-level trigger'], tag: ['tsql', 'trigger', 'slide'],
    en: '<p>A trigger on tblEmployee fires after each statement below. How many rows are in <code>inserted</code> and in <code>deleted</code>? (FUHCompany: department 1 has 4 employees, department 9 does not exist.)</p>',
    vi: '<p>Một trigger trên tblEmployee chạy sau mỗi câu dưới đây. <code>inserted</code> và <code>deleted</code> có bao nhiêu dòng? (FUHCompany: phòng 1 có 4 nhân viên, phòng 9 không tồn tại.)</p>',
    bang: [bang1('b1', ['Rows in the virtual tables', 'Số dòng trong bảng ảo'],
      [{ ma: 'cau', ten: 'Statement / Câu lệnh' }, { ma: 'ins', ten: 'inserted' }, { ma: 'del', ten: 'deleted' }],
      [{ o: { cau: 'INSERT INTO tblEmployee (…) VALUES (…), (…)  — two new employees' }, a: { ins: '2', del: '0' } },
        { o: { cau: 'UPDATE tblEmployee SET empSalary = empSalary + 1000 WHERE depNum = 1' }, a: { ins: '4', del: '4' } },
        { o: { cau: 'DELETE FROM tblEmployee WHERE empSSN = 30121050038' }, a: { ins: '0', del: '1' } },
        { o: { cau: 'UPDATE tblEmployee SET empSalary = 0 WHERE depNum = 9' }, a: { ins: '0', del: '0' } }],
      ['INSERT fills inserted; DELETE fills deleted; UPDATE fills both (new version in inserted, old version in deleted). A statement that touches 0 rows still fires the trigger once — with both tables empty.', 'INSERT điền inserted; DELETE điền deleted; UPDATE điền cả hai (bản mới trong inserted, bản cũ trong deleted). Câu lệnh đụng 0 dòng vẫn làm trigger chạy một lần — với cả hai bảng rỗng.'])],
    gy: [['UPDATE = DELETE old version + INSERT new version, as far as the trigger can see.', 'UPDATE = xoá bản cũ + chèn bản mới, theo góc nhìn của trigger.'], ['The trigger fires once per statement, whatever the number of rows.', 'Trigger chạy một lần mỗi câu lệnh, bất kể số dòng.']],
    lhg: [['Answering 1/1 for the UPDATE of department 1 — four rows changed.', 'Trả 1/1 cho UPDATE phòng 1 — bốn dòng đã đổi.'], ['Thinking a statement that changes nothing does not fire the trigger.', 'Tưởng câu lệnh không đổi gì thì không làm trigger chạy.']],
    tn: [tn('statement-level trigger', 'trigger mức câu lệnh')],
  }),
]);
