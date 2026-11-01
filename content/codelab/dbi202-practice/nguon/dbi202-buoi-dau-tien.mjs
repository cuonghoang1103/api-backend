/**
 * DBI202 · 0.3 Buổi đầu tiên — tạo, thêm, xem, sửa, xoá trên CSDL QuanLyLop (Lop, SinhVien) của bài.
 * Năm đề = đúng năm bài tự làm cuối bài học, chấm thật trong trình duyệt (chế độ SQL Server).
 */
import { mod, de, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';
import { QLL, LUOC_DO_QLL } from './_du-lieu.mjs';

const Q = { csdl: QLL, tenCsdl: 'QuanLyLop', ld: LUOC_DO_QLL };
const THEM = `INSERT INTO Lop (maLop, tenLop) VALUES ('SE1804', N'Kỹ thuật phần mềm 1804');
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES
  ('SV007', N'Vũ Minh Khôi', '2004-02-02', NULL, 'SE1802'),
  ('SV008', N'Đinh Thu Trang', '2004-08-08', 9.80, 'SE1802'),
  ('SV009', N'Ngô Gia Bảo', '2004-04-04', 5.00, 'SE1801')`;

export default mod('dbi202-buoi-dau-tien', '0.3 First session: INSERT, SELECT, UPDATE, DELETE', [
  de({
    ...Q, t: 'Add a class, then a student in it', k: 'EASY', p: 6,
    kn: ['INSERT', 'foreign key order'], tag: ['insert', 'quanlylop'],
    en: '<p>Insert the new class <code>SE1803</code> named <i>Kỹ thuật phần mềm 1803</i>, then the student <code>SV006</code> <i>Đỗ Thị Lan</i>, born 2004-09-09, score 8.00, in class SE1803.</p>',
    vi: '<p>Thêm lớp mới <code>SE1803</code> tên <i>Kỹ thuật phần mềm 1803</i>, rồi thêm sinh viên <code>SV006</code> <i>Đỗ Thị Lan</i>, sinh 2004-09-09, điểm 8.00, thuộc lớp SE1803.</p>',
    yc: [['Two INSERT statements, the class first (the student\'s maLop is a foreign key to Lop).', 'Hai câu INSERT, lớp trước (maLop của sinh viên là khoá ngoại tới Lop).'],
      ['Name the columns in each INSERT; use N\'…\' for Vietnamese text.', 'Ghi rõ tên cột trong mỗi INSERT; chữ tiếng Việt dùng N\'…\'.']],
    giai: `INSERT INTO Lop (maLop, tenLop) VALUES ('SE1803', N'Kỹ thuật phần mềm 1803');   -- parent first
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop)
VALUES ('SV006', N'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803');                    -- then the child`,
    kiem: [
      sau(['The class SE1803 exists', 'Có lớp SE1803'], `SELECT maLop, tenLop FROM Lop WHERE maLop = 'SE1803'`),
      sau(['The student SV006 is in SE1803 with every value right', 'SV006 thuộc SE1803, đủ giá trị đúng'], `SELECT maSV, hoTen, ngaySinh, diemTB, maLop FROM SinhVien WHERE maSV = 'SV006'`),
      sau(['Nothing else changed (3 classes, 6 students)', 'Không thay đổi gì khác (3 lớp, 6 sinh viên)'], `SELECT (SELECT COUNT(*) FROM Lop) AS soLop, (SELECT COUNT(*) FROM SinhVien) AS soSV`),
    ],
    sai: [
      `INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES ('SV006', N'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803');`,
      `INSERT INTO Lop (maLop, tenLop) VALUES ('SE1803', N'Kỹ thuật phần mềm 1803');
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES ('SV006', N'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1801');`,
    ],
    gy: [['The foreign key fk_sinhvien_lop says: maLop of a student must already exist in Lop.', 'Khoá ngoại fk_sinhvien_lop nói: maLop của sinh viên phải CÓ SẴN trong Lop.'],
      ['INSERT INTO Lop (…) VALUES (…); then INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES (…);', 'INSERT INTO Lop (…) VALUES (…); rồi INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES (…);']],
    lhg: [['Inserting the student first — the foreign key rejects it because SE1803 does not exist yet.', 'Thêm sinh viên trước — khoá ngoại từ chối vì SE1803 chưa tồn tại.'],
      ['Forgetting N\'…\' — on SQL Server the diacritics of a non-Unicode literal can turn into "?".', 'Quên N\'…\' — trên SQL Server chữ có dấu trong chuỗi không Unicode có thể thành "?".']],
    gt: ['<p>A foreign key protects the child side: no student may point at a class that does not exist. So the parent row goes in first. Naming the columns makes the INSERT survive a later ALTER TABLE that adds a column.</p>', '<p>Khoá ngoại bảo vệ phía con: không sinh viên nào được trỏ tới lớp chưa có. Vì vậy dòng cha vào trước. Ghi rõ tên cột giúp câu INSERT không hỏng khi sau này bảng thêm cột.</p>'],
    tn: [TN.dml, TN.fk],
  }),
  de({
    ...Q, t: 'Students without a score yet', k: 'EASY', p: 5,
    kn: ['NULL', 'IS NULL'], tag: ['select', 'null', 'quanlylop'],
    en: '<p>List the <b>code and name</b> of every student whose <code>diemTB</code> has never been set.</p>',
    vi: '<p>Liệt kê <b>mã và tên</b> mọi sinh viên chưa có điểm <code>diemTB</code>.</p>',
    yc: [['Columns: <code>maSV, hoTen</code>.', 'Cột: <code>maSV, hoTen</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT maSV, hoTen
FROM SinhVien
WHERE diemTB IS NULL;     -- "= NULL" is never true: NULL is tested with IS NULL`,
    kiem: [kq(['Students with no score', 'Sinh viên chưa có điểm']), kqAn(['Two more students, one without a score', 'Thêm hai sinh viên, một người chưa có điểm'], THEM), ma(['Uses IS NULL', 'Dùng IS NULL'], '\\bIS\\s+NULL\\b')],
    sai: ['SELECT maSV, hoTen FROM SinhVien WHERE diemTB = NULL', 'SELECT maSV, hoTen FROM SinhVien WHERE diemTB = 0'],
    gy: [['NULL means "unknown" — it is not 0 and it is not equal to anything.', 'NULL nghĩa là "chưa biết" — không phải 0, không bằng bất kỳ thứ gì.'], ['WHERE diemTB IS NULL', 'WHERE diemTB IS NULL']],
    lhg: [['WHERE diemTB = NULL — the comparison is UNKNOWN for every row, so 0 rows come back.', 'WHERE diemTB = NULL — phép so sánh ra UNKNOWN với mọi dòng nên trả 0 dòng.'], ['WHERE diemTB = 0 — a zero score is a real score; NULL is "not graded yet".', 'WHERE diemTB = 0 — điểm 0 là điểm thật; NULL là "chưa chấm".']],
    gt: ['<p>Any comparison with NULL using =, &lt;&gt;, &lt;, &gt; gives UNKNOWN, and WHERE keeps only TRUE rows. IS NULL is the only test that returns TRUE for a missing value.</p>', '<p>Mọi phép so sánh với NULL bằng =, &lt;&gt;, &lt;, &gt; đều ra UNKNOWN, còn WHERE chỉ giữ dòng TRUE. IS NULL là phép thử duy nhất trả TRUE cho giá trị thiếu.</p>'],
    tn: [TN.null, TN.where],
  }),
  de({
    ...Q, t: 'Class SE1801, best score first', k: 'EASY', p: 6,
    kn: ['ORDER BY', 'WHERE'], tag: ['select', 'order-by', 'quanlylop'],
    en: '<p>Show the students of class <code>SE1801</code> <b>who already have a score</b>, best score first.</p>',
    vi: '<p>Hiện các sinh viên lớp <code>SE1801</code> <b>đã có điểm</b>, điểm cao nhất trước.</p>',
    yc: [['Columns: <code>hoTen, diemTB</code>.', 'Cột: <code>hoTen, diemTB</code>.'], ['Highest diemTB first (row order is checked).', 'diemTB cao nhất trước (có kiểm thứ tự dòng).'], ['Leave out students whose score is NULL.', 'Bỏ sinh viên có điểm NULL.']],
    giai: `SELECT hoTen, diemTB
FROM SinhVien
WHERE maLop = 'SE1801'
  AND diemTB IS NOT NULL    -- NULL would sort first on SQL Server, last on PostgreSQL
ORDER BY diemTB DESC;`,
    kiem: [kq(['SE1801 students by score, descending', 'Sinh viên SE1801 theo điểm giảm dần'], { thuTu: true }), kqAn(['A new SE1801 student with 5.00', 'Thêm sinh viên SE1801 điểm 5.00'], THEM, { thuTu: true }), ma(['Uses ORDER BY … DESC', 'Dùng ORDER BY … DESC'], '\\bORDER\\s+BY\\b[\\s\\S]*\\bDESC\\b')],
    sai: [`SELECT hoTen, diemTB FROM SinhVien WHERE maLop = 'SE1801' AND diemTB IS NOT NULL ORDER BY diemTB`, `SELECT hoTen, diemTB FROM SinhVien WHERE diemTB IS NOT NULL ORDER BY diemTB DESC`],
    gy: [['Filter with WHERE first, then sort with ORDER BY at the very end.', 'Lọc bằng WHERE trước, sắp bằng ORDER BY ở cuối cùng.'], ['ORDER BY diemTB DESC — ASC (the default) puts the lowest first.', 'ORDER BY diemTB DESC — ASC (mặc định) đặt thấp nhất lên đầu.']],
    lhg: [['Forgetting DESC — the default order is ascending.', 'Quên DESC — mặc định là tăng dần.'], ['Forgetting WHERE maLop = \'SE1801\' — students of every class appear.', 'Quên WHERE maLop = \'SE1801\' — sinh viên mọi lớp đều hiện.']],
    gt: ['<p>SQL evaluates FROM → WHERE → SELECT → ORDER BY. Without ORDER BY the row order is not guaranteed at all. Excluding NULL scores also avoids the one place where SQL Server and PostgreSQL disagree (where NULL goes when sorting).</p>', '<p>SQL chạy FROM → WHERE → SELECT → ORDER BY. Không có ORDER BY thì thứ tự dòng không được đảm bảo. Bỏ điểm NULL còn tránh được chỗ SQL Server và PostgreSQL khác nhau (NULL đứng đâu khi sắp).</p>'],
    tn: [TN.orderBy, TN.where],
  }),
  de({
    ...Q, t: 'Half a point of bonus for SE1802, capped at 10', k: 'MEDIUM', p: 8,
    kn: ['UPDATE', 'CASE', 'CHECK constraint'], tag: ['update', 'case', 'quanlylop'],
    en: '<p>Give every student of class <code>SE1802</code> a bonus of 0.5 point, but nobody may go above 10 (the table has <code>CHECK (diemTB &lt;= 10)</code>). Students of other classes must not change.</p>',
    vi: '<p>Cộng 0,5 điểm thưởng cho mọi sinh viên lớp <code>SE1802</code>, nhưng không ai được vượt 10 (bảng có <code>CHECK (diemTB &lt;= 10)</code>). Sinh viên lớp khác giữ nguyên.</p>',
    yc: [['One UPDATE statement.', 'Một câu UPDATE.'], ['A student at 9.80 ends at 10.00, not 10.30.', 'Sinh viên đang 9.80 thành 10.00, không phải 10.30.'], ['A NULL score stays NULL.', 'Điểm NULL vẫn là NULL.']],
    giai: `UPDATE SinhVien
SET diemTB = CASE WHEN diemTB + 0.5 > 10 THEN 10    -- cap at 10
                  ELSE diemTB + 0.5 END             -- NULL + 0.5 is NULL: an ungraded student stays ungraded
WHERE maLop = 'SE1802';`,
    kiem: [
      sau(['Scores of every student after the bonus', 'Điểm mọi sinh viên sau khi cộng'], `SELECT maSV, diemTB FROM SinhVien`),
      sau(['With a 9.80 student: capped at 10, NULL stays NULL', 'Có người 9.80: chặn ở 10, NULL giữ NULL'], `SELECT maSV, diemTB FROM SinhVien`, { an: true, themCsdl: THEM }),
      ma(['Uses UPDATE … WHERE', 'Dùng UPDATE … WHERE'], '\\bUPDATE\\b[\\s\\S]*\\bWHERE\\b'),
    ],
    sai: [`UPDATE SinhVien SET diemTB = diemTB + 0.5 WHERE maLop = 'SE1802'`, `UPDATE SinhVien SET diemTB = CASE WHEN diemTB + 0.5 > 10 THEN 10 ELSE diemTB + 0.5 END`],
    gy: [['Without a cap, 9.80 + 0.5 breaks the CHECK and the WHOLE UPDATE fails (0 rows change).', 'Không chặn trần, 9.80 + 0.5 vi phạm CHECK và CẢ câu UPDATE thất bại (0 dòng đổi).'], ['SET diemTB = CASE WHEN diemTB + 0.5 > 10 THEN 10 ELSE diemTB + 0.5 END', 'SET diemTB = CASE WHEN diemTB + 0.5 > 10 THEN 10 ELSE diemTB + 0.5 END']],
    lhg: [['SET diemTB = diemTB + 0.5 with no cap — fine on the sample data, but the hidden check has a 9.80 student and the UPDATE is rejected by the CHECK constraint.', 'SET diemTB = diemTB + 0.5 không chặn trần — dữ liệu mẫu thì qua, nhưng kiểm ẩn có người 9.80 và CHECK từ chối cả câu UPDATE.'], ['No WHERE — every class gets the bonus.', 'Không WHERE — lớp nào cũng được cộng.']],
    gt: ['<p>A statement is atomic: if one row would violate a constraint, no row changes. CASE computes the capped value per row, and NULL + 0.5 = NULL, so ungraded students stay ungraded.</p>', '<p>Một câu lệnh là nguyên tử: chỉ một dòng vi phạm ràng buộc là không dòng nào đổi. CASE tính giá trị đã chặn trần cho từng dòng, và NULL + 0.5 = NULL nên người chưa có điểm vẫn chưa có điểm.</p>'],
    tn: [TN.dml, TN.check, tn('CASE expression', 'biểu thức CASE', 'CASE WHEN điều kiện THEN giá trị … ELSE … END — chọn giá trị theo điều kiện, dùng được trong SELECT, SET, ORDER BY.')],
  }),
  de({
    ...Q, t: 'Delete class SE1801 safely', k: 'MEDIUM', p: 8,
    kn: ['DELETE', 'foreign key', 'order of deletes'], tag: ['delete', 'foreign-key', 'quanlylop'],
    en: '<p>Class <code>SE1801</code> is closed: remove it <b>and its students</b>. The foreign key has no ON DELETE CASCADE, so <code>DELETE FROM Lop WHERE maLop = \'SE1801\'</code> alone is rejected while students still point at it.</p>',
    vi: '<p>Lớp <code>SE1801</code> giải thể: xoá lớp <b>và các sinh viên của lớp</b>. Khoá ngoại không có ON DELETE CASCADE nên chỉ <code>DELETE FROM Lop WHERE maLop = \'SE1801\'</code> sẽ bị từ chối khi còn sinh viên trỏ tới.</p>',
    yc: [['Two DELETE statements in the right order.', 'Hai câu DELETE theo đúng thứ tự.'], ['Class SE1802 and its students must stay.', 'Lớp SE1802 và sinh viên của nó phải còn nguyên.']],
    giai: `DELETE FROM SinhVien WHERE maLop = 'SE1801';   -- children first
DELETE FROM Lop      WHERE maLop = 'SE1801';   -- now nobody points at the class`,
    kiem: [
      sau(['Remaining classes', 'Các lớp còn lại'], `SELECT maLop FROM Lop`),
      sau(['Remaining students', 'Các sinh viên còn lại'], `SELECT maSV, maLop FROM SinhVien`),
      sau(['Hidden: a newly added SE1801 student is removed too', 'Ẩn: sinh viên SE1801 mới thêm cũng bị xoá'], `SELECT maSV, maLop FROM SinhVien`, { an: true, themCsdl: THEM }),
    ],
    sai: [`DELETE FROM Lop WHERE maLop = 'SE1801';`, `DELETE FROM SinhVien WHERE maLop = 'SE1801';`, `DELETE FROM SinhVien WHERE maSV IN ('SV001', 'SV002', 'SV005'); DELETE FROM Lop WHERE maLop = 'SE1801';`],
    gy: [['A foreign key also blocks deleting a parent that still has children.', 'Khoá ngoại cũng chặn xoá dòng cha khi còn dòng con.'], ['Delete the SinhVien rows of SE1801 first, then the Lop row.', 'Xoá các dòng SinhVien của SE1801 trước, rồi đến dòng Lop.']],
    lhg: [['Deleting the class first — "conflicted with the REFERENCE constraint fk_sinhvien_lop".', 'Xoá lớp trước — "conflicted with the REFERENCE constraint fk_sinhvien_lop".'], ['Listing the students by code (SV001, SV002, SV005) — any student added later stays behind and the class delete fails again (hidden check).', 'Liệt kê sinh viên theo mã (SV001, SV002, SV005) — sinh viên thêm sau còn sót và câu xoá lớp lại lỗi (kiểm ẩn).']],
    gt: ['<p>Deletes go in the reverse order of inserts: children before parents. Filtering the children by <code>maLop</code> (not by a hand-copied list of codes) keeps the statement correct whatever students the class has today. Chapter 5 shows ON DELETE CASCADE, which makes the database do the first DELETE for you.</p>', '<p>Xoá theo thứ tự ngược với thêm: con trước, cha sau. Lọc dòng con theo <code>maLop</code> (không phải danh sách mã chép tay) giữ câu lệnh đúng dù lớp có những ai. Chương 5 dạy ON DELETE CASCADE — để CSDL tự làm câu DELETE thứ nhất.</p>'],
    tn: [TN.dml, TN.fk],
  }),
]);
