/**
 * DBI202 · Chương 5 — LAB 5 (bản in): dựng CSDL thư viện "CT Library" bằng DDL + sửa cấu trúc + thao tác dữ liệu
 * có ràng buộc. 5 câu × 2 điểm, mỗi câu một tệp Q1.sql … Q5.sql. Câu sau được chấm trên lược đồ CHUẨN của các câu
 * trước (máy chấm tự dựng) — làm sai Q1 không kéo theo Q3. Kiểm theo hành vi (câu hợp lệ chạy, câu vi phạm bị chặn).
 */
import { doiDau, KHOA, deLonSql, sau, chan, duoc, TN } from './_chung.mjs';

const Q1 = `CREATE TABLE Publisher (
    PublisherID INT          NOT NULL PRIMARY KEY,
    Name        VARCHAR(100) NOT NULL UNIQUE,
    Country     VARCHAR(50)  NULL
);
CREATE TABLE Book (
    ISBN        CHAR(13)      NOT NULL PRIMARY KEY,
    Title       VARCHAR(200)  NOT NULL,
    PublisherID INT           NOT NULL REFERENCES Publisher (PublisherID),
    PubYear     INT           NULL CHECK (PubYear BETWEEN 1450 AND 2100),
    Price       DECIMAL(10,2) NOT NULL CHECK (Price >= 0)
);`;
const Q2 = `CREATE TABLE Member (
    MemberID   INT          NOT NULL PRIMARY KEY,
    FullName   VARCHAR(60)  NOT NULL,
    Email      VARCHAR(100) NULL UNIQUE,
    MemberType CHAR(1)      NOT NULL DEFAULT 'S' CHECK (MemberType IN ('S', 'T')),
    JoinDate   DATE         NOT NULL
);`;
const Q3 = `CREATE TABLE Loan (
    LoanID     INT      NOT NULL PRIMARY KEY,
    ISBN       CHAR(13) NOT NULL REFERENCES Book (ISBN),
    MemberID   INT      NOT NULL REFERENCES Member (MemberID),
    LoanDate   DATE     NOT NULL,
    DueDate    DATE     NOT NULL,
    ReturnDate DATE     NULL,
    CONSTRAINT ck_loan_due    CHECK (DueDate > LoanDate),
    CONSTRAINT ck_loan_return CHECK (ReturnDate IS NULL OR ReturnDate >= LoanDate)
);`;
const DATA = `INSERT INTO Publisher (PublisherID, Name, Country) VALUES (1, 'Pearson', 'UK'), (2, 'O''Reilly', 'USA'), (3, 'Kim Dong', 'Viet Nam');
INSERT INTO Book (ISBN, Title, PublisherID, PubYear, Price) VALUES
 ('9780136086208', 'Database Systems: The Complete Book', 1, 2008, 950000),
 ('9781492045526', 'Learning SQL', 2, 2020, 720000),
 ('9786042080011', 'Doraemon vol. 1', 3, 2019, 25000);
INSERT INTO Member (MemberID, FullName, Email, MemberType, JoinDate) VALUES
 (1, 'Nguyen An', 'an@fpt.edu.vn', 'S', '2025-09-01'), (2, 'Tran Binh', NULL, 'T', '2024-01-10'), (3, 'Le Chi', 'chi@fpt.edu.vn', 'S', '2025-10-20');
INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate, ReturnDate) VALUES
 (1, '9780136086208', 1, '2026-09-01', '2026-09-15', '2026-09-10'), (2, '9781492045526', 3, '2026-10-01', '2026-10-15', NULL),
 (3, '9786042080011', 3, '2026-10-02', '2026-10-09', NULL);`;
const CO_SO = `${Q1}\n${Q2}\n${Q3}\n${DATA}`;
const cot = (ds) => `SELECT lower(table_name) AS tbl, lower(column_name) AS col, lower(data_type) AS type FROM information_schema.columns WHERE lower(table_name) IN (${ds.map((t) => `'${t.toLowerCase()}'`).join(', ')}) ORDER BY lower(table_name), ordinal_position`;

export default doiDau({
  slug: 'dbi202-5-lab-ct-library',
  ten: 'Lab 5 — Build the CT Library database (DDL + constraints)',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch5',
  de: [
    deLonSql({
      dangBai: 'lab',
      tieuDe: 'Lab 5 — CT Library: tables, constraints, ALTER and safe changes',
      doKho: 'HARD', phut: 75, diem: 100,
      khaiNiem: ['CREATE TABLE', 'PRIMARY/FOREIGN KEY', 'UNIQUE', 'CHECK (column and table level)', 'DEFAULT', 'ALTER TABLE', 'delete order with foreign keys'],
      tienQuyet: ['5.1 and 5.3 of this track'],
      the: ['dbi202', 'lab', 'ddl', 'constraints'],
      csdl: CO_SO, tenCsdl: 'CTLibrary',
      thuMuc: 'RollNo_Name_DBI202_Lab5',
      phu: { en: 'DBI202 · Chapter 5 — SQL DDL · Suggested time: 75 minutes · Total: 10 marks (5 × 2)', vi: 'DBI202 · Chương 5 — SQL DDL · Thời gian gợi ý: 75 phút · Tổng: 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The CT Library lends books to students and teachers. You build its database step by step: publishers and books (Q1), members (Q2), loans (Q3), a schema change (Q4) and a data change that has to respect the foreign keys (Q5). Each question is graded on the <b>reference</b> schema of the previous questions (shown in the <code>CTLibrary.sql</code> tab), so a mistake in Q1 does not cost you Q3.</p>',
        vi: '<p>Thư viện CT cho sinh viên và giảng viên mượn sách. Bạn dựng CSDL từng bước: nhà xuất bản và sách (Q1), bạn đọc (Q2), phiếu mượn (Q3), một thay đổi cấu trúc (Q4) và một thay đổi dữ liệu phải tôn trọng khoá ngoại (Q5). Mỗi câu được chấm trên lược đồ <b>chuẩn</b> của các câu trước (tab <code>CTLibrary.sql</code>), nên sai Q1 không làm mất điểm Q3.</p>',
      },
      yeuCauChung: [
        { en: 'Portable types only: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE. Table and column names exactly as given.', vi: 'Chỉ kiểu chạy mọi hệ: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE. Tên bảng, cột đúng như đề.' },
        { en: 'Graded by behaviour: valid rows must be accepted, invalid rows rejected — any constraint names are fine unless a name is required.', vi: 'Chấm theo hành vi: dòng hợp lệ phải vào được, dòng sai phải bị chặn — tên ràng buộc tuỳ ý trừ khi đề yêu cầu tên.' },
      ],
      moHinh: [
        { ten: 'Publisher', truong: [['PublisherID', 'INT', 'PK'], ['Name', 'VARCHAR(100)', 'required, UNIQUE'], ['Country', 'VARCHAR(50)', 'optional']] },
        { ten: 'Book', truong: [['ISBN', 'CHAR(13)', 'PK'], ['Title', 'VARCHAR(200)', 'required'], ['PublisherID', 'INT', 'required, FK → Publisher'], ['PubYear', 'INT', 'optional, 1450–2100'], ['Price', 'DECIMAL(10,2)', 'required, ≥ 0']] },
        { ten: 'Member', truong: [['MemberID', 'INT', 'PK'], ['FullName', 'VARCHAR(60)', 'required'], ['Email', 'VARCHAR(100)', 'optional, UNIQUE'], ['MemberType', 'CHAR(1)', "'S' student / 'T' teacher, default 'S'"], ['JoinDate', 'DATE', 'required']] },
        { ten: 'Loan', truong: [['LoanID', 'INT', 'PK'], ['ISBN', 'CHAR(13)', 'FK → Book'], ['MemberID', 'INT', 'FK → Member'], ['LoanDate', 'DATE', 'required'], ['DueDate', 'DATE', 'required, after LoanDate'], ['ReturnDate', 'DATE', 'NULL = not returned; if set, not before LoanDate']] },
      ],
      cau: [
        {
          ten: { en: 'Publisher and Book', vi: 'Publisher và Book' }, diem: 2,
          moTa: { en: 'Create Publisher and Book exactly as in the data model.', vi: 'Tạo Publisher và Book đúng như mô hình dữ liệu.' },
          yeuCau: [{ en: 'Columns in the order of the model; all keys and constraints of the model.', vi: 'Cột đúng thứ tự mô hình; đủ khoá và ràng buộc trong mô hình.' }],
          giai: Q1,
          kiem: [
            { ...sau('Q1 · tables and columns', cot(['Publisher', 'Book']), { thuTu: true }), csdl: '' },
            { ...duoc('Q1 · valid publisher and book', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'Pearson'); INSERT INTO Book (ISBN, Title, PublisherID, PubYear, Price) VALUES ('9780136086208', 'DB', 1, 2008, 0)"), csdl: '' },
            { ...chan('Q1 · duplicate publisher name', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'Pearson'), (2, 'Pearson')", '23505'), csdl: '' },
            { ...chan('Q1 · book of an unknown publisher', "INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000001', 'X', 99, 10)", '23503'), csdl: '' },
            { ...chan('Q1 · negative price', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000002', 'X', 1, -1)", '23514'), csdl: '', an: true },
            { ...chan('Q1 · year 1300', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, PubYear, Price) VALUES ('9780000000003', 'X', 1, 1300, 1)", '23514'), csdl: '', an: true },
          ],
          saiMau: ['CREATE TABLE Publisher (PublisherID INT PRIMARY KEY, Name VARCHAR(100) NOT NULL, Country VARCHAR(50)); CREATE TABLE Book (ISBN CHAR(13) PRIMARY KEY, Title VARCHAR(200) NOT NULL, PublisherID INT NOT NULL REFERENCES Publisher(PublisherID), PubYear INT CHECK (PubYear BETWEEN 1450 AND 2100), Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0))'],
        },
        {
          ten: { en: 'Member with a default type', vi: 'Member có loại mặc định' }, diem: 2,
          moTa: { en: 'Create Member. MemberType is S (student) or T (teacher) and defaults to S.', vi: 'Tạo Member. MemberType là S (sinh viên) hoặc T (giảng viên), mặc định S.' },
          yeuCau: [{ en: 'DEFAULT \'S\' + CHECK (MemberType IN (\'S\', \'T\')); Email UNIQUE but optional.', vi: 'DEFAULT \'S\' + CHECK (MemberType IN (\'S\', \'T\')); Email UNIQUE nhưng không bắt buộc.' }],
          giai: Q2,
          kiem: [
            { ...sau('Q2 · columns', cot(['Member']), { thuTu: true }), csdl: '' },
            { ...sau('Q2 · MemberType defaults to S', "INSERT INTO Member (MemberID, FullName, JoinDate) VALUES (1, 'An', '2026-01-01'); SELECT MemberID, MemberType FROM Member"), csdl: '' },
            { ...chan('Q2 · MemberType X is rejected', "INSERT INTO Member (MemberID, FullName, MemberType, JoinDate) VALUES (2, 'B', 'X', '2026-01-01')", '23514'), csdl: '' },
            { ...chan('Q2 · duplicate email is rejected', "INSERT INTO Member (MemberID, FullName, Email, JoinDate) VALUES (3, 'C', 'c@x.vn', '2026-01-01'), (4, 'D', 'c@x.vn', '2026-01-01')", '23505'), csdl: '', an: true },
            { ...chan('Q2 · JoinDate is required', "INSERT INTO Member (MemberID, FullName) VALUES (5, 'E')", '23502'), csdl: '', an: true },
          ],
          saiMau: ["CREATE TABLE Member (MemberID INT PRIMARY KEY, FullName VARCHAR(60) NOT NULL, Email VARCHAR(100) UNIQUE, MemberType CHAR(1) CHECK (MemberType IN ('S','T')), JoinDate DATE NOT NULL)"],
        },
        {
          ten: { en: 'Loan with table-level CHECKs', vi: 'Loan với CHECK cấp bảng' }, diem: 2,
          moTa: { en: 'Create Loan. The due date must be after the loan date; a return date, when known, cannot be before the loan date.', vi: 'Tạo Loan. Hạn trả phải sau ngày mượn; ngày trả, khi đã có, không được trước ngày mượn.' },
          yeuCau: [{ en: 'Two FOREIGN KEYs (Book, Member) and two CHECK constraints comparing columns.', vi: 'Hai FOREIGN KEY (Book, Member) và hai ràng buộc CHECK so sánh giữa các cột.' }],
          giai: Q3,
          kiem: [
            { ...sau('Q3 · columns', cot(['Loan']), { thuTu: true }), csdl: `${Q1}\n${Q2}` },
            { ...duoc('Q3 · a valid loan, not yet returned', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000001', 'X', 1, 1); INSERT INTO Member (MemberID, FullName, JoinDate) VALUES (1, 'A', '2026-01-01'); INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate) VALUES (1, '9780000000001', 1, '2026-10-01', '2026-10-15')"), csdl: `${Q1}\n${Q2}` },
            { ...chan('Q3 · due date before loan date', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000001', 'X', 1, 1); INSERT INTO Member (MemberID, FullName, JoinDate) VALUES (1, 'A', '2026-01-01'); INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate) VALUES (1, '9780000000001', 1, '2026-10-15', '2026-10-01')", '23514'), csdl: `${Q1}\n${Q2}` },
            { ...chan('Q3 · returned before borrowed', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000001', 'X', 1, 1); INSERT INTO Member (MemberID, FullName, JoinDate) VALUES (1, 'A', '2026-01-01'); INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate, ReturnDate) VALUES (1, '9780000000001', 1, '2026-10-01', '2026-10-15', '2026-09-30')", '23514'), csdl: `${Q1}\n${Q2}`, an: true },
            { ...chan('Q3 · loan for an unknown member', "INSERT INTO Publisher (PublisherID, Name) VALUES (1, 'P'); INSERT INTO Book (ISBN, Title, PublisherID, Price) VALUES ('9780000000001', 'X', 1, 1); INSERT INTO Loan (LoanID, ISBN, MemberID, LoanDate, DueDate) VALUES (1, '9780000000001', 42, '2026-10-01', '2026-10-15')", '23503'), csdl: `${Q1}\n${Q2}`, an: true },
          ],
          saiMau: ['CREATE TABLE Loan (LoanID INT PRIMARY KEY, ISBN CHAR(13) NOT NULL REFERENCES Book(ISBN), MemberID INT NOT NULL REFERENCES Member(MemberID), LoanDate DATE NOT NULL, DueDate DATE NOT NULL, ReturnDate DATE, CHECK (DueDate > LoanDate))'],
        },
        {
          ten: { en: 'Add stock to books', vi: 'Thêm tồn kho cho sách' }, diem: 2,
          moTa: { en: 'The library now tracks copies. Add column <code>Stock</code> INT NOT NULL DEFAULT 1 to Book (existing books get 1) and a CHECK constraint named <code>ck_book_stock</code> (Stock ≥ 0).', vi: 'Thư viện theo dõi số bản. Thêm cột <code>Stock</code> INT NOT NULL DEFAULT 1 vào Book (sách cũ nhận 1) và ràng buộc CHECK tên <code>ck_book_stock</code> (Stock ≥ 0).' },
          yeuCau: [{ en: 'ALTER TABLE … ADD Stock … (no COLUMN keyword), then ALTER TABLE … ADD CONSTRAINT ck_book_stock CHECK (…).', vi: 'ALTER TABLE … ADD Stock … (không chữ COLUMN), rồi ALTER TABLE … ADD CONSTRAINT ck_book_stock CHECK (…).' }],
          giai: `ALTER TABLE Book ADD Stock INT NOT NULL DEFAULT 1;   -- existing rows receive the default
ALTER TABLE Book ADD CONSTRAINT ck_book_stock CHECK (Stock >= 0);`,
          kiem: [
            sau('Q4 · existing books have Stock 1', 'SELECT ISBN, Stock FROM Book ORDER BY ISBN', { thuTu: true }),
            chan('Q4 · negative stock is rejected', "UPDATE Book SET Stock = -1 WHERE ISBN = '9781492045526'", '23514'),
            sau('Q4 · constraint ck_book_stock exists', "SELECT lower(constraint_name) AS name FROM information_schema.table_constraints WHERE lower(table_name) = 'book' AND lower(constraint_name) = 'ck_book_stock'", { an: true }),
          ],
          saiMau: ['ALTER TABLE Book ADD Stock INT NULL; ALTER TABLE Book ADD CONSTRAINT ck_book_stock CHECK (Stock >= 0)', 'ALTER TABLE Book ADD Stock INT NOT NULL DEFAULT 1'],
        },
        {
          ten: { en: 'Remove a member the right way', vi: 'Xoá bạn đọc đúng cách' }, diem: 2,
          moTa: { en: 'Member 3 (Le Chi) leaves the school. Delete the member and everything that references them, in an order the foreign keys accept. Nothing else may change.', vi: 'Bạn đọc 3 (Le Chi) rời trường. Xoá bạn đọc này và mọi thứ tham chiếu tới họ, theo thứ tự mà khoá ngoại chấp nhận. Không được đổi gì khác.' },
          yeuCau: [{ en: 'DELETE statements only (no change to the constraints); child rows first, then the parent.', vi: 'Chỉ dùng lệnh DELETE (không sửa ràng buộc); xoá dòng con trước, rồi dòng cha.' }],
          giai: `DELETE FROM Loan   WHERE MemberID = 3;   -- children first …
DELETE FROM Member WHERE MemberID = 3;   -- … then the parent`,
          kiem: [
            sau('Q5 · remaining members', 'SELECT MemberID, FullName FROM Member ORDER BY MemberID', { thuTu: true }),
            sau('Q5 · remaining loans', 'SELECT LoanID, MemberID FROM Loan ORDER BY LoanID', { thuTu: true }),
            sau('Q5 · books untouched', 'SELECT COUNT(*) AS n FROM Book', { an: true }),
          ],
          saiMau: ['DELETE FROM Member WHERE MemberID = 3', 'DELETE FROM Loan; DELETE FROM Member WHERE MemberID = 3'],
        },
      ],
      truDiem: [
        { en: 'NVARCHAR / IDENTITY / DATETIME — SQL Server-only; this lab uses portable types (on the real PE you may use them).', vi: 'NVARCHAR / IDENTITY / DATETIME — riêng SQL Server; lab này dùng kiểu chạy mọi hệ (PE thật thì được dùng).' },
        { en: 'A CHECK that compares two columns written as a column constraint referencing another column — write it at table level.', vi: 'CHECK so hai cột viết như ràng buộc của một cột — hãy viết ở cấp bảng.' },
        { en: 'Q5: deleting the parent first fails with a foreign-key error (SQL Server Msg 547).', vi: 'Q5: xoá cha trước thì lỗi khoá ngoại (SQL Server Msg 547).' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql. <b>Run</b> = sample checks; <b>Submit</b> = all checks and the 10-mark score table. The CTLibrary.sql tab holds the reference schema + data used from Q3 on.',
        vi: 'Các tab Q1.sql … Q5.sql. <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10. Tab CTLibrary.sql chứa lược đồ chuẩn + dữ liệu dùng từ Q3.',
      },
      thuatNgu: [TN.pk, TN.fk, TN.check, { en: 'DEFAULT', vi: 'giá trị mặc định' }, { en: 'table-level constraint', vi: 'ràng buộc cấp bảng (liên quan nhiều cột)' }, TN.ddl],
      goiY: [
        'Q1–Q3: viết CREATE TABLE rồi tự thử bằng vài INSERT đúng/sai ngay trong đầu: dòng nào phải bị chặn?',
        'Q3: CHECK (DueDate > LoanDate) và CHECK (ReturnDate IS NULL OR ReturnDate >= LoanDate) — đặt ở cấp bảng (sau danh sách cột).',
        'Q5: dòng con (Loan) trỏ tới dòng cha (Member) ⇒ xoá con trước.',
      ],
      loiHayGap: [
        { en: 'Q2 without DEFAULT — inserting without MemberType fails (NOT NULL) or stores NULL.', vi: 'Q2 thiếu DEFAULT — chèn không ghi MemberType thì lỗi (NOT NULL) hoặc lưu NULL.' },
        { en: 'Q3 with only CHECK (ReturnDate >= LoanDate) — fine for NULL (UNKNOWN passes) but write the IS NULL branch so the intent is clear.', vi: 'Q3 chỉ CHECK (ReturnDate >= LoanDate) — với NULL vẫn qua (UNKNOWN lọt) nhưng viết rõ nhánh IS NULL cho dễ hiểu.' },
        { en: 'Q4 adding the column as NULL — old books get NULL stock instead of 1.', vi: 'Q4 thêm cột cho phép NULL — sách cũ có tồn kho NULL thay vì 1.' },
      ],
      giaiThich: { en: '<p>The reference DDL is in the CTLibrary.sql tab. Every statement is standard SQL accepted by SQL Server 2019+ and PostgreSQL.</p>', vi: '<p>DDL chuẩn nằm ở tab CTLibrary.sql. Mọi lệnh là SQL chuẩn, SQL Server 2019+ và PostgreSQL đều nhận.</p>' },
    }),
  ],
});
