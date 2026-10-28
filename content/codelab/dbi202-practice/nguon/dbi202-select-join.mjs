/**
 * DBI202 · 6.1 — SELECT cơ bản: chọn cột, lọc (WHERE, LIKE, BETWEEN, IN, IS NULL), sắp xếp, cột tính + CASE.
 * CSDL: FUHCompany (slide dbi7). Bài giảng: dbi202-select-join.
 */
import { doiDau, KHOA, sql, kq, kqAn, ma, TN } from './_chung.mjs';

const THEM_NV = `INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050090, N'Đỗ Minh Anh', N'1 Trần Phú, TP Đà Nẵng', 80000, 'F', '1991-04-04', 3, 30121050020),
 (30121050091, N'Vũ Hoàng Long', NULL, 80001, 'M', '1989-12-31', 4, 30121050030),
 (30121050092, N'Kim Văn ANH', N'9 Phố Huế, TP Hà Nội', 60000, 'M', '1990-01-01', 1, 30121050002)`;

export default doiDau({
  slug: 'dbi202-select-join',
  ten: '6.1 SELECT basics: columns, filters, sorting',
  khoa: KHOA,
  baiHoc: 'dbi202-select-join',
  de: [
    sql({
      tieuDe: 'Project list: pick the right columns',
      saiMau: ['SELECT * FROM tblProject', 'SELECT proName, proNum, locNum FROM tblProject'],
      doKho: 'EASY', phut: 5,
      khaiNiem: ['SELECT list', 'projection'], the: ['select', 'fuhcompany'],
      moTa: {
        en: '<p>The PMO wants a simple list of every project of FUHCompany. Show the project number, project name and the location number of each project.</p>',
        vi: '<p>Phòng quản lý dự án cần danh sách mọi dự án của FUHCompany. Hiện số dự án, tên dự án và số địa điểm của từng dự án.</p>',
      },
      yeuCau: {
        en: ['Columns, in this order: <code>proNum</code>, <code>proName</code>, <code>locNum</code>.', 'One row per project; row order does not matter.', 'Do not use <code>SELECT *</code> — name the columns.'],
        vi: ['Các cột, đúng thứ tự: <code>proNum</code>, <code>proName</code>, <code>locNum</code>.', 'Mỗi dự án một dòng; thứ tự dòng không quan trọng.', 'Không dùng <code>SELECT *</code> — ghi rõ tên cột.'],
      },
      giai: `-- Projection: list exactly the columns the report needs, in the requested order.
SELECT proNum, proName, locNum
FROM tblProject;`,
      kiem: [
        kq('Every project with proNum, proName, locNum'),
        kqAn('A newly added project also appears', "INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 3, 5)"),
        ma('No SELECT * (name the columns)', '\\bSELECT\\s+\\*', true),
      ],
      goiY: ['SELECT &lt;columns separated by commas&gt; FROM &lt;table&gt;.', 'The table is tblProject; the three columns are proNum, proName, locNum.'],
      loiHayGap: [
        { en: 'Using SELECT * — it returns all 4 columns (depNum too) and breaks when the table changes.', vi: 'Dùng SELECT * — trả cả 4 cột (thừa depNum) và hỏng khi bảng đổi cấu trúc.' },
        { en: 'Columns in a different order than requested — graders (and the PE) compare column positions.', vi: 'Cột sai thứ tự đề yêu cầu — máy chấm (và PE) so theo vị trí cột.' },
      ],
      giaiThich: { en: '<p>The SELECT list is the relational-algebra <b>projection</b> π<sub>proNum, proName, locNum</sub>(tblProject). Listing columns explicitly makes the result stable and documents intent.</p>', vi: '<p>Danh sách SELECT chính là phép <b>chiếu</b> π<sub>proNum, proName, locNum</sub>(tblProject) của đại số quan hệ. Ghi rõ cột giúp kết quả ổn định và nói rõ ý định.</p>' },
      thuatNgu: [TN.select, { en: 'projection', vi: 'phép chiếu', giaiThich: 'Chọn một số cột của quan hệ.' }],
    }),
    sql({
      tieuDe: 'High earners: salary above 80,000',
      saiMau: ['SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary >= 80000'],
      doKho: 'EASY', phut: 6,
      khaiNiem: ['WHERE', 'comparison operators'], the: ['where', 'fuhcompany'],
      moTa: {
        en: '<p>HR reviews everybody whose salary is <b>strictly greater than 80,000</b>. Show their SSN, name and salary.</p>',
        vi: '<p>Phòng nhân sự rà soát mọi người có lương <b>lớn hơn hẳn 80.000</b>. Hiện SSN, tên và lương của họ.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Exactly 80,000 is <b>not</b> included.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>.', 'Đúng 80.000 thì <b>không</b> tính.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary > 80000;   -- strictly greater: 80000 itself is excluded`,
      kiem: [
        kq('Employees earning more than 80,000'),
        kqAn('Boundary: 80,000 excluded, 80,001 included', THEM_NV),
        ma('Filters with WHERE', '\\bWHERE\\b'),
      ],
      goiY: ['Filter rows with WHERE &lt;condition&gt;.', '"More than" is &gt;, not &gt;=.'],
      loiHayGap: [
        { en: 'Writing >= 80000 — includes an employee paid exactly 80,000 (hidden check).', vi: 'Viết >= 80000 — lấy cả người lương đúng 80.000 (kiểm ẩn bắt).' },
        { en: 'Putting the number in quotes (\'80000\') — works by implicit conversion but compares as text in some engines; keep numbers unquoted.', vi: 'Để số trong nháy (\'80000\') — chạy được nhờ ép kiểu ngầm nhưng dễ thành so chuỗi; số thì không để nháy.' },
      ],
      giaiThich: { en: '<p>WHERE is the selection σ<sub>empSalary &gt; 80000</sub>. A boundary value (exactly 80,000) is the classic place where &gt; and &gt;= differ — always read "more than" / "at least" carefully.</p>', vi: '<p>WHERE là phép chọn σ<sub>empSalary &gt; 80000</sub>. Giá trị biên (đúng 80.000) là chỗ &gt; và &gt;= khác nhau — đọc kỹ "lớn hơn" hay "ít nhất".</p>' },
      thuatNgu: [TN.where, { en: 'boundary value', vi: 'giá trị biên' }],
    }),
    sql({
      tieuDe: 'Sort by department, then salary high to low',
      saiMau: ['SELECT empSSN, depNum, empSalary FROM tblEmployee ORDER BY depNum, empSalary DESC', 'SELECT empSSN, depNum, empSalary FROM tblEmployee ORDER BY depNum DESC, empSalary DESC, empSSN'],
      doKho: 'EASY', phut: 7,
      khaiNiem: ['ORDER BY', 'multiple sort keys', 'ASC/DESC'], the: ['order-by', 'fuhcompany'],
      moTa: {
        en: '<p>Print the payroll sheet: every employee\'s SSN, department number and salary, sorted by <b>department number ascending</b>, then by <b>salary descending</b>; if two people in the same department earn the same, the smaller SSN comes first.</p>',
        vi: '<p>In bảng lương: SSN, số phòng và lương của mọi nhân viên, sắp theo <b>số phòng tăng dần</b>, rồi <b>lương giảm dần</b>; hai người cùng phòng cùng lương thì SSN nhỏ đứng trước.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>depNum</code>, <code>empSalary</code>.', 'Order: depNum ASC, empSalary DESC, empSSN ASC — the row order IS checked.'],
        vi: ['Cột: <code>empSSN</code>, <code>depNum</code>, <code>empSalary</code>.', 'Thứ tự: depNum tăng, empSalary giảm, empSSN tăng — máy chấm KIỂM thứ tự dòng.'],
      },
      giai: `SELECT empSSN, depNum, empSalary
FROM tblEmployee
ORDER BY depNum ASC, empSalary DESC, empSSN ASC;   -- each key only breaks ties of the previous one`,
      kiem: [
        kq('Payroll sorted by department, salary DESC, SSN', { thuTu: true }),
        kqAn('Tie on salary inside a department ⇒ smaller SSN first', THEM_NV, { thuTu: true }),
        ma('Uses ORDER BY', '\\bORDER\\s+BY\\b'),
      ],
      goiY: ['ORDER BY accepts several keys separated by commas.', 'Each key has its own direction: ORDER BY a ASC, b DESC, c ASC.'],
      loiHayGap: [
        { en: 'Writing ORDER BY depNum, empSalary DESC and forgetting the tie-breaker — rows with equal salary come out in any order.', vi: 'Viết ORDER BY depNum, empSalary DESC mà quên khoá phụ — hai người cùng lương ra thứ tự bất kỳ.' },
        { en: 'Thinking DESC applies to every key — it only applies to the key right before it.', vi: 'Nghĩ DESC áp cho mọi khoá — nó chỉ áp cho khoá ngay trước nó.' },
      ],
      giaiThich: { en: '<p>Without ORDER BY the order of rows is <b>undefined</b> (SQL Server often follows the clustered index, but nothing guarantees it). Each extra sort key only decides between rows that tie on the previous keys.</p>', vi: '<p>Không có ORDER BY thì thứ tự dòng là <b>không xác định</b> (SQL Server hay theo chỉ mục cụm, nhưng không gì bảo đảm). Mỗi khoá phụ chỉ phân xử các dòng hoà nhau ở khoá trước.</p>' },
      thuatNgu: [TN.orderBy, { en: 'tie-breaker', vi: 'khoá phụ phân xử hoà' }],
    }),
    sql({
      tieuDe: 'Names that end with "Anh"',
      saiMau: ["SELECT empSSN, empName FROM tblEmployee WHERE empName LIKE N'%Anh%'", "SELECT empSSN, empName FROM tblEmployee WHERE empName = N'%Anh'"],
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['LIKE', 'wildcards %', 'case-insensitive comparison', 'N\'…\' Unicode literal'], the: ['like', 'fuhcompany'],
      moTa: {
        en: '<p>Find every employee whose full name <b>ends with "Anh"</b> (not merely contains it). Comparison is case-insensitive, as with SQL Server\'s default collation.</p>',
        vi: '<p>Tìm mọi nhân viên có họ tên <b>kết thúc bằng "Anh"</b> (không phải chỉ chứa). So sánh không phân biệt hoa thường, như collation mặc định của SQL Server.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>.', 'Use LIKE with the % wildcard; write the literal as <code>N\'…\'</code> (Unicode — required on SQL Server for Vietnamese text).', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>.', 'Dùng LIKE với ký tự đại diện %; viết hằng chuỗi dạng <code>N\'…\'</code> (Unicode — SQL Server cần cho chữ Việt).', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName
FROM tblEmployee
WHERE empName LIKE N'%Anh';   -- % = any string; nothing after "Anh" ⇒ ends with it`,
      kiem: [
        kq('Names ending with "Anh"'),
        kqAn('Upper-case "ANH" also matches (case-insensitive)', THEM_NV),
        ma('Uses LIKE', '\\bLIKE\\b'),
      ],
      goiY: ['% matches any sequence of characters, _ matches exactly one.', '"Ends with X" is LIKE \'%X\'; "contains X" is LIKE \'%X%\'.'],
      loiHayGap: [
        { en: 'LIKE \'%Anh%\' — also returns names where "Anh" is in the middle (e.g. "Đỗ Minh Anh Thư").', vi: 'LIKE \'%Anh%\' — lấy cả tên có "Anh" ở giữa.' },
        { en: 'Using = \'%Anh\' — = does not understand wildcards.', vi: 'Dùng = \'%Anh\' — dấu = không hiểu ký tự đại diện.' },
        { en: 'Forgetting N\'…\' on SQL Server: \'Anh\' works here, but Vietnamese literals like \'Hà\' turn into \'H?\' without N.', vi: 'Quên N\'…\' trên SQL Server: \'Anh\' thì không sao, nhưng chữ có dấu như \'Hà\' thành \'H?\' nếu thiếu N.' },
      ],
      giaiThich: { en: '<p>LIKE matches a pattern: <code>%</code> any string, <code>_</code> one character. On SQL Server the default collation is case-insensitive, so <code>LIKE N\'%Anh\'</code> also matches "ANH"; this grader reproduces that behaviour.</p>', vi: '<p>LIKE khớp theo mẫu: <code>%</code> chuỗi bất kỳ, <code>_</code> một ký tự. Collation mặc định của SQL Server không phân biệt hoa thường nên <code>LIKE N\'%Anh\'</code> khớp cả "ANH"; máy chấm này giả lập đúng hành vi đó.</p>' },
      thuatNgu: [{ en: 'LIKE pattern', vi: 'so khớp mẫu' }, { en: 'wildcard', vi: 'ký tự đại diện (% và _)' }, { en: 'collation', vi: 'quy tắc so sánh/sắp xếp chữ', giaiThich: 'CI = không phân biệt hoa thường (case-insensitive).' }],
    }),
    sql({
      tieuDe: 'Combine conditions: women born before 1990 or men under 50,000',
      saiMau: ["SELECT empSSN, empName, empSex, empBirthdate, empSalary FROM tblEmployee WHERE empSex = 'F' AND empBirthdate < '1990-01-01' OR empSalary < 50000"],
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['AND / OR precedence', 'parentheses', 'date comparison', 'NULL in conditions'], the: ['where', 'dates', 'fuhcompany'],
      moTa: {
        en: '<p>List employees who are either <b>female and born before 1 January 1990</b>, or <b>male with a salary below 50,000</b>.</p>',
        vi: '<p>Liệt kê nhân viên <b>nữ sinh trước 01/01/1990</b>, hoặc <b>nam có lương dưới 50.000</b>.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>empSex</code>, <code>empBirthdate</code>, <code>empSalary</code>.', 'Compare dates with a literal in the form \'YYYY-MM-DD\' (portable). Do not use YEAR().', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>empSex</code>, <code>empBirthdate</code>, <code>empSalary</code>.', 'So ngày với hằng dạng \'YYYY-MM-DD\' (chạy mọi hệ). Không dùng YEAR().', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName, empSex, empBirthdate, empSalary
FROM tblEmployee
WHERE (empSex = 'F' AND empBirthdate < '1990-01-01')
   OR (empSex = 'M' AND empSalary < 50000);   -- parentheses make the intent explicit (AND binds tighter than OR)`,
      kiem: [
        kq('Women born before 1990, or men earning < 50,000'),
        kqAn('Boundary dates and salaries', THEM_NV),
        ma('Does not use YEAR()', '\\bYEAR\\s*\\(', true),
      ],
      goiY: ['AND binds tighter than OR — but write the parentheses anyway, it documents your intent.', 'A date literal \'1990-01-01\' compares correctly with a DATE column.'],
      loiHayGap: [
        { en: 'empSex = \'F\' AND empBirthdate < \'1990-01-01\' OR empSex = \'M\' AND … without thinking about precedence — correct here by luck, wrong as soon as you mix differently.', vi: 'Viết lẫn AND/OR không ngoặc — lần này đúng nhờ thứ tự ưu tiên, đổi điều kiện là sai.' },
        { en: 'YEAR(empBirthdate) < 1990 — SQL Server only and it prevents index use; compare with a date range instead.', vi: 'YEAR(empBirthdate) < 1990 — chỉ SQL Server có và làm mất khả năng dùng chỉ mục; so khoảng ngày.' },
        { en: 'Expecting the employee with an unknown birthdate (NULL) — any comparison with NULL is UNKNOWN, so the row is filtered out.', vi: 'Tưởng người chưa có ngày sinh (NULL) sẽ hiện — so sánh với NULL cho UNKNOWN nên dòng bị loại.' },
      ],
      giaiThich: { en: '<p>SQL uses three-valued logic: a condition can be TRUE, FALSE or UNKNOWN (when NULL is involved). WHERE keeps only TRUE rows, which is why the employee with a NULL birthdate never appears in the "born before" branch.</p>', vi: '<p>SQL dùng logic ba trị: TRUE, FALSE hoặc UNKNOWN (khi dính NULL). WHERE chỉ giữ dòng TRUE — vì vậy người có ngày sinh NULL không bao giờ lọt vào nhánh "sinh trước".</p>' },
      thuatNgu: [{ en: 'operator precedence', vi: 'thứ tự ưu tiên toán tử' }, { en: 'three-valued logic', vi: 'logic ba trị (TRUE/FALSE/UNKNOWN)' }, TN.null],
    }),
    sql({
      tieuDe: 'Who has no address on file?',
      saiMau: ['SELECT empSSN, empName FROM tblEmployee WHERE empAddress = NULL', "SELECT empSSN, empName FROM tblEmployee WHERE empAddress = ''"],
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['IS NULL', 'NULL is not a value'], the: ['null', 'fuhcompany'],
      moTa: {
        en: '<p>The post office returned some payslips. Find the employees whose <b>address is missing</b> (NULL).</p>',
        vi: '<p>Bưu điện trả lại vài phiếu lương. Tìm nhân viên <b>chưa có địa chỉ</b> (NULL).</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>.', 'Row order does not matter.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>.', 'Thứ tự dòng không quan trọng.'],
      },
      giai: `SELECT empSSN, empName
FROM tblEmployee
WHERE empAddress IS NULL;   -- "= NULL" is never TRUE`,
      kiem: [
        kq('Employees with a NULL address'),
        kqAn('Another employee without address appears', THEM_NV),
        ma('Uses IS NULL (not = NULL)', '\\bIS\\s+NULL\\b'),
      ],
      goiY: ['NULL means "unknown"; nothing is equal to unknown, not even NULL.', 'Use the predicate IS NULL.'],
      loiHayGap: [
        { en: 'WHERE empAddress = NULL — the comparison is UNKNOWN, so 0 rows come back.', vi: 'WHERE empAddress = NULL — phép so là UNKNOWN nên ra 0 dòng.' },
        { en: 'WHERE empAddress = \'\' — an empty string is a value, not NULL.', vi: 'WHERE empAddress = \'\' — chuỗi rỗng là một giá trị, không phải NULL.' },
      ],
      giaiThich: { en: '<p><code>IS NULL</code> / <code>IS NOT NULL</code> are the only predicates that test for missing values. With <code>= NULL</code> SQL Server (ANSI_NULLS ON, the default) and PostgreSQL both return no rows.</p>', vi: '<p><code>IS NULL</code> / <code>IS NOT NULL</code> là cách duy nhất kiểm giá trị thiếu. Với <code>= NULL</code> cả SQL Server (ANSI_NULLS ON, mặc định) lẫn PostgreSQL đều trả 0 dòng.</p>' },
      thuatNgu: [TN.null],
    }),
    sql({
      tieuDe: 'Salary bands with CASE and computed columns',
      saiMau: ["SELECT empSSN, empName, empSalary, empSalary * 12 AS AnnualSalary, CASE WHEN empSalary >= 60000 THEN 'Medium' WHEN empSalary >= 90000 THEN 'High' ELSE 'Low' END AS SalaryBand FROM tblEmployee ORDER BY empSalary DESC, empSSN"],
      doKho: 'HARD', phut: 14,
      khaiNiem: ['computed column', 'CASE WHEN', 'column alias', 'ORDER BY expression'], the: ['case', 'alias', 'order-by', 'fuhcompany'],
      moTa: {
        en: '<p>Build the compensation overview: for every employee show SSN, name, monthly salary, the <b>annual salary</b> (12 × monthly) and a <b>salary band</b>: <code>High</code> from 90,000, <code>Medium</code> from 60,000 up to (not including) 90,000, otherwise <code>Low</code>. Highest salary first; equal salaries by SSN.</p>',
        vi: '<p>Lập bảng tổng quan thu nhập: mỗi nhân viên hiện SSN, tên, lương tháng, <b>lương năm</b> (12 × lương tháng) và <b>bậc lương</b>: <code>High</code> từ 90.000, <code>Medium</code> từ 60.000 tới dưới 90.000, còn lại <code>Low</code>. Lương cao trước; bằng lương thì theo SSN.</p>',
      },
      yeuCau: {
        en: ['Columns: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>, <code>AnnualSalary</code>, <code>SalaryBand</code> (aliases exactly).', 'Order: empSalary DESC, empSSN ASC — order is checked.'],
        vi: ['Cột: <code>empSSN</code>, <code>empName</code>, <code>empSalary</code>, <code>AnnualSalary</code>, <code>SalaryBand</code> (đúng bí danh).', 'Thứ tự: empSalary giảm, empSSN tăng — máy chấm kiểm thứ tự.'],
      },
      giai: `SELECT empSSN,
       empName,
       empSalary,
       empSalary * 12 AS AnnualSalary,
       CASE
         WHEN empSalary >= 90000 THEN 'High'     -- the first matching WHEN wins,
         WHEN empSalary >= 60000 THEN 'Medium'   -- so this branch already means 60000..89999
         ELSE 'Low'
       END AS SalaryBand
FROM tblEmployee
ORDER BY empSalary DESC, empSSN;`,
      kiem: [
        kq('Overview with AnnualSalary and SalaryBand', { thuTu: true }),
        kqAn('Band boundaries 60,000 / 90,000 with extra staff', THEM_NV + `;
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (30121050093, N'Tạ Thu Uyên', 90000, 'F', 2), (30121050094, N'Lò Văn Sơn', 59999, 'M', 4)`, { thuTu: true }),
        ma('Uses CASE', '\\bCASE\\b'),
      ],
      goiY: ['A computed column is an expression in the SELECT list; name it with AS.', 'CASE WHEN … THEN … WHEN … THEN … ELSE … END checks branches top to bottom and stops at the first TRUE one.'],
      loiHayGap: [
        { en: 'Writing the bands bottom-up (WHEN >= 60000 first) — 95,000 then lands in Medium because the first TRUE branch wins.', vi: 'Viết bậc từ thấp lên (WHEN >= 60000 trước) — 95.000 rơi vào Medium vì nhánh TRUE đầu tiên thắng.' },
        { en: 'Aliases in single quotes (AS \'AnnualSalary\') — SQL Server accepts it, PostgreSQL does not; plain AS AnnualSalary works everywhere.', vi: 'Bí danh trong nháy đơn (AS \'AnnualSalary\') — SQL Server nhận, PostgreSQL không; AS AnnualSalary chạy mọi nơi.' },
        { en: 'Using the alias in WHERE (WHERE SalaryBand = \'High\') — WHERE runs before SELECT, so the alias does not exist yet.', vi: 'Dùng bí danh trong WHERE — WHERE chạy trước SELECT nên bí danh chưa tồn tại.' },
      ],
      giaiThich: { en: '<p>Logical order of a query: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. That is why an alias defined in SELECT can be used in ORDER BY but not in WHERE.</p>', vi: '<p>Thứ tự logic của câu truy vấn: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Vì thế bí danh đặt ở SELECT dùng được trong ORDER BY nhưng không dùng được trong WHERE.</p>' },
      thuatNgu: [TN.alias, { en: 'CASE expression', vi: 'biểu thức rẽ nhánh CASE' }, { en: 'computed column', vi: 'cột tính' }],
    }),
  ],
});
