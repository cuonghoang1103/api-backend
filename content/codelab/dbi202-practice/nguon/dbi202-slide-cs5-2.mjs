/**
 * DBI202 · ⭐ CS.5 phần 2 — top-N mỗi nhóm, khoảng trống & đảo, xoay bảng bằng CASE (PIVOT), MERGE/upsert, APPLY/LATERAL
 * (slide 13–24). Đề SQL chấm ở chế độ SQL Server (chỉ dùng phần chuẩn chung).
 */
import { mod, de, cs, q, kq, kqAn, ma, tn } from './_chung.mjs';

const HD = `CREATE TABLE HoaDon (
  so      INT           NOT NULL PRIMARY KEY,
  tongTien DECIMAL(12,0) NOT NULL
);
INSERT INTO HoaDon (so, tongTien) VALUES
  (1001, 500), (1002, 700), (1003, 120), (1006, 90), (1007, 300), (1008, 410), (1012, 75), (1013, 60), (1015, 980);`;

export default mod('dbi202-slide-cs5-2', '⭐ CS.5 Advanced SQL (2): top-N, gaps, pivot, upsert', [
  de({
    t: 'Top-N per group: the two highest salary levels of every department', k: 'MEDIUM', p: 10,
    kn: ['top-N per group', 'DENSE_RANK', 'ties'], tag: ['advanced', 'window', 'top-n'],
    en: '<p>Slides 13–14. For every department list the employees paid at one of the <b>two highest distinct salary levels</b> of that department (everyone tied at those levels must appear). Show <code>depNum, empName, empSalary</code>, sorted by depNum, salary (high first), then empSSN.</p>',
    vi: '<p>Slide 13–14. Với mỗi phòng liệt kê nhân viên có lương ở một trong <b>hai mức lương khác nhau cao nhất</b> của phòng (mọi người hoà ở các mức đó đều phải có). Hiện <code>depNum, empName, empSalary</code>, sắp theo depNum, lương (cao trước), rồi empSSN.</p>',
    yc: [['Rank inside a CTE or subquery, filter outside.', 'Xếp hạng trong CTE hoặc truy vấn con, lọc ở ngoài.'], ['"Distinct salary levels" ⇒ the ranking function that leaves no gaps.', '"Mức lương khác nhau" ⇒ hàm xếp hạng không chừa khoảng trống.']],
    giai: `WITH xh AS (
    SELECT depNum, empSSN, empName, empSalary,
           DENSE_RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS muc
    FROM tblEmployee
)
SELECT depNum, empName, empSalary
FROM xh
WHERE muc <= 2                      -- filter the window result outside
ORDER BY depNum, empSalary DESC, empSSN;`,
    kiem: [
      kq(['Two salary levels per department', 'Hai mức lương mỗi phòng'], { thuTu: true }),
      kqAn(['Hidden: a tie at the top of department 2 and at the second level of department 1', 'Ẩn: hoà ở đỉnh phòng 2 và ở mức hai phòng 1'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES (30121050090, N'Test Top', NULL, 105000, 'M', NULL, 2, 30121050010), (30121050091, N'Test Second', NULL, 90000, 'F', NULL, 1, 30121050001)", { thuTu: true }),
      ma(['Uses DENSE_RANK', 'Dùng DENSE_RANK'], '\\bDENSE_RANK\\s*\\('),
    ],
    sai: [
      'WITH xh AS (SELECT depNum, empSSN, empName, empSalary, ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS muc FROM tblEmployee) SELECT depNum, empName, empSalary FROM xh WHERE muc <= 2 ORDER BY depNum, empSalary DESC, empSSN;',
      'WITH xh AS (SELECT depNum, empSSN, empName, empSalary, RANK() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS muc FROM tblEmployee) SELECT depNum, empName, empSalary FROM xh WHERE muc <= 2 ORDER BY depNum, empSalary DESC, empSSN;',
      'WITH xh AS (SELECT depNum, empSSN, empName, empSalary, DENSE_RANK() OVER (ORDER BY empSalary DESC) AS muc FROM tblEmployee) SELECT depNum, empName, empSalary FROM xh WHERE muc <= 2 ORDER BY depNum, empSalary DESC, empSSN;',
    ],
    gy: [['ROW_NUMBER = exactly N rows; RANK = N positions with gaps; DENSE_RANK = N distinct values.', 'ROW_NUMBER = đúng N dòng; RANK = N vị trí có khoảng trống; DENSE_RANK = N giá trị khác nhau.'], ['TOP (n) WITH TIES only works for ONE group — a window is needed per group.', 'TOP (n) WITH TIES chỉ dùng được cho MỘT nhóm — mỗi nhóm cần một cửa sổ.']],
    lhg: [['ROW_NUMBER drops the second person at a tied level.', 'ROW_NUMBER bỏ người thứ hai ở mức hoà.'], ['RANK after a tie at the top skips level 2 entirely.', 'RANK sau một lần hoà ở đỉnh bỏ hẳn mức 2.']],
    gt: ['<p>Top-N per group is the most asked window question in interviews. Always ask "what about ties?" — the three ranking functions give three different, defensible answers.</p>', '<p>Top-N mỗi nhóm là câu hàm cửa sổ hay hỏi nhất khi phỏng vấn. Luôn hỏi "hoà thì sao?" — ba hàm xếp hạng cho ba đáp án khác nhau, đều có lý.</p>'],
    tn: [tn('top-N per group', 'N phần tử đầu mỗi nhóm')],
  }),
  de({
    csdl: HD, tenCsdl: 'HoaDon', ld: { en: '<p><code>HoaDon(so, tongTien)</code> — invoice numbers, some missing.</p>', vi: '<p><code>HoaDon(so, tongTien)</code> — số hoá đơn, có số bị thiếu.</p>' },
    t: 'Gaps: which invoice numbers are missing?', k: 'MEDIUM', p: 10,
    kn: ['gaps and islands', 'LEAD'], tag: ['advanced', 'window', 'gaps-islands'],
    en: '<p>Slides 15–16. Invoice numbers should be consecutive. Return every missing range as <code>tu</code> (first missing number) and <code>den</code> (last missing number), sorted by tu. With 1003 followed by 1006 the range is 1004–1005.</p>',
    vi: '<p>Slide 15–16. Số hoá đơn phải liên tiếp. Trả mọi khoảng bị thiếu dưới dạng <code>tu</code> (số thiếu đầu tiên) và <code>den</code> (số thiếu cuối cùng), sắp theo tu. 1003 rồi tới 1006 thì khoảng là 1004–1005.</p>',
    yc: [['LEAD(so) OVER (ORDER BY so) gives the next number that exists.', 'LEAD(so) OVER (ORDER BY so) cho số tiếp theo có thật.'], ['A gap exists where next − current > 1.', 'Có khoảng trống khi tiếp − hiện tại > 1.']],
    giai: `SELECT so + 1   AS tu,
       tiep - 1 AS den
FROM (
    SELECT so, LEAD(so) OVER (ORDER BY so) AS tiep
    FROM HoaDon
) t
WHERE tiep - so > 1
ORDER BY tu;`,
    kiem: [
      kq(['Three gaps', 'Ba khoảng trống'], { thuTu: true }),
      kqAn(['Hidden: a single missing number and invoices after a long gap', 'Ẩn: thiếu đúng một số và hoá đơn sau một khoảng dài'], 'INSERT INTO HoaDon VALUES (1017, 10), (1030, 20), (1031, 30)', { thuTu: true }),
      ma(['Uses LEAD or LAG', 'Dùng LEAD hoặc LAG'], '\\b(LEAD|LAG)\\s*\\('),
    ],
    sai: [
      'SELECT so AS tu, tiep AS den FROM (SELECT so, LEAD(so) OVER (ORDER BY so) AS tiep FROM HoaDon) t WHERE tiep - so > 1 ORDER BY tu;',
      'SELECT so + 1 AS tu, tiep - 1 AS den FROM (SELECT so, LEAD(so) OVER (ORDER BY so) AS tiep FROM HoaDon) t WHERE tiep - so > 2 ORDER BY tu;',
      'SELECT so + 1 AS tu, tiep - 1 AS den FROM (SELECT so, LEAD(so) OVER (ORDER BY tongTien) AS tiep FROM HoaDon) t WHERE tiep - so > 1 ORDER BY tu;',
    ],
    gy: [['Compare each row with the next one: that is LEAD.', 'So mỗi dòng với dòng kế tiếp: đó là LEAD.'], ['The last row has no next number: tiep is NULL and the WHERE drops it.', 'Dòng cuối không có số kế: tiep là NULL và WHERE loại nó.']],
    lhg: [['Returning the existing numbers around the gap instead of the missing ones.', 'Trả các số có thật quanh khoảng trống thay vì các số bị thiếu.'], ['Testing > 2 — a single missing number is then lost.', 'Kiểm > 2 — thiếu đúng một số thì bị bỏ sót.']],
    gt: ['<p>Gaps = compare neighbours (LEAD/LAG). Islands (runs of consecutive values) = value − ROW_NUMBER() is constant inside a run; GROUP BY that difference. Both are standard SQL and run on both engines.</p>', '<p>Khoảng trống = so láng giềng (LEAD/LAG). Đảo (dãy giá trị liên tiếp) = giá trị − ROW_NUMBER() không đổi trong một dãy; GROUP BY hiệu đó. Cả hai là SQL chuẩn, chạy cả hai hệ.</p>'],
    tn: [tn('gaps and islands', 'khoảng trống và đảo')],
  }),
  de({
    t: 'Pivot with CASE: hours of each employee on projects 1–3', k: 'MEDIUM', p: 10,
    kn: ['pivot', 'conditional aggregation', 'CASE'], tag: ['advanced', 'pivot'],
    en: '<p>Slides 17–18. One row per employee who appears in tblWorksOn: <code>empSSN</code>, <code>p1</code>, <code>p2</code>, <code>p3</code> = hours on projects 1, 2, 3 (0 when none), and <code>tong</code> = hours on all projects. Sort by empSSN. Write it with CASE so it runs on both engines (T-SQL\'s PIVOT does not).</p>',
    vi: '<p>Slide 17–18. Mỗi nhân viên có trong tblWorksOn một dòng: <code>empSSN</code>, <code>p1</code>, <code>p2</code>, <code>p3</code> = số giờ ở dự án 1, 2, 3 (0 nếu không), và <code>tong</code> = số giờ ở mọi dự án. Sắp theo empSSN. Viết bằng CASE để chạy cả hai hệ (PIVOT của T-SQL thì không).</p>',
    yc: [['SUM(CASE WHEN proNum = 1 THEN workHours ELSE 0 END) AS p1, … GROUP BY empSSN.', 'SUM(CASE WHEN proNum = 1 THEN workHours ELSE 0 END) AS p1, … GROUP BY empSSN.'], ['tong counts every project, not only 1–3.', 'tong tính mọi dự án, không chỉ 1–3.']],
    giai: `SELECT empSSN,
       SUM(CASE WHEN proNum = 1 THEN workHours ELSE 0 END) AS p1,
       SUM(CASE WHEN proNum = 2 THEN workHours ELSE 0 END) AS p2,
       SUM(CASE WHEN proNum = 3 THEN workHours ELSE 0 END) AS p3,
       SUM(workHours)                                      AS tong
FROM tblWorksOn
GROUP BY empSSN
ORDER BY empSSN;`,
    kiem: [
      kq(['One row per employee', 'Mỗi nhân viên một dòng'], { thuTu: true }),
      kqAn(['Hidden: Quang also works on projects 2 and 6', 'Ẩn: Quang làm thêm dự án 2 và 6'], 'INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050001, 2, 5.0), (30121050001, 6, 7.5)', { thuTu: true }),
      ma(['Conditional aggregation with CASE', 'Tổng có điều kiện bằng CASE'], '\\bSUM\\s*\\(\\s*CASE\\b'),
    ],
    sai: [
      'SELECT empSSN, SUM(CASE WHEN proNum = 1 THEN workHours ELSE 0 END) AS p1, SUM(CASE WHEN proNum = 2 THEN workHours ELSE 0 END) AS p2, SUM(CASE WHEN proNum = 3 THEN workHours ELSE 0 END) AS p3, SUM(CASE WHEN proNum IN (1, 2, 3) THEN workHours ELSE 0 END) AS tong FROM tblWorksOn GROUP BY empSSN ORDER BY empSSN;',
      'SELECT empSSN, SUM(CASE WHEN proNum = 1 THEN workHours END) AS p1, SUM(CASE WHEN proNum = 2 THEN workHours END) AS p2, SUM(CASE WHEN proNum = 3 THEN workHours END) AS p3, SUM(workHours) AS tong FROM tblWorksOn GROUP BY empSSN ORDER BY empSSN;',
      'SELECT empSSN, MAX(CASE WHEN proNum = 1 THEN workHours ELSE 0 END) AS p1, MAX(CASE WHEN proNum = 2 THEN workHours ELSE 0 END) AS p2, MAX(CASE WHEN proNum = 3 THEN workHours ELSE 0 END) AS p3, SUM(workHours) AS tong FROM tblWorksOn WHERE proNum <= 3 GROUP BY empSSN ORDER BY empSSN;',
    ],
    gy: [['One SUM(CASE …) per output column.', 'Mỗi cột kết quả một SUM(CASE …).'], ['ELSE 0 turns "no hours" into 0 instead of NULL.', 'ELSE 0 biến "không có giờ" thành 0 thay vì NULL.']],
    lhg: [['Leaving out ELSE 0 — the cell shows NULL.', 'Bỏ ELSE 0 — ô hiện NULL.'], ['Filtering WHERE proNum <= 3 — tong loses the other projects and some employees disappear.', 'Lọc WHERE proNum <= 3 — tong mất các dự án khác và vài nhân viên biến mất.']],
    gt: ['<p>T-SQL: <code>SELECT … FROM (…) s PIVOT (SUM(workHours) FOR proNum IN ([1], [2], [3])) p</code>. PostgreSQL: <code>SUM(workHours) FILTER (WHERE proNum = 1)</code> or crosstab(). CASE works everywhere and is what most reports use.</p>', '<p>T-SQL: <code>SELECT … FROM (…) s PIVOT (SUM(workHours) FOR proNum IN ([1], [2], [3])) p</code>. PostgreSQL: <code>SUM(workHours) FILTER (WHERE proNum = 1)</code> hoặc crosstab(). CASE chạy mọi nơi và là cách đa số báo cáo dùng.</p>'],
    tn: [tn('pivot', 'xoay bảng'), tn('conditional aggregation', 'tổng hợp có điều kiện')],
  }),
  cs({
    t: 'MERGE, upsert, APPLY / LATERAL: what really happens', k: 'HARD', p: 8,
    kn: ['MERGE', 'upsert', 'ON CONFLICT', 'APPLY', 'LATERAL'], tag: ['advanced', 'merge'],
    en: '<p>Five questions on slides 19–24.</p>', vi: '<p>Năm câu về slide 19–24.</p>',
    cau: [
      q('c1', ['Two sessions run the same MERGE for a key that does not exist yet (SQL Server, default isolation). Risk?', 'Hai phiên cùng chạy MERGE cho một khoá chưa tồn tại (SQL Server, mức mặc định). Rủi ro?'], ['both see "not matched", both insert: a duplicate-key error', 'nothing: MERGE is always atomic and safe', 'the second MERGE silently updates the first row', 'both block forever waiting for each other'], ['Add WITH (HOLDLOCK) on the target (serializable range lock) so the check and the insert are one unit.', 'Thêm WITH (HOLDLOCK) trên bảng đích (khoá dải tuần tự) để phép kiểm và lệnh chèn là một khối.']),
      q('c2', ['PostgreSQL\'s INSERT … ON CONFLICT (id) DO UPDATE requires…', 'INSERT … ON CONFLICT (id) DO UPDATE của PostgreSQL cần…'], ['a unique index or constraint on id', 'SERIALIZABLE isolation', 'a trigger on the target table', 'that the row already exists'], ['The conflict target must match a unique index; then the upsert is race-free.', 'Đích xung đột phải khớp một chỉ mục duy nhất; khi đó upsert không bị đua.']),
      q('c3', ['In a MERGE, WHEN NOT MATCHED BY SOURCE THEN DELETE removes…', 'Trong MERGE, WHEN NOT MATCHED BY SOURCE THEN DELETE xoá…'], ['target rows that the source does not mention', 'source rows that are missing in the target', 'rows whose values did not change', 'every row of the target, then re-inserts them'], ['Dangerous for a partial source: "the supplier did not mention it" would delete it.', 'Nguy hiểm với nguồn không đầy đủ: "nhà cung cấp không nhắc tới" sẽ bị xoá.']),
      q('c4', ['CROSS APPLY (SQL Server) / JOIN LATERAL (PostgreSQL) lets a subquery…', 'CROSS APPLY (SQL Server) / JOIN LATERAL (PostgreSQL) cho phép truy vấn con…'], ['refer to columns of the row on its left, once per row', 'run in parallel on several CPU cores', 'skip rows that other sessions locked', 'be cached and reused across queries'], ['Typical use: "the top 3 orders of each customer" with ORDER BY … FETCH inside.', 'Dùng điển hình: "3 đơn lớn nhất của mỗi khách" với ORDER BY … FETCH bên trong.']),
      q('c5', ['An upsert should only touch prices that really changed. The best condition is…', 'Upsert chỉ nên đụng giá thật sự thay đổi. Điều kiện tốt nhất là…'], ['WHEN MATCHED AND t.gia <> s.gia THEN UPDATE …', 'WHEN MATCHED THEN UPDATE … for every row', 'DELETE everything, then INSERT the new list', 'WHEN NOT MATCHED BY TARGET THEN UPDATE …'], ['Skipping identical rows avoids useless writes, log records and trigger fires.', 'Bỏ qua dòng giống hệt tránh ghi thừa, bản ghi nhật ký và trigger chạy vô ích.']),
    ],
    gy: [['MERGE is not race-free by itself on SQL Server.', 'MERGE tự nó không chống đua trên SQL Server.'], ['APPLY / LATERAL = a correlated subquery that may return many rows.', 'APPLY / LATERAL = truy vấn con tương quan có thể trả nhiều dòng.']],
    lhg: [['Adding NOT MATCHED BY SOURCE … DELETE to a partial feed.', 'Thêm NOT MATCHED BY SOURCE … DELETE cho nguồn không đầy đủ.'], ['Believing ON CONFLICT works without a unique index.', 'Tưởng ON CONFLICT chạy được khi không có chỉ mục duy nhất.']],
    tn: [tn('upsert', 'chèn-hoặc-cập-nhật'), tn('lateral join', 'phép nối bên')],
  }),
]);
