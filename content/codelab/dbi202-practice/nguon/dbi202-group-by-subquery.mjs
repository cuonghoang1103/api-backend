/**
 * DBI202 · 6.3 — Hàm gộp, GROUP BY, HAVING; đếm có LEFT JOIN; lớn nhất theo nhóm (có hoà); AVG số nguyên kiểu SQL Server.
 * CSDL: FUHCompany. Bài giảng: dbi202-group-by-subquery.
 */
import { doiDau, KHOA, sql, kq, kqAn, ma, TN } from './_chung.mjs';

const THEM = `INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES (6, N'Phòng Đào tạo', NULL, NULL);
INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', NULL, 61000, 'M', '1994-02-02', 3, 30121050020),
 (30121050096, N'Đinh Thị Hoa', NULL, 47000, 'F', '1997-07-07', 5, 30121050037),
 (30121050097, N'Lạc Văn Phúc', NULL, 99000, 'M', '1979-01-01', 4, 30121050030);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 5, 10.0), (30121050096, 6, 5.0), (30121050037, 1, 7.5)`;

export default doiDau({
  slug: 'dbi202-group-by-subquery',
  ten: '6.3 Aggregation: GROUP BY and HAVING',
  khoa: KHOA,
  baiHoc: 'dbi202-group-by-subquery',
  de: [
    sql({
      tieuDe: 'Company payroll in one row',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'], the: ['aggregate', 'fuhcompany'],
      moTa: {
        en: '<p>One summary row for the whole company: number of employees, total salary, average salary, lowest and highest salary.</p>',
        vi: '<p>Một dòng tổng hợp cho cả công ty: số nhân viên, tổng lương, lương trung bình, lương thấp nhất và cao nhất.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>NumEmployees</code>, <code>TotalSalary</code>, <code>AvgSalary</code>, <code>MinSalary</code>, <code>MaxSalary</code>.', 'Exactly one row.'],
        vi: ['Cột: <code>NumEmployees</code>, <code>TotalSalary</code>, <code>AvgSalary</code>, <code>MinSalary</code>, <code>MaxSalary</code>.', 'Đúng một dòng.'],
      },
      giai: `SELECT COUNT(*)       AS NumEmployees,
       SUM(empSalary) AS TotalSalary,
       AVG(empSalary) AS AvgSalary,   -- empSalary is DECIMAL ⇒ the average keeps its decimals
       MIN(empSalary) AS MinSalary,
       MAX(empSalary) AS MaxSalary
FROM tblEmployee;`,
      kiem: [kq('The five figures'), kqAn('After hiring three people', THEM), ma('Uses aggregate functions', '\\bCOUNT\\s*\\(|\\bSUM\\s*\\(')],
      saiMau: ['SELECT COUNT(empAddress) AS NumEmployees, SUM(empSalary) AS TotalSalary, AVG(empSalary) AS AvgSalary, MIN(empSalary) AS MinSalary, MAX(empSalary) AS MaxSalary FROM tblEmployee'],
      goiY: ['Aggregate functions turn all rows into one value: COUNT(*), SUM(col), AVG(col), MIN(col), MAX(col).', 'Without GROUP BY the whole table is one group ⇒ one row.'],
      loiHayGap: [
        { en: 'COUNT(column) instead of COUNT(*) — COUNT(col) skips NULLs (COUNT(empAddress) = 13, not 14).', vi: 'COUNT(cột) thay vì COUNT(*) — COUNT(cột) bỏ qua NULL (COUNT(empAddress) = 13, không phải 14).' },
        { en: 'Mixing a plain column (empName) with aggregates and no GROUP BY — error on both SQL Server and PostgreSQL.', vi: 'Trộn cột thường (empName) với hàm gộp mà không GROUP BY — lỗi trên cả SQL Server lẫn PostgreSQL.' },
      ],
      giaiThich: { en: '<p>Aggregates ignore NULL inputs (except COUNT(*)). AVG of a DECIMAL column keeps decimals; on SQL Server it is shown with 6 decimal places (73214.285714).</p>', vi: '<p>Hàm gộp bỏ qua NULL (trừ COUNT(*)). AVG của cột DECIMAL giữ phần lẻ; SQL Server hiện 6 chữ số lẻ (73214.285714).</p>' },
      thuatNgu: [TN.aggregate, TN.null],
    }),
    sql({
      tieuDe: 'Headcount per department',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['GROUP BY', 'COUNT per group'], the: ['group-by', 'fuhcompany'],
      moTa: {
        en: '<p>How many employees does each department have? Use the department number stored in tblEmployee.</p>',
        vi: '<p>Mỗi phòng có bao nhiêu nhân viên? Dùng số phòng lưu trong tblEmployee.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>NumEmployees</code>.', 'Sorted by depNum ascending — order is checked.'],
        vi: ['Cột: <code>depNum</code>, <code>NumEmployees</code>.', 'Sắp theo depNum tăng — máy chấm kiểm thứ tự.'],
      },
      giai: `SELECT depNum, COUNT(*) AS NumEmployees
FROM tblEmployee
GROUP BY depNum
ORDER BY depNum;`,
      kiem: [kq('Headcount by department', { thuTu: true }), kqAn('After hiring', THEM, { thuTu: true }), ma('Uses GROUP BY', '\\bGROUP\\s+BY\\b')],
      saiMau: ['SELECT depNum, COUNT(*) AS NumEmployees FROM tblEmployee GROUP BY depNum ORDER BY NumEmployees'],
      goiY: ['GROUP BY depNum makes one group per department number.', 'COUNT(*) then counts the rows of each group.'],
      loiHayGap: [
        { en: 'Forgetting ORDER BY — GROUP BY does not sort the result on every engine.', vi: 'Quên ORDER BY — GROUP BY không bảo đảm sắp xếp kết quả.' },
        { en: 'Grouping by empSSN — every employee becomes a group of one.', vi: 'GROUP BY empSSN — mỗi nhân viên thành một nhóm một người.' },
      ],
      giaiThich: { en: '<p>GROUP BY partitions the rows; each partition becomes one output row, so the SELECT list may only contain grouping columns and aggregates.</p>', vi: '<p>GROUP BY chia các dòng thành nhóm; mỗi nhóm thành một dòng kết quả, nên SELECT chỉ được chứa cột gộp nhóm và hàm gộp.</p>' },
      thuatNgu: [TN.groupBy, TN.aggregate],
    }),
    sql({
      tieuDe: 'Headcount and average salary with department names',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['GROUP BY several columns', 'join + aggregate', 'non-aggregated columns rule'], the: ['group-by', 'join', 'fuhcompany'],
      moTa: {
        en: '<p>Extend the headcount report with the department <b>name</b> and the <b>average salary</b> of each department.</p>',
        vi: '<p>Mở rộng báo cáo số người: thêm <b>tên</b> phòng và <b>lương trung bình</b> của từng phòng.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>depName</code>, <code>NumEmployees</code>, <code>AvgSalary</code>.', 'Every non-aggregated column must be in GROUP BY (SQL Server enforces it — so does this grader).', 'Row order does not matter.'],
        vi: ['Cột: <code>depNum</code>, <code>depName</code>, <code>NumEmployees</code>, <code>AvgSalary</code>.', 'Mọi cột không gộp phải có trong GROUP BY (SQL Server bắt buộc — máy chấm này cũng vậy).', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT d.depNum, d.depName,
       COUNT(*)         AS NumEmployees,
       AVG(e.empSalary) AS AvgSalary
FROM tblDepartment d
JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum, d.depName;   -- depName is not aggregated ⇒ it must be grouped too`,
      kiem: [kq('Per department: name, headcount, average salary'), kqAn('After hiring', THEM), ma('Groups by the name as well', '\\bGROUP\\s+BY\\b[^;]*depName')],
      saiMau: ['SELECT d.depNum, d.depName, COUNT(*) AS NumEmployees, AVG(e.empSalary) AS AvgSalary FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum'],
      goiY: ['Join tblDepartment and tblEmployee, then GROUP BY.', 'depName is in the SELECT list without an aggregate ⇒ add it to GROUP BY.'],
      loiHayGap: [
        { en: 'GROUP BY d.depNum only — SQL Server: "Column \'tblDepartment.depName\' is invalid in the select list…" (Msg 8120). PostgreSQL would accept it because depNum is the primary key — this grader is strict like SQL Server.', vi: 'Chỉ GROUP BY d.depNum — SQL Server báo Msg 8120. PostgreSQL thì cho qua vì depNum là khoá chính — máy chấm này chặt như SQL Server.' },
        { en: 'Counting with COUNT(d.depNum) after a LEFT JOIN — counts the department row even when it has no employee.', vi: 'Đếm COUNT(d.depNum) sau LEFT JOIN — đếm cả dòng phòng không có nhân viên.' },
      ],
      giaiThich: { en: '<p>Rule of thumb: every column in SELECT is either inside an aggregate or listed in GROUP BY. Adding depName to GROUP BY does not change the groups (it depends on depNum) but makes the query legal everywhere.</p>', vi: '<p>Quy tắc: mỗi cột trong SELECT hoặc nằm trong hàm gộp, hoặc có trong GROUP BY. Thêm depName vào GROUP BY không đổi các nhóm (vì nó phụ thuộc depNum) nhưng làm câu hợp lệ ở mọi hệ.</p>' },
      thuatNgu: [TN.groupBy, { en: 'functional dependency', vi: 'phụ thuộc hàm', giaiThich: 'depNum → depName: biết số phòng là biết tên phòng.' }],
    }),
    sql({
      tieuDe: 'Departments with an average salary above 80,000',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['HAVING', 'WHERE vs HAVING'], the: ['having', 'fuhcompany'],
      moTa: {
        en: '<p>Which departments pay on average <b>more than 80,000</b>? Show the department number and its average salary.</p>',
        vi: '<p>Phòng nào trả lương trung bình <b>trên 80.000</b>? Hiện số phòng và lương trung bình.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>AvgSalary</code>.', 'Row order does not matter.'],
        vi: ['Cột: <code>depNum</code>, <code>AvgSalary</code>.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT depNum, AVG(empSalary) AS AvgSalary
FROM tblEmployee
GROUP BY depNum
HAVING AVG(empSalary) > 80000;   -- a condition on a GROUP ⇒ HAVING (WHERE cannot see aggregates)`,
      kiem: [kq('Departments averaging > 80,000'), kqAn('After hiring', THEM), ma('Uses HAVING', '\\bHAVING\\b')],
      saiMau: ['SELECT depNum, AVG(empSalary) AS AvgSalary FROM tblEmployee WHERE empSalary > 80000 GROUP BY depNum'],
      goiY: ['WHERE filters rows before grouping; HAVING filters groups after grouping.', 'Repeat the aggregate in HAVING: HAVING AVG(empSalary) > 80000 (the alias is not visible there on SQL Server).'],
      loiHayGap: [
        { en: 'WHERE empSalary > 80000 — computes the average of the high earners only, a different question.', vi: 'WHERE empSalary > 80000 — tính trung bình của riêng người lương cao, là câu hỏi khác.' },
        { en: 'HAVING AvgSalary > 80000 — the SELECT alias is not visible in HAVING (both SQL Server and PostgreSQL reject it).', vi: 'HAVING AvgSalary > 80000 — bí danh của SELECT không dùng được trong HAVING (cả hai hệ đều báo lỗi).' },
      ],
      giaiThich: { en: '<p>Order of evaluation: FROM → WHERE (rows) → GROUP BY → HAVING (groups) → SELECT. Departments 1 (86,250) and 2 (81,750) qualify.</p>', vi: '<p>Thứ tự: FROM → WHERE (dòng) → GROUP BY → HAVING (nhóm) → SELECT. Phòng 1 (86.250) và 2 (81.750) thoả.</p>' },
      thuatNgu: [TN.having, TN.where],
    }),
    sql({
      tieuDe: 'Total hours per employee, zero for the idle',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['LEFT JOIN + SUM', 'COALESCE', 'COUNT(col) vs COUNT(*)'], the: ['group-by', 'left-join', 'coalesce', 'fuhcompany'],
      moTa: {
        en: '<p>For <b>every</b> employee show how many projects they work on and their total hours. Employees on no project show <b>0 projects and 0 hours</b> (not NULL).</p>',
        vi: '<p>Với <b>mọi</b> nhân viên, hiện số dự án đang tham gia và tổng số giờ. Người không có dự án hiện <b>0 dự án và 0 giờ</b> (không phải NULL).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>NumProjects</code>, <code>TotalHours</code>.', 'Sorted by empSSN — order is checked.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>NumProjects</code>, <code>TotalHours</code>.', 'Sắp theo empSSN — máy chấm kiểm thứ tự.'],
      },
      giai: `SELECT e.empSSN, e.empName,
       COUNT(w.proNum)                AS NumProjects,   -- COUNT(col) ignores the NULL of the padded row ⇒ 0
       COALESCE(SUM(w.workHours), 0)  AS TotalHours     -- SUM over nothing is NULL ⇒ turn it into 0
FROM tblEmployee e
LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
GROUP BY e.empSSN, e.empName
ORDER BY e.empSSN;`,
      kiem: [kq('Projects and hours for everyone', { thuTu: true }), kqAn('After new assignments', THEM, { thuTu: true }), ma('Uses COALESCE for the zero', '\\bCOALESCE\\s*\\(')],
      saiMau: [
        'SELECT e.empSSN, e.empName, COUNT(*) AS NumProjects, COALESCE(SUM(w.workHours), 0) AS TotalHours FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN GROUP BY e.empSSN, e.empName ORDER BY e.empSSN',
        'SELECT e.empSSN, e.empName, COUNT(w.proNum) AS NumProjects, COALESCE(SUM(w.workHours), 0) AS TotalHours FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN GROUP BY e.empSSN, e.empName ORDER BY e.empSSN',
      ],
      goiY: ['LEFT JOIN keeps employees without assignments (their tblWorksOn columns are NULL).', 'COUNT(w.proNum) counts only real assignments; COALESCE(SUM(…), 0) turns "no hours" into 0.'],
      loiHayGap: [
        { en: 'COUNT(*) after a LEFT JOIN — counts the NULL-padded row, so idle employees show 1 project.', vi: 'COUNT(*) sau LEFT JOIN — đếm cả dòng NULL đệm, người không có dự án hiện 1 dự án.' },
        { en: 'INNER JOIN — idle employees (037, 038) vanish.', vi: 'INNER JOIN — người không có dự án (037, 038) biến mất.' },
        { en: 'ISNULL(SUM(…), 0) — T-SQL only; COALESCE is standard.', vi: 'ISNULL(SUM(…), 0) — chỉ T-SQL; COALESCE là chuẩn.' },
      ],
      giaiThich: { en: '<p>Outer join + aggregate is the standard way to report "including zero". The two traps are COUNT(*) (counts the padded row) and SUM of no rows (NULL, not 0).</p>', vi: '<p>Outer join + hàm gộp là cách chuẩn để báo cáo "kể cả số 0". Hai bẫy: COUNT(*) (đếm cả dòng đệm) và SUM của không dòng nào (NULL, không phải 0).</p>' },
      thuatNgu: [TN.leftJoin, { en: 'COALESCE(a, b)', vi: 'giá trị khác NULL đầu tiên' }, TN.aggregate],
    }),
    sql({
      tieuDe: 'The largest department(s) — ties included',
      doKho: 'HARD', phut: 14,
      khaiNiem: ['maximum of an aggregate', 'subquery in HAVING', 'ties'], the: ['group-by', 'having', 'subquery', 'fuhcompany'],
      moTa: {
        en: '<p>Find the department(s) with the <b>most employees</b>. If several departments tie for first place, list them all.</p>',
        vi: '<p>Tìm (các) phòng có <b>nhiều nhân viên nhất</b>. Nếu nhiều phòng cùng hạng nhất thì liệt kê tất cả.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>depName</code>, <code>NumEmployees</code>.', 'Do not hard-code the number 4; do not use TOP/LIMIT (they cut ties).', 'Row order does not matter.'],
        vi: ['Cột: <code>depNum</code>, <code>depName</code>, <code>NumEmployees</code>.', 'Không chép cứng số 4; không dùng TOP/LIMIT (cắt mất phòng hoà).', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT d.depNum, d.depName, COUNT(*) AS NumEmployees
FROM tblDepartment d
JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum, d.depName
HAVING COUNT(*) >= ALL (SELECT COUNT(*)            -- at least as large as every department
                        FROM tblEmployee
                        WHERE depNum IS NOT NULL
                        GROUP BY depNum);`,
      kiem: [kq('Departments with the maximum headcount'), kqAn('After hiring the winner changes', THEM + `;
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (30121050098, N'Mạc Thị Na', 51000, 'F', 3)`), ma('No hard-coded 4', '(=|>=|>)\\s*4\\b', true)],
      saiMau: [
        'SELECT d.depNum, d.depName, COUNT(*) AS NumEmployees FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum, d.depName HAVING COUNT(*) = 4',
        'SELECT d.depNum, d.depName, COUNT(*) AS NumEmployees FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum, d.depName ORDER BY COUNT(*) DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY',
      ],
      goiY: ['First compute the headcount of every department; the answer is the group(s) whose count equals the largest of those counts.', 'HAVING COUNT(*) >= ALL (SELECT COUNT(*) … GROUP BY depNum) — or compare with MAX over a derived table.'],
      loiHayGap: [
        { en: 'TOP 1 / FETCH NEXT 1 ROW — returns one department and silently drops the tie (departments 1 and 2 both have 4).', vi: 'TOP 1 / FETCH NEXT 1 ROW — chỉ ra một phòng, âm thầm bỏ phòng hoà (phòng 1 và 2 cùng 4 người).' },
        { en: 'MAX(COUNT(*)) — aggregates cannot be nested directly; compute counts in a subquery first.', vi: 'MAX(COUNT(*)) — không lồng hàm gộp trực tiếp được; tính số đếm trong truy vấn con trước.' },
        { en: 'Hard-coding HAVING COUNT(*) = 4 — the hidden check hires a 5th person into department 3.', vi: 'Chép cứng HAVING COUNT(*) = 4 — kiểm ẩn tuyển thêm người vào phòng 3.' },
      ],
      giaiThich: { en: '<p>"Maximum per group with ties" is a PE classic (Q6/Q7 of the real papers). Portable patterns: <code>&gt;= ALL (subquery)</code>, or <code>= (SELECT MAX(c) FROM (…) t)</code>. TOP/FETCH cut ties unless you add WITH TIES (SQL Server only).</p>', vi: '<p>"Lớn nhất theo nhóm, có hoà" là dạng kinh điển của PE (Q6/Q7 đề thật). Cách chạy mọi hệ: <code>&gt;= ALL (truy vấn con)</code>, hoặc <code>= (SELECT MAX(c) FROM (…) t)</code>. TOP/FETCH cắt mất dòng hoà nếu không có WITH TIES (chỉ SQL Server).</p>' },
      thuatNgu: [TN.having, TN.subquery, { en: '>= ALL', vi: 'lớn hơn hoặc bằng mọi giá trị của truy vấn con' }],
    }),
    sql({
      tieuDe: 'Average projects per person — integer AVG like SQL Server',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['AVG on integers', 'CAST to DECIMAL', 'derived table', 'ROUND'], the: ['aggregate', 'avg', 'derived-table', 'fuhcompany'],
      moTa: {
        en: '<p>Among employees who work on at least one project, how many projects does a person work on on average? Return <b>two</b> numbers: <code>AvgInt</code> = plain AVG of the per-person counts (SQL Server truncates it to an integer because COUNT returns INT) and <code>AvgExact</code> = the real average, computed after casting the count to DECIMAL(10,2) and rounded to 2 decimals.</p>',
        vi: '<p>Trong số nhân viên có ít nhất một dự án, trung bình mỗi người làm bao nhiêu dự án? Trả <b>hai</b> số: <code>AvgInt</code> = AVG trơn trên số dự án mỗi người (SQL Server cắt thành số nguyên vì COUNT trả INT) và <code>AvgExact</code> = trung bình thật, ép số đếm sang DECIMAL(10,2) rồi mới AVG, làm tròn 2 chữ số.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>AvgInt</code>, <code>AvgExact</code>.', 'Compute the per-employee counts in a derived table (subquery in FROM) with an alias.', 'One row.'],
        vi: ['Cột: <code>AvgInt</code>, <code>AvgExact</code>.', 'Tính số dự án mỗi người trong bảng dẫn xuất (truy vấn con trong FROM) có bí danh.', 'Một dòng.'],
      },
      giai: `SELECT AVG(c.NumProjects)                                  AS AvgInt,     -- INT average ⇒ 16 / 12 = 1
       ROUND(AVG(CAST(c.NumProjects AS DECIMAL(10,2))), 2)   AS AvgExact    -- 1.33
FROM (SELECT empSSN, COUNT(*) AS NumProjects
      FROM tblWorksOn
      GROUP BY empSSN) AS c;   -- a derived table MUST have an alias on SQL Server`,
      kiem: [kq('AvgInt and AvgExact'), kqAn('After new assignments', THEM), ma('Casts before averaging', '\\bCAST\\s*\\([^)]*\\bAS\\s+(DECIMAL|NUMERIC)')],
      saiMau: ['SELECT AVG(c.NumProjects) AS AvgInt, ROUND(AVG(c.NumProjects), 2) AS AvgExact FROM (SELECT empSSN, COUNT(*) AS NumProjects FROM tblWorksOn GROUP BY empSSN) AS c'],
      goiY: ['Step 1: SELECT empSSN, COUNT(*) … GROUP BY empSSN gives one count per person. Step 2: average those counts in an outer query.', 'AVG of an INT column returns INT on SQL Server (truncated). CAST(x AS DECIMAL(10,2)) first to keep decimals.'],
      loiHayGap: [
        { en: 'AVG(NumProjects) and expecting 1.33 — SQL Server returns 1 because the input is INT. PostgreSQL alone would return 1.33; this grader follows SQL Server.', vi: 'AVG(NumProjects) mà mong 1.33 — SQL Server trả 1 vì đầu vào là INT. Riêng PostgreSQL ra 1.33; máy chấm này theo SQL Server.' },
        { en: 'Derived table without an alias — SQL Server requires one (FROM (…) AS c).', vi: 'Bảng dẫn xuất thiếu bí danh — SQL Server bắt buộc (FROM (…) AS c).' },
        { en: 'AVG(COUNT(*)) in one query — nested aggregates are not allowed.', vi: 'AVG(COUNT(*)) trong một câu — không được lồng hàm gộp.' },
      ],
      giaiThich: { en: '<p>The result type of AVG follows its input on SQL Server: INT in ⇒ INT out (16/12 = 1). Casting to DECIMAL keeps the fraction (1.333333 → ROUND 1.33). This is a frequent "why is my average wrong?" surprise in the PE.</p>', vi: '<p>Kiểu kết quả của AVG theo kiểu đầu vào trên SQL Server: INT vào ⇒ INT ra (16/12 = 1). Ép sang DECIMAL thì giữ phần lẻ (1.333333 → ROUND 1.33). Đây là bất ngờ "sao trung bình sai?" rất hay gặp trong PE.</p>' },
      thuatNgu: [{ en: 'derived table', vi: 'bảng dẫn xuất (truy vấn con trong FROM)' }, { en: 'CAST(x AS DECIMAL(p,s))', vi: 'ép kiểu sang số thập phân' }, TN.aggregate],
    }),
  ],
});
