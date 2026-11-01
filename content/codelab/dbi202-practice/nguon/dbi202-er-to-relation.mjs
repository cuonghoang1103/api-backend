/**
 * DBI202 · 3.4 ERD → lược đồ quan hệ: bảy quy tắc — ERD thư viện của bài chuyển trọn vẹn (6 bảng), thứ tự tạo/xoá, đọc ngược.
 */
import { mod, de, cs, q, ord, bang1, sau, chan, duoc, cot, YC_DDL, TN, tn } from './_chung.mjs';

const LIB = `CREATE TABLE Member (
    mid  INT         NOT NULL PRIMARY KEY,            -- R1
    name VARCHAR(50) NOT NULL
);
CREATE TABLE MemberPhone (                            -- R7 multivalued {phone}
    mid   INT         NOT NULL REFERENCES Member (mid),
    phone VARCHAR(15) NOT NULL,
    PRIMARY KEY (mid, phone)
);
CREATE TABLE Book (
    bid   INT          NOT NULL PRIMARY KEY,          -- R1
    title VARCHAR(100) NOT NULL
);
CREATE TABLE Branch (
    brid        INT         NOT NULL PRIMARY KEY,
    addr        VARCHAR(100) NULL,
    manager_mid INT         NOT NULL UNIQUE REFERENCES Member (mid)   -- R4 1:1, total on Branch
);
CREATE TABLE Copy (                                   -- R2 weak entity
    brid    INT         NOT NULL REFERENCES Branch (brid) ON DELETE CASCADE,
    copy_no INT         NOT NULL,
    status  VARCHAR(10) NULL,
    PRIMARY KEY (brid, copy_no)
);
CREATE TABLE Borrow (                                 -- R5 M:N with attributes
    mid         INT  NOT NULL REFERENCES Member (mid),
    bid         INT  NOT NULL REFERENCES Book (bid),
    borrow_date DATE NOT NULL,
    due_date    DATE NOT NULL,
    PRIMARY KEY (mid, bid, borrow_date)               -- the same book can be borrowed again later
);`;
const NEN = `INSERT INTO Member VALUES (1, 'An'), (2, 'Binh'); INSERT INTO Book VALUES (10, 'Database Systems'), (11, 'Learning SQL');`;

export default mod('dbi202-er-to-relation', '3.4 ERD → relational schema: the seven rules', [
  cs({
    t: 'Which rule, which result?', k: 'EASY', p: 7, loai: 'table',
    kn: ['seven conversion rules'], tag: ['erd'],
    en: '<p>The seven rules of lesson 3.4 (R1 strong entity … R7 multivalued attribute). For each ERD element, give the rule and what it becomes.</p>',
    vi: '<p>Bảy quy tắc của bài 3.4 (R1 thực thể mạnh … R7 thuộc tính đa trị). Với mỗi thành phần ERD, cho biết quy tắc và kết quả.</p>',
    bang: [bang1('b1', ['ERD element → table', 'Thành phần ERD → bảng'],
      [{ ma: 'tp', ten: 'Element / Thành phần' }, { ma: 'r', ten: 'Rule / Quy tắc', luaChon: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] }, { ma: 'kq', ten: 'Becomes / Thành', luaChon: ['a new table', 'a foreign key column (no new table)'] }],
      [{ o: { tp: 'strong entity Book(bid, title)' }, a: { r: 'R1', kq: 'a new table' } },
        { o: { tp: 'weak entity Copy(copy_no, status) of Branch' }, a: { r: 'R2', kq: 'a new table' } },
        { o: { tp: '1:N "a lecturer teaches many courses"' }, a: { r: 'R3', kq: 'a foreign key column (no new table)' } },
        { o: { tp: '1:1 "a branch has exactly one manager (a member)"' }, a: { r: 'R4', kq: 'a foreign key column (no new table)' } },
        { o: { tp: 'M:N Borrow(borrow_date, due_date) between Member and Book' }, a: { r: 'R5', kq: 'a new table' } },
        { o: { tp: 'ternary Supplies(Supplier, Part, Project)' }, a: { r: 'R6', kq: 'a new table' } },
        { o: { tp: 'multivalued {phone} of Member' }, a: { r: 'R7', kq: 'a new table' } }],
      ['Only 1:N and 1:1 relationships fold into a foreign key; every other construct produces a table.', 'Chỉ liên kết 1:N và 1:1 được gộp thành khoá ngoại; mọi cấu trúc khác sinh bảng.'])],
    gy: [['Relationships with a "1" side never need their own table.', 'Liên kết có phía "1" không bao giờ cần bảng riêng.'], ['Weak entities, M:N, n-ary and multivalued attributes always do.', 'Thực thể yếu, M:N, n-ngôi và thuộc tính đa trị thì luôn cần.']],
    lhg: [['Creating a table Teaches(lid, cid) for a 1:N — the most frequent conversion error.', 'Tạo bảng Teaches(lid, cid) cho liên kết 1:N — lỗi chuyển đổi hay gặp nhất.'], ['Folding an M:N into a column of one side.', 'Gộp M:N thành một cột ở một phía.']],
    tn: [tn('mapping rules', 'quy tắc chuyển đổi')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Convert the library ERD completely (6 tables)', k: 'HARD', p: 20,
    kn: ['R1–R7', 'weak entity', '1:1 with UNIQUE', 'M:N with attributes'], tag: ['erd', 'ddl'],
    en: `<p>The worked example of lesson 3.4:</p><pre>[Member] mid, name, {phone}          [Book] bid, title
    borrows (M:N, with borrow_date, due_date) between Member and Book
[Branch] brid, addr ══&lt;holds&gt;══ [[Copy]] copy_no, status      (Copy is weak)
[Member] ──1──&lt;manages&gt;──1── [Branch]   (every branch has exactly one manager)</pre><p>Create the 6 tables with exactly these names and columns: <code>Member(mid INT, name VARCHAR(50))</code>, <code>MemberPhone(mid, phone VARCHAR(15))</code>, <code>Book(bid INT, title VARCHAR(100))</code>, <code>Branch(brid INT, addr VARCHAR(100), manager_mid INT)</code>, <code>Copy(brid, copy_no INT, status VARCHAR(10))</code>, <code>Borrow(mid, bid, borrow_date DATE, due_date DATE)</code>.</p>`,
    vi: `<p>Ví dụ có lời giải của bài 3.4 (sơ đồ ở trên). Tạo 6 bảng với đúng tên và cột: <code>Member(mid INT, name VARCHAR(50))</code>, <code>MemberPhone(mid, phone VARCHAR(15))</code>, <code>Book(bid INT, title VARCHAR(100))</code>, <code>Branch(brid INT, addr VARCHAR(100), manager_mid INT)</code>, <code>Copy(brid, copy_no INT, status VARCHAR(10))</code>, <code>Borrow(mid, bid, borrow_date DATE, due_date DATE)</code>.</p>`,
    yc: [['Keys: MemberPhone (mid, phone); Copy (brid, copy_no) with ON DELETE CASCADE to Branch; Borrow (mid, bid, borrow_date).', 'Khoá: MemberPhone (mid, phone); Copy (brid, copy_no) với ON DELETE CASCADE tới Branch; Borrow (mid, bid, borrow_date).'],
      ['manages (1:1, total on Branch): Branch.manager_mid NOT NULL UNIQUE REFERENCES Member.', 'manages (1:1, toàn phần phía Branch): Branch.manager_mid NOT NULL UNIQUE REFERENCES Member.'],
      ['Create parents before children.', 'Tạo bảng cha trước bảng con.'], YC_DDL],
    giai: LIB,
    kiem: [
      sau(['The six tables and their columns', 'Sáu bảng và các cột'], cot(['Member', 'MemberPhone', 'Book', 'Branch', 'Copy', 'Borrow'])),
      duoc(['A full valid data set', 'Một bộ dữ liệu hợp lệ đầy đủ'], `${NEN} INSERT INTO MemberPhone VALUES (1, '0901'), (1, '0902'); INSERT INTO Branch VALUES (100, 'Hoa Lac', 1); INSERT INTO Copy VALUES (100, 1, 'ok'), (100, 2, 'ok'); INSERT INTO Borrow VALUES (2, 10, '2026-10-01', '2026-10-15'), (2, 10, '2026-11-01', '2026-11-15')`),
      chan(['One member managing two branches is rejected (1:1)', 'Một độc giả quản lý hai chi nhánh bị từ chối (1:1)'], `${NEN} INSERT INTO Branch VALUES (100, 'Hoa Lac', 1), (200, 'Cau Giay', 1)`, '23505'),
      chan(['A branch without a manager is rejected', 'Chi nhánh không có quản lý bị từ chối'], `INSERT INTO Branch (brid, addr) VALUES (100, 'Hoa Lac')`, '23502'),
      chan(['Copy 1 twice in the same branch is rejected', 'Hai bản số 1 trong cùng chi nhánh bị từ chối'], `${NEN} INSERT INTO Branch VALUES (100, 'Hoa Lac', 1); INSERT INTO Copy VALUES (100, 1, 'ok'), (100, 1, 'lost')`, '23505'),
      chan(['The same member borrowing the same book twice on the same day is rejected', 'Cùng độc giả mượn cùng sách hai lần trong một ngày bị từ chối'], `${NEN} INSERT INTO Borrow VALUES (1, 10, '2026-10-01', '2026-10-15'), (1, 10, '2026-10-01', '2026-10-20')`, '23505'),
      chan(['The same phone twice for one member is rejected', 'Một số điện thoại hai lần cho một độc giả bị từ chối'], `${NEN} INSERT INTO MemberPhone VALUES (1, '0901'), (1, '0901')`, '23505', { an: true }),
      sau(['Closing a branch deletes its copies', 'Đóng chi nhánh thì xoá các bản sách của nó'], `${NEN} INSERT INTO Branch VALUES (100, 'Hoa Lac', 1), (200, 'Cau Giay', 2); INSERT INTO Copy VALUES (100, 1, 'ok'), (200, 1, 'ok'); DELETE FROM Branch WHERE brid = 100; SELECT brid, copy_no FROM Copy`, { an: true }),
      chan(['A loan of an unknown book is rejected', 'Mượn sách không tồn tại bị từ chối'], `${NEN} INSERT INTO Borrow VALUES (1, 99, '2026-10-01', '2026-10-15')`, '23503', { an: true }),
    ],
    sai: [
      LIB.replace('PRIMARY KEY (mid, bid, borrow_date)', 'PRIMARY KEY (mid, bid)'),
      LIB.replace('manager_mid INT         NOT NULL UNIQUE REFERENCES', 'manager_mid INT         NOT NULL REFERENCES'),
      LIB.replace('REFERENCES Branch (brid) ON DELETE CASCADE', 'REFERENCES Branch (brid)'),
    ],
    gy: [['Go element by element: R1 for Member/Book/Branch, R7 for {phone}, R2 for Copy, R5 for Borrow, R4 for manages.', 'Đi từng thành phần: R1 cho Member/Book/Branch, R7 cho {phone}, R2 cho Copy, R5 cho Borrow, R4 cho manages.'], ['borrow_date must be in Borrow\'s key: the same member may borrow the same book again next month.', 'borrow_date phải nằm trong khoá của Borrow: cùng độc giả có thể mượn lại cùng cuốn tháng sau.']],
    lhg: [['PRIMARY KEY (mid, bid) on Borrow — a second loan of the same book is impossible.', 'PRIMARY KEY (mid, bid) trên Borrow — không mượn lại được cùng cuốn.'], ['No UNIQUE on manager_mid — one member could manage two branches (that is 1:N, not 1:1).', 'Không UNIQUE ở manager_mid — một người quản lý được hai chi nhánh (đó là 1:N, không phải 1:1).']],
    gt: ['<p>6 tables, created parents first: Member, MemberPhone, Book, Branch, Copy, Borrow. A correct conversion is usually already in 3NF — Chapter 4 checks that.</p>', '<p>6 bảng, tạo cha trước: Member, MemberPhone, Book, Branch, Copy, Borrow. Một chuyển đổi đúng thường đã ở 3NF — Chương 4 sẽ kiểm điều đó.</p>'],
    tn: [TN.fk, tn('1:1 relationship', 'liên kết một-một', 'Khoá ngoại + UNIQUE ở phía tham gia toàn phần.')],
  }),
  cs({
    t: 'Create and drop in dependency order', k: 'EASY', p: 5, loai: 'order',
    kn: ['DDL order', 'DROP order'], tag: ['erd', 'ddl'],
    en: '<p>The library schema plus one more table: Branch references Member; Copy references Branch; <code>Reservation(brid, copy_no, mid)</code> references Copy (brid, copy_no).</p>',
    vi: '<p>Lược đồ thư viện thêm một bảng: Branch tham chiếu Member; Copy tham chiếu Branch; <code>Reservation(brid, copy_no, mid)</code> tham chiếu Copy (brid, copy_no).</p>',
    cau: [
      ord('o1', ['The only valid CREATE TABLE order', 'Thứ tự CREATE TABLE hợp lệ duy nhất'], ['CREATE TABLE Member', 'CREATE TABLE Branch', 'CREATE TABLE Copy', 'CREATE TABLE Reservation'], ['A table can be created only after every table it references: Member ← Branch ← Copy ← Reservation is a chain, so there is exactly one order.', 'Một bảng chỉ tạo được sau mọi bảng nó tham chiếu: Member ← Branch ← Copy ← Reservation là một chuỗi nên chỉ có đúng một thứ tự.']),
      ord('o2', ['The only valid DROP TABLE order (no CASCADE)', 'Thứ tự DROP TABLE hợp lệ duy nhất (không CASCADE)'], ['DROP TABLE Reservation', 'DROP TABLE Copy', 'DROP TABLE Branch', 'DROP TABLE Member'], ['Drop in reverse: a table can be dropped only when nothing references it any more.', 'Xoá theo thứ tự ngược: chỉ xoá được bảng khi không còn ai tham chiếu nó.']),
    ],
    gy: [['CREATE: parents → children. DROP: children → parents.', 'CREATE: cha → con. DROP: con → cha.'], ['Follow the arrows of the foreign keys.', 'Đi theo mũi tên của các khoá ngoại.']],
    lhg: [['Creating Copy before Branch — "Foreign key references invalid table".', 'Tạo Copy trước Branch — "Foreign key references invalid table".'], ['Dropping Member first — it is still referenced by Branch.', 'Xoá Member trước — Branch vẫn đang tham chiếu nó.']],
  }),
  cs({
    t: 'Reverse engineering: read the ERD back from the tables', k: 'MEDIUM', p: 6,
    kn: ['reverse engineering'], tag: ['erd'],
    en: '<p>The seven rules read backwards (lesson 3.4, ★ Beyond the syllabus).</p>', vi: '<p>Bảy quy tắc đọc ngược (bài 3.4, ★ Ngoài giáo trình).</p>',
    cau: [
      q('c1', ['Enrollment(studentID PK FK, courseID PK FK, grade). In the ERD this table is…', 'Enrollment(studentID PK FK, courseID PK FK, grade). Trong ERD bảng này là…'], ['an M:N relationship with attribute grade', 'a weak entity of Student', 'a 1:1 relationship', 'a subclass of Course'], ['A primary key made entirely of two foreign keys = M:N relationship.', 'Khoá chính chỉ gồm hai khoá ngoại = liên kết M:N.']),
      q('c2', ['Manager(empID PK, FK → Employee, bonus). This table is…', 'Manager(empID PK, FK → Employee, bonus). Bảng này là…'], ['a subclass (or 1:1 extension) of Employee', 'an M:N relationship', 'a multivalued attribute', 'a weak entity with partial key bonus'], ['Primary key that is also a foreign key = subclass / 1:1.', 'Khoá chính đồng thời là khoá ngoại = lớp con / 1:1.']),
      q('c3', ['Order.customerID is a nullable foreign key. In the ERD…', 'Order.customerID là khoá ngoại cho phép NULL. Trong ERD…'], ['Order participates partially in a N:1 relationship with Customer', 'Order is a weak entity owned by Customer', 'Customer is a subclass of Order (ISA link)', 'it is an M:N relationship between the two'], ['A nullable FK = partial participation; NOT NULL = total.', 'Khoá ngoại cho phép NULL = tham gia một phần; NOT NULL = toàn phần.']),
      q('c4', ['Room(hotelID PK FK, roomNo PK, price). This table is…', 'Room(hotelID PK FK, roomNo PK, price). Bảng này là…'], ['a weak entity owned by Hotel', 'an M:N relationship', 'a multivalued attribute of Hotel', 'a strong entity with key roomNo'], ['Key = owner\'s key + a non-FK column ⇒ weak entity with partial key roomNo.', 'Khoá = khoá chủ + một cột không phải khoá ngoại ⇒ thực thể yếu với khoá bộ phận roomNo.']),
    ],
    gy: [['Look at the primary key: which of its columns are foreign keys?', 'Nhìn khoá chính: những cột nào là khoá ngoại?'], ['Nullable vs NOT NULL FK tells you the participation.', 'Khoá ngoại NULL hay NOT NULL cho biết mức tham gia.']],
    lhg: [['Calling Room an M:N — only one of its key columns is a foreign key.', 'Gọi Room là M:N — chỉ một cột khoá của nó là khoá ngoại.'], ['Calling Manager a weak entity — its whole key is the foreign key.', 'Gọi Manager là thực thể yếu — toàn bộ khoá của nó là khoá ngoại.']],
    tn: [tn('reverse engineering', 'đọc ngược thiết kế')],
  }),
]);
