/**
 * PRJ302 — Java Web Application Development. Giáo trình FLM. Không slide gốc →
 * soạn từ syllabus (Servlet, JSP, JDBC, session, MVC, JPA, AI) + kiến thức, song
 * ngữ, code Java/JSP thật, kèm BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code: KHÔNG backtick; JSP EL ${...} phải viết \${ ; "\n" trong code viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('prj302-0-1-overview', 'Course overview: Java Web Application Development|||Tổng quan môn: Phát triển ứng dụng Java web',
  'Mục tiêu, 9 CLO (cấu trúc & deploy web; Servlet; JDBC; JSP; session/cookie; MVC; front+back-end; JPA; AI), lộ trình, đánh giá.',
  [[
    `<span class="eyebrow">PRJ302 · Lesson 0.1 · Overview</span>
<h2>Java Web Application Development</h2>
<p class="lead">Build server-side web applications in Java the classic way: <strong>Servlets</strong> handle requests, <strong>JSP</strong> renders pages, <strong>JDBC</strong> talks to the database, and the <strong>MVC</strong> pattern ties them together — plus <strong>JPA</strong> and using <strong>AI</strong> in development.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — web application structure &amp; deployment</li>
<li><strong>CLO2</strong> — the basic features of a Java web app (Servlet)</li>
<li><strong>CLO3</strong> — JDBC (database access)</li>
<li><strong>CLO4</strong> — JSP (and its languages: EL, JSTL)</li>
<li><strong>CLO5</strong> — server-side objects (session, cookie, context)</li>
<li><strong>CLO6</strong> — the MVC architecture</li>
<li><strong>CLO7</strong> — combining front-end &amp; back-end</li>
<li><strong>CLO8</strong> — JPA in a Java web app</li>
<li><strong>CLO9</strong> — using AI in a Java web app</li>
</ul>
<h3>How a Java web app runs</h3>
<p>A servlet container (Tomcat) receives HTTP requests, routes them to your <strong>Servlet</strong> classes, which produce a response — often by forwarding to a <strong>JSP</strong> that renders HTML. The app is packaged as a <strong>WAR</strong> and deployed to the container. Prerequisites: Java (PRO192) and SQL (DBI202).</p>`,
    `<span class="eyebrow">PRJ302 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển ứng dụng Java web</h2>
<p class="lead">Xây ứng dụng web phía server bằng Java theo cách kinh điển: <strong>Servlet</strong> xử lý request, <strong>JSP</strong> render trang, <strong>JDBC</strong> nói chuyện với database, và mẫu <strong>MVC</strong> gắn chúng lại — cộng <strong>JPA</strong> và dùng <strong>AI</strong> khi phát triển.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — cấu trúc &amp; triển khai ứng dụng web</li>
<li><strong>CLO2</strong> — tính năng cơ bản của Java web app (Servlet)</li>
<li><strong>CLO3</strong> — JDBC (truy cập database)</li>
<li><strong>CLO4</strong> — JSP (và các ngôn ngữ trong nó: EL, JSTL)</li>
<li><strong>CLO5</strong> — đối tượng phía server (session, cookie, context)</li>
<li><strong>CLO6</strong> — kiến trúc MVC</li>
<li><strong>CLO7</strong> — kết hợp front-end &amp; back-end</li>
<li><strong>CLO8</strong> — JPA trong Java web app</li>
<li><strong>CLO9</strong> — dùng AI trong Java web app</li>
</ul>
<h3>Java web app chạy thế nào</h3>
<p>Một servlet container (Tomcat) nhận request HTTP, định tuyến tới các class <strong>Servlet</strong>, chúng tạo phản hồi — thường bằng cách forward tới một <strong>JSP</strong> render HTML. App đóng gói thành <strong>WAR</strong> và triển khai lên container. Tiên quyết: Java (PRO192) và SQL (DBI202).</p>`,
  ]]);

const c1 = doc('prj302-1-1-servlet', '1.1 — Servlets & the request/response cycle|||1.1 — Servlet & vòng request/response',
  'HTTP request/response, HttpServlet (doGet/doPost), đọc tham số (getParameter), ghi phản hồi, web.xml/@WebServlet, và deploy WAR lên Tomcat.',
  [[
    `<span class="eyebrow">PRJ302 · Chapter 1 · Lesson 1.1</span>
<h2>Servlets</h2>
<p class="lead">A <strong>Servlet</strong> is a Java class that handles HTTP requests. Extend <code>HttpServlet</code> and override <code>doGet</code>/<code>doPost</code>; the container calls them with a request and a response object.</p>
<pre><code class="language-java">@WebServlet("/hello")                    // maps URL /hello to this servlet
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");     // ?name=An
        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().println("&lt;h1&gt;Hello " + name + "&lt;/h1&gt;");
    }
}
</code></pre>
<p><code>req.getParameter</code> reads form/query values; <code>resp.getWriter()</code> writes the body. Map servlets with the <code>@WebServlet</code> annotation (or <code>web.xml</code>). The app is packaged as a <strong>WAR</strong> and dropped into Tomcat's <code>webapps/</code>. Typical flow: browser → Tomcat → servlet → response.</p>`,
    `<span class="eyebrow">PRJ302 · Chương 1 · Bài 1.1</span>
<h2>Servlet</h2>
<p class="lead">Một <strong>Servlet</strong> là class Java xử lý request HTTP. Kế thừa <code>HttpServlet</code> và override <code>doGet</code>/<code>doPost</code>; container gọi chúng với một object request và response.</p>
<pre><code class="language-java">@WebServlet("/hello")                    // map URL /hello tới servlet này
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");     // ?name=An
        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().println("&lt;h1&gt;Hello " + name + "&lt;/h1&gt;");
    }
}
</code></pre>
<p><code>req.getParameter</code> đọc giá trị form/query; <code>resp.getWriter()</code> ghi body. Map servlet bằng annotation <code>@WebServlet</code> (hoặc <code>web.xml</code>). App đóng gói thành <strong>WAR</strong> và bỏ vào <code>webapps/</code> của Tomcat. Luồng điển hình: trình duyệt → Tomcat → servlet → phản hồi.</p>`,
  ]]);

const c1q = quiz('prj302-quiz-1', 'Quiz 1 — Servlets|||Quiz 1 — Servlet', [
  { id: 'q1', question: 'Servlet xử lý form POST bằng phương thức nào?', options: ['doGet', 'doPost', 'service only', 'main'], correctIndex: 1, explanation: 'doPost xử lý POST; doGet xử lý GET.' },
  { id: 'q2', question: 'req.getParameter("name") đọc gì?', options: ['Header', 'Giá trị form/query "name"', 'Cookie', 'Session'], correctIndex: 1, explanation: 'getParameter đọc tham số form/query của request.' },
  { id: 'q3', question: 'Java web app đóng gói thành file gì để deploy?', options: ['JAR', 'WAR', 'ZIP', 'EXE'], correctIndex: 1, explanation: 'WAR (Web ARchive) triển khai lên servlet container.' },
]);

const c2 = doc('prj302-2-1-jsp', '2.1 — JSP, EL & JSTL|||2.1 — JSP, EL & JSTL',
  'JSP render HTML động, EL (${...}) đọc dữ liệu, JSTL (c:forEach/c:if) thay scriptlet, và forward từ Servlet sang JSP (mô hình view).',
  [[
    `<span class="eyebrow">PRJ302 · Chapter 2 · Lesson 2.1</span>
<h2>JSP, EL &amp; JSTL</h2>
<p class="lead"><strong>JSP</strong> (JavaServer Pages) is HTML with dynamic parts. Modern JSP avoids raw Java scriptlets (<code>&lt;% ... %&gt;</code>) in favor of <strong>EL</strong> (Expression Language) and <strong>JSTL</strong> (tag library).</p>
<pre><code class="language-html">&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;table&gt;
  &lt;c:forEach var="p" items="\${products}"&gt;
    &lt;tr&gt;
      &lt;td&gt;\${p.name}&lt;/td&gt;
      &lt;td&gt;\${p.price}&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;c:if test="\${empty products}"&gt;No products.&lt;/c:if&gt;
</code></pre>
<p><strong>EL</strong> <code>\${...}</code> reads request/session attributes and bean properties. <strong>JSTL</strong> tags (<code>c:forEach</code>, <code>c:if</code>, <code>c:choose</code>) handle loops/conditions declaratively. The servlet sets data and forwards to the JSP:</p>
<pre><code class="language-java">req.setAttribute("products", productList);
req.getRequestDispatcher("/products.jsp").forward(req, resp);
</code></pre>`,
    `<span class="eyebrow">PRJ302 · Chương 2 · Bài 2.1</span>
<h2>JSP, EL &amp; JSTL</h2>
<p class="lead"><strong>JSP</strong> (JavaServer Pages) là HTML với phần động. JSP hiện đại tránh scriptlet Java thô (<code>&lt;% ... %&gt;</code>) mà dùng <strong>EL</strong> (Expression Language) và <strong>JSTL</strong> (thư viện tag).</p>
<pre><code class="language-html">&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;table&gt;
  &lt;c:forEach var="p" items="\${products}"&gt;
    &lt;tr&gt;
      &lt;td&gt;\${p.name}&lt;/td&gt;
      &lt;td&gt;\${p.price}&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;c:if test="\${empty products}"&gt;Không có sản phẩm.&lt;/c:if&gt;
</code></pre>
<p><strong>EL</strong> <code>\${...}</code> đọc attribute request/session và property của bean. Tag <strong>JSTL</strong> (<code>c:forEach</code>, <code>c:if</code>, <code>c:choose</code>) xử lý lặp/điều kiện khai báo. Servlet đặt dữ liệu và forward sang JSP:</p>
<pre><code class="language-java">req.setAttribute("products", productList);
req.getRequestDispatcher("/products.jsp").forward(req, resp);
</code></pre>`,
  ]]);

const c2q = quiz('prj302-quiz-2', 'Quiz 2 — JSP|||Quiz 2 — JSP', [
  { id: 'q1', question: 'EL ${products} đọc gì?', options: ['Chỉ biến cục bộ', 'Attribute (request/session) & property bean', 'File cấu hình', 'Header HTTP'], correctIndex: 1, explanation: 'EL đọc attribute và property JavaBean.' },
  { id: 'q2', question: 'Thẻ JSTL nào lặp qua danh sách?', options: ['c:if', 'c:forEach', 'c:set', 'c:out'], correctIndex: 1, explanation: 'c:forEach lặp qua collection.' },
  { id: 'q3', question: 'Servlet chuyển dữ liệu sang JSP bằng?', options: ['getParameter', 'setAttribute + forward', 'sendRedirect', 'getWriter'], correctIndex: 1, explanation: 'setAttribute đặt dữ liệu, RequestDispatcher.forward tới JSP.' },
]);

const c3 = doc('prj302-3-1-jdbc-session', '3.1 — JDBC & session management|||3.1 — JDBC & quản lý session',
  'JDBC (Connection/PreparedStatement/ResultSet, chống SQL injection), và server-side state: session (HttpSession) & cookie cho đăng nhập/giỏ hàng.',
  [[
    `<span class="eyebrow">PRJ302 · Chapter 3 · Lesson 3.1</span>
<h2>JDBC &amp; session</h2>
<h3>JDBC — database from Java</h3>
<pre><code class="language-java">try (Connection con = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = con.prepareStatement(
         "SELECT id, name FROM product WHERE price &lt; ?")) {
    ps.setDouble(1, 200000);              // parameter → no SQL injection
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next())
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
    }
}
</code></pre>
<p>Use <strong>PreparedStatement</strong> with <code>?</code> parameters — never string-concatenate user input into SQL (injection!). <code>try-with-resources</code> closes the connection automatically.</p>
<h3>Session &amp; cookies</h3>
<p>HTTP is stateless; to remember a logged-in user or a cart, use a <strong>session</strong>:</p>
<pre><code class="language-java">HttpSession session = req.getSession();
session.setAttribute("user", user);       // store per-user
User u = (User) session.getAttribute("user");   // read later
</code></pre>
<p>The server keeps session data keyed by a session id stored in a <strong>cookie</strong>. Use sessions for login state; cookies for small client-side data (preferences).</p>`,
    `<span class="eyebrow">PRJ302 · Chương 3 · Bài 3.1</span>
<h2>JDBC &amp; session</h2>
<h3>JDBC — database từ Java</h3>
<pre><code class="language-java">try (Connection con = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = con.prepareStatement(
         "SELECT id, name FROM product WHERE price &lt; ?")) {
    ps.setDouble(1, 200000);              // tham số → chống SQL injection
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next())
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
    }
}
</code></pre>
<p>Dùng <strong>PreparedStatement</strong> với tham số <code>?</code> — đừng bao giờ ghép chuỗi input người dùng vào SQL (injection!). <code>try-with-resources</code> đóng connection tự động.</p>
<h3>Session &amp; cookie</h3>
<p>HTTP không trạng thái; để nhớ người dùng đã đăng nhập hay giỏ hàng, dùng <strong>session</strong>:</p>
<pre><code class="language-java">HttpSession session = req.getSession();
session.setAttribute("user", user);       // lưu theo người dùng
User u = (User) session.getAttribute("user");   // đọc lại sau
</code></pre>
<p>Server giữ dữ liệu session theo một session id lưu trong <strong>cookie</strong>. Dùng session cho trạng thái đăng nhập; cookie cho dữ liệu nhỏ phía client (tuỳ chọn).</p>`,
  ]]);

const c3e = doc('prj302-3-2-exercise', 'Exercise 1 — a login check|||Bài tập 1 — kiểm tra đăng nhập',
  'Bài tập: viết doPost xác thực user qua JDBC (PreparedStatement) và lưu session khi đúng; kèm lời giải.',
  [[
    `<span class="eyebrow">PRJ302 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — a safe login servlet</h2>
<div class="callout"><span class="badge">Đề</span> Write <code>doPost</code> that reads username/password, checks them against the DB with a PreparedStatement, stores the user in the session on success, and forwards to the right page.</div>
<h3>Worked solution</h3>
<pre><code class="language-java">protected void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
    String u = req.getParameter("username");
    String p = req.getParameter("password");
    try (Connection con = DriverManager.getConnection(url, dbUser, dbPass);
         PreparedStatement ps = con.prepareStatement(
             "SELECT id FROM users WHERE username=? AND password=?")) {
        ps.setString(1, u);
        ps.setString(2, p);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {                       // credentials match
                req.getSession().setAttribute("user", u);
                resp.sendRedirect("home.jsp");
            } else {
                req.setAttribute("error", "Invalid login");
                req.getRequestDispatcher("login.jsp").forward(req, resp);
            }
        }
    } catch (SQLException e) { throw new ServletException(e); }
}
</code></pre>
<p><strong>Why:</strong> the PreparedStatement with <code>?</code> parameters blocks SQL injection on the login form (a classic attack target); a match stores the user in the session so later requests know who's logged in; a mismatch re-shows the form with an error.</p>`,
    `<span class="eyebrow">PRJ302 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — servlet đăng nhập an toàn</h2>
<div class="callout"><span class="badge">Đề</span> Viết <code>doPost</code> đọc username/password, kiểm với DB bằng PreparedStatement, lưu user vào session khi đúng, và forward tới trang phù hợp.</div>
<h3>Lời giải</h3>
<pre><code class="language-java">protected void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
    String u = req.getParameter("username");
    String p = req.getParameter("password");
    try (Connection con = DriverManager.getConnection(url, dbUser, dbPass);
         PreparedStatement ps = con.prepareStatement(
             "SELECT id FROM users WHERE username=? AND password=?")) {
        ps.setString(1, u);
        ps.setString(2, p);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {                       // khớp thông tin
                req.getSession().setAttribute("user", u);
                resp.sendRedirect("home.jsp");
            } else {
                req.setAttribute("error", "Sai đăng nhập");
                req.getRequestDispatcher("login.jsp").forward(req, resp);
            }
        }
    } catch (SQLException e) { throw new ServletException(e); }
}
</code></pre>
<p><strong>Vì sao:</strong> PreparedStatement với tham số <code>?</code> chặn SQL injection trên form đăng nhập (đích tấn công kinh điển); khớp thì lưu user vào session để request sau biết ai đăng nhập; sai thì hiện lại form kèm lỗi.</p>`,
  ]]);

const c3q = quiz('prj302-quiz-3', 'Quiz 3 — JDBC & session|||Quiz 3 — JDBC & session', [
  { id: 'q1', question: 'Chống SQL injection trong JDBC dùng?', options: ['Statement + ghép chuỗi', 'PreparedStatement với tham số ?', 'try/catch', 'ResultSet'], correctIndex: 1, explanation: 'PreparedStatement tham số hoá tách dữ liệu khỏi câu lệnh.' },
  { id: 'q2', question: 'Lưu trạng thái đăng nhập giữa các request dùng?', options: ['getParameter', 'HttpSession (setAttribute)', 'getWriter', 'PreparedStatement'], correctIndex: 1, explanation: 'Session giữ dữ liệu theo người dùng qua các request.' },
  { id: 'q3', question: 'Session id thường được lưu ở đâu phía client?', options: ['Trong URL luôn', 'Cookie', 'Database', 'File'], correctIndex: 1, explanation: 'Server gửi session id qua cookie để nhận diện phiên.' },
]);

const c4 = doc('prj302-4-1-mvc-jpa', '4.1 — MVC architecture, JPA & AI|||4.1 — Kiến trúc MVC, JPA & AI',
  'Mẫu MVC trong Java web (Servlet=controller, JSP=view, model/DAO), luồng request; JPA thay JDBC thủ công; và dùng AI khi phát triển.',
  [[
    `<span class="eyebrow">PRJ302 · Chapter 4 · Lesson 4.1</span>
<h2>MVC, JPA &amp; AI</h2>
<h3>The MVC pattern in Java web</h3>
<p>Don't put SQL and HTML in one servlet. Split responsibilities:</p>
<ul>
<li><strong>Model</strong> — plain Java objects + a <strong>DAO</strong> (data access) for the database.</li>
<li><strong>View</strong> — JSP pages (no business logic).</li>
<li><strong>Controller</strong> — a Servlet: read input, call the model, set attributes, forward to a view.</li>
</ul>
<pre><code class="language-java">// Controller
protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
    List&lt;Product&gt; list = productDAO.findAll();     // model
    req.setAttribute("products", list);
    req.getRequestDispatcher("/products.jsp").forward(req, resp);  // view
}
</code></pre>
<h3>JPA</h3>
<p><strong>JPA</strong> (Hibernate) replaces hand-written JDBC/DAO with entity mapping (<code>@Entity</code>, repositories) — the same ORM idea as HSF302/EF Core, less boilerplate.</p>
<h3>Using AI</h3>
<p>Use AI assistants to scaffold servlets/JSP, generate DAO methods, write JSTL, and explain errors — but <strong>review, test and secure</strong> the output (especially SQL and auth). You own the correctness and security of what you ship.</p>`,
    `<span class="eyebrow">PRJ302 · Chương 4 · Bài 4.1</span>
<h2>MVC, JPA &amp; AI</h2>
<h3>Mẫu MVC trong Java web</h3>
<p>Đừng nhét SQL và HTML vào một servlet. Tách trách nhiệm:</p>
<ul>
<li><strong>Model</strong> — object Java thuần + một <strong>DAO</strong> (truy cập dữ liệu) cho database.</li>
<li><strong>View</strong> — trang JSP (không logic nghiệp vụ).</li>
<li><strong>Controller</strong> — một Servlet: đọc input, gọi model, đặt attribute, forward tới view.</li>
</ul>
<pre><code class="language-java">// Controller
protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
    List&lt;Product&gt; list = productDAO.findAll();     // model
    req.setAttribute("products", list);
    req.getRequestDispatcher("/products.jsp").forward(req, resp);  // view
}
</code></pre>
<h3>JPA</h3>
<p><strong>JPA</strong> (Hibernate) thay JDBC/DAO viết tay bằng ánh xạ entity (<code>@Entity</code>, repository) — cùng ý ORM như HSF302/EF Core, ít boilerplate.</p>
<h3>Dùng AI</h3>
<p>Dùng trợ lý AI để scaffold servlet/JSP, sinh method DAO, viết JSTL, và giải thích lỗi — nhưng <strong>review, test và bảo mật</strong> output (nhất là SQL và auth). Bạn chịu trách nhiệm đúng/sai và bảo mật của cái bạn ship.</p>`,
  ]]);

const c4q = quiz('prj302-quiz-4', 'Quiz 4 — MVC & JPA|||Quiz 4 — MVC & JPA', [
  { id: 'q1', question: 'Trong MVC Java web, Servlet đóng vai?', options: ['View', 'Controller', 'Model', 'Database'], correctIndex: 1, explanation: 'Servlet là Controller: nhận input, gọi model, chọn view.' },
  { id: 'q2', question: 'JSP nên chứa?', options: ['SQL & logic nghiệp vụ', 'Chủ yếu hiển thị (view), ít logic', 'Kết nối DB', 'Xử lý POST'], correctIndex: 1, explanation: 'View chỉ hiển thị; logic nằm ở controller/model.' },
  { id: 'q3', question: 'JPA thay thế gì?', options: ['JSP', 'JDBC/DAO viết tay (ánh xạ entity, ít boilerplate)', 'Servlet', 'Tomcat'], correctIndex: 1, explanation: 'JPA/ORM giảm code JDBC thủ công.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PRJ302',
    slug: 'prj302-java-web-application-development',
    title: 'Java Web Application Development',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRJ302.webp',
    shortDescription: 'Server-side Java web — Servlets, JSP/EL/JSTL, JDBC, sessions, the MVC pattern, JPA and using AI. Bilingual, with Java/JSP code & exercises.|||Java web phía server — Servlet, JSP/EL/JSTL, JDBC, session, mẫu MVC, JPA và dùng AI. Song ngữ, code Java/JSP & bài tập.',
    description: 'Môn <strong>PRJ302 — Phát triển ứng dụng Java web</strong> (ngành Kỹ thuật phần mềm, kỳ 4). Xây web phía server bằng Java: <strong>Servlet</strong> (request/response, deploy WAR) → <strong>JSP/EL/JSTL</strong> (view) → <strong>JDBC</strong> (database, chống SQL injection) → <strong>session &amp; cookie</strong> → <strong>MVC</strong> (Servlet controller + JSP view + DAO model) → <strong>JPA</strong> và dùng <strong>AI</strong> khi phát triển. Bám giáo trình FLM (9 CLO), song ngữ, code Java/JSP chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'Cấu trúc web app & deploy (Tomcat, WAR); Servlet (HttpServlet, doGet/doPost, @WebServlet); JSP + EL (${...}) + JSTL (c:forEach/c:if); JDBC (PreparedStatement/ResultSet, chống injection); session (HttpSession) & cookie; kiến trúc MVC (controller/view/model/DAO); JPA (ánh xạ entity); dùng AI có trách nhiệm.',
    requirements: 'Đã học Java (PRO192) và SQL/CSDL (DBI202). Cần JDK, Apache Tomcat, một IDE (IntelliJ/Eclipse/NetBeans) và một database (MySQL).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Java web chạy thế nào, 9 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Servlet|||Chapter 1 — Servlets', description: 'Request/response, doGet/doPost, deploy.', lessons: [c1, c1q] },
    { title: 'Chương 2 — JSP, EL & JSTL|||Chapter 2 — JSP, EL & JSTL', description: 'View động, EL, JSTL, forward.', lessons: [c2, c2q] },
    { title: 'Chương 3 — JDBC & session|||Chapter 3 — JDBC & session', description: 'PreparedStatement, session/cookie.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — MVC, JPA & AI|||Chapter 4 — MVC, JPA & AI', description: 'Kiến trúc MVC, JPA, dùng AI.', lessons: [c4, c4q] },
  ],
};
