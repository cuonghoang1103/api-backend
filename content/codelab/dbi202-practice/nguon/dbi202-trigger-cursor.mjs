/**
 * DBI202 · 7.4 Trigger & cursor (và khi nào KHÔNG dùng) — trigger kiểm toán điểm (inserted ⋈ deleted), trigger giữ tổng
 * đếm nhiều dòng, INSTEAD OF DELETE (xoá mềm), viết lại cursor thành một câu UPDATE (chấm trong trình duyệt).
 */
import { mod, de, cs, q, sau, ma, tsql, ck, giongNhau, FUH, TN, tn } from './_chung.mjs';

const DK = `CREATE TABLE Student (sid INT NOT NULL PRIMARY KEY, fullName NVARCHAR(50) NOT NULL);
CREATE TABLE Course (cid CHAR(6) NOT NULL PRIMARY KEY, title NVARCHAR(60) NOT NULL);
CREATE TABLE Enrolment (sid INT NOT NULL REFERENCES Student (sid), cid CHAR(6) NOT NULL REFERENCES Course (cid),
                        grade DECIMAL(4,2) NULL, PRIMARY KEY (sid, cid));
CREATE TABLE GradeAudit (auditID INT IDENTITY(1,1) PRIMARY KEY, sid INT NOT NULL, cid CHAR(6) NOT NULL,
                         old_grade DECIMAL(4,2) NULL, new_grade DECIMAL(4,2) NULL,
                         changed_at DATETIME2 NOT NULL, changed_by NVARCHAR(128) NOT NULL);
INSERT INTO Student VALUES (1, N'An'), (2, N'Bình'), (3, N'Chi');
INSERT INTO Course VALUES ('DBI202', N'Database Systems'), ('PRF192', N'Programming');
INSERT INTO Enrolment VALUES (1, 'DBI202', 6.0), (2, 'DBI202', 7.5), (3, 'DBI202', NULL), (1, 'PRF192', 8.0);`;
const AUDIT = `CREATE OR ALTER TRIGGER trg_Enrolment_Audit ON Enrolment
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO GradeAudit (sid, cid, old_grade, new_grade, changed_at, changed_by)
    SELECT i.sid, i.cid, d.grade, i.grade, SYSDATETIME(), SUSER_SNAME()
    FROM inserted i
    JOIN deleted d ON d.sid = i.sid AND d.cid = i.cid
    WHERE ISNULL(i.grade, -1) <> ISNULL(d.grade, -1);      -- only real changes, NULL-safe
END`;

const DEM_SETUP = `${FUH}
GO
ALTER TABLE tblDepartment ADD empCount INT NOT NULL CONSTRAINT df_department_empcount DEFAULT 0;
GO
UPDATE d SET empCount = (SELECT COUNT(*) FROM tblEmployee e WHERE e.depNum = d.depNum) FROM tblDepartment d;`;
const DEM = `CREATE OR ALTER TRIGGER trKeepEmpCount ON tblEmployee
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE d
    SET empCount = d.empCount
                 + COALESCE((SELECT COUNT(*) FROM inserted i WHERE i.depNum = d.depNum), 0)
                 - COALESCE((SELECT COUNT(*) FROM deleted  x WHERE x.depNum = d.depNum), 0)
    FROM tblDepartment d
    WHERE d.depNum IN (SELECT depNum FROM inserted UNION SELECT depNum FROM deleted);   -- set-based: any number of rows
END`;

const MEM_SETUP = `${FUH}
GO
ALTER TABLE tblProject ADD isActive BIT NOT NULL CONSTRAINT df_project_active DEFAULT 1;`;
const MEM = `CREATE OR ALTER TRIGGER trSoftDeleteProject ON tblProject
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p SET isActive = 0                   -- keep the row (its tblWorksOn history stays valid)
    FROM tblProject p
    WHERE p.proNum IN (SELECT proNum FROM deleted);
END`;

export default mod('dbi202-trigger-cursor', '7.4 Triggers & cursors (and when not to use them)', [
  tsql({
    t: 'Audit trigger: log every real grade change (inserted ⋈ deleted)', k: 'MEDIUM', p: 15,
    kn: ['AFTER UPDATE', 'inserted JOIN deleted', 'NULL-safe comparison'], tag: ['tsql', 'trigger', 'audit'],
    en: '<p>Create <code>trg_Enrolment_Audit</code> (AFTER UPDATE on Enrolment) that writes one row into <code>GradeAudit(sid, cid, old_grade, new_grade, changed_at, changed_by)</code> for every enrolment whose grade really changed — including NULL → value — and nothing for updates that leave the grade as it was. Use <code>SYSDATETIME()</code> and <code>SUSER_SNAME()</code>.</p>',
    vi: '<p>Tạo <code>trg_Enrolment_Audit</code> (AFTER UPDATE trên Enrolment) ghi một dòng vào <code>GradeAudit(sid, cid, old_grade, new_grade, changed_at, changed_by)</code> cho mỗi lượt đăng ký có điểm thật sự đổi — kể cả NULL → có điểm — và không ghi gì khi câu UPDATE giữ nguyên điểm. Dùng <code>SYSDATETIME()</code> và <code>SUSER_SNAME()</code>.</p>',
    yc: [['One INSERT … SELECT … FROM inserted i JOIN deleted d ON the key.', 'Một câu INSERT … SELECT … FROM inserted i JOIN deleted d ON khoá.'], ['Compare NULL-safely: ISNULL(i.grade, -1) &lt;&gt; ISNULL(d.grade, -1).', 'So sánh an toàn với NULL: ISNULL(i.grade, -1) &lt;&gt; ISNULL(d.grade, -1).']],
    setup: DK,
    khoi: `-- CREATE OR ALTER TRIGGER trg_Enrolment_Audit ON Enrolment AFTER UPDATE AS
-- BEGIN ... END
`,
    giai: AUDIT,
    kiem: [
      ck(['One change → one audit row 6.0 → 8.5', 'Một thay đổi → một dòng 6,0 → 8,5'], `BEGIN TRAN; UPDATE Enrolment SET grade = 8.5 WHERE sid = 1 AND cid = 'DBI202';
SET @ok = IIF((SELECT COUNT(*) FROM GradeAudit) = 1 AND EXISTS (SELECT 1 FROM GradeAudit WHERE sid = 1 AND cid = 'DBI202' AND old_grade = 6.0 AND new_grade = 8.5 AND changed_by IS NOT NULL), 1, 0);
SET @info = CONCAT(N'audit rows: ', (SELECT COUNT(*) FROM GradeAudit)); ROLLBACK;`),
      ck(['A three-row UPDATE logs only the real changes (NULL → 5 counts)', 'UPDATE ba dòng chỉ ghi các thay đổi thật (NULL → 5 cũng tính)'], `BEGIN TRAN; UPDATE Enrolment SET grade = CASE sid WHEN 1 THEN 6.0 WHEN 2 THEN 9.0 ELSE 5.0 END WHERE cid = 'DBI202';
SET @ok = IIF((SELECT COUNT(*) FROM GradeAudit) = 2 AND EXISTS (SELECT 1 FROM GradeAudit WHERE sid = 3 AND old_grade IS NULL AND new_grade = 5.0), 1, 0);
SET @info = CONCAT(N'audit rows: ', (SELECT COUNT(*) FROM GradeAudit), N' (expected 2: Bình 7.5 → 9.0 and Chi NULL → 5.0; An unchanged)'); ROLLBACK;`),
      ck(['An UPDATE that changes nothing logs nothing', 'UPDATE không đổi gì thì không ghi gì'], `BEGIN TRAN; UPDATE Enrolment SET grade = grade WHERE cid = 'PRF192';
SET @ok = IIF((SELECT COUNT(*) FROM GradeAudit) = 0, 1, 0); SET @info = CONCAT(N'audit rows: ', (SELECT COUNT(*) FROM GradeAudit)); ROLLBACK;`),
    ],
    saiTay: [
      AUDIT.replace('WHERE ISNULL(i.grade, -1) <> ISNULL(d.grade, -1);      -- only real changes, NULL-safe', 'WHERE i.grade <> d.grade;'),
      `CREATE OR ALTER TRIGGER trg_Enrolment_Audit ON Enrolment AFTER UPDATE AS
BEGIN
    DECLARE @sid INT, @cid CHAR(6), @o DECIMAL(4,2), @n DECIMAL(4,2);
    SELECT @sid = i.sid, @cid = i.cid, @n = i.grade, @o = d.grade FROM inserted i JOIN deleted d ON d.sid = i.sid AND d.cid = i.cid;
    IF ISNULL(@n, -1) <> ISNULL(@o, -1)
        INSERT INTO GradeAudit (sid, cid, old_grade, new_grade, changed_at, changed_by) VALUES (@sid, @cid, @o, @n, SYSDATETIME(), SUSER_SNAME());
END`,
    ],
    gy: [['UPDATE fills both tables: deleted = old version, inserted = new version — join them on the key.', 'UPDATE điền cả hai bảng: deleted = bản cũ, inserted = bản mới — nối chúng theo khoá.'], ['i.grade &lt;&gt; d.grade is UNKNOWN when one side is NULL — use ISNULL on both sides.', 'i.grade &lt;&gt; d.grade là UNKNOWN khi một bên NULL — dùng ISNULL ở cả hai bên.']],
    lhg: [['WHERE i.grade &lt;&gt; d.grade — the NULL → 5 change of Chi is not logged.', 'WHERE i.grade &lt;&gt; d.grade — thay đổi NULL → 5 của Chi không được ghi.'], ['Copying inserted into variables — with a multi-row UPDATE only one row is logged.', 'Chép inserted vào biến — UPDATE nhiều dòng chỉ ghi được một dòng.']],
    gt: ['<p>The history is captured whoever runs the UPDATE — the strongest argument for a trigger. Keep it set-based and small: it runs inside the user\'s transaction.</p>', '<p>Lịch sử được ghi bất kể ai chạy UPDATE — lý do mạnh nhất để dùng trigger. Giữ nó theo tập và gọn: nó chạy trong giao dịch của người dùng.</p>'],
    tn: [tn('audit trail', 'nhật ký kiểm toán')],
  }),
  tsql({
    t: 'Keep a denormalised counter right for any number of rows', k: 'HARD', p: 18,
    kn: ['AFTER INSERT, UPDATE, DELETE', 'set-based trigger', 'denormalised total'], tag: ['tsql', 'trigger', 'fuhcompany'],
    en: '<p>The setup adds <code>tblDepartment.empCount</code> (filled with the current headcounts). Create <code>trKeepEmpCount</code> on tblEmployee (AFTER INSERT, UPDATE, DELETE) that keeps empCount equal to the real number of employees of each department — for multi-row inserts, deletes, and employees moving between departments.</p>',
    vi: '<p>setup thêm cột <code>tblDepartment.empCount</code> (đã điền số nhân viên hiện tại). Tạo <code>trKeepEmpCount</code> trên tblEmployee (AFTER INSERT, UPDATE, DELETE) giữ empCount luôn bằng số nhân viên thật của mỗi phòng — với INSERT/DELETE nhiều dòng và nhân viên chuyển phòng.</p>',
    yc: [['Add the rows of inserted, subtract the rows of deleted, per department — in ONE set-based UPDATE.', 'Cộng các dòng của inserted, trừ các dòng của deleted, theo từng phòng — trong MỘT câu UPDATE theo tập.'], ['An UPDATE that moves an employee is a delete from the old department plus an insert into the new one.', 'UPDATE chuyển phòng là xoá khỏi phòng cũ cộng chèn vào phòng mới.']],
    setup: DEM_SETUP,
    khoi: `-- CREATE OR ALTER TRIGGER trKeepEmpCount ON tblEmployee AFTER INSERT, UPDATE, DELETE AS
-- BEGIN ... END
`,
    giai: DEM,
    kiem: [
      ck(['Insert three employees into two departments', 'Chèn ba nhân viên vào hai phòng'], giongNhau('SELECT depNum, empCount FROM tblDepartment', 'SELECT d.depNum, COUNT(e.empSSN) AS empCount FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum', "INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050200, N'A', 4), (30121050201, N'B', 4), (30121050202, N'C', 5);")),
      ck(['Move three employees from department 2 to department 4', 'Chuyển ba nhân viên từ phòng 2 sang phòng 4'], giongNhau('SELECT depNum, empCount FROM tblDepartment', 'SELECT d.depNum, COUNT(e.empSSN) AS empCount FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum', 'UPDATE tblEmployee SET depNum = 4 WHERE empSSN IN (30121050005, 30121050011, 30121050012);')),
      ck(['Delete employees without references', 'Xoá các nhân viên không bị tham chiếu'], giongNhau('SELECT depNum, empCount FROM tblDepartment', 'SELECT d.depNum, COUNT(e.empSSN) AS empCount FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum', "INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050203, N'D', 3), (30121050204, N'E', 3); DELETE FROM tblEmployee WHERE empSSN IN (30121050203, 30121050204, 30121050038);")),
      ck(['Salary-only updates do not change the counts', 'Chỉ đổi lương thì không đổi số đếm'], giongNhau('SELECT depNum, empCount FROM tblDepartment', 'SELECT d.depNum, COUNT(e.empSSN) AS empCount FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum', 'UPDATE tblEmployee SET empSalary = empSalary + 1000;')),
    ],
    saiTay: [
      `CREATE OR ALTER TRIGGER trKeepEmpCount ON tblEmployee AFTER INSERT, UPDATE, DELETE AS
BEGIN
    DECLARE @newDep INT = (SELECT TOP (1) depNum FROM inserted), @oldDep INT = (SELECT TOP (1) depNum FROM deleted);
    UPDATE tblDepartment SET empCount = empCount + 1 WHERE depNum = @newDep;
    UPDATE tblDepartment SET empCount = empCount - 1 WHERE depNum = @oldDep;
END`,
      `CREATE OR ALTER TRIGGER trKeepEmpCount ON tblEmployee AFTER INSERT, DELETE AS
BEGIN
    UPDATE d SET empCount = d.empCount + COALESCE((SELECT COUNT(*) FROM inserted i WHERE i.depNum = d.depNum), 0) - COALESCE((SELECT COUNT(*) FROM deleted x WHERE x.depNum = d.depNum), 0)
    FROM tblDepartment d;
END`,
    ],
    gy: [['Count per department in inserted and in deleted with correlated subqueries (or GROUP BY joins).', 'Đếm theo phòng trong inserted và deleted bằng truy vấn con tương quan (hoặc nối GROUP BY).'], ['Restrict the UPDATE to the departments that appear in inserted or deleted.', 'Chỉ UPDATE các phòng có mặt trong inserted hoặc deleted.']],
    lhg: [['+1 / −1 with a single TOP (1) row — a three-row insert counts as one.', '+1 / −1 với một dòng TOP (1) — chèn ba dòng chỉ đếm là một.'], ['Forgetting UPDATE in the trigger events — moving an employee leaves both counts wrong.', 'Quên UPDATE trong các sự kiện của trigger — chuyển phòng làm sai cả hai số đếm.']],
    gt: ['<p>A stored total is a deliberate denormalisation: fast to read, but every write path must keep it right. The trigger is the only place no write path can skip — and it must be set-based.</p>', '<p>Tổng được lưu sẵn là phi chuẩn hoá có chủ ý: đọc nhanh, nhưng mọi đường ghi phải giữ nó đúng. Trigger là chỗ duy nhất không đường ghi nào bỏ qua được — và nó phải theo tập.</p>'],
    tn: [tn('denormalisation', 'phi chuẩn hoá')],
  }),
  tsql({
    t: 'INSTEAD OF DELETE: soft-delete projects', k: 'MEDIUM', p: 12,
    kn: ['INSTEAD OF trigger', 'soft delete'], tag: ['tsql', 'trigger', 'fuhcompany'],
    en: '<p>Projects must never disappear (their work history in tblWorksOn would be lost). The setup adds <code>tblProject.isActive BIT DEFAULT 1</code>. Create <code>trSoftDeleteProject</code> — <b>INSTEAD OF DELETE</b> on tblProject — that sets isActive = 0 for the projects being deleted instead of deleting them.</p>',
    vi: '<p>Dự án không bao giờ được biến mất (lịch sử làm việc trong tblWorksOn sẽ mất). setup thêm <code>tblProject.isActive BIT DEFAULT 1</code>. Tạo <code>trSoftDeleteProject</code> — <b>INSTEAD OF DELETE</b> trên tblProject — đặt isActive = 0 cho các dự án đang bị xoá thay vì xoá chúng.</p>',
    yc: [['INSTEAD OF DELETE: the original DELETE does not run; your trigger body runs instead.', 'INSTEAD OF DELETE: câu DELETE gốc không chạy; thân trigger của bạn chạy thay.'], ['Mark every row of deleted (multi-row DELETE).', 'Đánh dấu mọi dòng của deleted (DELETE nhiều dòng).']],
    setup: MEM_SETUP,
    khoi: `-- CREATE OR ALTER TRIGGER trSoftDeleteProject ON tblProject INSTEAD OF DELETE AS
-- BEGIN ... END
`,
    giai: MEM,
    kiem: [
      ck(['DELETE of ProjectA keeps the row with isActive = 0', 'DELETE ProjectA giữ dòng với isActive = 0'], `BEGIN TRAN; DELETE FROM tblProject WHERE proNum = 1;
SET @ok = IIF(EXISTS (SELECT 1 FROM tblProject WHERE proNum = 1 AND isActive = 0) AND (SELECT COUNT(*) FROM tblWorksOn WHERE proNum = 1) = 3, 1, 0);
SET @info = N'the row must stay, marked inactive, and its work history must stay'; ROLLBACK;`),
      ck(['A DELETE of every department-2 project marks both', 'DELETE mọi dự án phòng 2 đánh dấu cả hai'], `BEGIN TRAN; DELETE FROM tblProject WHERE depNum = 2;
SET @ok = IIF((SELECT COUNT(*) FROM tblProject WHERE depNum = 2 AND isActive = 0) = 2 AND (SELECT COUNT(*) FROM tblProject WHERE isActive = 1) = 4, 1, 0);
SET @info = CONCAT(N'inactive in dept 2: ', (SELECT COUNT(*) FROM tblProject WHERE depNum = 2 AND isActive = 0)); ROLLBACK;`),
      ck(['The trigger is INSTEAD OF DELETE', 'Trigger là INSTEAD OF DELETE'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.triggers t JOIN sys.trigger_events e ON e.object_id = t.object_id WHERE t.name = N'trSoftDeleteProject' AND t.is_instead_of_trigger = 1 AND e.type_desc = N'DELETE'), 1, 0); SET @info = N'expected INSTEAD OF DELETE';`),
    ],
    saiTay: [MEM.replace('INSTEAD OF DELETE', 'AFTER DELETE'), MEM.replace('WHERE p.proNum IN (SELECT proNum FROM deleted);', 'WHERE p.proNum = (SELECT MIN(proNum) FROM deleted);')],
    gy: [['INSTEAD OF replaces the statement: if your body does not delete, nothing is deleted.', 'INSTEAD OF thay thế câu lệnh: thân trigger không xoá thì không gì bị xoá.'], ['deleted lists the rows the user TRIED to delete.', 'deleted liệt kê các dòng người dùng ĐÃ ĐỊNH xoá.']],
    lhg: [['AFTER DELETE — the row is already gone (or the FK from tblWorksOn blocks the delete before the trigger runs).', 'AFTER DELETE — dòng đã mất (hoặc khoá ngoại từ tblWorksOn chặn việc xoá trước khi trigger chạy).'], ['Marking only one row of deleted.', 'Chỉ đánh dấu một dòng của deleted.']],
    gt: ['<p>Soft delete keeps history and foreign keys valid; queries then add WHERE isActive = 1 (often through a view). INSTEAD OF triggers are also how a multi-table view becomes updatable.</p>', '<p>Xoá mềm giữ lịch sử và khoá ngoại hợp lệ; truy vấn thêm WHERE isActive = 1 (thường qua một view). Trigger INSTEAD OF cũng là cách để view nhiều bảng cập nhật được.</p>'],
    tn: [tn('soft delete', 'xoá mềm'), tn('INSTEAD OF trigger', 'trigger thay thế')],
  }),
  de({
    t: 'Replace the cursor with one UPDATE', k: 'MEDIUM', p: 10,
    kn: ['set-based UPDATE', 'correlated subquery in SET', 'CASE'], tag: ['update', 'set-based', 'fuhcompany'],
    en: '<p>The cursor of practice 7.5 raises salaries one employee at a time: for each employee of departments 1 and 2, +10% if their total working hours are ≥ 30, otherwise +5%, rounded to whole VND. Do the same job with <b>one UPDATE statement</b>.</p>',
    vi: '<p>Cursor của bài 7.5 tăng lương từng người một: với mỗi nhân viên phòng 1 và 2, +10% nếu tổng giờ làm ≥ 30, ngược lại +5%, làm tròn tới đồng. Làm cùng việc đó bằng <b>một câu UPDATE</b>.</p>',
    yc: [['One UPDATE with a CASE and a correlated subquery for the hours (an employee on no project has 0 hours).', 'Một câu UPDATE có CASE và truy vấn con tương quan cho số giờ (người không làm dự án có 0 giờ).'], ['ROUND(…, 0). No cursor, no loop.', 'ROUND(…, 0). Không cursor, không vòng lặp.']],
    giai: `UPDATE tblEmployee
SET empSalary = ROUND(empSalary * CASE WHEN COALESCE((SELECT SUM(w.workHours) FROM tblWorksOn w
                                                    WHERE w.empSSN = tblEmployee.empSSN), 0) >= 30
                                       THEN 1.10 ELSE 1.05 END, 0)
WHERE depNum IN (1, 2);`,
    kiem: [
      sau(['New salaries of departments 1 and 2', 'Lương mới của phòng 1 và 2'], 'SELECT empSSN, empSalary FROM tblEmployee WHERE depNum IN (1, 2)'),
      sau(['Other departments unchanged', 'Các phòng khác không đổi'], 'SELECT SUM(empSalary) AS other FROM tblEmployee WHERE depNum NOT IN (1, 2)'),
      sau(['Hidden: someone of department 1 with no project gets +5%', 'Ẩn: người phòng 1 không làm dự án được +5%'], 'SELECT empSSN, empSalary FROM tblEmployee WHERE depNum IN (1, 2)', { an: true, themCsdl: "INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050210, N'Mới', 40000, 1)" }),
      ma(['No cursor', 'Không dùng cursor'], '\\bCURSOR\\b', true),
    ],
    sai: [`UPDATE tblEmployee SET empSalary = ROUND(empSalary * CASE WHEN (SELECT SUM(w.workHours) FROM tblWorksOn w WHERE w.empSSN = tblEmployee.empSSN) >= 30 THEN 1.10 ELSE 1.05 END, 0)`, `UPDATE tblEmployee SET empSalary = ROUND(empSalary * CASE WHEN (SELECT MAX(w.workHours) FROM tblWorksOn w WHERE w.empSSN = tblEmployee.empSSN) >= 30 THEN 1.10 ELSE 1.05 END, 0) WHERE depNum IN (1, 2)`],
    gy: [['The SET expression may contain a subquery that refers to the row being updated (tblEmployee.empSSN).', 'Biểu thức SET có thể chứa truy vấn con tham chiếu dòng đang được cập nhật (tblEmployee.empSSN).'], ['SUM over no rows is NULL — COALESCE it to 0 (NULL &gt;= 30 is not TRUE, so it would fall to ELSE anyway, but say it).', 'SUM trên không dòng là NULL — COALESCE về 0 (NULL &gt;= 30 không TRUE nên vẫn rơi vào ELSE, nhưng hãy viết rõ).']],
    lhg: [['Forgetting WHERE depNum IN (1, 2) — the whole company gets a raise.', 'Quên WHERE depNum IN (1, 2) — cả công ty được tăng lương.'], ['MAX(workHours) instead of SUM — Võ Việt Anh has 30 on one project but 52.5 in total; others differ.', 'MAX(workHours) thay vì SUM — so một dự án thay vì tổng giờ.']],
    gt: ['<p>One statement instead of 2n: the set-based UPDATE is atomic, uses one plan and takes milliseconds where the cursor issues a statement per row. Reach for a cursor only when each row needs a genuinely different action.</p>', '<p>Một câu thay vì 2n câu: UPDATE theo tập là nguyên tử, dùng một kế hoạch và mất vài mili giây trong khi cursor phát một câu lệnh mỗi dòng. Chỉ dùng cursor khi mỗi dòng cần một hành động thật sự khác nhau.</p>'],
    tn: [tn('set-based', 'xử lý theo tập')],
  }),
]);
