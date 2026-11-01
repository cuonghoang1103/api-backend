/**
 * DBI202 · 6.6 Thực hành Chương 6 — tám dạng truy vấn PE trên FUHCompany: nối bốn bảng, phép chia, tương quan,
 * GROUP BY + HAVING, TOP WITH TIES (SQL Server thật — đề chạy trên máy) và top-N mỗi nhóm, nối ngoài đếm số 0.
 */
import { mod, de, kq, kqAn, ma, tsql, ck, FUH, TN, tn } from './_chung.mjs';

const TOP_VIEW = `CREATE OR ALTER VIEW vLargestDepartments AS
SELECT TOP (1) WITH TIES d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d
JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum, d.depName
ORDER BY COUNT(*) DESC;                        -- TOP … WITH TIES needs the ORDER BY it ties on`;

export default mod('dbi202-on-ch6', '6.6 Practice: SQL queries, PE style', [
  de({
    t: 'Exercise 2 — join four tables: projects in TP Hồ Chí Minh', k: 'MEDIUM', p: 10,
    kn: ['4-table join', 'role alias', 'CONCAT'], tag: ['join', 'pe-style', 'fuhcompany'],
    en: '<p>For every project located in <b>TP Hồ Chí Minh</b>, give the project name, the name of the department that controls it, and its manager written as <code>Name (SSN)</code>.</p>',
    vi: '<p>Với mọi dự án đặt tại <b>TP Hồ Chí Minh</b>, cho tên dự án, tên phòng quản lý nó, và trưởng phòng viết dạng <code>Tên (SSN)</code>.</p>',
    yc: [['Columns: <code>proName, depName, manager</code>.', 'Cột: <code>proName, depName, manager</code>.'], ["Build the text with CONCAT(m.empName, ' (', CAST(m.empSSN AS VARCHAR(20)), ')') — the + operator for strings is SQL Server only. Row order does not matter.", "Dựng chuỗi bằng CONCAT(m.empName, ' (', CAST(m.empSSN AS VARCHAR(20)), ')') — toán tử + cho chuỗi chỉ có ở SQL Server. Thứ tự dòng không quan trọng."]],
    giai: `SELECT p.proName, d.depName,
       CONCAT(m.empName, ' (', CAST(m.empSSN AS VARCHAR(20)), ')') AS manager
FROM tblProject p
JOIN tblLocation   l ON l.locNum = p.locNum        -- to test the city
JOIN tblDepartment d ON d.depNum = p.depNum        -- the controlling department
JOIN tblEmployee   m ON m.empSSN = d.mgrSSN        -- m = the manager (a role of tblEmployee)
WHERE l.locName = N'TP Hồ Chí Minh';`,
    kiem: [kq(['Projects in TP HCM with department and manager', 'Dự án ở TP HCM kèm phòng và trưởng phòng']), kqAn(['A new HCMC project of department 5', 'Dự án mới ở TP HCM của phòng 5'], "INSERT INTO tblProject VALUES (7, N'ProjectG', 2, 5)"), ma(['Joins tblLocation', 'Nối tblLocation'], '\\btblLocation\\b')],
    sai: [
      `SELECT p.proName, d.depName, CONCAT(m.empName, ' (', CAST(m.empSSN AS VARCHAR(20)), ')') AS manager FROM tblProject p JOIN tblLocation l ON l.locNum = p.locNum JOIN tblDepartment d ON d.depNum = p.depNum JOIN tblEmployee m ON m.depNum = d.depNum WHERE l.locName = N'TP Hồ Chí Minh'`,
      `SELECT p.proName, d.depName, CONCAT(m.empName, ' (', CAST(m.empSSN AS VARCHAR(20)), ')') AS manager FROM tblProject p JOIN tblDepartment d ON d.depNum = p.depNum JOIN tblEmployee m ON m.empSSN = d.mgrSSN JOIN tblDepLocation dl ON dl.depNum = d.depNum JOIN tblLocation l ON l.locNum = dl.locNum WHERE l.locName = N'TP Hồ Chí Minh'`,
    ],
    gy: [['Follow the ERD: project → location, project → department, department → manager (tblEmployee via mgrSSN).', 'Đi theo ERD: dự án → địa điểm, dự án → phòng, phòng → trưởng phòng (tblEmployee qua mgrSSN).'], ['The manager is d.mgrSSN = m.empSSN — not every employee of the department.', 'Trưởng phòng là d.mgrSSN = m.empSSN — không phải mọi nhân viên của phòng.']],
    lhg: [['Joining the employee on depNum — every employee of the department becomes a "manager".', 'Nối nhân viên theo depNum — mọi nhân viên của phòng thành "trưởng phòng".'], ["Using the department's locations (tblDepLocation) instead of the project's location.", 'Dùng địa điểm của phòng (tblDepLocation) thay vì địa điểm của dự án.']],
    gt: ['<p>Four tables, three join conditions; the alias m says which role tblEmployee plays. Expected: ProjectB, ProjectD, ProjectF.</p>', '<p>Bốn bảng, ba điều kiện nối; bí danh m nói tblEmployee đóng vai gì. Kết quả: ProjectB, ProjectD, ProjectF.</p>'],
    tn: [TN.join, tn('CONCAT', 'nối chuỗi')],
  }),
  de({
    t: 'Exercise 4 — division: on every project of department 1', k: 'HARD', p: 12,
    kn: ['relational division', 'double NOT EXISTS'], tag: ['division', 'not-exists', 'pe-style', 'fuhcompany'],
    en: '<p>Find the employees who work on <b>every</b> project controlled by department 1.</p>',
    vi: '<p>Tìm các nhân viên làm <b>mọi</b> dự án do phòng 1 quản lý.</p>',
    yc: [['Columns: <code>empSSN, empName</code>.', 'Cột: <code>empSSN, empName</code>.'], ['Must stay right when department 1 gets another project (no hard-coded project numbers). Row order does not matter.', 'Phải vẫn đúng khi phòng 1 có thêm dự án (không ghi cứng số dự án). Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (                      -- there is no project of department 1 …
      SELECT 1 FROM tblProject p
      WHERE p.depNum = 1
        AND NOT EXISTS (                -- … that e does not work on
              SELECT 1 FROM tblWorksOn w
              WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum));`,
    kiem: [kq(['Employees on all department-1 projects', 'Nhân viên làm mọi dự án của phòng 1']), kqAn(['Another employee covers both', 'Thêm người làm cả hai'], 'INSERT INTO tblWorksOn VALUES (30121050002, 2, 5.0)'), kqAn(['Department 1 gets a third project', 'Phòng 1 có dự án thứ ba'], "INSERT INTO tblProject VALUES (7, N'ProjectG', 1, 1); INSERT INTO tblWorksOn VALUES (30121050004, 1, 5.0), (30121050004, 7, 5.0)")],
    sai: [
      `SELECT DISTINCT e.empSSN, e.empName FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN JOIN tblProject p ON p.proNum = w.proNum WHERE p.depNum = 1`,
      `SELECT e.empSSN, e.empName FROM tblEmployee e WHERE e.empSSN IN (SELECT empSSN FROM tblWorksOn WHERE proNum = 1) AND e.empSSN IN (SELECT empSSN FROM tblWorksOn WHERE proNum = 2)`,
    ],
    gy: [['"Every project" = "no project of department 1 that he does not work on".', '"Mọi dự án" = "không có dự án nào của phòng 1 mà anh ta không làm".'], ['Two nested NOT EXISTS; the inner one uses both e and p.', 'Hai NOT EXISTS lồng nhau; cái trong dùng cả e và p.']],
    lhg: [['A plain join with depNum = 1 — that is "at least one project".', 'Phép nối thường với depNum = 1 — đó là "ít nhất một dự án".'], ['Hard-coding projects 1 and 2 — wrong once department 1 has a third project (hidden check).', 'Ghi cứng dự án 1 và 2 — sai khi phòng 1 có dự án thứ ba (kiểm ẩn).']],
    gt: ['<p>Expected on the sample data: Võ Việt Anh (works on ProjectA and ProjectB). Alternative: GROUP BY empSSN HAVING COUNT(DISTINCT proNum) = (SELECT COUNT(*) FROM tblProject WHERE depNum = 1), restricted to department-1 projects.</p>', '<p>Kết quả trên dữ liệu mẫu: Võ Việt Anh (làm ProjectA và ProjectB). Cách khác: GROUP BY empSSN HAVING COUNT(DISTINCT proNum) = (số dự án của phòng 1), chỉ tính dự án của phòng 1.</p>'],
    tn: [TN.exists, tn('relational division', 'phép chia quan hệ')],
  }),
  de({
    t: 'Exercise 5 — correlated: older than their own supervisor', k: 'MEDIUM', p: 9,
    kn: ['correlated subquery', 'self-reference'], tag: ['subquery', 'correlated', 'pe-style', 'fuhcompany'],
    en: '<p>Employees who were born <b>before</b> their own supervisor. Use a correlated subquery that looks up the supervisor\'s birth date.</p>',
    vi: '<p>Nhân viên sinh <b>trước</b> chính người giám sát của mình. Dùng truy vấn con tương quan để tra ngày sinh của người giám sát.</p>',
    yc: [['Columns: <code>empName, empBirthdate</code>.', 'Cột: <code>empName, empBirthdate</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.empName, e.empBirthdate
FROM tblEmployee e
WHERE e.empBirthdate < (SELECT s.empBirthdate          -- the supervisor of THIS employee
                        FROM tblEmployee s
                        WHERE s.empSSN = e.supervisorSSN);`,
    kiem: [kq(['Older than their supervisor', 'Lớn tuổi hơn người giám sát']), kqAn(['A senior hire under a young supervisor', 'Một người lớn tuổi dưới quyền người trẻ'], "INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050100, N'Cao Văn Thọ', 50000, 'M', '1960-01-01', 3, 30121050021)"), ma(['Uses a subquery', 'Dùng truy vấn con'], '\\(\\s*SELECT\\b')],
    sai: [`SELECT e.empName, e.empBirthdate FROM tblEmployee e WHERE e.empBirthdate < (SELECT MIN(s.empBirthdate) FROM tblEmployee s WHERE s.empSSN IN (SELECT supervisorSSN FROM tblEmployee))`, `SELECT e.empName, e.empBirthdate FROM tblEmployee e WHERE e.empBirthdate > (SELECT s.empBirthdate FROM tblEmployee s WHERE s.empSSN = e.supervisorSSN)`],
    gy: [['The inner query must refer to e.supervisorSSN — that is the correlation.', 'Truy vấn trong phải nhắc tới e.supervisorSSN — đó là tương quan.'], ['An earlier birth date = older.', 'Ngày sinh sớm hơn = lớn tuổi hơn.']],
    lhg: [['Comparing with "the oldest supervisor" — not the employee\'s own supervisor.', 'So với "người giám sát lớn tuổi nhất" — không phải người giám sát của chính nhân viên đó.'], ['Using &gt; — that finds the younger ones.', 'Dùng &gt; — đó là tìm người trẻ hơn.']],
    gt: ['<p>Expected: Đặng Tuấn Anh (born 1970, supervised by Phạm Quốc Bảo, born 1978). The director has no supervisor: the subquery returns no row ⇒ NULL ⇒ UNKNOWN ⇒ excluded; Phan Hữu Nghĩa has no birth date ⇒ also UNKNOWN.</p>', '<p>Kết quả: Đặng Tuấn Anh (sinh 1970, do Phạm Quốc Bảo sinh 1978 giám sát). Giám đốc không có người giám sát: truy vấn con không trả dòng ⇒ NULL ⇒ UNKNOWN ⇒ bị loại; Phan Hữu Nghĩa không có ngày sinh ⇒ cũng UNKNOWN.</p>'],
    tn: [TN.correlated],
  }),
  de({
    t: 'Exercise 6 — GROUP BY + HAVING with a join: busy projects', k: 'MEDIUM', p: 9,
    kn: ['GROUP BY', 'HAVING', 'join'], tag: ['group-by', 'having', 'pe-style', 'fuhcompany'],
    en: '<p>Projects whose staff together work <b>more than 50 hours</b> a week, with the location name and the total hours.</p>',
    vi: '<p>Các dự án mà tổng giờ làm của nhân viên <b>trên 50 giờ</b> mỗi tuần, kèm tên địa điểm và tổng giờ.</p>',
    yc: [['Columns: <code>proName, locName, totalHours</code>.', 'Cột: <code>proName, locName, totalHours</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT p.proName, l.locName, SUM(w.workHours) AS totalHours
FROM tblProject p
JOIN tblLocation l ON l.locNum = p.locNum
JOIN tblWorksOn  w ON w.proNum = p.proNum
GROUP BY p.proNum, p.proName, l.locName        -- every non-aggregated column of SELECT
HAVING SUM(w.workHours) > 50;`,
    kiem: [kq(['Busy projects', 'Dự án bận']), kqAn(['ProjectF gets help', 'ProjectF có thêm người'], 'INSERT INTO tblWorksOn VALUES (30121050037, 6, 15.0)'), ma(['Uses HAVING', 'Dùng HAVING'], '\\bHAVING\\b')],
    sai: [`SELECT p.proName, l.locName, SUM(w.workHours) AS totalHours FROM tblProject p JOIN tblLocation l ON l.locNum = p.locNum JOIN tblWorksOn w ON w.proNum = p.proNum WHERE w.workHours > 50 GROUP BY p.proNum, p.proName, l.locName`, `SELECT p.proName, l.locName, SUM(w.workHours) AS totalHours FROM tblProject p JOIN tblLocation l ON l.locNum = p.locNum JOIN tblWorksOn w ON w.proNum = p.proNum GROUP BY p.proNum, p.proName, l.locName HAVING SUM(w.workHours) >= 50`],
    gy: [['The test is on the SUM of a group ⇒ HAVING.', 'Phép thử trên TỔNG của nhóm ⇒ HAVING.'], ['Group by the project (its key) plus every other selected column.', 'Gộp theo dự án (khoá của nó) cộng mọi cột được chọn khác.']],
    lhg: [['WHERE workHours &gt; 50 — tests each row, nobody works 50 hours alone.', 'WHERE workHours &gt; 50 — kiểm từng dòng, không ai một mình làm 50 giờ.'], ['&gt;= 50 instead of &gt; 50 — ProjectD (exactly 50) slips in.', '&gt;= 50 thay vì &gt; 50 — ProjectD (đúng 50) lọt vào.']],
    gt: ['<p>Expected: ProjectA (60), ProjectB (67.5), ProjectC (80), ProjectE (85). ProjectD has exactly 50 — not "more than 50".</p>', '<p>Kết quả: ProjectA (60), ProjectB (67.5), ProjectC (80), ProjectE (85). ProjectD đúng 50 — không "trên 50".</p>'],
    tn: [TN.groupBy, TN.having],
  }),
  de({
    t: 'Exercise 7b — top 2 earners of each department (window function)', k: 'HARD', p: 12,
    kn: ['top-N per group', 'ROW_NUMBER() OVER (PARTITION BY …)'], tag: ['window-function', 'top-n', 'pe-style', 'fuhcompany'],
    en: '<p>List the <b>two best-paid employees of each department</b>. TOP n works on the whole result, so number the rows inside each department with <code>ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC)</code> and keep the first two.</p>',
    vi: '<p>Liệt kê <b>hai nhân viên lương cao nhất của mỗi phòng</b>. TOP n áp cho cả kết quả, nên đánh số dòng trong từng phòng bằng <code>ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC)</code> rồi giữ hai dòng đầu.</p>',
    yc: [['Columns: <code>depNum, empName, empSalary</code>.', 'Cột: <code>depNum, empName, empSalary</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT depNum, empName, empSalary
FROM (SELECT depNum, empName, empSalary,
             ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS rn
      FROM tblEmployee) AS t
WHERE rn <= 2;`,
    kiem: [kq(['Two best-paid per department', 'Hai người lương cao nhất mỗi phòng']), kqAn(['A new top earner in department 3', 'Người lương cao mới ở phòng 3'], "INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050101, N'Hứa Văn Đạt', 99000, 3)"), ma(['Uses PARTITION BY', 'Dùng PARTITION BY'], '\\bPARTITION\\s+BY\\b|\\(\\s*SELECT\\s+COUNT')],
    sai: [`SELECT depNum, empName, empSalary FROM (SELECT depNum, empName, empSalary, ROW_NUMBER() OVER (ORDER BY empSalary DESC) AS rn FROM tblEmployee) AS t WHERE rn <= 2`, `SELECT depNum, empName, empSalary FROM (SELECT depNum, empName, empSalary, ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary) AS rn FROM tblEmployee) AS t WHERE rn <= 2`],
    gy: [['PARTITION BY restarts the numbering in every department.', 'PARTITION BY đánh số lại từ đầu ở mỗi phòng.'], ['Filter rn &lt;= 2 in the OUTER query — a window function cannot appear in WHERE.', 'Lọc rn &lt;= 2 ở truy vấn NGOÀI — hàm cửa sổ không đứng trong WHERE được.']],
    lhg: [['No PARTITION BY — the two best-paid of the whole company.', 'Không PARTITION BY — hai người lương cao nhất cả công ty.'], ['ORDER BY empSalary ascending — the two lowest-paid.', 'ORDER BY empSalary tăng dần — hai người lương thấp nhất.']],
    gt: ['<p>ROW_NUMBER breaks ties arbitrarily; use RANK() to keep everybody tied for 2nd place. The portable alternative without window functions: WHERE (SELECT COUNT(*) FROM tblEmployee x WHERE x.depNum = e.depNum AND x.empSalary &gt; e.empSalary) &lt; 2.</p>', '<p>ROW_NUMBER phá hoà tuỳ ý; dùng RANK() để giữ mọi người đồng hạng 2. Cách không dùng hàm cửa sổ: WHERE (SELECT COUNT(*) … lương cao hơn trong cùng phòng) &lt; 2.</p>'],
    tn: [tn('window function', 'hàm cửa sổ')],
  }),
  tsql({
    t: 'Exercise 7a — the largest department(s) with TOP 1 WITH TIES', k: 'MEDIUM', p: 12,
    kn: ['TOP … WITH TIES', 'view with TOP'], tag: ['top', 'pe-style', 'fuhcompany'],
    lyDo: ['TOP … WITH TIES is SQL Server syntax (PostgreSQL writes FETCH FIRST … WITH TIES), so it is checked on a real SQL Server.', 'TOP … WITH TIES là cú pháp SQL Server (PostgreSQL viết FETCH FIRST … WITH TIES) nên được kiểm trên SQL Server thật.'],
    en: '<p>Create a view <code>vLargestDepartments(depNum, depName, numEmployees)</code> showing the department(s) with the most employees — <b>all</b> departments tied for first place. On FUHCompany departments 1 and 2 both have 4 employees.</p>',
    vi: '<p>Tạo view <code>vLargestDepartments(depNum, depName, numEmployees)</code> hiện (các) phòng đông nhân viên nhất — <b>mọi</b> phòng đồng hạng nhất. Trên FUHCompany phòng 1 và 2 cùng có 4 người.</p>',
    yc: [['CREATE OR ALTER VIEW vLargestDepartments AS SELECT TOP (1) WITH TIES …', 'CREATE OR ALTER VIEW vLargestDepartments AS SELECT TOP (1) WITH TIES …'], ['The ORDER BY inside the view is allowed only because of TOP.', 'ORDER BY trong view chỉ được phép vì có TOP.']],
    setup: FUH,
    khoi: `-- CREATE OR ALTER VIEW vLargestDepartments AS
-- SELECT TOP (1) WITH TIES ...
`,
    giai: TOP_VIEW,
    kiem: [
      ck(['Both departments 1 and 2 (4 employees each)', 'Cả phòng 1 và 2 (mỗi phòng 4 người)'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.vLargestDepartments) = 2 AND NOT EXISTS (SELECT 1 FROM dbo.vLargestDepartments WHERE depNum NOT IN (1, 2) OR numEmployees <> 4), 1, 0);
SET @info = CONCAT(N'view returned: ', (SELECT STRING_AGG(CONCAT(depNum, N'=', numEmployees), N', ') FROM dbo.vLargestDepartments));`),
      ck(['After a hire in department 2 only department 2 remains', 'Sau khi phòng 2 tuyển thêm, chỉ còn phòng 2'], `BEGIN TRAN;
INSERT INTO dbo.tblEmployee (empSSN, empName, depNum) VALUES (30121050102, N'Mới', 2);
SET @ok = IIF((SELECT COUNT(*) FROM dbo.vLargestDepartments) = 1 AND (SELECT depNum FROM dbo.vLargestDepartments) = 2 AND (SELECT numEmployees FROM dbo.vLargestDepartments) = 5, 1, 0);
SET @info = CONCAT(N'view returned: ', (SELECT STRING_AGG(CONCAT(depNum, N'=', numEmployees), N', ') FROM dbo.vLargestDepartments));
ROLLBACK;`),
      ck(['Three-way tie after a hire in department 3', 'Ba phòng đồng hạng sau khi phòng 3 tuyển thêm'], `BEGIN TRAN;
INSERT INTO dbo.tblEmployee (empSSN, empName, depNum) VALUES (30121050103, N'A', 3);
SET @ok = IIF((SELECT COUNT(*) FROM dbo.vLargestDepartments) = 3, 1, 0);
SET @info = CONCAT(N'rows: ', (SELECT COUNT(*) FROM dbo.vLargestDepartments), N' (expected 3: departments 1, 2 and 3 with 4 employees each)');
ROLLBACK;`),
    ],
    saiTay: [TOP_VIEW.replace('TOP (1) WITH TIES', 'TOP (1)'), TOP_VIEW.replace('ORDER BY COUNT(*) DESC;', 'ORDER BY COUNT(*);')],
    gy: [['TOP (1) keeps one row; WITH TIES also keeps every row equal to it on the ORDER BY key.', 'TOP (1) giữ một dòng; WITH TIES giữ thêm mọi dòng bằng nó theo khoá ORDER BY.'], ['ORDER BY COUNT(*) DESC — the largest first.', 'ORDER BY COUNT(*) DESC — lớn nhất trước.']],
    lhg: [['TOP 1 without WITH TIES — one of the tied departments silently disappears (which one is not even defined).', 'TOP 1 không WITH TIES — một phòng đồng hạng lặng lẽ biến mất (mà không biết là phòng nào).'], ['ORDER BY ascending — the smallest department.', 'ORDER BY tăng dần — phòng nhỏ nhất.']],
    gt: ['<p>Portable alternative (the PE accepts both): HAVING COUNT(*) &gt;= ALL (SELECT COUNT(*) FROM tblEmployee GROUP BY depNum).</p>', '<p>Cách viết chạy mọi hệ (PE nhận cả hai): HAVING COUNT(*) &gt;= ALL (SELECT COUNT(*) FROM tblEmployee GROUP BY depNum).</p>'],
    tn: [tn('TOP … WITH TIES', 'lấy n dòng đầu kèm dòng đồng hạng')],
  }),
  de({
    t: 'Exercise 8 — outer join that counts zeros: dependents per employee', k: 'MEDIUM', p: 9,
    kn: ['LEFT JOIN', 'COUNT(column)'], tag: ['outer-join', 'group-by', 'pe-style', 'fuhcompany'],
    en: '<p>Every employee of departments 1 and 2 with the number of dependents — 0 for those who have none.</p>',
    vi: '<p>Mọi nhân viên phòng 1 và 2 kèm số người phụ thuộc — 0 với người không có.</p>',
    yc: [['Columns: <code>empSSN, empName, dependents</code>.', 'Cột: <code>empSSN, empName, dependents</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.empSSN, e.empName, COUNT(d.depName) AS dependents     -- NULL padding not counted
FROM tblEmployee e
LEFT JOIN tblDependent d ON d.empSSN = e.empSSN
WHERE e.depNum IN (1, 2)
GROUP BY e.empSSN, e.empName;`,
    kiem: [kq(['Dependents per employee, zeros included', 'Số người phụ thuộc mỗi người, có cả 0']), kqAn(['A new dependent', 'Thêm một người phụ thuộc'], "INSERT INTO tblDependent VALUES (N'Võ Gia Bảo', 30121050003, 'M', '2022-02-02', N'Con trai')"), ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [`SELECT e.empSSN, e.empName, COUNT(*) AS dependents FROM tblEmployee e LEFT JOIN tblDependent d ON d.empSSN = e.empSSN WHERE e.depNum IN (1, 2) GROUP BY e.empSSN, e.empName`, `SELECT e.empSSN, e.empName, COUNT(d.depName) AS dependents FROM tblEmployee e JOIN tblDependent d ON d.empSSN = e.empSSN WHERE e.depNum IN (1, 2) GROUP BY e.empSSN, e.empName`],
    gy: [['LEFT JOIN keeps employees with no dependent.', 'LEFT JOIN giữ nhân viên không có người phụ thuộc.'], ['COUNT(d.depName), not COUNT(*).', 'COUNT(d.depName), không phải COUNT(*).']],
    lhg: [['COUNT(*) — everyone without dependents gets 1.', 'COUNT(*) — ai không có người phụ thuộc cũng thành 1.'], ['INNER JOIN — the zeros disappear.', 'INNER JOIN — các số 0 biến mất.']],
    gt: ['<p>Expected: 001 → 2, 002 → 1, 010 → 1, the other five → 0.</p>', '<p>Kết quả: 001 → 2, 002 → 1, 010 → 1, năm người còn lại → 0.</p>'],
    tn: [TN.leftJoin],
  }),
]);
