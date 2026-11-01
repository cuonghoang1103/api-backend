/**
 * DBI202 · 3.3 Lớp con (ISA) & ba cách lưu — Person/Student/Lecturer theo kiểu ER, kiểu một bảng rộng (cột phân loại + CHECK),
 * và so sánh ba chiến lược.
 */
import { mod, de, cs, q, bang1, sau, chan, duoc, cot, YC_DDL, tn } from './_chung.mjs';

export default mod('dbi202-er-subclass', '3.3 Subclasses (ISA) & three ways to store them', [
  de({
    csdl: '', ld: null,
    t: 'Strategy 1 (ER way): Person, Student, Lecturer', k: 'MEDIUM', p: 10,
    kn: ['ISA', 'subclass table', 'PK = FK'], tag: ['erd', 'ddl', 'subclass'],
    en: '<p><code>Person(personID INT PK, fullName VARCHAR(50) NOT NULL, email VARCHAR(80))</code> has two subclasses: <code>Student(personID, gpa DECIMAL(3,2))</code> and <code>Lecturer(personID, salary DECIMAL(12,0))</code>. One table per class; a subclass row holds only the key and its own attribute.</p>',
    vi: '<p><code>Person(personID INT PK, fullName VARCHAR(50) NOT NULL, email VARCHAR(80))</code> có hai lớp con: <code>Student(personID, gpa DECIMAL(3,2))</code> và <code>Lecturer(personID, salary DECIMAL(12,0))</code>. Mỗi lớp một bảng; dòng lớp con chỉ chứa khoá và thuộc tính riêng.</p>',
    yc: [['In Student and Lecturer, personID is the PRIMARY KEY and a FOREIGN KEY to Person (ON DELETE CASCADE).', 'Trong Student và Lecturer, personID là PRIMARY KEY và FOREIGN KEY tới Person (ON DELETE CASCADE).'], ['gpa between 0 and 4; salary &gt; 0.', 'gpa từ 0 tới 4; salary &gt; 0.'], YC_DDL],
    giai: `CREATE TABLE Person (
    personID INT         NOT NULL PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    email    VARCHAR(80) NULL
);
CREATE TABLE Student (
    personID INT          NOT NULL PRIMARY KEY REFERENCES Person (personID) ON DELETE CASCADE,
    gpa      DECIMAL(3,2) NULL CHECK (gpa BETWEEN 0 AND 4)
);
CREATE TABLE Lecturer (
    personID INT           NOT NULL PRIMARY KEY REFERENCES Person (personID) ON DELETE CASCADE,
    salary   DECIMAL(12,0) NULL CHECK (salary > 0)
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Person', 'Student', 'Lecturer'])),
      duoc(['A teaching assistant is both a student and a lecturer', 'Trợ giảng vừa là sinh viên vừa là giảng viên'], `INSERT INTO Person VALUES (1, 'An', NULL); INSERT INTO Student VALUES (1, 3.50); INSERT INTO Lecturer VALUES (1, 8000000)`),
      chan(['A student who is not a person is rejected', 'Sinh viên không có trong Person bị từ chối'], `INSERT INTO Student VALUES (9, 3.0)`, '23503'),
      chan(['gpa 5 is rejected', 'gpa 5 bị từ chối'], `INSERT INTO Person VALUES (1, 'An', NULL); INSERT INTO Student VALUES (1, 5.0)`, '23514'),
      sau(['Deleting the person deletes the subclass rows', 'Xoá người thì xoá luôn dòng lớp con'], `INSERT INTO Person VALUES (1, 'An', NULL), (2, 'Binh', NULL); INSERT INTO Student VALUES (1, 3.0), (2, 2.5); INSERT INTO Lecturer VALUES (1, 100); DELETE FROM Person WHERE personID = 1; SELECT (SELECT COUNT(*) FROM Student) AS students, (SELECT COUNT(*) FROM Lecturer) AS lecturers`),
    ],
    sai: [
      `CREATE TABLE Person (personID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, email VARCHAR(80)); CREATE TABLE Student (personID INT NOT NULL PRIMARY KEY, gpa DECIMAL(3,2) CHECK (gpa BETWEEN 0 AND 4)); CREATE TABLE Lecturer (personID INT NOT NULL PRIMARY KEY, salary DECIMAL(12,0) CHECK (salary > 0));`,
      `CREATE TABLE Person (personID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, email VARCHAR(80)); CREATE TABLE Student (personID INT NOT NULL PRIMARY KEY REFERENCES Person(personID) ON DELETE CASCADE, fullName VARCHAR(50), gpa DECIMAL(3,2) CHECK (gpa BETWEEN 0 AND 4)); CREATE TABLE Lecturer (personID INT NOT NULL PRIMARY KEY REFERENCES Person(personID) ON DELETE CASCADE, fullName VARCHAR(50), salary DECIMAL(12,0) CHECK (salary > 0));`,
    ],
    gy: [['Subclass table = (superclass key, own attributes); the key references the superclass.', 'Bảng lớp con = (khoá lớp cha, thuộc tính riêng); khoá tham chiếu lớp cha.'], ['personID INT NOT NULL PRIMARY KEY REFERENCES Person (personID) ON DELETE CASCADE', 'personID INT NOT NULL PRIMARY KEY REFERENCES Person (personID) ON DELETE CASCADE']],
    lhg: [['No REFERENCES — a "student" can exist with no person row.', 'Không REFERENCES — có "sinh viên" mà không có dòng Person.'], ['Copying fullName into the subclass tables — redundant and can disagree.', 'Chép fullName vào bảng lớp con — dư thừa và có thể lệch nhau.']],
    gt: ['<p>Reading a student\'s full data needs a join Person ⋈ Student — the price of no NULLs and no redundancy.</p>', '<p>Đọc đủ thông tin một sinh viên cần phép nối Person ⋈ Student — cái giá cho việc không NULL và không dư thừa.</p>'],
    tn: [tn('ISA / subclass', 'lớp con')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Strategy 3 (one wide table) with a type column', k: 'HARD', p: 12,
    kn: ['single-table inheritance', 'discriminator', 'table-level CHECK'], tag: ['erd', 'ddl', 'subclass', 'check'],
    en: '<p>Store full-time and part-time staff in ONE table: <code>Staff(staffID INT PK, fullName VARCHAR(50) NOT NULL, staffType CHAR(1) NOT NULL, monthlySalary DECIMAL(12,0), hourlyRate DECIMAL(10,0))</code>. <code>staffType</code> is \'F\' or \'P\'. A full-time row must have a monthly salary and no hourly rate; a part-time row the opposite.</p>',
    vi: '<p>Lưu nhân viên toàn thời gian và bán thời gian trong MỘT bảng: <code>Staff(staffID INT PK, fullName VARCHAR(50) NOT NULL, staffType CHAR(1) NOT NULL, monthlySalary DECIMAL(12,0), hourlyRate DECIMAL(10,0))</code>. <code>staffType</code> là \'F\' hoặc \'P\'. Dòng toàn thời gian phải có lương tháng và không có lương giờ; bán thời gian thì ngược lại.</p>',
    yc: [['CHECK (staffType IN (\'F\', \'P\')).', 'CHECK (staffType IN (\'F\', \'P\')).'], ['A table-level CHECK tying the type to which salary column is filled.', 'Một CHECK cấp bảng ràng loại nhân viên với cột lương nào được điền.'], YC_DDL],
    giai: `CREATE TABLE Staff (
    staffID       INT           NOT NULL PRIMARY KEY,
    fullName      VARCHAR(50)   NOT NULL,
    staffType     CHAR(1)       NOT NULL CHECK (staffType IN ('F', 'P')),   -- discriminator
    monthlySalary DECIMAL(12,0) NULL,
    hourlyRate    DECIMAL(10,0) NULL,
    CONSTRAINT ck_staff_kind CHECK (
        (staffType = 'F' AND monthlySalary IS NOT NULL AND hourlyRate IS NULL) OR
        (staffType = 'P' AND hourlyRate IS NOT NULL AND monthlySalary IS NULL))
);`,
    kiem: [
      sau(['Columns', 'Các cột'], cot(['Staff'])),
      duoc(['One full-time and one part-time row', 'Một dòng toàn thời gian, một dòng bán thời gian'], `INSERT INTO Staff VALUES (1, 'An', 'F', 15000000, NULL), (2, 'Binh', 'P', NULL, 50000)`),
      chan(['Type X is rejected', 'Loại X bị từ chối'], `INSERT INTO Staff VALUES (3, 'Chi', 'X', 1, NULL)`, '23514'),
      chan(['Full-time without a monthly salary is rejected', 'Toàn thời gian thiếu lương tháng bị từ chối'], `INSERT INTO Staff VALUES (4, 'Dung', 'F', NULL, NULL)`, '23514'),
      chan(['Part-time with BOTH salaries is rejected', 'Bán thời gian có CẢ HAI loại lương bị từ chối'], `INSERT INTO Staff VALUES (5, 'Em', 'P', 9000000, 50000)`, '23514'),
    ],
    sai: [
      `CREATE TABLE Staff (staffID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, staffType CHAR(1) NOT NULL CHECK (staffType IN ('F','P')), monthlySalary DECIMAL(12,0), hourlyRate DECIMAL(10,0));`,
      `CREATE TABLE Staff (staffID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, staffType CHAR(1) NOT NULL CHECK (staffType IN ('F','P')), monthlySalary DECIMAL(12,0), hourlyRate DECIMAL(10,0), CHECK ((staffType = 'F' AND monthlySalary IS NOT NULL) OR (staffType = 'P' AND hourlyRate IS NOT NULL)));`,
    ],
    gy: [['The discriminator column says which subclass a row belongs to.', 'Cột phân loại cho biết dòng thuộc lớp con nào.'], ['One CHECK with two branches joined by OR: (F AND salary AND no rate) OR (P AND rate AND no salary).', 'Một CHECK hai nhánh nối bằng OR: (F VÀ có lương tháng VÀ không lương giờ) OR (P VÀ có lương giờ VÀ không lương tháng).']],
    lhg: [['Only CHECK (staffType IN …) — a full-time employee without a salary slips in.', 'Chỉ CHECK (staffType IN …) — nhân viên toàn thời gian không lương vẫn lọt.'], ['Forgetting "and the other column IS NULL" — a part-time row with both salaries passes.', 'Quên "và cột kia IS NULL" — dòng bán thời gian có cả hai loại lương vẫn qua.']],
    gt: ['<p>The wide table avoids joins but pays with NULLs and with rules that the database cannot see unless you write them as CHECKs — this is the trade-off of lesson 3.3.</p>', '<p>Bảng rộng tránh được phép nối nhưng trả giá bằng NULL và bằng những luật CSDL không tự thấy nếu bạn không viết thành CHECK — đó là đánh đổi của bài 3.3.</p>'],
    tn: [tn('discriminator column', 'cột phân loại')],
  }),
  cs({
    t: 'Which strategy would you defend?', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['strategy trade-offs'], tag: ['erd', 'subclass'],
    en: '<p>The comparison table you must be able to argue (lesson 3.3). For each property, which strategy wins?</p>',
    vi: '<p>Bảng so sánh bạn phải biện luận được (bài 3.3). Với mỗi tiêu chí, chiến lược nào thắng?</p>',
    bang: [bang1('b1', ['Property → best strategy', 'Tiêu chí → chiến lược tốt nhất'],
      [{ ma: 'tc', ten: 'Property / Tiêu chí' }, { ma: 'cl', ten: 'Best / Tốt nhất', luaChon: ['ER (table per class)', 'OO (table per concrete class)', 'single wide table'] }],
      [{ o: { tc: 'Fewest NULL values' }, a: { cl: 'OO (table per concrete class)' } },
        { o: { tc: 'No join needed to read one person with all attributes' }, a: { cl: 'single wide table' } },
        { o: { tc: 'Easiest to query "all people" without UNION, while keeping subclass attributes out of the superclass table' }, a: { cl: 'ER (table per class)' } },
        { o: { tc: 'Adding a new subclass without touching existing tables' }, a: { cl: 'ER (table per class)' } }],
      ['OO has no NULLs at all (each table has exactly the attributes its objects have). The wide table needs no join. ER keeps all common data in the superclass table, so "all people" is one SELECT and a new subclass is just one new table.', 'OO không có NULL nào (mỗi bảng đúng các thuộc tính đối tượng của nó có). Bảng rộng không cần nối. ER giữ dữ liệu chung ở bảng lớp cha nên "mọi người" là một SELECT và thêm lớp con chỉ là thêm một bảng.'])],
    gy: [['Ask: where do the common attributes live in each strategy?', 'Hỏi: thuộc tính chung nằm ở đâu trong từng chiến lược?'], ['NULLs appear when a row has columns that do not apply to it.', 'NULL xuất hiện khi một dòng có cột không áp dụng cho nó.']],
    lhg: [['Thinking the wide table has the fewest NULLs — it has the most.', 'Tưởng bảng rộng ít NULL nhất — nó nhiều NULL nhất.'], ['Claiming OO makes "all people" easy — it needs a UNION over every table.', 'Cho rằng OO làm "mọi người" dễ — nó cần UNION qua mọi bảng.']],
    tn: [tn('single-table inheritance', 'kế thừa một bảng')],
  }),
]);
