/**
 * DBI202 · phép tập hợp (slide 6.B: self-join, set operators, subqueries) — UNION, INTERSECT, EXCEPT, UNION ALL.
 * Module gắn bài slide dbi202-slide-dbi7-4 (thẻ "Luyện tập" hiện dưới video slide 6.B). CSDL: FUHCompany.
 */
import { doiDau, KHOA, sql, kq, kqAn, ma, TN } from './_chung.mjs';

const THEM = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', NULL, 61000, 'M', '1994-02-02', 3, 30121050020),
 (30121050096, N'Đinh Thị Hoa', NULL, 47000, 'F', '1997-07-07', 1, 30121050003);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 1, 20.0), (30121050096, 2, 10.0), (30121050096, 3, 10.0), (30121050002, 3, 30.0)`;

export default doiDau({
  slug: 'dbi202-slide-dbi7-4',
  ten: '6.7 Set operations: UNION, INTERSECT, EXCEPT',
  khoa: KHOA,
  baiHoc: 'dbi202-slide-dbi7-4',
  de: [
    sql({
      tieuDe: 'UNION: on ProjectA or in department 3',
      doKho: 'EASY', phut: 7,
      khaiNiem: ['UNION', 'duplicate elimination'], the: ['set-operations', 'union', 'fuhcompany'],
      moTa: {
        en: '<p>Return the SSNs of employees who <b>work on ProjectA</b> <i>or</i> <b>belong to department 3</b> — each SSN once.</p>',
        vi: '<p>Trả SSN của nhân viên <b>làm ProjectA</b> <i>hoặc</i> <b>thuộc phòng 3</b> — mỗi SSN một lần.</p>',
      },
      yeuCau: {
        en: ['One column: <code>empSSN</code>.', 'Use UNION of two SELECTs.', 'Row order does not matter.'],
        vi: ['Một cột: <code>empSSN</code>.', 'Dùng UNION của hai câu SELECT.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT w.empSSN
FROM tblWorksOn w
JOIN tblProject p ON p.proNum = w.proNum
WHERE p.proName = N'ProjectA'
UNION                               -- set union: duplicates removed
SELECT empSSN
FROM tblEmployee
WHERE depNum = 3;`,
      kiem: [kq('SSNs on ProjectA or in department 3'), kqAn('Someone in department 3 joins ProjectA (no duplicate)', THEM), ma('Uses UNION', '\\bUNION\\b')],
      saiMau: ["SELECT w.empSSN FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum WHERE p.proName = N'ProjectA' UNION ALL SELECT empSSN FROM tblEmployee WHERE depNum = 3"],
      goiY: ['Both SELECTs must return the same number of columns with compatible types.', 'UNION removes duplicates; UNION ALL keeps them.'],
      loiHayGap: [
        { en: 'UNION ALL — an employee who is in both sets appears twice (hidden check).', vi: 'UNION ALL — người thuộc cả hai tập hiện hai lần (kiểm ẩn).' },
        { en: 'Different column counts in the two SELECTs — error on both engines.', vi: 'Hai câu SELECT khác số cột — lỗi trên cả hai hệ.' },
      ],
      giaiThich: { en: '<p>UNION is relational ∪ on sets. An ORDER BY, if needed, goes once at the very end and sorts the combined result.</p>', vi: '<p>UNION là phép ∪ trên tập. ORDER BY (nếu cần) đặt một lần ở cuối và sắp kết quả đã gộp.</p>' },
      thuatNgu: [TN.setOp],
    }),
    sql({
      tieuDe: 'INTERSECT: on both ProjectB and ProjectC',
      doKho: 'MEDIUM', phut: 7,
      khaiNiem: ['INTERSECT'], the: ['set-operations', 'intersect', 'fuhcompany'],
      moTa: {
        en: '<p>Which employees work on <b>both</b> ProjectB and ProjectC?</p>',
        vi: '<p>Nhân viên nào làm <b>cả</b> ProjectB lẫn ProjectC?</p>',
      },
      yeuCau: {
        en: ['One column: <code>empSSN</code>.', 'Use INTERSECT; filter by project names.', 'Row order does not matter.'],
        vi: ['Một cột: <code>empSSN</code>.', 'Dùng INTERSECT; lọc theo tên dự án.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT w.empSSN FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum WHERE p.proName = N'ProjectB'
INTERSECT
SELECT w.empSSN FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum WHERE p.proName = N'ProjectC';`,
      kiem: [kq('SSNs on ProjectB and ProjectC'), kqAn('One more person on both', THEM), ma('Uses INTERSECT', '\\bINTERSECT\\b')],
      saiMau: ["SELECT w.empSSN FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum WHERE p.proName = N'ProjectB' AND p.proName = N'ProjectC'", "SELECT w.empSSN FROM tblWorksOn w JOIN tblProject p ON p.proNum = w.proNum WHERE p.proName IN (N'ProjectB', N'ProjectC')"],
      goiY: ['A single row of tblWorksOn belongs to ONE project, so proName = \'B\' AND proName = \'C\' is never true.', 'Build the set for B, the set for C, then INTERSECT them.'],
      loiHayGap: [
        { en: 'WHERE proName = \'ProjectB\' AND proName = \'ProjectC\' — no single row satisfies both ⇒ 0 rows.', vi: 'WHERE proName = \'ProjectB\' AND proName = \'ProjectC\' — không dòng nào thoả cả hai ⇒ 0 dòng.' },
        { en: 'proName IN (B, C) — that is "B or C" (union), not "both".', vi: 'proName IN (B, C) — đó là "B hoặc C" (hợp), không phải "cả hai".' },
      ],
      giaiThich: { en: '<p>"Both" across rows = intersection of two sets. Alternatives: a self-join of tblWorksOn, or GROUP BY empSSN HAVING COUNT(DISTINCT proName) = 2 over the two projects. Expected: 003 and 005.</p>', vi: '<p>"Cả hai" trên nhiều dòng = giao của hai tập. Cách khác: tự nối tblWorksOn, hoặc GROUP BY empSSN HAVING COUNT(DISTINCT proName) = 2. Kết quả: 003 và 005.</p>' },
      thuatNgu: [TN.setOp],
    }),
    sql({
      tieuDe: 'EXCEPT: employees who are not supervisors',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['EXCEPT', 'set difference', 'NULL in set operations'], the: ['set-operations', 'except', 'fuhcompany'],
      moTa: {
        en: '<p>Using <b>EXCEPT</b>, return the SSNs of employees who are not anybody\'s supervisor. Compare with the NOT IN trap of the previous lesson: set operators treat NULLs as equal and do not break.</p>',
        vi: '<p>Dùng <b>EXCEPT</b>, trả SSN của nhân viên không giám sát ai. So với bẫy NOT IN ở bài trước: phép tập hợp coi các NULL bằng nhau nên không hỏng.</p>',
      },
      yeuCau: {
        en: ['One column: <code>empSSN</code>.', 'Use EXCEPT.', 'Row order does not matter.'],
        vi: ['Một cột: <code>empSSN</code>.', 'Dùng EXCEPT.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN FROM tblEmployee
EXCEPT
SELECT supervisorSSN FROM tblEmployee;   -- the NULL in this set removes nothing (no employee has SSN NULL)`,
      kiem: [kq('Non-supervisors via EXCEPT'), kqAn('New supervisors after hiring', THEM), ma('Uses EXCEPT', '\\bEXCEPT\\b')],
      saiMau: ['SELECT supervisorSSN AS empSSN FROM tblEmployee EXCEPT SELECT empSSN FROM tblEmployee'],
      goiY: ['A EXCEPT B = rows of A that are not in B.', 'A = all employee SSNs; B = all supervisorSSN values.'],
      loiHayGap: [
        { en: 'Swapping the operands — B EXCEPT A gives supervisors that are not employees (here: NULL).', vi: 'Đảo hai vế — B EXCEPT A cho cấp trên không phải nhân viên (ở đây: NULL).' },
        { en: 'Writing MINUS — that is Oracle; SQL Server and PostgreSQL use EXCEPT.', vi: 'Viết MINUS — đó là Oracle; SQL Server và PostgreSQL dùng EXCEPT.' },
      ],
      giaiThich: { en: '<p>EXCEPT is set difference (−). Unlike NOT IN, set operators compare rows with "is not distinct from" semantics, so a NULL in the right set does not poison the result.</p>', vi: '<p>EXCEPT là hiệu tập hợp (−). Khác NOT IN, phép tập hợp so dòng theo kiểu "không khác biệt" nên NULL ở vế phải không làm hỏng kết quả.</p>' },
      thuatNgu: [TN.setOp, TN.null],
    }),
    sql({
      tieuDe: 'UNION ALL: one list of hours from two projects',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['UNION ALL', 'bags vs sets'], the: ['set-operations', 'union-all', 'fuhcompany'],
      moTa: {
        en: '<p>The time-sheet clerk wants <b>one list of all workHours entries</b> of ProjectA (proNum 1) followed by those of ProjectC (proNum 3), <b>keeping duplicates</b> — every entry is a separate time sheet.</p>',
        vi: '<p>Nhân viên chấm công cần <b>một danh sách mọi dòng workHours</b> của ProjectA (proNum 1) và của ProjectC (proNum 3), <b>giữ cả giá trị trùng</b> — mỗi dòng là một phiếu chấm công riêng.</p>',
      },
      yeuCau: {
        en: ['One column: <code>Hours</code>.', 'Duplicates must be kept (10 and 30 appear twice).', 'Row order does not matter.'],
        vi: ['Một cột: <code>Hours</code>.', 'Phải giữ giá trị trùng (10 và 30 xuất hiện hai lần).', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT workHours AS Hours FROM tblWorksOn WHERE proNum = 1
UNION ALL                                    -- bag union: keeps duplicates (and is cheaper: no de-duplication)
SELECT workHours FROM tblWorksOn WHERE proNum = 3;`,
      kiem: [kq('Hours of projects 1 and 3, duplicates kept'), kqAn('More entries', THEM), ma('Uses UNION ALL', '\\bUNION\\s+ALL\\b')],
      saiMau: ['SELECT workHours AS Hours FROM tblWorksOn WHERE proNum = 1 UNION SELECT workHours FROM tblWorksOn WHERE proNum = 3'],
      goiY: ['UNION treats results as sets (no duplicates); UNION ALL as bags (multisets).', 'The column name of the result comes from the FIRST SELECT — put the alias there.'],
      loiHayGap: [
        { en: 'UNION — collapses the two 10s and the two 30s: 5 rows instead of 7.', vi: 'UNION — gộp hai số 10 và hai số 30: 5 dòng thay vì 7.' },
        { en: 'Putting the alias on the second SELECT — the result column keeps the first SELECT\'s name.', vi: 'Đặt bí danh ở câu SELECT thứ hai — tên cột kết quả lấy từ câu SELECT đầu.' },
      ],
      giaiThich: { en: '<p>SQL tables are bags (multisets). UNION ALL is the bag union; UNION = UNION ALL + DISTINCT. Chapter 5 of the slides (relations as bags) is exactly this.</p>', vi: '<p>Bảng SQL là túi (đa tập). UNION ALL là hợp túi; UNION = UNION ALL + DISTINCT. Chương 5 của slide (quan hệ là túi) chính là điều này.</p>' },
      thuatNgu: [TN.setOp, { en: 'bag (multiset)', vi: 'túi (đa tập — cho phép phần tử trùng)' }],
    }),
  ],
});
