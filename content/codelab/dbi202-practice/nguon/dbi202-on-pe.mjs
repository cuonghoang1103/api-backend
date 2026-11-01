/**
 * DBI202 · 9.1 Thi thực hành 85 phút — cấu trúc đề PE SP26, luật nộp bài (một lỗi là 0 điểm), chia thời gian, 10 khuôn truy vấn.
 * Đề tĩnh; luyện đề trọn vẹn ở "PE 1 — CT Rent" (gắn bài này) và ba bài chữa đề PE SP26 thật.
 */
import { mod, cs, q, ord, bang1, tn } from './_chung.mjs';

const KQ = ['accepted', '0: contains GO', '0: names the database (USE / CREATE DATABASE)', '0: a test command is left in', 'loses the mark: columns differ from the picture'];

export default mod('dbi202-on-pe', '9.1 The 85-minute Practical Exam: an SQL playbook', [
  cs({
    t: 'Would this answer file score — or get a zero?', k: 'EASY', p: 6, loai: 'table',
    kn: ['PE hand-in rules'], tag: ['pe', 'exam-prep'],
    en: '<p>Each row is the whole content of one submitted file. Decide what the marker does with it (rules printed on every SP26 paper).</p>',
    vi: '<p>Mỗi dòng là toàn bộ nội dung một tệp nộp. Quyết định giám khảo làm gì với nó (luật in trên mọi đề SP26).</p>',
    bang: [bang1('b1', ['File → verdict', 'Tệp → kết quả'],
      [{ ma: 'tep', ten: 'File content / Nội dung tệp' }, { ma: 'kq', ten: 'Verdict', luaChon: KQ }],
      [{ o: { tep: "Q2.sql: SELECT EmployeeID, FirstName, LastName FROM Employees WHERE Salary > 15000;" }, a: { kq: 'accepted' } },
        { o: { tep: 'Q8.sql: CREATE PROCEDURE prX … END  GO' }, a: { kq: '0: contains GO' } },
        { o: { tep: 'Q3.sql: USE PE_DBI202_SP2026; SELECT …' }, a: { kq: '0: names the database (USE / CREATE DATABASE)' } },
        { o: { tep: 'Q8.sql: CREATE PROCEDURE … END; declare @x int exec prX \'UK\', @x output select @x' }, a: { kq: '0: a test command is left in' } },
        { o: { tep: 'Q9.sql: CREATE TRIGGER Tr1 … ; INSERT INTO Employees VALUES (1003, …)' }, a: { kq: '0: a test command is left in' } },
        { o: { tep: 'Q5.sql: SELECT e.FirstName AS Name, e.Salary … (the picture shows FirstName, LastName, Salary)' }, a: { kq: 'loses the mark: columns differ from the picture' } }],
      ['Each file must hold only the statement that answers the question and must run on its own against the DBscript database. Test the procedure/trigger in another window; never leave the test call in Q8/Q9.', 'Mỗi tệp chỉ chứa câu lệnh trả lời câu hỏi và phải tự chạy được trên CSDL của DBscript. Thử procedure/trigger ở cửa sổ khác; không bao giờ để lệnh thử trong Q8/Q9.'])],
    gy: [['No GO, no USE, no database name, no test lines.', 'Không GO, không USE, không tên CSDL, không dòng thử.'], ['Column names and order must match the expected-result picture.', 'Tên và thứ tự cột phải khớp ảnh kết quả mong đợi.']],
    lhg: [['Copy-pasting the whole SSMS window, test call included, into Q8.sql.', 'Chép nguyên cửa sổ SSMS, kể cả lệnh thử, vào Q8.sql.'], ['Renaming a column "to make it nicer".', 'Đổi tên cột "cho đẹp".']],
    tn: [tn('hand-in rules', 'luật nộp bài')],
  }),
  cs({
    t: 'Spend the 85 minutes in the right order', k: 'EASY', p: 4, loai: 'order',
    kn: ['time budget'], tag: ['pe', 'exam-prep'],
    en: '<p>Order the five phases of the recommended time budget.</p>', vi: '<p>Sắp năm giai đoạn của cách chia thời gian khuyến nghị.</p>',
    cau: [ord('o1', ['First → last', 'Đầu → cuối'], ['Run DBscript.sql, read every question and its result picture (0–5 min)', 'Q1: ERD → CREATE TABLE, tested in your own scratch database (5–20)', 'Q2–Q7, easiest first, compared row by row with the pictures (20–55)', 'Q8–Q10, every trial inside BEGIN TRAN … ROLLBACK (55–78)', 'Open every Q file and check the hand-in rules (78–85)'],
      ['The last seven minutes are not optional: most zeros come from a GO or a test line, not from wrong SQL.', 'Bảy phút cuối không phải tuỳ chọn: phần lớn điểm 0 đến từ GO hay dòng thử, không phải SQL sai.'])],
    gy: [['Read all the pictures first: they tell you the columns and the ORDER BY.', 'Đọc mọi ảnh trước: chúng cho biết cột và ORDER BY.'], ['Keep the data clean: BEGIN TRAN … ROLLBACK around every change you test.', 'Giữ dữ liệu sạch: BEGIN TRAN … ROLLBACK quanh mọi thay đổi khi thử.']],
    lhg: [['Testing Q10 for real and then failing Q2–Q7 because the data changed.', 'Chạy thật Q10 rồi trượt Q2–Q7 vì dữ liệu đã đổi.'], ['Spending 40 minutes on Q1.', 'Dành 40 phút cho Q1.']],
  }),
  cs({
    t: 'Which of the ten patterns does the question need?', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['query patterns'], tag: ['pe', 'exam-prep', 'sql'],
    en: '<p>Match each question (wording from real papers) to the pattern that solves it.</p>', vi: '<p>Ghép mỗi câu hỏi (lời lẽ từ đề thật) với khuôn giải nó.</p>',
    bang: [bang1('b1', ['Question → pattern', 'Câu hỏi → khuôn'],
      [{ ma: 'cau', ten: 'Question / Câu hỏi' }, { ma: 'khuon', ten: 'Pattern', luaChon: ['compare with a subquery (HAVING COUNT > (SELECT …))', 'LEFT JOIN … WHERE child.key IS NULL', 'double NOT EXISTS (division)', 'per-group MAX with a correlated subquery', 'date range d >= … AND d < …', 'DELETE/UPDATE with a subquery on the name'] }],
      [{ o: { cau: "Jobs that have more employees than the 'IT_PROG' job" }, a: { khuon: 'compare with a subquery (HAVING COUNT > (SELECT …))' } },
        { o: { cau: 'Customers who have never placed an order' }, a: { khuon: 'LEFT JOIN … WHERE child.key IS NULL' } },
        { o: { cau: 'Regions where every department has at least one employee' }, a: { khuon: 'double NOT EXISTS (division)' } },
        { o: { cau: 'Employees earning the maximum salary of their department' }, a: { khuon: 'per-group MAX with a correlated subquery' } },
        { o: { cau: 'Orders placed in 2026' }, a: { khuon: 'date range d >= … AND d < …' } },
        { o: { cau: "Delete the employees of the 'IT' department" }, a: { khuon: 'DELETE/UPDATE with a subquery on the name' } }],
      ['Recognising the pattern is half the mark: "more than X" ⇒ subquery, "never/none" ⇒ anti-join, "every/all" ⇒ division, "the highest per …" ⇒ correlated MAX (ties kept).', 'Nhận ra khuôn là nửa số điểm: "nhiều hơn X" ⇒ truy vấn con, "chưa từng/không có" ⇒ anti-join, "mọi/tất cả" ⇒ phép chia, "cao nhất mỗi …" ⇒ MAX tương quan (giữ hoà).'])],
    gy: [['Underline the quantifier in the question: more than / never / every / highest.', 'Gạch dưới lượng từ trong câu hỏi: nhiều hơn / chưa từng / mọi / cao nhất.'], ['Find the department by its NAME, never by a typed id.', 'Tìm phòng theo TÊN, không gõ cứng mã.']],
    lhg: [['Typing the number of IT_PROG employees instead of a subquery.', 'Gõ cứng số nhân viên IT_PROG thay vì truy vấn con.'], ['Using YEAR(d) = 2026 — correct, but it cannot use an index.', 'Dùng YEAR(d) = 2026 — đúng, nhưng không dùng được chỉ mục.']],
    tn: [tn('query pattern', 'khuôn truy vấn')],
  }),
  cs({
    t: 'PE details that cost marks after the SQL is already right', k: 'MEDIUM', p: 6,
    kn: ['PE structure', 'N prefix', 'ORDER BY from the picture'], tag: ['pe', 'exam-prep'],
    en: '<p>Five questions on the structure and the small traps of the paper.</p>', vi: '<p>Năm câu về cấu trúc đề và các bẫy nhỏ.</p>',
    cau: [
      q('c1', ['Q1 of an SP26 paper is worth…', 'Q1 của đề SP26 được…'], ['1.5 marks: the ERD turned into CREATE TABLE statements', '0.5 marks: the easiest single-table query', '1 mark: a stored procedure with OUTPUT', '2 marks: the whole database script'], ['Q1 1.5, Q2 0.5, Q3–Q10 1 each = 10.', 'Q1 1,5; Q2 0,5; Q3–Q10 mỗi câu 1 = 10.']),
      q('c2', ['The expected-result picture shows rows sorted by salary, high to low. Your query has no ORDER BY. Result?', 'Ảnh kết quả mong đợi sắp theo lương giảm dần. Câu của bạn không có ORDER BY. Kết quả?'], ['you can lose the mark: the order is part of the expected result', 'nothing: the marker only compares the set of rows', 'the database sorts by the primary key, which is the same', 'SQL Server sorts by the last column automatically'], ['When the picture is sorted, write the ORDER BY it implies.', 'Ảnh đã sắp thì viết ORDER BY mà ảnh ngụ ý.']),
      q('c3', ["An UPDATE stores 'Nguyễn Thị Hoà' but the table shows 'Nguy?n Th? Hoà'. The fix is…", "Một lệnh UPDATE lưu 'Nguyễn Thị Hoà' nhưng bảng hiện 'Nguy?n Th? Hoà'. Cách sửa là…"], ["write the literal as N'Nguyễn Thị Hoà'", 'change the column to VARCHAR(MAX)', 'run the script twice', 'set the database to READ_COMMITTED_SNAPSHOT'], ['Without N the literal is converted to the code page first; the letters outside it become ?.', 'Không có N thì chuỗi bị đổi sang code page trước; chữ ngoài code page thành ?.']),
      q('c4', ['How do you test Q10 (a DELETE) without destroying the data for Q2–Q7?', 'Thử Q10 (một DELETE) thế nào để không phá dữ liệu của Q2–Q7?'], ['BEGIN TRAN; DELETE …; SELECT to check; ROLLBACK', 'run it, then delete the database and recreate it by hand', 'run it on Q2–Q7 results only', 'comment it out and hope it works'], ['And if the data did break: simply re-run DBscript.sql.', 'Nếu dữ liệu đã hỏng: chạy lại DBscript.sql là xong.']),
      q('c5', ['Which of these is allowed during the PE?', 'Điều nào được phép trong giờ thi PE?'], ['SQL Server, SSMS and offline documents', 'an AI assistant in the browser', 'a shared Google Doc with classmates', 'running DBscript.sql on an online sandbox'], ['Only the local tools; everything else is cheating.', 'Chỉ công cụ trên máy; mọi thứ khác là gian lận.']),
    ],
    gy: [['Read the picture: columns, names, order, row count.', 'Đọc ảnh: cột, tên, thứ tự, số dòng.'], ['Vietnamese literals need N on SQL Server.', 'Chuỗi tiếng Việt cần N trên SQL Server.']],
    lhg: [['Forgetting ORDER BY when the picture is sorted.', 'Quên ORDER BY khi ảnh đã sắp.'], ['Testing data changes outside a transaction.', 'Thử thay đổi dữ liệu ngoài giao dịch.']],
    tn: [tn('expected result', 'kết quả mong đợi')],
  }),
]);
