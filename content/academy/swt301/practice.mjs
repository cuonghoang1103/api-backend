/**
 * SWT301 · Practice project — MystBloom.
 * 01.Materials… 03.Temp/MystBloom is a real student web application
 * (NetBeans, Jakarta Servlet/JSP, SQL Server, BCrypt, Google OAuth) that the
 * teacher left in the course folder. It is used here as a practice TEST OBJECT
 * that ties Chapters 3–7 and the labs together.
 * ⚠ The source contains real credentials (Google OAuth client secret, DB and
 * SMTP passwords). They are NEVER reproduced here — every secret is masked,
 * and the fact that they are hard-coded is itself finding #1 of the review.
 * The CV files in 03.Temp are personal documents of real people and are not
 * used anywhere in the course.
 */
import { bi } from './_slides.mjs';

const CODE_LOGIN = `// LoginServlet.java (excerpt, line numbers as in the file, secrets masked)
 55  String service = request.getParameter("service");
 57  if ("loginUser".equals(service)) {
 ...     String input = request.getParameter("input");      // email or phone
 ...     String password = request.getParameter("password");
 ...     UsersDAO userDao = new UsersDAO();
 ...     CustomersDAO customerDao = new CustomersDAO();
 ...     HttpSession session = request.getSession();
 ...     if ("on".equals(request.getParameter("rememberMe"))) {
 ...         if (customerDao.checkLogin(input, password) != null) accountType = "customer";
 ...         else if (userDao.checkLogin(input, password) != null) accountType = "user";
 ...         // save token, add cookies remember_user / remember_token (7 days)
 ...     }
 ...     if (userDao.checkLogin(input, password) != null) {
 ...         String role = userDao.getUserRole(input);
 ...         switch (role) {
 ...             case "Admin":   response.sendRedirect("view/authen/login-register.jsp"); break;
 ...             case "Manager": response.sendRedirect("managerPage.jsp"); break;
 ...             ...
 ...     } else if (customerDao.checkLogin(input, password) != null) {
 ...         session.setAttribute("role", "Customer"); response.sendRedirect("home");
 ...     } else {
 ...         request.setAttribute("message", "Login failed: Invalid credentials.");
 ...         request.getRequestDispatcher("LoginUser.jsp").forward(request, response);
 ...     }
 ... }
 ... if ("loginGoogle".equals(service)) {
 ...     String CLIENT_ID = "6343…apps.googleusercontent.com";   // masked
 ...     String CLIENT_SECRET = "GOCSPX-************";            // masked
 ...     String REDIRECT_URI = "http://localhost:9999/MystBloom/login?service=loginGoogle";`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FINDINGS = [
  ['1', 'LoginServlet (loginGoogle), DBContext, EmailUtils', 'Security', 'Critical', 'Google OAuth client secret, database password and Gmail app password are hard-coded in source files (and therefore in every copy and in version control).', 'Read them from environment variables / a config file outside the repo; rotate the leaked secrets.', 'Bí mật OAuth của Google, mật khẩu CSDL và mật khẩu ứng dụng Gmail được viết cứng trong mã nguồn (nên nằm trong mọi bản sao và trong git).', 'Đọc từ biến môi trường / file cấu hình ngoài repo; đổi (rotate) các bí mật đã lộ.'],
  ['2', 'LoginServlet (loginUser)', 'Logic', 'Major', 'A user with role "Admin" is redirected back to the login page — admins can never reach an admin page.', 'Redirect to the admin dashboard; add a test case per role.', 'Người dùng vai trò "Admin" bị chuyển về lại trang đăng nhập — admin không bao giờ vào được trang quản trị.', 'Chuyển tới trang quản trị; thêm một test case cho mỗi vai trò.'],
  ['3', 'LoginServlet (loginUser)', 'Performance / design', 'Major', 'checkLogin() is called up to four times for one login attempt (twice in the remember-me block, then again for routing). Each call is a DB query plus a deliberately slow BCrypt check.', 'Authenticate once, keep the result (account + type), reuse it.', 'checkLogin() bị gọi tới bốn lần cho một lần đăng nhập (hai lần trong khối remember-me, rồi lại gọi khi điều hướng). Mỗi lần là một truy vấn CSDL cộng một lần BCrypt vốn cố ý chậm.', 'Xác thực một lần, giữ kết quả (tài khoản + loại), dùng lại.'],
  ['4', 'LoginServlet (loginUser)', 'Logic', 'Major', 'The remember-me block checks customers first, the routing block checks users first: if the same email exists in both tables, the cookie says "customer" but the session says staff role.', 'One lookup order, one source of truth.', 'Khối remember-me kiểm bảng khách hàng trước, khối điều hướng lại kiểm bảng nhân viên trước: nếu một email có ở cả hai bảng thì cookie ghi "customer" còn session lại mang vai trò nhân viên.', 'Một thứ tự tra cứu, một nguồn sự thật.'],
  ['5', 'LoginServlet (failed login)', 'Functional', 'Major', 'A failed login forwards to "LoginUser.jsp", but every other path uses "view/authen/login-register.jsp" — there is no LoginUser.jsp in /web, so the user gets a 404 instead of the error message.', 'Forward to the real login view.', 'Đăng nhập sai sẽ forward tới "LoginUser.jsp", trong khi mọi nhánh khác dùng "view/authen/login-register.jsp" — thư mục /web không có LoginUser.jsp, nên người dùng nhận lỗi 404 thay vì thông báo.', 'Forward tới đúng trang đăng nhập.'],
  ['6', 'LoginServlet (remember-me)', 'Security', 'Major', 'Remember-me cookies are created without HttpOnly, Secure and an explicit path, and the user name travels in clear text.', 'setHttpOnly(true), setSecure(true), setPath(context); store only an opaque token.', 'Cookie remember-me không đặt HttpOnly, Secure và path rõ ràng, tên đăng nhập đi dạng chữ rõ.', 'setHttpOnly(true), setSecure(true), setPath(context); chỉ lưu một token vô nghĩa.'],
  ['7', 'LoginServlet (loginUser)', 'Security', 'Major', 'No session regeneration after successful login (session fixation).', 'Invalidate the old session and create a new one after authentication.', 'Không tạo lại session sau khi đăng nhập thành công (session fixation).', 'Huỷ session cũ, tạo session mới sau khi xác thực.'],
  ['8', 'LoginServlet (forgotPassword)', 'Security', 'Minor', 'Different messages for "account exists" and "no account found" let an attacker enumerate registered emails/phones.', 'Always answer "If the account exists, a link has been sent".', 'Hai thông báo khác nhau cho "có tài khoản" và "không có tài khoản" giúp kẻ tấn công dò email/số điện thoại đã đăng ký.', 'Luôn trả lời "Nếu tài khoản tồn tại, liên kết đã được gửi".'],
  ['9', 'LoginServlet (forgotPassword)', 'Functional', 'Minor', 'Customers are looked up by email only, staff by email or phone, while the message promises "email/phone".', 'Look up both by email or phone, or fix the message.', 'Khách hàng chỉ được tra theo email, nhân viên theo email hoặc số điện thoại, trong khi thông báo hứa "email/phone".', 'Tra cả hai theo email hoặc số điện thoại, hoặc sửa thông báo.'],
  ['10', 'UsersDAO.getUserByEmailOrPhone', 'Data / logic', 'Major', 'Reads column "password" although the table stores "passwordHash" (used by checkLogin and updatePassword) → SQLException, swallowed, returns null → forgot-password never works for staff accounts.', 'Use the correct column; stop swallowing exceptions.', 'Đọc cột "password" trong khi bảng lưu "passwordHash" (checkLogin và updatePassword dùng tên này) → SQLException bị nuốt, trả null → quên mật khẩu không bao giờ chạy với tài khoản nhân viên.', 'Dùng đúng tên cột; đừng nuốt exception.'],
  ['11', 'LoginServlet (register / resetPassword)', 'Robustness', 'Major', 'No server-side validation of name, email format, phone or password strength; a missing password reaches BCrypt.hashpw(null) and throws.', 'Validate every field (the rules become EP/BVA test conditions — see task 2).', 'Không kiểm tra phía server tên, định dạng email, số điện thoại hay độ mạnh mật khẩu; thiếu mật khẩu thì BCrypt.hashpw(null) ném lỗi.', 'Kiểm tra mọi trường (các luật này chính là test condition cho EP/BVA — xem nhiệm vụ 2).'],
  ['12', 'LoginServlet (resetPassword)', 'Security', 'Minor', 'The account type comes from a request parameter ("type=User|Customer") and is trusted.', 'Store the type with the token server-side.', 'Loại tài khoản lấy từ tham số request ("type=User|Customer") và được tin tưởng tuyệt đối.', 'Lưu loại tài khoản cùng token ở phía server.'],
  ['13', 'UsersDAO / CustomersDAO checkLogin', 'Resource', 'Minor', 'PreparedStatement and ResultSet are never closed in checkLogin (other methods use try-with-resources).', 'try-with-resources everywhere.', 'PreparedStatement và ResultSet không bao giờ được đóng trong checkLogin (các hàm khác lại dùng try-with-resources).', 'Dùng try-with-resources ở mọi nơi.'],
  ['14', 'UsersDAO / CustomersDAO', 'Maintainability', 'Minor', 'A main() with hard-coded test logins is left in production DAO classes.', 'Move to real unit tests (JUnit) with test data.', 'Hàm main() chứa tài khoản thử viết cứng bị bỏ lại trong các lớp DAO chạy thật.', 'Chuyển thành unit test JUnit thật với dữ liệu test.'],
  ['15', 'UsersDAO / CustomersDAO', 'Maintainability', 'Minor', 'Columns read by position (rs.getInt(1), rs.getString(2)…) — any change to the table order silently maps wrong fields.', 'Read by column name.', 'Đọc cột theo vị trí (rs.getInt(1), rs.getString(2)…) — đổi thứ tự cột là âm thầm gán nhầm trường.', 'Đọc theo tên cột.'],
  ['16', 'LoginServlet', 'Error handling', 'Minor', 'processRequest declares "throws Exception"; errors are only printed with printStackTrace().', 'Specific exceptions, a logger, and an error page.', 'processRequest khai "throws Exception"; lỗi chỉ được in bằng printStackTrace().', 'Exception cụ thể, dùng logger, và có trang báo lỗi.'],
  ['17', 'LoginServlet', 'Convention', 'Minor', 'Magic strings for services and roles ("loginUser", "Admin"…) repeated across the class; one 380-line method handles six features.', 'Constants/enum; one handler per service.', 'Chuỗi "ma thuật" cho service và vai trò ("loginUser", "Admin"…) lặp khắp lớp; một hàm 380 dòng ôm sáu tính năng.', 'Hằng số/enum; mỗi service một hàm xử lý.'],
];

const findRows = (vi) => FINDINGS.map((f) => `<tr><td>${f[0]}</td><td>${f[1]}</td><td>${f[2]}</td><td>${f[3]}</td><td>${vi ? f[6] : f[4]}</td><td>${vi ? f[7] : f[5]}</td></tr>`).join('');

const L1 = {
  title: 'P.1 — Meet the test object: MystBloom (a real student web app)|||P.1 — Làm quen đối tượng test: MystBloom (một web app thật của sinh viên)',
  slug: 'swt301-practice-mystbloom-intro',
  type: 'DOCUMENT',
  description: 'Project MystBloom trong thư mục 03.Temp: kiến trúc Servlet/JSP, các chức năng, cách chạy, và lộ trình dùng nó để luyện review code, EP/BVA, decision table, integration test và defect report.',
  content: [
    bi(`<span class="eyebrow">Practice project · P.1</span>
<h2>MystBloom — a real application to practise on</h2>
<p class="lead">The course folder contains, in <em>03.Temp</em>, a complete student web project called <strong>MystBloom</strong> — an online flower-bouquet shop. Real code written under real deadlines is the best practice material a tester can get: it has real defects. These four lessons use it to rehearse, on one system, everything the PE and the labs ask for.</p>
<table>
<thead><tr><th>Aspect</th><th>What is in the project</th></tr></thead>
<tbody>
<tr><td>Stack</td><td>NetBeans Ant web project, Jakarta Servlet/JSP, SQL Server via JDBC, BCrypt for passwords, Google OAuth login, Gmail SMTP for password reset</td></tr>
<tr><td>Size</td><td>26 Java classes (~3,400 lines): controllers (LoginServlet 383 lines, AuthenticationController, HomeController, BouquetDetailControler, RememberMeFilter, ViewProfileServlet), DAOs (UsersDAO, CustomersDAO, PasswordTokenDAO, BouquetTemplateViewDAO…), models, utils</td></tr>
<tr><td>Screens (JSP)</td><td>home, shop, shop-list, product-details, about-us, contact · login-register, forgot-password, reset-password · my-account, cart, wishlist, checkout</td></tr>
<tr><td>Features to test</td><td>register, login (email or phone), remember-me, Google login, forgot/reset password, role-based redirect (Admin, Manager, Staff, Shipper, Customer), catalogue and bouquet detail</td></tr>
</tbody>
</table>
<h3>How to open and run it</h3>
<ol>
<li>NetBeans → File → Open Project → <em>MystBloom</em> (it has <code>nbproject/</code> and <code>build.xml</code>); set a Jakarta EE server (Tomcat 10+).</li>
<li>The project expects a SQL Server database (tables Users, Customers, Roles, Orders, Bouquet…) — no SQL script is included, so for this course you will mostly work <em>statically</em> (reviews) and <em>design</em> tests from the code and screens, exactly as in the PE where no IDE is allowed.</li>
<li>Before running anything, replace the hard-coded credentials with your own local ones — and never commit real ones (finding #1 in P.2).</li>
</ol>
<div class="callout"><b>Why the course uses it.</b> Lab 1 practises review on a small class; the PE gives you one class and one form. MystBloom lets you do the same on a real, messy codebase: review (Ch.3), black-box design (Ch.4), white-box reasoning (Ch.5), exploratory charters (Ch.6), defect reports and risk (Ch.7).</div>
<div class="pitfall"><b>About the other files in 03.Temp.</b> The folder also contains four CV documents of real people. They are personal data, unrelated to testing, and are deliberately not used in this course.</div>`,
    `<span class="eyebrow">Dự án luyện tập · P.1</span>
<h2>MystBloom — một ứng dụng thật để luyện tay</h2>
<p class="lead">Trong thư mục môn, ở <em>03.Temp</em>, có trọn một project web của sinh viên tên <strong>MystBloom</strong> — cửa hàng hoa bó online. Code thật viết dưới deadline thật là tài liệu luyện tập tốt nhất cho tester: nó có lỗi thật. Bốn bài này dùng nó để luyện, trên cùng một hệ thống, mọi thứ mà PE và các Lab yêu cầu.</p>
<table>
<thead><tr><th>Khía cạnh</th><th>Trong project có gì</th></tr></thead>
<tbody>
<tr><td>Công nghệ</td><td>Project web NetBeans (Ant), Jakarta Servlet/JSP, SQL Server qua JDBC, BCrypt cho mật khẩu, đăng nhập Google OAuth, Gmail SMTP để đặt lại mật khẩu</td></tr>
<tr><td>Quy mô</td><td>26 lớp Java (~3.400 dòng): controller (LoginServlet 383 dòng, AuthenticationController, HomeController, BouquetDetailControler, RememberMeFilter, ViewProfileServlet), DAO (UsersDAO, CustomersDAO, PasswordTokenDAO, BouquetTemplateViewDAO…), model, util</td></tr>
<tr><td>Màn hình (JSP)</td><td>home, shop, shop-list, product-details, about-us, contact · login-register, forgot-password, reset-password · my-account, cart, wishlist, checkout</td></tr>
<tr><td>Chức năng cần test</td><td>đăng ký, đăng nhập (email hoặc số điện thoại), ghi nhớ đăng nhập, đăng nhập Google, quên/đặt lại mật khẩu, điều hướng theo vai trò (Admin, Manager, Staff, Shipper, Customer), danh mục và chi tiết bó hoa</td></tr>
</tbody>
</table>
<h3>Cách mở và chạy</h3>
<ol>
<li>NetBeans → File → Open Project → <em>MystBloom</em> (có sẵn <code>nbproject/</code> và <code>build.xml</code>); chọn server Jakarta EE (Tomcat 10+).</li>
<li>Project cần CSDL SQL Server (bảng Users, Customers, Roles, Orders, Bouquet…) — không kèm script SQL, nên trong môn này bạn chủ yếu làm <em>tĩnh</em> (review) và <em>thiết kế</em> test từ code và màn hình, đúng như PE vốn không cho dùng IDE.</li>
<li>Trước khi chạy, thay các thông tin đăng nhập bị viết cứng bằng của riêng bạn trên máy — và không bao giờ commit thông tin thật (finding số 1 ở P.2).</li>
</ol>
<div class="callout"><b>Vì sao khoá học dùng nó.</b> Lab 1 luyện review trên một lớp nhỏ; PE cho bạn một lớp và một form. MystBloom cho bạn làm y như vậy trên một codebase thật, lộn xộn: review (Ch.3), thiết kế black-box (Ch.4), suy luận white-box (Ch.5), charter khám phá (Ch.6), defect report và rủi ro (Ch.7).</div>
<div class="pitfall"><b>Về các file khác trong 03.Temp.</b> Thư mục còn có bốn file CV của người thật. Đó là dữ liệu cá nhân, không liên quan tới kiểm thử, và cố ý không được dùng trong khoá học.</div>`),
  ].join('\n'),
};

const L2 = {
  title: 'P.2 — Task 1: review LoginServlet & the DAOs (17 findings)|||P.2 — Nhiệm vụ 1: review LoginServlet & các DAO (17 lỗi tìm được)',
  slug: 'swt301-practice-mystbloom-review',
  type: 'DOCUMENT',
  description: 'Review code thật theo checklist Lab 1: 17 lỗi (bảo mật, logic, hiệu năng, bảo trì) kèm vị trí, mức nghiêm trọng và cách sửa — đúng dạng câu 1 của đề PE.',
  content: [
    bi(`<span class="eyebrow">Practice project · P.2 · Task 1 — static testing</span>
<h2>Review LoginServlet and the DAOs</h2>
<p class="lead">Take the review role of Chapter 3: read <code>controller/LoginServlet.java</code>, <code>dal/UsersDAO.java</code>, <code>dal/CustomersDAO.java</code>, <code>dal/DBContext.java</code> and <code>util/EmailUtils.java</code> with the Lab 1 checklist in hand, and log every issue as in PE Question 1 (issue · location · description). Try it yourself first (30 minutes), then compare with the log below.</p>
<pre><code>${esc(CODE_LOGIN)}</code></pre>
<h3>Model review log</h3>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Where</th><th>Category</th><th>Severity</th><th>Issue</th><th>Fix</th></tr></thead>
<tbody>${findRows(false)}</tbody>
</table></div>
<div class="callout ok"><b>What the PE marker wants.</b> Six issues is the minimum; each must be <em>specific</em> (line or method), <em>correct</em> and <em>relevant</em> (compile errors, coding practice, logic, robustness). Findings 2, 5 and 10 are the kind examiners love: they are real logic defects visible only by reading carefully.</div>
<div class="pitfall"><b>Do not log opinions.</b> "The code is messy" earns nothing. "Line X: magic string 'Admin' repeated in 4 places — use a constant" earns a point.</div>`,
    `<span class="eyebrow">Dự án luyện tập · P.2 · Nhiệm vụ 1 — kiểm thử tĩnh</span>
<h2>Review LoginServlet và các DAO</h2>
<p class="lead">Nhận vai reviewer của Chương 3: đọc <code>controller/LoginServlet.java</code>, <code>dal/UsersDAO.java</code>, <code>dal/CustomersDAO.java</code>, <code>dal/DBContext.java</code> và <code>util/EmailUtils.java</code> với checklist của Lab 1 trong tay, rồi ghi mọi lỗi như câu 1 của đề PE (số thứ tự · vị trí · mô tả). Tự làm trước (30 phút), sau đó mới so với bảng dưới.</p>
<pre><code>${esc(CODE_LOGIN)}</code></pre>
<h3>Bảng review mẫu</h3>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Vị trí</th><th>Nhóm</th><th>Mức độ</th><th>Lỗi</th><th>Cách sửa</th></tr></thead>
<tbody>${findRows(true)}</tbody>
</table></div>
<div class="callout ok"><b>Giám khảo PE muốn gì.</b> Tối thiểu sáu lỗi; mỗi lỗi phải <em>cụ thể</em> (dòng hoặc hàm), <em>đúng</em> và <em>liên quan</em> (lỗi biên dịch, thói quen code, logic, độ bền). Lỗi số 2, 5 và 10 là loại giám khảo rất thích: lỗi logic thật, chỉ thấy khi đọc kỹ.</div>
<div class="pitfall"><b>Đừng ghi ý kiến chung chung.</b> "Code lộn xộn" không được điểm. "Dòng X: chuỗi 'Admin' lặp ở 4 chỗ — nên dùng hằng số" thì được điểm.</div>`),
  ].join('\n'),
};

const L3 = {
  title: 'P.3 — Task 2: black-box design for Register & Login (EP, BVA, decision table)|||P.3 — Nhiệm vụ 2: thiết kế black-box cho Đăng ký & Đăng nhập (EP, BVA, decision table)',
  slug: 'swt301-practice-mystbloom-blackbox',
  type: 'DOCUMENT',
  description: 'Viết luật cho form đăng ký rồi làm bảng EP/BVA có tag như câu 3 đề PE, test case phủ tag, và decision table cho luồng đăng nhập theo vai trò + remember-me.',
  content: [
    bi(`<span class="eyebrow">Practice project · P.3 · Task 2 — black-box test design</span>
<h2>Design tests for Register and Login</h2>
<p class="lead">The code has no written rules, so a tester first <em>writes the assumptions</em> down (slide 134 of SWT2: "document your assumptions") and gets them confirmed. Then apply Chapter 4.</p>
<h3>Assumed rules (confirm with the team)</h3>
<ul>
<li><b>Full name</b>: required, 2–50 characters, letters and spaces only.</li>
<li><b>Email</b>: required, valid format, not already registered.</li>
<li><b>Phone</b>: required, exactly 10 digits starting with 0, not already registered.</li>
<li><b>Password</b>: required, 8–32 characters, at least one letter and one digit.</li>
<li><b>Birth date</b>: optional; if present, format yyyy-MM-dd and age 16–100.</li>
</ul>
<h3>Table 3.1 — test analysis (PE format)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Condition</th><th>Valid partitions</th><th>Tag</th><th>Invalid partitions</th><th>Tag</th><th>Valid boundaries</th><th>Tag</th><th>Invalid boundaries</th><th>Tag</th></tr></thead>
<tbody>
<tr><td>Full name</td><td>2–50 chars</td><td>VP1</td><td>&lt; 2 chars</td><td>IP1</td><td>2 chars</td><td>VB1</td><td>1 char</td><td>IB1</td></tr>
<tr><td></td><td>letters &amp; spaces</td><td>VP2</td><td>&gt; 50 chars</td><td>IP2</td><td>50 chars</td><td>VB2</td><td>51 chars</td><td>IB2</td></tr>
<tr><td></td><td></td><td></td><td>digits / special chars</td><td>IP3</td><td></td><td></td><td>0 chars (empty)</td><td>IB3</td></tr>
<tr><td>Email</td><td>valid format, new</td><td>VP3</td><td>invalid format</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>already registered</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Phone</td><td>10 digits, starts with 0, new</td><td>VP4</td><td>≠ 10 digits</td><td>IP6</td><td>10 digits</td><td>VB3</td><td>9 digits / 11 digits</td><td>IB4 / IB5</td></tr>
<tr><td></td><td></td><td></td><td>not starting with 0 / contains letters</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>already registered</td><td>IP8</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Password</td><td>8–32, letter + digit</td><td>VP5</td><td>&lt; 8 or &gt; 32</td><td>IP9</td><td>8 / 32 chars</td><td>VB4 / VB5</td><td>7 / 33 chars</td><td>IB6 / IB7</td></tr>
<tr><td></td><td></td><td></td><td>no digit / no letter</td><td>IP10</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Birth date</td><td>empty (optional)</td><td>VP6</td><td>wrong format</td><td>IP11</td><td>age 16 / 100</td><td>VB6 / VB7</td><td>age 15 / 101</td><td>IB8 / IB9</td></tr>
<tr><td></td><td>valid date, age 16–100</td><td>VP7</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table></div>
<h3>Table 3.2 — test cases covering the tags</h3>
<div class="table-wrap"><table>
<thead><tr><th>TC</th><th>Test data (name · email · phone · password · birth date)</th><th>Expected</th><th>Tags</th></tr></thead>
<tbody>
<tr><td>1</td><td>"An" · an@mail.com · 0901234567 · Abcdefg1 (8) · exactly 16 years ago today* (2010-09-11 if run on 2026-09-11)</td><td>account created</td><td>VP1 VP2 VB1 VP3 VP4 VB3 VP5 VB4 VP7 VB6</td></tr>
<tr><td>2</td><td>50-letter name · b@mail.com · 0912345678 · 31 letters + "1" (32) · empty</td><td>account created</td><td>VB2 VB5 VP6</td></tr>
<tr><td>3</td><td>"A" · c@mail.com · 0923456789 · Abcdefg1 · empty</td><td>error on name</td><td>IP1 IB1</td></tr>
<tr><td>4</td><td>51-letter name · d@mail.com · …</td><td>error on name</td><td>IP2 IB2</td></tr>
<tr><td>5</td><td>"" (empty) · …</td><td>"name is required"</td><td>IB3</td></tr>
<tr><td>6</td><td>"Nam123" · …</td><td>error on name</td><td>IP3</td></tr>
<tr><td>7</td><td>… · "an@mail" · …</td><td>error on email</td><td>IP4</td></tr>
<tr><td>8</td><td>… · an@mail.com (already registered by TC1) · …</td><td>"Email already exists"</td><td>IP5</td></tr>
<tr><td>9</td><td>… · 090123456 (9 digits) · …</td><td>error on phone</td><td>IP6 IB4</td></tr>
<tr><td>10</td><td>… · 09012345678 (11 digits) · …</td><td>error on phone</td><td>IB5</td></tr>
<tr><td>11</td><td>… · 1901234567 · …</td><td>error on phone</td><td>IP7</td></tr>
<tr><td>12</td><td>… · 0901234567 (registered) · …</td><td>"Phone already exists"</td><td>IP8</td></tr>
<tr><td>13</td><td>… · Abcdef1 (7) · …</td><td>error on password</td><td>IP9 IB6</td></tr>
<tr><td>14</td><td>… · 32 letters + "1" (33) · …</td><td>error on password</td><td>IB7</td></tr>
<tr><td>15</td><td>… · abcdefgh (no digit) · …</td><td>error on password</td><td>IP10</td></tr>
<tr><td>16</td><td>… · 01/01/2000</td><td>"Invalid birth date format."</td><td>IP11</td></tr>
<tr><td>17</td><td>… · age exactly 100 / 15 / 101 (three cases)</td><td>100 accepted, 15 and 101 rejected</td><td>VB7 IB8 IB9</td></tr>
</tbody>
</table></div>
<p>*Ages depend on the test date: compute the birth date from today (e.g. on 2026-09-11 a 16-year-old was born on or before 2010-09-11). A good tester writes this rule into the precondition instead of a fixed date.</p>
<p><b>Tag coverage check:</b> VP1–VP7, VB1–VB7, IP1–IP11, IB1–IB9 all appear at least once → 100% of the 34 tags. Invalid tags are tested <em>one per case</em> so a failure points to one cause.</p>
<h3>Decision table — login routing (from the code)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Conditions / actions</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>R5</th></tr></thead>
<tbody>
<tr><td>Credentials match a staff user?</td><td>Y</td><td>Y</td><td>N</td><td>N</td><td>N</td></tr>
<tr><td>Credentials match a customer?</td><td>–</td><td>–</td><td>Y</td><td>Y</td><td>N</td></tr>
<tr><td>Remember me ticked?</td><td>N</td><td>Y</td><td>N</td><td>Y</td><td>–</td></tr>
<tr><td>Go to role page (Admin→admin page*, Manager, Staff, Shipper)</td><td>X</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Go to home as Customer</td><td></td><td></td><td>X</td><td>X</td><td></td></tr>
<tr><td>Set remember-me cookies</td><td></td><td>X</td><td></td><td>X</td><td></td></tr>
<tr><td>Show "Login failed: Invalid credentials."</td><td></td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table></div>
<p>*The expected result for Admin is the admin page — running R1 with an Admin account reveals finding #2 of P.2. Add one R1 case per role (Admin, Manager, Staff, Shipper, unknown role) because the switch has five branches.</p>`,
    `<span class="eyebrow">Dự án luyện tập · P.3 · Nhiệm vụ 2 — thiết kế test black-box</span>
<h2>Thiết kế test cho Đăng ký và Đăng nhập</h2>
<p class="lead">Code không có luật viết sẵn, nên tester phải <em>ghi giả định</em> ra trước (slide 134 của SWT2: "document your assumptions") và xin xác nhận. Sau đó áp dụng Chương 4.</p>
<h3>Luật giả định (cần xác nhận với nhóm)</h3>
<ul>
<li><b>Họ tên</b>: bắt buộc, 2–50 ký tự, chỉ chữ cái và khoảng trắng.</li>
<li><b>Email</b>: bắt buộc, đúng định dạng, chưa được đăng ký.</li>
<li><b>Số điện thoại</b>: bắt buộc, đúng 10 chữ số bắt đầu bằng 0, chưa được đăng ký.</li>
<li><b>Mật khẩu</b>: bắt buộc, 8–32 ký tự, có ít nhất một chữ cái và một chữ số.</li>
<li><b>Ngày sinh</b>: không bắt buộc; nếu có thì định dạng yyyy-MM-dd và tuổi 16–100.</li>
</ul>
<h3>Bảng 3.1 — phân tích test (định dạng PE)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Điều kiện</th><th>Phân vùng hợp lệ</th><th>Tag</th><th>Phân vùng không hợp lệ</th><th>Tag</th><th>Biên hợp lệ</th><th>Tag</th><th>Biên không hợp lệ</th><th>Tag</th></tr></thead>
<tbody>
<tr><td>Họ tên</td><td>2–50 ký tự</td><td>VP1</td><td>&lt; 2 ký tự</td><td>IP1</td><td>2 ký tự</td><td>VB1</td><td>1 ký tự</td><td>IB1</td></tr>
<tr><td></td><td>chữ cái &amp; khoảng trắng</td><td>VP2</td><td>&gt; 50 ký tự</td><td>IP2</td><td>50 ký tự</td><td>VB2</td><td>51 ký tự</td><td>IB2</td></tr>
<tr><td></td><td></td><td></td><td>có số / ký tự đặc biệt</td><td>IP3</td><td></td><td></td><td>0 ký tự (rỗng)</td><td>IB3</td></tr>
<tr><td>Email</td><td>đúng định dạng, chưa có</td><td>VP3</td><td>sai định dạng</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>đã đăng ký</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Số điện thoại</td><td>10 số, bắt đầu 0, chưa có</td><td>VP4</td><td>≠ 10 số</td><td>IP6</td><td>10 số</td><td>VB3</td><td>9 số / 11 số</td><td>IB4 / IB5</td></tr>
<tr><td></td><td></td><td></td><td>không bắt đầu bằng 0 / có chữ</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>đã đăng ký</td><td>IP8</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mật khẩu</td><td>8–32, có chữ + số</td><td>VP5</td><td>&lt; 8 hoặc &gt; 32</td><td>IP9</td><td>8 / 32 ký tự</td><td>VB4 / VB5</td><td>7 / 33 ký tự</td><td>IB6 / IB7</td></tr>
<tr><td></td><td></td><td></td><td>không có số / không có chữ</td><td>IP10</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Ngày sinh</td><td>để trống (không bắt buộc)</td><td>VP6</td><td>sai định dạng</td><td>IP11</td><td>tuổi 16 / 100</td><td>VB6 / VB7</td><td>tuổi 15 / 101</td><td>IB8 / IB9</td></tr>
<tr><td></td><td>ngày hợp lệ, tuổi 16–100</td><td>VP7</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table></div>
<h3>Bảng 3.2 — test case phủ các tag</h3>
<div class="table-wrap"><table>
<thead><tr><th>TC</th><th>Dữ liệu (tên · email · SĐT · mật khẩu · ngày sinh)</th><th>Mong đợi</th><th>Tag</th></tr></thead>
<tbody>
<tr><td>1</td><td>"An" · an@mail.com · 0901234567 · Abcdefg1 (8) · đúng 16 năm trước tính tới hôm nay* (2010-09-11 nếu chạy ngày 11/09/2026)</td><td>tạo tài khoản</td><td>VP1 VP2 VB1 VP3 VP4 VB3 VP5 VB4 VP7 VB6</td></tr>
<tr><td>2</td><td>tên 50 chữ cái · b@mail.com · 0912345678 · 31 chữ + "1" (32) · để trống</td><td>tạo tài khoản</td><td>VB2 VB5 VP6</td></tr>
<tr><td>3</td><td>"A" · c@mail.com · 0923456789 · Abcdefg1 · để trống</td><td>lỗi ở tên</td><td>IP1 IB1</td></tr>
<tr><td>4</td><td>tên 51 chữ cái · d@mail.com · …</td><td>lỗi ở tên</td><td>IP2 IB2</td></tr>
<tr><td>5</td><td>"" (rỗng) · …</td><td>"bắt buộc nhập tên"</td><td>IB3</td></tr>
<tr><td>6</td><td>"Nam123" · …</td><td>lỗi ở tên</td><td>IP3</td></tr>
<tr><td>7</td><td>… · "an@mail" · …</td><td>lỗi ở email</td><td>IP4</td></tr>
<tr><td>8</td><td>… · an@mail.com (TC1 đã đăng ký) · …</td><td>"Email already exists"</td><td>IP5</td></tr>
<tr><td>9</td><td>… · 090123456 (9 số) · …</td><td>lỗi ở SĐT</td><td>IP6 IB4</td></tr>
<tr><td>10</td><td>… · 09012345678 (11 số) · …</td><td>lỗi ở SĐT</td><td>IB5</td></tr>
<tr><td>11</td><td>… · 1901234567 · …</td><td>lỗi ở SĐT</td><td>IP7</td></tr>
<tr><td>12</td><td>… · 0901234567 (đã đăng ký) · …</td><td>"Phone already exists"</td><td>IP8</td></tr>
<tr><td>13</td><td>… · Abcdef1 (7) · …</td><td>lỗi ở mật khẩu</td><td>IP9 IB6</td></tr>
<tr><td>14</td><td>… · 32 chữ + "1" (33) · …</td><td>lỗi ở mật khẩu</td><td>IB7</td></tr>
<tr><td>15</td><td>… · abcdefgh (không có số) · …</td><td>lỗi ở mật khẩu</td><td>IP10</td></tr>
<tr><td>16</td><td>… · 01/01/2000</td><td>"Invalid birth date format."</td><td>IP11</td></tr>
<tr><td>17</td><td>… · tuổi đúng 100 / 15 / 101 (ba ca)</td><td>100 được chấp nhận, 15 và 101 bị từ chối</td><td>VB7 IB8 IB9</td></tr>
</tbody>
</table></div>
<p>*Tuổi phụ thuộc ngày chạy test: tính ngày sinh từ hôm nay (vd ngày 11/09/2026 thì người 16 tuổi sinh vào hoặc trước 11/09/2010). Tester giỏi ghi luật này vào precondition thay vì một ngày cố định.</p>
<p><b>Kiểm tra độ phủ tag:</b> VP1–VP7, VB1–VB7, IP1–IP11, IB1–IB9 đều xuất hiện ít nhất một lần → phủ 100% trong 34 tag. Tag không hợp lệ được test <em>mỗi ca một tag</em> để khi fail thì chỉ ra đúng một nguyên nhân.</p>
<h3>Decision table — điều hướng khi đăng nhập (suy từ code)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Điều kiện / hành động</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>R5</th></tr></thead>
<tbody>
<tr><td>Thông tin khớp một nhân viên?</td><td>Y</td><td>Y</td><td>N</td><td>N</td><td>N</td></tr>
<tr><td>Thông tin khớp một khách hàng?</td><td>–</td><td>–</td><td>Y</td><td>Y</td><td>N</td></tr>
<tr><td>Có tick Remember me?</td><td>N</td><td>Y</td><td>N</td><td>Y</td><td>–</td></tr>
<tr><td>Vào trang theo vai trò (Admin→trang quản trị*, Manager, Staff, Shipper)</td><td>X</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Vào trang chủ với vai trò Customer</td><td></td><td></td><td>X</td><td>X</td><td></td></tr>
<tr><td>Đặt cookie remember-me</td><td></td><td>X</td><td></td><td>X</td><td></td></tr>
<tr><td>Hiện "Login failed: Invalid credentials."</td><td></td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table></div>
<p>*Kết quả mong đợi với Admin là trang quản trị — chạy R1 bằng tài khoản Admin sẽ lộ ra lỗi số 2 ở P.2. Thêm một ca R1 cho mỗi vai trò (Admin, Manager, Staff, Shipper, vai trò lạ) vì lệnh switch có năm nhánh.</p>`),
  ].join('\n'),
};

const L4 = {
  title: 'P.4 — Task 3: integration tests, an exploratory charter & defect reports|||P.4 — Nhiệm vụ 3: integration test, charter khám phá & defect report',
  slug: 'swt301-practice-mystbloom-integration',
  type: 'DOCUMENT',
  description: 'Integration test cho luồng quên mật khẩu → email → đặt lại → đăng nhập và remember-me → logout; một test charter khám phá 45 phút; hai defect report viết đúng chuẩn Chương 7.',
  content: [
    bi(`<span class="eyebrow">Practice project · P.4 · Task 3 — dynamic testing &amp; reporting</span>
<h2>Integration tests, an exploratory charter and defect reports</h2>
<h3>Integration test cases (Lab 3 / Report5.2 style)</h3>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>Precondition</th><th>Procedure</th><th>Expected result</th><th>Components integrated</th></tr></thead>
<tbody>
<tr><td>IT-01</td><td>Customer c1 exists (email known)</td><td>1 open Forgot password · 2 enter c1's email · 3 submit</td><td>token row saved (15-min expiry); an email with /reset-password.jsp?token=… is sent; message shown</td><td>LoginServlet ↔ CustomersDAO ↔ PasswordTokenDAO ↔ EmailUtils (SMTP)</td></tr>
<tr><td>IT-02</td><td>IT-01 done, link &lt; 15 min old</td><td>open the link · enter new password · submit · log in with it</td><td>password updated (BCrypt hash changed), token invalidated, login succeeds</td><td>reset page ↔ PasswordTokenDAO ↔ CustomersDAO.updatePassword ↔ checkLogin</td></tr>
<tr><td>IT-03</td><td>link older than 15 min</td><td>open the link and submit</td><td>"Invalid or expired reset token."</td><td>PasswordTokenDAO expiry check</td></tr>
<tr><td>IT-04</td><td>staff user s1 exists</td><td>Forgot password with s1's email</td><td>email sent — <em>fails today</em> because of finding #10 (wrong column) → defect D-02</td><td>LoginServlet ↔ UsersDAO.getUserByEmailOrPhone</td></tr>
<tr><td>IT-05</td><td>customer c1</td><td>log in with Remember me ticked · close browser · reopen /home</td><td>still logged in (RememberMeFilter reads the cookie + token)</td><td>LoginServlet ↔ PasswordTokenDAO ↔ RememberMeFilter</td></tr>
<tr><td>IT-06</td><td>IT-05 done</td><td>Logout · reopen /home</td><td>not logged in; token invalidated in DB; both cookies deleted</td><td>logout ↔ PasswordTokenDAO ↔ cookies</td></tr>
</tbody>
</table></div>
<h3>Exploratory test charter (Chapter 6)</h3>
<p><b>Charter:</b> explore <em>the login page</em> with <em>unusual inputs and sequences</em> to discover <em>security and robustness problems</em>. Time-box 45 minutes. Ideas: phone vs email in the same field, leading/trailing spaces, SQL-like input (<code>' OR 1=1 --</code> — safe here because of prepared statements, which is itself a useful observation), very long password, double-click on Login, back button after logout, two tabs logged in as different roles, remember-me then change password. Record: what you tried, what happened, questions, bugs.</p>
<h3>Two defect reports (Chapter 7 format)</h3>
<table>
<thead><tr><th>Field</th><th>D-01</th><th>D-02</th></tr></thead>
<tbody>
<tr><td>Title</td><td>Admin login redirects back to the login page</td><td>Forgot password never sends a link to staff accounts</td></tr>
<tr><td>Environment</td><td>Tomcat 10.1, Chrome 128, build of 11/09</td><td>same</td></tr>
<tr><td>Steps</td><td>1 open /login?service=loginUser · 2 enter an Admin email and correct password · 3 click Login</td><td>1 open Forgot password · 2 enter a Staff email · 3 submit</td></tr>
<tr><td>Expected</td><td>admin dashboard opens</td><td>"Password reset link has been sent…" and an email arrives</td></tr>
<tr><td>Actual</td><td>login-register.jsp is shown again, no error</td><td>"No account found with the given input."; server log shows SQLException "Invalid column name 'password'"</td></tr>
<tr><td>Severity / priority</td><td>Major / High (admins blocked)</td><td>Major / Medium (workaround: admin resets it)</td></tr>
<tr><td>Probable cause</td><td>switch case "Admin" redirects to the login view (LoginServlet)</td><td>UsersDAO.getUserByEmailOrPhone reads column "password" instead of "passwordHash"</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Secret scanning.</b> Finding #1 would have been caught automatically: tools such as gitleaks, TruffleHog or GitHub secret scanning run as a static-analysis step in CI and block a commit containing strings shaped like OAuth secrets or passwords. Adding one to a pipeline is a five-minute job that prevents the most expensive kind of leak. <em>Outside the syllabus because CTFL's static-analysis examples stop at coding standards and complexity.</em></div>`,
    `<span class="eyebrow">Dự án luyện tập · P.4 · Nhiệm vụ 3 — kiểm thử động &amp; báo cáo</span>
<h2>Integration test, charter khám phá và defect report</h2>
<h3>Integration test case (kiểu Lab 3 / Report5.2)</h3>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>Điều kiện trước</th><th>Các bước</th><th>Kết quả mong đợi</th><th>Thành phần được tích hợp</th></tr></thead>
<tbody>
<tr><td>IT-01</td><td>Có khách hàng c1 (biết email)</td><td>1 mở Quên mật khẩu · 2 nhập email của c1 · 3 gửi</td><td>lưu một dòng token (hết hạn sau 15 phút); gửi email chứa /reset-password.jsp?token=…; hiện thông báo</td><td>LoginServlet ↔ CustomersDAO ↔ PasswordTokenDAO ↔ EmailUtils (SMTP)</td></tr>
<tr><td>IT-02</td><td>Đã làm IT-01, link còn dưới 15 phút</td><td>mở link · nhập mật khẩu mới · gửi · đăng nhập bằng mật khẩu mới</td><td>mật khẩu được cập nhật (hash BCrypt đổi), token bị vô hiệu, đăng nhập thành công</td><td>trang reset ↔ PasswordTokenDAO ↔ CustomersDAO.updatePassword ↔ checkLogin</td></tr>
<tr><td>IT-03</td><td>link đã quá 15 phút</td><td>mở link và gửi</td><td>"Invalid or expired reset token."</td><td>kiểm hạn của PasswordTokenDAO</td></tr>
<tr><td>IT-04</td><td>có nhân viên s1</td><td>Quên mật khẩu với email của s1</td><td>gửi được email — <em>hiện đang fail</em> do lỗi số 10 (sai tên cột) → defect D-02</td><td>LoginServlet ↔ UsersDAO.getUserByEmailOrPhone</td></tr>
<tr><td>IT-05</td><td>khách hàng c1</td><td>đăng nhập có tick Remember me · đóng trình duyệt · mở lại /home</td><td>vẫn đăng nhập (RememberMeFilter đọc cookie + token)</td><td>LoginServlet ↔ PasswordTokenDAO ↔ RememberMeFilter</td></tr>
<tr><td>IT-06</td><td>đã làm IT-05</td><td>Đăng xuất · mở lại /home</td><td>không còn đăng nhập; token bị vô hiệu trong CSDL; hai cookie bị xoá</td><td>logout ↔ PasswordTokenDAO ↔ cookie</td></tr>
</tbody>
</table></div>
<h3>Test charter khám phá (Chương 6)</h3>
<p><b>Charter:</b> khám phá <em>trang đăng nhập</em> với <em>dữ liệu và trình tự bất thường</em> để phát hiện <em>vấn đề bảo mật và độ bền</em>. Giới hạn 45 phút. Gợi ý: số điện thoại lẫn email trong cùng một ô, khoảng trắng đầu/cuối, chuỗi giống SQL (<code>' OR 1=1 --</code> — ở đây an toàn nhờ prepared statement, và đó cũng là một quan sát có ích), mật khẩu rất dài, bấm Login hai lần liền, nút Back sau khi đăng xuất, hai tab đăng nhập hai vai trò khác nhau, remember-me rồi đổi mật khẩu. Ghi lại: đã thử gì, chuyện gì xảy ra, câu hỏi, lỗi.</p>
<h3>Hai defect report (định dạng Chương 7)</h3>
<table>
<thead><tr><th>Trường</th><th>D-01</th><th>D-02</th></tr></thead>
<tbody>
<tr><td>Tiêu đề</td><td>Đăng nhập Admin bị chuyển về lại trang đăng nhập</td><td>Quên mật khẩu không bao giờ gửi link cho tài khoản nhân viên</td></tr>
<tr><td>Môi trường</td><td>Tomcat 10.1, Chrome 128, bản build ngày 11/09</td><td>như trên</td></tr>
<tr><td>Các bước</td><td>1 mở /login?service=loginUser · 2 nhập email Admin và mật khẩu đúng · 3 bấm Login</td><td>1 mở Quên mật khẩu · 2 nhập email của một Staff · 3 gửi</td></tr>
<tr><td>Mong đợi</td><td>mở trang quản trị</td><td>"Password reset link has been sent…" và có email tới</td></tr>
<tr><td>Thực tế</td><td>lại hiện login-register.jsp, không báo lỗi</td><td>"No account found with the given input."; log server có SQLException "Invalid column name 'password'"</td></tr>
<tr><td>Severity / priority</td><td>Major / High (admin bị chặn)</td><td>Major / Medium (tạm thời: admin đặt lại hộ)</td></tr>
<tr><td>Nguyên nhân khả dĩ</td><td>nhánh case "Admin" chuyển về trang login (LoginServlet)</td><td>UsersDAO.getUserByEmailOrPhone đọc cột "password" thay vì "passwordHash"</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quét bí mật (secret scanning).</b> Lỗi số 1 lẽ ra đã bị bắt tự động: các công cụ như gitleaks, TruffleHog hay GitHub secret scanning chạy như một bước phân tích tĩnh trong CI và chặn commit chứa chuỗi trông giống secret OAuth hay mật khẩu. Thêm một bước như vậy vào pipeline chỉ mất năm phút mà ngăn được loại rò rỉ đắt giá nhất. <em>Ngoài giáo trình vì ví dụ phân tích tĩnh của CTFL chỉ dừng ở chuẩn code và độ phức tạp.</em></div>`),
  ].join('\n'),
};

export default {
  title: 'Practice project — test a real web app (MystBloom)|||Dự án luyện tập — kiểm thử một web app thật (MystBloom)',
  description: 'Dùng project MystBloom trong 03.Temp làm đối tượng test: review code (17 lỗi thật), EP/BVA + decision table cho đăng ký/đăng nhập, integration test, charter khám phá và defect report.',
  lessons: [L1, L2, L3, L4],
};
