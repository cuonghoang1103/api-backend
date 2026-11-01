/**
 * DBI202 · 5.A Slide trường Chương 6 (1–14) — ràng buộc toàn vẹn, so sánh chuỗi, LIKE (% _ ESCAPE), ngày tháng, NULL ba trị.
 * CSDL FUHCompany + bảng ghi chú nhỏ của slide 10.
 */
import { mod, de, cs, q, kq, kqAn, ma, FUH, LUOC_DO_FUH, TN, tn } from './_chung.mjs';

const NOTE = String.raw`
CREATE TABLE tblNote (id INT NOT NULL PRIMARY KEY, s NVARCHAR(50) NOT NULL);
INSERT INTO tblNote (id, s) VALUES (1, N'Giảm 20% hôm nay'), (2, N'Mua 200 tặng 1'), (3, N'20%'), (4, N'%VIP%'), (5, N'%lỗi'), (6, N'Lãi 5%');
`;
const THEM_E = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050090, N'Đỗ Thị Hằng', NULL, 47000, 'F', '1999-12-31', 3, 30121050020),
 (30121050091, N'Lê Văn Thịnh', NULL, 52000, 'M', '1990-01-01', 1, 30121050002),
 (30121050092, N'Vũ Minh', NULL, 41000, 'M', NULL, 2, 30121050010)`;

export default mod('dbi202-slide-dbi7-1', '5.A Integrity constraints, strings, LIKE, dates & NULL (slides 1–14)', [
  de({
    t: 'LIKE with %: everybody whose name contains "Thị"', k: 'EASY', p: 6,
    kn: ['LIKE', 'wildcard %', "N'' literal"], tag: ['like', 'fuhcompany', 'slide'],
    en: '<p>List the SSN and name of every employee whose name contains the word <b>Thị</b> (a common middle name for women).</p>',
    vi: '<p>Liệt kê SSN và tên mọi nhân viên có chữ <b>Thị</b> trong tên (tên đệm phổ biến của nữ).</p>',
    yc: [['Columns: <code>empSSN, empName</code>.', 'Cột: <code>empSSN, empName</code>.'], ["Use LIKE with N'…' (Unicode pattern). Row order does not matter.", "Dùng LIKE với N'…' (mẫu Unicode). Thứ tự dòng không quan trọng."]],
    giai: `SELECT empSSN, empName
FROM tblEmployee
WHERE empName LIKE N'% Thị %';     -- surrounded by spaces: the WORD Thị, not "Thịnh"`,
    kiem: [kq(['Names with the word Thị', 'Tên có chữ Thị']), kqAn(['Hidden: Thịnh must not match', 'Ẩn: Thịnh không được khớp'], THEM_E), ma(['Uses LIKE', 'Dùng LIKE'], '\\bLIKE\\b')],
    sai: [`SELECT empSSN, empName FROM tblEmployee WHERE empName LIKE N'%Thị%'`, `SELECT empSSN, empName FROM tblEmployee WHERE empName = N'Thị'`],
    gy: [["% matches any sequence of characters (also none); _ matches exactly one.", "% khớp chuỗi ký tự bất kỳ (kể cả rỗng); _ khớp đúng một ký tự."], ["Put spaces around the word: N'% Thị %'.", "Đặt khoảng trắng hai bên chữ: N'% Thị %'."]],
    lhg: [["N'%Thị%' — also matches Thịnh (hidden check).", "N'%Thị%' — khớp cả Thịnh (kiểm ẩn)."], ["= N'Thị' — equality compares the whole name.", "= N'Thị' — phép bằng so cả tên."]],
    gt: ["<p>LIKE without wildcards is just equality. On SQL Server the default collation is case-insensitive, so N'% thị %' would match too (the grader behaves the same).</p>", "<p>LIKE không có ký tự đại diện chỉ là phép bằng. Collation mặc định của SQL Server không phân biệt hoa thường nên N'% thị %' cũng khớp (máy chấm cũng vậy).</p>"],
    tn: [tn('LIKE', 'so khớp mẫu'), tn('wildcard', 'ký tự đại diện')],
  }),
  de({
    csdl: NOTE, tenCsdl: 'Notes', ld: { en: '<p><b>Table</b> (slide 10, tab <code>Notes.sql</code>): <code>tblNote(id, s)</code> — six short texts, some containing the character <code>%</code>.</p>', vi: '<p><b>Bảng</b> (slide 10, tab <code>Notes.sql</code>): <code>tblNote(id, s)</code> — sáu chuỗi ngắn, vài chuỗi chứa ký tự <code>%</code>.</p>' },
    t: 'LIKE … ESCAPE: texts that contain "20%" literally', k: 'MEDIUM', p: 8,
    kn: ['ESCAPE', 'literal wildcard'], tag: ['like', 'escape', 'slide'],
    en: '<p>Return the notes that contain the characters <code>20%</code> — the percent sign taken literally, not as a wildcard.</p>',
    vi: '<p>Trả các ghi chú có chứa ký tự <code>20%</code> — dấu phần trăm hiểu theo nghĩa đen, không phải ký tự đại diện.</p>',
    yc: [['Columns: <code>id, s</code>.', 'Cột: <code>id, s</code>.'], ["Use LIKE … ESCAPE (portable). Do not use [%] — that is T-SQL only.", "Dùng LIKE … ESCAPE (chạy mọi hệ). Không dùng [%] — đó là riêng T-SQL."]],
    giai: `SELECT id, s
FROM tblNote
WHERE s LIKE '%20!%%' ESCAPE '!';     -- !% = a real percent sign`,
    kiem: [kq(['Notes containing 20%', 'Ghi chú chứa 20%']), kqAn(['More notes', 'Thêm ghi chú'], `INSERT INTO tblNote VALUES (7, N'Tăng 120% doanh số'), (8, N'Phòng 201')`), ma(['Uses ESCAPE', 'Dùng ESCAPE'], '\\bESCAPE\\b')],
    sai: [`SELECT id, s FROM tblNote WHERE s LIKE '%20%'`, `SELECT id, s FROM tblNote WHERE s LIKE '20!%' ESCAPE '!'`],
    gy: [['Without ESCAPE, % in the pattern means "anything" — "Mua 200 tặng 1" would match.', 'Không có ESCAPE thì % trong mẫu nghĩa là "bất kỳ" — "Mua 200 tặng 1" cũng khớp.'], ["Pick an escape character (here !): '%20!%%' = anything, 20, a real %, anything.", "Chọn một ký tự thoát (ở đây !): '%20!%%' = bất kỳ, 20, một dấu % thật, bất kỳ."]],
    lhg: [["'%20%' — 200 also matches.", "'%20%' — 200 cũng khớp."], ["'20!%' without the outer % — only the text that is exactly 20%.", "'20!%' thiếu % bên ngoài — chỉ chuỗi đúng bằng 20%."]],
    gt: ['<p>Expected: 1 (Giảm 20% hôm nay), 3 (20%). "Tăng 120%" also contains 20% and is correctly included in the hidden check.</p>', '<p>Kết quả: 1 (Giảm 20% hôm nay), 3 (20%). "Tăng 120%" cũng chứa 20% và được tính trong kiểm ẩn.</p>'],
    tn: [tn('ESCAPE', 'ký tự thoát')],
  }),
  de({
    t: 'Dates: employees born in the 1990s', k: 'EASY', p: 7,
    kn: ['date literal', 'date range', 'BETWEEN'], tag: ['date', 'fuhcompany', 'slide'],
    en: "<p>Employees born from 1 January 1990 to 31 December 1999 inclusive. Compare dates with ISO literals like '1990-01-01' — do not use YEAR() (SQL Server only, and it prevents using an index).</p>",
    vi: "<p>Nhân viên sinh từ 01/01/1990 tới 31/12/1999. So sánh ngày bằng hằng ISO như '1990-01-01' — không dùng YEAR() (riêng SQL Server, và làm mất khả năng dùng chỉ mục).</p>",
    yc: [['Columns: <code>empName, empBirthdate</code>.', 'Cột: <code>empName, empBirthdate</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT empName, empBirthdate
FROM tblEmployee
WHERE empBirthdate >= '1990-01-01'
  AND empBirthdate <  '2000-01-01';     -- half-open range: safe even for DATETIME columns`,
    kiem: [kq(['Born in the 1990s', 'Sinh thập niên 1990']), kqAn(['Boundary days 1990-01-01 and 1999-12-31', 'Ngày biên 1990-01-01 và 1999-12-31'], THEM_E), ma(['No YEAR()', 'Không dùng YEAR()'], '\\bYEAR\\s*\\(', true)],
    sai: [`SELECT empName, empBirthdate FROM tblEmployee WHERE empBirthdate > '1990-01-01' AND empBirthdate < '1999-12-31'`],
    gy: [["Write dates as 'YYYY-MM-DD' — unambiguous on every server.", "Viết ngày dạng 'YYYY-MM-DD' — không mơ hồ trên mọi máy chủ."], ["d >= '1990-01-01' AND d < '2000-01-01'", "d >= '1990-01-01' AND d < '2000-01-01'"]],
    lhg: [["> and < on the boundary days — 1990-01-01 and 1999-12-31 are lost (hidden check).", "> và < ở ngày biên — mất 1990-01-01 và 1999-12-31 (kiểm ẩn)."], ["'01/02/1995' — day/month order depends on the server language.", "'01/02/1995' — thứ tự ngày/tháng phụ thuộc ngôn ngữ máy chủ."]],
    gt: ["<p>A half-open range [start, next start) is the professional habit: it is correct for DATE and DATETIME alike and keeps the column searchable by an index (Chapter 8).</p>", "<p>Khoảng nửa mở [đầu, đầu kỳ sau) là thói quen nghề nghiệp: đúng cho cả DATE lẫn DATETIME và giữ cột tìm được bằng chỉ mục (Chương 8).</p>"],
    tn: [tn('date literal', 'hằng ngày tháng')],
  }),
  de({
    t: 'Three-valued logic: not known to be born before 1990', k: 'MEDIUM', p: 8,
    kn: ['NULL', 'UNKNOWN', 'IS NULL'], tag: ['null', 'fuhcompany', 'slide'],
    en: '<p>HR wants everybody who is <b>not known</b> to be born before 1990 — that includes people whose birth date is unknown (NULL). Write the query.</p>',
    vi: '<p>Phòng nhân sự muốn mọi người <b>không được biết là</b> sinh trước 1990 — kể cả người chưa biết ngày sinh (NULL). Viết truy vấn.</p>',
    yc: [['Columns: <code>empName, empBirthdate</code>.', 'Cột: <code>empName, empBirthdate</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT empName, empBirthdate
FROM tblEmployee
WHERE empBirthdate >= '1990-01-01'
   OR empBirthdate IS NULL;       -- NOT (d < '1990-01-01') is UNKNOWN for NULL and would drop him`,
    kiem: [kq(['Born 1990 or later, or unknown', 'Sinh từ 1990, hoặc chưa biết']), kqAn(['Another unknown birth date', 'Thêm một ngày sinh chưa biết'], THEM_E), ma(['Tests IS NULL', 'Có IS NULL'], '\\bIS\\s+NULL\\b')],
    sai: [`SELECT empName, empBirthdate FROM tblEmployee WHERE NOT (empBirthdate < '1990-01-01')`, `SELECT empName, empBirthdate FROM tblEmployee WHERE empBirthdate >= '1990-01-01'`],
    gy: [['Any comparison with NULL is UNKNOWN; NOT UNKNOWN is still UNKNOWN; WHERE keeps only TRUE.', 'Mọi so sánh với NULL là UNKNOWN; NOT UNKNOWN vẫn là UNKNOWN; WHERE chỉ giữ TRUE.'], ['Add the NULL case explicitly with OR … IS NULL.', 'Thêm trường hợp NULL tường minh bằng OR … IS NULL.']],
    lhg: [["NOT (d < '1990-01-01') — Phan Hữu Nghĩa (NULL) disappears.", "NOT (d < '1990-01-01') — Phan Hữu Nghĩa (NULL) biến mất."], ['Forgetting that the complement of a condition is not "everything else" when NULLs exist.', 'Quên rằng phủ định một điều kiện không phải là "mọi thứ còn lại" khi có NULL.']],
    gt: ['<p>Slide 13\'s truth table: TRUE AND UNKNOWN = UNKNOWN, FALSE OR UNKNOWN = UNKNOWN, NOT UNKNOWN = UNKNOWN. That is why "p" and "NOT p" together can miss rows.</p>', '<p>Bảng chân trị slide 13: TRUE AND UNKNOWN = UNKNOWN, FALSE OR UNKNOWN = UNKNOWN, NOT UNKNOWN = UNKNOWN. Vì vậy "p" và "NOT p" cộng lại vẫn có thể sót dòng.</p>'],
    tn: [TN.null],
  }),
  cs({
    t: 'Strings, NULL and the truth table', k: 'MEDIUM', p: 7,
    kn: ['string comparison', 'collation', 'three-valued logic'], tag: ['null', 'strings', 'slide'],
    en: '<p>Slides 6–14 on SQL Server (default collation …_CI_AS).</p>', vi: '<p>Slide 6–14 trên SQL Server (collation mặc định …_CI_AS).</p>',
    cau: [
      q('c1', ["Is 'fodder' < 'foo' true?", "'fodder' < 'foo' có đúng?"], ["Yes — strings compare character by character: d < o", "No — the shorter string is always smaller", "No — strings cannot be compared with <", "Only on PostgreSQL"], ["Lexicographic order: f = f, o = o, then d < o.", "Thứ tự từ điển: f = f, o = o, rồi d < o."]),
      q('c2', ["On SQL Server with the default collation, is 'abc' = 'ABC'?", "Trên SQL Server với collation mặc định, 'abc' = 'ABC'?"], ["TRUE — CI means case-insensitive", "FALSE — SQL always compares bytes", "an error", "UNKNOWN"], ["…_CI_AS = Case-Insensitive, Accent-Sensitive.", "…_CI_AS = không phân biệt hoa thường, phân biệt dấu."]),
      q('c3', ["TRUE AND UNKNOWN is…", "TRUE AND UNKNOWN là…"], ["UNKNOWN", "TRUE", "FALSE", "an error"], ["AND takes the minimum: FALSE < UNKNOWN < TRUE.", "AND lấy giá trị nhỏ nhất: FALSE < UNKNOWN < TRUE."]),
      q('c4', ["FALSE OR UNKNOWN is…", "FALSE OR UNKNOWN là…"], ["UNKNOWN", "FALSE", "TRUE", "NULL is converted to 0"], ["OR takes the maximum.", "OR lấy giá trị lớn nhất."]),
      q('c5', ["Which literal stores Vietnamese text correctly in an NVARCHAR column?", "Hằng nào lưu đúng chữ Việt vào cột NVARCHAR?"], ["N'Đức'", "'Đức'", "\"Đức\"", "U'Đức'"], ["N'' is a Unicode (NVARCHAR) literal; without N the text passes through the server code page first.", "N'' là hằng Unicode (NVARCHAR); thiếu N thì chữ đi qua bảng mã của máy chủ trước."]),
    ],
    gy: [['AND = minimum, OR = maximum, NOT swaps TRUE/FALSE and keeps UNKNOWN.', 'AND = nhỏ nhất, OR = lớn nhất, NOT đổi TRUE/FALSE và giữ UNKNOWN.'], ['String comparison depends on the collation.', 'So chuỗi phụ thuộc collation.']],
    lhg: [["Writing \"Đức\" — double quotes are identifiers (names), not strings.", "Viết \"Đức\" — nháy kép là định danh (tên), không phải chuỗi."], ['Thinking NULL = NULL is TRUE.', 'Tưởng NULL = NULL là TRUE.']],
    tn: [tn('collation', 'quy tắc so sánh chuỗi'), tn('three-valued logic', 'logic ba trị')],
  }),
]);
