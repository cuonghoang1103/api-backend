/**
 * DBI202 · 5.1 — CREATE TABLE: khoá chính, NOT NULL, UNIQUE, CHECK, DEFAULT, khoá ghép, khoá ngoại, ON DELETE CASCADE.
 * Kiểm theo HÀNH VI (câu hợp lệ phải chạy, câu vi phạm phải bị chặn) + danh sách cột qua information_schema —
 * không phụ thuộc cách đặt tên ràng buộc. Kiểu dữ liệu: tập chung INT / VARCHAR(n) / CHAR(n) / DECIMAL(p,s) / DATE.
 * Bài giảng: dbi202-sql-ddl.
 */
import { doiDau, KHOA, sql, sau, chan, duoc, ma, TN } from './_chung.mjs';

const KHOI_DDL = `-- Write your CREATE TABLE statement(s) below. Use portable types: INT, VARCHAR(n), CHAR(n), DECIMAL(p,s), DATE.
-- (On the real SQL Server PE you would use NVARCHAR for Vietnamese text — here VARCHAR keeps the code portable.)
-- Viết (các) lệnh CREATE TABLE bên dưới. Kiểu chạy mọi hệ: INT, VARCHAR(n), CHAR(n), DECIMAL(p,s), DATE.

`;
const cot = (bang) => `SELECT lower(column_name) AS col, lower(data_type) AS type FROM information_schema.columns WHERE lower(table_name) = '${bang.toLowerCase()}' ORDER BY ordinal_position`;

const BASE_SV = `CREATE TABLE tblCourse (
    courseID   CHAR(6)       NOT NULL PRIMARY KEY,
    courseName NVARCHAR(100) NOT NULL,
    credits    INT           NOT NULL
);
CREATE TABLE tblStudent (
    studentID CHAR(8)      NOT NULL PRIMARY KEY,
    fullName  NVARCHAR(60) NOT NULL,
    email     VARCHAR(100) NULL UNIQUE,
    gpa       DECIMAL(3,2) NULL CHECK (gpa >= 0 AND gpa <= 4)
);
INSERT INTO tblCourse (courseID, courseName, credits) VALUES ('DBI202', N'Database Systems', 3), ('PRF192', N'Programming Fundamentals', 3);
INSERT INTO tblStudent (studentID, fullName, email, gpa) VALUES ('HE170001', N'Nguyễn An', 'an@fpt.edu.vn', 3.20), ('HE170002', N'Trần Bình', NULL, 2.75);`;

export default doiDau({
  slug: 'dbi202-sql-ddl',
  ten: '5.1 CREATE TABLE: keys and constraints',
  khoa: KHOA,
  baiHoc: 'dbi202-sql-ddl',
  de: [
    sql({
      tieuDe: 'Create the course table',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['CREATE TABLE', 'PRIMARY KEY', 'NOT NULL'], the: ['ddl', 'primary-key'],
      csdl: '', luocDo: null,
      moTa: {
        en: '<p>Create table <code>tblCourse</code> with three columns: <code>courseID</code> — exactly 6 characters, the primary key; <code>courseName</code> — up to 100 characters, required; <code>credits</code> — an integer, optional.</p>',
        vi: '<p>Tạo bảng <code>tblCourse</code> gồm ba cột: <code>courseID</code> — đúng 6 ký tự, khoá chính; <code>courseName</code> — tối đa 100 ký tự, bắt buộc; <code>credits</code> — số nguyên, không bắt buộc.</p>',
      },
      yeuCau: {
        en: ['Columns in this order: courseID CHAR(6), courseName VARCHAR(100), credits INT.', 'courseID is the PRIMARY KEY; courseName is NOT NULL.'],
        vi: ['Cột đúng thứ tự: courseID CHAR(6), courseName VARCHAR(100), credits INT.', 'courseID là PRIMARY KEY; courseName NOT NULL.'],
      },
      khoiDau: KHOI_DDL,
      giai: `CREATE TABLE tblCourse (
    courseID   CHAR(6)      NOT NULL,
    courseName VARCHAR(100) NOT NULL,
    credits    INT          NULL,
    CONSTRAINT pk_course PRIMARY KEY (courseID)   -- named constraint: easier to drop/alter later
);`,
      kiem: [
        sau('Columns and types', cot('tblCourse'), { thuTu: true }),
        duoc('A valid course can be inserted', "INSERT INTO tblCourse (courseID, courseName, credits) VALUES ('DBI202', 'Database Systems', 3)"),
        chan('Duplicate courseID is rejected (PRIMARY KEY)', "INSERT INTO tblCourse (courseID, courseName, credits) VALUES ('DBI202', 'A', 3), ('DBI202', 'B', 3)", '23505'),
        chan('Missing courseName is rejected (NOT NULL)', "INSERT INTO tblCourse (courseID, credits) VALUES ('PRF192', 3)", '23502'),
        duoc('credits may be left empty', "INSERT INTO tblCourse (courseID, courseName) VALUES ('SSG104', 'Soft skills')"),
      ],
      saiMau: ['CREATE TABLE tblCourse (courseID CHAR(6), courseName VARCHAR(100), credits INT)', 'CREATE TABLE tblCourse (courseID CHAR(6) PRIMARY KEY, courseName VARCHAR(100), credits INT)', 'CREATE TABLE tblCourse (courseID CHAR(6) PRIMARY KEY, courseName VARCHAR(100) NOT NULL, credits INT NOT NULL)'],
      goiY: ['CREATE TABLE name ( col TYPE [NOT NULL], …, CONSTRAINT pk_name PRIMARY KEY (col) ).', 'NOT NULL makes a column required; NULL (the default) makes it optional.'],
      loiHayGap: [
        { en: 'Forgetting the primary key — duplicates are accepted and the table cannot be referenced by a foreign key.', vi: 'Quên khoá chính — trùng mã vẫn vào được và bảng không làm đích cho khoá ngoại được.' },
        { en: 'VARCHAR without a length — on SQL Server it means VARCHAR(1)! Always write the length.', vi: 'VARCHAR không ghi độ dài — trên SQL Server nghĩa là VARCHAR(1)! Luôn ghi độ dài.' },
      ],
      giaiThich: { en: '<p>The grader tests <b>behaviour</b>: a valid insert must succeed, a duplicate key and a missing required value must be rejected. PRIMARY KEY = UNIQUE + NOT NULL on the key column(s).</p>', vi: '<p>Máy chấm kiểm <b>hành vi</b>: chèn hợp lệ phải được, trùng khoá và thiếu giá trị bắt buộc phải bị chặn. PRIMARY KEY = UNIQUE + NOT NULL trên (các) cột khoá.</p>' },
      thuatNgu: [TN.ddl, TN.pk, { en: 'NOT NULL', vi: 'không được để trống' }],
    }),
    sql({
      tieuDe: 'Student table with UNIQUE email and a GPA range',
      doKho: 'MEDIUM', phut: 9,
      khaiNiem: ['UNIQUE', 'CHECK', 'DECIMAL(p,s)'], the: ['ddl', 'unique', 'check'],
      csdl: '', luocDo: null,
      moTa: {
        en: '<p>Create <code>tblStudent</code>: <code>studentID</code> CHAR(8) primary key; <code>fullName</code> VARCHAR(60) required; <code>email</code> VARCHAR(100), optional but <b>no two students may share an email</b>; <code>gpa</code> DECIMAL(3,2) between <b>0 and 4</b> inclusive.</p>',
        vi: '<p>Tạo <code>tblStudent</code>: <code>studentID</code> CHAR(8) khoá chính; <code>fullName</code> VARCHAR(60) bắt buộc; <code>email</code> VARCHAR(100), không bắt buộc nhưng <b>hai sinh viên không được trùng email</b>; <code>gpa</code> DECIMAL(3,2) từ <b>0 đến 4</b> (tính cả hai đầu).</p>',
      },
      yeuCau: {
        en: ['Columns in order: studentID, fullName, email, gpa.', 'UNIQUE on email, CHECK on gpa (0 ≤ gpa ≤ 4).'],
        vi: ['Cột theo thứ tự: studentID, fullName, email, gpa.', 'UNIQUE trên email, CHECK trên gpa (0 ≤ gpa ≤ 4).'],
      },
      khoiDau: KHOI_DDL,
      giai: `CREATE TABLE tblStudent (
    studentID CHAR(8)      NOT NULL,
    fullName  VARCHAR(60)  NOT NULL,
    email     VARCHAR(100) NULL,
    gpa       DECIMAL(3,2) NULL,
    CONSTRAINT pk_student       PRIMARY KEY (studentID),
    CONSTRAINT uq_student_email UNIQUE (email),
    CONSTRAINT ck_student_gpa   CHECK (gpa BETWEEN 0 AND 4)
);`,
      kiem: [
        sau('Columns and types', cot('tblStudent'), { thuTu: true }),
        duoc('Valid students (GPA 0 and 4 are allowed)', "INSERT INTO tblStudent (studentID, fullName, email, gpa) VALUES ('HE170001', 'An', 'an@fpt.edu.vn', 4.00), ('HE170002', 'Binh', 'binh@fpt.edu.vn', 0)"),
        chan('Duplicate email is rejected (UNIQUE)', "INSERT INTO tblStudent (studentID, fullName, email) VALUES ('HE170003', 'C', 'x@fpt.edu.vn'), ('HE170004', 'D', 'x@fpt.edu.vn')", '23505'),
        chan('GPA 4.5 is rejected (CHECK)', "INSERT INTO tblStudent (studentID, fullName, gpa) VALUES ('HE170005', 'E', 4.5)", '23514'),
        chan('Negative GPA is rejected (CHECK)', "INSERT INTO tblStudent (studentID, fullName, gpa) VALUES ('HE170006', 'F', -0.5)", '23514'),
      ],
      saiMau: [
        'CREATE TABLE tblStudent (studentID CHAR(8) PRIMARY KEY, fullName VARCHAR(60) NOT NULL, email VARCHAR(100), gpa DECIMAL(3,2) CHECK (gpa BETWEEN 0 AND 4))',
        'CREATE TABLE tblStudent (studentID CHAR(8) PRIMARY KEY, fullName VARCHAR(60) NOT NULL, email VARCHAR(100) UNIQUE, gpa DECIMAL(3,2) CHECK (gpa > 0 AND gpa < 4))',
      ],
      goiY: ['UNIQUE (email) forbids duplicates but still allows NULL.', 'CHECK (gpa BETWEEN 0 AND 4) — BETWEEN includes both ends.'],
      loiHayGap: [
        { en: 'CHECK (gpa > 0 AND gpa < 4) — rejects the valid boundary values 0 and 4.', vi: 'CHECK (gpa > 0 AND gpa < 4) — chặn nhầm giá trị biên hợp lệ 0 và 4.' },
        { en: 'Expecting UNIQUE to allow many NULL emails on SQL Server — it allows only ONE NULL there (PostgreSQL allows many). Test data here avoids that difference; remember it for the exam.', vi: 'Tưởng UNIQUE cho nhiều email NULL trên SQL Server — ở đó chỉ cho MỘT NULL (PostgreSQL cho nhiều). Dữ liệu kiểm ở đây tránh chỗ khác nhau này; nhớ khi thi.' },
        { en: 'DECIMAL(2,2) — only values below 1 fit; DECIMAL(3,2) holds 0.00…9.99.', vi: 'DECIMAL(2,2) — chỉ chứa số nhỏ hơn 1; DECIMAL(3,2) chứa 0.00…9.99.' },
      ],
      giaiThich: { en: '<p>DECIMAL(p,s): p digits in total, s of them after the decimal point. Naming constraints (uq_…, ck_…) gives readable error messages and lets you drop them later.</p>', vi: '<p>DECIMAL(p,s): tổng p chữ số, s chữ số sau dấu phẩy. Đặt tên ràng buộc (uq_…, ck_…) cho thông báo lỗi dễ đọc và xoá/sửa sau được.</p>' },
      thuatNgu: [TN.check, { en: 'UNIQUE', vi: 'không trùng' }, { en: 'DECIMAL(p,s)', vi: 'số thập phân p chữ số, s chữ số lẻ' }],
    }),
    sql({
      tieuDe: 'Enrollment: composite key and two foreign keys',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['composite primary key', 'FOREIGN KEY … REFERENCES', 'many-to-many'], the: ['ddl', 'foreign-key', 'composite-key'],
      csdl: BASE_SV, tenCsdl: 'StudentBase', luocDo: {
        en: '<p><b>Existing tables</b> (tab <code>StudentBase.sql</code>): <code>tblCourse(<u>courseID</u>, courseName, credits)</code>, <code>tblStudent(<u>studentID</u>, fullName, email, gpa)</code> with two students (HE170001, HE170002) and two courses (DBI202, PRF192).</p>',
        vi: '<p><b>Bảng đã có</b> (tab <code>StudentBase.sql</code>): <code>tblCourse(<u>courseID</u>, courseName, credits)</code>, <code>tblStudent(<u>studentID</u>, fullName, email, gpa)</code> với hai sinh viên (HE170001, HE170002) và hai môn (DBI202, PRF192).</p>',
      },
      moTa: {
        en: '<p>A student takes many courses, a course has many students, and a student may retake a course in another semester. Create <code>tblEnrollment(studentID, courseID, semester, grade)</code>: semester is CHAR(4) like <code>SU26</code>, grade DECIMAL(3,1) optional. The key is (studentID, courseID, semester); studentID and courseID reference the existing tables.</p>',
        vi: '<p>Một sinh viên học nhiều môn, một môn có nhiều sinh viên, và sinh viên có thể học lại ở kỳ khác. Tạo <code>tblEnrollment(studentID, courseID, semester, grade)</code>: semester CHAR(4) như <code>SU26</code>, grade DECIMAL(3,1) không bắt buộc. Khoá là (studentID, courseID, semester); studentID và courseID tham chiếu hai bảng đã có.</p>',
      },
      yeuCau: {
        en: ['Columns in order: studentID CHAR(8), courseID CHAR(6), semester CHAR(4), grade DECIMAL(3,1).', 'PRIMARY KEY (studentID, courseID, semester); two FOREIGN KEYs.'],
        vi: ['Cột theo thứ tự: studentID CHAR(8), courseID CHAR(6), semester CHAR(4), grade DECIMAL(3,1).', 'PRIMARY KEY (studentID, courseID, semester); hai FOREIGN KEY.'],
      },
      khoiDau: KHOI_DDL,
      giai: `CREATE TABLE tblEnrollment (
    studentID CHAR(8)      NOT NULL,
    courseID  CHAR(6)      NOT NULL,
    semester  CHAR(4)      NOT NULL,
    grade     DECIMAL(3,1) NULL,
    CONSTRAINT pk_enrollment         PRIMARY KEY (studentID, courseID, semester),
    CONSTRAINT fk_enrollment_student FOREIGN KEY (studentID) REFERENCES tblStudent (studentID),
    CONSTRAINT fk_enrollment_course  FOREIGN KEY (courseID)  REFERENCES tblCourse (courseID)
);`,
      kiem: [
        sau('Columns and types', cot('tblEnrollment'), { thuTu: true }),
        duoc('Valid enrollments, including a retake in another semester', "INSERT INTO tblEnrollment (studentID, courseID, semester, grade) VALUES ('HE170001', 'DBI202', 'SP26', 4.5), ('HE170001', 'DBI202', 'SU26', 7.0), ('HE170002', 'PRF192', 'SU26', NULL)"),
        chan('Same student, course and semester twice is rejected', "INSERT INTO tblEnrollment (studentID, courseID, semester) VALUES ('HE170002', 'DBI202', 'SU26'), ('HE170002', 'DBI202', 'SU26')", '23505'),
        chan('Unknown student is rejected (FOREIGN KEY)', "INSERT INTO tblEnrollment (studentID, courseID, semester) VALUES ('HE999999', 'DBI202', 'SU26')", '23503'),
        chan('Unknown course is rejected (FOREIGN KEY)', "INSERT INTO tblEnrollment (studentID, courseID, semester) VALUES ('HE170001', 'XXX999', 'SU26')", '23503'),
      ],
      saiMau: [
        'CREATE TABLE tblEnrollment (studentID CHAR(8), courseID CHAR(6), semester CHAR(4), grade DECIMAL(3,1), PRIMARY KEY (studentID, courseID))',
        'CREATE TABLE tblEnrollment (studentID CHAR(8), courseID CHAR(6), semester CHAR(4), grade DECIMAL(3,1), PRIMARY KEY (studentID, courseID, semester))',
      ],
      goiY: ['A composite key is declared at table level: PRIMARY KEY (col1, col2, col3).', 'FOREIGN KEY (studentID) REFERENCES tblStudent (studentID) — and the same for courseID.'],
      loiHayGap: [
        { en: 'PRIMARY KEY (studentID, courseID) — a retake in another semester becomes a duplicate.', vi: 'PRIMARY KEY (studentID, courseID) — học lại kỳ khác bị coi là trùng.' },
        { en: 'Writing PRIMARY KEY on each column separately — that is not allowed (a table has ONE primary key); list them together.', vi: 'Ghi PRIMARY KEY riêng cho từng cột — không được (bảng chỉ có MỘT khoá chính); liệt kê chung trong một ngoặc.' },
        { en: 'Forgetting the foreign keys — enrollments for non-existent students are accepted.', vi: 'Quên khoá ngoại — ghi danh cho sinh viên không tồn tại vẫn vào được.' },
      ],
      giaiThich: { en: '<p>A many-to-many relationship becomes a table whose key combines the keys of both sides (+ semester to allow retakes), and each part is a foreign key — rule 5 of "ERD → tables".</p>', vi: '<p>Liên kết nhiều-nhiều thành một bảng có khoá ghép từ khoá hai bên (+ kỳ học để cho học lại), mỗi phần là một khoá ngoại — quy tắc 5 của "ERD → bảng".</p>' },
      thuatNgu: [TN.fk, { en: 'composite key', vi: 'khoá ghép (nhiều cột)' }, TN.pk],
    }),
    sql({
      tieuDe: 'Defaults and allowed values for payments',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['DEFAULT', 'CHECK … IN (…)', 'foreign key'], the: ['ddl', 'default', 'check'],
      csdl: BASE_SV, tenCsdl: 'StudentBase', luocDo: {
        en: '<p><b>Existing tables</b> (tab <code>StudentBase.sql</code>): <code>tblStudent(<u>studentID</u>, …)</code> with HE170001 and HE170002.</p>',
        vi: '<p><b>Bảng đã có</b> (tab <code>StudentBase.sql</code>): <code>tblStudent(<u>studentID</u>, …)</code> với HE170001 và HE170002.</p>',
      },
      moTa: {
        en: '<p>Create <code>tblPayment(paymentID, studentID, amount, method, paidOn)</code>: paymentID INT primary key; studentID CHAR(8) required, referencing tblStudent; amount DECIMAL(10,2) <b>greater than 0</b>; method VARCHAR(10) that is <b>CASH, CARD or BANK</b> and <b>defaults to CASH</b>; paidOn DATE required.</p>',
        vi: '<p>Tạo <code>tblPayment(paymentID, studentID, amount, method, paidOn)</code>: paymentID INT khoá chính; studentID CHAR(8) bắt buộc, tham chiếu tblStudent; amount DECIMAL(10,2) <b>lớn hơn 0</b>; method VARCHAR(10) là <b>CASH, CARD hoặc BANK</b>, <b>mặc định CASH</b>; paidOn DATE bắt buộc.</p>',
      },
      yeuCau: {
        en: ['Columns in order: paymentID, studentID, amount, method, paidOn.', 'DEFAULT \'CASH\' and CHECK (method IN (\'CASH\', \'CARD\', \'BANK\')).'],
        vi: ['Cột theo thứ tự: paymentID, studentID, amount, method, paidOn.', 'DEFAULT \'CASH\' và CHECK (method IN (\'CASH\', \'CARD\', \'BANK\')).'],
      },
      khoiDau: KHOI_DDL,
      giai: `CREATE TABLE tblPayment (
    paymentID INT           NOT NULL,
    studentID CHAR(8)       NOT NULL,
    amount    DECIMAL(10,2) NOT NULL,
    method    VARCHAR(10)   NOT NULL DEFAULT 'CASH',
    paidOn    DATE          NOT NULL,
    CONSTRAINT pk_payment         PRIMARY KEY (paymentID),
    CONSTRAINT fk_payment_student FOREIGN KEY (studentID) REFERENCES tblStudent (studentID),
    CONSTRAINT ck_payment_amount  CHECK (amount > 0),
    CONSTRAINT ck_payment_method  CHECK (method IN ('CASH', 'CARD', 'BANK'))
);`,
      kiem: [
        sau('Columns and types', cot('tblPayment'), { thuTu: true }),
        sau('Omitting method stores CASH (DEFAULT)', "INSERT INTO tblPayment (paymentID, studentID, amount, paidOn) VALUES (1, 'HE170001', 2500000, '2026-09-01'); SELECT paymentID, method FROM tblPayment"),
        chan('Amount 0 is rejected', "INSERT INTO tblPayment (paymentID, studentID, amount, method, paidOn) VALUES (2, 'HE170001', 0, 'CARD', '2026-09-02')", '23514'),
        chan('Method CRYPTO is rejected', "INSERT INTO tblPayment (paymentID, studentID, amount, method, paidOn) VALUES (3, 'HE170002', 100, 'CRYPTO', '2026-09-02')", '23514'),
        chan('Unknown student is rejected', "INSERT INTO tblPayment (paymentID, studentID, amount, paidOn) VALUES (4, 'HE999999', 100, '2026-09-02')", '23503'),
      ],
      saiMau: [
        "CREATE TABLE tblPayment (paymentID INT PRIMARY KEY, studentID CHAR(8) NOT NULL REFERENCES tblStudent(studentID), amount DECIMAL(10,2) CHECK (amount > 0), method VARCHAR(10) CHECK (method IN ('CASH','CARD','BANK')), paidOn DATE NOT NULL)",
        "CREATE TABLE tblPayment (paymentID INT PRIMARY KEY, studentID CHAR(8) NOT NULL REFERENCES tblStudent(studentID), amount DECIMAL(10,2) CHECK (amount >= 0), method VARCHAR(10) DEFAULT 'CASH' CHECK (method IN ('CASH','CARD','BANK')), paidOn DATE NOT NULL)",
      ],
      goiY: ['DEFAULT \'CASH\' goes in the column definition.', 'CHECK (method IN (\'CASH\', \'CARD\', \'BANK\')) restricts the allowed values.'],
      loiHayGap: [
        { en: 'No DEFAULT — an INSERT without method stores NULL (and NULL passes a CHECK, because CHECK only rejects FALSE).', vi: 'Thiếu DEFAULT — INSERT không ghi method sẽ lưu NULL (và NULL lọt qua CHECK, vì CHECK chỉ chặn FALSE).' },
        { en: 'CHECK (amount >= 0) — the requirement says greater than 0.', vi: 'CHECK (amount >= 0) — đề yêu cầu lớn hơn 0.' },
      ],
      giaiThich: { en: '<p>A CHECK constraint rejects a row only when the condition is FALSE — UNKNOWN (NULL) passes. Combine CHECK with NOT NULL when the value is required.</p>', vi: '<p>Ràng buộc CHECK chỉ chặn khi điều kiện FALSE — UNKNOWN (NULL) thì lọt. Ghép CHECK với NOT NULL khi giá trị là bắt buộc.</p>' },
      thuatNgu: [TN.check, { en: 'DEFAULT', vi: 'giá trị mặc định' }, TN.fk],
    }),
    sql({
      tieuDe: 'Sections that disappear with their course (ON DELETE CASCADE)',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['weak entity', 'composite key containing a foreign key', 'ON DELETE CASCADE'], the: ['ddl', 'cascade', 'weak-entity'],
      csdl: BASE_SV, tenCsdl: 'StudentBase', luocDo: {
        en: '<p><b>Existing tables</b> (tab <code>StudentBase.sql</code>): <code>tblCourse(<u>courseID</u>, courseName, credits)</code> with DBI202 and PRF192.</p>',
        vi: '<p><b>Bảng đã có</b> (tab <code>StudentBase.sql</code>): <code>tblCourse(<u>courseID</u>, courseName, credits)</code> với DBI202 và PRF192.</p>',
      },
      moTa: {
        en: '<p>A <b>section</b> (class group) only exists inside its course: it is identified by the course + a section number (1, 2, 3…). Create <code>tblSection(courseID, sectionNo, room)</code> so that <b>deleting a course automatically deletes its sections</b>.</p>',
        vi: '<p><b>Lớp học phần</b> chỉ tồn tại trong môn của nó: định danh bằng môn + số lớp (1, 2, 3…). Tạo <code>tblSection(courseID, sectionNo, room)</code> sao cho <b>xoá môn thì các lớp của môn tự bị xoá</b>.</p>',
      },
      yeuCau: {
        en: ['Columns in order: courseID CHAR(6), sectionNo INT, room VARCHAR(10).', 'PRIMARY KEY (courseID, sectionNo); FOREIGN KEY courseID → tblCourse with ON DELETE CASCADE.'],
        vi: ['Cột theo thứ tự: courseID CHAR(6), sectionNo INT, room VARCHAR(10).', 'PRIMARY KEY (courseID, sectionNo); FOREIGN KEY courseID → tblCourse kèm ON DELETE CASCADE.'],
      },
      khoiDau: KHOI_DDL,
      giai: `CREATE TABLE tblSection (
    courseID  CHAR(6)     NOT NULL,
    sectionNo INT         NOT NULL,
    room      VARCHAR(10) NULL,
    CONSTRAINT pk_section        PRIMARY KEY (courseID, sectionNo),   -- weak entity: owner key + partial key
    CONSTRAINT fk_section_course FOREIGN KEY (courseID) REFERENCES tblCourse (courseID)
        ON DELETE CASCADE
);`,
      kiem: [
        sau('Columns and types', cot('tblSection'), { thuTu: true }),
        sau('Deleting DBI202 removes its sections only', "INSERT INTO tblSection (courseID, sectionNo, room) VALUES ('DBI202', 1, 'AL-R201'), ('DBI202', 2, 'AL-R202'), ('PRF192', 1, 'BE-110'); DELETE FROM tblCourse WHERE courseID = 'DBI202'; SELECT courseID, sectionNo, room FROM tblSection"),
        chan('Section number is unique only inside a course', "INSERT INTO tblSection (courseID, sectionNo) VALUES ('PRF192', 1), ('PRF192', 1)", '23505'),
        duoc('Same section number in two courses is fine', "INSERT INTO tblSection (courseID, sectionNo) VALUES ('PRF192', 1), ('DBI202', 1)"),
        chan('Section of an unknown course is rejected', "INSERT INTO tblSection (courseID, sectionNo) VALUES ('ZZZ999', 1)", '23503'),
      ],
      saiMau: [
        'CREATE TABLE tblSection (courseID CHAR(6) NOT NULL REFERENCES tblCourse(courseID), sectionNo INT NOT NULL, room VARCHAR(10), PRIMARY KEY (courseID, sectionNo))',
        'CREATE TABLE tblSection (courseID CHAR(6) NOT NULL REFERENCES tblCourse(courseID) ON DELETE CASCADE, sectionNo INT NOT NULL PRIMARY KEY, room VARCHAR(10))',
      ],
      goiY: ['A weak entity\'s key = owner\'s key + its own partial key: PRIMARY KEY (courseID, sectionNo).', 'Add ON DELETE CASCADE to the foreign key clause.'],
      loiHayGap: [
        { en: 'No CASCADE — deleting the course fails with a foreign-key error (SQL Server Msg 547) while sections exist.', vi: 'Thiếu CASCADE — xoá môn bị lỗi khoá ngoại (SQL Server Msg 547) khi còn lớp.' },
        { en: 'PRIMARY KEY (sectionNo) alone — section 1 can exist in only one course.', vi: 'Chỉ PRIMARY KEY (sectionNo) — số lớp 1 chỉ có ở một môn.' },
      ],
      giaiThich: { en: '<p>ON DELETE CASCADE propagates a delete from parent to children — right for a weak entity (a section is meaningless without its course), dangerous for independent data (never cascade from department to employees).</p>', vi: '<p>ON DELETE CASCADE lan lệnh xoá từ cha sang con — đúng cho thực thể yếu (lớp không có nghĩa khi môn bị xoá), nguy hiểm cho dữ liệu độc lập (đừng bao giờ cascade từ phòng sang nhân viên).</p>' },
      thuatNgu: [{ en: 'weak entity', vi: 'thực thể yếu' }, { en: 'ON DELETE CASCADE', vi: 'xoá lan theo khoá ngoại' }, TN.fk],
    }),
  ],
});

void ma;
