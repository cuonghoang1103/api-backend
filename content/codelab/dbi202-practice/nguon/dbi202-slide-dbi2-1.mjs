/**
 * DBI202 · 1.A Slide trường Chương 1 — thế giới các hệ CSDL (BOOK của slide 10, thành phần DBMS, DDL/DML).
 */
import { mod, de, cs, q, ord, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';

const BOOK = String.raw`
CREATE TABLE BOOK (
  Title     VARCHAR(50) NOT NULL,
  Author    VARCHAR(30) NULL,
  Publisher VARCHAR(30) NULL,
  Year      VARCHAR(4)  NULL,
  CONSTRAINT pk_book PRIMARY KEY (Title)
);
INSERT INTO BOOK VALUES
  ('Intro to DB Systems',   'Date',     'Addison-Wesley', '1986'),
  ('London Fields',         'Amis',     'Penguin',        '1989'),
  ('100 years of solitude', 'Marquez',  'Picador',        '1982'),
  ('The history man',       'Bradbury', 'Arrow Books',    '1977');
`;
const LD = {
  en: '<p><b>Table</b> (slide 10, tab <code>Book.sql</code>): <code>BOOK(Title PK, Author, Publisher, Year)</code> — 4 books; <code>Year</code> is stored as text, as on the slide.</p>',
  vi: '<p><b>Bảng</b> (slide 10, tab <code>Book.sql</code>): <code>BOOK(Title PK, Author, Publisher, Year)</code> — 4 cuốn; <code>Year</code> lưu dạng chuỗi như trên slide.</p>',
};
const B = { csdl: BOOK, tenCsdl: 'Book', ld: LD };
const THEM = `INSERT INTO BOOK VALUES ('Database Design', 'Hoffer', 'Pearson', '1989'), ('Data and Reality', 'Kent', 'North-Holland', '1978')`;

export default mod('dbi202-slide-dbi2-1', '1.A The worlds of database systems (slides 1–21)', [
  de({
    ...B, t: 'Slide 10: books published in 1989', k: 'EASY', p: 5,
    kn: ['SELECT', 'WHERE'], tag: ['select', 'slide'],
    en: '<p>Slide 10 asks: <i>which books (title and author) were published in 1989?</i> Write that query on the BOOK table.</p>',
    vi: '<p>Slide 10 hỏi: <i>những cuốn sách nào (tên và tác giả) xuất bản năm 1989?</i> Viết truy vấn đó trên bảng BOOK.</p>',
    yc: [['Columns: <code>Title, Author</code>.', 'Cột: <code>Title, Author</code>.'], ['Year is text: compare with <code>\'1989\'</code>.', 'Year là chuỗi: so với <code>\'1989\'</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT Title, Author
FROM BOOK
WHERE Year = '1989';     -- the DBMS finds the rows; you only say WHAT you want`,
    kiem: [kq(['Books of 1989', 'Sách năm 1989']), kqAn(['Two more books, one from 1989', 'Thêm hai cuốn, một cuốn năm 1989'], THEM), ma(['Filters with WHERE', 'Lọc bằng WHERE'], '\\bWHERE\\b')],
    sai: [`SELECT Title, Author FROM BOOK`, `SELECT Title FROM BOOK WHERE Year = '1989'`],
    gy: [['SELECT the two columns FROM BOOK, keep rows WHERE Year = \'1989\'.', 'SELECT hai cột FROM BOOK, giữ dòng WHERE Year = \'1989\'.'], ['Year is VARCHAR(4) here, so put the value in quotes.', 'Year ở đây là VARCHAR(4) nên đặt giá trị trong nháy.']],
    lhg: [['Forgetting the WHERE — every book is returned.', 'Quên WHERE — trả mọi cuốn sách.'], ['Returning only Title — the question asks for the author too.', 'Chỉ trả Title — đề hỏi cả tác giả.']],
    gt: ['<p>This is the point of slide 10: a query language is <b>declarative</b> — you describe the result, the DBMS decides how to find it.</p>', '<p>Đây là ý của slide 10: ngôn ngữ truy vấn là <b>khai báo</b> — bạn mô tả kết quả, DBMS tự quyết cách tìm.</p>'],
    tn: [TN.select, TN.where],
  }),
  de({
    ...B, t: 'Slide 10: the yellow, pink and grey rows', k: 'MEDIUM', p: 8,
    kn: ['INSERT', 'UPDATE', 'DELETE'], tag: ['dml', 'slide'],
    en: `<p>Apply the three changes coloured on slide 10, in this order:</p><ol><li><b>Yellow</b> — add <i>Fund. of DB Systems</i> by Elmasri, Addison-Wesley, 1989.</li><li><b>Pink</b> — remove <i>London Fields</i>.</li><li><b>Grey</b> — <i>The history man</i> was actually published in 1975.</li></ol>`,
    vi: `<p>Thực hiện ba thay đổi tô màu trên slide 10, theo thứ tự:</p><ol><li><b>Vàng</b> — thêm <i>Fund. of DB Systems</i> của Elmasri, Addison-Wesley, 1989.</li><li><b>Hồng</b> — xoá <i>London Fields</i>.</li><li><b>Xám</b> — <i>The history man</i> thật ra xuất bản năm 1975.</li></ol>`,
    yc: [['Three statements: INSERT, DELETE, UPDATE.', 'Ba câu: INSERT, DELETE, UPDATE.'], ['Each DELETE/UPDATE touches exactly one book (filter by the key, Title).', 'Mỗi câu DELETE/UPDATE chỉ đụng đúng một cuốn (lọc theo khoá Title).']],
    giai: `INSERT INTO BOOK (Title, Author, Publisher, Year)
VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989');   -- yellow
DELETE FROM BOOK WHERE Title = 'London Fields';                       -- pink
UPDATE BOOK SET Year = '1975' WHERE Title = 'The history man';        -- grey`,
    kiem: [
      sau(['The BOOK table after the three changes', 'Bảng BOOK sau ba thay đổi'], `SELECT Title, Author, Publisher, Year FROM BOOK`),
      sau(['Hidden: other books are untouched', 'Ẩn: các cuốn khác không bị đụng'], `SELECT Title, Year FROM BOOK`, { an: true, themCsdl: THEM }),
      ma(['Uses INSERT, DELETE and UPDATE', 'Dùng INSERT, DELETE và UPDATE'], '\\bINSERT\\b[\\s\\S]*\\bDELETE\\b[\\s\\S]*\\bUPDATE\\b|\\bINSERT\\b[\\s\\S]*\\bUPDATE\\b[\\s\\S]*\\bDELETE\\b'),
    ],
    sai: [
      `INSERT INTO BOOK VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989'); DELETE FROM BOOK WHERE Year = '1989'; UPDATE BOOK SET Year = '1975' WHERE Title = 'The history man';`,
      `INSERT INTO BOOK VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989'); DELETE FROM BOOK WHERE Title = 'London Fields'; UPDATE BOOK SET Year = '1975';`,
    ],
    gy: [['Identify each row by its key (Title), not by a value many rows share.', 'Xác định từng dòng bằng khoá (Title), không bằng giá trị nhiều dòng cùng có.'], ['UPDATE BOOK SET Year = \'1975\' WHERE Title = \'The history man\';', 'UPDATE BOOK SET Year = \'1975\' WHERE Title = \'The history man\';']],
    lhg: [['DELETE … WHERE Year = \'1989\' — also deletes the book you just inserted.', 'DELETE … WHERE Year = \'1989\' — xoá luôn cuốn vừa thêm.'], ['UPDATE without WHERE — every book becomes 1975.', 'UPDATE không WHERE — mọi cuốn thành năm 1975.']],
    gt: ['<p>INSERT adds a row, DELETE removes rows that match the WHERE, UPDATE changes values in rows that match the WHERE. Filtering by the primary key guarantees exactly one row is touched.</p>', '<p>INSERT thêm dòng, DELETE xoá các dòng khớp WHERE, UPDATE sửa giá trị các dòng khớp WHERE. Lọc theo khoá chính bảo đảm chỉ đúng một dòng bị đụng.</p>'],
    tn: [TN.dml, TN.pk],
  }),
  cs({
    t: 'Inside a DBMS: who does what?', k: 'EASY', p: 7,
    kn: ['DBMS architecture', 'query processor', 'storage manager', 'transaction manager'], tag: ['theory', 'slide'],
    en: '<p>The deck draws a DBMS as a few cooperating parts (query processor, storage manager, transaction manager, the data and metadata on disk). Match each job to the part that does it.</p>',
    vi: '<p>Bộ slide vẽ DBMS là vài bộ phận phối hợp (bộ xử lý truy vấn, bộ quản lý lưu trữ, bộ quản lý giao dịch, dữ liệu và siêu dữ liệu trên đĩa). Ghép mỗi việc với bộ phận làm việc đó.</p>',
    cau: [
      q('c1', ['Turns a SELECT into an efficient plan (which index, which join order).', 'Biến câu SELECT thành kế hoạch chạy hiệu quả (dùng chỉ mục nào, nối theo thứ tự nào).'], ['Query processor', 'Storage manager', 'Transaction manager', 'Buffer of the operating system'], ['Parsing and optimising queries is the query processor (compiler + optimizer).', 'Phân tích và tối ưu truy vấn là việc của bộ xử lý truy vấn (compiler + optimizer).']),
      q('c2', ['Moves 8 KB pages between disk and memory and keeps track of free space.', 'Chuyển các trang 8 KB giữa đĩa và bộ nhớ, theo dõi chỗ trống.'], ['Storage manager', 'Query processor', 'Transaction manager', 'Application program'], ['The storage (and buffer) manager owns files, pages and the buffer pool.', 'Bộ quản lý lưu trữ (và bộ đệm) nắm tệp, trang và vùng đệm.']),
      q('c3', ['Two clerks update the same account at the same time; nobody\'s change may be lost.', 'Hai nhân viên cùng sửa một tài khoản cùng lúc; không ai được mất thay đổi.'], ['Transaction manager (concurrency control)', 'Query processor (plan optimizer)', 'Storage manager (buffer pool)', 'DDL compiler (schema checker)'], ['Isolation between concurrent users is concurrency control, part of transaction management (Chapter 8).', 'Cách ly giữa người dùng đồng thời là kiểm soát tương tranh, thuộc quản lý giao dịch (Chương 8).']),
      q('c4', ['After a power cut, committed transfers must still be there and half-done ones must vanish.', 'Sau khi mất điện, các lần chuyển tiền đã commit phải còn, lần làm dở phải biến mất.'], ['Transaction manager (logging and recovery)', 'Query processor (parser and optimizer)', 'Index structure (B+ tree on disk)', 'View definition (stored SELECT)'], ['Durability and atomicity are guaranteed by the log and the recovery manager.', 'Tính bền và nguyên tử do nhật ký (log) và bộ phục hồi bảo đảm.']),
      q('c5', ['"Table Lop has columns maLop, tenLop; maLop is the key" — where is this stored?', '"Bảng Lop có cột maLop, tenLop; maLop là khoá" — điều này được lưu ở đâu?'], ['In the metadata (system catalog)', 'In every data row', 'In the application code only', 'Nowhere: it is in the DBA\'s head'], ['Schema information is data about data: metadata, kept by the DBMS in its catalog (sys.tables, sys.columns…).', 'Thông tin lược đồ là dữ liệu về dữ liệu: siêu dữ liệu, DBMS giữ trong catalog (sys.tables, sys.columns…).']),
      q('c6', ['CREATE TABLE, ALTER TABLE, DROP TABLE belong to…', 'CREATE TABLE, ALTER TABLE, DROP TABLE thuộc…'], ['DDL — they change the schema', 'DML — they change the data', 'DCL — they change permissions', 'TCL — they end transactions'], ['DDL defines structure; DML (SELECT/INSERT/UPDATE/DELETE) works on the rows inside it.', 'DDL định nghĩa cấu trúc; DML (SELECT/INSERT/UPDATE/DELETE) làm việc với dòng bên trong.']),
    ],
    gy: [['Query processor = "what plan?"; storage manager = "which pages?"; transaction manager = "who goes first, what if it crashes?".', 'Bộ xử lý truy vấn = "kế hoạch nào?"; bộ quản lý lưu trữ = "trang nào?"; bộ quản lý giao dịch = "ai trước, sập thì sao?".'], ['Metadata = the description of the tables, stored by the DBMS itself.', 'Siêu dữ liệu = mô tả các bảng, do chính DBMS lưu.']],
    lhg: [['Thinking the application program enforces concurrency — it is the DBMS\'s job.', 'Tưởng chương trình ứng dụng lo tương tranh — đó là việc của DBMS.'], ['Mixing DDL and DML: CREATE is DDL even though it "creates data structures".', 'Nhầm DDL và DML: CREATE là DDL dù nó "tạo cấu trúc".']],
    tn: [tn('metadata', 'siêu dữ liệu', 'Dữ liệu mô tả dữ liệu: tên bảng, cột, kiểu, khoá…'), tn('query processor', 'bộ xử lý truy vấn'), tn('transaction manager', 'bộ quản lý giao dịch')],
  }),
  cs({
    t: 'The journey of one query through the DBMS', k: 'MEDIUM', p: 6, loai: 'order',
    kn: ['query processing'], tag: ['theory', 'slide'],
    en: '<p>Put the steps in the order they happen when you press F5 on <code>SELECT Title FROM BOOK WHERE Year = \'1989\'</code>.</p>',
    vi: '<p>Sắp các bước theo đúng thứ tự xảy ra khi bạn bấm F5 câu <code>SELECT Title FROM BOOK WHERE Year = \'1989\'</code>.</p>',
    cau: [
      ord('o1', ['From the keyboard to the result grid', 'Từ bàn phím tới lưới kết quả'],
        ['The client sends the SQL text to the server', 'The parser checks the syntax and the names (using the catalog)', 'The optimizer chooses an execution plan', 'The execution engine asks the storage manager for the pages it needs', 'Pages are read from disk into the buffer pool if not already there', 'Matching rows are sent back to the client'],
        ['Text → parse/bind (catalog) → optimize → execute → pages through the buffer pool → result rows.', 'Chuỗi SQL → phân tích/ràng tên (catalog) → tối ưu → thực thi → trang qua vùng đệm → trả dòng kết quả.']),
    ],
    gy: [['The plan must exist before anything is read.', 'Phải có kế hoạch rồi mới đọc dữ liệu.'], ['The disk is touched only when the page is not already in memory.', 'Chỉ đụng đĩa khi trang chưa có sẵn trong bộ nhớ.']],
    lhg: [['Putting "read from disk" before the optimizer — the optimizer decides WHAT to read.', 'Đặt "đọc đĩa" trước bộ tối ưu — bộ tối ưu quyết định đọc CÁI GÌ.'], ['Forgetting that names are checked against the catalog before planning.', 'Quên rằng tên được kiểm với catalog trước khi lập kế hoạch.']],
  }),
]);
