/**
 * DBI202 · 3.1 Thực thể, liên kết & sơ đồ — đọc yêu cầu nghiệp vụ thành thực thể/thuộc tính/liên kết, bản số, 1-N thành khoá ngoại.
 */
import { mod, de, cs, q, bang1, sau, chan, duoc, cot, YC_DDL, TN, tn } from './_chung.mjs';

export default mod('dbi202-er-model', '3.1 Entities, relationships & diagrams', [
  cs({
    t: 'Entity, attribute or relationship?', k: 'EASY', p: 7,
    kn: ['entity vs attribute', 'relationship'], tag: ['erd'],
    en: '<p>"A library lends <b>books</b> to <b>members</b>. Each book has an ISBN, a title and a <b>publisher</b>; publishers have a name and a country. A member borrows a book on a date and must return it by a due date."</p>',
    vi: '<p>"Thư viện cho <b>độc giả</b> mượn <b>sách</b>. Mỗi cuốn có ISBN, tên và <b>nhà xuất bản</b>; nhà xuất bản có tên và quốc gia. Độc giả mượn sách vào một ngày và phải trả trước hạn."</p>',
    cau: [
      q('c1', ['Publisher has its own attributes (name, country) and many books share one publisher. Model it as…', 'Nhà xuất bản có thuộc tính riêng (tên, quốc gia) và nhiều sách chung một nhà xuất bản. Mô hình hoá nó là…'], ['an entity set related to Book', 'a text attribute of Book', 'a multivalued attribute of Member', 'a relationship with no entity'], ['Something with its own attributes, shared by many, is an entity — otherwise country would be repeated in every book.', 'Thứ có thuộc tính riêng và được nhiều đối tượng dùng chung là thực thể — nếu không quốc gia sẽ lặp ở mọi cuốn sách.']),
      q('c2', ['"borrows" between Member and Book is…', '"mượn" giữa Member và Book là…'], ['a relationship', 'an entity set', 'an attribute of Book', 'a key'], ['A verb linking two entity sets ⇒ relationship (diamond).', 'Động từ nối hai tập thực thể ⇒ liên kết (hình thoi).']),
      q('c3', ['Where do borrowDate and dueDate belong?', 'borrowDate và dueDate thuộc về đâu?'], ['to the relationship Borrows', 'to Book', 'to Member', 'to Publisher'], ['They describe one particular loan (a member + a book), not the book or the member alone.', 'Chúng mô tả một lượt mượn cụ thể (độc giả + sách), không phải riêng sách hay độc giả.']),
      q('c4', ['A member may borrow many books and a book is borrowed by many members over time. Borrows is…', 'Một độc giả mượn nhiều sách và một cuốn được nhiều độc giả mượn theo thời gian. Borrows là…'], ['many-many', 'one-many', 'one-one', 'many-one towards Member'], ['Many on both sides ⇒ M-N ⇒ its own table later (lesson 3.4).', 'Nhiều ở cả hai phía ⇒ M-N ⇒ sau này thành bảng riêng (bài 3.4).']),
      q('c5', ['ISBN is underlined in the diagram because…', 'ISBN được gạch chân trong sơ đồ vì…'], ['it is the key of Book', 'it is a foreign key', 'it is optional', 'it is multivalued'], ['Underlined attribute = key attribute (identifies the entity).', 'Thuộc tính gạch chân = thuộc tính khoá (xác định thực thể).']),
    ],
    gy: [['Nouns with their own attributes ⇒ entities; verbs ⇒ relationships; adjectives/values ⇒ attributes.', 'Danh từ có thuộc tính riêng ⇒ thực thể; động từ ⇒ liên kết; tính từ/giá trị ⇒ thuộc tính.'], ['An attribute that describes a pairing belongs to the relationship.', 'Thuộc tính mô tả một cặp thì thuộc về liên kết.']],
    lhg: [['Storing publisher name and country inside Book — redundancy (Chapter 4 calls it an anomaly).', 'Lưu tên và quốc gia NXB trong Book — dư thừa (Chương 4 gọi là dị thường).'], ['Putting dueDate on Book — a book has a different due date on every loan.', 'Đặt dueDate vào Book — mỗi lần mượn một hạn khác nhau.']],
    tn: [tn('entity', 'thực thể'), tn('attribute', 'thuộc tính'), tn('relationship', 'liên kết')],
  }),
  cs({
    t: 'Read the cardinality from a business sentence', k: 'EASY', p: 6, loai: 'table',
    kn: ['cardinality', '1-1', '1-N', 'M-N'], tag: ['erd'],
    en: '<p>For each sentence give the cardinality of the relationship (left entity – right entity).</p>',
    vi: '<p>Với mỗi câu, cho bản số của liên kết (thực thể trái – thực thể phải).</p>',
    bang: [bang1('b1', ['Cardinality', 'Bản số'],
      [{ ma: 'cau', ten: 'Sentence / Câu' }, { ma: 'bs', ten: 'Cardinality / Bản số', luaChon: ['1-1', '1-N', 'N-1', 'M-N'] }],
      [{ o: { cau: 'Department – Employee: an employee works in one department; a department has many employees.' }, a: { bs: '1-N' } },
        { o: { cau: 'Student – Course: a student takes many courses; a course has many students.' }, a: { bs: 'M-N' } },
        { o: { cau: 'Country – Capital: each country has one capital city; a capital belongs to one country.' }, a: { bs: '1-1' } },
        { o: { cau: 'Order – Customer: an order is placed by one customer; a customer places many orders.' }, a: { bs: 'N-1' } },
        { o: { cau: 'Doctor – Patient: a doctor treats many patients; a patient sees many doctors.' }, a: { bs: 'M-N' } }],
      ['Ask the question twice: "one X has how many Y?" and "one Y has how many X?". One-many in one direction and one in the other gives 1-N (or N-1 read from the other side).', 'Hỏi hai lần: "một X có bao nhiêu Y?" và "một Y có bao nhiêu X?". Một chiều nhiều, chiều kia một ⇒ 1-N (hoặc N-1 khi đọc từ phía kia).'])],
    gy: [['Always read both directions.', 'Luôn đọc cả hai chiều.'], ['N-1 is just 1-N written from the many side.', 'N-1 chỉ là 1-N viết từ phía nhiều.']],
    lhg: [['Reading only one direction and answering 1-N for a real M-N.', 'Chỉ đọc một chiều và trả 1-N cho một liên kết thật ra M-N.'], ['Writing 1-N for Order–Customer when the order is on the left (it is N-1).', 'Ghi 1-N cho Order–Customer khi Order đứng bên trái (đúng là N-1).']],
    tn: [tn('cardinality', 'bản số')],
  }),
  de({
    csdl: '', ld: null,
    t: '1-N: Department and Employee', k: 'MEDIUM', p: 9,
    kn: ['1-N', 'foreign key on the N side', 'total participation'], tag: ['erd', 'ddl'],
    en: '<p>Every employee works in exactly one department; a department has many employees. Create <code>Department(depID INT PK, depName VARCHAR(50) NOT NULL UNIQUE)</code> and <code>Employee(empID INT PK, fullName VARCHAR(50) NOT NULL, depID INT)</code>.</p>',
    vi: '<p>Mỗi nhân viên làm ở đúng một phòng; một phòng có nhiều nhân viên. Tạo <code>Department(depID INT PK, depName VARCHAR(50) NOT NULL UNIQUE)</code> và <code>Employee(empID INT PK, fullName VARCHAR(50) NOT NULL, depID INT)</code>.</p>',
    yc: [['The relationship becomes the column Employee.depID: a FOREIGN KEY to Department.', 'Liên kết thành cột Employee.depID: FOREIGN KEY tới Department.'], ['"Exactly one" = total participation ⇒ depID NOT NULL.', '"Đúng một" = tham gia toàn phần ⇒ depID NOT NULL.'], YC_DDL],
    giai: `CREATE TABLE Department (
    depID   INT         NOT NULL PRIMARY KEY,
    depName VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE Employee (
    empID    INT         NOT NULL PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    depID    INT         NOT NULL REFERENCES Department (depID)   -- 1-N: FK on the N side, NOT NULL = "exactly one"
);`,
    kiem: [
      sau(['Tables and columns', 'Bảng và cột'], cot(['Department', 'Employee'])),
      duoc(['Two employees in one department', 'Hai nhân viên cùng một phòng'], `INSERT INTO Department VALUES (1, 'IT'); INSERT INTO Employee VALUES (10, 'An', 1), (11, 'Binh', 1)`),
      chan(['An employee without a department is rejected', 'Nhân viên không có phòng bị từ chối'], `INSERT INTO Employee (empID, fullName) VALUES (12, 'Chi')`, '23502'),
      chan(['An employee of an unknown department is rejected', 'Nhân viên của phòng không tồn tại bị từ chối'], `INSERT INTO Employee VALUES (13, 'Dung', 99)`, '23503'),
      chan(['Two departments with the same name are rejected', 'Hai phòng trùng tên bị từ chối'], `INSERT INTO Department VALUES (1, 'IT'), (2, 'IT')`, '23505'),
    ],
    sai: [
      `CREATE TABLE Department (depID INT NOT NULL PRIMARY KEY, depName VARCHAR(50) NOT NULL UNIQUE); CREATE TABLE Employee (empID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, depID INT REFERENCES Department(depID));`,
      `CREATE TABLE Department (depID INT NOT NULL PRIMARY KEY, depName VARCHAR(50) NOT NULL); CREATE TABLE Employee (empID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, depID INT NOT NULL REFERENCES Department(depID));`,
    ],
    gy: [['1-N ⇒ no new table: put the key of the "1" side into the "N" side.', '1-N ⇒ không bảng mới: đưa khoá của phía "1" sang phía "N".'], ['Total participation ⇒ NOT NULL on that foreign key.', 'Tham gia toàn phần ⇒ NOT NULL trên khoá ngoại đó.']],
    lhg: [['Leaving depID nullable — "exactly one" becomes "at most one".', 'Để depID cho phép NULL — "đúng một" thành "tối đa một".'], ['Forgetting UNIQUE on depName.', 'Quên UNIQUE ở depName.']],
    gt: ['<p>Participation decides NULL/NOT NULL of the foreign key; cardinality decides where it goes. Never put the FK on the "1" side — a department cannot hold a list of employees in one column.</p>', '<p>Mức tham gia quyết NULL/NOT NULL của khoá ngoại; bản số quyết nó nằm đâu. Đừng đặt khoá ngoại ở phía "1" — một phòng không chứa được danh sách nhân viên trong một cột.</p>'],
    tn: [TN.fk, tn('total participation', 'tham gia toàn phần')],
  }),
]);
