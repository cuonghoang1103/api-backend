/**
 * DBI202 · ⭐ CS.8 phần 2 — bài SQL phỏng vấn kinh điển và cái bẫy của chúng (slide 13–17): lương cao thứ hai khi hoà, đếm cả phòng
 * 0 người (COUNT(*) vs COUNT(cột)), khách chưa mua khi có đơn NULL (NOT IN), tỉ lệ trong nhóm (chia nguyên), đổi M/F một câu.
 */
import { mod, de, kq, kqAn, sau, ma, tn } from './_chung.mjs';

const SHOP = `CREATE TABLE KhachHang (id INT NOT NULL PRIMARY KEY, ten VARCHAR(50) NOT NULL);
CREATE TABLE DonHang (id INT NOT NULL PRIMARY KEY, khachHangId INT NULL REFERENCES KhachHang (id), tongTien DECIMAL(12,0) NOT NULL);
INSERT INTO KhachHang (id, ten) VALUES (1, 'An'), (2, 'Binh'), (3, 'Chi'), (4, 'Dung');
INSERT INTO DonHang (id, khachHangId, tongTien) VALUES (10, 1, 100000), (11, 1, 50000), (12, 3, 70000), (13, NULL, 20000);`;

export default mod('dbi202-slide-cs8-2', '⭐ CS.8 Database interviews (2): classic SQL problems and their traps', [
  de({
    t: 'Second-highest salary — and what if the top is tied?', k: 'MEDIUM', p: 8,
    kn: ['second highest', 'ties', 'subquery', 'NULL when absent'], tag: ['advanced', 'interview'],
    en: '<p>Return one row, one column <code>luong_cao_thu_hai</code>: the second-highest <b>distinct</b> salary in tblEmployee. If two people share the top salary, the answer is still the next lower value; if there is no second value, return NULL.</p>',
    vi: '<p>Trả một dòng, một cột <code>luong_cao_thu_hai</code>: mức lương <b>khác nhau</b> cao thứ hai trong tblEmployee. Hai người cùng lương cao nhất thì đáp án vẫn là mức thấp hơn kế tiếp; không có mức thứ hai thì trả NULL.</p>',
    yc: [['MAX of the salaries that are below the MAX — or DENSE_RANK = 2.', 'MAX của các mức dưới MAX — hoặc DENSE_RANK = 2.'], ['Exactly one row, even when the answer is NULL.', 'Đúng một dòng, kể cả khi đáp án là NULL.']],
    giai: `SELECT MAX(empSalary) AS luong_cao_thu_hai           -- MAX over an empty set is NULL: one row, as required
FROM tblEmployee
WHERE empSalary < (SELECT MAX(empSalary) FROM tblEmployee);`,
    kiem: [
      kq(['105,000', '105.000']),
      kqAn(['Hidden: a second person at 150,000', 'Ẩn: thêm một người lương 150.000'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test Top', NULL, 150000, 'F', NULL, 1, NULL)"),
      kqAn(['Hidden: everybody earns the same — the answer is NULL, still one row', 'Ẩn: mọi người cùng lương — đáp án là NULL, vẫn một dòng'], 'UPDATE tblEmployee SET empSalary = 50000'),
    ],
    sai: [
      'SELECT empSalary AS luong_cao_thu_hai FROM tblEmployee ORDER BY empSalary DESC OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;',
      'SELECT DISTINCT empSalary AS luong_cao_thu_hai FROM tblEmployee ORDER BY empSalary DESC OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;',
      'SELECT MAX(empSalary) AS luong_cao_thu_hai FROM tblEmployee WHERE empSalary <= (SELECT MAX(empSalary) FROM tblEmployee);',
    ],
    gy: [['"Second-highest" = the highest of what is left after removing the highest VALUE.', '"Cao thứ hai" = cao nhất trong phần còn lại sau khi bỏ GIÁ TRỊ cao nhất.'], ['An aggregate without GROUP BY always returns exactly one row.', 'Hàm gộp không có GROUP BY luôn trả đúng một dòng.']],
    lhg: [['OFFSET 1 on the raw rows — with a tie at the top it returns the top salary again.', 'OFFSET 1 trên các dòng thô — hoà ở đỉnh thì trả lại lương cao nhất.'], ['SELECT DISTINCT … OFFSET 1 returns NO row when there is no second value, not NULL.', 'SELECT DISTINCT … OFFSET 1 trả KHÔNG dòng nào khi không có mức thứ hai, chứ không phải NULL.']],
    gt: ['<p>The three clarifying questions — ties? NULL salaries? no second value? — are what the interviewer is really testing. MAX/AVG ignore NULL salaries automatically.</p>', '<p>Ba câu hỏi làm rõ — hoà? lương NULL? không có mức thứ hai? — mới là thứ người phỏng vấn thật sự kiểm tra. MAX/AVG tự bỏ qua lương NULL.</p>'],
    tn: [tn('distinct value', 'giá trị khác nhau')],
  }),
  de({
    t: 'Head count per department, including departments with nobody', k: 'MEDIUM', p: 8,
    kn: ['LEFT JOIN', 'COUNT(*) vs COUNT(column)'], tag: ['advanced', 'interview', 'join'],
    en: '<p>Every department: <code>depNum, depName, so_nv</code> (number of employees, <b>0</b> for an empty department). Sort by depNum.</p>',
    vi: '<p>Mọi phòng: <code>depNum, depName, so_nv</code> (số nhân viên, <b>0</b> với phòng trống). Sắp theo depNum.</p>',
    yc: [['LEFT JOIN from tblDepartment so that empty departments stay.', 'LEFT JOIN từ tblDepartment để phòng trống còn lại.'], ['Count a column of the employee side, not *.', 'Đếm một cột phía nhân viên, không đếm *.']],
    giai: `SELECT d.depNum, d.depName, COUNT(e.empSSN) AS so_nv     -- COUNT(column) skips the NULL row of an empty department
FROM tblDepartment d
LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum, d.depName
ORDER BY d.depNum;`,
    kiem: [
      kq(['Five departments', 'Năm phòng'], { thuTu: true }),
      kqAn(['Hidden: a new department with nobody yet', 'Ẩn: phòng mới chưa có ai'], "INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES (6, N'Phòng Mới', NULL, NULL)", { thuTu: true }),
      ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b'),
    ],
    sai: [
      'SELECT d.depNum, d.depName, COUNT(*) AS so_nv FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum, d.depName ORDER BY d.depNum;',
      'SELECT d.depNum, d.depName, COUNT(e.empSSN) AS so_nv FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum GROUP BY d.depNum, d.depName ORDER BY d.depNum;',
      'SELECT d.depNum, d.depName, COUNT(e.empSSN) AS so_nv FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum WHERE e.empSalary > 0 GROUP BY d.depNum, d.depName ORDER BY d.depNum;',
    ],
    gy: [['The empty department produces ONE joined row full of NULLs.', 'Phòng trống sinh MỘT dòng nối toàn NULL.'], ['A WHERE on the right table turns the LEFT JOIN back into an inner join — filter in ON instead.', 'WHERE trên bảng phải biến LEFT JOIN trở lại thành nối trong — lọc trong ON thay vào đó.']],
    lhg: [['COUNT(*) — the empty department shows 1.', 'COUNT(*) — phòng trống hiện 1.'], ['INNER JOIN — the empty department disappears.', 'INNER JOIN — phòng trống biến mất.']],
    gt: ['<p>The base data has no empty department, so the wrong versions look right — only the hidden check exposes them. That is precisely the trap: always test with the edge case you asked about.</p>', '<p>Dữ liệu gốc không có phòng trống nên các bản sai trông như đúng — chỉ kiểm ẩn mới lộ ra. Đó chính là cái bẫy: luôn thử bằng ca biên bạn đã hỏi.</p>'],
    tn: [tn('outer join', 'phép nối ngoài')],
  }),
  de({
    csdl: SHOP, tenCsdl: 'Shop', ld: { en: '<p><code>KhachHang(id, ten)</code> 4 customers; <code>DonHang(id, khachHangId NULL, tongTien)</code> — order 13 has no customer (a walk-in sale).</p>', vi: '<p><code>KhachHang(id, ten)</code> 4 khách; <code>DonHang(id, khachHangId NULL, tongTien)</code> — đơn 13 không có khách (khách vãng lai).</p>' },
    t: 'Customers who never ordered — when one order has no customer', k: 'MEDIUM', p: 8,
    kn: ['NOT EXISTS', 'NOT IN and NULL', 'anti-join'], tag: ['advanced', 'interview', 'null'],
    en: '<p>Return <code>id, ten</code> of the customers who have never placed an order, sorted by id. (Expected: Binh and Dung.)</p>',
    vi: '<p>Trả <code>id, ten</code> của khách chưa từng đặt đơn, sắp theo id. (Mong đợi: Binh và Dung.)</p>',
    yc: [['NOT EXISTS (correlated) or LEFT JOIN … WHERE o.id IS NULL.', 'NOT EXISTS (tương quan) hoặc LEFT JOIN … WHERE o.id IS NULL.'], ['Do not use NOT IN on a column that can be NULL.', 'Đừng dùng NOT IN trên cột có thể NULL.']],
    giai: `SELECT k.id, k.ten
FROM KhachHang k
WHERE NOT EXISTS (SELECT 1 FROM DonHang d WHERE d.khachHangId = k.id)
ORDER BY k.id;`,
    kiem: [
      kq(['Binh and Dung', 'Binh và Dung'], { thuTu: true }),
      kqAn(['Hidden: Binh orders, a new customer arrives', 'Ẩn: Binh đặt đơn, có khách mới'], "INSERT INTO DonHang VALUES (14, 2, 10000); INSERT INTO KhachHang VALUES (5, 'Em')", { thuTu: true }),
      ma(['No NOT IN', 'Không dùng NOT IN'], '\\bNOT\\s+IN\\b', true),
    ],
    sai: [
      'SELECT k.id, k.ten FROM KhachHang k WHERE k.id NOT IN (SELECT khachHangId FROM DonHang) ORDER BY k.id;',
      'SELECT k.id, k.ten FROM KhachHang k LEFT JOIN DonHang d ON d.khachHangId = k.id WHERE d.tongTien > 0 ORDER BY k.id;',
      'SELECT k.id, k.ten FROM KhachHang k WHERE EXISTS (SELECT 1 FROM DonHang d WHERE d.khachHangId = k.id) ORDER BY k.id;',
    ],
    gy: [['id NOT IN (1, 3, NULL) means id <> 1 AND id <> 3 AND id <> NULL — the last part is UNKNOWN.', 'id NOT IN (1, 3, NULL) nghĩa là id <> 1 AND id <> 3 AND id <> NULL — vế cuối là UNKNOWN.'], ['NOT EXISTS only asks "is there a matching row?", so NULLs cannot spoil it.', 'NOT EXISTS chỉ hỏi "có dòng khớp không?" nên NULL không làm hỏng được.']],
    lhg: [['NOT IN (SELECT khachHangId …) — returns nothing because of the walk-in order.', 'NOT IN (SELECT khachHangId …) — không trả gì vì đơn khách vãng lai.'], ['LEFT JOIN with a condition on the right table in WHERE.', 'LEFT JOIN kèm điều kiện trên bảng phải trong WHERE.']],
    gt: ['<p>NOT IN works only if you add WHERE khachHangId IS NOT NULL inside the subquery — which nobody remembers on the day the first NULL arrives. NOT EXISTS is the safe habit, and both engines optimise it as an anti-join.</p>', '<p>NOT IN chỉ đúng khi thêm WHERE khachHangId IS NOT NULL trong truy vấn con — điều không ai nhớ vào ngày NULL đầu tiên xuất hiện. NOT EXISTS là thói quen an toàn, và cả hai hệ đều tối ưu nó thành anti-join.</p>'],
    tn: [tn('anti-join', 'phép nối phủ định')],
  }),
  de({
    t: 'Share of the company per department — the integer-division trap', k: 'MEDIUM', p: 8,
    kn: ['window over an aggregate', 'integer division', 'percentage'], tag: ['advanced', 'interview', 'window'],
    en: '<p>For each department: <code>depNum, so_nv</code> and <code>ty_le</code> = its share (%) of all employees as <code>DECIMAL(5,2)</code>, e.g. 4 of 14 → 28.57. Sort by depNum.</p>',
    vi: '<p>Với mỗi phòng: <code>depNum, so_nv</code> và <code>ty_le</code> = tỉ lệ (%) trên toàn bộ nhân viên dạng <code>DECIMAL(5,2)</code>, ví dụ 4 trên 14 → 28.57. Sắp theo depNum.</p>',
    yc: [['SUM(COUNT(*)) OVER () = the company total, computed after GROUP BY.', 'SUM(COUNT(*)) OVER () = tổng toàn công ty, tính sau GROUP BY.'], ['Multiply by 100.0, not 100: COUNT is an integer.', 'Nhân 100.0, không phải 100: COUNT là số nguyên.']],
    giai: `SELECT depNum,
       COUNT(*) AS so_nv,
       CAST(ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS DECIMAL(5,2)) AS ty_le   -- window over the grouped rows
FROM tblEmployee
GROUP BY depNum
ORDER BY depNum;`,
    kiem: [
      kq(['Five departments with their share', 'Năm phòng với tỉ lệ'], { thuTu: true }),
      kqAn(['Hidden: two more hires in department 4', 'Ẩn: tuyển thêm hai người phòng 4'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test A', NULL, 40000, 'M', NULL, 4, 30121050030), (30121050091, N'Test B', NULL, 41000, 'F', NULL, 4, 30121050030)", { thuTu: true }),
      ma(['A window over the aggregate', 'Cửa sổ trên hàm gộp'], '\\bOVER\\s*\\(\\s*\\)'),
      ma(['Decimal, not integer, division (100.0 or a CAST before dividing)', 'Chia thập phân, không chia nguyên (100.0 hoặc CAST trước khi chia)'], '100\\.0|\\*\\s*1\\.0\\b|CAST\\s*\\(\\s*COUNT\\s*\\(\\s*\\*\\s*\\)\\s*AS\\s*(DECIMAL|NUMERIC|FLOAT)'),
    ],
    sai: [
      'SELECT depNum, COUNT(*) AS so_nv, CAST(100 * COUNT(*) / SUM(COUNT(*)) OVER () AS DECIMAL(5,2)) AS ty_le FROM tblEmployee GROUP BY depNum ORDER BY depNum;',
      'SELECT depNum, COUNT(*) AS so_nv, CAST(ROUND(100.0 * COUNT(*) / COUNT(*) OVER (), 2) AS DECIMAL(5,2)) AS ty_le FROM tblEmployee GROUP BY depNum ORDER BY depNum;',
    ],
    gy: [['Windows run after GROUP BY, so they can wrap an aggregate.', 'Cửa sổ chạy sau GROUP BY nên bọc được hàm gộp.'], ['4 / 14 = 0 in integer arithmetic; 100.0 * 4 / 14 = 28.57…', '4 / 14 = 0 trong số học nguyên; 100.0 * 4 / 14 = 28,57…']],
    lhg: [['100 * COUNT(*) / … — integer division truncates 28.57 to 28.', '100 * COUNT(*) / … — chia nguyên cắt 28,57 thành 28.'], ['COUNT(*) OVER () — counts the GROUPS (5), not the employees.', 'COUNT(*) OVER () — đếm số NHÓM (5), không phải số nhân viên.']],
    gt: ['<p>Two traps in one line: integer division and "which rows does the window see". After GROUP BY the window sees one row per department, so the total must be SUM(COUNT(*)). On SQL Server COUNT and SUM(COUNT) are INT, so 100 * 4 / 14 = 28 exactly; PostgreSQL happens to return numeric for SUM(bigint) — the grader therefore checks the 100.0 in your code.</p>', '<p>Hai cái bẫy trong một dòng: chia nguyên và "cửa sổ nhìn thấy những dòng nào". Sau GROUP BY cửa sổ thấy mỗi phòng một dòng nên tổng phải là SUM(COUNT(*)). Trên SQL Server COUNT và SUM(COUNT) là INT nên 100 * 4 / 14 = đúng 28; PostgreSQL tình cờ trả numeric cho SUM(bigint) — vì thế máy chấm kiểm chữ 100.0 trong mã của bạn.</p>'],
    tn: [tn('integer division', 'phép chia nguyên')],
  }),
  de({
    t: "Swap every 'M' and 'F' with ONE statement", k: 'EASY', p: 6,
    kn: ['UPDATE with CASE', 'all-at-once evaluation'], tag: ['advanced', 'interview', 'update'],
    en: "<p>A data-entry error swapped the sexes of every employee. Fix it with a single UPDATE: every <code>'M'</code> becomes <code>'F'</code> and every <code>'F'</code> becomes <code>'M'</code>; a missing value (NULL) stays NULL.</p>",
    vi: "<p>Lỗi nhập liệu đã đảo giới tính của mọi nhân viên. Sửa bằng một câu UPDATE: mọi <code>'M'</code> thành <code>'F'</code> và mọi <code>'F'</code> thành <code>'M'</code>; giá trị thiếu (NULL) giữ NULL.</p>",
    yc: [['UPDATE tblEmployee SET empSex = CASE … END;', 'UPDATE tblEmployee SET empSex = CASE … END;'], ['Two UPDATEs in a row do NOT work (the second undoes the first).', 'Hai câu UPDATE liên tiếp KHÔNG được (câu sau phá câu trước).']],
    giai: `UPDATE tblEmployee
SET empSex = CASE empSex WHEN 'M' THEN 'F'
                         WHEN 'F' THEN 'M'
             END;                              -- no ELSE: NULL stays NULL`,
    kiem: [
      sau(['Every sex is swapped', 'Mọi giới tính đã đổi'], 'SELECT empSSN, empSex FROM tblEmployee ORDER BY empSSN'),
      sau(['Hidden: an employee with no sex recorded stays NULL', 'Ẩn: nhân viên chưa ghi giới tính vẫn NULL'], 'SELECT empSSN, empSex FROM tblEmployee ORDER BY empSSN', { an: true, themCsdl: "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test Null', NULL, 40000, NULL, NULL, 4, NULL)" }),
      ma(['A single UPDATE with CASE', 'Một câu UPDATE với CASE'], '\\bCASE\\b'),
    ],
    sai: [
      "UPDATE tblEmployee SET empSex = 'F' WHERE empSex = 'M'; UPDATE tblEmployee SET empSex = 'M' WHERE empSex = 'F';",
      "UPDATE tblEmployee SET empSex = CASE WHEN empSex = 'M' THEN 'F' ELSE 'M' END;",
    ],
    gy: [['All right-hand sides of one UPDATE are computed from the OLD row.', 'Mọi vế phải của một câu UPDATE đều tính từ dòng CŨ.'], ['CASE without ELSE returns NULL for anything else.', 'CASE không ELSE trả NULL cho mọi giá trị khác.']],
    lhg: [['Two UPDATEs: everyone ends up M.', 'Hai câu UPDATE: cuối cùng mọi người thành M.'], ["ELSE 'M' — an unknown sex becomes M.", "ELSE 'M' — giới tính chưa biết thành M."]],
    gt: ['<p>The same "all at once" rule lets you swap two columns: UPDATE t SET a = b, b = a works on both SQL Server and PostgreSQL.</p>', '<p>Cùng luật "tính một lượt" cho phép đổi chỗ hai cột: UPDATE t SET a = b, b = a chạy được trên cả SQL Server lẫn PostgreSQL.</p>'],
    tn: [tn('searched CASE', 'biểu thức CASE có điều kiện')],
  }),
]);
