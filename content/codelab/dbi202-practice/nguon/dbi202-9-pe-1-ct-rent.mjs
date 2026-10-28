/**
 * DBI202 · Luyện PE số 1 — "CT Rent" (cho thuê xe tự lái). Đề MỚI theo ĐÚNG dạng đề PE thật mới nhất (SP26, Paper 1/8 —
 * content/exams/DBI202-PE2/PE3): Q1 dựng bảng từ ERD (thuộc tính đa trị + liên kết nhiều-nhiều có thuộc tính), Q2 LIKE,
 * Q3 nối 3–4 bảng + lọc, Q4 outer join giữ "kể cả khi không có", Q5 đếm phân biệt qua hai LEFT JOIN, Q6 lớn nhất theo
 * nhóm (có hoà), Q7 hai điều kiện "lớn nhất" cùng lúc, Q8–Q10 lệnh tác động dữ liệu.
 * KHÁC đề thật ở Q8/Q9: đề thật là function/trigger/procedure T-SQL — máy chấm trình duyệt (PostgreSQL WASM) không
 * chấm được T-SQL ⇒ ở đây là VIEW và UPDATE theo truy vấn con (chạy cả hai hệ). T-SQL: máy chấm SQL Server — sắp có.
 * Thang 10 = 10 × 1 điểm; mỗi câu kiểm mẫu + kiểm ẩn đổi dữ liệu.
 */
import { doiDau, KHOA, deLonSql, kq, kqAn, sau, chan, duoc, TN } from './_chung.mjs';

const DB = `CREATE TABLE Branches (
    BranchID   INT           NOT NULL PRIMARY KEY,
    BranchName NVARCHAR(50)  NOT NULL,
    City       NVARCHAR(30)  NOT NULL
);
CREATE TABLE CarModels (
    ModelID    INT           NOT NULL PRIMARY KEY,
    Brand      NVARCHAR(30)  NOT NULL,
    ModelName  NVARCHAR(50)  NOT NULL,
    Seats      INT           NOT NULL,
    DailyRate  DECIMAL(10,2) NOT NULL
);
CREATE TABLE Cars (
    CarID      INT           NOT NULL PRIMARY KEY,
    PlateNo    VARCHAR(15)   NOT NULL UNIQUE,
    ModelID    INT           NOT NULL REFERENCES CarModels (ModelID),
    BranchID   INT           NOT NULL REFERENCES Branches (BranchID),
    MadeYear   INT           NOT NULL,
    Status     NVARCHAR(15)  NOT NULL
);
CREATE TABLE Customers (
    CustomerID INT           NOT NULL PRIMARY KEY,
    FullName   NVARCHAR(50)  NOT NULL,
    Email      NVARCHAR(100) NOT NULL,
    City       NVARCHAR(30)  NOT NULL,
    JoinDate   DATE          NOT NULL
);
CREATE TABLE Rentals (
    RentalID       INT           NOT NULL PRIMARY KEY,
    CarID          INT           NOT NULL REFERENCES Cars (CarID),
    CustomerID     INT           NOT NULL REFERENCES Customers (CustomerID),
    PickupBranchID INT           NOT NULL REFERENCES Branches (BranchID),
    PickupDate     DATE          NOT NULL,
    ReturnDate     DATE          NULL,
    TotalAmount    DECIMAL(12,2) NULL
);
CREATE TABLE LoyalCustomers (
    CustomerID INT           NOT NULL PRIMARY KEY REFERENCES Customers (CustomerID),
    FullName   NVARCHAR(50)  NOT NULL,
    TotalSpent DECIMAL(14,2) NOT NULL
);

INSERT INTO Branches (BranchID, BranchName, City) VALUES
 (1, N'CT Rent Hoàn Kiếm', N'Hà Nội'), (2, N'CT Rent Cầu Giấy', N'Hà Nội'),
 (3, N'CT Rent Quận 1', N'Hồ Chí Minh'), (4, N'CT Rent Hải Châu', N'Đà Nẵng');
INSERT INTO CarModels (ModelID, Brand, ModelName, Seats, DailyRate) VALUES
 (1, N'Toyota', N'Vios', 5, 700000), (2, N'Toyota', N'Innova', 7, 1000000), (3, N'Honda', N'City', 5, 750000),
 (4, N'Hyundai', N'Accent', 5, 650000), (5, N'Kia', N'Carnival', 7, 1400000), (6, N'VinFast', N'VF8', 5, 1200000),
 (7, N'Hyundai', N'Creta', 5, 800000);
INSERT INTO Cars (CarID, PlateNo, ModelID, BranchID, MadeYear, Status) VALUES
 (1, '29A-123.45', 1, 1, 2021, N'Available'), (2, '29A-678.90', 2, 1, 2022, N'Rented'),
 (3, '30F-111.22', 1, 2, 2020, N'Available'), (4, '30F-333.44', 3, 2, 2023, N'Available'),
 (5, '51H-555.66', 1, 3, 2019, N'Maintenance'), (6, '51H-777.88', 5, 3, 2024, N'Available'),
 (7, '51H-999.00', 6, 3, 2025, N'Rented'), (8, '43A-246.80', 4, 4, 2021, N'Available'),
 (9, '43A-135.79', 2, 4, 2022, N'Available'), (10, '30G-864.20', 6, 2, 2025, N'Available'),
 (11, '29A-202.02', 4, 1, 2018, N'Available'), (12, '51K-121.21', 3, 3, 2022, N'Available'),
 (13, '43B-777.77', 7, 4, 2024, N'Available');
INSERT INTO Customers (CustomerID, FullName, Email, City, JoinDate) VALUES
 (1, N'Nguyễn Minh Khoa', N'khoa.nm@fpt.edu.vn', N'Hà Nội', '2024-03-10'),
 (2, N'Trần Thu Hà', N'ha.tt@gmail.com', N'Hà Nội', '2025-01-15'),
 (3, N'Lê Quốc Anh', N'ANH.LQ@FPT.EDU.VN', N'Hồ Chí Minh', '2025-02-20'),
 (4, N'Phạm Gia Bảo', N'bao.pg@yahoo.com', N'Hồ Chí Minh', '2024-07-01'),
 (5, N'Võ Thị Lan', N'lan.vt@fpt.edu.vn', N'Đà Nẵng', '2025-05-05'),
 (6, N'Đỗ Hoàng Nam', N'nam.dh@outlook.com', N'Đà Nẵng', '2023-11-11'),
 (7, N'Bùi Khánh Linh', N'linh.bk@fpt.edu.vn.example.com', N'Hà Nội', '2025-08-18'),
 (8, N'Hoàng Anh Tú', N'tu.ha@gmail.com', N'Hồ Chí Minh', '2025-12-31'),
 (9, N'Mai Phương Thảo', N'thao.mp@fpt.edu.vn', N'Hà Nội', '2026-01-01'),
 (10, N'Đặng Văn Hùng', N'hung.dv@gmail.com', N'Đà Nẵng', '2025-06-30');
INSERT INTO Rentals (RentalID, CarID, CustomerID, PickupBranchID, PickupDate, ReturnDate, TotalAmount) VALUES
 (1, 1, 1, 1, '2024-04-01', '2024-04-04', 2100000), (2, 3, 1, 2, '2024-06-10', '2024-06-12', 1400000),
 (3, 2, 2, 1, '2025-02-01', '2025-02-05', 4000000), (4, 1, 2, 1, '2025-03-15', '2025-03-16', 700000),
 (5, 5, 3, 3, '2025-03-01', '2025-03-08', 4900000), (6, 6, 4, 3, '2024-09-09', '2024-09-12', 4200000),
 (7, 8, 5, 4, '2025-06-01', '2025-06-03', 1300000), (8, 9, 6, 4, '2024-01-20', '2024-01-25', 5000000),
 (9, 1, 3, 1, '2025-07-07', '2025-07-09', 1400000), (10, 4, 2, 2, '2025-09-01', '2025-09-04', 2250000),
 (11, 7, 3, 3, '2026-01-10', NULL, NULL), (12, 2, 9, 1, '2026-02-01', NULL, NULL),
 (13, 1, 4, 1, '2025-10-10', '2025-10-12', 800000), (14, 3, 7, 2, '2025-11-01', '2025-11-03', 1400000),
 (15, 6, 3, 3, '2025-12-20', '2025-12-25', 7000000), (16, 8, 10, 4, '2025-08-08', '2025-08-10', 1300000),
 (17, 9, 5, 4, '2026-03-03', '2026-03-06', 3000000), (18, 12, 8, 3, '2026-01-05', '2026-01-06', 750000),
 (19, 10, 1, 2, '2026-02-14', '2026-02-16', 2400000), (20, 3, 2, 2, '2026-04-01', '2026-04-02', 700000),
 (21, 13, 6, 4, '2025-04-04', '2025-04-06', 1600000), (22, 13, 10, 4, '2026-05-01', '2026-05-02', 800000),
 (23, 8, 5, 4, '2026-06-01', '2026-06-02', 650000), (24, 2, 6, 1, '2024-12-01', '2024-12-03', 2000000),
 (25, 13, 9, 4, '2025-09-09', '2025-09-10', 800000);`;

/** Kiểm ẩn: thêm khách/xe/lượt thuê — đổi người thắng ở Q6/Q7, thêm dòng biên ở Q2/Q4. */
const THEM = `INSERT INTO Customers (CustomerID, FullName, Email, City, JoinDate) VALUES
 (11, N'Kiều Minh Tâm', N'tam.km@FPT.edu.vn', N'Đà Nẵng', '2025-12-31'),
 (12, N'Lò Thị Mai', N'mai.lt@fpt.edu.vn.vn', N'Hồ Chí Minh', '2024-12-31');
INSERT INTO Cars (CarID, PlateNo, ModelID, BranchID, MadeYear, Status) VALUES (14, '43C-999.99', 3, 4, 2025, N'Available');
INSERT INTO Rentals (RentalID, CarID, CustomerID, PickupBranchID, PickupDate, ReturnDate, TotalAmount) VALUES
 (31, 14, 11, 4, '2025-12-31', '2026-01-02', 9000000), (32, 4, 11, 4, '2026-01-10', '2026-01-11', 750000),
 (33, 12, 11, 3, '2026-02-01', '2026-02-03', 1500000), (34, 4, 1, 2, '2026-03-01', NULL, NULL),
 (35, 14, 5, 4, '2026-07-01', '2026-07-02', 750000)`;

const ERD = `
 ┌──────────────────────────────┐            ┌──────────────────────────┐
 │ Doctor                        │            │ Patient                   │
 │  DoctorID   INT  (key)        │            │  PatientID  INT  (key)    │
 │  FullName   VARCHAR(50)       │ ──< Treats >──  FullName   VARCHAR(50) │
 │  Specialty  VARCHAR(50)       │   (M : N)  │  BirthDate  DATE          │
 │ {Phone}     VARCHAR(15)       │            └──────────────────────────┘
 └──────────────────────────────┘
   {Phone} = multi-valued attribute
   Treats attributes: VisitDate DATE (part of the key — a doctor may treat the same patient on many days),
                      Diagnosis VARCHAR(200)`;

const Q1_CHECK_COT = "SELECT lower(table_name) AS tbl, lower(column_name) AS col, lower(data_type) AS type FROM information_schema.columns WHERE lower(table_name) IN ('doctor', 'doctorphone', 'patient', 'treats') ORDER BY lower(table_name), ordinal_position";

export default doiDau({
  slug: 'dbi202-9-pe-1-ct-rent',
  ten: 'PE 1 — CT Rent (car rental) · 10 questions',
  khoa: KHOA,
  baiHoc: 'dbi202-on-pe',
  de: [
    deLonSql({
      dangBai: 'pe',
      tieuDe: 'PE 1 — CT Rent car-rental database (practice paper)',
      doKho: 'HARD', phut: 85, diem: 100,
      khaiNiem: ['ERD → tables', 'LIKE', 'joins', 'outer join', 'COUNT DISTINCT', 'maximum per group', 'double maximum', 'VIEW', 'UPDATE with subquery', 'INSERT … SELECT'],
      tienQuyet: ['the whole 6.x part of this track'],
      the: ['dbi202', 'pe', 'sql', 'exam-practice'],
      csdl: DB, tenCsdl: 'DBscript',
      thuMuc: 'RollNo_Name_DBI202_PE1',
      phu: { en: 'DBI202 · Practical Exam practice · 85 minutes · 10 questions × 1 mark · format of the SP26 papers', vi: 'DBI202 · Luyện thi thực hành · 85 phút · 10 câu × 1 điểm · theo dạng đề SP26' },
      moTa: {
        en: `<p>CT Rent is a self-drive car-rental company with branches in Hà Nội, Hồ Chí Minh and Đà Nẵng. Its database (script <code>DBscript.sql</code>) stores branches, car models, cars, customers and rentals. Question 1 is independent: build tables from the ERD below. Questions 2–10 use the CT Rent database.</p>
<p><b>ERD for Question 1</b></p><pre>${ERD.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<p>⚠ The real SP26 papers ask for a <b>function</b>, a <b>trigger</b> or a <b>procedure</b> in Q8–Q9 (T-SQL). This in-browser grader runs PostgreSQL, so here Q8 is a <b>VIEW</b> and Q9 an <b>UPDATE</b>; practise the T-SQL questions on the real papers in the Exam Room (a SQL Server grader is coming).</p>`,
        vi: `<p>CT Rent là công ty cho thuê xe tự lái, có chi nhánh ở Hà Nội, Hồ Chí Minh và Đà Nẵng. CSDL (script <code>DBscript.sql</code>) lưu chi nhánh, mẫu xe, xe, khách hàng và lượt thuê. Câu 1 độc lập: dựng bảng từ ERD bên dưới. Câu 2–10 dùng CSDL CT Rent.</p>
<p><b>ERD cho Câu 1</b></p><pre>${ERD.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<p>⚠ Đề SP26 thật hỏi <b>function</b>, <b>trigger</b> hoặc <b>procedure</b> ở Q8–Q9 (T-SQL). Máy chấm trình duyệt chạy PostgreSQL nên ở đây Q8 là <b>VIEW</b>, Q9 là <b>UPDATE</b>; luyện câu T-SQL trên đề thật ở Phòng thi (máy chấm SQL Server sắp có).</p>`,
      },
      yeuCauChung: [
        { en: 'One file per question (Q1.sql … Q10.sql) containing ONLY the statement(s) that answer it — no USE, no GO, no test commands (same rule as the real PE).', vi: 'Mỗi câu một tệp (Q1.sql … Q10.sql) CHỈ chứa (các) lệnh trả lời câu đó — không USE, không GO, không lệnh chạy thử (như PE thật).' },
        { en: 'Column names/aliases and order exactly as asked. Row order matters only when the question says "order by".', vi: 'Tên cột/bí danh và thứ tự cột đúng như đề. Thứ tự dòng chỉ quan trọng khi đề ghi "sắp theo".' },
        { en: 'Portable SQL only (SQL Server + PostgreSQL): no TOP/LIMIT, ISNULL, YEAR(), GETDATE(), ILIKE, ::. Use COALESCE, date ranges, OFFSET … FETCH.', vi: 'Chỉ SQL chạy cả hai hệ: không TOP/LIMIT, ISNULL, YEAR(), GETDATE(), ILIKE, ::. Dùng COALESCE, khoảng ngày, OFFSET … FETCH.' },
        { en: 'Q1 types: INT for ids, VARCHAR(50) for names/specialty, VARCHAR(15) for phone, DATE, VARCHAR(200) for diagnosis (the real PE would use NVARCHAR).', vi: 'Kiểu ở Q1: INT cho mã, VARCHAR(50) cho tên/chuyên khoa, VARCHAR(15) cho số điện thoại, DATE, VARCHAR(200) cho chẩn đoán (PE thật dùng NVARCHAR).' },
      ],
      moHinh: [
        { ten: 'Branches', truong: [['BranchID', 'INT', 'PK'], ['BranchName', 'NVARCHAR(50)', ''], ['City', 'NVARCHAR(30)', '']] },
        { ten: 'CarModels', truong: [['ModelID', 'INT', 'PK'], ['Brand', 'NVARCHAR(30)', 'Toyota, Honda, Hyundai…'], ['ModelName', 'NVARCHAR(50)', ''], ['Seats', 'INT', ''], ['DailyRate', 'DECIMAL(10,2)', 'VND per day']] },
        { ten: 'Cars', truong: [['CarID', 'INT', 'PK'], ['PlateNo', 'VARCHAR(15)', 'UNIQUE'], ['ModelID', 'INT', 'FK → CarModels'], ['BranchID', 'INT', 'FK → Branches (where the car is now)'], ['MadeYear', 'INT', ''], ['Status', 'NVARCHAR(15)', "'Available' / 'Rented' / 'Maintenance'"]] },
        { ten: 'Customers', truong: [['CustomerID', 'INT', 'PK'], ['FullName', 'NVARCHAR(50)', ''], ['Email', 'NVARCHAR(100)', ''], ['City', 'NVARCHAR(30)', ''], ['JoinDate', 'DATE', '']] },
        { ten: 'Rentals', truong: [['RentalID', 'INT', 'PK'], ['CarID', 'INT', 'FK → Cars'], ['CustomerID', 'INT', 'FK → Customers'], ['PickupBranchID', 'INT', 'FK → Branches'], ['PickupDate', 'DATE', ''], ['ReturnDate', 'DATE', 'NULL = not returned yet'], ['TotalAmount', 'DECIMAL(12,2)', 'NULL until returned']] },
        { ten: 'LoyalCustomers', truong: [['CustomerID', 'INT', 'PK, FK → Customers'], ['FullName', 'NVARCHAR(50)', ''], ['TotalSpent', 'DECIMAL(14,2)', 'empty table — filled in Q10']] },
      ],
      cau: [
        {
          ten: { en: 'Create the tables of the ERD', vi: 'Tạo các bảng từ ERD' }, diem: 1,
          moTa: { en: 'Write the CREATE TABLE statements for every table derived from the ERD above (Doctor, DoctorPhone, Patient, Treats) with primary and foreign keys. Keep the names of the ERD; the multi-valued attribute table is named DoctorPhone; the relationship table is named Treats.', vi: 'Viết các lệnh CREATE TABLE cho mọi bảng suy ra từ ERD trên (Doctor, DoctorPhone, Patient, Treats) kèm khoá chính, khoá ngoại. Giữ đúng tên trong ERD; bảng thuộc tính đa trị tên DoctorPhone; bảng liên kết tên Treats.' },
          yeuCau: [
            { en: 'Doctor(DoctorID, FullName, Specialty) · DoctorPhone(DoctorID, Phone) · Patient(PatientID, FullName, BirthDate) · Treats(DoctorID, PatientID, VisitDate, Diagnosis) — columns in this order.', vi: 'Doctor(DoctorID, FullName, Specialty) · DoctorPhone(DoctorID, Phone) · Patient(PatientID, FullName, BirthDate) · Treats(DoctorID, PatientID, VisitDate, Diagnosis) — cột đúng thứ tự này.' },
            { en: 'Keys: DoctorPhone (DoctorID, Phone); Treats (DoctorID, PatientID, VisitDate); every reference is a FOREIGN KEY.', vi: 'Khoá: DoctorPhone (DoctorID, Phone); Treats (DoctorID, PatientID, VisitDate); mọi tham chiếu là FOREIGN KEY.' },
          ],
          giai: `CREATE TABLE Doctor (
    DoctorID  INT         NOT NULL PRIMARY KEY,
    FullName  VARCHAR(50) NOT NULL,
    Specialty VARCHAR(50) NULL
);
CREATE TABLE DoctorPhone (                       -- multi-valued attribute ⇒ its own table
    DoctorID INT         NOT NULL REFERENCES Doctor (DoctorID),
    Phone    VARCHAR(15) NOT NULL,
    PRIMARY KEY (DoctorID, Phone)
);
CREATE TABLE Patient (
    PatientID INT         NOT NULL PRIMARY KEY,
    FullName  VARCHAR(50) NOT NULL,
    BirthDate DATE        NULL
);
CREATE TABLE Treats (                            -- M:N relationship with attributes
    DoctorID  INT          NOT NULL REFERENCES Doctor (DoctorID),
    PatientID INT          NOT NULL REFERENCES Patient (PatientID),
    VisitDate DATE         NOT NULL,
    Diagnosis VARCHAR(200) NULL,
    PRIMARY KEY (DoctorID, PatientID, VisitDate)
);`,
          kiem: [
            { ...sau('Q1 · tables and columns', Q1_CHECK_COT, { thuTu: true }), csdl: '' },
            { ...duoc('Q1 · valid rows in all four tables', "INSERT INTO Doctor (DoctorID, FullName, Specialty) VALUES (1, 'Dr. An', 'Cardiology'); INSERT INTO DoctorPhone (DoctorID, Phone) VALUES (1, '0901'), (1, '0902'); INSERT INTO Patient (PatientID, FullName, BirthDate) VALUES (7, 'Binh', '2000-01-01'); INSERT INTO Treats (DoctorID, PatientID, VisitDate, Diagnosis) VALUES (1, 7, '2026-01-02', 'flu'), (1, 7, '2026-02-02', 'check-up')"), csdl: '' },
            { ...chan('Q1 · same doctor, patient and day twice is rejected', "INSERT INTO Doctor (DoctorID, FullName) VALUES (1, 'A'); INSERT INTO Patient (PatientID, FullName) VALUES (7, 'B'); INSERT INTO Treats (DoctorID, PatientID, VisitDate) VALUES (1, 7, '2026-01-02'), (1, 7, '2026-01-02')", '23505'), csdl: '' },
            { ...chan('Q1 · a phone of an unknown doctor is rejected', "INSERT INTO DoctorPhone (DoctorID, Phone) VALUES (99, '0999')", '23503'), csdl: '', an: true },
            { ...chan('Q1 · a visit of an unknown patient is rejected', "INSERT INTO Doctor (DoctorID, FullName) VALUES (1, 'A'); INSERT INTO Treats (DoctorID, PatientID, VisitDate) VALUES (1, 99, '2026-01-02')", '23503'), csdl: '', an: true },
          ],
          saiMau: [
            'CREATE TABLE Doctor (DoctorID INT PRIMARY KEY, FullName VARCHAR(50), Specialty VARCHAR(50), Phone VARCHAR(15)); CREATE TABLE Patient (PatientID INT PRIMARY KEY, FullName VARCHAR(50), BirthDate DATE); CREATE TABLE Treats (DoctorID INT REFERENCES Doctor(DoctorID), PatientID INT REFERENCES Patient(PatientID), VisitDate DATE, Diagnosis VARCHAR(200), PRIMARY KEY (DoctorID, PatientID, VisitDate))',
            'CREATE TABLE Doctor (DoctorID INT PRIMARY KEY, FullName VARCHAR(50), Specialty VARCHAR(50)); CREATE TABLE DoctorPhone (DoctorID INT REFERENCES Doctor(DoctorID), Phone VARCHAR(15), PRIMARY KEY (DoctorID, Phone)); CREATE TABLE Patient (PatientID INT PRIMARY KEY, FullName VARCHAR(50), BirthDate DATE); CREATE TABLE Treats (DoctorID INT REFERENCES Doctor(DoctorID), PatientID INT REFERENCES Patient(PatientID), VisitDate DATE, Diagnosis VARCHAR(200), PRIMARY KEY (DoctorID, PatientID))',
          ],
        },
        {
          ten: { en: 'Customers with an FPT University email', vi: 'Khách hàng có email FPT University' }, diem: 1,
          moTa: { en: 'Customers whose email ends with "@fpt.edu.vn" (not case-sensitive).', vi: 'Khách hàng có email kết thúc bằng "@fpt.edu.vn" (không phân biệt hoa thường).' },
          yeuCau: [{ en: 'Columns: <code>CustomerID, FullName, Email</code>. Any row order.', vi: 'Cột: <code>CustomerID, FullName, Email</code>. Thứ tự dòng tuỳ ý.' }],
          giai: `SELECT CustomerID, FullName, Email
FROM Customers
WHERE LOWER(Email) LIKE '%@fpt.edu.vn';   -- LOWER makes it case-insensitive on ANY collation`,
          kiem: [kq('Q2 · FPT emails'), kqAn('Q2 · more emails (upper case, look-alike domains)', THEM)],
          saiMau: ["SELECT CustomerID, FullName, Email FROM Customers WHERE Email LIKE '%fpt.edu.vn%'"],
        },
        {
          ten: { en: 'Toyota cars at Hà Nội branches', vi: 'Xe Toyota ở chi nhánh Hà Nội' }, diem: 1,
          moTa: { en: 'All cars of brand Toyota that are located at a branch in the city Hà Nội.', vi: 'Mọi xe hãng Toyota đang ở chi nhánh thuộc thành phố Hà Nội.' },
          yeuCau: [{ en: 'Columns: <code>CarID, PlateNo, ModelName, BranchName</code>; order by CarID.', vi: 'Cột: <code>CarID, PlateNo, ModelName, BranchName</code>; sắp theo CarID.' }],
          giai: `SELECT c.CarID, c.PlateNo, m.ModelName, b.BranchName
FROM Cars c
JOIN CarModels m ON m.ModelID = c.ModelID
JOIN Branches  b ON b.BranchID = c.BranchID
WHERE m.Brand = N'Toyota' AND b.City = N'Hà Nội'
ORDER BY c.CarID;`,
          kiem: [kq('Q3 · Toyota in Hà Nội', { thuTu: true }), kqAn('Q3 · after a new car', THEM + "; INSERT INTO Cars (CarID, PlateNo, ModelID, BranchID, MadeYear, Status) VALUES (15, '30K-000.15', 2, 2, 2026, N'Available')", { thuTu: true })],
          saiMau: ["SELECT c.CarID, c.PlateNo, m.ModelName, b.BranchName FROM Cars c JOIN CarModels m ON m.ModelID = c.ModelID JOIN Branches b ON b.BranchID = c.BranchID WHERE m.Brand = N'Toyota' AND b.BranchID = 1 ORDER BY c.CarID"],
        },
        {
          ten: { en: '2025 members and their 2025 rentals', vi: 'Khách gia nhập 2025 và các lượt thuê năm 2025' }, diem: 1,
          moTa: { en: 'All customers who joined in 2025, together with their rentals picked up in 2025. Customers without a 2025 rental must still appear (rental columns NULL).', vi: 'Mọi khách gia nhập năm 2025, kèm các lượt thuê nhận xe trong năm 2025. Khách không có lượt thuê 2025 vẫn phải hiện (cột lượt thuê NULL).' },
          yeuCau: [{ en: 'Columns: <code>CustomerID, FullName, JoinDate, RentalID, PickupDate</code>; order by CustomerID, then RentalID.', vi: 'Cột: <code>CustomerID, FullName, JoinDate, RentalID, PickupDate</code>; sắp theo CustomerID rồi RentalID.' }],
          giai: `SELECT cu.CustomerID, cu.FullName, cu.JoinDate, r.RentalID, r.PickupDate
FROM Customers cu
LEFT JOIN Rentals r
       ON r.CustomerID = cu.CustomerID
      AND r.PickupDate >= '2025-01-01' AND r.PickupDate < '2026-01-01'   -- filter of the optional side ⇒ in ON
WHERE cu.JoinDate >= '2025-01-01' AND cu.JoinDate < '2026-01-01'
ORDER BY cu.CustomerID, r.RentalID;`,
          kiem: [kq('Q4 · 2025 members with 2025 rentals', { thuTu: true }), kqAn('Q4 · boundary dates', THEM, { thuTu: true })],
          saiMau: ["SELECT cu.CustomerID, cu.FullName, cu.JoinDate, r.RentalID, r.PickupDate FROM Customers cu LEFT JOIN Rentals r ON r.CustomerID = cu.CustomerID WHERE cu.JoinDate >= '2025-01-01' AND cu.JoinDate < '2026-01-01' AND r.PickupDate >= '2025-01-01' AND r.PickupDate < '2026-01-01' ORDER BY cu.CustomerID, r.RentalID"],
        },
        {
          ten: { en: 'Cars and customers per branch', vi: 'Số xe và số khách mỗi chi nhánh' }, diem: 1,
          moTa: { en: 'For every branch: the number of cars currently located there and the number of different customers who picked up a car there.', vi: 'Với mọi chi nhánh: số xe đang đặt tại đó và số khách hàng khác nhau đã nhận xe tại đó.' },
          yeuCau: [{ en: 'Columns: <code>BranchID, BranchName, NumCars, NumCustomers</code>; order by BranchID.', vi: 'Cột: <code>BranchID, BranchName, NumCars, NumCustomers</code>; sắp theo BranchID.' }],
          giai: `SELECT b.BranchID, b.BranchName,
       COUNT(DISTINCT c.CarID)      AS NumCars,        -- two LEFT JOINs multiply rows ⇒ DISTINCT
       COUNT(DISTINCT r.CustomerID) AS NumCustomers
FROM Branches b
LEFT JOIN Cars    c ON c.BranchID = b.BranchID
LEFT JOIN Rentals r ON r.PickupBranchID = b.BranchID
GROUP BY b.BranchID, b.BranchName
ORDER BY b.BranchID;`,
          kiem: [kq('Q5 · per branch', { thuTu: true }), kqAn('Q5 · after new rentals', THEM, { thuTu: true })],
          saiMau: ['SELECT b.BranchID, b.BranchName, COUNT(c.CarID) AS NumCars, COUNT(r.CustomerID) AS NumCustomers FROM Branches b LEFT JOIN Cars c ON c.BranchID = b.BranchID LEFT JOIN Rentals r ON r.PickupBranchID = b.BranchID GROUP BY b.BranchID, b.BranchName ORDER BY b.BranchID'],
        },
        {
          ten: { en: 'Most rented model of each brand', vi: 'Mẫu xe được thuê nhiều nhất của mỗi hãng' }, diem: 1,
          moTa: { en: 'For each brand, the model(s) with the highest number of rentals among the models of that brand (all of them on a tie). Models never rented count 0.', vi: 'Với mỗi hãng, (các) mẫu xe có số lượt thuê cao nhất trong các mẫu của hãng đó (hoà thì hiện hết). Mẫu chưa từng được thuê tính 0.' },
          yeuCau: [{ en: 'Columns: <code>Brand, ModelName, NumRentals</code>; order by Brand, then ModelName.', vi: 'Cột: <code>Brand, ModelName, NumRentals</code>; sắp theo Brand rồi ModelName.' }],
          giai: `WITH ModelRentals AS (
    SELECT m.ModelID, m.Brand, m.ModelName, COUNT(r.RentalID) AS NumRentals
    FROM CarModels m
    LEFT JOIN Cars    c ON c.ModelID = m.ModelID
    LEFT JOIN Rentals r ON r.CarID = c.CarID
    GROUP BY m.ModelID, m.Brand, m.ModelName
)
SELECT a.Brand, a.ModelName, a.NumRentals
FROM ModelRentals a
WHERE a.NumRentals = (SELECT MAX(b.NumRentals) FROM ModelRentals b WHERE b.Brand = a.Brand)
ORDER BY a.Brand, a.ModelName;`,
          kiem: [kq('Q6 · top model per brand', { thuTu: true }), kqAn('Q6 · with new rentals', THEM, { thuTu: true })],
          saiMau: ['SELECT m.Brand, MAX(m.ModelName) AS ModelName, COUNT(r.RentalID) AS NumRentals FROM CarModels m JOIN Cars c ON c.ModelID = m.ModelID JOIN Rentals r ON r.CarID = c.CarID GROUP BY m.Brand ORDER BY m.Brand, ModelName'],
        },
        {
          ten: { en: 'Top customers of each city — by money AND by number of rentals', vi: 'Khách hàng đứng đầu mỗi thành phố — theo tiền VÀ theo số lượt' }, diem: 1,
          moTa: { en: 'For each city, the customer(s) who have the highest total amount spent among customers of that city <b>and also</b> the highest number of rentals among customers of that city. Total spent ignores open rentals (TotalAmount NULL).', vi: 'Với mỗi thành phố, (các) khách có tổng tiền chi cao nhất trong số khách của thành phố đó <b>và đồng thời</b> có số lượt thuê nhiều nhất trong số khách của thành phố đó. Tổng tiền bỏ qua lượt chưa trả xe (TotalAmount NULL).' },
          yeuCau: [{ en: 'Columns: <code>City, CustomerID, FullName, TotalSpent, NumRentals</code>; order by CustomerID.', vi: 'Cột: <code>City, CustomerID, FullName, TotalSpent, NumRentals</code>; sắp theo CustomerID.' }],
          giai: `WITH Stats AS (
    SELECT cu.City, cu.CustomerID, cu.FullName,
           COALESCE(SUM(r.TotalAmount), 0) AS TotalSpent,
           COUNT(r.RentalID)               AS NumRentals
    FROM Customers cu
    LEFT JOIN Rentals r ON r.CustomerID = cu.CustomerID
    GROUP BY cu.City, cu.CustomerID, cu.FullName
)
SELECT s.City, s.CustomerID, s.FullName, s.TotalSpent, s.NumRentals
FROM Stats s
WHERE s.TotalSpent = (SELECT MAX(x.TotalSpent) FROM Stats x WHERE x.City = s.City)
  AND s.NumRentals = (SELECT MAX(x.NumRentals) FROM Stats x WHERE x.City = s.City)
ORDER BY s.CustomerID;`,
          kiem: [kq('Q7 · double maximum per city', { thuTu: true }), kqAn('Q7 · with a new big spender', THEM, { thuTu: true })],
          saiMau: ['WITH Stats AS (SELECT cu.City, cu.CustomerID, cu.FullName, COALESCE(SUM(r.TotalAmount), 0) AS TotalSpent, COUNT(r.RentalID) AS NumRentals FROM Customers cu LEFT JOIN Rentals r ON r.CustomerID = cu.CustomerID GROUP BY cu.City, cu.CustomerID, cu.FullName) SELECT s.City, s.CustomerID, s.FullName, s.TotalSpent, s.NumRentals FROM Stats s WHERE s.TotalSpent = (SELECT MAX(x.TotalSpent) FROM Stats x WHERE x.City = s.City) ORDER BY s.CustomerID'],
        },
        {
          ten: { en: 'View of open rentals', vi: 'View các lượt thuê chưa trả xe' }, diem: 1,
          moTa: { en: 'Create a view named <code>vwOpenRentals</code> listing every rental whose car has not been returned yet, with the plate number and the customer\'s name.', vi: 'Tạo view tên <code>vwOpenRentals</code> liệt kê mọi lượt thuê chưa trả xe, kèm biển số và tên khách.' },
          yeuCau: [{ en: 'View columns: <code>RentalID, PlateNo, FullName, PickupDate</code>. No ORDER BY inside the view.', vi: 'Cột của view: <code>RentalID, PlateNo, FullName, PickupDate</code>. Không ORDER BY trong view.' }],
          giai: `CREATE VIEW vwOpenRentals AS
SELECT r.RentalID, c.PlateNo, cu.FullName, r.PickupDate
FROM Rentals r
JOIN Cars      c  ON c.CarID = r.CarID
JOIN Customers cu ON cu.CustomerID = r.CustomerID
WHERE r.ReturnDate IS NULL;`,
          kiem: [sau('Q8 · SELECT * FROM vwOpenRentals', 'SELECT * FROM vwOpenRentals'), sau('Q8 · the view follows new data', 'SELECT * FROM vwOpenRentals', { an: true, themCsdl: THEM })],
          saiMau: ['CREATE VIEW vwOpenRentals AS SELECT r.RentalID, c.PlateNo, cu.FullName, r.PickupDate FROM Rentals r JOIN Cars c ON c.CarID = r.CarID JOIN Customers cu ON cu.CustomerID = r.CustomerID WHERE r.TotalAmount = NULL'],
        },
        {
          ten: { en: 'Send heavily used cars to maintenance', vi: 'Đưa xe chạy nhiều đi bảo dưỡng' }, diem: 1,
          moTa: { en: 'Set Status to <b>Maintenance</b> for every car that has been rented <b>at least 3 times</b> and whose current status is <b>Available</b>.', vi: 'Đặt Status = <b>Maintenance</b> cho mọi xe đã được thuê <b>ít nhất 3 lần</b> và đang ở trạng thái <b>Available</b>.' },
          yeuCau: [{ en: 'One UPDATE statement using a subquery (no UPDATE … FROM). Cars that are Rented must keep their status.', vi: 'Một lệnh UPDATE dùng truy vấn con (không UPDATE … FROM). Xe đang Rented phải giữ trạng thái.' }],
          giai: `UPDATE Cars
SET Status = N'Maintenance'
WHERE Status = N'Available'
  AND CarID IN (SELECT CarID FROM Rentals GROUP BY CarID HAVING COUNT(*) >= 3);`,
          kiem: [sau('Q9 · status of every car', 'SELECT CarID, Status FROM Cars ORDER BY CarID', { thuTu: true }), sau('Q9 · with new rentals', 'SELECT CarID, Status FROM Cars ORDER BY CarID', { thuTu: true, an: true, themCsdl: THEM })],
          saiMau: ["UPDATE Cars SET Status = N'Maintenance' WHERE CarID IN (SELECT CarID FROM Rentals GROUP BY CarID HAVING COUNT(*) >= 3)", "UPDATE Cars SET Status = N'Maintenance' WHERE Status = N'Available' AND CarID IN (SELECT CarID FROM Rentals GROUP BY CarID HAVING COUNT(*) > 3)"],
        },
        {
          ten: { en: 'Fill the loyalty table', vi: 'Điền bảng khách thân thiết' }, diem: 1,
          moTa: { en: 'Insert into <code>LoyalCustomers</code> every customer whose total amount over <b>returned</b> rentals is greater than 5,000,000, with that total.', vi: 'Chèn vào <code>LoyalCustomers</code> mọi khách có tổng tiền các lượt thuê <b>đã trả xe</b> lớn hơn 5.000.000, kèm tổng đó.' },
          yeuCau: [{ en: 'One INSERT INTO LoyalCustomers (CustomerID, FullName, TotalSpent) SELECT … statement.', vi: 'Một lệnh INSERT INTO LoyalCustomers (CustomerID, FullName, TotalSpent) SELECT ….' }],
          giai: `INSERT INTO LoyalCustomers (CustomerID, FullName, TotalSpent)
SELECT cu.CustomerID, cu.FullName, SUM(r.TotalAmount)
FROM Customers cu
JOIN Rentals r ON r.CustomerID = cu.CustomerID
WHERE r.ReturnDate IS NOT NULL
GROUP BY cu.CustomerID, cu.FullName
HAVING SUM(r.TotalAmount) > 5000000;`,
          kiem: [sau('Q10 · LoyalCustomers content', 'SELECT CustomerID, FullName, TotalSpent FROM LoyalCustomers'), sau('Q10 · with new rentals', 'SELECT CustomerID, FullName, TotalSpent FROM LoyalCustomers', { an: true, themCsdl: THEM })],
          saiMau: ['INSERT INTO LoyalCustomers (CustomerID, FullName, TotalSpent) SELECT cu.CustomerID, cu.FullName, SUM(r.TotalAmount) FROM Customers cu JOIN Rentals r ON r.CustomerID = cu.CustomerID GROUP BY cu.CustomerID, cu.FullName HAVING SUM(r.TotalAmount) >= 5000000'],
        },
      ],
      truDiem: [
        { en: 'A file that contains test commands, USE or GO — 0 for that question on the real PE.', vi: 'Tệp có lệnh chạy thử, USE hay GO — câu đó 0 điểm ở PE thật.' },
        { en: 'Filtering the optional side of an outer join in WHERE (Q4) — the "even if" rows disappear.', vi: 'Lọc phía tuỳ chọn của outer join ở WHERE (Q4) — mất các dòng "kể cả khi".' },
        { en: 'COUNT without DISTINCT after two LEFT JOINs (Q5) — counts are multiplied.', vi: 'COUNT không DISTINCT sau hai LEFT JOIN (Q5) — số đếm bị nhân lên.' },
        { en: 'TOP 1 / FETCH 1 ROW for "the highest" (Q6, Q7) — ties are lost.', vi: 'TOP 1 / FETCH 1 ROW cho "cao nhất" (Q6, Q7) — mất dòng hoà.' },
      ],
      nopBai: {
        en: 'Q1–Q10 tabs = Q1.sql … Q10.sql. <b>Run</b> = sample checks, <b>Submit</b> = all checks incl. hidden ones (modified data) and the 10-mark score table. Run DBscript.sql in SSMS to rehearse on real SQL Server.',
        vi: 'Tab Q1–Q10 = Q1.sql … Q10.sql. <b>Chạy thử</b> = kiểm mẫu, <b>Nộp</b> = mọi kiểm kể cả kiểm ẩn (đổi dữ liệu) và bảng điểm thang 10. Chạy DBscript.sql trong SSMS để tập trên SQL Server thật.',
      },
      thuatNgu: [
        { en: 'multi-valued attribute', vi: 'thuộc tính đa trị (⇒ bảng riêng)' },
        { en: 'M:N relationship', vi: 'liên kết nhiều-nhiều (⇒ bảng liên kết)' },
        TN.leftJoin, { en: 'COUNT(DISTINCT x)', vi: 'đếm giá trị khác nhau' }, TN.having, TN.view,
        { en: 'CTE (WITH … AS)', vi: 'bảng tạm đặt tên trong một câu truy vấn' },
      ],
      goiY: [
        'Phân bổ 85 phút: Q1–Q4 ~ 25 phút, Q5–Q7 ~ 35 phút, Q8–Q10 ~ 15 phút, còn lại soát lỗi.',
        'Q5: hai LEFT JOIN cùng lúc nhân dòng (xe × lượt thuê) ⇒ COUNT(DISTINCT …). Q6/Q7: tính số liệu trong một CTE rồi so với MAX của cùng nhóm.',
        'Q8–Q10: chạy thử SELECT bên trong trước, đúng dòng rồi mới bọc CREATE VIEW / UPDATE / INSERT.',
      ],
      loiHayGap: [
        { en: 'Q2 with LIKE \'%fpt.edu.vn%\' — also matches look-alike domains such as "…@fpt.edu.vn.example.com".', vi: 'Q2 dùng LIKE \'%fpt.edu.vn%\' — dính cả tên miền giả như "…@fpt.edu.vn.example.com".' },
        { en: 'Q7 checking only the money maximum — Đà Nẵng\'s top spender is not the customer with the most rentals.', vi: 'Q7 chỉ xét tiền lớn nhất — người chi nhiều nhất Đà Nẵng không phải người thuê nhiều lượt nhất.' },
        { en: 'Q9 without the Status = \'Available\' filter — a car that is out on rent gets sent to maintenance.', vi: 'Q9 thiếu điều kiện Status = \'Available\' — xe đang cho thuê cũng bị đưa đi bảo dưỡng.' },
        { en: 'Q10 including open rentals (TotalAmount NULL is ignored by SUM, but the rule says "returned" — write it).', vi: 'Q10 tính cả lượt chưa trả xe (SUM bỏ qua NULL, nhưng đề ghi "đã trả xe" — hãy viết rõ).' },
      ],
      giaiThich: { en: '<p>Every reference answer is standard SQL that runs unchanged on SQL Server 2019+ and PostgreSQL. Each file is graded on a fresh copy of the database and again on a modified copy (hidden checks), exactly like an examiner re-running your script on new data.</p>', vi: '<p>Mọi lời giải mẫu là SQL chuẩn chạy nguyên văn trên SQL Server 2019+ và PostgreSQL. Mỗi tệp được chấm trên một bản CSDL mới và lần nữa trên bản đã đổi dữ liệu (kiểm ẩn) — giống giám khảo chạy lại script của bạn trên dữ liệu mới.</p>' },
    }),
  ],
});
