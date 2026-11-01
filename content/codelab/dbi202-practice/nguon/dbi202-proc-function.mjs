/**
 * DBI202 · 7.3 Stored procedure & function — procedure đầy đủ (tham số, kiểm tra, giao dịch, TRY/CATCH, mã trả về) trên CSDL
 * đăng ký học của bài; hàm vô hướng và hàm trả bảng; bảng quyết định procedure/function.
 */
import { mod, cs, q, bang1, tsql, ck, giongNhau, tn } from './_chung.mjs';

const DK = `CREATE TABLE Student (sid INT NOT NULL PRIMARY KEY, fullName NVARCHAR(50) NOT NULL);
CREATE TABLE Course (cid CHAR(6) NOT NULL PRIMARY KEY, title NVARCHAR(60) NOT NULL, seats INT NOT NULL CHECK (seats >= 0));
CREATE TABLE Enrolment (sid INT NOT NULL REFERENCES Student (sid), cid CHAR(6) NOT NULL REFERENCES Course (cid),
                        grade DECIMAL(4,2) NULL, PRIMARY KEY (sid, cid));
INSERT INTO Student VALUES (1, N'An'), (2, N'Bình'), (3, N'Chi');
INSERT INTO Course VALUES ('DBI202', N'Database Systems', 2), ('CSD201', N'Data Structures', 0), ('PRF192', N'Programming', 30);
INSERT INTO Enrolment VALUES (2, 'DBI202', 8.5), (3, 'PRF192', 6.0), (2, 'PRF192', 9.0);`;

const ENROL = `CREATE OR ALTER PROCEDURE sp_EnrolStudent
    @sid    INT,
    @cid    CHAR(6),
    @result NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Student WHERE sid = @sid)
        BEGIN SET @result = N'Student not found'; RETURN 1; END
        IF NOT EXISTS (SELECT 1 FROM Course WHERE cid = @cid)
        BEGIN SET @result = N'Course not found'; RETURN 2; END
        BEGIN TRANSACTION;
            INSERT INTO Enrolment (sid, cid) VALUES (@sid, @cid);
            UPDATE Course SET seats = seats - 1 WHERE cid = @cid;     -- seats >= 0 CHECK fails when full
        COMMIT TRANSACTION;
        SET @result = N'OK';
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;                     -- undo BOTH statements
        SET @result = ERROR_MESSAGE();
        RETURN -1;
    END CATCH
END`;
const FNS = `CREATE OR ALTER FUNCTION dbo.fn_GPA (@sid INT)
RETURNS DECIMAL(4,2)
AS
BEGIN
    RETURN (SELECT AVG(grade) FROM Enrolment WHERE sid = @sid);   -- NULL when no graded course
END
GO
CREATE OR ALTER FUNCTION dbo.fn_StudentsOf (@cid CHAR(6))
RETURNS TABLE
AS
RETURN (SELECT s.sid, s.fullName, e.grade
        FROM Student s JOIN Enrolment e ON e.sid = s.sid
        WHERE e.cid = @cid);`;

const GOI = (sid, cid) => `DECLARE @m NVARCHAR(200), @rc INT; EXEC @rc = dbo.sp_EnrolStudent ${sid}, '${cid}', @m OUTPUT;`;

export default mod('dbi202-proc-function', '7.3 Stored procedures & functions', [
  tsql({
    t: 'A complete procedure: validate, transact, catch, return a code', k: 'HARD', p: 20,
    kn: ['parameter validation', 'BEGIN TRANSACTION … COMMIT', 'TRY … CATCH + ROLLBACK', 'RETURN code'], tag: ['tsql', 'procedure', 'transaction'],
    en: '<p>The lesson\'s <code>sp_EnrolStudent @sid INT, @cid CHAR(6), @result NVARCHAR(200) OUTPUT</code>: enrolling inserts a row into Enrolment <b>and</b> decreases <code>Course.seats</code> by 1 — both or neither. Return <b>1</b> + "Student not found", <b>2</b> + "Course not found", <b>0</b> + "OK" on success, and <b>-1</b> + the error message when something fails (already enrolled, no seat left: the CHECK seats ≥ 0).</p>',
    vi: '<p><code>sp_EnrolStudent @sid INT, @cid CHAR(6), @result NVARCHAR(200) OUTPUT</code> của bài: đăng ký là chèn một dòng Enrolment <b>và</b> giảm <code>Course.seats</code> đi 1 — cả hai hoặc không gì. Trả <b>1</b> + "Student not found", <b>2</b> + "Course not found", <b>0</b> + "OK" khi thành công, và <b>-1</b> + thông báo lỗi khi có gì hỏng (đã đăng ký rồi, hết chỗ: CHECK seats ≥ 0).</p>',
    yc: [['Validate first (RETURN early), then BEGIN TRANSACTION … COMMIT inside TRY.', 'Kiểm trước (RETURN sớm), rồi BEGIN TRANSACTION … COMMIT trong TRY.'], ['In CATCH: IF @@TRANCOUNT &gt; 0 ROLLBACK, @result = ERROR_MESSAGE(), RETURN -1.', 'Trong CATCH: IF @@TRANCOUNT &gt; 0 ROLLBACK, @result = ERROR_MESSAGE(), RETURN -1.']],
    setup: DK,
    khoi: `-- CREATE OR ALTER PROCEDURE sp_EnrolStudent @sid INT, @cid CHAR(6), @result NVARCHAR(200) OUTPUT AS
-- BEGIN ... END
`,
    giai: ENROL,
    kiem: [
      ck(['Success: row inserted, one seat taken, code 0', 'Thành công: thêm dòng, trừ một chỗ, mã 0'], `BEGIN TRAN; ${GOI(1, 'DBI202')}
SET @ok = IIF(@rc = 0 AND @m = N'OK' AND EXISTS (SELECT 1 FROM Enrolment WHERE sid = 1 AND cid = 'DBI202') AND (SELECT seats FROM Course WHERE cid = 'DBI202') = 1, 1, 0);
SET @info = CONCAT(N'rc=', @rc, N' msg=', @m); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['Unknown student → 1, unknown course → 2, nothing changes', 'Sinh viên lạ → 1, môn lạ → 2, không đổi gì'], `DECLARE @m1 NVARCHAR(200), @r1 INT, @m2 NVARCHAR(200), @r2 INT;
EXEC @r1 = dbo.sp_EnrolStudent 99, 'DBI202', @m1 OUTPUT; EXEC @r2 = dbo.sp_EnrolStudent 1, 'XXX999', @m2 OUTPUT;
SET @ok = IIF(@r1 = 1 AND @m1 = N'Student not found' AND @r2 = 2 AND @m2 = N'Course not found' AND (SELECT COUNT(*) FROM Enrolment) = 3, 1, 0);
SET @info = CONCAT(N'got ', @r1, N'/', @m1, N' and ', @r2, N'/', @m2);`),
      ck(['Full course (0 seats): code -1 and NO enrolment row left behind', 'Môn hết chỗ (0 chỗ): mã -1 và KHÔNG còn dòng đăng ký nào sót lại'], `${GOI(1, 'CSD201')}   -- no outer transaction: the procedure's ROLLBACK would end it (error 266)
SET @ok = IIF(@rc = -1 AND NOT EXISTS (SELECT 1 FROM Enrolment WHERE sid = 1 AND cid = 'CSD201') AND (SELECT seats FROM Course WHERE cid = 'CSD201') = 0, 1, 0);
SET @info = CONCAT(N'rc=', @rc, N', enrolment rows for (1, CSD201): ', (SELECT COUNT(*) FROM Enrolment WHERE sid = 1 AND cid = 'CSD201'));
DELETE FROM Enrolment WHERE sid = 1 AND cid = 'CSD201'; UPDATE Course SET seats = 0 WHERE cid = 'CSD201';   -- clean up for the next checks`),
      ck(['Already enrolled: code -1, seats unchanged', 'Đã đăng ký rồi: mã -1, số chỗ không đổi'], `${GOI(2, 'DBI202')}
SET @ok = IIF(@rc = -1 AND (SELECT seats FROM Course WHERE cid = 'DBI202') = 2, 1, 0); SET @info = CONCAT(N'rc=', @rc, N', seats=', (SELECT seats FROM Course WHERE cid = 'DBI202'));
UPDATE Course SET seats = 2 WHERE cid = 'DBI202';   -- clean up`),
      ck(['No transaction is left open after a failure', 'Không để giao dịch nào mở sau khi lỗi'], `DECLARE @m NVARCHAR(200), @rc INT; EXEC @rc = dbo.sp_EnrolStudent 1, 'CSD201', @m OUTPUT;
SET @ok = IIF(@@TRANCOUNT = 0, 1, 0); SET @info = CONCAT(N'@@TRANCOUNT after the call = ', @@TRANCOUNT);`),
    ],
    saiTay: [
      ENROL.replace('        BEGIN TRANSACTION;\n', '').replace('        COMMIT TRANSACTION;\n', '').replace('        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;                     -- undo BOTH statements\n', ''),
      ENROL.replace("        IF NOT EXISTS (SELECT 1 FROM Course WHERE cid = @cid)\n        BEGIN SET @result = N'Course not found'; RETURN 2; END\n", ''),
    ],
    gy: [['Validation errors are business answers (codes 1, 2) — no transaction needed yet.', 'Lỗi kiểm tra là câu trả lời nghiệp vụ (mã 1, 2) — chưa cần giao dịch.'], ['The two writes go inside BEGIN TRANSACTION … COMMIT; any error jumps to CATCH, which rolls back.', 'Hai lệnh ghi nằm trong BEGIN TRANSACTION … COMMIT; lỗi nào cũng nhảy sang CATCH, nơi huỷ giao dịch.']],
    lhg: [['No transaction: the INSERT succeeds, the UPDATE fails on the CHECK, and an enrolment exists without a seat.', 'Không giao dịch: INSERT thành công, UPDATE lỗi CHECK, và có dòng đăng ký mà không trừ chỗ.'], ['Not checking the course: an unknown course hits the foreign key and returns -1 instead of 2.', 'Không kiểm môn: môn lạ chạm khoá ngoại và trả -1 thay vì 2.']],
    gt: ['<p>Return codes for expected outcomes, CATCH for unexpected errors, and a transaction around every group of writes that must succeed together (lesson 8.3).</p>', '<p>Mã trả về cho kết quả đã lường trước, CATCH cho lỗi bất ngờ, và một giao dịch bao mọi nhóm lệnh ghi phải thành công cùng nhau (bài 8.3).</p>'],
    tn: [tn('transaction', 'giao dịch'), tn('return code', 'mã trả về')],
  }),
  tsql({
    t: 'A scalar function and an inline table-valued function', k: 'MEDIUM', p: 15,
    kn: ['scalar function', 'inline TVF', 'NULL result'], tag: ['tsql', 'function'],
    en: '<p>On the same database write (1) <code>dbo.fn_GPA(@sid INT) RETURNS DECIMAL(4,2)</code> — the average grade of the student (NULL when no grade), and (2) <code>dbo.fn_StudentsOf(@cid CHAR(6)) RETURNS TABLE</code> — <code>sid, fullName, grade</code> of the students enrolled in the course.</p>',
    vi: '<p>Trên cùng CSDL viết (1) <code>dbo.fn_GPA(@sid INT) RETURNS DECIMAL(4,2)</code> — điểm trung bình của sinh viên (NULL khi chưa có điểm), và (2) <code>dbo.fn_StudentsOf(@cid CHAR(6)) RETURNS TABLE</code> — <code>sid, fullName, grade</code> của các sinh viên đăng ký môn.</p>',
    yc: [['Separate the two CREATE FUNCTION statements with GO.', 'Tách hai câu CREATE FUNCTION bằng GO.'], ['The TVF is one RETURN (SELECT …).', 'TVF là một RETURN (SELECT …).']],
    setup: DK,
    khoi: `-- CREATE OR ALTER FUNCTION dbo.fn_GPA (@sid INT) RETURNS DECIMAL(4,2) AS BEGIN ... END
-- GO
-- CREATE OR ALTER FUNCTION dbo.fn_StudentsOf (@cid CHAR(6)) RETURNS TABLE AS RETURN (...);
`,
    giai: FNS,
    kiem: [
      ck(['fn_GPA(2) = 8.75, fn_GPA(3) = 6.00', 'fn_GPA(2) = 8,75, fn_GPA(3) = 6,00'], `SET @ok = IIF(dbo.fn_GPA(2) = 8.75 AND dbo.fn_GPA(3) = 6.00, 1, 0); SET @info = CONCAT(N'got ', dbo.fn_GPA(2), N' and ', dbo.fn_GPA(3));`),
      ck(['fn_GPA of a student with no grade is NULL', 'fn_GPA của sinh viên chưa có điểm là NULL'], `SET @ok = IIF(dbo.fn_GPA(1) IS NULL, 1, 0); SET @info = CONCAT(N'got ', dbo.fn_GPA(1));`),
      ck(['fn_StudentsOf(PRF192) = students 2 and 3 with their grades', 'fn_StudentsOf(PRF192) = sinh viên 2 và 3 kèm điểm'], giongNhau(`SELECT sid, fullName, grade FROM dbo.fn_StudentsOf('PRF192')`, `SELECT s.sid, s.fullName, e.grade FROM Student s JOIN Enrolment e ON e.sid = s.sid WHERE e.cid = 'PRF192'`)),
      ck(['Both stay right after new data (one grade still NULL)', 'Cả hai vẫn đúng sau khi thêm dữ liệu (một điểm còn NULL)'], `BEGIN TRAN; INSERT INTO Enrolment VALUES (1, 'DBI202', 7.0), (1, 'PRF192', NULL);   -- a student not graded yet is still enrolled
SET @ok = IIF(dbo.fn_GPA(1) = 7.00 AND (SELECT COUNT(*) FROM dbo.fn_StudentsOf('PRF192')) = 3, 1, 0); SET @info = CONCAT(N'fn_GPA(1)=', dbo.fn_GPA(1)); ROLLBACK;`),
    ],
    saiTay: [FNS.replace('RETURN (SELECT AVG(grade) FROM Enrolment WHERE sid = @sid);', 'RETURN (SELECT COALESCE(AVG(grade), 0) FROM Enrolment WHERE sid = @sid);'), FNS.replace("WHERE e.cid = @cid);", "WHERE e.cid = @cid AND e.grade >= 5);")],
    gy: [['Scalar: RETURNS type AS BEGIN … RETURN (…) END. Inline TVF: RETURNS TABLE AS RETURN (SELECT …).', 'Vô hướng: RETURNS kiểu AS BEGIN … RETURN (…) END. TVF nội tuyến: RETURNS TABLE AS RETURN (SELECT …).'], ['AVG over no rows is NULL — keep it: "no grade yet" is not 0.', 'AVG trên không dòng là NULL — giữ nguyên: "chưa có điểm" không phải 0.']],
    lhg: [['COALESCE(AVG(grade), 0) — a student with no grade looks like a student who failed everything.', 'COALESCE(AVG(grade), 0) — sinh viên chưa có điểm trông như người trượt hết.'], ['Filtering passed students in fn_StudentsOf — the task asks for everyone enrolled.', 'Lọc sinh viên qua môn trong fn_StudentsOf — đề hỏi mọi người đã đăng ký.']],
    gt: ['<p>WHERE dbo.fn_GPA(sid) &gt; 8 runs the function once per row; joining fn_StudentsOf or a GROUP BY query lets the optimizer work on sets — the "mysteriously slow" warning of the lesson.</p>', '<p>WHERE dbo.fn_GPA(sid) &gt; 8 chạy hàm một lần mỗi dòng; nối với fn_StudentsOf hoặc một truy vấn GROUP BY cho bộ tối ưu làm việc theo tập — lời cảnh báo "chậm bí ẩn" của bài.</p>'],
    tn: [tn('inline table-valued function', 'hàm trả bảng nội tuyến')],
  }),
  cs({
    t: 'The procedure / function decision table', k: 'EASY', p: 6, loai: 'table',
    kn: ['procedure vs function'], tag: ['tsql', 'design'],
    en: '<p>Fill the decision table of lesson 7.3.</p>', vi: '<p>Điền bảng quyết định của bài 7.3.</p>',
    bang: [bang1('b1', ['Procedure vs function', 'Procedure và function'],
      [{ ma: 'tc', ten: 'Property / Tính chất' }, { ma: 'sp', ten: 'Stored procedure', luaChon: ['yes', 'no'] }, { ma: 'fn', ten: 'Function', luaChon: ['yes', 'no'] }],
      [{ o: { tc: 'Can be called inside a SELECT / WHERE' }, a: { sp: 'no', fn: 'yes' } },
        { o: { tc: 'Can INSERT / UPDATE / DELETE table data' }, a: { sp: 'yes', fn: 'no' } },
        { o: { tc: 'Can use BEGIN TRANSACTION / COMMIT' }, a: { sp: 'yes', fn: 'no' } },
        { o: { tc: 'Can use TRY … CATCH' }, a: { sp: 'yes', fn: 'no' } },
        { o: { tc: 'Can have OUTPUT parameters' }, a: { sp: 'yes', fn: 'no' } }],
      ['Functions are side-effect free and return one value or one table; procedures do work: data changes, transactions, error handling, OUTPUT parameters, result sets.', 'Hàm không có tác dụng phụ và trả một giá trị hoặc một bảng; procedure làm việc: đổi dữ liệu, giao dịch, xử lý lỗi, tham số OUTPUT, tập kết quả.'])],
    gy: [['"Inside a query" ⇒ function only.', '"Trong truy vấn" ⇒ chỉ hàm.'], ['"Changes data" ⇒ procedure only.', '"Đổi dữ liệu" ⇒ chỉ procedure.']],
    lhg: [['Believing functions can UPDATE tables.', 'Tin rằng hàm UPDATE được bảng.'], ['Believing procedures can be used in WHERE.', 'Tin rằng procedure dùng được trong WHERE.']],
    tn: [tn('side effect', 'tác dụng phụ')],
  }),
]);
