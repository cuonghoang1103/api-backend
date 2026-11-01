/**
 * DBI202 · 3.5 Thực hành Chương 3 — từ đoạn nghiệp vụ tới CREATE TABLE, luyện như câu 1 đề PE
 * (đăng ký học 1-M + M-N, cung ứng ba ngôi có mũi tên, CLB bóng đá 1-1 + đệ quy). Đề PE mini phòng khám: Lab 3.
 */
import { mod, de, cs, q, sau, chan, duoc, cot, YC_DDL, tn } from './_chung.mjs';

const DK = `CREATE TABLE Lecturer (
    lecturerID CHAR(6)     NOT NULL PRIMARY KEY,
    fullName   VARCHAR(50) NOT NULL
);
CREATE TABLE Course (
    courseCode CHAR(6)     NOT NULL PRIMARY KEY,
    courseName VARCHAR(80) NOT NULL,
    credits    INT         NOT NULL CHECK (credits BETWEEN 1 AND 10),
    lecturerID CHAR(6)     NOT NULL REFERENCES Lecturer (lecturerID)     -- teaches: 1-M, exactly one lecturer
);
CREATE TABLE Student (
    studentID CHAR(8)      NOT NULL PRIMARY KEY,
    fullName  VARCHAR(50)  NOT NULL,
    email     VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE Enroll (                                                     -- enrolls: M-N with attributes
    studentID  CHAR(8)      NOT NULL REFERENCES Student (studentID),
    courseCode CHAR(6)      NOT NULL REFERENCES Course (courseCode),
    semester   CHAR(4)      NOT NULL,
    grade      DECIMAL(4,2) NULL CHECK (grade BETWEEN 0 AND 10),
    PRIMARY KEY (studentID, courseCode, semester)                         -- a failed course can be retaken
);`;
const NEN = `INSERT INTO Lecturer VALUES ('L00001', 'Ha'); INSERT INTO Course VALUES ('DBI202', 'Databases', 3, 'L00001'); INSERT INTO Student VALUES ('HE190001', 'An', 'an@fpt.edu.vn');`;

export default mod('dbi202-on-ch3', '3.5 Practice: from a business paragraph to CREATE TABLE', [
  de({
    csdl: '', ld: null,
    t: 'Exercise 1 — course registration: 1-M and M-N', k: 'MEDIUM', p: 15,
    kn: ['1-M', 'M-N with attributes', 'retake ⇒ key with semester'], tag: ['erd', 'ddl', 'pe-q1'],
    en: '<p>FPTU stores students (student ID, full name, e-mail — unique), courses (course code, name, number of credits between 1 and 10) and lecturers (lecturer ID, full name). Each course is taught by exactly one lecturer; a lecturer can teach several courses. A student enrols in many courses each semester and gets a grade from 0 to 10; a failed course can be retaken in a later semester.</p><p>Names: <code>Lecturer(lecturerID CHAR(6), fullName VARCHAR(50))</code>, <code>Course(courseCode CHAR(6), courseName VARCHAR(80), credits INT, lecturerID)</code>, <code>Student(studentID CHAR(8), fullName VARCHAR(50), email VARCHAR(100))</code>, <code>Enroll(studentID, courseCode, semester CHAR(4), grade DECIMAL(4,2))</code>.</p>',
    vi: '<p>FPTU lưu sinh viên (mã, họ tên, e-mail — duy nhất), môn học (mã, tên, số tín chỉ từ 1 tới 10) và giảng viên (mã, họ tên). Mỗi môn do đúng một giảng viên dạy; một giảng viên dạy được nhiều môn. Sinh viên đăng ký nhiều môn mỗi kỳ và nhận điểm 0–10; môn trượt có thể học lại ở kỳ sau.</p><p>Tên bảng/cột như bản tiếng Anh.</p>',
    yc: [['teaches (1-M, exactly one) ⇒ Course.lecturerID NOT NULL FK.', 'teaches (1-M, đúng một) ⇒ Course.lecturerID NOT NULL FK.'], ['enrolls (M-N, retake allowed) ⇒ Enroll keyed by (studentID, courseCode, semester).', 'enrolls (M-N, được học lại) ⇒ Enroll có khoá (studentID, courseCode, semester).'], ['Every "unique" and "between" of the paragraph is a constraint.', 'Mọi chữ "duy nhất" và "từ … tới" trong đề đều là ràng buộc.'], YC_DDL],
    giai: DK,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Lecturer', 'Course', 'Student', 'Enroll'])),
      duoc(['Retaking DBI202 in a later semester is allowed', 'Học lại DBI202 ở kỳ sau được phép'], `${NEN} INSERT INTO Enroll VALUES ('HE190001', 'DBI202', 'SP26', 3.5), ('HE190001', 'DBI202', 'SU26', 7.0)`),
      chan(['Two enrolments in the same semester are rejected', 'Hai lần đăng ký cùng kỳ bị từ chối'], `${NEN} INSERT INTO Enroll VALUES ('HE190001', 'DBI202', 'SP26', 3.5), ('HE190001', 'DBI202', 'SP26', 7.0)`, '23505'),
      chan(['A course without a lecturer is rejected', 'Môn không có giảng viên bị từ chối'], `INSERT INTO Course (courseCode, courseName, credits) VALUES ('CSD201', 'DS', 3)`, '23502'),
      chan(['12 credits is rejected', '12 tín chỉ bị từ chối'], `INSERT INTO Lecturer VALUES ('L00001', 'Ha'); INSERT INTO Course VALUES ('CSD201', 'DS', 12, 'L00001')`, '23514'),
      chan(['Two students with the same e-mail are rejected', 'Hai sinh viên cùng e-mail bị từ chối'], `INSERT INTO Student VALUES ('HE190001', 'An', 'x@fpt.edu.vn'), ('HE190002', 'Binh', 'x@fpt.edu.vn')`, '23505', { an: true }),
      chan(['A grade of 11 is rejected', 'Điểm 11 bị từ chối'], `${NEN} INSERT INTO Enroll VALUES ('HE190001', 'DBI202', 'SP26', 11)`, '23514', { an: true }),
    ],
    sai: [DK.replace('PRIMARY KEY (studentID, courseCode, semester)', 'PRIMARY KEY (studentID, courseCode)'), DK.replace('lecturerID CHAR(6)     NOT NULL REFERENCES', 'lecturerID CHAR(6)     NULL REFERENCES')],
    gy: [['Nouns → entities, verbs → relationships, then ask the two cardinality questions.', 'Danh từ → thực thể, động từ → liên kết, rồi hỏi hai câu bản số.'], ['"can be retaken in a later semester" ⇒ semester must be part of Enroll\'s key.', '"có thể học lại ở kỳ sau" ⇒ semester phải nằm trong khoá của Enroll.']],
    lhg: [['Key (studentID, courseCode) — a retake is rejected.', 'Khoá (studentID, courseCode) — học lại bị từ chối.'], ['lecturerID nullable — "exactly one lecturer" becomes "at most one".', 'lecturerID cho phép NULL — "đúng một giảng viên" thành "tối đa một".']],
    gt: ['<p>Four tables. The PE marker\'s checklist: every table has a PK; every "belongs to / taught by" is a FK on the many side; the M-N is a table with a composite key; "unique" and "between" are UNIQUE and CHECK.</p>', '<p>Bốn bảng. Danh sách chấm PE: bảng nào cũng có PK; mọi "thuộc / do … dạy" là FK ở phía nhiều; M-N là bảng có khoá ghép; "duy nhất" và "từ … tới" là UNIQUE và CHECK.</p>'],
    tn: [tn('business rule', 'luật nghiệp vụ')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Exercise 4 — supplies with an arrow: each part for each project from ONE supplier', k: 'HARD', p: 12,
    kn: ['ternary with arrow', 'smaller key'], tag: ['erd', 'ddl', 'ternary', 'pe-q1'],
    en: '<p>Same Supplies as lesson 3.2, but now the diagram has an arrow to Supplier: <b>for a given part and project there is at most one supplier</b>. Create <code>Supplier(supID INT PK)</code>, <code>Part(partID INT PK)</code>, <code>Project(projID INT PK)</code>, <code>Supplies(supID INT, partID INT, projID INT, qty INT)</code>.</p>',
    vi: '<p>Cùng Supplies như bài 3.2, nhưng sơ đồ có mũi tên tới Supplier: <b>với một linh kiện và một dự án có tối đa một nhà cung cấp</b>. Tạo <code>Supplier(supID INT PK)</code>, <code>Part(partID INT PK)</code>, <code>Project(projID INT PK)</code>, <code>Supplies(supID INT, partID INT, projID INT, qty INT)</code>.</p>',
    yc: [['The arrow removes Supplier from the key: PRIMARY KEY (partID, projID).', 'Mũi tên đưa Supplier ra khỏi khoá: PRIMARY KEY (partID, projID).'], ['supID is still a NOT NULL foreign key; qty &gt; 0.', 'supID vẫn là khoá ngoại NOT NULL; qty &gt; 0.'], YC_DDL],
    giai: `CREATE TABLE Supplier (supID  INT NOT NULL PRIMARY KEY);
CREATE TABLE Part     (partID INT NOT NULL PRIMARY KEY);
CREATE TABLE Project  (projID INT NOT NULL PRIMARY KEY);
CREATE TABLE Supplies (
    supID  INT NOT NULL REFERENCES Supplier (supID),
    partID INT NOT NULL REFERENCES Part (partID),
    projID INT NOT NULL REFERENCES Project (projID),
    qty    INT NOT NULL CHECK (qty > 0),
    PRIMARY KEY (partID, projID)          -- (part, project) → supplier: the arrow shrinks the key
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Supplier', 'Part', 'Project', 'Supplies'])),
      duoc(['One supplier for many (part, project) pairs', 'Một NCC cho nhiều cặp (linh kiện, dự án)'], `INSERT INTO Supplier VALUES (1); INSERT INTO Part VALUES (10), (11); INSERT INTO Project VALUES (100); INSERT INTO Supplies VALUES (1, 10, 100, 5), (1, 11, 100, 2)`),
      chan(['A second supplier for the same part and project is rejected', 'NCC thứ hai cho cùng linh kiện và dự án bị từ chối'], `INSERT INTO Supplier VALUES (1), (2); INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100); INSERT INTO Supplies VALUES (1, 10, 100, 5), (2, 10, 100, 7)`, '23505'),
      chan(['A row without a supplier is rejected', 'Dòng không có NCC bị từ chối'], `INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100); INSERT INTO Supplies (partID, projID, qty) VALUES (10, 100, 5)`, '23502'),
      chan(['qty 0 is rejected', 'qty 0 bị từ chối'], `INSERT INTO Supplier VALUES (1); INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100); INSERT INTO Supplies VALUES (1, 10, 100, 0)`, '23514', { an: true }),
    ],
    sai: [`CREATE TABLE Supplier (supID INT NOT NULL PRIMARY KEY); CREATE TABLE Part (partID INT NOT NULL PRIMARY KEY); CREATE TABLE Project (projID INT NOT NULL PRIMARY KEY); CREATE TABLE Supplies (supID INT NOT NULL REFERENCES Supplier(supID), partID INT NOT NULL REFERENCES Part(partID), projID INT NOT NULL REFERENCES Project(projID), qty INT NOT NULL CHECK (qty > 0), PRIMARY KEY (supID, partID, projID));`],
    gy: [['An arrow into Supplier means (part, project) → supplier.', 'Mũi tên vào Supplier nghĩa là (linh kiện, dự án) → NCC.'], ['The entity at the arrowhead leaves the key.', 'Thực thể ở đầu mũi tên rời khỏi khoá.']],
    lhg: [['Keeping all three in the key — two suppliers for the same part/project slip in.', 'Giữ cả ba trong khoá — hai NCC cho cùng linh kiện/dự án lọt vào.'], ['Dropping the foreign key on supID because it is "not in the key".', 'Bỏ khoá ngoại ở supID vì "không nằm trong khoá".']],
    gt: ['<p>Compare with lesson 3.2: same columns, different key — the key encodes the business rule. In FD terms (Chapter 4): partID, projID → supID.</p>', '<p>So với bài 3.2: cùng cột, khác khoá — khoá mã hoá luật nghiệp vụ. Theo phụ thuộc hàm (Chương 4): partID, projID → supID.</p>'],
    tn: [tn('ternary relationship', 'liên kết ba ngôi')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Exercise 6 — football clubs: a 1-1 captain and a recursive mentor', k: 'HARD', p: 14,
    kn: ['1-1 with UNIQUE', 'recursive 1-M', 'two FKs between two tables'], tag: ['erd', 'ddl', 'recursive', 'pe-q1'],
    en: '<p>A club has many players; a player plays for exactly one club. Each club has exactly one captain, who is one of the players; a player captains at most one club. A player may be mentored by another player (at most one mentor). Create <code>Club(clubID INT PK, clubName VARCHAR(50) NOT NULL, captainID INT)</code> and <code>Player(playerID INT PK, fullName VARCHAR(50) NOT NULL, clubID INT NOT NULL, mentorID INT)</code>.</p>',
    vi: '<p>Một CLB có nhiều cầu thủ; một cầu thủ chơi cho đúng một CLB. Mỗi CLB có đúng một đội trưởng là một cầu thủ; một cầu thủ làm đội trưởng tối đa một CLB. Một cầu thủ có thể được một cầu thủ khác kèm cặp (tối đa một người). Tạo <code>Club(clubID INT PK, clubName VARCHAR(50) NOT NULL, captainID INT)</code> và <code>Player(playerID INT PK, fullName VARCHAR(50) NOT NULL, clubID INT NOT NULL, mentorID INT)</code>.</p>',
    yc: [['Player.clubID → Club; Player.mentorID → Player (nullable).', 'Player.clubID → Club; Player.mentorID → Player (cho phép NULL).'], ['captainID → Player with UNIQUE. The two tables reference each other: create both, then add the captain FK with ALTER TABLE … ADD CONSTRAINT.', 'captainID → Player kèm UNIQUE. Hai bảng tham chiếu lẫn nhau: tạo cả hai, rồi thêm khoá ngoại đội trưởng bằng ALTER TABLE … ADD CONSTRAINT.'], ['captainID may be NULL here (a new club has no player yet).', 'captainID ở đây được NULL (CLB mới chưa có cầu thủ).'], YC_DDL],
    giai: `CREATE TABLE Club (
    clubID    INT         NOT NULL PRIMARY KEY,
    clubName  VARCHAR(50) NOT NULL,
    captainID INT         NULL UNIQUE               -- 1-1: a player captains at most one club
);
CREATE TABLE Player (
    playerID INT         NOT NULL PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    clubID   INT         NOT NULL REFERENCES Club (clubID),        -- plays for: N-1
    mentorID INT         NULL REFERENCES Player (playerID)         -- recursive 1-M
);
ALTER TABLE Club ADD CONSTRAINT fk_club_captain FOREIGN KEY (captainID) REFERENCES Player (playerID);   -- cycle closed afterwards`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Club', 'Player'])),
      duoc(['Create a club, its players, a mentor and a captain', 'Tạo CLB, cầu thủ, người kèm cặp và đội trưởng'], `INSERT INTO Club (clubID, clubName) VALUES (1, 'CT FC'); INSERT INTO Player VALUES (10, 'An', 1, NULL), (11, 'Binh', 1, 10); UPDATE Club SET captainID = 10 WHERE clubID = 1`),
      chan(['A captain that is not a player is rejected', 'Đội trưởng không phải cầu thủ bị từ chối'], `INSERT INTO Club (clubID, clubName, captainID) VALUES (1, 'CT FC', 99)`, '23503'),
      chan(['One player captaining two clubs is rejected', 'Một cầu thủ làm đội trưởng hai CLB bị từ chối'], `INSERT INTO Club (clubID, clubName) VALUES (1, 'A'), (2, 'B'); INSERT INTO Player VALUES (10, 'An', 1, NULL); UPDATE Club SET captainID = 10`, '23505'),
      chan(['A mentor that does not exist is rejected', 'Người kèm cặp không tồn tại bị từ chối'], `INSERT INTO Club (clubID, clubName) VALUES (1, 'A'); INSERT INTO Player VALUES (10, 'An', 1, 77)`, '23503'),
      chan(['A player without a club is rejected', 'Cầu thủ không có CLB bị từ chối'], `INSERT INTO Player (playerID, fullName) VALUES (10, 'An')`, '23502', { an: true }),
    ],
    sai: [
      `CREATE TABLE Club (clubID INT NOT NULL PRIMARY KEY, clubName VARCHAR(50) NOT NULL, captainID INT NULL); CREATE TABLE Player (playerID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, clubID INT NOT NULL REFERENCES Club(clubID), mentorID INT NULL REFERENCES Player(playerID)); ALTER TABLE Club ADD CONSTRAINT fk_club_captain FOREIGN KEY (captainID) REFERENCES Player (playerID);`,
      `CREATE TABLE Club (clubID INT NOT NULL PRIMARY KEY, clubName VARCHAR(50) NOT NULL, captainID INT NULL UNIQUE); CREATE TABLE Player (playerID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, clubID INT NOT NULL REFERENCES Club(clubID), mentorID INT NULL);`,
    ],
    gy: [['Club references Player (captain) and Player references Club: create both tables first, then ALTER TABLE to add the second foreign key.', 'Club tham chiếu Player (đội trưởng) và Player tham chiếu Club: tạo cả hai bảng trước, rồi ALTER TABLE thêm khoá ngoại thứ hai.'], ['1-1 ⇒ UNIQUE on the foreign key column.', '1-1 ⇒ UNIQUE trên cột khoá ngoại.']],
    lhg: [['No UNIQUE on captainID — a player can captain two clubs (that is 1-M).', 'Không UNIQUE ở captainID — một cầu thủ làm đội trưởng hai CLB (đó là 1-M).'], ['Forgetting the foreign keys of the cycle because "CREATE TABLE Club cannot see Player yet".', 'Quên khoá ngoại của vòng vì "CREATE TABLE Club chưa thấy Player".']],
    gt: ['<p>Mutually referencing tables are created without one of the constraints, which is added later with ALTER TABLE … ADD CONSTRAINT — exactly the note at the end of lesson 3.4.</p>', '<p>Hai bảng tham chiếu lẫn nhau được tạo khi thiếu một ràng buộc, rồi thêm sau bằng ALTER TABLE … ADD CONSTRAINT — đúng ghi chú cuối bài 3.4.</p>'],
    tn: [tn('circular reference', 'tham chiếu vòng')],
  }),
  cs({
    t: 'Exercises 2–3 — composite, multivalued and derived attributes', k: 'EASY', p: 6,
    kn: ['attribute kinds'], tag: ['erd'],
    en: '<p>Hotel and online-shop briefs of the practice lesson: decide how each attribute is stored.</p>',
    vi: '<p>Đề khách sạn và cửa hàng trực tuyến của bài thực hành: quyết cách lưu từng thuộc tính.</p>',
    cau: [
      q('c1', ['A hotel has several phone numbers.', 'Một khách sạn có nhiều số điện thoại.'], ['a separate table HotelPhone(hotelID, phone)', 'a column phones VARCHAR(200) with commas', 'three columns phone1, phone2, phone3', 'a column of the Room table'], ['Multivalued ⇒ its own table keyed by (owner, value).', 'Đa trị ⇒ bảng riêng có khoá (chủ, giá trị).']),
      q('c2', ['A customer\'s shipping address = street, ward, district, city.', 'Địa chỉ giao hàng của khách = đường, phường, quận, thành phố.'], ['four columns in Customer', 'one table Address per customer', 'one text column with the four parts', 'a multivalued attribute'], ['Composite (single-valued) ⇒ one column per component.', 'Phức hợp (một giá trị) ⇒ mỗi thành phần một cột.']),
      q('c3', ['The age of a customer.', 'Tuổi của khách hàng.'], ['not stored: computed from birthDate', 'stored as INT and updated yearly', 'part of the key', 'a separate table Age'], ['Derived attributes are computed in queries or views.', 'Thuộc tính dẫn xuất được tính trong truy vấn hoặc view.']),
      q('c4', ['A room number is unique only inside its hotel.', 'Số phòng chỉ duy nhất trong khách sạn của nó.'], ['Room is weak: key (hotelID, roomNo)', 'Room is strong: key roomNo', 'roomNo is a multivalued attribute of Hotel', 'roomNo is a derived attribute'], ['Partial key + owner key ⇒ weak entity.', 'Khoá bộ phận + khoá chủ ⇒ thực thể yếu.']),
    ],
    gy: [['Single-valued but made of parts ⇒ composite ⇒ columns.', 'Một giá trị nhưng gồm nhiều phần ⇒ phức hợp ⇒ nhiều cột.'], ['Many values ⇒ multivalued ⇒ table.', 'Nhiều giá trị ⇒ đa trị ⇒ bảng.']],
    lhg: [['phone1, phone2, phone3 columns — a fourth phone breaks the design and empty slots are NULL.', 'Cột phone1, phone2, phone3 — số thứ tư phá thiết kế, ô trống thành NULL.'], ['Storing age.', 'Lưu tuổi.']],
    tn: [tn('multivalued attribute', 'thuộc tính đa trị')],
  }),
]);
