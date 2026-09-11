/**
 * SWT301 · Lab 1 — Code review & static analysis.
 * Sources (02.Lab/01.Lab01):
 *   01.Reviews/Lab1_Review.pptx ............ deck lab1-review (2 slides)
 *   01.Reviews/sourcecode.pdf .............. deck lab1-source (2 pages, ReviewCode.java, 119 lines)
 *   01.Reviews/Java_Simple_Checklist_{ClassName}.xlsx (sheets Basic + Advance)
 *   01.Reviews/1.jpg ....................... the whole SWT301 FALL24 final PE paper (5101×39606 px);
 *                                            blank bands collapsed, re-encoded → deck lab1-img (1 image)
 *   02.StaticAnalysis/Lab1_static_analysis.pptx → deck lab1-static (6 slides)
 * Every compiler / analyzer output quoted below was produced by really running
 * javac 21, the Eclipse compiler ECJ 3.45 and Checkstyle 9.3 (both jars already
 * present in the VS Code extensions of the build machine) on a verbatim copy of
 * the code. PMD, SpotBugs, SonarLint and PVS-Studio were NOT run (not installed);
 * their rules are mapped by hand and labelled as such.
 */
import { walk, walkHead, books, bi, slide, registerDeck } from './_slides.mjs';

registerDeck('lab1-img', { code: 'Lab1 1.jpg', en: 'SWT301 FALL24 final PE paper (1.jpg in the Lab 1 folder)', vi: 'Đề PE cuối kỳ SWT301 FALL24 (file 1.jpg trong thư mục Lab 1)', total: 1, w: 1600, h: 7687 });

/* ───────────────────────────── the checklist (Basic sheet) ───────────────────────────── */
// [#, category, EN meaning, VI meaning, where it bites in ReviewCode.java]
const BASIC = [
  ['1', 'Null Checks', 'Check for <code>null</code> before calling a method on a reference, otherwise <code>NullPointerException</code>. Prefer the constant-first form <code>"admin".equals(name)</code>.', 'Kiểm tra <code>null</code> trước khi gọi phương thức, nếu không sẽ <code>NullPointerException</code>. Nên viết hằng đứng trước: <code>"admin".equals(name)</code>.', 'L19'],
  ['2', 'Exception Handling', 'try-catch-finally used properly: the catch <em>logs</em> (not just <code>printStackTrace</code>), the finally (or try-with-resources) closes the resource.', 'Dùng try-catch-finally đúng: catch có <em>ghi log</em> (không chỉ <code>printStackTrace</code>), finally (hoặc try-with-resources) đóng tài nguyên.', 'L14, L23, L76–81, L93–98'],
  ['3', 'Formatting', 'Consistent indentation and layout. Let the IDE do it: Alt+Shift+F (NetBeans), Ctrl+Shift+F (Eclipse), Ctrl+Alt+L (IntelliJ).', 'Thụt lề, bố cục nhất quán. Để IDE làm: Alt+Shift+F (NetBeans), Ctrl+Shift+F (Eclipse), Ctrl+Alt+L (IntelliJ).', 'L28, L60, L91'],
  ['4', 'Imports', 'Optimise imports: no unused ones, no wildcard <code>.*</code>, and every type you use must be imported.', 'Tối ưu import: không thừa, không dùng <code>.*</code>, và mọi kiểu dùng tới phải được import.', 'L7–10 (+ L77–78)'],
  ['5', 'Static Tools', 'Run static-analysis tools (Sonar, PMD, FindBugs/SpotBugs) to catch defects early — this is the second half of Lab 1.', 'Chạy công cụ phân tích tĩnh (Sonar, PMD, FindBugs/SpotBugs) để bắt lỗi sớm — chính là nửa sau của Lab 1.', 'whole file'],
  ['6', 'Constants', 'No hard-coded values: put them in <code>static final</code> constants or enums (<code>public static final int MAX = 10;</code>).', 'Không hard-code: gom giá trị vào hằng <code>static final</code> hoặc enum (<code>public static final int MAX = 10;</code>).', 'L26–31, L43, L49–57, L76, L91'],
  ['7', 'Naming', 'Classes in PascalCase, variables and methods in camelCase, names that say what the thing is (<code>User</code>, <code>calculateSalary()</code>).', 'Tên class PascalCase, biến và method camelCase, tên phải nói lên ý nghĩa (<code>User</code>, <code>calculateSalary()</code>).', 'L24 (a), L115 (doStuff)'],
  ['8', 'One-Liners', 'Avoid complex one-liners; split long statements so they are easy to read and debug.', 'Tránh câu lệnh "một dòng làm tất"; tách nhỏ để dễ đọc, dễ debug.', 'L28, L32, L60'],
  ['9', 'Whitespace', 'Spaces around operators, <code>?:</code> etc.: <code>a ? b : c</code>, not glued together.', 'Có khoảng trắng quanh toán tử, <code>?:</code>…: <code>a ? b : c</code>, không viết dính.', 'L60'],
  ['10', 'Brackets', 'No spaces just inside parentheses: <code>if (x &gt; 0)</code>, not <code>if ( x &gt; 0 )</code>.', 'Không chèn khoảng trắng sát trong ngoặc: <code>if (x &gt; 0)</code>, không phải <code>if ( x &gt; 0 )</code>.', '— (respected)'],
  ['11', 'Curly Braces', 'Always use <code>{}</code> for if/else/loops, even for one statement.', 'Luôn có <code>{}</code> cho if/else/vòng lặp, kể cả chỉ một lệnh.', 'L28, L91'],
  ['12', 'Comments', 'Short, meaningful comments; Javadoc for classes and methods (<code>/** This method gets user by ID */</code>).', 'Comment ngắn, có nghĩa; Javadoc cho class và method (<code>/** This method gets user by ID */</code>).', 'L1–4, L12, L113'],
  ['13', 'Clean Up', 'Remove <code>System.out</code> debug lines, obsolete comments and dead code; mark deprecated code clearly with <code>@Deprecated</code>.', 'Xoá <code>System.out</code> debug, comment thừa, code không dùng; code lỗi thời phải ghi rõ <code>@Deprecated</code>.', 'L69–70, L83, L103–117'],
  ['14', 'Logic', 'Avoid redundant code — repeated logic goes into its own method (DRY).', 'Tránh code thừa — logic lặp đưa vào hàm riêng (DRY).', 'L60–67, L84–89'],
  ['15', 'String Efficiency', 'Use <code>StringBuilder</code>/<code>StringBuffer</code> when concatenating many times — each <code>+=</code> creates a new String object.', 'Dùng <code>StringBuilder</code>/<code>StringBuffer</code> khi nối chuỗi nhiều lần — mỗi <code>+=</code> tạo một String mới.', 'L42–45'],
  ['16', 'Switch-Case', 'Use switch-case instead of a long if-else chain on the same variable.', 'Dùng switch-case thay cho chuỗi if-else dài trên cùng một biến.', 'L49–58'],
  ['17', 'Object Creation', 'Do not create unnecessary objects in loops. (The Vietnamese text in the file literally says the opposite — "create the temporary object inside the loop, do not create it early outside if not needed" — i.e. keep the scope minimal; both readings agree: no throw-away objects per iteration that could be reused, no long-lived objects that are only needed inside.)', 'Không tạo object thừa trong vòng lặp. (Câu tiếng Việt trong file viết theo chiều ngược lại — "tạo object bên trong vòng lặp nếu chỉ dùng tạm, không tạo sớm ngoài vòng lặp nếu không cần" — tức là giữ phạm vi nhỏ nhất; hai cách đọc thống nhất: không tạo object vứt đi mỗi vòng khi có thể dùng lại, không tạo object sống lâu khi chỉ cần bên trong.)', 'L42–44'],
  ['18', 'Code Commit', 'Commit per feature, put the task ID (e.g. the JIRA key) in the message, never commit passwords or <code>.class</code> files.', 'Commit theo nhóm tính năng, ghi task ID (vd mã JIRA), không bao giờ commit mật khẩu hay file <code>.class</code>.', 'L76 (password in source)'],
  ['19', 'equals vs ==', 'Compare objects with <code>.equals()</code>; <code>==</code> compares references only.', 'So sánh object bằng <code>.equals()</code>; <code>==</code> chỉ so sánh tham chiếu.', 'L72'],
  ['20', 'Simplicity', 'Keep code simple and readable; no over-engineering, no roundabout logic.', 'Code càng đơn giản càng dễ bảo trì; không over-engineer, không logic vòng vo.', 'L60'],
];
// Advance sheet: [id, category, EN, VI]
const ADV = [
  ['2.1', 'Common', 'Environment-dependent data (DB data-source name, directory names, user name, password) must live in a properties file, never hard-coded. Example from the sheet: <code>OUTPUT_FILE_PATH = Resources.getPathFromHomeDir(…)</code>, the real path is declared in Resources.java.', 'Thông tin phụ thuộc môi trường (tên data source của DB, tên thư mục, user, password) phải để trong file properties, không hard-code. Ví dụ trong sheet: <code>OUTPUT_FILE_PATH = Resources.getPathFromHomeDir(…)</code>, đường dẫn thật khai báo trong Resources.java.'],
  ['2.2', '', 'OS-dependent values use Java constants/APIs: <code>File.separator</code>, <code>System.getProperty("path.separator")</code> instead of a literal "/" or "\\".', 'Giá trị thay đổi theo hệ điều hành phải dùng hằng/hàm của Java: <code>File.separator</code>, <code>System.getProperty("path.separator")</code> thay vì gõ "/" hay "\\".'],
  ['2.3', '', 'Javadoc must use <code>@param</code>, <code>@return</code>… for the corresponding items.', 'Javadoc phải có <code>@param</code>, <code>@return</code>… cho các thành phần tương ứng.'],
  ['2.4', '', 'In the collection framework prefer <code>ArrayList</code>, <code>HashMap</code>, <code>Iterator</code> over the legacy <code>Vector</code>, <code>Hashtable</code>, <code>Enumeration</code>.', 'Trong collection framework ưu tiên <code>ArrayList</code>, <code>HashMap</code>, <code>Iterator</code> hơn các lớp cũ <code>Vector</code>, <code>Hashtable</code>, <code>Enumeration</code>.'],
  ['2.6', '', 'A class with only static methods must have a private constructor and be declared <code>final</code>.', 'Class chỉ có method static phải có constructor private và khai báo <code>final</code>.'],
  ['2.7', '', 'Variable, class… names must be meaningful.', 'Tên biến, class… phải có ý nghĩa.'],
  ['2.8', '', 'Never <code>new String(…)</code>; use literals, <code>substring</code>, <code>String.format</code>, or constants like <code>private static final String CMQ_FLAG_JT = "JT";</code>.', 'Không dùng <code>new String(…)</code>; dùng literal, <code>substring</code>, <code>String.format</code> hoặc hằng như <code>private static final String CMQ_FLAG_JT = "JT";</code>.'],
  ['2.9', '', 'Compare object values (e.g. String) with <code>equals</code>, never <code>==</code>; and think about case sensitivity (a console menu usually should ignore case).', 'So sánh giá trị object (vd String) bằng <code>equals</code>, không dùng <code>==</code>; và cân nhắc phân biệt hoa/thường (menu console thường không phân biệt).'],
  ['2.10', '', 'Open and close cursors/files properly — normally right before and right after use.', 'Mở và đóng cursor/file đúng lúc — thường là ngay trước và ngay sau khi dùng.'],
  ['2.13', '', 'No variable that is declared and never used.', 'Không có biến khai báo mà không dùng.'],
  ['2.14', '', 'Are variables declared at the start of processing and initialised (e.g. a bean created before its properties are read)?', 'Biến có được khai báo khi bắt đầu xử lý và được khởi tạo chưa (vd bean đã tạo trước khi đọc thuộc tính)?'],
  ['2.32', '', 'Is the file closed when output finishes <em>and</em> when an exception occurs?', 'Đã đóng file khi ghi xong <em>và</em> khi gặp exception chưa?'],
  ['2.33', '', '<code>SimpleDateFormat</code> is not thread-safe: shared between threads it produces wrong values or <code>NumberFormatException</code> (today: use <code>java.time.DateTimeFormatter</code>).', '<code>SimpleDateFormat</code> không an toàn đa luồng: dùng chung giữa các thread sẽ ra giá trị sai hoặc <code>NumberFormatException</code> (ngày nay: dùng <code>java.time.DateTimeFormatter</code>).'],
  ['3.8', 'performance', 'Copy arrays with <code>System.arraycopy()</code> (or <code>Arrays.copyOf</code>), not an element-by-element loop.', 'Copy mảng bằng <code>System.arraycopy()</code> (hoặc <code>Arrays.copyOf</code>), không dùng vòng lặp copy từng phần tử.'],
  ['3.9', 'performance', 'String concatenation uses <code>StringBuilder</code>, not <code>String += String</code>.', 'Nối chuỗi dùng <code>StringBuilder</code>, không dùng <code>String += String</code>.'],
  ['7.2', 'code layout', '"{" at the end of the line, "}" at the start of a line; a block with a single statement still gets <code>{}</code>.', '"{" ở cuối dòng, "}" ở đầu dòng; block chỉ một lệnh vẫn phải có <code>{}</code>.'],
  ['7.3', 'code layout', 'A line (comments excluded) is at most 100 characters.', 'Một dòng (không tính comment) không quá 100 ký tự.'],
  ['7.4', 'code layout', 'Break long lines after a logical operator (and, or), avoid breaking inside ( ), break before an arithmetic operand (+, -, *).', 'Ngắt dòng dài sau toán tử logic (and, or), hạn chế ngắt giữa biểu thức trong ( ), ngắt trước toán hạng (+, -, *).'],
  ['7.5', 'code layout', 'A continuation line is indented two tabs relative to the first line.', 'Dòng ngắt thụt 2 tab so với dòng đầu.'],
  ['7.6', 'code layout', 'One variable declaration per line.', 'Mỗi khai báo biến trên một dòng.'],
  ['7.7', 'code layout', 'Arrays are declared in one consistent style: <code>Type[] anArray;</code>.', 'Khai báo mảng thống nhất một kiểu: <code>Type[] anArray;</code>.'],
  ['7.8', 'code layout', 'Variables are declared together at the top of each block.', 'Biến khai báo tập trung ở đầu mỗi block.'],
  ['7.9', 'code layout', 'No local variable with the same name as a higher-level variable.', 'Không khai báo biến local trùng tên với biến cấp cao hơn.'],
  ['7.10', 'code layout', 'One statement per line.', 'Mỗi statement một dòng.'],
  ['7.11', 'code layout', 'Two blank lines between classes/interfaces.', 'Giữa các class, interface cách 2 dòng trống.'],
  ['7.12', 'code layout', 'One blank line between methods, between declarations and the rest, before a block or line comment, between logical blocks.', 'Một dòng trống giữa các method, giữa vùng khai báo và phần còn lại, trước block comment, trước line comment, giữa các khối xử lý.'],
  ['7.13', 'code layout', 'One space before "(", after ",", and around operators (=, +, -, *, ; inside for…).', 'Một khoảng trắng trước "(", sau ",", và quanh các phép toán (=, +, -, *, ; trong for…).'],
  ['7.14', 'naming', 'Exception class names end with "Exception"; interface names start with "I".', 'Tên class exception kết thúc bằng "Exception"; tên interface bắt đầu bằng "I".'],
  ['7.15', 'naming', 'Collection variables end with "List", sets with "Set", maps with "Map", arrays with "Array"; write "Id", never "ID".', 'Biến kiểu collection kết thúc bằng "List", set bằng "Set", map bằng "Map", mảng bằng "Array"; viết "Id", không viết "ID".'],
  ['7.16', 'naming', 'Constants: UPPER_CASE with "_", declared <code>static final</code>.', 'Hằng: VIẾT_HOA phân cách "_", khai báo <code>static final</code>.'],
  ['7.17', 'naming', 'Methods start with a lower-case verb describing the action: get, set, is, has, find, search, compute, calculate, init, add, remove, update, delete, insert, open, close, save, create, start, stop…', 'Method bắt đầu bằng động từ viết thường mô tả chức năng: get, set, is, has, find, search, compute, calculate, init, add, remove, update, delete, insert, open, close, save, create, start, stop…'],
  ['7.18', 'naming', 'Access static fields/methods through the class name (<code>Math.max</code>, not <code>obj.max</code>).', 'Truy cập biến, method static qua tên class (<code>Math.max</code>, không phải <code>obj.max</code>).'],
  ['7.19', 'naming', 'Use parentheses to make the order of operations explicit.', 'Dùng () để làm rõ thứ tự phép tính.'],
];
const basicRows = (vi) => BASIC.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${vi ? r[3] : r[2]}</td><td>${r[4]}</td></tr>`).join('');
const advRows = (vi) => ADV.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${vi ? r[3] : r[2]}</td></tr>`).join('');

/* ─────────────────────────── the full defect log of ReviewCode.java ─────────────────────────── */
// [id, name EN, name VI, line, checklist, severity, description EN, description VI, fix EN, fix VI]
const DEF = [
  ['DF001', 'Missing imports (compile error)', 'Thiếu import (lỗi biên dịch)', '77, 78 (9–10)', 'B4', 'Critical', '<code>Statement</code> and <code>ResultSet</code> are used but never imported, so the class does not compile ("cannot find symbol" — verified with javac).', '<code>Statement</code> và <code>ResultSet</code> được dùng nhưng không import, class không biên dịch được ("cannot find symbol" — đã chạy javac).', 'Add <code>import java.sql.Statement;</code> and <code>import java.sql.ResultSet;</code>.', 'Thêm <code>import java.sql.Statement;</code> và <code>import java.sql.ResultSet;</code>.'],
  ['DF002', 'Null pointer dereference', 'Gọi method trên biến null', '18–19', 'B1', 'Critical', '<code>name</code> is set to <code>null</code> and then <code>name.equals("admin")</code> is called → <code>NullPointerException</code> at line 19; the program dies before doing anything else (verified by running it).', '<code>name</code> được gán <code>null</code> rồi gọi <code>name.equals("admin")</code> → <code>NullPointerException</code> ở dòng 19; chương trình chết ngay (đã chạy thử).', 'Write <code>"admin".equals(name)</code> or check <code>name != null</code> first.', 'Viết <code>"admin".equals(name)</code> hoặc kiểm tra <code>name != null</code> trước.'],
  ['DF003', 'String compared with ==', 'So sánh String bằng ==', '72', 'B19 · A2.9', 'Major', '<code>name == "user"</code> compares references, not content; a user name read from input would never match.', '<code>name == "user"</code> so sánh tham chiếu, không so nội dung; tên đọc từ input sẽ không bao giờ khớp.', '<code>"user".equals(name)</code>.', '<code>"user".equals(name)</code>.'],
  ['DF004', 'Hard-coded database credentials', 'Hard-code thông tin đăng nhập DB', '76', 'A2.1 · B6 · B18', 'Critical', 'URL, user <code>root</code> and password <code>123456</code> are written in the source: they leak through Git and the build, and the program cannot move to another environment.', 'URL, user <code>root</code> và mật khẩu <code>123456</code> nằm trong source: lộ qua Git và bản build, và không đổi được môi trường.', 'Read them from a properties file / environment variables; never commit secrets.', 'Đọc từ file properties / biến môi trường; không commit bí mật.'],
  ['DF005', 'JDBC resources never closed', 'Không đóng tài nguyên JDBC', '76–81', 'B2 · A2.10', 'Major', '<code>Connection</code>, <code>Statement</code> and <code>ResultSet</code> are never closed (ECJ: "Potential resource leak"); connections run out under load.', '<code>Connection</code>, <code>Statement</code>, <code>ResultSet</code> không bao giờ được đóng (ECJ: "Potential resource leak"); tải cao sẽ cạn connection.', 'try-with-resources for all three.', 'Dùng try-with-resources cho cả ba.'],
  ['DF006', 'File stream never closed', 'Không đóng luồng file', '23–24', 'B2 · A2.32', 'Major', '<code>FileInputStream file</code> is opened and never closed (ECJ: "Resource leak: \'file\' is never closed"); a missing file.txt also kills the program with <code>FileNotFoundException</code> because <code>main</code> just rethrows.', '<code>FileInputStream file</code> mở mà không đóng (ECJ: "Resource leak: \'file\' is never closed"); thiếu file.txt thì chương trình chết vì <code>FileNotFoundException</code> do <code>main</code> ném thẳng ra ngoài.', 'try-with-resources + handle <code>IOException</code>; check <code>read()</code> = -1 (end of file).', 'try-with-resources + xử lý <code>IOException</code>; kiểm tra <code>read()</code> = -1 (hết file).'],
  ['DF007', 'Reader never closed, value unused', 'Reader không đóng, giá trị bỏ phí', '94–95', 'B2 · A2.13', 'Major', '<code>BufferedReader br</code> is never closed (resource leak) and <code>line</code> is read but never used.', '<code>BufferedReader br</code> không được đóng (rò tài nguyên) và <code>line</code> đọc ra mà không dùng.', 'try-with-resources; use the line or delete the block.', 'try-with-resources; dùng biến line hoặc bỏ cả khối.'],
  ['DF008', 'Exception swallowed with printStackTrace', 'Nuốt exception bằng printStackTrace', '96–97', 'B2', 'Minor', 'The catch only prints a stack trace to the console: no log, no recovery, the caller never knows the read failed.', 'catch chỉ in stack trace ra console: không log, không xử lý, nơi gọi không biết việc đọc đã hỏng.', 'Log with a logger (level WARNING/SEVERE) and return/propagate a meaningful result.', 'Ghi log bằng logger (mức WARNING/SEVERE) và trả về/ném tiếp kết quả có nghĩa.'],
  ['DF009', 'Over-broad throws clause', 'Khai báo throws quá rộng', '14', 'B2', 'Minor', '<code>main(…) throws Exception</code> lets every checked exception escape to the JVM; nothing is handled.', '<code>main(…) throws Exception</code> cho mọi checked exception thoát ra JVM; không xử lý gì.', 'Handle the specific exceptions (<code>IOException</code>, <code>SQLException</code>) where they occur.', 'Xử lý đúng exception cụ thể (<code>IOException</code>, <code>SQLException</code>) tại chỗ.'],
  ['DF010', 'Possible division by zero / redundant expression', 'Có thể chia cho 0 / biểu thức thừa', '60', 'B20 · B8 · B9', 'Major', '<code>(x +y) * (x -y) / (x+y)</code> divides by <code>x+y</code>: if x = -y it throws <code>ArithmeticException</code>. Mathematically it is just <code>x - y</code> (= -10 here). Spacing is also inconsistent.', '<code>(x +y) * (x -y) / (x+y)</code> chia cho <code>x+y</code>: nếu x = -y sẽ ném <code>ArithmeticException</code>. Về toán nó chỉ là <code>x - y</code> (= -10 ở đây). Khoảng trắng cũng không đều.', '<code>int total = x - y;</code>', '<code>int total = x - y;</code>'],
  ['DF011', 'Zero case not handled', 'Không xử lý trường hợp bằng 0', '61–67', 'B14 · B20', 'Minor', 'Two independent <code>if</code>s test &gt; 0 and &lt; 0; total = 0 prints nothing, and both conditions are always evaluated.', 'Hai <code>if</code> rời nhau kiểm &gt; 0 và &lt; 0; total = 0 thì không in gì, và luôn phải xét cả hai điều kiện.', '<code>if … else if … else</code> with an explicit zero branch.', '<code>if … else if … else</code> có nhánh bằng 0 rõ ràng.'],
  ['DF012', 'If/else without braces on one line', 'if/else không ngoặc, dồn một dòng', '28', 'B11 · B8 · A7.10', 'Minor', '<code>if (x &lt; y) … ; else … ;</code> — two statements on one line, no braces (Checkstyle: NeedBraces, OneStatementPerLine). Since x and y are the constants 10 and 20 the else branch is also dead.', '<code>if (x &lt; y) … ; else … ;</code> — hai lệnh một dòng, không ngoặc (Checkstyle: NeedBraces, OneStatementPerLine). Vì x, y là hằng 10 và 20 nên nhánh else còn là code chết.', 'Braces, one statement per line.', 'Thêm ngoặc, mỗi lệnh một dòng.'],
  ['DF013', 'If without braces, meaningless assignment', 'if không ngoặc, gán vô nghĩa', '91', 'B11 · B6 · A2.13', 'Minor', '<code>if (a &gt; 100) a = 50;</code> — no braces, magic numbers, and the new value of <code>a</code> is never used afterwards (dead store).', '<code>if (a &gt; 100) a = 50;</code> — không ngoặc, số ma thuật, và giá trị mới của <code>a</code> không bao giờ được dùng (gán chết).', 'Remove it, or use named constants and actually use the value.', 'Bỏ đi, hoặc dùng hằng có tên và dùng giá trị đó thật.'],
  ['DF014', 'String concatenation in a loop', 'Nối chuỗi trong vòng lặp', '42–45', 'B15 · A3.9', 'Minor', '<code>result += s + k</code> 100 times per element creates about 100 throw-away String objects per outer iteration.', '<code>result += s + k</code> 100 lần mỗi phần tử tạo khoảng 100 String bỏ đi mỗi vòng ngoài.', '<code>StringBuilder sb = new StringBuilder(); sb.append(s).append(k);</code>', '<code>StringBuilder sb = new StringBuilder(); sb.append(s).append(k);</code>'],
  ['DF015', 'Long if-else chain on one variable', 'Chuỗi if-else dài trên một biến', '49–58', 'B16 · B6', 'Minor', 'Four <code>else if</code> on <code>choice</code> with magic numbers 1–4 and no final <code>else</code>, so an unexpected value is silently ignored.', 'Bốn <code>else if</code> trên <code>choice</code> với số ma thuật 1–4 và không có <code>else</code> cuối, giá trị lạ bị bỏ qua im lặng.', '<code>switch (choice)</code> with a <code>default</code> branch (or an enum).', '<code>switch (choice)</code> có nhánh <code>default</code> (hoặc enum).'],
  ['DF016', 'Unused result / confusing reuse of a name', 'Kết quả không dùng / dùng lại tên gây rối', '83 (and 42)', 'B13 · A2.13 · A7.9', 'Minor', '<code>int result</code> is computed and never used (ECJ: "value of the local variable result is not used"); the same name was a <code>String</code> at line 42.', '<code>int result</code> tính xong không dùng (ECJ: "value of the local variable result is not used"); cùng tên đó là <code>String</code> ở dòng 42.', 'Use it (print/return) or delete it; give distinct names (<code>totalLength</code>).', 'Dùng (in/trả về) hoặc xoá; đặt tên khác nhau (<code>totalLength</code>).'],
  ['DF017', 'Redundant index loop', 'Vòng lặp chỉ số thừa', '84–89', 'B14 · B20', 'Trivial', 'Index loop calls <code>list.get(index)</code> twice; a for-each is shorter and clearer.', 'Vòng lặp chỉ số gọi <code>list.get(index)</code> hai lần; for-each ngắn và rõ hơn.', '<code>for (String val : list) { if (val != null) … }</code>', '<code>for (String val : list) { if (val != null) … }</code>'],
  ['DF018', 'Debug code left in', 'Còn code debug', '69–70', 'B13', 'Minor', '"temp code, to be removed later" + <code>System.out.println("Debug line...")</code> was never removed.', '"temp code, to be removed later" + <code>System.out.println("Debug line...")</code> chưa bao giờ được xoá.', 'Delete both lines.', 'Xoá cả hai dòng.'],
  ['DF019', 'Console output instead of logging', 'In console thay vì ghi log', '16, 20, 70, 100…', 'B13', 'Trivial', 'All messages go through <code>System.out.println</code>; no levels, no timestamps, cannot be switched off.', 'Mọi thông báo đi qua <code>System.out.println</code>; không có mức, không có thời gian, không tắt được.', 'Use <code>java.util.logging.Logger</code> (or SLF4J).', 'Dùng <code>java.util.logging.Logger</code> (hoặc SLF4J).'],
  ['DF020', 'Call to a deprecated method', 'Gọi method đã deprecated', '103, 107–110', 'B13 · A2.3', 'Minor', '<code>main</code> calls <code>oldMethod()</code>, which is <code>@Deprecated</code>; there is no <code>@deprecated</code> Javadoc saying what to use instead.', '<code>main</code> gọi <code>oldMethod()</code> vốn đã <code>@Deprecated</code>; không có Javadoc <code>@deprecated</code> chỉ cách thay thế.', 'Call the replacement; document it with <code>@deprecated use …</code> or delete the method.', 'Gọi method thay thế; ghi <code>@deprecated use …</code> hoặc xoá method.'],
  ['DF021', 'Meaningless method name, useless Javadoc, dead method', 'Tên method vô nghĩa, Javadoc vô dụng, method chết', '112–117', 'B7 · B12 · A2.3 · A7.17', 'Minor', '<code>doStuff</code> says nothing; the Javadoc "do something cool" has no <code>@param</code>/<code>@return</code>; the method is never called.', '<code>doStuff</code> không nói lên gì; Javadoc "do something cool" không có <code>@param</code>/<code>@return</code>; method không được gọi ở đâu.', 'Rename (<code>add</code>/<code>sum</code>), write real Javadoc, or delete it.', 'Đổi tên (<code>add</code>/<code>sum</code>), viết Javadoc thật, hoặc xoá.'],
  ['DF022', 'Wildcard imports', 'Import dạng *', '7–8', 'B4', 'Trivial', '<code>java.util.*</code> and <code>java.io.*</code> hide which classes are used (Checkstyle: AvoidStarImport).', '<code>java.util.*</code> và <code>java.io.*</code> che mất class nào thực sự được dùng (Checkstyle: AvoidStarImport).', 'Import each class explicitly (IDE: Fix/Optimize Imports).', 'Import từng class (IDE: Fix/Optimize Imports).'],
  ['DF023', 'Template comment left, no class Javadoc', 'Còn comment template, thiếu Javadoc class', '1–4, 12', 'B12 · B13', 'Trivial', 'The NetBeans "Click nbfs://… to change this license" header is obsolete; the class itself has no Javadoc.', 'Header "Click nbfs://… to change this license" của NetBeans là rác; class không có Javadoc.', 'Replace with a real class Javadoc (purpose, author).', 'Thay bằng Javadoc thật cho class (mục đích, tác giả).'],
  ['DF024', 'Utility class not final, public constructor', 'Class tiện ích không final, constructor public', '12', 'A2.6', 'Trivial', 'Only static methods, yet the class can be instantiated and subclassed (Checkstyle: HideUtilityClassConstructor).', 'Chỉ có method static nhưng vẫn tạo được đối tượng và kế thừa được (Checkstyle: HideUtilityClassConstructor).', '<code>public final class …</code> + <code>private ReviewCode() {}</code>.', '<code>public final class …</code> + <code>private ReviewCode() {}</code>.'],
  ['DF025', 'C-style array declaration', 'Khai báo mảng kiểu C', '14', 'A7.7', 'Trivial', '<code>String args[]</code> instead of <code>String[] args</code> (Checkstyle: ArrayTypeStyle).', '<code>String args[]</code> thay vì <code>String[] args</code> (Checkstyle: ArrayTypeStyle).', '<code>String[] args</code>.', '<code>String[] args</code>.'],
  ['DF026', 'Magic numbers', 'Số ma thuật', '26–27, 31, 43, 54–57, 91', 'B6', 'Trivial', '10, 20, 5, 100, 3, 4, 50 appear without names (Checkstyle MagicNumber lists 8 of them).', '10, 20, 5, 100, 3, 4, 50 xuất hiện không tên (Checkstyle MagicNumber liệt kê 8 chỗ).', 'Named <code>static final</code> constants.', 'Hằng <code>static final</code> có tên.'],
  ['DF027', 'Side effect inside an argument', 'Tác dụng phụ trong đối số', '30–33', 'B8', 'Trivial', '<code>println(i++)</code> hides the loop increment inside the print call; a <code>for</code> loop states the intent.', '<code>println(i++)</code> giấu bước tăng biến lặp trong lệnh in; vòng <code>for</code> nói rõ ý đồ.', '<code>for (int i = 0; i &lt; LIMIT; i++) { … }</code>', '<code>for (int i = 0; i &lt; LIMIT; i++) { … }</code>'],
  ['DF028', 'Meaningless name, declared far from use', 'Tên vô nghĩa, khai báo xa chỗ dùng', '24', 'B7 · A2.7', 'Trivial', '<code>int a</code> holds the first byte of a file and is only used 67 lines later (Checkstyle Google: VariableDeclarationUsageDistance).', '<code>int a</code> chứa byte đầu của file và 67 dòng sau mới dùng (Checkstyle Google: VariableDeclarationUsageDistance).', 'Name it <code>firstByte</code>, declare it where it is used.', 'Đặt tên <code>firstByte</code>, khai báo ngay chỗ dùng.'],
  ['DF029', 'SELECT * and interface-typed declaration', 'SELECT * và khai báo theo lớp cụ thể', '78, 35', 'B20 · A2.4', 'Trivial', '<code>select * from user</code> fetches every column while only <code>name</code> is used; <code>ArrayList&lt;String&gt; list = new ArrayList&lt;String&gt;()</code> should be declared as <code>List</code> with the diamond operator (ECJ: "Redundant specification of type arguments").', '<code>select * from user</code> lấy mọi cột trong khi chỉ dùng <code>name</code>; <code>ArrayList&lt;String&gt; list = new ArrayList&lt;String&gt;()</code> nên khai báo kiểu <code>List</code> và dùng diamond (ECJ: "Redundant specification of type arguments").', '<code>SELECT name FROM …</code>; <code>List&lt;String&gt; list = new ArrayList&lt;&gt;();</code>', '<code>SELECT name FROM …</code>; <code>List&lt;String&gt; list = new ArrayList&lt;&gt;();</code>'],
];
const defRows = (vi) => DEF.map((d) => `<tr><td>${d[0]}</td><td>${vi ? d[2] : d[1]}</td><td>${d[3]}</td><td>${d[4]}</td><td>${d[5]}</td><td>${vi ? d[7] : d[6]}</td><td>${vi ? d[9] : d[8]}</td></tr>`).join('');
const defTable = (vi) => `<div class="table-wrap"><table>
<thead><tr>${(vi ? ['ID', 'Tên defect', 'Dòng', 'Mục checklist', 'Mức độ', 'Mô tả', 'Cách sửa'] : ['ID', 'Defect name', 'Line', 'Checklist item', 'Severity', 'Description', 'Fixing solution']).map((h) => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${defRows(vi)}</tbody></table></div>`;

const FIXED = `<pre><code>package controller;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Lab 1 review exercise, rewritten after the code review.
 */
public final class ReviewCodeFixed {

    private static final Logger LOG = Logger.getLogger(ReviewCodeFixed.class.getName());
    private static final int REPEAT_COUNT = 100;
    private static final int LOOP_LIMIT = 5;

    private ReviewCodeFixed() {
        // utility class: no instances                  (DF024)
    }

    /**
     * Entry point.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {           // DF009, DF025
        LOG.info("Start...");

        String name = args.length &gt; 0 ? args[0] : null;
        if ("admin".equals(name)) {                      // DF002
            LOG.info("Hello Admin");
        }
        if ("user".equals(name)) {                       // DF003
            LOG.info("User name matched");
        }

        int x = 10;
        int y = 20;
        LOG.info(x &lt; y ? "x&lt;y" : "x&gt;=y");               // DF012

        for (int i = 0; i &lt; LOOP_LIMIT; i++) {           // DF027
            LOG.info(String.valueOf(i));
        }

        List&lt;String&gt; list = new ArrayList&lt;&gt;();           // DF029
        list.add("a");
        list.add("b");
        list.add("c");
        for (String s : list) {
            StringBuilder sb = new StringBuilder();      // DF014
            for (int k = 0; k &lt; REPEAT_COUNT; k++) {
                sb.append(s).append(k);
            }
            LOG.fine(sb.toString());
        }

        LOG.info(describeChoice(2));                      // DF015

        int total = x - y;                               // DF010
        LOG.info(total &gt; 0 ? "Positive" : total &lt; 0 ? "Negative" : "Zero"); // DF011

        LOG.info("Total length = " + totalLength(list)); // DF016, DF017
        LOG.info("First byte = " + readFirstByte("file.txt"));
        LOG.info("First line = " + readFirstLine("somefile.txt"));
        printUsers();
        LOG.info("Finished");                            // DF018, DF019, DF020 removed
    }

    static String describeChoice(int choice) {
        switch (choice) {
            case 1: return "One";
            case 2: return "Two";
            case 3: return "Three";
            case 4: return "Four";
            default: return "Unknown";
        }
    }

    static int totalLength(List&lt;String&gt; values) {
        int length = 0;
        for (String val : values) {
            if (val != null) {
                length += val.length();
            }
        }
        return length;
    }

    static int readFirstByte(String path) {
        try (InputStream in = new FileInputStream(path)) {    // DF006
            return in.read();
        } catch (IOException e) {
            LOG.log(Level.WARNING, "Cannot read " + path, e);   // DF008
            return -1;
        }
    }

    static String readFirstLine(String path) {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) { // DF007
            return br.readLine();
        } catch (IOException e) {
            LOG.log(Level.WARNING, "Cannot read " + path, e);
            return null;
        }
    }

    static void printUsers() {
        String url = System.getenv("DB_URL");             // DF004
        if (url == null) {
            LOG.info("DB_URL not set - skipping the user query");
            return;
        }
        try (Connection con = DriverManager.getConnection(url,
                    System.getenv("DB_USER"), System.getenv("DB_PASSWORD"));
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery("SELECT name FROM users")) {   // DF001, DF005
            while (rs.next()) {
                LOG.info("User: " + rs.getString("name"));
            }
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "User query failed", e);
        }
    }
}</code></pre>`;

const RUN_ORIG = `<pre><code>$ javac -Xlint:all controller/ReviewCode.java          # verbatim copy of sourcecode.pdf
controller/ReviewCode.java:77: error: cannot find symbol
        Statement st = con.createStatement();
        ^
  symbol:   class Statement
controller/ReviewCode.java:78: error: cannot find symbol
        ResultSet rs = st.executeQuery("select * from user");
        ^
  symbol:   class ResultSet
2 errors

# after adding the two imports it compiles; running it:
$ java controller.ReviewCode
Start...
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.equals(Object)" because "&lt;local1&gt;" is null
	at controller.ReviewCode.main(ReviewCode.java:19)</code></pre>`;

const RUN_FIXED = `<pre><code>$ javac -Xlint:all -d out controller/ReviewCodeFixed.java     # 0 errors, 0 warnings
$ java controller.ReviewCodeFixed          (logger prefix lines removed)
INFO: Start...
INFO: x&lt;y
INFO: 0 … INFO: 4
INFO: Two
INFO: Negative
INFO: Total length = 3
WARNING: Cannot read file.txt
INFO: First byte = -1
WARNING: Cannot read somefile.txt
INFO: First line = null
INFO: DB_URL not set - skipping the user query
INFO: Finished</code></pre>`;

/* ═══════════════════════════ Lesson 1 — the task & the checklist ═══════════════════════════ */
const L1 = {
  title: 'Lab 1.1 — The code-review task and the Java checklist, item by item|||Lab 1.1 — Đề bài review code và checklist Java, từng mục một',
  slug: 'swt301-lab1-review-checklist',
  type: 'VIDEO',
  description: 'Lab1_Review slide 1–2: yêu cầu bài Lab 1 review code (≥10 defect, file Word, 6 nội dung mỗi defect) và toàn bộ file Java_Simple_Checklist — 20 mục sheet Basic + 33 mục sheet Advance, dịch và giải thích, cách điền cột Result/DefectID/Line.',
  content: [
    bi(`<span class="eyebrow">Lab 1 · Lesson 1.1 · Lab1_Review slides 1–2 · Java_Simple_Checklist_{ClassName}.xlsx</span>
<h2>Lab 1 (part 1): review code with a checklist</h2>
<p class="lead">Lab 1 is where Chapter 3 (static testing) becomes a skill. You get a Java class, a checklist and a defect-report format; you must find, log and fix at least ten defects <em>without running the code</em>. This lesson explains exactly what is asked and walks through every item of the checklist. Lesson 1.2 then does the complete review of the given code, Lesson 1.3 covers the static-analysis tools, and Lesson 1.4 shows how all of this is marked in PE Question 1.</p>
<div class="callout"><b>Learning objectives.</b> LO-3.1.1 Recognise work products that static testing can examine — here source code (K1) · LO-3.2.4 Apply a review technique — <b>checklist-based reviewing</b> — to a work product to find defects (K3) · LO-3.1.2 Explain the value of static testing: defects are found before execution and are cheaper to fix (K2).</div>
<h3>The lab in one screen</h3>
<div class="lz-flow"><span>1 · Open sourcecode.pdf (ReviewCode.java)</span><span>2 · One checklist file per class</span><span>3 · Go item by item: OK / NG</span><span>4 · Each NG → new Defect ID + line</span><span>5 · Word file: ≥ 10 defects × 6 fields</span><span>6 · Demo in class: find → log → fix</span></div>
<table>
<thead><tr><th>Deliverable</th><th>Exact requirement (slide 1)</th></tr></thead>
<tbody>
<tr><td>Checklist</td><td><em>Java_Simple_Checklist_{ClassName}.xlsx</em>, <b>one file per class</b> — so for this lab <em>Java_Simple_Checklist_ReviewCode.xlsx</em>. Every defect gets a self-made <b>Defect ID</b> in column "DefectID".</td></tr>
<tr><td>Defect list</td><td>At least <b>10 defects per student</b>, rewritten in a Word file named <em>&lt;your number on FAP&gt;_&lt;your name&gt;_DefectList_Lab1_1</em>, each defect with the <b>6 contents</b> "as in slide 2".</td></tr>
<tr><td>Demo</td><td>In class you show the three activities: <b>find</b> the defect, <b>log</b> it, <b>fix</b> it.</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Lab 1 · Bài 1.1 · Lab1_Review slide 1–2 · Java_Simple_Checklist_{ClassName}.xlsx</span>
<h2>Lab 1 (phần 1): review code bằng checklist</h2>
<p class="lead">Lab 1 là nơi Chương 3 (kiểm thử tĩnh) trở thành kỹ năng. Bạn nhận một class Java, một checklist và một mẫu báo cáo defect; phải tìm, ghi nhận và sửa ít nhất mười defect <em>mà không chạy code</em>. Bài này giải thích chính xác đề yêu cầu gì và đi qua từng mục của checklist. Bài 1.2 review trọn vẹn đoạn code được giao, Bài 1.3 nói về công cụ phân tích tĩnh, Bài 1.4 cho thấy tất cả những điều này được chấm thế nào ở Câu 1 đề PE.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-3.1.1 Nhận ra các sản phẩm công việc mà kiểm thử tĩnh xem xét được — ở đây là mã nguồn (K1) · LO-3.2.4 Áp dụng một kỹ thuật review — <b>review theo checklist</b> — để tìm defect (K3) · LO-3.1.2 Giải thích giá trị của kiểm thử tĩnh: defect lộ ra trước khi chạy và sửa rẻ hơn (K2).</div>
<h3>Bài lab trong một màn hình</h3>
<div class="lz-flow"><span>1 · Mở sourcecode.pdf (ReviewCode.java)</span><span>2 · Mỗi class một file checklist</span><span>3 · Xét từng mục: OK / NG</span><span>4 · Mỗi NG → một Defect ID + dòng</span><span>5 · File Word: ≥ 10 defect × 6 nội dung</span><span>6 · Demo trên lớp: tìm → log → sửa</span></div>
<table>
<thead><tr><th>Sản phẩm nộp</th><th>Yêu cầu chính xác (slide 1)</th></tr></thead>
<tbody>
<tr><td>Checklist</td><td><em>Java_Simple_Checklist_{ClassName}.xlsx</em>, <b>mỗi class một file</b> — với lab này là <em>Java_Simple_Checklist_ReviewCode.xlsx</em>. Mỗi defect tự đặt một <b>Defect ID</b> ghi vào cột "DefectID".</td></tr>
<tr><td>Danh sách defect</td><td>Tối thiểu <b>10 defect mỗi sinh viên</b>, viết lại vào file Word tên <em>&lt;số thứ tự trên FAP&gt;_&lt;tên SV&gt;_DefectList_Lab1_1</em>, mỗi defect gồm <b>6 nội dung</b> "như slide 2".</td></tr>
<tr><td>Demo</td><td>Trên lớp trình bày ba hoạt động: <b>tìm</b> lỗi, <b>log</b> lỗi, <b>sửa</b> lỗi.</td></tr>
</tbody>
</table>`),
    walkHead('lab1-review', 1, 2),
    walk('lab1-review', [
      [1, 'Lab 1_2: Review code',
        `<p>Content of the lab: use a checklist to review code; record the results, analyse, evaluate and fix. Exit criteria (the conditions for "done"): use <em>Java_Simple_Checklist_{ClassName}.xlsx</em> on the source code, one checklist file per class, a self-made Defect ID for every defect in the "Defect ID" column; at least 10 defects per student in a Word file; demo find / log / fix in class.</p>
<p><b>Three small inconsistencies to be aware of</b> (ask your lecturer if in doubt): (1) the slide says the code is in <em>review_code.png</em>, but the file in the folder is <em>sourcecode.pdf</em> (same class, <code>ReviewCode.java</code>); (2) the title says "Lab 1_2" while the Word file must be named "…_Lab1_1"; (3) "6 contents as in slide 2", but slide 2 shows only <b>5</b> fields. The safest answer is to add the checklist item (or the severity) as the sixth — that is what Lesson 1.2 does.</p>
<p><b>Why "exit criteria"?</b> It is the same term as in the test process (Chapter 1, lesson 1.4): measurable conditions that decide when an activity is finished. Here: ≥ 10 logged defects + the demo.</p>`,
        `<p>Nội dung bài lab: dùng checklist để review code; ghi nhận kết quả, phân tích, đánh giá và sửa lỗi. Exit criteria (điều kiện "xong"): dùng <em>Java_Simple_Checklist_{ClassName}.xlsx</em> cho mã nguồn, mỗi class một file checklist, mỗi lỗi tự tạo một Defect ID ghi vào cột "Defect ID"; mỗi sinh viên ít nhất 10 lỗi trong một file Word; demo trên lớp tìm / log / sửa lỗi.</p>
<p><b>Ba chỗ chưa khớp nên biết</b> (hỏi giảng viên nếu phân vân): (1) slide nói code nằm ở <em>review_code.png</em>, nhưng file trong thư mục là <em>sourcecode.pdf</em> (cùng class <code>ReviewCode.java</code>); (2) tiêu đề ghi "Lab 1_2" còn file Word lại đặt tên "…_Lab1_1"; (3) "6 nội dung như slide 2", nhưng slide 2 chỉ có <b>5</b> trường. An toàn nhất là thêm mục checklist (hoặc mức độ nghiêm trọng) làm nội dung thứ sáu — Bài 1.2 làm đúng như vậy.</p>
<p><b>Vì sao gọi là "exit criteria"?</b> Đó chính là thuật ngữ trong quy trình test (Chương 1, bài 1.4): điều kiện đo được để quyết định một hoạt động đã xong. Ở đây: ≥ 10 defect đã log + buổi demo.</p>`],
      [2, 'The defect report template (screenshot of 1.jpg)',
        `<p>The slide is a screenshot of the Windows Photos app showing <em>1.jpg</em> (5101 × 39606 px — the whole FALL24 final PE paper, shown in full in Lesson 1.4). The visible part is <b>PE Question 1 (3 points)</b>: "The following Java class contains six defects related to code standards, logic, and best practices. Identify and explain each defect using the following defect report template":</p>
<table>
<thead><tr><th>Field</th><th>What the paper asks</th><th>How to fill it well</th></tr></thead>
<tbody>
<tr><td>Defect ID</td><td>unique identifier, e.g. DF001, DF002</td><td>Sequential, never reused; the same ID appears in the checklist "DefectID" column.</td></tr>
<tr><td>Defect Name</td><td>descriptive name such as "Naming Convention Error"</td><td>A category, not a sentence: "Null pointer dereference", "Resource leak", "String compared with ==".</td></tr>
<tr><td>Line Number</td><td>specific line where the defect occurs</td><td>The line of the <em>defect</em> (not of its effect); give a range "76–81" for a block.</td></tr>
<tr><td>Defect Description</td><td>a brief, one-sentence explanation</td><td>What is wrong <b>and</b> what can happen: "… is null, so line 19 throws NullPointerException."</td></tr>
<tr><td>Fixing Solution</td><td>concise description of the code change</td><td>The actual change, ideally the corrected line of code.</td></tr>
</tbody>
</table>
<p>This is the same information as an ISTQB defect report (Chapter 5): identifier, title/summary, location, description of the problem, and — for a review — the recommended correction. The Lab trains exactly the answer format of the PE.</p>`,
        `<p>Slide là ảnh chụp ứng dụng Photos của Windows đang mở <em>1.jpg</em> (5101 × 39606 px — toàn bộ đề PE cuối kỳ FALL24, xem trọn ở Bài 1.4). Phần nhìn thấy là <b>Câu 1 đề PE (3 điểm)</b>: "Class Java sau có sáu defect liên quan tới chuẩn code, logic và best practice. Hãy xác định và giải thích từng defect theo mẫu báo cáo defect sau":</p>
<table>
<thead><tr><th>Trường</th><th>Đề yêu cầu</th><th>Cách điền tốt</th></tr></thead>
<tbody>
<tr><td>Defect ID</td><td>mã duy nhất, vd DF001, DF002</td><td>Đánh số tuần tự, không dùng lại; cùng mã đó ghi ở cột "DefectID" của checklist.</td></tr>
<tr><td>Defect Name</td><td>tên mô tả, vd "Naming Convention Error"</td><td>Một nhóm lỗi, không phải một câu: "Null pointer dereference", "Resource leak", "String compared with ==".</td></tr>
<tr><td>Line Number</td><td>dòng cụ thể nơi có defect</td><td>Dòng của <em>defect</em> (không phải nơi lộ hậu quả); với một khối ghi khoảng "76–81".</td></tr>
<tr><td>Defect Description</td><td>một câu giải thích ngắn</td><td>Sai cái gì <b>và</b> hậu quả: "… là null nên dòng 19 ném NullPointerException."</td></tr>
<tr><td>Fixing Solution</td><td>mô tả ngắn thay đổi code để sửa</td><td>Thay đổi thật sự, tốt nhất là dòng code đã sửa.</td></tr>
</tbody>
</table>
<p>Đây chính là thông tin của một defect report theo ISTQB (Chương 5): mã, tiêu đề/tóm tắt, vị trí, mô tả vấn đề, và — với review — cách sửa đề xuất. Bài Lab luyện đúng định dạng câu trả lời của đề PE.</p>`],
    ]),
    bi(`<h2>📋 The checklist file, sheet by sheet</h2>
<p><em>Java_Simple_Checklist_{ClassName}.xlsx</em> has two sheets. Rename the file per class (e.g. <em>Java_Simple_Checklist_ReviewCode.xlsx</em>).</p>
<h3>Sheet "Basic" — 20 items (columns # · Category · Description (EN) · Explanation (VI) · Result · DefectID · Line · Note)</h3>
<p>For every item you write <b>Result</b> = OK (the code respects it) or NG (no good — at least one violation), and for NG the <b>DefectID</b>(s) and <b>Line</b>(s). The file ships with one example row: item 1 "Null Checks" → Result <code>NG</code>, DefectID <code>BUG_0001</code>, Line <code>27, 20,..</code> — i.e. one item may point to several lines, and you may choose your own ID style (BUG_0001 or DF001) as long as it is consistent. The last column shows where each item is violated in the Lab's <code>ReviewCode.java</code>.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Category</th><th>What it means</th><th>Violated in ReviewCode.java</th></tr></thead>
<tbody>${basicRows(false)}</tbody>
</table></div>
<h3>Sheet "Advance" — the company coding check sheet</h3>
<p>Header: <em>Coding check sheet</em> · Function name · PIC (person in charge) · Approver · Result · DefectID · Line · Note, plus two "Check / (date)" columns — one for the author's self-check, one for the reviewer. The item numbers (2.1 … 7.19) come from a longer Japanese-style coding standard; gaps (2.5, 2.11–2.12, 2.15–2.31…) are items that were dropped from this short version. The original text is in rough Vietnamese; here it is translated.</p>
<div class="table-wrap"><table>
<thead><tr><th>No.</th><th>Group</th><th>Item</th></tr></thead>
<tbody>${advRows(false)}</tbody>
</table></div>
<div class="callout ok"><b>How to use both sheets efficiently.</b> Do the Basic sheet first, top to bottom, reading the <em>whole</em> class once per item (that is the discipline of checklist-based reviewing: the checklist tells you what to look for, so you do not stop at the first bug you notice). Then do Advance for the finer rules. A defect may violate several items — log it <b>once</b> with one ID and reference the ID on each row.</div>`,
    `<h2>📋 File checklist, từng sheet</h2>
<p><em>Java_Simple_Checklist_{ClassName}.xlsx</em> có hai sheet. Đổi tên file theo từng class (vd <em>Java_Simple_Checklist_ReviewCode.xlsx</em>).</p>
<h3>Sheet "Basic" — 20 mục (cột # · Category · Description (EN) · Explanation (VI) · Result · DefectID · Line · Note)</h3>
<p>Với mỗi mục ghi <b>Result</b> = OK (code tuân thủ) hoặc NG (no good — có ít nhất một vi phạm); với NG ghi thêm <b>DefectID</b> và <b>Line</b>. File có sẵn một dòng mẫu: mục 1 "Null Checks" → Result <code>NG</code>, DefectID <code>BUG_0001</code>, Line <code>27, 20,..</code> — tức một mục có thể trỏ nhiều dòng, và bạn tự chọn kiểu mã (BUG_0001 hay DF001) miễn là nhất quán. Cột cuối cho biết mục đó bị vi phạm ở đâu trong <code>ReviewCode.java</code> của bài Lab.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Nhóm</th><th>Ý nghĩa</th><th>Vi phạm trong ReviewCode.java</th></tr></thead>
<tbody>${basicRows(true)}</tbody>
</table></div>
<h3>Sheet "Advance" — coding check sheet của doanh nghiệp</h3>
<p>Tiêu đề: <em>Coding check sheet</em> · Function name · PIC (người phụ trách) · Approver (người duyệt) · Result · DefectID · Line · Note, cùng hai cột "Check / (ngày)" — một cho tác giả tự kiểm, một cho người review. Số mục (2.1 … 7.19) lấy từ một bộ coding standard kiểu Nhật dài hơn; chỗ nhảy số (2.5, 2.11–2.12, 2.15–2.31…) là các mục đã bị lược khỏi bản rút gọn này. Văn bản gốc tiếng Việt khá "thô"; dưới đây đã chuẩn hoá.</p>
<div class="table-wrap"><table>
<thead><tr><th>Mục</th><th>Nhóm</th><th>Nội dung</th></tr></thead>
<tbody>${advRows(true)}</tbody>
</table></div>
<div class="callout ok"><b>Dùng hai sheet cho hiệu quả.</b> Làm sheet Basic trước, từ trên xuống, đọc <em>toàn bộ</em> class một lượt cho mỗi mục (đó là kỷ luật của review theo checklist: checklist bảo bạn tìm cái gì, nên bạn không dừng lại ở con bug đầu tiên bắt gặp). Sau đó làm Advance cho các quy tắc chi tiết. Một defect có thể vi phạm nhiều mục — chỉ log <b>một lần</b> với một ID và ghi ID đó ở từng dòng mục liên quan.</div>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — filling five rows of the Basic sheet</h3>
<table>
<thead><tr><th>#</th><th>Category</th><th>Result</th><th>DefectID</th><th>Line</th><th>Note</th></tr></thead>
<tbody>
<tr><td>1</td><td>Null Checks</td><td>NG</td><td>DF002</td><td>19</td><td>name is null → NPE</td></tr>
<tr><td>2</td><td>Exception Handling</td><td>NG</td><td>DF005, DF006, DF007, DF008, DF009</td><td>14, 23, 76–81, 94–97</td><td>no try-with-resources, printStackTrace</td></tr>
<tr><td>4</td><td>Imports</td><td>NG</td><td>DF001, DF022</td><td>7–10, 77–78</td><td>Statement/ResultSet missing; wildcard imports</td></tr>
<tr><td>10</td><td>Brackets</td><td>OK</td><td></td><td></td><td>no "( x )" spacing found</td></tr>
<tr><td>19</td><td>equals vs ==</td><td>NG</td><td>DF003</td><td>72</td><td>name == "user"</td></tr>
</tbody>
</table>
<p>Notice row 10: an <b>OK</b> is also a result. Leaving a row empty means "not checked", which a reviewer cannot distinguish from "forgot".</p>
<div class="pitfall"><b>Trap: counting the same bug ten times.</b> Ten <code>System.out.println</code> calls are <em>one</em> defect ("console output instead of logging", lines 16, 20, 70…), not ten. Lecturers mark distinct defects. Conversely, one line can hide two different defects (line 76: hard-coded password <em>and</em> an unclosed connection) — those are two IDs.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Where do checklists like this come from?</b> Industrial coding standards — SEI CERT Oracle Coding Standard for Java, Google Java Style, the old Sun Code Conventions, MISRA for C — are long lists of numbered rules. Teams turn the rules that tools cannot check (naming meaning, design, comments) into review checklists, and delegate the mechanical ones (braces, spacing, imports) to Checkstyle/PMD so humans spend review time on logic. Studies of code inspection (Fagan 1976 and later) found checklists raise defect-detection rates mainly by <em>focusing</em> reviewers. <em>Outside the syllabus because CTFL only names checklist-based reviewing as a technique.</em></div>`,
    `<h3>Ví dụ có lời giải · Điền năm dòng của sheet Basic</h3>
<table>
<thead><tr><th>#</th><th>Nhóm</th><th>Result</th><th>DefectID</th><th>Line</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>1</td><td>Null Checks</td><td>NG</td><td>DF002</td><td>19</td><td>name là null → NPE</td></tr>
<tr><td>2</td><td>Exception Handling</td><td>NG</td><td>DF005, DF006, DF007, DF008, DF009</td><td>14, 23, 76–81, 94–97</td><td>không try-with-resources, printStackTrace</td></tr>
<tr><td>4</td><td>Imports</td><td>NG</td><td>DF001, DF022</td><td>7–10, 77–78</td><td>thiếu Statement/ResultSet; import dạng *</td></tr>
<tr><td>10</td><td>Brackets</td><td>OK</td><td></td><td></td><td>không có kiểu "( x )"</td></tr>
<tr><td>19</td><td>equals vs ==</td><td>NG</td><td>DF003</td><td>72</td><td>name == "user"</td></tr>
</tbody>
</table>
<p>Để ý dòng 10: <b>OK</b> cũng là một kết quả. Để trống nghĩa là "chưa kiểm", người chấm không phân biệt được với "quên".</p>
<div class="pitfall"><b>Bẫy: đếm một bug mười lần.</b> Mười lệnh <code>System.out.println</code> là <em>một</em> defect ("in console thay vì log", dòng 16, 20, 70…), không phải mười. Giảng viên chấm số defect khác nhau. Ngược lại, một dòng có thể chứa hai defect khác nhau (dòng 76: hard-code mật khẩu <em>và</em> connection không đóng) — đó là hai ID.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Checklist như thế này từ đâu ra?</b> Các coding standard công nghiệp — SEI CERT Oracle Coding Standard for Java, Google Java Style, Sun Code Conventions cũ, MISRA cho C — là danh sách dài các quy tắc đánh số. Các nhóm biến những quy tắc công cụ không kiểm được (ý nghĩa tên, thiết kế, comment) thành checklist review, còn phần máy móc (ngoặc, khoảng trắng, import) giao cho Checkstyle/PMD để con người dành thời gian review cho logic. Các nghiên cứu về inspection (Fagan 1976 và sau đó) cho thấy checklist tăng tỉ lệ phát hiện lỗi chủ yếu nhờ giúp người review <em>tập trung</em>. <em>Ngoài giáo trình vì CTFL chỉ nêu review theo checklist như một kỹ thuật.</em></div>`),
    books([
      ['fst4', 'Ch.3 §2 "Review process" — pp.79–99 (PDF 93–113), incl. review techniques (ad hoc, checklist-based, scenario-based, role/perspective-based) and success factors; exercise p.103, solution p.105', 'Chương 3 §2 "Review process" — trang 79–99 (PDF 93–113), gồm các kỹ thuật review (ad hoc, checklist-based, scenario-based, role/perspective-based) và yếu tố thành công; bài tập trang 103, lời giải trang 105'],
      ['sp5', '§4.3 The review process (PDF 132), §4.3.2 Individual review techniques — checklist-based (PDF 137–138), §4.5 Critical success factors (PDF 150)', '§4.3 The review process (PDF 132), §4.3.2 Kỹ thuật review cá nhân — checklist-based (PDF 137–138), §4.5 Yếu tố thành công (PDF 150)'],
      ['fst', '§3.2 "Review process" — pp.59–68 (PDF 62–71): checklists pp.60–65', '§3.2 "Review process" — trang 59–68 (PDF 62–71): checklist trang 60–65'],
      ['sp4', '§4.1.2 Reviews p.80, the review process p.82 (PDF 95–97)', '§4.1.2 Reviews trang 80, quy trình review trang 82 (PDF 95–97)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════════ Lesson 2 — the worked review ═══════════════════════════ */
const L2 = {
  title: 'Lab 1.2 — Complete worked review of ReviewCode.java (29 defects, fixed code)|||Lab 1.2 — Review trọn vẹn ReviewCode.java (29 defect, code đã sửa)',
  slug: 'swt301-lab1-worked-review',
  type: 'VIDEO',
  description: 'sourcecode.pdf trang 1–2: đọc từng khối của ReviewCode.java, nhật ký 29 defect (dòng, mục checklist, mức độ, mô tả, cách sửa), 2 defect viết đúng mẫu nộp bài, code đã sửa — tất cả đã được biên dịch và chạy thật.',
  content: [
    bi(`<span class="eyebrow">Lab 1 · Lesson 1.2 · sourcecode.pdf pages 1–2</span>
<h2>The complete review of ReviewCode.java</h2>
<p class="lead">This is the answer key you can check your own Lab against. We first read the two pages of the class block by block, then log every defect in the format the Lab expects, then show the corrected class. Nothing here is guessed: the original was typed in verbatim (same 119 lines), compiled with <code>javac</code> and run; the fixed version was compiled, run and re-analysed.</p>
<div class="callout"><b>Learning objectives.</b> LO-3.2.4 Apply checklist-based reviewing to source code (K3) · LO-5.6.1 Write a defect report (K3) · LO-3.1.3 Explain the difference between static and dynamic testing — which defects you see by reading, which only by running (K2).</div>
<table>
<thead><tr><th>Severity used below</th><th>Meaning</th><th>Count</th></tr></thead>
<tbody>
<tr><td>Critical</td><td>does not compile, crashes at once, or is a security hole</td><td>3</td></tr>
<tr><td>Major</td><td>wrong result, resource leak or latent crash in normal use</td><td>5</td></tr>
<tr><td>Minor</td><td>maintainability / robustness problem, no visible failure yet</td><td>11</td></tr>
<tr><td>Trivial</td><td>style and convention</td><td>10</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Lab 1 · Bài 1.2 · sourcecode.pdf trang 1–2</span>
<h2>Review trọn vẹn ReviewCode.java</h2>
<p class="lead">Đây là đáp án để bạn đối chiếu bài Lab của mình. Trước tiên đọc hai trang của class theo từng khối, rồi log mọi defect theo đúng định dạng bài Lab yêu cầu, rồi đưa ra class đã sửa. Không có gì ở đây là đoán: bản gốc được gõ lại nguyên văn (đủ 119 dòng), biên dịch bằng <code>javac</code> và chạy thử; bản sửa được biên dịch, chạy và phân tích lại.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-3.2.4 Áp dụng review theo checklist cho mã nguồn (K3) · LO-5.6.1 Viết defect report (K3) · LO-3.1.3 Giải thích khác biệt giữa kiểm thử tĩnh và động — lỗi nào thấy được khi đọc, lỗi nào chỉ lộ khi chạy (K2).</div>
<table>
<thead><tr><th>Mức độ dùng bên dưới</th><th>Ý nghĩa</th><th>Số lượng</th></tr></thead>
<tbody>
<tr><td>Critical</td><td>không biên dịch, crash ngay, hoặc lỗ hổng bảo mật</td><td>3</td></tr>
<tr><td>Major</td><td>kết quả sai, rò tài nguyên hoặc crash tiềm ẩn khi dùng bình thường</td><td>5</td></tr>
<tr><td>Minor</td><td>vấn đề bảo trì / độ bền, chưa gây failure thấy được</td><td>11</td></tr>
<tr><td>Trivial</td><td>phong cách và quy ước</td><td>10</td></tr>
</tbody>
</table>`),
    walkHead('lab1-source', 1, 2, 'Here the "slides" are the two pages of sourcecode.pdf; line numbers below are the ones printed on the pages.', 'Ở đây "slide" là hai trang của sourcecode.pdf; số dòng bên dưới là số in trên trang.'),
    walk('lab1-source', [
      [1, 'ReviewCode.java, lines 1–66',
        `<p>The header shows the path <em>D:\\02.Work\\Lab211\\J1.S.P0065\\src\\controller\\ReviewCode.java</em> — a NetBeans project from LAB211, printed from the IDE. Reading it block by block:</p>
<ul>
<li><b>L1–4</b> the untouched NetBeans licence template comment (obsolete). <b>L5</b> <code>package controller;</code>. <b>L7–10</b> imports: two wildcards (<code>java.util.*</code>, <code>java.io.*</code>) and only two of the four <code>java.sql</code> types the code uses.</li>
<li><b>L12–14</b> <code>public class ReviewCode</code> with a single huge <code>main(String args[]) throws Exception</code> — everything happens in one method, which is itself a design smell (no testable units).</li>
<li><b>L18–21</b> <code>String name = null; if (name.equals("admin"))</code> — the first crash: a guaranteed <code>NullPointerException</code>.</li>
<li><b>L23–24</b> opens <code>file.txt</code> and reads one byte into <code>a</code>; the stream is never closed.</li>
<li><b>L26–28</b> constants 10 and 20, then an if/else squeezed on one line without braces.</li>
<li><b>L30–33</b> a while loop whose increment hides inside <code>println(i++)</code>.</li>
<li><b>L35–47</b> a list of three strings, and for each a 100-step <code>result += s + k</code> — String concatenation in a loop.</li>
<li><b>L49–58</b> an if-else-if ladder on <code>choice</code> with magic numbers — a textbook switch.</li>
<li><b>L60–66</b> <code>(x +y) * (x -y) / (x+y)</code> — division by a value that can be 0, ugly spacing, then two separate ifs that forget the zero case.</li>
</ul>`,
        `<p>Đầu trang ghi đường dẫn <em>D:\\02.Work\\Lab211\\J1.S.P0065\\src\\controller\\ReviewCode.java</em> — một project NetBeans của LAB211, in từ IDE. Đọc theo từng khối:</p>
<ul>
<li><b>L1–4</b> comment template license của NetBeans còn nguyên (rác). <b>L5</b> <code>package controller;</code>. <b>L7–10</b> import: hai import dạng * (<code>java.util.*</code>, <code>java.io.*</code>) và chỉ hai trong bốn kiểu <code>java.sql</code> mà code dùng.</li>
<li><b>L12–14</b> <code>public class ReviewCode</code> với một <code>main(String args[]) throws Exception</code> khổng lồ — mọi thứ dồn vào một method, bản thân đã là mùi thiết kế xấu (không có đơn vị nào test được).</li>
<li><b>L18–21</b> <code>String name = null; if (name.equals("admin"))</code> — crash đầu tiên: chắc chắn <code>NullPointerException</code>.</li>
<li><b>L23–24</b> mở <code>file.txt</code> và đọc một byte vào <code>a</code>; luồng không bao giờ đóng.</li>
<li><b>L26–28</b> hằng 10 và 20, rồi một if/else nhét trên một dòng không ngoặc.</li>
<li><b>L30–33</b> vòng while mà bước tăng nấp trong <code>println(i++)</code>.</li>
<li><b>L35–47</b> danh sách ba chuỗi, mỗi chuỗi nối <code>result += s + k</code> 100 lần — nối String trong vòng lặp.</li>
<li><b>L49–58</b> chuỗi if-else-if trên <code>choice</code> với số ma thuật — đúng kiểu cần switch.</li>
<li><b>L60–66</b> <code>(x +y) * (x -y) / (x+y)</code> — chia cho giá trị có thể bằng 0, khoảng trắng lộn xộn, rồi hai if rời nhau quên trường hợp bằng 0.</li>
</ul>`],
      [2, 'ReviewCode.java, lines 67–120',
        `<ul>
<li><b>L69–70</b> "// temp code, to be removed later" + a debug print — left in.</li>
<li><b>L72–74</b> <code>if (name == "user")</code> — reference comparison of Strings.</li>
<li><b>L76</b> <code>DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "123456")</code> — hard-coded credentials; <b>L77–78</b> <code>Statement</code>/<code>ResultSet</code> — not imported, so the file does not even compile; <b>L79–81</b> none of the three JDBC objects is ever closed. (In the PDF these two type names are printed in italics — NetBeans' rendering of symbols it could not resolve normally comes with a red underline; on paper only the italics survive.)</li>
<li><b>L83–89</b> <code>int result</code> summed with an index loop that calls <code>list.get(index)</code> twice, then never used.</li>
<li><b>L91</b> <code>if (a &gt; 100) a = 50;</code> — braces missing, magic numbers, dead store.</li>
<li><b>L93–98</b> a <code>BufferedReader</code> opened in a try without resources, <code>line</code> unused, <code>e.printStackTrace()</code> as the only handling.</li>
<li><b>L102–110</b> a call to <code>oldMethod()</code>, which is marked <code>@Deprecated</code> without saying what replaces it.</li>
<li><b>L112–117</b> <code>doStuff(int a, int b)</code> with the Javadoc "do something cool" — meaningless name, useless comment, never called.</li>
</ul>
<p><b>Static vs dynamic, seen on this page.</b> Reading found all 29 defects below. Running the (import-fixed) program shows exactly <em>one</em> failure — the NPE at line 19 — because execution stops there. That is the whole argument of LO-3.1.3: static testing finds defects directly, including ones on paths that a test would never reach.</p>`,
        `<ul>
<li><b>L69–70</b> "// temp code, to be removed later" + một lệnh in debug — vẫn còn.</li>
<li><b>L72–74</b> <code>if (name == "user")</code> — so sánh String theo tham chiếu.</li>
<li><b>L76</b> <code>DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "123456")</code> — hard-code thông tin đăng nhập; <b>L77–78</b> <code>Statement</code>/<code>ResultSet</code> — không import nên file thậm chí không biên dịch được; <b>L79–81</b> cả ba đối tượng JDBC không bao giờ được đóng. (Trong PDF hai tên kiểu này in nghiêng — NetBeans hiển thị ký hiệu không phân giải được thường kèm gạch đỏ; khi in ra giấy chỉ còn lại chữ nghiêng.)</li>
<li><b>L83–89</b> <code>int result</code> cộng dồn bằng vòng lặp chỉ số gọi <code>list.get(index)</code> hai lần, rồi không dùng.</li>
<li><b>L91</b> <code>if (a &gt; 100) a = 50;</code> — thiếu ngoặc, số ma thuật, gán chết.</li>
<li><b>L93–98</b> <code>BufferedReader</code> mở trong try không có resources, <code>line</code> không dùng, xử lý duy nhất là <code>e.printStackTrace()</code>.</li>
<li><b>L102–110</b> gọi <code>oldMethod()</code> vốn đánh dấu <code>@Deprecated</code> mà không nói dùng gì thay.</li>
<li><b>L112–117</b> <code>doStuff(int a, int b)</code> với Javadoc "do something cool" — tên vô nghĩa, comment vô dụng, không ai gọi.</li>
</ul>
<p><b>Tĩnh vs động, thấy ngay trên trang này.</b> Đọc code tìm ra đủ 29 defect bên dưới. Chạy chương trình (đã sửa import) chỉ lộ đúng <em>một</em> failure — NPE ở dòng 19 — vì chương trình dừng tại đó. Đó chính là lập luận của LO-3.1.3: kiểm thử tĩnh tìm defect trực tiếp, kể cả những defect nằm trên đường mà test không bao giờ chạy tới.</p>`],
    ]),
    bi(`<h2>🐞 The defect log (Word-file content)</h2>
<p>Columns = the five PE fields + the checklist item and severity (B = Basic sheet item, A = Advance sheet item). Any ten of these satisfy the exit criterion; a strong submission picks the Critical and Major ones first and covers different categories.</p>
${defTable(false)}
<h3>Two defects written exactly as the Word file / PE expects</h3>
<ul>
<li><b>Defect ID:</b> DF002 · <b>Defect Name:</b> Null pointer dereference · <b>Line Number:</b> 19 · <b>Defect Description:</b> <code>name</code> is initialised to null at line 18, so <code>name.equals("admin")</code> throws NullPointerException and the program stops. · <b>Fixing Solution:</b> use the null-safe form <code>if ("admin".equals(name))</code>. · <b>Checklist item / Severity:</b> Basic #1 Null Checks / Critical.</li>
<li><b>Defect ID:</b> DF004 · <b>Defect Name:</b> Hard-coded database credentials · <b>Line Number:</b> 76 · <b>Defect Description:</b> the JDBC URL, user "root" and password "123456" are written in the source, exposing the password to everyone with access to the code and tying the program to one machine. · <b>Fixing Solution:</b> read URL/user/password from a properties file or environment variables (<code>System.getenv("DB_PASSWORD")</code>) and remove them from the repository. · <b>Checklist item / Severity:</b> Advance 2.1, Basic #18 / Critical.</li>
</ul>
<h3>The evidence: compiler and run on the original</h3>
${RUN_ORIG}
<h3>The corrected class</h3>
<p>Every change is tagged with the defect it fixes. Behaviour is kept (same outputs, now through a logger); the DB part only runs when <code>DB_URL</code> is set.</p>
${FIXED}
${RUN_FIXED}
<p>Re-running the analysers on the fixed file: <code>javac -Xlint:all</code> 0 warnings; Eclipse ECJ with every optional warning enabled reports only its "non-externalized string" (i18n) warnings — the null, resource-leak and unused-value warnings are gone; Checkstyle (Sun rules) drops from 33 to 26 findings, all of the remaining ones pure style (line length &gt; 80, <code>final</code> parameters, Javadoc on constants, 4 magic numbers). Lesson 1.3 explains those tools.</p>`,
    `<h2>🐞 Nhật ký defect (nội dung file Word)</h2>
<p>Các cột = năm trường của đề PE + mục checklist và mức độ (B = mục sheet Basic, A = mục sheet Advance). Mười defect bất kỳ trong bảng là đạt exit criteria; bài tốt ưu tiên các defect Critical và Major và phủ nhiều nhóm lỗi khác nhau.</p>
${defTable(true)}
<h3>Hai defect viết đúng như file Word / đề PE yêu cầu</h3>
<ul>
<li><b>Defect ID:</b> DF002 · <b>Defect Name:</b> Null pointer dereference · <b>Line Number:</b> 19 · <b>Defect Description:</b> <code>name</code> được khởi tạo null ở dòng 18 nên <code>name.equals("admin")</code> ném NullPointerException và chương trình dừng. · <b>Fixing Solution:</b> dùng dạng an toàn với null <code>if ("admin".equals(name))</code>. · <b>Mục checklist / Mức độ:</b> Basic #1 Null Checks / Critical.</li>
<li><b>Defect ID:</b> DF004 · <b>Defect Name:</b> Hard-coded database credentials · <b>Line Number:</b> 76 · <b>Defect Description:</b> URL JDBC, user "root" và mật khẩu "123456" viết thẳng trong source, lộ mật khẩu cho mọi người có quyền xem code và trói chương trình vào một máy. · <b>Fixing Solution:</b> đọc URL/user/password từ file properties hoặc biến môi trường (<code>System.getenv("DB_PASSWORD")</code>) và xoá khỏi repository. · <b>Mục checklist / Mức độ:</b> Advance 2.1, Basic #18 / Critical.</li>
</ul>
<h3>Bằng chứng: biên dịch và chạy bản gốc</h3>
${RUN_ORIG}
<h3>Class đã sửa</h3>
<p>Mỗi thay đổi được gắn nhãn defect mà nó sửa. Hành vi giữ nguyên (cùng kết quả, nay qua logger); phần DB chỉ chạy khi có biến <code>DB_URL</code>.</p>
${FIXED}
${RUN_FIXED}
<p>Chạy lại các công cụ trên bản sửa: <code>javac -Xlint:all</code> 0 cảnh báo; Eclipse ECJ bật mọi cảnh báo tuỳ chọn chỉ còn cảnh báo "non-externalized string" (i18n) — các cảnh báo null, rò tài nguyên, giá trị không dùng đều hết; Checkstyle (bộ Sun) giảm từ 33 xuống 26, phần còn lại thuần phong cách (dòng &gt; 80 ký tự, tham số <code>final</code>, Javadoc cho hằng, 4 số ma thuật). Bài 1.3 giải thích các công cụ này.</p>`),
    bi(`<div class="pitfall"><b>Traps that lose Lab / PE marks.</b> (1) Reporting the <em>symptom line</em> instead of the defect line — the NPE "happens" in <code>equals</code>, but the defect is the null at 18–19. (2) Vague descriptions: "bad code at line 60" earns nothing; "division by (x+y) throws ArithmeticException when x = -y" earns the point. (3) A fix that is not code: "handle the exception better" → write the try-with-resources. (4) Calling a style issue a logic defect — keep the name honest (Naming Convention Error vs Logic Error). (5) Missing the compile error because the PDF "looks fine": always check that every type used is imported.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Severity is not the same as priority, and CVSS for the security ones.</b> Severity describes the technical impact (Critical … Trivial); priority is the business decision of when to fix (Chapter 5). The hard-coded password (DF004) is also a classic entry in the CWE catalogue (CWE-798 "Use of Hard-coded Credentials"), and the missing close calls are CWE-772 ("Missing Release of Resource after Effective Lifetime"); security teams score such findings with CVSS. Quoting the CWE number in a defect report makes it instantly searchable. <em>Outside the syllabus because CTFL does not cover vulnerability taxonomies.</em></div>`,
    `<div class="pitfall"><b>Những bẫy làm mất điểm Lab / PE.</b> (1) Báo <em>dòng lộ triệu chứng</em> thay vì dòng có defect — NPE "xảy ra" trong <code>equals</code>, nhưng defect là giá trị null ở dòng 18–19. (2) Mô tả mơ hồ: "code xấu ở dòng 60" không có điểm; "chia cho (x+y) ném ArithmeticException khi x = -y" mới có điểm. (3) Cách sửa không phải code: "xử lý exception tốt hơn" → hãy viết try-with-resources. (4) Gọi lỗi phong cách là lỗi logic — đặt tên cho đúng bản chất (Naming Convention Error khác Logic Error). (5) Bỏ sót lỗi biên dịch vì PDF "trông ổn": luôn kiểm tra mọi kiểu dùng tới đã được import.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Severity khác priority, và CVSS cho lỗi bảo mật.</b> Severity mô tả tác động kỹ thuật (Critical … Trivial); priority là quyết định nghiệp vụ sửa lúc nào (Chương 5). Mật khẩu hard-code (DF004) còn là mục kinh điển trong danh mục CWE (CWE-798 "Use of Hard-coded Credentials"), còn việc không đóng tài nguyên là CWE-772 ("Missing Release of Resource after Effective Lifetime"); nhóm bảo mật chấm điểm các phát hiện này bằng CVSS. Ghi số CWE trong defect report giúp tra cứu ngay lập tức. <em>Ngoài giáo trình vì CTFL không đề cập các hệ phân loại lỗ hổng.</em></div>`),
    books([
      ['fst4', 'Ch.3 §1 "Static techniques and the test process" — pp.75–78 (PDF 89–92); Ch.5 §6 "Defect management" — pp.190–195 (PDF 204–209)', 'Chương 3 §1 "Static techniques and the test process" — trang 75–78 (PDF 89–92); Chương 5 §6 "Defect management" — trang 190–195 (PDF 204–209)'],
      ['sp5', '§4.1 What can we analyze and test? (PDF 130); §4.6 Differences between static and dynamic testing (PDF 153); §6.4.3 Classifying failures and defects (PDF 290)', '§4.1 What can we analyze and test? (PDF 130); §4.6 Khác biệt giữa kiểm thử tĩnh và động (PDF 153); §6.4.3 Phân loại failure và defect (PDF 290)'],
      ['fst', '§3.3 "Static analysis by tools" — coding standards pp.69–71 (PDF 72–74)', '§3.3 "Static analysis by tools" — coding standards trang 69–71 (PDF 72–74)'],
      ['sp4', '§4.2 Static analysis p.95 (PDF 110), §6.6 Incident management p.192 (PDF 207)', '§4.2 Static analysis trang 95 (PDF 110), §6.6 Incident management trang 192 (PDF 207)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════════ Lesson 3 — static-analysis tools ═══════════════════════════ */
const TOOLRUN = `<pre><code>$ java -jar ecj-3.45.0.jar -17 -warn:all -proceedOnError ReviewCode.java   # imports fixed
WARNING line 19:  Null pointer access: The variable name can only be null at this location
WARNING line 23:  Resource leak: 'file' is never closed
WARNING line 35:  Redundant specification of type arguments &lt;String&gt;
WARNING line 76:  Potential resource leak: 'con' may not be closed
WARNING line 77:  Potential resource leak: 'st' may not be closed
WARNING line 78:  Potential resource leak: 'rs' may not be closed
WARNING line 83:  The value of the local variable result is not used
WARNING line 94:  Resource leak: 'br' is never closed
WARNING line 95:  The value of the local variable line is not used
(+ 28 "Non-externalized string literal" warnings, one per string literal)

$ java -jar checkstyle-9.3-all.jar -c /sun_checks.xml ReviewCode.java      (33 findings, excerpt)
ReviewCode.java:7:17: Using the '.*' form of import should be avoided - java.util.*. [AvoidStarImport]
ReviewCode.java:12:1: Utility classes should not have a public or default constructor. [HideUtilityClassConstructor]
ReviewCode.java:14:40: Array brackets at illegal position. [ArrayTypeStyle]
ReviewCode.java:26:17: '10' is a magic number. [MagicNumber]
ReviewCode.java:28:9: 'if' construct must use '{}'s. [NeedBraces]
ReviewCode.java:60:24: '+' is not followed by whitespace. [WhitespaceAround]
ReviewCode.java:76: Line is longer than 80 characters (found 105). [LineLength]
ReviewCode.java:91:9: 'if' construct must use '{}'s. [NeedBraces]
ReviewCode.java:115:35: Expected @param tag for 'a'. [JavadocMethod]

$ java -jar checkstyle-9.3-all.jar -c /google_checks.xml ReviewCode.java   (100 findings; 77 are
  Indentation because Google style uses 2 spaces; the others add e.g.)
ReviewCode.java:24:9: Distance between variable 'a' declaration and its first usage is 14, but allowed 3. [VariableDeclarationUsageDistance]
ReviewCode.java:28:78: Only one statement per line allowed. [OneStatementPerLine]</code></pre>`;

// [defect, javac, ECJ, Checkstyle, PMD rule (expected), SpotBugs pattern (expected), Sonar rule (expected)]
const MAP = [
  ['DF001 missing imports', '✔ error', '✔ error', '—', '—', '—', '(compile error)'],
  ['DF002 null dereference L19', '—', '✔ Null pointer access', '—', 'NullAssignment (partly)', 'NP_ALWAYS_NULL', 'S2259'],
  ['DF003 == on String L72', '—', '—', '—', 'UseEqualsToCompareStrings', 'ES_COMPARING_STRINGS_WITH_EQ', 'S4973'],
  ['DF004 hard-coded password L76', '—', '—', '—', '—', 'DMI_CONSTANT_DB_PASSWORD', 'hard-coded credentials rule'],
  ['DF005–007 resources not closed', '—', '✔ Resource leak ×5', '—', 'CloseResource', 'OBL_UNSATISFIED_OBLIGATION / ODR_OPEN_DATABASE_RESOURCE', 'S2095'],
  ['DF008 printStackTrace', '—', '—', '—', 'AvoidPrintStackTrace', '—', 'S1148'],
  ['DF014 += in loop', '—', '—', '—', 'UseStringBufferForStringAppends', 'SBSC_USE_STRINGBUFFER_CONCATENATION', 'S1643'],
  ['DF016 / DF013 dead stores', '—', '✔ value not used (L83, L95)', '—', 'UnusedAssignment / UnusedLocalVariable', 'DLS_DEAD_LOCAL_STORE', 'S1854 / S1481'],
  ['DF019 System.out', '—', '—', '—', 'SystemPrintln', '—', 'S106'],
  ['DF020 deprecated call', '— (same class)', '—', '—', '—', '—', 'S1874'],
  ['DF012/013 missing braces', '—', '—', '✔ NeedBraces', 'ControlStatementBraces', '—', 'S121'],
  ['DF022 wildcard imports', '—', '—', '✔ AvoidStarImport', '—', '—', '—'],
  ['DF024 utility class', '—', '—', '✔ HideUtilityClassConstructor', 'UseUtilityClass', '—', 'S1118'],
  ['DF025 String args[]', '—', '—', '✔ ArrayTypeStyle', '—', '—', 'S1197'],
  ['DF026 magic numbers', '—', '—', '✔ MagicNumber ×8', 'AvoidLiteralsInIfCondition (partly)', '—', 'S109'],
  ['DF029 ArrayList type, diamond', '—', '✔ redundant type args', '—', 'LooseCoupling, UseDiamondOperator', '—', 'S1319, S2293'],
];
const mapRows = MAP.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
const mapTable = (vi) => `<div class="table-wrap"><table><thead><tr>${(vi ? ['Defect', 'javac', 'ECJ', 'Checkstyle', 'PMD (dự kiến)', 'SpotBugs (dự kiến)', 'Sonar (dự kiến)'] : ['Defect', 'javac', 'ECJ', 'Checkstyle', 'PMD (expected)', 'SpotBugs (expected)', 'Sonar (expected)']).map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${mapRows}</tbody></table></div>`;

const L3 = {
  title: 'Lab 1.3 — Static analysis tools: PVS-Studio, SonarQube, ESLint, PMD, FindBugs/SpotBugs|||Lab 1.3 — Công cụ phân tích tĩnh: PVS-Studio, SonarQube, ESLint, PMD, FindBugs/SpotBugs',
  slug: 'swt301-lab1-static-analysis',
  type: 'VIDEO',
  description: 'Lab1_static_analysis slide 1–6: đề bài (5 loại defect log trên JIRA), 5 công cụ trên slide, cách cài/chạy trong NetBeans, IntelliJ, VS Code, Maven; kết quả chạy thật javac + ECJ + Checkstyle trên ReviewCode.java, bảng ánh xạ luật PMD/SpotBugs/Sonar, mẫu 5 issue JIRA.',
  content: [
    bi(`<span class="eyebrow">Lab 1 · Lesson 1.3 · Lab1_static_analysis slides 1–6</span>
<h2>Lab 1 (part 2): static analysis with tools</h2>
<p class="lead">Reviews are static testing done by people; <strong>static analysis</strong> is static testing done by tools. The second Lab 1 deck asks you to pick one analyser, run it on a real project, and log five <em>different kinds</em> of defect in JIRA. This lesson covers the five tools on the slides, how to install and run the relevant ones from your IDE, what their rules mean, and a real run on the Lab's <code>ReviewCode.java</code>.</p>
<div class="callout"><b>Learning objectives.</b> LO-3.1.2 Value of static testing (K2) · LO-6.1.1 Classify test tools — static analysis tools support static testing, mostly used by developers (K2) · LO-6.1.2 Benefits and risks of tool support, e.g. many false positives if the rule set is not tuned (K1) · LO-5.6.1 Write a defect report (K3).</div>
<table>
<thead><tr><th>What a tool finds well</th><th>What it cannot find</th></tr></thead>
<tbody>
<tr><td>Null dereferences on obvious paths, resource leaks, unused variables/imports, dead stores, unreachable code, coding-standard violations, known insecure patterns, complexity metrics</td><td>Wrong business logic ("VIP discount should be 20%"), missing requirements, bad names that are syntactically fine, a design that does not fit the problem — that is what people in reviews are for</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Lab 1 · Bài 1.3 · Lab1_static_analysis slide 1–6</span>
<h2>Lab 1 (phần 2): phân tích tĩnh bằng công cụ</h2>
<p class="lead">Review là kiểm thử tĩnh do con người làm; <strong>phân tích tĩnh (static analysis)</strong> là kiểm thử tĩnh do công cụ làm. Bộ slide thứ hai của Lab 1 yêu cầu chọn một công cụ, chạy trên một dự án thật, và log năm <em>loại</em> defect khác nhau lên JIRA. Bài này nói về năm công cụ trên slide, cách cài và chạy các công cụ phù hợp trong IDE, ý nghĩa các luật, và một lần chạy thật trên <code>ReviewCode.java</code> của bài Lab.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-3.1.2 Giá trị của kiểm thử tĩnh (K2) · LO-6.1.1 Phân loại công cụ test — công cụ phân tích tĩnh hỗ trợ kiểm thử tĩnh, chủ yếu do developer dùng (K2) · LO-6.1.2 Lợi ích và rủi ro của công cụ, vd quá nhiều false positive nếu không tinh chỉnh bộ luật (K1) · LO-5.6.1 Viết defect report (K3).</div>
<table>
<thead><tr><th>Công cụ tìm tốt</th><th>Công cụ không tìm được</th></tr></thead>
<tbody>
<tr><td>Null dereference trên đường rõ ràng, rò tài nguyên, biến/import không dùng, gán chết, code không tới được, vi phạm coding standard, mẫu mã không an toàn đã biết, số đo độ phức tạp</td><td>Sai logic nghiệp vụ ("VIP phải giảm 20%"), thiếu yêu cầu, tên xấu nhưng đúng cú pháp, thiết kế không hợp bài toán — đó là việc của con người khi review</td></tr>
</tbody>
</table>`),
    walkHead('lab1-static', 1, 6),
    walk('lab1-static', [
      [1, 'Lab 1: Static test',
        `<p>Content: study the static-analysis tools on the next slides <em>or any equivalent tool of your choice</em>; apply it to the source code of your SWP project, a web-programming project, a Lab, or any code you choose; record the results, analyse, evaluate and fix. <b>Exit criteria:</b> each student tests and records <b>5 different types of defect</b> on <b>JIRA Software</b> (the link is Atlassian's product page), and demos find → log → fix in class.</p>
<p>Read "5 different types" strictly: five null-pointer warnings are one type. Good spread: a reliability bug (null/resource), a security finding (hard-coded secret, SQL injection), a performance issue (string concatenation in a loop), a maintainability smell (dead code, duplicated code, complexity) and a convention violation (naming, braces). The worked JIRA issues at the end of this lesson follow exactly that spread.</p>`,
        `<p>Nội dung: nghiên cứu các công cụ phân tích tĩnh trong các slide sau <em>hoặc công cụ tương đương tự chọn</em>; áp dụng cho mã nguồn dự án môn SWP, lập trình web, bài Lab, hoặc code tự chọn; ghi nhận kết quả, phân tích, đánh giá và sửa lỗi. <b>Exit criteria:</b> mỗi sinh viên test và ghi nhận <b>5 loại defect khác nhau</b> trên <b>JIRA Software</b> (link là trang sản phẩm của Atlassian), và demo trên lớp tìm → log → sửa lỗi.</p>
<p>Hiểu "5 loại khác nhau" cho chặt: năm cảnh báo null pointer chỉ là một loại. Phân bổ tốt: một lỗi độ tin cậy (null/tài nguyên), một phát hiện bảo mật (bí mật hard-code, SQL injection), một vấn đề hiệu năng (nối chuỗi trong vòng lặp), một mùi bảo trì (code chết, code trùng lặp, độ phức tạp) và một vi phạm quy ước (đặt tên, ngoặc). Các issue JIRA mẫu ở cuối bài đi đúng cách phân bổ đó.</p>`],
      [2, 'PVS-Studio (viva64.com)',
        `<p>Screenshot of the PVS-Studio Analyzer page: "Static Code Analysis for C, C++, C# and Java", runs on 64-bit Windows, Linux and macOS, with counters "419 checked projects / 14 312 collected errors" (bugs the vendor found in open-source projects and blogs about). It is a <b>commercial</b> analyser (a free licence exists for students, open-source projects and via a trial key) with rule sets mapped to CWE, SEI CERT, MISRA and OWASP. For a Java student project it is rarely the easiest choice; it shines for C/C++ (Lab work in PRF192/PRO192 C code, embedded code).</p>`,
        `<p>Ảnh chụp trang PVS-Studio Analyzer: "Static Code Analysis for C, C++, C# and Java", chạy trên Windows, Linux, macOS 64-bit, kèm bộ đếm "419 dự án đã kiểm / 14 312 lỗi thu thập" (lỗi hãng tìm được trong các dự án mã nguồn mở và viết blog). Đây là công cụ <b>thương mại</b> (có giấy phép miễn phí cho sinh viên, dự án mã nguồn mở và key dùng thử) với bộ luật ánh xạ sang CWE, SEI CERT, MISRA, OWASP. Với dự án Java của sinh viên nó hiếm khi là lựa chọn dễ nhất; nó mạnh với C/C++ (code C ở PRF192, code nhúng).</p>`],
      [3, 'Code Quality and Code Security | SonarQube',
        `<p>The SonarQube home page ("Your teammate for Code Quality and Code Security", version 8.6 at the time of the screenshot) with a <b>Quality Gate: Passed</b> panel — Reliability A, 0 bugs; Security A. Two products: <b>SonarQube</b> (a server: projects are scanned in CI and results are shown on a dashboard with a quality gate that can fail the build) and <b>SonarLint</b>, now renamed <b>SonarQube for IDE</b> (a free plugin that analyses the file you are editing). Findings are classified as Bugs (reliability), Vulnerabilities / Security Hotspots, and Code Smells (maintainability), each with a severity. For Lab 1 the IDE plugin is the fastest route; for the SWP project, a SonarQube server (the free Community edition runs in Docker) gives a report you can screenshot for the demo.</p>`,
        `<p>Trang chủ SonarQube ("Your teammate for Code Quality and Code Security", bản 8.6 lúc chụp) với khung <b>Quality Gate: Passed</b> — Reliability A, 0 bug; Security A. Hai sản phẩm: <b>SonarQube</b> (máy chủ: dự án được quét trong CI, kết quả hiện trên dashboard với quality gate có thể đánh trượt bản build) và <b>SonarLint</b>, nay đổi tên <b>SonarQube for IDE</b> (plugin miễn phí phân tích file bạn đang sửa). Phát hiện được phân loại thành Bug (độ tin cậy), Vulnerability / Security Hotspot, và Code Smell (khả năng bảo trì), mỗi cái có mức độ. Với Lab 1 plugin IDE là đường nhanh nhất; với dự án SWP, một máy chủ SonarQube (bản Community miễn phí chạy bằng Docker) cho báo cáo để chụp màn hình khi demo.</p>`],
      [4, 'ESLint - Pluggable JavaScript linter',
        `<p>ESLint: "Find and fix problems in your JavaScript code" — <b>Find problems</b> (built into most editors, runs in CI), <b>Fix automatically</b> (syntax-aware fixes, not text find-and-replace), <b>Customize</b> (custom parsers, e.g. TypeScript, and your own rules). Use it if your chosen project is a web front-end or a Node.js back-end: <code>npm init @eslint/config@latest</code> creates the configuration, <code>npx eslint .</code> reports, <code>npx eslint . --fix</code> repairs what is safe. Typical findings: <code>no-unused-vars</code>, <code>eqeqeq</code> (<code>==</code> instead of <code>===</code> — the JavaScript cousin of DF003), <code>no-undef</code>.</p>`,
        `<p>ESLint: "Find and fix problems in your JavaScript code" — <b>Tìm vấn đề</b> (tích hợp sẵn trong hầu hết editor, chạy được trong CI), <b>Tự sửa</b> (sửa theo cú pháp, không phải tìm-thay văn bản), <b>Tuỳ biến</b> (parser riêng, vd TypeScript, và luật tự viết). Dùng nếu dự án bạn chọn là front-end web hoặc back-end Node.js: <code>npm init @eslint/config@latest</code> tạo cấu hình, <code>npx eslint .</code> báo lỗi, <code>npx eslint . --fix</code> tự sửa phần an toàn. Phát hiện hay gặp: <code>no-unused-vars</code>, <code>eqeqeq</code> (<code>==</code> thay vì <code>===</code> — anh em JavaScript của DF003), <code>no-undef</code>.</p>`],
      [5, 'PMD',
        `<p>PMD, "an extensible cross-language static code analyzer" (logo: "Don't shoot the messenger"; latest version on the screenshot 6.30.0, December 2020 — today PMD 7 is current). It works on <em>source code</em> with rules grouped into categories: Best Practices, Code Style, Design, Documentation, Error Prone, Multithreading, Performance, Security. It also ships <b>CPD</b>, the copy-paste detector for duplicated code. Rule names are self-explanatory: <code>UnusedLocalVariable</code>, <code>CloseResource</code>, <code>UseEqualsToCompareStrings</code>, <code>SystemPrintln</code>, <code>AvoidPrintStackTrace</code>, <code>UseStringBufferForStringAppends</code>, <code>ControlStatementBraces</code>.</p>`,
        `<p>PMD, "an extensible cross-language static code analyzer" (logo: "Don't shoot the messenger" — đừng bắn người đưa tin; bản mới nhất trên ảnh là 6.30.0, tháng 12/2020 — nay là PMD 7). Nó làm việc trên <em>mã nguồn</em> với luật chia nhóm: Best Practices, Code Style, Design, Documentation, Error Prone, Multithreading, Performance, Security. Kèm theo <b>CPD</b>, bộ phát hiện code sao chép. Tên luật tự giải thích: <code>UnusedLocalVariable</code>, <code>CloseResource</code>, <code>UseEqualsToCompareStrings</code>, <code>SystemPrintln</code>, <code>AvoidPrintStackTrace</code>, <code>UseStringBufferForStringAppends</code>, <code>ControlStatementBraces</code>.</p>`],
      [6, 'FindBugs™ - Find Bugs in Java Programs (sourceforge.net)',
        `<p>The FindBugs home page from the University of Maryland: static analysis to look for bugs in Java code, LGPL, "current version 3.0.1, released 6 March 2015", requires JRE 1.7+ and analyses programs compiled for Java 1.0–1.8; the list shows new bug patterns such as <code>RANGE_ARRAY_INDEX</code>. Two facts to add: FindBugs analyses <b>bytecode</b> (.class files), not source; and it is <b>abandoned</b> — it cannot read class files from modern JDKs. Its maintained successor is <b>SpotBugs</b>, with the same bug-pattern names (<code>NP_ALWAYS_NULL</code>, <code>ES_COMPARING_STRINGS_WITH_EQ</code>, <code>DMI_CONSTANT_DB_PASSWORD</code>, <code>OBL_UNSATISFIED_OBLIGATION</code>) and the FindSecBugs plugin for security. Use SpotBugs whenever the slide says FindBugs.</p>`,
        `<p>Trang chủ FindBugs của Đại học Maryland: phân tích tĩnh tìm bug trong code Java, giấy phép LGPL, "phiên bản hiện tại 3.0.1, phát hành 6/3/2015", cần JRE 1.7+ và phân tích chương trình biên dịch cho Java 1.0–1.8; danh sách có các bug pattern mới như <code>RANGE_ARRAY_INDEX</code>. Hai điều cần bổ sung: FindBugs phân tích <b>bytecode</b> (file .class), không phải source; và nó đã <b>bị bỏ</b> — không đọc được file class của JDK hiện đại. Bản kế nhiệm được duy trì là <b>SpotBugs</b>, giữ nguyên tên bug pattern (<code>NP_ALWAYS_NULL</code>, <code>ES_COMPARING_STRINGS_WITH_EQ</code>, <code>DMI_CONSTANT_DB_PASSWORD</code>, <code>OBL_UNSATISFIED_OBLIGATION</code>) và có plugin FindSecBugs cho bảo mật. Slide ghi FindBugs thì hãy dùng SpotBugs.</p>`],
    ]),
    bi(`<h2>🛠️ Installing and running a Java analyser, step by step</h2>
<table>
<thead><tr><th>IDE / tool</th><th>Steps</th></tr></thead>
<tbody>
<tr><td><b>IntelliJ IDEA</b></td><td><b>SonarQube for IDE:</b> Settings → Plugins → Marketplace → search "SonarQube for IDE" (formerly SonarLint) → Install → restart. Findings appear while you type; for a whole project: right-click the project → <em>SonarQube → Analyze with SonarQube</em>. <b>PMD:</b> Marketplace plugin "PMD" (PMD for IDEA) → right-click a file → <em>Run PMD → Pre Defined → All</em>. <b>SpotBugs:</b> plugin "SpotBugs" → SpotBugs tool window → <em>Analyze Project Files</em> (compile first — it reads bytecode). <b>Checkstyle:</b> plugin "CheckStyle-IDEA" → choose "Sun Checks" or "Google Checks" in Settings → Tools → Checkstyle. Built-in: <em>Code → Inspect Code…</em> runs IntelliJ's own inspections.</td></tr>
<tr><td><b>VS Code</b></td><td>Install "Extension Pack for Java", then "SonarQube for IDE" (SonarSource; needs a Java 17+ runtime) — issues show in the <em>Problems</em> panel with the rule key and a "Show rule description" action. "Checkstyle for Java" adds Checkstyle with Sun/Google configurations. PMD and SpotBugs are simplest from the command line or Maven (below).</td></tr>
<tr><td><b>NetBeans</b></td><td>Built-in Java hints (Tools → Options → Editor → Hints) run on the fly; <em>Source → Inspect…</em> runs them on a file or project. Older NetBeans (8.x) also offered FindBugs inside <em>Inspect</em>; for PMD use a plugin such as EasyPmd from the plugin portal, or run PMD/SpotBugs through Maven if the project is a Maven project.</td></tr>
<tr><td><b>Maven (any IDE)</b></td><td>Add the plugins to <em>pom.xml</em> and run <code>mvn pmd:check</code> (PMD), <code>mvn checkstyle:check</code>, <code>mvn spotbugs:check</code> (spotbugs-maven-plugin) — or <code>mvn sonar:sonar</code> against a SonarQube server with a project token. This is also how CI runs them.</td></tr>
<tr><td><b>Command line</b></td><td>PMD 7: <code>pmd check -d src -R rulesets/java/quickstart.xml -f text</code>. Checkstyle: <code>java -jar checkstyle-&lt;ver&gt;-all.jar -c /sun_checks.xml MyFile.java</code>. Eclipse compiler warnings: <code>java -jar ecj.jar -17 -warn:all MyFile.java</code>.</td></tr>
</tbody>
</table>
<h2>🔬 Worked result — real runs on ReviewCode.java</h2>
<p><b>Honest note:</b> PMD, SpotBugs, SonarLint and PVS-Studio were not installed on the machine used to prepare this lesson, so they were <em>not</em> run. What <em>was</em> run, without installing anything: <code>javac</code> (JDK 21), the <b>Eclipse compiler ECJ 3.45</b> (the engine behind Eclipse's warnings — its jar ships inside a VS Code Java extension) and <b>Checkstyle 9.3</b> (the jar inside the "Checkstyle for Java" extension). Output, lightly trimmed:</p>
${TOOLRUN}
<p><b>Reading the results.</b> javac -Xlint:all found only the two compile errors (it has no "unused" or null analysis, and it does not warn about a deprecated method called from its own class). ECJ found the null dereference, all five resource leaks and both dead values — the reliability core of the review. Checkstyle found the conventions. The "non-externalized string" warnings are ECJ's i18n rule (every literal should come from a resource bundle) — noise for a console exercise, which is exactly the "false positives if not tuned" risk of LO-6.1.2: switch that rule off rather than drowning in it.</p>
<h3>Which defect of Lesson 1.2 each tool reports</h3>
<p>✔ = seen in the real runs above. PMD/SpotBugs/Sonar columns are the rules those tools would be expected to raise (from their rule documentation), <em>not</em> observed output.</p>
${mapTable(false)}
<p><b>What no tool reported:</b> the division by (x+y) (DF010 — the values are constants, so the analyser sees no zero), the missing zero case (DF011), the meaningless name <code>doStuff</code> and its useless Javadoc (DF021 — Checkstyle only complains about missing @param), the debug comment (DF018). Human review still matters.</p>`,
    `<h2>🛠️ Cài và chạy công cụ phân tích Java, từng bước</h2>
<table>
<thead><tr><th>IDE / công cụ</th><th>Các bước</th></tr></thead>
<tbody>
<tr><td><b>IntelliJ IDEA</b></td><td><b>SonarQube for IDE:</b> Settings → Plugins → Marketplace → tìm "SonarQube for IDE" (tên cũ SonarLint) → Install → khởi động lại. Phát hiện hiện ngay khi gõ; cho cả dự án: chuột phải dự án → <em>SonarQube → Analyze with SonarQube</em>. <b>PMD:</b> plugin "PMD" (PMD for IDEA) → chuột phải file → <em>Run PMD → Pre Defined → All</em>. <b>SpotBugs:</b> plugin "SpotBugs" → cửa sổ SpotBugs → <em>Analyze Project Files</em> (phải biên dịch trước — nó đọc bytecode). <b>Checkstyle:</b> plugin "CheckStyle-IDEA" → chọn "Sun Checks" hoặc "Google Checks" trong Settings → Tools → Checkstyle. Có sẵn: <em>Code → Inspect Code…</em> chạy bộ inspection của IntelliJ.</td></tr>
<tr><td><b>VS Code</b></td><td>Cài "Extension Pack for Java", rồi "SonarQube for IDE" (SonarSource; cần Java 17+) — lỗi hiện trong panel <em>Problems</em> kèm mã luật và nút "Show rule description". "Checkstyle for Java" thêm Checkstyle với cấu hình Sun/Google. PMD và SpotBugs chạy đơn giản nhất bằng dòng lệnh hoặc Maven (bên dưới).</td></tr>
<tr><td><b>NetBeans</b></td><td>Java hints có sẵn (Tools → Options → Editor → Hints) chạy khi gõ; <em>Source → Inspect…</em> chạy cho một file hoặc cả dự án. NetBeans cũ (8.x) có FindBugs trong <em>Inspect</em>; với PMD dùng plugin như EasyPmd trên plugin portal, hoặc chạy PMD/SpotBugs qua Maven nếu là dự án Maven.</td></tr>
<tr><td><b>Maven (mọi IDE)</b></td><td>Thêm plugin vào <em>pom.xml</em> và chạy <code>mvn pmd:check</code> (PMD), <code>mvn checkstyle:check</code>, <code>mvn spotbugs:check</code> (spotbugs-maven-plugin) — hoặc <code>mvn sonar:sonar</code> tới máy chủ SonarQube với token dự án. CI cũng chạy chúng như vậy.</td></tr>
<tr><td><b>Dòng lệnh</b></td><td>PMD 7: <code>pmd check -d src -R rulesets/java/quickstart.xml -f text</code>. Checkstyle: <code>java -jar checkstyle-&lt;ver&gt;-all.jar -c /sun_checks.xml MyFile.java</code>. Cảnh báo của trình biên dịch Eclipse: <code>java -jar ecj.jar -17 -warn:all MyFile.java</code>.</td></tr>
</tbody>
</table>
<h2>🔬 Kết quả có lời giải — chạy thật trên ReviewCode.java</h2>
<p><b>Nói thật:</b> PMD, SpotBugs, SonarLint và PVS-Studio không có sẵn trên máy dùng để soạn bài, nên <em>không</em> được chạy. Những gì <em>đã</em> chạy mà không cài thêm gì: <code>javac</code> (JDK 21), <b>trình biên dịch Eclipse ECJ 3.45</b> (động cơ sinh cảnh báo của Eclipse — jar của nó nằm sẵn trong một extension Java của VS Code) và <b>Checkstyle 9.3</b> (jar trong extension "Checkstyle for Java"). Kết quả, đã rút gọn:</p>
${TOOLRUN}
<p><b>Đọc kết quả.</b> javac -Xlint:all chỉ ra hai lỗi biên dịch (nó không phân tích biến thừa hay null, và không cảnh báo method deprecated gọi từ chính class của nó). ECJ tìm ra null dereference, cả năm chỗ rò tài nguyên và hai giá trị không dùng — phần lõi độ tin cậy của buổi review. Checkstyle tìm ra các vi phạm quy ước. Các cảnh báo "non-externalized string" là luật i18n của ECJ (mọi literal nên lấy từ resource bundle) — nhiễu với bài console, đúng rủi ro "false positive nếu không tinh chỉnh" của LO-6.1.2: hãy tắt luật đó thay vì chìm trong nó.</p>
<h3>Defect nào của Bài 1.2 được công cụ nào báo</h3>
<p>✔ = thấy trong các lần chạy thật ở trên. Cột PMD/SpotBugs/Sonar là luật mà các công cụ đó <em>được dự kiến</em> sẽ báo (theo tài liệu luật của chúng), <em>không phải</em> kết quả quan sát được.</p>
${mapTable(true)}
<p><b>Không công cụ nào báo:</b> phép chia cho (x+y) (DF010 — giá trị là hằng nên công cụ không thấy số 0), trường hợp bằng 0 bị bỏ (DF011), tên vô nghĩa <code>doStuff</code> và Javadoc vô dụng (DF021 — Checkstyle chỉ phàn nàn thiếu @param), comment debug (DF018). Review của con người vẫn cần thiết.</p>`),
    bi(`<h2>🧾 Logging five defect types in JIRA (worked example)</h2>
<p>Create a Jira Software project (free plan, Scrum or Kanban template, or a "Bug tracking" template). For each finding: <em>Create</em> → Issue type <b>Bug</b> → fill the fields below. Attach a screenshot of the analyser panel as evidence; after fixing, move the issue to Done and paste the fixed code in a comment — that is your "find → log → fix" demo.</p>
<table>
<thead><tr><th>Key</th><th>Summary</th><th>Type of defect</th><th>Priority</th><th>Description (steps / evidence / expected)</th></tr></thead>
<tbody>
<tr><td>LAB1-1</td><td>NullPointerException in ReviewCode.main at line 19</td><td>Reliability — null dereference</td><td>Highest</td><td>ECJ: "Null pointer access: the variable name can only be null" (L19). Running the program crashes at start. Expected: null-safe comparison.</td></tr>
<tr><td>LAB1-2</td><td>JDBC password hard-coded in ReviewCode line 76</td><td>Security — hard-coded credential (CWE-798)</td><td>Highest</td><td>Password "123456" and user "root" in source. Expected: read from environment/properties; rotate the leaked password.</td></tr>
<tr><td>LAB1-3</td><td>FileInputStream, BufferedReader and JDBC objects never closed</td><td>Reliability — resource leak</td><td>High</td><td>ECJ resource-leak warnings at L23, L76, L77, L78, L94. Expected: try-with-resources.</td></tr>
<tr><td>LAB1-4</td><td>String concatenation with += inside nested loop (L42–45)</td><td>Performance</td><td>Medium</td><td>300 temporary String objects per run. Expected: StringBuilder.</td></tr>
<tr><td>LAB1-5</td><td>Coding-convention violations: missing braces, magic numbers, wildcard imports</td><td>Convention / maintainability</td><td>Low</td><td>Checkstyle NeedBraces (L28, L91), MagicNumber ×8, AvoidStarImport (L7–8). Expected: code conforms to the team checklist.</td></tr>
</tbody>
</table>
<p>Other useful fields: <b>Environment</b> (JDK 21, IntelliJ + SonarQube for IDE), <b>Labels</b> (<code>static-analysis</code>, <code>lab1</code>), <b>Components</b> (the module), <b>Assignee</b> (yourself for the fix), <b>Affects version</b>. Keep the summary short and specific (what + where) — the same rule as Chapter 5's defect report.</p>
<div class="pitfall"><b>Trap in the FE:</b> "Static analysis tools are mainly used by testers to execute the code" — false twice. They do <em>not</em> execute the code, and they are typically used by <b>developers</b> (before and during component and integration testing), while review tools support the whole team. Also remember: static analysis finds <em>defects</em>, not failures.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How analysers "know" line 19 is null.</b> ECJ, SpotBugs and Sonar's symbolic execution build a <em>control-flow graph</em> of the method and propagate facts along it (data-flow analysis): after <code>name = null</code> the fact "name is null" flows to line 19 with no assignment in between, so the dereference must fail. The same machinery computes "defined but never used" (dead stores) and the def-use pairs of data-flow testing that Spillner describes. Because proving facts about arbitrary programs is undecidable (Rice's theorem), every analyser trades <em>false positives</em> against <em>false negatives</em>. <em>Outside the syllabus because CTFL 2018 only lists what static analysis finds, not how.</em></div>`,
    `<h2>🧾 Log năm loại defect lên JIRA (ví dụ có lời giải)</h2>
<p>Tạo một project Jira Software (gói miễn phí, template Scrum/Kanban hoặc "Bug tracking"). Với mỗi phát hiện: <em>Create</em> → Issue type <b>Bug</b> → điền các trường dưới đây. Đính kèm ảnh chụp panel của công cụ làm bằng chứng; sửa xong thì chuyển issue sang Done và dán code đã sửa vào comment — đó là phần demo "tìm → log → sửa" của bạn.</p>
<table>
<thead><tr><th>Key</th><th>Summary</th><th>Loại defect</th><th>Priority</th><th>Mô tả (bước / bằng chứng / mong đợi)</th></tr></thead>
<tbody>
<tr><td>LAB1-1</td><td>NullPointerException in ReviewCode.main at line 19</td><td>Độ tin cậy — null dereference</td><td>Highest</td><td>ECJ: "Null pointer access: the variable name can only be null" (L19). Chạy chương trình crash ngay. Mong đợi: so sánh an toàn với null.</td></tr>
<tr><td>LAB1-2</td><td>JDBC password hard-coded in ReviewCode line 76</td><td>Bảo mật — hard-code thông tin đăng nhập (CWE-798)</td><td>Highest</td><td>Mật khẩu "123456" và user "root" trong source. Mong đợi: đọc từ biến môi trường/properties; đổi mật khẩu đã lộ.</td></tr>
<tr><td>LAB1-3</td><td>FileInputStream, BufferedReader and JDBC objects never closed</td><td>Độ tin cậy — rò tài nguyên</td><td>High</td><td>Cảnh báo resource leak của ECJ ở L23, L76, L77, L78, L94. Mong đợi: try-with-resources.</td></tr>
<tr><td>LAB1-4</td><td>String concatenation with += inside nested loop (L42–45)</td><td>Hiệu năng</td><td>Medium</td><td>300 String tạm mỗi lần chạy. Mong đợi: StringBuilder.</td></tr>
<tr><td>LAB1-5</td><td>Coding-convention violations: missing braces, magic numbers, wildcard imports</td><td>Quy ước / bảo trì</td><td>Low</td><td>Checkstyle NeedBraces (L28, L91), MagicNumber ×8, AvoidStarImport (L7–8). Mong đợi: code tuân thủ checklist của nhóm.</td></tr>
</tbody>
</table>
<p>Các trường hữu ích khác: <b>Environment</b> (JDK 21, IntelliJ + SonarQube for IDE), <b>Labels</b> (<code>static-analysis</code>, <code>lab1</code>), <b>Components</b> (module), <b>Assignee</b> (chính bạn để sửa), <b>Affects version</b>. Summary ngắn và cụ thể (cái gì + ở đâu) — đúng quy tắc defect report của Chương 5.</p>
<div class="pitfall"><b>Bẫy trong đề FE:</b> "Công cụ phân tích tĩnh chủ yếu do tester dùng để chạy code" — sai hai lần. Chúng <em>không</em> chạy code, và thường do <b>developer</b> dùng (trước và trong component/integration testing), còn công cụ review hỗ trợ cả nhóm. Nhớ thêm: phân tích tĩnh tìm <em>defect</em>, không phải failure.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Công cụ "biết" dòng 19 là null bằng cách nào.</b> ECJ, SpotBugs và symbolic execution của Sonar dựng <em>đồ thị luồng điều khiển</em> của method và lan truyền các sự kiện theo nó (phân tích luồng dữ liệu): sau <code>name = null</code> sự kiện "name là null" chảy tới dòng 19 mà không có phép gán nào ở giữa, nên phép gọi chắc chắn hỏng. Cùng cơ chế đó tính ra "định nghĩa mà không dùng" (gán chết) và các cặp def-use của data-flow testing mà Spillner mô tả. Vì chứng minh tính chất của chương trình bất kỳ là bài toán không quyết định được (định lý Rice), mọi công cụ phải đánh đổi giữa <em>false positive</em> và <em>false negative</em>. <em>Ngoài giáo trình vì CTFL 2018 chỉ nêu phân tích tĩnh tìm được gì, không nêu bằng cách nào.</em></div>`),
    books([
      ['fst4', 'Ch.3 §1 "Static techniques and the test process" pp.75–78 (PDF 89–92); Ch.6 §1 "Test tool considerations" — tool classification incl. static analysis tools pp.203–221 (PDF 217–235)', 'Chương 3 §1 trang 75–78 (PDF 89–92); Chương 6 §1 "Test tool considerations" — phân loại công cụ, gồm công cụ phân tích tĩnh, trang 203–221 (PDF 217–235)'],
      ['fst', '§3.3 "Static analysis by tools" — pp.69–73 (PDF 72–76): coding standards, code metrics, code structure', '§3.3 "Static analysis by tools" — trang 69–73 (PDF 72–76): coding standard, số đo code, cấu trúc code'],
      ['sp4', '§4.2 Static analysis p.95: compiler as analysis tool p.97, data-flow analysis p.98, control-flow analysis p.99, metrics p.100 (PDF 110–115)', '§4.2 Static analysis trang 95: trình biên dịch trang 97, phân tích luồng dữ liệu trang 98, luồng điều khiển trang 99, số đo trang 100 (PDF 110–115)'],
      ['sp5', '§4.2 Static test techniques (PDF 131); Ch.7 Test tools — static-analysis tools (PDF 310–311)', '§4.2 Static test techniques (PDF 131); Chương 7 Test tools — công cụ phân tích tĩnh (PDF 310–311)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════════ Lesson 4 — Lab 1 → PE Question 1 ═══════════════════════════ */
const PE_CODE = `<pre><code> 1  public class fileProcessor {
 2      private BufferedReader reader;
 3      private String FilePath;
 4      public void openFile(String filePath) {
 5          try {
 6              reader = new BufferedReader(new FileReader(filePath));
 7              if (filePath != null || filePath.isEmpty()) {
 8                  System.out.println("File opened successfully");
 9              }
10          } catch (IOException e) {
11              System.out.println("Error opening file: " + e.getMessage());
12          }
13      }
14      public void readFile() {
15          String line;
16          try {
17              while ((line = reader.readLine()) != null) {
18                  System.out.println(line);
19              }
20          } catch (IOException e) {
21              System.out.println("Error reading file: " + e.getMessage());
22          } finally {
23              reader.close();
24          }
25      }
26      public void processFile() {
27          openFile(FilePath);
28          System.out.println("Processing file...");
29          if (FilePath == null) {
30              System.out.println("Invalid file path");
31              return;
32          }
33          readFile();
34      }
35  }</code></pre>`;
const PE_RUN = `<pre><code>$ javac fileProcessor.java            # with "import java.io.*;" added on top
fileProcessor.java:24: error: unreported exception IOException; must be caught or declared to be thrown
            reader.close();                 (line 24 = paper line 23 + the added import line)

# with close() wrapped so it compiles, calling new fileProcessor().processFile():
Exception in thread "main" java.lang.NullPointerException
	at java.base/java.io.FileInputStream.&lt;init&gt;(FileInputStream.java:144)
	at java.base/java.io.FileReader.&lt;init&gt;(FileReader.java:60)
	...   (thrown at paper line 6: FilePath was never assigned)

# the corrected FileProcessor (below) on three inputs:
Processing file...
line 1
line 2
Invalid file path
Processing file...
Error reading file: missing.txt (No such file or directory)</code></pre>`;
const PE_FIX = `<pre><code>import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileProcessor {                       // DF001
    private final String filePath;                 // DF002

    public FileProcessor(String filePath) {
        this.filePath = filePath;
    }

    public void processFile() {
        if (filePath == null || filePath.isEmpty()) {          // DF003, DF006
            System.err.println("Invalid file path");
            return;
        }
        System.out.println("Processing file...");
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) { // DF004, DF005, DF007
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());           // DF008
        }
    }
}</code></pre>`;

const L4 = {
  title: 'Lab 1.4 — From Lab 1 to PE Question 1: the FALL24 fileProcessor, fully answered|||Lab 1.4 — Từ Lab 1 tới Câu 1 đề PE: fileProcessor của FALL24, giải trọn vẹn',
  slug: 'swt301-lab1-pe-question1',
  type: 'VIDEO',
  description: 'Ảnh 1.jpg (đề PE cuối kỳ FALL24): Câu 1 "tìm 6 defect có số dòng" — lời giải đầy đủ theo mẫu Defect ID/Name/Line/Description/Fix, đã biên dịch và chạy kiểm chứng; chiến lược 20 phút; liên hệ Câu 2, Câu 3.',
  content: [
    bi(`<span class="eyebrow">Lab 1 · Lesson 1.4 · 1.jpg (SWT301 FALL24 final PE)</span>
<h2>How Lab 1 prepares PE Question 1</h2>
<p class="lead">Every recent SWT301 practical exam opens with a code-review question: "this class contains N defects (usually six) related to code standards, logic and best practices — identify each with a line number and a fix". It is worth 3 of the 10 points. Lab 1 is the rehearsal: same activity, same report format. The folder of Lab 1 even contains the full FALL24 paper as <em>1.jpg</em>; here it is, followed by a complete, verified answer to its Question 1.</p>
<div class="callout"><b>Learning objectives.</b> LO-3.2.4 Apply a review technique (K3) under exam conditions · LO-5.6.1 Write defect reports (K3). The whole PE (all papers, time plan, Q2 and Q3 solutions) is covered in the PE section of this course; this lesson concentrates on Question 1.</div>
<table>
<thead><tr><th>Lab 1 skill</th><th>PE Question 1 counterpart</th></tr></thead>
<tbody>
<tr><td>Go through the checklist item by item</td><td>Scan the class once per category: naming → null/logic → exceptions/resources → clean-up/format</td></tr>
<tr><td>Defect ID in the checklist, Word file with 6 fields</td><td>The paper's template: Defect ID, Defect Name, Line Number, Defect Description, Fixing Solution</td></tr>
<tr><td>≥ 10 defects</td><td>Exactly the number asked (six) — the best six, plus one or two spares if time allows</td></tr>
<tr><td>Static analysis tool</td><td>FALL24 allows an IDE: paste the class in NetBeans/IntelliJ and let the red underlines and warnings confirm your findings</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Lab 1 · Bài 1.4 · 1.jpg (đề PE cuối kỳ SWT301 FALL24)</span>
<h2>Lab 1 chuẩn bị cho Câu 1 đề PE thế nào</h2>
<p class="lead">Mọi đề thi thực hành SWT301 gần đây đều mở đầu bằng câu review code: "class này có N defect (thường là sáu) về chuẩn code, logic và best practice — hãy chỉ ra từng defect kèm số dòng và cách sửa". Câu này chiếm 3/10 điểm. Lab 1 chính là buổi tập dượt: cùng hoạt động, cùng mẫu báo cáo. Thư mục Lab 1 thậm chí chứa trọn đề FALL24 dưới tên <em>1.jpg</em>; dưới đây là đề, tiếp theo là lời giải đầy đủ, đã kiểm chứng, cho Câu 1.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-3.2.4 Áp dụng kỹ thuật review (K3) trong điều kiện thi · LO-5.6.1 Viết defect report (K3). Toàn bộ đề PE (các đề, cách chia thời gian, lời giải Câu 2 và Câu 3) nằm trong phần PE của khoá học; bài này tập trung vào Câu 1.</div>
<table>
<thead><tr><th>Kỹ năng ở Lab 1</th><th>Tương ứng ở Câu 1 đề PE</th></tr></thead>
<tbody>
<tr><td>Đi hết checklist từng mục</td><td>Quét class một lượt cho mỗi nhóm: đặt tên → null/logic → exception/tài nguyên → dọn dẹp/format</td></tr>
<tr><td>Defect ID trong checklist, file Word 6 nội dung</td><td>Mẫu trong đề: Defect ID, Defect Name, Line Number, Defect Description, Fixing Solution</td></tr>
<tr><td>≥ 10 defect</td><td>Đúng số đề hỏi (sáu) — sáu cái tốt nhất, thêm một hai cái dự phòng nếu còn thời gian</td></tr>
<tr><td>Công cụ phân tích tĩnh</td><td>FALL24 cho dùng IDE: dán class vào NetBeans/IntelliJ để gạch đỏ và cảnh báo xác nhận phát hiện của bạn</td></tr>
</tbody>
</table>`),
    slide('lab1-img', 1, 'SWT301 FALL24 — The final PE (whole paper, blank answer space removed)',
      `<p><b>The paper, top to bottom.</b> "SWT301 FALL24 – The final PE, duration 85 minutes". Instructions: proficiency in at least one programming language is needed; IDEs like NetBeans or IntelliJ IDEA <em>may</em> be used; the whole answer goes into <b>a single Word document</b>, no other format accepted.</p>
<ul>
<li><b>Question 1 (3 points)</b> — the defect-report template (Lesson 1.1, slide 2) and the 35-line class <code>fileProcessor</code>: answered completely below.</li>
<li><b>Question 2 (5 points)</b> — <code>OrderCalculator.calculateTotalPrice(double[] itemPrices, String customerType, boolean isVIP, String discountCode)</code>: design JUnit tests with EP and BVA on the inputs and 100% branch coverage; a partially completed <code>OrderCalculatorTest</code> is given (one expected-exception test, one VIP test asserting 240.0), and each test needs a one-line summary "ID; Test for …; Input parameter …; Expected result …".</li>
<li><b>Question 3 (2 points)</b> — use case "Place an Order" of an online shopping system (main scenario of 8 steps, alternates A1 empty cart, A2 invalid discount code, A3 payment failure; products A $50, B $30, C $20; codes SAVE10 10%, WELCOME5 5% for new customers): write functional black-box test cases covering normal, alternative and exception flows, each with ID, description, preconditions, steps with test data, expected result and a note NF / AL / EX. An example TC001 is given.</li>
</ul>
<p>The image is the original 1.jpg with only the empty answer space between questions removed; no text was changed.</p>`,
      `<p><b>Đề thi, từ trên xuống.</b> "SWT301 FALL24 – The final PE, thời gian 85 phút". Hướng dẫn: cần thành thạo ít nhất một ngôn ngữ lập trình; <em>được</em> dùng IDE như NetBeans hay IntelliJ IDEA; toàn bộ bài làm nộp trong <b>một file Word duy nhất</b>, không nhận định dạng khác.</p>
<ul>
<li><b>Câu 1 (3 điểm)</b> — mẫu báo cáo defect (Bài 1.1, slide 2) và class 35 dòng <code>fileProcessor</code>: giải đầy đủ bên dưới.</li>
<li><b>Câu 2 (5 điểm)</b> — <code>OrderCalculator.calculateTotalPrice(double[] itemPrices, String customerType, boolean isVIP, String discountCode)</code>: thiết kế test JUnit dùng EP và BVA cho các tham số và đạt 100% branch coverage; cho sẵn một <code>OrderCalculatorTest</code> dở dang (một test mong đợi exception, một test VIP kiểm 240.0), mỗi test cần một dòng tóm tắt "ID; Test for …; Input parameter …; Expected result …".</li>
<li><b>Câu 3 (2 điểm)</b> — use case "Place an Order" của hệ thống mua hàng online (kịch bản chính 8 bước, nhánh phụ A1 giỏ trống, A2 mã giảm giá sai, A3 thanh toán lỗi; sản phẩm A $50, B $30, C $20; mã SAVE10 giảm 10%, WELCOME5 giảm 5% cho khách mới): viết test case chức năng black-box phủ luồng chính, luồng thay thế và ngoại lệ, mỗi case có ID, mô tả, điều kiện tiên quyết, các bước kèm dữ liệu, kết quả mong đợi và ghi chú NF / AL / EX. Có sẵn ví dụ TC001.</li>
</ul>
<p>Ảnh là 1.jpg gốc, chỉ bỏ phần giấy trắng chừa để làm bài giữa các câu; không sửa chữ nào.</p>`),
    bi(`<h2>✍️ Question 1 — the complete answer</h2>
<p>The class as printed on the paper (line numbers as in the IDE screenshot):</p>
${PE_CODE}
<p>Checked by compiler and run (imports are not shown on the paper; with <code>import java.io.*;</code> added):</p>
${PE_RUN}
<h3>The defect report</h3>
<div class="table-wrap"><table>
<thead><tr><th>Defect ID</th><th>Defect Name</th><th>Line</th><th>Defect Description</th><th>Fixing Solution</th></tr></thead>
<tbody>
<tr><td>DF001</td><td>Naming Convention Error (class)</td><td>1</td><td>Class name <code>fileProcessor</code> starts with a lower-case letter; Java class names are PascalCase.</td><td>Rename to <code>FileProcessor</code> (and the file).</td></tr>
<tr><td>DF002</td><td>Naming Convention Error / uninitialised field</td><td>3</td><td>Field <code>FilePath</code> is capitalised like a class, and it is never assigned, so it is always null.</td><td>Rename to <code>filePath</code> and set it in a constructor or setter.</td></tr>
<tr><td>DF003</td><td>Logic Error — wrong condition</td><td>7</td><td><code>filePath != null || filePath.isEmpty()</code> is inverted and uses the wrong operator: it prints "opened successfully" for any non-null path and throws NPE for null.</td><td>Validate before opening: <code>if (filePath == null || filePath.isEmpty()) { …return; }</code>.</td></tr>
<tr><td>DF004</td><td>Validation after use (NullPointerException)</td><td>6</td><td>The path is used in <code>new FileReader(filePath)</code> before it is checked; a null path throws NullPointerException, which the <code>catch (IOException)</code> does not catch (verified by running).</td><td>Move the null/empty check above line 6.</td></tr>
<tr><td>DF005</td><td>Unhandled checked exception / unsafe close (compile error)</td><td>23</td><td><code>reader.close()</code> in <code>finally</code> throws IOException that is neither caught nor declared — the class does not compile — and it throws NPE when <code>reader</code> is null.</td><td>Use try-with-resources, or <code>if (reader != null) { try { reader.close(); } catch (IOException e) { … } }</code>.</td></tr>
<tr><td>DF006</td><td>Logic Error — check after the call</td><td>27–29</td><td><code>processFile</code> calls <code>openFile(FilePath)</code> and prints "Processing file..." <em>before</em> testing <code>FilePath == null</code>.</td><td>Test the path first, then open, then print.</td></tr>
<tr><td>DF007</td><td>Resource management (leak)</td><td>2, 6</td><td>The reader is opened in one method, stored in a field and closed in another; if <code>readFile()</code> is not called the file stays open.</td><td>Open, read and close in one method with try-with-resources; drop the field.</td></tr>
<tr><td>DF008</td><td>Poor exception handling</td><td>11, 21</td><td>Errors are printed to standard output and swallowed; <code>processFile</code> continues as if nothing happened.</td><td>Log with <code>System.err</code>/a logger and stop (return or rethrow).</td></tr>
<tr><td>DF009</td><td>Formatting / documentation</td><td>4, 14, 26</td><td>No blank line between members and no Javadoc on public methods.</td><td>One blank line between methods (checklist A7.12), add Javadoc.</td></tr>
</tbody>
</table></div>
<p><b>Which six?</b> The paper announces six; DF001–DF006 are the six the class was clearly built around (two naming errors, the inverted condition, check-after-use, the close in finally, check-after-call). DF007–DF009 are valid extras — list them as "additional" so a marker who expected e.g. the exception-handling one still finds it.</p>
<h3>Corrected class (compiles, run output above)</h3>
${PE_FIX}
<h3>A 20-minute plan for Question 1</h3>
<ol>
<li><b>3 min</b> — read the whole class once; paste it into the IDE if allowed and look at the red/yellow marks.</li>
<li><b>7 min</b> — four passes with the Lab 1 checklist in your head: names (B7, A7.14–7.17) → nulls and conditions (B1, B19, logic) → exceptions and resources (B2, A2.10, A2.32) → clean-up, braces, magic numbers (B6, B11, B13).</li>
<li><b>8 min</b> — write the table in Word, one row per defect, a code-level fix in every row.</li>
<li><b>2 min</b> — check line numbers against the paper and that no two rows describe the same defect.</li>
</ol>
<p><b>Links to the other questions.</b> Question 2 is Chapter 4's EP/BVA plus Chapter 4's white-box coverage: note that the tests' example is right (<code>{100, 200}</code>, VIP, no code → 300 × 0.8 = <b>240.0</b>; VIP + "SALE10" → <b>210.0</b>; Regular + "WELCOME5" → 100 × 0.90 = <b>90.0</b> — all three computed by running the method), that a non-VIP call with <code>customerType = null</code> throws NullPointerException at the <code>equalsIgnoreCase</code> line (a boundary worth a test), and that the true branch of <code>finalPrice &lt; 0 ? 0 : finalPrice</code> is unreachable (all prices must be &gt; 0 and the discount is at most 30%), so "100% branch coverage" is impossible — say so in your answer. Question 3 is Chapter 4's use-case testing.</p>`,
    `<h2>✍️ Câu 1 — lời giải đầy đủ</h2>
<p>Class như in trên đề (số dòng theo ảnh chụp IDE):</p>
${PE_CODE}
<p>Kiểm chứng bằng trình biên dịch và chạy thử (đề không in phần import; đã thêm <code>import java.io.*;</code>):</p>
${PE_RUN}
<h3>Báo cáo defect</h3>
<div class="table-wrap"><table>
<thead><tr><th>Defect ID</th><th>Defect Name</th><th>Dòng</th><th>Defect Description</th><th>Fixing Solution</th></tr></thead>
<tbody>
<tr><td>DF001</td><td>Naming Convention Error (class)</td><td>1</td><td>Tên class <code>fileProcessor</code> bắt đầu bằng chữ thường; tên class Java phải PascalCase.</td><td>Đổi thành <code>FileProcessor</code> (cả tên file).</td></tr>
<tr><td>DF002</td><td>Naming Convention Error / field chưa khởi tạo</td><td>3</td><td>Field <code>FilePath</code> viết hoa như tên class, và không bao giờ được gán nên luôn null.</td><td>Đổi thành <code>filePath</code> và gán trong constructor hoặc setter.</td></tr>
<tr><td>DF003</td><td>Logic Error — sai điều kiện</td><td>7</td><td><code>filePath != null || filePath.isEmpty()</code> bị đảo và dùng sai toán tử: in "opened successfully" cho mọi đường dẫn khác null và ném NPE khi null.</td><td>Kiểm tra trước khi mở: <code>if (filePath == null || filePath.isEmpty()) { …return; }</code>.</td></tr>
<tr><td>DF004</td><td>Kiểm tra sau khi dùng (NullPointerException)</td><td>6</td><td>Đường dẫn được dùng trong <code>new FileReader(filePath)</code> trước khi kiểm tra; null thì ném NullPointerException, mà <code>catch (IOException)</code> không bắt được (đã chạy kiểm chứng).</td><td>Đưa phép kiểm null/rỗng lên trên dòng 6.</td></tr>
<tr><td>DF005</td><td>Checked exception không xử lý / đóng không an toàn (lỗi biên dịch)</td><td>23</td><td><code>reader.close()</code> trong <code>finally</code> ném IOException không được bắt cũng không khai báo — class không biên dịch được — và ném NPE khi <code>reader</code> là null.</td><td>Dùng try-with-resources, hoặc <code>if (reader != null) { try { reader.close(); } catch (IOException e) { … } }</code>.</td></tr>
<tr><td>DF006</td><td>Logic Error — kiểm tra sau khi gọi</td><td>27–29</td><td><code>processFile</code> gọi <code>openFile(FilePath)</code> và in "Processing file..." <em>trước khi</em> kiểm tra <code>FilePath == null</code>.</td><td>Kiểm tra đường dẫn trước, rồi mở, rồi in.</td></tr>
<tr><td>DF007</td><td>Quản lý tài nguyên (rò rỉ)</td><td>2, 6</td><td>Reader mở ở một method, lưu vào field và đóng ở method khác; nếu không gọi <code>readFile()</code> thì file vẫn mở.</td><td>Mở, đọc, đóng trong một method với try-with-resources; bỏ field.</td></tr>
<tr><td>DF008</td><td>Xử lý exception kém</td><td>11, 21</td><td>Lỗi in ra standard output rồi bị nuốt; <code>processFile</code> chạy tiếp như không có gì.</td><td>Ghi <code>System.err</code>/logger và dừng (return hoặc ném tiếp).</td></tr>
<tr><td>DF009</td><td>Format / tài liệu</td><td>4, 14, 26</td><td>Không có dòng trống giữa các thành phần và không có Javadoc cho method public.</td><td>Một dòng trống giữa các method (checklist A7.12), thêm Javadoc.</td></tr>
</tbody>
</table></div>
<p><b>Chọn sáu cái nào?</b> Đề nói có sáu; DF001–DF006 là sáu lỗi class rõ ràng được "cài" vào (hai lỗi đặt tên, điều kiện bị đảo, dùng trước kiểm sau, close trong finally, gọi trước kiểm sau). DF007–DF009 là lỗi hợp lệ bổ sung — ghi thành mục "additional" để nếu người chấm mong đợi chẳng hạn lỗi xử lý exception thì vẫn thấy.</p>
<h3>Class đã sửa (biên dịch được, kết quả chạy ở trên)</h3>
${PE_FIX}
<h3>Kế hoạch 20 phút cho Câu 1</h3>
<ol>
<li><b>3 phút</b> — đọc toàn bộ class một lượt; nếu được dùng IDE thì dán vào và xem các gạch đỏ/vàng.</li>
<li><b>7 phút</b> — bốn lượt quét với checklist Lab 1 trong đầu: tên (B7, A7.14–7.17) → null và điều kiện (B1, B19, logic) → exception và tài nguyên (B2, A2.10, A2.32) → dọn dẹp, ngoặc, số ma thuật (B6, B11, B13).</li>
<li><b>8 phút</b> — viết bảng trong Word, mỗi defect một dòng, dòng nào cũng có cách sửa ở mức code.</li>
<li><b>2 phút</b> — soát số dòng với đề và chắc chắn không có hai dòng mô tả cùng một defect.</li>
</ol>
<p><b>Liên hệ các câu khác.</b> Câu 2 là EP/BVA và coverage white-box của Chương 4: ví dụ trong đề đúng (<code>{100, 200}</code>, VIP, không mã → 300 × 0,8 = <b>240.0</b>; VIP + "SALE10" → <b>210.0</b>; Regular + "WELCOME5" → 100 × 0,90 = <b>90.0</b> — cả ba đã chạy method để tính), một lời gọi không VIP với <code>customerType = null</code> ném NullPointerException ở dòng <code>equalsIgnoreCase</code> (một giá trị biên đáng test), và nhánh đúng của <code>finalPrice &lt; 0 ? 0 : finalPrice</code> không thể tới được (mọi giá phải &gt; 0 và giảm tối đa 30%), nên "100% branch coverage" là bất khả — hãy nói rõ điều đó trong bài. Câu 3 là use-case testing của Chương 4.</p>`),
    bi(`<div class="pitfall"><b>Exam trap: answering with the effect instead of the defect.</b> "Line 6 throws NullPointerException" is an observation; the defect is <em>why</em> — the field <code>FilePath</code> is never assigned (line 3) and the path is not validated before use (line 6/7). Name the cause, give the line of the cause, and the marker gives the point.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why try-with-resources beats a hand-written finally.</b> Since Java 7, any <code>AutoCloseable</code> declared in <code>try ( … )</code> is closed automatically in reverse order, even when the body throws, and an exception thrown by <code>close()</code> is attached as a <em>suppressed</em> exception instead of hiding the original one — which is exactly the bug class of DF005 (a failing close in finally replaces the real error). Reviewers in industry treat any manual <code>close()</code> in a finally block as a finding. <em>Outside the syllabus because CTFL is language-neutral.</em></div>`,
    `<div class="pitfall"><b>Bẫy thi: trả lời bằng hậu quả thay vì defect.</b> "Dòng 6 ném NullPointerException" là một quan sát; defect là <em>vì sao</em> — field <code>FilePath</code> không bao giờ được gán (dòng 3) và đường dẫn không được kiểm tra trước khi dùng (dòng 6/7). Nêu nguyên nhân, ghi dòng của nguyên nhân, người chấm sẽ cho điểm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao try-with-resources hơn finally viết tay.</b> Từ Java 7, mọi <code>AutoCloseable</code> khai báo trong <code>try ( … )</code> được đóng tự động theo thứ tự ngược, kể cả khi thân try ném lỗi, và exception do <code>close()</code> ném ra được gắn vào dạng <em>suppressed</em> thay vì che mất exception gốc — đúng loại lỗi của DF005 (close hỏng trong finally thay thế lỗi thật). Trong doanh nghiệp, người review coi mọi <code>close()</code> thủ công trong finally là một phát hiện. <em>Ngoài giáo trình vì CTFL không gắn với ngôn ngữ nào.</em></div>`),
    books([
      ['fst4', 'Ch.3 §2 review process pp.79–99 (PDF 93–113); Ch.4 §2 black-box pp.112–131 and §3 white-box pp.132–139 (PDF 126–153) for Questions 2–3; Ch.7 "Preparing for the exam" p.228 (PDF 242)', 'Chương 3 §2 trang 79–99 (PDF 93–113); Chương 4 §2 black-box trang 112–131 và §3 white-box trang 132–139 (PDF 126–153) cho Câu 2–3; Chương 7 "Preparing for the exam" trang 228 (PDF 242)'],
      ['junit', 'Ch.2 "Exploring core JUnit" (PDF 18): assertThrows, assertEquals with delta — needed for Question 2', 'Chương 2 "Exploring core JUnit" (PDF 18): assertThrows, assertEquals có delta — cần cho Câu 2'],
      ['sp5', '§5.1.1 Equivalence partitioning (PDF 165), §5.1.2 Boundary value analysis (PDF 176), §5.1.6 Use-case testing (PDF 208), §5.2.2 Decision testing (PDF 218)', '§5.1.1 Equivalence partitioning (PDF 165), §5.1.2 Boundary value analysis (PDF 176), §5.1.6 Use-case testing (PDF 208), §5.2.2 Decision testing (PDF 218)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZL1 = {
  title: 'Quiz Lab 1 — Code review & static analysis|||Quiz Lab 1 — Review code & phân tích tĩnh',
  slug: 'swt301-lab1-quiz',
  type: 'QUIZ',
  description: '12 câu kiểm tra phần Lab 1: yêu cầu bài lab, checklist Java, defect trong ReviewCode.java và fileProcessor, công cụ phân tích tĩnh.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('Lab 1 exit criteria: at least how many defects must each student log in the review part?|||Exit criteria Lab 1: mỗi sinh viên phải log tối thiểu bao nhiêu defect ở phần review?', ['5', '6', '10', '20'], 2),
      q('In ReviewCode.java, which line throws an exception as soon as the program runs?|||Trong ReviewCode.java, dòng nào ném exception ngay khi chạy chương trình?', ['Line 19 — name.equals("admin") on a null name|||Dòng 19 — name.equals("admin") khi name là null', 'Line 60 — division by zero|||Dòng 60 — chia cho 0', 'Line 72 — name == "user"|||Dòng 72 — name == "user"', 'Line 103 — oldMethod()|||Dòng 103 — oldMethod()'], 0),
      q('Why does ReviewCode.java not compile as printed?|||Vì sao ReviewCode.java như bản in không biên dịch được?', ['main throws Exception|||main khai báo throws Exception', 'Statement and ResultSet are not imported|||Statement và ResultSet không được import', 'oldMethod is deprecated|||oldMethod đã deprecated', 'The class has no constructor|||Class không có constructor'], 1),
      q('name == "user" violates which Basic checklist item?|||name == "user" vi phạm mục nào của sheet Basic?', ['#1 Null Checks', '#16 Switch-Case', '#19 equals vs ==', '#9 Whitespace'], 2),
      q('Which fix is correct for result += s + k inside a 100-step loop?|||Cách sửa đúng cho result += s + k trong vòng lặp 100 bước?', ['Use String.concat()|||Dùng String.concat()', 'Use a StringBuilder and append()|||Dùng StringBuilder và append()', 'Use new String(s + k)|||Dùng new String(s + k)', 'Move the loop into a static block|||Đưa vòng lặp vào khối static'], 1),
      q('Which statement about FindBugs (slide 6) is correct today?|||Câu nào về FindBugs (slide 6) đúng ở thời điểm hiện nay?', ['It analyses source code of any language|||Nó phân tích mã nguồn mọi ngôn ngữ', 'It is maintained and supports the latest JDK|||Nó vẫn được duy trì và hỗ trợ JDK mới nhất', 'It analyses Java bytecode; its maintained successor is SpotBugs|||Nó phân tích bytecode Java; bản kế nhiệm được duy trì là SpotBugs', 'It is a JavaScript linter|||Nó là linter cho JavaScript'], 2),
      q('Which tool on the Lab 1 slides is meant for JavaScript?|||Công cụ nào trên slide Lab 1 dành cho JavaScript?', ['PMD', 'ESLint', 'PVS-Studio', 'FindBugs'], 1),
      q('The static-analysis exit criterion asks each student to log…|||Exit criteria phần phân tích tĩnh yêu cầu mỗi sinh viên log…', ['10 defects in Excel|||10 defect trong Excel', '5 different types of defect in JIRA|||5 loại defect khác nhau trên JIRA', 'every tool warning|||mọi cảnh báo của công cụ', '6 defects in a Word file|||6 defect trong file Word'], 1),
      q('Which defect can a static analyser NOT be expected to find?|||Defect nào công cụ phân tích tĩnh KHÔNG thể được kỳ vọng tìm ra?', ['An unclosed FileInputStream|||FileInputStream không đóng', 'An unused local variable|||Biến local không dùng', 'A VIP discount of 15% where the requirement says 20%|||Giảm giá VIP 15% trong khi yêu cầu nói 20%', 'A missing brace on an if|||Thiếu ngoặc cho if'], 2),
      q('In the FALL24 fileProcessor, why does line 23 (reader.close() in finally) not compile?|||Trong fileProcessor FALL24, vì sao dòng 23 (reader.close() trong finally) không biên dịch?', ['close() is private|||close() là private', 'close() throws IOException that is neither caught nor declared|||close() ném IOException không được bắt cũng không khai báo', 'reader is final|||reader là final', 'finally cannot contain method calls|||finally không được gọi method'], 1),
      q('The condition "filePath != null || filePath.isEmpty()" in fileProcessor is best described as…|||Điều kiện "filePath != null || filePath.isEmpty()" trong fileProcessor đúng nhất là…', ['a naming convention error|||lỗi quy ước đặt tên', 'a logic error: inverted check with the wrong operator, placed after the file is opened|||lỗi logic: kiểm tra bị đảo, sai toán tử, đặt sau khi đã mở file', 'a performance issue|||vấn đề hiệu năng', 'correct code|||code đúng'], 1),
      q('Static analysis tools are typically used by… and they…|||Công cụ phân tích tĩnh thường do ai dùng và chúng…', ['testers; execute the code with test data|||tester; chạy code với dữ liệu test', 'developers; examine code without executing it|||developer; xem xét code mà không chạy', 'customers; validate requirements|||khách hàng; validate yêu cầu', 'managers; estimate effort|||quản lý; ước lượng công sức'], 1),
    ],
  },
};

export default {
  title: 'Lab 1 — Code review & static analysis|||Lab 1 — Review code & phân tích tĩnh',
  description: 'Lab 1 học từng slide: review ReviewCode.java bằng Java_Simple_Checklist (29 defect có dòng, mức độ, cách sửa, code đã sửa đã chạy thật), công cụ phân tích tĩnh (chạy thật javac/ECJ/Checkstyle, cách dùng Sonar/PMD/SpotBugs, log JIRA) và lời giải Câu 1 đề PE FALL24.',
  lessons: [L1, L2, L3, L4, QUIZL1],
};
