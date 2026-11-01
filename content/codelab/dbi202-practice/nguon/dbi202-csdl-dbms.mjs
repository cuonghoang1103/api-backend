/**
 * DBI202 · 1.1 Vì sao cần CSDL & DBMS làm gì — vấn đề của tệp/Excel, ràng buộc nằm trong CSDL (bảng Mark), vai trò DBMS.
 */
import { mod, de, cs, q, bang1, chan, duoc, ma, TN, tn } from './_chung.mjs';

export default mod('dbi202-csdl-dbms', '1.1 Why databases & what a DBMS does', [
  cs({
    t: 'Spreadsheet trouble: name the problem a DBMS solves', k: 'EASY', p: 7, loai: 'table',
    kn: ['file-processing problems', 'redundancy', 'integrity', 'concurrency'], tag: ['theory'],
    en: '<p>A faculty keeps marks in several Excel files. For each incident, name the classic file-processing problem it shows (lesson 1.1).</p>',
    vi: '<p>Một khoa lưu điểm trong nhiều tệp Excel. Với mỗi sự cố, gọi tên vấn đề kinh điển của xử lý bằng tệp mà nó cho thấy (bài 1.1).</p>',
    bang: [bang1('b1', ['Incident → problem', 'Sự cố → vấn đề'],
      [{ ma: 'sc', ten: 'Incident / Sự cố' }, { ma: 'vd', ten: 'Problem / Vấn đề', luaChon: ['redundancy & inconsistency', 'integrity (bad values)', 'concurrent access', 'atomicity (half-done work)', 'security (who may see what)', 'hard data access (new question = new program)'] }],
      [{ o: { sc: 'A student\'s phone number is in 3 files; one was updated, two were not.' }, a: { vd: 'redundancy & inconsistency' } },
        { o: { sc: 'Someone typed 85 instead of 8.5 and nothing complained.' }, a: { vd: 'integrity (bad values)' } },
        { o: { sc: 'Two lecturers saved the same file at once; the second save erased the first.' }, a: { vd: 'concurrent access' } },
        { o: { sc: 'The laptop died while a macro was moving marks to the new file; half of them moved.' }, a: { vd: 'atomicity (half-done work)' } },
        { o: { sc: 'Every TA can open the file that also holds students\' home addresses.' }, a: { vd: 'security (who may see what)' } },
        { o: { sc: '"Which students failed two courses this term?" needs someone to write a new VBA script.' }, a: { vd: 'hard data access (new question = new program)' } }],
      ['A DBMS answers each: one copy of each fact, constraints (CHECK), concurrency control, transactions, permissions and a query language.', 'DBMS giải từng cái: mỗi sự kiện một bản, ràng buộc (CHECK), kiểm soát tương tranh, giao dịch, phân quyền và ngôn ngữ truy vấn.'])],
    gy: [['Same fact in many places ⇒ redundancy; copies disagree ⇒ inconsistency.', 'Một sự kiện ở nhiều nơi ⇒ dư thừa; các bản lệch nhau ⇒ không nhất quán.'], ['"Half done" is about atomicity; "at the same time" is about concurrency.', '"Làm dở" là tính nguyên tử; "cùng lúc" là tương tranh.']],
    lhg: [['Calling the 85-for-8.5 typo "inconsistency" — it is a single bad value: an integrity problem.', 'Gọi lỗi gõ 85 thay 8.5 là "không nhất quán" — đó là một giá trị sai: vấn đề toàn vẹn.'], ['Mixing concurrency (two users at once) with atomicity (one job interrupted).', 'Nhầm tương tranh (hai người cùng lúc) với nguyên tử (một việc bị ngắt giữa chừng).']],
    tn: [tn('data redundancy', 'dư thừa dữ liệu'), tn('data integrity', 'toàn vẹn dữ liệu'), tn('atomicity', 'tính nguyên tử')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Put the rule in the database: the Mark table', k: 'MEDIUM', p: 10,
    kn: ['CHECK', 'PRIMARY KEY', 'integrity'], tag: ['ddl', 'constraints'],
    en: '<p>In Excel nothing stopped a typo of 85 instead of 8.5. Create the table <code>Mark</code> so that the <b>database itself</b> rejects bad data:</p><ul><li><code>studentID CHAR(8)</code>, <code>course CHAR(6)</code>, <code>score DECIMAL(3,1)</code> — all required;</li><li>a score must be between 0 and 10;</li><li>the same student cannot get two marks for the same course.</li></ul>',
    vi: '<p>Trong Excel không gì chặn lỗi gõ 85 thay vì 8.5. Tạo bảng <code>Mark</code> để <b>chính CSDL</b> từ chối dữ liệu sai:</p><ul><li><code>studentID CHAR(8)</code>, <code>course CHAR(6)</code>, <code>score DECIMAL(3,1)</code> — đều bắt buộc;</li><li>điểm phải từ 0 đến 10;</li><li>một sinh viên không có hai điểm cho cùng một môn.</li></ul>',
    yc: [['One CREATE TABLE statement named <code>Mark</code>.', 'Một câu CREATE TABLE tên <code>Mark</code>.'], ['Use NOT NULL, a CHECK and a composite PRIMARY KEY.', 'Dùng NOT NULL, một CHECK và khoá chính ghép.']],
    giai: `CREATE TABLE Mark (
    studentID CHAR(8)      NOT NULL,
    course    CHAR(6)      NOT NULL,
    score     DECIMAL(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10),   -- the rule lives in the database
    CONSTRAINT pk_mark PRIMARY KEY (studentID, course)                -- no duplicate mark
);`,
    kiem: [
      duoc(['A normal mark is accepted', 'Điểm bình thường được nhận'], `INSERT INTO Mark VALUES ('SE190001', 'DBI202', 8.5)`),
      chan(['85 instead of 8.5 is rejected', '85 thay vì 8.5 bị từ chối'], `INSERT INTO Mark VALUES ('SE190002', 'DBI202', 85)`),
      chan(['A negative score is rejected', 'Điểm âm bị từ chối'], `INSERT INTO Mark VALUES ('SE190002', 'DBI202', -1)`, '23514'),
      chan(['A second mark for the same student and course is rejected', 'Điểm thứ hai cùng sinh viên cùng môn bị từ chối'], `INSERT INTO Mark VALUES ('SE190001', 'DBI202', 8.5); INSERT INTO Mark VALUES ('SE190001', 'DBI202', 9.0)`, '23505'),
      chan(['A missing score is rejected', 'Thiếu điểm bị từ chối'], `INSERT INTO Mark (studentID, course) VALUES ('SE190003', 'DBI202')`, '23502'),
      duoc(['The same student may have marks in two courses', 'Một sinh viên được có điểm ở hai môn'], `INSERT INTO Mark VALUES ('SE190001', 'DBI202', 8.5); INSERT INTO Mark VALUES ('SE190001', 'CSD201', 7.0)`),
    ],
    sai: [
      `CREATE TABLE Mark (studentID CHAR(8) NOT NULL, course CHAR(6) NOT NULL, score DECIMAL(3,1) NOT NULL, PRIMARY KEY (studentID, course));`,
      `CREATE TABLE Mark (studentID CHAR(8) NOT NULL PRIMARY KEY, course CHAR(6) NOT NULL, score DECIMAL(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10));`,
      `CREATE TABLE Mark (studentID CHAR(8) NOT NULL, course CHAR(6) NOT NULL, score DECIMAL(3,1) CHECK (score BETWEEN 0 AND 10), PRIMARY KEY (studentID, course));`,
    ],
    gy: [['CHECK (score BETWEEN 0 AND 10) stops 85 and -1.', 'CHECK (score BETWEEN 0 AND 10) chặn 85 và -1.'], ['"Same student, same course" ⇒ the key is the PAIR (studentID, course).', '"Cùng sinh viên, cùng môn" ⇒ khoá là CẶP (studentID, course).']],
    lhg: [['PRIMARY KEY on studentID alone — a student could then have only one mark in the whole school.', 'PRIMARY KEY chỉ trên studentID — khi đó cả trường mỗi sinh viên chỉ có một điểm.'], ['Forgetting NOT NULL on score — CHECK lets NULL through (NULL is UNKNOWN, not FALSE).', 'Quên NOT NULL ở score — CHECK cho NULL lọt qua (NULL là UNKNOWN, không phải FALSE).']],
    gt: ['<p>The rules now protect every program that writes to the table — Excel, a web app, a script. A CHECK rejects a row only when the condition is FALSE, so "required" still needs NOT NULL.</p>', '<p>Luật giờ bảo vệ mọi chương trình ghi vào bảng — Excel, web app, script. CHECK chỉ từ chối khi điều kiện FALSE nên "bắt buộc" vẫn cần NOT NULL.</p>'],
    tn: [TN.check, TN.pk, TN.ddl],
  }),
  cs({
    t: 'What a DBMS gives you (and what it does not)', k: 'EASY', p: 6,
    kn: ['DBMS functions', 'data independence', 'declarative query'], tag: ['theory'],
    en: '<p>Five quick questions on the role of a DBMS (lesson 1.1).</p>',
    vi: '<p>Năm câu nhanh về vai trò của DBMS (bài 1.1).</p>',
    cau: [
      q('c1', ['Which statement about a DBMS is TRUE?', 'Phát biểu nào về DBMS là ĐÚNG?'], ['It is the software that stores, retrieves and protects the data of a database', 'It is another name for the data stored on disk', 'It is the application that end users click on', 'It is a spreadsheet with more rows'], ['Database = the data; DBMS = the software managing it; database system = both together (+ users, apps).', 'Database = dữ liệu; DBMS = phần mềm quản lý; hệ CSDL = cả hai (+ người dùng, ứng dụng).']),
      q('c2', ['SQL is called declarative because…', 'SQL được gọi là ngôn ngữ khai báo vì…'], ['you say WHAT result you want, the DBMS decides HOW to get it', 'every variable must be declared before use', 'it only declares tables, it cannot read data', 'you write the loops that scan the file yourself'], ['The optimizer picks the access path; your query only describes the result.', 'Bộ tối ưu chọn cách truy cập; câu truy vấn chỉ mô tả kết quả.']),
      q('c3', ['A new index is added; every existing program still works unchanged. This is…', 'Thêm một chỉ mục; mọi chương trình cũ vẫn chạy không đổi. Đó là…'], ['physical data independence', 'logical data independence', 'data redundancy', 'referential integrity'], ['Changing storage structures (indexes, files) without touching the logical schema or programs is physical independence.', 'Đổi cấu trúc lưu trữ (chỉ mục, tệp) mà không đổi lược đồ logic hay chương trình là độc lập vật lý.']),
      q('c4', ['Which job is NOT done by the DBMS itself?', 'Việc nào KHÔNG do DBMS làm?'], ['Deciding which business rules the company wants', 'Enforcing a CHECK constraint', 'Recovering committed work after a crash', 'Letting 200 users query at once'], ['People decide the rules (design); the DBMS enforces the rules you declare.', 'Con người quyết luật (thiết kế); DBMS thi hành luật bạn khai báo.']),
      q('c5', ['"Metadata" in a DBMS means…', '"Siêu dữ liệu" trong DBMS nghĩa là…'], ['the description of the data: tables, columns, types, keys', 'deleted rows kept by the server for a later backup', 'the newest version of each row after an UPDATE', 'rows copied to another server for reporting'], ['The catalog (data dictionary) stores the schema; the DBMS reads it to check every query.', 'Catalog (từ điển dữ liệu) lưu lược đồ; DBMS đọc nó để kiểm mọi câu truy vấn.']),
    ],
    gy: [['Database ≠ DBMS ≠ database system.', 'Database ≠ DBMS ≠ hệ CSDL.'], ['Physical independence = storage changes; logical independence = schema changes.', 'Độc lập vật lý = đổi lưu trữ; độc lập logic = đổi lược đồ.']],
    lhg: [['Calling MySQL "a database" — it is a DBMS; the database is what it manages.', 'Gọi MySQL là "một database" — nó là DBMS; database là thứ nó quản lý.'], ['Confusing physical and logical data independence.', 'Nhầm độc lập dữ liệu vật lý với logic.']],
    tn: [tn('DBMS', 'hệ quản trị CSDL'), tn('data independence', 'độc lập dữ liệu')],
  }),
]);
