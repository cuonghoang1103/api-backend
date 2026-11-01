/**
 * DBI202 · 6.C Slide trường Chương 6 (53–67) — truy vấn con tương quan, biểu thức JOIN (CROSS / FULL OUTER), nối ngoài,
 * ON khác WHERE với nối ngoài — trên FUHCompany.
 */
import { mod, de, cs, q, kq, kqAn, ma, TN, tn } from './_chung.mjs';

export default mod('dbi202-slide-dbi7-5', '6.C Correlated subqueries, JOIN expressions, outer joins (slides 53–67)', [
  de({
    t: 'Correlated EXISTS: projects with somebody working 30+ hours', k: 'MEDIUM', p: 8,
    kn: ['correlated subquery', 'EXISTS'], tag: ['subquery', 'exists', 'fuhcompany', 'slide'],
    en: '<p>List the projects (<code>proNum, proName</code>) on which <b>at least one</b> employee works 30 hours or more. Use a correlated EXISTS (each project once — no DISTINCT needed).</p>',
    vi: '<p>Liệt kê các dự án (<code>proNum, proName</code>) có <b>ít nhất một</b> nhân viên làm từ 30 giờ. Dùng EXISTS tương quan (mỗi dự án một lần — không cần DISTINCT).</p>',
    yc: [['Columns: <code>proNum, proName</code>.', 'Cột: <code>proNum, proName</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT p.proNum, p.proName
FROM tblProject p
WHERE EXISTS (SELECT 1 FROM tblWorksOn w
              WHERE w.proNum = p.proNum          -- correlation: refers to the outer row
                AND w.workHours >= 30);`,
    kiem: [kq(['Projects with a 30+ hour worker', 'Dự án có người làm từ 30 giờ']), kqAn(['ProjectF drops to 20 hours; a new project has nobody', 'ProjectF giảm còn 20 giờ; dự án mới chưa có ai'], "UPDATE tblWorksOn SET workHours = 20 WHERE proNum = 6; INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 1, 5)"), ma(['Uses EXISTS', 'Dùng EXISTS'], '\\bEXISTS\\b')],
    sai: [`SELECT p.proNum, p.proName FROM tblProject p JOIN tblWorksOn w ON w.proNum = p.proNum WHERE w.workHours >= 30`, `SELECT p.proNum, p.proName FROM tblProject p WHERE EXISTS (SELECT 1 FROM tblWorksOn w WHERE w.workHours >= 30)`],
    gy: [['The inner query must mention the outer alias p — otherwise it is the same for every project.', 'Truy vấn trong phải nhắc tới bí danh ngoài p — không thì nó giống nhau với mọi dự án.'], ['EXISTS stops at the first matching row and returns each project once.', 'EXISTS dừng ở dòng khớp đầu tiên và trả mỗi dự án một lần.']],
    lhg: [['A plain JOIN — a project with two 30-hour workers appears twice.', 'JOIN thường — dự án có hai người 30 giờ xuất hiện hai lần.'], ['An uncorrelated EXISTS — TRUE for every project as soon as anybody works 30 hours somewhere.', 'EXISTS không tương quan — TRUE với mọi dự án chỉ cần ai đó làm 30 giờ ở đâu đó.']],
    gt: ['<p>On the sample data every project has a 30+ hour worker (ProjectE even two — a JOIN would list it twice). The hidden data lowers ProjectF and adds an empty project: an uncorrelated EXISTS would still return them.</p>', '<p>Trên dữ liệu mẫu dự án nào cũng có người làm từ 30 giờ (ProjectE còn có hai người — JOIN sẽ liệt kê nó hai lần). Dữ liệu ẩn hạ ProjectF và thêm dự án rỗng: EXISTS không tương quan vẫn sẽ trả chúng.</p>'],
    tn: [TN.correlated, TN.exists],
  }),
  de({
    t: 'CROSS JOIN + EXCEPT: department–city pairs with no office', k: 'HARD', p: 10,
    kn: ['CROSS JOIN', 'EXCEPT', 'missing combinations'], tag: ['join', 'cross-join', 'except', 'fuhcompany', 'slide'],
    en: '<p>Management wants to know, for every department and every location, where the department has <b>no</b> office yet. Build all (depNum, locNum) pairs with a CROSS JOIN and remove the pairs that exist in tblDepLocation.</p>',
    vi: '<p>Ban giám đốc muốn biết, với mọi phòng và mọi địa điểm, phòng nào <b>chưa</b> có văn phòng ở đâu. Dựng mọi cặp (depNum, locNum) bằng CROSS JOIN rồi bỏ các cặp đã có trong tblDepLocation.</p>',
    yc: [['Columns: <code>depNum, locNum</code>.', 'Cột: <code>depNum, locNum</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT d.depNum, l.locNum
FROM tblDepartment d CROSS JOIN tblLocation l      -- 5 × 4 = 20 combinations
EXCEPT
SELECT depNum, locNum FROM tblDepLocation;           -- minus the 8 that exist`,
    kiem: [kq(['Missing department–location pairs', 'Các cặp phòng–địa điểm còn thiếu']), kqAn(['A new location and a new office', 'Thêm địa điểm và văn phòng mới'], "INSERT INTO tblLocation VALUES (5, N'TP Huế'); INSERT INTO tblDepLocation VALUES (4, 4)"), ma(['Uses CROSS JOIN', 'Dùng CROSS JOIN'], '\\bCROSS\\s+JOIN\\b|\\bFROM\\s+tblDepartment\\s+\\w*\\s*,\\s*tblLocation\\b')],
    sai: [`SELECT depNum, locNum FROM tblDepLocation`, `SELECT d.depNum, l.locNum FROM tblDepartment d CROSS JOIN tblLocation l`],
    gy: [['CROSS JOIN = every row of one table with every row of the other (the product ×).', 'CROSS JOIN = mỗi dòng bảng này với mọi dòng bảng kia (tích ×).'], ['Then EXCEPT the pairs that already exist.', 'Rồi EXCEPT các cặp đã có.']],
    lhg: [['Returning the existing pairs instead of the missing ones.', 'Trả các cặp đã có thay vì các cặp còn thiếu.'], ['Returning all 20 combinations.', 'Trả cả 20 tổ hợp.']],
    gt: ['<p>Expected: 20 − 8 = 12 pairs. "Combinations that do not exist" is the typical use of a product: build every candidate, then subtract reality.</p>', '<p>Kết quả: 20 − 8 = 12 cặp. "Tổ hợp chưa tồn tại" là cách dùng điển hình của phép tích: dựng mọi ứng viên rồi trừ thực tế.</p>'],
    tn: [tn('CROSS JOIN', 'nối chéo (tích)')],
  }),
  de({
    t: 'FULL OUTER JOIN: departments and projects, nobody left out', k: 'MEDIUM', p: 9,
    kn: ['FULL OUTER JOIN', 'NULL padding on both sides'], tag: ['join', 'outer-join', 'fuhcompany', 'slide'],
    en: '<p>List every department with every project it controls, keeping departments without projects <b>and</b> projects without a department (the hidden data adds one).</p>',
    vi: '<p>Liệt kê mọi phòng với mọi dự án nó quản lý, giữ cả phòng không có dự án <b>và</b> dự án không thuộc phòng nào (dữ liệu ẩn thêm một dự án như vậy).</p>',
    yc: [['Columns: <code>depNum, depName, proNum, proName</code>.', 'Cột: <code>depNum, depName, proNum, proName</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT d.depNum, d.depName, p.proNum, p.proName
FROM tblDepartment d
FULL OUTER JOIN tblProject p ON p.depNum = d.depNum;   -- both sides preserved`,
    kiem: [kq(['Departments and projects', 'Phòng và dự án']), kqAn(['A project with no department', 'Dự án không thuộc phòng nào'], "INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 1, NULL)"), ma(['Uses FULL (OUTER) JOIN', 'Dùng FULL (OUTER) JOIN'], '\\bFULL\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [`SELECT d.depNum, d.depName, p.proNum, p.proName FROM tblDepartment d LEFT JOIN tblProject p ON p.depNum = d.depNum`, `SELECT d.depNum, d.depName, p.proNum, p.proName FROM tblDepartment d RIGHT JOIN tblProject p ON p.depNum = d.depNum`],
    gy: [['LEFT keeps the left side, RIGHT the right side, FULL both.', 'LEFT giữ vế trái, RIGHT giữ vế phải, FULL giữ cả hai.'], ['Unmatched rows get NULL in the columns of the other table.', 'Dòng không khớp có NULL ở các cột của bảng kia.']],
    lhg: [['LEFT JOIN — a project without a department is lost.', 'LEFT JOIN — dự án không thuộc phòng nào bị mất.'], ['RIGHT JOIN — Phòng Nghiên cứu (no project) is lost.', 'RIGHT JOIN — Phòng Nghiên cứu (không dự án) bị mất.']],
    gt: ['<p>Expected on the sample data: 6 project rows plus department 5 with NULL project. FULL OUTER JOIN = LEFT ∪ RIGHT.</p>', '<p>Kết quả trên dữ liệu mẫu: 6 dòng dự án cộng phòng 5 với dự án NULL. FULL OUTER JOIN = LEFT ∪ RIGHT.</p>'],
    tn: [tn('FULL OUTER JOIN', 'nối ngoài đầy đủ')],
  }),
  de({
    t: 'Outer join trap: filter the right table in ON, not in WHERE', k: 'HARD', p: 10,
    kn: ['LEFT JOIN', 'ON vs WHERE'], tag: ['join', 'outer-join', 'fuhcompany', 'slide'],
    en: '<p>Every employee of department 1 with the hours they work on <b>ProjectB</b> (proNum 2) — employees not on ProjectB must still appear, with NULL hours.</p>',
    vi: '<p>Mọi nhân viên phòng 1 kèm số giờ họ làm cho <b>ProjectB</b> (proNum 2) — người không làm ProjectB vẫn phải xuất hiện, giờ là NULL.</p>',
    yc: [['Columns: <code>empSSN, empName, workHours</code>.', 'Cột: <code>empSSN, empName, workHours</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.empSSN, e.empName, w.workHours
FROM tblEmployee e
LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
                      AND w.proNum = 2          -- condition on the RIGHT table belongs in ON
WHERE e.depNum = 1;                              -- condition on the LEFT table in WHERE`,
    kiem: [kq(['Department 1 with ProjectB hours', 'Phòng 1 kèm giờ ProjectB']), kqAn(['Another department-1 employee', 'Thêm nhân viên phòng 1'], "INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050097, N'Quách Văn Tú', 1); INSERT INTO tblWorksOn VALUES (30121050097, 1, 5.0)"), ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [`SELECT e.empSSN, e.empName, w.workHours FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN WHERE e.depNum = 1 AND w.proNum = 2`, `SELECT e.empSSN, e.empName, w.workHours FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN WHERE e.depNum = 1`],
    gy: [['A WHERE condition on the right table removes the NULL-padded rows — the LEFT JOIN silently becomes an INNER JOIN.', 'Điều kiện WHERE trên bảng phải loại các dòng điền NULL — LEFT JOIN lặng lẽ thành INNER JOIN.'], ['Put w.proNum = 2 in the ON clause.', 'Đặt w.proNum = 2 trong mệnh đề ON.']],
    lhg: [['WHERE … AND w.proNum = 2 — Trần Minh Quang and Hoàng Thị Hà disappear.', 'WHERE … AND w.proNum = 2 — Trần Minh Quang và Hoàng Thị Hà biến mất.'], ['No project condition at all — every project of every employee.', 'Không có điều kiện dự án — mọi dự án của mọi người.']],
    gt: ['<p>For an outer join, ON decides what MATCHES; WHERE decides what is KEPT afterwards. A filter on the preserved side goes in WHERE, a filter on the other side in ON.</p>', '<p>Với nối ngoài, ON quyết định cái gì KHỚP; WHERE quyết định cái gì được GIỮ sau đó. Lọc phía được giữ đặt ở WHERE, lọc phía bên kia đặt ở ON.</p>'],
    tn: [TN.leftJoin],
  }),
  cs({
    t: 'JOIN expressions in four questions', k: 'MEDIUM', p: 6,
    kn: ['NATURAL JOIN', 'JOIN types'], tag: ['join', 'slide'],
    en: '<p>Slides 58–67.</p>', vi: '<p>Slide 58–67.</p>',
    cau: [
      q('c1', ['Does SQL Server support NATURAL JOIN?', 'SQL Server có hỗ trợ NATURAL JOIN?'], ['No — write JOIN … ON with the common columns', 'Yes, exactly like PostgreSQL', 'Only for two tables', 'Only with USING'], ['NATURAL JOIN and JOIN … USING exist in PostgreSQL/MySQL, not in T-SQL.', 'NATURAL JOIN và JOIN … USING có ở PostgreSQL/MySQL, không có trong T-SQL.']),
      q('c2', ['tblEmployee e LEFT JOIN tblDependent d ON … returns how many rows for an employee with no dependent?', 'tblEmployee e LEFT JOIN tblDependent d ON … trả bao nhiêu dòng cho nhân viên không có người phụ thuộc?'], ['1, with NULLs in the dependent columns', '0', '2', 'as many as there are dependents in the table'], ['The preserved side always appears at least once.', 'Vế được giữ luôn xuất hiện ít nhất một lần.']),
      q('c3', ['A LEFT JOIN B equals…', 'A LEFT JOIN B bằng…'], ['B RIGHT JOIN A (with the same ON)', 'A RIGHT JOIN B', 'A FULL JOIN B', 'A CROSS JOIN B'], ['LEFT/RIGHT only name which side is preserved.', 'LEFT/RIGHT chỉ nói vế nào được giữ.']),
      q('c4', ['How many rows does tblDepartment CROSS JOIN tblLocation return (5 departments, 4 locations)?', 'tblDepartment CROSS JOIN tblLocation trả bao nhiêu dòng (5 phòng, 4 địa điểm)?'], ['20', '9', '5', '8'], ['The product: 5 × 4.', 'Phép tích: 5 × 4.']),
    ],
    gy: [['Write the join condition explicitly — it is portable and survives schema changes.', 'Viết điều kiện nối tường minh — chạy mọi hệ và sống sót khi lược đồ đổi.'], ['Preserved side ⇒ at least one row per row of that side.', 'Vế được giữ ⇒ ít nhất một dòng cho mỗi dòng của vế đó.']],
    lhg: [['Using NATURAL JOIN on SQL Server.', 'Dùng NATURAL JOIN trên SQL Server.'], ['Confusing CROSS JOIN with an inner join.', 'Nhầm CROSS JOIN với nối trong.']],
    tn: [tn('JOIN expression', 'biểu thức nối')],
  }),
]);
