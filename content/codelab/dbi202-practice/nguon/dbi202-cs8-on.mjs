/**
 * DBI202 · ⭐ CS.8 — 9 bài SQL phỏng vấn chọn từ 33 bài của deck (phần còn lại đã có ở CS.5 và slide CS.8.2): tìm trùng và xoá trùng giữ
 * bản mới nhất, lương hơn sếp, fan-out khi nối hai bảng con, phép chia quan hệ, đặt phòng chồng lấn, trạng thái mới nhất, tỉ lệ huỷ
 * chuyến trừ người bị cấm, doanh thu đủ mọi tháng (lịch sinh bằng generate_series — PostgreSQL thật).
 */
import { mod, de, dePg, kq, kqAn, sau, ma, tn } from './_chung.mjs';

const KH = `CREATE TABLE KhachHang (
  id     INT          NOT NULL PRIMARY KEY,
  ten    VARCHAR(50)  NOT NULL,
  email  VARCHAR(100) NULL,
  ngayTao DATE        NOT NULL
);
INSERT INTO KhachHang (id, ten, email, ngayTao) VALUES
  (1, 'An', 'an@shop.vn', '2025-01-05'), (2, 'An Nguyen', ' AN@shop.vn ', '2025-03-01'),
  (3, 'Binh', 'binh@shop.vn', '2025-01-07'),
  (4, 'Chi', 'chi@shop.vn', '2025-02-01'), (5, 'Chi T.', 'Chi@Shop.vn', '2025-02-01'), (6, 'Chi Tran', 'chi@shop.vn', '2025-01-15'),
  (7, 'Khach 1', NULL, '2025-01-01'), (8, 'Khach 2', NULL, '2025-01-02');`;
const LD_KH = { en: '<p><code>KhachHang(id, ten, email NULL, ngayTao)</code> — the same person was registered several times with differently typed e-mails.</p>', vi: '<p><code>KhachHang(id, ten, email NULL, ngayTao)</code> — cùng một người bị đăng ký nhiều lần với email gõ khác nhau.</p>' };

const FAN = `CREATE TABLE Khach (id INT NOT NULL PRIMARY KEY, ten VARCHAR(50) NOT NULL);
CREATE TABLE DonDat (id INT NOT NULL PRIMARY KEY, khachId INT NOT NULL REFERENCES Khach (id), tongTien DECIMAL(12,0) NOT NULL);
CREATE TABLE ThanhToan (id INT NOT NULL PRIMARY KEY, khachId INT NOT NULL REFERENCES Khach (id), soTien DECIMAL(12,0) NOT NULL);
INSERT INTO Khach VALUES (1, 'An'), (2, 'Binh'), (3, 'Chi');
INSERT INTO DonDat VALUES (10, 1, 100), (11, 1, 200), (12, 2, 50);
INSERT INTO ThanhToan VALUES (20, 1, 150), (21, 1, 100), (22, 1, 50), (23, 3, 30);`;

const SACH = `CREATE TABLE Sach (id INT NOT NULL PRIMARY KEY, ten VARCHAR(50) NOT NULL);
CREATE TABLE MuaSach (id INT NOT NULL PRIMARY KEY, khachId INT NOT NULL, sachId INT NOT NULL REFERENCES Sach (id));
INSERT INTO Sach VALUES (1, 'SQL'), (2, 'Java'), (3, 'React');
INSERT INTO MuaSach VALUES (1, 100, 1), (2, 100, 2), (3, 100, 3),
                           (4, 200, 1), (5, 200, 1), (6, 200, 2),
                           (7, 300, 3), (8, 300, 2), (9, 300, 1), (10, 300, 1),
                           (11, 400, 2);`;

const DP = `CREATE TABLE DatPhong (id INT NOT NULL PRIMARY KEY, phong VARCHAR(10) NOT NULL, tu INT NOT NULL, den INT NOT NULL);
INSERT INTO DatPhong VALUES
  (1, 'P1', 8, 10), (2, 'P1', 9, 11), (3, 'P1', 11, 12), (4, 'P1', 7, 13),
  (5, 'P2', 8, 9), (6, 'P2', 9, 10), (7, 'P3', 14, 16);`;

const LS = `CREATE TABLE LichSuDon (donId INT NOT NULL, buoc INT NOT NULL, trangThai VARCHAR(20) NOT NULL, PRIMARY KEY (donId, buoc));
INSERT INTO LichSuDon VALUES
  (1, 1, 'CREATED'), (1, 2, 'PAID'), (1, 3, 'SHIPPED'),
  (2, 1, 'CREATED'), (2, 2, 'CANCELLED'),
  (3, 1, 'CREATED'),
  (4, 3, 'DELIVERED'), (4, 1, 'CREATED'), (4, 2, 'PAID');`;

const TRIP = `CREATE TABLE Users (users_id INT NOT NULL PRIMARY KEY, banned VARCHAR(3) NOT NULL, role VARCHAR(10) NOT NULL);
CREATE TABLE Trips (id INT NOT NULL PRIMARY KEY, client_id INT NOT NULL, driver_id INT NOT NULL, city_id INT NOT NULL,
                    status VARCHAR(20) NOT NULL, request_at DATE NOT NULL);
INSERT INTO Users VALUES (1, 'No', 'client'), (2, 'Yes', 'client'), (3, 'No', 'client'), (4, 'No', 'client'),
                         (10, 'No', 'driver'), (11, 'No', 'driver'), (12, 'No', 'driver'), (13, 'No', 'driver');
INSERT INTO Trips VALUES
  (1, 1, 10, 1, 'completed', '2013-10-01'), (2, 2, 11, 1, 'cancelled_by_driver', '2013-10-01'),
  (3, 3, 12, 6, 'completed', '2013-10-01'), (4, 4, 13, 6, 'cancelled_by_client', '2013-10-01'),
  (5, 1, 10, 1, 'completed', '2013-10-02'), (6, 2, 11, 6, 'completed', '2013-10-02'),
  (7, 3, 12, 6, 'completed', '2013-10-02'), (8, 2, 12, 12, 'completed', '2013-10-03'),
  (9, 3, 10, 12, 'completed', '2013-10-03'), (10, 4, 13, 12, 'cancelled_by_driver', '2013-10-03');`;

const DT_PG = `CREATE TABLE don_hang (id int PRIMARY KEY, ngay date NOT NULL, tien numeric(12,0) NOT NULL);
INSERT INTO don_hang VALUES
  (1, '2025-01-03', 100), (2, '2025-01-20', 50), (3, '2025-02-14', 80),
  (4, '2025-04-01', 120), (5, '2025-04-30', 30), (6, '2025-06-15', 90);`;

export default mod('dbi202-cs8-on', '⭐ CS.8 Exercises: interview SQL problems', [
  de({
    csdl: KH, tenCsdl: 'KhachHang', ld: LD_KH,
    t: 'Problem 1 — find duplicate customers by e-mail', k: 'MEDIUM', p: 8,
    kn: ['GROUP BY … HAVING', 'normalising before comparing', 'NULL in GROUP BY'], tag: ['advanced', 'interview', 'duplicates'],
    en: '<p>List every e-mail used by more than one customer, compared <b>ignoring case and surrounding spaces</b>: <code>email</code> (lower-case, trimmed) and <code>so_lan</code>. Customers without an e-mail are not duplicates. Sort by email.</p>',
    vi: '<p>Liệt kê mọi email được nhiều hơn một khách dùng, so <b>không phân biệt hoa thường và bỏ khoảng trắng hai đầu</b>: <code>email</code> (chữ thường, đã cắt) và <code>so_lan</code>. Khách không có email không tính là trùng. Sắp theo email.</p>',
    yc: [['GROUP BY LOWER(TRIM(email)) … HAVING COUNT(*) > 1.', 'GROUP BY LOWER(TRIM(email)) … HAVING COUNT(*) > 1.'], ['Exclude NULL e-mails explicitly (GROUP BY puts all NULLs in one group).', 'Loại email NULL tường minh (GROUP BY gom mọi NULL vào một nhóm).']],
    giai: `SELECT LOWER(TRIM(email)) AS email, COUNT(*) AS so_lan
FROM KhachHang
WHERE email IS NOT NULL
GROUP BY LOWER(TRIM(email))
HAVING COUNT(*) > 1
ORDER BY email;`,
    kiem: [
      kq(['an@shop.vn ×2, chi@shop.vn ×3', 'an@shop.vn ×2, chi@shop.vn ×3'], { thuTu: true }),
      kqAn(['Hidden: Binh registers again in capitals', 'Ẩn: Binh đăng ký lại bằng chữ hoa'], "INSERT INTO KhachHang VALUES (9, 'Binh 2', 'BINH@SHOP.VN', '2025-04-01')", { thuTu: true }),
      ma(['Groups with HAVING', 'Gộp nhóm với HAVING'], '\\bHAVING\\b'),
    ],
    sai: [
      'SELECT email, COUNT(*) AS so_lan FROM KhachHang WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1 ORDER BY email;',
      'SELECT LOWER(TRIM(email)) AS email, COUNT(*) AS so_lan FROM KhachHang GROUP BY LOWER(TRIM(email)) HAVING COUNT(*) > 1 ORDER BY email;',
      'SELECT LOWER(email) AS email, COUNT(*) AS so_lan FROM KhachHang WHERE email IS NOT NULL GROUP BY LOWER(email) HAVING COUNT(*) > 1 ORDER BY email;',
    ],
    gy: [['Normalise first, then group: the key of the group is the cleaned value.', 'Chuẩn hoá trước rồi gộp: khoá của nhóm là giá trị đã làm sạch.'], ['Ask the interviewer how duplicates are defined (case? spaces? dots in Gmail?).', 'Hỏi người phỏng vấn thế nào là trùng (hoa thường? khoảng trắng? dấu chấm của Gmail?).']],
    lhg: [['Grouping the raw e-mail — " AN@shop.vn " and "an@shop.vn" look different.', 'Gộp email thô — " AN@shop.vn " và "an@shop.vn" trông khác nhau.'], ['Forgetting NULLs: the two customers without e-mail appear as a "duplicate".', 'Quên NULL: hai khách không có email hiện thành "trùng".']],
    gt: ['<p>On SQL Server the default collation is case-insensitive, so GROUP BY email already merges "Chi@Shop.vn" and "chi@shop.vn" — but not the spaces. Writing LOWER(TRIM(…)) makes the rule explicit and portable.</p>', '<p>Trên SQL Server collation mặc định không phân biệt hoa thường nên GROUP BY email đã gộp "Chi@Shop.vn" và "chi@shop.vn" — nhưng không gộp khoảng trắng. Viết LOWER(TRIM(…)) làm luật tường minh và chạy được mọi nơi.</p>'],
    tn: [tn('data deduplication', 'khử trùng dữ liệu')],
  }),
  de({
    csdl: KH, tenCsdl: 'KhachHang', ld: LD_KH,
    t: 'Problem 2 — delete the duplicates, keep the newest', k: 'HARD', p: 10,
    kn: ['DELETE with EXISTS', 'tie-break', 'keep one per group'], tag: ['advanced', 'interview', 'duplicates'],
    en: '<p>For each e-mail (ignoring case and spaces) keep only the <b>newest</b> customer (latest ngayTao; on the same day, the larger id) and DELETE the others. Customers without an e-mail are never deleted.</p>',
    vi: '<p>Với mỗi email (không phân biệt hoa thường và khoảng trắng) chỉ giữ khách <b>mới nhất</b> (ngayTao muộn nhất; cùng ngày thì id lớn hơn) và DELETE những người còn lại. Khách không có email không bao giờ bị xoá.</p>',
    yc: [['DELETE FROM KhachHang WHERE EXISTS (a newer row with the same cleaned e-mail).', 'DELETE FROM KhachHang WHERE EXISTS (một dòng mới hơn có cùng email đã làm sạch).'], ['"Newer" = later ngayTao, or the same ngayTao and a larger id.', '"Mới hơn" = ngayTao muộn hơn, hoặc cùng ngayTao và id lớn hơn.']],
    giai: `DELETE FROM KhachHang
WHERE email IS NOT NULL
  AND EXISTS (SELECT 1
              FROM KhachHang k2
              WHERE LOWER(TRIM(k2.email)) = LOWER(TRIM(KhachHang.email))
                AND (k2.ngayTao > KhachHang.ngayTao
                     OR (k2.ngayTao = KhachHang.ngayTao AND k2.id > KhachHang.id)));`,
    kiem: [
      sau(['Remaining customers: one per e-mail, plus those without e-mail', 'Khách còn lại: mỗi email một người, cộng những người không có email'], 'SELECT id FROM KhachHang ORDER BY id'),
      sau(['Hidden: a later sign-up of An', 'Ẩn: An đăng ký thêm lần sau nữa'], 'SELECT id FROM KhachHang ORDER BY id', { an: true, themCsdl: "INSERT INTO KhachHang VALUES (9, 'An moi', 'an@SHOP.vn', '2025-05-01')" }),
      ma(['Uses DELETE', 'Dùng DELETE'], '\\bDELETE\\b'),
    ],
    sai: [
      "DELETE FROM KhachHang WHERE email IS NOT NULL AND EXISTS (SELECT 1 FROM KhachHang k2 WHERE LOWER(TRIM(k2.email)) = LOWER(TRIM(KhachHang.email)) AND k2.ngayTao > KhachHang.ngayTao);",
      "DELETE FROM KhachHang WHERE email IS NOT NULL AND EXISTS (SELECT 1 FROM KhachHang k2 WHERE LOWER(TRIM(k2.email)) = LOWER(TRIM(KhachHang.email)) AND k2.id > KhachHang.id);",
      "DELETE FROM KhachHang WHERE EXISTS (SELECT 1 FROM KhachHang k2 WHERE k2.email = KhachHang.email AND (k2.ngayTao > KhachHang.ngayTao OR (k2.ngayTao = KhachHang.ngayTao AND k2.id > KhachHang.id)));",
    ],
    gy: [['Delete a row if a "better" row exists in its group: that keeps exactly one per group.', 'Xoá một dòng nếu trong nhóm có dòng "tốt hơn": như vậy mỗi nhóm còn đúng một dòng.'], ['Ties on ngayTao need a second key, otherwise both survive.', 'Hoà ngayTao cần khoá thứ hai, nếu không cả hai cùng sống.']],
    lhg: [['Only comparing ngayTao: customers 4 and 5 (same day) both stay.', 'Chỉ so ngayTao: khách 4 và 5 (cùng ngày) đều còn.'], ['Keeping the largest id instead of the newest date — id 6 is older than 4 and 5.', 'Giữ id lớn nhất thay vì ngày mới nhất — id 6 cũ hơn 4 và 5.']],
    gt: ['<p>SQL Server shortcut: WITH x AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY ngayTao DESC, id DESC) AS rn FROM KhachHang WHERE email IS NOT NULL) DELETE FROM x WHERE rn > 1 — a CTE is updatable there, not on PostgreSQL. In real life, first re-point orders of the deleted customers to the kept one.</p>', '<p>Lối tắt SQL Server: WITH x AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY ngayTao DESC, id DESC) AS rn FROM KhachHang WHERE email IS NOT NULL) DELETE FROM x WHERE rn > 1 — ở đó CTE cập nhật được, PostgreSQL thì không. Ngoài đời, trước hết chuyển đơn hàng của khách bị xoá sang khách được giữ.</p>'],
    tn: [tn('keep latest', 'giữ bản mới nhất')],
  }),
  de({
    t: 'Problem 3 — employees who earn more than their supervisor', k: 'EASY', p: 6,
    kn: ['self-join'], tag: ['advanced', 'interview', 'join'],
    en: '<p>Return <code>empName, empSalary, sepName, sepSalary</code> for every employee paid more than their own supervisor. Sort by empSSN.</p>',
    vi: '<p>Trả <code>empName, empSalary, sepName, sepSalary</code> cho mọi nhân viên lương cao hơn chính sếp của họ. Sắp theo empSSN.</p>',
    yc: [['Join tblEmployee to itself: e.supervisorSSN = s.empSSN.', 'Nối tblEmployee với chính nó: e.supervisorSSN = s.empSSN.'], ['Alias the second copy\'s columns as sepName, sepSalary.', 'Đặt bí danh cột của bản thứ hai là sepName, sepSalary.']],
    giai: `SELECT e.empName, e.empSalary, s.empName AS sepName, s.empSalary AS sepSalary
FROM tblEmployee e
JOIN tblEmployee s ON s.empSSN = e.supervisorSSN
WHERE e.empSalary > s.empSalary
ORDER BY e.empSSN;`,
    kiem: [
      kq(['Đặng Tuấn Anh earns more than Phạm Quốc Bảo', 'Đặng Tuấn Anh lương cao hơn Phạm Quốc Bảo'], { thuTu: true }),
      kqAn(['Hidden: Nghĩa gets a raise above Tâm', 'Ẩn: Nghĩa được tăng lương vượt Tâm'], 'UPDATE tblEmployee SET empSalary = 70000 WHERE empSSN = 30121050038', { thuTu: true }),
      kqAn(['Hidden: Hân now earns exactly as much as her supervisor — not "more"', 'Ẩn: Hân giờ lương bằng đúng sếp — không phải "cao hơn"'], 'UPDATE tblEmployee SET empSalary = 95000 WHERE empSSN = 30121050011', { thuTu: true }),
      ma(['A self-join', 'Phép tự nối'], '\\btblEmployee\\b[\\s\\S]*\\bJOIN\\s+tblEmployee\\b'),
    ],
    sai: [
      'SELECT e.empName, e.empSalary, s.empName AS sepName, s.empSalary AS sepSalary FROM tblEmployee e JOIN tblEmployee s ON s.supervisorSSN = e.empSSN WHERE e.empSalary > s.empSalary ORDER BY e.empSSN;',
      'SELECT e.empName, e.empSalary, s.empName AS sepName, s.empSalary AS sepSalary FROM tblEmployee e JOIN tblEmployee s ON s.empSSN = e.supervisorSSN WHERE e.empSalary >= s.empSalary ORDER BY e.empSSN;',
    ],
    gy: [['Two aliases of one table: e = the employee, s = the supervisor.', 'Hai bí danh của một bảng: e = nhân viên, s = sếp.'], ['The top boss has no supervisor and drops out of the inner join — correct here.', 'Sếp lớn nhất không có sếp nên rơi khỏi phép nối trong — đúng ở đây.']],
    lhg: [['Joining the wrong way round (s.supervisorSSN = e.empSSN) — that compares bosses with their reports.', 'Nối ngược (s.supervisorSSN = e.empSSN) — thành so sếp với cấp dưới.'], ['Forgetting the alias names the task asks for.', 'Quên tên bí danh mà đề yêu cầu.']],
    gt: ['<p>Classic warm-up (LeetCode 181). Mention the index that helps: supervisorSSN is a foreign key and deserves one anyway.</p>', '<p>Câu khởi động kinh điển (LeetCode 181). Nhắc chỉ mục có ích: supervisorSSN là khoá ngoại và vốn nên có chỉ mục.</p>'],
    tn: [tn('self-join', 'phép tự nối')],
  }),
  de({
    csdl: FAN, tenCsdl: 'Shop', ld: { en: '<p><code>Khach(id, ten)</code>, <code>DonDat(id, khachId, tongTien)</code>, <code>ThanhToan(id, khachId, soTien)</code>.</p>', vi: '<p><code>Khach(id, ten)</code>, <code>DonDat(id, khachId, tongTien)</code>, <code>ThanhToan(id, khachId, soTien)</code>.</p>' },
    t: 'Problem 4 — total ordered and total paid per customer (the fan-out trap)', k: 'HARD', p: 10,
    kn: ['fan-out', 'aggregate before join', 'LEFT JOIN', 'COALESCE'], tag: ['advanced', 'interview', 'join'],
    en: '<p>For every customer: <code>id, ten, tong_dat</code> (sum of orders) and <code>tong_tra</code> (sum of payments), 0 when there is none. Sort by id. An has 2 orders (300) and 3 payments (300).</p>',
    vi: '<p>Với mọi khách: <code>id, ten, tong_dat</code> (tổng đơn) và <code>tong_tra</code> (tổng thanh toán), 0 nếu không có. Sắp theo id. An có 2 đơn (300) và 3 lần trả (300).</p>',
    yc: [['Aggregate each child table in its own subquery/CTE, THEN join to Khach.', 'Gộp mỗi bảng con trong truy vấn con/CTE riêng, RỒI mới nối với Khach.'], ['LEFT JOIN + COALESCE(…, 0) for customers with no rows.', 'LEFT JOIN + COALESCE(…, 0) cho khách không có dòng nào.']],
    giai: `WITH d AS (SELECT khachId, SUM(tongTien) AS tong_dat FROM DonDat GROUP BY khachId),
     t AS (SELECT khachId, SUM(soTien)   AS tong_tra FROM ThanhToan GROUP BY khachId)
SELECT k.id, k.ten, COALESCE(d.tong_dat, 0) AS tong_dat, COALESCE(t.tong_tra, 0) AS tong_tra
FROM Khach k
LEFT JOIN d ON d.khachId = k.id
LEFT JOIN t ON t.khachId = k.id
ORDER BY k.id;`,
    kiem: [
      kq(['An 300/300, Binh 50/0, Chi 0/30', 'An 300/300, Binh 50/0, Chi 0/30'], { thuTu: true }),
      kqAn(['Hidden: Binh pays twice', 'Ẩn: Binh trả hai lần'], 'INSERT INTO ThanhToan VALUES (24, 2, 20), (25, 2, 30)', { thuTu: true }),
      ma(['Two separate aggregations', 'Hai phép gộp riêng'], '\\bGROUP\\s+BY\\b[\\s\\S]*\\bGROUP\\s+BY\\b'),
    ],
    sai: [
      'SELECT k.id, k.ten, COALESCE(SUM(d.tongTien), 0) AS tong_dat, COALESCE(SUM(t.soTien), 0) AS tong_tra FROM Khach k LEFT JOIN DonDat d ON d.khachId = k.id LEFT JOIN ThanhToan t ON t.khachId = k.id GROUP BY k.id, k.ten ORDER BY k.id;',
      'WITH d AS (SELECT khachId, SUM(tongTien) AS tong_dat FROM DonDat GROUP BY khachId), t AS (SELECT khachId, SUM(soTien) AS tong_tra FROM ThanhToan GROUP BY khachId) SELECT k.id, k.ten, d.tong_dat, t.tong_tra FROM Khach k LEFT JOIN d ON d.khachId = k.id LEFT JOIN t ON t.khachId = k.id ORDER BY k.id;',
      'WITH d AS (SELECT khachId, SUM(tongTien) AS tong_dat FROM DonDat GROUP BY khachId), t AS (SELECT khachId, SUM(soTien) AS tong_tra FROM ThanhToan GROUP BY khachId) SELECT k.id, k.ten, COALESCE(d.tong_dat, 0) AS tong_dat, COALESCE(t.tong_tra, 0) AS tong_tra FROM Khach k JOIN d ON d.khachId = k.id JOIN t ON t.khachId = k.id ORDER BY k.id;',
    ],
    gy: [['Joining two child tables at once multiplies rows: 2 orders × 3 payments = 6 rows for An.', 'Nối hai bảng con cùng lúc nhân dòng: 2 đơn × 3 lần trả = 6 dòng cho An.'], ['Reduce each child to one row per customer first.', 'Thu mỗi bảng con về một dòng mỗi khách trước.']],
    lhg: [['SUM after joining both tables: An shows 900 / 900.', 'SUM sau khi nối cả hai bảng: An hiện 900 / 900.'], ['Inner joins: customers with no orders or no payments vanish.', 'Nối trong: khách không có đơn hoặc không trả tiền biến mất.']],
    gt: ['<p>The fan-out bug is the most common wrong number in real dashboards: the query runs, the totals look plausible, and they are multiplied. Pre-aggregate, or use correlated subqueries in the SELECT list.</p>', '<p>Lỗi fan-out là con số sai phổ biến nhất trong dashboard thật: truy vấn chạy, tổng trông hợp lý, và nó đã bị nhân lên. Gộp trước, hoặc dùng truy vấn con tương quan trong danh sách SELECT.</p>'],
    tn: [tn('fan-out', 'nhân dòng khi nối')],
  }),
  de({
    csdl: SACH, tenCsdl: 'Sach', ld: { en: '<p><code>Sach(id, ten)</code> — 3 books; <code>MuaSach(id, khachId, sachId)</code> — purchases, a customer may buy the same book twice.</p>', vi: '<p><code>Sach(id, ten)</code> — 3 cuốn; <code>MuaSach(id, khachId, sachId)</code> — lượt mua, một khách có thể mua cùng một cuốn hai lần.</p>' },
    t: 'Problem 5 — customers who bought EVERY book (relational division)', k: 'HARD', p: 10,
    kn: ['relational division', 'COUNT(DISTINCT)', 'HAVING'], tag: ['advanced', 'interview', 'division'],
    en: '<p>Return <code>khachId</code> of every customer who bought every book in <code>Sach</code>, sorted.</p>', vi: '<p>Trả <code>khachId</code> của mọi khách đã mua đủ mọi cuốn trong <code>Sach</code>, có sắp xếp.</p>',
    yc: [['GROUP BY khachId HAVING COUNT(DISTINCT sachId) = (SELECT COUNT(*) FROM Sach).', 'GROUP BY khachId HAVING COUNT(DISTINCT sachId) = (SELECT COUNT(*) FROM Sach).'], ['Never hard-code 3: the catalogue grows.', 'Đừng viết cứng số 3: danh mục sẽ lớn lên.']],
    giai: `SELECT khachId
FROM MuaSach
GROUP BY khachId
HAVING COUNT(DISTINCT sachId) = (SELECT COUNT(*) FROM Sach)
ORDER BY khachId;`,
    kiem: [
      kq(['Customers 100 and 300', 'Khách 100 và 300'], { thuTu: true }),
      kqAn(['Hidden: a fourth book appears, customer 300 buys it', 'Ẩn: có cuốn thứ tư, khách 300 mua nó'], "INSERT INTO Sach VALUES (4, 'Docker'); INSERT INTO MuaSach VALUES (12, 300, 4)", { thuTu: true }),
      ma(['Compares with the size of Sach', 'So với số lượng sách trong Sach'], '\\(\\s*SELECT\\s+COUNT\\s*\\(\\s*\\*\\s*\\)\\s+FROM\\s+Sach\\s*\\)'),
    ],
    sai: [
      'SELECT khachId FROM MuaSach GROUP BY khachId HAVING COUNT(sachId) = (SELECT COUNT(*) FROM Sach) ORDER BY khachId;',
      'SELECT khachId FROM MuaSach GROUP BY khachId HAVING COUNT(DISTINCT sachId) = 3 ORDER BY khachId;',
      'SELECT khachId FROM MuaSach GROUP BY khachId HAVING COUNT(DISTINCT sachId) >= 2 ORDER BY khachId;',
    ],
    gy: [['"Every" in a question = division: compare a per-group count with the total count.', '"Mọi/tất cả" trong đề = phép chia: so số đếm mỗi nhóm với tổng số.'], ['DISTINCT protects you from repeated purchases.', 'DISTINCT bảo vệ khỏi lượt mua lặp lại.']],
    lhg: [['COUNT(sachId) without DISTINCT — customer 200 (SQL twice + Java) counts as 3.', 'COUNT(sachId) không DISTINCT — khách 200 (SQL hai lần + Java) bị đếm thành 3.'], ['Hard-coding 3.', 'Viết cứng số 3.']],
    gt: ['<p>The textbook form is a double NOT EXISTS: "there is no book that this customer did not buy". Both forms are correct; the COUNT form is easier to say out loud in an interview.</p>', '<p>Dạng giáo trình là NOT EXISTS lồng hai lần: "không có cuốn nào mà khách này chưa mua". Cả hai dạng đều đúng; dạng COUNT dễ nói thành lời khi phỏng vấn hơn.</p>'],
    tn: [tn('relational division', 'phép chia quan hệ')],
  }),
  de({
    csdl: DP, tenCsdl: 'DatPhong', ld: { en: '<p><code>DatPhong(id, phong, tu, den)</code> — hours of one day; a booking 9–11 covers [9, 11).</p>', vi: '<p><code>DatPhong(id, phong, tu, den)</code> — giờ trong một ngày; lần đặt 9–11 chiếm [9, 11).</p>' },
    t: 'Problem 6 — overlapping room bookings', k: 'MEDIUM', p: 10,
    kn: ['interval overlap', 'self-join', 'a.id < b.id'], tag: ['advanced', 'interview', 'intervals'],
    en: '<p>List every pair of bookings of the same room that overlap: <code>id1, id2</code> with id1 &lt; id2, sorted by id1, id2. Back-to-back bookings (one ends at 10, the next starts at 10) do <b>not</b> overlap.</p>',
    vi: '<p>Liệt kê mọi cặp lần đặt cùng phòng bị chồng nhau: <code>id1, id2</code> với id1 &lt; id2, sắp theo id1, id2. Hai lần đặt nối tiếp (một cái kết thúc lúc 10, cái kia bắt đầu lúc 10) <b>không</b> chồng nhau.</p>',
    yc: [['Two intervals overlap when a.tu < b.den AND b.tu < a.den.', 'Hai khoảng chồng nhau khi a.tu < b.den AND b.tu < a.den.'], ['a.id < b.id lists each pair once and never pairs a booking with itself.', 'a.id < b.id liệt kê mỗi cặp một lần và không bao giờ ghép một lần đặt với chính nó.']],
    giai: `SELECT a.id AS id1, b.id AS id2
FROM DatPhong a
JOIN DatPhong b ON b.phong = a.phong
               AND a.id < b.id
               AND a.tu < b.den
               AND b.tu < a.den
ORDER BY id1, id2;`,
    kiem: [
      kq(['Four overlapping pairs in P1', 'Bốn cặp chồng nhau ở P1'], { thuTu: true }),
      kqAn(['Hidden: a booking inside another one, in P3', 'Ẩn: một lần đặt nằm trong lần khác, ở P3'], "INSERT INTO DatPhong VALUES (8, 'P3', 15, 16), (9, 'P3', 16, 17)", { thuTu: true }),
      ma(['A self-join on DatPhong', 'Tự nối DatPhong'], '\\bDatPhong\\b[\\s\\S]*\\bJOIN\\s+DatPhong\\b'),
    ],
    sai: [
      'SELECT a.id AS id1, b.id AS id2 FROM DatPhong a JOIN DatPhong b ON b.phong = a.phong AND a.id < b.id AND a.tu <= b.den AND b.tu <= a.den ORDER BY id1, id2;',
      'SELECT a.id AS id1, b.id AS id2 FROM DatPhong a JOIN DatPhong b ON b.phong = a.phong AND a.id < b.id AND b.tu > a.tu AND b.tu < a.den ORDER BY id1, id2;',
      'SELECT a.id AS id1, b.id AS id2 FROM DatPhong a JOIN DatPhong b ON a.id < b.id AND a.tu < b.den AND b.tu < a.den ORDER BY id1, id2;',
    ],
    gy: [['Draw two bars: they overlap unless one ends before the other starts.', 'Vẽ hai thanh: chúng chồng nhau trừ khi một thanh kết thúc trước khi thanh kia bắt đầu.'], ['Negate "a ends before b starts OR b ends before a starts".', 'Phủ định "a kết thúc trước khi b bắt đầu HOẶC b kết thúc trước khi a bắt đầu".']],
    lhg: [['<= instead of <: back-to-back bookings 5 and 6 are reported.', '<= thay vì <: hai lần đặt nối tiếp 5 và 6 bị báo.'], ['Only testing "b starts inside a": misses booking 4, which contains booking 1.', 'Chỉ kiểm "b bắt đầu bên trong a": bỏ sót lần đặt 4 chứa trọn lần đặt 1.']],
    gt: ['<p>The two-comparison test covers every case: partial overlap, containment, identical intervals. PostgreSQL can make overlaps impossible at write time: EXCLUDE USING gist (phong WITH =, int4range(tu, den) WITH &&).</p>', '<p>Phép kiểm hai so sánh phủ mọi trường hợp: chồng một phần, chứa trọn, trùng hệt. PostgreSQL có thể cấm chồng lấn ngay khi ghi: EXCLUDE USING gist (phong WITH =, int4range(tu, den) WITH &&).</p>'],
    tn: [tn('half-open interval', 'khoảng nửa mở'), tn('overlap', 'chồng lấn')],
  }),
  de({
    csdl: LS, tenCsdl: 'LichSuDon', ld: { en: '<p><code>LichSuDon(donId, buoc, trangThai)</code> — every status change of every order; a higher buoc is later.</p>', vi: '<p><code>LichSuDon(donId, buoc, trangThai)</code> — mọi lần đổi trạng thái của mọi đơn; buoc lớn hơn là muộn hơn.</p>' },
    t: 'Problem 7 — the latest status of every order', k: 'MEDIUM', p: 8,
    kn: ['latest row per group', 'ROW_NUMBER', 'correlated MAX'], tag: ['advanced', 'interview', 'window'],
    en: '<p>Return <code>donId, trangThai</code> = the current (latest) status of each order, sorted by donId.</p>', vi: '<p>Trả <code>donId, trangThai</code> = trạng thái hiện tại (mới nhất) của mỗi đơn, sắp theo donId.</p>',
    yc: [['ROW_NUMBER() OVER (PARTITION BY donId ORDER BY buoc DESC) = 1, or buoc = (SELECT MAX(buoc) … same order).', 'ROW_NUMBER() OVER (PARTITION BY donId ORDER BY buoc DESC) = 1, hoặc buoc = (SELECT MAX(buoc) … cùng đơn).'], ['Do not rely on insertion order.', 'Đừng dựa vào thứ tự chèn.']],
    giai: `WITH x AS (
    SELECT donId, trangThai, ROW_NUMBER() OVER (PARTITION BY donId ORDER BY buoc DESC) AS rn
    FROM LichSuDon
)
SELECT donId, trangThai
FROM x
WHERE rn = 1
ORDER BY donId;`,
    kiem: [
      kq(['Four orders', 'Bốn đơn'], { thuTu: true }),
      kqAn(['Hidden: order 3 is paid, order 1 is delivered', 'Ẩn: đơn 3 được trả tiền, đơn 1 đã giao'], "INSERT INTO LichSuDon VALUES (3, 2, 'PAID'), (1, 4, 'DELIVERED')", { thuTu: true }),
      ma(['Picks one row per order', 'Chọn một dòng mỗi đơn'], '\\bROW_NUMBER\\b|\\bMAX\\s*\\(\\s*buoc\\s*\\)'),
    ],
    sai: [
      'SELECT donId, MAX(trangThai) AS trangThai FROM LichSuDon GROUP BY donId ORDER BY donId;',
      'WITH x AS (SELECT donId, trangThai, ROW_NUMBER() OVER (PARTITION BY donId ORDER BY buoc) AS rn FROM LichSuDon) SELECT donId, trangThai FROM x WHERE rn = 1 ORDER BY donId;',
    ],
    gy: [['"Latest per group" = rank inside the group by time, keep rank 1.', '"Mới nhất mỗi nhóm" = xếp hạng trong nhóm theo thời gian, giữ hạng 1.'], ['MAX(trangThai) is the alphabetically largest status, not the latest.', 'MAX(trangThai) là trạng thái lớn nhất theo bảng chữ cái, không phải mới nhất.']],
    lhg: [['MAX(trangThai): order 1 shows SHIPPED by luck, order 4 shows PAID instead of DELIVERED.', 'MAX(trangThai): đơn 1 tình cờ ra SHIPPED, đơn 4 ra PAID thay vì DELIVERED.'], ['ORDER BY buoc ascending — that is the FIRST status.', 'ORDER BY buoc tăng dần — đó là trạng thái ĐẦU TIÊN.']],
    gt: ['<p>For a big history table, an index on (donId, buoc DESC) INCLUDE (trangThai) makes both versions cheap; many systems also keep a currentStatus column on the order itself (deliberate denormalisation, CS.6).</p>', '<p>Với bảng lịch sử lớn, chỉ mục (donId, buoc DESC) INCLUDE (trangThai) làm cả hai cách đều rẻ; nhiều hệ còn giữ cột trangThaiHienTai ngay trên đơn (phi chuẩn hoá có chủ ý, CS.6).</p>'],
    tn: [tn('latest-per-group', 'bản ghi mới nhất mỗi nhóm')],
  }),
  de({
    csdl: TRIP, tenCsdl: 'Trips', ld: { en: '<p><code>Users(users_id, banned, role)</code> and <code>Trips(id, client_id, driver_id, city_id, status, request_at)</code> — client 2 is banned.</p>', vi: '<p><code>Users(users_id, banned, role)</code> và <code>Trips(id, client_id, driver_id, city_id, status, request_at)</code> — khách 2 bị cấm.</p>' },
    t: 'Problem 8 — daily cancellation rate, excluding banned users', k: 'HARD', p: 12,
    kn: ['conditional aggregation', 'join filters', 'rate with decimals'], tag: ['advanced', 'interview', 'aggregation'],
    en: '<p>For each day from 2013-10-01 to 2013-10-03: <code>request_at</code> and <code>cancellation_rate</code> = cancelled trips ÷ all trips, counting only trips whose client <b>and</b> driver are both not banned, rounded to 2 decimals as <code>DECIMAL(4,2)</code>. A trip is cancelled when its status is not "completed". Sort by day.</p>',
    vi: '<p>Với mỗi ngày từ 2013-10-01 tới 2013-10-03: <code>request_at</code> và <code>cancellation_rate</code> = số chuyến huỷ ÷ tổng chuyến, chỉ tính chuyến mà cả khách <b>lẫn</b> tài xế đều không bị cấm, làm tròn 2 chữ số dạng <code>DECIMAL(4,2)</code>. Chuyến bị huỷ khi trạng thái khác "completed". Sắp theo ngày.</p>',
    yc: [['Join Users twice (client and driver), both banned = \'No\'.', 'Nối Users hai lần (khách và tài xế), cả hai banned = \'No\'.'], ['SUM(CASE WHEN status <> \'completed\' THEN 1.0 ELSE 0 END) / COUNT(*).', 'SUM(CASE WHEN status <> \'completed\' THEN 1.0 ELSE 0 END) / COUNT(*).']],
    giai: `SELECT t.request_at,
       CAST(ROUND(SUM(CASE WHEN t.status <> 'completed' THEN 1.0 ELSE 0 END) / COUNT(*), 2) AS DECIMAL(4,2)) AS cancellation_rate
FROM Trips t
JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No'
JOIN Users d ON d.users_id = t.driver_id AND d.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;`,
    kiem: [
      kq(['0.33, 0.00, 0.50', '0.33, 0.00, 0.50'], { thuTu: true }),
      kqAn(['Hidden: driver 13 gets banned, and a trip on 2013-10-04 must be ignored', 'Ẩn: tài xế 13 bị cấm, và một chuyến ngày 2013-10-04 phải bị bỏ qua'], "UPDATE Users SET banned = 'Yes' WHERE users_id = 13; INSERT INTO Trips VALUES (11, 1, 10, 1, 'cancelled_by_client', '2013-10-04')", { thuTu: true }),
      ma(['Conditional aggregation', 'Gộp có điều kiện'], '\\bSUM\\s*\\(\\s*CASE\\b'),
    ],
    sai: [
      "SELECT t.request_at, CAST(ROUND(SUM(CASE WHEN t.status <> 'completed' THEN 1.0 ELSE 0 END) / COUNT(*), 2) AS DECIMAL(4,2)) AS cancellation_rate FROM Trips t JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No' WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03' GROUP BY t.request_at ORDER BY t.request_at;",
      "SELECT t.request_at, CAST(ROUND(SUM(CASE WHEN t.status = 'cancelled_by_driver' THEN 1.0 ELSE 0 END) / COUNT(*), 2) AS DECIMAL(4,2)) AS cancellation_rate FROM Trips t JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No' JOIN Users d ON d.users_id = t.driver_id AND d.banned = 'No' WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03' GROUP BY t.request_at ORDER BY t.request_at;",
      "SELECT t.request_at, CAST(ROUND(SUM(CASE WHEN t.status <> 'completed' THEN 1.0 ELSE 0 END) / COUNT(*), 2) AS DECIMAL(4,2)) AS cancellation_rate FROM Trips t JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No' JOIN Users d ON d.users_id = t.driver_id AND d.banned = 'No' GROUP BY t.request_at ORDER BY t.request_at;",
    ],
    gy: [['Filter people in the JOIN conditions, filter days in WHERE.', 'Lọc người trong điều kiện JOIN, lọc ngày trong WHERE.'], ['1.0 makes the division decimal.', '1.0 làm phép chia thành thập phân.']],
    lhg: [['Checking only the client — a banned driver\'s trips still count.', 'Chỉ kiểm khách — chuyến của tài xế bị cấm vẫn được tính.'], ['Counting only one kind of cancellation.', 'Chỉ đếm một kiểu huỷ chuyến.']],
    gt: ['<p>This is LeetCode 262, one of the most asked "hard" SQL questions. A day where every trip is excluded disappears from the result — ask whether it should show 0.00 instead (then you need a calendar, problem 9).</p>', '<p>Đây là LeetCode 262, một trong các câu SQL "khó" hay hỏi nhất. Ngày mà mọi chuyến đều bị loại sẽ biến khỏi kết quả — hỏi lại xem có cần hiện 0.00 không (khi đó cần bảng lịch, bài 9).</p>'],
    tn: [tn('cancellation rate', 'tỉ lệ huỷ')],
  }),
  dePg({
    csdl: DT_PG, tenCsdl: 'don_hang', ld: { en: '<p><code>don_hang(id, ngay, tien)</code> — orders of January–June 2025; March and May have none. PostgreSQL syntax.</p>', vi: '<p><code>don_hang(id, ngay, tien)</code> — đơn tháng 1–6/2025; tháng 3 và tháng 5 không có đơn. Cú pháp PostgreSQL.</p>' },
    t: 'Problem 9 — monthly revenue including the months with zero (PostgreSQL)', k: 'HARD', p: 12,
    kn: ['calendar table', 'generate_series', 'LEFT JOIN to a calendar'], tag: ['advanced', 'interview', 'time-series'],
    en: '<p>Return one row per month from 2025-01 to 2025-06: <code>thang</code> (the first day, as a date) and <code>doanh_thu</code> (0 for a month without orders), sorted by month. Runs on real PostgreSQL: build the months with <code>generate_series</code>.</p>',
    vi: '<p>Trả mỗi tháng một dòng từ 2025-01 tới 2025-06: <code>thang</code> (ngày đầu tháng, kiểu date) và <code>doanh_thu</code> (0 cho tháng không có đơn), sắp theo tháng. Chạy trên PostgreSQL thật: sinh các tháng bằng <code>generate_series</code>.</p>',
    yc: [["generate_series(DATE '2025-01-01', DATE '2025-06-01', INTERVAL '1 month') gives the six month starts.", "generate_series(DATE '2025-01-01', DATE '2025-06-01', INTERVAL '1 month') cho sáu ngày đầu tháng."], ['LEFT JOIN the orders on a half-open month range; COALESCE(SUM(…), 0).', 'LEFT JOIN đơn hàng theo khoảng tháng nửa mở; COALESCE(SUM(…), 0).']],
    giai: `SELECT m::date AS thang,
       COALESCE(SUM(d.tien), 0) AS doanh_thu
FROM generate_series(DATE '2025-01-01', DATE '2025-06-01', INTERVAL '1 month') AS m
LEFT JOIN don_hang d ON d.ngay >= m AND d.ngay < m + INTERVAL '1 month'
GROUP BY m
ORDER BY m;`,
    kiem: [
      kq(['Six months, March and May at 0', 'Sáu tháng, tháng 3 và 5 bằng 0'], { thuTu: true }),
      kqAn(['Hidden: an order on 31 May and one on 1 July', 'Ẩn: một đơn ngày 31/5 và một đơn ngày 1/7'], "INSERT INTO don_hang VALUES (7, '2025-05-31', 40), (8, '2025-07-01', 999)", { thuTu: true }),
      ma(['A generated calendar', 'Lịch được sinh ra'], '\\bgenerate_series\\s*\\('),
    ],
    sai: [
      "SELECT date_trunc('month', ngay)::date AS thang, SUM(tien) AS doanh_thu FROM don_hang GROUP BY 1 ORDER BY 1;",
      "SELECT m::date AS thang, SUM(d.tien) AS doanh_thu FROM generate_series(DATE '2025-01-01', DATE '2025-06-01', INTERVAL '1 month') AS m LEFT JOIN don_hang d ON d.ngay >= m AND d.ngay < m + INTERVAL '1 month' GROUP BY m ORDER BY m;",
      "SELECT m::date AS thang, COALESCE(SUM(d.tien), 0) AS doanh_thu FROM generate_series(DATE '2025-01-01', DATE '2025-06-01', INTERVAL '1 month') AS m LEFT JOIN don_hang d ON d.ngay >= m AND d.ngay <= m + INTERVAL '1 month' GROUP BY m ORDER BY m;",
    ],
    gy: [['Rows that do not exist cannot be grouped: generate the months first, then attach the data.', 'Dòng không tồn tại thì không gộp được: sinh tháng trước, rồi gắn dữ liệu vào.'], ['LEFT JOIN + COALESCE turns "no row" into 0.', 'LEFT JOIN + COALESCE biến "không có dòng" thành 0.']],
    lhg: [['GROUP BY date_trunc on the orders only — March and May are simply missing.', 'GROUP BY date_trunc chỉ trên đơn hàng — tháng 3 và 5 biến mất luôn.'], ['<= at the end of the range — 1 July would be counted in June.', '<= ở cuối khoảng — ngày 1/7 bị tính vào tháng 6.']],
    gt: ['<p>On SQL Server build the months with a recursive CTE (WITH m AS (SELECT CAST(\'2025-01-01\' AS DATE) AS thang UNION ALL SELECT DATEADD(MONTH, 1, thang) FROM m WHERE thang < \'2025-06-01\')) or, on 2022+, GENERATE_SERIES(0, 5) with DATEADD. A permanent calendar table is the usual production answer.</p>', '<p>Trên SQL Server sinh tháng bằng CTE đệ quy (WITH m AS (SELECT CAST(\'2025-01-01\' AS DATE) AS thang UNION ALL SELECT DATEADD(MONTH, 1, thang) FROM m WHERE thang < \'2025-06-01\')) hoặc, từ bản 2022, GENERATE_SERIES(0, 5) kèm DATEADD. Bảng lịch cố định là câu trả lời thường dùng trên production.</p>'],
    tn: [tn('calendar table', 'bảng lịch'), tn('time series', 'chuỗi thời gian')],
  }),
]);
