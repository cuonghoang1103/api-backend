/**
 * DBI202 · 4.1 Phụ thuộc hàm & 1NF–BCNF — ví dụ có lời giải của bài (Enrollment → Student, Department, Course, Enrollment)
 * làm thật bằng SQL, đọc vi phạm từng FD, dị thường.
 */
import { mod, de, cs, q, bang1, sau, ma, cot, TN, tn } from './_chung.mjs';

const FLAT = String.raw`
CREATE TABLE EnrollmentFlat (
  StudentID   CHAR(8)      NOT NULL,
  StudentName NVARCHAR(40) NOT NULL,
  StudentDept CHAR(3)      NOT NULL,
  DeptHead    NVARCHAR(40) NOT NULL,
  CourseID    CHAR(6)      NOT NULL,
  CourseName  NVARCHAR(40) NOT NULL,
  Grade       DECIMAL(4,2) NULL,
  CONSTRAINT pk_enrollmentflat PRIMARY KEY (StudentID, CourseID)
);
INSERT INTO EnrollmentFlat VALUES
 ('HE190001', N'An',   'SE', N'Dr. Hoa',  'DBI202', N'Database Systems', 8.5),
 ('HE190001', N'An',   'SE', N'Dr. Hoa',  'CSD201', N'Data Structures',  7.0),
 ('HE190002', N'Bình', 'SE', N'Dr. Hoa',  'DBI202', N'Database Systems', 6.5),
 ('HE190003', N'Chi',  'AI', N'Dr. Minh', 'DBI202', N'Database Systems', 9.0),
 ('HE190003', N'Chi',  'AI', N'Dr. Minh', 'AIL303', N'Machine Learning', NULL);
`;
const LD = {
  en: '<p><b>The 1NF table of the worked example</b> (tab <code>EnrollmentFlat.sql</code>): <code>EnrollmentFlat(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade)</code>, key (StudentID, CourseID). FDs: StudentID → StudentName, StudentDept · StudentDept → DeptHead · CourseID → CourseName · StudentID, CourseID → Grade.</p>',
  vi: '<p><b>Bảng 1NF của ví dụ có lời giải</b> (tab <code>EnrollmentFlat.sql</code>): <code>EnrollmentFlat(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade)</code>, khoá (StudentID, CourseID). FD: StudentID → StudentName, StudentDept · StudentDept → DeptHead · CourseID → CourseName · StudentID, CourseID → Grade.</p>',
};
const GIAI = `CREATE TABLE Department (
    StudentDept CHAR(3)     NOT NULL PRIMARY KEY,
    DeptHead    VARCHAR(40) NOT NULL
);
CREATE TABLE Student (
    StudentID   CHAR(8)     NOT NULL PRIMARY KEY,
    StudentName VARCHAR(40) NOT NULL,
    StudentDept CHAR(3)     NOT NULL REFERENCES Department (StudentDept)
);
CREATE TABLE Course (
    CourseID   CHAR(6)     NOT NULL PRIMARY KEY,
    CourseName VARCHAR(40) NOT NULL
);
CREATE TABLE Enrollment (
    StudentID CHAR(8)      NOT NULL REFERENCES Student (StudentID),
    CourseID  CHAR(6)      NOT NULL REFERENCES Course (CourseID),
    Grade     DECIMAL(4,2) NULL,
    PRIMARY KEY (StudentID, CourseID)
);
INSERT INTO Department SELECT DISTINCT StudentDept, DeptHead FROM EnrollmentFlat;          -- 3NF: the transitive FD
INSERT INTO Student    SELECT DISTINCT StudentID, StudentName, StudentDept FROM EnrollmentFlat;   -- 2NF: partial FD on StudentID
INSERT INTO Course     SELECT DISTINCT CourseID, CourseName FROM EnrollmentFlat;           -- 2NF: partial FD on CourseID
INSERT INTO Enrollment SELECT StudentID, CourseID, Grade FROM EnrollmentFlat;              -- the whole key`;
const THEM = `INSERT INTO EnrollmentFlat VALUES ('HE190004', N'Dũng', 'GD', N'Dr. Lan', 'DBI202', N'Database Systems', 7.5), ('HE190004', N'Dũng', 'GD', N'Dr. Lan', 'PRF192', N'Programming', 8.0)`;

export default mod('dbi202-chuan-hoa', '4.1 Functional dependencies & 1NF–BCNF', [
  cs({
    t: 'Which normal form does each FD break?', k: 'EASY', p: 7, loai: 'table',
    kn: ['partial dependency', 'transitive dependency'], tag: ['normalization'],
    en: '<p>The worked example: Enrollment(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade), key (StudentID, CourseID). For each FD say what kind of dependency it is and which normal form it violates.</p>',
    vi: '<p>Ví dụ có lời giải: Enrollment(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade), khoá (StudentID, CourseID). Với mỗi FD cho biết loại phụ thuộc và dạng chuẩn nó vi phạm.</p>',
    bang: [bang1('b1', ['FD → violation', 'FD → vi phạm'],
      [{ ma: 'fd', ten: 'FD' }, { ma: 'loai', ten: 'Kind / Loại', luaChon: ['full dependency on the key', 'partial dependency', 'transitive dependency'] }, { ma: 'vp', ten: 'Violates / Vi phạm', luaChon: ['nothing', '2NF', '3NF'] }],
      [{ o: { fd: 'StudentID, CourseID → Grade' }, a: { loai: 'full dependency on the key', vp: 'nothing' } },
        { o: { fd: 'StudentID → StudentName' }, a: { loai: 'partial dependency', vp: '2NF' } },
        { o: { fd: 'CourseID → CourseName' }, a: { loai: 'partial dependency', vp: '2NF' } },
        { o: { fd: 'StudentDept → DeptHead (inside Student after the 2NF split)' }, a: { loai: 'transitive dependency', vp: '3NF' } }],
      ['Partial = depends on half of the composite key ⇒ 2NF. Transitive = non-key → non-key (StudentID → StudentDept → DeptHead) ⇒ 3NF.', 'Bộ phận = phụ thuộc một nửa khoá ghép ⇒ 2NF. Bắc cầu = không khoá → không khoá (StudentID → StudentDept → DeptHead) ⇒ 3NF.'])],
    gy: [['Compare the left side with the key: part of it ⇒ partial; outside it ⇒ transitive.', 'So vế trái với khoá: là một phần khoá ⇒ bộ phận; nằm ngoài khoá ⇒ bắc cầu.'], ['A dependency on the whole key is fine.', 'Phụ thuộc vào cả khoá thì ổn.']],
    lhg: [['Calling StudentDept → DeptHead partial — StudentDept is not part of the key.', 'Gọi StudentDept → DeptHead là bộ phận — StudentDept không thuộc khoá.'], ['Thinking 2NF already removes transitive dependencies.', 'Tưởng 2NF đã xoá phụ thuộc bắc cầu.']],
    tn: [tn('full functional dependency', 'phụ thuộc đầy đủ')],
  }),
  de({
    csdl: FLAT, tenCsdl: 'EnrollmentFlat', ld: LD,
    t: 'Normalize the worked example to 3NF — with real tables', k: 'HARD', p: 18,
    kn: ['2NF and 3NF decomposition', 'INSERT … SELECT DISTINCT'], tag: ['normalization', '3nf', 'decomposition'],
    en: '<p>Carry out the worked example of lesson 4.1 on real data: create <code>Department(StudentDept CHAR(3) PK, DeptHead VARCHAR(40))</code>, <code>Student(StudentID CHAR(8) PK, StudentName VARCHAR(40), StudentDept → Department)</code>, <code>Course(CourseID CHAR(6) PK, CourseName VARCHAR(40))</code>, <code>Enrollment(StudentID → Student, CourseID → Course, Grade DECIMAL(4,2))</code> with key (StudentID, CourseID); then move every row of EnrollmentFlat into them.</p>',
    vi: '<p>Làm ví dụ có lời giải của bài 4.1 trên dữ liệu thật: tạo <code>Department(StudentDept CHAR(3) PK, DeptHead VARCHAR(40))</code>, <code>Student(StudentID CHAR(8) PK, StudentName VARCHAR(40), StudentDept → Department)</code>, <code>Course(CourseID CHAR(6) PK, CourseName VARCHAR(40))</code>, <code>Enrollment(StudentID → Student, CourseID → Course, Grade DECIMAL(4,2))</code> khoá (StudentID, CourseID); rồi chuyển mọi dòng của EnrollmentFlat vào đó.</p>',
    yc: [['Four CREATE TABLE (parents first) and four INSERT … SELECT.', 'Bốn CREATE TABLE (cha trước) và bốn INSERT … SELECT.'], ['Each department, student and course stored once.', 'Mỗi phòng, sinh viên, môn lưu một lần.'], ['VARCHAR instead of NVARCHAR here.', 'Ở đây dùng VARCHAR thay NVARCHAR.']],
    giai: GIAI,
    kiem: [
      sau(['The four tables and their columns', 'Bốn bảng và các cột'], cot(['Department', 'Student', 'Course', 'Enrollment'])),
      sau(['Department', 'Department'], 'SELECT StudentDept, DeptHead FROM Department'),
      sau(['Student', 'Student'], 'SELECT StudentID, StudentName, StudentDept FROM Student'),
      sau(['Course', 'Course'], 'SELECT CourseID, CourseName FROM Course'),
      sau(['Enrollment', 'Enrollment'], 'SELECT StudentID, CourseID, Grade FROM Enrollment'),
      sau(['Hidden: new department, student and course', 'Ẩn: phòng, sinh viên, môn mới'], 'SELECT (SELECT COUNT(*) FROM Department) AS d, (SELECT COUNT(*) FROM Student) AS s, (SELECT COUNT(*) FROM Course) AS c, (SELECT COUNT(*) FROM Enrollment) AS e', { an: true, themCsdl: THEM }),
      ma(['Uses INSERT … SELECT', 'Dùng INSERT … SELECT'], '\\bINSERT\\s+INTO\\s+Department\\b[^;]*\\bSELECT\\b'),
    ],
    sai: [
      GIAI.replace("    StudentDept CHAR(3)     NOT NULL REFERENCES Department (StudentDept)\n", "    StudentDept CHAR(3)     NOT NULL,\n    DeptHead    VARCHAR(40) NOT NULL\n").replace('INSERT INTO Student    SELECT DISTINCT StudentID, StudentName, StudentDept FROM EnrollmentFlat;', 'INSERT INTO Student    SELECT DISTINCT StudentID, StudentName, StudentDept, DeptHead FROM EnrollmentFlat;'),
      GIAI.replace("INSERT INTO Department SELECT DISTINCT StudentDept, DeptHead FROM EnrollmentFlat;", "INSERT INTO Department VALUES ('SE', 'Dr. Hoa'), ('AI', 'Dr. Minh');"),
    ],
    gy: [['Step 1 (2NF): split off what depends on StudentID alone and on CourseID alone.', 'Bước 1 (2NF): tách phần chỉ phụ thuộc StudentID và phần chỉ phụ thuộc CourseID.'], ['Step 2 (3NF): inside Student, StudentDept → DeptHead is transitive — move it to Department.', 'Bước 2 (3NF): trong Student, StudentDept → DeptHead là bắc cầu — đưa ra Department.']],
    lhg: [['Stopping at 2NF: DeptHead stays in Student and is repeated for every student of the department.', 'Dừng ở 2NF: DeptHead nằm lại trong Student và lặp cho mọi sinh viên của phòng.'], ['Typing the departments by hand — a new department in the data breaks the Student INSERT.', 'Gõ tay các phòng — phòng mới trong dữ liệu làm hỏng INSERT Student.']],
    gt: ['<p>Result: 4 tables in 3NF — and in BCNF, because every determinant (StudentID, StudentDept, CourseID, the pair) is the key of its own table. Joining them back reproduces EnrollmentFlat.</p>', '<p>Kết quả: 4 bảng ở 3NF — và cả BCNF, vì mọi định thuộc (StudentID, StudentDept, CourseID, cặp khoá) là khoá của bảng mình. Nối lại cho đúng EnrollmentFlat.</p>'],
    tn: [tn('normalization', 'chuẩn hoá')],
  }),
  cs({
    t: 'What normalization removes', k: 'EASY', p: 6,
    kn: ['anomalies', 'normal forms'], tag: ['normalization'],
    en: '<p>Lesson 4.1 summary.</p>', vi: '<p>Tóm tắt bài 4.1.</p>',
    cau: [
      q('c1', ['In EnrollmentFlat, a new course with no student yet cannot be stored. This is…', 'Trong EnrollmentFlat, môn mới chưa có sinh viên thì không lưu được. Đây là…'], ['an insertion anomaly', 'an update anomaly', 'a deletion anomaly', 'a lossy join'], ['StudentID is part of the key and cannot be NULL, so a course alone has no row.', 'StudentID là một phần khoá, không NULL được, nên môn đứng một mình không có dòng nào.']),
      q('c2', ['The head of department SE changes; in EnrollmentFlat you must update…', 'Trưởng khoa SE đổi; trong EnrollmentFlat bạn phải sửa…'], ['every row of every SE student', 'one row', 'only the Course rows', 'nothing: DeptHead is derived'], ['DeptHead is repeated per enrolment of every SE student — the update anomaly 3NF removes.', 'DeptHead lặp theo mỗi lượt đăng ký của mọi sinh viên SE — dị thường cập nhật mà 3NF loại bỏ.']),
      q('c3', ['After the 3NF decomposition, how many rows change when the SE head changes?', 'Sau phân rã 3NF, đổi trưởng khoa SE thì sửa bao nhiêu dòng?'], ['1 — the Department row', 'one per SE student', 'one per enrolment', '0'], ['One fact, one place.', 'Một sự kiện, một chỗ.']),
      q('c4', ['Normalization mainly trades…', 'Chuẩn hoá chủ yếu đánh đổi…'], ['redundancy and anomalies for extra joins', 'joins for more redundancy', 'keys for indexes', 'nothing — it is free'], ['Reads need joins; writes become safe. Chapter 8 and CS.6 discuss when to denormalize on purpose.', 'Đọc cần nối; ghi trở nên an toàn. Chương 8 và CS.6 bàn khi nào cố ý phi chuẩn hoá.']),
    ],
    gy: [['Ask what a single fact (a department head) costs to change.', 'Hỏi đổi một sự kiện (trưởng khoa) tốn bao nhiêu.'], ['Anomalies disappear when each fact lives in one row.', 'Dị thường biến mất khi mỗi sự kiện nằm ở một dòng.']],
    lhg: [['Thinking normalization makes queries faster — it usually adds joins.', 'Tưởng chuẩn hoá làm truy vấn nhanh hơn — thường nó thêm phép nối.'], ['Mixing insertion and deletion anomalies.', 'Nhầm dị thường chèn và xoá.']],
    tn: [tn('anomaly', 'dị thường')],
  }),
]);
