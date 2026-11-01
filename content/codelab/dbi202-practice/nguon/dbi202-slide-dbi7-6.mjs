/**
 * DBI202 · 6.D Slide trường Chương 6 (68–82) — túi trong SQL, hàm gộp, COUNT(*) / COUNT(cột) / COUNT(DISTINCT), NULL trong
 * hàm gộp và nhóm, GROUP BY nhiều cột, WHERE + HAVING — trên FUHCompany.
 */
import { mod, de, cs, q, kq, kqAn, ma, TN, tn } from './_chung.mjs';

const THEM = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050098, N'Lâm Thị Kim', NULL, 56000, 'F', NULL, 4, 30121050030),
 (30121050099, N'Tô Văn Bình', N'1 Lê Duẩn, TP Đà Nẵng', 61000, 'M', '1986-06-06', 4, 30121050030)`;

export default mod('dbi202-slide-dbi7-6', '6.D Bags, aggregates, GROUP BY, NULLs and HAVING (slides 68–82)', [
  de({
    t: 'Three COUNTs that disagree', k: 'EASY', p: 7,
    kn: ['COUNT(*)', 'COUNT(column)', 'COUNT(DISTINCT)'], tag: ['aggregate', 'null', 'fuhcompany', 'slide'],
    en: '<p>In one row: the number of employees, the number with a known address, the number with a known birth date, and the number of <b>different</b> departments they work in.</p>',
    vi: '<p>Trong một dòng: số nhân viên, số người đã có địa chỉ, số người đã có ngày sinh, và số phòng <b>khác nhau</b> họ làm việc.</p>',
    yc: [['Columns: <code>employees, withAddress, withBirthdate, departments</code>.', 'Cột: <code>employees, withAddress, withBirthdate, departments</code>.'], ['One row.', 'Một dòng.']],
    giai: `SELECT COUNT(*)                AS employees,      -- rows
       COUNT(empAddress)       AS withAddress,    -- non-NULL values only
       COUNT(empBirthdate)     AS withBirthdate,
       COUNT(DISTINCT depNum)  AS departments     -- different values
FROM tblEmployee;`,
    kiem: [kq(['14, 13, 13, 5 on the sample data', '14, 13, 13, 5 trên dữ liệu mẫu']), kqAn(['Two more employees, one with no address and no birth date', 'Thêm hai nhân viên, một người không địa chỉ, không ngày sinh'], THEM), ma(['Uses COUNT(DISTINCT …)', 'Dùng COUNT(DISTINCT …)'], '\\bCOUNT\\s*\\(\\s*DISTINCT\\b')],
    sai: [`SELECT COUNT(*) AS employees, COUNT(*) AS withAddress, COUNT(*) AS withBirthdate, COUNT(DISTINCT depNum) AS departments FROM tblEmployee`, `SELECT COUNT(*) AS employees, COUNT(empAddress) AS withAddress, COUNT(empBirthdate) AS withBirthdate, COUNT(depNum) AS departments FROM tblEmployee`],
    gy: [['COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts different non-NULL values.', 'COUNT(*) đếm dòng; COUNT(cột) bỏ NULL; COUNT(DISTINCT cột) đếm giá trị khác nhau không NULL.'], ['All four aggregates in one SELECT, no GROUP BY.', 'Cả bốn hàm gộp trong một SELECT, không GROUP BY.']],
    lhg: [['COUNT(*) for every column — NULLs are not skipped.', 'COUNT(*) cho mọi cột — không bỏ qua NULL.'], ['COUNT(depNum) — counts employees with a department, not departments.', 'COUNT(depNum) — đếm nhân viên có phòng, không đếm phòng.']],
    gt: ['<p>SQL tables are bags: the same depNum appears many times; DISTINCT inside the aggregate turns the bag into a set before counting.</p>', '<p>Bảng SQL là túi: cùng depNum xuất hiện nhiều lần; DISTINCT trong hàm gộp biến túi thành tập trước khi đếm.</p>'],
    tn: [TN.aggregate],
  }),
  de({
    t: 'GROUP BY two columns: headcount by department and sex', k: 'EASY', p: 6,
    kn: ['GROUP BY several columns'], tag: ['group-by', 'fuhcompany', 'slide'],
    en: '<p>Number of employees and average salary for each (department, sex) combination that exists.</p>',
    vi: '<p>Số nhân viên và lương trung bình cho mỗi tổ hợp (phòng, giới tính) có thật.</p>',
    yc: [['Columns: <code>depNum, empSex, headcount, avgSalary</code>.', 'Cột: <code>depNum, empSex, headcount, avgSalary</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT depNum, empSex, COUNT(*) AS headcount, AVG(empSalary) AS avgSalary
FROM tblEmployee
GROUP BY depNum, empSex;            -- one group per distinct pair`,
    kiem: [kq(['One row per (department, sex)', 'Mỗi (phòng, giới tính) một dòng'], { saiSo: 0.01 }), kqAn(['Department 4 gets a woman', 'Phòng 4 có thêm một nữ'], THEM, { saiSo: 0.01 }), ma(['Groups by two columns', 'Gộp theo hai cột'], '\\bGROUP\\s+BY\\s+\\w*\\.?depNum\\s*,\\s*\\w*\\.?empSex\\b|\\bGROUP\\s+BY\\s+\\w*\\.?empSex\\s*,\\s*\\w*\\.?depNum\\b')],
    sai: [`SELECT depNum, empSex, COUNT(*) AS headcount, AVG(empSalary) AS avgSalary FROM tblEmployee GROUP BY depNum, empSex HAVING COUNT(*) > 1`],
    gy: [['Every non-aggregated column of SELECT must be in GROUP BY.', 'Mọi cột không gộp trong SELECT phải nằm trong GROUP BY.'], ['GROUP BY depNum, empSex', 'GROUP BY depNum, empSex']],
    lhg: [['Adding HAVING COUNT(*) &gt; 1 — single-person groups are real and must stay.', 'Thêm HAVING COUNT(*) &gt; 1 — nhóm một người vẫn là thật, phải giữ.'], ['Grouping by depNum only and selecting empSex — "not contained in an aggregate function or the GROUP BY clause".', 'Gộp chỉ theo depNum mà vẫn chọn empSex — "not contained in an aggregate function or the GROUP BY clause".']],
    gt: ['<p>empSalary is DECIMAL(10,0), so AVG returns a decimal; on an INT column SQL Server would truncate (lesson 6.3).</p>', '<p>empSalary là DECIMAL(10,0) nên AVG trả số thập phân; trên cột INT SQL Server sẽ cắt phần lẻ (bài 6.3).</p>'],
    tn: [TN.groupBy],
  }),
  de({
    t: 'WHERE and HAVING together', k: 'MEDIUM', p: 8,
    kn: ['WHERE vs HAVING'], tag: ['group-by', 'having', 'fuhcompany', 'slide'],
    en: '<p>Departments that have <b>at least two employees born in 1985 or later</b>, with that number.</p>',
    vi: '<p>Các phòng có <b>ít nhất hai nhân viên sinh từ năm 1985</b>, kèm số đó.</p>',
    yc: [['Columns: <code>depNum, youngStaff</code>.', 'Cột: <code>depNum, youngStaff</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT depNum, COUNT(*) AS youngStaff
FROM tblEmployee
WHERE empBirthdate >= '1985-01-01'      -- filter ROWS before grouping
GROUP BY depNum
HAVING COUNT(*) >= 2;                   -- filter GROUPS after counting`,
    kiem: [kq(['Departments with 2+ young employees', 'Phòng có từ 2 người trẻ']), kqAn(['Department 4 gets ONE young employee — still not enough', 'Phòng 4 có MỘT người trẻ — vẫn chưa đủ'], THEM), ma(['Uses WHERE and HAVING', 'Dùng WHERE và HAVING'], '\\bWHERE\\b[\\s\\S]*\\bHAVING\\b')],
    sai: [`SELECT depNum, COUNT(*) AS youngStaff FROM tblEmployee GROUP BY depNum HAVING COUNT(*) >= 2`, `SELECT depNum, COUNT(*) AS youngStaff FROM tblEmployee WHERE empBirthdate >= '1985-01-01' GROUP BY depNum`],
    gy: [['The birth-date test is about a ROW ⇒ WHERE.', 'Phép thử ngày sinh là về một DÒNG ⇒ WHERE.'], ['The "at least two" test is about a GROUP ⇒ HAVING.', 'Phép thử "ít nhất hai" là về một NHÓM ⇒ HAVING.']],
    lhg: [['No WHERE — counts everybody, not only the young.', 'Không WHERE — đếm mọi người, không chỉ người trẻ.'], ['No HAVING — departments with one young employee appear.', 'Không HAVING — phòng chỉ có một người trẻ cũng hiện.']],
    gt: ['<p>Expected: department 1 (3 people), 2 (2) and 3 (2). WHERE filters rows before grouping, HAVING filters groups after counting.</p>', '<p>Kết quả: phòng 1 (3 người), 2 (2) và 3 (2). WHERE lọc dòng trước khi gộp, HAVING lọc nhóm sau khi đếm.</p>'],
    tn: [TN.where, TN.having],
  }),
  de({
    t: 'NULL in aggregates: average hours with unrecorded entries', k: 'MEDIUM', p: 8,
    kn: ['AVG ignores NULL', 'COALESCE inside AVG'], tag: ['aggregate', 'null', 'fuhcompany', 'slide'],
    en: '<p>The time-sheet clerk sometimes leaves workHours empty (NULL) — it means "not yet recorded", which the manager wants counted as 0. For each project give <code>avgIgnoringNull</code> (the SQL default) and <code>avgNullAsZero</code>.</p>',
    vi: '<p>Nhân viên chấm công đôi khi để trống workHours (NULL) — nghĩa là "chưa ghi", quản lý muốn tính là 0. Với mỗi dự án cho <code>avgIgnoringNull</code> (mặc định của SQL) và <code>avgNullAsZero</code>.</p>',
    yc: [['Columns: <code>proNum, avgIgnoringNull, avgNullAsZero</code>.', 'Cột: <code>proNum, avgIgnoringNull, avgNullAsZero</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT proNum,
       AVG(workHours)              AS avgIgnoringNull,   -- NULL rows are skipped
       AVG(COALESCE(workHours, 0)) AS avgNullAsZero      -- NULL counted as 0
FROM tblWorksOn
GROUP BY proNum;`,
    kiem: [kq(['Two averages per project', 'Hai giá trị trung bình mỗi dự án'], { saiSo: 0.01 }), kqAn(['Two unrecorded entries', 'Hai dòng chưa ghi giờ'], 'INSERT INTO tblWorksOn VALUES (30121050037, 1, NULL), (30121050038, 6, NULL)', { saiSo: 0.01 }), ma(['Uses COALESCE', 'Dùng COALESCE'], '\\bCOALESCE\\s*\\(')],
    sai: [`SELECT proNum, AVG(workHours) AS avgIgnoringNull, AVG(workHours) AS avgNullAsZero FROM tblWorksOn GROUP BY proNum`, `SELECT proNum, AVG(workHours) AS avgIgnoringNull, SUM(workHours) / COUNT(workHours) AS avgNullAsZero FROM tblWorksOn GROUP BY proNum`],
    gy: [['Every aggregate except COUNT(*) ignores NULLs.', 'Mọi hàm gộp trừ COUNT(*) đều bỏ qua NULL.'], ['AVG(COALESCE(x, 0)) = SUM(x) / COUNT(*).', 'AVG(COALESCE(x, 0)) = SUM(x) / COUNT(*).']],
    lhg: [['SUM(x) / COUNT(x) — still ignores NULL rows.', 'SUM(x) / COUNT(x) — vẫn bỏ qua dòng NULL.'], ['Thinking AVG treats NULL as 0.', 'Tưởng AVG coi NULL là 0.']],
    gt: ['<p>On the sample data both columns are equal (no NULL hours); the hidden data adds two NULLs and the averages split. Decide what NULL means in the business, then write it explicitly.</p>', '<p>Trên dữ liệu mẫu hai cột bằng nhau (không có giờ NULL); dữ liệu ẩn thêm hai NULL và hai giá trị tách ra. Quyết NULL nghĩa là gì trong nghiệp vụ rồi viết tường minh.</p>'],
    tn: [TN.null, TN.aggregate],
  }),
  cs({
    t: 'Grouping and NULL: five quick answers', k: 'MEDIUM', p: 6,
    kn: ['NULL group', 'aggregates on empty input'], tag: ['group-by', 'null', 'slide'],
    en: '<p>Slides 75–82.</p>', vi: '<p>Slide 75–82.</p>',
    cau: [
      q('c1', ['GROUP BY depNum when two employees have depNum NULL produces…', 'GROUP BY depNum khi hai nhân viên có depNum NULL tạo ra…'], ['one group for NULL containing both', 'two separate NULL groups', 'no group for them (they are dropped)', 'an error'], ['For grouping (and DISTINCT) NULLs are treated as equal.', 'Khi gộp nhóm (và DISTINCT) các NULL được coi là bằng nhau.']),
      q('c2', ['SELECT SUM(empSalary) FROM tblEmployee WHERE depNum = 99 returns…', 'SELECT SUM(empSalary) FROM tblEmployee WHERE depNum = 99 trả…'], ['one row with NULL', 'no row', 'one row with 0', 'an error'], ['No input rows: SUM/AVG/MAX are NULL, COUNT is 0 — still one row (no GROUP BY).', 'Không có dòng vào: SUM/AVG/MAX là NULL, COUNT là 0 — vẫn một dòng (không GROUP BY).']),
      q('c3', ['…and SELECT COUNT(*) FROM tblEmployee WHERE depNum = 99?', '…còn SELECT COUNT(*) FROM tblEmployee WHERE depNum = 99?'], ['0', 'NULL', 'no row', '1'], ['COUNT of nothing is 0.', 'COUNT của tập rỗng là 0.']),
      q('c4', ['Which query is rejected by SQL Server?', 'Truy vấn nào bị SQL Server từ chối?'], ['SELECT depNum, empName, COUNT(*) FROM tblEmployee GROUP BY depNum', 'SELECT depNum, COUNT(*) FROM tblEmployee GROUP BY depNum', 'SELECT COUNT(*) FROM tblEmployee', 'SELECT depNum FROM tblEmployee GROUP BY depNum HAVING COUNT(*) > 1'], ['empName is neither grouped nor aggregated.', 'empName không được gộp cũng không nằm trong hàm gộp.']),
      q('c5', ['Can WHERE contain COUNT(*) > 2?', 'WHERE có chứa được COUNT(*) > 2?'], ['No — aggregates belong in HAVING (or SELECT/ORDER BY)', 'Yes — WHERE accepts every expression', 'Only when DISTINCT is added inside COUNT', 'Only on SQL Server, not on PostgreSQL'], ['WHERE runs before groups exist.', 'WHERE chạy trước khi có nhóm.']),
    ],
    gy: [['Empty input ⇒ COUNT 0, other aggregates NULL.', 'Đầu vào rỗng ⇒ COUNT 0, hàm gộp khác NULL.'], ['NULLs form one group.', 'Các NULL tạo thành một nhóm.']],
    lhg: [['Expecting SUM of nothing to be 0.', 'Tưởng SUM của tập rỗng là 0.'], ['Putting aggregates in WHERE.', 'Đặt hàm gộp trong WHERE.']],
    tn: [TN.groupBy, TN.having],
  }),
]);
