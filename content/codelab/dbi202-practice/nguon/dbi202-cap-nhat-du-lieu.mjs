/**
 * DBI202 · 6.5 — INSERT / UPDATE / DELETE an toàn: chèn đủ & thiếu cột, sửa có điều kiện, xoá theo điều kiện,
 * UPDATE theo truy vấn con, INSERT … SELECT. Kiểm = chạy lệnh của bạn rồi truy vấn kiểm của đề (giao dịch huỷ sau mỗi kiểm).
 * CSDL: FUHCompany. Bài giảng: dbi202-cap-nhat-du-lieu.
 */
import { doiDau, KHOA, FUH, sql, sau, chan, ma, TN } from './_chung.mjs';

const KHOI_DML = `-- Write your INSERT / UPDATE / DELETE statement(s) below. Each check runs them in a transaction that is rolled back.
-- Viết (các) lệnh INSERT / UPDATE / DELETE bên dưới. Mỗi kiểm chạy chúng trong một giao dịch rồi huỷ.

`;
const NV_THEM = `INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', 61000, 'M', 3, 30121050020), (30121050096, N'Đinh Thị Hoa', 47000, 'F', 2, 30121050010);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 5, 31.0), (30121050096, 3, 30.0), (30121050011, 4, 0.5)`;
const TAT_CA_LUONG = 'SELECT empSSN, empSalary, depNum FROM tblEmployee ORDER BY empSSN';

export default doiDau({
  slug: 'dbi202-cap-nhat-du-lieu',
  ten: '6.5 INSERT, UPDATE, DELETE done safely',
  khoa: KHOA,
  baiHoc: 'dbi202-cap-nhat-du-lieu',
  de: [
    sql({
      tieuDe: 'Add the Accounting department',
      doKho: 'EASY', phut: 5,
      khaiNiem: ['INSERT … VALUES', 'column list'], the: ['dml', 'insert', 'fuhcompany'],
      moTa: {
        en: '<p>Create department number <b>6</b> named <b>Phòng Kế Toán</b>. It has no manager yet (manager SSN and assignment date are NULL).</p>',
        vi: '<p>Tạo phòng số <b>6</b> tên <b>Phòng Kế Toán</b>. Phòng chưa có trưởng phòng (mgrSSN và mgrAssDate là NULL).</p>',
      },
      yeuCau: {
        en: ['One INSERT statement into <code>tblDepartment</code>, with an explicit column list.', 'Write the name as <code>N\'Phòng Kế Toán\'</code>.'],
        vi: ['Một lệnh INSERT vào <code>tblDepartment</code>, có danh sách cột.', 'Viết tên dạng <code>N\'Phòng Kế Toán\'</code>.'],
      },
      khoiDau: KHOI_DML,
      giai: `INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate)
VALUES (6, N'Phòng Kế Toán', NULL, NULL);`,
      kiem: [
        sau('Department 6 exists with the right values', 'SELECT depNum, depName, mgrSSN, mgrAssDate FROM tblDepartment WHERE depNum = 6'),
        sau('Nothing else changed (6 departments in total)', 'SELECT COUNT(*) AS n FROM tblDepartment'),
        ma('Lists the columns', '\\bINSERT\\s+INTO\\s+tblDepartment\\s*\\('),
      ],
      saiMau: ["INSERT INTO tblDepartment VALUES (6, N'Phòng Kế Toán', NULL, NULL)", "INSERT INTO tblDepartment (depNum, depName) VALUES (7, N'Phòng Kế Toán')"],
      goiY: ['INSERT INTO table (col1, col2, …) VALUES (v1, v2, …).', 'NULL is written without quotes.'],
      loiHayGap: [
        { en: 'Omitting the column list — works today, breaks the day a column is added to the table.', vi: 'Bỏ danh sách cột — hôm nay chạy, ngày bảng thêm cột là hỏng.' },
        { en: 'Writing \'NULL\' in quotes — stores the 4-letter text "NULL", not a missing value (and fails for a DECIMAL column).', vi: 'Viết \'NULL\' trong nháy — lưu chữ "NULL" chứ không phải giá trị thiếu (và lỗi với cột DECIMAL).' },
      ],
      giaiThich: { en: '<p>Naming the columns makes the INSERT independent of the table\'s column order — the same reason you avoid SELECT *.</p>', vi: '<p>Ghi tên cột giúp lệnh INSERT không phụ thuộc thứ tự cột của bảng — cùng lý do tránh SELECT *.</p>' },
      thuatNgu: [TN.dml, { en: 'INSERT', vi: 'chèn dòng mới' }],
    }),
    sql({
      tieuDe: 'Hire a new employee with partial data',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['INSERT with some columns', 'NULL for unspecified columns', 'FK must exist'], the: ['dml', 'insert', 'fuhcompany'],
      moTa: {
        en: '<p>Hire <b>Lê Văn Tám</b>, SSN <b>30121050100</b>, male, salary <b>30000</b>, into department <b>1</b>, supervised by <b>30121050002</b>. Address and birthdate are not known yet.</p>',
        vi: '<p>Tuyển <b>Lê Văn Tám</b>, SSN <b>30121050100</b>, nam, lương <b>30000</b>, vào phòng <b>1</b>, giám sát bởi <b>30121050002</b>. Chưa biết địa chỉ và ngày sinh.</p>',
      },
      yeuCau: {
        en: ['One INSERT into <code>tblEmployee</code> listing only the known columns.', 'Unknown columns must end up NULL.'],
        vi: ['Một lệnh INSERT vào <code>tblEmployee</code>, chỉ ghi các cột đã biết.', 'Cột chưa biết phải là NULL.'],
      },
      khoiDau: KHOI_DML,
      giai: `INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum, supervisorSSN)
VALUES (30121050100, N'Lê Văn Tám', 30000, 'M', 1, 30121050002);   -- empAddress, empBirthdate ⇒ NULL`,
      kiem: [
        sau('The new row, with NULL address and birthdate', 'SELECT empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN FROM tblEmployee WHERE empSSN = 30121050100'),
        sau('Department 1 now has 5 people', 'SELECT COUNT(*) AS n FROM tblEmployee WHERE depNum = 1'),
        ma('Uses INSERT INTO tblEmployee', '\\bINSERT\\s+INTO\\s+tblEmployee\\b'),
      ],
      saiMau: ["INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050100, N'Lê Văn Tám', '', 30000, 'M', NULL, 1, 30121050002)"],
      goiY: ['List only the columns you have values for; the others default to NULL.', 'empSSN is DECIMAL — write the number without quotes.'],
      loiHayGap: [
        { en: 'Putting \'\' for the unknown address — an empty string is a value; the requirement is NULL.', vi: 'Ghi \'\' cho địa chỉ chưa biết — chuỗi rỗng là một giá trị; đề yêu cầu NULL.' },
        { en: 'A supervisor SSN that does not exist — the foreign key rejects the row (SQL Server Msg 547).', vi: 'SSN giám sát không tồn tại — khoá ngoại chặn dòng (SQL Server Msg 547).' },
      ],
      giaiThich: { en: '<p>Columns left out of the INSERT receive their DEFAULT, which is NULL when no default is declared. Constraints (CHECK on sex/salary, foreign keys) are still checked.</p>', vi: '<p>Cột không ghi trong INSERT nhận giá trị DEFAULT, là NULL nếu không khai mặc định. Ràng buộc (CHECK giới tính/lương, khoá ngoại) vẫn được kiểm.</p>' },
      thuatNgu: [TN.dml, TN.fk],
    }),
    sql({
      tieuDe: 'Give department 3 a 10% raise',
      doKho: 'MEDIUM', phut: 7,
      khaiNiem: ['UPDATE … SET … WHERE', 'arithmetic in SET'], the: ['dml', 'update', 'fuhcompany'],
      moTa: {
        en: '<p>Everyone in <b>department 3</b> gets a <b>10% raise</b>. Nobody else\'s salary may change.</p>',
        vi: '<p>Mọi người ở <b>phòng 3</b> được <b>tăng lương 10%</b>. Lương người khác không được đổi.</p>',
      },
      yeuCau: {
        en: ['One UPDATE statement on <code>tblEmployee</code>.', 'The check compares every employee\'s salary afterwards.'],
        vi: ['Một lệnh UPDATE trên <code>tblEmployee</code>.', 'Máy chấm so lương của MỌI nhân viên sau khi chạy.'],
      },
      khoiDau: KHOI_DML,
      giai: `UPDATE tblEmployee
SET empSalary = empSalary * 1.1
WHERE depNum = 3;   -- without WHERE, the whole company gets the raise`,
      kiem: [
        sau('All salaries after the raise', TAT_CA_LUONG, { thuTu: true }),
        sau('Also correct with new staff in department 3', TAT_CA_LUONG, { thuTu: true, an: true, themCsdl: NV_THEM }),
        ma('UPDATE with a WHERE clause', '\\bUPDATE\\b[\\s\\S]*\\bWHERE\\b'),
      ],
      saiMau: ['UPDATE tblEmployee SET empSalary = empSalary * 1.1', 'UPDATE tblEmployee SET empSalary = empSalary + 10 WHERE depNum = 3'],
      goiY: ['UPDATE table SET column = expression WHERE condition.', 'A 10% raise is empSalary * 1.1.'],
      loiHayGap: [
        { en: 'Forgetting WHERE — every row is updated. In SSMS, write the SELECT with the same WHERE first, check the rows, then turn it into UPDATE.', vi: 'Quên WHERE — cả bảng bị sửa. Trong SSMS hãy viết SELECT với cùng WHERE trước, xem đúng dòng rồi mới đổi thành UPDATE.' },
        { en: 'SET empSalary = empSalary + 10 — adds 10, not 10%.', vi: 'SET empSalary = empSalary + 10 — cộng 10 đơn vị, không phải 10%.' },
      ],
      giaiThich: { en: '<p>empSalary is DECIMAL(10,0): 88000 × 1.1 = 96800 fits exactly. With money columns that have decimals, round explicitly (ROUND(x, 2)) so both engines store the same value.</p>', vi: '<p>empSalary là DECIMAL(10,0): 88000 × 1.1 = 96800 vừa khít. Cột tiền có phần lẻ thì làm tròn rõ ràng (ROUND(x, 2)) để hai hệ lưu cùng giá trị.</p>' },
      thuatNgu: [TN.dml, { en: 'UPDATE', vi: 'sửa dữ liệu' }],
    }),
    sql({
      tieuDe: 'Remove the "Con trai" dependents',
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['DELETE … WHERE', 'case-insensitive equality'], the: ['dml', 'delete', 'fuhcompany'],
      moTa: {
        en: '<p>The insurance plan no longer covers sons. Delete every dependent whose relationship is <b>Con trai</b>.</p>',
        vi: '<p>Gói bảo hiểm không còn chi trả cho con trai. Xoá mọi người phụ thuộc có quan hệ <b>Con trai</b>.</p>',
      },
      yeuCau: {
        en: ['One DELETE statement on <code>tblDependent</code>.', 'Other dependents must stay.'],
        vi: ['Một lệnh DELETE trên <code>tblDependent</code>.', 'Người phụ thuộc khác phải còn nguyên.'],
      },
      khoiDau: KHOI_DML,
      giai: `DELETE FROM tblDependent
WHERE depRelationship = N'Con trai';`,
      kiem: [
        sau('Remaining dependents', 'SELECT empSSN, depName, depRelationship FROM tblDependent'),
        sau('Remaining count is 3', 'SELECT COUNT(*) AS n FROM tblDependent'),
        ma('DELETE with WHERE', '\\bDELETE\\b[\\s\\S]*\\bWHERE\\b'),
      ],
      saiMau: ["DELETE FROM tblDependent WHERE depRelationship LIKE N'Con%'", 'DELETE FROM tblDependent'],
      goiY: ['DELETE FROM table WHERE condition — the WHERE decides which rows disappear.', 'Compare the whole value: = N\'Con trai\'.'],
      loiHayGap: [
        { en: 'LIKE N\'Con%\' — also deletes "Con gái".', vi: 'LIKE N\'Con%\' — xoá luôn "Con gái".' },
        { en: 'DELETE without WHERE — empties the table.', vi: 'DELETE không WHERE — xoá sạch bảng.' },
      ],
      giaiThich: { en: '<p>Run <code>SELECT * FROM tblDependent WHERE …</code> with the same condition first: if it lists exactly the rows you want gone, swap SELECT * for DELETE.</p>', vi: '<p>Chạy <code>SELECT * FROM tblDependent WHERE …</code> với cùng điều kiện trước: liệt kê đúng các dòng muốn xoá thì đổi SELECT * thành DELETE.</p>' },
      thuatNgu: [TN.dml, { en: 'DELETE', vi: 'xoá dòng' }],
    }),
    sql({
      tieuDe: 'Overtime bonus: +5,000 for more than 30 hours',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['UPDATE with a subquery', 'GROUP BY … HAVING inside IN'], the: ['dml', 'update', 'subquery', 'fuhcompany'],
      moTa: {
        en: '<p>Employees whose <b>total working hours over all projects is more than 30</b> receive a <b>+5,000</b> salary bonus.</p>',
        vi: '<p>Nhân viên có <b>tổng giờ làm trên mọi dự án lớn hơn 30</b> được <b>cộng 5.000</b> vào lương.</p>',
      },
      yeuCau: {
        en: ['One UPDATE on <code>tblEmployee</code> using a subquery (portable — no UPDATE … FROM).', 'Exactly 30 hours does not qualify.'],
        vi: ['Một lệnh UPDATE trên <code>tblEmployee</code> dùng truy vấn con (chạy mọi hệ — không dùng UPDATE … FROM).', 'Đúng 30 giờ thì không được.'],
      },
      khoiDau: KHOI_DML,
      giai: `UPDATE tblEmployee
SET empSalary = empSalary + 5000
WHERE empSSN IN (SELECT empSSN
                 FROM tblWorksOn
                 GROUP BY empSSN
                 HAVING SUM(workHours) > 30);   -- 30 exactly (011, 027) stays unchanged`,
      kiem: [
        sau('All salaries after the bonus', TAT_CA_LUONG, { thuTu: true }),
        sau('Correct with new assignments (31 h, 30 h, 30.5 h)', TAT_CA_LUONG, { thuTu: true, an: true, themCsdl: NV_THEM }),
        ma('Uses a subquery with HAVING', '\\bHAVING\\b'),
      ],
      saiMau: [
        'UPDATE tblEmployee SET empSalary = empSalary + 5000 WHERE empSSN IN (SELECT empSSN FROM tblWorksOn WHERE workHours > 30)',
        'UPDATE tblEmployee SET empSalary = empSalary + 5000 WHERE empSSN IN (SELECT empSSN FROM tblWorksOn GROUP BY empSSN HAVING SUM(workHours) >= 30)',
      ],
      goiY: ['First write the SELECT that finds the SSNs: GROUP BY empSSN HAVING SUM(workHours) > 30.', 'Then UPDATE … WHERE empSSN IN (that SELECT).'],
      loiHayGap: [
        { en: 'WHERE workHours > 30 without grouping — checks single assignments (only 004 with 35 h and 021, 030 with 40 h), not the total.', vi: 'WHERE workHours > 30 không gộp — xét từng phân công lẻ chứ không phải tổng giờ.' },
        { en: 'UPDATE e SET … FROM tblEmployee e JOIN … — T-SQL syntax; PostgreSQL writes UPDATE … FROM differently. The IN (subquery) form runs on both.', vi: 'UPDATE e SET … FROM tblEmployee e JOIN … — cú pháp T-SQL; PostgreSQL viết khác. Dạng IN (truy vấn con) chạy cả hai.' },
      ],
      giaiThich: { en: '<p>Totals per employee: 003 = 52.5, 005 = 45, 004 = 35, 012 = 35, 021 = 40, 030 = 40 ⇒ six people get the bonus; 011 and 027 have exactly 30 and do not.</p>', vi: '<p>Tổng giờ: 003 = 52.5, 005 = 45, 004 = 35, 012 = 35, 021 = 40, 030 = 40 ⇒ sáu người được thưởng; 011 và 027 đúng 30 giờ nên không.</p>' },
      thuatNgu: [TN.dml, TN.subquery, TN.having],
    }),
    sql({
      tieuDe: 'Archive department 2 with INSERT … SELECT',
      doKho: 'HARD', phut: 10,
      khaiNiem: ['INSERT … SELECT', 'copying rows between tables'], the: ['dml', 'insert-select', 'fuhcompany'],
      csdl: `${FUH}
CREATE TABLE tblEmployeeArchive (
    empSSN    DECIMAL(18,0) NOT NULL PRIMARY KEY,
    empName   NVARCHAR(50)  NOT NULL,
    depName   NVARCHAR(50)  NULL,
    archivedOn DATE         NOT NULL
);`,
      moTa: {
        en: '<p>The empty table <code>tblEmployeeArchive(empSSN, empName, depName, archivedOn)</code> exists (see the end of the script). Copy every employee of <b>department 2</b> into it, with the department <b>name</b> and the archive date <b>2026-10-01</b> — in one statement.</p>',
        vi: '<p>Bảng rỗng <code>tblEmployeeArchive(empSSN, empName, depName, archivedOn)</code> đã có (cuối script). Chép mọi nhân viên <b>phòng 2</b> vào đó, kèm <b>tên</b> phòng và ngày lưu trữ <b>2026-10-01</b> — trong một lệnh.</p>',
      },
      yeuCau: {
        en: ['One <code>INSERT INTO tblEmployeeArchive (…) SELECT …</code> statement.', 'Do not type the four rows by hand — it must work for any data.'],
        vi: ['Một lệnh <code>INSERT INTO tblEmployeeArchive (…) SELECT …</code>.', 'Không gõ tay bốn dòng — phải đúng với mọi dữ liệu.'],
      },
      khoiDau: KHOI_DML,
      giai: `INSERT INTO tblEmployeeArchive (empSSN, empName, depName, archivedOn)
SELECT e.empSSN, e.empName, d.depName, '2026-10-01'
FROM tblEmployee e
JOIN tblDepartment d ON d.depNum = e.depNum
WHERE e.depNum = 2;`,
      kiem: [
        sau('Archive content', 'SELECT empSSN, empName, depName, archivedOn FROM tblEmployeeArchive'),
        sau('Archive content with new staff in department 2', 'SELECT empSSN, empName, depName, archivedOn FROM tblEmployeeArchive', { an: true, themCsdl: NV_THEM }),
        ma('INSERT … SELECT (no VALUES)', '\\bINSERT\\s+INTO\\s+tblEmployeeArchive\\b[\\s\\S]*\\bSELECT\\b'),
      ],
      saiMau: [`INSERT INTO tblEmployeeArchive (empSSN, empName, depName, archivedOn) VALUES (30121050005, N'Mai Duy An', N'Phòng Phần mềm nước ngoài', '2026-10-01'), (30121050010, N'Phạm Quốc Bảo', N'Phòng Phần mềm nước ngoài', '2026-10-01'), (30121050011, N'Hồ Ngọc Hân', N'Phòng Phần mềm nước ngoài', '2026-10-01'), (30121050012, N'Đặng Tuấn Anh', N'Phòng Phần mềm nước ngoài', '2026-10-01')`],
      goiY: ['INSERT INTO target (cols) SELECT … — the SELECT\'s columns map to the target columns by position.', 'A constant (the date) can be a column of the SELECT.'],
      loiHayGap: [
        { en: 'Typing VALUES for the four current employees — passes today, fails when department 2 hires (hidden check).', vi: 'Gõ VALUES cho bốn người hiện tại — hôm nay đúng, phòng 2 tuyển thêm là sai (kiểm ẩn).' },
        { en: 'Writing VALUES (SELECT …) — INSERT … SELECT has no VALUES keyword.', vi: 'Viết VALUES (SELECT …) — INSERT … SELECT không có từ VALUES.' },
      ],
      giaiThich: { en: '<p>INSERT … SELECT copies any query result into a table — the same pattern as Q10 of the real SP26 PE ("add all tracks of album X to playlist 11").</p>', vi: '<p>INSERT … SELECT chép mọi kết quả truy vấn vào bảng — đúng dạng Q10 của đề PE SP26 thật ("thêm mọi bài của album X vào playlist 11").</p>' },
      thuatNgu: [TN.dml, { en: 'INSERT … SELECT', vi: 'chèn từ kết quả truy vấn' }],
    }),
  ],
});
