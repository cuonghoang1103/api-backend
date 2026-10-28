/**
 * DBI202 · 6.2 — Mọi kiểu JOIN với bảng kết quả: INNER, nhiều bảng, LEFT, tự nối, anti-join, điều kiện ở ON vs WHERE.
 * CSDL: FUHCompany. Bài giảng: dbi202-join-day-du.
 */
import { doiDau, KHOA, sql, kq, kqAn, ma, TN } from './_chung.mjs';

const THEM = `INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES (6, N'Phòng Đào tạo', NULL, NULL);
INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', N'2 Lê Duẩn, TP Hà Nội', 61000, 'M', '1994-02-02', 6, 30121050001),
 (30121050096, N'Đinh Thị Hoa', NULL, 47000, 'F', '1997-07-07', NULL, NULL);
INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 1, 6), (8, N'ProjectH', 4, 1);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 7, 12.0), (30121050004, 8, 8.0)`;

export default doiDau({
  slug: 'dbi202-join-day-du',
  ten: '6.2 Joins: inner, outer, self and anti-joins',
  khoa: KHOA,
  baiHoc: 'dbi202-join-day-du',
  de: [
    sql({
      tieuDe: 'Employees with their department name',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['INNER JOIN', 'join condition', 'table alias'], the: ['join', 'fuhcompany'],
      moTa: {
        en: '<p>tblEmployee only stores the department <i>number</i>. Show every employee together with the <b>name</b> of their department.</p>',
        vi: '<p>tblEmployee chỉ lưu <i>số</i> phòng. Hiện mọi nhân viên kèm <b>tên</b> phòng của họ.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>depName</code>.', 'Employees without a department (none in the sample data) may be left out.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>depName</code>.', 'Nhân viên chưa có phòng (dữ liệu mẫu không có) được phép không hiện.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT e.empSSN, e.empName, d.depName
FROM tblEmployee e
INNER JOIN tblDepartment d ON d.depNum = e.depNum;   -- FK = PK`,
      kiem: [kq('Each employee with depName'), kqAn('New department and staff', THEM), ma('Uses JOIN … ON', '\\bJOIN\\b[\\s\\S]*\\bON\\b')],
      saiMau: ['SELECT e.empSSN, e.empName, d.depName FROM tblEmployee e, tblDepartment d', 'SELECT e.empSSN, e.empName, d.depName FROM tblEmployee e JOIN tblDepartment d ON d.mgrSSN = e.empSSN'],
      goiY: ['FROM tblEmployee e JOIN tblDepartment d ON &lt;how the two tables match&gt;.', 'They match on the department number: d.depNum = e.depNum.'],
      loiHayGap: [
        { en: 'Listing two tables without a join condition (FROM a, b) — the Cartesian product: 14 × 5 = 70 rows.', vi: 'Liệt kê hai bảng không có điều kiện nối (FROM a, b) — tích Descartes: 14 × 5 = 70 dòng.' },
        { en: 'Joining on the wrong pair of columns (d.mgrSSN = e.empSSN) — that finds managers, not departments of employees.', vi: 'Nối nhầm cặp cột (d.mgrSSN = e.empSSN) — ra trưởng phòng chứ không phải phòng của nhân viên.' },
      ],
      giaiThich: { en: '<p>An inner join keeps the pairs (employee, department) that satisfy <code>d.depNum = e.depNum</code> — the foreign key points to the primary key. Table aliases (e, d) keep the query short and remove ambiguity.</p>', vi: '<p>Nối trong giữ các cặp (nhân viên, phòng) thoả <code>d.depNum = e.depNum</code> — khoá ngoại trỏ về khoá chính. Bí danh bảng (e, d) làm câu ngắn và hết mơ hồ.</p>' },
      thuatNgu: [TN.join, { en: 'Cartesian product', vi: 'tích Descartes', giaiThich: 'Mọi cặp dòng của hai bảng — xảy ra khi quên điều kiện nối.' }, TN.alias],
    }),
    sql({
      tieuDe: 'Who works on projects located in Hà Nội?',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['joining four tables', 'join path'], the: ['join', 'multi-table', 'fuhcompany'],
      moTa: {
        en: '<p>List every work assignment on a project whose location is <b>TP Hà Nội</b>: employee SSN, employee name, project name and hours.</p>',
        vi: '<p>Liệt kê mọi phân công vào dự án đặt tại <b>TP Hà Nội</b>: SSN, tên nhân viên, tên dự án và số giờ.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>proName</code>, <code>workHours</code>.', 'Filter by the location <b>name</b> N\'TP Hà Nội\', not by a hard-coded number.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>proName</code>, <code>workHours</code>.', 'Lọc theo <b>tên</b> địa điểm N\'TP Hà Nội\', không chép cứng số.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `-- path: tblEmployee —< tblWorksOn >— tblProject >— tblLocation
SELECT e.empSSN, e.empName, p.proName, w.workHours
FROM tblWorksOn w
JOIN tblEmployee e ON e.empSSN = w.empSSN
JOIN tblProject  p ON p.proNum = w.proNum
JOIN tblLocation l ON l.locNum = p.locNum
WHERE l.locName = N'TP Hà Nội';`,
      kiem: [kq('Assignments on Hà Nội projects'), kqAn('More projects and staff in Hà Nội', THEM), ma('Filters by location name', "locName", false)],
      saiMau: ['SELECT e.empSSN, e.empName, p.proName, w.workHours FROM tblWorksOn w JOIN tblEmployee e ON e.empSSN = w.empSSN JOIN tblProject p ON p.proNum = w.proNum WHERE p.locNum = 1'],
      goiY: ['Draw the path first: employee → works on → project → location.', 'Every extra table needs its own JOIN … ON with the matching key.'],
      loiHayGap: [
        { en: 'Filtering with p.locNum = 1 — correct today, wrong as soon as numbering changes; the question names the location.', vi: 'Lọc p.locNum = 1 — hôm nay đúng, đổi số là sai; đề nói theo tên địa điểm.' },
        { en: 'Joining tblDepLocation instead of the project\'s own location — that is where the DEPARTMENT has offices, not where the project is.', vi: 'Nối tblDepLocation thay vì địa điểm của dự án — đó là nơi PHÒNG có văn phòng, không phải nơi đặt dự án.' },
      ],
      giaiThich: { en: '<p>Joins chain along foreign keys. tblWorksOn is the many-to-many bridge between employees and projects; the project then points to its location.</p>', vi: '<p>Phép nối đi theo chuỗi khoá ngoại. tblWorksOn là bảng cầu nhiều-nhiều giữa nhân viên và dự án; dự án lại trỏ tới địa điểm của nó.</p>' },
      thuatNgu: [TN.join, { en: 'bridge (junction) table', vi: 'bảng cầu (liên kết nhiều-nhiều)' }],
    }),
    sql({
      tieuDe: 'Every department and its projects — keep empty departments',
      doKho: 'MEDIUM', phut: 9,
      khaiNiem: ['LEFT OUTER JOIN', 'NULL-extended rows'], the: ['left-join', 'fuhcompany'],
      moTa: {
        en: '<p>Show every department with the projects it controls. A department that controls <b>no project must still appear</b> (with NULL as project name).</p>',
        vi: '<p>Hiện mọi phòng kèm các dự án phòng đó quản lý. Phòng <b>không quản lý dự án nào vẫn phải hiện</b> (tên dự án là NULL).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>depName</code>, <code>proName</code>.', 'Row order does not matter.'],
        vi: ['Cột: <code>depNum</code>, <code>depName</code>, <code>proName</code>.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT d.depNum, d.depName, p.proName
FROM tblDepartment d
LEFT JOIN tblProject p ON p.depNum = d.depNum;   -- keeps "Phòng Nghiên cứu" with proName NULL`,
      kiem: [kq('Departments with projects, empty ones included'), kqAn('A new department without projects', THEM), ma('Uses an outer join', '\\b(LEFT|RIGHT|FULL)\\s+(OUTER\\s+)?JOIN\\b')],
      saiMau: ['SELECT d.depNum, d.depName, p.proName FROM tblDepartment d JOIN tblProject p ON p.depNum = d.depNum'],
      goiY: ['INNER JOIN drops departments that have no matching project.', 'LEFT JOIN keeps every row of the LEFT table (here tblDepartment).'],
      loiHayGap: [
        { en: 'Using INNER JOIN — "Phòng Nghiên cứu" (no project) disappears.', vi: 'Dùng INNER JOIN — "Phòng Nghiên cứu" (không có dự án) biến mất.' },
        { en: 'Writing tblProject LEFT JOIN tblDepartment — keeps all projects, not all departments: the preserved table is the one on the LEFT.', vi: 'Viết tblProject LEFT JOIN tblDepartment — giữ mọi dự án chứ không phải mọi phòng: bảng được giữ là bảng bên TRÁI.' },
      ],
      giaiThich: { en: '<p>A LEFT JOIN returns the inner-join rows plus, for each left row without a partner, one row padded with NULLs on the right side.</p>', vi: '<p>LEFT JOIN trả các dòng của nối trong, cộng thêm mỗi dòng trái không có cặp một dòng mà phần bên phải là NULL.</p>' },
      thuatNgu: [TN.leftJoin, TN.null],
    }),
    sql({
      tieuDe: 'Employee and supervisor names (self-join)',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['self-join', 'two aliases of one table', 'LEFT JOIN for optional parent'], the: ['self-join', 'fuhcompany'],
      moTa: {
        en: '<p>Print the reporting lines: each employee\'s name next to the name of their supervisor. The director has no supervisor — keep them, with NULL as supervisor name.</p>',
        vi: '<p>In quan hệ báo cáo: tên mỗi nhân viên cạnh tên người giám sát. Giám đốc không có người giám sát — vẫn giữ, tên giám sát là NULL.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>EmployeeSSN</code>, <code>EmployeeName</code>, <code>SupervisorName</code>.', 'All 14 employees appear.', 'Row order does not matter.'],
        vi: ['Cột: <code>EmployeeSSN</code>, <code>EmployeeName</code>, <code>SupervisorName</code>.', 'Đủ 14 nhân viên.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT e.empSSN  AS EmployeeSSN,
       e.empName AS EmployeeName,
       s.empName AS SupervisorName
FROM tblEmployee e
LEFT JOIN tblEmployee s ON s.empSSN = e.supervisorSSN;   -- s = the same table playing "supervisor"`,
      kiem: [kq('Every employee with supervisor name'), kqAn('Extra employee without supervisor', THEM), ma('Joins tblEmployee to itself', 'tblEmployee[\\s\\S]*JOIN\\s+tblEmployee')],
      saiMau: ['SELECT e.empSSN AS EmployeeSSN, e.empName AS EmployeeName, s.empName AS SupervisorName FROM tblEmployee e JOIN tblEmployee s ON s.empSSN = e.supervisorSSN', 'SELECT e.empSSN AS EmployeeSSN, e.empName AS EmployeeName, s.empName AS SupervisorName FROM tblEmployee e LEFT JOIN tblEmployee s ON e.empSSN = s.supervisorSSN'],
      goiY: ['Use the table twice with two aliases: e (employee) and s (supervisor).', 'Match s.empSSN with e.supervisorSSN; LEFT JOIN keeps the director.'],
      loiHayGap: [
        { en: 'INNER self-join — the director (supervisorSSN NULL) disappears: 13 rows instead of 14.', vi: 'Tự nối INNER — giám đốc (supervisorSSN NULL) biến mất: 13 dòng thay vì 14.' },
        { en: 'Reversing the condition (e.empSSN = s.supervisorSSN) — lists subordinates instead of supervisors.', vi: 'Đảo điều kiện (e.empSSN = s.supervisorSSN) — ra cấp dưới thay vì cấp trên.' },
      ],
      giaiThich: { en: '<p>A self-join treats one table as two roles. The foreign key supervisorSSN references the same table\'s primary key, so the join condition is s.empSSN = e.supervisorSSN.</p>', vi: '<p>Tự nối coi một bảng như hai vai. Khoá ngoại supervisorSSN tham chiếu khoá chính của chính bảng đó nên điều kiện nối là s.empSSN = e.supervisorSSN.</p>' },
      thuatNgu: [TN.selfJoin, TN.leftJoin],
    }),
    sql({
      tieuDe: 'Employees on no project (anti-join)',
      doKho: 'HARD', phut: 10,
      khaiNiem: ['anti-join', 'LEFT JOIN … IS NULL', 'NOT EXISTS'], the: ['anti-join', 'left-join', 'fuhcompany'],
      moTa: {
        en: '<p>Find the employees who are <b>not assigned to any project</b>.</p>',
        vi: '<p>Tìm nhân viên <b>không được phân công vào dự án nào</b>.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>.', 'Use a LEFT JOIN with an IS NULL test, or NOT EXISTS.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>.', 'Dùng LEFT JOIN kèm kiểm IS NULL, hoặc NOT EXISTS.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT e.empSSN, e.empName
FROM tblEmployee e
LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
WHERE w.empSSN IS NULL;   -- no partner row ⇒ the right side is NULL`,
      kiem: [kq('Employees with no assignment'), kqAn('A new employee without project; one who just got a project', THEM), ma('Anti-join (IS NULL or NOT EXISTS)', '\\bIS\\s+NULL\\b|\\bNOT\\s+EXISTS\\b')],
      saiMau: ['SELECT e.empSSN, e.empName FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN WHERE w.workHours IS NULL', 'SELECT DISTINCT e.empSSN, e.empName FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN <> e.empSSN'],
      goiY: ['Join employees to assignments with LEFT JOIN; an employee without any assignment gets NULL in every tblWorksOn column.', 'Keep only those rows: WHERE w.empSSN IS NULL (test a NOT NULL column of the right table).'],
      loiHayGap: [
        { en: 'Joining with <> (e.empSSN <> w.empSSN) — almost every employee is "different" from some assignment, so nearly everyone comes back.', vi: 'Nối bằng <> — hầu như ai cũng "khác" một dòng phân công nào đó nên gần như mọi người đều hiện.' },
        { en: 'Testing a nullable column (w.workHours IS NULL) — a real assignment with unknown hours would look like "no assignment".', vi: 'Kiểm một cột được phép NULL (w.workHours IS NULL) — phân công thật nhưng chưa ghi giờ sẽ bị tưởng là "không có".' },
      ],
      giaiThich: { en: '<p>An anti-join keeps rows of A that have <b>no</b> match in B. Two portable forms: LEFT JOIN + IS NULL on a NOT NULL column of B (here the key), or WHERE NOT EXISTS (SELECT 1 FROM B WHERE …).</p>', vi: '<p>Anti-join giữ các dòng của A <b>không</b> có cặp ở B. Hai cách viết chạy mọi hệ: LEFT JOIN + IS NULL trên một cột NOT NULL của B (ở đây là khoá), hoặc WHERE NOT EXISTS (SELECT 1 FROM B WHERE …).</p>' },
      thuatNgu: [{ en: 'anti-join', vi: 'nối loại trừ (lấy phần không khớp)' }, TN.exists],
    }),
    sql({
      tieuDe: 'All locations with department 1\'s projects there — filter in ON, not WHERE',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['outer join + filter', 'ON vs WHERE', 'preserved rows'], the: ['left-join', 'on-vs-where', 'fuhcompany'],
      moTa: {
        en: '<p>For <b>every location</b>, show the projects of <b>department 1</b> located there. Locations where department 1 has no project must still appear, with NULL as project name.</p>',
        vi: '<p>Với <b>mọi địa điểm</b>, hiện các dự án của <b>phòng 1</b> đặt tại đó. Địa điểm không có dự án nào của phòng 1 vẫn phải hiện, tên dự án là NULL.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>locNum</code>, <code>locName</code>, <code>proName</code>.', 'All 4 locations appear at least once.', 'Row order does not matter.'],
        vi: ['Cột: <code>locNum</code>, <code>locName</code>, <code>proName</code>.', 'Đủ 4 địa điểm, mỗi nơi ít nhất một dòng.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT l.locNum, l.locName, p.proName
FROM tblLocation l
LEFT JOIN tblProject p
       ON p.locNum = l.locNum
      AND p.depNum = 1;   -- the filter belongs to the JOIN: it decides which projects can pair up
-- Putting "WHERE p.depNum = 1" would throw away the NULL-extended rows and turn the outer join into an inner join.`,
      kiem: [kq('Every location, department-1 projects or NULL'), kqAn('More projects in other places', THEM), ma('Outer join', '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
      saiMau: ['SELECT l.locNum, l.locName, p.proName FROM tblLocation l LEFT JOIN tblProject p ON p.locNum = l.locNum WHERE p.depNum = 1', 'SELECT l.locNum, l.locName, p.proName FROM tblLocation l LEFT JOIN tblProject p ON p.locNum = l.locNum'],
      goiY: ['Which table must be complete? Locations ⇒ it goes on the LEFT.', 'A condition on the RIGHT table of a LEFT JOIN goes into ON; in WHERE it removes the NULL rows you wanted to keep.'],
      loiHayGap: [
        { en: 'WHERE p.depNum = 1 after a LEFT JOIN — rows with p.depNum NULL fail the test, so locations without such projects vanish (the outer join silently becomes inner).', vi: 'WHERE p.depNum = 1 sau LEFT JOIN — dòng có p.depNum NULL không qua điều kiện nên địa điểm không có dự án biến mất (outer join âm thầm thành inner).' },
        { en: 'Forgetting the department filter — every project of every department is listed.', vi: 'Quên lọc phòng — ra dự án của mọi phòng.' },
      ],
      giaiThich: { en: '<p>For outer joins, ON decides <i>which rows pair up</i>; WHERE then filters the <i>result</i>. Conditions on the optional (right) side belong in ON. This is one of the most common PE mistakes.</p>', vi: '<p>Với outer join, ON quyết định <i>dòng nào ghép cặp</i>; WHERE lọc <i>kết quả</i> sau đó. Điều kiện trên phía tuỳ chọn (bên phải) đặt ở ON. Đây là lỗi rất hay gặp trong PE.</p>' },
      thuatNgu: [TN.leftJoin, { en: 'preserved table', vi: 'bảng được giữ trọn (bên trái của LEFT JOIN)' }],
    }),
  ],
});
