/**
 * DBI202 · Chữa trọn đề PE 1 (SP26-1 · CSDL nhân sự HR) — đề thật content/exams/DBI202-PE1 với DBscript.sql gốc (_pe-sp26.mjs).
 *   Đề 1 (trình duyệt): Q2–Q7 + Q10 — truy vấn và DELETE, chấm trên đúng dữ liệu của đề + kiểm ẩn đổi dữ liệu.
 *   Đề 2 (SQL Server của người học): Q1 (ERD → bảng NVARCHAR), Q8 (procedure OUTPUT), Q9 (trigger AFTER INSERT) — check.sql.
 * Lời giải mẫu = sampleSolution của đề thi (đã chạy trên SQL Server 2022 khi soạn đề).
 */
import { doiDau, KHOA, deLonSql, kq, kqAn, sau, ma, tsql, ck, tn } from './_chung.mjs';
import { PE_HR, PE_HR_TSQL } from './_pe-sp26.mjs';

const NV_MOI = (id, ten, job, dep, luong) => `INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (${id}, 'Test', '${ten}', 'T${id}', '000', '2026-01-01', '${job}', ${luong}, 0, 100, ${dep})`;

const Q1 = `CREATE TABLE Building (
    BuildingID   int PRIMARY KEY,
    BuildingName nvarchar(100),
    TotalFloors  int
);
CREATE TABLE Floor (
    FloorID        int PRIMARY KEY,
    FloorName      nvarchar(100),
    ApartmentCount int,
    BuildingID     int REFERENCES Building(BuildingID)          -- 1–N: FK on the N side
);
CREATE TABLE Manufacturer (
    ManufacturerID   int PRIMARY KEY,
    ManufacturerName nvarchar(100),
    Address          nvarchar(255)
);
CREATE TABLE Equipment (
    EquipmentID    int PRIMARY KEY,
    EquipmentName  nvarchar(100),
    Description    nvarchar(255),
    ManufacturerID int REFERENCES Manufacturer(ManufacturerID)
);
CREATE TABLE setup_Equi (                                       -- M–N with an attribute: its own table
    FloorID     int REFERENCES Floor(FloorID),
    EquipmentID int REFERENCES Equipment(EquipmentID),
    Quantity    int,
    PRIMARY KEY (FloorID, EquipmentID)
);`;
const Q8 = `CREATE PROCEDURE prNumberOfDepartments
    @countryID varchar(10),
    @numberOfDepartments int OUTPUT
AS
BEGIN
    SELECT @numberOfDepartments = COUNT(d.DepartmentID)
    FROM Departments d
    JOIN Locations l ON l.LocationID = d.LocationID
    WHERE l.CountryID = @countryID;
END`;
const Q9 = `CREATE TRIGGER Tr1 ON Employees
AFTER INSERT
AS
BEGIN
    SELECT i.EmployeeID, i.FirstName, i.LastName, i.DepartmentID, d.DepartmentName
    FROM inserted i                                              -- every inserted row, not just one
    JOIN Departments d ON d.DepartmentID = i.DepartmentID;
END`;
const GIAI_TAY = `-- Q1 (run in any empty database; here the scratch database also holds the HR tables, no name clash)
${Q1}
GO
-- Q8
${Q8}
GO
-- Q9
${Q9}`;
const COT_Q1 = (bang, cot) => `EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.${bang}') AND c.name = N'${cot[0]}' AND t.name = N'${cot[1]}'${cot[2] ? ` AND c.max_length = ${cot[2] * 2}` : ''})`;

export default doiDau({
  slug: 'dbi202-pe1-sp26-chua-tron-de',
  ten: 'PE review · Exam 1 (SP26-1 · HR database) — all 10 questions',
  khoa: KHOA,
  baiHoc: 'dbi202-pe1-sp26-chua-tron-de',
  de: [
    deLonSql({
      dangBai: 'pe',
      tieuDe: 'PE SP26-1 (HR database) — Q2–Q7 and Q10, graded in the browser',
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['WHERE', 'JOIN', 'GROUP BY … HAVING vs subquery', '4-table join path', 'maximum per group', 'relational division', 'DELETE with subquery'],
      the: ['dbi202', 'pe', 'sql', 'exam-review', 'sp26'],
      csdl: PE_HR, tenCsdl: 'DBscript',
      thuMuc: 'RollNo_Name_DBI202_PE_SP26_1',
      phu: { en: 'DBI202 · real Practical Exam SP26-1 · the paper\'s own DBscript.sql (50 employees) · Q2 0.5, Q3–Q7 and Q10 1 mark each', vi: 'DBI202 · đề thi thực hành thật SP26-1 · đúng DBscript.sql của đề (50 nhân viên) · Q2 0,5; Q3–Q7 và Q10 mỗi câu 1 điểm' },
      moTa: {
        en: '<p>The real SP26-1 paper on the HR database (Regions → Countries → Locations → Departments → Employees, Jobs). The questions that are plain SQL are graded here on the exact data of the paper, plus hidden checks that change the data so a hard-coded answer fails. Q1 (ERD with nvarchar), Q8 (procedure) and Q9 (trigger) are T-SQL: they are the second exercise of this lesson and run on your own SQL Server.</p>',
        vi: '<p>Đề SP26-1 thật trên CSDL nhân sự (Regions → Countries → Locations → Departments → Employees, Jobs). Các câu SQL thuần được chấm ở đây trên đúng dữ liệu của đề, cộng kiểm ẩn đổi dữ liệu để đáp án viết cứng sẽ trượt. Q1 (ERD với nvarchar), Q8 (procedure) và Q9 (trigger) là T-SQL: chúng là bài thứ hai của bài học này và chạy trên SQL Server của bạn.</p>',
      },
      yeuCauChung: [
        { en: 'One file per question containing ONLY the statement that answers it — no USE, no GO, no test commands (the real rule: one violation = 0 for the question).', vi: 'Mỗi câu một tệp CHỈ chứa câu lệnh trả lời — không USE, không GO, không lệnh chạy thử (luật thật: sai một điều là 0 điểm câu đó).' },
        { en: 'Column names and order exactly as asked; row order only matters when the question says "ordered by".', vi: 'Tên và thứ tự cột đúng như đề; thứ tự dòng chỉ quan trọng khi đề ghi "sắp theo".' },
        { en: 'Portable SQL only here: no TOP, ISNULL, YEAR(). The file numbering keeps the paper\'s numbers (Q2 … Q7, Q10).', vi: 'Ở đây chỉ dùng SQL chạy cả hai hệ: không TOP, ISNULL, YEAR(). Tên tệp giữ đúng số câu của đề (Q2 … Q7, Q10).' },
      ],
      moHinh: [
        { ten: 'Regions', truong: [['RegionID', 'int', 'PK'], ['RegionName', 'varchar(30)', 'Europe, Americas, Asia, Middle East and Africa, Africa']] },
        { ten: 'Countries', truong: [['CountryID', 'varchar(10)', 'PK (UK, US, …)'], ['CountryName', 'varchar(50)', ''], ['RegionID', 'int', 'FK → Regions']] },
        { ten: 'Locations', truong: [['LocationID', 'varchar(5)', 'PK'], ['StreetAddress, PostalCode, City, StateProvince', 'varchar', ''], ['CountryID', 'varchar(10)', 'FK → Countries']] },
        { ten: 'Jobs', truong: [['JobID', 'varchar(20)', 'PK (IT_PROG, ST_CLERK, …)'], ['JobTitle', 'varchar(100)', ''], ['min_salary, max_salary', 'int', '']] },
        { ten: 'Departments', truong: [['DepartmentID', 'int', 'PK'], ['DepartmentName', 'varchar(50)', ''], ['LocationID', 'varchar(5)', 'FK → Locations'], ['ManagerID', 'int', '']] },
        { ten: 'Employees', truong: [['EmployeeID', 'int', 'PK'], ['FirstName, LastName, Email, Phone', 'varchar', ''], ['HireDate', 'date', ''], ['JobID', 'varchar(20)', 'FK → Jobs'], ['Salary, Commission_pct', 'float', ''], ['ManagerID', 'int', 'FK → Employees'], ['DepartmentID', 'int', 'FK → Departments']] },
      ],
      cau: [
        {
          ten: { en: 'Q2 · Employees earning more than 15000', vi: 'Q2 · Nhân viên lương trên 15000' }, diem: 0.5,
          moTa: { en: 'Employees whose salary is greater than 15000.', vi: 'Nhân viên có lương lớn hơn 15000.' },
          yeuCau: [{ en: 'Columns: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary</code>. Any row order.', vi: 'Cột: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary</code>. Thứ tự dòng tuỳ ý.' }],
          giai: `SELECT EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary
FROM Employees
WHERE Salary > 15000;`,
          kiem: [kq('Q2 · 3 employees (King, Kochhar, De Haan)'), kqAn('Q2 · a salary of exactly 15000 is not "greater than"', `UPDATE Employees SET Salary = 15000 WHERE EmployeeID = 101; ${NV_MOI(900, 'Rich', 'SA_MAN', 80, 15500)}`)],
          saiMau: ['SELECT EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary FROM Employees WHERE Salary >= 15000', 'SELECT EmployeeID, FirstName, LastName, Email, Phone, JobID FROM Employees WHERE Salary > 15000'],
        },
        {
          ten: { en: "Q3 · Employees of the 'IT' department", vi: "Q3 · Nhân viên phòng 'IT'" }, diem: 1,
          moTa: { en: "Employees working in the department named 'IT'.", vi: "Nhân viên làm ở phòng tên 'IT'." },
          yeuCau: [{ en: 'Columns: <code>EmployeeID, FirstName, LastName, DepartmentID, DepartmentName</code>. Any row order.', vi: 'Cột: <code>EmployeeID, FirstName, LastName, DepartmentID, DepartmentName</code>. Thứ tự dòng tuỳ ý.' }],
          giai: `SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentID, d.DepartmentName
FROM Employees e
JOIN Departments d ON d.DepartmentID = e.DepartmentID
WHERE d.DepartmentName = 'IT';`,
          kiem: [kq('Q3 · employees 103–107'), kqAn("Q3 · a new hire in IT, one in 'IT Support'", `${NV_MOI(900, 'Dev', 'IT_PROG', 60, 5000)}; ${NV_MOI(901, 'Help', 'IT_PROG', 210, 4000)}`)],
          saiMau: ["SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentID, d.DepartmentName FROM Employees e JOIN Departments d ON d.DepartmentID = e.DepartmentID WHERE d.DepartmentName LIKE 'IT%'", 'SELECT e.EmployeeID, e.FirstName, e.LastName, e.DepartmentID, e.JobID FROM Employees e WHERE e.DepartmentID = 60'],
        },
        {
          ten: { en: "Q4 · Jobs with more employees than 'IT_PROG'", vi: "Q4 · Công việc đông người hơn 'IT_PROG'" }, diem: 1,
          moTa: { en: "JobID and JobTitle of the jobs that have more employees than the job 'IT_PROG'.", vi: "JobID và JobTitle của các công việc có nhiều nhân viên hơn công việc 'IT_PROG'." },
          yeuCau: [{ en: 'Columns: <code>JobID, JobTitle</code>. Compare with a subquery, never with a typed-in number.', vi: 'Cột: <code>JobID, JobTitle</code>. So với truy vấn con, đừng gõ cứng một con số.' }],
          giai: `SELECT j.JobID, j.JobTitle
FROM Jobs j
JOIN Employees e ON e.JobID = j.JobID
GROUP BY j.JobID, j.JobTitle
HAVING COUNT(e.EmployeeID) > (SELECT COUNT(*) FROM Employees WHERE JobID = 'IT_PROG');`,
          kiem: [kq('Q4 · ST_CLERK'), kqAn('Q4 · two more programmers raise the bar; more sales reps', `${NV_MOI(900, 'P1', 'IT_PROG', 60, 5000)}; ${NV_MOI(901, 'P2', 'IT_PROG', 60, 5000)}; ${NV_MOI(902, 'S1', 'SA_REP', 80, 7000)}; ${NV_MOI(903, 'S2', 'SA_REP', 80, 7000)}; ${NV_MOI(904, 'S3', 'SA_REP', 80, 7000)}; ${NV_MOI(905, 'S4', 'SA_REP', 80, 7000)}; ${NV_MOI(906, 'S5', 'SA_REP', 80, 7000)}; ${NV_MOI(907, 'S6', 'SA_REP', 80, 7000)}; ${NV_MOI(908, 'S7', 'SA_REP', 80, 7000)}`)],
          saiMau: ['SELECT j.JobID, j.JobTitle FROM Jobs j JOIN Employees e ON e.JobID = j.JobID GROUP BY j.JobID, j.JobTitle HAVING COUNT(e.EmployeeID) > 5', "SELECT j.JobID, j.JobTitle FROM Jobs j JOIN Employees e ON e.JobID = j.JobID GROUP BY j.JobID, j.JobTitle HAVING COUNT(e.EmployeeID) >= (SELECT COUNT(*) FROM Employees WHERE JobID = 'IT_PROG')"],
        },
        {
          ten: { en: 'Q5 · Employees of departments located in Europe', vi: 'Q5 · Nhân viên các phòng đặt ở châu Âu' }, diem: 1,
          moTa: { en: "Employees working in departments located in the region 'Europe', highest salary first.", vi: "Nhân viên làm ở các phòng đặt tại vùng 'Europe', lương cao trước." },
          yeuCau: [{ en: 'Columns: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary, DepartmentID, DepartmentName</code>, ordered by Salary DESC (then EmployeeID).', vi: 'Cột: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary, DepartmentID, DepartmentName</code>, sắp Salary giảm (rồi EmployeeID).' }],
          giai: `SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.Salary,
       d.DepartmentID, d.DepartmentName
FROM Employees e
JOIN Departments d ON d.DepartmentID = e.DepartmentID
JOIN Locations  l ON l.LocationID  = d.LocationID
JOIN Countries  c ON c.CountryID   = l.CountryID
JOIN Regions    r ON r.RegionID    = c.RegionID
WHERE r.RegionName = 'Europe'
ORDER BY e.Salary DESC, e.EmployeeID;`,
          kiem: [kq('Q5 · the Sales managers 145–149', { thuTu: true }), kqAn('Q5 · a new hire in Sales (Oxford) and one in Executive (Seattle)', `${NV_MOI(900, 'Uk', 'SA_REP', 80, 13800)}; ${NV_MOI(901, 'Us', 'AD_VP', 90, 16000)}`, { thuTu: true })],
          saiMau: ["SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.Salary, d.DepartmentID, d.DepartmentName FROM Employees e JOIN Departments d ON d.DepartmentID = e.DepartmentID JOIN Locations l ON l.LocationID = d.LocationID JOIN Countries c ON c.CountryID = l.CountryID JOIN Regions r ON r.RegionID = c.RegionID WHERE r.RegionName = 'Europe' ORDER BY e.Salary, e.EmployeeID"],
        },
        {
          ten: { en: 'Q6 · Highest-paid employee(s) of each department', vi: 'Q6 · Nhân viên lương cao nhất mỗi phòng' }, diem: 1,
          moTa: { en: 'Employees earning the maximum salary of their department, highest salary first. Ties are all shown.', vi: 'Nhân viên có lương cao nhất phòng mình, lương cao trước. Hoà thì hiện tất cả.' },
          yeuCau: [{ en: 'Columns: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, HireDate, Salary, DepartmentID, DepartmentName</code>, ordered by Salary DESC (then EmployeeID).', vi: 'Cột: <code>EmployeeID, FirstName, LastName, Email, Phone, JobID, HireDate, Salary, DepartmentID, DepartmentName</code>, sắp Salary giảm (rồi EmployeeID).' }],
          giai: `SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.HireDate, e.Salary,
       d.DepartmentID, d.DepartmentName
FROM Employees e
JOIN Departments d ON d.DepartmentID = e.DepartmentID
WHERE e.Salary = (SELECT MAX(e2.Salary) FROM Employees e2 WHERE e2.DepartmentID = e.DepartmentID)
ORDER BY e.Salary DESC, e.EmployeeID;`,
          kiem: [kq('Q6 · six department leaders', { thuTu: true }), kqAn('Q6 · a tie at the top of IT', NV_MOI(900, 'Tie', 'IT_PROG', 60, 9000), { thuTu: true })],
          saiMau: ['SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.HireDate, e.Salary, d.DepartmentID, d.DepartmentName FROM Employees e JOIN Departments d ON d.DepartmentID = e.DepartmentID WHERE e.Salary = (SELECT MAX(Salary) FROM Employees) ORDER BY e.Salary DESC, e.EmployeeID'],
        },
        {
          ten: { en: 'Q7 · Regions where every department has an employee', vi: 'Q7 · Vùng mà mọi phòng đều có nhân viên' }, diem: 1,
          moTa: { en: 'Regions where every department located there has at least one employee (relational division).', vi: 'Các vùng mà mọi phòng đặt tại đó đều có ít nhất một nhân viên (phép chia quan hệ).' },
          yeuCau: [{ en: 'Column: <code>RegionName</code>. Any row order. A region with no department at all also qualifies ("every" of nothing is true).', vi: 'Cột: <code>RegionName</code>. Thứ tự dòng tuỳ ý. Vùng không có phòng nào cũng thoả ("mọi" trên tập rỗng là đúng).' }],
          giai: `SELECT r.RegionName
FROM Regions r
WHERE NOT EXISTS (                                   -- there is no department of this region…
    SELECT 1
    FROM Departments d
    JOIN Locations l ON l.LocationID = d.LocationID
    JOIN Countries c ON c.CountryID  = l.CountryID
    WHERE c.RegionID = r.RegionID
      AND NOT EXISTS (SELECT 1 FROM Employees e WHERE e.DepartmentID = d.DepartmentID)   -- …without an employee
);`,
          kiem: [kq('Q7 · Asia, Middle East and Africa, Africa'), kqAn('Q7 · a new empty department in Asia', "INSERT INTO Departments (DepartmentID, DepartmentName, LocationID, ManagerID) VALUES (999, 'Tokyo Lab', (SELECT MIN(l.LocationID) FROM Locations l JOIN Countries c ON c.CountryID = l.CountryID WHERE c.RegionID = 3), NULL)")],
          saiMau: ['SELECT DISTINCT r.RegionName FROM Regions r JOIN Countries c ON c.RegionID = r.RegionID JOIN Locations l ON l.CountryID = c.CountryID JOIN Departments d ON d.LocationID = l.LocationID JOIN Employees e ON e.DepartmentID = d.DepartmentID'],
        },
        {
          ten: { en: "Q10 · Delete the employees of the 'IT' department", vi: "Q10 · Xoá nhân viên phòng 'IT'" }, diem: 1,
          moTa: { en: "Delete every employee working in the department named 'IT'.", vi: "Xoá mọi nhân viên làm ở phòng tên 'IT'." },
          yeuCau: [{ en: 'One DELETE; find the department by its NAME (subquery), not by typing 60.', vi: 'Một câu DELETE; tìm phòng theo TÊN (truy vấn con), không gõ 60.' }],
          giai: `DELETE FROM Employees
WHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'IT');`,
          kiem: [
            sau('Q10 · IT now has 0 employees, 45 remain', "SELECT (SELECT COUNT(*) FROM Employees WHERE DepartmentID = 60) AS RemainingIT, (SELECT COUNT(*) FROM Employees) AS TotalEmployees"),
            sau('Q10 · hidden: IT is renumbered 65, and IT Support gets a person', `SELECT (SELECT COUNT(*) FROM Employees e JOIN Departments d ON d.DepartmentID = e.DepartmentID WHERE d.DepartmentName = 'IT') AS RemainingIT, (SELECT COUNT(*) FROM Employees) AS TotalEmployees`, { an: true, themCsdl: `INSERT INTO Departments (DepartmentID, DepartmentName, LocationID, ManagerID) VALUES (65, 'IT', '1400', NULL); UPDATE Employees SET DepartmentID = 65 WHERE DepartmentID = 60; UPDATE Departments SET DepartmentName = 'IT (old)' WHERE DepartmentID = 60; ${NV_MOI(901, 'Help', 'IT_PROG', 210, 4000)}` }),
          ],
          saiMau: ['DELETE FROM Employees WHERE DepartmentID = 60', "DELETE FROM Employees WHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE DepartmentName LIKE 'IT%')"],
        },
      ],
      thuatNgu: [tn('relational division', 'phép chia quan hệ'), tn('correlated subquery', 'truy vấn con tương quan'), tn('join path', 'đường nối nhiều bảng')],
      goiY: [
        { en: 'Q4: compare COUNT with a subquery that counts IT_PROG — the threshold changes with the data.', vi: 'Q4: so COUNT với truy vấn con đếm IT_PROG — ngưỡng thay đổi theo dữ liệu.' },
        { en: 'Q5: follow the chain Employees → Departments → Locations → Countries → Regions, one JOIN per arrow.', vi: 'Q5: đi theo chuỗi Employees → Departments → Locations → Countries → Regions, mỗi mũi tên một JOIN.' },
        { en: 'Q7: "every department has an employee" = there is NO department without an employee (double NOT EXISTS).', vi: 'Q7: "mọi phòng đều có nhân viên" = KHÔNG có phòng nào thiếu nhân viên (NOT EXISTS lồng hai lần).' },
      ],
      loiHayGap: [
        { en: 'Q6 comparing with the MAX of the whole company instead of the employee\'s own department.', vi: 'Q6 so với MAX của cả công ty thay vì của chính phòng nhân viên đó.' },
        { en: "Q10 with DepartmentID = 60 or LIKE 'IT%' — the first breaks when ids change, the second also deletes 'IT Support'.", vi: "Q10 dùng DepartmentID = 60 hoặc LIKE 'IT%' — cách đầu hỏng khi đổi mã, cách sau xoá luôn 'IT Support'." },
        { en: 'Q7 with plain JOINs — that lists regions where SOME department has an employee.', vi: 'Q7 chỉ dùng JOIN — thành liệt kê vùng có MỘT phòng nào đó có nhân viên.' },
      ],
      giaiThich: { en: '<p>The reference answers are the paper\'s own (run on SQL Server 2022) with a tie-breaker added to the ORDER BY where the paper sorts by salary only. Each file is graded on the paper\'s data and again on a modified copy.</p>', vi: '<p>Lời giải mẫu là lời giải của đề (đã chạy trên SQL Server 2022), thêm khoá phá hoà vào ORDER BY ở câu đề chỉ sắp theo lương. Mỗi tệp được chấm trên dữ liệu của đề và trên một bản đã sửa dữ liệu.</p>' },
    }),
    tsql({
      t: 'PE SP26-1 — Q1, Q8, Q9: ERD → tables (nvarchar), procedure with OUTPUT, AFTER INSERT trigger', k: 'HARD', p: 30, dangBai: 'pe', diem: 100,
      kn: ['ERD → tables', 'OUTPUT parameter', 'trigger + inserted'], tag: ['pe', 'exam-review', 'sp26'],
      lyDo: ['Q1 must use nvarchar exactly as the ERD says, Q8 is a stored procedure with an OUTPUT parameter and Q9 a trigger reading the inserted table — all three are SQL Server–only and are checked on your own server, on the paper\'s DBscript.sql.', 'Q1 phải dùng đúng nvarchar như ERD, Q8 là stored procedure có tham số OUTPUT và Q9 là trigger đọc bảng inserted — cả ba chỉ SQL Server có, nên được kiểm trên máy chủ của bạn với đúng DBscript.sql của đề.'],
      en: `<p>The T-SQL half of the real SP26-1 paper. setup.sql loads the paper's <code>DBscript.sql</code> (HR database).</p>
<ol><li><b>Q1 (1.5)</b> — tables of the ERD: <code>Building(BuildingID int, BuildingName nvarchar(100), TotalFloors int)</code>, <code>Floor(FloorID int, FloorName nvarchar(100), ApartmentCount int)</code>, <code>Equipment(EquipmentID int, EquipmentName nvarchar(100), Description nvarchar(255))</code>, <code>Manufacturer(ManufacturerID int, ManufacturerName nvarchar(100), Address nvarchar(255))</code>; Building has Floor 1–N, Manufacturer supply Equipment 1–N, Floor <code>setup_Equi</code> Equipment M–N with <code>Quantity int</code>.</li>
<li><b>Q8 (1)</b> — <code>prNumberOfDepartments @countryID varchar(10), @numberOfDepartments int OUTPUT</code>: the number of departments in that country ('UK' → 2).</li>
<li><b>Q9 (1)</b> — trigger <code>Tr1</code> on Employees: after inserting one or more employees, display <code>EmployeeID, FirstName, LastName, DepartmentID, DepartmentName</code> of the inserted rows.</li></ol>`,
      vi: `<p>Nửa T-SQL của đề SP26-1 thật. setup.sql nạp <code>DBscript.sql</code> của đề (CSDL nhân sự).</p>
<ol><li><b>Q1 (1,5)</b> — các bảng của ERD: <code>Building(BuildingID int, BuildingName nvarchar(100), TotalFloors int)</code>, <code>Floor(FloorID int, FloorName nvarchar(100), ApartmentCount int)</code>, <code>Equipment(EquipmentID int, EquipmentName nvarchar(100), Description nvarchar(255))</code>, <code>Manufacturer(ManufacturerID int, ManufacturerName nvarchar(100), Address nvarchar(255))</code>; Building có Floor 1–N, Manufacturer cung cấp Equipment 1–N, Floor <code>setup_Equi</code> Equipment M–N với <code>Quantity int</code>.</li>
<li><b>Q8 (1)</b> — <code>prNumberOfDepartments @countryID varchar(10), @numberOfDepartments int OUTPUT</code>: số phòng ở nước đó ('UK' → 2).</li>
<li><b>Q9 (1)</b> — trigger <code>Tr1</code> trên Employees: sau khi chèn một hoặc nhiều nhân viên, hiện <code>EmployeeID, FirstName, LastName, DepartmentID, DepartmentName</code> của các dòng vừa chèn.</li></ol>`,
      yc: [['In the real exam each answer goes in its own file (Q1.sql, Q8.sql, Q9.sql) without GO; here solution.sql separates them with GO.', 'Khi thi thật mỗi câu một tệp (Q1.sql, Q8.sql, Q9.sql) không GO; ở đây solution.sql tách bằng GO.'], ['Q9 must work when several rows are inserted by one statement.', 'Q9 phải đúng khi một câu lệnh chèn nhiều dòng.']],
      setup: PE_HR_TSQL,
      khoi: `-- Q1: CREATE TABLE Building (...) ... setup_Equi (...)
GO
-- Q8: CREATE PROCEDURE prNumberOfDepartments ...
GO
-- Q9: CREATE TRIGGER Tr1 ON Employees AFTER INSERT AS ...`,
      giai: GIAI_TAY,
      kiem: [
        ck(['Q1 · the four entity tables with the ERD columns and nvarchar lengths', 'Q1 · bốn bảng thực thể với đúng cột và độ dài nvarchar của ERD'], `SET @ok = IIF(${COT_Q1('Building', ['BuildingID', 'int'])} AND ${COT_Q1('Building', ['BuildingName', 'nvarchar', 100])} AND ${COT_Q1('Floor', ['FloorName', 'nvarchar', 100])} AND ${COT_Q1('Floor', ['ApartmentCount', 'int'])}
  AND ${COT_Q1('Equipment', ['Description', 'nvarchar', 255])} AND ${COT_Q1('Manufacturer', ['Address', 'nvarchar', 255])} AND ${COT_Q1('Manufacturer', ['ManufacturerName', 'nvarchar', 100])}, 1, 0);
SET @info = N'expected Building/Floor/Equipment/Manufacturer exactly as the ERD (nvarchar lengths included)';`),
        ck(['Q1 · two 1–N foreign keys (Floor.BuildingID, Equipment.ManufacturerID)', 'Q1 · hai khoá ngoại 1–N (Floor.BuildingID, Equipment.ManufacturerID)'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.foreign_key_columns f JOIN sys.columns c ON c.object_id = f.parent_object_id AND c.column_id = f.parent_column_id WHERE f.parent_object_id = OBJECT_ID(N'dbo.Floor') AND c.name = N'BuildingID' AND f.referenced_object_id = OBJECT_ID(N'dbo.Building'))
  AND EXISTS (SELECT 1 FROM sys.foreign_key_columns f JOIN sys.columns c ON c.object_id = f.parent_object_id AND c.column_id = f.parent_column_id WHERE f.parent_object_id = OBJECT_ID(N'dbo.Equipment') AND c.name = N'ManufacturerID' AND f.referenced_object_id = OBJECT_ID(N'dbo.Manufacturer')), 1, 0);
SET @info = N'FK on the N side of each 1–N relationship';`),
        ck(['Q1 · setup_Equi: composite PK (FloorID, EquipmentID), two FKs, Quantity int', 'Q1 · setup_Equi: khoá chính ghép (FloorID, EquipmentID), hai khoá ngoại, Quantity int'], `SET @ok = IIF((SELECT COUNT(*) FROM sys.index_columns ic JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id WHERE i.object_id = OBJECT_ID(N'dbo.setup_Equi') AND i.is_primary_key = 1) = 2
  AND (SELECT COUNT(*) FROM sys.foreign_keys WHERE parent_object_id = OBJECT_ID(N'dbo.setup_Equi')) = 2 AND ${COT_Q1('setup_Equi', ['Quantity', 'int'])}, 1, 0);
SET @info = N'expected PRIMARY KEY (FloorID, EquipmentID), FKs to Floor and Equipment, Quantity int';`),
        ck(["Q8 · 'UK' → 2, 'VN' → 0, 'US' → the real count", "Q8 · 'UK' → 2, 'VN' → 0, 'US' → số đếm thật"], `DECLARE @uk INT, @vn INT, @us INT;
EXEC prNumberOfDepartments 'UK', @uk OUTPUT; EXEC prNumberOfDepartments 'VN', @vn OUTPUT; EXEC prNumberOfDepartments 'US', @us OUTPUT;
SET @ok = IIF(@uk = 2 AND @vn = 0 AND @us = (SELECT COUNT(*) FROM Departments d JOIN Locations l ON l.LocationID = d.LocationID WHERE l.CountryID = 'US'), 1, 0);
SET @info = CONCAT(N'UK = ', @uk, N', VN = ', COALESCE(CAST(@vn AS NVARCHAR(10)), N'NULL'), N', US = ', @us);`),
        ck(['Q9 · inserting employee 1003 displays 1003, Eee, Ggg, 50, Shipping', 'Q9 · chèn nhân viên 1003 hiện 1003, Eee, Ggg, 50, Shipping'], `DECLARE @r TABLE (EmployeeID INT, FirstName VARCHAR(30), LastName VARCHAR(30), DepartmentID INT, DepartmentName VARCHAR(50));
BEGIN TRAN;
INSERT INTO @r EXEC (N'insert into Employees(EmployeeID,FirstName,LastName,Email,JobID,DepartmentID) values (1003,''Eee'',''Ggg'',''eee.ggg@gmail.com'',''SH_CLERK'',50)');
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF((SELECT COUNT(*) FROM @r) = 1 AND EXISTS (SELECT 1 FROM @r WHERE EmployeeID = 1003 AND DepartmentID = 50 AND DepartmentName = 'Shipping'), 1, 0);
SET @info = CONCAT(N'rows displayed: ', (SELECT COUNT(*) FROM @r));`),
        ck(['Q9 · one INSERT of two employees displays both rows', 'Q9 · một lệnh INSERT hai nhân viên hiện cả hai dòng'], `DECLARE @r TABLE (EmployeeID INT, FirstName VARCHAR(30), LastName VARCHAR(30), DepartmentID INT, DepartmentName VARCHAR(50));
BEGIN TRAN;
INSERT INTO @r EXEC (N'insert into Employees(EmployeeID,FirstName,LastName,Email,JobID,DepartmentID) values (1004,''A'',''B'',''a@b'',''IT_PROG'',60), (1005,''C'',''D'',''c@d'',''SA_REP'',80)');
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF((SELECT COUNT(*) FROM @r) = 2 AND EXISTS (SELECT 1 FROM @r WHERE EmployeeID = 1004 AND DepartmentName = 'IT') AND EXISTS (SELECT 1 FROM @r WHERE EmployeeID = 1005 AND DepartmentName = 'Sales'), 1, 0);
SET @info = CONCAT(N'rows displayed: ', (SELECT COUNT(*) FROM @r), N' (expected 2)');`),
      ],
      saiTay: [
        GIAI_TAY.replace('BuildingName nvarchar(100)', 'BuildingName varchar(100)'),
        GIAI_TAY.replace(`    FloorID     int REFERENCES Floor(FloorID),
    EquipmentID int REFERENCES Equipment(EquipmentID),
    Quantity    int,
    PRIMARY KEY (FloorID, EquipmentID)`, `    ID          int PRIMARY KEY,
    FloorID     int REFERENCES Floor(FloorID),
    EquipmentID int REFERENCES Equipment(EquipmentID),
    Quantity    int`),
        GIAI_TAY.replace('WHERE l.CountryID = @countryID;', "WHERE l.CountryID = 'UK';"),
        GIAI_TAY.replace(`    SELECT i.EmployeeID, i.FirstName, i.LastName, i.DepartmentID, d.DepartmentName
    FROM inserted i                                              -- every inserted row, not just one
    JOIN Departments d ON d.DepartmentID = i.DepartmentID;`, `    DECLARE @id INT = (SELECT TOP 1 EmployeeID FROM inserted);
    SELECT e.EmployeeID, e.FirstName, e.LastName, e.DepartmentID, d.DepartmentName
    FROM Employees e JOIN Departments d ON d.DepartmentID = e.DepartmentID WHERE e.EmployeeID = @id;`),
      ],
      gy: [['Q1: one table per entity, the FK on the N side of 1–N, the M–N relationship becomes setup_Equi with a composite key.', 'Q1: mỗi thực thể một bảng, khoá ngoại ở phía N của 1–N, quan hệ M–N thành setup_Equi với khoá ghép.'], ['Q9: read from the inserted pseudo-table; it holds ALL rows of the statement.', 'Q9: đọc từ bảng giả inserted; nó chứa MỌI dòng của câu lệnh.']],
      lhg: [['varchar where the ERD says nvarchar — the structure check of the real exam fails.', 'varchar khi ERD ghi nvarchar — kiểm cấu trúc của đề thật trượt.'], ['A trigger that stores one id in a variable — only one of several inserted rows is shown.', 'Trigger lưu một id vào biến — chỉ hiện một trong nhiều dòng vừa chèn.']],
      gt: ['<p>Exactly the reference answers of the paper (run on SQL Server 2022). In the exam room submit each CREATE statement in its own file, with no GO and no test commands.</p>', '<p>Đúng lời giải mẫu của đề (đã chạy trên SQL Server 2022). Trong phòng thi nộp mỗi lệnh CREATE một tệp, không GO, không lệnh chạy thử.</p>'],
      tn: [tn('OUTPUT parameter', 'tham số đầu ra'), tn('inserted table', 'bảng inserted')],
    }),
  ],
});
