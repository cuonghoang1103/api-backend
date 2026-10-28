/**
 * DBI202 · 7.2 — VIEW: bảng ảo che bớt cột, gói phép nối, gói phép gộp, WITH CHECK OPTION.
 * CREATE VIEW dạng chuẩn chạy cả SQL Server lẫn PostgreSQL (không ORDER BY trong view; không CREATE OR ALTER/REPLACE).
 * Procedure/function/trigger T-SQL của chương 7: máy chấm SQL Server — sắp có (tạm luyện ở Phòng thi).
 * CSDL: FUHCompany. Bài giảng: dbi202-view.
 */
import { doiDau, KHOA, sql, sau, chan, duoc, ma, TN } from './_chung.mjs';

const KHOI_VIEW = `-- Write ONE CREATE VIEW statement below. No ORDER BY inside a view (SQL Server forbids it).
-- Viết MỘT lệnh CREATE VIEW bên dưới. Không ORDER BY trong view (SQL Server cấm).

`;
const THEM = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', NULL, 99000, 'M', '1994-02-02', 1, 30121050001),
 (30121050096, N'Đinh Thị Hoa', NULL, 47000, 'F', '1997-07-07', 2, 30121050010);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 6, 11.0), (30121050096, 1, 4.5)`;

export default doiDau({
  slug: 'dbi202-view',
  ten: '7.2 Views: virtual tables that hide complexity',
  khoa: KHOA,
  baiHoc: 'dbi202-view',
  de: [
    sql({
      tieuDe: 'A view of department 1 without salaries',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['CREATE VIEW', 'hiding columns'], the: ['view', 'fuhcompany'],
      moTa: {
        en: '<p>Team leads of department 1 may see their staff but <b>not their salaries</b>. Create view <code>vwDep1Staff</code> with the SSN, name and sex of every employee of department 1.</p>',
        vi: '<p>Trưởng nhóm phòng 1 được xem nhân viên của mình nhưng <b>không được xem lương</b>. Tạo view <code>vwDep1Staff</code> gồm SSN, tên và giới tính của mọi nhân viên phòng 1.</p>',
      },
      yeuCau: {
        en: ['View name <code>vwDep1Staff</code>; columns <code>empSSN</code>, <code>empName</code>, <code>empSex</code>.', 'The view must stay correct when department 1 hires — it is a query, not a copy.'],
        vi: ['Tên view <code>vwDep1Staff</code>; cột <code>empSSN</code>, <code>empName</code>, <code>empSex</code>.', 'View phải luôn đúng khi phòng 1 tuyển thêm — nó là truy vấn, không phải bản sao.'],
      },
      khoiDau: KHOI_VIEW,
      giai: `CREATE VIEW vwDep1Staff AS
SELECT empSSN, empName, empSex
FROM tblEmployee
WHERE depNum = 1;`,
      kiem: [
        sau('SELECT * FROM vwDep1Staff', 'SELECT * FROM vwDep1Staff'),
        sau('The view sees a newly hired employee', 'SELECT * FROM vwDep1Staff', { an: true, themCsdl: THEM }),
        ma('No ORDER BY inside the view', '\\bORDER\\s+BY\\b', true),
      ],
      saiMau: ['CREATE VIEW vwDep1Staff AS SELECT empSSN, empName, empSex, empSalary FROM tblEmployee WHERE depNum = 1', 'CREATE VIEW vwDep1Staff AS SELECT empSSN, empName, empSex FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN'],
      goiY: ['CREATE VIEW name AS SELECT …', 'Leave out empSalary — that is the point of the view.'],
      loiHayGap: [
        { en: 'ORDER BY inside the view — SQL Server: "The ORDER BY clause is invalid in views…" (Msg 1033). Sort when you SELECT from the view.', vi: 'ORDER BY trong view — SQL Server báo Msg 1033. Sắp xếp khi SELECT từ view.' },
        { en: 'SELECT * in the view definition — the salary leaks and the view breaks when columns change.', vi: 'SELECT * trong định nghĩa view — lộ lương và view hỏng khi bảng đổi cột.' },
      ],
      giaiThich: { en: '<p>A view stores the query, not the data, so it always reflects the current tables. Granting access to a view instead of the table is the classic way to hide sensitive columns.</p>', vi: '<p>View lưu câu truy vấn chứ không lưu dữ liệu, nên luôn phản ánh bảng hiện tại. Cấp quyền trên view thay vì bảng là cách kinh điển để giấu cột nhạy cảm.</p>' },
      thuatNgu: [TN.view],
    }),
    sql({
      tieuDe: 'A view that hides a join',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['view over a join', 'column aliases in a view'], the: ['view', 'join', 'fuhcompany'],
      moTa: {
        en: '<p>Reports keep joining employees with departments. Create view <code>vwEmployeeDept</code> returning every employee\'s SSN, name and <b>department name</b> (as <code>DepartmentName</code>).</p>',
        vi: '<p>Báo cáo nào cũng nối nhân viên với phòng. Tạo view <code>vwEmployeeDept</code> trả SSN, tên và <b>tên phòng</b> (đặt là <code>DepartmentName</code>) của mọi nhân viên.</p>',
      },
      yeuCau: {
        en: ['View <code>vwEmployeeDept</code> with columns <code>empSSN</code>, <code>empName</code>, <code>DepartmentName</code>.', 'Afterwards a report like <code>SELECT … FROM vwEmployeeDept WHERE DepartmentName = …</code> must work.'],
        vi: ['View <code>vwEmployeeDept</code> có cột <code>empSSN</code>, <code>empName</code>, <code>DepartmentName</code>.', 'Sau đó câu báo cáo kiểu <code>SELECT … FROM vwEmployeeDept WHERE DepartmentName = …</code> phải chạy được.'],
      },
      khoiDau: KHOI_VIEW,
      giai: `CREATE VIEW vwEmployeeDept AS
SELECT e.empSSN, e.empName, d.depName AS DepartmentName
FROM tblEmployee e
JOIN tblDepartment d ON d.depNum = e.depNum;`,
      kiem: [
        sau('SELECT * FROM vwEmployeeDept', 'SELECT * FROM vwEmployeeDept'),
        sau('Filtering through the view by department name', "SELECT empSSN, empName FROM vwEmployeeDept WHERE DepartmentName = N'Phòng Kinh doanh'"),
        sau('Counting through the view after hiring', 'SELECT DepartmentName, COUNT(*) AS n FROM vwEmployeeDept GROUP BY DepartmentName', { an: true, themCsdl: THEM }),
      ],
      saiMau: ['CREATE VIEW vwEmployeeDept AS SELECT e.empSSN, e.empName, d.depName FROM tblEmployee e JOIN tblDepartment d ON d.depNum = e.depNum'],
      goiY: ['Write and test the SELECT with the join first, then put CREATE VIEW vwEmployeeDept AS in front of it.', 'Every column of a view needs a unique name — alias d.depName AS DepartmentName.'],
      loiHayGap: [
        { en: 'Keeping the column name depName — the report filters on DepartmentName and fails.', vi: 'Giữ tên cột depName — câu báo cáo lọc theo DepartmentName nên lỗi.' },
        { en: 'Two columns with the same name in the view (e.depNum and d.depNum) — CREATE VIEW fails; alias or drop one.', vi: 'Hai cột trùng tên trong view (e.depNum và d.depNum) — CREATE VIEW lỗi; đặt bí danh hoặc bỏ một cột.' },
      ],
      giaiThich: { en: '<p>The view packages the join once; every report reuses it and gets the same, correct join condition.</p>', vi: '<p>View đóng gói phép nối một lần; mọi báo cáo dùng lại và luôn có cùng điều kiện nối đúng.</p>' },
      thuatNgu: [TN.view, TN.join],
    }),
    sql({
      tieuDe: 'Project staffing summary view',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['view with GROUP BY', 'outer join inside a view'], the: ['view', 'group-by', 'fuhcompany'],
      moTa: {
        en: '<p>Create view <code>vwProjectStaffing</code> with one row per project: project number, project name, number of people (<code>NumStaff</code>) and total hours (<code>TotalHours</code>, 0 if nobody works on it).</p>',
        vi: '<p>Tạo view <code>vwProjectStaffing</code> mỗi dự án một dòng: số dự án, tên dự án, số người (<code>NumStaff</code>) và tổng giờ (<code>TotalHours</code>, 0 nếu không ai làm).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>proNum</code>, <code>proName</code>, <code>NumStaff</code>, <code>TotalHours</code>.', 'A project without assignments must still appear (0, 0).'],
        vi: ['Cột: <code>proNum</code>, <code>proName</code>, <code>NumStaff</code>, <code>TotalHours</code>.', 'Dự án chưa có phân công vẫn phải hiện (0, 0).'],
      },
      khoiDau: KHOI_VIEW,
      giai: `CREATE VIEW vwProjectStaffing AS
SELECT p.proNum, p.proName,
       COUNT(w.empSSN)               AS NumStaff,
       COALESCE(SUM(w.workHours), 0) AS TotalHours
FROM tblProject p
LEFT JOIN tblWorksOn w ON w.proNum = p.proNum
GROUP BY p.proNum, p.proName;`,
      kiem: [
        sau('SELECT * FROM vwProjectStaffing', 'SELECT * FROM vwProjectStaffing'),
        sau('A brand-new project shows 0 staff and 0 hours', "INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 3, 5); SELECT * FROM vwProjectStaffing WHERE proNum = 7"),
        sau('After new assignments', 'SELECT * FROM vwProjectStaffing', { an: true, themCsdl: THEM }),
      ],
      saiMau: [
        'CREATE VIEW vwProjectStaffing AS SELECT p.proNum, p.proName, COUNT(w.empSSN) AS NumStaff, SUM(w.workHours) AS TotalHours FROM tblProject p JOIN tblWorksOn w ON w.proNum = p.proNum GROUP BY p.proNum, p.proName',
        'CREATE VIEW vwProjectStaffing AS SELECT p.proNum, p.proName, COUNT(*) AS NumStaff, COALESCE(SUM(w.workHours), 0) AS TotalHours FROM tblProject p LEFT JOIN tblWorksOn w ON w.proNum = p.proNum GROUP BY p.proNum, p.proName',
      ],
      goiY: ['LEFT JOIN from tblProject keeps projects without assignments.', 'COUNT(w.empSSN) gives 0 for them; COALESCE(SUM(…), 0) turns NULL hours into 0.'],
      loiHayGap: [
        { en: 'INNER JOIN in the view — a new project with no staff is invisible.', vi: 'INNER JOIN trong view — dự án mới chưa có người bị ẩn.' },
        { en: 'COUNT(*) — counts the NULL-padded row as one person.', vi: 'COUNT(*) — đếm dòng NULL đệm thành một người.' },
      ],
      giaiThich: { en: '<p>Views can contain any SELECT, including joins and aggregation. Such a view is read-only (cannot be updated through), which is fine for reporting.</p>', vi: '<p>View chứa được mọi câu SELECT, kể cả nối và gộp. View như vậy chỉ đọc (không sửa dữ liệu qua nó được) — hợp cho báo cáo.</p>' },
      thuatNgu: [TN.view, TN.groupBy, TN.leftJoin],
    }),
    sql({
      tieuDe: 'Updatable view WITH CHECK OPTION',
      doKho: 'HARD', phut: 10,
      khaiNiem: ['updatable view', 'WITH CHECK OPTION'], the: ['view', 'check-option', 'fuhcompany'],
      moTa: {
        en: '<p>Create view <code>vwHighEarners</code> showing SSN, name and salary of employees earning <b>at least 80,000</b>, so that HR can update salaries <b>through the view</b> — but an update that would push someone <b>below</b> 80,000 (and make them vanish from the view) must be <b>rejected</b>.</p>',
        vi: '<p>Tạo view <code>vwHighEarners</code> gồm SSN, tên, lương của nhân viên lương <b>từ 80.000</b>, để phòng nhân sự sửa lương <b>qua view</b> — nhưng lệnh sửa làm ai đó <b>dưới</b> 80.000 (tức biến khỏi view) phải <b>bị chặn</b>.</p>',
      },
      yeuCau: {
        en: ['Columns <code>empSSN</code>, <code>empName</code>, <code>empSalary</code> from tblEmployee only (a single table keeps the view updatable).', 'End the definition with WITH CHECK OPTION.'],
        vi: ['Cột <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>, chỉ từ tblEmployee (một bảng thì view mới sửa được).', 'Kết thúc định nghĩa bằng WITH CHECK OPTION.'],
      },
      khoiDau: KHOI_VIEW,
      giai: `CREATE VIEW vwHighEarners AS
SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary >= 80000
WITH CHECK OPTION;   -- rows changed through the view must still satisfy the WHERE`,
      kiem: [
        sau('SELECT * FROM vwHighEarners', 'SELECT * FROM vwHighEarners'),
        duoc('A raise through the view is accepted', 'UPDATE vwHighEarners SET empSalary = 95000 WHERE empSSN = 30121050020'),
        duoc('Exactly 80,000 through the view is accepted (still in the view)', 'UPDATE vwHighEarners SET empSalary = 80000 WHERE empSSN = 30121050020'),
        chan('Dropping a salary to 50,000 through the view is rejected', 'UPDATE vwHighEarners SET empSalary = 50000 WHERE empSSN = 30121050020', '44000'),
      ],
      saiMau: ['CREATE VIEW vwHighEarners AS SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary >= 80000', 'CREATE VIEW vwHighEarners AS SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary > 80000 WITH CHECK OPTION'],
      goiY: ['A view on ONE table with plain columns is updatable on both SQL Server and PostgreSQL.', 'WITH CHECK OPTION goes after the WHERE clause.'],
      loiHayGap: [
        { en: 'No WITH CHECK OPTION — the update to 50,000 succeeds and the employee silently disappears from the view.', vi: 'Thiếu WITH CHECK OPTION — sửa xuống 50.000 vẫn được và nhân viên âm thầm biến khỏi view.' },
        { en: 'WHERE empSalary > 80000 — excludes someone earning exactly 80,000.', vi: 'WHERE empSalary > 80000 — loại người lương đúng 80.000.' },
      ],
      giaiThich: { en: '<p>WITH CHECK OPTION makes INSERT/UPDATE through the view respect the view\'s WHERE. SQL Server raises Msg 550, PostgreSQL SQLSTATE 44000 — same rule.</p>', vi: '<p>WITH CHECK OPTION buộc INSERT/UPDATE qua view phải thoả WHERE của view. SQL Server báo Msg 550, PostgreSQL SQLSTATE 44000 — cùng một luật.</p>' },
      thuatNgu: [TN.view, { en: 'WITH CHECK OPTION', vi: 'chặn sửa qua view làm dòng rơi khỏi view' }, { en: 'updatable view', vi: 'view sửa được' }],
    }),
  ],
});
