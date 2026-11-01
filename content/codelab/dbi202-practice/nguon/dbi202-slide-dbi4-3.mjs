/**
 * DBI202 · 4.C Slide trường Chương 3 (39–58) — từ 1NF lên 2NF bốn bước (bảng đăng ký phẳng → Student, Course, Enroll bằng SQL),
 * rồi kiểm 3NF. Đáp án dạng chuẩn tính bằng _fd.mjs.
 */
import { mod, de, cs, q, bang1, sau, ma, TN, tn } from './_chung.mjs';
import { F, keys, nf, bienTheKhoa } from './_fd.mjs';

const PHANG = String.raw`
CREATE TABLE EnrollFlat (
  studentID   CHAR(8)      NOT NULL,
  studentName NVARCHAR(40) NOT NULL,
  courseID    CHAR(6)      NOT NULL,
  courseTitle NVARCHAR(40) NOT NULL,
  credits     INT          NOT NULL,
  grade       DECIMAL(4,2) NULL,
  CONSTRAINT pk_enrollflat PRIMARY KEY (studentID, courseID)
);
INSERT INTO EnrollFlat VALUES
 ('HE190001', N'Nguyễn An',  'DBI202', N'Database Systems', 3, 8.5),
 ('HE190001', N'Nguyễn An',  'CSD201', N'Data Structures',  3, 7.0),
 ('HE190002', N'Trần Bình',  'DBI202', N'Database Systems', 3, 6.0),
 ('HE190003', N'Lê Chi',     'DBI202', N'Database Systems', 3, NULL),
 ('HE190003', N'Lê Chi',     'MAE101', N'Mathematics',      3, 9.0);
`;
const LD = {
  en: '<p><b>A flat 1NF table</b> (tab <code>EnrollFlat.sql</code>): <code>EnrollFlat(studentID, studentName, courseID, courseTitle, credits, grade)</code>, key (studentID, courseID). FDs: studentID → studentName; courseID → courseTitle, credits; studentID, courseID → grade.</p>',
  vi: '<p><b>Bảng phẳng ở 1NF</b> (tab <code>EnrollFlat.sql</code>): <code>EnrollFlat(studentID, studentName, courseID, courseTitle, credits, grade)</code>, khoá (studentID, courseID). FD: studentID → studentName; courseID → courseTitle, credits; studentID, courseID → grade.</p>',
};
const GIAI = `CREATE TABLE Student (
    studentID   CHAR(8)     NOT NULL PRIMARY KEY,
    studentName VARCHAR(40) NOT NULL
);
CREATE TABLE Course (
    courseID    CHAR(6)     NOT NULL PRIMARY KEY,
    courseTitle VARCHAR(40) NOT NULL,
    credits     INT         NOT NULL
);
CREATE TABLE Enroll (
    studentID CHAR(8)      NOT NULL REFERENCES Student (studentID),
    courseID  CHAR(6)      NOT NULL REFERENCES Course (courseID),
    grade     DECIMAL(4,2) NULL,
    PRIMARY KEY (studentID, courseID)
);
INSERT INTO Student SELECT DISTINCT studentID, studentName FROM EnrollFlat;           -- the part that depends on studentID only
INSERT INTO Course  SELECT DISTINCT courseID, courseTitle, credits FROM EnrollFlat;   -- the part that depends on courseID only
INSERT INTO Enroll  SELECT studentID, courseID, grade FROM EnrollFlat;                -- what depends on the whole key`;
const THEM = `INSERT INTO EnrollFlat VALUES ('HE190004', N'Phạm Dũng', 'PRF192', N'Programming', 3, 5.5), ('HE190002', N'Trần Bình', 'PRF192', N'Programming', 3, 7.5)`;

const BAI = [
  ['R(A, B, C, D), F = {A → B, C → D}', 'ABCD', F('A->B', 'C->D')],
  ['R(A, B, C, D, E), F = {AB → C, C → D, D → E}', 'ABCDE', F('AB->C', 'C->D', 'D->E')],
  ['R(A, B, C, D), F = {AB → CD, D → A}', 'ABCD', F('AB->CD', 'D->A')],
  ['R(A, B, C), F = {A → B, B → C, C → A}', 'ABC', F('A->B', 'B->C', 'C->A')],
  ['R(S, C, N, T, G), F = {S → N, C → T, SC → G}', 'SCNTG', F('S->N', 'C->T', 'SC->G')],
];

export default mod('dbi202-slide-dbi4-3', '4.C Reaching 2NF step by step, then the 3NF check (slides 39–58)', [
  de({
    csdl: PHANG, tenCsdl: 'EnrollFlat', ld: LD,
    t: 'From 1NF to 2NF: split EnrollFlat into Student, Course, Enroll', k: 'MEDIUM', p: 14,
    kn: ['partial dependency', '2NF decomposition', 'INSERT … SELECT DISTINCT'], tag: ['normalization', '2nf', 'decomposition'],
    en: '<p>studentName depends on studentID only and courseTitle, credits on courseID only — partial dependencies on the key (studentID, courseID). Apply the four steps of slides 39–50: create <code>Student(studentID CHAR(8) PK, studentName VARCHAR(40))</code>, <code>Course(courseID CHAR(6) PK, courseTitle VARCHAR(40), credits INT)</code>, <code>Enroll(studentID, courseID, grade DECIMAL(4,2))</code> with key (studentID, courseID) and two foreign keys, then fill them from EnrollFlat.</p>',
    vi: '<p>studentName chỉ phụ thuộc studentID, courseTitle và credits chỉ phụ thuộc courseID — phụ thuộc bộ phận vào khoá (studentID, courseID). Làm bốn bước của slide 39–50: tạo <code>Student(studentID CHAR(8) PK, studentName VARCHAR(40))</code>, <code>Course(courseID CHAR(6) PK, courseTitle VARCHAR(40), credits INT)</code>, <code>Enroll(studentID, courseID, grade DECIMAL(4,2))</code> có khoá (studentID, courseID) và hai khoá ngoại, rồi đổ dữ liệu từ EnrollFlat.</p>',
    yc: [['Three CREATE TABLE then three INSERT … SELECT (parents first).', 'Ba CREATE TABLE rồi ba INSERT … SELECT (bảng cha trước).'], ['Each student and each course stored once.', 'Mỗi sinh viên, mỗi môn lưu một lần.'], ['VARCHAR instead of NVARCHAR here.', 'Ở đây dùng VARCHAR thay NVARCHAR.']],
    giai: GIAI,
    kiem: [
      sau(['Student', 'Student'], 'SELECT studentID, studentName FROM Student'),
      sau(['Course', 'Course'], 'SELECT courseID, courseTitle, credits FROM Course'),
      sau(['Enroll', 'Enroll'], 'SELECT studentID, courseID, grade FROM Enroll'),
      sau(['Hidden: new students and a new course', 'Ẩn: sinh viên và môn mới'], 'SELECT (SELECT COUNT(*) FROM Student) AS s, (SELECT COUNT(*) FROM Course) AS c, (SELECT COUNT(*) FROM Enroll) AS e', { an: true, themCsdl: THEM }),
      ma(['Copies the data with INSERT … SELECT', 'Chép dữ liệu bằng INSERT … SELECT'], '\\bINSERT\\s+INTO\\s+Student\\b[^;]*\\bSELECT\\b'),
    ],
    sai: [
      GIAI.replace('INSERT INTO Course  SELECT DISTINCT courseID, courseTitle, credits FROM EnrollFlat;', "INSERT INTO Course VALUES ('DBI202', 'Database Systems', 3), ('CSD201', 'Data Structures', 3), ('MAE101', 'Mathematics', 3);"),
      GIAI.replace('    PRIMARY KEY (studentID, courseID)\n', '    PRIMARY KEY (studentID)\n'),
    ],
    gy: [['One table per left side of a partial dependency, plus the "rest" keyed by the full key.', 'Mỗi vế trái của phụ thuộc bộ phận một bảng, cộng phần "còn lại" có khoá đầy đủ.'], ['SELECT DISTINCT studentID, studentName FROM EnrollFlat — DISTINCT, or the primary key rejects the copies.', 'SELECT DISTINCT studentID, studentName FROM EnrollFlat — có DISTINCT, không thì khoá chính từ chối các bản sao.']],
    lhg: [['Hard-coding the courses — the hidden data adds PRF192.', 'Ghi cứng các môn — dữ liệu ẩn thêm PRF192.'], ['Key of Enroll = studentID — a student can then take only one course.', 'Khoá của Enroll = studentID — khi đó mỗi sinh viên chỉ học được một môn.']],
    gt: ['<p>Each new table is in 2NF (Student and Course have single-attribute keys; grade depends on the whole key of Enroll), and joining the three gives EnrollFlat back.</p>', '<p>Mỗi bảng mới ở 2NF (Student và Course có khoá một thuộc tính; grade phụ thuộc cả khoá của Enroll), và nối ba bảng cho lại đúng EnrollFlat.</p>'],
    tn: [tn('2NF', 'dạng chuẩn 2'), tn('partial dependency', 'phụ thuộc bộ phận')],
  }),
  cs({
    t: 'Keys and highest normal form of five relations', k: 'HARD', p: 14, loai: 'table',
    kn: ['candidate keys', '1NF/2NF/3NF/BCNF'], tag: ['normalization', 'normal-forms'],
    en: '<p>For each relation write ALL candidate keys (shortest first, separated by a comma, letters in alphabetical order inside a key, e.g. <code>AB, AC</code>) and the highest normal form.</p>',
    vi: '<p>Với mỗi quan hệ, ghi MỌI khoá ứng viên (ngắn trước, cách nhau dấu phẩy, chữ trong một khoá theo thứ tự chữ cái, vd <code>AB, AC</code>) và dạng chuẩn cao nhất.</p>',
    bang: [bang1('b1', ['Keys and normal form', 'Khoá và dạng chuẩn'],
      [{ ma: 'r', ten: 'Relation / Quan hệ' }, { ma: 'k', ten: 'Keys / Khoá' }, { ma: 'nf', ten: 'Highest NF / Dạng chuẩn cao nhất', luaChon: ['1NF', '2NF', '3NF', 'BCNF'] }],
      BAI.map(([ten, R, fds]) => ({ o: { r: ten }, a: { k: bienTheKhoa(keys(R, fds).map((k) => [...k].sort().join(''))), nf: nf(R, fds) } })),
      [`Keys / NF: ${BAI.map(([ten, R, fds]) => `${ten.split(',')[0]}… → ${keys(R, fds).join(', ')} / ${nf(R, fds)}`).join(' · ')}. Find every key with closures before judging: in R(A, B, C, D) with D → A, BD is a second key, so A is prime and D → A only breaks BCNF; in R(A, B, C) with the cycle A → B → C → A every attribute is a key.`, `Khoá / dạng chuẩn như trên. Tìm mọi khoá bằng bao đóng trước khi xét: trong R(A, B, C, D) với D → A, BD là khoá thứ hai nên A là thuộc tính khoá và D → A chỉ phá BCNF; trong R(A, B, C) với vòng A → B → C → A, thuộc tính nào cũng là khoá.`])],
    gy: [['Attributes never on a right side belong to every key; start from them and add attributes one by one.', 'Thuộc tính không bao giờ ở vế phải nằm trong mọi khoá; bắt đầu từ chúng rồi thêm từng thuộc tính.'], ['Then test each FD: partial (2NF), non-key → non-prime (3NF), left side not a superkey (BCNF).', 'Rồi xét từng FD: bộ phận (2NF), không khoá → không khoá (3NF), vế trái không là siêu khoá (BCNF).']],
    lhg: [['Stopping at the first key found.', 'Dừng ở khoá đầu tiên tìm được.'], ['Calling R(A, B, C, D) with D → A "2NF" because A looks non-prime.', 'Gọi R(A, B, C, D) với D → A là "2NF" vì tưởng A không phải thuộc tính khoá.']],
    tn: [tn('candidate key', 'khoá ứng viên'), tn('BCNF', 'dạng chuẩn Boyce–Codd')],
  }),
  cs({
    t: 'Is it 3NF? The transitive test', k: 'MEDIUM', p: 7,
    kn: ['3NF', 'transitive dependency'], tag: ['normalization', '3nf'],
    en: '<p>Slides 51–58: 3NF forbids a non-prime attribute depending on something that is not a superkey.</p>',
    vi: '<p>Slide 51–58: 3NF cấm thuộc tính không khoá phụ thuộc vào thứ không phải siêu khoá.</p>',
    cau: [
      q('c1', ['Employee(empID, name, deptID, deptName), empID → name, deptID; deptID → deptName. Highest NF?', 'Employee(empID, name, deptID, deptName), empID → name, deptID; deptID → deptName. Dạng chuẩn cao nhất?'], ['2NF — deptName depends on empID only through deptID', '3NF — every FD has the key on its left side', 'BCNF — the key empID has a single attribute', '1NF — deptName depends on part of the key'], ['Single-attribute key ⇒ 2NF; deptID → deptName is non-key → non-prime ⇒ not 3NF.', 'Khoá một thuộc tính ⇒ 2NF; deptID → deptName là không khoá → không khoá ⇒ không 3NF.']),
      q('c2', ['How do you fix Employee?', 'Sửa Employee thế nào?'], ['Employee(empID, name, deptID) + Department(deptID, deptName)', 'Add deptName to the key', 'Remove deptID', 'Department(deptID, empID, deptName)'], ['Move the transitive FD into its own table; keep deptID as a foreign key.', 'Đưa FD bắc cầu ra bảng riêng; giữ deptID làm khoá ngoại.']),
      q('c3', ['Which FD can never violate 3NF?', 'FD nào không bao giờ vi phạm 3NF?'], ['one whose left side is a superkey', 'one whose left side is a single attribute', 'one whose right side is numeric', 'one with two attributes on the left'], ['3NF test: X → A is fine if X is a superkey OR A is prime.', 'Phép thử 3NF: X → A ổn nếu X là siêu khoá HOẶC A là thuộc tính khoá.']),
      q('c4', ['Every relation with exactly two attributes is in…', 'Mọi quan hệ có đúng hai thuộc tính đều ở…'], ['BCNF', '2NF only', '3NF only', '1NF only'], ['Any non-trivial FD A → B makes A a key; otherwise the key is AB. Either way every left side is a superkey.', 'FD không tầm thường A → B làm A thành khoá; nếu không, khoá là AB. Cả hai cách mọi vế trái đều là siêu khoá.']),
    ],
    gy: [['Transitive: key → X → A where X is not a superkey and A is non-prime.', 'Bắc cầu: khoá → X → A với X không là siêu khoá và A không là thuộc tính khoá.'], ['The fix is always "move X → A into its own table".', 'Cách sửa luôn là "đưa X → A ra bảng riêng".']],
    lhg: [['Calling Employee BCNF because the key has one attribute.', 'Gọi Employee là BCNF vì khoá chỉ một thuộc tính.'], ['Fixing by dropping deptID — the link to the department is lost.', 'Sửa bằng cách bỏ deptID — mất liên kết tới phòng.']],
    tn: [tn('transitive dependency', 'phụ thuộc bắc cầu'), tn('3NF', 'dạng chuẩn 3')],
  }),
]);
