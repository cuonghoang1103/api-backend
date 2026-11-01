/**
 * DBI202 · ⭐ CS.5 phần 1 — hàm cửa sổ (OVER, ROW_NUMBER/RANK/DENSE_RANK, LAG/LEAD, cộng dồn, khung ROWS/RANGE), CTE và CTE đệ quy
 * (slide 1–12). Hàm cửa sổ chấm ở chế độ SQL Server (chuẩn chung); CTE đệ quy chấm trên PostgreSQL thật (WITH RECURSIVE).
 */
import { mod, de, dePg, cs, q, kq, kqAn, ma, tn } from './_chung.mjs';
import { FUH_PG, LUOC_DO_FUH } from './_fuh.mjs';

const HAI_NV = "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test Bang Luong', NULL, 72000, 'M', NULL, 2, 30121050010), (30121050091, N'Test Bang Luong 2', NULL, 95000, 'F', NULL, 2, 30121050010)";
const BAN = `CREATE TABLE Sale (
  id   INT           NOT NULL PRIMARY KEY,
  ngay DATE          NOT NULL,
  tien DECIMAL(12,0) NOT NULL
);
INSERT INTO Sale (id, ngay, tien) VALUES
  (1, '2025-03-01', 100), (2, '2025-03-01', 50), (3, '2025-03-02', 70),
  (4, '2025-03-04', 30), (5, '2025-03-04', 20), (6, '2025-03-04', 10), (7, '2025-03-05', 90);`;

export default mod('dbi202-slide-cs5-1', '⭐ CS.5 Advanced SQL (1): window functions and CTEs', [
  de({
    t: 'ROW_NUMBER, RANK, DENSE_RANK side by side', k: 'MEDIUM', p: 10,
    kn: ['window function', 'PARTITION BY', 'ROW_NUMBER', 'RANK', 'DENSE_RANK'], tag: ['advanced', 'window'],
    en: '<p>Slides 5–6. For every employee show <code>depNum, empName, empSalary</code> and three numbers inside their department, highest salary first: <code>rn</code> = ROW_NUMBER (ties broken by <code>empSSN</code>), <code>rk</code> = RANK, <code>drk</code> = DENSE_RANK. Sort by depNum, then rn.</p>',
    vi: '<p>Slide 5–6. Với mỗi nhân viên hiện <code>depNum, empName, empSalary</code> và ba con số trong phòng của họ, lương cao trước: <code>rn</code> = ROW_NUMBER (hoà thì theo <code>empSSN</code>), <code>rk</code> = RANK, <code>drk</code> = DENSE_RANK. Sắp theo depNum rồi rn.</p>',
    yc: [['One SELECT with three window functions over PARTITION BY depNum.', 'Một SELECT với ba hàm cửa sổ trên PARTITION BY depNum.'], ['ORDER BY depNum, rn at the end.', 'ORDER BY depNum, rn ở cuối.']],
    giai: `SELECT depNum, empName, empSalary,
       ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC, empSSN) AS rn,   -- always 1, 2, 3, …
       RANK()       OVER (PARTITION BY depNum ORDER BY empSalary DESC)         AS rk,   -- ties share, then a gap
       DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC)         AS drk   -- ties share, no gap
FROM tblEmployee
ORDER BY depNum, rn;`,
    kiem: [
      kq(['Every employee with the three numbers', 'Mọi nhân viên với ba con số'], { thuTu: true }),
      kqAn(['Hidden: two new employees tie at 95,000 and 72,000 in department 2', 'Ẩn: hai nhân viên mới hoà ở 95.000 và 72.000 trong phòng 2'], HAI_NV, { thuTu: true }),
      ma(['Uses PARTITION BY', 'Dùng PARTITION BY'], '\\bPARTITION\\s+BY\\b'),
    ],
    sai: [
      'SELECT depNum, empName, empSalary, ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC, empSSN) AS rn, ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC, empSSN) AS rk, DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS drk FROM tblEmployee ORDER BY depNum, rn;',
      'SELECT depNum, empName, empSalary, ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC, empSSN) AS rn, RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS rk, RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS drk FROM tblEmployee ORDER BY depNum, rn;',
      'SELECT depNum, empName, empSalary, ROW_NUMBER() OVER (ORDER BY empSalary DESC, empSSN) AS rn, RANK() OVER (ORDER BY empSalary DESC) AS rk, DENSE_RANK() OVER (ORDER BY empSalary DESC) AS drk FROM tblEmployee ORDER BY depNum, rn;',
    ],
    gy: [['PARTITION BY restarts the numbering per department; ORDER BY inside OVER decides who is first.', 'PARTITION BY đánh số lại theo từng phòng; ORDER BY trong OVER quyết định ai đứng đầu.'], ['With 95, 95, 72: ROW_NUMBER 1 2 3 · RANK 1 1 3 · DENSE_RANK 1 1 2.', 'Với 95, 95, 72: ROW_NUMBER 1 2 3 · RANK 1 1 3 · DENSE_RANK 1 1 2.']],
    lhg: [['Using ROW_NUMBER for a "rank" — tied salaries get different numbers.', 'Dùng ROW_NUMBER làm "hạng" — lương bằng nhau ra số khác nhau.'], ['Forgetting PARTITION BY — the numbers run over the whole company.', 'Quên PARTITION BY — số chạy trên cả công ty.']],
    gt: ['<p>A window function keeps every row (unlike GROUP BY) and adds a value computed over a "window" of related rows. The base data has no ties, so the three columns look identical — only the hidden data with ties shows the difference, exactly the trap of an interview question.</p>', '<p>Hàm cửa sổ giữ mọi dòng (khác GROUP BY) và thêm một giá trị tính trên "cửa sổ" các dòng liên quan. Dữ liệu gốc không có hoà nên ba cột trông giống hệt — chỉ dữ liệu ẩn có hoà mới lộ khác biệt, đúng cái bẫy của câu phỏng vấn.</p>'],
    tn: [tn('window function', 'hàm cửa sổ'), tn('partition', 'phân vùng')],
  }),
  de({
    csdl: BAN, tenCsdl: 'Sale', ld: { en: '<p><code>Sale(id, ngay, tien)</code> — 7 sales, several on the same day.</p>', vi: '<p><code>Sale(id, ngay, tien)</code> — 7 lần bán, nhiều lần cùng ngày.</p>' },
    t: 'A running total that stays correct with duplicate dates', k: 'MEDIUM', p: 10,
    kn: ['running total', 'window frame', 'ROWS vs RANGE'], tag: ['advanced', 'window'],
    en: '<p>Slides 8–9. For every sale show <code>id, ngay, tien</code>, <code>tong_ngay</code> = total of that day, and <code>luy_ke</code> = running total that adds <b>one sale at a time</b> in the order (ngay, id). Sort by ngay, id.</p>',
    vi: '<p>Slide 8–9. Với mỗi lần bán hiện <code>id, ngay, tien</code>, <code>tong_ngay</code> = tổng của ngày đó, và <code>luy_ke</code> = tổng cộng dồn cộng <b>từng lần bán một</b> theo thứ tự (ngay, id). Sắp theo ngay, id.</p>',
    yc: [['tong_ngay: SUM … OVER (PARTITION BY ngay).', 'tong_ngay: SUM … OVER (PARTITION BY ngay).'], ['luy_ke: an explicit ROWS frame and a unique ORDER BY inside OVER.', 'luy_ke: khung ROWS tường minh và ORDER BY duy nhất trong OVER.']],
    giai: `SELECT id, ngay, tien,
       SUM(tien) OVER (PARTITION BY ngay) AS tong_ngay,
       SUM(tien) OVER (ORDER BY ngay, id
                       ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS luy_ke   -- one row at a time
FROM Sale
ORDER BY ngay, id;`,
    kiem: [
      kq(['Every sale with the day total and the running total', 'Mọi lần bán với tổng ngày và tổng cộng dồn'], { thuTu: true }),
      kqAn(['Hidden: a late-recorded sale on 2 March with a higher id', 'Ẩn: một lần bán ngày 2/3 ghi muộn với id lớn hơn'], "INSERT INTO Sale VALUES (8, '2025-03-02', 5)", { thuTu: true }),
      ma(['An explicit ROWS frame', 'Khung ROWS tường minh'], '\\bROWS\\s+BETWEEN\\b|\\bROWS\\s+UNBOUNDED\\b'),
    ],
    sai: [
      'SELECT id, ngay, tien, SUM(tien) OVER (PARTITION BY ngay) AS tong_ngay, SUM(tien) OVER (ORDER BY ngay) AS luy_ke FROM Sale ORDER BY ngay, id;',
      'SELECT id, ngay, tien, SUM(tien) OVER (PARTITION BY ngay) AS tong_ngay, SUM(tien) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS luy_ke FROM Sale ORDER BY ngay, id;',
      'SELECT id, ngay, tien, SUM(tien) OVER () AS tong_ngay, SUM(tien) OVER (ORDER BY ngay, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS luy_ke FROM Sale ORDER BY ngay, id;',
    ],
    gy: [['Without a frame, ORDER BY in OVER means RANGE … CURRENT ROW: every row of the same day gets the same total.', 'Không ghi khung, ORDER BY trong OVER nghĩa là RANGE … CURRENT ROW: mọi dòng cùng ngày nhận cùng tổng.'], ['Make the ORDER BY unique (ngay, id) so ROWS is deterministic.', 'Cho ORDER BY duy nhất (ngay, id) để ROWS xác định.']],
    lhg: [['SUM(tien) OVER (ORDER BY ngay): rows 1 and 2 both show 150.', 'SUM(tien) OVER (ORDER BY ngay): dòng 1 và 2 đều hiện 150.'], ['Ordering by id only — a late-recorded sale is added in the wrong place.', 'Chỉ sắp theo id — lần bán ghi muộn bị cộng sai chỗ.']],
    gt: ['<p>Default frames are the most common window bug in production reports. RANGE treats peers (equal ORDER BY values) as one block; ROWS walks physical rows. On SQL Server ROWS is also faster (it can use an in-memory spool).</p>', '<p>Khung mặc định là lỗi hàm cửa sổ hay gặp nhất trong báo cáo thật. RANGE coi các dòng ngang hàng (cùng giá trị ORDER BY) là một khối; ROWS đi theo từng dòng. Trên SQL Server ROWS còn nhanh hơn (dùng spool trong bộ nhớ).</p>'],
    tn: [tn('window frame', 'khung cửa sổ'), tn('running total', 'tổng cộng dồn')],
  }),
  dePg({
    csdl: FUH_PG, tenCsdl: 'FUHCompany', ld: LUOC_DO_FUH,
    t: 'A recursive CTE: the chain of bosses above one employee (PostgreSQL)', k: 'HARD', p: 12,
    kn: ['recursive CTE', 'anchor member', 'recursive member'], tag: ['advanced', 'cte', 'recursive'],
    en: '<p>Slides 11–12. Starting from employee <code>30121050038</code>, walk <code>supervisorSSN</code> upwards to the top. Return <code>cap</code> (0 for the employee, 1 for the boss, 2 for the boss\'s boss…), <code>empSSN</code>, <code>empName</code>, sorted by cap.</p><p>This one runs on <b>real PostgreSQL</b>, where a recursive CTE must say <code>WITH RECURSIVE</code>. On SQL Server you write the same query with plain <code>WITH</code>.</p>',
    vi: '<p>Slide 11–12. Bắt đầu từ nhân viên <code>30121050038</code>, đi ngược <code>supervisorSSN</code> lên tới đỉnh. Trả <code>cap</code> (0 cho chính nhân viên, 1 cho sếp, 2 cho sếp của sếp…), <code>empSSN</code>, <code>empName</code>, sắp theo cap.</p><p>Bài này chạy trên <b>PostgreSQL thật</b>, nơi CTE đệ quy phải ghi <code>WITH RECURSIVE</code>. Trên SQL Server viết cùng câu đó với <code>WITH</code> thường.</p>',
    yc: [['Anchor: the employee himself at cap 0. Recursive member: join tblEmployee to the CTE on e.empSSN = c.supervisorSSN.', 'Neo: chính nhân viên ở cap 0. Phần đệ quy: nối tblEmployee với CTE theo e.empSSN = c.supervisorSSN.'], ['The recursion stops by itself when supervisorSSN is NULL.', 'Đệ quy tự dừng khi supervisorSSN là NULL.']],
    giai: `WITH RECURSIVE chuoi AS (
    SELECT 0 AS cap, empSSN, empName, supervisorSSN          -- anchor: the employee
    FROM tblEmployee
    WHERE empSSN = 30121050038
  UNION ALL
    SELECT c.cap + 1, e.empSSN, e.empName, e.supervisorSSN   -- recursive: one level up
    FROM tblEmployee e
    JOIN chuoi c ON e.empSSN = c.supervisorSSN
)
SELECT cap, empSSN, empName
FROM chuoi
ORDER BY cap;`,
    kiem: [
      kq(['Nghĩa → Tâm → Quang', 'Nghĩa → Tâm → Quang'], { thuTu: true }),
      kqAn(['Hidden: Tâm now reports to Mai, so the chain is one level longer', 'Ẩn: Tâm giờ báo cáo cho Mai nên chuỗi dài thêm một cấp'], 'UPDATE tblEmployee SET supervisorSSN = 30121050020 WHERE empSSN = 30121050037', { thuTu: true }),
      ma(['A recursive CTE', 'CTE đệ quy'], '\\bWITH\\s+RECURSIVE\\b'),
    ],
    sai: [
      `WITH RECURSIVE chuoi AS (SELECT 0 AS cap, empSSN, empName, supervisorSSN FROM tblEmployee WHERE empSSN = 30121050038 UNION ALL SELECT c.cap + 1, e.empSSN, e.empName, e.supervisorSSN FROM tblEmployee e JOIN chuoi c ON e.supervisorSSN = c.empSSN) SELECT cap, empSSN, empName FROM chuoi ORDER BY cap;`,
      `WITH RECURSIVE chuoi AS (SELECT 1 AS cap, empSSN, empName, supervisorSSN FROM tblEmployee WHERE empSSN = 30121050038 UNION ALL SELECT c.cap + 1, e.empSSN, e.empName, e.supervisorSSN FROM tblEmployee e JOIN chuoi c ON e.empSSN = c.supervisorSSN) SELECT cap, empSSN, empName FROM chuoi ORDER BY cap;`,
      `SELECT 0 AS cap, e.empSSN, e.empName FROM tblEmployee e WHERE e.empSSN = 30121050038 UNION ALL SELECT 1, b.empSSN, b.empName FROM tblEmployee e JOIN tblEmployee b ON b.empSSN = e.supervisorSSN WHERE e.empSSN = 30121050038 UNION ALL SELECT 2, c.empSSN, c.empName FROM tblEmployee e JOIN tblEmployee b ON b.empSSN = e.supervisorSSN JOIN tblEmployee c ON c.empSSN = b.supervisorSSN WHERE e.empSSN = 30121050038 ORDER BY cap;`,
    ],
    gy: [['Anchor once, then "one more level" until no row is added.', 'Neo một lần, rồi "thêm một cấp" cho tới khi không còn dòng mới.'], ['Up the tree: e.empSSN = c.supervisorSSN. Down the tree: e.supervisorSSN = c.empSSN.', 'Lên cây: e.empSSN = c.supervisorSSN. Xuống cây: e.supervisorSSN = c.empSSN.']],
    lhg: [['Joining the wrong way round — that walks DOWN to the subordinates.', 'Nối ngược chiều — đó là đi XUỐNG cấp dưới.'], ['Hard-coding three self-joins: breaks as soon as the chain has another level.', 'Viết cứng ba phép tự nối: hỏng ngay khi chuỗi có thêm một cấp.']],
    gt: ['<p>On SQL Server: drop the word RECURSIVE; MAXRECURSION (default 100) stops runaway loops. On PostgreSQL a cycle in the data loops forever unless you track the path (or use the CYCLE clause of PostgreSQL 14+).</p>', '<p>Trên SQL Server: bỏ chữ RECURSIVE; MAXRECURSION (mặc định 100) chặn vòng chạy mãi. Trên PostgreSQL một chu trình trong dữ liệu sẽ lặp vô tận nếu không theo dõi đường đi (hoặc dùng mệnh đề CYCLE của PostgreSQL 14+).</p>'],
    tn: [tn('recursive CTE', 'CTE đệ quy'), tn('anchor member', 'phần neo')],
  }),
  cs({
    t: 'Where windows live: WHERE, frames, LAG and CTEs', k: 'MEDIUM', p: 7,
    kn: ['logical query order', 'window frame defaults', 'LAG/LEAD', 'CTE'], tag: ['advanced', 'window'],
    en: '<p>Five questions on slides 1–4, 7 and 10.</p>', vi: '<p>Năm câu về slide 1–4, 7 và 10.</p>',
    cau: [
      q('c1', ['Why does WHERE ROW_NUMBER() OVER (…) = 1 fail?', 'Vì sao WHERE ROW_NUMBER() OVER (…) = 1 bị lỗi?'], ['window functions are computed after WHERE, in the SELECT step', 'ROW_NUMBER needs a GROUP BY clause first', 'WHERE cannot compare numbers returned by functions', 'the window must be named with a WINDOW clause'], ['Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT (windows here) → ORDER BY. Wrap it in a CTE/subquery and filter outside.', 'Thứ tự logic: FROM → WHERE → GROUP BY → HAVING → SELECT (cửa sổ ở đây) → ORDER BY. Bọc vào CTE/truy vấn con rồi lọc ở ngoài.']),
      q('c2', ['LAG(tien) OVER (ORDER BY thang) on the first month returns…', 'LAG(tien) OVER (ORDER BY thang) ở tháng đầu tiên trả…'], ['NULL, unless a default is given as the third argument', '0, because there is no earlier month', 'the value of the same first month again', 'an error: there is no previous row'], ['LAG(x, 1, 0) supplies 0 instead of NULL.', 'LAG(x, 1, 0) cho 0 thay vì NULL.']),
      q('c3', ['SUM(x) OVER (PARTITION BY d) without ORDER BY gives…', 'SUM(x) OVER (PARTITION BY d) không có ORDER BY cho…'], ['the same partition total on every row of the partition', 'a running total inside each partition', 'one row per partition, like GROUP BY', 'an error: SUM needs an ORDER BY in OVER'], ['No ORDER BY ⇒ the frame is the whole partition.', 'Không ORDER BY ⇒ khung là cả phân vùng.']),
      q('c4', ['A (non-recursive) CTE is best described as…', 'CTE (không đệ quy) được mô tả đúng nhất là…'], ['a named subquery that exists only for one statement', 'a temporary table stored in tempdb', 'a view saved in the database catalog', 'a cursor that loops over its rows'], ['It improves readability; the optimizer usually inlines it like a subquery.', 'Nó làm câu lệnh dễ đọc; bộ tối ưu thường gộp nó như truy vấn con.']),
      q('c5', ['Which needs a window function rather than GROUP BY?', 'Việc nào cần hàm cửa sổ thay vì GROUP BY?'], ['each employee next to the average salary of their department', 'the number of employees per department', 'the departments whose total payroll exceeds 300,000', 'the highest salary in the whole company'], ['Keeping each row while adding a group value is exactly what OVER is for.', 'Giữ từng dòng mà vẫn thêm giá trị của nhóm chính là việc của OVER.']),
    ],
    gy: [['Windows are computed in the SELECT step.', 'Cửa sổ được tính ở bước SELECT.'], ['ORDER BY inside OVER changes the default frame.', 'ORDER BY trong OVER đổi khung mặc định.']],
    lhg: [['Filtering a window function in WHERE or HAVING.', 'Lọc hàm cửa sổ trong WHERE hoặc HAVING.'], ['Expecting LAG to return 0 on the first row.', 'Tưởng LAG trả 0 ở dòng đầu.']],
    tn: [tn('logical processing order', 'thứ tự xử lý logic'), tn('common table expression (CTE)', 'biểu thức bảng chung')],
  }),
]);
