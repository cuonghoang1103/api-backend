/**
 * DBI202 · 5.3 — Ràng buộc trên bảng ĐÃ CÓ dữ liệu: ALTER TABLE … ADD cột / ADD CONSTRAINT (CHECK, UNIQUE, FOREIGN KEY) /
 * DROP CONSTRAINT. Chỉ dùng cú pháp chung SQL Server + PostgreSQL (ADD không kèm COLUMN; không ALTER COLUMN đổi kiểu).
 * CSDL: FUHCompany. Bài giảng: dbi202-rang-buoc-sql.
 */
import { doiDau, KHOA, sql, sau, chan, duoc, TN } from './_chung.mjs';

const KHOI_ALTER = `-- Write your ALTER TABLE statement(s) below (FUHCompany is already loaded).
-- Viết (các) lệnh ALTER TABLE bên dưới (FUHCompany đã được nạp sẵn).

`;
const cot = (bang) => `SELECT lower(column_name) AS col, lower(data_type) AS type FROM information_schema.columns WHERE lower(table_name) = '${bang.toLowerCase()}' ORDER BY ordinal_position`;

export default doiDau({
  slug: 'dbi202-rang-buoc-sql',
  ten: '5.3 ALTER TABLE: add columns and constraints',
  khoa: KHOA,
  baiHoc: 'dbi202-rang-buoc-sql',
  de: [
    sql({
      tieuDe: 'Add a budget column to projects',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['ALTER TABLE … ADD', 'new column on existing rows'], the: ['ddl', 'alter-table', 'fuhcompany'],
      moTa: {
        en: '<p>Projects now need a budget. Add a column <code>budget</code> of type DECIMAL(12,2) to <code>tblProject</code>. Existing projects have no budget yet.</p>',
        vi: '<p>Dự án cần thêm ngân sách. Thêm cột <code>budget</code> kiểu DECIMAL(12,2) vào <code>tblProject</code>. Các dự án hiện có chưa có ngân sách.</p>',
      },
      yeuCau: {
        en: ['One ALTER TABLE statement.', 'Write <code>ADD budget …</code> (without the word COLUMN — SQL Server does not accept it).'],
        vi: ['Một lệnh ALTER TABLE.', 'Viết <code>ADD budget …</code> (không có chữ COLUMN — SQL Server không nhận).'],
      },
      khoiDau: KHOI_ALTER,
      giai: `ALTER TABLE tblProject
ADD budget DECIMAL(12,2) NULL;   -- existing rows get NULL`,
      kiem: [
        sau('tblProject columns', cot('tblProject'), { thuTu: true }),
        sau('Existing projects have NULL budget', 'SELECT proNum, budget FROM tblProject ORDER BY proNum', { thuTu: true }),
        duoc('A budget can be stored', 'UPDATE tblProject SET budget = 1500000000.50 WHERE proNum = 1'),
      ],
      saiMau: ['ALTER TABLE tblProject ADD budget INT', "ALTER TABLE tblProject ADD budget DECIMAL(12,2) NOT NULL DEFAULT 0"],
      goiY: ['ALTER TABLE table ADD column TYPE [NULL | NOT NULL].', 'A new NOT NULL column on a table that already has rows needs a DEFAULT — here the column stays nullable.'],
      loiHayGap: [
        { en: 'ADD COLUMN budget … — PostgreSQL/MySQL syntax; SQL Server rejects the word COLUMN.', vi: 'ADD COLUMN budget … — cú pháp PostgreSQL/MySQL; SQL Server không nhận chữ COLUMN.' },
        { en: 'NOT NULL DEFAULT 0 — existing projects silently get budget 0, which means "free", not "unknown".', vi: 'NOT NULL DEFAULT 0 — dự án cũ âm thầm có ngân sách 0, nghĩa là "miễn phí" chứ không phải "chưa biết".' },
      ],
      giaiThich: { en: '<p>Adding a nullable column is cheap and safe; existing rows read NULL. The portable syntax is <code>ALTER TABLE t ADD c TYPE</code>.</p>', vi: '<p>Thêm cột cho phép NULL nhẹ và an toàn; dòng cũ đọc ra NULL. Cú pháp chạy mọi hệ là <code>ALTER TABLE t ADD c KIỂU</code>.</p>' },
      thuatNgu: [TN.ddl, { en: 'ALTER TABLE', vi: 'sửa cấu trúc bảng' }],
    }),
    sql({
      tieuDe: 'Cap working hours at 60 with a named CHECK',
      doKho: 'MEDIUM', phut: 7,
      khaiNiem: ['ADD CONSTRAINT … CHECK', 'constraint names'], the: ['ddl', 'check', 'fuhcompany'],
      moTa: {
        en: '<p>Labour rules: one assignment may not exceed <b>60 hours</b>. Add a CHECK constraint named <code>ck_workson_max_hours</code> on <code>tblWorksOn</code>.</p>',
        vi: '<p>Luật lao động: một phân công không quá <b>60 giờ</b>. Thêm ràng buộc CHECK tên <code>ck_workson_max_hours</code> trên <code>tblWorksOn</code>.</p>',
      },
      yeuCau: {
        en: ['One ALTER TABLE … ADD CONSTRAINT ck_workson_max_hours CHECK (…).', 'Exactly 60 is allowed.'],
        vi: ['Một lệnh ALTER TABLE … ADD CONSTRAINT ck_workson_max_hours CHECK (…).', 'Đúng 60 thì được.'],
      },
      khoiDau: KHOI_ALTER,
      giai: `ALTER TABLE tblWorksOn
ADD CONSTRAINT ck_workson_max_hours CHECK (workHours <= 60);`,
      kiem: [
        sau('Constraint ck_workson_max_hours exists', "SELECT lower(constraint_name) AS name FROM information_schema.table_constraints WHERE lower(table_name) = 'tblworkson' AND constraint_type = 'CHECK' AND lower(constraint_name) = 'ck_workson_max_hours'"),
        chan('70 hours is rejected', 'UPDATE tblWorksOn SET workHours = 70 WHERE empSSN = 30121050001 AND proNum = 1', '23514'),
        duoc('Exactly 60 hours is accepted', 'UPDATE tblWorksOn SET workHours = 60 WHERE empSSN = 30121050001 AND proNum = 1'),
      ],
      saiMau: ['ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_max_hours CHECK (workHours < 60)', 'ALTER TABLE tblWorksOn ADD CHECK (workHours <= 60)'],
      goiY: ['ALTER TABLE t ADD CONSTRAINT name CHECK (condition).', 'Existing rows must already satisfy the condition, or the ALTER fails (all current hours are ≤ 40).'],
      loiHayGap: [
        { en: 'Unnamed constraint (ADD CHECK (…)) — works, but gets a random system name, so you cannot DROP it by name later.', vi: 'Ràng buộc không tên (ADD CHECK (…)) — chạy, nhưng hệ tự đặt tên ngẫu nhiên nên sau này không DROP theo tên được.' },
        { en: 'CHECK (workHours < 60) — rejects the allowed value 60.', vi: 'CHECK (workHours < 60) — chặn nhầm giá trị 60 hợp lệ.' },
      ],
      giaiThich: { en: '<p>Adding a constraint validates all existing rows first. Named constraints appear in error messages and can be dropped with ALTER TABLE … DROP CONSTRAINT name.</p>', vi: '<p>Thêm ràng buộc thì hệ kiểm mọi dòng hiện có trước. Ràng buộc có tên hiện trong thông báo lỗi và xoá được bằng ALTER TABLE … DROP CONSTRAINT tên.</p>' },
      thuatNgu: [TN.check, { en: 'named constraint', vi: 'ràng buộc có tên' }],
    }),
    sql({
      tieuDe: 'Project names must be unique',
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['ADD CONSTRAINT … UNIQUE', 'alternate key'], the: ['ddl', 'unique', 'fuhcompany'],
      moTa: {
        en: '<p>Two projects with the same name confuse everyone. Add a UNIQUE constraint <code>uq_project_name</code> on <code>tblProject(proName)</code>.</p>',
        vi: '<p>Hai dự án trùng tên làm mọi người nhầm lẫn. Thêm ràng buộc UNIQUE <code>uq_project_name</code> trên <code>tblProject(proName)</code>.</p>',
      },
      yeuCau: {
        en: ['One ALTER TABLE … ADD CONSTRAINT uq_project_name UNIQUE (proName).'],
        vi: ['Một lệnh ALTER TABLE … ADD CONSTRAINT uq_project_name UNIQUE (proName).'],
      },
      khoiDau: KHOI_ALTER,
      giai: `ALTER TABLE tblProject
ADD CONSTRAINT uq_project_name UNIQUE (proName);   -- an alternate key next to the primary key proNum`,
      kiem: [
        chan('A second "ProjectA" is rejected', "INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (9, N'ProjectA', 1, 1)", '23505'),
        chan('Renaming ProjectB to ProjectC is rejected', "UPDATE tblProject SET proName = N'ProjectC' WHERE proNum = 2", '23505'),
        duoc('A new, distinct name is accepted', "INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (9, N'ProjectZ', 1, 1)"),
      ],
      saiMau: ['ALTER TABLE tblProject ADD CONSTRAINT uq_project_name UNIQUE (proNum, proName)'],
      goiY: ['UNIQUE on a single column: UNIQUE (proName).', 'UNIQUE (proNum, proName) would only forbid the same PAIR — useless, since proNum is already unique.'],
      loiHayGap: [
        { en: 'UNIQUE (proNum, proName) — every pair is already unique because proNum is the key; duplicates of the name still get in.', vi: 'UNIQUE (proNum, proName) — mọi cặp vốn đã khác nhau vì proNum là khoá; tên trùng vẫn lọt.' },
        { en: 'Using a second PRIMARY KEY — a table has only one primary key; alternate keys are UNIQUE.', vi: 'Dùng PRIMARY KEY thứ hai — bảng chỉ có một khoá chính; khoá thay thế là UNIQUE.' },
      ],
      giaiThich: { en: '<p>A candidate key that is not the primary key is enforced with UNIQUE. Note: names compare case-insensitively on SQL Server (and in this grader), so "projecta" would also collide.</p>', vi: '<p>Khoá ứng viên không phải khoá chính được bảo vệ bằng UNIQUE. Lưu ý: SQL Server (và máy chấm này) so tên không phân biệt hoa thường nên "projecta" cũng bị coi là trùng.</p>' },
      thuatNgu: [{ en: 'UNIQUE', vi: 'không trùng' }, { en: 'candidate / alternate key', vi: 'khoá ứng viên / khoá thay thế' }],
    }),
    sql({
      tieuDe: 'Project leader: new column plus a foreign key',
      doKho: 'HARD', phut: 10,
      khaiNiem: ['ADD column then ADD CONSTRAINT FOREIGN KEY', 'two statements'], the: ['ddl', 'foreign-key', 'alter-table', 'fuhcompany'],
      moTa: {
        en: '<p>Each project may have a leader, who must be an existing employee. Add a column <code>leaderSSN</code> DECIMAL(18,0) to <code>tblProject</code> and a foreign key <code>fk_project_leader</code> to <code>tblEmployee(empSSN)</code>.</p>',
        vi: '<p>Mỗi dự án có thể có trưởng dự án, phải là nhân viên đang có. Thêm cột <code>leaderSSN</code> DECIMAL(18,0) vào <code>tblProject</code> và khoá ngoại <code>fk_project_leader</code> tới <code>tblEmployee(empSSN)</code>.</p>',
      },
      yeuCau: {
        en: ['Two ALTER TABLE statements (add the column, then the constraint) separated by a semicolon.', 'leaderSSN is optional (NULL allowed).'],
        vi: ['Hai lệnh ALTER TABLE (thêm cột, rồi thêm ràng buộc) cách nhau bằng dấu chấm phẩy.', 'leaderSSN không bắt buộc (cho NULL).'],
      },
      khoiDau: KHOI_ALTER,
      giai: `ALTER TABLE tblProject ADD leaderSSN DECIMAL(18,0) NULL;
ALTER TABLE tblProject ADD CONSTRAINT fk_project_leader
    FOREIGN KEY (leaderSSN) REFERENCES tblEmployee (empSSN);`,
      kiem: [
        sau('tblProject columns', cot('tblProject'), { thuTu: true }),
        duoc('An existing employee can lead', 'UPDATE tblProject SET leaderSSN = 30121050003 WHERE proNum = 1'),
        chan('A non-existent employee cannot lead', 'UPDATE tblProject SET leaderSSN = 99999999999 WHERE proNum = 2', '23503'),
        chan('A leader cannot be deleted while leading', 'UPDATE tblProject SET leaderSSN = 30121050038 WHERE proNum = 3; DELETE FROM tblEmployee WHERE empSSN = 30121050038', '23503'),
      ],
      saiMau: ['ALTER TABLE tblProject ADD leaderSSN DECIMAL(18,0) NULL'],
      goiY: ['Statement 1: ALTER TABLE tblProject ADD leaderSSN DECIMAL(18,0) NULL.', 'Statement 2: ALTER TABLE tblProject ADD CONSTRAINT fk_project_leader FOREIGN KEY (leaderSSN) REFERENCES tblEmployee (empSSN).'],
      loiHayGap: [
        { en: 'A different type than empSSN (e.g. INT) — the foreign key must match the referenced column\'s type (SQL Server refuses mismatches).', vi: 'Khác kiểu với empSSN (vd INT) — khoá ngoại phải cùng kiểu với cột được tham chiếu (SQL Server từ chối nếu lệch).' },
        { en: 'Only adding the column — any number can be stored as leader.', vi: 'Chỉ thêm cột — số nào cũng ghi được làm trưởng dự án.' },
      ],
      giaiThich: { en: '<p>The foreign key also protects the parent: deleting an employee who still leads a project fails (NO ACTION is the default on both engines).</p>', vi: '<p>Khoá ngoại bảo vệ cả bảng cha: xoá nhân viên đang làm trưởng dự án sẽ lỗi (NO ACTION là mặc định ở cả hai hệ).</p>' },
      thuatNgu: [TN.fk, { en: 'NO ACTION', vi: 'chặn xoá/sửa cha khi còn con tham chiếu' }],
    }),
    sql({
      tieuDe: 'Allow unpaid interns: replace a CHECK constraint',
      doKho: 'HARD', phut: 10,
      khaiNiem: ['DROP CONSTRAINT', 'replacing a rule'], the: ['ddl', 'check', 'drop-constraint', 'fuhcompany'],
      moTa: {
        en: '<p>The company starts an internship program: a salary of <b>0</b> becomes legal, negative salaries stay illegal. The current rule is <code>ck_employee_salary CHECK (empSalary &gt; 0)</code>. Drop it and add <code>ck_employee_salary_nonneg CHECK (empSalary &gt;= 0)</code>.</p>',
        vi: '<p>Công ty mở chương trình thực tập: lương <b>0</b> trở thành hợp lệ, lương âm vẫn không. Luật hiện tại là <code>ck_employee_salary CHECK (empSalary &gt; 0)</code>. Xoá nó và thêm <code>ck_employee_salary_nonneg CHECK (empSalary &gt;= 0)</code>.</p>',
      },
      yeuCau: {
        en: ['Two ALTER TABLE statements: DROP CONSTRAINT ck_employee_salary, then ADD CONSTRAINT ck_employee_salary_nonneg.'],
        vi: ['Hai lệnh ALTER TABLE: DROP CONSTRAINT ck_employee_salary, rồi ADD CONSTRAINT ck_employee_salary_nonneg.'],
      },
      khoiDau: KHOI_ALTER,
      giai: `ALTER TABLE tblEmployee DROP CONSTRAINT ck_employee_salary;
ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_salary_nonneg CHECK (empSalary >= 0);`,
      kiem: [
        duoc('An intern with salary 0 can be hired', "INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (30121050200, N'Thực Tập Sinh', 0, 'F', 1)"),
        chan('A negative salary is still rejected', 'UPDATE tblEmployee SET empSalary = -1 WHERE empSSN = 30121050038', '23514'),
        sau('The old constraint is gone, the new one exists', "SELECT lower(constraint_name) AS name FROM information_schema.table_constraints WHERE lower(table_name) = 'tblemployee' AND constraint_type = 'CHECK' AND lower(constraint_name) LIKE 'ck_employee_salary%' ORDER BY 1", { thuTu: true }),
      ],
      saiMau: ['ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_salary_nonneg CHECK (empSalary >= 0)', 'ALTER TABLE tblEmployee DROP CONSTRAINT ck_employee_salary'],
      goiY: ['Constraints cannot be edited in place — drop the old one, add the new one.', 'ALTER TABLE t DROP CONSTRAINT name works the same on SQL Server and PostgreSQL.'],
      loiHayGap: [
        { en: 'Only adding the new rule — the old one (> 0) still rejects 0, because ALL constraints must hold.', vi: 'Chỉ thêm luật mới — luật cũ (> 0) vẫn chặn 0, vì MỌI ràng buộc đều phải thoả.' },
        { en: 'Only dropping the old rule — negative salaries become possible.', vi: 'Chỉ xoá luật cũ — lương âm cũng vào được.' },
      ],
      giaiThich: { en: '<p>Every CHECK constraint must be satisfied at once, so relaxing a rule means removing the stricter constraint. This is why naming constraints matters.</p>', vi: '<p>Mọi ràng buộc CHECK phải thoả đồng thời, nên nới một luật nghĩa là gỡ ràng buộc chặt hơn. Vì thế đặt tên ràng buộc rất quan trọng.</p>' },
      thuatNgu: [TN.check, { en: 'DROP CONSTRAINT', vi: 'xoá ràng buộc' }],
    }),
  ],
});
