/**
 * DBI202 · 3.2 Thực thể yếu, liên kết n-ngôi & thuộc tính đa trị — Hotel/Room, điện thoại nhiều số, Supplies ba ngôi.
 */
import { mod, de, cs, q, sau, chan, duoc, cot, YC_DDL, TN, tn } from './_chung.mjs';

export default mod('dbi202-er-nang-cao', '3.2 Weak entities, n-ary & multivalued attributes', [
  de({
    csdl: '', ld: null,
    t: 'Weak entity: rooms of a hotel', k: 'MEDIUM', p: 10,
    kn: ['weak entity', 'partial key', 'ON DELETE CASCADE'], tag: ['erd', 'ddl', 'weak-entity'],
    en: '<p>A hotel chain: <code>Hotel(hotelID INT PK, hotelName VARCHAR(60) NOT NULL)</code>. Room 101 exists in many hotels, so a room is identified by (hotel, roomNo): <code>Room(hotelID INT, roomNo INT, roomType VARCHAR(10), price DECIMAL(10,2))</code>. Prices are positive; closing a hotel removes its rooms.</p>',
    vi: '<p>Chuỗi khách sạn: <code>Hotel(hotelID INT PK, hotelName VARCHAR(60) NOT NULL)</code>. Phòng 101 có ở nhiều khách sạn nên phòng được xác định bằng (khách sạn, số phòng): <code>Room(hotelID INT, roomNo INT, roomType VARCHAR(10), price DECIMAL(10,2))</code>. Giá dương; đóng cửa khách sạn thì xoá các phòng của nó.</p>',
    yc: [['Room\'s key = (hotelID, roomNo); hotelID references Hotel ON DELETE CASCADE.', 'Khoá của Room = (hotelID, roomNo); hotelID tham chiếu Hotel ON DELETE CASCADE.'], ['CHECK (price &gt; 0).', 'CHECK (price &gt; 0).'], YC_DDL],
    giai: `CREATE TABLE Hotel (
    hotelID   INT         NOT NULL PRIMARY KEY,
    hotelName VARCHAR(60) NOT NULL
);
CREATE TABLE Room (
    hotelID  INT           NOT NULL REFERENCES Hotel (hotelID) ON DELETE CASCADE,  -- owner
    roomNo   INT           NOT NULL,                                               -- partial key
    roomType VARCHAR(10)   NULL,
    price    DECIMAL(10,2) NULL CHECK (price > 0),
    PRIMARY KEY (hotelID, roomNo)
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Hotel', 'Room'])),
      duoc(['Room 101 in two hotels', 'Phòng 101 ở hai khách sạn'], `INSERT INTO Hotel VALUES (1, 'CT Hanoi'), (2, 'CT Danang'); INSERT INTO Room VALUES (1, 101, 'single', 500000), (2, 101, 'double', 700000)`),
      chan(['Room 101 twice in one hotel is rejected', 'Hai phòng 101 trong một khách sạn bị từ chối'], `INSERT INTO Hotel VALUES (1, 'CT Hanoi'); INSERT INTO Room VALUES (1, 101, 'single', 500000), (1, 101, 'double', 700000)`, '23505'),
      chan(['A zero price is rejected', 'Giá 0 bị từ chối'], `INSERT INTO Hotel VALUES (1, 'CT Hanoi'); INSERT INTO Room VALUES (1, 102, 'single', 0)`, '23514'),
      sau(['Closing a hotel removes its rooms', 'Đóng cửa khách sạn thì xoá các phòng'], `INSERT INTO Hotel VALUES (1, 'CT Hanoi'), (2, 'CT Danang'); INSERT INTO Room VALUES (1, 101, 'single', 1), (1, 102, 'single', 1), (2, 101, 'single', 1); DELETE FROM Hotel WHERE hotelID = 1; SELECT hotelID, roomNo FROM Room`),
    ],
    sai: [
      `CREATE TABLE Hotel (hotelID INT NOT NULL PRIMARY KEY, hotelName VARCHAR(60) NOT NULL); CREATE TABLE Room (hotelID INT NOT NULL REFERENCES Hotel(hotelID) ON DELETE CASCADE, roomNo INT NOT NULL PRIMARY KEY, roomType VARCHAR(10), price DECIMAL(10,2) CHECK (price > 0));`,
      `CREATE TABLE Hotel (hotelID INT NOT NULL PRIMARY KEY, hotelName VARCHAR(60) NOT NULL); CREATE TABLE Room (hotelID INT NOT NULL REFERENCES Hotel(hotelID), roomNo INT NOT NULL, roomType VARCHAR(10), price DECIMAL(10,2) CHECK (price > 0), PRIMARY KEY (hotelID, roomNo));`,
    ],
    gy: [['Partial key (roomNo) + owner key (hotelID) = key of the weak entity.', 'Khoá bộ phận (roomNo) + khoá chủ (hotelID) = khoá của thực thể yếu.'], ['A weak entity dies with its owner: ON DELETE CASCADE.', 'Thực thể yếu chết theo chủ: ON DELETE CASCADE.']],
    lhg: [['PRIMARY KEY (roomNo) — the second hotel cannot have a room 101.', 'PRIMARY KEY (roomNo) — khách sạn thứ hai không có được phòng 101.'], ['No CASCADE — closing a hotel is blocked by its rooms.', 'Không CASCADE — đóng cửa khách sạn bị các phòng chặn lại.']],
    gt: ['<p>Ask "is this number unique on its own, or only inside something?" — "only inside" means weak entity, and the "something" joins the key.</p>', '<p>Hỏi "số này tự nó duy nhất, hay chỉ duy nhất bên trong một thứ khác?" — "chỉ bên trong" nghĩa là thực thể yếu, và "thứ khác" đó tham gia vào khoá.</p>'],
    tn: [tn('weak entity', 'thực thể yếu'), tn('partial key', 'khoá bộ phận')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Multivalued attribute: an employee\'s phone numbers', k: 'EASY', p: 8,
    kn: ['multivalued attribute', '1NF'], tag: ['erd', 'ddl'],
    en: '<p>An employee may have several phone numbers. Instead of a column <code>phones</code> holding "0901…, 0912…", create <code>Employee(empID INT PK, fullName VARCHAR(50) NOT NULL)</code> and <code>EmployeePhone(empID INT, phone VARCHAR(15))</code>.</p>',
    vi: '<p>Một nhân viên có thể có nhiều số điện thoại. Thay vì một cột <code>phones</code> chứa "0901…, 0912…", tạo <code>Employee(empID INT PK, fullName VARCHAR(50) NOT NULL)</code> và <code>EmployeePhone(empID INT, phone VARCHAR(15))</code>.</p>',
    yc: [['EmployeePhone\'s key = (empID, phone); empID references Employee.', 'Khoá của EmployeePhone = (empID, phone); empID tham chiếu Employee.'], YC_DDL],
    giai: `CREATE TABLE Employee (
    empID    INT         NOT NULL PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL
);
CREATE TABLE EmployeePhone (                       -- one row per (employee, phone)
    empID INT         NOT NULL REFERENCES Employee (empID),
    phone VARCHAR(15) NOT NULL,
    PRIMARY KEY (empID, phone)
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Employee', 'EmployeePhone'])),
      duoc(['One employee, three phones', 'Một nhân viên, ba số điện thoại'], `INSERT INTO Employee VALUES (1, 'An'); INSERT INTO EmployeePhone VALUES (1, '0901000001'), (1, '0912000002'), (1, '0283000003')`),
      duoc(['Two employees may share an office phone', 'Hai nhân viên dùng chung một số văn phòng được'], `INSERT INTO Employee VALUES (1, 'An'), (2, 'Binh'); INSERT INTO EmployeePhone VALUES (1, '0283000003'), (2, '0283000003')`),
      chan(['The same phone twice for one employee is rejected', 'Một số hai lần cho cùng nhân viên bị từ chối'], `INSERT INTO Employee VALUES (1, 'An'); INSERT INTO EmployeePhone VALUES (1, '0901000001'), (1, '0901000001')`, '23505'),
      chan(['A phone of an unknown employee is rejected', 'Số điện thoại của nhân viên không tồn tại bị từ chối'], `INSERT INTO EmployeePhone VALUES (9, '0901000001')`, '23503'),
    ],
    sai: [
      `CREATE TABLE Employee (empID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL); CREATE TABLE EmployeePhone (empID INT NOT NULL PRIMARY KEY REFERENCES Employee(empID), phone VARCHAR(15) NOT NULL);`,
      `CREATE TABLE Employee (empID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL); CREATE TABLE EmployeePhone (empID INT NOT NULL REFERENCES Employee(empID), phone VARCHAR(15) NOT NULL PRIMARY KEY);`,
    ],
    gy: [['Rule R7: multivalued attribute ⇒ its own table (owner key, value).', 'Luật R7: thuộc tính đa trị ⇒ bảng riêng (khoá chủ, giá trị).'], ['The key is both columns.', 'Khoá là cả hai cột.']],
    lhg: [['Key = empID — one phone per employee again.', 'Khoá = empID — lại chỉ một số mỗi người.'], ['Key = phone — two employees cannot share an office number.', 'Khoá = phone — hai người không dùng chung số văn phòng được.']],
    gt: ['<p>A comma-separated list in one cell breaks 1NF: you cannot index it, constrain it or join on it. One row per value fixes all three.</p>', '<p>Danh sách ngăn bằng dấu phẩy trong một ô phá 1NF: không đánh chỉ mục, không ràng buộc, không nối được. Mỗi giá trị một dòng sửa cả ba.</p>'],
    tn: [tn('multivalued attribute', 'thuộc tính đa trị')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Ternary relationship: who supplies which part to which project', k: 'HARD', p: 12,
    kn: ['ternary relationship', 'n-ary key'], tag: ['erd', 'ddl', 'ternary'],
    en: '<p>A supplier supplies a part to a project, with a quantity. The same supplier can supply the same part to another project, and the same part for the same project can come from several suppliers. Create <code>Supplier(supID INT PK)</code>, <code>Part(partID INT PK)</code>, <code>Project(projID INT PK)</code> (one column each is enough here) and <code>Supplies(supID, partID, projID, qty INT)</code> with qty &gt; 0.</p>',
    vi: '<p>Nhà cung cấp cung cấp một linh kiện cho một dự án, kèm số lượng. Cùng nhà cung cấp có thể cấp cùng linh kiện cho dự án khác, và cùng linh kiện cho cùng dự án có thể đến từ nhiều nhà cung cấp. Tạo <code>Supplier(supID INT PK)</code>, <code>Part(partID INT PK)</code>, <code>Project(projID INT PK)</code> (mỗi bảng một cột là đủ) và <code>Supplies(supID, partID, projID, qty INT)</code> với qty &gt; 0.</p>',
    yc: [['Rule R6: key of Supplies = all three foreign keys.', 'Luật R6: khoá của Supplies = cả ba khoá ngoại.'], ['Each of the three columns references its table; CHECK (qty &gt; 0).', 'Mỗi cột trong ba cột tham chiếu bảng của nó; CHECK (qty &gt; 0).'], YC_DDL],
    giai: `CREATE TABLE Supplier (supID  INT NOT NULL PRIMARY KEY);
CREATE TABLE Part     (partID INT NOT NULL PRIMARY KEY);
CREATE TABLE Project  (projID INT NOT NULL PRIMARY KEY);
CREATE TABLE Supplies (
    supID  INT NOT NULL REFERENCES Supplier (supID),
    partID INT NOT NULL REFERENCES Part (partID),
    projID INT NOT NULL REFERENCES Project (projID),
    qty    INT NOT NULL CHECK (qty > 0),
    PRIMARY KEY (supID, partID, projID)        -- no arrow in the diagram ⇒ all three keys
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Supplier', 'Part', 'Project', 'Supplies'])),
      duoc(['Same supplier, same part, two projects; same part and project from two suppliers', 'Cùng NCC, cùng linh kiện, hai dự án; cùng linh kiện và dự án từ hai NCC'], `INSERT INTO Supplier VALUES (1), (2); INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100), (200); INSERT INTO Supplies VALUES (1, 10, 100, 5), (1, 10, 200, 3), (2, 10, 100, 7)`),
      chan(['The same triple twice is rejected', 'Cùng bộ ba hai lần bị từ chối'], `INSERT INTO Supplier VALUES (1); INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100); INSERT INTO Supplies VALUES (1, 10, 100, 5), (1, 10, 100, 6)`, '23505'),
      chan(['An unknown project is rejected', 'Dự án không tồn tại bị từ chối'], `INSERT INTO Supplier VALUES (1); INSERT INTO Part VALUES (10); INSERT INTO Supplies VALUES (1, 10, 999, 5)`, '23503'),
      chan(['A quantity of 0 is rejected', 'Số lượng 0 bị từ chối'], `INSERT INTO Supplier VALUES (1); INSERT INTO Part VALUES (10); INSERT INTO Project VALUES (100); INSERT INTO Supplies VALUES (1, 10, 100, 0)`, '23514'),
    ],
    sai: [
      `CREATE TABLE Supplier (supID INT NOT NULL PRIMARY KEY); CREATE TABLE Part (partID INT NOT NULL PRIMARY KEY); CREATE TABLE Project (projID INT NOT NULL PRIMARY KEY); CREATE TABLE Supplies (supID INT NOT NULL REFERENCES Supplier(supID), partID INT NOT NULL REFERENCES Part(partID), projID INT NOT NULL REFERENCES Project(projID), qty INT NOT NULL CHECK (qty > 0), PRIMARY KEY (supID, partID));`,
      `CREATE TABLE Supplier (supID INT NOT NULL PRIMARY KEY); CREATE TABLE Part (partID INT NOT NULL PRIMARY KEY); CREATE TABLE Project (projID INT NOT NULL PRIMARY KEY); CREATE TABLE Supplies (supID INT NOT NULL, partID INT NOT NULL, projID INT NOT NULL, qty INT NOT NULL CHECK (qty > 0), PRIMARY KEY (supID, partID, projID));`,
    ],
    gy: [['A ternary relationship without arrows ⇒ a table keyed by all three entity keys.', 'Liên kết ba ngôi không mũi tên ⇒ bảng có khoá gồm cả ba khoá thực thể.'], ['Three REFERENCES, one per entity set.', 'Ba REFERENCES, mỗi tập thực thể một cái.']],
    lhg: [['Key (supID, partID) — the same supplier cannot then supply the same part to a second project.', 'Khoá (supID, partID) — khi đó cùng NCC không cấp được cùng linh kiện cho dự án thứ hai.'], ['No foreign keys — supplies to projects that do not exist.', 'Không có khoá ngoại — cung cấp cho dự án không tồn tại.']],
    gt: ['<p>If the diagram had an arrow to Supplier ("each part for each project comes from ONE supplier"), the key would shrink to (partID, projID). Arrows remove an entity from the key.</p>', '<p>Nếu sơ đồ có mũi tên tới Supplier ("mỗi linh kiện cho mỗi dự án chỉ từ MỘT NCC"), khoá sẽ rút còn (partID, projID). Mũi tên đưa một thực thể ra khỏi khoá.</p>'],
    tn: [tn('ternary relationship', 'liên kết ba ngôi')],
  }),
  cs({
    t: 'Participation, composite and derived attributes', k: 'MEDIUM', p: 7,
    kn: ['total participation', 'composite attribute', 'derived attribute'], tag: ['erd'],
    en: '<p>Lesson 3.2, sections 2 and 4.</p>', vi: '<p>Bài 3.2, mục 2 và 4.</p>',
    cau: [
      q('c1', ['A double line between Employee and WorksIn means…', 'Đường đôi giữa Employee và WorksIn nghĩa là…'], ['every employee must take part (total participation)', 'the relationship is many-many', 'Employee is a weak entity', 'WorksIn has two attributes'], ['Total participation ⇒ in SQL the foreign key is NOT NULL.', 'Tham gia toàn phần ⇒ trong SQL khoá ngoại là NOT NULL.']),
      q('c2', ['address = (street, district, city) is a composite attribute. In the table it becomes…', 'address = (street, district, city) là thuộc tính phức hợp. Trong bảng nó thành…'], ['three columns street, district, city', 'one column holding the three parts', 'a separate table Address', 'a CHECK constraint'], ['Composite ⇒ one column per component (multivalued ⇒ a table).', 'Phức hợp ⇒ mỗi thành phần một cột (đa trị ⇒ một bảng).']),
      q('c3', ['age is derived from birthDate. Do we store it?', 'age được suy ra từ birthDate. Có lưu nó không?'], ['No — compute it in a query or a view, it changes every year', 'Yes — as a NOT NULL INT column updated by the app', 'Yes — as part of the key, so ages stay unique', 'Only as a multivalued attribute in its own table'], ['A stored age becomes wrong on every birthday; derived attributes (dashed oval) are computed.', 'Tuổi lưu sẵn sẽ sai sau mỗi sinh nhật; thuộc tính dẫn xuất (oval nét đứt) được tính.']),
      q('c4', ['When can a ternary relationship be replaced by binary ones without losing information?', 'Khi nào liên kết ba ngôi thay được bằng các liên kết hai ngôi mà không mất thông tin?'], ['When one entity is determined by the other two (or a pair is independent)', 'Always — ternary relationships are never needed', 'Never', 'Only when all three entities are weak'], ['If the combination itself is the fact (supplier-part-project), splitting loses it; if one side is determined by the others, a binary design works.', 'Nếu chính tổ hợp là sự kiện (NCC-linh kiện-dự án), tách ra là mất; nếu một bên được hai bên kia quyết định thì thiết kế hai ngôi được.']),
    ],
    gy: [['Double line = total participation; arrow = at most one.', 'Đường đôi = tham gia toàn phần; mũi tên = tối đa một.'], ['Composite ⇒ columns; multivalued ⇒ table; derived ⇒ not stored.', 'Phức hợp ⇒ nhiều cột; đa trị ⇒ bảng; dẫn xuất ⇒ không lưu.']],
    lhg: [['Storing age next to birthDate.', 'Lưu age cạnh birthDate.'], ['Turning a composite attribute into a table (that is for multivalued ones).', 'Biến thuộc tính phức hợp thành bảng (đó là cách cho thuộc tính đa trị).']],
    tn: [tn('composite attribute', 'thuộc tính phức hợp'), tn('derived attribute', 'thuộc tính dẫn xuất')],
  }),
]);
