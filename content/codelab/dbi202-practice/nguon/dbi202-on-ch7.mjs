/**
 * DBI202 · 7.5 Thực hành Chương 7 — luyện như các câu cuối đề PE, trên FUHCompany, chạy trên SQL Server của người học:
 * procedure OUTPUT, procedure có giao dịch, hàm vô hướng + hàm trả bảng, trigger lương ≤ trưởng phòng, trigger nhật ký, cursor.
 */
import { mod, tsql, ck, tuChoi, giongNhau, FUH, tn } from './_chung.mjs';

const E1 = `CREATE OR ALTER PROCEDURE proc_SalaryOfDep
    @depNum INT,
    @total  DECIMAL(12,0) OUTPUT,
    @numEmp INT           OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM tblDepartment WHERE depNum = @depNum)
        RETURN -1;                                      -- department not found
    SELECT @total  = COALESCE(SUM(empSalary), 0),
           @numEmp = COUNT(*)
    FROM tblEmployee
    WHERE depNum = @depNum;
    RETURN 0;
END`;
const E2 = `CREATE OR ALTER PROCEDURE proc_AddEmployeeToProject
    @empSSN  DECIMAL(18,0),
    @empName NVARCHAR(50),
    @salary  DECIMAL(10,0),
    @depNum  INT,
    @proNum  INT,
    @hours   DECIMAL(5,1),
    @msg     NVARCHAR(300) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (@empSSN, @empName, @salary, @depNum);
            INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (@empSSN, @proNum, @hours);
        COMMIT TRANSACTION;
        SET @msg = CONCAT(N'OK: ', @empName, N' added to project ', @proNum);
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;       -- undo BOTH inserts
        SET @msg = CONCAT(N'Error ', ERROR_NUMBER(), N': ', ERROR_MESSAGE());
    END CATCH
END`;
const E34 = `CREATE OR ALTER FUNCTION dbo.fn_NumProjects (@empSSN DECIMAL(18,0))
RETURNS INT
AS
BEGIN
    RETURN (SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = @empSSN);
END
GO
CREATE OR ALTER FUNCTION dbo.fn_WorkersAtLocation (@locName NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT e.empSSN, e.empName, p.proName, w.workHours
    FROM tblLocation l
    JOIN tblProject  p ON p.locNum = l.locNum
    JOIN tblWorksOn  w ON w.proNum = p.proNum
    JOIN tblEmployee e ON e.empSSN = w.empSSN
    WHERE l.locName = @locName
);`;
const E5 = `CREATE OR ALTER TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN;      -- only salary/department changes are checked
    IF EXISTS (SELECT 1
               FROM inserted i
               JOIN tblDepartment d ON d.depNum = i.depNum
               JOIN tblEmployee   m ON m.empSSN = d.mgrSSN      -- the manager's CURRENT row
               WHERE i.empSSN <> d.mgrSSN                        -- the manager himself is not checked
                 AND i.empSalary > m.empSalary)
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50001, N'An employee cannot earn more than the manager of his department.', 1;
    END
END`;
const E6_SETUP = `${FUH}
CREATE TABLE tblEmployeeLog (
    logID     INT IDENTITY(1,1) CONSTRAINT pk_employeelog PRIMARY KEY,
    action    NVARCHAR(10)  NOT NULL,
    empSSN    DECIMAL(18,0) NOT NULL,
    empName   NVARCHAR(50)  NULL,
    oldSalary DECIMAL(10,0) NULL,
    newSalary DECIMAL(10,0) NULL,
    changedAt DATETIME2     NOT NULL CONSTRAINT df_employeelog_at DEFAULT SYSDATETIME(),
    changedBy NVARCHAR(128) NOT NULL CONSTRAINT df_employeelog_by DEFAULT SUSER_SNAME()
);`;
const E6 = `CREATE OR ALTER TRIGGER tr_Employee_Log ON tblEmployee
AFTER DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    -- rows in deleted without a partner in inserted = real deletions
    INSERT INTO tblEmployeeLog (action, empSSN, empName, oldSalary)
    SELECT N'DELETE', d.empSSN, d.empName, d.empSalary
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.empSSN = d.empSSN);
    -- salary changes: old and new version side by side
    INSERT INTO tblEmployeeLog (action, empSSN, empName, oldSalary, newSalary)
    SELECT N'SALARY', i.empSSN, i.empName, d.empSalary, i.empSalary
    FROM inserted i JOIN deleted d ON d.empSSN = i.empSSN
    WHERE ISNULL(i.empSalary, -1) <> ISNULL(d.empSalary, -1);
END`;
const E7 = `CREATE OR ALTER PROCEDURE proc_RaiseByHours
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @ssn DECIMAL(18,0), @salary DECIMAL(10,0), @hours DECIMAL(6,1);
    DECLARE raise_cursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT e.empSSN, e.empSalary, COALESCE(SUM(w.workHours), 0)
        FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
        WHERE e.depNum IN (1, 2)
        GROUP BY e.empSSN, e.empSalary;
    OPEN raise_cursor;
    FETCH NEXT FROM raise_cursor INTO @ssn, @salary, @hours;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE tblEmployee
        SET empSalary = ROUND(@salary * CASE WHEN @hours >= 30 THEN 1.10 ELSE 1.05 END, 0)
        WHERE empSSN = @ssn;
        FETCH NEXT FROM raise_cursor INTO @ssn, @salary, @hours;
    END
    CLOSE raise_cursor;
    DEALLOCATE raise_cursor;
END`;
const RAISE_REF = `SELECT e.empSSN, CAST(ROUND(e.empSalary * CASE WHEN COALESCE((SELECT SUM(w.workHours) FROM tblWorksOn w WHERE w.empSSN = e.empSSN), 0) >= 30 THEN 1.10 ELSE 1.05 END, 0) AS DECIMAL(10,0)) AS newSalary FROM tblEmployee e WHERE e.depNum IN (1, 2)`;

export default mod('dbi202-on-ch7', '7.5 Practice: procedures, functions, triggers & cursors (PE style)', [
  tsql({
    t: 'Exercise 1 — procedure with OUTPUT parameters: total salary of a department', k: 'EASY', p: 10,
    kn: ['OUTPUT parameters', 'RETURN code'], tag: ['tsql', 'procedure', 'pe-q8', 'fuhcompany'],
    en: '<p>Write <code>proc_SalaryOfDep @depNum INT, @total DECIMAL(12,0) OUTPUT, @numEmp INT OUTPUT</code>: the total salary and the number of employees of the department. RETURN -1 when the department does not exist, 0 otherwise. A department without employees gives total 0 and 0 employees.</p>',
    vi: '<p>Viết <code>proc_SalaryOfDep @depNum INT, @total DECIMAL(12,0) OUTPUT, @numEmp INT OUTPUT</code>: tổng lương và số nhân viên của phòng. RETURN -1 khi phòng không tồn tại, 0 trong trường hợp còn lại. Phòng không có nhân viên cho tổng 0 và 0 người.</p>',
    yc: [['Test call: DECLARE @t DECIMAL(12,0), @n INT, @rc INT; EXEC @rc = proc_SalaryOfDep 1, @t OUTPUT, @n OUTPUT;', 'Lệnh thử: DECLARE @t DECIMAL(12,0), @n INT, @rc INT; EXEC @rc = proc_SalaryOfDep 1, @t OUTPUT, @n OUTPUT;']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE proc_SalaryOfDep @depNum INT, @total DECIMAL(12,0) OUTPUT, @numEmp INT OUTPUT AS
-- BEGIN ... END
`,
    giai: E1,
    kiem: [
      ck(['Department 1: 345,000 and 4 employees, return 0', 'Phòng 1: 345.000 và 4 nhân viên, trả 0'], `DECLARE @t DECIMAL(12,0), @n INT, @rc INT; EXEC @rc = dbo.proc_SalaryOfDep 1, @t OUTPUT, @n OUTPUT;
SET @ok = IIF(@rc = 0 AND @t = 345000 AND @n = 4, 1, 0); SET @info = CONCAT(N'rc=', @rc, N' total=', @t, N' n=', @n);`),
      ck(['Unknown department 9: return -1', 'Phòng 9 không tồn tại: trả -1'], `DECLARE @t DECIMAL(12,0), @n INT, @rc INT; EXEC @rc = dbo.proc_SalaryOfDep 9, @t OUTPUT, @n OUTPUT; SET @ok = IIF(@rc = -1, 1, 0); SET @info = CONCAT(N'rc=', @rc);`),
      ck(['An empty department: 0 and 0', 'Phòng rỗng: 0 và 0'], `DECLARE @t DECIMAL(12,0), @n INT, @rc INT; BEGIN TRAN; INSERT INTO tblDepartment (depNum, depName) VALUES (8, N'New');
EXEC @rc = dbo.proc_SalaryOfDep 8, @t OUTPUT, @n OUTPUT; SET @ok = IIF(@rc = 0 AND @t = 0 AND @n = 0, 1, 0); SET @info = CONCAT(N'total=', COALESCE(CAST(@t AS NVARCHAR(20)), N'NULL'), N' n=', @n); ROLLBACK;`),
    ],
    saiTay: [E1.replace('COALESCE(SUM(empSalary), 0)', 'SUM(empSalary)'), E1.replace('        RETURN -1;                                      -- department not found\n', '        RETURN 0;\n')],
    gy: [['One SELECT can assign both outputs: SELECT @total = …, @numEmp = COUNT(*) FROM … WHERE depNum = @depNum.', 'Một câu SELECT gán được cả hai đầu ra: SELECT @total = …, @numEmp = COUNT(*) FROM … WHERE depNum = @depNum.'], ['COUNT(*) of no rows is 0, SUM is NULL — COALESCE it.', 'COUNT(*) của không dòng là 0, SUM là NULL — COALESCE nó.']],
    lhg: [['SUM without COALESCE — an empty department returns NULL.', 'SUM không COALESCE — phòng rỗng trả NULL.'], ['No existence check — department 9 returns 0 instead of -1.', 'Không kiểm tồn tại — phòng 9 trả 0 thay vì -1.']],
    gt: ['<p>This is exactly PE question 8. Submit only the CREATE PROCEDURE (no GO, no test EXEC).</p>', '<p>Đây đúng là câu 8 của đề PE. Chỉ nộp lệnh CREATE PROCEDURE (không GO, không EXEC thử).</p>'],
    tn: [tn('OUTPUT parameter', 'tham số ra')],
  }),
  tsql({
    t: 'Exercise 2 — procedure with a transaction: add an employee to a project, all or nothing', k: 'MEDIUM', p: 14,
    kn: ['BEGIN TRANSACTION', 'TRY … CATCH', 'ROLLBACK'], tag: ['tsql', 'procedure', 'transaction', 'fuhcompany'],
    en: '<p>Write <code>proc_AddEmployeeToProject @empSSN, @empName, @salary, @depNum, @proNum, @hours, @msg NVARCHAR(300) OUTPUT</code> that inserts the employee AND their assignment to the project. If either insert fails (e.g. the project does not exist), <b>neither</b> row may remain; @msg says "OK: …" or "Error &lt;number&gt;: …".</p>',
    vi: '<p>Viết <code>proc_AddEmployeeToProject @empSSN, @empName, @salary, @depNum, @proNum, @hours, @msg NVARCHAR(300) OUTPUT</code> chèn nhân viên VÀ phân công của họ vào dự án. Nếu một trong hai lệnh chèn lỗi (vd dự án không tồn tại) thì <b>không</b> dòng nào được còn lại; @msg là "OK: …" hoặc "Error &lt;mã&gt;: …".</p>',
    yc: [['Both INSERTs inside one transaction in TRY; ROLLBACK in CATCH.', 'Hai INSERT trong một giao dịch nằm trong TRY; ROLLBACK trong CATCH.'], ['@msg starts with "OK" on success and "Error" on failure.', '@msg bắt đầu bằng "OK" khi thành công và "Error" khi lỗi.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE proc_AddEmployeeToProject
--     @empSSN DECIMAL(18,0), @empName NVARCHAR(50), @salary DECIMAL(10,0), @depNum INT, @proNum INT, @hours DECIMAL(5,1),
--     @msg NVARCHAR(300) OUTPUT
-- AS BEGIN ... END
`,
    giai: E2,
    kiem: [
      ck(['A valid call adds the employee and the assignment', 'Lời gọi hợp lệ thêm nhân viên và phân công'], `DECLARE @m NVARCHAR(300); BEGIN TRAN; EXEC dbo.proc_AddEmployeeToProject 30121050300, N'Đinh Thị Hoa', 50000, 1, 2, 15, @m OUTPUT;
SET @ok = IIF(@m LIKE N'OK%' AND EXISTS (SELECT 1 FROM tblEmployee WHERE empSSN = 30121050300) AND EXISTS (SELECT 1 FROM tblWorksOn WHERE empSSN = 30121050300 AND proNum = 2), 1, 0);
SET @info = CONCAT(N'@msg = ', @m); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['Project 99 does not exist: NO employee row remains, @msg starts with Error', 'Dự án 99 không tồn tại: KHÔNG còn dòng nhân viên, @msg bắt đầu bằng Error'], `DECLARE @m NVARCHAR(300);
EXEC dbo.proc_AddEmployeeToProject 30121050301, N'Tạ Văn Long', 48000, 1, 99, 10, @m OUTPUT;
SET @ok = IIF(@m LIKE N'Error%' AND NOT EXISTS (SELECT 1 FROM tblEmployee WHERE empSSN = 30121050301), 1, 0);
SET @info = CONCAT(N'@msg = ', @m, N' · employee rows left: ', (SELECT COUNT(*) FROM tblEmployee WHERE empSSN = 30121050301));
DELETE FROM tblEmployee WHERE empSSN = 30121050301;`),
      ck(['No transaction left open, no error escapes', 'Không để giao dịch mở, không lỗi nào thoát ra'], `DECLARE @m NVARCHAR(300), @thoat BIT = 0;
BEGIN TRY EXEC dbo.proc_AddEmployeeToProject 30121050001, N'Dup', 1, 1, 1, 1, @m OUTPUT; END TRY BEGIN CATCH SET @thoat = 1; END CATCH;
SET @ok = IIF(@thoat = 0 AND @@TRANCOUNT = 0 AND @m LIKE N'Error%', 1, 0); SET @info = CONCAT(N'@msg = ', @m, N' · trancount = ', @@TRANCOUNT);`),
    ],
    saiTay: [E2.replace('        BEGIN TRANSACTION;\n', '').replace('        COMMIT TRANSACTION;\n', '').replace('        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;       -- undo BOTH inserts\n', '')],
    gy: [['Without the transaction the first INSERT stays even when the second fails.', 'Không có giao dịch thì INSERT đầu vẫn còn dù INSERT sau lỗi.'], ['In CATCH: IF @@TRANCOUNT &gt; 0 ROLLBACK TRANSACTION.', 'Trong CATCH: IF @@TRANCOUNT &gt; 0 ROLLBACK TRANSACTION.']],
    lhg: [['No transaction — an employee without the project assignment is left behind.', 'Không giao dịch — sót lại một nhân viên không có phân công.'], ['ROLLBACK without checking @@TRANCOUNT — error 3903 when nothing is open.', 'ROLLBACK không kiểm @@TRANCOUNT — lỗi 3903 khi không có giao dịch nào mở.']],
    gt: ['<p>Atomicity in practice: the two INSERTs succeed or fail together.</p>', '<p>Tính nguyên tử trong thực tế: hai INSERT cùng thành công hoặc cùng thất bại.</p>'],
    tn: [tn('atomicity', 'tính nguyên tử')],
  }),
  tsql({
    t: 'Exercises 3–4 — a scalar function and a table-valued function', k: 'MEDIUM', p: 14,
    kn: ['scalar function', 'inline TVF', "N'' parameter"], tag: ['tsql', 'function', 'fuhcompany'],
    en: '<p>Write <code>dbo.fn_NumProjects(@empSSN DECIMAL(18,0)) RETURNS INT</code> — the number of projects the employee works on — and <code>dbo.fn_WorkersAtLocation(@locName NVARCHAR(50)) RETURNS TABLE</code> — <code>empSSN, empName, proName, workHours</code> of everybody working on a project located there.</p>',
    vi: '<p>Viết <code>dbo.fn_NumProjects(@empSSN DECIMAL(18,0)) RETURNS INT</code> — số dự án nhân viên tham gia — và <code>dbo.fn_WorkersAtLocation(@locName NVARCHAR(50)) RETURNS TABLE</code> — <code>empSSN, empName, proName, workHours</code> của mọi người làm dự án đặt tại đó.</p>',
    yc: [['Separate the two CREATE FUNCTION with GO.', 'Tách hai CREATE FUNCTION bằng GO.'], ["Call with N'TP Hà Nội' — a non-Unicode literal loses the accents and matches nothing.", "Gọi với N'TP Hà Nội' — chuỗi không Unicode mất dấu và không khớp gì."]],
    setup: FUH,
    khoi: `-- CREATE OR ALTER FUNCTION dbo.fn_NumProjects (@empSSN DECIMAL(18,0)) RETURNS INT AS BEGIN ... END
-- GO
-- CREATE OR ALTER FUNCTION dbo.fn_WorkersAtLocation (@locName NVARCHAR(50)) RETURNS TABLE AS RETURN (...);
`,
    giai: E34,
    kiem: [
      ck(['fn_NumProjects: 003 → 3, 037 → 0', 'fn_NumProjects: 003 → 3, 037 → 0'], `SET @ok = IIF(dbo.fn_NumProjects(30121050003) = 3 AND dbo.fn_NumProjects(30121050037) = 0, 1, 0); SET @info = CONCAT(N'got ', dbo.fn_NumProjects(30121050003), N' and ', dbo.fn_NumProjects(30121050037));`),
      ck(['Employees on 2+ projects via the function', 'Nhân viên làm từ 2 dự án qua hàm'], giongNhau('SELECT empSSN FROM tblEmployee WHERE dbo.fn_NumProjects(empSSN) >= 2', 'SELECT empSSN FROM tblWorksOn GROUP BY empSSN HAVING COUNT(*) >= 2')),
      ck(["fn_WorkersAtLocation(N'TP Hà Nội') = staff of ProjectA and ProjectC", "fn_WorkersAtLocation(N'TP Hà Nội') = người làm ProjectA và ProjectC"], giongNhau(`SELECT empSSN, empName, proName, workHours FROM dbo.fn_WorkersAtLocation(N'TP Hà Nội')`, `SELECT e.empSSN, e.empName, p.proName, w.workHours FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum JOIN tblEmployee e ON e.empSSN = w.empSSN WHERE p.locNum = 1`)),
      ck(['Usable with GROUP BY: hours in TP Hồ Chí Minh per employee', 'Dùng được với GROUP BY: giờ ở TP Hồ Chí Minh mỗi người'], giongNhau(`SELECT empName, SUM(workHours) AS h FROM dbo.fn_WorkersAtLocation(N'TP Hồ Chí Minh') GROUP BY empName`, `SELECT e.empName, SUM(w.workHours) AS h FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum JOIN tblEmployee e ON e.empSSN = w.empSSN WHERE p.locNum = 2 GROUP BY e.empName`)),
    ],
    saiTay: [E34.replace('@locName NVARCHAR(50)', '@locName VARCHAR(50)'), E34.replace('RETURN (SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = @empSSN);', 'RETURN (SELECT COUNT(DISTINCT proNum) FROM tblWorksOn);')],
    gy: [['Scalar: RETURN (SELECT COUNT(*) … WHERE empSSN = @empSSN).', 'Vô hướng: RETURN (SELECT COUNT(*) … WHERE empSSN = @empSSN).'], ['TVF: four tables, filter on l.locName = @locName (NVARCHAR parameter!).', 'TVF: bốn bảng, lọc l.locName = @locName (tham số NVARCHAR!).']],
    lhg: [["Declaring @locName VARCHAR — N'TP Hà Nội' is converted and 'Hà Nội' no longer matches.", "Khai @locName VARCHAR — N'TP Hà Nội' bị chuyển đổi và 'Hà Nội' không còn khớp."], ['Forgetting the WHERE on @empSSN in the scalar function.', 'Quên WHERE theo @empSSN trong hàm vô hướng.']],
    gt: ['<p>The same "2+ projects" list is a GROUP BY … HAVING — faster on big tables than calling a scalar function per row.</p>', '<p>Cùng danh sách "từ 2 dự án" là GROUP BY … HAVING — nhanh hơn trên bảng lớn so với gọi hàm vô hướng mỗi dòng.</p>'],
    tn: [tn('table-valued function', 'hàm trả bảng')],
  }),
  tsql({
    t: 'Exercise 5 — trigger: no employee may earn more than his manager', k: 'HARD', p: 18,
    kn: ['AFTER INSERT, UPDATE', 'UPDATE(column)', 'join inserted with other tables'], tag: ['tsql', 'trigger', 'fuhcompany'],
    en: '<p>Create <code>tr_Salary_Not_Above_Manager</code> on tblEmployee (AFTER INSERT, UPDATE): an employee (other than the manager himself) may not earn more than the manager of his department; violating statements are rolled back with an error. Trap: Đặng Tuấn Anh <b>already</b> earns 105,000 &gt; his manager\'s 95,000 — changing only his address must still be allowed (check only salary/department changes).</p>',
    vi: '<p>Tạo <code>tr_Salary_Not_Above_Manager</code> trên tblEmployee (AFTER INSERT, UPDATE): một nhân viên (không tính chính trưởng phòng) không được lương cao hơn trưởng phòng của mình; câu vi phạm bị huỷ kèm lỗi. Bẫy: Đặng Tuấn Anh <b>vốn đã</b> lương 105.000 &gt; 95.000 của trưởng phòng — chỉ đổi địa chỉ của anh ta vẫn phải được phép (chỉ kiểm khi đổi lương/phòng).</p>',
    yc: [['IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN; then the set-based check.', 'IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN; rồi phép kiểm theo tập.'], ['ROLLBACK TRANSACTION + THROW/RAISERROR on violation.', 'ROLLBACK TRANSACTION + THROW/RAISERROR khi vi phạm.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee AFTER INSERT, UPDATE AS
-- BEGIN ... END
`,
    giai: E5,
    kiem: [
      ck(['Mai Duy An (dept 2) to 100,000 > 95,000 is rejected', 'Mai Duy An (phòng 2) lên 100.000 > 95.000 bị từ chối'], tuChoi(['UPDATE tblEmployee SET empSalary = 100000 WHERE empSSN = 30121050005'])),
      ck(['90,000 for Mai Duy An is accepted', '90.000 cho Mai Duy An được nhận'], `BEGIN TRAN; UPDATE tblEmployee SET empSalary = 90000 WHERE empSSN = 30121050005;
SET @ok = IIF((SELECT empSalary FROM tblEmployee WHERE empSSN = 30121050005) = 90000, 1, 0); SET @info = N'a salary below the manager must be accepted'; IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['A new employee of dept 1 with 160,000 is rejected', 'Nhân viên mới phòng 1 lương 160.000 bị từ chối'], tuChoi(["INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050400, N'Lâm Chí Cao', 160000, 1)"])),
      ck(['Changing only Đặng Tuấn Anh\'s address is accepted', 'Chỉ đổi địa chỉ Đặng Tuấn Anh được nhận'], `BEGIN TRAN; UPDATE tblEmployee SET empAddress = N'Đà Nẵng' WHERE empSSN = 30121050012;
SET @ok = IIF((SELECT empAddress FROM tblEmployee WHERE empSSN = 30121050012) = N'Đà Nẵng', 1, 0); SET @info = N'an address change must not be blocked'; IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['A 10% raise for all of department 3 (manager included) is accepted', 'Tăng 10% cả phòng 3 (kể cả trưởng phòng) được nhận'], `BEGIN TRAN; UPDATE tblEmployee SET empSalary = empSalary * 1.1 WHERE depNum = 3;
SET @ok = IIF((SELECT empSalary FROM tblEmployee WHERE empSSN = 30121050020) = 96800, 1, 0); SET @info = N'the whole department rising together must be accepted'; IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [E5.replace('    IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN;      -- only salary/department changes are checked\n', ''), E5.replace('AFTER INSERT, UPDATE', 'AFTER UPDATE')],
    gy: [['Join inserted → tblDepartment (depNum) → tblEmployee m (mgrSSN) to get the manager\'s salary.', 'Nối inserted → tblDepartment (depNum) → tblEmployee m (mgrSSN) để lấy lương trưởng phòng.'], ['UPDATE(col) inside a trigger tells whether the statement assigned that column.', 'UPDATE(cột) trong trigger cho biết câu lệnh có gán cột đó không.']],
    lhg: [['No UPDATE(…) guard — an address change of an employee who already breaks the rule is rejected.', 'Không chặn bằng UPDATE(…) — đổi địa chỉ của người vốn đã vi phạm luật bị từ chối.'], ['AFTER UPDATE only — a new employee can be INSERTED with any salary.', 'Chỉ AFTER UPDATE — nhân viên mới được CHÈN với lương bất kỳ.']],
    gt: ['<p>AFTER triggers see the table AFTER the change, so m.empSalary is the manager\'s NEW salary when he is updated in the same statement — that is why the 10% raise of the whole department passes.</p>', '<p>Trigger AFTER thấy bảng SAU thay đổi, nên m.empSalary là lương MỚI của trưởng phòng khi ông được cập nhật cùng câu — vì vậy tăng 10% cả phòng vẫn qua.</p>'],
    tn: [tn('UPDATE(column)', 'hàm kiểm cột có được gán')],
  }),
  tsql({
    t: 'Exercise 6 — trigger: keep a log of deletions and salary changes', k: 'HARD', p: 15,
    kn: ['AFTER DELETE, UPDATE', 'deleted without inserted', 'log table with defaults'], tag: ['tsql', 'trigger', 'audit', 'fuhcompany'],
    en: '<p>The setup creates <code>tblEmployeeLog(logID IDENTITY, action, empSSN, empName, oldSalary, newSalary, changedAt DEFAULT SYSDATETIME(), changedBy DEFAULT SUSER_SNAME())</code>. Create <code>tr_Employee_Log</code> (AFTER DELETE, UPDATE on tblEmployee) that logs <b>DELETE</b> rows (with the old salary) and <b>SALARY</b> rows (old and new salary) — nothing for updates that do not change the salary.</p>',
    vi: '<p>setup tạo <code>tblEmployeeLog(logID IDENTITY, action, empSSN, empName, oldSalary, newSalary, changedAt DEFAULT SYSDATETIME(), changedBy DEFAULT SUSER_SNAME())</code>. Tạo <code>tr_Employee_Log</code> (AFTER DELETE, UPDATE trên tblEmployee) ghi dòng <b>DELETE</b> (kèm lương cũ) và dòng <b>SALARY</b> (lương cũ và mới) — không ghi gì khi UPDATE không đổi lương.</p>',
    yc: [['A deletion = a row of deleted with no partner in inserted.', 'Một lần xoá = dòng của deleted không có cặp trong inserted.'], ['A salary change = inserted JOIN deleted with a different salary.', 'Đổi lương = inserted JOIN deleted có lương khác nhau.']],
    setup: E6_SETUP,
    khoi: `-- CREATE OR ALTER TRIGGER tr_Employee_Log ON tblEmployee AFTER DELETE, UPDATE AS
-- BEGIN ... END
`,
    giai: E6,
    kiem: [
      ck(['Deleting Phan Hữu Nghĩa logs one DELETE with 38,000', 'Xoá Phan Hữu Nghĩa ghi một DELETE với 38.000'], `BEGIN TRAN; DELETE FROM tblEmployee WHERE empSSN = 30121050038;
SET @ok = IIF((SELECT COUNT(*) FROM tblEmployeeLog) = 1 AND EXISTS (SELECT 1 FROM tblEmployeeLog WHERE action = N'DELETE' AND empSSN = 30121050038 AND oldSalary = 38000), 1, 0);
SET @info = CONCAT(N'log rows: ', (SELECT COUNT(*) FROM tblEmployeeLog)); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['A raise of department 3 logs three SALARY rows', 'Tăng lương phòng 3 ghi ba dòng SALARY'], `BEGIN TRAN; UPDATE tblEmployee SET empSalary = empSalary + 2000 WHERE depNum = 3;
SET @ok = IIF((SELECT COUNT(*) FROM tblEmployeeLog WHERE action = N'SALARY') = 3 AND EXISTS (SELECT 1 FROM tblEmployeeLog WHERE empSSN = 30121050021 AND oldSalary = 40000 AND newSalary = 42000), 1, 0);
SET @info = CONCAT(N'SALARY rows: ', (SELECT COUNT(*) FROM tblEmployeeLog WHERE action = N'SALARY')); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['An address change logs nothing', 'Đổi địa chỉ không ghi gì'], `BEGIN TRAN; UPDATE tblEmployee SET empAddress = N'Huế' WHERE empSSN = 30121050030;
SET @ok = IIF((SELECT COUNT(*) FROM tblEmployeeLog) = 0, 1, 0); SET @info = CONCAT(N'log rows: ', (SELECT COUNT(*) FROM tblEmployeeLog)); IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [E6.replace("    WHERE ISNULL(i.empSalary, -1) <> ISNULL(d.empSalary, -1);\n", ";\n"), E6.replace("    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.empSSN = d.empSSN);\n", ";\n")],
    gy: [['An UPDATE puts every row in BOTH deleted and inserted — so "deleted only" means a real DELETE.', 'UPDATE đặt mọi dòng vào CẢ deleted và inserted — nên "chỉ có trong deleted" mới là DELETE thật.'], ['Two INSERT … SELECT statements in the trigger, one per action.', 'Hai câu INSERT … SELECT trong trigger, mỗi hành động một câu.']],
    lhg: [['Logging every UPDATE as SALARY — an address change creates a log row.', 'Ghi mọi UPDATE thành SALARY — đổi địa chỉ cũng tạo dòng nhật ký.'], ['Treating every row of deleted as a deletion — each salary update also logs a DELETE.', 'Coi mọi dòng của deleted là một lần xoá — mỗi lần đổi lương cũng ghi một DELETE.']],
    gt: ['<p>The defaults of the log table fill changedAt and changedBy, so the trigger only provides the business columns.</p>', '<p>Giá trị mặc định của bảng nhật ký điền changedAt và changedBy, nên trigger chỉ cần đưa các cột nghiệp vụ.</p>'],
    tn: [tn('audit log', 'nhật ký kiểm toán')],
  }),
  tsql({
    t: 'Exercise 7 — cursor: raise salaries by working hours', k: 'MEDIUM', p: 14,
    kn: ['cursor over a grouped query', 'FAST_FORWARD', 'row-by-row UPDATE'], tag: ['tsql', 'cursor', 'fuhcompany'],
    en: '<p>Write <code>proc_RaiseByHours</code> that walks with a <b>cursor</b> over the employees of departments 1 and 2 with their total working hours and raises each one: <b>+10%</b> when the total is ≥ 30 hours, otherwise <b>+5%</b>, rounded to whole VND. (Lesson 7.4 shows the one-UPDATE version — here practise the cursor.)</p>',
    vi: '<p>Viết <code>proc_RaiseByHours</code> dùng <b>cursor</b> duyệt nhân viên phòng 1 và 2 kèm tổng giờ làm và tăng lương từng người: <b>+10%</b> khi tổng ≥ 30 giờ, ngược lại <b>+5%</b>, làm tròn tới đồng. (Bài 7.4 có bản một câu UPDATE — ở đây luyện cursor.)</p>',
    yc: [['DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT … LEFT JOIN … GROUP BY …', 'DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT … LEFT JOIN … GROUP BY …'], ['CLOSE and DEALLOCATE at the end.', 'CLOSE và DEALLOCATE ở cuối.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE proc_RaiseByHours AS
-- BEGIN ... DECLARE ... CURSOR ... END
`,
    giai: E7,
    kiem: [
      ck(['New salaries of departments 1 and 2 are right (incl. a new employee with no project)', 'Lương mới của phòng 1 và 2 đúng (kể cả người mới chưa có dự án)'], `BEGIN TRAN;
INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050500, N'Mới, chưa có dự án', 40000, 1);
SELECT * INTO #truoc FROM (${RAISE_REF}) AS r;
EXEC dbo.proc_RaiseByHours;
SET @ok = IIF(NOT EXISTS (SELECT e.empSSN, e.empSalary FROM tblEmployee e WHERE e.depNum IN (1, 2) EXCEPT SELECT empSSN, newSalary FROM #truoc), 1, 0);
SET @info = N'compare with ROUND(salary × 1.10 if total hours ≥ 30 else × 1.05, 0)'; ROLLBACK;`),
      ck(['Departments 3–5 are untouched', 'Phòng 3–5 không bị đụng'], `BEGIN TRAN; EXEC dbo.proc_RaiseByHours;
SET @ok = IIF((SELECT SUM(empSalary) FROM tblEmployee WHERE depNum NOT IN (1, 2)) = 353000, 1, 0); SET @info = CONCAT(N'sum = ', (SELECT SUM(empSalary) FROM tblEmployee WHERE depNum NOT IN (1, 2))); ROLLBACK;`),
      ck(['It really uses a cursor and deallocates it', 'Thật sự dùng cursor và giải phóng nó'], `DECLARE @def NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.proc_RaiseByHours'));
SET @ok = IIF(@def LIKE N'%CURSOR%' AND @def LIKE N'%DEALLOCATE%', 1, 0); SET @info = N'expected DECLARE … CURSOR … DEALLOCATE';`),
    ],
    saiTay: [E7.replace('FROM tblEmployee e LEFT JOIN tblWorksOn w', 'FROM tblEmployee e JOIN tblWorksOn w'), E7.replace('CASE WHEN @hours >= 30 THEN 1.10 ELSE 1.05 END', 'CASE WHEN @hours > 30 THEN 1.10 ELSE 1.05 END')],
    gy: [['FETCH NEXT before the loop and at the end of each iteration.', 'FETCH NEXT trước vòng lặp và cuối mỗi vòng.'], ['LEFT JOIN so an employee with no project still gets +5%.', 'LEFT JOIN để người không có dự án vẫn được +5%.']],
    lhg: [['INNER JOIN — an employee with no project is skipped and gets no raise at all.', 'INNER JOIN — người chưa có dự án bị bỏ qua, không được tăng lương.'], ['&gt; 30 instead of &gt;= 30 — Phạm Quốc Bảo (exactly 30 hours) gets only 5%.', '&gt; 30 thay vì &gt;= 30 — Phạm Quốc Bảo (đúng 30 giờ) chỉ được 5%.']],
    gt: ['<p>Compare with lesson 7.4: one UPDATE with a correlated SUM does the same job. Know both — the PE may ask for a cursor explicitly.</p>', '<p>So với bài 7.4: một câu UPDATE có SUM tương quan làm cùng việc. Biết cả hai — đề PE có thể yêu cầu cursor rõ ràng.</p>'],
    tn: [tn('cursor', 'con trỏ')],
  }),
]);
