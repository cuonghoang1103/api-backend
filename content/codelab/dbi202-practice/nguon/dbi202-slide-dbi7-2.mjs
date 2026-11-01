/**
 * DBI202 · 5.B Slide trường Chương 6 (15–21) — CREATE / ALTER / DROP và sơ đồ FUHCompany: dựng lại tblDependent từ sơ đồ,
 * thêm cột + UNIQUE có tên, bỏ tính năng dự án đúng thứ tự khoá ngoại.
 */
import { mod, de, cs, q, sau, chan, duoc, ma, cot, FUH, LUOC_DO_FUH, TN, tn } from './_chung.mjs';

// FUHCompany KHÔNG có tblDependent (người học tự dựng lại từ sơ đồ)
const FUH_KHONG_DEP = FUH
  .replace(/CREATE TABLE tblDependent \([\s\S]*?\);\n/, '')
  .replace(/INSERT INTO tblDependent[\s\S]*?;\n/, '');
const DEP = `CREATE TABLE tblDependent (
    depName         VARCHAR(50)    NOT NULL,
    empSSN          DECIMAL(18,0)  NOT NULL,
    depSex          CHAR(1)        NULL,
    depBirthdate    DATE           NULL,
    depRelationship VARCHAR(30)    NULL,
    CONSTRAINT pk_dependent          PRIMARY KEY (empSSN, depName),               -- weak entity: owner key + partial key
    CONSTRAINT ck_dependent_sex      CHECK (depSex IN ('F', 'M')),
    CONSTRAINT fk_dependent_employee FOREIGN KEY (empSSN) REFERENCES tblEmployee (empSSN)
);`;

export default mod('dbi202-slide-dbi7-2', '5.B SQL DDL: CREATE, ALTER, DROP & the FUHCompany diagram (slides 15–21)', [
  de({
    csdl: FUH_KHONG_DEP, tenCsdl: 'FUHCompany_noDependent',
    t: 'Rebuild tblDependent from the FUHCompany diagram', k: 'MEDIUM', p: 10,
    kn: ['CREATE TABLE', 'weak entity', 'named constraints'], tag: ['ddl', 'fuhcompany', 'slide'],
    en: '<p>The database is FUHCompany <b>without</b> tblDependent. Recreate it as on the diagram of slide 21: <code>tblDependent(depName VARCHAR(50), empSSN DECIMAL(18,0), depSex CHAR(1), depBirthdate DATE, depRelationship VARCHAR(30))</code>. A dependent is identified by the employee plus its name; sex is F or M; the employee must exist.</p>',
    vi: '<p>CSDL là FUHCompany <b>không có</b> tblDependent. Dựng lại như sơ đồ slide 21: <code>tblDependent(depName VARCHAR(50), empSSN DECIMAL(18,0), depSex CHAR(1), depBirthdate DATE, depRelationship VARCHAR(30))</code>. Người phụ thuộc được xác định bởi nhân viên cộng tên; giới tính F hoặc M; nhân viên phải tồn tại.</p>',
    yc: [['PRIMARY KEY (empSSN, depName), CHECK on depSex, FOREIGN KEY empSSN → tblEmployee.', 'PRIMARY KEY (empSSN, depName), CHECK cho depSex, FOREIGN KEY empSSN → tblEmployee.'], ['VARCHAR instead of NVARCHAR here (the real FUHCompany uses NVARCHAR).', 'Ở đây dùng VARCHAR thay NVARCHAR (FUHCompany thật dùng NVARCHAR).']],
    giai: DEP,
    kiem: [
      sau(['Columns', 'Các cột'], cot(['tblDependent'])),
      duoc(['Two children of the director', 'Hai con của giám đốc'], `INSERT INTO tblDependent VALUES ('Khang', 30121050001, 'M', '2000-05-05', 'son'), ('Hoa', 30121050001, 'F', '2003-01-01', 'daughter')`),
      duoc(['The same name for dependents of two employees', 'Cùng tên người phụ thuộc của hai nhân viên'], `INSERT INTO tblDependent VALUES ('Minh', 30121050001, 'M', NULL, 'son'), ('Minh', 30121050002, 'M', NULL, 'son')`),
      chan(['The same name twice for one employee is rejected', 'Cùng tên hai lần cho một nhân viên bị từ chối'], `INSERT INTO tblDependent VALUES ('Minh', 30121050001, 'M', NULL, 'son'), ('Minh', 30121050001, 'F', NULL, 'daughter')`, '23505'),
      chan(['Sex X is rejected', 'Giới tính X bị từ chối'], `INSERT INTO tblDependent VALUES ('Lan', 30121050001, 'X', NULL, NULL)`, '23514'),
      chan(['A dependent of an unknown employee is rejected', 'Người phụ thuộc của nhân viên không tồn tại bị từ chối'], `INSERT INTO tblDependent VALUES ('Lan', 99999999999, 'F', NULL, NULL)`, '23503'),
    ],
    sai: [DEP.replace('PRIMARY KEY (empSSN, depName)', 'PRIMARY KEY (depName)'), DEP.replace("    CONSTRAINT fk_dependent_employee FOREIGN KEY (empSSN) REFERENCES tblEmployee (empSSN)\n", "    CONSTRAINT dummy CHECK (empSSN > 0)\n")],
    gy: [['tblDependent is a weak entity of tblEmployee: key = (empSSN, depName).', 'tblDependent là thực thể yếu của tblEmployee: khoá = (empSSN, depName).'], ['Name the constraints (pk_…, ck_…, fk_…) as the course script does — error messages then tell you which rule failed.', 'Đặt tên ràng buộc (pk_…, ck_…, fk_…) như script của môn — thông báo lỗi sẽ cho biết luật nào hỏng.']],
    lhg: [['PRIMARY KEY (depName) — two employees cannot both have a child called Minh.', 'PRIMARY KEY (depName) — hai nhân viên không cùng có con tên Minh được.'], ['Forgetting the foreign key — dependents of nobody.', 'Quên khoá ngoại — người phụ thuộc của không ai.']],
    gt: ['<p>empSSN must have exactly the type of tblEmployee.empSSN (DECIMAL(18,0)) — a foreign key needs compatible types.</p>', '<p>empSSN phải đúng kiểu của tblEmployee.empSSN (DECIMAL(18,0)) — khoá ngoại cần kiểu tương thích.</p>'],
    tn: [TN.ddl, TN.fk],
  }),
  de({
    t: 'ALTER TABLE: an e-mail column, filled, then a named UNIQUE', k: 'MEDIUM', p: 10,
    kn: ['ALTER TABLE ADD', 'UPDATE existing rows', 'ADD CONSTRAINT'], tag: ['ddl', 'alter', 'fuhcompany', 'slide'],
    en: "<p>Add a column <code>empEmail VARCHAR(100)</code> to tblEmployee, give every existing employee the address <code>e&lt;SSN&gt;@fuh.vn</code> (e.g. e30121050001@fuh.vn), then add a constraint named <code>uq_employee_email</code> so that two employees never share an e-mail.</p>",
    vi: "<p>Thêm cột <code>empEmail VARCHAR(100)</code> vào tblEmployee, gán cho mọi nhân viên đang có địa chỉ <code>e&lt;SSN&gt;@fuh.vn</code> (vd e30121050001@fuh.vn), rồi thêm ràng buộc tên <code>uq_employee_email</code> để hai nhân viên không bao giờ trùng e-mail.</p>",
    yc: [['Three statements: ALTER TABLE … ADD empEmail … NULL; UPDATE …; ALTER TABLE … ADD CONSTRAINT uq_employee_email UNIQUE (empEmail).', 'Ba câu: ALTER TABLE … ADD empEmail … NULL; UPDATE …; ALTER TABLE … ADD CONSTRAINT uq_employee_email UNIQUE (empEmail).'], ["Build the address with CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn') — CONCAT runs on both SQL Server and PostgreSQL. ADD without the word COLUMN.", "Dựng địa chỉ bằng CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn') — CONCAT chạy cả SQL Server lẫn PostgreSQL. ADD không có chữ COLUMN."]],
    giai: `ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL;                               -- existing rows get NULL …
UPDATE tblEmployee SET empEmail = CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn');  -- … then a real value
ALTER TABLE tblEmployee ADD CONSTRAINT uq_employee_email UNIQUE (empEmail);           -- no NULLs left: safe on SQL Server too`,
    kiem: [
      sau(['Every employee has the right e-mail', 'Mọi nhân viên có đúng e-mail'], 'SELECT empSSN, empEmail FROM tblEmployee'),
      chan(['Two employees with the same e-mail are rejected', 'Hai nhân viên trùng e-mail bị từ chối'], "UPDATE tblEmployee SET empEmail = 'boss@fuh.vn' WHERE empSSN IN (30121050001, 30121050002)", '23505'),
      sau(['Hidden: new employees get an address too', 'Ẩn: nhân viên mới cũng có địa chỉ'], 'SELECT COUNT(*) AS n, COUNT(empEmail) AS withEmail, COUNT(DISTINCT empEmail) AS distinctEmail FROM tblEmployee', { an: true, themCsdl: "INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050090, N'Đỗ Hằng', 3)" }),
      sau(['The constraint has the required name', 'Ràng buộc có đúng tên'], "SELECT lower(constraint_name) AS name, constraint_type FROM information_schema.table_constraints WHERE lower(table_name) = 'tblemployee' AND lower(constraint_name) = 'uq_employee_email'", { an: true }),
    ],
    sai: [
      "ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL; UPDATE tblEmployee SET empEmail = CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn');",
      "ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL; UPDATE tblEmployee SET empEmail = CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn'); ALTER TABLE tblEmployee ADD CONSTRAINT uq_email UNIQUE (empEmail);",
      "ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL; UPDATE tblEmployee SET empEmail = CONCAT('e', CAST(empSSN AS VARCHAR(20)), '@fuh.vn') WHERE depNum = 1; ALTER TABLE tblEmployee ADD CONSTRAINT uq_employee_email UNIQUE (empEmail);",
    ],
    gy: [['A new column on a table that has rows must allow NULL (or have a DEFAULT) — then fill it with UPDATE.', 'Cột mới trên bảng đã có dòng phải cho NULL (hoặc có DEFAULT) — rồi đổ giá trị bằng UPDATE.'], ['Add the UNIQUE constraint LAST, when no duplicates or NULLs remain.', 'Thêm ràng buộc UNIQUE CUỐI CÙNG, khi không còn trùng hay NULL.']],
    lhg: [['Adding UNIQUE while 14 e-mails are still NULL — on SQL Server a UNIQUE constraint allows only ONE NULL, so the ALTER fails there.', 'Thêm UNIQUE khi 14 e-mail còn NULL — trên SQL Server ràng buộc UNIQUE chỉ cho MỘT NULL nên lệnh ALTER lỗi ở đó.'], ['A different constraint name — the task (and the PE) asks for this exact name.', 'Tên ràng buộc khác — đề (và PE) yêu cầu đúng tên này.']],
    gt: ['<p>Order matters: structure (ADD column) → data (UPDATE) → rule (ADD CONSTRAINT). The rule is checked against every existing row the moment it is added.</p>', '<p>Thứ tự quan trọng: cấu trúc (ADD cột) → dữ liệu (UPDATE) → luật (ADD CONSTRAINT). Luật được kiểm với mọi dòng đang có ngay lúc thêm.</p>'],
    tn: [tn('ALTER TABLE', 'sửa cấu trúc bảng'), tn('UNIQUE', 'duy nhất')],
  }),
  de({
    t: 'DROP: remove the project feature in a legal order', k: 'MEDIUM', p: 8,
    kn: ['DROP TABLE', 'foreign key order'], tag: ['ddl', 'drop', 'fuhcompany', 'slide'],
    en: '<p>The company stops tracking projects. Drop <code>tblWorksOn</code> and <code>tblProject</code> — in an order the foreign keys accept. Every other table must stay.</p>',
    vi: '<p>Công ty thôi theo dõi dự án. Xoá <code>tblWorksOn</code> và <code>tblProject</code> — theo thứ tự mà khoá ngoại chấp nhận. Mọi bảng khác phải còn.</p>',
    yc: [['Two DROP TABLE statements.', 'Hai câu DROP TABLE.'], ['No change to other tables.', 'Không đổi bảng khác.']],
    giai: `DROP TABLE tblWorksOn;   -- the child (it references tblProject) goes first
DROP TABLE tblProject;`,
    kiem: [
      sau(['Remaining tables', 'Các bảng còn lại'], "SELECT lower(table_name) AS tbl FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') AND lower(table_name) LIKE 'tbl%'"),
      sau(['Employees untouched', 'Nhân viên không bị đụng'], 'SELECT COUNT(*) AS n FROM tblEmployee'),
      ma(['Uses DROP TABLE', 'Dùng DROP TABLE'], '\\bDROP\\s+TABLE\\b'),
    ],
    sai: ['DROP TABLE tblProject; DROP TABLE tblWorksOn;', 'DROP TABLE tblWorksOn;'],
    gy: [['tblWorksOn.proNum references tblProject — drop the child first.', 'tblWorksOn.proNum tham chiếu tblProject — xoá bảng con trước.'], ['DROP TABLE tblWorksOn; DROP TABLE tblProject;', 'DROP TABLE tblWorksOn; DROP TABLE tblProject;']],
    lhg: [['Dropping tblProject first — "Could not drop object … referenced by a FOREIGN KEY constraint".', 'Xoá tblProject trước — "Could not drop object … referenced by a FOREIGN KEY constraint".'], ['Dropping only tblWorksOn.', 'Chỉ xoá tblWorksOn.']],
    gt: ['<p>DROP is the reverse of CREATE: children first. DELETE removes rows, DROP removes the table itself (structure + rows + constraints).</p>', '<p>DROP ngược với CREATE: con trước. DELETE xoá dòng, DROP xoá chính bảng (cấu trúc + dòng + ràng buộc).</p>'],
    tn: [tn('DROP TABLE', 'xoá bảng')],
  }),
  cs({
    t: 'DDL on SQL Server: what works, what fails', k: 'MEDIUM', p: 6,
    kn: ['ALTER COLUMN', 'DROP CONSTRAINT', 'DDL errors'], tag: ['ddl', 'slide'],
    en: '<p>Slides 18–20 on SQL Server.</p>', vi: '<p>Slide 18–20 trên SQL Server.</p>',
    cau: [
      q('c1', ['How do you change the type of empAddress to NVARCHAR(200) on SQL Server?', 'Đổi kiểu empAddress thành NVARCHAR(200) trên SQL Server thế nào?'], ['ALTER TABLE tblEmployee ALTER COLUMN empAddress NVARCHAR(200) NULL', 'ALTER TABLE tblEmployee MODIFY empAddress NVARCHAR(200)', 'ALTER TABLE tblEmployee ALTER COLUMN empAddress TYPE NVARCHAR(200)', 'UPDATE tblEmployee SET TYPE empAddress = NVARCHAR(200)'], ['T-SQL: ALTER COLUMN name newtype [NULL|NOT NULL]. MODIFY is MySQL/Oracle; … TYPE … is PostgreSQL.', 'T-SQL: ALTER COLUMN tên kiểu-mới [NULL|NOT NULL]. MODIFY là MySQL/Oracle; … TYPE … là PostgreSQL.']),
      q('c2', ['To remove the CHECK ck_employee_salary you write…', 'Để bỏ CHECK ck_employee_salary bạn viết…'], ['ALTER TABLE tblEmployee DROP CONSTRAINT ck_employee_salary', 'DROP CHECK ck_employee_salary', 'ALTER TABLE tblEmployee DELETE CONSTRAINT ck_employee_salary', 'DROP CONSTRAINT ck_employee_salary ON tblEmployee'], ['Constraints are dropped through ALTER TABLE — another reason to name them.', 'Ràng buộc được bỏ qua ALTER TABLE — thêm một lý do để đặt tên chúng.']),
      q('c3', ['ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NOT NULL fails. Why?', 'ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NOT NULL lỗi. Vì sao?'], ['Existing rows would have NULL in a NOT NULL column; add a DEFAULT or allow NULL', 'VARCHAR(100) is too long for an e-mail column in SQL Server', 'NOT NULL is never allowed in an ALTER TABLE … ADD statement', 'tblEmployee has a primary key, so no column can be added'], ['SQL Server needs a value for the existing 14 rows.', 'SQL Server cần một giá trị cho 14 dòng đang có.']),
      q('c4', ['DROP TABLE tblDepartment fails even after its rows are deleted. Why?', 'DROP TABLE tblDepartment lỗi kể cả khi đã xoá hết dòng. Vì sao?'], ['Other tables still have foreign keys referencing it', 'A table must be empty AND unnamed', 'DROP only works on views', 'Because of the CHECK on depNum'], ['The FK constraints themselves block the drop, whatever the data — drop or alter the children first.', 'Chính ràng buộc khoá ngoại chặn việc xoá, bất kể dữ liệu — xoá hoặc sửa bảng con trước.']),
    ],
    gy: [['Column changes and constraint changes both go through ALTER TABLE.', 'Đổi cột và đổi ràng buộc đều qua ALTER TABLE.'], ['A foreign key blocks DROP TABLE of its target even when the tables are empty.', 'Khoá ngoại chặn DROP TABLE của bảng đích kể cả khi bảng rỗng.']],
    lhg: [['Using MODIFY (MySQL) on SQL Server.', 'Dùng MODIFY (MySQL) trên SQL Server.'], ['Thinking an empty parent table can always be dropped.', 'Tưởng bảng cha rỗng thì luôn xoá được.']],
    tn: [tn('DROP CONSTRAINT', 'bỏ ràng buộc')],
  }),
]);
