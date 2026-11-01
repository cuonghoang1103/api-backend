/**
 * DBI202 · 7.A Slide trường Chương 8 (1–19) — T-SQL cơ bản: biến, IF, CASE, WHILE, lỗi (TRY/CATCH, THROW).
 * Ba đề chạy trên SQL Server của người học (T-SQL lập trình không chạy được trong trình duyệt) + một bộ câu hỏi.
 */
import { mod, cs, q, tsql, ck, tuChoi, FUH, tn } from './_chung.mjs';

const GRADE = `CREATE OR ALTER PROCEDURE prSalaryGrade
    @empSSN DECIMAL(18,0),
    @grade  NVARCHAR(10) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @salary DECIMAL(10,0);                                -- a local variable
    SELECT @salary = empSalary FROM tblEmployee WHERE empSSN = @empSSN;   -- assignment by SELECT
    IF @salary IS NULL
        SET @grade = N'UNKNOWN';                                  -- no such employee (or no salary)
    ELSE IF @salary >= 100000
        SET @grade = N'HIGH';
    ELSE IF @salary >= 60000
        SET @grade = N'MEDIUM';
    ELSE
        SET @grade = N'LOW';
END`;

const RAISE = `CREATE OR ALTER PROCEDURE prRaiseUntil
    @depNum INT,
    @target DECIMAL(10,0),
    @rounds INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET @rounds = 0;
    IF NOT EXISTS (SELECT 1 FROM tblEmployee WHERE depNum = @depNum) RETURN;   -- empty department: no loop
    WHILE (SELECT AVG(empSalary) FROM tblEmployee WHERE depNum = @depNum) < @target
    BEGIN
        UPDATE tblEmployee SET empSalary = ROUND(empSalary * 1.05, 0) WHERE depNum = @depNum;
        SET @rounds += 1;
    END
END`;

const SAFE = `CREATE OR ALTER PROCEDURE prSafeDeleteEmployee
    @empSSN DECIMAL(18,0),
    @msg    NVARCHAR(400) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM tblEmployee WHERE empSSN = @empSSN;
        IF @@ROWCOUNT = 0
            SET @msg = N'NOT FOUND';
        ELSE
            SET @msg = N'DELETED';
    END TRY
    BEGIN CATCH
        SET @msg = CONCAT(N'ERROR ', ERROR_NUMBER());              -- 547 = a foreign key still references the row
    END CATCH
END`;

export default mod('dbi202-slide-dbi9-1', '7.A T-SQL basics: variables, IF, CASE, WHILE, errors (slides 1–19)', [
  tsql({
    t: 'Variables and IF … ELSE IF: a salary grade', k: 'EASY', p: 12,
    kn: ['DECLARE', 'SELECT @var =', 'IF … ELSE', 'OUTPUT parameter'], tag: ['tsql', 'procedure', 'fuhcompany', 'slide'],
    en: '<p>Write <code>prSalaryGrade @empSSN DECIMAL(18,0), @grade NVARCHAR(10) OUTPUT</code>: read the employee\'s salary into a variable, then set the grade — <b>HIGH</b> (≥ 100,000), <b>MEDIUM</b> (≥ 60,000), <b>LOW</b> (below), or <b>UNKNOWN</b> when the employee does not exist.</p>',
    vi: '<p>Viết <code>prSalaryGrade @empSSN DECIMAL(18,0), @grade NVARCHAR(10) OUTPUT</code>: đọc lương nhân viên vào một biến, rồi gán bậc — <b>HIGH</b> (≥ 100.000), <b>MEDIUM</b> (≥ 60.000), <b>LOW</b> (thấp hơn), hoặc <b>UNKNOWN</b> khi không có nhân viên đó.</p>',
    yc: [['Use a local variable and IF … ELSE IF … ELSE.', 'Dùng biến cục bộ và IF … ELSE IF … ELSE.'], ['CREATE OR ALTER PROCEDURE so you can run it again.', 'CREATE OR ALTER PROCEDURE để chạy lại được.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE prSalaryGrade
--     @empSSN DECIMAL(18,0),
--     @grade  NVARCHAR(10) OUTPUT
-- AS
-- BEGIN
--     ...
-- END
`,
    giai: GRADE,
    kiem: [
      ck(['Director (150,000) → HIGH', 'Giám đốc (150.000) → HIGH'], `DECLARE @g NVARCHAR(10); EXEC dbo.prSalaryGrade 30121050001, @g OUTPUT; SET @ok = IIF(@g = N'HIGH', 1, 0); SET @info = CONCAT(N'got ', COALESCE(@g, N'NULL'));`),
      ck(['72,000 → MEDIUM and exactly 60,000 → MEDIUM', '72.000 → MEDIUM và đúng 60.000 → MEDIUM'], `DECLARE @g1 NVARCHAR(10), @g2 NVARCHAR(10); EXEC dbo.prSalaryGrade 30121050011, @g1 OUTPUT; EXEC dbo.prSalaryGrade 30121050003, @g2 OUTPUT; SET @ok = IIF(@g1 = N'MEDIUM' AND @g2 = N'MEDIUM', 1, 0); SET @info = CONCAT(N'got ', COALESCE(@g1, N'NULL'), N' and ', COALESCE(@g2, N'NULL'));`),
      ck(['38,000 → LOW', '38.000 → LOW'], `DECLARE @g NVARCHAR(10); EXEC dbo.prSalaryGrade 30121050038, @g OUTPUT; SET @ok = IIF(@g = N'LOW', 1, 0); SET @info = CONCAT(N'got ', COALESCE(@g, N'NULL'));`),
      ck(['Unknown SSN → UNKNOWN', 'SSN không tồn tại → UNKNOWN'], `DECLARE @g NVARCHAR(10); EXEC dbo.prSalaryGrade 99999999999, @g OUTPUT; SET @ok = IIF(@g = N'UNKNOWN', 1, 0); SET @info = CONCAT(N'got ', COALESCE(@g, N'NULL'));`),
    ],
    saiTay: [GRADE.replace('>= 60000', '> 60000'), GRADE.replace("    IF @salary IS NULL\n        SET @grade = N'UNKNOWN';                                  -- no such employee (or no salary)\n    ELSE IF", '    IF')],
    gy: [['DECLARE @salary DECIMAL(10,0); SELECT @salary = empSalary FROM tblEmployee WHERE empSSN = @empSSN;', 'DECLARE @salary DECIMAL(10,0); SELECT @salary = empSalary FROM tblEmployee WHERE empSSN = @empSSN;'], ['If no row matches, the variable keeps its old value — here NULL, which is how you detect "not found".', 'Không có dòng khớp thì biến giữ giá trị cũ — ở đây NULL, đó là cách phát hiện "không tìm thấy".']],
    lhg: [['&gt; 60000 instead of &gt;= 60000 — Võ Việt Anh (exactly 60,000) becomes LOW.', '&gt; 60000 thay vì &gt;= 60000 — Võ Việt Anh (đúng 60.000) thành LOW.'], ['Forgetting the not-found case — @grade becomes LOW because NULL &gt;= … is not TRUE.', 'Quên trường hợp không tìm thấy — @grade thành LOW vì NULL &gt;= … không TRUE.']],
    gt: ['<p>IF … ELSE IF tests in order and stops at the first TRUE branch; test the most specific case (NULL) first. A CASE expression in one SET would do the same: SET @grade = CASE WHEN … END.</p>', '<p>IF … ELSE IF thử theo thứ tự và dừng ở nhánh TRUE đầu tiên; thử trường hợp đặc biệt (NULL) trước. Biểu thức CASE trong một câu SET cũng làm được: SET @grade = CASE WHEN … END.</p>'],
    tn: [tn('local variable', 'biến cục bộ'), tn('OUTPUT parameter', 'tham số ra')],
  }),
  tsql({
    t: 'WHILE: raise salaries until the average reaches a target', k: 'MEDIUM', p: 15,
    kn: ['WHILE', 'loop condition with a subquery', 'counter variable'], tag: ['tsql', 'procedure', 'loop', 'fuhcompany', 'slide'],
    en: '<p>Write <code>prRaiseUntil @depNum INT, @target DECIMAL(10,0), @rounds INT OUTPUT</code>: <b>while</b> the average salary of the department is below the target, raise every salary of the department by 5% (rounded to whole VND); return how many rounds were needed. A department without employees needs 0 rounds (and must not loop forever).</p>',
    vi: '<p>Viết <code>prRaiseUntil @depNum INT, @target DECIMAL(10,0), @rounds INT OUTPUT</code>: <b>khi</b> lương trung bình của phòng còn dưới mục tiêu, tăng 5% mọi lương trong phòng (làm tròn tới đồng); trả về số vòng đã cần. Phòng không có nhân viên cần 0 vòng (và không được lặp vô hạn).</p>',
    yc: [['WHILE (SELECT AVG(…) …) &lt; @target BEGIN … END.', 'WHILE (SELECT AVG(…) …) &lt; @target BEGIN … END.'], ['ROUND(empSalary * 1.05, 0) each round.', 'Mỗi vòng ROUND(empSalary * 1.05, 0).']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE prRaiseUntil @depNum INT, @target DECIMAL(10,0), @rounds INT OUTPUT AS
-- BEGIN ... WHILE ... END
`,
    giai: RAISE,
    kiem: [
      ck(['Department 3 (average 60,000) to 70,000 needs 4 rounds', 'Phòng 3 (trung bình 60.000) lên 70.000 cần 4 vòng'], `DECLARE @r INT; BEGIN TRAN; EXEC dbo.prRaiseUntil 3, 70000, @r OUTPUT;
DECLARE @avg DECIMAL(12,2) = (SELECT AVG(empSalary) FROM tblEmployee WHERE depNum = 3);
SET @ok = IIF(@r = 4 AND @avg >= 70000 AND (SELECT empSalary FROM tblEmployee WHERE empSSN = 30121050021) = 48620, 1, 0);
SET @info = CONCAT(N'rounds = ', COALESCE(CAST(@r AS NVARCHAR(10)), N'NULL'), N', new average = ', @avg); ROLLBACK;`),
      ck(['A target already reached needs 0 rounds and changes nothing', 'Mục tiêu đã đạt cần 0 vòng và không đổi gì'], `DECLARE @r INT; BEGIN TRAN; EXEC dbo.prRaiseUntil 1, 50000, @r OUTPUT;
SET @ok = IIF(@r = 0 AND (SELECT SUM(empSalary) FROM tblEmployee WHERE depNum = 1) = 345000, 1, 0);
SET @info = CONCAT(N'rounds = ', COALESCE(CAST(@r AS NVARCHAR(10)), N'NULL')); ROLLBACK;`),
      ck(['Other departments are untouched', 'Các phòng khác không bị đụng'], `DECLARE @r INT; BEGIN TRAN; EXEC dbo.prRaiseUntil 3, 70000, @r OUTPUT;
SET @ok = IIF((SELECT SUM(empSalary) FROM tblEmployee WHERE depNum <> 3) = 845000, 1, 0);
SET @info = CONCAT(N'sum of other departments = ', (SELECT SUM(empSalary) FROM tblEmployee WHERE depNum <> 3)); ROLLBACK;`),
      ck(['An empty department returns 0 rounds (no infinite loop)', 'Phòng rỗng trả 0 vòng (không lặp vô hạn)'], `DECLARE @r INT; BEGIN TRAN; INSERT INTO tblDepartment (depNum, depName) VALUES (9, N'Empty');
EXEC dbo.prRaiseUntil 9, 70000, @r OUTPUT; SET @ok = IIF(@r = 0, 1, 0); SET @info = CONCAT(N'rounds = ', COALESCE(CAST(@r AS NVARCHAR(10)), N'NULL')); ROLLBACK;`),
    ],
    saiTay: [RAISE.replace('WHERE depNum = @depNum;\n        SET @rounds', ';\n        SET @rounds'), RAISE.replace('ROUND(empSalary * 1.05, 0)', 'empSalary + 5000')],
    gy: [['The loop condition is re-evaluated before each round — put the AVG subquery right in the WHILE.', 'Điều kiện lặp được tính lại trước mỗi vòng — đặt truy vấn con AVG ngay trong WHILE.'], ['AVG over zero rows is NULL and NULL &lt; x is not TRUE, so the loop would not even start — but guard it explicitly anyway.', 'AVG trên không dòng là NULL và NULL &lt; x không TRUE nên vòng lặp không chạy — nhưng vẫn nên chặn tường minh.']],
    lhg: [['Forgetting WHERE depNum = @depNum in the UPDATE — the whole company gets the raise.', 'Quên WHERE depNum = @depNum trong UPDATE — cả công ty được tăng lương.'], ['A fixed +5000 instead of 5% — the number of rounds changes.', 'Cộng cố định 5000 thay vì 5% — số vòng thay đổi.']],
    gt: ['<p>Department 3 (88,000 / 40,000 / 52,000): 60,000 → 63,000 → 66,150 → 69,457 → 72,930 ⇒ 4 rounds. A set-based UPDATE inside a WHILE is the normal way to loop in T-SQL; a cursor is rarely needed.</p>', '<p>Phòng 3 (88.000 / 40.000 / 52.000): 60.000 → 63.000 → 66.150 → 69.457 → 72.930 ⇒ 4 vòng. UPDATE theo tập trong WHILE là cách lặp bình thường của T-SQL; hiếm khi cần cursor.</p>'],
    tn: [tn('WHILE', 'vòng lặp')],
  }),
  tsql({
    t: 'TRY … CATCH and @@ROWCOUNT: a delete that never crashes', k: 'MEDIUM', p: 12,
    kn: ['TRY … CATCH', 'ERROR_NUMBER()', '@@ROWCOUNT'], tag: ['tsql', 'procedure', 'error-handling', 'fuhcompany', 'slide'],
    en: '<p>Write <code>prSafeDeleteEmployee @empSSN DECIMAL(18,0), @msg NVARCHAR(400) OUTPUT</code> that deletes the employee and sets <code>@msg</code> to <b>DELETED</b>, <b>NOT FOUND</b> (no such employee — use <code>@@ROWCOUNT</code>), or <b>ERROR &lt;number&gt;</b> when SQL Server refuses (e.g. <code>ERROR 547</code> — the row is still referenced). The procedure itself must never raise an error.</p>',
    vi: '<p>Viết <code>prSafeDeleteEmployee @empSSN DECIMAL(18,0), @msg NVARCHAR(400) OUTPUT</code> xoá nhân viên và gán <code>@msg</code> là <b>DELETED</b>, <b>NOT FOUND</b> (không có nhân viên — dùng <code>@@ROWCOUNT</code>), hoặc <b>ERROR &lt;mã&gt;</b> khi SQL Server từ chối (vd <code>ERROR 547</code> — dòng còn bị tham chiếu). Bản thân procedure không bao giờ được ném lỗi.</p>',
    yc: [['BEGIN TRY … END TRY BEGIN CATCH … END CATCH.', 'BEGIN TRY … END TRY BEGIN CATCH … END CATCH.'], ["@msg = CONCAT(N'ERROR ', ERROR_NUMBER()) in the CATCH block.", "@msg = CONCAT(N'ERROR ', ERROR_NUMBER()) trong khối CATCH."]],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE prSafeDeleteEmployee @empSSN DECIMAL(18,0), @msg NVARCHAR(400) OUTPUT AS
-- BEGIN
--     BEGIN TRY ... END TRY
--     BEGIN CATCH ... END CATCH
-- END
`,
    giai: SAFE,
    kiem: [
      ck(['An employee with no references → DELETED', 'Nhân viên không bị tham chiếu → DELETED'], `DECLARE @m NVARCHAR(400); BEGIN TRAN; EXEC dbo.prSafeDeleteEmployee 30121050038, @m OUTPUT;
SET @ok = IIF(@m = N'DELETED' AND NOT EXISTS (SELECT 1 FROM tblEmployee WHERE empSSN = 30121050038), 1, 0); SET @info = CONCAT(N'@msg = ', COALESCE(@m, N'NULL')); ROLLBACK;`),
      ck(['An unknown SSN → NOT FOUND', 'SSN không tồn tại → NOT FOUND'], `DECLARE @m NVARCHAR(400); BEGIN TRAN; EXEC dbo.prSafeDeleteEmployee 99999999999, @m OUTPUT;
SET @ok = IIF(@m = N'NOT FOUND', 1, 0); SET @info = CONCAT(N'@msg = ', COALESCE(@m, N'NULL')); ROLLBACK;`),
      ck(['A manager still referenced → ERROR 547, no exception escapes', 'Trưởng phòng còn bị tham chiếu → ERROR 547, không ném lỗi ra ngoài'], `DECLARE @m NVARCHAR(400), @thoat BIT = 0; BEGIN TRAN;
BEGIN TRY EXEC dbo.prSafeDeleteEmployee 30121050001, @m OUTPUT; END TRY BEGIN CATCH SET @thoat = 1; END CATCH;
SET @ok = IIF(@thoat = 0 AND @m = N'ERROR 547' AND EXISTS (SELECT 1 FROM tblEmployee WHERE empSSN = 30121050001), 1, 0);
SET @info = CONCAT(N'@msg = ', COALESCE(@m, N'NULL'), IIF(@thoat = 1, N' — an error escaped the procedure', N''));
IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [SAFE.replace("        IF @@ROWCOUNT = 0\n            SET @msg = N'NOT FOUND';\n        ELSE\n            SET @msg = N'DELETED';", "        SET @msg = N'DELETED';"), `CREATE OR ALTER PROCEDURE prSafeDeleteEmployee @empSSN DECIMAL(18,0), @msg NVARCHAR(400) OUTPUT AS
BEGIN
    DELETE FROM tblEmployee WHERE empSSN = @empSSN;
    SET @msg = IIF(@@ROWCOUNT = 0, N'NOT FOUND', N'DELETED');
END`],
    gy: [['@@ROWCOUNT must be read IMMEDIATELY after the DELETE — any other statement resets it.', '@@ROWCOUNT phải đọc NGAY sau câu DELETE — câu lệnh khác sẽ đặt lại nó.'], ['Inside CATCH, ERROR_NUMBER() and ERROR_MESSAGE() describe the error that was caught.', 'Trong CATCH, ERROR_NUMBER() và ERROR_MESSAGE() mô tả lỗi vừa bắt.']],
    lhg: [['No TRY/CATCH — deleting the director raises Msg 547 to the caller.', 'Không TRY/CATCH — xoá giám đốc ném Msg 547 ra ngoài.'], ['Always answering DELETED — a DELETE of zero rows is not an error.', 'Luôn trả DELETED — DELETE không dòng nào không phải là lỗi.']],
    gt: ['<p>A DELETE that matches nothing succeeds silently (0 rows); only @@ROWCOUNT tells you. Foreign-key violations are error 547 — the most common error number in the PE.</p>', '<p>DELETE không khớp gì vẫn thành công lặng lẽ (0 dòng); chỉ @@ROWCOUNT cho biết. Vi phạm khoá ngoại là lỗi 547 — mã lỗi hay gặp nhất trong PE.</p>'],
    tn: [tn('TRY … CATCH', 'bắt lỗi'), tn('@@ROWCOUNT', 'số dòng câu trước đã đụng')],
  }),
  cs({
    t: 'T-SQL basics in five questions', k: 'EASY', p: 7,
    kn: ['batch', 'SET vs SELECT assignment', 'PRINT', 'GO'], tag: ['tsql', 'slide'],
    en: '<p>Slides 1–19.</p>', vi: '<p>Slide 1–19.</p>',
    cau: [
      q('c1', ['DECLARE @x INT = 5; GO PRINT @x; — what happens?', 'DECLARE @x INT = 5; GO PRINT @x; — chuyện gì xảy ra?'], ['error: @x does not exist in the second batch (GO ends the scope)', 'prints 5, because variables live for the whole session', 'prints NULL, because GO resets every variable to NULL', 'prints nothing, because PRINT is skipped after a GO'], ['GO is a batch separator for the client tools; variables live only inside their batch.', 'GO là dấu tách lô của công cụ; biến chỉ sống trong lô của nó.']),
      q('c2', ['SELECT @name = empName FROM tblEmployee WHERE depNum = 1 (4 rows) leaves @name =', 'SELECT @name = empName FROM tblEmployee WHERE depNum = 1 (4 dòng) để @name ='], ['the value of the last row read — no error', 'an error: more than one row', 'NULL', 'all four names joined'], ['SELECT assignment silently keeps the last row; SET @name = (SELECT …) would raise an error for 2+ rows.', 'Gán bằng SELECT lặng lẽ giữ dòng cuối; SET @name = (SELECT …) sẽ báo lỗi nếu 2+ dòng.']),
      q('c3', ['Which statement shows a message in the Messages tab of SSMS?', 'Câu nào hiện thông báo ở tab Messages của SSMS?'], ["PRINT N'done'", "SELECT N'done'", "RETURN N'done'", "OUTPUT N'done'"], ['PRINT writes to Messages; SELECT returns a result set.', 'PRINT ghi vào Messages; SELECT trả một tập kết quả.']),
      q('c4', ['THROW 50001, N\'Bad input\', 1; inside TRY …', 'THROW 50001, N\'Bad input\', 1; trong TRY …'], ['jumps to the CATCH block', 'is ignored', 'ends the session', 'commits the transaction'], ['Any error of severity ≥ 11 in TRY transfers control to CATCH.', 'Mọi lỗi mức ≥ 11 trong TRY chuyển điều khiển sang CATCH.']),
      q('c5', ['CASE in T-SQL is…', 'CASE trong T-SQL là…'], ['an expression that returns a value (usable in SELECT, SET, ORDER BY)', 'a control-of-flow statement that replaces IF … ELSE', 'a loop that repeats until one WHEN becomes true', 'a kind of cursor that reads one row per WHEN branch'], ['T-SQL has no CASE statement — use IF for control flow, CASE for values.', 'T-SQL không có câu lệnh CASE — dùng IF để rẽ nhánh, CASE để tính giá trị.']),
    ],
    gy: [['GO = new batch = new variable scope.', 'GO = lô mới = phạm vi biến mới.'], ['SET is strict (one value), SELECT assignment is lenient.', 'SET chặt (một giá trị), gán bằng SELECT dễ dãi.']],
    lhg: [['Putting GO inside a procedure body.', 'Đặt GO trong thân procedure.'], ['Expecting SELECT @x = … to fail on several rows.', 'Tưởng SELECT @x = … sẽ lỗi khi có nhiều dòng.']],
    tn: [tn('batch', 'lô lệnh'), tn('THROW', 'ném lỗi')],
  }),
]);
