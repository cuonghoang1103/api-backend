/**
 * DBI202 · 4.D Slide trường Chương 3 (59–73) — sửa về 3NF (Employee/Department bằng SQL), BCNF, hai thuật toán phân rã
 * (BCNF tách theo FD vi phạm; 3NF tổng hợp từ phủ tối thiểu). Đáp án lossless/bảo toàn tính bằng _fd.mjs.
 */
import { mod, de, cs, q, ord, bang1, sau, ma, TN, tn } from './_chung.mjs';
import { F, lossless, preserves } from './_fd.mjs';

const EMP = String.raw`
CREATE TABLE EmpFlat (
  empID    INT          NOT NULL,
  fullName NVARCHAR(40) NOT NULL,
  deptID   CHAR(3)      NOT NULL,
  deptName NVARCHAR(40) NOT NULL,
  location NVARCHAR(30) NOT NULL,
  CONSTRAINT pk_empflat PRIMARY KEY (empID)
);
INSERT INTO EmpFlat VALUES
 (1, N'An',   'IT1', N'Software',   N'Hoa Lac'),
 (2, N'Binh', 'IT1', N'Software',   N'Hoa Lac'),
 (3, N'Chi',  'SAL', N'Sales',      N'Cau Giay'),
 (4, N'Dung', 'ACC', N'Accounting', N'Cau Giay'),
 (5, N'Em',   'SAL', N'Sales',      N'Cau Giay');
`;
const LD = {
  en: '<p><b>Table</b> (tab <code>EmpFlat.sql</code>): <code>EmpFlat(empID, fullName, deptID, deptName, location)</code>, key empID. FDs: empID → fullName, deptID; deptID → deptName, location.</p>',
  vi: '<p><b>Bảng</b> (tab <code>EmpFlat.sql</code>): <code>EmpFlat(empID, fullName, deptID, deptName, location)</code>, khoá empID. FD: empID → fullName, deptID; deptID → deptName, location.</p>',
};
const GIAI = `CREATE TABLE Department (
    deptID   CHAR(3)     NOT NULL PRIMARY KEY,
    deptName VARCHAR(40) NOT NULL,
    location VARCHAR(30) NOT NULL
);
CREATE TABLE Employee (
    empID    INT         NOT NULL PRIMARY KEY,
    fullName VARCHAR(40) NOT NULL,
    deptID   CHAR(3)     NOT NULL REFERENCES Department (deptID)    -- the transitive FD now lives in Department
);
INSERT INTO Department SELECT DISTINCT deptID, deptName, location FROM EmpFlat;
INSERT INTO Employee   SELECT empID, fullName, deptID FROM EmpFlat;`;
const THEM = `INSERT INTO EmpFlat VALUES (6, N'Giang', 'HR1', N'Human Resources', N'Hoa Lac'), (7, N'Ha', 'ACC', N'Accounting', N'Cau Giay')`;
const F5 = F('AB->C', 'C->B', 'C->D');

export default mod('dbi202-slide-dbi4-4', '4.D The 3NF fix, BCNF & the two decomposition algorithms (slides 59–73)', [
  de({
    csdl: EMP, tenCsdl: 'EmpFlat', ld: LD,
    t: 'Remove the transitive dependency: Employee + Department', k: 'MEDIUM', p: 12,
    kn: ['3NF', 'transitive dependency', 'decomposition'], tag: ['normalization', '3nf', 'decomposition'],
    en: '<p>deptName and location depend on empID only through deptID. Split EmpFlat into <code>Department(deptID CHAR(3) PK, deptName VARCHAR(40), location VARCHAR(30))</code> and <code>Employee(empID INT PK, fullName VARCHAR(40), deptID CHAR(3) FK)</code>, then fill both from EmpFlat.</p>',
    vi: '<p>deptName và location chỉ phụ thuộc empID thông qua deptID. Tách EmpFlat thành <code>Department(deptID CHAR(3) PK, deptName VARCHAR(40), location VARCHAR(30))</code> và <code>Employee(empID INT PK, fullName VARCHAR(40), deptID CHAR(3) FK)</code>, rồi đổ dữ liệu từ EmpFlat.</p>',
    yc: [['Department first (Employee references it); each department once.', 'Department trước (Employee tham chiếu nó); mỗi phòng một lần.'], ['VARCHAR instead of NVARCHAR here (the in-browser grader flags NVARCHAR; the sample text has no Vietnamese diacritics, so VARCHAR keeps it intact on SQL Server too — with Vietnamese text use NVARCHAR).', 'Ở đây dùng VARCHAR thay NVARCHAR (máy chấm trình duyệt báo NVARCHAR; dữ liệu mẫu không có dấu tiếng Việt nên VARCHAR vẫn giữ nguyên trên SQL Server — có chữ Việt thì dùng NVARCHAR).']],
    giai: GIAI,
    kiem: [
      sau(['Department', 'Department'], 'SELECT deptID, deptName, location FROM Department'),
      sau(['Employee', 'Employee'], 'SELECT empID, fullName, deptID FROM Employee'),
      sau(['Hidden: a new department appears', 'Ẩn: có phòng mới'], 'SELECT deptID, deptName FROM Department', { an: true, themCsdl: THEM }),
      ma(['Fills Department with INSERT … SELECT DISTINCT', 'Đổ Department bằng INSERT … SELECT DISTINCT'], '\\bINSERT\\s+INTO\\s+Department\\b[^;]*\\bSELECT\\s+DISTINCT\\b'),
    ],
    sai: [GIAI.replace('INSERT INTO Department SELECT DISTINCT deptID, deptName, location FROM EmpFlat;', "INSERT INTO Department VALUES ('IT1', 'Software', 'Hoa Lac'), ('SAL', 'Sales', 'Cau Giay'), ('ACC', 'Accounting', 'Cau Giay');")],
    gy: [['The transitive FD deptID → deptName, location becomes its own table keyed by deptID.', 'FD bắc cầu deptID → deptName, location thành bảng riêng có khoá deptID.'], ['Keep deptID in Employee as the foreign key that joins them back.', 'Giữ deptID trong Employee làm khoá ngoại để nối lại.']],
    lhg: [['Typing the departments by hand — HR1 in the hidden data is missing and the Employee INSERT fails.', 'Gõ tay các phòng — HR1 trong dữ liệu ẩn bị thiếu và INSERT Employee lỗi.'], ['Dropping deptID from Employee — lossy: nobody knows who works where.', 'Bỏ deptID khỏi Employee — mất thông tin: không biết ai làm ở đâu.']],
    gt: ['<p>Both tables are now in BCNF: the only determinants are empID and deptID, each the key of its table. The decomposition is lossless because the common attribute deptID is the key of Department.</p>', '<p>Hai bảng giờ đều ở BCNF: định thuộc duy nhất là empID và deptID, mỗi cái là khoá của bảng nó. Phân rã không mất vì thuộc tính chung deptID là khoá của Department.</p>'],
    tn: [tn('3NF', 'dạng chuẩn 3')],
  }),
  cs({
    t: 'The BCNF decomposition algorithm, in order', k: 'MEDIUM', p: 6, loai: 'order',
    kn: ['BCNF decomposition'], tag: ['normalization', 'bcnf'],
    en: '<p>Slide 70: decomposing R into BCNF.</p>', vi: '<p>Slide 70: phân rã R về BCNF.</p>',
    cau: [
      ord('o1', ['BCNF decomposition (one round, then recurse)', 'Phân rã BCNF (một vòng, rồi đệ quy)'], ['Find all keys of R', 'Find an FD X → Y whose left side X is not a superkey', 'Compute X⁺', 'Split R into R1 = X⁺ and R2 = X ∪ (R − X⁺)', 'Project the FDs onto R1 and R2 and repeat on any piece still not in BCNF'], ['Keys first (to know what a superkey is), a violation, its closure, the split, then recurse. Each split is lossless because R1 ∩ R2 = X and X → R1.', 'Khoá trước (để biết siêu khoá), tìm vi phạm, tính bao đóng, tách, rồi đệ quy. Mỗi lần tách đều không mất vì R1 ∩ R2 = X và X → R1.']),
      ord('o2', ['3NF synthesis algorithm (slide 71)', 'Thuật toán tổng hợp 3NF (slide 71)'], ['Compute a minimal basis of F', 'Make one relation XA for every FD X → A of the basis (merge same left sides)', 'If no relation contains a key of R, add one relation that is a key', 'Remove a relation whose attributes are contained in another'], ['Minimal basis → one relation per FD → make sure some relation holds a key (lossless) → drop subsumed relations.', 'Phủ tối thiểu → mỗi FD một quan hệ → bảo đảm có quan hệ chứa khoá (không mất) → bỏ quan hệ bị bao.']),
    ],
    gy: [['BCNF: split on a violating FD using its closure.', 'BCNF: tách theo FD vi phạm bằng bao đóng của nó.'], ['3NF synthesis: start from a minimal basis; the key relation guarantees losslessness.', 'Tổng hợp 3NF: bắt đầu từ phủ tối thiểu; quan hệ chứa khoá bảo đảm không mất.']],
    lhg: [['Splitting before finding the keys.', 'Tách trước khi tìm khoá.'], ['Forgetting the "add a key relation" step of 3NF synthesis — the result may be lossy.', 'Quên bước "thêm quan hệ chứa khoá" của tổng hợp 3NF — kết quả có thể mất thông tin.']],
  }),
  cs({
    t: 'BCNF or 3NF: lossless? dependency-preserving?', k: 'HARD', p: 10, loai: 'table',
    kn: ['lossless join', 'dependency preservation', 'BCNF vs 3NF'], tag: ['normalization', 'bcnf', '3nf'],
    en: '<p>R(A, B, C, D) — student A takes subject B with lecturer C who has office D — with F = {AB → C, C → B, C → D}. For each decomposition answer yes/no.</p>',
    vi: '<p>R(A, B, C, D) — sinh viên A học môn B với giảng viên C có phòng làm việc D — với F = {AB → C, C → B, C → D}. Với mỗi phân rã trả lời yes/no.</p>',
    bang: [bang1('b1', ['Properties', 'Tính chất'],
      [{ ma: 'pr', ten: 'Decomposition / Phân rã' }, { ma: 'll', ten: 'Lossless?', luaChon: ['yes', 'no'] }, { ma: 'bt', ten: 'Preserves F?', luaChon: ['yes', 'no'] }],
      [['BCNF result: {BCD, AC}', ['BCD', 'AC']], ['3NF synthesis: {ABC, BCD}', ['ABC', 'BCD']], ['a careless split: {AB, CD}', ['AB', 'CD']], ['{ABD, BC}', ['ABD', 'BC']]]
        .map(([ten, ps]) => ({ o: { pr: ten }, a: { ll: lossless('ABCD', ps, F5) ? 'yes' : 'no', bt: preserves(ps, F5) ? 'yes' : 'no' } })),
      ['BCNF {BCD, AC}: lossless (C is a key of BCD) but AB → C is lost. 3NF {ABC, BCD}: lossless and every FD kept, at the price of C → B inside ABC. {AB, CD} shares nothing ⇒ lossy. {ABD, BC}: B alone determines nothing ⇒ lossy, and C → D is lost.', 'BCNF {BCD, AC}: không mất (C là khoá của BCD) nhưng mất AB → C. 3NF {ABC, BCD}: không mất và giữ mọi FD, đổi lại C → B nằm trong ABC. {AB, CD} không có gì chung ⇒ mất. {ABD, BC}: riêng B không xác định gì ⇒ mất, và mất C → D.'])],
    gy: [['Two pieces are lossless when their common attributes determine one piece.', 'Hai mảnh không mất khi thuộc tính chung xác định được một mảnh.'], ['An FD is preserved when it can be checked inside one piece (or follows from the projected FDs).', 'FD được bảo toàn khi kiểm được trong một mảnh (hoặc suy ra từ các FD đã chiếu).']],
    lhg: [['"BCNF is always dependency-preserving" — false, see {BCD, AC}.', '"BCNF luôn bảo toàn phụ thuộc" — sai, xem {BCD, AC}.'], ['Thinking lossless and preserving are the same property.', 'Tưởng không mất và bảo toàn là cùng một tính chất.']],
    tn: [tn('dependency preservation', 'bảo toàn phụ thuộc')],
  }),
  cs({
    t: 'BCNF in four questions', k: 'MEDIUM', p: 6,
    kn: ['BCNF definition'], tag: ['normalization', 'bcnf'],
    en: '<p>Slides 64–69.</p>', vi: '<p>Slide 64–69.</p>',
    cau: [
      q('c1', ['R is in BCNF when, for every non-trivial FD X → A…', 'R ở BCNF khi, với mọi FD không tầm thường X → A…'], ['X is a superkey of R', 'A is a prime attribute', 'X is a single attribute', 'A is not part of any key'], ['BCNF drops the 3NF escape clause "or A is prime".', 'BCNF bỏ ngoại lệ "hoặc A là thuộc tính khoá" của 3NF.']),
      q('c2', ['Address(street, city, zip), {street, city → zip, zip → city}. Highest NF?', 'Address(street, city, zip), {street, city → zip, zip → city}. Dạng chuẩn cao nhất?'], ['3NF, not BCNF', 'BCNF', '2NF', '1NF'], ['Keys: (street, city) and (street, zip). zip → city: zip is not a superkey, but city is prime ⇒ 3NF only.', 'Khoá: (street, city) và (street, zip). zip → city: zip không là siêu khoá nhưng city là thuộc tính khoá ⇒ chỉ 3NF.']),
      q('c3', ['Every BCNF relation is also in…', 'Mọi quan hệ BCNF cũng ở…'], ['3NF', 'nothing else', '4NF', 'only 1NF'], ['BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF.', 'BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF.']),
      q('c4', ['Why do designers often stop at 3NF?', 'Vì sao người thiết kế hay dừng ở 3NF?'], ['3NF is always reachable lossless AND dependency-preserving; BCNF is not', 'BCNF tables need much more disk space than 3NF ones', 'SQL Server cannot create tables that are in BCNF', '3NF already removes every possible redundancy'], ['The synthesis algorithm guarantees both properties for 3NF; BCNF may lose an FD (street/city/zip).', 'Thuật toán tổng hợp bảo đảm cả hai tính chất cho 3NF; BCNF có thể mất một FD (street/city/zip).']),
    ],
    gy: [['BCNF: every determinant is a superkey.', 'BCNF: mọi định thuộc đều là siêu khoá.'], ['3NF adds "or the right side is prime".', '3NF thêm "hoặc vế phải là thuộc tính khoá".']],
    lhg: [['Calling Address BCNF because it "looks clean".', 'Gọi Address là BCNF vì "trông gọn".'], ['Believing 3NF has no redundancy.', 'Tin 3NF không có dư thừa.']],
    tn: [tn('BCNF', 'dạng chuẩn Boyce–Codd')],
  }),
]);
