/**
 * DBI202 · ⭐ CS.5 — sáu bài kiểu phỏng vấn: xếp hạng trong phòng + tỉ lệ quỹ lương, tháng tăng trưởng (LAG), số người dưới mỗi quản
 * lý (CTE đệ quy, PostgreSQL thật), người làm nhiều giờ nhất mỗi dự án (có hoà), chuỗi đi học dài nhất (đảo), đồng bộ bảng giá bằng
 * MERGE an toàn khi chạy song song (SQL Server).
 */
import { mod, de, dePg, kq, kqAn, ma, tsql, ck, tn } from './_chung.mjs';
import { FUH_PG, LUOC_DO_FUH } from './_fuh.mjs';

const DT = `CREATE TABLE DoanhThu (
  thang DATE          NOT NULL PRIMARY KEY,
  tien  DECIMAL(12,0) NOT NULL
);
INSERT INTO DoanhThu (thang, tien) VALUES
  ('2025-01-01', 100), ('2025-02-01', 120), ('2025-03-01', 110), ('2025-04-01', 150),
  ('2025-05-01', 150), ('2025-06-01', 170), ('2025-07-01', 160), ('2025-08-01', 200);`;
const DD = `CREATE TABLE DiemDanh (
  sv   VARCHAR(10) NOT NULL,
  buoi INT         NOT NULL,
  CONSTRAINT pk_diemdanh PRIMARY KEY (sv, buoi)
);
INSERT INTO DiemDanh (sv, buoi) VALUES
  ('SV01', 1), ('SV01', 2), ('SV01', 3), ('SV01', 5), ('SV01', 6), ('SV01', 7), ('SV01', 8), ('SV01', 10),
  ('SV02', 2), ('SV02', 3), ('SV02', 5), ('SV02', 6), ('SV02', 9),
  ('SV03', 4);`;

const BANG_GIA = `CREATE TABLE dbo.BangGia (
    maHang      VARCHAR(10)   NOT NULL CONSTRAINT pk_banggia PRIMARY KEY,
    tenHang     NVARCHAR(50)  NOT NULL,
    gia         DECIMAL(12,0) NOT NULL,
    ngayCapNhat DATE          NOT NULL
);
CREATE TABLE dbo.GiaMoi (
    maHang  VARCHAR(10)   NOT NULL PRIMARY KEY,
    tenHang NVARCHAR(50)  NOT NULL,
    gia     DECIMAL(12,0) NOT NULL
);
INSERT INTO dbo.BangGia VALUES ('BUT', N'Bút bi', 5000, '2026-01-01'), ('VO', N'Vở', 12000, '2026-01-01'),
                               ('THUOC', N'Thước', 8000, '2026-01-01'), ('TAY', N'Tẩy', 3000, '2026-01-01');
INSERT INTO dbo.GiaMoi VALUES ('BUT', N'Bút bi', 5000), ('VO', N'Vở', 13000), ('THUOC', N'Thước', 7500), ('KEO', N'Keo dán', 6000);`;

const GIAI_MERGE = `CREATE OR ALTER PROCEDURE dbo.prDongBoGia
AS
BEGIN
    SET NOCOUNT ON;
    MERGE dbo.BangGia WITH (HOLDLOCK) AS t        -- HOLDLOCK: the "not matched" check and the INSERT are one unit
    USING dbo.GiaMoi AS s
       ON t.maHang = s.maHang
    WHEN MATCHED AND t.gia <> s.gia THEN          -- only prices that really changed
        UPDATE SET gia = s.gia, ngayCapNhat = CAST(GETDATE() AS DATE)
    WHEN NOT MATCHED BY TARGET THEN               -- new items
        INSERT (maHang, tenHang, gia, ngayCapNhat) VALUES (s.maHang, s.tenHang, s.gia, CAST(GETDATE() AS DATE))
    -- no WHEN NOT MATCHED BY SOURCE: items the supplier did not mention are kept
    OUTPUT $action AS hanhDong, inserted.maHang, inserted.gia;   -- the report
END`;

const CHAY = `DECLARE @r TABLE (hanhDong NVARCHAR(10), maHang VARCHAR(10), gia DECIMAL(12,0));
INSERT INTO @r EXEC dbo.prDongBoGia;`;

export default mod('dbi202-cs5-on', '⭐ CS.5 Exercises: advanced SQL', [
  de({
    t: 'Exercise 1 — rank inside the department, gap to the top, share of payroll', k: 'MEDIUM', p: 12,
    kn: ['DENSE_RANK', 'MAX OVER', 'SUM OVER', 'percentage of total'], tag: ['advanced', 'window'],
    en: '<p>For every employee show <code>depNum, empName, empSalary</code>, <code>hang</code> = rank of the salary inside the department (equal salaries share a rank, no gaps), <code>kem_cao_nhat</code> = how much less than the department\'s best-paid person they earn, and <code>ty_le</code> = their share (%) of the department\'s payroll as <code>DECIMAL(5,2)</code>. Sort by depNum, hang, empSSN.</p>',
    vi: '<p>Với mỗi nhân viên hiện <code>depNum, empName, empSalary</code>, <code>hang</code> = hạng lương trong phòng (bằng nhau cùng hạng, không nhảy hạng), <code>kem_cao_nhat</code> = kém người lương cao nhất phòng bao nhiêu, và <code>ty_le</code> = phần trăm của họ trong quỹ lương phòng dạng <code>DECIMAL(5,2)</code>. Sắp theo depNum, hang, empSSN.</p>',
    yc: [['Three window functions over the same PARTITION BY depNum: DENSE_RANK, MAX, SUM.', 'Ba hàm cửa sổ trên cùng PARTITION BY depNum: DENSE_RANK, MAX, SUM.'], ['ty_le = CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (…), 2) AS DECIMAL(5,2)).', 'ty_le = CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (…), 2) AS DECIMAL(5,2)).']],
    giai: `SELECT depNum, empName, empSalary,
       DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC)            AS hang,
       MAX(empSalary) OVER (PARTITION BY depNum) - empSalary                      AS kem_cao_nhat,
       CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (PARTITION BY depNum), 2) AS DECIMAL(5,2)) AS ty_le
FROM tblEmployee
ORDER BY depNum, hang, empSSN;`,
    kiem: [
      kq(['Every employee', 'Mọi nhân viên'], { thuTu: true }),
      kqAn(['Hidden: a tie at 90,000 in department 1', 'Ẩn: hoà ở 90.000 trong phòng 1'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test Hoa', NULL, 90000, 'F', NULL, 1, 30121050001)", { thuTu: true }),
      ma(['Window functions with PARTITION BY', 'Hàm cửa sổ với PARTITION BY'], '\\bPARTITION\\s+BY\\b'),
    ],
    sai: [
      'SELECT depNum, empName, empSalary, RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS hang, MAX(empSalary) OVER (PARTITION BY depNum) - empSalary AS kem_cao_nhat, CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (PARTITION BY depNum), 2) AS DECIMAL(5,2)) AS ty_le FROM tblEmployee ORDER BY depNum, hang, empSSN;',
      'SELECT depNum, empName, empSalary, DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS hang, MAX(empSalary) OVER (PARTITION BY depNum) - empSalary AS kem_cao_nhat, CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (), 2) AS DECIMAL(5,2)) AS ty_le FROM tblEmployee ORDER BY depNum, hang, empSSN;',
      'SELECT depNum, empName, empSalary, DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS hang, MAX(empSalary) OVER () - empSalary AS kem_cao_nhat, CAST(ROUND(100.0 * empSalary / SUM(empSalary) OVER (PARTITION BY depNum), 2) AS DECIMAL(5,2)) AS ty_le FROM tblEmployee ORDER BY depNum, hang, empSSN;',
    ],
    gy: [['All three windows share PARTITION BY depNum; only DENSE_RANK needs an ORDER BY inside OVER.', 'Cả ba cửa sổ chung PARTITION BY depNum; chỉ DENSE_RANK cần ORDER BY trong OVER.'], ['100.0 (not 100) forces decimal division.', '100.0 (không phải 100) ép phép chia thập phân.']],
    lhg: [['RANK instead of DENSE_RANK — a gap appears after the tie.', 'RANK thay vì DENSE_RANK — có khoảng trống sau chỗ hoà.'], ['SUM(…) OVER () — the share of the whole company, not the department.', 'SUM(…) OVER () — tỉ lệ trên cả công ty, không phải phòng.']],
    gt: ['<p>No GROUP BY and no self-join: windows let every row see its group\'s aggregates. On SQL Server 100 * int / int would be integer division — the 100.0 matters.</p>', '<p>Không GROUP BY, không tự nối: cửa sổ cho mỗi dòng nhìn thấy giá trị tổng hợp của nhóm. Trên SQL Server 100 * int / int là chia nguyên — 100.0 rất quan trọng.</p>'],
    tn: [tn('share of total', 'tỉ trọng trên tổng')],
  }),
  de({
    csdl: DT, tenCsdl: 'DoanhThu', ld: { en: '<p><code>DoanhThu(thang, tien)</code> — 8 months of revenue.</p>', vi: '<p><code>DoanhThu(thang, tien)</code> — doanh thu 8 tháng.</p>' },
    t: 'Exercise 2 — months that grew', k: 'MEDIUM', p: 10,
    kn: ['LAG', 'SUM OVER ()', 'filter after a window'], tag: ['advanced', 'window'],
    en: '<p>List only the months whose revenue is <b>higher</b> than the previous month\'s: <code>thang, tien, truoc</code> (previous month), <code>tang</code> (the increase) and <code>ty_trong</code> = the month\'s share (%) of the total of ALL months, as <code>DECIMAL(5,2)</code>. Sort by thang.</p>',
    vi: '<p>Chỉ liệt kê các tháng có doanh thu <b>cao hơn</b> tháng trước: <code>thang, tien, truoc</code> (tháng trước), <code>tang</code> (mức tăng) và <code>ty_trong</code> = tỉ trọng (%) của tháng trên tổng MỌI tháng, dạng <code>DECIMAL(5,2)</code>. Sắp theo thang.</p>',
    yc: [['Compute LAG and the total in a CTE/subquery, filter outside.', 'Tính LAG và tổng trong CTE/truy vấn con, lọc ở ngoài.'], ['The total must include the months you filter out.', 'Tổng phải gồm cả các tháng bị lọc bỏ.']],
    giai: `WITH t AS (
    SELECT thang, tien,
           LAG(tien) OVER (ORDER BY thang) AS truoc,
           CAST(ROUND(100.0 * tien / SUM(tien) OVER (), 2) AS DECIMAL(5,2)) AS ty_trong   -- before the WHERE
    FROM DoanhThu
)
SELECT thang, tien, truoc, tien - truoc AS tang, ty_trong
FROM t
WHERE tien > truoc
ORDER BY thang;`,
    kiem: [
      kq(['Four months grew', 'Bốn tháng tăng'], { thuTu: true }),
      kqAn(['Hidden: September is added', 'Ẩn: thêm tháng 9'], "INSERT INTO DoanhThu VALUES ('2025-09-01', 210)", { thuTu: true }),
      ma(['Uses LAG', 'Dùng LAG'], '\\bLAG\\s*\\('),
    ],
    sai: [
      'WITH t AS (SELECT thang, tien, LAG(tien) OVER (ORDER BY thang) AS truoc FROM DoanhThu) SELECT thang, tien, truoc, tien - truoc AS tang, CAST(ROUND(100.0 * tien / SUM(tien) OVER (), 2) AS DECIMAL(5,2)) AS ty_trong FROM t WHERE tien > truoc ORDER BY thang;',
      'WITH t AS (SELECT thang, tien, LAG(tien) OVER (ORDER BY thang) AS truoc, CAST(ROUND(100.0 * tien / SUM(tien) OVER (), 2) AS DECIMAL(5,2)) AS ty_trong FROM DoanhThu) SELECT thang, tien, truoc, tien - truoc AS tang, ty_trong FROM t WHERE tien >= truoc ORDER BY thang;',
      'WITH t AS (SELECT thang, tien, LAG(tien) OVER (ORDER BY tien) AS truoc, CAST(ROUND(100.0 * tien / SUM(tien) OVER (), 2) AS DECIMAL(5,2)) AS ty_trong FROM DoanhThu) SELECT thang, tien, truoc, tien - truoc AS tang, ty_trong FROM t WHERE tien > truoc ORDER BY thang;',
    ],
    gy: [['LAG(tien) OVER (ORDER BY thang) = last month\'s revenue.', 'LAG(tien) OVER (ORDER BY thang) = doanh thu tháng trước.'], ['Windows are computed before the outer WHERE only if they live in the inner query.', 'Cửa sổ chỉ được tính trước WHERE ngoài nếu nằm trong truy vấn trong.']],
    lhg: [['Computing SUM(tien) OVER () after the filter — the share is of the growing months only.', 'Tính SUM(tien) OVER () sau khi lọc — tỉ trọng chỉ trên các tháng tăng.'], ['>= instead of > — May (150 = 150) did not grow.', '>= thay vì > — tháng 5 (150 = 150) không tăng.']],
    gt: ['<p>The first month has no previous one: LAG returns NULL and "tien > NULL" is UNKNOWN, so January drops out naturally.</p>', '<p>Tháng đầu không có tháng trước: LAG trả NULL và "tien > NULL" là UNKNOWN nên tháng 1 tự rơi ra.</p>'],
    tn: [tn('LAG / LEAD', 'giá trị dòng trước / sau')],
  }),
  dePg({
    csdl: FUH_PG, tenCsdl: 'FUHCompany', ld: LUOC_DO_FUH,
    t: 'Exercise 3 — how many people are under each manager, at every level? (PostgreSQL)', k: 'HARD', p: 15,
    kn: ['recursive CTE', 'tree', 'aggregation over a hierarchy'], tag: ['advanced', 'cte', 'recursive'],
    en: '<p>For every employee who has at least one person below them (direct reports, their reports, …), show <code>empSSN, empName, so_nguoi_duoi</code>. Sort by so_nguoi_duoi (largest first), then empSSN. Runs on real PostgreSQL (<code>WITH RECURSIVE</code>).</p>',
    vi: '<p>Với mỗi nhân viên có ít nhất một người ở dưới (cấp dưới trực tiếp, cấp dưới của họ, …), hiện <code>empSSN, empName, so_nguoi_duoi</code>. Sắp theo so_nguoi_duoi (lớn trước) rồi empSSN. Chạy trên PostgreSQL thật (<code>WITH RECURSIVE</code>).</p>',
    yc: [['Anchor: EVERY employee as the root of their own tree, keeping the root in a column.', 'Neo: MỌI nhân viên là gốc cây của chính mình, giữ gốc trong một cột.'], ['Recursive member: go DOWN (e.supervisorSSN = c.empSSN). Then count per root, minus the root itself.', 'Phần đệ quy: đi XUỐNG (e.supervisorSSN = c.empSSN). Rồi đếm theo gốc, trừ chính gốc.']],
    giai: `WITH RECURSIVE cay AS (
    SELECT empSSN AS goc, empSSN                 -- every employee starts their own tree
    FROM tblEmployee
  UNION ALL
    SELECT c.goc, e.empSSN                       -- one level down
    FROM tblEmployee e
    JOIN cay c ON e.supervisorSSN = c.empSSN
)
SELECT g.empSSN, g.empName, COUNT(*) - 1 AS so_nguoi_duoi
FROM cay
JOIN tblEmployee g ON g.empSSN = cay.goc
GROUP BY g.empSSN, g.empName
HAVING COUNT(*) > 1
ORDER BY so_nguoi_duoi DESC, g.empSSN;`,
    kiem: [
      kq(['Five managers', 'Năm người quản lý'], { thuTu: true }),
      kqAn(['Hidden: a new hire under Nghĩa', 'Ẩn: người mới dưới quyền Nghĩa'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, 'Test Moi', NULL, 30000, 'M', NULL, 5, 30121050038)", { thuTu: true }),
      ma(['A recursive CTE', 'CTE đệ quy'], '\\bWITH\\s+RECURSIVE\\b'),
    ],
    sai: [
      'SELECT b.empSSN, b.empName, COUNT(*) AS so_nguoi_duoi FROM tblEmployee e JOIN tblEmployee b ON b.empSSN = e.supervisorSSN GROUP BY b.empSSN, b.empName ORDER BY so_nguoi_duoi DESC, b.empSSN;',
      'WITH RECURSIVE cay AS (SELECT empSSN AS goc, empSSN FROM tblEmployee UNION ALL SELECT c.goc, e.empSSN FROM tblEmployee e JOIN cay c ON e.supervisorSSN = c.empSSN) SELECT g.empSSN, g.empName, COUNT(*) AS so_nguoi_duoi FROM cay JOIN tblEmployee g ON g.empSSN = cay.goc GROUP BY g.empSSN, g.empName HAVING COUNT(*) > 1 ORDER BY so_nguoi_duoi DESC, g.empSSN;',
      'WITH RECURSIVE cay AS (SELECT empSSN AS goc, empSSN, supervisorSSN FROM tblEmployee UNION ALL SELECT c.goc, e.empSSN, e.supervisorSSN FROM tblEmployee e JOIN cay c ON e.empSSN = c.supervisorSSN) SELECT g.empSSN, g.empName, COUNT(*) - 1 AS so_nguoi_duoi FROM cay JOIN tblEmployee g ON g.empSSN = cay.goc GROUP BY g.empSSN, g.empName HAVING COUNT(*) > 1 ORDER BY so_nguoi_duoi DESC, g.empSSN;',
    ],
    gy: [['Keep the root in every row of the recursion: that is what you GROUP BY at the end.', 'Giữ gốc trong mọi dòng của đệ quy: đó là thứ GROUP BY ở cuối.'], ['COUNT(*) − 1 removes the root itself.', 'COUNT(*) − 1 bỏ chính gốc.']],
    lhg: [['A self-join counts only direct reports (Quang 5 instead of 13).', 'Tự nối chỉ đếm cấp dưới trực tiếp (Quang 5 thay vì 13).'], ['Walking up instead of down — that counts bosses, not reports.', 'Đi lên thay vì đi xuống — đó là đếm sếp, không phải cấp dưới.']],
    gt: ['<p>On SQL Server the same query starts with WITH cay AS (…) — no RECURSIVE — and works the same. With many roots the CTE grows to (employees × depth) rows: fine here, worth an index on supervisorSSN for a real company.</p>', '<p>Trên SQL Server cùng câu bắt đầu bằng WITH cay AS (…) — không có RECURSIVE — và chạy y như vậy. Nhiều gốc thì CTE có (số nhân viên × độ sâu) dòng: ổn ở đây, với công ty thật nên có chỉ mục trên supervisorSSN.</p>'],
    tn: [tn('hierarchy', 'cấu trúc phân cấp')],
  }),
  de({
    t: 'Exercise 4 — who worked most on each project (ties included)?', k: 'MEDIUM', p: 10,
    kn: ['RANK', 'ties', 'top-1 per group'], tag: ['advanced', 'window', 'top-n'],
    en: '<p>For each project show the employee(s) with the most hours: <code>proNum, proName, empName, workHours</code>. If two people tie, both appear. Sort by proNum, then empSSN.</p>',
    vi: '<p>Với mỗi dự án hiện (những) nhân viên làm nhiều giờ nhất: <code>proNum, proName, empName, workHours</code>. Hai người hoà thì cả hai cùng hiện. Sắp theo proNum rồi empSSN.</p>',
    yc: [['RANK() OVER (PARTITION BY proNum ORDER BY workHours DESC) = 1.', 'RANK() OVER (PARTITION BY proNum ORDER BY workHours DESC) = 1.'], ['Join tblProject and tblEmployee for the names.', 'Nối tblProject và tblEmployee để lấy tên.']],
    giai: `WITH x AS (
    SELECT w.proNum, w.empSSN, w.workHours,
           RANK() OVER (PARTITION BY w.proNum ORDER BY w.workHours DESC) AS rk
    FROM tblWorksOn w
    WHERE w.workHours IS NOT NULL
)
SELECT x.proNum, p.proName, e.empName, x.workHours
FROM x
JOIN tblProject  p ON p.proNum = x.proNum
JOIN tblEmployee e ON e.empSSN = x.empSSN
WHERE x.rk = 1
ORDER BY x.proNum, x.empSSN;`,
    kiem: [
      kq(['One winner per project', 'Mỗi dự án một người dẫn đầu'], { thuTu: true }),
      kqAn(['Hidden: Mai Duy An ties on project 1 and Hân ties on project 4', 'Ẩn: Mai Duy An hoà ở dự án 1 và Hân hoà ở dự án 4'], 'INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050005, 1, 30.0), (30121050011, 4, 30.0)', { thuTu: true }),
      ma(['Uses a ranking window function', 'Dùng hàm xếp hạng cửa sổ'], '\\b(RANK|DENSE_RANK)\\s*\\('),
    ],
    sai: [
      'WITH x AS (SELECT w.proNum, w.empSSN, w.workHours, ROW_NUMBER() OVER (PARTITION BY w.proNum ORDER BY w.workHours DESC) AS rk FROM tblWorksOn w) SELECT x.proNum, p.proName, e.empName, x.workHours FROM x JOIN tblProject p ON p.proNum = x.proNum JOIN tblEmployee e ON e.empSSN = x.empSSN WHERE x.rk = 1 ORDER BY x.proNum, x.empSSN;',
      'WITH x AS (SELECT w.proNum, w.empSSN, w.workHours, RANK() OVER (ORDER BY w.workHours DESC) AS rk FROM tblWorksOn w) SELECT x.proNum, p.proName, e.empName, x.workHours FROM x JOIN tblProject p ON p.proNum = x.proNum JOIN tblEmployee e ON e.empSSN = x.empSSN WHERE x.rk = 1 ORDER BY x.proNum, x.empSSN;',
      'WITH x AS (SELECT w.proNum, w.empSSN, w.workHours, RANK() OVER (PARTITION BY w.proNum ORDER BY w.workHours) AS rk FROM tblWorksOn w) SELECT x.proNum, p.proName, e.empName, x.workHours FROM x JOIN tblProject p ON p.proNum = x.proNum JOIN tblEmployee e ON e.empSSN = x.empSSN WHERE x.rk = 1 ORDER BY x.proNum, x.empSSN;',
    ],
    gy: [['"Ties included" ⇒ RANK (or DENSE_RANK) = 1, never ROW_NUMBER.', '"Tính cả hoà" ⇒ RANK (hoặc DENSE_RANK) = 1, không bao giờ ROW_NUMBER.'], ['The APPLY/LATERAL version: for each project, SELECT … ORDER BY workHours DESC with TOP (1) WITH TIES (SQL Server) or a subquery on MAX.', 'Bản APPLY/LATERAL: với mỗi dự án, SELECT … ORDER BY workHours DESC với TOP (1) WITH TIES (SQL Server) hoặc truy vấn con theo MAX.']],
    lhg: [['ROW_NUMBER silently picks one of the tied people.', 'ROW_NUMBER âm thầm chọn một trong những người hoà.'], ['Forgetting DESC — that finds who worked least.', 'Quên DESC — thành tìm người làm ít nhất.']],
    gt: ['<p>The classic non-window answer also works: JOIN to (SELECT proNum, MAX(workHours) … GROUP BY proNum) on both columns. Interviewers often ask for both and then "which one handles ties?" — both do; ROW_NUMBER would not.</p>', '<p>Lời giải kinh điển không dùng cửa sổ cũng được: JOIN với (SELECT proNum, MAX(workHours) … GROUP BY proNum) trên cả hai cột. Người phỏng vấn hay hỏi cả hai rồi hỏi "cách nào xử lý hoà?" — cả hai đều được; ROW_NUMBER thì không.</p>'],
    tn: [tn('tie', 'hoà')],
  }),
  de({
    csdl: DD, tenCsdl: 'DiemDanh', ld: { en: '<p><code>DiemDanh(sv, buoi)</code> — the class sessions (1, 2, 3, …) each student attended.</p>', vi: '<p><code>DiemDanh(sv, buoi)</code> — các buổi học (1, 2, 3, …) mỗi sinh viên đã đi.</p>' },
    t: 'Exercise 5 — the longest attendance streak (gaps and islands)', k: 'HARD', p: 15,
    kn: ['gaps and islands', 'ROW_NUMBER difference', 'chained CTEs'], tag: ['advanced', 'window', 'gaps-islands'],
    en: '<p>For each student return the longest run of consecutive sessions attended: <code>sv, bat_dau, ket_thuc, do_dai</code>. If two runs are equally long, return the <b>earlier</b> one. Sort by sv.</p>',
    vi: '<p>Với mỗi sinh viên trả dãy buổi liên tiếp dài nhất đã đi học: <code>sv, bat_dau, ket_thuc, do_dai</code>. Hai dãy dài bằng nhau thì trả dãy <b>sớm hơn</b>. Sắp theo sv.</p>',
    yc: [['Step 1: buoi − ROW_NUMBER() OVER (PARTITION BY sv ORDER BY buoi) is constant inside a run.', 'Bước 1: buoi − ROW_NUMBER() OVER (PARTITION BY sv ORDER BY buoi) không đổi trong một dãy.'], ['Step 2: one row per island (GROUP BY sv, that difference). Step 3: ROW_NUMBER per sv by length DESC, start ASC.', 'Bước 2: mỗi đảo một dòng (GROUP BY sv, hiệu đó). Bước 3: ROW_NUMBER theo sv, độ dài giảm, bắt đầu tăng.']],
    giai: `WITH d AS (
    SELECT sv, buoi, buoi - ROW_NUMBER() OVER (PARTITION BY sv ORDER BY buoi) AS nhom   -- same value inside a run
    FROM DiemDanh
), dao AS (
    SELECT sv, MIN(buoi) AS bat_dau, MAX(buoi) AS ket_thuc, COUNT(*) AS do_dai
    FROM d
    GROUP BY sv, nhom
), xh AS (
    SELECT sv, bat_dau, ket_thuc, do_dai,
           ROW_NUMBER() OVER (PARTITION BY sv ORDER BY do_dai DESC, bat_dau) AS rn
    FROM dao
)
SELECT sv, bat_dau, ket_thuc, do_dai
FROM xh
WHERE rn = 1
ORDER BY sv;`,
    kiem: [
      kq(['The longest streak per student', 'Dãy dài nhất mỗi sinh viên'], { thuTu: true }),
      kqAn(['Hidden: SV02 fills sessions 7–8, a new SV04 attends 1 and 3', 'Ẩn: SV02 đi thêm buổi 7–8, SV04 mới đi buổi 1 và 3'], "INSERT INTO DiemDanh VALUES ('SV02', 7), ('SV02', 8), ('SV04', 1), ('SV04', 3)", { thuTu: true }),
      ma(['Uses ROW_NUMBER', 'Dùng ROW_NUMBER'], '\\bROW_NUMBER\\s*\\('),
    ],
    sai: [
      'WITH d AS (SELECT sv, buoi, buoi - ROW_NUMBER() OVER (PARTITION BY sv ORDER BY buoi) AS nhom FROM DiemDanh), dao AS (SELECT sv, MIN(buoi) AS bat_dau, MAX(buoi) AS ket_thuc, COUNT(*) AS do_dai FROM d GROUP BY sv, nhom), xh AS (SELECT sv, bat_dau, ket_thuc, do_dai, ROW_NUMBER() OVER (PARTITION BY sv ORDER BY do_dai DESC, bat_dau DESC) AS rn FROM dao) SELECT sv, bat_dau, ket_thuc, do_dai FROM xh WHERE rn = 1 ORDER BY sv;',
      'WITH d AS (SELECT sv, buoi, buoi - ROW_NUMBER() OVER (PARTITION BY sv ORDER BY buoi DESC) AS nhom FROM DiemDanh), dao AS (SELECT sv, MIN(buoi) AS bat_dau, MAX(buoi) AS ket_thuc, COUNT(*) AS do_dai FROM d GROUP BY sv, nhom), xh AS (SELECT sv, bat_dau, ket_thuc, do_dai, ROW_NUMBER() OVER (PARTITION BY sv ORDER BY do_dai DESC, bat_dau) AS rn FROM dao) SELECT sv, bat_dau, ket_thuc, do_dai FROM xh WHERE rn = 1 ORDER BY sv;',
      'SELECT sv, MIN(buoi) AS bat_dau, MAX(buoi) AS ket_thuc, COUNT(*) AS do_dai FROM DiemDanh GROUP BY sv ORDER BY sv;',
    ],
    gy: [['1, 2, 3 minus row numbers 1, 2, 3 = 0, 0, 0; then 5, 6, 7, 8 minus 4, 5, 6, 7 = 1, 1, 1, 1.', '1, 2, 3 trừ số thứ tự 1, 2, 3 = 0, 0, 0; rồi 5, 6, 7, 8 trừ 4, 5, 6, 7 = 1, 1, 1, 1.'], ['The tie-break goes into the final ORDER BY of the ROW_NUMBER.', 'Luật phá hoà nằm trong ORDER BY của ROW_NUMBER cuối.']],
    lhg: [['Numbering the rows in DESCENDING order — then buoi − row number is not constant inside a run.', 'Đánh số dòng theo thứ tự GIẢM — khi đó buoi − số thứ tự không còn không đổi trong một dãy.'], ['MIN/MAX/COUNT per student — that is the whole range, not a consecutive run.', 'MIN/MAX/COUNT theo sinh viên — đó là cả khoảng, không phải một dãy liên tiếp.']],
    gt: ['<p>With dates instead of session numbers the same trick is DATEADD(DAY, −ROW_NUMBER() OVER (…), ngay) on SQL Server, or ngay − ROW_NUMBER() OVER (…)::int on PostgreSQL.</p>', '<p>Với ngày thay vì số buổi, cùng mẹo là DATEADD(DAY, −ROW_NUMBER() OVER (…), ngay) trên SQL Server, hoặc ngay − ROW_NUMBER() OVER (…)::int trên PostgreSQL.</p>'],
    tn: [tn('island', 'đảo (dãy liên tiếp)'), tn('streak', 'chuỗi liên tiếp')],
  }),
  tsql({
    t: 'Exercise 6 — synchronise a price list with MERGE, safely', k: 'HARD', p: 20,
    kn: ['MERGE', 'HOLDLOCK', 'OUTPUT $action', 'upsert'], tag: ['advanced', 'merge', 'procedure'],
    lyDo: ['MERGE … OUTPUT $action and the HOLDLOCK table hint are SQL Server syntax that the browser grader (PostgreSQL in WASM) cannot run.', 'MERGE … OUTPUT $action và gợi ý bảng HOLDLOCK là cú pháp SQL Server mà máy chấm trình duyệt (PostgreSQL trong WASM) không chạy được.'],
    en: `<p><code>BangGia(maHang, tenHang, gia, ngayCapNhat)</code> is the shop's price list; <code>GiaMoi(maHang, tenHang, gia)</code> is the supplier's new list. Write <code>dbo.prDongBoGia</code> (no parameters) that, in one MERGE:</p>
<ul><li>updates the price (and sets ngayCapNhat to today) <b>only</b> for items whose price really changed;</li>
<li>adds new items (ngayCapNhat = today);</li>
<li><b>keeps</b> items the supplier did not mention;</li>
<li>returns a report <code>(hanhDong, maHang, gia)</code> with one row per item it changed (OUTPUT $action);</li>
<li>is safe when two sessions run it at the same time (no duplicate-key error).</li></ul>`,
    vi: `<p><code>BangGia(maHang, tenHang, gia, ngayCapNhat)</code> là bảng giá của cửa hàng; <code>GiaMoi(maHang, tenHang, gia)</code> là bảng giá mới của nhà cung cấp. Viết <code>dbo.prDongBoGia</code> (không tham số) bằng một câu MERGE:</p>
<ul><li>cập nhật giá (và đặt ngayCapNhat = hôm nay) <b>chỉ</b> cho mặt hàng thật sự đổi giá;</li>
<li>thêm mặt hàng mới (ngayCapNhat = hôm nay);</li>
<li><b>giữ</b> mặt hàng nhà cung cấp không nhắc tới;</li>
<li>trả báo cáo <code>(hanhDong, maHang, gia)</code>, mỗi mặt hàng được đổi một dòng (OUTPUT $action);</li>
<li>an toàn khi hai phiên chạy cùng lúc (không lỗi trùng khoá).</li></ul>`,
    yc: [['MERGE dbo.BangGia WITH (HOLDLOCK) AS t USING dbo.GiaMoi AS s ON …', 'MERGE dbo.BangGia WITH (HOLDLOCK) AS t USING dbo.GiaMoi AS s ON …'], ['WHEN MATCHED AND t.gia <> s.gia … WHEN NOT MATCHED BY TARGET … OUTPUT $action, inserted.maHang, inserted.gia; — and no NOT MATCHED BY SOURCE.', 'WHEN MATCHED AND t.gia <> s.gia … WHEN NOT MATCHED BY TARGET … OUTPUT $action, inserted.maHang, inserted.gia; — và không có NOT MATCHED BY SOURCE.']],
    setup: BANG_GIA,
    khoi: `CREATE OR ALTER PROCEDURE dbo.prDongBoGia
AS
BEGIN
    SET NOCOUNT ON;
    -- MERGE ...
    SELECT CAST(NULL AS NVARCHAR(10)) AS hanhDong, CAST(NULL AS VARCHAR(10)) AS maHang, CAST(NULL AS DECIMAL(12,0)) AS gia WHERE 1 = 0;
END`,
    giai: GIAI_MERGE,
    kiem: [
      ck(['The report: VO and THUOC updated, KEO inserted — nothing else', 'Báo cáo: VO và THUOC cập nhật, KEO thêm mới — không gì khác'], `${CHAY}
SET @ok = IIF((SELECT COUNT(*) FROM @r) = 3 AND EXISTS (SELECT 1 FROM @r WHERE hanhDong = N'UPDATE' AND maHang = 'VO' AND gia = 13000) AND EXISTS (SELECT 1 FROM @r WHERE hanhDong = N'UPDATE' AND maHang = 'THUOC' AND gia = 7500) AND EXISTS (SELECT 1 FROM @r WHERE hanhDong = N'INSERT' AND maHang = 'KEO' AND gia = 6000), 1, 0);
SET @info = CONCAT(N'report rows: ', (SELECT STRING_AGG(CONCAT(hanhDong, ' ', maHang), ', ') FROM @r));`),
      ck(['The price list now: BUT unchanged (old date), VO 13000, THUOC 7500, TAY kept, KEO added', 'Bảng giá giờ: BUT không đổi (ngày cũ), VO 13000, THUOC 7500, TAY còn, KEO thêm'], `SET @ok = IIF((SELECT COUNT(*) FROM dbo.BangGia) = 5 AND EXISTS (SELECT 1 FROM dbo.BangGia WHERE maHang = 'BUT' AND gia = 5000 AND ngayCapNhat = '2026-01-01') AND EXISTS (SELECT 1 FROM dbo.BangGia WHERE maHang = 'TAY' AND gia = 3000)
  AND EXISTS (SELECT 1 FROM dbo.BangGia WHERE maHang = 'VO' AND gia = 13000 AND ngayCapNhat = CAST(GETDATE() AS DATE)) AND EXISTS (SELECT 1 FROM dbo.BangGia WHERE maHang = 'KEO' AND gia = 6000), 1, 0);
SET @info = CONCAT(N'rows: ', (SELECT STRING_AGG(CONCAT(maHang, '=', gia), ', ') FROM dbo.BangGia));`),
      ck(['Running it again changes nothing and reports nothing', 'Chạy lại không đổi gì và không báo gì'], `${CHAY}
SET @ok = IIF((SELECT COUNT(*) FROM @r) = 0 AND (SELECT COUNT(*) FROM dbo.BangGia) = 5, 1, 0);
SET @info = CONCAT(N'second run reported ', (SELECT COUNT(*) FROM @r), N' rows');`),
      ck(['Safe under concurrency: HOLDLOCK on the target', 'An toàn khi song song: HOLDLOCK trên bảng đích'], `DECLARE @d NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.prDongBoGia'));
SET @ok = IIF(@d LIKE N'%HOLDLOCK%' OR @d LIKE N'%SERIALIZABLE%', 1, 0);
SET @info = N'expected MERGE dbo.BangGia WITH (HOLDLOCK)';`),
    ],
    saiTay: [
      GIAI_MERGE.replace('WHEN MATCHED AND t.gia <> s.gia THEN', 'WHEN MATCHED THEN'),
      GIAI_MERGE.replace("    -- no WHEN NOT MATCHED BY SOURCE: items the supplier did not mention are kept\n", '    WHEN NOT MATCHED BY SOURCE THEN DELETE\n'),
      GIAI_MERGE.replace('MERGE dbo.BangGia WITH (HOLDLOCK) AS t        -- HOLDLOCK: the "not matched" check and the INSERT are one unit', 'MERGE dbo.BangGia AS t'),
    ],
    gy: [['WHEN MATCHED AND <condition> filters which matches are updated.', 'WHEN MATCHED AND <điều kiện> lọc những dòng khớp được cập nhật.'], ['OUTPUT $action returns INSERT / UPDATE / DELETE for each changed row; inserted.* is the new row.', 'OUTPUT $action trả INSERT / UPDATE / DELETE cho mỗi dòng bị đổi; inserted.* là dòng mới.']],
    lhg: [['WHEN MATCHED THEN UPDATE for every row — BUT is "updated" with the same price and its date changes.', 'WHEN MATCHED THEN UPDATE cho mọi dòng — BUT bị "cập nhật" với cùng giá và đổi ngày.'], ['Adding WHEN NOT MATCHED BY SOURCE THEN DELETE — TAY disappears because the supplier did not mention it.', 'Thêm WHEN NOT MATCHED BY SOURCE THEN DELETE — TAY biến mất vì nhà cung cấp không nhắc tới.']],
    gt: ['<p>Without HOLDLOCK two concurrent MERGEs can both decide "KEO is not matched" and both INSERT it: one fails with a duplicate key. The PostgreSQL equivalent is INSERT … ON CONFLICT (maHang) DO UPDATE SET gia = EXCLUDED.gia WHERE BangGia.gia <> EXCLUDED.gia.</p>', '<p>Không có HOLDLOCK, hai MERGE song song có thể cùng kết luận "KEO chưa khớp" và cùng INSERT: một cái lỗi trùng khoá. Bản PostgreSQL tương đương là INSERT … ON CONFLICT (maHang) DO UPDATE SET gia = EXCLUDED.gia WHERE BangGia.gia <> EXCLUDED.gia.</p>'],
    tn: [tn('MERGE', 'lệnh hợp nhất'), tn('$action', 'loại thao tác của MERGE')],
  }),
]);
