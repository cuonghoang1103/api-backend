/**
 * DBI202 · 7.B Slide trường Chương 8 (20–34) — ba tầng, stored procedure (tham số vào/ra, RETURN), hàm vô hướng, hàm trả bảng.
 */
import { mod, cs, q, tsql, ck, giongNhau, FUH, tn } from './_chung.mjs';

const PROC = `CREATE OR ALTER PROCEDURE prProjectsOfDepartment
    @depNum      INT,
    @numProjects INT OUTPUT,
    @totalHours  DECIMAL(8,1) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM tblDepartment WHERE depNum = @depNum)
        RETURN -1;                                             -- return code: no such department
    SELECT @numProjects = COUNT(*) FROM tblProject WHERE depNum = @depNum;
    SELECT @totalHours = COALESCE(SUM(w.workHours), 0)
    FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum
    WHERE p.depNum = @depNum;
    RETURN 0;
END`;
const FN_AGE = `CREATE OR ALTER FUNCTION dbo.fnAgeAt (@birth DATE, @onDate DATE)
RETURNS INT
AS
BEGIN
    IF @birth IS NULL RETURN NULL;
    DECLARE @age INT = DATEDIFF(YEAR, @birth, @onDate);
    IF DATEADD(YEAR, @age, @birth) > @onDate SET @age -= 1;    -- birthday not reached yet this year
    RETURN @age;
END`;
const FN_TAB = `CREATE OR ALTER FUNCTION dbo.fnStaffOfProject (@proNum INT)
RETURNS TABLE
AS
RETURN (
    SELECT e.empSSN, e.empName, w.workHours
    FROM tblWorksOn w JOIN tblEmployee e ON e.empSSN = w.empSSN
    WHERE w.proNum = @proNum
);`;

export default mod('dbi202-slide-dbi9-2', '7.B Three tiers, stored procedures & functions (slides 20–34)', [
  tsql({
    t: 'A procedure with two OUTPUT parameters and a return code', k: 'MEDIUM', p: 15,
    kn: ['input/output parameters', 'RETURN code', 'EXEC @rc ='], tag: ['tsql', 'procedure', 'fuhcompany', 'slide'],
    en: '<p>Write <code>prProjectsOfDepartment @depNum INT, @numProjects INT OUTPUT, @totalHours DECIMAL(8,1) OUTPUT</code>: the number of projects the department controls and the total hours worked on them (0 when none). <b>RETURN -1</b> when the department does not exist, <b>RETURN 0</b> otherwise.</p>',
    vi: '<p>Viết <code>prProjectsOfDepartment @depNum INT, @numProjects INT OUTPUT, @totalHours DECIMAL(8,1) OUTPUT</code>: số dự án phòng quản lý và tổng giờ làm trên các dự án đó (0 nếu không có). <b>RETURN -1</b> khi phòng không tồn tại, <b>RETURN 0</b> trong trường hợp còn lại.</p>',
    yc: [['Call it as: DECLARE @n INT, @h DECIMAL(8,1), @rc INT; EXEC @rc = prProjectsOfDepartment 1, @n OUTPUT, @h OUTPUT;', 'Gọi: DECLARE @n INT, @h DECIMAL(8,1), @rc INT; EXEC @rc = prProjectsOfDepartment 1, @n OUTPUT, @h OUTPUT;'], ['COALESCE(SUM(…), 0) so a department with projects but no hours gives 0, not NULL.', 'COALESCE(SUM(…), 0) để phòng có dự án mà chưa có giờ cho 0, không phải NULL.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER PROCEDURE prProjectsOfDepartment
--     @depNum INT, @numProjects INT OUTPUT, @totalHours DECIMAL(8,1) OUTPUT
-- AS
-- BEGIN ... RETURN 0; END
`,
    giai: PROC,
    kiem: [
      ck(['Department 1: 2 projects, 127.5 hours, return 0', 'Phòng 1: 2 dự án, 127,5 giờ, trả 0'], `DECLARE @n INT, @h DECIMAL(8,1), @rc INT; EXEC @rc = dbo.prProjectsOfDepartment 1, @n OUTPUT, @h OUTPUT;
SET @ok = IIF(@rc = 0 AND @n = 2 AND @h = 127.5, 1, 0); SET @info = CONCAT(N'rc=', @rc, N' n=', @n, N' hours=', @h);`),
      ck(['Department 5 (no project): 0 projects, 0 hours', 'Phòng 5 (không dự án): 0 dự án, 0 giờ'], `DECLARE @n INT, @h DECIMAL(8,1), @rc INT; EXEC @rc = dbo.prProjectsOfDepartment 5, @n OUTPUT, @h OUTPUT;
SET @ok = IIF(@rc = 0 AND @n = 0 AND @h = 0, 1, 0); SET @info = CONCAT(N'rc=', @rc, N' n=', COALESCE(CAST(@n AS NVARCHAR(9)), N'NULL'), N' hours=', COALESCE(CAST(@h AS NVARCHAR(12)), N'NULL'));`),
      ck(['Unknown department: return code -1', 'Phòng không tồn tại: mã trả về -1'], `DECLARE @n INT, @h DECIMAL(8,1), @rc INT; EXEC @rc = dbo.prProjectsOfDepartment 42, @n OUTPUT, @h OUTPUT;
SET @ok = IIF(@rc = -1, 1, 0); SET @info = CONCAT(N'rc=', @rc);`),
      ck(['Still right after a new project with workers is added', 'Vẫn đúng sau khi thêm dự án mới có người làm'], `DECLARE @n INT, @h DECIMAL(8,1), @rc INT; BEGIN TRAN;
INSERT INTO tblProject VALUES (7, N'ProjectG', 1, 4); INSERT INTO tblWorksOn VALUES (30121050030, 7, 4.5);
EXEC @rc = dbo.prProjectsOfDepartment 4, @n OUTPUT, @h OUTPUT;
SET @ok = IIF(@n = 2 AND @h = 44.5, 1, 0); SET @info = CONCAT(N'n=', @n, N' hours=', @h); ROLLBACK;`),
    ],
    saiTay: [PROC.replace("SELECT @totalHours = COALESCE(SUM(w.workHours), 0)", "SELECT @totalHours = SUM(w.workHours)"), PROC.replace("        RETURN -1;                                             -- return code: no such department\n", "        RETURN 0;\n")],
    gy: [['OUTPUT parameters carry values back; RETURN carries one INT status code.', 'Tham số OUTPUT mang giá trị ra; RETURN mang một mã trạng thái INT.'], ['The caller must write OUTPUT too: EXEC p 1, @n OUTPUT, @h OUTPUT.', 'Người gọi cũng phải ghi OUTPUT: EXEC p 1, @n OUTPUT, @h OUTPUT.']],
    lhg: [['SUM over no rows is NULL — department 5 gets NULL hours.', 'SUM trên không dòng là NULL — phòng 5 nhận giờ NULL.'], ['Returning results with SELECT instead of OUTPUT parameters — the PE asks for OUTPUT.', 'Trả kết quả bằng SELECT thay vì tham số OUTPUT — đề PE yêu cầu OUTPUT.']],
    gt: ['<p>RETURN is for status (0 = success by convention), OUTPUT parameters for data. Forgetting OUTPUT in the EXEC is legal but the variable stays NULL — a classic silent bug.</p>', '<p>RETURN dành cho trạng thái (quy ước 0 = thành công), tham số OUTPUT cho dữ liệu. Quên OUTPUT trong EXEC vẫn hợp lệ nhưng biến giữ NULL — lỗi im lặng kinh điển.</p>'],
    tn: [tn('stored procedure', 'thủ tục lưu sẵn'), tn('return code', 'mã trả về')],
  }),
  tsql({
    t: 'A scalar function used inside a query: exact age', k: 'MEDIUM', p: 12,
    kn: ['scalar function', 'DATEDIFF / DATEADD', 'NULL input'], tag: ['tsql', 'function', 'fuhcompany', 'slide'],
    en: '<p>Write <code>dbo.fnAgeAt(@birth DATE, @onDate DATE) RETURNS INT</code>: the age in whole years on <code>@onDate</code> (a person born 2000-12-31 is 25 on 2026-12-30 and 26 on 2026-12-31); NULL when the birth date is NULL. Note: <code>DATEDIFF(YEAR, …)</code> alone only counts year boundaries.</p>',
    vi: '<p>Viết <code>dbo.fnAgeAt(@birth DATE, @onDate DATE) RETURNS INT</code>: tuổi tròn năm tại ngày <code>@onDate</code> (người sinh 2000-12-31 là 25 tuổi ngày 2026-12-30 và 26 tuổi ngày 2026-12-31); NULL khi ngày sinh NULL. Lưu ý: riêng <code>DATEDIFF(YEAR, …)</code> chỉ đếm số lần qua năm.</p>',
    yc: [['Call it with the schema: dbo.fnAgeAt(empBirthdate, \'2026-11-01\').', 'Gọi kèm schema: dbo.fnAgeAt(empBirthdate, \'2026-11-01\').'], ['Subtract 1 when the birthday has not been reached yet in that year.', 'Trừ 1 khi chưa tới sinh nhật trong năm đó.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER FUNCTION dbo.fnAgeAt (@birth DATE, @onDate DATE)
-- RETURNS INT
-- AS
-- BEGIN ... RETURN ...; END
`,
    giai: FN_AGE,
    kiem: [
      ck(['Birthday edge: 25 the day before, 26 on the day', 'Biên sinh nhật: 25 hôm trước, 26 đúng ngày'], `SET @ok = IIF(dbo.fnAgeAt('2000-12-31', '2026-12-30') = 25 AND dbo.fnAgeAt('2000-12-31', '2026-12-31') = 26, 1, 0);
SET @info = CONCAT(N'got ', dbo.fnAgeAt('2000-12-31', '2026-12-30'), N' and ', dbo.fnAgeAt('2000-12-31', '2026-12-31'));`),
      ck(['NULL birth date → NULL', 'Ngày sinh NULL → NULL'], `SET @ok = IIF(dbo.fnAgeAt(NULL, '2026-11-01') IS NULL, 1, 0); SET @info = CONCAT(N'got ', dbo.fnAgeAt(NULL, '2026-11-01'));`),
      ck(['Used in a query: employees aged 40+ on 2026-11-01', 'Dùng trong truy vấn: nhân viên từ 40 tuổi ngày 2026-11-01'], giongNhau(`SELECT empSSN FROM tblEmployee WHERE dbo.fnAgeAt(empBirthdate, '2026-11-01') >= 40`, `SELECT empSSN FROM tblEmployee WHERE empBirthdate <= '1986-11-01'`)),
    ],
    saiTay: [FN_AGE.replace("    IF DATEADD(YEAR, @age, @birth) > @onDate SET @age -= 1;    -- birthday not reached yet this year\n", ''), FN_AGE.replace('    IF @birth IS NULL RETURN NULL;\n', '    IF @birth IS NULL RETURN 0;\n')],
    gy: [['DATEDIFF(YEAR, \'2000-12-31\', \'2026-01-01\') = 26 although the person is 25.', 'DATEDIFF(YEAR, \'2000-12-31\', \'2026-01-01\') = 26 dù người đó mới 25.'], ['Correct it: if DATEADD(YEAR, @age, @birth) &gt; @onDate then @age − 1.', 'Sửa: nếu DATEADD(YEAR, @age, @birth) &gt; @onDate thì @age − 1.']],
    lhg: [['DATEDIFF(YEAR, …) alone — a year too old for everybody whose birthday is still to come.', 'Chỉ DATEDIFF(YEAR, …) — già thêm một tuổi với ai chưa tới sinh nhật.'], ['Returning 0 for an unknown birth date — 0 is a real age.', 'Trả 0 cho ngày sinh chưa biết — 0 là một tuổi thật.']],
    gt: ['<p>A scalar function is called once per row when used in WHERE — fine on small tables, slow on millions (and the column inside it cannot use an index). That is why the check compares with a plain date-range query.</p>', '<p>Hàm vô hướng được gọi mỗi dòng một lần khi dùng trong WHERE — ổn với bảng nhỏ, chậm với hàng triệu dòng (và cột trong hàm không dùng được chỉ mục). Vì vậy kiểm so với một truy vấn khoảng ngày bình thường.</p>'],
    tn: [tn('scalar function', 'hàm vô hướng'), tn('DATEDIFF', 'hiệu hai ngày')],
  }),
  tsql({
    t: 'An inline table-valued function: staff of a project', k: 'EASY', p: 10,
    kn: ['inline table-valued function', 'RETURNS TABLE'], tag: ['tsql', 'function', 'fuhcompany', 'slide'],
    en: '<p>Write <code>dbo.fnStaffOfProject(@proNum INT) RETURNS TABLE</code> returning <code>empSSN, empName, workHours</code> of everybody working on the project. It must be usable in FROM and in joins like a table.</p>',
    vi: '<p>Viết <code>dbo.fnStaffOfProject(@proNum INT) RETURNS TABLE</code> trả <code>empSSN, empName, workHours</code> của mọi người làm dự án. Phải dùng được trong FROM và trong phép nối như một bảng.</p>',
    yc: [['RETURNS TABLE AS RETURN (SELECT …) — one SELECT, no BEGIN … END.', 'RETURNS TABLE AS RETURN (SELECT …) — một SELECT, không BEGIN … END.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER FUNCTION dbo.fnStaffOfProject (@proNum INT)
-- RETURNS TABLE
-- AS
-- RETURN ( SELECT ... );
`,
    giai: FN_TAB,
    kiem: [
      ck(['ProjectC (3): four people', 'ProjectC (3): bốn người'], giongNhau(`SELECT empSSN, empName, workHours FROM dbo.fnStaffOfProject(3)`, `SELECT e.empSSN, e.empName, w.workHours FROM tblWorksOn w JOIN tblEmployee e ON e.empSSN = w.empSSN WHERE w.proNum = 3`)),
      ck(['A project nobody works on: empty', 'Dự án chưa ai làm: rỗng'], `BEGIN TRAN; INSERT INTO tblProject VALUES (7, N'ProjectG', 1, 5);
SET @ok = IIF((SELECT COUNT(*) FROM dbo.fnStaffOfProject(7)) = 0, 1, 0); SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM dbo.fnStaffOfProject(7))); ROLLBACK;`),
      ck(['Joinable like a table: total hours of ProjectE = 85', 'Nối được như bảng: tổng giờ ProjectE = 85'], `SET @ok = IIF((SELECT SUM(s.workHours) FROM tblProject p CROSS APPLY dbo.fnStaffOfProject(p.proNum) s WHERE p.proName = N'ProjectE') = 85, 1, 0);
SET @info = N'SELECT SUM(workHours) over CROSS APPLY should be 85';`),
    ],
    saiTay: [FN_TAB.replace('WHERE w.proNum = @proNum', 'WHERE w.proNum = 3'), `CREATE OR ALTER FUNCTION dbo.fnStaffOfProject (@proNum INT) RETURNS TABLE AS RETURN (
    SELECT e.empSSN, e.empName, CAST(0 AS DECIMAL(5,1)) AS workHours
    FROM tblProject p JOIN tblEmployee e ON e.depNum = p.depNum
    WHERE p.proNum = @proNum);`],
    gy: [['An inline TVF is a parameterised view: RETURNS TABLE AS RETURN (SELECT …).', 'TVF nội tuyến là một view có tham số: RETURNS TABLE AS RETURN (SELECT …).'], ['Use the parameter in the WHERE: w.proNum = @proNum.', 'Dùng tham số trong WHERE: w.proNum = @proNum.']],
    lhg: [['Hard-coding the project number — every call returns ProjectC.', 'Ghi cứng số dự án — lời gọi nào cũng trả ProjectC.'], ['Returning the employees of the department that CONTROLS the project — the staff of a project are the rows of tblWorksOn.', 'Trả nhân viên của phòng QUẢN LÝ dự án — người làm dự án là các dòng của tblWorksOn.']],
    gt: ['<p>Inline TVFs are expanded into the calling query like a view, so the optimizer can use indexes; multi-statement TVFs (RETURNS @t TABLE … BEGIN … END) cannot be optimised the same way.</p>', '<p>TVF nội tuyến được mở vào truy vấn gọi nó như view nên bộ tối ưu dùng được chỉ mục; TVF nhiều câu lệnh (RETURNS @t TABLE … BEGIN … END) không được tối ưu như vậy.</p>'],
    tn: [tn('table-valued function', 'hàm trả bảng'), tn('CROSS APPLY', 'áp hàm cho từng dòng')],
  }),
  cs({
    t: 'Procedure or function? Decide in 10 seconds', k: 'EASY', p: 7,
    kn: ['procedure vs function', 'three-tier architecture'], tag: ['tsql', 'slide'],
    en: '<p>The decision table of slides 20–34.</p>', vi: '<p>Bảng quyết định của slide 20–34.</p>',
    cau: [
      q('c1', ['You need the value inside a SELECT list: SELECT empName, ___(empSSN) …', 'Bạn cần giá trị ngay trong danh sách SELECT: SELECT empName, ___(empSSN) …'], ['a scalar function', 'a stored procedure', 'a trigger', 'a cursor'], ['Only functions can be called inside expressions; procedures are EXECuted as statements.', 'Chỉ hàm gọi được trong biểu thức; procedure được EXEC như một câu lệnh.']),
      q('c2', ['The routine must INSERT rows and use BEGIN TRAN … COMMIT:', 'Thủ tục phải INSERT dòng và dùng BEGIN TRAN … COMMIT:'], ['a stored procedure', 'a scalar function', 'an inline table-valued function', 'a view'], ['T-SQL functions cannot change data or control transactions.', 'Hàm T-SQL không được đổi dữ liệu hay điều khiển giao dịch.']),
      q('c3', ['You need "a view with a parameter":', 'Bạn cần "một view có tham số":'], ['an inline table-valued function', 'a scalar function', 'a trigger', 'a stored procedure with PRINT'], ['RETURNS TABLE AS RETURN (SELECT … WHERE col = @param).', 'RETURNS TABLE AS RETURN (SELECT … WHERE cột = @thamSố).']),
      q('c4', ['In the three-tier picture of slide 21, stored procedures live in…', 'Trong hình ba tầng của slide 21, stored procedure nằm ở…'], ['the database tier (data server)', 'the presentation tier (browser)', 'the application tier only', 'the client\'s hard disk'], ['They run inside the DBMS, close to the data, and the application calls them.', 'Chúng chạy trong DBMS, sát dữ liệu, ứng dụng gọi chúng.']),
      q('c5', ['A function is called as dbo.fnX(1) but fnX(1) fails. Why?', 'Hàm gọi dbo.fnX(1) thì chạy nhưng fnX(1) lỗi. Vì sao?'], ['scalar functions must be called with their schema name', 'functions cannot take constants', 'dbo is a keyword for procedures', 'fnX(1) calls a procedure'], ['"is not a recognized built-in function name" — write dbo.fnX.', '"is not a recognized built-in function name" — viết dbo.fnX.']),
    ],
    gy: [['Value inside an expression ⇒ function. Changes data / transactions ⇒ procedure.', 'Giá trị trong biểu thức ⇒ hàm. Đổi dữ liệu / giao dịch ⇒ procedure.'], ['Scalar UDFs need the schema prefix.', 'Hàm vô hướng cần tiền tố schema.']],
    lhg: [['Trying to UPDATE inside a function.', 'Cố UPDATE trong hàm.'], ['Calling a scalar function without dbo.', 'Gọi hàm vô hướng thiếu dbo.']],
    tn: [tn('three-tier architecture', 'kiến trúc ba tầng')],
  }),
]);
