/**
 * DBI202 · 1.2 Thực hành Chương 1 (CQ1.1–CQ1.3) — CSDL / DBMS / hệ CSDL, các giai đoạn lịch sử, DDL hay DML,
 * ba mức + độc lập dữ liệu, dữ liệu → thông tin (GROUP BY trên bảng Mark).
 */
import { mod, de, cs, q, ord, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';

const MARK = String.raw`
CREATE TABLE Mark (
  studentID CHAR(8)      NOT NULL,
  course    CHAR(6)      NOT NULL,
  score     DECIMAL(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10),
  CONSTRAINT pk_mark PRIMARY KEY (studentID, course)
);
INSERT INTO Mark VALUES
  ('SE190001', 'DBI202', 8.5), ('SE190002', 'DBI202', 4.0), ('SE190003', 'DBI202', 6.5), ('SE190004', 'DBI202', 3.5),
  ('SE190001', 'CSD201', 7.5), ('SE190002', 'CSD201', 8.5);
`;

export default mod('dbi202-on-ch1', '1.2 Practice: databases & DBMS (CQ1.1–CQ1.3)', [
  cs({
    t: 'Database, DBMS, database system — or none?', k: 'EASY', p: 6, loai: 'table',
    kn: ['database', 'DBMS', 'database system', 'metadata'], tag: ['theory', 'cq1-2'],
    en: '<p>CQ1.2: classify each item (practice lesson, exercise 3).</p>',
    vi: '<p>CQ1.2: phân loại từng mục (bài thực hành, bài 3).</p>',
    bang: [bang1('b1', ['Classify', 'Phân loại'],
      [{ ma: 'muc', ten: 'Item / Mục' }, { ma: 'loai', ten: 'Answer / Đáp án', luaChon: ['DBMS', 'database', 'database system', 'metadata', 'none of them'] }],
      [{ o: { muc: 'Microsoft SQL Server' }, a: { loai: 'DBMS' } },
        { o: { muc: 'the rows of all FPTU students\' marks' }, a: { loai: 'database' } },
        { o: { muc: 'FAP = its application + SQL Server + the marks' }, a: { loai: 'database system' } },
        { o: { muc: 'PostgreSQL' }, a: { loai: 'DBMS' } },
        { o: { muc: 'an Excel workbook of expenses' }, a: { loai: 'none of them' } },
        { o: { muc: 'the table definitions of FAP (names, columns, types)' }, a: { loai: 'metadata' } },
        { o: { muc: 'the file FUHCompany.mdf on disk' }, a: { loai: 'database' } }],
      ['SQL Server and PostgreSQL are DBMSs (software); the data and its file are the database; DBMS + data + apps is a database system; table definitions are metadata; a spreadsheet is none of them.', 'SQL Server, PostgreSQL là DBMS (phần mềm); dữ liệu và tệp chứa nó là database; DBMS + dữ liệu + ứng dụng là hệ CSDL; định nghĩa bảng là siêu dữ liệu; bảng tính không thuộc loại nào.'])],
    gy: [['Software ⇒ DBMS; data ⇒ database; everything together ⇒ database system.', 'Phần mềm ⇒ DBMS; dữ liệu ⇒ database; tất cả gộp lại ⇒ hệ CSDL.'], ['Excel is not a DBMS: no constraints, no transactions, no query optimizer.', 'Excel không phải DBMS: không ràng buộc, không giao dịch, không bộ tối ưu.']],
    lhg: [['"SQL Server is a database" — the everyday phrase and the FE trap.', '"SQL Server là một database" — cách nói hằng ngày và cái bẫy của FE.'], ['Calling table definitions "data" — they are data about data (metadata).', 'Gọi định nghĩa bảng là "dữ liệu" — đó là dữ liệu về dữ liệu (siêu dữ liệu).']],
    tn: [tn('database system', 'hệ cơ sở dữ liệu')],
  }),
  cs({
    t: 'DDL or DML? Eight statements', k: 'EASY', p: 5, loai: 'table',
    kn: ['DDL', 'DML', 'TRUNCATE'], tag: ['theory', 'sql'],
    en: '<p>Classify each statement on the table <code>Club</code> (exercise 7 — a classic progress-test question).</p>',
    vi: '<p>Phân loại từng câu lệnh trên bảng <code>Club</code> (bài 7 — câu progress test kinh điển).</p>',
    bang: [bang1('b1', ['DDL or DML', 'DDL hay DML'],
      [{ ma: 'cau', ten: 'Statement / Câu lệnh' }, { ma: 'loai', ten: 'Class / Loại', luaChon: ['DDL', 'DML'] }],
      [{ o: { cau: 'CREATE TABLE Club (clubID INT PRIMARY KEY, name NVARCHAR(40))' }, a: { loai: 'DDL' } },
        { o: { cau: 'ALTER TABLE Club ADD founded INT' }, a: { loai: 'DDL' } },
        { o: { cau: "INSERT INTO Club VALUES (1, N'CLB Guitar', 2015)" }, a: { loai: 'DML' } },
        { o: { cau: 'UPDATE Club SET founded = 2016 WHERE clubID = 1' }, a: { loai: 'DML' } },
        { o: { cau: 'SELECT name, founded FROM Club' }, a: { loai: 'DML' } },
        { o: { cau: 'DELETE FROM Club WHERE clubID = 2' }, a: { loai: 'DML' } },
        { o: { cau: 'TRUNCATE TABLE Club' }, a: { loai: 'DDL' } },
        { o: { cau: 'DROP TABLE Club' }, a: { loai: 'DDL' } }],
      ['DDL changes structure (CREATE, ALTER, DROP — and TRUNCATE in SQL Server, which deallocates pages and cannot have WHERE); DML reads or changes rows (SELECT, INSERT, UPDATE, DELETE).', 'DDL đổi cấu trúc (CREATE, ALTER, DROP — và TRUNCATE trong SQL Server, vì nó giải phóng trang và không có WHERE); DML đọc hoặc đổi dòng (SELECT, INSERT, UPDATE, DELETE).'])],
    gy: [['Ask: does it change the table\'s structure, or the rows inside?', 'Hỏi: nó đổi cấu trúc bảng, hay đổi các dòng bên trong?'], ['TRUNCATE empties the table like DELETE but SQL Server files it under DDL.', 'TRUNCATE làm rỗng bảng như DELETE nhưng SQL Server xếp nó vào DDL.']],
    lhg: [['Calling TRUNCATE DML because "it removes rows".', 'Gọi TRUNCATE là DML vì "nó xoá dòng".'], ['Calling SELECT "not DML" — it is the query part of DML.', 'Cho rằng SELECT "không phải DML" — nó là phần truy vấn của DML.']],
  }),
  cs({
    t: 'The stages of database history, in order', k: 'EASY', p: 5, loai: 'order',
    kn: ['data models', 'history'], tag: ['theory', 'cq1-1'],
    en: '<p>CQ1.1: put the stages the database has gone through in chronological order (exercise 2).</p>',
    vi: '<p>CQ1.1: sắp các giai đoạn phát triển của CSDL theo thời gian (bài 2).</p>',
    cau: [ord('o1', ['From the oldest to the newest', 'Từ cũ nhất tới mới nhất'],
      ['File systems — each program owns its files', 'Hierarchical model — trees (IBM IMS)', 'Network model — graphs and pointers (CODASYL)', 'Relational model — tables and SQL (System R, Oracle)', 'Object-relational — complex types inside tables', 'NoSQL / NewSQL — scale-out documents, key-value; SQL on many machines'],
      ['Files → trees → graphs → tables → objects → NoSQL/NewSQL: each stage fixed the pain of the previous one (duplication, pointer programs, rigidity, scale).', 'Tệp → cây → đồ thị → bảng → đối tượng → NoSQL/NewSQL: mỗi giai đoạn chữa nỗi khổ của giai đoạn trước (trùng lặp, lập trình con trỏ, cứng nhắc, quy mô).'])],
    gy: [['Hierarchical (one parent) came before network (many parents).', 'Phân cấp (một cha) có trước mạng (nhiều cha).'], ['Relational = 1970s (Codd 1970, System R); NoSQL = 2000s.', 'Quan hệ = thập niên 1970 (Codd 1970, System R); NoSQL = thập niên 2000.']],
    lhg: [['Putting the network model before the hierarchical one.', 'Đặt mô hình mạng trước mô hình phân cấp.'], ['Thinking NoSQL replaced relational — both are used today.', 'Tưởng NoSQL thay thế quan hệ — ngày nay cả hai đều dùng.']],
  }),
  cs({
    t: 'Three levels, data independence and who does what', k: 'MEDIUM', p: 7,
    kn: ['three-schema architecture', 'data independence', 'DBA'], tag: ['theory', 'cq1-3'],
    en: '<p>CQ1.3 / CQ8.2: the ANSI/SPARC three levels (external, conceptual, internal) and the people around a database (exercises 6 and 8).</p>',
    vi: '<p>CQ1.3 / CQ8.2: ba mức ANSI/SPARC (ngoài, khái niệm, trong) và những người làm việc với CSDL (bài 6 và 8).</p>',
    cau: [
      q('c1', ['A view PhoneBook shows only (fullName, dept) of Employee to receptionists. Which level is it?', 'View PhoneBook chỉ cho lễ tân thấy (fullName, dept) của Employee. Đó là mức nào?'], ['External level', 'Conceptual level', 'Internal level', 'Physical file level'], ['Each user group\'s own window on the data is an external schema; views implement it.', 'Cửa sổ riêng của mỗi nhóm người dùng là lược đồ ngoài; view hiện thực nó.']),
      q('c2', ['The DBA moves the data file to a faster SSD and rebuilds an index; no query changes. This shows…', 'DBA chuyển tệp dữ liệu sang SSD nhanh hơn và dựng lại chỉ mục; không câu truy vấn nào phải sửa. Đây là…'], ['physical data independence', 'logical data independence', 'referential integrity', 'a lost update'], ['Internal (storage) changes hidden from the conceptual level = physical independence.', 'Thay đổi mức trong (lưu trữ) được che khỏi mức khái niệm = độc lập vật lý.']),
      q('c3', ['A column is added to Employee; the PhoneBook view and the programs using it keep working. This shows…', 'Thêm một cột vào Employee; view PhoneBook và chương trình dùng nó vẫn chạy. Đây là…'], ['logical data independence', 'physical data independence', 'data redundancy', 'atomicity'], ['A conceptual-schema change hidden from the external level = logical independence (harder to get than physical).', 'Thay đổi lược đồ khái niệm được che khỏi mức ngoài = độc lập logic (khó đạt hơn độc lập vật lý).']),
      q('c4', ['"Back up the database every night and grant accounts to new staff" is the job of…', '"Sao lưu CSDL mỗi đêm và cấp tài khoản cho nhân viên mới" là việc của…'], ['the database administrator (DBA)', 'the database designer', 'the end user', 'the DBMS vendor'], ['Operations and security are the DBA\'s; deciding tables and keys is the designer\'s; typing marks is the end user\'s.', 'Vận hành và bảo mật là việc của DBA; quyết bảng và khoá là của người thiết kế; nhập điểm là của người dùng cuối.']),
      q('c5', ['"Enroll\'s key must include the semester" is decided by…', '"Khoá của Enroll phải có học kỳ" do ai quyết?'], ['the database designer', 'the DBA', 'the end user', 'the query optimizer'], ['Choosing keys is schema design (conceptual level).', 'Chọn khoá là thiết kế lược đồ (mức khái niệm).']),
    ],
    gy: [['External = per user view; conceptual = all tables/keys; internal = files, pages, indexes.', 'Ngoài = góc nhìn từng người dùng; khái niệm = mọi bảng/khoá; trong = tệp, trang, chỉ mục.'], ['Physical independence protects the conceptual level from storage changes; logical independence protects the external level from schema changes.', 'Độc lập vật lý che mức khái niệm khỏi đổi lưu trữ; độc lập logic che mức ngoài khỏi đổi lược đồ.']],
    lhg: [['Calling an index change "logical" independence.', 'Gọi việc đổi chỉ mục là độc lập "logic".'], ['Thinking the DBA designs the tables — usually a separate role.', 'Tưởng DBA thiết kế bảng — thường là vai trò khác.']],
    tn: [tn('external / conceptual / internal level', 'mức ngoài / khái niệm / trong'), tn('DBA', 'người quản trị CSDL')],
  }),
  de({
    csdl: MARK, tenCsdl: 'Mark', ld: { en: '<p><b>Table</b> (tab <code>Mark.sql</code>): <code>Mark(studentID, course, score)</code> — 6 rows, key (studentID, course).</p>', vi: '<p><b>Bảng</b> (tab <code>Mark.sql</code>): <code>Mark(studentID, course, score)</code> — 6 dòng, khoá (studentID, course).</p>' },
    t: 'From data to information: a report per course', k: 'MEDIUM', p: 10,
    kn: ['GROUP BY', 'COUNT', 'AVG', 'conditional SUM'], tag: ['group-by', 'information'],
    en: '<p>Exercise 8: six rows of marks are <i>data</i>. Turn them into <i>information</i> the head of department can act on: for each course, the number of students, the average score and how many failed (score &lt; 5).</p>',
    vi: '<p>Bài 8: sáu dòng điểm là <i>dữ liệu</i>. Biến chúng thành <i>thông tin</i> trưởng bộ môn dùng được: với mỗi môn, số sinh viên, điểm trung bình và số người trượt (điểm &lt; 5).</p>',
    yc: [['Columns: <code>course, students, avgScore, failed</code>.', 'Cột: <code>course, students, avgScore, failed</code>.'], ['One row per course; row order does not matter.', 'Mỗi môn một dòng; thứ tự dòng không quan trọng.']],
    giai: `SELECT course,
       COUNT(*)                                   AS students,
       AVG(score)                                 AS avgScore,
       SUM(CASE WHEN score < 5 THEN 1 ELSE 0 END) AS failed     -- count only the rows that match
FROM Mark
GROUP BY course;`,
    kiem: [kq(['One summary row per course', 'Mỗi môn một dòng tổng hợp'], { saiSo: 0.001 }), kqAn(['A new course and more marks', 'Thêm một môn và vài điểm'], `INSERT INTO Mark VALUES ('SE190005', 'DBI202', 9.0), ('SE190003', 'MAE101', 4.5), ('SE190004', 'MAE101', 2.0)`, { saiSo: 0.001 }), ma(['Uses GROUP BY', 'Dùng GROUP BY'], '\\bGROUP\\s+BY\\b')],
    sai: [`SELECT course, COUNT(*) AS students, AVG(score) AS avgScore, COUNT(score) AS failed FROM Mark GROUP BY course`, `SELECT course, COUNT(*) AS students, AVG(score) AS avgScore, SUM(CASE WHEN score < 5 THEN 1 ELSE 0 END) AS failed FROM Mark WHERE score >= 5 GROUP BY course`],
    gy: [['GROUP BY course gives one row per course; COUNT and AVG work inside each group.', 'GROUP BY course cho mỗi môn một dòng; COUNT và AVG tính trong từng nhóm.'], ['Count failures with SUM(CASE WHEN score &lt; 5 THEN 1 ELSE 0 END).', 'Đếm số trượt bằng SUM(CASE WHEN score &lt; 5 THEN 1 ELSE 0 END).']],
    lhg: [['COUNT(score) for failed — that counts every mark, not the failing ones.', 'COUNT(score) cho số trượt — đếm mọi điểm chứ không chỉ điểm trượt.'], ['Filtering WHERE score &gt;= 5 first — then nobody fails and the averages change.', 'Lọc WHERE score &gt;= 5 trước — khi đó không ai trượt và trung bình bị đổi.']],
    gt: ['<p>Data are raw facts; information is data processed for a decision. "DBI202: 4 students, average 5.625, 2 failed" tells the department where to open a revision class.</p>', '<p>Dữ liệu là sự kiện thô; thông tin là dữ liệu đã xử lý để ra quyết định. "DBI202: 4 sinh viên, trung bình 5.625, 2 trượt" cho bộ môn biết nên mở lớp ôn ở đâu.</p>'],
    tn: [TN.groupBy, TN.aggregate],
  }),
]);
