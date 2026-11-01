/**
 * DBI202 · 3.4 🧩 Xưởng ERD — liên kết đệ quy (danh mục cha-con, môn tiên quyết, bạn bè đối xứng), 10 lỗi ERD hay bị trừ
 * điểm và câu hỏi vấn đáp.
 */
import { mod, de, cs, q, sau, chan, duoc, cot, YC_DDL, tn } from './_chung.mjs';

export default mod('dbi202-xuong-erd', '3.4 ERD Workshop: recursive relationships and the oral exam', [
  de({
    csdl: '', ld: null,
    t: 'Case 2 — categories inside categories (recursive 1-M)', k: 'MEDIUM', p: 12,
    kn: ['recursive relationship', 'self foreign key'], tag: ['erd', 'ddl', 'recursive'],
    en: '<p>"Phones" and "Laptops" sit inside "Electronics"; a top-level category has no parent. Each product is in exactly one category. Create <code>Category(categoryID INT PK, name VARCHAR(50) NOT NULL, parentID INT)</code> and <code>Product(productID INT PK, name VARCHAR(80) NOT NULL, price DECIMAL(12,0), categoryID INT)</code>.</p>',
    vi: '<p>"Điện thoại" và "Laptop" nằm trong "Điện tử"; danh mục gốc không có cha. Mỗi sản phẩm thuộc đúng một danh mục. Tạo <code>Category(categoryID INT PK, name VARCHAR(50) NOT NULL, parentID INT)</code> và <code>Product(productID INT PK, name VARCHAR(80) NOT NULL, price DECIMAL(12,0), categoryID INT)</code>.</p>',
    yc: [['parentID references Category itself and may be NULL (top level).', 'parentID tham chiếu chính Category và được NULL (danh mục gốc).'], ['Product.categoryID NOT NULL references Category; price &gt; 0.', 'Product.categoryID NOT NULL tham chiếu Category; price &gt; 0.'], YC_DDL],
    giai: `CREATE TABLE Category (
    categoryID INT         NOT NULL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    parentID   INT         NULL REFERENCES Category (categoryID)   -- recursive: a row points at another row of the same table
);
CREATE TABLE Product (
    productID  INT           NOT NULL PRIMARY KEY,
    name       VARCHAR(80)   NOT NULL,
    price      DECIMAL(12,0) NOT NULL CHECK (price > 0),
    categoryID INT           NOT NULL REFERENCES Category (categoryID)
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Category', 'Product'])),
      duoc(['A three-level tree and a product', 'Cây ba tầng và một sản phẩm'], `INSERT INTO Category VALUES (1, 'Electronics', NULL), (2, 'Phones', 1), (3, 'Android phones', 2); INSERT INTO Product VALUES (10, 'Galaxy', 9000000, 3)`),
      chan(['A parent that does not exist is rejected', 'Danh mục cha không tồn tại bị từ chối'], `INSERT INTO Category VALUES (2, 'Phones', 99)`, '23503'),
      chan(['A product without a category is rejected', 'Sản phẩm không có danh mục bị từ chối'], `INSERT INTO Product (productID, name, price) VALUES (10, 'Galaxy', 9000000)`, '23502'),
      chan(['A free product (price 0) is rejected', 'Sản phẩm giá 0 bị từ chối'], `INSERT INTO Category VALUES (1, 'Electronics', NULL); INSERT INTO Product VALUES (10, 'Gift', 0, 1)`, '23514', { an: true }),
    ],
    sai: [
      `CREATE TABLE Category (categoryID INT NOT NULL PRIMARY KEY, name VARCHAR(50) NOT NULL, parentID INT NULL); CREATE TABLE Product (productID INT NOT NULL PRIMARY KEY, name VARCHAR(80) NOT NULL, price DECIMAL(12,0) NOT NULL CHECK (price > 0), categoryID INT NOT NULL REFERENCES Category(categoryID));`,
      `CREATE TABLE Category (categoryID INT NOT NULL PRIMARY KEY, name VARCHAR(50) NOT NULL, parentID INT NOT NULL REFERENCES Category(categoryID)); CREATE TABLE Product (productID INT NOT NULL PRIMARY KEY, name VARCHAR(80) NOT NULL, price DECIMAL(12,0) NOT NULL CHECK (price > 0), categoryID INT NOT NULL REFERENCES Category(categoryID));`,
    ],
    gy: [['Electronics, Phones, Laptops are ROWS of one entity set Category, not three entity sets.', 'Điện tử, Điện thoại, Laptop là các DÒNG của một tập thực thể Category, không phải ba tập thực thể.'], ['parentID INT NULL REFERENCES Category (categoryID)', 'parentID INT NULL REFERENCES Category (categoryID)']],
    lhg: [['No REFERENCES on parentID — a category can point at a parent that does not exist.', 'Không REFERENCES ở parentID — danh mục trỏ được tới cha không tồn tại.'], ['parentID NOT NULL — the top-level category can never be inserted.', 'parentID NOT NULL — không bao giờ thêm được danh mục gốc.']],
    gt: ['<p>A recursive 1-M is a nullable foreign key to the same table. Querying the whole tree needs a recursive CTE (⭐ CS.5).</p>', '<p>Liên kết đệ quy 1-M là một khoá ngoại cho phép NULL tới chính bảng đó. Truy cả cây cần CTE đệ quy (⭐ CS.5).</p>'],
    tn: [tn('recursive relationship', 'liên kết đệ quy')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Case 4 — prerequisites: a recursive M-N', k: 'HARD', p: 12,
    kn: ['recursive M-N', 'two foreign keys to one table', 'CHECK between columns'], tag: ['erd', 'ddl', 'recursive'],
    en: '<p>A course may require several other courses, and a course may be the prerequisite of several courses. Create <code>Course(courseCode CHAR(6) PK, courseName VARCHAR(80) NOT NULL)</code> and <code>Prerequisite(courseCode CHAR(6), prereqCode CHAR(6))</code>. A course cannot be its own prerequisite.</p>',
    vi: '<p>Một môn có thể yêu cầu nhiều môn khác, và một môn có thể là tiên quyết của nhiều môn. Tạo <code>Course(courseCode CHAR(6) PK, courseName VARCHAR(80) NOT NULL)</code> và <code>Prerequisite(courseCode CHAR(6), prereqCode CHAR(6))</code>. Một môn không được là tiên quyết của chính nó.</p>',
    yc: [['Key of Prerequisite = (courseCode, prereqCode); BOTH columns reference Course.', 'Khoá của Prerequisite = (courseCode, prereqCode); CẢ HAI cột tham chiếu Course.'], ['CHECK (courseCode &lt;&gt; prereqCode).', 'CHECK (courseCode &lt;&gt; prereqCode).'], YC_DDL],
    giai: `CREATE TABLE Course (
    courseCode CHAR(6)     NOT NULL PRIMARY KEY,
    courseName VARCHAR(80) NOT NULL
);
CREATE TABLE Prerequisite (                         -- M-N between Course and Course (roles: course / prerequisite)
    courseCode CHAR(6) NOT NULL REFERENCES Course (courseCode),
    prereqCode CHAR(6) NOT NULL REFERENCES Course (courseCode),
    PRIMARY KEY (courseCode, prereqCode),
    CHECK (courseCode <> prereqCode)
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Course', 'Prerequisite'])),
      duoc(['DBI202 needs PRF192; CSD201 needs PRF192 and MAE101', 'DBI202 cần PRF192; CSD201 cần PRF192 và MAE101'], `INSERT INTO Course VALUES ('PRF192', 'Programming'), ('MAE101', 'Maths'), ('DBI202', 'Databases'), ('CSD201', 'Data Structures'); INSERT INTO Prerequisite VALUES ('DBI202', 'PRF192'), ('CSD201', 'PRF192'), ('CSD201', 'MAE101')`),
      chan(['A course as its own prerequisite is rejected', 'Môn là tiên quyết của chính nó bị từ chối'], `INSERT INTO Course VALUES ('PRF192', 'Programming'); INSERT INTO Prerequisite VALUES ('PRF192', 'PRF192')`, '23514'),
      chan(['An unknown prerequisite is rejected', 'Môn tiên quyết không tồn tại bị từ chối'], `INSERT INTO Course VALUES ('DBI202', 'Databases'); INSERT INTO Prerequisite VALUES ('DBI202', 'XXX999')`, '23503'),
      chan(['The same pair twice is rejected', 'Cùng cặp hai lần bị từ chối'], `INSERT INTO Course VALUES ('PRF192', 'P'), ('DBI202', 'D'); INSERT INTO Prerequisite VALUES ('DBI202', 'PRF192'), ('DBI202', 'PRF192')`, '23505'),
    ],
    sai: [
      `CREATE TABLE Course (courseCode CHAR(6) NOT NULL PRIMARY KEY, courseName VARCHAR(80) NOT NULL); CREATE TABLE Prerequisite (courseCode CHAR(6) NOT NULL REFERENCES Course(courseCode), prereqCode CHAR(6) NOT NULL, PRIMARY KEY (courseCode, prereqCode), CHECK (courseCode <> prereqCode));`,
      `CREATE TABLE Course (courseCode CHAR(6) NOT NULL PRIMARY KEY, courseName VARCHAR(80) NOT NULL, prereqCode CHAR(6) NULL REFERENCES Course(courseCode));`,
    ],
    gy: [['A recursive M-N needs its own table with TWO foreign keys to the same table (two roles).', 'M-N đệ quy cần bảng riêng có HAI khoá ngoại tới cùng một bảng (hai vai trò).'], ['A self-loop is forbidden with a table-level CHECK.', 'Vòng tự thân bị cấm bằng CHECK cấp bảng.']],
    lhg: [['A single column prereqCode in Course — that allows only ONE prerequisite per course (recursive 1-M, not M-N).', 'Một cột prereqCode trong Course — chỉ cho MỘT môn tiên quyết mỗi môn (đệ quy 1-M, không phải M-N).'], ['Only one of the two columns has REFERENCES.', 'Chỉ một trong hai cột có REFERENCES.']],
    gt: ['<p>Two roles of the same entity set ⇒ two columns, each with its own foreign key. Cycles (A needs B, B needs A) cannot be stopped by a CHECK; they need a trigger or application logic.</p>', '<p>Hai vai trò của cùng một tập thực thể ⇒ hai cột, mỗi cột một khoá ngoại. Vòng (A cần B, B cần A) không chặn được bằng CHECK; cần trigger hoặc logic ứng dụng.</p>'],
    tn: [tn('role', 'vai trò')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Case 8 — friendship: a symmetric pair stored once', k: 'HARD', p: 10,
    kn: ['symmetric relationship', 'canonical order', 'CHECK'], tag: ['erd', 'ddl', 'recursive'],
    en: '<p>In a social network friendship is symmetric: if An is Binh\'s friend, Binh is An\'s friend. Store each friendship ONCE. Create <code>Users(userID INT PK, nickname VARCHAR(30) NOT NULL UNIQUE)</code> and <code>Friendship(user1 INT, user2 INT, since DATE)</code> where a pair is always stored with the smaller id first.</p>',
    vi: '<p>Trong mạng xã hội, quan hệ bạn bè là đối xứng: An là bạn của Bình thì Bình là bạn của An. Lưu mỗi quan hệ MỘT lần. Tạo <code>Users(userID INT PK, nickname VARCHAR(30) NOT NULL UNIQUE)</code> và <code>Friendship(user1 INT, user2 INT, since DATE)</code> trong đó cặp luôn lưu id nhỏ trước.</p>',
    yc: [['Key (user1, user2), both referencing Users.', 'Khoá (user1, user2), cả hai tham chiếu Users.'], ['CHECK (user1 &lt; user2): no self-friendship and no (2, 1) next to (1, 2).', 'CHECK (user1 &lt; user2): không tự kết bạn và không có (2, 1) cạnh (1, 2).'], YC_DDL],
    giai: `CREATE TABLE Users (
    userID   INT         NOT NULL PRIMARY KEY,
    nickname VARCHAR(30) NOT NULL UNIQUE
);
CREATE TABLE Friendship (
    user1 INT  NOT NULL REFERENCES Users (userID),
    user2 INT  NOT NULL REFERENCES Users (userID),
    since DATE NULL,
    PRIMARY KEY (user1, user2),
    CHECK (user1 < user2)          -- canonical order: each unordered pair has exactly one spelling
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Users', 'Friendship'])),
      duoc(['Three friendships in canonical order', 'Ba quan hệ bạn theo thứ tự chuẩn'], `INSERT INTO Users VALUES (1, 'an'), (2, 'binh'), (3, 'chi'); INSERT INTO Friendship VALUES (1, 2, '2026-01-01'), (1, 3, NULL), (2, 3, NULL)`),
      chan(['(2, 1) is rejected — it must be written (1, 2)', '(2, 1) bị từ chối — phải viết (1, 2)'], `INSERT INTO Users VALUES (1, 'an'), (2, 'binh'); INSERT INTO Friendship VALUES (2, 1, NULL)`, '23514'),
      chan(['Being your own friend is rejected', 'Tự kết bạn với mình bị từ chối'], `INSERT INTO Users VALUES (1, 'an'); INSERT INTO Friendship VALUES (1, 1, NULL)`, '23514'),
      chan(['A duplicate nickname is rejected', 'Trùng nickname bị từ chối'], `INSERT INTO Users VALUES (1, 'an'), (2, 'an')`, '23505', { an: true }),
    ],
    sai: [
      `CREATE TABLE Users (userID INT NOT NULL PRIMARY KEY, nickname VARCHAR(30) NOT NULL UNIQUE); CREATE TABLE Friendship (user1 INT NOT NULL REFERENCES Users(userID), user2 INT NOT NULL REFERENCES Users(userID), since DATE, PRIMARY KEY (user1, user2), CHECK (user1 <> user2));`,
      `CREATE TABLE Users (userID INT NOT NULL PRIMARY KEY, nickname VARCHAR(30) NOT NULL); CREATE TABLE Friendship (user1 INT NOT NULL REFERENCES Users(userID), user2 INT NOT NULL REFERENCES Users(userID), since DATE, PRIMARY KEY (user1, user2), CHECK (user1 < user2));`,
    ],
    gy: [['Without a rule, (1, 2) and (2, 1) are two different rows describing one fact.', 'Không có luật thì (1, 2) và (2, 1) là hai dòng khác nhau cho cùng một sự kiện.'], ['Force a canonical order: CHECK (user1 &lt; user2).', 'Buộc một thứ tự chuẩn: CHECK (user1 &lt; user2).']],
    lhg: [['CHECK (user1 &lt;&gt; user2) — stops self-friendship but still allows both (1, 2) and (2, 1).', 'CHECK (user1 &lt;&gt; user2) — chặn tự kết bạn nhưng vẫn cho cả (1, 2) lẫn (2, 1).'], ['Forgetting UNIQUE on nickname.', 'Quên UNIQUE ở nickname.']],
    gt: ['<p>For a directed relationship (A follows B) both orders are different facts and only &lt;&gt; is wanted; for a symmetric one, &lt; gives each pair exactly one spelling. Queries then look in both columns: WHERE user1 = @me OR user2 = @me.</p>', '<p>Với liên kết có hướng (A theo dõi B) hai chiều là hai sự kiện khác nhau, chỉ cần &lt;&gt;; với liên kết đối xứng, &lt; cho mỗi cặp đúng một cách viết. Khi truy vấn thì tìm ở cả hai cột: WHERE user1 = @me OR user2 = @me.</p>'],
    tn: [tn('symmetric relationship', 'liên kết đối xứng')],
  }),
  cs({
    t: '10 ERD mistakes that lose marks', k: 'EASY', p: 7,
    kn: ['ERD review'], tag: ['erd'],
    en: '<p>Check a diagram the way a PE marker does (workshop, "10 ERD mistakes").</p>', vi: '<p>Soát sơ đồ như người chấm PE (xưởng, "10 lỗi ERD").</p>',
    cau: [
      q('c1', ['The diagram has entity sets "Electronics", "Phones", "Laptops". What is wrong?', 'Sơ đồ có các tập thực thể "Electronics", "Phones", "Laptops". Sai ở đâu?'], ['They are rows of one entity set Category with a recursive relationship', 'Nothing — each category deserves its own rectangle', 'They should be attributes of Product', 'They should be weak entities of Product'], ['Values are not entity sets; a hierarchy of values is a recursive relationship.', 'Giá trị không phải tập thực thể; phân cấp giá trị là liên kết đệ quy.']),
      q('c2', ['A 1-N relationship "Lecturer teaches Course" drawn with a table Teaches(lecturerID, courseID). The marker says…', 'Liên kết 1-N "Lecturer teaches Course" được chuyển thành bảng Teaches(lecturerID, courseID). Người chấm nói…'], ['wrong: a 1-N is just a foreign key in Course', 'correct: every relationship needs a table', 'correct but the key must be lecturerID', 'wrong: it must be a weak entity'], ['A separate table lets a course have two lecturers — exactly what 1-N forbids.', 'Bảng riêng cho phép một môn có hai giảng viên — đúng điều 1-N cấm.']),
      q('c3', ['totalPrice is stored in Order although it is the sum of the order lines. This is…', 'totalPrice được lưu trong Order dù nó là tổng các dòng đơn. Đây là…'], ['a derived attribute stored as data — it can disagree with the lines', 'a multivalued attribute that needs its own table', 'a composite attribute made of several parts', 'a partial key of the weak entity Order'], ['Derived ⇒ compute it (view/query); unitPrice in OrderItem, however, is a deliberate snapshot and IS stored.', 'Dẫn xuất ⇒ tính ra (view/truy vấn); còn unitPrice trong OrderItem là ảnh chụp có chủ ý và ĐƯỢC lưu.']),
      q('c4', ['An M-N relationship Enroll has the attribute grade drawn on the Student rectangle. Why is it wrong?', 'Liên kết M-N Enroll có thuộc tính grade vẽ trên hình Student. Vì sao sai?'], ['grade depends on the pair (student, course), so it belongs on the relationship', 'grade should be a separate entity set with its own key attribute', 'grade must be part of the key of Student to stay unique', 'it is right: a grade always belongs to a student, not a course'], ['A student has many grades — one per course; the attribute of a pairing goes on the diamond.', 'Một sinh viên có nhiều điểm — mỗi môn một điểm; thuộc tính của một cặp đặt trên hình thoi.']),
      q('c5', ['A weak entity Room is drawn with a single rectangle and roomNo underlined as the full key. What is missing?', 'Thực thể yếu Room vẽ bằng hình chữ nhật đơn, roomNo gạch chân như khoá đầy đủ. Thiếu gì?'], ['the double rectangle/diamond and the owner (Hotel) in the identification', 'a second partial key such as floor, underlined twice', 'a derived attribute price computed from the room type', 'a recursive relationship linking each room to the next'], ['roomNo is only a partial key; the identifying relationship to Hotel must be drawn (double diamond).', 'roomNo chỉ là khoá bộ phận; phải vẽ liên kết xác định tới Hotel (hình thoi đôi).']),
      q('c6', ['Two arrows point INTO a many-many relationship "Stars-in". What do the arrows claim?', 'Hai mũi tên chỉ VÀO liên kết nhiều-nhiều "Stars-in". Các mũi tên khẳng định gì?'], ['that it is one-one — contradicting "many-many"', 'nothing, arrows are decoration', 'that both entities are weak', 'that the relationship has attributes'], ['Arrows mean "at most one": on both ends they make the relationship one-one.', 'Mũi tên nghĩa là "tối đa một": ở cả hai đầu thì liên kết thành một-một.']),
    ],
    gy: [['For each relationship ask the two cardinality questions again.', 'Với mỗi liên kết hỏi lại hai câu về bản số.'], ['For each attribute ask: does it describe the entity, or a pairing?', 'Với mỗi thuộc tính hỏi: nó mô tả thực thể, hay một cặp?']],
    lhg: [['Modelling values as entity sets.', 'Mô hình hoá giá trị thành tập thực thể.'], ['Storing derived totals.', 'Lưu tổng dẫn xuất.']],
    tn: [tn('derived attribute', 'thuộc tính dẫn xuất')],
  }),
  cs({
    t: 'Oral exam: what the lecturer asks while looking at your ERD', k: 'MEDIUM', p: 7,
    kn: ['oral exam', 'ERD justification'], tag: ['erd', 'oral-exam'],
    en: '<p>Five questions from the 32-question oral bank of the workshop.</p>', vi: '<p>Năm câu trong ngân hàng 32 câu vấn đáp của xưởng.</p>',
    cau: [
      q('c1', ['"Why is Enroll\'s key (studentID, courseCode, semester) and not just (studentID, courseCode)?"', '"Vì sao khoá của Enroll là (studentID, courseCode, semester) mà không chỉ (studentID, courseCode)?"'], ['Because a failed course can be retaken in a later semester', 'Because semester is a foreign key', 'Because keys need three columns', 'Because studentID is not unique'], ['The business rule "retake later" creates two rows for the same pair, so semester joins the key.', 'Luật nghiệp vụ "học lại sau" tạo hai dòng cho cùng một cặp nên semester vào khoá.']),
      q('c2', ['"Why is Visit a strong entity and not weak, although it needs a patient?"', '"Vì sao Visit là thực thể mạnh chứ không yếu, dù nó cần một bệnh nhân?"'], ['It has its own identifier visitID; needing a patient is just total participation', 'Because it has more than two attributes, and weak entities have at most two', 'Because doctors are strong entities and visits copy their kind', 'It should be weak — the design is wrong and loses the patient'], ['Weak = cannot be identified without the owner. visitID identifies it alone; patientID is an ordinary NOT NULL foreign key.', 'Yếu = không xác định được nếu thiếu chủ. visitID tự xác định nó; patientID là khoá ngoại NOT NULL bình thường.']),
      q('c3', ['"Where do you put the foreign key for a 1-1 relationship?"', '"Đặt khoá ngoại của liên kết 1-1 ở đâu?"'], ['On the side with total participation, with UNIQUE', 'On both sides, each pointing at the other', 'In a new table holding both keys', 'On the side with fewer rows, without UNIQUE'], ['Total side ⇒ NOT NULL is possible; UNIQUE keeps it 1-1.', 'Phía toàn phần ⇒ đặt NOT NULL được; UNIQUE giữ cho nó là 1-1.']),
      q('c4', ['"Your Order stores unitPrice in OrderItem but not totalPrice. Why the difference?"', '"Order của em lưu unitPrice ở OrderItem mà không lưu totalPrice. Vì sao khác nhau?"'], ['unitPrice is a historical snapshot; totalPrice can always be recomputed', 'unitPrice takes less space, so it is cheaper to store', 'totalPrice is part of the key of Order, so it is fixed', 'Both are wrong to store; the shop should compute them'], ['A product price changes later; the price paid must be frozen. The total is derivable from the lines.', 'Giá sản phẩm sẽ đổi; giá đã trả phải được đóng băng. Tổng thì luôn tính lại được từ các dòng.']),
      q('c5', ['"What would change if each course could have several lecturers?"', '"Điều gì thay đổi nếu mỗi môn có thể có nhiều giảng viên?"'], ['teaches becomes M-N: a new table Teaches(lecturerID, courseCode)', 'Nothing', 'Lecturer becomes a weak entity of Course', 'Course gets a multivalued attribute lecturerID'], ['Cardinality changes the mapping rule: 1-N (FK) becomes M-N (table).', 'Bản số đổi thì luật chuyển đổi đổi: 1-N (khoá ngoại) thành M-N (bảng).']),
    ],
    gy: [['Every design choice must be traced back to a sentence of the brief.', 'Mọi lựa chọn thiết kế phải chỉ ra được câu nào trong đề.'], ['Weak ≠ "depends on"; weak = "cannot be identified without".', 'Yếu ≠ "phụ thuộc"; yếu = "không xác định được nếu thiếu".']],
    lhg: [['Answering "because it is like that in the sample" instead of naming the business rule.', 'Trả lời "vì mẫu làm vậy" thay vì nêu luật nghiệp vụ.'], ['Calling every dependent entity weak.', 'Gọi mọi thực thể phụ thuộc là yếu.']],
    tn: [tn('oral defence', 'bảo vệ vấn đáp')],
  }),
]);
