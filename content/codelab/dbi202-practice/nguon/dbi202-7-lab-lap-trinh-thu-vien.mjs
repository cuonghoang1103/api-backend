/**
 * DBI202 · Chương 7 — LAB 7: lập trình CSDL thư viện CT Library (lược đồ Lab 5) như các câu cuối đề PE — procedure OUTPUT,
 * hàm vô hướng, hàm trả bảng, trigger tồn kho nhiều dòng, procedure trả sách có giao dịch. Chạy trên SQL Server của người
 * học (T-SQL lập trình) với check.sql chấm từng câu.
 */
import { doiDau, KHOA, tsql, ck, tuChoi, giongNhau, tn } from './_chung.mjs';

const LIB = `CREATE TABLE Publisher (PublisherID INT NOT NULL PRIMARY KEY, Name NVARCHAR(100) NOT NULL UNIQUE, Country NVARCHAR(50) NULL);
CREATE TABLE Book (
    ISBN        CHAR(13)      NOT NULL PRIMARY KEY,
    Title       NVARCHAR(200) NOT NULL,
    PublisherID INT           NOT NULL REFERENCES Publisher (PublisherID),
    PubYear     INT           NULL,
    Price       DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Stock       INT           NOT NULL DEFAULT 1 CHECK (Stock >= 0)
);
CREATE TABLE Member (MemberID INT NOT NULL PRIMARY KEY, FullName NVARCHAR(60) NOT NULL, JoinDate DATE NOT NULL);
CREATE TABLE Loan (
    LoanID     INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ISBN       CHAR(13) NOT NULL REFERENCES Book (ISBN),
    MemberID   INT      NOT NULL REFERENCES Member (MemberID),
    LoanDate   DATE     NOT NULL,
    DueDate    DATE     NOT NULL,
    ReturnDate DATE     NULL,
    CONSTRAINT ck_loan_due CHECK (DueDate > LoanDate)
);
INSERT INTO Publisher VALUES (1, N'Pearson', N'UK'), (2, N'O''Reilly', N'USA'), (3, N'Kim Đồng', N'Việt Nam');
INSERT INTO Book VALUES
 ('9780136086208', N'Database Systems: The Complete Book', 1, 2008, 950000, 2),
 ('9781492045526', N'Learning SQL', 2, 2020, 720000, 1),
 ('9786042080011', N'Doraemon tập 1', 3, 2019, 25000, 5),
 ('9781098109714', N'SQL Pocket Guide', 2, 2021, 400000, 0);
INSERT INTO Member VALUES (1, N'Nguyễn An', '2025-09-01'), (2, N'Trần Bình', '2024-01-10'), (3, N'Lê Chi', '2025-10-20');
SET IDENTITY_INSERT Loan ON;
INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate, ReturnDate) VALUES
 (1, '9780136086208', 1, '2026-09-01', '2026-09-15', '2026-09-10'),
 (2, '9781492045526', 3, '2026-10-01', '2026-10-15', NULL),
 (3, '9786042080011', 3, '2026-10-02', '2026-10-09', NULL),
 (4, '9786042080011', 1, '2026-09-20', '2026-10-04', '2026-10-08');
SET IDENTITY_INSERT Loan OFF;`;

const GIAI = `-- Q1 ─ active loans of a member
CREATE OR ALTER PROCEDURE prActiveLoans
    @memberID INT,
    @active   INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Member WHERE MemberID = @memberID) RETURN -1;
    SELECT @active = COUNT(*) FROM Loan WHERE MemberID = @memberID AND ReturnDate IS NULL;
    RETURN 0;
END
GO
-- Q2 ─ late fee: 5,000 VND per day after DueDate (until ReturnDate, or @asOf if not returned)
CREATE OR ALTER FUNCTION dbo.fnLateFee (@loanID INT, @asOf DATE)
RETURNS DECIMAL(12,0)
AS
BEGIN
    DECLARE @due DATE, @end DATE;
    SELECT @due = DueDate, @end = COALESCE(ReturnDate, @asOf) FROM Loan WHERE LoanID = @loanID;
    IF @due IS NULL RETURN NULL;                                   -- no such loan
    RETURN CASE WHEN @end > @due THEN DATEDIFF(DAY, @due, @end) * 5000 ELSE 0 END;
END
GO
-- Q3 ─ books of a publisher with how many times each was borrowed
CREATE OR ALTER FUNCTION dbo.fnBooksOfPublisher (@publisherID INT)
RETURNS TABLE
AS
RETURN (
    SELECT b.ISBN, b.Title, COUNT(l.LoanID) AS timesBorrowed
    FROM Book b LEFT JOIN Loan l ON l.ISBN = b.ISBN
    WHERE b.PublisherID = @publisherID
    GROUP BY b.ISBN, b.Title
);
GO
-- Q4 ─ a new loan takes a copy from the stock; no stock ⇒ the whole INSERT is cancelled
CREATE OR ALTER TRIGGER trLoanStock ON Loan
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Book b JOIN (SELECT ISBN, COUNT(*) AS n FROM inserted GROUP BY ISBN) x ON x.ISBN = b.ISBN
               WHERE b.Stock < x.n)
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50070, N'Not enough copies in stock.', 1;
    END
    UPDATE b SET Stock = b.Stock - x.n
    FROM Book b JOIN (SELECT ISBN, COUNT(*) AS n FROM inserted GROUP BY ISBN) x ON x.ISBN = b.ISBN;
END
GO
-- Q5 ─ return a book: set ReturnDate and put the copy back, all or nothing
CREATE OR ALTER PROCEDURE prReturnBook
    @loanID INT,
    @on     DATE,
    @msg    NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Loan WHERE LoanID = @loanID)            BEGIN SET @msg = N'Loan not found';   RETURN 1; END
    IF EXISTS (SELECT 1 FROM Loan WHERE LoanID = @loanID AND ReturnDate IS NOT NULL) BEGIN SET @msg = N'Already returned'; RETURN 2; END
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE Loan SET ReturnDate = @on WHERE LoanID = @loanID;
            UPDATE Book SET Stock = Stock + 1 WHERE ISBN = (SELECT ISBN FROM Loan WHERE LoanID = @loanID);
        COMMIT TRANSACTION;
        SET @msg = N'OK';
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SET @msg = ERROR_MESSAGE();
        RETURN -1;
    END CATCH
END`;

const LOAN = (isbn, mem) => `INSERT INTO Loan (ISBN, MemberID, LoanDate, DueDate) VALUES ('${isbn}', ${mem}, '2026-11-01', '2026-11-15')`;

export default doiDau({
  slug: 'dbi202-7-lab-lap-trinh-thu-vien',
  ten: 'Lab 7 — Program the CT Library: procedures, functions, triggers',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch7',
  de: [
    tsql({
      t: 'Lab 7 — CT Library programmability (5 questions, PE questions 8–10 style)', k: 'HARD', p: 75, dangBai: 'lab', diem: 100,
      kn: ['stored procedure with OUTPUT', 'scalar function', 'inline TVF', 'multi-row AFTER trigger', 'transaction in a procedure'], tag: ['lab', 'tsql', 'procedure', 'function', 'trigger'],
      lyDo: ['Every question is T-SQL programming (procedures, functions, triggers, transactions) that only a real SQL Server runs; the browser grader would have to pretend.', 'Câu nào cũng là lập trình T-SQL (procedure, function, trigger, giao dịch) mà chỉ SQL Server thật chạy được; máy chấm trình duyệt sẽ phải giả vờ.'],
      en: `<p><b>DBI202 · Chapter 7 — Programmability · Suggested time: 75 minutes · 10 marks (5 × 2).</b> The CT Library of Lab 5, now on SQL Server: <code>Publisher</code>, <code>Book(ISBN, Title, PublisherID, PubYear, Price, Stock)</code>, <code>Member</code>, <code>Loan(LoanID IDENTITY, ISBN, MemberID, LoanDate, DueDate, ReturnDate)</code> — ReturnDate NULL = not returned yet. Full script: <code>setup.sql</code>.</p>
<ol>
<li><b>Q1 (2 marks)</b> — <code>prActiveLoans @memberID INT, @active INT OUTPUT</code>: the number of loans of the member not returned yet. RETURN -1 for an unknown member, 0 otherwise.</li>
<li><b>Q2 (2 marks)</b> — <code>dbo.fnLateFee(@loanID INT, @asOf DATE) RETURNS DECIMAL(12,0)</code>: 5,000 VND per day after DueDate, counted until ReturnDate (or until @asOf when not returned); 0 when not late; NULL for an unknown loan.</li>
<li><b>Q3 (2 marks)</b> — <code>dbo.fnBooksOfPublisher(@publisherID INT) RETURNS TABLE</code>: <code>ISBN, Title, timesBorrowed</code> for every book of the publisher (0 for books never borrowed).</li>
<li><b>Q4 (2 marks)</b> — trigger <code>trLoanStock</code> AFTER INSERT on Loan: each new loan takes one copy from Book.Stock; if a book does not have enough copies for the loans of the statement, the WHOLE insert is cancelled with an error. Multi-row inserts must work.</li>
<li><b>Q5 (2 marks)</b> — <code>prReturnBook @loanID INT, @on DATE, @msg NVARCHAR(200) OUTPUT</code>: set ReturnDate and put the copy back into Stock in ONE transaction. RETURN 1 "Loan not found", 2 "Already returned", 0 "OK".</li>
</ol>
<p>Write all five objects in <code>solution.sql</code> separated by <code>GO</code> (in the real PE each one goes into its own Qn.sql without GO).</p>`,
      vi: `<p><b>DBI202 · Chương 7 — Lập trình CSDL · Thời gian gợi ý: 75 phút · 10 điểm (5 × 2).</b> Thư viện CT của Lab 5, giờ trên SQL Server: <code>Publisher</code>, <code>Book(ISBN, Title, PublisherID, PubYear, Price, Stock)</code>, <code>Member</code>, <code>Loan(LoanID IDENTITY, ISBN, MemberID, LoanDate, DueDate, ReturnDate)</code> — ReturnDate NULL = chưa trả. Script đầy đủ: <code>setup.sql</code>.</p>
<ol>
<li><b>Q1 (2 điểm)</b> — <code>prActiveLoans @memberID INT, @active INT OUTPUT</code>: số lượt mượn chưa trả của bạn đọc. RETURN -1 nếu không có bạn đọc, 0 trong trường hợp còn lại.</li>
<li><b>Q2 (2 điểm)</b> — <code>dbo.fnLateFee(@loanID INT, @asOf DATE) RETURNS DECIMAL(12,0)</code>: 5.000 đồng mỗi ngày sau DueDate, tính tới ReturnDate (hoặc tới @asOf nếu chưa trả); 0 nếu không trễ; NULL nếu không có lượt mượn đó.</li>
<li><b>Q3 (2 điểm)</b> — <code>dbo.fnBooksOfPublisher(@publisherID INT) RETURNS TABLE</code>: <code>ISBN, Title, timesBorrowed</code> cho mọi sách của nhà xuất bản (0 với sách chưa ai mượn).</li>
<li><b>Q4 (2 điểm)</b> — trigger <code>trLoanStock</code> AFTER INSERT trên Loan: mỗi lượt mượn mới lấy một bản khỏi Book.Stock; nếu một sách không đủ bản cho các lượt mượn của câu lệnh thì CẢ câu INSERT bị huỷ kèm lỗi. INSERT nhiều dòng phải chạy đúng.</li>
<li><b>Q5 (2 điểm)</b> — <code>prReturnBook @loanID INT, @on DATE, @msg NVARCHAR(200) OUTPUT</code>: gán ReturnDate và trả bản sách về Stock trong MỘT giao dịch. RETURN 1 "Loan not found", 2 "Already returned", 0 "OK".</li>
</ol>
<p>Viết cả năm đối tượng trong <code>solution.sql</code>, tách bằng <code>GO</code> (thi PE thật thì mỗi cái một tệp Qn.sql, không GO).</p>`,
      yc: [['Object names and parameters exactly as given.', 'Tên đối tượng và tham số đúng như đề.'], ['check.sql prints PASS/FAIL per question (Q1 … Q5); 10 marks = every check passes.', 'check.sql in PASS/FAIL theo từng câu (Q1 … Q5); 10 điểm = mọi kiểm đều đạt.']],
      setup: LIB,
      khoi: `-- Q1: CREATE OR ALTER PROCEDURE prActiveLoans ...
GO
-- Q2: CREATE OR ALTER FUNCTION dbo.fnLateFee ...
GO
-- Q3: CREATE OR ALTER FUNCTION dbo.fnBooksOfPublisher ...
GO
-- Q4: CREATE OR ALTER TRIGGER trLoanStock ON Loan AFTER INSERT ...
GO
-- Q5: CREATE OR ALTER PROCEDURE prReturnBook ...
`,
      giai: GIAI,
      kiem: [
        ck(['Q1 · member 3 has 2 active loans, members 1 and 2 none; unknown → -1', 'Q1 · bạn đọc 3 có 2 lượt chưa trả, bạn đọc 1 và 2 không có; lạ → -1'], `DECLARE @a INT, @b INT, @c INT, @r1 INT, @r2 INT, @r3 INT;
DECLARE @d INT;
EXEC @r1 = dbo.prActiveLoans 3, @a OUTPUT; EXEC @r2 = dbo.prActiveLoans 1, @b OUTPUT; EXEC @r3 = dbo.prActiveLoans 9, @c OUTPUT; EXEC dbo.prActiveLoans 2, @d OUTPUT;
SET @ok = IIF(@r1 = 0 AND @a = 2 AND @r2 = 0 AND @b = 0 AND @d = 0 AND @r3 = -1, 1, 0); SET @info = CONCAT(N'member 3: ', @a, N' · member 1 (both loans returned): ', @b, N' · member 2: ', @d, N' · rc for 9: ', @r3);`),
        ck(['Q2 · returned 4 days late = 20,000; returned early = 0', 'Q2 · trả trễ 4 ngày = 20.000; trả sớm = 0'], `SET @ok = IIF(dbo.fnLateFee(4, '2026-11-01') = 20000 AND dbo.fnLateFee(1, '2026-11-01') = 0, 1, 0); SET @info = CONCAT(N'loan 4: ', dbo.fnLateFee(4, '2026-11-01'), N' · loan 1: ', dbo.fnLateFee(1, '2026-11-01'));`),
        ck(['Q2 · not returned: counted until @asOf; before the due date: 0; unknown loan: NULL', 'Q2 · chưa trả: tính tới @asOf; trước hạn: 0; lượt mượn lạ: NULL'], `SET @ok = IIF(dbo.fnLateFee(3, '2026-10-19') = 50000 AND dbo.fnLateFee(2, '2026-10-10') = 0 AND dbo.fnLateFee(99, '2026-11-01') IS NULL, 1, 0);
SET @info = CONCAT(N'loan 3 on 2026-10-19: ', dbo.fnLateFee(3, '2026-10-19'), N' · loan 2 on 2026-10-10: ', dbo.fnLateFee(2, '2026-10-10'));`),
        ck(["Q3 · O'Reilly: Learning SQL borrowed once, SQL Pocket Guide 0 times", "Q3 · O'Reilly: Learning SQL được mượn 1 lần, SQL Pocket Guide 0 lần"], giongNhau('SELECT ISBN, Title, timesBorrowed FROM dbo.fnBooksOfPublisher(2)', `SELECT b.ISBN, b.Title, (SELECT COUNT(*) FROM Loan l WHERE l.ISBN = b.ISBN) AS timesBorrowed FROM Book b WHERE b.PublisherID = 2`)),
        ck(['Q3 · Kim Đồng: Doraemon borrowed twice', 'Q3 · Kim Đồng: Doraemon được mượn 2 lần'], `SET @ok = IIF((SELECT timesBorrowed FROM dbo.fnBooksOfPublisher(3) WHERE ISBN = '9786042080011') = 2, 1, 0); SET @info = N'expected 2 for Doraemon';`),
        ck(['Q4 · a loan of Doraemon takes one copy (5 → 4)', 'Q4 · mượn Doraemon lấy một bản (5 → 4)'], `BEGIN TRAN; ${LOAN('9786042080011', 2)};
SET @ok = IIF((SELECT Stock FROM Book WHERE ISBN = '9786042080011') = 4, 1, 0); SET @info = CONCAT(N'stock = ', (SELECT Stock FROM Book WHERE ISBN = '9786042080011')); IF @@TRANCOUNT > 0 ROLLBACK;`),
        ck(['Q4 · a book with 0 copies cannot be lent', 'Q4 · sách còn 0 bản không cho mượn được'], tuChoi([LOAN('9781098109714', 1)])),
        ck(['Q4 · three loans of the Complete Book (2 copies) in one INSERT are all cancelled', 'Q4 · ba lượt mượn Complete Book (2 bản) trong một INSERT bị huỷ cả'], `DECLARE @loi BIT = 0, @truoc INT = (SELECT COUNT(*) FROM Loan);
BEGIN TRY INSERT INTO Loan (ISBN, MemberID, LoanDate, DueDate) VALUES ('9780136086208', 1, '2026-11-01', '2026-11-15'), ('9780136086208', 2, '2026-11-01', '2026-11-15'), ('9780136086208', 3, '2026-11-01', '2026-11-15'); END TRY BEGIN CATCH SET @loi = 1; END CATCH;
WHILE @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@loi = 1 AND (SELECT COUNT(*) FROM Loan) = @truoc AND (SELECT Stock FROM Book WHERE ISBN = '9780136086208') = 2, 1, 0);
SET @info = CONCAT(N'error raised: ', @loi, N' · stock now ', (SELECT Stock FROM Book WHERE ISBN = '9780136086208'));
DELETE FROM Loan WHERE LoanID > 4; UPDATE Book SET Stock = 2 WHERE ISBN = '9780136086208';`),
        ck(['Q4 · two loans of Doraemon in one INSERT take two copies', 'Q4 · hai lượt mượn Doraemon trong một INSERT lấy hai bản'], `BEGIN TRAN; INSERT INTO Loan (ISBN, MemberID, LoanDate, DueDate) VALUES ('9786042080011', 1, '2026-11-01', '2026-11-15'), ('9786042080011', 2, '2026-11-01', '2026-11-15');
SET @ok = IIF((SELECT Stock FROM Book WHERE ISBN = '9786042080011') = 3, 1, 0); SET @info = CONCAT(N'stock = ', (SELECT Stock FROM Book WHERE ISBN = '9786042080011')); IF @@TRANCOUNT > 0 ROLLBACK;`),
        ck(['Q5 · returning loan 2 sets the date and puts the copy back', 'Q5 · trả lượt 2 gán ngày và trả bản sách về kho'], `DECLARE @m NVARCHAR(200), @rc INT; BEGIN TRAN; EXEC @rc = dbo.prReturnBook 2, '2026-10-14', @m OUTPUT;
SET @ok = IIF(@rc = 0 AND @m = N'OK' AND (SELECT ReturnDate FROM Loan WHERE LoanID = 2) = '2026-10-14' AND (SELECT Stock FROM Book WHERE ISBN = '9781492045526') = 2, 1, 0);
SET @info = CONCAT(N'rc=', @rc, N' msg=', @m); IF @@TRANCOUNT > 0 ROLLBACK;`),
        ck(['Q5 · already returned → 2, unknown loan → 1, nothing changes', 'Q5 · đã trả → 2, lượt lạ → 1, không đổi gì'], `DECLARE @m1 NVARCHAR(200), @m2 NVARCHAR(200), @r1 INT, @r2 INT;
EXEC @r1 = dbo.prReturnBook 1, '2026-11-01', @m1 OUTPUT; EXEC @r2 = dbo.prReturnBook 99, '2026-11-01', @m2 OUTPUT;
SET @ok = IIF(@r1 = 2 AND @m1 = N'Already returned' AND @r2 = 1 AND @m2 = N'Loan not found' AND (SELECT Stock FROM Book WHERE ISBN = '9780136086208') = 2, 1, 0);
SET @info = CONCAT(@r1, N'/', @m1, N' · ', @r2, N'/', @m2);`),
      ],
      saiTay: [
        GIAI.replace('SELECT @active = COUNT(*) FROM Loan WHERE MemberID = @memberID AND ReturnDate IS NULL;', 'SELECT @active = COUNT(*) FROM Loan WHERE MemberID = @memberID;'),
        GIAI.replace("RETURN CASE WHEN @end > @due THEN DATEDIFF(DAY, @due, @end) * 5000 ELSE 0 END;", "RETURN DATEDIFF(DAY, @due, @end) * 5000;"),
        GIAI.replace('FROM Book b LEFT JOIN Loan l ON l.ISBN = b.ISBN', 'FROM Book b JOIN Loan l ON l.ISBN = b.ISBN'),
        GIAI.replace(`    UPDATE b SET Stock = b.Stock - x.n
    FROM Book b JOIN (SELECT ISBN, COUNT(*) AS n FROM inserted GROUP BY ISBN) x ON x.ISBN = b.ISBN;`, `    UPDATE Book SET Stock = Stock - 1 WHERE ISBN = (SELECT TOP (1) ISBN FROM inserted);`),
        GIAI.replace("    IF EXISTS (SELECT 1 FROM Loan WHERE LoanID = @loanID AND ReturnDate IS NOT NULL) BEGIN SET @msg = N'Already returned'; RETURN 2; END\n", ''),
      ],
      gy: [['Q1/Q5: validate first and RETURN a code; Q5 puts the two UPDATEs in one transaction with TRY/CATCH.', 'Q1/Q5: kiểm trước và RETURN mã; Q5 đặt hai UPDATE trong một giao dịch có TRY/CATCH.'], ['Q4: group inserted by ISBN — a statement may lend the same book several times; Book.Stock already has a CHECK (Stock ≥ 0) that also stops an over-lend.', 'Q4: gộp inserted theo ISBN — một câu có thể cho mượn cùng một sách nhiều lần; Book.Stock đã có CHECK (Stock ≥ 0) cũng chặn mượn quá số bản.']],
      lhg: [['Q2 returning a negative fee for early returns — DATEDIFF goes below 0.', 'Q2 trả phí âm khi trả sớm — DATEDIFF ra số âm.'], ['Q4 decreasing the stock by 1 for one row of inserted only — multi-row loans are miscounted.', 'Q4 chỉ trừ 1 cho một dòng của inserted — mượn nhiều dòng bị đếm sai.']],
      gt: ['<p>Each object is the shape of a PE question 8–10: a procedure with OUTPUT and a return code, functions used inside queries, a set-based trigger, and a procedure whose writes are atomic.</p>', '<p>Mỗi đối tượng là dạng của câu 8–10 đề PE: procedure có OUTPUT và mã trả về, hàm dùng trong truy vấn, trigger theo tập, và procedure có các lệnh ghi nguyên tử.</p>'],
      tn: [tn('stored procedure', 'thủ tục lưu sẵn'), tn('trigger', 'trigger'), tn('inline TVF', 'hàm trả bảng nội tuyến')],
    }),
  ],
});
