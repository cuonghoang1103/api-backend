/**
 * DBI202 · ⭐ CS.6 — bài tập thiết kế thật: mô tả → bảng (LMS), soi bảng thiết kế sai, mã giảm giá duy nhất theo shop + xoá mềm,
 * giá theo khoảng hiệu lực, chọn ON DELETE cho blog (trình duyệt), thêm cột NOT NULL UNIQUE vào bảng đang chạy theo lô (SQL Server),
 * soát migration Prisma sinh ra.
 */
import { mod, de, cs, q, qn, bang1, kq, kqAn, sau, chan, duoc, ma, tsql, ck, YC_DDL, tn } from './_chung.mjs';

const LMS = `CREATE TABLE HocVien (
    id    INT          NOT NULL CONSTRAINT pk_hocvien PRIMARY KEY,
    email VARCHAR(254) NOT NULL CONSTRAINT uq_hocvien_email UNIQUE,          -- login ⇒ unique
    hoTen VARCHAR(100) NOT NULL
);
CREATE TABLE KhoaHoc (
    id     INT           NOT NULL CONSTRAINT pk_khoahoc PRIMARY KEY,
    ma     VARCHAR(10)   NOT NULL CONSTRAINT uq_khoahoc_ma UNIQUE,
    ten    VARCHAR(100)  NOT NULL,
    hocPhi DECIMAL(12,0) NOT NULL CONSTRAINT ck_khoahoc_hocphi CHECK (hocPhi >= 0)   -- the CURRENT fee, may change
);
CREATE TABLE DangKy (
    hocVienId   INT           NOT NULL CONSTRAINT fk_dangky_hocvien REFERENCES HocVien (id),
    khoaHocId   INT           NOT NULL CONSTRAINT fk_dangky_khoahoc REFERENCES KhoaHoc (id),
    ngayDangKy  DATE          NOT NULL,
    hocPhiDaTra DECIMAL(12,0) NOT NULL CONSTRAINT ck_dangky_hocphi CHECK (hocPhiDaTra >= 0),  -- snapshot of the fee that day
    diem        DECIMAL(4,2)  NULL CONSTRAINT ck_dangky_diem CHECK (diem BETWEEN 0 AND 10),  -- empty until the end
    CONSTRAINT pk_dangky PRIMARY KEY (hocVienId, khoaHocId)                                   -- no double registration
);`;
const NEN_LMS = "INSERT INTO HocVien (id, email, hoTen) VALUES (1, 'an@fpt.edu.vn', 'An'), (2, 'binh@fpt.edu.vn', 'Binh'); INSERT INTO KhoaHoc (id, ma, ten, hocPhi) VALUES (10, 'DBI202', 'Databases', 2500000), (11, 'CSD201', 'Data structures', 2400000)";

const MGG = `CREATE TABLE MaGiamGia (
    id        INT         NOT NULL CONSTRAINT pk_magiamgia PRIMARY KEY,
    shopId    INT         NOT NULL,
    ma        VARCHAR(20) NOT NULL,
    phanTram  INT         NOT NULL CONSTRAINT ck_magiamgia_pt CHECK (phanTram BETWEEN 1 AND 100),
    deletedAt DATE        NULL
);
CREATE UNIQUE INDEX ux_magiamgia_shop_ma ON MaGiamGia (shopId, ma) WHERE deletedAt IS NULL;   -- unique per shop, live codes only
CREATE VIEW vMaGiamGiaConHan AS
SELECT id, shopId, ma, phanTram FROM MaGiamGia WHERE deletedAt IS NULL;`;

const GIA = `CREATE TABLE GiaDichVu (
  dichVuId INT           NOT NULL,
  tuNgay   DATE          NOT NULL,
  gia      DECIMAL(12,0) NOT NULL,
  CONSTRAINT pk_giadichvu PRIMARY KEY (dichVuId, tuNgay)
);
INSERT INTO GiaDichVu (dichVuId, tuNgay, gia) VALUES
  (1, '2024-01-01', 100000), (1, '2024-06-01', 120000), (1, '2025-01-01', 150000),
  (2, '2024-07-01', 50000), (2, '2024-10-01', 45000), (2, '2025-03-01', 55000),
  (3, '2025-02-01', 80000);`;

const BLOG = `CREATE TABLE Users (
  id  INT         NOT NULL PRIMARY KEY,
  ten VARCHAR(50) NOT NULL
);
CREATE TABLE Category (
  id  INT         NOT NULL PRIMARY KEY,
  ten VARCHAR(50) NOT NULL
);
INSERT INTO Users (id, ten) VALUES (1, 'author'), (2, 'reader');
INSERT INTO Category (id, ten) VALUES (1, 'SQL'), (2, 'Java');`;
const GIAI_BLOG = `CREATE TABLE Post (
    id         INT          NOT NULL CONSTRAINT pk_post PRIMARY KEY,
    authorId   INT          NOT NULL CONSTRAINT fk_post_author   REFERENCES Users (id),                       -- NO ACTION: an author with posts cannot go
    categoryId INT          NULL     CONSTRAINT fk_post_category REFERENCES Category (id) ON DELETE SET NULL, -- posts survive
    title      VARCHAR(100) NOT NULL
);
CREATE TABLE Comment (
    id      INT          NOT NULL CONSTRAINT pk_comment PRIMARY KEY,
    postId  INT          NOT NULL CONSTRAINT fk_comment_post REFERENCES Post (id) ON DELETE CASCADE,   -- comments go with the post
    userId  INT          NULL     CONSTRAINT fk_comment_user REFERENCES Users (id) ON DELETE SET NULL, -- anonymous comment stays
    noiDung VARCHAR(500) NOT NULL
);`;
const DL_BLOG = "INSERT INTO Post (id, authorId, categoryId, title) VALUES (100, 1, 1, 'Indexes'), (101, 1, 2, 'Streams'); INSERT INTO Comment (id, postId, userId, noiDung) VALUES (1, 100, 2, 'Great'), (2, 100, 1, 'Thanks'), (3, 101, 2, 'Nice')";

const KH = `CREATE TABLE dbo.khach_hang (
    id     INT           NOT NULL CONSTRAINT pk_khach_hang PRIMARY KEY,
    ho_ten NVARCHAR(100) NOT NULL
);
GO
WITH n AS (SELECT TOP (10000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn FROM sys.all_columns a CROSS JOIN sys.all_columns b)
INSERT INTO dbo.khach_hang (id, ho_ten) SELECT rn, CONCAT(N'Khách ', rn) FROM n;`;
const GIAI_KH = `-- 1) expand: a NULLable column is a metadata-only change, no long lock
ALTER TABLE dbo.khach_hang ADD ma_khach VARCHAR(8) NULL;
GO
-- 2) backfill in small batches: each UPDATE is its own short transaction
CREATE OR ALTER PROCEDURE dbo.prBackfillMaKhach @lo INT = 1000
AS
BEGIN
    SET NOCOUNT ON;
    WHILE 1 = 1
    BEGIN
        UPDATE TOP (@lo) dbo.khach_hang
        SET ma_khach = CONCAT('KH', RIGHT(CONCAT('000000', id), 6))
        WHERE ma_khach IS NULL;
        IF @@ROWCOUNT = 0 BREAK;
    END
END
GO
EXEC dbo.prBackfillMaKhach @lo = 1000;
GO
-- 3) contract: now the rules can be added
ALTER TABLE dbo.khach_hang ALTER COLUMN ma_khach VARCHAR(8) NOT NULL;
ALTER TABLE dbo.khach_hang ADD CONSTRAINT uq_khach_hang_ma UNIQUE (ma_khach);`;

const SAI_THIET_KE = ['the key changes when the customer changes email, and every order of that customer must change too', 'rounding error: 19,999.99 is stored as 19999.9899999…', '23:59:59.999 rounds up to 2025-01-01 00:00:00.000 — the order moves to next year', '"Lê Thị Ánh Tuyết" can lose its diacritics (stored as ?)'];

export default mod('dbi202-cs6-on', '⭐ CS.6 Exercises: real-world database design', [
  de({
    csdl: '', ld: null,
    t: 'Exercise 1 — from a brief to tables: a mini LMS', k: 'HARD', p: 20,
    kn: ['requirements to constraints', 'composite key', 'snapshot column'], tag: ['advanced', 'design', 'ddl'],
    en: `<p>"Students register for courses. A student cannot register for the same course twice. Each course has a code (unique) and a fee; the fee can change, but a student pays the fee valid on the day they register. A score from 0 to 10 is entered at the end (empty until then). Students log in by email, so emails are unique."</p>
<p>Create exactly these tables and columns, with every rule as a constraint:</p>
<ul><li><code>HocVien(id, email, hoTen)</code></li><li><code>KhoaHoc(id, ma, ten, hocPhi)</code></li><li><code>DangKy(hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra, diem)</code></li></ul>`,
    vi: `<p>"Học viên đăng ký khoá học. Một học viên không đăng ký cùng một khoá hai lần. Mỗi khoá có mã (duy nhất) và học phí; học phí có thể đổi, nhưng học viên trả học phí có hiệu lực vào ngày đăng ký. Điểm từ 0 tới 10 được nhập cuối khoá (trống tới lúc đó). Học viên đăng nhập bằng email nên email là duy nhất."</p>
<p>Tạo đúng các bảng và cột sau, mọi luật thành ràng buộc:</p>
<ul><li><code>HocVien(id, email, hoTen)</code></li><li><code>KhoaHoc(id, ma, ten, hocPhi)</code></li><li><code>DangKy(hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra, diem)</code></li></ul>`,
    yc: [YC_DDL, ['"Pays the fee valid on the day" ⇒ copy it into DangKy.hocPhiDaTra; do not compute it from KhoaHoc.hocPhi later.', '"Trả học phí có hiệu lực ngày đó" ⇒ chép vào DangKy.hocPhiDaTra; đừng tính lại từ KhoaHoc.hocPhi sau này.']],
    giai: LMS,
    kiem: [
      duoc(['Normal registrations, score still empty', 'Đăng ký bình thường, điểm còn trống'], `${NEN_LMS}; INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra, diem) VALUES (1, 10, '2026-09-01', 2500000, NULL), (1, 11, '2026-09-01', 2400000, NULL), (2, 10, '2026-09-02', 2500000, 8.5)`),
      chan(['Registering twice for the same course is refused', 'Đăng ký một khoá hai lần bị từ chối'], `${NEN_LMS}; INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra) VALUES (1, 10, '2026-09-01', 2500000); INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra) VALUES (1, 10, '2026-10-01', 2600000)`, '23505'),
      chan(['Two students with one email are refused', 'Hai học viên một email bị từ chối'], "INSERT INTO HocVien (id, email, hoTen) VALUES (1, 'an@fpt.edu.vn', 'An'), (2, 'an@fpt.edu.vn', 'An 2')", '23505'),
      chan(['Two courses with one code are refused', 'Hai khoá một mã bị từ chối'], "INSERT INTO KhoaHoc (id, ma, ten, hocPhi) VALUES (10, 'DBI202', 'A', 1), (11, 'DBI202', 'B', 1)", '23505'),
      chan(['A score of 11 is refused', 'Điểm 11 bị từ chối'], `${NEN_LMS}; INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra, diem) VALUES (1, 10, '2026-09-01', 2500000, 11)`, '23514'),
      chan(['A negative fee is refused', 'Học phí âm bị từ chối'], "INSERT INTO KhoaHoc (id, ma, ten, hocPhi) VALUES (10, 'X', 'X', -1)", '23514'),
      chan(['A registration for an unknown student is refused', 'Đăng ký cho học viên không tồn tại bị từ chối'], `${NEN_LMS}; INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy, hocPhiDaTra) VALUES (99, 10, '2026-09-01', 2500000)`, '23503'),
      chan(['The fee paid is required', 'Học phí đã trả là bắt buộc'], `${NEN_LMS}; INSERT INTO DangKy (hocVienId, khoaHocId, ngayDangKy) VALUES (1, 10, '2026-09-01')`, '23502'),
      chan(['A missing email is refused', 'Thiếu email bị từ chối'], "INSERT INTO HocVien (id, hoTen) VALUES (1, 'An')", '23502'),
    ],
    sai: [
      LMS.replace("CONSTRAINT pk_dangky PRIMARY KEY (hocVienId, khoaHocId)                                   -- no double registration", 'CONSTRAINT pk_dangky PRIMARY KEY (hocVienId, khoaHocId, ngayDangKy)'),
      LMS.replace(' CONSTRAINT uq_hocvien_email UNIQUE', ''),
      LMS.replace('CHECK (diem BETWEEN 0 AND 10)', 'CHECK (diem >= 0)'),
      LMS.replace('hocPhiDaTra DECIMAL(12,0) NOT NULL', 'hocPhiDaTra DECIMAL(12,0) NULL'),
      LMS.replace(' CONSTRAINT fk_dangky_hocvien REFERENCES HocVien (id)', ''),
    ],
    gy: [['"Cannot twice" on a pair ⇒ the pair is the key of DangKy.', '"Không được hai lần" trên một cặp ⇒ cặp đó là khoá của DangKy.'], ['A value that must not change when the source changes ⇒ store a snapshot.', 'Giá trị không được đổi khi nguồn đổi ⇒ lưu bản chụp.']],
    lhg: [['Adding ngayDangKy to the key — the same course can then be registered on another day.', 'Thêm ngayDangKy vào khoá — khi đó đăng ký được cùng khoá vào ngày khác.'], ['Reading the fee from KhoaHoc at report time — every past registration changes when the fee changes.', 'Đọc học phí từ KhoaHoc lúc làm báo cáo — mọi lần đăng ký cũ đổi theo khi học phí đổi.']],
    gt: ['<p>Each sentence of the brief became exactly one constraint, and each constraint has a test that tries to break it — that is how you defend a schema in a review.</p>', '<p>Mỗi câu của mô tả thành đúng một ràng buộc, và mỗi ràng buộc có một phép thử cố phá nó — đó là cách bảo vệ lược đồ trong buổi review.</p>'],
    tn: [tn('snapshot column', 'cột lưu bản chụp'), tn('composite primary key', 'khoá chính ghép')],
  }),
  cs({
    t: 'Exercise 2 — what is wrong with this table?', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['bad keys', 'FLOAT money', 'DATETIME rounding', 'Unicode'], tag: ['advanced', 'design', 'review'],
    en: '<p>A previous team left <code>don_cu(email_khach VARCHAR(100) PRIMARY KEY, ten_khach VARCHAR(100), tong_tien FLOAT, ngay_dat DATETIME)</code> on SQL Server, holding one order of 19,999.99 placed at 23:59:59.999 on 31 Dec 2024 by "Lê Thị Ánh Tuyết". For each column, what goes wrong, and what is the fix?</p>',
    vi: '<p>Nhóm trước để lại <code>don_cu(email_khach VARCHAR(100) PRIMARY KEY, ten_khach VARCHAR(100), tong_tien FLOAT, ngay_dat DATETIME)</code> trên SQL Server, chứa một đơn 19.999,99 đặt lúc 23:59:59.999 ngày 31/12/2024 của "Lê Thị Ánh Tuyết". Với mỗi cột, chuyện gì sai và sửa thế nào?</p>',
    bang: [bang1('b1', ['Column → what goes wrong → fix', 'Cột → sai gì → sửa'],
      [{ ma: 'cot', ten: 'Column / Cột' },
        { ma: 'sai', ten: 'What goes wrong', luaChon: SAI_THIET_KE.concat(['each customer can place only one order, ever']) },
        { ma: 'sua', ten: 'Fix', luaChon: ['surrogate id PK + customer table with a UNIQUE email', 'DECIMAL(19,2)', 'DATETIME2(3) or DATETIMEOFFSET', 'NVARCHAR(100)'] }],
      [{ o: { cot: 'email_khach VARCHAR(100) PRIMARY KEY' }, a: { sai: 'each customer can place only one order, ever', sua: 'surrogate id PK + customer table with a UNIQUE email' } },
        { o: { cot: 'tong_tien FLOAT' }, a: { sai: 'rounding error: 19,999.99 is stored as 19999.9899999…', sua: 'DECIMAL(19,2)' } },
        { o: { cot: 'ngay_dat DATETIME' }, a: { sai: '23:59:59.999 rounds up to 2025-01-01 00:00:00.000 — the order moves to next year', sua: 'DATETIME2(3) or DATETIMEOFFSET' } },
        { o: { cot: 'ten_khach VARCHAR(100)' }, a: { sai: '"Lê Thị Ánh Tuyết" can lose its diacritics (stored as ?)', sua: 'NVARCHAR(100)' } }],
      ['The email key is the worst one: an order table keyed by the customer allows a single order per customer, and changing an email rewrites history. DATETIME is accurate only to 1/300 s, so .999 rounds to the next second — here, the next year.', 'Khoá email là lỗi nặng nhất: bảng đơn hàng có khoá là khách hàng chỉ cho mỗi khách một đơn, và đổi email là viết lại lịch sử. DATETIME chỉ chính xác tới 1/300 giây nên .999 làm tròn sang giây kế — ở đây là sang năm sau.'])],
    gy: [['Ask "how many orders can one customer have?" about the key.', 'Hỏi "một khách có bao nhiêu đơn?" về khoá.'], ['DATETIME stores .000, .003, .007 only.', 'DATETIME chỉ lưu .000, .003, .007.']],
    lhg: [['Thinking FLOAT is fine because it "shows" 19999.99.', 'Tưởng FLOAT ổn vì nó "hiện" 19999.99.'], ['Missing that .999 is not representable in DATETIME.', 'Không thấy .999 không biểu diễn được trong DATETIME.']],
    tn: [tn('floating point', 'số dấu phẩy động'), tn('precision', 'độ chính xác')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Exercise 3 — discount codes: unique per shop, soft-deleted, reusable', k: 'MEDIUM', p: 12,
    kn: ['composite filtered unique index', 'soft delete', 'view'], tag: ['advanced', 'design', 'soft-delete'],
    en: '<p>Each shop creates discount codes. A code is unique <b>within a shop</b> (two shops may both use TET2025); retired codes are soft-deleted and may be reused next year. Create:</p><ul><li><code>MaGiamGia(id, shopId, ma, phanTram 1–100, deletedAt NULL)</code>;</li><li>the index <code>ux_magiamgia_shop_ma</code> enforcing the rule;</li><li>the view <code>vMaGiamGiaConHan(id, shopId, ma, phanTram)</code> of live codes.</li></ul>',
    vi: '<p>Mỗi shop tạo mã giảm giá. Mã là duy nhất <b>trong một shop</b> (hai shop có thể cùng dùng TET2025); mã nghỉ được xoá mềm và dùng lại năm sau. Tạo:</p><ul><li><code>MaGiamGia(id, shopId, ma, phanTram 1–100, deletedAt NULL)</code>;</li><li>chỉ mục <code>ux_magiamgia_shop_ma</code> thi hành luật;</li><li>view <code>vMaGiamGiaConHan(id, shopId, ma, phanTram)</code> gồm các mã còn hiệu lực.</li></ul>',
    yc: [YC_DDL, ['The uniqueness covers the pair (shopId, ma), only for rows WHERE deletedAt IS NULL.', 'Tính duy nhất trên cặp (shopId, ma), chỉ cho dòng WHERE deletedAt IS NULL.']],
    giai: MGG,
    kiem: [
      duoc(['Two shops use the same code', 'Hai shop dùng cùng một mã'], "INSERT INTO MaGiamGia VALUES (1, 1, 'TET2025', 10, NULL), (2, 2, 'TET2025', 15, NULL)"),
      chan(['The same shop cannot have the code twice while live', 'Một shop không có cùng mã hai lần khi còn hiệu lực'], "INSERT INTO MaGiamGia VALUES (1, 1, 'TET2025', 10, NULL); INSERT INTO MaGiamGia VALUES (2, 1, 'TET2025', 20, NULL)", '23505'),
      duoc(['A retired code is reused the next year', 'Mã đã nghỉ được dùng lại năm sau'], "INSERT INTO MaGiamGia VALUES (1, 1, 'TET', 10, '2025-03-01'), (2, 1, 'TET', 12, '2026-03-01'), (3, 1, 'TET', 15, NULL)"),
      chan(['0 % is refused', '0 % bị từ chối'], "INSERT INTO MaGiamGia VALUES (1, 1, 'X', 0, NULL)", '23514'),
      sau(['The view lists only live codes', 'View chỉ liệt kê mã còn hiệu lực'], "INSERT INTO MaGiamGia VALUES (1, 1, 'TET', 10, '2025-03-01'), (2, 1, 'TET', 12, NULL), (3, 2, 'SALE', 30, NULL), (4, 2, 'OLD', 5, '2024-01-01'); SELECT id, shopId, ma, phanTram FROM vMaGiamGiaConHan ORDER BY id"),
    ],
    sai: [
      MGG.replace('ON MaGiamGia (shopId, ma) WHERE deletedAt IS NULL', 'ON MaGiamGia (ma) WHERE deletedAt IS NULL'),
      MGG.replace('ON MaGiamGia (shopId, ma) WHERE deletedAt IS NULL', 'ON MaGiamGia (shopId, ma)'),
      MGG.replace('FROM MaGiamGia WHERE deletedAt IS NULL;', 'FROM MaGiamGia;'),
    ],
    gy: [['Composite + filtered: CREATE UNIQUE INDEX … ON t (shopId, ma) WHERE deletedAt IS NULL.', 'Ghép + lọc: CREATE UNIQUE INDEX … ON t (shopId, ma) WHERE deletedAt IS NULL.'], ['The view hides the soft-delete detail from every query.', 'View giấu chi tiết xoá mềm khỏi mọi truy vấn.']],
    lhg: [['Unique on ma alone — shop 2 cannot use TET2025.', 'Duy nhất chỉ trên ma — shop 2 không dùng được TET2025.'], ['No filter — a retired code can never be reused.', 'Không lọc — mã đã nghỉ không bao giờ dùng lại được.']],
    gt: ['<p>"Unique within X" always means a composite key or index that starts with X. Add the soft-delete filter and the rule follows the business exactly.</p>', '<p>"Duy nhất trong X" luôn nghĩa là khoá hoặc chỉ mục ghép bắt đầu bằng X. Thêm điều kiện xoá mềm là luật khớp đúng nghiệp vụ.</p>'],
    tn: [tn('scoped uniqueness', 'duy nhất trong phạm vi')],
  }),
  de({
    csdl: GIA, tenCsdl: 'GiaDichVu', ld: { en: '<p><code>GiaDichVu(dichVuId, tuNgay, gia)</code> — each row: the price of a service from a date until the next row.</p>', vi: '<p><code>GiaDichVu(dichVuId, tuNgay, gia)</code> — mỗi dòng: giá của dịch vụ từ một ngày tới dòng kế tiếp.</p>' },
    t: 'Exercise 4 — price periods: what did it cost on 31 December 2024?', k: 'MEDIUM', p: 10,
    kn: ['valid-from history', 'correlated subquery', 'as-of query'], tag: ['advanced', 'design', 'history'],
    en: '<p>Return <code>dichVuId, gia</code> = the price of every service valid on <b>2024-12-31</b> (the row with the latest tuNgay that is not after that date). A service with no price yet on that day does not appear. Sort by dichVuId.</p>',
    vi: '<p>Trả <code>dichVuId, gia</code> = giá của mọi dịch vụ có hiệu lực ngày <b>2024-12-31</b> (dòng có tuNgay muộn nhất không sau ngày đó). Dịch vụ chưa có giá vào ngày đó thì không hiện. Sắp theo dichVuId.</p>',
    yc: [['tuNgay = (SELECT MAX(tuNgay) … WHERE same service AND tuNgay <= \'2024-12-31\').', 'tuNgay = (SELECT MAX(tuNgay) … WHERE cùng dịch vụ AND tuNgay <= \'2024-12-31\').'], ['A price starting exactly on 2024-12-31 is already valid that day.', 'Giá bắt đầu đúng ngày 2024-12-31 đã có hiệu lực ngày đó.']],
    giai: `SELECT g.dichVuId, g.gia
FROM GiaDichVu g
WHERE g.tuNgay = (SELECT MAX(x.tuNgay)
                  FROM GiaDichVu x
                  WHERE x.dichVuId = g.dichVuId
                    AND x.tuNgay <= '2024-12-31')
ORDER BY g.dichVuId;`,
    kiem: [
      kq(['Services 1 and 2', 'Dịch vụ 1 và 2'], { thuTu: true }),
      kqAn(['Hidden: a price change exactly on 31 December and a new service from that day', 'Ẩn: đổi giá đúng ngày 31/12 và dịch vụ mới từ ngày đó'], "INSERT INTO GiaDichVu VALUES (1, '2024-12-31', 130000), (4, '2024-12-31', 99000)", { thuTu: true }),
      ma(['Compares tuNgay with the date', 'So tuNgay với ngày'], "tuNgay\\s*<=?\\s*'2024-12-31'"),
    ],
    sai: [
      "SELECT g.dichVuId, g.gia FROM GiaDichVu g WHERE g.tuNgay = (SELECT MAX(x.tuNgay) FROM GiaDichVu x WHERE x.dichVuId = g.dichVuId AND x.tuNgay < '2024-12-31') ORDER BY g.dichVuId;",
      "SELECT dichVuId, MAX(gia) AS gia FROM GiaDichVu WHERE tuNgay <= '2024-12-31' GROUP BY dichVuId ORDER BY dichVuId;",
      "SELECT g.dichVuId, g.gia FROM GiaDichVu g WHERE g.tuNgay = (SELECT MAX(x.tuNgay) FROM GiaDichVu x WHERE x.tuNgay <= '2024-12-31') ORDER BY g.dichVuId;",
    ],
    gy: [['"Valid on day X" = the latest start that is ≤ X, per service.', '"Hiệu lực ngày X" = lần bắt đầu muộn nhất ≤ X, theo từng dịch vụ.'], ['Correlate the subquery on dichVuId.', 'Tương quan truy vấn con theo dichVuId.']],
    lhg: [['MAX(gia) — prices can go down too.', 'MAX(gia) — giá cũng có thể giảm.'], ['< instead of <= — a change on the day itself is missed.', '< thay vì <= — lần đổi giá đúng ngày đó bị bỏ sót.']],
    gt: ['<p>Storing only the start date keeps periods gap-free by construction (each period ends where the next begins). PostgreSQL can instead store a daterange and forbid overlaps with EXCLUDE USING gist; SQL Server system-versioned temporal tables track <i>system</i> time, not business-decided dates.</p>', '<p>Chỉ lưu ngày bắt đầu khiến các khoảng tự liền mạch (khoảng này kết thúc nơi khoảng sau bắt đầu). PostgreSQL có thể lưu daterange và cấm chồng lấn bằng EXCLUDE USING gist; bảng temporal của SQL Server theo dõi thời gian <i>hệ thống</i>, không phải ngày do nghiệp vụ quyết.</p>'],
    tn: [tn('as-of query', 'truy vấn tại một thời điểm'), tn('application time', 'thời gian nghiệp vụ')],
  }),
  de({
    csdl: BLOG, tenCsdl: 'Blog', ld: { en: '<p><code>Users(id, ten)</code>: 1 author, 2 reader. <code>Category(id, ten)</code>: 1 SQL, 2 Java.</p>', vi: '<p><code>Users(id, ten)</code>: 1 author, 2 reader. <code>Category(id, ten)</code>: 1 SQL, 2 Java.</p>' },
    t: 'Exercise 5 — choose ON DELETE for a blog, then prove it', k: 'HARD', p: 15,
    kn: ['ON DELETE CASCADE', 'ON DELETE SET NULL', 'NO ACTION'], tag: ['advanced', 'design', 'constraints'],
    en: '<p>Create <code>Post(id, authorId, categoryId NULL, title)</code> and <code>Comment(id, postId, userId NULL, noiDung)</code> so that:</p><ul><li>deleting a category does not delete its posts;</li><li>deleting a post deletes its comments;</li><li>a reader who deletes the account leaves anonymous comments behind;</li><li>an author who still has posts cannot be deleted.</li></ul>',
    vi: '<p>Tạo <code>Post(id, authorId, categoryId NULL, title)</code> và <code>Comment(id, postId, userId NULL, noiDung)</code> sao cho:</p><ul><li>xoá chuyên mục không xoá bài viết của nó;</li><li>xoá bài viết thì xoá bình luận của nó;</li><li>người đọc xoá tài khoản thì để lại bình luận ẩn danh;</li><li>tác giả còn bài viết thì không xoá được.</li></ul>',
    yc: [YC_DDL, ['Four foreign keys, four ON DELETE decisions (NO ACTION is the default when you write nothing).', 'Bốn khoá ngoại, bốn quyết định ON DELETE (không ghi gì thì mặc định NO ACTION).']],
    giai: GIAI_BLOG,
    kiem: [
      sau(['Deleting category SQL keeps the post, its category becomes NULL', 'Xoá chuyên mục SQL giữ bài viết, chuyên mục thành NULL'], `${DL_BLOG}; DELETE FROM Category WHERE id = 1; SELECT id, categoryId FROM Post ORDER BY id`),
      sau(['Deleting post 100 deletes its two comments only', 'Xoá bài 100 chỉ xoá hai bình luận của nó'], `${DL_BLOG}; DELETE FROM Post WHERE id = 100; SELECT id, postId FROM Comment ORDER BY id`),
      sau(['Deleting the reader keeps the comments, anonymously', 'Xoá người đọc giữ bình luận, ẩn danh'], `${DL_BLOG}; DELETE FROM Users WHERE id = 2; SELECT id, userId FROM Comment ORDER BY id`),
      chan(['Deleting an author who has posts is refused', 'Xoá tác giả còn bài viết bị từ chối'], `${DL_BLOG}; DELETE FROM Users WHERE id = 1`, '23503'),
      chan(['A post needs an author', 'Bài viết cần tác giả'], "INSERT INTO Post (id, categoryId, title) VALUES (1, 1, 'x')", '23502'),
    ],
    sai: [
      GIAI_BLOG.replace('REFERENCES Category (id) ON DELETE SET NULL', 'REFERENCES Category (id) ON DELETE CASCADE'),
      GIAI_BLOG.replace('REFERENCES Post (id) ON DELETE CASCADE', 'REFERENCES Post (id)'),
      GIAI_BLOG.replace('REFERENCES Users (id) ON DELETE SET NULL', 'REFERENCES Users (id) ON DELETE CASCADE'),
      GIAI_BLOG.replace('REFERENCES Users (id),                       -- NO ACTION', 'REFERENCES Users (id) ON DELETE CASCADE,  -- wrong'),
    ],
    gy: [['Optional link + "keep the child" ⇒ SET NULL (the column must allow NULL).', 'Liên kết tuỳ chọn + "giữ con" ⇒ SET NULL (cột phải cho NULL).'], ['"Cannot be deleted while …" ⇒ leave the default NO ACTION.', '"Không xoá được khi còn …" ⇒ để mặc định NO ACTION.']],
    lhg: [['CASCADE from Users to Comment — a reader\'s comments vanish with the account.', 'CASCADE từ Users sang Comment — bình luận của người đọc biến mất theo tài khoản.'], ['CASCADE from Users to Post — deleting an author silently deletes their whole blog.', 'CASCADE từ Users sang Post — xoá tác giả âm thầm xoá cả blog của họ.']],
    gt: ['<p>Note the chain: deleting a post cascades to comments; deleting an author is blocked by Post (NO ACTION) before anything cascades. SQL Server refuses some combinations of cascade paths ("may cause cycles or multiple cascade paths") — Comment has two FKs, but only one of them cascades, so this design is accepted.</p>', '<p>Chú ý chuỗi: xoá bài viết lan sang bình luận; xoá tác giả bị Post (NO ACTION) chặn trước khi có gì lan đi. SQL Server từ chối một số tổ hợp đường lan ("may cause cycles or multiple cascade paths") — Comment có hai khoá ngoại nhưng chỉ một cái lan nên thiết kế này được chấp nhận.</p>'],
    tn: [tn('ON DELETE SET NULL', 'đặt NULL khi xoá cha')],
  }),
  tsql({
    t: 'Exercise 6 — add a NOT NULL UNIQUE column to a live table, in batches', k: 'HARD', p: 20,
    kn: ['expand/contract', 'batched UPDATE', 'UPDATE TOP', '@@ROWCOUNT'], tag: ['advanced', 'design', 'migration'],
    lyDo: ['ALTER TABLE … ALTER COLUMN, UPDATE TOP (n) in a WHILE loop and @@ROWCOUNT are SQL Server syntax, and the point is a 10,000-row table that is being used while you change it.', 'ALTER TABLE … ALTER COLUMN, UPDATE TOP (n) trong vòng WHILE và @@ROWCOUNT là cú pháp SQL Server, và điểm mấu chốt là bảng 10.000 dòng đang được dùng trong lúc bạn đổi nó.'],
    en: `<p><code>khach_hang(id, ho_ten)</code> has 10,000 rows and the app is running. Add <code>ma_khach</code> = <code>KH</code> + the id on 6 digits (id 7 → <code>KH000007</code>), which must end up <b>NOT NULL</b> and <b>UNIQUE</b> (constraint <code>uq_khach_hang_ma</code>) — without one long UPDATE that locks the whole table.</p>
<ol><li>Add the column as NULL.</li><li>Write <code>dbo.prBackfillMaKhach @lo INT = 1000</code> that fills it <b>in batches</b> (UPDATE TOP (@lo) … in a WHILE loop until nothing is left), and run it.</li><li>Then make the column NOT NULL and add the UNIQUE constraint.</li></ol>`,
    vi: `<p><code>khach_hang(id, ho_ten)</code> có 10.000 dòng và app đang chạy. Thêm <code>ma_khach</code> = <code>KH</code> + id đủ 6 chữ số (id 7 → <code>KH000007</code>), cuối cùng phải <b>NOT NULL</b> và <b>UNIQUE</b> (ràng buộc <code>uq_khach_hang_ma</code>) — không dùng một câu UPDATE dài khoá cả bảng.</p>
<ol><li>Thêm cột dạng NULL.</li><li>Viết <code>dbo.prBackfillMaKhach @lo INT = 1000</code> điền cột <b>theo lô</b> (UPDATE TOP (@lo) … trong vòng WHILE tới khi hết), rồi chạy nó.</li><li>Sau đó đặt cột NOT NULL và thêm ràng buộc UNIQUE.</li></ol>`,
    yc: [["CONCAT('KH', RIGHT(CONCAT('000000', id), 6)) builds the code.", "CONCAT('KH', RIGHT(CONCAT('000000', id), 6)) dựng mã."], ['Stop the loop with IF @@ROWCOUNT = 0 BREAK right after the UPDATE.', 'Dừng vòng bằng IF @@ROWCOUNT = 0 BREAK ngay sau UPDATE.']],
    setup: KH,
    khoi: `-- 1) ALTER TABLE dbo.khach_hang ADD ma_khach ... NULL;
-- 2) CREATE OR ALTER PROCEDURE dbo.prBackfillMaKhach @lo INT = 1000 AS ... ; EXEC it
-- 3) ALTER COLUMN ... NOT NULL; ADD CONSTRAINT uq_khach_hang_ma UNIQUE (ma_khach);`,
    giai: GIAI_KH,
    kiem: [
      ck(['Every customer has the right code (KH000007, KH010000…)', 'Mọi khách có đúng mã (KH000007, KH010000…)'], `SET @ok = IIF(COL_LENGTH(N'dbo.khach_hang', N'ma_khach') IS NOT NULL, 1, 0);
IF @ok = 1 EXEC sp_executesql N'SELECT @o = IIF(NOT EXISTS (SELECT 1 FROM dbo.khach_hang WHERE ma_khach IS NULL OR ma_khach <> CONCAT(''KH'', RIGHT(CONCAT(''000000'', id), 6))) AND (SELECT ma_khach FROM dbo.khach_hang WHERE id = 7) = ''KH000007'', 1, 0)', N'@o BIT OUTPUT', @o = @ok OUTPUT;
SET @info = N'expected KH + 6-digit id on every row';`),
      ck(['ma_khach is NOT NULL', 'ma_khach là NOT NULL'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.khach_hang') AND name = N'ma_khach' AND is_nullable = 0), 1, 0);
SET @info = N'ALTER TABLE … ALTER COLUMN ma_khach VARCHAR(8) NOT NULL';`),
      ck(['uq_khach_hang_ma refuses a duplicate code', 'uq_khach_hang_ma từ chối mã trùng'], `${''}DECLARE @c INT = 0; BEGIN TRAN;
IF COL_LENGTH(N'dbo.khach_hang', N'ma_khach') IS NOT NULL
BEGIN TRY EXEC (N'INSERT INTO dbo.khach_hang (id, ho_ten, ma_khach) VALUES (20000, N''Trùng'', ''KH000007'')'); END TRY BEGIN CATCH SET @c = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@c = 1 AND EXISTS (SELECT 1 FROM sys.key_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.khach_hang') AND name = N'uq_khach_hang_ma' AND type = 'UQ'), 1, 0);
SET @info = CONCAT(N'duplicate refused: ', @c);`),
      ck(['The backfill works in batches (WHILE + UPDATE TOP)', 'Việc điền dữ liệu chạy theo lô (WHILE + UPDATE TOP)'], `DECLARE @d NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.prBackfillMaKhach'));
SET @ok = IIF(@d LIKE N'%WHILE%' AND @d LIKE N'%UPDATE TOP%', 1, 0);
SET @info = IIF(@d IS NULL, N'procedure dbo.prBackfillMaKhach not found', N'expected WHILE … UPDATE TOP (@lo) …');`),
    ],
    saiTay: [
      GIAI_KH.replace("ALTER TABLE dbo.khach_hang ADD CONSTRAINT uq_khach_hang_ma UNIQUE (ma_khach);", ''),
      GIAI_KH.replace("ALTER TABLE dbo.khach_hang ALTER COLUMN ma_khach VARCHAR(8) NOT NULL;", ''),
      GIAI_KH.replace("SET ma_khach = CONCAT('KH', RIGHT(CONCAT('000000', id), 6))", "SET ma_khach = CONCAT('KH', id)"),
      GIAI_KH.replace(`    WHILE 1 = 1
    BEGIN
        UPDATE TOP (@lo) dbo.khach_hang
        SET ma_khach = CONCAT('KH', RIGHT(CONCAT('000000', id), 6))
        WHERE ma_khach IS NULL;
        IF @@ROWCOUNT = 0 BREAK;
    END`, `    UPDATE dbo.khach_hang
    SET ma_khach = CONCAT('KH', RIGHT(CONCAT('000000', id), 6));`),
    ],
    gy: [['Adding a NULL column without a default is instant; adding NOT NULL first would need a value for 10,000 rows at once.', 'Thêm cột NULL không mặc định là tức thì; thêm NOT NULL trước thì cần giá trị cho 10.000 dòng một lúc.'], ['Each batch commits on its own: locks stay small and the log can be reused.', 'Mỗi lô tự commit: khoá nhỏ và nhật ký được dùng lại.']],
    lhg: [['One UPDATE of the whole table — one long transaction, possibly a table lock (escalation past ~5,000 row locks).', 'Một UPDATE cả bảng — một giao dịch dài, có thể khoá bảng (leo thang khi vượt ~5.000 khoá dòng).'], ["CONCAT('KH', id) — KH7 instead of KH000007, and the codes do not sort.", "CONCAT('KH', id) — KH7 thay vì KH000007, và mã không sắp đúng thứ tự."]],
    gt: ['<p>On a real system step 2 runs while new customers keep arriving: the app must already write ma_khach for new rows (dual write) before the backfill starts, otherwise a row inserted during the loop stays NULL and step 3 fails.</p>', '<p>Trên hệ thống thật, bước 2 chạy trong khi khách mới vẫn đến: app phải ghi ma_khach cho dòng mới (ghi đôi) trước khi đổ dữ liệu, nếu không dòng chèn trong lúc vòng chạy sẽ còn NULL và bước 3 lỗi.</p>'],
    tn: [tn('batched update', 'cập nhật theo lô')],
  }),
  cs({
    t: 'Exercise 7 — review the migration Prisma generates for the LMS', k: 'MEDIUM', p: 7,
    kn: ['Prisma', 'generated migrations', 'CHECK constraints'], tag: ['advanced', 'design', 'prisma'],
    en: `<p>The LMS of exercise 1 written in Prisma:</p>
<pre>model HocVien { id Int @id @default(autoincrement())  email String @unique @db.VarChar(254)  hoTen String @db.VarChar(100)  dangKy DangKy[] }
model KhoaHoc { id Int @id @default(autoincrement())  ma String @unique @db.VarChar(10)  ten String  hocPhi Decimal @db.Decimal(12, 0)  dangKy DangKy[] }
model DangKy  { hocVienId Int  khoaHocId Int  ngayDangKy DateTime @db.Date  hocPhiDaTra Decimal @db.Decimal(12, 0)  diem Decimal? @db.Decimal(4, 2)
                hocVien HocVien @relation(fields: [hocVienId], references: [id])
                khoaHoc KhoaHoc @relation(fields: [khoaHocId], references: [id])
                @@id([hocVienId, khoaHocId])  @@index([khoaHocId]) }</pre>`,
    vi: `<p>LMS của bài 1 viết bằng Prisma:</p>
<pre>model HocVien { id Int @id @default(autoincrement())  email String @unique @db.VarChar(254)  hoTen String @db.VarChar(100)  dangKy DangKy[] }
model KhoaHoc { id Int @id @default(autoincrement())  ma String @unique @db.VarChar(10)  ten String  hocPhi Decimal @db.Decimal(12, 0)  dangKy DangKy[] }
model DangKy  { hocVienId Int  khoaHocId Int  ngayDangKy DateTime @db.Date  hocPhiDaTra Decimal @db.Decimal(12, 0)  diem Decimal? @db.Decimal(4, 2)
                hocVien HocVien @relation(fields: [hocVienId], references: [id])
                khoaHoc KhoaHoc @relation(fields: [khoaHocId], references: [id])
                @@id([hocVienId, khoaHocId])  @@index([khoaHocId]) }</pre>`,
    cau: [
      qn('c1', ['Which rules of exercise 1 are MISSING from the SQL that prisma migrate generates? (choose all)', 'Luật nào của bài 1 THIẾU trong SQL mà prisma migrate sinh ra? (chọn tất cả)'], ['diem BETWEEN 0 AND 10', 'hocPhi >= 0', 'hocPhiDaTra >= 0', 'UNIQUE on email', 'the composite primary key of DangKy', 'the foreign key to KhoaHoc'], [0, 1, 2], ['Prisma\'s schema language has no CHECK: the three value rules must be added by hand to migration.sql. @unique, @@id and @relation are generated.', 'Ngôn ngữ schema của Prisma không có CHECK: ba luật giá trị phải tự thêm vào migration.sql. @unique, @@id và @relation đều được sinh.']),
      q('c2', ['Why is there @@index([khoaHocId]) but no index on hocVienId?', 'Vì sao có @@index([khoaHocId]) mà không có chỉ mục trên hocVienId?'], ['hocVienId is already the leading column of the composite primary key', 'Prisma never indexes the first foreign key of a model', 'hocVienId is a smaller column, so it needs no index', 'the index on hocVienId is created by @unique on email'], ['The PK (hocVienId, khoaHocId) serves lookups by hocVienId; khoaHocId needs its own index for the FK and joins.', 'Khoá chính (hocVienId, khoaHocId) phục vụ tra theo hocVienId; khoaHocId cần chỉ mục riêng cho khoá ngoại và phép nối.']),
      q('c3', ['How do you add the missing CHECKs and keep them across future migrations?', 'Thêm các CHECK còn thiếu và giữ chúng qua các migration sau bằng cách nào?'], ['migrate dev --create-only, append ADD CONSTRAINT, then apply', 'edit the tables in SSMS directly on the production server', 'keep the rules in the application code only, never in SQL', 'run prisma db push after each change to the schema file'], ['Prisma keeps hand-written SQL in the migration history; later migrations do not drop constraints they do not know about.', 'Prisma giữ SQL viết tay trong lịch sử migration; migration sau không xoá ràng buộc mà nó không biết.']),
    ],
    gy: [['Read every generated migration.sql before applying it.', 'Đọc mọi migration.sql được sinh trước khi áp dụng.'], ['ORMs generate structure, not business rules.', 'ORM sinh cấu trúc, không sinh luật nghiệp vụ.']],
    lhg: [['Assuming @db.Decimal(4, 2) limits the score to 10 — it allows up to 99.99.', 'Tưởng @db.Decimal(4, 2) giới hạn điểm ≤ 10 — nó cho tới 99.99.'], ['Fixing the database by hand outside migrations — the next environment does not get it.', 'Sửa CSDL bằng tay ngoài migration — môi trường kế tiếp không có nó.']],
    tn: [tn('migration', 'bản di trú lược đồ'), tn('ORM', 'ánh xạ đối tượng–quan hệ')],
  }),
]);
