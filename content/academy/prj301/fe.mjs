/**
 * PRJ301 · Thi cuối kỳ — 3 đề luyện PE mô phỏng 85 phút.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── 🎯 PE practice 1/3 — 85-minute mock paper: Library books (login + Filter, search, CRUD + validation, paging) ───────── */
const L_x_luyen_pe_1 = {
  title: '🎯 PE practice 1/3 — 85-minute mock paper: Library books (login + Filter, search, CRUD + validation, paging)|||🎯 Luyện PE 1/3 — đề mô phỏng 85 phút: Quản lý sách thư viện (đăng nhập + Filter, tìm kiếm, thêm/sửa/xoá, phân trang)',
  slug: 'prj301-luyen-pe-1',
  type: 'VIDEO',
  description: "Đề thi thực hành PE PRJ301 MÔ PHỎNG (Exam Room chưa có đề thật) theo đúng dạng PE quen thuộc: script SQL Server cho sẵn, project mẫu có DBContext, 4 câu tăng dần trên đề tài Quản lý sách thư viện — đăng nhập + session + Filter chặn trang khi chưa đăng nhập hoặc sai vai trò; liệt kê và tìm kiếm bằng JDBC/DAO/MVC hiển thị bằng JSTL; thêm/sửa/xoá có kiểm tra dữ liệu; phân trang OFFSET/FETCH giữ điều kiện tìm. Lời giải là một webapp chạy thật trên Tomcat 10.1 + SQL Server với 32 request đúng kịch bản người chấm, barem tự chấm từng ý, 10 lỗi mất điểm đo thật (so chuỗi bằng ==, sai đường dẫn forward, NullPointerException khi chưa đăng nhập, quên return trong Filter, vòng lặp chuyển hướng, quên setCharacterEncoding, thiếu taglib, parseInt(null), LIKE '%?%', nối chuỗi SQL), kế hoạch 85 phút từng phút và mẹo NetBeans.",
  content: [
    bi(`<span class="eyebrow">Final exam · Practical Exam (PE) · Mock paper 1 of 3</span>
<h2>🎯 A full PE paper on one topic — do it with a timer before you read the solution</h2>
<div class="callout">⚠ <strong>The Exam Room does not have a real PRJ301 PE paper yet — this is a MOCK paper built on the usual PE shape.</strong> The topic, the data, the points and the marking guide are written for this course. Real papers change every semester; ask your lecturer what is allowed in the room (tools, internet, notes).</div>
<p class="lead">The PE is <strong>30% of PRJ301</strong>, lasts <strong>85 minutes</strong> and its completion criterion is <strong>&gt; 0</strong> (syllabus, assessment table) — a blank PE fails the subject. It is not a design exam: you get a database script and a small project, and you must make <em>working</em> web features that the examiner checks by opening URLs in a browser and looking at the data on the screen and in the database. Lesson ⭐ "How to study PRJ301" says it in one line: login + Filter + JDBC list/search/insert, MVC, SQL Server. This page is one complete paper of that kind, with a solution that really runs.</p>
<p>What public descriptions of PRJ301 practical exams say about the room (checked 15/10/2026; details change, so treat them as likely, not certain): each paper comes with a <strong>template project</strong>; you rename it with your student code and keep the <strong>context path = project name</strong>, otherwise the URLs the examiner types do not exist; a class <code>DBContext</code> is already in package <code>dal</code> and you <strong>must</strong> use it — you only fill the connection values in its constructor; the libraries (SQL Server JDBC driver, Jakarta JSTL) are already added and you may not add or change libraries; the room software was described as NetBeans 13, SQL Server, JDK 8 and Tomcat 10. So: write Java 8 code (no <code>var</code>, no records, no <code>isBlank()</code>), and practise with <em>exactly</em> the tools of the room.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read only part 📝 (the paper). Run the script in SSMS, set a timer for 85 minutes and build it in NetBeans.</li>
<li>Stop when the timer rings. Then mark yourself with part 🧮 — every line says which request to try.</li>
<li>Compare with part ✅ (the solution: every file shown, every response real) and part 🪤 (ten mistakes, each one run for real).</li>
<li>Next day: rebuild only what you lost, without looking. Then do papers 2/3 (hotel bookings) and 3/3 (student grades).</li>
</ol></div>
<table>
<thead><tr><th>Question</th><th>Points</th><th>What it tests</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>Q1 login, logout, Filter by role</td><td>2.5</td><td>form POST, PreparedStatement, session, sendRedirect, Filter</td><td>2.A, 4.A, 5.B, 8.A</td></tr>
<tr><td>Q2 list + search</td><td>3.0</td><td>DAO + JOIN, MVC forward, JSTL <code>c:forEach</code>/<code>c:if</code>, keeping the typed values</td><td>5.B, 6.A, 3.D</td></tr>
<tr><td>Q3 add, edit, delete with validation</td><td>2.5</td><td>server-side validation, PRG, 404 for a missing id</td><td>5.B, 6.A, 6.4</td></tr>
<tr><td>Q4 pagination</td><td>2.0</td><td><code>COUNT(*)</code>, <code>OFFSET … FETCH</code>, links that keep the search</td><td>5.5, 6.4</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Thi cuối kỳ · Thi thực hành (PE) · Đề mô phỏng 1/3</span>
<h2>🎯 Một đề PE trọn vẹn trên một đề tài — làm có bấm giờ trước khi đọc lời giải</h2>
<div class="callout">⚠ <strong>Exam Room chưa có đề PE PRJ301 thật — đây là đề MÔ PHỎNG theo dạng PE quen thuộc.</strong> Đề tài, dữ liệu, thang điểm và barem đều được soạn riêng cho khoá học này. Đề thật đổi theo từng kỳ; hãy hỏi giảng viên phòng thi cho dùng gì (công cụ, internet, tài liệu).</div>
<p class="lead">PE chiếm <strong>30% điểm PRJ301</strong>, làm trong <strong>85 phút</strong>, điều kiện hoàn thành <strong>&gt; 0</strong> (bảng đánh giá trong đề cương) — bỏ trắng PE là trượt môn. Đây không phải bài thi thiết kế: bạn được phát một script cơ sở dữ liệu (CSDL) và một project nhỏ, và phải làm ra các chức năng web <em>chạy được</em>; người chấm kiểm bằng cách mở URL trên trình duyệt, nhìn dữ liệu trên màn hình và trong CSDL. Bài ⭐ "Học PRJ301 thế nào" tóm trong một dòng: đăng nhập + Filter + liệt kê/tìm kiếm/thêm bằng JDBC, MVC, SQL Server. Trang này là một đề trọn vẹn đúng kiểu đó, kèm lời giải chạy thật.</p>
<p>Những gì các mô tả công khai về đề thực hành PRJ301 nói về phòng thi (tra ngày 15/10/2026; chi tiết có thể đổi, nên coi là "nhiều khả năng", không phải chắc chắn): mỗi đề đi kèm một <strong>project mẫu (template)</strong>; bạn đổi tên project theo mã sinh viên và giữ <strong>context path = tên project</strong> (context path là phần đầu URL của ứng dụng, ví dụ <code>/pe1-thu-vien</code>), nếu không thì URL người chấm gõ sẽ không tồn tại; lớp <code>DBContext</code> có sẵn trong gói <code>dal</code> và bạn <strong>bắt buộc</strong> dùng nó — chỉ điền giá trị kết nối trong hàm khởi tạo (constructor); thư viện (driver JDBC của SQL Server, Jakarta JSTL) đã thêm sẵn và không được thêm/đổi; phần mềm phòng thi được mô tả là NetBeans 13, SQL Server, JDK 8 và Tomcat 10. Vậy: viết code Java 8 (không <code>var</code>, không record, không <code>isBlank()</code>), và luyện với <em>đúng</em> bộ công cụ của phòng thi.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc phần 📝 (đề thi). Chạy script trong SSMS, đặt đồng hồ 85 phút và làm trong NetBeans.</li>
<li>Chuông reo thì dừng. Tự chấm bằng phần 🧮 — mỗi dòng ghi rõ thử request nào.</li>
<li>Đối chiếu với phần ✅ (lời giải: hiện mọi file, mọi response là thật) và phần 🪤 (mười lỗi, lỗi nào cũng chạy thật).</li>
<li>Hôm sau: làm lại đúng phần bị mất điểm, không nhìn. Rồi làm đề 2/3 (đặt phòng khách sạn) và 3/3 (điểm sinh viên).</li>
</ol></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Kiểm tra gì</th><th>Học ở bài</th></tr></thead>
<tbody>
<tr><td>Q1 đăng nhập, đăng xuất, Filter theo vai trò</td><td>2.5</td><td>form POST, PreparedStatement, session, sendRedirect, Filter</td><td>2.A, 4.A, 5.B, 8.A</td></tr>
<tr><td>Q2 liệt kê + tìm kiếm</td><td>3.0</td><td>DAO + JOIN, forward kiểu MVC, JSTL <code>c:forEach</code>/<code>c:if</code>, giữ lại chữ đã gõ</td><td>5.B, 6.A, 3.D</td></tr>
<tr><td>Q3 thêm, sửa, xoá có kiểm tra dữ liệu</td><td>2.5</td><td>kiểm tra phía server, PRG, 404 khi id không tồn tại</td><td>5.B, 6.A, 6.4</td></tr>
<tr><td>Q4 phân trang</td><td>2.0</td><td><code>COUNT(*)</code>, <code>OFFSET … FETCH</code>, link giữ điều kiện tìm</td><td>5.5, 6.4</td></tr>
</tbody>
</table>`),
    bi(`<h2>📝 The exam paper (85 minutes)</h2>
<p>Papers are written in English, so this one is too. The Vietnamese half of the page gives a line-by-line translation right below it.</p>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 1                            Duration: 85 minutes
LIBRARY BOOKS

Instructions
- Create the database with the given script PE1_Library.sql (database PRJ301_Pe1ThuVien).
- Open the template project, rename it to PE1_&lt;YourStudentCode&gt;. Do NOT change the context path
  rule of the template. (In the solution of this course the context path is /pe1-thu-vien.)
- Put your connection values in the constructor of dal.DBContext. Every database access MUST go
  through DBContext. Do not add or change libraries.
- Use Servlet + JSP + JSTL + JDBC, MVC style: no SQL in JSP, no HTML in servlets.
- A function that does not run (compile error, HTTP 404/500 at the given URL) gets 0 for that part.

Question 1 (2.5 points) — Login, logout, authorization
 a) GET /login shows a form (username, password). POST /login checks table Account.
    - Wrong username or password: stay on the login page, show "Invalid username or password"
      and keep the typed username.                                                     (0.5)
    - Correct: store the account in the session (attribute "account") and redirect to
      /book/list.                                                                       (0.5)
    - Every /book/* page shows "Welcome, &lt;fullName&gt; (&lt;role&gt;)" and a Logout link.
      GET /logout ends the session and redirects to /login.                             (0.5)
 b) Write ONE Filter for /book/*:
    - not logged in -&gt; redirect to /login                                                (0.5)
    - /book/add, /book/edit, /book/delete are for role LIBRARIAN only; a MEMBER gets HTTP 403
      with the text "Access denied"                                                     (0.5)

Question 2 (3.0 points) — List and search: GET /book/list
    - Show a table: ID, Title, Author, Category (the NAME, not the id), Year, Qty,
      ordered by ID. Use JSTL, no scriptlets.                                           (1.0)
    - Parameter keyword: books whose title OR author contains it (case-insensitive).    (0.75)
    - Parameter categoryId: a drop-down filled from table Category, first option
      "All categories" (value 0).                                                       (0.5)
    - After a search the box and the drop-down keep their values. No result -&gt;
      "No books found."                                                                 (0.75)

Question 3 (2.5 points) — Add, edit, delete (LIBRARIAN)
    - GET /book/add shows a form; POST /book/add inserts. Rules, checked on the SERVER:
      title required (max 150), author required (max 100), category must exist,
      year a whole number from 1800 to 2026, quantity a whole number &gt;= 0.
      A wrong field shows its own message next to it, and the typed values stay.        (0.75)
    - A correct book is saved and the browser goes back to /book/list (refresh must
      not insert again).                                                                (0.5)
    - Edit link on each row -&gt; GET /book/edit?id=.. shows the form filled in; POST saves
      with the same rules. An id that does not exist -&gt; HTTP 404.                       (0.75)
    - Delete button on each row (POST /book/delete, id).                                (0.5)

Question 4 (2.0 points) — Pagination
    - /book/list shows 5 books per page (parameter page, default 1), using the database
      (not by cutting a Java list).                                                     (1.0)
    - Under the table: "&lt;n&gt; book(s) — page x/y" and links to every page; the links keep
      keyword and categoryId.                                                           (0.5)
    - page &lt; 1 or not a number -&gt; page 1; page too big -&gt; the last page.                (0.5)

Accounts: thuthu / 123 (LIBRARIAN), docgia / 123 (MEMBER).</code></pre>
<p>The script the paper gives (tables, then data — note <code>NVARCHAR</code> and the <code>N'…'</code> prefix for Vietnamese text):</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(50)   NOT NULL,                 -- plain text: exam data only
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(10)   NOT NULL CHECK (role IN ('LIBRARIAN', 'MEMBER'))
);
CREATE TABLE Category (
    id   INT           NOT NULL PRIMARY KEY,
    name NVARCHAR(50)  NOT NULL
);
CREATE TABLE Book (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    title       NVARCHAR(150) NOT NULL,
    author      NVARCHAR(100) NOT NULL,
    categoryId  INT           NOT NULL REFERENCES Category(id),
    publishYear INT           NOT NULL,
    quantity    INT           NOT NULL CHECK (quantity &gt;= 0)
);</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account VALUES
    ('thuthu', '123', N'Nguyễn Thị Thu', 'LIBRARIAN'),
    ('docgia', '123', N'Trần Văn Minh',  'MEMBER');
INSERT INTO Category VALUES (1, N'Programming'), (2, N'Database'), (3, N'Văn học');
INSERT INTO Book (title, author, categoryId, publishYear, quantity) VALUES
    (N'Head First Java',                         N'Kathy Sierra',      1, 2022, 4),
    (N'Effective Java',                          N'Joshua Bloch',      1, 2018, 2),
    (N'Java Concurrency in Practice',            N'Brian Goetz',       1, 2006, 1),
    (N'Clean Code',                              N'Robert C. Martin',  1, 2008, 3),
    (N'Spring in Action',                        N'Craig Walls',       1, 2022, 2),
    (N'Murach''s Java Servlets and JSP',         N'Joel Murach',       1, 2014, 5),
    (N'SQL Server Fundamentals',                 N'Itzik Ben-Gan',     2, 2023, 3),
    (N'Database System Concepts',                N'Abraham Silberschatz', 2, 2019, 2),
    (N'Learning SQL',                            N'Alan Beaulieu',     2, 2020, 6),
    (N'Designing Data-Intensive Applications',   N'Martin Kleppmann',  2, 2017, 1),
    (N'Dế Mèn phiêu lưu ký',                     N'Tô Hoài',           3, 1941, 8),
    (N'Số đỏ',                                   N'Vũ Trọng Phụng',    3, 1936, 2),
    (N'Tắt đèn',                                 N'Ngô Tất Tố',        3, 1939, 0),
    (N'Cho tôi xin một vé đi tuổi thơ',          N'Nguyễn Nhật Ánh',   3, 2008, 7);</code></pre>`,
    `<h2>📝 Đề thi (85 phút)</h2>
<p>Đề thật viết bằng tiếng Anh, nên đề này cũng vậy. Bản dịch từng ý ở ngay dưới khung đề.</p>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 1                            Duration: 85 minutes
LIBRARY BOOKS

Instructions
- Create the database with the given script PE1_Library.sql (database PRJ301_Pe1ThuVien).
- Open the template project, rename it to PE1_&lt;YourStudentCode&gt;. Do NOT change the context path
  rule of the template. (In the solution of this course the context path is /pe1-thu-vien.)
- Put your connection values in the constructor of dal.DBContext. Every database access MUST go
  through DBContext. Do not add or change libraries.
- Use Servlet + JSP + JSTL + JDBC, MVC style: no SQL in JSP, no HTML in servlets.
- A function that does not run (compile error, HTTP 404/500 at the given URL) gets 0 for that part.

Question 1 (2.5 points) — Login, logout, authorization
 a) GET /login shows a form (username, password). POST /login checks table Account.
    - Wrong username or password: stay on the login page, show "Invalid username or password"
      and keep the typed username.                                                     (0.5)
    - Correct: store the account in the session (attribute "account") and redirect to
      /book/list.                                                                       (0.5)
    - Every /book/* page shows "Welcome, &lt;fullName&gt; (&lt;role&gt;)" and a Logout link.
      GET /logout ends the session and redirects to /login.                             (0.5)
 b) Write ONE Filter for /book/*:
    - not logged in -&gt; redirect to /login                                                (0.5)
    - /book/add, /book/edit, /book/delete are for role LIBRARIAN only; a MEMBER gets HTTP 403
      with the text "Access denied"                                                     (0.5)

Question 2 (3.0 points) — List and search: GET /book/list
    - Show a table: ID, Title, Author, Category (the NAME, not the id), Year, Qty,
      ordered by ID. Use JSTL, no scriptlets.                                           (1.0)
    - Parameter keyword: books whose title OR author contains it (case-insensitive).    (0.75)
    - Parameter categoryId: a drop-down filled from table Category, first option
      "All categories" (value 0).                                                       (0.5)
    - After a search the box and the drop-down keep their values. No result -&gt;
      "No books found."                                                                 (0.75)

Question 3 (2.5 points) — Add, edit, delete (LIBRARIAN)
    - GET /book/add shows a form; POST /book/add inserts. Rules, checked on the SERVER:
      title required (max 150), author required (max 100), category must exist,
      year a whole number from 1800 to 2026, quantity a whole number &gt;= 0.
      A wrong field shows its own message next to it, and the typed values stay.        (0.75)
    - A correct book is saved and the browser goes back to /book/list (refresh must
      not insert again).                                                                (0.5)
    - Edit link on each row -&gt; GET /book/edit?id=.. shows the form filled in; POST saves
      with the same rules. An id that does not exist -&gt; HTTP 404.                       (0.75)
    - Delete button on each row (POST /book/delete, id).                                (0.5)

Question 4 (2.0 points) — Pagination
    - /book/list shows 5 books per page (parameter page, default 1), using the database
      (not by cutting a Java list).                                                     (1.0)
    - Under the table: "&lt;n&gt; book(s) — page x/y" and links to every page; the links keep
      keyword and categoryId.                                                           (0.5)
    - page &lt; 1 or not a number -&gt; page 1; page too big -&gt; the last page.                (0.5)

Accounts: thuthu / 123 (LIBRARIAN), docgia / 123 (MEMBER).</code></pre>
<p><strong>Dịch từng ý.</strong></p>
<ul>
<li><strong>Hướng dẫn chung</strong>: tạo CSDL bằng script cho sẵn; mở project mẫu, đổi tên thành <code>PE1_&lt;MãSV&gt;</code>, không đổi quy ước context path; điền thông tin kết nối vào hàm khởi tạo của <code>dal.DBContext</code>, mọi truy cập CSDL BẮT BUỘC qua DBContext; không thêm/đổi thư viện; làm theo MVC: không SQL trong JSP, không HTML trong servlet; chức năng nào không chạy (lỗi biên dịch, URL trả 404/500) thì phần đó 0 điểm.</li>
<li><strong>Câu 1 (2.5)</strong> — a) GET <code>/login</code> hiện form; POST <code>/login</code> kiểm bảng Account. Sai ⇒ ở lại trang đăng nhập, hiện "Invalid username or password" và giữ username đã gõ (0.5). Đúng ⇒ lưu tài khoản vào session (attribute tên <code>"account"</code>) và chuyển hướng tới <code>/book/list</code> (0.5). Mọi trang <code>/book/*</code> hiện "Welcome, &lt;họ tên&gt; (&lt;vai trò&gt;)" và link Logout; GET <code>/logout</code> huỷ session rồi chuyển về <code>/login</code> (0.5). b) Viết MỘT Filter cho <code>/book/*</code>: chưa đăng nhập ⇒ chuyển về <code>/login</code> (0.5); <code>/book/add</code>, <code>/book/edit</code>, <code>/book/delete</code> chỉ cho vai trò LIBRARIAN, MEMBER nhận HTTP 403 kèm chữ "Access denied" (0.5).</li>
<li><strong>Câu 2 (3.0)</strong> — GET <code>/book/list</code>: bảng ID, Title, Author, Category (TÊN thể loại, không phải mã), Year, Qty, sắp theo ID, dùng JSTL, không scriptlet (1.0); tham số <code>keyword</code>: sách có tên HOẶC tác giả chứa từ khoá, không phân biệt hoa thường (0.75); tham số <code>categoryId</code>: ô chọn lấy từ bảng Category, lựa chọn đầu "All categories" giá trị 0 (0.5); tìm xong ô tìm kiếm và ô chọn giữ nguyên giá trị; không có kết quả ⇒ "No books found." (0.75).</li>
<li><strong>Câu 3 (2.5)</strong> — thêm/sửa/xoá (LIBRARIAN). GET <code>/book/add</code> hiện form, POST thêm; luật kiểm Ở SERVER: title bắt buộc (tối đa 150), author bắt buộc (tối đa 100), thể loại phải tồn tại, năm là số nguyên 1800–2026, số lượng là số nguyên ≥ 0; ô nào sai hiện thông báo của ô đó ngay cạnh, chữ đã gõ giữ nguyên (0.75). Đúng ⇒ lưu và trình duyệt quay về <code>/book/list</code>, bấm F5 không được thêm lần nữa (0.5). Link Edit ở mỗi dòng ⇒ GET <code>/book/edit?id=..</code> hiện form điền sẵn, POST lưu theo cùng luật; id không tồn tại ⇒ HTTP 404 (0.75). Nút Delete ở mỗi dòng (POST <code>/book/delete</code>, tham số id) (0.5).</li>
<li><strong>Câu 4 (2.0)</strong> — phân trang: mỗi trang 5 cuốn (tham số <code>page</code>, mặc định 1), cắt trang bằng CSDL chứ không cắt một List trong Java (1.0); dưới bảng: "&lt;n&gt; book(s) — page x/y" và link tới mọi trang, link giữ <code>keyword</code> và <code>categoryId</code> (0.5); <code>page</code> &lt; 1 hoặc không phải số ⇒ trang 1, quá lớn ⇒ trang cuối (0.5).</li>
</ul>
<p>Script đề cho sẵn (bảng, rồi dữ liệu — để ý <code>NVARCHAR</code> và tiền tố <code>N'…'</code> cho chữ tiếng Việt; thiếu <code>N</code> thì SQL Server lưu "Văn học" thành "V?n h?c"):</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(50)   NOT NULL,                 -- chữ thường: chỉ là dữ liệu đề thi
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(10)   NOT NULL CHECK (role IN ('LIBRARIAN', 'MEMBER'))
);
CREATE TABLE Category (
    id   INT           NOT NULL PRIMARY KEY,
    name NVARCHAR(50)  NOT NULL
);
CREATE TABLE Book (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    title       NVARCHAR(150) NOT NULL,
    author      NVARCHAR(100) NOT NULL,
    categoryId  INT           NOT NULL REFERENCES Category(id),
    publishYear INT           NOT NULL,
    quantity    INT           NOT NULL CHECK (quantity &gt;= 0)
);</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account VALUES
    ('thuthu', '123', N'Nguyễn Thị Thu', 'LIBRARIAN'),
    ('docgia', '123', N'Trần Văn Minh',  'MEMBER');
INSERT INTO Category VALUES (1, N'Programming'), (2, N'Database'), (3, N'Văn học');
INSERT INTO Book (title, author, categoryId, publishYear, quantity) VALUES
    (N'Head First Java',                         N'Kathy Sierra',      1, 2022, 4),
    (N'Effective Java',                          N'Joshua Bloch',      1, 2018, 2),
    (N'Java Concurrency in Practice',            N'Brian Goetz',       1, 2006, 1),
    (N'Clean Code',                              N'Robert C. Martin',  1, 2008, 3),
    (N'Spring in Action',                        N'Craig Walls',       1, 2022, 2),
    (N'Murach''s Java Servlets and JSP',         N'Joel Murach',       1, 2014, 5),
    (N'SQL Server Fundamentals',                 N'Itzik Ben-Gan',     2, 2023, 3),
    (N'Database System Concepts',                N'Abraham Silberschatz', 2, 2019, 2),
    (N'Learning SQL',                            N'Alan Beaulieu',     2, 2020, 6),
    (N'Designing Data-Intensive Applications',   N'Martin Kleppmann',  2, 2017, 1),
    (N'Dế Mèn phiêu lưu ký',                     N'Tô Hoài',           3, 1941, 8),
    (N'Số đỏ',                                   N'Vũ Trọng Phụng',    3, 1936, 2),
    (N'Tắt đèn',                                 N'Ngô Tất Tố',        3, 1939, 0),
    (N'Cho tôi xin một vé đi tuổi thơ',          N'Nguyễn Nhật Ánh',   3, 2008, 7);</code></pre>`),
    bi(`<h2>✅ Solution, question by question — every response below is real</h2>
<p>The solution is a complete webapp that ran on Tomcat 10.1 against a real SQL Server. Its requests follow the order an examiner uses: try a protected URL, log in wrong, log in right, try what the role must not do, search, add wrong, add right, edit, delete, page through, log out. Only the context path differs from the exam (<code>/pe1-thu-vien</code>, because every app name on this site must be unique).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fef68ffb133de468ee3e0d6545691413db2894d1.svg" alt="The whole solution: one Filter in front, then Controller → DAO → JSP" loading="lazy" /><p class="chu-thich">🧩 The whole solution: one Filter in front, then Controller → DAO → JSP</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 1: every request passes the Filter, then Controller, DAO, JSP
left to right direction
actor "Browser" as U
rectangle "AuthFilter\\n@WebFilter(/book/*)\\n\\nno account → 302 /login\\nMEMBER on add/edit/delete → 403" as F
rectangle "Controllers (servlets)\\n/login · /logout\\n/book/list · /book/add\\n/book/edit · /book/delete" as C
rectangle "DAO (package dal)\\nDBContext · AccountDAO\\nBookDAO · CategoryDAO\\nPreparedStatement only" as D
database "SQL Server\\nPRJ301_Pe1ThuVien" as DB
rectangle "Views (WEB-INF/views)\\nlogin.jsp · book-list.jsp\\nbook-form.jsp · 403.jsp\\nJSTL c:forEach, c:url" as V
U --&gt; F : 1. request
F --&gt; C : 2. allowed
C --&gt; D : 3. call
D --&gt; DB : SQL
C --&gt; V : 4. forward + attributes
V --&gt; U : 5. HTML
C ..&gt; U : POST ok → 302 (PRG)
@enduml</code></pre></details>
<p><strong>Project structure</strong> (how NetBeans shows it — "Source Packages" is <code>src/main/java</code>, "Web Pages" is <code>src/main/webapp</code>):</p>
<pre><code class="language-plaintext">PE1_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   LoginServlet, LogoutServlet, BookListServlet, BookAddServlet,
│  │               BookEditServlet, BookDeleteServlet, BookForm (validation)
│  ├─ dal          DBContext (given), AccountDAO, CategoryDAO, BookDAO
│  ├─ filter       AuthFilter
│  └─ model        Account, Book, Category
├─ Web Pages
│  └─ WEB-INF/views   login.jsp, book-list.jsp, book-form.jsp, 403.jsp
└─ Libraries       mssql-jdbc, jakarta JSTL (given — do not touch)</code></pre>
<p>JSPs live under <code>WEB-INF</code> on purpose: nobody can open <code>book-list.jsp</code> directly and skip the servlet (and the Filter). Every page is reached through a servlet URL.</p>
<h3>Q1 — login, logout, the Filter</h3>
<p>Step 0 is the given <code>DBContext</code>: fill the constructor and nothing else. Our version reads environment variables only so that the same code runs in our test container; in the exam you simply write <code>"localhost"</code>, <code>"1433"</code>, <code>"sa"</code> and your password. Every DAO <code>extends DBContext</code> and opens a fresh connection per method inside try-with-resources (lesson 5.B explains why one shared connection is fragile).</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/DBContext.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private final String serverName;
private final String portNumber;
private final String dbName;
private final String userID;
private final String password;

public DBContext() {
    // In the exam room: "localhost", "1433", the database of the script, "sa", YOUR sa password
    serverName = env("DB_HOST", "localhost");
    portNumber = env("DB_PORT", "1433");
    dbName = "PRJ301_Pe1ThuVien";
    userID = env("DB_USER", "sa");
    password = env("DB_PASSWORD", "123");
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/DBContext.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// A NEW connection per call; every DAO method closes it with try-with-resources
protected Connection getConnection() throws SQLException {
    try {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    } catch (ClassNotFoundException e) {
        throw new SQLException("mssql-jdbc is missing from the project libraries", e);
    }
    String url = "jdbc:sqlserver://" + serverName + ":" + portNumber + ";databaseName=" + dbName
            + ";encrypt=true;trustServerCertificate=true";
    return DriverManager.getConnection(url, userID, password);
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/AccountDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Returns the account when username AND password match, otherwise null
public Account login(String username, String password) throws SQLException {
    String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, username);                         // ? = data, never SQL: blocks ' OR 1=1 --
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return new Account(rs.getString("username"), rs.getString("fullName"), rs.getString("role"));
            }
            return null;
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");                 // BEFORE the first getParameter
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    Account account;
    try {
        account = new AccountDAO().login(username, password);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (account == null) {                                 // wrong ⇒ same page, a message, the username kept
        request.setAttribute("error", "Invalid username or password");
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        return;
    }
    HttpSession session = request.getSession();
    session.setAttribute("account", account);              // the filter and the JSPs read this name
    response.sendRedirect(request.getContextPath() + "/book/list");
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/filter/AuthFilter.java</code></p>
<pre class="web-src"><code class="language-java">package filter;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Account;

// Q1b: every /book/* page needs a login; add/edit/delete need the LIBRARIAN role
@WebFilter("/book/*")
public class AuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession(false);
        Account account = (session == null) ? null : (Account) session.getAttribute("account");
        if (account == null) {                                 // 1. not logged in ⇒ to the login page
            response.sendRedirect(request.getContextPath() + "/login");
            return;                                            // without return the servlet still runs
        }
        String path = request.getServletPath();                // "/book/add", "/book/list"…
        boolean writes = path.equals("/book/add") || path.equals("/book/edit") || path.equals("/book/delete");
        if (writes &amp;&amp; !account.isLibrarian()) {                // 2. logged in, wrong role ⇒ 403
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
            return;
        }
        chain.doFilter(req, resp);                             // 3. allowed
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookListServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.BookDAO;
import dal.CategoryDAO;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Q2 + Q4: list, search (keyword + category) and 5 books per page — the Controller of MVC
@WebServlet("/book/list")
public class BookListServlet extends HttpServlet {
    private static final int PAGE_SIZE = 5;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String keyword = request.getParameter("keyword") == null ? "" : request.getParameter("keyword").trim();
        Integer cat = BookForm.toInt(request.getParameter("categoryId"));
        int categoryId = cat == null ? 0 : cat;                // missing / "abc" ⇒ 0 = all categories
        Integer p = BookForm.toInt(request.getParameter("page"));
        int page = (p == null || p &lt; 1) ? 1 : p;
        try {
            BookDAO dao = new BookDAO();
            int total = dao.count(keyword, categoryId);
            int totalPages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);   // ceil without double
            if (page &gt; totalPages) page = totalPages;          // ?page=99 ⇒ the last page, not an empty table
            request.setAttribute("books", dao.search(keyword, categoryId, page, PAGE_SIZE));
            request.setAttribute("categories", new CategoryDAO().getAll());
            request.setAttribute("total", total);
            request.setAttribute("page", page);
            request.setAttribute("totalPages", totalPages);
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        request.setAttribute("keyword", keyword);              // so the search box keeps what was typed
        request.setAttribute("categoryId", categoryId);
        request.getRequestDispatcher("/WEB-INF/views/book-list.jsp").forward(request, response);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Book;

// DAO = the ONLY class that writes SQL for Book; servlets never touch JDBC
public class BookDAO extends DBContext {
    // ONE fixed WHERE for "keyword in title OR author" + "category (0 = all)": no string building, every value is a ?
    private static final String WHERE = " WHERE (b.title LIKE ? OR b.author LIKE ?) AND (? = 0 OR b.categoryId = ?)";

    private static void bindFilter(PreparedStatement ps, String keyword, int categoryId) throws SQLException {
        String like = "%" + keyword + "%";
        ps.setString(1, like);
        ps.setString(2, like);
        ps.setInt(3, categoryId);
        ps.setInt(4, categoryId);
    }

    public int count(String keyword, int categoryId) throws SQLException {
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Book b" + WHERE)) {
            bindFilter(ps, keyword, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();                                     // COUNT(*) always returns exactly one row
                return rs.getInt(1);
            }
        }
    }

    public List&lt;Book&gt; search(String keyword, int categoryId, int page, int pageSize) throws SQLException {
        String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
                + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id" + WHERE
                + " ORDER BY b.id"
                + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";       // SQL Server 2012+: skip (page-1)*size rows, take size
        List&lt;Book&gt; list = new ArrayList&lt;&gt;();
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            bindFilter(ps, keyword, categoryId);
            ps.setInt(5, (page - 1) * pageSize);
            ps.setInt(6, pageSize);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(map(rs));
                }
            }
        }
        return list;
    }

    public Book getById(int id) throws SQLException {
        String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
                + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id WHERE b.id = ?";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;             // null ⇒ the servlet answers 404
            }
        }
    }

    public void insert(Book b) throws SQLException {
        String sql = "INSERT INTO Book (title, author, categoryId, publishYear, quantity) VALUES (?, ?, ?, ?, ?)";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setInt(3, b.getCategoryId());
            ps.setInt(4, b.getPublishYear());
            ps.setInt(5, b.getQuantity());
            ps.executeUpdate();                                // INSERT/UPDATE/DELETE ⇒ executeUpdate, never executeQuery
        }
    }

    public int update(Book b) throws SQLException {
        String sql = "UPDATE Book SET title = ?, author = ?, categoryId = ?, publishYear = ?, quantity = ? WHERE id = ?";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setInt(3, b.getCategoryId());
            ps.setInt(4, b.getPublishYear());
            ps.setInt(5, b.getQuantity());
            ps.setInt(6, b.getId());                           // WITHOUT this WHERE every book is overwritten
            return ps.executeUpdate();
        }
    }

    public int delete(int id) throws SQLException {
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement("DELETE FROM Book WHERE id = ?")) {
            ps.setInt(1, id);
            return ps.executeUpdate();
        }
    }

    private static Book map(ResultSet rs) throws SQLException {
        Book b = new Book();
        b.setId(rs.getInt("id"));
        b.setTitle(rs.getString("title"));
        b.setAuthor(rs.getString("author"));
        b.setCategoryId(rs.getInt("categoryId"));
        b.setCategoryName(rs.getString("categoryName"));
        b.setPublishYear(rs.getInt("publishYear"));
        b.setQuantity(rs.getInt("quantity"));
        return b;
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=docgia&amp;password=sai</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Library — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="docgia"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The wrong login stays on the page with the message and keeps <code>docgia</code> in the box (<code>value="&lt;c:out value='…param.username'/&gt;"</code> — <code>c:out</code> escapes it, so a username containing <code>"&gt;&lt;script&gt;</code> cannot break the page). The classic injection is harmless because of the <code>?</code> placeholders — note how <code>c:out</code> printed the apostrophe as <code>&amp;#039;</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 31

username=thuthu%27--&amp;password=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Library — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="thuthu&amp;#039;--"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p>Now the MEMBER tries the librarian's pages — by URL and by a raw POST, which is exactly how an examiner checks that the protection is not just a hidden button:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 250

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;docgia (MEMBER) cannot add, edit or delete books.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe1-thu-vien/book/list"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 250

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;docgia (MEMBER) cannot add, edit or delete books.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe1-thu-vien/book/list"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p>Three details earn the Q1 marks: (1) <code>getSession(false)</code> in the Filter — checking must not create sessions; (2) <code>return</code> after every <code>sendRedirect</code>/<code>forward</code> — mistake 4 below shows what happens without it; (3) 403 is <em>forwarded</em> (the URL stays, the status is 403), while "not logged in" is <em>redirected</em> (the browser moves to <code>/login</code>).</p>`,
    `<h2>✅ Lời giải từng câu — mọi response bên dưới là thật</h2>
<p>Lời giải là một webapp hoàn chỉnh đã chạy trên Tomcat 10.1 với SQL Server thật. Các request đi đúng thứ tự người chấm hay làm: thử một URL cần bảo vệ, đăng nhập sai, đăng nhập đúng, thử việc vai trò đó không được làm, tìm kiếm, thêm sai, thêm đúng, sửa, xoá, lật trang, đăng xuất. Chỉ khác đề ở context path (<code>/pe1-thu-vien</code>, vì mọi tên app trên trang này phải duy nhất).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fef68ffb133de468ee3e0d6545691413db2894d1.svg" alt="Toàn bộ lời giải: một Filter đứng trước, rồi Controller → DAO → JSP" loading="lazy" /><p class="chu-thich">🧩 Toàn bộ lời giải: một Filter đứng trước, rồi Controller → DAO → JSP</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 1: every request passes the Filter, then Controller, DAO, JSP
left to right direction
actor "Browser" as U
rectangle "AuthFilter\\n@WebFilter(/book/*)\\n\\nno account → 302 /login\\nMEMBER on add/edit/delete → 403" as F
rectangle "Controllers (servlets)\\n/login · /logout\\n/book/list · /book/add\\n/book/edit · /book/delete" as C
rectangle "DAO (package dal)\\nDBContext · AccountDAO\\nBookDAO · CategoryDAO\\nPreparedStatement only" as D
database "SQL Server\\nPRJ301_Pe1ThuVien" as DB
rectangle "Views (WEB-INF/views)\\nlogin.jsp · book-list.jsp\\nbook-form.jsp · 403.jsp\\nJSTL c:forEach, c:url" as V
U --&gt; F : 1. request
F --&gt; C : 2. allowed
C --&gt; D : 3. call
D --&gt; DB : SQL
C --&gt; V : 4. forward + attributes
V --&gt; U : 5. HTML
C ..&gt; U : POST ok → 302 (PRG)
@enduml</code></pre></details>
<p><strong>Cấu trúc project</strong> (cách NetBeans hiển thị — "Source Packages" là <code>src/main/java</code>, "Web Pages" là <code>src/main/webapp</code>):</p>
<pre><code class="language-plaintext">PE1_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   LoginServlet, LogoutServlet, BookListServlet, BookAddServlet,
│  │               BookEditServlet, BookDeleteServlet, BookForm (validation)
│  ├─ dal          DBContext (given), AccountDAO, CategoryDAO, BookDAO
│  ├─ filter       AuthFilter
│  └─ model        Account, Book, Category
├─ Web Pages
│  └─ WEB-INF/views   login.jsp, book-list.jsp, book-form.jsp, 403.jsp
└─ Libraries       mssql-jdbc, jakarta JSTL (given — do not touch)</code></pre>
<p>JSP đặt trong <code>WEB-INF</code> là cố ý: không ai mở thẳng được <code>book-list.jsp</code> để đi vòng qua servlet (và qua Filter). Mọi trang đều tới qua URL của servlet.</p>
<h3>Câu 1 — đăng nhập, đăng xuất, Filter</h3>
<p>Bước 0 là lớp <code>DBContext</code> đề cho sẵn: chỉ điền hàm khởi tạo, không sửa gì khác. Bản của ta đọc biến môi trường chỉ để cùng code chạy được trong container kiểm thử; trong phòng thi bạn viết thẳng <code>"localhost"</code>, <code>"1433"</code>, <code>"sa"</code> và mật khẩu của bạn. Mọi DAO <code>extends DBContext</code> và mỗi hàm mở một kết nối mới trong try-with-resources (bài 5.B giải thích vì sao dùng chung một kết nối là mong manh).</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/DBContext.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private final String serverName;
private final String portNumber;
private final String dbName;
private final String userID;
private final String password;

public DBContext() {
    // Trong phòng thi: "localhost", "1433", CSDL của script, "sa", mật khẩu sa CỦA BẠN
    serverName = env("DB_HOST", "localhost");
    portNumber = env("DB_PORT", "1433");
    dbName = "PRJ301_Pe1ThuVien";
    userID = env("DB_USER", "sa");
    password = env("DB_PASSWORD", "123");
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/DBContext.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Mỗi lần gọi một kết nối MỚI; mọi hàm DAO tự đóng bằng try-with-resources
protected Connection getConnection() throws SQLException {
    try {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    } catch (ClassNotFoundException e) {
        throw new SQLException("mssql-jdbc is missing from the project libraries", e);
    }
    String url = "jdbc:sqlserver://" + serverName + ":" + portNumber + ";databaseName=" + dbName
            + ";encrypt=true;trustServerCertificate=true";
    return DriverManager.getConnection(url, userID, password);
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/AccountDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Trả về tài khoản khi khớp CẢ username VÀ mật khẩu, ngược lại null
public Account login(String username, String password) throws SQLException {
    String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, username);                         // ? = dữ liệu, không bao giờ là SQL: chặn ' OR 1=1 --
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return new Account(rs.getString("username"), rs.getString("fullName"), rs.getString("role"));
            }
            return null;
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");                 // TRƯỚC lần getParameter đầu tiên
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    Account account;
    try {
        account = new AccountDAO().login(username, password);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (account == null) {                                 // sai ⇒ cùng trang, một thông báo, giữ lại username
        request.setAttribute("error", "Invalid username or password");
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        return;
    }
    HttpSession session = request.getSession();
    session.setAttribute("account", account);              // filter và JSP đọc đúng tên này
    response.sendRedirect(request.getContextPath() + "/book/list");
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/filter/AuthFilter.java</code></p>
<pre class="web-src"><code class="language-java">package filter;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Account;

// Câu 1b: mọi trang /book/* cần đăng nhập; thêm/sửa/xoá cần vai trò LIBRARIAN
@WebFilter("/book/*")
public class AuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession(false);
        Account account = (session == null) ? null : (Account) session.getAttribute("account");
        if (account == null) {                                 // 1. chưa đăng nhập ⇒ về trang đăng nhập
            response.sendRedirect(request.getContextPath() + "/login");
            return;                                            // thiếu return thì servlet vẫn chạy
        }
        String path = request.getServletPath();                // "/book/add", "/book/list"…
        boolean writes = path.equals("/book/add") || path.equals("/book/edit") || path.equals("/book/delete");
        if (writes &amp;&amp; !account.isLibrarian()) {                // 2. đã đăng nhập, sai vai trò ⇒ 403
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
            return;
        }
        chain.doFilter(req, resp);                             // 3. được phép
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookListServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.BookDAO;
import dal.CategoryDAO;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Câu 2 + Câu 4: liệt kê, tìm (từ khoá + thể loại) và 5 cuốn mỗi trang — Controller của MVC
@WebServlet("/book/list")
public class BookListServlet extends HttpServlet {
    private static final int PAGE_SIZE = 5;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String keyword = request.getParameter("keyword") == null ? "" : request.getParameter("keyword").trim();
        Integer cat = BookForm.toInt(request.getParameter("categoryId"));
        int categoryId = cat == null ? 0 : cat;                // thiếu / "abc" ⇒ 0 = mọi thể loại
        Integer p = BookForm.toInt(request.getParameter("page"));
        int page = (p == null || p &lt; 1) ? 1 : p;
        try {
            BookDAO dao = new BookDAO();
            int total = dao.count(keyword, categoryId);
            int totalPages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);   // làm tròn lên không cần double
            if (page &gt; totalPages) page = totalPages;          // ?page=99 ⇒ trang cuối, không phải bảng rỗng
            request.setAttribute("books", dao.search(keyword, categoryId, page, PAGE_SIZE));
            request.setAttribute("categories", new CategoryDAO().getAll());
            request.setAttribute("total", total);
            request.setAttribute("page", page);
            request.setAttribute("totalPages", totalPages);
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        request.setAttribute("keyword", keyword);              // để ô tìm kiếm giữ chữ đã gõ
        request.setAttribute("categoryId", categoryId);
        request.getRequestDispatcher("/WEB-INF/views/book-list.jsp").forward(request, response);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Book;

// DAO = lớp DUY NHẤT viết SQL cho Book; servlet không bao giờ đụng JDBC
public class BookDAO extends DBContext {
    // MỘT mệnh đề WHERE cố định cho "từ khoá trong tên HOẶC tác giả" + "thể loại (0 = tất cả)": không ghép chuỗi, mọi giá trị là ?
    private static final String WHERE = " WHERE (b.title LIKE ? OR b.author LIKE ?) AND (? = 0 OR b.categoryId = ?)";

    private static void bindFilter(PreparedStatement ps, String keyword, int categoryId) throws SQLException {
        String like = "%" + keyword + "%";
        ps.setString(1, like);
        ps.setString(2, like);
        ps.setInt(3, categoryId);
        ps.setInt(4, categoryId);
    }

    public int count(String keyword, int categoryId) throws SQLException {
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Book b" + WHERE)) {
            bindFilter(ps, keyword, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();                                     // COUNT(*) luôn trả đúng một dòng
                return rs.getInt(1);
            }
        }
    }

    public List&lt;Book&gt; search(String keyword, int categoryId, int page, int pageSize) throws SQLException {
        String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
                + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id" + WHERE
                + " ORDER BY b.id"
                + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";       // SQL Server 2012+: bỏ qua (page-1)*size dòng, lấy size dòng
        List&lt;Book&gt; list = new ArrayList&lt;&gt;();
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            bindFilter(ps, keyword, categoryId);
            ps.setInt(5, (page - 1) * pageSize);
            ps.setInt(6, pageSize);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(map(rs));
                }
            }
        }
        return list;
    }

    public Book getById(int id) throws SQLException {
        String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
                + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id WHERE b.id = ?";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;             // null ⇒ servlet trả 404
            }
        }
    }

    public void insert(Book b) throws SQLException {
        String sql = "INSERT INTO Book (title, author, categoryId, publishYear, quantity) VALUES (?, ?, ?, ?, ?)";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setInt(3, b.getCategoryId());
            ps.setInt(4, b.getPublishYear());
            ps.setInt(5, b.getQuantity());
            ps.executeUpdate();                                // INSERT/UPDATE/DELETE ⇒ executeUpdate, không bao giờ executeQuery
        }
    }

    public int update(Book b) throws SQLException {
        String sql = "UPDATE Book SET title = ?, author = ?, categoryId = ?, publishYear = ?, quantity = ? WHERE id = ?";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setInt(3, b.getCategoryId());
            ps.setInt(4, b.getPublishYear());
            ps.setInt(5, b.getQuantity());
            ps.setInt(6, b.getId());                           // THIẾU WHERE này là mọi cuốn sách bị ghi đè
            return ps.executeUpdate();
        }
    }

    public int delete(int id) throws SQLException {
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement("DELETE FROM Book WHERE id = ?")) {
            ps.setInt(1, id);
            return ps.executeUpdate();
        }
    }

    private static Book map(ResultSet rs) throws SQLException {
        Book b = new Book();
        b.setId(rs.getInt("id"));
        b.setTitle(rs.getString("title"));
        b.setAuthor(rs.getString("author"));
        b.setCategoryId(rs.getInt("categoryId"));
        b.setCategoryName(rs.getString("categoryName"));
        b.setPublishYear(rs.getInt("publishYear"));
        b.setQuantity(rs.getInt("quantity"));
        return b;
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=docgia&amp;password=sai</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Library — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="docgia"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Đăng nhập sai thì ở lại trang, có thông báo, và ô vẫn giữ <code>docgia</code> (<code>value="&lt;c:out value='…param.username'/&gt;"</code> — <code>c:out</code> thoát ký tự đặc biệt, nên một username chứa <code>"&gt;&lt;script&gt;</code> không phá được trang). Đòn tiêm SQL kinh điển vô hại nhờ các dấu <code>?</code> — để ý <code>c:out</code> in dấu nháy đơn thành <code>&amp;#039;</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 31

username=thuthu%27--&amp;password=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Library — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="thuthu&amp;#039;--"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p>Giờ MEMBER thử vào trang của thủ thư — bằng URL và bằng một POST thô, đúng cách người chấm kiểm xem việc bảo vệ có phải chỉ là giấu nút hay không:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 250

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;docgia (MEMBER) cannot add, edit or delete books.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe1-thu-vien/book/list"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 250

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;docgia (MEMBER) cannot add, edit or delete books.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe1-thu-vien/book/list"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>
<p>Ba chi tiết ăn điểm Câu 1: (1) <code>getSession(false)</code> trong Filter — kiểm tra thì không được tạo session mới; (2) <code>return</code> sau mọi <code>sendRedirect</code>/<code>forward</code> — lỗi 4 bên dưới cho thấy chuyện gì xảy ra nếu thiếu; (3) 403 thì <em>forward</em> (URL giữ nguyên, mã trạng thái 403), còn "chưa đăng nhập" thì <em>redirect</em> (chuyển hướng — trình duyệt đi sang <code>/login</code>).</p>`),
    bi(`<h3>Q2 — list and search (MVC + JSTL)</h3>
<p>The whole filter is ONE fixed SQL text. "Category 0 = all" is written in SQL as <code>(? = 0 OR b.categoryId = ?)</code>, so the code never glues strings together and every value is a <code>?</code>. The <code>%</code> signs go <em>into the value</em> (<code>"%" + keyword + "%"</code>), never inside the SQL quotes — mistake 9 shows the error you get otherwise. SQL Server's default collation is case-insensitive, so <code>LIKE</code> already ignores upper/lower case.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// ONE fixed WHERE for "keyword in title OR author" + "category (0 = all)": no string building, every value is a ?
private static final String WHERE = " WHERE (b.title LIKE ? OR b.author LIKE ?) AND (? = 0 OR b.categoryId = ?)";

private static void bindFilter(PreparedStatement ps, String keyword, int categoryId) throws SQLException {
    String like = "%" + keyword + "%";
    ps.setString(1, like);
    ps.setString(2, like);
    ps.setInt(3, categoryId);
    ps.setInt(4, categoryId);
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Book&gt; search(String keyword, int categoryId, int page, int pageSize) throws SQLException {
    String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
            + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id" + WHERE
            + " ORDER BY b.id"
            + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";       // SQL Server 2012+: skip (page-1)*size rows, take size
    List&lt;Book&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        bindFilter(ps, keyword, categoryId);
        ps.setInt(5, (page - 1) * pageSize);
        ps.setInt(6, pageSize);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(map(rs));
            }
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookListServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String keyword = request.getParameter("keyword") == null ? "" : request.getParameter("keyword").trim();
    Integer cat = BookForm.toInt(request.getParameter("categoryId"));
    int categoryId = cat == null ? 0 : cat;                // missing / "abc" ⇒ 0 = all categories
    Integer p = BookForm.toInt(request.getParameter("page"));
    int page = (p == null || p &lt; 1) ? 1 : p;
    try {
        BookDAO dao = new BookDAO();
        int total = dao.count(keyword, categoryId);
        int totalPages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);   // ceil without double
        if (page &gt; totalPages) page = totalPages;          // ?page=99 ⇒ the last page, not an empty table
        request.setAttribute("books", dao.search(keyword, categoryId, page, PAGE_SIZE));
        request.setAttribute("categories", new CategoryDAO().getAll());
        request.setAttribute("total", total);
        request.setAttribute("page", page);
        request.setAttribute("totalPages", totalPages);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.setAttribute("keyword", keyword);              // so the search box keeps what was typed
    request.setAttribute("categoryId", categoryId);
    request.getRequestDispatcher("/WEB-INF/views/book-list.jsp").forward(request, response);
}</code></pre>
<p>The View only displays. <code>c:forEach</code> builds the rows, <code>c:choose</code> prints "No books found.", and the drop-down marks the chosen category with <code>selected</code>. Text that came from users (title, author) goes through <code>c:out</code>:</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="&lt;c:out value='&#36;{keyword}'/&gt;" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;c:forEach items="&#36;{categories}" var="c"&gt;
    &lt;option value="&#36;{c.id}" &#36;{c.id == categoryId ? 'selected' : ''}&gt;&#36;{c.name}&lt;/option&gt;
    &lt;/c:forEach&gt;
  &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:choose&gt;
&lt;c:when test="&#36;{empty books}"&gt;&lt;p&gt;No books found.&lt;/p&gt;&lt;/c:when&gt;
&lt;c:otherwise&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;c:if test="&#36;{sessionScope.account.librarian}"&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/c:if&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{books}" var="b"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{b.id}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{b.title}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{b.author}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{b.categoryName}&lt;/td&gt;&lt;td&gt;&#36;{b.publishYear}&lt;/td&gt;&lt;td&gt;&#36;{b.quantity}&lt;/td&gt;
    &lt;c:if test="&#36;{sessionScope.account.librarian}"&gt;&lt;td&gt;&lt;a href="edit?id=&#36;{b.id}"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="&#36;{b.id}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/c:if&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Văn Minh (MEMBER) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Clean Code&lt;/td&gt;&lt;td&gt;Robert C. Martin&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Spring in Action&lt;/td&gt;&lt;td&gt;Craig Walls&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 1/3:
&amp;nbsp;[1]&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=3"&gt;3&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The MEMBER sees no Action column and no "Add a book" link (<code>c:if test="…account.librarian"</code> calls <code>isLibrarian()</code>). That is only comfort for the user; the real protection is the Filter you just saw answer 403. The librarian searches "java" in all categories — title OR author, any case:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=java&amp;categoryId=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="java" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=1"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=2"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=3"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Murach&amp;#039;s Java Servlets and JSP&lt;/td&gt;&lt;td&gt;Joel Murach&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2014&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=6"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=python&amp;categoryId=1 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="python" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" selected&gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;p&gt;No books found.&lt;/p&gt;&lt;p&gt;0 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h3>Câu 2 — liệt kê và tìm kiếm (MVC + JSTL)</h3>
<p>Toàn bộ bộ lọc là MỘT câu SQL cố định. "Thể loại 0 = tất cả" được viết ngay trong SQL bằng <code>(? = 0 OR b.categoryId = ?)</code>, nên code không bao giờ ghép chuỗi và mọi giá trị đều là một <code>?</code>. Dấu <code>%</code> nằm <em>trong giá trị</em> (<code>"%" + keyword + "%"</code>), không bao giờ nằm trong dấu nháy của SQL — lỗi 9 cho thấy lỗi bạn gặp nếu làm khác. Collation (quy tắc so sánh chữ) mặc định của SQL Server không phân biệt hoa thường, nên <code>LIKE</code> đã tự bỏ qua chữ hoa/thường.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// MỘT mệnh đề WHERE cố định cho "từ khoá trong tên HOẶC tác giả" + "thể loại (0 = tất cả)": không ghép chuỗi, mọi giá trị là ?
private static final String WHERE = " WHERE (b.title LIKE ? OR b.author LIKE ?) AND (? = 0 OR b.categoryId = ?)";

private static void bindFilter(PreparedStatement ps, String keyword, int categoryId) throws SQLException {
    String like = "%" + keyword + "%";
    ps.setString(1, like);
    ps.setString(2, like);
    ps.setInt(3, categoryId);
    ps.setInt(4, categoryId);
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Book&gt; search(String keyword, int categoryId, int page, int pageSize) throws SQLException {
    String sql = "SELECT b.id, b.title, b.author, b.categoryId, c.name AS categoryName, b.publishYear, b.quantity"
            + " FROM Book b INNER JOIN Category c ON b.categoryId = c.id" + WHERE
            + " ORDER BY b.id"
            + " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";       // SQL Server 2012+: bỏ qua (page-1)*size dòng, lấy size dòng
    List&lt;Book&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        bindFilter(ps, keyword, categoryId);
        ps.setInt(5, (page - 1) * pageSize);
        ps.setInt(6, pageSize);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(map(rs));
            }
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookListServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String keyword = request.getParameter("keyword") == null ? "" : request.getParameter("keyword").trim();
    Integer cat = BookForm.toInt(request.getParameter("categoryId"));
    int categoryId = cat == null ? 0 : cat;                // thiếu / "abc" ⇒ 0 = mọi thể loại
    Integer p = BookForm.toInt(request.getParameter("page"));
    int page = (p == null || p &lt; 1) ? 1 : p;
    try {
        BookDAO dao = new BookDAO();
        int total = dao.count(keyword, categoryId);
        int totalPages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);   // làm tròn lên không cần double
        if (page &gt; totalPages) page = totalPages;          // ?page=99 ⇒ trang cuối, không phải bảng rỗng
        request.setAttribute("books", dao.search(keyword, categoryId, page, PAGE_SIZE));
        request.setAttribute("categories", new CategoryDAO().getAll());
        request.setAttribute("total", total);
        request.setAttribute("page", page);
        request.setAttribute("totalPages", totalPages);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.setAttribute("keyword", keyword);              // để ô tìm kiếm giữ chữ đã gõ
    request.setAttribute("categoryId", categoryId);
    request.getRequestDispatcher("/WEB-INF/views/book-list.jsp").forward(request, response);
}</code></pre>
<p>View chỉ hiển thị. <code>c:forEach</code> dựng các dòng, <code>c:choose</code> in "No books found.", ô chọn đánh dấu thể loại đang chọn bằng <code>selected</code>. Chữ do người dùng nhập (tên sách, tác giả) đi qua <code>c:out</code>:</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="&lt;c:out value='&#36;{keyword}'/&gt;" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;c:forEach items="&#36;{categories}" var="c"&gt;
    &lt;option value="&#36;{c.id}" &#36;{c.id == categoryId ? 'selected' : ''}&gt;&#36;{c.name}&lt;/option&gt;
    &lt;/c:forEach&gt;
  &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:choose&gt;
&lt;c:when test="&#36;{empty books}"&gt;&lt;p&gt;No books found.&lt;/p&gt;&lt;/c:when&gt;
&lt;c:otherwise&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;c:if test="&#36;{sessionScope.account.librarian}"&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/c:if&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{books}" var="b"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{b.id}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{b.title}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{b.author}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{b.categoryName}&lt;/td&gt;&lt;td&gt;&#36;{b.publishYear}&lt;/td&gt;&lt;td&gt;&#36;{b.quantity}&lt;/td&gt;
    &lt;c:if test="&#36;{sessionScope.account.librarian}"&gt;&lt;td&gt;&lt;a href="edit?id=&#36;{b.id}"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="&#36;{b.id}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/c:if&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Văn Minh (MEMBER) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Clean Code&lt;/td&gt;&lt;td&gt;Robert C. Martin&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Spring in Action&lt;/td&gt;&lt;td&gt;Craig Walls&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 1/3:
&amp;nbsp;[1]&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=3"&gt;3&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>MEMBER không thấy cột Action và link "Add a book" (<code>c:if test="…account.librarian"</code> gọi <code>isLibrarian()</code>). Đó chỉ là tiện cho người dùng; bảo vệ thật là Filter vừa trả 403 ở trên. Thủ thư tìm "java" ở mọi thể loại — trong tên HOẶC tác giả, hoa thường gì cũng được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=java&amp;categoryId=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="java" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=1"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=2"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=3"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Murach&amp;#039;s Java Servlets and JSP&lt;/td&gt;&lt;td&gt;Joel Murach&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2014&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=6"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=python&amp;categoryId=1 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="python" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" selected&gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;p&gt;No books found.&lt;/p&gt;&lt;p&gt;0 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h3>Q3 — add, edit, delete with server-side validation</h3>
<p><code>BookForm</code> keeps what the user <em>typed</em> as text (so "năm 1943" can be shown back in the box), checks every rule, and collects one message per field. A number is read with a helper that returns <code>null</code> instead of throwing — a 500 page is a lost mark, a message is not.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookForm.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The paper's rules, checked on the SERVER (HTML "required" is only a hint: a raw POST skips it)
public boolean validate(boolean categoryExists) {
    if (title.isEmpty()) errors.put("title", "Title is required");
    else if (title.length() &gt; 150) errors.put("title", "Title must be at most 150 characters");
    if (author.isEmpty()) errors.put("author", "Author is required");
    else if (author.length() &gt; 100) errors.put("author", "Author must be at most 100 characters");
    if (!categoryExists) errors.put("categoryId", "Choose a category");
    Integer year = toInt(publishYear);
    if (year == null || year &lt; 1800 || year &gt; 2026) errors.put("publishYear", "Year must be a whole number from 1800 to 2026");
    Integer qty = toInt(quantity);
    if (qty == null || qty &lt; 0) errors.put("quantity", "Quantity must be a whole number &gt;= 0");
    return errors.isEmpty();
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookAddServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    BookForm form = BookForm.fromRequest(request);
    try {
        Integer cat = BookForm.toInt(form.getCategoryId());
        if (!form.validate(cat != null &amp;&amp; new CategoryDAO().exists(cat))) {
            show(request, response, form);                 // wrong ⇒ the same form, the typed values, the messages
            return;
        }
        new BookDAO().insert(form.toBook());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect(request.getContextPath() + "/book/list");   // Post/Redirect/Get: F5 will not insert twice
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 65

title=++&amp;author=Nam+Cao&amp;categoryId=3&amp;publishYear=3000&amp;quantity=-1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a book&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  &lt;input type="hidden" name="id" value=""&gt;
  Title &lt;input name="title" value=""&gt; &lt;span class="error"&gt;Title is required&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Nam Cao"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="3000"&gt; &lt;span class="error"&gt;Year must be a whole number from 1800 to 2026&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="-1"&gt; &lt;span class="error"&gt;Quantity must be a whole number &gt;= 0&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>All three wrong fields have their message, the good field (author) kept "Nam Cao". The second try sends words where numbers belong and a category that does not exist — still no 500:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 93

title=L%C3%A3o+H%E1%BA%A1c&amp;author=Nam+Cao&amp;categoryId=9&amp;publishYear=n%C4%83m+1943&amp;quantity=2.5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a book&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  &lt;input type="hidden" name="id" value=""&gt;
  Title &lt;input name="title" value="Lão Hạc"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Nam Cao"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;Choose a category&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="năm 1943"&gt; &lt;span class="error"&gt;Year must be a whole number from 1800 to 2026&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="2.5"&gt; &lt;span class="error"&gt;Quantity must be a whole number &gt;= 0&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 82

title=L%C3%A3o+H%E1%BA%A1c&amp;author=Nam+Cao&amp;categoryId=3&amp;publishYear=1943&amp;quantity=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=Nam+Cao&amp;categoryId=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="Nam Cao" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lão Hạc&lt;/td&gt;&lt;td&gt;Nam Cao&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1943&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=15"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="15"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;1 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The correct POST answers <strong>302</strong> to <code>/book/list</code>: the browser's last request becomes a GET, so F5 cannot insert "Lão Hạc" twice (Post/Redirect/Get, lesson 6.4). Edit reuses the same form, filled from the database; an unknown id is a clean 404:</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookEditServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Integer id = BookForm.toInt(request.getParameter("id"));
    Book book;
    try {
        book = (id == null) ? null : new BookDAO().getById(id);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (book == null) {                                    // ?id=abc or ?id=999 ⇒ 404, not a 500 NullPointerException
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Book not found");
        return;
    }
    BookAddServlet.show(request, response, BookForm.fromBook(book));
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/edit?id=13 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit book #13&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
  &lt;input type="hidden" name="id" value="13"&gt;
  Title &lt;input name="title" value="Tắt đèn"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Ngô Tất Tố"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="1939"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="0"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 117

id=13&amp;title=T%E1%BA%AFt+%C4%91%C3%A8n&amp;author=Ng%C3%B4+T%E1%BA%A5t+T%E1%BB%91&amp;categoryId=3&amp;publishYear=1939&amp;quantity=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/edit?id=999 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 719

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message Book not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 5

id=15</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=&amp;categoryId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;Dế Mèn phiêu lưu ký&lt;/td&gt;&lt;td&gt;Tô Hoài&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1941&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=11"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="11"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Số đỏ&lt;/td&gt;&lt;td&gt;Vũ Trọng Phụng&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1936&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=12"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="12"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Tắt đèn&lt;/td&gt;&lt;td&gt;Ngô Tất Tố&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1939&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=13"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="13"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;Cho tôi xin một vé đi tuổi thơ&lt;/td&gt;&lt;td&gt;Nguyễn Nhật Ánh&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;7&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=14"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="14"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>"Tắt đèn" now has quantity 5 (it was 0) and "Lão Hạc" (id 15) is gone. Delete is a POST form, not an <code>&lt;a href="delete?id=…"&gt;</code> link: a GET that changes data can be fired by a prefetching browser or a crawler.</p>`,
    `<h3>Câu 3 — thêm, sửa, xoá có kiểm tra phía server</h3>
<p><code>BookForm</code> giữ nguyên chữ người dùng <em>đã gõ</em> dưới dạng chuỗi (để "năm 1943" vẫn hiện lại được trong ô), kiểm từng luật, và gom mỗi ô sai một thông báo. Số được đọc bằng một hàm trả <code>null</code> thay vì ném lỗi — trang 500 là mất điểm, một dòng thông báo thì không.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookForm.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Luật của đề, kiểm ở SERVER (thuộc tính "required" của HTML chỉ là gợi ý: một POST thô bỏ qua nó)
public boolean validate(boolean categoryExists) {
    if (title.isEmpty()) errors.put("title", "Title is required");
    else if (title.length() &gt; 150) errors.put("title", "Title must be at most 150 characters");
    if (author.isEmpty()) errors.put("author", "Author is required");
    else if (author.length() &gt; 100) errors.put("author", "Author must be at most 100 characters");
    if (!categoryExists) errors.put("categoryId", "Choose a category");
    Integer year = toInt(publishYear);
    if (year == null || year &lt; 1800 || year &gt; 2026) errors.put("publishYear", "Year must be a whole number from 1800 to 2026");
    Integer qty = toInt(quantity);
    if (qty == null || qty &lt; 0) errors.put("quantity", "Quantity must be a whole number &gt;= 0");
    return errors.isEmpty();
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookAddServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    BookForm form = BookForm.fromRequest(request);
    try {
        Integer cat = BookForm.toInt(form.getCategoryId());
        if (!form.validate(cat != null &amp;&amp; new CategoryDAO().exists(cat))) {
            show(request, response, form);                 // sai ⇒ cùng form, giữ chữ đã gõ, kèm thông báo
            return;
        }
        new BookDAO().insert(form.toBook());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect(request.getContextPath() + "/book/list");   // Post/Redirect/Get: F5 không thêm lần hai
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 65

title=++&amp;author=Nam+Cao&amp;categoryId=3&amp;publishYear=3000&amp;quantity=-1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a book&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  &lt;input type="hidden" name="id" value=""&gt;
  Title &lt;input name="title" value=""&gt; &lt;span class="error"&gt;Title is required&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Nam Cao"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="3000"&gt; &lt;span class="error"&gt;Year must be a whole number from 1800 to 2026&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="-1"&gt; &lt;span class="error"&gt;Quantity must be a whole number &gt;= 0&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Cả ba ô sai đều có thông báo riêng, ô đúng (tác giả) vẫn giữ "Nam Cao". Lần thử thứ hai gửi chữ vào chỗ cần số và một thể loại không tồn tại — vẫn không có trang 500:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 93

title=L%C3%A3o+H%E1%BA%A1c&amp;author=Nam+Cao&amp;categoryId=9&amp;publishYear=n%C4%83m+1943&amp;quantity=2.5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a book&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  &lt;input type="hidden" name="id" value=""&gt;
  Title &lt;input name="title" value="Lão Hạc"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Nam Cao"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;Choose a category&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="năm 1943"&gt; &lt;span class="error"&gt;Year must be a whole number from 1800 to 2026&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="2.5"&gt; &lt;span class="error"&gt;Quantity must be a whole number &gt;= 0&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 82

title=L%C3%A3o+H%E1%BA%A1c&amp;author=Nam+Cao&amp;categoryId=3&amp;publishYear=1943&amp;quantity=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=Nam+Cao&amp;categoryId=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="Nam Cao" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lão Hạc&lt;/td&gt;&lt;td&gt;Nam Cao&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1943&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=15"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="15"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;1 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>POST đúng trả <strong>302</strong> về <code>/book/list</code>: request cuối của trình duyệt thành một GET, nên F5 không thể thêm "Lão Hạc" lần hai (Post/Redirect/Get, bài 6.4). Sửa dùng lại đúng form đó, điền sẵn từ CSDL; id không có thì trả 404 gọn gàng:</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/controller/BookEditServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Integer id = BookForm.toInt(request.getParameter("id"));
    Book book;
    try {
        book = (id == null) ? null : new BookDAO().getById(id);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (book == null) {                                    // ?id=abc hoặc ?id=999 ⇒ 404, không phải 500 NullPointerException
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Book not found");
        return;
    }
    BookAddServlet.show(request, response, BookForm.fromBook(book));
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/edit?id=13 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit book&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit book #13&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
  &lt;input type="hidden" name="id" value="13"&gt;
  Title &lt;input name="title" value="Tắt đèn"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Author &lt;input name="author" value="Ngô Tất Tố"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Category &lt;select name="categoryId"&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Year &lt;input name="publishYear" value="1939"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Quantity &lt;input name="quantity" value="0"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="list"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 117

id=13&amp;title=T%E1%BA%AFt+%C4%91%C3%A8n&amp;author=Ng%C3%B4+T%E1%BA%A5t+T%E1%BB%91&amp;categoryId=3&amp;publishYear=1939&amp;quantity=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/edit?id=999 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 719

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message Book not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-thu-vien/book/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 5

id=15</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/book/list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=&amp;categoryId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" selected&gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;Dế Mèn phiêu lưu ký&lt;/td&gt;&lt;td&gt;Tô Hoài&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1941&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=11"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="11"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Số đỏ&lt;/td&gt;&lt;td&gt;Vũ Trọng Phụng&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1936&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=12"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="12"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Tắt đèn&lt;/td&gt;&lt;td&gt;Ngô Tất Tố&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1939&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=13"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="13"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;Cho tôi xin một vé đi tuổi thơ&lt;/td&gt;&lt;td&gt;Nguyễn Nhật Ánh&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;7&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=14"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="14"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 book(s) — page 1/1:
&amp;nbsp;[1]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>"Tắt đèn" giờ có số lượng 5 (trước là 0) và "Lão Hạc" (id 15) đã biến mất. Xoá là một form POST, không phải link <code>&lt;a href="delete?id=…"&gt;</code>: một GET làm thay đổi dữ liệu có thể bị trình duyệt tải trước (prefetch) hoặc bot thu thập (crawler) kích hoạt.</p>`),
    bi(`<h3>Q4 — pagination in the database</h3>
<p>Two queries with the SAME filter: <code>COUNT(*)</code> gives the total, then <code>ORDER BY … OFFSET (page-1)*5 ROWS FETCH NEXT 5 ROWS ONLY</code> brings exactly one page (SQL Server 2012+; <code>OFFSET</code> needs an <code>ORDER BY</code>). The number of pages is the ceiling of total/5 computed with integers: <code>(total + 4) / 5</code>, at least 1.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public int count(String keyword, int categoryId) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Book b" + WHERE)) {
        bindFilter(ps, keyword, categoryId);
        try (ResultSet rs = ps.executeQuery()) {
            rs.next();                                     // COUNT(*) always returns exactly one row
            return rs.getInt(1);
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;&#36;{total} book(s) — page &#36;{page}/&#36;{totalPages}:
&lt;c:forEach begin="1" end="&#36;{totalPages}" var="i"&gt;
  &lt;c:url value="list" var="link"&gt;&lt;c:param name="keyword" value="&#36;{keyword}"/&gt;&lt;c:param name="categoryId" value="&#36;{categoryId}"/&gt;&lt;c:param name="page" value="&#36;{i}"/&gt;&lt;/c:url&gt;
  &lt;c:choose&gt;&lt;c:when test="&#36;{i == page}"&gt;&amp;nbsp;[&#36;{i}]&lt;/c:when&gt;&lt;c:otherwise&gt;&amp;nbsp;&lt;a href="&#36;{link}"&gt;&#36;{i}&lt;/a&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;
&lt;/c:forEach&gt;
&lt;/p&gt;</code></pre>
<p><code>c:url</code> + <code>c:param</code> build each link and <em>encode</em> the values, so a keyword like "Nam Cao" or "Văn học" survives in the URL. The page links keep keyword and category:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=a&amp;categoryId=1&amp;page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="a" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" selected&gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Murach&amp;#039;s Java Servlets and JSP&lt;/td&gt;&lt;td&gt;Joel Murach&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2014&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=6"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;6 book(s) — page 2/2:
&amp;nbsp;&lt;a href="list?keyword=a&amp;categoryId=1&amp;page=1"&gt;1&lt;/a&gt;&amp;nbsp;[2]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?page=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;Dế Mèn phiêu lưu ký&lt;/td&gt;&lt;td&gt;Tô Hoài&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1941&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=11"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="11"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Số đỏ&lt;/td&gt;&lt;td&gt;Vũ Trọng Phụng&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1936&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=12"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="12"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Tắt đèn&lt;/td&gt;&lt;td&gt;Ngô Tất Tố&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1939&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=13"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="13"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;Cho tôi xin một vé đi tuổi thơ&lt;/td&gt;&lt;td&gt;Nguyễn Nhật Ánh&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;7&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=14"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="14"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 3/3:
&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=1"&gt;1&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;[3]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?page=abc&amp;keyword=&amp;categoryId=xyz HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=1"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=2"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=3"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Clean Code&lt;/td&gt;&lt;td&gt;Robert C. Martin&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=4"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Spring in Action&lt;/td&gt;&lt;td&gt;Craig Walls&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=5"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 1/3:
&amp;nbsp;[1]&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=3"&gt;3&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Page 99 does not show an empty table: the servlet clamps it to the last page (3/3); <code>page=abc&amp;categoryId=xyz</code> falls back to page 1 of all categories instead of a NumberFormatException. Last check of the paper — after logout, even the Back button cannot reach a librarian page:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>`,
    `<h3>Câu 4 — phân trang bằng CSDL</h3>
<p>Hai câu truy vấn với CÙNG một bộ lọc: <code>COUNT(*)</code> cho tổng số, rồi <code>ORDER BY … OFFSET (page-1)*5 ROWS FETCH NEXT 5 ROWS ONLY</code> lấy đúng một trang (SQL Server 2012 trở lên; <code>OFFSET</code> bắt buộc đi kèm <code>ORDER BY</code>). Số trang là tổng/5 làm tròn lên, tính bằng số nguyên: <code>(total + 4) / 5</code>, ít nhất là 1.</p>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/java/dal/BookDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public int count(String keyword, int categoryId) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Book b" + WHERE)) {
        bindFilter(ps, keyword, categoryId);
        try (ResultSet rs = ps.executeQuery()) {
            rs.next();                                     // COUNT(*) luôn trả đúng một dòng
            return rs.getInt(1);
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe1-thu-vien/src/main/webapp/WEB-INF/views/book-list.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;&#36;{total} book(s) — page &#36;{page}/&#36;{totalPages}:
&lt;c:forEach begin="1" end="&#36;{totalPages}" var="i"&gt;
  &lt;c:url value="list" var="link"&gt;&lt;c:param name="keyword" value="&#36;{keyword}"/&gt;&lt;c:param name="categoryId" value="&#36;{categoryId}"/&gt;&lt;c:param name="page" value="&#36;{i}"/&gt;&lt;/c:url&gt;
  &lt;c:choose&gt;&lt;c:when test="&#36;{i == page}"&gt;&amp;nbsp;[&#36;{i}]&lt;/c:when&gt;&lt;c:otherwise&gt;&amp;nbsp;&lt;a href="&#36;{link}"&gt;&#36;{i}&lt;/a&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;
&lt;/c:forEach&gt;
&lt;/p&gt;</code></pre>
<p><code>c:url</code> + <code>c:param</code> dựng từng link và <em>mã hoá</em> (encode) giá trị, nên một từ khoá như "Nam Cao" hay "Văn học" vẫn nguyên vẹn trên URL. Link trang giữ cả từ khoá và thể loại:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?keyword=a&amp;categoryId=1&amp;page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="a" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" selected&gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Murach&amp;#039;s Java Servlets and JSP&lt;/td&gt;&lt;td&gt;Joel Murach&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2014&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=6"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;6 book(s) — page 2/2:
&amp;nbsp;&lt;a href="list?keyword=a&amp;categoryId=1&amp;page=1"&gt;1&lt;/a&gt;&amp;nbsp;[2]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?page=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;Dế Mèn phiêu lưu ký&lt;/td&gt;&lt;td&gt;Tô Hoài&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1941&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=11"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="11"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Số đỏ&lt;/td&gt;&lt;td&gt;Vũ Trọng Phụng&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1936&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=12"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="12"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Tắt đèn&lt;/td&gt;&lt;td&gt;Ngô Tất Tố&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;1939&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=13"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="13"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;Cho tôi xin một vé đi tuổi thơ&lt;/td&gt;&lt;td&gt;Nguyễn Nhật Ánh&lt;/td&gt;&lt;td&gt;Văn học&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;7&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=14"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="14"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 3/3:
&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=1"&gt;1&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;[3]&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/list?page=abc&amp;keyword=&amp;categoryId=xyz HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Books&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Thị Thu (LIBRARIAN) | &lt;a href="/pe1-thu-vien/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="list" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="title or author"&gt;
  &lt;select name="categoryId"&gt;
    &lt;option value="0"&gt;All categories&lt;/option&gt;
    &lt;option value="1" &gt;Programming&lt;/option&gt;
    &lt;option value="2" &gt;Database&lt;/option&gt;
    &lt;option value="3" &gt;Văn học&lt;/option&gt;
    &lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a book&lt;/a&gt;&lt;/p&gt;&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Title&lt;/th&gt;&lt;th&gt;Author&lt;/th&gt;&lt;th&gt;Category&lt;/th&gt;&lt;th&gt;Year&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Action&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Head First Java&lt;/td&gt;&lt;td&gt;Kathy Sierra&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=1"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Effective Java&lt;/td&gt;&lt;td&gt;Joshua Bloch&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2018&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=2"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Java Concurrency in Practice&lt;/td&gt;&lt;td&gt;Brian Goetz&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2006&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=3"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Clean Code&lt;/td&gt;&lt;td&gt;Robert C. Martin&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2008&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=4"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Spring in Action&lt;/td&gt;&lt;td&gt;Craig Walls&lt;/td&gt;&lt;td&gt;Programming&lt;/td&gt;&lt;td&gt;2022&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?id=5"&gt;Edit&lt;/a&gt; &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;14 book(s) — page 1/3:
&amp;nbsp;[1]&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=2"&gt;2&lt;/a&gt;&amp;nbsp;&lt;a href="list?keyword=&amp;categoryId=0&amp;page=3"&gt;3&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Trang 99 không ra bảng rỗng: servlet kéo nó về trang cuối (3/3); <code>page=abc&amp;categoryId=xyz</code> quay về trang 1 của mọi thể loại thay vì một NumberFormatException. Phép kiểm cuối của đề — sau khi đăng xuất, kể cả nút Back cũng không vào được trang của thủ thư:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-thu-vien/book/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-thu-vien/login
Content-Length: 0</code></pre>`),
    bi(`<h2>🧮 Self-marking guide (10 points)</h2>
<p>The school does not publish PE marking guides; this one is written for this mock paper, in the way examiners usually work: <strong>open the URL, do the action, look at the screen and the table</strong>. Mark each line 0 or full (half only where written). Use a private window so an old session does not hide a bug.</p>
<table>
<thead><tr><th>Q</th><th>What the examiner does</th><th>Expected</th><th>Points</th></tr></thead>
<tbody>
<tr><td>1a</td><td><code>/login</code>, wrong password</td><td>same page, message, username kept</td><td>0.5</td></tr>
<tr><td>1a</td><td>correct login</td><td>302 → <code>/book/list</code>, "Welcome, Trần Văn Minh (MEMBER)"</td><td>0.5</td></tr>
<tr><td>1a</td><td>Logout, then Back / <code>/book/list</code></td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1b</td><td><code>/book/list</code> in a new private window</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1b</td><td>MEMBER opens <code>/book/add</code>, posts <code>/book/delete</code></td><td>403, "Access denied", nothing deleted</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/book/list</code></td><td>5 rows, category NAMES, JSTL (open the JSP: no <code>&lt;%</code> scriptlet)</td><td>1.0</td></tr>
<tr><td>2</td><td>keyword <code>java</code></td><td>4 books (title or author, any case)</td><td>0.75</td></tr>
<tr><td>2</td><td>category <code>Văn học</code></td><td>only Vietnamese novels; drop-down from the table</td><td>0.5</td></tr>
<tr><td>2</td><td>search kept / no result</td><td>box and drop-down keep values; "No books found."</td><td>0.75</td></tr>
<tr><td>3</td><td>add with empty title, year 3000, qty -1</td><td>three messages, values kept, no 500 (0.25 each)</td><td>0.75</td></tr>
<tr><td>3</td><td>add a correct book, then F5</td><td>302 to the list; ONE new row in SSMS</td><td>0.5</td></tr>
<tr><td>3</td><td>Edit a row; <code>edit?id=999</code></td><td>form filled, saved; 404 for 999 (0.5 + 0.25)</td><td>0.75</td></tr>
<tr><td>3</td><td>Delete</td><td>row gone in the list and in SSMS</td><td>0.5</td></tr>
<tr><td>4</td><td>pages</td><td>5 per page, <code>OFFSET … FETCH</code> in the DAO</td><td>1.0</td></tr>
<tr><td>4</td><td>page links after a search</td><td>links keep keyword + categoryId, "page x/y"</td><td>0.5</td></tr>
<tr><td>4</td><td><code>page=0</code>, <code>page=abc</code>, <code>page=99</code></td><td>page 1, page 1, last page</td><td>0.5</td></tr>
</tbody>
</table>`,
    `<h2>🧮 Barem tự chấm (10 điểm)</h2>
<p>Trường không công bố barem PE; barem này soạn riêng cho đề mô phỏng, theo cách người chấm thường làm: <strong>mở URL, làm thao tác, nhìn màn hình và nhìn bảng trong CSDL</strong>. Mỗi dòng chấm 0 hoặc đủ điểm (chỉ chia nhỏ ở chỗ có ghi). Dùng cửa sổ ẩn danh để session cũ không che mất lỗi.</p>
<table>
<thead><tr><th>Câu</th><th>Người chấm làm gì</th><th>Kết quả đúng</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>1a</td><td><code>/login</code>, sai mật khẩu</td><td>cùng trang, có thông báo, giữ username</td><td>0.5</td></tr>
<tr><td>1a</td><td>đăng nhập đúng</td><td>302 → <code>/book/list</code>, "Welcome, Trần Văn Minh (MEMBER)"</td><td>0.5</td></tr>
<tr><td>1a</td><td>Logout, rồi Back / <code>/book/list</code></td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1b</td><td><code>/book/list</code> trong cửa sổ ẩn danh mới</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1b</td><td>MEMBER mở <code>/book/add</code>, POST <code>/book/delete</code></td><td>403, "Access denied", không xoá gì</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/book/list</code></td><td>5 dòng, TÊN thể loại, dùng JSTL (mở JSP: không có scriptlet <code>&lt;%</code>)</td><td>1.0</td></tr>
<tr><td>2</td><td>từ khoá <code>java</code></td><td>4 cuốn (tên hoặc tác giả, hoa thường gì cũng được)</td><td>0.75</td></tr>
<tr><td>2</td><td>thể loại <code>Văn học</code></td><td>chỉ sách văn học; ô chọn lấy từ bảng</td><td>0.5</td></tr>
<tr><td>2</td><td>giữ điều kiện / không có kết quả</td><td>ô tìm và ô chọn giữ giá trị; "No books found."</td><td>0.75</td></tr>
<tr><td>3</td><td>thêm với tên trống, năm 3000, số lượng -1</td><td>ba thông báo, giữ chữ đã gõ, không 500 (0.25 mỗi ý)</td><td>0.75</td></tr>
<tr><td>3</td><td>thêm sách đúng, rồi F5</td><td>302 về danh sách; trong SSMS chỉ MỘT dòng mới</td><td>0.5</td></tr>
<tr><td>3</td><td>Edit một dòng; <code>edit?id=999</code></td><td>form điền sẵn, lưu được; 404 cho 999 (0.5 + 0.25)</td><td>0.75</td></tr>
<tr><td>3</td><td>Delete</td><td>dòng biến mất ở danh sách và trong SSMS</td><td>0.5</td></tr>
<tr><td>4</td><td>lật trang</td><td>5 cuốn mỗi trang, DAO dùng <code>OFFSET … FETCH</code></td><td>1.0</td></tr>
<tr><td>4</td><td>link trang sau khi tìm</td><td>link giữ keyword + categoryId, có "page x/y"</td><td>0.5</td></tr>
<tr><td>4</td><td><code>page=0</code>, <code>page=abc</code>, <code>page=99</code></td><td>trang 1, trang 1, trang cuối</td><td>0.5</td></tr>
</tbody>
</table>`),
    bi(`<h2>🪤 Ten mistakes that cost marks — each one run for real</h2>
<p>Each mistake below was built into a small lab app (<code>pe1-loi</code>) and run on the same Tomcat 10.1 + SQL Server. Read the symptom first: in the exam room, recognising the error text is what saves you ten minutes.</p>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>What you see</th><th>Fix</th><th>Marks at risk</th></tr></thead>
<tbody>
<tr><td>1</td><td>password compared with <code>==</code></td><td>correct password → "Invalid username or password"</td><td><code>stored.equals(typed)</code> (or let SQL compare)</td><td>all of Q1</td></tr>
<tr><td>2</td><td>forward path without <code>/</code> or with a wrong folder</td><td>404 "JSP file […] not found"</td><td><code>"/WEB-INF/views/x.jsp"</code> — starts with <code>/</code>, exact folder</td><td>the whole page</td></tr>
<tr><td>3</td><td>session attribute used without a null check</td><td>500 NullPointerException when not logged in</td><td>check <code>null</code> (or let the Filter guarantee it)</td><td>Q1b</td></tr>
<tr><td>4</td><td><code>sendRedirect</code> without <code>return</code> in the Filter</td><td>302 shown, but the servlet STILL runs (a book deleted)</td><td><code>return;</code> after every redirect/forward</td><td>Q1b + data</td></tr>
<tr><td>5</td><td>Filter on <code>/*</code> that also blocks <code>/login</code></td><td>endless 302 to <code>/login</code> (ERR_TOO_MANY_REDIRECTS)</td><td>let <code>/login</code> and static files through</td><td>everything</td></tr>
<tr><td>6</td><td>no <code>request.setCharacterEncoding("UTF-8")</code> on an old server</td><td>"LÃ£o Háº¡c" saved in the database</td><td>set it before the first <code>getParameter</code> (or an encoding Filter)</td><td>Q3</td></tr>
<tr><td>7</td><td>no <code>taglib</code> line in the JSP</td><td><code>&lt;c:forEach&gt;</code> sent raw, empty table</td><td><code>&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;</code></td><td>Q2</td></tr>
<tr><td>8</td><td><code>Integer.parseInt(request.getParameter("page"))</code></td><td>500 "Cannot parse null string" on the first visit</td><td>parse with a default</td><td>Q4</td></tr>
<tr><td>9</td><td><code>LIKE '%?%'</code></td><td>500 "The index 1 is out of range."</td><td><code>LIKE ?</code> + <code>"%" + keyword + "%"</code></td><td>Q2</td></tr>
<tr><td>10</td><td>SQL built by <code>+</code> with user text</td><td>500 for "Murach's"; <code>' OR 1=1 --</code> returns everything</td><td><code>PreparedStatement</code> with <code>?</code></td><td>Q2 (+ security)</td></tr>
</tbody>
</table>
<h3>1 — <code>==</code> compares objects, not text</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/SoSanhServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">boolean ok;
if (request.getServletPath().startsWith("/loi")) {
    ok = stored == typed;                              // WRONG: compares two OBJECTS (addresses), not the text
} else {
    ok = stored != null &amp;&amp; stored.equals(typed);       // RIGHT: compares the characters
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/loi/so-sanh HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

stored="123" typed="123" → Invalid username or password</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/dung/so-sanh HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

stored="123" typed="123" → LOGIN OK</code></pre>
<p>Both strings are "123", but they are two different objects (one from the driver, one from the request), so <code>==</code> is false. This bug is nasty because the code compiles and the page works — it just never lets anyone in. Better still: put both values in the <code>WHERE</code>, as the solution does.</p>
<h3>2 — the forward path</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/ForwardServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (path.equals("/loi/forward-tuong-doi")) {
    request.getRequestDispatcher("WEB-INF/views/ok.jsp").forward(request, response);     // no leading "/" ⇒ relative to /loi/
} else if (path.equals("/loi/forward-sai-ten")) {
    request.getRequestDispatcher("/WEB-INF/view/ok.jsp").forward(request, response);     // folder is "views", not "view"
} else {
    request.getRequestDispatcher("/WEB-INF/views/ok.jsp").forward(request, response);    // "/" = the root of THIS app
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/forward-tuong-doi HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 767

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/loi/WEB-INF/views/ok.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/forward-sai-ten HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 758

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/WEB-INF/view/ok.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/forward HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe1-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

Forward reached the JSP</code></pre>
<p>Without the leading <code>/</code> the path is relative to the servlet's own URL (<code>/loi/</code>), so Tomcat looks for <code>/loi/WEB-INF/…</code>. With <code>/</code> it starts at the root of the app. Read the 404 message: it prints the exact path it tried.</p>
<h3>3 — NullPointerException when nobody is logged in</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/ChaoServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (request.getServletPath().startsWith("/loi")) {
    Account acc = (Account) request.getSession().getAttribute("account");
    response.getWriter().println("Welcome, " + acc.getFullName());          // acc == null ⇒ NullPointerException ⇒ 500
} else {
    Account acc = (Account) request.getSession().getAttribute("account");
    if (acc == null) {
        response.sendRedirect(request.getContextPath() + "/login");          // not logged in ⇒ go and log in
        return;
    }
    response.getWriter().println("Welcome, " + acc.getFullName());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/chao HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8
Content-Language: en
Content-Length: 1292

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message Cannot invoke "model.Account.getFullName()" because "&lt;local3&gt;" is null
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NullPointerException: Cannot invoke "model.Account.getFullName()" because "&lt;local3&gt;" is null
loi.ChaoServlet.doGet(ChaoServlet.java:19)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
… (1 more lines / còn 1 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/chao HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/login
Content-Type: text/plain;charset=UTF-8
Content-Length: 0</code></pre>
<p>The message names the method that was called on <code>null</code> (<code>getFullName()</code>) — a "helpful NullPointerException" of JDK 14 and newer; compiled with debug information (NetBeans does) it even says <code>"acc" is null</code> instead of <code>&lt;local3&gt;</code>. On JDK 8 the message is empty: read the first line of the stack trace that is YOUR class (<code>ChaoServlet.java:19</code>) and look at what can be null on that line.</p>
<h3>4 — <code>sendRedirect</code> without <code>return</code>: the redirect is sent AND the page runs</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/QuenReturnFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (session == null || session.getAttribute("account") == null) {
    ((HttpServletResponse) resp).sendRedirect(request.getContextPath() + "/login");
    // return;   &lt;- forgotten
}
chain.doFilter(req, resp);</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 22

books in the table: 4</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/loi/xoa HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/login
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">XoaServlet ran: deleted 1 book(s) for a visitor who is NOT logged in</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dem HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 22

books in the table: 3</code></pre>
<p>The browser sees a normal 302 to the login page, so the developer thinks "protected". But <code>sendRedirect</code> is just a method call — the Java code continues, <code>chain.doFilter</code> runs the servlet, and a visitor who is not logged in has deleted a book (4 → 3, and the log line proves it). The examiner's raw POST finds this at once.</p>
<h3>5 — a Filter that blocks its own login page</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/VongLapFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (session == null || session.getAttribute("account") == null) {   // no exception for /vong/login ⇒ loop
    ((HttpServletResponse) resp).sendRedirect(request.getContextPath() + "/vong/login");
    return;
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/books HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/login HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/login HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p>Every request, including <code>/vong/login</code> itself, is sent back to <code>/vong/login</code>; a browser gives up after about 20 rounds with "ERR_TOO_MANY_REDIRECTS". Map the Filter only to the protected area (<code>/book/*</code>, as the solution does), or let <code>/login</code>, CSS and images through first.</p>
<h3>6 — forgetting <code>request.setCharacterEncoding("UTF-8")</code></h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/MaHoaServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (request.getServletPath().equals("/cu/them-dung")) {
    request.setCharacterEncoding("UTF-8");             // the fix: BEFORE the first getParameter
}
String title = request.getParameter("title");</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/cu/them-quen HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 26

title=L%C3%A3o+H%E1%BA%A1c</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 63

decoded as ISO-8859-1 → saved in SQL Server: LÃ£o Háº¡c</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/cu/them-dung HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 26

title=L%C3%A3o+H%E1%BA%A1c</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 53

decoded as UTF-8 → saved in SQL Server: Lão Hạc</code></pre>
<p>Honest note: on Tomcat 10.1 with its default <code>conf/web.xml</code> (request and response encoding UTF-8) forgetting this line does no harm — we measured it. To show the bug, a small filter here makes the app decode forms as ISO-8859-1, which is what Tomcat 9 and older do when nobody sets an encoding. You do not know which server or configuration the exam machine has, so keep the line (or an encoding Filter, lesson 8.3): it costs nothing and the broken text, once saved, stays broken in the database.</p>
<h3>7 — the missing <code>taglib</code> line</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/webapp/WEB-INF/views/thieu-taglib.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%-- the taglib line is MISSING here --%&gt;
&lt;ul&gt;
&lt;c:forEach items="&#36;{titles}" var="t"&gt;&lt;li&gt;&#36;{t}&lt;/li&gt;&lt;/c:forEach&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/thieu-taglib HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 138

&lt;ul&gt;
&lt;c:forEach items="[Head First Java, Effective Java, Murach's Java Servlets and JSP, Số đỏ]" var="t"&gt;&lt;li&gt;&lt;/li&gt;&lt;/c:forEach&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/co-taglib HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 116

&lt;ul&gt;
&lt;li&gt;Head First Java&lt;/li&gt;&lt;li&gt;Effective Java&lt;/li&gt;&lt;li&gt;Murach's Java Servlets and JSP&lt;/li&gt;&lt;li&gt;Số đỏ&lt;/li&gt;&lt;/ul&gt;</code></pre>
<p>No error page at all — that is the trap. Without the directive, <code>&lt;c:forEach&gt;</code> is just text: EL inside it is still evaluated (you can see the list printed inside the attribute), but no loop runs, so the browser shows an empty table. If a JSTL page shows nothing, view the page source first.</p>
<h3>8 — <code>parseInt</code> on a missing parameter</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">int page = Integer.parseInt(request.getParameter("page"));   // first visit has no ?page ⇒ parseInt(null)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/trang HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1277

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message Cannot parse null string
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NumberFormatException: Cannot parse null string
java.base/java.lang.Integer.parseInt(Integer.java:630)
java.base/java.lang.Integer.parseInt(Integer.java:786)
loi.DanhSachServlet.doGet(DanhSachServlet.java:34)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
… (3 more lines / còn 3 dòng)</code></pre>
<p>The first visit to <code>/book/list</code> has no <code>?page=</code>, so <code>getParameter</code> returns <code>null</code>. Every number from the request needs a default — see <code>BookForm.toInt</code> in the solution.</p>
<h3>9 — <code>LIKE '%?%'</code></h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">text(response, query("SELECT title FROM Book WHERE title LIKE '%?%'", request.getParameter("keyword")).toString());   // ? inside quotes is just a character</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/like?keyword=java HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2098

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The index 1 is out of range.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The index 1 is out of range.
loi.DanhSachServlet.doGet(DanhSachServlet.java:63)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
… (12 more lines / còn 12 dòng)</code></pre>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">text(response, query("SELECT title FROM Book WHERE title LIKE ?", "%" + request.getParameter("keyword") + "%").toString());   // the % go INTO the value</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/like?keyword=java HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

[Head First Java, Effective Java, Murach's Java Servlets and JSP]</code></pre>
<p>Inside quotes, <code>?</code> is just a question mark in a text, so the statement has zero parameters and <code>setString(1, …)</code> fails with "The index 1 is out of range."</p>
<h3>10 — gluing user text into SQL</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT title FROM Book WHERE title LIKE N'%" + request.getParameter("keyword") + "%'";
List&lt;String&gt; titles = new ArrayList&lt;&gt;();
try (Connection con = DBContext.getConnection();
     Statement st = con.createStatement();
     ResultSet rs = st.executeQuery(sql)) {
    while (rs.next()) titles.add(rs.getString(1));
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/noi-chuoi?keyword=Murach%27s HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2481

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax near 's'.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax near 's'.
loi.DanhSachServlet.doGet(DanhSachServlet.java:63)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
… (16 more lines / còn 16 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/noi-chuoi?keyword=xyz%27+OR+1%3D1+-- HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 78

[Head First Java, Effective Java, Murach's Java Servlets and JSP, Số đỏ]</code></pre>
<p>The apostrophe in "Murach's" ends the SQL string early — a 500 for an honest search. And <code>xyz' OR 1=1 --</code> turns the search into "everything" (lesson 5.5 goes further and steals passwords with a <code>UNION</code>). <code>PreparedStatement</code> fixes both at once.</p>`,
    `<h2>🪤 Mười lỗi làm mất điểm — lỗi nào cũng chạy thật</h2>
<p>Mỗi lỗi dưới đây được dựng trong một app thí nghiệm nhỏ (<code>pe1-loi</code>) và chạy trên cùng Tomcat 10.1 + SQL Server. Đọc triệu chứng trước: trong phòng thi, nhận ra chữ báo lỗi là thứ cứu bạn mười phút.</p>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Bạn thấy gì</th><th>Cách sửa</th><th>Điểm có thể mất</th></tr></thead>
<tbody>
<tr><td>1</td><td>so mật khẩu bằng <code>==</code></td><td>đúng mật khẩu vẫn "Invalid username or password"</td><td><code>stored.equals(typed)</code> (hoặc để SQL so)</td><td>cả Câu 1</td></tr>
<tr><td>2</td><td>đường dẫn forward thiếu <code>/</code> hoặc sai thư mục</td><td>404 "JSP file […] not found"</td><td><code>"/WEB-INF/views/x.jsp"</code> — bắt đầu bằng <code>/</code>, đúng tên thư mục</td><td>cả trang</td></tr>
<tr><td>3</td><td>dùng attribute session không kiểm null</td><td>500 NullPointerException khi chưa đăng nhập</td><td>kiểm <code>null</code> (hoặc để Filter bảo đảm)</td><td>Câu 1b</td></tr>
<tr><td>4</td><td><code>sendRedirect</code> thiếu <code>return</code> trong Filter</td><td>thấy 302, nhưng servlet VẪN chạy (một cuốn sách bị xoá)</td><td><code>return;</code> sau mọi redirect/forward</td><td>Câu 1b + dữ liệu</td></tr>
<tr><td>5</td><td>Filter <code>/*</code> chặn luôn <code>/login</code></td><td>302 về <code>/login</code> mãi mãi (ERR_TOO_MANY_REDIRECTS)</td><td>cho <code>/login</code> và file tĩnh đi qua</td><td>tất cả</td></tr>
<tr><td>6</td><td>thiếu <code>request.setCharacterEncoding("UTF-8")</code> trên server cũ</td><td>"LÃ£o Háº¡c" nằm trong CSDL</td><td>đặt trước lần <code>getParameter</code> đầu (hoặc Filter mã hoá)</td><td>Câu 3</td></tr>
<tr><td>7</td><td>thiếu dòng <code>taglib</code> trong JSP</td><td><code>&lt;c:forEach&gt;</code> gửi nguyên văn, bảng rỗng</td><td><code>&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;</code></td><td>Câu 2</td></tr>
<tr><td>8</td><td><code>Integer.parseInt(request.getParameter("page"))</code></td><td>500 "Cannot parse null string" ở lần vào đầu</td><td>đọc số có giá trị mặc định</td><td>Câu 4</td></tr>
<tr><td>9</td><td><code>LIKE '%?%'</code></td><td>500 "The index 1 is out of range."</td><td><code>LIKE ?</code> + <code>"%" + keyword + "%"</code></td><td>Câu 2</td></tr>
<tr><td>10</td><td>ghép chữ người dùng vào SQL bằng <code>+</code></td><td>500 với "Murach's"; <code>' OR 1=1 --</code> trả về tất cả</td><td><code>PreparedStatement</code> với <code>?</code></td><td>Câu 2 (+ bảo mật)</td></tr>
</tbody>
</table>
<h3>1 — <code>==</code> so đối tượng, không so chữ</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/SoSanhServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">boolean ok;
if (request.getServletPath().startsWith("/loi")) {
    ok = stored == typed;                              // SAI: so hai ĐỐI TƯỢNG (địa chỉ), không so chữ
} else {
    ok = stored != null &amp;&amp; stored.equals(typed);       // ĐÚNG: so từng ký tự
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/loi/so-sanh HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

stored="123" typed="123" → Invalid username or password</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/dung/so-sanh HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=docgia&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

stored="123" typed="123" → LOGIN OK</code></pre>
<p>Cả hai chuỗi đều là "123", nhưng là hai đối tượng khác nhau (một do driver tạo, một do request tạo), nên <code>==</code> ra false. Lỗi này khó chịu vì code biên dịch được, trang vẫn chạy — chỉ là không bao giờ cho ai vào. Tốt hơn nữa: đưa cả hai giá trị vào <code>WHERE</code>, như lời giải.</p>
<h3>2 — đường dẫn forward</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/ForwardServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (path.equals("/loi/forward-tuong-doi")) {
    request.getRequestDispatcher("WEB-INF/views/ok.jsp").forward(request, response);     // thiếu "/" đầu ⇒ tính từ /loi/
} else if (path.equals("/loi/forward-sai-ten")) {
    request.getRequestDispatcher("/WEB-INF/view/ok.jsp").forward(request, response);     // thư mục là "views", không phải "view"
} else {
    request.getRequestDispatcher("/WEB-INF/views/ok.jsp").forward(request, response);    // "/" = gốc của CHÍNH app này
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/forward-tuong-doi HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 767

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/loi/WEB-INF/views/ok.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/forward-sai-ten HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 758

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/WEB-INF/view/ok.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/forward HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe1-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

Forward reached the JSP</code></pre>
<p>Thiếu <code>/</code> đầu thì đường dẫn tính từ URL của chính servlet (<code>/loi/</code>), nên Tomcat đi tìm <code>/loi/WEB-INF/…</code>. Có <code>/</code> thì bắt đầu từ gốc của app. Đọc thông báo 404: nó in đúng đường dẫn nó đã thử.</p>
<h3>3 — NullPointerException khi chưa ai đăng nhập</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/ChaoServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (request.getServletPath().startsWith("/loi")) {
    Account acc = (Account) request.getSession().getAttribute("account");
    response.getWriter().println("Welcome, " + acc.getFullName());          // acc == null ⇒ NullPointerException ⇒ 500
} else {
    Account acc = (Account) request.getSession().getAttribute("account");
    if (acc == null) {
        response.sendRedirect(request.getContextPath() + "/login");          // chưa đăng nhập ⇒ đi đăng nhập
        return;
    }
    response.getWriter().println("Welcome, " + acc.getFullName());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/chao HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8
Content-Language: en
Content-Length: 1292

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message Cannot invoke "model.Account.getFullName()" because "&lt;local3&gt;" is null
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NullPointerException: Cannot invoke "model.Account.getFullName()" because "&lt;local3&gt;" is null
loi.ChaoServlet.doGet(ChaoServlet.java:19)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
… (1 more lines / còn 1 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/chao HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/login
Content-Type: text/plain;charset=UTF-8
Content-Length: 0</code></pre>
<p>Thông báo nêu tên phương thức bị gọi trên <code>null</code> (<code>getFullName()</code>) — kiểu "NullPointerException dễ hiểu" có từ JDK 14; nếu biên dịch kèm thông tin gỡ lỗi (NetBeans có làm) nó còn ghi <code>"acc" is null</code> thay cho <code>&lt;local3&gt;</code>. Trên JDK 8 thông báo để trống: đọc dòng đầu tiên của stack trace thuộc lớp CỦA BẠN (<code>ChaoServlet.java:19</code>) rồi nhìn xem thứ gì trên dòng đó có thể null.</p>
<h3>4 — <code>sendRedirect</code> thiếu <code>return</code>: vừa chuyển hướng VỪA chạy trang</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/QuenReturnFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (session == null || session.getAttribute("account") == null) {
    ((HttpServletResponse) resp).sendRedirect(request.getContextPath() + "/login");
    // &lt;- bị quên
}
chain.doFilter(req, resp);</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 22

books in the table: 4</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/loi/xoa HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/login
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">XoaServlet ran: deleted 1 book(s) for a visitor who is NOT logged in</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dem HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 22

books in the table: 3</code></pre>
<p>Trình duyệt nhận một 302 bình thường về trang đăng nhập, nên người viết tưởng "đã bảo vệ". Nhưng <code>sendRedirect</code> chỉ là một lời gọi hàm — code Java chạy tiếp, <code>chain.doFilter</code> chạy servlet, và một người chưa đăng nhập đã xoá được một cuốn sách (4 → 3, dòng log là bằng chứng). Một POST thô của người chấm phát hiện ngay.</p>
<h3>5 — Filter chặn luôn trang đăng nhập của chính nó</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/VongLapFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (session == null || session.getAttribute("account") == null) {   // không chừa /vong/login ⇒ vòng lặp
    ((HttpServletResponse) resp).sendRedirect(request.getContextPath() + "/vong/login");
    return;
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/books HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/login HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/vong/login HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe1-loi/vong/login
Content-Length: 0</code></pre>
<p>Mọi request, kể cả chính <code>/vong/login</code>, đều bị đẩy về <code>/vong/login</code>; trình duyệt bỏ cuộc sau khoảng 20 vòng với "ERR_TOO_MANY_REDIRECTS". Chỉ ánh xạ Filter vào vùng cần bảo vệ (<code>/book/*</code>, như lời giải), hoặc cho <code>/login</code>, CSS, ảnh đi qua trước.</p>
<h3>6 — quên <code>request.setCharacterEncoding("UTF-8")</code></h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/MaHoaServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (request.getServletPath().equals("/cu/them-dung")) {
    request.setCharacterEncoding("UTF-8");             // cách sửa: TRƯỚC lần getParameter đầu tiên
}
String title = request.getParameter("title");</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/cu/them-quen HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 26

title=L%C3%A3o+H%E1%BA%A1c</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 63

decoded as ISO-8859-1 → saved in SQL Server: LÃ£o Háº¡c</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe1-loi/cu/them-dung HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 26

title=L%C3%A3o+H%E1%BA%A1c</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 53

decoded as UTF-8 → saved in SQL Server: Lão Hạc</code></pre>
<p>Nói thật: trên Tomcat 10.1 với <code>conf/web.xml</code> mặc định (mã hoá request và response là UTF-8), quên dòng này không gây hại — ta đã đo. Để thấy lỗi, ở đây một filter nhỏ bắt app giải mã form bằng ISO-8859-1, đúng như Tomcat 9 trở về trước làm khi không ai đặt mã hoá. Bạn không biết máy thi chạy server và cấu hình nào, nên cứ giữ dòng đó (hoặc một Filter mã hoá, bài 8.3): nó không tốn gì, còn chữ hỏng một khi đã lưu thì nằm hỏng mãi trong CSDL.</p>
<h3>7 — thiếu dòng <code>taglib</code></h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/webapp/WEB-INF/views/thieu-taglib.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%-- dòng taglib bị THIẾU ở đây --%&gt;
&lt;ul&gt;
&lt;c:forEach items="&#36;{titles}" var="t"&gt;&lt;li&gt;&#36;{t}&lt;/li&gt;&lt;/c:forEach&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/thieu-taglib HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 138

&lt;ul&gt;
&lt;c:forEach items="[Head First Java, Effective Java, Murach's Java Servlets and JSP, Số đỏ]" var="t"&gt;&lt;li&gt;&lt;/li&gt;&lt;/c:forEach&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/co-taglib HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 116

&lt;ul&gt;
&lt;li&gt;Head First Java&lt;/li&gt;&lt;li&gt;Effective Java&lt;/li&gt;&lt;li&gt;Murach's Java Servlets and JSP&lt;/li&gt;&lt;li&gt;Số đỏ&lt;/li&gt;&lt;/ul&gt;</code></pre>
<p>Không có trang lỗi nào — chính là cái bẫy. Thiếu chỉ thị, <code>&lt;c:forEach&gt;</code> chỉ là chữ: EL bên trong vẫn được tính (bạn thấy danh sách in ngay trong thuộc tính), nhưng không vòng lặp nào chạy, nên trình duyệt hiện bảng rỗng. Trang JSTL không hiện gì thì việc đầu tiên là xem mã nguồn trang (View Page Source).</p>
<h3>8 — <code>parseInt</code> trên một tham số không có</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">int page = Integer.parseInt(request.getParameter("page"));   // lần vào đầu không có ?page ⇒ parseInt(null)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/trang HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1277

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message Cannot parse null string
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NumberFormatException: Cannot parse null string
java.base/java.lang.Integer.parseInt(Integer.java:630)
java.base/java.lang.Integer.parseInt(Integer.java:786)
loi.DanhSachServlet.doGet(DanhSachServlet.java:34)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
… (3 more lines / còn 3 dòng)</code></pre>
<p>Lần đầu vào <code>/book/list</code> không có <code>?page=</code>, nên <code>getParameter</code> trả <code>null</code>. Mọi con số lấy từ request đều cần giá trị mặc định — xem <code>BookForm.toInt</code> trong lời giải.</p>
<h3>9 — <code>LIKE '%?%'</code></h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">text(response, query("SELECT title FROM Book WHERE title LIKE '%?%'", request.getParameter("keyword")).toString());   // ? trong dấu nháy chỉ là một ký tự</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/like?keyword=java HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2098

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The index 1 is out of range.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The index 1 is out of range.
loi.DanhSachServlet.doGet(DanhSachServlet.java:63)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
… (12 more lines / còn 12 dòng)</code></pre>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">text(response, query("SELECT title FROM Book WHERE title LIKE ?", "%" + request.getParameter("keyword") + "%").toString());   // dấu % nằm TRONG giá trị</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/dung/like?keyword=java HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

[Head First Java, Effective Java, Murach's Java Servlets and JSP]</code></pre>
<p>Nằm trong dấu nháy, <code>?</code> chỉ là một dấu hỏi trong chuỗi chữ, nên câu lệnh không có tham số nào và <code>setString(1, …)</code> hỏng với "The index 1 is out of range."</p>
<h3>10 — ghép chữ người dùng vào SQL</h3>
<p class="ghi-chu">📄 <code>pe1-loi/src/main/java/loi/DanhSachServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT title FROM Book WHERE title LIKE N'%" + request.getParameter("keyword") + "%'";
List&lt;String&gt; titles = new ArrayList&lt;&gt;();
try (Connection con = DBContext.getConnection();
     Statement st = con.createStatement();
     ResultSet rs = st.executeQuery(sql)) {
    while (rs.next()) titles.add(rs.getString(1));
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/noi-chuoi?keyword=Murach%27s HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2481

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax near 's'.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax near 's'.
loi.DanhSachServlet.doGet(DanhSachServlet.java:63)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
… (16 more lines / còn 16 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe1-loi/loi/noi-chuoi?keyword=xyz%27+OR+1%3D1+-- HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 78

[Head First Java, Effective Java, Murach's Java Servlets and JSP, Số đỏ]</code></pre>
<p>Dấu nháy trong "Murach's" kết thúc chuỗi SQL quá sớm — một lần tìm kiếm tử tế cũng ra 500. Còn <code>xyz' OR 1=1 --</code> biến phép tìm thành "lấy tất cả" (bài 5.5 đi xa hơn: lấy trộm mật khẩu bằng <code>UNION</code>). <code>PreparedStatement</code> sửa cả hai cùng lúc.</p>`),
    bi(`<h2>⏱ The 85-minute plan</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Done when</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>read the WHOLE paper once; run the script in SSMS; open the template, rename it, fill <code>DBContext</code>; Clean and Build, Run</td><td>the template's start page opens in the browser</td></tr>
<tr><td>7–25</td><td>Q1: <code>AccountDAO.login</code>, <code>LoginServlet</code>, <code>login.jsp</code>, <code>LogoutServlet</code>, <code>AuthFilter</code></td><td>wrong / right / MEMBER→403 / logout all checked in the browser</td></tr>
<tr><td>25–45</td><td>Q2: <code>Book</code>, <code>BookDAO.search</code> with the JOIN, <code>BookListServlet</code>, <code>book-list.jsp</code></td><td>5 rows show; "java" finds 4; category works; values kept</td></tr>
<tr><td>45–65</td><td>Q3: <code>BookForm</code>, add (GET+POST), edit, delete</td><td>one wrong add, one right add, one edit, one delete checked in SSMS</td></tr>
<tr><td>65–77</td><td>Q4: <code>count</code> + <code>OFFSET … FETCH</code>, page links with <code>c:url</code></td><td>page 2 of a search keeps the keyword</td></tr>
<tr><td>77–85</td><td>private window: walk the marking guide top to bottom; Clean and Build; submit as told</td><td>nothing returns 404/500</td></tr>
</tbody>
</table>
<p><strong>Rules for the clock.</strong> (1) Make something run in the first 7 minutes — a project that does not start earns nothing. (2) Stuck for 5 minutes on one point? Leave a <code>// TODO</code>, move on, come back at the end. (3) Q2 is worth the most and Q4 builds on it: never skip Q2 for Q3. (4) Test each question in the browser the moment it is done, not at minute 80.</p>
<h3>🛠 NetBeans tips that save minutes</h3>
<ul>
<li><kbd>Alt</kbd>+<kbd>Insert</kbd> → Constructor / Getter and Setter: a JavaBean in 20 seconds. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> fixes imports (pick <code>jakarta.servlet…</code>, never <code>javax</code>, and <code>java.sql.Connection</code>, not another <code>Connection</code>).</li>
<li>New → Servlet writes the class and <code>@WebServlet</code> for you; New → Filter likewise. Check the URL pattern it puts there.</li>
<li>Type <code>sout</code> + <kbd>Tab</kbd> for <code>System.out.println</code>: print the SQL and the parameters while debugging; the output goes to the Tomcat tab of the Output window, together with every stack trace.</li>
<li>Strange old behaviour after a change? Clean and Build, then Run again. Port 8080 busy? Services → Servers → Tomcat → Stop, then Run.</li>
<li>Project Properties → Run shows the context path. It must match the project name rule of the paper.</li>
<li>Check the data in SSMS after every insert/update/delete — the examiner will.</li>
</ul>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the Filter becomes Spring Security's filter chain (<code>.requestMatchers("/book/add").hasRole("LIBRARIAN")</code>), the DAO becomes a Spring Data repository whose <code>Pageable</code> writes the <code>OFFSET … FETCH</code> for you, and <code>BookForm</code> becomes a class with <code>@NotBlank</code>, <code>@Min</code>, <code>@Max</code> checked by <code>@Valid</code>. The ideas are the same ones you practise here.</div>`,
    `<h2>⏱ Kế hoạch 85 phút</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Xong khi</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>đọc HẾT đề một lượt; chạy script trong SSMS; mở project mẫu, đổi tên, điền <code>DBContext</code>; Clean and Build, Run</td><td>trang đầu của project mẫu mở được trên trình duyệt</td></tr>
<tr><td>7–25</td><td>Câu 1: <code>AccountDAO.login</code>, <code>LoginServlet</code>, <code>login.jsp</code>, <code>LogoutServlet</code>, <code>AuthFilter</code></td><td>đã thử trên trình duyệt: sai / đúng / MEMBER→403 / đăng xuất</td></tr>
<tr><td>25–45</td><td>Câu 2: <code>Book</code>, <code>BookDAO.search</code> có JOIN, <code>BookListServlet</code>, <code>book-list.jsp</code></td><td>hiện 5 dòng; "java" ra 4 cuốn; lọc thể loại chạy; giữ giá trị</td></tr>
<tr><td>45–65</td><td>Câu 3: <code>BookForm</code>, thêm (GET+POST), sửa, xoá</td><td>đã kiểm trong SSMS: một lần thêm sai, một lần thêm đúng, một lần sửa, một lần xoá</td></tr>
<tr><td>65–77</td><td>Câu 4: <code>count</code> + <code>OFFSET … FETCH</code>, link trang bằng <code>c:url</code></td><td>trang 2 của một lần tìm vẫn giữ từ khoá</td></tr>
<tr><td>77–85</td><td>cửa sổ ẩn danh: đi hết barem từ trên xuống; Clean and Build; nộp theo hướng dẫn</td><td>không còn URL nào trả 404/500</td></tr>
</tbody>
</table>
<p><strong>Luật với đồng hồ.</strong> (1) Làm cho project chạy được trong 7 phút đầu — project không khởi động được thì không có điểm nào. (2) Kẹt 5 phút ở một ý? Để lại <code>// TODO</code>, làm tiếp, cuối giờ quay lại. (3) Câu 2 nhiều điểm nhất và Câu 4 xây trên nó: đừng bao giờ bỏ Câu 2 để làm Câu 3. (4) Làm xong câu nào thử ngay câu đó trên trình duyệt, đừng để tới phút 80.</p>
<h3>🛠 Mẹo NetBeans tiết kiệm từng phút</h3>
<ul>
<li><kbd>Alt</kbd>+<kbd>Insert</kbd> → Constructor / Getter and Setter: một JavaBean trong 20 giây. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> tự thêm import (chọn <code>jakarta.servlet…</code>, không bao giờ <code>javax</code>, và <code>java.sql.Connection</code>, không phải một <code>Connection</code> nào khác).</li>
<li>New → Servlet viết sẵn lớp và <code>@WebServlet</code>; New → Filter cũng vậy. Kiểm lại URL pattern nó điền.</li>
<li>Gõ <code>sout</code> + <kbd>Tab</kbd> ra <code>System.out.println</code>: in câu SQL và các tham số khi gỡ lỗi; chữ in ra nằm ở tab Tomcat của cửa sổ Output, cùng với mọi stack trace.</li>
<li>Sửa rồi mà trang vẫn chạy kiểu cũ? Clean and Build rồi Run lại. Cổng 8080 bị chiếm? Services → Servers → Tomcat → Stop, rồi Run.</li>
<li>Project Properties → Run cho thấy context path. Nó phải khớp quy ước tên project của đề.</li>
<li>Sau mỗi lần thêm/sửa/xoá, mở SSMS xem dữ liệu — người chấm sẽ xem.</li>
</ul>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): Filter trở thành chuỗi filter của Spring Security (<code>.requestMatchers("/book/add").hasRole("LIBRARIAN")</code>), DAO trở thành một repository của Spring Data có <code>Pageable</code> tự viết <code>OFFSET … FETCH</code> cho bạn, còn <code>BookForm</code> trở thành một lớp gắn <code>@NotBlank</code>, <code>@Min</code>, <code>@Max</code> được kiểm bằng <code>@Valid</code>. Các ý tưởng vẫn đúng là những thứ bạn luyện ở đây.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>The 85-minute, 30% exam in which you build working web features on a lab machine.</td></tr>
<tr><td><strong>template project</strong></td><td>project mẫu</td><td>The starter project handed out with the paper; you rename it and build on it.</td></tr>
<tr><td><strong>context path</strong></td><td>đường dẫn gốc của app</td><td>The first part of every URL of the app, such as /pe1-thu-vien; examiners type URLs that start with it.</td></tr>
<tr><td><strong>DBContext</strong></td><td>lớp kết nối CSDL</td><td>The given class in package dal that opens connections; every DAO must use it.</td></tr>
<tr><td><strong>authorization filter</strong></td><td>filter phân quyền</td><td>A Filter that decides, before any servlet runs, whether this user may open this URL.</td></tr>
<tr><td><strong>server-side validation</strong></td><td>kiểm tra dữ liệu phía server</td><td>Checking every input in Java on the server, because HTML attributes can be skipped by a raw request.</td></tr>
<tr><td><strong>Post/Redirect/Get (PRG)</strong></td><td>mẫu POST rồi chuyển hướng</td><td>After a successful POST, answer 302 to a GET page so that refreshing does not repeat the POST.</td></tr>
<tr><td><strong>pagination</strong></td><td>phân trang</td><td>Showing a long list a few rows at a time, with links to the other pages.</td></tr>
<tr><td><strong>OFFSET … FETCH</strong></td><td>bỏ qua … lấy tiếp</td><td>The SQL Server clause that skips n rows and returns the next m rows of an ordered result.</td></tr>
<tr><td><strong>private window</strong></td><td>cửa sổ ẩn danh</td><td>A browser window with no old cookies, used to test pages as a new visitor.</td></tr>
<tr><td><strong>redirect loop</strong></td><td>vòng lặp chuyển hướng</td><td>Pages that keep redirecting to each other until the browser stops with ERR_TOO_MANY_REDIRECTS.</td></tr>
<tr><td><strong>marking guide</strong></td><td>barem chấm</td><td>The list of checks and points an examiner follows to mark each question.</td></tr>
<tr><td><strong>stack trace</strong></td><td>dấu vết ngăn xếp</td><td>The list of method calls printed with an exception; its first lines name the error and where it happened.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>Bài thi 85 phút, 30% điểm, trong đó bạn làm ra các chức năng web chạy được trên máy phòng lab.</td></tr>
<tr><td><strong>template project</strong></td><td>project mẫu</td><td>Project khởi đầu được phát kèm đề; bạn đổi tên và làm tiếp trên nó.</td></tr>
<tr><td><strong>context path</strong></td><td>đường dẫn gốc của app</td><td>Phần đầu của mọi URL trong app, như /pe1-thu-vien; người chấm gõ URL bắt đầu bằng nó.</td></tr>
<tr><td><strong>DBContext</strong></td><td>lớp kết nối CSDL</td><td>Lớp có sẵn trong gói dal để mở kết nối; mọi DAO phải dùng nó.</td></tr>
<tr><td><strong>authorization filter</strong></td><td>filter phân quyền</td><td>Một Filter quyết định, trước khi servlet nào chạy, người dùng này có được mở URL này không.</td></tr>
<tr><td><strong>server-side validation</strong></td><td>kiểm tra dữ liệu phía server</td><td>Kiểm mọi dữ liệu nhập bằng Java trên server, vì thuộc tính HTML có thể bị một request thô bỏ qua.</td></tr>
<tr><td><strong>Post/Redirect/Get (PRG)</strong></td><td>mẫu POST rồi chuyển hướng</td><td>Sau một POST thành công, trả 302 tới một trang GET để bấm làm mới không gửi lại POST.</td></tr>
<tr><td><strong>pagination</strong></td><td>phân trang</td><td>Hiển thị một danh sách dài từng ít dòng một, kèm link tới các trang khác.</td></tr>
<tr><td><strong>OFFSET … FETCH</strong></td><td>bỏ qua … lấy tiếp</td><td>Mệnh đề SQL Server bỏ qua n dòng rồi trả về m dòng tiếp theo của một kết quả đã sắp xếp.</td></tr>
<tr><td><strong>private window</strong></td><td>cửa sổ ẩn danh</td><td>Cửa sổ trình duyệt không mang cookie cũ, dùng để thử trang như một người mới vào.</td></tr>
<tr><td><strong>redirect loop</strong></td><td>vòng lặp chuyển hướng</td><td>Các trang cứ chuyển hướng qua lại cho tới khi trình duyệt dừng với ERR_TOO_MANY_REDIRECTS.</td></tr>
<tr><td><strong>marking guide</strong></td><td>barem chấm</td><td>Danh sách các phép kiểm và số điểm người chấm dựa vào để chấm từng câu.</td></tr>
<tr><td><strong>stack trace</strong></td><td>dấu vết ngăn xếp</td><td>Danh sách lời gọi hàm in kèm một exception; vài dòng đầu nêu lỗi và nơi xảy ra.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Remember</h2>
<ul>
<li>This is a MOCK paper (no real PRJ301 PE in the Exam Room yet): PE = 30%, 85 minutes, completion &gt; 0 — a blank PE fails the subject.</li>
<li>Minute 0–7: script, rename, <code>DBContext</code>, Run. A project that does not start scores 0.</li>
<li>Q1: <code>PreparedStatement</code> login, session attribute, one Filter: no account → redirect, wrong role → 403, and <code>return</code> after every redirect/forward.</li>
<li>Q2: one fixed SQL with <code>?</code> for every value, JOIN for the category name, JSTL in a JSP under <code>WEB-INF</code>, keep the typed values.</li>
<li>Q3: validate on the server, show a message per field, keep the input; success → 302 (PRG); unknown id → 404; delete by POST.</li>
<li>Q4: <code>COUNT(*)</code> + <code>OFFSET … FETCH</code>, clamp the page, <code>c:url</code>/<code>c:param</code> links that keep the search.</li>
<li>Know the ten error texts: 404 "JSP file not found", NullPointerException, "Cannot parse null string", "The index 1 is out of range.", "Incorrect syntax near"…</li>
<li>Last 8 minutes: private window, walk the marking guide, check SSMS, submit.</li>
</ul>`,
    `<h2>📌 Ghi nhớ</h2>
<ul>
<li>Đây là đề MÔ PHỎNG (Exam Room chưa có đề PE PRJ301 thật): PE = 30%, 85 phút, điều kiện hoàn thành &gt; 0 — bỏ trắng PE là trượt môn.</li>
<li>Phút 0–7: chạy script, đổi tên, điền <code>DBContext</code>, Run. Project không khởi động được là 0 điểm.</li>
<li>Câu 1: đăng nhập bằng <code>PreparedStatement</code>, attribute trong session, một Filter: chưa đăng nhập → redirect, sai vai trò → 403, và <code>return</code> sau mọi redirect/forward.</li>
<li>Câu 2: một câu SQL cố định với <code>?</code> cho mọi giá trị, JOIN để lấy tên thể loại, JSTL trong JSP đặt dưới <code>WEB-INF</code>, giữ lại chữ đã gõ.</li>
<li>Câu 3: kiểm ở server, mỗi ô sai một thông báo, giữ dữ liệu đã nhập; thành công → 302 (PRG); id không có → 404; xoá bằng POST.</li>
<li>Câu 4: <code>COUNT(*)</code> + <code>OFFSET … FETCH</code>, kéo số trang về khoảng hợp lệ, link <code>c:url</code>/<code>c:param</code> giữ điều kiện tìm.</li>
<li>Thuộc mười chữ báo lỗi: 404 "JSP file not found", NullPointerException, "Cannot parse null string", "The index 1 is out of range.", "Incorrect syntax near"…</li>
<li>8 phút cuối: cửa sổ ẩn danh, đi hết barem, xem SSMS, nộp bài.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── 🎯 PE practice 2/3 — 85-minute mock paper: Hotel bookings (roles, free rooms, room CRUD, cart + transaction) ───────── */
const L_x_luyen_pe_2 = {
  title: '🎯 PE practice 2/3 — 85-minute mock paper: Hotel bookings (roles, free rooms, room CRUD, cart + transaction)|||🎯 Luyện PE 2/3 — đề mô phỏng 85 phút: Đặt phòng khách sạn (vai trò, phòng trống, quản lý phòng, giỏ + giao dịch)',
  slug: 'prj301-luyen-pe-2',
  type: 'VIDEO',
  description: 'Đề thi thực hành PE PRJ301 MÔ PHỎNG thứ hai (Exam Room chưa có đề thật) theo dạng PE quen thuộc, đề tài Quản lý đặt phòng khách sạn: đăng nhập hai vai trò MANAGER/RECEPTIONIST với Filter chặn trang quản lý phòng; tìm phòng theo loại, giá tối đa và khoảng ngày — chỉ hiện phòng TRỐNG (điều kiện chồng ngày đúng); thêm/sửa/xoá phòng có kiểm tra (số phòng, trùng, tầng khớp số phòng) và chặn xoá phòng đã có lượt đặt bằng thông báo; câu khó là giỏ đặt phòng trong session rồi xác nhận bằng MỘT giao dịch JDBC (kiểm lại phòng trong giao dịch, commit/rollback, lấy khoá IDENTITY). Lời giải là webapp chạy thật trên Tomcat 10.1 + SQL Server với 32 request đúng kịch bản chấm, barem tự chấm, 10 lỗi mất điểm đo thật (không PRG nên F5 thêm hai lần, chỉ kiểm bằng HTML, Date.valueOf sai định dạng, xoá dòng đang được tham chiếu, giỏ đặt trong trường của servlet nên mọi người dùng chung, dùng cart.empty trong EL, sai tên attribute, executeQuery cho INSERT, thiếu giao dịch nên lưu nửa vời, sai điều kiện chồng ngày), kế hoạch 85 phút và mẹo NetBeans.',
  content: [
    bi(`<span class="eyebrow">Final exam · Practical Exam (PE) · Mock paper 2 of 3</span>
<h2>🎯 Hotel bookings — the paper where the "hard" question is a cart and a transaction</h2>
<div class="callout">⚠ <strong>The Exam Room does not have a real PRJ301 PE paper yet — this is a MOCK paper built on the usual PE shape.</strong> Same frame as paper 1/3 (template project, given <code>DBContext</code>, given libraries, examiner opens URLs), new topic, new traps.</div>
<p class="lead">Paper 1/3 drilled the basic four: login + Filter, list/search, CRUD, pagination. This paper keeps login and CRUD but moves the weight to two things students lose most marks on: a search with a <strong>date-range condition</strong> (which rooms are free from the 21st to the 23rd?) and a <strong>session cart confirmed in one transaction</strong>. Do paper 1/3 first if you have not; then set the timer.</p>
<table>
<thead><tr><th>Question</th><th>Points</th><th>What it tests</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>Q1 login, two roles, Filter</td><td>2.0</td><td>session, Filter by URL area, 403 vs redirect</td><td>4.A, 8.A, 8.3</td></tr>
<tr><td>Q2 room search, free rooms only</td><td>2.5</td><td>JOIN, optional filters with <code>?</code>, overlap condition, <code>fmt:formatNumber</code></td><td>5.B, 3.E</td></tr>
<tr><td>Q3 room add / edit / delete</td><td>2.5</td><td>validation, duplicate key, "cannot delete — has bookings", flash message</td><td>5.B, 6.A, 6.4</td></tr>
<tr><td>Q4 booking cart + confirm</td><td>3.0</td><td>cart in the session, totals, transaction with commit/rollback, generated key</td><td>4.4, 5.5</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Thi cuối kỳ · Thi thực hành (PE) · Đề mô phỏng 2/3</span>
<h2>🎯 Đặt phòng khách sạn — đề mà câu "khó" là một cái giỏ và một giao dịch</h2>
<div class="callout">⚠ <strong>Exam Room chưa có đề PE PRJ301 thật — đây là đề MÔ PHỎNG theo dạng PE quen thuộc.</strong> Cùng khung với đề 1/3 (project mẫu, <code>DBContext</code> cho sẵn, thư viện cho sẵn, người chấm mở URL để kiểm), đề tài mới, bẫy mới.</div>
<p class="lead">Đề 1/3 luyện bốn món cơ bản: đăng nhập + Filter, liệt kê/tìm kiếm, CRUD, phân trang. Đề này giữ đăng nhập và CRUD nhưng dồn điểm vào hai thứ sinh viên hay mất điểm nhất: một phép tìm có <strong>điều kiện khoảng ngày</strong> (phòng nào trống từ ngày 21 tới ngày 23?) và một <strong>giỏ trong session được xác nhận bằng một giao dịch</strong> (transaction — nhóm câu lệnh "tất cả hoặc không gì"). Chưa làm đề 1/3 thì làm trước; rồi mới bấm giờ đề này.</p>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Kiểm tra gì</th><th>Học ở bài</th></tr></thead>
<tbody>
<tr><td>Q1 đăng nhập, hai vai trò, Filter</td><td>2.0</td><td>session, Filter theo vùng URL, 403 khác redirect</td><td>4.A, 8.A, 8.3</td></tr>
<tr><td>Q2 tìm phòng, chỉ phòng trống</td><td>2.5</td><td>JOIN, bộ lọc tuỳ chọn bằng <code>?</code>, điều kiện chồng ngày, <code>fmt:formatNumber</code></td><td>5.B, 3.E</td></tr>
<tr><td>Q3 thêm / sửa / xoá phòng</td><td>2.5</td><td>kiểm dữ liệu, trùng khoá, "không xoá được — đã có lượt đặt", thông báo flash</td><td>5.B, 6.A, 6.4</td></tr>
<tr><td>Q4 giỏ đặt phòng + xác nhận</td><td>3.0</td><td>giỏ trong session, tính tổng, giao dịch commit/rollback, khoá tự sinh</td><td>4.4, 5.5</td></tr>
</tbody>
</table>`),
    bi(`<h2>📝 The exam paper (85 minutes)</h2>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 2                            Duration: 85 minutes
HOTEL BOOKINGS

Instructions: as in every PE — run PE2_Hotel.sql (database PRJ301_Pe2KhachSan), rename the
template project to PE2_&lt;YourStudentCode&gt;, fill dal.DBContext, do not change libraries,
MVC with Servlet + JSP + JSTL + JDBC. A part that does not run gets 0.
(In the solution of this course the context path is /pe2-khach-san.)

Question 1 (2.0 points) — Login and roles
    - GET/POST /login against table Account. Wrong -&gt; "Invalid username or password" on the
      same page (0.25). Correct -&gt; account in session "account", redirect /room/search (0.5).
      GET /logout ends the session -&gt; /login (0.25).
    - ONE Filter for /room/* and /booking/*: not logged in -&gt; /login (0.5);
      /room/add, /room/edit, /room/delete are for MANAGER only -&gt; others get HTTP 403
      "Access denied" (0.5).

Question 2 (2.5 points) — Room search: GET /room/search
    - Table: Room, Type (name), Floor, Price/night formatted like 500.000 ₫, Note,
      ordered by room number (0.75).
    - Optional filters typeId (0 = all) and maxPrice (VND) (0.5).
    - Optional checkIn and checkOut (yyyy-mm-dd): when both are given, show only the rooms
      that are FREE for the whole stay: a room is NOT free if one of its bookings overlaps
      [checkIn, checkOut). Check-out day of one guest = check-in day of the next is OK (0.75).
    - Wrong input (only one date, a bad date, checkOut &lt;= checkIn, maxPrice not a number) -&gt;
      a message, all rooms listed, the form keeps what was typed (0.5).

Question 3 (2.5 points) — Rooms (MANAGER)
    - POST /room/add: roomNo 3-4 digits and not existing yet; type must exist; floorNo 1-20
      and equal to roomNo without its last two digits (305 -&gt; 3, 1205 -&gt; 12); note max 200.
      Each wrong field -&gt; its message, typed values kept (1.0). Success -&gt; back to the
      search page with "Room 401 added" shown ONCE (0.25).
    - Edit /room/edit?roomNo=.. (room number read-only) with the same rules (0.5).
    - POST /room/delete: a room that appears in a booking is NOT deleted -&gt; message
      "Room 101 has bookings and cannot be deleted"; otherwise deleted (0.75).

Question 4 (3.0 points) — Booking cart: /booking/cart
    - On the search page WITH valid dates each row has "Add to booking". The cart lives in
      the session: one date range + a list of rooms. Adding the same room twice -&gt; message
      "already in the booking"; a different date range starts a new cart. Remove button (1.0).
    - GET /booking/cart: rooms, price/night, nights, subtotal per room, total (0.75).
    - Confirm (guestName required, phone = 10 digits starting with 0) (0.5).
    - Saving = ONE transaction: re-check that every room is still free, insert Booking and
      its BookingRoom rows, commit; if a room was taken meanwhile -&gt; rollback, nothing saved,
      message. Success -&gt; empty the cart, show /booking/done?id=&lt;new id&gt; (0.75).

Accounts: quanly / 123 (MANAGER), letan / 123 (RECEPTIONIST).</code></pre>
<p>The script (rooms 101 and 201 are booked 20 → 23 Oct, room 301 is booked 25 → 26 Oct):</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(50)   NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(15)   NOT NULL CHECK (role IN ('MANAGER', 'RECEPTIONIST'))
);
CREATE TABLE RoomType (
    id    INT           NOT NULL PRIMARY KEY,
    name  NVARCHAR(50)  NOT NULL,
    price DECIMAL(12,0) NOT NULL                       -- VND per night
);
CREATE TABLE Room (
    roomNo  VARCHAR(5)    NOT NULL PRIMARY KEY,
    typeId  INT           NOT NULL REFERENCES RoomType(id),
    floorNo INT           NOT NULL CHECK (floorNo BETWEEN 1 AND 20),
    note    NVARCHAR(200) NULL
);
CREATE TABLE Booking (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    guestName NVARCHAR(100) NOT NULL,
    phone     VARCHAR(15)   NOT NULL,
    checkIn   DATE          NOT NULL,
    checkOut  DATE          NOT NULL,
    total     DECIMAL(14,0) NOT NULL,
    createdBy VARCHAR(30)   NOT NULL REFERENCES Account(username),
    CHECK (checkOut &gt; checkIn)
);
CREATE TABLE BookingRoom (
    bookingId     INT           NOT NULL REFERENCES Booking(id),
    roomNo        VARCHAR(5)    NOT NULL REFERENCES Room(roomNo),
    pricePerNight DECIMAL(12,0) NOT NULL,             -- the price ON the booking day (it may change later)
    PRIMARY KEY (bookingId, roomNo)
);</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account VALUES
    ('quanly', '123', N'Phạm Quốc Bảo', 'MANAGER'),
    ('letan',  '123', N'Lê Thị Hoa',    'RECEPTIONIST');
INSERT INTO RoomType VALUES (1, N'Standard', 500000), (2, N'Deluxe', 800000), (3, N'Suite', 1500000);
INSERT INTO Room VALUES
    ('101', 1, 1, NULL), ('102', 1, 1, NULL), ('103', 1, 1, N'near the lift'),
    ('201', 2, 2, NULL), ('202', 2, 2, N'sea view'),
    ('301', 3, 3, NULL), ('302', 3, 3, N'sea view');
SET IDENTITY_INSERT Booking ON;
INSERT INTO Booking (id, guestName, phone, checkIn, checkOut, total, createdBy) VALUES
    (1, N'Nguyễn Văn An', '0901234567', '2026-10-20', '2026-10-23', 3900000, 'letan'),
    (2, N'Hoàng Mai',     '0912345678', '2026-10-25', '2026-10-26', 1500000, 'letan');
SET IDENTITY_INSERT Booking OFF;
INSERT INTO BookingRoom VALUES (1, '101', 500000), (1, '201', 800000), (2, '301', 1500000);</code></pre>`,
    `<h2>📝 Đề thi (85 phút)</h2>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 2                            Duration: 85 minutes
HOTEL BOOKINGS

Instructions: as in every PE — run PE2_Hotel.sql (database PRJ301_Pe2KhachSan), rename the
template project to PE2_&lt;YourStudentCode&gt;, fill dal.DBContext, do not change libraries,
MVC with Servlet + JSP + JSTL + JDBC. A part that does not run gets 0.
(In the solution of this course the context path is /pe2-khach-san.)

Question 1 (2.0 points) — Login and roles
    - GET/POST /login against table Account. Wrong -&gt; "Invalid username or password" on the
      same page (0.25). Correct -&gt; account in session "account", redirect /room/search (0.5).
      GET /logout ends the session -&gt; /login (0.25).
    - ONE Filter for /room/* and /booking/*: not logged in -&gt; /login (0.5);
      /room/add, /room/edit, /room/delete are for MANAGER only -&gt; others get HTTP 403
      "Access denied" (0.5).

Question 2 (2.5 points) — Room search: GET /room/search
    - Table: Room, Type (name), Floor, Price/night formatted like 500.000 ₫, Note,
      ordered by room number (0.75).
    - Optional filters typeId (0 = all) and maxPrice (VND) (0.5).
    - Optional checkIn and checkOut (yyyy-mm-dd): when both are given, show only the rooms
      that are FREE for the whole stay: a room is NOT free if one of its bookings overlaps
      [checkIn, checkOut). Check-out day of one guest = check-in day of the next is OK (0.75).
    - Wrong input (only one date, a bad date, checkOut &lt;= checkIn, maxPrice not a number) -&gt;
      a message, all rooms listed, the form keeps what was typed (0.5).

Question 3 (2.5 points) — Rooms (MANAGER)
    - POST /room/add: roomNo 3-4 digits and not existing yet; type must exist; floorNo 1-20
      and equal to roomNo without its last two digits (305 -&gt; 3, 1205 -&gt; 12); note max 200.
      Each wrong field -&gt; its message, typed values kept (1.0). Success -&gt; back to the
      search page with "Room 401 added" shown ONCE (0.25).
    - Edit /room/edit?roomNo=.. (room number read-only) with the same rules (0.5).
    - POST /room/delete: a room that appears in a booking is NOT deleted -&gt; message
      "Room 101 has bookings and cannot be deleted"; otherwise deleted (0.75).

Question 4 (3.0 points) — Booking cart: /booking/cart
    - On the search page WITH valid dates each row has "Add to booking". The cart lives in
      the session: one date range + a list of rooms. Adding the same room twice -&gt; message
      "already in the booking"; a different date range starts a new cart. Remove button (1.0).
    - GET /booking/cart: rooms, price/night, nights, subtotal per room, total (0.75).
    - Confirm (guestName required, phone = 10 digits starting with 0) (0.5).
    - Saving = ONE transaction: re-check that every room is still free, insert Booking and
      its BookingRoom rows, commit; if a room was taken meanwhile -&gt; rollback, nothing saved,
      message. Success -&gt; empty the cart, show /booking/done?id=&lt;new id&gt; (0.75).

Accounts: quanly / 123 (MANAGER), letan / 123 (RECEPTIONIST).</code></pre>
<p><strong>Dịch từng ý.</strong></p>
<ul>
<li><strong>Hướng dẫn chung</strong>: như mọi đề PE — chạy script, đổi tên project thành <code>PE2_&lt;MãSV&gt;</code>, điền <code>dal.DBContext</code>, không đổi thư viện, làm MVC bằng Servlet + JSP + JSTL + JDBC; phần nào không chạy được 0 điểm.</li>
<li><strong>Câu 1 (2.0)</strong>: đăng nhập theo bảng Account; sai ⇒ "Invalid username or password" ngay trang đó (0.25); đúng ⇒ lưu tài khoản vào session tên <code>"account"</code>, chuyển tới <code>/room/search</code> (0.5); <code>/logout</code> huỷ session rồi về <code>/login</code> (0.25). MỘT Filter cho <code>/room/*</code> và <code>/booking/*</code>: chưa đăng nhập ⇒ <code>/login</code> (0.5); <code>/room/add</code>, <code>/room/edit</code>, <code>/room/delete</code> chỉ MANAGER, người khác nhận HTTP 403 "Access denied" (0.5).</li>
<li><strong>Câu 2 (2.5)</strong>: bảng phòng gồm số phòng, TÊN loại, tầng, giá/đêm định dạng kiểu 500.000 ₫, ghi chú, sắp theo số phòng (0.75); lọc tuỳ chọn theo loại (0 = tất cả) và giá tối đa (0.5); khi nhập đủ hai ngày nhận/trả phòng thì CHỈ hiện phòng TRỐNG suốt kỳ ở: phòng không trống nếu có lượt đặt chồng lên khoảng [nhận, trả); ngày khách này trả phòng trùng ngày khách sau nhận phòng là hợp lệ (0.75); nhập sai (chỉ một ngày, ngày hỏng, ngày trả ≤ ngày nhận, giá không phải số) ⇒ thông báo, vẫn liệt kê mọi phòng, form giữ chữ đã gõ (0.5).</li>
<li><strong>Câu 3 (2.5)</strong> — quản lý phòng (MANAGER): số phòng 3–4 chữ số và chưa tồn tại; loại phải có; tầng 1–20 và bằng số phòng bỏ hai chữ số cuối (305 ⇒ 3, 1205 ⇒ 12); ghi chú tối đa 200; ô sai có thông báo riêng, giữ chữ đã gõ (1.0); thành công ⇒ về trang tìm kiếm, hiện "Room 401 added" đúng MỘT lần (0.25). Sửa với cùng luật, số phòng chỉ đọc (0.5). Xoá: phòng đã có trong một lượt đặt thì KHÔNG xoá, báo "Room 101 has bookings and cannot be deleted"; ngược lại thì xoá (0.75).</li>
<li><strong>Câu 4 (3.0)</strong> — giỏ đặt phòng: trên trang tìm có ngày hợp lệ, mỗi dòng có nút "Add to booking"; giỏ nằm trong session: một khoảng ngày + danh sách phòng; thêm trùng phòng ⇒ báo "already in the booking"; khoảng ngày khác ⇒ bắt đầu giỏ mới; có nút bỏ phòng (1.0). Trang giỏ: phòng, giá/đêm, số đêm, thành tiền từng phòng, tổng (0.75). Xác nhận: tên khách bắt buộc, điện thoại 10 số bắt đầu bằng 0 (0.5). Lưu = MỘT giao dịch: kiểm lại mọi phòng vẫn trống, thêm Booking và các dòng BookingRoom, commit; nếu trong lúc đó có phòng đã bị đặt ⇒ rollback, không lưu gì, báo lỗi. Thành công ⇒ làm trống giỏ, chuyển tới <code>/booking/done?id=&lt;mã mới&gt;</code> (0.75).</li>
</ul>
<p>Script (phòng 101 và 201 đã có khách 20 → 23/10, phòng 301 có khách 25 → 26/10):</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(50)   NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(15)   NOT NULL CHECK (role IN ('MANAGER', 'RECEPTIONIST'))
);
CREATE TABLE RoomType (
    id    INT           NOT NULL PRIMARY KEY,
    name  NVARCHAR(50)  NOT NULL,
    price DECIMAL(12,0) NOT NULL                       -- VND mỗi đêm
);
CREATE TABLE Room (
    roomNo  VARCHAR(5)    NOT NULL PRIMARY KEY,
    typeId  INT           NOT NULL REFERENCES RoomType(id),
    floorNo INT           NOT NULL CHECK (floorNo BETWEEN 1 AND 20),
    note    NVARCHAR(200) NULL
);
CREATE TABLE Booking (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    guestName NVARCHAR(100) NOT NULL,
    phone     VARCHAR(15)   NOT NULL,
    checkIn   DATE          NOT NULL,
    checkOut  DATE          NOT NULL,
    total     DECIMAL(14,0) NOT NULL,
    createdBy VARCHAR(30)   NOT NULL REFERENCES Account(username),
    CHECK (checkOut &gt; checkIn)
);
CREATE TABLE BookingRoom (
    bookingId     INT           NOT NULL REFERENCES Booking(id),
    roomNo        VARCHAR(5)    NOT NULL REFERENCES Room(roomNo),
    pricePerNight DECIMAL(12,0) NOT NULL,             -- giá TẠI ngày đặt (sau này có thể đổi)
    PRIMARY KEY (bookingId, roomNo)
);</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account VALUES
    ('quanly', '123', N'Phạm Quốc Bảo', 'MANAGER'),
    ('letan',  '123', N'Lê Thị Hoa',    'RECEPTIONIST');
INSERT INTO RoomType VALUES (1, N'Standard', 500000), (2, N'Deluxe', 800000), (3, N'Suite', 1500000);
INSERT INTO Room VALUES
    ('101', 1, 1, NULL), ('102', 1, 1, NULL), ('103', 1, 1, N'near the lift'),
    ('201', 2, 2, NULL), ('202', 2, 2, N'sea view'),
    ('301', 3, 3, NULL), ('302', 3, 3, N'sea view');
SET IDENTITY_INSERT Booking ON;
INSERT INTO Booking (id, guestName, phone, checkIn, checkOut, total, createdBy) VALUES
    (1, N'Nguyễn Văn An', '0901234567', '2026-10-20', '2026-10-23', 3900000, 'letan'),
    (2, N'Hoàng Mai',     '0912345678', '2026-10-25', '2026-10-26', 1500000, 'letan');
SET IDENTITY_INSERT Booking OFF;
INSERT INTO BookingRoom VALUES (1, '101', 500000), (1, '201', 800000), (2, '301', 1500000);</code></pre>`),
    bi(`<h2>✅ Solution — every response below is real</h2>
<pre><code class="language-plaintext">PE2_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   Forms (safe parsing), LoginServlet, LogoutServlet, RoomSearchServlet,
│  │               RoomForm, RoomAddServlet, RoomEditServlet, RoomDeleteServlet,
│  │               CartServlet, BookingDoneServlet
│  ├─ dal          DBContext (given), AccountDAO, RoomTypeDAO, RoomDAO, BookingDAO
│  ├─ filter       AuthFilter
│  └─ model        Account, RoomType, Room, Cart, Booking
└─ Web Pages/WEB-INF/views   login.jsp, rooms.jsp, room-form.jsp, cart.jsp, done.jsp, 403.jsp</code></pre>
<h3>Q1 — two roles, one Filter</h3>
<p>Login, logout and the Filter are the same pattern as paper 1/3 (read its Q1 for the details). The only new part is the role rule: the Filter is mapped to two areas, and three exact paths need MANAGER.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/filter/AuthFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">boolean managerOnly = path.equals("/room/add") || path.equals("/room/edit") || path.equals("/room/delete");
if (managerOnly &amp;&amp; !account.isManager()) {
    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
    return;
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=letan&amp;password=1234</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Hotel — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="letan"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 27

username=letan&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 255

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;letan (RECEPTIONIST) cannot add, edit or delete rooms.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>Q2 — the free-room search</h3>
<p>Each filter is optional, and each one is written so that "not given" is a value: <code>(? = 0 OR r.typeId = ?)</code>, <code>(? IS NULL OR t.price &lt;= ?)</code>, and for the dates <code>(? IS NULL OR NOT EXISTS (…overlapping booking…))</code>. When a value is missing the servlet binds SQL <code>NULL</code> with <code>setNull(i, Types.DATE)</code>. One fixed SQL text, no string building.</p>
<p><strong>The overlap rule</strong> is the heart of the question. Two stays [a, b) and [c, d) overlap exactly when <code>a &lt; d AND b &gt; c</code> — each starts before the other ends. So an existing booking blocks the room when <code>b.checkIn &lt; :newCheckOut AND b.checkOut &gt; :newCheckIn</code>. Strict <code>&lt;</code>/<code>&gt;</code> make "check out on the 23rd, next guest checks in on the 23rd" legal. Mistake 10 below shows the rule most people write first, and the double booking it lets through.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/RoomDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Q2: type (0 = all), max price (null = any), and — when dates are given — only rooms with NO booking overlapping [in, out)
public List&lt;Room&gt; search(int typeId, Long maxPrice, LocalDate in, LocalDate out) throws SQLException {
    String sql = SELECT
            + " WHERE (? = 0 OR r.typeId = ?)"
            + " AND (? IS NULL OR t.price &lt;= ?)"
            + " AND (? IS NULL OR NOT EXISTS (SELECT 1 FROM BookingRoom br INNER JOIN Booking b ON br.bookingId = b.id"
            + "      WHERE br.roomNo = r.roomNo AND b.checkIn &lt; ? AND b.checkOut &gt; ?))"   // two stays overlap ⇔ each starts before the other ends
            + " ORDER BY r.roomNo";
    List&lt;Room&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setInt(1, typeId);
        ps.setInt(2, typeId);
        if (maxPrice == null) {
            ps.setNull(3, Types.DECIMAL);
            ps.setNull(4, Types.DECIMAL);
        } else {
            ps.setLong(3, maxPrice);
            ps.setLong(4, maxPrice);
        }
        if (in == null) {
            ps.setNull(5, Types.DATE);
            ps.setNull(6, Types.DATE);
            ps.setNull(7, Types.DATE);
        } else {
            ps.setDate(5, Date.valueOf(in));
            ps.setDate(6, Date.valueOf(out));              // existing.checkIn  &lt; new.checkOut
            ps.setDate(7, Date.valueOf(in));               // existing.checkOut &gt; new.checkIn
        }
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(map(rs));
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomSearchServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String inText = Forms.text(request.getParameter("checkIn"));
    String outText = Forms.text(request.getParameter("checkOut"));
    String priceText = Forms.text(request.getParameter("maxPrice"));
    Integer t = Forms.toInt(request.getParameter("typeId"));
    int typeId = t == null ? 0 : t;
    Long maxPrice = null;
    LocalDate in = null;
    LocalDate out = null;
    String error = null;
    if (!priceText.isEmpty()) {
        maxPrice = Forms.toLong(priceText);
        if (maxPrice == null || maxPrice &lt; 0) error = "Max price must be a whole number of VND";
    }
    if (!inText.isEmpty() || !outText.isEmpty()) {         // dates are optional, but if given they must make sense
        in = Forms.toDate(inText);
        out = Forms.toDate(outText);
        if (in == null || out == null) error = "Enter both dates as yyyy-mm-dd";
        else if (!out.isAfter(in)) error = "Check-out must be after check-in";
    }
    if (error != null) {                                   // a wrong filter ⇒ show the message, ignore the dates
        in = null;
        out = null;
        maxPrice = null;
    }
    try {
        request.setAttribute("rooms", new RoomDAO().search(typeId, maxPrice, in, out));
        request.setAttribute("types", new RoomTypeDAO().getAll());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    HttpSession session = request.getSession();
    Object flash = session.getAttribute("flash");          // a one-time message left by a redirect
    if (flash != null) {
        request.setAttribute("flash", flash);
        session.removeAttribute("flash");
    }
    request.setAttribute("error", error);
    request.setAttribute("withDates", in != null);
    request.setAttribute("typeId", typeId);
    request.getRequestDispatcher("/WEB-INF/views/rooms.jsp").forward(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/webapp/WEB-INF/views/rooms.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;&lt;c:out value="&#36;{withDates ? 'Free rooms from '.concat(param.checkIn).concat(' to ').concat(param.checkOut) : 'Rooms'}"/&gt;: &#36;{rooms.size()}&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{rooms}" var="r"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{r.roomNo}&lt;/td&gt;&lt;td&gt;&#36;{r.typeName}&lt;/td&gt;&lt;td&gt;&#36;{r.floorNo}&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{r.price}" pattern="#,##0"/&gt; ₫&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{r.note}"/&gt;&lt;/td&gt;
    &lt;td&gt;&lt;c:if test="&#36;{withDates}"&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="&#36;{r.roomNo}"&gt;&lt;input type="hidden" name="checkIn" value="&lt;c:out value='&#36;{param.checkIn}'/&gt;"&gt;
      &lt;input type="hidden" name="checkOut" value="&lt;c:out value='&#36;{param.checkOut}'/&gt;"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/c:if&gt;
      &lt;c:if test="&#36;{sessionScope.account.manager}"&gt;&lt;a href="edit?roomNo=&#36;{r.roomNo}"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="&#36;{r.roomNo}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/c:if&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Rooms: 7&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;201&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Prices are printed by <code>&lt;fmt:formatNumber value="…" pattern="#,##0"/&gt;</code> after <code>&lt;fmt:setLocale value="vi_VN"/&gt;</code>, so the thousands separator is a dot: 1.500.000 ₫. Setting the locale on the page matters — paper 3/3 measures what <code>fmt</code> prints when you do not. Now dates in the wrong order, then a real search for 21 → 23 Oct under 1,000,000 VND:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=0&amp;maxPrice=&amp;checkIn=2026-10-22&amp;checkOut=2026-10-21 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-22"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-21"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p class="error"&gt;Check-out must be after check-in&lt;/p&gt;&lt;p&gt;Rooms: 7&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;201&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
… (8 more lines / còn 8 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=0&amp;maxPrice=1000000&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value="1000000"&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-21"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-23"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-21 to 2026-10-23: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="102"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="202"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>101 and 201 are gone (booked 20 → 23), 301/302 are above the price limit, and every free row now carries an "Add to booking" form with the dates in hidden fields.</p>
<p>The boundary case the examiner loves: the old guest of 101 leaves on the 23rd, a new guest arrives on the 23rd. With strict signs 101 is free (<code>20 &lt; 25</code> is true but <code>23 &gt; 23</code> is false):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=1&amp;maxPrice=&amp;checkIn=2026-10-23&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-23"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-25"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-23 to 2026-10-25: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="101"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="102"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h2>✅ Lời giải — mọi response bên dưới là thật</h2>
<pre><code class="language-plaintext">PE2_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   Forms (safe parsing), LoginServlet, LogoutServlet, RoomSearchServlet,
│  │               RoomForm, RoomAddServlet, RoomEditServlet, RoomDeleteServlet,
│  │               CartServlet, BookingDoneServlet
│  ├─ dal          DBContext (given), AccountDAO, RoomTypeDAO, RoomDAO, BookingDAO
│  ├─ filter       AuthFilter
│  └─ model        Account, RoomType, Room, Cart, Booking
└─ Web Pages/WEB-INF/views   login.jsp, rooms.jsp, room-form.jsp, cart.jsp, done.jsp, 403.jsp</code></pre>
<h3>Câu 1 — hai vai trò, một Filter</h3>
<p>Đăng nhập, đăng xuất và Filter đi đúng khuôn của đề 1/3 (đọc Câu 1 ở đó để xem chi tiết). Phần mới duy nhất là luật vai trò: Filter được ánh xạ vào hai vùng URL, và ba đường dẫn cụ thể cần MANAGER.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/filter/AuthFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">boolean managerOnly = path.equals("/room/add") || path.equals("/room/edit") || path.equals("/room/delete");
if (managerOnly &amp;&amp; !account.isManager()) {
    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
    return;
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

username=letan&amp;password=1234</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Hotel — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="letan"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 27

username=letan&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 255

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;letan (RECEPTIONIST) cannot add, edit or delete rooms.&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>Câu 2 — tìm phòng trống</h3>
<p>Bộ lọc nào cũng tuỳ chọn, và cái nào cũng viết sao cho "không nhập" cũng là một giá trị: <code>(? = 0 OR r.typeId = ?)</code>, <code>(? IS NULL OR t.price &lt;= ?)</code>, còn phần ngày là <code>(? IS NULL OR NOT EXISTS (…lượt đặt chồng ngày…))</code>. Khi thiếu một giá trị, servlet gán <code>NULL</code> của SQL bằng <code>setNull(i, Types.DATE)</code>. Một câu SQL cố định, không ghép chuỗi.</p>
<p><strong>Luật chồng ngày</strong> là trái tim của câu này. Hai lượt ở [a, b) và [c, d) chồng nhau đúng khi <code>a &lt; d AND b &gt; c</code> — lượt này bắt đầu trước khi lượt kia kết thúc, và ngược lại. Vậy một lượt đặt cũ chặn phòng khi <code>b.checkIn &lt; :ngàyTrảMới AND b.checkOut &gt; :ngàyNhậnMới</code>. Dùng <code>&lt;</code>/<code>&gt;</code> chặt (không có dấu bằng) để "trả phòng ngày 23, khách sau nhận phòng ngày 23" là hợp lệ. Lỗi 10 bên dưới cho thấy điều kiện mà đa số người viết ra đầu tiên, và việc đặt trùng phòng mà nó để lọt.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/RoomDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Câu 2: loại (0 = tất cả), giá tối đa (null = bất kỳ), và — khi có ngày — chỉ phòng KHÔNG có đặt chỗ nào chồng lên [in, out)
public List&lt;Room&gt; search(int typeId, Long maxPrice, LocalDate in, LocalDate out) throws SQLException {
    String sql = SELECT
            + " WHERE (? = 0 OR r.typeId = ?)"
            + " AND (? IS NULL OR t.price &lt;= ?)"
            + " AND (? IS NULL OR NOT EXISTS (SELECT 1 FROM BookingRoom br INNER JOIN Booking b ON br.bookingId = b.id"
            + "      WHERE br.roomNo = r.roomNo AND b.checkIn &lt; ? AND b.checkOut &gt; ?))"   // hai lượt ở chồng nhau ⇔ lượt này bắt đầu trước khi lượt kia kết thúc, và ngược lại
            + " ORDER BY r.roomNo";
    List&lt;Room&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setInt(1, typeId);
        ps.setInt(2, typeId);
        if (maxPrice == null) {
            ps.setNull(3, Types.DECIMAL);
            ps.setNull(4, Types.DECIMAL);
        } else {
            ps.setLong(3, maxPrice);
            ps.setLong(4, maxPrice);
        }
        if (in == null) {
            ps.setNull(5, Types.DATE);
            ps.setNull(6, Types.DATE);
            ps.setNull(7, Types.DATE);
        } else {
            ps.setDate(5, Date.valueOf(in));
            ps.setDate(6, Date.valueOf(out));              // đặt cũ.checkIn  &lt; đặt mới.checkOut
            ps.setDate(7, Date.valueOf(in));               // đặt cũ.checkOut &gt; đặt mới.checkIn
        }
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(map(rs));
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomSearchServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String inText = Forms.text(request.getParameter("checkIn"));
    String outText = Forms.text(request.getParameter("checkOut"));
    String priceText = Forms.text(request.getParameter("maxPrice"));
    Integer t = Forms.toInt(request.getParameter("typeId"));
    int typeId = t == null ? 0 : t;
    Long maxPrice = null;
    LocalDate in = null;
    LocalDate out = null;
    String error = null;
    if (!priceText.isEmpty()) {
        maxPrice = Forms.toLong(priceText);
        if (maxPrice == null || maxPrice &lt; 0) error = "Max price must be a whole number of VND";
    }
    if (!inText.isEmpty() || !outText.isEmpty()) {         // ngày không bắt buộc, nhưng đã nhập thì phải hợp lý
        in = Forms.toDate(inText);
        out = Forms.toDate(outText);
        if (in == null || out == null) error = "Enter both dates as yyyy-mm-dd";
        else if (!out.isAfter(in)) error = "Check-out must be after check-in";
    }
    if (error != null) {                                   // bộ lọc sai ⇒ báo lỗi, bỏ qua phần ngày
        in = null;
        out = null;
        maxPrice = null;
    }
    try {
        request.setAttribute("rooms", new RoomDAO().search(typeId, maxPrice, in, out));
        request.setAttribute("types", new RoomTypeDAO().getAll());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    HttpSession session = request.getSession();
    Object flash = session.getAttribute("flash");          // thông báo dùng một lần do một redirect để lại
    if (flash != null) {
        request.setAttribute("flash", flash);
        session.removeAttribute("flash");
    }
    request.setAttribute("error", error);
    request.setAttribute("withDates", in != null);
    request.setAttribute("typeId", typeId);
    request.getRequestDispatcher("/WEB-INF/views/rooms.jsp").forward(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/webapp/WEB-INF/views/rooms.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;&lt;c:out value="&#36;{withDates ? 'Free rooms from '.concat(param.checkIn).concat(' to ').concat(param.checkOut) : 'Rooms'}"/&gt;: &#36;{rooms.size()}&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{rooms}" var="r"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{r.roomNo}&lt;/td&gt;&lt;td&gt;&#36;{r.typeName}&lt;/td&gt;&lt;td&gt;&#36;{r.floorNo}&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{r.price}" pattern="#,##0"/&gt; ₫&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{r.note}"/&gt;&lt;/td&gt;
    &lt;td&gt;&lt;c:if test="&#36;{withDates}"&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="&#36;{r.roomNo}"&gt;&lt;input type="hidden" name="checkIn" value="&lt;c:out value='&#36;{param.checkIn}'/&gt;"&gt;
      &lt;input type="hidden" name="checkOut" value="&lt;c:out value='&#36;{param.checkOut}'/&gt;"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/c:if&gt;
      &lt;c:if test="&#36;{sessionScope.account.manager}"&gt;&lt;a href="edit?roomNo=&#36;{r.roomNo}"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="&#36;{r.roomNo}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/c:if&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Rooms: 7&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;201&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Giá được in bằng <code>&lt;fmt:formatNumber value="…" pattern="#,##0"/&gt;</code> sau <code>&lt;fmt:setLocale value="vi_VN"/&gt;</code>, nên dấu phân cách hàng nghìn là dấu chấm: 1.500.000 ₫. Đặt locale (quy ước vùng: dấu thập phân, dấu nghìn) ngay trên trang là quan trọng — đề 3/3 đo xem <code>fmt</code> in ra gì khi bạn không đặt. Giờ thử ngày ngược thứ tự, rồi một lần tìm thật cho 21 → 23/10 dưới 1.000.000 đồng:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=0&amp;maxPrice=&amp;checkIn=2026-10-22&amp;checkOut=2026-10-21 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-22"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-21"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p class="error"&gt;Check-out must be after check-in&lt;/p&gt;&lt;p&gt;Rooms: 7&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;201&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
… (8 more lines / còn 8 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=0&amp;maxPrice=1000000&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value="1000000"&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-21"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-23"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-21 to 2026-10-23: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="102"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="202"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-21"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-23"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>101 và 201 biến mất (đã có khách 20 → 23), 301/302 vượt giá tối đa, và mỗi dòng phòng trống giờ có một form "Add to booking" mang hai ngày trong ô ẩn (hidden field).</p>
<p>Trường hợp biên mà người chấm rất thích: khách cũ của 101 trả phòng ngày 23, khách mới nhận phòng ngày 23. Với dấu chặt, 101 là trống (<code>20 &lt; 25</code> đúng nhưng <code>23 &gt; 23</code> sai):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=1&amp;maxPrice=&amp;checkIn=2026-10-23&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-23"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-25"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-23 to 2026-10-25: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="101"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="102"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-23"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-25"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h3>Q3 — rooms: validation, duplicate key, "has bookings"</h3>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomForm.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Rules of the paper: room number = 3–4 digits, unique; floor 1–20 AND equal to the number without its last two digits (305 → 3)
public boolean validate(boolean typeExists, boolean duplicate) {
    if (!roomNo.matches("\\\\d{3,4}")) errors.put("roomNo", "Room number must be 3 or 4 digits");
    else if (duplicate) errors.put("roomNo", "Room " + roomNo + " already exists");
    if (!typeExists) errors.put("typeId", "Choose a room type");
    Integer floor = Forms.toInt(floorNo);
    if (floor == null || floor &lt; 1 || floor &gt; 20) errors.put("floorNo", "Floor must be a whole number from 1 to 20");
    else if (!errors.containsKey("roomNo") &amp;&amp; Integer.parseInt(roomNo) / 100 != floor)
        errors.put("floorNo", "Room " + roomNo + " must be on floor " + Integer.parseInt(roomNo) / 100);
    if (note.length() &gt; 200) errors.put("note", "Note must be at most 200 characters");
    return errors.isEmpty();
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomAddServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    RoomForm form = RoomForm.fromRequest(request);
    try {
        RoomDAO dao = new RoomDAO();
        Integer typeId = Forms.toInt(form.getTypeId());
        boolean typeExists = typeId != null &amp;&amp; new RoomTypeDAO().exists(typeId);
        boolean duplicate = dao.getByNo(form.getRoomNo()) != null;   // check BEFORE insert: a message, not a 500 PRIMARY KEY error
        if (!form.validate(typeExists, duplicate)) {
            show(request, response, form, false);
            return;
        }
        dao.insert(form.toRoom());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", "Room " + form.getRoomNo() + " added");
    response.sendRedirect(request.getContextPath() + "/room/search");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=quanly&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/pe2-khach-san; HttpOnly
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 34

roomNo=1A&amp;typeId=9&amp;floorNo=0&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="1A" &gt; &lt;span class="error"&gt;Room number must be 3 or 4 digits&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;Choose a room type&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="0"&gt; &lt;span class="error"&gt;Floor must be a whole number from 1 to 20&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 35

roomNo=101&amp;typeId=1&amp;floorNo=1&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="101" &gt; &lt;span class="error"&gt;Room 101 already exists&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="1"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 35

roomNo=401&amp;typeId=2&amp;floorNo=3&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="401" &gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" selected&gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="3"&gt; &lt;span class="error"&gt;Room 401 must be on floor 4&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The duplicate is caught by a SELECT <em>before</em> the INSERT, so the user reads "Room 101 already exists" instead of a 500 "Violation of PRIMARY KEY constraint". The floor rule is only checked when the room number itself is valid (no point telling "must be on floor 0" about "1A").</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 56

roomNo=401&amp;typeId=2&amp;floorNo=4&amp;note=c%C3%B3+ban+c%C3%B4ng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/edit?roomNo=401 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit room 401&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
  Room number &lt;input name="roomNo" value="401" readonly&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" selected&gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="4"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value="có ban công"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 48

roomNo=401&amp;typeId=3&amp;floorNo=4&amp;note=view+n%C3%BAi</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p>Delete checks for bookings first and leaves a <strong>flash message</strong> in the session: the search page shows it once and removes it, so it survives the redirect (a request attribute would not — the redirect starts a new request) but does not come back on F5.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/RoomDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public boolean hasBookings(String roomNo) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT 1 FROM BookingRoom WHERE roomNo = ?")) {
        ps.setString(1, roomNo);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next();
        }
    }
}

public int delete(String roomNo) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("DELETE FROM Room WHERE roomNo = ?")) {
        ps.setString(1, roomNo);
        return ps.executeUpdate();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomDeleteServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String roomNo = Forms.text(request.getParameter("roomNo"));
    String message;
    try {
        RoomDAO dao = new RoomDAO();
        if (dao.hasBookings(roomNo)) {
            message = "Room " + roomNo + " has bookings and cannot be deleted";
        } else {
            message = dao.delete(roomNo) == 1 ? "Room " + roomNo + " deleted" : "Room " + roomNo + " not found";
        }
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", message);
    response.sendRedirect(request.getContextPath() + "/room/search");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 10

roomNo=101</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Phạm Quốc Bảo (MANAGER) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Room 101 has bookings and cannot be deleted&lt;/p&gt;&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" selected&gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a room&lt;/a&gt;&lt;/p&gt;&lt;p&gt;Rooms: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=301"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=302"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="302"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;401&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;view núi&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=401"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="401"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 10

roomNo=401</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Phạm Quốc Bảo (MANAGER) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Room 401 deleted&lt;/p&gt;&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" selected&gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a room&lt;/a&gt;&lt;/p&gt;&lt;p&gt;Rooms: 2&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=301"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=302"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="302"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h3>Câu 3 — phòng: kiểm dữ liệu, trùng khoá, "đã có lượt đặt"</h3>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomForm.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Luật của đề: số phòng = 3–4 chữ số, không trùng; tầng 1–20 VÀ bằng số phòng bỏ hai chữ số cuối (305 → 3)
public boolean validate(boolean typeExists, boolean duplicate) {
    if (!roomNo.matches("\\\\d{3,4}")) errors.put("roomNo", "Room number must be 3 or 4 digits");
    else if (duplicate) errors.put("roomNo", "Room " + roomNo + " already exists");
    if (!typeExists) errors.put("typeId", "Choose a room type");
    Integer floor = Forms.toInt(floorNo);
    if (floor == null || floor &lt; 1 || floor &gt; 20) errors.put("floorNo", "Floor must be a whole number from 1 to 20");
    else if (!errors.containsKey("roomNo") &amp;&amp; Integer.parseInt(roomNo) / 100 != floor)
        errors.put("floorNo", "Room " + roomNo + " must be on floor " + Integer.parseInt(roomNo) / 100);
    if (note.length() &gt; 200) errors.put("note", "Note must be at most 200 characters");
    return errors.isEmpty();
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomAddServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    RoomForm form = RoomForm.fromRequest(request);
    try {
        RoomDAO dao = new RoomDAO();
        Integer typeId = Forms.toInt(form.getTypeId());
        boolean typeExists = typeId != null &amp;&amp; new RoomTypeDAO().exists(typeId);
        boolean duplicate = dao.getByNo(form.getRoomNo()) != null;   // kiểm TRƯỚC khi insert: một thông báo, không phải lỗi 500 trùng khoá chính
        if (!form.validate(typeExists, duplicate)) {
            show(request, response, form, false);
            return;
        }
        dao.insert(form.toRoom());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", "Room " + form.getRoomNo() + " added");
    response.sendRedirect(request.getContextPath() + "/room/search");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

username=quanly&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/pe2-khach-san; HttpOnly
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 34

roomNo=1A&amp;typeId=9&amp;floorNo=0&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="1A" &gt; &lt;span class="error"&gt;Room number must be 3 or 4 digits&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;Choose a room type&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="0"&gt; &lt;span class="error"&gt;Floor must be a whole number from 1 to 20&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 35

roomNo=101&amp;typeId=1&amp;floorNo=1&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="101" &gt; &lt;span class="error"&gt;Room 101 already exists&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="1"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 35

roomNo=401&amp;typeId=2&amp;floorNo=3&amp;note=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add a room&lt;/h1&gt;
&lt;form action="add" method="post"&gt;
  Room number &lt;input name="roomNo" value="401" &gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" selected&gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="3"&gt; &lt;span class="error"&gt;Room 401 must be on floor 4&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Trùng phòng được bắt bằng một câu SELECT <em>trước</em> khi INSERT, nên người dùng đọc "Room 101 already exists" thay vì một trang 500 "Violation of PRIMARY KEY constraint". Luật tầng chỉ được kiểm khi bản thân số phòng hợp lệ (báo "phải ở tầng 0" cho "1A" thì vô nghĩa).</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 56

roomNo=401&amp;typeId=2&amp;floorNo=4&amp;note=c%C3%B3+ban+c%C3%B4ng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/edit?roomNo=401 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit room&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit room 401&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
  Room number &lt;input name="roomNo" value="401" readonly&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Type &lt;select name="typeId"&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" selected&gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Floor &lt;input name="floorNo" value="4"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Note &lt;input name="note" value="có ban công"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="search"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 48

roomNo=401&amp;typeId=3&amp;floorNo=4&amp;note=view+n%C3%BAi</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p>Xoá thì kiểm lượt đặt trước, và để lại một <strong>thông báo flash</strong> (thông báo dùng một lần) trong session: trang tìm kiếm hiện nó một lần rồi gỡ đi, nên nó sống sót qua redirect (một attribute của request thì không — redirect bắt đầu một request mới) nhưng không hiện lại khi F5.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/RoomDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public boolean hasBookings(String roomNo) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT 1 FROM BookingRoom WHERE roomNo = ?")) {
        ps.setString(1, roomNo);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next();
        }
    }
}

public int delete(String roomNo) throws SQLException {
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement("DELETE FROM Room WHERE roomNo = ?")) {
        ps.setString(1, roomNo);
        return ps.executeUpdate();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/RoomDeleteServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String roomNo = Forms.text(request.getParameter("roomNo"));
    String message;
    try {
        RoomDAO dao = new RoomDAO();
        if (dao.hasBookings(roomNo)) {
            message = "Room " + roomNo + " has bookings and cannot be deleted";
        } else {
            message = dao.delete(roomNo) == 1 ? "Room " + roomNo + " deleted" : "Room " + roomNo + " not found";
        }
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", message);
    response.sendRedirect(request.getContextPath() + "/room/search");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 10

roomNo=101</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Phạm Quốc Bảo (MANAGER) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Room 101 has bookings and cannot be deleted&lt;/p&gt;&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" selected&gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a room&lt;/a&gt;&lt;/p&gt;&lt;p&gt;Rooms: 3&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=301"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=302"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="302"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;401&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;view núi&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=401"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="401"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/room/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 10

roomNo=401</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/room/search
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Phạm Quốc Bảo (MANAGER) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Room 401 deleted&lt;/p&gt;&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" &gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" selected&gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value=""&gt;
  Check-out &lt;input type="date" name="checkOut" value=""&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="add"&gt;Add a room&lt;/a&gt;&lt;/p&gt;&lt;p&gt;Rooms: 2&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;301&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=301"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;302&lt;/td&gt;&lt;td&gt;Suite&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;1.500.000 ₫&lt;/td&gt;&lt;td&gt;sea view&lt;/td&gt;
    &lt;td&gt;&lt;a href="edit?roomNo=302"&gt;Edit&lt;/a&gt;
      &lt;form action="delete" method="post"&gt;&lt;input type="hidden" name="roomNo" value="302"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h3>Q4 — the cart in the session</h3>
<p><code>Cart</code> is a plain Java object stored under ONE session attribute name, found or created in ONE method. It knows its date range, its rooms, the number of nights (<code>ChronoUnit.DAYS.between</code>) and the total (sum of nightly prices × nights). The rule "new dates ⇒ new cart" lives inside <code>add</code>.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/model/Cart.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Returns a message for the user
public String add(Room room, LocalDate in, LocalDate out) {
    if (checkIn != null &amp;&amp; (!checkIn.equals(in) || !checkOut.equals(out))) {
        rooms.clear();                                     // new dates ⇒ start a new cart
    }
    checkIn = in;
    checkOut = out;
    for (Room r : rooms) {
        if (r.getRoomNo().equals(room.getRoomNo())) return "Room " + room.getRoomNo() + " is already in the booking";
    }
    rooms.add(room);
    return "Room " + room.getRoomNo() + " added";
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/model/Cart.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public long getNights() {
    return checkIn == null ? 0 : ChronoUnit.DAYS.between(checkIn, checkOut);
}

public long getTotal() {
    long perNight = 0;
    for (Room r : rooms) perNight += r.getPrice();
    return perNight * getNights();
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// ONE place that finds-or-creates the cart, under ONE attribute name
private static Cart cartOf(HttpSession session) {
    Cart cart = (Cart) session.getAttribute("cart");
    if (cart == null) {
        cart = new Cart();
        session.setAttribute("cart", cart);
    }
    return cart;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "add": {
    LocalDate in = Forms.toDate(request.getParameter("checkIn"));
    LocalDate out = Forms.toDate(request.getParameter("checkOut"));
    Room room = new RoomDAO().getByNo(Forms.text(request.getParameter("roomNo")));
    if (room == null || in == null || out == null || !out.isAfter(in)) {
        session.setAttribute("flash", "Choose a room and a valid date range first");
    } else {
        session.setAttribute("flash", cart.add(room, in, out));
    }
    break;
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=102&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=202&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=102&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="flash"&gt;Room 102 is already in the booking&lt;/p&gt;&lt;p&gt;From 2026-10-21 to 2026-10-23 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="102"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;1.600.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="202"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;2.600.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value=""&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Two nights: 2 × 500.000 + 2 × 800.000 = 2.600.000 ₫, and the third add left the message "Room 102 is already in the booking". A warning from building this very page: the first version tested <code>&#36;{cart.empty}</code> in the JSP and the page did not even compile — <code>empty</code> is an EL operator (mistake 6). The page uses <code>&#36;{empty cart.rooms}</code>.</p>
<h3>Q4 — confirm = one transaction</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/8a3093d88058220d9febd17c6615a0c77fef6a6d.svg" alt="Confirming: validate, then ONE transaction that re-checks, inserts, commits — or rolls everything back" loading="lazy" /><p class="chu-thich">🧩 Confirming: validate, then ONE transaction that re-checks, inserts, commits — or rolls everything back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 2, Q4: confirming the booking is ONE transaction
actor "Receptionist" as U
participant "CartServlet\\n(action=confirm)" as C
participant "BookingDAO.create" as D
database "SQL Server" as DB
U -&gt; C : POST guestName, phone
C -&gt; C : validate (name, 10-digit phone,\\ncart not empty)
alt invalid
  C --&gt; U : 200 cart.jsp + messages
else valid
  C -&gt; D : create(cart, guest, phone, user)
  D -&gt; DB : setAutoCommit(false)
  loop each room in the cart
    D -&gt; DB : overlapping booking exists?
  end
  alt a room was taken since the search
    D -&gt; DB : rollback()
    D --&gt; C : IllegalStateException
    C --&gt; U : 302 /booking/cart + flash "no longer free"
  else all rooms free
    D -&gt; DB : INSERT Booking (get IDENTITY)
    D -&gt; DB : INSERT BookingRoom × n (batch)
    D -&gt; DB : commit()
    D --&gt; C : new id
    C -&gt; C : session.removeAttribute("cart")
    C --&gt; U : 302 /booking/done?id=…
  end
end
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "confirm": {
    String guest = Forms.text(request.getParameter("guestName"));
    String phone = Forms.text(request.getParameter("phone"));
    Map&lt;String, String&gt; errors = new LinkedHashMap&lt;&gt;();
    if (cart.isEmpty()) errors.put("cart", "The booking has no room");
    if (guest.isEmpty() || guest.length() &gt; 100) errors.put("guestName", "Guest name is required (max 100 characters)");
    if (!phone.matches("0\\\\d{9}")) errors.put("phone", "Phone must be 10 digits starting with 0");
    if (!errors.isEmpty()) {
        request.setAttribute("errors", errors);
        request.setAttribute("cart", cart);
        request.getRequestDispatcher("/WEB-INF/views/cart.jsp").forward(request, response);
        return;
    }
    Account acc = (Account) session.getAttribute("account");
    try {
        int id = new BookingDAO().create(cart, guest, phone, acc.getUsername());
        session.removeAttribute("cart");       // booked ⇒ empty cart
        response.sendRedirect(request.getContextPath() + "/booking/done?id=" + id);
        return;
    } catch (IllegalStateException conflict) {
        session.setAttribute("flash", conflict.getMessage());
    }
    break;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/BookingDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Q4: one booking = 1 row in Booking + n rows in BookingRoom — ALL or NOTHING (a transaction)
public int create(Cart cart, String guestName, String phone, String createdBy) throws SQLException {
    try (Connection con = getConnection()) {
        con.setAutoCommit(false);                          // from here nothing is permanent until commit()
        try {
            for (Room r : cart.getRooms()) {               // re-check INSIDE the transaction: someone may have booked it since the search
                if (isTaken(con, r.getRoomNo(), cart)) {
                    con.rollback();
                    throw new IllegalStateException("Room " + r.getRoomNo() + " is no longer free for these dates. Nothing was saved.");
                }
            }
            int id;
            String sql = "INSERT INTO Booking (guestName, phone, checkIn, checkOut, total, createdBy) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, guestName);
                ps.setString(2, phone);
                ps.setDate(3, Date.valueOf(cart.getCheckIn()));
                ps.setDate(4, Date.valueOf(cart.getCheckOut()));
                ps.setLong(5, cart.getTotal());
                ps.setString(6, createdBy);
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    keys.next();
                    id = keys.getInt(1);                   // the IDENTITY value SQL Server just made
                }
            }
            try (PreparedStatement ps = con.prepareStatement("INSERT INTO BookingRoom (bookingId, roomNo, pricePerNight) VALUES (?, ?, ?)")) {
                for (Room r : cart.getRooms()) {
                    ps.setInt(1, id);
                    ps.setString(2, r.getRoomNo());
                    ps.setLong(3, r.getPrice());
                    ps.addBatch();
                }
                ps.executeBatch();
            }
            con.commit();
            return id;
        } catch (SQLException e) {
            con.rollback();                                // any SQL error ⇒ undo the half-written booking
            throw e;
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

action=confirm&amp;guestName=&amp;phone=12345</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="error"&gt;Guest name is required (max 100 characters)&lt;/p&gt;&lt;p class="error"&gt;Phone must be 10 digits starting with 0&lt;/p&gt;&lt;p&gt;From 2026-10-21 to 2026-10-23 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="102"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;1.600.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="202"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;2.600.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value="12345"&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 76

action=confirm&amp;guestName=Tr%E1%BA%A7n+Th%E1%BB%8B+B%C3%ACnh&amp;phone=0987654321</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/done?id=3
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/done?id=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking #3&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking #3 confirmed&lt;/h1&gt;
&lt;p&gt;Guest: Trần Thị Bình (0987654321)&lt;/p&gt;
&lt;p&gt;Rooms 102, 202, from 2026-10-21 to 2026-10-23&lt;/p&gt;
&lt;p&gt;Total: 2.600.000 ₫&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=1&amp;maxPrice=&amp;checkIn=2026-10-22&amp;checkOut=2026-10-24 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-22"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-24"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-22 to 2026-10-24: 1&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-22"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-24"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Booking #3 is saved with both rooms (<code>STRING_AGG</code> lists them — SQL Server 2017 or newer), and searching 22 → 24 Oct no longer offers 102. Why re-check inside the transaction? Because the search happened minutes ago and another receptionist may have booked the room since. We simulate that with a crafted POST that puts room 101 (booked 20 → 23) into a cart for 22 → 24:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=101&amp;checkIn=2026-10-22&amp;checkOut=2026-10-24</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 54

action=confirm&amp;guestName=Kh%C3%A1ch+X&amp;phone=0911111111</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="flash"&gt;Room 101 is no longer free for these dates. Nothing was saved.&lt;/p&gt;&lt;p&gt;From 2026-10-22 to 2026-10-24 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="101"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;1.000.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value=""&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The transaction found the clash, rolled back and saved nothing; the cart is still there so the receptionist can remove 101 and try again. <code>con.setAutoCommit(false)</code> starts the transaction, <code>commit()</code> makes both INSERTs permanent together, and the <code>catch</code> calls <code>rollback()</code> for any SQL error — mistake 9 shows the half-saved booking you get without it.</p>`,
    `<h3>Câu 4 — giỏ trong session</h3>
<p><code>Cart</code> là một đối tượng Java thường, cất dưới MỘT tên attribute của session, được tìm-hoặc-tạo trong MỘT phương thức. Nó biết khoảng ngày, danh sách phòng, số đêm (<code>ChronoUnit.DAYS.between</code>) và tổng tiền (tổng giá một đêm × số đêm). Luật "ngày mới ⇒ giỏ mới" nằm ngay trong <code>add</code>.</p>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/model/Cart.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Trả về một câu thông báo cho người dùng
public String add(Room room, LocalDate in, LocalDate out) {
    if (checkIn != null &amp;&amp; (!checkIn.equals(in) || !checkOut.equals(out))) {
        rooms.clear();                                     // ngày mới ⇒ bắt đầu giỏ mới
    }
    checkIn = in;
    checkOut = out;
    for (Room r : rooms) {
        if (r.getRoomNo().equals(room.getRoomNo())) return "Room " + room.getRoomNo() + " is already in the booking";
    }
    rooms.add(room);
    return "Room " + room.getRoomNo() + " added";
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/model/Cart.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public long getNights() {
    return checkIn == null ? 0 : ChronoUnit.DAYS.between(checkIn, checkOut);
}

public long getTotal() {
    long perNight = 0;
    for (Room r : rooms) perNight += r.getPrice();
    return perNight * getNights();
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// MỘT chỗ duy nhất tìm-hoặc-tạo giỏ, dưới MỘT tên attribute
private static Cart cartOf(HttpSession session) {
    Cart cart = (Cart) session.getAttribute("cart");
    if (cart == null) {
        cart = new Cart();
        session.setAttribute("cart", cart);
    }
    return cart;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "add": {
    LocalDate in = Forms.toDate(request.getParameter("checkIn"));
    LocalDate out = Forms.toDate(request.getParameter("checkOut"));
    Room room = new RoomDAO().getByNo(Forms.text(request.getParameter("roomNo")));
    if (room == null || in == null || out == null || !out.isAfter(in)) {
        session.setAttribute("flash", "Choose a room and a valid date range first");
    } else {
        session.setAttribute("flash", cart.add(room, in, out));
    }
    break;
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=102&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=202&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=102&amp;checkIn=2026-10-21&amp;checkOut=2026-10-23</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="flash"&gt;Room 102 is already in the booking&lt;/p&gt;&lt;p&gt;From 2026-10-21 to 2026-10-23 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="102"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;1.600.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="202"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;2.600.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value=""&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Hai đêm: 2 × 500.000 + 2 × 800.000 = 2.600.000 ₫, và lần thêm thứ ba để lại thông báo "Room 102 is already in the booking". Một cảnh báo rút ra từ chính lúc dựng trang này: bản đầu kiểm <code>&#36;{cart.empty}</code> trong JSP và trang không biên dịch nổi — <code>empty</code> là một toán tử của EL (lỗi 6). Trang dùng <code>&#36;{empty cart.rooms}</code>.</p>
<h3>Câu 4 — xác nhận = một giao dịch</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/8a3093d88058220d9febd17c6615a0c77fef6a6d.svg" alt="Xác nhận: kiểm dữ liệu, rồi MỘT giao dịch kiểm lại, thêm, commit — hoặc rollback toàn bộ" loading="lazy" /><p class="chu-thich">🧩 Xác nhận: kiểm dữ liệu, rồi MỘT giao dịch kiểm lại, thêm, commit — hoặc rollback toàn bộ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 2, Q4: confirming the booking is ONE transaction
actor "Receptionist" as U
participant "CartServlet\\n(action=confirm)" as C
participant "BookingDAO.create" as D
database "SQL Server" as DB
U -&gt; C : POST guestName, phone
C -&gt; C : validate (name, 10-digit phone,\\ncart not empty)
alt invalid
  C --&gt; U : 200 cart.jsp + messages
else valid
  C -&gt; D : create(cart, guest, phone, user)
  D -&gt; DB : setAutoCommit(false)
  loop each room in the cart
    D -&gt; DB : overlapping booking exists?
  end
  alt a room was taken since the search
    D -&gt; DB : rollback()
    D --&gt; C : IllegalStateException
    C --&gt; U : 302 /booking/cart + flash "no longer free"
  else all rooms free
    D -&gt; DB : INSERT Booking (get IDENTITY)
    D -&gt; DB : INSERT BookingRoom × n (batch)
    D -&gt; DB : commit()
    D --&gt; C : new id
    C -&gt; C : session.removeAttribute("cart")
    C --&gt; U : 302 /booking/done?id=…
  end
end
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/controller/CartServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "confirm": {
    String guest = Forms.text(request.getParameter("guestName"));
    String phone = Forms.text(request.getParameter("phone"));
    Map&lt;String, String&gt; errors = new LinkedHashMap&lt;&gt;();
    if (cart.isEmpty()) errors.put("cart", "The booking has no room");
    if (guest.isEmpty() || guest.length() &gt; 100) errors.put("guestName", "Guest name is required (max 100 characters)");
    if (!phone.matches("0\\\\d{9}")) errors.put("phone", "Phone must be 10 digits starting with 0");
    if (!errors.isEmpty()) {
        request.setAttribute("errors", errors);
        request.setAttribute("cart", cart);
        request.getRequestDispatcher("/WEB-INF/views/cart.jsp").forward(request, response);
        return;
    }
    Account acc = (Account) session.getAttribute("account");
    try {
        int id = new BookingDAO().create(cart, guest, phone, acc.getUsername());
        session.removeAttribute("cart");       // đã đặt ⇒ giỏ trống
        response.sendRedirect(request.getContextPath() + "/booking/done?id=" + id);
        return;
    } catch (IllegalStateException conflict) {
        session.setAttribute("flash", conflict.getMessage());
    }
    break;
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-khach-san/src/main/java/dal/BookingDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Câu 4: một lượt đặt = 1 dòng Booking + n dòng BookingRoom — TẤT CẢ hoặc KHÔNG GÌ (một giao dịch)
public int create(Cart cart, String guestName, String phone, String createdBy) throws SQLException {
    try (Connection con = getConnection()) {
        con.setAutoCommit(false);                          // từ đây không gì là vĩnh viễn cho tới commit()
        try {
            for (Room r : cart.getRooms()) {               // kiểm lại TRONG giao dịch: có thể ai đó đã đặt từ lúc tìm
                if (isTaken(con, r.getRoomNo(), cart)) {
                    con.rollback();
                    throw new IllegalStateException("Room " + r.getRoomNo() + " is no longer free for these dates. Nothing was saved.");
                }
            }
            int id;
            String sql = "INSERT INTO Booking (guestName, phone, checkIn, checkOut, total, createdBy) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, guestName);
                ps.setString(2, phone);
                ps.setDate(3, Date.valueOf(cart.getCheckIn()));
                ps.setDate(4, Date.valueOf(cart.getCheckOut()));
                ps.setLong(5, cart.getTotal());
                ps.setString(6, createdBy);
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    keys.next();
                    id = keys.getInt(1);                   // giá trị IDENTITY SQL Server vừa sinh
                }
            }
            try (PreparedStatement ps = con.prepareStatement("INSERT INTO BookingRoom (bookingId, roomNo, pricePerNight) VALUES (?, ?, ?)")) {
                for (Room r : cart.getRooms()) {
                    ps.setInt(1, id);
                    ps.setString(2, r.getRoomNo());
                    ps.setLong(3, r.getPrice());
                    ps.addBatch();
                }
                ps.executeBatch();
            }
            con.commit();
            return id;
        } catch (SQLException e) {
            con.rollback();                                // lỗi SQL bất kỳ ⇒ huỷ lượt đặt mới ghi dở
            throw e;
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

action=confirm&amp;guestName=&amp;phone=12345</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="error"&gt;Guest name is required (max 100 characters)&lt;/p&gt;&lt;p class="error"&gt;Phone must be 10 digits starting with 0&lt;/p&gt;&lt;p&gt;From 2026-10-21 to 2026-10-23 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;102&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="102"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;202&lt;/td&gt;&lt;td&gt;Deluxe&lt;/td&gt;&lt;td&gt;800.000 ₫&lt;/td&gt;&lt;td&gt;1.600.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="202"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;2.600.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value="12345"&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 76

action=confirm&amp;guestName=Tr%E1%BA%A7n+Th%E1%BB%8B+B%C3%ACnh&amp;phone=0987654321</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/done?id=3
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/done?id=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking #3&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking #3 confirmed&lt;/h1&gt;
&lt;p&gt;Guest: Trần Thị Bình (0987654321)&lt;/p&gt;
&lt;p&gt;Rooms 102, 202, from 2026-10-21 to 2026-10-23&lt;/p&gt;
&lt;p&gt;Total: 2.600.000 ₫&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/room/search?typeId=1&amp;maxPrice=&amp;checkIn=2026-10-22&amp;checkOut=2026-10-24 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Rooms&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Lê Thị Hoa (RECEPTIONIST) | &lt;a href="/pe2-khach-san/booking/cart"&gt;Booking (0)&lt;/a&gt; | &lt;a href="/pe2-khach-san/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="search" method="get"&gt;
  Type &lt;select name="typeId"&gt;&lt;option value="0"&gt;All&lt;/option&gt;
    &lt;option value="1" selected&gt;Standard&lt;/option&gt;&lt;option value="2" &gt;Deluxe&lt;/option&gt;&lt;option value="3" &gt;Suite&lt;/option&gt;&lt;/select&gt;
  Max price &lt;input name="maxPrice" value=""&gt;
  Check-in &lt;input type="date" name="checkIn" value="2026-10-22"&gt;
  Check-out &lt;input type="date" name="checkOut" value="2026-10-24"&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;Free rooms from 2026-10-22 to 2026-10-24: 1&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Floor&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Note&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;103&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;near the lift&lt;/td&gt;
    &lt;td&gt;&lt;form action="../booking/cart" method="post"&gt;&lt;input type="hidden" name="action" value="add"&gt;
      &lt;input type="hidden" name="roomNo" value="103"&gt;&lt;input type="hidden" name="checkIn" value="2026-10-22"&gt;
      &lt;input type="hidden" name="checkOut" value="2026-10-24"&gt;&lt;button&gt;Add to booking&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Lượt đặt #3 được lưu với cả hai phòng (<code>STRING_AGG</code> nối danh sách phòng — cần SQL Server 2017 trở lên), và tìm 22 → 24/10 không còn đưa ra 102. Vì sao phải kiểm lại trong giao dịch? Vì lần tìm đã diễn ra từ mấy phút trước, và một lễ tân khác có thể đã đặt phòng đó. Ta giả lập điều đó bằng một POST tự dựng đưa phòng 101 (đã có khách 20 → 23) vào giỏ cho 22 → 24:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 60

action=add&amp;roomNo=101&amp;checkIn=2026-10-22&amp;checkOut=2026-10-24</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 54

action=confirm&amp;guestName=Kh%C3%A1ch+X&amp;phone=0911111111</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-khach-san/booking/cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-khach-san/booking/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Booking&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Booking&lt;/h1&gt;
&lt;p class="flash"&gt;Room 101 is no longer free for these dates. Nothing was saved.&lt;/p&gt;&lt;p&gt;From 2026-10-22 to 2026-10-24 — 2 night(s)&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Room&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Price/night&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;Standard&lt;/td&gt;&lt;td&gt;500.000 ₫&lt;/td&gt;&lt;td&gt;1.000.000 ₫&lt;/td&gt;
    &lt;td&gt;&lt;form action="cart" method="post"&gt;&lt;input type="hidden" name="action" value="remove"&gt;&lt;input type="hidden" name="roomNo" value="101"&gt;&lt;button&gt;Remove&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th colspan="3"&gt;Total&lt;/th&gt;&lt;th&gt;1.000.000 ₫&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;form action="cart" method="post"&gt;
  &lt;input type="hidden" name="action" value="confirm"&gt;
  Guest name &lt;input name="guestName" value=""&gt;
  Phone &lt;input name="phone" value=""&gt;
  &lt;button&gt;Confirm booking&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;&lt;a href="/pe2-khach-san/room/search"&gt;Back to rooms&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Giao dịch phát hiện trùng lịch, rollback (huỷ toàn bộ) và không lưu gì; giỏ vẫn còn để lễ tân bỏ 101 rồi thử lại. <code>con.setAutoCommit(false)</code> mở giao dịch, <code>commit()</code> làm cả hai lệnh INSERT thành vĩnh viễn cùng lúc, và <code>catch</code> gọi <code>rollback()</code> cho mọi lỗi SQL — lỗi 9 cho thấy lượt đặt "lưu một nửa" bạn nhận được nếu thiếu nó.</p>`),
    bi(`<h2>🧮 Self-marking guide (10 points)</h2>
<p>Written for this mock paper (the school does not publish PE marking guides). Run every line in a private window, check SSMS after every write.</p>
<table>
<thead><tr><th>Q</th><th>What the examiner does</th><th>Expected</th><th>Points</th></tr></thead>
<tbody>
<tr><td>1</td><td>wrong password</td><td>same page + message</td><td>0.25</td></tr>
<tr><td>1</td><td><code>letan</code> logs in</td><td>302 → <code>/room/search</code>, "Welcome, Lê Thị Hoa (RECEPTIONIST)"</td><td>0.5</td></tr>
<tr><td>1</td><td>Logout, then <code>/booking/cart</code></td><td>302 → <code>/login</code></td><td>0.25</td></tr>
<tr><td>1</td><td><code>/booking/cart</code> with no session</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1</td><td><code>letan</code> opens <code>/room/add</code></td><td>403 "Access denied"</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/room/search</code></td><td>7 rooms, type names, "1.500.000 ₫"</td><td>0.75</td></tr>
<tr><td>2</td><td>type Standard, max price 600000</td><td>101, 102, 103</td><td>0.5</td></tr>
<tr><td>2</td><td>21 → 23 Oct</td><td>101 and 201 missing; 23 → 25 Oct shows 101 again</td><td>0.75</td></tr>
<tr><td>2</td><td>check-out before check-in</td><td>message, all rooms, dates kept</td><td>0.5</td></tr>
<tr><td>3</td><td>add "1A", type 9, floor 0</td><td>three messages, values kept</td><td>0.5</td></tr>
<tr><td>3</td><td>add 101 / add 401 on floor 3</td><td>"already exists" / "must be on floor 4"</td><td>0.5</td></tr>
<tr><td>3</td><td>add 401 correctly</td><td>302, "Room 401 added" once, row in SSMS</td><td>0.25</td></tr>
<tr><td>3</td><td>edit 401</td><td>number read-only, change saved</td><td>0.5</td></tr>
<tr><td>3</td><td>delete 101 / delete 401</td><td>message, not deleted / deleted</td><td>0.75</td></tr>
<tr><td>4</td><td>add 102 and 202 for 21 → 23, add 102 again</td><td>cart has 2 rooms, "already in the booking"</td><td>0.5</td></tr>
<tr><td>4</td><td>Remove a room; add with other dates</td><td>removed; new cart started</td><td>0.5</td></tr>
<tr><td>4</td><td>cart page</td><td>2 nights, subtotals, total 2.600.000 ₫</td><td>0.75</td></tr>
<tr><td>4</td><td>confirm with empty name / phone "12345"</td><td>two messages, nothing saved</td><td>0.5</td></tr>
<tr><td>4</td><td>confirm correctly</td><td>Booking + 2 BookingRoom rows in SSMS, cart empty, done page</td><td>0.5</td></tr>
<tr><td>4</td><td>a room booked by someone else meanwhile</td><td>message, NOTHING saved (no lonely Booking row)</td><td>0.25</td></tr>
</tbody>
</table>`,
    `<h2>🧮 Barem tự chấm (10 điểm)</h2>
<p>Soạn riêng cho đề mô phỏng này (trường không công bố barem PE). Chạy từng dòng trong cửa sổ ẩn danh, xem SSMS sau mỗi lần ghi dữ liệu.</p>
<table>
<thead><tr><th>Câu</th><th>Người chấm làm gì</th><th>Kết quả đúng</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>sai mật khẩu</td><td>cùng trang + thông báo</td><td>0.25</td></tr>
<tr><td>1</td><td><code>letan</code> đăng nhập</td><td>302 → <code>/room/search</code>, "Welcome, Lê Thị Hoa (RECEPTIONIST)"</td><td>0.5</td></tr>
<tr><td>1</td><td>Logout, rồi <code>/booking/cart</code></td><td>302 → <code>/login</code></td><td>0.25</td></tr>
<tr><td>1</td><td><code>/booking/cart</code> khi không có session</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1</td><td><code>letan</code> mở <code>/room/add</code></td><td>403 "Access denied"</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/room/search</code></td><td>7 phòng, tên loại, "1.500.000 ₫"</td><td>0.75</td></tr>
<tr><td>2</td><td>loại Standard, giá tối đa 600000</td><td>101, 102, 103</td><td>0.5</td></tr>
<tr><td>2</td><td>21 → 23/10</td><td>thiếu 101 và 201; 23 → 25/10 lại có 101</td><td>0.75</td></tr>
<tr><td>2</td><td>ngày trả trước ngày nhận</td><td>thông báo, mọi phòng, giữ ngày đã nhập</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm "1A", loại 9, tầng 0</td><td>ba thông báo, giữ chữ đã gõ</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm 101 / thêm 401 ở tầng 3</td><td>"already exists" / "must be on floor 4"</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm 401 đúng</td><td>302, "Room 401 added" hiện một lần, có dòng trong SSMS</td><td>0.25</td></tr>
<tr><td>3</td><td>sửa 401</td><td>số phòng chỉ đọc, thay đổi được lưu</td><td>0.5</td></tr>
<tr><td>3</td><td>xoá 101 / xoá 401</td><td>thông báo, không xoá / đã xoá</td><td>0.75</td></tr>
<tr><td>4</td><td>thêm 102 và 202 cho 21 → 23, thêm 102 lần nữa</td><td>giỏ có 2 phòng, "already in the booking"</td><td>0.5</td></tr>
<tr><td>4</td><td>bỏ một phòng; thêm với ngày khác</td><td>đã bỏ; bắt đầu giỏ mới</td><td>0.5</td></tr>
<tr><td>4</td><td>trang giỏ</td><td>2 đêm, thành tiền từng phòng, tổng 2.600.000 ₫</td><td>0.75</td></tr>
<tr><td>4</td><td>xác nhận với tên trống / điện thoại "12345"</td><td>hai thông báo, không lưu gì</td><td>0.5</td></tr>
<tr><td>4</td><td>xác nhận đúng</td><td>Booking + 2 dòng BookingRoom trong SSMS, giỏ trống, trang done</td><td>0.5</td></tr>
<tr><td>4</td><td>một phòng vừa bị người khác đặt</td><td>thông báo, KHÔNG lưu gì (không có dòng Booking mồ côi)</td><td>0.25</td></tr>
</tbody>
</table>`),
    bi(`<h2>🪤 Ten mistakes that cost marks — each one run for real</h2>
<p>All ten were run in the lab app <code>pe2-loi</code> (its own small copy of the hotel tables). Paper 1/3 has ten other ones — login, forward paths, Filters, LIKE.</p>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>What you see</th><th>Fix</th><th>Marks at risk</th></tr></thead>
<tbody>
<tr><td>1</td><td>INSERT then forward (no PRG)</td><td>F5 inserts the same booking again</td><td><code>sendRedirect</code> after a successful POST</td><td>Q3/Q4</td></tr>
<tr><td>2</td><td>rules only in HTML (<code>required</code>, <code>min</code>, <code>max</code>)</td><td>a raw POST gets past them: 500 CHECK constraint</td><td>validate in Java on the server</td><td>Q3</td></tr>
<tr><td>3</td><td><code>Date.valueOf("21/10/2026")</code></td><td>500 IllegalArgumentException</td><td>parse with <code>LocalDate.parse</code> in a try, show a message</td><td>Q2/Q4</td></tr>
<tr><td>4</td><td>DELETE a row other rows point to</td><td>500 "conflicted with the REFERENCE constraint"</td><td>check first, show "has bookings"</td><td>Q3</td></tr>
<tr><td>5</td><td>cart in a servlet field</td><td>one cart shared by every user</td><td>cart in the session</td><td>all of Q4</td></tr>
<tr><td>6</td><td><code>&#36;{cart.empty}</code> in a JSP</td><td>500, the JSP does not compile</td><td><code>&#36;{empty cart.rooms}</code> or <code>&#36;{cart.rooms.isEmpty()}</code></td><td>the cart page</td></tr>
<tr><td>7</td><td>saved as <code>"cart"</code>, read as <code>"Cart"</code></td><td>the cart is always empty, no error</td><td>one constant / one method for the name</td><td>Q4</td></tr>
<tr><td>8</td><td><code>executeQuery()</code> for an INSERT</td><td>500 "did not return a result set" — but the row IS inserted</td><td><code>executeUpdate()</code></td><td>Q3/Q4</td></tr>
<tr><td>9</td><td>two INSERTs without a transaction</td><td>second one fails, first one stays (a booking with no room)</td><td><code>setAutoCommit(false)</code>, <code>commit</code>, <code>rollback</code></td><td>Q4</td></tr>
<tr><td>10</td><td>overlap written as "inside the range"</td><td>a booked room shown as free (double booking)</td><td><code>b.checkIn &lt; out AND b.checkOut &gt; in</code></td><td>Q2/Q4</td></tr>
</tbody>
</table>
<h3>1 — no Post/Redirect/Get: F5 saves twice</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/them-forward":                      // insert, then FORWARD: the browser's last request is still this POST
    insertBooking(con, request.getParameter("guestName"), "2026-11-01", "2026-11-02");
    request.setAttribute("count", countBookings(con));
    request.getRequestDispatcher("/WEB-INF/views/dem.jsp").forward(request, response);
    return;
case "/dung/them-prg":                         // insert, then REDIRECT: F5 repeats a harmless GET
    insertBooking(con, request.getParameter("guestName"), "2026-11-01", "2026-11-02");
    response.sendRedirect(request.getContextPath() + "/dem");
    return;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

guestName=An</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 27


Saved! Booking rows now: 2</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 12

guestName=An</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 27


Saved! Booking rows now: 3</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/dung/them-prg HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 14

guestName=Binh</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-loi/dem
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 4 · BookingRoom rows: 1</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 4 · BookingRoom rows: 1</code></pre>
<p>After a forward the browser's address bar and history still hold the POST, so F5 (the browser asks "Confirm Form Resubmission") sends it again: 2 → 3 rows. After a redirect the last request is <code>GET /dem</code>; repeating it twice changes nothing (4 stays 4).</p>
<h3>2 — rules only in the HTML</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/them-phong": {                      // the form had min="1" max="20" — a raw POST ignores it
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Room (roomNo, price, floorNo) VALUES (?, ?, ?)")) {
        ps.setString(1, request.getParameter("roomNo"));
        ps.setLong(2, 500000);
        ps.setInt(3, Integer.parseInt(request.getParameter("floorNo")));
        ps.executeUpdate();
    }
    break;
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-phong HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 21

roomNo=901&amp;floorNo=99</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3062

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the CHECK constraint "CK__Room__floorNo__37A5467C". The conflict occurred in database "PRJ301_Pe2Loi", tab … (+32 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the CHECK constraint "CK__Room__floorNo__37A5467C". The conflict occurred in dat … (+58 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (20 more lines / còn 20 dòng)</code></pre>
<p><code>min="1" max="20"</code> on an input only stops a polite browser. A raw POST, the browser's dev tools or an examiner's tool sends 99. Here the database's own CHECK saved the data — with a 500 page. The paper asks for messages, so validate in Java (RoomForm in the solution).</p>
<h3>3 — <code>Date.valueOf</code> wants yyyy-mm-dd</h3>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/ngay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 46

checkIn=21%2F10%2F2026&amp;checkOut=22%2F10%2F2026</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1181

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalArgumentException
java.sql/java.sql.Date.valueOf(Date.java:141)
loi.GhiServlet.insertBooking(GhiServlet.java:120)
loi.GhiServlet.doPost(GhiServlet.java:64)
… (5 more lines / còn 5 dòng)</code></pre>
<p><code>&lt;input type="date"&gt;</code> sends <code>2026-10-21</code> whatever the display language, but a text box, a test tool or a hand-typed URL can send <code>21/10/2026</code>. <code>java.sql.Date.valueOf</code> then throws <code>IllegalArgumentException</code> (with no message at all — hard to read in a hurry). The solution's <code>Forms.toDate</code> returns <code>null</code> and the servlet shows "Enter both dates as yyyy-mm-dd".</p>
<h3>4 — deleting a row that is still referenced</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/xoa-phong":                         // no "has bookings?" check before DELETE
    try (PreparedStatement ps = con.prepareStatement("DELETE FROM Room WHERE roomNo = ?")) {
        ps.setString(1, request.getParameter("roomNo"));
        ps.executeUpdate();
    }
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/xoa-phong HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=101</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3101

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The DELETE statement conflicted with the REFERENCE constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2Lo … (+45 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The DELETE statement conflicted with the REFERENCE constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred … (+71 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (20 more lines / còn 20 dòng)</code></pre>
<h3>5 — the cart in a servlet field</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GioServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private final Cart sharedCart = new Cart();                // ONE servlet object serves EVERY user ⇒ one cart for everybody</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-chung?add=102 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/loi/gio-chung → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-chung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/loi/gio-chung → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session?add=102 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(4); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

/dung/gio-session → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(5); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/dung/gio-session → rooms in this visitor's cart: []</code></pre>
<p>Tomcat creates ONE object of each servlet and runs every request through it, on many threads. A field of the servlet is therefore shared by all users: receptionist B (a different browser, a different session cookie) sees receptionist A's room 102. In the session, B's cart is empty, as it should be.</p>
<h3>6 — <code>empty</code> is an EL operator</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/webapp/WEB-INF/views/el-empty-sai.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- "empty" is an EL OPERATOR, so cart.empty is not a property call --%&gt;
&lt;c:if test="&#36;{cart.empty}"&gt;&lt;p&gt;No room yet&lt;/p&gt;&lt;/c:if&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/el-empty HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 4167

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message org.apache.jasper.JasperException: /WEB-INF/views/el-empty-sai.jsp (line: [4], column: [0]) [&#36;{cart.empty}] contains invalid expression(s): [jakarta.el.ELException: Failed to parse the express … (+20 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
org.apache.jasper.JasperException: org.apache.jasper.JasperException: /WEB-INF/views/el-empty-sai.jsp (line: [4], column: [0]) [&#36;{cart.empty}] contains invalid expression(s): [jakarta.el.ELException:  … (+47 chars / ký tự)
org.apache.jasper.servlet.JspServletWrapper.handleJspException(JspServletWrapper.java:631)
… (40 more lines / còn 40 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/el-empty HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 16

&lt;p&gt;1 room(s)&lt;/p&gt;</code></pre>
<p>EL reserves <code>empty</code>, <code>not</code>, <code>and</code>, <code>or</code>, <code>div</code>, <code>mod</code>, <code>eq</code>, <code>ne</code>, <code>lt</code>, <code>gt</code>, <code>le</code>, <code>ge</code>, <code>true</code>, <code>false</code>, <code>null</code>, <code>instanceof</code>. A getter named <code>isEmpty()</code> cannot be read as <code>cart.empty</code>; the JSP fails to compile ("Failed to parse the expression"). Write <code>empty cart.rooms</code> (the operator) or call the method: <code>cart.rooms.isEmpty()</code>.</p>
<h3>7 — two names for one attribute</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GioServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/gio-ten":
    cart = (Cart) session.getAttribute("Cart");     // saved as "cart", read as "Cart": names are case-sensitive ⇒ null
    if (cart == null) cart = new Cart();
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session?add=201 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

/dung/gio-session → rooms in this visitor's cart: [201]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-ten HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 50

/loi/gio-ten → rooms in this visitor's cart: []</code></pre>
<p>No error, no 500 — the page just shows an empty cart. Attribute names are case-sensitive keys of a map. Keep the name in one place (the solution's <code>cartOf(session)</code>).</p>
<h3>8 — <code>executeQuery()</code> for an INSERT</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/execute-query":                     // executeQuery() is for SELECT only
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Booking (guestName, checkIn, checkOut) VALUES (?, '2026-12-01', '2026-12-02')")) {
        ps.setString(1, request.getParameter("guestName"));
        ps.executeQuery();
    }
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/execute-query HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 13

guestName=Chi</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2453

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The statement did not return a result set.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The statement did not return a result set.
loi.GhiServlet.doPost(GhiServlet.java:104)
… (19 more lines / còn 19 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 5 · BookingRoom rows: 1</code></pre>
<p>The driver runs the INSERT and only THEN complains that no result set came back: the page says error, but the row is in the table (Booking went from 4 to 5). Students then "fix" it by retrying and insert twice. <code>executeUpdate()</code> for INSERT/UPDATE/DELETE, <code>executeQuery()</code> for SELECT.</p>
<h3>9 — two INSERTs without a transaction</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// a booking = 1 Booking row + 1 BookingRoom row; the second INSERT fails when the room does not exist
private static void saveBooking(Connection con, String roomNo) throws SQLException {
    int id;
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Booking (guestName, checkIn, checkOut) VALUES (N'Khách', '2026-12-10', '2026-12-11')",
            Statement.RETURN_GENERATED_KEYS)) {
        ps.executeUpdate();
        try (ResultSet keys = ps.getGeneratedKeys()) {
            keys.next();
            id = keys.getInt(1);
        }
    }
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO BookingRoom (bookingId, roomNo) VALUES (?, ?)")) {
        ps.setInt(1, id);
        ps.setString(2, roomNo);
        ps.executeUpdate();                                // room "999" ⇒ FOREIGN KEY error HERE
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/khong-giao-dich":                   // auto-commit ON: each statement is saved at once
    saveBooking(con, request.getParameter("roomNo"));
    break;
case "/dung/giao-dich":
    con.setAutoCommit(false);
    try {
        saveBooking(con, request.getParameter("roomNo"));
        con.commit();
    } catch (SQLException e) {
        con.rollback();                        // the Booking row written a moment ago disappears too
        System.out.println("rolled back: " + e.getMessage());
        response.sendRedirect(request.getContextPath() + "/dem");
        return;
    }
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/khong-giao-dich HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=999</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3135

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2 … (+40 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurr … (+66 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (21 more lines / còn 21 dòng)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 6 · BookingRoom rows: 1</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/dung/giao-dich HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=999</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-loi/dem
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">rolled back: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2Loi", table "dbo.Room", column 'roomNo'.</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 6 · BookingRoom rows: 1</code></pre>
<p>With auto-commit on (the JDBC default) the Booking INSERT is saved at once; the BookingRoom INSERT then fails on the foreign key and leaves a booking with no room (5 → 6 bookings, still 1 BookingRoom row). With the transaction the same failure is rolled back: 6 stays 6.</p>
<h3>10 — the overlap condition</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/TrongServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String wrong = "b.checkIn &gt;= ? AND b.checkOut &lt;= ?";   // only bookings lying COMPLETELY inside [in, out]
String right = "b.checkIn &lt; ? AND b.checkOut &gt; ?";     // any overlap: existing starts before new ends AND ends after new starts</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/trong?checkIn=2026-10-22&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 95

free 2026-10-22 → 2026-10-25 (room 101 is booked 2026-10-20 → 2026-10-23): [101, 102, 201]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/trong?checkIn=2026-10-22&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 90

free 2026-10-22 → 2026-10-25 (room 101 is booked 2026-10-20 → 2026-10-23): [102, 201]</code></pre>
<p>Room 101 is booked 20 → 23. The new stay 22 → 25 overlaps it on the 22nd, but the booking is not <em>inside</em> 22 → 25, so the wrong rule calls 101 free — and the hotel sells it twice. Draw the four cases on paper (starts before, ends after, inside, covers) — the rule <code>start &lt; otherEnd AND end &gt; otherStart</code> catches all four.</p>`,
    `<h2>🪤 Mười lỗi làm mất điểm — lỗi nào cũng chạy thật</h2>
<p>Cả mười lỗi đều chạy trong app thí nghiệm <code>pe2-loi</code> (bản thu nhỏ riêng của các bảng khách sạn). Đề 1/3 có mười lỗi khác — đăng nhập, đường dẫn forward, Filter, LIKE.</p>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Bạn thấy gì</th><th>Cách sửa</th><th>Điểm có thể mất</th></tr></thead>
<tbody>
<tr><td>1</td><td>INSERT rồi forward (không PRG)</td><td>F5 thêm lại đúng lượt đặt đó</td><td><code>sendRedirect</code> sau một POST thành công</td><td>Câu 3/4</td></tr>
<tr><td>2</td><td>luật chỉ nằm trong HTML (<code>required</code>, <code>min</code>, <code>max</code>)</td><td>một POST thô vượt qua: 500 vi phạm CHECK</td><td>kiểm bằng Java ở server</td><td>Câu 3</td></tr>
<tr><td>3</td><td><code>Date.valueOf("21/10/2026")</code></td><td>500 IllegalArgumentException</td><td>đọc bằng <code>LocalDate.parse</code> trong try, báo lỗi</td><td>Câu 2/4</td></tr>
<tr><td>4</td><td>DELETE một dòng đang được dòng khác trỏ tới</td><td>500 "conflicted with the REFERENCE constraint"</td><td>kiểm trước, báo "has bookings"</td><td>Câu 3</td></tr>
<tr><td>5</td><td>giỏ là trường (field) của servlet</td><td>mọi người dùng chung một giỏ</td><td>giỏ trong session</td><td>cả Câu 4</td></tr>
<tr><td>6</td><td><code>&#36;{cart.empty}</code> trong JSP</td><td>500, JSP không biên dịch được</td><td><code>&#36;{empty cart.rooms}</code> hoặc <code>&#36;{cart.rooms.isEmpty()}</code></td><td>trang giỏ</td></tr>
<tr><td>7</td><td>lưu tên <code>"cart"</code>, đọc tên <code>"Cart"</code></td><td>giỏ luôn trống, không báo lỗi</td><td>một hằng / một phương thức cho tên</td><td>Câu 4</td></tr>
<tr><td>8</td><td><code>executeQuery()</code> cho INSERT</td><td>500 "did not return a result set" — nhưng dòng ĐÃ được thêm</td><td><code>executeUpdate()</code></td><td>Câu 3/4</td></tr>
<tr><td>9</td><td>hai INSERT không có giao dịch</td><td>lệnh hai hỏng, lệnh một vẫn còn (lượt đặt không có phòng)</td><td><code>setAutoCommit(false)</code>, <code>commit</code>, <code>rollback</code></td><td>Câu 4</td></tr>
<tr><td>10</td><td>điều kiện chồng ngày viết thành "nằm trong khoảng"</td><td>phòng đã đặt hiện là trống (đặt trùng)</td><td><code>b.checkIn &lt; out AND b.checkOut &gt; in</code></td><td>Câu 2/4</td></tr>
</tbody>
</table>
<h3>1 — không Post/Redirect/Get: F5 lưu hai lần</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/them-forward":                      // thêm rồi FORWARD: request cuối của trình duyệt vẫn là POST này
    insertBooking(con, request.getParameter("guestName"), "2026-11-01", "2026-11-02");
    request.setAttribute("count", countBookings(con));
    request.getRequestDispatcher("/WEB-INF/views/dem.jsp").forward(request, response);
    return;
case "/dung/them-prg":                         // thêm rồi REDIRECT: F5 chỉ lặp một GET vô hại
    insertBooking(con, request.getParameter("guestName"), "2026-11-01", "2026-11-02");
    response.sendRedirect(request.getContextPath() + "/dem");
    return;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

guestName=An</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 27


Saved! Booking rows now: 2</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 12

guestName=An</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 27


Saved! Booking rows now: 3</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/dung/them-prg HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 14

guestName=Binh</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-loi/dem
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 4 · BookingRoom rows: 1</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 4 · BookingRoom rows: 1</code></pre>
<p>Sau một forward, thanh địa chỉ và lịch sử trình duyệt vẫn giữ cái POST, nên F5 (trình duyệt hỏi "Confirm Form Resubmission") gửi lại nó: 2 → 3 dòng. Sau một redirect, request cuối là <code>GET /dem</code>; lặp lại hai lần cũng không đổi gì (4 vẫn là 4).</p>
<h3>2 — luật chỉ nằm trong HTML</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/them-phong": {                      // form có min="1" max="20" — một POST thô bỏ qua nó
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Room (roomNo, price, floorNo) VALUES (?, ?, ?)")) {
        ps.setString(1, request.getParameter("roomNo"));
        ps.setLong(2, 500000);
        ps.setInt(3, Integer.parseInt(request.getParameter("floorNo")));
        ps.executeUpdate();
    }
    break;
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/them-phong HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 21

roomNo=901&amp;floorNo=99</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3062

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the CHECK constraint "CK__Room__floorNo__37A5467C". The conflict occurred in database "PRJ301_Pe2Loi", tab … (+32 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the CHECK constraint "CK__Room__floorNo__37A5467C". The conflict occurred in dat … (+58 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (20 more lines / còn 20 dòng)</code></pre>
<p><code>min="1" max="20"</code> trên ô nhập chỉ chặn được trình duyệt "lịch sự". Một POST thô, công cụ dev của trình duyệt hay công cụ của người chấm gửi 99 là xong. Ở đây ràng buộc CHECK của chính CSDL đã cứu dữ liệu — bằng một trang 500. Đề đòi thông báo, nên phải kiểm bằng Java (RoomForm trong lời giải).</p>
<h3>3 — <code>Date.valueOf</code> đòi yyyy-mm-dd</h3>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/ngay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 46

checkIn=21%2F10%2F2026&amp;checkOut=22%2F10%2F2026</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1181

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalArgumentException
java.sql/java.sql.Date.valueOf(Date.java:141)
loi.GhiServlet.insertBooking(GhiServlet.java:120)
loi.GhiServlet.doPost(GhiServlet.java:64)
… (5 more lines / còn 5 dòng)</code></pre>
<p><code>&lt;input type="date"&gt;</code> luôn gửi <code>2026-10-21</code> bất kể ngôn ngữ hiển thị, nhưng một ô chữ thường, một công cụ thử hay một URL gõ tay có thể gửi <code>21/10/2026</code>. Khi đó <code>java.sql.Date.valueOf</code> ném <code>IllegalArgumentException</code> (không kèm thông báo nào — đọc vội rất khó hiểu). Hàm <code>Forms.toDate</code> của lời giải trả <code>null</code> và servlet báo "Enter both dates as yyyy-mm-dd".</p>
<h3>4 — xoá một dòng vẫn đang được tham chiếu</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/xoa-phong":                         // không kiểm "đã có đặt chỗ?" trước DELETE
    try (PreparedStatement ps = con.prepareStatement("DELETE FROM Room WHERE roomNo = ?")) {
        ps.setString(1, request.getParameter("roomNo"));
        ps.executeUpdate();
    }
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/xoa-phong HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=101</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3101

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The DELETE statement conflicted with the REFERENCE constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2Lo … (+45 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The DELETE statement conflicted with the REFERENCE constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred … (+71 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (20 more lines / còn 20 dòng)</code></pre>
<h3>5 — giỏ là một trường của servlet</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GioServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private final Cart sharedCart = new Cart();                // MỘT đối tượng servlet phục vụ MỌI người dùng ⇒ một giỏ cho tất cả</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-chung?add=102 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/loi/gio-chung → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-chung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/loi/gio-chung → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session?add=102 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(4); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

/dung/gio-session → rooms in this visitor's cart: [102]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(5); Path=/pe2-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

/dung/gio-session → rooms in this visitor's cart: []</code></pre>
<p>Tomcat tạo MỘT đối tượng cho mỗi servlet và cho mọi request chạy qua nó, trên nhiều luồng (thread). Vậy một trường (field) của servlet là của chung mọi người dùng: lễ tân B (trình duyệt khác, cookie session khác) thấy luôn phòng 102 của lễ tân A. Đặt trong session thì giỏ của B trống, đúng như phải thế.</p>
<h3>6 — <code>empty</code> là toán tử của EL</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/webapp/WEB-INF/views/el-empty-sai.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- "empty" là TOÁN TỬ của EL, nên cart.empty không phải là gọi thuộc tính --%&gt;
&lt;c:if test="&#36;{cart.empty}"&gt;&lt;p&gt;No room yet&lt;/p&gt;&lt;/c:if&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/el-empty HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 4167

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message org.apache.jasper.JasperException: /WEB-INF/views/el-empty-sai.jsp (line: [4], column: [0]) [&#36;{cart.empty}] contains invalid expression(s): [jakarta.el.ELException: Failed to parse the express … (+20 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
org.apache.jasper.JasperException: org.apache.jasper.JasperException: /WEB-INF/views/el-empty-sai.jsp (line: [4], column: [0]) [&#36;{cart.empty}] contains invalid expression(s): [jakarta.el.ELException:  … (+47 chars / ký tự)
org.apache.jasper.servlet.JspServletWrapper.handleJspException(JspServletWrapper.java:631)
… (40 more lines / còn 40 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/el-empty HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 16

&lt;p&gt;1 room(s)&lt;/p&gt;</code></pre>
<p>EL giữ riêng các từ <code>empty</code>, <code>not</code>, <code>and</code>, <code>or</code>, <code>div</code>, <code>mod</code>, <code>eq</code>, <code>ne</code>, <code>lt</code>, <code>gt</code>, <code>le</code>, <code>ge</code>, <code>true</code>, <code>false</code>, <code>null</code>, <code>instanceof</code>. Một getter tên <code>isEmpty()</code> không đọc được bằng <code>cart.empty</code>; JSP không biên dịch nổi ("Failed to parse the expression"). Viết <code>empty cart.rooms</code> (toán tử) hoặc gọi phương thức: <code>cart.rooms.isEmpty()</code>.</p>
<h3>7 — hai cái tên cho một attribute</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GioServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/gio-ten":
    cart = (Cart) session.getAttribute("Cart");     // lưu tên "cart", đọc tên "Cart": tên phân biệt hoa thường ⇒ null
    if (cart == null) cart = new Cart();
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/gio-session?add=201 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

/dung/gio-session → rooms in this visitor's cart: [201]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/gio-ten HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 50

/loi/gio-ten → rooms in this visitor's cart: []</code></pre>
<p>Không lỗi, không 500 — trang chỉ hiện giỏ trống. Tên attribute là khoá của một map, phân biệt hoa thường. Giữ tên ở một chỗ duy nhất (<code>cartOf(session)</code> trong lời giải).</p>
<h3>8 — <code>executeQuery()</code> cho INSERT</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/execute-query":                     // executeQuery() chỉ dành cho SELECT
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Booking (guestName, checkIn, checkOut) VALUES (?, '2026-12-01', '2026-12-02')")) {
        ps.setString(1, request.getParameter("guestName"));
        ps.executeQuery();
    }
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/execute-query HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 13

guestName=Chi</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 2453

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The statement did not return a result set.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The statement did not return a result set.
loi.GhiServlet.doPost(GhiServlet.java:104)
… (19 more lines / còn 19 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 5 · BookingRoom rows: 1</code></pre>
<p>Driver chạy INSERT rồi SAU ĐÓ mới phàn nàn là không có kết quả trả về: trang báo lỗi, nhưng dòng đã nằm trong bảng (Booking từ 4 lên 5). Sinh viên "sửa" bằng cách bấm lại và thêm thành hai lần. <code>executeUpdate()</code> cho INSERT/UPDATE/DELETE, <code>executeQuery()</code> cho SELECT.</p>
<h3>9 — hai INSERT không có giao dịch</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// một lượt đặt = 1 dòng Booking + 1 dòng BookingRoom; INSERT thứ hai hỏng khi phòng không tồn tại
private static void saveBooking(Connection con, String roomNo) throws SQLException {
    int id;
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO Booking (guestName, checkIn, checkOut) VALUES (N'Khách', '2026-12-10', '2026-12-11')",
            Statement.RETURN_GENERATED_KEYS)) {
        ps.executeUpdate();
        try (ResultSet keys = ps.getGeneratedKeys()) {
            keys.next();
            id = keys.getInt(1);
        }
    }
    try (PreparedStatement ps = con.prepareStatement("INSERT INTO BookingRoom (bookingId, roomNo) VALUES (?, ?)")) {
        ps.setInt(1, id);
        ps.setString(2, roomNo);
        ps.executeUpdate();                                // phòng "999" ⇒ lỗi FOREIGN KEY Ở ĐÂY
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/GhiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/khong-giao-dich":                   // auto-commit BẬT: mỗi câu được lưu ngay
    saveBooking(con, request.getParameter("roomNo"));
    break;
case "/dung/giao-dich":
    con.setAutoCommit(false);
    try {
        saveBooking(con, request.getParameter("roomNo"));
        con.commit();
    } catch (SQLException e) {
        con.rollback();                        // dòng Booking vừa ghi cũng biến mất
        System.out.println("rolled back: " + e.getMessage());
        response.sendRedirect(request.getContextPath() + "/dem");
        return;
    }
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/loi/khong-giao-dich HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=999</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3135

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2 … (+40 chars / ký tự)
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurr … (+66 chars / ký tự)
loi.GhiServlet.doPost(GhiServlet.java:104)
… (21 more lines / còn 21 dòng)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 6 · BookingRoom rows: 1</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe2-loi/dung/giao-dich HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 10

roomNo=999</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe2-loi/dem
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">rolled back: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__BookingRo__roomN__3D5E1FD2". The conflict occurred in database "PRJ301_Pe2Loi", table "dbo.Room", column 'roomNo'.</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

Booking rows: 6 · BookingRoom rows: 1</code></pre>
<p>Khi auto-commit bật (mặc định của JDBC), lệnh INSERT Booking được lưu ngay; lệnh INSERT BookingRoom sau đó hỏng vì khoá ngoại và để lại một lượt đặt không có phòng (5 → 6 lượt đặt, vẫn 1 dòng BookingRoom). Có giao dịch thì cùng lỗi đó được rollback: 6 vẫn là 6.</p>
<h3>10 — điều kiện chồng ngày</h3>
<p class="ghi-chu">📄 <code>pe2-loi/src/main/java/loi/TrongServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String wrong = "b.checkIn &gt;= ? AND b.checkOut &lt;= ?";   // chỉ bắt lượt đặt nằm TRỌN trong [in, out]
String right = "b.checkIn &lt; ? AND b.checkOut &gt; ?";     // mọi kiểu chồng: lượt cũ bắt đầu trước khi lượt mới kết thúc VÀ kết thúc sau khi lượt mới bắt đầu</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/loi/trong?checkIn=2026-10-22&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 95

free 2026-10-22 → 2026-10-25 (room 101 is booked 2026-10-20 → 2026-10-23): [101, 102, 201]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe2-loi/dung/trong?checkIn=2026-10-22&amp;checkOut=2026-10-25 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 90

free 2026-10-22 → 2026-10-25 (room 101 is booked 2026-10-20 → 2026-10-23): [102, 201]</code></pre>
<p>Phòng 101 có khách 20 → 23. Lượt mới 22 → 25 chồng lên nó ở ngày 22, nhưng lượt cũ không nằm <em>trong</em> 22 → 25, nên luật sai coi 101 là trống — và khách sạn bán nó hai lần. Vẽ bốn trường hợp ra giấy (bắt đầu trước, kết thúc sau, nằm trong, phủ trùm) — luật <code>đầu &lt; cuốiKia AND cuối &gt; đầuKia</code> bắt được cả bốn.</p>`),
    bi(`<h2>⏱ The 85-minute plan</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Done when</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>read everything; script; rename; <code>DBContext</code>; Run</td><td>the template starts</td></tr>
<tr><td>7–20</td><td>Q1 (copy the shape you know from paper 1/3)</td><td>wrong/right login, 403 for <code>letan</code> on <code>/room/add</code></td></tr>
<tr><td>20–38</td><td>Q2: <code>RoomDAO.search</code> (type, price first; dates last), <code>rooms.jsp</code> with <code>fmt</code></td><td>21 → 23 hides 101 and 201</td></tr>
<tr><td>38–55</td><td>Q3: <code>RoomForm</code>, add, edit, delete with the bookings check, flash</td><td>"1A" shows three messages; 101 not deleted</td></tr>
<tr><td>55–77</td><td>Q4: <code>Cart</code>, <code>CartServlet</code> add/remove, cart page, then <code>BookingDAO.create</code> with the transaction</td><td>booking #3 in SSMS with two BookingRoom rows</td></tr>
<tr><td>77–85</td><td>private window, marking guide, SSMS, Clean and Build, submit</td><td>no 404/500 anywhere</td></tr>
</tbody>
</table>
<p><strong>Order inside Q4.</strong> The cart page and the totals (1.75 points) need no SQL; do them first. The transaction is worth 0.75 — write it last, and if time runs out, a plain insert of Booking + BookingRoom still earns the "saved" part. Inside Q2, make the type and price filters work before the dates: a search without the overlap is still 1.25 points.</p>
<h3>🛠 NetBeans tips for this paper</h3>
<ul>
<li>Set a breakpoint in <code>BookingDAO.create</code> (click the line number) and run with Debug: you can watch <code>id</code> come back from <code>getGeneratedKeys()</code> before the commit.</li>
<li>Services → Databases can connect to SQL Server too, but SSMS is faster for checking rows; keep it open next to NetBeans.</li>
<li>When a JSP fails to compile, the Output window names the file, the line and the column — exactly as in mistake 6.</li>
<li>Write the date SQL in SSMS first with fixed dates (<code>'2026-10-21'</code>), see the right rooms, then paste it into Java and replace the dates by <code>?</code>.</li>
</ul>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): <code>BookingDAO.create</code> becomes a service method marked <code>@Transactional</code> — Spring calls <code>setAutoCommit(false)</code>, <code>commit</code> and <code>rollback</code> for you around it; the cart becomes a <code>@SessionScope</code> bean or, in a React + REST app, client state plus one POST; the overlap rule is the same SQL (or a Spring Data query method) — booking lab equipment in LabFlow is this exact problem.</div>`,
    `<h2>⏱ Kế hoạch 85 phút</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Xong khi</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>đọc hết đề; chạy script; đổi tên; <code>DBContext</code>; Run</td><td>project mẫu khởi động</td></tr>
<tr><td>7–20</td><td>Câu 1 (chép khuôn đã quen từ đề 1/3)</td><td>đăng nhập sai/đúng, <code>letan</code> bị 403 ở <code>/room/add</code></td></tr>
<tr><td>20–38</td><td>Câu 2: <code>RoomDAO.search</code> (loại, giá trước; ngày sau cùng), <code>rooms.jsp</code> có <code>fmt</code></td><td>21 → 23 ẩn 101 và 201</td></tr>
<tr><td>38–55</td><td>Câu 3: <code>RoomForm</code>, thêm, sửa, xoá có kiểm lượt đặt, thông báo flash</td><td>"1A" ra ba thông báo; 101 không bị xoá</td></tr>
<tr><td>55–77</td><td>Câu 4: <code>Cart</code>, <code>CartServlet</code> thêm/bỏ, trang giỏ, rồi <code>BookingDAO.create</code> với giao dịch</td><td>lượt đặt #3 trong SSMS kèm hai dòng BookingRoom</td></tr>
<tr><td>77–85</td><td>cửa sổ ẩn danh, barem, SSMS, Clean and Build, nộp</td><td>không còn 404/500 ở đâu</td></tr>
</tbody>
</table>
<p><strong>Thứ tự bên trong Câu 4.</strong> Trang giỏ và phần tính tiền (1.75 điểm) không cần SQL; làm trước. Giao dịch đáng 0.75 — viết sau cùng, và nếu hết giờ thì một lệnh thêm Booking + BookingRoom bình thường vẫn ăn phần "đã lưu". Bên trong Câu 2, làm cho lọc loại và giá chạy trước phần ngày: tìm kiếm chưa có điều kiện chồng ngày vẫn được 1.25 điểm.</p>
<h3>🛠 Mẹo NetBeans cho đề này</h3>
<ul>
<li>Đặt breakpoint (điểm dừng) trong <code>BookingDAO.create</code> (bấm vào số dòng) rồi chạy bằng Debug: bạn thấy được <code>id</code> trả về từ <code>getGeneratedKeys()</code> trước khi commit.</li>
<li>Services → Databases cũng kết nối được SQL Server, nhưng SSMS xem dòng dữ liệu nhanh hơn; mở nó cạnh NetBeans.</li>
<li>JSP không biên dịch được thì cửa sổ Output nêu tên file, dòng và cột — đúng như lỗi 6.</li>
<li>Viết câu SQL có ngày trong SSMS trước với ngày cố định (<code>'2026-10-21'</code>), thấy đúng phòng rồi mới dán vào Java và thay ngày bằng <code>?</code>.</li>
</ul>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): <code>BookingDAO.create</code> trở thành một phương thức service gắn <code>@Transactional</code> — Spring tự gọi <code>setAutoCommit(false)</code>, <code>commit</code> và <code>rollback</code> quanh nó; giỏ trở thành một bean <code>@SessionScope</code> hoặc, trong app React + REST, là trạng thái phía client cộng một lệnh POST; luật chồng ngày vẫn là câu SQL đó (hoặc một phương thức truy vấn của Spring Data) — đặt lịch thiết bị phòng lab trong LabFlow chính là bài toán này.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of SQL statements that is saved all together (commit) or undone all together (rollback).</td></tr>
<tr><td><strong>auto-commit</strong></td><td>tự động commit</td><td>The JDBC default in which every statement is saved the moment it runs.</td></tr>
<tr><td><strong>commit / rollback</strong></td><td>xác nhận / huỷ bỏ</td><td>Make the changes of a transaction permanent, or throw them all away.</td></tr>
<tr><td><strong>date-range overlap</strong></td><td>chồng khoảng ngày</td><td>Two periods share at least one day; for [a, b) and [c, d) it is a &lt; d AND b &gt; c.</td></tr>
<tr><td><strong>session cart</strong></td><td>giỏ trong session</td><td>A Java object kept in the user's HttpSession that collects items before they are saved.</td></tr>
<tr><td><strong>flash message</strong></td><td>thông báo dùng một lần</td><td>A message stored in the session before a redirect and removed after it is shown once.</td></tr>
<tr><td><strong>generated key</strong></td><td>khoá tự sinh</td><td>The IDENTITY value the database creates for a new row, read with getGeneratedKeys().</td></tr>
<tr><td><strong>foreign key (REFERENCE) constraint</strong></td><td>ràng buộc khoá ngoại</td><td>A rule that stops deleting a row other rows still point to, or inserting a link to a row that does not exist.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc kiểm tra</td><td>A rule in the table, such as floorNo BETWEEN 1 AND 20, that the database enforces on every write.</td></tr>
<tr><td><strong>batch</strong></td><td>lô lệnh</td><td>Several executions of one PreparedStatement sent together with addBatch() and executeBatch().</td></tr>
<tr><td><strong>EL reserved word</strong></td><td>từ khoá dành riêng của EL</td><td>A word such as empty, not, div or eq that EL uses as an operator and cannot be a property name.</td></tr>
<tr><td><strong>servlet instance field</strong></td><td>trường của servlet</td><td>A variable declared in the servlet class; one servlet object serves all users, so the field is shared by all of them.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Một nhóm câu lệnh SQL được lưu cùng nhau (commit) hoặc huỷ cùng nhau (rollback).</td></tr>
<tr><td><strong>auto-commit</strong></td><td>tự động commit</td><td>Chế độ mặc định của JDBC trong đó mỗi câu lệnh được lưu ngay khi chạy.</td></tr>
<tr><td><strong>commit / rollback</strong></td><td>xác nhận / huỷ bỏ</td><td>Làm cho các thay đổi của một giao dịch thành vĩnh viễn, hoặc bỏ đi toàn bộ.</td></tr>
<tr><td><strong>date-range overlap</strong></td><td>chồng khoảng ngày</td><td>Hai khoảng thời gian có ít nhất một ngày chung; với [a, b) và [c, d) là a &lt; d AND b &gt; c.</td></tr>
<tr><td><strong>session cart</strong></td><td>giỏ trong session</td><td>Một đối tượng Java nằm trong HttpSession của người dùng, gom các món trước khi lưu.</td></tr>
<tr><td><strong>flash message</strong></td><td>thông báo dùng một lần</td><td>Một thông báo cất trong session trước khi redirect và bị gỡ sau khi hiện một lần.</td></tr>
<tr><td><strong>generated key</strong></td><td>khoá tự sinh</td><td>Giá trị IDENTITY mà CSDL sinh cho dòng mới, đọc bằng getGeneratedKeys().</td></tr>
<tr><td><strong>foreign key (REFERENCE) constraint</strong></td><td>ràng buộc khoá ngoại</td><td>Luật chặn xoá một dòng mà dòng khác vẫn trỏ tới, hoặc thêm liên kết tới một dòng không tồn tại.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc kiểm tra</td><td>Một luật trong bảng, như floorNo BETWEEN 1 AND 20, mà CSDL áp cho mọi lần ghi.</td></tr>
<tr><td><strong>batch</strong></td><td>lô lệnh</td><td>Nhiều lần chạy của một PreparedStatement gửi cùng lúc bằng addBatch() và executeBatch().</td></tr>
<tr><td><strong>EL reserved word</strong></td><td>từ khoá dành riêng của EL</td><td>Từ như empty, not, div hay eq mà EL dùng làm toán tử, không làm tên thuộc tính được.</td></tr>
<tr><td><strong>servlet instance field</strong></td><td>trường của servlet</td><td>Biến khai báo trong lớp servlet; một đối tượng servlet phục vụ mọi người dùng, nên trường đó là của chung tất cả.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Remember</h2>
<ul>
<li>A MOCK paper (no real PRJ301 PE in the Exam Room yet) — same frame as every PE: script, template, <code>DBContext</code>, URLs.</li>
<li>Optional filters without string building: <code>(? = 0 OR col = ?)</code>, <code>(? IS NULL OR col &lt;= ?)</code>, <code>setNull</code> when empty.</li>
<li>Overlap: an existing stay blocks the room when <code>checkIn &lt; newOut AND checkOut &gt; newIn</code> — strict signs, check the four cases.</li>
<li>Check before you write: duplicate key → message; "has bookings" → message, never a 500 from a constraint.</li>
<li>After a successful POST: <code>sendRedirect</code>; a message that must survive the redirect goes in the session as a flash.</li>
<li>Per-user data (cart) lives in the session under ONE name; never in a servlet field.</li>
<li>Several writes that belong together = one transaction: <code>setAutoCommit(false)</code>, re-check, insert, <code>commit</code>; <code>rollback</code> in <code>catch</code>.</li>
<li><code>executeUpdate</code> for INSERT/UPDATE/DELETE; <code>empty</code> is an EL operator; dates as yyyy-mm-dd.</li>
</ul>`,
    `<h2>📌 Ghi nhớ</h2>
<ul>
<li>Đề MÔ PHỎNG (Exam Room chưa có đề PE PRJ301 thật) — cùng khung với mọi đề PE: script, project mẫu, <code>DBContext</code>, URL.</li>
<li>Bộ lọc tuỳ chọn không ghép chuỗi: <code>(? = 0 OR col = ?)</code>, <code>(? IS NULL OR col &lt;= ?)</code>, <code>setNull</code> khi bỏ trống.</li>
<li>Chồng ngày: lượt ở cũ chặn phòng khi <code>checkIn &lt; ngàyTrảMới AND checkOut &gt; ngàyNhậnMới</code> — dấu chặt, kiểm đủ bốn trường hợp.</li>
<li>Kiểm trước khi ghi: trùng khoá → thông báo; "đã có lượt đặt" → thông báo, không bao giờ để ràng buộc trả trang 500.</li>
<li>Sau một POST thành công: <code>sendRedirect</code>; thông báo cần sống qua redirect thì để trong session dạng flash.</li>
<li>Dữ liệu riêng từng người (giỏ) nằm trong session dưới MỘT tên; không bao giờ là trường của servlet.</li>
<li>Nhiều lệnh ghi đi cùng nhau = một giao dịch: <code>setAutoCommit(false)</code>, kiểm lại, thêm, <code>commit</code>; <code>rollback</code> trong <code>catch</code>.</li>
<li><code>executeUpdate</code> cho INSERT/UPDATE/DELETE; <code>empty</code> là toán tử EL; ngày theo yyyy-mm-dd.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── 🎯 PE practice 3/3 — 85-minute mock paper: Student grades (two role areas, search, grade CRUD, GROUP BY statistics) ───────── */
const L_x_luyen_pe_3 = {
  title: '🎯 PE practice 3/3 — 85-minute mock paper: Student grades (two role areas, search, grade CRUD, GROUP BY statistics)|||🎯 Luyện PE 3/3 — đề mô phỏng 85 phút: Điểm sinh viên (hai vùng vai trò, tìm kiếm, nhập điểm, thống kê GROUP BY)',
  slug: 'prj301-luyen-pe-3',
  type: 'VIDEO',
  description: 'Đề thi thực hành PE PRJ301 MÔ PHỎNG thứ ba (Exam Room chưa có đề thật) theo dạng PE quen thuộc, đề tài Quản lý điểm sinh viên: đăng nhập hai vai trò TEACHER/STUDENT, mỗi vai trò một trang chủ và một vùng URL được Filter canh; giáo viên liệt kê và tìm điểm theo mã/tên sinh viên, lớp, môn, có trạng thái Pass/Fail/Not graded khi điểm NULL; nhập/sửa/xoá điểm với khoá chính kép, điểm 0–10 dùng dấu chấm, báo trùng; câu khó là thống kê theo môn bằng GROUP BY + LEFT JOIN (số đăng ký, số đã chấm, điểm trung bình, tỉ lệ đậu, điểm cao nhất, môn chưa có điểm vẫn hiện) và trang sinh viên chỉ xem điểm của chính mình (mã lấy từ session) kèm điểm trung bình có trọng số tín chỉ. Lời giải chạy thật trên Tomcat 10.1 + SQL Server với 25 request đúng kịch bản chấm, barem tự chấm, 10 lỗi mất điểm đo thật (AVG trên cột INT, thiếu cột trong GROUP BY, INNER JOIN làm mất môn, COUNT(*) đếm dòng NULL, getDouble biến NULL thành 0, đọc mã SV từ URL, chỉ giấu nút mà không chặn quyền, parseDouble("8,5"), fmt:formatNumber phụ thuộc locale và làm tròn kiểu ngân hàng, EL đọc thuộc tính không có getter), kế hoạch 85 phút và mẹo NetBeans.',
  content: [
    bi(`<span class="eyebrow">Final exam · Practical Exam (PE) · Mock paper 3 of 3</span>
<h2>🎯 Student grades — the paper where the "hard" question is a GROUP BY</h2>
<div class="callout">⚠ <strong>The Exam Room does not have a real PRJ301 PE paper yet — this is a MOCK paper built on the usual PE shape.</strong> Same frame as papers 1/3 and 2/3; this time the traps are in SQL aggregates, <code>NULL</code> and "who may see whose data".</div>
<p class="lead">Many PE papers end with a statistics or report question, because it shows whether you can push work into SQL instead of looping in Java. Here a teacher sees, per subject, how many students registered, how many were graded, the average, the pass rate and the best score — and a student sees only their own grades with a credit-weighted average. A grade can be <code>NULL</code> (registered, not graded yet): every query, every Java type and every JSP must keep that <code>NULL</code> apart from 0.</p>
<table>
<thead><tr><th>Question</th><th>Points</th><th>What it tests</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>Q1 login, home page by role, Filter for two areas</td><td>2.0</td><td>session, redirect by role, 403</td><td>4.A, 8.A</td></tr>
<tr><td>Q2 grade list + search</td><td>2.5</td><td>3-table JOIN, optional filters, status from a nullable score, <code>fmt</code></td><td>5.B, 3.C, 3.E</td></tr>
<tr><td>Q3 enter, edit, delete a grade</td><td>2.5</td><td>composite key, duplicate check, number format, PRG</td><td>5.B, 6.A</td></tr>
<tr><td>Q4 statistics + "my grades"</td><td>3.0</td><td><code>LEFT JOIN</code>, <code>GROUP BY</code>, <code>COUNT(col)</code>, <code>AVG</code>, no data from the URL</td><td>5.5, 6.4</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Thi cuối kỳ · Thi thực hành (PE) · Đề mô phỏng 3/3</span>
<h2>🎯 Điểm sinh viên — đề mà câu "khó" là một GROUP BY</h2>
<div class="callout">⚠ <strong>Exam Room chưa có đề PE PRJ301 thật — đây là đề MÔ PHỎNG theo dạng PE quen thuộc.</strong> Cùng khung với đề 1/3 và 2/3; lần này bẫy nằm ở hàm gộp của SQL, ở <code>NULL</code> và ở chuyện "ai được xem dữ liệu của ai".</div>
<p class="lead">Nhiều đề PE kết thúc bằng một câu thống kê hay báo cáo, vì nó cho thấy bạn có biết đẩy việc xuống SQL thay vì lặp trong Java hay không. Ở đây giáo viên xem, theo từng môn, bao nhiêu sinh viên đăng ký, bao nhiêu đã có điểm, điểm trung bình, tỉ lệ đậu và điểm cao nhất — còn sinh viên chỉ xem điểm của chính mình kèm điểm trung bình có trọng số tín chỉ. Một điểm có thể là <code>NULL</code> (đã đăng ký, chưa chấm): mọi câu truy vấn, mọi kiểu dữ liệu Java và mọi trang JSP đều phải giữ <code>NULL</code> tách biệt với 0.</p>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Kiểm tra gì</th><th>Học ở bài</th></tr></thead>
<tbody>
<tr><td>Q1 đăng nhập, trang chủ theo vai trò, Filter cho hai vùng</td><td>2.0</td><td>session, chuyển hướng theo vai trò, 403</td><td>4.A, 8.A</td></tr>
<tr><td>Q2 danh sách điểm + tìm kiếm</td><td>2.5</td><td>JOIN 3 bảng, bộ lọc tuỳ chọn, trạng thái từ điểm có thể NULL, <code>fmt</code></td><td>5.B, 3.C, 3.E</td></tr>
<tr><td>Q3 nhập, sửa, xoá điểm</td><td>2.5</td><td>khoá chính kép, kiểm trùng, định dạng số, PRG</td><td>5.B, 6.A</td></tr>
<tr><td>Q4 thống kê + "điểm của tôi"</td><td>3.0</td><td><code>LEFT JOIN</code>, <code>GROUP BY</code>, <code>COUNT(cột)</code>, <code>AVG</code>, không lấy dữ liệu từ URL</td><td>5.5, 6.4</td></tr>
</tbody>
</table>`),
    bi(`<h2>📝 The exam paper (85 minutes)</h2>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 3                            Duration: 85 minutes
STUDENT GRADES

Instructions: run PE3_Grades.sql (database PRJ301_Pe3Diem), rename the template project to
PE3_&lt;YourStudentCode&gt;, fill dal.DBContext, do not change libraries, MVC with Servlet + JSP +
JSTL + JDBC. A part that does not run gets 0.
(In the solution of this course the context path is /pe3-diem.)

Question 1 (2.0 points) — Login and two role areas
    - /login: wrong -&gt; "Invalid username or password" (0.25). Correct -&gt; account in session
      "account"; TEACHER goes to /teacher/grades, STUDENT goes to /student/grades (0.5).
      /logout -&gt; /login (0.25).
    - ONE Filter for /teacher/* and /student/*: not logged in -&gt; /login (0.5); a STUDENT on
      /teacher/* or a TEACHER on /student/* -&gt; HTTP 403 "Access denied" (0.5).

Question 2 (2.5 points) — Teacher: GET /teacher/grades
    - Table: Class, Student (id), Name, Subject, Score (one or two decimals), Status, ordered
      by class then student. Status = "Pass" if score &gt;= 5, "Fail" if &lt; 5, "Not graded" if
      the score is NULL (empty cell, NOT 0) (1.0).
    - keyword: student id OR name contains it (0.5). className and subjectCode drop-downs,
      first option = all (0.5). Values kept after search; nothing -&gt; "No grades found." (0.5).

Question 3 (2.5 points) — Teacher: enter, edit, delete
    - /teacher/grade/add: student and subject from drop-downs, score typed. Rules: student and
      subject chosen; score a number 0..10 written with a DOT, max 2 decimals ("8.5" ok,
      "8,5" / "11" / "" refused); a student already graded in that subject -&gt; message
      "... already has a grade in ... — use Edit". Messages next to the fields (1.0).
      Success -&gt; /teacher/grades with "Saved ..." shown once (0.25).
    - Edit (score only) (0.75). Delete by POST (0.5).

Question 4 (3.0 points)
 a) GET /teacher/stats — one row per subject, ALL subjects (also one nobody took):
    Registered, Graded (score not NULL), Average of graded scores (2 decimals), Passed,
    Pass rate = passed / graded (1 decimal, "—" if nobody graded), Highest.
    Compute it with ONE SQL query (2.0).
 b) GET /student/grades — the logged-in student's grades ONLY, plus
    GPA = sum(score x credits) / sum(credits) over GRADED subjects, 2 decimals.
    Adding ?studentId=... to the URL must NOT show another student (1.0).

Accounts: giaovien / 123 (TEACHER), he180001 / 123 and he180002 / 123 (STUDENT).</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Student (
    id        CHAR(8)       NOT NULL PRIMARY KEY,    -- HE180001
    fullName  NVARCHAR(100) NOT NULL,
    className VARCHAR(10)   NOT NULL
);
CREATE TABLE Account (
    username  VARCHAR(30)   NOT NULL PRIMARY KEY,
    password  VARCHAR(50)   NOT NULL,
    fullName  NVARCHAR(100) NOT NULL,
    role      VARCHAR(10)   NOT NULL CHECK (role IN ('TEACHER', 'STUDENT')),
    studentId CHAR(8)       NULL REFERENCES Student(id)   -- only for STUDENT accounts
);
CREATE TABLE Subject (
    code    VARCHAR(10)   NOT NULL PRIMARY KEY,
    name    NVARCHAR(100) NOT NULL,
    credits INT           NOT NULL CHECK (credits &gt; 0)
);
CREATE TABLE Grade (
    studentId   CHAR(8)      NOT NULL REFERENCES Student(id),
    subjectCode VARCHAR(10)  NOT NULL REFERENCES Subject(code),
    score       DECIMAL(4,2) NULL CHECK (score BETWEEN 0 AND 10),   -- NULL = registered, not graded yet
    PRIMARY KEY (studentId, subjectCode)
);</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Student VALUES
    ('HE180001', N'Nguyễn Văn An',   'SE1801'), ('HE180002', N'Trần Thị Bình', 'SE1801'),
    ('HE180003', N'Lê Minh Châu',    'SE1801'), ('HE180004', N'Phạm Đức Dũng', 'SE1802'),
    ('HE180005', N'Hoàng Thu Hà',    'SE1802'), ('HE180006', N'Võ Quốc Khánh', 'SE1802');
INSERT INTO Account VALUES
    ('giaovien', '123', N'Cô Lan',         'TEACHER', NULL),
    ('he180001', '123', N'Nguyễn Văn An',  'STUDENT', 'HE180001'),
    ('he180002', '123', N'Trần Thị Bình',  'STUDENT', 'HE180002');
INSERT INTO Subject VALUES
    ('PRJ301', N'Java Web Application Development', 3), ('DBI202', N'Database Systems', 3),
    ('JPD113', N'Elementary Japanese 1-A1.1', 3),       ('SWT301', N'Software Testing', 3);
INSERT INTO Grade VALUES
    ('HE180001', 'PRJ301', 8.5), ('HE180001', 'DBI202', 7.0), ('HE180001', 'JPD113', 9.0),
    ('HE180002', 'PRJ301', 4.5), ('HE180002', 'DBI202', 6.5), ('HE180002', 'JPD113', NULL),
    ('HE180003', 'PRJ301', 7.0), ('HE180003', 'DBI202', 3.0),
    ('HE180004', 'PRJ301', 9.5), ('HE180004', 'DBI202', 8.0), ('HE180004', 'JPD113', 5.0),
    ('HE180005', 'PRJ301', 5.0), ('HE180005', 'DBI202', NULL),
    ('HE180006', 'PRJ301', 6.0), ('HE180006', 'JPD113', 7.5);</code></pre>`,
    `<h2>📝 Đề thi (85 phút)</h2>
<pre><code class="language-plaintext">PRJ301 — Practical Exam — MOCK PAPER 3                            Duration: 85 minutes
STUDENT GRADES

Instructions: run PE3_Grades.sql (database PRJ301_Pe3Diem), rename the template project to
PE3_&lt;YourStudentCode&gt;, fill dal.DBContext, do not change libraries, MVC with Servlet + JSP +
JSTL + JDBC. A part that does not run gets 0.
(In the solution of this course the context path is /pe3-diem.)

Question 1 (2.0 points) — Login and two role areas
    - /login: wrong -&gt; "Invalid username or password" (0.25). Correct -&gt; account in session
      "account"; TEACHER goes to /teacher/grades, STUDENT goes to /student/grades (0.5).
      /logout -&gt; /login (0.25).
    - ONE Filter for /teacher/* and /student/*: not logged in -&gt; /login (0.5); a STUDENT on
      /teacher/* or a TEACHER on /student/* -&gt; HTTP 403 "Access denied" (0.5).

Question 2 (2.5 points) — Teacher: GET /teacher/grades
    - Table: Class, Student (id), Name, Subject, Score (one or two decimals), Status, ordered
      by class then student. Status = "Pass" if score &gt;= 5, "Fail" if &lt; 5, "Not graded" if
      the score is NULL (empty cell, NOT 0) (1.0).
    - keyword: student id OR name contains it (0.5). className and subjectCode drop-downs,
      first option = all (0.5). Values kept after search; nothing -&gt; "No grades found." (0.5).

Question 3 (2.5 points) — Teacher: enter, edit, delete
    - /teacher/grade/add: student and subject from drop-downs, score typed. Rules: student and
      subject chosen; score a number 0..10 written with a DOT, max 2 decimals ("8.5" ok,
      "8,5" / "11" / "" refused); a student already graded in that subject -&gt; message
      "... already has a grade in ... — use Edit". Messages next to the fields (1.0).
      Success -&gt; /teacher/grades with "Saved ..." shown once (0.25).
    - Edit (score only) (0.75). Delete by POST (0.5).

Question 4 (3.0 points)
 a) GET /teacher/stats — one row per subject, ALL subjects (also one nobody took):
    Registered, Graded (score not NULL), Average of graded scores (2 decimals), Passed,
    Pass rate = passed / graded (1 decimal, "—" if nobody graded), Highest.
    Compute it with ONE SQL query (2.0).
 b) GET /student/grades — the logged-in student's grades ONLY, plus
    GPA = sum(score x credits) / sum(credits) over GRADED subjects, 2 decimals.
    Adding ?studentId=... to the URL must NOT show another student (1.0).

Accounts: giaovien / 123 (TEACHER), he180001 / 123 and he180002 / 123 (STUDENT).</code></pre>
<p><strong>Dịch từng ý.</strong></p>
<ul>
<li><strong>Câu 1 (2.0)</strong>: sai ⇒ "Invalid username or password" (0.25); đúng ⇒ tài khoản vào session tên <code>"account"</code>, TEACHER tới <code>/teacher/grades</code>, STUDENT tới <code>/student/grades</code> (0.5); <code>/logout</code> về <code>/login</code> (0.25). MỘT Filter cho <code>/teacher/*</code> và <code>/student/*</code>: chưa đăng nhập ⇒ <code>/login</code> (0.5); STUDENT vào <code>/teacher/*</code> hoặc TEACHER vào <code>/student/*</code> ⇒ HTTP 403 "Access denied" (0.5).</li>
<li><strong>Câu 2 (2.5)</strong> — trang giáo viên: bảng Lớp, Mã SV, Tên, Môn, Điểm (một hoặc hai chữ số thập phân), Trạng thái, sắp theo lớp rồi mã SV; trạng thái "Pass" nếu điểm ≥ 5, "Fail" nếu &lt; 5, "Not graded" nếu điểm NULL (ô trống, KHÔNG phải 0) (1.0). Từ khoá: mã HOẶC tên sinh viên chứa nó (0.5). Ô chọn lớp và môn, lựa chọn đầu = tất cả (0.5). Tìm xong giữ giá trị; không có ⇒ "No grades found." (0.5).</li>
<li><strong>Câu 3 (2.5)</strong> — nhập điểm: chọn sinh viên và môn từ ô chọn, gõ điểm. Luật: phải chọn sinh viên và môn; điểm là số 0..10 viết bằng DẤU CHẤM, tối đa 2 chữ số thập phân ("8.5" được; "8,5" / "11" / "" bị từ chối); sinh viên đã có điểm môn đó ⇒ báo "... already has a grade in ... — use Edit". Thông báo cạnh ô (1.0). Thành công ⇒ về <code>/teacher/grades</code> với "Saved ..." hiện một lần (0.25). Sửa (chỉ điểm) (0.75). Xoá bằng POST (0.5).</li>
<li><strong>Câu 4 (3.0)</strong> — a) <code>/teacher/stats</code>: mỗi môn một dòng, ĐỦ mọi môn (kể cả môn chưa ai học): số đăng ký, số đã chấm (điểm khác NULL), trung bình các điểm đã chấm (2 chữ số thập phân), số đậu, tỉ lệ đậu = đậu / đã chấm (1 chữ số thập phân, "—" nếu chưa ai có điểm), điểm cao nhất; tính bằng MỘT câu SQL (2.0). b) <code>/student/grades</code>: CHỈ điểm của sinh viên đang đăng nhập, kèm GPA = tổng(điểm × tín chỉ) / tổng(tín chỉ) trên các môn ĐÃ có điểm, 2 chữ số thập phân; thêm <code>?studentId=...</code> lên URL KHÔNG được hiện sinh viên khác (1.0).</li>
</ul>
<p class="ghi-chu">📄 <code>pe3-diem/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Student (
    id        CHAR(8)       NOT NULL PRIMARY KEY,    -- HE180001
    fullName  NVARCHAR(100) NOT NULL,
    className VARCHAR(10)   NOT NULL
);
CREATE TABLE Account (
    username  VARCHAR(30)   NOT NULL PRIMARY KEY,
    password  VARCHAR(50)   NOT NULL,
    fullName  NVARCHAR(100) NOT NULL,
    role      VARCHAR(10)   NOT NULL CHECK (role IN ('TEACHER', 'STUDENT')),
    studentId CHAR(8)       NULL REFERENCES Student(id)   -- chỉ có ở tài khoản STUDENT
);
CREATE TABLE Subject (
    code    VARCHAR(10)   NOT NULL PRIMARY KEY,
    name    NVARCHAR(100) NOT NULL,
    credits INT           NOT NULL CHECK (credits &gt; 0)
);
CREATE TABLE Grade (
    studentId   CHAR(8)      NOT NULL REFERENCES Student(id),
    subjectCode VARCHAR(10)  NOT NULL REFERENCES Subject(code),
    score       DECIMAL(4,2) NULL CHECK (score BETWEEN 0 AND 10),   -- NULL = đã đăng ký, chưa có điểm
    PRIMARY KEY (studentId, subjectCode)
);</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Student VALUES
    ('HE180001', N'Nguyễn Văn An',   'SE1801'), ('HE180002', N'Trần Thị Bình', 'SE1801'),
    ('HE180003', N'Lê Minh Châu',    'SE1801'), ('HE180004', N'Phạm Đức Dũng', 'SE1802'),
    ('HE180005', N'Hoàng Thu Hà',    'SE1802'), ('HE180006', N'Võ Quốc Khánh', 'SE1802');
INSERT INTO Account VALUES
    ('giaovien', '123', N'Cô Lan',         'TEACHER', NULL),
    ('he180001', '123', N'Nguyễn Văn An',  'STUDENT', 'HE180001'),
    ('he180002', '123', N'Trần Thị Bình',  'STUDENT', 'HE180002');
INSERT INTO Subject VALUES
    ('PRJ301', N'Java Web Application Development', 3), ('DBI202', N'Database Systems', 3),
    ('JPD113', N'Elementary Japanese 1-A1.1', 3),       ('SWT301', N'Software Testing', 3);
INSERT INTO Grade VALUES
    ('HE180001', 'PRJ301', 8.5), ('HE180001', 'DBI202', 7.0), ('HE180001', 'JPD113', 9.0),
    ('HE180002', 'PRJ301', 4.5), ('HE180002', 'DBI202', 6.5), ('HE180002', 'JPD113', NULL),
    ('HE180003', 'PRJ301', 7.0), ('HE180003', 'DBI202', 3.0),
    ('HE180004', 'PRJ301', 9.5), ('HE180004', 'DBI202', 8.0), ('HE180004', 'JPD113', 5.0),
    ('HE180005', 'PRJ301', 5.0), ('HE180005', 'DBI202', NULL),
    ('HE180006', 'PRJ301', 6.0), ('HE180006', 'JPD113', 7.5);</code></pre>`),
    bi(`<h2>✅ Solution — every response below is real</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ed4a9b5504f86f6fe83ebfcbf6ea029267a2ecba.svg" alt="Two roles, two URL areas, one Filter; the student's id always comes from the session" loading="lazy" /><p class="chu-thich">🧩 Two roles, two URL areas, one Filter; the student's id always comes from the session</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 3: two roles, two URL areas, one RoleFilter
left to right direction
actor "TEACHER" as T
actor "STUDENT" as S
rectangle "RoleFilter\\n@WebFilter(/teacher/*, /student/*)\\n\\nno account → 302 /login\\nwrong area → 403" as F
rectangle "/teacher/grades (search)\\n/teacher/grade/add · edit · delete\\n/teacher/stats (GROUP BY)" as TA
rectangle "/student/grades\\nstudentId = session account\\n(never ?studentId= from the URL)" as SA
database "SQL Server\\nPRJ301_Pe3Diem" as DB
T --&gt; F
S --&gt; F
F --&gt; TA : role TEACHER
F --&gt; SA : role STUDENT
TA --&gt; DB
SA --&gt; DB
@enduml</code></pre></details>
<pre><code class="language-plaintext">PE3_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   Forms, LoginServlet, LogoutServlet, GradeListServlet, GradeForm,
│  │               GradeAddServlet, GradeEditServlet, GradeDeleteServlet, StatsServlet,
│  │               MyGradesServlet
│  ├─ dal          DBContext (given), AccountDAO, OptionDAO, GradeDAO
│  ├─ filter       RoleFilter
│  └─ model        Account, Grade, SubjectStat, Option
└─ Web Pages/WEB-INF/views   login.jsp, 403.jsp, teacher/grades.jsp, teacher/grade-form.jsp,
                             teacher/stats.jsp, student/grades.jsp</code></pre>
<h3>Q1 — a home page per role, one Filter for two areas</h3>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    Account account;
    try {
        account = new AccountDAO().login(request.getParameter("username"), request.getParameter("password"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (account == null) {
        request.setAttribute("error", "Invalid username or password");
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        return;
    }
    request.getSession().setAttribute("account", account);
    String home = account.isTeacher() ? "/teacher/grades" : "/student/grades";   // each role has its own home page
    response.sendRedirect(request.getContextPath() + home);
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/filter/RoleFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) resp;
    HttpSession session = request.getSession(false);
    Account account = (session == null) ? null : (Account) session.getAttribute("account");
    if (account == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }
    String needed = request.getServletPath().startsWith("/teacher/") ? "TEACHER" : "STUDENT";
    if (!needed.equals(account.getRole())) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        request.setAttribute("needed", needed);
        request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
        return;
    }
    chain.doFilter(req, resp);
}</code></pre>
<p>The Filter derives the needed role from the area of the URL: anything under <code>/teacher/</code> needs TEACHER, the rest of its mapping (<code>/student/*</code>) needs STUDENT. Adding a page later needs no new rule.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/stats HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=giaovien&amp;password=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Grades — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="giaovien"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 30

username=he180002&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/student/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for TEACHER accounts; you are he180002 (STUDENT).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

studentId=HE180002&amp;subjectCode=PRJ301</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for TEACHER accounts; you are he180002 (STUDENT).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 30

username=giaovien&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/pe3-diem; HttpOnly
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for STUDENT accounts; you are giaovien (TEACHER).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Note the raw POST to <code>/teacher/grade/delete</code> by the student: the student's page never shows a Delete button, but hiding a button protects nothing — the Filter's 403 does (mistake 7 shows a version without it).</p>
<h3>Q2 — the grade list: a three-table JOIN and a nullable score</h3>
<p>The score column is <code>DECIMAL(4,2) NULL</code>, so the Java type is <code>BigDecimal</code> read with <code>getBigDecimal</code>, which returns <code>null</code> for SQL NULL. A <code>double</code> cannot be null, and <code>getDouble</code> silently turns NULL into 0.0 — a "Fail" for a student who was never graded (mistake 5). The status is computed once, in the model, and the JSP just prints <code>g.status</code>.</p>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/model/Grade.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public String getStatus() {                                // computed in Java, read in JSP as &#36;{g.status}
    if (score == null) return "Not graded";
    return score.compareTo(new BigDecimal("5")) &gt;= 0 ? "Pass" : "Fail";
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/dal/GradeDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Q2: keyword in student id OR name; class and subject: "" = all
public List&lt;Grade&gt; search(String keyword, String className, String subjectCode) throws SQLException {
    String sql = SELECT
            + " WHERE (g.studentId LIKE ? OR st.fullName LIKE ?)"
            + " AND (? = '' OR st.className = ?) AND (? = '' OR g.subjectCode = ?)"
            + " ORDER BY st.className, g.studentId, g.subjectCode";
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, "%" + keyword + "%");
        ps.setString(2, "%" + keyword + "%");
        ps.setString(3, className);
        ps.setString(4, className);
        ps.setString(5, subjectCode);
        ps.setString(6, subjectCode);
        return list(ps);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/webapp/WEB-INF/views/teacher/grades.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:choose&gt;
&lt;c:when test="&#36;{empty grades}"&gt;&lt;p&gt;No grades found.&lt;/p&gt;&lt;/c:when&gt;
&lt;c:otherwise&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{grades}" var="g"&gt;
  &lt;c:url value="grade/edit" var="edit"&gt;&lt;c:param name="studentId" value="&#36;{g.studentId}"/&gt;&lt;c:param name="subjectCode" value="&#36;{g.subjectCode}"/&gt;&lt;/c:url&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{g.className}&lt;/td&gt;&lt;td&gt;&#36;{g.studentId}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{g.studentName}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{g.subjectCode}&lt;/td&gt;
    &lt;td&gt;&lt;fmt:formatNumber value="&#36;{g.score}" pattern="0.0#"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{g.status}&lt;/td&gt;
    &lt;td&gt;&lt;a href="&#36;{edit}"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="&#36;{g.studentId}"&gt;
      &lt;input type="hidden" name="subjectCode" value="&#36;{g.subjectCode}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;p&gt;&#36;{grades.size()} grade(s)&lt;/p&gt;
&lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre>
<p>The score is printed with <code>&lt;fmt:formatNumber value="…" pattern="0.0#"/&gt;</code> after <code>&lt;fmt:setLocale value="en_US"/&gt;</code>: at least one decimal, at most two (8.5, 7.0, 6.25), a dot as the separator, and an empty cell for <code>null</code>. Mistake 9 shows why both the locale and the pattern are fixed on the page.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=th%E1%BB%8B&amp;className=&amp;subjectCode= HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="thị" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;DBI202&lt;/td&gt;
    &lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=DBI202"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="DBI202"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;3 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=&amp;className=SE1802&amp;subjectCode=PRJ301 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" selected&gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" selected&gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180004&lt;/td&gt;&lt;td&gt;Phạm Đức Dũng&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;9.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180004&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180004"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180005&lt;/td&gt;&lt;td&gt;Hoàng Thu Hà&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;5.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180005&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180005"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180006&lt;/td&gt;&lt;td&gt;Võ Quốc Khánh&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;6.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180006&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180006"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;3 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=HE19&amp;className=&amp;subjectCode= HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="HE19" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;No grades found.&lt;/p&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>"thị" finds Trần Thị Bình whatever the case (the default collation of SQL Server ignores case, and <code>N'…'</code> parameters keep the Vietnamese letters); her JPD113 row shows an empty score and "Not graded".</p>`,
    `<h2>✅ Lời giải — mọi response bên dưới là thật</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ed4a9b5504f86f6fe83ebfcbf6ea029267a2ecba.svg" alt="Hai vai trò, hai vùng URL, một Filter; mã sinh viên luôn lấy từ session" loading="lazy" /><p class="chu-thich">🧩 Hai vai trò, hai vùng URL, một Filter; mã sinh viên luôn lấy từ session</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE mock paper 3: two roles, two URL areas, one RoleFilter
left to right direction
actor "TEACHER" as T
actor "STUDENT" as S
rectangle "RoleFilter\\n@WebFilter(/teacher/*, /student/*)\\n\\nno account → 302 /login\\nwrong area → 403" as F
rectangle "/teacher/grades (search)\\n/teacher/grade/add · edit · delete\\n/teacher/stats (GROUP BY)" as TA
rectangle "/student/grades\\nstudentId = session account\\n(never ?studentId= from the URL)" as SA
database "SQL Server\\nPRJ301_Pe3Diem" as DB
T --&gt; F
S --&gt; F
F --&gt; TA : role TEACHER
F --&gt; SA : role STUDENT
TA --&gt; DB
SA --&gt; DB
@enduml</code></pre></details>
<pre><code class="language-plaintext">PE3_&lt;StudentCode&gt;
├─ Source Packages
│  ├─ controller   Forms, LoginServlet, LogoutServlet, GradeListServlet, GradeForm,
│  │               GradeAddServlet, GradeEditServlet, GradeDeleteServlet, StatsServlet,
│  │               MyGradesServlet
│  ├─ dal          DBContext (given), AccountDAO, OptionDAO, GradeDAO
│  ├─ filter       RoleFilter
│  └─ model        Account, Grade, SubjectStat, Option
└─ Web Pages/WEB-INF/views   login.jsp, 403.jsp, teacher/grades.jsp, teacher/grade-form.jsp,
                             teacher/stats.jsp, student/grades.jsp</code></pre>
<h3>Câu 1 — mỗi vai trò một trang chủ, một Filter cho hai vùng</h3>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");
    Account account;
    try {
        account = new AccountDAO().login(request.getParameter("username"), request.getParameter("password"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (account == null) {
        request.setAttribute("error", "Invalid username or password");
        request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        return;
    }
    request.getSession().setAttribute("account", account);
    String home = account.isTeacher() ? "/teacher/grades" : "/student/grades";   // mỗi vai trò một trang chủ
    response.sendRedirect(request.getContextPath() + home);
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/filter/RoleFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) resp;
    HttpSession session = request.getSession(false);
    Account account = (session == null) ? null : (Account) session.getAttribute("account");
    if (account == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }
    String needed = request.getServletPath().startsWith("/teacher/") ? "TEACHER" : "STUDENT";
    if (!needed.equals(account.getRole())) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        request.setAttribute("needed", needed);
        request.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
        return;
    }
    chain.doFilter(req, resp);
}</code></pre>
<p>Filter suy ra vai trò cần có từ vùng của URL: mọi thứ dưới <code>/teacher/</code> cần TEACHER, phần còn lại trong ánh xạ của nó (<code>/student/*</code>) cần STUDENT. Sau này thêm trang thì không cần thêm luật nào.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/stats HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=giaovien&amp;password=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Grades — Login&lt;/h1&gt;
&lt;p class="error"&gt;Invalid username or password&lt;/p&gt;&lt;form action="login" method="post"&gt;
  Username &lt;input name="username" value="giaovien"&gt;&lt;br&gt;
  Password &lt;input type="password" name="password"&gt;&lt;br&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 30

username=he180002&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/student/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for TEACHER accounts; you are he180002 (STUDENT).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

studentId=HE180002&amp;subjectCode=PRJ301</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for TEACHER accounts; you are he180002 (STUDENT).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 30

username=giaovien&amp;password=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/pe3-diem; HttpOnly
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 246

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Access denied&lt;/h1&gt;
&lt;p&gt;This page is for STUDENT accounts; you are giaovien (TEACHER).&lt;/p&gt;
&lt;p&gt;&lt;a href="/pe3-diem/logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Để ý POST thô của sinh viên tới <code>/teacher/grade/delete</code>: trang của sinh viên không bao giờ có nút Delete, nhưng giấu nút thì không bảo vệ được gì — chính 403 của Filter mới bảo vệ (lỗi 7 cho thấy một phiên bản thiếu nó).</p>
<h3>Câu 2 — danh sách điểm: JOIN ba bảng và một điểm có thể NULL</h3>
<p>Cột điểm là <code>DECIMAL(4,2) NULL</code>, nên kiểu Java là <code>BigDecimal</code> đọc bằng <code>getBigDecimal</code>, hàm này trả <code>null</code> cho NULL của SQL. Một <code>double</code> không thể null, và <code>getDouble</code> âm thầm biến NULL thành 0.0 — thành "Fail" cho một sinh viên chưa hề được chấm (lỗi 5). Trạng thái được tính một lần, trong model, JSP chỉ việc in <code>g.status</code>.</p>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/model/Grade.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public String getStatus() {                                // tính trong Java, JSP đọc là &#36;{g.status}
    if (score == null) return "Not graded";
    return score.compareTo(new BigDecimal("5")) &gt;= 0 ? "Pass" : "Fail";
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/dal/GradeDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Câu 2: từ khoá trong mã HOẶC tên sinh viên; lớp và môn: "" = tất cả
public List&lt;Grade&gt; search(String keyword, String className, String subjectCode) throws SQLException {
    String sql = SELECT
            + " WHERE (g.studentId LIKE ? OR st.fullName LIKE ?)"
            + " AND (? = '' OR st.className = ?) AND (? = '' OR g.subjectCode = ?)"
            + " ORDER BY st.className, g.studentId, g.subjectCode";
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, "%" + keyword + "%");
        ps.setString(2, "%" + keyword + "%");
        ps.setString(3, className);
        ps.setString(4, className);
        ps.setString(5, subjectCode);
        ps.setString(6, subjectCode);
        return list(ps);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/webapp/WEB-INF/views/teacher/grades.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:choose&gt;
&lt;c:when test="&#36;{empty grades}"&gt;&lt;p&gt;No grades found.&lt;/p&gt;&lt;/c:when&gt;
&lt;c:otherwise&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{grades}" var="g"&gt;
  &lt;c:url value="grade/edit" var="edit"&gt;&lt;c:param name="studentId" value="&#36;{g.studentId}"/&gt;&lt;c:param name="subjectCode" value="&#36;{g.subjectCode}"/&gt;&lt;/c:url&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{g.className}&lt;/td&gt;&lt;td&gt;&#36;{g.studentId}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{g.studentName}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{g.subjectCode}&lt;/td&gt;
    &lt;td&gt;&lt;fmt:formatNumber value="&#36;{g.score}" pattern="0.0#"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{g.status}&lt;/td&gt;
    &lt;td&gt;&lt;a href="&#36;{edit}"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="&#36;{g.studentId}"&gt;
      &lt;input type="hidden" name="subjectCode" value="&#36;{g.subjectCode}"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;p&gt;&#36;{grades.size()} grade(s)&lt;/p&gt;
&lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre>
<p>Điểm được in bằng <code>&lt;fmt:formatNumber value="…" pattern="0.0#"/&gt;</code> sau <code>&lt;fmt:setLocale value="en_US"/&gt;</code>: ít nhất một, nhiều nhất hai chữ số thập phân (8.5, 7.0, 6.25), dấu chấm làm dấu thập phân, và ô trống khi <code>null</code>. Lỗi 9 cho thấy vì sao cả locale lẫn pattern đều được chốt ngay trên trang.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=th%E1%BB%8B&amp;className=&amp;subjectCode= HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="thị" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;DBI202&lt;/td&gt;
    &lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=DBI202"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="DBI202"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;3 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=&amp;className=SE1802&amp;subjectCode=PRJ301 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" selected&gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" selected&gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180004&lt;/td&gt;&lt;td&gt;Phạm Đức Dũng&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;9.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180004&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180004"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180005&lt;/td&gt;&lt;td&gt;Hoàng Thu Hà&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;5.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180005&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180005"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180006&lt;/td&gt;&lt;td&gt;Võ Quốc Khánh&lt;/td&gt;&lt;td&gt;PRJ301&lt;/td&gt;
    &lt;td&gt;6.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180006&amp;subjectCode=PRJ301"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180006"&gt;
      &lt;input type="hidden" name="subjectCode" value="PRJ301"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;3 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=HE19&amp;className=&amp;subjectCode= HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="HE19" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" &gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;p&gt;No grades found.&lt;/p&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>"thị" tìm ra Trần Thị Bình dù viết hoa hay thường (collation mặc định của SQL Server bỏ qua hoa thường, và tham số kiểu <code>N'…'</code> giữ nguyên chữ tiếng Việt); dòng JPD113 của bạn ấy có ô điểm trống và "Not graded".</p>`),
    bi(`<h3>Q3 — enter, edit, delete a grade</h3>
<p>The table has a <strong>composite primary key</strong> <code>(studentId, subjectCode)</code>: a grade is identified by the pair, so edit and delete carry both values (the edit link is built with <code>c:url</code> + two <code>c:param</code>). The score is checked by a regular expression first — digits, an optional dot, at most two decimals — so "8,5" is refused with a message instead of a <code>NumberFormatException</code>, and only then turned into a <code>BigDecimal</code> and compared with 10.</p>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/GradeForm.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// "8.5" ✓ · "10" ✓ · "8,5" ✗ · "11" ✗ · "abc" ✗ · "" ✗ — returns null when invalid
public BigDecimal scoreValue() {
    if (!score.matches("\\\\d{1,2}(\\\\.\\\\d{1,2})?")) return null;   // digits, a DOT, at most 2 decimals
    BigDecimal v = new BigDecimal(score);
    return v.compareTo(BigDecimal.TEN) &gt; 0 ? null : v;
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/GradeAddServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    GradeForm form = GradeForm.fromRequest(request);
    try {
        OptionDAO options = new OptionDAO();
        GradeDAO dao = new GradeDAO();
        boolean duplicate = dao.getOne(form.getStudentId(), form.getSubjectCode()) != null;   // the PRIMARY KEY would refuse it with a 500
        if (!form.validate(options.studentExists(form.getStudentId()), options.subjectExists(form.getSubjectCode()), duplicate)) {
            show(request, response, form, false);
            return;
        }
        dao.insert(form.getStudentId(), form.getSubjectCode(), form.scoreValue());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", "Saved " + form.getStudentId() + " / " + form.getSubjectCode());
    response.sendRedirect(request.getContextPath() + "/teacher/grades");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 49

studentId=HE180003&amp;subjectCode=PRJ301&amp;score=8%2C5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Enter a grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Enter a grade&lt;/h1&gt;
&lt;form action="add" method="post"&gt;

  Student &lt;select name="studentId"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="HE180001" &gt;HE180001 - Nguyễn Văn An&lt;/option&gt;
    &lt;option value="HE180002" &gt;HE180002 - Trần Thị Bình&lt;/option&gt;
    &lt;option value="HE180003" selected&gt;HE180003 - Lê Minh Châu&lt;/option&gt;
    &lt;option value="HE180004" &gt;HE180004 - Phạm Đức Dũng&lt;/option&gt;
    &lt;option value="HE180005" &gt;HE180005 - Hoàng Thu Hà&lt;/option&gt;
    &lt;option value="HE180006" &gt;HE180006 - Võ Quốc Khánh&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Subject &lt;select name="subjectCode"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;
    &lt;option value="JPD113" &gt;JPD113&lt;/option&gt;
    &lt;option value="PRJ301" selected&gt;PRJ301&lt;/option&gt;
    &lt;option value="SWT301" &gt;SWT301&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;HE180003 already has a grade in PRJ301 — use Edit&lt;/span&gt;&lt;br&gt;

  Score &lt;input name="score" value="8,5"&gt; &lt;span class="error"&gt;Score must be a number from 0 to 10, e.g. 8.5 (use a dot)&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Two messages at once: HE180003 already has PRJ301, and "8,5" uses a comma. The values stay selected. Then a score above 10 and no student:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 38

studentId=&amp;subjectCode=JPD113&amp;score=11</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Enter a grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Enter a grade&lt;/h1&gt;
&lt;form action="add" method="post"&gt;

  Student &lt;select name="studentId"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="HE180001" &gt;HE180001 - Nguyễn Văn An&lt;/option&gt;
    &lt;option value="HE180002" &gt;HE180002 - Trần Thị Bình&lt;/option&gt;
    &lt;option value="HE180003" &gt;HE180003 - Lê Minh Châu&lt;/option&gt;
    &lt;option value="HE180004" &gt;HE180004 - Phạm Đức Dũng&lt;/option&gt;
    &lt;option value="HE180005" &gt;HE180005 - Hoàng Thu Hà&lt;/option&gt;
    &lt;option value="HE180006" &gt;HE180006 - Võ Quốc Khánh&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;Choose a student&lt;/span&gt;&lt;br&gt;
  Subject &lt;select name="subjectCode"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;
    &lt;option value="JPD113" selected&gt;JPD113&lt;/option&gt;
    &lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;
    &lt;option value="SWT301" &gt;SWT301&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;

  Score &lt;input name="score" value="11"&gt; &lt;span class="error"&gt;Score must be a number from 0 to 10, e.g. 8.5 (use a dot)&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 48

studentId=HE180003&amp;subjectCode=JPD113&amp;score=6.25</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grade/edit?studentId=HE180002&amp;subjectCode=JPD113 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit grade&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
&lt;input type="hidden" name="studentId" value="HE180002"&gt;&lt;input type="hidden" name="subjectCode" value="JPD113"&gt;
  &lt;p&gt;HE180002 — JPD113&lt;/p&gt;

  Score &lt;input name="score" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 45

studentId=HE180002&amp;subjectCode=JPD113&amp;score=4</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 37

studentId=HE180006&amp;subjectCode=JPD113</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=&amp;className=&amp;subjectCode=JPD113 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Deleted HE180006 / JPD113&lt;/p&gt;&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" selected&gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180001&lt;/td&gt;&lt;td&gt;Nguyễn Văn An&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180001&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180001"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;4.0&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180003&lt;/td&gt;&lt;td&gt;Lê Minh Châu&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;6.25&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180003&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180003"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180004&lt;/td&gt;&lt;td&gt;Phạm Đức Dũng&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;5.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180004&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180004"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>JPD113 now: HE180002 graded 4.0 (was "Not graded"), HE180003 added with 6.25 — shown with two decimals thanks to <code>0.0#</code> — and HE180006 deleted; the flash "Deleted …" appears once.</p>`,
    `<h3>Câu 3 — nhập, sửa, xoá điểm</h3>
<p>Bảng có <strong>khoá chính kép</strong> <code>(studentId, subjectCode)</code>: một điểm được xác định bằng cả cặp, nên sửa và xoá đều mang cả hai giá trị (link sửa được dựng bằng <code>c:url</code> + hai <code>c:param</code>). Điểm được kiểm bằng biểu thức chính quy (regular expression) trước — chữ số, dấu chấm tuỳ chọn, tối đa hai chữ số thập phân — nên "8,5" bị từ chối bằng một thông báo thay vì một <code>NumberFormatException</code>, rồi mới đổi sang <code>BigDecimal</code> và so với 10.</p>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/GradeForm.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// trả null khi không hợp lệ
public BigDecimal scoreValue() {
    if (!score.matches("\\\\d{1,2}(\\\\.\\\\d{1,2})?")) return null;   // chữ số, dấu CHẤM, tối đa 2 chữ số thập phân
    BigDecimal v = new BigDecimal(score);
    return v.compareTo(BigDecimal.TEN) &gt; 0 ? null : v;
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/GradeAddServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    GradeForm form = GradeForm.fromRequest(request);
    try {
        OptionDAO options = new OptionDAO();
        GradeDAO dao = new GradeDAO();
        boolean duplicate = dao.getOne(form.getStudentId(), form.getSubjectCode()) != null;   // khoá chính sẽ từ chối bằng một trang 500
        if (!form.validate(options.studentExists(form.getStudentId()), options.subjectExists(form.getSubjectCode()), duplicate)) {
            show(request, response, form, false);
            return;
        }
        dao.insert(form.getStudentId(), form.getSubjectCode(), form.scoreValue());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getSession().setAttribute("flash", "Saved " + form.getStudentId() + " / " + form.getSubjectCode());
    response.sendRedirect(request.getContextPath() + "/teacher/grades");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 49

studentId=HE180003&amp;subjectCode=PRJ301&amp;score=8%2C5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Enter a grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Enter a grade&lt;/h1&gt;
&lt;form action="add" method="post"&gt;

  Student &lt;select name="studentId"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="HE180001" &gt;HE180001 - Nguyễn Văn An&lt;/option&gt;
    &lt;option value="HE180002" &gt;HE180002 - Trần Thị Bình&lt;/option&gt;
    &lt;option value="HE180003" selected&gt;HE180003 - Lê Minh Châu&lt;/option&gt;
    &lt;option value="HE180004" &gt;HE180004 - Phạm Đức Dũng&lt;/option&gt;
    &lt;option value="HE180005" &gt;HE180005 - Hoàng Thu Hà&lt;/option&gt;
    &lt;option value="HE180006" &gt;HE180006 - Võ Quốc Khánh&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  Subject &lt;select name="subjectCode"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;
    &lt;option value="JPD113" &gt;JPD113&lt;/option&gt;
    &lt;option value="PRJ301" selected&gt;PRJ301&lt;/option&gt;
    &lt;option value="SWT301" &gt;SWT301&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;HE180003 already has a grade in PRJ301 — use Edit&lt;/span&gt;&lt;br&gt;

  Score &lt;input name="score" value="8,5"&gt; &lt;span class="error"&gt;Score must be a number from 0 to 10, e.g. 8.5 (use a dot)&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Hai thông báo cùng lúc: HE180003 đã có điểm PRJ301, và "8,5" dùng dấu phẩy. Các lựa chọn vẫn giữ nguyên. Rồi một điểm lớn hơn 10 và không chọn sinh viên:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 38

studentId=&amp;subjectCode=JPD113&amp;score=11</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Enter a grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Enter a grade&lt;/h1&gt;
&lt;form action="add" method="post"&gt;

  Student &lt;select name="studentId"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="HE180001" &gt;HE180001 - Nguyễn Văn An&lt;/option&gt;
    &lt;option value="HE180002" &gt;HE180002 - Trần Thị Bình&lt;/option&gt;
    &lt;option value="HE180003" &gt;HE180003 - Lê Minh Châu&lt;/option&gt;
    &lt;option value="HE180004" &gt;HE180004 - Phạm Đức Dũng&lt;/option&gt;
    &lt;option value="HE180005" &gt;HE180005 - Hoàng Thu Hà&lt;/option&gt;
    &lt;option value="HE180006" &gt;HE180006 - Võ Quốc Khánh&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;Choose a student&lt;/span&gt;&lt;br&gt;
  Subject &lt;select name="subjectCode"&gt;&lt;option value=""&gt;--&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;
    &lt;option value="JPD113" selected&gt;JPD113&lt;/option&gt;
    &lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;
    &lt;option value="SWT301" &gt;SWT301&lt;/option&gt;
    &lt;/select&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;

  Score &lt;input name="score" value="11"&gt; &lt;span class="error"&gt;Score must be a number from 0 to 10, e.g. 8.5 (use a dot)&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/add HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 48

studentId=HE180003&amp;subjectCode=JPD113&amp;score=6.25</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grade/edit?studentId=HE180002&amp;subjectCode=JPD113 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit grade&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit grade&lt;/h1&gt;
&lt;form action="edit" method="post"&gt;
&lt;input type="hidden" name="studentId" value="HE180002"&gt;&lt;input type="hidden" name="subjectCode" value="JPD113"&gt;
  &lt;p&gt;HE180002 — JPD113&lt;/p&gt;

  Score &lt;input name="score" value=""&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt; &lt;a href="../grades"&gt;Back&lt;/a&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/edit HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 45

studentId=HE180002&amp;subjectCode=JPD113&amp;score=4</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-diem/teacher/grade/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 37

studentId=HE180006&amp;subjectCode=JPD113</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /pe3-diem/teacher/grades
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/grades?keyword=&amp;className=&amp;subjectCode=JPD113 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Cô Lan | &lt;a href="stats"&gt;Statistics&lt;/a&gt; | &lt;a href="grade/add"&gt;Enter a grade&lt;/a&gt; | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;p class="flash"&gt;Deleted HE180006 / JPD113&lt;/p&gt;&lt;form action="grades" method="get"&gt;
  &lt;input name="keyword" value="" placeholder="student id or name"&gt;
  &lt;select name="className"&gt;&lt;option value=""&gt;All classes&lt;/option&gt;
    &lt;option value="SE1801" &gt;SE1801&lt;/option&gt;&lt;option value="SE1802" &gt;SE1802&lt;/option&gt;&lt;/select&gt;
  &lt;select name="subjectCode"&gt;&lt;option value=""&gt;All subjects&lt;/option&gt;
    &lt;option value="DBI202" &gt;DBI202&lt;/option&gt;&lt;option value="JPD113" selected&gt;JPD113&lt;/option&gt;&lt;option value="PRJ301" &gt;PRJ301&lt;/option&gt;&lt;option value="SWT301" &gt;SWT301&lt;/option&gt;&lt;/select&gt;
  &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Class&lt;/th&gt;&lt;th&gt;Student&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180001&lt;/td&gt;&lt;td&gt;Nguyễn Văn An&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180001&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180001"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180002&lt;/td&gt;&lt;td&gt;Trần Thị Bình&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;4.0&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180002&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180002"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1801&lt;/td&gt;&lt;td&gt;HE180003&lt;/td&gt;&lt;td&gt;Lê Minh Châu&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;6.25&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180003&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180003"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SE1802&lt;/td&gt;&lt;td&gt;HE180004&lt;/td&gt;&lt;td&gt;Phạm Đức Dũng&lt;/td&gt;&lt;td&gt;JPD113&lt;/td&gt;
    &lt;td&gt;5.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;
    &lt;td&gt;&lt;a href="grade/edit?studentId=HE180004&amp;subjectCode=JPD113"&gt;Edit&lt;/a&gt; &lt;form action="grade/delete" method="post"&gt;&lt;input type="hidden" name="studentId" value="HE180004"&gt;
      &lt;input type="hidden" name="subjectCode" value="JPD113"&gt;&lt;button&gt;Delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;4 grade(s)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>JPD113 lúc này: HE180002 có điểm 4.0 (trước là "Not graded"), HE180003 được thêm với 6.25 — hiện đủ hai chữ số nhờ <code>0.0#</code> — và HE180006 đã bị xoá; thông báo flash "Deleted …" hiện một lần.</p>`),
    bi(`<h3>Q4a — statistics with ONE query</h3>
<p>Read the query clause by clause, because each one answers one line of the paper:</p>
<ul>
<li><code>FROM Subject s LEFT JOIN Grade g</code> — start from <em>subjects</em>, so SWT301 (nobody registered) still gets a row; its grade columns are NULL.</li>
<li><code>COUNT(g.studentId)</code> = registered, <code>COUNT(g.score)</code> = graded — <code>COUNT(column)</code> skips NULL; <code>COUNT(*)</code> would count SWT301's empty row as 1 (mistake 4).</li>
<li><code>AVG(g.score)</code> ignores NULL scores by itself; <code>CAST(… AS DECIMAL(4,2))</code> rounds it to 2 decimals in SQL (6.125 → 6.13).</li>
<li><code>SUM(CASE WHEN g.score &gt;= 5 THEN 1 ELSE 0 END)</code> = passed; a NULL score is not &gt;= 5, so it counts 0.</li>
<li><code>GROUP BY s.code, s.name</code> — every non-aggregated column of the SELECT must be in the GROUP BY (mistake 2).</li>
</ul>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/dal/GradeDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Q4a: ONE query. LEFT JOIN keeps a subject with no grade; COUNT(col) skips NULL; AVG skips NULL
public List&lt;SubjectStat&gt; stats() throws SQLException {
    String sql = "SELECT s.code, s.name,"
            + " COUNT(g.studentId) AS registered,"
            + " COUNT(g.score) AS graded,"
            + " CAST(AVG(g.score) AS DECIMAL(4,2)) AS average,"
            + " SUM(CASE WHEN g.score &gt;= 5 THEN 1 ELSE 0 END) AS passed,"
            + " MAX(g.score) AS highest"
            + " FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code"
            + " GROUP BY s.code, s.name"
            + " ORDER BY s.code";
    List&lt;SubjectStat&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            SubjectStat s = new SubjectStat();
            s.setCode(rs.getString("code"));
            s.setName(rs.getString("name"));
            s.setRegistered(rs.getInt("registered"));
            s.setGraded(rs.getInt("graded"));
            s.setAverage(rs.getBigDecimal("average"));     // getBigDecimal keeps NULL as null (getDouble would give 0.0)
            s.setPassed(rs.getInt("passed"));
            s.setHighest(rs.getBigDecimal("highest"));
            list.add(s);
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/model/SubjectStat.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Double getPassRate() {                              // % of the GRADED students; null if nobody is graded (no division by zero)
    return graded == 0 ? null : passed * 100.0 / graded;
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/stats HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Statistics&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Statistics by subject&lt;/h1&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Registered&lt;/th&gt;&lt;th&gt;Graded&lt;/th&gt;&lt;th&gt;Average&lt;/th&gt;&lt;th&gt;Passed&lt;/th&gt;&lt;th&gt;Pass rate&lt;/th&gt;&lt;th&gt;Highest&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202 — Database Systems&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;6.13&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;75.0%&lt;/td&gt;
    &lt;td&gt;8.00&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113 — Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;6.06&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;75.0%&lt;/td&gt;
    &lt;td&gt;9.00&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301 — Java Web Application Development&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;
    &lt;td&gt;6.75&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;83.3%&lt;/td&gt;
    &lt;td&gt;9.50&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWT301 — Software Testing&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;&lt;a href="grades"&gt;Back to grades&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Check one row by hand, as the examiner will: DBI202 has 5 registrations, one NULL (HE180005) ⇒ graded 4: 7.0, 6.5, 3.0, 8.0 ⇒ average 24.5 / 4 = 6.125 → 6.13, passed 3 ⇒ 3 / 4 = 75.0%, highest 8.00. SWT301: 0, 0, and "—" instead of a division by zero.</p>
<h3>Q4b — "my grades": the id comes from the session</h3>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/MyGradesServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Account me = (Account) request.getSession().getAttribute("account");   // the filter guarantees it is not null
    String studentId = me.getStudentId();                  // from the SESSION — never from ?studentId= in the URL
    List&lt;Grade&gt; grades;
    try {
        grades = new GradeDAO().byStudent(studentId);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    BigDecimal points = BigDecimal.ZERO;
    int credits = 0;
    for (Grade g : grades) {
        if (g.getScore() == null) continue;                // not graded ⇒ not in the GPA
        points = points.add(g.getScore().multiply(BigDecimal.valueOf(g.getCredits())));
        credits += g.getCredits();
    }
    request.setAttribute("grades", grades);
    request.setAttribute("gpa", credits == 0 ? null : points.divide(BigDecimal.valueOf(credits), 2, RoundingMode.HALF_UP));
    request.setAttribute("credits", credits);
    request.getRequestDispatcher("/WEB-INF/views/student/grades.jsp").forward(request, response);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Thị Bình (HE180002) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 6 credits): 5.50&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Thị Bình (HE180002) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 6 credits): 5.50&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Văn An (HE180001) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;7.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;8.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 9 credits): 8.17&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>HE180002 adds <code>?studentId=HE180001</code> and still sees her own grades — the servlet never reads that parameter. Her GPA counts only DBI202 and PRJ301 (JPD113 not graded): (6.5 × 3 + 4.5 × 3) / 6 = 5.50. HE180001: (7 × 3 + 9 × 3 + 8.5 × 3) / 9 = 8.17 (rounded <code>HALF_UP</code> with <code>divide(…, 2, RoundingMode.HALF_UP)</code>).</p>`,
    `<h3>Câu 4a — thống kê bằng MỘT câu truy vấn</h3>
<p>Đọc câu truy vấn từng mệnh đề, vì mỗi mệnh đề trả lời một dòng của đề:</p>
<ul>
<li><code>FROM Subject s LEFT JOIN Grade g</code> — bắt đầu từ <em>môn học</em>, nên SWT301 (chưa ai đăng ký) vẫn có một dòng; các cột điểm của nó là NULL.</li>
<li><code>COUNT(g.studentId)</code> = số đăng ký, <code>COUNT(g.score)</code> = số đã chấm — <code>COUNT(cột)</code> bỏ qua NULL; <code>COUNT(*)</code> sẽ đếm dòng rỗng của SWT301 thành 1 (lỗi 4).</li>
<li><code>AVG(g.score)</code> tự bỏ qua điểm NULL; <code>CAST(… AS DECIMAL(4,2))</code> làm tròn còn 2 chữ số ngay trong SQL (6.125 → 6.13).</li>
<li><code>SUM(CASE WHEN g.score &gt;= 5 THEN 1 ELSE 0 END)</code> = số đậu; điểm NULL không &gt;= 5, nên được tính 0.</li>
<li><code>GROUP BY s.code, s.name</code> — mọi cột không nằm trong hàm gộp ở SELECT đều phải có trong GROUP BY (lỗi 2).</li>
</ul>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/dal/GradeDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Câu 4a: MỘT câu truy vấn. LEFT JOIN giữ môn chưa có điểm; COUNT(cột) bỏ qua NULL; AVG bỏ qua NULL
public List&lt;SubjectStat&gt; stats() throws SQLException {
    String sql = "SELECT s.code, s.name,"
            + " COUNT(g.studentId) AS registered,"
            + " COUNT(g.score) AS graded,"
            + " CAST(AVG(g.score) AS DECIMAL(4,2)) AS average,"
            + " SUM(CASE WHEN g.score &gt;= 5 THEN 1 ELSE 0 END) AS passed,"
            + " MAX(g.score) AS highest"
            + " FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code"
            + " GROUP BY s.code, s.name"
            + " ORDER BY s.code";
    List&lt;SubjectStat&gt; list = new ArrayList&lt;&gt;();
    try (Connection con = getConnection();
         PreparedStatement ps = con.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            SubjectStat s = new SubjectStat();
            s.setCode(rs.getString("code"));
            s.setName(rs.getString("name"));
            s.setRegistered(rs.getInt("registered"));
            s.setGraded(rs.getInt("graded"));
            s.setAverage(rs.getBigDecimal("average"));     // getBigDecimal giữ NULL là null (getDouble sẽ cho 0.0)
            s.setPassed(rs.getInt("passed"));
            s.setHighest(rs.getBigDecimal("highest"));
            list.add(s);
        }
    }
    return list;
}</code></pre>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/model/SubjectStat.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Double getPassRate() {                              // % trên số ĐÃ CÓ ĐIỂM; null nếu chưa ai có điểm (không chia cho 0)
    return graded == 0 ? null : passed * 100.0 / graded;
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/teacher/stats HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Statistics&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Statistics by subject&lt;/h1&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Registered&lt;/th&gt;&lt;th&gt;Graded&lt;/th&gt;&lt;th&gt;Average&lt;/th&gt;&lt;th&gt;Passed&lt;/th&gt;&lt;th&gt;Pass rate&lt;/th&gt;&lt;th&gt;Highest&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202 — Database Systems&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;6.13&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;75.0%&lt;/td&gt;
    &lt;td&gt;8.00&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113 — Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;
    &lt;td&gt;6.06&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;
    &lt;td&gt;75.0%&lt;/td&gt;
    &lt;td&gt;9.00&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301 — Java Web Application Development&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;
    &lt;td&gt;6.75&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;
    &lt;td&gt;83.3%&lt;/td&gt;
    &lt;td&gt;9.50&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWT301 — Software Testing&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;&lt;td&gt;0&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;
    &lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;&lt;a href="grades"&gt;Back to grades&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Kiểm tay một dòng, như người chấm sẽ làm: DBI202 có 5 lượt đăng ký, một NULL (HE180005) ⇒ đã chấm 4: 7.0, 6.5, 3.0, 8.0 ⇒ trung bình 24.5 / 4 = 6.125 → 6.13, đậu 3 ⇒ 3 / 4 = 75.0%, cao nhất 8.00. SWT301: 0, 0, và "—" thay vì chia cho 0.</p>
<h3>Câu 4b — "điểm của tôi": mã lấy từ session</h3>
<p class="ghi-chu">📄 <code>pe3-diem/src/main/java/controller/MyGradesServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Account me = (Account) request.getSession().getAttribute("account");   // filter đảm bảo nó không null
    String studentId = me.getStudentId();                  // lấy từ SESSION — không bao giờ từ ?studentId= trên URL
    List&lt;Grade&gt; grades;
    try {
        grades = new GradeDAO().byStudent(studentId);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    BigDecimal points = BigDecimal.ZERO;
    int credits = 0;
    for (Grade g : grades) {
        if (g.getScore() == null) continue;                // chưa có điểm ⇒ không tính vào trung bình
        points = points.add(g.getScore().multiply(BigDecimal.valueOf(g.getCredits())));
        credits += g.getCredits();
    }
    request.setAttribute("grades", grades);
    request.setAttribute("gpa", credits == 0 ? null : points.divide(BigDecimal.valueOf(credits), 2, RoundingMode.HALF_UP));
    request.setAttribute("credits", credits);
    request.getRequestDispatcher("/WEB-INF/views/student/grades.jsp").forward(request, response);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Thị Bình (HE180002) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 6 credits): 5.50&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Trần Thị Bình (HE180002) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;6.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;Not graded&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;4.5&lt;/td&gt;&lt;td&gt;Fail&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 6 credits): 5.50&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-diem/student/grades HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;My grades&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Welcome, Nguyễn Văn An (HE180001) | &lt;a href="../logout"&gt;Logout&lt;/a&gt;&lt;/p&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Subject&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Credits&lt;/th&gt;&lt;th&gt;Score&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;DBI202&lt;/td&gt;&lt;td&gt;Database Systems&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;7.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;JPD113&lt;/td&gt;&lt;td&gt;Elementary Japanese 1-A1.1&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PRJ301&lt;/td&gt;&lt;td&gt;Java Web Application Development&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;8.5&lt;/td&gt;&lt;td&gt;Pass&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;GPA (graded subjects only, 9 credits): 8.17&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>HE180002 thêm <code>?studentId=HE180001</code> mà vẫn chỉ thấy điểm của mình — servlet không bao giờ đọc tham số đó. GPA của bạn ấy chỉ tính DBI202 và PRJ301 (JPD113 chưa chấm): (6.5 × 3 + 4.5 × 3) / 6 = 5.50. HE180001: (7 × 3 + 9 × 3 + 8.5 × 3) / 9 = 8.17 (làm tròn kiểu <code>HALF_UP</code> bằng <code>divide(…, 2, RoundingMode.HALF_UP)</code>).</p>`),
    bi(`<h2>🧮 Self-marking guide (10 points)</h2>
<p>Written for this mock paper (no official guide is published). Private window; SSMS open.</p>
<table>
<thead><tr><th>Q</th><th>What the examiner does</th><th>Expected</th><th>Points</th></tr></thead>
<tbody>
<tr><td>1</td><td>wrong password</td><td>message on the same page</td><td>0.25</td></tr>
<tr><td>1</td><td><code>giaovien</code> / <code>he180002</code> log in</td><td>302 → <code>/teacher/grades</code> / <code>/student/grades</code></td><td>0.5</td></tr>
<tr><td>1</td><td>Logout</td><td>302 → <code>/login</code>; protected pages redirect again</td><td>0.25</td></tr>
<tr><td>1</td><td><code>/teacher/stats</code> with no session</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1</td><td>student opens <code>/teacher/grades</code>, POSTs a delete; teacher opens <code>/student/grades</code></td><td>403 each time, nothing deleted</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/teacher/grades</code></td><td>class/student order, names, 8.5 / 7.0 style, "Not graded" with an EMPTY score</td><td>1.0</td></tr>
<tr><td>2</td><td>keyword <code>thị</code>, keyword <code>HE18000</code></td><td>Trần Thị Bình's 3 rows / all</td><td>0.5</td></tr>
<tr><td>2</td><td>class SE1802 + PRJ301</td><td>3 rows; drop-downs keep the choice</td><td>0.5</td></tr>
<tr><td>2</td><td>keyword <code>HE19</code></td><td>"No grades found.", keyword kept</td><td>0.5</td></tr>
<tr><td>3</td><td>add HE180003 / PRJ301 / "8,5"</td><td>"already has a grade" + score message</td><td>0.5</td></tr>
<tr><td>3</td><td>add with no student, score 11</td><td>two messages, subject kept</td><td>0.5</td></tr>
<tr><td>3</td><td>add HE180003 / JPD113 / 6.25</td><td>302, "Saved" once, row in SSMS</td><td>0.25</td></tr>
<tr><td>3</td><td>edit HE180002 / JPD113 to 4</td><td>Fail, row updated</td><td>0.75</td></tr>
<tr><td>3</td><td>delete HE180006 / JPD113</td><td>row gone</td><td>0.5</td></tr>
<tr><td>4a</td><td><code>/teacher/stats</code></td><td>4 subjects incl. SWT301 (0, 0, —); DBI202 5/4/6.13/3/75.0%/8.00</td><td>1.5</td></tr>
<tr><td>4a</td><td>open the DAO</td><td>ONE query with GROUP BY, no Java loops over grades</td><td>0.5</td></tr>
<tr><td>4b</td><td><code>he180002</code> → <code>/student/grades?studentId=HE180001</code></td><td>still her own 3 subjects; GPA 5.50</td><td>1.0</td></tr>
</tbody>
</table>`,
    `<h2>🧮 Barem tự chấm (10 điểm)</h2>
<p>Soạn riêng cho đề mô phỏng này (không có barem chính thức được công bố). Cửa sổ ẩn danh; mở sẵn SSMS.</p>
<table>
<thead><tr><th>Câu</th><th>Người chấm làm gì</th><th>Kết quả đúng</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>1</td><td>sai mật khẩu</td><td>thông báo ngay trang đó</td><td>0.25</td></tr>
<tr><td>1</td><td><code>giaovien</code> / <code>he180002</code> đăng nhập</td><td>302 → <code>/teacher/grades</code> / <code>/student/grades</code></td><td>0.5</td></tr>
<tr><td>1</td><td>Logout</td><td>302 → <code>/login</code>; trang cần bảo vệ lại chuyển hướng</td><td>0.25</td></tr>
<tr><td>1</td><td><code>/teacher/stats</code> khi không có session</td><td>302 → <code>/login</code></td><td>0.5</td></tr>
<tr><td>1</td><td>sinh viên mở <code>/teacher/grades</code>, POST xoá; giáo viên mở <code>/student/grades</code></td><td>lần nào cũng 403, không xoá gì</td><td>0.5</td></tr>
<tr><td>2</td><td><code>/teacher/grades</code></td><td>thứ tự lớp/mã SV, có tên, kiểu 8.5 / 7.0, "Not graded" với ô điểm TRỐNG</td><td>1.0</td></tr>
<tr><td>2</td><td>từ khoá <code>thị</code>, từ khoá <code>HE18000</code></td><td>3 dòng của Trần Thị Bình / tất cả</td><td>0.5</td></tr>
<tr><td>2</td><td>lớp SE1802 + PRJ301</td><td>3 dòng; ô chọn giữ lựa chọn</td><td>0.5</td></tr>
<tr><td>2</td><td>từ khoá <code>HE19</code></td><td>"No grades found.", giữ từ khoá</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm HE180003 / PRJ301 / "8,5"</td><td>"already has a grade" + thông báo điểm</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm không chọn sinh viên, điểm 11</td><td>hai thông báo, giữ môn đã chọn</td><td>0.5</td></tr>
<tr><td>3</td><td>thêm HE180003 / JPD113 / 6.25</td><td>302, "Saved" hiện một lần, có dòng trong SSMS</td><td>0.25</td></tr>
<tr><td>3</td><td>sửa HE180002 / JPD113 thành 4</td><td>Fail, dòng được cập nhật</td><td>0.75</td></tr>
<tr><td>3</td><td>xoá HE180006 / JPD113</td><td>dòng biến mất</td><td>0.5</td></tr>
<tr><td>4a</td><td><code>/teacher/stats</code></td><td>4 môn kể cả SWT301 (0, 0, —); DBI202 5/4/6.13/3/75.0%/8.00</td><td>1.5</td></tr>
<tr><td>4a</td><td>mở DAO</td><td>MỘT câu truy vấn có GROUP BY, không lặp điểm trong Java</td><td>0.5</td></tr>
<tr><td>4b</td><td><code>he180002</code> → <code>/student/grades?studentId=HE180001</code></td><td>vẫn là 3 môn của chính bạn ấy; GPA 5.50</td><td>1.0</td></tr>
</tbody>
</table>`),
    bi(`<h2>🪤 Ten mistakes that cost marks — each one run for real</h2>
<p>Lab app <code>pe3-loi</code>, a small copy of the grade tables (PRJ301: 8.5, 4.5, 7.0; DBI202: 7.0 and one NULL; SWT301: nobody) plus a table <code>MarkInt</code> that stores two scores, 7 and 8, in an <code>INT</code> column.</p>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>What you see</th><th>Fix</th><th>Marks at risk</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>AVG</code> on an INT column (or int / int in Java)</td><td>7 instead of 7.5</td><td><code>AVG(col * 1.0)</code>, a DECIMAL column, or a <code>double</code> division</td><td>Q4a</td></tr>
<tr><td>2</td><td>a SELECT column missing from GROUP BY</td><td>500 "is invalid in the select list…"</td><td>list every non-aggregated column in GROUP BY</td><td>Q4a</td></tr>
<tr><td>3</td><td><code>INNER JOIN</code> for statistics</td><td>the subject with no grades disappears</td><td><code>Subject LEFT JOIN Grade</code></td><td>Q4a</td></tr>
<tr><td>4</td><td><code>COUNT(*)</code> after a LEFT JOIN</td><td>a subject with nobody shows 1 registered</td><td><code>COUNT(g.studentId)</code>, <code>COUNT(g.score)</code></td><td>Q4a</td></tr>
<tr><td>5</td><td><code>getDouble</code> on a NULL score</td><td>0.0 → "Fail" for a student not graded</td><td><code>getBigDecimal</code> / <code>getObject</code>, keep <code>null</code></td><td>Q2</td></tr>
<tr><td>6</td><td>student id read from <code>?studentId=</code></td><td>any student reads anyone's grades</td><td>take the id from the session</td><td>Q4b</td></tr>
<tr><td>7</td><td>role "checked" by hiding a button</td><td>a student's raw POST deletes a grade</td><td>role check in the Filter (or servlet)</td><td>Q1</td></tr>
<tr><td>8</td><td><code>Double.parseDouble("8,5")</code></td><td>500 NumberFormatException</td><td>validate the text first, show a message</td><td>Q3</td></tr>
<tr><td>9</td><td><code>fmt:formatNumber</code> without a locale</td><td>raw 83.33333333333333, or "83,3" / "6,2" on a Vietnamese browser</td><td><code>fmt:setLocale</code> + a pattern like <code>0.0#</code></td><td>Q2/Q4a</td></tr>
<tr><td>10</td><td>EL property with no matching getter</td><td>500 PropertyNotFoundException</td><td>name the getter after the property (<code>getScore()</code>)</td><td>the page</td></tr>
</tbody>
</table>
<h3>1 — integer average</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/avg-int":                               // INT column ⇒ INT average (7 and 8 ⇒ 7)
    sql = "SELECT AVG(point) AS avg_int, AVG(point * 1.0) AS avg_decimal, SUM(point) / COUNT(*) AS java_style FROM MarkInt";
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/avg-int HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 46

avg_int=7  avg_decimal=7.500000  java_style=7</code></pre>
<p>SQL Server returns the average of an <code>INT</code> column as an <code>INT</code>: (7 + 8) / 2 = 7, the .5 is cut, not rounded. Java does the same with <code>int / int</code>. Multiply by <code>1.0</code> (or store scores as <code>DECIMAL</code>, as the paper's script does).</p>
<h3>2 — GROUP BY without every column</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/group-by":                              // s.name is in SELECT but not in GROUP BY
    sql = "SELECT s.code, s.name, AVG(g.score) AS average FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/group-by HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8
Content-Language: en
Content-Length: 2848

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: Column 'Subject.name' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: Column 'Subject.name' is invalid in the select list because it is not contained in either an aggregate function or th … (+18 chars / ký tự)
loi.SqlServlet.doGet(SqlServlet.java:80)
… (20 more lines / còn 20 dòng)</code></pre>
<h3>3 and 4 — INNER JOIN loses rows, COUNT(*) invents one</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/inner-join":                            // INNER JOIN keeps only subjects that HAVE grades
    sql = "SELECT s.code, COUNT(g.studentId) AS registered FROM Subject s INNER JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code ORDER BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/inner-join HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 52

code=DBI202  registered=2
code=PRJ301  registered=3</code></pre>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/count-sao":                             // COUNT(*) counts the NULL row LEFT JOIN makes for a subject with no grade
    sql = "SELECT s.code, COUNT(*) AS registered, COUNT(*) AS graded FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code ORDER BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/count-sao HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 108

code=DBI202  registered=2  graded=2
code=PRJ301  registered=3  graded=3
code=SWT301  registered=1  graded=1</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/dung/thong-ke HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 150

code=DBI202  registered=2  graded=1  average=7.00
code=PRJ301  registered=3  graded=3  average=6.67
code=SWT301  registered=0  graded=0  average=null</code></pre>
<p>With INNER JOIN SWT301 vanishes — the paper said ALL subjects. With LEFT JOIN + <code>COUNT(*)</code> it is back, but with "1 registered, 1 graded": the NULL row produced by the join is still a row. And DBI202 "graded = 2" counts the NULL score too. The right version counts columns: 0/0 for SWT301, 2 registered / 1 graded for DBI202.</p>
<h3>5 — <code>getDouble</code> turns NULL into 0</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement("SELECT studentId, score FROM Grade WHERE subjectCode = 'DBI202' ORDER BY studentId");
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        double d = rs.getDouble("score");      // NULL ⇒ 0.0, silently
        String wrong = d &gt;= 5 ? "Pass" : "Fail";
        java.math.BigDecimal b = rs.getBigDecimal("score");   // NULL ⇒ null
        String right = b == null ? "Not graded" : (b.doubleValue() &gt;= 5 ? "Pass" : "Fail");
        out.println(rs.getString("studentId") + "  getDouble=" + d + " → " + wrong + "   |   getBigDecimal=" + b + " → " + right);
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/null-double HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 140

HE180001  getDouble=7.0 → Pass   |   getBigDecimal=7.00 → Pass
HE180002  getDouble=0.0 → Fail   |   getBigDecimal=null → Not graded</code></pre>
<h3>6 — trusting the URL (IDOR)</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/QuyenServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String studentId = request.getServletPath().equals("/yeu/diem")
        ? request.getParameter("studentId")            // WRONG: whoever types ?studentId=… reads it
        : me.getStudentId();                           // RIGHT: who you are comes from the session</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-loi/dang-nhap-sv HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe3-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 32

logged in as he180002 (STUDENT)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/yeu/diem?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

he180002 reads grades of HE180001: DBI202=7.00 PRJ301=8.50</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/chac/diem?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

he180002 reads grades of HE180002: DBI202=null PRJ301=4.50</code></pre>
<p>The student he180002 reads HE180001's grades just by typing the id. This bug has a name — <strong>IDOR</strong>, Insecure Direct Object Reference — and it is in the OWASP Top 10 under "Broken Access Control". The rule: who you are comes from the session; the URL may only choose among things you are allowed to see.</p>
<h3>7 — hiding the button is not access control</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/QuyenServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// /yeu/xoa: the JSP shows the Delete button only to teachers, and NOTHING here checks the role
try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement("DELETE FROM Grade WHERE studentId = ? AND subjectCode = ?")) {
    ps.setString(1, request.getParameter("studentId"));
    ps.setString(2, request.getParameter("subjectCode"));
    Account me = (Account) request.getSession().getAttribute("account");
    response.getWriter().println(me.getUsername() + " (" + me.getRole() + ") deleted " + ps.executeUpdate() + " grade(s)");
} catch (SQLException e) {
    throw new ServletException(e);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /pe3-loi/yeu/xoa HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

studentId=HE180002&amp;subjectCode=PRJ301</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

he180002 (STUDENT) deleted 1 grade(s)</code></pre>
<p>This lab's Filter only checks "logged in". The JSP showed Delete to teachers only, so the developer felt safe — and a student's raw POST deleted a grade. The solution's RoleFilter answers 403 to the same request (Q1 above).</p>
<h3>8 — <code>parseDouble("8,5")</code></h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/HienThiServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">double score = Double.parseDouble(request.getParameter("score"));   // "8,5" ⇒ NumberFormatException ⇒ 500
boolean ok = score &gt;= 0 &amp;&amp; score &lt;= 10;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/parse?score=8%2C5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1418

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message For input string: "8,5"
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NumberFormatException: For input string: "8,5"
java.base/jdk.internal.math.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:2054)
java.base/jdk.internal.math.FloatingDecimal.parseDouble(FloatingDecimal.java:110)
… (7 more lines / còn 7 dòng)</code></pre>
<p>Vietnamese users type a decimal comma. <code>Double.parseDouble</code> accepts only a dot and throws. Check the text with a pattern first and answer with a message (the solution's <code>scoreValue()</code>).</p>
<h3>9 — <code>fmt:formatNumber</code> depends on the locale — and rounds "half-even"</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/webapp/WEB-INF/views/dinh-dang-sai.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">raw EL: &#36;{rate}
formatNumber, no locale set: &lt;fmt:formatNumber value="&#36;{rate}" maxFractionDigits="1"/&gt;
pattern 0.0 on 6.25 and 6.35: &lt;fmt:formatNumber value="&#36;{a}" pattern="0.0"/&gt; and &lt;fmt:formatNumber value="&#36;{b}" pattern="0.0"/&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/dinh-dang HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 117


raw EL: 83.33333333333333
formatNumber, no locale set: 83.33333333333333
pattern 0.0 on 6.25 and 6.35: 6.25 and 6.35</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/dinh-dang HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Language: vi-VN
Content-Length: 102


raw EL: 83.33333333333333
formatNumber, no locale set: 83,3
pattern 0.0 on 6.25 and 6.35: 6,2 and 6,4</code></pre>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/webapp/WEB-INF/views/dinh-dang-dung.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;fmt:setLocale value="en_US"/&gt;
formatNumber, locale en_US: &lt;fmt:formatNumber value="&#36;{rate}" maxFractionDigits="1"/&gt;
pattern 0.0# on 6.25 and 6.35: &lt;fmt:formatNumber value="&#36;{a}" pattern="0.0#"/&gt; and &lt;fmt:formatNumber value="&#36;{b}" pattern="0.0#"/&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/dung/dinh-dang HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Language: en-US
Content-Length: 78


formatNumber, locale en_US: 83.3
pattern 0.0# on 6.25 and 6.35: 6.25 and 6.35</code></pre>
<p>Three surprises, all measured. (1) With no <code>fmt:setLocale</code>, JSTL takes the locale from the browser's <code>Accept-Language</code> header; a request without it (a test tool, some graders' scripts) gets the number back unformatted. (2) A Vietnamese browser gets <code>83,3</code> and <code>6,2</code> — a comma, so a page that looked fine on your English Windows looks different on the examiner's. (3) <code>pattern="0.0"</code> printed 6.25 as <strong>6,2</strong> but 6.35 as <strong>6,4</strong>: Java's <code>DecimalFormat</code> rounds HALF_EVEN ("banker's rounding" — a 5 goes to the even neighbour). Fix the locale on the page, and choose a pattern that does not need rounding for scores (<code>0.0#</code>), or round in SQL/Java with HALF_UP before printing.</p>
<h3>10 — EL reads getters, not fields</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/model/GradeRow.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.math.BigDecimal;

// Mistake 10: the field is "score" but the getter is getPoint() — EL reads GETTERS, not fields
public class GradeRow {
    private final BigDecimal score;

    public GradeRow(BigDecimal score) { this.score = score; }

    public BigDecimal getPoint() { return score; }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/getter HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3311

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message An exception occurred processing [/WEB-INF/views/getter.jsp] at line [2]
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
org.apache.jasper.JasperException: An exception occurred processing [/WEB-INF/views/getter.jsp] at line [2]
1: &lt;%@ page contentType="text/plain;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
2: score: &#36;{g.score}
Stacktrace:
org.apache.jasper.servlet.JspServletWrapper.handleJspException(JspServletWrapper.java:651)
org.apache.jasper.servlet.JspServletWrapper.service(JspServletWrapper.java:528)
org.apache.jasper.servlet.JspServlet.serviceJspFile(JspServlet.java:359)
org.apache.jasper.servlet.JspServlet.service(JspServlet.java:310)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
loi.HienThiServlet.doGet(HienThiServlet.java:29)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
jakarta.el.PropertyNotFoundException: Property [score] not found on type [model.GradeRow]
… (21 more lines / còn 21 dòng)</code></pre>
<p><code>&#36;{g.score}</code> means "call <code>getScore()</code>" (or <code>isScore()</code> for a boolean). The private field's name does not matter. NetBeans' <kbd>Alt</kbd>+<kbd>Insert</kbd> → Getter generates matching names — use it instead of typing getters by hand.</p>`,
    `<h2>🪤 Mười lỗi làm mất điểm — lỗi nào cũng chạy thật</h2>
<p>App thí nghiệm <code>pe3-loi</code>, bản thu nhỏ các bảng điểm (PRJ301: 8.5, 4.5, 7.0; DBI202: 7.0 và một NULL; SWT301: chưa ai học) cộng thêm bảng <code>MarkInt</code> lưu hai điểm 7 và 8 trong một cột <code>INT</code>.</p>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Bạn thấy gì</th><th>Cách sửa</th><th>Điểm có thể mất</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>AVG</code> trên cột INT (hoặc int / int trong Java)</td><td>7 thay vì 7.5</td><td><code>AVG(col * 1.0)</code>, cột DECIMAL, hoặc chia kiểu <code>double</code></td><td>Câu 4a</td></tr>
<tr><td>2</td><td>cột ở SELECT thiếu trong GROUP BY</td><td>500 "is invalid in the select list…"</td><td>liệt kê mọi cột không gộp vào GROUP BY</td><td>Câu 4a</td></tr>
<tr><td>3</td><td><code>INNER JOIN</code> cho thống kê</td><td>môn chưa có điểm biến mất</td><td><code>Subject LEFT JOIN Grade</code></td><td>Câu 4a</td></tr>
<tr><td>4</td><td><code>COUNT(*)</code> sau LEFT JOIN</td><td>môn chưa ai học hiện 1 đăng ký</td><td><code>COUNT(g.studentId)</code>, <code>COUNT(g.score)</code></td><td>Câu 4a</td></tr>
<tr><td>5</td><td><code>getDouble</code> trên điểm NULL</td><td>0.0 → "Fail" cho người chưa được chấm</td><td><code>getBigDecimal</code> / <code>getObject</code>, giữ <code>null</code></td><td>Câu 2</td></tr>
<tr><td>6</td><td>mã SV đọc từ <code>?studentId=</code></td><td>sinh viên nào cũng đọc được điểm của người khác</td><td>lấy mã từ session</td><td>Câu 4b</td></tr>
<tr><td>7</td><td>"kiểm" vai trò bằng cách giấu nút</td><td>POST thô của sinh viên xoá được điểm</td><td>kiểm vai trò trong Filter (hoặc servlet)</td><td>Câu 1</td></tr>
<tr><td>8</td><td><code>Double.parseDouble("8,5")</code></td><td>500 NumberFormatException</td><td>kiểm chuỗi trước, báo lỗi</td><td>Câu 3</td></tr>
<tr><td>9</td><td><code>fmt:formatNumber</code> không đặt locale</td><td>ra nguyên 83.33333333333333, hoặc "83,3" / "6,2" trên trình duyệt tiếng Việt</td><td><code>fmt:setLocale</code> + pattern kiểu <code>0.0#</code></td><td>Câu 2/4a</td></tr>
<tr><td>10</td><td>thuộc tính EL không có getter khớp tên</td><td>500 PropertyNotFoundException</td><td>đặt tên getter theo thuộc tính (<code>getScore()</code>)</td><td>cả trang</td></tr>
</tbody>
</table>
<h3>1 — trung bình số nguyên</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/avg-int":                               // cột INT ⇒ trung bình INT (7 và 8 ⇒ 7)
    sql = "SELECT AVG(point) AS avg_int, AVG(point * 1.0) AS avg_decimal, SUM(point) / COUNT(*) AS java_style FROM MarkInt";
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/avg-int HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 46

avg_int=7  avg_decimal=7.500000  java_style=7</code></pre>
<p>SQL Server trả trung bình của cột <code>INT</code> dưới dạng <code>INT</code>: (7 + 8) / 2 = 7, phần .5 bị cắt, không làm tròn. Java cũng thế với <code>int / int</code>. Nhân với <code>1.0</code> (hoặc lưu điểm bằng <code>DECIMAL</code>, như script của đề).</p>
<h3>2 — GROUP BY thiếu cột</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/group-by":                              // s.name có trong SELECT mà không có trong GROUP BY
    sql = "SELECT s.code, s.name, AVG(g.score) AS average FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/group-by HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8
Content-Language: en
Content-Length: 2848

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message com.microsoft.sqlserver.jdbc.SQLServerException: Column 'Subject.name' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
jakarta.servlet.ServletException: com.microsoft.sqlserver.jdbc.SQLServerException: Column 'Subject.name' is invalid in the select list because it is not contained in either an aggregate function or th … (+18 chars / ký tự)
loi.SqlServlet.doGet(SqlServlet.java:80)
… (20 more lines / còn 20 dòng)</code></pre>
<h3>3 và 4 — INNER JOIN làm mất dòng, COUNT(*) bịa thêm một dòng</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/inner-join":                            // INNER JOIN chỉ giữ môn ĐÃ CÓ điểm
    sql = "SELECT s.code, COUNT(g.studentId) AS registered FROM Subject s INNER JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code ORDER BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/inner-join HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 52

code=DBI202  registered=2
code=PRJ301  registered=3</code></pre>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/loi/count-sao":                             // COUNT(*) đếm cả dòng NULL mà LEFT JOIN tạo ra cho môn chưa có điểm
    sql = "SELECT s.code, COUNT(*) AS registered, COUNT(*) AS graded FROM Subject s LEFT JOIN Grade g ON g.subjectCode = s.code GROUP BY s.code ORDER BY s.code";
    break;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/count-sao HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 108

code=DBI202  registered=2  graded=2
code=PRJ301  registered=3  graded=3
code=SWT301  registered=1  graded=1</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/dung/thong-ke HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 150

code=DBI202  registered=2  graded=1  average=7.00
code=PRJ301  registered=3  graded=3  average=6.67
code=SWT301  registered=0  graded=0  average=null</code></pre>
<p>Với INNER JOIN, SWT301 biến mất — trong khi đề ghi ĐỦ mọi môn. Với LEFT JOIN + <code>COUNT(*)</code> nó quay lại, nhưng với "1 đăng ký, 1 đã chấm": dòng NULL do phép nối sinh ra vẫn là một dòng. Còn DBI202 "đã chấm = 2" đếm luôn điểm NULL. Bản đúng đếm theo cột: 0/0 cho SWT301, 2 đăng ký / 1 đã chấm cho DBI202.</p>
<h3>5 — <code>getDouble</code> biến NULL thành 0</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/SqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement("SELECT studentId, score FROM Grade WHERE subjectCode = 'DBI202' ORDER BY studentId");
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        double d = rs.getDouble("score");      // NULL ⇒ 0.0, không báo gì
        String wrong = d &gt;= 5 ? "Pass" : "Fail";
        java.math.BigDecimal b = rs.getBigDecimal("score");   // NULL ⇒ null
        String right = b == null ? "Not graded" : (b.doubleValue() &gt;= 5 ? "Pass" : "Fail");
        out.println(rs.getString("studentId") + "  getDouble=" + d + " → " + wrong + "   |   getBigDecimal=" + b + " → " + right);
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/null-double HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 140

HE180001  getDouble=7.0 → Pass   |   getBigDecimal=7.00 → Pass
HE180002  getDouble=0.0 → Fail   |   getBigDecimal=null → Not graded</code></pre>
<h3>6 — tin vào URL (IDOR)</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/QuyenServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String studentId = request.getServletPath().equals("/yeu/diem")
        ? request.getParameter("studentId")            // SAI: ai gõ ?studentId=… cũng đọc được
        : me.getStudentId();                           // ĐÚNG: bạn là ai lấy từ session</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-loi/dang-nhap-sv HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/pe3-loi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 32

logged in as he180002 (STUDENT)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/yeu/diem?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

he180002 reads grades of HE180001: DBI202=7.00 PRJ301=8.50</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/chac/diem?studentId=HE180001 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

he180002 reads grades of HE180002: DBI202=null PRJ301=4.50</code></pre>
<p>Sinh viên he180002 đọc được điểm của HE180001 chỉ bằng cách gõ mã. Lỗi này có tên — <strong>IDOR</strong> (Insecure Direct Object Reference: tham chiếu trực tiếp tới đối tượng mà không kiểm quyền) — và nằm trong OWASP Top 10, nhóm "Broken Access Control". Luật: bạn là ai thì lấy từ session; URL chỉ được chọn trong số những thứ bạn được phép xem.</p>
<h3>7 — giấu nút không phải là phân quyền</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/QuyenServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// /yeu/xoa: JSP chỉ hiện nút Xoá cho giáo viên, và Ở ĐÂY không có gì kiểm vai trò
try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement("DELETE FROM Grade WHERE studentId = ? AND subjectCode = ?")) {
    ps.setString(1, request.getParameter("studentId"));
    ps.setString(2, request.getParameter("subjectCode"));
    Account me = (Account) request.getSession().getAttribute("account");
    response.getWriter().println(me.getUsername() + " (" + me.getRole() + ") deleted " + ps.executeUpdate() + " grade(s)");
} catch (SQLException e) {
    throw new ServletException(e);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /pe3-loi/yeu/xoa HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 37

studentId=HE180002&amp;subjectCode=PRJ301</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

he180002 (STUDENT) deleted 1 grade(s)</code></pre>
<p>Filter của app thí nghiệm này chỉ kiểm "đã đăng nhập". JSP chỉ hiện nút Delete cho giáo viên, nên người viết thấy yên tâm — và một POST thô của sinh viên đã xoá được điểm. RoleFilter của lời giải trả 403 cho đúng request đó (Câu 1 ở trên).</p>
<h3>8 — <code>parseDouble("8,5")</code></h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/loi/HienThiServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">double score = Double.parseDouble(request.getParameter("score"));   // "8,5" ⇒ NumberFormatException ⇒ 500
boolean ok = score &gt;= 0 &amp;&amp; score &lt;= 10;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/parse?score=8%2C5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1418

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message For input string: "8,5"
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.NumberFormatException: For input string: "8,5"
java.base/jdk.internal.math.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:2054)
java.base/jdk.internal.math.FloatingDecimal.parseDouble(FloatingDecimal.java:110)
… (7 more lines / còn 7 dòng)</code></pre>
<p>Người dùng Việt gõ dấu phẩy thập phân. <code>Double.parseDouble</code> chỉ nhận dấu chấm và ném lỗi. Kiểm chuỗi bằng một mẫu (pattern) trước rồi trả lời bằng thông báo (hàm <code>scoreValue()</code> của lời giải).</p>
<h3>9 — <code>fmt:formatNumber</code> phụ thuộc locale — và làm tròn "về số chẵn"</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/webapp/WEB-INF/views/dinh-dang-sai.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">raw EL: &#36;{rate}
formatNumber, no locale set: &lt;fmt:formatNumber value="&#36;{rate}" maxFractionDigits="1"/&gt;
pattern 0.0 on 6.25 and 6.35: &lt;fmt:formatNumber value="&#36;{a}" pattern="0.0"/&gt; and &lt;fmt:formatNumber value="&#36;{b}" pattern="0.0"/&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/dinh-dang HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 117


raw EL: 83.33333333333333
formatNumber, no locale set: 83.33333333333333
pattern 0.0 on 6.25 and 6.35: 6.25 and 6.35</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/dinh-dang HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Language: vi-VN
Content-Length: 102


raw EL: 83.33333333333333
formatNumber, no locale set: 83,3
pattern 0.0 on 6.25 and 6.35: 6,2 and 6,4</code></pre>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/webapp/WEB-INF/views/dinh-dang-dung.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;fmt:setLocale value="en_US"/&gt;
formatNumber, locale en_US: &lt;fmt:formatNumber value="&#36;{rate}" maxFractionDigits="1"/&gt;
pattern 0.0# on 6.25 and 6.35: &lt;fmt:formatNumber value="&#36;{a}" pattern="0.0#"/&gt; and &lt;fmt:formatNumber value="&#36;{b}" pattern="0.0#"/&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/dung/dinh-dang HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Language: en-US
Content-Length: 78


formatNumber, locale en_US: 83.3
pattern 0.0# on 6.25 and 6.35: 6.25 and 6.35</code></pre>
<p>Ba điều bất ngờ, đều đã đo. (1) Không có <code>fmt:setLocale</code>, JSTL lấy locale từ header <code>Accept-Language</code> của trình duyệt; một request không có header đó (công cụ thử, script chấm của một số người) nhận lại con số chưa định dạng. (2) Trình duyệt tiếng Việt nhận <code>83,3</code> và <code>6,2</code> — dấu phẩy, nên một trang trông ổn trên Windows tiếng Anh của bạn sẽ khác trên máy người chấm. (3) <code>pattern="0.0"</code> in 6.25 thành <strong>6,2</strong> nhưng 6.35 thành <strong>6,4</strong>: <code>DecimalFormat</code> của Java làm tròn HALF_EVEN ("làm tròn kiểu ngân hàng" — số 5 đi về phía chữ số chẵn gần nhất). Chốt locale ngay trên trang, và chọn pattern không cần làm tròn với điểm số (<code>0.0#</code>), hoặc làm tròn HALF_UP trong SQL/Java trước khi in.</p>
<h3>10 — EL đọc getter, không đọc trường</h3>
<p class="ghi-chu">📄 <code>pe3-loi/src/main/java/model/GradeRow.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.math.BigDecimal;

// Lỗi 10: trường tên "score" nhưng getter là getPoint() — EL đọc GETTER, không đọc trường
public class GradeRow {
    private final BigDecimal score;

    public GradeRow(BigDecimal score) { this.score = score; }

    public BigDecimal getPoint() { return score; }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pe3-loi/loi/getter HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 3311

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message An exception occurred processing [/WEB-INF/views/getter.jsp] at line [2]
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
org.apache.jasper.JasperException: An exception occurred processing [/WEB-INF/views/getter.jsp] at line [2]
1: &lt;%@ page contentType="text/plain;charset=UTF-8" trimDirectiveWhitespaces="true" %&gt;
2: score: &#36;{g.score}
Stacktrace:
org.apache.jasper.servlet.JspServletWrapper.handleJspException(JspServletWrapper.java:651)
org.apache.jasper.servlet.JspServletWrapper.service(JspServletWrapper.java:528)
org.apache.jasper.servlet.JspServlet.serviceJspFile(JspServlet.java:359)
org.apache.jasper.servlet.JspServlet.service(JspServlet.java:310)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
loi.HienThiServlet.doGet(HienThiServlet.java:29)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Root Cause
jakarta.el.PropertyNotFoundException: Property [score] not found on type [model.GradeRow]
… (21 more lines / còn 21 dòng)</code></pre>
<p><code>&#36;{g.score}</code> nghĩa là "gọi <code>getScore()</code>" (hoặc <code>isScore()</code> với boolean). Tên của trường private không quan trọng. <kbd>Alt</kbd>+<kbd>Insert</kbd> → Getter của NetBeans sinh tên khớp — dùng nó thay vì gõ getter bằng tay.</p>`),
    bi(`<h2>⏱ The 85-minute plan</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Done when</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>read everything; script; rename; <code>DBContext</code>; Run</td><td>the template starts</td></tr>
<tr><td>7–20</td><td>Q1: login with a home page per role, logout, RoleFilter</td><td>both accounts land on their page; 403 both ways</td></tr>
<tr><td>20–40</td><td>Q2: <code>Grade</code> (BigDecimal score, <code>getStatus</code>), <code>GradeDAO.search</code>, <code>OptionDAO</code>, <code>grades.jsp</code> with <code>fmt</code></td><td>"thị" finds 3 rows; NULL shows "Not graded"</td></tr>
<tr><td>40–55</td><td>Q3: <code>GradeForm</code> (pattern + range + duplicate), add, edit, delete</td><td>"8,5" refused; 6.25 saved; SSMS checked</td></tr>
<tr><td>55–75</td><td>Q4a: write the GROUP BY in SSMS first, then <code>stats()</code> and <code>stats.jsp</code>; Q4b: <code>MyGradesServlet</code> + GPA</td><td>DBI202 = 5/4/6.13/3/75.0%/8.00; GPA 5.50</td></tr>
<tr><td>75–85</td><td>private window, marking guide, Clean and Build, submit</td><td>no 404/500</td></tr>
</tbody>
</table>
<p><strong>Q4a in SSMS first.</strong> A statistics query is far easier to get right in SSMS, where you see the rows at once, than through a JSP. Build it in steps: <code>FROM Subject s LEFT JOIN Grade g ON …</code> → add <code>GROUP BY s.code, s.name</code> with <code>COUNT(g.studentId)</code> → add the other columns one by one, checking SWT301 each time. Only then paste it into the DAO.</p>
<h3>🛠 NetBeans tips for this paper</h3>
<ul>
<li>For a <code>BigDecimal</code> field, Alt+Insert getters return <code>BigDecimal</code> — keep it; do not "simplify" to <code>double</code>.</li>
<li>Two packages of JSPs (<code>views/teacher</code>, <code>views/student</code>): right-click the folder → New → JSP keeps them in the right place; check every forward path starts with <code>/WEB-INF/views/</code>.</li>
<li>When the stats page shows an odd number, print the raw SQL result in the Output window (<code>sout</code>) before blaming the JSP.</li>
</ul>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the statistics query becomes a repository method returning a small projection (an interface or record with <code>getRegistered()</code>, <code>getAverage()</code>…) — the SQL is the same GROUP BY; "the id comes from the session" becomes "the id comes from the authenticated principal" (<code>@AuthenticationPrincipal</code>, or the subject of a JWT), never from a request parameter; and Spring Security's method rules (<code>@PreAuthorize("hasRole('TEACHER')")</code>) are the Filter of this paper.</div>`,
    `<h2>⏱ Kế hoạch 85 phút</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Xong khi</th></tr></thead>
<tbody>
<tr><td>0–7</td><td>đọc hết đề; chạy script; đổi tên; <code>DBContext</code>; Run</td><td>project mẫu khởi động</td></tr>
<tr><td>7–20</td><td>Câu 1: đăng nhập có trang chủ theo vai trò, đăng xuất, RoleFilter</td><td>hai tài khoản về đúng trang; 403 cả hai chiều</td></tr>
<tr><td>20–40</td><td>Câu 2: <code>Grade</code> (điểm BigDecimal, <code>getStatus</code>), <code>GradeDAO.search</code>, <code>OptionDAO</code>, <code>grades.jsp</code> có <code>fmt</code></td><td>"thị" ra 3 dòng; NULL hiện "Not graded"</td></tr>
<tr><td>40–55</td><td>Câu 3: <code>GradeForm</code> (mẫu + khoảng + trùng), thêm, sửa, xoá</td><td>"8,5" bị từ chối; 6.25 được lưu; đã xem SSMS</td></tr>
<tr><td>55–75</td><td>Câu 4a: viết GROUP BY trong SSMS trước, rồi <code>stats()</code> và <code>stats.jsp</code>; Câu 4b: <code>MyGradesServlet</code> + GPA</td><td>DBI202 = 5/4/6.13/3/75.0%/8.00; GPA 5.50</td></tr>
<tr><td>75–85</td><td>cửa sổ ẩn danh, barem, Clean and Build, nộp</td><td>không còn 404/500</td></tr>
</tbody>
</table>
<p><strong>Câu 4a viết trong SSMS trước.</strong> Câu thống kê dễ làm đúng trong SSMS, nơi bạn thấy ngay các dòng kết quả, hơn nhiều so với nhìn qua JSP. Dựng từng bước: <code>FROM Subject s LEFT JOIN Grade g ON …</code> → thêm <code>GROUP BY s.code, s.name</code> với <code>COUNT(g.studentId)</code> → thêm từng cột còn lại, mỗi lần nhìn lại dòng SWT301. Xong mới dán vào DAO.</p>
<h3>🛠 Mẹo NetBeans cho đề này</h3>
<ul>
<li>Với trường <code>BigDecimal</code>, getter do Alt+Insert sinh trả về <code>BigDecimal</code> — giữ nguyên; đừng "đơn giản hoá" thành <code>double</code>.</li>
<li>Hai thư mục JSP (<code>views/teacher</code>, <code>views/student</code>): chuột phải vào thư mục → New → JSP để file nằm đúng chỗ; kiểm mọi đường dẫn forward đều bắt đầu bằng <code>/WEB-INF/views/</code>.</li>
<li>Trang thống kê ra một con số lạ thì in kết quả SQL thô ra cửa sổ Output (<code>sout</code>) trước khi đổ lỗi cho JSP.</li>
</ul>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): câu thống kê trở thành một phương thức repository trả về một "projection" nhỏ (interface hoặc record có <code>getRegistered()</code>, <code>getAverage()</code>…) — SQL vẫn là GROUP BY đó; "mã lấy từ session" trở thành "mã lấy từ người dùng đã xác thực" (<code>@AuthenticationPrincipal</code>, hoặc subject của JWT), không bao giờ từ tham số request; còn luật trên phương thức của Spring Security (<code>@PreAuthorize("hasRole('TEACHER')")</code>) chính là Filter của đề này.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>aggregate function</strong></td><td>hàm gộp</td><td>A SQL function that turns many rows into one value: COUNT, SUM, AVG, MIN, MAX.</td></tr>
<tr><td><strong>GROUP BY</strong></td><td>nhóm theo</td><td>The clause that splits rows into groups so that aggregate functions work per group.</td></tr>
<tr><td><strong>LEFT JOIN</strong></td><td>nối trái</td><td>A join that keeps every row of the left table, with NULLs where the right table has no match.</td></tr>
<tr><td><strong>COUNT(column) vs COUNT(*)</strong></td><td>đếm cột và đếm dòng</td><td>COUNT(column) skips NULL values; COUNT(*) counts every row, including the empty row of a LEFT JOIN.</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng</td><td>"No value / unknown" in SQL; it is not 0 and not an empty string.</td></tr>
<tr><td><strong>BigDecimal</strong></td><td>số thập phân chính xác</td><td>A Java class for exact decimal numbers that can also be null; it maps to SQL DECIMAL.</td></tr>
<tr><td><strong>composite primary key</strong></td><td>khoá chính kép</td><td>A primary key made of two or more columns, such as (studentId, subjectCode).</td></tr>
<tr><td><strong>weighted average (GPA)</strong></td><td>trung bình có trọng số</td><td>An average in which each score counts as many times as its weight, here its credits.</td></tr>
<tr><td><strong>IDOR</strong></td><td>tham chiếu đối tượng trực tiếp không an toàn</td><td>Insecure Direct Object Reference: reading or changing data just by changing an id in the request.</td></tr>
<tr><td><strong>broken access control</strong></td><td>phân quyền hỏng</td><td>The OWASP name for any way a user can act outside their permissions.</td></tr>
<tr><td><strong>locale</strong></td><td>quy ước vùng</td><td>Language + country settings that decide decimal and thousands separators, such as en_US (8.5) or vi_VN (8,5).</td></tr>
<tr><td><strong>HALF_EVEN rounding</strong></td><td>làm tròn về số chẵn</td><td>Rounding a 5 to the even neighbour (6.25 → 6.2, 6.35 → 6.4); Java's DecimalFormat default.</td></tr>
<tr><td><strong>PropertyNotFoundException</strong></td><td>lỗi không tìm thấy thuộc tính</td><td>The EL error raised when a bean has no getter for the property named in the expression.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>aggregate function</strong></td><td>hàm gộp</td><td>Hàm SQL biến nhiều dòng thành một giá trị: COUNT, SUM, AVG, MIN, MAX.</td></tr>
<tr><td><strong>GROUP BY</strong></td><td>nhóm theo</td><td>Mệnh đề chia các dòng thành nhóm để hàm gộp tính theo từng nhóm.</td></tr>
<tr><td><strong>LEFT JOIN</strong></td><td>nối trái</td><td>Phép nối giữ mọi dòng của bảng bên trái, điền NULL ở chỗ bảng bên phải không có dòng khớp.</td></tr>
<tr><td><strong>COUNT(column) vs COUNT(*)</strong></td><td>đếm cột và đếm dòng</td><td>COUNT(cột) bỏ qua giá trị NULL; COUNT(*) đếm mọi dòng, kể cả dòng rỗng do LEFT JOIN tạo ra.</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng</td><td>"Không có giá trị / chưa biết" trong SQL; nó không phải 0 và không phải chuỗi rỗng.</td></tr>
<tr><td><strong>BigDecimal</strong></td><td>số thập phân chính xác</td><td>Lớp Java cho số thập phân chính xác và có thể là null; tương ứng DECIMAL của SQL.</td></tr>
<tr><td><strong>composite primary key</strong></td><td>khoá chính kép</td><td>Khoá chính gồm hai cột trở lên, như (studentId, subjectCode).</td></tr>
<tr><td><strong>weighted average (GPA)</strong></td><td>trung bình có trọng số</td><td>Trung bình trong đó mỗi điểm được tính nhiều lần bằng trọng số của nó, ở đây là số tín chỉ.</td></tr>
<tr><td><strong>IDOR</strong></td><td>tham chiếu đối tượng trực tiếp không an toàn</td><td>Insecure Direct Object Reference: đọc hoặc sửa dữ liệu chỉ bằng cách đổi một mã trong request.</td></tr>
<tr><td><strong>broken access control</strong></td><td>phân quyền hỏng</td><td>Tên OWASP cho mọi cách để người dùng làm được việc vượt quyền của mình.</td></tr>
<tr><td><strong>locale</strong></td><td>quy ước vùng</td><td>Cài đặt ngôn ngữ + quốc gia quyết định dấu thập phân và dấu nghìn, như en_US (8.5) hay vi_VN (8,5).</td></tr>
<tr><td><strong>HALF_EVEN rounding</strong></td><td>làm tròn về số chẵn</td><td>Làm tròn số 5 về phía chữ số chẵn gần nhất (6.25 → 6.2, 6.35 → 6.4); mặc định của DecimalFormat trong Java.</td></tr>
<tr><td><strong>PropertyNotFoundException</strong></td><td>lỗi không tìm thấy thuộc tính</td><td>Lỗi EL ném ra khi bean không có getter cho thuộc tính được nêu trong biểu thức.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Remember</h2>
<ul>
<li>A MOCK paper (no real PRJ301 PE in the Exam Room yet). Do papers 1/3 and 2/3 too: together they cover every shape of PE question taught in this course.</li>
<li>One Filter can guard several areas; send each role to its own home page after login.</li>
<li>A nullable number is a <code>BigDecimal</code> (or <code>Integer</code>), read with <code>getBigDecimal</code>/<code>getObject</code>; never let NULL become 0.</li>
<li>Composite key ⇒ edit/delete carry BOTH values; check duplicates before INSERT.</li>
<li>Statistics: start from the table that must list everything (<code>LEFT JOIN</code>), <code>COUNT(column)</code>, <code>AVG</code> on DECIMAL, every plain column in <code>GROUP BY</code>, no division by zero.</li>
<li>The current user's id comes from the session, never from the URL; hiding a button is not authorization.</li>
<li>Fix the locale on pages that print numbers (<code>fmt:setLocale</code>), and remember <code>DecimalFormat</code> rounds HALF_EVEN.</li>
<li>Build GROUP BY queries in SSMS first, then paste them into the DAO.</li>
</ul>`,
    `<h2>📌 Ghi nhớ</h2>
<ul>
<li>Đề MÔ PHỎNG (Exam Room chưa có đề PE PRJ301 thật). Làm cả đề 1/3 và 2/3: ba đề cộng lại phủ mọi dạng câu PE đã học trong khoá.</li>
<li>Một Filter canh được nhiều vùng; sau đăng nhập đưa mỗi vai trò về trang chủ riêng.</li>
<li>Số có thể NULL là <code>BigDecimal</code> (hoặc <code>Integer</code>), đọc bằng <code>getBigDecimal</code>/<code>getObject</code>; không bao giờ để NULL thành 0.</li>
<li>Khoá chính kép ⇒ sửa/xoá mang CẢ HAI giá trị; kiểm trùng trước khi INSERT.</li>
<li>Thống kê: bắt đầu từ bảng phải liệt kê đủ (<code>LEFT JOIN</code>), <code>COUNT(cột)</code>, <code>AVG</code> trên DECIMAL, mọi cột thường có trong <code>GROUP BY</code>, không chia cho 0.</li>
<li>Mã người dùng hiện tại lấy từ session, không bao giờ từ URL; giấu nút không phải là phân quyền.</li>
<li>Chốt locale trên trang in số (<code>fmt:setLocale</code>), và nhớ <code>DecimalFormat</code> làm tròn HALF_EVEN.</li>
<li>Viết câu GROUP BY trong SSMS trước, rồi mới dán vào DAO.</li>
</ul>`),
  ].join('\n'),
};

export default {
  extrasEnd: [L_x_luyen_pe_1, L_x_luyen_pe_2, L_x_luyen_pe_3],
};
