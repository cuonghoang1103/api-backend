/**
 * DBI202 · 6.A Slide trường Chương 6 (22–36) — DML, SELECT, bí danh, ORDER BY, nối hai bảng — trên FUHCompany;
 * thứ tự thực thi logic của câu SELECT.
 */
import { mod, de, cs, ord, q, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';

const THEM = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050094, N'Kiều Văn Phúc', NULL, 63000, 'M', '1991-03-03', 3, 30121050020),
 (30121050095, N'Mạc Thị Yến', NULL, 77000, 'F', '1987-07-07', 4, 30121050030)`;

export default mod('dbi202-slide-dbi7-3', '6.A DML, SELECT, aliases, ORDER BY and joining two tables (slides 22–36)', [
  de({
    t: 'INSERT … SELECT: copy department 2 projects into a new location', k: 'MEDIUM', p: 8,
    kn: ['INSERT … SELECT', 'DML'], tag: ['dml', 'insert', 'fuhcompany', 'slide'],
    en: '<p>A new site opens: location <code>5, TP Huế</code>. Insert it, then record that every department which already works in <b>TP Đà Nẵng</b> (locNum 3) also works in TP Huế — using INSERT … SELECT on tblDepLocation, not typed values.</p>',
    vi: '<p>Mở chi nhánh mới: địa điểm <code>5, TP Huế</code>. Thêm nó, rồi ghi nhận mọi phòng đang làm việc ở <b>TP Đà Nẵng</b> (locNum 3) cũng làm ở TP Huế — bằng INSERT … SELECT trên tblDepLocation, không gõ tay giá trị.</p>',
    yc: [['Two statements: INSERT INTO tblLocation …; INSERT INTO tblDepLocation (depNum, locNum) SELECT …', 'Hai câu: INSERT INTO tblLocation …; INSERT INTO tblDepLocation (depNum, locNum) SELECT …'], ["Use N'TP Huế'.", "Dùng N'TP Huế'."]],
    giai: `INSERT INTO tblLocation (locNum, locName) VALUES (5, N'TP Huế');
INSERT INTO tblDepLocation (depNum, locNum)
SELECT depNum, 5                      -- a constant column in the SELECT list
FROM tblDepLocation
WHERE locNum = 3;`,
    kiem: [
      sau(['Departments at location 5', 'Các phòng ở địa điểm 5'], 'SELECT depNum, locNum FROM tblDepLocation WHERE locNum = 5'),
      sau(['Hidden: department 1 also opens in Đà Nẵng first', 'Ẩn: phòng 1 cũng mở ở Đà Nẵng trước'], 'SELECT depNum FROM tblDepLocation WHERE locNum = 5', { an: true, themCsdl: 'INSERT INTO tblDepLocation VALUES (1, 3)' }),
      ma(['Uses INSERT … SELECT', 'Dùng INSERT … SELECT'], '\\bINSERT\\s+INTO\\s+tblDepLocation\\b[^;]*\\bSELECT\\b'),
    ],
    sai: ["INSERT INTO tblLocation (locNum, locName) VALUES (5, N'TP Huế'); INSERT INTO tblDepLocation (depNum, locNum) VALUES (3, 5), (5, 5);", "INSERT INTO tblLocation (locNum, locName) VALUES (5, N'TP Huế'); INSERT INTO tblDepLocation (depNum, locNum) SELECT depNum, 5 FROM tblDepartment;"],
    gy: [['The SELECT may contain constants: SELECT depNum, 5 FROM …', 'SELECT có thể chứa hằng: SELECT depNum, 5 FROM …'], ['Insert the location first — tblDepLocation.locNum is a foreign key.', 'Thêm địa điểm trước — tblDepLocation.locNum là khoá ngoại.']],
    lhg: [['Typing VALUES (3, 5), (5, 5) — correct today, wrong when another department moves to Đà Nẵng (hidden check).', 'Gõ VALUES (3, 5), (5, 5) — đúng hôm nay, sai khi phòng khác chuyển tới Đà Nẵng (kiểm ẩn).'], ['Selecting every department.', 'Chọn mọi phòng.']],
    gt: ['<p>INSERT … SELECT copies the result of a query into a table in one statement — the column lists must match in number and type.</p>', '<p>INSERT … SELECT chép kết quả một truy vấn vào bảng trong một câu — danh sách cột phải khớp số lượng và kiểu.</p>'],
    tn: [TN.dml],
  }),
  de({
    t: 'Aliases and a computed column: yearly salary', k: 'EASY', p: 6,
    kn: ['column alias', 'computed column', 'ORDER BY alias'], tag: ['select', 'alias', 'fuhcompany', 'slide'],
    en: '<p>Show every employee of department 2 with the yearly salary (monthly × 12), highest first.</p>',
    vi: '<p>Hiện mọi nhân viên phòng 2 kèm lương năm (lương tháng × 12), cao nhất trước.</p>',
    yc: [['Columns: <code>Name, YearlySalary</code> (aliases).', 'Cột: <code>Name, YearlySalary</code> (bí danh).'], ['Highest yearly salary first (row order is checked).', 'Lương năm cao nhất trước (có kiểm thứ tự).']],
    giai: `SELECT e.empName AS Name, e.empSalary * 12 AS YearlySalary
FROM tblEmployee AS e                 -- table alias
WHERE e.depNum = 2
ORDER BY YearlySalary DESC;           -- ORDER BY runs after SELECT, so it can use the alias`,
    kiem: [kq(['Department 2, yearly salary', 'Phòng 2, lương năm'], { thuTu: true }), kqAn(['Another employee in department 2', 'Thêm nhân viên phòng 2'], "INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum) VALUES (30121050096, N'Ông Văn Lộc', 99000, 2)", { thuTu: true }), ma(['Uses AS for the aliases', 'Dùng AS cho bí danh'], '\\bAS\\s+YearlySalary\\b')],
    sai: [`SELECT e.empName AS Name, e.empSalary AS YearlySalary FROM tblEmployee e WHERE e.depNum = 2 ORDER BY YearlySalary DESC`, `SELECT e.empName AS Name, e.empSalary * 12 AS YearlySalary FROM tblEmployee e WHERE e.depNum = 2 ORDER BY e.empName`],
    gy: [['An expression in SELECT can be named with AS.', 'Biểu thức trong SELECT đặt tên được bằng AS.'], ['ORDER BY may use a SELECT alias (it runs last); WHERE may not.', 'ORDER BY dùng được bí danh của SELECT (nó chạy cuối); WHERE thì không.']],
    lhg: [['WHERE YearlySalary &gt; … — the alias does not exist yet when WHERE runs.', 'WHERE YearlySalary &gt; … — lúc WHERE chạy bí danh chưa tồn tại.'], ["AS 'Yearly Salary' with quotes — SQL Server only.", "AS 'Yearly Salary' có nháy — chỉ SQL Server nhận."]],
    gt: ['<p>Logical order FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY explains which clause can see an alias.</p>', '<p>Thứ tự logic FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY giải thích mệnh đề nào thấy được bí danh.</p>'],
    tn: [TN.alias, TN.orderBy],
  }),
  de({
    t: 'Two tables, the slide way: join in WHERE', k: 'EASY', p: 7,
    kn: ['join in WHERE', 'qualified names'], tag: ['join', 'fuhcompany', 'slide'],
    en: '<p>Slide 33 joins two tables by listing them in FROM and writing the join condition in WHERE. Do the same: every employee earning more than 80,000 with the <b>name of their department</b>.</p>',
    vi: '<p>Slide 33 nối hai bảng bằng cách liệt kê chúng ở FROM và viết điều kiện nối ở WHERE. Làm tương tự: mọi nhân viên lương trên 80.000 kèm <b>tên phòng</b> của họ.</p>',
    yc: [['Columns: <code>empName, empSalary, depName</code>.', 'Cột: <code>empName, empSalary, depName</code>.'], ['FROM tblEmployee e, tblDepartment d WHERE … — or JOIN … ON. Row order does not matter.', 'FROM tblEmployee e, tblDepartment d WHERE … — hoặc JOIN … ON. Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.empName, e.empSalary, d.depName
FROM tblEmployee e, tblDepartment d
WHERE e.depNum = d.depNum            -- the join condition …
  AND e.empSalary > 80000;           -- … and the filter`,
    kiem: [kq(['High earners with their department', 'Người lương cao kèm phòng']), kqAn(['Two more employees', 'Thêm hai nhân viên'], THEM), ma(['Mentions both tables', 'Có cả hai bảng'], '\\btblDepartment\\b')],
    sai: [`SELECT e.empName, e.empSalary, d.depName FROM tblEmployee e, tblDepartment d WHERE e.empSalary > 80000`, `SELECT e.empName, e.empSalary, d.depName FROM tblEmployee e, tblDepartment d WHERE e.depNum = d.depNum OR e.empSalary > 80000`],
    gy: [['Without the join condition, FROM a, b is the Cartesian product.', 'Không có điều kiện nối, FROM a, b là tích Đề-các.'], ['Qualify the shared column: e.depNum = d.depNum.', 'Ghi rõ bảng cho cột chung: e.depNum = d.depNum.']],
    lhg: [['Forgetting e.depNum = d.depNum — every high earner appears 5 times, once per department.', 'Quên e.depNum = d.depNum — mỗi người lương cao hiện 5 lần, một lần mỗi phòng.'], ['OR instead of AND between the join condition and the filter.', 'OR thay vì AND giữa điều kiện nối và điều kiện lọc.']],
    gt: ['<p>The comma join and JOIN … ON produce the same result; JOIN … ON keeps the join condition next to its table and is what you should write at work.</p>', '<p>Nối bằng dấu phẩy và JOIN … ON cho cùng kết quả; JOIN … ON đặt điều kiện nối cạnh bảng của nó và là cách nên viết khi đi làm.</p>'],
    tn: [TN.join],
  }),
  cs({
    t: 'The logical execution order of a SELECT', k: 'EASY', p: 5, loai: 'order',
    kn: ['logical query processing'], tag: ['select', 'slide'],
    en: '<p>The one idea that makes every query readable (lesson 6.A): the order in which SQL <b>evaluates</b> the clauses — not the order you type them.</p>',
    vi: '<p>Ý tưởng làm mọi truy vấn dễ đọc (bài 6.A): thứ tự SQL <b>tính</b> các mệnh đề — không phải thứ tự bạn gõ.</p>',
    cau: [ord('o1', ['Order the clauses as they are evaluated', 'Sắp các mệnh đề theo thứ tự được tính'], ['FROM (and JOIN … ON)', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'],
      ['FROM builds the rows, WHERE filters rows, GROUP BY makes groups, HAVING filters groups, SELECT computes the output columns (aliases are born here), ORDER BY sorts the result.', 'FROM dựng dòng, WHERE lọc dòng, GROUP BY tạo nhóm, HAVING lọc nhóm, SELECT tính cột kết quả (bí danh sinh ra ở đây), ORDER BY sắp kết quả.'])],
    gy: [['SELECT is written first but evaluated almost last.', 'SELECT viết đầu nhưng tính gần cuối.'], ['That is why WHERE cannot use a SELECT alias but ORDER BY can.', 'Vì vậy WHERE không dùng được bí danh của SELECT còn ORDER BY thì được.']],
    lhg: [['Putting SELECT first.', 'Đặt SELECT đầu tiên.'], ['Putting HAVING before GROUP BY.', 'Đặt HAVING trước GROUP BY.']],
  }),
  cs({
    t: 'DML statements: what do they do?', k: 'EASY', p: 6,
    kn: ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'], tag: ['dml', 'slide'],
    en: '<p>Slides 22–26 on FUHCompany.</p>', vi: '<p>Slide 22–26 trên FUHCompany.</p>',
    cau: [
      q('c1', ['UPDATE tblEmployee SET empSalary = empSalary * 1.1 (no WHERE) changes…', 'UPDATE tblEmployee SET empSalary = empSalary * 1.1 (không WHERE) đổi…'], ['every employee', 'only the first row', 'nothing — WHERE is required', 'only rows with a NULL salary'], ['No WHERE = every row. Always run the WHERE as a SELECT first.', 'Không WHERE = mọi dòng. Luôn chạy thử WHERE bằng SELECT trước.']),
      q('c2', ['INSERT INTO tblLocation VALUES (6) fails because…', 'INSERT INTO tblLocation VALUES (6) lỗi vì…'], ['without a column list, a value is needed for EVERY column', 'locNum must be negative for new locations', 'INSERT needs a WHERE clause to pick the row', 'tblLocation is read-only after the first insert'], ['Either give all values in table order, or name the columns you give.', 'Hoặc đưa đủ giá trị theo thứ tự cột, hoặc ghi rõ tên các cột được đưa.']),
      q('c3', ['DELETE FROM tblDepartment WHERE depNum = 5 fails. Why?', 'DELETE FROM tblDepartment WHERE depNum = 5 lỗi. Vì sao?'], ['employees of department 5 still reference it (foreign key)', 'department 5 does not exist in tblDepartment', 'DELETE cannot use = in its WHERE clause', 'department names are UNIQUE, so rows are locked'], ['Lý Thanh Tâm and Phan Hữu Nghĩa work in department 5.', 'Lý Thanh Tâm và Phan Hữu Nghĩa làm ở phòng 5.']),
      q('c4', ['UPDATE … SET a = b, b = a in SQL Server swaps the two columns because…', 'UPDATE … SET a = b, b = a trong SQL Server đổi chỗ hai cột vì…'], ['every right-hand side reads the OLD values of the row', 'assignments run left to right on the new values', 'it raises an error', 'only the first assignment is applied'], ['All expressions in SET are evaluated against the row before the update.', 'Mọi biểu thức trong SET được tính trên dòng trước khi cập nhật.']),
    ],
    gy: [['Check the WHERE of every UPDATE/DELETE with a SELECT first.', 'Kiểm WHERE của mọi UPDATE/DELETE bằng một SELECT trước.'], ['Foreign keys protect parents from DELETE.', 'Khoá ngoại bảo vệ dòng cha khỏi DELETE.']],
    lhg: [['Forgetting the WHERE.', 'Quên WHERE.'], ['INSERT without a column list when giving only some values.', 'INSERT không có danh sách cột khi chỉ đưa một số giá trị.']],
    tn: [TN.dml],
  }),
]);
