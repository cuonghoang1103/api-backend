/**
 * DBI202 · 6.4 — Truy vấn lồng: so với giá trị gộp, IN, NOT EXISTS, tương quan, bẫy NOT IN + NULL, >= ALL.
 * CSDL: FUHCompany. Bài giảng: dbi202-truy-van-long.
 */
import { doiDau, KHOA, sql, kq, kqAn, ma, TN } from './_chung.mjs';

const THEM = `INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES (6, N'Phòng Đào tạo', NULL, NULL);
INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', NULL, 99000, 'M', '1994-02-02', 3, 30121050021),
 (30121050096, N'Đinh Thị Hoa', NULL, 72000, 'F', '1997-07-07', 2, 30121050011);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 3, 10.0), (30121050096, 2, 5.0)`;

export default doiDau({
  slug: 'dbi202-truy-van-long',
  ten: '6.4 Subqueries: IN, EXISTS, correlated, ALL and the NULL trap',
  khoa: KHOA,
  baiHoc: 'dbi202-truy-van-long',
  de: [
    sql({
      tieuDe: 'Paid more than the company average',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['scalar subquery', 'comparison with an aggregate'], the: ['subquery', 'fuhcompany'],
      moTa: {
        en: '<p>List the employees whose salary is <b>above the average salary of the whole company</b>.</p>',
        vi: '<p>Liệt kê nhân viên có lương <b>cao hơn lương trung bình của cả công ty</b>.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Do not hard-code the average — it changes when people are hired.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Không chép cứng giá trị trung bình — tuyển người là nó đổi.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary > (SELECT AVG(empSalary) FROM tblEmployee);   -- scalar subquery: one row, one column`,
      kiem: [kq('Above-average earners'), kqAn('Average moves after hiring', THEM), ma('Uses a subquery', '\\(\\s*SELECT\\b')],
      saiMau: ['SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary > 73214'],
      goiY: ['WHERE cannot contain AVG directly — but it can compare with a subquery that returns one value.', 'WHERE empSalary &gt; (SELECT AVG(empSalary) FROM tblEmployee).'],
      loiHayGap: [
        { en: 'WHERE empSalary > AVG(empSalary) — aggregates are not allowed in WHERE.', vi: 'WHERE empSalary > AVG(empSalary) — không dùng hàm gộp trong WHERE.' },
        { en: 'Hard-coding 73214 — wrong the moment the data changes (hidden check).', vi: 'Chép cứng 73214 — sai ngay khi dữ liệu đổi (kiểm ẩn).' },
      ],
      giaiThich: { en: '<p>A scalar subquery is evaluated once and returns a single value that the outer WHERE compares against.</p>', vi: '<p>Truy vấn con vô hướng chạy một lần, trả một giá trị để WHERE ngoài so sánh.</p>' },
      thuatNgu: [TN.subquery, { en: 'scalar subquery', vi: 'truy vấn con trả một giá trị' }],
    }),
    sql({
      tieuDe: 'Staff of ProjectC using IN',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['IN (subquery)', 'semi-join'], the: ['subquery', 'in', 'fuhcompany'],
      moTa: {
        en: '<p>Who works on the project named <b>ProjectC</b>? Answer with a subquery (IN or EXISTS), not a join.</p>',
        vi: '<p>Ai làm dự án tên <b>ProjectC</b>? Trả lời bằng truy vấn con (IN hoặc EXISTS), không dùng JOIN.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>.', 'Use IN (SELECT …) or EXISTS; filter by the project name.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>.', 'Dùng IN (SELECT …) hoặc EXISTS; lọc theo tên dự án.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName
FROM tblEmployee
WHERE empSSN IN (SELECT w.empSSN
                 FROM tblWorksOn w
                 JOIN tblProject p ON p.proNum = w.proNum
                 WHERE p.proName = N'ProjectC');`,
      kiem: [kq('Employees of ProjectC'), kqAn('A new member joins ProjectC', THEM), ma('Uses IN/EXISTS with a subquery', '\\bIN\\s*\\(\\s*SELECT\\b|\\bEXISTS\\s*\\(')],
      saiMau: ["SELECT empSSN, empName FROM tblEmployee WHERE empSSN = (SELECT w.empSSN FROM tblWorksOn w WHERE w.proNum = 3)", "SELECT e.empSSN, e.empName FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN WHERE w.proNum = 3"],
      goiY: ['The subquery returns the SSNs of ProjectC\'s workers; the outer query keeps employees whose SSN is IN that list.', 'Use IN, not =, because the subquery returns several rows.'],
      loiHayGap: [
        { en: 'Using = instead of IN — error "subquery returned more than 1 value" (SQL Server Msg 512).', vi: 'Dùng = thay vì IN — lỗi "truy vấn con trả nhiều hơn 1 giá trị" (SQL Server Msg 512).' },
        { en: 'Filtering by proNum = 3 — the question names the project.', vi: 'Lọc proNum = 3 — đề nói theo tên dự án.' },
      ],
      giaiThich: { en: '<p>IN with a subquery is a semi-join: each employee appears at most once, even if the subquery lists their SSN several times — unlike a JOIN, which can duplicate rows.</p>', vi: '<p>IN với truy vấn con là semi-join: mỗi nhân viên xuất hiện tối đa một lần, kể cả khi truy vấn con liệt kê SSN nhiều lần — khác JOIN có thể nhân bản dòng.</p>' },
      thuatNgu: [TN.subquery, { en: 'semi-join', vi: 'nối nửa (chỉ kiểm có tồn tại cặp)' }],
    }),
    sql({
      tieuDe: 'Departments that run no project (NOT EXISTS)',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['NOT EXISTS', 'correlated subquery'], the: ['subquery', 'exists', 'fuhcompany'],
      moTa: {
        en: '<p>Which departments do <b>not control any project</b>?</p>',
        vi: '<p>Phòng nào <b>không quản lý dự án nào</b>?</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>depName</code>.', 'Use NOT EXISTS.', 'Row order does not matter.'],
        vi: ['Cột: <code>depNum</code>, <code>depName</code>.', 'Dùng NOT EXISTS.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT d.depNum, d.depName
FROM tblDepartment d
WHERE NOT EXISTS (SELECT 1
                  FROM tblProject p
                  WHERE p.depNum = d.depNum);   -- correlated: refers to the outer d`,
      kiem: [kq('Departments without projects'), kqAn('A new empty department', THEM), ma('Uses NOT EXISTS', '\\bNOT\\s+EXISTS\\b')],
      saiMau: ['SELECT d.depNum, d.depName FROM tblDepartment d WHERE NOT EXISTS (SELECT 1 FROM tblProject p)'],
      goiY: ['EXISTS (subquery) is TRUE when the subquery returns at least one row.', 'Correlate it: inside the subquery compare p.depNum with the outer d.depNum.'],
      loiHayGap: [
        { en: 'Forgetting the correlation (no WHERE p.depNum = d.depNum) — the subquery is the same for every department, so the answer is all or nothing.', vi: 'Quên điều kiện tương quan — truy vấn con giống nhau cho mọi phòng nên ra tất cả hoặc không gì.' },
        { en: 'SELECT * vs SELECT 1 inside EXISTS — both work; the select list of EXISTS is ignored.', vi: 'SELECT * hay SELECT 1 trong EXISTS — đều được; danh sách cột của EXISTS bị bỏ qua.' },
      ],
      giaiThich: { en: '<p>NOT EXISTS is the safest anti-join: it is not affected by NULLs (unlike NOT IN) and optimisers handle it well on both engines.</p>', vi: '<p>NOT EXISTS là anti-join an toàn nhất: không bị NULL làm hỏng (khác NOT IN) và bộ tối ưu của cả hai hệ xử lý tốt.</p>' },
      thuatNgu: [TN.exists, TN.correlated],
    }),
    sql({
      tieuDe: 'Above their own department\'s average (correlated)',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['correlated subquery', 'per-row comparison with a group value'], the: ['subquery', 'correlated', 'fuhcompany'],
      moTa: {
        en: '<p>Find employees who earn <b>more than the average salary of their own department</b>.</p>',
        vi: '<p>Tìm nhân viên có lương <b>cao hơn lương trung bình của chính phòng mình</b>.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>depNum</code>, <code>empSalary</code>.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>depNum</code>, <code>empSalary</code>.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT e.empSSN, e.empName, e.depNum, e.empSalary
FROM tblEmployee e
WHERE e.empSalary > (SELECT AVG(x.empSalary)
                     FROM tblEmployee x
                     WHERE x.depNum = e.depNum);   -- re-evaluated for each outer row`,
      kiem: [kq('Above own-department average'), kqAn('After hiring', THEM), ma('Correlated subquery', '\\(\\s*SELECT\\b')],
      saiMau: ['SELECT e.empSSN, e.empName, e.depNum, e.empSalary FROM tblEmployee e WHERE e.empSalary > (SELECT AVG(empSalary) FROM tblEmployee)'],
      goiY: ['Give the outer table an alias (e) and the inner one another (x).', 'Inside the subquery: WHERE x.depNum = e.depNum — "the department of the current outer row".'],
      loiHayGap: [
        { en: 'Comparing with the company-wide average — that is the previous exercise, not "their own department".', vi: 'So với trung bình cả công ty — đó là bài trước, không phải "phòng của mình".' },
        { en: 'Same alias inside and outside (tblEmployee without aliases) — the inner depNum refers to the inner table, so the correlation silently disappears.', vi: 'Không đặt bí danh — depNum bên trong trỏ về bảng bên trong nên mất tương quan mà không báo lỗi.' },
      ],
      giaiThich: { en: '<p>A correlated subquery references a column of the outer query, so conceptually it runs once per outer row. Department 1 average 86,250 ⇒ 001 and 002 qualify, and so on.</p>', vi: '<p>Truy vấn con tương quan tham chiếu cột của câu ngoài nên về khái niệm chạy lại cho từng dòng ngoài. Trung bình phòng 1 là 86.250 ⇒ 001 và 002 thoả, tương tự các phòng khác.</p>' },
      thuatNgu: [TN.correlated],
    }),
    sql({
      tieuDe: 'Who supervises nobody? — the NOT IN + NULL trap',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['NOT IN with NULL', 'three-valued logic', 'NOT EXISTS'], the: ['subquery', 'null', 'not-in', 'fuhcompany'],
      moTa: {
        en: '<p>List the employees who are <b>nobody\'s supervisor</b>. Careful: the column supervisorSSN contains a NULL (the director has no supervisor).</p>',
        vi: '<p>Liệt kê nhân viên <b>không giám sát ai</b>. Cẩn thận: cột supervisorSSN có NULL (giám đốc không có người giám sát).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (SELECT 1
                  FROM tblEmployee s
                  WHERE s.supervisorSSN = e.empSSN);
-- "WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee)" returns NO rows:
-- x NOT IN (a, b, NULL) = (x <> a) AND (x <> b) AND (x <> NULL) ⇒ … AND UNKNOWN ⇒ never TRUE.`,
      kiem: [kq('Employees who supervise nobody'), kqAn('Two new supervisors appear', THEM), ma('Does not rely on a bare NOT IN', '\\bNOT\\s+IN\\s*\\(\\s*SELECT\\s+supervisorSSN\\s+FROM\\s+tblEmployee\\s*\\)', true)],
      saiMau: ['SELECT e.empSSN, e.empName FROM tblEmployee e WHERE e.empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee)'],
      goiY: ['Try NOT IN first and look at the result: 0 rows. Why? One value in the list is NULL.', 'Use NOT EXISTS, or add WHERE supervisorSSN IS NOT NULL inside the subquery.'],
      loiHayGap: [
        { en: 'NOT IN (SELECT supervisorSSN …) — returns 0 rows because the list contains NULL. Same on SQL Server (ANSI_NULLS ON) and PostgreSQL.', vi: 'NOT IN (SELECT supervisorSSN …) — ra 0 dòng vì danh sách có NULL. SQL Server (ANSI_NULLS ON) và PostgreSQL như nhau.' },
        { en: 'Using LEFT JOIN on the wrong side (e.supervisorSSN) — that finds employees without a supervisor, i.e. the director.', vi: 'LEFT JOIN nhầm phía (e.supervisorSSN) — ra người không có cấp trên, tức giám đốc.' },
      ],
      giaiThich: { en: '<p><code>x NOT IN (list)</code> means x &lt;&gt; every element. If one element is NULL, that comparison is UNKNOWN and the whole AND can never be TRUE. NOT EXISTS has no such problem. Expected: the 9 employees who are not a supervisor.</p>', vi: '<p><code>x NOT IN (danh sách)</code> nghĩa là x &lt;&gt; mọi phần tử. Một phần tử là NULL thì phép so đó UNKNOWN và cả biểu thức AND không bao giờ TRUE. NOT EXISTS không mắc lỗi này. Kết quả: 9 nhân viên không giám sát ai.</p>' },
      thuatNgu: [TN.null, TN.exists, { en: 'NOT IN', vi: 'không thuộc danh sách' }],
    }),
    sql({
      tieuDe: 'Top earner(s) of each department with >= ALL',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['>= ALL', 'correlated subquery', 'maximum per group with ties'], the: ['subquery', 'all', 'fuhcompany'],
      moTa: {
        en: '<p>For each department, show the employee(s) with the <b>highest salary in that department</b> (all of them if several tie).</p>',
        vi: '<p>Với mỗi phòng, hiện (các) nhân viên có <b>lương cao nhất phòng đó</b> (nhiều người bằng nhau thì hiện hết).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>depNum</code>, <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Sorted by depNum, then empSSN — order is checked.'],
        vi: ['Cột: <code>depNum</code>, <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Sắp theo depNum rồi empSSN — máy chấm kiểm thứ tự.'],
      },
      giai: `SELECT e.depNum, e.empSSN, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary >= ALL (SELECT x.empSalary
                          FROM tblEmployee x
                          WHERE x.depNum = e.depNum
                            AND x.empSalary IS NOT NULL)   -- a NULL would make ">= ALL" UNKNOWN
ORDER BY e.depNum, e.empSSN;`,
      kiem: [kq('Top earners per department', { thuTu: true }), kqAn('A tie for the top of department 2', THEM + `;
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (30121050099, N'Cù Văn Tú', 105000, 'M', 2)`, { thuTu: true }), ma('Uses ALL or MAX', '\\bALL\\s*\\(|\\bMAX\\s*\\(')],
      saiMau: ['SELECT e.depNum, e.empSSN, e.empName, e.empSalary FROM tblEmployee e WHERE e.empSalary >= ALL (SELECT x.empSalary FROM tblEmployee x) ORDER BY e.depNum, e.empSSN', 'SELECT e.depNum, e.empSSN, e.empName, e.empSalary FROM tblEmployee e WHERE e.empSalary > ALL (SELECT x.empSalary FROM tblEmployee x WHERE x.depNum = e.depNum AND x.empSSN <> e.empSSN) ORDER BY e.depNum, e.empSSN'],
      goiY: ['"Highest in its department" = greater than or equal to ALL salaries of the same department.', 'Correlate with x.depNum = e.depNum; an equivalent form is e.empSalary = (SELECT MAX(x.empSalary) … WHERE x.depNum = e.depNum).'],
      loiHayGap: [
        { en: 'Forgetting the correlation — only the company\'s top earner remains.', vi: 'Quên tương quan — chỉ còn người lương cao nhất công ty.' },
        { en: '> ALL excluding yourself — drops both people when two share the top salary (the hidden check has a tie).', vi: '> ALL trừ chính mình — mất cả hai người khi hai người cùng lương cao nhất (kiểm ẩn có hoà).' },
      ],
      giaiThich: { en: '<p><code>&gt;= ALL (subquery)</code> is TRUE when the value is at least every value returned; with ties, every tied employee passes. Exclude NULL salaries inside, or ">= ALL" becomes UNKNOWN.</p>', vi: '<p><code>&gt;= ALL (truy vấn con)</code> đúng khi giá trị không nhỏ hơn mọi giá trị trả về; có hoà thì mọi người hoà đều qua. Loại lương NULL bên trong, kẻo ">= ALL" thành UNKNOWN.</p>' },
      thuatNgu: [{ en: 'ALL / ANY', vi: 'so với mọi / một giá trị bất kỳ của truy vấn con' }, TN.correlated],
    }),
  ],
});
